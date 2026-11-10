import*as s from"three";const qt=3.7,Ot=-6.35,Le=60,Ta=330,Ua=130,bt=1980,Ea=100*Math.PI/180,Wa=85*Math.PI/180,ka=1020,Ia=1670,j=2048,_=Math.PI*2;async function Ha(x){const D=new Float64Array(2049),i=new Float64Array(2049),B=bt/2048,J=a=>{const n=Math.max(0,Math.min(1,(a-ka)/(Ia-ka)));return Wa*n*n*(3-2*n)},W=a=>Ea*(a/bt)*(a/bt)+J(a);for(let a=1;a<=2048;a++){const n=(a-1)*B,d=a*B,m=(n+d)/2;i[a]=i[a-1]+B*(Math.cos(W(n))+4*Math.cos(W(m))+Math.cos(W(d)))/6,D[a]=D[a-1]+B*(Math.sin(W(n))+4*Math.sin(W(m))+Math.sin(W(d)))/6}const I=(a,n)=>{const d=Math.max(0,Math.min(2047.999999,n/bt*2048)),m=Math.floor(d),p=d-m;return a[m]*(1-p)+a[m+1]*p},q=(a,n=[0,0,0])=>{const d=Ta*(Math.sin(a)+2*Math.sin(2*a)),m=Ta*(Math.cos(a)-2*Math.cos(2*a)),p=Ua*Math.sin(3*a),N=m+990,v=W(N);return n[0]=d,n[1]=I(D,N)+p*Math.cos(v),n[2]=I(i,N)-p*Math.sin(v),n},k=8192,S=new Float64Array(k+1);let c=q(0),r=[0,0,0];for(let a=1;a<=k;a++)q(a/k*_,r),S[a]=S[a-1]+Math.hypot(r[0]-c[0],r[1]-c[1],r[2]-c[2]),c=[r[0],r[1],r[2]];const l=S[k];await x?.();const g=a=>{a=(a%l+l)%l;let n=0,d=k;for(;d-n>1;){const m=n+d>>1;S[m]<=a?n=m:d=m}return(n+(a-S[n])/Math.max(1e-9,S[n+1]-S[n]))/k*_},b=a=>{const n=(a%_+_)%_/_*k,d=Math.min(k-1,Math.floor(n));return S[d]+(S[d+1]-S[d])*(n-d)},w=new Float64Array(j*3),h=new Float64Array(j*3),f=new Float64Array(j*3);for(let a=0;a<j;a++)q(g(a/j*l),r),w[a*3]=r[0],w[a*3+1]=r[1],w[a*3+2]=r[2],(a&1023)===1023&&await x?.();await x?.();for(let a=0;a<j;a++){const n=(a+j-1)%j*3,d=(a+1)%j*3,m=w[d]-w[n],p=w[d+1]-w[n+1],N=w[d+2]-w[n+2],v=Math.hypot(m,p,N);h[a*3]=m/v,h[a*3+1]=p/v,h[a*3+2]=N/v}const G=(a,n,d,m)=>{const p=a*h[m*3]+n*h[m*3+1]+d*h[m*3+2];a-=p*h[m*3],n-=p*h[m*3+1],d-=p*h[m*3+2];const N=Math.hypot(a,n,d);return[a/N,n/N,d/N]};let A=G(0,1,0,0);f[0]=A[0],f[1]=A[1],f[2]=A[2];for(let a=1;a<j;a++)A=G(A[0],A[1],A[2],a),f[a*3]=A[0],f[a*3+1]=A[1],f[a*3+2]=A[2];const T=G(A[0],A[1],A[2],0),z=h[1]*f[2]-h[2]*f[1],O=h[2]*f[0]-h[0]*f[2],P=h[0]*f[1]-h[1]*f[0];await x?.();const X=Math.atan2(T[0]*z+T[1]*O+T[2]*P,T[0]*f[0]+T[1]*f[1]+T[2]*f[2]);for(let a=0;a<j;a++){const n=-X*a/j,d=Math.cos(n),m=Math.sin(n),p=a*3,N=h[p],v=h[p+1],oe=h[p+2],we=f[p],pe=f[p+1],be=f[p+2],Pe=v*be-oe*pe,Fe=oe*we-N*be,xe=N*pe-v*we;f[p]=we*d+Pe*m,f[p+1]=pe*d+Fe*m,f[p+2]=be*d+xe*m}await x?.();const ee=(a,n={})=>{const d=(a/l%1+1)%1*j,m=Math.floor(d)%j,p=d-Math.floor(d),N=(m+1)%j,v=m*3,oe=N*3,we=n.C||(n.C=new s.Vector3),pe=n.T||(n.T=new s.Vector3),be=n.N||(n.N=new s.Vector3);return we.set(w[v]+(w[oe]-w[v])*p,w[v+1]+(w[oe+1]-w[v+1])*p,w[v+2]+(w[oe+2]-w[v+2])*p),pe.set(h[v]+(h[oe]-h[v])*p,h[v+1]+(h[oe+1]-h[v+1])*p,h[v+2]+(h[oe+2]-h[v+2])*p).normalize(),be.set(f[v]+(f[oe]-f[v])*p,f[v+1]+(f[oe+1]-f[v+1])*p,f[v+2]+(f[oe+2]-f[v+2])*p),be.addScaledVector(pe,-be.dot(pe)).normalize(),n},V={},te=new s.Vector3,ce=new s.Vector3,he=(a,n,d=0,m={})=>{ee(a,V),te.crossVectors(V.T,V.N);const p=m.up||(m.up=new s.Vector3),N=m.position||(m.position=new s.Vector3);return p.copy(V.N).multiplyScalar(Math.cos(n)).addScaledVector(te,Math.sin(n)),N.copy(V.C).addScaledVector(p,Le+d),(m.forward||(m.forward=new s.Vector3)).copy(V.T),(m.side||(m.side=new s.Vector3)).crossVectors(V.T,p),m},ne=a=>(ee(a,V),te.crossVectors(V.T,V.N),Math.atan2(te.y,V.N.y)),le=(a,n)=>(ee(a,V),te.crossVectors(V.T,V.N),ce.subVectors(n,V.C),Math.atan2(ce.dot(te),ce.dot(V.N))),ae=new Uint16Array(j*4*4),Se=s.DataUtils.toHalfFloat;for(let a=0;a<j;a++){for(let n=0;n<3;n++){const d=w[a*3+n],m=Math.round(d);ae[(0*j+a)*4+n]=Se(m),ae[(1*j+a)*4+n]=Se(d-m),ae[(2*j+a)*4+n]=Se(h[a*3+n]),ae[(3*j+a)*4+n]=Se(f[a*3+n])}for(let n=0;n<4;n++)ae[(n*j+a)*4+3]=Se(1)}const M=new s.DataTexture(ae,j,4,s.RGBAFormat,s.HalfFloatType);return M.minFilter=M.magFilter=s.NearestFilter,M.generateMipmaps=!1,M.needsUpdate=!0,{P:q,L:l,tOfS:g,sOfT:b,frameAt:ee,place:he,crownTheta:ne,thetaToward:le,tex:M}}const Vt=`
uniform sampler2D uFrames; uniform float uLen; uniform float uTubeR;
void knotFrame(float s, out vec3 C, out vec3 T, out vec3 N) {
  float x = fract(s / uLen) * ${j}.0;
  float fl = floor(x); float f = x - fl;
  int a = int(fl) & ${j-1}; int b = (a + 1) & ${j-1};
  vec3 c0 = texelFetch(uFrames, ivec2(a, 0), 0).xyz + texelFetch(uFrames, ivec2(a, 1), 0).xyz;
  vec3 c1 = texelFetch(uFrames, ivec2(b, 0), 0).xyz + texelFetch(uFrames, ivec2(b, 1), 0).xyz;
  vec3 t0 = texelFetch(uFrames, ivec2(a, 2), 0).xyz, t1 = texelFetch(uFrames, ivec2(b, 2), 0).xyz;
  vec3 n0 = texelFetch(uFrames, ivec2(a, 3), 0).xyz, n1 = texelFetch(uFrames, ivec2(b, 3), 0).xyz;
  C = mix(c0, c1, f);
  T = normalize(mix(t0, t1, f));
  vec3 n = mix(n0, n1, f);
  N = normalize(n - T * dot(n, T));
}
// R = the thing's own up, F = its forward (river direction turned by yaw about R), S = its side
void radialBasis(float s, float theta, float yaw, out vec3 C, out vec3 T, out vec3 R, out vec3 F, out vec3 S) {
  vec3 N; knotFrame(s, C, T, N);
  vec3 B = cross(T, N);
  R = cos(theta) * N + sin(theta) * B;
  vec3 A = cross(T, R);
  F = cos(yaw) * T + sin(yaw) * A;
  S = cross(R, F);
}
`,yt=`
uniform vec3 uSunDir, uSunCol, uPeach, uCream, uLilac, uTeal, uDeep, uAqua, uMoonAmb;
vec3 skyCol(vec3 d) {
  float h = d.y;
  vec3 up = mix(uPeach * 0.86, uCream * 0.84, smoothstep(0.0, 0.2, h));
  up = mix(up, uLilac * 0.9, smoothstep(0.14, 0.8, h));
  float sunSide = 0.5 + 0.5 * dot(d.xz / max(length(d.xz), 1e-3), uSunDir.xz / max(length(uSunDir.xz), 1e-3));
  vec3 dn = mix(uLilac * 0.62, uPeach * 0.74, 0.35 + 0.65 * sunSide);
  dn = mix(dn, uPeach * 0.8, smoothstep(-0.5, -0.02, h) * 0.5);
  return mix(dn, up, smoothstep(-0.05, 0.03, h));
}
// soft ambient from sky above and cloud sea below
vec3 skyAmbient(vec3 n) {
  float k = 0.5 + 0.5 * n.y;
  // uMoonAmb (night only, zero by day): a cool light wrapped round from the moon's side, so dark things keep a lit edge
  return mix(uPeach * 0.50, mix(uCream, uLilac, 0.55) * 0.62, k * k * (3.0 - 2.0 * k)) + uMoonAmb * (0.25 + 0.75 * smoothstep(-0.35, 0.75, dot(n, uSunDir)));
}
`;async function ja(x,C,D){const B=async()=>{const r=new Float32Array(65536);let l=1;for(let w=0;w<5;w++){const h=4<<w,f=new Float32Array(h*h),G=h/256,A=h-1;for(let T=0;T<h*h;T++)f[T]=x();for(let T=0;T<256;T++){const z=T*G,O=Math.floor(z),P=z-O,X=P*P*(3-2*P),ee=(O&A)*h,V=(O+1&A)*h;for(let te=0;te<256;te++){const ce=te*G,he=Math.floor(ce),ne=ce-he,le=ne*ne*(3-2*ne),ae=he&A,Se=he+1&A,M=f[ee+ae]+(f[ee+Se]-f[ee+ae])*le,a=f[V+ae]+(f[V+Se]-f[V+ae])*le;r[T*256+te]+=l*(M+(a-M)*X)}(T&127)===127&&await D?.()}l*=.5,w>=2&&await D?.()}let g=1e9,b=-1e9;for(let w=0;w<65536;w++)g=Math.min(g,r[w]),b=Math.max(b,r[w]);for(let w=0;w<65536;w++)r[w]=(r[w]-g)/(b-g);return r},J=await B();await D?.();const W=await B();await D?.();const I=new Uint8Array(256*256*4);let q=1e-6;const k=new Float32Array(256*256),S=new Float32Array(256*256);for(let r=0;r<256;r++)for(let l=0;l<256;l++){const g=r*256+l;k[g]=J[r*256+(l+1&255)]-J[r*256+(l+255&255)],S[g]=J[(r+1&255)*256+l]-J[(r+255&255)*256+l],q=Math.max(q,Math.abs(k[g]),Math.abs(S[g]))}for(let r=0;r<256*256;r++)I[r*4]=Math.round(255*(.5+.5*k[r]/q)),I[r*4+1]=Math.round(255*(.5+.5*S[r]/q)),I[r*4+2]=Math.round(255*J[r]),I[r*4+3]=Math.round(255*W[r]);const c=new s.DataTexture(I,256,256,s.RGBAFormat,s.UnsignedByteType);return c.wrapS=c.wrapT=s.RepeatWrapping,c.magFilter=s.LinearFilter,c.minFilter=s.LinearMipmapLinearFilter,c.generateMipmaps=!0,c.anisotropy=Math.min(8,C?.capabilities?.getMaxAnisotropy?.()||1),c.needsUpdate=!0,c}const _t=`
attribute vec3 aT; attribute vec2 aST;
uniform float uTime, uBulge; uniform vec3 uBulgeK;
varying vec3 vWPos, vR, vT; varying vec2 vST;
#include <fog_pars_vertex>
void main() {
  float bl = uBulge * (0.6 * sin(aST.x * uBulgeK.x - uTime * uBulgeK.y + aST.y) + 0.4 * sin(aST.x * uBulgeK.z + uTime * 1.3 + 2.0 * aST.y));
  vec4 wp = modelMatrix * vec4(position + normal * bl, 1.0);
  vWPos = wp.xyz; vST = aST;
  vR = normalize(mat3(modelMatrix) * normal);
  vT = normalize(mat3(modelMatrix) * aT);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Gt=`
precision highp float;
uniform sampler2D uNoise;
uniform vec4 uSc, uTc;            // tiles per metre along s / tiles round the girth, four ripple layers
uniform vec2 uOffA, uOffB, uOffC, uOffD, uOffE, uShoal;
uniform float uRipple, uGlow, uDepthM, uCirc, uShoalFar, uLimbP, uGlowK, uFresK, uBodyGain, uFarLines, uFill, uGlowFar;
uniform vec3 uHaze; uniform vec2 uHazeK, uRefl; uniform float uGlitter;    // haze colour; (density per metre, ceiling)
uniform vec2 uStreak;           // current lines: strength, how far they carry (1 = the river's own 50-300 m)
uniform float uCaustK, uTime, uGlitW, uLimbPale, uNetK; uniform vec4 uNet; uniform vec3 uFarCore; uniform vec3 uCaust;      // the far core's own colour; (light let through to the face away from the sun, the sun seen through the glass, fill on undersides)
varying vec3 vWPos, vR, vT; varying vec2 vST;
${yt}
#include <fog_pars_fragment>
void main() {
  vec3 R = normalize(vR);
  vec3 T = normalize(vT - R * dot(vT, R));
  vec3 A = cross(T, R);
  vec3 Vv = cameraPosition - vWPos; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
  float tN = vST.y * 0.15915494;
  vec4 nA = texture2D(uNoise, vec2(vST.x * uSc.x, tN * uTc.x) + uOffA);
  vec4 nB = texture2D(uNoise, vec2(vST.x * uSc.y, tN * uTc.y) + uOffB);
  vec4 nC = texture2D(uNoise, vec2(vST.x * uSc.z, tN * uTc.z) + uOffC);
  vec4 nD = texture2D(uNoise, vec2(vST.x * uSc.w, tN * uTc.w) + uOffD);
  float fineK = 1.0 - 0.6 * smoothstep(90.0, 320.0, dist);       // fine ripples only where they resolve: no grain on far faces
  vec2 g = (nA.rg - 0.5) * 0.9 + (nB.rg - 0.5) * 0.8 * (0.4 + 0.6 * fineK) + (nC.rg - 0.5) * 0.75 * fineK;
  vec3 N = normalize(R + (T * g.x + A * g.y) * uRipple);
  float rdv = clamp(dot(R, V), 0.0, 1.0);
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  vec3 rd = reflect(-V, N);
  rd = normalize(rd + R * max(0.0, -dot(rd, R)) * 1.5);
  float fq = 1.0 - ndv; fq *= fq;
  float fres = (0.025 + 0.62 * fq * fq) * uFresK * uRefl.x;
  vec3 refl = skyCol(rd) * mix(vec3(0.62, 0.8, 0.78), uAqua * 1.3 + uTeal * 0.5, uRefl.y);   // the sky, seen in coloured glass

  // the glass body: teal, deepening to the core where the eye looks through most water. Near, that is measured along
  // the eye's ray; far off it is measured ACROSS the strand, so every distant loop keeps a dark core down its middle
  float farK = smoothstep(120.0, 900.0, dist);
  vec3 Vx = V - T * dot(V, T);
  float rdvX = clamp(dot(R, Vx) / max(length(Vx), 0.05), 0.0, 1.0);
  float coreF = smoothstep(0.22, 0.92, rdvX);                     // far: deepening smoothly to the middle of the strand's width (no kerb)
  float farK2 = smoothstep(100.0, 350.0, dist);                   // from here a strand is seen whole, across its width
  float core = mix(smoothstep(0.2, 0.95, rdv), coreF, max(farK, 0.8 * farK2));
  float coreT = 1.0 - 0.9 * coreF * farK2;                        // light that has come through the thick middle of a strand is spent: the core stays deep, the limb bright
  // (the pipeline's ACES lifts mid-tones about 2x, so the palette is entered at roughly half strength)
  vec3 deepC = mix(uDeep * 0.5, uFarCore, farK);                 // the far core keeps a clear colour of its own under the haze: never slate
  vec3 body = mix(uTeal * (0.5 + 0.25 * farK), deepC, core * 0.94);
  float coreShade = 1.0 - 0.6 * coreF * farK;                     // the far core stays dark under the scattered light and the haze
  float sunSide = 0.5 + 0.5 * dot(R, uSunDir);
  body *= (0.6 + 0.55 * sunSide) * uBodyGain;
  body *= mix(0.86 + 0.28 * nA.b, 1.0, farK2);                   // slow tonal drift along the flow (near only: far off nothing may band a strand)
  float rip = clamp(g.x * 0.5 + g.y * 0.7, -0.5, 0.5) * (1.0 - 0.75 * smoothstep(140.0, 480.0, dist));
  body *= 1.0 + rip * 0.9;                                       // ripples refract the light inside
  body += (uPeach * (0.03 * uFill + 0.1 * uCaust.z) * max(-R.y, 0.0) + uAqua * uAqua * 0.16 * uCaust.z * max(-R.y, 0.0) * (1.0 - 0.6 * farK) + uLilac * 0.015 * max(R.y, 0.0) * uFill) * (1.0 - 0.5 * farK)
     + uAqua * uAqua * (0.03 + 0.07 * sunSide * sunSide) * uFill * coreShade;   // sunlit water scatters its own colour

  // shoals: dark threads turning at a parallax depth
  vec2 par = vec2(dot(V, T), dot(V, A)) / max(rdv, 0.3) * uDepthM;
  vec2 suv = vec2((vST.x - par.x) * uShoal.x, (tN - par.y / uCirc) * uShoal.y) + uOffE;
  float sh = texture2D(uNoise, suv).a;
  float shMask = smoothstep(0.58, 0.76, texture2D(uNoise, suv * vec2(0.5, 1.0) + vec2(0.37, 0.61) - uOffE * 0.4).b);
  float thread = (1.0 - smoothstep(0.012, 0.07, abs(sh - 0.5))) * shMask;
  thread *= (1.0 - smoothstep(uShoalFar * 0.3, uShoalFar, dist)) * smoothstep(0.12, 0.5, rdv);
  body *= 1.0 - 0.2 * thread;                                    // shoals: soft darker ribbons inside the glass, here and there

  // foam current lines streaming with the flow
  vec4 nD2 = texture2D(uNoise, vec2(vST.x * uSc.w * 3.0, tN * uTc.w * 3.0) + uOffD * 3.0 + vec2(0.31, 0.57));
  float l1 = 1.0 - smoothstep(0.0, 0.022, abs(nD.a - 0.5));
  float l2 = 1.0 - smoothstep(0.0, 0.02, abs(nD2.b - 0.5));
  float streak = (l1 * 0.7 * smoothstep(0.42, 0.62, nA.b) + l2 * 0.5 * smoothstep(0.45, 0.68, nD.b)) * (0.5 + 0.5 * nC.b);
  streak *= 1.0 - smoothstep(40.0 * uStreak.y, 190.0 * uStreak.y, dist);   // thin lines only where they resolve
  streak *= 0.3 + 0.7 * smoothstep(0.06, 0.38, rdv);                        // and not where the eye grazes the water (scratches)
  streak += smoothstep(0.66, 0.84, nD2.a) * smoothstep(0.52, 0.72, nD.b) * 0.3 * (1.0 - smoothstep(400.0, 1200.0, dist));
  // far strands: many hair-thin current streaks of unequal length that bunch and fade (never a lane line down the middle).
  // Noise stretched fourteen times along the flow and thresholded at its crests: under minification it falls to its mean
  // and the streaks fade out instead of joining into a band
  vec2 fu = vec2(vST.x * uSc.w * 2.0 + uOffD.x * 2.0, tN);
  float f1 = texture2D(uNoise, vec2(fu.x + 0.13, fu.y * uFarLines * 3.0 + 0.71)).b;
  float f2 = texture2D(uNoise, vec2(fu.x * 0.8 + 0.4, fu.y * uFarLines + 0.2)).a;
  float f4 = texture2D(uNoise, vec2(fu.x * 0.5 + 0.77, fu.y * floor(uFarLines * 0.5) + 0.43)).b;
  float f3 = texture2D(uNoise, vec2(fu.x * 0.31 + uOffD.x * 2.0 + 0.37, fu.y * 4.0 + 0.59)).b;      // the bunching runs down the strand 16 m/s faster than the water (cat's-paws of wind): streaks brighten and fade as they stream
  // three widths of streak, each shown at the distances where it is a few pixels wide (about 3 m, 8 m and 16 m across), so a
  // loop a kilometre off still carries lines that are seen to stream along it
  float w1 = smoothstep(90.0, 200.0, dist) * (1.0 - smoothstep(320.0, 560.0, dist));
  float w2 = smoothstep(260.0, 460.0, dist) * (1.0 - smoothstep(800.0, 1300.0, dist));
  float w3 = smoothstep(700.0, 1150.0, dist) * (1.0 - smoothstep(2600.0, 3600.0, dist));
  float ln1 = smoothstep(0.6, 0.7, f1), ln2 = 1.0 - smoothstep(0.0, 0.036, abs(f2 - 0.5)), ln3 = 1.0 - smoothstep(0.0, 0.05, abs(f4 - 0.5));
  float farLine = (ln1 * 0.5 * w1 + ln2 * 0.55 * w2 + ln3 * 0.7 * w3) * smoothstep(0.26, 0.6, f3) * (0.3 + 0.7 * smoothstep(0.0, 0.45, rdvX));
  streak += farLine * 0.8;
  float lineK = clamp(streak * uStreak.x, 0.0, 1.0) * 0.55;
  body = mix(body, uCream * 0.55 * mix(0.5 + 0.5 * sunSide, 1.0, uLimbPale), lineK);     // (by moonlight the lines are silver whichever way a face is turned)

  // transmitted light: the limb away from the sun glows; a strand aimed at the sun lights like a glass rod
  vec3 Sp = uSunDir - T * dot(uSunDir, T); float spl = length(Sp);
  float k = clamp(dot(R, -Sp) / max(spl, 0.05), 0.0, 1.0);
  float rimSun = clamp(dot(R, Sp) / max(spl, 0.05), 0.0, 1.0);
  float limb = 1.0 - rdv; float limb2 = limb * limb; float limb4 = limb2 * limb2;
  // the bright rim is measured across the strand (uLimbP = 1), not along the eye's ray: looking down the length of a
  // strand, or up at one from just beneath it, every ray grazes the water, and the rim would swell into a glare band.
  // Far strands always measure it across, and widen it to about a tenth of their width so it holds at a kilometre
  float lp = mix(uLimbP, 1.0, farK);
  float lq = 1.0 - mix(rdv, rdvX, lp); float lq2 = lq * lq; float lq4 = lq2 * lq2;
  float wideF = mix(lq2 * (1.0 - 0.55 * lq2), lq2 * lq * 1.25, farK);     // the outer tenth, without doubling the very edge (far: narrower, so the core stays deep)
  float gf = mix(1.0, uGlowFar, farK);
  float trans = (0.07 * (1.0 - 0.75 * farK) * uFill * k * k + (0.22 + 1.5 * farK * gf) * k * wideF + 1.3 * farK * gf * wideF * max(1.0 - 0.75 * rimSun, 0.0) + 2.3 * k * lq4 * gf + 0.12 * mix(limb4, lq4, lp * 0.6)) * smoothstep(0.0, 0.35, spl);
  float pipe = smoothstep(0.78, 0.99, abs(dot(uSunDir, T)));
  trans += pipe * (0.05 * (1.0 - 0.6 * farK) + 0.9 * lq4 + 0.7 * farK * wideF);
  trans *= mix(0.8 + 0.4 * nB.b, 1.0, farK2);
  float rB = 1.0 - abs(2.0 * nB.b - 1.0), rC = 1.0 - abs(2.0 * nC.b - 1.0), rA = 1.0 - abs(2.0 * nA.b - 1.0);
  // light on a belly: broad, soft, uneven bands that lie ALONG the flow and stream with it (never across the strand). The two
  // lookups run a little askew to the river (whole turns round the girth, whole counts along the length, so there is no seam)
  float n1 = texture2D(uNoise, vec2(vST.x * uNet.x + tN, 5.0 * tN - vST.x * uNet.y) + vec2(-uTime * 0.008, uTime * 0.0011)).b;
  float n2 = texture2D(uNoise, vec2(vST.x * uNet.z - tN, 8.0 * tN + vST.x * uNet.w) + (n1 - 0.5) * 0.05 + vec2(-uTime * 0.011, -uTime * 0.0009)).a;
  float r1 = 1.0 - abs(2.0 * n1 - 1.0), r2 = 1.0 - abs(2.0 * n2 - 1.0);
  float net = 1.25 * smoothstep(0.3, 0.72, n1) * (0.5 + 0.5 * r2) + 0.45 * r1 * r1 * r2 + 0.12 * rA * rB * fineK;
  net = mix(net, net * net * 1.6, uNetK);                           // (by moonlight the bands are fewer and stand further apart in tone)
  net = mix(net, 0.5, smoothstep(140.0, 330.0, dist));              // far off the bands are gone: nothing rings or bands a distant strand
  float k2 = k * k;
  float underK = smoothstep(0.25, -0.45, R.y);                     // the bands show on bellies; a top face turned from the light stays deep glass
  float bandK = max(underK, 0.6 * uNetK * (1.0 - farK2));           // (by moonlight the near water turned from the moon carries the bands too)
  trans += uCaust.x * uCaustK * k2 * (0.3 + 0.7 * k2) * mix(0.3, 0.2 + 0.95 * net, bandK) * (1.0 - 0.85 * farK) * coreT * smoothstep(0.0, 0.35, spl);
  float thr = max(dot(-V, uSunDir), 0.0); float thr4 = thr * thr; thr4 *= thr4; float thr16 = thr4 * thr4; thr16 *= thr16;
  trans += uCaust.y * uCaustK * k2 * (thr16 * thr16 * 1.3 + thr16 * 0.22 + thr4 * 0.02) * mix(0.7 + 0.6 * nB.b, 1.0, farK2) * mix(1.0, 0.4 + 1.2 * net, uNetK * (1.0 - farK2)) * (1.0 - 0.5 * farK) * (1.0 - 0.6 * coreF * farK2);       // the sun or moon behind the strand, diffused in it
  trans *= (1.0 + rip * 1.1) * (1.0 - 0.4 * thread) * (1.0 - 0.45 * lineK);     // the light in the glass is rippled, and shoals and current lines show against it
  trans = 1.9 * (1.0 - exp(-max(trans, 0.0) / 1.9));              // a soft ceiling: the rim keeps its colour
  vec3 aquaSat = uAqua * uAqua * 1.7;
  vec3 glow = mix(mix(aquaSat, uAqua, 0.1 + 0.35 * lq4), uCream * 0.9, uLimbPale * lq2) * trans * uGlow * uGlowK;     // (by moonlight the limb pales to silver)

  // sun: a thin cream highlight on the sunward limb and glitter on the ripples
  float sunVis = smoothstep(-0.04, 0.12, dot(R, uSunDir));
  float sd = clamp(dot(rd, uSunDir), 1e-4, 1.0);
  // glitter keeps the sun's colour; the broad sheen is seen through the water's own colour (warm light on blue water went slate)
  vec3 spec = uSunCol * (pow(sd, 700.0) * 5.0 + pow(sd, 48.0) * 0.2 * mix(vec3(1.0), uAqua * 1.6, 0.7)) * sunVis * uGlitter;
  spec += uSunCol * pow(sd, 150.0) * 0.6 * uGlitW * sunVis;      // a low moon's road on the ripples is wider than the sun's
  spec += uCream * uSunCol * rimSun * rimSun * rimSun * (0.2 * limb4 + 0.5 * farK * lq2 * lq) * sunVis;
  // the light's path along a strand: on a wet cylinder the glint of sun or moon is a line that runs the strand's length where
  // the surface halves the angle between the light and the eye. Far off the ripples that break it are too small to see, so
  // it is broken by the streaming streaks instead: a thin path of glitter that travels along the lit side
  vec3 Hh = V + uSunDir; vec3 Hx = Hh - T * dot(Hh, T); float hxl = length(Hx);
  float hl = clamp(dot(R, Hx) / max(hxl, 0.05), 0.0, 1.0); float hl2 = hl * hl; float hl8 = hl2 * hl2; hl8 *= hl8; float hl32 = hl8 * hl8; hl32 *= hl32;
  float hl128 = hl32 * hl32; hl128 *= hl128;
  float pathG = hl128 * hl128 * smoothstep(0.1, 0.5, hxl) * smoothstep(-0.02, 0.1, dot(R, uSunDir)) * smoothstep(60.0, 260.0, dist);      // a thin line: a few degrees of the girth
  spec += uCream * uSunCol * pathG * (0.05 + 1.2 * smoothstep(0.5, 0.66, f1) * (0.4 + 0.6 * f3) + 0.9 * ln2 * w2 + 0.9 * ln3 * w3) * 0.2 * uGlitter;

  spec = 1.7 * (1.0 - exp(-spec / 1.7));                          // a shoulder: glitter sparkles, a path of light never burns to a white band
  vec3 col = mix(body, refl, fres * (1.0 - 0.45 * farK)) + glow + spec;
  // air between us and the strand: far loops go paler toward the horizon's colour, so the knot stacks in depth
  col = mix(col, uHaze, uHazeK.y * (1.0 - exp(-dist * uHazeK.x)) * coreShade * (1.0 - 0.5 * coreF * farK2));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;async function Ya(x,C,D){let i=0,B=0;for(const b of C)b.rings=Math.max(2,Math.ceil((b.s1-b.s0)/b.step)+1),i+=b.rings*(b.radial+1),B+=(b.rings-1)*b.radial*6;const J=new Float32Array(i*3),W=new Float32Array(i*3),I=new Float32Array(i*3),q=new Float32Array(i*2),k=new Uint32Array(B),S={},c=new s.Vector3;let r=0,l=0;for(const b of C){const w=r,h=b.radial+1;for(let f=0;f<b.rings;f++){const G=b.s0+(b.s1-b.s0)*f/(b.rings-1);x.frameAt(G,S),c.crossVectors(S.T,S.N);const A=b.snap&&(f===0||f===b.rings-1);D&&(f&63)===63&&await D();for(let T=0;T<=b.radial;T++,r++){const z=T/b.radial*_,O=Math.cos(z),P=Math.sin(z),X=S.N.x*O+c.x*P,ee=S.N.y*O+c.y*P,V=S.N.z*O+c.z*P,te=A&&T&1?Le*Math.cos(_/b.radial):Le;J[r*3]=S.C.x+X*te,J[r*3+1]=S.C.y+ee*te,J[r*3+2]=S.C.z+V*te,W[r*3]=X,W[r*3+1]=ee,W[r*3+2]=V,I[r*3]=S.T.x,I[r*3+1]=S.T.y,I[r*3+2]=S.T.z,q[r*2]=G,q[r*2+1]=z}}for(let f=0;f<b.rings-1;f++)for(let G=0;G<b.radial;G++){const A=w+f*h+G,T=A+1,z=A+h,O=z+1;k[l++]=A,k[l++]=T,k[l++]=z,k[l++]=T,k[l++]=O,k[l++]=z}D&&await D()}const g=new s.BufferGeometry;return g.setAttribute("position",new s.BufferAttribute(J,3)),g.setAttribute("normal",new s.BufferAttribute(W,3)),g.setAttribute("aT",new s.BufferAttribute(I,3)),g.setAttribute("aST",new s.BufferAttribute(q,2)),g.setIndex(new s.BufferAttribute(k,1)),g}function Ut(x){const C=[],D=[],i=[],B=[],J=new s.Color,W=(l,g)=>[l[0]-g[0],l[1]-g[1],l[2]-g[2]],I=(l,g)=>[l[1]*g[2]-l[2]*g[1],l[2]*g[0]-l[0]*g[2],l[0]*g[1]-l[1]*g[0]],q=l=>{const g=Math.hypot(l[0],l[1],l[2])||1;return[l[0]/g,l[1]/g,l[2]/g]},k=(l,g=0)=>{J.set(l);const b=1+(x()-.5)*2*g;return[J.r*b,J.g*b,J.b*b]},S=(l,g,b,w)=>{C.push(l[0],l[1],l[2]),D.push(g[0],g[1],g[2]),i.push(b[0],b[1],b[2]),B.push(w[0],w[1],w[2],w[3])},c=[0,0,0,0],r={rgb:k,norm:q,sub:W,cross:I,get tris(){return C.length/9},tri(l,g,b,w,h=c,f=h,G=h,A=null){const T=A||q(I(W(g,l),W(b,l)));S(l,A?A[0]:T,w,h),S(g,A?A[1]:T,w,f),S(b,A?A[2]:T,w,G)},quad(l,g,b,w,h,f=c,G=f,A=f,T=f){let z=q(I(W(g,l),W(w,l)));Math.abs(z[0])+Math.abs(z[1])+Math.abs(z[2])>.5||(z=q(I(W(b,g),W(w,g)))),S(l,z,h,f),S(g,z,h,G),S(b,z,h,A),S(l,z,h,f),S(b,z,h,A),S(w,z,h,T)},spar(l,g,b,w,h,f,G=!1,A=c,T=A){const z=q(W(g,l)),O=Math.abs(z[1])>.9?[1,0,0]:[0,1,0],P=q(I(z,O)),X=I(z,P),ee=(V,te,ce)=>{const he=ce/h*_,ne=Math.cos(he),le=Math.sin(he),ae=[P[0]*ne+X[0]*le,P[1]*ne+X[1]*le,P[2]*ne+X[2]*le];return[[V[0]+ae[0]*te,V[1]+ae[1]*te,V[2]+ae[2]*te],ae]};for(let V=0;V<h;V++){const[te,ce]=ee(l,b,V),[he,ne]=ee(l,b,V+1),[le]=ee(g,w,V),[ae]=ee(g,w,V+1);S(te,ce,f,A),S(he,ne,f,A),S(ae,ne,f,T),S(te,ce,f,A),S(ae,ne,f,T),S(le,ce,f,T),G&&(S(le,z,f,T),S(ae,z,f,T),S(g,z,f,T))}},box(l,g,b,w,h,f,G,A=0){const T=Math.cos(A),z=Math.sin(A),O=(X,ee,V)=>[l+(X*T+V*z)*w*.5,g+ee*h*.5,b+(-X*z+V*T)*f*.5],P=[[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],[[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]],[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]];for(const X of P)r.quad(O(...X[0]),O(...X[1]),O(...X[2]),O(...X[3]),G)},ribbon(l,g,b,w){const h=q(W(g,l)),f=Math.abs(h[1])>.9?[1,0,0]:[0,1,0],G=q(I(h,f)),A=I(h,G);for(const T of[G,A]){const z=[-T[0],-T[1],-T[2]],O=[3,0,0,b];S(l,T,w,O),S(l,z,w,O),S(g,z,w,O),S(l,T,w,O),S(g,z,w,O),S(g,T,w,O)}},geometry(){const l=new s.BufferGeometry;return l.setAttribute("position",new s.Float32BufferAttribute(C,3)),l.setAttribute("normal",new s.Float32BufferAttribute(D,3)),l.setAttribute("color",new s.Float32BufferAttribute(i,3)),l.setAttribute("aMat",new s.Float32BufferAttribute(B,4)),l}};return r}function Et(x,C,D){const i=Ut(x),B=C==="hero",J="#3a2c25",W="#4a3a30",I="#8a6a4a",q="#9a8468",k=D.cream,S="#7a5c40",c="#3b3028",r=B?10:C==="far"?5:4,l=M=>(M+.3)/6.3,g=M=>1.75*Math.pow(Math.max(0,1-Math.pow(Math.abs(l(M)),2.4)),.75),b=M=>{const a=l(M);return 1.05+.75*a*a+.95*Math.pow(Math.max(a,0),3)},w=M=>-.55+.62*Math.pow(l(M),4),h=M=>Math.min(b(M)-.42,.62+.5*l(M)*l(M)),f=M=>{const a=g(M),n=b(M),d=w(M),m=n-d,p=h(M),N=[[0,d],[.6*a,d+.2*m],[.92*a,d+.52*m],[1*a,n-.34],[1.03*a,n],[Math.max(0,1.03*a-.13),n+.02],[Math.max(0,1.03*a-.17),p],[0,p]];return B?N:C==="far"?[N[0],N[1],N[3],N[4],N[7]]:[N[0],N[2],N[4]]},G=B?[J,W,J,k,I,W,q]:C==="far"?[J,W,k,q]:[J,W],A=-5.9,T=6.1;for(let M=0;M<r;M++){const a=A+(T-A)*M/r,n=A+(T-A)*(M+1)/r,d=f(a),m=f(n);for(let p=0;p<d.length-1;p++)for(const N of[1,-1]){const v=i.rgb(G[p],G[p]===k?.05:.16);G[p]===k&&(v[0]*=.82,v[1]*=.82,v[2]*=.82),i.quad([N*d[p][0],d[p][1],a],[N*m[p][0],m[p][1],n],[N*m[p+1][0],m[p+1][1],n],[N*d[p+1][0],d[p+1][1],a],v)}}const z=[0,.6,-.5],O=[0,12,1.3],P=[.18,2.7,6.3],X=[.18,13.3,-3.6],ee=[.95,2.3,-5],V=[(P[0]+X[0])/2,(P[1]+X[1])/2,(P[2]+X[2])/2],te=B?6:3;i.spar(z,O,.17,.08,te,i.rgb(S,.05),B),i.spar(V,P,.12,.05,B?5:3,i.rgb(S,.05)),i.spar(V,X,.12,.045,B?5:3,i.rgb(I,.05));const ce=B?8:4,he=B?6:3,ne=(M,a)=>{const n=[P[0]+(X[0]-P[0])*M,P[1]+(X[1]-P[1])*M,P[2]+(X[2]-P[2])*M],d=[n[0]+(ee[0]-n[0])*a,n[1]+(ee[1]-n[1])*a,n[2]+(ee[2]-n[2])*a],m=Math.pow(Math.sin(Math.PI*Math.min(1,M*.9+.05)),.8)*Math.sin(Math.PI*Math.pow(a,.8));return d[0]+=1.3*m,d[1]-=.25*m,d},le=(M,a)=>[1,(1-M)*(1-a),a,Math.min(1,4*a*(1-a)*(.35+.65*M)+M*M*M*a)];for(let M=0;M<ce;M++)for(let a=0;a<he;a++){const n=M/ce,d=(M+1)/ce,m=a/he,p=(a+1)/he,N=.94+.1*x(),v=ne(n,m),oe=ne(d,m),we=ne(d,p),pe=ne(n,p),be=[N,N,N],Pe=(Ue,Qe)=>{const et=i.sub(ne(Math.min(1,Ue+.02),Qe),ne(Math.max(0,Ue-.02),Qe)),Mt=i.sub(ne(Ue,Math.min(.98,Qe+.02)),ne(Ue,Math.max(0,Qe-.02)));return i.norm(i.cross(et,Mt))},Fe=Pe(n,m),xe=Pe(d,m),Ge=Pe(d,p),Oe=Pe(n,p);i.tri(v,oe,we,be,le(n,m),le(d,m),le(d,p),[Fe,xe,Ge]),a<he-1&&i.tri(v,we,pe,be,le(n,m),le(d,p),le(n,p),[Fe,Ge,Oe])}const ae=[0,b(T)+1.25,T+.42],Se=[0,b(A)+1,A-.3];{const M=[0,qt,Ot],a=.17,n=.24,d=i.rgb("#2a2622",.05),m=[5,0,0,0],p=(N,v,oe)=>[M[0]+N*a,M[1]+v*n,M[2]+oe*a];for(const N of[[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],[[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]],[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]]])i.quad(p(...N[0]),p(...N[1]),p(...N[2]),p(...N[3]),d,m);C!=="mirror"&&i.spar(Se,[0,qt+n,Ot],.045,.03,3,i.rgb(W,.1))}if(C!=="mirror"&&(i.spar([0,b(T)-.5,T-.15],ae,.13,.07,B?4:3,i.rgb(W,.1),!0),i.spar([0,b(A)-.5,A+.12],Se,.12,.07,B?4:3,i.rgb(W,.1),!0),i.ribbon(O,ae,.025,i.rgb(c))),B){i.box(0,ae[1]-.22,ae[2]-.07,.24,.16,.24,i.rgb(k,.05).map(v=>v*.8)),i.ribbon([0,9.6,.92],[1.5,b(-2.2),-2.2],.022,i.rgb(c)),i.ribbon([0,9.6,.92],[-1.5,b(-2.2),-2.2],.022,i.rgb(c)),i.ribbon(ne(1,1),[.5,b(-5.3)+.05,-5.3],.025,i.rgb(c)),i.ribbon(P,[0,b(6)+.3,6.05],.025,i.rgb(c)),i.ribbon([.1,9,.8],[.35,.8,-1.6],.02,i.rgb(c));for(const v of[3.2,6.4])i.spar([0,v,z[2]+(O[2]-z[2])*(v-.6)/11.4],[0,v+.22,z[2]+(O[2]-z[2])*(v-.38)/11.4],.2,.2,6,i.rgb(c,.1));i.spar([.62,2.35,-4.7],[1.02,-.5,-6.9],.07,.06,4,i.rgb(I,.1)),i.quad([.92,.5,-6.05],[1.2,.42,-6.3],[1.3,-.7,-7.25],[.98,-.62,-7],i.rgb(I,.1)),i.spar([.62,2.35,-4.7],[.2,2.2,-3.5],.05,.035,4,i.rgb(S,.1));for(const v of[3.3,1.5,-2.7])i.box(0,h(v)+.42,v,g(v)*1.9,.07,.34,i.rgb(I,.12));i.spar([.62,h(1.5)+.46,1.5],[.62,h(1.5)+.5,1.5],.36,.34,8,i.rgb("#d8bf7c",.06),!0),i.spar([.62,h(1.5)+.5,1.5],[.62,h(1.5)+.66,1.5],.2,.02,8,i.rgb("#cdb06a",.06),!0);for(const[v,oe,we]of[[-.55,4,"#c9d2d6"],[.5,4.4,D.red],[-.75,2.4,"#d9c48a"]]){const pe=h(oe);i.spar([v,pe,oe],[v,pe+.5,oe],.25,.37,7,i.rgb("#b08a4e",.1)),i.spar([v,pe+.42,oe],[v,pe+.58,oe],.34,.12,7,i.rgb(we,.08),!0)}const M=h(-1.2);i.spar([-.6,M,-1.2],[-.6,M+.2,-1.2],.72,.66,9,i.rgb("#47686a",.1),!0),i.spar([-.6,M+.2,-1.2],[-.6,M+.38,-1.2],.5,.4,9,i.rgb("#5b7d7a",.1),!0),i.spar([-.6,M+.38,-1.2],[-.6,M+.5,-1.2],.26,.18,7,i.rgb("#39585c",.1),!0);const a=-4.9,n=-3,d=3;for(const v of[a,n])for(const oe of[1,-1])i.spar([oe*g(v)*.98,b(v),v],[0,d,v],.045,.04,3,i.rgb(S,.1));i.spar([0,d,a-.25],[0,d-.04,(a+n)/2],.2,.24,6,i.rgb(k,.04).map(v=>v*.78)),i.spar([0,d-.04,(a+n)/2],[0,d,n+.25],.24,.19,6,i.rgb(k,.04).map(v=>v*.72));for(const v of[a+.3,(a+n)/2,n-.3])i.spar([0,d-.05,v-.04],[0,d-.05,v+.04],.26,.26,6,i.rgb(D.red,.05));const m=[0,4.3,-.05],p=Se;i.ribbon(m,p,.018,i.rgb(c));const N=[[.2,.75,1,k],[.36,.6,.8,D.red],[.5,.8,1.15,"#d8e6e2"],[.66,.55,.7,D.aqua],[.8,.7,.9,k]];for(const[v,oe,we,pe]of N){const be=Oe=>[m[0]+(p[0]-m[0])*Oe,m[1]+(p[1]-m[1])*Oe,m[2]+(p[2]-m[2])*Oe],Pe=oe*.5/6.2,Fe=be(v-Pe),xe=be(v+Pe),Ge=i.rgb(pe,.05).map(Oe=>Oe*.85);i.quad(Fe,xe,[xe[0],xe[1]-we,xe[2]],[Fe[0],Fe[1]-we,Fe[2]],Ge,[2,0,0,0],[2,1,0,0],[2,1,1,1],[2,0,1,1])}}return i}function $a(x,C,D,i,B,J,W=.45,I=!1){const q=Math.cos(i),k=Math.sin(i),S=B,c=(P,X,ee)=>[C+(ee*k+P*q)*S,W+X*S,D+(ee*q-P*k)*S],r=I?"#b9bab4":"#8d969d",l=I?"#a9aaa6":"#5c6875",g="#7d6c42",b="#b98a2c",w="#1c1f24",h="#b4b7b4",f=P=>[4,0,0,P],G=(P,X,ee,V,te,ce,he=0,ne=he)=>x.spar(c(...P),c(...X),ee*S,V*S,te,x.rgb(ce,.05),!0,f(he),f(ne));for(const P of[-.07,.07])G([P,0,.02],[P*1.1,.42,P>0?.06:-.02],.022,.026,4,g),G([P*1.1,.42,P>0?.06:-.02],[P,.82,0],.026,.04,4,g);G([0,.9,-.5],[0,.92,-.18],.04,.15,6,l),G([0,.92,-.18],[0,1,.12],.15,.17,6,r),G([0,1,.12],[0,1.12,.3],.17,.08,6,h);for(const P of[-1,1])x.quad(c(P*.17,1.08,.16),c(P*.19,.9,.05),c(P*.1,.84,-.52),c(P*.14,1.04,-.2),x.rgb(l,.08));const A=[0,1.12,.3],T=[0,1.32+.1*J,.2-.05*J],z=[0,1.5+.16*J,.3],O=[0,1.62+.2*J,.36];G(A,T,.075,.05,5,h,0,.05),G(T,z,.05,.042,5,r,.05,.11),G(z,O,.042,.06,5,h,.11,.16),G(O,[0,O[1]+.03,O[2]+.14],.065,.04,5,h,.16,.18),G([0,O[1]+.02,O[2]+.12],[0,O[1]-.04,O[2]+.42],.03,.004,4,b,.18,.2),G([0,O[1]+.07,O[2]+.06],[0,O[1]+.02,O[2]-.26],.03,.006,3,w,.17,.24)}const St=`
attribute vec3 color; attribute vec4 aMat; attribute vec4 aA; attribute vec4 aB;
uniform float uClock, uTime, uPixAng, uFarGrow, uFarShrink;
varying vec3 vN, vCol, vWPos, vUp; varying vec4 vMat; varying float vSun, vSeed, vFade, vLamp;
${Vt}
uniform vec3 uSunDir;
#include <fog_pars_vertex>
void main() {
  float s = aA.x + aB.x * uClock, th = aA.y + aB.y * uClock, ph = aB.z, sc = abs(aA.w), mir = aA.w < 0.0 ? -1.0 : 1.0;
  vec3 p = position, n = normal; float kind = aMat.x;
  if (kind > 0.5 && kind < 1.5) {                     // sail: fills, spills and flutters at the leech
    float fill = 0.8 + 0.2 * sin(uTime * 0.45 + ph);
    p.x = 0.18 + (p.x - 0.18) * fill + aMat.w * 0.15 * sin(uTime * 3.0 + aMat.z * 7.0 + aMat.y * 5.0 + ph);
  } else if (kind > 1.5 && kind < 2.5) {              // hanging cloth
    p.x += aMat.z * (0.2 * sin(uTime * 1.6 + ph + p.z * 1.3) + 0.14);
    p.z += aMat.z * 0.07 * sin(uTime * 2.2 + ph + aMat.y * 2.0);
  } else if (kind > 3.5) {                            // reeds, plumes, a heron's neck
    p.x += aMat.w * 0.42 * sin(uTime * 1.25 + p.z * 0.6 + p.x * 0.3 + ph);
    p.z += aMat.w * 0.25 * sin(uTime * 0.85 + p.x * 0.5 + ph * 1.7);
  }
  p.x *= mir; n.x *= mir;
#ifdef WRAP
  float cy = cos(aA.z), sy = sin(aA.z);
  float ds = (p.x * sy + p.z * cy) * sc, dc = (-p.x * cy + p.z * sy) * sc;
  vec3 C, T, R, F, S; radialBasis(s + ds, th + dc / uTubeR, aA.z, C, T, R, F, S);
  vec3 O = C + R * uTubeR;
  vec3 local = O + R * p.y * sc;
  vec3 wO = (modelMatrix * vec4(O, 1.0)).xyz;
  local = mix(local, O, uFarShrink * smoothstep(70.0, 150.0, distance(cameraPosition, wO)));     // float-leaves fold away before they are too small to be leaves
  vLamp = 0.0;
#else
  float roll = 0.05 * sin(uTime * 0.9 + ph) + 0.06 * mir, pitch = 0.024 * sin(uTime * 0.7 + ph * 1.7);
  p = vec3(p.x - roll * p.y, p.y + roll * p.x - pitch * p.z, p.z + pitch * p.y);
  n = vec3(n.x - roll * n.y, n.y + roll * n.x - pitch * n.z, n.z + pitch * n.y);
  vec3 C, T, R, F, S; radialBasis(s, th, aA.z, C, T, R, F, S);
  vec3 O = C + R * uTubeR;
  vec3 wO = (modelMatrix * vec4(O, 1.0)).xyz;
  float od = distance(cameraPosition, wO);
  sc *= 1.0 + uFarGrow * clamp((od - 250.0) / 1100.0, 0.0, 1.0);      // far sails stay readable as beads
  vec3 lampC = vec3(0.0, ${qt.toFixed(2)}, ${Ot.toFixed(2)});
  vec3 dl = position - lampC; vLamp = 1.0 / (1.0 + dot(dl, dl) / 9.0);
  if (kind > 4.5) p = lampC + (p - lampC) * max(1.0, od * uPixAng * 5.0);      // a lantern never shrinks below a pixel and a half
  #ifdef MIRROR
  p.y = -0.86 * p.y - 0.25;
  float wob = sqrt(max(-p.y, 0.0));
  p.x += 0.2 * wob * sin(p.y * 1.9 + uTime * 2.3 + ph); p.z += 0.14 * wob * sin(p.y * 2.6 - uTime * 1.9 + ph);
  #endif
  vec3 local = O + (p.x * S + p.y * R + p.z * F) * sc;
#endif
  mat3 m3 = mat3(modelMatrix);
  vec3 wn = m3 * (n.x * S + n.y * R + n.z * F);
  vec4 wp = modelMatrix * vec4(local, 1.0);
  vec3 wR = normalize(m3 * R), wT = normalize(m3 * T);
  if (kind > 2.5 && kind < 3.5) {                     // rigging: widen to ~1.5 px
    float hw = max(aMat.w * sc, distance(cameraPosition, wp.xyz) * uPixAng * 0.8);
    wp.xyz += normalize(wn + vec3(0.0, 1e-5, 0.0)) * hw;
  }
  // can this point see the sun past its own river?
  float hh = max(p.y * sc, 0.0), q = uTubeR / (uTubeR + hh);
  vec3 Sp = uSunDir - wT * dot(uSunDir, wT);
  vSun = smoothstep(-0.06, 0.08, dot(wR, uSunDir) + sqrt(max(1.0 - q * q, 0.0)) * length(Sp) + 0.03);
  vFade = 1.0;
#ifdef MIRROR
  vec3 toCam = cameraPosition - wO; float dC = length(toCam);
  float face = dot(wR, toCam) / max(dC, 1e-3);
  vFade = smoothstep(0.03, 0.16, face) * (1.0 - smoothstep(0.55, 0.95, face) * 0.55) * (1.0 - smoothstep(300.0, 600.0, dC));
#endif
  vN = wn; vCol = color; vMat = aMat; vWPos = wp.xyz; vUp = wR; vSeed = aB.w;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
#ifdef MIRROR
  if (vFade < 0.004) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
#endif
  #include <fog_vertex>
}`,xt=`
precision highp float;
uniform vec3 uSail, uSailPatch, uSailStripe; uniform float uStripeAmt;
varying vec3 vN, vCol, vWPos, vUp; varying vec4 vMat; varying float vSun, vSeed, vFade, vLamp;
uniform float uLamp, uUnderLit, uShadeFill; uniform vec3 uLampCol;
${yt}
#include <fog_pars_fragment>
void main() {
  vec3 V = normalize(cameraPosition - vWPos + vec3(0.0, 1e-5, 0.0));
  vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 nf = dot(n, V) < 0.0 ? -n : n;
  vec3 up = normalize(vUp + vec3(0.0, 1e-5, 0.0));
  float kind = vMat.x;
  vec3 alb = vCol;
  vec3 amb = skyAmbient(nf) + uAqua * 0.2 * max(dot(nf, -up), 0.0);
  amb += uAqua * 0.3 * uUnderLit * (0.35 + 0.65 * clamp(0.5 - 0.5 * dot(nf, up), 0.0, 1.0));      // at night the river's own glow lights what floats on it
  float ndl = max(dot(nf, uSunDir), 0.0);
  vec3 col;
  float seamW = max(fwidth(vMat.y) * 1.3, 0.007);
  if (kind > 0.5 && kind < 1.5) {
    float a = vMat.y, b = vMat.z;
    float w = seamW;
    float seam = (1.0 - smoothstep(0.0, w, abs(a - 0.2))) + (1.0 - smoothstep(0.0, w, abs(a - 0.42))) + (1.0 - smoothstep(0.0, w, abs(a - 0.66)));
    seam *= clamp(0.014 / w, 0.0, 1.0);
    alb = uSail * vCol * (0.72 + 0.28 * vSeed) * mix(vec3(1.0), vec3(1.0, 0.8, 0.9), fract(vSeed * 5.3));
    float pa = 0.3 + 0.25 * fract(vSeed * 7.31), pb = 0.22 + 0.3 * fract(vSeed * 3.17);
    float patchK = smoothstep(0.0, 0.012, a - pa) * smoothstep(0.0, 0.012, pa + 0.13 - a) * smoothstep(0.0, 0.015, b - pb) * smoothstep(0.0, 0.015, pb + 0.2 - b);
    alb = mix(alb, uSailPatch, patchK * 0.5);
    alb = mix(alb, uSailStripe, uStripeAmt * smoothstep(0.0, 0.02, b - 0.42) * smoothstep(0.0, 0.02, 0.6 - b));
    alb *= 1.0 - 0.4 * seam;
    alb *= 0.9 + 0.1 * smoothstep(0.0, 0.08, b);                    // darker bolt-rope at the yard
    float back = max(dot(-nf, uSunDir), 0.0);
    float belly = 0.78 + 0.34 * sin(3.1416 * clamp(a, 0.0, 1.0)) * (0.55 + 0.45 * clamp(b, 0.0, 1.0));   // the cloth's own curve: a lit belly, darker at luff and leech
    col = alb * belly * (amb * 0.8 + uSunCol * ndl * 0.4 * vSun);
    col += (alb * vec3(1.15, 0.85, 0.7) + vec3(0.04, 0.006, 0.0)) * uSunCol * back * 0.5 * vSun * belly;   // backlit cloth burns
  } else if (kind > 1.5 && kind < 2.5) {
    float back = max(dot(-nf, uSunDir), 0.0);
    col = alb * (amb + uSunCol * (ndl * 0.8 + back * 0.45) * vSun);
  } else if (kind > 2.5 && kind < 3.5) {
    col = alb * (amb * 0.8 + uSunCol * 0.35 * vSun);
  } else {
    col = alb * (amb * 1.12 + uSunCol * (ndl * 0.86 + 0.16 * (0.5 + 0.5 * dot(nf, uSunDir))) * vSun);   // shaded sides are filled, never black
  }
#ifdef WRAP
  col += alb * uMoonAmb * (0.5 + 1.1 * max(dot(nf, up), 0.0));         // an islet under the moon keeps its own colours: reed gold, pale huts, red cloth
  if (kind > 3.5) {       // reeds far off are under a pixel wide and alias to dark speckle: they go to one soft green-gold lit by the islet's own sky
    float dk = smoothstep(45.0, 190.0, distance(cameraPosition, vWPos));
    vec3 far = mix(alb, vec3(0.3, 0.31, 0.085), 0.7) * (skyAmbient(up) * 1.12 + uSunCol * (0.5 * max(dot(up, uSunDir), 0.0) + 0.22) * vSun);
    col = mix(col, far, dk);
  }
  {   // a garden hanging from a belly is lit by the cloud sea beneath it and by the glow of the water it hangs from: never a dark blot
    float hangK = smoothstep(0.1, -0.5, up.y) * (1.0 - 0.65 * vSun);       // (where the low sun itself reaches under the belly it does the lighting, and this fill stands back: pale huts keep their tone)
    col += (alb * 0.9 + vec3(0.06, 0.07, 0.04)) * (uPeach * 0.7 + uAqua * 0.45) * hangK;
  }
#endif
  {   // in a strand's shade a boat is still lit: warm from the cloud sea below, aqua from the water over it, and brighter on the side toward the light
    vec3 sh = uPeach * (0.2 + 0.8 * max(-nf.y, 0.0)) * 0.6 + uAqua * (0.15 + 0.85 * max(nf.y, 0.0)) * 0.55;
    float side = 0.3 + 0.7 * smoothstep(-0.5, 0.9, dot(nf, normalize(vec3(uSunDir.x, 0.2, uSunDir.z) + vec3(0.0, 1e-4, 0.0))));
    col += alb * sh * side * (1.0 - vSun) * uShadeFill;
  }
  col += uMoonAmb * (0.012 + 0.06 * smoothstep(-0.2, 0.8, dot(nf, uSunDir)));   // moonlight on tarred hulls and dark cloth
  col += alb * uLampCol * (vLamp * uLamp * 2.2);                                 // lantern light on the stern, the deck and the foot of the sail
  if (kind > 4.5) col = mix(col, uLampCol * 5.0, uLamp);
  float alpha = 1.0;
#ifdef MIRROR
  col = mix(col, uTeal * 0.5, 0.15);
  alpha = 0.42 * vFade;
#endif
  gl_FragColor = vec4(col, alpha);
  #include <fog_fragment>
}`,Xa=`
attribute vec4 aA; attribute vec4 aB;
uniform float uClock, uTime;
varying vec2 vUv; varying vec3 vWPos, vUp; varying float vSeed, vSpeed, vLen;
${Vt}
#include <fog_pars_vertex>
void main() {
  float s = aA.x + aB.x * uClock, th = aA.y + aB.y * uClock, sc = abs(aA.w);
  float speed = length(vec2(aB.x, aB.y * uTubeR));
  float len = (20.0 + 7.0 * speed) * sc;
  float d = position.z * len;
  float lx = position.x * (1.3 * sc + 0.33 * d), lz = 5.2 * sc - d;
  float cy = cos(aA.z), sy = sin(aA.z);
  float ds = lx * sy + lz * cy, dc = -lx * cy + lz * sy;
  vec3 C, T, N; knotFrame(s + ds, C, T, N);
  float t2 = th + dc / uTubeR;
  vec3 R = cos(t2) * N + sin(t2) * cross(T, N);
  vec4 wp = modelMatrix * vec4(C + R * (uTubeR + 0.22), 1.0);
  vUv = vec2(position.x, position.z); vWPos = wp.xyz; vUp = normalize(mat3(modelMatrix) * R); vSeed = aB.z; vSpeed = speed; vLen = len;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Za=`
precision highp float;
uniform sampler2D uNoise; uniform float uTime, uLamp; uniform vec3 uLampCol;
varying vec2 vUv; varying vec3 vWPos, vUp; varying float vSeed, vSpeed, vLen;
${yt}
#include <fog_pars_fragment>
void main() {
  float a = abs(vUv.x), v = vUv.y;
  vec4 nz = texture2D(uNoise, vec2(vUv.x * 0.9 + vSeed, v * 3.0 - uTime * 0.11 + vSeed * 3.0));
  vec4 nz2 = texture2D(uNoise, vec2(vUv.x * 2.7 - vSeed, v * 9.0 - uTime * 0.23));
  float arm = smoothstep(0.5, 0.8, a) * (1.0 - smoothstep(0.84, 1.0, a));
  arm *= (0.5 + 0.9 * nz.b) * (1.0 - v) * (1.0 - 0.6 * v);
  float trail = (1.0 - smoothstep(0.05, 0.42, a)) * (1.0 - smoothstep(0.0, 0.55, v)) * smoothstep(0.25, 0.7, nz2.b + nz.a * 0.4);
  float rings = arm * (0.6 + 0.4 * sin(a * 21.0 - v * 34.0));
  float f = clamp(rings * 0.95 + trail * 0.8, 0.0, 1.0) * smoothstep(0.0, 0.05, v) * clamp(vSpeed * 0.4, 0.3, 1.0);
  float sunSide = 0.5 + 0.5 * dot(normalize(vUp), uSunDir);
  vec3 col = uCream * (0.42 + 0.5 * sunSide) + uAqua * 0.12;
  // night: the stern lantern lays a pool of warm light on the water (11.5 m down the strip from its head)
  float dz = v * vLen - 11.5, dx = vUv.x * (1.3 + 0.33 * v * vLen);
  float pool = uLamp * exp(-(dz * dz * 0.9 + dx * dx) / 11.0) * (1.0 - a * a);         // steady: a lantern, not a flame
  float fa = f * 0.85, al = max(fa, pool * 0.55);
  col = mix(col, uLampCol * 1.6, pool * 0.55 / max(al, 1e-3));
  gl_FragColor = vec4(col, al);
  #include <fog_fragment>
}`,Ja=`
attribute vec3 aP0; attribute vec3 aP1; attribute vec4 aS;     // aS = (size m, kind 0 bead / 1 mist, phase, rate)
uniform float uTime, uPixAng;
varying vec2 vUv; varying vec4 vS; varying float vLife, vDim, vFogK, vSunK;
uniform vec3 uSunDir;
#include <fog_pars_vertex>
void main() {
  float p = fract(aS.z + uTime * aS.w);
  vec3 d = aP1 - aP0;
  vec3 side = normalize(cross(d, vec3(0.3, 1.0, 0.2)) + vec3(1e-4, 0.0, 0.0));
  float sw = fract(aS.w * 7919.0) - 0.5;          // the bow of the arc is the chain's, so its beads follow one another
  vec3 pos = mix(aP0, aP1, p) + side * sin(3.14159 * p) * sw * 0.45 * length(d);
  pos += vec3(sin(uTime * 0.31 + aS.z * 40.0), sin(uTime * 0.27 + aS.z * 23.0), cos(uTime * 0.23 + aS.z * 31.0)) * (0.4 + aS.y * 2.6);
  vec4 wc = modelMatrix * vec4(pos, 1.0);
  float dist = distance(cameraPosition, wc.xyz);
  float size = aS.x, minS = dist * uPixAng * 1.3;
  vDim = aS.y > 0.5 ? 1.0 - smoothstep(0.0, 1.0, (26.0 - dist) / 16.0) : min(1.0, (size * size) / max(minS * minS, 1e-6));
  size = max(size, aS.y > 0.5 ? size : minS);
  vec4 mvPosition = viewMatrix * wc;
  mvPosition.xy += position.xy * size;
  gl_Position = projectionMatrix * mvPosition;
  vUv = position.xy; vS = aS;
  vLife = smoothstep(0.0, 0.1, p) * (1.0 - smoothstep(0.88, 1.0, p));
  vSunK = max(dot(normalize(wc.xyz - cameraPosition + vec3(0.0, 1e-4, 0.0)), uSunDir), 0.0);
  #include <fog_vertex>
}`,Qa=`
precision highp float;
uniform sampler2D uNoise; uniform float uTime;
uniform vec3 uSunCol, uPeach, uCream, uLilac, uAqua;
varying vec2 vUv; varying vec4 vS; varying float vLife, vDim, vSunK;
#include <fog_pars_fragment>
void main() {
  float r2 = dot(vUv, vUv);
  vec2 q = vUv * 0.5 + 0.5;
  float n1 = texture2D(uNoise, q * 0.42 + vec2(vS.z * 5.0, uTime * 0.008 + vS.z)).b;
  float n2 = texture2D(uNoise, q * 0.9 - vec2(uTime * 0.012, vS.z * 3.0)).a;
  if (r2 > 1.0) discard;
  vec3 col; float alpha;
  if (vS.y < 0.5) {
    float core = exp(-r2 * 5.5), spark = exp(-r2 * 40.0);
    float tw = 0.75 + 0.25 * sin(uTime * 1.3 + vS.z * 60.0);
    col = (mix(uAqua, uCream, 0.35 + 0.4 * fract(vS.z * 9.7)) * core * 1.1 + uCream * uSunCol * spark * (0.9 + 2.2 * vSunK)) * tw * vLife * vDim;
    alpha = 0.0;
  } else {
    float soft = (1.0 - r2); soft *= soft;
    alpha = soft * smoothstep(0.42, 0.85, n1 * 0.65 + n2 * 0.5) * 0.085 * vLife * vDim;
    vec3 c = mix(uLilac * 0.75, mix(uPeach, uCream, 0.55), 0.55 + 0.45 * n1) * 0.9 + uCream * uSunCol * vSunK * vSunK * 0.22;
    col = c * alpha;
  }
  float keep = 1.0;
#ifdef USE_FOG
  #ifdef FOG_EXP2
  keep = exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
  keep = 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#endif
  gl_FragColor = vec4(col * keep, alpha * keep);
}`,eo=["#F6C9A8","#FBEEDC","#2E8C8A","#0F4C5C","#7FD6C8","#D9482B","#6B7FB8"],Je=[[293.6,-37.8,152.2],[316.9,-41.5,183.5],[338,-43,216],[355,-46,252],[368,-49,296],[377,-40,330],[374,-8,358],[356,42,376],[328,88,388],[302,122,396],[281,135,410],[268,116,438],[258,72,468],[249,30,506],[242,6,552],[243,1,602],[258,3,642],[292,6,652],[340,20,650],[372,38,654],[398,54,670],[440,66,712],[444,74,768],[400,86,812],[318,98,846],[276,120,894],[254,146,944],[220,168,972],[184,186,958],[162,192,908],[158,191,840],[160,187,778],[148,180,716],[112,172,680],[60,160,663],[-30,114,663],[-90,105,668],[-150.7,87,679.1],[-229.9,69.5,690.7],[-275,62,706],[-325,60,740],[-375,60,782],[-425,56,812],[-478,48,826],[-530,42,832],[-575,40,846],[-611.5,45.2,870.1],[-654.4,53.4,904],[-689.2,62.9,934.4],[-707,70,951]];async function to(x,C={}){const D=x.rng.fork?x.rng.fork("knotted-river-hero"):x.rng,i=(C.palette&&C.palette.length>=7?C.palette:eo).slice(),B={peach:i[0],cream:i[1],teal:i[2],deep:i[3],aqua:i[4],red:i[5],lilac:i[6]},J=Math.max(.6,Math.min(1,C.detail??x.quality?.detail??1)),W=Math.max(.7,Math.min(1.15,C.density??1)),I=C.duration??42,q=s.Vector3,k=e=>new s.Color(e),S=new s.Group;S.name="knotted-river-hero";const c=await Ha(x.yield?()=>x.yield():null),r=c.L;await x.yield?.();const l=await ja(D,x.renderer,x.yield?()=>x.yield():null);await x.yield?.();const g=D(),b=k(B.teal),w=k(B.aqua);g>.8?(b.lerp(k("#2F9A78"),.4),w.lerp(k("#8FE0B0"),.35)):g>.62&&(b.lerp(k("#4189A6"),.34),w.lerp(k("#9FD6E0"),.3));const h="red",f=h==="saffron"?k("#E29A2C"):h==="indigo"?k(B.cream).multiplyScalar(.8):k(B.red),G=f.clone().lerp(k(B.cream),h==="indigo"?.5:.42).multiplyScalar(h==="indigo"?.8:.9),A=new q().fromArray(C.sunDir||[.973,.156,.171]).normalize(),T=k(C.sunColor||"#ffe2b8").multiplyScalar(C.sunIntensity??2.4),z={uFrames:{value:c.tex},uLen:{value:r},uTubeR:{value:Le},uClock:{value:0},uTime:{value:0},uPixAng:{value:.0015},uSunDir:{value:A},uSunCol:{value:T},uNoise:{value:l},uPeach:{value:k(B.peach)},uCream:{value:k(B.cream)},uLilac:{value:k(B.lilac)},uTeal:{value:b},uDeep:{value:k(B.deep)},uAqua:{value:w},uGlowK:{value:C.glow??1},uGlowFar:{value:C.glowFar??1},uLimbP:{value:Math.max(0,Math.min(1,C.limbTight??.35))},uHaze:{value:k(C.haze||B.peach).multiplyScalar(C.haze?1:.74).lerp(w,C.haze?0:.6).lerp(k(B.lilac),C.haze?0:.22)},uHazeK:{value:new s.Vector2(C.hazeDensity??18e-5,C.hazeMax??.75)},uLamp:{value:C.lamp??0},uLampCol:{value:k(C.lampColor||"#ffb45e")},uUnderLit:{value:C.underLit??0},uShadeFill:{value:C.shadeFill??1},uFarCore:{value:C.farCore?k(C.farCore):k(B.deep).multiply(new s.Color(.7,1.25,1.3)).multiplyScalar(.42).add(b.clone().multiplyScalar(.092))},uCaust:{value:new q(...C.caust||[.5,.5,0])},uFill:{value:C.fill??1},uGlitter:{value:C.glitter??1},uGlitW:{value:C.glitterWide??0},uLimbPale:{value:C.limbPale??0},uNetK:{value:C.netContrast??0},uRefl:{value:new s.Vector2(...C.refl||[1,0])},uMoonAmb:{value:k(C.moonAmb||"#000000")}},O=C.body??1,P=()=>s.UniformsUtils.clone(s.UniformsLib.fog),X=c.sOfT(.05),ee=c.sOfT(.5),V=c.sOfT(3.35),te=c.sOfT(4.25),ce=await Ya(c,[{s0:X,s1:ee,step:5,radial:48,snap:!0},{s0:ee,s1:V,step:9.5,radial:24},{s0:V,s1:te,step:5,radial:48,snap:!0},{s0:te,s1:X+r,step:9.5,radial:24}],x.yield?()=>x.yield():null);await x.yield?.();const he=[Math.round(r/30),Math.round(r/12.5),Math.round(r/5.2),Math.round(r/460)],ne=2*Math.round(r/840),le=[[5/30,0],[6.2/12.5,.012],[3.8/5.2,-.02],[5/460,.002],[1.2/420,.004]],ae=e=>({...P(),...z,uSc:{value:new s.Vector4(...e.sc)},uTc:{value:new s.Vector4(...e.tc)},uShoal:{value:new s.Vector2(...e.shoal)},uOffA:{value:new s.Vector2},uOffB:{value:new s.Vector2},uOffC:{value:new s.Vector2},uOffD:{value:new s.Vector2},uOffE:{value:new s.Vector2},uFresK:{value:e.fres??1},uBodyGain:{value:(e.body??1)*O},uFarLines:{value:e.farLines??8},uStreak:{value:new s.Vector2((e.streak?e.streak[0]:1)*(C.streak??1),e.streak?e.streak[1]:1)},uRipple:{value:e.ripple},uGlow:{value:e.glow},uDepthM:{value:e.depth},uCirc:{value:e.circ},uShoalFar:{value:e.shoalFar},uCaustK:{value:e.caust??1},uNet:{value:new s.Vector4(...(e.net||[2,1,1,2]).map(t=>t/e.len))},uBulge:{value:e.bulge},uBulgeK:{value:new s.Vector3(...e.bulgeK)}}),Se=new s.ShaderMaterial({vertexShader:_t,fragmentShader:Gt,fog:!0,uniforms:ae({len:r,net:[Math.round(r/520),Math.round(r/430),Math.round(r/370),Math.round(r/610)],sc:he.map(e=>e/r),tc:[12,29,70,11],farLines:12,shoal:[ne/r,3],ripple:D.range(.5,.68),glow:D.range(.92,1.12),depth:16,circ:_*Le,shoalFar:800,bulge:.2,bulgeK:[Math.round(r/46)*_/r,.7,Math.round(r/19)*_/r]})}),M=new s.Mesh(ce,Se);M.frustumCulled=!1,M.renderOrder=1,M.name="river",S.add(M),await x.yield?.();const a=Je.map(e=>new q(...e)),n=new s.CatmullRomCurve3(a,!1,"centripetal",.5);n.arcLengthDivisions=Math.max(400,a.length*60);const d=(e,t=new q)=>n.getPointAt(Math.max(0,Math.min(1,e)),t),m=(e,t,o,u=2)=>{let F=1e9,y=0;const R={};for(let K=c.sOfT(t),U=c.sOfT(o);K<=U;K+=u){const Q=c.frameAt(K,R).C.distanceToSquared(e);Q<F&&(F=Q,y=K)}return y},p=new q(-436,60,720),N=m(p,2.2,2.55),v=m(p,5.85,6.2),oe=c.frameAt(N).C.clone(),we=c.frameAt(v).C.clone(),pe=oe.clone().add(we).multiplyScalar(.5);await x.yield?.();const be=async(e,t)=>{let o=1e18,u=0,F=0;const y=new q,R={},K=Math.ceil(n.getLength()/10);for(let U=0;U<=K;U++){U%50===49&&await x.yield?.(),d(U/K,y);const Q=m(y,e,t,6),Z=c.frameAt(Q,R).C;if(Z.y>y.y+Le*.5){const Ce=Z.distanceToSquared(y);Ce<o&&(o=Ce,u=U/K,F=Q)}}return{u,s:m(d(u),e,t,1)||F}},Pe=await be(0,.3),Fe=Pe.u,xe=Pe.s;await x.yield?.();const Ge=(await be(2.2,2.55)).u,Oe=m(a[a.length-1],5.6,6.1),Ue=m(a[0],3.3,3.7),Qe=e=>e-_*Math.round(e/_),nt=e=>c.crownTheta(e)+Math.PI;await x.yield?.();const et=new q,Mt=n.getLength(),Ca=10,rt={},At=new q,Wt=n.getSpacedPoints(Math.ceil(Mt/3)),Ee=16,Tt=new Map;await x.yield?.();const It=(e,t,o)=>(Math.floor(e/Ee)+512)*1048576+(Math.floor(t/Ee)+512)*1024+Math.floor(o/Ee)+512;for(const e of Wt){const t=It(e.x,e.y,e.z);let o=Tt.get(t);o||Tt.set(t,o=[]),o.push(e)}const Ht=e=>{let t=9801;for(let o=-1;o<=1;o++)for(let u=-1;u<=1;u++)for(let F=-1;F<=1;F++){const y=Tt.get(It(e.x+o*Ee,e.y+u*Ee,e.z+F*Ee));if(y)for(const R of y)t=Math.min(t,R.distanceToSquared(e))}return Math.sqrt(t)},Fa=Wt.filter((e,t)=>t%8===0),jt=e=>{let t=1e18;for(const o of Fa)t=Math.min(t,o.distanceToSquared(e));return Math.sqrt(t)},fe=Math.ceil(r/12),ie=24,st=new Float32Array(fe*ie),it=new Uint8Array(fe*ie);for(let e=0;e<fe;e++){for(let t=0;t<ie;t++){const o=c.place((e+.5)*r/fe,(t+.5)/ie*_,0,rt);st[e*ie+t]=jt(o.position),it[e*ie+t]=o.up.y<-.3?1:0}(e&3)===3&&await x.yield?.()}const Yt=(e,t)=>st[Math.floor((e%r+r)%r/r*fe)%fe*ie+Math.floor((t%_+_)%_/_*ie)%ie],za=x.core?.makeRng&&x.core?.hashSeed?x.core.makeRng(x.core.hashSeed("knotted-river-hoops:"+x.seed)):D.fork?D.fork("hoops"):D,lt=9.6,kt=1.1,Me=[];{let e=Oe,t=lt,o=za.range(.6,1);for(const[u,F]of[[19,2.5],[29,3.4],[60,6.5]])e+=(t+u)*o,o=1,t=u,Me.push({c:c.place(e,c.crownTheta(e),.5*u).position.clone(),n:c.frameAt(e,{}).T.clone(),R:u,r:F,s:e})}Me.push({c:a[a.length-1].clone(),n:n.getTangentAt(1).normalize(),R:lt,r:kt});const Ct=e=>{let t=1e9;for(const o of Me){et.subVectors(e,o.c);const u=et.dot(o.n),F=Math.sqrt(Math.max(0,et.lengthSq()-u*u))-o.R;t=Math.min(t,Math.hypot(u,F)-o.r)}return t};await x.yield?.();const ve=D.fork?D.fork("fleet"):D,$t=xe-150,We={s:$t,th:nt($t)+.1},Ft=[],zt=[c.place(We.s,We.th,0).position.clone()];await x.yield?.();const Xt=(e,t,o,u)=>({s:e,th:t,vs:o,vth:u,scale:1,yaw:Math.atan2(u*Le,o),phase:ve()*_,seed:ve(),mir:ve.sign()}),Ie=24,tt=[],ut=[],ct=[],Ra=[],Pa=Math.round(200*W),Zt=[.58,.07,.06*J,.14*J,.15].map(e=>Math.round(e*Pa)),Jt=[0,0,0,0,0],Qt=new Uint8Array(fe*ie),ea=Math.round(200/(r/fe));for(let e=0;e<fe;e++)for(let t=0;t<ie;t++)if(st[e*ie+t]<40&&!it[e*ie+t])for(let o=-ea;o<=ea;o++)Qt[((e+o)%fe+fe)%fe*ie+t]=1;const ta=new Uint8Array(fe*ie),aa=Math.round(260/(r/fe));for(let e=0;e<fe;e++)for(let t=0;t<ie;t++)if(st[e*ie+t]<64&&it[e*ie+t])for(let o=-aa;o<=aa;o++){const u=((e+o)%fe+fe)%fe*ie+t;it[u]&&(ta[u]=1)}await x.yield?.();const oa=(e,t)=>{const o=[];let u=1;for(let F=0;F<=Ie;F++){const y=F/Ie*I,R=c.place(e.s+e.vs*y,e.th+e.vth*y,0,rt),K=R.position.clone();if(o.push(K),u=Math.min(u,R.up.y),t){for(const U of[0,5,10,14.5])if(Ht(At.copy(K).addScaledVector(R.up,U))<Ca)return null}if(Ct(K)<5.5||Ct(At.copy(K).addScaledVector(R.up,13))<3.5)return null;for(const U of zt)if(U.distanceToSquared(K)<729)return null}return e.upMin=u,o},na=(e,t)=>{for(let o=0;o<ct.length;o++)for(let u=0;u<=Ie;u++)if(ct[o][u].distanceToSquared(e[u])<t*t)return!1;return!0},ra=e=>{let t=1e9,o=0;for(let Q=0;Q<=Ie;Q+=2){const Z=Q/Ie*I,Ce=Yt(e.s+e.vs*Z,e.th+e.vth*Z);t=Math.min(t,Ce),o+=Ce/(Ie/2+1)}const u=e.s+e.vs*I*.5,F=e.th+e.vth*I*.5,y=Math.floor((u%r+r)%r/r*fe)%fe*ie+Math.floor((F%_+_)%_/_*ie)%ie,R=c.place(u,F,0,rt).up.y,K=o<75&&R<-.25,U=e.vth===0&&Qt[y]===1||ta[y]===1&&R<-.25;return e.d=o,e.dMin=t,e.cls=o<56||K?0:U?4:o<110?1:t<320?2:3,e.cls},sa=56,ia=(e,t)=>{e.hang=!(e.vth===0&&e.upMin>.35&&e.dMin<sa),Jt[e.cls]++,ct.push(t),(e.dMin<sa?tt:ut).push(e)},la=Zt.map(e=>Math.round(e*.3)),Rt=[0,0,0,0,0];for(let e=0,t=0;e<9e3&&Rt.some((o,u)=>o<la[u]);e++){t>30&&(await x.yield?.(),t=0),t++;const o=ve(),u=ve.sign(),F=ve.range(3.6,4.4),y=ve()*r,R=ve()*_,K=o<.6?Math.PI/2+ve.range(-.1,.1):ve.sign()*ve.range(.5,1.1),U={s:y,th:R,vs:u*F*Math.cos(K),vth:u*F*Math.sin(K)/Le},Q=ra(U);if(Rt[Q]>=la[Q])continue;t+=8;const Z=oa(U,U.dMin<60);if(!Z||!na(Z,Q<2||Q===4?15:50))continue;const Ce=Object.assign(Xt(U.s,U.th,U.vs,U.vth),{d:U.d,dMin:U.dMin,cls:Q,upMin:U.upMin});Rt[Q]++,ia(Ce,Z)}await x.yield?.();const Pt=24,ua=Math.round(r/54),ca=r/ua,ha=[],fa=[];for(let e=0;e<Pt;e++)ha.push((e&1?1:-1)*ve.range(3.6,4.4)),fa.push(ve()*ca);const da=[[],[],[],[],[]];for(let e=0;e<Pt;e++){for(let t=0;t<ua;t++){const o={s:fa[e]+t*ca,th:(e+.5+ve.range(-.1,.1))/Pt*_,vs:ha[e],vth:0,no:ve()};da[ra(o)].push(o)}(e&3)===3&&await x.yield?.()}let ma=0;for(const e of[0,4,1,2,3]){const t=da[e].sort((y,R)=>y.no-R.no),o=Zt[e]-Jt[e]+ma;let u=0,F=0;for(const y of t){if(u>=o)break;++F>6&&(await x.yield?.(),F=0);const R=oa(y,y.dMin<60);!R||!na(R,e<2||e===4?11:50)||(ia(Object.assign(Xt(y.s,y.th,y.vs,0),{d:y.d,dMin:y.dMin,cls:e,upMin:y.upMin}),R),u++)}ma=o-u}await x.yield?.();for(let e=0,t=Math.round(12*W);Ft.length<t&&e<6e3;e++){(e&63)===63&&await x.yield?.();const o=ve()*r,u=ve()*_,F=Yt(o,u);if(F<22||F>135)continue;const y=c.place(o,u,0,rt),R=y.position,K=jt(R);K<30||K>125||Ht(At.copy(R).addScaledVector(y.up,8))<16||Ct(R)<22||zt.some(U=>U.distanceToSquared(R)<5625)||ct.some(U=>U.some(Q=>Q.distanceToSquared(R)<729))||(Ft.push({s:o,th:u,d:K,upY:y.up.y}),zt.push(R.clone()))}await x.yield?.();const He=(e,t)=>{const o=new s.InstancedBufferGeometry;e.index&&o.setIndex(e.index);for(const y in e.attributes)o.setAttribute(y,e.attributes[y]);const u=new Float32Array(t.length*4),F=new Float32Array(t.length*4);return t.forEach((y,R)=>{u.set([y.s,y.th,y.yaw,y.scale*y.mir],R*4),F.set([y.vs,y.vth,y.phase,y.seed],R*4)}),o.setAttribute("aA",new s.InstancedBufferAttribute(u,4)),o.setAttribute("aB",new s.InstancedBufferAttribute(F,4)),o.instanceCount=t.length,o},ht=()=>({...P(),...z,uFarGrow:{value:.6},uFarShrink:{value:0},uSail:{value:f},uSailPatch:{value:G},uSailStripe:{value:k("#2B3672")},uStripeAmt:{value:h==="indigo"?1:0}}),pa=new s.ShaderMaterial({vertexShader:St,fragmentShader:xt,uniforms:ht(),fog:!0,side:s.DoubleSide}),Da=new s.ShaderMaterial({vertexShader:St,fragmentShader:xt,uniforms:ht(),fog:!0,side:s.DoubleSide,defines:{MIRROR:1},transparent:!1,blending:s.CustomBlending,blendSrc:s.SrcAlphaFactor,blendDst:s.OneMinusSrcAlphaFactor,depthFunc:s.GreaterDepth,depthWrite:!1}),je=D.fork?D.fork("boat"):D,Na=He(Et(je,"hero",B).geometry(),tt);await x.yield?.();const Ka=Et(je,"far",B).geometry(),La=He(Ka,ut),Ba=He(Et(je,"mirror",B).geometry(),tt.filter(e=>!e.hang)),_e=(e,t,o,u)=>{const F=new s.Mesh(e,t);return F.frustumCulled=!1,F.renderOrder=o,F.name=u,S.add(F),F};_e(Ba,Da,2,"boat-reflections"),_e(Na,pa,3,"hero-boats"),_e(La,pa,3,"far-boats");{const e=[],t=[];for(let y=0;y<=8;y++)for(const R of[-1,0,1])e.push(R,0,y/8);for(let y=0;y<8;y++)for(let R=0;R<2;R++){const K=y*3+R;t.push(K,K+1,K+3,K+1,K+4,K+3)}const u=new s.BufferGeometry;u.setAttribute("position",new s.Float32BufferAttribute(e,3)),u.setIndex(t);const F=new s.ShaderMaterial({vertexShader:Xa,fragmentShader:Za,uniforms:{...P(),...z},fog:!0,transparent:!0,depthWrite:!1,side:s.DoubleSide});_e(He(u,tt.concat(ut)),F,4,"wakes")}const Dt=a[a.length-1].clone(),va=n.getTangentAt(1).normalize(),ga=[],Ye=(C.lamp??0)>0?1.6:1,ft=(e,t,o,u,F,y)=>{const R=new q().crossVectors(t,new q(0,1,0)).normalize(),K=new q().crossVectors(R,t).normalize(),U=_*o,Q=Math.max(72,Math.round(U/5)),Z=14,Ce=[],Te=[],me=[],ze=[],H=[],Y=new q,re=new q,L=new q;for(let se=0;se<=Q;se++){const ke=se/Q*_;Y.copy(R).multiplyScalar(Math.cos(ke)).addScaledVector(K,Math.sin(ke)),re.copy(R).multiplyScalar(-Math.sin(ke)).addScaledVector(K,Math.cos(ke));for(let ye=0;ye<=Z;ye++){const de=ye/Z*_;L.copy(Y).multiplyScalar(Math.cos(de)).addScaledVector(t,Math.sin(de)),Ce.push(e.x+Y.x*o+L.x*u,e.y+Y.y*o+L.y*u,e.z+Y.z*o+L.z*u),Te.push(L.x,L.y,L.z),me.push(re.x,re.y,re.z),ze.push(se/Q*U,de)}}for(let se=0;se<Q;se++)for(let ke=0;ke<Z;ke++){const ye=se*(Z+1)+ke,de=ye+1,Ne=ye+Z+1,Ze=Ne+1;H.push(ye,de,Ne,de,Ze,Ne)}const E=new s.BufferGeometry;E.setAttribute("position",new s.Float32BufferAttribute(Ce,3)),E.setAttribute("normal",new s.Float32BufferAttribute(Te,3)),E.setAttribute("aT",new s.Float32BufferAttribute(me,3)),E.setAttribute("aST",new s.Float32BufferAttribute(ze,2)),E.setIndex(H);const $=Math.max(1,Math.round(U/72)),Be=new s.ShaderMaterial({vertexShader:_t,fragmentShader:Gt,fog:!0,side:s.DoubleSide,uniforms:ae({len:U,sc:[3*$,7*$,16*$,$].map(se=>se/U),tc:[1,2,5,3],shoal:[2*$/U,1],ripple:.5,glow:y.glow??.95,depth:.5,circ:_*u,shoalFar:1,fres:.4,body:y.body??1.9,caust:.3,streak:[1.5,5],bulge:.2*Math.sqrt(u/1.75),bulgeK:[5*$*_/U,2.1,9*$*_/U]})});_e(E,Be,1,F);const ge=new Uint16Array(j*4*4),De=s.DataUtils.toHalfFloat;for(let se=0;se<j;se++){const ke=se/j*_,ye=Math.cos(ke),de=Math.sin(ke),Ne=[e.x+(R.x*ye+K.x*de)*o,e.y+(R.y*ye+K.y*de)*o,e.z+(R.z*ye+K.z*de)*o],Ze=[-R.x*de+K.x*ye,-R.y*de+K.y*ye,-R.z*de+K.z*ye],mt=[t.x,t.y,t.z];for(let ue=0;ue<3;ue++){const Ve=Math.round(Ne[ue]);ge[(0*j+se)*4+ue]=De(Ve),ge[(1*j+se)*4+ue]=De(Ne[ue]-Ve),ge[(2*j+se)*4+ue]=De(Ze[ue]),ge[(3*j+se)*4+ue]=De(mt[ue])}for(let ue=0;ue<4;ue++)ge[(ue*j+se)*4+3]=De(1)}const qe=new s.DataTexture(ge,j,4,s.RGBAFormat,s.HalfFloatType);qe.minFilter=qe.magFilter=s.NearestFilter,qe.generateMipmaps=!1,qe.needsUpdate=!0;const dt={mat:Be,tex:qe,circ:U,R:o,r:u,c:e.clone(),n:t.clone()};return ga.push(dt),dt},wa=ft(Dt,va,lt,kt,"eyelet",{}).mat;await x.yield?.();const qa=ft(Me[0].c,Me[0].n,Me[0].R,Me[0].r,"shed-hoop-inner",{glow:1.7*Ye,body:2.3*Ye});await x.yield?.();const Oa=ft(Me[1].c,Me[1].n,Me[1].R,Me[1].r,"shed-hoop",{glow:1.7*Ye,body:2.2*Ye});await x.yield?.();const Va=ft(Me[2].c,Me[2].n,Me[2].R,Me[2].r,"shed-hoop-outer",{glow:1.7*Ye,body:1.9*Ye});await x.yield?.();{const e=Math.round(3500*J),t=Math.round(120*J),o=e+t,u=new Float32Array(o*3),F=new Float32Array(o*3),y=new Float32Array(o*4),R={},K={},U=90,Q=[];{const me=[],ze=[],H=(U+2*Le)**2,Y=Math.round(600/10);for(let L=0;L<r;L+=10)me.push(c.frameAt(L,{}).C.clone());for(let L=0;L<me.length;L++){(L&63)===63&&await x.yield?.();for(let E=L+Y;E<me.length&&me.length-(E-L)>=Y;E++){const $=me[L].distanceToSquared(me[E]);$<H&&ze.push([$,L*10,E*10])}}ze.sort((L,E)=>L[0]-E[0]);const re=(L,E)=>{const $=Math.abs(L-E)%r;return Math.min($,r-$)};for(const[,L,E]of ze)Q.some($=>re($.sa,L)<400&&re($.sb,E)<400)||Q.push({sa:L,sb:E,ca:c.frameAt(L,{}).C.clone(),cb:c.frameAt(E,{}).C.clone()})}for(let Te=0;Te<e+t&&Q.length;){const me=Te>=e,ze=me?95:85,H=Q[Math.floor(D()*Q.length)%Q.length],Y=H.sa+D.range(-ze,ze),re=H.sb+D.range(-ze,ze);c.place(Y,c.thetaToward(Y,H.cb)+D.gauss()*.5,me?6:.4,R),c.place(re,c.thetaToward(re,H.ca)+D.gauss()*.5,me?6:.4,K);const L=D.chance(.5),E=L?K.position:R.position,$=L?R.position:K.position,Be=1/(me?D.range(70,150):D.range(45,95)),ge=me?1:Math.min(e-Te,D.int(14,28)),De=D();for(let qe=0;qe<ge;qe++,Te++)u.set([E.x,E.y,E.z],Te*3),F.set([$.x,$.y,$.z],Te*3),y.set([me?D.range(9,24):.1+.34*Math.pow(D(),2),me?1:0,De+(qe+D.range(-.3,.3))/ge,Be],Te*4);(Te&255)<28&&await x.yield?.()}const Z=new s.InstancedBufferGeometry;Z.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),Z.setIndex([0,1,2,0,2,3]),Z.setAttribute("aP0",new s.InstancedBufferAttribute(u,3)),Z.setAttribute("aP1",new s.InstancedBufferAttribute(F,3)),Z.setAttribute("aS",new s.InstancedBufferAttribute(y,4)),Z.instanceCount=o;const Ce=new s.ShaderMaterial({vertexShader:Ja,fragmentShader:Qa,uniforms:{...P(),...z},fog:!0,transparent:!0,depthWrite:!1,blending:s.CustomBlending,blendSrc:s.OneFactor,blendDst:s.OneMinusSrcAlphaFactor});_e(Z,Ce,6,"crossing-spray")}if(await x.yield?.(),C.ceilingIslet!==!1){const e=Ut(je),t=je,o=H=>[4,0,0,H],u=22,F=[];for(let H=0;H<u;H++)F.push(10.5+4.5*t());const y=[0,.3,.55,.75,.9,1],R=y.map(()=>F.map(()=>t())),K=(H,Y)=>{const re=H%u/u*_,L=y[Y],E=F[H%u]*L;return[Math.cos(re)*E,Y===5?-.15:.5*(1-L*L)+.1+.22*R[Y][H%u],Math.sin(re)*E]},U=["#5a5a3a","#62603c","#545838","#5e5a40"],Q=["#3c4a3a","#44503c"],Z=H=>e.norm([H[0]*.05,1,H[2]*.05]);for(let H=0;H<u;H++)for(let Y=0;Y<5;Y++){const re=e.rgb(t.pick(Y>=3?Q:U),.06),L=K(H,Y),E=K(H,Y+1),$=K(H+1,Y+1),Be=K(H+1,Y);if(Y===0){const ge=[0,.75,0];e.tri(ge,E,$,re,void 0,void 0,void 0,[Z(ge),Z(E),Z($)]);continue}e.tri(L,E,$,re,void 0,void 0,void 0,[Z(L),Z(E),Z($)]),e.tri(L,$,Be,re,void 0,void 0,void 0,[Z(L),Z($),Z(Be)])}for(let H=0;H<16;H++){const Y=t()*_,re=F[Math.floor(Y/_*u)%u]+t.range(.4,3.2),L=Math.cos(Y)*re,E=Math.sin(Y)*re,$=t.range(.42,.6);e.spar([L,.02,E],[L,.06,E],$,$*.96,7,e.rgb(t.pick(["#3a6236","#46703c","#34583a"]),.08),!0,o(.02)),t.chance(.5)&&e.spar([L+.1,.06,E],[L+.1,.3,E],.05,.17,5,e.rgb("#a9a99c",.05),!1,o(.02),o(.04))}const Ce=270,Te=[[-5.5,11.5,.5,1.05,1],[-1.6,8.6,-.4,.95,.4],[1.8,10.4,.9,1,.8],[4.6,7.8,-1.1,.9,.1]];for(let H=0;H<Ce;H++){const Y=H>=185,re=t()*_,L=F[Math.floor(re/_*u)%u],E=Y?L*t.range(.82,1):Math.sqrt(t())*(L-1.5),$=Math.cos(re)*E,Be=Math.sin(re)*E,ge=!Y&&Be>5.5&&Math.abs($)<7.5;if(ge&&Te.some(de=>Math.hypot(de[0]-$,de[1]-Be)<.9))continue;const De=.45*(1-(E/14)**2)+.15,qe=ge?t.range(.3,.75):Y?t.range(.9,1.9):t.range(2.2,3.7),dt=Y||ge?4:5+(t()<.4?1:0),se=e.rgb(t.pick(["#27421f","#2f4d22","#365224"]),.1),ke=e.rgb(t.pick(["#8a7a34","#96843a","#7c7a30"]),.1),ye=[(se[0]*1.3+ke[0])/2.1,(se[1]*1.5+ke[1])/2.1,(se[2]*1.3+ke[2])/2.1];for(let de=0;de<dt;de++){const Ne=qe*t.range(.7,1),Ze=t()*Math.PI,mt=t.range(.05,.08),ue=Math.cos(Ze)*mt,Ve=Math.sin(Ze)*mt,Ma=t()*_,Aa=t.range(.15,.3)*Ne,Lt=Math.cos(Ma)*Aa,Bt=Math.sin(Ma)*Aa,pt=$+t.range(-.25,.25),vt=Be+t.range(-.25,.25),Ke=[pt+Lt*.35,De+Ne*.58,vt+Bt*.35],Re=[pt+Lt,De+Ne,vt+Bt],gt=.33*(Ne/3),ot=Ne/3;if(e.quad([pt-ue,De,vt-Ve],[pt+ue,De,vt+Ve],[Ke[0]+ue*.75,Ke[1],Ke[2]+Ve*.75],[Ke[0]-ue*.75,Ke[1],Ke[2]-Ve*.75],se,o(0),o(0),o(gt),o(gt)),e.tri([Ke[0]-ue*.75,Ke[1],Ke[2]-Ve*.75],[Ke[0]+ue*.75,Ke[1],Ke[2]+Ve*.75],Re,ye,o(gt),o(gt),o(ot)),de===0&&!Y&&!ge&&t.chance(.45)){const Ga=e.rgb("#9c8c6a",.08),wt=.07;e.quad([Re[0],Re[1]-.1,Re[2]],[Re[0]+wt,Re[1]+.25,Re[2]+wt],[Re[0]+Lt*.12,Re[1]+.7,Re[2]+Bt*.12],[Re[0]-wt,Re[1]+.25,Re[2]-wt],Ga,o(ot),o(ot*1.1),o(ot*1.25),o(ot*1.1))}}}for(const H of Te)$a(e,...H);const me=He(e.geometry(),[{s:We.s,th:We.th,yaw:0,scale:1,mir:1,vs:0,vth:0,phase:t()*_,seed:t()}]),ze=new s.ShaderMaterial({vertexShader:St,fragmentShader:xt,uniforms:ht(),fog:!0,side:s.DoubleSide,defines:{WRAP:1}});_e(me,ze,3,"ceiling-islet")}const Ae=e=>[Math.round(e.x*10)/10,Math.round(e.y*10)/10,Math.round(e.z*10)/10],$e=e=>c.P(e).map(t=>Math.round(t)),at={min:[1e9,1e9,1e9],max:[-1e9,-1e9,-1e9]};for(let e=0;e<400;e++){const t=c.P(e/400*_);for(let o=0;o<3;o++)at.min[o]=Math.min(at.min[o],Math.round(t[o]-Le)),at.max[o]=Math.max(at.max[o],Math.round(t[o]+Le))}const _a={entry:{position:Je[0].slice(),heading:Ae(n.getTangentAt(0))},flyThrough:Je.map(e=>e.slice()),crossing:{position:Ae(pe),upperCentre:Ae(oe),lowerCentre:Ae(we),upperS:N,lowerS:v},under:{u:Fe,s:xe,position:Ae(d(Fe)),islet:{s:We.s,th:We.th}},bridge:{u:Ge,s:N,position:Ae(d(Ge))},arm:{s:Oe},entryS:Ue,portalSeat:{position:Ae(Dt),facing:Ae(va.clone().negate()),hoopRadius:lt,hoopThickness:kt*2},hoops:ga.map(e=>({centre:Ae(e.c),axis:Ae(e.n),radius:e.R,thickness:e.r*2})),viewpoints:{wholeKnot:{position:Je[10].slice(),look:[-20,330,1e3]},crossing:{position:Ae(d(Fe-.045)),look:Ae(c.place(xe,nt(xe),0).position)},eye:{position:Je[36].slice(),look:Ae(Dt)},hill:{position:Je[0].slice(),look:Ae(c.frameAt(c.sOfT(3.8)).C)}},berths:Ft,pois:{knot:[-20,330,1e3],ceiling:Ae(c.place(xe,nt(xe),0).position)},landmarks:{eye:[0,142,971],topCrossing:$e(1.8235).map((e,t)=>Math.round((e+$e(4.4597)[t])/2)),twinCrossing:[-429,60,737],lobeRight:$e(1.0472),lobeLeft:$e(5.236),archTop:$e(1.5),lowest:$e(3.61)},bounds:at,sunDir:A.toArray()};let Nt=null;const ba=new s.Vector2,ya=e=>e-Math.floor(e),Sa=[],Xe=(e,t,o)=>{const u=e.uniforms,F=["uOffA","uOffB","uOffC","uOffD","uOffE"];for(let y=0;y<5;y++)u[F[y]].value.set(-ya(t*le[y][0]*o[0]),ya(t*(le[y][1]*o[1]+o[2])))},xa=(e,t,o)=>{z.uTime.value=t,z.uClock.value=Nt==null?t:Nt*I,o&&x.renderer&&(x.renderer.getDrawingBufferSize(ba),z.uPixAng.value=2/((o.projectionMatrix.elements[5]||1.66)*Math.max(1,ba.y))),Xe(Se,t,[1,1,0]),Xe(wa,t,[.55,1,.07]),Xe(Oa.mat,t,[.5,1,.05]),Xe(Va.mat,t,[.6,1,.035]),Xe(qa.mat,t,[.52,1,.06]);for(const[u,F]of Sa)Xe(u,t,[F,1,.05])};xa(0,0,null);const Kt={c:new q(0,230,850),r:420,h:500};return{object:S,radius:Kt.r,height:Kt.h,center:Kt.c,anchors:_a,update:xa,ground:!1,groundY:-750,setProgress(e){Nt=e==null?null:Math.max(0,Math.min(1,e))},setSun(e,t,o=2.4){A.copy(e.isVector3?e:new q().fromArray(e)).normalize(),t&&T.set(t).multiplyScalar(o)},frameAt:c.frameAt,place:c.place,sOfT:c.sOfT,tOfS:c.tOfS,crownTheta:c.crownTheta,thetaToward:c.thetaToward,centreAt:c.P,eyelet:wa,length:r,tubeRadius:Le,radialGLSL:Vt,skyGLSL:yt,uniforms:z,occupied:Ra,cast:h,fleet:{heroes:tt,far:ut},instanced:He,add:_e,builder:()=>Ut(je),noise:l,palette:B,standMaterial:e=>new s.ShaderMaterial({vertexShader:St,fragmentShader:xt,uniforms:ht(),fog:!0,side:s.DoubleSide,defines:e||{}}),waterMaterial(e,t={}){const o=t.radius??2,u=new s.ShaderMaterial({vertexShader:_t,fragmentShader:Gt,fog:!0,side:s.DoubleSide,uniforms:ae({len:e,sc:[3,7,16,2].map(F=>F*(t.tiles??1)/e),tc:[1,2,5,1],shoal:[2/e,1],ripple:t.ripple??.5,glow:t.glow??1.4,caust:t.caust??.4,depth:.5,circ:_*o,shoalFar:1,bulge:t.bulge??.15,bulgeK:[5*_/e,2.1,9*_/e]})});return Sa.push([u,t.flow??.5]),u},dispose(){c.tex.dispose(),l.dispose()}}}export{$a as addHeron,to as buildHero,Ut as makeBuilder};
