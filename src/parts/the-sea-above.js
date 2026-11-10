import*as a from"three";import{clamp as E,lerp as U,smoothstep as I}from"../kit/core.js";const Vt=["#0a3f6a","#1f8fb8","#8fe0e8","#f2d27a","#c99a3a","#5a3f1a","#ff5a3a"],pe=72,kt=[[0,5e-4,5e-4,5e-4],[.006,.016,.006,.01],[.025,.034,.013,.022],[.08,.052,.022,.04],[.17,.066,.034,.058],[.28,.072,.046,.066],[.4,.07,.054,.061],[.52,.062,.054,.051],[.65,.046,.046,.04],[.78,.027,.035,.03],[.88,.013,.025,.022],[.95,.007,.014,.012],[1,.004,.005,.005]];function Me(u,c){const t=kt;let i=0;for(;i<t.length-2&&u>t[i+1][0];)i++;const g=t[Math.max(i-1,0)],v=t[i],f=t[i+1],h=t[Math.min(i+2,t.length-1)],S=f[0]-v[0],x=E((u-v[0])/S,0,1),B=(f[c]-g[c])/(f[0]-g[0])*S,A=(h[c]-v[c])/(h[0]-v[0])*S,b=x*x,P=b*x;return 1.12*Math.max(4e-4,(2*P-3*b+1)*v[c]+(P-2*b+x)*B+(-2*P+3*b)*f[c]+(P-b)*A)}const Tt=u=>U(.19,.165,I(0,.1,u))+I(.12,.2,u)*.075;function Ae(u,c,t,i){const g=Me(u,1),v=Me(u,2),f=Me(u,3),h=Math.sin(c),S=Math.cos(c),x=U(.72,1,I(.12,.34,u)),B=U(.8,1,I(.5,.8,u));let A=g*Math.sign(h)*Math.pow(Math.abs(h),.92),b=S>=0?v*Math.pow(S,x):-f*Math.pow(-S,B);const P=Math.min(c,Math.PI*2-c);b+=.011*Math.exp(-(((u-.165)/.022)**2))*Math.exp(-((P/.42)**2)),b+=.0035*Math.exp(-((P/.15)**2))*(1-I(.11,.17,u))*I(0,.02,u);const F=P/(Math.PI*2)-Tt(u),G=.0036*Math.exp(-(((F-.022)/.02)**2))*(1-I(.17,.23,u))*I(0,.03,u),l=Math.hypot(A,b)||1;A+=A/l*G,b+=b/l*G;const p=I(.7,.9,u)*.003*Math.pow(Math.abs(S),6);return b+=Math.sign(S)*p,i.set(A*t,b*t,-u*t)}async function it(u,c=132,t=64,i=async()=>{}){const g=[],v=[],f=[],h=new a.Vector3,S=[];for(let l=0;l<=c;l++){const p=l/c,w=U(p,.5-.5*Math.cos(Math.PI*p),.55);for(let T=0;T<=t;T++)Ae(w,T/t*Math.PI*2,u,h),g.push(h.x,h.y,h.z),v.push(w,T/t,0);S.push(l*(t+1),l*(t+1)+t),await i()}await i();for(let l=0;l<c;l++){for(let p=0;p<t;p++){const w=l*(t+1)+p,T=w+t+1;f.push(w,w+1,T,w+1,T+1,T)}l%16===15&&await i()}await i();const x=new a.Vector3,B=new a.Vector3,A=new a.Vector3,b=new a.Vector3;function P(l){const p=g.length/3,w=f.length,T=new a.Vector3(...l.span).normalize(),z=new a.Vector3(...l.chord||[0,0,1]);z.addScaledVector(T,-z.dot(T)).normalize();const C=new a.Vector3().crossVectors(T,z).normalize(),le=l.nU,W=l.nV;for(let V=0;V<=le;V++){const _=V/le,j=Math.max(.03,l.chordFn(_)),q=j*l.thick;x.set(...l.root).addScaledVector(T,l.len*_).addScaledVector(z,-l.sweep(_)).addScaledVector(C,l.bend?l.bend(_):0);for(let M=0;M<W;M++){const Y=M/W*Math.PI*2,Pe=Math.cos(Y),$=Math.sin(Y);B.copy(x).addScaledVector(z,Pe*.5*j).addScaledVector(C,$*.5*q*(.55+.45*Pe)),g.push(B.x,B.y,B.z),v.push(E(-B.z/u,0,1.1),0,l.part)}}for(let V=0;V<le;V++)for(let _=0;_<W;_++){const j=p+V*W+_,q=p+V*W+(_+1)%W,M=j+W,Y=q+W;f.push(j,q,M,q,Y,M)}const H=w+(Math.floor(le/2)*W+1)*6;x.fromArray(g,f[H]*3),B.fromArray(g,f[H+1]*3),A.fromArray(g,f[H+2]*3),b.subVectors(B,x).cross(A.clone().sub(x));const ce=new a.Vector3(...l.root).addScaledVector(T,l.len*.5).addScaledVector(z,-l.sweep(.5));if(b.dot(x.clone().add(B).add(A).multiplyScalar(1/3).sub(ce))<0)for(let V=w;V<f.length;V+=3){const _=f[V+1];f[V+1]=f[V+2],f[V+2]=_}}for(const l of[1,-1])await i(),Ae(.245,2.05,u,h),P({part:1,root:[l*(h.x-.25),h.y+.1,h.z],span:[l*.74,-.36,-.57],len:.15*u,nU:14,nV:14,chordFn:p=>.031*u*1.6*(.7+p)*Math.pow(1-p,.75),sweep:p=>.04*u*p*p,thick:.2,bend:p=>.012*u*p*p*l}),await i(),P({part:2,root:[0,0,-.957*u],span:[l,0,0],len:.128*u,nU:16,nV:14,chordFn:p=>u*(.09*Math.pow(1-p,.75)+.003),sweep:p=>u*(.03*p+.055*p*p),thick:.14,bend:p=>-.006*u*p*p*l});await i(),P({part:1,root:[0,Me(.755,2)*u-.08,-.755*u],span:[0,.88,-.47],len:.017*u,nU:6,nV:10,chordFn:l=>u*(.034*Math.pow(1-l,.8)+.004),sweep:l=>u*.02*Math.pow(l,1.5),thick:.2}),await i();const F=new a.BufferGeometry;F.setAttribute("position",new a.Float32BufferAttribute(g,3)),await i(),F.setAttribute("aInfo",new a.Float32BufferAttribute(v,3)),await i(),F.setIndex(f),await i(),F.computeVertexNormals(),await i();const G=F.attributes.normal;for(let l=0;l<S.length;l+=2){const p=S[l],w=S[l+1];x.fromBufferAttribute(G,p).add(B.fromBufferAttribute(G,w)).normalize(),G.setXYZ(p,x.x,x.y,x.z),G.setXYZ(w,x.x,x.y,x.z)}return F}const Fe=`
#define NP ${pe}
uniform vec3 uPath[NP];
uniform float uPathStep;
uniform float uHead;
uniform vec4 uRoll;
uniform float uTime;
uniform float uCeil;
uniform float uLen;
vec3 pathPos(float s, out vec3 T) {
  float f = s / uPathStep;
  float fc = clamp(f, 0.0, float(NP - 1) - 0.001);
  int i = int(floor(fc)); float t = fc - float(i);
  vec3 p0 = uPath[max(i - 1, 0)], p1 = uPath[i], p2 = uPath[min(i + 1, NP - 1)], p3 = uPath[min(i + 2, NP - 1)];
  vec3 b = p2 - p0, c = 2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3, d = -p0 + 3.0 * p1 - 3.0 * p2 + p3;
  vec3 pos = 0.5 * (2.0 * p1 + b * t + c * t * t + d * t * t * t);
  T = normalize(0.5 * (b + 2.0 * c * t + 3.0 * d * t * t));
  return pos + T * (f - fc) * uPathStep;
}
// frame along the path: S = whale's right, N = dorsal, T = forward; includes the slow roll
void pathFrame(float s, out vec3 P, out vec3 S, out vec3 N, out vec3 T) {
  P = pathPos(s, T);
  vec3 z = vec3(0.0, 0.0, -1.0);
  S = normalize(z - T * dot(z, T));
  N = cross(T, S);
  float r = uRoll.x + uRoll.y * smoothstep(uRoll.z, uRoll.w, s);
  float c = cos(r), sn = sin(r);
  vec3 S2 = S * c + N * sn; N = N * c - S * sn; S = S2;
}
`,Se=`
float hash11(float n) { return fract(sin(n) * 43758.5453123); }
float hash31(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash31(i), hash31(i + vec3(1,0,0)), f.x), mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x), mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm3(vec3 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 11.7; a *= 0.5; } return s / 0.9375; }
// animated caustic network, 0..~1.5
float caustic(vec2 uv, float time) {
  vec2 p = mod(uv * 6.28318, 6.28318) - 250.0; vec2 i = p; float c = 1.0;
  for (int n = 0; n < 4; n++) {
    float t = time * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + t) / 0.005), p.y / (cos(i.y + t) / 0.005)));
  }
  c = 1.17 - pow(c / 4.0, 1.4);
  return pow(abs(c), 8.0);
}
`,Bt=`
${Fe}
uniform float uBeat;
attribute vec3 aInfo;
varying vec3 vBody; varying vec3 vNb; varying vec3 vInfo; varying vec3 vWN; varying vec3 vWT; varying vec3 vWP;
varying float vLocalY; varying float vS;
#include <fog_pars_vertex>
void main() {
  float d = -position.z;
  float s = uHead - d;
  vec3 P, S, N, T; pathFrame(s, P, S, N, T);
  // slow dorso-ventral swimming wave growing toward the flukes
  float k = d / uLen, ph = uTime * uBeat - k * 3.2;
  float fy = uLen * 0.045 * k * k * sin(ph);
  float df = 0.045 * (2.0 * k * sin(ph) - 3.2 * k * k * cos(ph));
  vec3 lp = P + S * position.x + N * (position.y + fy);
  vec3 nb = normalize(vec3(normal.x, normal.y, normal.z + df * normal.y));
  vec3 ln = S * nb.x + N * nb.y + T * nb.z;
  vBody = position; vNb = normal; vInfo = aInfo; vLocalY = lp.y; vS = s;
  vec4 wp = modelMatrix * vec4(lp, 1.0);
  vWP = wp.xyz; vWN = mat3(modelMatrix) * ln; vWT = mat3(modelMatrix) * T;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,_t=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGroundCol, uSkinA, uSkinB, uBelly, uSeaTint;
uniform float uTime, uCeil, uLen, uSeed, uExitS, uEnterS;
varying vec3 vBody; varying vec3 vNb; varying vec3 vInfo; varying vec3 vWN; varying vec3 vWT; varying vec3 vWP;
varying float vLocalY; varying float vS;
${Se}
#include <fog_pars_fragment>
void main() {
  vec3 N = normalize(vWN); vec3 V = normalize(cameraPosition - vWP);
  float t = vInfo.x, th = vInfo.y, part = vInfo.z;
  float isBody = 1.0 - step(0.5, part);
  vec3 q = vBody * (30.0 / uLen) + uSeed;
  float m1 = fbm3(q * 0.55), m2 = fbm3(q * 2.1 + 7.0), m3 = vnoise(q * 8.0);
  // slate blue with the pale mottling of a blue whale, darker along the back
  vec3 alb = mix(uSkinA, uSkinB, smoothstep(0.35, 0.72, m1) * 0.8);
  float spots = smoothstep(0.56, 0.74, m2) * (0.4 + 0.6 * m1);
  alb = mix(alb, uSkinB * 1.7 + 0.03, spots * 0.6);
  alb *= 0.82 + 0.36 * m3;
  float ventral = (1.0 - smoothstep(-0.6, 0.2, normalize(vNb).y));
  alb = mix(alb, uBelly * (0.7 + 0.6 * m1) * (0.72 + 0.5 * smoothstep(0.3, 0.7, m2)) + spots * 0.1, ventral * mix(0.3, 0.7, isBody));
  alb *= mix(1.0, 0.72, smoothstep(0.5, 0.95, normalize(vNb).y) * isBody);
  // throat pleats: grooves from chin to navel
  float a = abs(th - 0.5) * 2.0;                                    // 0 at the belly line, 1 on the back
  float zone = isBody * (1.0 - smoothstep(0.48, 0.62, a)) * (1.0 - smoothstep(0.50, 0.60, t)) * smoothstep(0.012, 0.05, t);
  float pk = th * 6.28318 * 58.0;
  float aa = clamp(1.7 - fwidth(pk) * 0.8, 0.0, 1.0);
  float groove = smoothstep(0.25, 0.95, sin(pk));
  alb *= 1.0 - zone * groove * 0.62 * aa;
  vec3 circ = normalize(cross(normalize(vWT), N));
  N = normalize(N + circ * cos(pk) * 0.6 * zone * aa);
  // mouth line, lip and eye
  float a2 = min(th, 1.0 - th);
  float thm = mix(0.19, 0.165, smoothstep(0.0, 0.1, t)) + smoothstep(0.12, 0.2, t) * 0.075;
  float mouth = isBody * (1.0 - smoothstep(0.001, 0.007, abs(a2 - thm))) * step(t, 0.203) * smoothstep(0.0, 0.012, t);
  float lip = isBody * (1.0 - smoothstep(0.008, 0.035, a2 - thm)) * step(thm, a2) * step(t, 0.2);
  alb = mix(alb, alb * 1.5 + 0.03, lip * 0.5);
  alb *= 1.0 - 0.8 * mouth;
  float eyeD = length(vec2((t - 0.207) * uLen, (a2 - 0.262) * 11.0));
  alb = mix(alb, vec3(0.01, 0.012, 0.016), isBody * (1.0 - smoothstep(0.10, 0.17, eyeD)));
  alb = mix(alb, alb * 1.6, isBody * (1.0 - smoothstep(0.2, 0.34, eyeD)) * smoothstep(0.14, 0.2, eyeD) * 0.6);
  // light: sun through the water, aqua from the sea above, gold bounce off the wheat below
  float ndl = dot(N, uSunDir);
  float wrap = clamp(ndl * 0.75 + 0.25, 0.0, 1.0);
  vec3 hemi = mix(uGroundCol * 1.05 + uSkyCol * 0.32, uSkyCol, smoothstep(-0.9, 0.9, N.y));
  float ca = caustic(vWP.xz * 0.055 + vWP.y * 0.01, uTime * 0.5);
  vec3 col = alb * (hemi * 0.8 + uSunCol * wrap * (0.4 + 0.9 * ca * smoothstep(-0.1, 0.6, N.y)));
  float sub = 1.0 - smoothstep(0.0, 1.2, vLocalY - uCeil);
  // wet sheen
  vec3 H = normalize(V + uSunDir); float nh = max(dot(N, H), 0.0);
  col += sub * uSunCol * (pow(nh, 140.0) * 1.1 + pow(nh, 24.0) * 0.04) * (0.5 + 0.5 * m3) * smoothstep(-0.1, 0.2, ndl);
  float fr = pow(max(1.0 - max(dot(N, V), 0.0), 0.0), 3.5);
  vec3 env = mix(uGroundCol * 1.5, uSkyCol * 1.25, smoothstep(-0.35, 0.35, reflect(-V, N).y));
  col += sub * env * fr * 0.2;
  // white water still sliding off skin that has just left the sea
  float outside = smoothstep(uExitS, uExitS + 3.0, vS) * (1.0 - smoothstep(uEnterS - 2.0, uEnterS + 1.0, vS));
  float fresh = outside * exp(-max(vS - uExitS, 0.0) / 70.0);
  float streak = vnoise(vec3(th * 44.0, t * uLen * 0.55 + uTime * 1.6, uSeed));
  float run = smoothstep(0.66, 0.92, streak) * (0.2 + 0.8 * fresh) * outside;
  float seam = outside * ((1.0 - smoothstep(0.0, 4.0, vS - uExitS)) + (1.0 - smoothstep(0.0, 5.0, uEnterS - vS)));
  col = mix(col, vec3(0.75, 0.92, 1.0) * 1.1, clamp(run * 0.28 + seam * (0.4 + 0.6 * streak) * 0.8, 0.0, 1.0));
  // going back in, the skin within a few metres of the sea is veiled by the white water of the crown: pale flukes, not dark shards
  col = mix(col, vec3(0.8, 0.93, 1.0) * (0.78 + 0.3 * streak), 0.55 * smoothstep(uEnterS - 16.0, uEnterS - 5.0, vS) * (1.0 - smoothstep(0.0, 6.0, uCeil - vLocalY)));
  // parts still inside the sea above: a soft blue shape
  float depth = max(vLocalY - uCeil, 0.0);
  col = mix(col, uSeaTint * (0.7 + 0.5 * ca), smoothstep(0.0, 1.5, depth) * 0.6 + (1.0 - exp(-depth * 0.25)) * 0.4);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Ue=`
uniform float uTime;
uniform vec4 uSiteA;   // x, z, seconds since the snout crossed, bulge depth
uniform vec4 uSiteB;
float ringH(vec2 p, vec4 site) {
  float t = site.z; if (t < -3.0) return 0.0;
  float r = length(p - site.xy), tp = max(t, 0.0);
  float Rw = 5.0 + 7.5 * tp;
  float env = exp(-tp * 0.17) * smoothstep(0.0, 0.6, tp);
  float q = (r - Rw) / (9.0 + 2.5 * tp);
  float h = 1.5 * env * sin((r - Rw) * 0.5) * exp(-q * q);
  h += 0.7 * env * sin(r * 1.1 - tp * 6.0) * exp(-r / (5.0 + 2.5 * tp));
  float b = smoothstep(-2.4, 0.0, t) * (1.0 - smoothstep(0.8, 3.4, t));
  return h - site.w * b * exp(-r * r / 70.0);
}
float seaH(vec2 p) {
  float h = 0.55 * sin(p.x * 0.045 + uTime * 0.5) + 0.4 * sin(dot(p, vec2(0.031, 0.052)) - uTime * 0.42 + 1.7)
          + 0.22 * sin(dot(p, vec2(-0.09, 0.07)) + uTime * 0.8);
  return h + ringH(p, uSiteA) + ringH(p, uSiteB);
}`,Nt=`
${Ue}
uniform float uCeil;
varying vec3 vLP; varying vec3 vWP;
#include <fog_pars_vertex>
void main() {
  vec3 lp = vec3(position.x, uCeil + seaH(position.xz), position.z);
  vLP = lp;
  vec4 wp = modelMatrix * vec4(lp, 1.0); vWP = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Wt=`
${Ue}
${Se}
uniform vec3 uSunDir, uSunCol, uDeepCol, uAquaCol, uReflCol;
uniform vec2 uExtent; uniform float uBase, uMid;
uniform mat4 modelMatrix;
varying vec3 vLP; varying vec3 vWP;
#include <fog_pars_fragment>
float foamAt(vec2 p, vec4 site, float n) {
  float t = site.z; if (t < -1.0) return 0.0;
  float r = length(p - site.xy), tp = max(t, 0.0);
  float churn = exp(-r * r / (30.0 + 55.0 * tp)) * smoothstep(-0.6, 0.4, t) * exp(-max(tp - 1.2, 0.0) * 0.42);
  churn *= 0.3 + 0.7 * smoothstep(1.5, 5.5 + 2.5 * tp, r);         // a ring of foam round the hole, not a white lid over it
  float Rw = 5.0 + 7.5 * tp;
  float q = (r - Rw) / (8.0 + 2.0 * tp);
  float crest = smoothstep(0.55, 1.0, sin((r - Rw) * 0.5 + 1.2)) * exp(-q * q) * exp(-tp * 0.3) * smoothstep(0.0, 0.5, tp);
  return clamp(churn * (0.3 + 0.9 * n) + crest * (0.3 + 0.9 * n), 0.0, 1.0);
}
void main() {
  vec2 p = vLP.xz; float e = 0.7;
  float h0 = seaH(p), hx = seaH(p + vec2(e, 0.0)), hz = seaH(p + vec2(0.0, e));
  vec3 n = vec3(-(hx - h0) / e, 1.0, -(hz - h0) / e);
  vec2 w = p * 0.33;
  n.xz += 0.11 * vec2(sin(w.x * 1.3 + uTime * 1.1 + 1.7 * sin(w.y * 0.9 - uTime * 0.3)), cos(w.y * 1.1 - uTime * 0.9 + 1.7 * sin(w.x * 1.2)));
  n.xz += 0.09 * (vec2(vnoise(vec3(p * 0.9, uTime * 0.6)), vnoise(vec3(p * 0.9 + 31.0, uTime * 0.6))) - 0.5);
  vec3 nW = normalize(mat3(modelMatrix) * normalize(n));
  vec3 V = normalize(cameraPosition - vWP);
  vec3 nF = dot(nW, V) < 0.0 ? -nW : nW;
  float ndv = max(dot(nF, V), 0.0);
  float F = 0.03 + 0.97 * pow(max(1.0 - ndv, 0.0), 5.0);
  // looking into lit water: turquoise, with the caustic net drifting over it
  // the caustic net and the sun are the world's job when this patch is only a decal (uBase 0)
  float ca = 0.0, ca2 = 0.0;
  if (uBase > 0.5) { ca = caustic(p * 0.021 + n.xz * 0.25, uTime * 0.45); ca2 = caustic(p * 0.0083 - n.xz * 0.2 + 3.1, uTime * 0.3); }
  vec3 trans = mix(uDeepCol, uAquaCol, clamp(0.3 + ca * 0.8 + ca2 * 0.5 + h0 * 0.12, 0.0, 1.0));
  trans += uSunCol * (ca * 0.28 + ca2 * 0.12);
  // the sun seen through the surface
  vec3 R = refract(-V, nF, 0.75);
  float sg = max(dot(R, uSunDir * sign(R.y + 1e-4)), 0.0);
  vec3 sunT = uBase * uSunCol * (pow(sg, 500.0) * 5.0 + (pow(sg, 60.0) * 0.45 + pow(sg, 8.0) * 0.06) * (0.35 + 1.3 * ca));
  vec3 col = mix(trans + sunT, uReflCol, F * 0.85);
  float fn = fbm3(vec3(p * 0.45, uTime * 0.5));
  float foam = max(foamAt(p, uSiteA, fn), foamAt(p, uSiteB, fn));
  col = mix(col, vec3(1.0, 1.04, 1.06) * (1.0 + 0.5 * fn), foam);
  vec2 ed = abs(p - vec2(uMid, 0.0)) / uExtent;
  float edge = 1.0 - smoothstep(0.55, 1.0, length(ed * ed * vec2(1.0, 1.0)) * 1.05 + 0.25 * max(ed.x, ed.y));
  float full = mix(0.6, 0.96, F);
  float alpha = max(full * uBase, foam * 0.95) * edge;
  if (alpha < 0.004) discard;
  gl_FragColor = vec4(col, alpha);
  #include <fog_fragment>
}`,rt=`
// att: body-space attach point (x, y, distance behind snout); a: how far back along the path the
// water was shed (metres). Returns the local position of that water now.
vec3 trailAt(vec3 att, float a, float rise, float spread, float seed, out float emitY) {
  float s = uHead - att.z - a;
  vec3 P, S, N, T; pathFrame(s, P, S, N, T);
  vec3 off = S * att.x + N * att.y;
  vec3 e = P + off;
  emitY = e.y;
  vec3 o = normalize(off + vec3(1e-4));
  float wob = sin(a * 0.21 + seed * 40.0 + uTime * 0.8) * 0.5 + sin(a * 0.47 + seed * 17.0 - uTime * 1.3) * 0.25;
  return e + o * (0.12 + spread * a * 0.16) + S * (wob * a * 0.06)
       + vec3(0.0, rise * a * a, 0.0) + T * (a * 0.12 * exp(-a * 0.05));
}`,Rt=`
${Fe}
${rt}
attribute vec4 aPar;   // trail length, rise, spread, width
attribute vec3 aUV;    // f along 0..1, side -1/1, seed
varying vec3 vUV; varying float vAlpha; varying float vA;
#include <fog_pars_vertex>
void main() {
  float f = aUV.x, a = pow(f, 1.25) * aPar.x;
  float eY, eY2;
  vec3 p = trailAt(position, a, aPar.y, aPar.z, aUV.z, eY);
  vec3 p2 = trailAt(position, a + 0.4, aPar.y, aPar.z, aUV.z, eY2);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec3 wt = normalize(mat3(modelMatrix) * (p2 - p));
  vec3 side = normalize(cross(wt, normalize(cameraPosition - wp.xyz)));
  float wdt = aPar.w * (0.25 + 0.75 * smoothstep(0.0, 0.3, f)) * (1.0 + a * 0.09);
  wp.xyz += side * aUV.y * wdt;
  vUV = aUV; vA = a;
  vAlpha = smoothstep(0.0, 0.04, f) * pow(max(1.0 - f, 0.0), 2.1) * (1.0 - smoothstep(uCeil - 3.5, uCeil - 0.4, eY)) * (1.0 - smoothstep(uCeil - 3.0, uCeil + 0.4, p.y));
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Dt=`
uniform vec3 uWaterA, uWaterB; uniform float uTime;
varying vec3 vUV; varying float vAlpha; varying float vA;
${Se}
#include <fog_pars_fragment>
void main() {
  float x = vUV.y, seed = vUV.z;
  float flow = vA * 0.22 - uTime * 2.4;
  float n = vnoise(vec3(x * 2.2 + seed * 13.0, flow, seed * 7.0));
  float n2 = vnoise(vec3(x * 6.0 + seed * 5.0, flow * 2.3, 3.0));
  // not a sheet: each ribbon is a thread or two of water that is whole only where it leaves the skin and breaks at once into
  // beads that run up it, with a fizz of fine spray between the threads
  float thread = pow(max(0.5 + 0.5 * sin(x * 6.5 + seed * 30.0 + n * 5.0), 0.0), 6.0);
  float beads = smoothstep(0.5, 0.74, vnoise(vec3(seed * 31.0 + x * 1.5, flow * 7.0, 1.7)));
  float fizz = smoothstep(0.7, 0.9, vnoise(vec3(x * 9.0 + seed * 3.0, flow * 15.0, seed * 11.0)));
  float gaps = smoothstep(0.22, 0.55, n + (1.0 - vUV.x) * 0.4);
  float young = 1.0 - smoothstep(0.0, 0.22, vUV.x);
  float alpha = vAlpha * (1.0 - x * x) * gaps * (0.55 * thread * mix(beads, 1.0, young) * (0.45 + 0.55 * n2) + 0.15 * fizz * (1.0 - young));
  vec3 col = mix(uWaterA, uWaterB, clamp(thread * 0.8 + fizz * 0.5 + 0.15, 0.0, 1.0)) * (0.9 + 1.2 * n2 * n2 * n2 * thread);
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  #include <fog_fragment>
}`,st=`
uniform vec3 uWaterA, uWaterB; uniform float uTime;
varying vec2 vQ; varying float vAlpha; varying float vSeed;
#include <fog_pars_fragment>
void main() {
  float d = length(vQ * 2.0);
  float body = (1.0 - smoothstep(0.25, 1.0, d));
  float tw = pow(0.5 + 0.5 * sin(uTime * (5.0 + vSeed * 9.0) + vSeed * 60.0), 6.0);
  vec3 col = mix(uWaterA, uWaterB, 0.45 + 0.5 * (1.0 - smoothstep(0.0, 0.6, d))) * (0.85 + 2.4 * tw);
  gl_FragColor = vec4(col, vAlpha * body * 0.7);
  #include <fog_fragment>
}`,lt=`
// stretched camera-facing streak: 'position.xy' is the quad corner
vec4 streak(vec3 lp, vec3 lvel, float size, float stretch) {
  vec4 wp = modelMatrix * vec4(lp, 1.0);
  vec3 along = normalize(mat3(modelMatrix) * lvel + vec3(0.0, 1e-4, 0.0));
  vec3 side = normalize(cross(along, normalize(cameraPosition - wp.xyz)));
  wp.xyz += along * position.y * size * stretch + side * position.x * size * 0.62;
  return wp;
}`,Et=`
${Fe}
${rt}
${lt}
uniform float uFlow;
attribute vec3 aAtt; attribute vec4 aPar; attribute vec4 aSeed;   // phase, seed, scatter angle, speed
varying vec2 vQ; varying float vAlpha; varying float vSeed;
#include <fog_pars_vertex>
void main() {
  float A = aPar.x;
  float tau = fract(uTime * uFlow * aSeed.w / A + aSeed.x);
  float a = tau * A;
  float eY, eY2;
  vec3 p = trailAt(aAtt, a, aPar.y, aPar.z, aSeed.y, eY);
  vec3 p2 = trailAt(aAtt, a + 0.35, aPar.y, aPar.z, aSeed.y, eY2);
  vec3 sc = vec3(cos(aSeed.z), sin(aSeed.z * 1.7) * 0.5, sin(aSeed.z));
  p += sc * a * 0.11 * (0.3 + aSeed.y);
  float alive = smoothstep(0.0, 0.04, tau) * (1.0 - smoothstep(0.75, 1.0, tau))
              * (1.0 - smoothstep(uCeil - 3.0, uCeil - 0.4, eY)) * (1.0 - smoothstep(uCeil - 1.5, uCeil + 0.3, p.y));
  float size = aPar.w * (0.6 + 0.4 * alive);
  vec4 wp = streak(p, p2 - p, size * step(0.01, alive), 1.15 + 0.95 * aSeed.y);   // beads, a little drawn out, not streaks
  vQ = position.xy; vAlpha = alive; vSeed = aSeed.y;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,It=`
${lt}
uniform vec3 uSitePos[2]; uniform vec3 uSiteAxis[2]; uniform float uSiteClock[2];
uniform float uG, uCeil, uR0;
attribute vec4 aLaunch;   // angle, speed out, speed down, delay
attribute vec4 aMisc;     // site, size, seed, start radius scale
varying vec2 vQ; varying float vAlpha; varying float vSeed;
#include <fog_pars_vertex>
void main() {
  int k = int(aMisc.x + 0.5);
  float t = uSiteClock[k] - aLaunch.w, tt = max(t, 0.0);
  vec3 rd = vec3(cos(aLaunch.x), 0.0, sin(aLaunch.x));
  vec3 v0 = rd * aLaunch.y + uSiteAxis[k] * aLaunch.z;
  float drag = (1.0 - exp(-tt * 0.35)) / 0.35;
  vec3 p = uSitePos[k] + rd * (uR0 * aMisc.w) + v0 * drag + vec3(0.0, 0.5 * uG * tt * tt, 0.0);
  vec3 vel = v0 * exp(-tt * 0.35) + vec3(0.0, uG * tt, 0.0);
  float alive = step(0.0, t) * (1.0 - smoothstep(uCeil - 1.2, uCeil + 0.2, p.y));
  vec4 wp = streak(p, vel, aMisc.y * step(0.01, alive), 1.5 + 0.09 * length(vel));
  vQ = position.xy; vAlpha = alive; vSeed = aMisc.z;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ft=`
uniform vec3 uC, uAxis; uniform vec4 uShape;   // height, base radius, flare, opacity
uniform float uSpikes, uSeed, uCeil;
attribute vec2 aUV;
varying vec2 vUV; varying vec3 vWP; varying vec3 vWN; varying float vJag;
#include <fog_pars_vertex>
void main() {
  float th = aUV.x * 6.28318, v = aUV.y;
  vec3 rd = vec3(cos(th), 0.0, sin(th));
  // many thin fingers of unequal length, on three broad lobes
  float j1 = 0.5 + 0.5 * sin(th * uSpikes + sin(th * 3.0 + uSeed) * 1.3 + uSeed * 7.0);
  float j2 = 0.5 + 0.5 * sin(th * (uSpikes * 1.5 + 1.0) + uSeed * 3.0 + 2.0 * sin(th * 5.0));
  float jag = j1 * (0.55 + 0.45 * j2);
  float lobes = 1.0 + 0.2 * sin(th * 3.0 + uSeed * 3.0) + 0.1 * sin(th * 7.0 + uSeed);
  float h = uShape.x * lobes * v * (0.7 + 0.32 * jag * v);
  float r = uShape.y * (1.0 + 0.9 * exp(-v * 7.0)) + uShape.z * pow(v, 0.65) * lobes * (0.9 + 0.22 * j2 * v);
  vec3 lp = uC + uAxis * h + rd * r;
  lp.y = min(lp.y, uCeil + 0.6);
  vec3 ln = normalize(rd - uAxis * (0.25 + 0.5 * (1.0 - v)));
  vUV = aUV; vJag = jag;
  vec4 wp = modelMatrix * vec4(lp, 1.0); vWP = wp.xyz; vWN = mat3(modelMatrix) * ln;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ut=`
uniform vec3 uWaterA, uWaterB, uSunDir, uSunCol; uniform vec4 uShape;
uniform float uSpikes, uSeed, uTime;
varying vec2 vUV; varying vec3 vWP; varying vec3 vWN; varying float vJag;
${Se}
#include <fog_pars_fragment>
void main() {
  float v = vUV.y;
  float n = vnoise(vec3(vUV.x * 70.0, v * 4.0 - uTime * 1.6, uSeed));
  float n2 = vnoise(vec3(vUV.x * 210.0, v * 11.0 - uTime * 2.6, uSeed + 5.0));
  float tip = 0.46 + 0.5 * sqrt(max(vJag, 0.0));                              // how far up this finger reaches
  float edge = v + (n - 0.5) * 0.3;
  float mask = (1.0 - smoothstep(tip - 0.3, tip, edge)) * (1.0 - 0.8 * smoothstep(0.3, 0.95, v));   // a soft, torn upper edge that thins away
  vec3 N = normalize(vWN), V = normalize(cameraPosition - vWP);
  if (dot(N, V) < 0.0) N = -N;
  float fr = pow(max(1.0 - max(dot(N, V), 0.0), 0.0), 2.0);
  float fil = smoothstep(0.35, 0.9, n2) * smoothstep(0.3, 0.75, n);  // filaments of white water running down the sheet
  float bead = smoothstep(tip - 0.3, tip - 0.08, edge) * smoothstep(0.45, 0.8, n2);   // beaded rim breaking into drops
  float foot = (1.0 - smoothstep(0.0, 0.14, v));
  float foam = clamp(fil * 0.7 + bead + foot * 0.7, 0.0, 1.0);
  float sp = pow(max(dot(reflect(-V, N), uSunDir), 0.0), 30.0);
  vec3 col = mix(mix(uWaterA, uWaterB, 0.45), uWaterB, clamp(foam * 0.8 + fr * 0.25, 0.0, 1.0)) + uSunCol * sp * 0.5 + uWaterB * bead * 0.6;
  float alpha = uShape.w * mask * clamp(0.06 + 0.2 * fr + 0.52 * foam, 0.0, 0.72) * (0.6 + 0.4 * smoothstep(0.2, 0.6, n + (1.0 - v) * 0.5));   // a veil: the hole shows through it
  gl_FragColor = vec4(col, alpha);
  #include <fog_fragment>
}`,Gt=`
uniform vec3 uSitePos[2]; uniform vec3 uSiteAxis[2]; uniform float uSiteClock[2];
attribute vec4 aM;    // site, angle, radius 0..1, depth 0..1
attribute vec3 aM2;   // size, seed, delay
varying vec2 vQ; varying float vAlpha; varying float vSeed;
#include <fog_pars_vertex>
void main() {
  int k = int(aM.x + 0.5);
  float t = uSiteClock[k] - aM2.z, tt = max(t, 0.0);
  float env = smoothstep(0.0, 0.7, t) * exp(-max(tt - 1.0, 0.0) * 0.5);
  vec3 rd = vec3(cos(aM.y), 0.0, sin(aM.y));
  vec3 lp = uSitePos[k] + rd * aM.z * (3.5 + 3.4 * tt) + uSiteAxis[k] * aM.w * (5.0 + 9.0 * (1.0 - exp(-tt * 0.7)));
  lp.y += 0.25 * tt * tt;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(lp, 1.0);
  mvPosition.xy += position.xy * aM2.x * (1.0 + 0.45 * tt) * step(0.004, env);
  vQ = position.xy; vAlpha = env; vSeed = aM2.y;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Lt=`
uniform vec3 uWaterB; uniform float uTime;
varying vec2 vQ; varying float vAlpha; varying float vSeed;
${Se}
#include <fog_pars_fragment>
void main() {
  float d = length(vQ * 2.0);
  float n = vnoise(vec3(vQ * 3.0 + vSeed * 20.0, uTime * 0.4 + vSeed * 9.0));
  float a = (1.0 - smoothstep(0.1, 1.0, d + (n - 0.5) * 0.5));
  gl_FragColor = vec4(uWaterB * 0.92, a * a * vAlpha * 0.045);
  #include <fog_fragment>
}`,se=()=>a.UniformsUtils.merge([a.UniformsLib.fog]),Ht=u=>u-Math.floor(u),jt=[[0,34,37,15],[.25,30,29,12.5],[.5,24.5,23.5,12.5],[.75,27.5,26.5,16.5],[1,35,35,27]],qt=[[38,7,.2],[83,19,.44],[128,33,.68],[173,45,.88],[218,52.5,1],[263,54.5,1],[308,54.5,1]];async function Yt(u,c={}){const t=u.rng,i=async()=>{u.yield&&await u.yield()},g=Vt.map((e,o)=>new a.Color(c.palette&&c.palette[o]||e)),v=c.ceilingY??120,f=c.length??34,h=f/32,S=c.drop??t.range(56,62),x=c.spanIn??t.range(52,60),B=c.spanOut??t.range(170,180),A=c.viewSide??t.sign(),b=c.duration??24,P=!!c.lite,F=(P?.3:1)*(c.detail??u.quality?.detail??1),G=c.ceiling===void 0?"full":c.ceiling,l=.86,p=new a.Group;p.name="the-breach";const w=t.range(3,7)*t.sign(),T=v-S,z=x,C=B,le=[[-z-72,v+13,-w*1.25],[-z-44,v+12,-w*1.1],[-z-19,v+8.5,-w*.9],[-z,v,-w*.7],[-z*.62,v-S*.52,-w*.35],[-z*.3,v-S*.88,-w*.12],[0,T,0],[C*.22,v-S*.93,w*.1],[C*.5,v-S*.68,w*.3],[C*.78,v-S*.32,w*.5],[C,v,w*.7],[C+26,v+8.5,w*.9],[C+56,v+12,w*1.1],[C+86,v+13,w*1.25]].map(e=>new a.Vector3(e[0],e[1],e[2])),W=new a.CatmullRomCurve3(le,!1,"centripetal");W.arcLengthDivisions=600;const H=W.getSpacedPoints(pe-1),ce=W.getLength(),V=ce/(pe-1);await i();const _=new a.Vector3,j=new a.Vector3,q=new a.Vector3;function M(e,o,n){const r=e/V,s=E(r,0,pe-1-.001),m=Math.floor(s),d=s-m,y=H[Math.max(m-1,0)],N=H[m],k=H[Math.min(m+1,pe-1)],ve=H[Math.min(m+2,pe-1)];_.subVectors(k,y),j.copy(y).multiplyScalar(2).addScaledVector(N,-5).addScaledVector(k,4).sub(ve),q.copy(N).multiplyScalar(3).sub(y).addScaledVector(k,-3).add(ve);const Ie=(n||new a.Vector3).copy(_).addScaledVector(j,2*d).addScaledVector(q,3*d*d).normalize();return o.copy(N).multiplyScalar(2).addScaledVector(_,d).addScaledVector(j,d*d).addScaledVector(q,d*d*d).multiplyScalar(.5),o.addScaledVector(Ie,(r-s)*V)}const Y=new a.Vector3,Pe=new a.Vector3;await i();let $=0,te=ce,ye=ce/2,Ge=1e9,ze=v+10;for(let e=0,o=0;e<=ce;e+=.25){const n=M(e,Y).y;ze>=v&&n<v&&$===0&&($=e),ze<v&&n>=v&&(te=e),n<Ge&&(Ge=n,ye=e),ze=n,++o%60===0&&await i()}const he=M($,new a.Vector3),Le=new a.Vector3;M($+2,Y,Le),he.y=v;const ue=M(te,new a.Vector3),Ce=new a.Vector3;M(te-2,Y,Ce),ue.y=v;const ae=M(ye,new a.Vector3);await i();const He=(e=>{const o=$-.9*e,n=te+1.9*e,r=240,s=new Float32Array(r+1);for(let y=1;y<=r;y++){const N=U(o,n,(y-.5)/r),k=M(N-.45*e,Y).y;s[y]=s[y-1]+1/Math.sqrt(1-.6*E((v-k)/S,0,1))}const m=y=>{const N=E(y,0,1)*s[r];let k=0;for(;k<r-1&&s[k+1]<N;)k++;return U(o,n,(k+(N-s[k])/(s[k+1]-s[k]))/r)},d=y=>{const N=E((y-o)/(n-o),0,1)*r,k=Math.min(r-1,Math.floor(N));return l*U(s[k],s[k+1],N-k)/s[r]};return{headS:m,timing:{exit:d($),nadir:d(ye+.45*e),enter:d(te),gone:l}}})(f),xe=He.headS,L=He.timing;await i();const R={uPath:{value:H},uPathStep:{value:V},uHead:{value:xe(0)},uRoll:{value:new a.Vector4(-A*t.range(.38,.55),-A*t.range(.25,.4),ye-30,te-20)},uTime:{value:0},uCeil:{value:v},uLen:{value:f}},ct=(c.sunDir?new a.Vector3().copy(c.sunDir):new a.Vector3(-.38,.84,.38)).normalize(),je=new a.Color(1,1,1),O={uSunDir:{value:ct},uSunCol:{value:new a.Color(c.sunColor||"#fff1d6").multiplyScalar(2.3)},uSkyCol:{value:new a.Color(c.skyColor||g[2]).lerp(je,.3).multiplyScalar(.95)},uGroundCol:{value:new a.Color(c.groundColor||g[3]).multiplyScalar(.5)}},me={uWaterA:{value:g[2].clone().lerp(g[1],.15)},uWaterB:{value:new a.Color(1,1.04,1.07)}},J={uSitePos:{value:[he.clone(),ue.clone()]},uSiteAxis:{value:[Le.clone().multiplyScalar(.75).add(new a.Vector3(0,-.3,0)).normalize(),new a.Vector3(-Ce.x*.3,-1,-Ce.z*.3).normalize()]},uSiteClock:{value:[-10,-10]}},qe=[],oe=e=>{const o=new a.ShaderMaterial({fog:!0,...e});return qe.push(o),o},X=(e,o=0)=>(e.frustumCulled=!1,e.renderOrder=o,p.add(e),e),Ye=t.range(-.02,.03),Ve=new a.Color(.085,.09,.1),ke=g[0].clone().lerp(Ve,.26).offsetHSL(Ye,0,0).multiplyScalar(.95),Te=g[1].clone().lerp(new a.Color(.2,.22,.24),.36).offsetHSL(Ye,0,0).multiplyScalar(.52),Be=new a.Color(.13,.22,.33).lerp(g[3],.05);if(c.skin){if(c.skin.top){const e=new a.Color(c.skin.top);ke.copy(e).lerp(Ve,.12).multiplyScalar(.82),Te.copy(e).lerp(g[1],.4).lerp(Ve,.1).multiplyScalar(.8)}c.skin.belly&&Be.set(c.skin.belly).multiplyScalar(.62),c.skin.back&&(ke.setRGB(...c.skin.back[0]),Te.setRGB(...c.skin.back[1])),c.skin.under&&Be.setRGB(...c.skin.under)}await i();const $e=P?await it(f,76,40,i):await it(f,100,48,i);await i();const ut=X(new a.Mesh($e,oe({uniforms:{...se(),...R,...O,uBeat:{value:t.range(1.3,1.7)/Math.sqrt(h)},uSkinA:{value:ke},uSkinB:{value:Te},uBelly:{value:Be},uSeaTint:{value:g[1].clone().lerp(g[2],.35).multiplyScalar(.85)},uSeed:{value:t.range(0,100)},uExitS:{value:$},uEnterS:{value:te}},vertexShader:Bt,fragmentShader:_t})));ut.name="whale",await i();const de={uSiteA:{value:new a.Vector4(he.x,he.z,-10,5.5*h)},uSiteB:{value:new a.Vector4(ue.x,ue.z,-10,3*h)}};if(G){const e=.5*(z+C)+100,o=100,n=.5*(C-z),r=new a.PlaneGeometry(e*2,o*2,96,48).rotateX(-Math.PI/2).translate(n,0,0),s=X(new a.Mesh(r,oe({uniforms:{...se(),uTime:R.uTime,uCeil:R.uCeil,...de,uSunDir:O.uSunDir,uSunCol:O.uSunCol,uDeepCol:{value:g[1].clone().lerp(g[0],.25).multiplyScalar(.8)},uAquaCol:{value:g[2].clone().multiplyScalar(.95)},uReflCol:{value:g[3].clone().lerp(je,.45).multiplyScalar(.7)},uExtent:{value:new a.Vector2(e,o)},uMid:{value:n},uBase:{value:G==="decal"?0:1}},vertexShader:Nt,fragmentShader:Wt,transparent:!0,depthWrite:!1,side:a.DoubleSide})),1);s.name="sea-ceiling"}await i();const Z=new a.Vector3;function Oe(e){const o=t();if(o<.6)Ae(t.range(.04,.93),(t.range(-1.95,1.95)+Math.PI*2)%(Math.PI*2),f,Z),e[0]=Z.x*1.03,e[1]=Z.y*1.03,e[2]=-Z.z;else if(o<.82){const n=t(),r=t.sign();e[0]=r*n*.128*f,e[1]=.006*f*n*n,e[2]=f*(1+.012*n+.07*n*n)}else{const n=t.range(.25,1),r=t.sign();Ae(.245,2.05,f,Z),e[0]=r*(Z.x+.74*.15*f*n),e[1]=Z.y-.36*.15*f*n,e[2]=-Z.z+.57*.15*f*n+.04*f*n*n}return e}{const e=Math.round(190*(P?.3:1)),o=22,n=[0,0,0],r=[],s=[],m=[],d=[];for(let N=0;N<e;N++){N%10===9&&await i(),Oe(n);const k=t.chance(.12),ve=t.chance(.1),Ie=(ve?t.range(30,55):t.range(9,20)+(t.chance(.25)?t.range(3,8):0))*h,Mt=(ve?t.range(.02,.035):t.range(.1,.2))/h,At=t.range(.15,1),Pt=(ve?t.range(.12,.3):k?t.range(.7,1.3):t.range(.14,.5))*h,zt=t(),Ct=r.length/3;for(let re=0;re<=o;re++)for(const ee of[-1,1])r.push(n[0],n[1],n[2]),s.push(Ie,Mt,At,Pt),m.push(re/o,ee,zt);for(let re=0;re<o;re++){const ee=Ct+re*2;d.push(ee,ee+1,ee+2,ee+1,ee+3,ee+2)}}await i();const y=new a.BufferGeometry;y.setAttribute("position",new a.Float32BufferAttribute(r,3)),await i(),y.setAttribute("aPar",new a.Float32BufferAttribute(s,4)),y.setAttribute("aUV",new a.Float32BufferAttribute(m,3)),y.setIndex(d),await i(),X(new a.Mesh(y,oe({uniforms:{...se(),...R,...me},vertexShader:Rt,fragmentShader:Dt,transparent:!0,depthWrite:!1,side:a.DoubleSide})),3).name="water-ribbons"}await i();const _e=()=>{const e=new a.InstancedBufferGeometry;return e.setAttribute("position",new a.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),e.setIndex([0,1,2,0,2,3]),e},ne=(e,o,n,r)=>e.setAttribute(o,new a.InstancedBufferAttribute(new Float32Array(n),r));{const e=Math.round(3600*F),o=[0,0,0],n=[],r=[],s=[];for(let d=0;d<e;d++)d%120===119&&await i(),Oe(o),n.push(o[0],o[1],o[2]),r.push(t.range(10,26)*h,t.range(.09,.2)/h,t.range(.2,1.6),t.range(.1,.24)*(t.chance(.1)?2.2:1)*Math.sqrt(h)),s.push(t(),t(),t()*6.283,t.range(.7,1.4));await i();const m=_e();m.instanceCount=e,ne(m,"aAtt",n,3),ne(m,"aPar",r,4),ne(m,"aSeed",s,4),await i(),X(new a.Mesh(m,oe({uniforms:{...se(),...R,...me,uFlow:{value:6.5}},vertexShader:Et,fragmentShader:st,transparent:!0,depthWrite:!1,side:a.DoubleSide})),4).name="trail-drops"}await i();{const e=Math.round(5600*F),o=[],n=[];for(let s=0;s<e;s++){s%200===199&&await i();const m=s<e*.68;m?o.push(t()*6.283,t.range(1,6)*h,t.range(9,20)*(.55+.45*t())*h,Math.pow(t(),1.4)*2.2):o.push(t()*6.283,t.range(.5,5.5)*h,t.range(7,24)*(.5+.5*t())*h,t()*2.5),n.push(m?1:0,t.range(.2,.5)*(t.chance(.12)?1.8:1)*Math.sqrt(h),t(),t.range(.5,1.5))}await i();const r=_e();r.instanceCount=e,ne(r,"aLaunch",o,4),ne(r,"aMisc",n,4),await i(),X(new a.Mesh(r,oe({uniforms:{...se(),...me,...J,uTime:R.uTime,uCeil:R.uCeil,uG:{value:7},uR0:{value:3*h}},vertexShader:It,fragmentShader:st,transparent:!0,depthWrite:!1,side:a.DoubleSide})),4).name="splash-drops"}await i();const Q=new a.BufferGeometry;{const e=P?96:288,o=P?12:14,n=[],r=[];for(let s=0;s<=o;s++)for(let m=0;m<=e;m++)n.push(m/e,Math.pow(s/o,1.15));for(let s=0;s<o;s++)for(let m=0;m<e;m++){const d=s*(e+1)+m,y=d+e+1;r.push(d,d+1,y,d+1,y+1,y)}await i(),Q.setAttribute("aUV",new a.Float32BufferAttribute(n,2)),Q.setAttribute("position",new a.Float32BufferAttribute(new Float32Array((e+1)*(o+1)*3),3)),Q.setIndex(r)}const Qe=(e,o)=>oe({uniforms:{...se(),...me,uSunDir:O.uSunDir,uSunCol:O.uSunCol,uTime:R.uTime,uCeil:R.uCeil,uC:{value:J.uSitePos.value[e]},uAxis:{value:J.uSiteAxis.value[e]},uShape:{value:new a.Vector4(0,3,0,0)},uSpikes:{value:o},uSeed:{value:t.range(0,10)}},vertexShader:Ft,fragmentShader:Ut,transparent:!0,depthWrite:!1,side:a.DoubleSide});await i();const Je=X(new a.Mesh(Q,Qe(0,t.int(9,12))),2);Je.name="exit-sheath",await i();const fe=new a.BufferGeometry;fe.setAttribute("aUV",Q.attributes.aUV),fe.setAttribute("position",Q.attributes.position),fe.setIndex(Q.index);const Xe=X(new a.Mesh(fe,Qe(1,t.int(17,23))),2);Xe.name="crown-splash";const ft=(c.crownHeight??t.range(19,24))*h;{const e=P?50:230,o=[],n=[];for(let s=0;s<e;s++)o.push(s%3===0?0:1,t()*6.283,Math.sqrt(t()),t()),n.push(t.range(5,11)*h,t(),t()*2.2);const r=_e();r.instanceCount=P?e:72,ne(r,"aM",o,4),ne(r,"aM2",n,3),X(new a.Mesh(r,oe({uniforms:{...se(),...J,uWaterB:me.uWaterB,uTime:R.uTime},vertexShader:Gt,fragmentShader:Lt,transparent:!0,depthWrite:!1})),5).name="mist"}await i();const vt=e=>M(xe((e<0?U(L.nadir,L.exit,-e):U(L.nadir,L.enter,e))/l)-.45*f,new a.Vector3),pt=v-7.5,K=[],Ze=(e,o,n)=>{const r=new a.Vector3(e,o,n);return K.push(r),r},be=jt.map(([e,o,n,r])=>{const s=vt(e),m=f/44;return new a.Vector3(s.x-o*m,s.y-r*m,s.z+n*A*m)}),ge=be[0];for(const[e,o,n]of[[-99,109,0],[-81,76,.23],[-60,45,.48],[-33,19,.74]])Ze(ge.x+e,U(14,ge.y,n),ge.z+o*A);for(const e of be)K.push(e);const we=be[be.length-1];for(const[e,o,n]of qt)Ze(we.x+e,U(we.y,pt,n),we.z+o*A);const ht=K[1].clone().sub(K[0]).setY(0).normalize(),mt=new a.Vector3(ae.x+C*.2,ae.y+10,ae.z),dt={ceilingY:v,exitPoint:he,entryPoint:ue,nadir:ae,flyThrough:K,timing:L,viewSide:A,cues:{exit:K[0].clone(),nadir:ge.clone(),enter:we.clone()},bounds:{radius:Math.max(z,C)+16,top:v+2,bottom:ae.y-.08*f,ceilingPatch:[.5*(z+C)+100,100]},flyDirection:ht.clone(),exitDirection:new a.Vector3(1,0,0),portalSeat:{position:K[K.length-1].clone(),facing:new a.Vector3(-1,0,0)},viewpoints:[{position:new a.Vector3(C*.25,ae.y-22,105*A),lookAt:new a.Vector3(C*.25,v-S*.6,0)},{position:ge.clone(),lookAt:ae.clone()},{position:we.clone(),lookAt:ue.clone().add(new a.Vector3(0,-8,0))}]};await i();let D=null;c.calf&&(D=await Yt({...u,rng:t.fork("calf")},{...c,calf:!1,lite:!0,ceiling:!1,viewSide:A,length:f*.44,drop:S*.6,spanIn:z*.62,spanOut:C*.56,crownHeight:15}),D.object.position.set(z*.1,0,-15*A),D.object.name="calf-breach",p.add(D.object)),await i();const ie={head:new a.Vector3,mid:new a.Vector3,tail:new a.Vector3,airborne:0,progress:0};let Ne=null;const gt=Je.material.uniforms.uShape.value,wt=Xe.material.uniforms.uShape.value;function We(e,o){const n=xe(e/l);R.uHead.value=n,R.uTime.value=o;const r=(e-L.exit)*b,s=(e-L.enter)*b;J.uSiteClock.value[0]=r,J.uSiteClock.value[1]=s,de.uSiteA.value.z=r,de.uSiteB.value.z=s;const m=E(r/3.8,0,1);gt.set(20*h*Math.sin(Math.PI*Math.pow(m,.6)),(2.5+.6*m)*h,(1.6+3.2*m)*h,I(0,.04,m)*(1-I(.72,1,m)));const d=E(s/4.6,0,1);wt.set(ft*Math.sin(Math.PI*Math.pow(d,.52)),(3.2+2*d)*h,15*h*(1-Math.exp(-3*d)),I(0,.03,d)*(1-I(.7,1,d))),M(n,ie.head),M(n-.45*f,ie.mid),M(n-f,ie.tail),ie.airborne=E((v-ie.mid.y)/8,0,1),ie.progress=e,D&&D.applyAt(E(e*1.04-.07,0,1),o)}const St=(e,o,n,r)=>{const s=xe(E(e,0,1)/l);return o&&M(s,o),n&&M(s-.45*f,n),r&&M(s-f,r),n||o||r},yt=e=>(e-L.enter)*b/4.6,Ke=e=>e<L.exit-.03||e>.9995;We(.44,0);const Re=[];for(const e of p.children)if(e.isMesh){const o=e.geometry;Re.some(n=>n.g===o)||Re.push({g:o,n:o.isInstancedBufferGeometry?o.instanceCount:-1})}let De=!1;function et(e){if(e!==De){De=e;for(const o of Re)o.n>=0?o.g.instanceCount=e?0:o.n:o.g.setDrawRange(0,e?0:1/0)}}const Ee=e=>p.children.find(o=>o.name===e),tt=Ee("splash-drops").geometry,at=tt.instanceCount,ot=Ee("trail-drops").geometry,xt=ot.instanceCount,bt=Ee("water-ribbons").geometry;function nt(){if(De)return;const e=J.uSiteClock.value[0],o=J.uSiteClock.value[1],n=e>-.2;Q.setDrawRange(0,e>0&&e<3.8?1/0:0),fe.setDrawRange(0,o>0&&o<4.6?1/0:0),tt.instanceCount=e>-.1&&e<11?at:o>-.1&&o<11?Math.ceil(at*.68):0,ot.instanceCount=n?xt:0,bt.setDrawRange(0,n?1/0:0)}return{object:p,radius:.5*(z+C)+10,height:40,center:mt,anchors:dt,state:ie,timing:L,calf:D,sea:{uTime:R.uTime,uSiteA:de.uSiteA,uSiteB:de.uSiteB},ground:!0,groundY:0,applyAt:We,poseAt:St,crownAt:yt,setProgress(e){Ne=e==null?null:E(e,0,1)},setLight(e={}){e.sunDir&&O.uSunDir.value.copy(e.sunDir).normalize(),e.sunColor&&O.uSunCol.value.set(e.sunColor).multiplyScalar(e.sunIntensity??2.3),e.skyColor&&O.uSkyCol.value.set(e.skyColor),e.groundColor&&O.uGroundCol.value.set(e.groundColor),D&&D.setLight(e)},update(e,o){const n=Ne!==null?Ne:Ht(o/b-.06);We(n,o),et(Ke(n)),nt(),D&&D.rest(E(n*1.04-.07,0,1))},rest(e){et(Ke(e)),nt()},dispose(){$e.dispose(),Q.dispose(),fe.dispose();for(const e of qe)e.dispose();D&&D.dispose()}}}export{Ue as SEA_GLSL,Yt as buildHero};
