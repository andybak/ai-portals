import*as o from"three";import{clamp as ee,smoothstep as he,makePath as wa}from"../kit/core.js";const Ka=["#0F2A1C","#E8308C","#19C3D6","#F2B93B","#F4F1E6","#6FB34A","#05080A"],me=14,xa=me+2,Fe=28,ya=`
float bsHash(vec3 p){ p = fract(p * 0.3183099 + vec3(0.11, 0.23, 0.37)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float bsNoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(bsHash(i), bsHash(i + vec3(1,0,0)), f.x), mix(bsHash(i + vec3(0,1,0)), bsHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(bsHash(i + vec3(0,0,1)), bsHash(i + vec3(1,0,1)), f.x), mix(bsHash(i + vec3(0,1,1)), bsHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float bsFbm(vec3 p){
  float s = 0.0, a = 0.5;
  s += a * bsNoise(p); p = p * 2.03 + vec3(3.1, 1.7, 5.3); a *= 0.5;
  s += a * bsNoise(p); p = p * 2.01 + vec3(1.3, 7.1, 2.9); a *= 0.5;
  s += a * bsNoise(p); p = p * 2.02 + vec3(6.7, 0.9, 4.1); a *= 0.5;
  s += a * bsNoise(p);
  return s * 2.1333 - 1.0;            // ~[-1,1]
}
vec2 bsHash2(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
`,Sa=`
uniform vec3 uSun, uSunCol, uShade, uLeaf, uWhite;
uniform vec3 uLampC, uLampX, uLampCol;
uniform float uLampK, uEnvWin, uWinS;
uniform vec2 uEnvWall;
uniform vec3 uWall, uWallX, uWin, uWinX;
uniform float uTime;
float bsWinK = 1.0;            // the film fades the window at grazing angles
float bsWinV = 0.0;            // the window quadrilateral's own light at this direction (set by bsEnv)
// POLISH L1D: what a film does to the two built things it mirrors, the window's quadrilateral and the house wall the window is
// set in. All three stay 0 for the backdrop and the droplets, which see both exactly as before.
vec3 bsBend = vec3(0.0);       // how far the film's tilt at this fragment throws the mirrored ray (set by the film before bsEnv)
float bsSoft = 0.0;            // 1 on a film: both are feathered at their edges (a film is not a plate of glass)
vec3 bsWallD = vec3(0.0);      // the light the wall added at this direction (set by bsEnv): the film gives it back in its own colours
vec3 bsBokeh(vec2 p, float t, float keep){
  vec2 id = floor(p), f = fract(p) - 0.5;
  vec2 rnd = bsHash2(id);
  vec2 off = (rnd - 0.5) * 0.36;
  float rad = 0.13 + 0.18 * rnd.x;
  float d = length(f - off);
  float disc = 1.0 - smoothstep(rad * 0.82, rad, d);
  disc *= 0.75 + 0.25 * smoothstep(rad * 0.5, rad * 0.9, d);       // brighter edge, like real bokeh
  float tw = 0.55 + 0.45 * sin(t * (0.5 + rnd.y * 1.6) + rnd.x * 40.0);
  float on = step(keep, fract(rnd.x * 7.31 + rnd.y * 3.17));
  vec3 c = mix(uLeaf * 1.5, uWhite * 1.9, rnd.y * rnd.y);
  return c * disc * tw * on;
}
vec3 bsEnv(vec3 r){
  float up = r.y;
  vec3 c = uShade * (1.6 + 1.2 * smoothstep(-0.2, 0.5, up));
  c = mix(c, uLeaf * 0.22, smoothstep(-0.25, -0.85, up));           // sunlit lawn far below
  float can = smoothstep(0.02, 0.4, up);
  c += uLeaf * 0.34 * can * (1.0 - 0.45 * uEnvWall.y);             // light filtering through leaves
  vec2 p = r.xz / (0.4 + max(up, 0.0));
  c += (bsBokeh(p * 2.6, uTime, 0.3) + 0.7 * bsBokeh(p * 5.3 + 7.7, uTime * 1.3, 0.45)) * can * (0.2 - 0.12 * uEnvWall.y);   // the backdrop's canopy is carried by round sprites
  // pale house wall with one dark window, low on one side
  // (POLISH L1D: on a film the wall is thrown by the film's tilt by the same share of its own size as the window, which it is
  // some eight times as wide as; and its edges are a long feather with next to no plateau, a cushion of light, not a slab)
  vec3 rw = r + bsBend * 8.0;
  float wd = dot(rw, uWall);
  bsWallD = vec3(0.0);
  if (wd > 0.05) {
    vec3 wy = cross(uWall, uWallX);
    vec2 q = vec2(dot(rw, uWallX), dot(rw, wy)) / wd;
    float ws = uEnvWall.y;                                             // 0 for reflections, 1 for the blurred backdrop
    float wall = smoothstep(1.5 + 0.5 * ws + 0.35 * bsSoft, 0.9 - 0.6 * ws - 0.45 * bsSoft, abs(q.x)) * smoothstep(0.75 + 0.35 * ws + 0.2 * bsSoft, 0.45 - 0.35 * ws - 0.3 * bsSoft, abs(q.y - 0.05));
    float win = smoothstep(0.26 + 0.1 * ws, 0.2 - 0.1 * ws, abs(q.x - 0.25)) * smoothstep(0.3 + 0.1 * ws, 0.24 - 0.1 * ws, abs(q.y - 0.1));
    wall *= mix(1.0, smoothstep(-0.46, -0.14, up), ws);                  // POLISH L2: in the backdrop the wall stands on the lawn, it does not veil it
    win = mix(0.3 * smoothstep(0.36, 0.1, abs(q.x - 0.25)) * smoothstep(0.4, 0.14, abs(q.y - 0.1)), win, ws);   // POLISH L1: in the film the wall's window is a soft dimming, never a hard dark square
    vec3 c0 = c;
    c = mix(c, uWhite * 0.62 * (1.0 - 0.85 * win), wall * 0.9 * uEnvWall.x);
    bsWallD = c - c0;
  }
  // the classic bright window quadrilateral with its glazing bars
  vec3 rb = r + bsBend;
  float bd = dot(rb, uWin);
  if (bd > 0.05) {
    vec3 by = cross(uWin, uWinX);
    vec2 q = vec2(dot(rb, uWinX), dot(rb, by)) / bd;
    // POLISH L2: the classic curved quadrilateral as a bubble shows it: barrel-bowed sides, keystoned, six panes
    // between glazing bars, a crisp edge with a soft shoulder (it was a soft square that read as a smudge)
    q *= uWinS; q *= 1.0 + 11.0 * dot(q, q); q.x *= 1.0 + 1.3 * q.y; q.y += 1.1 * q.x * q.x;
    // POLISH L1D: on a film the outline is feathered over nearly half a pane's width (0.036; it was 0.016) about the same middle line,
    // so the pane is the size it was; the glazing bars keep their line, they are what says window. The backdrop and the
    // droplets keep the crisp outline
    float box = smoothstep(0.128 + 0.01 * bsSoft, 0.112 - 0.01 * bsSoft, abs(q.x)) * smoothstep(0.168 + 0.01 * bsSoft, 0.152 - 0.01 * bsSoft, abs(q.y));
    float px3 = abs(abs(q.x) - 0.041);
    float bars = (0.1 + 0.9 * smoothstep(0.004, 0.011, px3)) * (0.1 + 0.9 * smoothstep(0.004, 0.011, abs(q.y - 0.012)));
    float sheen = 0.72 + 0.28 * smoothstep(-0.16, 0.16, q.y - 0.5 * q.x);                    // sky in the upper panes
    bsWinV = box * bars * sheen * uEnvWin * bsWinK;
    c += uWhite * 0.8 * bsWinV;
  }
  return c;
}
// a string of twelve garden lights on a sagging line (dusk variant); soft = disc size (1 - cos)
vec3 bsLamps(vec3 r, float soft){
  vec3 acc = vec3(0.0);
  if (uLampK < 0.5) return acc;
  for (int i = 0; i < 12; i++) {
    float t = (float(i) - 5.5) / 5.5;
    vec3 l = normalize(uLampC + uLampX * (t * 0.95) + vec3(0.0, 0.2 * t * t, 0.0));
    float dd = max(1.0 - dot(r, l), 0.0);
    float fl = 0.8 + 0.2 * sin(uTime * (2.0 + float(i) * 0.37) + float(i) * 1.7);
    acc += uLampCol * fl * (1.0 - smoothstep(soft * 0.55, soft, dd)) + uLampCol * 0.25 * exp(-dd / (soft * 6.0));
  }
  return acc;
}
// the sun as a small starred highlight (HDR)
vec3 bsSun(vec3 r){
  float sd = dot(r, uSun);
  if (sd < 0.6) return bsLamps(r, 0.0007) * 7.0;
  vec3 sx = normalize(cross(uSun, vec3(0.31, 0.2, 0.93)));
  vec3 sy = cross(uSun, sx);
  vec2 q = vec2(dot(r, sx), dot(r, sy));
  float rr = length(q);
  float disc = smoothstep(0.03, 0.018, rr) * 9.0 + exp(-rr * 22.0) * 1.3;
  float st = 0.0;
  st += exp(-abs(q.y) * 240.0);
  st += exp(-abs(q.x * 0.5 + q.y * 0.866) * 240.0);
  st += exp(-abs(q.x * 0.5 - q.y * 0.866) * 240.0);
  disc += st * exp(-rr * 9.0) * 2.6;
  return uSunCol * disc * (1.0 - uLampK) + bsLamps(r, 0.0007) * 7.0;      // under the garden lights the sun star is replaced by the dozen lamps
}
`,Te=`
uniform float uHole;
uniform vec3 uLobe;
uniform vec3 uP, uPx, uPy;
float bsFrontAz(float az){
  float amp = 1.0 - smoothstep(1.3, 2.9, uHole);
  float l = 1.0 + amp * (0.11 * sin(5.0 * az + uLobe.x) + 0.07 * sin(9.0 * az + uLobe.y) + 0.035 * sin(17.0 * az + uLobe.z));
  return uHole * l;
}
float bsAz(vec3 d){
  vec2 e = vec2(dot(d, uPx), dot(d, uPy));
  if (abs(e.x) + abs(e.y) < 1e-6) e = vec2(1e-6, 0.0);
  return atan(e.y, e.x);
}
// > 0 : still film, value = radians ahead of the front;  < 0 : already gone
float bsAhead(vec3 d){
  float colat = acos(clamp(dot(d, uP), -1.0, 1.0));
  return colat - bsFrontAz(bsAz(d));
}
`;function Da(u,d){const a=w=>new o.Color(w),f=a(u[6]),r=a(u[4]),g=a(u[3]),F=a(u[1]),V=a(u[2]),ve=a("#2434B4"),T=a("#22BDC4"),te=a("#F4F1E6"),z=(w,K)=>w.clone().lerp(te,K),I=()=>d.range(-.04,.04),W=[[0,f],[.13,f],[.2,r.clone().multiplyScalar(.8)],[.3,r.clone().multiplyScalar(.7)],[.5+I(),g],[.82+I(),F],[1.1+I(),ve],[1.4+I(),V],[1.75+I(),z(g,.12)],[2.15+I(),z(F,.1)],[2.5+I(),z(ve,.25)],[2.8+I(),z(T,.08)],[3.2+I(),z(g,.3)],[3.65+I(),z(F,.32)],[4.1+I(),z(T,.3)],[4.6,z(g,.45)],[5.1,z(F,.5)],[5.6,z(T,.5)],[6,z(g,.62)]],B=256,b=new Uint8Array(B*4),v=new o.Color;for(let w=0;w<B;w++){const K=w/(B-1)*6;let $=0;for(;$<W.length-2&&W[$+1][0]<K;)$++;const S=W[$],M=W[$+1];let A=ee((K-S[0])/Math.max(1e-4,M[0]-S[0]),0,1);A=A*A*(3-2*A),K>.4&&(A=A*A*(3-2*A)),v.copy(S[1]).lerp(M[1],A),v.multiplyScalar(.86).convertLinearToSRGB(),b[w*4]=Math.round(ee(v.r,0,1)*255),b[w*4+1]=Math.round(ee(v.g,0,1)*255),b[w*4+2]=Math.round(ee(v.b,0,1)*255),b[w*4+3]=255}const P=new o.DataTexture(b,B,1,o.RGBAFormat);return P.colorSpace=o.SRGBColorSpace,P.minFilter=P.magFilter=o.LinearFilter,P.wrapS=P.wrapT=o.ClampToEdgeWrapping,P.generateMipmaps=!1,P.needsUpdate=!0,P}const ja=`
#include <fog_pars_vertex>
\${HOLE}
uniform float uWob, uPhase, uTimeV, uLift;
varying vec3 vDir, vPosL, vCamL;
void main(){
  vec3 d = normalize(position);
  float y2 = d.y * d.y;
  float s = 1.0 + uWob * (1.5 * y2 - 0.5) * sin(uTimeV * 0.9 + uPhase) + uWob * 0.4 * d.x * d.z * sin(uTimeV * 1.37 + uPhase * 2.0);
  if (uHole > 0.0) {                       // the film just ahead of the rim piles up and lifts
    float ah = bsAhead(d);
    s += uLift * (1.0 - smoothstep(0.0, 0.05, ah)) * step(0.0, ah);
  }
  vec3 p = d * s;
  vDir = d; vPosL = p;
  mat4 mm = modelMatrix;
  #ifdef USE_INSTANCING
  mm = modelMatrix * instanceMatrix;
  #endif
  vCamL = (inverse(mm) * vec4(cameraPosition, 1.0)).xyz;
  vec4 mvPosition = viewMatrix * mm * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,$a=`
precision highp float;
#include <fog_pars_fragment>
\${NOISE}
\${ENV}
\${HOLE}
uniform sampler2D uRamp;
uniform float uR, uBack, uThin, uSpan, uNs, uRot, uFlash, uGain, uClipR, uShearT, uAlpha0, uSpotT, uFine, uBand, uBandF, uSolid, uAlphaK, uMirK, uMirH;
uniform vec3 uMirN;
uniform vec3 uClipC, uFlow, uSeedOff;
#ifdef BS_FROST
uniform vec4 uIce[12];
uniform float uIceRot;
#endif
#ifdef BS_FULL
uniform vec4 uVort[\${NV}];
uniform float uVortS[\${NV}];
uniform vec4 uSpot[\${NS}];
#endif
varying vec3 vDir, vPosL, vCamL;

float bsFineK = 0.0, bsFineK2 = 0.0, bsMidK = 1.0;
float bsHc = 0.0;              // POLISH L1D: the broad thickness at the last direction given to bsThick (the gravity ramp, the two noises, the plumes and the 40 to 50 m contour bands; none of the fine lamellae)
vec3 bsRot(vec3 p, vec3 a, float ang){
  float c = cos(ang), s = sin(ang);
  return p * c + cross(a, p) * s + a * dot(a, p) * (1.0 - c);
}
// film thickness in "orders" at a (flow-warped) direction q
float bsThick(vec3 q){
  float z = dot(q, uP);
  float g = pow(clamp((1.0 - z) * 0.5, 0.0, 1.0), 0.45);            // 0 at the thin pole, 1 at the bottom
  float n = bsFbm(q * uNs + uSeedOff);
  vec3 qm = q * uNs * 3.7 + uSeedOff.yzx;
  float m = bsNoise(qm) * 0.65 + bsNoise(qm * 2.4 + 2.2) * 0.35 - 0.5;
  vec3 qs = (q - uP * z * 0.84) * 10.0 + uSeedOff.zxy;             // stretched along the meridians
  float pn = bsNoise(qs) * 0.65 + bsNoise(qs * 2.3 + 4.1) * 0.35;
  float pl = smoothstep(0.52, 0.78, pn) * smoothstep(0.12, 0.38, g) * (1.0 - smoothstep(0.75, 0.98, g));
  bsHc = uThin + g * uSpan + n * 0.55 * (0.5 + 0.75 * g) + m * 0.5 * (0.35 + g) + pl * 1.25 + uBand * sin(g * uBandF + n * 5.0 + m * 1.6) * smoothstep(0.06, 0.3, g);
  return uThin + g * uSpan + n * 0.55 * (0.5 + 0.75 * g) + m * 0.5 * (0.35 + g) + pl * 1.25
       + bsFineK * 0.4 * sin(g * 420.0 + m * 14.0 + n * 9.0)          // fine lamellae, only where a pixel can resolve them
       + bsFineK2 * 0.28 * sin(g * 520.0 + n * 120.0 + m * 44.0)         // POLISH L1: and a finer set at macro range that follows the thickness contours everywhere, so the near film is razor sharp
       + (uBand * sin(g * uBandF + n * 5.0 + m * 1.6) + 0.17 * bsMidK * sin(g * 232.0 + m * 7.0 + n * 3.0)) * smoothstep(0.06, 0.3, g);   // POLISH L2: broad contour bands 40-50 m wide, a whole colour order deep, for the vortices to wind (was a faint stripe)
}
void main(){
  vec3 d = normalize(vDir);
  float ahead = 1.0;
  if (uHole > 0.0) { ahead = bsAhead(d); if (ahead < 0.0) discard; }
  if (uClipR > 0.0 && length(vPosL - uClipC) < uClipR) discard;
  if (uClipR < 0.0 && length(vPosL - uClipC) > -uClipR) discard;

  float pxm = max(length(fwidth(vPosL)) * uR, 0.02);                 // metres per pixel (taken before any loop)
  bsFineK = (1.0 - smoothstep(0.8, 3.0, pxm)) * uFine; bsFineK2 = (1.0 - smoothstep(0.22, 0.9, pxm)) * uFine; bsMidK = 1.0 - smoothstep(2.5, 7.0, pxm);
  // --- flow: two phase-offset warps, cross-faded so the pattern advects for ever
  vec3 qa = d, qb = d;
#ifdef BS_FULL
  for (int i = 0; i < \${NV}; i++) {
    vec4 v = uVort[i];
    float dd = 2.0 * (1.0 - dot(d, v.xyz));
    float f = exp(-dd / max(v.w * v.w, 1e-5)) * uVortS[i];
    if (abs(f) > 0.004) { qa = bsRot(qa, v.xyz, -f * uFlow.x); qb = bsRot(qb, v.xyz, -f * uFlow.y); }
  }
#endif
  vec3 drag = (qa - d) * uFlow.z + (qb - d) * (1.0 - uFlow.z);        // POLISH L1D: how far the storms have carried the film that is here now (0 where no storm reaches; at most 2)
  float zc = dot(d, uP);
  float om = uShearT * (sin(zc * 5.0 + 1.0) + 0.6 * sin(zc * 11.0 + 2.3));
  qa = bsRot(qa, uP, -om * uFlow.x - uRot);
  qb = bsRot(qb, uP, -om * uFlow.y - uRot);
  float wa = uFlow.z, wb = 1.0 - uFlow.z;
  float h = bsThick(qa) * wa; float hc = bsHc * wa;
  h += bsThick(qb) * wb; hc += bsHc * wb;                              // (POLISH L1D: hc, the broad thickness, flows with h)
  { // POLISH L2: the cross-fade of the two phases softens the near film; marbling that rides only the slow turn about P
    // (one sample, so never doubled) keeps the film under the camera razor sharp
    float nk = (1.0 - smoothstep(0.1, 0.42, pxm)) * uFine;
    if (nk > 0.01) {
      vec3 qc = bsRot(d, uP, -uRot) * uNs;
      float dt = bsNoise(qc * 34.0 + uSeedOff) * 0.6 + bsNoise(qc * 81.0 + uSeedOff.zxy) * 0.4 - 0.5;
      h += nk * (0.3 * dt + 0.1 * sin(dt * 34.0 + h * 5.0)) * smoothstep(0.45, 1.0, h);      // thin silver film stays clean: it never marbles into black
    }
  }

  // --- black film: spots merged by smooth minimum, silver rims
  float black = 0.0, rim = 0.0;
#ifdef BS_FULL
  float acc = 0.0, accR = 0.0;
  for (int i = 0; i < \${NS}; i++) {
    vec4 s = uSpot[i];
    float dist = length(d - s.xyz) * uR - s.w;
    float e = exp(clamp(-dist * 0.45, -60.0, 40.0));
    acc += e; accR += e * clamp(s.w, 0.0, 60.0);
  }
  float sd = -log(max(acc, 1e-26)) / 0.45;
  float srad = accR / max(acc, 1e-26);                                // radius of the spot that owns this point
  float halo = 0.1 * clamp(22.0 / max(srad, 2.0), 1.0, 5.0);          // a pinprick wears a narrow halo, a continent a broad one
  float aa0 = max(fwidth(sd), 1e-3);
  sd += (bsNoise(d * 26.0 + uSeedOff) - 0.5) * 7.0 + (bsNoise(d * 85.0 + uSeedOff.yzx) - 0.5) * 1.6 / (1.0 + aa0);
  // POLISH L1: the black country is broken, not one slab: broad swells leave islands and bays of colour
  // film inside its shores, and pinpricks are being born in the film within ~70 m of it (a cell field,
  // 8 nearest cells, plain arithmetic in the loop), each growing on its own clock and wearing its own rim
  vec3 dr = bsRot(d, uP, -uRot);                                      // the swells ride the film's slow turn about P
  sd += (bsNoise(dr * 7.5 + uSeedOff.zxy) - 0.5) * 26.0 * smoothstep(-34.0, -3.0, sd) * (1.0 - smoothstep(4.0, 16.0, sd));
  // islands of thick film left standing in the black continent, each with its own silver shore
  float isl = (bsNoise(dr * 8.5 + uSeedOff) * 0.7 + bsNoise(dr * 23.0 + uSeedOff.yzx) * 0.3 - 0.52) * 130.0;
  float isd = min(isl, -sd - 6.0);
  float inIsl = step(sd, isd) * step(0.0, isd);
  halo = mix(halo, 0.6, inIsl);              // an island's film thickens quickly inland: gold, then magenta, within a few metres of its shore
  sd = max(sd, isd);
  float pin = 1e3, best = 1e3;
  {
    float shore = (1.0 - smoothstep(14.0, 52.0, sd)) * smoothstep(1.5, 7.0, sd);
    if (shore > 0.01) {
      vec3 pc = dr * (uR / 25.0) + uSeedOff.yzx;
      vec3 ib = floor(pc - 0.5);
      for (int k = 0; k < 8; k++) {
        float fk = float(k);
        vec3 o = vec3(mod(fk, 2.0), mod(floor(fk * 0.5), 2.0), floor(fk * 0.25));
        vec3 id = ib + o;
        float h1 = bsHash(id), h2 = bsHash(id + 17.3), h3 = bsHash(id + 41.7);
        vec3 fp = id + 0.5 + (vec3(h1, h2, h3) - 0.5) * 0.5;
        float born = h2 * 30.0 - 6.0;
        float rr = (1.5 + 7.5 * h3 * h3) * smoothstep(born, born + 10.0, uSpotT) * shore;
        best = min(best, length(pc - fp) * 25.0 - rr + step(rr, 0.05) * 1e3);
      }
      pin = best;
    }
  }
  sd = min(sd, pin);
  float aa = max(fwidth(sd), aa0);
  h = mix(h, max(h, 0.5 + 0.8 * bsNoise(dr * 26.0 + uSeedOff.zxy) + 0.28 * sin(isd * 0.6 + 1.2) + 0.2), inIsl);     // islands are thick film left standing: gold to magenta, never the cap's own silver
  { // POLISH L2: the silver is a 0.4 m line at the shore (it was a band metres wide that read as a sticker's outline); inland the
    // orders follow at uneven, feathered widths
    float s0 = max(sd, 0.0), hv = halo * (0.55 + 1.7 * bsNoise(dr * 31.0 + uSeedOff.yzx));
    h = min(h, 0.19 + min(s0, 0.32) * 0.8 + max(s0 - 0.32, 0.0) * hv * 1.5); }
  h = min(h, 0.19 + max(pin, 0.0) * 0.55);
  black = 1.0 - smoothstep(-aa, aa, sd);
  float rw = max(0.12, aa * 0.45);
  rim = (1.0 - smoothstep(rw * 0.6, rw * 0.6 + aa * 0.85, abs(sd - rw))) * step(-60.0, -abs(sd));      // POLISH L2: a hair line, one to two pixels
  rim *= clamp(0.2 / max(aa * 0.6, 1e-3), 0.42, 1.0);                 // a 0.4 m line: where a pixel is wider than it, it dims instead of thickening
#endif
  float hb = 1.0 - smoothstep(0.125, 0.15, h);                      // film that has thinned to black by itself
  black = max(black, hb);
  h = clamp(h, 0.0, 5.98);
  vec3 film = texture2D(uRamp, vec2(h / 6.0, 0.5)).rgb;

  // --- shading: fresnel mirror of the garden, coloured by the film
  vec3 N = normalize(vPosL);
  vec3 V = normalize(vCamL - vPosL);
  if (uBack > 0.5) { N = -N; film = film * (0.12 + 1.25 * film); }       // the far inner wall: its bands deepened, so they stay colour when dimmed
  float ndv = clamp(abs(dot(N, V)), 0.0, 1.0);
  vec3 Rr = reflect(-V, N);
  float fr = pow(1.0 - ndv, 2.2);
  bsWinK = (1.0 - 0.7 * fr) * smoothstep(9.0, 15.0, length(vCamL - vPosL) * uR);   // (POLISH L2: the whole pane fades as the camera sinks, see update(); a fade by distance cut it into a smudge)
  { // POLISH L1D: the window's quadrilateral and the house wall are carried by the film. A film is not a ball of glass: it is
    // tilted where the storms drag it and where it thickens and thins, and the mirror image of a thing goes where the tilted
    // film throws it. Three tilts, all of the film at this fragment and nothing of the lens:
    //   the drag of the storms: the same displacement that winds the colour bands. It counts on a storm's flank, where the
    //     film is carried up to some 18 m (0.06 of the radius) and the bands still lie side by side: there it tilts the film
    //     up to 0.010 rad, which throws the pane by a sixth of its half-width, so a storm passing under the reflection
    //     pulls its outline and its bars round and lets them go again. In the eye, where the film has gone round many
    //     times, the pull dies away (it would shred the pane, and the eye of a storm is still);
    //   the swell of the broad bands: 0.006 rad to and fro once in about one and a half colour orders of the broad
    //     thickness (the 40 to 50 m contour bands, the plumes): the pane, some 7 m of film across, is bowed and sheared
    //     by the band it lies on, and as the bands slide it sways with them, by a tenth of its half-width (at a quarter
    //     and a sixth, tried first, the pane over the tightly wound streaks of the entry swirl was torn band from band
    //     and no longer read as a window);
    //   the ripple of the fine lamellae: 0.002 rad on the full thickness, the colours themselves: a tremble of a third of a
    //     glazing bar's width along the edges and bars wherever colour runs under them.
    float dl = min(length(drag), 2.0);
    vec3 tilt = drag * (0.4 * exp(-dl * dl / 0.0036));
    vec3 tx = cross(uP, d); tx /= max(length(tx), 1e-3); vec3 ty = cross(d, tx);
    tilt += (tx * sin(hc * 4.4 + 1.0) + ty * sin(hc * 3.1 + 2.3)) * 0.006 + (tx * sin(h * 4.4 + 1.0) + ty * sin(h * 3.1 + 2.3)) * 0.002;
    bsBend = reflect(-V, normalize(N + tilt)) - Rr; bsSoft = 1.0;
  }
  vec3 E = bsEnv(Rr);
  vec3 S = bsSun(Rr);
  vec3 fl = film / max(max(film.r, max(film.g, film.b)), 0.2);        // POLISH L1D: the film's own hue at full strength (black film stays dark)
  float refl = 0.1 + 0.9 * fr;
  float elum = dot(E, vec3(0.3, 0.55, 0.15));
  // POLISH L1D: the house wall's light comes back in the film's own colours, deepened (it was white light on the film, which
  // washed a flat pale slab into the colours, the grey rectangle strangers saw in the docked bubble): the same amount of
  // light, taken out of the white term and given through the film's hue at full strength
  vec3 col = film * ((E - bsWallD) * 1.25 + vec3(0.55 + 0.4 * fr) + fl * (dot(max(bsWallD, 0.0), vec3(0.3333)) * 1.6)) * (0.55 + 0.45 * refl) * uGain;
  col += film * film * fr * 0.35 * uGain;                           // the limb burns
  { float lm = smoothstep(0.82, 1.0, 1.0 - ndv); col += (uWhite * 0.5 + film * 0.5) * lm * lm * 0.5; }   // POLISH L2: and wears the thin bright line every bubble has, so a flank close to the lens reads as a bubble's limb
  col += S * (0.35 + 0.65 * refl);
  // POLISH L2: the window is a bright pane on the film, not a pale tint of it. POLISH L1D: its light is the film's own colour
  // at full strength with two fifths of white in it (it was plain white), and over the film's dark hues (blue, deep magenta)
  // it is lifted until it is four fifths as light as white, so that the light it lays is that of the white pane
  // (0.55 * 1.15 * 0.8 = 0.506 of white where the old one laid 0.5 * 1.02 = 0.51): a window all over, tinted by the film.
  // (MEND 1, measured in the pictures: a tinted light of the same strength reads mostly 1 to 12 of 255 less light than
  // white, and 17 to 32 less where the pane lies on deep magenta or blue film: the price of the tint; see the notes)
  vec3 lit = mix(fl, uWhite, 0.4);
  lit *= 1.15 * max(1.0, 0.8 * dot(uWhite, vec3(0.2126, 0.7152, 0.0722)) / max(dot(lit, vec3(0.2126, 0.7152, 0.0722)), 0.1));
  col = mix(col, lit, bsWinV * 0.55);
  float alpha = mix(uAlpha0, 0.98, smoothstep(0.0, 0.75, fr)) + 0.25 * clamp(elum - 0.5, 0.0, 1.0);
  alpha = max(alpha, uSolid * smoothstep(40.0, 150.0, length(vCamL - vPosL) * uR));   // POLISH L2: a docked bubble seen from far off is a whole coloured bubble, not an open dome
  // black film reflects almost nothing: a window into the bubble
  // (POLISH L1: clear looking down, so the far inner wall, the garden and the portal's ring show through
  // it; toward the limb it becomes a pale mirror of the garden instead of an opaque black band)
  float fg = fr * fr;
  vec3 bcol = E * (0.03 + 0.9 * fg) + S * 0.25 + uShade * 0.1 * fr + uWhite * 0.3 * fg * fg * fg;
  col = mix(col, bcol, black);
  alpha = mix(alpha, 0.06 + 0.4 * fg, black);
  // silver rim of the black film (blooms a little)
  col += uWhite * rim * (0.5 + 0.5 * refl + 0.3 * clamp(elum, 0.0, 1.0));
  alpha = max(alpha, rim * 0.9);
  alpha = max(alpha, clamp(dot(S, vec3(0.33)), 0.0, 1.0));
#ifdef BS_FROST
  { // fern-shaped ice crystals growing from a dozen seeds, turning slowly with the flow
    float dMin = 1e3, wMin = 0.0, tw = 0.0;
    for (int i = 0; i < 12; i++) {
      vec4 s = uIce[i];
      float rad = s.w;
      vec3 v = d - s.xyz * dot(d, s.xyz);
      float r = length(v) * uR;
      if (rad > 0.5 && r < rad) {
        vec3 tx = normalize(cross(s.xyz, vec3(0.31, 0.2, 0.93)));
        vec3 ty = cross(s.xyz, tx);
        vec2 e = vec2(dot(v, tx), dot(v, ty));
        if (abs(e.x) + abs(e.y) < 1e-7) e = vec2(1e-7, 0.0);
        float az = atan(e.y, e.x) + uIceRot * (mod(float(i), 2.0) * 2.0 - 1.0) + float(i);
        float th = mod(az + 0.5236, 1.0472) - 0.5236;
        float x = r * cos(th), y = r * abs(sin(th));
        float sp = rad * 0.075;
        float w = max(0.07 + 0.3 * (1.0 - x / rad), pxm * 0.75);
        float dd = y;                                                   // the arm
        float xb = max(floor((x - y * 0.577) / sp + 0.5), 1.0) * sp;   // branches leave it at 60 degrees
        float al = (x - xb) * 0.5 + y * 0.866;
        float pr = abs((x - xb) * 0.866 - y * 0.5);
        float len = 0.5 * (rad - xb) * (0.55 + 0.45 * fract(xb / sp * 0.618));
        if (al > 0.0 && al < len) dd = min(dd, pr + 0.12 * al / max(len, 0.01));
        float sb = sp * 0.33, ab = max(floor((al - pr * 0.577) / sb + 0.5), 1.0) * sb;   // barbs on the branches
        float al2 = (al - ab) * 0.5 + pr * 0.866, pr2 = abs((al - ab) * 0.866 - pr * 0.5);
        if (al > 0.0 && ab < len && al2 > 0.0 && al2 < 0.3 * (len - ab)) dd = min(dd, pr2 + 0.1);
        if (dd - w < dMin) { dMin = dd - w; wMin = 1.0 - r / rad; tw = float(i); }
      }
    }
    float ice = 1.0 - smoothstep(-pxm, pxm, dMin);
    float glit = 0.75 + 0.6 * step(0.86, bsNoise(d * 900.0 + tw)) * (0.5 + 0.5 * sin(uTime * 3.0 + tw * 2.0 + dMin * 9.0));
    col = mix(col, uWhite * (0.5 + 0.55 * refl + 0.35 * wMin) * glit + S * 0.5, ice * 0.92);
    alpha = max(alpha, ice * 0.9);
  }
#endif
  // the film just ahead of the burst front brightens to white gold
  if (uHole > 0.0) {
    float k = 1.0 - smoothstep(0.0, 0.04, ahead), k2 = 1.0 - smoothstep(0.0, 0.016, ahead);
    col = col * (1.0 + 1.3 * k) + vec3(1.0, 0.86, 0.55) * ((0.9 + 3.2 * uFlash) * k2 * k2 + 0.25 * uFlash * k);   // POLISH L2: the film ahead of the rim burns in its own colours
    alpha = max(alpha, k);
  }
  if (uBack > 0.5) { col = mix(vec3(dot(col, vec3(0.3, 0.55, 0.15))) * (uShade * 6.0 + 0.3), col, 0.7) * 0.55; alpha = max(alpha, 0.5 * (1.0 - black)) * 0.7; }             // the far inner wall, seen through the near skin
  if (uMirK > 0.0) alpha *= exp(-max(dot(vPosL, uMirN) - uMirH, 0.0) * uMirK);      // a mirror image fades away from the join
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0) * uAlphaK);
  #include <fog_fragment>
}`;function za(u,d){return u.replace(/\$\{(\w+)\}/g,(a,f)=>f in d?String(d[f]):a)}const Pa={HOLE:Te,NOISE:ya,ENV:Sa,NV:xa,NS:Fe},i=(u,d,a)=>new o.Vector3(u,d,a);function X(u){return(Math.abs(u.y)<.9?i(0,1,0):i(1,0,0)).cross(u).normalize()}function re(u,d,a,f,r,g=i()){const F=Math.sin(f),V=Math.cos(f);return g.set(0,0,0).addScaledVector(u,V).addScaledVector(d,F*Math.cos(r)).addScaledVector(a,F*Math.sin(r)).normalize()}function Ma(u){const d=u+1,a=new Float32Array(6*d*d*3),f=new Uint32Array(6*u*u*6),r=[[0,1,2,1],[0,1,2,-1],[1,2,0,1],[1,2,0,-1],[2,0,1,1],[2,0,1,-1]];let g=0;for(let V=0;V<6;V++){const[ve,T,te,z]=r[V],I=V*d*d;for(let W=0;W<d;W++){const B=Math.tan((W/u*2-1)*Math.PI/4);for(let b=0;b<d;b++){const v=Math.tan((b/u*2-1)*Math.PI/4),P=1/Math.sqrt(v*v+B*B+1),w=(I+W*d+b)*3;a[w+ve]=v*P,a[w+T]=B*P,a[w+te]=z*P}}for(let W=0;W<u;W++)for(let B=0;B<u;B++){const b=I+W*d+B,v=b+1,P=b+d,w=P+1;z>0?(f[g++]=b,f[g++]=v,f[g++]=w,f[g++]=b,f[g++]=w,f[g++]=P):(f[g++]=b,f[g++]=w,f[g++]=v,f[g++]=b,f[g++]=P,f[g++]=w)}}const F=new o.BufferGeometry;return F.setAttribute("position",new o.BufferAttribute(a,3)),F.setIndex(new o.BufferAttribute(f,1)),F.boundingSphere=new o.Sphere(new o.Vector3,1.02),F}async function Ja(u,d={}){const a=u.rng.fork?u.rng.fork("bubble-skin-hero"):u.rng,f=d.palette&&d.palette.length>=7?d.palette:Ka,r=d.radius??300,g=d.duration??40;let F=d.burstU??.8125;const V=d.age??a.range(.25,.85),ve=d.satellites??1,T=i(0,1,0),te=(d.sunDir?d.sunDir.clone():i(a.range(-.12,.12),Math.sin(50*Math.PI/180),Math.cos(50*Math.PI/180))).normalize(),z=Math.atan2(te.x,te.z),I=a.range(26,34)*Math.PI/180,W=i(Math.sin(z),0,Math.cos(z)),B=i().crossVectors(T,W).normalize(),b=(e,t,s)=>re(T,W,B,e*Math.PI/180,t,s),v=b(I*180/Math.PI,0),P=X(v),w=i().crossVectors(v,P).normalize(),K=Math.PI-a.range(.2,.5)*a.sign(),$=K>Math.PI?-1:1,S=b(25,K),M=a.range(40,50),A=r+M*a.range(.4,.52),D=i(0,r,0),oe=(e,t,s)=>b(e,t).multiplyScalar(r+s).add(D),pe=v.clone().multiplyScalar(r).add(D),La=S.clone().multiplyScalar(A).add(D),Ce=T.clone().addScaledVector(S,-T.dot(S)).normalize(),Re=b(25,K+$*.4);Re.addScaledVector(S,-Re.dot(S)).addScaledVector(Ce,-Re.dot(Ce)).normalize();const Ra=(e,t,s)=>S.clone().multiplyScalar(r).addScaledVector(Re,e).addScaledVector(Ce,t).normalize().multiplyScalar(r+s).add(D),ue=e=>K+$*e,Ye=e=>$*e,qe=oe(13.5,Ye(1.1),27),Ie=i(pe.x-qe.x,0,pe.z-qe.z).normalize(),be=(e,t)=>pe.clone().addScaledVector(Ie,e).addScaledVector(T,t),ka=(e,t)=>be(e,0).sub(D).normalize().multiplyScalar(r+t).add(D),ce=T.clone().multiplyScalar(.866).addScaledVector(Ie,-.5).normalize(),Je=be(10,-17.32),Qe=(e,t,s)=>Ra((M+t)*Math.cos(e*Math.PI/180),(M+t)*Math.sin(e*Math.PI/180),s),We=Qe(80,9,23),ge=oe(41.5,ue(1.9),21),Be=oe(37,ue(1.66),16.5),Ne=i(-ge.x,0,-ge.z).normalize(),_e=i(Be.x-ge.x,0,Be.z-ge.z);_e.addScaledVector(Ne,-_e.dot(Ne)).normalize();const ae=[ge.clone().addScaledVector(_e,-62*Math.cos(.56)).addScaledVector(Ne,-62*Math.sin(.56)).addScaledVector(T,-2),ge,Be,oe(35,ue(1.42),13.5),oe(34.5,ue(1.2),12),oe(31,ue(.85),12),oe(26,ue(.56),12),Qe(35,14,17),We.clone(),oe(12,Ye(2),29),qe,ka(-100,18),be(-40,31),be(-27.5,30),be(-16,27.71),be(-3,5.2),Je.clone()];if(d.burstU==null){const e=wa(ae),t=i();let s=1;for(;s>.5&&e.pointAt(s,t).distanceTo(pe)<100;)s-=.002;F=s}await u.yield?.();const N=e=>new o.Color(e),O={uSun:{value:te},uSunCol:{value:N(d.sunColor||"#fff6e4")},uShade:{value:N(f[0])},uLeaf:{value:N(f[5])},uWhite:{value:N(f[4])},uWall:{value:i()},uWallX:{value:i()},uWin:{value:i()},uWinX:{value:i()},uTime:{value:0},uEnvWin:{value:1},uWinS:{value:1},uEnvWall:{value:new o.Vector2(1,0)},uLampC:{value:i(0,.5,1)},uLampX:{value:i(1,0,0)},uLampCol:{value:N(d.lampColor||"#ffb060")},uLampK:{value:d.lamps?1:0}};{const e=z+a.sign()*a.range(1.5,2.2);O.uWall.value.set(Math.sin(e)*.97,-.02,Math.cos(e)*.97).normalize(),O.uWallX.value.copy(X(O.uWall.value));const t=z-Math.sign(Math.sin(e-z))*a.range(.55,.85);O.uWin.value.set(Math.sin(t)*.8,.6,Math.cos(t)*.8).normalize(),O.uWinX.value.copy(X(O.uWin.value));const s=z+Math.sign(Math.sin(e-z))*.25;O.uLampC.value.set(Math.sin(s)*.8,.52,Math.cos(s)*.8).normalize(),O.uLampX.value.set(Math.cos(s),0,-Math.sin(s))}const se={uHole:{value:0},uLobe:{value:i(a.range(0,6.28),a.range(0,6.28),a.range(0,6.28))},uP:{value:v},uPx:{value:P},uPy:{value:w}},Ze=Da(f,a),de=[],Y=[],ea=[],Se=i();for(let e=0;e<6;e++){const t=K+$*(.28+e*.2)+a.range(-.03,.03),s=b(31+(e%2?4.5:-3.5)+a.range(-1.5,1.5),t),n=a.range(.075,.125);de.push(new o.Vector4(s.x,s.y,s.z,n)),Y.push((e%2?-1:1)*a.range(9,12)),ea.push(s.clone().multiplyScalar(r).add(i(0,r,0)))}for(let e=0;e<3;e++){const t=b(a.range(55,125),a.range(0,6.28));de.push(new o.Vector4(t.x,t.y,t.z,a.range(.3,.5))),Y.push(a.sign()*a.range(1.6,2.6))}for(let e=0;e<5;e++){const t=e<2?re(v,P,w,a.range(.35,.6),a.range(0,6.28)):b(a.range(20,140),a.range(0,6.28));de.push(new o.Vector4(t.x,t.y,t.z,a.range(.1,.2))),Y.push(a.sign()*a.range(2.6,4.2))}const aa=(e,t)=>{const s=e.clone().sub(D).normalize(),n=T.clone().addScaledVector(s,-T.dot(s)).normalize();return s.multiplyScalar(Math.cos(t/r)).addScaledVector(n,Math.sin(t/r)).normalize()},Va=45,ta=25.5;{const e=aa(ae[2],6),t=aa(ae[3],-ta);de.push(new o.Vector4(e.x,e.y,e.z,Va/r),new o.Vector4(t.x,t.y,t.z,ta/r)),Y.push(0,0)}let oa=null;const ze=[],Oe=[],sa=wa(ae),He=i(),ia=i(),na=i();for(let e=0;e<Fe;e++){if(ze.push(new o.Vector4(0,1,0,-1e3)),e===0){Oe.push({cap:!0});continue}const t=e<12,s={az:a.range(0,6.28),dAz:a.range(-.5,.5),ang:t?a.range(.12,.38):a.range(.3,1.1),born:(t?a.range(-14,12):a.range(-14,8))-V*8,rmax:(t?a.range(14,30):a.range(8,20))*(.75+.5*V)};if(!t&&e<24){const n=.55+(F-.04-.55)*((e-12+s.az/6.28)/12);sa.pointAt(n,He),sa.tangentAt(n,ia);const h=He.clone().sub(D).normalize();na.crossVectors(ia,h).normalize();const c=e%3===0,p=e%3===2,R=(e%2?1:-1)*((c?26:12)+95*Math.abs(s.dAz)+(p?10:0));s.dir=He.clone().addScaledVector(na,R).sub(D).normalize(),s.rmax*=c?1.45:p?.55:.9,s.grow=c?11:8,s.born=n*g-(c?10.5:7)+(s.born+V*8+3)*.22-V*3}else t||(s.born=10+(s.born+V*8+14)*.5-V*2);Oe.push(s)}function Aa(e){const t=F*g,s=40+40*V+(22+26*V)*he(-5,t,e);ze[0].set(v.x,v.y,v.z,s);for(let n=1;n<Fe;n++){const h=Oe[n],c=ee((e-h.born)/(h.grow||14),0,1);if(c<=0){ze[n].w=-1e3;continue}const p=he(h.born,t+2,e);h.dir?Se.copy(h.dir).lerp(v,.3*p).normalize():re(v,P,w,h.ang*(1-.5*p)+.01,h.az+h.dAz*p,Se),ze[n].set(Se.x,Se.y,Se.z,h.rmax*Math.sqrt(c)*(.6+.4*c))}}await u.yield?.();const Fa=i(a.range(0,40),a.range(0,40),a.range(0,40)),Ue=!!d.frost,ke=[],Ve=[];{const e=a.fork?a.fork("ice"):a;for(let t=0;t<12;t++){const s=t<5?b(e.range(20,42),ue(e.range(-.3,2))):t<9?re(v,P,w,e.range(.15,.7),e.range(0,6.28)):b(e.range(4,60),e.range(0,6.28));ke.push(new o.Vector4(s.x,s.y,s.z,0)),Ve.push({born:e.range(-.5,.35),rmax:e.range(34,78)})}}function Ee(e){return Object.assign(o.UniformsUtils.merge([o.UniformsLib.fog]),O,se,{uRamp:{value:Ze},uR:{value:r},uBack:{value:0},uThin:{value:.3},uSpan:{value:5},uNs:{value:3.2},uRot:{value:0},uFlash:{value:0},uGain:{value:1},uClipR:{value:0},uClipC:{value:i()},uShearT:{value:.5},uFlow:{value:i(0,.5,1)},uSeedOff:{value:Fa},uAlpha0:{value:.68},uSpotT:{value:0},uFine:{value:1},uBand:{value:.52},uBandF:{value:96},uSolid:{value:0},uAlphaK:{value:1},uMirK:{value:0},uMirH:{value:0},uMirN:{value:i(0,1,0)},uWob:{value:1/r},uPhase:{value:0},uTimeV:{value:0},uLift:{value:2.2/r},uVort:{value:de},uVortS:{value:Y},uSpot:{value:ze},uIce:{value:ke},uIceRot:{value:0}},e||{})}const Ta=za(ja,Pa),Ca=za($a,Pa);function we(e,t,s=!0){return new o.ShaderMaterial({uniforms:e,vertexShader:Ta,fragmentShader:Ca,defines:s?Ue?{BS_FULL:1,BS_FROST:1}:{BS_FULL:1}:{},side:t?o.BackSide:o.FrontSide,transparent:!0,depthWrite:!1,fog:!0})}const Pe=new o.Group;Pe.name="bubble-skin-hero";const J=new o.Group;J.position.set(0,r,0),Pe.add(J),await u.yield?.();const la=Ma(60);await u.yield?.();const H=Ee(),ra=Object.assign({},H,{uBack:{value:1}}),ua=new o.Mesh(la,we(ra,!0)),Ge=new o.Mesh(la,we(H,!1));for(const e of[ua,Ge])e.scale.setScalar(r),e.frustumCulled=!1,J.add(e);ua.renderOrder=1,Ge.renderOrder=6,await u.yield?.();const ie=S.clone().multiplyScalar(A);let x=null;if(ve>0){const e=[],t=[];for(let l=0;l<me;l++){const Q=re(T,i(1,0,0),i(0,0,1),a.range(.3,2.6),a.range(0,6.28));e.push(new o.Vector4(Q.x,Q.y,Q.z,l<5?a.range(.35,.7):.001)),t.push(l<5?a.sign()*a.range(2.5,4.5):0)}for(let l=me;l<xa;l++)e.push(new o.Vector4(0,1,0,.001)),t.push(0);const s=[];for(let l=0;l<Fe;l++)s.push(new o.Vector4(0,1,0,-1e3));const n=S.clone().lerp(T,.5).normalize(),h=X(n),c=i().crossVectors(n,h),p=Ee({uHole:{value:0},uP:{value:n},uPx:{value:h},uPy:{value:c},uLobe:{value:i()},uR:{value:M},uThin:{value:.55},uSpan:{value:2.3},uNs:{value:2.1},uBandF:{value:34},uBand:{value:.42},uWob:{value:.012},uPhase:{value:1.7},uSeedOff:{value:i(a.range(0,40),a.range(0,40),a.range(0,40))},uShearT:{value:1.4},uFlow:{value:i(0,.5,1)},uRot:{value:0},uLift:{value:0},uGain:{value:1.38},uAlpha0:{value:.72},uFine:{value:.15},uSolid:{value:.93},uClipC:{value:ie.clone().multiplyScalar(-1/M)},uClipR:{value:r/M},uVort:{value:e},uVortS:{value:t},uSpot:{value:s},uIce:{value:ke.map(()=>new o.Vector4(0,1,0,0))}}),R=Object.assign({},p,{uBack:{value:1}}),y=Ma(22),m=new o.Mesh(y,we(R,!0)),C=new o.Mesh(y,we(p,!1)),k=new o.Group;k.position.copy(ie);for(const l of[m,C])l.scale.setScalar(M),l.frustumCulled=!1,k.add(l);m.renderOrder=3,C.renderOrder=4,J.add(k);const j=(A*A+r*r-M*M)/(2*A),_=Object.assign({},p,{uAlphaK:{value:.3},uSolid:{value:0},uAlpha0:{value:.5},uMirK:{value:3.2},uMirH:{value:(j-A)/M},uMirN:{value:S.clone()}}),U=new o.Mesh(y,we(_,!1));{const l=S,Q=new o.Matrix4().set(1-2*l.x*l.x,-2*l.x*l.y,-2*l.x*l.z,2*j*l.x,-2*l.y*l.x,1-2*l.y*l.y,-2*l.y*l.z,2*j*l.y,-2*l.z*l.x,-2*l.z*l.y,1-2*l.z*l.z,2*j*l.z,0,0,0,1);U.matrixAutoUpdate=!1,U.matrix.copy(Q).multiply(new o.Matrix4().makeTranslation(ie.x,ie.y,ie.z)).multiply(new o.Matrix4().makeScale(M,M,M))}U.frustumCulled=!1,U.renderOrder=2.5,J.add(U),x={grp:k,mir:U,mU:_,joinC:S.clone().multiplyScalar(j).add(i(0,r,0)),U:p,colat:Math.acos(ee(S.dot(v),-1,1)),drift:S.clone().lerp(T,.35).normalize(),free:0}}Ge.renderOrder=2,x&&(H.uClipC.value.copy(ie).multiplyScalar(1/r),H.uClipR.value=M/r);const L={uPxK:{value:.003},uTimeV:{value:0},uS:{value:-1},uFlash:{value:0},uR:{value:r}},Me=()=>o.UniformsUtils.merge([o.UniformsLib.fog]),Le=`uniform float uPxK;
float bsPx(float z){ return max(-z, 0.1) * uPxK / max(projectionMatrix[1][1], 0.05); }
`;await u.yield?.();let ne=null;if(x){const e=(A*A+r*r-M*M)/(2*A),t=Math.sqrt(Math.max(1,r*r-e*e)),s=X(S),n=i().crossVectors(S,s),h=192,c=6,p=[],R=[],y=[];for(let k=0;k<=h;k++){const j=k/h*Math.PI*2,_=i().addScaledVector(s,Math.cos(j)).addScaledVector(n,Math.sin(j)),U=S.clone().multiplyScalar(e).addScaledVector(_,t);for(let l=0;l<c;l++){const Q=l/c*Math.PI*2,fe=_.clone().multiplyScalar(Math.cos(Q)).addScaledVector(S,Math.sin(Q));if(p.push(U.x,U.y,U.z),R.push(fe.x,fe.y,fe.z),k<h){const q=k*c+l,E=k*c+(l+1)%c;y.push(q,q+c,E,E,q+c,E+c)}}}const m=new o.BufferGeometry;m.setAttribute("position",new o.Float32BufferAttribute(p,3)),m.setAttribute("normal",new o.Float32BufferAttribute(R,3)),m.setIndex(y);const C=new o.ShaderMaterial({uniforms:Object.assign(Me(),{uPxK:L.uPxK,uTimeV:L.uTimeV,uCol:{value:N(f[4])},uGold:{value:N(f[3])},uMag:{value:N(f[1])},uFade:{value:1},uRc:{value:S.clone().multiplyScalar(e)}}),vertexShader:`#include <fog_pars_vertex>
${Le}
        uniform float uTimeV; uniform vec3 uRc; varying vec3 vN; varying vec3 vV; varying float vA; varying float vF;
        void main(){ vec4 mc = modelViewMatrix * vec4(position, 1.0);
          float r = max(0.4 * (1.0 + 0.25 * sin(position.x * 0.9 + position.z * 0.7 + uTimeV * 1.3)), bsPx(mc.z) * 1.3);
          vec4 mvPosition = modelViewMatrix * vec4(position + normal * r, 1.0);
          vN = normalize(normalMatrix * normal); vV = normalize(-mvPosition.xyz); vA = position.x + position.y * 1.3 + position.z * 0.7;
          // POLISH L2: the far arc of the join, seen through the dome, is faint: the near arc is the line the dome stands on
          vec3 radW = normalize(mat3(modelMatrix) * (position - uRc)), toC = normalize(cameraPosition - (modelMatrix * vec4(position, 1.0)).xyz + vec3(0.0, 1e-4, 0.0));
          vF = mix(0.1, 1.0, smoothstep(-0.3, 0.15, dot(radW, toC))) * mix(1.0, 0.4, smoothstep(70.0, 230.0, -mc.z));
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`#include <fog_pars_fragment>
        uniform vec3 uCol, uGold, uMag; uniform float uFade, uTimeV; varying vec3 vN; varying vec3 vV; varying float vA; varying float vF;
        void main(){ float f = abs(dot(normalize(vN), normalize(vV)));
          vec3 tintc = mix(uGold, uMag, smoothstep(-0.3, 0.6, sin(vA * 0.11 + uTimeV * 0.4)) * 0.6);   // a meniscus line carrying the film's colours
          vec3 c = mix(tintc * 0.9, mix(uCol, tintc, 0.3) * 1.3, 0.35 + 0.65 * f * f) * (0.85 + 0.15 * sin(vA * 0.35));
          float ff = uFade * clamp(vF, 0.0, 1.0);
          gl_FragColor = vec4(c * ff, ff);
          #include <fog_fragment>
        }`,transparent:!0,depthWrite:!1,fog:!0});ne=new o.Mesh(m,C),ne.frustumCulled=!1,ne.renderOrder=5,J.add(ne)}const ca=Object.assign(Me(),se,{uPxK:L.uPxK,uTimeV:L.uTimeV,uFlash:L.uFlash,uR:L.uR,uRimR:{value:1},uGold:{value:N(f[3])}});{const s=[],n=[],h=[];for(let y=0;y<=512;y++)for(let m=0;m<6;m++)if(s.push(y/512*Math.PI*2-Math.PI,m/6*Math.PI*2),h.push(0,0,0),y<512){const C=y*6+m,k=y*6+(m+1)%6;n.push(C,C+6,k,k,C+6,k+6)}const c=new o.BufferGeometry;c.setAttribute("position",new o.Float32BufferAttribute(h,3)),c.setAttribute("aRim",new o.Float32BufferAttribute(s,2)),c.setIndex(n);const p=new o.ShaderMaterial({uniforms:ca,vertexShader:`#include <fog_pars_vertex>
${Le}${Te}
        attribute vec2 aRim; uniform float uTimeV, uR, uRimR; varying vec3 vN; varying vec3 vV; varying float vK;
        void main(){
          float az = aRim.x, th = bsFrontAz(az);
          float live = step(1e-4, uHole) * step(th, 3.3);
          th = min(th, 3.1416);
          vec3 e = uPx * cos(az) + uPy * sin(az);
          vec3 dir = uP * cos(th) + e * sin(th), tng = -uP * sin(th) + e * cos(th);
          float bead = 0.5 + 0.5 * sin(az * 61.0 + uTimeV * 11.0) * sin(az * 23.0 - uTimeV * 5.0);
          float rr = uRimR * (0.65 + 0.9 * bead);
          vec3 c = dir * (uR + rr * 0.4);
          vec4 mc = modelViewMatrix * vec4(c, 1.0);
          rr = max(rr, bsPx(mc.z) * 1.5) * live;
          vec3 n = dir * cos(aRim.y) + tng * sin(aRim.y);
          vec4 mvPosition = modelViewMatrix * vec4(c + n * rr, 1.0);
          vN = normalize(normalMatrix * n); vV = normalize(-mvPosition.xyz); vK = bead;
          gl_Position = live > 0.5 ? projectionMatrix * mvPosition : vec4(2.0, 2.0, 2.0, 1.0);
          #include <fog_vertex>
        }`,fragmentShader:`#include <fog_pars_fragment>
        uniform vec3 uGold; uniform float uFlash; varying vec3 vN; varying vec3 vV; varying float vK;
        void main(){ float f = abs(dot(normalize(vN), normalize(vV)));
          vec3 c = mix(uGold * 1.6, vec3(1.0, 0.96, 0.86) * 3.4, 0.25 + 0.75 * f * f) * (0.8 + 0.6 * vK) * (1.0 + 1.6 * uFlash);
          gl_FragColor = vec4(c, 1.0);
          #include <fog_fragment>
        }`,fog:!0}),R=new o.Mesh(c,p);R.frustumCulled=!1,R.renderOrder=8,J.add(R)}await u.yield?.();const Ke=u.quality?.detail??1;{const n=Math.round(800*Ke),h=n+36,c=new Float32Array(h*3),p=new Float32Array(h*4),R=new Float32Array(h*2),y=i(),m=i(),C=i(),k=i();let j=0,_=v,U=0;oa=q=>{let E=n;for(let G=0;G<2;G++){const Z=de[me+G],pa=Math.sign(Y[me+G])||1,ye=i(Z.x,Z.y,Z.z),ba=X(ye),Ea=i().crossVectors(ye,ba);for(let $e=0;$e<3;$e++){const Xe=Z.w*(.25+($e+q())*1.25/3);re(ye,ba,Ea,Xe,q.range(0,6.28),m);const Ga=pa*.3*Math.exp(-(Xe*Xe)/(Z.w*Z.w))+.02*pa;C.copy(X(m)),k.crossVectors(m,C);for(let ga=0;ga<6;ga++,E++)y.copy(m).addScaledVector(C,q.gauss()*.012).addScaledVector(k,q.gauss()*.012).normalize(),c.set([ye.x,ye.y,ye.z],E*3),p.set([y.x,y.y,y.z,q.range(.45,1.05)],E*4),R.set([Ga*q.range(.92,1.08),q()],E*2)}}for(const G of["aAxis","aBase","aW"])l.attributes[G].needsUpdate=!0};for(let q=0;q<n;q++){if(j<=0){j=a.int(3,9);const E=a.chance(.62)?a.int(0,5+(a.chance(.3)?8:0)):-1;if(E>=0){const G=de[E];_=i(G.x,G.y,G.z);const Z=G.w*a.range(.25,1.5);re(_,X(_),i().crossVectors(_,X(_)),Z,a.range(0,6.28),m),U=Math.sign(Y[E])*.3*Math.exp(-(Z*Z)/(G.w*G.w))+.02*Math.sign(Y[E])}else _=v,re(v,P,w,a.range(.25,1.5),a.range(0,6.28),m),U=.017+a.range(-.008,.012);C.copy(X(m)),k.crossVectors(m,C)}j--,y.copy(m).addScaledVector(C,a.gauss()*.012).addScaledVector(k,a.gauss()*.012).normalize(),c.set([_.x,_.y,_.z],q*3),p.set([y.x,y.y,y.z,a.range(.45,1.05)],q*4),R.set([U*a.range(.92,1.08),a()],q*2)}const l=new o.InstancedBufferGeometry;l.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]),l.setAttribute("aAxis",new o.InstancedBufferAttribute(c,3)),l.setAttribute("aBase",new o.InstancedBufferAttribute(p,4)),l.setAttribute("aW",new o.InstancedBufferAttribute(R,2)),l.instanceCount=h;const Q=new o.ShaderMaterial({uniforms:Object.assign(Me(),se,{uPxK:L.uPxK,uTimeV:L.uTimeV,uR:L.uR,uGold:{value:N(f[3])},uWhite:O.uWhite}),vertexShader:`#include <fog_pars_vertex>
${Le}${Te}
        attribute vec3 aAxis; attribute vec4 aBase; attribute vec2 aW; uniform float uTimeV, uR; varying vec2 vUv; varying float vS;
        void main(){
          float ang = aW.x * uTimeV, c = cos(ang), s = sin(ang);
          vec3 d = aBase.xyz * c + cross(aAxis, aBase.xyz) * s + aAxis * dot(aAxis, aBase.xyz) * (1.0 - c);
          float live = uHole > 0.0 ? step(0.0, bsAhead(d)) : 1.0;
          vec4 mvPosition = modelViewMatrix * vec4(d * (uR + 0.35), 1.0);
          float sz = max(aBase.w, bsPx(mvPosition.z) * 1.15) * live;
          mvPosition.xy += position.xy * sz;
          vUv = position.xy; vS = aW.y;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`#include <fog_pars_fragment>
        uniform vec3 uGold, uWhite; varying vec2 vUv; varying float vS;
        void main(){ float r = length(vUv); if (r > 1.0) discard;
          float core = 1.0 - smoothstep(0.3, 0.42, r);
          float halo = smoothstep(1.0, 0.55, r) * smoothstep(0.35, 0.6, r);
          float glint = 1.0 - smoothstep(0.0, 0.16, length(vUv - vec2(-0.1, 0.12)));
          vec3 c = mix(uGold, uWhite, 0.35 + 0.3 * vS) * (1.1 * core + 0.3 * halo) + uWhite * glint * 1.6;
          gl_FragColor = vec4(c, clamp(core + halo * 0.35, 0.0, 1.0));
          #include <fog_fragment>
        }`,transparent:!0,depthWrite:!1,fog:!0}),fe=new o.Mesh(l,Q);fe.frustumCulled=!1,fe.renderOrder=7,J.add(fe)}await u.yield?.();const da=12,fa=X(ce),qa=i().crossVectors(ce,fa).normalize();{const e=Math.round(3e3*(.5+.5*Ke)),t=new Float32Array(e*4),s=new Float32Array(e*4);for(let p=0;p<e;p++){const R=a.chance(.2),y=R?a.range(15,42):ee(da+a.gauss()*1.4,7.2,19);t.set([a.range(0,6.2832),a.range(1.5,11),y,a.gauss()*(R?4:1.7)+1.5],p*4);const m=a()**3;s.set([.07+1*m*Math.sqrt(m),a(),Math.floor(a.range(0,3.999)),a.range(.6,1.4)],p*4)}const n=new o.InstancedBufferGeometry;n.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]),n.setAttribute("aA",new o.InstancedBufferAttribute(t,4)),n.setAttribute("aB",new o.InstancedBufferAttribute(s,4)),n.instanceCount=e;const h=new o.ShaderMaterial({uniforms:Object.assign(Me(),O,{uP:se.uP,uPx:se.uPx,uPy:se.uPy,uRn:{value:ce},uRx:{value:fa},uRy:{value:qa},uFrost:{value:Ue?1:0},uPxK:L.uPxK,uTimeV:L.uTimeV,uS:L.uS,uR:L.uR,uT0:{value:N(f[3])},uT1:{value:N(f[2])},uT2:{value:N(f[1])}}),vertexShader:`#include <fog_pars_vertex>
${Le}
        attribute vec4 aA, aB; uniform vec3 uP, uPx, uPy, uRn, uRx, uRy; uniform float uTimeV, uS, uR; varying vec2 vUv; varying vec3 vI;
        void main(){
          float s = uS - aB.y * 0.06, live = step(0.0, s); s = max(s, 0.0);
          float k = 1.0 - exp(-5.0 * s);
          float rho = mix(aA.y, aA.z, k) + s * aB.w;
          float h = aA.w * k - 0.22 * s * aB.y + 0.25 * sin(uTimeV * 1.7 + aB.y * 40.0);
          vec3 e = uPx * cos(aA.x) + uPy * sin(aA.x);
          vec3 e2 = uRx * cos(aA.x) + uRy * sin(aA.x);
          float sw = smoothstep(0.05, 1.3, s);                           // the ring swings from the skin's plane to face the dive
          vec3 p = uP * uR + mix(uP * h + e * rho, uRn * h + e2 * rho, sw) + vec3(0.0, -0.035 * s * s, 0.0);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          float sz = max(aB.x * (0.4 + 0.6 * k), bsPx(mvPosition.z) * 1.7) * live;
          float pear = 0.22 * sin(uTimeV * 6.0 + aB.y * 60.0) * exp(-s * 0.25);
          mvPosition.xy += position.xy * sz * vec2(1.0 - pear * 0.5, 1.0 + pear);
          vUv = position.xy; vI = vec3(aB.z, aB.y, clamp(aB.x * 2.0, 0.3, 1.0));
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`precision highp float;
#include <fog_pars_fragment>
${ya}${Sa}
        uniform vec3 uT0, uT1, uT2; uniform float uFrost; varying vec2 vUv; varying vec3 vI;
        void main(){
          float r2 = dot(vUv, vUv); if (r2 > 1.0) discard;
          if (uFrost > 0.5) {                                              // frost: six-armed flakes that glint as they turn
            float rr = sqrt(r2);
            vec2 q = abs(vUv.x) + abs(vUv.y) < 1e-5 ? vec2(1e-5, 0.0) : vUv;
            float th = mod(atan(q.y, q.x) + vI.y * 6.0 + uTime * (vI.y - 0.5), 1.0472) - 0.5236;
            float arm = 1.0 - smoothstep(0.05, 0.11, rr * abs(sin(th)));
            float barb = (1.0 - smoothstep(0.03, 0.08, abs(fract(rr * 4.0) - 0.5) * 0.3 + abs(rr * abs(sin(th)) - 0.12 * (1.0 - rr)))) * 0.6;
            float fa = max(arm, barb) * (1.0 - smoothstep(0.8, 1.0, rr)) + (1.0 - smoothstep(0.0, 0.2, rr));
            float gl = 0.5 + 2.6 * pow(abs(sin(uTime * 1.3 + vI.y * 40.0)), 12.0);
            gl_FragColor = vec4(mix(uWhite, uSunCol, 0.4) * gl * 1.2, clamp(fa, 0.0, 1.0));
            return;
          }
          vec3 n = vec3(vUv, sqrt(max(1.0 - r2, 0.0)));
          vec3 dv = normalize(vec3(-vUv * 1.25, -0.55));                    // a lens: the garden upside down
          vec3 dw = normalize(dv * mat3(viewMatrix));
          vec3 tint = mix(vec3(1.0), vI.x < 0.5 ? uT0 : (vI.x < 1.5 ? uT1 : (vI.x < 2.5 ? uT2 : vec3(1.0))), 0.62);
          vec3 c = (bsEnv(dw) * 1.0 + uWhite * 0.06) * tint;
          float edge = smoothstep(0.55, 1.0, r2);
          c += uWhite * 0.22 * edge * tint;
          vec3 sv = normalize(mat3(viewMatrix) * uSun + vec3(0.0, 0.0, 1.0));
          float sp = pow(max(dot(n, sv), 0.0), 160.0);
          c += uSunCol * sp * (7.0 + 7.0 * vI.z);
          float cau = 1.0 - smoothstep(0.0, 0.2, length(vUv + sv.xy * 0.55));    // caustic opposite the spark
          c += uSunCol * cau * 0.6 * tint;
          float a = smoothstep(1.0, 0.86, r2) * clamp(0.3 + 0.6 * edge + sp + cau, 0.0, 1.0);
          gl_FragColor = vec4(c, a);
          #include <fog_fragment>
        }`,transparent:!0,depthWrite:!1,fog:!0}),c=new o.Mesh(n,h);c.frustumCulled=!1,c.renderOrder=10,J.add(c)}await u.yield?.();const De=(d.rimSpeed??220)/r;{const e=Math.round(3600*Ke),t=new Float32Array(e*4);for(let c=0;c<e;c++)t.set([a.range(-Math.PI,Math.PI),Math.acos(ee(1-1.9*a()**2.2,-1,1)),a(),a.range(.25,.8)],c*4);const s=new o.BufferGeometry;s.setAttribute("position",new o.Float32BufferAttribute(new Float32Array(e*3),3)),s.setAttribute("aM",new o.Float32BufferAttribute(t,4));const n=new o.ShaderMaterial({uniforms:Object.assign(Me(),se,{uPxK:L.uPxK,uTimeV:L.uTimeV,uR:L.uR,uRate:{value:De},uCol:{value:N(f[4])},uGold:{value:N(f[3])}}),vertexShader:`#include <fog_pars_vertex>
${Le}${Te}
        attribute vec4 aM; uniform float uTimeV, uR, uRate; varying float vA; varying float vG;
        void main(){
          float az = aM.x, l = bsFrontAz(az) / max(uHole, 1e-4);
          float ts = (uHole * l - aM.y) / max(uRate * l, 1e-4);              // seconds since the rim passed here
          float live = step(1e-4, uHole) * step(0.0, ts); ts = max(ts, 0.0);
          vec3 e = uPx * cos(az) + uPy * sin(az);
          vec3 dir = uP * cos(aM.y) + e * sin(aM.y), tng = -uP * sin(aM.y) + e * cos(aM.y);
          float k = 1.0 - exp(-2.2 * ts);
          vec3 p = dir * (uR + (aM.z - 0.3) * 9.0 * k) + tng * (5.0 + 16.0 * aM.z) * k
                 + vec3(sin(aM.z * 50.0 + uTimeV * 0.7), -0.6 * ts - 0.5 * ts * ts * (0.4 + aM.z), cos(aM.z * 31.0 + uTimeV * 0.6)) * (0.5 + ts * 0.4);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          vA = live * smoothstep(0.0, 0.08, ts) * (1.0 - smoothstep(3.5, 8.5 + 4.0 * aM.z, ts));
          vG = aM.z;
          gl_PointSize = clamp(aM.w * 0.7 * (1.0 + 0.5 * ts) / bsPx(mvPosition.z), 1.5, max(2.0, 0.015 / uPxK)) * step(0.001, vA);   // POLISH L2: the cap follows the picture's height (8 px was a veil on a small screen)
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`#include <fog_pars_fragment>
        uniform vec3 uCol, uGold; varying float vA; varying float vG;
        void main(){ vec2 q = gl_PointCoord * 2.0 - 1.0; float r = dot(q, q); if (r > 1.0 || vA < 0.002) discard;
          float f = (1.0 - r); vec3 c = mix(uCol, uGold, vG * 0.5) * (0.3 + 1.4 * f * f);
          gl_FragColor = vec4(c * vA, 1.0);
          #include <fog_fragment>
        }`,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,fog:!0}),h=new o.Points(s,n);h.frustumCulled=!1,h.renderOrder=9,J.add(h)}await u.yield?.();const je=[H,ra];x&&je.push(x.U);let Ae=d.progress??.6,ha=-1,xe=0;const Ia=x?Math.max(0,x.colat-.14):0;function ma(){ha=Ae;const e=Ae,t=e*g,s=(e-F)*g;if(H.uThin.value=.5-.2*V-.3*e,H.uSpan.value=4.5-1.3*V-.5*e,Aa(t),H.uSpotT.value=t,Ue)for(let n=0;n<12;n++)ke[n].w=Ve[n].rmax*he(Ve[n].born,Ve[n].born+.55,e);if(xe=s>0?De*s:0,se.uHole.value=xe,L.uS.value=s,L.uFlash.value=s>0?he(0,.1,s)*Math.exp(-Math.max(0,s-.1)/.3):0,H.uFlash.value=L.uFlash.value,ca.uRimR.value=.8+2.2*Math.sqrt(ee(xe/Math.PI,0,1)),x){const n=xe>0?(xe-Ia)/De:-1;if(x.free=n,n>0){const h=1-Math.exp(-n*.7);x.grp.position.copy(ie).addScaledVector(x.drift,26*h+3.5*n).addScaledVector(B,9*h),x.U.uClipR.value=0,H.uClipR.value=0,x.mir.visible=!1,x.U.uWob.value=.012+.1*Math.exp(-n*.9),ne.material.uniforms.uFade.value=1-he(0,.12,n)}else x.grp.position.copy(ie),x.U.uClipR.value=r/M,H.uClipR.value=M/r,x.mir.visible=!0,x.U.uWob.value=.012,ne.material.uniforms.uFade.value=1;ne.visible=ne.material.uniforms.uFade.value>.001}}ma();{const e=a.fork?a.fork("entry-swirls"):a,t=e.sign();Y[me]=t*e.range(6.5,8.5),Y[me+1]=-t*e.range(7.5,9.5),oa(e)}const Wa=18,va=new o.Vector2,le=i();function Ba(e,t,s){ha!==Ae&&ma(),O.uTime.value=t,L.uTimeV.value=t;const n=t/Wa%1,h=(n+.5)%1,c=1-Math.abs(2*n-1);for(const p of je)p.uTimeV.value=t;if(H.uFlow.value.set(n,h,c),H.uRot.value=t*.016,H.uIceRot.value=t*.012,x){const R=(t/11+.3)%1,y=(R+.5)%1;x.U.uFlow.value.set(R,y,1-Math.abs(2*R-1)),x.U.uRot.value=-t*.07,x.free<=0&&x.grp.rotation.set(Math.sin(t*.8)*.012,0,Math.cos(t*.63)*.012),s.getWorldPosition(le),Pe.worldToLocal(le),le.sub(x.joinC);const m=le.length(),C=m>.001?Math.abs(le.dot(S))/m:1;x.mU.uAlphaK.value=(.05+.3*(1-C)*(1-C))*(1-he(95,170,m))}u.renderer&&(u.renderer.getDrawingBufferSize(va),L.uPxK.value=2/Math.max(64,va.y)),s.getWorldPosition(le),Pe.worldToLocal(le),O.uEnvWin.value=he(13.6,15.4,le.distanceTo(D)-r)}const Na={bubbleCenter:D.clone(),pole:pe,poleNormal:v.clone(),portalSeat:{position:Je,normal:ce.clone(),facing:ce.clone()},ringCenter:pe.clone().addScaledVector(ce,1.5),ringRadius:da,ringNormal:ce.clone(),satDir:S.clone(),satSide:$,satAz:K,sunAz:z,heading:Ie.clone(),satellite:x?{center:La,radius:M,flank:We}:null,vortexStreet:ea,flyThrough:ae,viewpoints:{entry:ae[0],closePass:We,overTop:ae[9],blackCountry:ae[11],crest:ae[13]},sunDir:te.clone()};function _a(e={}){const t=Ee({uHole:{value:0},uThin:{value:e.thin??.5},uSpan:{value:e.span??3.5},uNs:{value:e.ns??2.4},uWob:{value:.01},uPhase:{value:e.phase??0},uLift:{value:0},uClipR:{value:0},uFlow:{value:i(.3,.8,.6)},uShearT:{value:0},uBandF:{value:e.bandF??26},uBand:{value:.4},uSeedOff:{value:i(e.phase??0,3.1,7.7)},uP:{value:i(0,1,0)},uPx:{value:i(1,0,0)},uPy:{value:i(0,0,1)},uLobe:{value:i()}});return je.push(t),we(t,!1,!1)}const Oa=r,Ha=2*r,Ua=D.clone();return{object:Pe,radius:Oa,height:Ha,center:Ua,anchors:Na,update:Ba,setProgress(e){Ae=ee(e,0,1.2)},holeAngle:()=>xe,burstU:F,duration:g,makeMoonMaterial:_a,env:O,R:r,dispose(){Ze.dispose()},ground:!1,groundY:0}}export{Sa as ENV_GLSL,ya as NOISE_GLSL,Ja as buildHero,Ma as makeSphereGeo};
