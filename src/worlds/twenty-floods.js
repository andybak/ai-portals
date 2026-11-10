import*as t from"three";import{makePath as dt,clamp as G0,lerp as i0,smoothstep as Z}from"../kit/core.js";import*as j0 from"../kit/fauna.js";import{makeDustDevil as vt}from"../kit/fx.js";import{buildHero as mt}from"../parts/twenty-floods.js";const gt=["#6FB4E0","#F6EFE0","#D9A95B","#8C5A32","#2FA36B","#4B3A7A","#FFD25A"],yt=360,ye=3.4,xt=2.7,W0=[220,30,-700],re=1.15,wt=(146*re).toFixed(2),tt=-.68,xe=-.95,y0=Math.PI*2,at=-38,ce=Math.PI/4+.33,bt=Math.cos(ce).toFixed(6),zt=Math.sin(ce).toFixed(6),L0=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uFogCol, uShDir;
uniform vec3 uSunTrue, uZen, uHor, uGlow, uCloudLit, uCloudShade, uDiscCol;
uniform float uFogDen, uSink, uTime, uYear, uLapse, uTownX, uPalmH, uShadow, uAvGap;
uniform vec4 uPyr;       // great pyramid: x, z, half base, built height
uniform vec4 uSm[3];     // small pyramids: x, z, half base, height (0 = absent)
uniform vec4 uCloud;     // offset x, offset y, stretch, coverage
const float PC = ${bt}, PS = ${zt}, PH = ${wt}, HS = ${re.toFixed(3)}, AVO = ${at.toFixed(1)};
float h21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm3(vec2 p){ return vn(p)*0.55 + vn(p*2.07 + 7.1)*0.28 + vn(p*4.3 + 3.3)*0.17; }
float sinkAt(vec2 p){ return uSink*smoothstep(-405.0, -345.0, p.y); }
float waterDist(vec2 p){
  float dc = max(abs(p.x) - 7.0, -(p.y + 238.0));
  vec2 q = abs(p - vec2(0.0, -300.0)) - vec2(80.0, 60.0);
  float db = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  float dg = max(abs(p.x) - 7.0, abs(p.y + 368.0) - 10.0);
  return min(min(dc, db), dg);
}
// two hamlets on low mounds on the left bank (the right bank stays open towards the pyramid): islands when the flood is up
float hamletAt(vec2 p){
  const float hx = -24.0;
  vec2 a = (p - vec2(hx, -44.0))/vec2(11.0, 24.0), b = (p - vec2(hx, -152.0))/vec2(11.0, 26.0);
  return max(smoothstep(1.25, 0.5, length(a)), smoothstep(1.25, 0.5, length(b)));
}
float landH(vec2 p){
  float dw = waterDist(p);
  float quay = smoothstep(-226.0, -246.0, p.y);
  float top = mix(2.2, 3.2, quay);
  float field = 1.2 + 0.22*sin(p.x*0.021 + 1.3)*sin(p.y*0.017 + 0.4);
  vec2 tq = (p - vec2(uTownX, -172.0))/vec2(64.0, 128.0);
  field += 2.3*smoothstep(1.2, 0.55, length(tq));
  field += 2.5*hamletAt(p);
  float edge = mix(1.5, 0.45, quay);
  float h = mix(-3.0, top, smoothstep(-edge, edge, dw));
  h = mix(h, field, smoothstep(5.0 + quay*9.0, 13.0 + quay*13.0, dw));
  if (p.y < -360.0) {
    float n1 = vn(p*0.012), n2 = vn(p*0.045);
    float ext = 46.0*smoothstep(110.0, 205.0, p.x)*smoothstep(520.0, 340.0, p.x);
    float s = smoothstep(-405.0, -462.0 - ext, p.y + (n1 - 0.5)*40.0*(1.0 - ext/60.0) + (n2 - 0.5)*10.0);
    float pl = 30.0 + (n2 - 0.5)*1.2*smoothstep(240.0, 420.0, length(p - uPyr.xy));
    pl += smoothstep(-1150.0, -2000.0, p.y)*(30.0 + 110.0*vn(p*0.0016 + 3.0));
    float sc = mix(h, pl, s*s*(3.0 - 2.0*s));
    float ramp = mix(3.2, 30.0, clamp((-378.0 - p.y)/88.0, 0.0, 1.0));
    float cw = smoothstep(12.0, 8.0, abs(p.x))*smoothstep(-374.0, -382.0, p.y);
    h = mix(sc, min(sc, ramp) , cw);
  }
  return h;
}
// ray against a square pyramid turned 45 degrees (convex: 4 faces + the working top)
float pyrHit(vec3 o, vec3 d, vec4 py, float baseY, float fullH){
  vec3 q = o - vec3(py.x, baseY, py.y);
  q = vec3(q.x*PC + q.z*PS, q.y, q.z*PC - q.x*PS);
  vec3 e = vec3(d.x*PC + d.z*PS, d.y, d.z*PC - d.x*PS);
  float w = py.z, t0 = 0.0, t1 = 1.0e5, a, b;
  a = q.x*fullH + q.y*w - w*fullH; b = e.x*fullH + e.y*w;
  if (b > 1e-5) t1 = min(t1, -a/b); else if (b < -1e-5) t0 = max(t0, -a/b); else if (a > 0.0) t1 = -1.0;
  a = -q.x*fullH + q.y*w - w*fullH; b = -e.x*fullH + e.y*w;
  if (b > 1e-5) t1 = min(t1, -a/b); else if (b < -1e-5) t0 = max(t0, -a/b); else if (a > 0.0) t1 = -1.0;
  a = q.z*fullH + q.y*w - w*fullH; b = e.z*fullH + e.y*w;
  if (b > 1e-5) t1 = min(t1, -a/b); else if (b < -1e-5) t0 = max(t0, -a/b); else if (a > 0.0) t1 = -1.0;
  a = -q.z*fullH + q.y*w - w*fullH; b = -e.z*fullH + e.y*w;
  if (b > 1e-5) t1 = min(t1, -a/b); else if (b < -1e-5) t0 = max(t0, -a/b); else if (a > 0.0) t1 = -1.0;
  a = q.y - py.w; b = e.y;
  if (b > 1e-5) t1 = min(t1, -a/b); else if (b < -1e-5) t0 = max(t0, -a/b); else if (a > 0.0) t1 = -1.0;
  return py.w > 0.5 ? smoothstep(0.0, 5.0, t1 - t0) : 0.0;
}
float pyrShadow(vec3 P){
  float s = pyrHit(P, uShDir, uPyr, 30.0, PH);
  s = max(s, pyrHit(P, uShDir, uSm[0], 30.0, uSm[0].w));
  s = max(s, pyrHit(P, uShDir, uSm[1], 30.0, uSm[1].w));
  s = max(s, pyrHit(P, uShDir, uSm[2], 30.0, uSm[2].w));
  return s;
}
// analytic shadows of the two palm rows of the avenue and the two markers at the basin mouth. A row stands at x = xr,
// one palm every gap metres counted from z = 28, between zmin and zmax
float rowShadow(vec2 p, float xr, vec2 s, float L, float gap, float zmin, float zmax){
  float sx = abs(s.x) < 0.04 ? 0.04 : s.x;
  float t = (xr - p.x)/sx;
  if (t < 0.0 || t > L*1.12) return 0.0;
  float bz = p.y + s.y*t;
  float zc = (fract((bz - 28.0)/gap + 0.5) - 0.5)*gap;
  if (bz - zc < zmin || bz - zc > zmax) return 0.0;
  float perp = abs(zc*sx);
  float trunk = smoothstep(0.42, 0.18, perp)*step(t, L*0.9);
  float crown = smoothstep(1.0, 0.35, length(vec2((t - L*0.94)/(0.28*uPalmH*max(L/uPalmH, 1.0)), perp/(0.3*uPalmH))));
  return max(trunk, crown*0.85);
}
float postShadow(vec2 p, vec2 base, vec2 s, float L, float w){
  vec2 v = base - p; float t = dot(v, s);
  if (t < 0.0 || t > L) return 0.0;
  return smoothstep(w, w*0.5, length(v - s*t));
}
float nearShadow(vec2 p){
  float hl = length(uShDir.xz);
  vec2 s = uShDir.xz/max(hl, 1e-3);
  float cot = min(hl/max(uShDir.y, 0.03), 14.0);
  float sh = max(rowShadow(p, 10.0, s, uPalmH*cot, 18.0, AVO, 34.0), rowShadow(p, -10.0, s, uPalmH*cot, 9.0, -237.0, 34.0));
  sh = max(sh, rowShadow(p, 10.0, s, uPalmH*0.62*cot, uAvGap, -237.0, AVO));     // the low palms of the open right bank, at the seeded rhythm
  sh = max(sh, postShadow(p, vec2(15.0, -241.0), s, 9.0*cot, 0.7));
  sh = max(sh, postShadow(p, vec2(-15.0, -241.0), s, 9.0*cot, 0.7));
  return sh;
}
// the two gate pylons (ray against a box a little inside the battered stone) and their four flagpoles
float boxSh(vec3 o, vec3 d, vec3 c, vec3 hb){
  vec3 dd = vec3(abs(d.x) < 0.02 ? 0.02 : d.x, max(d.y, 0.02), abs(d.z) < 0.02 ? 0.02 : d.z);
  vec3 t1 = (c - hb - o)/dd, t2 = (c + hb - o)/dd;
  vec3 lo = min(t1, t2), hi = max(t1, t2);
  float tn = max(max(lo.x, lo.y), max(lo.z, 0.0)), tf = min(min(hi.x, hi.y), hi.z);
  return smoothstep(0.0, 1.2, tf - tn);
}
float gateShadow(vec3 P){
  if (P.z > -150.0 || P.z < -400.0) return 0.0;
  float sh = max(boxSh(P, uShDir, vec3(11.6, 9.5, -364.5), vec3(3.8, 12.5, 4.1)), boxSh(P, uShDir, vec3(-11.6, 9.5, -364.5), vec3(3.8, 12.5, 4.1)));
  float hl = length(uShDir.xz);
  vec2 s = uShDir.xz/max(hl, 1e-3);
  float L = max(31.0 - P.y, 0.0)*min(hl/max(uShDir.y, 0.03), 14.0);
  sh = max(sh, postShadow(P.xz, vec2(9.3, -358.7), s, L, 0.5));
  sh = max(sh, postShadow(P.xz, vec2(13.9, -358.7), s, L, 0.5));
  sh = max(sh, postShadow(P.xz, vec2(-9.3, -358.7), s, L, 0.5));
  sh = max(sh, postShadow(P.xz, vec2(-13.9, -358.7), s, L, 0.5));
  return sh;
}
float cloudCov(vec2 uv){
  vec2 q = uv*vec2(mix(1.0, 0.34, uCloud.z), 1.0)*3.0 + uCloud.xy;
  return smoothstep(0.66 - uCloud.w*0.22, 0.86 - uCloud.w*0.22, fbm3(q) + 0.12*vn(q*5.0));
}
vec3 skyGrad(vec3 d){
  float y = clamp(d.y, 0.0, 1.0);
  vec3 c = mix(uHor, uZen, 1.0 - pow(1.0 - y, 3.2));
  vec2 dh = d.xz/max(length(d.xz), 1e-4), sh = uSunTrue.xz/max(length(uSunTrue.xz), 1e-4);
  float sa = max(dot(dh, sh), 0.0);
  c += uGlow*pow(1.0 - y, 5.0)*(0.3 + 0.7*sa*sa*sa);
  float sd = max(dot(d, uSunTrue), 0.0); sd *= sd; sd *= sd; sd *= sd;
  c += uDiscCol*(0.05*sd*sd + 0.012*sd)*smoothstep(-0.12, 0.05, uSunTrue.y);
  return c;
}
vec3 skyClouds(vec3 d){
  vec3 c = skyGrad(d);
  float y = max(d.y, 0.0);
  vec2 uv = d.xz/(y + 0.14)*0.5;
  float cv = cloudCov(uv)*smoothstep(0.1, 0.32, y);
  c = mix(c, mix(uCloudLit, uCloudShade, 0.3), cv*0.55);
  return c;
}
vec3 lit(vec3 alb, vec3 N, float sh){
  float ndl = max(dot(N, uSunDir), 0.0);
  return alb*(uSunCol*ndl*sh + mix(uGndCol, uSkyCol, N.y*0.5 + 0.5));
}
vec3 fogged(vec3 c, float dist){ float f = uFogDen*dist; return mix(uFogCol, c, exp(-f*f)); }
`,Mt=`
varying vec3 vDir;
void main(){ vDir = position; vec4 p = projectionMatrix*viewMatrix*vec4(cameraPosition + position*4500.0, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,St=L0+`
uniform vec3 uArcE, uArcT, uArcA, uPole, uPoleX, uPoleY, uMoonDir, uCometDir, uCometTail;
uniform float uPhi, uStars, uStarRot, uStarArc, uMoon, uCirrus;
uniform vec2 uComet;
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir);
  vec3 col = skyGrad(d);
  if (uStars > 0.01 && d.y > -0.02) {
    float rho = acos(clamp(dot(d, uPole), -1.0, 1.0));
    float px = dot(d, uPoleX), py = dot(d, uPoleY);
    float th = atan(py, abs(px) < 1e-5 ? 1e-5 : px);
    float ring = floor(rho*110.0), fr = fract(rho*110.0);
    float hs = h21(vec2(ring, 3.7));
    float n = 4.0 + floor(hs*7.0);
    float tt = fract((th + uStarRot)/6.2831853 + hs)*n;
    float cell = floor(tt), ft = fract(tt);
    float lenA = max(uStarArc, 0.007/max(sin(rho), 0.06))*n/6.2831853;
    float hh = h21(vec2(ring*1.7 + 0.3, cell + 5.0));
    float st = step(ft, min(lenA, 0.92))*smoothstep(0.5, 0.2, abs(fr - 0.5)*2.6)*step(0.74, hh);
    st *= mix(1.0, 1.0 - ft/max(lenA, 1e-3)*0.6, step(0.03, uStarArc));
    col += vec3(0.85, 0.9, 1.0)*st*(1.1*(hh - 0.66))*uStars*smoothstep(-0.02, 0.1, d.y);
  }
  if (uMoon > 0.01) {
    float md = dot(d, uMoonDir);
    float ang = acos(clamp(md, -1.0, 1.0));
    float disc = smoothstep(0.03, 0.024, ang);
    float mm = max(md, 0.0); mm *= mm; mm *= mm; mm *= mm; mm *= mm; mm *= mm;
    col += uMoon*(vec3(0.9, 0.94, 1.0)*(2.6*disc*(0.8 + 0.2*vn(d.xy*90.0))) + vec3(0.35, 0.45, 0.8)*(mm*mm*0.5 + mm*0.08));
  }
  if (uComet.x > 0.01) {
    vec3 v = d - uCometDir;
    float al = dot(v, uCometTail), pe = length(v - al*uCometTail);
    float tail = smoothstep(uComet.y, 0.0, al)*step(0.0, al)*exp(-pe*pe/(0.00004 + al*al*0.012));
    col += vec3(0.8, 0.9, 1.0)*uComet.x*(exp(-dot(v, v)*14000.0)*3.5 + tail*0.9);
  }
  float y = max(d.y, 0.0);
  if (d.y > 0.0) {
    vec2 uv = d.xz/(y + 0.14)*0.5;
    float cv = cloudCov(uv)*smoothstep(0.015, 0.16, y);
    float thick = cloudCov(uv + uSunTrue.xz*0.06);
    vec3 cc = mix(uCloudLit, uCloudShade, thick*0.75);
    if (uCirrus > 0.01) {
      vec2 cu = d.xz/(y + 0.3)*vec2(0.5, 2.6) + uCloud.xy*0.3;
      float ci = smoothstep(0.56, 0.82, fbm3(cu + 11.0)*0.75 + 0.25*vn(cu*vec2(2.0, 9.0)))*smoothstep(0.03, 0.3, y)*uCirrus*smoothstep(0.3, 0.6, vn(cu*0.23 + 4.0));
      col = mix(col, uCloudLit + uGlow*0.9, ci*0.42);
    }
    col = mix(col, cc, cv*mix(0.92, 0.7, uCloud.z));
  }
  // the sun: a soft white disc in the real-time ends; in the lapse a long exposure of it, one steady band along its arc
  float sdot = dot(d, uSunTrue);
  float ang = acos(clamp(sdot, -1.0, 1.0));
  float vis = smoothstep(-0.03, 0.02, d.y);
  col += uDiscCol*(smoothstep(0.034, 0.018, ang) + 0.05*exp(-ang*ang/0.01))*vis*(1.0 - uLapse);
  if (uLapse > 0.01) {
    // a crisp arc of light where the sun has been all the long exposure, and on it the bead itself, racing, with a short comet tail
    float a = dot(d, uArcE), b = dot(d, uArcT), c = dot(d, uArcA);
    float al = max(sdot, 0.0);
    float band = (exp(-c*c/0.0005)*0.55 + exp(-c*c/0.012)*0.07)*smoothstep(0.02, 0.3, d.y)*(0.2 + 0.8*al*al);
    float psi = atan(b, abs(a) < 1e-5 ? 1e-5 : a);
    float dphi = mod(uPhi - psi + 3.14159265, 6.2831853) - 3.14159265;
    float tail = smoothstep(0.24 + 0.5*uLapse, 0.0, dphi)*step(0.0, dphi)*exp(-c*c/0.0024);
    float bead = exp(-(dphi*dphi + c*c)/0.0022);
    float halo = exp(-(dphi*dphi + c*c)/0.03);
    col += uDiscCol*(band + (tail*tail*0.4 + bead*1.25 + halo*0.07)*vis)*uLapse;
  }
  col = mix(col, uFogCol, smoothstep(0.035, -0.02, d.y));
  gl_FragColor = vec4(col, 1.0);
}`,kt=L0+`
varying vec3 vP; varying vec3 vN;
void main(){
  vec2 p = position.xz;
  float h = landH(p);
  float e = 1.2;
  float hx = landH(p + vec2(e, 0.0)), hz = landH(p + vec2(0.0, e));
  vN = normalize(vec3(h - hx, e, h - hz));
  vP = vec3(p.x, h - sinkAt(p), p.y);
  gl_Position = projectionMatrix*viewMatrix*vec4(vP, 1.0);
}`,Ct=L0+`
varying vec3 vP; varying vec3 vN;
uniform float uDry;
vec3 fieldCol(vec2 p, out float wet){
  const float ca = 0.9801, sa = 0.1987;
  vec2 q = vec2(p.x*ca - p.y*sa, p.x*sa + p.y*ca)/vec2(46.0, 27.0);
  vec2 id = floor(q), f = fract(q);
  float hs = h21(id), hs2 = h21(id + 7.3);
  float off = (hs - 0.5)*0.13 + 0.035*sin(id.x*0.7 + id.y*1.3) + min(abs(p.x)/1400.0, 1.0)*0.07;
  float y = fract(uYear - off*1.1);
  float tex = vn(p*0.9), fineT = vn(p*4.7 + 2.0);
  // furrows run the length of each plot (a quarter of the plots are ploughed the other way)
  float fu = hs2 > 0.74 ? f.x*46.0 : f.y*27.0;
  float fw = clamp(1.0 - fwidth(fu)*1.3, 0.0, 1.0);
  float rows = mix(0.5, 0.5 + 0.5*sin(fu*4.4), fw);
  // basins: broader strips inside every plot (sown and watered a strip at a time), which still read where the furrows have blurred
  float fw2 = clamp(1.0 - fwidth(fu)*0.22, 0.0, 1.0);
  float basin = mix(0.5, h21(vec2(floor(fu/4.6), hs*17.0)), fw2);
  vec3 silt = vec3(0.22, 0.12, 0.055), haze = vec3(0.16, 0.25, 0.08), emer = vec3(0.06, 0.25, 0.09);
  vec3 gold = vec3(0.69, 0.4, 0.1), stub = vec3(0.6, 0.47, 0.25), dust = vec3(0.47, 0.34, 0.17);
  // the year, compressed between two long floods: silt, a haze of green, emerald, gold, cut in strips, cracked dust
  vec3 c = silt*(0.75 + 0.3*tex)*(0.86 + 0.28*rows);
  c = mix(c, mix(silt, haze, 0.25 + 0.75*rows), smoothstep(0.19, 0.25, y));
  vec3 em = mix(mix(emer, vec3(0.13, 0.25, 0.05), smoothstep(0.35, 0.9, hs2)*0.7), vec3(0.035, 0.19, 0.1), smoothstep(0.6, 1.0, hs)*0.6);   // every plot its own green
  c = mix(c, em*(0.7 + 0.34*tex + 0.2*fineT*fw)*(0.8 + 0.4*hs)*(0.8 + 0.34*rows)*(0.8 + 0.4*basin), smoothstep(0.24, 0.32, y));
  c = mix(c, gold*(0.74 + 0.3*tex + 0.16*fineT*fw)*(0.86 + 0.24*rows), smoothstep(0.37, 0.45, y));
  float strip = floor(f.y*7.0)/7.0;
  float cut = smoothstep(0.0, 0.012, y - (0.455 + 0.06*fract(strip*3.0 + hs)));
  // stubble: pale straw in close rows, with the darker earth showing between them
  vec3 stb = mix(stub*0.62, stub*1.08, mix(0.5, smoothstep(-0.2, 0.5, sin(fu*9.0)), fw*clamp(1.0 - fwidth(fu)*2.6, 0.0, 1.0)));
  c = mix(c, stb*(0.86 + 0.2*tex), cut);
  float dry = smoothstep(0.525, 0.575, y);
  float crack = smoothstep(0.035, 0.0, abs(vn(p*1.7) - 0.5))*0.5 + smoothstep(0.02, 0.0, abs(vn(p*0.45 + 9.0) - 0.5))*0.5;
  c = mix(c, dust*(0.85 + 0.25*tex)*(1.0 - 0.45*crack), dry*0.8);
  c *= 0.84 + 0.32*hs2;                                             // every plot its own value
  // plot bunds: a raised earth bank with a trodden crest, and a dark ditch at its foot
  float dd = min(min(f.x, 1.0 - f.x)*46.0, min(f.y, 1.0 - f.y)*27.0) + (tex - 0.5)*0.5;
  c = mix(c, vec3(0.1, 0.085, 0.05), 0.55*smoothstep(2.3, 1.7, dd)*smoothstep(1.1, 1.5, dd));
  c = mix(c, vec3(0.3, 0.2, 0.105)*(0.75 + 0.5*fineT), smoothstep(1.3, 1.0, dd));
  c = mix(c, vec3(0.5, 0.38, 0.22), 0.7*smoothstep(0.45, 0.25, dd));
  // irrigation ditches: a thread of standing water along one side of every plot and a feeder across it, glinting with the sky
  float dw1 = abs(f.x*46.0 - 3.4), dw2 = abs(f.y*27.0 - (8.0 + 11.0*hs));
  float aw = clamp(1.0 - fwidth(p.x + p.y)*0.5, 0.0, 1.0);
  float ditch = max(smoothstep(0.55, 0.3, dw1), smoothstep(0.34, 0.16, dw2)*step(0.4, hs2))*(1.0 - smoothstep(0.5, 0.56, y))*aw;
  float bankD = max(smoothstep(1.0, 0.55, dw1), smoothstep(0.7, 0.34, dw2)*step(0.4, hs2))*aw;
  c = mix(c, vec3(0.13, 0.09, 0.05), bankD*0.6);
  c = mix(c, (uZen*0.8 + uHor*0.25)*1.15, ditch*0.9);
  wet = (1.0 - smoothstep(0.1, 0.22, y)) + smoothstep(0.56, 0.62, y);
  return c;
}
// the scarp with the gullies and hard beds that are too fine for its mesh (shading only)
float scarpH(vec2 p, out float gul){
  float hh = landH(p);
  float m = smoothstep(4.5, 11.0, hh)*smoothstep(31.0, 25.0, hh);
  float g = abs(vn(vec2(p.x*0.105, p.y*0.03) + 4.0) - 0.5)*2.0;
  float g2 = abs(vn(vec2(p.x*0.29, p.y*0.075) + 9.0) - 0.5)*2.0;
  float led = smoothstep(0.3, 0.5, fract(hh*0.21 + vn(p*0.02)*0.8));
  gul = mix(1.0, smoothstep(0.0, 0.3, g)*(0.7 + 0.3*smoothstep(0.0, 0.3, g2)), m);
  return hh + m*((g - 0.5)*7.5 + (g2 - 0.5)*1.8 + led*1.3);
}
void main(){
  vec2 p = vP.xz;
  float h0 = landH(p), h = h0 - sinkAt(p);
  if (h < -0.03 && p.y > -420.0) discard;
  vec3 N = normalize(vN);
  float dist = length(vP - cameraPosition);
  float dw = waterDist(p), quay = smoothstep(-226.0, -246.0, p.y), wet;
  vec3 col = fieldCol(p, wet);
  float tex = vn(p*1.3), tex2 = vn(p*0.21);
  // town plinth and the hamlet mounds: trodden earth
  vec2 tq = (p - vec2(uTownX, -172.0))/vec2(64.0, 128.0);
  float trod = max(smoothstep(1.15, 0.8, length(tq)), smoothstep(0.25, 0.6, hamletAt(p)));
  col = mix(col, vec3(0.42, 0.29, 0.16)*(0.74 + 0.3*tex + 0.22*vn(p*5.0)), trod);
  // levee: a cut bank of bedded mud, a sod lip of grass breaking over it, a towpath on the crown; quay: dressed stone
  float near = smoothstep(150.0, 30.0, dist), near2 = smoothstep(70.0, 10.0, dist);
  float d6 = vn(p*6.0), d18 = vn(p*vec2(18.0, 5.0) + 3.0), d40 = vn(p*37.0 + 9.0), d7 = vn(p*7.0 + 1.7), d23 = vn(p*23.0 + 4.1);
  vec3 mud = vec3(0.31, 0.195, 0.1)*(0.6 + 0.4*tex + 0.24*d6 + near*(0.2*d18 - 0.1 + 0.16*d40 - 0.08) + near2*(0.17*d7 + 0.15*d23 - 0.16));
  float bedV = h0*2.1 + (d6 - 0.5)*0.5 + tex*0.4, bed = fract(bedV);
  float bedA = clamp(1.0 - fwidth(bedV)*0.7, 0.0, 1.0)*smoothstep(2.15, 1.7, h0);
  mud *= 1.0 + bedA*((h21(vec2(floor(bedV), 2.0)) - 0.5)*0.5 - 0.62*smoothstep(0.14, 0.0, bed));     // flood beds and the lines between them
  float rill = vn(vec2(p.y*2.6 + p.x*0.4, h0*0.35));
  mud *= 1.0 - 0.34*near*smoothstep(0.55, 0.8, rill)*smoothstep(2.1, 1.2, h0);                        // rain rills down the face
  mud = mix(mud, vec3(0.52, 0.37, 0.2), 0.34*smoothstep(0.62, 0.8, d18)*near*smoothstep(1.2, 2.0, h0));
  float season = 0.3*smoothstep(0.2, 0.6, fract(uYear + 0.75));
  float tuft = vn(vec2(p.y*1.9, p.x*0.6)), tuft2 = vn(vec2(p.y*8.0, p.x*2.5) + 5.0);
  float lip = 2.02 - 0.8*tuft - 0.3*tuft2*near;                                                        // where the sod hangs over the cut
  float gr = vn(p*0.7)*0.55 + vn(p*3.1 + 5.0)*0.3 + d18*0.15 + season;
  // near the eye the sward breaks into tussocks with a crisp, ragged edge (no soft blots), each with a dark foot
  float d5 = vn(p*5.3 + 1.0), d17 = vn(p*17.0 + 6.0);
  gr += near*(0.26*(d5 - 0.5) + 0.13*(d17 - 0.5)) + near2*0.07*(d40 - 0.5);
  float gw = mix(0.14, 0.035, near2);
  float gm = smoothstep(0.23 - gw, 0.23 + gw*0.4, gr), lipM = smoothstep(lip, lip + 0.1, h0);
  float grass = lipM*gm;
  mud *= 1.0 - 0.42*smoothstep(lip - 0.5, lip, h0)*(1.0 - grass);                                      // shadow under the lip
  mud *= 1.0 - 0.3*near*lipM*smoothstep(0.23 - gw - 0.1, 0.23 - gw, gr)*(1.0 - gm);                    // contact shadow round every tussock
  float blade = vn(vec2(p.x*31.0, p.y*7.0) + 2.0), blade2 = vn(vec2(p.x*9.0 + p.y*21.0, p.y*5.0 - p.x*3.0));
  float tus = h21(floor(p*2.3 + vec2(d6, d7)*1.5));
  vec3 gcol = mix(vec3(0.05, 0.13, 0.035), vec3(0.19, 0.26, 0.075), d6*0.6 + 0.4*d7)*(0.62 + 0.4*tex + near2*(0.6*blade - 0.3 + 0.44*blade2 - 0.22) + near*(0.36*d40 - 0.18 + 0.3*tus - 0.15));
  gcol *= 1.0 - 0.3*near*gm*(1.0 - smoothstep(0.23 + gw*0.4, 0.23 + gw*0.4 + 0.09, gr));                 // the edge of the sod is its darkest part
  gcol = mix(gcol, vec3(0.4, 0.34, 0.14)*(0.75 + 0.5*d23), (0.2 + 0.5*(0.3 - season)/0.3)*smoothstep(0.42, 0.75, vn(p*1.9 + 2.0)));
  mud = mix(mud, gcol, grass);
  float pathM = smoothstep(1.15, 0.7, abs(dw - 4.3) + (tex - 0.5)*0.8)*step(2.0, h0);
  float rut = smoothstep(0.16, 0.06, abs(abs(dw - 4.3) - 0.45));
  mud = mix(mud, vec3(0.5, 0.375, 0.215)*(0.78 + 0.22*d7 + 0.2*d23*near2)*(1.0 - 0.25*rut*near), pathM*0.85);
  vec3 stone = vec3(0.66, 0.58, 0.43)*(0.8 + 0.25*tex2 + 0.12*d6*near);
  vec2 bq = p/vec2(2.6, 1.4) + vec2(0.5*floor(p.y/1.4), 0.0);
  vec2 bj = fract(bq);
  stone *= 0.9 + 0.2*h21(floor(bq));
  stone *= 1.0 - 0.34*smoothstep(0.06, 0.02, min(bj.x, bj.y))*clamp(1.0 - fwidth(bq.y)*1.5, 0.0, 1.0);
  float bankM = 1.0 - smoothstep(9.0 + quay*10.0, 15.0 + quay*12.0, dw);
  col = mix(col, mix(mud, stone, quay), bankM*(1.0 - trod*(1.0 - smoothstep(9.0, 5.0, dw))));
  // far fields go to haze so the far bank is never one hard green line
  col = mix(col, vec3(dot(col, vec3(0.3, 0.5, 0.2)))*vec3(1.08, 1.0, 0.82), 0.62*smoothstep(45.0, 240.0, dist));
  // desert and scarp: bedded rock cut by gullies, a talus apron at its foot, sand on the plateau
  float des = smoothstep(4.5, 9.0, h0), gul = 1.0;
  float sv = h0*0.42 + vn(p*0.015)*1.6 + vn(p*0.13)*0.25, sb = fract(sv);
  float sa = clamp(1.0 - fwidth(sv)*1.4, 0.0, 1.0);
  if (des > 0.001) {
    const float e = 1.1;
    float g1, g2;
    float ha = scarpH(p, gul), hb = scarpH(p + vec2(e, 0.0), g1), hc = scarpH(p + vec2(0.0, e), g2);
    N = normalize(mix(N, normalize(vec3(ha - hb, e, ha - hc)), des));
    vec3 sand = mix(vec3(0.66, 0.47, 0.25), vec3(0.78, 0.62, 0.38), tex2)*(0.88 + 0.14*tex + 0.1*d6*near);
    vec3 rock = mix(vec3(0.69, 0.53, 0.32), vec3(0.81, 0.66, 0.43), mix(0.5, h21(vec2(floor(sv + (1.0 - gul)*0.9), 7.0)), sa*0.42))*(0.78 + 0.3*vn(vec2(p.x*0.9, p.y*0.31)) + 0.14*tex);
    vec3 rock0 = rock;
    sb = fract(sv + (1.0 - gul)*0.9);                                  // the beds sag into every gully: no ruled lines
    rock *= 1.0 + sa*(0.14*smoothstep(0.75, 1.0, sb) - 0.24*smoothstep(0.16, 0.0, sb));
    rock *= mix(0.52, 1.0, gul);
    rock *= 0.82 + 0.36*vn(vec2(p.x*0.06, p.y*0.02) + 2.0);           // buttresses catch the light, re-entrants hold shade
    float flu = vn(vec2(p.x*0.62, h0*0.07 + 3.0)), flu2 = vn(vec2(p.x*1.9 + 5.0, h0*0.16));
    rock *= 1.0 - (0.3*smoothstep(0.5, 0.82, flu) + 0.14*smoothstep(0.45, 0.8, flu2)*near)*smoothstep(8.0, 13.0, h0);   // rain flutes down the face
    rock *= 0.9 + 0.2*h21(vec2(floor(sv + (1.0 - gul)*0.9), floor(p.x*0.085 + 3.0*h21(vec2(floor(sv), 5.0)))))*sa;       // jointed beds: blocks, not ribbons
    rock = max(rock, rock0*0.74);                                      // gully, flute and joint together never go to mud
    float fanN = vn(vec2(p.x*0.034, 1.0));
    float talus = smoothstep(10.0 + 17.0*fanN*fanN + 5.0*(1.0 - gul), 6.0, h0);    // talus fans climb highest under the gullies
    vec3 scree = vec3(0.74, 0.59, 0.38)*(0.8 + 0.2*tex + 0.25*step(0.72, d7)*near)*(0.9 + 0.2*vn(vec2(p.x*0.4, h0*0.9)));
    rock = mix(rock, scree, talus*0.85);
    vec3 dcol = mix(rock, sand, smoothstep(26.5, 29.5, h0));
    dcol = mix(dcol, vec3(0.82, 0.75, 0.58), smoothstep(330.0, 170.0, length(p - uPyr.xy))*0.7*smoothstep(27.0, 29.5, h0));
    col = mix(col, dcol, des);
  }
  // wet band at the waterline and under a fresh flood
  float wlN = 0.05*vn(vec2(p.x + p.y, 0.3)*1.3);
  float wl = max(smoothstep(0.44 + wlN, 0.4 + wlN, h)*0.8, step(h, 0.16 + 0.07*vn(p*2.3 + uTime*0.25)))*step(p.y, 100.0)*(1.0 - des);   // soaked to a crisp wet line
  col = mix(col, vec3(0.6, 0.5, 0.36), 0.55*smoothstep(0.42 + wlN, 0.46 + wlN, h)*smoothstep(0.62 + wlN, 0.52 + wlN, h)*bankM*(1.0 - des));   // the pale tide mark of dried silt above it
  col *= mix(1.0, 0.36, max(wl, wet*0.45*(1.0 - des)*(1.0 - bankM)));
  col += vec3(0.5, 0.52, 0.5)*uSkyCol*smoothstep(0.1, 0.0, abs(h - 0.05))*(1.0 - des)*0.5;
  float sh = 1.0 - uShadow*max(pyrShadow(vP), max(nearShadow(p), gateShadow(vP))*(1.0 - des));
  sh *= 1.0 - 0.45*(1.0 - 0.65*des)*cloudCov(p*0.0011 + vec2(0.3, 0.7))*uShadow;
  vec3 c = lit(col, N, sh);
  c += col*(uSkyCol*0.45 + uSunCol*vec3(0.07, 0.065, 0.06))*bankM*(1.0 - quay)*(1.0 - des)*smoothstep(2.3, 1.2, h0);   // light off the water on the cut bank
  c += col*(uSunCol*vec3(0.58, 0.49, 0.35) + uGndCol*2.0 + uHor*0.12)*des*(1.0 - max(dot(N, uSunDir), 0.0))*(0.6 + 0.4*gul);   // sand-lit shade on the scarp, never mud grey
  c = mix(c, max(c, col*(uSunCol*0.64 + uSkyCol*0.6)), des);                // the cliff's own floor: pale honey even where it turns from the sun
  gl_FragColor = vec4(fogged(c, dist*(1.0 + 0.45*des*smoothstep(26.5, 20.0, h0))), 1.0);       // and the cliff sits a step back in the cream haze
}`,Pt=`
varying vec3 vP;
void main(){ vP = (modelMatrix*vec4(position, 1.0)).xyz; gl_Position = projectionMatrix*viewMatrix*vec4(vP, 1.0); }`,At=L0+`
varying vec3 vP;
uniform float uSilt, uRip, uLotus, uMirrorK, uLineY, uCapY, uRampHead, uCourseH, uDusk;
uniform vec3 uRampP[13];   // the hero's causeway + ramp polyline, in its own space
// like pyrHit, but returns where and on which face the ray enters (for the mirror image in the flood)
float pyrTrace(vec3 o, vec3 d, vec4 py, float baseY, float fullH, out vec3 nrm, out float tHit, out vec3 lp, out vec3 ln){
  vec3 q = o - vec3(py.x, baseY, py.y);
  q = vec3(q.x*PC + q.z*PS, q.y, q.z*PC - q.x*PS);
  vec3 e = vec3(d.x*PC + d.z*PS, d.y, d.z*PC - d.x*PS);
  float w = py.z, t0 = 0.0, t1 = 1.0e5, a, b, t; vec3 n = vec3(0.0, -1.0, 0.0);
  a = q.x*fullH + q.y*w - w*fullH; b = e.x*fullH + e.y*w;
  if (b > 1e-5) t1 = min(t1, -a/b); else if (b < -1e-5) { t = -a/b; if (t > t0) { t0 = t; n = vec3(fullH, w, 0.0); } } else if (a > 0.0) t1 = -1.0;
  a = -q.x*fullH + q.y*w - w*fullH; b = -e.x*fullH + e.y*w;
  if (b > 1e-5) t1 = min(t1, -a/b); else if (b < -1e-5) { t = -a/b; if (t > t0) { t0 = t; n = vec3(-fullH, w, 0.0); } } else if (a > 0.0) t1 = -1.0;
  a = q.z*fullH + q.y*w - w*fullH; b = e.z*fullH + e.y*w;
  if (b > 1e-5) t1 = min(t1, -a/b); else if (b < -1e-5) { t = -a/b; if (t > t0) { t0 = t; n = vec3(0.0, w, fullH); } } else if (a > 0.0) t1 = -1.0;
  a = -q.z*fullH + q.y*w - w*fullH; b = -e.z*fullH + e.y*w;
  if (b > 1e-5) t1 = min(t1, -a/b); else if (b < -1e-5) { t = -a/b; if (t > t0) { t0 = t; n = vec3(0.0, w, -fullH); } } else if (a > 0.0) t1 = -1.0;
  a = q.y - py.w; b = e.y;
  if (b > 1e-5) t1 = min(t1, -a/b); else if (b < -1e-5) { t = -a/b; if (t > t0) { t0 = t; n = vec3(0.0, 1.0, 0.0); } } else if (a > 0.0) t1 = -1.0;
  a = -q.y; b = -e.y;
  if (b > 1e-5) t1 = min(t1, -a/b); else if (b < -1e-5) { t = -a/b; if (t > t0) { t0 = t; n = vec3(0.0, -1.0, 0.0); } } else if (a > 0.0) t1 = -1.0;
  nrm = normalize(vec3(n.x*PC - n.z*PS, n.y, n.x*PS + n.z*PC));
  tHit = t0; lp = q + e*t0; ln = normalize(n);
  return py.w > 0.5 ? smoothstep(0.0, 3.0, t1 - t0) : 0.0;
}
// the zigzag ramp on the south face (hero space +Z), as bands of mud brick up to the working head
float rampBand(vec3 lp){
  float m = 0.0;
  for (int k = 1; k < 12; k++) {
    vec3 A = uRampP[k], B = uRampP[k + 1];
    float dx = B.x - A.x; dx = abs(dx) < 0.5 ? 0.5 : dx;
    float t = (lp.x - A.x)/dx;
    if (t < 0.0 || t > 1.0 || float(k) + t > uRampHead) continue;
    float yr = mix(A.y, B.y, t);
    float dep = min(mix(12.0, 6.0, clamp(yr/146.0, 0.0, 1.0)), yr);
    m = max(m, step(yr - dep, lp.y)*step(lp.y, yr + 0.8)*(0.75 + 0.25*step(yr - 1.6, lp.y)));
  }
  return m;
}
// returns rgb = mirror image colour, a = coverage
vec4 mirrorPyr(vec3 o, vec3 R, vec4 py, float fullH, float lineY, float capY, float dist, float great){
  vec3 pn, lp, ln; float pt;
  float ph = pyrTrace(o, R, py, 30.0, fullH, pn, pt, lp, ln);
  if (ph < 0.01) return vec4(0.0);
  if (great > 0.5) lp /= HS;
  float y = lp.y;
  float cas = step(lineY, y);
  float crs = fract(y/max(uCourseH*2.0, 0.5));
  vec3 honey = vec3(0.8, 0.5, 0.16)*(0.66 + 0.34*step(0.42, crs))*(0.8 + 0.3*vn(vec2(lp.x + lp.z, y)*0.05));
  if (ln.y > 0.9) honey = vec3(0.78, 0.66, 0.44);                       // the working top
  vec3 alb = mix(honey, vec3(0.74, 0.7, 0.6)*(0.86 + 0.14*y/146.0), cas);
  if (great > 0.5 && ln.z > abs(ln.x) && ln.y < 0.9) {
    float rb = rampBand(lp);
    alb = mix(alb, vec3(0.19, 0.095, 0.04)*(0.8 + 0.4*step(lp.y - floor(lp.y/3.0)*3.0, 1.5)), rb*0.95);
  }
  alb = mix(alb, vec3(1.0, 0.64, 0.1), step(capY, y));
  float ndl = max(dot(pn, uSunDir), 0.0), bl = ndl*ndl; bl *= bl; bl *= bl;
  vec3 c = lit(alb, pn, 1.0) + alb*uSunCol*bl*2.5*cas;
  c *= mix(1.0, mix(0.78, 1.0, smoothstep(0.08, 0.45, ndl)), cas);                 // the casing's lit and shaded faces stay two values in the water
  c *= mix(1.0, 0.75, smoothstep(0.4, 0.6, uMirrorK)*(1.0 - cas));                 // raw stone stands dark on the clear flood mirror
  return vec4(fogged(c, dist + pt), ph*(1.0 - 0.3*clamp(y/146.0, 0.0, 1.0)));      // and the image thins towards its far end
}
uniform vec3 uBow;      // barge x, z, speed factor
// one row of avenue palms mirrored in the water: x = trunk line, y = crown blot. s = the reflected ray's heading, ct = its
// cotangent, H = palm height, b0 = height of the palm's foot above the water (a drowned foot is 0)
vec2 rowMir(vec2 p, float xr, vec2 s, float H, float ct, float b0, float gap, float zmin, float zmax){
  float sx = abs(s.x) < 0.04 ? (s.x < 0.0 ? -0.04 : 0.04) : s.x;
  float t = (xr - p.x)/sx - b0*ct, L = H*ct;
  if (t < 0.0 || t > L*1.2) return vec2(0.0);
  float bz = p.y + s.y*(xr - p.x)/sx;
  float zc = (fract((bz - 28.0)/gap + 0.5) - 0.5)*gap;
  if (bz - zc < zmin || bz - zc > zmax) return vec2(0.0);
  float perp = abs(zc*sx), cw = 0.3*H;
  float trunk = smoothstep(0.5, 0.2, perp)*step(t, L*0.92);
  float crown = smoothstep(1.0, 0.45, length(vec2((t - L*0.95)/(cw*max(ct, 1.0)), perp/cw)));
  return vec2(trunk, crown);
}
// the earth bunds between the plots (the same grid the land draws)
float bundD(vec2 p){
  const float ca = 0.9801, sa = 0.1987;
  vec2 f = fract(vec2(p.x*ca - p.y*sa, p.x*sa + p.y*ca)/vec2(46.0, 27.0));
  return min(min(f.x, 1.0 - f.x)*46.0, min(f.y, 1.0 - f.y)*27.0);
}
void main(){
  vec2 p = vP.xz;
  float h = landH(p) - sinkAt(p);
  float dist = length(vP - cameraPosition);
  vec3 V = (cameraPosition - vP)/max(dist, 1e-3);
  float t = uTime;
  float att = 1.0/(1.0 + dist*0.018);
  vec2 pw = p + (vec2(vn(p*0.45 + t*0.08), vn(p*0.45 + 7.3 - t*0.08)) - 0.5)*2.2;
  vec2 n = vec2(0.8, 0.6)*cos(dot(pw, vec2(0.8, 0.6))*2.3 + t*1.9);
  n += vec2(-0.5, 0.86)*cos(dot(pw, vec2(-0.5, 0.86))*3.7 + t*2.6)*0.7;
  n += vec2(0.2, -0.98)*cos(dot(pw, vec2(0.2, -0.98))*6.1 - t*3.4)*0.5;
  n += vec2(-0.9, -0.4)*cos(dot(pw, vec2(-0.9, -0.4))*1.2 + t*1.1)*0.6;
  n *= uRip*0.42*att;
  // bow wave: a V of crests off the stem and a boil under it
  float bz = p.y - uBow.y, bx = abs(p.x - uBow.x);
  float vee = exp(-pow((bx - (0.6 + max(bz + 5.0, 0.0)*0.42))/0.5, 2.0))*smoothstep(-6.5, -4.5, bz)*exp(-max(bz + 5.0, 0.0)*0.07);
  float vee2 = exp(-pow((bx - (0.2 + max(bz + 2.0, 0.0)*0.42))/0.7, 2.0))*smoothstep(-3.5, -1.5, bz)*exp(-max(bz + 2.0, 0.0)*0.09);
  float wake = (vee + vee2*0.6)*uBow.z*(0.6 + 0.4*vn(p*2.5 + vec2(0.0, t*3.0)));
  n.x += sign(p.x - uBow.x)*wake*0.35;
  vec3 N = normalize(vec3(n.x, 1.0, n.y));
  vec3 R = reflect(-V, N); R.y = abs(R.y) + 0.002; R = normalize(R);
  // rough water mirrors the sky above the haze, not the cream horizon: lift the ray and lean to the zenith blue
  vec3 refl = skyClouds(normalize(R + vec3(0.0, 0.16, 0.0)))*vec3(0.74, 0.8, 0.88);
  refl = mix(refl, uZen*0.92, 0.44);
  // a value ramp over the sheet: deep zenith under the bow, the pale horizon haze where the water runs out at a grazing angle
  float gz = 1.0 - max(V.y, 0.0); gz *= gz; gz *= gz; gz *= gz;
  refl = mix(refl, skyGrad(normalize(vec3(R.x, R.y + 0.02, R.z)))*vec3(0.9, 0.92, 0.95), gz*(0.22 + 0.3*uMirrorK));
  refl *= 1.0 - 0.22*(1.0 - gz)*uMirrorK;
  vec3 o3 = vec3(p.x, 0.0, p.y);
  // the pyramids stand on their own reflections: traced with the ripples calmed so steps, ramp and edges stay readable
  vec3 Rm = reflect(-V, normalize(vec3(n.x*0.07, 1.0, n.y*0.22 - wake*0.1))); Rm.y = abs(Rm.y) + 0.002;
  // ... but never a cut-out: slow swells shift and stretch the image, so its edges waver
  float wz = dot(p, vec2(0.12, 1.0))*1.7 + (vn(p*0.13 + vec2(0.0, t*0.07)) - 0.5)*9.0;
  float wA = 0.004 + 0.035*uRip;
  Rm.x += wA*(sin(wz + t*1.1) + 0.5*smoothstep(60.0, 20.0, dist)*sin(wz*2.3 - t*1.7));
  Rm.y *= 1.0 + 3.0*wA*sin(wz*0.8 + t*0.9 + 1.0);
  Rm = normalize(Rm);
  vec4 mi = mirrorPyr(o3, Rm, uPyr, PH, uLineY, uCapY, dist, 1.0);
  if (mi.a < 0.5) {
    vec4 m2 = mirrorPyr(o3, Rm, uSm[0], uSm[0].w, -1.0, 1.0e4, dist, 0.0); if (m2.a > mi.a) mi = m2;
    m2 = mirrorPyr(o3, Rm, uSm[1], uSm[1].w, -1.0, 1.0e4, dist, 0.0); if (m2.a > mi.a) mi = m2;
    m2 = mirrorPyr(o3, Rm, uSm[2], uSm[2].w, -1.0, 1.0e4, dist, 0.0); if (m2.a > mi.a) mi = m2;
  }
  float streak = 0.9 + 0.1*cos(dot(pw, vec2(0.15, 1.0))*5.0 + t*1.3);     // ripple glints breaking the image
  refl = mix(refl, mi.rgb*streak, mi.a);
  float palmM = 0.0;
  if (p.y > -260.0 && p.y < 60.0 && abs(p.x) < 130.0) {     // the avenue stands on its reflection: trunk lines and crown blots, broken by the ripples
    vec2 rh = Rm.xz; float rl = max(length(rh), 1e-3); rh /= rl;
    float ct = min(rl/max(Rm.y, 0.02), 30.0), b0 = max(2.05 - uSink, 0.0);
    vec2 pp = p + n*4.0 + vec2(0.0, 0.2*sin(wz*1.3 + t));
    vec2 pm = max(rowMir(pp, 10.0, rh, uPalmH, ct, b0, 18.0, AVO, 34.0), rowMir(pp, -10.0, rh, uPalmH, ct, b0, 9.0, -237.0, 34.0));
    pm = max(pm, rowMir(pp, 10.0, rh, uPalmH*0.62, ct, b0, uAvGap, -237.0, AVO));
    palmM = max(pm.x, pm.y*(0.75 + 0.25*vn(pp*1.4)))*smoothstep(130.0, 80.0, abs(p.x));
    vec3 pc = mix(vec3(0.2, 0.15, 0.1), vec3(0.045, 0.085, 0.05), step(pm.x, pm.y*0.9));
    refl = mix(refl, fogged(lit(pc, vec3(0.0, 1.0, 0.0), 1.0), dist), palmM*(0.45 + 0.4*uMirrorK));
  }
  // the scarp is too far for a mirror copy: reflect it analytically as a lit band
  if (R.z < -0.02) {
    float tt = (-432.0 - p.y)/R.z, yh = R.y*tt;
    float m = smoothstep(31.0, 25.0, yh + vn(vec2(p.x + R.x*tt, 3.0)*0.02)*6.0)*step(0.0, tt);
    vec3 sc = lit(vec3(0.7, 0.56, 0.36), normalize(vec3(0.0, 0.7, 0.7)), 1.0) + vec3(0.7, 0.56, 0.36)*uSunCol*vec3(0.24, 0.19, 0.13);
    refl = mix(refl, fogged(sc, dist + tt)*vec3(0.8, 0.84, 0.92), m*0.5);      // broken by the ripples: half scarp, half sky
  }
  if (R.z < -0.02 && p.y > -360.0) {     // the gate pylons, their lintel and the glow of the portal between them
    float tt = (-360.0 - p.y)/R.z, yh = R.y*tt, xh = abs(p.x + R.x*tt);
    float py = step(7.4 + yh*0.016, xh)*step(xh, 15.8 - yh*0.016)*step(yh, 23.7);
    float li = step(xh, 8.2)*step(8.3, yh)*step(yh, 13.0);
    vec3 st = lit(vec3(0.66, 0.58, 0.42), vec3(0.0, 0.0, 1.0), 1.0);
    refl = mix(refl, fogged(st, dist + tt)*0.85, max(py, li)*0.92);
    float po = smoothstep(7.5, 5.0, xh)*smoothstep(8.2, 5.5, yh);
    refl = mix(refl, vec3(1.0, 0.82, 0.55)*0.95, po*0.8);
  }
  refl *= 1.0 - 0.38*uDusk;                                              // the dusk mirror never clips to white
  float fr = 0.04 + 0.96*pow(1.0 - max(dot(N, V), 0.0), 5.0);
  fr = mix(fr, 1.0, 0.28 + 0.4*uMirrorK);
  fr = max(fr, max(mi.a, palmM)*mix(0.8, 0.94, uMirrorK));
  vec3 amb = uSunCol*max(uSunDir.y, 0.0) + uSkyCol;
  float silt = uSilt*mix(1.0, 0.45, smoothstep(-225.0, -250.0, p.y));          // the basin settles clear before the canal does
  vec3 body = mix(vec3(0.025, 0.09, 0.1), vec3(0.23, 0.13, 0.062), silt)*amb;
  body = mix(body, vec3(0.3, 0.17, 0.07)*amb, smoothstep(1.3, 0.0, -h)*(0.6 - 0.4*uMirrorK));
  vec3 col = mix(body, refl, fr);
  float sdot = max(dot(R, uSunTrue), 0.0);
  float s2 = sdot*sdot; s2 *= s2; s2 *= s2; s2 *= s2; s2 *= s2;      // ^32
  float s3 = s2*s2; s3 *= s3; s3 *= s3;                              // ^256
  col += uDiscCol*(s3*s3*2.4 + s3*0.2 + s2*0.025)*smoothstep(-0.02, 0.05, uSunTrue.y)*(1.0 - 0.45*uDusk);
  // a flood never hides the land's lines: the bunds between the plots and the crown of the levee stand a hand proud of the
  // water as threads of wet earth and grass tips, so the mirror is crossed by the drowned country
  if (h < 0.0 && p.y > -236.0 && p.y < 300.0 && dist < 700.0) {
    float dwc = waterDist(p), tx = vn(p*0.9), tx2 = vn(p*2.6 + 4.0);
    float wdt = 0.5 + dist*0.007;
    float dyke = smoothstep(wdt, wdt*0.45, bundD(p) + (tx - 0.5)*0.5)*smoothstep(15.0, 20.0, dwc)*smoothstep(0.3, 0.5, vn(p*0.05 + 2.0));
    float crest = smoothstep(1.25, 0.6, abs(dwc - 4.4) + (tx - 0.5)*1.1)*smoothstep(0.16, 0.3, vn(vec2(p.y*0.06, p.x > 0.0 ? 3.0 : 9.0)));
    float em = max(dyke, crest)*smoothstep(0.02, 0.14, -h)*smoothstep(700.0, 350.0, dist);
    vec3 earth = mix(vec3(0.2, 0.13, 0.07), vec3(0.34, 0.25, 0.14), tx2*crest);
    earth = mix(earth, vec3(0.085, 0.13, 0.05)*(0.6 + 0.7*tx2), smoothstep(0.4, 0.7, vn(p*3.3 + 7.0)*0.6 + vn(p*0.7 + 2.0)*0.4)*0.7);     // grass and reed tips
    col = mix(col, lit(earth, vec3(0.0, 1.0, 0.0), 1.0), em);
  }
  col *= 1.0 - 0.6*uShadow*max(nearShadow(p), gateShadow(o3));
  // lotus pads in the last, real-time flood
  if (uLotus > 0.01 && dist < 160.0) {
    vec2 g = p/1.7, id = floor(g), f = fract(g) - 0.5;
    float hs = h21(id), hs2 = h21(id + 17.0);
    vec2 c = (vec2(hs, hs2) - 0.5)*0.5;
    float r = 0.16 + 0.2*hs2;
    float dd = length(f - c);
    float shal = max(smoothstep(2.4, 0.5, -h), smoothstep(0.5, 0.72, vn(p*0.05 + 3.0)))*smoothstep(0.05, 0.3, -h);
    float notch = step(0.25, abs(atan(f.y - c.y, f.x - c.x + 1e-4) - hs*6.0 + 3.0));
    float pad = smoothstep(r, r - 0.06, dd)*step(hs, 0.2 + 0.5*shal)*shal*notch*uLotus;
    col = mix(col, lit(vec3(0.07, 0.3, 0.1)*(0.7 + 0.6*hs2), vec3(0.0, 1.0, 0.0), 1.0) + refl*0.06, pad);
  }
  float foam = smoothstep(0.24, 0.0, -h)*(0.45 + 0.55*vn(p*3.0 + t*0.6)) + wake*0.8;
  col = mix(col, vec3(0.7, 0.66, 0.58)*amb, clamp(foam, 0.0, 1.0)*0.75);
  if (h > 0.0) col = vec3(0.15, 0.085, 0.035)*amb;
  gl_FragColor = vec4(fogged(col, dist), 1.0);
}`,qt=L0+`
attribute vec4 aI;     // x, z, base height, size
attribute vec4 aJ;     // birth year, rotation, phase, hue
attribute vec3 aW;     // u along frond, v across (-1..1), frond flag
varying vec3 vP; varying vec3 vN; varying vec3 vW; varying float vHue; varying float vS;
void main(){
  float age = uYear - aJ.x;
  float g = mix(0.16, 1.0, smoothstep(0.0, 9.0, age))*smoothstep(-0.4, 0.3, age);
  vec3 p = position;
  float ph = aJ.z*6.2831853;
  float sw = sin(uTime*1.1 + ph)*0.6 + sin(uTime*0.43 + ph*1.7)*0.4;
  p.xz += vec2(0.8, 0.45)*sw*0.05*p.y*p.y;
  float fz = max(aW.z, 0.0)*aW.x;
  p.y += fz*sin(uTime*2.6 + ph + position.x*9.0 + position.z*7.0)*0.035;
  p.xz += fz*vec2(0.8, 0.45)*(0.04 + 0.03*sin(uTime*1.9 + ph*2.0));
  float cr = cos(aJ.y), sr = sin(aJ.y);
  p = vec3(p.x*cr + p.z*sr, p.y, -p.x*sr + p.z*cr);
  vec3 nn = vec3(normal.x*cr + normal.z*sr, normal.y, -normal.x*sr + normal.z*cr);
  vec2 b = aI.xy;
  vP = vec3(b.x, aI.z - sinkAt(b), b.y) + p*aI.w*g;
  vN = nn; vW = aW; vHue = aJ.w; vS = aI.w*g;
  gl_Position = projectionMatrix*viewMatrix*vec4(vP, 1.0);
}`,Dt=L0+`
varying vec3 vP; varying vec3 vN; varying vec3 vW; varying float vHue; varying float vS;
void main(){
  vec3 N = normalize(vN); vec3 alb;
  float dist = length(vP - cameraPosition);
  vec3 V = (cameraPosition - vP)/max(dist, 1e-3);
  if (vW.z > 0.5) {
    // a feather: leaflets raked back from a pale midrib, narrow at the stalk and pointed at the tip
    float s = vW.x, v = abs(vW.y);
    float prof = smoothstep(0.0, 0.12, s)*(1.0 - s*s*s*0.9);
    float fq = 21.0, cut = fract(s*fq - v*2.6);
    float fine = clamp(1.0 - fwidth(s*fq)*0.8, 0.0, 1.0);
    float tooth = mix(0.7, 0.3 + 0.7*smoothstep(0.14, 0.4, cut)*smoothstep(1.0, 0.78, cut), fine);
    float edge = prof*tooth + 0.04 - v;
    if (edge < 0.0) discard;
    float ndl = dot(N, uSunDir), nv = dot(N, V);
    float under = step(nv*sign(ndl + 1e-4), 0.0);                                    // we are looking at the side the sun is not on
    // palette green #2FA36B pulled a third of the way to olive: never lime
    alb = mix(vec3(0.03, 0.06, 0.04), vec3(0.085, 0.14, 0.078), 0.35 + 0.65*vHue)*(0.6 + 0.5*s);
    alb = mix(alb, vec3(0.2, 0.24, 0.1), smoothstep(0.1, 0.0, v)*0.6);              // midrib
    alb *= 0.78 + 0.34*cut*fine;
    alb = mix(alb, vec3(0.36, 0.27, 0.1), smoothstep(0.7, 1.0, vHue)*0.5*step(vN.y, 0.3));   // old hanging fronds dry out
    float thru = max(dot(-V, uSunDir), 0.0); thru *= thru; thru *= thru;
    vec3 c = alb*(uSunCol*mix(abs(ndl)*0.95 + 0.08, abs(ndl)*0.34 + 0.1, under) + mix(uGndCol, uSkyCol, 0.5 + 0.4*N.y)*mix(1.0, 0.85, under));
    c += vec3(0.46, 0.52, 0.3)*alb*uSunCol*(thru*1.2 + under*(0.7*abs(ndl) + 0.2));       // sun through the leaflets
    c += alb*uSunCol*1.3*pow(1.0 - abs(nv), 3.0)*max(ndl, 0.0);                    // sun rim along the folded edge
    c += uSkyCol*0.1*pow(1.0 - abs(nv), 3.0);
    gl_FragColor = vec4(fogged(c, dist), 1.0);
    return;
  }
  // trunk: diamond scars of old leaf bases, darker towards the crown boss
  float a = vW.x*10.0, hgt = vW.y*vS*1.5;
  float d1 = abs(fract(a + hgt) - 0.5), d2 = abs(fract(a - hgt) - 0.5);
  float fine = clamp(1.0 - fwidth(hgt)*1.5, 0.0, 1.0);
  float scar = smoothstep(0.1, 0.0, min(d1, d2));
  float cell = h21(floor(vec2(a + hgt, a - hgt)));
  alb = mix(vec3(0.3, 0.215, 0.13), vec3(0.4, 0.31, 0.2), cell*fine)*(0.86 + 0.14*step(0.5, fract(hgt*0.5)));
  alb *= 1.0 - 0.5*scar*fine;
  alb = mix(alb, vec3(0.1, 0.075, 0.045), vW.z < -0.5 ? 0.85 : smoothstep(0.86, 0.99, vW.y)*0.6);
  if (vW.z < -1.5) alb = mix(vec3(0.07, 0.05, 0.06), vec3(0.5, 0.2, 0.04)*(0.6 + 0.8*vn(vP.xy*9.0 + vP.z*7.0)), clamp(dot(uSunCol, vec3(0.4)), 0.12, 1.0));          // date clusters, amber under the crown
  alb = mix(alb, vec3(0.12, 0.09, 0.05), smoothstep(0.06, 0.0, vW.y)*0.6);
  vec3 c = lit(alb, N, 1.0) + alb*uSkyCol*0.5*pow(1.0 - max(dot(N, V), 0.0), 3.0);
  gl_FragColor = vec4(fogged(c, dist), 1.0);
}`,Re=L0+`
attribute vec3 color;
attribute vec2 aM;      // ride the sinking land (0/1), surface kind
#ifdef INST
attribute vec4 aI;      // x, y, z, rotation
attribute vec4 aJ;      // sx, sy, sz, birth year
attribute vec4 aC;      // tint rgb, phase
#endif
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying vec3 vL; varying vec2 vM;
void main(){
  vec3 p = position, nn = normal; vC = color; vM = aM; vL = position;
#ifdef INST
  float grow = smoothstep(aJ.w, aJ.w + 0.7, uYear);
  #ifdef NOD
    float sp = 1.1 + 4.2*uLapse;
    float an = sin(uTime*sp + aC.w*6.2831853)*0.5 - 0.15;
    float ca = cos(an), sa = sin(an);
    p = mix(p, vec3(p.x, p.y*ca - p.z*sa, p.y*sa + p.z*ca), aM.y);
    nn = mix(nn, vec3(nn.x, nn.y*ca - nn.z*sa, nn.y*sa + nn.z*ca), aM.y);
    p.y += (1.0 - aM.y)*0.0;
  #endif
  p *= aJ.xyz*vec3(1.0, grow, 1.0);
  vL = p;
  float cr = cos(aI.w), sr = sin(aI.w);
  p = vec3(p.x*cr + p.z*sr, p.y, -p.x*sr + p.z*cr) + aI.xyz;
  nn = vec3(nn.x*cr + nn.z*sr, nn.y, -nn.x*sr + nn.z*cr);
  vC *= aC.rgb;
  if (grow < 0.002) p = vec3(0.0, -50.0, 0.0);
  p.y -= sinkAt(aI.xz);
#else
  p.y -= aM.x*sinkAt(p.xz);
#endif
  vP = p; vN = nn;
  gl_Position = projectionMatrix*viewMatrix*vec4(vP, 1.0);
}`,Ie=L0+`
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying vec3 vL; varying vec2 vM;
float rbox(vec2 p, vec2 c, vec2 h){ vec2 d = abs(p - c) - h; return step(max(d.x, d.y), 0.0); }
// one cell of a carved register (2.0 m wide, 4.8 m tall, q.x from -1 to 1): a striding figure with a staff, or a column of signs
float relief(vec2 q, float hsh){
  float m = 0.0;
  if (hsh < 0.3) {
    float gy = q.y/0.62, gi = floor(gy), gh = h21(vec2(gi, hsh*91.0));
    vec2 g = vec2(q.x, (fract(gy) - 0.5)*0.62);
    float sg = gh < 0.33 ? rbox(g, vec2(0.0), vec2(0.2, 0.09)) : gh < 0.66 ? step(length(g), 0.17) - step(length(g), 0.08) : rbox(g, vec2(0.0), vec2(0.07, 0.2)) + rbox(g, vec2(0.0, 0.13), vec2(0.2, 0.05));
    m = sg*step(0.6, q.y)*step(q.y, 4.2);
    m = max(m, (step(abs(abs(q.x) - 0.42), 0.035))*step(0.4, q.y)*step(q.y, 4.4));
  } else {
    float tall = step(0.65, hsh);
    m = rbox(q, vec2(-0.17, 1.2), vec2(0.085, 0.75)) + rbox(q, vec2(0.2, 1.2), vec2(0.085, 0.75));               // striding legs
    m = max(m, step(abs(q.x), 0.4 - (q.y - 1.75)*0.3)*step(1.75, q.y)*step(q.y, 2.35));                          // kilt
    m = max(m, step(abs(q.x), 0.2 + (q.y - 2.3)*0.17)*step(2.3, q.y)*step(q.y, 3.2));                            // torso to the shoulders
    m = max(m, step(length(q - vec2(0.05, 3.5)), 0.23));                                                           // head
    m = max(m, rbox(q, vec2(0.02, 3.95 + 0.1*tall), vec2(0.15 - 0.04*tall, 0.22 + 0.14*tall)));                   // crown
    m = max(m, rbox(q, vec2(0.68, 2.2), vec2(0.035, 1.75)));                                                       // staff
    vec2 pa = q - vec2(0.3, 3.0), ba = vec2(0.38, -0.3);
    m = max(m, step(length(pa - ba*clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0)), 0.075));                             // the arm that holds it
  }
  return clamp(m, 0.0, 1.0);
}
void main(){
  vec3 N = normalize(vN); vec3 alb = vC;
#ifdef HOUSE
  // mud-brick: a dark door, a couple of window slits, a paler roof
  float wall = step(abs(N.y), 0.5)*step(vM.y, 0.5);
  vec2 f = vec2(abs(N.x) > 0.5 ? vL.z : vL.x, vL.y);
  float door = step(abs(f.x - 0.4), 0.45)*step(f.y, 1.9);
  float win = step(abs(fract(f.x*0.45 + 0.2) - 0.5), 0.09)*step(abs(f.y - 2.3), 0.28);
  float frame = step(abs(f.x - 0.4), 0.62)*step(f.y, 2.08)*(1.0 - door);
  alb *= 1.0 + wall*0.2*frame;                                                      // limewashed door surround
  alb *= 1.0 - wall*0.78*max(door, win);
  alb = mix(alb, vec3(0.16, 0.1, 0.06), wall*step(abs(f.x - 0.4), 0.72)*step(abs(f.y - 2.05), 0.1));   // timber lintel
  alb = mix(alb, vec3(0.16, 0.1, 0.06), wall*step(abs(fract(f.x*0.45 + 0.2) - 0.5), 0.13)*step(abs(f.y - 2.64), 0.05)*0.8);
  float crs = clamp(1.0 - fwidth(vL.y)*3.0, 0.0, 1.0)*smoothstep(0.4, 0.5, abs(fract(vL.y/0.34) - 0.5));
  alb *= mix(1.0, (0.78 + 0.3*vn(vP.xz*0.9 + vP.y))*(1.0 - 0.14*crs), wall);
  alb *= mix(1.0, 0.72 + 0.28*smoothstep(0.0, 1.1, vL.y), wall);                  // damp, splashed foot of the wall
  float stain = vn(vec2(f.x*1.7 + vP.x, f.y*0.25));                               // rain streaks and patched plaster
  alb *= mix(1.0, 0.86 + 0.26*stain, wall);
  alb = mix(alb, alb*vec3(1.22, 1.16, 1.02), wall*smoothstep(0.6, 0.75, vn(vP.xz*0.35 + f.y*0.4))*0.6);
  alb = mix(alb, alb*1.25 + 0.03, step(0.5, N.y));
#else
  alb *= 0.85 + 0.25*vn(vP.xz*0.6 + vP.y*0.8);
  if (vM.y > 2.5) {            // cavetto cornice: painted leaf stripes, red, blue-green and bare stone
    float cu = (abs(N.z) > abs(N.x) ? vP.x : vP.z)/0.5, k = mod(floor(cu), 4.0);
    float aa = clamp(1.0 - fwidth(cu)*1.2, 0.0, 1.0);
    vec3 pc = k < 0.5 ? vec3(0.5, 0.13, 0.06) : k < 2.5 && k > 1.5 ? vec3(0.08, 0.27, 0.3) : alb*1.05;
    alb = mix(alb*0.92, pc*(0.8 + 0.3*vn(vP.xy*2.0 + vP.z)), 0.72*aa);
    alb *= 1.0 - 0.3*aa*smoothstep(0.38, 0.5, abs(fract(cu) - 0.5));
  } else if (vM.y > 1.5) {     // dressed masonry: block courses, sunk-relief registers, flagpole niches, cornice shadow
    float front = step(0.5, abs(N.z)), wallF = step(abs(N.y), 0.5);
    float uw = mix(vP.z, vP.x, front);
    float fine = clamp(1.0 - fwidth(vP.y)*0.7, 0.0, 1.0), fine2 = clamp(1.0 - fwidth(vP.y)*1.6, 0.0, 1.0);
    vec2 bq = vec2(uw/2.3 + 0.5*floor(vP.y/1.15), vP.y/1.15), bj = fract(bq);
    alb *= 0.93 + 0.14*h21(floor(bq))*fine;
    alb *= 1.0 - 0.22*fine*wallF*smoothstep(0.05, 0.015, min(bj.x*2.0, bj.y));
    float tower = step(7.2, abs(vP.x))*wallF;
    float reg = (vP.y - 5.4)/4.8, row = floor(reg);
    float inReg = step(0.0, reg)*step(reg, 3.0)*tower;
    vec2 rq = vec2(uw/2.0 + row*0.37, 0.0);
    float cid = floor(rq.x), hh = h21(vec2(cid, row + 3.0));
    vec2 q = vec2((fract(rq.x) - 0.5)*2.0*(vP.x > 0.0 ? -1.0 : 1.0), fract(reg)*4.8);
    float m0 = relief(q, hh), m1 = relief(q + vec2(0.03, 0.08), hh);
    alb *= 1.0 - inReg*fine2*(0.2*m0 + 0.34*clamp(m0 - m1, 0.0, 1.0) - 0.22*clamp(m1 - m0, 0.0, 1.0));
    alb *= 1.0 - 0.3*fine*tower*step(5.2, vP.y)*step(vP.y, 20.0)*smoothstep(0.035, 0.01, abs(fract(reg + 0.5) - 0.5)/1.0);
    // flagpole niches: tall slots let into the front of each tower, in shade, with a lit reveal on one side
    float nx = min(abs(abs(vP.x) - 9.3), abs(abs(vP.x) - 13.9));
    float niche = smoothstep(0.82, 0.74, nx)*step(vP.y, 20.6)*step(0.5, N.z)*tower;
    alb *= 1.0 - niche*(0.42 - 0.3*smoothstep(0.6, 0.76, nx));
    alb *= 1.0 - 0.4*smoothstep(20.4, 22.1, vP.y)*tower*step(vP.y, 22.2);
    alb *= mix(0.8, 1.0, smoothstep(2.5, 7.0, vP.y))*(0.9 + 0.16*vn(vec2(uw*0.9, vP.y*0.12)));
  }
#endif
#ifdef INST
  vec3 c = lit(alb, N, 1.0 - uShadow*pyrShadow(vP)*step(vP.y, 29.0));
  c += alb*uSunCol*vec3(0.26, 0.21, 0.16)*(1.0 - max(dot(N, uSunDir), 0.0));        // light off the pale ground: shaded walls stay earth, not black
#else
  vec3 c = lit(alb, N, 1.0 - uShadow*max(pyrShadow(vP)*step(vP.y, 29.0), gateShadow(vP)));
#endif
  c += alb*uSunCol*vec3(0.2, 0.17, 0.12)*step(1.5, vM.y)*(1.0 - max(dot(N, uSunDir), 0.0));   // warm bounce off quay and water on the shaded stone
#ifndef INST
  if (vM.y > 0.5 && vM.y < 1.5) {  // white casing: blazes when the sun strikes it square
    float ndl = max(dot(N, uSunDir), 0.0); float b = ndl*ndl; b *= b; b *= b;
    c += alb*uSunCol*b*2.2;
  }
#endif
  gl_FragColor = vec4(fogged(c, length(vP - cameraPosition)), 1.0);
}`,Lt=L0+`
attribute vec3 color;
attribute vec4 aI;      // x, z, heading, size
attribute vec4 aJ;      // phase, speed (0 = moored), seed, lane length
uniform float uGhost, uFlood;
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying float vA; varying vec3 vL;
void main(){
  vec3 p = position*aI.w, nn = normal; vL = position;
  float moving = step(0.01, aJ.y);
  p.z *= 1.0 + moving*uLapse*2.2;
  float s = fract(aJ.x + uTime*aJ.y/max(aJ.w, 1.0));
  p.z -= moving*(s - 0.5)*aJ.w;
  float roll = sin(uTime*0.9 + aJ.z*40.0)*0.03;
  p.xy += vec2(-p.y, p.x)*roll;
  p.y += sin(uTime*0.7 + aJ.z*31.0)*0.06 - 0.05;
  float cr = cos(aI.z), sr = sin(aI.z);
  p = vec3(p.x*cr + p.z*sr, p.y, -p.x*sr + p.z*cr) + vec3(aI.x, 0.0, aI.y);
  nn = vec3(nn.x*cr + nn.z*sr, nn.y, -nn.x*sr + nn.z*cr);
  float ghost = smoothstep(0.38, 0.62, vn(vec2(aJ.z*37.0, uGhost + aJ.z*11.0)));
  vA = mix(1.0, ghost*0.8, uLapse)*mix(1.0, smoothstep(0.0, 0.12, s)*smoothstep(1.0, 0.88, s)*mix(1.0, 0.55, uLapse), moving);
  vA *= aJ.w > 150.0 ? uFlood : 1.0;      // long lanes cross the drowned fields: only on a flood
  vA = mix(vA, 1.0, step(aJ.w, -0.5));    // the big moored hulls of the basin are no ghosts
  vP = p; vN = nn; vC = color;
  gl_Position = projectionMatrix*viewMatrix*vec4(vP, 1.0);
}`,Ht=L0+`
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying float vA; varying vec3 vL;
void main(){
  if (vA < 0.01) discard;
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  // linen: sewn of half-metre cloths, weathered, darker towards the foot
  float linen = step(0.5, vC.r), su = vL.x/0.5;
  float seam = smoothstep(0.4, 0.5, abs(fract(su) - 0.5))*clamp(1.0 - fwidth(su)*1.4, 0.0, 1.0);
  vec3 alb = vC*mix(1.0, (1.0 - 0.26*seam)*(0.8 + 0.2*smoothstep(1.5, 4.7, vL.y))*(0.88 + 0.2*vn(vL.xy*2.3 + vP.x)), linen);
  vec3 c = lit(alb, N, 1.0) + alb*uSunCol*0.25*max(-dot(N, uSunDir), 0.0)*linen;
  gl_FragColor = vec4(fogged(c, length(vP - cameraPosition)), vA);
}`,Ne=L0+`
attribute vec4 aI; attribute vec4 aJ;
uniform float uFlow; uniform vec3 uWind;
varying vec3 vP; varying vec3 vC; varying float vA; varying vec2 vUv;
void main(){
  vec3 p; vA = 1.0; vUv = uv;
#ifdef REED
  // aI: x, z, base height, size   aJ: rotation, phase, hue, -
  float s = position.y;
  p = position*vec3(aI.w*0.5, aI.w, aI.w*0.5);
  float cr = cos(aJ.x), sr = sin(aJ.x);
  p = vec3(p.x*cr + p.z*sr, p.y, -p.x*sr + p.z*cr);
  float bend = s*s*aI.w;
  p.xz += vec2(0.7, 0.4)*bend*0.22*sin(uTime*1.7 + aJ.y*6.28 + aI.x*0.3);
  p.z += bend*uFlow*0.75; p.y -= bend*abs(uFlow)*0.45;
  p += vec3(aI.x, aI.z - sinkAt(aI.xy), aI.y);
  vC = mix(vec3(0.075, 0.16, 0.08), vec3(0.36, 0.32, 0.15), aJ.z)*(0.45 + 0.75*s);
#endif
#ifdef SMOKE
  // aI: x, y, z, height   aJ: birth year, seed, width, -
  float s = uv.y;
  float sm = 1.0 + uLapse*1.6;
  vec3 c = aI.xyz; c.y -= sinkAt(aI.xz);
  float wob = sin(s*5.0 - uTime*0.8 + aJ.y*20.0)*(0.3 + s*2.2)/sm;
  c += vec3(0.0, s*aI.w, 0.0) + uWind*(s*s*aI.w*0.9) + vec3(wob, 0.0, wob*0.6);
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  p = c + right*position.x*aJ.z*(0.5 + s*3.2)*sm;
  vA = smoothstep(0.0, 0.08, s)*pow(1.0 - s, 1.2)*1.25/sm*smoothstep(aJ.x, aJ.x + 1.0, uYear);
  vC = vec3(0.4, 0.4, 0.46);
#endif
#ifdef FLAG
  // aI: pole top x, y, z, length   aJ: phase, colour mix, -, -
  float s = uv.x;
  vec3 c = aI.xyz; c.y -= sinkAt(aI.xz);
  float ph = aJ.x*6.28;
  vec3 wd = normalize(uWind + vec3(0.0, 0.0, 1e-4));
  vec3 sd = vec3(-wd.z, 0.0, wd.x);
  float wv = sin(s*9.0 - uTime*4.2 + ph)*0.5 + sin(s*4.3 - uTime*2.7 + ph*2.0)*0.5;
  p = c + wd*(s*aI.w) + sd*(wv*s*1.3) + vec3(0.0, (uv.y - 0.5)*mix(1.5, 0.35, s) - s*s*1.6 + 0.3*s*cos(s*7.0 - uTime*3.1 + ph), 0.0);
  vC = mix(vec3(0.8, 0.75, 0.64), vec3(0.6, 0.13, 0.05), aJ.y)*(0.8 + 0.25*wv);
#endif
  vP = p;
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0);
}`,Fe=L0+`
varying vec3 vP; varying vec3 vC; varying float vA; varying vec2 vUv;
void main(){
  float a = vA;
#ifdef SMOKE
  a *= smoothstep(1.0, 0.2, abs(vUv.x*2.0 - 1.0));
#endif
  vec3 c = vC*(uSunCol*(0.35 + 0.3*max(uSunDir.y, 0.0)) + mix(uGndCol, uSkyCol, 0.8));
  gl_FragColor = vec4(fogged(c, length(vP - cameraPosition)), a);
}`,Rt=`
attribute vec3 color; attribute float aM;
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying float vM; varying vec3 vL;
void main(){ vL = position; vC = color; vM = aM; vN = normalize(mat3(modelMatrix)*normal);
  vP = (modelMatrix*vec4(position, 1.0)).xyz; gl_Position = projectionMatrix*viewMatrix*vec4(vP, 1.0); }`,It=L0+`
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying float vM; varying vec3 vL;
uniform vec3 uSeg[8];    // 4 shadow-casting segments (a, b) in barge space
uniform vec4 uSegR;      // their radii
uniform vec3 uCapA, uCapB;  // capstone base centre and apex
float segSh(vec3 o, vec3 d, vec3 a, vec3 b, float r0, float r1){
  vec3 e = b - a, w = o - a;
  float B = dot(d, e), C = dot(e, e), D = dot(d, w), E = dot(e, w);
  float s = clamp((E - B*D)/max(C - B*B, 1e-4), 0.0, 1.0);
  float t = B*s - D;
  if (t < 0.05) return 0.0;
  float r = mix(r0, r1, s);
  return smoothstep(r*1.25, r*0.75, length(w + d*t - e*s));
}
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vP);
  vec3 d = uShDir;
  float sh = 0.0;
  sh = max(sh, segSh(vL, d, uSeg[0], uSeg[1], uSegR.x, uSegR.x));
  sh = max(sh, segSh(vL, d, uSeg[2], uSeg[3], uSegR.y, uSegR.y));
  sh = max(sh, segSh(vL, d, uSeg[4], uSeg[5], uSegR.z, uSegR.z));
  sh = max(sh, segSh(vL, d, uSeg[6], uSeg[7], uSegR.w, uSegR.w));
  if (vM < 0.5 || vM > 2.5) sh = max(sh, segSh(vL, d, uCapA, uCapB, 0.8, 0.02));
  sh = max(sh, nearShadow(vP.xz));
  float light = 1.0 - uShadow*sh;
  vec3 alb = vC, c;
  float fre = 1.0 - max(dot(N, V), 0.0); float fre3 = fre*fre*fre;
  if (vM > 0.5 && vM < 2.5) {          // the capstone: hammered electrum sheets, or polished black granite
    float gran = step(1.5, vM);
    vec3 q = vL - uCapA;
    float capH = max(uCapB.y - uCapA.y, 0.1), hwc = max(0.8*(1.0 - q.y/capH), 0.0);
    float inCap = step(max(abs(q.x), abs(q.z)), 0.86)*step(-0.03, q.y);
    float arris = inCap*max(smoothstep(0.035, 0.008, hwc - min(abs(q.x), abs(q.z))), smoothstep(0.03, 0.0, q.y)*0.6);
    vec3 hm = vec3(vn(vL.xy*9.0 + vL.z*5.0), vn(vL.yz*9.0 + 3.0), vn(vL.xz*9.0 + 7.0)) - 0.5;
    vec3 hm2 = vec3(vn(vL.xy*31.0 + vL.z*17.0), vn(vL.yz*31.0 + 5.0), vn(vL.xz*31.0 + 2.0)) - 0.5;
    vec3 Nh = normalize(N + hm*mix(0.26, 0.025, gran) + hm2*mix(0.12, 0.012, gran));
    float seam = smoothstep(0.03, 0.0, abs(fract(vL.y*3.0) - 0.5) - 0.47);
    // the sheathing is beaten sheets, lapped like roof tiles: every sheet its own tone, a dark line where two meet
    float sv_ = (abs(N.x) > abs(N.z) ? q.z : q.x)*2.6 + 0.5*floor(vL.y*3.0), shA = clamp(1.0 - fwidth(sv_)*1.5, 0.0, 1.0)*inCap*(1.0 - gran);
    float vseam = smoothstep(0.045, 0.0, abs(fract(sv_) - 0.5) - 0.455);
    alb *= 1.0 - 0.42*max(seam, vseam*shA)*(1.0 - gran);
    alb *= 1.0 + shA*(0.34*h21(vec2(floor(sv_), floor(vL.y*3.0) + 2.0)) - 0.17);
    vec3 R = reflect(-V, Nh);
    // what it mirrors: the sky and its clouds above, the bright bank and water below, a pale horizon line between
    float up = smoothstep(-0.12, 0.1, R.y);
    vec3 env = mix(uGndCol*1.6 + uSunCol*vec3(0.24, 0.18, 0.1), skyClouds(normalize(vec3(R.x, abs(R.y) + 0.03, R.z))), up);
    env += uHor*0.6*exp(-R.y*R.y*60.0);
    float sp = max(dot(R, uShDir), 0.0); float s4 = sp*sp; s4 *= s4; float s16 = s4*s4; s16 *= s16; float s64 = s16*s16; s64 *= s64;
    float day = smoothstep(-0.05, 0.1, uSunTrue.y);
    vec3 envg = mix(env, vec3(dot(env, vec3(0.3, 0.5, 0.2))), 0.8);            // metal tints what it mirrors: no green from a blue sky
    // an inscription round the foot of every face: a register of signs between two rules, gilt on the granite, chased into the electrum
    float hc = abs(N.x) > abs(N.z) ? q.z : q.x, ry = (q.y - 0.2)/0.12, gx = hc/0.082 + 0.5;
    float gh = h21(vec2(floor(gx), 3.0 + step(0.0, N.x) + 2.0*step(0.0, N.z))), gf = fract(gx) - 0.5, rc = ry - 0.5;
    float sign_ = gh < 0.22 ? step(abs(gf), 0.07)*step(abs(rc), 0.4)
      : gh < 0.44 ? step(abs(length(vec2(gf*0.68, rc)) - 0.24), 0.06)
      : gh < 0.62 ? step(abs(gf), 0.3)*step(abs(abs(rc) - 0.2), 0.06)
      : gh < 0.8 ? max(step(abs(gf), 0.065)*step(abs(rc), 0.4), step(abs(gf), 0.28)*step(abs(rc - 0.34), 0.06))
      : step(abs(abs(gf) - 0.16), 0.055)*step(abs(rc), 0.3 + 0.1*step(gf, 0.0));
    float gaa = clamp(1.0 - fwidth(gx)*1.2, 0.0, 1.0);
    float gild = max(sign_*step(abs(rc), 0.5)*step(abs(hc), hwc - 0.09), max(step(abs(ry + 0.24), 0.055), step(abs(ry - 1.24), 0.055))*step(abs(hc), hwc - 0.04))*inCap*gaa*step(q.y, 0.6);
    vec3 ga = mix(alb, vec3(0.8, 0.5, 0.09), gran*step(0.5, gild));
    vec3 galb = ga*vec3(1.0, 0.86, 0.62)*(0.86 + 0.28*vn(vL.xy*23.0 + vL.z*17.0))*(0.86 + 0.3*clamp(q.y/capH, 0.0, 1.0));
    // electrum: the sun's own image, wide enough to catch it once a lap and bright enough to bloom when it does
    vec3 gold = lit(galb, Nh, light)*0.5 + galb*envg*(1.0 + 1.6*fre3) + ga*uDiscCol*(s64*7.0 + s16*1.4 + s4*0.22)*light*day;
    gold *= 1.0 - 0.5*gild*(1.0 - gran);
    // granite: black, speckled with feldspar, polished: a clear blue sheen of sky with a horizon line and the sun in it
    float fleck = step(0.78, vn(vL.xy*70.0 + vL.z*53.0)), fleck2 = step(0.84, vn(vL.zy*37.0 + vL.x*41.0 + 9.0));
    float xt = vn(vL.xy*40.0 + vL.z*29.0), xt2 = vn(vL.zy*13.0 + vL.x*11.0 + 4.0);                    // crystals: grey quartz, rose feldspar, black mica
    vec3 galbG = alb*(1.6 + 2.0*fleck + 3.0*xt2) + vec3(0.07, 0.05, 0.045)*fleck2 + vec3(0.05, 0.03, 0.028)*smoothstep(0.55, 0.8, xt);
    vec3 eg = mix(env, vec3(dot(env, vec3(0.3, 0.5, 0.2))), 0.2);
    vec3 gr = lit(galbG, Nh, light) + min(eg, vec3(0.8))*(0.1 + 0.42*min(fre3, 0.9))*(0.55 + 0.45*light)*(0.94 + 0.12*xt) + uDiscCol*(s64*s64*s64*s64*3.0 + s64*0.22 + s16*0.04)*light*day;      // the sun's own disc, small and sharp, sliding over the polish
    c = mix(gold, gr, gran*(1.0 - step(0.5, gild)));
    c += arris*(env*mix(0.5, 0.22, gran) + uSunCol*0.12*light);                  // the dressed edge catches the light
  } else {
    // cedar: sewn planks with seams, butt joints, lashing stitches and a low sheen of sky
    float flat_ = smoothstep(0.6, 0.85, N.y);
    float u = mix(vL.y*2.2 + vL.x*0.4, vL.x, flat_)/0.3;
    float pl = floor(u), fu = fract(u);
    float tone = h21(vec2(pl, 3.0)), butt = fract(vL.z/2.6 + tone*7.0);
    float fine = clamp(1.0 - fwidth(u)*1.2, 0.0, 1.0);
    float seam = max(smoothstep(0.44, 0.5, abs(fu - 0.5)), smoothstep(0.012, 0.0, abs(butt - 0.5))*flat_);
    float stitch = smoothstep(0.36, 0.5, abs(fu - 0.5))*smoothstep(0.16, 0.06, abs(fract(vL.z/0.42) - 0.5))*flat_;
    float grain = vn(vec2(u*5.0, vL.z*1.1 + tone*9.0))*0.26 + vn(vec2(u*17.0, vL.z*2.3))*0.14 + vn(vL.xz*2.1)*0.14;
    float wood = step(2.5, vM)*step(vM, 3.5);                                      // planking, not rope / stone / paint
    float ropeM = step(3.5, vM);                                                   // laid rope: the twist of its strands
    float tw = dot(vL, vec3(1.0, 1.3, 1.0))*150.0;
    alb *= mix(1.0, 0.72 + 0.4*(0.5 + 0.5*sin(tw))*clamp(1.0 - fwidth(tw)*0.4, 0.0, 1.0), ropeM);
    alb *= mix(1.0, (0.68 + grain)*(0.86 + 0.28*tone*fine), wood);
    alb *= 1.0 - wood*fine*0.5*seam;
    alb = mix(alb, vec3(0.5, 0.42, 0.26), wood*fine*stitch*0.75);
    c = lit(alb, N, light);
    vec3 R = reflect(-V, N);
    c += skyGrad(normalize(vec3(R.x, abs(R.y) + 0.02, R.z)))*(0.03 + 0.3*fre3)*(0.4 + 0.6*light)*wood;
  }
  gl_FragColor = vec4(fogged(c, length(vP - cameraPosition)), 1.0);
}`,t0=(a,e=1)=>{const p=new t.Color(a);return[p.r*e,p.g*e,p.b*e]};function ie(){return{p:[],n:[],c:[],m:[],i:[]}}function we(a,e,p,w,N){return a.p.push(e[0],e[1],e[2]),a.n.push(p[0],p[1],p[2]),a.c.push(w[0],w[1],w[2]),a.m.push(N[0],N[1]),a.p.length/3-1}function C0(a,e,p,w,N){const x=e[0],S=e[1],B=e[2],q=S[0]-x[0],V=S[1]-x[1],M=S[2]-x[2],R=B[0]-x[0],$=B[1]-x[1],W=B[2]-x[2];let l=V*W-M*$,f=M*R-q*W,i=q*$-V*R;const I=Math.hypot(l,f,i)||1;l/=I,f/=I,i/=I,N&&l*N[0]+f*N[1]+i*N[2]<0&&(l=-l,f=-f,i=-i);const Y=e.map(F=>we(a,F,[l,f,i],p,w));a.i.push(Y[0],Y[1],Y[2]),Y.length===4&&a.i.push(Y[0],Y[2],Y[3])}function x0(a,e,p,w,N,x,S,B,q,V=0,M=1,R=!1){const $=Math.cos(V),W=Math.sin(V),l=(F,g,r)=>{const k=g>0?M:1;return F*=k,r*=k,[e+F*$+r*W,p+g,w-F*W+r*$]},f=N/2,i=S/2,I=[e,p+x/2,w],Y=(F,g,r,k)=>{const Q=[(F[0]+r[0])/2-I[0],(F[1]+r[1])/2-I[1],(F[2]+r[2])/2-I[2]];C0(a,[F,g,r,k],B,q,Q)};Y(l(-f,0,i),l(f,0,i),l(f,x,i),l(-f,x,i)),Y(l(f,0,-i),l(-f,0,-i),l(-f,x,-i),l(f,x,-i)),Y(l(f,0,i),l(f,0,-i),l(f,x,-i),l(f,x,i)),Y(l(-f,0,-i),l(-f,0,i),l(-f,x,i),l(-f,x,-i)),Y(l(-f,x,i),l(f,x,i),l(f,x,-i),l(-f,x,-i)),R&&Y(l(-f,0,-i),l(f,0,-i),l(f,0,i),l(-f,0,i))}function be(a,e,p,w,N,x,S,B,q,V=!0){const M=(R,$)=>[[-w-R,N+R],[w+R,N+R],[w+R,-N-R],[-w-R,-N-R]].map(([W,l])=>[e+W,x+$,p+l]);for(let R=0;R<S.length-1;R++){const $=M(S[R][0],S[R][1]),W=M(S[R+1][0],S[R+1][1]);for(let l=0;l<4;l++){const f=(l+1)%4;C0(a,[$[l],$[f],W[f],W[l]],B,q,[($[l][0]+$[f][0])/2-e,-.2,($[l][2]+$[f][2])/2-p])}}if(V){const R=M(S[S.length-1][0],S[S.length-1][1]);C0(a,R,B,q,[0,1,0])}}function j(a,e,p,w,N,x,S=5,B=w){const q=[p[0]-e[0],p[1]-e[1],p[2]-e[2]],V=Math.hypot(q[0],q[1],q[2])||1;q[0]/=V,q[1]/=V,q[2]/=V;const M=Math.abs(q[1])>.9?[1,0,0]:[0,1,0];let R=q[1]*M[2]-q[2]*M[1],$=q[2]*M[0]-q[0]*M[2],W=q[0]*M[1]-q[1]*M[0];const l=Math.hypot(R,$,W);R/=l,$/=l,W/=l;const f=q[1]*W-q[2]*$,i=q[2]*R-q[0]*W,I=q[0]*$-q[1]*R,Y=a.p.length/3;for(let F=0;F<=S;F++){const g=F/S*y0,r=Math.cos(g),k=Math.sin(g),Q=[R*r+f*k,$*r+i*k,W*r+I*k];we(a,[e[0]+Q[0]*w,e[1]+Q[1]*w,e[2]+Q[2]*w],Q,N,x),we(a,[p[0]+Q[0]*B,p[1]+Q[1]*B,p[2]+Q[2]*B],Q,N,x)}for(let F=0;F<S;F++){const g=Y+F*2;a.i.push(g,g+2,g+1,g+1,g+2,g+3)}}function Q0(a,e=2,p=t.BufferGeometry){const w=new p;if(w.setAttribute("position",new t.Float32BufferAttribute(a.p,3)),w.setAttribute("normal",new t.Float32BufferAttribute(a.n,3)),w.setAttribute("color",new t.Float32BufferAttribute(a.c,3)),e===2)w.setAttribute("aM",new t.Float32BufferAttribute(a.m,2));else{const N=new Float32Array(a.m.length/2);for(let x=0;x<N.length;x++)N[x]=a.m[x*2+1];w.setAttribute("aM",new t.Float32BufferAttribute(N,1))}return w.setIndex(a.i),w}const w0=(a,e,p,w)=>a.setAttribute(e,new t.InstancedBufferAttribute(new Float32Array(p),w));function ze(a,e){const p=Math.max(Math.abs(a)-7,-(e+238)),w=Math.abs(a)-80,N=Math.abs(e+300)-60,x=Math.hypot(Math.max(w,0),Math.max(N,0))+Math.min(Math.max(w,N),0),S=Math.max(Math.abs(a)-7,Math.abs(e+368)-10);return Math.min(p,x,S)}function ot(a,e,p){return Math.max(Z(1.25,.5,Math.hypot((a- -24)/11,(e+44)/24)),Z(1.25,.5,Math.hypot((a- -24)/11,(e+152)/26)))}function T0(a,e,p){const w=ze(a,e),N=Z(-226,-246,e),x=i0(2.2,3.2,N);let S=1.2+.22*Math.sin(a*.021+1.3)*Math.sin(e*.017+.4);S+=2.3*Z(1.2,.55,Math.hypot((a-p)/64,(e+172)/128)),S+=2.5*ot(a,e,p);const B=i0(1.5,.45,N),q=i0(-3,x,Z(-B,B,w));return i0(q,S,Z(5+N*9,13+N*13,w))}function st(a,e){const p=[],w=[],N=[],x=[],S=e?6:5,B=e?[[0,.046],[.05,.034],[.3,.027],[.62,.023],[.9,.021],[.918,.04],[.95,.046],[.975,.03],[.995,.008]]:[[0,.046],[.3,.027],[.9,.021],[.918,.04],[.95,.046],[.995,.008]],q=l=>.075*l*l;B.forEach(([l,f],i)=>{for(let I=0;I<=S;I++){const Y=I/S*y0;p.push(q(l)+Math.cos(Y)*f,l,Math.sin(Y)*f),w.push(Math.cos(Y),.15,Math.sin(Y)),N.push(I/S,l,l>=.91?-1:0)}});for(let l=0;l<B.length-1;l++)for(let f=0;f<S;f++){const i=l*(S+1)+f;x.push(i,i+S+1,i+1,i+1,i+S+1,i+S+2)}const V=.955,M=q(V);if(e)for(let l=0;l<5;l++){const f=l/5*y0+a.range(-.4,.4),i=Math.cos(f),I=Math.sin(f),Y=p.length/3,F=[[.02,.925,.006],[.06,.93,.008],[.085,.905,.022],[.09,.868,.026],[.088,.835,.004]];F.forEach(([g,r,k])=>{for(let Q=0;Q<=4;Q++){const b0=Q/4*y0;p.push(M+i*g+Math.cos(b0)*k,r,I*g+Math.sin(b0)*k),w.push(Math.cos(b0),.2,Math.sin(b0)),N.push(Q/4,r,-2)}});for(let g=0;g<F.length-1;g++)for(let r=0;r<4;r++){const k=Y+g*5+r;x.push(k,k+5,k+1,k+1,k+5,k+6)}}const R=e?21:12,$=e?5:4;for(let l=0;l<R;l++){const f=l%3,i=l/R*y0*2+a.range(-.25,.25),I=a.range(.4,.54)*(f===2?.85:1);let Y=f===0?a.range(.9,1.3):f===1?a.range(.35,.75):a.range(-.25,.15);const F=f===0?a.range(1.7,2.2):f===1?a.range(1.4,1.8):a.range(.9,1.3),g=Math.cos(i),r=Math.sin(i),k=p.length/3,Q=e?.105:.095,b0=a.range(-.35,.35),e0=e?[-1,0,1]:[-1,1],k0=e0.length;let d0=.012,C=V;if(!(e&&l%4===3)){for(let p0=0;p0<=$;p0++){const v0=p0/$,m0=b0*v0,P0=Math.cos(Y),B0=-Math.sin(Y);for(const T of e0){const a0=e?Math.abs(T)*Q*.42:0;p.push(M+g*d0-r*T*Q-g*B0*a0,C-.02*v0-T*Q*m0-P0*a0,r*d0+g*T*Q-r*B0*a0);const f0=e?.55*T:m0*T*.3;w.push(g*B0-r*f0,P0,r*B0+g*f0),N.push(v0,T,1)}const y=I/$;d0+=Math.cos(Y)*y,C+=Math.sin(Y)*y,Y-=F/$*(.6+.8*v0)}for(let p0=0;p0<$;p0++)for(let v0=0;v0<k0-1;v0++){const m0=k+p0*k0+v0;x.push(m0,m0+1,m0+k0,m0+1,m0+k0+1,m0+k0)}}}const W=new t.InstancedBufferGeometry;return W.setAttribute("position",new t.Float32BufferAttribute(p,3)),W.setAttribute("normal",new t.Float32BufferAttribute(w,3)),W.setAttribute("aW",new t.Float32BufferAttribute(N,3)),W.setIndex(x),W}function Nt(a){const e=ie(),p=t0("#7d5d3c"),w=t0("#4a3826"),N=t0("#efe6d2"),x=[0,0],S=8,B=[],q=[],V=[];for(let M=0;M<=S;M++){const R=M/S*2-1;B.push(R*3.2),q.push(.95*Math.pow(Math.max(1-R*R,0),.6)+.04),V.push(.45+.75*R*R*R*R)}for(let M=0;M<S;M++){for(const R of[-1,1])C0(e,[[R*q[M],V[M],B[M]],[R*q[M+1],V[M+1],B[M+1]],[R*q[M+1]*.35,-.2,B[M+1]],[R*q[M]*.35,-.2,B[M]]],p,x,[R,-.3,0]);C0(e,[[-q[M],V[M]-.12,B[M]],[q[M],V[M]-.12,B[M]],[q[M+1],V[M+1]-.12,B[M+1]],[-q[M+1],V[M+1]-.12,B[M+1]]],w,x,[0,1,0])}if(x0(e,0,.3,1.3,1.1,.75,1.3,t0("#8a6a3a"),x),j(e,[.5,1.4,2.6],[.9,-.3,3.6],.05,w,x,4),a){j(e,[0,.3,-.5],[0,5,-.5],.07,w,x,4,.04),j(e,[-1.9,4.7,-.5],[1.9,4.7,-.5],.04,w,x,4),j(e,[-1.9,1.5,-.5],[1.9,1.5,-.5],.04,w,x,4);const M=6,R=4,$=N.map(f=>f*.84),W=(f,i)=>-.5-.6*(1-f*f)*(.45+.55*Math.sin(Math.PI*i)),l=[];for(let f=0;f<=R;f++)for(let i=0;i<=M;i++){const I=i/M*2-1,Y=f/R,F=.02,g=(W(I+F,Y)-W(I-F,Y))/(2*F*1.8),r=(W(I,Y+F)-W(I,Y-F))/(2*F*3.2),k=Math.hypot(g,r,1);l.push(we(e,[I*1.8,1.5+3.2*Y+.08*(1-I*I)*(1-2*Y),W(I,Y)],[-g/k,-r/k,1/k],$,x))}for(let f=0;f<R;f++)for(let i=0;i<M;i++){const I=f*(M+1)+i;e.i.push(l[I],l[I+1],l[I+M+2],l[I],l[I+M+2],l[I+M+1])}}else j(e,[0,.3,-.5],[0,3.6,-.5],.06,w,x,4,.035),j(e,[-1.6,1.3,-.4],[1.6,1.5,-.4],.11,N,x,4),j(e,[0,3.55,-.5],[0,1.2,-3],.022,w,x,3),j(e,[0,3.55,-.5],[0,1.25,2.9],.022,w,x,3),j(e,[0,3.6,-.5],[0,4.1,-.5],.03,t0("#a44524"),x,3,.01);return e}function Ft(a){const e=ie(),p=[0,0],w=[0,1],N=[0,2],x=[0,3],S=[0,4],B=[t0("#9b7248"),t0("#916a41"),t0("#a47a4e")],q=t0("#4a3524"),V=t0("#a44524"),M=t0("#FFD25A"),R=t0("#b79a62"),$=t0("#d9c9a0"),W=y=>1.35+.9*Math.pow(G0((-y-1)/4,0,1),2),l=y=>Math.max(3*Math.pow(G0((y+5.25)/7,0,1),.55),.06),f=[9,6.5];for(let y=4;y>-5.01;y-=.5)f.push(y);f.push(-5.22);for(let y=0;y<f.length-1;y++){const T=f[y],a0=f[y+1],f0=l(T),z0=l(a0),h0=W(T),M0=W(a0),q0=6;for(let o0=0;o0<q0;o0++){const R0=o0/q0*2-1,g0=(o0+1)/q0*2-1;C0(e,[[R0*f0*.95,h0,T],[g0*f0*.95,h0,T],[g0*z0*.95,M0,a0],[R0*z0*.95,M0,a0]],B[0],x,[0,1,0])}for(const o0 of[-1,1])C0(e,[[o0*f0*.95,h0,T],[o0*z0*.95,M0,a0],[o0*z0*.95,M0+.42,a0],[o0*f0*.95,h0+.42,T]],B[1],x,[-o0,0,0]),C0(e,[[o0*f0*.95,h0+.42,T],[o0*z0*.95,M0+.42,a0],[o0*(z0*1.04+.06),M0+.42,a0],[o0*(f0*1.04+.06),h0+.42,T]],B[2],x,[0,1,0]),C0(e,[[o0*(f0*1.04+.06),h0+.42,T],[o0*(z0*1.04+.06),M0+.42,a0],[o0*z0*.8,-.4,a0],[o0*f0*.8,-.4,T]],B[0],x,[o0,.2,0]);y%3===1&&T<1&&j(e,[-f0*.93,h0+.05,T],[f0*.93,h0+.05,T],.04,R,S,5)}const i=-.92,I=-4.25,Y=W(I)-.1;j(e,[i,Y,I],[i,3.05,I],.13,B[1],p,8,.1),j(e,[i,2.55,I],[i,2.7,I],.125,V,p,8,.12),j(e,[i,2.9,I],[i,3.05,I],.115,M,w,8,.11),j(e,[i,3.05,I],[i,3.3,I],.1,t0("#557f6c"),p,8,.18),j(e,[i,3.3,I],[i,3.55,I],.18,t0("#6a977f"),p,8,.15),j(e,[i,3.55,I],[i,3.88,I],.15,t0("#e4d6b0"),p,8,.02);const F=.95,g=-2.7,r=W(g),k=r+.15;for(const y of[-.62,.62])x0(e,F,r-.08,g+y,1.9,.25,.26,q,p);for(const y of[-1,1])x0(e,F+y*.74,k,g,.18,.2,2.3,B[1],p),C0(e,[[F+y*.74-.09,k+.2,g-1.15],[F+y*.74+.09,k+.2,g-1.15],[F+y*.74+.09,k+.42,g-1.5],[F+y*.74-.09,k+.42,g-1.5]],B[1],p,[0,1,.5]);for(const y of[-.8,0,.8])x0(e,F,k+.2,g+y,1.8,.1,.2,B[2],p);for(const y of[-.56,0,.56])x0(e,F+y,k+.3,g,.34,.24,1.76,B[y?0:2],p);const Q=k+.54,b0=.8,e0=[F,Q+1,g],k0=[[F-b0,Q,g+b0],[F+b0,Q,g+b0],[F+b0,Q,g-b0],[F-b0,Q,g-b0]],d0=.3,C=a?t0("#17171d"):M,p0=a?N:w;for(let y=0;y<4;y++){const T=k0[y],a0=k0[(y+1)%4],f0=[(T[0]+a0[0])/2-F,.8,(T[2]+a0[2])/2-g],z0=[i0(e0[0],T[0],d0),i0(e0[1],T[1],d0),i0(e0[2],T[2],d0)],h0=[i0(e0[0],a0[0],d0),i0(e0[1],a0[1],d0),i0(e0[2],a0[2],d0)];C0(e,[T,a0,h0,z0],C,p0,f0),C0(e,[z0,h0,e0],M,w,f0)}const v0=g-.45,m0=[F,e0[1]+.1,v0],P0=[[F-.8,W(v0),v0],[F+.5,W(v0)+.4,v0]];for(const y of P0)j(e,y,m0,.036,B[1],p,5,.03);const B0=y=>P0.map(T=>[i0(T[0],m0[0],y),i0(T[1],m0[1],y),v0]);{const[y,T]=B0(.62);j(e,y,T,.028,B[0],p,4)}j(e,[m0[0],m0[1]-.04,m0[2]],[e0[0],e0[1]+.02,e0[2]-.03],.022,V,S,5);for(let y=0;y<4;y++){const T=k0[y],a0=k0[(y+1)%4],f0=Math.sign(T[0]-F),z0=Math.sign(T[2]-g);j(e,[T[0]+f0*.14,k+.2,T[2]+z0*.12],[i0(T[0],e0[0],.2),i0(T[1],e0[1],.2)+.012,i0(T[2],e0[2],.2)],.034,V,S,6);for(const h0 of[.2,.46]){const M0=[i0(T[0],e0[0],h0),i0(T[1],e0[1],h0)+.012,i0(T[2],e0[2],h0)],q0=[i0(a0[0],e0[0],h0),i0(a0[1],e0[1],h0)+.012,i0(a0[2],e0[2],h0)],o0=(M0[0]+q0[0])/2-F,R0=(M0[2]+q0[2])/2-g,g0=Math.hypot(o0,R0)||1;j(e,[M0[0]+o0/g0*.03,M0[1],M0[2]+R0/g0*.03],[q0[0]+o0/g0*.03,q0[1],q0[2]+R0/g0*.03],h0<.3?.038:.03,V,S,6)}}x0(e,-1.25,W(-1.7),-1.7,.8,.5,1,$,p,.12),x0(e,-1.3,W(-1.7)+.5,-1.75,.55,.35,.6,$,p,-.3);for(let y=0;y<3;y++)for(let T=0;T<9;T++){const a0=T/9*y0,f0=(T+1)/9*y0,z0=.34-y*.02,h0=W(-3.1)+.05+y*.075;j(e,[-.75+Math.cos(a0)*z0,h0,-2.9+Math.sin(a0)*z0],[-.75+Math.cos(f0)*z0,h0,-2.9+Math.sin(f0)*z0],.04,R,S,5)}return{geometry:Q0(e,1),segs:[[i,Y,I],[i,3.2,I],P0[0],m0,P0[1],m0,[i,3.2,I],[i,3.8,I]].map(y=>new t.Vector3(y[0],y[1],y[2])),radii:new t.Vector4(.14,.05,.05,.23),capA:new t.Vector3(F,Q,g),capB:new t.Vector3(e0[0],e0[1],e0[2])}}function Te(a,e,p,w,N,x){const S=(p-e)/2+(w-p)+(N-w)/2;let B,q;if(a<=e)B=0,q=0;else if(a<p){const V=(a-e)/(p-e);q=V*V*(3-2*V),B=(p-e)*(V*V*V-V*V*V*V/2)}else if(a<=w)q=1,B=(p-e)/2+(a-p);else if(a<N){const V=(N-a)/(N-w);q=V*V*(3-2*V),B=S-(N-w)*(V*V*V-V*V*V*V/2)}else B=S,q=0;x[0]=B/S,x[1]=q}var Gt={id:"twenty-floods",name:"Twenty Floods",category:"wilderness",weirdness:.25,media:["water","open"],async build(a){const e=a.rng,p=a.vary||{},w=a.quality?.detail??1,N=G0(p.density??1,.6,1.4),x=e.pick(["afternoon","afternoon","afternoon","golden","golden","night"]),S=p.hour==="night"?"night":p.hour==="golden"?"golden":p.hour==="day"?"afternoon":p.hour==="dawn"&&x==="night"?"golden":x,B=e.pick(["flood","flood","emerald","harvest"]),q=e.pick(["clear","clear","cirrus","cirrus","khamsin","khamsin"]),V=e.chance(.2),M=e.chance(.7)?-1:1,R=e.pick([2,2,1,3]),$=e.chance(.5)?1:-1,W=!!p.rare,l=e.fork("look"),f=l.range(-.035,.03),i=l.range(22,36),I=l.range(.3,.64),Y=l.pick([2,3,3]),F=l.range(0,1),g=M>0?118:-90,r=a.core.makeRng(((Number(a.seed)||1)*40503^1597463007)>>>0),k=new t.Scene;k.fog=new t.FogExp2(15787208,7e-4);const Q=new t.DirectionalLight(16777215,3);k.add(Q,Q.target);const b0=new t.HemisphereLight(12376562,9073488,3);k.add(b0);const e0=dt([[0,ye,0],[0,ye,-120],[0,ye,-240],[0,ye,-yt]]),k0=(o=0,s=0,v=0)=>({value:new t.Vector3(o,s,v)}),d0=()=>({value:new t.Color(0,0,0)}),C={uSunDir:k0(0,1,0),uShDir:k0(0,1,0),uSunTrue:k0(0,1,0),uSunCol:d0(),uSkyCol:d0(),uGndCol:d0(),uFogCol:d0(),uZen:d0(),uHor:d0(),uGlow:d0(),uCloudLit:d0(),uCloudShade:d0(),uDiscCol:d0(),uFogDen:{value:7e-4},uSink:{value:0},uTime:{value:0},uYear:{value:.5},uLapse:{value:0},uTownX:{value:g},uPalmH:{value:5},uShadow:{value:1},uAvGap:{value:9*(Y+1)},uPyr:{value:new t.Vector4(W0[0],W0[2],115*re,8)},uSm:{value:[new t.Vector4,new t.Vector4,new t.Vector4]},uCloud:{value:new t.Vector4(e.range(0,40),e.range(0,40),0,.5)}},p0=(o,s,v={},P={})=>new t.ShaderMaterial({uniforms:{...C,...v},vertexShader:o,fragmentShader:s,...P}),v0=new t.Vector3(.276,0,.961),m0=new t.Vector3(-.961,0,.276),P0=new t.Vector3(0,Math.cos(Math.PI/6),0).addScaledVector(m0,Math.sin(Math.PI/6)).normalize(),B0=new t.Vector3().crossVectors(v0,P0).normalize(),y=Math.PI/180,T=new t.Vector3(Math.sin(40*y)*Math.cos(30*y),Math.sin(30*y),-Math.cos(40*y)*Math.cos(30*y)),a0=new t.Vector3().crossVectors(T,new t.Vector3(0,1,0)).normalize(),f0=new t.Vector3().crossVectors(T,a0).normalize(),z0=new t.Vector3(-.533,.5,-.682).normalize(),h0=new t.Vector3(-.75,.52,.12).normalize(),M0=new t.Vector3(-.337,.342,-.877).normalize(),q0=new t.Vector3(-.45,.85,.2);q0.addScaledVector(M0,-q0.dot(M0)).normalize();const o0={uArcE:{value:v0},uArcT:{value:P0},uArcA:{value:B0},uPole:{value:T},uPoleX:{value:a0},uPoleY:{value:f0},uMoonDir:{value:z0},uCometDir:{value:M0},uCometTail:{value:q0},uPhi:{value:0},uStars:{value:0},uStarRot:{value:0},uStarArc:{value:0},uMoon:{value:0},uCirrus:{value:q==="cirrus"?1:q==="khamsin"?.45:.12},uComet:{value:new t.Vector2(0,.1)}},R0=new t.Mesh(new t.IcosahedronGeometry(1,4),p0(Mt,St,o0,{side:t.BackSide,depthWrite:!1,depthTest:!1}));R0.renderOrder=-10,R0.frustumCulled=!1,k.add(R0);{const o=[0];let s=0;for(;s<2600;)s+=s<26||s>72&&s<92?1.5:s<110?4:s<420?14:s<900?45:140,o.push(s);const v=[...o.slice(1).reverse().map(u=>-u),...o],P=[];let H=430;for(;H>-2750;)P.push(H),H-=H>60?20:H>-220?6:H>-250?4:H>-480?3:H>-1e3?13:75;const E=v.length,D=P.length,h=new Float32Array(E*D*3),c=new Uint32Array((E-1)*(D-1)*6);for(let u=0,J=0;u<D;u++)for(let K=0;K<E;K++)h[J++]=v[K],h[J++]=0,h[J++]=P[u];for(let u=0,J=0;u<D-1;u++)for(let K=0;K<E-1;K++){const L=u*E+K;c[J++]=L,c[J++]=L+1,c[J++]=L+E,c[J++]=L+1,c[J++]=L+E+1,c[J++]=L+E}const d=new t.BufferGeometry;d.setAttribute("position",new t.BufferAttribute(h,3)),d.setIndex(new t.BufferAttribute(c,1));const A=new t.Mesh(d,p0(kt,Ct,{},{side:t.DoubleSide}));A.frustumCulled=!1,k.add(A)}await a.yield();const g0={uSilt:{value:0},uRip:{value:.1},uLotus:{value:0},uMirrorK:{value:0},uBow:k0(0,0,1),uLineY:{value:146},uCapY:{value:140},uRampHead:{value:0},uCourseH:{value:2.7},uDusk:{value:0},uRampP:{value:[...Array(13)].map(()=>new t.Vector3)}};{const o=new t.PlaneGeometry(5400,3400);o.rotateX(-Math.PI/2),o.translate(0,0,1100);const s=new t.Mesh(o,p0(Pt,At,g0));s.renderOrder=50,s.frustumCulled=!1,k.add(s)}await a.yield();const S0=await mt(a,{palette:gt,density:Math.min(N,1.15),mirror:!1,wind:$,blaze:2.6});S0.object.position.set(W0[0],W0[1],W0[2]),S0.object.rotation.y=-ce,S0.object.scale.setScalar(re),k.add(S0.object);const Me=new t.Vector3(W0[0],W0[1]+62,W0[2]);g0.uRampP.value=S0.uniforms.uRamp.value,g0.uCourseH.value=S0.uniforms.uDim.value.w,await a.yield();const n=e.fork("props");{const o=st(n,!0),s=st(n,!1),v=[],P=[],H=(b,m,z,n0)=>{v.push(b,m,T0(b,m,g)-.15,n0),P.push(z,n.range(0,y0),n(),n())};for(let b=28,m=0;b>-236;b-=9,m++)for(const z of[-1,1]){const n0=z>0&&b<at;z>0&&m%(n0?Y+1:2)!==0||H(z*10+n.range(-.3,.3),b+n.range(-.5,.5),n.range(-2.6,-.6)-2,n0?n.range(6.4,7.8):n.range(10,13.5))}await a.yield();const E=Math.round(880*Math.min(N,1.1)*w),D=[];for(let b=0;b<30;b++)D.push([n.gauss()*260,n.range(40,-345),n.range(-2,11)]);for(let b=0;b<8;b++)D.push([g+n.gauss()*55,-140+n.gauss()*85,n.range(-2,5)]);let h=0;for(;v.length/4<E&&h++<E*6;){const b=n.pick(D),m=b[0]+n.gauss()*20,z=b[1]+n.gauss()*20;z>60||z<-372||ze(m,z)<17||Math.abs(m)<16||m>0&&m<230&&z<-30&&m>(-40-z)*.2&&m<(-40-z)*.85+30&&n.chance(.93)||Math.hypot((m-g)/64,(z+172)/128)<.85&&n.chance(.8)||H(m,z,b[2]+n.range(0,5),n.range(9,14))}await a.yield();const c=Math.round(v.length/4*.89),d=[],A=[],u=[],J=[];for(let b=0;b<c;b++){const m=Math.abs(v[b*4])<16&&v[b*4+1]>-200;for(let z=0;z<4;z++)(m?d:u).push(v[b*4+z]),(m?A:J).push(P[b*4+z])}const K=p0(qt,Dt,{},{side:t.DoubleSide});w0(o,"aI",d,4),w0(o,"aJ",A,4),o.instanceCount=d.length/4;const L=new t.Mesh(o,K);L.frustumCulled=!1,k.add(L),await a.yield(),w0(s,"aI",u,4),w0(s,"aJ",J,4),s.instanceCount=u.length/4;const O=new t.Mesh(s,K);O.frustumCulled=!1,k.add(O)}await a.yield();const he={uFlow:{value:0},uWind:k0($*.8,0,.35)};{const o=X=>{const G=ie();x0(G,0,0,0,1,1,1,[1,1,1],[1,0]);const r0=G.i.length;if(x0(G,0,.9,0,1.05,.22,1.05,[1.06,1.04,1],[1,1]),G.i.splice(r0+24,6),x0(G,-.24,1,-.2,.46,.5,.5,[.96,.95,.93],[1,0]),!X)return Q0(G,2,t.InstancedBufferGeometry);x0(G,.1,.6,.72,.7,.035,.44,[1.2,1.12,.84],[1,1],0,1,!0);for(const _ of[-.22,.42])x0(G,_,0,.9,.035,.6,.03,[.42,.33,.24],[1,1]);for(let _=0;_<3;_++)x0(G,-.565,0,.36-_*.24,.13,.9-_*.3,.24,[.94,.92,.88],[1,1]);for(const[_,c0,A0]of[[.3,-.25,.05],[.16,.3,.045]])j(G,[_,1,c0],[_,1.1,c0],A0*.6,[.82,.5,.36],[1,1],5,A0),j(G,[_,1.1,c0],[_,1.17,c0],A0,[.82,.5,.36],[1,1],5,A0*.45);return Q0(G,2,t.InstancedBufferGeometry)},s=o(!1),v=o(!0),P=[],H=[],E=[],D=[],h=[],c=[],d={aI:[],aJ:[]},A=Math.round(400*N*(.5+.5*w)),u=["#a07850","#ac8358","#94694a","#b8926a","#c09c72"];for(let X=0;X<A;X++){let G=0,r0=0,_=0;for(let Y0=0;Y0<12;Y0++){G=Math.sqrt(n())*.98;const N0=n.range(0,y0);r0=g+Math.cos(N0)*G*58+n.range(-2,2),_=-172+Math.sin(N0)*G*120;const ge=r0>0&&_<-30&&r0>(-40-_)*.2&&r0<(-40-_)*.85+30;if(ze(r0,_)>19&&!ge)break}const c0=n.range(4,8),A0=n.range(4,7),V0=n.chance(.25)?n.range(5,6.6):n.range(2.7,4),$0=T0(r0,_,g)-.3,J0=Math.pow(G,1.25)*13-.9+n.range(-.6,.6);P.push(r0,$0,_,n.pick([0,0,Math.PI/2])+n.range(-.12,.12)),H.push(c0,V0,A0,J0);const H0=t0(n.pick(u),n.range(.85,1.15));E.push(H0[0],H0[1],H0[2],n()),X%12===3&&(d.aI.push(r0,$0+V0,_,n.range(20,40)),d.aJ.push(J0+.5,n(),n.range(.75,1.35),0))}const J=-1;for(let X=0;X<2;X++){const G=X?-152:-44;for(let r0=0;r0<3;r0++)for(let _=0;_<6;_++){if(r.chance(.16)){r();continue}const c0=J*(17.5+r0*6.2+r.range(-.8,.8)),A0=G+(_-2.5)*7.4+r.range(-1.2,1.2)+r0%2*2.2,V0=r.range(3.6,5.6),$0=r.range(3.6,5.4),J0=r.chance(.2)?r.range(4.6,5.6):r.range(2.5,3.6),H0=Math.abs(_-2.5)/2.5+r0*.3,Y0=X?H0*4.5+r.range(-.5,2.5):H0<.9?-3:H0*2.2+r.range(-.6,1);D.push(c0,T0(c0,A0,g)-.3,A0,r.pick([0,Math.PI/2,Math.PI])+r.range(-.14,.14)),h.push(V0,J0,$0,Y0);const N0=t0(r.pick(u),r.range(.85,1.15));c.push(N0[0],N0[1],N0[2],r()),r0===1&&_%3===1&&(d.aI.push(c0,T0(c0,A0,g)-.3+J0,A0,r.range(14,24)),d.aJ.push(Math.max(Y0,-3)+.5,r(),r.range(.6,1),0))}}w0(s,"aI",P,4),w0(s,"aJ",H,4),w0(s,"aC",E,4),s.instanceCount=P.length/4;const K=p0(Re,Ie,{},{defines:{INST:1,HOUSE:1}}),L=new t.Mesh(s,K);L.frustumCulled=!1,k.add(L),w0(v,"aI",D,4),w0(v,"aJ",h,4),w0(v,"aC",c,4),v.instanceCount=D.length/4;const O=new t.Mesh(v,K);O.frustumCulled=!1,k.add(O),await a.yield();const b=14,m=[],z=[],n0=[];for(let X=0;X<=b;X++)for(const G of[-1,1])m.push(G,0,0),z.push(G*.5+.5,X/b);for(let X=0;X<b;X++){const G=X*2;n0.push(G,G+1,G+2,G+1,G+3,G+2)}const l0=new t.InstancedBufferGeometry;l0.setAttribute("position",new t.Float32BufferAttribute(m,3)),l0.setAttribute("uv",new t.Float32BufferAttribute(z,2)),l0.setIndex(n0),w0(l0,"aI",d.aI,4),w0(l0,"aJ",d.aJ,4),l0.instanceCount=d.aI.length/4;const U=new t.Mesh(l0,p0(Ne,Fe,he,{defines:{SMOKE:1},transparent:!0,depthWrite:!1,side:t.DoubleSide}));U.frustumCulled=!1,U.renderOrder=3,k.add(U)}await a.yield();const Se=[],ke=[];{const o=ie(),s=t0("#d8c8a2"),v=t0("#c2ae84"),P=t0("#6e4526"),H=t0("#F6EFE0",.86),E=t0("#FFD25A"),D=[0,2],h=[0,0],c=[1,2],d=[0,3],A=[[0,0],[.04,.42],[.18,.82],[.44,1.14],[.84,1.36]];for(const L of[-1,1]){const O=L*11.6,b=-364.5,m=.85;x0(o,O,-3,b,8.4,25,9,s,D,0,m);for(const l0 of[-1,1])for(const U of[-1,1])j(o,[O+l0*4.2,-3,b+U*4.5],[O+l0*4.2*m,22,b+U*4.5*m],.26,v,h,6,.22);const z=4.2*m,n0=4.5*m;for(const[l0,U,X,G]of[[-1,1,1,1],[1,1,1,-1],[1,-1,-1,-1],[-1,-1,-1,1]])j(o,[O+l0*z,22.05,b+U*n0],[O+X*z,22.05,b+G*n0],.27,v,h,6);be(o,O,b,z,n0,22.25,A,s,d,!1),be(o,O,b,z,n0,22.25,[[.84,1.36],[.84,1.78]],v,h),x0(o,L*11.85,-3,-363.3,10,5.9,12.4,v,D,0,.975),j(o,[L*6.98,2.78,-357.25],[L*16.72,2.78,-357.25],.2,s,h,6);for(const l0 of[9.3,13.9]){const U=L*l0;j(o,[U,2.9,-358.6],[U,3.75,-358.6],.62,v,h,8,.46),j(o,[U,3.75,-358.6],[U,31,-358.9],.34,P,h,6,.15),j(o,[U,31,-358.9],[U,31.7,-358.9],.2,E,[0,1],5,.02),ke.push([U,30.4,-358.9])}}x0(o,0,8.3,-364.5,16,3.4,7,s,D,0,1,!0),j(o,[-8,11.75,-360.95],[8,11.75,-360.95],.2,v,h,6),be(o,0,-364.5,8,3.5,11.9,A.map(([L,O])=>[L*.8,O*.8]),s,d,!1),be(o,0,-364.5,8,3.5,11.9,[[.67,1.09],[.67,1.4]],v,h);{const b=t0("#2f6f72"),m=t0("#a44524");for(let z=0;z<14;z++){const n0=z/14*y0,l0=(z+1)/14*y0;C0(o,[[0,10,-360.8+.08],[Math.cos(n0)*.78,10+Math.sin(n0)*.78,-360.8+.08],[Math.cos(l0)*.78,10+Math.sin(l0)*.78,-360.8+.08]],E,[0,1],[0,0,1])}for(const z of[-1,1])[[.62,.2,4.6,b],[.2,-.16,4,m],[-.16,-.5,3.2,E]].forEach(([n0,l0,U,X],G)=>{const r0=z*.74,_=z*(.74+U),c0=.12+G*.05;C0(o,[[r0,10+n0,-360.8],[_,10+n0-c0,-360.8],[_-z*.25,10+l0-c0,-360.8],[r0,10+l0,-360.8]],X,G===2?[0,1]:h,[0,0,1])})}for(const L of[-1,1])x0(o,L*15,2.4,-241,2.2,1.2,2.2,v,[1,0]),x0(o,L*15,3.6,-241,1.3,7.2,1.3,s,[1,0],0,.72),x0(o,L*15,10.8,-241,.94,1.1,.94,E,[1,1],0,.02);const u=n.fork("yard");for(let L=0;L<46;L++){const O=u.chance(.5)?1:-1,b=u.chance(.3),m=b?O*u.range(14,78):O*u.range(83,96),z=b?u.range(-236,-229):u.range(-352,-246),n0=u.range(.9,1.8),l0=u.int(1,3);for(let U=0;U<l0;U++)x0(o,m+u.range(-.2,.2),3.15+U*n0*.7,z,n0*1.5,n0*.7,n0,U%2?s:v,c,u.range(-.2,.2))}const J=[[-250,-790,56,72],[-395,-900,43,55],[-150,-960,33,42]];for(let L=0;L<3;L++){if(L>=R)continue;const[O,b,m,z]=J[L];C.uSm.value[L].set(O,b,m,z);const n0=Math.cos(ce),l0=Math.sin(ce),U=[[m,m],[-m,m],[-m,-m],[m,-m]].map(([X,G])=>[O+X*n0-G*l0,30,b+X*l0+G*n0]);for(let X=0;X<4;X++){const G=U[X],r0=U[(X+1)%4];C0(o,[G,r0,[O,30+z,b]],H,[0,1],[(G[0]+r0[0])/2-O,z*.5,(G[2]+r0[2])/2-b])}}for(const L of[-1,1])for(let O=0;O<4;O++)for(let b=-264;b>-359;b-=24){const m=u.chance(.3),z=u.range(-3,3);m&&Se.push([L*(17+O*12+6),b+z])}for(const[L,O]of Se)for(const b of[-1,1]){const m=L+(L>0?-2.9:2.9),z=O+b*6.5;j(o,[m,-1.5,z],[m+u.range(-.15,.15),u.range(2,2.9),z+u.range(-.15,.15)],.17,P,h,6,.13),j(o,[m,1.2,z],[m,1.45,z],.2,t0("#b79a62"),h,6,.2)}const K=new t.Mesh(Q0(o),p0(Re,Ie,{},{side:t.DoubleSide}));K.frustumCulled=!1,k.add(K)}await a.yield();{const o=ie(),s=t0("#665d53"),v=t0("#7e6b58"),P=t0("#a8946c");for(const A of[-1,1]){x0(o,A*.5,-2.75,0,.5,.5,.6,v,[0,0],0,.7),j(o,[A*.5,-2.4,0],[A*.46,-.12,0],.1,s,[0,0],6,.075);for(const u of[-1,1])j(o,[A*.46,-.14,0],[A*.46,.34,u*.17],.06,s,[0,0],5,.04)}j(o,[-.62,0,0],[.62,0,0],.05,s,[0,0],5),j(o,[0,0,-4.7],[0,0,1.75],.045,s,[0,1],6,.11);{const A=[[1.36,.06,0],[1.48,.2,-.05],[1.66,.3,-.12],[1.86,.27,-.16],[2.02,.31,-.13],[2.16,.2,-.06],[2.24,.05,0]];for(let u=0;u<A.length-1;u++)j(o,[0,A[u][2],A[u][0]],[.03*(u%2),A[u+1][2],A[u+1][0]],A[u][1],u%2?v:v.map(J=>J*.86),[0,1],7,A[u+1][1]);for(const[u,J,K]of[[1.6,-.1,.3],[1.93,-.15,.31]])j(o,[0,J,u],[0,J,u+.05],K,P,[0,1],7,K)}j(o,[0,0,-4.66],[0,-2.25,-4.66],.035,t0("#b79a62"),[0,1],4),j(o,[0,-2.25,-4.66],[0,-2.8,-4.66],.24,t0("#3d2c1e"),[0,1],7,.15),j(o,[0,-2.2,-4.66],[0,-2.25,-4.66],.02,t0("#3d2c1e"),[0,1],7,.24);const H=Q0(o,2,t.InstancedBufferGeometry),E=[],D=[],h=[],c=Math.round(14*N);for(let A=0;A<c;A++){const u=A%2?1:-1,J=5.5-Math.floor(A/2)*36-(u>0?18:0);E.push(u*12.6,2.2+2.7,J,u*Math.PI/2),D.push(1,1,1,n.range(-1,6)),h.push(1,1,1,n()),J-18>-232&&(E.push(u*12.6,2.2+2.7,J-18,u*Math.PI/2),D.push(1,1,1,r.range(-1,8)),h.push(r.range(.85,1.1),r.range(.85,1.05),1,r()))}w0(H,"aI",E,4),w0(H,"aJ",D,4),w0(H,"aC",h,4),H.instanceCount=E.length/4;const d=new t.Mesh(H,p0(Re,Ie,{},{defines:{INST:1,NOD:1},side:t.DoubleSide}));d.frustumCulled=!1,k.add(d)}await a.yield();{const o=[],s=[],v=[];for(let h=0;h<5;h++){const c=n.range(0,y0),d=Math.cos(c)*.3,A=Math.sin(c)*.3,u=Math.cos(c)*.12,J=Math.sin(c)*.12,K=o.length/3,L=n.range(.7,1);o.push(u-A*.2,0,J+d*.2,u+A*.2,0,J-d*.2,u+d*L-A*.03,L,J+A*L+d*.03,u+d*L+A*.03,L,J+A*L-d*.03),s.push(0,0,1,0,0,1,1,1),v.push(K,K+1,K+2,K+1,K+3,K+2)}const P=new t.InstancedBufferGeometry;P.setAttribute("position",new t.Float32BufferAttribute(o,3)),P.setAttribute("uv",new t.Float32BufferAttribute(s,2)),P.setIndex(v);const H=[],E=[];for(const h of[-1,1])for(let c=30-n.range(0,3);c>-236;c-=n.range(3,5)){const d=Math.round(n.range(5,9)*Math.min(N,1.2)),A=h*n.range(6.75,7.3),u=n.range(.8,1.25);for(let J=0;J<d;J++){const K=A+n.range(-.45,.45),L=c+n.range(-.7,.7);H.push(K,L,T0(K,L,g)-.12,n.range(1.7,3.3)*u),E.push(n.range(0,y0),n(),n()*n(),0)}}for(let h=30;h>-237;h-=1.15)for(const c of[-1,1]){if(!n.chance(.3))continue;const d=c*n.range(7.6,9.6);H.push(d,h+n.range(-.5,.5),T0(d,h,g)-.1,n.range(1.1,2)),E.push(n.range(0,y0),n(),n()*n(),0)}await a.yield();for(let h=30,c=0;h>-237;h-=.7,c++)for(const d of[-1,1]){if(!r.chance(h>-130?.6:.34)){r(),r();continue}const A=d*(r.chance(.62)?r.range(8.9,10.1):r.range(12.6,15.5));H.push(A,h+r.range(-.35,.35),T0(A,h,g)-.06,r.range(.4,.95)),E.push(r.range(0,y0),r(),.25+.75*r(),0),(c&255)===255&&await a.yield()}await a.yield();{const h=a.core.makeRng(((Number(a.seed)||1)*1103515245^461845907)>>>0),c=Math.round(700*w);for(let d=0;d<c;d++){const A=d%2?1:-1,u=A*(8.7+3.6*Math.pow(h(),1.4)),J=30-266*Math.pow(h(),1.25);H.push(u,J,T0(u,J,g)-.04,h.range(.3,.6)),E.push(h.range(0,y0),h(),.1+.6*h(),0),(d&255)===255&&await a.yield()}}await a.yield();{const h=a.core.makeRng(((Number(a.seed)||1)*22695477^1013904242)>>>0),c=.9801,d=.1987,A=Math.round(1300*Math.min(N,1)*w);for(let u=0,J=0;u<A&&J<A*6;J++){let K=h.range(-4.4,4.4),L=h.range(-10,2.5);h.chance(.5)?K=Math.round(K):L=Math.round(L);const O=K*46+h.range(-.5,.5),b=L*27+h.range(-.5,.5),m=O*c+b*d,z=-O*d+b*c;z>26||z<-232||Math.abs(m)<20||Math.abs(m)>150||ze(m,z)<15||Math.hypot((m-g)/64,(z+172)/128)<1.15||ot(m,z,g)>.03||Math.sin(m*.11+1.3)*Math.sin(z*.09+.7)+.5*Math.sin(m*.031+z*.043)<-.15||(H.push(m,z,T0(m,z,g)-.1,h.range(2.3,3.3)),E.push(h.range(0,y0),h(),.15+.6*h()*h(),0),u++,(J&511)===511&&await a.yield())}}w0(P,"aI",H,4),w0(P,"aJ",E,4),P.instanceCount=H.length/4;const D=new t.Mesh(P,p0(Ne,Fe,he,{defines:{REED:1},side:t.DoubleSide}));D.frustumCulled=!1,k.add(D)}await a.yield();const Ce={uGhost:{value:0},uFlood:{value:0}};for(const o of[!1,!0]){const s=Q0(Nt(o),2,t.InstancedBufferGeometry),v=[],P=[],H=Math.round((o?22:58)*N);for(let D=0;D<H;D++){const h=n(),c=n.chance(.5)?1:-1;let d,A,u;h<.5?(d=c*(n.chance(.5)?76.3:72.4),A=n.range(-352,-248),u=n.chance(.5)?0:Math.PI):h<.75?(d=c*n.range(13,72),A=n.chance(.5)?-356.5:-353,u=Math.PI/2*c):h<.9?(d=c*n.range(16,72),A=-243.5,u=Math.PI/2*c):(d=c*n.range(22,60),A=n.range(-335,-265),u=n.range(0,y0)),v.push(d,A,u+n.range(-.06,.06),n.range(.85,1.45)),P.push(n(),0,n(),0)}if(!o){const D=[],h=[];for(let c=0;c<12;c++){const d=c%2?1:-1;D.push(d*r.range(5.75,6.05),-16-c*18.5+r.range(-4,4),(r.chance(.5)?0:Math.PI)+r.range(-.08,.08),r.range(.52,.7)),h.push(r(),0,r(),0)}for(const[c,d]of Se)v.push(c,d,(r.chance(.5)?0:Math.PI)+r.range(-.07,.07),r.range(2,2.6)),P.push(r(),0,r(),-1);for(let c=0;c<D.length;c++)v.push(D[c]),P.push(h[c])}if(o){for(let D=0;D<8;D++){const h=D%2?1:-1,c=n.chance(.5);v.push(h*(17+(D>>1)*12+n.range(-2,2)),-300,c?0:Math.PI,n.range(1.1,1.6)),P.push(n(),n.range(2.4,4.2),n(),92)}for(let D=0;D<12;D++){const h=D%2?1:-1,c=n.chance(.5);v.push(h*(34+Math.pow(n(),1.5)*300),-70+n.range(-30,30),c?0:Math.PI,n.range(1.2,1.9)),P.push(n(),n.range(3,5),n(),380)}}w0(s,"aI",v,4),w0(s,"aJ",P,4),s.instanceCount=v.length/4;const E=new t.Mesh(s,p0(Lt,Ht,Ce,{transparent:!0,side:t.DoubleSide}));E.frustumCulled=!1,E.renderOrder=2,k.add(E),await a.yield()}{const s=[],v=[],P=[];for(let c=0;c<=18;c++)for(const d of[0,1])s.push(0,0,0),v.push(c/18,d);for(let c=0;c<18;c++){const d=c*2;P.push(d,d+1,d+2,d+1,d+3,d+2)}const H=new t.InstancedBufferGeometry;H.setAttribute("position",new t.Float32BufferAttribute(s,3)),H.setAttribute("uv",new t.Float32BufferAttribute(v,2)),H.setIndex(P);const E=[],D=[];ke.forEach((c,d)=>{E.push(c[0],c[1],c[2],n.range(10,13)),D.push(n(),d%2,0,0)}),w0(H,"aI",E,4),w0(H,"aJ",D,4),H.instanceCount=ke.length;const h=new t.Mesh(H,p0(Ne,Fe,he,{defines:{FLAG:1},side:t.DoubleSide}));h.frustumCulled=!1,k.add(h)}await a.yield();const ee=Ft(V),nt={uSeg:{value:ee.segs},uSegR:{value:ee.radii},uCapA:{value:ee.capA},uCapB:{value:ee.capB}},K0=new t.Mesh(ee.geometry,p0(Rt,It,nt,{side:t.DoubleSide}));K0.frustumCulled=!1,k.add(K0),await a.yield();const Z0={_resolved:!0,sunDir:new t.Vector3(0,1,0),sunColor:new t.Color(1,1,1),sky:new t.Color(.5,.6,.8),ground:new t.Color(.2,.16,.1)},_0=j0.makeFauna(k,{light:Z0}),Be={body:"#f4f1ea",belly:"#ffffff",wingC:"#f2efe8",tip:"#0e0e0e",trail:"#161616",head:"#101010",beak:"#1c1a18",neckC:"#161616",tailC:"#ffffff",legC:"#6a5a50",legs:0,neck:.42},Pe=40;_0.add(j0.makeFlock({rng:e.fork("ibis-a"),species:"flamingos",count:6,size:1.6,speed:9,palette:Be,cross:{path:e0,u:.055,lead:20,height:3,angle:24,side:1,span:120,rise:5,offset:-11,duration:Pe},keepClear:{path:e0,dist:2,each:!0}}),{always:!0}),await a.yield(),_0.add(j0.makeFlock({rng:e.fork("ibis-b"),species:"flamingos",count:40,size:1.5,speed:12,palette:Be,spacing:2,cross:{path:e0,u:.9,lead:34,height:5.6,angle:34,side:1,span:480,rise:16,bow:30,duration:Pe}}),{always:!0}),await a.yield();const ue=[],Ae=(o,s)=>T0(o,s,g),Ve={...j0.HERD_PRESETS.bison,h:1.45,hump:.07};ue.push(_0.add(j0.makeHerd({rng:e.fork("oxen-a"),preset:Ve,count:6,coat:"#a57c56",center:[19.5,0,-24],radius:6.5,heightAt:Ae,speed:.5}),{always:!0})),await a.yield(),ue.push(_0.add(j0.makeHerd({rng:e.fork("oxen-b"),preset:Ve,count:5,coat:"#6e4c34",center:[-17.5,0,-11],radius:4.5,heightAt:Ae,speed:.5}),{always:!0})),await a.yield();{const o=e.fork("egrets"),s=[];for(let v=0;v<8;v++){const P=v%2?1:-1;s.push([P*o.range(6.5,7.1),0,-9-v*4.2+o.range(-1.2,1.2)])}ue.push(_0.add(j0.makeWaders({rng:o,species:"egret",count:8,size:1.15,positions:s,level:0,heightAt:Ae}),{always:!0}))}await a.yield();let Je=null;{const o=e.fork("quay-egrets"),s=[];for(let v=0;v<10;v++){const P=v%2?1:-1;s.push([P*o.range(17.5,34),3.2,o.range(-361.3,-360.4)])}Je=_0.add(j0.makeWaders({rng:o,species:"egret",count:10,size:1.5,positions:s,level:3.2,depth:0,peckRate:.3}),{always:!0})}await a.yield();const qe=[];if(B==="harvest")for(let o=0;o<2;o++){const s=vt({rng:e.fork("devil"+o),position:[o?-140:175,.8,o?-335:-290],height:o?30:42,radius:[.9,7],color:"#cfa66c",colorTop:"#ead2a4",opacity:.42,count:50,debris:80});s.object.scale.setScalar(.001),k.add(s.object),qe.push(s),await a.yield()}await a.yield();const te=(o,s=1)=>new t.Color(o).multiplyScalar(s),O0=q==="cirrus",fe=q==="khamsin",s0={zenDay:te("#6FB4E0",1).offsetHSL(f,.05,fe?.02:-.03),horDay:te("#F3E2C0",.8),zenNight:new t.Color(.062,.052,.14),horNight:new t.Color(.2,.15,.32),sunLow:new t.Color(1,.48,.36),sunHigh:te("#fff0d4",1.46),skyDay:new t.Color(.165,.235,.4),skyNight:new t.Color(.3,.27,.54),gndDay:new t.Color(.1,.078,.05),gndNight:new t.Color(.18,.15,.28),gold:te(O0?"#ff7f86":"#ffae48",O0?1:.8),rose:new t.Color(1,.5,.42),dawnZen:new t.Color(.2,.25,.5),ochre:te("#c99548",.8),cloudLitD:new t.Color(.95,.92,.86),cloudLitN:new t.Color(.16,.13,.31),cloudShD:new t.Color(.5,.56,.68),cloudShN:new t.Color(.06,.05,.15),moon:new t.Color(.5,.62,1)};O0&&s0.horDay.lerp(new t.Color(.86,.6,.6),.06),fe&&(s0.horDay.lerp(s0.ochre,.3),s0.zenDay.lerp(s0.ochre,.14));const pe=[.05,.3,.62,.83],E0=[.06,.23,.71,.86],lt=.75,de=6,Ge=o=>o+lt*Math.cos(o),ve=o=>{let s=o-1,v=o+1;for(let P=0;P<40;P++){const H=(s+v)/2;Ge(H)<o?s=H:v=H}return(s+v)/2},_e=ve(.1),rt=S==="golden"?118*y:S==="night"?256*y:110*y,ct=118*y,De=new t.Vector3,it=de*y0+ve(rt),ht=B==="flood"?20:B==="emerald"?19.33:19.5,Ee=.26+(I-.3)*.7,Ye=o=>{const s=o-Math.floor(o);return G0(Z(.54,.78,s)+1-Z(0,.22,s),0,1)},ae=new t.Vector3,D0=new t.Vector3,I0=new t.Vector3,u0=new t.Color,Tt=new t.Vector3,je=new t.Vector2(C.uCloud.value.x,C.uCloud.value.y),Le=[0,0],me=[0,0],We=[0,0];Te(S0.schedule.courses,E0[0],E0[1],E0[2],E0[3],We);const Ke=()=>G0(me[0]/We[0],0,1),He=a.core.makeRng(((Number(a.seed)||1)*69069^739982445)>>>0),Oe=He.chance(.5),Ue=He.pick([[1,de-3],[1,de-2],[2,de-2]]),Ze=ve(0),Xe=(ve(Math.PI)-Ze)/y0,ut=Ue[Oe?0:1]+(Xe+1)/2,ft=Ue[Oe?1:0]+Xe,$e=(o,s)=>1-Z(.5,1,Math.abs(o-s)),X0=He.pick([[1,1],[1,2],[2,1]]),Qe=O0?new t.Color(1.2,.5,.44):new t.Color(1.3,.66,.27);function et(o,s){Te(s,pe[0],pe[1],pe[2],pe[3],Le),Te(s,E0[0],E0[1],E0[2],E0[3],me);const v=Le[0],P=Le[1],H=me[0],E=me[1],D=_e+(it-_e)*v+P*P*.22*Math.sin(o*.2),h=Ge(D),c=Ee+(ht-Ee)*H+E*E*.02*Math.sin(o*.17),d=c-Math.floor(c),A=Ye(c),u=G0((Ye(c+.03)-A)*6,-1,1)*E,J=s<.5?Z(0,.5,P):Z(0,S==="night"?.55:.2,P),K=S==="golden"?Z(.6,.84,s):0,L=(i-9*A*P+(60-i)*K+(40-i)*(S==="golden"?0:Z(.6,.84,s)))*y;P0.set(0,Math.cos(L),0).addScaledVector(m0,Math.sin(L)).normalize(),B0.crossVectors(v0,P0).normalize(),ae.copy(v0).multiplyScalar(Math.cos(h)).addScaledVector(P0,Math.sin(h)).normalize();const O=(D-Ze)/y0,b=$e(O,ut),m=$e(O,ft),z=ct+42*y*m;De.copy(v0).multiplyScalar(Math.cos(z)).addScaledVector(P0,Math.sin(z)).normalize();const n0=ae.y;ae.lerp(De,J).normalize();const l0=i0(n0,De.y,J),U=i0(Z(-.14,.12,n0),1,J)*(1-b),X=i0(i0(Z(-.03,.09,n0),1,J),.15,b),G=S==="night"?Z(.78,.9,s):0,r0=S==="night"?Z(.6,.9,s):0,_=fe?Z(X0[0],X0[0]+1,O)*(1-Z(X0[0]+X0[1]+1,X0[0]+X0[1]+2,O)):0,c0=1-Z(.05,.17,s),A0=Math.max(Math.exp(-Math.pow((l0-.03)/.17,2))*(1-.5*P),.5*K,.95*c0,.9*m,2.2*b*(1-b));C.uSunTrue.value.copy(ae),o0.uPhi.value=h,C.uTime.value=o,C.uYear.value=c,C.uLapse.value=P,C.uSink.value=xt*A,C.uPalmH.value=11.5*i0(.16,1,Z(0,9,c+3.6)),u0.copy(s0.sunLow).lerp(s0.sunHigh,Z(.03,.42,l0)*(1-.8*K)).lerp(Qe,.75*m).lerp(s0.moon,.5*b).multiplyScalar(X*(1-.55*_)*(1+.42*c0)),_>0&&u0.lerp(s0.ochre,_*.5*X);const V0=S==="night"?Z(.74,.88,s)*(1-X):0;D0.copy(ae),S==="night"&&D0.lerp(h0,1-X).normalize(),u0.r+=s0.moon.r*V0,u0.g+=s0.moon.g*V0,u0.b+=s0.moon.b*V0;const $0=Math.max(X,.8*V0);I0.copy(D0);const J0=J*(1-b),H0=J0*(.28+.78*Math.sin(D));if(J0>0){let U0=Math.cos(H0),se=Math.sin(H0),ne=D0.x,le=D0.z;D0.x=ne*U0+le*se,D0.z=le*U0-ne*se,D0.y*=1-.62*J0*(.5+.5*Math.cos(D))*(1-m),D0.normalize(),U0=Math.cos(H0*.45),se=Math.sin(H0*.45),ne=I0.x,le=I0.z,I0.x=ne*U0+le*se,I0.z=le*U0-ne*se}D0.y<.06&&(D0.y=.06,D0.normalize()),I0.y<.2&&(I0.y=.2,I0.normalize()),C.uSunDir.value.copy(I0),C.uShDir.value.copy(D0),C.uSunCol.value.copy(u0),C.uShadow.value=$0*(1-.6*_),Q.color.copy(u0),Q.intensity=Math.PI,Q.position.copy(I0).multiplyScalar(400).add(Me),Q.target.position.copy(Me),Q.target.updateMatrixWorld(),C.uDiscCol.value.copy(s0.sunLow).lerp(s0.sunHigh,Z(0,.3,l0)).lerp(Qe,.6*m).multiplyScalar(4.4*(1-.5*P)*(1-.7*_)*(1-b)*(1+.2*m));const Y0=(1-.45*G)*(1-.2*r0)*(1-.3*c0);C.uSkyCol.value.copy(s0.skyNight).lerp(s0.skyDay,U).multiplyScalar(Y0),_>0&&C.uSkyCol.value.lerp(s0.ochre,_*.55*U),c0>0&&C.uSkyCol.value.lerp(u0.setRGB(.26,.24,.5),.5*c0),C.uGndCol.value.copy(s0.gndNight).lerp(s0.gndDay,U).multiplyScalar(Y0),b0.color.copy(C.uSkyCol.value),b0.groundColor.copy(C.uGndCol.value),b0.intensity=Math.PI,Z0.sunDir.copy(I0),Z0.sunColor.copy(C.uSunCol.value).multiplyScalar(Math.PI),Z0.sky.copy(C.uSkyCol.value).multiplyScalar(Math.PI),Z0.ground.copy(C.uGndCol.value).multiplyScalar(Math.PI),C.uZen.value.copy(s0.zenNight).lerp(s0.zenDay,U),C.uHor.value.copy(s0.horNight).lerp(s0.horDay,U),c0>0&&(C.uZen.value.lerp(s0.dawnZen,.6*c0),C.uHor.value.lerp(u0.setRGB(.78,.5,.46),.5*c0)),K>0&&(C.uHor.value.multiplyScalar(1-.24*K),C.uZen.value.lerp(u0.setRGB(.1,.21,.48),.55*K)),m>0&&(C.uZen.value.lerp(u0.setRGB(.085,.16,.43),.78*m),O0?u0.setRGB(.92,.5,.5):u0.setRGB(.98,.6,.28),C.uHor.value.lerp(u0,.42*m)),r0>0&&C.uZen.value.lerp(u0.setRGB(.07,.08,.3),.5*r0*U),G>0&&(C.uZen.value.multiplyScalar(1-.45*G),C.uHor.value.multiplyScalar(1-.35*G)),_>0&&(u0.copy(s0.ochre).multiplyScalar(.25+.75*U),C.uZen.value.lerp(u0,_*.85),C.uHor.value.lerp(u0,_*.9)),u0.copy(s0.gold).lerp(s0.rose,c0),C.uGlow.value.copy(u0).multiplyScalar(A0*(1-.6*_)*(1-.8*G)),C.uHor.value.lerp(u0.multiplyScalar(.75),A0*.35*U),C.uFogCol.value.copy(C.uHor.value).multiplyScalar(.94).add(u0.copy(C.uGlow.value).multiplyScalar(.1)),C.uFogDen.value=7e-4+.0016*_+(S==="golden"?12e-5*Z(.8,.95,s):0)+(O0?8e-5:0),k.fog.color.copy(C.uFogCol.value),k.fog.density=C.uFogDen.value,C.uCloudLit.value.copy(s0.cloudLitN).lerp(s0.cloudLitD,U).add(u0.copy(C.uGlow.value).multiplyScalar(.55)),C.uCloudShade.value.copy(s0.cloudShN).lerp(s0.cloudShD,U).add(u0.copy(C.uGlow.value).multiplyScalar(.15)),c0>0&&C.uCloudShade.value.lerp(u0.setRGB(.3,.27,.46),.6*c0);const N0=C.uCloud.value;N0.x=je.x+$*(o*.006+D*.11),N0.y=je.y+o*.002+D*.03,N0.z=P,N0.w=(O0?.24:fe?.3:.26+.2*F)+.15*_-.1*c0;const ge=Z(.7,1,1-U);if(o0.uStars.value=Math.max(ge*(1-.8*_)*(1+.5*G)*(1-J),Z(.45,1,b)*(1-.5*_)),o0.uStarRot.value=D*.45+o*.002,o0.uStarArc.value=.32*P,o0.uMoon.value=G,W){const U0=Z(.28,.34,s)*(1-Z(.6,.66,s));o0.uComet.value.set(Math.max(ge,.3*J)*U0*1.4,.06+.3*G0((s-.28)/.36,0,1))}const oe=d<.5?1-Z(0,.16,d):Z(.72,.88,d);g0.uMirrorK.value=oe,g0.uDusk.value=m,g0.uSilt.value=d>.5?Z(.54,.68,d)*(1-.8*Z(.72,.88,d))+.12:.12+.2*(1-oe),g0.uRip.value=i0(.11,.04,oe)+.1*Math.abs(u)+.03*P,g0.uLotus.value=(v>.5?1-P:0)*(B==="flood"?Math.max(.8*oe,Z(.84,.92,s)):.8*oe),he.uFlow.value=u,Ce.uGhost.value=c*1.3,Ce.uFlood.value=Z(.75,1,A)}const F0=new t.Vector3;function pt(o,s,v,P){const H=G0(P??0,0,1);if(et(s,H),e0.pointAt(H,F0),K0.visible=!a.through,K0.position.set(F0.x,tt+Math.sin(s*.8)*.03+Math.sin(s*.31)*.02,F0.z+xe),K0.rotation.x=Math.sin(s*.55)*.006,K0.rotation.z=Math.sin(s*.37+1)*.004,g0.uBow.value.set(F0.x,F0.z+xe,a.through?0:1),S0.setProgress(H,Ke()),S0.setGlint(Z(.79,.9,H)*(.6+.4*Math.sin(s*1.1))),S0.update(o,s,v),g0.uLineY.value=S0.uniforms.uLineY.value,g0.uCapY.value=S0.uniforms.uDim.value.z,g0.uRampHead.value=S0.uniforms.uRampHead.value,C.uPyr.value.w=G0(S0.uniforms.uCourse.value*S0.uniforms.uDim.value.w,6,146)*re,v){_0.setLight(Z0);const E=H>.105?-60:0;for(const D of ue)D.object.position.y=E;Je.object.position.y=-C.uSink.value*.82,_0.update(o,s,v,H);for(const D of qe)D.object.scale.setScalar(H>.7?Z(.7,.76,H)+.001:.001),D.update&&D.update(o,s,v)}}return et(0,0),S0.setProgress(0,Ke()),e0.pointAt(0,F0),K0.position.set(F0.x,tt,F0.z+xe),g0.uBow.value.set(F0.x,F0.z+xe,1),{scene:k,path:e0,duration:Pe,title:"Twenty Floods",ride:"none",style:"none",camera:{fov:58,near:.3,nearThrough:.3,far:6e3,lookAhead:30,sway:.3,bank:0},pois:[{at:new t.Vector3(-25,3,-62),from:.015,to:.115,weight:.36},{at:Me,from:.07,to:.86,weight:.7}],portal:{shape:"rect",width:12.6,height:6.6,color:"#ffe3a6",glow:.8,revealDistance:330},post:{exposure:1,bloom:{strength:.3,radius:.6,threshold:.92},grade:{saturation:1.08,contrast:1.05,tint:"#fff8ee",shadowTint:"#0c0a1c",vignette:.28,grain:.02,aberration:0}},update:pt,dispose(){S0.dispose();for(const o of qe)o.dispose&&o.dispose()}}}};export{Gt as default};
