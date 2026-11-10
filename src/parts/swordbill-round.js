import*as m from"three";const zo=["#E6EEE9","#9FC6B4","#5F8F3A","#17301F","#F2C83A","#D8321E","#5A3FC8"],s=(v,i,n)=>new m.Vector3(v,i,n),ve=s(0,1,0),ie=(v,i,n)=>{const x=Math.min(1,Math.max(0,(n-v)/(i-v)));return x*x*(3-2*x)};function Vo(v,i,n){const x=n.x-i.x,_=n.y-i.y,N=n.z-i.z,q=v.x-i.x,G=v.y-i.y,S=v.z-i.z,A=x*x+_*_+N*N,E=A>1e-9?Math.min(1,Math.max(0,(q*x+G*_+S*N)/A)):0,R=q-x*E,b=G-_*E,F=S-N*E;return Math.sqrt(R*R+b*b+F*F)}function Ne(v,i){let n=1/0;for(let x=0;x<i.length-1;x++)n=Math.min(n,Vo(v,i[x],i[x+1]));return n}function Be(v,i){return new m.CatmullRomCurve3(v,!1,"centripetal").getSpacedPoints(i)}class at{constructor(i){this.sizes=i,this.a={};for(const n in i)this.a[n]=[];this.idx=[],this.n=0}v(i){for(const n in this.sizes){const x=i[n];for(let _=0;_<this.sizes[n];_++)this.a[n].push(x[_])}return this.n++}tri(i,n,x){this.idx.push(i,n,x)}quad(i,n,x,_){this.idx.push(i,n,x,i,x,_)}fixWinding(){const i=this.a.position,n=this.a.normal,x=this.idx;for(let _=0;_<x.length;_+=3){const N=x[_]*3,q=x[_+1]*3,G=x[_+2]*3,S=i[q]-i[N],A=i[q+1]-i[N+1],E=i[q+2]-i[N+2],R=i[G]-i[N],b=i[G+1]-i[N+1],F=i[G+2]-i[N+2],I=A*F-E*b,C=E*R-S*F,k=S*b-A*R;if(I*(n[N]+n[q]+n[G])+C*(n[N+1]+n[q+1]+n[G+1])+k*(n[N+2]+n[q+2]+n[G+2])<0){const j=x[_+1];x[_+1]=x[_+2],x[_+2]=j}}return this}geometry(){const i=new m.BufferGeometry;for(const n in this.sizes)i.setAttribute(n,new m.Float32BufferAttribute(this.a[n],this.sizes[n]));return i.setIndex(this.n>65535?new m.Uint32BufferAttribute(this.idx,1):new m.Uint16BufferAttribute(this.idx,1)),i}}function Ao(v,i,n,x,_,N){const q=i.length,G=s(),S=s(),A=s(),E=s(),R=new m.Quaternion,b=s();G.subVectors(i[1],i[0]).normalize(),S.set(1,0,0),Math.abs(G.x)>.9&&S.set(0,0,1),S.addScaledVector(G,-S.dot(G)).normalize();let F=0;const I=[];for(let C=0;C<q;C++){E.copy(G),C>0&&(F+=i[C].distanceTo(i[C-1])),C<q-1?G.subVectors(i[C+1],i[Math.max(0,C-1)]).normalize():G.subVectors(i[C],i[C-1]).normalize(),C>0&&(R.setFromUnitVectors(E,G),S.applyQuaternion(R),S.addScaledVector(G,-S.dot(G)).normalize()),A.crossVectors(G,S);const k=n(C),le=[];for(let j=0;j<=x;j++){const z=j/x*Math.PI*2,Se=Math.cos(z),he=Math.sin(z);b.set(0,0,0).addScaledVector(S,Se).addScaledVector(A,he);const ae=k*(N?N(C,z,F):1),je=_(C,F,b);le.push(v.v({position:[i[C].x+b.x*ae,i[C].y+b.y*ae,i[C].z+b.z*ae],normal:[b.x,b.y,b.z],aUV:[j/x,F],aM:je}))}I.push(le)}for(let C=0;C<q-1;C++)for(let k=0;k<x;k++)v.quad(I[C][k],I[C][k+1],I[C+1][k+1],I[C+1][k])}const bt=`
uniform float uTime; uniform vec3 uWindDir; uniform vec3 uGust;
float gustAt(vec3 p, float t) {
  float ph = dot(p, uWindDir) * uGust.x - t * uGust.y;
  float a = 0.5 + 0.5 * sin(ph);
  float b = 0.5 + 0.5 * sin(ph * 0.37 + p.y * 0.05 + 1.3);
  return a * a * (0.35 + 0.65 * b);
}
// pendulum of a bell hung at piv: axis (xyz) and angle (w). sw = phase, phase, amplitude, frequency
vec4 swingAA(vec3 piv, vec4 sw, float t) {
  float g = gustAt(piv, t);
  vec2 tau = sw.z * vec2(0.6 * sin(t * sw.w + sw.x) + 0.3 * sin(t * sw.w * 1.83 + sw.y),
                         0.6 * sin(t * sw.w * 0.93 + sw.y) + 0.3 * sin(t * sw.w * 1.61 + sw.x * 1.7));
  tau += uWindDir.xz * (uGust.z * sw.z * g * (1.5 + 0.4 * sin(t * sw.w * 1.3 + sw.x)));
  float len = length(tau);
  return vec4(vec3(-tau.y, 0.0, tau.x) / max(len, 1e-5), len);
}
vec3 rotAA(vec3 v, vec4 aa) {
  float c = cos(aa.w), s = sin(aa.w);
  return v * c + cross(aa.xyz, v) * s + aa.xyz * (dot(aa.xyz, v) * (1.0 - c));
}
`,Re=`
float h21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
`,Ce=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGroundCol; uniform float uWet, uGlow, uFogCut;
`;function Oe(v,i,n){const x=v/5*Math.PI*2,_=v-Math.floor(v)-.5,N=Math.min(i,1);let q=.038+.07*ie(.2,.8,N)+.082*Math.pow(N,5);q*=1+.06*Math.cos(_*Math.PI*2)*ie(.3,1,N);let G=-(.12+.88*N);if(i>1){const b=(.032+.23800000000000002*Math.pow(Math.max(0,1-2*Math.abs(_)),1.7))*(i-1);q+=(Math.cos(.96)-Math.cos(.96+11.2*b))/11.2,G-=(Math.sin(.96+11.2*b)-Math.sin(.96))/11.2}return n.set(Math.cos(x)*q,G,Math.sin(x)*q)}function St(v,i){const n=Math.min(1,Math.max(0,(v-.1)/.34));return(.034+.03*Math.sin(Math.PI*Math.pow(n,.75))*(1-.3*n)+.026*n)*(1+.09*Math.cos(i*Math.PI*2))}function Le(v,i,n,x,_,N){const q=s(),G=s(),S=s(),A=s(),E=[],R=.002,b=x[x.length-1];for(const F of x){const I=[];for(let C=0;C<=n;C++){const k=C/n*5;i(k,F,q),i(k+R,F,G),i(k-R,F,S),G.sub(S),i(k,Math.min(F+R,b),S),i(k,Math.max(F-R,0),A),S.sub(A),A.crossVectors(G,S),A.lengthSq()<1e-18&&A.set(Math.cos(k*1.2566),0,Math.sin(k*1.2566)),A.normalize(),I.push(v.v({position:[q.x,q.y,q.z],normal:[A.x,A.y,A.z],aUV:[k,N(F)],aPart:[_]}))}E.push(I)}for(let F=0;F<E.length-1;F++)for(let I=0;I<n;I++)v.quad(E[F][I],E[F][I+1],E[F+1][I+1],E[F+1][I])}async function zt(v,i,n,x,_){const N=new at({position:3,normal:3,aUV:2,aPart:1}),q=[...n];for(let S=1;S<=x;S++)q.push(1+S/x);const G=S=>S<=1?.12+.88*S:S;if(_===0){const S=s();Le(N,(A,E,R)=>{Oe(A,E,R);const b=G(E);if(b<.4){const F=A/5*Math.PI*2,I=St(Math.max(b,.14),A);R.x=Math.cos(F)*I,R.z=Math.sin(F)*I}return R},i*5,q,0,G);for(let A=0;A<N.n;A++)N.a.aUV[A*2+1]<.4&&(N.a.aPart[A]=1);S.set(0,0,0)}else{Le(N,Oe,i*5,q,0,G),await v.yield();const S=_===2?6:3,A=[];for(let b=0;b<=S;b++)A.push(b/S);Le(N,(b,F,I)=>{const C=Math.pow(Math.max(0,Math.cos(b*Math.PI*2)),2),k=.1+F*.34+.085*C*ie(.6,1,F),le=b/5*Math.PI*2,j=St(.1+F*.34,b)*(1-.1*C*ie(.7,1,F));return I.set(Math.cos(le)*j,-k,Math.sin(le)*j)},_===2?20:10,A,1,b=>.1+b*.34),await v.yield();const E=_===2?5:3,R=_===2?[0,.4,.8,.86,.94,1]:[0,.84,.9,1];for(let b=0;b<=5;b++){const F=b===5,I=(b+.5)/5*Math.PI*2;Le(N,(C,k,le)=>{const j=F?.45+.53*k:.5+.41*k,z=F?0:.016+.034*k*k,Se=ie(.8,.9,k)*(1-ie(.96,1,k)),he=(F?.006+.011*Se:.0055+.012*Se)*(k>=1?.3:1),ae=C/5*Math.PI*2;return le.set(Math.cos(I)*z+Math.cos(ae)*he,-j,Math.sin(I)*z+Math.sin(ae)*he)},E,R,2,C=>(F?2:1)+C)}}return await v.yield(),Le(N,(S,A,E)=>{const R=S/5*Math.PI*2,b=.012+.024*A*A*A;return E.set(Math.cos(R)*b,-.115*A,Math.sin(R)*b)},_===2?6:3,_===0?[0,1]:_===1?[0,.6,1]:[0,.4,.75,1],3,S=>S*.11),await v.yield(),N.fixWinding(),await v.yield(),N.geometry()}const Vt=`
#include <common>
#include <fog_pars_vertex>
${bt}
attribute vec2 aUV; attribute float aPart; attribute vec4 aSw; attribute vec4 aTint;
uniform float uScale;
varying vec2 vUv; varying float vPart; varying vec3 vWN; varying vec3 vWP; varying vec4 vTint;
void main() {
  vec3 piv = instanceMatrix[3].xyz;
  mat3 im = mat3(instanceMatrix);
  vec4 aa = swingAA(piv, aSw, uTime);
  vec3 rel = rotAA(im * position * uScale, aa);
  vec3 n = rotAA(im * normal, aa);
  vec4 wp = modelMatrix * vec4(piv + rel, 1.0);
  vWP = wp.xyz; vWN = mat3(modelMatrix) * n; vUv = aUV; vPart = aPart; vTint = aTint;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,At=`
#include <common>
#include <fog_pars_fragment>
${Re}
${Ce}
uniform vec3 uYel, uRed, uGreen, uDeep, uMist;
varying vec2 vUv; varying float vPart; varying vec3 vWN; varying vec3 vWP; varying vec4 vTint;
void main() {
  vec3 N = normalize(vWN + vec3(0.0, 1e-5, 0.0));
  bool front = gl_FrontFacing; if (!front) N = -N;
  vec3 toCam = cameraPosition - vWP; float dist = length(toCam);
  vec3 V = toCam / max(dist, 1e-4);
  vec3 L = uSunDir;
  float lu = vUv.x, v = vUv.y, fl = fract(lu);
  float rip = vTint.x, sunVis = vTint.y;
  float aa = fwidth(lu) * 1.3 + 0.003, fwv = fwidth(v);
  vec3 base; float tr = 1.0;
  if (vPart < 0.5) {
    // corolla: greenish at the calyx, yellow tube, scarlet flare and lobes
    float mott = vn(vec2(lu * 3.0, v * 9.0));
    float k = smoothstep(0.45 - 0.15 * rip, 0.86, v + 0.05 * mott - 0.025);
    base = mix(uYel, uRed, k);
    base = mix(uGreen * 1.0 + uYel * 0.4, base, smoothstep(0.34, 0.47, v));
    base *= 0.88 + 0.24 * vn(vec2(lu * 24.0, v * 38.0));
    float mid = 1.0 - smoothstep(0.016, 0.016 + aa, abs(fl - 0.5));
    float sec = 1.0 - smoothstep(0.008, 0.008 + aa, min(abs(fl - 0.2), abs(fl - 0.8)));
    float sn = 1.0 - smoothstep(0.010, 0.010 + aa, min(fl, 1.0 - fl));
    // side veins that leave the mid-vein toward the margin on the flare
    float herr = abs(fract(v * 16.0 - abs(fl - 0.5) * 5.0) - 0.5);
    float side = (1.0 - smoothstep(0.06, 0.06 + fwv * 16.0 + 0.02, herr)) * smoothstep(0.7, 0.9, v) * 0.35;
    float vein = max(max(mid, 0.75 * sn), max(0.6 * sec, side)) * clamp(0.035 / aa, 0.0, 1.0);
    vec3 veinCol = mix(uGreen * 0.7, uRed * 0.42, smoothstep(0.6, 0.95, v));
    base = mix(base, veinCol, vein * (0.8 - 0.35 * smoothstep(1.0, 1.7, v)));
    tr = 1.0 - 0.45 * vein;
    base *= 1.0 + vTint.z;
  } else if (vPart < 1.5) {
    float rib = 0.5 + 0.5 * cos(lu * 6.2832);
    base = mix(uGreen * 0.62, uGreen * 1.15 + uYel * 0.16, rib * 0.7 + 0.3 * vn(vec2(lu * 9.0, v * 30.0)));
    base = mix(base, uYel * 0.6 + uGreen * 0.5, smoothstep(0.34, 0.46, v) * 0.5);
    tr = 0.5;
  } else if (vPart < 2.5) {
    float anth = smoothstep(1.8, 1.88, v) * (1.0 - step(2.0, v)) + smoothstep(2.8, 2.9, v);
    base = mix(uYel * 0.55 + uMist * 0.45, v > 2.0 ? uGreen * 1.3 : uMist * 0.9 + uYel * 0.2, anth);
    tr = 0.15;
  } else {
    base = mix(uGreen * 0.8, uDeep * 1.5 + uGreen * 0.3, 0.4);
    tr = 0.0;
  }
  float ndl = dot(N, L);
  float dif = max(ndl, 0.0) * sunVis;
  float back = max(-ndl, 0.0) * sunVis;
  vec3 amb = mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5);
  float deep = front ? 1.0 : mix(0.34, 1.0, smoothstep(0.35, 1.0, v));        // darker up the tube
  vec3 tcol = base * (0.35 + 1.5 * base);                                      // light that came through a petal
  float vb = max(dot(V, L) * -1.0, 0.0); vb *= vb;                              // the sun is beyond the flower
  vec3 col = base * (amb * deep + uSunCol * dif * (front ? 1.0 : 0.55));
  col += tcol * uSunCol * tr * uGlow * (back * (0.5 + 1.5 * vb) + (front ? 0.05 : 0.2 * (0.3 + 0.7 * sunVis)));
  col += tcol * uSunCol * tr * uGlow * vb * (0.3 + 0.6 * vb) * (0.35 + 0.65 * sunVis) * (front ? 1.0 : 1.5 + 1.2 * (1.0 - smoothstep(0.45, 1.25, v)));
  float fres = 1.0 - abs(dot(N, V)); fres = fres * fres * fres;
  col += tcol * uSunCol * tr * fres * (0.10 + 0.9 * back + 0.5 * vb * sunVis);
  float rim = smoothstep(1.72, 2.0, v) * step(vPart, 0.5);
  col += tcol * uSunCol * rim * uGlow * (0.22 + 1.5 * back * (0.35 + vb));
  vec3 H = normalize(L + V + vec3(0.0, 1e-4, 0.0));
  float ndh = max(dot(N, H), 0.0); float sp = ndh * ndh; sp *= sp; sp *= sp; sp *= sp; sp *= sp * sp; sp *= sp;
  col += (uSunCol * 0.3 + tcol * uSunCol * 0.9) * sp * (0.2 + 0.4 * uWet) * sunVis * (front ? 1.0 : 0.3);
  // beads of water on the petals, only close up
  float kNear = (1.0 - smoothstep(7.0, 18.0, dist)) * step(vPart, 1.5);
  if (kNear > 0.0) {
    vec2 q = vec2(lu * 4.0, v * 13.0) + 0.7 * vn(vec2(lu * 2.0, v * 5.0)); vec2 ci = floor(q); vec2 cf = fract(q) - 0.5;
    float rr = h21(ci + 0.37); vec2 dv = cf - (vec2(h21(ci + 7.1), h21(ci + 3.7)) - 0.5) * 0.44;
    float rad = 0.10 + 0.20 * rr * rr, bd = length(dv);
    float bead = step(0.5 - 0.3 * uWet, rr) * (1.0 - smoothstep(rad * 0.8, rad, bd));
    float spot = 1.0 - smoothstep(0.0, rad * 0.35, length(dv - vec2(-0.3, 0.3) * rad));
    float glint = 1.0 - smoothstep(0.0, rad * 0.55, length(dv + vec2(-0.3, 0.3) * rad));
    float ring = smoothstep(rad * 0.45, rad, bd);
    col = mix(col, col * (1.25 - 0.7 * ring) + tcol * 0.3 * glint, bead * kNear);
    col += uSunCol * spot * bead * kNear * (0.4 + 2.2 * max(dif, back));
  }
  gl_FragColor = vec4(col, 1.0);
  #if defined(USE_FOG) && defined(FOG_EXP2)
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * uFogCut));   // the tree shows through the mist a little further than its neighbours
  #elif defined(USE_FOG)
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, smoothstep(fogNear, fogFar, vFogDepth));
  #endif
}`,$t=`
#include <common>
#include <fog_pars_vertex>
${bt}
attribute vec2 aUV; attribute vec4 aLf;
varying vec2 vUv; varying vec3 vWN; varying vec3 vWP; varying vec4 vLf;
void main() {
  vec3 p = position; vec3 n = normal;
  #ifdef USE_INSTANCING
    vec3 org = instanceMatrix[3].xyz; mat3 im = mat3(instanceMatrix);
    float g = gustAt(org, uTime);
    float fl = aLf.w * (0.45 + 1.7 * g);
    float tw = fl * 0.45 * sin(uTime * (2.1 + aLf.x) + aLf.x * 40.0) * aUV.y;
    float bob = fl * 0.20 * sin(uTime * 1.6 + aLf.x * 23.0) + fl * 0.10 * g;
    float c = cos(tw), s = sin(tw);
    p = vec3(c * p.x + s * p.z, p.y, c * p.z - s * p.x); n = vec3(c * n.x + s * n.z, n.y, c * n.z - s * n.x);
    c = cos(bob); s = sin(bob);
    p = vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); n = vec3(n.x, c * n.y - s * n.z, s * n.y + c * n.z);
    p = org + im * p; n = im * n;
  #else
    float g = gustAt(p, uTime);
    float f = aLf.w * aUV.y * aUV.y;
    p.xz += uWindDir.xz * (f * (0.4 + 2.4 * g) * (0.7 + 0.3 * sin(uTime * 1.3 + aLf.x * 30.0)));
    p.xz += f * 0.3 * vec2(sin(uTime * 1.1 + aLf.x * 17.0), cos(uTime * 0.9 + aLf.x * 11.0));
  #endif
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vWP = wp.xyz; vWN = mat3(modelMatrix) * n; vUv = aUV; vLf = aLf;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Kt=`
#include <common>
#include <fog_pars_fragment>
${Re}
${Ce}
uniform vec3 uGreen, uDeep, uMist, uYel, uRed;
varying vec2 vUv; varying vec3 vWN; varying vec3 vWP; varying vec4 vLf;
void main() {
  vec3 N = normalize(vWN + vec3(0.0, 1e-5, 0.0));
  bool front = gl_FrontFacing; if (!front) N = -N;
  vec3 toCam = cameraPosition - vWP; float dist = length(toCam);
  vec3 V = toCam / max(dist, 1e-4);
  vec3 L = uSunDir;
  float kind = vLf.z, sunVis = vLf.y, ph = vLf.x;
  vec3 base; float tr = 0.8, gloss = 1.0, hq = 0.0, kN = 0.0, veinK = 0.0;
  if (kind < 0.5) {
    float ax = abs(vUv.x);
    kN = 1.0 - smoothstep(11.0, 26.0, dist);
    vec3 top = mix(uDeep * 2.8, uGreen * 0.74, 0.15 + 0.6 * ph);
    vec3 under = mix(uGreen * 0.8, uMist, 0.14);                                  // felted underside
    base = front ? top : under;
    float midrib = 1.0 - smoothstep(0.03, 0.08, ax);
    float sv = abs(fract(vUv.y * 7.0 - ax * 1.6) - 0.5);
    float veins = (1.0 - smoothstep(0.05, 0.13, sv)) * 0.45;
    base = mix(base, mix(uGreen * 1.2 + uYel * 0.2, uMist * 0.7, front ? 0.1 : 0.3), max(midrib, veins) * 0.36);
    base *= 0.8 + 0.4 * vn(vUv * vec2(5.0, 9.0) + ph * 31.0);
    // close to: the blade is quilted between its side veins, the midrib lies in a channel, the surface is felted
    float felt = vn(vUv * vec2(13.0, 31.0) + ph * 7.0);
    veinK = max(midrib, veins * 2.0) * kN;
    hq = (smoothstep(0.02, 0.42, sv) - midrib * 0.8) * (front ? 1.0 : -1.0);
    base *= 1.0 + kN * 0.12 * (felt - 0.5);
    if (ax > 1.0 - 0.17 * (0.5 + 0.5 * sin(vUv.y * 27.0 + ph * 40.0))) discard;      // wavy margin
    gloss = front ? 1.0 : 0.15;
  } else if (kind < 1.5) {
    // moss beard: ragged strands cut out of the ribbon
    float sx = vUv.x * 5.0 + ph * 13.0, id = floor(sx), fx = fract(sx) - 0.5;
    float strand = h21(vec2(id, floor(ph * 97.0)));
    float wav = 0.2 * sin(vUv.y * 7.0 + strand * 20.0);
    if (abs(fx + wav) > (0.14 + 0.2 * strand) * (1.0 - 0.7 * vUv.y) || vUv.y > 0.35 + 0.65 * strand) discard;
    base = mix(uGreen * 0.6 + uDeep * 0.8, uMist * 0.3 + uGreen * 0.5, vUv.y * 0.7 + 0.3 * strand);
    tr = 1.2; gloss = 0.0;
  } else {
    base = mix(uGreen * 1.05 + uYel * 0.08, uDeep * 1.6, 0.25 + 0.5 * abs(vUv.x));
    base = mix(uRed * 0.5 + uGreen * 0.3, base, smoothstep(0.02, 0.4, vUv.y));       // red-flushed heart
    base *= 0.85 + 0.3 * vn(vec2(vUv.x * 6.0, vUv.y * 14.0 + ph * 9.0));
  }
  float nz1 = vn(vUv * vec2(3.0, 5.0) + ph * 17.0), nz2 = vn(vUv * vec2(4.0, 3.0) - ph * 29.0);
  N = normalize(N + (vec3(nz1, nz2, nz1 * nz2 * 2.0) - 0.5) * 0.5 * gloss * (1.0 - 0.6 * kN) + vec3(0.0, 1e-5, 0.0));
  if (kN > 0.0) {
    vec3 sx = dFdx(vWP), sy = dFdy(vWP); float hx = dFdx(hq), hy = dFdy(hq);
    vec3 r1 = cross(sy, N), r2 = cross(N, sx); float det = dot(sx, r1);
    vec3 gq = (det < 0.0 ? -1.0 : 1.0) * (hx * r1 + hy * r2);
    N = normalize(abs(det) * N - 0.05 * kN * gq + vec3(0.0, 1e-7, 0.0));
  }
  float ndl = dot(N, L);
  float dif = max(ndl, 0.0) * sunVis, back = max(-ndl, 0.0) * sunVis;
  vec3 amb = mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5);
  vec3 tcol = (base * 0.6 + uGreen * 0.5 + uYel * 0.12) * (0.4 + base * 2.0);
  vec3 col = base * (amb * (0.9 + 0.5 * sunVis) + uSunCol * dif) + tcol * uSunCol * back * tr * 0.55;
  float fres = 1.0 - abs(dot(N, V)); fres *= fres;
  col += uSkyCol * fres * 0.05;
  // rim light: the sky along the turned edges of a near blade, the sun through its veins when it stands beyond the leaf
  col += kN * fres * (uSkyCol * 0.3 + tcol * uSunCol * (0.2 + 0.8 * back) * (0.5 + 0.5 * sunVis)) * (0.6 + 0.6 * veinK);
  col += kN * veinK * tcol * uSunCol * back * 0.25;
  vec3 H = normalize(L + V + vec3(0.0, 1e-4, 0.0));
  float ndh = max(dot(N, H), 0.0); float sp = ndh * ndh; sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  col += uSunCol * sp * gloss * (0.2 + 1.3 * uWet) * sunVis * nz1 * nz1 * (1.0 - 0.5 * kN);      // wet highlight (blooms)
  gl_FragColor = vec4(col, 1.0);
  #if defined(USE_FOG) && defined(FOG_EXP2)
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * uFogCut));   // the tree shows through the mist a little further than its neighbours
  #elif defined(USE_FOG)
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, smoothstep(fogNear, fogFar, vFogDepth));
  #endif
}`,Fo=`
#include <common>
#include <fog_pars_vertex>
attribute vec2 aUV; attribute vec3 aM;
varying vec2 vUv; varying vec3 vWN; varying vec3 vWP; varying vec3 vM; varying vec3 vLP;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWP = wp.xyz; vLP = position; vWN = mat3(modelMatrix) * normal; vUv = aUV; vM = aM;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Co=`
#include <common>
#include <fog_pars_fragment>
${Re}
${Ce}
uniform vec3 uGreen, uDeep, uMist, uYel;
varying vec2 vUv; varying vec3 vWN; varying vec3 vWP; varying vec3 vM; varying vec3 vLP;
void main() {
  vec3 N = normalize(vWN + vec3(0.0, 1e-5, 0.0));
  vec3 toCam = cameraPosition - vWP;
  vec3 V = toCam / max(length(toCam), 1e-4);
  float u = vUv.x, v = vUv.y;
  // corky bark: long fissures, plates, pale lichen
  float f1 = vn(vec2(u * 18.0, v * 0.55)), f2 = vn(vec2(u * 43.0 + f1 * 2.0, v * 1.7));
  float fis = smoothstep(0.1, 0.7, abs(f1 - 0.5) * 2.0 * (0.6 + 0.8 * f2));
  vec3 cork = mix(vec3(0.085, 0.078, 0.068), vec3(0.27, 0.26, 0.235), fis * (0.5 + 0.5 * f2)) * (0.8 + 0.4 * vn(vec2(u * 70.0, v * 6.0)));
  float lich = smoothstep(0.62, 0.8, vn(vLP.xy * 0.45 + vLP.z * 0.3));
  cork = mix(cork, uMist * 0.62, lich * 0.55);
  // moss: on the weather side and the tops, in cushions
  float cush = vn(vLP.xz * 0.9 + vLP.y * 0.4), cush2 = vn(vLP.xz * 3.1 + vLP.y * 2.3);
  float mk = smoothstep(0.5, 0.72, vM.x * 0.5 + N.y * 0.55 + cush * 0.3 + cush2 * 0.14);
  vec3 moss = mix(uDeep * 2.0, uGreen * 0.8 + uYel * 0.05, cush2 * 0.65 + 0.35 * cush) * (0.6 + 0.8 * vn(vLP.xz * 9.0 + vLP.y * 7.0));
  vec3 base = mix(cork, moss, mk);
  float ndl = dot(N, uSunDir);
  float dif = max(ndl * (1.0 - 0.3 * mk) + 0.3 * mk, 0.0) * vM.y;                     // moss wraps the light
  vec3 amb = mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5) * vM.z;
  vec3 col = base * (amb + uSunCol * dif * (0.55 + 0.45 * fis));
  float fres = 1.0 - abs(dot(N, V)); fres *= fres;
  col += (uGreen * 0.5 + uYel * 0.18) * uSunCol * fres * mk * (0.12 + 0.5 * vM.y);    // lit velvet on the moss edge
  col += uSkyCol * fres * (1.0 - mk) * 0.05 * (0.5 + uWet);
  gl_FragColor = vec4(col, 1.0);
  #if defined(USE_FOG) && defined(FOG_EXP2)
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * uFogCut));   // the tree shows through the mist a little further than its neighbours
  #elif defined(USE_FOG)
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, smoothstep(fogNear, fogFar, vFogDepth));
  #endif
}`,ko=`
#include <common>
#include <fog_pars_vertex>
${bt}
attribute vec3 aPiv, aRel; attribute vec4 aSw, aLife;
uniform vec2 uRes; uniform float uGrav;
varying vec2 vQ; varying float vA; varying float vSun;
void main() {
  float c = fract(uTime / aLife.y + aLife.x);
  float tf = max(c - 0.72, 0.0) * aLife.y;                 // seconds since it let go
  vec4 aa = swingAA(aPiv, aSw, uTime - tf);               // the swing is frozen at the moment of release
  vec3 p = aPiv + rotAA(aRel, aa);
  float sz = aLife.z * (0.3 + 0.7 * smoothstep(0.0, 0.72, c)) * (1.0 + 0.05 * sin(uTime * 9.0 + aLife.x * 50.0));
  p.y -= 0.5 * uGrav * tf * tf + sz * 0.8;
  float span = aLife.y * 0.28;
  float fade = 1.0 - smoothstep(span * 0.55, span, tf);
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(p, 1.0);
  float d = max(-mvPosition.z, 0.05);
  float px = sz * projectionMatrix[1][1] / d * uRes.y * 0.5;
  float k = max(1.0, 1.25 / max(px, 1e-3));               // never thinner than a pixel and a quarter
  vA = fade * clamp(2.5 / (k * k), 0.0, 1.0) * smoothstep(0.1, 0.6, d) * (1.0 - smoothstep(0.018, 0.05, px / uRes.y));   // a drop about to fill the lens goes out instead
  vSun = aLife.w; vQ = position.xy;
  float stretch = 1.0 + min(tf * 1.2, 1.0);
  mvPosition.xy += position.xy * sz * k * vec2(1.0, stretch);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Po=`
#include <common>
#include <fog_pars_fragment>
${Ce}
uniform vec2 uSunV;
varying vec2 vQ; varying float vA; varying float vSun;
void main() {
  float r2 = dot(vQ, vQ); if (r2 > 1.0) discard;
  // a water globe shows the world upside down: bright sky at the bottom, dark forest at the top
  vec3 env = mix(uGroundCol * 0.7, uSkyCol * 1.5, smoothstep(-0.55, 0.5, -vQ.y));
  float rim = smoothstep(0.5, 1.0, r2);
  vec3 col = env * (1.0 - 0.7 * rim);
  float spec = 1.0 - smoothstep(0.0, 0.34, length(vQ - uSunV * 0.5)); spec *= spec;
  float caus = 1.0 - smoothstep(0.0, 0.5, length(vQ + uSunV * 0.55));
  col += uSunCol * (spec * 3.2 + caus * 0.5) * (0.25 + 0.75 * vSun);
  gl_FragColor = vec4(col, vA * (0.5 + 0.5 * max(rim, spec)));
  #if defined(USE_FOG) && defined(FOG_EXP2)
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * uFogCut));   // the tree shows through the mist a little further than its neighbours
  #elif defined(USE_FOG)
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, smoothstep(fogNear, fogFar, vFogDepth));
  #endif
}`,_o=`
#include <common>
uniform float uTime; uniform vec3 uWindDir;
attribute vec4 aA, aB;      // aA = base xyz + size, aB = phase, speed, seed, alpha
varying vec2 vQ; varying float vA; varying float vSeed;
void main() {
  float c = fract(uTime * aB.y + aB.x);
  vec3 p = aA.xyz + vec3(uWindDir.x * 26.0, 78.0, uWindDir.z * 26.0) * c;
  p.xz += 3.0 * vec2(sin(c * 6.0 + aB.z * 9.0), cos(c * 5.0 + aB.z * 7.0));
  vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
  float d = -mv.z;
  vA = aB.w * sin(c * 3.14159) * smoothstep(8.0, 30.0, d) * (1.0 - 0.8 * smoothstep(105.0, 150.0, d));     // from far off the rising mist would only veil the crown
  vQ = position.xy; vSeed = aB.z + c * 0.6;
  mv.xy += position.xy * aA.w * (0.8 + 0.5 * c);
  gl_Position = projectionMatrix * mv;
}`,No=`
${Re}
${Ce}
uniform vec3 uMist;
varying vec2 vQ; varying float vA; varying float vSeed;
void main() {
  float r2 = dot(vQ, vQ); if (r2 > 1.0) discard;
  float n = vn(vQ * 1.7 + vSeed * 7.0) * 0.6 + vn(vQ * 3.9 - vSeed * 3.0) * 0.4;
  float a = (1.0 - r2); a = a * a * smoothstep(0.2, 0.75, n + 0.25 * (1.0 - r2));
  vec3 col = uMist * (uSkyCol * 0.9 + uSunCol * 0.2 * (0.6 + 0.4 * vQ.y));
  gl_FragColor = vec4(col, a * vA);
}`,Bo=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aA; attribute vec2 aB;
uniform float uScale;
varying vec2 vQ; varying float vA; varying float vSeed;
void main() {
  vec4 mv = viewMatrix * modelMatrix * vec4(aA.xyz, 1.0);
  vA = aB.y * uScale; vQ = position.xy; vSeed = aB.x;
  mv.xy += position.xy * aA.w;
  vec4 mvPosition = mv;
  gl_Position = projectionMatrix * mv;
  #include <fog_vertex>
}`,Lo=`
#include <common>
#include <fog_pars_fragment>
${Re}
${Ce}
uniform vec3 uGreen, uDeep;
varying vec2 vQ; varying float vA; varying float vSeed;
void main() {
  float r2 = dot(vQ, vQ); if (r2 > 1.0) discard;
  float n = vn(vQ * 2.3 + vSeed * 7.0) * 0.6 + vn(vQ * 5.1 - vSeed * 3.0) * 0.4;
  float a = smoothstep(0.0, 0.5, (1.0 - r2) + (n - 0.5) * 0.9);
  vec3 col = (uDeep * 1.5 + uGreen * 0.22 * n) * (uSkyCol * 0.9 + uGroundCol * 0.5 + uSunCol * 0.07);
  gl_FragColor = vec4(col, a * vA);
  #if defined(USE_FOG) && defined(FOG_EXP2)
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * uFogCut));
  #endif
}`,Go=`
#include <common>
uniform float uTime; uniform vec3 uSunL, uCamL;       // sun direction and camera in the mesh's own space
attribute vec4 aA, aB;      // aA = top xyz + length, aB = width, seed, gain, 0
varying vec2 vQ; varying float vA;
void main() {
  vec3 top = aA.xyz + vec3(sin(uTime * 0.07 + aB.y * 9.0), 0.0, cos(uTime * 0.06 + aB.y * 5.0)) * 2.5;   // shafts slide as the cloud moves
  vec3 c = top - uSunL * (aA.w * (0.5 - 0.5 * position.y));
  vec3 side = cross(uSunL, uCamL - c) + vec3(1e-4, 0.0, 1e-4);
  side = normalize(side);
  vec3 p = c + side * position.x * aB.x * (0.7 + 0.3 * (0.5 - 0.5 * position.y));
  vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
  float breathe = 0.6 + 0.4 * sin(uTime * 0.23 + aB.y * 20.0);
  vA = aB.z * breathe * smoothstep(6.0, 26.0, -mv.z) * (1.0 - smoothstep(95.0, 140.0, -mv.z));
  vQ = position.xy;
  gl_Position = projectionMatrix * mv;
}`,Uo=`
${Ce}
varying vec2 vQ; varying float vA;
void main() {
  float e = 1.0 - vQ.x * vQ.x; e *= e;
  float l = smoothstep(-1.0, -0.2, vQ.y) * (1.0 - smoothstep(0.75, 1.0, vQ.y));
  gl_FragColor = vec4(uSunCol * (e * l * vA), 1.0);
}`;async function Wo(v,i={}){const n=v.rng.fork("swordbill-tree"),x=v.quality?.detail??1,_=(i.palette&&i.palette.length>=6?i.palette:zo).map(e=>new m.Color(e)),[N,q,G,S,A,E]=_,R=i.hour||"morning",b=i.weather||"mist",F=i.bloom||"scarlet",I=i.yaw??Math.PI/4,C={morning:{dir:[.53,.848,0],col:"#fff1da",gain:1.6,sky:.4,ground:.3,shafts:1,tint:[1,1,1]},dawn:{dir:[.96,.2,.18],col:"#ffb49a",gain:1.15,sky:.4,ground:.26,shafts:.5,tint:[1.08,.94,.98]},afternoon:{dir:[-.94,.342,0],col:"#ffbe6e",gain:1.4,sky:.42,ground:.3,shafts:1,tint:[1.04,1,.94]},bluehour:{dir:[-.9,.3,.3],col:"#8fa8ff",gain:.4,sky:.22,ground:.12,shafts:0,tint:[.62,.78,1.25]}},k=C[R]||C.morning,le=b==="drizzle"?1:b==="clear"?.25:.6,j=e=>e.clone().applyAxisAngle(ve,-I),z=e=>e.clone().applyAxisAngle(ve,I),Se=s(...i.sunDir||k.dir).normalize(),he=j(Se),ae=j(s(1,0,0)),je=j(s(-1,0,0)),pe=s(0,13,40),Ge=s(0,65,10),ce=Ge.clone().sub(pe).normalize(),ge=s(0,40,26),Ye=s(0,-.788,.616),st=s(4.7,16,39.5),Ht=s(0,-1,0).multiplyScalar(.9).addScaledVector(ae,.44).normalize(),rt=s(0,19,26).addScaledVector(ae,29),Ft=s(0,.45,.893),it=s(0,37,26).addScaledVector(je,27),$=[{key:"stopSun",M:rt,axis:Ht,len:4.4,view:rt.clone().addScaledVector(ae,2.1).add(s(0,-.5,0)),approach:rt.clone().addScaledVector(ae,12).add(s(0,.6,0))},{key:"stopBacklit",M:it,axis:s(.12,-.97,-.2).normalize(),len:4.5,view:it.clone().addScaledVector(Ft,-2.2),approach:it.clone().addScaledVector(Ft,-12)},{key:"stopThroat",M:st,axis:Ye,len:5,view:st.clone().addScaledVector(Ye,2),approach:st.clone().addScaledVector(Ye,12)}],Do=s(-7,-9,62),To=s(3.5,-3,54),$e=[$[2].approach.clone().addScaledVector(Ye,4),$[2].approach,$[2].view,pe,Ge],Ke=$.map(e=>[e.approach,e.view]),ue=e=>Ne(e,$e),me=e=>Math.min(Ne(e,Ke[0]),Ne(e,Ke[1]),Ne(e,Ke[2])),lt=e=>({flower:z(e.M),view:z(e.view),approach:z(e.approach),axis:z(e.axis),pivot:z(e.M.clone().addScaledVector(e.axis,-e.len)),length:e.len}),Ue=(i.route?i.route({portalSeat:{position:z(Ge),normal:z(ce).negate(),radius:7},naveFoot:z(pe),flyThrough:$e.map(z),stopSun:lt($[0]),stopBacklit:lt($[1]),stopThroat:lt($[2])})||[]:[]).map(e=>e.map(t=>j(t))),Ct=Ue.map(e=>new m.Box3().setFromPoints(e).expandByScalar(15)),de=e=>{let t=99;for(let o=0;o<Ue.length;o++)Ct[o].containsPoint(e)&&(t=Math.min(t,Ne(e,Ue[o])));return t},ze=((typeof i.avoid=="function"?i.avoid():i.avoid)||[]).map(e=>e.map(t=>j(t))),Xt=ze.map(e=>new m.Box3().setFromPoints(e).expandByScalar(13)),Ve=e=>{let t=99;for(let o=0;o<ze.length;o++)Xt[o].containsPoint(e)&&(t=Math.min(t,Ne(e,ze[o])));return t},De=((typeof i.sight=="function"?i.sight():i.sight)||[]).map(e=>{const t=j(e.from),o=Ge.clone().sub(t);return{a:t,ax:o,l2:Math.max(1e-6,o.lengthSq()),r:e.r??7.8,t1:e.to??1.03,lvl:e.cut==="leaves"?0:e.cut==="twigs"?1:2}}),He=s(),Ae=(e,t,o=0)=>{for(const r of De){if(o>r.lvl)continue;He.subVectors(e,r.a);const a=He.dot(r.ax)/r.l2;if(!(a<.05||a>r.t1)&&(He.addScaledVector(r.ax,-a),He.length()<r.r*a+t))return!0}return!1},H=v.core?v.core.makeRng(v.core.hashSeed("swordbill-feeder:"+v.seed)):n,kt=s(),Xe=s(),ct=(e,t,o)=>{let r=1/0;for(let a=0;a<t.length-1;a++){const d=t[a],l=t[a+1];Xe.subVectors(l,d);const h=Math.min(1,Math.max(0,e.clone().sub(d).dot(Xe)/Math.max(Xe.lengthSq(),1e-9))),f=d.clone().addScaledVector(Xe,h),p=f.distanceTo(e);p<r&&(r=p,kt.copy(f))}if(r<o){const a=e.clone().sub(kt);a.lengthSq()<1e-6&&a.set(1,0,0),e.addScaledVector(a.normalize(),o-r)}},Zt=(e,t)=>{ct(e,$e,t);for(const o of Ke)ct(e,o,3.7);for(let o=0;o<Ue.length;o++)Ct[o].containsPoint(e)&&ct(e,Ue[o],6.8)},Te=e=>{const t=e.x-pe.x,o=e.y-pe.y,r=e.z-pe.z,a=t*ce.x+o*ce.y+r*ce.z;return a<-26||a>57?99:Math.hypot(t-ce.x*a,o-ce.y*a,r-ce.z*a)-(12.5*(60-a)+4*(a+18))/78};await v.yield();const J=[],Ze=(e,t)=>e.add(s(n.range(-t,t),n.range(-t,t)*.6,n.range(-t,t))),We=(e,t,o,r,a)=>{let d=0;for(let f=1;f<e.length;f++)d+=e[f].distanceTo(e[f-1]);let l=Be(e,Math.max(3,Math.round(d/a)));if(r<=1){for(let f=1;f<l.length;f++)Zt(l[f],6.8+t);if(r===1){let f=l.length;for(let p=2;p<l.length;p++)if(me(l[p])<7.5||de(l[p])<7.2){f=p;break}l=l.slice(0,Math.max(3,f))}}else{let f=l.length;for(let p=1;p<l.length;p++)if(ue(l[p])<6.6||me(l[p])<3.2||de(l[p])<6.2||Te(l[p])<.6){f=p;break}if(f<3)return null;l=l.slice(0,f)}const h={pts:l,r0:t,r1:o,level:r,len:d};return J.push(h),h},K=(e,t)=>e.pts[Math.min(e.pts.length-1,Math.round(t*(e.pts.length-1)))].clone(),Pt=n.range(21,24),Je=s(n.range(-.6,.6),Pt,Pt*.577),se=We([s(0,-2.5,-1.2),s(n.range(-.5,.5),7,3.6+n.range(-.5,.5)),s(n.range(-.7,.7),15,8.9),Je],2.1,1.9,0,1.9),ut=[],Jt=[],eo=n.sign();for(const e of[-1,1]){const t=n.range(9.8,11.2),o=e===eo?1.06:.95,r=We([Je.clone().add(s(.5*e,-1.2,-.6)),s(6*e,31,17),s(t*e,41,24),Ze(s((t+1)*e,51,32),.8),Ze(s((t+2)*e,41+17*o,24+17*o),1),Ze(s((t+3)*e,41+20*o,24+26*o),1.2)],1.5,.6,0,1.7);ut.push(r);const a=(f,p,u=.66)=>We([f,...p.map(M=>Ze(s(M[0]*e,M[1],M[2]),1.1))],u,.2,1,1.7),d=a(K(r,.42),[[11,50,19],[10.5,59,13],[10,66,6],[8,71,-3]],.85),l=a(K(r,.4),[[11,37,31],[11.5,29,38],[12,21,44],[12,14,49]],.78),h=[d,l,a(K(r,.45),[[17,45,22],[24,46,19],[30,41,15]]),a(K(r,.64),[[18,55,34],[25,54,38],[31,47,41]]),a(K(r,.84),[[17,60,47],[22,57,54],[24,49,60]]),a(K(r,1),[[11,59,57],[8,53,63]],.5),a(K(r,.19),[[13,31,14],[20,27,10],[26,20,6]]),a(K(l,.5),[[17,26,43],[22,20,48],[25,13,53]],.45),a(K(r,.22),[[11,38,12],[16,44,8],[20,47,3],[23,45,-4]]),a(K(r,.75),[[9,66,38],[6,72,33],[3,75,27]],.45),a(K(r,.64),[[7,55,35],[2.2,57,38]],.4),a(K(l,.25),[[6,41,34],[1.6,43,37]],.4),a(K(l,.5),[[6,32,43],[1.6,33,46.5]],.38),a(K(d,.75),[[8,70,13],[4,71.5,18],[.7,70.5,19.5]],.4),a(K(d,.5),[[8,58,6],[4,58.5,2],[.7,59,1]],.4)];Jt.push(h),await v.yield()}await v.yield();const fe=s();for(const e of J.slice()){if(e===se)continue;const t=e.level===0?Math.floor(e.pts.length*.38):Math.max(2,Math.floor(e.pts.length*.18));for(let o=t;o<e.pts.length;o+=2){if(!n.chance(.9))continue;const r=e.pts[o],a=e.pts[Math.min(e.pts.length-1,o+1)].clone().sub(e.pts[o-1]).normalize();fe.subVectors(r,ge),fe.y*=.45,fe.normalize();const d=fe.clone().multiplyScalar(.9).addScaledVector(a,.4).add(s(n.range(-.7,.7),n.range(-.5,.35),n.range(-.7,.7))).normalize(),l=n.range(5.5,10.5)*(o===e.pts.length-1?.8:1),h=[r.clone(),r.clone().addScaledVector(d,l*.4).add(s(0,.7,0)),r.clone().addScaledVector(d,l*.75).add(s(0,-l*.1,0)),r.clone().addScaledVector(d,l).add(s(0,-l*.38,0))],f=We(h,.25,.085,2,1.8);if(f&&(f.parent=e,f.parentIdx=o),!f||f.pts.length<4)continue;const p=K(f,n.range(.35,.7)),u=d.clone().applyAxisAngle(ve,n.sign()*n.range(.7,1.3)),M=n.range(3,5.2),c=We([p,p.clone().addScaledVector(u,M*.5).add(s(0,.2,0)),p.clone().addScaledVector(u,M).add(s(0,-M*.35,0))],.125,.055,3,1.6);if(c){c.parent=f,c.parentIdx=0;for(let y=0;y<f.pts.length;y++)f.pts[y].distanceToSquared(p)<1e-6&&(c.parentIdx=y)}}await v.yield()}if(await v.yield(),ze.length||De.length)for(const e of J){if(e===se||e.level===0)continue;if(e.parent&&e.parent.drawN!=null&&e.parentIdx>=e.parent.drawN-1){e.drawN=0;continue}const t=e.level===1?5+e.r0:4.6;for(let o=0;o<e.pts.length;o++)if(Ve(e.pts[o])<t||Ae(e.pts[o],.5+(e.level===1?e.r0:.2),e.level===1?2:1)){e.drawN=o<2?0:o;break}}const Ie=(e,t)=>e.r0+(e.r1-e.r0)*Math.pow(t/Math.max(1,e.pts.length-1),.8),dt=[],et=[];for(const e of J)for(let t=0;t<e.pts.length;t++)e.level<=1&&dt.push({p:e.pts[t],r:Ie(e,t)}),e!==se&&(e.level>=1?t>=1:t>e.pts.length*.35)&&et.push({p:e.pts[t],level:e.level,end:t===e.pts.length-1,gone:e.drawN!=null&&t>=e.drawN});const ee=[],ft=(e,t,o,r)=>{const a=s();for(const d of[.12,.55,1]){if(a.copy(e).addScaledVector(t,o*d),!r&&(ue(a)<4.5+.9*d||me(a)<2.5||de(a)<5.2+.9*d||Te(a)<1))return!1;for(const l of dt)if(a.distanceTo(l.p)<l.r+.4+1*d)return!1}for(const d of ee)if(d.piv.distanceToSquared(e)<6.2||d.mouth.distanceToSquared(a)<4.4)return!1;return!0},tt=(e,t)=>{let o=null,r=t;for(const a of et){if(a.p.y<e.y-.5)continue;const d=a.p.distanceTo(e);d<r&&(r=d,o=a)}return o},ke=(e,t,o,r,a,d={})=>{const l={piv:e,axis:t,len:o,lod:r,node:a,mouth:e.clone().addScaledVector(t,o),...d};return ee.push(l),l};for(const e of $){const t=e.M.clone().addScaledVector(e.axis,-e.len);e.bell=ke(t,e.axis,e.len,2,tt(t,60),{stop:e.key})}$[1].group=[$[1].bell];for(const e of[[-2.7,1.3,2.2],[2.6,2.1,2.9],[-.9,3.3,5.2],[3.7,.3,5.8]]){const t=n.range(3.8,4.4),o=s(n.range(-.15,.15),-1,n.range(-.2,.05)).normalize(),r=$[1].M.clone().add(s(e[0],e[1],e[2])),a=r.clone().addScaledVector(o,-t);$[1].group.push(ke(a,o,t,1,tt(a,60),{stop:"group"}))}const _t=s(0,.5,.866);await v.yield();for(let e=0,t=0;e<900&&t<40;e++){(e&31)===31&&await v.yield();const o=n.range(.04,.94)*60,r=n.range(-.75,Math.PI+.75),a=Math.max(n.range(5.7,8.2),(12.5*(60-o)+4*(o+18))/78+1.3),d=pe.clone().addScaledVector(ce,o).add(s(Math.cos(r)*a,0,0)).addScaledVector(_t,Math.sin(r)*a),l=n.range(3.7,4.5),h=s(n.range(-.18,.18)-Math.cos(r)*.1,-1,n.range(-.15,.2)).normalize(),f=d.clone().addScaledVector(h,-l);if(!ft(f,h,l,!1))continue;const p=tt(f,13);p&&(ke(f,h,l,1,p,{nave:!0}),t++)}for(let e=0,t=0;e<500&&t<18;e++){(e&31)===31&&await v.yield();const o=n.range(-9,12),r=n.range(0,6.283),a=(12.5*(60-o)+4*(o+18))/78+n.range(1.3,4.6),d=pe.clone().addScaledVector(ce,o).add(s(Math.cos(r)*a,0,0)).addScaledVector(_t,Math.sin(r)*a),l=n.range(3.8,4.7),h=s(n.range(-.15,.15),-1,n.range(-.15,.15)).normalize(),f=d.clone().addScaledVector(h,-l);if(!ft(f,h,l,!1))continue;const p=tt(f,14);p&&(ke(f,h,l,1,p,{nave:!0}),t++)}await v.yield();const Nt=Math.round(Math.min(380,Math.max(220,i.density??n.range(305,345)))),to=n.shuffle(et.slice());for(let e=0,t=0;e<3&&ee.length<Nt;e++){for(const o of to){if(ee.length>=Nt)break;if((++t&63)===0&&await v.yield(),o.level<2&&!o.end&&e===0)continue;fe.subVectors(o.p,ge),fe.y=0,fe.lengthSq()<1e-4&&fe.set(1,0,0),fe.normalize();const r=n.range(3.7,4.9)*(n.chance(.08)?.72:1),a=s(0,-1,0).addScaledVector(fe,n.range(0,.3)).add(s(n.range(-.14,.14),0,n.range(-.14,.14))).normalize(),d=n.range(0,6.283),l=n.range(.2,1.7),h=o.p.clone().add(s(Math.cos(d)*l,-n.range(.9,3),Math.sin(d)*l));ft(h,a,r,!1)&&ke(h,a,r,0,o)}e===0&&await v.yield()}await v.yield();const oo=e=>{const t=e.piv.clone().addScaledVector(e.axis,e.len*.6);return Math.min(ue(t),me(t)*.8,de(t))},no=ee.filter(e=>e.lod===0).map(e=>({b:e,d:oo(e)})).sort((e,t)=>e.d-t.d);let Bt=ee.filter(e=>e.lod===1).length;for(const e of no){if(Bt>=90||e.d>17)break;e.b.lod=1,Bt++}for(const e of ee){const t=Math.min(ue(e.mouth),de(e.mouth));e.swing=e.stop==="stopThroat"?.035:t<8?.07:n.range(.13,.2)}if(ze.length||De.length){const e=s();for(const t of ee){e.copy(t.piv).lerp(t.mouth,.55);const o=Math.min(Ve(t.mouth),Ve(e),Ve(t.piv)+1.5);o<8&&(t.swing=Math.min(t.swing,.07)),!t.stop&&(o<5.3||t.node&&t.node.gone||Ae(t.mouth,1.3,1)||Ae(e,1.2,1)||Ae(t.piv,.5,1))&&(t.cut=!0)}}await v.yield();let ao=0;for(const e of ee){if((++ao&15)===0&&await v.yield(),!e.node)continue;const t=e.node.p,o=t.distanceTo(e.piv),r=t.clone().lerp(e.piv,.5).add(s(0,.22*o,0)),a=e.piv.clone().addScaledVector(e.axis,-Math.min(1.2,o*.3));let d=Be([t.clone(),r,a,e.piv.clone()],e.lod>0?Math.max(6,Math.round(o/1.1)):Math.max(3,Math.round(o/3)));J.push({pts:d,r0:.09+.012*o,r1:.013*e.len,level:4,len:o,round:e.lod>0,drawN:e.cut?0:void 0})}for(let e=0;e<6;e++){const t=e/6*6.283+n.range(-.3,.3),o=Math.cos(t),r=Math.sin(t),a=n.range(6.5,9);J.push({pts:Be([s(o*1.2,2.2,r*1.2+.6),s(o*3.2,-.2,r*3.2),s(o*a*.75,-2.6,r*a*.75-.5),s(o*a,-7.5,r*a-1)],7),r0:.8,r1:.22,level:5,len:12})}await v.yield();const te=[],Lt=Math.round(Math.max(3e3,5200-(ee.length-325)*37)*x);let vt=0;const so=n.shuffle(et.filter(e=>e.level>=2||e.end));let ro=0;for(let e=0;e<2&&vt<Lt;e++)for(const t of so){if(vt>=Lt)break;if((++ro&127)===0&&await v.yield(),!n.chance(.25+.75*ie(18,56,t.p.y))||ue(t.p)<8.4||me(t.p)<5.2||de(t.p)<8.6||Te(t.p)<2.4)continue;const o=n.int(6,11);te.push({p:t.p.clone().add(s(n.range(-.4,.4),n.range(-.2,.5),n.range(-.4,.4))),k:o,cut:!!t.gone}),vt+=o}if(ze.length||De.length)for(const e of te)(Ve(e.p)<8.2||Ae(e.p,2.7))&&(e.cut=!0);await v.yield();let xe=null;if(i.feeder){const e=j(i.feeder.mouth),t=j(i.feeder.root),o=j(i.feeder.side||s(0,0,1));o.y=0,o.normalize();const r=5.2,a=s(.03,-1,.02).normalize(),d=e.clone().addScaledVector(a,-r),l=d.clone().add(s(0,.75,0)),h=l.clone().sub(t),f=h.y;h.y=0;const p=h.clone().normalize(),u=(V,B,g=0)=>t.clone().addScaledVector(h,V).add(s(0,f*B,0)).addScaledVector(o,g),M=16,c={pts:Be([t.clone().add(s(0,-1.6,0)),u(.05,.36,.5),u(.3,.84,.7),u(.66,1.1,.25),u(.9,1.08),l],M),r0:.5,r1:.1,level:1,len:20,fz:!0,sides:9,moss:.5};J.push(c);const y=(V,B,g,P,U,W)=>{const D=ke(B,W,g,P,null,{fz:!0});D.swing=U;const w=V.distanceTo(B),O=V.clone().lerp(B,.5).add(s(0,.22*w,0)),X=B.clone().addScaledVector(W,-Math.min(1.2,w*.3));return J.push({pts:Be([V.clone(),O,X,B.clone()],Math.max(5,Math.round(w/.6))),r0:.08+.012*w,r1:.013*g,level:4,len:w,round:!0,fz:!0}),D},L=(V,B,g=1)=>te.push({p:V.clone(),k:B,fz:!0,size:g}),T=y(l,d,r,2,.02,a);L(l.clone().add(s(0,.5,0)).addScaledVector(o,.5),7,.9),L(c.pts[13].clone().add(s(0,.4,0)),8),L(c.pts[10].clone().add(s(0,.5,0)).addScaledVector(o,.4),8);for(const V of[[.44,.9,-.3,.3,5.6,1.6],[.64,.8,.38,.12,4.6,1.9],[.27,.45,-.75,.35,5,1.3],[.8,1,.1,.05,3.4,1.5]]){const B=c.pts[Math.round(V[0]*M)],g=o.clone().multiplyScalar(V[1]).addScaledVector(p,V[2]).add(s(0,V[3],0)).normalize(),P=V[4]*H.range(.9,1.1),U=V[5],W=Be([B.clone(),B.clone().addScaledVector(g,P*.45).add(s(0,.8,0)),B.clone().addScaledVector(g,P*.8).add(s(0,.5-U*.4,0)),B.clone().addScaledVector(g,P).add(s(0,-U,0))],7);J.push({pts:W,r0:.2,r1:.06,level:2,len:P,fz:!0,sides:6}),L(W[3].clone().add(s(0,.3,0)),8),L(W[6],9),L(W[7].clone().add(s(H.range(-.4,.4),.2,H.range(-.4,.4))),7,.9);for(const D of[7,4]){if(D===4&&H.chance(.35))continue;const w=H.range(3.3,4.2),O=s(H.range(-.12,.12),-1,H.range(-.12,.12)).normalize();y(W[D],W[D].clone().add(s(H.range(-.5,.5),-H.range(.9,1.7),H.range(-.5,.5))).addScaledVector(o,.3),w,1,.07,O)}}xe={M:e,axis:a,piv:d,len:r,bell:T}}const Fe=e=>{let t=0;for(const o of te){if(o.cut)continue;const r=o.p.x-e.x,a=o.p.y-e.y,d=o.p.z-e.z,l=r*he.x+a*he.y+d*he.z;if(l<1.5)continue;const h=r*r+a*a+d*d-l*l;h<10&&(t+=1-h/10)}return Math.max(.08,Math.exp(-.5*t))};await v.yield();const qe=new at({position:3,normal:3,aUV:2,aM:3}),io=[9,6,4,3,3,5],lo=[.6,.5,.25,.1,.3,.75];let ot=0;for(const e of J){const t=e.pts.length,o=e===se,r=e.drawN??t;if(r<2){o||(e.fz?H:n).range(.7,1.2),ot++;continue}const a=e.pts.map(f=>e.level===5?.6:Fe(f)),d=o?f=>{const p=f/(t-1);return 2.1+1.7*Math.exp(-p*7)+.6*ie(.8,1,p)}:f=>Ie(e,f),l=o?(f,p,u)=>1+.14*Math.sin(p*5+1)*Math.exp(-u*.2)+.05*Math.sin(p*3+u*.55):e.level<=1||e.level===5?(f,p,u)=>1+.07*Math.sin(p*3+u*.8+ot)+.05*Math.sin(u*2.1+ot*1.7):null,h=(e.moss??lo[e.level])*(o?1:(e.fz?H:n).range(.7,1.2));Ao(qe,r<t?e.pts.slice(0,r):e.pts,d,e.sides||(o?12:e.round?6:io[e.level]),f=>[h,a[f],e.level>=2?.9:.8+.2*ie(0,1,f/t)],l),ot++,await v.yield()}await v.yield();{const e=[],t=s(0,-7.4,-2.2),o=v.noise,r=22,a=12,d=n.range(0,50),l=(M,c,y)=>{const L=M*6.2832,T=c*Math.PI,V=Math.sin(T)*Math.cos(L),B=Math.cos(T),g=Math.sin(T)*Math.sin(L),P=1+.3*o.fbm3(V*1.2+d,B*1.2,g*1.2,3)+.16*(1-Math.abs(o.n3(V*2.6+d,B*2.6,g*2.6)))+.05*o.n3(V*6+d,B*6,g*6);return y.set(t.x+V*11.5*P,t.y+B*(B>0?6.2:9.5)*P,t.z+g*10*P)},h=s(),f=s(),p=s(),u=s();for(let M=0;M<=a;M++){const c=[],y=Math.min(.985,Math.max(.015,M/a));for(let L=0;L<=r;L++){const T=L/r;l(T,y,h),l(T+.01,y,f),l(T-.01,y,p),f.sub(p),l(T,y+.01,p),l(T,y-.01,u),p.sub(u),u.crossVectors(f,p).normalize(),c.push(qe.v({position:[h.x,h.y,h.z],normal:[u.x,u.y,u.z],aUV:[T*3,y*14],aM:[.36+.45*u.y,.5,.45+.55*ie(-14,-1,h.y)]}))}e.push(c)}for(let M=0;M<a;M++)for(let c=0;c<r;c++)qe.quad(e[M][c],e[M][c+1],e[M+1][c+1],e[M+1][c])}await v.yield(),qe.fixWinding(),await v.yield();const ht=(e,t=1)=>new m.Color(e.r*t,e.g*t,e.b*t),co=new m.Color(k.col).multiplyScalar(k.gain),nt=N.clone().lerp(q,.5).multiplyScalar(k.sky);nt.r*=k.tint[0],nt.g*=k.tint[1],nt.b*=k.tint[2];const uo=ht(S,1.6).add(ht(q,.3)).multiplyScalar(k.ground/.3),fo=F==="yellow"?A.clone().lerp(E,.1).multiplyScalar(.8):F==="flame"?E.clone().lerp(A,.4).multiplyScalar(.92):new m.Color(E.r*.95,E.g+.022,E.b+.004),Gt=je.clone().add(s(0,.3,0)).normalize(),ne={uTime:{value:0},uWindDir:{value:Gt},uGust:{value:s(.085,1.15,1)},uSunDir:{value:Se.clone()},uSunCol:{value:co},uSkyCol:{value:nt},uGroundCol:{value:uo},uWet:{value:le},uGlow:{value:1},uFogCut:{value:i.fogCut??1},uYel:{value:ht(A,.8)},uRed:{value:fo},uGreen:{value:G.clone()},uDeep:{value:S.clone()},uMist:{value:N.clone()}},Me=(e,t,o={},r={})=>new m.ShaderMaterial({uniforms:{...m.UniformsUtils.clone(m.UniformsLib.fog),...ne,...o},vertexShader:e,fragmentShader:t,fog:!0,...r}),Ut=new m.Group,Ee=new m.Group;Ee.rotation.y=I,Ut.add(Ee);const ye=(e,t=0)=>(e.frustumCulled=!1,e.renderOrder=t,Ee.add(e),e);ye(new m.Mesh(qe.geometry(),Me(Fo,Co)));{const e=[0,0,0,-.14,.22,.05,0,.22,-.01,.14,.22,.02,-.19,.5,-.015,0,.5,-.055,.19,.5,0,-.13,.78,-.09,0,.78,-.135,.13,.78,-.12,0,1,-.22],t=new m.BufferGeometry;t.setAttribute("position",new m.Float32BufferAttribute(e,3)),t.setAttribute("aUV",new m.Float32BufferAttribute([0,0,-1,.22,0,.22,1,.22,-1,.5,0,.5,1,.5,-1,.78,0,.78,1,.78,0,1],2)),t.setIndex([0,2,1,0,3,2,1,2,5,1,5,4,2,3,6,2,6,5,4,5,8,4,8,7,5,6,9,5,9,8,7,8,10,8,9,10]),t.computeVertexNormals();const o=new m.BufferGeometry;o.setAttribute("position",new m.Float32BufferAttribute([0,0,0,-.18,.42,.03,0,.45,-.05,.18,.42,0,0,1,-.22],3)),o.setAttribute("aUV",new m.Float32BufferAttribute([0,0,-1,.42,0,.45,1,.42,0,1],2)),o.setIndex([0,2,1,0,3,2,1,2,4,2,3,4]),o.computeVertexNormals();const r=(()=>{const L=[],T=[],V=[],B=[],g=s(),P=s(),U=s(),W=s(),D=s(),w=s(),O=.012,X=(re,Z,Y)=>{const Q=Math.min(1,Math.max(0,re)),wt=Math.max(.006,.215*Math.pow(Math.sin(Math.PI*Math.pow(Q,.72)),.75)*(1-.25*Q)),be=Math.abs(Z),So=.05*Math.sin(Q*19+(Z>0?0:2.1))*be*be*(.3+.7*Math.sin(Math.PI*Q));return Y.set(Z*wt+.035*Q*Q*Math.sin(Q*4),Q*(1-.05*Q*Q)-.06*be*(1-Q)*(1-Q),.36*be*wt-.24*wt*be*be*be*be+So+.045*Math.sin(Math.PI*Q)-.3*Math.pow(Q,2.2))};for(let re=0;re<=8;re++)for(let Z=0;Z<=4;Z++){const Y=re/8,Q=-1+2*Z/4;X(Y,Q,g),X(Y+O,Q,P),X(Y-O,Q,U),X(Y,Math.min(1,Q+O),W),X(Y,Math.max(-1,Q-O),D),w.crossVectors(W.sub(D),P.sub(U)),w.lengthSq()<1e-14&&w.set(0,0,1),w.normalize(),L.push(g.x,g.y,g.z),T.push(Q,Y),V.push(w.x,w.y,w.z)}for(let re=0;re<8;re++)for(let Z=0;Z<4;Z++){const Y=re*5+Z;B.push(Y,Y+1,Y+4+2,Y,Y+4+2,Y+4+1)}const oe=new m.BufferGeometry;return oe.setAttribute("position",new m.Float32BufferAttribute(L,3)),oe.setAttribute("aUV",new m.Float32BufferAttribute(T,2)),oe.setAttribute("normal",new m.Float32BufferAttribute(V,3)),oe.setIndex(B),oe})(),a=Me($t,Kt,{},{side:m.DoubleSide}),d=new m.Matrix4,l=s(),h=s(),f=s(),p=[{g:t,m:[],lf:[]},{g:o,m:[],lf:[]},{g:r,m:[],lf:[]}],u=c=>Math.min(ue(c),me(c),de(c));let M=0;for(const c of te){const y=c.fz?H:n,L=c.size||1,T=Fe(c.p),V=y.range(0,6.283),B=p[c.fz||u(c.p)<(i.nearLeaf??11.5)?2:Math.min(ue(c.p),me(c.p))<11.5?0:1];for(let g=0;g<c.k;g++){const P=V+g/c.k*6.283*1.6+y.range(-.35,.35);h.set(Math.cos(P),-y.range(.05,.9),Math.sin(P)).normalize(),f.copy(ve).addScaledVector(h,-h.y).add(s(y.range(-.25,.25),0,y.range(-.25,.25))).normalize(),l.crossVectors(h,f).normalize(),f.crossVectors(l,h);const U=y.range(2.5,3.9)*(B===p[1]?1.18:1)*L;d.makeBasis(l,h,f).scale(s(U*y.range(1,1.4),U,U)).setPosition(c.p.x+h.x*.3,c.p.y+y.range(-.5,.5),c.p.z+h.z*.3);const W=[y(),Math.min(1,T*y.range(.75,1.25)),0,y.range(.6,1.2)];if(!c.cut){for(let D=0;D<16;D++)B.m.push(d.elements[D]);B.lf.push(W[0],W[1],W[2],W[3]),M++}}(M&1023)<10&&await v.yield()}for(const c of p){const y=c.lf.length/4;if(!y)continue;const L=new m.InstancedMesh(c.g,a,y);L.instanceMatrix.array.set(c.m),L.instanceMatrix.needsUpdate=!0,c.g.setAttribute("aLf",new m.InstancedBufferAttribute(new Float32Array(c.lf),4)),ye(L)}}const Qe=[await zt(v,2,[0,.3,.6,.85,1],2,0)];await v.yield(),Qe.push(await zt(v,6,[0,.2,.4,.58,.74,.86,.94,1],3,1)),await v.yield();{const e=[];for(let t=0;t<=14;t++)e.push(1-Math.pow(1-t/14,1.35));Qe.push(await zt(v,12,e,6,2))}await v.yield();const vo=Me(Vt,At,{uScale:{value:1}},{side:m.DoubleSide}),pt={value:1},ho=Me(Vt,At,{uScale:pt},{side:m.DoubleSide}),Dt=[],we={piv:[],rel:[],sw:[],life:[]},Tt=[],Wt=[];for(let e=0;e<5;e++)Tt.push(Oe(e+.5,1.2,s())),Wt.push(Oe(e,2,s()));const po=b==="drizzle"?.42:1;for(let e=0;e<3;e++){const t=ee.filter(u=>u.lod===e);if(!t.length)continue;const o=new m.InstancedMesh(Qe[e],e>0?ho:vo,t.length);e>0&&Dt.push(o);const r=new Float32Array(t.length*4),a=new Float32Array(t.length*4),d=new m.Matrix4,l=s(),h=s(),f=s(),p=s();t.forEach((u,M)=>{const c=u.fz?H:n,y=u.cut?1e-4:u.len;h.copy(u.axis).negate(),l.set(1,0,0).applyAxisAngle(ve,c.range(0,6.283)),l.addScaledVector(h,-l.dot(h)).normalize(),f.crossVectors(l,h),d.makeBasis(l,h,f).scale(s(y,y,y)).setPosition(u.piv),o.setMatrixAt(M,d);const L=u.stop==="stopSun"?1:u.stop?Math.max(.85,Fe(u.mouth)):Fe(u.mouth),T=[c.range(0,6.283),c.range(0,6.283),u.swing,c.range(1.25,1.75)*Math.sqrt(4/u.len)];r.set(T,M*4),u.swv=T,a.set([u.stop?.6:c(),L,c.range(-.12,.12),0],M*4),u.maxSwing=u.swing*3.2;const V=e===0?3:5,B=c.int(0,4);for(let g=0;g<V+(e>0?5:0);g++){const P=g<V?Tt[(g+B)%5]:Wt[g-V];p.set(0,0,0).addScaledVector(l,P.x*u.len).addScaledVector(h,P.y*u.len).addScaledVector(f,P.z*u.len),we.piv.push(u.piv.x,u.piv.y,u.piv.z),we.rel.push(p.x,p.y,p.z),we.sw.push(...T),we.life.push(c(),c.range(5,11)*po,c.range(.075,.12)*(u.len/4)*(g<V?1:.7)*(u.cut?0:1),L)}}),Qe[e].setAttribute("aSw",new m.InstancedBufferAttribute(r,4)),Qe[e].setAttribute("aTint",new m.InstancedBufferAttribute(a,4)),ye(o)}await v.yield();const Pe={value:1},It={value:(i.fogCut??1)*.28};let _e=null,gt=null;if(i.farFrom&&v.core){const e=v.core.makeRng(v.core.hashSeed("swordbill-far:"+v.seed)),t=new at({position:3,normal:3,aUV:2,aPart:1});Le(t,(g,P,U)=>{if(Oe(g+.5,P,U),P<.3){const W=(g+.5)/5*Math.PI*2,D=St(.14+P,g+.5);U.x=Math.cos(W)*D,U.z=Math.sin(W)*D}return U},5,[0,.28,.62,1,1.5,2],0,g=>g<=1?.12+.88*g:g);for(let g=0;g<t.n;g++)t.a.aUV[g*2+1]<.37&&(t.a.aPart[g]=1);const o=t.fixWinding().geometry(),r=j(s(i.farFrom.x,i.farFrom.y,i.farFrom.z)),a=r.clone().sub(ge).normalize(),d=Math.round((i.farBells??400)*Math.min(1,x+.2)),l=[],h=[],f=[],p=new m.Matrix4,u=s(),M=s(),c=s(),y=s();for(let g=0;g<d*8&&f.length/4<d&&te.length;g++){(g&31)===31&&await v.yield();const P=te[Math.floor(e()*te.length)];y.set(P.p.x+e.range(-2.4,2.4),P.p.y+e.range(-2.6,.4),P.p.z+e.range(-2.4,2.4));const U=e.range(5,7.2),W=(y.x-ge.x)*a.x+(y.y-ge.y)*a.y+(y.z-ge.z)*a.z,D=Fe(y);if(!(W<-7||y.y-U<3)){M.set(e.range(-.22,.22),1,e.range(-.22,.22)).normalize(),u.set(1,0,0).applyAxisAngle(ve,e.range(0,6.283)),u.addScaledVector(M,-u.dot(M)).normalize(),c.crossVectors(u,M),p.makeBasis(u,M,c).scale(s(U,U,U)).setPosition(y);for(let w=0;w<16;w++)l.push(p.elements[w]);h.push(e.range(0,6.283),e.range(0,6.283),e.range(.12,.18),e.range(1.1,1.5)),f.push(e(),Math.max(.25,Math.min(.9,D*e.range(.7,1.2))),e.range(-.34,-.1),0)}}const L=f.length/4;L&&(_e=new m.InstancedMesh(o,Me(Vt,At,{uScale:Pe,uFogCut:It},{side:m.DoubleSide}),L),_e.instanceMatrix.array.set(l),_e.instanceMatrix.needsUpdate=!0,o.setAttribute("aSw",new m.InstancedBufferAttribute(new Float32Array(h),4)),o.setAttribute("aTint",new m.InstancedBufferAttribute(new Float32Array(f),4)),ye(_e));const T=[],V=[],B=s();for(let g=0;g<400&&V.length/2<16&&te.length;g++){const P=te[Math.floor(e()*te.length)];B.subVectors(P.p,ge);const U=B.dot(a),W=Math.sqrt(Math.max(0,B.lengthSq()-U*U)),D=e.range(8,12.5);if(U>4||W+D>29||P.p.y-D<6)continue;const w=e.range(5,10);T.push(P.p.x-a.x*w,P.p.y-a.y*w,P.p.z-a.z*w,D),V.push(e()*10,e.range(.8,.95))}if(V.length){const g=new m.InstancedBufferGeometry;g.setAttribute("position",new m.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),g.setIndex([0,1,2,0,2,3]),g.setAttribute("aA",new m.InstancedBufferAttribute(new Float32Array(T),4)),g.setAttribute("aB",new m.InstancedBufferAttribute(new Float32Array(V),2)),g.instanceCount=V.length/2,gt=ye(new m.Mesh(g,Me(Bo,Lo,{uScale:Pe,uFogCut:It},{transparent:!0,depthWrite:!1})),1)}}await v.yield();const mt=e=>{const t=new m.InstancedBufferGeometry;t.setAttribute("position",new m.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),t.setIndex([0,1,2,0,2,3]);let o=0;for(const r in e){const[a,d]=e[r];t.setAttribute(r,new m.InstancedBufferAttribute(new Float32Array(a),d)),o=a.length/d}return t.instanceCount=o,t},qt={value:new m.Vector2(800,450)},Et={value:new m.Vector2(.3,.6)};ye(new m.Mesh(mt({aPiv:[we.piv,3],aRel:[we.rel,3],aSw:[we.sw,4],aLife:[we.life,4]}),Me(ko,Po,{uRes:qt,uSunV:Et,uGrav:{value:11}},{transparent:!0,depthWrite:!1})),3);{const e=new at({position:3,normal:3,aUV:2,aLf:4}),t=n.shuffle(dt.slice());let o=0;const r=Math.round(190*x);for(const u of t){if(o>=r)break;const M=n.chance(.3)?n.range(2,3.2):n.range(4,6.2),c=u.p.clone().add(s(n.range(-.3,.3)*u.r,-u.r*.8,n.range(-.3,.3)*u.r)),y=c.clone().add(s(0,-M,0));if(u.p.y<6||Te(y)<1||Te(c)<1||ue(y)<6.3||ue(c)<6.3||me(y)<6||me(c)<6||de(y)<6.5||de(c)<6.5)continue;const L=Fe(c),T=n(),V=n.range(0,Math.PI),B=n.range(.45,.9);if((ze.length||De.length)&&(Ve(y)<6.5||Ve(c)<6.5||Ae(y,.9)||Ae(c,.9))){o++;continue}for(let g=0;g<2;g++){const P=V+g*1.57,U=Math.cos(P),W=Math.sin(P),D=[];for(let w=0;w<=4;w++){const O=w/4,X=c.y-M*O,oe=B*(1-.25*O);D.push([e.v({position:[c.x-U*oe,X,c.z-W*oe],normal:[-W,.15,U],aUV:[-1,O],aLf:[T,L,1,1.3]}),e.v({position:[c.x+U*oe,X,c.z+W*oe],normal:[-W,.15,U],aUV:[1,O],aLf:[T,L,1,1.3]})])}for(let w=0;w<4;w++)e.quad(D[w][0],D[w][1],D[w+1][1],D[w+1][0])}o++}const a=[];for(let u=3;u<se.pts.length-1;u+=2)a.push({p:se.pts[u],r:1.8,t:se.pts[u+1].clone().sub(se.pts[u-1]).normalize()});for(const u of ut)for(const M of[.12,.3,.52]){const c=Math.max(1,Math.round(M*(u.pts.length-1)));a.push({p:u.pts[c],r:Ie(u,c),t:u.pts[c+1].clone().sub(u.pts[c-1]).normalize()})}const d=s(),l=s(),h=s(),f=s(),p=s();for(const u of a){if(!n.chance(.85))continue;d.copy(ve).addScaledVector(u.t,-u.t.y).normalize();const M=u.p.clone().addScaledVector(d,u.r*.95).add(s(n.range(-.5,.5),0,0));if(ue(M)<9||de(M)<7.5)continue;d.lerp(ve,.5).normalize(),l.set(1,0,0).addScaledVector(d,-d.x).normalize(),h.crossVectors(d,l);const c=n.int(13,17),y=n.range(1.7,2.9),L=Math.max(.5,Fe(M)),T=n();for(let V=0;V<c;V++){const B=V/c*6.283+n.range(-.15,.15),g=n.range(.75,1.25)*(V%2?1:.7),P=y*n.range(.75,1.15),U=Math.cos(B),W=Math.sin(B),D=[];for(let w=0;w<=3;w++){const O=w/3,X=g-O*O*1.25,oe=P*O*(.55+.45*Math.cos(g-O*.6)),re=P*(Math.sin(g)*O-.42*O*O),Z=.3*(y/2.3)*(1-O*O)*(.5+.5*Math.min(1,O*4))+.015;f.copy(M).addScaledVector(l,U*oe).addScaledVector(h,W*oe).addScaledVector(d,re),p.copy(d).multiplyScalar(Math.cos(X)).addScaledVector(l,-U*Math.sin(X)).addScaledVector(h,-W*Math.sin(X));const Y=-W*Z,Q=U*Z;D.push([e.v({position:[f.x+l.x*Y+h.x*Q,f.y+l.y*Y+h.y*Q,f.z+l.z*Y+h.z*Q],normal:[p.x,p.y,p.z],aUV:[-1,O],aLf:[T,L,2,.12]}),e.v({position:[f.x-l.x*Y-h.x*Q,f.y-l.y*Y-h.y*Q,f.z-l.z*Y-h.z*Q],normal:[p.x,p.y,p.z],aUV:[1,O],aLf:[T,L,2,.12]})])}for(let w=0;w<3;w++)e.quad(D[w][0],D[w][1],D[w+1][1],D[w+1][0])}}ye(new m.Mesh(e.geometry(),Me($t,Kt,{},{side:m.DoubleSide})))}await v.yield();const Qt={value:s(0,40,120)};if(i.mist!==!1){const e=[],t=[],o=Math.round(44*x);for(let r=0;r<o;r++)e.push(n.range(-26,26),n.range(-26,-6),n.range(-2,60),n.range(9,17)),t.push(n(),1/n.range(24,40),n.range(0,10),n.range(.15,.28)*(i.mistAlpha??1));ye(new m.Mesh(mt({aA:[e,4],aB:[t,4]}),new m.ShaderMaterial({uniforms:{...ne},vertexShader:_o,fragmentShader:No,transparent:!0,depthWrite:!1})),2)}if(i.shafts!==!1&&k.shafts>0){const e=[],t=[];for(let o=0;o<10;o++){const r=n.range(0,6.283),a=n.range(6,26);e.push(Math.cos(r)*a,n.range(26,44),26+Math.sin(r)*a,n.range(38,60)),t.push(n.range(1.6,3.6),n(),n.range(.05,.11)*k.shafts,0)}ye(new m.Mesh(mt({aA:[e,4],aB:[t,4]}),new m.ShaderMaterial({uniforms:{...ne,uSunL:{value:he.clone()},uCamL:Qt},vertexShader:Go,fragmentShader:Uo,transparent:!0,depthWrite:!1,blending:m.AdditiveBlending,side:m.DoubleSide})),4)}const yt=e=>({flower:z(e.M),view:z(e.view),approach:z(e.approach),axis:z(e.axis),pivot:z(e.bell.piv),length:e.len}),Rt=[];for(let e=0;e<8;e++){const t=-(e/8)*Math.PI*2+Math.PI/2;Rt.push(z(s(Math.cos(t)*52,30-4*Math.cos(t-.6),26+Math.sin(t)*54)))}const go={portalSeat:{position:z(Ge),normal:z(ce).negate(),radius:7,tiltDeg:60},naveFoot:z(pe),flyThrough:$e.map(z),stopSun:yt($[0]),stopBacklit:{...yt($[1]),bells:$[1].group.map(e=>z(e.mouth))},stopThroat:yt($[2]),feeder:xe?{flower:z(xe.M),axis:z(xe.axis),pivot:z(xe.piv),length:xe.len}:null,circuit:Rt,trunkTop:z(Je),fork:z(Je),limbTips:ut.map(e=>z(e.pts[e.pts.length-1])),crownTop:z(s(0,76,24)),under:z(s(0,5,44)),wind:z(Gt)},mo=z(ge),yo=32,xo=76,Mo=mo,xt=[];for(const e of J)for(let t=0;t<(e.drawN??e.pts.length);t++){const o=z(e.pts[t]);xt.push(o.x,o.y,o.z,e===se?3:e.level<=1||e.level===5?Ie(e,t):.3)}for(const e of te){if(e.cut)continue;const t=z(e.p);xt.push(t.x,t.y,t.z,3.2)}const Ot=[];for(const e of J)if(e===se||e.level===0)for(let t=0;t<e.pts.length;t++){const o=z(e.pts[t]);Ot.push(o.x,o.y,o.z,e===se?2.1:Ie(e,t))}const jt=s(),wo=qt.value,Yt=s(),Mt=s();let bo=1;return{object:Ut,radius:yo,height:xo,center:Mo,anchors:go,ground:!1,groundY:-9,uniforms:ne,solids:xt,mainWood:Ot,bells:ee.filter(e=>!e.cut).map(e=>({position:z(e.piv),axis:z(e.axis),length:e.len,swing:e.maxSwing,lod:e.lod,stop:e.stop||(e.fz?"young":null)})),cutCount:{bells:ee.filter(e=>e.cut).length,clusters:te.filter(e=>e.cut).length,wood:J.filter(e=>e.drawN!=null).length},feederMouth(e,t,o){if(!xe)return null;const r=xe.bell,a=r.swv,d=ne.uWindDir.value,l=ne.uGust.value,h=r.piv,f=(h.x*d.x+h.y*d.y+h.z*d.z)*l.x-e*l.y,p=.5+.5*Math.sin(f),u=.5+.5*Math.sin(f*.37+h.y*.05+1.3),M=p*p*(.35+.65*u);let c=a[2]*(.6*Math.sin(e*a[3]+a[0])+.3*Math.sin(e*a[3]*1.83+a[1])),y=a[2]*(.6*Math.sin(e*a[3]*.93+a[1])+.3*Math.sin(e*a[3]*1.61+a[0]*1.7));const L=l.z*a[2]*M*(1.5+.4*Math.sin(e*a[3]*1.3+a[0]));c+=d.x*L,y+=d.z*L;const T=Math.hypot(c,y);return Yt.set(-y,0,c).multiplyScalar(1/Math.max(T,1e-5)),Mt.copy(r.axis).applyAxisAngle(Yt,T),o&&o.copy(Mt).applyAxisAngle(ve,I),t.copy(Mt).multiplyScalar(r.len).add(h).applyAxisAngle(ve,I)},setWind(e){bo=e,ne.uGust.value.z=e},setSun(e,t){ne.uSunDir.value.copy(e).normalize(),t&&ne.uSunCol.value.copy(t)},update(e,t,o){ne.uTime.value=t,ne.uGlow.value=1+.07*Math.sin(t*.45)+.04*Math.sin(t*.17+2);const r=o.matrixWorld.elements,a=ne.uSunDir.value;if(Et.value.set(a.x*r[0]+a.y*r[1]+a.z*r[2],a.x*r[4]+a.y*r[5]+a.z*r[6]),Ee.updateWorldMatrix(!0,!1),Qt.value.copy(Ee.worldToLocal(jt.set(r[12],r[13],r[14]))),_e){Pe.value=ie(92,108,jt.distanceTo(ge)),_e.visible=Pe.value>.2,gt&&(gt.visible=Pe.value>.004),pt.value=1-Pe.value;for(const d of Dt)d.visible=pt.value>.004}v.renderer&&v.renderer.getDrawingBufferSize(wo)},dispose(){}}}export{Wo as buildHero};
