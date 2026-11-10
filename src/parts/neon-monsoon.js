import*as i from"three";import{clamp as D,smoothstep as _}from"../kit/core.js";const U=["#07060f","#1a1038","#2b2f6a","#12151c","#00e5ff","#ff2bd6","#ffb300"],G=Math.PI*2;function z(a,n){const r=Math.min(n/.26,1),u=Math.pow(Math.max(1-Math.pow(1-r,1.9),1e-5),.72),o=a.Hm*u*(1-.72*Math.pow(Math.max(_(.34,1,n),1e-5),1.1)),c=a.Wm*Math.pow(u,1.15)*(1-.86*Math.pow(Math.max(_(.25,1,n),1e-5),1.05)),w=a.Hm*(.2*Math.sin(Math.PI*Math.pow(Math.max(n,1e-5),.8))-.16*(1-_(0,.32,n)));return{w:c,h:o,c:w}}function E(a,n,r,u=1,o=0,c=new i.Vector3){const w=z(a,n),s=Math.cos(r),l=Math.sin(r),h=1-o,g=Math.max(l,0);return c.set(u*w.w*s*(1-.2*g*g)*h,w.c+w.h*l*(l<0?.92:1)*h,a.L*.5-n*a.Lb)}const B=`
uniform float uTime, uLen, uSB, uHm, uWm, uTurn, uReveal, uPhase, uGlitch, uIntensity;
uniform vec4 uSwim;   // head amplitude, tail amplitude (fractions of length), waves along the body, angular speed
float pw(float x, float e){ return pow(max(x, 1.0e-5), e); }
float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x*p.y); }
float h31(vec3 p){ p = fract(p*0.3183099 + vec3(0.1, 0.2, 0.3)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x + p.y + p.z)); }
float vnoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a*vnoise(p); p = p*2.03 + vec3(11.3, 7.1, 3.7); a *= 0.5; } return s; }
// half-width, half-height, centre height of the body at t (0 nose .. 1 tail stalk)
vec3 koiProf(float t){
  float tn = min(t/0.26, 1.0);
  float nose = pw(1.0 - pw(1.0 - tn, 1.9), 0.72);
  float h = uHm*nose*(1.0 - 0.72*pw(smoothstep(0.34, 1.0, t), 1.1));
  float w = uWm*pw(nose, 1.15)*(1.0 - 0.86*pw(smoothstep(0.25, 1.0, t), 1.05));
  float c = uHm*(0.2*sin(3.14159265*pw(t, 0.8)) - 0.16*(1.0 - smoothstep(0.0, 0.32, t)));
  return vec3(w, h, c);
}
// lateral offset of the spine and its derivative at s (0 nose .. 1 tail tip)
vec2 koiSpine(float s){
  float sc = clamp(s, -0.1, 1.25);
  float A = uLen*(uSwim.x + uSwim.y*sc*sc), dA = uLen*2.0*uSwim.y*sc;
  float k = 6.2831853*uSwim.z, psi = k*s - uTime*uSwim.w + uPhase;
  float q = s - 0.3;
  return vec2(A*sin(psi) + 0.35*A*sin(psi*0.5 + 1.7) + uTurn*uLen*0.5*q*q,
              dA*sin(psi) + A*k*cos(psi) + 0.175*A*k*cos(psi*0.5 + 1.7) + uTurn*uLen*q);
}
float koiBob(){ return 0.9*sin(uTime*0.31 + uPhase*1.7); }
// rest position -> swimming position (cross-sections stay perpendicular to the spine)
vec3 koiBend(vec3 p, out float cs, out float sn){
  vec2 sp = koiSpine(0.5 - p.z/uLen);
  float th = atan(sp.y/uLen); cs = cos(th); sn = sin(th);
  return vec3(sp.x + p.x*cs, p.y + koiBob(), p.z + p.x*sn);
}
float koiGlitch(float y){
  float band = floor(y/2.6), tk = floor(uTime*7.0);
  return step(0.972, h21(vec2(band, tk)))*(h21(vec2(tk, band)) - 0.5)*uGlitch;
}
// materialisation front: visibility at s, and a bright scan edge while it is running
float koiVis(float s, out float edge){
  float f = uReveal*1.3 - 0.14;
  edge = exp(-abs(s - f)*42.0)*step(uReveal, 0.999)*step(0.001, uReveal);
  return 1.0 - smoothstep(f - 0.03, f, s);
}
`,q=`
float koiScan(float y){
  float fw = fwidth(y);
  float fine = 0.5 + 0.5*sin(y*7.854 - uTime*3.2);
  fine = mix(0.72, 0.45 + fine*fine*0.72, 1.0 - smoothstep(0.1, 0.36, fw));
  float coarse = 0.72 + 0.28*sin(y*1.2566 + uTime*1.1);
  float flick = 1.0 - 0.1*step(0.93, h11(floor(uTime*13.0)));
  return fine*coarse*flick;
}
// kohaku islands: warped low-frequency noise, mean 0.5
float koiPattern(vec3 q){
  q += 0.6*vec3(vnoise(q*1.7 + 4.1), vnoise(q*1.7 + 9.3), vnoise(q*1.7 + 1.7)) - 0.3;
  return 0.62*vnoise(q) + 0.28*vnoise(q*2.3 + 7.0) + 0.1*vnoise(q*5.1 + 13.0);
}
float koiSweep(float y){ return pw(0.5 + 0.5*sin(y*0.14 - uTime*0.8), 24.0); }
vec3 koiFog(vec3 col, float depth){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogF = 1.0 - exp(-fogDensity*fogDensity*depth*depth);
    #else
      float fogF = smoothstep(fogNear, fogFar, depth);
    #endif
    col *= 1.0 - 0.85*clamp(fogF, 0.0, 1.0);
  #endif
  return col;
}
`;function j(a){const o=new Float32Array(18963),c=new Float32Array(6321*2),w=new Float32Array(6321),s=new i.Vector3;for(let p=0;p<=128;p++){const e=p/128,f=.35*Math.pow(e,2.2)+.65*e,x=z(a,f).c;for(let v=0;v<=48;v++){const d=p*49+v;E(a,f,v/48*G,1,0,s),o[d*3]=s.x,o[d*3+1]=s.y,o[d*3+2]=s.z,c[d*2]=f,c[d*2+1]=v/48,w[d]=x}}const l=new Uint32Array(6144*6);let h=0;for(let p=0;p<128;p++)for(let e=0;e<48;e++){const f=p*49+e,x=f+1,v=f+49,d=v+1;l[h++]=f,l[h++]=v,l[h++]=x,l[h++]=x,l[h++]=v,l[h++]=d}const g=new i.BufferGeometry;g.setAttribute("position",new i.BufferAttribute(o,3)),g.setAttribute("aUV",new i.BufferAttribute(c,2)),g.setAttribute("aYc",new i.BufferAttribute(w,1)),g.setIndex(new i.BufferAttribute(l,1)),g.computeVertexNormals();const t=g.attributes.normal.array;for(let p=0;p<=128;p++){const e=p*49*3,f=(p*49+48)*3;for(let v=0;v<3;v++){const d=t[e+v]+t[f+v];t[e+v]=d,t[f+v]=d}const x=Math.hypot(t[e],t[e+1],t[e+2])||1;for(let v=0;v<3;v++)t[e+v]/=x,t[f+v]/=x}if((t[1960*3]<0?-1:1)<0)for(let p=0;p<t.length;p++)t[p]=-t[p];return g}function Q(){const a=[],n=[],r=[],u=[],o=new i.Vector3,c=new i.Vector3,w=new i.Vector3,s=new i.Vector3;return{fan(l){const{root0:h,root1:g,dir0:t,dir1:F,len:p,na:e,nb:f,rays:x,phase:v,amp:d,sweep:R}=l,S=l.curl||0,m=l.curlTo,k=l.flexDir||s.crossVectors(t,F).normalize().clone(),y=a.length/3;for(let T=0;T<=e;T++){const A=T/e,L=p(A);c.lerpVectors(h,g,A),w.lerpVectors(t,F,A).normalize();for(let N=0;N<=f;N++){const V=N/f,b=V*L;o.copy(c).addScaledVector(w,b*(1-S*V)),S&&o.addScaledVector(m,b*S*V),R&&o.addScaledVector(R,b*V),a.push(o.x,o.y,o.z),n.push(A,V,x,v+(l.phaseSpread||0)*A);const M=d*Math.pow(V,1.5)*(.4+.6*L/l.lref);r.push(k.x*M,k.y*M,k.z*M)}}const C=f+1;for(let T=0;T<e;T++)for(let A=0;A<f;A++){const L=y+T*C+A,N=L+1,V=L+C,b=V+1;u.push(L,V,N,N,V,b)}},whisker(l,h,g,t,F,p,e){for(let x=0;x<2;x++){const v=a.length/3,d=x===0?s.set(0,1,0):s.crossVectors(h,new i.Vector3(0,1,0)).normalize(),R=d.x,S=d.y,m=d.z;for(let k=0;k<=12;k++){const y=k/12,C=F*(1-.85*y);o.copy(l).addScaledVector(h,y*t).addScaledVector(g,y*y*t);for(let T=-1;T<=1;T+=2){a.push(o.x+R*C*T,o.y+S*C*T,o.z+m*C*T),n.push(.5+.5*T,y,0,p);const A=.9*y*y;r.push(e.x*A,e.y*A,e.z*A)}}for(let k=0;k<12;k++){const y=v+k*2;u.push(y,y+1,y+2,y+1,y+3,y+2)}}},build(){const l=new i.BufferGeometry;return l.setAttribute("position",new i.Float32BufferAttribute(a,3)),l.setAttribute("aFin",new i.Float32BufferAttribute(n,4)),l.setAttribute("aFlex",new i.Float32BufferAttribute(r,3)),l.setIndex(u),l}}}function Y(a){const n=Q(),r=(e,f,x)=>new i.Vector3(e,f,x),u=(e,f,x)=>new i.Vector3(e,f,x).normalize(),o=r(1,0,0),c=a.finScale,w=e=>{const f=z(a,e);return r(0,f.c+f.h-.35,a.L*.5-e*a.Lb)},s=e=>{const f=z(a,e);return r(0,f.c-f.h*.92+.35,a.L*.5-e*a.Lb)},l=r(0,0,-1),h=a.dorsalH;n.fan({root0:w(.27),root1:w(.78),dir0:u(0,.9,-.44),dir1:u(0,.42,-.9),na:50,nb:12,rays:44,phase:.6,phaseSpread:5,amp:1.7,lref:h,flexDir:o,curl:.32,curlTo:l,len:e=>h*(.3+.7*_(0,.16,e))*(1-.5*Math.pow(e,1.3))*(1+1.6*_(.72,1,e))});const g=z(a,1),t=a.L*.5-a.Lb+2.2,F=(a.L-a.Lb)*1.16;n.fan({root0:r(0,g.c+g.h,t),root1:r(0,g.c-g.h,t),dir0:u(0,Math.sin(.66),-Math.cos(.66)),dir1:u(0,-Math.sin(.72),-Math.cos(.72)),na:64,nb:30,rays:56,phase:2.1,phaseSpread:1.5,amp:3*c,lref:F,flexDir:o,curl:.4,curlTo:l,len:e=>F*(.5+.5*Math.pow(Math.abs(2*e-1),1.7))*(e<.5?1:.95)}),a.tailHalf=F*.4,a.tailZ=t;const p=a.Lb*.14*c;n.fan({root0:s(.72),root1:s(.84),dir0:u(0,-.85,-.52),dir1:u(0,-.3,-.95),na:18,nb:10,rays:16,phase:4,phaseSpread:2,amp:1.1,lref:p,flexDir:o,curl:.4,curlTo:l,len:e=>p*(.6+.4*Math.sin(Math.PI*Math.pow(e,.7)))*(1+.7*_(.65,1,e))});for(const e of[-1,1]){const f=a.Lb*.33*c;n.fan({root0:E(a,.25,-.5,e,.08),root1:E(a,.305,-.95,e,.08),dir0:u(e*.7,-.62,-.1),dir1:u(e*.22,-.6,-.78),na:28,nb:16,rays:24,phase:1+e*.4,phaseSpread:2.5,amp:2.4,lref:f,curl:.5,curlTo:u(e*.15,-.25,-1),len:d=>f*(.45+.55*Math.sin(Math.PI*Math.pow(d,.8)))});const x=a.Lb*.16*c;n.fan({root0:E(a,.5,-1,e,.08),root1:E(a,.56,-1.3,e,.08),dir0:u(e*.5,-.75,-.3),dir1:u(e*.12,-.55,-.82),na:18,nb:10,rays:16,phase:3-e*.5,phaseSpread:2,amp:1.4,lref:x,curl:.5,curlTo:l,len:d=>x*(.5+.5*Math.sin(Math.PI*Math.pow(d,.8)))});const v=r(e,0,0);n.whisker(E(a,.02,-.6,e,.1),u(e*.6,-.45,.25),r(-e*.1,-.4,-.6),a.Hm*.5*a.barbel,.2,.3+e,v),n.whisker(E(a,.01,-.15,e,.1),u(e*.5,-.15,.55),r(-e*.1,-.35,-.65),a.Hm*.3*a.barbel,.15,1.3+e,v)}return n.build()}function K(a){const u=a.Hm*.19,o=E(a,.105,.5),c=.004,w=E(a,.105-c,.5).sub(E(a,.105+c,.5)).normalize(),s=E(a,.105,.5+.02).sub(E(a,.105,.5-.02)).normalize(),l=new i.Vector3().crossVectors(w,s).normalize();l.x<0&&l.negate(),s.crossVectors(l,w).normalize();const h=10,g=36,t=[],F=[],p=[],e=new i.Vector3;for(const x of[1,-1]){const v=t.length/3;for(let R=0;R<=h;R++)for(let S=0;S<=g;S++){const m=R/h,k=S/g*G,y=m*Math.cos(k),C=m*Math.sin(k),T=.42*Math.sqrt(Math.max(1-m*m,0))-.1;e.copy(o).addScaledVector(w,y*u).addScaledVector(s,C*u).addScaledVector(l,T*u),t.push(e.x*x,e.y,e.z),F.push(y,C,x)}const d=g+1;for(let R=0;R<h;R++)for(let S=0;S<g;S++){const m=v+R*d+S,k=m+1,y=m+d,C=y+1;x>0?p.push(m,y,k,k,y,C):p.push(m,k,y,k,C,y)}}const f=new i.BufferGeometry;return f.setAttribute("position",new i.Float32BufferAttribute(t,3)),f.setAttribute("aEye",new i.Float32BufferAttribute(F,3)),f.setIndex(p),{geometry:f,center:o,T1:w,T2:s,N:l,radius:u}}function Z(a,n,r){const u=new i.InstancedBufferGeometry;u.setAttribute("position",new i.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),u.setIndex([0,1,2,0,2,3]);const o=new Float32Array(r*4),c=new Float32Array(r);for(let w=0;w<r;w++){const s=n(),l=s<.5?0:s<.7?1:s<.78?2:3;let h;l===1||l===2?h=n():(h=n(),n()<.5&&(h=.08+.6*(n()+n())*.5),h=D(h,.012,.97)),o[w*4]=h,o[w*4+1]=n()*2-1,o[w*4+2]=n(),o[w*4+3]=n(),c[w]=l}return u.setAttribute("aDrop",new i.InstancedBufferAttribute(o,4)),u.setAttribute("aKind",new i.InstancedBufferAttribute(c,1)),u.instanceCount=r,u}const I=`
  vec4 wpos = modelMatrix*vec4(q, 1.0);
  wpos.x += koiGlitch(wpos.y);
  vWorld = wpos.xyz;
  vec4 mvPosition = viewMatrix*wpos;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
`,H=`
  #ifdef USE_FOG
    col = koiFog(col, vFogDepth);
  #endif
  float chk = col.r + col.g + col.b;
  if (!(chk >= 0.0 && chk < 1.0e4)) col = vec3(0.0);        // never let a NaN reach the bloom chain
  gl_FragColor = vec4(clamp(col, 0.0, 48.0), 1.0);
`,O=`
attribute vec2 aUV; attribute float aYc;
uniform float uInflate;
varying vec3 vRest, vWorld, vN; varying vec2 vUV; varying float vDim;
#include <fog_pars_vertex>
${B}
void main(){
  vRest = position; vUV = aUV;
  vec3 p = position; p.x *= uInflate; p.y = aYc + (p.y - aYc)*uInflate;
  float cs, sn; vec3 q = koiBend(p, cs, sn);
  vN = mat3(modelMatrix)*vec3(normal.x*cs - normal.z*sn, normal.y, normal.x*sn + normal.z*cs);
  ${I}
  // seen end-on the whole length stacks up additively: ease it back so the head-on view keeps its colour
  float al = abs(dot(normalize(cameraPosition - wpos.xyz), normalize(modelMatrix[2].xyz)));
  vDim = mix(1.0, 0.42, smoothstep(0.5, 0.95, al));
}`,$=`
uniform vec3 uColA, uColB, uColRim, uColAcc, uEye, uPatOff;
uniform vec4 uPat;      // patch threshold, pattern frequency, accent spots, tancho disc
uniform vec2 uScaleN; uniform float uEyeR, uHeadZ;
varying vec3 vRest, vWorld, vN; varying vec2 vUV; varying float vDim;
#include <fog_pars_fragment>
${B}
${q}
void main(){
  float t = vUV.x, ang = vUV.y*6.2831853, sa = sin(ang);
  float s = 0.5 - vRest.z/uLen;
  float edge; float vis = koiVis(s, edge);
  if (vis + edge < 0.003) discard;
  vec3 N = vN/max(length(vN), 1e-5), V = normalize(cameraPosition - vWorld);
  float ndv = clamp(abs(dot(N, V)), 0.0, 1.0);
  float scan = koiScan(vWorld.y), sweep = koiSweep(vWorld.y);
  vec3 col;
#if MODE == 0
  float F = pw(max(1.0 - ndv, 0.0), 2.2);
  float face = gl_FrontFacing ? 1.0 : 0.36;
  // kohaku pattern: crisp orange islands on white, belly stays white
  float pn = koiPattern(vRest*uPat.y + uPatOff);
  float low = smoothstep(0.25, -0.65, sa);                       // 0 on the back, 1 at the belly
  float pe = pn + 0.06*max(sa, 0.0) - 0.16*low, bellyM = smoothstep(-0.85, -0.55, sa);
  float hiPatch = smoothstep(uPat.x, uPat.x + 0.025, pe)*bellyM;
  float inkLine = smoothstep(0.022, 0.0, abs(pe - uPat.x - 0.012))*bellyM;    // drawn outline round every island
  float td = length(vec2(vRest.x, vRest.z - uHeadZ))/(0.62*uWm);
  hiPatch = max(hiPatch, uPat.w*smoothstep(1.0, 0.9, td)*step(0.0, sa));
  float spots = 0.0;
  if (uPat.z > 0.5) spots = smoothstep(0.7, 0.73, koiPattern(vRest.zxy*uPat.y*2.6 + uPatOff.yzx))*smoothstep(-0.3, 0.3, sa);
  vec3 base = mix(mix(uColB, uColA, hiPatch), uColAcc, spots);
  // scales: staggered lattice, bright trailing crescents, random glints; none on the head
  float headF = smoothstep(0.215, 0.26, t);
  vec2 sp = vec2(t*uScaleN.x, vUV.y*uScaleN.y);
  vec2 fws = fwidth(sp); float sFade = (1.0 - smoothstep(0.28, 0.8, max(fws.x, fws.y)))*headF;
  vec2 ca = fract(sp) - 0.5, cb = fract(sp + 0.5) - 0.5;
  float da = dot(ca, ca), db = dot(cb, cb), pick = step(db, da);
  vec2 cc = mix(ca, cb, pick); float d = sqrt(min(da, db));
  float twk = h21(floor(sp + 0.5*pick) + 0.37*pick);
  float rimS = smoothstep(0.3, 0.47, d), cres = rimS*smoothstep(-0.15, 0.3, cc.x);
  float glint = pw(0.5 + 0.5*sin(uTime*(0.5 + 1.8*twk) + twk*50.0), 6.0);
  float lum = 0.14 + 0.3*(1.0 - d*2.0) + 1.7*cres + 0.9*glint*(1.0 - rimS);
  // head: fine projector dot matrix instead
  float mg = (0.5 + 0.5*sin(vRest.z*10.0))*(0.5 + 0.5*sin(vRest.y*10.0));
  float mFade = 1.0 - smoothstep(0.12, 0.4, fwidth(vRest.y)*1.6);
  float lumHead = mix(0.5, 0.3 + 0.75*smoothstep(0.15, 0.7, mg), mFade);
  lum = mix(mix(0.6, lumHead, 1.0 - headF), lum, sFade);
  // gill plate, mouth, nostril, lateral line
  float tg = 0.24 - 0.055*sa*sa - 0.012*sa;
  float gmask = smoothstep(-0.92, -0.7, sa)*(1.0 - smoothstep(0.68, 0.86, sa));
  float gill = smoothstep(0.0048, 0.0014, abs(t - tg))*gmask;
  float gillGlow = exp(-max(t - tg, 0.0)*85.0)*step(tg, t)*gmask*0.3;
  float mouth = smoothstep(0.03, 0.008, abs(sa + 0.38 - t*5.0))*(1.0 - smoothstep(0.03, 0.045, t))*smoothstep(0.002, 0.008, t);
  float dn = length(vec2((t - 0.052)*30.0, (sa - 0.55)*3.2));
  float nostril = smoothstep(0.14, 0.05, abs(dn - 0.3));
  float ll = smoothstep(0.034, 0.012, abs(sa - 0.1 + 0.1*(t - 0.5)))*smoothstep(0.25, 0.28, t);
  float pulse = pw(0.5 + 0.5*sin(t*26.0 - uTime*2.2), 10.0);
  float lateral = ll*(0.22*step(0.4, fract(t*110.0)) + 1.7*pulse);
  col = base*(0.045 + 0.2*lum)*(1.0 + 1.7*hiPatch)*scan*face + uColA*inkLine*0.22*face;
  col += mix(base, uColRim, 0.25)*F*(1.0 - 0.6*F)*1.4*face*(0.55 + 0.45*scan);
  col += uColRim*(gill*1.1 + gillGlow + mouth*0.9 + nostril*0.6 + lateral)*face;
  // eye socket: cleared for the lens, with a thin ring around it
  float de = length(vec3(abs(vRest.x), vRest.y, vRest.z) - uEye)/uEyeR;
  col *= smoothstep(0.95, 1.2, de);
  col += uColRim*smoothstep(0.1, 0.0, abs(de - 1.3))*0.9*face;
  col += mix(uColB, uColRim, 0.5)*sweep*0.6*face;
#elif MODE == 1
  // halo in the rain haze
  col = mix(uColA, uColB, 0.3)*pw(ndv, 2.6)*0.075*(0.8 + 0.2*scan);
#else
  // ghost skeleton: ribs, a spine ridge and signal pulses running tailward
  float rf = 1.0 - smoothstep(0.12, 0.45, fwidth(t*46.0));
  float ribs = mix(0.27, pw(0.5 + 0.5*sin(t*289.0), 8.0), rf);
  float run = pw(0.5 + 0.5*sin(t*14.0 - uTime*1.6), 6.0);
  float ridge = smoothstep(0.72, 1.0, sa);
  float m = smoothstep(0.03, 0.13, t)*(1.0 - smoothstep(0.84, 1.0, t));
  col = mix(uColA, uColB, 0.55)*pw(ndv, 1.3)*(0.04 + 0.42*ribs*(0.35 + 0.65*run) + 0.3*ridge)*m*(0.7 + 0.3*scan);
#endif
  col *= 1.0 - 0.7*smoothstep(0.9, 1.0, t);                      // the tail stalk melts into the fin root
  col = (col*vis*vDim + uColRim*edge*1.3)*uIntensity;
  ${H}
}`,X=`
attribute vec4 aFin; attribute vec3 aFlex;
varying vec4 vFin; varying vec3 vRest, vWorld;
#include <fog_pars_vertex>
${B}
void main(){
  vFin = aFin; vRest = position;
  float w = uTime*uSwim.w;
  float wv = sin(w*2.3 + aFin.w + aFin.y*4.5) + 0.4*sin(w*3.7 + aFin.w*1.7 + aFin.y*9.0 + aFin.x*6.0);
  vec3 p = position + aFlex*wv;
  float cs, sn; vec3 q = koiBend(p, cs, sn);
  ${I}
}`,J=`
uniform vec3 uColA, uColB, uColRim, uPatOff; uniform vec4 uPat;
varying vec4 vFin; varying vec3 vRest, vWorld;
#include <fog_pars_fragment>
${B}
${q}
void main(){
  float a = vFin.x, b = vFin.y, rays = vFin.z;
  float edge; float vis = koiVis(0.5 - vRest.z/uLen, edge);
  if (vis + edge < 0.003) discard;
  vec3 N = cross(dFdx(vWorld), dFdy(vWorld)), V = normalize(cameraPosition - vWorld);
  float F = clamp(1.0 - abs(dot(N/max(length(N), 1e-9), V)), 0.0, 1.0);
  float scan = koiScan(vWorld.y), sweep = koiSweep(vWorld.y);
  vec3 col;
  if (rays < 0.5) {
    col = mix(uColB, uColA, 0.35)*(0.95 - 0.55*b)*(0.6 + 0.4*scan);
  } else {
    float ra = a*rays, rid = floor(ra), fwr = fwidth(ra);
    float ray = smoothstep(0.7 - fwr, 0.98, abs(fract(ra) - 0.5)*2.0);
    ray = mix(0.26, ray, 1.0 - smoothstep(0.3, 0.85, fwr));
    float ray2 = smoothstep(0.78, 1.0, abs(fract(ra*2.0 + 0.5) - 0.5)*2.0)*smoothstep(0.4, 0.7, b)*(1.0 - smoothstep(0.2, 0.5, fwr));
    float bb = b/(0.8 + 0.2*h11(rid + rays*7.0));                    // every ray ends at its own length
    vec2 cell = vec2(floor(ra*2.0), floor(b*rays*0.9 - uTime*1.2));
    float alive = step(smoothstep(0.86, 1.03, bb), h21(cell) + 0.02);  // tips break up into drifting pixels
    float pat = smoothstep(0.42, 0.5, fbm(vRest*uPat.y*1.6 + uPatOff + 3.0) + 0.25*(1.0 - b))*(1.0 - smoothstep(0.25, 0.85, b));
    vec3 base = mix(uColB, uColA, pat*0.9);
    float rimRay = smoothstep(0.035, 0.0, min(a, 1.0 - a));            // leading and trailing edges draw the outline
    col = base*(0.12 + 0.2*(1.0 - b) + 0.75*ray*(1.0 - 0.4*b) + 0.3*ray2 + 1.2*rimRay)*scan;
    col += uColRim*smoothstep(0.6, 0.97, bb)*(0.1 + 0.45*ray);
    col += mix(uColB, uColRim, 0.5)*sweep*0.25;
    col *= alive*(0.75 + 1.5*F*F);
  }
  col = (col*vis + uColRim*edge*0.9)*uIntensity;
  ${H}
}`,ee=`
attribute vec3 aEye;
uniform vec3 uEye, uEyeN, uEyeT1, uEyeT2, uCamLocal;
varying vec3 vE, vWorld; varying vec2 vPup;
#include <fog_pars_vertex>
${B}
void main(){
  vE = aEye;
  vec3 m = vec3(aEye.z, 1.0, 1.0);
  float cs, sn; vec3 ec = koiBend(uEye*m, cs, sn);
  vec3 tc = normalize(uCamLocal - ec);
  float facing = smoothstep(-0.2, 0.3, dot(tc, uEyeN*m));
  vPup = clamp(vec2(dot(tc, uEyeT1*m), dot(tc, uEyeT2*m)), -1.0, 1.0)*0.3*facing;   // the pupil follows the camera
  vec3 q = koiBend(position, cs, sn);
  ${I}
}`,te=`
uniform vec3 uColA, uColB, uColRim;
varying vec3 vE, vWorld; varying vec2 vPup;
#include <fog_pars_fragment>
${B}
${q}
void main(){
  float edge; float vis = koiVis(0.06, edge);
  vec2 p2 = vE.xy; float r = length(p2);
  vec2 q = p2 - vPup; float rq = length(q), aq = atan(q.y, q.x);
  vec3 N = cross(dFdx(vWorld), dFdy(vWorld)), V = normalize(cameraPosition - vWorld);
  float F = clamp(1.0 - abs(dot(N/max(length(N), 1e-9), V)), 0.0, 1.0); F *= F;
  float scan = koiScan(vWorld.y);
  float pupil = smoothstep(0.3, 0.26, rq);
  float iris = smoothstep(0.63, 0.59, rq)*(1.0 - pupil);
  float stri = 0.5 + 0.5*sin(aq*44.0 + 4.0*vnoise(vec3(aq*3.0, rq*9.0, 1.0)));
  vec3 col = mix(uColA, uColB, 0.15)*iris*(0.35 + 1.5*stri*smoothstep(0.27, 0.62, rq));
  col += uColB*smoothstep(0.035, 0.0, abs(rq - 0.62))*2.2;                       // limbal ring
  col += uColA*smoothstep(0.03, 0.0, abs(rq - 0.3))*1.2;                         // pupil edge
  col += uColB*smoothstep(0.1, 0.03, length(q - vec2(0.1, 0.13)))*3.2;           // glint
  col += uColB*0.1*(1.0 - iris - pupil)*step(r, 0.84);                           // sclera
  float pr = atan(p2.y, p2.x)/6.2831853;
  col += uColRim*smoothstep(0.03, 0.0, abs(r - 0.94))*step(0.35, fract(pr*36.0 + uTime*0.05))*1.8;   // rotating reticle
  col += uColRim*smoothstep(0.02, 0.0, abs(r - 0.85))*0.7;
  col += uColRim*smoothstep(0.03, 0.0, abs(r - 0.74))*step(0.82, fract(pr*4.0 - uTime*0.08))*1.4;
  col += mix(uColB, uColRim, 0.5)*F*0.5;
  col *= (0.7 + 0.3*scan)*vis*uIntensity*step(r, 0.995)*(gl_FrontFacing ? 1.0 : 0.22);   // the far eye only ghosts through
  ${H}
}`,oe=`
attribute vec4 aDrop; attribute float aKind;
uniform vec3 uTail;     // tail half-height at the root, at the tips, dorsal fin height
uniform float uFall;
varying vec2 vQ; varying float vLum, vMote, vHue;
#include <fog_pars_vertex>
${B}
void main(){
  float rnd = aDrop.w, mote = step(2.5, aKind);
  float fall = uTime*uFall*(0.75 + 0.5*rnd);
  float s, x0, yr, yc, inside;
  if (aKind < 0.5 || aKind > 2.5) {
    float t = aDrop.x; s = t*uSB; vec3 pr = koiProf(t);
    float span = 2.5*pr.y + 2.0;
    if (aKind < 0.5) { yr = mod(aDrop.z*span - fall, span) - 0.5*span; x0 = aDrop.y*1.15*pr.x; }
    else { x0 = aDrop.y*0.8*pr.x + 0.6*sin(uTime*0.4 + rnd*40.0); yr = (aDrop.z*2.0 - 1.0)*0.8*pr.y + 0.8*sin(uTime*0.3 + rnd*70.0); }
    float e = x0*x0/(pr.x*pr.x + 0.05) + yr*yr/(pr.y*pr.y + 0.05);
    inside = 1.0 - smoothstep(0.7, 1.02, e);
    yc = pr.z;
  } else if (aKind < 1.5) {
    float tu = aDrop.x*0.8; s = mix(uSB - 0.015, 1.0, tu);
    float hh = mix(uTail.x, uTail.y, tu), span = 2.0*hh + 2.0;
    yr = mod(aDrop.z*span - fall, span) - 0.5*span;
    x0 = aDrop.y*2.2;
    inside = exp(-abs(x0)*1.1)*(1.0 - smoothstep(hh*0.82, hh, abs(yr)))*(1.0 - 0.7*smoothstep(0.45, 0.8, tu))*0.5;
    yc = -1.5*tu;
  } else {
    float t = mix(0.3, 0.8, aDrop.x); s = t*uSB; vec3 pr = koiProf(t);
    float hd = uTail.z*0.5*(1.0 - 0.45*aDrop.x), span = hd + 2.0;
    yr = mod(aDrop.z*span - fall, span);
    x0 = aDrop.y*1.8;
    inside = 0.6*exp(-abs(x0)*1.3)*(1.0 - smoothstep(hd*0.6, hd, yr))*smoothstep(0.0, 0.6, yr);
    yc = pr.z + pr.y;
  }
  vec3 c = vec3(koiSpine(s).x + x0, yc + yr + koiBob(), uLen*(0.5 - s));
  float edge; float vis = koiVis(s, edge);
  float tw = pw(0.5 + 0.5*sin(uTime*(3.0 + 9.0*rnd) + rnd*200.0), 6.0);
  float twm = pw(0.5 + 0.5*sin(uTime*(0.6 + 1.4*rnd) + rnd*90.0), 4.0);
  float lum = inside*(vis + 2.0*edge)*mix(0.3 + 2.8*tw, 0.25 + 3.2*twm, mote);
  vec4 wc = modelMatrix*vec4(c, 1.0);
  vec3 toCam = cameraPosition - wc.xyz; float dist = length(toCam);
  vec3 axis = normalize(mix(vec3(0.1, 1.0, 0.03), vec3(0.0, 1.0, 0.0), mote));
  vec3 side = cross(axis, toCam); side /= max(length(side), 1e-5);
  float wpx = dist*0.0013;
  float w0 = mix(0.085, 0.5, mote), len = mix(1.1 + 1.1*rnd, 0.5, mote);
  float w = max(w0, wpx); len = max(len, wpx*mix(5.0, 1.0, mote));
  lum *= mix(1.0, w0/w, 0.5);
  float al = abs(dot(toCam/max(dist, 1e-4), normalize(modelMatrix[2].xyz)));
  lum *= mix(1.0, 0.4, smoothstep(0.5, 0.95, al));
  vec3 wp = wc.xyz + side*position.x*w + axis*(position.y - 0.5*mote)*len;
  vQ = vec2(position.x*2.0, position.y); vLum = lum; vMote = mote; vHue = fract(rnd*7.31);
  vec4 mvPosition = viewMatrix*vec4(wp, 1.0);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
  if (lum < 0.004) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,ae=`
uniform vec3 uColA, uColB, uColRim; uniform float uRain;
varying vec2 vQ; varying float vLum, vMote, vHue;
#include <fog_pars_fragment>
${B}
${q}
void main(){
  float shape;
  if (vMote > 0.5) {
    vec2 q = vec2(vQ.x, vQ.y*2.0 - 1.0); float r = length(q);
    float star = max(exp(-abs(q.x)*14.0 - abs(q.y)*2.5), exp(-abs(q.y)*14.0 - abs(q.x)*2.5));
    shape = (exp(-r*r*9.0) + 0.8*star)*(1.0 - smoothstep(0.7, 1.0, r));
  } else {
    shape = (1.0 - vQ.x*vQ.x)*smoothstep(1.0, 0.2, vQ.y)*smoothstep(0.0, 0.06, vQ.y);
  }
  vec3 tint = mix(mix(uColB, uColA, 0.75*step(0.55, vHue)), uColRim, step(0.9, vHue));
  vec3 col = tint*vLum*shape*uRain*uIntensity;
  ${H}
}`,se=`
varying vec3 vP;
#include <fog_pars_vertex>
void main(){
  vP = position;
  vec4 mvPosition = modelViewMatrix*vec4(position, 1.0);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ie=`
uniform vec3 uColA, uColB, uPatOff; uniform vec4 uPat; uniform float uStreet;
varying vec3 vP;
#include <fog_pars_fragment>
${B}
${q}
void main(){
  float s = 0.5 - vP.z/uLen;
  float edge; float vis = koiVis(s, edge);
  float t = clamp(s/uSB, 0.0, 1.0);
  float wB = koiProf(t).x*(1.0 - smoothstep(uSB, uSB + 0.03, s));
  float dx = vP.x - koiSpine(s).x, sig = wB*0.8 + 5.5;
  float es = (s - 0.42)/0.5; float env = exp(-es*es*es*es*1.6);
  float g = exp(-dx*dx/(2.0*sig*sig))*env;
  float streak = vnoise(vec3(vP.x*0.55, vP.z*0.05, 3.0 + uTime*0.05));
  float fine = vnoise(vec3(vP.x*2.2, vP.z*0.16, 9.0));
  float ripple = pw(vnoise(vec3(vP.xz*1.7, uTime*2.5)), 5.0)*3.0;
  float pat = smoothstep(uPat.x - 0.06, uPat.x + 0.1, koiPattern(vec3(0.0, uHm*0.6, vP.z)*uPat.y + uPatOff));
  vec3 col = mix(uColB, uColA, 0.12 + 0.45*pat)*g*(0.03 + 0.09*streak + 0.08*fine*streak + 0.05*ripple)*uStreet*uIntensity*vis;
  ${H}
}`;async function re(a,n={}){const r=a.rng,u=(n.palette&&n.palette.length>=7?n.palette:U).map(b=>new i.Color(b)),o=n.length??120,c=n.altitude??36,w=r.range(.92,1.1),s={L:o,Lb:o*.68,finScale:r.range(.85,1.25),barbel:r.range(.8,1.35)};s.Hm=s.Lb*.148*w,s.Wm=s.Lb*.09*w*r.range(.95,1.06),s.dorsalH=s.Hm*1.5*s.finScale;const l=n.variety||r.pick(["kohaku","kohaku","sanke","tancho","hi"]),h={kohaku:[.51,0,0],sanke:[.53,1,0],tancho:[.68,0,1],hi:[.43,0,0]}[l]||[.51,0,0],g=u[6].clone().lerp(new i.Color("#ff3a08"),r.range(.1,.35)),t=b=>({value:b}),F={uTime:t(0),uLen:t(o),uSB:t(s.Lb/o),uHm:t(s.Hm),uWm:t(s.Wm),uTurn:t(0),uReveal:t(1),uPhase:t(r()*G),uGlitch:t(n.glitch??3.2),uIntensity:t(n.intensity??1),uSwim:t(new i.Vector4(.01,.07*r.range(.85,1.15),r.range(.8,1.05),r.range(.8,1.05))),uColA:t(g.clone().multiplyScalar(1.7)),uColB:t(new i.Color("#fff1e2").multiplyScalar(.4)),uColRim:t(u[4].clone().multiplyScalar(1.2)),uColAcc:t(u[5].clone().lerp(u[2],.35).multiplyScalar(.9)),uPat:t(new i.Vector4(h[0]+r.range(-.03,.03),1/(o*r.range(.13,.19)),h[1],h[2])),uPatOff:t(new i.Vector3(r.range(-50,50),r.range(-50,50),r.range(-50,50))),uScaleN:t(new i.Vector2(Math.round(s.Lb/1.7),40)),uEye:t(new i.Vector3),uEyeN:t(new i.Vector3),uEyeT1:t(new i.Vector3),uEyeT2:t(new i.Vector3),uEyeR:t(1),uHeadZ:t(o*.5-.135*s.Lb),uCamLocal:t(new i.Vector3(0,0,1e4)),uTail:t(new i.Vector3),uFall:t(26),uRain:t(.65),uStreet:t(1)},p=(b,M,P={},W={})=>new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),...F,...W},vertexShader:b,fragmentShader:M,fog:!0,transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,side:i.DoubleSide,...P}),e=new i.Group;e.name="koi-hologram";const f=new i.Group;f.position.y=c,e.add(f);const x=(b,M,P)=>{const W=new i.Mesh(b,M);return W.frustumCulled=!1,W.renderOrder=P,f.add(W),W},v=j(s);x(v,p(O,$,{defines:{MODE:1},side:i.FrontSide},{uInflate:t(1.5)}),1),x(v,p(O,$,{defines:{MODE:2},side:i.FrontSide},{uInflate:t(.42)}),2),x(v,p(O,$,{defines:{MODE:0}},{uInflate:t(1)}),3),await a.yield?.();const d=K(s);F.uEye.value.copy(d.center),F.uEyeN.value.copy(d.N),F.uEyeT1.value.copy(d.T1),F.uEyeT2.value.copy(d.T2),F.uEyeR.value=d.radius,x(d.geometry,p(ee,te),5),x(Y(s),p(X,J),4),F.uTail.value.set(z(s,1).h*1.05,s.tailHalf,s.dorsalH),await a.yield?.();const R=Math.max(0,Math.floor(n.rain??9e3));R>0&&x(Z(s,r.fork("rain"),R),p(oe,ae),6);let S=null;if(n.streetGlow!==!1){const b=new i.PlaneGeometry(2*(s.Wm+36),o*1.5,1,1);b.rotateX(-Math.PI/2),S=new i.Mesh(b,p(se,ie)),S.position.y=.06,S.frustumCulled=!1,S.renderOrder=0,e.add(S)}await a.yield?.();const m=(b,M,P)=>new i.Vector3(b,M,P),k=d.center.x+d.radius*.3,y=c+d.center.y,C=d.center.z,T=m(0,c-1,-o*.5+(o-s.Lb)*.55),A=(b,M)=>"#"+b.clone().multiplyScalar(M).getHexString(),L={swimDir:m(0,0,1),nose:m(0,c+z(s,0).c,o*.5),tailTip:m(0,c-3,-o*.5),eyeRight:m(-k,y,C),eyeLeft:m(k,y,C),dorsalTop:m(0,c+z(s,.38).c+z(s,.38).h+s.dorsalH*.9,o*.5-.42*s.Lb),eyePass:m(-(k+25),y,C),tailCross:T,flyThrough:[m(-(k+34),y+6,o*.5+80),m(-(k+27),y+1.5,o*.5+25),m(-(k+25),y,C),m(-(s.Wm+17),c+1,o*.12),m(-(s.Wm+9),c,-o*.14),m(-6,c-.5,-o*.26),T.clone(),m(8,c-2,-o*.42),m(14,c-3,-o*.5-25),m(18,c-4,-o*.5-80)],viewpoints:{reveal:m(-55,c-8,o*.5+70),profile:m(-110,c+6,0),astern:m(30,c+12,-o*.5-75)},glowPoints:[.06,.22,.4,.58,.82].map((b,M)=>({position:m(0,c,o*(.5-b)),color:M%2?A(g,1):"#e4f5ff",intensity:[1.2,1.6,1.5,1,.7][M],radius:[14,22,22,16,18][M]}))},N=new i.Matrix4;return{object:e,radius:o*.55,height:c+o*.2,center:m(0,c,0),anchors:L,ground:!0,groundY:0,uniforms:F,streetGlow:S,info:{variety:l,length:o,altitude:c,bodyHalfHeight:s.Hm,bodyHalfWidth:s.Wm,finScale:s.finScale},setProgress(b){F.uReveal.value=D(b,0,1)},setTurn(b){F.uTurn.value=D(b,-1,1)*.5},update(b,M,P){F.uTime.value=M,P&&(f.updateWorldMatrix(!0,!1),F.uCamLocal.value.copy(P.position).applyMatrix4(N.copy(f.matrixWorld).invert()))},dispose(){}}}export{re as buildHero};
