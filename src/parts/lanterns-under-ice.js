import*as u from"three";import{clamp as $,lerp as C,smoothstep as L,bell as se}from"../kit/core.js";const _=140,R=70,S=512,ie=["#9fe8ff","#1c6f8f","#0a2f4f","#04121f","#010409","#19ffd0","#ff7a3c"],U=[.24,-.1,-.44,-.93],q=`
uniform sampler2D uPath;
uniform float uPathLen, uPathN, uDist, uSwimPh, uSwimAmp, uSwimK, uTime, uReveal, uWavePh, uWaveK;
const float HEAD_Z = 70.0;
const float LEN = 140.0;
void levPath(float d, out vec3 P, out vec3 T) {
  float f = clamp(d / uPathLen, 0.0, 1.0) * (uPathN - 1.0);
  float i = min(floor(f), uPathN - 2.0);
  float k = f - i;
  ivec2 a = ivec2(int(i), 0);
  P = mix(texelFetch(uPath, a, 0).xyz + texelFetch(uPath, a + ivec2(0, 2), 0).xyz, texelFetch(uPath, a + ivec2(1, 0), 0).xyz + texelFetch(uPath, a + ivec2(1, 2), 0).xyz, k);
  T = normalize(mix(texelFetch(uPath, a + ivec2(0, 1), 0).xyz, texelFetch(uPath, a + ivec2(1, 1), 0).xyz, k));
}
// p, n: rest pose in body space (spine on the z axis, head at +70). Returns the object-space position.
vec3 levDeform(vec3 p, inout vec3 n) {
  float t = clamp((HEAD_Z - p.z) / LEN, 0.0, 1.4);
  float amp = uSwimAmp * (0.07 + 0.93 * t * t);
  float ph = p.z * uSwimK + uSwimPh;
  float sx = amp * sin(ph);
  float slope = amp * uSwimK * cos(ph);
  float sy = 0.2 * amp * sin(ph * 0.5 + 1.3);
  float roll = 0.45 * slope;
  float cr = cos(roll), sr = sin(roll);
  vec2 xy = vec2(p.x * cr - p.y * sr, p.x * sr + p.y * cr);
  n = vec3(n.x * cr - n.y * sr, n.x * sr + n.y * cr, n.z);
  n = normalize(vec3(n.x + slope * n.z, n.y, n.z - slope * n.x));
  vec3 P, T;
  levPath(uDist + p.z - slope * xy.x, P, T);
  vec3 B = normalize(cross(vec3(0.0, 1.0, 0.0), T));
  vec3 N = cross(T, B);
  n = normalize(B * n.x + N * n.y + T * n.z);
  return P + B * (xy.x + sx) + N * (xy.y + sy);
}
`,Y=`
float levFog() {
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * 0.55);   // its lights carry further than rock does: it reads whole from 150 m
    #else
      return smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 0.0;
  #endif
}
`,ee=`
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y);
}
`;function re(a){return function(e){const c=e<.14?Math.pow(Math.sin(e/.14*Math.PI*.5),.48):1,r=Math.max(0,(e-.14)/.86),o=1+.035*Math.sin(e*31)*L(.2,.4,e),l=a*10.2*c*Math.pow(1-r,1.22)*o+.1,b=a*8.6*c*Math.pow(1-r,.9)*o+.3,v=.8+.2*L(.05,.35,e),n=1+.3*se(e,0,.44,.45),h=.12*L(.18,.4,e);return{W:l,H:b,top:v,bot:n,keel:h,spineY:b*v*.42}}}function O(a,t,e,c){const r=Math.sign(t)*Math.pow(Math.abs(t),.86);return c[0]=a.W*r,c[1]=e>0?a.H*a.top*e*(1+a.keel*Math.pow(e,6)):a.H*a.bot*e,c}function Z(a){const t={n:0,idx:[],a:{}};for(const e in a)t.a[e]={size:a[e],d:[]};return t.toGeometry=e=>{const c=new u.BufferGeometry;for(const r in t.a)c.setAttribute(r,new u.Float32BufferAttribute(t.a[r].d,t.a[r].size));return c.setIndex(t.idx),e&&c.computeVertexNormals(),c.boundingSphere=new u.Sphere(new u.Vector3(0,30,0),900),c},t}function ce(a,t){const e=a.range(.85,1.2),c=a.range(.9,1.15),r=a.range(.7,1.3),o=t,l=[[-215*e,-70*c,-560],[-160*e,-58*c,-420],[-105*e,-40*c,-290],[-62*e,-18*c,-185],[-31*e,8,-105],[-10,o-6,-45],[0,o,0],[12,o+3.5,60],[34*r,o+7,160],[64*r,o+11,280],[100*r,o+16,420],[140*r,o+21,560]].map(i=>new u.Vector3(i[0],i[1],i[2])),b=new u.CatmullRomCurve3(l,!1,"centripetal");b.arcLengthDivisions=1600;const v=b.getLength(),n=b.getSpacedPoints(S-1);let h=0,P=1e9;for(let i=0;i<S;i++){const z=n[i].x*n[i].x+n[i].z*n[i].z;z<P&&(P=z,h=i)}const f=n[h].x,m=n[h].z,d=new Uint16Array(S*3*4),g=u.DataUtils.toHalfFloat,W=i=>Math.round(i/8)*8,x=[];for(let i=0;i<S;i++)n[i].x-=f,n[i].z-=m;for(let i=0;i<S;i++){const z=n[Math.max(0,i-1)],k=n[Math.min(S-1,i+1)],F=new u.Vector3().subVectors(k,z).normalize();x.push(F);const V=n[i],N=W(V.x),B=W(V.y),y=W(V.z);d.set([g(N),g(B),g(y),g(1)],i*4),d.set([g(F.x),g(F.y),g(F.z),g(0)],(S+i)*4),d.set([g(V.x-N),g(V.y-B),g(V.z-y),g(0)],(2*S+i)*4)}const s=new u.DataTexture(d,S,3,u.RGBAFormat,u.HalfFloatType);s.minFilter=s.magFilter=u.NearestFilter,s.generateMipmaps=!1,s.needsUpdate=!0;const M=h/(S-1)*v,w=2*Math.min(M-115,v-M-85);function p(i,z,k){const F=$(i/v,0,1)*(S-1),V=Math.min(Math.floor(F),S-2),N=F-V;return z.lerpVectors(n[V],n[V+1],N),k&&k.lerpVectors(x[V],x[V+1],N).normalize(),z}return{tex:s,len:v,dMid:M,travel:w,at:p}}const te=`
attribute vec3 aBT;
varying vec3 vBT, vWN, vWP;
#include <fog_pars_vertex>
${q}
void main() {
  vec3 n = normal;
  vec3 q = levDeform(position, n);
  vec4 wp = modelMatrix * vec4(q, 1.0);
  vWP = wp.xyz; vWN = normalize(mat3(modelMatrix) * n); vBT = aBT;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oe=`
uniform vec3 uGlowCol, uRimCol, uAmbTop, uAmbBot, uInnerCol, uSkinBack, uSkinBelly, uPale;
uniform float uTime, uReveal, uWavePh, uWaveK, uRowPh, uPackK, uPackW;
varying vec3 vBT, vWN, vWP;
#include <fog_pars_fragment>
${Y}
${ee}
float rowWave(float t, float ph) { return pow(0.5 + 0.5 * sin(t * uWaveK - uWavePh + ph), 3.0); }
void main() {
  float t = vBT.x;
  float rl = max(length(vBT.yz), 1e-4);
  float sn = vBT.z / rl, cs = vBT.y / rl;
  float th = atan(sn, abs(cs));
  vec3 V = normalize(cameraPosition - vWP);
  vec3 N = normalize(vWN);
  #ifdef LEV_BACK
    N = -N;
  #endif
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.5);
  float belly = smoothstep(0.15, -0.65, sn);
  float girthU = th * (2.0 + 9.0 * (1.0 - t));
  float mott = vn(vec2(t * 85.0, girthU * 1.3)) * 0.6 + vn(vec2(t * 260.0, girthU * 4.0)) * 0.4;
  // throat pleats on the underside of the front third
  float pleatZone = belly * smoothstep(0.012, 0.05, t) * (1.0 - smoothstep(0.33, 0.44, t));
  float pleat = smoothstep(0.3, 0.0, abs(sin(th * 22.0 + (mott - 0.5) * 0.5))) * pleatZone;
  // myomere chevrons (muscle bands seen through the skin)
  float cph = t * (LEN_M / 2.4) * 6.2832 + abs(sn - 0.1) * 5.0;
  float chev = smoothstep(0.8, 1.0, sin(cph)) * smoothstep(0.1, 0.2, t);
  // freckle photophores scattered over back and flanks
  vec2 fu = vec2(t * 190.0, girthU * 1.6);
  vec2 cell = floor(fu);
  float r = h21(cell);
  vec2 fp = fract(fu) - 0.5 - (vec2(h21(cell + 3.1), h21(cell + 7.7)) - 0.5) * 0.6;
  float star = step(0.84, r) * smoothstep(0.17, 0.0, length(fp)) * (0.45 + 0.55 * sin(uTime * (0.5 + r * 2.0) + r * 40.0));
  star *= (1.0 - belly * 0.5) * (0.35 + rowWave(t, 1.0));
  // lateral line, jaw line, baleen comb
  float ll = exp(-pow((sn - 0.06) / 0.018, 2.0)) * smoothstep(0.1, 0.16, t);
  float snj = -0.2 - 0.55 * smoothstep(0.1, 0.19, t);
  float headWin = (1.0 - smoothstep(0.185, 0.2, t)) * smoothstep(0.004, 0.02, t);
  float jaw = exp(-pow((sn - snj) / 0.03, 2.0)) * headWin;
  float bl = smoothstep(snj, snj - 0.02, sn) * exp(-(snj - sn) * 9.0) * headWin * (0.5 + 0.5 * sin(t * 900.0));
  // light the skin receives from the photophore rows
  float pg = 0.0;
  pg += exp(-pow((sn - (${U[0].toFixed(3)})) / 0.085, 2.0)) * (0.25 + rowWave(t, 0.0));
  pg += exp(-pow((sn - (${U[1].toFixed(3)})) / 0.085, 2.0)) * (0.25 + rowWave(t, uRowPh));
  pg += exp(-pow((sn - (${U[2].toFixed(3)})) / 0.085, 2.0)) * (0.25 + rowWave(t, uRowPh * 2.0));
  pg += exp(-pow((sn - (${U[3].toFixed(3)})) / 0.12, 2.0)) * (0.25 + rowWave(t, uRowPh * 3.0));
  vec3 alb = mix(uSkinBack, uSkinBelly, belly) * (0.65 + 0.7 * mott);
  alb *= 1.0 - 0.55 * pleat;
  alb += uSkinBelly * 0.25 * chev;
  float scute = smoothstep(0.8, 1.0, sin(t * 733.0)) * smoothstep(-0.62, -0.88, sn) * smoothstep(0.38, 0.46, t);
  alb *= 1.0 - 0.5 * scute;
  float f = levFog();
  #ifdef LEV_BACK
    // inner wall, seen through the front skin: lit from the spinal cord
    float topness = smoothstep(-0.3, 0.9, sn);
    float pack = pow(0.5 + 0.5 * sin(t * uPackK - uTime * uPackW), 6.0);
    vec3 col = alb * uAmbTop * 0.12
             + uInnerCol * (0.035 + 0.07 * topness + 0.16 * pack * (0.3 + 0.7 * topness)) * (0.5 + 0.8 * mott) * (1.0 + 2.0 * chev);
    col *= 1.0 - smoothstep(0.75, 1.0, t) * 0.6;
    col = mix(col, fogColor, f);
    gl_FragColor = vec4(col, 1.0);
  #else
    vec3 lit = alb * (uAmbTop * (0.55 + 0.45 * N.y) + uAmbBot * (0.5 - 0.5 * N.y) + uGlowCol * pg * 0.55 * (0.6 + 0.5 * uReveal));
    vec3 emis = uGlowCol * (ll * 0.9 * (0.3 + rowWave(t, 0.5)) + star * 2.4) + uPale * (jaw * 0.5 + bl * 0.9);
    emis *= 0.6 + 0.5 * uReveal;
    vec3 rim = uRimCol * fres * (0.3 + 0.3 * uReveal);
    float alpha = mix(0.26, 0.9, fres) + (0.5 + 0.5 * sn) * 0.22 + pleat * 0.2 + scute * 0.18 + chev * 0.06 + (mott - 0.5) * 0.12;
    alpha += 0.25 * (1.0 - smoothstep(0.03, 0.14, t));
    alpha = clamp(alpha, 0.05, 0.96);
    vec3 col = lit * alpha + rim + emis;
    col = mix(col, fogColor * alpha, f);
    gl_FragColor = vec4(col, alpha);
  #endif
}`.replace(/LEN_M/g,_.toFixed(1)),pe=`
attribute vec3 aCol;
attribute vec4 aCen, aPar;
varying vec3 vCol, vWN, vWP;
varying vec2 vGS;
uniform float uPackK, uPackW;
#include <fog_pars_vertex>
${q}
void main() {
  float kind = aCen.w;
  float tt = (HEAD_Z - position.z) / LEN;
  float pk;
  if (kind < 0.5) pk = pow(0.5 + 0.5 * sin(tt * uPackK - uTime * uPackW + aPar.w), 10.0);          // nerve packets
  else if (kind < 1.5) pk = 0.5 + 0.5 * sin(uTime * 0.7 + aPar.w);                                 // organ breathing
  else if (kind < 2.5) { float x = fract(uTime * 0.21 + aPar.w); pk = exp(-x * x * 90.0) + 0.7 * exp(-pow(x - 0.2, 2.0) * 120.0); } // heart
  else pk = pow(0.5 + 0.5 * sin(tt * 55.0 - uTime * 0.9 + aPar.w), 4.0);                           // gut lumps
  vec3 p = aCen.xyz + (position - aCen.xyz) * (1.0 + aPar.z * pk);
  vec3 n = normal;
  vec3 q = levDeform(p, n);
  vec4 wp = modelMatrix * vec4(q, 1.0);
  vWP = wp.xyz; vWN = normalize(mat3(modelMatrix) * n);
  vCol = aCol; vGS = vec2(aPar.x + aPar.y * pk, kind > 0.5 ? 1.0 : 0.0);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ue=`
uniform float uReveal;
varying vec3 vCol, vWN, vWP;
varying vec2 vGS;
#include <fog_pars_fragment>
${Y}
void main() {
  float ndv = abs(dot(normalize(vWN), normalize(cameraPosition - vWP)));
  float I = vGS.x * mix(0.75 + 0.25 * ndv, 0.2 + 1.15 * pow(ndv, 1.6), vGS.y);
  vec3 col = vCol * I * (0.65 + 0.4 * uReveal);
  col = mix(col, fogColor, levFog() * 0.8);
  gl_FragColor = vec4(col, 1.0);
}`,ve=`
attribute vec4 aBend, aFin;
varying vec2 vUv;
varying vec4 vFin;
varying vec3 vWN, vWP;
uniform float uFlapW;
#include <fog_pars_vertex>
${q}
void main() {
  float v = uv.y;
  vec3 p = position + aBend.xyz * (v * v) * sin(uTime * uFlapW + aBend.w - v * 1.7)
         + aBend.xyz * 0.12 * v * sin(uTime * uFlapW * 2.3 + aBend.w * 1.7 - v * 5.0);
  vec3 n = normal;
  vec3 q = levDeform(p, n);
  vec4 wp = modelMatrix * vec4(q, 1.0);
  vWP = wp.xyz; vWN = normalize(mat3(modelMatrix) * n); vUv = uv; vFin = aFin;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,he=`
uniform vec3 uGlowCol, uAmbTop, uAmbBot, uMembCol, uPale;
uniform float uTime, uReveal, uWavePh, uWaveK;
varying vec2 vUv;
varying vec4 vFin;
varying vec3 vWN, vWP;
#include <fog_pars_fragment>
${Y}
${ee}
void main() {
  float u = vUv.x, v = vUv.y, au = abs(u);
  float seed = vFin.y;
  float rk = max(150.0 / (1.0 + pow(fwidth(u) * 10.0, 2.0)), 24.0);
  float rach = exp(-u * u * rk);
  float wave = pow(0.5 + 0.5 * sin(vFin.z * uWaveK - uWavePh - v * 2.5 + 0.6), 2.0);
  float root = smoothstep(0.0, 0.05, v);
  vec3 N = normalize(vWN);
  vec3 V = normalize(cameraPosition - vWP);
  float graze = 1.0 - abs(dot(N, V));
  vec3 col; float alpha;
  if (vFin.x > 0.5) {                                   // filament (barbels)
    float ws = 1.0 + 12.0 * smoothstep(0.78, 0.84, v);
    float thread = exp(-u * u * rk * ws * ws);
    float bulb = exp(-(u * u * 6.8 + pow((v - 0.91) * vFin.w, 2.0)));
    alpha = (thread * 0.5 + bulb * 0.3) * root;
    col = uMembCol * alpha * uAmbTop + (uGlowCol * thread * (0.5 + 1.3 * wave) + mix(uGlowCol, uPale, 0.6) * bulb * (2.4 + 0.9 * sin(uTime * 0.8 + seed * 20.0))) * (0.55 + 0.55 * uReveal);
  } else {
    float ragged = 0.66 + 0.34 * vn(vec2(v * 40.0 + seed * 31.0, seed * 7.0 + sign(u) * 3.0));
    float edge = 1.0 - smoothstep(ragged - 0.2, ragged, au);
    float bc = (v - 0.07 * au) * 34.0;
    float barb = pow(0.5 + 0.5 * cos(bc * 6.2832), 2.0);
    barb = mix(barb, 0.4, smoothstep(0.25, 0.8, fwidth(bc)));
    float gap = smoothstep(0.16, 0.24, vn(vec2(bc * 0.5 + seed * 13.0, sign(u) * 2.0 + seed)));
    float memb = edge * (0.14 + 0.5 * barb * gap) * (1.0 - 0.4 * v) + graze * graze * 0.25 * edge;
    alpha = clamp(memb + rach * 0.5, 0.0, 0.9) * root;
    vec3 lit = uMembCol * (uAmbTop * 0.6 + uAmbBot * 0.4 + uGlowCol * 0.3 * (0.4 + wave) * (0.6 + 0.5 * uReveal));
    vec3 emis = uGlowCol * (rach * (0.45 + 1.7 * wave) + barb * gap * edge * 0.09 * (0.4 + wave)) * vFin.w
              + mix(uGlowCol, uPale, 0.6) * exp(-u * u * 6.0) * exp(-pow((0.95 - v) * 16.0, 2.0)) * 1.6;
    col = lit * alpha + emis * root * (0.55 + 0.55 * uReveal);
  }
  float f = levFog();
  col = mix(col, fogColor * alpha, f * 0.9);
  gl_FragColor = vec4(col, alpha);
}`,fe=`
attribute vec3 aCol;
attribute vec4 aInfo;       // size, kind (0 photophore, 1 eye, 2 halo, 3 mote, 4 lantern), phase, brightness
varying vec2 vUv;
varying vec3 vCol;
varying float vKind;
#include <fog_pars_vertex>
${q}
void main() {
  vec3 a = position;
  float kind = aInfo.y, ph = aInfo.z;
  float I = aInfo.w;
  if (kind > 2.5 && kind < 3.5) {
    float h1 = fract(ph * 7.31), h2 = fract(ph * 3.17), h3 = fract(ph * 5.71);
    float zz = mod(a.z - uTime * (2.5 + 4.5 * h1) + 115.0, 200.0) - 115.0;
    float tt = clamp((HEAD_Z - zz) / LEN, 0.0, 1.0);
    float ang = a.x + uTime * (0.04 + 0.1 * h2) * (h3 > 0.5 ? 1.0 : -1.0) + sin(zz * 0.05 + ph) * 0.5;
    float rr = a.y * (0.5 + 0.65 * (1.0 - tt) * smoothstep(-0.05, 0.12, tt + 0.05));
    a = vec3(cos(ang) * rr, sin(ang) * rr * 0.82, zz);
    I *= (0.5 + 0.5 * sin(uTime * (1.0 + 2.0 * h2) + ph * 20.0)) * smoothstep(-115.0, -95.0, zz) * (1.0 - smoothstep(70.0, 85.0, zz));
  } else if (kind < 0.5) {
    float tt = (HEAD_Z - a.z) / LEN;
    I *= (0.18 + 3.2 * pow(0.5 + 0.5 * sin(tt * uWaveK - uWavePh + ph), 3.0)) * (0.65 + 0.6 * uReveal);
  } else if (kind > 1.5 && kind < 2.5) {
    I *= (0.35 + 0.85 * uReveal) * (0.85 + 0.15 * sin(uTime * 0.4 + ph));
  } else if (kind > 3.5) {
    I *= 0.7 + 0.3 * sin(uTime * 0.8 + ph);
  }
  vec3 n = vec3(0.0, 1.0, 0.0);
  vec3 q = levDeform(a, n);
  vec4 mvPosition = modelViewMatrix * vec4(q, 1.0);
  float sz = aInfo.x;
  float szMin = -mvPosition.z * 0.0019;
  if (kind < 2.0 || kind > 2.5) { I *= clamp(sz / max(szMin, 1e-3), 0.45, 1.0); sz = max(sz, szMin); }
  I *= 1.0 - smoothstep(210.0, 320.0, -mvPosition.z);     // far off, its lights go out before they shrink to one hot pixel
  mvPosition.xy += uv * sz;
  vUv = uv; vCol = aCol * I; vKind = kind;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,me=`
varying vec2 vUv;
varying vec3 vCol;
varying float vKind;
#include <fog_pars_fragment>
${Y}
void main() {
  float d = length(vUv);
  float g;
  if (vKind > 0.5 && vKind < 1.5) g = exp(-pow((d - 0.56) / 0.13, 2.0)) + 0.5 * exp(-d * d * 45.0);
  else if (vKind > 1.5 && vKind < 2.5) g = pow(max(1.0 - d, 0.0), 2.4);
  else g = exp(-d * d * 11.0) + 0.16 * exp(-d * d * 2.6);
  g *= 1.0 - smoothstep(0.75, 1.0, d);
  vec3 col = vCol * g * (1.0 - levFog() * 0.72);
  gl_FragColor = vec4(col, 1.0);
}`,I=[0,0];function D(a,t,e,c,r,o){return O(a(t),e,c,I),o.set(I[0]*r,I[1]*r,R-t*_)}async function de(a,t){const r=Z({position:3,aBT:3});for(let o=0;o<200;o++){const l=Math.pow(o/199,1.12),b=a(l),v=R-l*_;for(let n=0;n<56;n++){const h=n/56*Math.PI*2,P=Math.cos(h),f=Math.sin(h);O(b,P,f,I),r.a.position.d.push(I[0],I[1],v),r.a.aBT.d.push(l,P,f)}o%50===49&&await t.yield?.()}for(let o=0;o<199;o++)for(let l=0;l<56;l++){const b=o*56+l,v=o*56+(l+1)%56,n=(o+1)*56+l,h=(o+1)*56+(l+1)%56;r.idx.push(b,n,v,v,n,h)}return await t.yield?.(),r.toGeometry(!0)}const E=new u.Vector3,ae=new u.Vector3,X=new u.Vector3,j=new u.Vector3,J=new u.Vector3,ne=new u.Vector3(0,1,0),le=new u.Vector3(1,0,0);function K(a,t,e,c,r,o,l,b){const v=a.n;for(let n=0;n<=t;n++){const h=n/t;c(Math.min(1,h+.004),ae),c(Math.max(0,h-.004),E),X.subVectors(ae,E).normalize(),j.crossVectors(Math.abs(X.y)<.9?ne:le,X).normalize(),J.crossVectors(X,j),c(h,E);const P=r(h);for(let f=0;f<e;f++){const m=f/e*Math.PI*2,d=Math.cos(m),g=Math.sin(m),W=j.x*d+J.x*g,x=j.y*d+J.y*g,s=j.z*d+J.z*g;a.a.position.d.push(E.x+W*P,E.y+x*P,E.z+s*P),a.a.normal.d.push(W,x,s),a.a.aCol.d.push(o.r,o.g,o.b),a.a.aCen.d.push(E.x,E.y,E.z,b),a.a.aPar.d.push(l[0],l[1],l[2],l[3])}}for(let n=0;n<t;n++)for(let h=0;h<e;h++){const P=v+n*e+h,f=v+n*e+(h+1)%e,m=P+e,d=f+e;a.idx.push(P,f,m,f,d,m)}a.n+=(t+1)*e}function H(a,t,e,c,r,o,l,b,v,n,h){const P=a.n,f=14,m=10;for(let d=0;d<=m;d++){const g=d/m,W=g*Math.PI,x=Math.sin(W),s=Math.cos(W);for(let M=0;M<=f;M++){const w=M/f*Math.PI*2,p=x*Math.cos(w),i=s,z=x*Math.sin(w),k=1+.16*t.n3(p*1.7+e,i*1.7+c,z*1.7+r*.13);a.a.position.d.push(e+p*o*k,c+i*l*k,r+z*b*k);const F=Math.hypot(p/o,i/l,z/b)||1;a.a.normal.d.push(p/o/F,i/l/F,z/b/F),a.a.aCol.d.push(v.r,v.g,v.b),a.a.aCen.d.push(e,c,r,h),a.a.aPar.d.push(n[0],n[1],n[2],n[3])}}for(let d=0;d<m;d++)for(let g=0;g<f;g++){const W=P+d*(f+1)+g,x=W+1,s=W+f+1,M=s+1;a.idx.push(W,x,s,x,M,s)}a.n+=(m+1)*(f+1)}function ge(a,t,e,c,r){const o=Z({position:3,normal:3,aCol:3,aCen:4,aPar:4}),l=c.pale.clone().lerp(c.glow,.3),b=c.sea.clone().lerp(c.pale,.45),v=112;K(o,v*4,6,(s,M)=>{const w=.035+.95*s;return M.set(0,a(w).spineY,R-w*_)},s=>(.5*(1-.72*s)+.08)*(1+.75*Math.pow(Math.abs(Math.cos(Math.PI*s*v)),6)),l,[1.5,5.2,0,0],0);const n=r.ribs;for(let s=0;s<n;s++){const M=s/(n-1),w=.125+.62*M,p=a(w),i=C(-.95,-.2,Math.pow(M,1.5));for(const z of[-1,1])K(o,10,4,(k,F)=>{const V=C(1.36,i,k),N=L(0,.28,k);return O(p,Math.cos(V)*z,Math.sin(V),I),F.set(I[0]*.87*N,C(p.spineY,I[1]*.87,N),R-w*_-1.8*k*k)},k=>.17*(1-.7*k)*(.6+.4*(1-M))+.03,b,[.5,1.9,0,0],0)}for(let s=0;s<44;s++){const M=.755+.215*(s/43),w=a(M),p=R-M*_;for(const i of[-1,1]){const z=i>0?w.H*w.top*.9:-w.H*w.bot*.85;K(o,2,3,(k,F)=>F.set(0,C(w.spineY,z,k),p-1.1*k),k=>.1*(1-.8*k)+.02,b,[.5,1.9,0,0],0)}}for(let s=0;s<5;s++){const M=.148+.016*s,w=a(M);for(const p of[-1,1])K(o,8,4,(i,z)=>{const k=C(.05,-1.15,i);return O(w,Math.cos(k)*p,Math.sin(k),I),z.set(I[0]*.92,I[1]*.92,R-M*_-1.2*Math.sin(i*Math.PI))},i=>.2*Math.sin(Math.PI*(.08+.84*i))+.04,c.glow,[1,1.6,0,s*.5],0)}for(const s of[-1,1])K(o,20,4,(M,w)=>{const p=.012+.185*M,i=-.2-.55*L(.1,.19,p),z=Math.sqrt(1-i*i);return D(a,p,z*s,i,.9,w)},M=>.22*Math.sin(Math.PI*(.1+.8*M))+.05,b,[.7,1.2,0,0],0);const h=a(.07);H(o,e,0,h.spineY+.2,R-.07*_,1.7,1.2,2.6,c.pale,[.7,.8,.05,1],1),H(o,e,0,h.spineY+.1,R-.092*_,1.1,.9,1.6,c.pale,[.6,.8,.05,2],1);const P=a(.2),f=-P.H*.3,m=R-.2*_;H(o,e,-.9,f,m,2.3,2.5,2.9,c.accent,[.9,3.6,.16,0],2),H(o,e,1.3,f+.9,m-1.4,1.7,1.8,2.2,c.accent,[.9,3.6,.16,.06],2),H(o,e,.2,f+2.6,m+1.2,.9,1.3,1,c.accent,[.7,2.4,.1,.1],2);const d=a(.38);H(o,e,0,d.spineY-d.H*.3,R-.38*_,d.W*.3,d.H*.17,12,c.pale.clone().lerp(c.sea,.5),[.15,.2,.04,.5],1);const g=[c.glow,c.glow.clone().lerp(c.sea,.55),c.sea.clone().lerp(c.pale,.3)];for(let s=0;s<r.organs;s++){const M=s/(r.organs-1),w=.25+.36*M+t.range(-.01,.01),p=a(w),i=s%2?1:-1;H(o,e,i*p.W*t.range(.14,.3),-p.H*t.range(.12,.38),R-w*_,p.W*t.range(.26,.36),p.H*t.range(.24,.34),t.range(3.2,5.6),g[s%3],[.3,1.1,.09,s*.9],1)}const W=t.range(18,26),x=t.range(13,19);return K(o,260,6,(s,M)=>{const w=.24+.63*s,p=a(w);return M.set(p.W*.27*Math.sin(s*W),-p.H*p.bot*.5+p.H*.13*Math.cos(s*x),R-w*_)},s=>.5*(1-.62*s)+.1,c.glow.clone().lerp(c.pale,.35),[.22,2.4,.55,0],3),o.toGeometry(!1)}function Q(a,t,e,c,r,o,l,b,v,n,h,P,f,m=18,d=4){const g=new u.Vector3().crossVectors(e,c).normalize(),W=n?2:1;for(let x=0;x<W;x++){const s=x?g:c,M=a.n;for(let w=0;w<=m;w++){const p=w/m,i=n?o*(1-.5*p)+1.8*L(.78,.84,p):o*(.04+Math.pow(Math.sin(Math.PI*(.07+.93*p)),.8)*(1-.25*p)),z=t.x+e.x*r*p+l.x*r*p*p,k=t.y+e.y*r*p+l.y*r*p*p,F=t.z+e.z*r*p+l.z*r*p*p;for(let V=0;V<=d;V++){const N=V/d*2-1,B=n?0:.1*i*(1-N*N);a.a.position.d.push(z+s.x*N*i+g.x*B,k+s.y*N*i+g.y*B,F+s.z*N*i+g.z*B),a.a.uv.d.push(N,p),a.a.aBend.d.push(b.x,b.y,b.z,v),a.a.aFin.d.push(n,h,P,f)}}for(let w=0;w<m;w++)for(let p=0;p<d;p++){const i=M+w*(d+1)+p,z=i+1,k=i+d+1,F=k+1;a.idx.push(i,z,k,z,F,k)}a.n+=(m+1)*(d+1)}}function we(a,t,e){const c=Z({position:3,uv:2,aBend:4,aFin:4}),r=new u.Vector3,o=new u.Vector3,l=new u.Vector3,b=new u.Vector3,v=new u.Vector3,n=new u.Vector3,h=(f,m,d,g,W,x,s,M,w)=>{for(const p of[-1,1])for(let i=0;i<m;i++){const z=i/(m-1),k=C(g,W,z)+t.range(-.03,.03),F=f+M*z/_;D(a,F,Math.sqrt(1-s*s)*p,s,.96,r),o.set(p*Math.cos(k),-x-.18*z,-Math.sin(k)).normalize(),n.set(p*.35,1,.15),l.crossVectors(o,n).normalize();const V=d*(.6+.4*Math.sin(Math.PI*(.12+.72*z)))*t.range(.93,1.07);b.set(0,-.16-.08*z,-.12),v.crossVectors(o,l).normalize().multiplyScalar(V*w),Q(c,r,o,l,V,V*.052+.35,b,v,z*1.5+(p>0?0:.5)+f*9,0,t(),F,1)}};h(.185,e.pecN,e.pecL,-.2,1.22,.3,-.3,6.5,.13),h(.5,e.pelN,e.pelL,.35,1.3,.42,-.45,4,.11),e.midFans&&h(.335,e.pelN,e.pecL*.62,.15,1.28,.36,-.36,5,.12);const P=(f,m,d,g)=>{const W=Math.round((m-f)*_/1.25);for(let x=0;x<W;x++){const s=x/(W-1),M=C(f,m,s),w=a(M),p=C(.95,1.25,s)+t.range(-.05,.05),i=(x%2?1:-1)*t.range(.14,.3);r.set(0,d>0?w.H*w.top*(1+w.keel)*.94:-w.H*w.bot*.94,R-M*_),o.set(i,d*Math.cos(p),-Math.sin(p)).normalize(),l.crossVectors(o,le).normalize();const z=(e.crest*g*Math.pow(Math.sin(Math.PI*Math.min(1,s*.86+.1)),.6)+2.2)*t.range(.82,1.15);b.set(0,-d*.1,-.2),v.set(z*.11,0,0),Q(c,r,o,l,z,z*.15+.45,b,v,-M*26+t.range(-.2,.2),0,t(),M,.6,10,2)}};P(.29,.975,1,1),P(.55,.975,-1,.72);for(let f=0;f<e.tailN;f++){const m=f/e.tailN*Math.PI*2+t.range(-.15,.15);r.set(0,a(.985).spineY*.3+Math.sin(m)*.3,R-.985*_),o.set(Math.cos(m)*.22,Math.sin(m)*.5,-1).normalize(),n.set(Math.sin(m*2.3+f),Math.cos(m*1.7),.2),l.crossVectors(o,n).normalize();const d=e.tailL*t.range(.7,1.15)*(.8+.3*Math.abs(Math.sin(m)));b.set(0,0,0),v.crossVectors(o,l).normalize().multiplyScalar(d*.13),Q(c,r,o,l,d,d*.045+.4,b,v,m*1.3,0,t(),1,1)}for(let f=0;f<e.barbels;f++){const m=f%2?1:-1,d=.03+.085*(Math.floor(f/2)/Math.max(1,Math.ceil(e.barbels/2)-1));D(a,d,.62*m,-.78,.98,r),o.set(m*t.range(.25,.5),-t.range(.3,.5),-1).normalize(),l.crossVectors(o,ne).normalize();const g=e.barbL*t.range(.6,1.1);b.set(0,-.12,0),v.set(m*g*.05,g*.03,0),Q(c,r,o,l,g,.3,b,v,f*1.9,1,t(),d,g/.75,26,4)}return c.toGeometry(!0)}function xe(a,t,e,c){const r=Z({position:3,uv:2,aCol:3,aInfo:4}),o=(n,h,P,f,m,d,g,W)=>{const x=r.n;for(let s=0;s<4;s++)r.a.position.d.push(n,h,P),r.a.uv.d.push(s&1?1:-1,s&2?1:-1),r.a.aCol.d.push(W.r,W.g,W.b),r.a.aInfo.d.push(f,m,d,g);r.idx.push(x,x+1,x+2,x+1,x+3,x+2),r.n+=4},l=new u.Vector3,b=e.glow.clone().lerp(e.pale,.55);for(let n=0;n<14;n++){const h=.04+.9*(n/13);o(0,a(h).spineY*.5,R-h*_,15+15*(1-h),2,n*1.7,.085*(1.15-.5*h),e.glow.clone().lerp(e.sea,.45))}U.forEach((n,h)=>{const P=h===3?1.5:1.15,f=Math.sqrt(1-n*n);for(const m of[-1,1]){const d=Math.floor(.93*_/P);for(let g=0;g<d;g++){const W=.04+g*P/_;D(a,W,f*m,n,1.012,l);const x=(g+h*2)%6===0;o(l.x,l.y,l.z,(x?1.05:.5)*(1-.4*W),0,h*c.rowPh+(m>0?0:c.sidePh),x?1.5:1,x?b:e.glow)}}});for(let n=0;n<110;n++){const h=t.range(.008,.17),P=t.range(-1.2,1.35),f=t.sign();D(a,h,Math.cos(P)*f,Math.sin(P),1.012,l),o(l.x,l.y,l.z,t.range(.2,.5),0,t.range(0,6.28),.7,t.chance(.3)?b:e.glow)}const v=[[.05,.85],[.068,.62],[.084,.46],[.098,.34]];for(const n of[-1,1])for(const[h,P]of v)D(a,h,Math.cos(.26)*n,Math.sin(.26),1.02,l),o(l.x,l.y,l.z,P,1,0,2.3,e.pale);if(c.motes)for(let n=0;n<280;n++)o(t.range(0,6.283),t.range(11,27),t.range(-115,85),t.range(.2,.42),3,t(),t.range(.8,1.8),t.chance(.75)?e.pale:e.glow);return r.toGeometry(!1)}async function ye(a,t={}){const e=a.rng.fork?a.rng.fork("leviathan"):a.rng,c=a.noise,r=(t.palette&&t.palette.length>=7?t.palette:ie).map(y=>new u.Color(y)),o={girth:e.range(.92,1.08),hue:e.range(0,.38),passHeight:t.passHeight??e.range(34.5,37),swimLambda:e.range(84,112),waves:e.range(3,6),rowPh:e.pick([.9,-.9,0,1.6]),sidePh:e.pick([0,0,Math.PI]),ribs:e.int(46,58),organs:e.int(5,8),pecN:e.int(24,32),pecL:e.range(26,34),pelN:e.int(14,20),pelL:e.range(13,19),crest:e.range(5.5,9),tailN:e.int(13,19),tailL:e.range(24,34),barbels:e.int(2,4)*2,barbL:e.range(18,28),midFans:t.midFans??e.chance(.45),motes:t.motes!==!1},l={pale:r[0],sea:r[1],deep:r[2],abyss:r[3],accent:r[6],glow:r[5].clone().lerp(r[0],o.hue)},b=re(o.girth),v=ce(e,o.passHeight),n={uTime:{value:0},uPath:{value:v.tex},uPathLen:{value:v.len},uPathN:{value:S},uDist:{value:v.dMid},uSwimPh:{value:0},uSwimAmp:{value:e.range(5.2,6.8)},uSwimK:{value:Math.PI*2/o.swimLambda},uReveal:{value:1},uWavePh:{value:0},uWaveK:{value:Math.PI*2*o.waves},uRowPh:{value:o.rowPh},uPackK:{value:Math.PI*2*e.range(4,6.5)},uPackW:{value:2.2},uFlapW:{value:e.range(.48,.62)},uGlowCol:{value:l.glow.clone()},uRimCol:{value:l.pale.clone().lerp(l.glow,.4)},uInnerCol:{value:l.glow.clone().lerp(l.pale,.3)},uPale:{value:l.pale.clone()},uSkinBack:{value:l.deep.clone().lerp(l.sea,.5).multiplyScalar(1.3)},uSkinBelly:{value:l.sea.clone().lerp(l.pale,.4).multiplyScalar(.8)},uMembCol:{value:l.sea.clone().lerp(l.pale,.3)},uAmbTop:{value:t.ambTop?new u.Color(t.ambTop):l.pale.clone().multiplyScalar(.55)},uAmbBot:{value:t.ambBot?new u.Color(t.ambBot):l.accent.clone().multiplyScalar(.16).add(l.glow.clone().multiplyScalar(.04))}},h=(y,T,A)=>new u.ShaderMaterial({uniforms:{...u.UniformsUtils.clone(u.UniformsLib.fog),...n},vertexShader:y,fragmentShader:T,fog:!0,...A}),P=new u.Group;P.name="leviathan";let f=0;const m=(y,T,A)=>{const G=new u.Mesh(y,T);return G.frustumCulled=!1,G.renderOrder=A,G.matrixAutoUpdate=!1,f+=y.index.count/3,P.add(G),G};await a.yield?.();const d=await de(b,a);await a.yield?.(),m(d,h(te,oe,{side:u.BackSide,defines:{LEV_BACK:1}}),0),await a.yield?.(),m(ge(b,e,c,l,o),h(pe,ue,{}),1),await a.yield?.(),m(d,h(te,oe,{side:u.FrontSide,transparent:!0,premultipliedAlpha:!0,depthWrite:!1}),2),m(we(b,e,o),h(ve,he,{side:u.DoubleSide,transparent:!0,premultipliedAlpha:!0,depthWrite:!1}),3),await a.yield?.(),m(xe(b,e,l,o),h(fe,me,{transparent:!0,blending:u.AdditiveBlending,depthWrite:!1}),4),await a.yield?.();const g=t.lightPower??12e3;let W=null;g>0&&(W=new u.PointLight(l.glow.clone().lerp(l.pale,.35),g,340,2),P.add(W));let x=$(t.progress??.5,0,1),s=null;const M=y=>L(.24,.43,y)*(1-L(.59,.8,y)),w=y=>v.dMid+(y-.5)*v.travel,p=new u.Vector3,i=()=>{const y=w(x);n.uDist.value=y;const T=s??M(x);if(n.uReveal.value=s??.15+.85*T,W){v.at(y+28,p),W.position.set(p.x,p.y-11,p.z);const A=g*Math.max(0,T);W.intensity=A>1?A:0}};i();const z=(y,T)=>v.at(w(x)+y,T),k=v.at(v.dMid,new u.Vector3),F={passPoint:new u.Vector3(0,0,0),cameraDir:new u.Vector3(0,0,-1),flyThrough:[[0,0,240],[0,0,120],[0,0,0],[0,0,-120],[0,0,-240]].map(y=>new u.Vector3(y[0],y[1],y[2])),riseFrom:v.at(v.dMid-330,new u.Vector3),leaveTo:v.at(v.dMid+330,new u.Vector3),apex:k.clone(),viewpoints:[{position:new u.Vector3(0,0,45),target:new u.Vector3(2,k.y-6,-15),note:"on the camera line just before the pass, looking up along the belly"},{position:new u.Vector3(-95,12,70),target:k.clone(),note:"three-quarter front-left, slightly below"},{position:new u.Vector3(115,30,-15),target:k.clone(),note:"broadside"}]},B={object:P,radius:75,height:42,center:k.clone(),anchors:F,ground:!0,groundY:-30,light:W,uniforms:n,travel:v.travel,triangles:f,params:o,setProgress(y){x=$(y,0,1),i()},getProgress(){return x},trackPoint(y,T=new u.Vector3){return v.at(v.dMid+y,T)},progressAt(y,T,A=.55,G=13){return $(.5+(y-A)*T*G/v.travel,0,1)},setReveal(y){s=y==null?null:Math.max(-.35,y),i()},bodyPosition(y,T=new u.Vector3){return z(y,T).applyMatrix4(P.matrixWorld)},headPosition(y=new u.Vector3){return B.bodyPosition(60,y)},centerPosition(y=new u.Vector3){return B.bodyPosition(0,y)},gazePosition(y=new u.Vector3){const T=(x-.5)*v.travel;return B.bodyPosition(C(60,-55,L(-60,30,T)),y)},update(y,T){n.uTime.value=T,n.uSwimPh.value=T*n.uSwimK.value*15.5,n.uWavePh.value=T*1.5},dispose(){v.tex.dispose()}};return P.userData.hero=B,B}export{ye as buildHero};
