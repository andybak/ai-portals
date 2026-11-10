import*as d from"three";import{makePath as ks}from"../kit/core.js";import{buildHero as Ms,makeCranes as Bo,makePuffs as zs,makeBreath as Ss,LIGHT_GLSL as Ue}from"../parts/cranes-in-steam.js";const Oe=["#0B1620","#F6F3F7","#F4B8B0","#FFC9A0","#8FA3CF","#5B5F8C","#D4202A"],G0=42,bt=24,i0=(n,r=1)=>new d.Color(n).multiplyScalar(r),$=(n,r,D)=>Math.min(D,Math.max(r,n)),I=(n,r,D)=>n+(r-n)*D,H=(n,r,D)=>{const S=$((D-n)/(r-n),0,1);return S*S*(3-2*S)},As={dawn:{hero:"dawn",el:5,sun:["#FFC9A0",1.25],sky:["#8FA3CF",.8],zen:"#5B5F8C",horS:"#F2B49C",horA:"#B49CC0",belt:"#EFA9B0",slate:"#626C98",glow:1,stars:0,over:0,stA:["#8C8CC6",.7],stB:["#F4B8B0",.88],scat:.42,dens:1,far:"#5B5F8C",farS:"#C0949C",exposure:1,bloom:.34,sat:1.1,glit:1,fall:1,sleep:.15,shadow:"#141a36",deep:["#0B1620",.95]},blue:{hero:"blue",el:-3,sun:["#B79AD0",.5],sky:["#7E90CF",.62],zen:"#28336A",horS:"#D98CA4",horA:"#48548C",belt:"#6C6AA6",slate:"#38426E",glow:.25,stars:.25,over:0,stA:["#5E63A0",.62],stB:["#A994CC",.7],scat:.3,dens:1.1,far:"#3A4478",farS:"#8A6C96",exposure:1.45,bloom:.3,sat:1.12,glit:.5,fall:.7,sleep:.7,shadow:"#0c1230",deep:["#0A1226",.8]},morning:{hero:"morning",el:15,sun:["#FFF0DC",1.3],sky:["#8FB0E6",.7],zen:"#2B58A6",horS:"#C6DAF0",horA:"#A2BEE4",belt:"#B4C8E8",slate:"#9AB4DC",glow:.8,stars:0,over:0,stA:["#9FB2DA",.8],stB:["#EEE8EC",.84],scat:.35,dens:.42,far:"#7C98CC",farS:"#B4C6E4",exposure:.92,bloom:.3,sat:1.1,glit:2.2,fall:3,sleep:0,shadow:"#0e1c3c",deep:["#08182C",1]},evening:{hero:"evening",el:4,sun:["#FF9648",1.5],sky:["#6FA0C4",.6],zen:"#2A5676",horS:"#FF8A40",horA:"#7F90B2",belt:"#C0909A",slate:"#566C8C",glow:1.15,stars:0,over:0,stA:["#6C6C92",.6],stB:["#FFC08C",.8],scat:.36,dens:.85,far:"#54688A",farS:"#E89658",exposure:1,bloom:.36,sat:1.18,glit:1,fall:1,sleep:.1,shadow:"#0c1a2a",deep:["#08161E",.9]},moon:{hero:"moon",el:24,sun:["#9FB4E8",.55],sky:["#6E86D0",.3],zen:"#070C20",horS:"#1C2A50",horA:"#121C3C",belt:"#18244C",slate:"#0E1632",glow:.5,stars:1,over:0,stA:["#24345E",.6],stB:["#6C84BC",.62],scat:.4,dens:.9,far:"#101A38",farS:"#1E2C54",exposure:1.9,bloom:.4,sat:1.05,glit:1.4,fall:.8,sleep:.6,shadow:"#050816",deep:["#050A16",.8]},snow:{hero:"dawn",weather:"snow",el:9,sun:["#E6D8D8",.5],sky:["#A6ACC8",.95],zen:"#9896A8",horS:"#C4BEC8",horA:"#B0AEBE",belt:"#B0AEBE",slate:"#B0AEBE",glow:.2,stars:0,over:1,stA:["#8E8EA4",.78],stB:["#C4C0CC",.84],scat:.1,dens:1.15,far:"#A4A2B4",farS:"#B8B4C2",exposure:1,bloom:.25,sat:.96,glit:.2,fall:.5,sleep:.3,shadow:"#20243c",deep:["#0C1420",1]}},Ws={dawn:{k:1,gold:"#FFAE62",disc:1},evening:{k:.8,gold:"#FF9A48",disc:1},morning:{k:.4,gold:"#FFDCAE",disc:.7},blue:{k:0,gold:"#B79AD0",disc:0},moon:{k:0,gold:"#9FB4E8",disc:0},snow:{k:0,gold:"#E6D8D8",disc:0}},I0=`
uniform vec3 uStSun; uniform vec3 uStA; uniform vec3 uStB; uniform vec3 uStScat; uniform vec3 uStFar; uniform vec3 uStFarS;
uniform vec4 uStP; uniform vec4 uStBk[5]; uniform vec3 uStBr[5]; uniform vec3 uStGold;      // uStGold: the gold the smoke takes close about the sun
float stH(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float stN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(stH(i), stH(i + vec2(1.0, 0.0)), f.x), mix(stH(i + vec2(0.0, 1.0)), stH(i + vec2(1.0, 1.0)), f.x), f.y); }
float stErf(float x){ float a = abs(x); float t = 1.0 / (1.0 + 0.47047 * a);
  float y = 1.0 - t * (0.3480242 + t * (-0.0958798 + t * 0.7478556)) * exp(-a * a); return x < 0.0 ? -y : y; }
float stBank(vec3 o, vec3 dir, float d, vec4 c, vec3 ir){
  vec3 oc = (o - c.xyz) * ir; vec3 dr = dir * ir;
  float a = max(dot(dr, dr), 1e-6); float b = dot(oc, dr); float sa = sqrt(a);
  float ex = exp(min(b * b / a - dot(oc, oc), 0.0));
  return c.w * ex * 0.8862269 / sa * (stErf(sa * d + b / sa) - stErf(b / sa));
}
// steam glows, but under white: held below about 0.86 so the frosted reeds and twigs in front of it keep their lines and only rims bloom
vec3 stHold(vec3 c){ float m = max(c.r, max(c.g, c.b)); return m > 0.62 ? c * ((0.62 + 0.24 * (1.0 - exp(-(m - 0.62) / 0.24))) / m) : c; }
vec3 steamApply(vec3 c, vec3 wp, float farK){
  vec3 rd = wp - cameraPosition; float d = length(rd); vec3 dir = rd / max(d, 1e-3);
  float H = uStP.y; float y0 = clamp(abs(cameraPosition.y), 0.0, 200.0); float y1 = clamp(wp.y, -1.0, 400.0);
  float e0 = exp(-y0 / H); float e1 = exp(-y1 / H); float dy = y1 - y0;
  float mean = abs(dy) > 0.05 ? H * (e0 - e1) / dy : e0;
  float dd = min(d, 240.0);
  vec2 q = cameraPosition.xz + dir.xz * min(dd, 80.0) * 0.55;
  float n = 0.65 * stN(q * 0.045 + vec2(-uStP.w * 0.027, 0.0)) + 0.35 * stN(q * 0.13 + vec2(-uStP.w * 0.06, uStP.w * 0.013));
  float pat = smoothstep(0.42, 0.78, n);                         // the smoke stands in separate columns: clear air between them
  float tau = uStP.x * dd * smoothstep(6.0, 60.0, dd) * mean * (0.08 + 1.9 * pat * pat);
  float tb = stBank(cameraPosition, dir, d, uStBk[0], uStBr[0]) + stBank(cameraPosition, dir, d, uStBk[1], uStBr[1]) + stBank(cameraPosition, dir, d, uStBk[2], uStBr[2]);
  // the two banks we fly through hang in layers: sheets a metre or two thick, tens of metres long, sliding downstream, thick and thin by turns
  vec3 ps = cameraPosition + dir * min(d, 18.0);
  float strat = 0.6 * stN(vec2((ps.x + 0.6 * ps.z) * 0.07 - uStP.w * 0.05, ps.y * 0.85)) + 0.4 * stN(vec2((ps.x - 0.5 * ps.z) * 0.19 - uStP.w * 0.12, ps.y * 2.1 + 5.0));
  float tc = (stBank(cameraPosition, dir, d, uStBk[3], uStBr[3]) + stBank(cameraPosition, dir, d, uStBk[4], uStBr[4])) * (0.25 + 1.5 * strat);
  tb += tc;
  float fs = max(dot(dir, uStSun), 0.0); fs *= fs; fs *= fs;
  vec2 sx = uStSun.xz / max(length(uStSun.xz), 1e-3);
  float side = 0.5 + 0.5 * dot(dir.xz, sx);
  float fg = fs * fs; fg *= fg; float fc0 = fg * fg; fc0 *= fc0; fc0 *= fc0;      // (the gold lies close about the sun: the sixteenth power of the cosine; the sun's own place in the smoke: the 128th)
  vec3 sc = stHold(mix(uStA, uStB, clamp(0.2 + 0.75 * side - 0.3 * smoothstep(0.5, 2.4, tau + tb), 0.0, 1.0)) + uStScat * fs + uStGold * (fg + 0.5 * fs)) + uStGold * 1.4 * fc0;
  sc *= 1.0 - 0.3 * (1.0 - exp(-tc)) * (1.0 - side) * (1.0 - smoothstep(-0.05, 0.3, dir.y));           // inside a bank the smoke low on the shaded hand is in its own shadow: lilac-blue, darker than the lit side
  vec3 fc = mix(uStFar, uStFarS, side * side);
  c = mix(fc, c, exp(-uStP.z * d * farK));
  return mix(sc, c, exp(-(tau + tb)));
}`,Bs=`varying vec3 vStWp;
`+I0;function ya(n,r){!n||!n.isShaderMaterial||n.userData.steam||!n.fragmentShader.includes("#include <fog_fragment>")||!n.vertexShader.includes("#include <fog_vertex>")||(n.vertexShader=n.vertexShader.replace("#include <fog_pars_vertex>",`#include <fog_pars_vertex>
varying vec3 vStWp;`).replace("#include <fog_vertex>",`#include <fog_vertex>
  vStWp = cameraPosition + mvPosition.xyz * mat3(viewMatrix);`),n.fragmentShader=n.fragmentShader.replace("#include <fog_pars_fragment>",`#include <fog_pars_fragment>
`+Bs).replace("#include <fog_fragment>","gl_FragColor.rgb = steamApply(gl_FragColor.rgb, vStWp, 1.0);"),Object.assign(n.uniforms,r),n.userData.steam=!0,n.needsUpdate=!0)}const Fs="varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",Fo=`
uniform vec3 uZen; uniform vec3 uHorS; uniform vec3 uHorA; uniform vec3 uBelt; uniform vec3 uSlate; uniform vec3 uSunC; uniform vec4 uSkyK;   // glow, stars, overcast, time
uniform vec3 uGold; uniform vec4 uSunK;        // the second colour, and (the sun's disc, its aureole, the gold on the horizon under it, the path on the water)
vec3 skyBase(vec3 dir, vec3 sun){
  float h = max(dir.y, 0.0);
  vec2 sx = sun.xz / max(length(sun.xz), 1e-3); float az = dot(dir.xz / max(length(dir.xz), 1e-3), sx);
  vec3 hor = mix(uHorA, uHorS, smoothstep(-0.35, 1.0, az));
  float t = 1.0 - h; float t2 = t * t;
  vec3 c = mix(uZen, hor, t2 * t2 * mix(t, 1.0, 0.5));
  float anti = (1.0 - smoothstep(-0.85, 0.15, az)) * (1.0 - uSkyK.z);
  float bz = (h - 0.12) / 0.07; c = mix(c, uBelt, anti * 0.75 * exp(-bz * bz));
  c = mix(c, uSlate, anti * 0.85 * (1.0 - smoothstep(0.0, 0.085, h)));
  return c;
}`,Ts=`
varying vec3 vDir; uniform vec3 uSunDir; uniform vec3 uDeep; uniform vec3 uSky;
${Fo}
${I0}
float skH(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
void main(){
  vec3 dir = normalize(vDir);
  vec3 c = skyBase(dir, uSunDir);
  float cs = max(dot(dir, uSunDir), 0.0);
  float c2 = cs * cs; float c8 = c2 * c2; c8 *= c8; float c64 = c8 * c8; c64 *= c64; c64 *= c64; float c512 = c64 * c64; c512 *= c512; c512 *= c512;
  c += uSunC * uSkyK.x * (0.9 * c512 + 0.26 * c64 + 0.11 * c8 * (1.0 - 0.6 * uSkyK.z));
  // the sun itself: a disc soft at the limb (1.0 to 1.4 degrees from its centre) in a gold aureole, and a band of gold lying on the horizon under it
  float limb = 1.0 - smoothstep(1.5e-4, 3.0e-4, 1.0 - cs); float c2k = c512 * c512; c2k *= c2k;
  vec2 sxs = uSunDir.xz / max(length(uSunDir.xz), 1e-3); float azs = max(dot(dir.xz / max(length(dir.xz), 1e-3), sxs), 0.0); float az8 = azs * azs; az8 *= az8; az8 *= az8; float az3 = azs * azs * azs;
  c *= mix(vec3(1.0), vec3(1.1, 0.8, 0.52), uSunK.y * (0.75 * c8 + 0.5 * az3 * exp(-max(dir.y, 0.0) / 0.14)));          // the air about a low sun takes the blue out of the sky behind it
  c += uGold * (uSunK.x * (4.0 * limb + 0.9 * c2k) + uSunK.y * (0.5 * c64 * c64 + 0.2 * c8 * c8) + uSunK.z * (0.3 * az8 + 0.22 * az3) * exp(-max(dir.y, 0.0) / 0.07));
  if (uSkyK.y > 0.01) {
    vec3 g = dir * 150.0; vec3 id = floor(g); float hs = skH(id);
    float st = step(0.975, hs) * (1.0 - smoothstep(0.1, 0.42, length(fract(g) - 0.5))) * (0.5 + 0.5 * sin(uSkyK.w * (0.6 + 2.0 * skH(id + 3.0)) + hs * 40.0));
    c += vec3(0.7, 0.8, 1.0) * st * uSkyK.y * smoothstep(0.02, 0.3, dir.y) * 1.4;
  }
  float dn = max(-dir.y, 0.0);
  if (dn > 0.0) {                                               // the river running on under everything, 2 m below the eye
    float fr = 1.0 - dn; float F = 0.06 + 0.9 * fr * fr * fr;
    c = uDeep + (uZen * 0.09 + uSky * 0.012 + uHorS * 0.012) * (0.5 + 0.5 * dn) + mix(c, uZen, 0.3) * F;
    c = steamApply(c, cameraPosition + dir * min(2.0 / max(dn, 1e-3), 2500.0), 1.0);
  } else c = steamApply(c, cameraPosition + dir * 2500.0, 0.0);
  gl_FragColor = vec4(c, 1.0);
}`,Cs=`
varying vec3 vWp; varying vec3 vN;
void main(){
  vec4 p = vec4(position, 1.0); vec3 n = normal;
  #ifdef USE_INSTANCING
    p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
  #endif
  vec4 wp = modelMatrix * p; vWp = wp.xyz; vN = mat3(modelMatrix) * n;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Rs=`
varying vec3 vWp; varying vec3 vN; uniform float uTime; uniform vec4 uLand; uniform vec3 uShadowC;      // uLand = (thaw, shadow strength, sparkle, -)
${Ue}
${I0}
// river shingle: one rounded stone per cell. Returns (distance to the nearest stone's centre, that stone's own tone)
vec2 lcob(vec2 p){
  vec2 ip = floor(p), fp = fract(p); float best = 9.0; float tone = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 id = ip + g;
    vec2 r = g + vec2(h2(id), h2(id + 17.3)) * 0.7 + 0.15 - fp;
    float d = dot(r, r); if (d < best) { best = d; tone = h2(id + 31.7); }
  }
  return vec2(sqrt(best), tone);
}
void main(){
  vec3 N = vN / max(length(vN), 1e-4);
  vec3 Vv = cameraPosition - vWp; float dist = length(Vv); Vv /= max(dist, 1e-4);
  float fwL = 1.5 * sqrt(length(dFdx(vWp.xz)) * length(dFdy(vWp.xz)));
  float steep = 1.0 - N.y;
  float n1 = vnoise(vWp.xz * 0.35); float n2 = vnoise(vWp.xz * 2.3 + 11.0); float n3 = vnoise(vWp.xz * 9.0);
  vec3 SNOW = vec3(0.60, 0.61, 0.645) * (0.93 + 0.1 * n1);
  // wind-packed snow: fine relief in the lighting, fading with distance
  float nearK = 1.0 - smoothstep(25.0, 90.0, dist);
  N = normalize(N + vec3(n2 - 0.5, 0.0, n3 - 0.5) * 0.35 * nearK + vec3(vnoise(vWp.xz * 0.9 + 3.0) - 0.5, 0.0, n1 - 0.5) * 0.25);
  vec3 alb = SNOW;
  // thaw: buff grass and dark earth showing through
  float bare = uLand.x * smoothstep(0.5, 0.62, 0.6 * n1 + 0.4 * vnoise(vWp.xz * 0.11 + 5.0)) * (1.0 - smoothstep(30.0, 90.0, vWp.y));
  alb = mix(alb, vec3(0.24, 0.19, 0.10) * (0.6 + 0.8 * n3), bare);
  // cut bank: frozen earth in strata, roots, frost creeping down
  float bank = smoothstep(0.3, 0.6, steep) * (1.0 - smoothstep(6.0, 14.0, vWp.y));
  float st = vnoise(vec2(vWp.x * 0.6 + vWp.z * 0.3, vWp.y * 8.0)); float cl = vnoise(vWp.xy * 3.1 + vWp.z * 2.3);
  vec3 earth = vec3(0.040, 0.037, 0.044) * (0.5 + 0.9 * st * cl + 0.4 * cl);
  earth = mix(earth, SNOW, smoothstep(0.45, 0.8, 0.5 * n3 + 0.3 * st + 0.25 * smoothstep(0.8, 2.6, vWp.y)));
  alb = mix(alb, earth, bank);
  float shoreK = (1.0 - smoothstep(0.2, 0.4, vWp.y + 0.3 * (n1 - 0.5) + 0.1 * (n2 - 0.5))) * (1.0 - bank) * nearK;                 // the foot of every bar and islet: wet shingle, rimed, with a rind of ice at the waterline
  float peb = vnoise(vWp.xz * 7.0) * vnoise(vWp.xz * 17.0 + 3.0);
  vec3 shing = mix(vec3(0.05, 0.05, 0.058), vec3(0.21, 0.2, 0.2), smoothstep(0.1, 0.5, peb)) * (0.7 + 0.6 * n3);
  if (shoreK > 0.01) {                                             // close to, the shingle is stones: cobbles the size of a fist among loaves, dark wet joints, rime on the crowns of the dry ones
    float kA = 1.0 - smoothstep(0.45, 1.0, fwL * 2.6); float kB = 1.0 - smoothstep(0.45, 1.0, fwL * 8.0);
    vec2 cA = lcob(vWp.xz * 2.6 + 5.0); vec2 cB = lcob(vWp.xz * 8.0);
    float stA = (1.0 - smoothstep(0.36, 0.66, cA.x)); float stB = (1.0 - smoothstep(0.3, 0.62, cB.x));
    vec3 stone = mix(vec3(0.07, 0.072, 0.085), vec3(0.25, 0.235, 0.215), 0.25 + 0.75 * cB.y) * mix(vec3(0.85, 0.95, 1.12), vec3(1.12, 1.0, 0.86), cA.y);
    vec3 det = mix(vec3(0.022, 0.022, 0.028), stone, mix(1.0, stB, kB)) * mix(1.0, 0.55 + 0.6 * stA * (0.6 + 0.8 * cA.y), kA);
    float dry = smoothstep(0.1, 0.24, vWp.y);
    det = mix(det, vec3(0.5, 0.51, 0.55), dry * kB * (1.0 - smoothstep(0.15, 0.4, cB.x)) * step(0.45, cB.y) * 0.75);
    shing = mix(shing, det, max(kA, kB));
  }
  alb = mix(alb, shing, shoreK * 0.85);
  alb = mix(alb, vec3(0.34, 0.42, 0.52), (1.0 - smoothstep(0.02, 0.07, abs(vWp.y - 0.03))) * 0.7 * nearK);
  // far hills: dark spruce and bare oak as blue-grey texture between snowfields
  float hill = smoothstep(12.0, 40.0, vWp.y);
  float wood = smoothstep(0.38, 0.6, 0.55 * vnoise(vWp.xz * 0.012 + 7.0) + 0.3 * vnoise(vWp.xz * 0.05) + 0.15 * vnoise(vWp.xz * 0.21) + 0.25 * steep);
  alb = mix(alb, mix(vec3(0.035, 0.05, 0.07), vec3(0.16, 0.15, 0.17), vnoise(vWp.xz * 0.03 + 20.0)) * (0.7 + 0.6 * vnoise(vWp.xz * 0.4)), hill * wood);
  // long blue tree shadows raking across the snow, sliding as the sun climbs
  vec2 sx = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  vec2 sp = vec2(dot(vWp.xz, vec2(-sx.y, sx.x)), dot(vWp.xz, sx));
  float sh = smoothstep(0.40, 0.62, 0.7 * vnoise(vec2(sp.x * 0.16 + uTime * 0.012, sp.y * 0.011)) + 0.3 * vnoise(vec2(sp.x * 0.55, sp.y * 0.03 + 4.0)));
  sh *= uLand.y * (1.0 - hill) * (1.0 - bank);
  float ndl = dot(N, uSunDir); float wrap = clamp((ndl + 0.3) / 1.3, 0.0, 1.0);
  vec3 c = alb * (uSunCol * wrap * 1.5 * (1.0 - sh) + mix(uGround, uSky, N.y * 0.5 + 0.5) * (1.0 - 0.25 * sh));
  c = mix(c, c * 0.6 + uShadowC * 0.25, sh * 0.5);
  float gl = step(0.988, h2(floor(vWp.xz * 55.0))) * (1.0 - bank) * (1.0 - bare) * nearK * (1.0 - sh);
  c += uSunCol * gl * uLand.z * 1.5 * (0.5 + 0.5 * sin(dot(Vv, vec3(41.0, 13.0, 29.0)) + vWp.x * 3.0));
  gl_FragColor = vec4(steamApply(c, vWp, 1.0), 1.0);
}`,Ps=`
attribute vec4 aF; attribute vec2 aT; varying vec3 vWp; varying vec4 vF; varying vec2 vT;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vWp = wp.xyz; vF = aF; vT = aT; gl_Position = projectionMatrix * viewMatrix * wp; }`,Ns=`
varying vec3 vWp; varying vec4 vF; varying vec2 vT;
uniform float uTime; uniform vec4 uIslet[10]; uniform vec2 uIsletDir[10]; uniform vec4 uRif[${bt}]; uniform vec4 uWat; uniform vec3 uDeep;     // uRif = a gravel riffle in river space (d, s, half length, half width)
//     // uWat = (shelf ice, pans, sheen, gallery mirror)
uniform sampler2D uGal; uniform vec2 uGalR; uniform vec4 uBar; uniform vec3 uFrostL; uniform vec3 uFrostR; uniform vec4 uSkin; uniform vec4 uIce;      // uIce = (the long shadows on the ice, the gold on it, -, -)          // uGalR = (first d, 1 / span)  uBar = (half length, front z, -, -)
${Ue}
${Fo}
${I0}
// the streamlines: long low swells drawn out along the current (x down the flow, y across it), a metre or two apart and tens of metres
// long, sliding downstream. k = how much of each size one pixel can still hold. They are a few millimetres high: they only tip the mirror.
float wH(vec2 p, vec2 k){
  float s1 = vnoise(vec2(p.x * 0.05 - uTime * 0.06, p.y * 0.9 + 0.4 * sin(p.x * 0.045)));
  float s2 = vnoise(vec2(p.x * 0.14 - uTime * 0.17 + 7.0, p.y * 2.3 + 3.0));
  return 0.62 * k.x * s1 + 0.3 * k.y * s2;
}
// the cat's-paw: fine wavelets that ride with the current inside a lane of ruffled water. Three trains of crests cross one another aslant,
// each bent by a slow wave of its own, so the crests are short and no two alike: no train is read from a grid, and the wavelets never
// fall into cells or into ruled bars
float wFine(vec2 p){
  float a = p.x * 9.3 + p.y * 1.9 - uTime * 11.2 + 1.8 * sin(p.y * 2.3 + 0.7 * sin(p.x * 1.1));
  float b = p.x * 6.1 + p.y * 4.3 - uTime * 7.3 + 1.5 * sin(p.y * 1.1 - p.x * 0.6 + 2.0);
  float c = p.x * 7.7 - p.y * 5.2 - uTime * 9.2 + 1.4 * sin(p.x * 0.8 + p.y * 0.9);
  return 0.5 + 0.19 * sin(a) + 0.17 * sin(b) + 0.15 * sin(c);
}
// standing ripples over a gravel bar: short crests across the flow, in patches, that keep their place and only shiver
float wStand(vec2 p){ return sin(p.x * 7.5 + 9.0 * vnoise(p * vec2(0.5, 1.3) + 3.0) + 0.5 * sin(uTime * 1.9 + p.y * 2.1)) * smoothstep(0.35, 0.7, 0.5 + 0.5 * sin(p.y * 2.1 + 3.0 + 1.5 * sin(p.x * 0.6))); }
float isD(vec4 I, vec2 D){ vec2 il = vWp.xz - I.xy; il = vec2(il.x * D.x + il.y * D.y, -il.x * D.y + il.y * D.x);       // metres to the edge of a long ellipse, true off its tips as well as off its sides
  float k0 = length(il / I.zw); float k1 = length(il / (I.zw * I.zw)); return k0 < 0.08 ? -I.w : k0 * (k0 - 1.0) / max(k1, 1e-4); }
// one pan per cell, turning as it drifts. q = river coords moving with the flow; sy, shore, sgn give the distance
// to the shore at the CELL centre, so a pan is whole or absent, never cut. Returns the signed distance to its edge in metres.
float panCell(vec2 q, float cell, float seed, float rmin, float rmax, float dens, float sy, float shore, float sgn, float minS, float laneK){
  vec2 pp = q / cell; vec2 ic = floor(pp); vec2 id = ic + seed; vec2 pf = fract(pp) - 0.5;
  float ph = stH(id); float r = mix(rmin, rmax, stH(id + 9.1));
  vec2 jit = (vec2(stH(id + 1.7), stH(id + 5.3)) - 0.5) * (0.8 - 2.0 * r);
  vec2 pj = pf - jit;
  float shoreC = shore + sgn * ((ic.y + 0.5 + jit.y) * cell - sy);
  float cy = (ic.y + 0.5 + jit.y) * cell;
  float ln = (cy - 2.3 * sin(ic.x * cell * 0.043 + 1.7)) / 2.4;                       // the drift line: pans ride one meandering streamline down the middle
  float ln2 = (cy - 7.7 - 1.2 * sin(ic.x * cell * 0.031 + 0.4)) / 1.5;                 // ... and a second line on our right hand
  float k = max((0.26 + 0.74 * (1.0 - smoothstep(2.5, 12.0, shoreC))) * (0.2 + 0.8 * smoothstep(0.3, 0.62, stN(ic * cell * vec2(0.03, 0.09) + seed))), laneK * max(exp(-ln * ln), 0.9 * exp(-ln2 * ln2)));
  float has = step(ph, dens * k) * step(r * cell * 1.35 + 0.5, shoreC) * step(minS, abs(cy));
  float rot = ph * 40.0 + uTime * (ph - 0.5) * 0.45; float ca = cos(rot), sa = sin(rot); pj = vec2(pj.x * ca - pj.y * sa, pj.x * sa + pj.y * ca);
  float pa = atan(pj.y + 1e-5, pj.x);
  float rr = r * (1.0 + 0.11 * sin(pa * 3.0 + ph * 37.0) + 0.06 * sin(pa * 5.0 + ph * 11.0) + 0.03 * sin(pa * 8.0 + ph * 61.0));
  float dd = (length(pj) - rr) * cell; float m = 0.04 * cell;                  // outside the pan the distance runs away to infinity before the cell's edge, so no soft edge, fringe or far-off blur can show the cell's square
  dd = dd > 0.0 ? dd / max(1.0 - dd / m, 0.02) : dd;
  return mix(9.0, dd, has);
}
float panSD(vec2 q, float sy, float shore, float sgn, float crumbs, out float fr){      // fr: the slush fringe, its width cut to each cell so it never shows the cell's square
  float d = panCell(q, 6.2, 0.0, 0.2, 0.3, uWat.y * 0.55, sy, shore, sgn, 3.8, 0.85);
  fr = 1.0 - smoothstep(0.0, 0.7, d);
  float d2 = panCell(q + vec2(1.3, 0.0), 2.7, 31.0, 0.15, 0.3, uWat.y * 0.8, sy, shore, sgn, 0.0, 0.92);
  fr = max(fr, 1.0 - smoothstep(0.0, 0.4, d2)); d = min(d, d2);
  d2 = mix(9.0, panCell(q + vec2(0.4, 0.0), 0.95, 77.0, 0.15, 0.3, uWat.y * 0.7, sy, shore, sgn, 0.0, 0.2), crumbs);
  fr = max(fr, 1.0 - smoothstep(0.0, 0.2, d2)); d = min(d, d2);
  return d;
}
// the river bed: one cobble per cell with dark wet joints. Returns (distance to the nearest stone's centre, that stone's own tone)
vec2 cobble(vec2 p){
  vec2 ip = floor(p), fp = fract(p); float best = 9.0; float tone = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 id = ip + g;
    vec2 r = g + vec2(stH(id), stH(id + 17.3)) * 0.7 + 0.15 - fp; r.y *= 1.0 + 0.5 * stH(id + 5.1);
    float d = dot(r, r); if (d < best) { best = d; tone = stH(id + 31.7); }
  }
  return vec2(sqrt(best), tone);
}
void main(){
  vec3 Vv = cameraPosition - vWp; float dist = length(Vv); Vv /= max(dist, 1e-4);
  float fwp = length(fwidth(vWp.xz));
  float fwr = 1.5 * sqrt(length(dFdx(vWp.xz)) * length(dFdy(vWp.xz)));
  vec2 T = vT / max(length(vT), 1e-4); vec2 Nr = vec2(-T.y, T.x);
  float di = 99.0; for (int i = 0; i < 10; i++) di = min(di, isD(uIslet[i], uIsletDir[i]));
  float shoreB = min(vF.z, vF.w); float shore = min(shoreB, di);
  float dBar = length(max(vec2(abs(vWp.x + 4.0) - uBar.x, vWp.z - uBar.y), 0.0));
  float shal = max((1.0 - smoothstep(0.4, 3.8, shore)), 0.7 * (1.0 - smoothstep(0.8, 4.5, dBar)) * step(vWp.z, 30.0));
  vec2 q = vF.xy;
  // riffles: gravel shallows in mid-channel, their edges eaten by the current
  float rif = 0.0; for (int i = 0; i < ${bt}; i++) { vec2 e = (q - uRif[i].xy) / uRif[i].zw; rif = max(rif, 1.0 - dot(e, e)); }
  rif = smoothstep(0.05, 0.6, rif + 0.4 * (vnoise(q * vec2(0.3, 1.0)) - 0.5) + 0.16 * (vnoise(q * vec2(1.3, 3.1)) - 0.5)) * step(0.6, min(di, dBar));
  // THE SKIN OF THE RIVER: a near-black body that mirrors the zenith and nothing lower, with no relief shaded on it. What moves on it:
  // long low streamlines drawn out along the current (they only tip the mirror, so they show as faint threads toward the horizon); long
  // glassy lanes that slide downstream and carry the rose of the low sky (the sheen: the only rose on the water); a fine cat's-paw in
  // lanes of its own; standing ripples over the gravel bars and nowhere else; a few pinpoint glints of the sun.
  // Both the cat's-paw and the sheen lie in LANES ALONG THE STREAMLINES: a streamline is a line of constant s (metres across the river) that
  // meanders a little down the reach (stream). A lane is a soft wave across the streamlines; nothing here is read from a grid of cells, so
  // no cell, square or seam can show: every edge is a sine's flank, a metre wide or more.
  float stream = q.y + 1.9 * sin(q.x * 0.019 + 0.7) + 0.8 * sin(q.x * 0.047 - uTime * 0.035 + 2.0);
  float laneK = 1.0 - smoothstep(1.2, 3.0, abs(dFdx(q.y)) + abs(dFdy(q.y)));                 // a lane narrower than a few pixels is let go into its mean
  float paw = mix(0.5, smoothstep(0.3, 0.7, 0.5 + 0.5 * sin(stream * 0.52 + 2.3 + 1.2 * sin(q.x * 0.023 - uTime * 0.028))), laneK);
  float bar = max(rif, shal);
  // the sheen: glassy lanes 3 m wide in their heart and 7 m apart, each feathering into the indigo over a metre; down the river a lane
  // swells and dies away over some seventy metres, each lane at its own place, and the whole slides downstream at the river's 1.2 m a second
  float lanes = 0.5 + 0.5 * sin(stream * 0.9 + 0.9 * sin(q.x * 0.031 - uTime * 0.037));
  float along = 0.5 + 0.5 * sin(q.x * 0.045 - uTime * 0.054 + 1.4 * sin(stream * 0.37 + 4.0) + 0.6 * sin(q.x * 0.013 + 1.0));
  float slick = mix(0.3, smoothstep(0.3, 0.8, lanes * (0.3 + 0.7 * along)), laneK) * (1.0 - bar);
  // each size is faded out before it is finer than the pixel that draws it (along the flow and across it)
  vec2 dqx = dFdx(q); vec2 dqy = dFdy(q); vec2 fq = abs(dqx) + abs(dqy);
  vec2 kk = vec2(1.0 - smoothstep(0.5, 1.4, fq.y * 0.9), 1.0 - smoothstep(0.4, 1.1, fq.y * 2.3));
  float kF = (1.0 - smoothstep(0.3, 0.9, fq.x * 1.9)) * (1.0 - smoothstep(0.3, 0.9, fq.y * 3.4));
  float kS = (1.0 - smoothstep(0.3, 0.9, fq.x * 1.1)) * (1.0 - smoothstep(0.3, 0.9, fq.y * 0.6));
  float aF = 0.034 * kF * paw * (1.0 - 0.7 * slick) * (1.0 - bar); float aS = 0.018 * kS * bar;
  float e = 0.035; vec2 qx = q + vec2(e, 0.0); vec2 qz = q + vec2(0.0, e);
  float f0 = wFine(q); vec2 gF = vec2(f0 - wFine(qx), f0 - wFine(qz)) / e;
  float h0 = 0.085 * wH(q, kk) + aS * wStand(q);
  float hx = 0.085 * wH(qx, kk) + aS * wStand(qx);
  float hz = 0.085 * wH(qz, kk) + aS * wStand(qz);
  vec2 gs = (vec2(h0 - hx, h0 - hz) / e + aF * gF) * (1.0 - 0.5 * smoothstep(40.0, 150.0, dist));
  vec3 N = normalize(vec3(T.x * gs.x + Nr.x * gs.y, 1.0, T.y * gs.x + Nr.y * gs.y));
  // whichever way a facet is tipped, the ray it gives back is lifted well clear of the horizon: the mirror holds the zenith alone
  vec3 R = reflect(-Vv, N); R.y = max(abs(R.y), 0.62); R = normalize(R);
  float ndv = max(dot(N, Vv), 0.0); float fr = 1.0 - ndv; float fr2 = fr * fr; float F = 0.04 + 0.96 * fr2 * fr2;
  vec3 env = skyBase(R, uSunDir) * 0.92;
  // the frosted gallery mirrored toward each bank: every willow hangs in the water as a pale column under the dark line of its bank,
  // shivered a little by the finest wavelets (round 11: a quarter of what it was, 0.004 for 0.016; the full shiver drew ruled columns of dots)
  vec2 gq = gs + 0.004 * kF * gF; vec3 Ng = normalize(vec3(T.x * gq.x + Nr.x * gq.y, 1.0, T.y * gq.x + Nr.y * gq.y));
  vec3 Rg = reflect(-Vv, Ng); Rg.y = abs(Rg.y) + 0.015; Rg = normalize(Rg);
  float te = Rg.y / max(length(Rg.xz), 1e-3);                    // how steeply the mirrored ray climbs: the ripples shiver it, so the mirrored tops are ragged
  // WHICH metre of the bank the mirror shows is taken from the level river, not from the tipped facet: a facet tipped a few degrees would
  // throw its ray a hundred metres up or down the bank, and the swells would deal the trees out over mid-river as blocks. So each willow
  // hangs where a level river would hang it; its height shivers, and (round 11, below) a swell slides it a metre or two along the bank. Dead ahead down the stream the ray meets no bank: no mirror there.
  vec2 Rf = -Vv.xz; float rl = max(length(Rf), 1e-3);
  float Ra = dot(Rf, T) / rl; float Rc = dot(Rf, Nr) / rl;
  float lat = Rc > 0.0 ? vF.w : vF.z;
  float hit = max(lat, 0.5) / max(abs(Rc), 0.07);
  // (round 11) ... and the ripples break the hanging shape SIDEWAYS: a facet tipped along the stream shows a metre or two of bank further up or
  // down (held to 2.4 m: never a tree dealt out over mid-river), so each willow's mirror is cut into level slices that slide past one another
  float dh = vF.x + Ra * hit + clamp(3.2 * gs.x * hit, -2.4, 2.4);
  float gu = (dh - uGalR.x) * uGalR.y; float gv = Rc > 0.0 ? 0.75 : 0.25; float du = (0.45 + 0.02 * hit) * uGalR.y;
  vec4 gt = 0.5 * texture2D(uGal, vec2(gu, gv)) + 0.25 * (texture2D(uGal, vec2(gu - du, gv)) + texture2D(uGal, vec2(gu + du, gv)));
  float topT = (gt.r * 22.0 + 1.0) / (hit + 3.0);
  // the strands of the mirror: how tall and how pale it stands changes only ALONG the bank it mirrors (sines of dh, the metre of bank the
  // mirrored ray meets), so on the water it is combed into lanes that run toward that bank; nothing in it is a cell
  float strand = 0.5 + 0.14 * sin(dh * 0.83 + 1.7 * sin(dh * 0.31 + 4.0));           // (round 11: slow, the breadth of a tree; the fine comb drew ruled stripes)
  float crown = 0.84 + 0.1 * sin(dh * 0.71 + 1.3 * sin(dh * 0.27));
  // (toward mid-river the mirrored tops of the two galleries meet: each top feathers out over a long reach of water, combed into strands by
  // the ripples, so the meeting is a soft fringe of long lanes drawn toward us, never a row of blocks)
  float gal = (1.0 - smoothstep(topT * 0.1, topT * (1.0 + 0.4 * strand), te)) * smoothstep(0.03, 0.16, gt.r) * uWat.w * smoothstep(0.012, 0.07, abs(Rc)) * mix(1.0, 0.45, smoothstep(5.0, 18.0, lat));      // soft to its top, fainter the further the water lies from its bank
  float bankM = (1.0 - smoothstep(0.8, 1.2, te * (hit + 1.0) / 2.2)) * uWat.w;                  // the dark cut bank under them
  vec3 galC = (Rc > 0.0 ? uFrostR : uFrostL) * (0.45 + 0.6 * gt.g) * crown;
  float g2 = gal * (1.0 - 0.85 * bankM);
  vec3 refl = mix(env, galC, g2 * 0.88) * (1.0 - 0.75 * bankM * (1.0 - gal));
  float Fm = mix(F, max(F, 0.28), max(g2, 0.6 * bankM) * smoothstep(0.5, 0.82, fr));                 // close under the lens the mirror is weak and the water black: the trees hang in it from mid-river outward
  vec3 body = (uZen * 0.05 + uSky * 0.008) * (0.5 + 0.5 * ndv);                 // looked down into, the water is near black with a breath of indigo
  vec3 c = uDeep + body + refl * Fm;
  // the sliding rose sheen: each glassy lane gives back the low sky of the sun side, more the flatter we look along it, and the fine
  // wavelets that cross it draw short bright and dark bars in it. Outside the lanes there is no rose on the water at all.
  vec2 sx0 = uSunDir.xz / max(length(uSunDir.xz), 1e-3); float lit = dot(vec2(N.x, N.z), sx0);
  vec3 roseC = mix(uHorS, uStB, 0.35);
  float bars = mix(0.82, 0.68 + 0.32 * smoothstep(0.3, 0.7, f0), kF);
  // (how much of the low sky a lane gives back is taken mostly from the level river, so a lane stays one long lane: the swells that cross
  // it only breathe in it and never chop it into bars across the stream)
  float frS = 1.0 - clamp(mix(Vv.y, ndv, 0.3), 0.0, 1.0);
  // THE SUN'S PATH (the second colour on the water): toward the sun's bearing the river gives back its gold, and the ripples break it. Under the
  // sun stands a column of flashing crests (within 18 degrees of its bearing, the fine wavelets cut it into short bars; where they are finer
  // than a pixel it closes into a shimmering band); about it, strongest within 18 degrees and thinning out to some 75, the glassy lanes turn from rose
  // to gold. Looked down into, near the lens, there is none (lowK: by the slope of the line from the water to the eye, as a mirror gives
  // back a low sun only at a grazing look; the same at every place of the flight).
  float caS = dot(-Vv.xz / max(length(Vv.xz), 1e-3), sx0);
  float colN = smoothstep(0.95, 0.998, caS); float colB = smoothstep(0.25, 0.95, caS); float lowK = 1.0 - smoothstep(0.1, 0.45, Vv.y);
  roseC = mix(roseC, uGold * 0.8, 0.55 * colB * uSunK.w);
  c += roseC * slick * uWat.z * (0.04 + 0.42 * frS * frS) * bars * (1.0 - 0.6 * g2) * (1.0 - 0.7 * bankM);
  // (a facet flashes when, tipped toward us or away, it throws the sun's ray to the eye: twice its tilt along our line of sight must make
  // up the difference between how steeply we look down and how high the sun stands. The wavelets are given their full steepness here.)
  vec2 gP = mix(1.0, 0.55, kF) * gs + 0.085 * kF * gF; vec2 gPw = vec2(T.x * gP.x + Nr.x * gP.y, T.y * gP.x + Nr.y * gP.y);
  float tilt = dot(gPw, Vv.xz / max(length(Vv.xz), 1e-3)); float miss = 2.0 * tilt - (Vv.y / max(length(Vv.xz), 1e-3) - uSunDir.y);
  float flash = smoothstep(-0.03, 0.05, miss) * (1.0 - smoothstep(0.3, 0.7, miss));      // (one-sided: a crest flashes whole, never as a ring about itself)
  float lane2 = 0.55 + 0.45 * sin(stream * 2.3 + 1.9 * sin(q.x * 0.11 - uTime * 0.19)) * laneK;
  c += uGold * uSunK.w * uWat.z * ((2.6 * colN * (1.0 - smoothstep(0.2, 0.4, Vv.y)) + 0.9 * colB * (1.0 - smoothstep(0.1, 0.26, Vv.y))) * flash * lane2 * mix(0.6, 1.0, kF) + 0.14 * lowK * colB * (0.35 + 0.65 * lanes) * bars) * (1.0 - 0.6 * g2) * (1.0 - 0.8 * bankM) * (1.0 - 0.6 * bar);
  // the sun's glints: a few pinpoints. One facet in five of a fine drifting grid may flash, when the ray it throws back (each tipped its own
  // way) comes within a few degrees of the sun; the grid is let go before a cell is as small as a pixel, so the glints never line up in rows
  vec2 gp = vec2(q.x - uTime * 1.1, q.y) * vec2(2.2, 4.0); vec2 gi = floor(gp); float gh = stH(gi + 3.7);
  vec2 gf = fract(gp) - 0.5 - (vec2(stH(gi + 1.3), stH(gi + 6.1)) - 0.5) * 0.6;
  float gk = (1.0 - smoothstep(0.3, 0.8, fq.x * 2.2)) * (1.0 - smoothstep(0.3, 0.8, fq.y * 4.0));
  vec3 Nf = normalize(vec3(N.x + (stH(gi + 9.2) - 0.5) * 0.5, 1.0, N.z + (stH(gi + 4.4) - 0.5) * 0.5));
  float sdg = max(dot(reflect(-Vv, Nf), uSunDir), 0.0);
  float glint = step(0.8, gh) * smoothstep(0.98, 0.997, sdg) * (1.0 - smoothstep(0.06, 0.24, length(gf))) * (0.5 + 0.5 * sin(uTime * (1.5 + 3.0 * gh) + gh * 40.0)) * gk;
  c += uSunCol * uWat.z * 2.4 * glint * (1.0 - g2 * 0.7) * (1.0 - 0.8 * bankM) * (1.0 - bar);
  // gravel through the shallows
  float kP = 1.0 - smoothstep(0.06, 0.25, fwp * 6.0);
  float peb = mix(0.42, vnoise(vWp.xz * 6.0) * vnoise(vWp.xz * 14.0 + 3.0) * 1.8, kP);
  vec3 grav = vec3(0.078, 0.076, 0.078) * (0.4 + 1.2 * peb) * (uSky * 0.9 + uSunCol * 0.2);
  c = mix(c, grav + env * F * 0.6, shal * (1.0 - F) * 0.75);
  if (rif > 0.01) {                                                          // the bed of a riffle seen through a hand's depth of water: pale cobbles swimming under the ripples
    vec2 cb = cobble((vWp.xz + vec2(T.x * gs.x + Nr.x * gs.y, T.y * gs.x + Nr.y * gs.y) * 1.5) * 8.5);
    float stone = (1.0 - smoothstep(0.34, 0.66, cb.x)) * kP;
    vec3 bedA = mix(vec3(0.085, 0.088, 0.1), mix(vec3(0.18, 0.176, 0.17), vec3(0.34, 0.32, 0.29), cb.y), stone);
    bedA = mix(vec3(0.21, 0.205, 0.2), bedA, kP);
    vec3 bed = bedA * (uSky * 0.95 + uSunCol * (0.16 + 0.5 * smoothstep(0.02, 0.12, lit) * kP)) * vec3(0.8, 0.9, 1.0);
    c = mix(c, bed + env * F * 0.6, rif * (1.0 - F) * 0.9);
  }
  // thin skins of steam lying on the water: looked down on they are almost nothing, seen aslant they close up into soft lit bands
  vec2 sq = q - vec2(uTime * 0.55, 0.0);
  float skl = 0.5 + 0.5 * sin(stream * 0.63 + 5.0 + 1.3 * sin(sq.x * 0.027 + 1.0));                           // (in lanes of their own, drawn out along the streamlines)
  float ska = 0.5 + 0.5 * sin(sq.x * 0.083 + 1.9 * sin(stream * 0.41 + 2.0) + 0.7 * sin(sq.x * 0.019));
  float skin = smoothstep(0.3, 0.85, skl * (0.35 + 0.65 * ska)) * (0.75 + 0.25 * sin(sq.x * 0.6 + 2.1 * sin(stream * 1.3 + sq.x * 0.05)));
  float skA = (1.0 - exp(-uSkin.x * skin / max(Vv.y, 0.05))) * smoothstep(16.0, 42.0, dist) * (1.0 - smoothstep(110.0, 220.0, dist)) * smoothstep(0.5, 5.0, dBar);
  float fsS = max(dot(-Vv, uStSun), 0.0); fsS *= fsS; fsS *= fsS;
  float sideS = 0.5 + 0.5 * dot(-Vv.xz / max(length(Vv.xz), 1e-3), sx0);
  c = mix(c, mix(uStA, uStB, clamp(0.3 + 0.7 * sideS, 0.0, 1.0)) + uStScat * fsS, min(skA, 0.45));
  // ice with thickness: where the view ray crossed the level of the ice top (0.14 m up) decides top or wall
  vec2 offW = Vv.xz / max(Vv.y, 0.07) * 0.14; offW *= min(1.0, 0.9 / max(length(offW), 1e-3));
  vec2 offQ = vec2(dot(offW, T), dot(offW, Nr));
  float sgn = vF.z < vF.w ? 1.0 : -1.0; float isB = step(shoreB, di);
  vec3 SNOW = vec3(0.60, 0.61, 0.645);
  float wrap = clamp((uSunDir.y + 0.3) / 1.3, 0.0, 1.0);
  // the long shadows of the land's trees run on over the ice (the same lanes as the land's, along the sun's bearing): blue in the shadow, warm in the sun
  vec2 spI = vec2(dot(vWp.xz, vec2(-sx0.y, sx0.x)), dot(vWp.xz, sx0));
  float shI = smoothstep(0.40, 0.62, 0.7 * vnoise(vec2(spI.x * 0.16 + uTime * 0.012, spI.y * 0.011)) + 0.3 * vnoise(vec2(spI.x * 0.55, spI.y * 0.03 + 4.0))) * uIce.x;
  vec3 iceLit = SNOW * ((uSunCol * wrap * 1.5 + uGold * 0.16 * uIce.y) * (1.0 - shI) + uSky * (1.0 - 0.12 * shI)) * (0.86 + 0.2 * vnoise(vWp.xz * 1.7) + 0.08 * vnoise(vWp.xz * 9.0) * kP);
  vec3 iceRim = vec3(0.33, 0.42, 0.54) * (uSky * 1.3 + uSunCol * 0.45);
  vec3 iceWall = vec3(0.10, 0.19, 0.30) * (uSky * 1.5 + uSunCol * 0.25) * (0.7 + 0.5 * vnoise(vWp.xz * vec2(5.0, 5.0)));
  float aa = 0.03 + fwp * 0.9;
  // the shelf along every shore
  float sw = uWat.x * (1.1 + 2.8 * vnoise(vec2(vF.x * 0.06, vF.y < 0.0 ? 9.0 : 2.0)));
  vec2 pt = vWp.xz + offW;
  float swE = sw * mix(0.27, 1.0, isB); float wob = mix(0.45, 1.3, isB);                    // round an islet or a shoal the shelf is only a rind, so its cranes stand against dark water
  float eW = shore - swE + (vnoise(vWp.xz * 0.8) - 0.5) * wob + (vnoise(vWp.xz * 3.7) - 0.5) * 0.3;
  float eT = shore + sgn * offQ.y * isB - swE + (vnoise(pt * 0.8) - 0.5) * wob + (vnoise(pt * 3.7) - 0.5) * 0.3;
  // pans drifting with the flow
  vec2 qd = q - vec2(uTime * 1.1, 0.0); float crumbs = 1.0 - smoothstep(26.0, 60.0, dist);
  float frW, frT; float pW = panSD(qd, q.y, shoreB, sgn, crumbs, frW); float pT = panSD(qd + offQ, q.y, shoreB, sgn, crumbs, frT);
  float on = step(0.001, uWat.x); float ero = max(0.0, 2.2 - min(di, dBar)) * 1.4; float clearK = 1.0 - smoothstep(0.0, 0.6, ero);      // a pan that drifts against a shoal or the bar melts back from it whole: it is never cut by a line
  pW += ero; pT += ero;
  float dW = min(mix(9.0, eW, on), pW); float dT = min(mix(9.0, eT, on), pT);
  float top = 1.0 - smoothstep(-aa, aa, dT); float foot = 1.0 - smoothstep(-aa, aa, dW);
  float slush = max(frW * clearK * (1.0 - smoothstep(0.0, 0.45, pW)), on * (1.0 - smoothstep(0.0, 0.55, eW))) * (1.0 - foot);                  // a fringe of slush just under the water round every pan and along the shelf: soft, not cut out
  c = mix(c, iceRim * 0.5 + c * 0.55, slush * 0.5);
  c *= 1.0 - 0.3 * (1.0 - smoothstep(0.0, 0.06 + aa, dW)) * (1.0 - foot);          // a soft dark line where ice meets water
  c = mix(c, iceWall, foot * (1.0 - top) * 0.85);
  float panTop = step(pT, mix(9.0, eT, on));                                       // a pan, not the shelf: a broad soft rim of crushed ice round a greyer, thinner middle
  vec3 iceIn = iceLit * mix(1.0, mix(1.1, 0.84, smoothstep(0.22, 0.5, -dT)), panTop * smoothstep(0.1, 0.16, -dT) * (1.0 - smoothstep(0.1, 0.35, fwp * 6.0)));
  // frost flowers: stars of feathered rime a hand across, standing on the shelves and the pans
  vec2 fp2 = pt * 2.7; vec2 fi = floor(fp2); float fh = stH(fi + 21.0);
  vec2 ff = fract(fp2) - 0.5 - (vec2(stH(fi + 3.3), stH(fi + 8.1)) - 0.5) * 0.5;
  float fa = atan(ff.y + 1e-5, ff.x); float spike = abs(cos(fa * 3.0 + fh * 6.2832)); spike *= spike; spike *= spike;
  float flower = (1.0 - smoothstep(0.55, 1.0, length(ff) / (0.09 + 0.3 * spike * (0.4 + 0.6 * fh)))) * step(0.42, fh) * kP * smoothstep(0.06, 0.2, -dT);
  iceIn = mix(iceIn, iceLit * 1.2 + uSunCol * 0.1, flower * 0.85) * (1.0 - 0.18 * (1.0 - smoothstep(0.0, 0.5, abs(length(ff) - 0.2) * 6.0)) * step(0.42, fh) * kP * (1.0 - flower));
  // the rim of a pan or of the shelf that is turned to the sun takes its gold (which way a rim faces: the slope of the distance to the edge, from the pixel's own neighbours; let go where a pixel is wider than the rim)
  vec2 jx = dFdx(vWp.xz); vec2 jy = dFdy(vWp.xz); float tX = dFdx(dT); float tY = dFdy(dT); float jd = jx.x * jy.y - jx.y * jy.x;
  vec2 gT = vec2(jy.y * tX - jx.y * tY, jx.x * tY - jy.x * tX) * (jd < 0.0 ? -1.0 : 1.0);
  float rimS = max(dot(gT / max(length(gT), 1e-6), sx0), 0.0) * (1.0 - smoothstep(0.12, 0.5, fwp)) * uIce.y * step(1e-9, abs(jd));
  c = mix(c, mix(iceRim + uGold * 0.85 * rimS, iceIn, smoothstep(0.0, mix(0.13, 0.24, panTop) + aa, -dT)), top);
  vec3 cf = steamApply(c, vWp, 1.0);                                                    // the smoke that stands in columns is drawn by the wisps; on the water itself only its far haze lies
  gl_FragColor = vec4(mix(c, cf, 0.4 + 0.6 * smoothstep(25.0, 100.0, dist)), 1.0);
}`,Ds=`
attribute vec3 aTan; attribute vec4 aR; attribute vec4 aW;
uniform float uTime; uniform float uPx; uniform float uWind;
varying vec3 vWp; varying vec3 vSide; varying vec4 vR; varying vec3 vK; varying float vRad; varying float vPxw;
void main(){
  vec4 lp = vec4(position, 1.0); vec3 tn = aTan; float sc = 1.0; float ph = aW.y;
  #ifdef USE_INSTANCING
    lp = instanceMatrix * lp; tn = mat3(instanceMatrix) * tn; sc = length(instanceMatrix[0].xyz); ph += dot(instanceMatrix[3].xyz, vec3(0.37, 0.11, 0.53));
  #endif
  vec4 wp = modelMatrix * lp; tn = mat3(modelMatrix) * tn; tn /= max(length(tn), 1e-4);
  float sw = aW.x * uWind * sc;
  wp.x += sw * (0.10 * sin(uTime * 0.9 + ph) + 0.035 * sin(uTime * 2.3 + ph * 1.7)) + sw * 0.25 * (uWind - 1.0);
  wp.z += sw * 0.07 * sin(uTime * 0.7 + ph * 1.3);
  vec3 tc = cameraPosition - wp.xyz; float dist = length(tc);
  vec3 sd = cross(tn, tc); sd /= max(length(sd), 1e-4);
  float hw = max(aR.x * sc, 1e-4); float w = max(hw, uPx * dist * 0.8);
  wp.xyz += sd * aR.y * w;
  vWp = wp.xyz; vSide = sd; vR = vec4(aR.y, aR.z * hw / w, aR.w * sc, aW.z); vK = vec3(aW.w, fract(ph * 3.7), w / hw); vRad = hw * aR.z; vPxw = w / max(uPx * dist, 1e-5);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,qs=`
varying vec3 vWp; varying vec3 vSide; varying vec4 vR; varying vec3 vK; varying float vRad; varying float vPxw;
uniform float uFrost; uniform vec4 uAld; uniform float uWarm;         // uAld = (the islet alder's crown centre, its radius)
${Ue}
${I0}
void main(){
  float v = vR.x; float av = abs(v); float core = vR.y; float frost = vR.w * uFrost;
  float a = vR.z * 38.0; float fw = fwidth(a);
  float len = 0.3 + 0.7 * h1(floor(a) + (v > 0.0 ? 17.3 : 3.1));
  float needle = len * (1.0 - abs(2.0 * fract(a) - 1.0));
  float lim = mix(needle, mix(0.55, 1.0, smoothstep(1.0, 1.6, vK.z)), smoothstep(0.16, 0.6, fw));      // the needles close up into plain fur before they are small enough to break into dots
  if (av > max(max(core + (1.0 - core) * lim * frost, core), min(1.0, 0.62 / vPxw))) discard;      // never narrower than a pixel and a quarter: a thinner strand breaks into dashes
  float thinK = step(0.5, vK.x) * step(vK.x, 1.5) + step(2.5, vK.x) * step(vK.x, 3.5);      // withies and reeds: wood far thinner than its frost
  if (vK.y < 0.3 * smoothstep(2.2, 4.5, vK.z) * step(vK.x, 1.5) * thinK) discard;         // far curtains thin out, so the sky shows between the strands and a willow is not a pale block
  vec3 Vv = cameraPosition - vWp; Vv /= max(length(Vv), 1e-4);
  vec3 SNOW = vec3(0.62, 0.63, 0.66); vec3 c;
  // the islet alder stands rose-lit out of the steam: the side of its crown that faces the sun takes the rose-gold key, its heart stays dark
  vec3 an = (vWp - uAld.xyz) * vec3(1.0, 0.8, 1.0); float anl = length(an); an /= max(anl, 1e-4);
  float ak = step(3.5, vK.x) * (1.0 - smoothstep(0.85, 1.15, anl / max(uAld.w, 1e-3))); float aSun = smoothstep(-0.3, 0.5, dot(an, uSunDir)) * smoothstep(0.25, 0.8, anl / max(uAld.w, 1e-3));
  float xc = clamp(v / max(core, 1e-3), -1.0, 1.0); float sArc = asin(xc) * vRad; float fa = fwidth(sArc) + fwidth(vR.z);      // metres round the bole, and how much of it one pixel covers
  float farK = smoothstep(1.2, 3.5, vK.z);
  // a withy or reed stem narrower than a pixel is drawn as its frost alone: its dark core would only land on stray pixels and dot the strand
  if (av < core * (1.0 - thinK * smoothstep(1.25, 1.9, vK.z))) {
    float x = xc;
    vec3 N = vSide * x + Vv * sqrt(max(1.0 - x * x, 0.0)); N /= max(length(N), 1e-4);
    float k = vK.x;
    vec3 bark = (k < 0.5 || k > 3.5) ? vec3(0.050, 0.038, 0.034) : k < 1.5 ? vec3(0.17, 0.10, 0.055) : k < 2.5 ? vec3(0.17, 0.17, 0.18) : vec3(0.34, 0.27, 0.15);
    float g = vnoise(vec2(vR.z * 2.5, x * 2.5 + k * 7.0)); float g2 = vnoise(vec2(vR.z * 11.0, x * 5.0));
    bark *= 0.55 + 0.9 * g * (0.6 + 0.8 * g2);
    // a bole wide enough to have bark: plates and furrows, rime packed into the furrows and plastered on the weather side, snow
    // lodged on whatever leans face up, a dark wet foot where it stands in the river's breath
    float dk = step(k, 0.5) + step(3.5, k);
    float big = smoothstep(0.05, 0.2, vRad) * dk; float seen = 1.0 - smoothstep(0.02, 0.07, fa);
    float fu = vnoise(vec2(sArc * 11.0 + 2.5 * vnoise(vec2(vR.z * 1.1, sArc * 3.0)), vR.z * 1.7));
    float furrow = (1.0 - smoothstep(0.0, 0.28, abs(fu - 0.5) * 2.0)) * big * seen;
    bark *= (1.0 - 0.62 * furrow) * mix(1.0, 0.72 + 0.5 * vnoise(vec2(sArc * 11.0, vR.z * 0.9) + 7.0), big * seen);
    float wsd = dot(N, vec3(0.2, 0.33, 0.92));
    float plast = smoothstep(0.3, 0.75, wsd + 0.7 * (g - 0.5) + 0.35 * (g2 - 0.5)) * big;
    float foot = (1.0 - smoothstep(0.1, 0.9, vWp.y)) * dk;
    bark *= 1.0 - 0.55 * foot;
    float top = smoothstep(mix(0.1, 0.0, big), mix(0.75, 0.3, big), N.y + mix(0.5, 0.22, big) * g - mix(0.2, 0.06, big)) * frost;
    float white = max(max(top * 0.9, 0.25 * frost * g2), max(plast * 0.8, furrow * smoothstep(-0.2, 0.5, wsd) * 0.75) * frost) * (1.0 - foot);
    c = shade(mix(bark, SNOW, white * (1.0 - 0.55 * ak * (1.0 - aSun))), N, Vv, 0.0, 0.7) * (1.0 - 0.3 * ak * (1.0 - aSun)) + uSunCol * ak * aSun * (0.13 + 0.3 * white);
  } else {
    vec3 N = Vv * 0.55 + vec3(0.0, 0.55, 0.0) + vSide * v * 0.45; N /= max(length(N), 1e-4);
    float bk = max(dot(-Vv, uSunDir), 0.0);
    float sunny = smoothstep(-0.15, 0.45, dot(mix(N, Vv * 0.7 + vec3(0.0, 0.7, 0.0), farK), uSunDir));               // fur the sun does not reach is blue and darker than the sky behind it; only its back-lit edge glows
    c = shade(SNOW * mix(0.92 + 0.16 * vK.y, 0.74 + 0.36 * fract(vK.y * 7.3), farK * thinK) * mix(0.7, 1.0, sunny), N, Vv, 1.0, 0.0) + uRimCol * frost * (0.04 + mix(0.55, 0.34, farK) * bk * bk * bk);
    c += uRimCol * frost * 0.3 * smoothstep(0.1, 0.7, v * dot(vSide, uSunDir)) * (1.0 - 0.7 * farK);      // the edge of the fur that faces the sun: a rose-gold rim
    c += SNOW * uRimCol * frost * uWarm * 0.32 * smoothstep(0.35, 0.9, 0.5 + 0.5 * dot(Vv, uSunDir));      // seen from the sun's side, the fur is in its light: warm (the second colour)
    c *= mix(1.0, mix(0.5, 0.36, step(3.5, vK.x)), farK * (1.0 - sunny));          // far off, a strip is wider than its twig: give the dark wood inside it its share, so back-lit trees stand blue against the steam
    c = c * (1.0 - 0.3 * ak * (1.0 - aSun)) + uSunCol * frost * 0.85 * ak * aSun * (0.7 + 0.3 * vK.y);
  }
  gl_FragColor = vec4(steamApply(c, vWp, 1.0), 1.0);
}`,Ls=`
attribute vec3 color; attribute vec4 aB; attribute vec4 iP; attribute vec4 iQ; attribute vec4 iS;       // iS.w: the head turned to the bird's left (+) or right (-), radians
uniform vec4 uBd; uniform vec4 uBe;       // (neck length, body radius, neck base z, neck base y)  (body length, shoulder y, shoulder z, wing twist)
varying vec3 vWp; varying vec3 vN; varying vec3 vCol; varying vec3 vUv;
void main(){
  float part = aB.x; float open = iS.x; float up = iS.y;
  vec3 lp = position; vec3 ln = normal;
  if (part > 0.5 && part < 2.5) {
    float a0 = mix(0.15, 1.05, up); float b = mix(0.02, 0.62, up);
    float t = part < 1.5 ? aB.y : 1.0; float th = a0 + b * t;
    vec3 c = vec3(0.0, uBd.w, uBd.z) + uBd.x * vec3(0.0, (cos(a0) - cos(th)) / b, (sin(th) - sin(a0)) / b);
    if (part < 1.5) { vec3 e2 = vec3(0.0, cos(th), -sin(th)); lp = c + vec3(position.x, 0.0, 0.0) + e2 * position.y; ln = vec3(normal.x, 0.0, 0.0) + e2 * normal.y; }
    else { float hh = mix(th - 0.15, 0.05, up * 0.9); float ch = cos(hh), sh = sin(hh);
      lp = c + vec3(position.x, position.y * ch + position.z * sh, -position.y * sh + position.z * ch);
      ln = vec3(normal.x, normal.y * ch + normal.z * sh, -normal.y * sh + normal.z * ch);
      float hk = iS.w * 0.55; float chk = cos(hk), shk = sin(hk); vec3 hl = lp - c;                        // the head turns on the end of the neck ...
      lp = c + vec3(hl.x * chk + hl.z * shk, hl.y, -hl.x * shk + hl.z * chk); ln = vec3(ln.x * chk + ln.z * shk, ln.y, -ln.x * shk + ln.z * chk); }
    float nk = iS.w * 0.45 * t; float cnk = cos(nk), snk = sin(nk); vec3 nb = vec3(0.0, uBd.w, uBd.z); vec3 nl = lp - nb;      // ... and the neck bends round with it
    lp = nb + vec3(nl.x * cnk + nl.z * snk, nl.y, -nl.x * snk + nl.z * cnk); ln = vec3(ln.x * cnk + ln.z * snk, ln.y, -ln.x * snk + ln.z * cnk);
  } else if (part > 2.5) {
    float u = aB.y; float side = aB.z;
    float ph = iQ.z - 1.2 * u;
    float ang = (0.10 + iQ.w * sin(ph) * (0.25 + 0.75 * u)) * open;
    float span = position.x * (1.0 - 0.25 * u * max(cos(iQ.z - 0.6), 0.0) * step(0.01, iQ.w));
    float tw = (0.12 + 0.40 * max(cos(ph), 0.0) * step(0.01, iQ.w)) * u * open * uBe.w;             // the hand of the wing turns its upper side back on the up-stroke: seen from behind and above it flashes white
    vec3 q = vec3(span * cos(ang) - position.y * sin(ang), span * sin(ang) + position.y * cos(ang) + (position.z - 0.18 * uBe.x) * tw, position.z);      // position.y: the arch of the wing
    vec3 fo = vec3(uBd.y * (0.5 - 0.3 * u), -0.10 * u - 0.6 * uBd.y * aB.w, -u * 0.74 * uBe.x - 0.08 * aB.w);
    q = mix(fo, q, open);
    lp = vec3(side * (uBd.y * 0.5 + q.x), uBe.y + q.y, uBe.z + q.z);
    vec3 n = mix(vec3(0.8, 0.6, 0.0), vec3(-sin(ang) * normal.y, cos(ang) * normal.y, normal.z), open); ln = vec3(side * n.x, n.y, n.z);
  }
  lp *= iS.z;
  float cp = cos(iQ.x), sp = sin(iQ.x);
  lp = vec3(lp.x, lp.y * cp + lp.z * sp, -lp.y * sp + lp.z * cp); ln = vec3(ln.x, ln.y * cp + ln.z * sp, -ln.y * sp + ln.z * cp);
  float cb = cos(iQ.y), sb = sin(iQ.y);
  lp = vec3(lp.x * cb - lp.y * sb, lp.x * sb + lp.y * cb, lp.z); ln = vec3(ln.x * cb - ln.y * sb, ln.x * sb + ln.y * cb, ln.z);
  float chd = cos(iP.w), shd = sin(iP.w);
  lp = vec3(lp.x * chd + lp.z * shd, lp.y, -lp.x * shd + lp.z * chd); ln = vec3(ln.x * chd + ln.z * shd, ln.y, -ln.x * shd + ln.z * chd);
  vec4 wp = modelMatrix * vec4(iP.xyz + lp, 1.0);
  vWp = wp.xyz; vN = ln; vCol = color; vUv = vec3(aB.y, aB.w, part);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Vs=`
varying vec3 vWp; varying vec3 vN; varying vec3 vCol; varying vec3 vUv; uniform float uFinger; uniform vec4 uWingP; uniform vec4 uSwanL;     // uWingP = (feathers along the span, primaries from, to, slot depth)  uSwanL = the swan's light (shadow side, key, under side, contour)
${Ue}
${I0}
void main(){
  vec3 N = vN / max(length(vN), 1e-4);
  vec3 Vv = cameraPosition - vWp; Vv /= max(length(Vv), 1e-4);
  vec3 alb = vCol; float thin = 0.0;
  if (vUv.z > 2.5) {
    float u = vUv.x, v = vUv.y; float fu = fract(u * uWingP.x); float fid = floor(u * uWingP.x);
    float prim = smoothstep(uWingP.y, uWingP.z, u);
    float v0 = mix(uFinger > 0.5 ? 0.84 : 0.93, uWingP.w, prim);
    float tip = clamp((v - v0) / (1.0 - v0), 0.0, 1.0);
    if (abs(fu - 0.5) * 2.0 > 1.0 - tip * sqrt(tip) * mix(0.7, 0.9, prim)) discard;
    float vane = smoothstep(0.0, 0.6, 1.0 - abs(fu - 0.5) * 2.0);
    if (uFinger > 0.5) {                                   // the sea eagle: soft rows of dark coverts, each feather a shade of its own, white shoulders
      float rows = 0.5 + 0.5 * sin(v * 17.0 + 1.3 * sin(fu * 6.2832));
      alb *= (0.75 + 0.35 * rows * (1.0 - prim)) * (0.8 + 0.4 * h1(fid + 3.0)) * (0.8 + 0.2 * vane);
      float wh = (1.0 - smoothstep(0.42, 0.52, u + 0.06 * (h1(fid) - 0.5))) * (1.0 - smoothstep(0.2, 0.3, v + 0.04 * sin(fu * 6.2832)));
      alb = mix(alb, vec3(0.72, 0.715, 0.73) * (0.85 + 0.15 * rows), wh);
    } else {                                               // the swan: three rows of coverts lying over the flight feathers, a soft blue shadow under each hem
      float row = fract(v * 3.4 + 0.12 * sin(fu * 6.2832));
      alb *= (0.84 + 0.16 * vane) * mix(vec3(1.0), vec3(0.72, 0.78, 0.92), smoothstep(0.7, 1.0, row) * 0.6 * (1.0 - step(0.88, v)));
      // each flight feather of the hand has its own edge: a blue-grey hem where it lies under its neighbour (let go as a feather comes down from ten pixels wide to four)
      float hem = (1.0 - smoothstep(0.0, 0.2, 1.0 - abs(fu - 0.5) * 2.0)) * smoothstep(0.45, 0.75, v) * (0.25 + 0.75 * prim) * (1.0 - smoothstep(0.1, 0.25, fwidth(u * uWingP.x)));
      alb *= mix(vec3(1.0), vec3(0.5, 0.56, 0.74), 0.6 * hem);
    }
    if (dot(N, Vv) < 0.0) N = -N;
    thin = 1.0;
  }
  float rk = 0.8;
  if (uFinger < 0.5) {                                     // the swan: no rim glow on black feet and bill, feathers lying in soft rows down the back
    rk *= smoothstep(0.024, 0.045, max(alb.r, alb.g));
    if (vUv.z < 0.5) alb *= 0.95 + 0.05 * sin(vUv.x * 46.0);
    if (vUv.z > 1.5 && vUv.z < 2.5 && vUv.y < 0.45) alb = mix(alb, vec3(0.02, 0.02, 0.024), smoothstep(0.325, 0.36, vUv.y) * (1.0 - smoothstep(0.02, 0.12, abs(vUv.x - 0.7))));      // the eye, small and dark, on each side of the head
  }
  vec3 col;
  if (uFinger < 0.5) {
    // THE SWAN IS A SOLID WHITE BIRD: the side turned to the sun warm white, the side turned from it in cool blue shadow, its under side darker,
    // a dark line where its form turns away on the shaded hand, a rim of the sun's colour on the edge that faces the sun; hardly any light through the wing
    float ndl = dot(N, uSunDir); float key = smoothstep(-0.35, 0.25, ndl);
    vec3 fill = mix(uGround, uSky, N.y * 0.5 + 0.5);
    float under = mix(uSwanL.z, 1.0, smoothstep(-0.7, 0.25, N.y));
    col = alb * mix(fill * uSwanL.x * vec3(0.9, 0.96, 1.1), uSunCol * uSwanL.y + fill * 0.95, key) * under;
    col += thin * alb * uRimCol * max(-ndl, 0.0) * 0.12;
    float fr = 1.0 - max(dot(N, Vv), 0.0);
    col *= 1.0 - uSwanL.w * fr * fr * (1.0 - key) * (1.0 - thin);
    col += uRimCol * fr * fr * fr * smoothstep(-0.3, 0.8, dot(-Vv, uSunDir)) * rk * (0.25 + 0.9 * alb);
  } else col = shade(alb, N, Vv, thin, rk);
  gl_FragColor = vec4(steamApply(col, vWp, 1.0), 1.0);
}`,Es=`
attribute vec4 iR; uniform float uU; varying vec2 vQ; varying float vA; varying vec3 vWp;
void main(){
  float age = (uU - iR.z) * ${G0.toFixed(1)} / 1.7; float on = step(0.0, age) * step(age, 1.0);
  float rad = iR.w * (0.25 + 1.5 * sqrt(clamp(age, 0.0, 1.0))) * on;
  vec4 wp = modelMatrix * vec4(iR.x + position.x * rad, 0.03, iR.y + position.y * rad, 1.0);
  vQ = position.xy; vA = (1.0 - age) * on; vWp = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp;
}`,Hs=`
varying vec2 vQ; varying float vA; varying vec3 vWp; uniform vec3 uSunCol; uniform vec3 uSky;
${I0}
void main(){
  float r = length(vQ); float w = max(0.055, fwidth(r) * 1.5);                    // two thin rings running outward and dying away, never a drawn hoop
  float ring = (1.0 - smoothstep(0.0, w, abs(r - 0.88))) + 0.55 * (1.0 - smoothstep(0.0, w, abs(r - 0.56)));
  float al = ring * vA * vA * 0.24 * (0.055 / w) * (1.0 - smoothstep(0.94, 1.0, r));
  if (al < 0.004) discard;
  gl_FragColor = vec4(steamApply(uSky * 1.1 + uSunCol * 0.5, vWp, 1.0), al);
}`,Gs=`
attribute vec4 iR; attribute vec2 iU; uniform float uU; varying vec2 vQ; varying vec2 vA; varying vec3 vWp;
void main(){
  float on = step(iU.x, uU) * step(uU, iU.y);
  vec4 wp = modelMatrix * vec4(iR.x + position.x * iR.w * on, 0.035, iR.y + position.y * iR.w * on, 1.0);
  vQ = position.xy; vA = vec2(iR.z, iR.w); vWp = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp;
}`,Is=`
varying vec2 vQ; varying vec2 vA; varying vec3 vWp; uniform float uTime; uniform vec3 uSunCol; uniform vec3 uSky; uniform vec3 uDeep;
${I0}
void main(){
  float r = length(vQ); float k = 5.5 * vA.y;                       // a crest every 55 cm or so
  float fq = fwidth(r) * k * 6.2832; float keep = 1.0 - smoothstep(1.2, 3.0, fq);
  float sn = sin((r * k - uTime * 0.55 - vA.x) * 6.2832);
  float env = (1.0 - r) * (1.0 - r) * smoothstep(0.07, 0.2, r) * keep;
  float lightK = smoothstep(0.35, 0.95, sn); float dark = smoothstep(0.35, 0.95, -sn);
  float al = env * (0.62 * lightK + 0.5 * dark);
  if (al < 0.004) discard;
  vec3 c = mix(uDeep * 0.6, uSky * 1.15 + uSunCol * 0.55, lightK / max(lightK + dark, 1e-3));
  gl_FragColor = vec4(steamApply(c, vWp, 1.0), min(al, 0.8));
}`,_s=`
attribute vec4 iP; attribute vec4 iQ; attribute float iT;            // (x, y, z, size)  (seed, wisp rate, stretch, opacity)  rose tint 0..1 (+2: a billow with an outline)
uniform float uTime; uniform vec4 uWisp; uniform vec3 uStSun;          // (lean downstream, rise, opacity, -)
varying vec2 vQ; varying vec4 vS; varying vec3 vWp; varying float vT; varying vec2 vL; varying vec3 vLs;      // vLs = (the way to the sun across the picture, how far a column's puff is torn)
void main(){
  float sd = iQ.x; float wisp = step(0.0001, iQ.y); float life = fract(uTime * iQ.y + sd); float firm = step(1.5, iT);
  vec3 p = iP.xyz;
  float rise = mix(1.0, iQ.z, wisp);                 // a wisp's iQ.z is how many times its own size it climbs; a bank top's is its stretch
  p.x += wisp * life * iP.w * uWisp.x * sqrt(rise) + (1.0 - wisp) * 1.5 * sin(uTime * 0.11 + sd * 40.0);
  p.y += wisp * life * iP.w * uWisp.y * rise + 0.3 * sin(uTime * 0.2 + sd * 30.0);
  float sz = iP.w * (0.7 + mix(0.75 * (0.6 + 0.4 * rise), 1.0, firm) * life * wisp);       // a puff swells as it climbs and thins (a column's puff less: the column keeps its waist)
  float ang = (sd - 0.5) * 0.9 + uTime * 0.05 * (sd - 0.5); float ca = cos(ang), sa = sin(ang);
  vec2 q = vec2(position.x * mix(iQ.z, 1.0, wisp), position.y * mix(0.9, 1.0, wisp));
  q = vec2(q.x * ca - q.y * sa, q.x * sa + q.y * ca);
  // every puff and every head leans downstream: its top is carried along the flow (world +x as the eye sees it) while its foot stays
  float fx = (viewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).x;
  // a column's puff at the top of its climb is torn off downstream: drawn out along the flow, flattened, and (in the fragment) parted into shreds
  float tear = firm * wisp * smoothstep(0.5, 0.95, life);
  q = vec2(q.x * (1.0 + 0.9 * tear * abs(fx)), q.y * (1.0 - 0.3 * tear));
  q.x += fx * (0.22 + 0.2 * life * wisp + 0.5 * tear) * (q.y + 1.0);
  vec3 sv = mat3(viewMatrix) * uStSun; vec2 l2 = sv.xy / max(length(sv.xy), 1e-3); vL = vec2(l2.x * ca + l2.y * sa, -l2.x * sa + l2.y * ca);      // the way to the sun across the eye's view, in the puff's own frame
  vLs = vec3(l2, tear);
  vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
  mv.xy += q * sz;
  float op = iQ.w * uWisp.z * mix(1.0, mix(sin(3.14159 * life), smoothstep(0.0, 0.1, life) * (1.0 - smoothstep(0.5, 1.0, life)), firm), wisp) * smoothstep(min(9.0, 2.6 * iP.w), min(24.0, 7.0 * iP.w), -mv.z) * (1.0 - smoothstep(mix(150.0, 70.0, wisp), mix(230.0, 150.0, wisp), -mv.z));
  vQ = position.xy; vS = vec4(life + uTime * 0.06, sd, op, wisp); vT = iT;
  vWp = cameraPosition + mv.xyz * mat3(viewMatrix);
  gl_Position = projectionMatrix * mv;
}`,Ks=`
varying vec2 vQ; varying vec4 vS; varying vec3 vWp; varying float vT; varying vec2 vL; varying vec3 vLs;
${I0}
void main(){
  // vapour: a round billow with slow lobes inside it. Its top curls over: the lobes are wound round a point in the upper half, more the
  // nearer they lie to it, and the winding goes on with time.
  float r = length(vQ);
  vec2 cq = vQ - vec2(0.12, 0.3); float cl = length(cq);
  float wind = (0.8 + 0.3 * sin(vS.x * 1.3 + vS.y * 20.0)) * (1.0 - smoothstep(0.0, 0.85, cl)) * (vS.y > 0.5 ? 1.0 : -1.0);
  float cw = cos(wind), sw = sin(wind); vec2 w = vec2(cq.x * cw - cq.y * sw, cq.x * sw + cq.y * cw);
  float n = 0.52 * stN(w * 1.8 + vS.y * 17.0 + vec2(-vS.x * 0.3, -vS.x * 0.5)) + 0.31 * stN(w * 3.9 - vS.y * 9.0 + vec2(vS.x * 0.4, 0.0)) + 0.17 * stN(w * 8.3 + vS.y * 5.0 + vec2(vS.x * 0.5, -vS.x * 0.3));
  // THE BODY OF A BILLOW (round 11): thick at its heart, heaped in lobes toward its rim, and it HAS a rim: a column's puff and a bank's head
  // end in an outline (the thin skins and shore wisps stay soft through and through). A column's puff near the top of its climb is torn:
  // its lobes part and it goes in shreds (vLs.z). firm: the columns in the lee, the alder's plume, the heads of the gallery bank.
  float firm = step(1.5, vT); float tint = vT - 2.0 * firm; float tear = vLs.z;
  float body = mix(mix(0.55, 0.22, vS.w), 1.0, firm);                          // how much of an outline: a bank's soft head 0.55, a skin 0.22
  float dens = (0.8 - r) + (0.85 + 0.5 * tear) * (n - 0.5) * (1.0 - smoothstep(0.62, 1.0, r)) - 0.3 * tear;       // (the lobes die away before the quad's own edge: no billow is ever cut by it)
  float cover = smoothstep(0.0, mix(0.55, 0.2, body), dens); float thick = smoothstep(0.0, 0.75, dens);
  float al = cover * mix(mix(0.1, 0.45, body), 1.0, thick) * 1.5 * vS.z * smoothstep(-1.0, -0.4, vQ.y) * smoothstep(0.02, mix(2.5, 0.3, vS.w), vWp.y);
  al = mix(0.7, 0.82, firm) * (1.0 - exp(-al / 0.7));
  if (al < 0.004) discard;
  vec3 Vd = vWp - cameraPosition; Vd /= max(length(Vd), 1e-4);
  float fs = max(dot(Vd, uStSun), 0.0); fs *= fs; fs *= fs;
  vec2 sx = uStSun.xz / max(length(uStSun.xz), 1e-3);
  float side = 0.5 + 0.5 * dot(Vd.xz, sx);
  // lit as a heap of round lobes: each lobe's shoulder toward the sun bright (rose, and gold at its thin edge where the look has a low sun),
  // its side away from the sun and the hollows between lobes in cool shade. The slope of the body across the picture stands for its form.
  vec2 gd = vec2(dFdx(dens), dFdy(dens)) / max(length(dFdx(vQ)), 1e-5);
  float lobe = clamp(-dot(gd, vLs.xy) * 0.42, -1.0, 1.0);
  float lit = clamp(0.5 * clamp(dot(vQ, vL), -1.0, 1.0) + mix(0.3, 0.65, firm * vS.w) * lobe + 0.2 * vQ.y, -1.0, 1.0); float lk = smoothstep(-0.5, 0.6, lit);      // (a bank's wide head takes less of the lobes' slope than a column's puff: drawn out sideways, it would streak)
  float kk = clamp(mix(0.1 + 0.34 * side + 0.5 * lk, 0.16 + 0.78 * lk, min(tint * 1.3, 1.0)), 0.0, 1.0);
  vec3 c = mix(uStA * mix(1.0, 0.8, body), uStB * (1.05 + 0.1 * tint) * mix(vec3(1.0), vec3(1.08, 0.85, 0.92), tint * (1.0 - 0.65 * firm)), kk)
    + uStScat * fs * (0.5 + 0.7 * n) * (1.0 - 0.45 * tint) + uStGold * (0.2 + 0.6 * (1.0 - thick)) * smoothstep(0.0, 0.7, lit) * (0.3 + 0.7 * side) * body;
  c = stHold(c);
  gl_FragColor = vec4(c, al);
}`,js=`
attribute vec4 aD;                                // (seed, fall speed, twinkle rate, size m)
uniform vec4 uGl; uniform float uPx; uniform vec3 uGlWind; uniform vec2 uEv;      // uGl = (box xz, box y, time, max pixels)   uEv = (u now, u born)
varying float vTw;
void main(){
  vec3 box = vec3(uGl.x, uGl.y, uGl.x); float T = uGl.z; vec3 p; float k = 1.0;
  #ifdef FALL
    float hh = max(position.y, 0.5); float lf = fract(T * aD.y / hh + aD.x * 7.0);            // shed from a bough at height position.y, down to the water, again and again
    p = vec3(position.x, hh * (1.0 - lf), position.z) + uGlWind * lf * hh * 0.5;
    p.xz += 0.16 * vec2(sin(T * 1.1 + aD.x * 50.0), cos(T * 0.9 + aD.x * 31.0));
    k = smoothstep(0.0, 0.05, lf) * (1.0 - smoothstep(0.93, 1.0, lf));
  #elif defined(EVENT)
    float age = (uEv.x - uEv.y) * ${G0.toFixed(1)};
    p = position; p.y -= age * aD.y * (1.0 + 2.5 * aD.x) + 0.4 * age * age; p += uGlWind * age * (0.4 + aD.x);
    p.xz += 0.25 * vec2(sin(age * 1.3 + aD.x * 50.0), cos(age * 1.1 + aD.x * 31.0));
    k = step(0.0, age) * (1.0 - smoothstep(3.0, 5.5, age)) * step(0.05, p.y);
  #else
    vec3 b = position * box;
    b.y -= T * aD.y; b += uGlWind * T * (0.5 + aD.x);
    b.xz += 0.4 * vec2(sin(T * 0.23 + aD.x * 50.0), cos(T * 0.19 + aD.x * 31.0));
    #ifdef SNOWFALL
      vec3 c = cameraPosition + vec3(0.0, box.y * 0.22, 0.0);
    #else
      vec3 c = cameraPosition + vec3(0.0, box.y * 0.38, 0.0);         // diamond dust through the whole air column, from the water to twenty metres up
    #endif
    p = mod(b - c, box) - 0.5 * box + c;
    k = step(0.05, p.y) * (1.0 - smoothstep(0.38 * box.x, 0.5 * box.x, length(p.xz - c.xz)));
  #endif
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float tw = max(sin(T * aD.z + aD.x * 80.0), 0.0); tw *= tw; tw *= tw; tw *= tw;
  vTw = k * smoothstep(1.2, 4.0, -mv.z);
  #ifdef SNOWFALL
    vTw *= 0.75;
  #elif defined(FALL)
    vTw *= (0.3 + 0.7 * tw) * (1.0 - smoothstep(22.0, 60.0, -mv.z));
  #else
    vTw *= 0.05 + 0.95 * tw;
    #ifndef EVENT
      vTw *= 1.0 - 0.72 * smoothstep(9.0, 30.0, -mv.z);            // eased with distance: pinpoints near, a faint glitter far
    #endif
  #endif
  gl_PointSize = clamp(aD.w / max(uPx * -mv.z, 1e-4), 1.5, uGl.w);
  gl_Position = projectionMatrix * mv;
}`,Qs=`
uniform vec3 uGlCol; varying float vTw;
void main(){
  vec2 q = gl_PointCoord * 2.0 - 1.0; float d = 1.0 - smoothstep(0.15, 1.0, length(q));
  #ifdef SNOWFALL
    gl_FragColor = vec4(uGlCol, vTw * d);
  #else
    gl_FragColor = vec4(uGlCol * vTw * d, 1.0);
  #endif
}`;function Ye(){const n=[],r=[],D=[],S=[],P=[];return{add:(R,z,w,F,G,K,E,q,j)=>{const b=R.length,A=n.length/3;let u=q*7.31%5;for(let g=0;g<b;g++){const y=R[Math.max(g-1,0)],v=R[Math.min(g+1,b-1)],k=R[g];let W=v[0]-y[0],p=v[1]-y[1],L=v[2]-y[2];const Z=Math.hypot(W,p,L)||1;W/=Z,p/=Z,L/=Z,g&&(u+=Math.hypot(k[0]-R[g-1][0],k[1]-R[g-1][1],k[2]-R[g-1][2]));const X=g/(b-1),r0=I(z,w,X),O=r0+F,s0=I(K,E,X*X);for(const m0 of[-1,1])n.push(k[0],k[1],k[2]),r.push(W,p,L),D.push(O,m0,r0/O,u),S.push(s0,q,G,j)}for(let g=0;g<b-1;g++){const y=A+g*2;P.push(y,y+1,y+3,y,y+3,y+2)}},build:()=>{const R=new d.BufferGeometry;return R.setAttribute("position",new d.Float32BufferAttribute(n,3)),R.setAttribute("aTan",new d.Float32BufferAttribute(r,3)),R.setAttribute("aR",new d.Float32BufferAttribute(D,4)),R.setAttribute("aW",new d.Float32BufferAttribute(S,4)),R.setIndex(P),R.computeBoundingSphere(),R.boundingSphere.radius+=1.5,R},tris:()=>P.length/3}}function A0(n,r,D,S,P,V,N){const R=[[r[0],r[1],r[2]]];let z=D.slice(),w=r.slice();const F=S/P;for(let G=1;G<=P;G++){z[1]-=V/P,z[0]+=n.range(-N,N),z[2]+=n.range(-N,N),z[1]+=n.range(-N,N)*.5;const K=Math.hypot(z[0],z[1],z[2])||1;z=[z[0]/K,z[1]/K,z[2]/K],w=[w[0]+z[0]*F,w[1]+z[1]*F,w[2]+z[2]*F],R.push(w)}return R}const kt=(n,r)=>{const D=r[0]-n[0],S=r[1]-n[1],P=r[2]-n[2],V=Math.hypot(D,S,P)||1;return[D/V,S/V,P/V]};function xa(n,r,D,S,P,V,N,R=1.1){if(S=Math.min(S,D[1]-R),S<.5)return;const z=[];for(let w=0;w<=3;w++){const F=w/3;z.push([D[0]+P[0]*S*.16*Math.sqrt(F),D[1]-S*F,D[2]+P[1]*S*.16*Math.sqrt(F)])}n.add(z,.004,.003,N,1,0,1,V,1)}function Xe(n,r,D,S,P={}){const V=r.range(0,6.28),N=P.leanAz??r.range(0,6.28),R=P.lean??r.range(.08,.3),z=D/11,w=A0(r,[0,-.4,0],[Math.sin(N)*R,1,Math.cos(N)*R],D*r.range(.26,.36)+.4,4,0,.05);n.add(w,.3*z+.06,.2*z+.04,.02,.55,0,0,V,0);const F=w[w.length-1],G=S?r.int(4,6):3,K=r.range(0,6.28);for(let E=0;E<G;E++){const q=K+E/G*6.283+r.range(-.4,.4),j=r.range(.55,1),b=A0(r,F,[Math.sin(q)*(1-j*.5),j,Math.cos(q)*(1-j*.5)],D*r.range(.5,.72),S?6:4,r.range(.9,1.4),.07);n.add(b,.12*z,.02,S?.03:.07,.8,0,.12,V+E,0);const A=[];for(let y=2;y<b.length;y++)A.push(b[y]);const u=S===2?5:S?3:1;for(let y=0;y<u;y++){const v=r.int(1,b.length-2),k=kt(b[v],b[v+1]),W=r.range(-1.1,1.1),p=[k[0]*Math.cos(W)-k[2]*Math.sin(W),k[1]+r.range(0,.3),k[0]*Math.sin(W)+k[2]*Math.cos(W)],L=A0(r,b[v],p,D*r.range(.16,.3),S?4:3,r.range(.8,1.5),.08);n.add(L,.035*z,.008,S?.03:.1,.92,.03,.3,V+y*3,0);for(let Z=1;Z<L.length;Z++)A.push(L[Z])}const g=[Math.sin(q),Math.cos(q)];if(S){const y=P.per??(S===2?4:3);for(const v of A)for(let k=0;k<y;k++)xa(n,r,[v[0]+r.range(-.25,.25),v[1],v[2]+r.range(-.25,.25)],r.range(.16,.46)*D,g,V+k+v[0],.028,P.minY)}else for(let y=0;y<3;y++){const v=A[r.int(0,A.length-1)];xa(n,r,v,r.range(.25,.45)*D,g,V+y,.16)}}}function Mt(n,r,D,S,P={}){const V=r.range(0,6.28),N=P.leanAz??r.range(0,6.28),R=P.lean??r.range(.02,.12),z=D/9,w=A0(r,[0,-.4,0],[Math.sin(N)*R,1,Math.cos(N)*R],D+.4,7,P.curve??0,.03),F=P.thick??1;n.add(w,(.17*z+.04)*F,.02*F,.022,.6,0,.05,V,0);const G=S===2?D>14?32:24:S?15:8;for(let K=0;K<G;K++){const E=.24+.72*((K+r())/G),q=E*(w.length-1),j=Math.min(Math.floor(q),w.length-2),b=q-j,A=[I(w[j][0],w[j+1][0],b),I(w[j][1],w[j+1][1],b),I(w[j][2],w[j+1][2],b)],u=K*2.4+r.range(-.5,.5),g=r.range(.45,.9),y=D*(.36-.24*E)*r.range(.8,1.2),v=A0(r,A,[Math.sin(u),g,Math.cos(u)],y,S?4:3,-.35,.07);n.add(v,.045*z*(1.1-E)*F,.008,S?.03:.11,.9,0,.1,V+K,0);const k=S===2?7:S?4:2;for(let W=0;W<k;W++){const p=v[r.int(1,v.length-1)],L=u+r.range(-1.3,1.3);n.add(A0(r,p,[Math.sin(L),r.range(.1,.9),Math.cos(L)],y*r.range(.25,.5),2,r.range(-.3,.3),.1),.01,.004,S?.032:.12,1,.02,.2,V+W,0)}}}async function Us(n,r,D,S={}){const P=r.range(0,6.28),V=S.leanAz??0,N=S.lean??.2,R=D/9,z=S.thick??1,w=S.ok||(()=>!0),F=S.fall||[],G=S.clear||(()=>!0),K=(v,...k)=>{v.every(G)&&n.add(v,...k)},E=A0(r,[0,-.4,0],[Math.sin(V)*N,1,Math.cos(V)*N],D+.4,10,S.curve??0,.025),q=(.17*R+.04)*z;n.add(E,q,.03*z,.03,.8,0,.04,P,4);for(let v=0;v<5;v++){const k=V+.6+v/5*6.283+r.range(-.3,.3),W=Math.sin(k),p=Math.cos(k),L=r.range(.9,1.5);n.add([[W*q*.3,.9,p*q*.3],[W*q*.95,.35,p*q*.95],[W*(q+L*.6),0,p*(q+L*.6)],[W*(q+L),-.35,p*(q+L)]],q*.42,q*.14,.02,.5,0,0,P+v,4)}const j=v=>{const k=$(v,0,1)*(E.length-1),W=Math.min(Math.floor(k),E.length-2),p=k-W;return[I(E[W][0],E[W+1][0],p),I(E[W][1],E[W+1][1],p),I(E[W][2],E[W+1][2],p)]},b=(v,k)=>{const W=r.int(2,4);for(let p=0;p<W;p++){const L=r.range(.07,.13),Z=r.range(-.05,.05),X=r.range(-.05,.05);K([[v[0]+Z,v[1],v[2]+X],[v[0]+Z*1.5,v[1]-L,v[2]+X*1.5]],.014,.009,.004,.3,.5,1.1,k+p,4)}if(r()<.6)for(let p=0;p<2;p++){const L=r.range(0,6.28);K([[v[0],v[1],v[2]],[v[0]+Math.cos(L)*.04,v[1]+.035,v[2]+Math.sin(L)*.04]],.019,.013,.003,.25,.3,.5,k,4)}},A=(v,k,W,p,L,Z)=>{const X=A0(r,v,k,W,4,r.range(.1,.6),.09);K(X,p,.006,.04,1,.02,.22,L,4);for(let r0=1;r0<X.length;r0++){const O=kt(X[r0-1],X[r0]),s0=(r0%2?1:-1)*r.range(.5,1),m0=Math.cos(s0),c0=Math.sin(s0),e0=A0(r,X[r0],[O[0]*m0-O[2]*c0,O[1]+r.range(-.25,.35),O[0]*c0+O[2]*m0],W*r.range(.3,.5),3,r.range(-.15,.5),.12);K(e0,Math.max(p*.6,.006),.004,.036,1,.03,.26,L+r0,4),r()<Z&&b(e0[e0.length-1],L+r0)}Z>0&&b(X[X.length-1],L)},u=(v,k,W,p,L,Z,X,r0,O)=>{let s0=A0(r,v,[Math.sin(k),W,Math.cos(k)],p,6,Z,.06),m0=s0.length;for(;m0>2&&!w(s0[m0-1]);)m0--;s0=s0.slice(0,m0),n.add(s0,L,.012,.05,.95,0,.1,P+O,4);for(let c0=0;c0<X;c0++){const e0=$(1+Math.floor((c0+r())/X*(s0.length-1)),1,s0.length-1),W0=kt(s0[e0-1],s0[e0]),g0=(c0%2?1:-1)*r.range(.4,1.1),t0=Math.cos(g0),J0=Math.sin(g0);A(s0[e0],[W0[0]*t0-W0[2]*J0,W0[1]*.5+r.range(-.4,.3),W0[0]*J0+W0[2]*t0],Math.min(p,4.5)*r.range(.22,.36),L*.3+.006,P+c0+O,r0),c0%2===0&&F.push(s0[e0])}A(s0[s0.length-1],kt(s0[s0.length-2],s0[s0.length-1]),Math.min(p,4.5)*.28,.013,P+O,r0),F.push(s0[s0.length-1])},g=S.low??8;for(let v=0;v<g;v++){const k=2.2+3.7*((v+r.range(.1,.9))/g),W=(k+.4)/(D+.4)/Math.cos(Math.atan(N));u(j(W),V+1.1+v*2.4+r.range(-.35,.35),r.range(.28,.55),r.range(3.8,5.4),.05*R*z*.72,r.range(.6,1),8,.8,v),S.yield&&(v&3)===3&&await S.yield()}const y=S.high??28;for(let v=0;v<y;v++){const k=.36+.61*((v+r())/y),W=D*(.33-.22*k)*r.range(.8,1.2);u(j(k),v*2.4+r.range(-.5,.5),r.range(.45,.9),W,.045*R*(1.1-k)*z,-.35,5,.45,20+v),S.yield&&(v&7)===7&&await S.yield()}return E}function To(n,r,D,S,P={}){const V=r.range(0,6.28),N=r.range(0,6.28),R=D/7,z=A0(r,[0,-.4,0],[Math.sin(N)*.1,1,Math.cos(N)*.1],D+.4,5,0,.04);n.add(z,.24*R+.05,.11*R,.018,.5,0,0,V,2);const w=S?r.int(4,6):3;for(let F=0;F<w;F++){const G=r.int(2,z.length-1),K=r.range(0,6.28);n.add(A0(r,z[G],[Math.sin(K),r.range(.2,.9),Math.cos(K)],r.range(.8,2.4)*R,3,r.range(-.3,.5),.12),.06*R,.02,S?.025:.07,.75,0,0,V+F,2)}if(P.bough){const F=A0(r,[z[4][0],z[4][1],z[4][2]],[P.bough[0],.25,P.bough[1]],3.2,4,.35,.03);return n.add(F,.09,.05,.025,.8,0,.05,V,2),F[F.length-1]}return z[z.length-1]}function Os(n,r,D=9){for(let S=0;S<D;S++){const P=r.range(-.55,.55),V=r.range(-.55,.55),N=r.range(1.4,2.3),R=r.range(-.22,.22),z=r.range(-.18,.18),w=[],F=r.range(0,6.28);for(let j=0;j<=3;j++){const b=j/3;w.push([P+R*b*b*N,-.1+(N+.1)*b*(1-.05*b),V+z*b*b*N])}n.add(w,.007,.004,.006,.5,0,1,F,3);const G=w[3],K=r.range(.24,.4),E=R+r.range(-.3,.3),q=z+r.range(-.2,.2);n.add([G,[G[0]+E*K*.5,G[1]+K*.5,G[2]+q*K*.5],[G[0]+E*K,G[1]+K*r.range(.6,.95),G[2]+q*K]],.006,.002,.05,1,1,1.3,F,3)}}function Ys(n){const r=[],D=[],S=[],P=[],V=[],N=(b,A,u,g)=>(r.push(b[0],b[1],b[2]),D.push(A[0],A[1],A[2]),S.push(u[0],u[1],u[2]),P.push(g[0],g[1],g[2],g[3]),r.length/3-1),R=(b,A,u,g)=>{V.push(b,A,u,b,u,g)},z=(b,A,u)=>{const g=r.length/3;b.forEach((y,v)=>{for(let k=0;k<A;k++)u(y,v,k/A*Math.PI*2)});for(let y=0;y<b.length-1;y++)for(let v=0;v<A;v++){const k=g+y*A+v,W=g+y*A+(v+1)%A;R(k,W,W+A,k+A)}},w=n.bl,F=n.br,G=n.bodyNR||9,K=[];for(let b=0;b<=G;b++)K.push(b/G);const E=n.mottle||0;z(K,n.bodyNS||8,(b,A,u)=>{const g=Math.pow(Math.max(Math.sin(Math.PI*Math.pow(b,.8)),0),.75)+.02,y=Math.sin(u),v=y<-.25?b<.42?n.thigh:n.belly:n.body,k=1+E*((Math.sin(A*12.9898+u*78.233)*43758.5453%1+1)%1-.5),W=[v[0]*k,v[1]*k,v[2]*k];if(n.loft){const p=Math.pow(Math.max(Math.sin(Math.PI*Math.pow(b,1.25)),0),.8)+.03,L=Math.pow(Math.max(Math.sin(Math.PI*Math.pow(b,1.1)),0),.85)+.03;N([F*p*Math.cos(u),F*.74*L*y*(y<0?.82:1)+F*(.2*b-.06),I(-.58*w,.42*w,b)],[Math.cos(u),y*1.2,(b-.55)*.8],W,[0,b,0,0]);return}N([F*g*Math.cos(u),F*.9*g*y+.03*b,I(-.58*w,.42*w,b)],[Math.cos(u),y,(b-.5)*.8],W,[0,b,0,0])}),z([0,.2,.4,.6,.8,1],6,(b,A,u)=>{const g=I(n.nr0,n.nr1,H(0,.6,b));N([g*Math.cos(u),g*Math.sin(u),0],[Math.cos(u),Math.sin(u),0],n.neck,[1,b,0,0])});const q=n.hr;z([0,.2,.45,.7,.9,1],6,(b,A,u)=>{const g=b*Math.PI,y=Math.max(Math.sin(g),.05),v=q*(.3-1.25*Math.cos(g));N([q*.85*y*Math.cos(u),q*y*Math.sin(u)+q*.2,v],[Math.cos(u),Math.sin(u),-Math.cos(g)],n.head,[2,b,0,.4*Math.max(Math.cos(u-.35),Math.cos(u-Math.PI+.35),0)])}),z(n.billRings,5,(b,A,u)=>N([b[1]*Math.cos(u),b[2]*Math.sin(u)+b[3],q*1.2+b[0]],[Math.cos(u),Math.sin(u),.3],b[4],[2,0,0,1]));for(const b of[-1,1]){const A=n.nsp||10,u=n.nc||4,g=r.length/3;for(let y=0;y<=A;y++)for(let v=0;v<=u;v++){const k=y/A,W=v/u,p=n.chord*.3-n.sweep*n.W*k*k,L=n.chord*(1-n.taper*Math.pow(k,n.tp)),Z=(n.fan||0)*H(.55,1,k),X=(n.camber||0)*(1-.6*k),r0=-1.7*X*Math.pow(W,.7),O=Math.hypot(1,r0);N([n.W*k+W*L*Math.sin(Z),.02*Math.sin(Math.PI*W)*(n.fan?1:0)-X*L*Math.pow(W,1.7),p-W*L*Math.cos(Z)],[0,1/O,r0/O],n.wingColor(k,W),[3,k,b,W])}for(let y=0;y<A;y++)for(let v=0;v<u;v++){const k=g+y*(u+1)+v;R(k,k+1,k+u+2,k+u+1)}}{const b=r.length/3,A=-.5*w,u=4;for(let g=0;g<=u;g++){const y=(g/u-.5)*2;N([y*F*(n.tailW0??.45),.02,A],[0,1,0],n.tailC,[0,0,0,0]),N([y*n.tailW,0,A-n.tail*(1-.25*y*y)],[0,1,0],n.tailC,[0,0,0,0])}for(let g=0;g<u;g++){const y=b+g*2;R(y,y+1,y+3,y+2)}if(n.loft)for(const g of[-1,1]){const y=r.length/3,v=g*F*.5,k=-F*.2;N([v,k-.02,A+.14],[0,1,0],n.foot,[0,0,0,0]),N([v-.04,k,A-.1],[0,1,0],n.foot,[0,0,0,0]),N([v+.005*g,k+.005,A-n.footL],[0,1,0],n.foot,[0,0,0,0]),N([v+.05,k,A-.12],[0,1,0],n.foot,[0,0,0,0]),R(y,y+1,y+2,y+3)}else for(const g of[-1,1]){const y=r.length/3,v=g*F*.3,k=-F*.55;N([v,k+.03,A+.12],[0,-1,0],n.foot,[0,0,0,0]),N([v-.05,k,A-.08],[0,-1,0],n.foot,[0,0,0,0]),N([v,k-.01,A-n.footL],[0,-1,0],n.foot,[0,0,0,0]),N([v+.05,k,A-.08],[0,-1,0],n.foot,[0,0,0,0]),R(y,y+1,y+2,y+3)}}const j=new d.InstancedBufferGeometry;return j.setAttribute("position",new d.Float32BufferAttribute(r,3)),j.setAttribute("normal",new d.Float32BufferAttribute(D,3)),j.setAttribute("color",new d.Float32BufferAttribute(S,3)),j.setAttribute("aB",new d.Float32BufferAttribute(P,4)),j.setIndex(V),j}const oe=[.74,.735,.75],ba=[.022,.022,.026],we=[.8,.52,.06],zt=[.035,.028,.024],Xs={loft:1,twist:1,bl:.92,br:.19,nl:.8,nr0:.068,nr1:.036,hr:.054,W:1.18,chord:.47,sweep:.12,taper:.7,tp:2.2,tail:.19,tailW:.045,tailW0:.42,footL:.36,finger:.35,fan:.5,camber:.36,nsp:12,nc:5,bodyNS:10,bodyNR:11,neckY:.42,wingP:[18,.62,.86,.5],body:oe,belly:[.55,.59,.7],thigh:[.55,.59,.7],neck:oe,head:oe,tailC:oe,foot:ba,wingColor:(n,r)=>[oe[0]*(1-.1*r),oe[1]*(1-.08*r),oe[2]],billRings:[[-.03,.03,.03,.012,we],[.03,.024,.02,.006,we],[.07,.019,.012,0,ba],[.105,.006,.004,-.004,ba]]},$s={twist:.4,bl:.8,br:.21,nl:.13,nr0:.105,nr1:.09,hr:.088,W:1.2,chord:.6,sweep:.03,taper:.3,tp:3,tail:.38,tailW:.25,footL:.12,finger:1,fan:1.15,nsp:18,nc:6,bodyNS:10,mottle:.5,wingP:[26,.66,.8,.3],body:[.05,.04,.034],belly:zt,thigh:oe,neck:[.07,.058,.05],head:[.085,.072,.064],tailC:oe,foot:we,wingColor:(n,r)=>[zt[0]*(1.5+.9*r),zt[1]*(1.5+.9*r),zt[2]*(1.5+.9*r)],billRings:[[-.03,.045,.055,0,we],[.04,.035,.05,-.005,we],[.09,.02,.035,-.02,we],[.125,.004,.008,-.05,we]]},Zs=`
attribute vec3 color; attribute vec4 aB; attribute vec3 aOff; attribute vec4 iP; attribute vec4 iQ;
uniform float uPx;
varying vec3 vWp; varying vec3 vN; varying vec3 vCol;
void main(){
  float part = aB.x; vec3 lp = position; vec3 ln = normal; vec3 lo = aOff;
  if (part > 0.5 && part < 1.5) {
    float a = 0.4 * sin(iQ.x + aB.y); float c = cos(a), s = sin(a);
    vec3 pv = vec3(position.x, 0.64, aB.z); vec3 r = position - pv;
    lp = pv + vec3(r.x, r.y * c - r.z * s, r.y * s + r.z * c); ln = vec3(normal.x, normal.y * c - normal.z * s, normal.y * s + normal.z * c);
  } else if (part > 1.5) {
    if (part > 2.5) lp = mix(vec3(0.0, 1.38, 0.70), position, iQ.w);
    float a = iQ.y; float c = cos(a), s = sin(a); vec3 pv = vec3(0.0, 0.84, 0.36); vec3 r = lp - pv;
    lp = pv + vec3(r.x, r.y * c - r.z * s, r.y * s + r.z * c); ln = vec3(normal.x, normal.y * c - normal.z * s, normal.y * s + normal.z * c);
  }
  lp.y += 0.012 * sin(iQ.x * 2.0);
  float ch = cos(iP.w), sh = sin(iP.w);
  vec3 wl = vec3(lp.x * ch + lp.z * sh, lp.y, -lp.x * sh + lp.z * ch) * iQ.z;
  vec4 wp = modelMatrix * vec4(iP.xyz + wl, 1.0);
  if (part > 2.5) {
    float dist = length(wp.xyz - cameraPosition); float k = max(1.0, uPx * dist * 0.85 / max(aB.w * iQ.z, 1e-4)) - 1.0;
    wp.xyz += vec3(lo.x * ch + lo.z * sh, lo.y, -lo.x * sh + lo.z * ch) * iQ.z * iQ.w * min(k, 5.0);
  }
  vWp = wp.xyz; vN = vec3(ln.x * ch + ln.z * sh, ln.y, -ln.x * sh + ln.z * ch); vCol = color;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Co=`
varying vec3 vWp; varying vec3 vN; varying vec3 vCol;
${Ue}
${I0}
void main(){
  vec3 N = vN / max(length(vN), 1e-4);
  vec3 Vv = cameraPosition - vWp; Vv /= max(length(Vv), 1e-4);
  float hair = 0.85 + 0.3 * vnoise(vWp.xy * 23.0 + vWp.z * 17.0);
  vec3 c = shade(vCol * hair * 0.42, N, Vv, 0.0, 1.5) * (0.55 + 0.45 * smoothstep(0.0, 0.45, vWp.y));     // wet and dark at the water
  gl_FragColor = vec4(steamApply(c, vWp, 1.0), 1.0);
}`,Js=`
attribute vec4 iP; attribute vec4 iQ;
varying vec2 vQ; varying vec4 vS; varying vec3 vWp;
void main(){
  vec4 mv; vec3 wp;
  if (iQ.w < 0.5) {
    float ch = cos(iQ.x), sh = sin(iQ.x); vec2 l = vec2(position.x * 0.5, -(position.y * 0.5 + 0.42)) * iP.w;
    wp = vec3(iP.x + l.x * ch + l.y * sh, 0.025, iP.z - l.x * sh + l.y * ch); mv = viewMatrix * vec4(wp, 1.0);
  } else { mv = viewMatrix * vec4(iP.xyz, 1.0); mv.xy += position.xy * iP.w; wp = cameraPosition + mv.xyz * mat3(viewMatrix); }
  vQ = position.xy; vS = vec4(iQ.y, iQ.z * smoothstep(1.5, 5.0, -mv.z), iQ.w, 0.0); vWp = wp;
  gl_Position = projectionMatrix * mv;
}`,en=`
varying vec2 vQ; varying vec4 vS; varying vec3 vWp;
uniform float uTime; uniform vec3 uSunCol; uniform vec3 uSky;
${I0}
void main(){
  float al; vec3 c;
  if (vS.z < 0.5) {
    float back = (1.0 - vQ.y) * 0.5; float lat = abs(vQ.x);
    float x = (lat - (0.05 + 0.80 * back)) / (0.07 + 0.2 * back); float arm = exp(-x * x) * (0.35 + 0.65 * stN(vec2(back * 9.0 - uTime * 0.8, vS.x * 31.0 + sign(vQ.x) * 3.0)));
    float rip = 0.5 + 0.5 * sin(back * 30.0 - uTime * 4.0 + vS.x * 6.0);
    float inside = 1.0 - smoothstep(0.0, 0.06 + 0.8 * back, lat);
    float fade = (1.0 - back); fade *= fade;
    al = (arm * (0.45 + 0.4 * rip) + inside * rip * 0.22) * fade * smoothstep(0.0, 0.05, back) * vS.y * 0.75;
    c = uSky * 1.5 + uSunCol * 0.8;
  } else {
    float r = length(vQ); float soft = 1.0 - smoothstep(0.0, 1.0, r);
    float n = 0.6 * stN(vQ * 2.1 + vS.x * 17.0 + vec2(0.0, -uTime * 0.3)) + 0.4 * stN(vQ * 4.7 - vS.x * 9.0);
    al = soft * (0.25 + 0.95 * smoothstep(0.2, 0.8, n)) * vS.y;
    vec3 Vd = vWp - cameraPosition; Vd /= max(length(Vd), 1e-4);
    float fs = max(dot(Vd, uStSun), 0.0); fs *= fs; fs *= fs;
    c = uSky * 1.25 + uSunCol * (0.3 + 1.6 * fs);
  }
  if (al < 0.004) discard;
  gl_FragColor = vec4(steamApply(c, vWp, 1.0), min(al, 0.85));
}`,tn=`
attribute vec3 color; attribute vec4 aB;
uniform vec4 uCrA[2]; uniform vec4 uCrB[2];
varying vec3 vWp; varying vec3 vN; varying vec3 vCol;
void main(){
  vec4 A = mix(uCrA[0], uCrA[1], aB.x); vec4 B = mix(uCrB[0], uCrB[1], aB.x);
  vec3 lp = position; vec3 ln = normal;
  if (aB.y > -0.5) {
    float a = 0.6 * sin(B.x + aB.y); float c = cos(a), s = sin(a); vec3 pv = vec3(position.x, aB.w, aB.z); vec3 r = position - pv;
    lp = pv + vec3(r.x, r.y * c - r.z * s, r.y * s + r.z * c); ln = vec3(normal.x, normal.y * c - normal.z * s, normal.y * s + normal.z * c);
  }
  float cp = cos(B.y), sp = sin(B.y);
  lp = vec3(lp.x, lp.y * cp + lp.z * sp, -lp.y * sp + lp.z * cp); ln = vec3(ln.x, ln.y * cp + ln.z * sp, -ln.y * sp + ln.z * cp);
  lp.y += B.w;
  float ch = cos(A.w), sh = sin(A.w);
  vec3 wl = vec3(lp.x * ch + lp.z * sh, lp.y, -lp.x * sh + lp.z * ch) * B.z;
  vec4 wp = modelMatrix * vec4(A.xyz + wl, 1.0);
  vWp = wp.xyz; vN = vec3(ln.x * ch + ln.z * sh, ln.y, -ln.x * sh + ln.z * ch); vCol = color;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;function an(){const n=[],r=[],D=[],S=[],P=[],V=(b,A,u,g)=>(n.push(b[0],b[1],b[2]),r.push(A[0],A[1],A[2]),D.push(u[0],u[1],u[2]),S.push(g[0],g[1],g[2],g[3]),n.length/3-1),N=(b,A,u)=>{for(let g=0;g<A-1;g++)for(let y=0;y<u;y++){const v=b+g*u+y,k=b+g*u+(y+1)%u;P.push(v,k,k+u,v,k+u,v+u)}},R=(b,A,u,g,y=1)=>{const v=n.length/3;b.forEach(([k,W,p],L)=>{for(let Z=0;Z<A;Z++){const X=Z/A*6.2832,r0=Math.cos(X),O=Math.sin(X);V([p*r0*y,k+p*O,W],[r0,O,0],u(L,O),g)}}),N(v,b.length,A)},z=(b,A,u,g,y,v,k)=>{const W=n.length/3;for(const[p,L]of[[u,1.25],[u*.5,.85],[0,.7]])for(let Z=0;Z<5;Z++){const X=Z/5*6.2832;V([b+g*L*Math.cos(X),p,A+g*L*Math.sin(X)],[Math.cos(X),0,Math.sin(X)],k,[v,y,A,u])}N(W,3,5)},w=[.45,.28,.16],F=[.85,.8,.72],G=[.06,.05,.045];R([[.34,-.3,.02],[.35,-.26,.085],[.36,-.05,.1],[.365,.14,.105],[.39,.26,.08],[.43,.35,.062],[.455,.42,.058],[.44,.47,.045],[.425,.53,.022],[.42,.56,.012]],7,(b,A)=>b>=9?G:b>=3&&A<-.3?F:w,[0,-1,0,0],.86),R([[.34,-.28,.03],[.33,-.36,.06],[.31,-.48,.075],[.29,-.6,.065],[.275,-.7,.03],[.27,-.74,.005]],6,b=>b>=4?F:w,[0,-1,0,0]);for(const b of[-1,1]){const A=V([b*.02,.5,.4],[0,0,-1],G,[0,-1,0,0]),u=V([b*.06,.5,.41],[0,0,-1],G,[0,-1,0,0]),g=V([b*.045,.6,.4],[0,0,-1],G,[0,-1,0,0]);P.push(A,u,g)}z(-.055,.2,.3,.02,0,0,G),z(.055,.2,.3,.02,3.1416,0,G),z(-.055,-.2,.3,.022,3.1416,0,G),z(.055,-.2,.3,.022,0,0,G);const K=[.2,.13,.09],E=[.27,.16,.09],q=[1.9,1.9,1.9];R([[.095,-.1,.006],[.075,-.06,.018],[.058,-.03,.034],[.055,0,.04],[.06,.03,.038],[.072,.055,.027],[.076,.07,.02],[.074,.085,.006],[.073,.098,.002]],6,(b,A)=>b>=7?G:b>=4&&b<=6&&A<.2?q:b>=5?E:K,[1,-1,0,0]),z(-.014,0,.03,.004,-1,1,G),z(.014,0,.03,.004,-1,1,G);const j=new d.BufferGeometry;return j.setAttribute("position",new d.Float32BufferAttribute(n,3)),j.setAttribute("normal",new d.Float32BufferAttribute(r,3)),j.setAttribute("color",new d.Float32BufferAttribute(D,3)),j.setAttribute("aB",new d.Float32BufferAttribute(S,4)),j.setIndex(P),j}function on(){const n=[],r=[],D=[],S=[],P=[],V=[],N=(E,q,j,b,A,u)=>{const g=n.length/3,y=E.length;for(let v=0;v<y;v++){const k=E[Math.max(v-1,0)],W=E[Math.min(v+1,y-1)],p=E[v];let L=W[0]-k[0],Z=W[1]-k[1],X=W[2]-k[2];const r0=Math.hypot(L,Z,X)||1;L/=r0,Z/=r0,X/=r0;let O=1-L*L,s0=-L*Z,m0=-L*X;const c0=Math.hypot(O,s0,m0)||1;O/=c0,s0/=c0,m0/=c0;const e0=Z*m0-X*s0,W0=X*O-L*m0,g0=L*s0-Z*O;for(let t0=0;t0<q;t0++){const J0=t0/q*6.2832,N0=Math.cos(J0),f0=Math.sin(J0),w0=O*p[3]*N0+e0*p[4]*f0,D0=s0*p[3]*N0+W0*p[4]*f0,Q=m0*p[3]*N0+g0*p[4]*f0,ye=j(v/(y-1),f0,N0),v0=O*N0+e0*f0,Re=s0*N0+W0*f0,se=m0*N0+g0*f0,fe=Math.hypot(v0,Re,se)||1;n.push(p[0]+w0,p[1]+D0,p[2]+Q),r.push(v0/fe,Re/fe,se/fe),D.push(ye[0],ye[1],ye[2]),S.push(b,A,u,Math.max(p[3],p[4])),P.push(w0,D0,Q)}}for(let v=0;v<y-1;v++)for(let k=0;k<q;k++){const W=g+v*q+k,p=g+v*q+(k+1)%q;V.push(W,p,p+q,W,p+q,W+q)}},R=[.036,.029,.024],z=[.06,.052,.046],w=[.46,.45,.44],F=[.016,.014,.013],G=[.085,.066,.045];N([[0,.8,-.62,.02,.03],[0,.76,-.54,.13,.17],[0,.72,-.38,.185,.225],[0,.69,-.12,.2,.235],[0,.69,.12,.2,.245],[0,.71,.3,.185,.245],[0,.76,.42,.14,.2],[0,.82,.5,.06,.1]],8,(E,q)=>E<.2&&q>-.5?w:q<-.4?z:R,0,0,0),N([[0,.8,-.6,.035,.03],[0,.7,-.66,.03,.02],[0,.63,-.67,.012,.01]],5,()=>w,0,0,0),N([[0,.8,.36,.12,.15],[0,.98,.5,.1,.115],[0,1.16,.61,.08,.09],[0,1.3,.69,.07,.075]],6,(E,q)=>q<-.5?z:R,2,0,0),N([[0,1.32,.63,.03,.04],[0,1.35,.7,.078,.085],[0,1.32,.82,.062,.065],[0,1.26,.95,.04,.042],[0,1.235,1,.02,.022]],6,E=>E>.8?F:R,2,0,0);for(const E of[-1,1]){const q=n.length/3,j=[[E*.055,1.4,.66],[E*.13,1.46,.69],[E*.21,1.52,.64],[E*.13,1.47,.62]];for(const u of j)n.push(u[0],u[1],u[2]),r.push(0,.3,.95),D.push(R[0]*1.3,R[1]*1.3,R[2]*1.3),S.push(2,0,0,.03),P.push(0,0,0);V.push(q,q+1,q+2,q,q+2,q+3);for(const[u,g]of[[.3,E<0?1.57:4.71],[-.4,E<0?0:3.14]]){const y=E*.11,v=u<0?1:0;N([[y,.72,u,.075,.095],[y,.46,u-.04*v,.045,.055],[y,.3,u+.03*v,.03,.033],[y,.03,u,.024,.027],[y,-.02,u+.03,.03,.036]],6,k=>k>.3?F:R,1,g,u)}const b=[[E*.05,1.4,.7],[E*.13,1.56,.62],[E*.24,1.74,.5],[E*.3,1.92,.42],[E*.27,2.06,.45]],A=[.022,.02,.017,.013,.007];N(b.map((u,g)=>[...u,A[g],A[g]]),4,()=>G,3,0,0);for(const[u,g]of[[1,[E*.18,1.74,.86]],[2,[E*.33,1.97,.7]],[3,[E*.4,2.03,.32]]]){const y=b[u],v=[(y[0]+g[0])/2+E*.01,(y[1]+g[1])/2-.03,(y[2]+g[2])/2+.03];N([[...y,A[u],A[u]],[...v,A[u]*.75,A[u]*.75],[...g,.006,.006]],4,()=>G,3,0,0)}}const K=new d.InstancedBufferGeometry;return K.setAttribute("position",new d.Float32BufferAttribute(n,3)),K.setAttribute("normal",new d.Float32BufferAttribute(r,3)),K.setAttribute("color",new d.Float32BufferAttribute(D,3)),K.setAttribute("aB",new d.Float32BufferAttribute(S,4)),K.setAttribute("aOff",new d.Float32BufferAttribute(P,3)),K.setIndex(V),K}function sn(n){const r=[],D=[],S=[],V=n.range(0,6.28),N=n.range(0,6.28),R=n.range(-.2,.2),z=n.range(-.2,.2),w=g=>1+.17*Math.sin(2*g+V)+.1*Math.sin(3*g+N),F=(g,y,v,k)=>{const W=r.length/3;for(let p=0;p<9;p++){const L=p/9*6.283,Z=g*w(L)*(.9+.2*n()),X=1-Math.abs(v);r.push(R*k+Math.cos(L)*Z,y*(.93+.14*n())*(.85+.15*w(L+1.3)),z*k+Math.sin(L)*Z),D.push(Math.cos(L)*X,v,Math.sin(L)*X)}return W},G=(g,y)=>{for(let v=0;v<9;v++){const k=g+v,W=g+(v+1)%9,p=y+v,L=y+(v+1)%9;S.push(k,p,L,k,L,W)}},K=F(.8,-.12,.3,0),E=F(.72,.44,.2,.3);G(K,E);const q=F(1.22,.47,.7,.4),j=F(1.08,.7,.88,.6),b=F(.46,.98,.99,1);G(E,q),G(q,j),G(j,b);const A=r.length/3;r.push(R,1.06,z),D.push(0,1,0);for(let g=0;g<9;g++)S.push(b+g,A,b+(g+1)%9);const u=new d.BufferGeometry;return u.setAttribute("position",new d.Float32BufferAttribute(r,3)),u.setAttribute("normal",new d.Float32BufferAttribute(D,3)),u.setIndex(S),u}function nn(n,r,D){for(let V=0;V<10;V++){const N=(V+D.range(.1,.9))/10*6.283,R=Math.cos(N),z=Math.sin(N),w=D.range(1.4,2),F=D.range(1.15,1.35),G=D.range(.24,.42);n.add([[R*.95,.5,z*.95],[R*F,G,z*F],[R*w,0,z*w]],.075,.02,.015,D.range(.1,.45),0,.15,D.range(0,6.28),3)}const P=9;for(let V=0;V<P;V++){const N=V/P*6.283+r.range(-.25,.25),R=Math.cos(N),z=Math.sin(N),w=r.range(.25,.8),F=r.range(.5,1.5),G=r.range(1.1,2);n.add([[R*w,.5,z*w],[R*(w+.45*F),.5+G*.55,z*(w+.45*F)],[R*(w+F),.5+G*.92,z*(w+F)],[R*(w+1.55*F),.5+G*(1-.14*F),z*(w+1.55*F)]],.05,.016,.02,r.range(.2,.5),0,.3,r.range(0,6.28),3)}for(let V=0;V<4;V++){const N=r.range(0,6.28),R=r.range(.1,.7),z=r.range(.5,1.1),w=Math.cos(N)*R,F=Math.sin(N)*R,G=r.range(-.3,.3),K=r.range(-.3,.3);n.add([[w,.8,F],[w+G*.5,.8+z*.6,F+K*.5],[w+G,.8+z,F+K]],.04,.014,.03,r.range(.4,.7),0,.5,r.range(0,6.28),3)}}function St(){const n=new d.InstancedBufferGeometry;return n.setAttribute("position",new d.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]),n}function Ro(n){const r=n.attributes.normal;let D=0;for(let S=0;S<r.count;S++)D+=r.getY(S);if(D<0){const S=n.index.array;for(let P=0;P<S.length;P+=3){const V=S[P+1];S[P+1]=S[P+2],S[P+2]=V}n.computeVertexNormals()}}const _0=(n,r,D,S,P,V)=>{n[r]=D,n[r+1]=S,n[r+2]=P,n[r+3]=V},R0=(n,r,D,S)=>{const P=new d.InstancedBufferAttribute(D instanceof Float32Array?D:new Float32Array(D),S);return n.setAttribute(r,P),P};var un={id:"cranes-in-steam",name:"The River That Never Freezes",category:"wilderness",weirdness:.05,media:["air"],async build(n){const r=n.rng,D=n.noise,S=n.vary||{},P=n.quality?.detail??1,V=$(S.density??1,.7,1.3),N=r.fork("variation")(),R=r.fork("weather");let z=N<.34?"dawn":N<.46?"blue":N<.6?"morning":N<.78?"evening":N<.88?"moon":"snow";S.hour==="dawn"?z=N<.7?"dawn":"blue":S.hour==="day"?z=N<.75?"morning":"snow":S.hour==="golden"?z="evening":S.hour==="night"&&(z="moon");const w=As[z],F=Ws[z],G=R(),K=R(),E=R(),q=(z==="dawn"||z==="morning"||z==="evening")&&G<.2,j=z!=="snow"&&z!=="moon"&&K<.18,b=!!S.rare,A=z==="snow",u=new d.Scene,g=9.6,y=new d.Vector3(150,7.5,g),k=[[-505,28],[-474,28],[-446,28.4],[-418,31.6],[-362,39],[-308,43],[-254,38.5],[-210,30],[-170,21.5],[-135,15.6],[-105,12],[-80,10.2],[-60,g]].map(([e,t])=>[e,2,t]);for(const e of[-40,-20,0,20,40])k.push([e,2,g]);for(const e of[50,60,70,80])k.push([e,2+(y.y-2)*H(40,90,e),g]);for(const e of[90,110,130,y.x])k.push([e,y.y,g]);const W=ks(k),p=W.length,L=e=>p-(y.x-e),Z=e=>L(e)/p,X=.25,r0=Math.ceil(p/X),O=new Float32Array((r0+1)*3);{const e=new d.Vector3;for(let t=0;t<=r0;t++)W.posAtDist(Math.min(t*X,p),e),O[t*3]=e.x,O[t*3+1]=e.y,O[t*3+2]=e.z}const s0=(e,t,a)=>{let o=0,s=1e18;for(let l=0;l<=r0;l+=8){const f=l*3,i=O[f]-e,c=O[f+1]-t,h=O[f+2]-a,m=i*i+c*c+h*h;m<s&&(s=m,o=l)}for(let l=Math.max(o-8,0),f=Math.min(o+8,r0);l<f;l++){const i=l*3,c=O[i],h=O[i+1],m=O[i+2],M=O[i+3]-c,x=O[i+4]-h,B=O[i+5]-m,C=$(((e-c)*M+(t-h)*x+(a-m)*B)/Math.max(M*M+x*x+B*B,1e-9),0,1),_=c+M*C-e,U=h+x*C-t,o0=m+B*C-a,J=_*_+U*U+o0*o0;J<s&&(s=J)}return Math.sqrt(s)},m0=Math.atan2(-.94,.34),c0=new d.Vector3;for(let e=0;e<=40;e++){W.tangentAt(e/40,c0);const t=Math.abs(Math.atan2(c0.z,c0.x)-m0)*180/Math.PI;(t<52||t>88)&&console.warn("cranes-in-steam: sun "+t.toFixed(0)+" deg off the heading at u="+e/40)}const e0=-180,W0=p+400,g0=4,t0=Math.ceil((W0-e0)/g0),J0=new Float32Array(t0+1),N0=new Float32Array(t0+1),f0=new Float32Array(t0+1),w0=new Float32Array(t0+1),D0=new d.Vector3;for(let e=0;e<=t0;e++){const t=e0+e*g0;W.posAtDist(t,D0),W.tangentAtDist(t,c0);const a=Math.hypot(c0.x,c0.z)||1;J0[e]=D0.x,N0[e]=D0.z,f0[e]=-c0.z/a,w0[e]=c0.x/a}const Q=(e,t,a=[0,0])=>{const o=$((e-e0)/g0,0,t0-.001),s=Math.floor(o),l=o-s,f=$(t,-60,60);return a[0]=I(J0[s],J0[s+1],l)+I(f0[s],f0[s+1],l)*f,a[1]=I(N0[s],N0[s+1],l)+I(w0[s],w0[s+1],l)*f+(t-f),a},ye=(e,t)=>{const a=W.nearestXZ(e,t),o=a.u*p;W.posAtDist(o,D0),W.tangentAtDist(o,c0);const s=Math.hypot(c0.x,c0.z)||1;return[o,((e-D0.x)*-c0.z+(t-D0.z)*c0.x)/s]},v0=D.n2,Re=(e,t,a)=>{const o=(e-t)/a;return Math.exp(-o*o)},se=(e,t,a,o)=>H(t,t+o,e)*(1-H(a-o,a,e)),fe=e=>1-.2*se(e,.215,.3,.03)-.28*(se(e,.315,.435,.035)+se(e,.49,.56,.03))-.45*H(.655,.705,e)*(1-H(.8,.885,e)),de=256,Pe=new Float32Array(de+1);{let e=0;for(let a=0;a<=de;a++)Pe[a]=e,e+=1/$(fe((a+.5)/de),.35,2.5);const t=G0/Pe[de];for(let a=0;a<=de;a++)Pe[a]*=t}const ka=e=>{const t=$(e,0,1)*de,a=Math.min(Math.floor(t),de-1);return I(Pe[a],Pe[a+1],t-a)},K0=88,Ma=.62,$e=Ma*p+9.5,za=$e+.25*30,Sa=e=>{const t=e-L(0);return H(-60,-57,t)*(1-H(57,60,t))},Aa=e=>{const t=e-L(0);return H(-86,-67,t)*(1-H(66,95,t))},Po=e=>Math.max(se(e,.34*p-12,.34*p+82,16),se(e,.52*p-14,.52*p+52,14)),ee=e=>{let t=-(15.5+3.5*v0(e*.011,1.3)+1.2*v0(e*.05,2.7))-8*Re(e,K0,40)-15*Re(e,za,27);return t=Math.min(t,I(t,-17.5,Po(e))),t=I(t,-(g+8.1),Aa(e)),I(t,-(g+9.3),Sa(e))},q0=e=>{let t=15+3*v0(e*.012,5.1)+1.2*v0(e*.045,7.7);const a=e-L(0);return I(t,Math.max(t,17.4),H(-80,-50,a))},Wa=.3,xe=(e,t)=>{const a=ee(e),o=q0(e);let s,l,f;if(t>=o)s=t-o,l=1.7+.55*v0(e*.021,11.5),f=1;else if(t<=a)s=a-t,l=I(1.9+.6*v0(e*.02,9.1),3.02,Aa(e)),f=-1;else return-.7;let i=-.5+(l+.5)*H(0,1+.45*v0(e*.09,f*7.3),s);if(i+=H(2,26,s)*(.45+.55*v0(e*.008,t*.008+3))+.1*v0(e*.08,t*.08)*H(1,5,s),f<0){const c=Sa(e)*(1-H(17,24,s));i=I(i,Math.min(i,2.72+.4*H(12,17,s)),c)}return i+=H(330,780,s)*(95+55*v0(e*.0016+f*3,t*.0016))*(.75+.25*v0(e*.006,t*.006+9))*(f<0?Wa:1)+H(120,330,s)*6*(.5+.5*v0(e*.004,t*.004)),i},rn=(e,t)=>{const a=ye(e,t);return xe(a[0],a[1])},Ba=(e,t,a,o,s,l)=>({Y:(c,h)=>{const m=Math.hypot(c/o,h/s);return l*Math.pow(Math.max(1-m*m,0),.6)-.5*H(.85,1.3,m)+.06*v0(c*.6+e[0],h*.6)},W:(c,h)=>[e[0]+t*c-a*h,e[1]+a*c+t*h],c:e,tx:t,tz:a,HL:o,HW:s}),be=(e,t,a,o,s)=>{const l=Q(e,t),f=$(Math.round((e-e0)/g0),0,t0),i=Ba(l,w0[f],-f0[f],a,o,s);return i.d=e,i.s=t,i},ue=6.6,Ze=2.5,F0=be(K0,-7.5,ue,Ze,.55),j0=F0.c,Fa=F0.tx,Ta=F0.tz,Ca=F0.Y,At=F0.W,Wt=y.x+.7,Ne=[-1,1].map(e=>Ba([Wt-.4,g+e*10.2],1,0,5.8,2.8,.6)),No=5,Bt=No+1*Math.sin(.87),De=[{side:1,lat:Bt,d0:.25*p+3,d1:.25*p+36,big:1,pairs:[[.25,8,"leap",.588,1.9],[.25,14,"bow",.225],[.27,8,"leap",.588,1.8],[.27,14,"duet"],[.29,8,"bow",.225]],back:[[13,"preen"],[27,"idle"]]},{side:-1,lat:Bt,d0:.34*p+2.5,d1:.34*p+.08*p+11,big:1.06,pairs:[[.34,6.5,"leap",.588,2.1],[.34,13,"bow",.225],[.36,6.5,"leap",.588,1.9],[.36,13,"duet"],[.38,6.5,"leap",.588,2],[.38,13,"bow",.225],[.4,6.5,"leap",.588,2.1],[.4,13,"bow",.225],[.42,6.5,"leap",.588,1.9]],back:[[18,"idle"],[38,"preen"],[57,"sleep"]]},{side:-1,lat:Bt,d0:.52*p+1.5,d1:.52*p+.03*p+18.5,big:1.08,pairs:[[.52,5.5,"leap",.588,2.15],[.52,11,"bow",.225],[.535,7,"leap",.588,1.95],[.535,12.5,"duet"],[.55,7.5,"leap",.588,2.05],[.55,13.5,"bow",.225]],back:[[11,"idle"],[27,"preen"]]}],M0=De.map(e=>be((e.d0+e.d1)/2,e.side*(e.lat+1.4),(e.d1-e.d0)/2,2.9,.33)),Je=n.core.makeRng(n.core.hashSeed("islet-tail:"+n.seed)),Ra=Je.range(7.5,11),Do=Je.range(-1.5,3),ne=be(K0+ue+Do+Ra,F0.s+Je.range(-.5,.5),Ra,Je.range(2.2,2.9),.25);M0.push(ne);const te=[be(21,-6.4,4.2,2.1,.7),be(45,7,3.8,1.9,.66),be(66,-8,3.6,1.8,.6)],Ft=[[46,-1,4.5,1.7],[.25*p+5.6,1.5,4.2,1.6],[.4*p+7,-1.4,4.6,1.6],[.55*p+8,.8,5,1.7],[L(-6),4.4,30,1.8],[L(118),0,6,2]],qo=(e,t)=>{for(const a of M0){const o=e-a.c[0],s=t-a.c[1],l=o*a.tx+s*a.tz,f=-o*a.tz+s*a.tx;if(Math.abs(l)<a.HL*1.3&&Math.abs(f)<a.HW*1.3)return Math.max(a.Y(l,f),-.06)}return-.06},qe=te[1],Tt=-Math.min(qe.HW,qe.s-5.1),re=qe.W(.8,Tt),ke=qe.W(.8,Tt-1),Lo=Math.max(qe.Y(.8,Tt),.03),Vo=Math.atan2(ke[0]-re[0],ke[1]-re[1])+.6,et=[];De.forEach((e,t)=>{e.pairs.forEach(([a,o,s,l,f,i],c)=>{const h=a*p+o,m=Q(h,e.side*(s==="duet"?e.lat-.27:e.lat)),M=$(Math.round((h-e0)/g0),0,t0),x=Math.atan2(-f0[M],w0[M]),B=s==="leap"?7:8,C=l===void 0?(.17+.37*c+.2*t)%1:((l-ka(a)/(s==="duet"?.8*B:B))%1+1)%1;et.push({kind:s,x:m[0],z:m[1],ang:s==="duet"?x+.12*Math.sin(c*2.1+t):x-e.side*.87,H:f||0,ph:C,T:B,big:e.big,juv:i?1:0,g:t})}),e.back.forEach(([a,o],s)=>{const l=e.d0+a,f=Q(l,e.side*(e.lat+2.3)),i=$(Math.round((l-e0)/g0),0,t0),c=Math.atan2(-f0[i],w0[i]);et.push({kind:o,x:f[0],z:f[1],ang:c+.4*Math.sin(s*1.7+t),H:0,ph:(.3+.41*s+.2*t)%1,g:t})})});const Le=12.6,Pa=12,Na=p/Le,Ct=Z(Pa)-1/Na,Eo=(1-Ct)*Na,Da=z==="dawn"||z==="evening",Q0=await Ms(n,{palette:Oe,count:Math.min(66,Math.round(62*V/2)*2),leavers:12,hour:w.hero,weather:w.weather||(q?"wind":"still"),season:j?"thaw":"winter",lineZ:g,exit:[y.x,y.y,y.z],camX0:Pa,leaveSeconds:Eo,roost:b?44:0,rate:1,extraPairs:et,extraGround:qo,extraDetail:.85,lineDist:s0,shadowLen:Da?3.4:z==="morning"?2.8:z==="moon"?2.2:.45,shadowK:Da?1:z==="morning"?.9:z==="moon"?.7:.5});u.add(Q0.object);const a0=Q0.shared;a0.uRose&&a0.uViolet&&(a0.uRose.value.copy(i0(w.stB[0])),a0.uViolet.value.copy(i0(w.stA[0]))),await n.yield();const Rt=a0.uSunDir.value,qa=e=>{const t=e*Math.PI/180,a=Math.cos(t);Rt.set(Math.cos(m0)*a,Math.sin(t),Math.sin(m0)*a)};qa(w.el>0?w.el:2),a0.uSunCol.value.copy(i0(w.sun[0],w.sun[1])).lerp(i0(F.gold,w.sun[1]*1.1),.6*F.k),a0.uSky.value.copy(i0(w.sky[0],w.sky[1])),a0.uGround.value.copy(i0(w.sky[0])).lerp(i0(Oe[2]),A?.1:.4).multiplyScalar(.5*w.sky[1]),a0.uRimCol.value.copy(a0.uSunCol.value).multiplyScalar(1-F.k).add(i0(F.gold,1.6*F.k));const Ho={uSunDir:a0.uSunDir,uSunCol:a0.uSunCol,uSky:a0.uSky,uGround:a0.uGround,uRimCol:a0.uRimCol},U0=w.dens*(q?.6:1),Pt=i0(w.stB[0],w.stB[1]),Go=Pt.clone().lerp(i0(Oe[3],w.stB[1]),z==="dawn"?.5:0),La=.32*p,tt=.664*p,Io=[Q(K0+24,ee(K0+24)-7),Q(M0[1].d,-28),Q(za+15,-34),Q(La,.5),Q(tt,-1)],at=[[14,7,4],[32,6,8],[18,6.5,14],[12.5,3.1,17],[11,3.1,15]],_o=[.05,.028,.05,.088,.088],ae={uStSun:a0.uSunDir,uStA:{value:i0(w.stA[0],w.stA[1])},uStB:{value:Pt.clone()},uStScat:{value:i0(w.sun[0],w.sun[1]*w.scat)},uStFar:{value:i0(w.far)},uStFarS:{value:i0(w.farS)},uStP:{value:new d.Vector4(.008*U0,q?1.5:2.5,.001,0)},uStBk:{value:Io.map((e,t)=>new d.Vector4(e[0],t>2?.2:t?1.4:2,e[1],Math.min(_o[t]*Math.max(U0,.6),.1)))},uStBr:{value:at.map(e=>new d.Vector3(1/e[0],1/(q?e[1]*.5:e[1]),1/e[2]))},uStGold:{value:i0(F.gold,.9*F.k)}},Nt={uZen:{value:i0(w.zen)},uHorS:{value:i0(w.horS)},uHorA:{value:i0(w.horA)},uBelt:{value:i0(w.belt)},uSlate:{value:i0(w.slate)},uSunC:{value:i0(w.sun[0],1.3)},uSkyK:{value:new d.Vector4(w.glow,w.stars,w.over,0)},uGold:{value:i0(F.gold)},uSunK:{value:new d.Vector4(F.k*F.disc,F.k,F.k,F.k)}},O0=(e,t,a,o={})=>new d.ShaderMaterial({vertexShader:e,fragmentShader:t,uniforms:{...Ho,...ae,uTime:a0.uTime,uPx:a0.uPx,...a},...o});u.fog=new d.FogExp2(i0(w.far).lerp(i0(w.farS),.4),.0024),Q0.object.traverse(e=>{e.material&&ya(e.material,ae)});const Dt=new d.DirectionalLight(i0(w.sun[0]),2.6*w.sun[1]);Dt.position.copy(Rt).multiplyScalar(200),u.add(Dt),u.add(new d.HemisphereLight(i0(w.sky[0]),i0(w.sky[0]).lerp(i0(Oe[2]),.4).multiplyScalar(.5),1.6*w.sky[1]));const qt={value:i0(w.deep[0],w.deep[1]).add(a0.uSky.value.clone().multiplyScalar(.018)).add(i0(w.zen).multiplyScalar(.055))},Lt=new d.Mesh(new d.SphereGeometry(1,28,14),new d.ShaderMaterial({vertexShader:Fs,fragmentShader:Ts,uniforms:{...ae,...Nt,uSunDir:a0.uSunDir,uDeep:qt,uSky:a0.uSky},side:d.BackSide,depthWrite:!1}));Lt.renderOrder=-1,Lt.frustumCulled=!1,u.add(Lt);const ot=O0(Cs,Rs,{uLand:{value:new d.Vector4(j?1:0,w.el>0&&!A?z==="moon"?.5:.8:0,A?.2:1,0)},uShadowC:{value:i0(Oe[4],.5)}});{const e=[-1.4,0,.3,.6,1,1.5,2.2,3.2,4.6,6.5,9,12,16,21,28,37,49,65,86,115,155,205,265,335,410,550,700,1e3],t=e.length,a=new Float32Array((t0+1)*t*2*3),o=[],s=[0,0];for(let h=0;h<2;h++)for(let m=0;m<=t0;m++){(m&31)===0&&await n.yield();const M=e0+m*g0,x=h?q0(M):ee(M);for(let B=0;B<t;B++){const C=h?x+e[B]:x-e[B],_=((h*(t0+1)+m)*t+B)*3;Q(M,C,s),a[_]=s[0],a[_+1]=xe(M,C),a[_+2]=s[1]}}await n.yield();for(let h=0;h<2;h++)for(let m=0;m<t0;m++)for(let M=0;M<t-1;M++){const x=(h*(t0+1)+m)*t+M,B=x+t,C=B+1,_=x+1;h?o.push(x,_,C,x,C,B):o.push(x,B,C,x,C,_)}await n.yield();const l=new Float32Array(a.length),f=t*3;for(let h=0;h<2;h++)for(let m=0;m<=t0;m++){(m&31)===0&&await n.yield();for(let M=0;M<t;M++){const x=((h*(t0+1)+m)*t+M)*3,B=x+(m<t0?f:0),C=x-(m>0?f:0),_=x+(M<t-1?3:0),U=x-(M>0?3:0),o0=a[B]-a[C],J=a[B+1]-a[C+1],n0=a[B+2]-a[C+2],B0=a[_]-a[U],k0=a[_+1]-a[U+1],p0=a[_+2]-a[U+2];let C0=J*p0-n0*k0,Z0=n0*B0-o0*p0,H0=o0*k0-J*B0;Z0<0&&(C0=-C0,Z0=-Z0,H0=-H0);const h0=Math.hypot(C0,Z0,H0)||1;l[x]=C0/h0,l[x+1]=Z0/h0,l[x+2]=H0/h0}}await n.yield();const i=new d.BufferGeometry;i.setAttribute("position",new d.BufferAttribute(a,3)),i.setAttribute("normal",new d.BufferAttribute(l,3)),i.setIndex(o),await n.yield();const c=new d.Mesh(i,ot);c.frustumCulled=!1,u.add(c)}await n.yield();for(const e of[F0,...Ne,...M0,...te]){const a=[0,.28,.52,.72,.88,1,1.12,1.3],o=[],s=[];for(const f of a)for(let i=0;i<26;i++){const c=i/26*6.283,h=f*(1+.08*v0(Math.cos(c)*2+e.c[0],Math.sin(c)*2+4)),m=Math.cos(c)*e.HL*h,M=Math.sin(c)*e.HW*h,x=e.W(m,M);o.push(x[0],e.Y(m,M),x[1])}for(let f=0;f<a.length-1;f++)for(let i=0;i<26;i++){const c=f*26+i,h=f*26+(i+1)%26;s.push(c,h+26,c+26,c,h,h+26)}const l=new d.BufferGeometry;l.setAttribute("position",new d.Float32BufferAttribute(o,3)),l.setIndex(s),l.computeVertexNormals(),Ro(l),u.add(new d.Mesh(l,ot)),await n.yield()}await n.yield();{const t=[[1e3,0],[1380,.5],[1560,1],[1800,.55],[2100,0]],a=[],o=[],s=t.length,l=Math.atan2(-1410,380);for(let c=0;c<=120;c++){const h=c/120*6.2832,m=Math.cos(h),M=Math.sin(h),x=Math.abs(Math.atan2(Math.sin(h-l),Math.cos(h-l))),B=(150+75*v0(m*2.2,M*2.2+40)+34*v0(m*7,M*7+9))*(1-(1-Wa)*(1-H(.42,.78,x)));for(const[C,_]of t)a.push(-150+m*C,_>0?B*_:2,20+M*C)}for(let c=0;c<120;c++)for(let h=0;h<s-1;h++){const m=c*s+h,M=m+s;o.push(m,m+1,M+1,m,M+1,M)}const f=new d.BufferGeometry;f.setAttribute("position",new d.Float32BufferAttribute(a,3)),f.setIndex(o),f.computeVertexNormals(),Ro(f);const i=new d.Mesh(f,ot);i.frustumCulled=!1,u.add(i)}await n.yield();const Vt={...Nt,uIslet:{value:[F0,...Ne,...M0,...te].map(e=>new d.Vector4(e.c[0],e.c[1],e.HL*.98,e.HW*.98))},uIsletDir:{value:[F0,...Ne,...M0,...te].map(e=>new d.Vector2(e.tx,e.tz))},uRif:{value:Array.from({length:bt},(e,t)=>{const a=Ft[t]||[-999,0,1,1];return new d.Vector4(a[0],a[1],a[2],a[3])})},uWat:{value:new d.Vector4(j?0:1,j?.35:1,z==="moon"?1.6:A?.3:1,1)},uDeep:qt,uSkin:{value:new d.Vector4(.075*$(U0,.45,1.15),0,0,0)},uIce:{value:new d.Vector4(F.k*.8,F.k,0,0)},uGal:{value:null},uGalR:{value:new d.Vector2(e0,1/(W0-e0))},uBar:{value:new d.Vector4(48,7.5,0,0)},uFrostL:{value:a0.uSunCol.value.clone().multiplyScalar(.34).add(a0.uSky.value.clone().multiplyScalar(.5))},uFrostR:{value:a0.uSunCol.value.clone().multiplyScalar(.62).add(a0.uSky.value.clone().multiplyScalar(.42))}};{const t=new Float32Array((t0+1)*15*3),a=new Float32Array((t0+1)*15*4),o=new Float32Array((t0+1)*15*2),s=[],l=[0,0];for(let c=0;c<=t0;c++){(c&63)===0&&await n.yield();const h=e0+c*g0,m=ee(h),M=q0(h);for(let x=0;x<15;x++){const B=I(m-1.6,M+1.6,x/14),C=c*15+x;Q(h,B,l),t[C*3]=l[0],t[C*3+1]=0,t[C*3+2]=l[1],a[C*4]=h,a[C*4+1]=B,a[C*4+2]=B-m,a[C*4+3]=M-B,o[C*2]=w0[c],o[C*2+1]=-f0[c]}}for(let c=0;c<t0;c++)for(let h=0;h<14;h++){const m=c*15+h,M=m+15;s.push(m,m+1,M+1,m,M+1,M)}const f=new d.BufferGeometry;f.setAttribute("position",new d.BufferAttribute(t,3)),f.setAttribute("aF",new d.BufferAttribute(a,4)),f.setAttribute("aT",new d.BufferAttribute(o,2)),f.setIndex(s);const i=new d.Mesh(f,O0(Ps,Ns,Vt));i.frustumCulled=!1,u.add(i)}await n.yield();const Va={value:new d.Vector4(0,-500,0,1)},Me=O0(Ds,qs,{uWind:{value:q?3:1},uFrost:{value:j?.62:1},uAld:Va,uWarm:{value:F.k}},{side:d.DoubleSide}),x0=r.fork("trees"),ve=[],Ea=(e,t,a,o)=>{const s=Ye();e(s,x0,t,a,o);const l=s.build();return l.userData.h=t,l.userData.reach=(e===Xe?.65:.36)*t,ve.push(l),l},st=[],Et=[];for(const[e,t,a]of[[Xe,11],[Xe,13,{per:2}],[Mt,9],[Mt,11.5],[To,7]])st.push(Ea(e,t,1,a)),await n.yield();for(const[e,t]of[[Xe,12],[Mt,10],[Mt,12]])Et.push(Ea(e,t,0)),await n.yield();const Ko=new d.Matrix4,Ha=new d.Quaternion,Ga=new d.Vector3,Ia=new d.Vector3,jo=new d.Vector3(0,1,0),Ve=(e,t,a,o)=>{const s=e0,l=W0-e0;for(let f=0;f<o;f++)e.forEach((i,c)=>{const h=t.filter(x=>x.v===c&&$(Math.floor((x.d-s)/l*o),0,o-1)===f);if(!h.length)return;const m=new d.InstancedMesh(i,a,h.length);h.forEach((x,B)=>{Ha.setFromAxisAngle(jo,x.yaw),Ga.set(x.sx??x.sc,x.sy??x.sc,x.sx??x.sc),Ia.set(x.x,x.y,x.z),m.setMatrixAt(B,Ko.compose(Ia,Ha,Ga))}),m.instanceMatrix.needsUpdate=!0,m.computeBoundingSphere(),m.boundingSphere.radius+=8,u.add(m);const M=ve.indexOf(i);M>=0&&ve.splice(M,1)})},nt=e=>e-L(0),T=[0,0],pe=[],Ht=[],_a=[],Ka=[],Qo=(e,t,a)=>_a.every(o=>(o[0]-e)**2+(o[1]-t)**2>(a+o[2])**2),Gt=(e,t,a,o,s,l,f,i)=>{const c=6.5+t[l].userData.reach*f;for(let h=0;h<3;h++,s+=3.5){const m=o>0?q0(a)+s:ee(a)-s;if(Q(a,m,T),!(W.nearestXZ(T[0],T[1]).dist<c||!Qo(T[0],T[1],i)))return _a.push([T[0],T[1],i]),e.push({v:l,d:a,x:T[0],y:xe(a,m)-.15,z:T[1],yaw:x0.range(0,6.28),sc:f,sd:o,t:s,h:t[l].userData.h*f,reach:t[l].userData.reach*f}),!0}return!1};for(let e=-1;e<=1;e+=2)for(let t=-70;t<p+120;t+=16.5){await n.yield();const a=t+x0.range(-5,5),o=nt(a),s=e<0&&o>-66&&o<66;let l=s?x0.range(13.5,20):1.6+Math.abs(x0.gauss())*3.5;o>28&&!s&&(l+=5);const f=x0(),i=f<.34?0:f<.56?1:f<.76?2:f<.94?3:4,c=a>-25&&a<80?e<0?a<46?0:3:a<52?1:0:i;if(Gt(pe,st,a,e,l,c,x0.range(.82,1.18),3.2)&&e<0&&!s&&c<2){const h=pe[pe.length-1];h.v=-1,Ka.push(h)}}for(let e=0;e<9;e++)Gt(pe,st,L(-60+e*15+x0.range(-4,4)),-1,x0.range(12.5,24),x0.int(0,3),x0.range(.9,1.25),2.8);const Uo=Math.round(150*(.6+.4*P));for(let e=0,t=0;e<Uo&&t<4e3;t++){(t&15)===0&&await n.yield();const a=x0.sign(),o=x0.range(e0+30,W0-20),s=x0()<.22;let l=s?x0.range(80,420):7+Math.pow(x0(),1.5)*68;a<0&&Math.abs(nt(o))<70&&(l+=16),!(s&&v0(o*.01,l*.01*a+30)<.1)&&Gt(Ht,Et,o,a,l,x0.int(0,2),x0.range(.8,1.35),2.2)&&e++}await n.yield(),Ve(st,pe,Me,5),await n.yield(),Ve(Et,Ht,Me,4),await n.yield();{const e=n.core.makeRng(n.core.hashSeed(n.seed+":lean")),t=[];for(const a of Ka){await n.yield();const o=$(Math.floor((a.d-e0)/(W0-e0)*5),0,4),s=t[o]||(t[o]=Ye()),l=$(Math.round((a.d-e0)/g0),0,t0),f=e.range(.25,.6),i=Math.atan2(f0[l],w0[l])+e.range(-.45,.45),c=W.nearestXZ(a.x,a.z).dist;Xe({add:(m,M,...x)=>{const B=M>.02?6.4:6.1,C=[];for(const _ of m){const U=[a.x+_[0],a.y+_[1],a.z+_[2]];if(C.length&&c-Math.hypot(_[0],_[2])<B+.3&&W.distanceTo(U[0],U[1],U[2])<B)break;C.push(U)}C.length>1&&s.add(C,M,...x)}},e,a.h,1,{leanAz:i,lean:f})}for(const a of t)a&&(await n.yield(),u.add(new d.Mesh(a.build(),Me)))}await n.yield();{const t=new Uint8Array(16384),a=[new Float32Array(1024),new Float32Array(1024)],o=[new Float32Array(1024),new Float32Array(1024)],s=(W0-e0)/1024;for(const f of[...pe,...Ht]){if(f.t>34)continue;const i=f.sd>0?1:0,c=Math.max(f.reach,2.2),h=(f.d-e0)/s,m=Math.ceil(c/s),M=1-.5*H(8,34,f.t),x=.35+.65*x0();for(let B=-m;B<=m;B++){const C=Math.round(h)+B;if(C<0||C>=1024)continue;const _=B*s/c,U=f.h*M*Math.pow(Math.max(1-_*_,0),.9);U>a[i][C]&&(a[i][C]=U,o[i][C]=x)}}for(let f=0;f<2;f++)for(let i=0;i<2;i++)for(let c=0;c<1024;c++){const h=((f*2+i)*1024+c)*4;t[h]=Math.round($(a[f][c]/22,0,1)*255),t[h+1]=Math.round(o[f][c]*255),t[h+3]=255}const l=new d.DataTexture(t,1024,4,d.RGBAFormat,d.UnsignedByteType);l.magFilter=l.minFilter=d.LinearFilter,l.wrapS=l.wrapT=d.ClampToEdgeWrapping,l.generateMipmaps=!1,l.needsUpdate=!0,Vt.uGal.value=l}await n.yield();const me=Ye(),y0=r.fork("special"),ja=(e,t,a,o=0)=>{const s=Math.cos(o),l=Math.sin(o);return{add:(f,...i)=>me.add(f.map(c=>[e+c[0]*s+c[2]*l,t+c[1],a-c[0]*l+c[2]*s]),...i)}},Ee=Ca(0,0),It=[];await n.yield();const _t=Math.atan2(Fa*.55-Ta*.45,Ta*.55+Fa*.45),Kt=.28;Va.value.set(j0[0]+Math.sin(_t)*Kt*9.5,Ee+11.5,j0[1]+Math.cos(_t)*Kt*9.5,10.5),await Us(ja(j0[0],Ee,j0[1]),r.fork("alder"),19,{leanAz:_t,lean:Kt,curve:-.2,thick:1.5,fall:It,yield:n.yield,ok:e=>W.distanceTo(j0[0]+e[0],Ee+e[1],j0[1]+e[2])>8.2,clear:e=>W.distanceTo(j0[0]+e[0],Ee+e[1],j0[1]+e[2])>6.2}),await n.yield();const ze=.562*p+4.7,Qa=10,Y0=Q(ze,Qa),Se=$(Math.round((ze-e0)/g0),0,t0),jt=To(ja(Y0[0],0,Y0[1]),y0,7.2,2,{bough:[-f0[Se]*.9-w0[Se]*.3,-w0[Se]*.9+f0[Se]*.3]}),X0=new d.Vector3(Y0[0]+jt[0],jt[1],Y0[1]+jt[2]);for(const e of[-1,1]){await n.yield();const t=Wt,a=g+e*9.7,o=9.6,s=[[t,-.4,g+e*9.9],[t+.15,2.4,g+e*9.75],[t,5,g+e*9.65]];for(let i=0;i<=9;i++){const c=i/9*(Math.PI/2+.2),h=o+.3*v0(i*.7,e*3);s.push([t+e*.25+.4*v0(i*.5,e*5),y.y+h*Math.sin(c),g+e*h*Math.cos(c)])}me.add(s,.66,.26,.03,.6,0,0,e,0);const l=(i,c,h)=>{const m=Math.abs(i[2]-g),M=m<7.7?y.y+Math.sqrt(7.7*7.7-m*m)+.2:.8;for(let x=0;x<c;x++)xa(me,y0,[i[0]+y0.range(-.3,.3),i[1],i[2]+y0.range(-.3,.3)],y0.range(2,5.5),[0,e],h+x+e,.03,M)};for(let i=0;i<16;i++){const c=s[y0.int(3,11)],h=y0.range(-1.1,1.1),m=$(e*(c[2]-g)/o,0,1),M=$((c[1]-y.y)/o,0,1),x=A0(y0,c,[Math.sin(h)*.8,M*.8+y0.range(.1,.5),e*(m*.8+.25)],y0.range(4,8),6,y0.range(1,1.6),.07);me.add(x,.12,.02,.03,.85,0,.12,i+e,0);for(let B=1;B<x.length;B++)l(x[B],4,i)}const f=A0(y0,[t-.7,-.4,a+e*.7],[.3,1,e*.5],10.5,6,.5,.04);me.add(f,.4,.08,.03,.6,0,.05,e*2,0);for(let i=0;i<7;i++){const c=f[y0.int(2,6)],h=y0.range(-1.4,1.4),m=A0(y0,c,[Math.sin(h),y0.range(.2,.8),e*(.2+.8*Math.cos(h))],y0.range(3,5.5),5,y0.range(1,1.6),.07);me.add(m,.07,.015,.03,.85,0,.14,i+e*3,0);for(let M=1;M<m.length;M++)l(m[M],3,i+20)}for(let i=0;i<44;i++){const c=y0.int(3,11),h=s[c],m=s[c+1],M=y0();l([I(h[0],m[0],M),I(h[1],m[1],M),I(h[2],m[2],M)],1,i)}}await n.yield();{const e=new d.Mesh(me.build(),Me);e.frustumCulled=!1,u.add(e)}await n.yield();const Y=r.fork("reeds"),Oo=[0,1,2].map(()=>{const e=Ye();Os(e,Y,7);const t=e.build();return ve.push(t),t}),ie=[],le=[],Yo=Math.round(340*(.5+.5*P)*V);for(let e=0,t=0;e<Yo&&t<6e3;t++){(t&31)===0&&await n.yield();const a=Y.sign(),o=Y.range(-60,p+30),s=nt(o);if(v0(o*.035,a*17)<-.25&&Y()<.85||a<0&&s>-64&&s<64)continue;const l=Y.range(-2.2,1.6),f=a>0?q0(o)+l:ee(o)-l;Q(o,f,T),!(W.nearestXZ(T[0],T[1]).dist<6.6)&&(ie.push({v:Y.int(0,2),d:o,x:T[0],y:Math.max(xe(o,f),0),z:T[1],yaw:Y.range(0,6.28),sc:Y.range(.8,1.2)}),e++)}const Qt=(e,t,a)=>{const o=e.s>0?1:-1;let s=e.W(t,a);for(let l=0;l<16&&W.nearestXZ(s[0],s[1]).dist<7;l++)a+=o*.25,s=e.W(t,a);return[s,a]};for(let e=0;e<16;e++){const t=Y.range(-ue*.8,ue*.8),[a,o]=Qt(F0,t,Y.range(-Ze*.7,Ze*.7));ie.push({v:e%3,d:K0,x:a[0],y:Math.max(Ca(t,o),0),z:a[1],yaw:Y.range(0,6.28),sc:Y.range(.8,1.15)})}for(let e=0;e<26;e++){const t=Y.range(-10,70),a=Y.sign(),o=a*Y.range(6.8,9.5);Q(t,o,T),ie.push({v:e%3,d:t,x:T[0],y:0,z:T[1],yaw:Y.range(0,6.28),sc:Y.range(.75,1.1)})}for(let e=0;e<7;e++)ie.push({v:e%3,d:ze,x:Y0[0]+Y.range(-1.2,1.2),y:0,z:Y0[1]+Y.range(.2,1.6),yaw:Y.range(0,6.28),sc:Y.range(.7,1)});for(const e of Ne)for(let t=0;t<9;t++){const a=Y.range(-e.HL*.8,e.HL*.8),o=Y.range(-e.HW*.6,e.HW*.6),s=e.W(a,o);ie.push({v:t%3,d:p,x:s[0],y:Math.max(e.Y(a,o),0),z:s[1],yaw:Y.range(0,6.28),sc:Y.range(.7,1.05)})}const b0=n.core.makeRng(n.core.hashSeed(n.seed+":shoals"));for(const e of M0){const t=e.s>0?1:-1;for(let a=0;a<9;a++){const o=e.HL*(a<5?b0.range(.82,.96):-b0.range(.86,.96)),[s,l]=Qt(e,o,t*b0.range(.1,.5)*e.HW*.4);ie.push({v:a%3,d:e.d,x:s[0],y:Math.max(e.Y(o,l),0),z:s[1],yaw:b0.range(0,6.28),sc:b0.range(.6,.85)})}for(let a=0,o=Math.round(14*e.HL/15);a<o;a++){const s=a%3!==2,l=b0.range(-.92,.92)*e.HL,f=(s?t:-t)*e.HW*Math.sqrt(Math.max(1-(l/e.HL)**2,0))*b0.range(.86,1),i=e.W(l,f);le.push({v:0,d:e.d,x:i[0],y:-.02,z:i[1],yaw:0,sx:s?b0.range(.22,.38):b0.range(.14,.22),sy:s?b0.range(.22,.36):b0.range(.14,.2)})}}for(const e of te){for(let t=0;t<4;t++){const a=b0.range(-.7,.7)*e.HL,[o,s]=Qt(e,a,b0.range(-.4,.4)*e.HW);ie.push({v:t%3,d:e.d,x:o[0],y:Math.max(e.Y(a,s),0),z:o[1],yaw:b0.range(0,6.28),sc:b0.range(.55,.85)})}for(let t=0;t<7;t++){const a=b0.range(0,6.28),o=b0.range(.55,.98),s=e.W(Math.cos(a)*e.HL*o,Math.sin(a)*e.HW*o);le.push({v:0,d:e.d,x:s[0],y:Math.max(e.Y(Math.cos(a)*e.HL*o,Math.sin(a)*e.HW*o),0)-.04,z:s[1],yaw:0,sx:b0.range(.2,.38),sy:b0.range(.2,.36)})}}await n.yield(),Ve(Oo,ie,Me,5),await n.yield();const Xo=Math.round(180*(.5+.5*P));for(let e=0;e<Xo;e++){const t=Y.sign(),a=Y.range(-60,p+30),o=Y.range(-1.3,.5),s=t>0?q0(a)+o:ee(a)-o;if(Q(a,s,T),t<0&&Math.abs(nt(a))<62)continue;const l=Y.range(.2,.4);le.push({v:0,d:a,x:T[0],y:Math.max(xe(a,s),0)-.03,z:T[1],yaw:Y.range(0,6.28),sx:l,sy:Y.range(.26,.44)})}for(let e=0;e<10;e++){const t=Y.range(0,6.28),a=At(Math.cos(t)*ue*.9,Math.sin(t)*Ze*.9);le.push({v:0,d:K0,x:a[0],y:0,z:a[1],yaw:0,sx:Y.range(.2,.36),sy:Y.range(.2,.34)})}for(let e=0;e<5;e++)le.push({v:0,d:ze,x:Y0[0]+Y.range(-.9,.9),y:-.05,z:Y0[1]+Y.range(-.9,.9),yaw:0,sx:Y.range(.35,.7),sy:Y.range(.25,.4)});for(const e of Ne)for(let t=0;t<9;t++){const a=Y.range(0,6.28),o=e.W(Math.cos(a)*e.HL*.92,Math.sin(a)*e.HW*.92);le.push({v:0,d:p,x:o[0],y:0,z:o[1],yaw:0,sx:Y.range(.2,.36),sy:Y.range(.2,.34)})}await n.yield();{const e=sn(n.core.makeRng(n.core.hashSeed(n.seed+":tussock")));ve.push(e),Ve([e],le,ot,3),await n.yield();const t=Ye();nn(t,Y,n.core.makeRng(n.core.hashSeed(n.seed+":tussock-hem")));const a=t.build();ve.push(a),Ve([a],le,Me,3)}await n.yield();const Ut=[],Ot=(e,t,a,o)=>Math.atan2(a-e,o-t),Ua=At(-ue-1.3,1.5),Oa=W.pointAt(.02);for(const[e,t,a]of[[0,0,-.45],[1,.25,.45],[2,1.5,1.2]]){const o=At(-ue-1.3+t,1.5+a);Ut.push({rd:K0,x:o[0],y:-.06,z:o[1],heading:Ot(o[0],o[1],Oa.x,Oa.z)+(e<2?Math.PI/2:.4),type:e<2?2:0,phase:.1,period:6.5,scale:e===2?.9:e?1.03:.97,c:e<2?[0,0,e,0]:[1,0,0,2]})}const Yt=[[],[],[],[]],$0={n:0,d0:1e9,d1:-1e9,s:0};{const e=r.fork("roost"),t=[...te,ne],a=new Set,o=[F0,...M0,...te],s=[],l=(h,m)=>{let M=-.06;for(const x of o){const B=h-x.c[0],C=m-x.c[1],_=B*x.tx+C*x.tz,U=-B*x.tz+C*x.tx;Math.abs(_)<x.HL*1.3&&Math.abs(U)<x.HW*1.3&&(M=Math.max(M,x.Y(_,U)))}return M},f=.02*p+14,i=.02*p+15+6*4.4+5,c=[0,0];for(let h=e.range(20,30);h<300;h+=e.range(35,45)){let m=e.sign(),M=e.range(5,9),x=h,B=2.6,C=3.2,_=e.int(3,6);const U=e.chance(.45),o0=e.chance(.35),J=e(),n0=e.range(0,6.28),B0=e.range(-.3,.3),k0=[],p0=t.find(l0=>!a.has(l0)&&Math.abs(h-l0.d)<l0.HL+12);p0?(a.add(p0),m=p0.s>0?1:-1,x=p0.d+B0*p0.HL,B=Math.min(p0.HL-1.2,1.2*_),M=Math.max(5,Math.abs(p0.s)-.75*p0.HW),C=Math.min(3.2,Math.abs(p0.s)+.8*p0.HW-M)):[F0,M0[0],M0[1],M0[2],...t].some(l0=>l0.s*m>0&&Math.abs(h-l0.d)<l0.HL+6)&&(m=-m),x>f&&x<i&&(M=Math.max(M,6.6)),p0||Ft.push([x,m*(M+1.3),4.6,2.5]);const C0=Yt[Math.min(3,Math.floor(x/75))];let Z0=o0&&_>3,H0=null,h0=0;for(let l0=0;k0.length<_&&l0<120;l0++){const S0=k0.length,ge=Z0&&S0<2;let Ce=e.range(-B,B),Qe=e.range(.3,C);const So=e(),ws=e.range(0,6.28),ys=e(),xs=e.range(6,10),bs=e.range(.95,1.04),wa=e.chance(.5)?1:0;if(S0||(Qe=0),Q(x+Ce,m*(M+Qe),c),ge&&S0){Q(x+k0[0][0],m*(M+k0[0][1]),c);const he=Math.cos(n0)*.62,xt=-Math.sin(n0)*.62,Ao=(W.nearestXZ(c[0]+he,c[1]+xt).dist<5?-1:1)*(h0?-1:1);c[0]+=Ao*he,c[1]+=Ao*xt;const Wo=ye(c[0],c[1]);Ce=Wo[0]-x,Qe=m*Wo[1]-M}else if(!k0.every(he=>Math.hypot(he[0]-Ce,he[1]-Qe)>.78))continue;if(!s.every((he,xt)=>ge&&S0&&xt===s.length-1||Math.hypot(he[0]-c[0],he[1]-c[1])>.9)||Math.hypot(c[0]-re[0],c[1]-re[1])<1.6||ge&&S0&&h0&&W.nearestXZ(c[0],c[1]).dist<5){ge&&S0&&++h0>1&&(Z0=!1,H0.type=0,H0.c=[0,0,0,0]);continue}k0.push([Ce,Qe]),s.push([c[0],c[1]]),p0===ne&&($0.n++,$0.d0=Math.min($0.d0,x+Ce),$0.d1=Math.max($0.d1,x+Ce),$0.s=m*(M+1));const T0={x:c[0],y:l(c[0],c[1]),z:c[1],heading:ws,type:0,phase:ys,period:xs,scale:bs,c:[wa,0,S0%2,0]};ge?(T0.type=2,T0.heading=n0,T0.phase=J,T0.period=6.4,T0.scale=S0?.97:1.03,T0.c=[0,0,S0?0:1,0],S0||(H0=T0)):U&&S0===_-1?(T0.scale=.9,T0.c=[0,0,0,2]):So<w.sleep+.25?(T0.type=5,T0.c=[0,wa,0,0]):So<w.sleep+.5&&(T0.type=4,T0.c=[1,wa,0,0]),C0.push(T0)}}Ft.forEach((h,m)=>{m<bt&&Vt.uRif.value[m].set(h[0],h[1],h[2],h[3])})}const Ae=$0.n?{from:(ne.d-ne.HL-24)/p,to:(ne.d+ne.HL)/p}:null,z0=n.core.makeRng(n.core.hashSeed(n.seed+":waders")),Xt=[];for(const[e,t,a,o]of[[21,-62,46,1],[11,-93,-61,-1]]){const s=[];for(let l=0;s.length<e&&l<400;l++){const f=I(t,a,(s.length+z0())/e),i=o>0?z0()<.67?z0.range(5.1,7.4):z0.range(7.9,9.6):z0.range(5.1,7.2),c=z0(),h=z0.range(0,6.28),m=z0(),M=z0.range(6,10),x=z0.range(.98,1.06),B=z0.chance(.5)?1:0;if(!s.every(U=>Math.hypot(U[0]-f,U[1]-i)>1.25))continue;const C=c>.8&&s.length<e-1&&i+.15<(o>0?9.6:7.2),_=C?2:c<.4?0:c<.62?4:5;Q(L(f),o*i,T);for(let U=0;U<(C?2:1);U++){let o0=T[0],J=T[1],n0=f,B0=i;if(U){const k0=Math.cos(h)*.62,p0=-Math.sin(h)*.62,C0=W.nearestXZ(o0+k0,J+p0).dist<5?-1:1;o0+=C0*k0,J+=C0*p0,n0+=C0*k0,B0+=o*C0*p0}s.push([n0,B0]),Xt.push({x:o0,y:-.2,z:J,heading:h,type:_,phase:m,period:C?6.4:M,scale:C?U?.97:1.03:x,c:_===0?[1,0,0,0]:C?[0,0,1-U,0]:[0,B,0,0]})}}}await n.yield();let $t=null;const He=new d.Vector3,Ya=[],Xa=(e,t)=>{const a=[1e9,-1e9,1e9,-1e9];for(const o of e)a[0]=Math.min(a[0],o.x-t),a[1]=Math.max(a[1],o.x+t),a[2]=Math.min(a[2],o.z-t),a[3]=Math.max(a[3],o.z+t);return a},Zt=e=>Math.hypot(Math.max(e[0]-He.x,0,He.x-e[1]),Math.max(e[2]-He.z,0,He.z-e[3]));for(const[e,t,a]of[[Ut,.66,150],...Yt.map(o=>[o,.85,150]),[Xt,.85,150]]){if(!e.length)continue;await n.yield();const o=Bo(n,e,{shared:a0,detail:t}).object,s=Xa(e,2);u.add(o),Ya.push([o,s,a]),o.geometry.boundingSphere=new d.Sphere(new d.Vector3((s[0]+s[1])/2,1,(s[2]+s[3])/2),Math.hypot(s[1]-s[0],s[3]-s[2])/2+3),o.frustumCulled=!0}const $o=[-62,62,-12,g+12],Zo=[0,1,2].map(e=>Xa(et.filter(t=>t.g===e),2.5)),$a=[...Ut,...Xt,...Yt.flat()];{const e=Ss($a,a0,z0);ya(e.material,ae),u.add(e)}await n.yield();const rt=[],Ge=[];for(const e of $a)if(e.y<.02)for(let t=0;t<2;t++)rt.push(e.x+z0.range(-.12,.12),e.z+z0.range(-.12,.12),z0(),z0.range(.9,1.35)*(t?.6:1)),Ge.push(-1,2);const Jt=[new d.Vector4,new d.Vector4],ea=[new d.Vector4(0,0,.9,0),new d.Vector4(0,0,1.5,0)];{const e=new d.Mesh(an(),O0(tn,Co,{uCrA:{value:Jt},uCrB:{value:ea}},{side:d.DoubleSide}));e.frustumCulled=!1,u.add(e)}rt.push(ke[0]*.45+re[0]*.55,ke[1]*.45+re[1]*.55,.37,.8),Ge.push(-1,2);const Za=n.core.makeRng(n.core.hashSeed(n.seed+":fox")),Jo=Za.range(K0,$e),it=150,es=Za()*it,ts=(e,t)=>{const a=(t*3.2+es)%it,o=1-H(0,9,a)*(1-H(it-9,it,a)),s=Jo+a,l=q0(s)+1.7+7*o;Q(s,l,T),Jt[0].set(T[0],xe(s,l)-.03,T[1],lt(s)-Math.atan2(q0(s+1.5)-q0(s-1.5),3)),ea[0].set(s*9,.03*Math.sin(s*18),.9*(1-H(.7,1,o)),.012*Math.abs(Math.sin(s*9)));const f=(t/8+.1)%1,i=H(.56,.62,f)*(1-H(.9,.95,f)),c=Math.max(Math.sin(t*8.8),0)*(1-H(.5,.56,f));Jt[1].set(I(re[0],ke[0],.45*i),Lo-.16*i,I(re[1],ke[1],.45*i),Vo),ea[1].set(0,-.25*c-1*i,1.5*(1-H(.6,.66,f)*(1-H(.9,.94,f))),-.012*c)},P0=n.core.makeRng(n.core.hashSeed(n.seed+":flyers")),Ja={...a0,uTau:{value:0}},eo={...a0,uTau:{value:0}},ta=(e,t,a,o,s,l,f,i)=>{for(const[c,h,m]of[[0,0,0],[2.6,1.7,.5],[5,-1.6,-.3]])e.push({x:t-Math.sin(s)*c+Math.cos(s)*h,y:a+m,z:o-Math.cos(s)*c-Math.sin(s)*h,heading:s,type:7,phase:P0(),period:4,scale:P0.range(.96,1.04),c:[l,f,i,P0.chance(.4)?1:0]})},to=[],L0=[];{const e=Q(34,0),t=Math.atan2(w0[$(Math.round((34-e0)/g0),0,t0)],-f0[$(Math.round((34-e0)/g0),0,t0)])+.62,a=280;for(let o=0;o<7;o++)ta(to,e[0]-Math.sin(t)*a*.5+(o%3-1)*1.5,4.3+.5*(o%2),e[1]-Math.cos(t)*a*.5,t,21+40*o,a,1.9)}const ce=(e,t,a,o,s,l,f,i,c,h,m=G0*Le)=>{const M=Q(a,o),x=lt(a)+f,B=Math.sin(x),C=Math.cos(x),_=s-h*Math.sin(Math.PI*c),U=M[0]-B*c*i,o0=M[1]-C*c*i,J=((c*i-l*m)%i+i)%i;for(let n0=0;n0<t;n0++){const B0=n0*2.7+(n0?P0.range(-.4,.4):0),k0=(n0%2?1:-1)*Math.ceil(n0/2)*1.5;e.push({x:U+C*k0,y:_+P0.range(-.3,.3)-.12*n0,z:o0-B*k0,heading:x,type:7,phase:P0(),period:4,scale:P0.range(.96,1.04),c:[(J-B0+i)%i,i,h,P0.chance(.4)?1:0]})}},lt=e=>{const t=$((e-e0)/g0,0,t0-.001),a=Math.floor(t);return Math.atan2(w0[a],-f0[a])};z==="evening"&&(ce(L0,6,.4*p+22,-5,9.5,.4,.05,340,.5,2.5),ce(L0,5,.4*p+28,6.5,12,.4,-.04,360,.45,2),ce(L0,7,.4*p+31,-1.5,14.5,.4,.02,380,.55,3),ce(L0,5,.12*p+26,3,11,.12,.03,320,.5,2),ce(L0,6,.7*p+34,-9,10.5,.7,-.12,300,.6,-2.5),ce(L0,5,.93*p+30,4,15,.93,0,330,.5,2)),ce(L0,5,.43*p+15,-2,3.7,.43,.36,260,.5,.8);const aa=2.3,as=1.25,os=.47;let ct=0;{const e=L0.slice(-5);for(const t of e){const a=Math.sin(t.heading),o=Math.cos(t.heading),s=t.c[1],l=t.c[2],f=as*t.scale,i=c=>{const h=c*3,m=O[h]-t.x,M=O[h+2]-t.z,x=m*a+M*o,B=Math.abs(m*o-M*a);if(x<-1.2||x>s+1.2)return[B,-1e9];const C=$(x,0,s),_=H(0,30,C)*(1-H(s-30,s,C)),U=Math.max(B-f,0),o0=t.y+l*Math.sin(Math.PI*C/s)-.012+os*t.scale*_-O[h+1];return[B,U<aa?Math.sqrt(aa*aa-U*U)-o0:-1e9]};for(let c=0;c<=r0;c+=8)if(i(c)[0]<12)for(let h=Math.max(c-8,0);h<=Math.min(c+8,r0);h++)ct=Math.max(ct,i(h)[1])}for(const t of e)t.y+=ct}const ao={...a0,uTau:{value:0}},oo=640,so=[];ce(so,3,.75*p+13.5,.8,2.3,.75,0,600,.31,0,oo);const Ie=tt+33,oa=tt-12,sa=oo/p,ss=e=>{if(e>=Ie)return e*sa;const t=$((e-oa)/(Ie-oa),0,1);return Ie*sa-.5*(Ie-e)-(sa-.5)*(Ie-oa)*(.5-t*t*t+.5*t*t*t*t)};{const e=Q(72,-4),t=Q(372,4),a=Ot(e[0],e[1],t[0],t[1]);ta(L0,e[0],8.2,e[1],a,0,300,1.5);const o=.595*p+24,s=Q(o-80,-305),l=Q(o,0),f=Ot(s[0],s[1],l[0],l[1]);ta(L0,s[0],15.5,s[1],f,0,560,-6.5)}const no={...a0,uTau:{value:0}},_e=.74,na=1.02,ro=[];if(b){const e=(na-_e)*G0*Le,t=(a,o,s,l,f,i)=>{const c=y.x-(1-a)*p+o,h=(a-_e)/(na-_e),m=Math.PI/2-f,M=Math.sin(m),x=Math.cos(m),B=9.5,C=s-B*Math.sin(Math.PI*h),_=c-M*h*e,U=g+l-x*h*e,o0=(-_e*G0*Le%e+e)%e;for(let J=0;J<i;J++){const n0=13-J*2.6,B0=(J%2?1:-1)*Math.ceil(J/2)*1.6;ro.push({x:_+x*B0,y:C+P0.range(-.5,.5),z:U-M*B0,heading:m,type:7,phase:P0(),period:4,scale:P0.range(.96,1.04),c:[(o0+n0)%e,e,B,P0.chance(.4)?1:0]})}};t(.84,15,5.4,-2,1.05,5),t(.84,22,8,3,1.2,4),t(.88,13,9,-1,.95,5)}for(const[e,t,a]of[[to,Ja,.5],[L0,eo,.66],[so,ao,.66],[ro,no,.62]])e.length&&(await n.yield(),u.add(Bo(n,e,{shared:t,detail:a}).object));await n.yield();const io=(e,t)=>{const a=Ys(e);a.instanceCount=t;const o=R0(a,"iP",new Float32Array(t*4),4),s=R0(a,"iQ",new Float32Array(t*4),4),l=R0(a,"iS",new Float32Array(t*4),4);for(const i of[o,s,l])i.setUsage(d.DynamicDrawUsage);const f=new d.Mesh(a,O0(Ls,Vs,{uBd:{value:new d.Vector4(e.nl,e.br,.36*e.bl,(e.neckY??.3)*e.br)},uBe:{value:new d.Vector4(e.bl,.4*e.br,.1*e.bl,e.twist??0)},uFinger:{value:e.finger},uWingP:{value:new d.Vector4(...e.wingP)},uSwanL:{value:new d.Vector4(1.35,1.15,.86,.4)}},{side:d.DoubleSide}));return f.frustumCulled=!1,u.add(f),{set(i,c,h,m,M,x,B,C,_,U,o0,J,n0){_0(o.array,i*4,c,h,m,M),_0(s.array,i*4,x,B,C,_),_0(l.array,i*4,U,o0,J,n0||0)},flush(){o.needsUpdate=s.needsUpdate=l.needsUpdate=!0}}},We=r.fork("swans"),lo=7,ht=[[1,7.3],[-2.6,9.8],[3.1,11.8],[-4.1,14],[4.4,16.2],[-1.9,18.6],[1.7,21.5]].map(([e,t],a)=>({i:a,lat:e,lead:t,d0:.02*p+15+a*4.4+(a?We.range(-1,1):0),lat0:a?-7+a*1.9+We.range(-.6,.6):-.8,drop:a===0?1.34:a===1?1.27:.8,ph:We.range(0,6.28),uA:.02+a*.004,uB:.104+a*.004})),co=io(Xs,lo),ft=zs(a0,lo*3);ya(ft.object.material,ae),u.add(ft.object),await n.yield();const dt=n.core.bell,ra=(e,t,a)=>{const o=e.uB*p+e.lead,s=p*(e.uB-e.uA);return a[0]=e.d0+(o-e.d0)*(3*t*t-2*t*t*t)+s*(t*t*t-t*t),a[1]=I(e.lat0,e.lat,H(.1,1,t)),a},ut=[],Be=[0,0],ia=[0,0],ho=(e,t)=>{const a=dt(t,.165,.298,.25),o=Math.min(1,dt(t,.295,.445,.2)+dt(t,.468,.565,.25)),s=Ae?dt(t,Ae.from,Ae.to,.3):0;return I(I(I(e.lat,e.lat*.45+2.1,s),e.lat*.45-2.1,a),e.lat*.45+2.1,o)};for(const e of ht)for(let t=1;t<=26;t++){const a=t*.024;ra(e,a,Be),Q(Be[0],Be[1]+(t%2?.2:-.2),T),ut.push(T[0],T[1],e.uA+a*(e.uB-e.uA),We.range(.45,.8)*(1-.6*a))}for(let e=0;e<2;e++){const t=ht[e];for(let a=t.uB+.022,o=0;a<.515;a+=5.2/p,o++)Q(a*p+t.lead-.4,ho(t,a)+(o%2?1.25:-1.25),T),ut.push(T[0],T[1],a,We.range(.5,.75))}for(const e of ht){Q(e.d0,e.lat0,T);for(let t=0;t<2;t++)rt.push(T[0],T[1],We(),t?.9:1.6),Ge.push(-1,e.uA+.004)}{const e=St();R0(e,"iR",rt,4),R0(e,"iU",Ge,2),e.instanceCount=Ge.length/2,$t={value:0};const t=new d.Mesh(e,O0(Gs,Is,{uU:$t,uDeep:qt},{transparent:!0,depthWrite:!1,side:d.DoubleSide}));t.frustumCulled=!1,t.renderOrder=2,u.add(t)}const fo={value:0};{const e=St();R0(e,"iR",ut,4),e.instanceCount=ut.length/4;const t=new d.Mesh(e,O0(Es,Hs,{uU:fo},{transparent:!0,depthWrite:!1,side:d.DoubleSide}));t.frustumCulled=!1,t.renderOrder=2,u.add(t)}const ns=2*Math.PI*3,rs=p/G0,is=(e,t)=>{const a=rs*fe(e);ht.forEach((o,s)=>{let l,f,i,c=1,h=0,m=.12,M=0,x=.66,B=1,C=0,_=0,U=a;if(e<o.uA)l=o.d0,f=o.lat0,i=.1+.02*Math.sin(t*1.3+s),h=s===0?.45:1,c=s===0?1:0,m=s===0?.8:0,x=s===0?.6:0,U=0,s===0&&(i+=.16);else if(e<o.uB){const h0=(e-o.uA)/(o.uB-o.uA),l0=H(.42,1,h0);ra(o,h0,Be),l=Be[0],f=Be[1],ra(o,Math.min(h0+.01,1),ia),C=-$(Math.atan2(ia[1]-f,ia[0]-l),-1.45,1.45),U=a*H(0,.8,h0),i=I(.2,Math.max(W.posAtDist(l,D0).y-o.drop,.62),l0),h=(s===0?.45:1)*(1-H(0,.4,h0)),m=I(s===0?.8:.3,.12,H(0,.7,h0)),x=I(.95,.66,l0)}else{const h0=H(o.uB,o.uB+.03,e),l0=H(.52,.66,e);l=e*p+o.lead+h0*(s<2?.6:1.2)*Math.sin(t*.31+s*1.7)+18*l0,f=ho(o,e)+h0*(s<2?.25:.5)*Math.sin(t*.23+s*2.3)-48*l0*l0,i=Math.max(W.posAtDist(l,D0).y-o.drop,.62)+h0*(s<2?.1:.22)*Math.sin(t*.41+s)+17*l0*l0,C=.75*Math.sin(Math.PI*Math.min(l0*1.15,1)),M=-.45*Math.sin(Math.PI*l0),m=.12+.2*Math.sin(Math.PI*l0),x=.66+.14*Math.sin(Math.PI*l0),B=1-H(.635,.67,e)}{const h0=l-e*p,l0=Math.hypot(h0,f),S0=Math.atan2(Math.abs(f),Math.max(h0,.01));_=.95*$(f/.8,-1,1)*(1-H(6.5,11,l0))*H(.1,.55,S0)*(1-h)}Q(l,f,T);const o0=lt(l)+C,J=t*ns+o.ph;co.set(s,T[0],i,T[1],o0,m,M,J,x,c,h,B*1.28,_);const n0=Math.sin(o0),B0=Math.cos(o0),k0=Math.floor(J/6.2832),p0=J/6.2832-k0,C0=Math.sin(o0+_),Z0=Math.cos(o0+_),H0=I(1.55,.75,h);for(let h0=0;h0<3;h0++){const l0=(p0+h0)/3,S0=U*l0*(U>0?1:0),ge=((s*.37+(k0-h0)*.61)%1+1)%1;ft.set(s*3+h0,T[0]+n0*.5+C0*(H0-.5)-n0*S0,i+I(.3,1.2,h)+.3*l0,T[1]+B0*.5+Z0*(H0-.5)-B0*S0,.24,l0,ge,(x>0?.45:.3)*B)}}),co.flush(),ft.flush()};await n.yield();const vt=io($s,1),la=.535,uo=y.x-.16*p+11,pt=new d.Vector3(uo-12,0,g-46),mt=new d.Vector3(uo+12,0,g+46),ls=Math.atan2(mt.x-pt.x,mt.z-pt.z),vo=lt(ze),cs=(e,t)=>{const a=t*2*Math.PI*1.7;if(b&&e>.78){const o=$((e-.781)/.13,0,1),s=H(.781,.796,e)*(1-H(.901,.911,e));vt.set(0,I(pt.x,mt.x,o),10.2-6.6*Math.sin(Math.PI*o),I(pt.z,mt.z,o),ls,.06,-.3*Math.sin(Math.PI*o),a,.62,1,0,1.35*s)}else if(e<la)vt.set(0,X0.x,X0.y+.3,X0.z,vo+1.9,1.05,0,0,0,.04+.04*Math.sin(t*.9),.7,1.12);else{const o=$((e-la)/.135,0,1),s=H(0,.06,o),l=ze+11*Math.min(o,.2)+Math.max(e-.562,0)*p*1.07,f=Qa-.35-42*o-2.6*H(0,.11,o)*(1-H(.18,.3,o)),i=X0.y+.3+(2.6-X0.y-.3)*H(0,.2,o)+14*H(.27,1,o);Q(l,f,T);const c=I(X0.x,T[0],H(0,.05,o)),h=I(X0.z,T[1],H(0,.05,o));vt.set(0,c,i,h,vo+I(1.9,1.25,H(.15,.6,o)),I(1.05,.05,s)-.25*H(0,.2,o)*(1-H(.2,.3,o)),0,a,I(.9,.62,o),I(.06,1,s),.7*(1-s),1.12*(1-H(.93,1,o)))}vt.flush()},Fe=r.fork("deer"),gt=E<.5?.25:E<.75?0:1,Te=gt===1?6:9;await n.yield();const wt=on();wt.instanceCount=Te;const ca=R0(wt,"iP",new Float32Array(Te*4),4),ha=R0(wt,"iQ",new Float32Array(Te*4),4),fa=Te*4,yt=St();yt.instanceCount=fa;const Ke=R0(yt,"iP",new Float32Array(fa*4),4),je=R0(yt,"iQ",new Float32Array(fa*4),4);for(const e of[ca,ha,Ke,je])e.setUsage(d.DynamicDrawUsage);{const e=new d.Mesh(wt,O0(Zs,Co,{},{side:d.DoubleSide}));e.frustumCulled=!1,u.add(e);const t=new d.Mesh(yt,O0(Js,en,{},{transparent:!0,depthWrite:!1,side:d.DoubleSide}));t.frustumCulled=!1,t.renderOrder=2,u.add(t)}const po=[];for(let e=0;e<Te;e++){const t=gt===1||gt>0&&(e===0||e===Te-2);po.push({s0:-5.5-e*(gt===1?2.3:1.5)+(e?Fe.range(-.25,.25):0),dd:e?(e%2?1.4:-.1)+Fe.range(-.3,.3):0,stag:t?1:0,sc:t?Fe.range(1.36,1.42):e%4===2?1:Fe.range(1.17,1.26),ph:Fe.range(0,6.28),sd:Fe()})}const hs=1.25,da=.3,cn=new d.Vector3,fs=(e,t)=>{const a=hs*($(e,.5,.72)-Ma)*G0;po.forEach((o,s)=>{const l=o.s0-a,f=$e+.2*(-l-5.5)+o.dd;Q(f,l,T);const i=$(Math.round((f-e0)/g0),0,t0),c=-f0[i]+.2*w0[i],h=-w0[i]-.2*f0[i],m=Math.atan2(c,h),M=Math.hypot(c,h),x=T[0],B=T[1],C=o.sc,_=c/M,U=h/M;_0(ca.array,s*4,x,-da,B,m),_0(ha.array,s*4,o.ph+a*6/C,.07*Math.sin(t*.8+o.ph)+.05*o.stag,C,o.stag);let o0=s*16;_0(Ke.array,o0,x,0,B,5.4*C),_0(je.array,o0,m,o.sd,.6,0),o0+=4;for(let J=0;J<2;J++,o0+=4){const n0=(t/3.4+o.sd+J*.5)%1;_0(Ke.array,o0,x+_*C+w0[i]*.5*n0,-da+1.24*C+.35*n0,B+U*C-f0[i]*.5*n0,(.1+.42*Math.sqrt(n0))*C),_0(je.array,o0,0,o.sd+J*.37,.8*(1-n0)*(1-n0)*Math.min(n0*12,1),1)}{const J=(t/4.6+o.sd*3.1)%1;_0(Ke.array,o0,x+w0[i]*.3*J,-da+.95*C+.6*J,B-f0[i]*.3*J,.4+.5*J),_0(je.array,o0,0,o.sd+.7,.22*Math.sin(Math.PI*J),1)}}),ca.needsUpdate=ha.needsUpdate=Ke.needsUpdate=je.needsUpdate=!0};await n.yield();const d0=r.fork("wisps"),mo=[],go=[],ua=[],V0=(e,t,a,o,s,l,f,i,c=0)=>{mo.push(e,t,a,o),go.push(s,l,f,i),ua.push(c)},wo=(e,t,a)=>!(Math.abs(e)<47&&t<8.4)&&!(e>85&&Math.abs(a)<12.5),yo=Math.round(34*(.6+.4*P)*$(U0,.5,1.2));for(let e=0;e<yo;e++){const t=I(24,p+35,(e+d0())/yo),a=e%2?1:-1,o=a>0?q0(t):-ee(t),s=a*$(o-d0.range(1,4.5),8.6,40);Q(t,s,T);const l=d0.range(2,3.1),f=d0.range(1.7,2.7),i=d0.range(.04,.062),c=d0(),h=T[0],m=T[1];if(wo(h,m,s))for(let M=0;M<8;M++)V0(h+d0.range(-.5,.5),.35,m+d0.range(-.5,.5),l*d0.range(.85,1.15),(c+(M+d0.range(-.2,.2))/8)%1,i,f,d0.range(.5,.72))}const ds=Math.round(240*(.5+.5*P));for(let e=0;e<ds;e++){const t=d0.range(-30,p+40),a=d0.sign(),o=a>0?q0(t):-ee(t),s=a*$(o-d0.range(.5,5.5),7.5,40);Q(t,s,T),wo(T[0],T[1],s)&&V0(T[0],d0.range(.15,.6),T[1],d0.range(1.4,2.6),d0(),d0.range(.05,.11),1,d0.range(.3,.5))}ae.uStBk.value.slice(0,3).forEach((e,t)=>{for(let a=0;a<14;a++)V0(e.x+d0.range(-1,1)*at[t][0]*.9,d0.range(3,q?4.5:7.5),e.z+d0.range(-1,1)*at[t][2]*.8,d0.range(9,14),d0(),0,1.6,d0.range(.3,.45)*Math.min(U0,1),t?0:2.5)});{const e=n.core.makeRng(n.core.hashSeed(n.seed+":bank-billows"));for(const[t,a]of[[3,La],[4,tt]])for(let o=0;o<12;o++){const s=o%2?1:-1;Q(a+e.range(-1.15,1.15)*at[t][0],s*e.range(9.5,17),T),V0(T[0],e.range(1.5,q?3:4.5),T[1],e.range(5,8),e(),0,1.5,e.range(.26,.4)*Math.min(U0,1),s<0?.6:0)}}{const e=n.core.makeRng(n.core.hashSeed("lee-columns:"+n.seed)),t=[ne,...te],a=[F0,...t];for(const o of t){const s=o.d+o.HL,l=e.range(2.5,4.5),f=e.range(-.6,.6),i=e.range(1.9,2.4);if(s>300||a.some(B=>B!==o&&B.s*o.s>0&&B.d-B.HL>s-2&&B.d-B.HL<s+l+i))continue;Q(s+l,o.s+f,T);const c=e.range(5.5,7),h=e.range(.034,.046),m=e();for(let B=0;B<16;B++)V0(T[0]+e.range(-.3,.3),.45,T[1]+e.range(-.3,.3),.78*i*e.range(.85,1.15),(m+(B+e.range(-.2,.2))/16)%1,h,c*1.2,e.range(.5,.66),2.85);Q(s+l+e.range(2.6,4.2),o.s+f+e.range(1,1.7)*(e()<.5?-1:1),T);const M=e(),x=h*e.range(1.25,1.5);for(let B=0;B<8;B++)V0(T[0]+e.range(-.2,.2),.35,T[1]+e.range(-.2,.2),.55*i*e.range(.85,1.15),(M+(B+e.range(-.2,.2))/8)%1,x,c*.75,e.range(.45,.6),2.85)}}const u0=r.fork("wisps2"),va=Math.min(U0,1);for(let e=0;e<10;e++)Q(K0+8+e*2.6,-10.6-.4*e+u0.range(-1.2,1.2),T),V0(T[0],5+1.6*e+u0.range(-1,1),T[1],u0.range(9,12.5),u0(),0,1.4,u0.range(.38,.48)*va,2.85);for(const e of[1,2]){const t=M0[e],a=Math.round(t.HL/4.2);for(let o=0;o<a;o++)Q(t.d+I(-t.HL-4,t.HL+8,(o+u0())/a),-(25+u0.range(0,6)),T),V0(T[0],u0.range(3.2,6.5),T[1],u0.range(7,9.5),u0(),0,1.6,u0.range(.24,.36)*va,.5)}for(let e=0;e<15;e++)V0(-58+e*8.4+u0.range(-2.5,2.5),u0.range(5.4,7.8),u0.range(-19.5,-15.5),u0.range(8.5,11.5),u0(),0,1.7,u0.range(.46,.6)*va,.85);const xo=Math.round(150*(.5+.5*P)*$(U0,.5,1.1));for(let e=0;e<xo;e++){const t=I(6,p-20,(e+u0())/xo),a=u0.range(-6.5,6.5),o=u0.range(1.1,2),s=u0(),l=u0.range(.06,.12),f=u0.range(.34,.52);Q(t,a,T),!([F0,...M0,...te].some(i=>Math.abs(t-i.d)<i.HL+2&&Math.abs(a-i.s)<i.HW+1.2)||Math.abs(T[0])<50&&T[1]<8.6||T[0]>56&&Math.abs(a)<5)&&V0(T[0],u0.range(.1,.3),T[1],o,s,l,1.3,f)}for(const[e,t,a]of[[.25,.2,.54],[.4,.6,.3],[.7,2.6,0],[.12,2.2,.8]])Q(e*p+5.2,t,T),V0(T[0],.2,T[1],1.7,a,.08,1.3,.5);{const e=St();R0(e,"iP",mo,4),R0(e,"iQ",go,4),R0(e,"iT",ua,1),e.instanceCount=ua.length;const t=new d.Mesh(e,O0(_s,Ks,{uWisp:{value:new d.Vector4(q?2.4:1.1,q?.25:.62,U0>.5?1.8:1.1,0)}},{transparent:!0,depthWrite:!1}));t.frustumCulled=!1,t.renderOrder=1,u.add(t)}await n.yield();const E0=r.fork("glitter"),us=Math.round((A?2600:1900*$(w.glit,.3,2.2))*P),bo={value:new d.Vector4(44,A?16:20,0,A?6:3)},ko={value:new d.Vector2(0,la+.002)},vs=A?new d.Color(.78,.78,.84):a0.uSunCol.value.clone().multiplyScalar(1.7).addScalar(.45),pa=(e,t,a,o,s,l,f)=>{const i=new Float32Array(e*3),c=new Float32Array(e*4);for(let M=0;M<e;M++)t(i,M*3),c.set([E0(),E0.range(a[0],a[1]),E0.range(1.5,5),E0.range(o[0],o[1])],M*4);const h=new d.BufferGeometry;h.setAttribute("position",new d.BufferAttribute(i,3)),h.setAttribute("aD",new d.BufferAttribute(c,4));const m=new d.Points(h,new d.ShaderMaterial({vertexShader:js,fragmentShader:Qs,defines:l,uniforms:{uGl:bo,uPx:a0.uPx,uEv:ko,uGlWind:{value:f},uGlCol:{value:vs}},transparent:!0,depthWrite:!1,...s}));m.frustumCulled=!1,m.renderOrder=4,u.add(m)};pa(us,(e,t)=>{e[t]=E0(),e[t+1]=E0(),e[t+2]=E0()},A?[.9,1.7]:[.08,.35*Math.sqrt(w.fall)],A?[.05,.09]:[.02,.04],{blending:A?d.NormalBlending:d.AdditiveBlending},A?{SNOWFALL:1}:{},new d.Vector3(q?3.5:A?.35:.05,0,q?1:.15)),pa(Math.round(280*P),(e,t)=>{const a=E0();e[t]=I(Y0[0],X0.x,a)+E0.range(-.8,.8),e[t+1]=X0.y+E0.range(-.5,.9),e[t+2]=I(Y0[1],X0.z,a)+E0.range(-.8,.8)},[.5,1.3],[.03,.055],{blending:d.AdditiveBlending},{EVENT:1},new d.Vector3(-f0[Se]*1.5,0,-w0[Se]*1.5));{const e=r.fork("fall"),t=[];for(let o=0;o<Math.round(300*P);o++){const s=It[e.int(0,It.length-1)];t.push(j0[0]+s[0]+e.range(-.6,.6),Ee+s[1]-e.range(0,.5),j0[1]+s[2]+e.range(-.6,.6))}for(let o=0;o<Math.round(220*P);o++){const s=e.range(.25,2.9),l=e.range(7.6,10.5);t.push(Wt+e.range(-2.5,2.5),y.y+l*Math.sin(s),g+l*Math.cos(s))}for(const o of pe){const s=Math.round(13*P);for(let l=0;l<s;l++){const f=e.range(0,6.28),i=o.reach*Math.sqrt(e())*.9;t.push(o.x+Math.cos(f)*i,o.y+o.h*e.range(.35,.8),o.z+Math.sin(f)*i)}}let a=0;pa(t.length/3,(o,s)=>{o[s]=t[a++],o[s+1]=t[a++],o[s+2]=t[a++]},[.35,.9],[.028,.05],{blending:d.AdditiveBlending},{FALL:1},new d.Vector3(q?2.2:.12,0,q?.6:.05))}await n.yield();const ps=new d.Vector3(Ua[0],1.3,Ua[1]),ma=new d.Vector3,Mo=new d.Vector3,zo=Q($e+2,-14.5),ga=(e,t)=>{const a=new d.Vector3,o=[0,0];return(s,l)=>(Q($(l*p+6.5,e.d-e.HL+3,e.d+e.HL-3),t.side*t.lat,o),a.set(o[0],1.9,o[1]))},ms=new d.Vector3,gs=[{at:ps,from:.03,to:.15,weight:.3},...Ae?[{at:(e,t)=>(Q($(t*p+6.5,$0.d0,$0.d1),$0.s,T),ms.set(T[0],1.4,T[1])),from:Ae.from,to:Ae.to,weight:.62,fade:.3}]:[],{at:ga(M0[0],De[0]),from:.165,to:.298,weight:.6,fade:.25},{at:ga(M0[1],De[1]),from:.295,to:.445,weight:.62,fade:.25},{at:ga(M0[2],De[2]),from:.468,to:.547,weight:.6,fade:.3},{at:(e,t)=>{const a=W.pointAt(t,ma).x;return Mo.set(zo[0],1,zo[1]),ma.set($(a+7.9,-42.5,58),1.5,0),ma.lerp(Mo,1-H(.626,.662,t))},from:.588,to:.845,weight:.8,fade:.11}];return{scene:u,path:W,duration:G0,pace:fe,pois:gs,ride:"none",guards:{lipTussocks:Q0.counts.lipTussocks,lipNotMade:Q0.counts.lipNotMade,fiveRaise:ct},camera:{fov:62,near:.3,far:4e3,lookAhead:26,nearThrough:.3},portal:{shape:"circle",radius:7,color:w.horS,glow:1,revealDistance:260},post:{exposure:w.exposure,bloom:{strength:w.bloom,radius:.7,threshold:.9},grade:{saturation:w.sat,contrast:1.03,tint:"#ffffff",shadowTint:w.shadow,vignette:.22,grain:.02,aberration:0}},update(e,t,a,o){o=o??0,w.el>0&&qa(w.el+(w.el<12?o:0)),Dt.position.copy(Rt).multiplyScalar(200),ae.uStP.value.w=t,ae.uStP.value.x=.008*U0*I(.55,1,H(.02,.22,o)),ae.uStB.value.copy(Pt).lerp(Go,o),Nt.uSkyK.value.w=t,bo.value.z=t,ko.value.x=o,fo.value=o,$t.value=o,Q0.setDance(ka(o)),Q0.setProgress((o-Ct)/(1-Ct)),Q0.update(e,t,a),W.pointAt(o,He),Q0.setShown(Zt($o)<115,Zo.map(s=>Zt(s)<160));for(const s of Ya)s[0].visible=Zt(s[1])<s[2];Ja.uTau.value=t,eo.uTau.value=o*G0,ao.uTau.value=ss(o*p)/Le,no.uTau.value=$(o,_e,na)*G0,is(o,t),cs(o,t),ts(o,t),fs(o,t)},dispose(){Q0.dispose?.();for(const e of ve)e.dispose()}}}};export{un as default};
