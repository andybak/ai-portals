import*as i from"three";import{clamp as ye,lerp as re,smoothstep as L}from"../kit/core.js";const T=Math.PI*2,D=2500,z=2400,ee=240,u=(t=0,n=0,e=0)=>new i.Vector3(t,n,e),K=t=>new i.Color(t),J=`
uniform float uTime, uInside, uSeed, uDim, uDimL, uDimR, uRibW, uBraid;
uniform vec3 uSun, uGold, uBlue, uPortal;
float h11(float n){ return fract(sin(n * 127.1 + uSeed) * 43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
float vn1(float x){ float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(h11(i), h11(i + 1.), f); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
// sun-side tint of the falling grain: white-gold where the sun strikes, ghost blue at a third on the far flank
vec3 grainTint(vec3 outward){ return mix(uBlue * 0.33, uGold, smoothstep(-0.2, 0.5, dot(outward, uSun))); }
// the same for the bell's walls: seen from outside, the sunlit flank is held back so that its foot never burns out to white
vec3 wallTint(vec3 outward){ return mix(uBlue * 0.33, uGold * mix(0.6, 1., uInside), smoothstep(-0.2, 0.5, dot(outward, uSun))); }
`,Q=`
#include <common>
#include <fog_pars_vertex>
`,O=`
#include <common>
#include <fog_pars_fragment>
uniform float uFogK;
float fogAmt(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return (1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth)) * uFogK;
    #else
      return smoothstep(fogNear, fogFar, vFogDepth) * uFogK;
    #endif
  #else
    return 0.;
  #endif
}
vec3 fogAdd(vec3 c){ return c * (1. - fogAmt()); }      // additive things fade out
vec3 fogMix(vec3 c){
  #ifdef USE_FOG
    return mix(c, fogColor, fogAmt());
  #else
    return c;
  #endif
}
`;function te(t,n,e,b=.012,w=1,y=1){const h=[],o=[],m=[],f=[];for(let r=0;r<=e;r++){const c=re(b,w,Math.pow(r/e,y)),v=D*t*c,d=z*(1-c*c),s=2*z*c/(D*t),p=1/Math.hypot(s,1);for(let M=0;M<=n;M++){const G=M/n*T,S=Math.cos(G),F=Math.sin(G);h.push(v*S,d,v*F),o.push(S*s*p,p,F*s*p),m.push(M/n,c)}}for(let r=0;r<e;r++)for(let c=0;c<n;c++){const v=r*(n+1)+c,d=v+1,s=v+n+1,p=s+1;f.push(v,d,s,d,p,s)}const a=new i.BufferGeometry;return a.setAttribute("position",new i.Float32BufferAttribute(h,3)),a.setAttribute("normal",new i.Float32BufferAttribute(o,3)),a.setAttribute("uv",new i.Float32BufferAttribute(m,2)),a.setIndex(f),a.boundingSphere=new i.Sphere(u(0,z*.4,0),3600),a}const ue=`
${Q}
attribute float aK;
varying vec3 vW, vN; varying vec2 vAS; varying float vK;
void main(){
  vAS = uv; vK = aK;
  vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fe=`
${O}
${J}
uniform float uRibsMain, uRibsHair, uBase, uLining, uSurge, uScale, uSoft; uniform vec3 uOrigin;
varying vec3 vW, vN; varying vec2 vAS; varying float vK;
// value noise that wraps in x after n cells (the azimuth closes on itself without a seam)
float vn2p(vec2 p, float n){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); float x0 = mod(i.x, n), x1 = mod(i.x + 1., n);
  return mix(mix(h21(vec2(x0, i.y)), h21(vec2(x1, i.y)), f.x), mix(h21(vec2(x0, i.y + 1.)), h21(vec2(x1, i.y + 1.)), f.x), f.y); }
// one family of ribs from the azimuth; below ~2 px it settles to its mean tone (no moire)
float ribs(float a01, float n, float w, float fw, float salt){
  float x = a01 * n, id = floor(x), f = abs(fract(x) - 0.5), px = max(fw * n, 1e-4);
  float tt = clamp(1. - f / (w + px), 0., 1.), line = tt * tt * (3. - 2. * tt);       // soft bell across each rib
  float br = 0.25 + 0.75 * h11(mod(id, n) + salt);
  return mix(line * br, w * 0.62, smoothstep(0.22, 0.55, px));
}
void main(){
  float a01 = vAS.x, s = vAS.y;
  vec3 V = normalize(cameraPosition - vW), N = normalize(vN);
  float nv = dot(N, V), anv = abs(nv);
  float fw = fwidth(a01); fw = min(fw, 0.02);
  float ph = s - uTime / ${ee.toFixed(1)};                       // the grain's own phase: pattern and grains fall together
  float hair = ribs(a01, uRibsHair, 0.2, fw, 7.);
  float mainR = ribs(a01, uRibsMain, 0.16, fw, 91.);
  float fine = ribs(a01 + 0.37 / uRibsHair, uRibsHair * 4., 0.3, fw, 33.);
  float idH = floor(a01 * uRibsHair), idM = floor(a01 * uRibsMain);
  float knH = 0.45 + 0.9 * vn1(ph * 46. + h11(idH) * 40.) * vn1(ph * 9. + h11(idH + 5.) * 9.) * 2.;
  float knM = 0.6 + 0.8 * vn1(ph * 30. + h11(idM + 3.) * 40.);
  float wave = 1. + uSurge * (0.5 + 0.5 * sin(ph * 6.2832 * 14.));   // 'surging' variation: density waves riding down
  float crown = smoothstep(0.03, 0.22, s);                         // ribs fade into the crown boss
  float pat = 0.36 + crown * (1.5 * hair * knH + 2.6 * mainR * knM + 0.6 * fine) * wave;
  // close up the grain itself shows: fine falling streaks that melt into the mean tone with distance
  float fpx = fw * uRibsHair * 16.;
  pat *= mix(0.55 + 0.9 * vn2(vec2(a01 * uRibsHair * 16., ph * 1500.)), 1., smoothstep(0.04, 0.3, fpx));
  // from inside, the bell is a luminous ceiling and not a rain of hairlines: the hair ribs melt halfway into broad sheaves
  // and slow clouds of denser grain that fall with the pattern, so the fall reads as glowing volume
  float cl = vn2p(vec2(a01 * 144., ph * 26.), 144.) * (0.35 + 1.3 * vn2p(vec2(a01 * 48. + 0.5, ph * 9. + 7.), 48.));
  float sheaf = 0.45 + 1.1 * vn2p(vec2(a01 * 60., 3.7), 60.);
  float patIn = 0.42 + crown * ((0.55 * hair * knH + 1.5 * mainR * knM + 0.2 * fine) * wave + (0.26 + 2.0 * cl) * sheaf);
  pat = mix(pat, patIn, uInside * uSoft);
  pat = mix(1.3, pat, crown);
  float limb = min(7., 1. / max(0.08, anv));
  float farK = mix(mix(1., 0.5, step(nv, 0.)), 0.7, uInside);       // far wall at half strength; inside: 0.07 face-on
  float kNearP = uLining * (1. - smoothstep(50., 150., length(vW - uPortal) / uScale));      // the lining keeps its full light round the ring
  float alpha = uBase * limb * pat * farK * mix(uDim, mix(uDimL, max(uDimL, 0.6), kNearP), uLining);      // uDim: the world eases the outer bell down on the climb to the ring
  vec3 outward = normalize(vec3(N.x, 0., N.z) + vec3(1e-5, 0., 0.));
  vec3 col = wallTint(outward);
  // the sun seen through the grain: a gold aureole (forward scatter), strongest from inside
  float fs = max(dot(-V, uSun), 0.); float f2 = fs * fs; float f8 = f2 * f2 * f2 * f2; float aure = f8 * f8 * f8;
  col += uGold * aure * (0.3 + 0.7 * step(nv, 0.) + 0.45 * uInside) * (0.6 + 0.8 * min(pat, 1.6)) / max(limb * 0.5, 1.);
  // foot of the bell: brighten slightly where the curtain thickens; top: thin toward the apex
  alpha *= mix(1., 1.35, smoothstep(0.93, 1., s) * (1. - uLining));
  // lining: part round the exit ring in a 46 m teardrop (grain is swept aside above, closes below)
  if (uLining > 0.5) {
    vec3 d = (vW - uPortal) / uScale; float up = d.y;
    float wdt = up > 0. ? 9.5 * sqrt(max(1. - up * up / 121., 0.)) : 9.5 * max(1. + up / 35., 0.);
    vec2 pr = (uPortal - uOrigin).xz; pr = pr / max(length(pr), 1e-3);
    float lat = abs(dot(d.xz, vec2(-pr.y, pr.x))) + 0.25 * max(abs(dot(d.xz, pr)) - 30., 0.);
    float tear = smoothstep(wdt - 1.5, wdt + 2.5, lat) + step(11., up) + step(up, -35.);
    float edge = exp(-abs(lat - wdt - 1.5) * 0.8) * smoothstep(-35., -24., up) * (1. - smoothstep(8., 13., up + (9.5 - wdt) * 0.4));
    alpha = alpha * clamp(tear, 0., 1.) + 0.42 * edge * (0.5 + 0.9 * vn2(vec2(a01 * 2600., ph * 2400.))) * step(vK, 0.17);
    // the arrival: within 130 m of the ring the falling grain itself shows, sunlit, sliding down both sides of the teardrop
    // and closing below it (the pattern is a function of the grain's phase, so it falls at the grain's 18 m/s)
    float kR = (1. - smoothstep(70., 190., length(d))) * step(vK, 0.17);
    float gr = smoothstep(0.7, 0.96, vn2(vec2(a01 * 4200., ph * 2100.))) + 0.6 * smoothstep(0.8, 0.98, vn2(vec2(a01 * 9500. + 7., ph * 3900.)));
    float flow = exp(-abs(lat - wdt - 3.) * 0.3) * smoothstep(-48., -30., up) * (1. - smoothstep(10., 22., up));
    alpha += gr * (0.3 + 1.2 * flow) * kR * clamp(tear, 0., 1.);
    alpha += exp(-lat * lat / 26.) * smoothstep(-125., -70., up) * (1. - smoothstep(-44., -33., up)) * (0.3 + 0.9 * gr) * step(vK, 0.17);      // the two streams closing below the ring: a bright seam
  }
  // a shell must never pop as the camera crosses it
  float dC = length(cameraPosition - vW) / uScale;
  float nearFade = mix(smoothstep(4., 60., dC) * mix(0.22, 1., smoothstep(60., 900., dC)), smoothstep(3., 22., dC), uLining);
  gl_FragColor = vec4(fogAdd(col * alpha * nearFade), 1.);
}`,xe=`
${Q}
${J}
uniform float uResY, uScale;
attribute vec4 aRib;                    // azimuth, s, side (-1..1), id
varying vec3 vOut; varying vec3 vP;     // vP = across (-1..1), phase coordinate, energy
varying float vId;
void main(){
  float a = aRib.x, s = aRib.y, k = 0.94 + 0.05 * (h11(aRib.w + 2.) - 0.5);
  vec3 rad = vec3(cos(a), 0., sin(a));
  vec3 p = vec3(${D}. * k * s * rad.x, ${z}. * (1. - s * s), ${D}. * k * s * rad.z);
  vec3 tang = normalize(vec3(${D}. * k * rad.x, -2. * ${z}. * s, ${D}. * k * rad.z));
  vec4 w = modelMatrix * vec4(p, 1.);
  vec3 toCam = cameraPosition - w.xyz; float dist = length(toCam);
  vec3 tw = normalize(mat3(modelMatrix) * tang);
  vec3 sideDir = cross(tw, toCam / max(dist, 1e-3));
  sideDir = sideDir / max(length(sideDir), 1e-3);
  float halfW = mix(3., 15., s) * (0.7 + 0.6 * h11(aRib.w)) * uScale * uRibW;     // uRibW: the world thins the ribs on the climb
  float pxW = 1.25 * dist * 2. / max(projectionMatrix[1][1] * uResY, 1.);   // half of the 2.5 px floor, in metres
  float hw = max(halfW, pxW);
  w.xyz += sideDir * aRib.z * hw;
  vOut = rad; vP = vec3(aRib.z, s, halfW / hw); vId = aRib.w;
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,we=`
${O}
${J}
uniform float uSurge;
varying vec3 vOut; varying vec3 vP; varying float vId;
void main(){
  float x = vP.x, s = vP.y, ph = s - uTime / ${ee.toFixed(1)};
  float g = exp(-x * x * 3.2);
  float kn = 0.35 + 1.3 * vn1(ph * 60. + h11(vId) * 50.) * (0.5 + vn1(ph * 13. + vId));
  kn += 1.6 * smoothstep(0.82, 1., vn1(ph * 240. + vId * 3.7));                 // bright packets of grain
  kn *= 1. + uSurge * (0.5 + 0.5 * sin(ph * 6.2832 * 14.));
  float fade = smoothstep(0.035, 0.16, s) * (0.55 + 0.45 * h11(vId + 11.));
  vec3 col = wallTint(vOut) * mix(1., 0.8, uInside) * uDimR + uBlue * 0.3 * (1. - smoothstep(-0.2, 0.5, dot(vOut, uSun))) * (1. - uDimR);      // uDimR: the ribbons keep more of their light than the shells on the climb, so they stay clean hairlines of gold and blue
  gl_FragColor = vec4(fogAdd(col * g * kn * fade * vP.z * 0.5), 1.);
}`;function be(t,n,e){const b=[],w=[];for(let h=0;h<t;h++){const o=(h+.5)/t*T,m=b.length/4;for(let f=0;f<=n;f++){const a=re(.03,1,f/n);if(b.push(o,a,-1,h,o,a,1,h),f<n){const r=m+f*2;w.push(r,r+1,r+2,r+1,r+3,r+2)}}}const y=new i.BufferGeometry;return y.setAttribute("aRib",new i.Float32BufferAttribute(b,4)),y.setAttribute("position",new i.Float32BufferAttribute(new Float32Array(b.length/4*3),3)),y.setIndex(w),y.boundingSphere=new i.Sphere(u(0,z*.4,0),3600),y}const Me=`
${O}
${J}
uniform float uScale;
varying vec3 vW, vN; varying vec2 vAS; varying float vK;
void main(){
  float a01 = vAS.x, s = vAS.y, ph = s - uTime / ${ee.toFixed(1)};
  vec3 V = normalize(cameraPosition - vW), N = normalize(vN);
  float anv = abs(dot(N, V));
  float fw = min(fwidth(a01), 0.01) * 2600., n = 2600.;             // streaks ~6 m apart at the rim
  float x = a01 * n + vK * 311., id = floor(x), f = abs(fract(x) - 0.5);
  float line = 1. - smoothstep(max(0.22 - fw, 0.), 0.22 + fw, f);
  float streak = line * (0.2 + 0.8 * h11(id)) * (0.3 + 1.4 * vn1(ph * 900. + h11(id + 9.) * 300.));
  streak = mix(streak, 0.3, smoothstep(0.2, 0.6, fw));
  float veil = 0.55 + 0.9 * vn2(vec2(a01 * 420. + vK * 40., ph * 150.)) * vn2(vec2(a01 * 90. - vK * 17., ph * 40.)) * 2.;
  float h01 = clamp((1. - s * s) * ${(z/320).toFixed(3)}, 0., 1.);            // 0 at the ground, 1 at the skirt's top edge
  float body = (1. - smoothstep(0.35, 1., h01)) * (0.75 + 0.6 * (1. - h01));
  float limb = min(3.5, 1. / max(0.12, anv));
  float dC = length(cameraPosition - vW) / uScale;
  float nearFade = smoothstep(6., 34., dC) * mix(0.3, 1., smoothstep(40., 700., dC));   // crossing a veil never pops, and the wall never whites out from within
  vec3 outward = normalize(vec3(N.x, 0., N.z) + vec3(1e-5, 0., 0.));
  vec3 col = mix(wallTint(outward), vec3(0.82, 0.88, 0.95) * (0.45 + 0.55 * smoothstep(-0.3, 0.4, dot(outward, uSun))) * mix(0.7, 1., uInside), 0.45);
  float nearK = 1. - smoothstep(120., 900., dC);
  float alpha = 0.11 * limb * body * (0.45 * veil + (1.1 + 1.3 * nearK) * streak) * (1. + 0.5 * nearK) * nearFade * mix(1., 0.6, uInside) * mix(1., uDim, 0.75);
  gl_FragColor = vec4(fogAdd(col * alpha), 1.);
}`;function ce(t,n){let e=0,b=0;for(const c of t)e+=c.attributes.position.count,b+=c.index.count;const w=new Float32Array(e*3),y=new Float32Array(e*3),h=new Float32Array(e*2),o=new Float32Array(e),m=new Uint32Array(b);let f=0,a=0;t.forEach((c,v)=>{w.set(c.attributes.position.array,f*3),y.set(c.attributes.normal.array,f*3),h.set(c.attributes.uv.array,f*2),o.fill(n[v],f,f+c.attributes.position.count);const d=c.index.array;for(let s=0;s<d.length;s++)m[a+s]=d[s]+f;f+=c.attributes.position.count,a+=d.length,c.dispose()});const r=new i.BufferGeometry;return r.setAttribute("position",new i.BufferAttribute(w,3)),r.setAttribute("normal",new i.BufferAttribute(y,3)),r.setAttribute("uv",new i.BufferAttribute(h,2)),r.setAttribute("aK",new i.BufferAttribute(o,1)),r.setIndex(new i.BufferAttribute(m,1)),r.boundingSphere=new i.Sphere(u(0,z*.4,0),3600),r}const oe=`
uniform float uTwist;
float jetR(float y01){ return mix(15., 35., y01) + 60. * y01 * y01 * y01 * y01 * y01 * y01 * y01 * y01; }
float flowQ(float y01){ return 1. - sqrt(max(1. - y01, 0.)); }       // inverse of y = APEX (1 - (1 - q)^2)
vec3 helix(float y, float id, float rMul){
  float y01 = clamp(y / ${z}., 0., 1.), ring = mod(id, 3.);
  float rr = (0.30 + 0.29 * ring) * jetR(y01) * rMul;
  float dir = ring > 0.5 && ring < 1.5 ? -1. : 1.;
  float ang = id * 0.6981 + dir * (y * ${(T/400).toFixed(6)} * uTwist + uTime * 0.07) + 0.6 * sin(y * 0.004 + id * 1.7);
  return vec3(cos(ang) * rr, y, sin(ang) * rr);
}`,Se=`
${Q}
${J}
${oe}
varying vec3 vW, vN; varying vec2 vAQ;
void main(){
  float y01 = uv.y, a = uv.x * 6.2831853;
  float q = flowQ(y01) - uTime / 40.;
  float r = jetR(y01) * (0.86 + 0.2 * vn2(vec2(uv.x * 5., q * 60.)) + 0.1 * sin(a * 3. + y01 * 40. - uTime * 0.8));
  vec3 p = vec3(cos(a) * r, y01 * ${z}., sin(a) * r);
  vAQ = vec2(uv.x, y01);
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * vec3(cos(a), 0., sin(a)));
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Fe=`
${O}
${J}
${oe}
uniform float uJet;
varying vec3 vW, vN; varying vec2 vAQ;
void main(){
  vec3 V = normalize(cameraPosition - vW), N = normalize(vN);
  float f = abs(dot(N, V)), y01 = vAQ.y;
  float q = flowQ(y01) - uTime / 40.;
  float streak = vn2(vec2(vAQ.x * 28., q * 30.)) * 0.6 + vn2(vec2(vAQ.x * 9. + q * 3., q * 140.)) * 0.7;
  float puff = vn1(q * 55.) * vn1(q * 13. + 4.);
  float body = f * f * (0.35 + 0.9 * streak + 0.7 * puff);
  vec3 col = mix(vec3(0.80, 0.90, 1.0), grainTint(N) * 1.15 + vec3(0.25), 0.55);
  float foot = smoothstep(0.0, 0.004, y01) * (1. + 1.4 * exp(-y01 * 50.));         // hottest in the throat
  float top = 1. - 0.55 * smoothstep(0.8, 1., y01);
  gl_FragColor = vec4(fogAdd(col * body * foot * top * uJet * 0.24 * mix(1., 0.5, uBraid) * (gl_FrontFacing ? 1. : 0.55)), 1.);     // uBraid: close by, the core's fill steps back so the strands and knots carry the light
}`,ze=`
${Q}
${J}
${oe}
uniform float uResY, uScale;
attribute vec3 aT;                      // y01, ring angle, strand id
varying vec3 vW, vN; varying vec3 vT;
void main(){
  float y01 = aT.x, y = y01 * ${z}. * 0.992, id = aT.z;
  vec3 c = helix(y, id, 1.);
  float q = flowQ(y01) - uTime / 40.;
  float tr = mix(3.2, 7., y01) * (0.75 + 0.7 * vn1(q * 90. + id * 7.)) * mix(1., 0.68, uBraid);               // lumpy: grain bunching; thinner close by, so dark gaps show between the braids
  vec4 wc = modelMatrix * vec4(c, 1.);
  float dist = length(cameraPosition - wc.xyz);
  float pxW = 0.8 * dist * 2. / max(projectionMatrix[1][1] * uResY, 1.);
  float rr = max(tr * uScale, pxW);
  vec3 n = vec3(cos(aT.y), 0., sin(aT.y));
  vec4 w = wc + vec4(mat3(modelMatrix) * n * (rr / uScale), 0.);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * n); vT = vec3(y01, id, tr * uScale / rr);
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ae=`
${O}
${J}
${oe}
uniform float uJet;
varying vec3 vW, vN; varying vec3 vT;
void main(){
  vec3 V = normalize(cameraPosition - vW), N = normalize(vN);
  float f = max(dot(N, V), 0.), y01 = vT.x, id = vT.y;
  float q = flowQ(y01) - uTime / 40.;
  float kn = (0.25 + 0.9 * vn1(q * 90. + id * 7.)) * mix(1., 0.8, uBraid) + (1.3 + 2.2 * uBraid) * smoothstep(0.72, 1., vn1(q * 260. + id * 31.));   // knots: beads of brighter grain
  float sun = 0.55 + 0.45 * smoothstep(-0.4, 0.6, dot(N, uSun));
  vec3 col = mix(grainTint(N), vec3(0.86, 0.93, 1.0), 0.5) * sun;
  float top = 1. - smoothstep(0.9, 1., y01);
  float foot = smoothstep(0.0, 0.006, y01);
  gl_FragColor = vec4(fogAdd(col * mix(f * sqrt(f), f * f * f * 1.2, uBraid) * kn * top * foot * vT.z * uJet * 0.6), 1.);
}`;function Re(t,n){const e=new i.PlaneGeometry(1,1,t,n);return e.boundingSphere=new i.Sphere(u(0,z*.5,0),z*.6),e}function Ce(t,n,e){const b=[],w=[];for(let h=0;h<t;h++){const o=b.length/3;for(let m=0;m<=e;m++){const f=Math.pow(m/e,1.5);for(let a=0;a<=n;a++)b.push(f,a/n*T,h)}for(let m=0;m<e;m++)for(let f=0;f<n;f++){const a=o+m*(n+1)+f,r=a+1,c=a+n+1,v=c+1;w.push(a,c,r,r,c,v)}}const y=new i.BufferGeometry;return y.setAttribute("aT",new i.Float32BufferAttribute(b,3)),y.setAttribute("position",new i.Float32BufferAttribute(new Float32Array(b.length),3)),y.setIndex(w),y.boundingSphere=new i.Sphere(u(0,z*.5,0),z*.6),y}const ke=`
${Q}
${J}
${oe}
uniform float uResY, uScale;
attribute vec4 aI, aJ;
varying vec2 vC; varying vec4 vCol;
void main(){
  float type = aI.w, fade = 1., size = aJ.x, tw = 1.;
  vec3 p, outward;
  if (type < 1.5) {
    float s = fract(aI.z + uTime / ${ee.toFixed(1)}), a = aI.x;
    outward = vec3(cos(a), 0., sin(a));
    p = vec3(${D}. * aI.y * s * outward.x, ${z}. * (1. - s * s), ${D}. * aI.y * s * outward.z);
    fade = smoothstep(0.03, 0.12, s) * (1. - smoothstep(0.985, 1., s));
    tw = 0.35 + 2.2 * pow(abs(sin(uTime * (0.5 + aJ.y) + aJ.z * 6.283)), 10.);
  } else if (type < 3.5) {
    float q = fract(aI.z + uTime / 40.), y01 = 1. - (1. - q) * (1. - q);
    p = helix(y01 * ${z}. * 0.992, aI.x, aI.y);
    if (type > 2.5) { p.xz += (vec2(aJ.y, aJ.z) - 0.5) * jetR(y01) * 0.9; tw = 0.3 + 2.4 * pow(abs(sin(uTime * (1.2 + 2. * aJ.y) + aJ.z * 6.283)), 8.); }
    else size *= mix(1., 2.4, y01) * (0.8 + 0.4 * sin(q * 40. + aJ.y * 6.283));
    outward = normalize(vec3(p.x, 0., p.z) + vec3(1e-4, 0., 0.));
    fade = smoothstep(0., 0.02, q) * (1. - smoothstep(0.8, 1., q));
  } else {
    float sw = 1. + 0.22 * sin(uTime * (0.25 + 0.3 * aJ.y) + aJ.z * 6.283);     // the crown boss swelling and settling
    outward = vec3(cos(aI.x), 0., sin(aI.x));
    p = outward * aI.y * sw + vec3(0., ${z}. - aI.y * aI.y * 0.0009 + aI.z * 34. * sw, 0.);
    size *= sw;
  }
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(p, 1.);
  float sz = size * uScale, floorSz = 0.75 * (-mvPosition.z) * 2. / max(projectionMatrix[1][1] * uResY, 1.);
  float big = max(sz, floorSz);
  float energy = sz / big; energy = max(energy * energy, 0.1);
  mvPosition.xy += position.xy * big * 2.;
  vC = position.xy * 2.;
  vec3 tint = type < 1.5 ? grainTint(outward) : mix(grainTint(outward), vec3(0.86, 0.93, 1.), 0.45);
  float dimK = type < 0.5 ? mix(1., uDim, 0.8) : (type < 1.5 ? mix(1., uDimL, 0.6) : 1.);      // the bell's own grains ease down with it on the climb
  vCol = vec4(tint * aJ.w * fade * tw * energy * dimK, type);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Be=`
${O}
uniform float uJet;
varying vec2 vC; varying vec4 vCol;
void main(){
  float r2 = dot(vC, vC);
  float soft = exp(-r2 * 3.5) * (1. - smoothstep(0.7, 1., r2));
  float core = exp(-r2 * 14.);
  float m = vCol.w > 3.5 ? soft * 0.55 : (vCol.w > 1.5 ? (soft * 0.4 + core * 0.7) * uJet : soft + core);
  gl_FragColor = vec4(fogAdd(vCol.rgb * m), 1.);
}`,Pe=`
${Q}
${J}
varying vec3 vW, vN; varying vec2 vAS;
void main(){
  vAS = uv; float e = 1. - clamp(uv.y / 0.1, 0., 1.);
  float sw = 1. + 0.16 * sin(uTime * 0.31) + 0.1 * sin(uTime * 0.83 + uv.x * 18.85);
  vec3 p = position; p.y += 55. * e * e * sw; p.xz *= 1. + 0.05 * (sw - 1.);
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ie=`
${O}
${J}
uniform float uJet, uRibsMain;
varying vec3 vW, vN; varying vec2 vAS;
void main(){
  float a01 = vAS.x, s = vAS.y, e = 1. - clamp(s / 0.1, 0., 1.);
  vec3 V = normalize(cameraPosition - vW), N = normalize(vN);
  float limb = min(3., 1. / max(0.2, abs(dot(N, V))));
  float ph = s - uTime / ${ee.toFixed(1)};
  float lobes = 0.5 + 0.5 * sin(a01 * 6.2832 * 9. + uTime * 0.07 * 9. + s * 60.);       // the nine strands turning over
  float spokes = 0.5 + 0.5 * cos(a01 * 6.2832 * uRibsMain);
  float rings = vn1(ph * 420. + 3. * sin(a01 * 6.2832 * 3.)) * 0.8 + vn2(vec2(a01 * 60., ph * 900.)) * 0.5;
  float d = e * e * (0.5 + 0.7 * lobes * e + 0.45 * rings) + (1. - e) * e * 1.2 * spokes * (0.4 + rings);
  vec3 col = mix(vec3(0.82, 0.91, 1.), uGold, 0.35 + 0.4 * smoothstep(-0.3, 0.6, dot(N, uSun)));
  float edge = smoothstep(0., 0.25, 1. - e) ;
  gl_FragColor = vec4(fogAdd(col * (0.05 + 0.3 * d) * limb * uJet * mix(1.5, 1., edge) * smoothstep(0., 0.2, e)), 1.);
}`,Ne=`
${Q}
uniform float uTime, uShake;
attribute vec3 color; attribute float aF;
varying vec3 vW, vN, vC; varying float vF;
void main(){
  vC = color; vF = aF;
  vec3 p = position;
  // frost shaking in the roar: a fine shiver on frosted parts only, strongest high on the cone
  float sh = uShake * aF * smoothstep(20., 60., p.y);
  p += normal * sh * 0.22 * sin(uTime * 23. + p.x * 1.7 + p.z * 2.3 + p.y) + vec3(sin(uTime * 17. + p.y * 0.9), 0., cos(uTime * 19. + p.y * 1.1)) * sh * 0.08;
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Te=`
${O}
${J}
uniform vec3 uKeyCol, uBounce, uPlanetDir, uJetPos; uniform float uJetLight, uScale;
varying vec3 vW, vN, vC; varying float vF;
void main(){
  vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
  if (!gl_FrontFacing) N = -N;
  // fine procedural breakup: crystalline grain on frost, pitted crust on sulphur
  vec3 q = vW / uScale;
  float g1 = vn2(q.xz * 0.9 + q.y * 0.7), g2 = vn2(q.xz * 5.3 - q.y * 3.1), g3 = vn2(vec2(q.x + q.z, q.y) * 19.);
  vec3 alb = vC * (0.80 + 0.22 * g1 + 0.12 * g2 - 0.08 * g3 * (1. - vF));
  alb = min(alb, vec3(0.78));
  float ndl = dot(N, uSun);
  float key = mix(smoothstep(-0.02, 0.10, ndl) * max(ndl, 0.), clamp((ndl + 0.55) / 1.55, 0., 1.), vF * 0.55);   // frost scatters: light wraps round it
  vec3 fill = mix(uBounce * 0.35, vec3(0.56, 0.65, 0.78) * 0.62, vF * 0.85) * (0.75 - 0.25 * N.y)      // ground bounce; blue in snow shadow
            + vec3(0.81, 0.89, 1.) * 0.2 * (0.5 + 0.5 * N.y)                                              // the plume overhead
            + vec3(0.616, 0.722, 0.604) * 0.12 * max(dot(N, uPlanetDir), 0.);                             // planet-shine
  // the jet itself lights whatever stands near it
  vec3 toJ = uJetPos - vW; toJ.y = 0.; float dj = length(toJ) / uScale;
  fill += vec3(0.8, 0.9, 1.) * uJetLight * max(dot(N, toJ / max(length(toJ), 1e-3)) * 0.6 + 0.4, 0.) / (1. + dj * dj * 0.0006);
  vec3 col = alb * (uKeyCol * key * 1.12 + fill);
  // frost glints: sparse facets that catch the sun and turn over slowly
  vec2 cell = floor(q.xz * 2.2 + q.y * 1.3); float hh = h21(cell);
  vec3 fn = normalize(N + (vec3(h21(cell + 3.), h21(cell + 7.), h21(cell + 13.)) - 0.5) * 0.9);
  vec3 Hh = normalize(uSun + V + vec3(0., 1e-3, 0.)); float sp = max(dot(fn, Hh), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  float blink = smoothstep(0.55, 1., sin(uTime * (0.6 + hh) + hh * 40.));
  col += uGold * sp * blink * vF * step(0.72, hh) * 3.2 * smoothstep(-0.02, 0.1, ndl);
  { float rimF = 1. - abs(dot(N, V)); col += uGold * vF * 0.14 * rimF * rimF; }                                                // sub-surface rim on thin frost
  gl_FragColor = vec4(fogMix(col), 1.);
}`;function ve(){const t=[],n=[],e=[],b=[],w=u(),y=u(),h=u();return{P:t,N:n,C:e,F:b,tri(o,m,f,a,r){w.subVectors(m,o),y.subVectors(f,o),h.crossVectors(w,y).normalize();for(const c of[o,m,f])t.push(c.x,c.y,c.z),n.push(h.x,h.y,h.z),e.push(a.r,a.g,a.b),b.push(r)},blade(o,m,f,a,r,c,v,d=0){const s=m.clone().normalize(),p=Math.abs(s.y)>.9?u(1,0,0):u(0,1,0),M=u().crossVectors(s,p).normalize(),G=u().crossVectors(s,M).normalize(),S=Math.cos(d),F=Math.sin(d),R=M.clone().multiplyScalar(S).addScaledVector(G,F),I=G.clone().multiplyScalar(S).addScaledVector(M,-F),B=o.clone().addScaledVector(s,f*.32),q=o.clone().addScaledVector(s,f),P=[B.clone().addScaledVector(R,a),B.clone().addScaledVector(I,a*.35),B.clone().addScaledVector(R,-a),B.clone().addScaledVector(I,-a*.35)];for(let N=0;N<4;N++){const Y=(N+1)%4;this.tri(o,P[Y],P[N],r,v*.7),this.tri(P[N],P[Y],q,c,v)}},addIndexed(o,m,f){const a=o.toNonIndexed(),r=a.attributes.position.array,c=a.attributes.normal.array,v=o.index.array;for(let d=0;d<r.length;d++)t.push(r[d]),n.push(c[d]);for(let d=0;d<v.length;d++){const s=v[d];e.push(m[s*3],m[s*3+1],m[s*3+2]),b.push(f[s])}a.dispose(),o.dispose()},build(){const o=new i.BufferGeometry;return o.setAttribute("position",new i.Float32BufferAttribute(t,3)),o.setAttribute("normal",new i.Float32BufferAttribute(n,3)),o.setAttribute("color",new i.Float32BufferAttribute(e,3)),o.setAttribute("aF",new i.Float32BufferAttribute(b,1)),o.computeBoundingSphere(),o}}}async function _e(t,n,e,b,w){const y=ve(),h=144,o=[],m=t.int(6,10),f=t.range(0,T),a=t.range(0,100);for(let x=0;x<=52;x++)o.push({t:x/52,part:0});o.push({t:1,part:1,r:13.2,dy:.9},{t:1,part:1,r:12.2,dy:.2},{t:1,part:1,r:11.7,dy:-2.5});for(let x=1;x<=4;x++)o.push({t:1,part:2,r:11.7-x*.5,dy:-2.5-x*7});const r=(x,g,W=u())=>{const C=Math.cos(x),V=Math.sin(x);let j=re(b.coneR,14.6,Math.pow(g,.8)),_=b.coneH*Math.pow(g,1.75);const X=.5+.5*Math.sin(x*m+f+2.2*n.n2(C*1.3+a,V*1.3));j*=1+(1-g)*(.2*X+.14*n.fbm2(C*2.2+a,V*2.2+g*1.5,3));const Z=Math.abs(n.n3(C*3.4+a,V*3.4,g*2.2));j*=1-.11*(1-Z)*(1-Z)*Math.sin(Math.min(1,g*1.3)*Math.PI);const H=_/3.6,le=H-Math.floor(H);return _=re(_,(Math.floor(H)+L(.6,.92,le))*3.6,.9*(1-g*.7)*L(.02,.15,g)),_+=g*g*b.rimBreak*n.n2(C*2.6+9+a,V*2.6),W.set(C*j,_,V*j)},c=[],v=[],d=[],s=[],p=u(),M=new i.Color,G=K(e[2]),S=K(e[0]),F=K(e[1]),R=K(e[6]);for(let x=0;x<o.length;x++){const g=o[x];w&&x%6===5&&await w();for(let W=0;W<=h;W++){const C=W/h*T;if(r(C,g.t,p),g.part>0){const H=p.y;p.set(Math.cos(C)*g.r,H+g.dy,Math.sin(C)*g.r)}c.push(p.x,p.y,p.z);const V=n.fbm2(p.x*.045+a,p.z*.045,3),j=n.n3(Math.cos(C)*4.5,Math.sin(C)*4.5,g.t*3+a);let _=L(.1,.5,g.t+.3*V+.12*j);_=Math.max(_,.8*L(.55,.9,p.y/3.6%1)*L(.08,.3,g.t)),M.copy(G).lerp(S,.45).multiplyScalar(.7).lerp(S,L(-.05,.26,g.t+.3*V)).multiplyScalar(.72+.2*j),M.lerp(F,_*.92).multiplyScalar(.78/.9);const X=Math.abs(n.n3(Math.cos(C)*3.4+a,Math.sin(C)*3.4,g.t*2.2)),Z=L(.55,.75,p.y/3.6%1)*(1-L(.9,1,p.y/3.6%1));M.multiplyScalar((.62+.38*L(0,.35,X))*(1-.3*Z*(1-g.t))),g.part===2&&(M.lerp(R,.55),_*=.4),v.push(M.r,M.g,M.b),d.push(_)}}w&&await w();for(let x=0;x<o.length-1;x++)for(let g=0;g<h;g++){const W=x*(h+1)+g,C=W+1,V=W+h+1,j=V+1;s.push(W,V,C,C,V,j)}const I=new i.BufferGeometry;I.setAttribute("position",new i.Float32BufferAttribute(c,3)),I.setIndex(s),I.computeVertexNormals(),w&&await w(),y.addIndexed(I,v,d),w&&await w();const B=K("#FFF0C8"),q=new i.Color,P=new i.Color,N=u(),Y=u(),ae=Math.round(84*b.detail);for(let x=0;x<ae;x++){const g=x/ae*T+t.range(-.03,.03);r(g,t.range(.93,1),N),N.y-=.4,Y.set(Math.cos(g)*t.range(.1,.9),1,Math.sin(g)*t.range(.1,.9)).add(u(t.range(-.3,.3),0,t.range(-.3,.3))),q.copy(F).multiplyScalar(.8),P.copy(F).lerp(B,.5).multiplyScalar(.86),y.blade(N,Y,t.range(2.5,8.5),t.range(.5,1.1),q,P,1,t.range(0,3))}const se=Math.round(46*b.detail);for(let x=0;x<se;x++){const g=t.range(0,T),W=t.range(.12,.9);r(g,W,N);const C=t.int(6,9),V=t.range(1.6,4.6),j=u(Math.cos(g),1.1,Math.sin(g));for(let _=0;_<C;_++){const X=_/C*T+t.range(-.2,.2);Y.set(Math.cos(X),t.range(.25,.8),Math.sin(X)).addScaledVector(j,.5),q.copy(S).lerp(F,.7).multiplyScalar(.8),P.copy(F).multiplyScalar(.86),y.blade(N,Y,V*t.range(.6,1),V*.13,q,P,1,t.range(0,3))}}return y.build()}function $e(t,n,e){const b=ve(),w=K(n[1]),y=K("#FFF0C8"),h=new i.Color,o=new i.Color,m=7.55,f=72,a=8,r=[],c=[],v=[],d=[];for(let S=0;S<=f;S++)for(let F=0;F<=a;F++){const R=S/f*T,I=F/a*T,B=.4+.12*Math.sin(R*11+e.seed)+.1*Math.sin(R*29+2*e.seed),q=m+B+Math.cos(I)*B;r.push(Math.cos(R)*q,Math.sin(R)*q,Math.sin(I)*B*1.2),h.copy(w).lerp(y,.35+.3*Math.sin(R*5+I)).multiplyScalar(.8),c.push(h.r,h.g,h.b),v.push(.9)}for(let S=0;S<f;S++)for(let F=0;F<a;F++){const R=S*(a+1)+F,I=R+1,B=R+a+1,q=B+1;d.push(R,B,I,I,B,q)}const s=new i.BufferGeometry;s.setAttribute("position",new i.Float32BufferAttribute(r,3)),s.setIndex(d),s.computeVertexNormals(),b.addIndexed(s,c,v);const p=Math.round(420*e.detail),M=u(),G=u();for(let S=0;S<p;S++){const F=S/p*T+t.range(-.02,.02),R=S%3,I=Math.cos(F),B=Math.sin(F),q=R===0?t.range(-.15,.15):R===1?t.range(.5,1.1):-t.range(.5,1.1),P=(R===0?t.range(2.2,3.9):t.range(.9,2.6))*(1+.35*Math.max(0,B))*(t.chance(.25)?.5:1);M.set(I*(m+.5),B*(m+.5),q*.3),G.set(I+t.range(-.25,.25)*-B,B+t.range(-.25,.25)*I,q),h.copy(w).lerp(y,.5).multiplyScalar(.74),o.copy(y).lerp(w,t.range(0,.5)).multiplyScalar(.9),b.blade(M,G,P,P*t.range(.07,.12),h,o,1,t.range(0,3))}return b.build()}const We=["#F2D24B","#E9EFE6","#D9502B","#9DB89A","#6FB4FF","#0A0C1A","#1A1410"];async function Le(t,n={}){const e=t.rng.fork?t.rng.fork("parasol"):t.rng,b=t.noise,w=n.palette&&n.palette.length>=7?n.palette:We,y=ye(n.detail??t.quality?.detail??1,.5,1),h=n.east===1?1:-1,o=(l,k,$)=>u(l*h,k,$),m=(n.sunElevation??14)*Math.PI/180,f=n.sunDir?u().copy(n.sunDir).normalize():u(h*Math.cos(m),Math.sin(m),0),a={detail:y,seed:e.range(0,50),coneR:e.range(88,104),coneH:60,rimBreak:e.range(3,7),hair:e.int(21,27)*20,twist:e.sign()*e.range(.85,1.25),surge:n.surge??(e.chance(.3)?e.range(.5,.9):0)},r=n.portal?u().copy(n.portal):o(300,545,-208),c=(n.portalDir?u().copy(n.portalDir):u(0,.5,-Math.cos(Math.PI/6))).normalize(),v={uTime:{value:0},uFogK:{value:n.fog??0},uInside:{value:0},uDim:{value:1},uDimL:{value:1},uDimR:{value:1},uRibW:{value:1},uBraid:{value:0},uSeed:{value:a.seed},uSun:{value:f},uGold:{value:K("#FFF0C8")},uBlue:{value:K(w[4])},uPortal:{value:r.clone()},uScale:{value:1},uResY:{value:900},uJet:{value:1},uTwist:{value:a.twist},uSurge:{value:a.surge},uRibsMain:{value:96},uRibsHair:{value:a.hair},uOrigin:{value:u()},uSoft:{value:1}},d=(l,k,$={},E={})=>new i.ShaderMaterial({vertexShader:l,fragmentShader:k,fog:!0,uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),...v,...$},transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,side:i.DoubleSide,...E}),s=new i.Group;s.name="brimstone-parasol";const p=(l,k,$)=>{const E=new i.Mesh(l,k);return E.frustumCulled=!1,E.renderOrder=$,s.add(E),E},M=p(ce([te(1,160,36),te(.88,160,36)],[1,.88]),d(ue,fe,{uBase:{value:.052},uLining:{value:0}}),2);await t.yield?.();const G=p(ce([te(.19,96,24,.05),te(.166,96,24,.05)],[.19,.166]),d(ue,fe,{uBase:{value:.032},uLining:{value:1},uRibsMain:{value:48},uRibsHair:{value:a.hair/4}}),3);await t.yield?.();const S=p(be(96,40,e),d(xe,we),4);await t.yield?.();const F=[.88,.91,.94,.97,1],R=p(ce(F.map(l=>te(l,160,4,Math.sqrt(1-320/z),1)),F),d(ue,Me),5);await t.yield?.();const I=p(Re(32,64),d(Se,Fe),6);await t.yield?.();const B=p(Ce(9,6,100),d(ze,Ae,{},{side:i.FrontSide}),7),q=p(te(1,96,10,5e-4,.1),d(Pe,Ie),8);await t.yield?.();const P=[],N=[],Y=Math.round(9e3*y),ae=Math.round(1800*y),se=Math.round(2600*y);for(let l=0;l<Y;l++){const k=e.chance(.65),$=k?(e.int(0,95)+.5)/96*T+e.gauss()*.004:e.range(0,T);P.push($,k?e.range(.92,.96):e.range(.88,1),e(),0),N.push(e.range(2,5),e(),e(),e.range(.5,1.3))}for(let l=0;l<ae;l++)P.push(e.range(0,T),e.range(.16,.19),e(),1),N.push(e.range(.7,1.8),e(),e(),e.range(.5,1.2));for(let l=0;l<504;l++)P.push(l%9,1,e(),2),N.push(e.range(4.5,9),e(),e(),e.range(.7,1.4));for(let l=0;l<se;l++)P.push(e.int(0,8),e.range(1.2,2.5),e(),3),N.push(e.range(.5,1.5),e(),e(),e.range(.8,2));for(let l=0;l<24;l++)P.push(e.range(0,T),150*Math.sqrt(e()),e.range(-.3,1),4),N.push(e.range(45,110),e(),e(),e.range(.07,.15));await t.yield?.();const x=new i.InstancedBufferGeometry;x.setAttribute("position",new i.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),x.setIndex([0,1,2,0,2,3]),x.setAttribute("aI",new i.InstancedBufferAttribute(new Float32Array(P),4)),x.setAttribute("aJ",new i.InstancedBufferAttribute(new Float32Array(N),4)),x.instanceCount=P.length/4;const g=p(x,d(ke,Be),9);await t.yield?.();const W={uShake:{value:.6},uKeyCol:{value:K("#FFF6E4")},uBounce:{value:K(w[0])},uPlanetDir:{value:u(-h*Math.sin(32*Math.PI/180),.12,Math.cos(32*Math.PI/180)).normalize()},uJetPos:{value:u()},uJetLight:{value:.55}},C=d(Ne,Te,W,{transparent:!1,depthWrite:!0,blending:i.NormalBlending}),V=p(await _e(e.fork?e.fork("cone"):e,b,w,a,()=>t.yield?.()),C,0);await t.yield?.(),await t.yield?.();const j=p($e(e.fork?e.fork("collar"):e,w,a),C,0);j.position.copy(r),j.quaternion.setFromUnitVectors(u(0,0,1),c.clone().negate());const _=de?de(s,d,v,e,w,a,n,p):null;await t.yield?.();const X=(l,k,$,E=u())=>E.set(D*k*$*Math.cos(l),z*(1-$*$),D*k*$*Math.sin(l)),Z={east:h,sunDir:f.clone(),portalSeat:{position:r.clone(),facing:c.clone().negate(),direction:c.clone(),radius:7,tiltDeg:30},flyThrough:[o(-380,8,-3300),o(-380,9,-2840),o(-380,10,-2500),o(-380,10,-2150),o(-372,90,-1560),o(-330,70,-900),o(-250,47,-520),o(-150,47,-390),o(60,47,-375),o(-250,60,300),o(-120,68,190),o(0,70,150),o(150,190,165),o(262,330,95),o(300,425,0),o(300,485,-104),o(300,545,-208)],viewpoints:{entry:{position:o(-380,8,-3300),lookAt:u(0,900,0)},ceiling:{position:o(-372,90,-1560),lookAt:u(0,1500,0)},jetPass:{position:o(0,70,150),lookAt:u(0,110,0)},exit:{position:o(300,425,0),lookAt:r.clone()}},jetBase:u(0,a.coneH,0),crown:u(0,z,0),jetRadiusBase:15,jetRadiusTop:35,cone:{radius:a.coneR*1.2,height:a.coneH+a.rimBreak,throatRadius:12},snowRing:{inner:2200,outer:2500},liningRing:{inner:400,outer:475},ribCount:96,ribAzimuth:l=>(l+.5)/96*T,law:X,fallSeconds:ee,rim:D,apex:z,shellHeightAt:(l,k=1)=>z*(1-(l/(D*k))**2)},H=u(),le=u(),he=new i.Vector2,me=new i.Matrix4;let ie=-1;S.onBeforeRender=l=>{const k=l.getRenderTarget();v.uResY.value=k?k.height:l.getDrawingBufferSize(he).y};const A={object:s,radius:D,height:z,center:u(0,z*.42,0),anchors:Z,ground:!0,groundY:0,uniforms:v,update(l,k,$){if(v.uTime.value=k,s.updateMatrixWorld(),v.uScale.value=le.setFromMatrixScale(s.matrixWorld).x,W.uJetPos.value.setFromMatrixPosition(s.matrixWorld),v.uOrigin.value.copy(W.uJetPos.value),$){H.setFromMatrixPosition($.matrixWorld).applyMatrix4(me.copy(s.matrixWorld).invert());const ne=Math.hypot(H.x,H.z),ge=z*(1-(ne/D)**2);v.uInside.value=L(-60,120,ge-H.y)*L(-40,160,D*.88-ne+180),v.uBraid.value=1-L(190,430,ne),_?.update(l,k,H,ne)}const E=ie<0?0:L(.74,.84,ie)*(1-L(.86,.95,ie));v.uJet.value=1+.3*E,W.uShake.value=.6+.6*E},setProgress(l){ie=l},setSun(l){f.copy(l).normalize()},setPortal(l){r.copy(l),v.uPortal.value.copy(l).applyMatrix4(s.matrixWorld),j.position.copy(l)},dispose(){}},pe=A.update;A.update=(l,k,$)=>{pe(l,k,$),v.uPortal.value.copy(r).applyMatrix4(s.matrixWorld)};let U=n.view;try{const l=new URLSearchParams(globalThis.location?.search||"");l.get("world")==="_part"&&(U=U||l.get("hv")||"out")}catch{}return U==="out"?(s.scale.setScalar(.2),A.radius=520,A.height=480,A.center=u(0,170,0)):U==="jet"?(A.radius=105,A.height=150,A.center=u(0,95,0)):U==="crown"?(A.radius=330,A.height=-500,A.center=u(0,2340,0),A.ground=!1):U==="ring"?(A.radius=14,A.height=14,A.center=r.clone()):U==="in"?(A.radius=500,A.height=-3900,A.center=u(0,2e3,0)):U==="entry"?(A.radius=1537,A.height=-2340,A.center=u(0,900,0)):U==="curtain"&&(A.radius=1095,A.height=-100,A.center=u(0,60,0)),A}const Ve=`
${Q}
varying vec3 vW; varying vec2 vRA;
void main(){
  vRA = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,De=`
${O}
${J}
uniform vec3 uSnow, uKeyCol; uniform float uRibsMain, uRibsHair;
varying vec3 vW; varying vec2 vRA;      // vRA = (0 inner edge .. 1 outer edge, azimuth 0..1)
void main(){
  float a01 = vRA.y, e = vRA.x, ang = a01 * 6.2831853;
  vec3 rad = vec3(cos(ang), 0., sin(ang)), tan_ = vec3(-rad.z, 0., rad.x);
  // spokes combed by the ribs: one ridge under each main rib, fine combing between; slope sign gives a lit and a blue side
  float fw = max(fwidth(a01), 1e-6);
  float xm = a01 * uRibsMain, xh = a01 * uRibsHair * 4.;
  float sm = cos(xm * 6.2831853 + 3.14159), sh = cos(xh * 6.2831853) * (1. - smoothstep(0.15, 0.5, fw * uRibsHair * 4.));
  float slope = -sin(xm * 6.2831853 + 3.14159) * 0.2 - sin(xh * 6.2831853) * 0.35 * (1. - smoothstep(0.15, 0.5, fw * uRibsHair * 4.));
  vec3 N = normalize(vec3(0., 1., 0.) - tan_ * slope * 0.55);
  float ndl = max(dot(N, uSun), 0.);
  float drift = vn2(vW.xz * 0.004) * 0.5 + vn2(vW.xz * 0.02) * 0.3 + vn2(vec2(e * 14., a01 * 900.)) * 0.2;
  vec3 alb = uSnow * (0.70 + 0.06 * sm + 0.05 * sh + 0.14 * drift);
  vec3 col = alb * (uKeyCol * ndl * 1.9 + vec3(0.56, 0.65, 0.78) * 0.5 + vec3(0.81, 0.89, 1.) * 0.16);
  col = min(col, vec3(0.8));
  vec2 cell = floor(vW.xz * 0.6); float hh = h21(cell);
  col += uGold * 2.4 * step(0.985, hh) * smoothstep(0.6, 1., sin(uTime * (0.5 + hh * 1.3) + hh * 50.)) * (1. - smoothstep(0.0, 0.004, fw));
  float edge = smoothstep(0., 0.22, e + 0.08 * (drift - 0.5)) * (1. - smoothstep(0.86, 1., e + 0.06 * (drift - 0.5)));
  gl_FragColor = vec4(fogMix(col), edge);
}`,Ge=`
${Q}
${J}
uniform vec3 uCamL; uniform float uResY, uScale;
attribute vec4 aB;                       // box position 0..1 (xyz), rnd
varying vec2 vC; varying vec3 vCol;
void main(){
  vec2 od = uCamL.xz / max(length(uCamL.xz), 1.);
  vec3 vel = vec3(od.x * 10., -20., od.y * 10.) * (0.8 + 0.4 * aB.w);          // sliding down and outward
  vec3 rel = mod(aB.xyz * 170. + vel * uTime - uCamL + 85., 170.) - 85.;
  vec3 p = uCamL + rel;
  float r = length(p.xz), kE = r / (${D}. * sqrt(max(1. - p.y / ${z}., 0.02)));
  float inC = smoothstep(0.868, 0.888, kE) * (1. - smoothstep(0.995, 1.012, kE)) * step(0.3, p.y);
  float veil = 0.5 + 0.5 * smoothstep(-0.2, 0.8, cos((kE - 0.88) / 0.03 * 6.2831853));     // five veils
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(p, 1.);
  float dist = -mvPosition.z;
  float sz = (0.22 + 0.5 * fract(aB.w * 7.13)) * uScale, fl = 0.75 * dist * 2. / max(projectionMatrix[1][1] * uResY, 1.);
  float big = max(sz, fl), energy = max(sz * sz / (big * big), 0.2);
  // a spinning facet: it flashes when its normal crosses the half vector (well under two glints a second each)
  vec3 Vv = normalize(uCamL - p + vec3(1e-4)), Hh = normalize(uSun + Vv + vec3(0., 1e-3, 0.));
  float th = uTime * (1.3 + 2.2 * fract(aB.w * 3.7)) + aB.w * 80., phi = aB.w * 40. + uTime * 0.2;
  vec3 fn = vec3(sin(th) * cos(phi), cos(th), sin(th) * sin(phi));
  float g = abs(dot(fn, Hh)); g *= g; g *= g; g *= g; g *= g; g *= g; g *= g;                 // ^64
  float edgeF = (1. - smoothstep(55., 85., length(rel))) * smoothstep(0.8, 3., dist / uScale);
  vec3 tint = mix(vec3(0.75, 0.83, 0.95), uGold, 0.3 + 0.7 * g);
  vCol = tint * (0.95 + 7. * g) * inC * veil * edgeF * energy;
  mvPosition.xy += position.xy * big * 2.4;
  vC = position.xy * 2.;
  gl_Position = inC * edgeF > 0.001 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
  #include <fog_vertex>
}`,qe=`
${O}
varying vec2 vC; varying vec3 vCol;
void main(){
  float r = length(vC);
  // a six-point card: three crossing needles and a soft heart
  float n0 = abs(vC.y), n1 = abs(dot(vC, vec2(0.866, 0.5))), n2 = abs(dot(vC, vec2(-0.866, 0.5)));
  float star = (exp(-n0 * 30.) + exp(-n1 * 30.) + exp(-n2 * 30.)) * (1. - smoothstep(0.25, 0.9, r)) * 0.75;
  float m = exp(-r * r * 22.) * 0.9 + star;
  gl_FragColor = vec4(fogAdd(vCol * m), 1.);
}`;function de(t,n,e,b,w,y,h,o){const m={ring:null,flakes:null,update(){}};if(h.snowRing!==!1){const v=new i.RingGeometry(2130,2560,384,6),d=v.attributes.position,s=v.attributes.uv;for(let M=0;M<d.count;M++){const G=d.getX(M),S=d.getY(M),F=Math.hypot(G,S);let R=Math.atan2(S,G)/T;R<0&&(R+=1),s.setXY(M,(F-2130)/430,R),d.setXYZ(M,G,0,S)}const p=385;for(let M=0;M<=6;M++)s.setY(M*p+384,1);m.ring=o(v,n(Ve,De,{uSnow:{value:K(w[1])},uKeyCol:{value:K("#FFF6E4")}},{blending:i.NormalBlending,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),1),m.ring.position.y=h.snowRingY??.6}const f=Math.round(8400*y.detail),a=new Float32Array(f*4);for(let v=0;v<f*4;v++)a[v]=b();const r=new i.InstancedBufferGeometry;r.setAttribute("position",new i.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),r.setIndex([0,1,2,0,2,3]),r.setAttribute("aB",new i.InstancedBufferAttribute(a,4)),r.instanceCount=f;const c={uCamL:{value:u()}};return m.flakes=o(r,n(Ge,qe,c),10),m.update=(v,d,s,p)=>{c.uCamL.value.copy(s),m.flakes.visible=p>1900&&p<2800&&s.y<700},m}export{Le as buildHero};
