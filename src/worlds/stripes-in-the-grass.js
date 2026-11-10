import*as x from"three";import{makePath as nt}from"../kit/core.js";import*as Le from"../parts/stripes-in-the-grass.js";const{CAN:m,STYLE_GLSL:Qe}=Le,Ke=Math.PI/180,it=[[0,5.2,-56],[0,4.55,-6],[0,5.3,60],[0,5.3,120],[0,3,160],[0,1.75,206],[-.5,1.7,240],[-8.5,1.7,263],[-15.5,1.7,285],[-11.5,1.7,310],[-6,1.75,345],[6,4.2,385],[26,7.4,430],[47,8.5,466],[58.1,8.5,497.4],[49.05,8.5,531.2],[40,8.5,565]],$e=440,Ye=592,et=752,rt=`
varying vec3 vDir;
void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,lt=`
uniform vec3 uSkyC[3]; uniform vec3 uSpatC[2]; uniform vec3 uSun; uniform vec3 uCloudC[3]; uniform float uDrip, uRain; uniform vec3 uSilC;
varying vec3 vDir;
float cloudSd(vec2 q){
  float d = 0.62 - length(q * vec2(0.55, 1.0));
  d = max(d, 0.50 - length(q - vec2(-0.75, 0.05))); d = max(d, 0.56 - length(q - vec2(0.62, 0.18)));
  d = max(d, 0.36 - length(q - vec2(1.25, -0.02))); d = max(d, 0.34 - length(q - vec2(-1.3, -0.08)));
  d = min(d, q.y + 0.22);
  return min(d, max(abs(q.x - 0.31) - 0.035, 0.2 - abs(q.y - 0.3)) );   // one bridge gap holds the card together
}
void main(){
  vec3 d = normalize(vDir + vec3(0., 1e-5, 0.));
  float el = degrees(asin(clamp(d.y, -1., 1.)));
  float az = degrees(atan(d.x, d.z + 1e-6));
  float pxDeg = max(length(fwidth(d)) * 57.3, 1e-4);
  float streak = (sNoise(vec2(az * 0.05, el * 0.8)) - 0.5) * 7. + (sNoise(vec2(az * 0.17 + 3., el * 2.3)) - 0.5) * 3.;
  float e = el + streak;
  vec3 c = mix(uSkyC[0], uSkyC[1], smoothstep(8., 17., e));
  c = mix(c, uSkyC[2], smoothstep(27., 45., e));
  // clog spatter: fixed round dots, biggest near the zenith
  vec2 g = vec2(az, el) / 5.5; vec2 id = floor(g); vec2 f = fract(g) - 0.5;
  float h = sHash(id + 17.), h2 = sHash(id + 41.);
  f -= (vec2(h2, sHash(id + 5.)) - 0.5) * 0.6;
  float rad = (0.035 + 0.11 * h2 * h2) * (0.5 + el / 60.);
  float dot1 = clamp((rad - length(f)) * 5.5 / pxDeg + 0.5, 0., 1.) * step(0.42, h) * step(3., el);
  c = mix(c, h > 0.75 ? uSpatC[1] : uSpatC[0], dot1 * step(0.5, rad * 5.5 / pxDeg + 0.2));
  // seven test bursts low to starboard, where the can was tried: no two the same size or quite in line, the first sputtered, the
  // heavy ones run in a drip
  vec2 tq = vec2((az + 58.) / 3.4, (el - 7.) / 3.4); float ti = floor(tq.x); float th = sHash(vec2(ti, 3.1)), th2 = sHash(vec2(ti, 8.7));
  vec2 tf = vec2(fract(tq.x) - 0.5 - (th2 - 0.5) * 0.3, tq.y - (th - 0.5) * 0.55);
  float td = 0.13 + 0.25 * th - length(tf);
  if (th > 0.62) { float xo = (th2 - 0.5) * 0.26, ln = 0.45 + 1.2 * th2, wl = max(0.028, 0.8 * pxDeg / 3.4);                      // a run from one side of the burst, ending in a bead
    td = max(td, max(min(wl - abs(tf.x - xo), min(-tf.y, tf.y + ln)), 1.9 * wl - length(tf - vec2(xo, -ln)))); }
  float sput = ti < 0.5 ? step(0.45, sNoise(vec2(az, el) * 6.)) : 1.;
  c = mix(c, uSpatC[1], clamp(td * 3.4 / pxDeg + 0.5, 0., 1.) * step(0., ti) * step(ti, 6.5) * sput);
  // the sun: a solid stencilled disc 5 degrees wide, a wide halo, two drips creeping down under it (sprayed before the clouds: one cloud card's edge lies across it)
  float ang = degrees(acos(clamp(dot(d, uSun), -1., 1.)));
  c = mix(c, uCloudC[0], 0.24 * (1. - smoothstep(2.5, 27., ang)));
  float sAz = degrees(atan(uSun.x, uSun.z + 1e-6)), sEl = degrees(asin(clamp(uSun.y, -1., 1.)));
  float dx = (mod(az - sAz + 180., 360.) - 180.) * cos(radians(el));
  float w = max(0.17, 0.8 * pxDeg);
  float len1 = min(7., 1. + uDrip * 0.02 * 9.), len2 = min(4.2, 0.4 + uDrip * 0.02 * 6.);
  float dr = max(step(abs(dx + 0.9), w) * step(sEl - 2.4 - len1, el), step(abs(dx - 1.2), w) * step(sEl - 2.2 - len2, el)) * step(el, sEl);
  dr = max(dr, max(clamp((0.5 - length(vec2(dx + 0.9, el - (sEl - 2.4 - len1)) * vec2(1., 0.8))) / pxDeg + 0.5, 0., 1.), clamp((0.42 - length(vec2(dx - 1.2, el - (sEl - 2.2 - len2)) * vec2(1., 0.8))) / pxDeg + 0.5, 0., 1.)));   // the bead each run ends in
  c = mix(c, uCloudC[0], max(dr, clamp((2.5 - ang) / pxDeg + 0.5, 0., 1.)));
  // clouds: white layer, straw underside, teal shadow slid to starboard and down, a faint halo
  for (int i = 0; i < 5; i++) {
    float fi = float(i); float s = i < 2 ? 7. : (i < 4 ? 4.6 : 3.2); float flip = (i == 1 || i == 3) ? -1. : 1.;
    float caz = -95. + fi * 47. + sin(fi * 2.7) * 9. + uTime * 0.12 - (i == 4 ? 3.5 : 0.); caz = mod(caz + 180., 360.) - 180.;
    float cel = 17. + 5. * sin(fi * 1.9 + 1.);
    float dz = az - caz; dz = mod(dz + 180., 360.) - 180.;
    vec2 q = vec2(dz * flip, el - cel) / s;
    float dS = cloudSd(q + vec2(0.3 * flip, 0.05)), dW = cloudSd(q);
    c = mix(c, uCloudC[2], clamp(dS * s / pxDeg + 0.5, 0., 1.));
    c = mix(c, uCloudC[0], 0.13 * (1. - smoothstep(0., 0.45, -dW)));
    c = mix(c, q.y < -0.02 + 0.06 * sin(q.x * 5.) ? uCloudC[1] : uCloudC[0], clamp(dW * s / pxDeg + 0.5, 0., 1.));
  }
  // first rain: slanting dashes from one rain card, repeated, falling
  if (uRain > 0.5) { vec2 rg = vec2((az + el * 0.4) / 2.6, (el + uTime * 22.) / 5.2); vec2 ri = mod(floor(rg), vec2(5., 4.)); vec2 rf = fract(rg) - 0.5;
    float rh = sHash(ri + 71.); rf.x += (rh - 0.5) * 0.5;
    float rd = min(max(0.03, 0.8 * pxDeg / 2.6) - abs(rf.x), (0.3 * (0.4 + 0.6 * rh) - abs(rf.y)) * 2.);
    c = mix(c, uCloudC[0], clamp(rd * 2.6 / pxDeg + 0.5, 0., 1.) * step(0.35, rh) * step(1., el)); }
  if (el < 0.) c = uSilC;
  gl_FragColor = vec4(c, 1.);
}`;function ct(p,R){const ge=p.cans,X=new x.ShaderMaterial({uniforms:{...p.uniforms,uSkyC:{value:R.sky.map(B=>ge[B])},uSpatC:{value:R.spat.map(B=>ge[B])},uCloudC:{value:R.cloud.map(B=>ge[B])},uDrip:{value:0},uRain:{value:R.rain?1:0},uSilC:{value:R.silC},uSun:{value:new x.Vector3(Math.sin(80*Ke)*Math.cos(20*Ke),Math.sin(20*Ke),Math.cos(80*Ke)*Math.cos(20*Ke))}},vertexShader:rt,fragmentShader:Qe+lt,depthWrite:!1,depthTest:!0,side:x.BackSide}),fe=new x.Mesh(new x.SphereGeometry(1,48,24),X);return fe.frustumCulled=!1,fe.renderOrder=-10,fe}const tt=`
uniform sampler2D uMask; uniform vec4 uMaskBox;                         // x0, z0, 1/width, 1/depth
// r = how much of the stand is left (1 full, 0 trail), g = share of stems that are wide (the curtain), b = share left as broken, lying blades
vec3 maskRGB(vec2 p){ vec2 q = (p - uMaskBox.xy) * uMaskBox.zw;
  if (q.x < 0.004 || q.x > 0.996 || q.y < 0.004 || q.y > 0.996) return vec3(1., 0., 0.);
  return textureLod(uMask, q, 0.).rgb; }
float maskAt(vec2 p){ return maskRGB(p).r; }
float zoneAt(vec2 p){
  float zs = ${$e.toFixed(1)} + 9. * sin(p.x * 0.031) + 5. * sin(p.x * 0.083 + 1.);
  float zr = ${Ye.toFixed(1)} + 5. * sin(p.x * 0.021 + 2.);
  if (p.y > zr && p.y < ${et.toFixed(1)} + 8. * sin(p.x * 0.017)) return 2.;
  if (p.y > zs && p.y <= zr && abs(p.x - 40.) < 190. + 20. * sin(p.y * 0.05)) return 1.;
  return 0.;
}`;function ht(p,R,ge){const k=document.createElement("canvas");k.width=k.height=1024;const D=k.getContext("2d"),ie=1024/256;D.fillStyle="rgb(255,0,0)",D.fillRect(0,0,1024,1024),D.lineCap="round";const re=new x.Vector3,H="rgb(0,0,44)";let b=()=>99;if(R){const Q=(C,G)=>{const he=R.toW(C,G);return[(he[0]- -128)*ie,(he[1]-150)*ie]},l=(C,G)=>{D.fillStyle=G,D.beginPath(),C.forEach(([he,Me],Fe)=>{const ze=Q(he,Me);Fe?D.lineTo(ze[0],ze[1]):D.moveTo(ze[0],ze[1])}),D.closePath(),D.fill()},le=(C,G,he)=>{D.strokeStyle=he,D.lineWidth=G*ie,D.beginPath(),C.forEach(([Me,Fe],ze)=>{const n=Q(Me,Fe);ze?D.lineTo(n[0],n[1]):D.moveTo(n[0],n[1])}),D.stroke()},S=[R.pw.a[0],R.pw.a[2]],K=[R.pw.b[0],R.pw.b[2]],J=R.tr,ee=J.farWallX,De=J.stop[1],N=ge?17:0,Y="rgb(12,0,118)",Ie="rgb(36,70,90)",Be="rgb(20,90,120)",Ce=Math.cos(ve.h),He=Math.sin(ve.h),xe=[];for(let C=0;C<=240;C++)p.pointAt(.44+.2*C/240,re),xe.push([Ce*(re.x-ve.x)-He*(re.z-ve.z),He*(re.x-ve.x)+Ce*(re.z-ve.z)]);const $=C=>{if(C>=-50)return 0;for(let G=1;G<xe.length;G++)if(xe[G][1]>=C){const he=xe[G-1],Me=xe[G];return he[0]+(Me[0]-he[0])*(C-he[1])/Math.max(1e-4,Me[1]-he[1])}return 0},Pe=(C,G,he,Me,Fe)=>{const ze=[];for(let n=C;n<G;n+=2)ze.push([$(n)+he,n]);ze.push([$(G)+he,G]);for(let n=G;n>C;n-=2)ze.push([$(n)+Me,n]);ze.push([$(C)+Me,C]),l(ze,Fe)};{const C=[[S[0]+.4,S[1]],[K[0]+.4,K[1]],[3.3,K[1]]];for(let G=-50;G>S[1]-5;G-=2)C.push([$(G)+3.3,G]);C.push([$(S[1]-5)+3.3,S[1]-5]),l(C,Y)}Pe(S[1]-9,-40,1.2,3.5,Be),l([[1.2,-40],[3.5,-40],[3.5,-14.5],[1.2,-14.5]],Ie),l([[1.2,-14.5],[3.5,-14.5],[3.5,-8.2],[1.2,-8.2]],Be),l([[1.2,-8.2],[3.5,-8.2],[3.5,-5],[1.2,-5.6]],Ie),l([[1.2,-5.6],[3.5,-5],[3.5,-.3],[1.2,1.5]],Y),l([[1.2,1.5],[3.5,-.3],[3.5,K[1]],[1.2,K[1]]],"rgb(135,80,60)");const be=J.ret,me=J.hEnd||0,Te=[Math.sin(me),Math.cos(me)],Ee=[Math.cos(me)*.3,-Math.sin(me)*.3];be?l([[-1.1,-4.6],[-1.1,be.b[1]-1.7],[be.b[0]+Ee[0],be.b[1]+Ee[1]],[be.a[0]+Ee[0],be.a[1]+Ee[1]],[-ee+3,-2.6]],"rgb(0,0,105)"):l([[-1.5,-4.6],[-1.5,8+N],[-ee-.4,De+6+N],[-ee-.4,De-10],[-ee+3,De-13.5]],"rgb(15,0,105)");const Re=J.turnEnd||J.stop;if(le([J.paceEnd,J.boundFrom,J.boundTo,[Re[0]-.5,Re[1]-.4],J.stop,[J.stop[0]+Te[0]*2.2,J.stop[1]+Te[1]*2.2]],3.4,"rgb(0,0,36)"),ge)for(const C of[12,15.5])le([[J.boundFrom[0]+1,J.boundFrom[1]+C-.6],[J.boundTo[0],J.boundTo[1]+C],[Re[0]-.5,Re[1]-.4+C],[J.stop[0]+Te[0],J.stop[1]+Te[1]+C]],2.6,"rgb(0,0,36)");const Ve=Math.cos(ve.h),Ne=Math.sin(ve.h);b=C=>Ne*(C.x-ve.x)+Ve*(C.z-ve.z)}D.fillStyle=H,D.strokeStyle=H;for(let Q=0;Q<=900;Q++){if(p.pointAt(Q/900,re),re.z<126||re.z>404)continue;const l=b(re),S=(2.25-.85*(A(-52,-38,l)*(1-A(7,14,l))))*Math.min(1,(re.z-126)/40)+Math.max(0,re.z-340)*.05;D.beginPath(),D.arc((re.x- -128)*ie,(re.z-150)*ie,Math.max(.4,S)*ie,0,6.3),D.fill()}const ce=R?R.toW(-R.tr.farWallX-1.5,1.5):[-22,330];D.lineWidth=6*ie,D.beginPath(),D.moveTo(8*ie,(ce[1]-16-150)*ie),D.lineTo((ce[0]-8- -128)*ie,(ce[1]-1.5-150)*ie),D.lineTo((ce[0]- -128)*ie,(ce[1]-150)*ie),D.stroke();const V=new x.CanvasTexture(k);return V.minFilter=x.LinearFilter,V.magFilter=x.LinearFilter,V.generateMipmaps=!1,V.flipY=!1,V.colorSpace=x.NoColorSpace,{tex:V,box:new x.Vector4(-128,150,1/256,1/256)}}const dt=`
varying vec3 vWp;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,ft=`
uniform vec3 uBodyC, uShadeC, uPlumeC; uniform vec2 uRing; uniform vec4 uShadow;
varying vec3 vWp;
// a cut blade lying flat: q.x along it, q.y across; it tapers to its tip and is broken by one bridge gap
float sliverSd(vec2 q, float l, float w){
  float t = clamp(q.x / l, -1., 1.);
  float d = min(w * (0.42 + 0.58 * (0.5 - 0.5 * t)) - abs(q.y), (l - abs(q.x)) * 0.6);
  return min(d, abs(q.x - 0.22 * l) - 0.03);
}
// trampled grass, as three passes of one cut: x the straw blades lying in swirls, y the same cut slid to starboard (teal shadow),
// z the same cut widened and slid a thumb to port (the black pass under them, seen as a cut edge); metres, + inside
vec3 trample(vec2 p, vec2 sl){
  vec2 id0 = floor(p / 0.9); vec3 d = vec3(-1.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 id = id0 + vec2(float(i), float(j));
    float h = sHash(id + 3.1), h2 = sHash(id + 17.7), h3 = sHash(id + 41.3);
    if (h < 0.14) continue;
    vec2 c = (id + 0.5 + (vec2(h2, h3) - 0.5) * 0.8) * 0.9;
    float a = 6.283 * sNoise(id * 0.21 + 5.) + (h - 0.5) * 1.3; vec2 ax = vec2(cos(a), sin(a));
    float l = 0.4 + 0.42 * h3, w = 0.045 + 0.05 * h2; vec2 q = p - c;
    d.x = max(d.x, sliverSd(vec2(dot(q, ax), dot(q, vec2(-ax.y, ax.x))), l, w));
    vec2 qt = q + sl;
    d.y = max(d.y, sliverSd(vec2(dot(qt, ax), dot(qt, vec2(-ax.y, ax.x))), l, w));
    qt = q - sl * 0.32;
    if (h > 0.45) d.z = max(d.z, sliverSd(vec2(dot(qt, ax), dot(qt, vec2(-ax.y, ax.x))), l, w * 1.25));
  }
  return d;
}
// the cloud card again, for its shadow on the sand (the same outline and the one bridge gap as the clouds in the sky)
float cloudSd(vec2 q){
  float d = 0.62 - length(q * vec2(0.55, 1.0));
  d = max(d, 0.50 - length(q - vec2(-0.75, 0.05))); d = max(d, 0.56 - length(q - vec2(0.62, 0.18)));
  d = max(d, 0.36 - length(q - vec2(1.25, -0.02))); d = max(d, 0.34 - length(q - vec2(-1.3, -0.08)));
  d = min(d, q.y + 0.22);
  return min(d, max(abs(q.x - 0.31) - 0.035, 0.2 - abs(q.y - 0.3)) );
}
// one wind ripple to a cell of g metres: a teal sliver lying across the wind, no two alike
float rippleAt(vec2 p, float g, float seed){
  vec2 id = floor(p / g); float h = sHash(id + seed), h2 = sHash(id + seed + 7.3), h3 = sHash(id + seed + 19.1);
  if (h < 0.52) return -1.;
  vec2 q = p - (id + 0.5 + (vec2(h2, h3) - 0.5) * 0.36) * g; float a = 1.5708 + (h3 - 0.5) * 1.5; vec2 ax = vec2(cos(a), sin(a));
  return sliverSd(vec2(dot(q, ax), dot(q, vec2(-ax.y, ax.x))) * (3.4 / g), 0.55 + 0.5 * h2, 0.05 + 0.07 * h) * (g / 3.4);
}
void main(){
  vec2 p = vWp.xz; float dist = distance(vWp, cameraPosition); float px = max(length(fwidth(p)) * 0.7, 1e-4);
  float zone = zoneAt(p); float m = maskAt(p); vec3 c;
  vec3 sil = uBodyC * vec3(0.93, 0.88, 0.80);
  if (zone < 0.5) {
    float reedG = smoothstep(346., 410., p.y) * (1. - step(752.0, p.y));
    if (m < 0.5 || reedG > 0.2 + 0.6 * sNoise(p * 0.23 + 2.)) {                // trampled trail, and the thin ground among the reeds: straw, teal stem shadows slid to starboard, black flecks
      c = uBodyC; float fine = 1. - smoothstep(0.045, 0.11, px);
      vec3 tr = max(trample(p, vec2(0.12, -0.065)), trample(p.yx * 1.31 + 19.7, vec2(-0.085, 0.157)) / 1.31);
      float pc = min(px, 0.03);                                         // cut crisp; a mark too fine to cut is left out, not blurred to a sixth colour
      c = mix(c, uCan[0], cutDist(tr.z, pc, 0.) * step(px, 0.05));       // spraying order: black under, teal slid, straw on top
      c = mix(c, uShadeC, cutDist(tr.y, pc, 0.) * step(px, 0.085));
      c = mix(c, uBodyC, cutDist(tr.x, pc, 0.));
      vec2 g = p / 0.43; vec2 id = floor(g); float h = sHash(id + 3.), h2 = sHash(id + 9.);       // black flecks, no two alike, none on a grid
      vec2 f = fract(g) - 0.5 - (vec2(h2, sHash(id + 23.)) - 0.5) * 0.72;
      float a = h * 6.283; f = vec2(cos(a) * f.x - sin(a) * f.y, sin(a) * f.x + cos(a) * f.y);
      c = mix(c, uCan[0], cutDist((0.03 + 0.2 * h2 * h2 * h2 - length(f * vec2(1., 1. + 2.2 * h))) * 0.43, px, 0.) * step(0.55, h) * fine);
      g = p / 1.37 + 7.3; id = floor(g); h = sHash(id + 5.); h2 = sHash(id + 13.);                 // seed heads fallen from the plumes
      f = fract(g) - 0.5 - (vec2(h2, sHash(id + 29.)) - 0.5) * 0.7; a = h2 * 6.283; f = vec2(cos(a) * f.x - sin(a) * f.y, sin(a) * f.x + cos(a) * f.y);
      c = mix(c, uPlumeC, cutDist((0.045 - length(f * vec2(0.36, 1.))) * 1.37, px, 0.) * step(0.7, h) * step(0.012, abs(f.x - 0.03)) * fine);
    } else {                                                            // the dark between stems, late sun leaking through as orange underspray
      // it is printed shadow, not a hole: THE CARD laid on the ground, its black islands lying among the stems' feet over the straw,
      // the same cut slid to starboard in teal under them, orange underspray leaking through in cut islands
      float f = sNoise(p * 0.45 + 5.) * 0.6 + sNoise(p * 1.6) * 0.4;
      float pc = min(px, 0.03), fineK = step(px, 0.07);
      // the litter at the stems' feet: the same lying cut blades as the trail, in their three passes, more of the black showing
      vec3 tr = max(trample(p, vec2(0.12, -0.065)), trample(p.yx * 1.31 + 19.7, vec2(-0.085, 0.157)) / 1.31);
      { float dk = smoothstep(0.6, 0.95, m) * smoothstep(150., 190., p.y) * (1. - smoothstep(346., 380., p.y)) * (1. - smoothstep(9., 22., dist)), nk = sNoise(p * 1.1 + 7.) * 0.65 + sNoise(p * 3.7 + 2.) * 0.35;
        // the dark between stems, deep in the walls of the trail: under the near stands the floor is the black can, laid in cut patches (no fade: fewer of them with distance)
        c = mix(uBodyC, uCan[0], clamp((dk * 1.25 - nk) / max(fwidth(nk) + fwidth(dk) * 1.25, 1e-4) + 0.5, 0., 1.)); }
      c = mix(c, uCan[2], clamp((f - 0.6) / max(length(vec2(dFdx(f), dFdy(f))), 1e-4) + 0.5, 0., 1.) * smoothstep(120., 165., p.y));   // (none under the open sea, where the floor is seen between the cards from above)
      c = mix(c, uCan[0], cutDist(tr.z + 0.012, pc, 0.) * fineK);
      c = mix(c, uShadeC, cutDist(tr.y, pc, 0.) * fineK);
      c = mix(c, uBodyC, cutDist(tr.x, pc, 0.) * fineK);
      c = mix(c, sil, smoothstep(13., 34., dist));                       // far off the dark between stems is too fine to cut: one flat straw
    }
  } else if (zone < 1.5) {                                              // the sandbank: white, a straw fade that stops dead at a taped edge
    c = uCan[1];
    float side = dot(p - vec2(40., 486.), vec2(0.42, 0.907));
    float fade = (1. - smoothstep(0., 78., -side)) * step(side, 0.);
    // the straw fade is sweeps of the arm: nine long strokes lying along the tape, each a little ragged at its edges, wide apart on our
    // side and closing up until they are one solid coat at the tape, where they stop dead; the straw can itself, white sand between
    vec2 pr = vec2(dot(p, vec2(0.907, -0.42)), side);
    float tS = clamp(-side / 78., 0., 1.), wS = 9. * pow(tS, 0.62), kS = floor(wS), fS = fract(wS) - 0.5;
    float hk = mix(0.6, 0.13, pow(tS, 0.45)) + (sNoise(vec2(pr.x * 0.33, kS * 7.1)) - 0.5) * 0.2 + (sNoise(vec2(pr.x * 1.9, kS * 3.3 + 2.)) - 0.5) * 0.06;
    hk -= 0.7 * smoothstep(0.6, 0.78, sNoise(vec2(pr.x * 0.021 + kS * 5.3, kS * 1.7)));          // a stroke ends, and is taken up again
    float dS = (hk - abs(fS)) / max(9. * 0.62 * pow(max(tS, 0.004), -0.38) / 78., 1e-3);        // in metres
    c = mix(c, uCan[3], cutDist(dS, px, 0.) * step(side, 0.) * step(-78., side));
    c = mix(c, uCan[3], 0.34 * step(0., side) * (1. - smoothstep(0., 2.6, side)) * smoothstep(0.25, 0.7, sNoise(pr * vec2(0.3, 0.9) + 4.)));   // a ghost of straw mist past the tape
    float rip = stripeCard(vec2(p.x * 0.42 + 0.2 * sin(p.y * 0.4), mod(p.y * 0.42, 3.6) + 0.2), px * 0.42, 0.);
    c = mix(c, uCan[4], rip * step(0.4, sNoise(p * 0.06 + 9.)) * step(px, 0.045));                  // (a mark too fine to cut is left out, never faded)
    // cloud shadows: the cloud card itself, small, a few separate islands sliding downwind (to starboard) in four lanes short of the ring
    float row = floor((p.y - 447.) / 25.); float cxs = (p.x + 3. * uTime) / 62. + row * 0.37; float cid = floor(cxs);
    float hC = sHash(vec2(cid, row) + 3.3), hC2 = sHash(vec2(cid, row) + 8.9);
    vec2 cq = vec2((fract(cxs) - 0.5 - (hC2 - 0.5) * 0.3) * 62., p.y - (447. + (row + 0.5) * 25. + (hC - 0.5) * 7.));
    float cS = 5.2 + 3.2 * hC2;
    float cd = cloudSd(vec2(cq.x * (hC2 > 0.5 ? -1. : 1.), cq.y) / cS) * cS;
    c = mix(c, uCan[4], cutDist(cd, px, 0.) * step(0.5, hC) * step(-0.5, row) * step(row, 3.5));
    vec2 g = p / 0.9; float h = sHash(floor(g) + 7.); vec2 f2 = fract(g) - 0.5 - (vec2(sHash(floor(g) + 11.), sHash(floor(g) + 19.)) - 0.5) * 0.7;
    c = mix(c, h > 0.9 ? uCan[0] : uCan[2], clamp((0.04 + 0.12 * h - length(f2)) * 0.9 / px + 0.5, 0., 1.) * step(0.55, h) * step(px, 0.06));
    // larger marks that still read from 8 m up: long teal ripple slivers with their bridge gaps, and clog dots
    float rip2 = max(rippleAt(p, 3.4, 2.), rippleAt(p * 0.83 + vec2(0.3 * p.y + 1.7 * uTime, 5.), 5.3, 31.) / 0.83);
    c = mix(c, uCan[4], cutDist(rip2, px, 0.) * step(px, 0.3));
    vec2 gB = p / 2.3; vec2 fB = fract(gB) - 0.5; float hB = sHash(floor(gB) + 23.); fB += (vec2(sHash(floor(gB) + 31.), sHash(floor(gB) + 47.)) - 0.5) * 0.85;
    c = mix(c, hB > 0.86 ? uCan[0] : (hB > 0.72 ? uCan[2] : uCan[4]), clamp((0.02 + 0.17 * hB * hB - length(fB * vec2(1., 1. + sHash(floor(gB) + 3.)))) * 2.3 / px + 0.5, 0., 1.) * step(0.6, hB) * step(px, 0.35));
    // orange overspray under the ring: a fan of clog dots on the sand in front of its lower arcs, thinning toward us
    vec2 rp = p - vec2(uRing.x, 565.); float al = -dot(rp, vec2(-0.259, 0.966)), la = dot(rp, vec2(0.966, 0.259));
    float fan = (1. - smoothstep(1., 19., al)) * step(-1.5, al) * (1. - smoothstep(0.5, 1., abs(la) / (5. + 0.6 * max(al, 0.))));
    for (int k = 0; k < 2; k++) { float gs = k == 0 ? 0.62 : 1.7;
      vec2 gF = p / gs + float(k) * 3.7; vec2 iF = floor(gF); float hF = sHash(iF + 61.), hF2 = sHash(iF + 67.);
      vec2 fF = fract(gF) - 0.5 - (vec2(hF2, sHash(iF + 71.)) - 0.5) * 0.6;
      c = mix(c, uCan[2], clamp((0.08 + 0.3 * hF2 * hF2 - length(fF)) * gs / px + 0.5, 0., 1.) * step(1. - fan * 0.92, hF) * step(px, 0.3 * gs)); }
    // our own teal shadow layer sliding over the sand, slid to starboard
    vec2 so = p - uShadow.xy; vec2 sq = vec2(dot(so, uShadow.zw), dot(so, vec2(uShadow.w, -uShadow.z)));      // x along our course, y across
    float sd = max((1. - length(sq / vec2(2.3, 0.5))) * 0.5, (1. - length((sq - vec2(0.3, 0.)) / vec2(0.75, 3.1))) * 0.75);
    c = mix(c, uCan[4], cutDist(min(sd, abs(sq.y - 0.9) - 0.07), px, 0.));
  } else {                                                              // the river: teal, white ripple islands sliding down it, the ring's orange lying broken among them
    c = uCan[4];
    // rows that deepen with the distance out from the near bank, so an island is a few pixels tall from the sand however far out it lies
    float dB = max(p.y - (${Ye.toFixed(1)} - 8.), 0.); float t = log(1. + dB / 15.) * 4.8; float aa = max(fwidth(t), 1e-4);
    float row = floor(t), fy = fract(t) - 0.5, dc = 15. * (exp((row + 0.5) / 4.8) - 1.), wC = 5.5 * (1. + dc / 15.);
    float gx = (p.x + uTime * 2.6 * (0.7 + 0.6 * sHash(vec2(row, 3.)))) / wC + sHash(vec2(row, 9.)) * 7.;
    float ix = floor(gx), fx = fract(gx) - 0.5; float h = sHash(vec2(ix, row) + 13.), h2 = sHash(vec2(ix, row) + 29.), h3 = sHash(vec2(ix, row) + 43.);
    fx += (h2 - 0.5) * 0.3; float hl = 0.2 + 0.2 * h2, e = fx / hl;
    float sd = min((1. - e * e) * 0.3 - abs(fy + (h - 0.5) * 0.2), (abs(e - 0.35) - 0.07) * 0.6);          // a lens with one bridge gap
    // the ring's orange lies broken among them, either side of the line the ring stands on
    float lat = abs(p.x - (uRing.x - 0.268 * (p.y - 565.))), inCol = 1. - smoothstep(14., 52., lat);
    float isl = clamp(sd / aa + 0.5, 0., 1.) * step(0.5 - 0.3 * inCol, h) * (1. - smoothstep(0.22, 0.36, aa));
    c = mix(c, h3 < inCol * 0.8 ? uCan[2] : uCan[1], isl);
  }
  c = mix(c, sil, zone > 1.5 ? smoothstep(420., 720., dist) * 0.5 : smoothstep(300., 520., dist));
  gl_FragColor = vec4(c, 1.);
}`,pt=`
attribute vec4 aCell;                                                   // x, z in the window; two hashes
uniform float uWin, uPass, uWide, uSwell, uReach, uInner; uniform vec3 uSwK; uniform vec4 uSight; uniform vec3 uClump[12];   // x, z, radius of the tall clumps
varying vec2 vQ; varying float vH, vHgt, vDist, vTall, vCard, vHash, vAfter, vSw, vSea;
void main(){
  vec2 cam = cameraPosition.xz;
  vec2 base = aCell.xy + uWin * floor((cam - aCell.xy) / uWin + 0.5);
  // THE CARD STANDS IN ROWS over the open sea: every blade of a 2.4 m stand is sprayed through one flat card, so the near blades stand
  // in the card's plane (a row across the course, each card a little out of line with its neighbour) and their bridge gaps line up
  float rowK = step(uInner, 1.) * (1. - smoothstep(112., 150., base.y));
  vec2 rc = floor(base / 2.4);
  base.y = mix(base.y, (rc.y + 0.5) * 2.4 + (sHash(rc + 2.9) - 0.5) * 2.2 + (fract(aCell.w * 43.3) - 0.5) * 0.24, rowK);   // (each card at its own depth: no alley runs between them)
  float dist = distance(base, cam);
  float reed = smoothstep(346., 410., base.y) * (1. - step(${et.toFixed(1)}, base.y));
  float zone = zoneAt(base);
  // reed clumps on the sand: irregular islands of stems, both fields (so a clump is never cut off where the near window ends)
  float cn = sNoise(base * 0.13 + 3.) * 0.75 + sNoise(base * 0.37 + 11.) * 0.25;
  float clump = step(0.5, zone) * step(zone, 1.5) * max(step(0.69, cn), max(step(distance(base, vec2(54., 462.5)) + 2.2 * cn, 4.6), step(distance(base, vec2(45.5, 473.5)) + 2.2 * cn, 3.6))) * step(fract(aCell.w * 7.31), 0.62) * step(24., distance(base, vec2(40., 565.)));
  float tallC = 0.;                                                      // tall clumps: full stands left beside the path, so there is always something near under the nose
  for (int i = 0; i < 12; i++) tallC = max(tallC, step(distance(base, uClump[i].xy) + 1.6 * (cn - 0.5), uClump[i].z));
  tallC *= step(zone, 1.5);
  vec3 mk = maskRGB(base);
  float stand = step(fract(aCell.w * 13.7) * 0.9 + 0.05, mk.r);
  float low = (1. - stand) * step(fract(aCell.w * 91.7), mk.b) * step(uInner, 1.);        // trampled: a blade broken and lying, not gone
  float wideS = stand * step(fract(aCell.w * 29.3), mk.g);                                 // the curtain's wide stems
  float keep = max(stand, low) * max(step(zone, 0.5) * step(reed * 0.86, fract(aCell.w * 7.31)), max(clump, tallC));
  keep *= (1. - smoothstep(uReach * 0.8, uReach, dist)) * smoothstep(uInner * 0.6, uInner, dist);
  float hgt = mix(3.2, 4.0, aCell.z) * mix(mix(1., 0.42, max(reed, clump)), 0.84 + 0.12 * fract(aCell.w * 3.3), tallC) * mix(1., 0.04 + 0.13 * fract(aCell.w * 53.9), low);
  float sw = sin(dot(base, uSwK.xy) - uTime * uSwK.z) * 0.5 + 0.5;                // swells rolling through at 6 m/s, slantwise across the course
  float sw2 = sin(dot(base, vec2(-0.21, 0.13)) - uTime * 1.3 + aCell.w * 3.);
  // over the open sea the swell is tall enough to see from just above the plumes: a crest hides the trough behind it, a trough opens the
  // dark feet of the stems (the straw pass thins there, so the teal and the black show); in the trail the walls stand even
  float seaK = 1. - smoothstep(118., 170., base.y);   // 1 over the open sea
  float swA = 0.1 + 0.14 * (1. - smoothstep(118., 170., base.y) * (1. - smoothstep(350., 410., base.y))) + 0.1 * seaK * smoothstep(8., 24., dist);
  hgt *= 1. - swA + swA * sw; vSw = sw;
  if (uPass > 0.5 && uPass < 1.5) keep *= step((1. - sw) * 0.6 * smoothstep(mix(14., 5., seaK), mix(34., 14., seaK), dist) * step(0.2, swA), fract(aCell.w * 61.7));
  // a broken blade lies along the swirl it was trodden in, its face turned up
  float la = 6.283 * sNoise(base * 0.19 + 5.) + (fract(aCell.w * 17.3) - 0.5) * 1.5; vec2 ld = vec2(cos(la), sin(la));
  float yaw = mix((aCell.w - 0.5) * 1.9 * (1. - 0.6 * rowK), la + 1.5708 + (fract(aCell.w * 37.1) - 0.5) * 1.3, low); vec2 ax = vec2(cos(yaw), sin(yaw));
  float nearF = step(uInner, 1.);
  // down in the trail a card seen along its own face is a scratch the height of the frame: within 7 m of the lens the hand turns each
  // standing stem until at least 55 degrees of its face is toward us (as the egrets, the deer and the tiger's cards are turned)
  float inTrail = nearF * (1. - smoothstep(2.4, 3.6, cameraPosition.y)) * (1. - low);
  { vec2 aw = (base - cam) / max(dist, 1e-3), sq = vec2(-aw.y, aw.x); float sgn = dot(ax, sq) < 0. ? -1. : 1.;
    float al = dot(ax, aw), lim = 0.574;                                 // cos 55 degrees: how far the face may lie along the line of sight
    vec2 ax2 = mix(ax, aw * (al < 0. ? -lim : lim) + sq * sgn * 0.819, step(lim, abs(al)) * inTrail * (1. - smoothstep(5., 9., dist)));
    ax = ax2 / max(length(ax2), 1e-3); }
  // (the cut is coarser with distance, so a sliver and the gap beside it stay two pixels and more as far as the near field reaches)
  // (at the lens a stem is still a blade, never a slab: the curtain's wide stems and the widened black pass come down to a blade's width inside 3 m)
  float farK = mix(1., smoothstep(1.8, 4.5, dist), inTrail);
  float wide = uWide * (0.75 + 0.5 * aCell.z) * (uPass > 1.5 ? 1. + 0.9 * farK : 1.) * (1. + dist * mix(0.012, 0.026, nearF)) * (1. + 0.95 * wideS * farK + 0.15 * low);
  // distance is paint thinning: black gone by 150 m, teal by 300 m. Every field keeps its three passes until then
  // (a pass is there or it is not: each blade drops it at its own distance, so the last strip under the horizon is flat bands, not speckle)
  // (over the open sea the lens is a metre above the plumes and 150 m is three pixels under the horizon: there the same rule is told
  // nearer, so the three bands can be seen: black between the near blades, white and teal on straw beyond, straw alone to the horizon)
  if (uPass > 1.5) keep *= step(dist, mix(uThin.x, 26., seaK) * (0.55 + 0.45 * fract(aCell.w * 5.71)));
  else if (uPass < 0.5) keep *= step(dist, mix(uThin.y, 80., seaK) * (0.7 + 0.3 * fract(aCell.w * 5.71)));
  // S3: paint arrives. Downwind of each drifting band of mist the stand is still unfinished (teal and straw only, the plumes and the black
  // not yet sprayed); under the band they land, and upwind of it the grass is crisp. vAfter = metres upwind of the band line (0..uMist.x)
  float aftM = fract(1. - mistCoord(vec3(base.x, 0., base.y)) + 0.82) * uMist.x;
  vec2 away = (base - cam) / max(dist, 1e-3);
  float push = 1. - smoothstep(0.6, 2.8, dist);                         // blades lean out of the lens
  keep *= smoothstep(mix(0.7, 1.15, inTrail), mix(1.2, 1.85, inTrail), dist);
  // while she is out, no stem at the lens stands across her: the cone from the lens to her length is kept clear to 5 m (further stems are slivers she is seen through)
  { vec2 sd = uSight.xy - cam; float sl = max(length(sd), 1e-3); vec2 sn = sd / sl; float tp = clamp(dot(base - cam, sn), 0., sl), rr = 0.3 + 2.5 * tp / sl;
    keep *= 1. - uSight.z * inTrail * (1. - smoothstep(rr * 0.75, rr * 1.15, distance(base, cam + sn * tp))) * (1. - smoothstep(5., 8., dist)); }
  vec2 lean = (mix(vec2(0.35, 0.75), vec2(-0.95, -0.3), step(1.5, uSwell) * seaK) * (0.25 + 0.75 * sw) * uSwell + vec2(0.1, 0.05) * sw2 * uSwell) * hgt * 0.22 + away * push * 2.2 * (1. - 0.8 * low);
  lean += ld * low * (0.9 + 1.3 * fract(aCell.w * 71.3));
  float back = uPass < 0.5 ? 0.12 : (uPass > 1.5 ? 0.24 : 0.);
  vec3 wp = vec3(base.x, 0., base.y);
  // each pass hangs behind the one before, off the blade's own face (a pass slid along the blade's plane would lie in it and flicker)
  vec2 nrm = vec2(-ax.y, ax.x); nrm *= dot(nrm, away) < 0. ? -1. : 1.;
  wp.xz += ax * position.x * wide + (away * 0.6 + nrm * 0.5) * back + lean * position.y * position.y;
  wp.y = position.y * hgt * keep + low * (uPass < 0.5 ? 0.01 : (uPass > 1.5 ? 0.045 : 0.08));   // lying blades: the three passes a thumb apart, straw on top
  // the teal pass is the same cut slid to starboard; far off it is slid a whole blade's width, so it is a mark of its own and not a 1 px fringe
  if (uPass < 0.5) wp += vec3(uSlide.x - 0.42 * wide * (1. - nearF) * smoothstep(30., 90., dist), uSlide.y * position.y * (1. - low), 0.);
  // card slip: now and then a whole stand is sprayed again a hand to one side; the passes follow in spraying order
  vec2 cid = floor(base / 2.4); float hs = sHash(cid + 7.3); float per = 6. + 3. * fract(hs * 61.);
  float phs = uTime / per + hs * 37.; float ns = floor(phs);
  float since = (phs - ns) * per - (uPass < 0.5 ? 0. : (uPass > 1.5 ? 0.8 : 0.35));
  wp.x += 0.17 * step(hs, 0.035) * mix(mod(ns + 1., 2.), mod(ns, 2.), smoothstep(0., 0.14, since));
  vAfter = mix(30., aftM, mix(1., smoothstep(6., 34., abs(base.x)), seaK)); vSea = seaK;
  vQ = vec2(position.x, position.y); vH = position.y * hgt; vHgt = hgt; vDist = dist; vTall = low > 0.5 ? -1. : aCell.z; vHash = aCell.w;
  vCard = sHash(vec2(floor(base.x / 2.4) + floor(base.y / 2.4) * 7., 3.7));   // hashed here: a hash taken per pixel from an interpolated id is noise
  gl_Position = keep < 0.03 ? vec4(0., 0., -3., 1.) : projectionMatrix * viewMatrix * vec4(wp, 1.);   // a blade the mask removed is not drawn at all
}`,ut=`
uniform float uPass; uniform vec3 uBodyC, uShadeC, uPlumeC;
varying vec2 vQ; varying float vH, vHgt, vDist, vTall, vCard, vHash, vAfter, vSw, vSea;
void main(){
  float v = vQ.y; float side = vHash > 0.5 ? 1. : -1.;
  float cx = side * (0.30 * v * v - 0.12);                              // a bent, tapering sliver
  float pxQ = max(fwidth(vQ.x), 1e-5), pxH = max(fwidth(vH), 1e-5);     // one pixel, in quad widths and in metres of height
  float low = step(vTall, -0.5);
  float hw = 0.19 * (1. - 0.86 * v * v * v) * smoothstep(0., 0.03, v);
  if (uPass > 1.5) { if (hw < 0.8 * pxQ) discard; }                     // the black pass shows as islands 2 px wide or not at all
  else { if (pxQ > 0.14 && vDist < 15. && low < 0.5) discard;           // near the lens a blade seen along its face is left out (no scratch the height of the frame)
    hw = max(hw, min(0.75 * pxQ, 0.19) * smoothstep(0., 0.03, v)); }    // a sliver never thins below 1.5 px
  // seed heads: a quarter of the blades near the lens; further out they crowd on the swell crests and leave the troughs bare
  float plumeV = 0.84; float plume = step(mix(0.76, mix(0.95, 0.4, vSw), smoothstep(mix(14., 4., vSea), mix(34., 12., vSea), vDist)), vTall) * step(uPass, 1.5) * step(0.5, uPass) * step(vDist, mix(120., 55., vSea) + mix(60., 30., vSea) * fract(vHash * 31.));
  vec3 c = uPass < 0.5 ? uShadeC : (uPass > 1.5 ? uCan[0] : uBodyC);
  float order = uPass < 0.5 ? 0. : (uPass > 1.5 ? 3. : 1.);
  if (plume > 0.5 && v > plumeV) { order = 2.;                                      // seed head: a white island past its own bridge gap
    float t = (v - plumeV) / (1. - plumeV);
    hw = 0.21 * sqrt(max(sin(3.14159 * clamp(t * 1.04 - 0.04, 0., 1.)), 0.)) * step(0.2, t); c = uPlumeC;
  }
  // bridge gaps at heights shared by the whole card: a clean cut 11 cm tall on the blades near enough to show it (3 px or more), absent beyond
  float cardQ = floor(vCard * 255. + 0.5), hc = cardQ / 255.;
  // (three bridges to a card: one low, and two under the plumes where the card is seen from above; each at one height for the whole card)
  float g1 = 1.15 + 0.35 * hc, g2 = 2.80 + 0.22 * hc, g3 = g2 - 0.56; if (hc < 0.07) { g1 = vHgt - g1; g2 = vHgt - g2; g3 = vHgt - g3; }
  if (low > 0.5) { g1 = vHgt * (0.36 + 0.2 * fract(vHash * 23.)); g2 = -9.; g3 = -9.; }   // a lying blade keeps one bridge
  float gw = (low > 0.5 ? 0.02 + 0.06 * vHgt : 0.055) * step(vDist * (0.85 + 0.3 * fract(vHash * 47.)), 13.);
  // (the upper one, just under the plumes, is cut wider with distance and kept to 30 m: from above it is the banding of the card)
  float gw2 = low > 0.5 ? gw : clamp(2.1 * pxH, 0.05, 0.15) * step(vDist * (0.9 + 0.2 * fract(vHash * 47.)), 24.);
  // a blade is islands joined by bridges: each stretch of it narrows toward the bridge that parts it from the next, so no piece is a block
  if (uPass < 1.5 && low < 0.5 && !(plume > 0.5 && v > plumeV)) {
    float dG = min(gw > 0. ? abs(vH - g1) - gw : 9., gw2 > 0. ? min(abs(vH - g2) - gw2, abs(vH - g3) - gw2 * 0.85) : 9.);
    hw *= mix(0.42, 1., smoothstep(0., 0.3, dG));
  }
  if (uPass > 1.5) {                                                    // black: each island a sliver tapering to both its ends, never a block
    float sg = vH / max(0.62 + 0.5 * fract(vHash * 13.), 0.2) * mix(1., 4., low) + vHash * 9.;
    float foot = (1. - smoothstep(0.7, 1.5, vH)) * (1. - low);          // the dark between stems: at the foot of a stand the black is one sliver, wider, not islands
    hw *= mix(0.14 + 0.86 * sqrt(max(sin(3.14159 * clamp((fract(sg) - 0.28) / 0.72, 0., 1.)), 0.)), 1.5, foot);
  }
  if (hw - abs(vQ.x - cx) < 0.) discard;
  // paint arrives: beyond the mist distance a stand is made pass by pass behind each drifting band
  // (the plumes and the black are missing from 11 m downwind of the band line to 5 m upwind of it; each blade at its own edge of that strip)
  float jm = (fract(vHash * 71.3) - 0.5) * 3.;
  if (order > 1.5 && (vAfter + jm < (order > 2.5 ? 5. : 3.) || vAfter + jm > uMist.x - (order > 2.5 ? 11. : 9.)) && vDist > uMist.y * (1. - vSea)) discard;                         // (over the sea the lane runs right under the lens: no ring of finished blades travels with us)
  if (abs(vH - g1) < gw || abs(vH - g2) < gw2 || abs(vH - g3) < gw2 * 0.85) discard;
  if (uPass > 1.5) {                                                    // black: stripe islands, never closing
    float seg = vH / max(0.62 + 0.5 * fract(vHash * 13.), 0.2) * mix(1., 4., low) + vHash * 9.;
    if ((fract(seg) < 0.28 || sHash(vec2(floor(seg), cardQ)) < 0.3) && vH > 1.1 - low) discard;
  }
  vec3 sil = uBodyC * vec3(0.93, 0.88, 0.80);
  c = mix(c, sil, smoothstep(mix(uThin.y, 70., vSea), mix(uThin.z, 130., vSea), vDist) * step(0.5, uPass));
  gl_FragColor = vec4(c, 1.);
}`;async function mt(p,R,ge,X,fe){const B=p.quality?.detail??1,we=p.rng.fork?p.rng.fork("grass"):p.rng,k=new x.PlaneGeometry(1,1);k.translate(0,.5,0);const D=[{n:Math.round(25880*(.6+.4*B)),win:76,wide:.3,reach:38,inner:0,passes:[2,0,1]},{n:Math.round(4e4*B),win:560,wide:1.5,reach:280,inner:30,passes:[2,0,1]}],ie=[],re=[];for(const H of D){const b=new Float32Array(H.n*4);for(let V=0;V<H.n;V++)b[V*4]=we()*H.win,b[V*4+1]=we()*H.win,b[V*4+2]=we(),b[V*4+3]=we(),V%3e3===2999&&await p.yield();const ce=new x.InstancedBufferGeometry;ce.index=k.index,ce.setAttribute("position",k.getAttribute("position")),ce.setAttribute("aCell",new x.InstancedBufferAttribute(b,4)),ce.instanceCount=H.n;for(const V of H.passes){const Q=new x.ShaderMaterial({uniforms:{...R.uniforms,...ge,uWin:{value:H.win},uPass:{value:V},uWide:{value:H.wide},uSwell:{value:X.swell},uSwK:{value:X.swk},uReach:{value:H.reach},uInner:{value:H.inner},uClump:{value:bt},uBodyC:{value:X.bodyC},uShadeC:{value:X.shadeC},uPlumeC:{value:X.plumeC}},vertexShader:Qe+tt+pt,fragmentShader:Qe+ut,side:x.DoubleSide}),l=new x.Mesh(ce,Q);l.frustumCulled=!1,l.renderOrder=V===1?2:V,fe.add(l),ie.push(Q),re.push(l)}await p.yield()}return{mats:ie,meshes:re,quad:k}}const vt=`
attribute vec4 aPos;                                                    // xyz, heading
attribute vec4 aDef;                                                    // width, height, kind, flap or pitch angle
attribute vec4 aAnim;                                                   // phase, visibility, pass or can, wing side (0 = body card)
varying vec2 vQ; varying vec4 vI; varying float vDist, vAfter;
void main(){
  float h = aPos.w; vAfter = fract(1. - mistCoord(aPos.xyz) + 0.82); vec3 fwd = vec3(sin(h), 0., cos(h)), right = vec3(cos(h), 0., -sin(h)), up = vec3(0., 1., 0.); vec3 wp;
  if (abs(aAnim.w) > 0.5) {
    vec3 span = right * cos(aDef.w) * aAnim.w + up * sin(aDef.w);
    wp = aPos.xyz + span * (position.x + 0.5) * aDef.x + fwd * position.y * aDef.y;
  } else {
    float c = cos(aDef.w), s = sin(aDef.w); vec2 q = vec2(position.x * aDef.x, position.y * aDef.y);
    q = vec2(c * q.x - s * q.y, s * q.x + c * q.y); wp = aPos.xyz + fwd * q.x + up * q.y;
  }
  wp = mix(aPos.xyz, wp, aAnim.y);
  vQ = position.xy; vI = vec4(aDef.z, aAnim.z, aAnim.x, aAnim.w); vDist = distance(wp, cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`,xt=`
uniform vec2 uRingIn; uniform vec3 uBodyC;
varying vec2 vQ; varying vec4 vI; varying float vDist, vAfter;
float seg(vec2 p, vec2 a, vec2 b, float r){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.); return r - length(pa - ba * h); }
float ell(vec2 p, vec2 c, vec2 r){ return (1. - length((p - c) / r)) * min(r.x, r.y); }
float tap(vec2 p, vec2 a, vec2 b, float r0, float r1){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.); return mix(r0, r1, h) - length(pa - ba * h); }
vec2 rot2(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(c * p.x + s * p.y, c * p.y - s * p.x); }
// the drongo, as the cutter drew it: side-on, nose to +x. Body and head one island, a hooked beak, the eye left as a hole with a bridge across
// it, the wing a separate island parted from the body by a gap (lift 0 folded .. 1 raised for balance), two long tail feathers curving apart
float drongoSd(vec2 q, float lift){
  float body = max(ell(rot2(q - vec2(0.05, 0.02), 0.62), vec2(0.), vec2(0.185, 0.105)), ell(q, vec2(0.2, 0.17), vec2(0.088, 0.08)));
  body = max(body, tap(q, vec2(0.265, 0.185), vec2(0.365, 0.155), 0.03, 0.006));                       // the beak
  body = max(body, tap(q, vec2(0.36, 0.158), vec2(0.368, 0.128), 0.009, 0.004));                       // and its hook
  vec2 e = q - vec2(0.225, 0.19); body = min(body, max(length(e) - 0.03, 0.0075 - abs(e.y + e.x * 0.3)));   // the eye: a hole, held by one bridge
  vec2 wq = rot2(q - vec2(0.115, 0.085), mix(0.7, -1.0, lift));                                        // the wing hinges at the shoulder
  float wing = min(0.062 * (1. - wq.x * wq.x / 0.105) - abs(wq.y + 0.05 * wq.x), 0.02 - wq.x) ;
  wing = wq.x > -0.33 ? min(wing, wq.x + 0.33) : -1.;
  body = min(body, 0.022 - wing);                                                                      // the gap that parts it from the body
  float spread = 0.05 * lift;
  float t1 = max(tap(q, vec2(-0.06, -0.06), vec2(-0.25, -0.24 + spread), 0.036, 0.026), tap(q, vec2(-0.25, -0.24 + spread), vec2(-0.455, -0.33 + 2. * spread), 0.026, 0.007));
  float t2 = max(tap(q, vec2(-0.04, -0.08), vec2(-0.19, -0.29 - spread), 0.034, 0.025), tap(q, vec2(-0.19, -0.29 - spread), vec2(-0.265, -0.475 - spread), 0.025, 0.007));
  float feet = max(tap(q, vec2(0.075, -0.07), vec2(0.085, -0.165), 0.012, 0.008), tap(q, vec2(0.125, -0.06), vec2(0.118, -0.165), 0.012, 0.008));
  return max(max(body, wing), max(max(t1, t2), feet));
}
// the stem it rides: one tall cut blade bent over in an arc under the bird, broken by a bridge gap, its plume island hanging past the tip
float stemSd(vec2 q, out float plume){
  float yy = clamp((q.y + 0.5) / 0.9, 0., 1.); float cx = -0.32 + 0.5 * yy * yy * yy, sl = 1.667 * yy * yy;
  float d = (0.0115 - 0.0055 * yy) * sqrt(1. + sl * sl) - abs(q.x - cx);
  d = min(d, min(0.4 - q.y, q.y + 0.5)); d = min(d, abs(q.y + 0.07) - 0.011);
  vec2 pq = rot2(q - vec2(0.262, 0.378), -0.5);
  plume = min(0.021 * sqrt(max(1. - pq.x * pq.x / 0.0049, 0.)) - abs(pq.y), 0.07 - abs(pq.x));
  return max(d, plume);
}
float treeSil(vec2 q){
  float d = seg(q, vec2(0., -0.5), vec2(0., 0.02), 0.03 + 0.07 * smoothstep(-0.3, -0.5, q.y));
  vec2 a = vec2(abs(q.x), q.y);
  d = max(d, seg(a, vec2(0., -0.08), vec2(0.33, 0.1), 0.014)); d = max(d, seg(a, vec2(0., 0.0), vec2(0.23, 0.29), 0.013));
  d = max(d, seg(q, vec2(0., 0.0), vec2(0.05, 0.4), 0.012)); d = max(d, seg(a, vec2(0.16, 0.01), vec2(0.42, 0.2), 0.009));
  return d;
}
float treeCrown(vec2 q){
  float d = max(ell(q, vec2(0., 0.3), vec2(0.3, 0.13)), max(ell(q, vec2(-0.27, 0.15), vec2(0.2, 0.1)), ell(q, vec2(0.28, 0.17), vec2(0.19, 0.1))));
  return min(d, 0.5 * (abs(fract(q.x / 0.15 + 0.2) - 0.5) - 0.06) * 0.15);
}
void main(){
  vec2 q = vQ; float kind = vI.x, pass = vI.y, ph = vI.z; float px = max(length(fwidth(q)) * 0.7, 1e-5);
  float d = -1.; int can = int(pass + 0.5); bool thin = true; vec3 col = vec3(-1.);
  if (kind < 0.5) {                                                     // egret or tern body
    d = max(ell(q, vec2(-0.06, 0.), vec2(0.27, 0.12)), seg(q, vec2(0.14, 0.03), vec2(0.33, 0.2), 0.035));
    d = max(d, max(ell(q, vec2(0.36, 0.21), vec2(0.06, 0.045)), seg(q, vec2(0.4, 0.21), vec2(0.5, 0.19), 0.014)));
    d = max(d, seg(q, vec2(-0.25, -0.03), vec2(-0.5, -0.1), 0.012));
    if (ph > 0.5) {                                                     // standing on a crest: neck up, beak level, two legs
      d = max(ell(q, vec2(-0.02, -0.02), vec2(0.2, 0.105)), tap(q, vec2(0.11, 0.02), vec2(0.165, 0.3), 0.042, 0.03));
      d = max(d, max(ell(q, vec2(0.2, 0.33), vec2(0.06, 0.042)), tap(q, vec2(0.24, 0.335), vec2(0.38, 0.31), 0.018, 0.004)));
      d = max(d, max(tap(q, vec2(-0.03, -0.1), vec2(-0.04, -0.47), 0.022, 0.016), tap(q, vec2(0.05, -0.1), vec2(0.075, -0.47), 0.022, 0.016)));
      d = max(d, tap(q, vec2(-0.16, -0.03), vec2(-0.36, -0.13), 0.04, 0.008));
    }
  } else if (kind < 1.5) {                                              // a hinged wing card
    float xs = q.x + 0.5; d = min(0.44 * (1. - xs * xs) - abs(q.y + 0.25 * xs * xs), 0.5 - abs(xs - 0.5)) * 0.5;
    d = min(d, (abs(xs - 0.3) - 0.03) * 0.5);
  } else if (kind < 2.5) {                                              // dragonfly body
    // (the cutter's dragonfly, laid flat on its card: a head, a thorax, a long thin abdomen in four pieces held by bridges)
    d = max(max(ell(q, vec2(0.14, 0.), vec2(0.115, 0.058)), ell(q, vec2(0.295, 0.), vec2(0.052, 0.05))), min(tap(q, vec2(0.04, 0.), vec2(-0.47, 0.), 0.046, 0.022), (abs(fract(q.x / 0.13 + 0.2) - 0.5) - 0.07) * 0.13));
  } else if (kind < 3.5) {                                              // dragonfly wing island
    d = ell(q, vec2(0.04, 0.), vec2(0.46, 0.2 - 0.09 * smoothstep(0.1, -0.5, q.x)));
    if (ph > 0.5) { vec2 a = vec2(q.x, abs(q.y));                        // the four wings on one card: two pairs of long islands, parted from the body by a gap
      d = max(ell(rot2(a - vec2(0.2, 0.225), 1.3), vec2(0.), vec2(0.17, 0.044)), ell(rot2(a - vec2(0.06, 0.21), 1.95), vec2(0.), vec2(0.16, 0.054)));
      d = min(d, a.y - 0.072); }
  } else if (kind < 4.5) {                                              // spotted deer: orange body, white islands, black legs eye antlers
    // (as the cutter drew it: deep chest, tucked belly, round rump, a long neck carried up, a small head with one ear)
    float torso = max(max(ell(q, vec2(0.11, 0.065), vec2(0.15, 0.1)), ell(q, vec2(-0.17, 0.07), vec2(0.13, 0.095))), ell(q, vec2(-0.03, 0.075), vec2(0.2, 0.075)));
    if (pass < 0.5) { d = max(torso, max(tap(q, vec2(0.2, 0.1), vec2(0.315, 0.31), 0.052, 0.03), ell(rot2(q - vec2(0.36, 0.335), -0.25), vec2(0.), vec2(0.07, 0.036))));
      d = max(d, tap(q, vec2(0.31, 0.355), vec2(0.262, 0.428), 0.02, 0.007)); can = 2; }
    else if (pass < 1.5) {                                              // white: two rows of spot islands along the back, the belly, the scut
      vec2 g = vec2(q.x / 0.075 + 0.5 * floor(q.y / 0.055), q.y / 0.055); vec2 f = fract(g) - 0.5; float hh = sHash(floor(g) + 3.);
      d = (hh > 0.3 && q.y > 0.055 && q.y < 0.165) ? min((0.27 - length(f * vec2(1., 0.75) + (hh - 0.5) * 0.2)) * 0.055, torso - 0.018) : -1.;
      d = max(d, max(ell(q, vec2(0.0, -0.005), vec2(0.19, 0.022)), tap(q, vec2(-0.28, 0.1), vec2(-0.335, 0.165), 0.02, 0.012))); can = 1;
    } else {
      for (int i = 0; i < 4; i++) {
        float fi = float(i); vec2 hip = vec2(i < 2 ? 0.17 : -0.2, -0.02);
        float a = 0.68 * sin(ph + (i < 2 ? 0. : 3.14159) + mod(fi, 2.) * 0.7) + (i < 2 ? 0.25 : -0.25);
        vec2 knee = hip + 0.2 * vec2(sin(a), -cos(a)); vec2 foot = knee + 0.22 * vec2(sin(a * 0.4), -cos(a * 0.4));
        d = max(d, max(tap(q, hip, knee, 0.028, 0.019), seg(q, knee + (foot - knee) * 0.12, foot, 0.016)));
      }
      d = max(d, max(ell(q, vec2(0.368, 0.345), vec2(0.014, 0.014)), ell(q, vec2(0.424, 0.317), vec2(0.016, 0.014))));              // eye, nose
      d = max(d, max(seg(q, vec2(0.34, 0.37), vec2(0.305, 0.5), 0.0095), max(seg(q, vec2(0.322, 0.435), vec2(0.39, 0.495), 0.0085), seg(q, vec2(0.31, 0.47), vec2(0.265, 0.515), 0.008)))); can = 0;   // the antler, three tines
    }
  } else if (kind < 5.5) {                                              // peafowl: teal body, straw train, black barring
    float t = clamp((0.12 - q.x) / 0.62, 0., 1.); float cy = 0.035 * sin(q.x * 15. + ph) * t;
    float train = min(0.012 + 0.085 * sin(3.14159 * sqrt(t)) - abs(q.y - cy), 0.12 - q.x);
    if (pass < 0.5) { d = max(ell(q, vec2(0.2, 0.), vec2(0.125, 0.078)), max(tap(q, vec2(0.27, 0.03), vec2(0.38, 0.225), 0.034, 0.017), ell(q, vec2(0.398, 0.245), vec2(0.042, 0.03))));
      d = max(d, tap(q, vec2(0.43, 0.247), vec2(0.485, 0.232), 0.013, 0.003));                                   // the beak
      d = max(d, max(tap(q, vec2(0.392, 0.27), vec2(0.365, 0.35), 0.006, 0.017), max(tap(q, vec2(0.4, 0.272), vec2(0.405, 0.365), 0.006, 0.017), tap(q, vec2(0.408, 0.27), vec2(0.445, 0.35), 0.006, 0.017))));   // the crest: three quills, club-ended
      can = 4; }
    else if (pass < 1.5) { d = train; can = 3; }
    else { d = max(min(train - 0.012, (0.3 - abs(fract(t * 9.) - 0.5)) * 0.03), ell(q, vec2(0.41, 0.25), vec2(0.011, 0.011))); can = 0; }
  } else if (kind < 7.5) {                                              // drongo: one cut black card (and its teal copy slid to starboard)
    d = drongoSd(q, ph); thin = false;
  } else if (kind > 10.5) {                                             // the bent stem a drongo rides: straw sliver, white plume island
    float pl; d = stemSd(q, pl); can = pass > 3.5 ? 4 : (pl >= d - 1e-5 ? 1 : 3); thin = false;
  } else if (kind < 8.5) {                                              // silk-cotton tree: teal shadow, straw light, black limb islands, orange flower dots
    float own = step(1.5, ph);                                           // (2 + flip: the tree by the course, whose passes update() lays whole)
    vec2 tq = vec2(q.x * (ph - 2. * own > 0.5 ? -1. : 1.), q.y); float sil = treeSil(tq), crown = treeCrown(tq);
    if (pass < 0.5) { d = max(sil, crown); can = 4; }
    else if (pass < 1.5) { d = vDist > 300. ? max(sil, crown) : max(sil - 0.006, crown - 0.03); can = 3; }
    else if (pass < 2.5) { d = min(treeSil(tq + vec2(0.012, 0.)), (abs(fract(tq.y * 9. + tq.x * 4.) - 0.5) - 0.13) * 0.05); can = 0; }
    else { vec2 g = tq / 0.06 + vec2(0., 0.5 * floor(tq.x / 0.06)); vec2 f = fract(g) - 0.5; float hh = sHash(floor(g) + 9.);   // (every other column half a step up: no ruled grid)
      f += (vec2(sHash(floor(g) + 3.), sHash(floor(g) + 5.)) - 0.5) * 0.14;
      d = min((clamp(2.7 * px / 0.06, 0.34, 0.46) - length(f)) * 0.06, crown + 0.03) * step(0.45, hh) - step(hh, 0.45) - step(0.021, px); can = 2; }
    float order = pass < 0.5 ? 0. : (pass < 1.5 ? 1. : (pass < 2.5 ? 3. : 2.));          // still being made behind each mist band
    float made = smoothstep(0.02 + 0.13 * order, 0.05 + 0.13 * order, vAfter) * (1. - smoothstep(0.93, 0.99, vAfter));
    if (own < 0.5 && mix(1., made, smoothstep(uMist.y * 0.7, uMist.y, vDist)) < 0.5) d = -1.;
  } else if (kind > 9.5) {                                              // driftwood snag: a bleached trunk lying on the sand, cut in islands
    thin = false; vec2 a = vec2(q.x * (ph > 0.5 ? -1. : 1.), q.y);
    float w = max(seg(a, vec2(-0.46, -0.14), vec2(0.2, -0.06), 0.045 + 0.03 * smoothstep(0.1, -0.46, a.x)), seg(a, vec2(0.2, -0.06), vec2(0.47, 0.1), 0.026));
    w = max(w, max(seg(a, vec2(-0.12, -0.08), vec2(-0.02, 0.24), 0.022), seg(a, vec2(-0.02, 0.24), vec2(0.1, 0.34), 0.012)));
    w = max(w, max(seg(a, vec2(0.12, -0.06), vec2(0.27, 0.19), 0.017), seg(a, vec2(-0.34, -0.12), vec2(-0.43, 0.06), 0.02)));
    float br = (abs(fract(a.x / 0.21 + 0.37) - 0.5) - 0.045) * 0.21;                      // the bridges that hold the card together
    if (pass < 0.5) { d = w; can = 4; }
    else if (pass < 1.5) { d = min(w, br); can = 0; }
    else { d = min(seg(a - vec2(0., 0.024), vec2(-0.44, -0.14), vec2(0.2, -0.06), 0.017), br); can = 1; }   // light along its sunward edge
  } else {                                                              // the ring: one great card, four arcs held by four bridges
    vec2 m = q * 26.; float r = length(m); thin = false;
    float kf = smoothstep(250., 600., vDist);
    float arcs = min(min(r - 7.6 + 3.4 * kf, 9.4 + 3.3 * kf - r), min(abs(m.x - m.y), abs(m.x + m.y)) * 0.7071 - 0.55 - 1.5 * kf);
    float n = sNoise(m * 0.45 + 3.);
    if (pass < 0.5) { d = arcs; can = 4; }
    else if (pass < 1.5) { d = arcs; can = 2; }
    else if (pass < 2.5) { d = min(arcs, min(0.26 - abs(r - 8.05), m.x * 0.6 + m.y - 1.5)); if (n > uRingIn.x) d = -1.; can = 1; }
    else { d = min(arcs, min(0.24 - abs(r - 9.0), (abs(fract((m.x - m.y) * 0.32) - 0.5) - 0.16) * 2.)); d = min(d, 2. - m.x * 0.6 - m.y); if (n > uRingIn.y) d = -1.; can = 0; }
    d /= 26.;
  }
  if (d / px + 0.5 < 0.5) discard;
  vec4 c = canAt(can, thin ? vDist : 0.);
  if (c.a < 0.5) discard;
  gl_FragColor = vec4(can == 3 ? mix(uBodyC, c.rgb, step(300., vDist)) : c.rgb, 1.);
}`,ke=p=>{const R=Math.sin(p*127.1+3.7)*43758.5453;return R-Math.floor(R)},wt=[0,22e-5,45e-5],at=[0,.12,.25],_e=(p,R)=>ke(p)*(1-R)+ke(p+3.1)*R-.5,A=(p,R,ge)=>{const X=Math.min(1,Math.max(0,(ge-p)/(R-p)));return X*X*(3-2*X)};async function gt(p,R,ge,X,fe,B,we){const k=p.rng.fork?p.rng.fork("cast"):p.rng,D=Math.min(1.3,Math.max(.7,p.vary?.density??1)),ie=1200,re=new Float32Array(ie*4),H=new Float32Array(ie*4),b=new Float32Array(ie*4);let ce=0;const V=X.length,Q=ge.swk,l=(t,c,i,h,_=0,e=0)=>{const u=ce++;return H.set([c,i,t,0],u*4),b.set([e,1,h,_],u*4),u},le=(t,c,i,h,_)=>{re[t*4]=c,re[t*4+1]=i,re[t*4+2]=h,re[t*4+3]=_},S=new x.Vector3,K=new x.Vector3,J=p.seed%9973*.731,ee=t=>ke(J+t*1.7)-.5,De=[[-42+20*ee(1),24+20*ee(2),25+6*ee(3)],[75+36*ee(4),116+30*ee(5),23+6*ee(6)],[-17-5*ke(J+9.1),141+12*ee(8),27+4*ee(9)]],N=Math.round(8*D),Y=[],Ie={due:0};for(let t=0;t<N;t++){const c=k.range(140,620)*(k()<.5?-1:1),i=k()<.75?k.range(-110,420):k.range(790,1150);De.push([c,i,k.range(18,26)])}De.forEach(([t,c,i],h)=>{const _=i/.93,e=Math.atan2(c-(h<3?-40:150),-t),u=Math.cos(e),v=-Math.sin(e),g=1,y=h<3?ke(J+h*3.3+.4)<.5?0:1:h%2;for(let d=0;d<4;d++){const M=(d-1)*.5*g,W=l(8,_,_,d,0,y+(h===2||h===0?2:0));h===2&&Y.push(W),le(W,t+u*M+(d===0?-1.3:0),_/2-.02*_+(d===0?-.7:0),c+v*M,e)}}),await p.yield();const Be=Math.atan2(B.x,B.z)+Math.PI/2;for(let t=0;t<4;t++){const c=t===0?.6:-(t-1)*.5,i=l(9,26,26,t);le(i,fe.x+B.x*c+(t===0?-.9:0),fe.y+(t===0?-.6:0),fe.z+B.z*c,Be)}await p.yield();const Ce=.25,He=Math.ceil(V/Ce),xe=new Float64Array(He*3+3);let $=0;for(let t=0;t<=He;t++)X.pointAt(Math.min(1,t*Ce/V),S),xe[t*3]=S.x,xe[t*3+1]=S.y,xe[t*3+2]=S.z,t&&($=Math.max($,Math.hypot(S.x-xe[t*3-3],S.y-xe[t*3-2],S.z-xe[t*3-1]))),t%256===255&&await p.yield();await p.yield();const Pe=t=>{const c=t.size,i=t.sh<0?.886*c:.9405*c+.3,h=2.4743+i,_=40*Ce/V*Math.hypot(5.2*t.dir,t.vz,.55*t.rise+2.05),e=$+_,u=h+21*$+_;let v=0,g=0,y=0,d=0,M=0,W=0,z=0,oe=!0;const ae=F=>Math.hypot(v-xe[F*3],g-xe[F*3+1],y-xe[F*3+2]);for(let F=0;F<=He;F++){const se=Math.max(0,Math.min(1,F*Ce/V)-t.uL)*40,ne=A(0,.5,se);v=t.x+t.dir*5.2*se,g=t.y+t.rise*(1-Math.exp(-se*.55))+.5*Math.sin(se*1.1+t.ph)*ne,y=t.z+t.vz*se;const pe=ae(F);if(pe>=u){F+=Math.floor((pe-u)/e),oe=!0;continue}oe&&(d=v,M=g,W=y,z=ne,oe=!1);const s=2.05+.4243*(1-z)+(t.sh<0?c*Math.max(.7072,.04+.846*(.35+.65*ne)):i);if(Math.min(pe,ae(Math.max(0,F-14)),ae(Math.min(He,F+14)))<s+7*$+_){const o=v-d,f=g-M,r=y-W,O=o*o+f*f+r*r;for(let T=Math.max(0,F-21);T<=Math.min(He,F+20);T++){const Se=xe[T*3]-d,I=xe[T*3+1]-M,U=xe[T*3+2]-W,ue=O>0?Math.min(1,Math.max(0,(Se*o+I*f+U*r)/O)):0,Ae=Se-o*ue,We=I-f*ue,je=U-r*ue;if(Ae*Ae+We*We+je*je<s*s)return!1}}d=v,M=g,W=y,z=ne}return!0},be=[],me=Math.round(160*D);for(let t=0;t<me;t++){let c,i,h,_;if(t<30)i=k.range(80,118),c=k.range(7,34),h=-2.4,_=(i+12+56)/V;else{_=k.range(.14,.94),X.pointAt(_,S);const z=k.range(5,75)*(k()<.5?-1:1);c=S.x+z,i=S.z,h=z>0?-1:1,k()<.45&&(h=0)}let e=k.range(1.15,1.5)*(t<30?1.6:1),u=3.75,v=7.5,g=9,y=0;const d=k.range(0,14);let M=_-(38+d)/V;if(t<30){const z=d/14;M=(i+56-(12+28*z))/V,y=19.2-5.6*z,v=4.5+9*ke(t*2.7+.6)}else if(t<42){const z=t-30;i=-12+3.2*z+2*ke(z+.3),c=(ke(z*7.3+1)-.5)*56,Math.abs(c+2)<5&&(c+=c>-2?6:-6),h=c>0?2.2:-2.2,v=3.5,e*=2,u=5+.47*e,g=(ke(z+.9)<.5?1:-1)*(1.5708+(ke(z+.7)-.5)*.6),z<3&&(c=15+7*z,i=-8+6*z,h=-1,v=7.5,M=-.03-.008*z)}const W=i>$e+16&&i<Ye-6;be.push({x:c,z:i,y:W?.55:i>345&&i<$e+16?2.6:u,dir:h,uL:M,rise:v,vz:y||8.5*(.4+.6*Math.abs(h)+.3),ph:k()*6.28,size:e,hd:g<8?(k.range(-1,1),g):k.range(-1,1),sh:t<42?l(0,e,e,m.teal):-1,b:l(0,e,e,m.white),w1:l(1,e*.8,e*.55,m.white,1),w2:l(1,e*.8,e*.55,m.white,-1)});{const z=be[t];if(!Pe(z))for(const oe of[z.sh,z.b,z.w1,z.w2])oe>=0&&(H[oe*4]=H[oe*4+1]=0);await p.yield()}t%40===39&&await p.yield()}await p.yield();const Te=[],Ee=Math.round(40*D),Re=Math.min(9,Ee),Ve=V*.418,Ne=V*.548,C=6.5;for(let t=0;t<Ee;t++){X.pointAt(.43+(k.range(.43,.63)-.43)*.62,S);const c=k.range(.5,2)*(k()<.5?-1:1)*.72;Te.push({x:S.x+c,y:k.range(.8,2.7),z:S.z,ph:k()*9,sg:Math.sign(c),hd:k.range(-1.5,1.5),lat:c,esc:t<Re,off:t*C*5/Re%C,sz:t<3?1.05:.7,b:l(2,t<3?1.05:.7,t<3?1.05:.7,m.teal),w1:l(3,t<3?1.05:.7,t<3?1.05:.7,m.white,0,1),w2:l(3,.1,.1,m.white,-1)})}await p.yield();const G=[],he=Math.max(10,Math.round(14*D));for(let t=0;t<he;t++){const c=t>>1,i=(7+19*(c+.5*k())/Math.ceil(he/2))*Ke,h=[13,22,16.5,26,12,20,15,24,14][c%9]+k.range(-.7,.7);G.push({lead:h*Math.cos(i)/V,lat:h*Math.sin(i)*(t%2?-1:1),ph:k()*6,size:k.range(3.2,3.9),uTurn:.826+.022*ke(t*3.7+1),id:[l(4,1,1,0),l(4,1,1,1),l(4,1,1,2)]})}for(const t of G)t.lat=Math.sign(t.lat)*Math.max(2.6,Math.min(Math.abs(t.lat),(.62*t.lead*V-2)/1.25));const Me=[],Fe=[[15,5.5,5.5],[14,-4.5,-4.5],[24.5,-3.5,2.2],[21,-8,-8],[29,9,9]];for(let t=0;t<5;t++)Me.push({uGo:.688+t*.004+k()*.002,lead:Fe[t][0]+k.range(-.6,.6),lat0:Fe[t][1],lat1:Fe[t][2],lat:Fe[t][2],id:[l(5,3.4,3.4,0),l(5,3.4,3.4,1),l(5,3.4,3.4,2)],w1:l(1,1.25,.8,m.teal,1),w2:l(1,1.25,.8,m.teal,-1)});const ze=[[63,11.5,512,1.2],[29,12.6,541,1.2],[46,10.2,476,1.7],[39.5,11.4,481,1.6]].map(([t,c,i,h],_)=>({x:t,y:c,z:i,ph:_*2.1,b:l(0,h,h,m.white),cap:l(3,.2,.1,m.black),w1:l(1,1,.6,m.white,1),w2:l(1,1,.6,m.white,-1)})),n=[],E=[.3,.14,.7,0,1,.5,.15,.85,.4];for(let t=0;t<9;t++){const c=t===1||t===3||t===4||t===5,i=c?1.9:t<6?.95:1.15,h={x:k.range(3.2,8)*(t%2?-1:1),z:-22+t*24+k.range(-6,6),yF:3.8,ph:k()*6,size:i,lift:E[t]};if(h.hd=(h.x>0?-1:1)*1.5708+(h.ph-3)*.14,t>=5){const _=[.4405,.479,.511,.538][t-5];X.pointAt(_,S),X.tangentAt(_,K);const e=Math.hypot(K.x,K.z)||1,u=t%2?-2.45:2.45;h.x=S.x+K.z/e*u,h.z=S.z-K.x/e*u,h.yF=t===5?3.9:4.3,h.hd=Math.atan2(K.x,K.z)+1.5708*(t%2?1:-1)}h.S=h.yF/.828,h.st=l(11,h.S,h.S,4),h.s=l(11,h.S,h.S,3),h.t=l(7,i,i,m.teal,0,h.lift),h.i=l(7,i,i,m.black,0,h.lift),n.push(h)}[[42.5,493,7.5,0],[66,519,6.5,1],[29,541,8,0],[48.5,466.5,5.8,1],[47.6,521,6.6,0],[38.6,441.6,7.4,1]].forEach(([t,c,i,h])=>{const _=Math.atan2(B.x,B.z)+Math.PI/2+(h?.25:-.2);for(let e=0;e<3;e++){const u=(e-1)*.16,v=l(10,i,i,e,0,h);le(v,t+B.x*-u+(e===0?-.35:0),i*.2+(e===0?-.16:0),c+B.z*-u,_)}}),await p.yield();const te=new x.PlaneGeometry(1,1),a=new x.InstancedBufferGeometry;a.index=te.index,a.setAttribute("position",te.getAttribute("position"));const P=[["aPos",re],["aDef",H],["aAnim",b]].map(([t,c])=>{const i=new x.InstancedBufferAttribute(c,4);return i.setUsage(x.DynamicDrawUsage),a.setAttribute(t,i),i});a.instanceCount=ce;const L=new x.ShaderMaterial({uniforms:{...R.uniforms,uRingIn:{value:new x.Vector2(2,2)},uBodyC:{value:R.cans[m.straw]}},vertexShader:Qe+vt,fragmentShader:Qe+xt,side:x.DoubleSide}),q=new x.Mesh(a,L);q.frustumCulled=!1,q.renderOrder=3;const w=(t,c,i,h,_,e,u)=>{le(t,c,i,h,_),H[t*4+3]=e,b[t*4+1]=u};let j=0,Z=0;const de=(t,c,i,h,_,e)=>{const u=i-t.x,v=h-t.z,g=Math.hypot(u,v)||1;let y=Math.atan2(u,v)-c;y-=6.2832*Math.round(y/6.2832);const d=Math.max(.12,.72-Math.atan(_/g))+3*A(.84,.9,e),M=.62*d,W=Math.abs(y);if(W<=M)return!1;const z=c+Math.sign(y)*(M+(d-M)*(1-Math.exp(-(W-M)/(d-M))));return j=t.x+g*Math.sin(z),Z=t.z+g*Math.cos(z),!0};function qe(t,c,i,h){const _=Math.atan2(h.x,h.z);for(const e of be){const u=Math.max(0,c-e.uL)*40,v=A(0,.5,u),g=Math.sin(e.x*Q.x+e.z*Q.y-t*Q.z),y=e.x+e.dir*5.2*u+.3*g*(1-v),d=e.z+e.vz*u,M=e.y+.3*g*(1-v)+e.rise*(1-Math.exp(-u*.55))+.5*Math.sin(u*1.1+e.ph)*v;let W=e.hd,z=-1.25,oe=-1.25;if(v>0){const F=Math.atan2(e.dir*5.2,e.vz);let se=Math.atan2(y-i.x,d-i.z)-F;se-=6.2832*Math.round(se/6.2832);const ne=Math.abs(se),pe=Math.max(.96,Math.min(3.1416-.96,ne));W=F+(se<0?-1:1)*(ne-pe),z=.5+.28*(1+Math.sin(t*6.5+e.ph)),oe=.24+.2*(1+Math.sin(t*6.5+e.ph+.8))}le(e.b,y,M,d,W),H[e.b*4+3]=v*.25*Math.exp(-u*.4),e.sh>=0&&(le(e.sh,y-.2*e.size,M-.12*e.size,d+.3,W),H[e.sh*4+3]=H[e.b*4+3],b[e.b*4]=b[e.sh*4]=v<.5?1:0);const ae=M+.04*e.size;w(e.w1,y,ae,d,W,z,.35+.65*v),w(e.w2,y,ae,d,W,oe,.35+.65*v)}for(const e of Te){const u=t*.8+e.ph,v=Math.floor(u),g=A(0,.28,u-v),y=v*3.1+e.ph*17;let d=e.x,M=e.z;if(e.esc){const f=Math.min((Ne-Ve-e.off)/C,Math.max(0,(c*V-Ve-e.off)/C)),r=Math.floor(f),O=(Ve+e.off+3.8+C*(r+A(0,.14,f-r)))/V;X.pointAt(O,S),X.tangentAt(O,K);const T=Math.hypot(K.x,K.z)||1;d=S.x+K.z/T*e.lat,M=S.z-K.x/T*e.lat}const W=1-A(2.5,7,Math.hypot(d-i.x,M-i.z)),z=d+_e(y,g)*(e.esc?.5:1.3)+e.sg*W*2.4,oe=e.y+_e(y+1,g)*.7+W*.3,ae=M+_e(y+2,g)*(e.esc?.6:2.4),F=Math.atan2(z-i.x,ae-i.z)+e.sg*1.5708+_e(y+3,g)*.9,se=.3*Math.sin(t*15+e.ph),ne=Math.sin(F)*.1,pe=Math.cos(F)*.1,s=A(2,3.4,Math.hypot(z-i.x,oe-i.y,ae-i.z)),o=.2+.35*_e(y+4,g);le(e.b,z,oe,ae,F),b[e.b*4+1]=s,H[e.b*4+3]=o,le(e.w1,z,oe,ae,F),b[e.w1*4+1]=s,H[e.w1*4+3]=o,H[e.w1*4+1]=e.sz*(.88+.12*Math.sin(t*11+e.ph)),b[e.w2*4+1]=0}for(const e of G)for(let u=0;u<3;u++){const v=c-wt[u],g=e.id[u],y=A(.646,.664,v),d=Math.min(.992,v+e.lead+.05*Math.max(0,v-.653)),M=A(.808,.954,v);X.pointAt(d,S),X.tangentAt(d,K);const W=Math.hypot(K.x,K.z)||1,z=K.x/W,oe=K.z/W,ae=e.lat*(1+5*Math.max(0,v-.662))+M*M*(70+Math.abs(e.lat)*2),F=d*V/3.4+e.ph,se=Math.abs(Math.sin(F));let ne=S.x+oe*ae,pe=S.z-z*ae;y>0&&de(i,_,ne,pe,.56*e.size,v)&&(ne=j,pe=Z);const s=1.16+.12*Math.sin(e.ph),o=A(e.uTurn,e.uTurn+.008,v),f=Math.atan2(ne-i.x,pe-i.z)+(e.lat>0?s+(1.3-s)*M:-s+(1.3+s)*o),r=Math.cos(f),O=-Math.sin(f);le(g,ne+r*.14*u,(.5+1.1*se)*e.size*.5*y+.45*e.size*.5,pe+O*.14*u,f),H[g*4]=e.size,H[g*4+1]=e.size,H[g*4+3]=.2*Math.sin(2*F+.6),b[g*4]=2*F,b[g*4+1]=y}for(const e of Me)for(let u=0;u<3;u++){const v=c-at[u]*.0045,g=(v-e.uGo)*40,y=e.id[u],d=A(0,.2,g),M=Math.max(0,g),W=Math.min(.995,e.uGo+e.lead/V+(v-e.uGo)*.96),z=A(.795,.83,v);X.pointAt(W,S),X.tangentAt(W,K);const oe=Math.hypot(K.x,K.z)||1,ae=e.lat0+(e.lat1-e.lat0)*A(.2,1.6,M)+Math.sign(e.lat1)*Math.min(.5*M,1.2)+70*z;let F=S.x+K.z/oe*ae,se=S.z-K.x/oe*ae,ne=Math.max(1.2,S.y-2.6)+4.4*(1-Math.exp(-M*.7))+Math.min(.3*M,.9)+.25*Math.sin(t*2.3+e.lead);d>0&&z<.02&&(de(i,_,F,se,2.1,v)&&(F=j,se=Z),ne=Math.min(ne,i.y+Math.hypot(F-i.x,se-i.z)*.36-1));const pe=Math.atan2(F-i.x,se-i.z)+Math.sign(e.lat1)*(1.12+.2*Math.sin(e.lead)),s=.3+.6*Math.exp(-M*.6),o=Math.cos(pe),f=-Math.sin(pe);if(le(y,F+o*.16*u,ne,se+f*.16*u,pe),H[y*4+3]=s,b[y*4]=t*9,b[y*4+1]=d,u===0){const r=.25+.85*Math.sin(t*15+e.lead),O=Math.sin(pe)*.7*Math.cos(s),T=Math.cos(pe)*.7*Math.cos(s),Se=.7*Math.sin(s)+.06;w(e.w1,F+O,ne+Se,se+T,pe,r,d),w(e.w2,F+O,ne+Se,se+T,pe,r,d)}}for(const e of ze){const u=e.y+.35*Math.sin(t*1.3+e.ph),v=e.x+.6*Math.sin(t*.5+e.ph),g=-2.2+.4*Math.sin(t*.4+e.ph),y=-.35+.25*Math.sin(t*.9+e.ph);le(e.b,v,u,e.z,g),H[e.b*4+3]=y;const d=.2+.7*Math.sin(t*13+e.ph);le(e.cap,v+Math.sin(g)*.42,u+.3+.42*Math.sin(y),e.z+Math.cos(g)*.42,g),b[e.cap*4+3]=0,w(e.w1,v,u+.05,e.z,g,d,1),w(e.w2,v,u+.05,e.z,g,d,1)}for(const e of n){const u=Math.sin(e.x*Q.x+e.z*Q.y-t*Q.z+.4),v=.085*u+.02*Math.sin(t*2.3+e.ph),g=Math.cos(v),y=Math.sin(v),d=e.S,M=Math.sin(e.hd),W=Math.cos(e.hd),z=-.32*d,oe=-.5*d,ae=.389*d,F=.828*d,se=e.x-M*ae,ne=e.z-W*ae,pe=e.yF-F,s=-(g*z-y*oe),o=-(y*z+g*oe);le(e.s,se+M*s,pe+o,ne+W*s,e.hd),H[e.s*4+3]=v;const f=e.x-i.x,r=e.z-i.z,O=Math.hypot(f,r)||1,T=f/O*.16,Se=r/O*.16;le(e.st,se+M*s-.2+T,pe+o-.13,ne+W*s+Se,e.hd),H[e.st*4+3]=v;const I=g*ae-y*F,U=y*ae+g*F,ue=.6*v+.1*e.lift,Ae=Math.cos(ue),We=Math.sin(ue),je=.1*e.size,Ge=-.165*e.size,Oe=I-(Ae*je-We*Ge),Ue=pe+U-(We*je+Ae*Ge),Xe=e.size/1.9;le(e.i,se+M*Oe,Ue,ne+W*Oe,e.hd),H[e.i*4+3]=ue,le(e.t,se+M*Oe-.24*Xe+T,Ue-.15*Xe,ne+W*Oe+Se,e.hd),H[e.t*4+3]=ue}{const e=(De[2][0]*ye[0]+De[2][1]*ye[1]-3*t)/Ze,u=((1.82-(e-Math.floor(e)))%1+1)%1;for(let v=1;v<4;v++){const g=v===1?1:v===2?3:2;b[Y[v]*4+1]=c>=Je+.004*(g-2)||u>=.035+.13*g&&u<=.96?1:0}Ie.due=1-A(.425,.455,u)*(1-A(.93,.96,u))}for(const e of P)e.needsUpdate=!0}return{mesh:q,mat:L,quad:te,update:qe,trees:De,arrival:Ie}}async function yt(p,R,ge,X,fe,B){const we=n=>p.core.makeRng(p.core.hashSeed(n+":"+p.seed)),k=Math.min(1.3,Math.max(.7,p.vary?.density??1)),D=X.length,ie=ge.swk,re=96,H=new Float32Array(re*4),b=new Float32Array(re*4),ce=new Float32Array(re*4);let V=0;const Q=(n,E,te,a,P=0,L=0)=>{const q=V++;return b.set([E,te,n,0],q*4),ce.set([L,1,a,P],q*4),q},l=(n,E,te,a,P)=>{H[n*4]=E,H[n*4+1]=te,H[n*4+2]=a,H[n*4+3]=P},le=(n,E,te,a,P,L,q)=>{l(n,E,te,a,P),b[n*4+3]=L,ce[n*4+1]=q},S=new x.Vector3,K=new x.Vector3,J=2e3,ee=new Float32Array(J+1);for(let n=0;n<=J;n++)X.pointAt(n/J,S),ee[n]=S.z;const De=n=>{for(let E=1;E<=J;E++)if(ee[E]>=n)return(E-1+(n-ee[E-1])/Math.max(1e-6,ee[E]-ee[E-1]))/J*D;return D},N=n=>{X.pointAt(n/D,S),X.tangentAt(n/D,K);const E=Math.hypot(K.x,K.z)||1;return{x:S.x,z:S.z,tx:K.x/E,tz:K.z/E}};await p.yield();const Y=De(166),Ie=De(240),Be=(Ie-Y)/3,Ce=we("trail-birds"),He=[];for(let n=0;n<3;n++){const E=Y+(n+Ce())*Be,te=Ce()<.5?-3.72:3.72,a=3.5+.4*Ce(),P=Ce(),L=Ce()*6,q=N(E),w={m:E,x:q.x+q.tz*te,z:q.z-q.tx*te,yF:a,ph:L,lift:P,size:1.9,S:a/.828,hd:Math.atan2(q.tx,q.tz)+1.5708*(te<0?1:-1),bx:q.tx*.16,bz:q.tz*.16};w.st=Q(11,w.S,w.S,4),w.s=Q(11,w.S,w.S,3),w.t=Q(7,w.size,w.size,m.teal,0,P),w.i=Q(7,w.size,w.size,m.black,0,P),He.push(w)}const xe=De(212),$=we("mouth-flies"),Pe=Math.round(12*k),be=[];for(let n=0;n<Pe;n++){const E=Y+(xe-Y)*$(),te=$()<.5?-1:1,a=$(),P=.8+1.9*$(),L=$()*9,q=($()-.5)*.8,w=n<3?1.05:.7,j=N(E);be.push({m:E,sg:te,lat:.5+.9*a,out:2.5+.5*a,y:P,ph:L,sz:w,x:j.x,z:j.z,tx:j.tx,tz:j.tz,hd:Math.atan2(j.tx,j.tz)+te*1.5708+q,b:Q(2,w,w,m.teal),w:Q(3,w,w,m.white,0,1)})}await p.yield();const me=we("ring-company"),Te=B.z,Ee=-B.x,Re=-.72,Ve=[],Ne=n=>Ye+5*Math.sin(n*.021+2);for(let n=0;n<5;n++){const E=(12.5+10*((n<3?n:n-3)+me())/(n<3?3:2))*(n<3?1:-1),te=3.5+5.5*me(),a=3.2+.7*me(),P=me(),L=5+3*me(),q=me();let w=20,j=0,Z=0;for(let c=0;c<6;c++)j=fe.x+B.x*w+Te*E,Z=Ne(j)-te,w=(Z-fe.z-Ee*E)/B.z;j=fe.x+B.x*w+Te*E,Z=fe.z+B.z*w+Ee*E;const de=Math.atan2(1,.105*Math.cos(j*.021+2))+(P<.5?0:Math.PI)+(P*2%1-.5)*.5;let qe=Math.cos(de),t=-Math.sin(de);qe*B.x+t*B.z>0&&(qe=-qe,t=-t),Ve.push({x:j,z:Z,lat:E,beyond:w,depth:te,size:a,hd:de,nx:qe,nz:t,per:L,ph:q,id:[Q(4,a,a,0,0,Re),Q(4,a,a,1,0,Re),Q(4,a,a,2,0,Re)]})}const C=we("sea-party"),G=[];for(let n=0;n<6;n++){const E=9+9*C(),te=34+36*C(),a=2.3+.7*C(),P=14+16*C(),L=3.5+4*C(),q=C()*6.28,w=15,j=9-3*(P-14)/16;G.push({x:E,z:te,y:5+.47*a,size:a,rise:L,ph:q,dLift:P,uL:(De(te)-P)/D,vx:w,vz:j,hdS:1.5708+(q/6.28-.5)*.6,hdF:Math.atan2(w,j),sh:Q(0,a,a,m.teal),b:Q(0,a,a,m.white),w1:Q(1,a*.8,a*.55,m.white,1),w2:Q(1,a*.8,a*.55,m.white,-1)})}await p.yield();const he=new x.InstancedBufferGeometry;he.index=R.quad.index,he.setAttribute("position",R.quad.getAttribute("position"));const Me=[["aPos",H],["aDef",b],["aAnim",ce]].map(([n,E])=>{const te=new x.InstancedBufferAttribute(E,4);return te.setUsage(x.DynamicDrawUsage),he.setAttribute(n,te),te});he.instanceCount=V;const Fe=new x.Mesh(he,R.mat);Fe.frustumCulled=!1,Fe.renderOrder=3;function ze(n,E){const te=E*D;for(const a of He){const P=Math.sin(a.x*ie.x+a.z*ie.y-n*ie.z+.4),L=.085*P+.02*Math.sin(n*2.3+a.ph),q=Math.cos(L),w=Math.sin(L),j=a.S,Z=Math.sin(a.hd),de=Math.cos(a.hd),qe=-.32*j,t=-.5*j,c=.389*j,i=.828*j,h=a.x-Z*c,_=a.z-de*c,e=a.yF-i,u=-(q*qe-w*t),v=-(w*qe+q*t);l(a.s,h+Z*u,e+v,_+de*u,a.hd),b[a.s*4+3]=L,l(a.st,h+Z*u-.2+a.bx,e+v-.13,_+de*u+a.bz,a.hd),b[a.st*4+3]=L;const g=q*c-w*i,y=w*c+q*i,d=.6*L+.1*a.lift,M=Math.cos(d),W=Math.sin(d),z=.1*a.size,oe=-.165*a.size,ae=g-(M*z-W*oe),F=e+y-(W*z+M*oe);l(a.i,h+Z*ae,F,_+de*ae,a.hd),b[a.i*4+3]=d,l(a.t,h+Z*ae-.2+a.bx,F-.13,_+de*ae+a.bz,a.hd),b[a.t*4+3]=d}for(const a of be){const P=n*.8+a.ph,L=Math.floor(P),q=A(0,.28,P-L),w=L*3.1+a.ph*17,j=A(9,6,a.m-te),Z=a.sg*(a.lat+(a.out-a.lat)*j+_e(w,q)*.5*(1-j)),de=_e(w+2,q)*2.4,qe=a.x+a.tz*Z+a.tx*de,t=a.z-a.tx*Z+a.tz*de,c=a.y+_e(w+1,q)*.7,i=a.hd+_e(w+3,q)*.6,h=.2+.35*_e(w+4,q);l(a.b,qe,c,t,i),b[a.b*4+3]=h,l(a.w,qe,c,t,i),b[a.w*4+3]=h,b[a.w*4+1]=a.sz*(.88+.12*Math.sin(n*11+a.ph))}for(const a of Ve)for(let P=0;P<3;P++){const L=(n-at[P])/a.per+a.ph,q=L-Math.floor(L),w=-.3*A(0,.14,q)*(1-A(.46,.62,q)),j=.475*a.size,Z=-Math.sin(w)*j,de=a.id[P];l(de,a.x+Math.sin(a.hd)*Z+a.nx*.14*P,Math.cos(w)*j,a.z+Math.cos(a.hd)*Z+a.nz*.14*P,a.hd),b[de*4+3]=w}for(const a of G){const P=Math.max(0,E-a.uL)*40,L=A(0,.5,P),q=Math.sin(a.x*ie.x+a.z*ie.y-n*ie.z),w=a.x+a.vx*P+.3*q*(1-L),j=a.z+a.vz*P,Z=a.y+.3*q*(1-L)+a.rise*(1-Math.exp(-P*.55))+.5*Math.sin(P*1.1+a.ph)*L,de=a.hdS+(a.hdF-a.hdS)*L;let qe=-1.25,t=-1.25;L>0&&(qe=.5+.28*(1+Math.sin(n*6.5+a.ph)),t=.24+.2*(1+Math.sin(n*6.5+a.ph+.8))),l(a.b,w,Z,j,de),b[a.b*4+3]=L*.25*Math.exp(-P*.4),l(a.sh,w-.2*a.size,Z-.12*a.size,j+.3,de),b[a.sh*4+3]=b[a.b*4+3],ce[a.b*4]=ce[a.sh*4]=L<.5?1:0;const c=Z+.04*a.size;le(a.w1,w,c,j,de,qe,.35+.65*L),le(a.w2,w,c,j,de,t,.35+.65*L)}for(const a of Me)a.needsUpdate=!0}return ze(0,0),{mesh:Fe,update:ze}}const bt=[[18.9,407.3,2],[9.9,411.7,2.2],[28.5,422.5,2],[18.1,428.3,1.8],[64.8,502.5,2.2],[50.2,505.5,2],[57.4,530,2],[42.8,526,2.2],[51.6,551.4,1.8],[36.8,547.6,2],[36.5,438.5,2],[33,457.5,1.8]].map(p=>new x.Vector3(p[0],p[1],p[2])),ye=[-.894,-.447],Ze=67,Je=.184,ve={x:-8.342,z:331.73,h:10*Ke};var zt={id:"stripes-in-the-grass",name:"Stripes in the Grass",category:"wilderness",weirdness:.15,media:["air","open"],async build(p){const R=p.rng,ge=p.vary||{},X=p.quality?.detail??1,fe=new x.Scene,B=Le.makeStyle(Le.PALETTE),we=B.cans;B.uniforms.uWind.value.set(ye[0],ye[1],3),B.uniforms.uMist.value.set(Ze,60);const k=R(),D=R(),ie=R();let re=ge.hour==="dawn"?1:ge.hour==="night"?2:ge.hour==="day"||ge.hour==="golden"||k<.46?0:k<.74?1:2;const H=s=>s.clone().multiply(new x.Color(.93,.88,.8)),b=[{sky:[m.straw,m.orange,m.teal],spat:[m.white,m.orange],cloud:[m.white,m.straw,m.teal],bodyC:we[m.straw],shadeC:we[m.teal],plumeC:we[m.white]},{sky:[m.teal,m.straw,m.white],spat:[m.straw,m.teal],cloud:[m.white,m.straw,m.teal],bodyC:we[m.straw],shadeC:we[m.teal],plumeC:we[m.white]},{sky:[m.teal,m.black,m.black],spat:[m.white,m.white],cloud:[m.straw,m.teal,m.black],bodyC:we[m.teal],shadeC:we[m.black],plumeC:we[m.straw]}][re];b.silC=H(b.bodyC),b.swell=D<.3?2:1,b.rain=D>=.3&&D<.46,b.swk=new x.Vector3(-.303,-.175,2.1).multiplyScalar(b.swell);const ce=!!ge.rare,V=ce||ie<.14,Q=(s,o)=>[ve.x+Math.cos(ve.h)*s+Math.sin(ve.h)*o,ve.z-Math.sin(ve.h)*s+Math.cos(ve.h)*o];let l=null,le="";if(typeof Le.buildHero=="function")try{l=await Le.buildHero(p,{style:B,ground:!1,detail:X,white:V,cubs:ce,wallYaw:.06,crossAngle:52*Ke,crossLead:8.5,stride:5.5,endAhead:!0,hook:30*Ke,straight:2,hookRadius:4,runOn:1.35,farWallX:9.81,wallAhead:22,wallBack:46})}catch(s){le=String(s&&s.message||s),l=null}le&&console.error("stripes-in-the-grass: buildHero failed: "+le),await p.yield();const S=l?.anchors||{},K=(S.flyThrough||[[0,1.7,-52],[0,1.7,-28],[0,1.7,-8],[0,1.7,14],[0,1.7,34]]).filter(s=>s[2]>-57&&s[2]<40),J=it.slice(0,6).concat([[-2,1.7,232],[-9.5,1.7,252],[-15.5,1.7,266]]);K[0][2]>-44&&K.unshift([0,1.7,-52]);for(const s of K){const o=Q(s[0],s[2]);J.push([o[0],s[1],o[1]])}J.push([7,4.4,394],[27,7.4,432],[47,8.5,466],[58.1,8.5,497.4],[49.05,8.5,531.2],[40,8.5,565]);const ee=nt(J),De=ee.length;await p.yield();const N=ee.pointAt(1,new x.Vector3),Y=ee.tangentAt(1,new x.Vector3);Y.y=0,Y.normalize();let Ie=null,Be=8,Ce=5.5;if(l){l.object.position.set(ve.x,0,ve.z),l.object.rotation.y=ve.h,fe.add(l.object);const s=S.portWall,o=S.farWall,f=S.track;s&&o&&f&&(Ie={toW:Q,pw:s,fw:o,tr:f}),Be=l.duration||Be,Ce=((l.timing||{}).midSecondBound??.69)*Be}const He=[[0,-37],[1.5,-27.8],[2.3,-23.2],[3.9,-13.6],[4.6,-10.8],[Ce,-7],[6.4,-3],[8,5.64],[10.5,16.5],[16,33]],xe=s=>{for(let o=0;o<He.length-1;o++){const f=He[o],r=He[o+1];if(s<=r[0])return f[1]+(r[1]-f[1])*(s-f[0])/(r[0]-f[0])}return 33},$=[],Pe=.45,be=.76,me=640,Te=new x.Vector3,Ee=Math.cos(ve.h),Re=Math.sin(ve.h);for(let s=0;s<=me;s++)ee.pointAt(Pe+(be-Pe)*s/me,Te),$.push(Re*(Te.x-ve.x)+Ee*(Te.z-ve.z)),s%160===159&&await p.yield();const Ve=s=>{let o=0,f=me;if(s<=$[0])return Pe;if(s>=$[me])return be;for(;f-o>1;){const r=o+f>>1;$[r]<=s?o=r:f=r}return Pe+(be-Pe)*(o+(s-$[o])/Math.max(1e-6,$[f]-$[o]))/me},Ne=128,C=.125,G=[];for(let s=0;s<=Ne;s++)G.push(Ve(xe(s*C)));await p.yield();const he=s=>{if(s<=G[0])return 0;if(s>=G[Ne])return 2;let o=0,f=Ne;for(;f-o>1;){const r=o+f>>1;G[r]<=s?o=r:f=r}return(o+(s-G[o])/Math.max(1e-6,G[f]-G[o]))*C/Be},Me=s=>{const o=Math.min(Ne-.001,Math.max(0,s/C)),f=Math.floor(o);return G[f]+(G[f+1]-G[f])*(o-f)},Fe=Me(Ce),ze=s=>{const o=Math.min(me-.001,Math.max(0,(s-Pe)/(be-Pe)*me)),f=Math.floor(o);return $[f]+($[f+1]-$[f])*(o-f)},n={pr:0,lead:0,show:1},E=s=>{const o=ze(s);return n.pr=he(s),n.lead=0,n.show=1,o<-31.5&&s<.6&&(n.show=A(-67,-61,o),n.lead=.8*(-31.5-o),n.pr=n.show>0?.9/Be:0),n};await p.yield();const te=ht(ee,Ie,ce);await p.yield();const a={value:new x.Vector4(0,0,0,0)},P={uMask:{value:te.tex},uMaskBox:{value:te.box},uSight:a},L=new x.ShaderMaterial({uniforms:{...B.uniforms,...P,uBodyC:{value:b.bodyC},uShadeC:{value:b.shadeC},uPlumeC:{value:b.plumeC},uRing:{value:new x.Vector2(N.x,Ye)},uShadow:{value:new x.Vector4(0,-999,0,1)}},vertexShader:dt,fragmentShader:Qe+tt+ft}),q=new x.Mesh(new x.PlaneGeometry(7e3,7e3),L);q.rotation.x=-Math.PI/2,q.position.set(0,0,400),q.frustumCulled=!1,q.renderOrder=-5;const w=ct(B,b);fe.add(q,w),await p.yield();const j=await mt(p,B,P,b,fe);await p.yield();const Z=await gt(p,B,b,ee,N,Y,ce);Z.mat.uniforms.uBodyC.value=b.bodyC,fe.add(Z.mesh);const de=await yt(p,Z,b,ee,N,Y);fe.add(de.mesh),await p.yield();const qe=new x.PlaneGeometry(1,1),t=[],c=(s,o,f,r,O,T,Se,I=8)=>{const U=new x.Mesh(qe,Le.sprayMaterial(B,s));return U.scale.set(o,f,1),U.position.set(r,O,T),U.rotation.y=Se,U.renderOrder=I,U.frustumCulled=!1,fe.add(U),t.push(U),U},i=[];for(let s=0;s<8;s++)i.push(c({can:s%4===3?b.sky[0]:m.white,shape:3,alpha:0,seed:s*3.3,near:16},62,4.4,0,5.1,100,Math.atan2(-ye[0],-ye[1]),7));for(const s of i)s.material.uniforms.uLane.value.set(6,34);const h=Math.atan2(-Y.x,-Y.z);c({can:m.orange,shape:0,alpha:.16,seed:2.2},36,36,N.x+Y.x*.9,N.y,N.z+Y.z*.9,h,1),c({can:m.white,shape:1,alpha:.5,seed:1,inner:[.84,.8],floor:0,soft:.03},29,24.6,N.x+Y.x*1.3+Y.z*.45,N.y+2.95,N.z+Y.z*1.3-Y.x*.45,h,.9).material.uniforms.uReach.value=.45,c({can:m.orange,shape:1,alpha:.6,seed:5.1,inner:[.84,.8],floor:0,soft:.03},29,24.6,N.x+Y.x*1.1,N.y+2.6,N.z+Y.z*1.1,h,1).material.uniforms.uReach.value=.45;const _=Z.trees.slice(0,3).map(([s,o,f],r)=>{const O=f/.93;return{x:s,z:o,m:c({can:m.teal,shape:1,alpha:.36,seed:r+1.5,inner:[.8,.84],soft:.34},O*1.25,O*1.2,s,O*.5,o+1.2,Math.PI,1)}}),e=new x.Vector3(Y.z,0,-Y.x),u=[];[[187,9.38],[196,9.38],[205,9.38],[213,9.38],[220.6,9.3],[221.2,8.4],[353,9.38],[344,9.38],[335,9.38],[327,9.38],[319.4,9.3],[318.8,8.4],[226.5,7.75],[313.5,7.75]].forEach(([s,o])=>{const f=s*Ke,r=Math.cos(f)*o,O=Math.sin(f)*o;u.push({at:[N.x+e.x*r-Y.x*.06,N.y+O,N.z+e.z*r-Y.z*.06],tangent:[e.x,0,e.z],length:Math.min(R.range(1.2,3.2),N.y+O-.15),phase:R.range(.45,.85),speed:R.range(.9,1.5)})});for(const[s,o,f]of[[-12.2,3.2,2.6],[12.25,1.4,1.7]])u.push({at:[N.x+e.x*s+Y.x*1.1,N.y+o,N.z+e.z*s+Y.z*1.1],tangent:[e.x,0,e.z],length:f,phase:.6,speed:1.2});const v=new x.Mesh(Le.buildDripGeometry(u),Le.dripMaterial(B,{can:m.orange,run:b.rain?3:1,wide:5}));v.frustumCulled=!1,v.renderOrder=9,fe.add(v),await p.yield();const g=[m.white,m.black].map((s,o)=>c({can:s,shape:3,alpha:0,seed:7.7+o*2.3},24,13,N.x,N.y+1,N.z,h,2));let y=null;if(b.swell>1){const s=Math.round(1600*X),o=new Float32Array(s*3),f=new Float32Array(s*4),r=[-1.4,.2,1.3,2.4];for(let T=0;T<s;T++){const Se=T%4,I=ke(T*.37+1),U=I*6.3+Se*1.7,ue=I*36-18,Ae=Math.sin(U)*.5+(ke(T+.5)-.5)*1.1;o.set([ye[0]*ue-ye[1]*Ae,r[Se]+.5*Math.sin(U*.7+Se)+(ke(T*1.3+7)-.5)*.7,ye[1]*ue+ye[0]*Ae],T*3),f.set([ke(T*2.1+3),.9+2.6*ke(T*3.3+2)*ke(T*3.3+2),Se,ke(T*5.7+1)],T*4)}const O=new x.BufferGeometry;O.setAttribute("position",new x.BufferAttribute(o,3)),O.setAttribute("aSeed",new x.BufferAttribute(f,4)),y=new x.Points(O,Le.dustMaterial(B)),y.material.uniforms.uThread.value=0,y.frustumCulled=!1,y.renderOrder=9,fe.add(y)}await p.yield();const d=new x.Vector3,M=new x.Vector3,W=new x.Vector3,z=new x.Vector3,oe=(s,o)=>{const f=E(o);let r=l&&l.tigerAt?l.tigerAt(f.pr,z,f.lead):null;Array.isArray(r)&&(r={x:r[0],y:r[1],z:r[2]}),r||(r={x:11,y:1.8,z:-20+30*he(o)});const O=Q(r.x,r.z);W.set(O[0],r.y??1.8,O[1]);const T=A(.6135,.636,o);return T>0&&(ee.pointAt(Math.min(1,o+20/De),z),W.lerp(z,T)),W},ae=new x.Vector3,F=new x.Vector3,se=new x.Vector3,ne=new x.Vector3,pe=(s,o)=>{const f=Math.min(me-.001,Math.max(0,(o-Pe)/(be-Pe)*me)),r=Math.floor(f),O=$[r]+($[r+1]-$[r])*(f-r),T=Q(8.6,O+15);return F.set(T[0],2,T[1])};return{scene:fe,path:ee,duration:46,ride:"none",style:"none",companion:"none",pace:s=>1.25-.89*A(.443,.535,s)+1.04*A(ce?.642:.623,.705,s)-.4*A(.817,.909,s),camera:{fov:62,near:.3,far:5e3,lookAhead:20,sway:.5,bank:.2,nearThrough:.3},pois:[{at:[492,12,82],from:.04,to:.13,fade:.5,weight:.62},{at:[Z.trees[2][0],13,Z.trees[2][1]],from:.195,to:.3,fade:.3,weight:.4},{at:pe,from:.492,to:.557,fade:.3,weight:.42},{at:oe,from:Me(.2),to:.642,fade:.12,weight:.62},{at:oe,from:Me(5.9),to:.642,fade:.2,weight:.36},{at:oe,from:Me(6),to:.642,fade:.22,weight:.5},{at:(s,o)=>(ee.pointAt(Math.min(.99,o+.07),ae),ae.y=3,ae),from:.657,to:.763,weight:.3},{at:[N.x,N.y-1.5,N.z],from:.726,to:.936,fade:.25,weight:.55},{at:(s,o)=>{const f=Math.min(.992,o+.03+.05*Math.max(0,o-.653)),r=A(.808,.954,o),O=6*(1+5*Math.max(0,o-.662))+r*r*82;ee.pointAt(f,se),ee.tangentAt(f,ne);const T=Math.hypot(ne.x,ne.z)||1;return se.set(se.x+ne.z/T*O,2.2,se.z-ne.x/T*O)},from:.832,to:.912,fade:.3,weight:.5}],portal:{shape:"circle",radius:7,color:"#FF5A14",glow:0,halo:!1,veil:Le.PALETTE[[m.teal,m.black,m.white][re]],revealDistance:260},post:{flat:1,exposure:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},update(s,o,f,r){B.update(o,p.renderer),f.getWorldPosition(d),f.getWorldDirection(M);{const I=Math.hypot(M.x,M.z)||1,U=M.x/I,ue=M.z/I;L.uniforms.uShadow.value.set(d.x+U*19-5.2,d.z+ue*19,U,ue)}if(l){const I=E(r);l.setProgress(I.pr,I.lead,I.show),l.update(s,o,f,r);const U=oe(o,r);a.value.set(U.x,U.z,A(.5,.512,r)*(1-A(.625,.64,r)),0)}w.material.uniforms.uDrip.value=(20+o)*(b.rain?3:1);for(const I of _)I.m.material.uniforms.uAlpha.value=.36*A(26,46,Math.hypot(I.x-d.x,I.z-d.z));Z.update(o,r,d,M),de.update(o,r);{const I=A(.812,.84,r)*(1-A(.865,.9,r)),U=A(.895,.92,r)*(1-A(.938,.962,r));g[0].material.uniforms.uAlpha.value=.5*I,g[0].position.x=N.x+Y.x*1.6+5-110*(r-.812),g[1].material.uniforms.uAlpha.value=.3*U,g[1].position.x=N.x+Y.x*1.6+4-130*(r-.895)}if(r<.5){const I=Z.trees[2],U=I[2]/.93,ue=g[0];ue.material.uniforms.uAlpha.value=.88*A(0,1,1-Math.abs(r-Je)/.014)*Z.arrival.due,ue.position.set(I[0]-520*(r-Je),U*.56,I[1]-3),ue.rotation.y=Math.PI,ue.scale.set(U*1.5,U*1.1,1)}else{const I=g[0];I.position.y=N.y+1,I.position.z=N.z,I.rotation.y=h,I.scale.set(24,13,1)}if(y){const I=Math.hypot(M.x,M.z)||1,U=y.material.uniforms;y.position.set(d.x+M.x/I*9.5,d.y,d.z+M.z/I*9.5),U.uNow.value=o;const ue=p.through?0:(1-A(.54,.57,r)*(1-A(.63,.66,r)))*(1-A(.86,.9,r));for(let Ae=0;Ae<4;Ae++){const We=(o+Ae*.95)%3.8;U.uTrail.value[Ae].set(ye[0]*(9*We-14),ye[1]*(9*We-14),o-We,ue)}}Z.mat.uniforms.uRingIn.value.set(-.1+1.3*A(.817,.89,r),-.1+1.3*A(.9,.959,r));const O=d.x*ye[0]+d.z*ye[1],T=d.x*-ye[1]+d.z*ye[0],Se=((O-3*o-Ze*.8)%Ze+Ze)%Ze;for(let I=0;I<8;I++){const U=-Se-(I>>2)*Ze,ue=(I&3)-1,Ae=(T+2*U)/55,We=Ae-Math.floor(Ae),je=55*(Math.floor(Ae)+ue),Ge=i[I];Ge.position.x=d.x+U*ye[0]-ye[1]*(je-T),Ge.position.z=d.z+U*ye[1]+ye[0]*(je-T);const Oe=Math.hypot(Ge.position.x-d.x,Ge.position.z-d.z),Ue=N.x-d.x,Xe=N.z-d.z,st=Math.hypot(Ue,Xe)||1,ot=Math.abs((Ge.position.x-d.x)*Xe-(Ge.position.z-d.z)*Ue)/st;Ge.material.uniforms.uAlpha.value=.86*(ue<0?1-We:ue>1?We:1)*A(300,230,Oe)*Math.max(A(.05,.1,r),A(20,46,ot))*(1-A(.3,.36,r))}},dispose(){te.tex.dispose(),qe.dispose(),j.quad.dispose(),Z.quad.dispose(),y&&(y.geometry.dispose(),y.material.dispose()),l&&l.dispose&&l.dispose()},_heroErr:le}}};export{zt as default};
