import*as i from"three";import{clamp as Z,lerp as D,smoothstep as F}from"../kit/core.js";const ue=["#02040c","#0b1238","#2a1458","#7a4dff","#ff4fd8","#19e6c8","#e8ff7a"],H=Math.PI*2,re=e=>e-H*Math.round(e/H);function pe(){return{pos:[],nor:[],uv:[],hk:[],idx:[],n:0}}function ee(e,c,l){const d=[0];for(let f=1;f<e.length;f++)d.push(d[f-1]+e[f].distanceTo(e[f-1]));const g=d[d.length-1],x=Math.max(2,Math.round(g/l)),v=[],n=[];let a=0;for(let f=0;f<=x;f++){const h=f/x*g;for(;a<d.length-2&&d[a+1]<h;)a++;const S=Z((h-d[a])/Math.max(1e-6,d[a+1]-d[a]),0,1);v.push(new i.Vector3().lerpVectors(e[a],e[a+1],S)),n.push(D(c[a],c[a+1],S))}return{pts:v,rads:n,length:g,step:g/x}}function ie(e){const c=e.length,l=[],d=[],g=[];for(let n=0;n<c;n++){const a=e[Math.max(0,n-1)],f=e[Math.min(c-1,n+1)];l.push(new i.Vector3().subVectors(f,a).normalize())}const x=Math.abs(l[0].y)>.9?new i.Vector3(1,0,0):new i.Vector3(0,1,0);d.push(new i.Vector3().crossVectors(x,l[0]).normalize()),g.push(new i.Vector3().crossVectors(l[0],d[0]).normalize());const v=new i.Vector3;for(let n=1;n<c;n++){const a=d[n-1].clone();v.crossVectors(l[n-1],l[n]);const f=v.length();f>1e-6&&(v.multiplyScalar(1/f),a.applyAxisAngle(v,Math.asin(Math.min(1,f)))),a.addScaledVector(l[n],-a.dot(l[n])).normalize(),d.push(a),g.push(new i.Vector3().crossVectors(l[n],a).normalize())}return{T:l,N:d,B:g}}function q(e,c,l,d){const{T:g,N:x,B:v}=ie(c),n=d.radial,a=c.length,f=e.n,h=d.lobes||0,S=d.lobeAmp||0,z=d.lobeTwist||0,y=d.bump||0,C=d.noise;let b=0;const u=new i.Vector3,M=new i.Vector3;for(let T=0;T<a;T++){T>0&&(b+=c[T].distanceTo(c[T-1]));const t=c[T],s=l[T];for(let p=0;p<=n;p++){const k=p/n*H,P=Math.cos(k),V=Math.sin(k),_=h?S*Math.cos(h*k+z*b):0,B=h?-S*h*Math.sin(h*k+z*b):0,A=y&&C?y*C.n3(P*1.3+(d.seed||0)*17,V*1.3,b*.11):0,G=s*(1+_+A);u.copy(t).addScaledVector(x[T],P*G).addScaledVector(v[T],V*G);const K=B/(1+_);M.set(0,0,0).addScaledVector(x[T],P+V*K).addScaledVector(v[T],V-P*K).normalize(),e.pos.push(u.x,u.y,u.z),e.nor.push(M.x,M.y,M.z),e.uv.push(p/n,b),e.hk.push((d.H0||0)+b,d.kind||0,d.seed||0)}}const R=n+1;for(let T=0;T<a-1;T++)for(let t=0;t<n;t++){const s=f+T*R+t,p=s+1,k=s+R,P=k+1;e.idx.push(s,p,k,p,P,k)}return e.n+=a*R,b}function fe(e){const c=new i.BufferGeometry;return c.setAttribute("position",new i.Float32BufferAttribute(e.pos,3)),c.setAttribute("normal",new i.Float32BufferAttribute(e.nor,3)),c.setAttribute("aUV",new i.Float32BufferAttribute(e.uv,2)),c.setAttribute("aHK",new i.Float32BufferAttribute(e.hk,3)),c.setIndex(new i.Uint32BufferAttribute(e.idx,1)),c}function te(e){if(e<=13)return 8.5;if(e>=24)return 0;const c=(e-13)/11;return 8.5*Math.sqrt(1-c*c)}const U=32,L=96,J=e=>7.6+1.6*((e-58)/26)*((e-58)/26);async function de(e,c,l,d){const g=pe(),x=9,v=i.Vector3,n=l.turns,a=[];for(let t=0;t<x;t++){const s=t===0||t===x-1,p=t%2;a.push({i:t,front:s,set:p,sidx:t>>1,thB:(20+40*t)*Math.PI/180+(s?0:e.range(-.07,.07)),dir:p===0?1:-1,r0:s?3.5:p===0?e.range(3.2,3.6):e.range(2.7,3.1),tip:e.range(29,38),pw:e.range(2.3,3),drift:e.range(-.28,.28),ph:e.range(0,H)})}const f=(t,s)=>t.thB+t.dir*n*H*F(U,L,s),h=(t,s)=>{const p=F(U,U+10,s)*(1-F(L-9,L,s));if(p<=0)return 0;let k=0;const P=f(t,s);for(const V of a){if(V.set===t.set)continue;const _=re(P-f(V,s))/.38;k+=(t.sidx+V.sidx&1?-1:1)*(t.set===0?1:-1)*Math.exp(-_*_)}return k*1.55*p},S=a.map(t=>({s:t,a:(f(t,L)%H+H)%H})).sort((t,s)=>t.a-s.a),z=new Set;for(;z.size<2;)z.add(e.int(0,x-1));S.forEach((t,s)=>{const p=t.s,k=S[0].a+s/x*H+e.range(-.16,.16);p.curl=Z(re(k-t.a),-.9,.9),p.leader=z.has(s),p.L=p.leader?e.range(15,24):e.range(54,76)*l.spread,p.rise=p.leader?e.range(30,36):l.rise*e.range(.85,1.15),p.droop=l.droop*e.range(.8,1.2)});const y=[],C=[],b=[];for(const t of a){const s=[],p=[],k=t.i===0?1:-1,P=J(U);for(let o=-4;o<U;o+=.5){const w=Math.pow(1-(o+4)/(U+4),t.front?2.2:t.pw);let r,m,N;if(t.front){const W=k*(te(o)+4.6+.9),j=8.65+(33-8.65)*w,Q=F(22,U,o);r=D(W,P*Math.sin(t.thB),Q),m=D(j,P*Math.cos(t.thB),Q),N=D(4.3,t.r0,F(18,40,o))}else{const W=t.thB+t.drift*w+.06*Math.sin(o*.3+t.ph)*w,j=P+(t.tip-P)*w;r=j*Math.sin(W),m=j*Math.cos(W),N=t.r0*(1+.28*F(26,8,o))}N*=.5+.5*F(-4,4,o);const E=F(U,U-9,o)*(t.front?.55:1.1);r+=E*c.n2(o*.1+t.i*9.3,3.1),m+=E*c.n2(o*.1+1.7,t.i*7.1),s.push(new v(r,o,m)),p.push(N)}b.push(s[8].clone());for(let o=U;o<L;o+=.5){const w=f(t,o),r=J(o)+h(t,o);s.push(new v(r*Math.sin(w),o,r*Math.cos(w))),p.push(t.front?D(4.3,t.r0,F(18,40,o)):t.r0)}const V=f(t,L),_=J(L),B=s.length;for(let o=0;o<=90;o++){const w=o/90,r=V+t.curl*w+.12*Math.sin(w*7+t.ph)*w,m=_+t.L*Math.pow(w,1.15),N=L+(t.leader?t.rise*(1.15*w-.15*w*w):t.rise*(1-Math.pow(1-w,3))-t.droop*Math.pow(w,2.2))+1.3*Math.sin(w*9+t.ph)*w;s.push(new v(m*Math.sin(r),N,m*Math.cos(r))),p.push(t.r0*(1-.92*Math.pow(w,.62))+.2)}const A=ee(s,p,1.65);t.line=A,y.push(t),q(g,A.pts,A.rads,{radial:12,kind:0,seed:t.i/x+.03,H0:0,lobes:3,lobeAmp:.12,lobeTwist:.05*t.dir,bump:.1,noise:c});const G=Math.floor(B/s.length*A.pts.length)+6;for(let o=G;o<A.pts.length;o++){const w=(o-G)/(A.pts.length-G);C.push({p:A.pts[o],H:o*A.step,w:t.leader?.35:.5+w})}const K=t.leader?1:e.int(2,3);for(let o=0;o<K;o++){const w=G+Math.floor((A.pts.length-G)*e.range(.16,.72)),r=A.pts[w],m=Math.atan2(r.x,r.z),N=o%2?1:-1,E=m+N*e.range(.55,1),W=e.range(20,36),j=e.range(3,9),Q=e.range(8,16),ae=[],se=[],le=A.rads[w]*.62,ce=e.range(0,H);for(let I=0;I<=40;I++){const O=I/40,ne=E+N*.35*O;ae.push(new v(r.x+Math.sin(ne)*W*O,r.y+j*Math.sin(O*2.2)-Q*O*O+.8*Math.sin(O*8+ce)*O,r.z+Math.cos(ne)*W*O)),se.push(le*(1-.85*Math.pow(O,.7))+.16)}const Y=ee(ae,se,1.5);q(g,Y.pts,Y.rads,{radial:6,kind:0,seed:e(),H0:w*A.step,lobes:3,lobeAmp:.06});for(let I=2;I<Y.pts.length;I++)C.push({p:Y.pts[I],H:w*A.step+I*Y.step,w:.7+I/Y.pts.length})}await d()}const u=[];for(const t of[1,-1])for(const[s,p,k]of[[15.5,2.2,2.7],[24,1.2,3]]){const P=[],V=[],_=e.range(27,31);for(let B=-4;B<=_;B+=.5){const A=Math.pow(1-(B+4)/(_+4),2),G=F(_-9,_,B),K=t*(te(B)+k+.7+p*(1-G)),o=7.5+(s-7.5)*A;P.push(new v(D(K,t*4.5,G),B,D(o,7,G))),V.push(k*(.55+.45*F(-4,5,B))*(1-.35*G))}u.push({pts:P,rads:V,radial:10})}let M=0;for(;u.length<4+l.props&&M++<200;){const t=e.range(0,H),s=e.range(14,46),p=e.range(15,31),k=e.range(-.35,.35),P=e.range(1,2),V=[],_=[];let B=!0;for(let A=0;A<=40&&B;A++){const G=A/40,K=J(Math.max(s,U))-1.5+(p-6)*Math.pow(G,1.15),o=-3.5+(s+3.5)*Math.pow(1-G,2.1),w=t+k*G,r=K*Math.sin(w),m=K*Math.cos(w);m>0&&Math.abs(r)<te(o)+P+6.5&&o<30&&(B=!1),V.push(new v(r,o,m)),_.push(P*(1-.45*G))}B&&u.push({pts:V.reverse(),rads:_.reverse(),radial:8})}for(const t of u){const s=ee(t.pts,t.rads,1.5);q(g,s.pts,s.rads,{radial:t.radial,kind:0,seed:e(),H0:4,lobes:2,lobeAmp:.08,bump:.06,noise:c}),b.push(s.pts[3].clone()),t.line=s}await d();const R=[y[0],y[x-1],...e.shuffle(y.slice(1,x-1)).slice(0,l.vines-2)];for(const t of R){const s=t.line,p=ie(s.pts),k=s.pts.length,P=t.front?20:3,V=Math.floor(k*e.range(.6,.78)),_=e.range(.16,.26)*e.sign(),B=e.range(.24,.34)*1.45;let A=e.range(0,H);const G=[],K=[];for(let o=P;o<V;o++)for(let w=0;w<2;w++){const r=w/2,m=Math.min(k-1,o+1),N=new v().lerpVectors(s.pts[o],s.pts[m],r),E=D(s.rads[o],s.rads[m],r)*1.1+B*.6,W=new v().lerpVectors(p.N[o],p.N[m],r),j=new v().lerpVectors(p.B[o],p.B[m],r);A+=_*s.step*.5,G.push(N.addScaledVector(W,Math.cos(A)*E).addScaledVector(j,Math.sin(A)*E)),K.push(B*(.5+.5*F(V,V-12,o)))}q(g,G,K,{radial:8,kind:1,seed:e(),H0:P*s.step*.8}),await d()}{const t=[],s=[];for(let p=-2;p<=104;p+=3)t.push(new v(0,p,0)),s.push((J(Z(p,U,L))-3.1)*(1-F(92,106,p)*.9)*(p<U?1+(U-p)*.012:1));q(g,t,s,{radial:16,kind:2,seed:.5,H0:40,lobes:5,lobeAmp:.06,lobeTwist:.12,bump:.12,noise:c})}await d();const T=fe(g);return await d(),{geometry:T,triangles:g.idx.length/3,boughs:C,strands:y,rootFeet:b}}const $=`
uniform float uTime, uCyc, uPeriod, uPulseT, uAwake, uOpen, uV, uCrownAt;
float hash21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x), mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x), f.y); }
// value noise periodic in x with period per (for the seam of a tube)
float vnoiseP(vec2 p, float per){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  float x0=mod(i.x,per), x1=mod(i.x+1.,per);
  return mix(mix(hash21(vec2(x0,i.y)),hash21(vec2(x1,i.y)),f.x), mix(hash21(vec2(x0,i.y+1.)),hash21(vec2(x1,i.y+1.)),f.x), f.y); }
// the heartbeat: 1 when the pulse front (which reaches this point arr seconds into the cycle) is here, then an afterglow
float pulseK(float arr, float k){ float t = uCyc - arr; t = mod(t + uPeriod*0.25, uPeriod) - uPeriod*0.25;
  return t < 0. ? exp(-t*t*40.) : exp(-t*k); }
float pulseAt(float arr){ return pulseK(arr, 1.25); }
`,oe=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    col *= exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    col *= 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#endif
`,ve=`
attribute vec2 aUV; attribute vec3 aHK;
varying vec2 vUv; varying vec3 vHK; varying vec3 vWN; varying vec3 vWP; varying float vLY;
#include <fog_pars_vertex>
${$}
void main(){
  vUv = aUV; vHK = aHK; vLY = position.y;
  float p = pulseAt(aHK.x/uV);
  vec3 pos = position + normal * (p * (aHK.y > 1.5 ? 0.5 : 0.22));      // roots swell as the light passes
  vec4 wp = modelMatrix * vec4(pos, 1.0);
  vWP = wp.xyz; vWN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,he=`
uniform vec3 uBark0, uBark1, uViolet, uRose, uGold, uMoonCol, uMoonDir, uSky;
varying vec2 vUv; varying vec3 vHK; varying vec3 vWN; varying vec3 vWP; varying float vLY;
#include <fog_pars_fragment>
${$}
void main(){
  vec3 N = normalize(vWN), Vd = normalize(cameraPosition - vWP);
  float H = vHK.x, kind = vHK.y, seed = vHK.z;
  float p = pulseK(H/uV, 2.5);
  vec3 col;
  if (kind < 0.5) {
    // root / bough: dark grooved skin; thin light-carrying fibres show through it
    float wv = vnoiseP(vec2(vUv.x*5., vUv.y*0.13 + seed*9.), 5.) - 0.5;
    float f1 = vnoiseP(vec2(vUv.x*11. + wv*1.3, vUv.y*0.045 + seed*31.), 11.);
    float f2 = vnoiseP(vec2(vUv.x*26. + wv*2.0, vUv.y*0.11 + seed*17.), 26.);
    float f3 = vnoiseP(vec2(vUv.x*48., vUv.y*0.5 + seed*5.), 48.);
    float rd1 = 1. - abs(2.*f1 - 1.), rd2 = 1. - abs(2.*f2 - 1.);
    float dist = length(cameraPosition - vWP), nearK = 1. - smoothstep(34., 80., dist), farK = smoothstep(40., 170., dist);
    // thin light-carrying fibres, widened (and dimmed) with distance so they never get thinner than a pixel
    float vw1 = clamp(dist*0.0011, 0., 0.35), vw2 = clamp(dist*0.0024, 0., 0.4);
    float veins = smoothstep(0.87 - vw1, 0.99, rd1) * (0.1/(0.12 + vw1)) + 0.55*smoothstep(0.89 - vw2, 0.995, rd2) * (0.085/(0.105 + vw2));
    float halo = smoothstep(0.5, 0.97, rd1)*0.7 + smoothstep(0.6, 0.98, rd2)*0.3;       // their glow inside the flesh
    // close up the skin is a rope of fibres: wandering ridges along the root, with short cross cracks. Both melt to their
    // mean before they get thinner than a pixel, and they stay out of the bump (screen-space derivatives would sparkle).
    // Three scales: the braid (5 strands round the root, in the bump), rope ridges (20) and fine fibres (61).
    float fw = fwidth(vUv.x), a1 = 1. - smoothstep(0.08, 0.22, fw*20.), a2 = 1. - smoothstep(0.1, 0.3, fw*22.), a3 = 1. - smoothstep(0.08, 0.22, fw*61.);
    float ridge = 0.5 + 0.5*sin((vUv.x*20. + wv*0.7 + f1*0.35 + vUv.y*0.045) * 6.2832);          // rope strands, laid with a slow twist
    float ridge2 = 0.5 + 0.5*sin((vUv.x*61. + wv*1.1 + f2*0.6 - vUv.y*0.06) * 6.2832);
    float braid = 0.5 + 0.5*sin((vUv.x*5. + wv) * 6.2832);
    float g3 = vnoiseP(vec2(vUv.x*22. + seed*3., vUv.y*0.9 + f2*1.5), 22.);
    float crack = (1. - smoothstep(0.0, 0.09, abs(g3 - 0.5))) * smoothstep(0.4, 0.62, f3) * a2;
    float fib = mix(1., (0.08 + 1.5*ridge*sqrt(ridge)) * mix(1., 0.55 + 0.9*ridge2, a3*nearK) * (1. - 0.6*crack), nearK*a1);
    fib *= mix(1., 0.45 + 0.8*braid, nearK);                              // the hollows between the strands stay dark
    float hm = mix(f2*0.45 + f3*0.35 + rd1*0.2, f3*0.25 + rd1*0.08, nearK) + 0.35*braid + 0.3*ridge*a1*nearK;      // close up the relief is rope, not swirls
    vec3 sx = dFdx(vWP), sy = dFdy(vWP), r1 = cross(sy, N), r2 = cross(N, sx);
    float det = dot(sx, r1);
    vec3 grad = sign(det) * (dFdx(hm)*r1 + dFdy(hm)*r2);
    vec3 Ng = N;
    N = normalize(abs(det)*N - grad*0.9*smoothstep(0.05, 0.5, dot(N, Vd)));
    float ndv = clamp(dot(N, Vd), 0., 1.), ndvG = clamp(dot(Ng, Vd), 0., 1.);
    vec3 albedo = mix(uBark0, uBark1, f1*0.6 + f3*0.4) * (0.5 + 0.7*hm);
    albedo *= fib;
    float up = N.y*0.5 + 0.5;
    float hgt = smoothstep(50., 112., vLY);
    vec3 amb = uSky*(0.25 + 0.75*up) + uRose*0.5*hgt*(1. - up*0.7) + uViolet*0.05;
    col = albedo * (amb * mix(1., 0.5, nearK) + uMoonCol*max(dot(N, uMoonDir), 0.)*0.9);
    float fres = pow(1. - ndv, 3.);
    float back = smoothstep(-0.55, 0.5, dot(N, uMoonDir));
    col += albedo * mix(uViolet, uRose, 0.4) * (0.5 + 0.5*up) * 0.12 * nearK * uAwake;      // close up the bark is lit by the curtain and the portal
    float rimG = pow(1. - ndvG, 3.) * smoothstep(-0.55, 0.5, dot(Ng, uMoonDir));        // a clean moon rim on the true edge
    col += uMoonCol * mix(fres * back * 0.28, rimG * 0.34 + fres * back * 0.06, nearK) * fib;
    col += uViolet * fres * 0.05;
    // translucency: looking straight into a root you see the light inside it
    float depth = ndv*ndv;
    float farG = smoothstep(28., 64., dist), veinK = mix(0.07, 1., farG);      // close up the light is carried by fine fibres, not smears
    vec3 inner = mix(uViolet, uRose, 0.25) * (0.012 + 0.06*halo*veinK + 0.5*veins*veinK) * depth * uAwake;
    float strand = smoothstep(0.82, 1.0, ridge2) * a3 * nearK * smoothstep(0.42, 0.7, vnoiseP(vec2(vUv.x*13. + seed*5., vUv.y*0.07 + seed*11.), 13.));
    float run2 = pow(max(0., sin(H*0.42 - uTime*2.4 + seed*40. + f1*5.)), 6.);
    inner += (mix(uViolet, uRose, 0.35) * 0.3 * uAwake + uGold * (run2*0.7*uAwake + p*3.0)) * strand * (0.35 + 0.65*depth);
    float bead = pow(max(0., sin(H*0.42 - uTime*2.4 + seed*40.)), 22.);
    inner += uGold * bead * veins * 1.6 * depth * uAwake * farG;
    // the climbing pulse: a band ~18 m long; fibres carry it close up, from across the clearing the whole root glows
    inner += uGold * p * (0.04 + 0.13*halo*halo + 3.4*veins*veinK + farK*(1.5 + 2.5*halo)) * (0.25 + 0.75*depth);
    col += inner;
  } else if (kind < 1.5) {
    // creeper vine: rose light with slow beads
    float ndv = clamp(dot(N, Vd), 0., 1.);
    float beads = pow(max(0., sin(vUv.y*1.15 + seed*30. - uTime*0.35)), 10.);
    float limb = ndv*ndv;                                                  // a lit cord: bright along its middle, dark at the edges
    col = (mix(uRose, uViolet, 0.22) * (0.14 + 4.0*beads) * uAwake * (1. + 1.2*p) + uGold * p * beads * 1.5) * (0.12 + 0.88*limb);
  } else {
    // core: a bundle of luminous fibres
    float ndv = clamp(dot(N, Vd), 0., 1.);
    float c1 = vnoiseP(vec2(vUv.x*14., vUv.y*0.06 - uTime*0.02), 14.);
    float c2 = vnoiseP(vec2(vUv.x*34., vUv.y*0.25 - uTime*0.08), 34.);
    float fibc = smoothstep(0.78, 0.97, 1. - abs(2.*c1 - 1.)) + 0.5*smoothstep(0.8, 0.97, 1. - abs(2.*c2 - 1.));
    col = uViolet*0.025 + mix(uViolet, uRose, 0.4)*fibc*0.4*uAwake + uGold*p*(0.05 + 3.0*fibc);
    col *= 0.4 + 0.6*ndv;
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,me=`
attribute vec4 iA; attribute vec4 iB;
uniform float uViewH, uVf, uHeart;
varying float vT; varying float vSide; varying float vFade; varying float vPulse; varying float vNear; varying vec3 vSeed;
#include <fog_pars_vertex>
${$}
void main(){
  float t = position.y, side = position.x, len = iA.w, ph = iB.x;
  vec3 a = iA.xyz, p = a;
  float tt = t*t;
  p.y -= len*t;
  p.xz += vec2(sin(uTime*0.45 + ph + t*1.7), cos(uTime*0.37 + ph*1.3 + t*2.1)) * (0.5 + len*0.03) * tt
        + vec2(sin(uTime*1.3 + ph*2. + t*6.), cos(uTime*1.1 + ph + t*5.)) * 0.16 * t;
  vec2 rad = normalize(a.xz + vec2(1e-3));
  p.xz += rad * uHeart * 2.2 * tt;                                   // the canopy swells with each beat
  float part = (1. - smoothstep(6., 28., abs(a.x))) * smoothstep(28., 58., a.z);
  p.x += sign(a.x) * part * uOpen * 7. * t;                          // the curtain draws apart on approach
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec3 toCam = cameraPosition - wp.xyz; float dist = length(toCam); toCam /= dist;
  vec3 sideDir = normalize(cross(toCam, vec3(0., 1., 0.)));
  float tipB = step(0.999, t);
  float w = iB.z * (1. - 0.6*tipB);
  float wmin = 1.25 * dist * 2. / (projectionMatrix[1][1] * uViewH);
  vFade = min(1., w / wmin); w = max(w, wmin);
  wp.xyz += sideDir * side * w * 0.5;
  vT = t; vSide = side; vSeed = vec3(ph, len, iB.w);
  vPulse = pulseK(iB.y + t*len/uVf, 3.2);
  vNear = 1. - smoothstep(8., 42., dist);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ge=`
uniform vec3 uViolet, uRose, uTip;
varying float vT; varying float vSide; varying float vFade; varying float vPulse; varying float vNear; varying vec3 vSeed;
#include <fog_pars_fragment>
${$}
void main(){
  float edge = 1. - min(abs(vSide), 1.);      // clamped: antialiasing samples a hair-thin ribbon outside its own width, where this went negative
  vec3 base = mix(uViolet*1.6, uRose, smoothstep(0.1, 0.8, vT + vSeed.z*0.25));
  float run = pow(max(0., sin(vT*vSeed.y*0.21 - uTime*1.5 + vSeed.x*7.)), 14.);
  float tip = smoothstep(1. - 0.9/vSeed.y, 1.0, vT);
  float I = (0.05 + 0.085*vT + 0.4*run) * uAwake * (1. + 0.4*vNear) + vPulse * 0.34;
  vec3 col = base * I + uTip * tip * (0.9 + 1.0*vPulse) * (1. - 0.45*vNear) * edge;
  col *= (0.55 + 0.45*edge) * vFade * smoothstep(0.0, 0.04, vT);
  ${oe}
  gl_FragColor = vec4(col, 1.0);
}`,we=`
attribute vec4 aS; attribute vec2 aKS;      // seeds; (kind, size in metres)
uniform float uViewH, uHalo;
varying float vI; varying float vMix;
#include <fog_pars_vertex>
${$}
void main(){
  vec3 p = position; float kind = aKS.x, I = 1., al = 1.;
  if (kind < 0.5) {
    // crown bursts: one puff per beat, three beats visible, decelerating as they climb
    float life = 3. * uPeriod;
    float age = mod(uPulseT - aS.x * life, life);
    float c = cos(age*0.07*(aS.y - .5)*4.), s = sin(age*0.07*(aS.y - .5)*4.);
    p.xz = mat2(c, -s, s, c) * p.xz * (1. + age*0.07);
    p.y += 108. * (1. - exp(-age/11.)) * (0.75 + 0.5*aS.w);
    p.xz += vec2(sin(age*0.5 + aS.z*40.), cos(age*0.43 + aS.w*40.)) * (1. + age*0.3);
    al = smoothstep(0., 0.5, age) * pow(1. - age/life, 1.4);
    I = 1.8 + 3.6*exp(-age*0.45);
  } else if (kind < 1.5) {
    // ambient spores rising everywhere under the canopy; they flash as the ripple passes outward
    float sp = 0.9 + aS.x*1.7;
    p.y = mod(position.y + uTime*sp, 64.);
    p.xz += vec2(sin(uTime*0.31 + aS.z*40. + p.y*0.12), cos(uTime*0.27 + aS.w*40. + p.y*0.1)) * (1.2 + 2.*aS.y);
    al = smoothstep(0., 4., p.y) * (1. - smoothstep(48., 64., p.y)) * (0.55 + 0.45*sin(uTime*(0.8 + aS.y*2.) + aS.z*40.));
    I = 1.4 + 3.0*pulseAt(uCrownAt + length(position.xz)/60.);
  } else {
    // the halo round the portal seat: a slow wheel of spores just outside the 14 m disc
    float ang = aS.x*6.2832 + uTime*0.10*(aS.y - 0.35);
    float r = 7.7 + aS.z*aS.z*6.5 + 0.5*sin(uTime*0.6 + aS.w*30.);
    p = position + vec3(cos(ang)*r, sin(ang)*r, (aS.w - 0.5)*7. + 1.5*sin(uTime*0.2 + aS.x*20.));
    al = (0.35 + 0.65*uHalo) * (0.6 + 0.4*sin(uTime*1.3 + aS.z*50.));
    I = 1.3 + 2.5*pulseAt(0.2);
  }
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  float px = aKS.y * uViewH * projectionMatrix[1][1] * 0.5 / max(0.5, -mvPosition.z);
  al *= min(1., px/1.6);
  gl_PointSize = clamp(px, 1.6, 48.);
  vI = I * al; vMix = aS.y;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,xe=`
uniform vec3 uRose, uTip;
varying float vI; varying float vMix;
#include <fog_pars_fragment>
void main(){
  float d = length(gl_PointCoord - 0.5) * 2.;
  float a = max(0., 1. - d); a *= a;
  vec3 col = (mix(uRose, uTip, 0.25*vMix) * a + uTip * a*a*a * 0.6) * vI;
  ${oe}
  gl_FragColor = vec4(col, 1.0);
}`,ye=`
attribute vec2 aC; attribute vec3 aP;       // corner; (size, kind, pulse arrival)
varying vec2 vC; varying float vK; varying float vPu;
#include <fog_pars_vertex>
${$}
void main(){
  vC = aC; vK = aP.y; vPu = pulseAt(aP.z);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  mvPosition.xy += aC * aP.x * 0.5 * (1. + 0.12*vPu);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,be=`
uniform vec3 uRose, uGold, uViolet; uniform float uGlow;
varying vec2 vC; varying float vK; varying float vPu;
#include <fog_pars_fragment>
${$}
void main(){
  float d = length(vC); float a = max(0., 1. - d); a = a*a*(0.4 + 0.6*a);
  vec3 col;
  if (vK < 0.5) col = mix(uViolet, uRose, 0.75) * (0.03 + 0.18*vPu) * uAwake;      // the heart-glow of the crown
  else if (vK < 1.5) col = uGold * 0.3 * vPu;                                        // pulse bloom climbing the trunk
  else col = mix(uGold, uRose, 0.6) * (0.02 + 0.10*vPu);                             // light spilling from the cleft
  col *= a * uGlow;
  ${oe}
  gl_FragColor = vec4(col, 1.0);
}`,Me=`
varying vec3 vP; varying vec3 vWN; varying vec3 vWP;
#include <fog_pars_vertex>
void main(){
  vP = position; vWN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0); vWP = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ae=`
uniform vec3 uBark0, uViolet, uRose, uGold, uMoonCol, uMoonDir, uSky; uniform float uRim;
varying vec3 vP; varying vec3 vWN; varying vec3 vWP;
#include <fog_pars_fragment>
${$}
// one layer of glowing moss specks: sparse cells, each with its own place, size, brightness and twinkle
float specks(vec2 p, float keep){
  vec2 g = floor(p), f = fract(p);
  float h = hash21(g + 3.1), sz = hash21(g + 11.3); sz = mix(0.07, 0.26, sz*sz);
  vec2 o = vec2(hash21(g), hash21(g + 7.7))*0.64 + 0.18;
  float tw = 0.6 + 0.4*sin(uTime*(0.5 + 1.5*hash21(g + 17.)) + h*40.);
  return smoothstep(sz, sz*0.2, length(f - o)) * step(keep, h) * (0.3 + 0.7*hash21(g + 5.9)) * tw;
}
void main(){
  vec3 N = normalize(vWN), Vd = normalize(cameraPosition - vWP);
  float rho = length(vP.xz);
  float n = vnoise(vP.xz*0.22)*0.6 + vnoise(vP.xz*0.9)*0.4;
  float cells = vnoise(vP.xz*2.6);
  vec2 wq = vP.xz + (vec2(vnoise(vP.xz*0.31), vnoise(vP.xz*0.31 + 19.)) - 0.5)*3.2;      // warped, so no rows
  float patchy = smoothstep(0.38, 0.66, n);
  float dist = length(cameraPosition - vWP), nearA = 1. - smoothstep(14., 40., dist);
  float speck = (specks(wq*0.83, 0.6) + specks(mat2(0.8, -0.6, 0.6, 0.8)*wq*1.57 + 31., 0.7)*0.8) * patchy;
  speck = speck * (1. + 2.*nearA) + specks(mat2(0.6, 0.8, -0.8, 0.6)*wq*3.3 + 7., 0.55) * 1.4 * nearA * (0.35 + 0.65*patchy);      // close up: brighter, with a finer layer
  float moss = smoothstep(0.45, 0.7, n);
  vec3 albedo = mix(uBark0*0.5, uBark0*vec3(0.65, 1.0, 0.9), moss) * (0.6 + 0.6*cells);
  vec3 col = albedo * (uSky*(0.4 + 0.6*N.y) + uMoonCol*max(dot(N, uMoonDir), 0.)*1.2 + uRose*0.25);
  col += uMoonCol * pow(1. - max(dot(N, Vd), 0.), 4.) * smoothstep(-0.2, 0.6, dot(reflect(-Vd, N), uMoonDir)) * 0.22;
  float rip = pulseAt(uCrownAt + rho/60.);
  col += mix(uViolet, uRose, vnoise(vP.xz*0.7 + 5.)*0.6) * speck * (0.9 + 3.2*rip) * uAwake;
  col += uViolet * moss * 0.05 * (1. + 2.*rip);
  col += uGold * pulseAt(0.15) * exp(-rho/13.) * (0.03 + 0.10*moss);
  float al = 1. - smoothstep(uRim*0.55, uRim, rho);
  al *= smoothstep(0.02, 0.5, vP.y);                      // melts into the world's ground (y = 0) instead of cutting through it
  gl_FragColor = vec4(col, al);
  #include <fog_fragment>
}`;function X(e,c,l,d,g={}){const x=new i.ShaderMaterial({uniforms:i.UniformsUtils.merge([i.UniformsLib.fog,d||{}]),vertexShader:c,fragmentShader:l,fog:!0,...g});return Object.assign(x.uniforms,e),x}function ke(e,c,l,d,g){const v=[],n=[];for(let u=0;u<=8;u++){const M=u/8;v.push(-1,M,0,1,M,0)}for(let u=0;u<8;u++){const M=u*2;n.push(M,M+2,M+1,M+1,M+2,M+3)}const a=l.boughs,f=new Float32Array(a.length);let h=0;for(let u=0;u<a.length;u++)h+=a[u].w,f[u]=h;const S=new Float32Array(g*4),z=new Float32Array(g*4);let y=0,C=0;for(;y<g&&C++<g*6;){const u=e()*h;let M=0,R=a.length-1;for(;M<R;){const A=M+R>>1;f[A]<u?M=A+1:R=A}const T=a[M],t=T.p.x+e.gauss()*2.2,s=T.p.z+e.gauss()*2.2,p=T.p.y-.15,k=Math.hypot(t,s),P=Math.pow(F(22,78,k),1.25);let V=D(d.innerTip,d.rimTip,P)+e.range(-7,10)+8*c.n2(t*.045,s*.045)+(e.chance(.2)?e.range(4,26):0);const _=(1-F(9,21,Math.abs(t)))*F(0,14,s);V=Math.max(V,D(V,D(30,64,F(40,76,k)),_)),k<40&&V<20&&(V=20+e.range(0,8));const B=p-V;B<5||(S.set([t,p,s,B],y*4),z.set([e.range(0,H),T.H/d.V,e.range(.16,.3),e()],y*4),y++)}const b=new i.InstancedBufferGeometry;return b.setAttribute("position",new i.Float32BufferAttribute(v,3)),b.setIndex(n),b.setAttribute("iA",new i.InstancedBufferAttribute(S.subarray(0,y*4),4)),b.setAttribute("iB",new i.InstancedBufferAttribute(z.subarray(0,y*4),4)),b.instanceCount=y,b.boundingSphere=new i.Sphere(new i.Vector3(0,65,0),125),{geometry:b,triangles:y*8*2,count:y}}function Ve(e,c,l,d){const g=new Float32Array(l*3),x=new Float32Array(l*4),v=new Float32Array(l*2);for(let a=0;a<l;a++){const f=a/l,h=f<.46?0:f<.92?1:2;let S,z,y,C=e();if(h===0){const b=e.range(0,H),u=15*Math.sqrt(e());S=Math.cos(b)*u,y=Math.sin(b)*u,z=e.range(100,124),C=((e.int(0,2)*c.period+c.crownAt+.25+Math.abs(e.gauss())*.55)/(3*c.period)%1+1)%1}else if(h===1){const b=e.range(0,H),u=6+76*Math.pow(e(),.75);S=Math.cos(b)*u,y=Math.sin(b)*u,z=e.range(0,64)}else S=d.x,z=d.y,y=d.z-1.5;g.set([S,z,y],a*3),x.set([C,e(),e(),e()],a*4),v.set([h,h===0?e.range(.6,1.4):e.range(.28,.62)],a*2)}const n=new i.BufferGeometry;return n.setAttribute("position",new i.BufferAttribute(g,3)),n.setAttribute("aS",new i.BufferAttribute(x,4)),n.setAttribute("aKS",new i.BufferAttribute(v,2)),n.boundingSphere=new i.Sphere(new i.Vector3(0,110,0),190),n}function Se(e,c){const l=[[0,104,0,230,0,e.crownAt],[0,9,c.z-7,34,2,.25]];for(let a=0;a<5;a++){const f=18+a*19;l.push([0,f,0,58,1,(48+(f-10)*1.25)/e.V])}const d=[],g=[],x=[],v=[];l.forEach((a,f)=>{for(const h of[[-1,-1],[1,-1],[1,1],[-1,1]])d.push(a[0],a[1],a[2]),g.push(h[0],h[1]),x.push(a[3],a[4],a[5]);v.push(f*4,f*4+1,f*4+2,f*4,f*4+2,f*4+3)});const n=new i.BufferGeometry;return n.setAttribute("position",new i.Float32BufferAttribute(d,3)),n.setAttribute("aC",new i.Float32BufferAttribute(g,2)),n.setAttribute("aP",new i.Float32BufferAttribute(x,3)),n.setIndex(v),n.boundingSphere=new i.Sphere(new i.Vector3(0,80,0),200),n}function Pe(e,c,l){const x=[],v=[];for(let f=0;f<=26;f++){const h=l*Math.pow(f/26,.85);for(let S=0;S<=80;S++){const z=S/80*H,y=Math.sin(z)*h,C=Math.cos(z)*h;let b=3.4*Math.exp(-h/10)+.55*e.fbm2(y*.06+9,C*.06,3)+.25*e.n2(y*.3,C*.3);for(const u of c.rootFeet){const M=y-u.x,R=C-u.z;b+=1.5*Math.exp(-(M*M+R*R)/34)}C>4&&(b=D(Math.min(b,.7)*.6,b,F(6,13,Math.abs(y)))),b=b*(1-F(l*.6,l,h))-.6*F(l*.72,l,h),x.push(y,b,C)}}const n=81;for(let f=0;f<26;f++)for(let h=0;h<80;h++){const S=f*n+h,z=S+1,y=S+n,C=y+1;v.push(S,y,z,z,y,C)}const a=new i.BufferGeometry;return a.setAttribute("position",new i.Float32BufferAttribute(x,3)),a.setIndex(v),a.computeVertexNormals(),{geometry:a,triangles:v.length/3}}async function Te(e,c={}){const l=e.rng.fork?e.rng.fork("mother-tree"):e.rng,d=e.noise,g=(c.palette&&c.palette.length>=7?c.palette:ue).map(r=>new i.Color(r)),x=r=>new i.Color(r),v=c.period??8,n={period:v,V:45,Vf:38,turns:l.range(.78,1.12)*l.sign(),rise:l.range(20,28),droop:l.range(26,38),spread:l.range(.92,1.06),props:l.int(11,16),vines:l.int(7,9),innerTip:l.range(46,58),rimTip:l.range(7,13),hue:l.range(-1,1),crownAt:3},a=new i.Vector3(0,8.5,15),f=async()=>{e.yield&&await e.yield()},h=await de(l,d,n,f);{let r=0;for(const m of h.strands)r+=m.line.length*.62;n.crownAt=r/h.strands.length/n.V}await e.yield?.();const S=g[3].clone(),z=g[4].clone(),y=g[6].clone();n.hue<0?z.lerp(S,-n.hue*.22):z.lerp(x("#ff7ab0"),n.hue*.25);const C=x(c.moonColor||"#aab4ff"),b=(c.moonDir?c.moonDir.clone():new i.Vector3(0,.22,-1)).normalize(),u={uTime:{value:0},uCyc:{value:0},uPeriod:{value:v},uPulseT:{value:0},uAwake:{value:1},uOpen:{value:0},uV:{value:n.V},uCrownAt:{value:n.crownAt},uMoonDir:{value:b},uMoonCol:{value:C},uViolet:{value:S},uRose:{value:z},uGold:{value:y},uTip:{value:z.clone().lerp(x("#ffffff"),.3)},uBark0:{value:g[2].clone().lerp(x("#4a4670"),.5)},uBark1:{value:g[3].clone().lerp(x("#8f8ab8"),.5).multiplyScalar(.6)},uSky:{value:g[1].clone().lerp(C,.3).multiplyScalar(.32)},uViewH:{value:540},uVf:{value:n.Vf},uHeart:{value:0},uHalo:{value:.6},uGlow:{value:1},uRim:{value:52}},M=new i.Group;M.name="mother-tree";let R=h.triangles;const T=new i.Mesh(h.geometry,X(u,ve,he));if(h.geometry.computeBoundingSphere(),await f(),T.name="mother-tree-wood",M.add(T),c.apron!==!1){const r=Pe(d,h,u.uRim.value),m=new i.Mesh(r.geometry,X(u,Me,Ae,null,{transparent:!0}));await f(),m.name="mother-tree-apron",m.renderOrder=0,M.add(m),R+=r.triangles}await e.yield?.();const t=ke(l,d,h,n,c.filaments??4200),s=new i.Mesh(t.geometry,X(u,me,ge,null,{transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,side:i.DoubleSide}));s.name="mother-tree-filaments",s.frustumCulled=!1,s.renderOrder=2,M.add(s),R+=t.triangles,await e.yield?.();const p=new i.Points(Ve(l,n,c.spores??3600,a),X(u,we,xe,null,{transparent:!0,depthWrite:!1,blending:i.AdditiveBlending}));if(p.name="mother-tree-spores",p.frustumCulled=!1,p.renderOrder=3,M.add(p),c.halos!==!1){const r=Se(n,a),m=new i.Mesh(r,X(u,ye,be,null,{transparent:!0,depthWrite:!1,blending:i.AdditiveBlending}));m.name="mother-tree-halos",m.frustumCulled=!1,m.renderOrder=1,M.add(m),R+=14}await e.yield?.();let k=null,P=0;const V=l.range(0,v),_=new i.Vector2;function B(r){P=Z(r,0,1);const m=F(0,1,P);u.uOpen.value=m,u.uAwake.value=D(.75,1.1,m),u.uHalo.value=m}B(c.progress??.6);const A=r=>(r%v+v)%v,G=(r,m)=>{let N=r-m;return N=((N+v*.25)%v+v)%v-v*.25,N<0?Math.exp(-N*N*40):Math.exp(-N*1.25)};function K(r,m,N){const E=k??m+V;u.uTime.value=m,u.uPulseT.value=E,u.uCyc.value=A(E),u.uHeart.value=G(u.uCyc.value,n.crownAt),e.renderer&&(e.renderer.getDrawingBufferSize(_),_.y>0&&(u.uViewH.value=_.y))}K(0,0,null);const o=(r,m,N)=>new i.Vector3(r,m,N),w={portalSeat:{position:a.clone(),facing:o(0,0,1),radius:7,width:17,height:24},cleft:{apex:o(0,24,10),left:o(-8.5,0,15),right:o(8.5,0,15),floorY:.4},flyThrough:[o(0,9,240),o(0,8.8,190),o(0,8.5,135),o(0,8.5,100),o(0,8.5,78),o(0,8.5,45),a.clone()],gap:{position:o(0,10,78),width:20,height:55},pulseOrigin:o(0,0,0),crown:o(0,108,0),sporeTop:o(0,225,0),moonAxis:o(0,.2,-1).normalize(),viewpoints:{reveal:o(0,14,250),low:o(-70,6,150),under:o(20,6,52),flank:o(170,30,60)},clearance:{trunkRadius:13,rootRadius:38,canopyRadius:82,canopyTipY:n.rimTip}};return{object:M,radius:82,height:130,center:o(0,60,0),anchors:w,update:K,dispose(){},ground:!0,groundY:-.05,setProgress:B,setPulseClock(r){k=r},setLight(r={}){r.moonDir&&u.uMoonDir.value.copy(r.moonDir).normalize(),r.moonColor&&u.uMoonCol.value.set(r.moonColor),r.fogGlow!=null&&(u.uGlow.value=r.fogGlow)},pulse:{period:v,speed:n.V,crownAt:n.crownAt,rippleSpeed:60,cycle:r=>A(k??r+V)},uniforms:u,triangles:R,filamentCount:t.count}}export{Te as buildHero};
