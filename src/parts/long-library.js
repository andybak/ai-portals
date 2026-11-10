import*as s from"three";import{clamp as le,lerp as $}from"../kit/core.js";const z=Math.PI*2,Te=["#f3d9a0","#d6c9ab","#7d5231","#4a2c18","#1f3a5a","#6b1f1f","#ffc45a"],c0=11,P0=1.5,i0=1.1,A0=26,J=19,Ce=22.2,s0={METAL:0,ENAMEL:1,FLOOR:2,STONE:3,RING:4,ZODIAC:5},b0=new s.Vector3,N0=new s.Vector3,ce=new s.Matrix3,j0=new s.Quaternion,B0=new s.Vector3,Ie=new s.Vector3(0,1,0),c=(h,m,a)=>new s.Vector3(h,m,a);function w(h,m,a,g=0,n=1,I=0,G=0){const k=new s.Euler(I,g,G,"YXZ");return new s.Matrix4().compose(c(h,m,a),j0.setFromEuler(k),typeof n=="number"?B0.set(n,n,n):B0.set(n[0],n[1],n[2]))}function ue(h,m){const a=m.clone().sub(h),g=a.length();return j0.setFromUnitVectors(Ie,a.multiplyScalar(1/g)),new s.Matrix4().compose(h.clone().add(m).multiplyScalar(.5),j0,B0.set(1,g,1))}const V={ax:[0,1,0],pv:[0,0,0],sp:0,ph:0,os:0,op:0,of:0};class Se{constructor(m,a=13e4,g=42e4){this.noise=m,this.n=0,this.ni=0,this.P=new Float32Array(a*3),this.N=new Float32Array(a*3),this.C=new Float32Array(a*3),this.Mt=new Float32Array(a*4),this.AX=new Float32Array(a*3),this.PV=new Float32Array(a*3),this.SP=new Float32Array(a*2),this.OR=new Float32Array(a*3),this.I=new Uint32Array(g),this.maxV=a,this.maxI=g}add(m,a,g,n=V){const I=m.attributes.position,G=m.attributes.normal,k=m.index,p=I.count,u=k?k.count:p;if(this.n+p>this.maxV||this.ni+u>this.maxI){m.dispose();return}const l=this.n,{P:B,N:o,C:K,Mt:P,AX:U,PV:e0,SP:j,OR:f}=this,M=g.c,v=g.vary??.1,C=g.vf??.9;ce.getNormalMatrix(a);for(let N=0;N<p;N++){const W=l+N,T=W*3;b0.fromBufferAttribute(I,N).applyMatrix4(a),N0.fromBufferAttribute(G,N).applyMatrix3(ce).normalize(),B[T]=b0.x,B[T+1]=b0.y,B[T+2]=b0.z,o[T]=N0.x,o[T+1]=N0.y,o[T+2]=N0.z;const X=v?1+v*this.noise.n3(b0.x*C,b0.y*C+7.3,b0.z*C):1;K[T]=M.r*X,K[T+1]=M.g*X,K[T+2]=M.b*X,P[W*4]=g.metal??1,P[W*4+1]=g.rough??.3,P[W*4+2]=g.emis??0,P[W*4+3]=g.kind??0,U[T]=n.ax[0],U[T+1]=n.ax[1],U[T+2]=n.ax[2],e0[T]=n.pv[0],e0[T+1]=n.pv[1],e0[T+2]=n.pv[2],j[W*2]=n.sp,j[W*2+1]=n.ph,f[T]=n.os,f[T+1]=n.op,f[T+2]=n.of}if(k){const N=k.array;for(let W=0;W<u;W++)this.I[this.ni+W]=l+N[W]}else for(let N=0;N<u;N++)this.I[this.ni+N]=l+N;this.n+=p,this.ni+=u,m.dispose()}bar(m,a,g,n,I,G=I,k=6,p=!1){this.add(new s.CylinderGeometry(G,I,1,k,1,!p),ue(g,n),m,a)}ball(m,a,g,n,I=12,G=8){this.add(new s.SphereGeometry(n,I,G),w(g.x,g.y,g.z),m,a)}lathe(m,a,g,n,I){this.add(new s.LatheGeometry(g.map(G=>new s.Vector2(G[0],G[1])),n),I,m,a)}finish(){const m=new s.BufferGeometry,a=this.n,g=(n,I)=>new s.BufferAttribute(n.slice(0,a*I),I);return m.setAttribute("position",g(this.P,3)),m.setAttribute("normal",g(this.N,3)),m.setAttribute("color",g(this.C,3)),m.setAttribute("aMat",g(this.Mt,4)),m.setAttribute("aAxis",g(this.AX,3)),m.setAttribute("aPivot",g(this.PV,3)),m.setAttribute("aSpin",g(this.SP,2)),m.setAttribute("aOrbit",g(this.OR,3)),m.setIndex(new s.BufferAttribute(this.I.slice(0,this.ni),1)),m.boundingSphere=new s.Sphere(c(0,13,0),34),m}}async function Pe(h,m,a,g,n,I){const G=[],k=[],p=[],u=(v,C,N,W,T,X,v0)=>{const C0=C[0]-v[0],Q=C[1]-v[1],a0=C[2]-v[2],I0=W[0]-v[0],M0=W[1]-v[1],S0=W[2]-v[2];let h0=Q*S0-a0*M0,d0=a0*I0-C0*S0,f0=C0*M0-Q*I0;const m0=Math.hypot(h0,d0,f0)||1;h0/=m0,d0/=m0,f0/=m0;const Y=G.length/3,x0=h0*T+d0*X+f0*v0<0;x0&&(h0=-h0,d0=-d0,f0=-f0),G.push(...v,...C,...N,...W);for(let k0=0;k0<4;k0++)k.push(h0,d0,f0);x0?p.push(Y,Y+2,Y+1,Y,Y+3,Y+2):p.push(Y,Y+1,Y+2,Y,Y+2,Y+3)},l=z*h/m,B=l*.62,o=h+B*.5,K=h-B*.5,P=K-g,U=[0,.2,.5,.7],e0=[K,o,o,K],j=m*4,f=(v,C,N)=>{const W=Math.floor(v/4)%m,T=v%4,X=(W+U[T])/m*z,v0=C?P:e0[T];return[Math.sin(X)*v0,N,Math.cos(X)*v0]};for(let v=0;v<j;v++){v%128===0&&await I?.();const C=(v+1)%j,N=(Math.floor(v/4)+U[v%4]+.1)/m*z,W=Math.sin(N),T=Math.cos(N);if(u(f(v,1,a),f(v,0,a),f(C,0,a),f(C,1,a),0,1,0),n&&u(f(v,1,0),f(v,0,0),f(C,0,0),f(C,1,0),0,-1,0),u(f(v,0,0),f(C,0,0),f(C,0,a),f(v,0,a),W,0,T),v%2===0){const X=(v+2)%j;u(f(v,1,0),f(X,1,0),f(X,1,a),f(v,1,a),-W,0,-T)}}const M=new s.BufferGeometry;return M.setAttribute("position",new s.Float32BufferAttribute(G,3)),M.setAttribute("normal",new s.Float32BufferAttribute(k,3)),M.setIndex(p),{geo:M,Ri:P,Ra:o}}async function g0(h,m,a,g,n,I,G,k={},p){const u=m.elements,l=[u[4],u[5],u[6]],B=Math.hypot(l[0],l[1],l[2]),o={...k.an||V,ax:l.map(M=>M/B),pv:[u[12],u[13],u[14]],sp:k.speed||0,ph:k.phase||0},K=M=>m.clone().multiply(M),P=k.rimW??Math.max(.05,a*.13),{geo:U,Ri:e0}=await Pe(a,g,n,P,!!k.bottom,p);await p?.(),h.add(U,m,I,o);const j=k.hubR??Math.max(.07,a*.2),f=k.web??"spoke";if(f==="spoke"){const M=k.spokes??(a>1.4?6:a>.7?5:4);for(let v=0;v<M;v++){const C=new s.CylinderGeometry(.5,.82,1,4,1,!0);C.rotateY(Math.PI/4);const N=e0-j*.8,W=Math.max(.05,a*.16);h.add(C,K(new s.Matrix4().makeRotationY(v/M*z).multiply(new s.Matrix4().makeTranslation(0,n*.5,j*.8+N*.5)).multiply(new s.Matrix4().makeRotationX(Math.PI/2)).multiply(new s.Matrix4().makeScale(W,N,n*.75))),I,o)}}else f==="disc"&&h.lathe(I,o,[[e0+.005,n*.78],[e0*.94,n*.78],[e0*.9,n*.5],[e0*.6,n*.5],[e0*.55,n*.72],[j,n*.72]],Math.min(48,Math.max(16,g)),m);return h.lathe(G,o,[[j*1.15,0],[j*1.15,n*.9],[j,n*1],[j*.95,n*1.35],[j*.5,n*1.45],[j*.45,n*1.85],[.001,n*1.9]],10,m),o}const he=`
float h31(vec3 p){ p = fract(p*vec3(0.1031,0.1030,0.0973)); p += dot(p, p.yxz+33.33); return fract((p.x+p.y)*p.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x), mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x), f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x), mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x), f.y), f.z); }
float fbm3(vec3 p){ float s = 0., a = 0.5; for(int i=0;i<4;i++){ s += a*vn3(p); p = p*2.03+vec3(1.7,9.2,3.1); a *= 0.5; } return s; }
`,Ae=`
attribute vec4 aMat; attribute vec3 aAxis; attribute vec3 aPivot; attribute vec2 aSpin; attribute vec3 aOrbit;
uniform float uTime, uOuter; uniform mat4 uInv;
varying vec3 vPos, vN, vCol, vObj, vCam; varying vec4 vMat;
#include <fog_pars_vertex>
void main(){
  vec3 p = position - aPivot, n = normal;
  vObj = p;
  float a1 = aSpin.x*uTime + aSpin.y, c1 = cos(a1), s1 = sin(a1);
  p = p*c1 + cross(aAxis,p)*s1 + aAxis*dot(aAxis,p)*(1.-c1) + aPivot;
  n = n*c1 + cross(aAxis,n)*s1 + aAxis*dot(aAxis,n)*(1.-c1);
  float a2 = mix(aOrbit.x*uTime, uOuter, aOrbit.z) + aOrbit.y, c2 = cos(a2), s2 = sin(a2);
  p = vec3(p.x*c2 + p.z*s2, p.y, p.z*c2 - p.x*s2);
  n = vec3(n.x*c2 + n.z*s2, n.y, n.z*c2 - n.x*s2);
  vPos = p; vN = n; vCol = color; vMat = aMat;
  vCam = (uInv * vec4(cameraPosition, 1.)).xyz;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ze=`
precision highp float;
uniform vec3 uEnvLow, uEnvMid, uEnvHigh, uKeyCol, uKeyDir, uWinCol, uSunCol, uOak, uWalnut, uCream, uGold;
uniform float uKeyI, uWinI, uWinSide, uSunI, uBeamR, uTime;
uniform sampler2D uGlyph;
varying vec3 vPos, vN, vCol, vObj, vCam; varying vec4 vMat;
#include <fog_pars_fragment>
${he}
vec3 envMap(vec3 d, float rough){
  float up = d.y, soft = 0.02 + rough*0.5;
  vec3 c = mix(uEnvLow, uEnvMid, smoothstep(-0.7, 0.0, up));
  c = mix(c, uEnvHigh, smoothstep(0.05, 0.75, up));
  // coffer rows of the dome and book-stack banding of the drum: only crisp in polished metal
  float az = atan(d.z, d.x);
  c *= 1. - (1.-rough)*0.35*smoothstep(0.2,0.4,up)*step(0.5, fract(az*24./6.2832))*step(0.45, fract(up*9.));
  c *= 1. - (1.-rough)*0.25*(1.-smoothstep(0.0,0.25,abs(up)))*step(0.55, fract(az*40./6.2832));
  // oculus
  c += uKeyCol * (uKeyI*2.6/(1.+rough*8.)) * smoothstep(0.984 - soft*0.3, 0.996, up);
  // rank of tall arched windows on one side
  float sx = -d.x*uWinSide, inv = 1./max(0.25, sx);
  float w = abs(fract(d.z*inv*1.5 + 0.5) - 0.5), e = up*inv;
  float win = smoothstep(0.33 + soft*0.3, 0.27, w) * smoothstep(0.16 - soft*0.3, 0.24, e) * smoothstep(1.02 - w*w*2.6 + soft*0.3, 0.92 - w*w*2.6, e);
  win *= mix(1., 0.25 + 0.75*step(0.14, fract(e*4.5))*step(0.16, fract(d.z*inv*4.5 + 0.5)), 1.-rough);   // glazing bars
  c += uWinCol * (uWinI/(1.+rough*3.5)) * win * smoothstep(0.05, 0.35, sx);
  // green-shaded reading lamps low on the shadow side
  float lamp = pow(max(0., sin(az*17.)), 24.) * smoothstep(0.07, 0.0, abs(up + 0.06)) * smoothstep(0.1, 0.4, -sx);
  c += vec3(0.5, 1.2, 0.55) * lamp * (1.-rough);
  return c;
}
void main(){
  vec3 N = normalize(vN); if(!gl_FrontFacing) N = -N;
  vec3 Vv = normalize(vCam - vPos);
  vec3 alb = vCol; float metal = vMat.x, rough = vMat.y, kind = vMat.w, emis = vMat.z;
  float ao = mix(0.62, 1., smoothstep(0.6, 4.5, vPos.y));
  if (kind < 0.5) {                                   // brass, bronze, steel: patina + brushed breakup
    float pat = fbm3(vObj*3.1 + 4.);
    float streak = vn3(vObj*vec3(26., 3., 26.));
    alb *= 0.74 + 0.38*pat; rough = clamp(rough + (pat-0.5)*0.28 + (streak-0.5)*0.1, 0.08, 0.9);
    alb = mix(alb, alb*vec3(0.55,0.5,0.42), smoothstep(0.62, 0.8, pat)*0.6);
  } else if (kind < 1.5) {                            // cloisonne enamel planet; vMat.z = style seed
    vec3 q = normalize(vObj); float sd = emis; emis = 0.;
    float f, wire;
    if (sd > 0.7) {                                   // banded giant: soft turbulent belts, one gold wire per belt
      f = abs(fract(q.y*(1.6+sd*2.4) + 0.3*fbm3(q*vec3(2.,6.,2.)+sd*31.)) - 0.5)*2.;
      wire = 1. - smoothstep(0.02, 0.05, abs(f - 0.5));
      float sw = fbm3(q*vec3(5.,16.,5.) + sd*9.);
      alb = mix(alb*0.5, mix(alb, uCream*0.85, 0.6), smoothstep(0.42, 0.58, f)) * (0.8 + 0.4*sw);
    } else {                                          // continents: three enamel tones fenced by gold wire
      f = fbm3(q*(1.7+sd*2.6) + sd*57.);
      wire = 1. - smoothstep(0.012, 0.03, abs(f - 0.5));
      wire = max(wire, 1. - smoothstep(0.01, 0.024, abs(f - 0.34)));
      vec3 hi = mix(alb, uCream*0.85, 0.6), lo = alb*0.3;
      alb = mix(lo, alb, smoothstep(0.33, 0.35, f)); alb = mix(alb, hi, smoothstep(0.49, 0.51, f));
      alb *= 0.85 + 0.3*vn3(q*14.);
    }
    metal = wire; alb = mix(alb, uGold, wire); rough = mix(0.16, 0.3, wire);
  } else if (kind < 2.5) {                            // plinth: marquetry on treads, veined stone on risers
    float r = length(vObj.xz), th = atan(vObj.z, vObj.x);
    if (N.y > 0.7) {
      float ringI = floor(r/1.72);
      float wedge = step(0.5, fract(th*24./6.2832 + ringI*0.5));
      float grain = vn3(vec3(r*9., th*r*1.2, ringI*7.)) * 0.5 + vn3(vec3(r*38., th*r*3., 1.))*0.5;
      alb = mix(uOak, uWalnut, wedge) * (0.7 + 0.5*grain);
      float star = abs(fract(th*12./6.2832) - 0.5)*2.;
      float sr = mix(3.4, 10.0, pow(1.-star, 1.6));
      float inS = smoothstep(sr, sr-0.06, r) * smoothstep(2.3, 2.36, r);
      alb = mix(alb, mix(uCream*0.62, uWalnut*0.7, step(0.5, fract(th*12./6.2832)))*(0.8+0.3*grain), inS);
      float ln = min(min(abs(r-2.3), abs(r-10.25)), min(abs(r-12.72), abs(r-13.45)));
      ln = min(ln, abs(r - sr) + (1.-step(2.3, r))*9.);
      float brass = 1. - smoothstep(0.035, 0.06, ln);
      alb = mix(alb, uGold*0.9, brass); metal = brass; rough = mix(0.34, 0.3, brass);
      ao *= mix(0.5, 1., smoothstep(1.2, 3.4, r));
    } else {
      float v = fbm3(vObj*vec3(1.3, 5., 1.3));
      alb *= 0.8 + 0.25*v; alb = mix(alb, uWalnut, smoothstep(0.03, 0.0, abs(v-0.5))*0.5); rough = 0.4; metal = 0.;
    }
  } else if (kind < 4.5 && kind > 3.5) {              // planetary ring: grooves and real gaps
    float t = (length(vObj) - 1.95)/1.6;
    float gap = step(abs(t-0.58), 0.035) + step(abs(t-0.2), 0.012) + step(abs(t-0.86), 0.015);
    if (gap > 0.5 || t < 0. || t > 1.) discard;
    float g = vn3(vec3(t*42., 0., 0.));
    alb *= 0.6 + 0.7*g; rough = 0.25 + 0.3*g;
  } else if (kind > 4.5) {                            // zodiac band: gold sigils and ticks in blue enamel
    float r = length(vObj.xz), th = atan(vObj.z, vObj.x);
    float m = texture2D(uGlyph, vec2(th/6.2832, 1. - (r - 10.72)/0.96)).r;
    m = smoothstep(0.35, 0.6, m);
    alb = mix(alb*(0.8+0.4*vn3(vObj*5.)), uGold, m); metal = m; rough = mix(0.14, 0.3, m);
  }
  float nv = max(dot(N, Vv), 0.);
  vec3 F0 = mix(vec3(0.04), alb, metal);
  vec3 F = F0 + (max(vec3(1.-rough), F0) - F0)*pow(1.-nv, 5.);
  vec3 dif = alb*(1.-metal);
  vec3 col = envMap(reflect(-Vv, N), rough)*F*ao;
  vec3 irr = mix(uEnvLow, uEnvHigh, N.y*0.5+0.5)*1.25 + uWinCol*uWinI*0.09*max(0., -N.x*uWinSide*0.8 + 0.2);
  col += dif*irr*ao;
  float sh = mix(500., 9., sqrt(rough));
  // oculus beam (key): full strength inside the shaft, a little everywhere
  float beam = 0.2 + 0.8*(1. - smoothstep(uBeamR, uBeamR*2.1, length(vPos.xz)));
  float nlk = max(dot(N, uKeyDir), 0.);
  float sk = min(pow(max(dot(N, normalize(uKeyDir + Vv)), 0.), sh)*(sh+8.)/25., 7.);
  col += uKeyCol*uKeyI*beam*nlk*(dif + F*sk);
  // the glass sun as a point light
  vec3 Ls = vec3(0., ${c0.toFixed(1)}, 0.) - vPos; float d2 = dot(Ls, Ls); Ls *= inversesqrt(d2);
  float att = uSunI/(1. + d2*0.013);
  float nls = max(dot(N, Ls), 0.);
  float ss = min(pow(max(dot(N, normalize(Ls + Vv)), 0.), sh)*(sh+8.)/25., 7.);
  col += uSunCol*att*(dif*(nls*0.85 + 0.03) + F*ss*nls*0.8 + F0*metal*nls*0.22);
  col += alb*emis;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Re=`
varying vec3 vO, vNw, vW;
#include <fog_pars_vertex>
void main(){
  vO = position; vNw = normalize(mat3(modelMatrix)*normal);
  vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Oe=`
precision highp float;
uniform vec3 uCol, uDeep; uniform float uI, uTime;
varying vec3 vO, vNw, vW;
#include <fog_pars_fragment>
${he}
void main(){
  vec3 N = normalize(vNw), Vv = normalize(cameraPosition - vW);
  float mu = max(dot(N, Vv), 0.);
  vec3 q = vO*1.5; float t = uTime*0.07;
  float f = fbm3(q + vec3(0., -t, t*0.6) + 1.4*fbm3(q*0.8 - t*0.5));
  float cell = smoothstep(0.32, 0.72, f);
  float pulse = 0.93 + 0.07*sin(uTime*0.9);
  vec3 c = mix(uDeep*0.62, uCol, cell) * (0.42 + 0.5*mu);        // convection seen through thick amber glass
  c += uCol*pow(mu, 2.5)*0.55;                                   // inner glow: the globe is a lamp, lit from within
  c += vec3(1., 0.8, 0.5)*pow(mu, 7.)*0.55;                      // hot heart
  c += mix(uDeep, uCol, 0.35)*pow(1.-mu, 3.)*0.45;               // glowing rim
  float seam = smoothstep(0.02, 0.0, abs(fract(atan(vO.z, vO.x)*6./6.2832) - 0.5) - 0.48);
  c *= 1. - 0.35*seam;                                           // blown-glass gore seams
  gl_FragColor = vec4(c*uI*pulse, 1.);
  #include <fog_fragment>
}`,Ge=`
uniform float uSize; varying vec2 vUv; varying float vDepth;
void main(){ vUv = uv*2.-1.; vec4 mv = modelViewMatrix*vec4(0.,0.,0.,1.); mv.xy += position.xy*uSize; vDepth = -mv.z; gl_Position = projectionMatrix*mv; }`,Ne=`
precision highp float;
uniform vec3 uCol; uniform float uI, uTime, uFogK; varying vec2 vUv; varying float vDepth;
void main(){
  float r = length(vUv); if (r > 1.) discard;
  float a = atan(vUv.y, vUv.x);
  float g = (1./(1.+34.*r*r) - 1./35.)*0.6*(1.-r*r);
  g += pow(1.-r, 4.)*0.06*(0.5+0.5*sin(a*12. + uTime*0.15))*(0.5+0.5*sin(a*5. - uTime*0.1));
  g *= 0.94 + 0.06*sin(uTime*0.9);
  gl_FragColor = vec4(uCol*uI*g*exp(-vDepth*uFogK), 1.);
}`;function Ee(h){const g=document.createElement("canvas");g.width=4096,g.height=64;const n=g.getContext("2d");n.fillStyle="#000",n.fillRect(0,0,4096,64),n.strokeStyle="#fff",n.fillStyle="#fff",n.lineCap="round",n.fillRect(0,0,4096,4),n.fillRect(0,60,4096,4);for(let k=0;k<360;k++){const p=k/360*4096,u=k%30===0?0:k%10===0?15:k%5===0?11:7;u&&n.fillRect(p-1.2,60-u,2.6,u),k%10===5&&(n.beginPath(),n.arc(p,9,1.8,0,z),n.fill())}const I=4096/12;for(let k=0;k<12;k++){const p=(k+.5)*I,u=26,l=19;n.fillRect(k*I-1.5,0,3,64);for(const K of[-I*.2,I*.2,-I*.36,I*.36]){const P=Math.abs(K)>I*.3?6:11,U=p+K;n.beginPath(),n.moveTo(U,u-P),n.quadraticCurveTo(U,u,U+P,u),n.quadraticCurveTo(U,u,U,u+P),n.quadraticCurveTo(U,u,U-P,u),n.quadraticCurveTo(U,u,U,u-P),n.fill()}n.lineWidth=4.4;const B=2+(h()<.5?1:0),o=new Set;for(let K=0;K<B;K++){let P=h.int(0,7);for(;o.has(P);)P=(P+1)%8;o.add(P),n.beginPath(),P===0?n.arc(p,u,l*.55,0,z):P===1?(n.moveTo(p,u-l),n.lineTo(p,u+l),n.moveTo(p-l*.6,u+l*.45),n.lineTo(p+l*.6,u+l*.45)):P===2?(n.arc(p-l*.55,u-l*.5,l*.55,0,Math.PI),n.moveTo(p+l*1.1,u-l*.5),n.arc(p+l*.55,u-l*.5,l*.55,0,Math.PI)):P===3?n.arc(p+l*.35,u,l*.9,Math.PI*.6,Math.PI*1.4):P===4?(n.moveTo(p-l,u+l*.9),n.quadraticCurveTo(p-l*.5,u+l*.3,p,u+l*.9),n.quadraticCurveTo(p+l*.5,u+l*1.5,p+l,u+l*.9)):P===5?(n.moveTo(p-l*.8,u+l*.7),n.lineTo(p+l*.8,u-l*.8),n.lineTo(p+l*.15,u-l*.8),n.moveTo(p+l*.8,u-l*.8),n.lineTo(p+l*.8,u-l*.15)):P===6?(n.moveTo(p-l*.8,u-l*.9),n.lineTo(p+l*.8,u-l*.9),n.moveTo(p-l*.5,u-l*.9),n.lineTo(p-l*.5,u+l*.6),n.moveTo(p+l*.5,u-l*.9),n.lineTo(p+l*.5,u+l*.6)):(n.moveTo(p,u-l),n.lineTo(p+l*.8,u+l*.6),n.lineTo(p-l*.8,u+l*.6),n.closePath()),n.stroke()}}const G=new s.CanvasTexture(g);return G.wrapS=s.RepeatWrapping,G.colorSpace=s.NoColorSpace,G.anisotropy=4,G.generateMipmaps=!0,G}async function Le(h,m={}){const a=h.rng.fork("orrery"),g=h.noise,n=(m.palette&&m.palette.length>=7?m.palette:Te).map(e=>new s.Color(e)),[I,G,k,p,u,l,B]=n,o=new Se(g);await h.yield?.();const K=a.range(0,1),P=B.clone().lerp(new s.Color(1,.86-K*.08,.56-K*.1),a.range(.4,.6)),U=P.clone().multiply(new s.Color(.62,.5,.4)),e0=u.clone().lerp(new s.Color(.55,.6,.68),.55),j=new s.Color(.95,.5,.3).lerp(l,.15),f={c:P,metal:1,rough:.24,kind:s0.METAL,vary:0},M={...f,rough:.14},v={c:U,metal:1,rough:.46,kind:s0.METAL,vary:0},C={c:e0,metal:1,rough:.3,kind:s0.METAL,vary:0},N={c:j,metal:1,rough:.3,kind:s0.METAL,vary:0},W=[f,f,f,v,N,C],T=a.sign();if(o.lathe({c:G.clone().multiplyScalar(.62),metal:0,rough:.4,kind:s0.FLOOR,vary:.06},V,[[14.9,0],[14.9,.3],[14.84,.36],[14.3,.36],[14.3,.68],[14.24,.74],[13.7,.74],[13.7,1.04],[13.64,i0],[2.2,i0],[.01,i0]],96,w(0,0,0)),await h.yield?.(),o.lathe(f,V,[[14.93,.27],[14.96,.31],[14.93,.35],[14.84,.365]],96,w(0,0,0)),o.lathe(f,V,[[13.73,1],[13.76,1.05],[13.72,1.1],[13.62,1.105]],96,w(0,0,0)),m.rail!==!1)for(let r=0;r<4;r++){await h.yield?.();const y=r*z/4+.17,R=(r+1)*z/4-.17;for(const[q,b]of[[1.05,.065],[.16,.04]]){const E=new s.TorusGeometry(15.9,b,6,40,R-y);E.rotateX(Math.PI/2),o.add(E,w(0,q,0,R-Math.PI/2),b>.05?M:f)}for(let q=0;q<=17;q++){const b=$(y,R,q/17),E=Math.sin(b)*15.9,t0=Math.cos(b)*15.9;q===0||q===17?o.lathe(v,V,[[.17,0],[.17,.1],[.11,.16],[.1,.95],[.15,1.02],[.15,1.12],[.06,1.18],[.13,1.3],[.1,1.42],[.001,1.47]],8,w(E,0,t0)):o.lathe(f,V,[[.05,.16],[.03,.3],[.075,.52],[.03,.78],[.045,1]],6,w(E,0,t0))}}await h.yield();const X=192,v0=12,C0=.02*T,Q=i0+.2,a0=.3,I0=a.range(0,z),M0=await g0(o,w(0,Q,0),v0,X,a0,f,v,{speed:C0,phase:I0,web:"none",rimW:1.55,hubR:.01,bottom:!1},h.yield);await h.yield?.();{const e=new s.RingGeometry(10.72,11.68,192,1);e.rotateX(-Math.PI/2),o.add(e,w(0,Q+a0+.012,0),{c:u.clone().lerp(new s.Color(.02,.09,.3),.5),metal:0,rough:.14,kind:s0.ZODIAC,vary:0},M0);for(const t of[10.7,11.7,10.36]){await h.yield?.();const i=new s.TorusGeometry(t,.035,4,128);i.rotateX(Math.PI/2),o.add(i,w(0,Q+a0+.01,0),M,M0)}await h.yield?.();for(let t=0;t<12;t++){const i=t/12*z+.004;o.lathe(M,M0,[[.12,0],[.11,.04],[.07,.1],[.001,.12]],8,w(Math.cos(i)*10.53,Q+a0,Math.sin(i)*10.53))}}const S0=(e,t,i,r)=>{const y=(t*(r-e)/z%1+1)%1;return r+Math.PI-z*(.2-y)/i},h0=a.int(3,4),d0=a.range(0,z);for(let e=0;e<h0;e++){const t=d0+(e+a.range(-.15,.15))*z/h0,i=12,r=v0*i/X,y=v0+r+.012,R=Math.sin(t)*y,q=Math.cos(t)*y,b=-C0*X/i;await g0(o,w(R,Q,q),r,i,a0,N,C,{speed:b,phase:S0(I0,X,i,t),web:"disc",hubR:.2},h.yield),o.lathe(v,V,[[.5,i0],[.46,i0+.1],[.3,i0+.17]],12,w(R,0,q)),await g0(o,w(R,Q+a0+.14,q),.42,14,.1,f,C,{speed:b,phase:a.range(0,6),web:"spoke",spokes:3,hubR:.1,bottom:!0},h.yield)}await h.yield?.();for(let e=0;e<8;e++){const t=(e+.5)/8*z,i=Math.sin(t)*10.12,r=Math.cos(t)*10.12;o.lathe(C,V,[[.16,i0],[.1,i0+.06],[.07,Q+.02],[.2,Q+.06],[.2,Q+a0-.04],[.07,Q+a0],[.07,Q+a0+.1],[.001,Q+a0+.14]],10,w(i,0,r))}await h.yield();const f0=.3,m0=i0+.1,Y=[],x0=e=>{const t=Math.max(8,Math.round(z*e/f0));return[t*f0/z,t]},[k0,H0]=x0(2.05),V0=.22*-T,X0=a.range(0,z);await g0(o,w(0,m0,0),k0,H0,.2,f,v,{speed:V0,phase:X0,web:"disc",hubR:1.3},h.yield),Y.push([0,0,k0+.12]);const Y0=a.int(5,7),Z0=a.range(0,z);for(let e=0;e<Y0;e++){let t=0,i=0,r=k0,y=H0,R=V0,q=X0,b=Z0+(e+a.range(-.18,.18))*z/Y0;for(let E=0;E<9;E++){let t0=!1,S,_,L,n0;for(let A=0;A<7&&!t0;A++){const D=Math.hypot(t,i);[L,n0]=x0(a.range(.55,D>4.5?1.9:1.25)*(A>3?.7:1));const O=E?Math.atan2(t,i)+a.range(-.85,.85):b,Z=r+L+.006;S=t+Math.sin(O)*Z,_=i+Math.cos(O)*Z,t0=Math.hypot(S,_)+L<10;for(const l0 of Y)Math.hypot(S-l0[0],_-l0[1])<L+l0[2]+.1&&!(l0[0]===t&&l0[1]===i)&&(t0=!1);t0&&(b=O)}if(!t0)break;const r0=-R*y/n0,u0=S0(q,y,n0,b),d=a.pick(W),x=a.range(.13,.2);if(await g0(o,w(S,m0,_),L,n0,x,d,d===C?f:C,{speed:r0,phase:u0,web:L>.8&&a.chance(.75)?"spoke":"disc",bottom:!1},h.yield),Y.push([S,_,L+.1]),o.lathe(v,V,[[L*.3+.1,i0],[L*.26+.08,i0+.07],[L*.2,m0]],10,w(S,0,_)),L>.75&&a.chance(.7)){const[A,D]=x0(L*a.range(.3,.5)),O=a.pick(W);await g0(o,w(S,m0+x+.07,_),A,D,.14,O,C,{speed:r0,phase:a.range(0,6),web:"disc",bottom:!0},h.yield),a.chance(.4)&&o.lathe(M,{...V,pv:[S,0,_],sp:r0},[[.05,.3],[.05,.52],[.12,.6],[.09,.7],[.001,.75]],8,w(S,m0+x,_))}t=S,i=_,r=L,y=n0,R=r0,q=u0}}await h.yield();const z0=6,$0=[],E0=[[1.3,i0],[1.3,1.5],[1.34,1.56],[1.22,1.66],[1,1.7],[.84,1.95],[.72,2.4],[.66,2.6]],Q0=e=>$(.58,.3,le((e-2.6)/6.6,0,1));for(let e=z0-1;e>=0;e--){const t=8.55-e*1.04;$0[e]=t;const i=Q0(t);E0.push([i,t-.36],[i+.13,t-.3],[i+.2,t-.13],[i+.2,t+.13],[i+.13,t+.3],[i,t+.36],[i-.04,t+.5])}E0.push([.3,9.07],[.42,9.12],[.72,9.3],[.96,9.56],[.97,9.64],[.9,9.66],[.62,9.5],[.2,9.44]),o.lathe(f,V,E0,24,w(0,0,0)),await h.yield?.();for(let e=0;e<3;e++){const t=e/3*z+Z0,i=new s.Matrix4().makeRotationY(t).multiply(new s.Matrix4().makeTranslation(0,2.9,.78)).multiply(new s.Matrix4().makeRotationX(Math.PI/2));await g0(o,i,.62,18,.12,e===1?N:f,C,{speed:.9*T*(e%2?-1:1),phase:e,web:"spoke",spokes:4,bottom:!0},h.yield)}const J0=a.int(5,8);for(let e=0;e<J0;e++){await h.yield?.();const t=e/J0*z,i=[];for(let r=0;r<=6;r++){const y=$(-1.18,-.2,r/6),R=P0+.07+(r===0?.04:0);i.push(c(Math.sin(t)*Math.cos(y)*R,c0+Math.sin(y)*R,Math.cos(t)*Math.cos(y)*R))}o.add(new s.TubeGeometry(new s.CatmullRomCurve3(i),10,.055,5,!1),w(0,0,0),f),o.ball(M,V,i[6],.1,8,6)}await h.yield?.();{const e=new s.TorusGeometry(P0+.05,.05,6,48);e.rotateX(Math.PI/2),o.add(e,w(0,c0,0),M);const t=a.range(0,Math.PI);for(let i=0;i<2;i++){const r=new s.TorusGeometry(P0+.05,.035,5,48);o.add(r,w(0,c0,0,t+i*Math.PI/2),f)}o.lathe(f,V,[[.5,-.1],[.44,0],[.2,.1],[.16,.5],[.24,.62],[.2,.9]],14,w(0,c0+P0,0))}await h.yield();const p0=(e,t=.13,i=.36)=>{const r={};return e.getHSL(r),new s.Color().setHSL(r.h,Math.min(1,r.s*1.1+.05),le(r.l*2.2,t,i))},ee=a.shuffle([p0(u),p0(l),p0(new s.Color("#2f6b4a")),I.clone().multiplyScalar(.7),p0(B.clone().multiplyScalar(.6)),p0(u.clone().lerp(new s.Color("#3f9a96"),.6)),p0(l.clone().lerp(k,.5)),p0(u.clone().lerp(l,.5))]),te={c:G.clone().multiplyScalar(.8),metal:0,rough:.45,kind:s0.METAL,vary:.2,vf:6};let ae=.2;for(let e=0;e<z0;e++){await h.yield?.();const t=3.1+e*1.42+a.range(-.12,.12)*(e<z0-1?1:0),i=$0[e];let r=e===0?a.range(.3,.42):a.range(.32,.8);r=Math.min(r,1.3-ae),e===z0-1&&(r=Math.min(r,11-t)),ae=r;const y=c0+(e%2?-1:1)*a.range(.3,.5),R=T*.16*Math.pow(3.1/t,1.5),q=a.range(0,z),b={...V,os:R,op:q},E=Q0(i)+.16,t0=e>=2&&a.chance(.7),S=a.chance(.25)?v:f;if(t0){for(const O of[-1,1])o.bar(S,b,c(O*.2,i,E-.1),c(O*.07,i,t),.05,.035,6);const D=Math.round((t-E)/.55);for(let O=1;O<D;O++){const Z=O/D,l0=$(E,t,Z),K0=$(.2,.07,Z);o.bar(C,b,c(-K0,i,l0),c(K0,i,l0),.022,.022,4),O%2&&o.bar(S,b,c(-K0,i,l0),c($(.2,.07,(O+1)/D),i,$(E,t,(O+1)/D)),.018,.018,4)}}else{const x=new s.CylinderGeometry(.5,1,1,4,1,!0);x.rotateY(Math.PI/4),o.add(x,ue(c(0,i,E-.1),c(0,i,t)).multiply(new s.Matrix4().makeScale(.2,1,.09)),S,b);for(let A=1;A<=3;A++)o.ball(M,b,c(0,i,$(E,t,A/4)),.09-A*.012,8,6)}const _=a.range(1.1,2.1);o.bar(S,b,c(0,i,-E+.1),c(0,i,-_),.05,.035,6),a.chance(.5)?o.ball(v,b,c(0,i,-_-.12),a.range(.2,.3),12,8):o.lathe(v,b,[[.001,-.09],[.26,-.07],[.32,0],[.26,.07],[.001,.09]],12,w(0,i,-_-.2)),o.ball(M,b,c(0,i,t),.13,10,8),await g0(o,w(0,i-.2,t),.3,12,.07,N,C,{an:b,speed:-R*9,phase:e,web:"disc",bottom:!0,hubR:.07},h.yield);const L=y-r-.14;o.bar(f,b,c(0,i,t),c(0,L,t),.065,.04,6),o.bar(S,b,c(0,i,t-.7),c(0,Math.min(L-.1,i+.7),t),.03,.022,5);for(const x of[.3,.7])o.lathe(M,b,[[.04,-.07],[.085,-.03],[.085,.03],[.04,.07]],8,w(0,$(i,L,x),t));await h.yield?.();const n0=a.range(.15,.5)*a.sign(),r0=[Math.sin(n0),Math.cos(n0),0],u0=r+.13;o.add(new s.TorusGeometry(u0,.028,5,28),w(0,y,t),M,b);for(const x of[-1,1])o.ball(C,b,c(r0[0]*u0*x,y+r0[1]*u0*x,t),.05,6,5);o.add(new s.SphereGeometry(r,28,18),w(0,y,t,0,1,0,-n0),{c:ee[e],metal:0,rough:.16,emis:a(),kind:s0.ENAMEL,vary:0},{...b,ax:r0,pv:[0,y,t],sp:a.range(.25,.6)*a.sign()});const d=e>0&&r>.4&&r<.72?a.int(0,2):0;for(let x=0;x<d;x++){const A={...b,ax:[0,1,0],pv:[0,y,t],sp:a.range(.5,1.1)*T,ph:a.range(0,z)},D=r+.32+x*.14,O=L+.04-x*.06,Z=a.range(.08,.13);o.bar(f,A,c(0,O,t),c(D,O,t),.016,.016,4),o.bar(f,A,c(D,O,t),c(D,y-Z,t),.016,.012,4),o.ball(te,A,c(D,y,t),Z,10,8)}}await h.yield();const F={...V,of:1},T0=27,o0=Ce+.5;o.lathe(f,F,[[.2,13.2],[.2,14],[.3,14.1],[.3,14.3],[.19,14.45],[.17,20.6],[.3,20.8],[.52,21],[.56,21.2],[.56,22.9],[.5,23.1],[.3,23.25],[.16,23.5],[.13,26.2],[.22,26.3],[.22,26.5],[.1,26.62],[.08,T0+.5],[.001,T0+1.1]],14,w(0,0,0));for(let e=0;e<12;e++){const t=e/12*z,i=Math.sin(t)*.6,r=Math.cos(t)*.6;o.bar(C,F,c(i,21.22,r),c(i,22.88,r),.035,.035,5)}for(const e of[21.22,22.05,22.88]){const t=new s.TorusGeometry(.6,.05,5,24);t.rotateX(Math.PI/2),o.add(t,w(0,e,0),M,F)}await h.yield?.();{const t=a.range(0,3);for(let r=0;r<3;r++)o.add(new s.TorusGeometry(.78-r*.02,.03,5,32),w(0,25.2,0,t+r*1.05,1,r===2?Math.PI/2:0,r===1?.41:0),r?f:M,F);o.ball(M,F,c(0,T0+.2,0),.2,12,8);const i=a.int(6,10);for(let r=0;r<i;r++){const y=r/i*z;o.bar(M,F,c(Math.sin(y)*.2,T0+.2,Math.cos(y)*.2),c(Math.sin(y)*.75,T0+.2,Math.cos(y)*.75),.05,.004,4)}}await h.yield?.();{const t=a.range(2,2.5),i={...V,sp:.07*-T,ph:a.range(0,z)},r=.41,y=new s.TorusGeometry(t,.05,6,64);y.rotateX(Math.PI/2),o.add(y,w(0,17.3,0,0,[1,2.2,1]),M,i);const R=new s.TorusGeometry(t-.07,.04,6,64);R.rotateX(Math.PI/2),o.add(R,w(0,17.3,0,0,[1,2.6,1],r,0),N,i),o.add(new s.TorusGeometry(t+.06,.04,6,64),w(0,17.3,0),f,i);for(let b=0;b<4;b++){const E=b/4*z+Math.PI/4;o.bar(f,i,c(Math.sin(E)*.18,17.3,Math.cos(E)*.18),c(Math.sin(E)*t,17.3,Math.cos(E)*t),.04,.025,5),o.ball(M,i,c(Math.sin(E)*t,17.3,Math.cos(E)*t),.085,8,6)}o.lathe(M,i,[[.18,-.3],[.3,-.2],[.34,0],[.3,.2],[.18,.3]],12,w(0,17.3,0));for(const b of[-1,1])o.lathe(M,i,[[.17,-.12],[.26,-.05],[.26,.05],[.17,.12]],10,w(0,17.3+b*(t+.06),0));const q={...i,pv:[0,17.3,0],ax:[0,Math.cos(r),Math.sin(r)],sp:.4*T};o.ball({c:p0(l),metal:0,rough:.2,emis:.3,kind:s0.ENAMEL,vary:0},q,c(t-.07,17.3,0),.16,12,8)}await h.yield?.();const fe=[a.range(.3,.48)*a.sign(),a.range(.1,.35)*a.sign()],me=[1.5,a.range(1.15,1.35)],pe=[I.clone().lerp(B,.5).multiplyScalar(.7),p0(a.chance(.5)?u.clone().lerp(new s.Color("#3f9a96"),.35):l.clone().lerp(B,.25))];for(let e=0;e<2;e++){await h.yield?.();const t=e?-1:1,i=15,r=.5,y=A0,R=[],q=[],b=d=>$(1.7,.34,d),E=d=>$(.46,.12,d);for(let d=0;d<=i;d++){const x=d/i;R.push([E(x),o0,t*$(r,y,x)]);const A=Math.min(1,(d+.5)/i);q.push([0,o0-b(A),t*$(r,y,A)])}for(const d of[-1,1])o.bar(f,F,c(d*E(0),o0,t*r),c(d*E(1),o0,t*y),.06,.035,5);o.bar(f,F,c(0,o0-b(0),t*r),c(0,o0-b(1),t*y),.065,.035,5);for(let d=0;d<i;d++){d%5===0&&await h.yield?.();const x=c(...q[d]),A=$(.034,.02,d/i);for(const D of[-1,1])o.bar(v,F,x,c(D*R[d][0],o0,R[d][2]),A,A,4),o.bar(v,F,x,c(D*R[d+1][0],o0,R[d+1][2]),A,A,4);o.bar(C,F,c(-R[d][0],o0,R[d][2]),c(R[d][0],o0,R[d][2]),A,A,4),d%3===1&&o.ball(M,F,x,.075,6,5)}for(const d of[.36,.68,.965]){const x=c(0,o0+.03,t*$(r,y,d)),A=c(0,T0-.1-d*.5,t*.1);o.bar(C,F,A,x,.026,.026,4),o.bar(M,F,A.clone().lerp(x,.82),A.clone().lerp(x,.86),.055,.055,6,!0)}await h.yield?.();const t0=me[e],S=t*A0,_=t0+.22,L=fe[e],n0=[0,Math.cos(L),Math.sin(L)],r0=[0,J,S];o.ball(M,F,c(0,o0-.2,S),.2,12,8),o.bar(f,F,c(0,o0-.2,S),c(0,J+_,S),.07,.05,6),o.lathe(M,F,[[.05,-.1],[.13,-.05],[.13,.05],[.05,.1]],8,w(0,J+_+.25,S)),o.add(new s.TorusGeometry(_,.05,6,40),w(0,J,S,Math.PI/2),f,F);for(const d of[-1,1])o.ball(C,F,c(0,J+n0[1]*_*d,S+n0[2]*_*d),.09,8,6);await h.yield?.();const u0={...F,ax:n0,pv:r0,sp:a.range(.12,.22)*T};if(o.add(new s.SphereGeometry(t0,44,28),w(0,J,S,0,1,L,0),{c:pe[e],metal:0,rough:.18,emis:e?a.range(.05,.6):a.range(.74,.98),kind:s0.ENAMEL,vary:0},u0),await h.yield?.(),e===0)for(const d of[-1,1]){const x=new s.RingGeometry(1.95,3.55,96,1);x.rotateX(d*Math.PI/2),o.add(x,w(0,J,S,0,1,L,0).multiply(new s.Matrix4().makeTranslation(0,-d*.012,0)),{c:P.clone().lerp(new s.Color(1,.95,.8),.35),metal:.45,rough:.3,kind:s0.RING,vary:0},{...u0,sp:u0.sp*.3})}else{const d={...F,pv:r0,sp:.3*-T},x=t0+a.range(.85,1.15),A=a.int(3,5),D=new s.TorusGeometry(x,.022,4,64);D.rotateX(Math.PI/2),o.add(D,w(0,J,S),f,d);for(let O=0;O<3;O++){const Z=O/3*z;o.add(new s.TubeGeometry(new s.QuadraticBezierCurve3(c(0,J-_-.12,S),c(Math.sin(Z)*x,J-_-.1,S+Math.cos(Z)*x),c(Math.sin(Z)*x,J,S+Math.cos(Z)*x)),10,.022,4,!1),w(0,0,0),f,d)}o.lathe(M,d,[[.06,-.24],[.12,-.18],[.12,-.06],[.05,0]],8,w(0,J-_,S));for(let O=0;O<A;O++){const Z=(O+a.range(.1,.9))/A*z,l0=a.range(.13,.27);o.ball(O%2?te:{c:ee[6+(O>>1)%2],metal:0,rough:.2,emis:a()*.5,kind:s0.METAL,vary:.25,vf:5},d,c(Math.sin(Z)*x,J,S+Math.cos(Z)*x),l0,14,10)}}}await h.yield();const w0=new s.Group;w0.name="orrery";const oe=Ee(a.fork("glyph"));await h.yield?.();const W0=m.sunIntensity??5,ne=B.clone().lerp(new s.Color(1,.5,.12),.5),ve=ne.clone().lerp(new s.Color(1,.75,.4),.5),H=s.UniformsUtils.merge([s.UniformsLib.fog,{uTime:{value:0},uOuter:{value:0},uInv:{value:new s.Matrix4},uEnvLow:{value:k.clone().multiplyScalar(.62)},uEnvMid:{value:k.clone().lerp(G,.25).multiplyScalar(.85)},uEnvHigh:{value:G.clone().multiplyScalar(.55)},uKeyCol:{value:I.clone()},uKeyDir:{value:c(-.22,1,.08).normalize()},uKeyI:{value:2},uBeamR:{value:4.5},uWinCol:{value:B.clone().lerp(I,.45)},uWinI:{value:3},uWinSide:{value:1},uSunCol:{value:ve},uSunI:{value:W0*.55},uOak:{value:k.clone()},uWalnut:{value:p.clone()},uCream:{value:G.clone()},uGold:{value:P.clone()},uGlyph:{value:null}}]);H.uGlyph.value=oe;const de=new s.ShaderMaterial({uniforms:H,vertexShader:Ae,fragmentShader:ze,vertexColors:!0,fog:!0}),_0=new s.Mesh(o.finish(),de);_0.frustumCulled=!1,_0.name="orrery-works",w0.add(_0),await h.yield?.();const we=o.ni/3,ge=o.n,L0=s.UniformsUtils.merge([s.UniformsLib.fog,{uCol:{value:ne.clone()},uDeep:{value:new s.Color(1,.27,.03)},uI:{value:W0},uTime:{value:0}}]),F0=new s.Mesh(new s.SphereGeometry(P0,48,32),new s.ShaderMaterial({uniforms:L0,vertexShader:Re,fragmentShader:Oe,fog:!0}));F0.position.set(0,c0,0),F0.rotation.y=a.range(0,z),w0.add(F0);const R0={uCol:{value:new s.Color(1,.42,.1)},uI:{value:W0*.34},uTime:{value:0},uSize:{value:10.5},uFogK:{value:0}},O0=new s.Mesh(new s.PlaneGeometry(2,2),new s.ShaderMaterial({uniforms:R0,vertexShader:Ge,fragmentShader:Ne,transparent:!0,depthWrite:!1,blending:s.AdditiveBlending}));O0.position.set(0,c0,0),O0.frustumCulled=!1,O0.renderOrder=5,w0.add(O0);let ie=m.speed??1,q0=null,U0=0;const ye=m.passAt??.68,be=m.outerSweep??2.4,Me=a.range(0,z),se=Math.PI/6,re=Math.PI*5/6,xe=Math.PI/2,G0=18,y0=c0,D0=[[0,14,64],[.5,13,46],[4,12,30]];for(let e=0;e<=6;e++){const t=$(se,re,e/6);D0.push([Math.sin(t)*G0,y0,Math.cos(t)*G0])}D0.push([4,y0,-30],[.5,y0,-46],[0,y0,-64]);const ke=new s.Matrix4;return{object:w0,radius:30,height:27.5,center:c(0,c0,0),ground:!0,groundY:0,triangles:we,vertices:ge,anchors:{sun:c(0,c0,0),lane:{radius:G0,height:y0,fromAz:se,toAz:re},flyThrough:D0.map(e=>c(e[0],e[1],e[2])),portalSeat:{position:c(0,6.5,-117),facing:c(0,0,1),shape:"arch",width:9,height:13},viewpoints:{hall:c(0,6,150),enter:c(0,14,44),orbitMid:c(G0,y0,0),leave:c(0,y0,-46)},oculus:{base:c(0,0,0),top:c(0,48,0),radius:4},doveSpiral:{center:c(0,15,0),radius:7,top:44},giants:{radius:A0,height:J}},setProgress(e){q0=e},setSpeed(e){ie=e},setSun(e){L0.uI.value=e,R0.uI.value=e*.34,H.uSunI.value=e*.55},setWindow(e){H.uWinI.value=e},setLighting(e={}){const t=(i,r)=>{r!==void 0&&i.value.set(r)};t(H.uKeyCol,e.keyColor),t(H.uWinCol,e.windowColor),t(H.uEnvLow,e.envLow),t(H.uEnvMid,e.envMid),t(H.uEnvHigh,e.envHigh),e.keyIntensity!==void 0&&(H.uKeyI.value=e.keyIntensity),e.windowIntensity!==void 0&&(H.uWinI.value=e.windowIntensity),e.windowSide!==void 0&&(H.uWinSide.value=e.windowSide),e.beamRadius!==void 0&&(H.uBeamR.value=e.beamRadius),e.keyDir&&H.uKeyDir.value.set(e.keyDir[0],e.keyDir[1],e.keyDir[2]).normalize()},giantPosition(e,t=new s.Vector3){const i=U0+(e?Math.PI:0);return t.set(Math.sin(i)*A0,J,Math.cos(i)*A0)},update(e,t){const i=t*ie;H.uTime.value=i,L0.uTime.value=t,R0.uTime.value=t,U0=q0===null?Me+i*.045*T:xe+be*(q0-ye),H.uOuter.value=U0,w0.updateWorldMatrix(!0,!1),H.uInv.value.copy(ke.copy(w0.matrixWorld).invert());let r=w0;for(;r.parent;)r=r.parent;const y=r.fog;R0.uFogK.value=y?y.isFogExp2?y.density*.8:1/Math.max(1,y.far):0},dispose(){oe.dispose()}}}export{Le as buildHero};
