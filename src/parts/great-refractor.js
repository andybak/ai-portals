import*as m from"three";const b=160,X=150,xt=56,Xt=-30,et=-22,mt=-6,e0=50*Math.PI/180,V0=Math.sin(e0),B0=Math.cos(e0),Ut=91,r0=113,Wt=23,U0=24,h0=-29.75,c0=8.71,ie=10.05,ne=9.38,le=145*Math.PI/180,re=.2,he=34*Math.PI/180,W0=`
uniform vec3 uCtr; uniform vec4 uSlit; uniform vec2 uDomeCS; uniform vec3 uKeyDir; uniform vec3 uStarCol; uniform float uStar;
uniform vec3 uAmbSky; uniform vec3 uAmbGnd; uniform vec4 uLampPos[8]; uniform vec3 uLampCol[8];
uniform vec3 uTubeA; uniform vec3 uTubeB; uniform float uTubeR; uniform vec4 uFlash; uniform float uFrost; uniform float uBeam;
uniform float uTime; uniform vec3 uCamL; uniform float uFill; uniform float uRim; uniform float uGlow; uniform float uLampGlow; uniform vec4 uHole; uniform float uCloudK;
uniform vec4 uAmbK; uniform vec4 uRing; uniform vec3 uRingCol; uniform vec4 uDomeL; uniform vec3 uDomeWarm; uniform vec3 uDomeCol;
uniform vec4 uShaft; uniform vec3 uDomeK; uniform float uSlitGlow; uniform float uDeckKey; uniform vec4 uTube; uniform vec4 uTube2; uniform vec4 uRing2; uniform vec3 uRing2Col; uniform vec3 uWarm; uniform vec4 uWin; uniform vec3 uWinCol; uniform vec4 uBounce;      // shaft: strength, 1/e radius, lower and upper end along the axis; dome: darkest share far from the slit, falloff in metres, rib rim
float gAmb = 1.0; float gFill = 1.0; float gKey = 1.0; float gBeam = 1.0; float gSpec = 1.0; float gSoft = 1.0; float gWrap = 0.0; float gTint = 0.0;      // per-surface share of the room's ambient, of the slit's sky fill and of the direct starlight (set in main before shadeAll)
float hash31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(hash31(i), hash31(i + vec3(1,0,0)), f.x), mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x), mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z); }
// 1 where the point can see the open slit along the starlight direction (this makes the bar of light)
float slitMaskS(vec3 P, float soft){
  vec3 p = P - uCtr; float b = dot(p, uKeyDir); float c = dot(p, p) - uSlit.w * uSlit.w;
  float t = -b + sqrt(max(b * b - c, 0.0));
  vec3 h = p + uKeyDir * t;
  float hx = uDomeCS.x * h.x - uDomeCS.y * h.z, hz = uDomeCS.y * h.x + uDomeCS.x * h.z;
  float w = uSlit.x, s = min(uSlit.z * soft, w * 0.6 + 0.02);
  return (1.0 - smoothstep(w - s, w + s, abs(hx))) * smoothstep(uSlit.y - 3.0 * soft, uSlit.y + 3.0 * soft, hz) * smoothstep(0.0, 6.0 * soft, h.y);
}
float slitMask(vec3 P){ return slitMaskS(P, 1.0); }
// how near a point of the dome is to the open slit: 1 at its edge, falling away round the skin
float slitNear(vec3 P){
  vec3 p = P - uCtr; float hx = uDomeCS.x * p.x - uDomeCS.y * p.z, hz = uDomeCS.y * p.x + uDomeCS.x * p.z;
  float dx = max(abs(hx) - uSlit.x, 0.0), dz = max(uSlit.y - hz, 0.0);
  return exp(-sqrt(dx * dx + dz * dz + 1e-4) / max(uDomeK.y, 1.0));
}
float erfA(float x){ float x2 = x * x; float t = 1.0 - exp(-x2 * (1.2732395 + 0.147 * x2) / (1.0 + 0.147 * x2)); return sign(x) * sqrt(max(t, 0.0)); }
// inside the tube: haze lit by the lens, a soft cone round the axis, integrated along the view ray in closed form
float tubeHaze(vec3 P){
  vec3 rd = P - uCamL; float len = length(rd); rd = rd / max(len, 1e-3);
  vec3 oc = uCamL - uCtr; float ra = dot(rd, uKeyDir), oa = dot(oc, uKeyDir);
  vec3 rp = rd - uKeyDir * ra, op = oc - uKeyDir * oa;
  float a = max(dot(rp, rp), 1e-5), b = dot(op, rp), c = dot(op, op), w = 4.6, sa = sqrt(a);
  float core = exp(-max(c - b * b / a, 0.0) / (w * w)); float t0 = min(uTube2.x, len);      // the air right round the eye does not glow: it would veil the whole picture
  return max(core * (0.8862 * w / sa) * (erfA(sa * (len + b / a) / w) - erfA(sa * (t0 + b / a) / w)), 0.0);
}
// the two colours the lens throws down the tube (blue focuses short, gold long): rings that creep toward the tail
vec3 tubeRings(float s, float ang){
  float f1 = 0.5 + 0.5 * sin(s * 1.05 - uTime * 0.55 + 0.5 * sin(ang * 2.0 + uTime * 0.2));
  float f2 = 0.5 + 0.5 * sin(s * 0.66 - uTime * 0.33 + 2.0 + 0.5 * sin(ang * 3.0 - uTime * 0.15));
  return vec3(0.2, 0.42, 1.0) * (f1 * f1 * f1 * 1.3) + vec3(1.0, 0.58, 0.16) * (f2 * f2 * f2 * 1.1) + uStarCol * 0.08;
}
// light on a surface inside the tube. Each bay between two baffles takes one colour of the lens's fringe, blue then gold, from the
// tail on; it falls off into a dark root under the baffle at either end, thin rings of the other colour creep down it toward the
// tail, and rivets and seams catch it at a glance. fs = how many metres of the axis one pixel covers here (fine rings fade out)
vec3 tubeLight(vec3 P, vec3 N, vec3 Ng, vec3 V, float fs){
  vec3 pa = P - uCtr; float s = dot(pa, uKeyDir); vec3 qa = pa - uKeyDir * s; float rq = max(length(qa), 1e-3);
  float gs = smoothstep(-100.0, 112.0, s); float g = uTube2.y + (1.0 - uTube2.y) * gs * sqrt(gs);
  vec3 Ld = uCtr + uKeyDir * 113.0 - P; Ld = Ld / max(length(Ld), 1e-3);
  float ang = atan(qa.y * uKeyDir.z - qa.z * uKeyDir.y, qa.x + (abs(qa.x) < 1e-4 ? 2e-4 : 0.0));
  float back = smoothstep(0.5, 0.9, -dot(Ng, uKeyDir));
  float bay = (s + 81.0) / 17.0; float bi = floor(bay), bf = bay - bi; float odd = mod(bi, 2.0);
  float up = smoothstep(0.03, 0.93, bf); float prof = mix(0.015, 1.35, up * up) * (1.0 - 0.5 * smoothstep(0.955, 1.0, bf));      // each bay runs from full colour to near black under the next baffle, so that baffle's lip stands against the dark
  vec3 cb = vec3(0.14, 0.38, 1.0), cg = vec3(1.5, 0.74, 0.13);
  // the gold bay the eye is passing reads as polished bronze: no pale wash, a warm band of highlight down its length and the
  // slit's blue along its top (further up the tube the bays keep their soft colour)
  float nearB = odd * (1.0 - smoothstep(26.0, 54.0, s - dot(uCamL - uCtr, uKeyDir))) * (1.0 - back);
  float c1 = 0.5 + 0.5 * sin(s * 1.1 - uTime * 0.8 + 0.7 * sin(ang * 2.0 + uTime * 0.2)); c1 *= c1; c1 *= c1; c1 *= c1 * (1.0 - smoothstep(0.35, 1.2, fs));
  float br = 0.82 + 0.18 * sin(uTime * 0.7 + bi * 2.1 + 0.6 * sin(ang * 3.0 - uTime * 0.15));
  vec3 rings = mix(mix(cb, cg, odd), mix(vec3(0.8, 0.88, 1.0), vec3(1.5, 0.7, 0.13), nearB), 0.34 * up * up) * mix(vec3(1.0), vec3(0.72, 0.6, 0.5), nearB) * (prof * br) + mix(cg, cb, odd) * (0.3 * c1 * prof) + uStarCol * 0.03;
  float nl = max(dot(N, Ld), 0.0);
  vec3 Hh = normalize(Ld + V + vec3(0.0, 1e-4, 0.0)); float sp = pow(max(dot(N, Hh), 0.0), 40.0);
  vec3 L = rings * (uTube.x * g * (mix(0.78, 0.12, gs) + 4.5 * nl * nl + 0.2 * sp) * mix(1.0, 0.07, back));      // by the lens the wall is dark and its rivets catch the light
  vec3 airC = mix(uStarCol, vec3(1.25, 0.66, 0.16) * dot(uStarCol, vec3(0.3, 0.55, 0.15)), nearB);
  L += airC * (0.15 * uTube.y * (0.35 + 0.65 * gs) * max(dot(N, qa) / -rq, 0.0));      // the glowing air down the axis lights the wall that faces it
  { float wb = 0.5 + 0.5 * cos(ang + 0.34 - 0.12 * sin(uTime * 0.23)); wb *= wb; wb *= wb; wb *= wb; wb *= wb; wb *= wb;
    float wb2 = 0.5 + 0.5 * cos(ang - 3.46 + 0.1 * sin(uTime * 0.17)); wb2 *= wb2; wb2 *= wb2; wb2 *= wb2; wb2 *= wb2; wb2 *= wb2;
    float tb = 0.5 + 0.5 * sin(ang); tb *= tb; tb = tb * tb * tb;
    float run = (0.3 + 0.7 * up) * (0.85 + 0.3 * vnoise(vec3(s * 0.9, ang * 5.0, 3.0)));
    L += (vec3(1.7, 0.95, 0.3) * (1.25 * wb + 0.8 * wb2) + vec3(0.14, 0.4, 1.0) * (0.85 * tb)) * (nearB * run * uTube.x * g * br); }
  vec3 Lt = uCtr - uKeyDir * 96.0 - P; float dt = length(Lt); Lt = Lt / max(dt, 1e-3);
  L += (uAmbSky * 1.1 + uWarm * 0.5) * (uTube.w * 0.6 * (0.25 + 0.75 * max(dot(N, Lt), 0.0)) * exp(-dt * 0.045));
  return L;
}
// the shaft: starlight in dusty air round the telescope's settled axis (a soft round beam), integrated along the view ray in closed form
float shaftScatter(vec3 P){
  vec3 rd = P - uCamL; float len = length(rd); rd = rd / max(len, 1e-3);
  vec3 oc = uCamL - uCtr; float ra = dot(rd, uKeyDir), oa = dot(oc, uKeyDir);
  vec3 rp = rd - uKeyDir * ra, op = oc - uKeyDir * oa;
  float a = max(dot(rp, rp), 1e-4), b = dot(op, rp), c = dot(op, op), w = max(uShaft.y, 1.0), sa = sqrt(a);
  float tm = clamp(-b / a, 0.0, len); float s = oa + ra * tm;
  float along = smoothstep(uShaft.z, uShaft.z + 30.0, s) * (1.0 - smoothstep(uShaft.w - 14.0, uShaft.w + 4.0, s)) * (0.5 + 0.5 * smoothstep(-95.0, 70.0, s));
  float core = exp(-max(c - b * b / a, 0.0) / (w * w));
  float I = core * (0.8862 * w / sa) * (erfA(sa * (len + b / a) / w) - erfA(sa * (b / a) / w));
  return max(I, 0.0) * along;
}
// soft shadow of the telescope tube (a capsule A-B) on everything else
float tubeShadow(vec3 P){
  vec3 ab = uTubeB - uTubeA, ap = P - uTubeA;
  float abL = dot(ab, uKeyDir), apL = dot(ap, uKeyDir);
  vec3 ab2 = ab - uKeyDir * abL, ap2 = ap - uKeyDir * apL;
  float l2 = dot(ab2, ab2);
  float s = clamp(dot(ap2, ab2) / max(l2, 1e-3), 0.0, 1.0);
  s = mix(step(0.0, abL), s, smoothstep(0.0, 9.0, l2));
  float d = length(ap2 - ab2 * s);
  float t = abL * s - apL;
  float pen = 1.2 + 0.03 * max(t, 0.0);
  return 1.0 - (1.0 - smoothstep(uTubeR - pen, uTubeR + pen, d)) * smoothstep(-2.0, 4.0, t) * 0.9;
}
// starlight scattered by dusty air between the eye and the surface: the visible shaft
float beamScatter(vec3 P, vec2 frag){
  vec3 rd = P - uCamL; float len = length(rd); rd = rd / max(len, 1e-3); len = min(len, 460.0);
  float j = fract(52.9829189 * fract(dot(frag, vec2(0.06711056, 0.00583715))));
  float dt = len / float(BEAM_STEPS), acc = 0.0;
  for (int i = 0; i < BEAM_STEPS; i++) {
    vec3 q = uCamL + rd * dt * (float(i) + j); vec3 qc = q - uCtr;
    acc += slitMask(q) * step(dot(qc, qc), uSlit.w * uSlit.w) * smoothstep(-150.0, -100.0, qc.y);
  }
  return acc * dt;
}
vec3 shadeAll(vec3 P, vec3 N, vec3 V, vec3 alb, float metal, float gloss, float ao, float key, vec3 emis, vec2 frag, float rimK){
  float nv = max(dot(N, V), 0.0);
  float fres = (1.0 - nv); fres = fres * fres * fres * fres;
  vec3 amb = mix(uAmbGnd, uAmbSky, N.y * 0.5 + 0.5) * (ao * gAmb);
  float ndl = dot(N, uKeyDir);
  // the slit is a long strip of sky, not a point: take the best of five directions along it, plus its width
  float nxd = uDomeCS.x * N.x - uDomeCS.y * N.z, nzd = uDomeCS.y * N.x + uDomeCS.x * N.z;
  float arc = max(max(nzd, 0.906 * nzd + 0.423 * N.y), max(0.643 * nzd + 0.766 * N.y, max(0.259 * nzd + 0.966 * N.y, -0.174 * nzd + 0.985 * N.y)));
  // across the slit: near the meridian light comes from both sides, far from it only from the slit's side
  vec3 pd = P - uCtr; float wx = clamp(-(uDomeCS.x * pd.x - uDomeCS.y * pd.z) / 70.0, -1.0, 1.0);
  arc = clamp(max(arc, 0.0) + 0.45 * mix(abs(nxd), max(nxd * sign(wx), 0.0) * 1.6, abs(wx)), 0.0, 1.0);
  float diff = (arc + 0.1) / 1.1;
  float openK = smoothstep(0.0, 22.0, uSlit.x);
  // racing cloud (uCloudK > 0): its shadows cross the bar of light, measured across the starlight direction
  vec3 pc = P - uKeyDir * dot(P, uKeyDir);
  key *= mix(1.0, 0.07 + 0.93 * smoothstep(0.4, 0.58, 0.75 * vnoise(pc * 0.022 + vec3(uTime * 0.2, 0.0, uTime * 0.09)) + 0.25 * vnoise(pc * 0.07 + vec3(uTime * 0.34, 3.0, uTime * 0.14))), uCloudK);
  vec3 keyC = uStarCol * (uStar * (key * gKey + (1.0 - key) * uFill * gFill * openK));
  vec3 H = normalize(uKeyDir + V + vec3(0.0, 1e-4, 0.0));
  float sp = pow(max(dot(N, H), 0.0), 6.0 + gloss * 110.0) * (0.15 + gloss * 1.6) * step(0.0, ndl);
  float bk = step(1.5, gSpec);
  vec3 dsum = amb + keyC * diff;
  vec3 ssum = keyC * sp; vec3 msum = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    vec3 d = uLampPos[i].xyz - P; float r2 = dot(d, d); float rr = uLampPos[i].w;
    float att = max(1.0 - r2 / max(rr * rr, 1.0), 0.0); att = att * att / (1.0 + r2 * 10.8 / max(rr * rr, 1.0));     // a 30 m lamp falls as before; a longer reach throws a wider pool
    vec3 dn = d * inversesqrt(max(r2, 1e-3));
    // the desk lamp (slot 7) has moths round it: their shadows flit over everything it lights; its shade keeps most of it off what hangs overhead
    if (i == 7) att *= (1.0 - 0.7 * smoothstep(0.52, 0.66, vnoise(dn * 6.5 + vec3(uTime * 1.7, uTime * 1.1, -uTime * 1.4)))) * mix(0.1, 1.0, smoothstep(-0.6, -0.25, dn.y));
    else if (i >= 3) att *= 1.0 - 0.55 * smoothstep(0.55, 0.68, vnoise(dn * 5.0 + vec3(uTime * 1.3 + float(i) * 3.7, uTime * 0.9, -uTime * 1.1)));      // the deck's lanterns have a moth or two each
    float nl = max(dot(N, dn), 0.0);
    vec3 hh = normalize(dn + V + vec3(0.0, 1e-4, 0.0));
    vec3 lc = mix(uLampCol[i], vec3(1.0, 0.96, 0.9) * dot(uLampCol[i], vec3(0.3, 0.55, 0.15)), gTint);      // (gTint: a surface that keeps its own colour under a coloured lamp and takes only a tint of it)
    dsum += lc * (att * nl); msum += lc * (att * (0.3 + 0.7 * nl));
    ssum += lc * (att * pow(max(dot(N, hh), 0.0), 8.0 + gloss * 60.0) * (0.3 + gloss * 2.0) * step(1e-4, nl));
  }
  {
    // the ring of ruby lanterns on the rising floor: only the nearest one matters at any point
    float seg = 6.2832 / max(uRing.w, 1.0); float la = floor(atan(P.x, P.z + (abs(P.z) < 1e-4 ? 2e-4 : 0.0)) / seg + 0.5) * seg;
    vec3 d = vec3(sin(la) * uRing.x, uRing.y, cos(la) * uRing.x) - P; float r2 = dot(d, d);
    float att = max(1.0 - r2 / max(uRing.z * uRing.z, 1.0), 0.0); att = att * att / (1.0 + r2 * 0.0065);
    vec3 dn = d * inversesqrt(max(r2, 1e-3)); float nl = max(dot(N, dn), 0.0);
    att *= 1.0 - 0.55 * smoothstep(0.55, 0.68, vnoise(dn * 5.0 + vec3(uTime * 1.3 + la * 3.1, uTime * 0.9, -uTime * 1.1)));      // moth shadows cross each pool
    att *= 0.8 + 0.42 * vnoise(vec3(uTime * 1.7, la * 7.3, 1.5)) + 0.05 * sin(uTime * 7.3 + la * 5.3);      // oil flames: each lantern breathes on its own
    vec3 rc = mix(uRingCol, vec3(1.0, 0.96, 0.9) * dot(uRingCol, vec3(0.3, 0.55, 0.15)), gTint);
    dsum += rc * (att * nl); msum += rc * (att * (0.3 + 0.7 * nl));
    // the sconces on the drum wall, between the lanterns: they warm the brick and the balcony under them
    la = (floor(atan(P.x, P.z + (abs(P.z) < 1e-4 ? 2e-4 : 0.0)) / seg) + 0.5) * seg;
    d = vec3(sin(la) * uRing2.x, uRing2.y, cos(la) * uRing2.x) - P; r2 = dot(d, d);
    att = max(1.0 - r2 / max(uRing2.z * uRing2.z, 1.0), 0.0); att = att * att / (1.0 + r2 * 0.012);
    dn = d * inversesqrt(max(r2, 1e-3)); nl = max(dot(N, dn), 0.0);
    att *= 0.84 + 0.34 * vnoise(vec3(uTime * 1.4, la * 5.1, 7.5));
    dsum += uRing2Col * (att * (0.15 + 0.85 * nl)); msum += uRing2Col * (att * (0.3 + 0.7 * nl));
    // the shuttered windows leak the night's blue onto the brick round them, the balcony under them and the gallery over them
    float segW = 6.2832 / max(uWin.w, 1.0); la = (floor(atan(P.x, P.z + (abs(P.z) < 1e-4 ? 2e-4 : 0.0)) / segW) + 0.5) * segW;
    d = vec3(sin(la) * uWin.x, uWin.y, cos(la) * uWin.x) - P; d.y *= 0.5; r2 = dot(d, d);
    att = max(1.0 - r2 / max(uWin.z * uWin.z, 1.0), 0.0); att = att * att / (1.0 + r2 * 0.01);
    dn = d * inversesqrt(max(r2, 1e-3)); nl = max(dot(N, dn), 0.0);
    dsum += uWinCol * (att * (0.4 + 0.6 * nl)); msum += uWinCol * (att * 0.5);
    // lamp light thrown back up off the deck: it warms the underside of everything that hangs over it and dies away up the dome
    float hb = max(P.y - uBounce.w, 0.0); float upK = clamp(0.3 - 0.7 * N.y, 0.0, 1.0);
    vec3 bnc = uBounce.rgb * (upK * exp(-hb / 105.0) * gBeam); dsum += bnc; msum += bnc * 0.6;
  }
  {
    // the first blade of sky lays a bar of cold light down the wall beneath it and across the floor toward the pier
    vec3 pb = P - uCtr; float bx = uDomeCS.x * pb.x - uDomeCS.y * pb.z, bz = uDomeCS.y * pb.x + uDomeCS.x * pb.z; float wb = uSlit.x + 5.0;
    float shim = 0.72 + 0.5 * vnoise(vec3(pb.y * 0.045 - uTime * 0.55, bz * 0.03 + uTime * 0.2, uTime * 0.3));      // dust drifting through it
    float bar = uSlitGlow * 5.0 * shim * (exp(-bx * bx / (wb * wb)) + 1.3 * exp(-bx * bx / (wb * wb * 0.1))) * smoothstep(-30.0, 150.0, bz) * (0.35 + 0.65 * smoothstep(-160.0, 0.0, pb.y));
    bar = bar < 1.0 ? bar : 1.0 + 1.6 * (1.0 - exp(-(bar - 1.0) / 1.6));      // held on a soft knee: the brightest thing on that wall, and the brick courses, the windows and the gallery still read through it
    dsum += mix(uStarCol, vec3(0.78, 0.88, 1.0), 0.45) * bar;
  }
  ssum *= gSpec;
  vec3 Rv = reflect(-V, N);
  vec3 env = mix(uAmbGnd * 1.4, uAmbSky * 1.5, smoothstep(-0.4, 0.6, Rv.y));
  env = mix(env, mix(uAmbGnd * 0.45, uAmbSky * 2.3, smoothstep(-0.12, 0.3, Rv.y)), metal);   // polished metal: a darker floor, a brighter roof
  // the open slit seen in polished things: a long cold streak; a little ruby from the floor lamps below
  float sxr = uDomeCS.x * Rv.x - uDomeCS.y * Rv.z, szr = uDomeCS.y * Rv.x + uDomeCS.x * Rv.z;
  float strip = exp(-sxr * sxr * 45.0) * smoothstep(-0.25, 0.1, szr + Rv.y * 0.4) * smoothstep(-0.05, 0.15, Rv.y);
  env *= mix(0.2, 1.0, gBeam);                                              // (inside the tube nothing mirrors the hall)
  env *= mix(1.0, 0.3 + 1.5 * smoothstep(0.3, 0.72, 0.5 + 0.5 * sin(Rv.y * 7.0 + Rv.x * 4.0 + Rv.z * 3.0)), bk);      // brass: dark and bright reflections in turn round every turned surface
  env += uStarCol * (uStar * strip * (1.3 + 1.7 * bk) * gBeam * smoothstep(0.0, 8.0, uSlit.x));
  env *= 1.0 + 0.35 * sin(Rv.x * 23.0 + Rv.z * 11.0) * smoothstep(0.0, 0.4, Rv.y);
  env += (vec3(0.05, 0.004, 0.008) + uWarm) * (1.0 - smoothstep(-0.8, -0.2, Rv.y)) + uWarm * (0.6 * metal);      // polished things keep a little of the lamps wherever they stand
  vec3 col = alb * dsum * (1.0 - metal * 0.88);
  col += mix(vec3(0.04), alb, metal) * (ssum + msum * (metal * mix(0.4, 0.26, bk)) + env * (metal * 0.9 + 0.08 * gloss + fres * 0.25));
  // thin rim toward the slit so nothing sinks into the wall behind it
  vec3 toS = uCtr + uKeyDir * uSlit.w - P; toS = toS / max(length(toS), 1e-3);
  float rimF = smoothstep(-0.15, 0.85, dot(N, toS)); rimF = max(rimF, 0.42 * gWrap * smoothstep(0.6, 1.4, uRim));      // (on the white enamel and on timber a raised rim wraps round: an edge that looks away from the slit still stands off what is behind it)
  col += uStarCol * mix(vec3(1.0), vec3(0.62, 0.8, 1.1), smoothstep(0.6, 1.4, uRim)) * (uRim * rimK * fres * rimF * (0.25 + 0.75 * uStar) * (0.35 + 0.65 * ao));
  col += emis;
  // the shaft: dust in the starlight drifts slowly, so the beam is never quite still
  float dust = 0.7 + 0.6 * vnoise(mix(uCamL, P, 0.6) * 0.045 + vec3(uTime * 0.06, -uTime * 0.1, uTime * 0.045));
  // (not inside the tube: its wall shuts the hall's beam out, and it has its own haze)
  col += uStarCol * (uStar * 0.13 * gBeam * (1.0 - exp(-6.0 * uBeam * dust * beamScatter(P, frag))));
  col += uStarCol * (uStar * uShaft.x * gBeam * (1.0 - exp(-0.036 * dust * shaftScatter(P))));
  float lum = dot(col, vec3(0.3, 0.55, 0.15));
  col = mix(col, uFlash.rgb * (lum * 1.7 + 0.05 * dot(alb, vec3(0.333))), uFlash.a);
  return col;
}
`,ce=`
varying vec3 vQ; varying vec3 vP;
void main(){ vQ = position; vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,ue=`
uniform vec3 uCtr; uniform vec3 uKeyDir; uniform vec3 uCamL; uniform float uTime; uniform vec4 uTube; uniform vec4 uTube2; uniform vec4 uLensLook; uniform vec4 uLensLook2; uniform vec3 uStarCol; uniform float uStar; uniform vec4 uLensR;
varying vec3 vQ; varying vec3 vP;
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm2(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * vn2(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
float erfL(float x){ float x2 = x * x; float t = 1.0 - exp(-x2 * (1.2732395 + 0.147 * x2) / (1.0 + 0.147 * x2)); return sign(x) * sqrt(max(t, 0.0)); }
vec3 spectrum(float t){ t = clamp(t, 0.0, 1.0);       // red at 0 through gold, green and blue to violet at 1
  vec3 c = clamp(vec3(1.6 - 3.2 * t, 1.5 - abs(t - 0.42) * 4.2, 3.4 * t - 1.5), 0.0, 1.0); c.r += 0.5 * smoothstep(0.82, 1.0, t); return c; }
vec3 starLayer(vec2 p, float sc, float pix, float seed, float boost, float kmin){
  vec2 g = p * sc; vec2 id = floor(g); vec2 f = g - id - 0.5;
  float h = h21(id + seed);
  vec2 o = (vec2(h21(id + seed + 11.3), h21(id + seed + 23.7)) - 0.5) * 0.7;
  float r0 = 0.045 + 0.1 * h * h; float r = max(r0, 1.3 * pix * sc); float k = max(r0 / r, kmin);
  float dd = length(f - o);
  float tw = 0.7 + 0.3 * sin(uTime * (2.0 + 4.0 * h) + h * 90.0);
  float c = 1.0 - smoothstep(0.0, r, dd);
  float hc = h21(id + seed + 5.0);
  vec3 tint = mix(vec3(0.66, 0.8, 1.0), vec3(1.0, 0.8, 0.5), step(0.7, hc)); tint = mix(tint, vec3(1.0, 0.5, 0.38), step(0.93, hc));
  return tint * (h * h * h * boost * tw * c * c * k * k);
}
void main(){
  vec3 e1 = vec3(1.0, 0.0, 0.0); vec3 e2 = vec3(0.0, uKeyDir.z, -uKeyDir.y);
  vec3 rel = vQ - uCtr; vec2 q = vec2(dot(rel, e1), dot(rel, e2)) / uLensR.x; float r = length(q);
  vec3 Vd = vP - uCamL; float dist = length(Vd); Vd = Vd / max(dist, 1e-3);
  vec2 vq = vec2(dot(Vd, e1), dot(Vd, e2));
  // the image stands at infinity: it leans with the eye, and the glass bends it harder toward the rim
  vec2 im = q * (0.4 + 0.2 * r * r) + vq * 1.5 + vec2(uTime * 0.0022, uTime * 0.0006);
  float pix = max(length(dFdx(im)), length(dFdy(im)));
  // the Milky Way across the glass, mottled, with dust lanes
  vec2 bn = vec2(0.5, 0.866); vec2 bt = vec2(0.866, -0.5);
  float b = dot(im, bn) + 0.05 + 0.06 * sin(dot(im, bt) * 5.0);
  float band = exp(-b * b * 17.0);
  float cl = fbm2(im * 4.2 + 2.0); float cl2 = fbm2(im * 9.0 + vec2(5.0, 1.0));
  float lane = smoothstep(0.36, 0.6, cl2 + abs(b) * 1.5);
  float cl5 = cl * cl; cl5 = cl5 * cl5 * cl;
  float mw = band * (0.015 + 7.0 * cl5) * mix(0.03, 1.0, lane);      // star clouds in knots with black between them, not a veil
  vec3 col = vec3(0.004, 0.008, 0.022);
  col += mix(vec3(0.26, 0.46, 1.0), vec3(1.0, 0.72, 0.4), smoothstep(0.4, 0.7, cl2)) * (0.2 * uLensLook.x * mw);
  vec2 cq = im - bt * 0.24; float core = exp(-dot(cq, cq) * 6.0);
  col += vec3(1.0, 0.68, 0.32) * (core * band * lane * (0.3 + 0.7 * uLensLook2.x) * (0.3 + 1.4 * cl * cl));
  // nebulae: rose knots strung along the band, a thin green-blue veil beside them
  float nb = smoothstep(0.52, 0.8, fbm2(im * 6.5 + vec2(9.0, 3.0))) * smoothstep(0.25, 0.9, band);
  float nt = smoothstep(0.5, 0.85, fbm2(im * 5.0 + vec2(1.0, 17.0))) * smoothstep(0.05, 0.6, band) * (1.0 - nb);
  col += (vec3(1.0, 0.16, 0.4) * (nb * 0.95) + vec3(0.06, 0.8, 0.68) * (nt * 0.42)) * uLensLook.x;
  { float n3 = fbm2(im * 7.0 + vec2(3.0, 11.0)), n4 = fbm2(im * 3.6 + vec2(21.0, 5.0));
    col += mix(vec3(1.0, 0.2, 0.42), mix(vec3(0.1, 0.72, 0.8), vec3(0.45, 0.3, 1.0), smoothstep(0.55, 0.75, n4)), smoothstep(0.38, 0.56, n4)) * (smoothstep(0.4, 0.72, n3) * 0.5 * (0.5 + 0.5 * uLensLook.x)); }
  // the Large Cloud, with its one bright rose knot
  vec2 lc = im - vec2(-0.2, 0.2) + bt * 0.02; float l1 = exp(-dot(lc, lc) * 40.0);
  vec2 lk = lc - vec2(0.05, -0.03);
  col += (vec3(0.5, 0.68, 1.0) * (l1 * (0.1 + 0.55 * fbm2(im * 24.0))) + vec3(1.0, 0.3, 0.46) * (0.9 * exp(-dot(lk, lk) * 2600.0))) * uLensLook.y;
  // stars, crowded along the band
  float dens = 1.0 + 2.6 * band * uLensLook.x + 2.0 * l1 * uLensLook.y;
  vec3 st = starLayer(im, 22.0, pix, 0.0, 22.0, 0.55) + starLayer(im, 52.0, pix, 40.0, 13.0 * dens, 0.25) + starLayer(im, 120.0, pix, 80.0, 6.0 * dens, 0.0);
  // the hour before dawn: the field shades to teal; a comet stands in it with its tail up
  float el = smoothstep(-0.45, 0.45, dot(im, vec2(0.0, 1.0)));
  col = mix(col, mix(vec3(0.012, 0.1, 0.11), vec3(0.006, 0.022, 0.07), el) + col * 0.7, uLensLook.w);
  st *= mix(1.0, mix(0.3, 1.0, el), uLensLook.w);
  vec2 cm = im - vec2(0.16, -0.08); float ct = dot(cm, vec2(-0.26, 0.966)); float cs = length(cm - vec2(-0.26, 0.966) * ct);
  float cw = 0.006 + 0.16 * max(ct, 0.0);
  col += vec3(0.6, 0.94, 1.0) * (uLensLook2.y * (exp(-dot(cm, cm) * 9000.0) * 6.0 + exp(-dot(cm, cm) * 500.0) * 0.6 + exp(-cs * cs / (cw * cw)) * exp(-max(ct, 0.0) * 5.0) * smoothstep(0.0, 0.02, ct) * 0.9));
  col += st;
  // racing cloud under the moon: silver-edged rags cross the glass
  vec2 cp = im * 2.4 + vec2(uTime * 0.05, uTime * 0.012); float cn = fbm2(cp) + 0.12 * (vn2(cp * 5.0) - 0.5);
  float cc = smoothstep(0.49, 0.53, cn) * uLensLook.z;
  float cm2 = fbm2(cp + vec2(0.1, 0.12)) + 0.12 * (vn2((cp + vec2(0.1, 0.12)) * 5.0) - 0.5);
  float edge = smoothstep(0.478, 0.495, cn) * (1.0 - smoothstep(0.5, 0.535, cn)) * clamp((cn - cm2) * 9.0, 0.0, 1.0) * uLensLook.z;
  col = mix(col, vec3(0.006, 0.008, 0.016), cc * 0.9) + vec3(0.62, 0.72, 0.9) * (edge * 0.45);
  col *= uTube.z * uLensR.y;
  // the glass itself: colour fringes at the rim, a seat of light round the opening at its heart, a faint sheen and rings of interference
  float ang = atan(q.y, q.x + (abs(q.x) < 1e-5 ? 1e-4 : 0.0));
  float fr = smoothstep(0.845, 0.875, r) * (1.0 - smoothstep(0.955, 0.972, r));
  float shim = 0.55 + 0.45 * sin(ang * 5.0 + uTime * 0.6 + 3.0 * sin(ang * 2.0 - uTime * 0.23));
  col = col * (1.0 - 0.55 * fr) + spectrum((r - 0.86) / 0.1) * (fr * uTube.z * (0.5 + 0.45 * shim + 1.2 * dot(col, vec3(0.3, 0.5, 0.2))));
  float ri = uLensR.w / uLensR.x; float inner = exp(-(r - ri) * (r - ri) * 500.0);
  col += (uStarCol * 0.5 + spectrum(0.5 + 6.0 * (r - ri)) * 0.4) * (inner * uTube.z * 0.3);
  col += uStarCol * (0.012 * uTube.z * (0.5 + 0.5 * sin(r * r * 70.0 - uTime * 0.4)) + 0.03 * uTube.z * exp(-dot(q - vec2(-0.45, 0.5), q - vec2(-0.45, 0.5)) * 9.0));
  // haze in the tube between the eye and the glass
  vec3 oc = uCamL - uCtr; float ra = dot(Vd, uKeyDir), oa = dot(oc, uKeyDir);
  vec3 rp = Vd - uKeyDir * ra, op = oc - uKeyDir * oa;
  float a = max(dot(rp, rp), 1e-5), bb = dot(op, rp), c2 = dot(op, op), sa = sqrt(a);
  float t0 = min(uTube2.x, dist);
  float hz = max(exp(-max(c2 - bb * bb / a, 0.0) / 21.16) * (4.0765 / sa) * (erfL(sa * (dist + bb / a) / 4.6) - erfL(sa * (t0 + bb / a) / 4.6)), 0.0);
  col += uStarCol * (0.06 * uTube.y * (1.0 - exp(-0.0065 * hz)));
  gl_FragColor = vec4(col, 1.0);
}`,O0=`
attribute vec4 aK;
uniform mat4 uBone[${Wt}]; uniform mat4 uHeroInv; uniform float uSpin; uniform float uShut; uniform float uTime;
uniform vec4 uIrisA; uniform vec3 uIrisC; uniform vec3 uIrisP;      // the iris: the tube's axis and the leaves' swing; a point of the axis; leaf 0's pivot (all in the machine's rest frame)
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying vec3 vL; varying vec2 vUv; varying vec4 vK;
#include <fog_pars_vertex>
vec3 turnAbout(vec3 v, vec3 a, float ang){ float c = cos(ang), s = sin(ang); return v * c + cross(a, v) * s + a * (dot(a, v) * (1.0 - c)); }
void main(){
  vec3 p = position, n = normal;
  #ifdef SPIN
    float cs = cos(uSpin), sn = sin(uSpin);
    p.xy = vec2(cs * p.x - sn * p.y, sn * p.x + cs * p.y); n.xy = vec2(cs * n.x - sn * n.y, sn * n.x + cs * n.y);
  #endif
  #ifdef SHUT
    // the leaves ride the dome's curve as they part: each point is slid along x as before and kept on a sphere 0.9 m larger than its
    // own distance from the dome's centre, so a leaf stays between the skin (160 m; its skirt 160.4) and the sky in the slit (163.6 m)
    // at every opening: the lip's foot stands about 0.2 m outside the skirt, the boards 0.2 m inside the sky's facets. Slid flat, a
    // leaf stood outside that sky from part way along itself (wholly, past half open), the sky hid it, and sky showed through the
    // closed part of the cut. The slide is no rigid turn, so a normal goes by the slide's own law: a wall of constant x keeps facing
    // along x, a board keeps facing the dome's centre.
    float sr = length(p), sq = max(length(p.yz), 1e-3), sx = p.x + uShut * sign(aK.z - 0.5), sr1 = sr + 0.9, sq1 = sqrt(max(sr1 * sr1 - sx * sx, 1.0));
    vec3 se = vec3(0.0, p.yz / sq); float snr = dot(n, se), sB = sr1 * sq / (sr * sq1), sA = (sr1 * p.x / sr - sx) / sq1;
    n = normalize(vec3(n.x - sA / sB * snr, 0.0, 0.0) + se * (snr / sB) + (n - vec3(n.x, 0.0, 0.0) - se * snr) * (sq / sq1));
    p = vec3(sx, p.yz * (sq1 / sq));
  #endif
  #ifdef ROPE
    float rw = sin(3.14159 * fract(uv.x / ROPE_SPAN)); rw *= rw;
    p.y += sin(uTime * 0.9 + uv.x * 0.031) * 0.5 * rw; p.xz *= 1.0 + sin(uTime * 0.63 + uv.x * 0.017) * 0.002 * rw;
  #endif
  vL = p;
  float bi = aK.x;
  if (bi > ${(Wt-.5).toFixed(1)}) {
    // a leaf of the iris (all authored as leaf 0): swung in its own plane about its pivot, turned to its place round the axis, then the tube's bone
    float ph = (bi - ${Wt.toFixed(1)}) * ${(2*Math.PI/U0).toFixed(8)};
    p = uIrisP + turnAbout(p - uIrisP, uIrisA.xyz, uIrisA.w); p = uIrisC + turnAbout(p - uIrisC, uIrisA.xyz, ph);
    n = turnAbout(turnAbout(n, uIrisA.xyz, uIrisA.w), uIrisA.xyz, ph);
    bi = 2.0;
  }
  mat4 bm = uBone[int(bi + 0.5)];
  vec4 lp = bm * vec4(p, 1.0); vec3 ln = mat3(bm) * n;
  #ifdef USE_INSTANCING
    lp = instanceMatrix * lp; ln = mat3(instanceMatrix) * ln;
  #endif
  vec4 wp = modelMatrix * lp; vec3 wn = mat3(modelMatrix) * ln;
  vP = (uHeroInv * wp).xyz; vN = mat3(uHeroInv) * wn;
  vC = color; vUv = uv; vK = aK;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,_0=`
varying vec3 vP; varying vec3 vN; varying vec3 vC; varying vec3 vL; varying vec2 vUv; varying vec4 vK;
uniform vec2 uRun; uniform vec3 uBrass;
#include <fog_pars_fragment>
${W0}
float aaLine(float d, float w, float aa){ aa = max(aa, 1e-4); return (1.0 - smoothstep(w - aa, w + aa, d)) * min(1.0, w / aa + 0.15); }
float plateRivets(vec2 uv, float PL, float PV, out float seam){
  float su = uv.x / PL; float du = (su - floor(su + 0.5)) * PL;
  vec2 c1 = vec2(abs(du) - 0.5, mod(uv.y, 1.1) - 0.55);
  float row = floor(su); float vv = uv.y + row * PV * 0.37;
  float dv = (fract(vv / PV + 0.5) - 0.5) * PV;
  vec2 c2 = vec2(abs(dv) - 0.5, mod(uv.x, 1.1) - 0.55);
  seam = min(abs(du), abs(dv));
  return min(length(c1), length(c2));
}
float pierShadow(vec3 P){
  vec3 d = uKeyDir; d = mix(d, vec3(1e-4), step(abs(d), vec3(1e-4)));
  vec3 t0 = (vec3(${(et-7.5).toFixed(1)}, -60.0, ${(mt-15).toFixed(1)}) - P) / d, t1 = (vec3(${(et+7.5).toFixed(1)}, 140.0, ${(mt+15).toFixed(1)}) - P) / d;
  vec3 tmin = min(t0, t1), tmax = max(t0, t1);
  float tn = max(max(tmin.x, tmin.y), tmin.z), tf = min(min(tmax.x, tmax.y), tmax.z);
  return 1.0 - 0.85 * smoothstep(0.0, 5.0, tf - max(tn, 0.0));
}
// contact shadows on the deck: whoever stands things on the rising floor hands their footprints (A: centre x, z and the cosine and
// sine of the turn; B: half sizes, softness in metres, strength). A soft dark foot under each; none handed, nothing changes.
uniform vec4 uFootA[24]; uniform vec4 uFootB[24]; uniform float uFootN;
float footShade(vec2 q){
  float s = 1.0;
  for (int i = 0; i < 24; i++) {
    if (float(i) >= uFootN) break;
    vec4 a = uFootA[i], b = uFootB[i]; vec2 d = q - a.xy;
    vec2 l = abs(vec2(d.x * a.z - d.y * a.w, d.x * a.w + d.y * a.z)) - b.xy;
    float dist = length(max(l, 0.0)) + min(max(l.x, l.y), 0.0);
    s *= 1.0 - b.w * (1.0 - smoothstep(-0.5 * b.z, b.z, dist));
  }
  return max(s, 0.3);      // (feet that overlap never go to black)
}
// the iris's leaves are lit only where they stand in the lens's cone of light, which the baffles' openings follow (7.5 m at the lowest
// ring, 0.0188 m wider for each metre up the axis): behind their ring, open, they are blackened plate in the dark
float irisLit(vec3 P){ vec3 pa = P - uCtr; float s = dot(pa, uKeyDir); float r = length(pa - uKeyDir * s); float ri = 7.5 + (s + 81.0) * 0.0188; return 1.0 - smoothstep(ri - 0.05, ri + 0.2, r); }
// the painted sky on the dome's boards: the stars dealt to the bay i round the hull (of 48) and m up it (purlin to purlin): k 0 the
// bay's own star (two bays in three have one: a few large, most small), k 1 a lesser one (every other bay). xy: its place off the
// bay's middle (bays across, metres up); z: its radius in metres (0: none); w: how much of its leaf is left
vec4 domeStar(float i, float m, float bayM, float k){ vec3 sid = vec3(mod(i, 48.0), m, 21.0 + 40.0 * k); float mag = hash31(sid); mag *= mag;
  float r = max(min(min(mix(mix(1.3, 5.0, mag), mix(0.9, 2.0, mag), k), 0.27 * bayM), 0.5 * bayM - 0.9), 0.0) * step(mix(0.34, 0.5, k), hash31(sid + 5.0));
  // (no star reaches a rib, 0.8 m to either side of the bay's edge, or a purlin; toward the crown, where the bays narrow, they shrink away)
  return vec4((hash31(sid + 11.0) - 0.5) * 2.0 * max(min(0.44, 0.5 - 0.9 / bayM) - r / bayM, 0.0), (hash31(sid + 17.0) - 0.5) * 2.0 * max(6.2 - r, 0.0), r, 0.55 + 0.45 * hash31(sid + 23.0)); }
// an eight-pointed star of radius sr about the origin of sp (metres on the boards), 1 inside it; saa: metres under a pixel
float domeStarInk(vec2 sp, float sr, float saa){
  float sk = abs(fract(atan(sp.y, sp.x + (abs(sp.x) < 1e-4 ? 2e-4 : 0.0)) * 1.2732395 + 0.5) - 0.5) * 2.0;      // 0 on a point, 1 between two of the eight
  float er = sr * 0.34 / (0.34 + 0.66 * sk);
  return (1.0 - smoothstep(er - saa, er + saa, length(sp))) * min(1.0, sr / (1.6 * saa)) * smoothstep(0.5, 0.9, sr); }
void main(){
  float kind = floor(vK.y + 0.5);
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = uCamL - vP; V = V / max(length(V), 1e-3);
  vec3 alb = vC; float metal = 0.0, gloss = 0.25, ao = vK.w, h = 0.0; vec3 emis = vec3(0.0);
  float pixW = max(max(fwidth(vP.x), fwidth(vP.y)), fwidth(vP.z));          // metres per pixel here
  float lodA = 1.0 - smoothstep(0.1, 0.34, pixW), lodB = 1.0 - smoothstep(0.3, 1.0, pixW);   // fine (0.5 m) and middling (2 m) detail
  float n1 = vnoise(vP * 0.31 + vK.z * 7.0), n2 = mix(0.5, vnoise(vP * 2.3 + 3.1), lodA);
  float domeK = smoothstep(${(X-12).toFixed(1)}, ${(X+2).toFixed(1)}, vP.y);
  float pat = step(-5000.0, vUv.x);
  float fw = max(fwidth(vUv.x), fwidth(vUv.y));
  float near = 1.0 - smoothstep(0.1, 0.45, fw);
  float fwx = fwidth(vUv.x); float fwb = fwidth(vUv.y); float pixR = max(fwidth(vP.x), fwidth(vP.z)); float rimK = 1.0;
  float key = 1.0; float tubeIn = 0.0; float tubeLit = 0.0; float cellIn = 0.0; float cellLobe = 0.0; float cellAng = 0.0;
  float sAxF = fwidth(dot(vP - uCtr, uKeyDir));          // metres of the tube's axis under one pixel
  if (kind < 0.5 || (kind > 2.5 && kind < 3.5)) gTint = 0.72 * (1.0 - step(0.002, abs(vK.z - 0.5625)));      // the observing ladder (the world tags it): timber and iron in their own colours
  float enK = 0.0; vec3 enSet = vec3(0.0); float enA = 1.0;              // the white enamel of the great tube: its plates, and the set of each
  #ifdef SLITWIN
    if (abs(vL.x) > uSlit.x) discard;
    float dustW = 0.7 + 0.6 * vnoise(mix(uCamL, vP, 0.6) * 0.045 + vec3(uTime * 0.06, -uTime * 0.1, uTime * 0.045));
    vec3 air = uStarCol * (uStar * 0.16 * (1.0 - exp(-6.0 * uBeam * beamScatter(vP, gl_FragCoord.xy))));
    air += uStarCol * (uStar * uShaft.x * (1.0 - exp(-0.036 * dustW * shaftScatter(vP))));
    air += uStarCol * (uSlitGlow * (1.0 - smoothstep(0.5, 1.0, abs(vL.x) / max(uSlit.x, 0.5))));     // the first blade of sky: a faint bright seam
    gl_FragColor = vec4(air, 1.0);
  #else
  if (kind < 2.5) {
    // 0 painted iron, 1 brass, 2 white enamel: riveted plate where the part carries plate coordinates
    float albM0 = max(alb.r, max(alb.g, alb.b));
    if (pat > 0.5) {
      float seam; float d = plateRivets(vUv, kind > 1.5 ? 8.5 : 6.5, kind > 1.5 ? 15.7 : 11.0, seam);
      float riv = (1.0 - smoothstep(0.13, 0.25, d)) * near;
      float ring = smoothstep(0.18, 0.26, d) * (1.0 - smoothstep(0.26, 0.42, d)) * near;
      float groove = aaLine(seam, 0.05, fw);
      h = riv * 0.09 - groove * 0.05 * near;
      alb *= 1.0 - 0.2 * ring - 0.28 * groove + 0.05 * riv;
      if (kind > 1.5) {
        // the great tube is plated: from across the hall its seams stay a pixel wide and the rivet rows beside them read as one soft
        // line; every plate has a tone of its own, lies a little proud of its seams and is set a hair off its neighbours, so the gloss
        // breaks from plate to plate
        float prow = floor(vUv.x / 8.5); vec3 pid = vec3(prow, floor((vUv.y + prow * 15.7 * 0.37) / 15.7 + 0.5), 2.0);
        float far = 1.0 - near;
        float grooveF = aaLine(seam, max(0.05, 0.62 * fw), fw);
        float rows = 1.0 - smoothstep(0.55, 1.15, seam);
        alb *= 1.0 - 0.3 * max(grooveF - groove, 0.0) - 0.085 * rows * far;
        alb *= 1.0 + 0.09 * aaLine(abs(seam - max(0.16, 1.5 * fw)), max(0.05, 0.5 * fw), fw);
        float pt = hash31(pid), pc = hash31(pid + 7.3);
        alb *= (0.87 + 0.18 * pt) * mix(vec3(0.965, 0.985, 1.01), vec3(1.01, 0.99, 0.96), pc);      // (hardly a plate brighter than the plain enamel was: the tube throws no more glow on the hall than before it was plated)
        h -= 0.11 * exp(-seam / 0.8);
        enK = 1.0; enSet = (vec3(pc, hash31(pid + 13.1), hash31(pid + 29.7)) - 0.5) * 0.055;
      } else if (kind < 0.5) {
        // painted iron is plated as the tube is: from across the hall its seams stay a pixel wide and the rivet rows beside them read
        // as one soft line; every plate has a tone of its own that ends at its own seams and lies a little proud of them, so a far
        // face of the pier or of the mount still reads as built of plates
        float prow = floor(vUv.x / 6.5); vec3 pid = vec3(prow, floor((vUv.y + prow * 11.0 * 0.37) / 11.0), 0.0);
        float far = 1.0 - near;
        float grooveF = aaLine(seam, max(0.05, 0.62 * fw), fw);
        float rows = 1.0 - smoothstep(0.55, 1.15, seam);
        alb *= 1.0 - 0.28 * max(grooveF - groove, 0.0) - 0.1 * rows * far;
        alb *= 1.0 + 0.12 * aaLine(abs(seam - max(0.16, 1.5 * fw)), max(0.05, 0.5 * fw), fw);
        alb *= 0.84 + 0.26 * hash31(pid);
        h -= 0.08 * exp(-seam / 0.8);
      } else alb *= 0.9 + 0.13 * hash31(vec3(floor(vUv.x / 6.5), floor(vUv.y / 11.0), kind));
    }
    float streak = mix(0.5, vnoise(vec3(vP.x * 1.3, vP.y * 0.11, vP.z * 1.3)), lodB);
    if (kind < 0.5) { gloss = 0.3; alb *= 0.8 + 0.25 * n1 + 0.12 * (streak - 0.5) + 0.06 * (n2 - 0.5); gAmb = mix(uAmbK.y, uAmbK.z * 0.85, domeK); gFill = mix(uAmbK.w, 1.0, domeK); }
    else if (kind < 1.5) { gAmb = mix(0.75, 1.0, domeK); metal = 1.0; gloss = 0.8 - 0.22 * n1; gSpec = 2.4; alb = min(uBrass * (dot(vC, vec3(0.333)) * 3.4) * (0.8 + 0.25 * n1 + 0.2 * (streak - 0.5)), vec3(0.95)); h += (n2 - 0.5) * 0.01;
      // the retaining ring round the lens cell's bore, seen from inside the tube: a glint that wanders round it as stars cross the cell
      float sAx = dot(vP - uCtr, uKeyDir); vec3 qa = vP - uCtr - uKeyDir * sAx; float ra2 = dot(qa, qa);
      float cellK = smoothstep(101.5, 103.0, sAx) * (1.0 - smoothstep(136.0, 146.0, ra2)) * step(sAx, 114.2);
      float ang = atan(qa.y * uKeyDir.z - qa.z * uKeyDir.y, qa.x + (abs(qa.x) < 1e-4 ? 2e-4 : 0.0));
      float lobe = 0.5 + 0.5 * cos(ang * 2.0 - uTime * 0.35); lobe *= lobe; lobe *= lobe;
      emis += tubeRings(sAx, ang) * (0.04 * cellK * uTube.z); tubeIn = cellK; cellIn = cellK; cellLobe = lobe; cellAng = ang; gSpec = 2.4; key *= 1.0 - cellK; gFill *= 1.0 - cellK; }
    else { gloss = 0.78; alb *= 0.86 + 0.13 * n1 + 0.1 * (streak - 0.5); gWrap = 1.0;
      enA = clamp(max(alb.r, max(alb.g, alb.b)) / max(albM0 * 1.04, 1e-3), 0.3, 1.0); }      // (how much of the plain enamel's white this plate, seam or rivet keeps: its own tone, for the knee below)
  } else if (kind < 3.5) {
    // 3 painted timber (ribs, purlins)
    float g = pat > 0.5 ? mix(0.5, vnoise(vec3(vUv.x * 0.35, vUv.y * 5.0, vK.z * 31.0)), lodA) : n2;
    alb *= 0.78 + 0.3 * g + 0.14 * (n1 - 0.5); gloss = 0.2; rimK = mix(1.0, 0.2, domeK); gWrap = 1.0 - domeK;
    gAmb = mix(uAmbK.y, uAmbK.z, domeK); gFill = mix(uAmbK.w, 1.0, domeK);
  } else if (kind < 4.5) {
    alb *= 0.7 + 0.6 * n1; gloss = 0.35; rimK = 0.0; key = 0.0; gFill = 0.0; gAmb = 0.4; tubeIn = 1.0; tubeLit = 1.0;          // 4 blackened interior: lit by the lens from one end and the hall from the other
    if (vK.x > ${(Wt-.5).toFixed(1)}) {      // a leaf of the iris: the light of its own lip (the ring's own colour and breath, as the lips below reckon it) spills a little way across the plate
      float sI = dot(vP - uCtr, uKeyDir); float rkI = floor((sI + 81.0) / 17.0 + 0.5);
      vec3 lipI = mix(vec3(0.6, 0.76, 1.0), mix(vec3(0.34, 0.6, 1.0), vec3(1.0, 0.66, 0.24), mod(rkI, 2.0)) * 1.25, 0.8 * smoothstep(-70.0, 30.0, sI)) * (uTube2.w * (1.5 + 0.35 * smoothstep(-100.0, 112.0, sI)));
      emis += lipI * ((0.84 + 0.24 * sin(uTime * (0.8 + 0.13 * rkI) + rkI * 2.4) + 0.08 * sin(uTime * 3.1 + rkI)) * 0.2 * exp(-vUv.y / 0.3) * irisLit(vP)) * mix(vec3(1.0), vec3(1.5, 0.74, 0.2), 0.9); }      // the spill takes the bronze of the bay the leaves stand in
    if (pat > 0.5) { float seam; float d = plateRivets(vUv, 8.5, 15.7, seam); float riv = (1.0 - smoothstep(0.13, 0.25, d)) * near; h = riv * 0.12 - aaLine(seam, 0.06, fw) * 0.05 * near; alb *= 1.0 + 1.0 * riv - 0.55 * aaLine(seam, 0.06, fw); alb *= 0.8 + 0.4 * hash31(vec3(floor(vUv.x / 8.5), floor(vUv.y / 15.7), 4.0));
      { float sT = dot(vP - uCtr, uKeyDir); float nb = mod(floor((sT + 81.0) / 17.0), 2.0) * (1.0 - smoothstep(26.0, 54.0, sT - dot(uCamL - uCtr, uKeyDir))) * near;      // the gold bay beside the eye: plate seams with a dark line and a bright edge
        alb *= 1.0 + nb * (1.1 * aaLine(abs(seam - 0.2), 0.07, fw) - 0.35 * aaLine(seam, 0.09, fw) + 0.7 * riv); } }
  } else if (kind < 5.5) {
    float glowK = uLampGlow; vec3 lipC = vC; float lipG = 8.0;                       // 5 lamp glass, baffle lips
    if (vK.z > 0.5) { float sAx = dot(vP - uCtr, uKeyDir); float rk = floor((sAx + 81.0) / 17.0 + 0.5);      // each baffle's rim breathes on its own clock
      glowK = 0.84 + 0.24 * sin(uTime * (0.8 + 0.13 * rk) + rk * 2.4) + 0.08 * sin(uTime * 3.1 + rk);
      float gl = smoothstep(-100.0, 112.0, sAx);
      // pale rings from the tail on; toward the lens they take its two colours in turn
      lipC = mix(vec3(0.6, 0.76, 1.0), mix(vec3(0.34, 0.6, 1.0), vec3(1.0, 0.66, 0.24), mod(rk, 2.0)) * 1.25, 0.8 * smoothstep(-70.0, 30.0, sAx)) * (uTube2.w * (1.5 + 0.35 * gl)); tubeIn = 1.0;
      if (vK.x > ${(Wt-.5).toFixed(1)}) lipC *= irisLit(vP);      // (a leaf's lip, not a ring's)
      lipG = 1.0 / max(vK.w, 0.05); }
    emis = lipC * (vK.w * lipG) * glowK; alb = vec3(0.02); ao = 1.0;
  } else if (kind < 6.5) {
    metal = 0.85; gloss = 0.5; alb *= 0.8 + 0.4 * n1;           // 6 bright steel
  } else if (kind < 7.5 || (kind > 8.5 && kind < 9.5)) {
    // 7 dome boards (slit cut away), 9 shutter boards
    if (kind < 7.5 && abs(vL.x) < ${xt.toFixed(1)} && vL.z > ${Xt.toFixed(1)}) discard;
    vec2 bu = vUv.yx;
    float bw = 2.6; float bi = floor(bu.y / bw); float bf = fract(bu.y / bw);
    float bay = floor(bu.x * 0.5 + 0.5 * mod(bi, 2.0)); float jf = fract(bu.x * 0.5 + 0.5 * mod(bi, 2.0));
    float id = hash31(vec3(bi, bay, 3.0));
    float gap = clamp(aaLine(min(bf, 1.0 - bf) * bw, 0.17, fwx) + aaLine(min(jf, 1.0 - jf), 0.006, fwb * 0.5), 0.0, 1.0);
    float bfade = 1.0 - smoothstep(0.15, 0.6, fwx); rimK = 0.12;
    float grain = mix(0.5, vnoise(vec3(bu.x * 9.0, bu.y * 1.6, id * 40.0)), lodA);
    float panel = hash31(vec3(floor(vUv.y + 0.5), floor(vUv.x / 14.0 + 0.5), 7.0));       // each bay between two ribs and two purlins is its own batch of boards
    float stain = vnoise(vec3(vUv.y * 2.3, vUv.x * 0.05, 5.0)) * 0.6 + vnoise(vec3(vUv.y * 0.7, vUv.x * 0.021, 9.0)) * 0.4;      // weather run down the meridians
    alb *= (1.0 + (0.5 * id - 0.25) * (0.3 + 0.7 * bfade) * (0.35 + 0.65 * lodB)) * (0.9 + 0.2 * grain) * (1.0 - 0.6 * gap * (0.4 + 0.6 * bfade)) * (0.82 + 0.36 * n1);
    alb *= (0.88 + 0.24 * panel) * (0.72 + 0.56 * stain);
    // a painted sky: the boards of dome and shutters are painted a night blue, and in each bay between two ribs and two purlins
    // the dome's boards carry stars in worn gold leaf, dealt by the bay: its own star in two bays of three (a few large, most
    // small) and a lesser one in every other bay, each where the deal sets it between the timbers, each with more or less of its
    // leaf left. It is paint: it takes the light the boards take
    alb *= vec3(0.7, 0.8, 1.06);
    if (kind < 7.5) {
      float sbi = floor(vUv.y + 0.5), smi = floor(vUv.x / 14.0);
      float bayM = 0.1309 * max(length(vL.xz), 1.0);                                  // the bay's width here, metres
      float saa = max(max(fwx, fwb * bayM), 0.03), gilt = 0.0;
      for (int k = 0; k < 2; k++) {
        vec4 st = domeStar(sbi, smi, bayM, float(k));
        gilt = max(gilt, st.w * domeStarInk(vec2((vUv.y - sbi - st.x) * bayM, vUv.x - 14.0 * (smi + 0.5) - st.y), st.z, saa));
      }
      gilt *= (0.62 + 0.38 * vnoise(vec3((vUv.y - sbi) * bayM * 1.1, vUv.x * 1.1, id * 30.0 + sbi))) * (1.0 - 0.45 * gap * bfade);      // leaf worn thin in patches, lost in the joints between boards
      alb = mix(alb, vec3(1.0, 0.76, 0.32) * (0.8 + 0.2 * grain), gilt);
    }
    h = -gap * 0.12 * bfade; gloss = 0.22;
    gAmb = uAmbK.z; gFill = 1.0; gKey = 0.6;
  } else if (kind < 8.5) {
    // 8 the rising floor: radial boards in rings, brass meridian strip, the pier's hole
    vec2 q = vP.xz; vec2 hq = abs(q - uHole.xy) - uHole.zw;
    if (max(hq.x, hq.y) < 0.0) discard;
    float holeD = length(max(hq, 0.0));
    float r = length(q); float ringW = 12.5; float ri = floor(r / ringW); float rf = fract(r / ringW);
    float cnt = max(floor(6.2832 * (ri + 0.5) * ringW / 2.6), 6.0);
    float an = atan(q.y, q.x + (abs(q.x) < 1e-4 ? 3e-4 : 0.0)) / 6.2832 + 0.5; float ai = floor(an * cnt + ri * 0.37); float af = fract(an * cnt + ri * 0.37);
    float id = hash31(vec3(ai, ri, 9.0));
    float pix = pixR;
    float gap = aaLine(min(af, 1.0 - af) * 2.6, 0.08, pix); float ffade = 1.0 - smoothstep(0.15, 0.6, pix); rimK = 0.12;
    float curb = aaLine(min(rf, 1.0 - rf) * ringW, 0.22, pix);
    float grain = mix(0.5, vnoise(vec3(q * mat2(0.8, 0.6, -0.6, 0.8) * vec2(0.5, 5.0) * 0.6, id * 20.0)), lodA);
    alb *= (1.0 + (0.5 * id - 0.25) * (0.3 + 0.7 * ffade) * lodB) * (0.85 + 0.3 * grain) * (1.0 - 0.55 * gap * (0.3 + 0.7 * ffade)) * (0.85 + 0.3 * n1);
    gAmb = uAmbK.x; gFill = uAmbK.w; gKey = uDeckKey; gSoft = 5.0;       // boards take the bar of starlight at part strength: the white tube stays the brightest thing
    alb = mix(alb, vec3(0.05, 0.055, 0.07), curb * 0.8);
    float strip = 1.0 - smoothstep(0.55, 0.75, abs(q.x));
    alb *= 1.0 + 0.16 * (mod(ri, 2.0) - 0.5) * lodB;                      // the rings of boards alternate a tone
    // brass let into the boards: the meridian, a finer east-west line, and an azimuth circle graduated in ticks
    strip = max(strip, (1.0 - smoothstep(0.3, 0.45, abs(q.y))) * 0.85);
    float dr = r - 103.0; float tk = an * 360.0; float tf = abs(fract(tk + 0.5) - 0.5) / 360.0 * 6.2832 * r;
    float t10 = step(abs(fract(tk / 10.0 + 0.5) - 0.5), 0.051);
    float tick = aaLine(tf, 0.11 + 0.09 * t10, pix) * step(0.0, dr) * step(dr, 1.6 + 2.2 * t10);
    strip = max(strip, max(aaLine(abs(dr + 0.6), 0.28, pix), max(aaLine(abs(dr - 4.6), 0.14, pix), tick * ffade)));
    alb = mix(alb, uBrass * 0.9, strip); metal = strip; gloss = mix(0.3, 0.6, strip);
    ao *= 0.35 + 0.65 * smoothstep(0.0, 14.0, holeD);
    h = -gap * 0.08 * ffade; key = pierShadow(vP);
    { float fs = footShade(q); alb *= fs; }      // the astronomers' things stand on the boards: a soft dark foot under each
    { vec3 pdk = vP - uCtr; float hxp = uDomeCS.x * pdk.x - uDomeCS.y * pdk.z; key *= mix(0.45, 1.0, exp(-hxp * hxp / 420.0)); }      // the bar is brightest down its middle: a band, not a floodlit floor
  } else if (kind > 13.5) {
    // 14 a knotted rug (uv 0..1 across and along): ruby border, night-blue field, a pale medallion, small lozenges
    vec2 c = abs(vUv - 0.5) * 2.0; float edge = max(c.x, c.y);
    vec2 g = vUv * vec2(14.0, 22.0); vec2 gf = abs(fract(g) - 0.5);
    float pf = 1.0 - smoothstep(0.012, 0.05, fw);
    float loz = mix(0.3, 1.0 - smoothstep(0.26, 0.3, gf.x + gf.y), pf);
    float med = 1.0 - smoothstep(0.52, 0.56, length((vUv - 0.5) * vec2(1.0, 1.55)) * 2.4 + 0.07 * sin(atan(vUv.y - 0.5, vUv.x - 0.5 + (abs(vUv.x - 0.5) < 1e-4 ? 2e-4 : 0.0)) * 8.0));
    float b1 = step(0.8, edge) * (1.0 - step(0.93, edge)), b2 = step(0.93, edge);
    vec3 field = mix(vec3(0.035, 0.06, 0.16), vec3(0.36, 0.3, 0.18), loz * 0.8);
    field = mix(field, mix(vec3(0.42, 0.37, 0.27), vec3(0.4, 0.045, 0.07), loz), med);
    vec3 border = mix(vec3(0.42, 0.04, 0.07), vec3(0.42, 0.36, 0.24), mix(0.12, step(0.35, gf.x + gf.y) * (1.0 - step(0.42, gf.x + gf.y)), pf));
    alb = mix(field, border, b1); alb = mix(alb, vec3(0.05, 0.07, 0.15), b2);
    float weave = mix(0.5, hash31(vec3(floor(vUv * vec2(140.0, 220.0)), 2.0)), lodA);
    alb *= (0.8 + 0.4 * weave) * (0.85 + 0.3 * n1); gloss = 0.05; rimK = 0.1;
    gAmb = uAmbK.x * 1.3; gFill = uAmbK.w; gKey = uDeckKey; gSoft = 5.0; key = pierShadow(vP);
    { float fs = footShade(vP.xz); alb *= fs; }      // and on a rug, as on the boards
  } else if (kind > 11.5) {
    // 12 brickwork, 13 stone flags (uv in metres: x up the wall or across the floor, y along it)
    vec2 bu = vUv.yx; float big = step(12.5, kind);
    vec2 sz = mix(vec2(2.7, 0.9), vec2(7.2, 6.4), big);
    float row = floor(bu.y / sz.y); float bx = bu.x / sz.x + mix(0.5, 0.37, big) * mod(row, 2.0) + 0.13 * hash31(vec3(row, 2.0, big)) * big;
    float bi = floor(bx); vec2 f = vec2(fract(bx), fract(bu.y / sz.y));
    float id = hash31(vec3(bi, row, 5.0 + big));
    float mort = clamp(aaLine(min(f.x, 1.0 - f.x) * sz.x, 0.09 + 0.05 * big, fwb) + aaLine(min(f.y, 1.0 - f.y) * sz.y, 0.09 + 0.05 * big, fwx), 0.0, 1.0);
    float bfade = 1.0 - smoothstep(0.2, 0.9, fw);
    float damp = vnoise(vec3(vUv.y * 0.045, vUv.x * 0.014, 3.0 + big));
    alb *= (1.0 + (0.56 * id - 0.28) * (0.2 + 0.8 * bfade) * lodB) * (0.8 + 0.32 * n1) * (0.92 + 0.16 * n2 * bfade) * (0.7 + 0.5 * damp);
    alb = mix(alb, vec3(0.3, 0.32, 0.36) * (0.55 + 0.45 * n1), mort * mix(0.7, 0.5, big) * (0.25 + 0.75 * bfade));
    gAmb = uAmbK.y * 0.9; gFill = uAmbK.w; gKey = 0.5;
    h = -mort * 0.1 * bfade + (id - 0.5) * 0.03 * bfade * big; gloss = mix(0.08, 0.3, big); rimK = 0.22;
  } else {
    // 10 hauling rope (laid strands, running), 11 chain (links, travelling)
    rimK = 1.5; gAmb = mix(uAmbK.y, 1.2, domeK); gFill = mix(uAmbK.w, 1.0, domeK);
    if (kind < 10.5) { float s = fract((vUv.x + uRun.x) * 0.55 + vUv.y * 3.0); alb *= 0.55 + 0.75 * smoothstep(0.0, 0.5, s) * (1.0 - smoothstep(0.5, 1.0, s)) * 2.0; gloss = 0.15; }
    else { float s = fract((vUv.x + uRun.y * (vK.z * 2.0 - 1.0)) / 2.4); float lk = smoothstep(0.0, 0.12, s) * (1.0 - smoothstep(0.78, 0.9, s)); alb *= 0.25 + 0.9 * lk; metal = 0.7; gloss = 0.5; }
  }
  // the dome's share of ambient and sky fill falls away from the slit: near-black far from it, the readable slate only round the opening
  float sNear = slitNear(vP); float dk = mix(uDomeK.x, 1.0, sNear);
  bool isSkin = (kind > 6.5 && kind < 7.5) || (kind > 8.5 && kind < 9.5); bool isRib = kind > 2.5 && kind < 3.5 && domeK > 0.5;
  if (isSkin) { gAmb *= dk; gFill *= dk; }
  else if (kind < 0.5 || (kind > 2.5 && kind < 3.5) || (kind > 9.5 && kind < 11.5)) { float dm = mix(1.0, dk, domeK); gAmb *= dm; gFill *= dm; }
  vec3 domeLit = vec3(0.0);
  if (isSkin || isRib) {
    // the dome's timber is lit by the slit as by a long lamp: brightest in the bays beside the opening, falling away round the hull.
    // Ribs and purlins take it on the face that looks at the slit and throw a shadow on the boards behind them.
    vec3 pd = vP - uCtr; vec3 pl = vec3(uDomeCS.x * pd.x - uDomeCS.y * pd.z, pd.y, uDomeCS.y * pd.x + uDomeCS.x * pd.z);
    float sAng = clamp(atan(pl.y, pl.z + (abs(pl.z) < 1e-4 ? 2e-4 : 0.0)), 0.06, 1.72);
    vec3 q = vec3(clamp(pl.x, -uSlit.x, uSlit.x) * 0.7, sin(sAng) * 0.88 * uSlit.w, cos(sAng) * 0.88 * uSlit.w);
    vec3 Ls = q - pl; Ls = Ls / max(length(Ls), 1e-3);
    float ddx = max(abs(pl.x) - uSlit.x, 0.0), ddz = max(uSlit.y - pl.z, 0.0); float dS = sqrt(ddx * ddx + ddz * ddz + 1e-4);
    float G = (0.55 * exp(-dS / 36.0) + 0.45 * exp(-dS / 150.0)) * smoothstep(0.0, 22.0, uSlit.x);
    float rho = max(length(pl.xz), 1.0); float plen = max(length(pl), 1.0);
    vec3 tH = vec3(pl.z, 0.0, -pl.x) / rho; vec3 tM = vec3(-pl.x / rho * pl.y / plen, rho / plen, -pl.z / rho * pl.y / plen);
    float cT = dot(Ls, tH), cM = dot(Ls, tM);
    vec3 cold = uDomeCol * uStar;
    if (isSkin) {
      float sh = 1.0, occ = 1.0, lift = 1.0;
      if (kind < 7.5) {
        float bayW = 0.1309 * rho; float sR = (fract(vUv.y) - 0.5) * bayW;          // metres from the nearest rib
        float sT = -sign(cT) * sR; float wT = min(1.5 + 7.0 * abs(cT), 0.42 * bayW);
        float shT = (1.0 - smoothstep(0.5, 0.8 + wT, sT)) * step(0.0, sT) * min(abs(cT) * 2.2, 1.0);
        float fm = vUv.x / 14.0; fm = (fm - floor(fm + 0.5)) * 14.0;                   // metres from the nearest purlin ring
        float sM = -sign(cM) * fm; float wM = 1.2 + 4.0 * abs(cM);
        float shM = (1.0 - smoothstep(0.4, 0.6 + wM, sM)) * step(0.0, sM) * min(abs(cM) * 2.2, 1.0);
        sh = 1.0 - uDomeL.w * 0.62 * max(shT, shM);
        occ = 1.0 - 0.3 * max(exp(-abs(sR) / 1.3), exp(-abs(fm) / 1.0));
        lift = 1.0 + 0.4 * ((1.0 - step(0.0, sT)) * exp(-abs(sR) / 3.0) * abs(cT) + (1.0 - step(0.0, sM)) * exp(-abs(fm) / 2.5) * abs(cM));
      }
      domeLit = cold * ((uDomeL.x + uDomeL.y * G) * sh * occ * lift); ao *= sh * occ;
    } else {
      vec3 Ng0 = normalize(vN + vec3(0.0, 1e-5, 0.0)); vec3 Nl = vec3(uDomeCS.x * Ng0.x - uDomeCS.y * Ng0.z, Ng0.y, uDomeCS.y * Ng0.x + uDomeCS.x * Ng0.z);
      float nl = dot(Nl, Ls);
      domeLit = cold * (uDomeL.x * mix(0.4, 1.1, smoothstep(-0.4, 0.5, nl)) + uDomeL.y * G * (0.2 + 2.3 * max(nl, 0.0)));
      ao *= mix(0.5, 1.0, smoothstep(-0.3, 0.3, nl));
    }
    domeLit += uDomeWarm * exp(-max(pd.y, 0.0) / 26.0);
  }
  if (kind > 2.5 && kind < 3.5 && pat > 0.5 && domeK > 0.5) {
    // every rib carries a thin rim of starlight on the edge that faces the slit
    float rho = max(length(vL.xz), 1.0); float fi = atan(vL.x, vL.z + (abs(vL.z) < 1e-4 ? 2e-4 : 0.0)) * 7.6394373 - 0.5;
    float lat = (fi - floor(fi + 0.5)) * 0.1308997 * rho;
    float rr = smoothstep(0.1, 0.62, -lat * sign(vL.x));
    emis += uStarCol * (uStar * uDomeK.z * 0.45 * rr * (0.28 + 0.72 * sNear) * smoothstep(0.0, 9.0, uSlit.x));
  }
  #ifdef SPIN
    rimK = max(rimK, 2.4); gAmb = max(gAmb, 1.25); gFill = 1.0; metal *= 0.6;     // the dome's wheels: a starlight rim lifts them off the wall
  #endif
  // frost (winter look): white bloom on what faces up and on fine relief
  float pixP = max(pixR, fwidth(vP.y));
  float fz = mix(0.55, clamp(vnoise(vP * 5.0) * vnoise(vP * 17.0 + 5.0) * 4.0, 0.0, 1.0), 1.0 - smoothstep(0.04, 0.25, pixP));
  float frK = (kind > 3.5 && kind < 5.5) ? 0.0 : uFrost * ((kind > 7.5 && kind < 8.5) ? 0.45 : ((kind > 0.5 && kind < 1.5) || (kind > 5.5 && kind < 6.5)) ? 1.35 : 1.0);      // little on the deck's boards: the room is cold, not snowed in
  float fr = frK * fz * smoothstep(0.36, 0.86, (0.6 * vnoise(vP * 0.21 + 11.0) + 0.4 * vnoise(vP.zxy * 0.57 + 3.0)) * 0.8 + 0.3 * max(N.y, 0.0) + h * 3.0);
  alb = mix(alb, vec3(0.66, 0.74, 0.86), min(fr * 0.75, 1.0)); metal *= 1.0 - min(fr, 1.0) * 0.7; gloss = mix(gloss, 0.3, min(fr, 1.0));
  { vec3 gc = floor(vP * 2.6); float gh = hash31(gc + 17.0);      // glitter: crystals that flash as the eye moves past them
    float gt = 0.5 + 0.5 * sin(uTime * (1.5 + 4.0 * gh) + gh * 60.0 + dot(V, vec3(31.0, 17.0, 23.0))); gt *= gt; gt *= gt;
    emis += vec3(0.6, 0.78, 1.0) * (step(0.9, gh) * gt * min(fr, 1.0) * 2.2 * (1.0 - smoothstep(0.08, 0.3, pixP))); }
  // relief from the height field
  vec3 dpx = dFdx(vP), dpy = dFdy(vP); float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 grad = (hx * r1 + hy * r2) * (sign(det) / max(abs(det), 1e-6));
  N = normalize(N - clamp(grad, vec3(-2.0), vec3(2.0)) + enSet + vec3(0.0, 1e-5, 0.0));
  if (tubeLit > 0.5) emis += (alb * uTube2.z + 0.012) * tubeLight(vP, N, normalize(vN + vec3(0.0, 1e-5, 0.0)), V, sAxF);
  if (cellIn > 0.01) {
    // the brass counter-cell under the glass: lit by the lens beside it, with a glint that wanders round as stars cross the cell
    vec3 Lc = uCtr + uKeyDir * 113.0 - vP; Lc = Lc / max(length(Lc), 1e-3);
    float nl = clamp(dot(N, Lc) * 0.7 + 0.3, 0.0, 1.0);
    vec3 Hc = normalize(Lc + V + vec3(0.0, 1e-4, 0.0)); float spc = pow(max(dot(N, Hc), 0.0), 26.0);
    float g1 = max(cos(cellAng - 0.95 + 0.12 * sin(uTime * 0.31)), 0.0), g2 = max(cos(cellAng + 2.25 - 0.1 * sin(uTime * 0.23)), 0.0);
    g1 *= g1; g1 *= g1; g1 *= g1; g1 *= g1; g1 *= g1; g2 *= g2; g2 *= g2; g2 *= g2; g2 *= g2; g2 *= g2 * g2;
    float gleam = (g1 + 0.6 * g2) * (0.45 + 0.55 * nl);                  // two bright streaks across the turned brass, where the glass throws the sky back on it
    emis += (alb * vec3(1.2, 0.84, 0.5) * (0.03 + 0.34 * nl * (0.22 + 1.6 * cellLobe)) + vec3(1.0, 0.8, 0.5) * (0.5 * spc) + vec3(1.0, 0.9, 0.7) * (1.05 * gleam)) * (cellIn * uTube.z * (0.8 + 0.2 * uGlow));
  }
  emis += alb * domeLit;
  key *= slitMaskS(vP, gSoft) * mix(tubeShadow(vP), 1.0, step(1.5, vK.x));
  gBeam = 1.0 - tubeIn;
  vec3 col = shadeAll(vP, N, V, alb, metal, gloss, ao, key, emis, gl_FragCoord.xy, rimK);
  {
    // the slit mirrored in glossy things. On the white enamel: blue shade on the side turned from the sky, a soft sheen of the sky's
    // colour where the plates look up at it and a long cold highlight down the tube. On brass above the rail: thin blue glints.
    vec3 Rs = reflect(-V, N);
    float sxs = uDomeCS.x * Rs.x - uDomeCS.y * Rs.z, szs = uDomeCS.y * Rs.x + uDomeCS.x * Rs.z;
    float seen = smoothstep(-0.05, 0.25, Rs.y) * smoothstep(-0.35, 0.1, szs + Rs.y * 0.4) * smoothstep(0.0, 22.0, uSlit.x) * key * gBeam;
    float nvs = clamp(1.0 - dot(N, V), 0.0, 1.0); float frs = nvs * nvs; frs *= frs;
    float flk = 1.0 - uFlash.a;
    if (enK > 0.5) {
      float under = smoothstep(0.1, -0.5, dot(N, normalize(vec3(uDomeCS.y * 0.25, 0.97, uDomeCS.x * 0.25))));
      col *= mix(vec3(1.0), vec3(0.6, 0.74, 1.0), 0.85 * under * flk);
      // where the starlight takes the enamel over white, the LIGHT is held on a soft knee and each plate's own tone, its seams and its
      // rivets stay on top of it: the tube is still the brightest thing in the hall and still reads as built of plates. Under the knee
      // nothing changes.
      // (a long shoulder, so the tube keeps its roundness up to its brightest side; and in that light a plate's tone tells a little more)
      { float mb = max(col.r, max(col.g, col.b)), L = mb / enA;
        if (L > 0.5) col *= (0.5 + 0.48 * (1.0 - exp(-(L - 0.5) / 0.48))) * enA / max(mb, 1e-4) * pow(enA, 0.35 * smoothstep(0.5, 1.2, L)); }
      vec3 skyC = mix(uStarCol, vec3(0.4, 0.6, 1.0), 0.45);
      // (the sheen and the highlight fill what room the enamel has left under white and stop there: where the starlight already
      // has it at full white they add nothing, so the tube throws no more glow on the hall than its paint alone)
      vec3 add = (skyC * (0.1 * exp(-sxs * sxs * 7.0)) + mix(uStarCol, vec3(0.86, 0.93, 1.0), 0.5) * (0.3 * exp(-sxs * sxs * 60.0))) * (uStar * seen * flk * (0.7 + 1.5 * frs) * (1.0 - 0.6 * min(fr, 1.0)));
      float room = max(0.97 * min(enA * 1.06, 1.0) - max(col.r, max(col.g, col.b)), 0.0);      // (the room is each plate's own: the sheen does not wash the plates out again)
      col += add * min(room / max(max(add.r, max(add.g, add.b)), 1e-4), 1.0);
    }
    if (kind > 0.5 && kind < 1.5) {
      // brass above the rail keeps its gold: the wide streak of the slit in it is held under white in the metal's own colour (a soft
      // knee on its brightest channel), and the sky lays one thin hard blue line down each turned ring, a faint blue edge beside it
      float up = domeK * gBeam * flk;
      col = mix(col, uBrass * (dot(col, vec3(0.3, 0.55, 0.15)) / max(dot(uBrass, vec3(0.3, 0.55, 0.15)), 1e-3)), 0.6 * up);      // (cold starlight greys brass: give it back the metal's hue at the same brightness)
      float mb = max(col.r, max(col.g, col.b));
      float kn = mb < 0.55 ? mb : 0.55 + 0.37 * (1.0 - exp(-(mb - 0.55) / 0.37));
      col *= mix(1.0, kn / max(mb, 1e-4), up);
      float gk = seen * flk * domeK * (1.0 - 0.6 * min(fr, 1.0));
      col = mix(col, vec3(0.2, 0.46, 1.0) * min(0.42 * uStar, 0.97), min(0.9 * gk * exp(-sxs * sxs * 420.0), 1.0));
      col += vec3(0.16, 0.42, 1.0) * (uStar * gk * 0.07 * frs * smoothstep(0.0, 0.6, N.y + 0.3));
    }
  }
  if (tubeIn > 0.01) { float dz = 0.75 + 0.5 * vnoise(vP * 0.12 + vec3(0.0, -uTime * 0.2, uTime * 0.07)); vec3 hzC = uStarCol;
    if (tubeLit > 0.5) { float sT = dot(vP - uCtr, uKeyDir); float nb = mod(floor((sT + 81.0) / 17.0), 2.0) * (1.0 - smoothstep(26.0, 54.0, sT - dot(uCamL - uCtr, uKeyDir)));
      hzC = mix(uStarCol, vec3(1.2, 0.7, 0.24) * dot(uStarCol, vec3(0.3, 0.55, 0.15)), 0.8 * nb); }
    col += hzC * (tubeIn * 0.6 * uTube.y * (1.0 - exp(-0.0065 * dz * tubeHaze(vP)))); }
  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
  #endif
  #include <fog_fragment>
}
`;class At{constructor(n=4e4){this.cap=n,this.nv=0,this.ni=0,this.icap=n*4,this.P=new Float32Array(n*3),this.N=new Float32Array(n*3),this.C=new Float32Array(n*3),this.U=new Float32Array(n*2),this.K=new Float32Array(n*4),this.I=new Uint32Array(this.icap),this.m=new m.Matrix4,this.stack=[],this.bone=0,this.kind=0,this.rand=0,this.col=[.5,.5,.5],this.ao=1,this.uvOn=!1}_grow(){const n=(M,A)=>{const L=new M.constructor(A);return L.set(M),L};this.cap*=2,this.P=n(this.P,this.cap*3),this.N=n(this.N,this.cap*3),this.C=n(this.C,this.cap*3),this.U=n(this.U,this.cap*2),this.K=n(this.K,this.cap*4)}push(){return this.stack.push(this.m.clone()),this}pop(){return this.m.copy(this.stack.pop()),this}move(n,M,A){return this.m.multiply(jt.makeTranslation(n,M,A)),this}rotX(n){return this.m.multiply(jt.makeRotationX(n)),this}rotY(n){return this.m.multiply(jt.makeRotationY(n)),this}rotZ(n){return this.m.multiply(jt.makeRotationZ(n)),this}set(n,M,A=1){return this.kind=n,this.col=[M.r*A,M.g*A,M.b*A],this}v(n,M,A,L,R,V,B=-1e4,D=0,g=1){this.nv>=this.cap&&this._grow();const S=this.m.elements,F=this.nv,P=F*3;this.P[P]=S[0]*n+S[4]*M+S[8]*A+S[12],this.P[P+1]=S[1]*n+S[5]*M+S[9]*A+S[13],this.P[P+2]=S[2]*n+S[6]*M+S[10]*A+S[14];let q=S[0]*L+S[4]*R+S[8]*V,U=S[1]*L+S[5]*R+S[9]*V,W=S[2]*L+S[6]*R+S[10]*V;const ht=Math.hypot(q,U,W)||1;this.N[P]=q/ht,this.N[P+1]=U/ht,this.N[P+2]=W/ht,this.C[P]=this.col[0],this.C[P+1]=this.col[1],this.C[P+2]=this.col[2],this.U[F*2]=this.uvOn?B:-1e4,this.U[F*2+1]=D;const _=F*4;return this.K[_]=this.bone,this.K[_+1]=this.kind,this.K[_+2]=this.rand,this.K[_+3]=this.ao*g,this.nv++}tri(n,M,A){if(this.ni+3>this.icap){this.icap*=2;const L=new Uint32Array(this.icap);L.set(this.I),this.I=L}this.I[this.ni++]=n,this.I[this.ni++]=M,this.I[this.ni++]=A}poly(n,M,A,L){const R=n[0],V=n[1],B=n[2],D=(V[1]-R[1])*(B[2]-R[2])-(V[2]-R[2])*(B[1]-R[1]),g=(V[2]-R[2])*(B[0]-R[0])-(V[0]-R[0])*(B[2]-R[2]),S=(V[0]-R[0])*(B[1]-R[1])-(V[1]-R[1])*(B[0]-R[0]),F=D*M[0]+g*M[1]+S*M[2]<0,P=[];for(let q=0;q<n.length;q++){const U=n[q];P.push(this.v(U[0],U[1],U[2],M[0],M[1],M[2],A?A[q][0]:-1e4,A?A[q][1]:0,L?L[q]:1))}for(let q=1;q<n.length-1;q++)F?this.tri(P[0],P[q+1],P[q]):this.tri(P[0],P[q],P[q+1])}lathe(n,M,A={}){const L=A.a0??0,R=A.a1??Math.PI*2,V=A.inward?-1:1,B=A.rRef??1,D=n.length,g=[];for(let P=0;P<D-1;P++){const q=n[P+1][0]-n[P][0],U=n[P+1][1]-n[P][1],W=Math.hypot(q,U)||1;g.push([U/W,-q/W])}const S=(P,q)=>{if(!A.smooth)return g[q];const U=g[Math.max(0,P-1)],W=g[Math.min(D-2,P)],ht=U[0]+W[0],_=U[1]+W[1],j=Math.hypot(ht,_)||1;return[ht/j,_/j]};let F=A.u0??0;for(let P=0;P<D-1;P++){const q=n[P],U=n[P+1],W=S(P,P),ht=S(P+1,P),_=Math.hypot(U[0]-q[0],U[1]-q[1]),j=this.nv;for(let I=0;I<=M;I++){const T=L+(R-L)*I/M,O=Math.sin(T),ot=Math.cos(T);this.v(q[0]*O,q[1],q[0]*ot,W[0]*O*V,W[1]*V,W[0]*ot*V,F,T*B,q[2]??1),this.v(U[0]*O,U[1],U[0]*ot,ht[0]*O*V,ht[1]*V,ht[0]*ot*V,F+_,T*B,U[2]??1)}for(let I=0;I<M;I++){const T=j+I*2,O=T+2,ot=T+1,ct=T+3;V>0?(this.tri(T,O,ot),this.tri(O,ct,ot)):(this.tri(T,ot,O),this.tri(O,ot,ct))}F+=_}return this}box(n,M,A,L=0){const R=[n,M,A],V=Math.min(L,n*.45,M*.45,A*.45),B=(g,S,F,P,q,U)=>{const W=[0,0,0];return W[g]=S*R[g],W[F]=P*(R[F]-V),W[q]=U*(R[q]-V),W},D=(g,S)=>this.uvOn?S.map(F=>[F[g===1?0:1]+60,F[g===2?0:2]+60]):null;for(let g=0;g<3;g++){const S=(g+1)%3,F=(g+2)%3;for(const P of[-1,1]){const q=[0,0,0];q[g]=P;const U=[B(g,P,S,-1,F,-1),B(g,P,S,1,F,-1),B(g,P,S,1,F,1),B(g,P,S,-1,F,1)];if(this.poly(U,q,D(g,U)),V>0)for(const W of[-1,1]){const ht=[0,0,0];ht[g]=P*.7071,ht[S]=W*.7071,this.poly([B(g,P,S,W,F,-1),B(g,P,S,W,F,1),B(S,W,F,1,g,P),B(S,W,F,-1,g,P)],ht)}}}if(V>0)for(const g of[-1,1])for(const S of[-1,1])for(const F of[-1,1])this.poly([B(0,g,1,S,2,F),B(1,S,2,F,0,g),B(2,F,0,g,1,S)],[g*.577,S*.577,F*.577]);return this}tube(n,M,A=6,L={}){const R=n.length,V=!!L.closed;let B=L.u0??0;const D=new m.Vector3,g=new m.Vector3,S=new m.Vector3,F=new m.Vector3,P=new m.Quaternion,q=I=>n[(I+R)%R],U=(I,T)=>{const O=V?q(I-1):n[Math.max(0,I-1)],ot=V?q(I+1):n[Math.min(R-1,I+1)];return T.set(ot[0]-O[0],ot[1]-O[1],ot[2]-O[2]).normalize()};U(0,D),g.set(0,1,0),Math.abs(D.y)>.9&&g.set(1,0,0),g.addScaledVector(D,-g.dot(D)).normalize();const W=V?R+1:R,ht=this.nv,_=this.uvOn,j=[];this.uvOn=!0;for(let I=0;I<W;I++){const T=q(I);if(I>0){F.copy(D),U(I,D),P.setFromUnitVectors(F,D),g.applyQuaternion(P);const ct=q(I-1);B+=Math.hypot(T[0]-ct[0],T[1]-ct[1],T[2]-ct[2])}S.crossVectors(D,g);const O=typeof M=="function"?M(I/(W-1)):M,ot=!V&&(I===0||I===W-1)&&(this.kind<9.5||this.kind>11.5)?[]:null;for(let ct=0;ct<=A;ct++){const gt=ct/A*Math.PI*2,dt=Math.cos(gt),lt=Math.sin(gt),Tt=g.x*dt+S.x*lt,Kt=g.y*dt+S.y*lt,ut=g.z*dt+S.z*lt;this.v(T[0]+Tt*O,T[1]+Kt*O,T[2]+ut*O,Tt,Kt,ut,B,ct/A,T[3]??1),ot&&ct<A&&ot.push([T[0]+Tt*O,T[1]+Kt*O,T[2]+ut*O])}ot&&j.push([ot,I?[D.x,D.y,D.z]:[-D.x,-D.y,-D.z],T[3]??1])}this.uvOn=_;for(let I=0;I<W-1;I++)for(let T=0;T<A;T++){const O=ht+I*(A+1)+T,ot=O+1,ct=O+A+1,gt=ct+1;this.tri(O,ot,ct),this.tri(ot,gt,ct)}for(const[I,T,O]of j)this.poly(I,T,null,I.map(()=>O));return this}ball(n,M=16,A=10){const L=[];for(let R=0;R<=A;R++){const V=R/A*Math.PI;L.push([n*Math.sin(V)+1e-4,-n*Math.cos(V)])}return this.lathe(L,M,{smooth:!0})}torus(n,M,A=32,L=8){const R=[];for(let V=0;V<=L;V++){const B=V/L*Math.PI*2;R.push([n+M*Math.cos(B),M*Math.sin(B)])}return this.lathe(R,A,{smooth:!0})}build(){const n=new m.BufferGeometry,M=this.nv;return n.setAttribute("position",new m.BufferAttribute(this.P.slice(0,M*3),3)),n.setAttribute("normal",new m.BufferAttribute(this.N.slice(0,M*3),3)),n.setAttribute("color",new m.BufferAttribute(this.C.slice(0,M*3),3)),n.setAttribute("uv",new m.BufferAttribute(this.U.slice(0,M*2),2)),n.setAttribute("aK",new m.BufferAttribute(this.K.slice(0,M*4),4)),n.setIndex(new m.BufferAttribute(this.I.slice(0,this.ni),1)),n}}const jt=new m.Matrix4;function o0(rt,n,M,A,L={}){const R=L.toothH??n*.09,V=n-R,B=L.ri??V*.82,D=L.cone??1,g=A/2,S=M*4,F=[0,.2,.5,.7],P=[V,n,n,V],q=[],U=[];for(let _=0;_<M;_++)for(let j=0;j<4;j++){const I=(_+F[j])/M*Math.PI*2,T=Math.cos(I),O=Math.sin(I);q.push([T*P[j],O*P[j]]),U.push([T*B,O*B])}for(let _=0;_<S;_++){const j=q[_],I=q[(_+1)%S],T=U[_],O=U[(_+1)%S],ot=I[0]-j[0],ct=I[1]-j[1],gt=Math.hypot(ot,ct)||1;if(rt.poly([[j[0],j[1],-g],[I[0],I[1],-g],[I[0]*D,I[1]*D,g],[j[0]*D,j[1]*D,g]],[ct/gt,-ot/gt,0]),rt.poly([[j[0]*D,j[1]*D,g],[I[0]*D,I[1]*D,g],[O[0]*D,O[1]*D,g],[T[0]*D,T[1]*D,g]],[0,0,1]),rt.poly([[j[0],j[1],-g],[I[0],I[1],-g],[O[0],O[1],-g],[T[0],T[1],-g]],[0,0,-1]),(_&1)===0){const dt=U[(_+2)%S];rt.poly([[T[0],T[1],-g],[dt[0],dt[1],-g],[dt[0]*D,dt[1]*D,g],[T[0]*D,T[1]*D,g]],[-(T[0]+dt[0])/(2*B),-(T[1]+dt[1])/(2*B),0])}}const W=L.hub??n*.2,ht=L.spokes??6;if(rt.push().rotX(Math.PI/2),D===1){const _=B*.99,j=Math.min(B*1.07,V*.985),I=Math.min(48,M);rt.lathe([[j,g],[j,g*1.4],[_,g*1.4],[_,g]],I),rt.lathe([[_,-g],[_,-g*1.4],[j,-g*1.4],[j,-g]],I)}rt.lathe([[W*.45,-g*1.5],[W,-g*1.5],[W,g*1.5],[W*.45,g*1.5]],14),rt.pop();for(let _=0;_<ht;_++)rt.push().rotZ((_+.5)/ht*Math.PI*2).move((W+B)/2,0,0),rt.box((B-W)/2+.05,Math.min(n*.07,W*.5),g*.55,g*.2),rt.pop()}const me=["#0A1020","#3A4B66","#EEF2F6","#A9C6F2","#D8263A","#3FBF7A","#B08A4A"],Zt=(rt,n,M)=>{const A=Math.min(1,Math.max(0,(M-rt)/(n-rt)));return A*A*A*(A*(A*6-15)+10)};async function fe(rt,n={}){const M=rt.rng.fork?rt.rng.fork("great-refractor-hero"):rt.rng,A=rt.quality?.detail??1,L=async()=>{rt.yield&&await rt.yield()},R=(n.palette&&n.palette.length>=7?n.palette:me).map(e=>new m.Color(e)),V=M.chance(.5)?"brass":"nickel",B=n.fittings??V,D=(n.domeTurn??(M.chance(.5)?30:-30))*Math.PI/180,g=M.range(14,24)*Math.PI/180,S=M.range(76,84)*Math.PI/180,F=M.int(3,5),P=M.chance(.65)?2:3,q=M.pick([6,8]),U=M.range(26,34),W=M.range(-.07,.06),ht=M.range(-1,1),_=M.int(26,34),j=M.int(44,60),I=n.starLow??.85,T=n.star??1.65,O=B==="nickel"?new m.Color("#828b92"):R[6].clone(),ot=R[1].clone().offsetHSL(W*.5,-.06,0).multiplyScalar(3.1),ct=ot.clone().lerp(new m.Color(.243,.245,.21),.6),gt=ot.clone().lerp(new m.Color(.243,.245,.21),.6).multiplyScalar(.74),dt=ot.clone().lerp(new m.Color(.2,.2,.19),.75).multiplyScalar(.75),lt=new m.Color("#9aa3ad").lerp(R[1],.18),Tt=R[2].clone().multiplyScalar(.66);Tt.r*=1+.03*ht,Tt.b*=1-.03*ht;const Kt=new m.Color(.03,.033,.043),ut=new m.Color(.42,.45,.5),E=new m.Color(.46,.46,.46),Ot=R[4].clone(),H0=R[5].clone(),Rt=R[3].clone(),Q=[];for(let e=0;e<Wt;e++)Q.push(new m.Matrix4);const $t=[],Qt=[];for(let e=0;e<8;e++)$t.push(new m.Vector4(0,-999,0,1)),Qt.push(new m.Vector3);const N={uBone:{value:Q},uHeroInv:{value:new m.Matrix4},uSpin:{value:0},uShut:{value:0},uCtr:{value:new m.Vector3(0,X,0)},uSlit:{value:new m.Vector4(xt,Xt,2.2,b)},uDomeCS:{value:new m.Vector2(1,0)},uKeyDir:{value:new m.Vector3(0,V0,B0)},uStarCol:{value:new m.Vector3(Rt.r,Rt.g,Rt.b)},uStar:{value:T},uAmbSky:{value:new m.Vector3(.23,.27,.36)},uAmbGnd:{value:new m.Vector3(.075,.082,.12)},uLampPos:{value:$t},uLampCol:{value:Qt},uTubeA:{value:new m.Vector3},uTubeB:{value:new m.Vector3},uTubeR:{value:10.8},uFlash:{value:new m.Vector4(.25,1,.45,0)},uFrost:{value:n.frost??0},uBeam:{value:n.beam??9e-4},uTime:{value:0},uCamL:{value:new m.Vector3},uFill:{value:n.fill??.2},uRim:{value:n.rim??.55},uGlow:{value:1},uLampGlow:{value:1},uCloudK:{value:n.cloud??0},uHole:{value:new m.Vector4(et,mt,11.5,20.5)},uRun:{value:new m.Vector2},uFootA:{value:Array.from({length:24},()=>new m.Vector4(0,0,1,0))},uFootB:{value:Array.from({length:24},()=>new m.Vector4(1,1,1,0))},uFootN:{value:0},uAmbK:{value:new m.Vector4(.3,.4,1,.3)},uRing:{value:new m.Vector4(116,-999,38,12)},uRingCol:{value:new m.Vector3},uBrass:{value:new m.Vector3(O.r,O.g,O.b)},uShaft:{value:new m.Vector4(n.shaft??0,n.shaftRadius??16,-150,158)},uDomeK:{value:new m.Vector3(n.domeDark??.16,n.domeFall??42,n.ribRim??.2)},uDomeL:{value:new m.Vector4(n.domeBase??.17,n.domeSlit??.32,0,n.domeShadow??1)},uDomeWarm:{value:new m.Vector3},uDomeCol:{value:new m.Vector3(Rt.r,Rt.g,Rt.b)},uSlitGlow:{value:0},uDeckKey:{value:n.deckKey??.36},uTube:{value:new m.Vector4(1,1,1,1)},uIrisA:{value:new m.Vector4(0,1,0,0)},uIrisC:{value:new m.Vector3},uIrisP:{value:new m.Vector3},uTube2:{value:new m.Vector4(0,.5,5.2,.55)},uRing2:{value:new m.Vector4(b-1.8,58,n.sconceReach??36,12)},uRing2Col:{value:new m.Vector3},uWarm:{value:new m.Vector3},uWin:{value:new m.Vector4(b-.8,80,36,24)},uWinCol:{value:new m.Vector3},uBounce:{value:new m.Vector4(0,0,0,0)}},y0=11,u0=n.portalRadius??6,k0={uCtr:N.uCtr,uKeyDir:N.uKeyDir,uCamL:N.uCamL,uTime:N.uTime,uTube:N.uTube,uTube2:N.uTube2,uStarCol:N.uStarCol,uStar:N.uStar,uLensLook:{value:new m.Vector4(1,1,0,0)},uLensLook2:{value:new m.Vector4(0,0,0,0)},uLensR:{value:new m.Vector4(y0,1,0,u0+.25)}},E0=Math.max(4,Math.round(8*A)),m0=[],_t=(e={},o={})=>{const i=new m.ShaderMaterial({uniforms:{...m.UniformsUtils.clone(m.UniformsLib.fog),...N,...o.uniforms||{}},vertexShader:O0,fragmentShader:_0,vertexColors:!0,fog:o.fog??!0,defines:{BEAM_STEPS:E0,...e}});return o.additive&&(i.transparent=!0,i.blending=m.AdditiveBlending,i.depthWrite=!1),m0.push(i),i},a0=_t(),Y0=_t({SHUT:""}),M0=_t({SPIN:""},{uniforms:{uSpin:{value:0}}}),G0=_t({SLITWIN:""},{additive:!0,fog:!1}),kt=new m.Group;kt.name="great-refractor";const zt=new m.Group;zt.position.y=X,kt.add(zt);const Dt=(e,o,i,a)=>{const s=new m.Mesh(o,i);return s.name=a,s.frustumCulled=!1,e.add(s),s},X0=(e,o,i=1.5)=>Math.abs(e)<xt+i&&o>Xt-i,bt=(e,o,i)=>[i*Math.sin(e)*Math.sin(o),i*Math.cos(e),i*Math.sin(e)*Math.cos(o)];{const e=new At(8e3);e.uvOn=!0,e.set(7,ct);const o=[];for(let i=0;i<=26;i++){const a=i/26*(Math.PI/2-.004);o.push([b*Math.cos(a),b*Math.sin(a)])}e.lathe(o,96,{inward:!0,smooth:!0,rRef:48/(Math.PI*2)}),e.uvOn=!1,e.set(0,dt,.5),e.lathe([[b+.4,-7.5],[b+.4,0]],96,{inward:!0}),Dt(zt,e.build(),a0,"skin")}await L();const s0=Math.PI/2+Math.asin((-Xt+3)/b);{const e=new At(6e3),o=b+2.2,i=34,a=5,s=xt+2.5;for(const x of[-1,1]){e.rand=x>0?1:0;const p=(h,r,c=0)=>{const u=x*s*h/a,w=Math.sqrt(o*o-u*u)-c;return[u,w*Math.sin(r),w*Math.cos(r)]},v=h=>-.03+(s0+.03)*h/i;e.uvOn=!0,e.set(9,ct,.92);for(let h=0;h<i;h++)for(let r=0;r<a;r++){const c=[p(r,v(h)),p(r+1,v(h)),p(r+1,v(h+1)),p(r,v(h+1))],u=p(r+.5,v(h+.5)),w=[[v(h)*o,c[0][0]*.1],[v(h)*o,c[1][0]*.1],[v(h+1)*o,c[2][0]*.1],[v(h+1)*o,c[3][0]*.1]];e.poly(c,[-u[0]/o,-u[1]/o,-u[2]/o],w)}e.uvOn=!1,e.set(3,gt,.9);for(let h=0;h<i;h++){const r=v(h),c=v(h+1);if(e.poly([p(0,r),p(0,c),p(0,c,2.4),p(0,r,2.4)],[-x,0,0]),e.poly([p(0,r,2.4),p(0,c,2.4),p(.35,c,2.4),p(.35,r,2.4)],[0,-Math.sin((r+c)/2),-Math.cos((r+c)/2)]),e.poly([p(.35,r,2.4),p(.35,c,2.4),p(.35,c),p(.35,r)],[x,0,0]),h%3===1){const u=(r+c)/2,w=.006,y=[0,-Math.sin(u-.5),-Math.cos(u-.5)],k=[0,-Math.sin(u+.5),-Math.cos(u+.5)];for(let K=0;K<a;K++)e.poly([p(K,u-w),p(K+1,u-w),p(K+1,u,1.1),p(K,u,1.1)],y),e.poly([p(K,u,1.1),p(K+1,u,1.1),p(K+1,u+w),p(K,u+w)],k)}}}Dt(zt,e.build(),Y0,"shutters");const l=new At(600);l.rand=.5;for(let x=0;x<20;x++)for(let p=-3;p<3;p++){const v=(r,c)=>{const u=xt*r/3,w=s0*c/20,y=Math.sqrt((b+1)*(b+1)-u*u);return[u,y*Math.sin(w),y*Math.cos(w)]},h=v(p+.5,x+.5);l.poly([v(p,x),v(p+1,x),v(p+1,x+1),v(p,x+1)],[-h[0]/b,-h[1]/b,-h[2]/b])}const f=Dt(zt,l.build(),G0,"slit-air");f.renderOrder=5}await L();{const e=new At(6e4),o=48,i=18,a=.05,s=xt+1.4,l=Xt-1.4,f=(v,h)=>{const r=[];for(let c=0;c<v.length;c++){const u=v[c],w=v[(c+1)%v.length],y=h(u),k=h(w);if(y>=0&&r.push(u),y>=0!=k>=0){const K=y/(y-k);r.push(u.map((tt,G)=>tt+(w[G]-tt)*K))}}return r},x=(v,h,r,c)=>{if(!v.some(y=>X0(y[0],y[2],1.4))){e.poly(v,h,r,c);return}const u=v.map((y,k)=>[y[0],y[1],y[2],r?r[k][0]:0,r?r[k][1]:0,c?c[k]:1]),w=f(u,y=>y[2]-l);for(const y of[f(u,k=>l-k[2]),f(w,k=>k[0]-s),f(w,k=>-s-k[0])])y.length>=3&&e.poly(y,h,r?y.map(k=>[k[3],k[4]]):null,y.map(k=>k[5]))};for(let v=0;v<o;v++){const h=(v+.5)/o*Math.PI*2,r=Math.cos(h),c=-Math.sin(h),u=.8;e.rand=M(),e.set(3,gt,.85+.3*e.rand),e.uvOn=!0;for(let w=0;w<i;w++){const y=a+(Math.PI/2-a)*w/i,k=a+(Math.PI/2-a)*(w+1)/i,K=bt((y+k)/2,h,1),tt=bt(y,h,b-3.6),G=bt(k,h,b-3.6),z=bt(y,h,b-.05),d=bt(k,h,b-.05),C=y*b,$=k*b,Y=(Z,nt)=>[Z[0]+r*u*nt,Z[1],Z[2]+c*u*nt];x([Y(tt,-1),Y(tt,1),Y(G,1),Y(G,-1)],[-K[0],-K[1],-K[2]],[[C,0],[C,1.6],[$,1.6],[$,0]]);for(const Z of[-1,1])x([Y(tt,Z),Y(z,Z),Y(d,Z),Y(G,Z)],[r*Z,0,c*Z],[[C,0],[C,3.6],[$,3.6],[$,0]],[1,.45,.45,1])}(v&7)===7&&await L()}e.uvOn=!1;for(let v=1;v<=17;v++){const h=Math.PI/2-v*14/b,r=.65/b,c=96;e.rand=M(),e.set(3,gt,.7+.2*e.rand);for(let u=0;u<c;u++){const w=u/c*Math.PI*2,y=(u+1)/c*Math.PI*2,k=bt(h,(w+y)/2,b),K=b-2.2,tt=b-.05,G=bt(h-r,w,K),z=bt(h-r,y,K),d=bt(h+r,y,K),C=bt(h+r,w,K),$=bt(h-r,w,tt),Y=bt(h-r,y,tt),Z=bt(h+r,y,tt),nt=bt(h+r,w,tt),qt=[-Math.cos(h)*k[0]/(b*Math.sin(h)+1e-6),Math.sin(h),-Math.cos(h)*k[2]/(b*Math.sin(h)+1e-6)];x([G,z,d,C],[-k[0]/b,-k[1]/b,-k[2]/b]),x([G,z,Y,$],qt,null,[1,1,.45,.45]),x([C,d,Z,nt],[-qt[0],-qt[1],-qt[2]],null,[1,1,.45,.45])}(v&3)===3&&await L()}e.set(3,gt,1.15),e.rand=.3;for(const v of[-1,1]){const h=v*(xt+.4),r=v*(xt+2.4),c=40,u=(w,y,k)=>{const K=Math.sqrt(b*b-w*w)-k;return[w,K*Math.sin(y),K*Math.cos(y)]};for(let w=0;w<c;w++){const y=s0*w/c,k=s0*(w+1)/c,K=(y+k)/2,tt=[0,-Math.sin(K),-Math.cos(K)];e.poly([u(h,y,4.2),u(r,y,4.2),u(r,k,4.2),u(h,k,4.2)],tt),e.poly([u(h,y,4.2),u(h,k,4.2),u(h,k,0),u(h,y,0)],[-v,0,0],null,[1,1,.5,.5]),e.poly([u(r,y,4.2),u(r,k,4.2),u(r,k,0),u(r,y,0)],[v,0,0],null,[1,1,.5,.5])}}{const h=xt+3,r=Xt-2,c=(u,w,y)=>{const k=Math.sqrt(b*b-u*u),K=Math.acos(r/k)+w/k;return[u,(k-y)*Math.sin(K),(k-y)*Math.cos(K)]};for(let u=0;u<24;u++){const w=-h+2*h*u/24,y=-h+2*h*(u+1)/24,k=(w+y)/2,K=Math.sqrt(b*b-k*k),tt=Math.acos(r/K);for(const G of[4.6,.2]){const z=G>1?-1:1;e.poly([c(w,-1.3,G),c(y,-1.3,G),c(y,1.3,G),c(w,1.3,G)],[z*k/b,z*K/b*Math.sin(tt),z*K/b*Math.cos(tt)])}for(const G of[-1.3,1.3])e.poly([c(w,G,4.6),c(y,G,4.6),c(y,G,.2),c(w,G,.2)],[0,Math.sign(G)*Math.cos(tt),-Math.sign(G)*Math.sin(tt)],null,[1,1,.5,.5])}for(const u of[-1,1])e.poly([c(u*h,-1.3,4.6),c(u*h,1.3,4.6),c(u*h,1.3,.2),c(u*h,-1.3,.2)],[u,0,0],null,[1,1,.5,.5])}await L(),e.uvOn=!0,e.set(0,dt,1.9),e.rand=.6,e.lathe([[b,1.8],[b-4.2,1.8],[b-4.2,.9],[b-1.6,.7],[b-1.6,-.5],[b-4.2,-.7],[b-4.2,-1.5],[b,-1.5]],96,{rRef:b-3}),e.uvOn=!1;for(let v=0;v<36;v++){const h=(v+.75)/36*Math.PI*2;e.push().rotY(h).move(0,0,b-3),e.set(0,dt,1.7);for(const r of[-1,1])e.push().move(0,-2.9,r*1.05),e.box(.55,1.7,.16,.06),e.pop();e.push().move(0,-1.75,0),e.box(2.6,.3,1.3,.1),e.pop(),e.set(6,ut,.9),e.push().move(0,-3.6,0).rotX(Math.PI/2),e.lathe([[.3,-1.45],[.45,-1.35],[.45,1.35],[.3,1.45]],8),e.pop(),e.pop(),(v&15)===15&&await L()}const p=Math.asin((xt+10)/(b-5.4));for(const v of[0,1]){const h=[];for(let r=0;r<=28;r++){const c=(r/28-.5)*2*p;h.push([Math.sin(c)*(b-5.4),3+v*1+.25*Math.cos(r/28*Math.PI*2*3)*(v?.3:1),Math.cos(c)*(b-5.4)])}e.rand=v,e.set(11,ut,.8),e.tube(h,.3,5)}e.set(1,E),e.rand=.4;for(const v of[-1,1]){const h=v*p;e.push().move(Math.sin(h)*(b-5.4),3.5,Math.cos(h)*(b-5.4)).rotY(h).rotX(Math.PI/2),e.lathe([[.3,-.5],[1.5,-.4],[1.2,0],[1.5,.4],[.3,.5]],14),e.pop()}await L(),Dt(zt,e.build(),a0,"dome-frame")}await L();let Ht;{const e=new At(1200);e.set(6,ut,1.1),e.rand=.2,e.push().rotX(Math.PI/2),e.lathe([[2.05,-.45],[2.5,-.45],[2.5,.25],[2.78,.3],[2.78,.55],[2.05,.55],[2.05,-.45]],20),e.set(1,E,1),e.lathe([[.01,-.95],[.5,-.85],[.85,-.6],[.85,.7],[.5,.85]],10),e.pop(),e.set(0,dt,2);for(let i=0;i<6;i++)e.push().rotZ(i/6*Math.PI*2).move(1.4,0,.05),e.box(.72,.26,.2,.06),e.pop();Ht=new m.InstancedMesh(e.build(),M0,36),Ht.name="wheels",Ht.frustumCulled=!1;const o=new m.Matrix4;for(let i=0;i<36;i++){const a=(i+.75)/36*Math.PI*2;o.makeRotationY(a).multiply(jt.makeTranslation(0,-3.6,b-3)),Ht.setMatrixAt(i,o)}zt.add(Ht)}await L();const t=new At(9e4),i0=[],n0=(e,o,i,a,s,l,f=!1)=>{e.push().move(o,i,a),e.uvOn=!1,e.set(0,lt,.5),e.push().move(-s*.5,0,-l*.5),e.box(.25+Math.abs(s)*.5,.18,.25+Math.abs(l)*.5,.05),e.pop(),e.push().move(s*.4,-.2,l*.4),e.set(1,E),e.lathe([[.1,0],[.75,.1],[.75,.3],[.5,.42]],10),e.lathe([[.5,1.9],[.8,2],[.55,2.4],[.12,2.75],[.01,2.8]],10),e.set(5,Ot,1),e.ao=.75,e.rand=0,e.lathe([[.5,.42],[.62,1.15],[.5,1.9]],10,{smooth:!0}),e.ao=1,e.pop(),e.pop(),i0.push({pos:[o+s*.4,i+1,a+l*.4],color:Ot,rides:f})};{t.bone=0,t.rand=.5,t.uvOn=!0,t.set(0,lt,.8),t.lathe([[b,X-7.2],[b-7,X-7.2],[b-7,X-8.6],[b-6,X-9.6],[b-6,X-13],[b-4.8,X-14.2],[b-.2,X-14.2]],96,{rRef:b-6}),t.uvOn=!1,t.set(6,ut,.95),t.lathe([[b-2.55,X-7.2],[b-2.55,X-6.5],[b-2.7,X-6.1],[b-3.3,X-6.1],[b-3.45,X-6.5],[b-3.45,X-7.2]],96);for(let e=0;e<24;e++){const o=(e+.5)/24*Math.PI*2;t.push().rotY(o).move(0,X-17,b-2),t.set(0,lt,.5),t.push().move(0,1.6,0),t.box(.35,1.3,.35,.08),t.pop(),t.push().move(0,.2,1.1),t.box(.3,.3,1.1,.08),t.pop(),t.set(1,E),t.lathe([[.25,-.5],[1.5,-.42],[1.5,-.3],[1.15,0],[1.5,.3],[1.5,.42],[.25,.5]],14),t.pop()}}await L();let S0;{const e=new At(2200),o=[],i=b-3.5,a=2*Math.PI*i/24;for(let s=0;s<24;s++)for(let l=0;l<6;l++){const f=l/6,x=(s+.5+f)/24*Math.PI*2;o.push([Math.sin(x)*i,X-17-4*f*(1-f)*1.3,Math.cos(x)*i])}e.set(10,new m.Color("#8f8468"),.6),e.rand=.3,e.tube(o,.45,5,{closed:!0}),S0=Dt(kt,e.build(),_t({ROPE:"",ROPE_SPAN:a.toFixed(3)}),"rope")}await L();const Ft=e=>{const o=Math.min(1,Math.max(0,e/140));return[9-3*o,18-6*o]},l0=(e,o=0,i=1.1)=>{const[a,s]=Ft(e),l=a+o,f=s+o;return[[l-i,f],[l,f-i],[l,-f+i],[l-i,-f],[-l+i,-f],[-l,-f+i],[-l,f-i],[-l+i,f]].map(x=>[et+x[0],e,mt+x[1]])},Mt=(e,o,i,a,s)=>{const l=l0(e,i),f=l0(o,a);let x=0;for(let p=0;p<8;p++){const v=(p+1)%8,h=l[v][0]-l[p][0],r=l[v][2]-l[p][2],c=Math.hypot(h,r),u=(i-a+(Ft(e)[0]-Ft(o)[0]))/Math.max(o-e,.01),w=[-r/c,u,h/c],y=Math.hypot(w[0],w[1],w[2]);t.poly([l[p],l[v],f[v],f[p]],[w[0]/y,w[1]/y,w[2]/y],s?[[e,x],[e,x+c],[o,x+c],[o,x]]:null),x+=c}};{t.bone=0,t.rand=.15,t.uvOn=!0,t.set(0,lt,1);const e=[-70,0,28,52,84,112,136];for(let s=0;s<e.length-1;s++)Mt(e[s]+(s?1.6:0),e[s+1],0,0,!0);t.uvOn=!1,t.set(0,lt,1.12);for(let s=1;s<e.length-1;s++){const l=e[s];Mt(l-.5,l,0,.7),Mt(l,l+1.1,.7,.7),Mt(l+1.1,l+1.6,.7,0)}Mt(136,137,0,1.4),Mt(137,139.2,1.4,1.4),Mt(139.2,140,1.4,.2),t.set(1,E,.95);const o=(s,l)=>{Mt(s,s+.07,l,l+.1),Mt(s+.07,s+.37,l+.1,l+.1),Mt(s+.37,s+.44,l+.1,l)};for(let s=1;s<e.length-1;s++)o(e[s]+.33,.7);o(138.45,1.4);const i=(s,l,f,x)=>{const p=l0(l),v=l0(f),h=(s+1)%8,r=(z,d)=>[z[0]-d[0],z[1]-d[1],z[2]-d[2]],c=(z,d,C)=>[z[0]+(d[0]-z[0])*C,z[1]+(d[1]-z[1])*C,z[2]+(d[2]-z[2])*C],u=(z,d)=>[z[1]*d[2]-z[2]*d[1],z[2]*d[0]-z[0]*d[2],z[0]*d[1]-z[1]*d[0]],w=z=>{const d=Math.hypot(z[0],z[1],z[2])||1;return[z[0]/d,z[1]/d,z[2]/d]},y=(z,d)=>c(c(p[s],p[h],z),c(v[s],v[h],z),d);let k=w(u(r(p[h],p[s]),r(v[s],p[s])));k[0]*(p[s][0]+p[h][0]-2*et)+k[2]*(p[s][2]+p[h][2]-2*mt)<0&&(k=[-k[0],-k[1],-k[2]]);const K=1.2/Math.hypot(p[h][0]-p[s][0],p[h][2]-p[s][2]),tt=1.2/(f-l);t.set(0,lt,1.16),[[y(K,tt),y(1-K,1-tt),.4],[y(1-K,tt),y(K,1-tt),.38]].forEach(([z,d,C])=>{const $=w(r(d,z)),Y=w(u(k,$)),Z=.8,nt=(qt,g0,w0)=>[qt[0]+Y[0]*g0+k[0]*w0,qt[1]+Y[1]*g0+k[1]*w0,qt[2]+Y[2]*g0+k[2]*w0];t.poly([nt(z,-Z,C),nt(d,-Z,C),nt(d,Z,C),nt(z,Z,C)],k),t.poly([nt(z,-Z,0),nt(d,-Z,0),nt(d,-Z,C),nt(z,-Z,C)],[-Y[0],-Y[1],-Y[2]]),t.poly([nt(z,Z,0),nt(d,Z,0),nt(d,Z,C),nt(z,Z,C)],Y),t.poly([nt(z,-Z,0),nt(z,Z,0),nt(z,Z,C),nt(z,-Z,C)],[-$[0],-$[1],-$[2]]),t.poly([nt(d,-Z,0),nt(d,Z,0),nt(d,Z,C),nt(d,-Z,C)],$)});const G=y(.5,.5);t.push().move(G[0],G[1],G[2]),x(),t.lathe([[2.5,-.15],[2.5,.45],[2.2,.62],[1.7,.62],[1.55,.48]],24),t.set(1,E,.95),t.lathe([[1.55,.44],[1.4,.7],[.8,.92],[.01,.98]],16),t.pop()};for(let s=1;s<e.length-1;s++){const l=e[s]+1.6,f=e[s+1]-(s<e.length-2?.5:0);i(1,l,f,()=>t.rotZ(-Math.PI/2+Math.atan(3/140))),e[s]!==52&&(i(5,l,f,()=>t.rotZ(Math.PI/2-Math.atan(3/140))),i(3,l,f,()=>t.rotX(-Math.PI/2+Math.atan(6/140))))}t.set(0,lt,1.12),t.push().move(et,140,mt),t.poly([[-6.4,0,-12.4],[6.4,0,-12.4],[6.4,0,12.4],[-6.4,0,12.4]],[0,1,0]),t.pop();const a=s=>mt+Ft(s)[1]+1.3;for(const s of[-1,1]){const l=[];for(let f=0;f<=140;f+=14)l.push([et+s*1.5,f,a(f)]);t.set(6,ut,.6),t.tube(l,.24,5)}for(let s=2;s<139;s+=3.4)if(t.tube([[et-1.5,s,a(s)],[et+1.5,s,a(s)]],.17,4),Math.round(s/3.4)%5===0)for(const l of[-1,1])t.tube([[et+l*1.5,s,a(s)],[et+l*1.5,s,a(s)-1.3]],.14,4)}const P0=68,It=4.7,f0=Math.atan(6/140),St={C:new m.Vector3(et,P0,mt-Ft(P0)[1]),ax:new m.Vector3(0,-Math.sin(f0),Math.cos(f0)),t0:6720};{t.bone=0,t.uvOn=!1,t.rand=.3,t.push().move(St.C.x,St.C.y,St.C.z).rotX(-Math.PI/2+f0),t.set(1,E,1.05),t.lathe([[It+.75,0],[It+.75,.45],[It+.55,.7],[It+.25,.7],[It,.5],[It,.3]],48),t.lathe([[.55,.3],[.55,.86],[.35,.96],[.01,.96]],12),t.set(5,Ot,1),t.ao=.085,t.rand=0,t.lathe([[It,.3,.35],[It*.72,.3,.55],[It*.36,.3,.82],[.01,.3,1]],48),t.ao=1,t.set(0,Kt),t.rand=.2;for(let o=0;o<60;o++){const i=o%5===0,a=i?.09:.04,s=i?3.75:4.1;t.push().rotY(o/60*Math.PI*2),t.poly([[-a,.42,s],[a,.42,s],[a,.42,4.5],[-a,.42,4.5]],[0,1,0]),t.pop()}const e=(o,i,a,s,l,f)=>{t.poly([[0,o,-i],[-a,o,0],[a,o,0]],[0,1,0]),t.poly([[-a,o,0],[-s,o,l],[0,o,f],[s,o,l],[a,o,0]],[0,1,0])};t.bone=20,e(.5,.7,.16,.34,1.9,2.8),t.bone=21,e(.62,.9,.13,.07,3.6,4.15),t.bone=22,t.poly([[-.035,.77,-1.2],[.035,.77,-1.2],[.035,.77,4.3],[-.035,.77,4.3]],[0,1,0]),t.push().move(0,.74,-.85),t.lathe([[.3,.03],[.01,.03]],10),t.pop(),t.bone=0,t.pop()}await L();const ft=mt,at=52,st=-30.4,Nt=-38,Et=ft+5.8,H={spindle:[Nt,0,Et],g1:[0,at+5.2,Et],g2:[0,at+9.9,ft-.8],g3:[0,at+12.1,ft-9],worm:[-35.5,0,ft-9],sector:[0,at+21,ft+.5],hinge:[],armLen:4};{t.bone=0,t.uvOn=!1,t.rand=.7,t.uvOn=!0,t.set(0,R[1],1.1),t.push().move(st-.15,at+15,ft),t.box(.15,15,12,.05),t.pop(),t.uvOn=!1,t.set(0,lt,.9),t.push().move(st-6.8,at-.5,ft),t.box(6.8,.5,12.4,.2),t.pop(),t.uvOn=!0,t.push().move(st-6.9,at+30.6,ft),t.box(7.1,.6,12.8,.25),t.pop(),t.push().move(st-7,at+31.6,ft),t.box(7.5,.4,13.3,.2),t.pop(),t.uvOn=!1;for(const o of[-1,1])t.set(0,lt,.8),t.push().move(st-1.7,at+15,ft+o*12.1),t.box(1.7,15,.3,.12),t.pop(),t.set(1,E),t.push().move(st-13.2,at,ft+o*12),t.lathe([[.5,0],[.5,.5],[.3,.8],[.3,29.2],[.5,29.5],[.5,30]],8),t.pop(),t.set(0,lt,.75),t.push().move(st-3.4,at-2.6,ft+o*9),t.rotZ(.55),t.box(3.6,.35,.3,.1),t.pop();t.set(1,E),t.push().move(st-13.4,at+.7,ft),t.rotX(Math.PI/2),t.lathe([[.22,-12],[.22,12]],6),t.pop(),t.set(1,E),t.push().move(Nt,at,Et),t.lathe([[2.2,0],[2.2,.5],[1.5,.9],[1.1,1.6],[1.1,2]],16),t.pop(),t.bone=5,t.push().move(Nt,at,Et),t.lathe([[.42,2],[.42,12.2],[.7,12.5],[.95,13.6],[.95,14.4],[1.25,14.5],[1.25,15.1],[.5,15.4],[.4,17.2],[.7,17.5],[.5,18.2],[.01,18.4]],12),t.lathe([[.85,7.2],[1.15,7.4],[1.15,8.6],[.85,8.8]],12),t.push().move(0,3.2,0).rotX(-Math.PI/2),o0(t,2.4,24,.7,{cone:.82,hub:.9,spokes:4,toothH:.3}),t.pop(),t.pop(),await L();for(let o=0;o<P;o++){const i=o/P*Math.PI*2,a=Nt+Math.cos(i)*.95,s=Et+Math.sin(i)*.95,l=at+14.8;H.hinge.push([a,l,s,i]),t.bone=6+o,t.set(6,ut,.8),t.tube([[a,l,s],[a,l-H.armLen+1.2,s]],.2,6),t.set(1,E,1.15),t.push().move(a,l-H.armLen,s),t.ball(1.8,18,12),t.lathe([[.45,1.6],[.45,2.1],[.3,2.2]],8),t.pop()}const e=(o,i,a,s)=>{t.set(6,ut,.7),t.push().move((i+a)/2,o[1],o[2]).rotZ(Math.PI/2),t.lathe([[s,-(i-a)/2],[s,(i-a)/2],[.01,(i-a)/2+.3]],8),t.pop()};t.bone=9,e(H.g1,st,Nt+2.3,.4),t.set(1,E,1.05),t.push().move(st-1.1,H.g1[1],H.g1[2]).rotY(Math.PI/2),o0(t,1.9,Math.round(_/2),.8,{hub:.7,spokes:4,toothH:.34}),t.pop(),t.push().move(Nt+2.4,H.g1[1],H.g1[2]).rotY(-Math.PI/2),o0(t,2,20,.7,{cone:.8,hub:.8,spokes:4,toothH:.3}),t.pop(),t.bone=10,e(H.g2,st,st-4.2,.5),t.set(1,E,.95),t.push().move(st-1.1,H.g2[1],H.g2[2]).rotY(Math.PI/2),o0(t,6.5,j,.8,{hub:1.2,spokes:6,toothH:.36,ri:5.4}),t.pop(),t.set(6,ut,.55),t.push().move(st-2.9,H.g2[1],H.g2[2]).rotZ(Math.PI/2),t.lathe([[2.3,-1.1],[2.3,-.95],[2,-.9],[2,.9],[2.3,.95],[2.3,1.1]],16),t.pop(),t.bone=14,e(H.g3,st,st-2.4,.35),t.set(1,E,1.1),t.push().move(st-1.1,H.g3[1],H.g3[2]).rotY(Math.PI/2),o0(t,2,16,.8,{hub:.7,spokes:4,toothH:.34}),t.pop();for(let o=0;o<2;o++){const i=H.g2[2]+(o?2:-2),a=st-2.5-o*.8,s=44;t.bone=15,t.set(6,ut,.5),t.tube([[a,s,i],[a,at+9.9,i]],.16,4),t.bone=12,t.set(0,new m.Color(.1,.105,.12)),t.push().move(a,s-5,i),t.lathe([[.01,5.3],[.35,5.2],[.5,4.6],[.95,4.4],[1,.3],[.8,0],[.01,0]],12),t.pop()}await L(),t.bone=11,t.set(6,ut,.8),t.push().move(H.worm[0],at,H.worm[2]),t.lathe([[.45,12.5],[.45,26.5],[.01,26.8]],8),t.lathe([[.8,16.4],[.8,16.9],[.45,17.1]],8);{const o=[];for(let i=0;i<=60;i++){const a=i/60,s=a*Math.PI*2*5;o.push([Math.cos(s)*.95,17.4+a*7.2,Math.sin(s)*.95])}t.set(1,E,1.1),t.tube(o,.42,5)}t.pop(),t.bone=0,t.set(0,lt,.8);for(const o of[at+13.2,at+26])t.push().move((st+H.worm[0])/2,o,H.worm[2]),t.box((st-H.worm[0])/2+.6,.35,.7,.12),t.pop();t.push().move((st+H.worm[0])/2-.3,H.sector[1],H.sector[2]),t.box((st-H.worm[0])/2+.9,.5,.5,.15),t.pop(),t.bone=13,t.set(1,E,1),t.push().move(H.worm[0],H.sector[1],H.sector[2]).rotY(Math.PI/2);{for(let x=0;x<44;x++){const p=-.66+1.32*x/44,v=-.66+(.66- -.66)*(x+1)/44,h=8.6+(x&1?.32:0),r=(c,u,w)=>[Math.cos(u)*c,Math.sin(u)*c,w];if(t.poly([r(7.9,p,.35),r(h,p,.35),r(h,v,.35),r(7.9,v,.35)],[0,0,1]),t.poly([r(7.9,p,-.35),r(h,p,-.35),r(h,v,-.35),r(7.9,v,-.35)],[0,0,-1]),t.poly([r(h,p,-.35),r(h,v,-.35),r(h,v,.35),r(h,p,.35)],[Math.cos((p+v)/2),Math.sin((p+v)/2),0]),t.poly([r(7.9,p,-.35),r(7.9,v,-.35),r(7.9,v,.35),r(7.9,p,.35)],[-Math.cos((p+v)/2),-Math.sin((p+v)/2),0]),x>0){const c=8.6+(x&1?0:.32);t.poly([r(8.6,p,-.35),r(8.6+.32,p,-.35),r(8.6+.32,p,.35),r(8.6,p,.35)],[x&1?-Math.sin(p):Math.sin(p),x&1?Math.cos(p):-Math.cos(p),0])}}for(const x of[-.66+.04,0,.66-.04])t.push().rotZ(x).move(4.2,0,0),t.box(3.9,.32,.22,.08),t.pop();t.push().rotX(Math.PI/2),t.lathe([[.4,-.9],[1.1,-.7],[1.1,.7],[.4,.9]],12),t.pop()}t.pop(),t.bone=0,t.set(6,ut,.6);{const o=[];for(let i=at+32;i<=136;i+=13)o.push([et-Ft(i)[0]-1.2,i,ft-9]);t.tube(o,.28,5)}for(let o=at+40.7;o<134;o+=13)t.push().move(et-Ft(o)[0]-.6,o,ft-9),t.box(.7,.3,.45,.1),t.pop();n0(t,st-13.3,at+20,ft-12,-1,0),n0(t,st-6,at+27.4,ft+4,0,0),n0(t,et+2.5,96,mt+Ft(96)[1]+.9,0,1)}await L();const C0=e=>{t.set(1,E,1.1),t.lathe([[e-1.5,0],[e,0],[e,.5],[e-1.5,.5],[e-1.5,0]],48);for(let o=0;o<4;o++)t.push().rotY(o/4*Math.PI*2+.4).move((e-1.5+1.2)/2,.25,0),t.box((e-1.5-1.2)/2+.1,.18,.3,.08),t.pop();t.lathe([[1.3,0],[1.3,.8],[.7,1.2],[.01,1.25]],12),t.set(6,new m.Color(.05,.055,.07));for(let o=0;o<72;o++){const i=o%6===0?1.1:o%2===0?.7:.42;t.push().rotY(o/72*Math.PI*2).move(e-.12-i/2,.52,0),t.box(i/2,.03,.055,0),t.pop()}};{t.bone=0,t.uvOn=!1,t.rand=.35,t.set(0,lt,.92),t.push().move(et,141,-15.2),t.box(5.6,1,3.2,.3),t.pop(),t.push().move(et,143.6,-1.2),t.box(5.2,3.6,2.6,.4),t.pop();for(const o of[-1,1])t.push().move(et+o*4.4,142.4,-7.6).rotX(-.5),t.box(.35,.5,5.6,.12),t.pop();t.push().move(et,X,0).rotX(Math.PI/3),t.push().move(0,-9.5,6.3),t.box(3.8,8.6,.5,.2),t.pop(),t.bone=1,t.uvOn=!0,t.set(0,lt,1),t.lathe([[3.6,-20],[5.4,-19.2],[5.4,-16.5],[4.9,-16],[4.9,-6.5],[6.2,-6],[6.2,6],[5,6.8],[3,7.4],[.01,7.6]],28,{rRef:5.4}),t.uvOn=!1,t.set(1,E),t.lathe([[5.55,-18.4],[5.75,-18.2],[5.75,-17.4],[5.55,-17.2]],28),t.lathe([[6.35,-5.2],[6.5,-5],[6.5,5],[6.35,5.2]],28,{a0:0,a1:Math.PI*2}),t.bone=4,t.push().move(0,-20.2,0).rotX(Math.PI),C0(7),t.pop(),t.pop(),t.bone=1,t.push().move(0,X,0).rotZ(Math.PI/2),t.uvOn=!0,t.set(0,lt,1),t.lathe([[4.4,16],[5.6,16.4],[5.6,17.4],[5.2,17.8],[5.2,26.4],[5.6,26.8],[5.6,28.2],[4.2,29],[2,29.6]],28,{rRef:5.2}),t.uvOn=!1,t.set(6,ut,.7),t.lathe([[1.7,29.4],[1.7,31+F*2.6],[1.2,31.4+F*2.6],[.01,31.6+F*2.6]],14);const e=new m.Color(.2,.21,.235);for(let o=0;o<F;o++){const i=31+o*2.6,a=7.4-o*.45,s=o===F-1,l=Math.min(3.6,a*.52);if(t.set(0,e,1),t.rand=.2+o*.13,t.lathe(s?[[1.7,i],[a-.5,i],[a,i+.35],[a,i+1.95],[a-.5,i+2.3],[a-1.3,i+2.3],[a-1.5,i+2.1],[l,i+2.1],[l-.3,i+2.45],[1.7,i+2.45]]:[[1.7,i],[a-.5,i],[a,i+.35],[a,i+1.95],[a-.5,i+2.3],[1.7,i+2.3]],32),s)for(let f=0;f<6;f++)t.push().rotY(f/6*Math.PI*2).move(0,i+2.19,(l+a-1.5)/2),t.box(.17,.1,(a-1.4-l)/2,.04),t.pop();if(t.set(1,E,.95),t.lathe([[a+.01,i+.9],[a+.09,i+.98],[a+.09,i+1.32],[a+.01,i+1.4]],32),s){t.lathe([[a-.55,i+2.3],[a-.58,i+2.34],[a-1.22,i+2.34],[a-1.25,i+2.3]],32),t.set(6,ut,.5);for(let f=0;f<12;f++)t.push().rotY((f+.5)/12*Math.PI*2).move(0,i+2.34,a-.9),t.lathe([[.26,0],[.26,.2],[.16,.3],[.01,.3]],6),t.pop()}}t.set(1,E),t.lathe([[2.4,31.2+F*2.6],[2.9,31.4+F*2.6],[2.9,32.2+F*2.6],[2.4,32.4+F*2.6]],14),t.pop()}await L();const pt=e=>10+2*(e+Ut)/(Ut+r0),Pt=[-10.05,-91.4,-5.8];t.push().move(0,X,0).rotX(Math.PI/2-e0);const Yt=t.m.clone();{t.bone=2,t.rand=.5,t.uvOn=!0,t.set(2,Tt,1);const e=[[pt(-83),-83]];for(const a of[-57,-23,45,79]){const s=pt(a);e.push([s,a-.55],[s+.75,a-.55],[s+.75,a+.55],[s,a+.55])}e.push([pt(104),104]),t.lathe(e,48,{rRef:10.9});const o=(a,s,l,f)=>{for(let x=0;x<l;x++)t.push().rotY((x+.5)/l*Math.PI*2).move(0,s,a),f||t.rotX(Math.PI),t.lathe([[.36,0],[.36,.3],[.22,.44],[.01,.44]],6),t.pop()};t.uvOn=!1,t.set(1,E,.9);for(const a of[-57,-23,45,79])o(pt(a)+.4,a+.55,28,!0),o(pt(a)+.4,a-.55,28,!1);o(11.78,11,32,!0),o(11.78,-11,32,!1),t.uvOn=!0,t.set(0,lt,1.05),t.lathe([[11.2,-11],[12.3,-11],[12.3,-9.5],[11.9,-9],[11.9,9],[12.3,9.5],[12.3,11],[11.2,11]],48,{rRef:12}),t.push().rotZ(Math.PI/2),t.lathe([[6,11.4],[5.2,12.6],[4.6,16]],28,{rRef:5}),t.pop(),t.uvOn=!1,t.uvOn=!0,t.set(4,Kt,1),t.lathe([[pt(-90.5)-.5,-90.5],[pt(111)-.5,111]],48,{inward:!0,rRef:10});for(let a=0;a<11;a++){const s=-81+17*a,l=pt(s)-.5,f=7.5+(s+81)*.0188;t.set(4,Kt,1.2),t.rand=.1*a,t.lathe([[f+.3,s-.2],[l,s-.2]],48,{rRef:10}),t.lathe([[l,s+.2],[f,s+.2]],48,{rRef:10}),t.set(5,Rt,1),t.ao=.16,t.rand=1,t.lathe([[f,s+.2],[f+.3,s-.2]],48),t.ao=1}t.uvOn=!1;{for(let f=0;f<U0;f++){t.bone=Wt+f;const x=(v,h,r,c,u,w)=>{let y=-1,k=-1;for(let K=0;K<=60;K++){const tt=le*K/60,G=Math.sin(tt),z=Math.cos(tt),d=h0+re*K/60,C=t.v(v*G,d+h,v*z,u*G,w,u*z,-1e4,0),$=t.v(r*G,d+c,r*z,u*G,w,u*z,-1e4,Math.max(0,r-c0-.18));K&&(t.tri(y,C,k),t.tri(C,$,k)),y=C,k=$}};t.set(4,Kt,1.2),t.rand=.37,t.ao=1,x(c0+.18,0,ie,0,0,-1);const p=Math.hypot(.18,.003);t.set(5,Rt,1),t.ao=.16,t.rand=1,x(c0,.003,c0+.18,0,-.003/p,-.18/p),t.ao=1}t.bone=2}t.rand=.5,t.set(1,E,1.05),t.lathe([[12,104],[12.6,104.3],[12.6,106],[12.95,106.4],[12.95,108.5],[12.5,109],[12.5,112],[13.2,112.4],[13.2,113.6],[12.75,114],[12.75,122.2],[13,122.6],[13,123.4],[12.3,123.4],[12.3,113.3],[11,113.3],[11,112.4],[11.2,112.1],[11.2,111.3],[11.35,111],[11.5,111]],48);for(let a=0;a<16;a++)t.push().rotY((a+.5)/16*Math.PI*2).move(0,113,13.25),t.rotX(Math.PI/2),t.lathe([[.01,.55],[.4,.5],[.45,0],[.01,0]].reverse(),6),t.pop();t.set(1,E,1.1),t.lathe([[11.46,103.2],[11.25,103.2],[11.12,103.5],[11.12,104.3],[10.96,104.6],[10.93,108.4],[11.06,108.7],[11.06,109.4],[10.8,109.8],[10.64,112.6],[10.64,112.95]],48,{inward:!0}),t.set(1,E,1.25);for(let a=0;a<24;a++)t.push().rotY((a+.5)/24*Math.PI*2).move(0,106.6,10.94),t.rotX(-Math.PI/2),t.lathe([[.01,0],[.42,0],[.36,.34],[.01,.42]],6),t.pop();t.set(1,E,1.05),t.lathe([[7.5,-89.5],[7.5,-91],[8.1,-91],[8.25,-91.3],[9.65,-91.3],[9.8,-91],[10.5,-91],[10.5,-89],[10.95,-88.5],[10.95,-86.4],[10.6,-86],[10.6,-83.4],[pt(-83),-83]],48),t.uvOn=!1,t.set(6,ut,.8),o(8.95,-91.3,20,!1),t.set(1,E,1.05),await L();const i=[[.94,.34],[-.94,.34],[.5,.866]];for(const[a,s]of i){const l=[];for(let f=-88;f<=-12;f+=9.5){const x=pt(f)+1.15;l.push([a*x,f,s*x])}t.set(6,ut,.85),t.tube(l,.3,6);for(let f=-78.5;f<=-14;f+=19){const x=pt(f)+.5;t.set(1,E),t.push().move(a*x,f,s*x).rotY(Math.atan2(a,s)),t.box(.3,.5,.75,.1),t.pop()}t.set(1,E,1.1),t.push().move(a*(pt(-88)+1.15),-89.6,s*(pt(-88)+1.15)),t.lathe([[.3,1.6],[.75,1.2],[.75,.4],[.45,0],[.01,-.1]].reverse(),8),t.pop()}{const a=c=>-(pt(c)+1.3),x=pt(97.3)+1.3,p=(c,u,w)=>{const y=t.nv;t.tube(c,u,w);for(let k=y;k<t.nv;k++)t.U[k*2]=-1e4,t.U[k*2+1]=0},v=()=>{t.rotX(-Math.PI/2),t.lathe([[.45,0],[.45,.24],[.2,.44],[.16,1.55]],8),t.pop()};t.set(1,E,.9);for(const c of[-1,1]){const u=[[c*1.5,11.6,a(12.6)+1.65],[c*1.5,11.6,a(12.6)+.95],[c*1.5,12.049999999999999,a(12.6)+.35],[c*1.5,12.6,a(12.6)]];for(let w=21;w<100.2-4;w+=9)u.push([c*1.5,w,a(w)]);u.push([c*1.5,100.2,a(100.2)],[c*1.5,100.2+.55,a(100.2)+.35],[c*1.5,100.2+1,a(100.2)+.95],[c*1.5,100.2+1,a(100.2)+1.65]),p(u,.24,5)}for(let c=0,u=14;u<100.2;c++,u+=3.4)if(p([[-1.5,u,a(u)],[1.5,u,a(u)]],.17,4),c%5===0)for(const w of[-1,1])t.push().move(w*1.5,u,a(u)+1.55),v();const h=[],r=(c,u)=>h.push([u*Math.sin(c),97.3,-u*Math.cos(c)]);r(-1.036,x-1.55),r(-1.036,x-.95),r(-1.002,x-.35);for(let c=-7;c<=7;c++)r(c/7*.96,x);r(1.002,x-.35),r(1.036,x-.95),r(1.036,x-1.55),p(h,.26,6);for(const c of[-.96,-.5,.5,.96])t.push().rotY(-c).move(0,97.3,-(x-1.45)),v()}await L();for(const a of[-1,1]){const s=a*.643,l=-.766,f=13.9;t.push().move(s*f,-86,l*f),t.set(2,Tt,.95),t.lathe([[1.25,2],[1.35,U-2]],14),t.set(1,E),t.lathe([[1.35,U-2],[1.65,U-1.6],[1.65,U+.6],[1.4,U+.6]],14),t.lathe([[.45,-5.5],[.7,-5.2],[.7,-3],[1,-2.6],[1,0],[1.35,.4],[1.35,2],[1.25,2]],14),t.set(0,lt,.9);for(const x of[4,U-6])t.push().move(-s*1.9,x,-l*1.9).rotY(Math.atan2(s,l)),t.box(.3,.45,2,.1),t.pop(),t.lathe([[1.45,x-.5],[1.6,x-.4],[1.6,x+.4],[1.45,x+.5]],14);t.pop()}for(const a of[-1,1]){t.push().move(a*pt(-79),-79,0).rotZ(-a*Math.PI/2),t.set(1,E),t.lathe([[1.3,-.2],[1.3,.5],[.8,.9],[.4,1],[.4,3],[.75,3.1],[.75,3.7],[.01,3.9]],12),t.bone=a<0?17:18,t.push().move(0,3.3,0),t.torus(3,.24,36,8);for(let s=0;s<q;s++){const l=s/q*Math.PI*2;t.tube([[.5*Math.sin(l),0,.5*Math.cos(l)],[3*Math.sin(l),0,3*Math.cos(l)]],.14,5)}t.set(1,E,1.2),t.push().move(2.2,.5,0),t.lathe([[.26,-.3],[.3,.5],[.22,.9],[.01,1]],8),t.pop(),t.pop(),t.pop(),t.bone=2}t.push().move(12.2,0,0).rotZ(-Math.PI/2),t.set(0,lt,1),t.lathe([[2.2,0],[1.9,1],[1.9,1.3]],14),t.push().move(0,1,0),t.bone=16,C0(7),t.bone=2,t.pop(),t.pop(),t.set(1,E),t.push().move(13.9,8.4,0),t.box(.25,1.6,.3,.08),t.pop(),t.push().move(14.4,7,0).rotZ(-Math.PI/2),t.lathe([[.7,-.2],[.7,1.4],[.45,1.8]],10),t.pop(),await L(),t.bone=3,t.rand=.8,t.set(1,E,1),t.lathe([[.01,-92.6],[8.6,-92.6],[8.9,-92.3],[8.9,-91.7],[8.6,-91.4]],40),t.push().move(0,-92.6,0).rotX(Math.PI),t.lathe([[2.3,0],[2.3,2.2],[2.6,2.4],[2.6,3.1],[1.9,3.3],[1.9,5.4],[2.15,5.6],[2.15,6.3],[1.2,6.5],[.9,6.3],[.01,6.3]],16);for(let a=0;a<4;a++){const s=a/4*Math.PI*2+.6,l=1+.2*(a*7%3),f=2.4+a*.7;t.push().move(Math.cos(s)*5.6,0,Math.sin(s)*5.6),t.lathe([[l+.25,0],[l+.25,.5],[l,.7],[l,f],[l*.6,f+.3],[.01,f+.3]],12),t.pop()}t.pop(),t.set(1,E,.9),t.push().move(Pt[0]*.55,-92,Pt[2]*.55).rotY(Math.atan2(Pt[0],Pt[2])),t.box(1.1,.45,5.6,.2),t.pop(),t.push().move(Pt[0],0,Pt[2]),t.lathe([[.01,-93.6],[.9,-93.5],[.9,-89.2],[.01,-89.1]],10),t.bone=2,t.lathe([[1.25,-90.9],[1.25,-89],[.9,-88.6]],10),t.push().move(-Pt[0]*.07,-89.6,-Pt[2]*.07),t.box(.9,.5,.9,.15),t.pop(),t.pop()}t.pop(),await L();const j0=Dt(kt,t.build(),a0,"machine"),L0=new m.RingGeometry(u0-.6,y0,72,1);L0.applyMatrix4(new m.Matrix4().copy(Yt).multiply(jt.makeTranslation(0,113,0)).multiply(new m.Matrix4().makeRotationX(Math.PI/2)));const z0=new m.ShaderMaterial({uniforms:k0,vertexShader:ce,fragmentShader:ue,side:m.DoubleSide,fog:!1});m0.push(z0);const p0=Dt(kt,L0,z0,"lens");p0.matrixAutoUpdate=!1,await L();const Jt=new m.Group;Jt.name="floor",kt.add(Jt);const Ct=125,I0=n.floorRise??50;if(n.floor!==!1){const e=new At(9e3);e.rand=.4,e.set(8,new m.Color(n.deckColor??"#8a7b6c"),1),e.lathe([[Ct,0],[100,0],[75,0],[50,0],[25,0],[.01,0]],72),e.set(0,lt,.6),e.lathe([[Ct-.8,-3.4],[Ct+.3,-3],[Ct+.3,0],[Ct,0]],72),e.set(1,E,.9),e.lathe([[Ct-1.2,.02],[Ct-1.2,.3],[Ct-1.9,.3],[Ct-1.9,.02]].reverse(),72);const o=N.uHole.value.z,i=N.uHole.value.w;e.set(0,lt,.7);for(const a of[-1,1])e.push().move(et+a*(o+.5),.6,mt),e.box(.5,.6,i+1,.15),e.pop(),e.push().move(et,.6,mt+a*(i+.5)),e.box(o+1,.6,.5,.15),e.pop();{const a=e.uvOn;e.uvOn=!0,e.set(12,new m.Color(.5,.4,.39),1.5);const s=30,l=[.95,.95,.12,.12];for(const f of[-1,1]){const x=et+f*(o+.02),p=mt+f*(i+.02);e.poly([[x,-.1,mt-i],[x,-.1,mt+i],[x,-s,mt+i],[x,-s,mt-i]],[-f,0,0],[[s,0],[s,2*i],[0,2*i],[0,0]],l),e.poly([[et-o,-.1,p],[et+o,-.1,p],[et+o,-s,p],[et-o,-s,p]],[0,0,-f],[[s,50],[s,50+2*o],[0,50+2*o],[0,50]],l)}e.uvOn=a}for(let a=0;a<12;a++){const s=a/12*Math.PI*2,l=Math.sin(s)*116,f=Math.cos(s)*116;e.set(0,lt,.45),e.push().move(l,0,f),e.lathe([[1.3,0],[1.3,.3],[.5,.7],[.3,1.2],[.3,5.4],[.55,5.6],[.55,6]],8),e.pop(),n0(e,l,6.1,f,0,0,!0)}Dt(Jt,e.build(),a0,"deck")}await L();const J=(e,o,i)=>new m.Vector3(e,o,i),yt=J(0,V0,B0),Vt=J(0,X,0),wt=e=>Vt.clone().addScaledVector(yt,e),Z0=J(Pt[0],0,Pt[2]).applyMatrix4(Yt);N.uIrisA.value.set(yt.x,yt.y,yt.z,0),N.uIrisC.value.copy(J(0,h0,0).applyMatrix4(Yt)),N.uIrisP.value.copy(J(0,h0,ne).applyMatrix4(Yt));const $0=[J(-(pt(-79)+3.3),-79,0).applyMatrix4(Yt),J(pt(-79)+3.3,-79,0).applyMatrix4(Yt)],A0=J(et,X,0),T0=J(0,.5,Math.sqrt(.75)),Q0={pivot:Vt,axis:yt.clone(),tail:wt(-Ut),lens:wt(r0),tailApproach:wt(-Ut-24),irisS:h0,portalSeat:{position:wt(112.5),facing:yt.clone().negate(),radius:u0,shape:"circle",tilt:!0},flyThrough:[[-44,16,-150],[-46,16,-112],[-50,30,-74],[-55,48,-36],[-56,60,-8],[-58,70,22],[-46,84,46],[-20,100,60],[12,120,56],[32,136,34],[27,138,6],[26,104,-30],[26,72,-62],[26,66,-76],[13,63,-89],[1,61.5,-79]].map(e=>J(e[0],e[1],e[2])).concat([wt(-Ut-24),wt(-Ut),wt(0),wt(112.5)]),viewpoints:{entry:J(-44,16,-150),clockPass:J(-56,60,-8),linger:J(-52,78,36),rail:J(0,118,58),flank:J(26,104,-30),tailTurn:J(13,63,-89),inTube:wt(0)},clockCase:J(st-7,at+14,ft),governor:J(Nt,at+12,Et),pierTop:J(et,140,mt),counterweights:J(-38,X,0),domeCentre:J(0,X,0),slitCentre:J(0,X,0).addScaledVector(yt,b),slitFoot:J(0,X+6,b-2),crown:J(0,X+b,0),rail:{y:X-6.1,radius:b-3},rope:{y:X-17,radius:b-3.5},wallHead:{y:X-14.2,radius:b},floor:{radius:Ct,rise:I0,hole:[et,mt,N.uHole.value.z,N.uHole.value.w]},desk:J(-48,0,-112),lamps:i0.map(e=>({position:J(e.pos[0],e.pos[1],e.pos[2]),ridesFloor:e.rides}))},it={u:n.progress??.62,set:!1,clockT:-1,starMul:1,flash:0,floorY:0,open:1,domeAngle:0,userLamps:{}},d0=new m.Matrix4,v0=new m.Matrix4,b0=new m.Matrix4,Lt=new m.Matrix4,t0=new m.Vector3,Bt=J(1,0,0),K0=J(0,1,0),vt=(e,o,i,a)=>e.makeTranslation(o.x,o.y,o.z).multiply(v0.makeRotationAxis(i,a)).multiply(b0.makeTranslation(-o.x,-o.y,-o.z)),Gt=e=>t0.set(e[0],e[1],e[2]),R0=wt(-Ut),J0=wt(r0+10),te=i0.filter(e=>!e.rides).slice(0,7),ee=i0.some(e=>e.rides),D0=n.clockAt??[.19,.25],oe=(n.creep??0)*Math.PI/180,ae=n.creepRate??.09,F0=n.flicker??0;let x0=n.lampGain??3.5;const se=(n.track??6)*Math.PI/180;function q0(e,o,i){const a=it.u,s=(d,C,$)=>{const Y=Math.min(1,Math.max(0,($-d)/(C-d)));return Y*Y*(3-2*Y)};kt.updateMatrixWorld(),d0.copy(kt.matrixWorld).invert(),N.uHeroInv.value.copy(d0),i&&(i.getWorldPosition(t0),N.uCamL.value.copy(t0.applyMatrix4(d0))),N.uTime.value=o;const l=it.open=.2+.8*Zt(.02,.28,a);N.uSlit.value.x=xt*l,N.uShut.value=(xt+.6)*l+3.4*s(.9,1,l);const f=it.domeAngle=D*(1-(n.domeEase==="cubic"?s(0,.3,a):Zt(0,.3,a)))-Math.sign(D)*se*Math.max(0,(a-.3)/.7)+oe*(n.creepEarly?1+n.creepEarly*(1-s(.04,.24,a)):1)*Math.sin(o*ae-1.1);zt.rotation.y=f,N.uDomeCS.value.set(Math.cos(f),Math.sin(f)),M0.uniforms.uSpin.value=-f*(b-3)/2.5,N.uRun.value.set(f*(b-3.5)+o*.9,l*xt),N.uStar.value=(I+(T-I)*s(.22,.31,a))*it.starMul,N.uFlash.value.w=it.flash,it.floorY=I0*Zt(.06,.45,a),Jt.position.y=it.floorY,N.uGlow.value=.78+.22*Math.sin(o*1.3)+.1*Math.sin(o*3.1+1);const x=Math.sin(Math.PI*Math.min(1,Math.max(0,(a-.262)/.06))),p=Zt(.05,.3,a)+.03*x*x,v=g*(1-p),h=S+(e0-S)*p;vt(Q[1],A0,T0,v),vt(Lt,Vt,Bt,-(h-e0)),Q[2].multiplyMatrices(Q[1],Lt),vt(Lt,Z0,yt,110*Math.PI/180*Zt(.48,.56,a)),Q[3].multiplyMatrices(Q[2],Lt),N.uTubeA.value.copy(R0).applyMatrix4(Q[2]),N.uTubeB.value.copy(J0).applyMatrix4(Q[2]),p0.matrix.copy(Q[2]);{const d=N.uCamL.value,C=(d.x-Vt.x)*yt.x+(d.y-Vt.y)*yt.y+(d.z-Vt.z)*yt.z,$=s(-95,100,C),Y=$*$;N.uTube.value.set(1+.15*s(-90,40,C),1-.6*s(-40,70,C),1.05+.6*Y,1-.6*$),N.uTube2.value.x=36*s(-120,-93,C)*(1-.6*s(20,100,C))}const r=Zt(D0[0],D0[1],a);it.clockT<0?it.clockT=o*r:it.clockT+=Math.min(e||0,.1)*r;const c=it.clockT,u=c*2.6,w=-u*24/20,y=-w*Math.round(_/2)/j,k=-y*j/16;vt(Q[4],A0,T0,v+c*.012),vt(Lt,Vt,Bt,c*.05),Q[16].multiplyMatrices(Q[2],Lt);for(let d=0;d<2;d++)vt(Lt,$0[d],Bt,(d?1:-1)*(1.5*Math.sin(o*.42+d*2.1)+.5*Math.sin(o*1.13+d))),Q[17+d].multiplyMatrices(Q[2],Lt);vt(Q[5],Gt(H.spindle),K0,u);const K=.24+.63*r+.02*Math.sin(o*2.3)*r;for(let d=0;d<H.hinge.length;d++){const C=H.hinge[d];t0.set(-Math.sin(C[3]),0,Math.cos(C[3])),Lt.makeTranslation(C[0],C[1],C[2]).multiply(v0.makeRotationAxis(t0,K)).multiply(b0.makeTranslation(-C[0],-C[1],-C[2])),Q[6+d].multiplyMatrices(Q[5],Lt)}vt(Q[9],Gt(H.g1),Bt,w),vt(Q[10],Gt(H.g2),Bt,y),vt(Q[14],Gt(H.g3),Bt,k),vt(Q[11],Gt(H.worm),K0,c*1.9),vt(Q[13],Gt(H.sector),Bt,.22-Math.min(c*.011,.5));const tt=Math.min(c*.22,16),G=at+9.9,z=(G-44+tt)/(G-44);Q[12].makeTranslation(0,-tt,0),Q[15].makeTranslation(0,G,0).multiply(v0.makeScale(1,z,1)).multiply(b0.makeTranslation(0,-G,0));{const d=St.t0+o,C=Math.floor(d),$=C+s(0,.12,d-C),Y=Math.PI*2;vt(Q[20],St.C,St.ax,d/43200*Y),vt(Q[21],St.C,St.ax,d/3600*Y),vt(Q[22],St.C,St.ax,$/60*Y)}N.uRing.value.y=it.floorY+7.1;{const d=ee?x0*(1+F0*.35*Math.sin(o*5.3)):0;N.uRingCol.value.set(Ot.r*d,Ot.g*d,Ot.b*d)}for(let d=0;d<8;d++){const C=it.userLamps[d],$=te[d];if(C){const Y=C.flick?1+C.flick*(.5*Math.sin(o*4.3+d*2.3)*Math.sin(o*1.9+d)+.3*Math.sin(o*7.9+d*3.1)+.2*Math.sin(o*2.7+d*1.3)):1;$t[d].set(C.x,C.y,C.z,C.range),Qt[d].set(C.r*Y,C.g*Y,C.b*Y)}else if($&&d<7){const Y=x0*(1+F0*(.5*Math.sin(o*6.1+d*1.7)+.3*Math.sin(o*10.7+d*3.1)+.2*Math.sin(o*3.3+d)));$t[d].set($.pos[0],$.pos[1]+($.rides?it.floorY:0),$.pos[2],30),Qt[d].set($.color.r*Y,$.color.g*Y,$.color.b*Y)}else $t[d].set(0,-999,0,1),Qt[d].set(0,0,0)}}q0(0,0,null);const N0={object:kt,radius:b+2,height:X+b+3,center:J(0,X-20,0),anchors:Q0,update:q0,ground:!1,groundY:0,dispose(){for(const e of m0)e.dispose()},setProgress(e){it.u=Math.min(1,Math.max(0,e)),it.set=!0},setIris(e){N.uIrisA.value.w=he*Math.min(1,Math.max(0,e))},setStar(e){it.starMul=e},setStarColor(e,o){const i=new m.Color(e);N.uStarCol.value.set(i.r,i.g,i.b);const a=new m.Color(o??e);N.uDomeCol.value.set(a.r,a.g,a.b)},setAmbient(e,o){const i=new m.Color(e),a=new m.Color(o);N.uAmbSky.value.set(i.r,i.g,i.b),N.uAmbGnd.value.set(a.r,a.g,a.b)},setFlash(e,o){if(it.flash=Math.min(1,Math.max(0,e)),o){const i=new m.Color(o);N.uFlash.value.set(i.r,i.g,i.b,it.flash)}},setFrost(e){N.uFrost.value=e},setAmbientShare(e,o,i,a){N.uAmbK.value.set(e,o,i,a)},setLampGlow(e,o){N.uLampGlow.value=e,o!=null&&(x0=o)},setFill(e){N.uFill.value=e},setBeam(e){N.uBeam.value=e},setRim(e){N.uRim.value=e},setLamp(e,o,i,a=30,s=5,l=0){if(!o){delete it.userLamps[e];return}const f=new m.Color(i);it.userLamps[e]={x:o.x,y:o.y,z:o.z,range:a,r:f.r*s,g:f.g*s,b:f.b*s,flick:l}},lit:{uniforms:N,vertexShader:O0,fragmentShader:_0,lightGLSL:W0,makeMaterial:e=>_t(e),Geo:At,kinds:{paint:0,brass:1,enamel:2,timber:3,black:4,glow:5,steel:6,floor:8,rope:10,brick:12,flags:13}},state:it,cast:{fittings:B,domeTurnDeg:D*180/Math.PI,parkHA:g,parkEl:S,nWeights:F,nBalls:P},lens:{uniforms:k0,mesh:p0},floorGroup:Jt,domeGroup:zt,floorY:()=>it.floorY,slitOpen:()=>it.open,domeAngle:()=>it.domeAngle,tubePose(e={}){return e.tail=R0.clone().applyMatrix4(Q[2]),e.lens=wt(r0).applyMatrix4(Q[2]),e}};return kt.userData.hero=N0,N0}export{fe as buildHero};
