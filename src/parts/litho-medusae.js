import*as i from"three";const ie=["#E4E7D3","#3A2A1E","#C9627C","#5E9E90","#C8973A","#3F6F66"],C=Math.PI*2,ce=290,X=30,Z=7.8,re=25*Math.PI/180,he=45,Me=`
uniform float uTime, uPulse, uPeriod;
float lmBeat(float ph) { ph = fract(ph); return smoothstep(0.0, 0.24, ph) * (1.0 - smoothstep(0.24, 1.0, ph)); }
// the bell's contraction: a function of distance from the axis in bell space, so the mouth never moves
vec3 lmPulse(vec3 p) {
  float r = length(p.xz);
  float w = smoothstep(7.0, 30.0, r);
  float c = lmBeat(uPulse - w * 0.05);
  p.xz *= 1.0 - 0.12 * c * w;
  p.y += 1.6 * lmBeat(uPulse) * smoothstep(0.0, 22.0, p.y) - 0.8 * c * w * w;
  float lf = smoothstep(29.0, 33.5, r) * lmBeat(uPulse - 0.08);
  p.xz *= 1.0 - 0.11 * lf; p.y -= 1.3 * lf;
  return p;
}
`,ke=`
uniform vec3 uPaper, uSepia, uRose, uGreen, uOchre, uDeep, uShade;
uniform vec3 uLight, uInk;
uniform vec4 uFade;
uniform float uSeedT, uSeedF, uPx;
float lmHash(vec3 p) { p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float lmVn(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(lmHash(i), lmHash(i + vec3(1,0,0)), f.x), mix(lmHash(i + vec3(0,1,0)), lmHash(i + vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(lmHash(i + vec3(0,0,1)), lmHash(i + vec3(1,0,1)), f.x), mix(lmHash(i + vec3(0,1,1)), lmHash(i + vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z);
}
// metres of rest-pose surface under one pixel (take it once, outside any loop)
float lmFoot(vec3 rest) { return max(length(fwidth(rest)) * 0.7071, 1e-5); }
// crayon grain 0..1 riding the rest pose: cells stay about 3 px (two octaves cross-faded). The stone is re-seeded
// four times a second: each seed holds for half a step, then melts into the next (uSeedF 0..1), so the page boils
// softly instead of flipping; the blend is rescaled so the spread of the grain (and so mean coverage) never changes.
// On a surface seen at a slant (an arm or a tentacle leaving past the lens) the long axis of a pixel's footprint
// would stretch every cell into a streak several pixels long, so there the short axis rules: the stipple stays fine.
// Face-on the two are equal and nothing changes. (Derivatives: call lmGrain / lmGrainB outside any loop.)
float lmGFoot(vec3 p, float foot) { return min(foot, 2.0 * max(min(length(dFdx(p)), length(dFdy(p))), 1e-5)); }
float lmGrain(vec3 p, float foot, float off) {
  float L = log2(max(lmGFoot(p, foot) * 0.95 * max(uPx, 0.25), 1e-4));
  float l0 = floor(L), f = L - l0, s0 = exp2(l0);
  vec3 q0 = p / s0, q1 = p / (s0 * 2.0) + 31.7;
  float k1 = uSeedT + 1.0; if (k1 > 96.5) k1 = 0.0;
  vec3 o = vec3(17.13, 7.77, 3.31) * (uSeedT + off), o1 = vec3(17.13, 7.77, 3.31) * (k1 + off);
  float a = mix(lmVn(q0 + o), lmVn(q1 + o), f), b = mix(lmVn(q0 + o1), lmVn(q1 + o1), f);
  float w = clamp(uSeedF, 0.0, 1.0), n = (mix(a, b, w) - 0.5) / sqrt(w * w + (1.0 - w) * (1.0 - w));
  return clamp(n * 1.7 + 0.5, 0.0, 1.0);
}
// the second grain (overprints and register fronts): one seed per step, changing while the first grain holds
float lmGrainB(vec3 p, float foot, float off) {
  float L = log2(max(lmGFoot(p, foot) * 0.95 * max(uPx, 0.25), 1e-4));
  float l0 = floor(L), f = L - l0, s0 = exp2(l0);
  vec3 o = vec3(17.13, 7.77, 3.31) * (uSeedT + off);
  float n = mix(lmVn(p / s0 + o), lmVn(p / (s0 * 2.0) + o + 31.7), f);
  return clamp((n - 0.5) * 1.7 + 0.5, 0.0, 1.0);
}
// 1 when the surface is drawn large, 0 when a pixel covers more than about 0.45 m of it: inner drawing thins with it
float lmBig(float foot) { return 1.0 - smoothstep(0.15, 0.45, foot); }
// ink on or off for a tone 0 (bare paper) .. 1 (solid)
float lmOn(float tone, float g) { return smoothstep(-0.06, 0.06, tone * 1.12 - 0.06 - g); }
// a stone printing on: prog 0..1 sweeps along the body coordinate with a grainy front
float lmReg(float prog, float body, float g) { return smoothstep(0.0, 0.03, prog * 1.3 - body - g * 0.22 - 0.02); }
// key line: half width in pixels breathing 0.7..1.3 (1.4-2.6 px across) along a slow object-space noise
float lmLineW(vec3 rest) { return mix(0.7, 1.3, lmVn(rest * 0.13 + 3.7)) * uPx; }
float lmLine(float dpx, float w) { return 1.0 - smoothstep(w - 0.6, w + 0.6, dpx); }
vec3 lmMul(vec3 ink) { return ink / max(uPaper, vec3(1e-3)); }
// fill = product of ink multipliers over paper, line = key line coverage, dist = metres from the eye
vec4 lmFinish(vec3 fill, float line, float dist) {
  fill = mix(fill, vec3(1.0), smoothstep(uFade.x, uFade.y, dist));
  float lf = 0.42 * smoothstep(uFade.x * 0.8, uFade.y * 0.8, dist) + 0.22 * smoothstep(500.0, 700.0, dist) + 0.2 * smoothstep(900.0, 1200.0, dist);
  vec3 key = mix(lmMul(uSepia), vec3(1.0), lf);
  fill = mix(fill, key, clamp(line, 0.0, 1.0));
#ifdef LM_TINT
  return vec4(fill, 1.0);
#else
  return vec4(uPaper * fill, 1.0);
#endif
}
`;function Ae(e=ie,r){const t=s=>new i.Color(e[s]||ie[s]);return{uPaper:{value:t(0)},uSepia:{value:t(1)},uRose:{value:t(2)},uGreen:{value:t(3)},uOchre:{value:t(4)},uDeep:{value:t(5)},uShade:{value:new i.Color(r||e[3]||ie[3])},uLight:{value:new i.Vector3(-.55,.7,.45).normalize()},uInk:{value:new i.Vector3(1,1,1)},uFade:{value:new i.Vector4(250,450,0,0)},uSeedT:{value:0},uSeedF:{value:0},uPx:{value:1},uTime:{value:0},uPulse:{value:0},uPeriod:{value:5}}}function K(e,r={}){const t=!!r.tint,s=new i.ShaderMaterial({uniforms:Object.assign({},e,r.uniforms||{}),defines:Object.assign(t?{LM_TINT:1}:{},r.defines||{}),vertexShader:Me+r.vertex,fragmentShader:ke+r.fragment,side:r.side??i.FrontSide,fog:!1,depthWrite:!t,depthTest:r.depthTest??!0,transparent:t});return t&&(s.blending=i.CustomBlending,s.blendEquation=i.AddEquation,s.blendSrc=i.DstColorFactor,s.blendDst=i.ZeroFactor,s.blendSrcAlpha=i.ZeroFactor,s.blendDstAlpha=i.OneFactor),s}function ue(e,r){const t=e*Math.PI*.5,s=Math.sin(t),v=Math.cos(t);return[X*s*(1+.05*Math.sin(2*t)),r*Math.pow(v,.85)]}function se(e,r,t){const[s,v]=ue(e,r),u=Math.cos(e*Math.PI*.5);return[s*(.955+.045*e),v-t*Math.pow(u,1.3)-.55*(1-e*e*e)]}function Y(e,r,t){let s=0,v=1;for(let u=0;u<24;u++){const m=(s+v)/2;se(m,r,t)[0]<e?s=m:v=m}return se(s,r,t)[1]}const H=new i.Vector3,le=new i.Vector3,de=new i.Vector3,$=new i.Vector3,J=new i.Vector3,Q=new i.Vector3,ee=new i.Vector3,pe=new i.Vector3;function Re(e,r,t,s,v){for(let u=s;u<v;u+=3){const m=e.getX(u+0),y=e.getX(u+1),g=e.getX(u+2);H.fromBufferAttribute(r,m),le.fromBufferAttribute(r,y),de.fromBufferAttribute(r,g),ee.subVectors(de,le),pe.subVectors(H,le),ee.cross(pe),$.fromBufferAttribute(t,m),J.fromBufferAttribute(t,y),Q.fromBufferAttribute(t,g),$.add(ee),J.add(ee),Q.add(ee),t.setXYZ(m,$.x,$.y,$.z),t.setXYZ(y,J.x,J.y,J.z),t.setXYZ(g,Q.x,Q.y,Q.z)}}function Le(e,r,t){for(let s=r;s<t;s++)H.fromBufferAttribute(e,s),H.normalize(),e.setXYZ(s,H.x,H.y,H.z)}async function me(e,r){const t=e.index,s=e.getAttribute("position"),v=new i.BufferAttribute(new Float32Array(s.count*3),3);e.setAttribute("normal",v);for(let u=0,m=t.count;u<m;u+=600)Re(t,s,v,u,Math.min(m,u+600)),await r.yield();for(let u=0,m=v.count;u<m;u+=500)Le(v,u,Math.min(m,u+500)),await r.yield();v.needsUpdate=!0}async function ve(e,r,t){const s=e.NU,v=28,u=8,m=v+u,y=e.lappets,g=(s+1)*(m+1),M=new Float32Array(g*3),A=new Float32Array(g*2),x=new Float32Array(g);for(let o=0;o<=m;o++){await t.yield();for(let c=0;c<=s;c++){const n=o*(s+1)+c,h=c/s*C;let p,k,R=0;if(o<=v){const L=Math.pow(o/v,.9);[p,k]=r?se(L,e.depth,e.thick):ue(L,e.depth)}else{const L=(o-v)/u,T=Math.pow(Math.abs(Math.sin(y*h*.5)),.55),B=e.lappetLen*(.22+.78*T),N=.45+1.15*L;p=X+B*(Math.sin(N)-Math.sin(.45))/1.15*.9,k=-B*(Math.cos(.45)-Math.cos(N))/1.15*1.25,p+=(T-.5)*.5*L,R=.25+.5*L}M[n*3]=p*Math.sin(h),M[n*3+1]=k,M[n*3+2]=p*Math.cos(h),A[n*2]=c/s,A[n*2+1]=o/m,x[n]=R}}await t.yield();const f=new Uint32Array(s*m*6);let l=0;for(let o=0;o<m;o++){o%4===3&&await t.yield();for(let c=0;c<s;c++){const n=o*(s+1)+c,h=n+1,p=n+s+1,k=p+1;r?(f[l++]=n,f[l++]=h,f[l++]=p,f[l++]=h,f[l++]=k,f[l++]=p):(f[l++]=n,f[l++]=p,f[l++]=h,f[l++]=h,f[l++]=p,f[l++]=k)}}const d=new i.BufferGeometry;d.setAttribute("position",new i.BufferAttribute(M,3)),d.setAttribute("uv",new i.BufferAttribute(A,2)),d.setAttribute("aDark",new i.BufferAttribute(x,1)),d.setIndex(new i.BufferAttribute(f,1)),await t.yield(),await me(d,t),await t.yield();const a=d.attributes.normal.array;for(let o=0;o<=m;o++){const c=o*(s+1)*3,n=(o*(s+1)+s)*3;for(let h=0;h<3;h++){const p=(a[c+h]+a[n+h])*.5;a[c+h]=p,a[n+h]=p}}return d}const ge=`
attribute float aDark;
uniform float uDepth;
varying vec3 vRest, vN, vWp; varying vec2 vUv; varying float vDark, vBody;
void main() {
  vec3 p = lmPulse(position);
  vRest = position; vUv = uv; vDark = aDark;
  vBody = 0.1 * clamp(1.0 - position.y / uDepth, 0.0, 1.3);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vWp = wp.xyz; vN = mat3(modelMatrix) * normal;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,we=`
uniform float uLappets, uSpecies, uLapV, uSeed;
varying vec3 vRest, vN, vWp; varying vec2 vUv; varying float vDark, vBody;
`,Se=we+`
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)), V = normalize(cameraPosition - vWp + vec3(0.0, 1e-5, 0.0));
  float ndv = abs(dot(N, V));
  float foot = lmFoot(vRest), g = lmGrain(vRest, foot, uSeed), g2 = lmGrainB(vRest + 19.3, foot, uSeed + 5.0);
  float w = lmLineW(vRest);
  float rr = length(vRest.xz) / 30.0, rm = max(length(vRest.xz), 0.05);
  float shade = 0.5 - 0.5 * dot(N, uLight);
  float fres = pow(max(1.0 - ndv, 0.0), 1.7), big = lmBig(foot);
  float a = abs(fract(vUv.x * 16.0 + 0.5) - 0.5);
  float dartW = 0.19 * smoothstep(0.26, 0.92, rr) * (1.0 - smoothstep(0.93, 1.0, rr));
  float dart = (1.0 - smoothstep(dartW - 0.02, dartW + 0.02, a)) * step(0.27, rr) * step(uSpecies, 0.5);   // Chrysaora only
  float lapZone = smoothstep(uLapV - 0.02, uLapV + 0.03, vUv.y);
  float tone = 0.03 + 0.6 * fres + 0.44 * smoothstep(0.45, 0.92, shade) + 0.42 * dart + 0.45 * vDark + 0.12 * smoothstep(0.75, 1.0, rr);
  float reg = lmReg(uInk.y, vBody, g2), regG = lmReg(uInk.x, vBody, g), regO = lmReg(uInk.z, vBody, g);
  vec3 m = vec3(1.0);
  m = mix(m, m * lmMul(uRose), lmOn(tone, g) * reg);
  m = mix(m, m * lmMul(uShade), lmOn(min((tone - 0.72) * 2.4 + 0.25 * smoothstep(0.8, 1.0, shade), 0.6), g2) * regG);
  // Pelagia: ochre warts; Cyanea: ochre crown patch
  float wart = step(0.5, uSpecies) * step(uSpecies, 1.5) * smoothstep(0.70, 0.74, lmVn(vRest * 0.55 + 7.0)) * step(rr, 0.97);
  float crown = step(1.5, uSpecies) * (1.0 - smoothstep(0.2, 0.3, rr + 0.05 * sin(vUv.x * 100.53)));
  m = mix(m, lmMul(uOchre), max(wart, crown * lmOn(0.75, g)) * regO);
  // key line: silhouette, lappet seams, margin
  float line = lmLine(ndv / max(fwidth(ndv), 1e-4), w * 0.85);
  float fu = max(fwidth(vUv.x), 1e-6);
  float seam = abs(fract(vUv.x * uLappets + 0.5) - 0.5) / (uLappets * fu);
  line = max(line, lmLine(seam, w * mix(0.5, 0.8, big)) * lapZone * mix(0.4, 1.0, big));
  line = max(line, lmLine((1.0 - vUv.y) / max(fwidth(vUv.y), 1e-5), w * mix(0.75, 1.3, big)));
  float dedge = abs(a - dartW) / max(fwidth(a - dartW), 1e-5);                    // dart outline, dashed where lit
  float dash = step(0.35, fract(rr * 22.0 + lmHash(vec3(floor(vUv.x * 16.0), 1.0, 2.0)))) ;
  line = max(line, lmLine(dedge, w * 0.55) * step(0.3, rr) * step(rr, 0.93) * step(uSpecies, 0.5) * mix(dash, 1.0, smoothstep(0.45, 0.7, shade)) * 0.8 * mix(0.35, 1.0, big));
  gl_FragColor = lmFinish(m, line, length(cameraPosition - vWp));
}`,Fe=we+`
const float STOMACH_R = ${(Z+2.4).toFixed(2)};
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)), V = normalize(cameraPosition - vWp + vec3(0.0, 1e-5, 0.0));
  float ndv = abs(dot(N, V));
  float foot = lmFoot(vRest), g = lmGrain(vRest, foot, uSeed + 2.0), g2 = lmGrainB(vRest + 41.1, foot, uSeed + 9.0);
  float w = lmLineW(vRest);
  float r = max(length(vRest.xz), 0.05), rr = r / 30.0;
  float shade = 0.5 - 0.5 * dot(N, uLight);
  float fres = pow(max(1.0 - ndv, 0.0), 1.5), big = lmBig(foot);
  float band = smoothstep(0.52, 0.58, rr) * (1.0 - smoothstep(0.80, 0.86, rr));
  float lapZone = smoothstep(uLapV - 0.02, uLapV + 0.03, vUv.y);
  // canals (the gastrovascular system), each drawn about its own radius so the plate stays mirrored: the eight on the
  // principal radii are trees (a stem that opens into a tuning fork of two waving branches, each sending a twig back
  // to meet its twin, so the canals net as a scyphozoan's do), the eight between them single sinuous canals; all
  // taper, break into dashes at their tips and end inside the ring muscle, short of the margin. Nothing runs
  // straight from mouth to rim.
  float fu = max(fwidth(vUv.x), 1e-6), fr = max(fwidth(r), 1e-5);
  float x16 = vUv.x * 16.0, kc = floor(x16 + 0.5), ca = x16 - kc, km = kc - 16.0 * floor(kc / 16.0), kh = min(km, 16.0 - km);
  float h1 = lmHash(vec3(kh, 5.0, 1.0)), h2 = lmHash(vec3(kh, 9.0, 2.0));
  float odd = step(0.5, fract(km * 0.5 + 0.25)), per = 1.0 - step(0.2, fract(km * 0.25 + 0.1));
  float cellM = r * 0.3927, am = ca * cellM, sgm = km < 8.0 ? 1.0 : -1.0;
  float offO = sgm * (0.6 * sin(r * 0.42 + h1 * 6.283) + 0.25 * sin(r * 0.97 + h2 * 6.283)) * smoothstep(0.27, 0.45, rr);
  float rF = mix(13.0 + 2.5 * h1, 9.4 + 1.2 * h1, per), q = max(r - rF, 0.0);
  float bo = min(2.1 * (1.0 - exp(-q / 3.5)) + 0.07 * q + 0.22 * sin(r * 0.8 + h1 * 6.283) * smoothstep(1.0, 5.0, q), 0.42 * cellM), q2 = max(q - 5.5 - 2.0 * h2, 0.0);
  float dE = min(abs(abs(am) - bo), abs(abs(am) - bo + 0.36 * q2) + (1.0 - step(1e-4, q2)) * 9.0);
  float dC = mix(dE, abs(am - offO), odd), endC = mix(0.89 + 0.03 * h2, 0.78 + 0.05 * h2, odd);
  float tr = smoothstep(0.3, endC, rr), cshow = step(0.27, rr) * (1.0 - smoothstep(endC - 0.05, endC, rr)) * (1.0 - lapZone);
  float cnear = exp(-dC * dC / 1.6) * step(0.27, rr) * (1.0 - smoothstep(endC - 0.08, endC + 0.05, rr));
  // tone. Small on the page the subumbrella is the bell's shade side; drawn large (from beneath) its face is mostly
  // paper and the rose gathers along the canals, in the ring muscle, at the margin and round the stomach
  float sh = smoothstep(0.4, 0.92, shade), rim = smoothstep(0.8, 1.0, rr), rimN = smoothstep(0.72, 1.0, rr), ctr = 1.0 - smoothstep(0.26, 0.36, rr);
  float tone = mix(0.04 + 0.28 * sh + 0.3 * band + 0.14 * rim, 0.03 + 0.11 * sh + 0.15 * band + 0.27 * rimN + 0.27 * cnear, big)
    + 0.22 * fres + 0.42 * vDark + 0.3 * ctr;
  float reg = lmReg(uInk.y, vBody, g2), regG = lmReg(uInk.x, vBody, g);
  vec3 m = vec3(1.0);
  m = mix(m, m * lmMul(uRose), lmOn(tone, g) * reg);
  float deep = (tone - 0.66) * 2.2 + 0.5 * ctr;
  m = mix(m, m * lmMul(uShade), lmOn(min(deep, 0.62), g2) * regG);
  float line = lmLine(dC / max(cellM * 16.0 * fu, 1e-5), w * mix(0.5, 1.15, big) * mix(1.0, 0.68, tr)) * cshow * mix(0.5, 1.0, big);   // hairlines when the bell is small
  line *= mix(1.0, step(0.3, fract(r * 0.7 + h1 * 9.0)), smoothstep(0.75, 0.95, tr));
  // ring muscle: concentric dashes, faded out before they can alias
  float sp = 1.3, rd = abs(fract(r / sp) - 0.5) * sp / fr;
  float fine = smoothstep(2.5, 5.0, sp / fr);
  float dsh = step(0.3, fract(vUv.x * 48.0 + lmHash(vec3(floor(r / sp), 3.0, 1.0)) * 7.0));
  line = max(line, lmLine(rd, w * 0.6) * band * fine * dsh * 0.75);
  line = max(line, lmLine(abs(r - STOMACH_R) / fr, w * mix(0.5, 1.0, big)) * mix(0.5, 1.0, big));   // stomach margin
  line = max(line, lmLine(ndv / max(fwidth(ndv), 1e-4), w * 0.8));
  float seam = abs(fract(vUv.x * uLappets + 0.5) - 0.5) / (uLappets * fu);
  line = max(line, lmLine(seam, w * mix(0.5, 0.8, big)) * lapZone * mix(0.4, 1.0, big));
  line = max(line, lmLine((1.0 - vUv.y) / max(fwidth(vUv.y), 1e-5), w * mix(0.75, 1.3, big)));
  gl_FragColor = lmFinish(m, line, length(cameraPosition - vWp));
}`;async function Te(e,r){let t=0,s=0;for(const a of e)t+=(a.nu+1)*(a.nv+1),s+=a.nu*a.nv*6;const v=new Float32Array(t*3),u=new Float32Array(t*2),m=new Float32Array(t),y=new Float32Array(t),g=new Uint32Array(s),M=[0,0,0,0];let A=0,x=0;const f=[];for(const a of e){const o=a.nu+1,c=Math.max(1,Math.round(60/o));for(let n=0;n<=a.nv;n++){for(let h=0;h<=a.nu;h++){const p=A+n*o+h;a.fn(h/a.nu,n/a.nv,M),v[p*3]=M[0],v[p*3+1]=M[1],v[p*3+2]=M[2],m[p]=M[3],y[p]=a.kind,u[p*2]=h/a.nu,u[p*2+1]=n/a.nv}n%c===c-1&&await r.yield()}for(let n=0;n<a.nv;n++)for(let h=0;h<a.nu;h++){const p=A+n*o+h,k=p+1,R=p+o,L=R+1;a.flip?(g[x++]=p,g[x++]=k,g[x++]=R,g[x++]=k,g[x++]=L,g[x++]=R):(g[x++]=p,g[x++]=R,g[x++]=k,g[x++]=k,g[x++]=R,g[x++]=L)}if(a.wrap)for(let n=0;n<=a.nv;n++)f.push(A+n*o,A+n*o+a.nu);A+=o*(a.nv+1),await r.yield()}const l=new i.BufferGeometry;l.setAttribute("position",new i.BufferAttribute(v,3)),l.setAttribute("uv",new i.BufferAttribute(u,2)),l.setAttribute("aDark",new i.BufferAttribute(m,1)),l.setAttribute("aKind",new i.BufferAttribute(y,1)),l.setIndex(new i.BufferAttribute(g,1)),await r.yield(),await me(l,r),await r.yield();const d=l.attributes.normal.array;for(let a=0;a<f.length;a+=2){const o=f[a]*3,c=f[a+1]*3;for(let n=0;n<3;n++){const h=(d[o+n]+d[c+n])*.5;d[o+n]=h,d[c+n]=h}}return l}function Pe(e,r){const t=[],s=f=>1+.1*Math.cos(4*f-Math.PI),v=se(0,e.depth,e.thick)[1]-.25;t.push({nu:64,nv:10,kind:0,wrap:!0,flip:!0,fn:(f,l,d)=>{const a=f*C;let o,c;if(l<.7){const n=l/.7;o=(Z-.3+2.6*n*n)*s(a),c=.1+v*Math.pow(n,.8)}else{const n=(l-.7)/.3;o=(Z+2.3)*s(a)*(1-n),c=v+.9*Math.sin(n*Math.PI*.5)}d[0]=o*Math.sin(a),d[1]=c,d[2]=o*Math.cos(a),d[3]=l}}),t.push({nu:96,nv:8,kind:1,wrap:!0,fn:(f,l,d)=>{const a=f*C,o=l*C,c=Z*s(a),n=.62+.12*Math.sin(a*12),h=c+n*Math.cos(o),p=n*.8*Math.sin(o);d[0]=h*Math.sin(a),d[1]=p,d[2]=h*Math.cos(a),d[3]=.3+.25*(.5-.5*Math.sin(o))}});const u=r.range(0,C),m=e.id==="cyanea"?44:36;t.push({nu:224,nv:6,kind:1,wrap:!0,fn:(f,l,d)=>{const a=f*C,o=Math.pow(.5+.5*Math.cos(4*a-Math.PI),1.6),c=e.lipLen*(.35+.65*o),n=l*c,h=Math.sin(a*m+u)*.5+Math.sin(a*m*.37+1.3)*.3,p=Z*s(a)+.5+n*.78+h*.55*l*l,k=-.35-n*.62+h*.75*l*l;d[0]=p*Math.sin(a),d[1]=k,d[2]=p*Math.cos(a),d[3]=1+l}});const y=14,g=Y(y,e.depth,e.thick),M=(Y(y+1,e.depth,e.thick)-Y(y-1,e.depth,e.thick))/2,A=Math.hypot(1,M),x=[];for(let f=0;f<4;f++){const l=f*Math.PI*.5,d=Math.sin(l),a=Math.cos(l),o=r.range(0,C),c=r.int(8,11),n=[-d*M/A,1/A,-a*M/A],h=[y*d-n[0]*1.5,g-n[1]*1.5,y*a-n[2]*1.5];x.push(new i.Vector3(h[0],h[1],h[2])),t.push({nu:60,nv:10,kind:2,fn:(p,k,R)=>{const L=(p-.5)*2*2.25,T=k*C,B=Math.sqrt(Math.max(0,1-Math.pow(Math.abs(p-.5)*2,6))),N=e.gonadTube*(1+.24*Math.sin(L*c+o))*(.25+.75*B),D=e.gonadR+N*Math.cos(T),E=N*.8*Math.sin(T),I=Math.cos(L)*D,V=Math.sin(L)*D,_=y+I;R[0]=_*d+V*a,R[1]=Y(Math.min(Math.hypot(_,V),28.5),e.depth,e.thick)-1.3-E,R[2]=_*a-V*d,R[3]=.5-.5*Math.cos(T)}})}for(let f=0;f<8;f++){const l=f*Math.PI*.25,d=Math.sin(l),a=Math.cos(l);t.push({nu:10,nv:6,kind:3,fn:(o,c,n)=>{const h=o*C,p=c*Math.PI,k=.62*Math.sin(p)*(1+.5*c),R=X+.5+k*Math.cos(h)*.9,L=-.2-1.5*(.5-.5*Math.cos(p)),T=k*Math.sin(h);n[0]=R*d+T*a,n[1]=L,n[2]=R*a-T*d,n[3]=c}})}return{parts:t,gonads:x,yTop:v}}const Be=`
attribute float aDark, aKind;
varying vec3 vRest, vN, vWp, vOut; varying vec2 vUv; varying float vDark, vKind;
void main() {
  vec3 p = position;
  // which way is out of the stomach cup here (its wall: away from the axis; its cap: up), so the fragment knows
  // whether it is looking at the dark inside or at the manubrium's outer wall whatever the winding
  vOut = mat3(modelMatrix) * mix(vec3(position.x, 0.0, position.z) / max(length(position.xz), 0.05), vec3(0.0, 1.0, 0.0), step(0.7, aDark));
  float e = max(aDark - 1.0, 0.0) * step(0.5, aKind) * step(aKind, 1.5);      // lip frill: 0 at the ring .. 1 at the edge
  float fl = lmBeat(uPulse - 0.04);
  p.y += (sin(uv.x * 201.06 - uTime * 1.7) * 0.32 + sin(uv.x * 81.7 + uTime * 1.1) * 0.2) * e * e - 0.5 * fl * e;
  p.xz *= 1.0 - 0.07 * fl * e;
  p = lmPulse(p);
  vRest = position; vUv = uv; vDark = aDark; vKind = aKind;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vWp = wp.xyz; vN = mat3(modelMatrix) * normal;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ve=`
uniform float uSeed;
varying vec3 vRest, vN, vWp, vOut; varying vec2 vUv; varying float vDark, vKind;
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)), V = normalize(cameraPosition - vWp + vec3(0.0, 1e-5, 0.0));
  if (!gl_FrontFacing) N = -N;
  float ndv = abs(dot(N, V));
  float foot = lmFoot(vRest), g = lmGrain(vRest, foot, uSeed + 3.0), g2 = lmGrainB(vRest + 27.7, foot, uSeed + 11.0);
  float big = lmBig(foot), w = lmLineW(vRest);
  float shade = 0.5 - 0.5 * dot(N, uLight);
  float sil = lmLine(ndv / max(fwidth(ndv), 1e-4), w * mix(0.6, 1.0, big)) * mix(0.6, 1.0, big);
  float regG = lmReg(uInk.x, 0.08, g), regR = lmReg(uInk.y, 0.09, g2), regO = lmReg(uInk.z, 0.08, g);
  vec3 m = vec3(1.0); float line = sil;
  if (vKind < 0.5) {
    // stomach: the darkest flat on the plate, sparse lighter flecks on the lit side, canals raying up it
    // (inside, seen up through the mouth); the outside wall is the manubrium in sea-green shade
    float inside = step(dot(V, vOut), 0.0);
    vec3 deep = lmMul(uDeep);                                        // flat, in every edition: the darkest thing on the plate
    vec3 wall = mix(vec3(1.0), lmMul(uShade), lmOn(0.3 + 0.6 * smoothstep(0.3, 0.9, shade), g));
    wall = mix(wall, wall * lmMul(uRose), lmOn(0.25 + 0.3 * vDark, g2) * regR);
    m = mix(m, mix(wall, deep, inside), regG);
    float cd = abs(fract(vUv.x * 16.0 + 0.5) - 0.5) / (16.0 * max(fwidth(vUv.x), 1e-6));
    line = max(line * 0.6, lmLine(cd, w * mix(0.6, 0.9, inside) * mix(0.6, 1.0, big)) * step(0.6, length(vRest.xz)) * mix(0.4, 1.0, big));
  } else if (vKind < 1.5) {
    // mouth ring and frilled lips: rose, sea-green in the folds, a doubled edge
    float e = max(vDark - 1.0, 0.0), frill = step(1.0, vDark);
    float tone = mix(0.45 + 0.45 * vDark + 0.3 * shade, 0.2 + 0.5 * smoothstep(0.3, 0.9, shade) + 0.45 * (1.0 - e), frill);
    m = mix(m, m * lmMul(uRose), lmOn(tone, g) * regR);
    m = mix(m, m * lmMul(uShade), lmOn(min((tone - 0.7) * 2.3, 0.6), g2) * regG);
    float fe = max(fwidth(vDark), 1e-5);
    line = max(line, frill * lmLine((1.0 - e) / fe, w * mix(0.7, 1.3, big)));
    line = max(line, frill * lmLine(abs(e - 0.8) / fe, w * 0.55) * step(0.4, fract(vUv.x * 90.0)) * 0.8 * big);
  } else if (vKind < 2.5) {
    // gonad: ochre core rimmed in rose
    float core = smoothstep(0.56, 0.64, ndv + 0.12 * (g - 0.5));
    float tone = 0.62 + 0.4 * shade;
    vec3 oc = mix(vec3(1.0), lmMul(uOchre), lmOn(tone, g) * regO);
    oc = mix(oc, oc * lmMul(uRose), lmOn((shade - 0.62) * 2.0, g2) * regR);
    vec3 rim = mix(vec3(1.0), lmMul(uRose), lmOn(0.8, g) * regR);
    m = mix(rim, oc, core);
    float fd = abs(fract(vUv.x * 30.0) - 0.5) / 30.0 * 17.0 / foot;                // frill lines across the tube
    line = max(line, lmLine(fd, w * 0.55) * (1.0 - core) * 0.8 * big);
    line = max(line, lmLine(abs(ndv - 0.6) / max(fwidth(ndv), 1e-4), w * 0.5) * step(0.45, fract(vUv.x * 21.0)) * 0.7 * big);
  } else {
    m = mix(m, lmMul(uOchre), lmOn(0.7 + 0.3 * shade, g) * regO);
  }
  gl_FragColor = lmFinish(m, line, length(cameraPosition - vWp));
}`;async function ze(e,r,t,s){const v=e.armNS,u=18,m=e.armLen,y=u+1,g=4*(v+1)*y,M=new Float32Array(g*3),A=new Float32Array(g*3),x=new Float32Array(g*4),f=new Uint32Array(4*v*u*6),l=[],d=[];let a=0,o=0;for(let n=0;n<4;n++){const h=n<2?1:-1,p=n%2===0?1:-1,k=t(h*5.6,-.7,p*5.6),R=h*e.armX,L=p>0?9.5:-11.5,T=n<2?n:n-2,B=r[T*3],N=r[T*3+1],D=r[T*3+2],E=Math.hypot(.55,.83),I=h*.55/E,V=p*.83/E,_=h*V,j=-h*I;l.push(new i.Vector3(k.x,k.y,k.z)),d.push(new i.Vector3(R,-90,L));for(let W=0;W<=v;W++){const P=m*Math.pow(W/v,1.35),U=1-Math.exp(-P/5.5),w=U*U*(3-2*U),b=Math.sin(P*.045+N)*1.1*Math.min(1,P/40)*h,S=k.x+(R-k.x)*w+Math.abs(_)*h*Math.abs(b)*.6,z=k.z+(L-k.z)*w+b*D,F=k.y-.6-(P-5*U),G=.26+.74*Math.min(1,P/26)**.8,q=Math.pow(Math.max(0,1-Math.max(0,P-(m-34))/34),.75),te=1+.16*Math.sin(P*.11+B*2),ae=Math.max(.05,e.armW*.5*G*q*te),ye=e.armFold*ae*(.4+.6*Math.min(1,P/12));for(let oe=0;oe<=u;oe++){const ne=oe/u*2-1,be=Math.abs(ne),O=o+W*y+oe,fe=(Math.pow(be,1.4)-.45)*ye;M[O*3]=S+I*ne*ae+_*fe,M[O*3+1]=F,M[O*3+2]=z+V*ne*ae+j*fe,A[O*3]=P,A[O*3+1]=ne,A[O*3+2]=ae,x[O*4]=I,x[O*4+1]=V,x[O*4+2]=h>0?0:.5,x[O*4+3]=B}W%6===5&&await s.yield()}await s.yield();for(let W=0;W<v;W++){W%60===59&&await s.yield();for(let P=0;P<u;P++){const U=o+W*y+P,w=U+1,b=U+y,S=b+1;f[a++]=U,f[a++]=b,f[a++]=w,f[a++]=w,f[a++]=b,f[a++]=S}}o+=(v+1)*y,await s.yield()}const c=new i.BufferGeometry;return c.setAttribute("position",new i.BufferAttribute(M,3)),c.setAttribute("aSt",new i.BufferAttribute(A,3)),c.setAttribute("aArm",new i.BufferAttribute(x,4)),c.setIndex(new i.BufferAttribute(f,1)),await s.yield(),await me(c,s),await s.yield(),{geometry:c,roots:l,walls:d}}const Ne=`
attribute vec3 aSt; attribute vec4 aArm;
uniform float uArmLen, uRuffle;
varying vec3 vRest, vN, vWp; varying vec3 vSt; varying float vBody;
void main() {
  float s = aSt.x, t = aSt.y, hw = aSt.z, e = abs(t), sg = t < 0.0 ? -1.0 : 1.0;
  float sxn = aArm.x < 0.0 ? -1.0 : 1.0;
  vec3 Wd = vec3(aArm.x, 0.0, aArm.y), Nd = sxn * vec3(aArm.y, 0.0, -aArm.x);
  float lag = aArm.z / uPeriod;                                   // left arms half a second behind
  float tt = uTime - aArm.z;
  // the pulse sends a ruffle down the arm at 9 m/s: a travelling envelope spaced one period apart
  float x = fract(s / ${he}.0 - uPulse + lag + 0.5);
  float kick = exp(-(x - 0.5) * (x - 0.5) * 42.0);
  float env = smoothstep(1.0, 14.0, s) * (0.55 + 1.0 * kick) * uRuffle;
  float A = (0.14 + 1.1 * e * e) * env;
  float kf = 0.63, phase = s * kf - tt * 1.9 + aArm.w + sg * 1.25;
  // a tight frill on the outer third of each leaf, riding the slow undulation
  float e4 = e * e * e * e, Af = 0.62 * e4 * smoothstep(1.0, 10.0, s) * uRuffle * (0.7 + 0.6 * kick), kq = 1.4;
  float fph = s * kq - tt * 3.1 + aArm.w * 3.0 + sg * 2.1;
  float wave = sin(phase) + 0.42 * sin(phase * 2.3 + 1.7);
  float D = A * wave + Af * sin(fph);
  float dDds = A * kf * (cos(phase) + 0.966 * cos(phase * 2.3 + 1.7)) + Af * kq * cos(fph);
  float dDdw = (2.2 * e * env * wave + 2.5 * e * e * e * smoothstep(1.0, 10.0, s) * uRuffle * sin(fph)) * sg / max(hw, 0.05);
  vec3 p = position + Nd * D + Wd * sg * e * 0.35 * env * sin(phase * 0.71 + 2.0);
  // the whole curtain swings slowly, and only outward from the mirror plane
  float sway = (0.5 + 0.5 * sin(s * 0.024 - tt * 0.23 + aArm.w)) * smoothstep(8.0, 120.0, s);
  p.x += sxn * sway * 2.6; p.z += sin(s * 0.031 - tt * 0.19 + aArm.w * 1.7) * 2.2 * smoothstep(8.0, 120.0, s);
  p.y += kick * 0.9 * smoothstep(1.0, 14.0, s);
  float sgn = dot(normal, Nd) < 0.0 ? -1.0 : 1.0;
  vec3 n = normal - sgn * (Wd * dDdw - vec3(0.0, 1.0, 0.0) * dDds);
  vRest = position; vSt = aSt; vBody = 0.11 + 0.55 * s / uArmLen;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vWp = wp.xyz; vN = mat3(modelMatrix) * n;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,We=`
uniform float uSeed;
varying vec3 vRest, vN, vWp; varying vec3 vSt; varying float vBody;
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(cameraPosition - vWp + vec3(0.0, 1e-5, 0.0));
  if (dot(N, V) < 0.0) N = -N;
  float s = vSt.x, t = vSt.y, e = abs(t);
  float foot = lmFoot(vRest), g = lmGrain(vRest, foot, uSeed + 4.0), g2 = lmGrainB(vRest + 13.1, foot, uSeed + 8.0);
  float w = lmLineW(vRest);
  float shade = 0.5 - 0.5 * dot(N, uLight);
  float core = 1.0 - smoothstep(0.0, 0.75, e);
  float tone = 0.2 + 0.52 * smoothstep(0.3, 0.92, shade) + 0.42 * core * core + 0.3 * (1.0 - smoothstep(0.0, 14.0, s));
  float ft = max(fwidth(t), 1e-5);
  tone -= 0.3 * smoothstep(10.0, 32.0, 1.0 / ft) * (1.0 - core * core);           // a leaf brushing the lens: more paper, the line work carries it
  float reg = lmReg(uInk.y, vBody, g2), regG = lmReg(uInk.x, vBody, g);
  vec3 m = vec3(1.0);
  m = mix(m, m * lmMul(uRose), lmOn(tone, g) * reg);
  m = mix(m, m * lmMul(uShade), lmOn(min((tone - 0.74) * 2.4, 0.58), g2) * regG);
  float big = smoothstep(4.0, 12.0, 1.0 / ft);                                    // half width in pixels: thin the drawing when small
  float line = lmLine((1.0 - e) / ft, w * mix(0.6, 1.3, big));                                   // the edge
  float dash = step(0.38, fract(s * 0.42 + 0.3 * sin(s * 0.9)));
  line = max(line, lmLine(abs(e - 0.84) / ft, w * 0.55) * mix(dash, 1.0, smoothstep(0.5, 0.75, shade)) * 0.8 * big);   // doubled edge
  line = max(line, lmLine(e / ft, w * 0.7) * mix(dash, 1.0, smoothstep(0.4, 0.7, shade)) * 0.85 * big);                // midrib
  line *= mix(0.45, 1.0, big);
  float sp = 2.3, vd = abs(fract(s / sp + 0.25 * e * e) - 0.5) * sp / foot;       // frill veins near the edge
  line = max(line, lmLine(vd, w * 0.5) * smoothstep(0.5, 0.8, e) * smoothstep(3.0, 6.0, sp / foot) * step(0.3, fract(e * 9.0 + s * 0.13)) * 0.65);
  gl_FragColor = lmFinish(m, line, length(cameraPosition - vWp));
}`;async function De(e,r,t){const s=e.length,v=s*(r+1)*2,u=new Float32Array(v*3),m=new Float32Array(v*3),y=new Float32Array(v*3),g=new Uint32Array(s*r*6);let M=0;const A=f=>{const l=e[f],d=f*(r+1)*2;for(let a=0;a<=r;a++)for(let o=0;o<2;o++){const c=d+a*2+o;u[c*3]=l.x,u[c*3+1]=l.y,u[c*3+2]=l.z,m[c*3]=l.len*Math.pow(a/r,1.25),m[c*3+1]=o*2-1,m[c*3+2]=l.len,y[c*3]=l.ph,y[c*3+1]=l.lag,y[c*3+2]=l.w}for(let a=0;a<r;a++){const o=d+a*2,c=o+1,n=o+2,h=o+3;g[M++]=o,g[M++]=n,g[M++]=c,g[M++]=c,g[M++]=n,g[M++]=h}};for(let f=0;f<s;f++)A(f),f%2===1&&await t.yield();const x=new i.BufferGeometry;return x.setAttribute("position",new i.BufferAttribute(u,3)),x.setAttribute("aTs",new i.BufferAttribute(m,3)),x.setAttribute("aTp",new i.BufferAttribute(y,3)),x.setIndex(new i.BufferAttribute(g,1)),x}const Ce=`
attribute vec3 aTs, aTp;
uniform mat3 uTiltM; uniform float uViewH;
varying vec3 vRest; varying vec3 vWp; varying float vSide, vWpx, vBody, vS, vCov;
vec3 tentC(float s, vec3 root, vec2 o, float sxn) {
  float fl = 1.0 - exp(-s / 7.0), grow = s / (s + 45.0), ph = aTp.x;
  float tt = uTime - aTp.y;
  vec3 p = root + vec3(o.x * 3.6 * fl, -s + 2.4 * fl, o.y * 3.6 * fl);
  p.z += (sin(s * 0.021 - tt * 0.21 + ph) * 5.0 + sin(s * 0.057 - tt * 0.5 + ph * 1.7) * 1.5) * grow;
  p.x += sxn * (0.5 + 0.5 * sin(s * 0.017 - tt * 0.17 + ph * 2.3)) * 6.5 * grow;      // outward only: the lane stays open
  float x = fract(s / ${he}.0 - uPulse + aTp.y / uPeriod + 0.5);                      // a kink per pulse, 9 m/s down the line
  float b = exp(-(x - 0.5) * (x - 0.5) * 36.0) * smoothstep(0.0, 6.0, s);
  p.z += b * 1.5 * sin(ph * 5.0); p.x += sxn * b * 1.2; p.y += b * 1.6;
  return p;
}
void main() {
  float s = aTs.x;
  vec3 root = uTiltM * lmPulse(position);
  vec2 o = root.xz / max(length(root.xz), 0.01);
  float sxn = position.x < 0.0 ? -1.0 : 1.0;
  vec3 c = tentC(s, root, o, sxn), c2 = tentC(s + 0.6, root, o, sxn);
  vec4 wc = modelMatrix * vec4(c, 1.0);
  vec3 T = mat3(modelMatrix) * (c2 - c);
  vec3 toCam = cameraPosition - wc.xyz;
  float dist = max(length(toCam), 0.01);
  vec3 sd = cross(T, toCam); sd = sd / max(length(sd), 1e-5);
  float pxm = 2.0 / (projectionMatrix[1][1] * max(uViewH, 1.0)) * dist;              // metres per pixel here
  float taper = 1.0 - smoothstep(aTs.z * 0.92, aTs.z, s);
  float hw0 = aTp.z * mix(0.42, 0.11, pow(max(s / aTs.z, 1e-4), 0.6)) * (0.25 + 0.75 * taper) * (1.0 + 0.2 * sin(s * 2.4 + aTp.x));   // beaded
  float hw = max(hw0, 0.8 * pxm);
  vec3 wp = wc.xyz + sd * aTs.y * hw;
  vRest = vec3(aTp.x * 9.0 + aTs.y * hw0, s, aTp.x * 4.0); vWp = wp; vSide = aTs.y; vWpx = hw / pxm; vS = s; vCov = hw0 / hw;
  vBody = 0.1 + 0.9 * s / 300.0;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,Ge=`
uniform float uSeed;
varying vec3 vRest; varying vec3 vWp; varying float vSide, vWpx, vBody, vS, vCov;
void main() {
  float foot = lmFoot(vRest), g = lmGrain(vRest, foot, uSeed + 6.0);
  float w = lmLineW(vRest), e = abs(vSide);
  vec3 m = vec3(1.0);
  float tone = 0.14 + 0.7 * smoothstep(-0.35, 0.95, vSide);                      // a round cord: paper on the lit side, dense in shade
  float regR = lmReg(uInk.y, vBody, g);
  m = mix(m, m * lmMul(uRose), lmOn(tone, g) * regR);
  float thin = 1.0 - smoothstep(1.2, 3.0, vWpx);                                  // a hairline: drawn in rose, paler as it gets finer
  float line = lmLine((1.0 - e) * vWpx, w * 0.75) * (1.0 - thin);
  float fs = max(fwidth(vS), 1e-5), sp = 0.62;                                    // stinging-cell rings, drawn on the shade side only
  float ring = lmLine(abs(fract(vS / sp + 0.18 * vSide * vSide) - 0.5) * sp / fs, w * 0.85);
  line = max(line, ring * smoothstep(3.0, 6.0, sp / fs) * smoothstep(-0.25, 0.1, vSide) * smoothstep(3.0, 6.0, vWpx) * 0.8);
  float cov = mix(1.0, clamp(vCov, 0.22, 1.0), thin);
  m = mix(m, lmMul(uRose), thin * regR);
  line = max(line, thin * (1.0 - regR) * 0.8);                                    // before the rose stone prints it is a thin key line
  m = mix(vec3(1.0), m, cov); line *= cov;
  gl_FragColor = lmFinish(m, line, length(cameraPosition - vWp));
}`,Oe=`
varying vec3 vDir;
void main() { vDir = position; vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * mat3(modelMatrix) * position, 1.0); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }`,Ie=`
uniform vec3 uPaperLow;
varying vec3 vDir;
void main() {
  vec3 d = vDir / max(length(vDir), 1e-4);
  vec3 col = mix(uPaperLow, uPaper, smoothstep(-0.9, 0.1, d.y));
  vec2 f = gl_FragCoord.xy / max(uPx, 0.25);                       // fibre tooth fixed to the sheet, 1.5% contrast
  float n = lmVn(vec3(f.x * 0.55, f.y * 0.9, 1.0)) * 0.6 + lmVn(vec3(f.x * 0.09, f.y * 1.7, 5.0)) * 0.4;
  col *= 1.0 + (n - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}`,xe={chrysaora:{id:"chrysaora",code:0,lappets:32,NU:256,depth:22,thick:6.2,lappetLen:4.2,lipLen:3.8,gonadR:4.5,gonadTube:1.65,armLen:150,armW:8,armX:15.4,armFold:.42,armNS:420,ruffle:1,tentLen:300,tentW:1},pelagia:{id:"pelagia",code:1,lappets:16,NU:256,depth:25,thick:7.2,lappetLen:5.2,lipLen:4.6,gonadR:4.1,gonadTube:1.9,armLen:112,armW:8.8,armX:15.8,armFold:.6,armNS:340,ruffle:1.15,tentLen:300,tentW:1.5},cyanea:{id:"cyanea",code:2,lappets:16,NU:256,depth:17.5,thick:5,lappetLen:5.8,lipLen:5.2,gonadR:4.7,gonadTube:1.5,armLen:124,armW:10,armX:16.4,armFold:.8,armNS:360,ruffle:1.35,tentLen:290,tentW:.8}},_e=new i.Vector2;async function Ue(e,r={}){const t=e.rng,s=e.quality?.detail??1,v=r.palette||ie,u=xe[r.species]?r.species:t.fork("medusa").pick(["chrysaora","chrysaora","pelagia","cyanea"]),m=Object.assign({},xe[u]);m.depth*=t.range(.93,1.08),m.armW*=t.range(.92,1.1),m.gonadR*=t.range(.92,1.08);const y=r.period??t.range(4.4,5.6),g=Math.floor(t.range(0,40)),M=new Float32Array(6);for(let w=0;w<6;w++)M[w]=w%3===2?t.range(.6,1.3):t.range(0,C);const A=t.fork("organs"),x=Math.cos(re),f=Math.sin(re),l=(w,b,S)=>new i.Vector3(w,b*x+S*f,-b*f+S*x),d=[],a=(w,b,S,z,F)=>{const G=w*Math.PI/180,q=t.range(0,C),te=t.range(0,.25);d.push({x:b*Math.sin(G),y:S,z:b*Math.cos(G),len:z,ph:q,lag:te,w:F}),d.push({x:-b*Math.sin(G),y:S,z:b*Math.cos(G),len:z,ph:q,lag:te+.5,w:F})};for(let w=0;w<4;w++){const b=22.5+45*w;if(u==="chrysaora")for(const S of[-6,0,6])a(b+S,29.2,.1,m.tentLen*t.range(.84,1),m.tentW*t.range(.9,1.15));else if(u==="pelagia")a(b,29.4,.1,m.tentLen*t.range(.9,1),m.tentW*t.range(.9,1.1));else{const S=Math.max(5,Math.round(8*s));for(let z=0;z<S;z++){const F=t.range(22,26.5);a(b+t.range(-6.5,6.5),F,Y(F,m.depth,m.thick)-.3,m.tentLen*t.range(.55,1),m.tentW*t.range(.8,1.2))}}}await e.yield();const o=Ae(v,r.shadeInk);o.uPeriod.value=y,r.light&&o.uLight.value.copy(r.light).normalize();const c=()=>({uLappets:{value:m.lappets},uSpecies:{value:m.code},uLapV:{value:28/36},uDepth:{value:m.depth},uSeed:{value:g}}),n=K(o,{tint:!0,vertex:ge,fragment:Se,uniforms:c()}),h=K(o,{tint:!0,vertex:ge,fragment:Fe,uniforms:c()}),p=K(o,{tint:!1,side:i.DoubleSide,vertex:Be,fragment:Ve,uniforms:{uSeed:{value:g+1}}}),k=K(o,{tint:!0,side:i.DoubleSide,vertex:Ne,fragment:We,uniforms:{uSeed:{value:g+2},uArmLen:{value:m.armLen},uRuffle:{value:m.ruffle}}}),R=new i.Matrix3().set(1,0,0,0,x,f,0,-f,x),L=K(o,{tint:!0,side:i.DoubleSide,vertex:Ce,fragment:Ge,uniforms:{uSeed:{value:g+3},uTiltM:{value:R},uViewH:{value:450}}}),T=new i.Group;T.name="litho-medusae-hero";const B=new i.Group;B.position.y=ce,T.add(B);const N=new i.Group;N.rotation.x=-re,B.add(N);const D=(w,b,S,z)=>{const F=new i.Mesh(b,S);return F.frustumCulled=!1,F.renderOrder=z,w.add(F),F};if(r.page!==!1){const w=K(o,{tint:!1,side:i.BackSide,depthTest:!1,vertex:Oe,fragment:Ie,uniforms:{uPaperLow:{value:new i.Color(r.paperLow||"#D8DDC6")}}});w.depthWrite=!1,D(T,new i.IcosahedronGeometry(900,3),w,-.5)}await e.yield();const E=Pe(m,A);D(N,await Te(E.parts,e),p,0),await e.yield(),D(N,await ve(m,!0,e),h,2),await e.yield(),D(N,await ve(m,!1,e),n,3),await e.yield();const I=await ze(m,M,l,e);D(B,I.geometry,k,4),await e.yield(),D(B,await De(d,u==="cyanea"?90:120,e),L,5),await e.yield();const V=w=>w.clone().add(B.position),_=new i.Vector3(0,x,-f),j=new i.Vector3(0,ce,0),W={mouth:j,axis:_,portalSeat:{position:j.clone(),normal:_.clone().negate()},crown:V(l(0,m.depth,0)),nearRim:V(l(0,0,X)),farRim:V(l(0,0,-X)),gonads:E.gonads.map(w=>V(l(w.x,w.y,w.z))),armRoots:I.roots.map(V),armWalls:I.walls.map(V),laneHalfWidth:8.5,flyThrough:[[0,232,243],[0,221,150],[0,210,66],[0,211.2,48.9],[0,220.2,31.6],[0,236,25],[0,263,12.5],[0,290,0]].map(w=>new i.Vector3(w[0],w[1],w[2])),viewpoints:{reveal:{position:new i.Vector3(0,232,246),target:j.clone()},image:{position:new i.Vector3(0,210,61),target:new i.Vector3(0,282,6)},climb:{position:new i.Vector3(0,249,19),target:j.clone()}}};let P=null;return{object:T,radius:34,height:330,center:new i.Vector3(0,266,2),anchors:W,ground:!1,groundY:0,species:u,period:y,uniforms:o,setProgress(w){const b=(S,z)=>{const F=Math.min(1,Math.max(0,(w-S)/(z-S)));return F*F*(3-2*F)};o.uInk.value.set(b(.385,.435),b(.4,.48),b(.445,.5))},setInks(w,b,S){o.uInk.value.set(w,b,S)},setPulseClock(w){P=w},update(w,b,S){o.uTime.value=b%3600;const z=b*4,F=Math.floor(z),G=Math.min(1,Math.max(0,(z-F-.5)*2));o.uSeedT.value=F%97,o.uSeedF.value=G*G*(3-2*G),o.uPulse.value=(P??b)/y%4096;const q=e.renderer?e.renderer.getDrawingBufferSize(_e).y:450;o.uPx.value=Math.max(.25,q/450),L.uniforms.uViewH.value=q},dispose(){}}}export{ke as LITHO_FRAG,Me as LITHO_VERT,Ue as buildHero,Ae as lithoUniforms,K as styleMaterial};
