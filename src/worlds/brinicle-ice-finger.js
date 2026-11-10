import*as o from"three";import{makePath as N0,clamp as _e,lerp as ge,smoothstep as J}from"../kit/core.js";import*as Ce from"../kit/fx.js";import*as $t from"../kit/fauna.js";import{buildHero as R0}from"../parts/brinicle-ice-finger.js";const Pe=0,Ie=-64,Z=-128,Xt=42,V0=Math.tan(18*Math.PI/180),D0=620,qe=600,v0=590,je={x0:-700,z0:320,w:1400,d:1500},ne=a=>new o.Color(a),E0=.09,d0=Ce.GLSL_HASH+Ce.GLSL_VALUE_NOISE+Ce.GLSL_FBM+Ce.GLSL_VORONOI,nt=`
uniform vec4 uPaneA[8];    // centre x, centre z, half x, half z
uniform vec4 uPaneB[8];    // brightness, drift phase, 0, 0
uniform vec3 uKeyDir;      // toward the light
uniform float uTime;
float paneMask(vec2 xz, float soft){
  float m = 0.0;
  for (int i = 0; i < 8; i++){
    vec2 d = abs(xz - uPaneA[i].xy) - uPaneA[i].zw;
    float sd = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    float k = uPaneB[i].x*(0.80 + 0.20*sin(uTime*0.13 + uPaneB[i].y));
    m = max(m, k*(1.0 - smoothstep(-soft, soft*0.6, sd)));
  }
  return m;
}
float poolAt(vec3 w){
  float t = max(-w.y, 0.0)/max(uKeyDir.y, 0.25);
  return paneMask(w.xz + uKeyDir.xz*t, 9.0 + 0.10*t);
}
`,H0=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix*viewMatrix*vec4(position + cameraPosition, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,h0=`
uniform vec3 uFogCol; uniform vec3 uDeep; uniform vec3 uGlow; uniform vec3 uRayC; uniform float uDeepK;
vec3 domeColor(vec3 d, vec3 kdir, float time){
  vec3 col = mix(uFogCol, uDeep, smoothstep(0.0, -0.6, d.y));
  vec2 h = d.xz/max(length(d.xz), 1e-4), kd = kdir.xz/max(length(kdir.xz), 1e-4);
  float side = 0.5 + 0.5*dot(h, kd);
  col += uGlow*(0.15 + 0.85*side*side)*smoothstep(-0.15, 0.5, d.y);
  vec3 e1 = normalize(cross(kdir, vec3(0.0, 0.0, 1.0)) + vec3(1e-5, 0.0, 0.0)), e2 = cross(kdir, e1);
  vec2 q = vec2(dot(d, e1), dot(d, e2)); q /= max(length(q), 1e-3);
  float s1 = vnoise(q*2.6 + vec2(time*0.05, 3.0)), s2 = vnoise(q*7.5 + vec2(11.0, -time*0.11));
  float streak = smoothstep(0.30, 0.85, s1*0.72 + s2*0.45);
  float band = smoothstep(-0.50, -0.03, d.y)*(1.0 - 0.55*smoothstep(0.05, 0.5, d.y));
  float toward = 0.30 + 0.70*smoothstep(-0.55, 0.65, dot(d, kdir));
  col += uRayC*uDeepK*band*toward*(0.34 + 1.0*streak);
  return col;
}
`,O0=`
uniform vec3 uKeyDir; uniform float uTime;
varying vec3 vDir;
${Ce.GLSL_HASH}
${Ce.GLSL_VALUE_NOISE}
${h0}
void main(){
  vec3 d = normalize(vDir + vec3(0.0, 1e-5, 0.0));
  gl_FragColor = vec4(domeColor(d, uKeyDir, uTime), 1.0);
}`,W0=`
varying vec3 vW;
void main(){
  vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,q0=`
uniform sampler2D uCeilMap; uniform vec4 uCeilRect;
uniform vec3 uSnow; uniform vec3 uPane; uniform vec3 uCoreC; uniform vec3 uOchre; uniform vec3 uCrackC;
uniform vec4 uHoleA; uniform vec4 uHoleB;
uniform float uTide; uniform float uTideX; uniform float uShag; uniform float uAlgae; uniform float uCrackI; uniform float uFogD; uniform float uCeilI;
varying vec3 vW;
${d0}
${nt}
${h0}
void main(){
  vec2 xz = vW.xz;
  float dist = length(cameraPosition - vW);
  float fineK = 1.0 - smoothstep(50.0, 240.0, dist), midK = 1.0 - smoothstep(260.0, 620.0, dist);
  vec2 wp = vec2(fbmLo(xz*0.021), fbmLo(xz*0.021 + 17.3)) - 0.5;
  vec4 cm = texture2D(uCeilMap, vec2((xz.x - uCeilRect.x)*uCeilRect.z, (uCeilRect.y - xz.y)*uCeilRect.w));
  float pane = paneMask(xz + wp*30.0, 5.0);
  float n1 = mix(0.5, vnoise(xz*0.19), midK), n2 = vnoise(xz*0.83 + 5.0), n3 = vnoise(xz*2.9 + 1.7);
  float plate = mix(0.5, n2*0.55 + n3*0.45, fineK);
  // snow lying on top, drifting slowly: dim teal under it, jade where the wind has scoured it away
  float snow = clamp(cm.g + (n1 - 0.5)*0.3 + 0.12*sin(uTime*0.07 + xz.x*0.013 + xz.y*0.007), 0.0, 1.0);
  float T = 0.08 + 0.24*(1.0 - snow);
  T = mix(T, 1.0, pane*(0.74 + 0.26*n1));
  // refrozen cracks: two webs, antialiased from their own screen-space width
  vec3 v1 = voronoi(xz*0.0165 + wp*0.55); vec3 v2 = voronoi(xz*0.052 + wp*0.9 + 9.0);
  float aa1 = fwidth(v1.y) + 0.003, aa2 = fwidth(v2.y) + 0.005;
  float crack = (1.0 - smoothstep(0.0065, 0.0065 + aa1*1.6, v1.y))*clamp(0.045/aa1, 0.2, 1.0) + 0.4*(1.0 - smoothstep(0.012, 0.012 + aa2*1.6, v2.y))*fineK;
  float halo = exp(-v1.y*20.0);
  float flick = 0.78 + 0.22*sin(uTime*1.3 + v1.z*40.0);
  float tx = xz.x - (uTideX + 11.0*sin(xz.y*0.011) + 4.0*sin(xz.y*0.037 + 1.0));
  float aat = fwidth(tx) + 0.02;
  float tide = uTide*(1.0 - smoothstep(1.1, 1.1 + aat*1.6, abs(tx)));
  float tideHalo = uTide*exp(-abs(tx)*0.11);
  float alg = smoothstep(0.40, 0.68, cm.r + (n1 - 0.5)*0.3 + (n2 - 0.5)*0.22*fineK)*uAlgae;
  vec3 col = mix(uSnow*(0.35 + 2.2*T), uPane, smoothstep(0.34, 1.0, T));
  col *= 0.60 + 0.80*plate;
  col *= 1.0 - uShag*0.5*cm.b*(1.0 - 0.6*plate);
  col += uCoreC*smoothstep(0.70, 1.0, pane)*(0.30 + 0.45*n2);
  col = mix(col, (col*2.2 + 0.04)*uOchre, min(alg*0.78, 1.0));
  float farK = uDeepK*smoothstep(240.0, 560.0, dist);
  col += uCrackC*uCrackI*(crack*flick + halo*0.30)*(1.0 - 0.72*farK) + uCrackC*(tide*1.5 + tideHalo*0.45);
  // seen from deep on the chase the ceiling is 500-1500 m off: the fine web is below a pixel there, so wide refrozen
  // leads and wind-scoured fields (brightest on the key side) carry its glow
  vec3 v3 = voronoi(xz*0.0043 + wp*0.22 + 3.7);
  float aa3 = fwidth(v3.y) + 0.004;
  float lead = (1.0 - smoothstep(0.016, 0.016 + aa3*1.5, v3.y))*clamp(0.09/aa3, 0.3, 1.0);
  float field = smoothstep(0.50, 0.74, fbmLo(xz*0.0029 + 4.0));
  float keySide = 0.55 + 0.45*clamp(-(xz.x - cameraPosition.x)*uKeyDir.x*0.004 + 0.5, 0.0, 1.0);
  col += farK*(uCrackC*uCrackI*(lead*1.0 + exp(-v3.y*7.0)*0.30) + (uPane*0.52 + uCoreC*0.08)*field*keySide*(0.75 + 0.5*cm.b));
  float dA = length(xz - uHoleA.xy), dB = length(xz - uHoleB.xy);
  float hA = 1.0 - smoothstep(uHoleA.z - 0.4, uHoleA.z + 0.4 + fwidth(dA), dA);
  col = mix(col, uCoreC*uHoleA.w + uPane*0.4, hA) + uCoreC*0.5*exp(-dA*dA/(uHoleA.z*uHoleA.z*9.0));
  float qB = dB/uHoleB.z; col += (uPane + uCoreC*0.6)*uHoleB.w*exp(-qB*qB*1.4);
  col *= uCeilI;
  // light carries through the haze further than solid things do, and from the deep the whole ceiling is far away
  float fd = dist*uFogD*mix(0.6, 0.27, uDeepK);
  vec3 far = domeColor(normalize(vW - cameraPosition + vec3(0.0, 1e-4, 0.0)), uKeyDir, uTime) + uFogCol*0.2*(1.0 - uDeepK);
  gl_FragColor = vec4(mix(col, far, 1.0 - exp(-fd*fd)), 1.0);
}`,j0=`
attribute float aEdge;
varying vec3 vW; varying vec3 vN; varying float vEdge;
#include <fog_pars_vertex>
void main(){
  vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz; vN = normal; vEdge = aEdge;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,U0=`
uniform vec3 uBedA; uniform vec3 uBedB; uniform vec3 uShell; uniform vec3 uKeyCol; uniform vec3 uFillCol; uniform vec3 uCore;
uniform float uFront; uniform vec3 uHero;
varying vec3 vW; varying vec3 vN; varying float vEdge;
#include <fog_pars_fragment>
${d0}
${nt}
void main(){
  vec2 xz = vW.xz;
  float dist = length(cameraPosition - vW);
  float nearK = 1.0 - smoothstep(22.0, 100.0, dist), midK = 1.0 - smoothstep(80.0, 300.0, dist);
  float g1 = vnoise(xz*0.9), g2 = vnoise(xz*3.7 + 3.1), g3 = vnoise(xz*11.0 + 7.7), big = fbmLo(xz*0.045 + 2.0);
  // gravel ripples lying across the slope, shell hash gathered into pale drifts between them
  float ph = xz.y*1.3 + big*9.0 + g1*1.7 + xz.x*0.21;
  float rp = sin(ph)*midK;
  float drift = smoothstep(0.50, 0.70, fbmLo(vec2(xz.x*0.035, xz.y*0.085) + 11.0) + 0.10*rp);
  float speck = smoothstep(0.55, 0.85, g2)*0.55 + smoothstep(0.62, 0.92, g3)*0.85*nearK;
  vec3 alb = mix(uBedA, uBedB, clamp(big*1.3 - 0.15, 0.0, 1.0))*(0.50 + 0.55*g1 + 0.55*g2*midK + 0.5*g3*nearK);
  alb *= 0.78 + 0.22*rp;
  alb = mix(alb, uShell*(0.30 + 0.70*mix(0.45, speck, max(midK, 0.25))), drift*(0.30 + 0.70*mix(0.5, speck, midK)));
  alb += uShell*0.55*smoothstep(0.84, 0.96, g3)*smoothstep(0.45, 0.8, g2)*nearK;
  vec3 N = normalize(vN + vec3((g2 - 0.5)*0.55*nearK, 0.0, -0.32*cos(ph)*midK + (g3 - 0.5)*0.55*nearK));
  float ndl = clamp(dot(N, uKeyDir), 0.0, 1.0);
  float wob = 0.55 + 0.45*smoothstep(0.25, 0.75, vnoise(xz*0.035 + vec2(uTime*0.05, uTime*0.021)));
  float pool = poolAt(vW)*wob;
  vec3 col = alb*(uFillCol*(0.8 + 0.3*N.y) + uKeyCol*ndl*(0.10 + 1.7*pool));
  col += uKeyCol*pool*g3*g3*g3*g3*0.10*nearK;
  // the frost front throws its own cyan light a few metres ahead of itself
  float dH = length(xz - uHero.xz);
  col += uCore*alb*(2.0*exp(-abs(dH - uFront + 6.0)*0.09) + 2.6*exp(-abs(dH - uFront + 5.0)*0.22))*step(0.5, uFront)*smoothstep(260.0, 60.0, dist);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, vEdge);
}`,L0=`
attribute vec4 iA;     // x, y, z, size
attribute vec4 iB;     // yaw, seed, arrive (m of front), caught flag
attribute vec4 iC;     // flee x, flee z, bed dy/dx, bed dy/dz
attribute vec4 iT;     // tint rgb, kind (0 star, 1 urchin)
attribute vec4 aArm;   // t along the arm, arm azimuth, v across, pale
uniform float uFront;
varying vec3 vN; varying vec3 vW; varying vec3 vTint; varying vec4 vArm; varying vec3 vK; varying float vPool;
#include <fog_pars_vertex>
${nt}
void main(){
  float seed = iB.y, kind = iT.w;
  float st = uTime*5.0 + seed*37.0, sa = st - 0.6;
  float stp = floor(st) + smoothstep(0.0, 0.5, fract(st));
  float stpA = floor(sa) + smoothstep(0.0, 0.5, fract(sa));
  float k = uFront - iB.z;
  float W = clamp(iB.z - 2.0, 6.0, 30.0);
  float caught = step(0.5, iB.w)*smoothstep(0.0, 14.0, k);
  float live = 1.0 - caught;
  float alarm = smoothstep(-W, -W*0.25, k)*(1.0 - smoothstep(0.0, 8.0, k))*(1.0 - kind);
  vec3 p = position; vec3 n = normal;
  float t = aArm.x, t2 = t*t;
  vec2 ad = vec2(cos(aArm.y), sin(aArm.y)), lat = vec2(-ad.y, ad.x);
  p.xz += lat*(0.20*t2*sin(stpA*0.55 + aArm.y*3.0 + seed*20.0)*live);
  p.y += t2*(0.10*max(sin(stpA*0.4 + aArm.y*2.0 + seed*9.0), 0.0)*live + 0.40*caught*(1.0 - kind) + 0.38*alarm*step(3.5, aArm.y)*live);
  p.xz -= ad*(0.20*t2*caught*(1.0 - kind));
  float cy = cos(iB.x), sy = sin(iB.x);
  vec3 q = vec3(p.x*cy - p.z*sy, p.y, p.x*sy + p.z*cy)*iA.w;
  n = vec3(n.x*cy - n.z*sy, n.y, n.x*sy + n.z*cy);
  float R = mix(1.2 + 2.2*fract(seed*7.31), 0.12, max(step(0.5, iB.w), kind*0.8));
  float th0 = seed*6.283, th = th0 + stp*0.045;
  vec2 off = R*(vec2(cos(th), sin(th)) - vec2(cos(th0), sin(th0)));
  float fl = clamp((k + W)/(W - 4.0), 0.0, 1.0);
  float fq = min((floor(fl*4.0) + smoothstep(0.0, 0.6, fract(fl*4.0)))*0.25, 1.0);
  off += iC.xy*fq;
  vec3 wpos = iA.xyz + q + vec3(off.x, 0.0, off.y);
  wpos.y += dot(iC.zw, q.xz + off);
  n.xz -= iC.zw*n.y;
  vN = n; vW = wpos; vTint = iT.rgb; vArm = aArm; vK = vec3(caught, k, kind);
  vPool = poolAt(wpos);
  vec4 mvPosition = viewMatrix*vec4(wpos, 1.0);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,$0=`
uniform vec3 uKeyDir; uniform vec3 uKeyCol; uniform vec3 uFillCol; uniform vec3 uCore; uniform vec3 uPale; uniform vec3 uFrostAlb; uniform float uAccent;
varying vec3 vN; varying vec3 vW; varying vec3 vTint; varying vec4 vArm; varying vec3 vK; varying float vPool;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
  float back = gl_FrontFacing ? 0.0 : 1.0;
  N = mix(N, -N, back);
  float t = vArm.x, v = vArm.z, caught = vK.x, kind = vK.z;
  // rows of pale spine beads along the ridge and both flanks; they fade out before they could alias
  float fw = fwidth(t*10.0);
  float lod = (1.0 - smoothstep(0.2, 0.6, fw))*(1.0 - kind);
  float row = abs(v) < 0.3 ? v : abs(v) - 0.62;
  float bead = (1.0 - smoothstep(0.10, 0.30, length(vec2(fract(t*10.0) - 0.5, row*1.7))))*lod*step(0.06, t);
  vec3 alb = mix(vTint, uPale, max(max(vArm.w, bead*0.7), back*0.55));
  alb *= 0.78 + 0.34*(1.0 - abs(v))*(1.0 - kind);
  alb = mix(alb, uFrostAlb, caught*0.92);
  float ndl = clamp(dot(N, uKeyDir), 0.0, 1.0);
  vec3 light = uFillCol*(0.9 + 0.4*N.y) + uKeyCol*ndl*(0.22 + 1.5*vPool);
  // keep the one warm accent warm under jade light: light the living animal mostly by luminance
  float lum = dot(light, vec3(0.3, 0.5, 0.2));
  vec3 L = mix(light, vec3(lum*1.7), 0.8*(1.0 - caught));
  vec3 col = alb*L + alb*uAccent*(1.0 - caught)*(0.6 + 0.4*N.y);
  col += uCore*caught*(0.05 + 0.9*exp(-max(vK.y, 0.0)/9.0));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,X0=`
attribute vec4 aAnim; attribute float aArr; attribute vec3 aTip;
uniform float uFront;
varying vec3 vN; varying vec3 vW; varying vec3 vCol; varying vec3 vO; varying vec2 vK; varying float vPool; varying vec2 vF;
#include <fog_pars_vertex>
${nt}
void main(){
  vec3 p = position;
  float ty = aAnim.x, amp = aAnim.y, ph = aAnim.z, t = aAnim.w;
  float k = uFront - aArr;
  float frozen = smoothstep(0.0, 9.0, k), live = 1.0 - frozen;
  if (ty > 0.5 && ty < 1.5) {
    p.x += amp*t*t*sin(uTime*0.9 + ph + p.y*0.3)*live; p.z += amp*t*t*cos(uTime*0.7 + ph*1.3)*live;
  } else if (ty > 1.5 && ty < 2.5) {
    p.x += amp*sin(t*9.0 + uTime*1.1 + ph); p.y += amp*0.35*(1.0 + sin(t*7.0 - uTime*0.8 + ph)); p.z += amp*cos(t*8.0 + uTime*0.9 + ph*2.0);
  } else if (ty > 2.5 && ty < 3.5) {
    float s = uTime*3.0 + ph*10.0, sp = (floor(s) + smoothstep(0.0, 0.5, fract(s)))/3.0;
    float tri = abs(fract(sp*0.03 + ph)*2.0 - 1.0) - 0.5;
    p.x += cos(t)*amp*tri; p.z += sin(t)*amp*tri;
  } else if (ty > 3.5 && ty < 4.5) {
    float g = clamp(k/10.0, 0.0, 1.0);
    p += aTip*(g*g*(3.0 - 2.0*g)*(1.0 + 0.5*sin(g*3.1416)*(1.0 - g)));
  } else if (ty > 4.5 && ty < 5.5) {
    p.y += amp*abs(t)*sin(uTime*7.0 + ph) + 0.35*sin(uTime*0.6 + ph); p.x += 0.5*sin(uTime*0.23 + ph*2.0);
  } else if (ty > 5.5) {
    p.x += amp*sin(uTime*2.3 + ph - t*5.5)*smoothstep(0.3, -0.5, t);
  }
  vec4 w = modelMatrix*vec4(p, 1.0);
  vW = w.xyz; vO = position; vN = mat3(modelMatrix)*normal; vCol = color; vK = vec2(frozen, k);
  vF = (ty > 3.5 && ty < 4.5) ? vec2(0.0) : aTip.xy;
  vPool = poolAt(w.xyz);
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Y0=`
uniform vec3 uKeyDir; uniform vec3 uKeyCol; uniform vec3 uFillCol; uniform vec3 uCore; uniform vec3 uFrostAlb;
uniform float uUnder; uniform float uFuzz; uniform float uGrey; uniform float uMottle; uniform float uFront; uniform vec3 uHero;
varying vec3 vN; varying vec3 vW; varying vec3 vCol; varying vec3 vO; varying vec2 vK; varying float vPool; varying vec2 vF;
#include <fog_pars_fragment>
${Ce.GLSL_HASH}
${Ce.GLSL_VALUE_NOISE}
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
  if (!gl_FrontFacing) N = -N;
  // rock is faceted: its light comes off the flat of each face, not a smoothed blob
  N = normalize(mix(N, normalize(cross(dFdx(vW), dFdy(vW)) + vec3(0.0, 1e-6, 0.0)), 0.85*vF.y));
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float mot = 0.78 + 0.44*vnoise(vO*1.3);
  vec3 alb = vCol*mot;
  // the seal's coat: dark blotches and pale flecks, at a scale vertex colours cannot carry
  float blotch = smoothstep(0.50, 0.74, vnoise(vO*vec3(1.7, 1.7, 1.1) + 3.0))*(1.0 - 0.6*smoothstep(0.38, 0.55, vCol.g)), fleck = smoothstep(0.64, 0.80, vnoise(vO*3.1 + 11.0));
  alb = mix(alb, alb*0.42, blotch*uMottle); alb = mix(alb, vec3(0.52, 0.53, 0.51), fleck*0.45*uMottle);
  // pores and pits (sponges, rock): two scales of dark dots, faded out before they could shimmer
  float detK = 1.0 - smoothstep(26.0, 80.0, length(cameraPosition - vW));
  float pore = smoothstep(0.50, 0.70, vnoise(vO*4.3 + 7.0))*0.65 + smoothstep(0.58, 0.78, vnoise(vO*10.5 + 3.0))*0.45;
  alb *= 1.0 - vF.x*0.66*min(pore, 1.0)*detK;
  // frost: a full coat on soft things; on rock it settles in patches and on the ledges, and the stone shows through
  float rimeK = 0.82*smoothstep(0.50, 0.78, 0.6*vnoise(vO*0.7 + 20.0) + 0.5*N.y);
  alb = mix(alb, uFrostAlb, vK.x*mix(0.9, rimeK, vF.y));
  float d = dot(N, uKeyDir), ndl = clamp(d, 0.0, 1.0)*0.8 + (0.5 + 0.5*d)*0.2;
  vec3 light = uFillCol*(0.9 + 0.35*N.y) + uKeyCol*ndl*(0.25 + 1.4*vPool);
  light = mix(light, vec3(dot(light, vec3(0.3, 0.5, 0.2))*1.25), uGrey);
  vec3 col = alb*light;
  float rim = 1.0 - ndv; rim *= rim;
  col += alb*(uKeyCol*0.5 + uFillCol)*rim*uFuzz;
  // undersides are lit from the bed, most of all where the lit edge of the frost is passing beneath
  float edgeL = step(0.5, uFront)*exp(-abs(length(vW.xz - uHero.xz) - uFront + 8.0)*0.05);
  col += uCore*alb*max(-N.y + 0.12*edgeL, 0.0)*uUnder*(1.0 + 2.4*edgeL);
  col += uCore*step(0.0, vK.y)*(0.9*exp(-max(vK.y, 0.0)/8.0) + 0.04*vK.x)*(1.0 - 0.8*vF.y);   // rock takes the frost's light only faintly
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Z0=`
attribute vec3 aK;     // 0 root .. 1 tip, seed, 1 for the giants of the chase
uniform float uGiant;
varying vec3 vN; varying vec3 vW; varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  vec3 p = position; p.y *= mix(1.0, mix(0.1, 1.0, uGiant), aK.z);
  vec4 w = modelMatrix*vec4(p, 1.0); vW = w.xyz; vN = normal; vK = aK;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Q0=`
uniform vec3 uKeyDir; uniform vec3 uKeyCol; uniform vec3 uFillCol; uniform vec3 uCore; uniform vec3 uIce; uniform vec3 uShade;
uniform float uTime; uniform float uCoreI;
varying vec3 vN; varying vec3 vW; varying vec3 vK;
#include <fog_pars_fragment>
${Ce.GLSL_HASH}
${Ce.GLSL_VALUE_NOISE}
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float bs = mix(1.0, 0.45 + 0.8*fract(vK.y*7.3), vK.z);
  float bands = vnoise(vec3(vW.x*0.5, vW.y*1.3*bs + vK.y*40.0*vK.z, vW.z*0.5));
  float st = vnoise(vec2(vK.y*31.0, vW.y*0.5 + uTime*1.5));
  vec3 alb = mix(uShade*0.4, uIce*0.7, 0.3 + 0.55*bands);
  alb = mix(alb, uIce*(0.50 + 0.22*bands), 0.42*vK.z);   // the giants are old pale ice, not royal blue
  float ndl = clamp(dot(N, uKeyDir), 0.0, 1.0);
  vec3 col = alb*(uKeyCol*ndl*1.1 + uFillCol*1.2);
  col += uCore*ndv*ndv*(0.2 + 0.9*st*st)*uCoreI*0.42*(0.35 + 0.65*vK.x);
  float r = 1.0 - ndv; col += uIce*r*r*r*(0.22 + 0.25*vK.z)*(0.3 + 0.7*ndl);
  col += uIce*vK.z*(0.022 + 0.05*bands)*(0.5 + 0.5*ndl);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,J0=`
attribute vec4 iA; attribute vec4 iB;
varying vec3 vN; varying vec3 vW; varying float vGlow; varying float vSeed;
#include <fog_pars_vertex>
${nt}
void main(){
  float tl = iB.y + 0.10*sin(uTime*0.5 + iB.z*40.0), cy = cos(iB.x), sy = sin(iB.x), ct = cos(tl), st = sin(tl);
  vec3 p = position*iA.w;
  p = vec3(p.x, p.y*ct - p.z*st, p.y*st + p.z*ct);
  vec3 n = vec3(0.0, -st, ct);
  p = vec3(p.x*cy + p.z*sy, p.y, -p.x*sy + p.z*cy);
  n = vec3(n.z*sy, n.y, n.z*cy);
  vec3 w = iA.xyz + p;
  vW = w; vN = n; vSeed = iB.z;
  vGlow = paneMask(w.xz, 9.0);
  vec4 mvPosition = viewMatrix*vec4(w, 1.0);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,eo=`
uniform vec3 uKeyDir; uniform vec3 uSnow; uniform vec3 uPane; uniform vec3 uCoreC; uniform float uCeilI;
varying vec3 vN; varying vec3 vW; varying float vGlow; varying float vSeed;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
  float face = abs(dot(N, V)), fr = 1.0 - face; fr *= fr;
  // a thin plate of clear ice: faint and see-through face-on, bright where it turns edge-on or catches the light
  vec3 col = mix(uSnow*2.4 + uPane*0.12, uPane*1.15, vGlow)*(0.30 + 0.4*vSeed + 0.9*fr);
  vec3 H = normalize(uKeyDir + V);
  float sp = abs(dot(N, H)); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  float a = clamp(0.24 + 0.22*vSeed + 0.6*fr, 0.0, 0.85);
  gl_FragColor = vec4(col*uCeilI, 1.0);
  #include <fog_fragment>
  gl_FragColor = vec4(gl_FragColor.rgb*a + uCoreC*sp*(0.5 + 1.1*vGlow)*uCeilI*a, a);
}`,to=`
attribute vec4 iA; attribute vec4 iB;
varying float vT; varying float vGlow; varying float vSide;
#include <fog_pars_vertex>
${nt}
void main(){
  float t = -position.y, len = iA.w, ph = iB.z;
  vec2 off = vec2(sin(uTime*0.6 + ph + t*2.4), cos(uTime*0.47 + ph*1.7 + t*2.0))*iB.w*t*t*len*0.22;
  vec3 w = iA.xyz + vec3(off.x, -t*len, off.y);
  vec3 toCam = cameraPosition - w; float dist = length(toCam);
  vec3 side = normalize(cross(vec3(0.0, 1.0, 0.0), toCam) + vec3(1e-4, 0.0, 0.0));
  float wd = max(iB.x*(1.0 - 0.65*t), dist*0.0032);
  w += side*position.x*wd;
  vT = t; vSide = position.x*2.0; vGlow = paneMask(w.xz, 9.0);
  vec4 mvPosition = viewMatrix*vec4(w, 1.0);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,oo=`
uniform vec3 uOchre; uniform vec3 uSnow; uniform vec3 uPane; uniform float uCeilI;
varying float vT; varying float vGlow; varying float vSide;
#include <fog_pars_fragment>
void main(){
  vec3 lit = mix(uSnow*1.6, uPane, vGlow);
  vec3 col = (uOchre*1.5 + 0.03)*(lit*1.6 + 0.05)*(0.55 + 0.45*(1.0 - abs(vSide)))*(1.0 - 0.45*vT);
  gl_FragColor = vec4(col*uCeilI, 1.0);
  #include <fog_fragment>
}`,ao=`
attribute vec4 iP;
varying vec2 vUv; varying float vA;
#include <fog_pars_vertex>
void main(){
  vec4 mvPosition = viewMatrix*vec4(iP.xyz, 1.0);
  float s = max(abs(iP.w), -mvPosition.z*0.0022);
  vA = step(0.0, iP.w)*min(abs(iP.w)/max(s, 1e-4), 1.0);
  mvPosition.xy += position.xy*s;
  vUv = position.xy;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,no=`
uniform vec3 uIce; uniform vec3 uCore;
varying vec2 vUv; varying float vA;
#include <fog_pars_fragment>
void main(){
  float r = length(vUv);
  float a = (1.0 - smoothstep(0.82, 1.0, r))*(0.16 + 0.84*smoothstep(0.45, 0.95, r));
  float hl = 1.0 - smoothstep(0.0, 0.3, length(vUv - vec2(-0.35, 0.4)));
  vec3 col = (uIce*0.55 + uCore*0.25)*a + uIce*hl*0.7;
  #ifdef USE_FOG
    float keep = exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    float keep = 1.0;
  #endif
  gl_FragColor = vec4(col*vA*keep, a*0.35*vA*keep);
}`,ro=`
attribute vec3 aE;     // distance to the two free edges (0 on an edge), shard seed
uniform float uFront; uniform vec3 uHero;
varying vec3 vN; varying vec3 vW; varying vec3 vE; varying float vPool; varying float vK;
#include <fog_pars_vertex>
${nt}
void main(){
  vec4 w = modelMatrix*instanceMatrix*vec4(position, 1.0);
  vN = mat3(modelMatrix)*(mat3(instanceMatrix)*normal);
  vW = w.xyz; vE = aE; vPool = poolAt(w.xyz); vK = uFront - length(w.xz - uHero.xz);
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,io=`
uniform vec3 uKeyDir; uniform vec3 uKeyCol; uniform vec3 uFillCol; uniform vec3 uIce; uniform vec3 uShade; uniform vec3 uCore; uniform float uTime;
varying vec3 vN; varying vec3 vW; varying vec3 vE; varying float vPool; varying float vK;
#include <fog_pars_fragment>
${Ce.GLSL_HASH}
${Ce.GLSL_VALUE_NOISE}
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
  float ndv = clamp(dot(N, V), 0.0, 1.0), fres = 1.0 - ndv; fres *= fres;
  float e = min(vE.x, vE.y), fw = fwidth(e) + 1e-4, seed = vE.z, tipK = 1.0 - clamp(vE.x + vE.y, 0.0, 1.0);
  float edge = (1.0 - smoothstep(0.0, max(0.07, fw*1.5), e))*clamp(0.10/fw, 0.25, 1.0);
  float ndl = dot(N, uKeyDir), lit = clamp(ndl, 0.0, 1.0)*0.7 + abs(ndl)*0.3;
  // clear ice: face-on you look through it into the dark; it whitens toward its tip, its edges and along fractures
  float grain = vnoise(vec2((vE.x - vE.y)*13.0 + seed*50.0, tipK*3.0 + seed*9.0));
  float frostK = clamp(0.16 + 0.55*tipK*tipK + 0.6*edge + 0.5*fres + (grain - 0.45)*0.5, 0.0, 1.0);
  vec3 light = uFillCol*1.15 + uKeyCol*lit*(0.40 + 1.2*vPool);
  light = mix(light, vec3(dot(light, vec3(0.3, 0.5, 0.2))*1.2), 0.5);
  vec3 col = uIce*0.72*(0.8 + 0.2*seed)*light*(0.18 + 0.82*frostK);
  col += mix(uIce, uCore, 0.5)*fres*(0.05 + 0.30*clamp(ndl + 0.4, 0.0, 1.0));
  col += uCore*edge*(0.06 + 0.20*vPool);
  vec3 H = normalize(uKeyDir + V);
  float sp = clamp(abs(dot(N, H)), 0.0, 1.0); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  float tw = 0.5 + 0.5*sin(uTime*(1.3 + 3.0*seed) + seed*90.0), fl = tw*tw; fl *= fl; fl *= fl;
  col += uIce*sp*(0.35 + 1.1*tw)*(0.35 + vPool) + uCore*fl*(0.10 + 0.5*edge);
  col += uCore*step(0.0, vK)*exp(-max(vK, 0.0)/14.0)*(0.25 + 0.6*edge);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,p0=[0,0,0,0],m0=[0,0,0],so=new o.Color(1,1,1),St=new o.Vector3,wt=new o.Vector3,It=new o.Vector3,_t=new o.Vector3;function Yt(){const a=[],i=[],N=[],C=[],k=[],x=[],B={n:0,v(w,y,f,u,c=p0,S=1e6,l=m0){return a.push(w,y,f),i.push(u.r,u.g,u.b),N.push(c[0],c[1],c[2],c[3]),C.push(S),k.push(l[0],l[1],l[2]),B.n++},tri(w,y,f){x.push(w,y,f)},quad(w,y,f,u){x.push(w,y,f,w,f,u)},lift(w,y){a[w*3+1]+=y},pos(w){return[a[w*3],a[w*3+1],a[w*3+2]]},count(){return x.length/3},async buildSlow(w){const y=new o.BufferGeometry,f=new Float32Array(a),u=new Uint32Array(x),c=new Float32Array(f.length),S=f.length/3;y.setAttribute("position",new o.BufferAttribute(f,3)),await w.yield(),y.setAttribute("color",new o.BufferAttribute(new Float32Array(i),3)),await w.yield(),y.setAttribute("aAnim",new o.BufferAttribute(new Float32Array(N),4)),await w.yield(),y.setAttribute("aArr",new o.BufferAttribute(new Float32Array(C),1)),y.setAttribute("aTip",new o.BufferAttribute(new Float32Array(k),3)),y.setIndex(new o.BufferAttribute(u,1)),await w.yield();for(let l=0,P=u.length;l<P;l+=3){const K=u[l]*3,ee=u[l+1]*3,U=u[l+2]*3,V=f[U]-f[ee],W=f[U+1]-f[ee+1],ue=f[U+2]-f[ee+2],L=f[K]-f[ee],q=f[K+1]-f[ee+1],de=f[K+2]-f[ee+2],ye=W*de-ue*q,I=ue*L-V*de,re=V*q-W*L;c[K]+=ye,c[K+1]+=I,c[K+2]+=re,c[ee]+=ye,c[ee+1]+=I,c[ee+2]+=re,c[U]+=ye,c[U+1]+=I,c[U+2]+=re,l%18e3===17997&&await w.yield()}for(let l=0;l<S;l++){const P=l*3,K=Math.hypot(c[P],c[P+1],c[P+2]);K>0&&(c[P]/=K,c[P+1]/=K,c[P+2]/=K),l%8e3===7999&&await w.yield()}return y.setAttribute("normal",new o.BufferAttribute(c,3)),y},build(w=!0){const y=new o.BufferGeometry;return y.setAttribute("position",new o.Float32BufferAttribute(a,3)),y.setAttribute("color",new o.Float32BufferAttribute(i,3)),y.setAttribute("aAnim",new o.Float32BufferAttribute(N,4)),y.setAttribute("aArr",new o.Float32BufferAttribute(C,1)),y.setAttribute("aTip",new o.Float32BufferAttribute(k,3)),y.setIndex(x),w&&y.computeVertexNormals(),y}};return B}function Ae(a,i,N,C,k={}){const x=i.length,B=[],w=!!k.closed;for(let f=0;f<x;f++){const u=i[w?(f+x-1)%x:Math.max(f-1,0)],c=i[w?(f+1)%x:Math.min(f+1,x-1)],S=i[f],l=f/(w?x:x-1);St.set(c[0]-u[0],c[1]-u[1],c[2]-u[2]).normalize(),k.ref?_t.set(k.ref[0],k.ref[1],k.ref[2]):Math.abs(St.y)>.9?_t.set(1,0,0):_t.set(0,1,0),wt.crossVectors(St,_t).normalize(),It.crossVectors(St,wt);const P=[],K=k.anim?k.anim(f,l):p0;for(let ee=0;ee<N;ee++){const U=ee/N*Math.PI*2,V=C(f,U,l),W=Math.cos(U)*V,ue=Math.sin(U)*V,L=S[0]+wt.x*W+It.x*ue,q=S[1]+wt.y*W+It.y*ue,de=S[2]+wt.z*W+It.z*ue;P.push(a.v(L,q,de,k.col?k.col(f,U,l,L,q,de):so,K,k.arr?k.arr(L,q,de,f):1e6,k.flags||m0))}B.push(P)}const y=w?x:x-1;for(let f=0;f<y;f++){const u=B[f],c=B[(f+1)%x];for(let S=0;S<N;S++){const l=(S+1)%N;a.quad(u[S],u[l],c[l],c[S])}}return B}function lo(a,i){const N=[],C=[],k=[],x=new o.Vector3,B=new o.Vector3,w=new o.Vector3,y=new o.Vector3,f=new o.Vector3,u=new o.Vector3,c=new o.Vector3,S=new o.Vector3,l=new o.Vector3,P=[0,1,2,3,4,5].map(()=>new o.Vector3),K=(ue,L,q,de,ye,I,re)=>{u.subVectors(L,ue).cross(f.subVectors(q,ue)).normalize();for(const[he,pe]of[[ue,de],[L,ye],[q,I]])N.push(he.x,he.y,he.z),C.push(u.x,u.y,u.z),k.push(pe[0],pe[1],re)},ee=[1,0],U=[0,1],V=[0,0];for(let ue=0;ue<i;ue++){const L=a()<.25,q=a()*6.283,de=Math.sqrt(a())*1.15,ye=a()*6.283,I=a(),re=a(),he=a(),pe=a(),ie=L?.85+I*.6:I*re*1.3+.12*de,Ke=(L?.6+he*.8:.5+he*1.5)*(1.12-.36*de),me=Ke*(L?.16+pe*.16:.05+pe*.09),oe=.035+a()*.05,Se=a()*1.6-.8,we=a()*3.1416,fe=a();x.set(Math.sin(ie)*Math.cos(q),Math.cos(ie),Math.sin(ie)*Math.sin(q)),B.set(-Math.sin(q),0,Math.cos(q)),w.crossVectors(x,B).normalize(),B.multiplyScalar(Math.cos(we)).addScaledVector(w,Math.sin(we)),w.crossVectors(x,B).normalize(),y.set(Math.cos(ye)*de,-.15,Math.sin(ye)*de),c.copy(y).addScaledVector(B,-me),S.copy(y).addScaledVector(B,me),l.copy(y).addScaledVector(x,Ke).addScaledVector(B,me*Se),P[0].copy(c).addScaledVector(w,oe),P[1].copy(S).addScaledVector(w,oe),P[2].copy(l).addScaledVector(w,oe*.3),P[3].copy(c).addScaledVector(w,-oe),P[4].copy(S).addScaledVector(w,-oe),P[5].copy(l).addScaledVector(w,-oe*.3),K(P[0],P[2],P[1],ee,V,U,fe),K(P[3],P[4],P[5],ee,U,V,fe),K(P[1],P[2],P[5],V,V,V,fe),K(P[1],P[5],P[4],V,V,V,fe),K(P[2],P[0],P[3],V,V,V,fe),K(P[2],P[3],P[5],V,V,V,fe)}const W=new o.BufferGeometry;return W.setAttribute("position",new o.Float32BufferAttribute(N,3)),W.setAttribute("normal",new o.Float32BufferAttribute(C,3)),W.setAttribute("aE",new o.Float32BufferAttribute(k,3)),W}function y0(a,i){const N=[],C=[],k=[];let x=0;const B=(f,u,c,S,l,P,K)=>(N.push(f,u,c),C.push(S,l,P,K),x++),w=i.length;for(let f=0;f<5;f++){const u=f/5*Math.PI*2+.3,c=Math.cos(u),S=Math.sin(u),l=-S,P=c;let K=null;for(let U=0;U<a;U++){const V=U/a,W=.33*Math.pow(1-V,.75)+.06*(1-V),ue=.21*Math.pow(1-V,.6)+.04,L=i.map(q=>B(c*V+l*q*W,ue*Math.pow(1-Math.abs(q),.7)+(q===0?.04:0),S*V+P*q*W,V,u,q,Math.abs(q)===1?.3:0));if(K)for(let q=0;q<w-1;q++)k.push(K[q],K[q+1],L[q],K[q+1],L[q+1],L[q]);K=L}const ee=B(c,.03,S,1,u,0,.4);for(let U=0;U<w-1;U++)k.push(K[U],K[U+1],ee)}const y=new o.BufferGeometry;return y.setAttribute("position",new o.Float32BufferAttribute(N,3)),y.setAttribute("aArm",new o.Float32BufferAttribute(C,4)),y.setIndex(k),y.computeVertexNormals(),y}function co(a){const i=[],N=[],C=[];let k=0;const x=(V,W,ue,L,q,de,ye)=>(i.push(V,W,ue),N.push(L,q,de,ye),k++),B=7,w=x(0,.6,0,0,0,0,0),y=[],f=[];for(let V=0;V<B;V++){const W=V/B*Math.PI*2;y.push(x(Math.cos(W)*.6,.42,Math.sin(W)*.6,0,W,0,0)),f.push(x(Math.cos(W)*.86,0,Math.sin(W)*.86,0,W,0,0))}for(let V=0;V<B;V++){const W=(V+1)%B;C.push(w,y[W],y[V],y[V],y[W],f[V],y[W],f[W],f[V])}for(let V=0;V<16;V++){const W=V/16*Math.PI*2+a.range(-.15,.15),ue=a.range(.2,1.25),L=Math.cos(ue),q=Math.sin(ue),de=a.range(1,1.35),ye=Math.cos(W)*L*.6,I=q*.5,re=Math.sin(W)*L*.6,he=-Math.sin(W)*.07,pe=Math.cos(W)*.07,ie=x(ye-he,I,re-pe,0,W,0,0),Ke=x(ye+he,I,re+pe,0,W,0,0),me=x(Math.cos(W)*L*de,q*de*.9,Math.sin(W)*L*de,1,W,0,.5);C.push(ie,Ke,me)}const u=a.range(0,6.28),c=Math.cos(u)*.42,S=Math.sin(u)*.42,l=x(c,.66,S,0,0,0,1),P=x(-S,.74,c,0,0,0,1),K=x(-c*.8,.62,-S*.8,0,0,0,.8),ee=x(S,.58,-c,0,0,0,1);C.push(l,P,K,l,K,ee);const U=new o.BufferGeometry;return U.setAttribute("position",new o.Float32BufferAttribute(i,3)),U.setAttribute("aArm",new o.Float32BufferAttribute(N,4)),U.setIndex(C),U.computeVertexNormals(),U}function Zt(a,i,N){const C=new o.InstancedBufferGeometry;C.index=a.index,C.setAttribute("position",a.getAttribute("position")),C.setAttribute("normal",a.getAttribute("normal")),C.setAttribute("aArm",a.getAttribute("aArm"));const k=i.length,x=new Float32Array(k*4),B=new Float32Array(k*4),w=new Float32Array(k*4),y=new Float32Array(k*4);for(let u=0;u<k;u++){const c=i[u];x.set([c.x,c.y,c.z,c.size],u*4),B.set([c.yaw,c.seed,c.arr,c.caught],u*4),w.set([c.fx,c.fz,c.gx,c.gz],u*4),y.set([c.r,c.g,c.b,c.kind],u*4)}C.setAttribute("iA",new o.InstancedBufferAttribute(x,4)),C.setAttribute("iB",new o.InstancedBufferAttribute(B,4)),C.setAttribute("iC",new o.InstancedBufferAttribute(w,4)),C.setAttribute("iT",new o.InstancedBufferAttribute(y,4)),C.instanceCount=k;const f=new o.Mesh(C,N);return f.frustumCulled=!1,f.matrixAutoUpdate=!1,f}function g0(a,i,N,C,k,x,B,w,y,f=22,u=10,c=.7,S=0,l=null){const P=a.length/3,K=Math.max(1.5,B/f*3.3)*(l?l.per:1),ee=.4*_e(1.4*f/B,.2,1),U=l?l.taper:.85,V=S?l?l.lip:.5:.26,W=l?l.lean[0]:0,ue=l?l.lean[1]:0,L=I=>S?w*(.1+.9*Math.pow(1-I,U))*(1+.2*C.n2(y*31,I*6)):w*(1-.74*Math.pow(I,.8))+.22,q=I=>[k+Math.sin(I*3.1+y*9)*c*I+W*I,x+Math.cos(I*2.3+y*5)*c*I+ue*I];for(let I=0;I<=f;I++){const re=I/f,he=.6-re*(B+.6),pe=(re*B/K+y*3)%1,ie=1+V*pe*pe,Ke=L(re)*ie*(I===0?1.7:I===f?.45:1),me=q(re),oe=S&&I>0?.34*Ke:0,Se=y*20+I*1.9;for(let we=0;we<u;we++){const fe=we/u*Math.PI*2,Ee=Ke*(1+.22*C.n3(Math.cos(fe)*1.3+y*11,he*ee,Math.sin(fe)*1.3));a.push(me[0]+Math.cos(fe)*Ee,he+oe*Math.sin(fe-Se),me[1]+Math.sin(fe)*Ee),i.push(re,y,S)}}for(let I=0;I<f;I++)for(let re=0;re<u;re++){const he=P+I*u+re,pe=P+I*u+(re+1)%u,ie=he+u,Ke=pe+u;N.push(he,pe,ie,pe,Ke,ie)}if(!l||!l.spurs)return;const de=[0,.16,.42,.74,1],ye=[1.3,1,.74,.42,.04];for(const I of l.spurs){const re=a.length/3,he=q(I.k),pe=L(I.k),ie=.6-I.k*(B+.6),Ke=Math.cos(I.a),me=Math.sin(I.a);for(let oe=0;oe<5;oe++){const Se=de[oe],we=pe*.7+I.out*(1-(1-Se)*(1-Se)),fe=he[0]+Ke*we,Ee=he[1]+me*we,He=ie+(oe===0?I.rb*.9:0)-I.L*Math.pow(Se,1.2);for(let Ue=0;Ue<5;Ue++){const Ye=Ue/5*Math.PI*2,Te=I.rb*ye[oe]*(1+.25*C.n3(Math.cos(Ye)*1.1+y*7,He*.3,Math.sin(Ye)*1.1+I.a));a.push(fe+Math.cos(Ye)*Te,He,Ee+Math.sin(Ye)*Te),i.push(Math.min(I.k+Se*I.L/B,1),y,S)}}for(let oe=0;oe<4;oe++)for(let Se=0;Se<5;Se++){const we=re+oe*5+Se,fe=re+oe*5+(Se+1)%5,Ee=we+5,He=fe+5;N.push(we,fe,Ee,fe,He,Ee)}}}function uo(a,i){const N=Yt(),C=[[.5,.01],[.485,.026],[.455,.04],[.41,.05],[.36,.052],[.31,.058],[.24,.074],[.14,.088],[.03,.094],[-.09,.09],[-.2,.078],[-.3,.06],[-.38,.042],[-.44,.027],[-.485,.016],[-.5,.008]],k=new o.Color(.27,.29,.31),x=new o.Color(.06,.065,.075),B=new o.Color(.62,.62,.58),w=new o.Color,y=(u,c)=>{const S=J(-.3,.7,Math.sin(c)),l=a.n3(Math.cos(c)*2.2,u*16,Math.sin(c)*2.2);return w.copy(k).lerp(x,J(.05,.5,l)*.7*(1-S)).lerp(B,S*.95),w};Ae(N,C.map(([u])=>[0,0,u*i]),14,(u,c)=>C[u][1]*i*(Math.sin(c)>0?.96:.9+.1*Math.abs(Math.cos(c))),{col:(u,c)=>y(C[u][0],c),anim:u=>[6,.05*i,0,C[u][0]]});const f=(u,c,S,l)=>Ae(N,u,6,(P,K,ee)=>{const U=Math.sin(Math.PI*Math.min(ee*.8+.2,1));return i*(Math.abs(Math.cos(K))*c+S)*U},{col:()=>w.copy(k).lerp(x,.55),anim:(P,K)=>[6,.05*i,0,l-K*.06],ref:[0,0,1]});for(const u of[-1,1]){f([[u*.066*i,-.04*i,.21*i],[u*.092*i,-.062*i,.185*i],[u*.118*i,-.08*i,.15*i],[u*.136*i,-.092*i,.11*i],[u*.146*i,-.098*i,.07*i]],.027,.011,.2),Ae(N,[[u*.012*i,0,-.47*i],[u*.02*i,0,-.52*i],[u*.035*i,0,-.575*i],[u*.045*i,0,-.62*i]],6,(c,S,l)=>i*(Math.abs(Math.sin(S))*.03*Math.sin(Math.PI*(.25+l*.7))+.004),{col:()=>w.copy(k).lerp(x,.6),anim:(c,S)=>[6,.05*i,0,-.47-S*.15]}),Ae(N,[[u*.036*i,.018*i,.437*i],[u*.042*i,.02*i,.437*i],[u*.046*i,.021*i,.437*i]],5,c=>i*[.004,.0075,.002][c],{col:()=>w.setRGB(.012,.012,.016)});for(let c=0;c<5;c++){const S=(c-2)*.006*i,l=N.v(u*.03*i,-.012*i+S*.4,.468*i,B),P=N.v(u*.03*i,-.008*i+S*.4,.47*i,B);N.tri(l,P,N.v(u*.085*i,-.03*i+S,.445*i,B))}}return N.build()}const Qt=new o.Color;function fo(a){const i=Yt(),N=new o.Color("#E8452C"),C=new o.Color(.2,.035,.09);for(let k=0;k<30;k++){const x=a.range(0,6.283),B=Math.sqrt(a())*6.6,w=Math.cos(x)*B,y=Math.sin(x)*B,f=a.range(1.2,2.8)*(1-B/11),u=[a.range(-.5,.5),a.range(-.5,.5)],c=a.range(0,9),S=a.range(.7,1.1);Ae(i,[[w,-.6*f,y],[w+u[0]*.3*f,0,y+u[1]*.3*f],[w+u[0]*.8*f,.6*f,y+u[1]*.8*f],[w+u[0]*1*f,.95*f,y+u[1]*1*f]],5,(l,P)=>f*[.2,.62,.42,.04][l]*(1+.35*Math.sin(P*2+c)),{col:l=>Qt.setRGB(.5,.66,.7).multiplyScalar(S*(.7+.12*l))})}for(let k=0;k<6;k++){const x=k/6*6.283+a.range(-.3,.3),B=a.range(1.5,5.2),w=Math.cos(x)*B,y=Math.sin(x)*B,f=a.range(1.6,2.6),u=a.range(0,6.283);for(let c=0;c<5;c++){const S=u+c/5*6.283,l=Math.cos(S),P=Math.sin(S);Ae(i,[[w,f,y],[w+l*.45,f+.05,y+P*.45],[w+l*.95,f-.05,y+P*.95],[w+l*1.3,f-.12,y+P*1.3]],4,(K,ee)=>[.42,.34,.2,.03][K]*(.45+.55*Math.abs(Math.cos(ee))),{col:K=>Qt.copy(N).multiplyScalar(.9+.1*K),anim:(K,ee)=>[1,.25,S*3,ee]})}}Ae(i,[[2,2.1,-1],[2,2.5,-1],[2,3,-1],[2,3.25,-1]],7,k=>[.5,.85,.6,.05][k],{col:()=>C});for(let k=0;k<14;k++){const x=k/14*6.283,B=.3+k%3*.4;i.tri(i.v(2+Math.cos(x)*.5,2.7,-1+Math.sin(x)*.5,C),i.v(2+Math.cos(x+.2)*.5,2.7,-1+Math.sin(x+.2)*.5,C),i.v(2+Math.cos(x)*Math.cos(B)*1.5,2.7+Math.sin(B)*1.3,-1+Math.sin(x)*Math.cos(B)*1.5,C))}return i.build()}const vo={day:{snow:"#0E4C7A",pane:"#2FBF9A",core:"#6FE6F2",key:"#86ead6",keyI:1.25,fog:"#082A4A",deep:"#061A33",exposure:1.1,tilt:35,ceilI:1,algae:1,heroCore:2.2},golden:{snow:"#0d3f73",pane:"#b9cf7a",core:"#f3eebc",key:"#ffe7b8",keyI:1.15,fog:"#07254a",deep:"#051733",exposure:1.1,tilt:56,ceilI:.95,algae:1.6,heroCore:2.2},night:{snow:"#0b2a78",pane:"#93aadc",core:"#dfe9ff",key:"#a9c0ff",keyI:.8,fog:"#051a3c",deep:"#03102a",exposure:1.45,tilt:30,ceilI:.7,algae:.7,heroCore:2.8}};var mo={id:"brinicle-ice-finger",name:"The Ice Finger",category:"ocean",weirdness:.45,media:["underwater","tiny"],async build(a){const i=new o.Scene,N=a.rng,C=a.noise,k=a.vary||{},x=a.quality?.detail??1,B=_e(k.density??1,.7,1.3),w=N.fork("mood"),y=["day","day","day","golden","night"][Math.floor(w()*5)],f=Math.floor(w()*3),u=w()<.3?1:0,c=Math.floor(w()*3),S=k.hour==="night"?"night":k.hour==="golden"||k.hour==="dawn"?"golden":k.hour==="day"?"day":y,l=vo[S],P=f===1,K=f===2,ee=u===1,U=c===1,V=c===2,W=!!k.rare,ue=P?.62:K?.7:1,L=l.ceilI*(K?.88:1),q=ne(l.key).multiplyScalar(l.keyI*(K?.85:1)),de=ne(l.snow).multiplyScalar(1.5).add(ne(l.deep)),ye=ne(l.fog);i.fog=new o.FogExp2(ye.clone(),.0024),i.background=ye.clone();const I=l.tilt*Math.PI/180,re=w.range(-.15,.15),he=new o.Vector3(-Math.sin(I),Math.cos(I),.12).normalize(),pe=e=>{const t=e-Xt;return t<=-8?0:-V0*(t<8?(t+8)*(t+8)/32:t)},ie=(e,t)=>{const n=Z-t,s=Math.abs(e);let A=Ie+pe(n);if(s>24){const M=J(24,75,s);A+=M*(7*J(Xt-10,Xt+60,n)+5*C.fbm2(e*.012+3,t*.012,3))+J(26,40,s)*.5*C.n2(e*.11,t*.11)}const R=Math.hypot(e,n-v0);return R<17&&(A-=9*(.5+.5*Math.cos(Math.PI*R/17))),A},Ke=["#061A33",l.snow,l.pane,"#6FE6F2","#DDF3F6","#B58A3C","#E8452C"],me=await R0(a,{palette:Ke,riverLength:D0,bed:!1,groundAt:(e,t)=>ie(e+Pe,t+Z)-Ie,keyDir:he,coreIntensity:l.heroCore,edgeIntensity:1.8});me.object.position.set(Pe,Ie,Z),i.add(me.object);const oe=me.frost,Se=oe.uniforms.uFront;await a.yield();const we=Math.PI*2,fe=Math.PI*2.5,Ee=Math.PI*4,He=e=>{let t=17,n;if(e<=fe){const s=_e(e/fe,0,1);n=-16-30*s*s*(3-2*s)}else{const s=(e-fe)/(Ee-fe);t=ge(17,10.5,J(0,.8,s)),n=ge(-46,-58.6,J(0,1,s))}return[Pe+Math.cos(e)*t,n,Z-Math.sin(e)*t]},Ue=[[0,-16,0],[0,-16,-42],[1.5,-16,-78],[8.5,-16,-103]];for(let e=-1;e<=32;e++)Ue.push(He(e*Math.PI/8));Ue.push([10.2,-58.9,Z-13],[8,-59.1,Z-28]);const Ye=oe.centre(qe)*.5,Te=e=>ge(ge(6,oe.centre(e)*.5,J(44,120,e)),Ye,J(380,500,e));for(const e of[46,75,130,190,250,310,370,430,500,540,570,qe])Ue.push([Te(e),Ie+pe(e)+4.8,Z-e]);const Oe=N0(Ue),rt=2400,Ze=new Float32Array((rt+1)*3),se=new o.Vector3,it=new o.Vector3;for(let e=0;e<=rt;e++)Oe.pointAt(e/rt,se),Ze[e*3]=se.x,Ze[e*3+1]=se.y,Ze[e*3+2]=se.z,e%400===399&&await a.yield();const Mt=e=>{let t=1e18,n=0;for(let s=0;s<=rt;s++){const A=Ze[s*3]-e[0],R=Ze[s*3+1]-e[1],M=Ze[s*3+2]-e[2],h=A*A+R*R+M*M;h<t&&(t=h,n=s)}return n/rt},le={s0:Mt(He(0)),q:Mt(He(fe)),td:Mt(He(Math.PI*3.5)),ex:Mt(He(Ee))},Jt=e=>e<le.s0?ge(30,33.5,e/le.s0):e<le.q?ge(33.5,50,(e-le.s0)/(le.q-le.s0)):e<le.td?ge(50,64,(e-le.q)/(le.td-le.q)):64,bt=[[le.ex,14],[le.ex+.08,22],[.5,17],[.545,13],[.63,13],[.69,38],[.78,70],[.88,90],[1,86]],w0=e=>{let t=0;for(;t<bt.length-2&&e>bt[t+1][0];)t++;const n=bt[t],s=bt[t+1];return ge(n[1],s[1],J(n[0],s[0],e))},Qe=170,Kt=new Float32Array(Qe+1),e0=new Float32Array(Qe+1),Ge=[0,0,0];for(let e=0;e<=Qe;e++){const t=e*4,n=Te(_e(t,46,qe))-Pe;Ge[0]=Ge[1]=Ge[2]=1e9;for(let s=-3;s<=3;s++){const A=n+s*2,R=oe.arrive(A,-t)-Math.hypot(A,t);R<Ge[2]&&(Ge[2]=R,Ge.sort((M,h)=>M-h))}e0[e]=Ge[2]<1e8?(Ge[0]+Ge[1]+Ge[2])/3:Ge[0]<1e8?Ge[0]:8}for(let e=0;e<=Qe;e++){let t=0,n=0;for(let s=-3;s<=3;s++){const A=_e(e+s,0,Qe),R=4-Math.abs(s);t+=e0[A]*R,n+=R}Kt[e]=t/n}const M0=e=>{const t=_e(e/4,0,Qe),n=Math.min(Math.floor(t),Qe-1),s=Te(_e(e,46,qe))-Pe;return Math.hypot(s,e)+ge(Kt[n],Kt[n+1],t-n)};await a.yield();const ut=400,Tt=new Float32Array(ut+1);for(let e=0,t=0;e<=ut;e++){const n=e/ut;let s=0;if(n>le.td){const A=Math.round(n*rt)*3,R=Math.max(Z-Ze[A+2],0);s=Math.max(26*J(le.td,le.td+.035,n),J(le.td+.02,le.ex+.03,n)*M0(R+w0(n)))}t=Math.max(t,s),Tt[e]=t}const b0=e=>{const t=_e(e,0,1)*ut,n=Math.min(Math.floor(t),ut-1);return ge(Tt[n],Tt[n+1],t-n)},x0=e=>{let t=ge(.85,.45,J(le.s0-.05,le.s0+.02,e));return t-=.08*Math.exp(-((e-le.td)/.025)*((e-le.td)/.025)),t=ge(t,2.1,J(le.ex,le.ex+.08,e)),ge(t,1,J(.84,.91,e))};await a.yield();const t0=[[-58,-125,36,62,1],[46,-40,16,24,.6],[-96,-270,20,30,.85],[34,-215,14,20,.55],[-122,-390,24,36,.9],[-150,-520,26,40,.9],[-176,-660,26,36,.85],[70,-430,16,22,.5]],ft=N.fork("panes"),Ne={uTime:{value:0},uKeyDir:{value:he.clone()},uKeyCol:{value:q},uFillCol:{value:de},uPaneA:{value:t0.map(e=>new o.Vector4(e[0]+ft.range(-8,8),e[1]+ft.range(-10,10),e[2]*ft.range(.85,1.15),e[3]*ft.range(.85,1.15)))},uPaneB:{value:t0.map((e,t)=>new o.Vector4(e[4]*(t===0?Math.max(ue,.8):ue),ft.range(0,6.28),0,0))},uCore:{value:ne("#6FE6F2")},uIce:{value:ne("#DDF3F6")},uShade:{value:ne("#2AA6C8")},uSnow:{value:ne(l.snow)},uPane:{value:ne(l.pane).multiplyScalar(1.1)},uCoreC:{value:ne(l.core)},uOchre:{value:ne("#B58A3C")},uCeilI:{value:L},uFrostAlb:{value:ne("#DDF3F6").multiplyScalar(.66)},uFront:Se,uHero:{value:new o.Vector3(Pe,Ie,Z)},uFogCol:{value:ye.clone()},uDeep:{value:ne(l.deep)},uGlow:{value:ne(l.snow).multiplyScalar(.22)},uRayC:{value:ne(l.pane).multiplyScalar(.7).add(ne(l.core).multiplyScalar(.3)).multiplyScalar(E0*L)},uDeepK:{value:0},uGiant:{value:0}},A0=()=>o.UniformsUtils.clone(o.UniformsLib.fog),Re=(...e)=>{const t={};for(const n of e)t[n]=Ne[n];return t},Le=(e,t,n,s={})=>new o.ShaderMaterial({vertexShader:e,fragmentShader:t,uniforms:{...A0(),...n},fog:!0,...s}),$e=(e,t=0)=>(e.frustumCulled=!1,e.renderOrder=t,e.matrixAutoUpdate=!1,e.updateMatrix(),i.add(e),e),Je=Re("uPaneA","uPaneB","uKeyDir","uTime"),o0=Re("uFogCol","uDeep","uGlow","uRayC","uDeepK"),z0={transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendEquation:o.AddEquation,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor};let st=null;$e(new o.Mesh(new o.SphereGeometry(1,20,10),new o.ShaderMaterial({vertexShader:H0,fragmentShader:O0,side:o.BackSide,depthWrite:!1,uniforms:{...o0,...Re("uKeyDir","uTime")}})),-10);const We=128,vt=new Uint8Array(We*We*4),a0=(e,t)=>[.5+.5*C.fbm2(e/140+5,t/140,3),.5+.45*C.fbm2(e/220+9,t/220+4,3),.5+.5*C.n2(e/60,t/60+7)];for(let e=0;e<We;e++){for(let t=0;t<We;t++){const n=a0(je.x0+(t+.5)/We*je.w,je.z0-(e+.5)/We*je.d),s=(e*We+t)*4;vt[s]=_e(n[0],0,1)*255,vt[s+1]=_e(n[1],0,1)*255,vt[s+2]=_e(n[2],0,1)*255,vt[s+3]=255}e%16===15&&await a.yield()}const et=new o.DataTexture(vt,We,We,o.RGBAFormat,o.UnsignedByteType);et.magFilter=et.minFilter=o.LinearFilter,et.wrapS=et.wrapT=o.MirroredRepeatWrapping,et.generateMipmaps=!1,et.needsUpdate=!0;const xt={x:-34,z:-300},C0=new o.PlaneGeometry(5600,4700,1,1).rotateX(Math.PI/2).translate(0,0,je.z0-2350);$e(new o.Mesh(C0,new o.ShaderMaterial({vertexShader:W0,fragmentShader:q0,side:o.DoubleSide,uniforms:{...Je,...o0,...Re("uSnow","uPane","uCoreC","uOchre","uCeilI"),uCeilMap:{value:et},uCeilRect:{value:new o.Vector4(je.x0,je.z0,1/je.w,1/je.d)},uCrackC:{value:ne(l.core).lerp(ne(l.pane),.25)},uHoleA:{value:new o.Vector4(xt.x,xt.z,5,1.5)},uHoleB:{value:new o.Vector4(150,Z,9,.8)},uTide:{value:P?1:0},uTideX:{value:9},uShag:{value:K?1:.25},uAlgae:{value:l.algae*(K?1.4:1)},uCrackI:{value:.95},uFogD:{value:.0024}}})),-5),await a.yield();{const e=N.fork("platelets"),t=Math.round(3e3*x*B*(K?1.5:1)),n=new Float32Array(t*4),s=new Float32Array(t*4);for(let M=0;M<t;M++){const h=e()<.55,g=e(),E=e(),G=e(),r=e(),v=e(),p=e();let b=h?(g+E+G-1.5)*44:(g*2-1)*130,_=h?20-r*230:40-r*470;Math.hypot(b-Pe,_-Z)<13&&(b+=26),n.set([b,-.3-v*v*(K?4.5:2.8),_,(h?.25+.5*p*p:.3+.8*p*p)+(K?.3:0)],M*4),s.set([e()*6.28,(e()-.5)*1.3,e(),0],M*4)}const A=new o.InstancedBufferGeometry,R=[0,0,0];for(let M=0;M<6;M++)R.push(Math.cos(M/6*we),Math.sin(M/6*we)*1.25-.9,0);A.setAttribute("position",new o.Float32BufferAttribute(R,3)),A.setIndex([0,1,2,0,2,3,0,3,4,0,4,5,0,5,6,0,6,1]),A.setAttribute("iA",new o.InstancedBufferAttribute(n,4)),A.setAttribute("iB",new o.InstancedBufferAttribute(s,4)),A.instanceCount=t,$e(new o.Mesh(A,Le(J0,eo,{...Je,...Re("uSnow","uPane","uCoreC","uCeilI")},{side:o.DoubleSide,...z0})),1),await a.yield()}{const e=N.fork("strands"),t=Math.round(440*x*(K?1.6:1)),n=new Float32Array(t*4),s=new Float32Array(t*4);for(let h=0;h<t;h++){let g=0,E=0,G=-1;for(let v=0;v<4;v++){const p=(e()+e()-1)*70,b=25-e()*300,_=a0(p,b)[0];_>G&&(G=_,g=p,E=b)}const r=e()<.2;n.set([g,-.4,E,(r?5:2)+e()*3.5],h*4),s.set([.22+e()*.3,e(),e()*6.28,.5+e()],h*4),h%200===199&&await a.yield()}const A=new o.InstancedBufferGeometry,R=[],M=[];for(let h=0;h<=7;h++)R.push(-.5,-h/7,0,.5,-h/7,0),h<7&&M.push(h*2,h*2+1,h*2+2,h*2+1,h*2+3,h*2+2);A.setAttribute("position",new o.Float32BufferAttribute(R,3)),A.setIndex(M),A.setAttribute("iA",new o.InstancedBufferAttribute(n,4)),A.setAttribute("iB",new o.InstancedBufferAttribute(s,4)),A.instanceCount=t,$e(new o.Mesh(A,Le(to,oo,{...Je,...Re("uOchre","uSnow","uPane","uCeilI")},{side:o.DoubleSide})))}{const e=N.fork("fingers"),t=Math.round(40*B),n=[],s=[],A=[],R=async()=>{const h=st.fork("giants"),g=[-1,1,1,-1,1,-1,-1,1,-1],E=(G,r,v,p,b)=>{const _=-(Ie+pe(G)+v),d=Math.sign(r-Te(Math.min(G,qe)))||1,m=[],F=6+Math.floor(h()*5);for(let T=0;T<F;T++)m.push({k:h.range(.05,.62),a:h.range(0,6.283),L:(5+h()*13)*b,rb:(.7+h()*1.5)*Math.sqrt(p/8)*b,out:h.range(.2,2.2)});g0(n,s,A,C,r,Z-G,_,p,h(),40,10,h.range(3,10),1,{taper:h.range(.55,1.35),lean:[d*h.range(0,.13)*_,h.range(-.14,.14)*_],per:h.range(.6,1.7),lip:h.range(.15,.5),spurs:m})};for(let G=0;G<9;G++){const r=385+G*72+h.range(-45,45),v=h()<.45,p=Te(Math.min(r,qe))+g[G]*h.range(42,130),b=v?h.range(15,42):h.range(36,75),_=v?h.range(4,7.5):h.range(8,14);if(E(r,p,b,_,1),G===3){const d=h.range(0,6.283),m=_*1.25;E(r+Math.sin(d)*m,p+g[G]*Math.abs(Math.cos(d))*m,b+h.range(22,40),_*.62,.7)}await a.yield()}};for(let h=0;h<t;h++){let g=0,E=0;for(let r=0;r<6;r++){g=(e()*2-1)*150,E=-55-e()*370;const v=Oe.nearestXZ(g,E);if(Math.hypot(g-Pe,E-Z)>36&&(v.dist>20||v.y<-70))break;g=170}const G=8+22*e()*e();g0(n,s,A,C,g,E,G,.9+G*.075,e()),h%6===5&&await a.yield()}st=e.fork("extra"),await a.yield(),await R(),await a.yield();const M=new o.BufferGeometry;M.setAttribute("position",new o.Float32BufferAttribute(n,3)),M.setAttribute("aK",new o.Float32BufferAttribute(s,3)),M.setIndex(A),await a.yield(),M.computeVertexNormals(),$e(new o.Mesh(M,Le(Z0,Q0,{...Re("uKeyDir","uKeyCol","uFillCol","uCore","uIce","uShade","uTime","uGiant"),uCoreI:{value:l.heroCore}},{side:o.DoubleSide}))),await a.yield()}const At=ne(l.pane).lerp(ne(l.core),.4),zt=he.clone().negate(),dt=[Ce.makeGodRays({rng:N.fork("rays1"),time:Ne.uTime,position:[-58,-1,-125],direction:zt,radius:42,count:14,length:100,width:[3,11],color:At,intensity:.2*L}),Ce.makeGodRays({rng:N.fork("rays2"),time:Ne.uTime,position:[-120,-1,-360],direction:zt,radius:80,count:10,length:250,width:[5,20],color:At,intensity:.15*L}),Ce.makeGodRays({rng:N.fork("rays3"),time:Ne.uTime,position:[150,-1,Z],direction:zt,radius:7,count:4,length:70,width:[2,7],color:At,intensity:.2*L})];{const e=re+.18,t=Math.sin(I),n=new o.Vector3(-t*Math.cos(e),Math.cos(I),t*Math.sin(e)+.1).normalize();for(const[s,A,R,M]of[[215,-28,30,5],[330,-36,34,6],[445,-30,34,6],[560,-44,36,5],[400,56,22,4],[690,-20,60,6]]){const h=Te(Math.min(s,qe))+A,g=Z-s,E=-(Ie+pe(s))/n.y;await a.yield(),dt.push(Ce.makeGodRays({rng:st.fork("rays"+s),time:Ne.uTime,position:[h+n.x*E,-1,g+n.z*E],direction:zt,radius:R,count:M,length:E*1.3,width:[8,24],color:At,intensity:.2*L,falloff:.6}))}}for(const e of dt)e.object.frustumCulled=!1,i.add(e.object);await a.yield();{const s=Z-qe-170,A=45*521,R=new Float32Array(A*3),M=new Float32Array(A*3),h=new Float32Array(A);let g=0;for(let b=0;b<=520;b++){const _=ge(70,s,b/520),d=Math.max(1-J(0,.03,b/520),J(.93,1,b/520));for(let m=0;m<=44;m++,g++){const F=m/44*2-1,T=Math.abs(F),H=Math.sign(F)*(60*T+380*Math.pow(T,3.2)),X=ie(H,_),j=(ie(H+.8,_)-X)/.8,D=(ie(H,_+.8)-X)/.8,Y=Math.hypot(j,1,D);R[g*3]=H,R[g*3+1]=X,R[g*3+2]=_,M[g*3]=-j/Y,M[g*3+1]=1/Y,M[g*3+2]=-D/Y,h[g]=Math.max(d,J(.72,1,T))}b%12===11&&await a.yield()}const E=new Uint32Array(44*520*6);let G=0;for(let b=0;b<520;b++)for(let _=0;_<44;_++){const d=b*45+_,m=d+1,F=d+44+1,T=F+1;E[G++]=d,E[G++]=m,E[G++]=F,E[G++]=m,E[G++]=T,E[G++]=F}const r=new o.BufferGeometry;r.setAttribute("position",new o.BufferAttribute(R,3)),r.setAttribute("normal",new o.BufferAttribute(M,3)),r.setAttribute("aEdge",new o.BufferAttribute(h,1)),r.setIndex(new o.BufferAttribute(E,1));const v=ne(ee?"#3c4030":"#20242c"),p=ne(ee?"#5a5c44":"#3a3f4a");$e(new o.Mesh(r,Le(j0,U0,{...Je,...Re("uKeyCol","uFillCol","uCore","uFront","uHero"),uBedA:{value:v.multiplyScalar(1.4)},uBedB:{value:p.multiplyScalar(1.4)},uShell:{value:ne("#cfd6c8").multiplyScalar(.55)}},{side:o.DoubleSide})),-3),await a.yield()}const n0=lo(st.fork("shards"),18),r0=Le(ro,io,{...Je,...Re("uKeyCol","uFillCol","uIce","uShade","uCore","uFront","uHero")},{side:o.DoubleSide});await a.yield();{const e=N.fork("anchor"),t=Math.round(240*x*B),n=new o.InstancedMesh(n0,r0,t),s=new o.Matrix4,A=new o.Quaternion,R=new o.Euler,M=new o.Vector3;for(let h=0;h<t;h++){const g=-70+e()*700,E=(e()+e()+e()-1.5)*44,G=Z-g,v=Math.abs(E-Te(Math.max(g,46)))<9||Math.hypot(E,g)<24?.75+e()*.8:1.4+e()*e()*2.3;R.set((e()-.5)*.5,e()*6.28,(e()-.5)*.5),M.set(v,v*(.7+e()*.5),v),n.setMatrixAt(h,s.compose(se.set(E,ie(E,G)-.05,G),A.setFromEuler(R),M)),h%100===99&&await a.yield()}n.instanceMatrix.needsUpdate=!0,n.frustumCulled=!1,i.add(n),await a.yield()}const Gt=Le(L0,$0,{...Je,...Re("uKeyCol","uFillCol","uCore","uFrostAlb","uFront"),uPale:{value:ne("#f2b08a")},uAccent:{value:.16}},{side:o.DoubleSide}),Nt=me.anchors.starHuddle,Ct=new o.Vector3(Nt.x+Pe,Nt.y+Ie,Nt.z+Z);{const e=N.fork("stars"),t=ne("#E8452C"),n=ne(U?"#8a1f52":"#5a2040"),s=(r,v,p,b,_)=>{const d=e(),m=e(),F=e(),T=e(),H=e(),X=r-Pe,j=v-Z,D=-j,Y=ie(r,v),ce=(ie(r+.6,v)-Y)/.6,Fe=(ie(r,v+.6)-Y)/.6,xe=oe.coverage(X,j),ae=Math.hypot(X,j),ve=X>=oe.centre(Math.max(D,0))?1:-1;let ke=0,Be=ae+10,z=0,$=0;if(xe>.5&&(b===1||(_===void 0?d<.34:_)))ke=1,Be=oe.arrive(X,j),Be<1e5||(Be=ae+10);else if(b===1)Be=1e6;else if(xe>.22||_===!1){const Q=xe>.5?3.5+m*2.5:1.5+m*1.5;ae<22?(z=X/Math.max(ae,1)*Q,$=j/Math.max(ae,1)*Q):(z=ve*Q,$=F*2-1)}const O=b===1?n:t,te=.82+.3*T;return{x:r,y:Y+.03,z:v,size:p,yaw:H*6.28,seed:F,arr:Be,caught:ke,fx:z,fz:$,gx:ce,gz:Fe,r:O.r*te,g:O.g*(b?1:.7+.6*T),b:O.b,kind:b}},A=[],R=[],M=[],h=U?.6:1;for(let r=0;r<9;r++){const v=r*2.4,p=1.85*Math.sqrt(r);A.push(s(Ct.x+Math.cos(v)*p,Ct.z+Math.sin(v)*p,1.35+.12*(r%3),0,r===0?!1:r%3===1))}for(let r=0;r<26;r++){const v=e()*6.28,p=11+e()*28;A.push(s(Pe+Math.cos(v)*p,Z+Math.sin(v)*p,1.1+e()*.25,0))}const g=Math.round(170*B*h);for(let r=0;r<g;r++){const v=30+(r+e())/g*575,p=r%2?1:-1;A.push(s(Te(Math.max(v,46))+p*(2.5+e()*9.5),Z-v,1.1+e()*.3,0)),r%60===59&&await a.yield()}const E=Math.round(1600*B*x*h);for(let r=0;r<E;r++){const v=e()<.42,p=(e()+e()+e()-1.5)*(v?90:56),b=v?35-e()*205:Z-40-e()*600;R.push(s(p,b,1+e()*.4,0)),r%300===299&&await a.yield()}const G=Math.round(400*B*x*(U?2.1:1));for(let r=0;r<G;r++){const v=e()<.3,p=(e()+e()+e()-1.5)*(v?80:50),b=v?30-e()*200:Z-40-e()*600;M.push(s(p,b,.7+e()*.25,1)),r%300===299&&await a.yield()}i.add(Zt(y0(4,[-1,-.5,0,.5,1]),A,Gt)),await a.yield(),i.add(Zt(y0(2,[-1,0,1]),R,Gt)),await a.yield(),i.add(Zt(co(e),M,Gt)),await a.yield()}const Rt=(e,t=.45,n=0)=>Le(X0,Y0,{...Je,...Re("uKeyCol","uFillCol","uCore","uFrostAlb","uFront","uHero"),uUnder:{value:e},uFuzz:{value:.85},uGrey:{value:t},uMottle:{value:n}},{side:o.DoubleSide,vertexColors:!0}),Ft=Oe.frameAt(!0,new o.Matrix4,!0),Vt=Oe.endTangent;{const e=N.fork("benthos"),t=Yt(),n=new o.Color,s=(r,v)=>{const p=oe.arrive(r-Pe,v-Z);return p<1e5?p:1e6},A=(r,v,p,b=!1)=>{const _=ie(r,v),d=e()*6.28,m=7+Math.floor(e()*3),F=s(r,v),T=m*(b?3:4),H=b?110:170,X=z=>[1,.014*p,d,z],j=z=>{const $=Math.sin(z*127.1+d*311.7)*43758.5453;return $-Math.floor($)},D=[0,.03,.07,.13,.22,.33,.45,.57,.69,.8,.89,.96,1],Y=[.985,.93,.82,.66,.5],ce=(z,$)=>.5+.5*Math.sin(z*m+d+1.4*$),Fe=(z,$)=>{const O=.118+.085*(1-J(0,.1,$))+.118*J(.04,.72,$)-.03*J(.84,1,$),te=.27*J(.02,.22,$);return p*O*(1-te*.55+te*Math.pow(ce(z,$),.7))*(1+.07*C.n3(Math.cos(z)*1.6+d,$*4,Math.sin(z)*1.6))},xe=z=>p*.035*C.n2(Math.cos(z)*2.3+d*3,Math.sin(z)*2.3)+p*.014*Math.sin(z*m+d+1.4),ae=(z,$,O,te)=>{const Q=Fe(z,$)*O,Me=r+Math.sin($*2.2+d)*p*.03*$+Math.cos(z)*Q,ze=v+Math.cos($*1.8+d)*p*.03*$+Math.sin(z)*Q,be=1-J(0,.1,$);return[Me,_+$*p+(be>0?be*(ie(Me,ze)-_-.45):0)+te,ze]};let ve=null;const ke=(z,$,O,te)=>{const Q=[];for(let Me=0;Me<T;Me++){const ze=Me/T*we,be=ae(ze,z,$,O?xe(ze):0);te?n.setRGB(.3,.36,.36).multiplyScalar(te).lerp(Qt.setRGB(.03,.07,.1),1-te):n.setRGB(.6,.61,.54).multiplyScalar((.36+.64*ge(1,ce(ze,z),J(.02,.22,z)))*(.78+.3*z)),Q.push(t.v(be[0],be[1],be[2],n,X(z),F))}if(ve)for(let Me=0;Me<T;Me++){const ze=(Me+1)%T;t.quad(ve[Me],ve[ze],Q[ze],Q[Me])}ve=Q};for(let z=0;z<D.length;z++)ke(D[z],1,z===D.length-1,0);for(let z=0;z<Y.length;z++)ke(Y[z],.87-.05*z,z===0,[1,.5,.22,.08,.02][z]);const Be=t.v(r,_+.46*p,v,n.setRGB(.03,.07,.1),X(.46),F);for(let z=0;z<T;z++)t.tri(ve[z],ve[(z+1)%T],Be);for(let z=0;z<H;z++){const $=z<H/4,O=$?1:.07+.9*j(z*3+1),te=Math.round(j(z*3+2)*m),Q=(Math.PI/2-d-1.4*O+we*te)/m+(j(z*3+3)-.5)*($?1:.36)*we/m,Me=Math.cos(Q),ze=Math.sin(Q),be=ae(Q,O,.97,$?xe(Q):0),pt=p*($?.05+.05*j(z*3+4):.03+.045*j(z*3+4)),Xe=$?1.5:.25+.6*j(z*3+5),at=pt/Math.hypot(1,Xe),mt=p*.008,lt=z%2,yt=lt?0:-ze*mt,ct=lt?mt:0,Pt=lt?0:Me*mt,gt=X(O);n.setRGB(.5,.52,.48);const T0=t.v(be[0]-yt,be[1]-ct,be[2]-Pt,n,gt,F),G0=t.v(be[0]+yt,be[1]+ct,be[2]+Pt,n,gt,F);t.tri(T0,G0,t.v(be[0]+Me*at,be[1]+Xe*at,be[2]+ze*at,n.setRGB(.68,.72,.7),gt,F))}};for(const r of[-.75,.15,.9,Math.PI-.5,Math.PI+.6]){const v=19+e()*3;A(Ye+Math.cos(r)*v,Z-v0-6+Math.sin(r)*v*.9,10+e()*4),await a.yield()}const R=Math.round((ee?14:7)*B);for(let r=0;r<R;r++){const v=-40+e()*560,p=e()<.5?-1:1;A(p*(20+e()*22),Z-v,6+e()*6,!0),await a.yield()}await a.yield();const M=st.fork("soft"),h=[1,0,0],g=[-.2,.2,.52,.8,1],E=[.62,.9,1,.86,.6];for(let r=0;r<Math.round(22*B);r++){const v=-60+e()*640,p=(e()<.5?-1:1)*(9+e()*26),b=Z-v,_=ie(p,b),d=s(p,b);for(let m=0;m<5;m++){const F=e()*6.28,T=1.2+e()*2.2,H=Math.cos(F)*T*.5,X=Math.sin(F)*T*.5,j=.4+.26*M(),D=M()*40,Y=.8+.3*M(),ce=.3+.5*M(),Fe=M()*6.28,xe=O=>[1,.04*T,Fe,O],ae=g.map(O=>{const te=Math.max(O,0),Q=te*(ce+(1-ce)*te);return[p+H*(.25+1.1*Q),_+T*1.2*O,b+X*(.25+1.1*Q)]}),ve=Ae(t,ae,8,(O,te)=>j*E[O]*(1+.27*C.n3(Math.cos(te)*1.2+D,g[O]*T*.9,Math.sin(te)*1.2)+.1*Math.sin(te*3+O*2.1+D)),{col:(O,te,Q,Me,ze,be)=>n.setRGB(.76,.62,.41).multiplyScalar(Y*(.6+.42*Math.max(g[O],0))*(1-.4*J(.05,.5,-C.n3(Me*1.6,ze*1.6,be*1.6)))),anim:O=>xe(Math.max(g[O],0)),arr:()=>d,flags:h}),ke=ve[4],Be=ae[4],z=[];for(let O=0;O<8;O++){const te=t.pos(ke[O]);z.push(t.v(ge(Be[0],te[0],.62),ge(Be[1],te[1],.5)-.24*j,ge(Be[2],te[2],.62),n.setRGB(.1,.11,.1),xe(1),d,h))}for(let O=0;O<8;O++){const te=(O+1)%8;t.quad(ke[O],ke[te],z[te],z[O])}const $=t.v(Be[0],Be[1]-.62*j,Be[2],n.setRGB(.03,.045,.05),xe(1),d);for(let O=0;O<8;O++)t.tri(z[O],z[(O+1)%8],$);for(let O=0;O<5;O++){const te=O<3?4:2+(O&1),Q=t.pos(ve[te][Math.floor(M()*8)%8]),Me=ae[te],ze=Q[0]-Me[0],be=Q[1]-Me[1],pt=Q[2]-Me[2],Xe=Math.hypot(ze,be,pt)||1,at=.35+.45*M(),mt=O<3?.9:.3,lt=-pt/Xe*.05,yt=ze/Xe*.05,ct=xe(Math.max(g[te],0));n.setRGB(.52,.5,.42);const Pt=t.v(Q[0]-lt,Q[1],Q[2]-yt,n,ct,d),gt=t.v(Q[0]+lt,Q[1],Q[2]+yt,n,ct,d);t.tri(Pt,gt,t.v(Q[0]+ze/Xe*at*.7,Q[1]+(be/Xe*.7+mt)*at,Q[2]+pt/Xe*at*.7,n.setRGB(.72,.72,.64),ct,d))}}await a.yield()}await a.yield();for(let r=0;r<Math.round(14*B);r++){const v=-50+e()*600,p=(e()<.5?-1:1)*(7+e()*20),b=Z-v,_=ie(p,b),d=e()*6.28,m=s(p,b);Ae(t,[[p,_-.2,b],[p,_+.7,b],[p,_+1.3,b]],8,F=>[.7,.55,.9][F],{col:()=>n.setRGB(.55,.42,.36),arr:()=>m});for(let F=0;F<18;F++){const T=F/18*6.28+d,H=.5+F%3*.2,X=Math.cos(T),j=Math.sin(T),D=1.2+e()*.6;Ae(t,[[p+X*H,_+1.25,b+j*H],[p+X*(H+D*.4),_+1.25+D*.6,b+j*(H+D*.4)],[p+X*(H+D*.9),_+1.25+D,b+j*(H+D*.9)]],3,Y=>[.11,.08,.03][Y],{col:Y=>n.setRGB(.66,.62,.56).multiplyScalar(.7+.15*Y),anim:(Y,ce)=>[1,.55,d+F,ce],arr:()=>m})}r%2===1&&await a.yield()}await a.yield();for(let r=0;r<6;r++){const v=r<2?-18+r*30:80+r*85,p=7+e()*8,b=r%2?1:-1,_=r<2?b*p:Te(v)+b*(p+5),d=Z-v,m=e()*6.28,F=[],T=M()*6.28,H=M()*6.28,X=96;for(let j=0;j<=X;j++){const D=j/X,Y=_+2.5*Math.sin(D*9.4+m)+.9*Math.sin(D*24+T)+.32*Math.sin(D*58+H),ce=d+1.9*Math.sin(D*15.7+m*2)+.8*Math.cos(D*21+H)+.3*Math.cos(D*63+T);F.push([Y,ie(Y,ce)+.16+.1*(1+Math.sin(D*41+T)),ce])}Ae(t,F,4,(j,D,Y)=>(.045+.085*Math.pow(Math.sin(Math.PI*_e(Y*.94+.03,0,1)),.4))*(.38+.62*Math.abs(Math.cos(D))),{col:(j,D,Y)=>n.setRGB(.66,.6,.47).multiplyScalar((.48+.52*J(-.35,.35,Math.sin(Y*120)))*(Math.sin(D)<-.5?.7:1)),anim:(j,D)=>[2,.4,m,D*2.6]}),r%2===1&&await a.yield()}await a.yield();for(let r=0;r<7;r++){const v=e()*6.28,p=12+e()*22,b=Pe+Math.cos(v)*p,_=Z+4+Math.sin(v)*p,d=Ie,m=e()*6.28,F=e(),T=[3,9,F,m],H=r>=4,X=Math.cos(m),j=Math.sin(m),D=H?.5:1;Ae(t,[[b-X*D,d+(H?1.3:.3),_-j*D],[b-X*D*.4,d+(H?1.35:.45),_-j*D*.4],[b+X*D*.4,d+(H?1.35:.45),_+j*D*.4],[b+X*D,d+(H?1.3:.3),_+j*D]],6,(ce,Fe)=>[.12,.3,.3,.1][ce]*(H?.5:1+.5*Math.abs(Math.cos(Fe))),{col:()=>H?n.setRGB(.5,.36,.2):n.setRGB(.36,.33,.28),anim:()=>T});const Y=H?8:6;for(let ce=0;ce<Y;ce++){const Fe=m+Math.PI/2*(ce%2?1:-1)+(Math.floor(ce/2)-(Y/4-.5))*(H?.55:.5),xe=Math.cos(Fe),ae=Math.sin(Fe),ve=H?2.3:.7,ke=H?1.3:.35;Ae(t,[[b+xe*.15,d+ke,_+ae*.15],[b+xe*ve*.5,d+ke+(H?.9:.15),_+ae*ve*.5],[b+xe*ve,d+.05,_+ae*ve]],3,()=>H?.06:.05,{col:()=>H?n.setRGB(.5,.36,.2):n.setRGB(.3,.28,.24),anim:()=>T})}}await a.yield();{const r=Pe+30,v=Z,p=Ie+10,b=()=>n.setRGB(.22,.24,.26);for(let d=0;d<3;d++){const m=d*2.094+.5;Ae(t,[[r+Math.cos(m)*4,Ie,v+Math.sin(m)*4],[r+Math.cos(m)*2,Ie+5,v+Math.sin(m)*2],[r,p,v]],4,F=>[.22,.17,.14][F],{col:b})}Ae(t,[[r+1.2,p+.9,v],[r+1,p+.9,v],[r-1.2,p+.9,v],[r-1.4,p+.9,v]],4,d=>[.3,1.15,1.15,.3][d],{col:()=>n.setRGB(.3,.32,.33),ref:[0,1,0]}),Ae(t,[[r-1.4,p+.9,v],[r-2.1,p+.85,v]],8,()=>.55,{col:()=>n.setRGB(.05,.07,.09),ref:[0,1,0]});const _=[];for(let d=0;d<=40;d++){const m=d/40;_.push([r+1.2+m*119,ge(p+.9,-.5,m)-16*Math.sin(Math.PI*m)*(1-m*.5),v+6*Math.sin(m*4)])}Ae(t,_,3,(d,m,F)=>.16+.5*F,{col:()=>n.setRGB(.5,.52,.5),anim:(d,m)=>[1,2.2*Math.sin(Math.PI*m),1.7,1]})}{const v=[.85,1,0],p=[],b=d=>qe-6+54*(.5+.5*Math.sin(d)),_=(d,m,F)=>n.setRGB(.085,.092,.105).multiplyScalar(.55+.9*(.5+.5*C.n3(d*.7,m*.7,F*.7)));for(let d=0;d<64;d++){const m=d/64*we,F=8.9+.35*Math.sin(m*5+1)+.25*C.n2(Math.cos(m)*2.2+9,Math.sin(m)*2.2);se.set(Math.cos(m)*F,Math.sin(m)*F,.4+.45*C.n2(Math.cos(m)*1.7,Math.sin(m)*1.7+30)).applyMatrix4(Ft),p.push([se.x,se.y,se.z,m])}Ae(t,p,10,(d,m)=>{const F=p[d][3],T=Math.cos(m)*1.2,H=Math.sin(m)*1.2;return 1.15*(1+.3*C.n3(Math.cos(F)*3+T,Math.sin(F)*3+H,7.7)+.16*C.n3(Math.cos(F)*8+T*2,Math.sin(F)*8+H*2,3.1))+.1*Math.sin(m*3+d*1.9)},{closed:!0,ref:[Vt.x,Vt.y,Vt.z],col:(d,m,F,T,H,X)=>_(T,H,X),arr:(d,m,F,T)=>b(p[T][3]),flags:v}),await a.yield();for(let d=0;d<11;d++){const m=d<6,F=m?Math.PI/2+(d-2.5)*.3+(M()-.5)*.14:-Math.PI/2+(d-8)*.36+(M()-.5)*.2,T=m?.8+M()*.8:1.5+M()*1.3,H=8.9+(m?.5+T*.35:T*.75)+M()*(m?.5:.8),X=M()*50,j=b(F);se.set(Math.cos(F)*H,Math.sin(F)*H,.4+(M()-.5)*(m?1.4:3.6)).applyMatrix4(Ft);const D=se.x,Y=se.y,ce=se.z,Fe=(M()-.5)*.6*T,xe=(M()-.5)*.6*T;Ae(t,[-1,-.6,-.1,.45,.85,1].map(ae=>[D+Fe*ae,Y+T*ae*.9,ce+xe*ae]),6,(ae,ve)=>T*[.2,.8,1,.85,.45,.06][ae]*(1+.42*C.n3(Math.cos(ve)*1.3+X,ae*.7,Math.sin(ve)*1.3)+.12*Math.sin(ve*2+X+ae)),{col:(ae,ve,ke,Be,z,$)=>_(Be,z,$),arr:()=>j,flags:v}),d%4===3&&await a.yield()}await a.yield();for(let d=0;d<220;d++){const m=d<100,F=m?Math.PI/2+(e()+e()-1)*1:e()*we,T=J(.2,.9,Math.sin(F)),H=8.9+(e()-.3)*2,X=-.5-e()*.9,j=1+e()*(.9+1.5*T),D=b(F)+e()*5,Y=.1+.08*j;se.set(Math.cos(F)*H,Math.sin(F)*H,.4+X).applyMatrix4(Ft),it.set(Math.cos(F)*(.5+e()+T)+(e()-.5)*.7,Math.sin(F)*(.5+e()+T)+(e()-.5)*.7,-(.25+e()*(1.2-.7*T))).transformDirection(Ft).multiplyScalar(j);const ce=n.setRGB(.6,.74,.78).multiplyScalar(.8+.4*e()),Fe=[4,0,0,0],xe=t.v(se.x-Y,se.y,se.z,ce,Fe,D),ae=t.v(se.x+Y,se.y,se.z,ce,Fe,D),ve=t.v(se.x,se.y+Y,se.z+Y*.7,ce,Fe,D),ke=t.v(se.x,se.y,se.z,ce,Fe,D,[it.x,it.y,it.z]);t.tri(xe,ae,ke),t.tri(ae,ve,ke),t.tri(ve,xe,ke),d%80===79&&await a.yield()}}await a.yield();const G=await t.buildSlow(a);await a.yield(),$e(new o.Mesh(G,Rt(0))),await a.yield()}const Ve=new o.Vector3,Dt=new o.Vector3,i0=new o.Vector3,kt=[[.47,-34,16,16],[.51,4,14,1],[.55,28,12,-4.5],[.6,36,13,-5.5],[.66,85,30,18],[.74,160,70,95],[1.01,200,80,120]],F0=(e,t,n)=>{const s=Math.max(e-n,.47);let A=0;for(;A<kt.length-2&&s>kt[A+1][0];)A++;const R=kt[A],M=kt[A+1],h=J(R[0],M[0],s)*.5+_e((s-R[0])/(M[0]-R[0]),0,1)*.5;Oe.pointAt(s,t),Oe.tangentAt(s,Ve),Ve.y=0,Ve.normalize();const g=ge(R[1],M[1],h),E=ge(R[2],M[2],h)+n*400,G=ge(R[3],M[3],h)+n*240;return t.set(t.x+Ve.x*g+Ve.z*E,t.y+G,t.z+Ve.z*g-Ve.x*E)},Et=(e,t,n,s=0)=>{const A=t*.11+s*60;Dt.set(xt.x+Math.cos(A)*22,-15-4*Math.sin(A*1.7),xt.z+Math.sin(A)*22);const R=J(.4,.47,e-s);return R<=0?n.copy(Dt):(F0(e,i0,s),n.lerpVectors(Dt,i0,R))};await a.yield();const k0=uo(C,24),B0=Rt(.5,.7,1),s0=[];for(let e=0;e<2;e++){const t=new o.Mesh(k0,B0);t.frustumCulled=!1,t.visible=e===0||V,i.add(t),s0.push(t)}const Ht=64,ht=new Float32Array(Ht*4),Ot=new o.InstancedBufferAttribute(ht,4);Ot.setUsage(o.DynamicDrawUsage);{const e=new o.InstancedBufferGeometry;e.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),e.setIndex([0,1,2,0,2,3]),e.setAttribute("iP",Ot),e.instanceCount=Ht,$e(new o.Mesh(e,Le(ao,no,Re("uIce","uCore"),{transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendEquation:o.AddEquation,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor})),5)}await a.yield();const P0={sunDir:he.clone(),sunColor:l.key,sunIntensity:1.1,sky:l.pane,skyIntensity:.55,ground:l.snow,groundIntensity:.5},Wt=$t.makeFauna(i,{light:P0});await a.yield(),Wt.add($t.makeFishSchool({rng:N.fork("fish"),species:"mackerel",count:Math.round(120*x),size:4,center:[-6,-8,-62],radius:34,height:2.5,top:"#9db3c6",belly:"#eef6fa"})),await a.yield();const qt=[[-22,-24,-66],[27,-31,-96],[46,-38,-152],[-42,-46,-116],[30,-53,-182]];for(const[e,t,n]of[[110,-1,12],[190,1,9],[270,-1,16],[350,1,8],[430,-1,14],[510,1,12],[565,-1,19],[320,1,38],[400,-1,50],[480,1,44],[545,-1,34]])qt.push([Te(e)+t*(20+n*.5),Ie+pe(e)+4.8+n,Z-e]);Wt.add($t.makeJellyfish({rng:N.fork("jelly"),count:qt.length,positions:qt,radius:1.5,length:6,bell:"#e9f3f6",inner:"#e0a244",glow:"#e0a244",glowIntensity:1.2,drift:[0,.04,0],pulse:.35,hueVariety:.1})),await a.yield();const l0=Ce.makeParticles({rng:N.fork("snow"),preset:"snow",time:Ne.uTime,count:Math.round(2400*x),box:[70,46,70],velocity:[0,-.45,0],size:[.05,.17],colors:["#DDF3F6","#9fe6ee",l.core],intensity:.75});i.add(l0.object),await a.yield();const c0=Ce.makeParticles({rng:N.fork("haze"),preset:"plankton",time:Ne.uTime,count:Math.round(1500*x),colors:["#cfeee6",l.pane,"#ffffff"],intensity:.8});i.add(c0.object),await a.yield();const tt=new o.Group,De=new o.Vector3;{const e=new o.Mesh(fo(N.fork("raft")),Rt(.6));e.frustumCulled=!1,tt.add(e),await a.yield();const t=st.fork("raftice"),n=20,s=new o.InstancedMesh(n0,r0,n),A=new o.Matrix4,R=new o.Quaternion,M=new o.Euler,h=new o.Vector3;for(let g=0;g<n;g++){const E=g/n*we+t.range(-.2,.2),G=g%4===0?t.range(0,3):t.range(3.6,6.6),r=t.range(.75,1.3),v=g%4===1;M.set((v?Math.PI:0)+t.range(-.5,.5),t.range(0,6.28),t.range(-.5,.5)),h.set(r,r*t.range(.7,1.1),r),s.setMatrixAt(g,A.compose(se.set(Math.cos(E)*G,v?-.4:.3,Math.sin(E)*G),R.setFromEuler(M),h))}s.instanceMatrix.needsUpdate=!0,s.frustumCulled=!1,tt.add(s),Oe.pointAt(.82,De),Oe.tangentAt(.82,Ve),Ve.y=0,Ve.normalize(),De.set(De.x-Ve.z*10.5,0,De.z+Ve.x*10.5),De.y=ie(De.x,De.z)+.4}tt.position.copy(De),tt.visible=W,i.add(tt),await a.yield();const Bt=new o.Vector3,S0=new o.Vector3,I0=new o.Vector3((Pe+Ct.x)/2,Ie+.5,(Z+Ct.z)/2),ot=new o.Vector3,jt=new o.Vector3,u0=new o.Vector3,_0=[{at:(e,t)=>(me.setLength(Jt(t)),me.tipPosition(Bt),Oe.pointAt(t,it),S0.set(Pe+Bt.x,Math.max(Ie+Bt.y+1.5,it.y-9),Z+Bt.z)),from:.02,to:le.td+.02,weight:.8,fade:.12},{at:I0,from:le.td-.05,to:le.ex+.035,weight:.6,fade:.3}],Ut=Ne.uKeyDir.value,f0=new o.Vector3,Lt=Ne.uRayC.value,K0=.2*L;return{scene:i,path:Oe,duration:42,pace:x0,pois:_0,ride:"none",camera:{fov:62,near:.3,far:3200,lookAhead:20,sway:.4,bank:.5},portal:{shape:"circle",radius:7,color:"#6FE6F2",glow:.8,tilt:!0,revealDistance:420},post:{exposure:l.exposure,bloom:{strength:.35,radius:.6,threshold:1},grade:{saturation:1.08,contrast:1.06,tint:"#f1fbff",shadowTint:"#020a18",vignette:.36,grain:.02,aberration:0}},update(e,t,n,s){Ne.uTime.value=t,n.getWorldPosition(u0);const A=J(58,105,-u0.y);Ne.uDeepK.value=A,i.fog.color.setRGB(ye.r+Lt.r*.4*A,ye.g+Lt.g*.4*A,ye.b+Lt.b*.4*A);for(let g=3;g<dt.length;g++)dt[g].uniforms.uIntensity.value=K0*(.2+.8*A);Ne.uGiant.value=J(.3,.5,s);const R=re+(s-.5)*.7+.05*Math.sin(t*.11),M=Math.sin(I);Ut.set(-M*Math.cos(R),Math.cos(I),M*Math.sin(R)+.1).normalize(),me.setLight(Ut,q),f0.copy(Ut).negate();for(const g of dt)g.uniforms.uDir.value.copy(f0);me.setLength(Jt(s)),me.setTouch(_e((s-le.td)/.035,0,1)),me.setFront(b0(s)),me.update(e,t,n),Wt.update(e,t,n,s),l0.update(e,t,n),c0.update(e,t,n);for(let g=0;g<2;g++){const E=g*.03,G=s0[g];Et(s,t,ot,E),Et(s+.004,t+.35,jt,E),G.position.copy(ot),jt.distanceToSquared(ot)>1e-6&&G.lookAt(jt)}const h=s>.44&&s<.78;for(let g=0;g<Ht;g++){const E=g*.618034%1,G=(t*.5+E)%1,r=g*4;Et(s-G*.012,t-G*1.2,ot,0),ht[r]=ot.x+Math.sin(g*2.4+t*1.3)*(.6+G*2.2),ht[r+1]=ot.y+1.5+G*9,ht[r+2]=ot.z+Math.cos(g*1.7+t*1.1)*(.6+G*2.2),ht[r+3]=h?(.14+.3*E)*Math.min(G*6,1)*(1-G*G)+1e-4:-1}if(Ot.needsUpdate=!0,W){const g=J(.66,.92,s),E=g*g*30,G=J(.66,.78,s);tt.position.set(De.x+3*Math.sin(t*.3)*g,De.y+E,De.z),tt.rotation.set(.5*G+.1*Math.sin(t*.5)*g,0,.3*G+.08*Math.cos(t*.4)*g)}},dispose(){me.dispose()}}}};export{mo as default};
