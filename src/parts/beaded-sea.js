import*as e from"three";import{smoothstep as te,clamp as oe,lerp as de}from"../kit/core.js";const yo=["#19B5B0","#0E6F8E","#BFF3EA","#F4F1E6","#FF8A5C","#F7D774","#3B4A7A"],R=new e.Vector3(0,430,0),$=250,ae=new e.Vector3(235,394,175),Y=30,J=new e.Vector3(295.3,399.8,555.7),ne=60,we=new e.Vector3(117.2,418,220.5),De=new e.Vector3(267.2,402.6,502.7),ge=new e.Vector3(268,345,-410),Me=36,re=`
uniform float uTime;
uniform vec3 uSun, uSunCol, uSkyZen, uSkyMid, uSkyHaze, uGroundSun, uGroundShade;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm2(vec2 p){ return vn(p) * .55 + vn(p * 2.03 + 7.1) * .28 + vn(p * 4.1 + 3.7) * .17; }
// Analytic sky: zenith blue -> aqua -> cream haze, six combs of cirrus, a small gold sun, and below
// the horizon the white seabed dotted with periwinkle globe shadows. d must be normalised.
vec3 skyCol(vec3 d){
  float y = d.y;
  vec3 c = mix(uSkyMid, uSkyZen, smoothstep(0.04, 0.7, y));
  c = mix(uSkyHaze, c, smoothstep(-0.01, 0.2, y));
  vec2 p = d.xz / max(y, 0.07);
  float comb = smoothstep(0.45, 0.95, sin(p.y * 1.15 + vn(p * 0.6) * 2.2) * .5 + .5);
  float ci = fbm2(vec2(p.x * 0.36 + uTime * 0.006, p.y * 3.4)) * comb;
  float wisp = fbm2(vec2(p.x * 1.9 + uTime * 0.011, p.y * 10.) + vn(p * 0.9) * 1.6);
  ci = smoothstep(0.2, 0.66, ci * (0.5 + 1.0 * wisp)) * smoothstep(0.05, 0.28, y) * (1. - smoothstep(0.86, 0.99, y));
  c = mix(c, uSkyHaze * 1.06 + uSunCol * 0.05, ci * 0.62);
  float s = max(dot(d, uSun), 0.);
  float s2 = s * s; float s8 = s2 * s2 * s2 * s2; float s64 = s8 * s8 * s8 * s8 * s8 * s8 * s8 * s8;
  c += uSunCol * (s64 * s64 * s64 * s64 * 1.5 + s8 * s8 * 0.10);
  vec2 g = d.xz / max(-y, 0.03) * 380.;
  float blot = smoothstep(0.36, 0.94, vn(g * 0.011 + 3.3)) * 0.5 + smoothstep(0.4, 0.95, vn(g * 0.035 + 9.1)) * 0.3;      // soft-edged: the plain seen in a lens is never a cut-out
  float crack = (1. - smoothstep(0.0, 0.08, abs(vn(g * 0.05) - 0.5))) * 0.12;
  vec3 gr = mix(uGroundSun, uGroundShade, clamp(blot, 0., 1.)) * (1. - crack);
  gr = mix(gr, uSkyHaze, exp(min(y, 0.) * 9.));
  return mix(c, gr, (1. - smoothstep(-0.015, 0.0, y)));
}
// Wobble: three low lobes travelling over the unit sphere. w = (amplitude as fraction of R, speed, seed, -)
float wobf(vec3 n, vec4 w, float t){
  float tt = t * w.y + w.z;
  return w.x * (sin(n.x * 2.1 + n.y * 1.3 + tt) * .46 + sin(n.z * 2.7 - n.x * 1.2 + tt * 1.37 + 1.7 + w.z)
    * .32 + sin(n.y * 3.4 + n.z * 1.9 - tt * 0.81 + 4.1) * .22 + sin(dot(n, vec3(4.7, -3.9, 5.3)) + tt * 1.9) * .1);
}
// Length of the segment a->b that lies inside the sphere (c, r): how much water the eye looks through.
float waterPath(vec3 a, vec3 b, vec3 c, float r){
  vec3 d = b - a; float L = max(length(d), 1e-4); d /= L;
  vec3 oc = a - c; float bq = dot(oc, d); float h = bq * bq - (dot(oc, oc) - r * r);
  if (h <= 0.) return 0.;
  h = sqrt(h);
  return max(min(L, -bq + h) - max(0., -bq - h), 0.);
}
`;function We(n){const t=n+1,a=(1+Math.sqrt(5))/2,o=[-1,a,0,1,a,0,-1,-a,0,1,-a,0,0,-1,a,0,1,a,0,-1,-a,0,1,-a,a,0,-1,a,0,1,-a,0,-1,-a,0,1],c=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],r=(t+1)*(t+2)/2,p=new Float32Array(20*r*3),s=new Uint16Array(20*t*t*3);let i=0,u=0;for(let f=0;f<20;f++){const d=c[f*3]*3,w=c[f*3+1]*3,v=c[f*3+2]*3,g=f*r;for(let b=0;b<=t;b++)for(let C=0;C<=t-b;C++){const S=t-b-C,B=o[d]*S+o[w]*b+o[v]*C,A=o[d+1]*S+o[w+1]*b+o[v+1]*C,P=o[d+2]*S+o[w+2]*b+o[v+2]*C,m=1/Math.sqrt(B*B+A*A+P*P);p[i++]=B*m,p[i++]=A*m,p[i++]=P*m}const y=b=>g+b*(t+1)-b*(b-1)/2;for(let b=0;b<t;b++)for(let C=0;C<t-b;C++){const S=y(b)+C,B=y(b+1)+C;s[u++]=S,s[u++]=B,s[u++]=S+1,C<t-b-1&&(s[u++]=B,s[u++]=B+1,s[u++]=S+1)}}const h=new e.BufferGeometry;return h.setAttribute("position",new e.BufferAttribute(p,3)),h.setIndex(new e.BufferAttribute(s,1)),h.boundingSphere=new e.Sphere(new e.Vector3,1.15),h}function bo(n){const t=a=>new e.Color(a);return{uTime:{value:0},uSun:{value:new e.Vector3(.567,.788,-.234).normalize()},uSunCol:{value:t(n[5]).multiplyScalar(1.6)},uSkyZen:{value:t("#5C86C4")},uSkyMid:{value:t(n[2])},uSkyHaze:{value:t(n[3]).multiplyScalar(.92)},uGroundSun:{value:t("#D8D4C6")},uGroundShade:{value:t("#8E9CC6")},uShallow:{value:t(n[0])},uDeep:{value:t(n[1])},uPale:{value:t(n[2])},uCoral:{value:t(n[4])},uProgress:{value:0}}}const _e=n=>`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    float fogF = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor${n?" * gl_FragColor.a":""}, fogF);
#endif
`,xo=`
uniform vec4 uWob; uniform vec4 uBulge; uniform float uBulgeK; uniform float uShrink;
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying float vR; varying vec3 vCen;
#include <fog_pars_vertex>
${re}
vec3 dispG(vec3 n){
  float b = uBulge.w * exp(-(1. - dot(n, uBulge.xyz)) * uBulgeK);
  return n * (uShrink + wobf(n, uWob, uTime) + b);
}
void main(){
  vec3 n = normalize(position);
  vec3 t1 = normalize(cross(n, abs(n.y) < .9 ? vec3(0., 1., 0.) : vec3(1., 0., 0.)));
  vec3 t2 = cross(n, t1);
  vec3 p0 = dispG(n), p1 = dispG(normalize(n + t1 * .03)), p2 = dispG(normalize(n + t2 * .03));
  vec3 nl = normalize(cross(p1 - p0, p2 - p0));
  mat4 mm = modelMatrix;
  #ifdef USE_INSTANCING
    mm = modelMatrix * instanceMatrix;
  #endif
  vec4 w = mm * vec4(p0, 1.);
  vW = w.xyz; vN = normalize(mat3(mm) * nl); vL = n;
  vR = max(length(mm[0].xyz), 1e-3); vCen = mm[3].xyz;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,So=`
uniform vec3 uShallow, uDeep, uPale, uCoral;
uniform float uAbs, uRip, uInside, uFleck, uGhost, uTiMax, uBodyGain, uThinTeal, uSpec, uFres, uStand, uFlip;
uniform vec4 uNear;             // near clarity: x, y = skin distance range (m), z = strength, w = see-through floor
uniform vec4 uWin;              // inside view: xyz = direction of the round window (out through the far skin), w = cos of its half angle
#ifdef CUT
uniform vec4 uCutA, uCutB, uCutWobA, uCutWobB, uCutBulgeA, uCutBulgeB; uniform float uCutKA, uCutKB;
#endif
uniform vec4 uHeart;            // x = stain radius (m), w = intensity
uniform mat3 uGC;               // great-circle frame of the boats (columns: u, v, pole)
uniform float uBoatPh[12]; uniform float uBoatW; uniform float uBoatN;
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying float vR; varying vec3 vCen;
#include <fog_pars_fragment>
${re}
// slope of three scrolling ripple trains (globe-local metres) -> xyz gradient
vec3 ripG(vec3 p, float far){
  vec3 k1 = vec3(0.21, 0.52, 0.33), k2 = vec3(-0.71, 0.33, 0.62), k3 = vec3(0.9, -1.3, 1.1);
  float w = vn(p.xz * 0.02 + p.y * 0.013) * 0.7 + 0.5;
  float w2 = vn(p.xz * 0.085 + p.y * 0.07 + 11.);            // breaks the trains into unequal dashes: sun glitter, never a woven grid
  vec3 k0 = vec3(0.05, 0.11, -0.07);
  return (k0 * cos(dot(p, k0) - uTime * 0.7) * 5. + k1 * cos(dot(p, k1) - uTime * 1.3 + w * 4. + w2 * 5.) * 1.5 * sqrt(max(far, 1e-6)) + k2 * cos(dot(p, k2) + uTime * 1.9 + w * 6. - w2 * 7.) * 0.5 * far
        + k3 * cos(dot(p, k3) - uTime * 2.7 + w * 9.) * 0.22 * far * far) * w;
}
void main(){
  vec3 D = normalize(vW - cameraPosition);
  vec3 Ng = normalize(vN);
  float dist = length(vW - cameraPosition);
  float far = 1. / (1. + dist * 0.012);
#ifdef CUT
  // the bridge's buried ends: nothing of it is drawn inside the two globes it runs into
  { vec3 dm = vW - uCutA.xyz; float lm = max(length(dm), 1e-3); vec3 nn = dm / lm;
    if (lm < uCutA.w * (1. + wobf(nn, uCutWobA, uTime) + uCutBulgeA.w * exp(-(1. - dot(nn, uCutBulgeA.xyz)) * uCutKA)) - 0.6) discard;
    dm = vW - uCutB.xyz; lm = max(length(dm), 1e-3); nn = dm / lm;
    if (lm < uCutB.w * (1. + wobf(nn, uCutWobB, uTime) + uCutBulgeB.w * exp(-(1. - dot(nn, uCutBulgeB.xyz)) * uCutKB)) - 0.6) discard; }
#endif
  float dSkin = max(length(cameraPosition - vCen) - vR, 0.);
  float nearK = (1. - smoothstep(uNear.x, uNear.y, dSkin)) * uNear.z;
  float facing = smoothstep(0.02, 0.4, abs(dot(D, Ng)));
  vec3 pr = vL * vR;
  vec3 g = ripG(pr, far) * uRip * facing * (1. + 0.9 * nearK);
  // close to the lens: two short crossing trains, so the near skin is plainly moving water
  float cl = nearK * (1. - smoothstep(60., 190., dist));
  vec3 k4 = vec3(1.7, 2.3, -1.9), k5 = vec3(-2.9, 1.1, 2.6);
  float chop = vn(pr.xz * 0.11 + pr.y * 0.07 + uTime * 0.05);
  g += (k4 * cos(dot(pr, k4) - uTime * 3.1 + chop * 7.) * 0.10 + k5 * cos(dot(pr, k5) + uTime * 3.7 + chop * 11.) * 0.06) * uRip * facing * cl * (0.4 + chop);
  float foam = 0.;
#ifdef WAKES
  // V wakes behind twelve boats on the tipped equator; lon/lat in the great-circle frame
  vec3 q = vL * uGC;
  float lat = asin(clamp(q.z, -1., 1.)) * vR;
  float lon = atan(q.y, abs(q.x) < 1e-5 ? 1e-5 : q.x);
  float wkn = vn(pr.xz * 0.23 + pr.y * 0.17 + 3.) * 9., wkf = 1. - smoothstep(110., 240., dist);       // wakes are never a ruled grid, and far off they are foam only
  for (int i = 0; i < 12; i++) {
    float s = mod(uBoatPh[i] + uBoatW * uTime - lon, 6.2831853) * vR;      // metres astern
    float fade = exp(-s / 55.) * smoothstep(0., 6., s) * step(float(i) + .5, uBoatN);
    float arm = abs(lat) - s * 0.33 - 1.5;
    float ridge = exp(-arm * arm / (0.5 + s * 0.03));
    float inner = (1. - smoothstep(-8., 0., arm)) * (0.5 + 0.5 * sin(s * 0.9 - abs(lat) * 0.6 + wkn));
    g += vec3(sin(s * 1.7 + wkn), cos(lat * 1.3 - wkn * 0.7), sin(lat * 0.9 + s + wkn * 1.3)) * (ridge * 0.9 + inner * 0.25) * fade * wkf;
    foam += (ridge * 0.45 * (0.8 + 0.2 * sin(s * 0.21 - uTime * 0.9)) + (1. - smoothstep(0.6, 3.2, abs(lat))) * exp(-s / 30.) * 0.85) * fade;
  }
#endif
  vec3 N = normalize(Ng + (g - Ng * dot(g, Ng)));
  vec3 col = vec3(0.); float alpha = 1.;
#ifdef BODY
  #ifdef SURF
    float cs = clamp(dot(-D, Ng), 0., 1.); vec3 Nb = Ng + 2. * cs * D; vec3 Nf = Ng;
    vec3 Nx = mix(Ng, N, 0.5);
  #else
    float cs = clamp(dot(D, Ng), 0., 1.); vec3 Nb = Ng; vec3 Nf = Ng - 2. * cs * D;
    vec3 Nx = mix(Ng, normalize(Ng - (g - Ng * dot(g, Ng))), 0.35);
  #endif
  vec3 ev = Nx - dot(Nx, D) * D; float b = min(length(ev), 0.999); vec3 e = ev / max(length(ev), 1e-4);
  float del = 2. * (asin(b) - asin(b / 1.333));
  vec3 Dr = normalize(D * cos(del) - e * sin(del));
  // Close to the lens a wall of water shows the lens-true image only as haze: there the sky is held plainly upside
  // down (ground above, the cream horizon at eye level, zenith blue beneath), swimming with the ripples.
  vec3 Df = vec3(D.x, -(D.y + g.y * 0.35) * 1.3 - 0.02, D.z);
  Dr = normalize(mix(Dr, Df, nearK * uFlip) + vec3(0., 1e-4, 0.));
  vec3 sky = skyCol(Dr);
  float hb = Dr.y * 11.; hb = exp(-hb * hb);                       // the cream line of the horizon, held in the water
  sky = mix(sky, sky * (0.55 + 0.45 * smoothstep(-0.25, 0.0, Dr.y)), nearK) + uSkyHaze * hb * 0.9 * nearK;
  float cirN;
  { vec2 cq2 = Dr.xz / (abs(Dr.y) + 0.3);                  // streaks of cirrus under the held horizon, and the sky deepening below them
    cirN = smoothstep(0.5, 0.8, vn(vec2(cq2.x * 1.3 + cq2.y * 0.9 + uTime * 0.01, Dr.y * 17.))) * smoothstep(0.03, 0.2, Dr.y) * (1. - smoothstep(0.5, 0.8, Dr.y));
    sky = sky * mix(1., 0.8, nearK * smoothstep(0.05, 0.45, Dr.y)) + (uSkyHaze * 0.5 + uSunCol * 0.04) * cirN * nearK * 0.55; }
  sky = mix(sky, sky * (uPale * 0.55 + uShallow * 0.25), (1. - smoothstep(-0.06, 0.06, Dr.y))) * 0.9;
  float chord = 2. * vR * cs;
  chord = mix(chord, max(chord, vR * 0.5), nearK);        // close to: the glancing edge is still deep water, teal and not a grey film
  float T = exp(-chord * uAbs);
  float lit = 0.66 + 0.34 * dot(Nf, uSun);
  vec3 scat = mix(mix(mix(uPale * 0.62, uShallow * 0.5, uThinTeal), uShallow * 0.42, smoothstep(0.0, 0.4, 1. - T)), uDeep * 0.24, smoothstep(0.35, 0.95, 1. - T));
  scat = scat * lit * uBodyGain + uGroundSun * 0.10 * max(-Nf.y, 0.);
  // near water is plainly water: turquoise at the limb deepening to teal, a net of light playing inside the near skin
  vec3 scatN = mix(uShallow * 0.8, uShallow * 0.42 + uDeep * 0.42, smoothstep(0.12, 0.95, 1. - T)) * lit * uBodyGain + uGroundSun * 0.08 * max(-Nf.y, 0.);
  vec2 cq = (Nf.xz + Nf.y * 0.4) * (4. + vR * 0.09);
  float cnet = 1. - smoothstep(0., 0.24, abs(vn(cq + uTime * 0.13) - vn(cq * 1.6 - uTime * 0.09 + 3.)));
  scatN += (uShallow * 0.5 + uPale * 0.2) * cnet * 0.16 * (0.4 + 0.6 * max(dot(Nf, uSun), 0.));
  scat = mix(scat, scatN, nearK);
  float Ti = min(T + (1. - T) * uGhost, uTiMax);
  Ti = mix(Ti, max(Ti, uNear.w), nearK);               // close to the lens the water clears: the sky is held in it upside down
  vec3 tintT = mix(vec3(Ti * Ti, Ti, mix(Ti, 1., 0.1)), vec3(Ti * (0.55 + 0.45 * Ti), Ti, mix(Ti, 1., 0.1)), nearK);
  col = sky * mix(vec3(1.), uPale * 1.05, 0.55 * (1. - T)) * tintT + scat * (1. - Ti);
  col += (uSkyHaze * hb * 0.22 + (uSkyHaze * 0.5 + uSunCol * 0.04) * cirN * 0.16) * nearK;       // the held horizon and its cirrus stay plain in deep water
#ifdef CLEAR
  #ifndef CUT
  { // Clear water a few metres thick: the glass river, its beads and the bulbs at its ends, the droplets of the necklace.
    // What it holds is the world upside down: the cream plain with its blue shadows above, the bright line of the
    // horizon, and below it the sky deepening to its zenith blue at the lower edge, streaked with cirrus. Turquoise
    // only through the core of the unbroken river (nk 1); a bead, a bulb or a droplet is clearer yet.
  #ifdef CUT
    float nk = vNeck;
  #else
    float nk = 0.;
  #endif
    float core = smoothstep(0.2, 0.9, cs), deep = smoothstep(0.3, 0.9, 1. - T);
    float TiN = mix(0.92, mix(mix(0.74, 0.44, nk), 0.34, deep), core);
    vec3 skyN = sky * mix(vec3(1.), uPale * 0.95 + uShallow * 0.15, core * (0.5 + 0.5 * nk));
    col = skyN * TiN + mix(uPale * 0.7, mix(uShallow * 0.75 + uPale * 0.2, uShallow * 0.9, max(nk, deep)), core) * lit * (1. - TiN);
  }
  #endif
#endif
  float standIn = mix(1., smoothstep(70., 190., dSkin), uStand);      // painted stand-ins are never seen close
  // focused sunlight gathered on the far inner side: a net of caustic light, seen as a crescent
  float fo = smoothstep(0.55, 1.0, dot(Nb, -uSun)); fo *= fo * (1. - 0.8 * nearK);
  vec2 cp = (Nb.xz + Nb.y * 0.37) * 26.;
  float net = (1. - smoothstep(0.0, 0.16, abs(vn(cp + uTime * 0.11) - vn(cp * 1.7 - uTime * 0.07 + 5.))));
  col += (uShallow * 0.7 + uPale * 0.12) * fo * (0.6 + 0.4 * net) * 0.6;
  // coral heart: amber stain through the deep water
  vec3 oc = vCen - cameraPosition; float qd = length(cross(D, oc));
  float hg = exp(-qd * qd / max(uHeart.x * uHeart.x, 1.));
  float hw = exp(-qd * qd / max(uHeart.x * uHeart.x * 3.2, 1.));
  vec3 amber = uCoral * vec3(1., 0.85, 0.55);
  float hk = uHeart.w * standIn;
  col = mix(col, amber * 0.6, clamp(hg * 0.7, 0., 1.) * min(hk, 1.)) + amber * (hg * hg * 0.25 + hw * 0.05) * hk;
  // far globes: fish as drifting flecks turning together
  vec2 fp = vec2(atan(vL.z, abs(vL.x) < 1e-5 ? 1e-5 : vL.x) * 14., vL.y * 16.) + vec2(uTime * 0.25, sin(uTime * 0.2));
  float fl = step(0.93, h21(floor(fp))) * (1. - smoothstep(0.1, 0.42, length(fract(fp) - .5))) * (1. - T) * uFleck * standIn;
  col = mix(col, uDeep * 0.35 + vec3(0.5) * step(0.985, h21(floor(fp) + 3.)), fl);
  // camera inside the globe: Snell's window. Beyond 48 degrees the skin is a teal-silver mirror.
  // camera inside the globe: one round bright window on the far skin where the lens will leave; everywhere else the
  // skin is a teal-silver mirror that darkens with distance (total internal reflection)
  float wd = dot(D, uWin.xyz);
  float win = max(smoothstep(uWin.w - 0.05, uWin.w + 0.035, wd), 1. - smoothstep(1.5, 7., dist));
  float ring = smoothstep(uWin.w - 0.09, uWin.w - 0.02, wd) * (1. - smoothstep(uWin.w - 0.02, uWin.w + 0.05, wd));
  float mn = vn(vL.xz * 9. + vL.y * 7. + uTime * 0.3);
  vec3 mirror = mix(uDeep * 0.5, uShallow * 0.62, mn * mn) * (0.6 + 0.4 * exp(-dist / 30.)) * (0.8 + 0.3 * D.y)
    + uSunCol * 0.10 * smoothstep(0.2, 1., dot(D, uSun)) + (uPale * 0.5 + uSunCol * 0.08) * ring;
  float clear = exp(-dist / 40.);
  vec3 haze = (uShallow * 0.6 + uPale * 0.34) * (0.86 + 0.3 * D.y) + uSunCol * 0.16 * smoothstep(0.3, 1., dot(D, uSun));
  col = mix(col, mix(mirror, haze, win), uInside);
  alpha = 1. - uInside * win * (0.55 + 0.45 * clear) * 0.94;
#endif
#ifdef SURF
  float nv = clamp(dot(-D, N), 0., 1.);
  float om = 1. - nv; float F = (0.02 + 0.98 * om * om * om * om * om) * uFres;
  F = min(F + 0.10 * nearK * om, 1. - 0.45 * nearK);
  vec3 Rf = reflect(D, N);
  vec3 refl = skyCol(normalize(Rf + vec3(0., 1e-4, 0.))) * 1.15 + uPale * om * om * om * 0.3;
  float sd = max(dot(Rf, uSun), 1e-4);
  float sd4 = sd * sd; sd4 *= sd4; float sd32 = sd4 * sd4; sd32 *= sd32 * sd32;
  float gl = vn(pr.xz * 0.31 + pr.y * 0.23 + vec2(uTime * 0.5, -uTime * 0.35)) * vn(pr.zy * 0.53 - uTime * 0.45 + 7.);
  float glit = smoothstep(0.1, 0.4, gl);                  // glitter: the broad lobe shows only where a facet happens to face the sun
  vec3 spec = uSunCol * (pow(sd, 1800.) * 9. + (pow(sd, 220.) * 0.35 + sd32 * sd32 * (0.10 + 0.5 * cl)) * (0.25 + 2.2 * glit)) * uSpec;
  foam = clamp(foam, 0., 1.);
  #ifdef BODY
    col = mix(col, refl, F) + spec; col = mix(col, (uSkyHaze * 0.95 + uSunCol * 0.06), foam * 0.6);
  #else
    col = refl * F + spec + (uSkyHaze * 0.95 + uSunCol * 0.06) * foam * 0.55; alpha = clamp(F + foam * 0.55, 0., 1.);
  #endif
#endif
  gl_FragColor = vec4(col, alpha);
  FOGCODE
}`;function H(n,t,a={}){const o={};t!=="front"&&(o.BODY=1),t!=="back"&&(o.SURF=1),a.wakes&&(o.WAKES=1),a.cut&&(o.CUT=1),(a.cut||a.clear)&&(o.CLEAR=1);const c=t==="front";return new e.ShaderMaterial({defines:o,fog:!0,uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:n.uTime,uSun:n.uSun,uSunCol:n.uSunCol,uSkyZen:n.uSkyZen,uSkyMid:n.uSkyMid,uSkyHaze:n.uSkyHaze,uGroundSun:n.uGroundSun,uGroundShade:n.uGroundShade,uShallow:n.uShallow,uDeep:n.uDeep,uPale:n.uPale,uCoral:n.uCoral,uWob:{value:a.wob||new e.Vector4(.02,.3,0,0)},uBulge:{value:a.bulge||new e.Vector4(0,1,0,0)},uBulgeK:{value:a.bulgeK||40},uShrink:{value:a.shrink??1},uAbs:{value:a.abs??1/150},uRip:{value:a.rip??.1},uInside:{value:0},uFleck:{value:a.fleck??0},uGhost:{value:a.ghost??.15},uTiMax:{value:a.tiMax??.74},uBodyGain:{value:a.bodyGain??1},uThinTeal:{value:a.thinTeal??0},uSpec:{value:a.spec??1},uFres:{value:a.fres??1},uHeart:{value:new e.Vector4(a.heartR||100,0,0,a.heart||0)},uStand:{value:a.stand??0},uFlip:{value:a.flip??.85},uNear:{value:new e.Vector4(a.nearA??40,a.nearB??240,a.near??0,a.nearTi??.5)},uWin:{value:a.win||new e.Vector4(0,0,1,.9)},uGC:{value:a.gc||new e.Matrix3},uBoatPh:{value:a.boatPh||new Array(12).fill(0)},uBoatW:{value:a.boatW||0},uBoatN:{value:a.boatN||0}},vertexShader:a.vertexShader||xo,fragmentShader:So.replace("FOGCODE",_e(c)),side:t==="back"?e.BackSide:e.FrontSide,transparent:c||!!a.transparent,depthWrite:!c,premultipliedAlpha:c})}const ue=new e.Vector3,Ke=new e.Vector3,qe=new e.Vector3,K=new e.Vector3;class st{constructor(){this.p=[],this.c=[],this.s=[],this.i=[],this.n=0}v(t,a,o,c,r=0,p=1){return this.p.push(t,a,o),this.c.push(c.r,c.g,c.b),this.s.push(r,p),this.n++}tri(t,a,o){this.i.push(t,a,o)}quad(t,a,o,c){this.i.push(t,a,o,t,o,c)}tube(t,a,o,c,r,p=1,s=1){const i=t.length,u=this.n;for(let f=0;f<i;f++){qe.copy(t[Math.min(f+1,i-1)]).sub(t[Math.max(f-1,0)]).normalize(),ue.set(0,0,1),Math.abs(qe.z)>.9&&ue.set(1,0,0),ue.cross(qe).normalize(),Ke.crossVectors(qe,ue);const d=f/(i-1),w=c(d),v=r?r(d):0,g=a[f];for(let y=0;y<o;y++){const b=y/o*Math.PI*2,C=Math.cos(b)*g,S=Math.sin(b)*g*p;this.v(t[f].x+ue.x*C+Ke.x*S,t[f].y+ue.y*C+Ke.y*S,t[f].z+ue.z*C+Ke.z*S,w,v,s)}}for(let f=0;f<i-1;f++)for(let d=0;d<o;d++){const w=u+f*o+d,v=u+f*o+(d+1)%o;this.quad(w,v,v+o,w+o)}const h=this.v(t[i-1].x,t[i-1].y,t[i-1].z,c(1),r?r(1):0,s);for(let f=0;f<o;f++)this.tri(u+(i-1)*o+f,u+(i-1)*o+(f+1)%o,h)}lathe(t,a,o,c,r,p,s=1){const i=this.n,u=t.length;for(let h=0;h<u;h++){const f=h/(u-1),d=r?r(f):0;for(let w=0;w<a;w++){const v=w/a*Math.PI*2,g=t[h][0]*(p?p(v,f):1),y=c(f,v,w);K.set(Math.cos(v)*g,t[h][1],Math.sin(v)*g).applyMatrix4(o),this.v(K.x,K.y,K.z,y,d,s)}}for(let h=0;h<u-1;h++)for(let f=0;f<a;f++){const d=i+h*a+f,w=i+h*a+(f+1)%a;this.quad(d,d+a,w+a,w)}}geo(){const t=new e.BufferGeometry;return t.setAttribute("position",new e.Float32BufferAttribute(this.p,3)),t.setAttribute("color",new e.Float32BufferAttribute(this.c,3)),t.setAttribute("aSway",new e.Float32BufferAttribute(this.s,2)),t.setIndex(this.i),t.computeVertexNormals(),t}async geoA(t){const a=new e.BufferGeometry,o=new Float32Array(this.p);await t();const c=new Float32Array(this.c),r=new Float32Array(this.s);await t();const p=this.n>65535?new Uint32Array(this.i):new Uint16Array(this.i),s=new Float32Array(o.length);await t();for(let i=0;i<p.length;i+=3){const u=p[i]*3,h=p[i+1]*3,f=p[i+2]*3,d=o[f]-o[h],w=o[f+1]-o[h+1],v=o[f+2]-o[h+2],g=o[u]-o[h],y=o[u+1]-o[h+1],b=o[u+2]-o[h+2],C=w*b-v*y,S=v*g-d*b,B=d*y-w*g;s[u]+=C,s[u+1]+=S,s[u+2]+=B,s[h]+=C,s[h+1]+=S,s[h+2]+=B,s[f]+=C,s[f+1]+=S,s[f+2]+=B,i%24e3===23997&&await t()}await t();for(let i=0;i<s.length;i+=3){const u=Math.hypot(s[i],s[i+1],s[i+2])||1;s[i]/=u,s[i+1]/=u,s[i+2]/=u}return a.setAttribute("position",new e.BufferAttribute(o,3)),a.setAttribute("color",new e.BufferAttribute(c,3)),a.setAttribute("aSway",new e.BufferAttribute(r,2)),a.setAttribute("normal",new e.BufferAttribute(s,3)),a.setIndex(new e.BufferAttribute(p,1)),a}}function Lt(n,t,a,o,c,r){const p=new e.Color,s=(i,u,h,f,d,w)=>{const v=new e.Vector3(t.range(-1,1),t.range(0,.6),t.range(-1,1)).multiplyScalar(h*.16),g=i.clone().addScaledVector(u,h*.5).add(v),y=i.clone().addScaledVector(u,h).add(v.multiplyScalar(.4)),b=w+(1-w)*(d===0?1:.55),C=(d===0?[i,y]:[i,g,y]).map(A=>A.clone().applyMatrix4(a));if(n.tube(C,d===0?[f,f*.3]:[f,f*.8,f*.62],d===0?3:4,A=>p.copy(c).lerp(r,Math.pow(de(w,b,A),1.6)),A=>de(w,b,A)*de(w,b,A)),d===0)return;const S=d>1?3:2+(t()<.4?1:0),B=t.range(0,6.28);for(let A=0;A<S;A++){const P=B+A/S*6.28+t.range(-.4,.4),m=t.range(.45,.8),x=new e.Vector3(Math.cos(P)*m,1,Math.sin(P)*m).applyQuaternion(new e.Quaternion().setFromUnitVectors(new e.Vector3(0,1,0),u)).normalize();x.y+=.25,x.normalize(),s(A===0?y:g.clone().lerp(y,t.range(.2,1)),x,h*t.range(.6,.8),f*.6,d-1,b)}};s(new e.Vector3(0,-o*.05,0),new e.Vector3(t.range(-.2,.2),1,t.range(-.2,.2)).normalize(),o*.42,o*.075,2,0)}function ko(n,t,a,o,c,r){const p=new e.Color,s=o*.5,i=o*t.range(.28,.45),u=t.int(5,9),h=t.range(0,6.28),f=t.range(.03,.12),d=.8+(u-5)*.06,w=[[s*.16,-i*.1],[s*.09,i*.5],[s*.62,i*.82],[s,i*.96],[s*.97,i*1.08],[s*.4,i*1.1],[s*.2,i*(1.1+.3*d)],[s*.58,i*(1.1+.52*d)],[s*.56,i*(1.1+.62*d)],[.01,i*(1.1+.6*d)]],v=[.5,.42,.4,.62,1.3,.92,.4,.55,1.25,.95],g=[0,.1,.25,.6,1,.8,.3,.5,1,.85];n.lathe(w,12,a,(y,b,C)=>{const S=Math.round(y*9);return p.copy(c).lerp(r,g[S]).multiplyScalar(v[S]*(C%2?1:.9))},y=>y*.25,(y,b)=>1+(b>.15?Math.sin(y*2+h)*.1+Math.sin(y*3+h*2)*.07+f:0))}function Ot(n,t,a,o,c,r){const p=new e.Color,s=t.int(7,10),i=t.range(.9,1.25);for(let u=0;u<s;u++){const h=(u/(s-1)-.5)*2*i,f=o*(1-.25*Math.abs(h/i)**2)*t.range(.85,1),d=[];for(let v=0;v<=3;v++){const g=v/3,y=h*(.35+.65*g);d.push(new e.Vector3(Math.sin(y)*f*g,Math.cos(y)*f*g,Math.sin(g*2.5+u)*o*.03).applyMatrix4(a))}const w=o*.03;if(n.tube(d,[w*1.5,w*1.15,w*.8,w*.3],3,v=>p.copy(c).lerp(r,v*v),v=>v*v,.35),u<s-1){const v=((u+1)/(s-1)-.5)*2*i;for(let g=1;g<=2;g++){const y=g/2.6+.12,b=h*(.35+.65*y),C=v*(.35+.65*y),S=f*y,B=new e.Vector3(Math.sin(b)*S,Math.cos(b)*S,0).applyMatrix4(a),A=new e.Vector3(Math.sin(C)*S,Math.cos(C)*S*1.04,0).applyMatrix4(a);n.tube([B,A],[w*.8,w*.8],2,()=>p.copy(c).lerp(r,y*.7),()=>y*y,.4)}}}}function It(n,t,a,o,c,r,p){const s=new e.Color,i=lt,u=i.attributes.position,h=n.n,f=t.range(0,50);for(let w=0;w<u.count;w++){K.fromBufferAttribute(u,w);const v=p.n3(K.x*2.3+f,K.y*2.3,K.z*2.3),g=K.y,y=o*.5*(1+v*.22)*(g<-.2?.8:1);s.copy(c).lerp(r,oe(.5+v*1.4+g*.3,0,1)),K.set(K.x*y,Math.max(K.y,-.35)*y*.72,K.z*y).applyMatrix4(a),n.v(K.x,K.y,K.z,s,0,.8)}const d=i.index.array;for(let w=0;w<d.length;w+=3)n.tri(h+d[w],h+d[w+1],h+d[w+2])}let lt=null;const Mo=`
attribute vec2 aSway;
uniform float uTime, uSwayAmp, uSwayK;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying float vGlow; varying vec3 vP;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  float ph = uTime * 0.8 + dot(p, vec3(0.9, 0.7, 1.1)) * uSwayK;
  p += vec3(sin(ph), cos(ph * 0.83 + 1.3), sin(ph * 1.21 + 2.1)) * aSway.x * uSwayAmp;
  vP = position;
  vec4 w = modelMatrix * vec4(p, 1.);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.)); vCol = color; vGlow = aSway.y;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Co=`
uniform vec4 uGlobe; uniform vec3 uWater; uniform float uGlowI, uFogK, uGrain;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying float vGlow; varying vec3 vP;
#include <fog_pars_fragment>
${re}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 out3 = vP / max(length(vP), 1e-3);
  float lit = 0.5 + 0.5 * dot(N, out3);
  float sun = max(dot(N, uSun), 0.);
  float g1 = vn(vP.xz * uGrain + vP.y * uGrain * 0.7), g2 = vn(vP.yx * uGrain * 2.3 + vP.z * uGrain * 1.9 + 5.);
  float spots = smoothstep(0.5, 0.8, vn(vP.xy * uGrain * 5. + vP.z * uGrain * 4.) * 0.6 + g2 * 0.5);
  float grain = 0.62 + 0.55 * g1 + 0.25 * g2;
  float key = 0.5 + 0.5 * dot(N, uSun);
  vec3 alb = vCol + vec3(0.3, 0.16, 0.05) * spots * (0.4 + g1);
  vec3 col = alb * (uGlowI * (0.25 + 0.75 * vGlow) * (0.3 + 0.7 * lit) * (0.45 + 0.55 * key * key) * grain) + vCol * sun * 0.5 + vCol * uSkyMid * 0.2;
  float d = waterPath(cameraPosition, vW, uGlobe.xyz, uGlobe.w);
  float f = exp(-d * uFogK);
  col = mix(uWater + vCol * 0.10, col, f);
  gl_FragColor = vec4(col, 1.);
  ${_e(!1)}
}`;async function Ee(n,t,a,o,c,r=async()=>{}){const p=new st,s=c.rock,i=c.scale;lt||(lt=new e.SphereGeometry(1,10,7));const u=new e.Color(o[4]).offsetHSL(c.hue,0,0),h=new e.Color(o[5]),f=u.clone().offsetHSL(-.012,0,-.22),d=u.clone().offsetHSL(-.02,-.05,-.4),w=n.range(0,100),v=T=>s*(1+.2*t.fbm3(T.x*1.5+w,T.y*1.5,T.z*1.5,3)+.07*t.n3(T.x*5+w,T.y*5,T.z*5));{const T=new e.SphereGeometry(1,c.rockSeg||40,Math.round((c.rockSeg||40)*.6)),Q=T.attributes.position,O=p.n,N=new e.Color,I=new e.Vector3;for(let D=0;D<Q.count;D++){I.fromBufferAttribute(Q,D).normalize();const Z=v(I),X=(Z/s-.8)/.4;N.copy(d).lerp(f,oe(X,0,1)),p.v(I.x*Z,I.y*Z,I.z*Z,N,0,.35+.4*oe(X,0,1)),D%160===159&&await r()}await r();const U=T.index.array;for(let D=0;D<U.length;D+=3)p.tri(O+U[D],O+U[D+1],O+U[D+2]);T.dispose()}await r();const g=new e.Matrix4,y=new e.Quaternion,b=new e.Quaternion,C=new e.Vector3,S=new e.Vector3,B=new e.Vector3(1,1,1),A=new e.Vector3(0,1,0),P=new e.Color,m=new e.Color,x=c.count;for(let T=0;T<x;T++){const Q=1-2*(T+.5)/x,O=Math.sqrt(1-Q*Q),N=T*2.39996+n.range(-.25,.25);S.set(Math.cos(N)*O,Q+n.range(-.05,.05),Math.sin(N)*O).normalize();const I=v(S);C.copy(S).multiplyScalar(I*.96),y.setFromUnitVectors(A,S),b.setFromAxisAngle(A,n.range(0,6.28)),y.multiply(b),g.compose(C,y,B);const U=t.n3(S.x*2.1+40+w,S.y*2.1,S.z*2.1),D=n(),Z=I/s,X=n.range(-.035,.03),fe=n.range(-.05,.06);P.copy(f).offsetHSL(X,0,fe*.5),m.copy(u).lerp(h,n.range(.05,.4)).offsetHSL(X,0,fe),U>.18?Lt(p,n,g,i*n.range(26,40)*(.8+.4*Z),P,m):U<-.28?D<.75?Ot(p,n,g,i*n.range(18,30),P,m.lerp(new e.Color(o[2]),.15)):It(p,n,g,i*n.range(9,16),P,m,t):D<.5?ko(p,n,g,i*n.range(15,26),P,m):D<.72?It(p,n,g,i*n.range(8,17),P,m,t):D<.88?Lt(p,n,g,i*n.range(18,28),P,m):Ot(p,n,g,i*n.range(16,24),P,m),T%6===5&&await r()}await r();const M=(T={})=>new e.ShaderMaterial({fog:!0,vertexColors:!0,uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:a.uTime,uSun:a.uSun,uSunCol:a.uSunCol,uSkyZen:a.uSkyZen,uSkyMid:a.uSkyMid,uSkyHaze:a.uSkyHaze,uGroundSun:a.uGroundSun,uGroundShade:a.uGroundShade,uGlobe:{value:new e.Vector4(0,0,0,1)},uWater:{value:new e.Color(o[1]).multiplyScalar(T.waterGain??c.waterGain??.5).lerp(new e.Color(o[4]).multiplyScalar(.5),T.warm??c.warm??.3)},uGlowI:{value:T.glow??c.glow??2.5},uFogK:{value:T.fogK??c.fogK},uSwayAmp:{value:1.3*i},uSwayK:{value:.06/i},uGrain:{value:.9/i}},vertexShader:Mo,fragmentShader:Co}),F=M();await r();const E=await p.geoA(r);return await r(),{mesh:new e.Mesh(E,F),mat:F,geo:E,mkMat:M,tris:p.i.length/3}}function zo(n,t,a,o){const c=n.n,r=t[0].length;t.forEach((p,s)=>p.forEach((i,u)=>n.v(i.x,i.y,i.z,a(s/(t.length-1),u/r),0,o)));for(let p=0;p<t.length-1;p++)for(let s=0;s<r;s++){const i=c+p*r+s,u=c+p*r+(s+1)%r;n.quad(i,u,u+r,i+r)}}function Bo(n,t,a){const o=new st,c=(m,x,M)=>new e.Vector3(m,x,M),r=new e.Color,p=new e.Color("#7A5236"),s=new e.Color("#3E2C2A"),i=new e.Color(t[4]).multiplyScalar(.85),u=new e.Color(a||t[3]).multiplyScalar(.8),h=new e.Color("#CDBE9A"),f=new e.Color(t[6]),d=[],w=11;for(let m=0;m<w;m++){const x=m/(w-1)*2-1,M=x*7,F=Math.abs(x),E=.95*Math.pow(Math.max(1-Math.pow(F,2.4),0),.7)+.02,L=.75+1.5*Math.pow(F,3.2),T=-.75+1.2*Math.pow(F,3.5),Q=Math.min(L-.28,L-.28*E),O=Math.max(E-.14,.005);d.push([c(-E,L,M),c(-E*.86,(L+T)*.4,M),c(0,T,M),c(E*.86,(L+T)*.4,M),c(E,L,M),c(O,L,M),c(O*.9,Q,M),c(-O*.9,Q,M),c(-O,L,M)])}zo(o,d,(m,x)=>x>.5?r.copy(p).lerp(h,.35):x<.05||x>.4&&x<.5?r.copy(i):r.copy(p).lerp(s,.55+.3*Math.abs(x-.22)*3),0);const v=-4.8,g=[];for(let m=0;m<=6;m++){const x=m/6*2-1;g.push(c(v,.05+.75*Math.pow(Math.abs(x),3),x*4.6))}o.tube(g,[.06,.27,.36,.38,.36,.27,.06],6,m=>r.copy(p).lerp(i,Math.abs(m-.5)>.38?.9:.1),null,1,0);for(const m of[2.3,-2.3]){const x=[];for(let M=0;M<=5;M++){const F=M/5;x.push(c(.6+(v-.6)*F,.95+.85*Math.sin(F*Math.PI*.85)-.55*F*F,m*(1-.12*F)))}o.tube(x,[.13,.12,.11,.1,.1,.11],4,()=>r.copy(p).lerp(s,.25),null,1,0)}for(let m=0;m<3;m++){const x=-.9-m*.62;o.tube([c(x,1.42-m*.03,2.2),c(x,1.42-m*.03,-2.2)],[.26,.26],4,()=>r.copy(p).lerp(h,.2+.2*m),null,.2,0)}const y=new e.Matrix4;for(const[m,x,M]of[[-1.5,-.9,1],[-1.2,1.1,.7],[0,-3.2,.62]])y.makeTranslation(m,x<-3?.62:1.45,x),o.lathe([[.9*M,0],[.84*M,.22*M],[.5*M,.5*M],[.02,.58*M]],7,y,F=>r.copy(f).lerp(h,.15+.3*F),null,F=>1+.18*Math.sin(F*3+m*5),3);o.tube([c(0,.5,1.6),c(.03,6,1.5),c(0,11.6,1.35)],[.17,.13,.07],5,m=>r.copy(p).lerp(h,.25+.3*m),null,1,0),o.tube([c(.75,1.6,-4.6),c(.95,.6,-6.2),c(1.1,-.9,-7.6)],[.06,.07,.3],4,()=>r.copy(p).lerp(s,.3),null,.3,0);const b=m=>c(.25,1.3+11.2*Math.pow(m,.85),6.2-8.2*m-1.6*Math.sin(m*Math.PI)*.5),C=m=>c(.25,1.3+2.4*m+1.6*m*m,6.2-13.6*m);for(const m of[b,C]){const x=[];for(let M=0;M<=5;M++)x.push(m(M/5));o.tube(x,[.12,.11,.1,.09,.07,.04],4,()=>r.copy(p).lerp(h,.4),null,1,0)}const S=9,B=7,A=o.n;for(let m=0;m<=S;m++)for(let x=0;x<=B;x++){const M=x/B,F=m/S*(1-.3*Math.sin(Math.PI*M)),E=b(F),L=C(F),T=E.lerp(L,M);o.v(T.x,T.y,T.z,u,Math.sin(Math.PI*M)*Math.sqrt(F),1+M)}for(let m=0;m<S;m++)for(let x=0;x<B;x++){const M=A+m*(B+1)+x;o.quad(M,M+1,M+B+2,M+B+1)}for(const m of[c(0,2.2,6.9),c(0,2.2,-6.9),c(v,.5,0)])o.tube([c(0,11.4,1.35),m],[.045,.045],3,()=>h,null,1,4);const P=o.n;for(let m=0;m<=5;m++){const x=m/5;o.v(0,11.7+.28*(1-x),1.3-x*2.6,i,x,4.5),o.v(0,11.7-.28*(1-x),1.3-x*2.6,i,x,4.5)}for(let m=0;m<5;m++)o.quad(P+m*2,P+m*2+1,P+m*2+3,P+m*2+2);return o.geo()}const Ao=`
attribute vec2 aSway; attribute float aPh;
uniform mat3 uGC; uniform float uBoatW, uR, uScale; uniform vec4 uWob;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying float vPart; varying vec3 vP;
#include <fog_pars_vertex>
${re}
void main(){
  float lon = aPh + uBoatW * uTime;
  vec3 n = uGC * vec3(cos(lon), sin(lon), 0.), f = uGC * vec3(-sin(lon), cos(lon), 0.), r = cross(n, f);
  vec3 p = position; vec3 nr = normal;
  float sail = step(0.5, aSway.y) * step(aSway.y, 2.5), flag = step(4.25, aSway.y);
  float bil = aSway.x * (1.25 + 0.16 * sin(uTime * 2.3 + p.y * 0.9 + aPh * 7.) * aSway.x);
  p.x -= bil * sail; nr = normalize(nr + vec3(0., 0.25, -0.2) * bil * sail + vec3(1e-5, 0., 0.));
  p.x += flag * aSway.x * 0.5 * sin(uTime * 6. - p.z * 2.4 + aPh * 3.);
  float roll = 0.07 * sin(uTime * 0.9 + aPh * 5.), pit = 0.045 * sin(uTime * 0.7 + aPh * 9.);
  p.xy = mat2(cos(roll), sin(roll), -sin(roll), cos(roll)) * p.xy; nr.xy = mat2(cos(roll), sin(roll), -sin(roll), cos(roll)) * nr.xy;
  p.yz = mat2(cos(pit), sin(pit), -sin(pit), cos(pit)) * p.yz; nr.yz = mat2(cos(pit), sin(pit), -sin(pit), cos(pit)) * nr.yz;
  float h = uR * (1. + wobf(n, uWob, uTime));
  p *= uScale;
  vec3 lp = n * (h + p.y) + r * p.x + f * p.z;
  vec4 w = modelMatrix * vec4(lp, 1.);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * (n * nr.y + r * nr.x + f * nr.z) + vec3(0., 1e-5, 0.)); vCol = color; vPart = aSway.y; vP = position;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,To=`
uniform vec3 uStripe;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying float vPart; varying vec3 vP;
#include <fog_pars_fragment>
${re}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  vec3 alb = vCol; float nl = dot(N, uSun);
  float isSail = step(0.5, vPart) * step(vPart, 2.5);
  float b = vPart - 1.;
  float stripe = smoothstep(0.30, 0.325, b) * (1. - smoothstep(0.475, 0.50, b));
  float seam = (1. - smoothstep(0.0, 0.035, abs(fract(b * 7.) - 0.5) - 0.44)) * 0.12;
  alb = mix(alb, mix(alb, uStripe, stripe) * (1. - seam), isSail);
  float plank = (1. - smoothstep(0.0, 0.06, abs(fract(vP.y * 3.1) - 0.5) - 0.4)) * 0.22 + (vn(vP.zy * vec2(1.3, 9.)) - 0.5) * 0.25;
  alb *= 1. - plank * step(vPart, 0.5);
  float net = (1. - smoothstep(0.0, 0.1, abs(fract((vP.x + vP.z) * 5.) - 0.5) - 0.3)) + (1. - smoothstep(0.0, 0.1, abs(fract((vP.x - vP.z) * 5. + vP.y * 3.) - 0.5) - 0.3));
  alb *= 1. + (net * 0.45 - 0.3) * step(2.5, vPart) * step(vPart, 3.5);
  float dif = mix(max(nl, 0.), abs(nl) * 0.75 + 0.25, isSail);     // sails glow when backlit
  vec3 amb = mix(uGroundSun * 0.35 + uSkyMid * 0.25, uSkyZen * 0.55 + uSkyMid * 0.3, N.y * 0.5 + 0.5);
  vec3 col = alb * (vec3(1.0, 0.95, 0.85) * 1.5 * dif + amb);
  gl_FragColor = vec4(col, 1.);
  ${_e(!1)}
}`,ce=84,ut=82,ye=.07,Ut=(n,t)=>oe(n*(1+10*ye)-t*ye,0,1),Po=`
uniform vec3 uA, uB; uniform float uBeadR[11]; uniform float uThin, uBead, uRecoil, uRecA; uniform vec4 uWob;
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying float vR; varying vec3 vCen;
#include <fog_pars_vertex>
${re}
float smax(float a, float b, float k){ return 0.5 * (a + b + sqrt((a - b) * (a - b) + k * k + 1e-8)); }
// the free end of a stub: a retracting thread gathers into a round bulb. d = metres in from the tip, rt = thread radius
float stubEnd(float d, float rt){
  d = max(d - 1., 0.);                                  // (the last ring before the tip always closes it)
  float Rt = rt * 1.7, c = 1. - min(d / Rt, 1.);
  float q = (d - Rt) / (1.3 * Rt);
  return (1. + 0.7 * exp(-q * q)) * sqrt(max(1. - c * c, 1e-6));
}
void shape(float x, float L, out float ax, out float rad, out float cx){
  float xa = max(x, 0.), xb = max(L - x, 0.);
  float base = 9. + 11. * exp(-xa / 26.) + 2. * exp(-xb / 8.) + 16. * exp(-xa / 6.);
  float bellS = smoothstep(0., 60., x) * smoothstep(0., 24., L - x);
  float rt = base * (1. - uThin * 0.6 * bellS) * (1. + 0.035 * sin(x * 0.21 - uTime * 1.1) * bellS);
  float lam = (L - ${ce}. - ${ut}.) / 11.;
  float xi = (x - ${ce}.) / lam;
  float pp = uBead * ${(1+10*ye).toFixed(2)};
  if (xi < 0.) {
    float m0 = smoothstep(0.1, 0.3, pp);                // the Mother's end parts from the string first
    rad = rt * mix(1., stubEnd(-xi * lam, rt), m0) * (1. + 0.5 * uRecA) * (1. - smoothstep(0.72, 1., uRecA)); ax = x * (1. - uRecA); cx = 0.;
  } else if (xi >= 11.) {
    float m1 = smoothstep(0.1, 0.3, pp - 10. * ${ye});
    rad = rt * mix(1., stubEnd((xi - 11.) * lam, rt), m1) * (1. + 0.35 * uRecoil) * (1. - smoothstep(0.72, 1., uRecoil)); ax = L - (L - x) * (1. - uRecoil); cx = L;
  } else {
    float fi = min(floor(xi), 10.); int i = int(fi);
    float fr = xi - fi - 0.5, s = fr * lam;
    float a = clamp(pp - fi * ${ye}, 0., 1.);
    float k = smoothstep(0.5, 1., a);
    float Rb = uBeadR[i]; cx = ${ce}. + (fi + 0.5) * lam;
    float wob = k * 0.11 * sin(uTime * 2.4 + fi * 1.7) * (0.4 + 0.6 * (1. - smoothstep(0.9, 1., uBead)));
    // beads on a string: in each cell a ball swells (radius Rs) while the thread either side of it thins to nothing;
    // then the cell's rings slide along the axis onto the ball (sp), every ring staying on the one true profile, so
    // nothing is ever pointed and the strip spanning the gap to the next bead is a line of no width
    float Rs = mix(rt, Rb, smoothstep(0., 0.6, a));
    // the string's two free ends: the half cell next to each stub lets go early, and its ball is the round end of the string
    float freeEnd = 1. - max((1. - step(0.5, fi)) * (1. - step(0., fr)) * smoothstep(0.1, 0.3, pp), step(9.5, fi) * step(0., fr) * smoothstep(0.1, 0.3, pp - 10. * ${ye}));
    float thr = rt * (1. - smoothstep(0.05, 0.75, a)) * freeEnd;
    float kk = 0.3 * rt * smoothstep(0., 0.2, a) * (1. - smoothstep(0.55, 0.8, a)) * freeEnd;
    float phS = clamp(fr * 1.3, -0.5, 0.5) * 3.14159265;
    float sp = mix(s, Rb * sin(phS), k);
    ax = cx + sp * (1. - 1.6 * wob);
    rad = smax(sqrt(max(Rs * Rs - sp * sp, 1e-6)), thr, kk) * (1. + wob);
  }
}
void main(){
  vec3 axd = uB - uA; float L = length(axd); axd /= L;
  vec3 U = normalize(cross(axd, vec3(0., 1., 0.))), Wv = cross(U, axd);
  float x = position.z * (L + 16.) - 8.;
  float ax, rad, cx, ax2, rad2, cx2;
  shape(x, L, ax, rad, cx); shape(x + 0.35, L, ax2, rad2, cx2);
  vec3 rd = U * position.x + Wv * position.y;
  vec3 lp = uA + axd * ax + rd * rad;
  vec3 nl = normalize(rd * (abs(ax2 - ax) + 1e-3) - axd * (rad2 - rad));
  vec4 w = modelMatrix * vec4(lp, 1.);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * nl);
  vR = max(rad * 1.6, 2.5); vL = lp / vR; vCen = (modelMatrix * vec4(uA + axd * cx, 1.)).xyz;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;function Go(n,t,a=.14,o=.86){const c=new Float32Array((n+1)*t*3),r=[],p=i=>i<.14?i/.14*a:i<.86?a+(i-.14)/.72*(o-a):o+(i-.86)/.14*(1-o);for(let i=0;i<=n;i++)for(let u=0;u<t;u++){const h=u/t*Math.PI*2,f=(i*t+u)*3;c[f]=Math.cos(h),c[f+1]=Math.sin(h),c[f+2]=p(i/n)}for(let i=0;i<n;i++)for(let u=0;u<t;u++){const h=i*t+u,f=i*t+(u+1)%t;r.push(h,f+t,f,h,h+t,f+t)}const s=new e.BufferGeometry;return s.setAttribute("position",new e.BufferAttribute(c,3)),s.setIndex(r),s}function Fo(n){const t=new st,a=new e.Color(1,1,1),o=new e.Color(.45,.4,.45),c=new e.Color(1.5,1.5,1.4),r=new e.Color(1.15,1.1,1);if(n){const v=t.v(0,0,.5,a),g=t.v(0,.17,.1,a),y=t.v(0,-.15,.1,r),b=t.v(0,0,-.32,a),C=t.v(0,.16,-.52,o),S=t.v(0,-.16,-.52,o),B=t.v(.07,0,.1,a),A=t.v(-.07,0,.1,a);return t.tri(v,g,B),t.tri(v,B,y),t.tri(v,A,g),t.tri(v,y,A),t.tri(g,b,B),t.tri(b,C,S),t.geo()}const p=t.v(0,.01,.5,a),s=t.v(0,0,-.32,a),i=[[0,.17],[.085,0],[0,-.15],[-.085,0]].map(([v,g],y)=>t.v(v,g,.2,y===2?r:a)),u=[[0,.15],[.062,0],[0,-.12],[-.062,0]].map(([v,g],y)=>t.v(v,g,-.09,y===2?r:a));for(let v=0;v<4;v++){const g=(v+1)%4;t.tri(p,i[g],i[v]),t.quad(i[v],i[g],u[g],u[v]),t.tri(u[v],u[g],s)}const h=t.v(0,0,-.3,a),f=t.v(0,.25,-.57,o),d=t.v(0,0,-.43,o),w=t.v(0,-.25,-.57,o);t.tri(h,f,d),t.tri(h,d,w),t.tri(t.v(0,.16,.18,a),t.v(0,.14,-.1,a),t.v(0,.34,-.14,o)),t.tri(t.v(0,-.13,.1,r),t.v(0,-.28,-.08,o),t.v(0,-.11,-.1,r));for(const v of[1,-1])t.tri(t.v(.08*v,-.02,.2,a),t.v(.22*v,-.11,0,o),t.v(.075*v,-.07,.07,a));return t.geo()}const No=`
attribute vec4 aOrb; attribute vec4 aCtr; attribute vec3 aMisc;
uniform float uCtrW, uAvoid; uniform vec3 uTintA, uTintB;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vP;
#include <fog_pars_vertex>
${re}
vec3 rotO(vec3 p, float tilt, float node){
  p.xy = mat2(cos(tilt), sin(tilt), -sin(tilt), cos(tilt)) * p.xy;
  p.xz = mat2(cos(node), sin(node), -sin(node), cos(node)) * p.xz;
  return p;
}
void main(){
  float th = aOrb.w + aMisc.x * uTime, tc = aCtr.w + uCtrW * uTime;
  vec3 c = rotO(vec3(cos(th), 0., sin(th)), aOrb.y, aOrb.z) * aOrb.x + rotO(vec3(cos(tc), 0., sin(tc)), aCtr.y, aCtr.z) * aCtr.x;
  float sg = aMisc.x < 0. ? -1. : 1.;
  vec3 f = rotO(vec3(-sin(th), 0., cos(th)), aOrb.y, aOrb.z) * sg, up = rotO(vec3(0., 1., 0.), aOrb.y, aOrb.z), rt = cross(up, f);
  vec3 p = position; float tail = (0.5 - p.z);
  p.x += sin(uTime * 9. + aOrb.w * 31. - p.z * 5.) * 0.10 * tail * tail;
  vec4 wc = modelMatrix * vec4(c, 1.);
  vec3 dc = wc.xyz - cameraPosition; float d = length(dc);
  vec3 push = dc / max(d, 1e-3) * max(0., uAvoid - d) * 0.85;
  vec3 lp = c + (rt * p.x + up * p.y + f * p.z) * aMisc.y;
  vec4 w = modelMatrix * vec4(lp, 1.); w.xyz += push;
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * (rt * normal.x + up * normal.y + f * normal.z) + vec3(0., 1e-5, 0.));
  vCol = color * mix(uTintA, uTintB, aMisc.z); vP = position;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ro=`
uniform vec4 uGlobe; uniform vec3 uWater; uniform float uFogK, uSelf, uPaint;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vP;
#include <fog_pars_fragment>
${re}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  float dif = 0.5 + 0.5 * dot(N, uSun);
  vec3 alb = vCol;
  float band = max((1. - smoothstep(0.025, 0.045, abs(vP.z - 0.19))), (1. - smoothstep(0.018, 0.035, abs(vP.z + 0.12))));
  float edge = max((1. - smoothstep(0.05, 0.075, abs(vP.z - 0.19))), (1. - smoothstep(0.04, 0.06, abs(vP.z + 0.12)))) - band;
  float eye = (1. - smoothstep(0.024, 0.034, length(vec2(vP.z - 0.37, vP.y - 0.035))));
  alb = mix(alb, vec3(0.85, 0.86, 0.8), band * uPaint); alb *= 1. - (edge * 0.6 + eye * 0.92) * uPaint;
  alb *= 1. + (1. - smoothstep(-0.14, 0.02, vP.y)) * 0.3 - smoothstep(0.1, 0.2, vP.y) * 0.25;
  vec3 col = alb * (dif * dif * 1.25 + 0.3 + uSelf);
  float d = waterPath(cameraPosition, vW, uGlobe.xyz, uGlobe.w);
  col = mix(uWater, col, exp(-d * uFogK));
  gl_FragColor = vec4(col, 1.);
  ${_e(!1)}
}`;function be(n,t,a,o){const c=Fo(o.simple),r=o.groups.reduce((d,w)=>d+w.n,0),p=new Float32Array(r*4),s=new Float32Array(r*4),i=new Float32Array(r*3);let u=0;for(const d of o.groups){const w=n.sign();for(let v=0;v<d.n;v++,u++){const g=d.school?Math.pow(n(),.6)*d.school:n.range(0,6.28),y=n.range(d.rMin,d.rMax);p.set([y,d.tilt+n.gauss()*d.tiltSpread,d.node+n.gauss()*d.tiltSpread,d.phase+g+n.gauss()*.02],u*4),s.set(d.ctr,u*4);const b=n.range(d.speed[0],d.speed[1]);i.set([w*b/Math.max(y,1),n.range(d.size[0],d.size[1]),n()],u*3)}}const h=new e.ShaderMaterial({fog:!0,vertexColors:!0,side:e.DoubleSide,uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:t.uTime,uSun:t.uSun,uSunCol:t.uSunCol,uSkyZen:t.uSkyZen,uSkyMid:t.uSkyMid,uSkyHaze:t.uSkyHaze,uGroundSun:t.uGroundSun,uGroundShade:t.uGroundShade,uGlobe:{value:new e.Vector4(0,0,0,1)},uWater:{value:o.water},uFogK:{value:o.fogK},uSelf:{value:o.self||0},uPaint:{value:o.simple?0:1},uCtrW:{value:o.ctrW||0},uAvoid:{value:o.avoid||0},uTintA:{value:o.tintA},uTintB:{value:o.tintB}},vertexShader:No,fragmentShader:Ro}),f=new e.InstancedMesh(c,h,r);return c.setAttribute("aOrb",new e.InstancedBufferAttribute(p,4)),c.setAttribute("aCtr",new e.InstancedBufferAttribute(s,4)),c.setAttribute("aMisc",new e.InstancedBufferAttribute(i,3)),{mesh:f,mat:h}}function Vo(n,t,a,o){const c=[],r=[],p=[],s=[],i=[];let u=0;const h=(g,y,b,C,S)=>{for(const[B,A]of[[0,-1],[1,-1],[1,1],[0,1]])c.push(g.x,g.y,g.z),p.push(y.x,y.y,y.z),r.push(B,A,C,S),s.push(b);i.push(u,u+1,u+2,u,u+2,u+3),u+=4},f=new e.Vector3,d=new e.Vector3;for(let g=0;g<14;g++)f.copy(o).add(new e.Vector3(n.range(-.75,.75),n.range(-.3,.3),n.range(-.75,.75))).normalize().multiplyScalar(Y*.97),d.copy(f).addScaledVector(o,-n.range(34,52)),h(f,d,0,n.range(1.2,3.6),n.range(0,6.28));for(let g=0;g<200;g++){const y=Math.sqrt(n())*23,b=n.range(0,6.28);f.set(Math.cos(b)*y,Math.sqrt(Y*Y-y*y)*.92,Math.sin(b)*y),h(f,f,1,n.range(.05,.2),n.range(0,6.28))}const w=new e.BufferGeometry;w.setAttribute("position",new e.Float32BufferAttribute(c,3)),w.setAttribute("aEnd",new e.Float32BufferAttribute(p,3)),w.setAttribute("aQ",new e.Float32BufferAttribute(r,4)),w.setAttribute("aKind",new e.Float32BufferAttribute(s,1)),w.setIndex(i);const v=new e.ShaderMaterial({fog:!1,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,uniforms:{uTime:t.uTime,uFade:{value:0},uShaft:{value:new e.Color(a[5]).lerp(new e.Color(a[0]),.45)},uBub:{value:new e.Color(a[2])}},vertexShader:`
attribute vec3 aEnd; attribute vec4 aQ; attribute float aKind;
uniform float uTime; varying vec4 vQ; varying float vKind;
void main(){
  vQ = aQ; vKind = aKind; vec3 lp;
  if (aKind < 0.5) {
    vec3 a = (modelMatrix * vec4(position, 1.)).xyz, b = (modelMatrix * vec4(aEnd, 1.)).xyz, c = mix(a, b, aQ.x);
    vec3 sd = cross(b - a, c - cameraPosition); sd /= max(length(sd), 1e-4);
    lp = c + sd * aQ.y * aQ.z * (0.7 + aQ.x * 0.9);
  } else {
    float ext = position.y, sp = 0.6 + 0.8 * fract(aQ.w * 3.7);
    float y = (fract(aQ.w + uTime * sp / (2. * ext)) * 2. - 1.) * ext;
    vec3 c = (modelMatrix * vec4(position.x + sin(uTime * 1.7 + aQ.w * 9.) * 0.25, y, position.z + cos(uTime * 1.3 + aQ.w * 5.) * 0.25, 1.)).xyz;
    vec3 rt = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    lp = c + (rt * (aQ.x * 2. - 1.) + up * aQ.y) * aQ.z;
  }
  gl_Position = projectionMatrix * viewMatrix * vec4(lp, 1.);
}`,fragmentShader:`
uniform float uTime, uFade; uniform vec3 uShaft, uBub; varying vec4 vQ; varying float vKind;
void main(){
  vec3 col;
  if (vKind < 0.5) {
    float e = 1. - vQ.y * vQ.y, t = vQ.x;
    float a = e * e * smoothstep(0., 0.12, t) * (1. - t) * (1. - t) * (0.65 + 0.35 * sin(uTime * 0.8 + vQ.w + t * 5.));
    col = uShaft * a * 0.95 * (0.12 + 0.88 * uFade);
  } else {
    vec2 p = vec2(vQ.x * 2. - 1., vQ.y); float r = length(p);
    float rim = (1. - smoothstep(0.82, 1., r)) * smoothstep(0.5, 0.9, r) + (1. - smoothstep(0.0, 0.3, length(p - vec2(-0.35, 0.4)))) * 0.9;
    col = uBub * rim * 1.3 * (0.25 + 0.75 * uFade);
  }
  gl_FragColor = vec4(col, 1.);
}`});return{mesh:new e.Mesh(w,v),mat:v}}function Ht(n,t){const a=new e.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:n.uTime,uShade:n.uGroundShade,uGold:{value:new e.Color(t[5])},uAqua:{value:new e.Color(t[0])},uCoral:n.uCoral,uStretch:{value:new e.Vector3(1,0,1.27)},uK:{value:new e.Vector4(.62,1,1,0)}},vertexShader:`
varying vec2 vP;
#include <fog_pars_vertex>
void main(){ vP = position.xy; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform float uTime; uniform vec3 uShade, uGold, uAqua, uCoral, uStretch; uniform vec4 uK; varying vec2 vP;
#include <fog_pars_fragment>
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  vec2 p = vec2(vP.x, vP.y / max(uStretch.z, 1e-3)) / max(uK.y, 1e-3);                 // metres, sun-line squash removed
  float r = length(p);
  float sh = (1. - smoothstep(185., 285., r)) * uK.x;
  vec2 q = p * 0.045 + vec2(vn(p * 0.012 + uTime * 0.05), vn(p * 0.012 - uTime * 0.04 + 7.)) * 1.6;
  float n1 = abs(vn(q + uTime * 0.07) - vn(q * 1.63 - uTime * 0.05 + 3.1));
  float n2 = abs(vn(q * 2.1 - uTime * 0.09 + 11.) - vn(q * 3.3 + uTime * 0.06));
  float net = (1. - smoothstep(0.0, 0.11, n1)) + (1. - smoothstep(0.0, 0.09, n2)) * 0.5;
  float pool = 1. - smoothstep(30., 165., r);
  vec3 cau = mix(uAqua * 0.7 + uGold * 0.5, uGold * 0.9 + uCoral * (0.4 + uK.w), 1. - smoothstep(0., 110., r)) * (net * 1.25 + 0.16) * pool * uK.z;
  vec3 col = uShade * 0.62 * sh + cau; float a = sh;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col *= 1. - fogF; a *= 1. - fogF;
  #endif
  gl_FragColor = vec4(col, a);
}`});return{mesh:new e.Mesh(new e.PlaneGeometry(640,640*1.27),a),mat:a}}async function Ko(n,t={}){const a=n.rng.fork?n.rng.fork("mother-globe"):n.rng,o=t.palette&&t.palette.length>=7?t.palette:yo,c=oe(t.detail??n.quality?.detail??1,.6,1),r=bo(o);await n.yield?.();const p=new e.Group;p.name="mother-globe";const s=(l,k)=>(l.frustumCulled=!1,k!==void 0&&(l.renderOrder=k),p.add(l),l),i=a.range(-.25,.25),u=new e.Vector3(Math.sin(.35)*Math.cos(i),Math.cos(.35),Math.sin(.35)*Math.sin(i)).normalize(),h=new e.Vector3(0,0,1).cross(u).normalize().negate(),f=new e.Vector3().crossVectors(u,h).normalize(),d=new e.Matrix3().set(h.x,f.x,u.x,h.y,f.y,u.y,h.z,f.z,u.z),w=12,v=[],g=Math.round(oe(t.boats??w,6,w));for(let l=0;l<w;l++)v.push((l+a.range(-.3,.3))/g*Math.PI*2);const y=6/$,b=new e.Vector4(.021,.31,a.range(0,6.28),0),C=new e.Vector4(.022,1.25,a.range(0,6.28),0),S=new e.Vector4(.024,.8,a.range(0,6.28),0),B=We(31);await n.yield?.();const A=We(15),P=We(7);await n.yield?.();const m=H(r,"back",{wob:b,shrink:.996,abs:1/150,rip:.05,heart:1,heartR:92,near:1,nearA:45,nearB:215,nearTi:.3}),x=H(r,"front",{wob:b,rip:.11,wakes:!0,gc:d,boatPh:v,boatW:y,boatN:g,near:1,nearA:45,nearB:215}),M=s(new e.Mesh(A,m),1),F=s(new e.Mesh(B,x),20);for(const l of[M,F])l.position.copy(R),l.scale.setScalar($);await n.yield?.();const E=new e.Vector4(0,.2,.98,.9),L=H(r,"back",{wob:C,shrink:.99,abs:1/80,rip:.04,transparent:!0,thinTeal:.5,win:E}),T=H(r,"front",{wob:C,rip:.09}),Q=s(new e.Mesh(P,L),2),O=s(new e.Mesh(A,T),21);for(const l of[Q,O])l.position.copy(ae),l.scale.setScalar(Y);const N=n.core&&n.core.makeRng?n.core.makeRng((n.seed??1)*7919+104729>>>0||1):a,I=new e.Vector3(-.42,.86,.29).normalize(),U=new e.Vector3(0,0,1).cross(I).normalize().negate(),D=new e.Vector3().crossVectors(I,U).normalize(),Z=new e.Matrix3().set(U.x,D.x,I.x,U.y,D.y,I.y,U.z,D.z,I.z),X=4,fe=[],ct=3.2/ne;for(let l=0;l<12;l++)fe.push((l+N.range(-.2,.2))/X*Math.PI*2);const me=H(r,"back",{wob:S,shrink:.992,abs:1/95,rip:.05,thinTeal:.4,bulgeK:30,near:1,nearA:150,nearB:330,nearTi:.42}),Le=H(r,"front",{wob:S,rip:.1,bulgeK:30,wakes:!0,gc:Z,boatPh:fe,boatW:ct,boatN:X,near:1,nearA:150,nearB:330}),Qt=s(new e.Mesh(P,me),2),jt=s(new e.Mesh(A,Le),21);for(const l of[Qt,jt])l.position.copy(J),l.scale.setScalar(ne);const $t=t.breeze?1.7:.55,ft=new e.Vector4(.02*$t,.7*(t.breeze?1.3:1),N.range(0,6.28),0),Zt=H(r,"back",{wob:ft,shrink:.992,abs:1/85,rip:.05,thinTeal:.4,near:1,nearA:15,nearB:200,nearTi:.42}),Xt=H(r,"front",{wob:ft,rip:.1,near:1,nearA:15,nearB:200}),Yt=s(new e.Mesh(P,Zt),2),Jt=s(new e.Mesh(A,Xt),21);for(const l of[Yt,Jt])l.position.copy(ge),l.scale.setScalar(Me);const Ce=n.noise||n.core.makeNoise(7),ze=a.range(-.035,.03),Be=async()=>{await n.yield?.()},Oe=await Ee(a,Ce,r,o,{rock:64,scale:1,count:Math.round(185*(.7+.3*c)),hue:ze,fogK:1/210,glow:1.9,warm:.4},Be);s(Oe.mesh,5),Oe.mesh.position.copy(R),await n.yield?.();const mt=ae.clone().add(new e.Vector3(0,-13,0)),Ie=await Ee(a,Ce,r,o,{rock:4.6,scale:.1,count:58,rockSeg:26,warm:0,hue:ze+.02,fogK:1/60,glow:1.6,waterGain:1.4},Be);s(Ie.mesh,5),Ie.mesh.position.copy(mt),await n.yield?.();const ve=[[Oe.mat.uniforms.uGlobe.value,R,$],[Ie.mat.uniforms.uGlobe.value,ae,Y]],ie=await Ee(N,Ce,r,o,{rock:4.4,scale:.105,count:40,rockSeg:20,warm:.05,hue:ze-.012,fogK:1/95,glow:2.1,waterGain:1.3},Be);s(ie.mesh,5),ie.mesh.position.copy(ge).add(new e.Vector3(8,-4,9)),ie.mesh.scale.setScalar(1.25),ie.mesh.rotation.set(.4,1.1,.2);const vt=ie.mkMat({fogK:1/125,glow:2.3,warm:.15}),Ue=s(new e.Mesh(ie.geo,vt),5);Ue.position.copy(J).add(new e.Vector3(17,-10,-8)),Ue.scale.setScalar(2.5),Ue.rotation.set(-.5,2.6,.9),ve.push([ie.mat.uniforms.uGlobe.value,ge,Me],[vt.uniforms.uGlobe.value,J,ne]),await n.yield?.();const xe=Bo(a,o,t.sail),eo=new e.Color(a.pick([o[4],o[4],o[5],o[6]])).multiplyScalar(.85),ht=(l,k,z,V,W)=>new e.ShaderMaterial({fog:!0,vertexColors:!0,side:e.DoubleSide,uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:r.uTime,uSun:r.uSun,uSunCol:r.uSunCol,uSkyZen:r.uSkyZen,uSkyMid:r.uSkyMid,uSkyHaze:r.uSkyHaze,uGroundSun:r.uGroundSun,uGroundShade:r.uGroundShade,uGC:{value:l},uBoatW:{value:k},uR:{value:z},uWob:{value:V},uStripe:{value:eo},uScale:{value:W}},vertexShader:Ao,fragmentShader:To}),pt=3,dt=ht(d,y,$,b,pt),wt=s(new e.InstancedMesh(xe,dt,w),6);xe.setAttribute("aPh",new e.InstancedBufferAttribute(new Float32Array(v),1)),wt.position.copy(R),wt.count=g;const Ae=new e.BufferGeometry;for(const l of["position","normal","color","aSway"])Ae.setAttribute(l,xe.attributes[l]);Ae.setIndex(xe.index),Ae.setAttribute("aPh",new e.InstancedBufferAttribute(new Float32Array(fe),1)),s(new e.InstancedMesh(Ae,ht(Z,ct,ne,S,.8),X),6).position.copy(J),await n.yield?.();const Te=[5.4,3,6.3,2.4,5.8,1.4,.01,3.6,5,2.4,4],Se=8;{const l=a.int(0,10),k=a.chance(.5),z=a.int(0,10),V=a.int(0,10),W=Te.slice(0,5);for(let _=0;_<l%5;_++)W.push(W.shift());k&&W.reverse();for(let _=0;_<5;_++)Te[_]=W[_];for(const _ of[z,V])_>6&&(Te[_]*=.93)}const se=H(r,"solid",{wob:S,abs:1/34,ghost:.3,tiMax:.8,bodyGain:1.1,thinTeal:.85,spec:1.3,fres:.9,rip:.06,vertexShader:Po,cut:!0});Object.assign(se.uniforms,{uA:{value:we},uB:{value:De},uBeadR:{value:Te},uThin:{value:0},uBead:{value:0},uRecoil:{value:0},uRecA:{value:0}});const he=De.clone().sub(we),Pe=he.length();he.normalize();const Wo=s(new e.Mesh(Go(272,24,(ce-12+8)/(Pe+16),(Pe-ut+12+8)/(Pe+16)),se),4),gt=(Pe-ce-ut)/11,He=30,to=H(r,"solid",{wob:new e.Vector4(.05,3.1,1,0),abs:1/6,ghost:.25,tiMax:.42,bodyGain:1.25,thinTeal:.85,rip:0}),yt=s(new e.InstancedMesh(new e.IcosahedronGeometry(1,1),to,He),4),bt=[];for(let l=0;l<He;l++){const k=l%12,z=a.range(0,6.28),V=a.range(0,1)**2*2.2;bt.push({neck:k,x:ce+k*gt+a.range(-3.2,3.2),ang:z,off:V,r:a.range(.35,1.1)*(l<12?1.25:.8),drift:a.range(.3,1),ph:a.range(0,6.28)})}const xt=new e.Vector3().crossVectors(he,new e.Vector3(0,1,0)).normalize(),oo=new e.Vector3().crossVectors(xt,he),St=new e.Matrix4,kt=new e.Vector3,ao=new e.Quaternion,Mt=new e.Vector3,Ge=new e.Vector4().copy({...we.clone().sub(R).normalize(),w:0}),Fe=new e.Vector4().copy({...De.clone().sub(J).normalize(),w:0});m.uniforms.uBulge.value=Ge,x.uniforms.uBulge.value=Ge,me.uniforms.uBulge.value=Fe,Le.uniforms.uBulge.value=Fe,x.uniforms.uBulgeK=m.uniforms.uBulgeK,Le.uniforms.uBulgeK=me.uniforms.uBulgeK,m.uniforms.uBulgeK.value=260,me.uniforms.uBulgeK.value=26;const Ct=new e.Vector4(0,0,0,$),zt=new e.Vector4(0,0,0,ne);Object.assign(se.uniforms,{uCutA:{value:Ct},uCutB:{value:zt},uCutWobA:{value:b},uCutWobB:{value:S},uCutBulgeA:{value:Ge},uCutBulgeB:{value:Fe},uCutKA:m.uniforms.uBulgeK,uCutKB:me.uniforms.uBulgeK});const ke=we.clone().addScaledVector(he,ce+6.5*gt),Bt=new e.Vector4(.03,2.1,a.range(0,6.28)*0+1.7,0),no=H(r,"back",{wob:Bt,shrink:.985,abs:1/30,rip:.05,thinTeal:.6,near:1,nearA:12,nearB:150,nearTi:.5}),ro=H(r,"front",{wob:Bt,rip:.1,near:1,nearA:12,nearB:150}),At=s(new e.Mesh(P,no),2),Tt=s(new e.Mesh(We(10),ro),21);for(const l of[At,Tt])l.position.copy(ke);let Qe=null,je=null;const pe=Object.assign({thin:[.6,.72],bead:[.7,.765],recoil:[.74,.86]},t.timing||{}),Pt=(l,k,z)=>oe((z-l)/(k-l),0,1);function Gt(l,k){const z=te(pe.thin[0],pe.thin[1],l),V=Pt(pe.bead[0],pe.bead[1],l),W=Pt(pe.recoil[0],pe.recoil[1],l);se.uniforms.uThin.value=z,se.uniforms.uBead.value=V,se.uniforms.uRecoil.value=te(0,.45,W);const _=te(.18,.62,V);se.uniforms.uRecA.value=_;const it=Math.sin(Math.PI*Math.min(W*1.15,1))*(1-.5*W),po=Math.sin(Math.PI*Math.min(_*1.15,1))*(1-.5*_);Ge.w=.012*po,m.uniforms.uBulgeK.value=de(420,60,_),Fe.w=.085*it,me.uniforms.uBulgeK.value=de(40,6,W);for(let Ve=0;Ve<He;Ve++){const ee=bt[Ve],Kt=Ut(V,Math.min(ee.neck,10)),wo=te(.5,.75,Kt),go=te(.5,1,Kt)+V,qt=ee.off+go*ee.drift*1.6,Et=Math.sin(k*.9+ee.ph)*.4;kt.copy(we).addScaledVector(he,ee.x+Et*.5).addScaledVector(xt,Math.cos(ee.ang)*qt).addScaledVector(oo,Math.sin(ee.ang)*qt+Et),Mt.setScalar(Math.max(ee.r*wo,1e-4)),St.compose(kt,ao,Mt),yt.setMatrixAt(Ve,St)}yt.instanceMatrix.needsUpdate=!0;const _t=Ut(V,6),Re=de(2.2,Se,te(.05,.62,_t))*(1+.012*Math.sin(k*2.4+1.7)*te(.5,1,_t));At.scale.setScalar(Re),Tt.scale.setScalar(Re),Qe&&Qe.scale.setScalar(Re/Se),je&&je.scale.setScalar(Re/Se)}Gt(0,0),await n.yield?.();const Ft=[];for(let l=0;l<15;l++){const k=l<5,z=l>=11;Ft.push({n:60,ctr:z?[15,0,0,1.5708]:[0,0,0,0],rMin:k?14:z?4:6,rMax:k?26:z?9.5:15,tilt:a.range(-.7,.7),node:a.range(0,6.28),phase:a.range(0,6.28),tiltSpread:z?.2:.07,size:z?[.7,1]:[.55,.85],speed:[1.6,2.6],school:a.range(.5,1.3)*(z?4.5:1)})}const $e=be(a,r,o,{groups:Ft,water:new e.Color(o[0]).multiplyScalar(.42).lerp(new e.Color(o[1]).multiplyScalar(.6),.35),fogK:1/46,avoid:3.6,self:.5,tintA:new e.Color(o[4]).multiplyScalar(1.1),tintB:new e.Color(o[4]).lerp(new e.Color(o[5]),.55)});s($e.mesh,5),$e.mesh.position.copy(ae),await n.yield?.();const Nt=[],io=a.range(0,6.28);for(let l=0;l<3;l++)for(let k=0;k<6;k++)Nt.push({n:Math.round(50*(.6+.4*c)),ctr:[128,.35+l*.5,io+l*2.1,l*2.09],rMin:3,rMax:15,tilt:a.range(-1.5,1.5),node:a.range(0,6.28),phase:a.range(0,6.28),tiltSpread:.16,size:[2.2,3.4],speed:[7,11],school:0});const Ze=be(a,r,o,{groups:Nt,simple:!0,water:new e.Color(o[1]).multiplyScalar(.4).lerp(new e.Color(o[4]).multiplyScalar(.5),.35),fogK:1/260,ctrW:.09,tintA:new e.Color(.62,.68,.72),tintB:new e.Color(o[1]).multiplyScalar(.75).lerp(new e.Color(.8,.82,.8),.4)});s(Ze.mesh,5),Ze.mesh.position.copy(R),ve.push([$e.mat.uniforms.uGlobe.value,ae,Y],[Ze.mat.uniforms.uGlobe.value,R,$]),await n.yield?.();const Xe=new e.Color(o[4]).multiplyScalar(1.15),Ye=new e.Color(o[4]).lerp(new e.Color(o[5]),.6),Je=new e.Color(o[0]).multiplyScalar(.5),j=(l,k,z,V,W,_=[0,0,0,0],it=.07)=>({n:l,ctr:_,rMin:k,rMax:z,tilt:N.range(-.6,.6),node:N.range(0,6.28),phase:N.range(0,6.28),tiltSpread:it,size:V,speed:W,school:N.range(.7,1.5)}),so=[j(70,22,31,[1.5,2.3],[3,4.5]),j(60,17,25,[1.2,1.9],[2.5,4]),j(60,26,35,[1.4,2.2],[3,4.5]),j(50,13,19,[1,1.6],[2,3])],Ne=be(N,r,o,{groups:so,water:Je,fogK:1/75,self:.4,tintA:Xe,tintB:Ye});s(Ne.mesh,5),Ne.mesh.position.copy(ge),Ne.mesh.scale.setScalar(Me/45);const lo=[j(70,30,42,[1.9,2.9],[3.5,5]),j(60,24,34,[1.6,2.5],[3,4.5]),j(60,36,47,[1.8,2.8],[3.5,5]),j(50,19,27,[1.4,2.1],[2.5,3.5])],et=be(N,r,o,{groups:lo,water:Je,fogK:1/100,self:.4,tintA:Xe,tintB:Ye});s(et.mesh,5),et.mesh.position.copy(J),await n.yield?.();const Rt=[];for(let l=0;l<7;l++){const k=-.86+l*.2+N.range(-.04,.04),z=j(66,8,19,[2.8,4.4],[4,6.5],[N.range(204,222),-.25+N.range(-.13,.1),0,k],.55);Rt.push(z)}const tt=be(N,r,o,{groups:Rt,water:new e.Color(o[0]).multiplyScalar(.36).lerp(new e.Color(o[1]).multiplyScalar(.5),.4),fogK:1/150,self:.3,ctrW:0,tintA:new e.Color(o[4]).multiplyScalar(1.05),tintB:new e.Color(o[4]).lerp(new e.Color(o[5]),.35)});s(tt.mesh,5),tt.mesh.position.copy(R),ve.push([Ne.mat.uniforms.uGlobe.value,ge,Me],[et.mat.uniforms.uGlobe.value,J,ne],[tt.mat.uniforms.uGlobe.value,R,$]);{const l=[j(26,4.2,6.3,[1.5,2.1],[2.4,3.4],[0,0,0,0],.3),j(18,3.3,4.6,[1.1,1.6],[1.7,2.5],[0,0,0,0],.45)],k=be(N,r,o,{groups:l,water:Je,fogK:1/45,self:.5,tintA:Xe,tintB:Ye});s(k.mesh,5),k.mesh.position.copy(ke),Qe=k.mesh,ve.push([k.mat.uniforms.uGlobe.value,ke,Se]);const z=await Ee(N,Ce,r,o,{rock:1.7,scale:.05,count:18,rockSeg:14,warm:.05,hue:ze+.01,fogK:1/45,glow:2.2,waterGain:1.3},Be);s(z.mesh,5),z.mesh.position.copy(ke).add(new e.Vector3(.4,-1.6,0)),z.mesh.rotation.set(.3,2,-.2),je=z.mesh,ve.push([z.mat.uniforms.uGlobe.value,ke,Se])}await n.yield?.();const ot=Vo(a,r,o,r.uSun.value);s(ot.mesh,22),ot.mesh.position.copy(ae);let le=null;const at=new e.Vector3,Vt=()=>{const l=r.uSun.value,k=R.y/Math.max(l.y,.15);at.set(R.x-l.x*k,.5,R.z-l.z*k),le&&(le.mesh.position.copy(at),le.mesh.rotation.set(-Math.PI/2,0,Math.atan2(l.x,-l.z)+Math.PI,"YXZ"),le.mat.uniforms.uStretch.value.z=1/Math.max(l.y,.15),le.mesh.scale.set(1,1/Math.max(l.y,.15)/1.27,1))};if(t.groundFx!==!1){le=Ht(r,o),s(le.mesh,0);const l=Ht(r,o);l.mat.uniforms.uK.value.set(.3,1,t.bellyGain??1.25,.5),l.mat.uniforms.uStretch.value.z=1,s(l.mesh,.05),l.mesh.position.set(R.x+30,.7,R.z),l.mesh.rotation.x=-Math.PI/2,l.mesh.scale.set(1.5,1.5,1)}Vt();const G=(l,k,z)=>new e.Vector3(l,k,z),Dt=G(.61,.052,.79).normalize(),uo={motherCentre:R.clone(),motherRadius:$,heartCentre:R.clone(),heartRadius:100,lanternCentre:ae.clone(),lanternRadius:Y,bommieCentre:mt.clone(),daughterCentre:J.clone(),daughterRadius:ne,moonCentre:ge.clone(),moonRadius:Me,boatScale:pt,bridgeA:we.clone(),bridgeB:De.clone(),flyThrough:[G(300,368,-300),G(294,384,-150),G(288,396,-20),G(266,398,95),G(235,398,175),G(235,409,274),G(268,408,324),G(298,406,370),G(372,405,392),G(405,407,450),G(455,411,505)],closestPass:G(288,396,-20),lanternEntry:G(244,398,147),lanternExit:G(235,400,205),viewpoints:[{name:"reveal",position:G(300,345,-500),lookAt:R.clone()},{name:"skin",position:G(288,396,-20),lookAt:G(232,372,60)},{name:"beads",position:G(262,408,315),lookAt:G(240,411,325)},{name:"belly",position:G(120,120,-260),lookAt:G(-200,0,80)}],portalSeat:{position:G(580,420,550),facing:Dt.clone().negate(),direction:Dt},shadowCentre:at,causticRadius:150,sunDirection:r.uSun.value,boatCircle:{centre:R.clone(),u:h.clone(),v:f.clone(),pole:u.clone(),radius:$,angularSpeed:y,phases:v}};let nt=!1;const co=(l,k,z=new e.Vector3)=>{const V=v[l%w]+(nt?0:y*k);return z.copy(h).multiplyScalar(Math.cos(V)).addScaledVector(f,Math.sin(V)).multiplyScalar($).add(R)},Wt=l=>{const k=xe.attributes.aPh;for(let z=0;z<w;z++)v[z]=fo[z]+l,k.setX(z,v[z]);k.needsUpdate=!0},fo=v.slice(),mo=l=>{nt||(nt=!0,dt.uniforms.uBoatW.value=0,x.uniforms.uBoatW.value=0),Wt(l)},vo=l=>{r.uSun.value.copy(l).normalize(),Vt()};let rt=0;const q=new e.Vector3;function ho(l,k,z){if(r.uTime.value=k,r.uProgress.value=rt,z){z.getWorldPosition(q),p.worldToLocal(q);const V=q.distanceTo(ae),W=1-te(Y*.96,Y*1.03,V);L.uniforms.uInside.value=W,O.visible=W<.5,ot.mat.uniforms.uFade.value=W}p.updateWorldMatrix(!0,!1);for(const[V,W,_]of ve)q.copy(W).applyMatrix4(p.matrixWorld),V.set(q.x,q.y,q.z,_);q.copy(R).applyMatrix4(p.matrixWorld),Ct.set(q.x,q.y,q.z,$),q.copy(J).applyMatrix4(p.matrixWorld),zt.set(q.x,q.y,q.z,ne),Gt(rt,k)}return{object:p,radius:300,height:690,center:R.clone(),anchors:uo,update:ho,setProgress(l){rt=oe(l,0,1)},setSun:vo,setBoatOffset:Wt,setFleetLongitude:mo,boatPosition:co,dispose(){},setLanternWindow(l,k=.45){E.set(l.x,l.y,l.z,Math.cos(k))},ground:!0,groundY:0,uniforms:r}}export{_e as FOG_FRAG,xo as GLOBE_VERT,re as GLSL_COMMON,Ko as buildHero,We as icoGeo,H as makeWaterMat};
