import*as s from"three";const J=32,k=30,K=27.3,h=1.5,m0=27,oe=3.7,ae=12*Math.PI/180,N0=1.3,re=62,ue=["#0E1630","#1E6A7A","#4A2F7A","#FFB59A","#7FF0CF","#FF7EB6","#F6FBFF"];class D0{constructor(){this.p=[],this.n=[],this.c=[],this.g=[],this.f=[],this.col=[.7,.7,.7],this.glow=[0,0,0],this.fx=0}v(m,l,T,G,z,B,N=this.fx){this.p.push(m,l,T),this.n.push(G,z,B),this.c.push(this.col[0],this.col[1],this.col[2]),this.g.push(this.glow[0],this.glow[1],this.glow[2]),this.f.push(N)}quad(m,l,T,G,z,B,N,A){const _=l[0]-m[0],x=l[1]-m[1],I=l[2]-m[2],$=G[0]-m[0],y=G[1]-m[1],M=G[2]-m[2];let i=x*M-I*y,f=I*$-_*M,u=_*y-x*$;const b=Math.hypot(i,f,u)||1;i/=b,f/=b,u/=b,this.v(m[0],m[1],m[2],i,f,u,z),this.v(l[0],l[1],l[2],i,f,u,B),this.v(T[0],T[1],T[2],i,f,u,N),this.v(m[0],m[1],m[2],i,f,u,z),this.v(T[0],T[1],T[2],i,f,u,N),this.v(G[0],G[1],G[2],i,f,u,A)}beam(m,l,T,G,z={}){const B=z.ref||[0,0,1],N=z.taper??1;let A=l[0]-m[0],_=l[1]-m[1],x=l[2]-m[2];const I=Math.hypot(A,_,x)||1;A/=I,_/=I,x/=I;let $=B[0],y=B[1],M=B[2];Math.abs(A*$+_*y+x*M)>.96&&($=B[1],y=B[2],M=B[0]);let i=_*M-x*y,f=x*$-A*M,u=A*y-_*$;const b=Math.hypot(i,f,u)||1;i/=b,f/=b,u/=b;const Y=f*x-u*_,H=u*A-i*x,Z=i*_-f*A,L=(j,D,s0,O)=>[j[0]+(i*D*T+Y*s0*G)*.5*O,j[1]+(f*D*T+H*s0*G)*.5*O,j[2]+(u*D*T+Z*s0*G)*.5*O],R=[L(m,-1,-1,1),L(m,1,-1,1),L(m,1,1,1),L(m,-1,1,1)],P=[L(l,-1,-1,N),L(l,1,-1,N),L(l,1,1,N),L(l,-1,1,N)];for(let j=0;j<4;j++){const D=(j+1)%4;this.quad(R[D],R[j],P[j],P[D])}z.caps&&(this.quad(R[0],R[1],R[2],R[3]),this.quad(P[3],P[2],P[1],P[0]))}tube(m,l,T=6,G={}){const z=m.length,B=!!G.closed,N=[],A=G.up||[0,0,1];for(let x=0;x<z;x++){const I=m[B?(x-1+z)%z:Math.max(0,x-1)],$=m[B?(x+1)%z:Math.min(z-1,x+1)],y=m[x];let M=$[0]-I[0],i=$[1]-I[1],f=$[2]-I[2];const u=Math.hypot(M,i,f)||1;M/=u,i/=u,f/=u;let b=A[0],Y=A[1],H=A[2];Math.abs(M*b+i*Y+f*H)>.96&&(b=1,Y=0,H=0);let Z=i*H-f*Y,L=f*b-M*H,R=M*Y-i*b;const P=Math.hypot(Z,L,R)||1;Z/=P,L/=P,R/=P;const j=L*f-R*i,D=R*M-Z*f,s0=Z*i-L*M,O=typeof l=="function"?l(x/Math.max(1,z-1)):l,M0=[];for(let h0=0;h0<T;h0++){const o0=h0/T*Math.PI*2,F=Math.cos(o0),e0=Math.sin(o0),u0=Z*F+j*e0,z0=L*F+D*e0,r0=R*F+s0*e0;M0.push([y[0]+u0*O,y[1]+z0*O,y[2]+r0*O,u0,z0,r0])}N.push(M0)}const _=B?z:z-1;for(let x=0;x<_;x++){const I=N[x],$=N[(x+1)%z];for(let y=0;y<T;y++){const M=(y+1)%T,i=I[y],f=I[M],u=$[M],b=$[y];this.v(i[0],i[1],i[2],i[3],i[4],i[5]),this.v(u[0],u[1],u[2],u[3],u[4],u[5]),this.v(f[0],f[1],f[2],f[3],f[4],f[5]),this.v(i[0],i[1],i[2],i[3],i[4],i[5]),this.v(b[0],b[1],b[2],b[3],b[4],b[5]),this.v(u[0],u[1],u[2],u[3],u[4],u[5])}}}get tris(){return this.p.length/9}build(){const m=new s.BufferGeometry;return m.setAttribute("position",new s.Float32BufferAttribute(this.p,3)),m.setAttribute("normal",new s.Float32BufferAttribute(this.n,3)),m.setAttribute("aCol",new s.Float32BufferAttribute(this.c,3)),m.setAttribute("aGlow",new s.Float32BufferAttribute(this.g,3)),m.setAttribute("aFx",new s.Float32BufferAttribute(this.f,1)),m}}const ne=`
float h31(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yzx+33.33); return fract((p.x+p.y)*p.z); }
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
`,fe=`
attribute vec3 aCol; attribute vec3 aGlow; attribute float aFx;
#ifdef GONDOLA
attribute vec3 iA; attribute float aTint; attribute float aEm;
uniform vec3 uPal[3];
varying float vEm; varying vec3 vLamp; varying vec2 vUv;
#endif
uniform float uTime, uRot, uMirror;
varying vec3 vCol, vGlow, vN, vW;
#include <fog_pars_vertex>
void main(){
  vec3 p = position, n = normal; vec3 col = aCol;
#ifdef GONDOLA
  float a = iA.x + uRot; float top = smoothstep(0.5, 1.0, sin(a));
  float th = 0.05*sin(uTime*1.1 + iA.z) + top*0.21*sin(uTime*1.9 + iA.z*1.7);
  float c = cos(th), s = sin(th); mat2 m = mat2(c, s, -s, c);
  p.xy = m*p.xy; n.xy = m*n.xy;
  p += vec3(cos(a)*${m0.toFixed(2)}, ${J.toFixed(1)} + sin(a)*${m0.toFixed(2)}, ${oe.toFixed(2)});
  vec3 pal = iA.y < 0.5 ? uPal[0] : (iA.y < 1.5 ? uPal[1] : uPal[2]);
  col = mix(col, col*pal*1.25, aTint); vEm = aEm; vLamp = pal; vUv = uv;
#endif
  p.z += aFx*(sin(uTime*5.3 + p.x*2.4) + 0.5*sin(uTime*8.1 + p.x*4.7 + p.y))*0.42;
  vec4 w = modelMatrix*vec4(p, 1.0);
  float dep = max(0.0, -w.y);
  w.x += uMirror*sin(w.y*0.42 + uTime*1.6 + w.z*0.3)*0.02*min(dep, 22.0);
  w.z += uMirror*sin(w.y*0.31 + uTime*1.1)*0.012*min(dep, 22.0);
  vW = w.xyz; vN = normalize(mat3(modelMatrix)*n); vCol = col; vGlow = aGlow;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,me=`
uniform vec3 uSky, uGround, uRim, uRimDir; uniform float uTime, uFlash, uGlowK, uDim, uMirror, uSwell;
varying vec3 vCol, vGlow, vN, vW;
#ifdef GONDOLA
varying float vEm; varying vec3 vLamp; varying vec2 vUv;
#endif
#include <fog_pars_fragment>
${ne}
void main(){
  vec3 N = normalize(vN + vec3(1e-5));
  float ny = mix(N.y, -N.y, uMirror);
  vec3 amb = mix(uGround, uSky, ny*0.5 + 0.5);
  float rim = max(dot(N, uRimDir), 0.0); rim *= rim;
  float wear = vn3(vW*2.1)*0.6 + vn3(vW*7.3)*0.4;
  vec3 light = amb*(1.0 + uFlash*3.0) + uRim*rim + vGlow*uGlowK*(1.0 + uSwell*0.6);
  vec3 col = vCol*(0.80 + 0.22*wear)*light;
#ifdef GONDOLA
  float mull = smoothstep(0.05, 0.10, 0.5 - abs(fract(vUv.x*8.0) - 0.5));
  float band = smoothstep(0.0, 0.12, vUv.y)*(1.0 - smoothstep(0.88, 1.0, vUv.y));
  float people = 0.75 + 0.25*step(0.45, vn3(vec3(vUv.x*16.0, vUv.y*2.0, vLamp.g*9.0)));
  col = mix(col, vLamp*(0.3 + 3.4*mull*band*people), vEm);
#endif
  float dep = max(0.0, -vW.y);
  col *= mix(1.0, uDim*exp(-dep*0.008), uMirror);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,he=`
float gSwing(float a, float ph, float t){ float top = smoothstep(0.5, 1.0, sin(a)); return 0.05*sin(t*1.1 + ph) + top*0.21*sin(t*1.9 + ph*1.7); }
`,de=`
attribute vec3 iPos; attribute vec4 iDat; attribute vec2 iCh;
uniform float uTime, uRot, uMirror, uChaseT, uK, uSwell, uLamp; uniform vec2 uRes, uSea; uniform vec3 uPal[3];
varying vec2 vQ; varying vec3 vC; varying float vFog;
${he}
void main(){
  vec3 c = iPos; float mode = iDat.z, ang = iDat.y;
  if (mode > 0.5 && mode < 1.5) { float cr = cos(uRot), sr = sin(uRot); c.xy = mat2(cr, sr, -sr, cr)*c.xy; c.y += ${J.toFixed(1)}; ang += uRot; }
  else if (mode > 1.5) { float a = iDat.y + uRot; float th = gSwing(a, iCh.y, uTime); float ct = cos(th), st = sin(th);
    c.xy = mat2(ct, st, -st, ct)*c.xy; c += vec3(cos(a)*${m0.toFixed(2)}, ${J.toFixed(1)} + sin(a)*${m0.toFixed(2)}, ${oe.toFixed(2)}); }
  float b;
  if (iCh.x < 0.5) {
    float f = fract(uK*ang*0.15915494 - uChaseT);
    if (iDat.x < 0.5) b = 0.13 + 1.5*f*f*f;
    else if (iDat.x < 1.5) { float f2 = fract(f + 0.36); b = 0.13 + 1.5*f2*f2*f2; }
    else b = 0.42 + 0.05*sin(uTime*3.0 + ang*40.0);
    b *= 1.0 + uSwell*0.8;
  } else if (iCh.x < 1.5) { b = 0.72 + 0.28*sin(uTime*(1.6 + fract(iCh.y*7.31)*2.5) + iCh.y*43.0); }
  else { float f = fract(iCh.y - uTime*0.55); b = 0.2 + 1.3*f*f*f; }
  vec3 pal = iDat.x < 0.5 ? uPal[0] : (iDat.x < 1.5 ? uPal[1] : uPal[2]);
  vec4 w = modelMatrix*vec4(c, 1.0);
  float dep = max(0.0, -w.y);
  w.x += uMirror*sin(w.y*0.42 + uTime*1.6 + w.z*0.3)*0.02*min(dep, 22.0);
  w.z += uMirror*sin(w.y*0.31 + uTime*1.1)*0.012*min(dep, 22.0);
  // where the mirrored bulb is seen in the SEA (not the sand) it is laid on the water as a long wobbling streak
  float sz = iDat.w, tall = 1.0;
  if (uMirror > 0.5) {
    float f = clamp((cameraPosition.y - uSea.x)/max(cameraPosition.y - w.y, 0.05), 0.0, 1.0);
    vec3 sp = cameraPosition + (w.xyz - cameraPosition)*f;
    if (sp.z > uSea.y && cameraPosition.y > uSea.x + 0.3) {
      sz *= f; tall = 3.6; b *= 0.12;
      w.xyz = sp + vec3(sin(uTime*2.1 + sp.z*0.9 + iPos.x*5.0 + iPos.y*3.0)*sz*1.6, 0.45, 0.0);
    }
  }
  vec4 mv = viewMatrix*w;
  float d = max(-mv.z, 0.1);
  float px = sz*projectionMatrix[1][1]*uRes.y*0.5/d;
  float s = max(px, 1.7);
  b *= clamp(px*px/(s*s), 0.34, 1.0);
  b *= mix(1.0, 0.85*exp(-dep*0.007), uMirror)*uLamp;
  mv.xy += position.xy*vec2(1.0, tall)*sz*(s/max(px, 1e-3));
  vQ = position.xy; vC = pal*b;
  vFog = d;
  gl_Position = projectionMatrix*mv;
}`,pe=`
varying vec2 vQ; varying vec3 vC; varying float vFog;
#ifdef USE_FOG
uniform float fogDensity; uniform float fogNear; uniform float fogFar;
#endif
void main(){
  float r = length(vQ);
  float core = 1.0 - smoothstep(0.30, 0.46, r);
  float halo = exp(-r*r*6.5)*(1.0 - smoothstep(0.75, 1.0, r));
  vec3 col = mix(vC, vec3(dot(vC, vec3(0.34))), 0.22)*core*5.5 + vC*halo*0.75;
#ifdef USE_FOG
  #ifdef FOG_EXP2
  col *= exp(-fogDensity*fogDensity*vFog*vFog);
  #else
  col *= 1.0 - smoothstep(fogNear, fogFar, vFog);
  #endif
#endif
  gl_FragColor = vec4(col, 1.0);
}`,ie=`
uniform vec3 uZenith, uHorizon, uPeach;
vec3 skyRef(vec3 dir){ // dir: view ray, pointing down into the mirror
  float e = clamp(-dir.y, 0.0, 1.0);
  vec3 c = mix(uHorizon, uZenith, smoothstep(0.0, 0.55, e));
  float west = smoothstep(0.1, 0.9, normalize(dir.xz + vec2(1e-5)).y);   // +Z is west: the peach band lies only there
  c += uPeach*west*exp(-e*9.0)*0.55;
  return c*0.3;
}`,se=`
varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz; vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ve=`
varying vec3 vW;
${ie}
#include <fog_pars_fragment>
void main(){ vec3 dir = normalize(vW - cameraPosition + vec3(1e-5)); gl_FragColor = vec4(skyRef(dir), 1.0);
  #include <fog_fragment>
}`,ge=`
varying vec3 vW;
uniform vec3 uSand, uSandDry, uGlowA, uGlowB, uOrigin; uniform float uTime, uZone, uSwell, uFlash, uReflMin; uniform vec2 uShore;
${ie}
${ne}
#include <fog_pars_fragment>
void main(){
  vec3 dv = vW - cameraPosition; float dist = length(dv); vec3 dir = dv/max(dist, 1e-3);
  float cosT = clamp(-dir.y, 0.0, 1.0);
  float fres = (1.0 - cosT)*(1.0 - cosT);                       // the mirror strengthens toward grazing
  float n0 = vn3(vec3(vW.xz*0.009, 7.7)), n1 = vn3(vec3(vW.xz*0.035, 1.3)), n2 = vn3(vec3(vW.xz*0.21, 4.1));
  // sand bars: long meandering ripple marks parallel to the shore, faded by their own footprint on screen
  float ph = vW.z*1.7 + n1*9.0 + n2*2.2 + sin(vW.x*0.23)*1.5, fw = fwidth(ph);
  float rip = sin(ph), lod = 1.0 - smoothstep(1.0, 2.8, fw);
  float ridge = smoothstep(0.15, 0.9, rip)*lod;
  float ph2 = vW.z*9.0 + n2*5.0 + sin(vW.x*1.1)*1.2, fw2 = fwidth(ph2);
  float fine = (0.5 + 0.5*sin(ph2))*(1.0 - smoothstep(0.7, 2.0, fw2));
  // dry and pale under the promenade, glassy toward the tide line
  float shore = vW.z + (n1 - 0.5)*24.0 + (n0 - 0.5)*44.0;
  float dry = 1.0 - smoothstep(uShore.x, uShore.x + 42.0, shore);
  // tide pools, and the film of water that wanders over the flats
  float pool = smoothstep(0.55, 0.6, n1*0.72 + n0*0.38 + 0.015*sin(uTime*0.4 + vW.x*0.1))*(1.0 - dry);
  float film = smoothstep(0.30, 0.62, n1 + 0.25*n2);
  // wrack lines: dark kelp left in curving bands by each tide
  float wr = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float zc = uShore.x + 24.0 + fi*39.0 + (vn3(vec3(vW.x*0.017, fi*3.7, 2.0)) - 0.5)*34.0 + sin(vW.x*0.05 + fi*2.0)*4.0;
    wr += (1.0 - smoothstep(0.2, 1.5 + fi*0.5, abs(vW.z - zc)))*smoothstep(0.3, 0.55, vn3(vec3(vW.x*0.45, vW.z*1.3, fi)));
  }
  wr = min(wr, 1.0)*(1.0 - pool);
  float wet = mix(0.78, 1.0, film)*(1.0 - 0.5*ridge)*(1.0 - 0.92*dry);
  wet = mix(wet, 1.0, pool);
  float refl = clamp(mix(uReflMin, 0.97, fres)*wet, 0.0, 0.97)*(1.0 - 0.85*wr);
  vec3 base = mix(uSand, uSandDry, dry)*(0.5 + 0.42*n2 + 0.4*ridge + 0.16*fine)*(1.0 - 0.35*pool);
  base = mix(base, uSand*0.1 + vec3(0.004, 0.006, 0.003), wr*0.9);
  // bulb light pooled on the sand under the ring
  vec2 q = vW.xz - uOrigin.xz; float lp = exp(-(q.x*q.x/900.0 + q.y*q.y/160.0));   // relative to the wheel, wherever the world stands it
  float sw = 0.5 + 0.5*sin(q.x*0.11 + uTime*0.7);
  base += mix(uGlowA, uGlowB, sw)*lp*(0.035 + 0.05*ridge)*(1.0 + uSwell);
  base *= 1.0 + uFlash*2.0;
  float zone = 1.0 - smoothstep(uZone*0.62, uZone, length(q));
  float a = 1.0 - refl*zone;
  vec3 rd = normalize(dir + vec3(0.0, -0.07*rip*lod - 0.03*(fine - 0.5), 1e-5));    // the ripples tilt what the film reflects
  vec3 col = (base*(1.0 - refl) + skyRef(rd)*refl*(1.0 - zone))/max(a, 0.02);
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`;function we(q){const m=[],l=[],T=[],G=[],z=[],B=[],N=[],A=[],x=[[-.42,.1,0,0,0],[-.52,.34,0,0,0],[-.6,.42,1,0,0],[-.8,.98,1,0,0],[-.93,1.22,1,0,0],[-1,1.22,0,0,0],[-1.03,1.1,0,0,0],[-1.03,1.08,0,1,0],[-1.98,1.13,0,1,1],[-1.98,1.2,0,0,0],[-2.1,1.22,0,0,0],[-2.13,1.17,1,0,0],[-2.62,1.05,1,0,0],[-2.92,.74,1,0,0],[-3.02,.3,0,0,0],[-3.02,0,0,0,0]],I=i=>{const f=[];for(let u=0;u<=16;u++){const b=u/16*Math.PI*2+Math.PI/4,Y=Math.cos(b),H=Math.sin(b),Z=.62,L=Math.sign(Y)*Math.pow(Math.abs(Y),Z)*i[1],R=Math.sign(H)*Math.pow(Math.abs(H),Z)*i[1]*.92;f.push([L,i[0],R,u/16])}return f},$=(i,f,u,b,Y,H,Z)=>{m.push(i[0],i[1],i[2]),l.push(f[0],f[1],f[2]),T.push(u,u,u*1.02),G.push(b),z.push(Y),B.push(H,Z),N.push(0,0,0),A.push(0)};for(let i=0;i<x.length-1;i++){const f=x[i],u=x[i+1];if(f[0]===u[0]&&f[1]===u[1])continue;const b=I(f),Y=I(u),H=Math.min(f[2],u[2]),Z=Math.min(f[3],u[3]),L=u[0]-f[0],R=u[1]-f[1],P=Math.hypot(L,R)||1,j=Z?.1:H?.66:.72;for(let D=0;D<16;D++){const s0=o0=>{const F=Math.hypot(o0[0],o0[2])||1,e0=-L/P;return[o0[0]/F*e0,R/P,o0[2]/F*e0]},O=[(b[D][0]+b[D+1][0])*.5,0,(b[D][2]+b[D+1][2])*.5],M0=f[1]<.2||u[1]<.2?[0,Math.sign(R)||-1,0]:null,h0=[[b[D],f[4]],[b[D+1],f[4]],[Y[D+1],u[4]],[Y[D],u[4]]];for(const o0 of[0,1,2,0,2,3]){const F=h0[o0][0],e0=Math.hypot(F[0],F[2])>.05?F:O;$(F,M0||s0(e0),j,H,Z,F[3],h0[o0][1])}}}const y=new D0;y.col=[.7,.7,.72],y.beam([0,0,-1.9],[0,0,.55],.2,.2,{caps:!0,ref:[0,1,0]}),y.beam([0,.02,-.5],[0,-.5,-.5],.12,.22,{ref:[0,0,1]}),y.beam([0,.02,.5],[0,-.5,.5],.12,.22,{ref:[0,0,1]}),y.beam([-.5,-.52,0],[.5,-.52,0],.16,.12,{caps:!0,ref:[0,1,0]});for(let i=0;i<y.p.length/3;i++)m.push(y.p[i*3],y.p[i*3+1],y.p[i*3+2]),l.push(y.n[i*3],y.n[i*3+1],y.n[i*3+2]),T.push(.7,.7,.72),G.push(0),z.push(0),B.push(0,0),N.push(0,0,0),A.push(0);const M=new s.InstancedBufferGeometry;return M.setAttribute("position",new s.Float32BufferAttribute(m,3)),M.setAttribute("normal",new s.Float32BufferAttribute(l,3)),M.setAttribute("aCol",new s.Float32BufferAttribute(T,3)),M.setAttribute("aGlow",new s.Float32BufferAttribute(N,3)),M.setAttribute("aFx",new s.Float32BufferAttribute(A,1)),M.setAttribute("aTint",new s.Float32BufferAttribute(G,1)),M.setAttribute("aEm",new s.Float32BufferAttribute(z,1)),M.setAttribute("uv",new s.Float32BufferAttribute(B,2)),M}async function be(q,m={}){const l=q.rng,T=(m.palette&&m.palette.length>=7?m.palette:ue).map(e=>new s.Color(e)),[G,z,B,N,A,_,x]=T,I=m.reflection!==!1,$=m.sand!==!1,y=m.track!==!1,M=m.sandRadius??520,i=m.mirrorRadius??168,f=m.mirrorDepth??96,b=(l.chance(.5)?1:-1)*Math.PI*2/(m.turnPeriod??78),Y=l.chance(.5)?1:-1,H=l.int(2,4),Z=l.range(0,6.28),L=l.int(0,2),R=l.chance(.5)?_:A;let P=l.range(0,6.28),j=0,D=0,s0=0;const O=new s.Group;O.name="pier-comet-hero";const M0=[A,_,x].map(e=>e.clone()),h0=z.clone().multiplyScalar(.6).add(B.clone().multiplyScalar(.4)).multiplyScalar(1.3).addScalar(.1),o0=G.clone().multiplyScalar(2).add(A.clone().multiplyScalar(.035)).add(_.clone().multiplyScalar(.035)),F={uTime:{value:0},uRot:{value:P},uChaseT:{value:0},uK:{value:H},uSwell:{value:0},uFlash:{value:0},uSky:{value:h0},uGround:{value:o0},uRim:{value:N.clone().multiplyScalar(.2)},uRimDir:{value:new s.Vector3(0,.18,1).normalize()},uGlowK:{value:1},uPal:{value:M0},uRes:{value:new s.Vector2(800,450)},uOrigin:{value:new s.Vector3},uSea:{value:new s.Vector2(0,1e9)},uLamp:{value:1},uReflMin:{value:.6},uShore:{value:new s.Vector2(-75,150)},uSandDry:{value:G.clone().multiplyScalar(3.2).addScalar(.02)},uZenith:{value:B.clone().multiplyScalar(.55).add(G.clone().multiplyScalar(.6))},uHorizon:{value:z.clone().multiplyScalar(.75).add(B.clone().multiplyScalar(.25))},uPeach:{value:N.clone()}},e0=[],u0=(e,t)=>{const o=new s.ShaderMaterial({uniforms:{...s.UniformsUtils.clone(s.UniformsLib.fog),...F,uMirror:{value:e?1:0},uDim:{value:.85}},vertexShader:fe,fragmentShader:me,fog:!0,defines:t?{GONDOLA:1}:{},side:t?s.DoubleSide:s.FrontSide});return e0.push(o),o},z0=e=>{const t=new s.ShaderMaterial({uniforms:{...s.UniformsUtils.clone(s.UniformsLib.fog),...F,uMirror:{value:e?1:0}},vertexShader:de,fragmentShader:pe,fog:!0,transparent:!0,depthWrite:!1,blending:s.AdditiveBlending});return e0.push(t),t},r0=(e,t=1)=>{const o=l.range(.64,.74)*t;e.col=[o*l.range(.97,1),o,o*l.range(.99,1.03)]},n0=(e,t)=>[(A.r*(1-e)+_.r*e)*t,(A.g*(1-e)+_.g*e)*t,(A.b*(1-e)+_.b*e)*t],Q=Math.PI*2,g=(e,t,o)=>[e*Math.cos(t),e*Math.sin(t),o],i0=[],t0=(e,t,o,a,d,n,p,v,w)=>i0.push(e,t,o,a,d,n,p,v,w),W=new D0,I0=144,L0=72;for(const[e,t,o]of[[k,h,.19],[k,-h,.19],[K,h,.17],[K,-h,.17]]){const a=[];for(let d=0;d<I0;d++)a.push(g(e,d/I0*Q,t));r0(W,1.04),W.glow=n0(.5,e===k?.34:.26),W.tube(a,o,6,{closed:!0,up:[0,0,1]})}for(const e of[-h,h])for(let t=0;t<96;t++){const o=t/96*Q,a=(t+1)/96*Q;r0(W,.82),W.glow=n0(.5+.5*Math.sin(o*3+Z),.3),W.beam(g(k+.33,o,e),g(k+.33,a,e),.62,.12,{ref:[0,0,1]})}await q.yield?.();for(let e=0;e<L0;e++){const t=e/L0*Q,o=(e+1)/L0*Q,a=e%2===0,d=.5+.5*Math.sin(t*3+Z),n=(p,v,w,c,C)=>{r0(W),W.glow=n0(d,c),W.beam(p,v,w,w,{ref:C})};n(g(K,t,h),g(k,t,h),.16,.34,[0,0,1]),n(g(K,t,-h),g(k,t,-h),.16,.16,[0,0,1]),n(g(k,t,-h),g(k,t,h),.14,.24,[1,0,0]),n(g(K,t,-h),g(K,t,h),.14,.2,[1,0,0]),n(g(a?K:k,t,h),g(a?k:K,o,h),.12,.32,[0,0,1]),n(g(a?k:K,t,-h),g(a?K:k,o,-h),.12,.14,[0,0,1]),n(g(k,t,a?-h:h),g(k,o,a?h:-h),.11,.22,[1,0,0]),n(g(K,t,a?h:-h),g(K,o,a?-h:h),.11,.18,[1,0,0]),r0(W,1.05),W.glow=n0(d,.4),W.beam(g(k-.75,t,h+.1),g(k+.1,t,h+.1),.7,.06,{ref:[0,0,1],taper:1.5,caps:!0}),W.beam(g(K+.75,t,h+.1),g(K-.1,t,h+.1),.7,.06,{ref:[0,0,1],taper:1.5,caps:!0})}await q.yield?.();const v0=36;for(let e=0;e<v0;e++){const t=e/v0*Q,o=.045;r0(W,.95),W.glow=n0(e%2,.3),W.beam(g(K,t-o,h),g(m0,t,h+.45),.16,.16,{ref:[0,0,1]}),W.beam(g(K,t+o,h),g(m0,t,h+.45),.16,.16,{ref:[0,0,1]}),W.beam(g(K,t,-h),g(m0,t,h+.2),.13,.13,{ref:[1,0,0]}),W.beam(g(m0,t,h+.1),g(m0,t,h+.75),.46,.46,{ref:[1,0,0],caps:!0})}for(let e=0;e<240;e++){const t=e/240*Q;t0(...g(k+.05,t,h+.42),e%2,t,1,.48,0,0),t0(...g(k+.05,t+Q/480,-h-.42),(e+1)%2,t+Q/480,1,.42,0,0),t0(...g(K-.05,t+Q/720,h+.42),2,t+Q/720,1,.36,0,0)}await q.yield?.();const O0=W.build();await q.yield?.();const F0=new s.Group;F0.position.y=J,F0.rotation.z=P;const q0=new s.Mesh(O0,u0(!1,!1));q0.frustumCulled=!1,F0.add(q0),O.add(F0);const G0=we(l),T0=new Float32Array(v0*3);for(let e=0;e<v0;e++){const t=e/v0*Q,o=l.range(0,6.28),a=(e+L)%3;T0[e*3]=t,T0[e*3+1]=a,T0[e*3+2]=o,t0(0,-3.12,0,a,t,2,.42,1,o),t0(0,-.36,.95,2,t,2,.24,1,o)}await q.yield?.(),G0.setAttribute("iA",new s.InstancedBufferAttribute(T0,3)),G0.instanceCount=v0;const $0=new s.Mesh(G0,u0(!1,!0));$0.frustumCulled=!1,O.add($0);const r=new D0,C0=()=>{const e=l.range(.2,.26);r.col=[e,e*1.02,e*1.08],r.glow=n0(l(),.12)},W0=()=>{const e=l.range(.3,.36);r.col=[e*.95,e,e*1.1],r.glow=n0(l(),.55)},S=(e,t=.3)=>{r0(r),r.glow=n0(e??l(),t)},le=(e,t,o)=>{W0();const a=[[e,t,o-.42],[e,t,o-.3],[e,t,o+.3],[e,t,o+.42]];r.tube(a,d=>d<.2||d>.8?.62:.5,10,{up:[0,1,0]}),r.beam([e,t,o-.43],[e,t,o+.43],.5,.5,{caps:!0,ref:[0,1,0]})},V0=(e,t)=>{const o=k+.39+.5,a=[-Math.sin(e),Math.cos(e)],d=.05,n=[o*Math.cos(e),J+o*Math.sin(e)],p=[Math.cos(e),Math.sin(e)];for(const w of[-1,1])for(const c of[-h,h])le(o*Math.cos(e+w*d),J+o*Math.sin(e+w*d),c);for(const w of[-h-.75,h+.75,0])S(.5,.45),r.beam([n[0]-a[0]*2.4+p[0]*.25,n[1]-a[1]*2.4+p[1]*.25,w],[n[0]+a[0]*2.4+p[0]*.25,n[1]+a[1]*2.4+p[1]*.25,w],.24,.7,{caps:!0,ref:[0,0,1]});for(const w of[-1,1]){S(.5,.4);const c=o*Math.cos(e+w*d),C=J+o*Math.sin(e+w*d);r.beam([c,C,-h-.9],[c,C,h+.9],.2,.2,{caps:!0,ref:[0,1,0]})}W0(),r.beam([n[0]+p[0]*.95,n[1]+p[1]*.95,-.7],[n[0]+p[0]*.95,n[1]+p[1]*.95,.7],1.5,.9,{caps:!0,ref:[a[0],a[1],0]}),t0(n[0]+p[0]*.2,n[1]+p[1]*.2,h+1.05,2,0,0,.3,1,l.range(0,9));const v=[n[0]+p[0]*.7,n[1]+p[1]*.7];for(const w of t)S(l(),.3),r.beam([v[0]+(w[0]-v[0])*.02,v[1],w[2]*.55],w,.3,.3,{ref:[0,0,1],taper:1.25});return v};for(const e of[-1,1]){const t=-Math.PI/2+e*.49,o=Math.cos(t)*30.9,a=[[o-2.6,.5,-2.9],[o-2.6,.5,2.9],[o+2.6,.5,-2.9],[o+2.6,.5,2.9]],d=V0(t,a);for(const n of[-2.9,2.9])S(l(),.3),r.beam([o-2.6,.5,n],[o+2.6,2.6,n*.75],.14,.14),r.beam([o+2.6,.5,n],[o-2.6,2.6,n*.75],.14,.14);for(const n of[o-2.6,o+2.6])S(l(),.3),r.beam([n,2.2,-2.2],[n,2.2,2.2],.16,.16,{ref:[0,1,0]}),r.beam([n,.6,-2.9],[n,2.2,2.2],.12,.12,{ref:[1,0,0]});for(const n of a)C0(),r.beam([n[0],-.2,n[2]],[n[0],.55,n[2]],1.5,1.5,{taper:.72,caps:!0,ref:[0,0,1]})}for(const e of[-2.9,2.9]){S(.5,.5),r.beam([-34,.62,e],[19,.62,e],.3,.42,{caps:!0,ref:[0,0,1]});for(let t=-32;t<18;t+=3.4)S(l(),.4),r.beam([t,.62,e],[t+1.7,.62,e*.1],.12,.12,{ref:[0,1,0]}),r.beam([t+1.7,.62,e*.1],[t+3.4,.62,e],.12,.12,{ref:[0,1,0]})}await q.yield?.();const X=47,U=-34.2,d0=(e,t,o)=>{const a=1-.58*(o/X);return[U+e*2.2*a,o,t*2.3*a]};for(const e of[-1,1])for(const t of[-1,1]){const o=[];for(let a=0;a<=X;a+=X/12)o.push(d0(e,t,a));S(.5,.45),r.tube(o,a=>.26-.1*a,6,{up:[1,0,0]}),C0(),r.beam([U+e*2.2,-.2,t*2.3],[U+e*2.2,.7,t*2.3],1.3,1.3,{taper:.7,caps:!0})}await q.yield?.();const B0=12;for(let e=0;e<B0;e++){const t=e/B0*X,o=(e+1)/B0*X,a=e%2?1:-1,d=e/B0,n=[[[-1,-1],[1,-1]],[[1,-1],[1,1]],[[1,1],[-1,1]],[[-1,1],[-1,-1]]];for(const[p,v]of n)S(d,.38),r.beam(d0(p[0],p[1],o),d0(v[0],v[1],o),.13,.13,{ref:[0,1,0]}),r.beam(a>0?d0(p[0],p[1],t):d0(v[0],v[1],t),a>0?d0(v[0],v[1],o):d0(p[0],p[1],o),.11,.11,{ref:[0,1,0]});for(let p=0;p<3;p++){const v=t+(p+.5)*(o-t)/3;for(const w of[-1,1]){const c=d0(w,1,v);t0(c[0],c[1],c[2]+.3,(e*3+p+(w>0?1:0))%3,0,0,.3,1,l.range(0,9))}}}await q.yield?.();for(const e of[-1,1]){const t=Math.PI+e*.225,o=J+30.9*Math.sin(t),a=1-.58*(o/X);V0(t,[[U+2.2*a,o+2.6,2.3*a],[U+2.2*a,o+2.6,-2.3*a],[U+2.2*a,o-2.6,2.3*a],[U+2.2*a,o-2.6,-2.3*a]])}S(.5,.5),r.beam([U,X-.1,0],[U,X+.35,0],2.9,2.9,{caps:!0,taper:1.12});for(let e=0;e<8;e++){const t=e/8*Q;S(.5,.5),r.beam([U+Math.cos(t)*1.5,X+.3,Math.sin(t)*1.5],[U+Math.cos(t)*1.6,X+1.4,Math.sin(t)*1.6],.09,.09),t0(U+Math.cos(t)*1.65,X+1.5,Math.sin(t)*1.65,e%3,0,0,.3,1,l.range(0,9))}S(.5,.5),r.tube([[U,X,0],[U,X+5,0],[U,X+10.5,0]],e=>.16-.1*e,6,{up:[1,0,0]}),t0(U,X+10.8,0,2,0,0,.55,1,3.3);{r.col=[R.r*.9+.08,R.g*.9+.08,R.b*.9+.08],r.glow=[.5,.5,.55];const e=X+9.6,t=5.2,o=10;for(let a=0;a<o;a++){const d=a/o,n=(a+1)/o,p=.85*(1-d*.9),v=.85*(1-n*.9),w=[U-d*t,e-p,0],c=[U-n*t,e-v,0],C=[U-n*t,e+v,0],a0=[U-d*t,e+p,0];r.quad(w,a0,C,c,d,d,n,n),r.quad(w,c,C,a0,d,n,n,d)}}const l0=5.2,c0=7.8,g0=-32.5,w0=-15.5,V=8;S(.4,.5),r.beam([g0,V-.15,(l0+c0)/2],[w0,V-.15,(l0+c0)/2],c0-l0,.3,{caps:!0,ref:[0,0,1]});for(let e=g0+.4;e<w0;e+=.55)r0(r,l.range(.8,1)),r.glow=n0(l(),.5),r.beam([e,V+.02,l0],[e,V+.02,c0],.45,.05,{ref:[0,1,0]});for(const e of[l0+.1,c0-.1]){S(.4,.45),r.beam([g0,V-.5,e],[w0,V-.5,e],.2,.5,{caps:!0,ref:[0,0,1]}),S(.4,.6),r.beam([g0,V+1.1,e],[w0,V+1.1,e],.1,.1,{ref:[0,1,0]}),r.beam([g0,V+.6,e],[w0,V+.6,e],.06,.06,{ref:[0,1,0]});for(let o=g0;o<=w0+.01;o+=1.7)S(l(),.5),r.beam([o,V,e],[o,V+1.12,e],.09,.09);let t=0;for(let o=g0+.85;o<w0;o+=1.7)t0(o,V+1.3,e,t++%3,0,0,.26,1,l.range(0,9))}for(const e of[-27,-21.5,-16.5]){for(const t of[l0+.2,c0-.2])S(l(),.3),r.beam([e,.2,t+(t>6?.8:-.5)],[e,V-.5,t],.26,.26,{taper:.8}),C0(),r.beam([e,-.2,t+(t>6?.8:-.5)],[e,.4,t+(t>6?.8:-.5)],.9,.9,{taper:.75,caps:!0});S(l(),.3),r.beam([e,.8,l0-.2],[e,V-.9,c0-.2],.1,.1),r.beam([e,.8,c0+.5],[e,V-.9,l0+.2],.1,.1)}await q.yield?.();{const o=(l0+c0)/2,a=V+3,d=V+4.3,n=l.chance(.5)?A:_;for(const v of[-32.3+.2,-26.3-.2])for(const w of[l0+.15,c0-.15])S(.5,.6),r.beam([v,V,w],[v,a,w],.12,.12);const p=8;for(let v=0;v<p;v++){const w=-32.3+5.9999999999999964*v/p,c=-32.3+(-26.3- -32.3)*(v+1)/p,C=v%2===0;r.col=C?[.74,.74,.76]:[n.r*.8+.05,n.g*.8+.05,n.b*.8+.05],r.glow=[.5,.5,.52];for(const a0 of[-1,1]){const f0=o+a0*1.75,x0=[w,a,f0],_0=[c,a,f0],ee=[c,d,o],te=[w,d,o];a0>0?r.quad(x0,_0,ee,te):r.quad(_0,x0,te,ee);const R0=[(w+c)/2,a-.5,f0+a0*.06];r.quad(x0,R0,R0,_0,0,.25,.25,0),r.quad(_0,R0,R0,x0,0,.25,.25,0)}t0((w+c)/2,a+.1,o+1.85,v%3,0,0,.26,1,l.range(0,9))}S(.5,.6),r.beam([-32.3-.1,d+.05,o],[-26.3+.1,d+.05,o],.12,.12,{caps:!0,ref:[0,1,0]})}await q.yield?.();const S0=Math.sin(ae),b0=Math.cos(ae),Z0=e=>[0,J+e*S0,e*b0],E=(e,t=0,o=0)=>[t,J+e*S0-(N0+o)*b0,e*b0+(N0+o)*S0],P0=[0,b0,-S0];if(y){const t=re;for(const c of[-.6,.6])S(.5,.6),r.beam(E(.4,c,.16),E(t,c,.16),.2,.26,{caps:!0,ref:P0}),W0(),r.col=[.46,.5,.58],r.glow=n0(c>0?.8:.2,1.3),r.beam(E(.4,c,0),E(t,c,0),.16,.06,{caps:!0,ref:P0});for(const c of[-.42,.42])S(.5,.45),r.beam(E(.4,c,.62),E(t,c,.62),.16,.44,{caps:!0,ref:P0});let o=0;for(let c=.4+.3;c<t;c+=1.15,o++)if(r0(r,l.range(.9,1.04)),r.glow=n0(l(),.5),r.beam(E(c,-1.02,.36),E(c,1.02,.36),.24,.14,{caps:!0,ref:P0}),o%2===0)for(const C of[-1.12,1.12])t0(...E(c,C,.3),(o/2+(C>0?1:0))%3,0,0,.2,2,(1-c/t)*7+(C>0?.08:0));const a=2.3;S(.5,.4),r.tube([E(.4,0,2),E(t*.5,0,2),E(t,0,2)],.13,6,{up:[1,0,0]});for(let c=.4,C=0;c<t-.1;c+=a,C++){const a0=Math.min(t,c+a),f0=(c+a0)/2;for(const x0 of[-.42,.42])S(l(),.4),r.beam(E(c,x0,.8),E(f0,0,2),.08,.08,{ref:[1,0,0]}),r.beam(E(f0,0,2),E(a0,x0,.8),.08,.08,{ref:[1,0,0]})}S(.5,.8),r.beam(E(.4,-.9,.3),E(.4,.9,.3),.1,.5,{caps:!0,ref:P0});const d=14/b0,n=E(d,0,2),p=n[1]-.9,v=n[2],w=[];for(let c=0;c<=16;c++)w.push([0,c/16*p,v]);S(.5,.42),r.tube(w,c=>.24+.4*(1-c)+.75*Math.pow(Math.max(0,1-c*14),2),10,{up:[1,0,0]});for(const c of[.3,.58,.86]){const C=c*p,a0=.24+.4*(1-c);S(.5,.6),r.tube([[0,C-.25,v],[0,C-.12,v],[0,C+.12,v],[0,C+.25,v]],f0=>a0+(f0>.2&&f0<.8?.16:.03),10,{up:[1,0,0]}),t0(0,C,v+a0+.4,c<.5?0:c<.8?1:2,0,0,.3,1,c*9)}C0(),r.beam([0,-.2,v],[0,.5,v],3.6,3.6,{taper:.7,caps:!0});for(const c of[-.42,.42])for(const C of[-1.6,1.6])S(.5,.5),r.beam([0,p-.3,v],E(d+C,c,.84),.2,.2,{taper:.6,ref:[1,0,0]});S(.5,.5),r.beam([0,p-.5,v],n,.3,.3,{taper:.6})}await q.yield?.();const K0=r.build();await q.yield?.();const H0=new s.Mesh(K0,u0(!1,!1));H0.frustumCulled=!1,O.add(H0);const A0=i0.length/9,j0=new Float32Array(A0*3),X0=new Float32Array(A0*4),Y0=new Float32Array(A0*2);for(let e=0;e<A0;e++){const t=e*9;j0.set([i0[t],i0[t+1],i0[t+2]],e*3),X0.set([i0[t+3],i0[t+4],i0[t+5],i0[t+6]],e*4),Y0.set([i0[t+7],i0[t+8]],e*2)}const U0=new s.PlaneGeometry(2,2),p0=new s.InstancedBufferGeometry;p0.setIndex(U0.index),p0.setAttribute("position",U0.getAttribute("position")),p0.setAttribute("iPos",new s.InstancedBufferAttribute(j0,3)),p0.setAttribute("iDat",new s.InstancedBufferAttribute(X0,4)),p0.setAttribute("iCh",new s.InstancedBufferAttribute(Y0,2)),p0.instanceCount=A0;const E0=new s.Mesh(p0,z0(!1));E0.frustumCulled=!1,E0.renderOrder=3,O.add(E0);let y0=null;if(I){const e=new s.Group;e.name="mirror",e.scale.set(1,-1.3,1),y0=new s.Group,y0.position.y=J,y0.rotation.z=P;const t=new s.Mesh(O0,u0(!0,!1)),o=new s.Mesh(K0,u0(!0,!1)),a=new s.Mesh(G0,u0(!0,!0)),d=new s.Mesh(p0,z0(!0));for(const p of[t,o,a,d])p.frustumCulled=!1;d.renderOrder=1.4,y0.add(t),e.add(y0,o,a,d),O.add(e);const n=new s.Mesh(new s.CylinderGeometry(i,i,f,48,1,!1),new s.ShaderMaterial({uniforms:{...s.UniformsUtils.clone(s.UniformsLib.fog),...F},vertexShader:se,fragmentShader:ve,fog:!0,side:s.BackSide}));n.position.y=-f/2-.05,n.frustumCulled=!1,e0.push(n.material),O.add(n)}if(await q.yield?.(),$){const e=new s.CircleGeometry(M,96);e.rotateX(-Math.PI/2);const t=new s.ShaderMaterial({uniforms:{...s.UniformsUtils.clone(s.UniformsLib.fog),...F,uSand:{value:G.clone().multiplyScalar(1.5)},uGlowA:{value:A.clone()},uGlowB:{value:_.clone()},uZone:{value:I?i*.893:.001}},vertexShader:se,fragmentShader:ge,fog:!0,transparent:!0,depthWrite:!1}),o=new s.Mesh(e,t);o.position.y=.04,o.renderOrder=2,o.frustumCulled=!1,e0.push(t),O.add(o)}await q.yield?.();const Q0=[];for(const e of[62,48,34,20,8,0])Q0.push(Z0(e));const ce={portalSeat:{position:[0,J,0],normal:[0,S0,b0],radius:7,tiltDeg:12},flyThrough:Q0,flyBeyond:Z0(-12),trackJoin:{position:E(re),direction:[0,-S0,-b0]},railDrop:N0,ringCenter:[0,J,0],ringRadius:k,clearRadius:22.5,pier:{side:-1,edgeX:-32,deckY:8},towerTop:[U,X+10.5,0],viewpoints:{reveal:[70,9,230],lastClimb:[10,47,120],under:[22,3,46]},fireworks:[0,78,-300]},J0=new s.Vector2;let k0=null;return{object:O,radius:36,height:63,center:new s.Vector3(0,J,0),anchors:ce,uniforms:F,triangles:Math.round((W.tris+r.tris+v0*G0.getAttribute("position").count/3+A0*2)*(I?2:1)),setProgress(e){D=Math.min(1,Math.max(0,e||0))},setFlash(e){s0=Math.min(.25,Math.max(0,e||0))},update(e,t,o){let a=Number.isFinite(e)?e:k0===null?0:t-k0;k0=t,a=Math.min(.1,Math.max(0,a));const d=Math.min(1,Math.max(0,(D-.85)/.15)),n=d*d*(3-2*d);P+=b*a,j+=Y*H*(a/9)*(1+n*1.2),(P>1e4||P<-1e4)&&(P%=Q),F0.rotation.z=P,y0&&(y0.rotation.z=P),F.uRot.value=P,F.uChaseT.value=j-Math.floor(j),F.uTime.value=t,F.uSwell.value=n,F.uFlash.value=s0,q.renderer?.getDrawingBufferSize&&(q.renderer.getDrawingBufferSize(J0),F.uRes.value.copy(J0)),O.getWorldPosition(F.uOrigin.value)},dispose(){U0.dispose()},ground:!$,groundY:0}}export{D0 as Geo,be as buildHero};
