import*as p from"three";import{clamp as j,lerp as Ce,smoothstep as V}from"../kit/core.js";const D0=["#020712","#0e3842","#3dffb0","#a25bff","#16324a","#cfe9f5","#ffb060"],Ve=`
float hash3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x), mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x), mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s / 0.9375; }
`,Ze=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogFade = exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    float fogFade = 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
  #endif
  gl_FragColor.rgb *= fogFade;
#endif
`,R0=`
attribute vec3 aData;            // x glow amount, y hue (0 aurora turquoise .. 1 glacial blue), z occlusion
varying vec3 vLocal, vWorld, vN, vNw, vData;
#include <fog_pars_vertex>
void main(){
  vLocal = position; vN = normal; vData = aData;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz; vNw = mat3(modelMatrix) * normal;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,W0=`
uniform float uTime, uBright, uGlow, uPulse, uWave;
uniform vec3 uCDeep, uCTurq, uCGreen, uCViolet, uCSnow, uCSky, uCrev, uLight;
varying vec3 vLocal, vWorld, vN, vNw, vData;
#include <fog_pars_fragment>
${Ve}
void main(){
  vec3 p = vLocal;
  vec3 V = normalize(cameraPosition - vWorld);
  // object-space normal (lighting from above survives the mirrored copy)
  vec3 Ns = normalize(vN);
  vec3 Nf = normalize(cross(dFdx(p), dFdy(p)));
  if (dot(Nf, Ns) < 0.0) Nf = -Nf;
  vec3 N = normalize(mix(Ns, Nf, 0.35));
  // fine chiselled-ice bump
  float mpp = max(max(length(dFdx(p)), length(dFdy(p))), 1e-4);     // metres per pixel
  float k1 = clamp(1.25 - mpp * 1.1, 0.0, 1.0), k2 = clamp(1.0 - mpp * 4.0, 0.0, 1.0);
#ifndef MIRROR_COPY
  vec3 bp = p * 0.6;
  float b0 = vnoise(bp);
  vec3 grad = (vec3(vnoise(bp + vec3(0.3, 0.0, 0.0)), vnoise(bp + vec3(0.0, 0.3, 0.0)), vnoise(bp + vec3(0.0, 0.0, 0.3))) - b0) * k1;
  vec3 bq = p * 2.1 + 5.0;
  float c0 = vnoise(bq);
  grad += 0.4 * k2 * (vec3(vnoise(bq + vec3(0.3, 0.0, 0.0)), vnoise(bq + vec3(0.0, 0.3, 0.0)), vnoise(bq + vec3(0.0, 0.0, 0.3))) - c0);
  N = normalize(N - 2.2 * (grad - dot(grad, N) * N));
#endif
  float up = N.y;
  // world-space normal for view effects
  vec3 Fw = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  if (dot(Fw, V) < 0.0) Fw = -Fw;
  vec3 Nw = normalize(mix(normalize(vNw), Fw, 0.35));
  float ndv = clamp(dot(Nw, V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 3.0);

  float n1 = fbm(p * 0.045);
  float n2 = fbm(p * vec3(0.6, 0.22, 0.6) + 7.0);
  float strata = 0.5 + 0.5 * sin(p.y * 0.9 + n1 * 9.0 + p.x * 0.03);
  // crevasse lines: iso-lines of stretched noise, kept a constant width in metres
  float va = vnoise(vec3(p.x * 0.05 + n1 * 1.0, p.y * 0.006 + 3.0, p.z * 0.05 - n1 * 0.6));
  float wa = max(0.42, mpp * 0.9);
  float crack = (1.0 - smoothstep(wa * 0.5, wa, abs(va - 0.5) / max(fwidth(va) / mpp, 1e-4))) * clamp(0.55 / wa, 0.35, 1.0);
  float vb = vnoise(vec3(p.x * 0.17 - n2 * 0.8, p.y * 0.022, p.z * 0.17 + 9.0));
  float wb = max(0.14, mpp * 0.9);
  crack = max(crack, 0.6 * (1.0 - smoothstep(wb * 0.5, wb, abs(vb - 0.5) / max(fwidth(vb) / mpp, 1e-4))) * clamp(0.18 / wb, 0.0, 1.0));

  float g = vData.x;
  float aur = 1.0 - vData.y;                          // 1 on the glacier, ~0.2 on bergs
  float snow = smoothstep(0.42, 0.78, up + (n2 - 0.5) * 0.4) * (1.0 - smoothstep(0.5, 1.2, g));
  float frost = smoothstep(0.45, 0.9, vData.z + (n2 - 0.5) * 0.6) * (1.0 - snow);

  // surface under aurora light from straight above
  vec3 light = uLight * (0.14 + 0.86 * clamp(up * 0.6 + 0.4, 0.0, 1.0)) * (0.8 + 0.2 * uPulse) + uCSky;
  vec3 iceAlb = mix(uCDeep, uCTurq * 0.6, 0.25 + 0.5 * n1) * (0.7 + 0.3 * strata);
  iceAlb = mix(iceAlb, uCSnow * 0.5, frost * 0.65);
  vec3 alb = mix(iceAlb, uCSnow * 0.78, snow);
  vec3 col = alb * light * (0.5 + 0.5 * vData.z);
  float sp = step(0.988, hash3(floor(p * 2.5))) * snow * k2;
  col += uCSnow * sp * 0.5 * (0.3 + 0.7 * ndv);

  // the aurora trapped in the ice: a turquoise body glow ...
  float cur = fbm(vec3(p.x * 0.035 + uTime * 0.012, p.y * 0.012 - uTime * 0.02, p.z * 0.035));
  float body = 0.12 + 2.0 * cur * cur * cur + 0.2 * n2;
  vec3 em = mix(uCTurq, uCrev * 0.9 + uCTurq * 0.45, vData.y) * g * body;
  // ... and real curtains hanging inside it: sharp lower hem, rays fading upward to violet
  float fold = fbm(vec3(p.x * 0.016 + uTime * 0.01, 2.0, p.z * 0.016 - uTime * 0.006));
  float rays = vnoise(vec3(p.x * 0.24 + fold * 9.0, p.y * 0.012 - uTime * 0.035, p.z * 0.24));
  float hem = 6.0 + 30.0 * (0.5 + 0.5 * sin(fold * 9.0 + p.x * 0.02));
  float hh = (p.y - hem) / 26.0;
  float curtain = smoothstep(-0.3, 0.0, hh) * exp(-max(hh, 0.0) * 2.2) * (0.35 + 1.3 * rays * rays);
  vec3 cc = mix(uCGreen, uCViolet * 1.5, smoothstep(0.25, 1.1, hh));
  em += cc * curtain * min(g, 1.6) * aur * 1.1;
  float depthView = 0.35 + 0.65 * pow(ndv, 0.7);
  em *= depthView * (1.0 - 0.8 * frost);
  vec3 crevC = mix(uCrev, uCTurq, 0.16);
  float halo = 1.0 - smoothstep(0.0, 2.2, abs(va - 0.5) / max(fwidth(va) / mpp, 1e-4));
  em = mix(em, crevC * (0.25 + 0.5 * g), halo * 0.22 * k1);          // blue bleeding out of each crevasse
  em = mix(em, crevC * (0.1 + 0.42 * g), crack * 0.88);
  em *= 1.0 - 0.92 * snow;
  float ring = 0.5 + 0.5 * sin(length(p.xy - vec2(0.0, 10.0)) * 0.07 - uWave);
  em *= uGlow * (0.8 + 0.35 * ring * ring);
  col += em;
  col += (uLight * 0.5 + uCSky) * fres * (0.3 + 0.7 * clamp(up + 0.4, 0.0, 1.0));

  gl_FragColor = vec4(col * uBright, 1.0);
  #include <fog_fragment>
}`,K0=`
#include <fog_pars_vertex>
`,g0=`
uniform float uTime;
varying vec2 vUv;
#include <fog_pars_vertex>
void main(){
  vUv = uv;
  vec3 p = position;
  float v = uv.y, s = uv.x;
  p.x += sin(s * 9.0 + uTime * 0.15 + v * 1.5) * 16.0 * v + sin(s * 23.0 - uTime * 0.21) * 5.0 * v;
  p.z += cos(s * 7.0 - uTime * 0.11 + v * 2.0) * 24.0 * v;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,d0=`
uniform float uTime, uStrength, uPulse;
uniform vec3 uCGreen, uCViolet, uCTurq;
varying vec2 vUv;
#include <fog_pars_fragment>
${Ve}
void main(){
  float s = vUv.x, v = vUv.y;
  float fold = vnoise(vec3(s * 6.0 + uTime * 0.02, uTime * 0.03, 1.0));
  float rays = vnoise(vec3(s * 70.0 + fold * 10.0, v * 0.8 - uTime * 0.06, uTime * 0.05));
  float fine = vnoise(vec3(s * 210.0 + fold * 20.0, v * 0.5, uTime * 0.08));
  rays = 0.2 + 0.55 * rays + 0.45 * fine * fine;
  float band = smoothstep(0.2, 0.7, vnoise(vec3(s * 3.2 - uTime * 0.015, 3.0, uTime * 0.025)));
  float top = mix(0.3, 1.0, vnoise(vec3(s * 4.5, 7.0, uTime * 0.03)));
  float vv = v / top;
  float prof = smoothstep(0.0, 0.05, vv) * pow(max(1.0 - vv, 0.0), 1.4);
  float edge = smoothstep(0.0, 0.28, s) * smoothstep(1.0, 0.72, s);
  vec3 c = mix(uCTurq, uCGreen, smoothstep(0.0, 0.15, vv));
  c = mix(c, uCViolet * 1.6, smoothstep(0.3, 0.9, vv));
  float I = prof * edge * rays * (0.3 + 0.7 * band) * (0.75 + 0.25 * uPulse) * uStrength;
  gl_FragColor = vec4(c * I, 1.0);
  ${Ze}
}`,w0=`
varying vec3 vWorld; varying vec3 vLocal;
#include <fog_pars_vertex>
void main(){
  vLocal = position;
  vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,E0=`
uniform float uTime, uRadius;
uniform vec3 uBody, uCSky, uLight;
varying vec3 vWorld; varying vec3 vLocal;
#include <fog_pars_fragment>
${Ve}
void main(){
  vec3 V = normalize(cameraPosition - vWorld);
  float dist = length(cameraPosition - vWorld);
  vec2 q = vWorld.xz;
  float lod = 1.0 / (1.0 + dist * 0.01);
  float r1 = vnoise(vec3(q * vec2(0.9, 0.22) + vec2(uTime * 0.05, uTime * 0.02), uTime * 0.07));
  float r2 = vnoise(vec3(q * vec2(0.25, 0.06) - vec2(uTime * 0.02, 0.0), uTime * 0.03 + 5.0));
  float rip = (r1 - 0.5) * lod + (r2 - 0.5) * 0.6;
  float ndv = clamp(abs(V.y) + rip * 0.05, 0.0, 1.0);
  float a = mix(0.2, 0.9, smoothstep(0.0, 0.8, ndv));
  a = clamp(a + rip * 0.10, 0.08, 0.95);
  vec3 col = uBody + uCSky * pow(1.0 - ndv, 4.0) * 1.2;
  col += uLight * 0.06 * smoothstep(0.25, 0.5, rip) * pow(1.0 - ndv, 2.0);
  a *= 1.0 - smoothstep(uRadius * 0.82, uRadius, length(vLocal.xy));
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,O0=`
uniform float uTime, uGlow;
uniform vec3 uCTurq, uCGreen;
varying vec3 vWorld; varying vec3 vLocal;
#include <fog_pars_fragment>
${Ve}
void main(){
  float x = vLocal.x, z = -vLocal.y;                 // plane is rotated flat: local -y runs toward +Z
  float zo = max(z, 0.0);
  float w = 6.0 + zo * 0.2;
  float I = exp(-abs(x) / w) * exp(-zo / 85.0) * smoothstep(-75.0, -15.0, z);
  float streak = vnoise(vec3(x * 0.45, z * 0.035 - uTime * 0.04, uTime * 0.05));
  float streak2 = vnoise(vec3(x * 1.7, z * 0.11 + uTime * 0.06, 3.0));
  I *= 0.45 + 0.75 * streak + 0.35 * streak2 * streak2;
  I *= smoothstep(45.0, 20.0, abs(x)) * smoothstep(195.0, 120.0, z);
  vec3 c = mix(uCTurq, uCGreen, 0.25 + 0.4 * streak);
  gl_FragColor = vec4(c * I * 0.5 * uGlow, 1.0);
  ${Ze}
}`,U0=`
attribute vec4 aSeed;
uniform float uTime, uScale;
varying float vTw;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  float life = fract(aSeed.x + uTime * (0.012 + 0.02 * aSeed.y));
  p.z = mix(-45.0, 150.0, life);
  float spread = 0.55 + life * 2.2;
  p.x = p.x * spread + sin(uTime * 0.3 + aSeed.z * 40.0) * 2.0;
  p.y = 1.0 + p.y * (0.6 + life * 0.9) + sin(uTime * 0.23 + aSeed.w * 30.0) * 1.2;
  vTw = (0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * (1.5 + aSeed.w * 3.0) + aSeed.z * 60.0), 3.0)) * sin(life * 3.14159);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = clamp(uScale * (0.12 + 0.2 * aSeed.y) / max(-mvPosition.z, 1.0), 1.0, 9.0);
  #include <fog_vertex>
}`,j0=`
uniform vec3 uCTurq, uCSnow;
varying float vTw;
#include <fog_pars_fragment>
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.05, length(d));
  gl_FragColor = vec4(mix(uCTurq, uCSnow, 0.45) * a * vTw * 2.2, 1.0);
  ${Ze}
}`;function Je(){const c=[],v=[],t=[],i={P:c,D:v,I:t,v(r,d,l,y,u,x){return c.push(r,d<0?0:d,l),v.push(y,u,x),c.length/3-1},patch(r,d){const l=[0,0,0];let y=0;for(let u=0;u<r.length;u+=3){const x=r[u]*3,C=r[u+1]*3,f=r[u+2]*3,_=c[C]-c[x],R=c[C+1]-c[x+1],W=c[C+2]-c[x+2],E=c[f]-c[x],D=c[f+1]-c[x+1],b=c[f+2]-c[x+2];d((c[x]+c[C]+c[f])/3,(c[x+1]+c[C+1]+c[f+1])/3,(c[x+2]+c[C+2]+c[f+2])/3,l),y+=(R*b-W*D)*l[0]+(W*E-_*b)*l[1]+(_*D-R*E)*l[2]}if(y<0)for(let u=0;u<r.length;u+=3)t.push(r[u],r[u+2],r[u+1]);else for(let u=0;u<r.length;u++)t.push(r[u])},grid(r,d,l,y){const u=[];for(let x=0;x<r-1;x++)for(let C=0;C<d-1;C++){const f=l(x,C),_=l(x+1,C),R=l(x+1,C+1),W=l(x,C+1);u.push(f,_,R,f,R,W)}i.patch(u,y)},build(){const r=new p.BufferGeometry;return r.setAttribute("position",new p.Float32BufferAttribute(c,3)),r.setAttribute("aData",new p.Float32BufferAttribute(v,3)),r.setIndex(t),r.computeVertexNormals(),r.computeBoundingSphere(),r},async buildInSteps(r){const d=new p.BufferGeometry;d.setAttribute("position",new p.Float32BufferAttribute(c,3)),await r(),d.setAttribute("aData",new p.Float32BufferAttribute(v,3)),await r(),d.setIndex(t);const l=d.attributes.position.array,y=d.index.array,u=l.length,x=new p.BufferAttribute(new Float32Array(u),3),C=x.array;d.setAttribute("normal",x),await r();for(let b=0,N=y.length;b<N;b+=3e3)N0(y,l,C,b,Math.min(N,b+3e3)),await r();for(let b=0;b<u;b+=6e3)$0(C,b,Math.min(u,b+6e3)),await r();x.needsUpdate=!0;const f=[1/0,1/0,1/0,-1/0,-1/0,-1/0];for(let b=0;b<u;b+=6e3)H0(l,b,Math.min(u,b+6e3),f),await r();const _=f[3]<f[0]||f[4]<f[1]||f[5]<f[2],R=_?0:(f[0]+f[3])*.5,W=_?0:(f[1]+f[4])*.5,E=_?0:(f[2]+f[5])*.5;let D=0;for(let b=0;b<u;b+=6e3)D=Y0(l,b,Math.min(u,b+6e3),R,W,E,D),await r();return d.boundingSphere=new p.Sphere(new p.Vector3(R,W,E),Math.sqrt(D)),d}};return i}function N0(c,v,t,i,r){for(;i<r;i+=3){const d=c[i]*3,l=c[i+1]*3,y=c[i+2]*3,u=v[l],x=v[l+1],C=v[l+2],f=v[y]-u,_=v[y+1]-x,R=v[y+2]-C,W=v[d]-u,E=v[d+1]-x,D=v[d+2]-C,b=_*D-R*E,N=R*W-f*D,ie=f*E-_*W,ze=t[d]+b,me=t[d+1]+N,se=t[d+2]+ie,ge=t[l]+b,Se=t[l+1]+N,_e=t[l+2]+ie,Pe=t[y]+b,Fe=t[y+1]+N,Ae=t[y+2]+ie;t[d]=ze,t[d+1]=me,t[d+2]=se,t[l]=ge,t[l+1]=Se,t[l+2]=_e,t[y]=Pe,t[y+1]=Fe,t[y+2]=Ae}}function $0(c,v,t){for(;v<t;v+=3){const i=c[v],r=c[v+1],d=c[v+2],l=1/(Math.sqrt(i*i+r*r+d*d)||1);c[v]=i*l,c[v+1]=r*l,c[v+2]=d*l}}function H0(c,v,t,i){let r=i[0],d=i[1],l=i[2],y=i[3],u=i[4],x=i[5];for(;v<t;v+=3){const C=c[v],f=c[v+1],_=c[v+2];r=Math.min(r,C),d=Math.min(d,f),l=Math.min(l,_),y=Math.max(y,C),u=Math.max(u,f),x=Math.max(x,_)}i[0]=r,i[1]=d,i[2]=l,i[3]=y,i[4]=u,i[5]=x}function Y0(c,v,t,i,r,d,l){for(;v<t;v+=3){const y=i-c[v],u=r-c[v+1],x=d-c[v+2];l=Math.max(l,y*y+u*u+x*x)}return l}async function Z0(c,v={}){const t=c.rng,i=c.noise,r=async()=>{c.yield&&await c.yield()},l=(v.palette&&v.palette.length>=6?v.palette:D0).map(e=>new p.Color(e)),y=v.width??260,u=y/2,x=v.depth??120,C=60,f=t.range(-400,400),_=t.range(-400,400),R=t.range(13.5,16.5),W=t.range(28,32),E=t.range(2.1,2.9),D=t.range(-.1,.1),b=t.sign()*t.range(.5,1),N=t.range(75,95),ie=t.range(9,17),ze=t.range(52,58),me=t.range(22,40),se=-2.5,ge=e=>{const a=Math.abs(Math.cos(e)),o=Math.sin(e);return 1/Math.pow(Math.pow(a/R,E)+Math.pow(Math.max(o,0)/W,E),1/E)*(1+.07*o*i.n2(e*2.3+f,1.7)+.025*o*i.n2(e*9+f,4.1))},Se=e=>ie*Math.pow(Math.max(0,i.n2(e*.045+f,3.3)),1.3)+4*Math.pow(1-Math.abs(i.n2(e*.09+f,9.1)),2)-2,_e=e=>(ze+5*i.n2(e*.012+f,5.5))*(1-.22*V(.7,1,Math.abs(e)/u)),Pe=e=>_e(e)+Se(e),Fe=(e,a)=>Math.pow(Math.max(0,Math.sin(a*.085+3*i.fbm2((e+f)*.008,a*.008+_,2)+1.2)),8)*V(8,25,a),Ae=(e,a)=>_e(e)+Se(e)*Math.exp(-a/22)+38*(1-Math.exp(-a/110))+4*i.fbm2((e+f)*.03,(a+_)*.03,3)*(1-Math.exp(-a/10))-9*Fe(e,a),De={z:0,rec:0},x0=(e,a,o)=>{const n=e/u,s=i.fbm2((e+f)*.03,a*.006+_,3),h=i.fbm2((e+f)*.011+40,a*.02+_,2)*2.2,w=Math.floor(h),z=w+V(.45,1,h-w),m=i.n3((e+f)*.11,a*.035,_)*1.8,k=i.n3((e+f)*.4,a*.3,_+5)*.45,F=Ce(.25,1,V(0,14,o)),M=1-Math.abs(i.n2((e+f)*.07,a*.005+_*2)),S=M*M*6-2.5;let T=-me*n*n-30*Math.pow(n,6)-a*.1*V(0,20,o)+(s*8+S+z*3.2+m+k)*F;const A=1-V(0,5,o);T-=2.5*A*A;const q=1-j(a/2.5,0,1);return T-=2*q*q*V(1,6,o),De.z=T,De.rec=j(.5-(s*8+S+m)/13,0,1),De},B=Je(),$=168,ee=50,Ie=30,de=30,we=(e,a)=>e*(ee+1)+a,ke=new Float32Array($+1),Re=new Uint8Array($+1);for(let e=0;e<=$;e++){e%16===0&&await r();const a=Math.PI*e/$,o=Math.cos(a),n=Math.max(0,Math.sin(a)),s=ge(a),h=Math.min(u/Math.max(Math.abs(o),1e-6),C/Math.max(n,1e-6));Re[e]=C/Math.max(n,1e-6)<=u/Math.max(Math.abs(o),1e-6)?1:0;for(let w=0;w<=ee;w++){const z=w/ee,m=.3*z+.7*z*z,k=s+(h-s)*m,F=k-s,M=k*o,S=k*n,T=Pe(M),A=S+(T-C)*V(.45,1,S/C),q=M+D*A*(1-m)*(1-m)-Math.sign(M)*20*V(.72,1,Math.abs(M)/u)*Math.pow(j(A/T,0,1),1.3),{z:L,rec:G}=x0(q,A,F);let g=(.2+.95*Math.exp(-F/38))*(.3+1.5*G*G)*(.75+.45*i.fbm2((q+f)*.02,A*.025+_+9,2))*(1-.45*V(.6,1,A/T));const P=Math.exp(-F/2.5);g*=1-.65*P,B.v(q,A,L,g,.05+.4*V(50,125,F),Ce(1-G,1,P)),w===ee&&(ke[e]=M)}}await r(),B.grid($+1,ee+1,we,(e,a,o,n)=>{n[0]=0,n[1]=0,n[2]=1}),await r();const M0=B.P.length/3,y0=(e,a)=>a===0?we(e,ee):M0+e*Ie+(a-1);for(let e=0;e<=$;e++){e%16===0&&await r();const a=we(e,ee)*3,o=B.P[a],n=B.P[a+1],s=B.P[a+2],h=Re[e]?1:j(n/Pe(ke[e]),0,1),w=!Re[e];for(let z=1;z<=Ie;z++){const m=x*Math.pow(z/Ie,1.3),k=1-Math.pow(V(.4,1,m/x),2),F=o+(w?(i.n2(m*.04+f,n*.05)*6+i.n2(m*.13+f,n*.15+3)*2.5)*Math.min(1,m/12):0),M=Fe(ke[e],m),S=h*Ae(ke[e],m)*k;B.v(F*(.72+.28*k),S,s-m,w?.5*k:.05+1.9*M,.2,w?.45:1-M)}}await r(),B.grid($+1,Ie+1,y0,(e,a,o,n)=>{n[0]=e*.3,n[1]=a,n[2]=0}),await r();const b0=B.P.length/3,T0=(e,a)=>a===0?we(e,0):b0+e*de+(a-1),Qe=e=>b*30*Math.pow(j(e/N,0,1),2);for(let e=0;e<=$;e++){e%16===0&&await r();const a=Math.PI*e/$,o=Math.cos(a),n=Math.max(0,Math.sin(a)),s=ge(a),h=B.P[we(e,0)*3+2];for(let w=1;w<=de;w++){const z=w/de,m=N*Math.pow(z,1.2),k=w===de?.03:1-.78*Math.pow(z,1.5),F=s*k*(1+n*(.14*i.n3(o*2.2+f,n*2.2,m*.09)+.06*i.n3(o*6,n*6+_,m*.3))),M=F*n,S=Qe(m)+F*o+D*M,T=(.45+1.5*Math.pow(z,.8))*(.8+.4*i.n3(o*3+_,n*3,m*.12));B.v(S,M,Ce(h,se,Math.min(1,w/3))-m,T,0,.3)}}await r(),B.grid($+1,de+1,T0,(e,a,o,n)=>{n[0]=Qe(-o)-e,n[1]=8-a,n[2]=0});const C0=t.int(60,90);for(let e=0;e<C0;e++){const a=Math.PI*t.range(.2,.8),o=Math.sin(a),n=Math.cos(a),s=t.range(.3,9),h=s/N,w=ge(a)*(1-.78*Math.pow(h,1.25))*.99,z=w*o+.8,m=w*n+D*z,k=se-s,F=t.range(1.4,6.5)*o*o*(t.chance(.15)?1.5:1),M=t.range(.16,.42)*(.6+F*.12),S=t.range(-.25,.25),T=t.range(-.25,.25),A=t.range(0,6.28),q=B.P.length/3,L=[];for(let g=0;g<2;g++)for(let P=0;P<5;P++){const O=A+P*1.2566,U=M*(g?.5:1),re=z-F*.42*g;B.v(m+Math.cos(O)*U+S*g*.4,re,k+Math.sin(O)*U+T*g*.4,1.5+g*.5,.1,.2)}const G=B.v(m+S,z-F,k+T,2.6,.05,.2);for(let g=0;g<5;g++){const P=(g+1)%5;L.push(q+g,q+P,q+5+P,q+g,q+5+P,q+5+g,q+5+g,q+5+P,G)}B.patch(L,(g,P,O,U)=>{U[0]=g-m,U[1]=0,U[2]=O-k})}await r();const e0=await B.buildInSteps(r),z0=ze+ie*.5;await r();const S0=t.range(9,14)*t.sign(),_0=t.range(130,170),t0=D*9,te=e=>t0+S0*Math.sin((e-75)/_0*Math.PI*2)*V(75,135,e),xe=(e,a)=>{let o=1e9;for(let n=a-40;n<=a+40;n+=2)o=Math.min(o,Math.hypot(e-te(n),a-n));return o},We=e=>9+4*V(90,300,e),ce=Je(),ae=[],Me=(e,a,o,n,s,h,w)=>{const z=t.range(0,6.28),m=Math.cos(z),k=Math.sin(z),F=t.range(.62,1),M=t.range(0,100),S=s===0?t.range(4,7):s===1?t.range(1.3,1.9):t.range(2.2,3.2),T=[];for(let I=t.int(1,3);I>0;I--)T.push([t.range(-.45,.45)*o,t.range(-.45,.45)*o*F,t.range(.28,.5)*o,t.range(.55,1)]);T[0][3]=1;const A=t.range(-.45,.45),q=t.range(-.45,.45),L=Math.min(1.5,n*.09),G=n/t.range(4,6.5),g=(I,Y)=>{let J=0;for(const Q of T)J=Math.max(J,Q[3]*Math.exp(-((I-Q[0])**2+(Y-Q[1])**2)/(Q[2]*Q[2])));const X=s===0?.78+.22*i.n2(I*.12+M,Y*.12):.28+.78*J;return n*X*j(1+(A*I+q*Y)/o,.35,1.5)},P=ce.P.length/3;let O=0;for(let I=0;I<w;I++){const Y=I===0?.92:I===1?1:1-Math.pow((I-1)/(w-1),1.35),J=1-Math.pow(Y,S);for(let X=0;X<h;X++){const Q=X/h*Math.PI*2,Xe=Math.cos(Q),Ke=Math.sin(Q),p0=o*Y*(.78+.28*i.n2(Xe*1.3+M,Ke*1.3+M)+.08*i.n2(Xe*4+M,Ke*4-M));let he=Xe*p0,pe=Ke*p0*F,K=0;if(I>0){K=L+g(he,pe)*J,I>1&&(K=Ce(K,Math.round(K/G)*G+L,.45));const m0=o*.07;he+=i.n3(he*.3+M,K*.3,pe*.3)*m0,pe+=i.n3(he*.3,K*.3+M,pe*.3)*m0}O=Math.max(O,K),ce.v(e+he*m-pe*k,K,a+he*k+pe*m,.07+1.1*Math.exp(-K/(.11*n+.7)),.8,.35+.5*J)}}const U=ce.v(e,L+g(0,0),a,.07,.8,.85),re=(I,Y,J,X)=>{X[0]=I-e,X[1]=o*.5,X[2]=J-a};ce.grid(h+1,w,(I,Y)=>P+Y*h+I%h,re);const h0=[];for(let I=0;I<h;I++)h0.push(P+(w-1)*h+I,P+(w-1)*h+(I+1)%h,U);ce.patch(h0,re),ae.push({position:[e,0,a],radius:o*1.1,height:O})},le=(e,a,o,n)=>ae.every(s=>Math.hypot(s.position[0]-e,s.position[2]-a)>s.radius+o+n),P0=t.int(9,12);let ue=t.sign(),oe=t.range(46,58),ne=null;for(let e=0;e<P0;e++){await r();const a=V(40,200,oe),o=t.range(6,10)+6*a*t(),n=j(o*t.range(1,1.75),7,23);let s=te(oe)+ue*(o*1.1+9+t.range(0,9));for(let h=0;h<14&&xe(s,oe)<o*1.15+8.5;h++)s+=ue*2;if(le(s,oe,o,3)){Me(s,oe,o,n,t.pick([0,1,1,2]),44,13);const h=ae[ae.length-1];(!ne||h.height>ne.height)&&(ne=h)}ue=t.chance(.8)?-ue:ue,oe+=t.range(17,27)}await r();const qe=v.avenueFar??0;if(qe>300){let e=Math.max(oe,300)+t.range(8,22),a=ue;for(;e<qe;){await r();const o=t.range(9,14.5),n=j(o*t.range(1.35,1.9),15,24);let s=te(e)+a*(o*1.1+9.5+t.range(0,12));for(let h=0;h<14&&xe(s,e)<o*1.15+9;h++)s+=a*2;if(le(s,e,o,3)){Me(s,e,o,n,t.pick([0,1,1,2]),44,13);const h=ae[ae.length-1];(!ne||h.height>ne.height)&&(ne=h)}a=t.chance(.75)?-a:a,e+=t.range(24,40)}for(let o=0,n=t.int(4,7);o<n;o++){await r();const s=t.range(6,13),h=t.range(280,qe+30),w=t.sign()*t.range(45,100);xe(w,h)>s*1.15+14&&le(w,h,s,6)&&Me(w,h,s,j(s*t.range(.7,1.4),5,18),t.pick([0,0,1,2]),36,11)}await r()}for(let e=0,a=t.int(5,8);e<a;e++){await r();const o=t.range(7,16),n=t.range(25,250),s=t.sign()*t.range(42,112);xe(s,n)>o*1.15+12&&n>20+o&&le(s,n,o,6)&&Me(s,n,o,j(o*t.range(.7,1.5),6,24),t.pick([0,0,1,2]),40,12)}for(let e=0,a=t.int(12,18);e<a;e++){await r();const o=t.range(1.4,3.6),n=t.range(14,270),s=t.range(-95,95);xe(s,n)>o*1.15+8.5&&le(s,n,o,2)&&Me(s,n,o,o*t.range(.6,1.3),t.pick([1,2]),18,7)}await r();const a0=await ce.buildInSteps(r);await r();const fe=Je();for(let e=0,a=t.int(230,300);e<a;e++){const o=t.chance(.45),n=t.range(-1,1)*(o?u*.95:105),s=n/u,h=-me*s*s-30*Math.pow(s,6)+(o?t.range(11,45):t.range(20,290)),w=t.range(.7,3.2)*(o?.8:1);if(!le(n,h,w,.5))continue;const z=t.int(7,10),m=t.range(0,6.28),k=t.range(.6,1),F=t.range(.16,.4),M=fe.P.length/3,S=[],T=Math.cos(m),A=Math.sin(m),q=fe.v(n,F*.7,h,.04,.5,1);for(let L=0;L<z;L++){const G=L/z*6.2832,g=w*t.range(.8,1.1),P=Math.cos(G)*g,O=Math.sin(G)*g*k,U=n+P*T-O*A,re=h+P*A+O*T;fe.v(n+(U-n)*.86,F,h+(re-h)*.86,.04,.5,1),fe.v(U,0,re,.5,.7,.8)}for(let L=0;L<z;L++){const G=M+1+L*2,g=M+1+(L+1)%z*2;S.push(q,G,g,G,G+1,g+1,G,g+1,g)}fe.patch(S,(L,G,g,P)=>{P[0]=L-n,P[1]=w,P[2]=g-h})}await r();const F0=fe.build();await r();const o0=new p.Color(1,1,1),A0=l[2].clone().lerp(new p.Color("#19b6ff"),t.range(.42,.62)),I0=new p.Color("#0b3dff").lerp(l[4],.25),n0=l[0].clone().lerp(l[4],.5).multiplyScalar(.3),k0=l[2].clone().lerp(o0,.45),r0=t.range(.95,1.15),H={uTime:{value:0},uGlow:{value:r0},uPulse:{value:.5},uWave:{value:0},uCDeep:{value:l[4].clone()},uCTurq:{value:A0},uCGreen:{value:l[2].clone()},uCViolet:{value:l[3].clone().multiplyScalar(t.range(.7,1.3))},uCSnow:{value:l[5].clone()},uCSky:{value:n0},uCrev:{value:I0},uLight:{value:k0.clone().multiplyScalar(.5)}},Ee=()=>p.UniformsUtils.clone(p.UniformsLib.fog),i0=(e,a)=>new p.ShaderMaterial({uniforms:{...H,uBright:{value:e},...Ee()},defines:a,vertexShader:R0,fragmentShader:W0,fog:!0}),Oe=i0(1,{}),s0=i0(.75,{MIRROR_COPY:1}),Le=(e,a,o)=>new p.ShaderMaterial({uniforms:{...H,...o,...Ee()},vertexShader:e,fragmentShader:a,fog:!0,transparent:!0,depthWrite:!1,blending:p.AdditiveBlending,side:p.DoubleSide}),Z=new p.Group;Z.name="glacier-gate";const ye=new p.Group;ye.name="mirror",ye.scale.y=-1;const c0=v.mirror!==!1,l0=v.water!==!1,q0=new p.Mesh(e0,Oe),L0=new p.Mesh(a0,Oe),G0=new p.Mesh(F0,Oe);Z.add(q0,L0,G0),c0&&(ye.add(new p.Mesh(e0,s0),new p.Mesh(a0,s0)),Z.add(ye));const Ue=v.plume??1;if(Ue>0){const o=[],n=[],s=[],h=t.range(0,6.28),w=t.range(.8,1.6),z=t.range(170,220);for(let M=0;M<=120;M++){const S=M/120,T=Ce(-.44*y,.44*y,S),A=T/u,q=34+22*Math.sin(S*Math.PI*2*w+h)+8*i.n2(S*6+f,2.2),L=Ae(T,q)-4,G=z*(.8+.2*i.n2(S*3+_,8.8));for(let g=0;g<=10;g++){const P=g/10;o.push(T,L+P*G,-me*A*A-q),n.push(S,P)}}for(let M=0;M<120;M++)for(let S=0;S<10;S++){const T=M*11+S,A=T+10+1;s.push(T,A,A+1,T,A+1,T+1)}const m=new p.BufferGeometry;m.setAttribute("position",new p.Float32BufferAttribute(o,3)),m.setAttribute("uv",new p.Float32BufferAttribute(n,2)),m.setIndex(s),m.computeBoundingSphere(),m.boundingSphere.radius+=45;const k=Le(g0,d0,{uStrength:{value:.9*Ue}}),F=new p.Mesh(m,k);F.name="aurora-leak",Z.add(F),c0&&ye.add(new p.Mesh(m,Le(g0,d0,{uStrength:{value:.65*Ue}})))}const u0=v.waterRadius??1600;if(l0){const e=new p.ShaderMaterial({uniforms:{uTime:H.uTime,uRadius:{value:u0},uBody:{value:new p.Color("#020a12")},uCSky:{value:n0.clone().lerp(l[2],.06)},uLight:H.uLight,...Ee()},vertexShader:w0,fragmentShader:E0,fog:!0,transparent:!0,depthWrite:!1}),a=new p.Mesh(new p.CircleGeometry(u0,72),e);a.rotation.x=-Math.PI/2,a.renderOrder=2,a.name="water",Z.add(a)}const f0=new p.PlaneGeometry(100,280,1,1);f0.translate(0,-60,0);const be=new p.Mesh(f0,Le(w0,O0,{}));be.rotation.x=-Math.PI/2,be.position.y=.04,be.renderOrder=3,be.name="light-spill",Z.add(be);const je=420,Ge=new Float32Array(je*3),Te=new Float32Array(je*4);for(let e=0;e<je;e++)Ge[e*3]=t.gauss()*5,Ge[e*3+1]=t.range(0,15),Ge[e*3+2]=0,Te[e*4]=t(),Te[e*4+1]=t(),Te[e*4+2]=t(),Te[e*4+3]=t();const Ne=new p.BufferGeometry;Ne.setAttribute("position",new p.BufferAttribute(Ge,3)),Ne.setAttribute("aSeed",new p.BufferAttribute(Te,4));const Be=new p.Points(Ne,Le(U0,j0,{uScale:{value:900}}));Be.frustumCulled=!1,Be.renderOrder=4,Be.name="ice-crystals",Z.add(Be);const ve=[t0,9,se-2.5],$e=[];for(let e=Math.max(330,Math.ceil((qe+40)/25)*25+5);e>80;e-=25)$e.push([te(e),We(e),e]);$e.push([ve[0],9,75],[ve[0],9,40],[ve[0],9,12],ve.slice());const He=ne||{position:[20,0,150],radius:10,height:18},B0={portalSeat:{position:ve.slice(),normal:[0,0,1],radius:7},portalStreak:{position:[ve[0],.06,28],size:[9,60]},flyThrough:$e,viewpoints:{reveal:[te(330),14,330],avenue:[te(170),We(170),170],closePass:[te(He.position[2]),We(He.position[2]),He.position[2]]},caveMouth:{center:[D*12,W*.45,se],width:R*2,height:W},icebergs:ae,waterY:0,glacierTop:z0,frontZ:0};let Ye=.75,v0=1;const V0=(e,a,o)=>V(e,a,o);return{object:Z,radius:150,height:60,center:new p.Vector3(0,16,-40),anchors:B0,ground:!l0,groundY:0,setProgress(e){Ye=j(e,0,1)},setAurora(e,a=1){H.uLight.value.set(e).lerp(o0,.45).multiplyScalar(.5),v0=a},update(e,a){H.uTime.value=a,H.uPulse.value=.5+.35*Math.sin(a*.31)+.15*Math.sin(a*.83+1.3),H.uWave.value=a*.45+Ye*14,H.uGlow.value=r0*v0*(.82+.4*V0(.45,.95,Ye))},dispose(){}}}export{Z0 as buildHero};
