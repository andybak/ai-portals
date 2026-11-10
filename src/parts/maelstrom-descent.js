import*as t from"three";const X=Math.PI*2,re=300,Z=55,fe=110,Re=245,We=46,vt=-137,De=30,Ne=-200,tt=24,Xe=-262,Le=14,gt=6,Ee=3600,Ue=Math.tan(20*Math.PI/180),ot=1/Ue,at=1/Math.tan(40*Math.PI/180),wt=["#0A2B2A","#1E5A4C","#8FA23C","#F0B85A","#2C4A66","#EEE8D8","#B8864C"],ue=s=>Math.min(1,Math.max(0,s)),ie=(s,h,c)=>{const w=ue((c-s)/(h-s));return w*w*(3-2*w)},$=(s,h,c)=>s+(h-s)*c;function J(s){if(s>=re)return 0;const h=(re-Math.max(s,Z))/Re;return-fe*h*h*h}function Oe(s){if(s>=re||s<Z)return 0;const h=(re-s)/Re;return 3*fe*h*h/Re}function rt(s){const h=20.5-13.5*ie(60,300,s);return s>re?h*Math.exp(-(s-re)/500):h}function Ie(s){return rt(s)/Math.max(s,20)}function st(s,h,c,w){const S=64*Math.pow(2,-s),k=.5+.5*Math.sin(X*(S*(h-at*c)-.03*w));return k*Math.sqrt(k)-.42}function xt(s,h,c,w){const S=Math.min(3.6,Math.max(0,Math.log2(re/c))),k=Math.floor(S),L=ie(.2,.8,S-k),n=$(.5,1.2,.5+.5*Math.sin(X*5*s+19*h+.21*w)),V=(1-ie(262,296,c))*$(.45,1,ie(40,60,c));return n*V*$(st(k,s,h,w),st(k+1,s,h,w),L)}function yt(s,h,c){return .5*Math.sin(.0898*(.8*s+.6*h)-.94*c)+.3*Math.sin(.1532*(-.35*s+.94*h)-1.23*c+1.7)+.18*Math.sin(.2732*(.95*s-.31*h)-1.64*c+4.1)}const bt=s=>ie(306,332,s)*(1-ie(900,1800,s));async function kt(s,h){const w=new Uint8Array(262144),S=new Uint8Array(512),k=new Float32Array(256);for(let i=0;i<256;i++)S[i]=i,k[i]=s();for(let i=255;i>0;i--){const m=Math.floor(s()*(i+1)),f=S[i];S[i]=S[m],S[m]=f}for(let i=0;i<256;i++)S[i+256]=S[i];const L=(i,m,f,b)=>k[S[(i%f+f)%f+S[(m%f+f)%f+b&255]]&255],n=(i,m,f,b)=>{const C=Math.floor(i),M=Math.floor(m),A=i-C,a=m-M,l=A*A*A*(A*(A*6-15)+10),u=a*a*a*(a*(a*6-15)+10),p=L(C,M,f,b),P=L(C+1,M,f,b),R=L(C,M+1,f,b),q=L(C+1,M+1,f,b);return p+(P-p)*l+(R-p)*u+(p-P-R+q)*l*u},V=(i,m,f,b,C)=>{let M=0,A=.5,a=0,l=f;for(let u=0;u<b;u++)M+=A*n(i*l,m*l,l,C+u*17),a+=A,A*=.5,l*=2;return M/a},E=i=>{const m=new Float32Array(i*i*2);for(let f=0;f<m.length;f++)m[f]=s();return m},Y=11,U=29,T=E(Y),z=E(U),K=(i,m,f,b)=>{const C=i*f,M=m*f,A=Math.floor(C),a=Math.floor(M);let l=9,u=9;for(let p=-1;p<=1;p++)for(let P=-1;P<=1;P++){const R=A+P,q=a+p,le=(R%f+f)%f,ve=(q%f+f)%f,me=(ve*f+le)*2,se=R+b[me]-C,te=q+b[me+1]-M,oe=se*se+te*te;oe<l?(u=l,l=oe):oe<u&&(u=oe)}return Math.sqrt(u)-Math.sqrt(l)},W=new Float32Array(256*256);for(let i=0;i<256;i++){(i&31)===0&&await h?.();for(let m=0;m<256;m++)W[i*256+m]=V((m+.5)/256,(i+.5)/256,6,4,91)}for(let i=0;i<256;i++){(i&7)===0&&await h?.();for(let m=0;m<256;m++){const f=(m+.5)/256,b=(i+.5)/256,C=(i*256+m)*4,M=V(f,b,4,4,7),A=f+(V(f,b,8,2,33)-.5)*.05,a=b+(V(f,b,8,2,57)-.5)*.05,l=K(A,a,Y,T),u=K(A,a,U,z),p=1-ie(.02,.16+.22*M,l),P=1-ie(.03,.22+.3*M,u),R=ue(Math.max(p,P*(.45+.5*M))*.85+(M-.5)*.3+.1),q=(m+256-1)%256,le=(m+1)%256,ve=(i+256-1)%256,me=(i+1)%256,se=(W[i*256+le]-W[i*256+q])*22,te=(W[me*256+m]-W[ve*256+m])*22;w[C]=Math.round(R*255),w[C+1]=Math.round(ue(M*1.6-.3)*255),w[C+2]=Math.round(ue(.5+se)*255),w[C+3]=Math.round(ue(.5+te)*255)}}const D=new t.DataTexture(w,256,256,t.RGBAFormat,t.UnsignedByteType);return D.wrapS=D.wrapT=t.RepeatWrapping,D.magFilter=t.LinearFilter,D.minFilter=t.LinearMipmapLinearFilter,D.generateMipmaps=!0,D.anisotropy=8,D.colorSpace=t.NoColorSpace,D.needsUpdate=!0,D}function At(){const s=[],h=(a,l,u={})=>s.push({r:a,y:l,br:0,by:0,crest:0,...u});for(let a=0;a<22;a++)h(Ee*Math.pow(420/Ee,a/22),0);const w=22;for(let a=0;a<w;a++)h(420-106*(a/w),0);const S=[[314,0],[312,.2],[310,.7],[308,1.6],[306,2.8],[304.4,3.9],[302.9,4.6],[301.5,5],[300.2,4.9],[299,4.45],[298.2,3.7],[298.3,2.9],[299,2.1],[299.5,1.3],[299.3,.6],[298.2,.15],[296.6,-.02],[295,-.03]].map(a=>new t.Vector3(a[0],a[1],0)),k=new t.CatmullRomCurve3(S,!1,"centripetal"),L=22;for(let a=0;a<=L;a++){const l=a/L,u=k.getPoint(l),p=k.getTangent(l),P=314-19*l,R=J(P);h(P,R,{br:u.x-P,by:u.y-R,crest:ue(u.y/5),n:[p.y,-p.x]})}const n=[0],V=[295],E=400;for(let a=1;a<=E;a++){const l=295-(295-Z)*(a/E);V.push(l),n.push(n[a-1]+Math.hypot(V[a-1]-l,J(V[a-1])-J(l)))}const Y=82;let U=0;for(let a=1;a<=Y;a++){const l=n[E]*(a/Y);for(;U<E-1&&n[U+1]<l;)U++;const u=(l-n[U])/Math.max(1e-6,n[U+1]-n[U]),p=$(V[U],V[U+1],u);h(p,J(p))}const T=Math.atan(Oe(Z)),z=Math.atan2(vt-Ne,We-De),K=(Z-We)/(Math.sin(z)-Math.sin(T)),W=K*(Math.cos(T)-Math.cos(z)),D=9;for(let a=1;a<=D;a++){const l=$(T,z,a/D);h(Z-K*(Math.sin(l)-Math.sin(T)),-fe-K*(Math.cos(T)-Math.cos(l)))}const i=-fe-W,m=9;for(let a=1;a<=m;a++){const l=a/m;h($(We,De,l),$(i,Ne,l))}const f=8;for(let a=1;a<=f;a++){const l=a/f;h($(De,tt,l),$(Ne,Xe,l))}const b=[[314,0,0],[312,.05,0],[310,.22,0],[308,.7,0],[306.2,1.6,0],[304.7,2.85,0],[303.3,4.05,.05],[302,4.85,.2],[300.8,5.15,.45],[299.6,4.95,.75],[298.5,4.4,1],[297.8,3.75,1],[297.9,3.3,.85],[298.8,3.1,.4],[299.6,2.55,.12],[300,1.8,.03],[299.6,1,0],[298.6,.4,0],[297,.08,0],[295,-.03,0]].map(a=>new t.Vector3(a[0],a[1],a[2])),C=new t.CatmullRomCurve3(b,!1,"centripetal"),M=38,A=[];for(let a=0;a<=M;a++){const l=a/M,u=C.getPoint(l),p=C.getTangent(l),P=314-19*l,R=J(P);A.push({r:P,y:R,br:u.x-P,by:u.y-R,crest:ue(u.y/5),lip:ue(u.z),n:[p.y,-p.x],q:l})}for(const a of A){const l=Math.hypot(a.n[0],a.n[1])||1;a.nr=a.n[0]/l,a.ny=a.n[1]/l}for(let a=0;a<s.length;a++){const l=s[Math.max(0,a-1)],u=s[Math.min(s.length-1,a+1)],p=s[a];if(!p.n){const R=u.r-l.r,q=u.y-l.y,le=Math.hypot(R,q)||1;p.n=[q/le,-R/le]}const P=Math.hypot(p.n[0],p.n[1])||1;p.nr=p.n[0]/P,p.ny=p.n[1]/P}s[0].W=Math.log(s[0].r);for(let a=1;a<s.length;a++){const l=s[a-1],u=s[a];u.W=l.W-Math.hypot(l.r-u.r,l.y-u.y)/(.5*(l.r+u.r))}{const a=s[22+w],l=s[22+w+L];for(const u of A)u.W=$(a.W,l.W,u.q)}return{rings:s,topY:i,strip:A}}const ee=`
#define TAU 6.2831853
#define RIM 300.0
#define TANA ${Ue.toFixed(5)}
#define COTA ${ot.toFixed(5)}
#define COTB ${at.toFixed(5)}
uniform float uTime, uSunTan, uGlowAmt, uBigPh;
uniform vec4 uShade; uniform vec2 uShadeE; uniform float uGlowFall, uClear;   // depth (m) over which the transmitted glow dies; extra clarity of the sunward wall   // cloud shadows / the squall's slot of sun: xy = wave vector (rad/m), z phase, w amount
uniform vec3 uCam, uSunDir, uSunCol, uAmb, uSkyZen, uSkyWarm, uSkyCool, uDeep, uBottle, uGlow, uGold, uFoam;
uniform vec2 uSunH;
uniform vec4 uSeat;      // the exit ring: xyz position, w strength of its light on the mist and the shaft wall (0 = none)
uniform sampler2D uNoise;
float wallYg(float r){ float x = (RIM - clamp(r, ${Z.toFixed(1)}, RIM)) / ${Re.toFixed(1)}; return -${fe.toFixed(1)} * x * x * x; }
float ridgeOct(float k, vec2 P, float t){
  float nr = 64.0 * exp2(-k);
  float s = 0.5 + 0.5 * sin(TAU * (nr * (P.x - COTB * P.y) - 0.03 * t));
  return s * sqrt(s) - 0.42;
}
float ridgeH(vec2 P, float r, float t){
  float L = clamp(log2(RIM / max(r, 1.0)), 0.0, 3.6), k = floor(L), f = smoothstep(0.2, 0.8, L - k);
  float a = mix(0.5, 1.2, 0.5 + 0.5 * sin(TAU * 5.0 * P.x + 19.0 * P.y + 0.21 * t));
  float env = (1.0 - smoothstep(262.0, 296.0, r)) * mix(0.45, 1.0, smoothstep(40.0, 60.0, r));
  return a * env * mix(ridgeOct(k, P, t), ridgeOct(k + 1.0, P, t), f);
}
float chopH(vec2 p, float t){
  return 0.50 * sin(0.0898 * dot(p, vec2(0.80, 0.60)) - 0.94 * t)
       + 0.30 * sin(0.1532 * dot(p, vec2(-0.35, 0.94)) - 1.23 * t + 1.7)
       + 0.18 * sin(0.2732 * dot(p, vec2(0.95, -0.31)) - 1.64 * t + 4.1);
}
float chopEnv(float r){ return smoothstep(306.0, 332.0, r) * (1.0 - smoothstep(900.0, 1800.0, r)); }
float brkAmp0(float X, float t){ return 0.78 + 0.22 * sin(TAU * 3.0 * X + 0.23 * t) + 0.16 * sin(TAU * 7.0 * X - 0.31 * t + 1.3) + 0.12 * sin(TAU * 17.0 * X + 0.47 * t + 4.0); }
float brkAmp(float X, float t){ return clamp(brkAmp0(X, t), 0.35, 1.3); }
// THE BREAKER AT THE CROSSING. The sea mesh has one vertex every 7.4 m round the rim, so its breaker can only swell
// and sink over 100 m and more: seen along its length from the crest it was a smooth rolled tube. Over the arc uBrkArc
// (centre and half-width in turns: where the route crosses the rim) the breaker is a mesh of its own, a vertex every
// 0.57 m, and there its height also carries lobes of 30, 13 and 6 m and sharp teeth (brkAmpF), and its lip is thrown
// forward in some stretches and slumps back in others (brkCurl). brkFineW = 1 on that strip, 0 at its ends, where it
// meets the sea mesh's own breaker.
uniform vec3 uBrkArc;      // x, y: the fine strip's centre and half-width (turns); z: where the route crosses the crest (turns; negative = no saddle)
uniform vec4 uKeep;        // xyz: a thing the spindrift must not veil (the world's leader at the crossing), w: radius of clear air round the sight line to it (0 = none)
float brkFineW(float X){ float dx = abs(fract(X - uBrkArc.x + 0.5) - 0.5); return 1.0 - smoothstep(uBrkArc.y * 0.78, uBrkArc.y, dx); }
// 1 where the crest at X is within ~60 m of the eye, 0 beyond ~190 m. Far off the wall keeps only its long lobes (a low,
// nearly level line of surf: with its teeth it stood on the horizon like a range of snow peaks); close to, it is torn.
float brkNear(float X){ vec2 pr = RIM * vec2(cos(TAU * X), sin(TAU * X)); return 1.0 - smoothstep(40.0, 135.0, length(uCam.xz - pr)); }
// 1 where the crest is seen from far off (over 135 m), or from over ~60 m while the eye is still outside the rim (the
// run-in): there it is a low line of surf, half as lumpy
float brkFar(float X){ vec2 pr = RIM * vec2(cos(TAU * X), sin(TAU * X)); float dd = length(uCam.xz - pr); return max(smoothstep(40.0, 135.0, dd), smoothstep(RIM - 6.0, RIM + 14.0, length(uCam.xz)) * smoothstep(35.0, 85.0, dd)); }
// the saddle where the route goes over: 1 on the crossing, 0 from ~14 m either side of it
float brkNotch(float X){ float dm = (fract(X - uBrkArc.z + 0.5) - 0.5) * 1885.0; return exp(-dm * dm / (dm > 0.0 ? 190.0 : 72.0)) * step(0.0, uBrkArc.z); }      // (longer on the side the eye looks along: the wall stands up 15 - 20 m off, seen from the side, not under the bow)
float brkAmpF(float X, float t){
  float nk = brkNear(X), tk = 0.12 + 0.88 * nk * nk;
  float a = 0.76 + 0.2 * (brkAmp0(X, t) - 0.78)
    + 0.055 * sin(TAU * 60.0 * X + 0.9 * t + 2.0 * sin(TAU * 11.0 * X + 0.13 * t))
    + 0.07 * tk * sin(TAU * 140.0 * X - 1.4 * t + 1.7 + 2.4 * sin(TAU * 23.0 * X + 0.3 * t))
    + 0.04 * tk * sin(TAU * 330.0 * X + 2.3 * t + 0.6 + 3.0 * sin(TAU * 41.0 * X - 0.5 * t));
  float tooth = 0.5 + 0.5 * sin(TAU * 211.0 * X - 1.9 * t + 2.6 * sin(TAU * 29.0 * X + 0.4 * t));
  float tooth2 = 0.5 + 0.5 * sin(TAU * 397.0 * X + 2.7 * t + 3.1 * sin(TAU * 53.0 * X - 0.6 * t) + 1.1);
  float jag = sin(TAU * 640.0 * X - 3.4 * t + 2.2 * sin(TAU * 71.0 * X + 0.7 * t));
  // near the eye the top is ragged at 2 - 3 m as well: no two metres of it stand at one height
  float rag = sin(TAU * 905.0 * X + 3.1 * t + 2.5 * sin(TAU * 97.0 * X - 0.8 * t)) * (0.45 + 0.55 * sin(TAU * 263.0 * X + 1.3 * t));
  float amp = clamp(a + tk * (0.045 * tooth * tooth * tooth + 0.035 * tooth2 * tooth2 * tooth2 + 0.025 * jag) + 0.05 * nk * nk * rag, 0.55, 1.25);      // (no tooth stands more than half a metre above its neighbours: at 1.2 m the top was a row of white points)      // one standing wall 3 - 6 m high with a torn, nearly level top (peaked teeth 1.3 m high with white tips were a row of snow mountains)
  return amp * (1.0 - 0.42 * brkNotch(X)) * mix(0.62, 1.0, nk);      // (from the race and from across the funnel: a low line of surf, not a range)      // ... and a saddle of green water, half as high, where the route goes over it
}
// -1 the lip has slumped back and collapsed .. +1 it pitches forward over the hollow (in the saddle: neither)
// (the first standing stretch past the saddle, 18 - 46 m along: always a plunging curl. The eye comes over the crest
// looking along the wall, so this is the one place where the lip is seen in profile, pitched over its own shadow)
float brkCurlWin(float X){ float dm = (fract(X - uBrkArc.z + 0.5) - 0.5) * 1885.0 - 32.0; return exp(-dm * dm / 260.0) * step(0.0, uBrkArc.z); }
float brkCurl(float X, float t){ return mix(mix(0.62 * sin(TAU * 47.0 * X + 0.6 * t + 1.9 * sin(TAU * 9.0 * X - 0.2 * t) + 2.1) + 0.38 * sin(TAU * 113.0 * X - 1.1 * t + 0.4), -0.1, brkNotch(X)), 0.9 + 0.1 * sin(TAU * 113.0 * X - 1.1 * t), brkCurlWin(X)); }
float brkAmpAt(float X, float t){ return mix(brkAmp(X, t), brkAmpF(X, t), brkFineW(X)); }
// distance along unit horizontal direction d from p to the rim cylinder
float cylExit(vec2 p, vec2 d){ float b = dot(p, d), c = dot(p, p) - RIM * RIM; return -b + sqrt(max(b * b - c, 0.0)); }
// 1 where the low sun reaches p over the far rim, 0 in the rim's shadow
float sunLit(vec3 p){
  float r = length(p.xz);
  float clear = p.y + cylExit(p.xz, uSunH) * uSunTan - 3.0;
  float cs = 0.5 + 0.5 * sin(dot(p.xz, uShade.xy) + uShade.z + 0.9 * sin(dot(p.xz, uShade.yx * vec2(-0.7, 0.7)) + 1.7));
  // (the rim's shadow line is a penumbra 20 m deep with a wandering edge: the breaker that casts it is toothed and smoking.
  // Across the funnel a 5 m edge was one straight pale line on the far wall, like a painted stripe)
  clear += 5.0 * sin(dot(p.xz, vec2(0.071, 0.043)) + 1.7 * sin(dot(p.xz, vec2(-0.031, 0.058))));
  return mix(smoothstep(-8.0, 12.0, clear), 1.0, smoothstep(294.0, 304.0, r)) * (1.0 - uShade.w * smoothstep(uShadeE.x, uShadeE.y, cs));
}
// the sector of wall the sun shines THROUGH (rh = unit radial direction)
float sunLobe(vec2 rh){ return smoothstep(0.12, 0.96, dot(rh, uSunH)); }
vec3 skyCol(vec3 d){
  float h = max(d.y, 0.0);
  float sw = 0.5 + 0.5 * dot(d.xz / max(length(d.xz), 1e-4), uSunH);
  vec3 hor = mix(uSkyCool, uSkyWarm, sw * sw * sw);
  return mix(hor, uSkyZen, pow(h, 0.42));
}
vec3 applyFogPremul(vec3 c, float a, vec3 fc, float ff){ return mix(c, fc * a, ff); }
`,Ut=ee,Pt=`
${ee}
attribute vec2 aPolar; attribute vec4 aBrk;      // breaker: radial and vertical offset at full height, crest 0..1, lip weight (the strip at the crossing only)
varying vec3 vPos, vN; varying vec2 vP; varying float vR, vCrest; varying vec4 vBk;      // vBk: the breaker's height factor, 1 on the fine strip, the lip's curl, 0 outer foot .. 1 inner foot
#include <fog_pars_vertex>
void main(){
  vec3 p = position; float r0 = length(p.xz); vec2 rh = p.xz / max(r0, 1e-3);
  float X = aPolar.x, fw = brkFineW(X);
  float amp = mix(brkAmp(X, uTime), brkAmpF(X, uTime), fw); amp = mix(amp, 0.85, 0.5 * brkFar(X));      // (far off the crest is half as lumpy: see brkFar)
  float cu = brkCurl(X, uTime) * fw * mix(0.45, 1.0, brkNear(X)), lipK = aBrk.w * fw;      // (far off the lip's lobes are half as deep: a nearly level line of surf, not a scalloped hedge)
  // the lip: pitched forward over the hollow (cu > 0) or slumped back and down (cu < 0)
  p.xz += rh * (aBrk.x * amp - lipK * (0.3 + 3.0 * max(cu, 0.0) + 1.3 * min(cu, 0.0)) * amp); p.y += aBrk.y * amp - lipK * (0.8 * max(cu, 0.0) + 1.5 * max(-cu, 0.0)) * amp;      // (thrown up to 3.3 m: a real overhang with a hollow under it)
  vec3 nrm = normal;
  if (fw > 0.001 && aBrk.z > 0.001) {      // the teeth have sides: tilt the normal by the crest's slope along its length
    float e = 0.0004, ampE = mix(brkAmp(X + e, uTime), brkAmpF(X + e, uTime), fw);
    nrm = normalize(nrm - vec3(-rh.y, 0.0, rh.x) * (aBrk.y * (ampE - amp) / (e * TAU * max(r0, 1.0))) * 0.8);
  }
  p += normal * ridgeH(aPolar, r0, uTime);
  p.y += chopH(p.xz, uTime) * chopEnv(r0);
  vPos = p; vN = nrm; vP = aPolar; vR = r0; vCrest = aBrk.z * amp; vBk = vec4(amp, fw * step(0.001, aBrk.z), cu, clamp((314.0 - r0) / 19.0, 0.0, 1.0));
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,St=`
${ee}
uniform float uPh1[9], uPh2[9], uPh3[9];
uniform vec4 uWake[8]; uniform vec4 uWakeDir[8]; uniform float uWakeC[8]; uniform vec4 uClearAt, uClearB;
uniform vec2 uBigN; uniform float uCov, uRib, uFloor, uPour, uBrkK;
varying vec3 vPos, vN; varying vec2 vP; varying float vR, vCrest; varying vec4 vBk;
#include <fog_pars_fragment>
float gNear, gWk, gOw, gShaft;              // set in main before the foam look-ups: near weight (1 within 14 m of the eye, 0 beyond 46 m), wake strength, this octave's share, 1 in the shaft
float gCrisp, gWn; vec2 gUv, gGx, gGy; vec4 gT, gT4;   // out of foamOct (surface layer): the crisp near-field foam, its weight, and the octave's own uv and noise for the wavelets
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
// A cellular field worked out per pixel (no texture: it is sharp at any magnification). uvf = fract(octave uv), G = whole
// cells per unit uv (so it repeats exactly like the noise texture and rides the same flow), asp = the cell's shape in
// metres (short side 1). x: F2 - F1 (0 on a cell wall, growing into the cell), y: a hash of the nearest cell, z: F1
// (distance to the cell's own point).
vec3 cellLace(vec2 uvf, vec2 G, vec2 asp){
  vec2 x = uvf * G, c = floor(x), fr = x - c, id = vec2(0.0); float f1 = 64.0, f2 = 64.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)), cc = mod(c + g, G), o = 0.12 + 0.76 * h22(cc);
    vec2 dv = (g + o - fr) * asp; float dd = dot(dv, dv);
    if (dd < f1) { f2 = f1; f1 = dd; id = cc; } else if (dd < f2) { f2 = dd; }
  }
  f1 = sqrt(f1);
  return vec3(sqrt(f2) - f1, fract(id.x * 0.371 + id.y * 0.713 + 0.11), f1);
}
// one wavelet riding the flow: its slope along (ts, tc). K = whole waves per unit uv (seamless), cusp 1 = sharp crest.
// It fades out where its wavelength nears a pixel, so nothing shimmers far off.
vec2 wavelet(vec2 uvf, vec2 gx, vec2 gy, vec2 K, float steep, float hz, float warp, float cusp){
  float ph = TAU * (dot(K, uvf) + hz * uTime) + warp;
  float fade = 1.0 - smoothstep(0.1, 0.36, abs(dot(K, gx)) + abs(dot(K, gy)));
  float sn = sin(ph), cn = cos(ph);
  float sl = mix(cn, -1.5 * sn / sqrt(2.08 - 2.0 * cn), cusp);
  vec2 dir = K * vec2(1.064, 2.92);
  return dir / max(length(dir), 1e-4) * (sl * steep * fade);
}
// six wavelets, 1.6 m down to 0.2 m, crossing one another: the facets of the water beside the boat. Bare, they would
// weave a regular cloth; each is bent by the noise (its crests wander and break into short lengths) and comes and
// goes in patches of its own, so no two square metres are alike. nA / nB: the octave's noise at 1x and 4x.
vec2 chop(vec2 uv, vec2 gx, vec2 gy, vec4 nA, vec4 nB){
  vec2 u = fract(uv);
  float n1 = nA.g - 0.5, n3 = nB.g - 0.5, n4 = nB.r - 0.5, n5 = nB.b - 0.5, n6 = nB.a - 0.5;
  // A wind sea, not a contour map: all six run within one 64 degree fan (no two are mirror images about the flow, which
  // wove chevrons), their phases are bent by under 3 radians (the crests keep their direction instead of following the
  // noise), and each comes and goes completely in patches of its own (masks 0..1.6), so crests are short and fade out.
  return wavelet(u, gx, gy, vec2(24.0, 24.0), 0.09, 0.9, 1.8 * n1 + 0.9 * n3, 0.0) * (1.6 * smoothstep(-0.3, 0.3, n4))
       + wavelet(u, gx, gy, vec2(95.0, 20.0), 0.18, 1.2, -1.6 * n1 + 1.5 * n5, 0.7) * (1.6 * smoothstep(-0.2, 0.25, n3))
       + wavelet(u, gx, gy, vec2(24.0, 62.0), 0.18, 1.5, 2.0 * n3 - 1.4 * n6, 0.7) * (1.6 * smoothstep(-0.12, 0.2, n5))
       + wavelet(u, gx, gy, vec2(184.0, 75.0), 0.2, 1.9, 2.4 * n5 + 1.8 * n4, 0.0) * (1.6 * smoothstep(-0.12, 0.2, n6))
       + wavelet(u, gx, gy, vec2(370.0, 44.0), 0.21, 2.4, 2.8 * n6 - 2.0 * n3, 1.0) * (1.6 * smoothstep(0.12, -0.2, n5))
       + wavelet(u, gx, gy, vec2(265.0, 167.0), 0.16, 2.9, 3.0 * n4 + 2.2 * n5, 0.0) * (1.6 * smoothstep(0.12, -0.2, n6));
}
// one octave of one foam layer: x foam, y lace, zw detail slope
vec4 foamOct(vec2 P, vec2 gPx, vec2 gPy, float k, float ph, vec2 off, float blur, float covMul, float covAdd, float big, float fine){
  float nc = 16.0 * exp2(-k);
  vec2 uv = nc * vec2(P.x - TANA * P.y, P.x + COTA * P.y) + off; uv.x -= ph;
  vec2 gx = nc * vec2(gPx.x - TANA * gPx.y, gPx.x + COTA * gPx.y) * blur;
  vec2 gy = nc * vec2(gPy.x - TANA * gPy.y, gPy.x + COTA * gPy.y) * blur;
  vec4 t = textureGrad(uNoise, uv, gx, gy);
  float rb = 0.5 + 0.5 * sin(TAU * (uv.y * uRib + 0.09 * sin(TAU * uv.x + 1.3) + 0.05 * sin(TAU * 3.0 * uv.x + 4.0) + (t.g - 0.5) * 0.22));
  float cov = clamp(smoothstep(0.28, 0.85, rb) * (0.35 + 0.65 * t.g) * big * covMul + covAdd, 0.0, 1.0);
  // a second look-up four times finer: small holes in the lace and close-range ripples
  vec4 t4 = fine > 0.5 ? textureGrad(uNoise, uv * 4.0 + vec2(0.31, 0.77), gx * 4.0, gy * 4.0) : vec4(0.5);
  float lace = t.r + (t.g - 0.5) * 0.3 + smoothstep(0.6, 0.92, t.g) * 0.3 + (t4.r - 0.42) * 0.5 * fine;
  // (the two sunk layers, fine 0: near the eye their threshold is widened, so the magnified texture is a soft veil of
  // bubbles with gradients, never a film with hard-edged holes)
  float wide = gNear * (1.0 - fine);
  float fm = smoothstep(0.97 - 0.17 * wide - cov * 0.75, 1.32 + 0.18 * wide - cov * 0.75, lace);
  // when the pattern is smaller than a pixel keep the mean coverage instead of losing the foam
  float tpp = max(length(gx), length(gy)) * 256.0;
  fm = mix(fm, clamp(0.3 * big * covMul + covAdd, 0.0, 1.0) * mix(0.85, 0.45, smoothstep(300.0, 318.0, vR)), smoothstep(3.0, 12.0, tpp));
  if (fine > 0.5) {
    // wakes and bow waves break into the same lace
    fm = max(fm, smoothstep(1.05 - gWk, 1.45 - gWk, t.r + 0.25) * step(0.02, gWk));
    gUv = uv; gGx = gx; gGy = gy; gT = t; gT4 = t4; gCrisp = fm; gWn = 0.0;
    // Close to the eye the noise texture is magnified many times and its foam is a soft smear. There the foam is
    // redrawn from three cellular fields (cells about 1.1 x 0.7 m, 0.35 x 0.24 m and, within a few metres, 0.11 x 0.08 m,
    // each a little longer along the flow): the soft texture foam only says HOW MUCH foam there is, as the width of the
    // cell walls. Thin threads round open cells where it is low; ropes pricked with dark bubble holes, a finer net
    // between them and a faint film where it is high (never a solid sheet: the water shows through the net). Every
    // edge is one pixel wide at any distance. Each field goes where its cells would be smaller than about three
    // pixels, and the whole thing beyond 46 m, where the texture is sharp by itself.
    if (gNear > 0.001) {
      const vec2 G1 = vec2(80.0, 44.0), G2 = vec2(250.0, 136.0), G3 = vec2(760.0, 410.0), ASP = vec2(1.5, 1.0);
      vec2 bend = (t.ba - 0.5) * 1.3 + (t4.ba - 0.5) * 0.6;
      float p1 = max(length(gx * G1 * ASP), length(gy * G1 * ASP)), p2 = p1 * 3.1, p3 = p1 * 9.4;        // one pixel, in cells
      vec3 c1 = cellLace(fract(uv + bend * 0.0075), G1, ASP), c2 = cellLace(fract(uv + bend * 0.0045 + 0.37), G2, ASP);
      vec3 c3 = vec3(1.0, 0.5, 1.0);
      if (p3 < 0.5) c3 = cellLace(fract(uv + bend * 0.003 + 0.71), G3, ASP);
      float k2 = 1.0 - smoothstep(0.2, 0.5, p2), k3 = 1.0 - smoothstep(0.2, 0.5, p3);
      // (the foam comes in clumps with open leads between them: the 4x marbling thins it by patches)
      float m = fm * smoothstep(0.0, 0.6, gOw) * mix(1.0, 0.25 + 1.45 * smoothstep(0.2, 0.8, t4.g), 0.8), on = smoothstep(0.0, 0.07, m);
      m = min(m, 1.0) * (1.0 - 0.45 * gShaft);      // in the shaft: threads over black-green water, never a pale sheet
      float wA = (0.11 * m + 0.035 * smoothstep(0.03, 0.3, m)) * (0.5 + 1.0 * c1.y) + (t4.r - 0.5) * 0.05 * m;
      float wB = (0.11 * m + 0.025 * smoothstep(0.12, 0.45, m)) * (0.45 + 1.1 * c2.y);
      float wC = (0.09 * m + 0.015) * (0.3 + 1.3 * c3.y);
      float q1 = p1 * 1.1 + 0.004, q2 = p2 * 1.1 + 0.004, q3 = p3 * 1.1 + 0.004;
      // the open water in a cell is the cell cut by a disc about its own point: where foam is thin the disc is wide and
      // the net is fine threads round polygons; where it is thick the disc closes in and the holes are round, like froth
      float R = mix(1.25, 0.52, m);
      float l1 = 1.0 - smoothstep(-q1, q1, min(c1.x - wA, R * (0.8 + 0.4 * c1.y) - c1.z));
      // the ropes are froth, not paint: bubble holes at the finer cells' own points
      l1 *= mix(1.0, 0.3 + 0.7 * smoothstep(0.16, 0.16 + 2.0 * q2 + 0.05, c2.z), k2 * 0.8) * mix(1.0, 0.45 + 0.55 * smoothstep(0.2, 0.2 + 2.0 * q3 + 0.04, c3.z), k3);
      // (the two finer nets stay open, threads more than froth: all three laid over one another must not close into a sheet)
      float l2 = (1.0 - smoothstep(-q2, q2, min(c2.x - wB, mix(1.3, 0.78, m) * (0.85 + 0.4 * c2.y) - c2.z))) * k2;
      float l3 = (1.0 - smoothstep(-q3, q3, min(c3.x - wC, mix(1.35, 0.95, m) * (0.85 + 0.4 * c3.y) - c3.z))) * k3;
      gCrisp = max(max(l1, max(0.88 * l2, 0.7 * l3)) * on, 0.12 * smoothstep(0.5, 1.0, m));
      gWn = gNear * (1.0 - smoothstep(0.22, 0.55, p1));
    }
  }
  return vec4(fm, t.r, (t.ba - 0.5) * 0.55 + (t4.ba - 0.5) * 0.75);
}
void main(){
  vec3 P = vPos; float r = max(length(P.xz), 1e-3); vec2 rh = P.xz / r;
  vec3 tT = vec3(-rh.y, 0.0, rh.x), N0 = normalize(vN), tW = normalize(cross(N0, tT));
  float d = max(-P.y, 0.0);
  float inside = 1.0 - smoothstep(300.0, 318.0, vR);
  float shaft = smoothstep(112.0, 134.0, d);
  // relief normal by finite differences of the same functions the vertex shader displaces with
  float e = 0.4, dP = e / (TAU * max(vR, 1.0));
  float h0 = ridgeH(vP, vR, uTime);
  vec2 sl = vec2(ridgeH(vP + vec2(dP, 0.0), vR, uTime) - h0, ridgeH(vP + vec2(0.0, dP), vR, uTime) - h0) / e;
  float ce = chopEnv(vR), c0 = chopH(P.xz, uTime);
  vec2 cs = vec2(chopH(P.xz + vec2(e, 0.0), uTime) - c0, chopH(P.xz + vec2(0.0, e), uTime) - c0) * (ce / e);
  vec3 N = normalize(N0 - tT * sl.x - tW * sl.y - vec3(cs.x, 0.0, cs.y));
  vec3 V = normalize(uCam - P);
  // octave selection: pattern size follows the radius in steps of two, cross-faded
  float L = clamp(log2(RIM / max(vR, 1.0)), -4.0, 3.999), k = floor(L), f = smoothstep(0.15, 0.85, L - k);
  int ki = int(k) + 4;
  vec2 gPx = dFdx(vP), gPy = dFdy(vP);
  float W = TAU * vP.y;
  float big = 0.5 + 0.27 * sin(TAU * uBigN.x * (vP.x - uBigPh) + 4.3 * W) + 0.23 * sin(TAU * uBigN.y * (vP.x - 1.6 * uBigPh) - 6.1 * W + 2.3);
  // far off (the wall across the funnel) the arm pattern is sharpened into distinct streets and joined by twelve
  // ribbons lying along the foam's own 20 degree spiral, so a still frame reads as water rifling down into the mist
  float camD = length(uCam - P), farK = smoothstep(70.0, 240.0, camD) * inside * (1.0 - shaft);
  gNear = 1.0 - smoothstep(14.0, 46.0, camD);
  big = mix(0.22, 1.0, smoothstep(mix(0.15, 0.35, farK), mix(0.8, 0.65, farK), big));
  vec4 nzB = texture2D(uNoise, vec2(3.0 * (vP.x - uBigPh), 2.2 * vP.y + 0.37));      // ribbons wander, swell and break off
  float arm = 0.5 + 0.5 * sin(TAU * 12.0 * (vP.x - uBigPh + COTA * vP.y) + 5.0 * (nzB.g - 0.5) + 1.2 * sin(TAU * 3.0 * vP.x + 5.0 * W));
  float street = smoothstep(0.45, 0.82, arm) * smoothstep(0.15, 0.45, nzB.r * 0.5 + nzB.g * 0.6);
  big = mix(big, 0.2 * big + 2.8 * street, farK * smoothstep(64.0, 110.0, vR));
  // THE WHIRLPOOL SEEN FROM ACROSS (over ~130 m off: the rim, the slide, the far wall from anywhere on the wall).
  // spiral: seven broad arms of foam winding in to the lip at 36 degrees (the 20 degree streets, foreshortened on the
  // far wall, lie along its rings and read as level stripes): they cross the rings plainly, wider and whiter toward
  // the lip, torn by the noise, and turn with the water. pit: below 45 - 80 m the far wall is the dark of the pit,
  // black-green water with no sky in it and no glow, only the arms running down into it (see body, refl, glow below).
  float farS = smoothstep(110.0, 210.0, camD) * inside * (1.0 - shaft);
  float lipK = 1.0 - smoothstep(58.0, 185.0, vR);
  float armS = 0.5 + 0.5 * sin(TAU * 7.0 * (vP.x - 1.7 * uBigPh + 1.376 * vP.y) + 3.4 * (nzB.g - 0.5) + 0.9 * sin(TAU * 2.0 * vP.x + 3.0 * W));
  // (the pit is drawn so only while the eye is high: on the rim, the slide and the upper wall, r over ~150. Lower down
  // the far wall is near and is the foam-veined teal it always was. In the dark the arms draw in to thin ribbons.)
  float pitW = smoothstep(40.0, 74.0, d), pit = farS * pitW * smoothstep(140.0, 176.0, length(uCam.xz));
  float spiral = smoothstep(mix(0.78, 0.5, lipK) + 0.3 * pitW, mix(0.97, 0.84, lipK) + 0.12 * pitW, armS) * smoothstep(0.12, 0.42, nzB.r * 0.55 + nzB.g * 0.6) * smoothstep(52.0, 66.0, vR) * (1.0 - smoothstep(215.0, 285.0, vR));
  big = mix(big, big * (1.0 - 0.85 * pit) + 3.0 * spiral * (0.55 + 0.45 * lipK) * (1.0 - 0.35 * pit), farS);
  // (the foam piled at the lip: from more than ~100 m it is torn by the twelve arms, not one unbroken band)
  float lobe0 = sunLobe(rh);
  // near the eye the sunward wall keeps less foam (we look INTO it there); far away it carries its full ribbons
  float covMul = uCov * mix(1.0, 0.0, smoothstep(420.0, 1150.0, vR)) * mix(1.0, 0.7, shaft) * (1.0 - 0.35 * lobe0 * inside * (1.0 - smoothstep(40.0, 150.0, camD)));
  float covAdd = 0.5 * smoothstep(250.0, 292.0, vR) * inside + 0.55 * (1.0 - smoothstep(58.0, 92.0, vR)) * (1.0 - shaft) * (1.0 - pit) * mix(1.0, 0.25 + 0.75 * smoothstep(0.3, 0.75, arm), smoothstep(40.0, 110.0, camD)) + 0.3 * spiral * farS * (0.4 + 0.6 * lipK) * (1.0 - 0.6 * pit) + 0.24 * shaft
               + 0.25 * smoothstep(300.0, 330.0, vR) * (1.0 - smoothstep(330.0, 420.0, vR));
  // parallax for the two sunk layers: refracted view ray projected on the surface
  vec2 vt = vec2(dot(-V, tT), dot(-V, tW)); float vn = clamp(dot(V, N0), 0.0, 1.0);
  float sinT = sqrt(max(1.0 - vn * vn, 0.0)) * 0.75, cosT = sqrt(1.0 - sinT * sinT);
  vec2 par = vt / max(length(vt), 1e-4) * (sinT / cosT) / (TAU * max(vR, 1.0));
  // wakes and contact lines of whatever the world floats on the wall (before the foam: they break into its lace)
  float contact = 0.0, wk = 0.0;
  for (int i = 0; i < 8; i++) {
    vec4 w = uWake[i]; float R = max(w.w, 0.01), on = step(0.02, w.w);
    vec3 dv = P - w.xyz; vec3 dir = uWakeDir[i].xyz; float al = dot(dv, dir); float ac = length(dv - al * dir);
    float cd = length(dv) / R;
    contact = max(contact, on * uWakeC[i] * (1.0 - smoothstep(0.85, 1.5, cd)));
    float ring = smoothstep(0.9, 1.2, cd) * (1.0 - smoothstep(1.2, 2.1, cd)) * 0.7;
    float wd = R * (0.9 + 0.32 * max(al, 0.0) / R);
    float vee = (1.0 - smoothstep(wd * 0.55, wd, ac)) * (0.45 + 0.55 * smoothstep(0.0, wd * 0.6, ac)) * step(0.0, al) * exp(-max(al, 0.0) / (R * 7.0));
    wk = max(wk, on * uWakeDir[i].w * max(ring, vee));
  }
  gWk = wk; gShaft = shaft;
  // the surface layer, octave k and the next one. Far off they are cross-faded; near the eye each is redrawn as crisp
  // lace (see foamOct) and the two are laid over one another, each thinning out as the other takes over
  gOw = 1.0 - f; vec4 oA = foamOct(vP, gPx, gPy, k, uPh1[ki], vec2(0.0), 1.0, covMul, covAdd, big, 1.0);
  const vec2 MK = vec2(26.0, 2.6);      // the glint mask: features about 0.5 m across the crests and 1.5 m along them
  float cA = gCrisp, nA = gWn; vec2 chA = vec2(0.0); float mkA = 0.6;
  if (gNear > 0.001) { chA = chop(gUv, gGx, gGy, gT, gT4); mkA = textureGrad(uNoise, gUv * MK + vec2(0.0, uTime * 0.013), gGx * MK, gGy * MK).g; }
  gOw = f; vec4 oB = foamOct(vP, gPx, gPy, k + 1.0, uPh1[ki + 1], vec2(0.0), 1.0, covMul, covAdd, big, 1.0);
  float cB = gCrisp, nB = gWn; vec2 chB = vec2(0.0); float mkB = 0.6;
  if (gNear > 0.001) { chB = chop(gUv, gGx, gGy, gT, gT4); mkB = textureGrad(uNoise, gUv * MK + vec2(0.0, uTime * 0.013), gGx * MK, gGy * MK).g; }
  float gMk = mix(mkA, mkB, f);
  gWk = 0.0;
  vec4 a1 = mix(oA, oB, f);
  float wNear = mix(nA, nB, f);
  a1.x = mix(a1.x, max(cA, cB), wNear);
  float nearF = 1.0 - smoothstep(12.0, 50.0, camD);
  vec2 ch = (chA * sqrt(1.0 - f) + chB * sqrt(f)) * nearF;
  vec2 P2 = vP + par * 1.5, P3 = vP + par * 4.0;
  vec4 a2 = mix(foamOct(P2, gPx, gPy, k, uPh2[ki], vec2(0.37, 0.11), 2.0, covMul, covAdd * 0.6 + 0.06, 1.0, 0.0),
                foamOct(P2, gPx, gPy, k + 1.0, uPh2[ki + 1], vec2(0.37, 0.11), 2.0, covMul, covAdd * 0.6 + 0.06, 1.0, 0.0), f);
  vec4 a3 = mix(foamOct(P3, gPx, gPy, k, uPh3[ki], vec2(0.71, 0.53), 4.0, covMul, covAdd * 0.4 + 0.1, 1.0, 0.0),
                foamOct(P3, gPx, gPy, k + 1.0, uPh3[ki + 1], vec2(0.71, 0.53), 4.0, covMul, covAdd * 0.4 + 0.1, 1.0, 0.0), f);
  float foam = a1.x, f2 = a2.x * inside * (1.0 - shaft) * mix(1.0, 0.35, gNear), f3 = a3.x * inside * (1.0 - shaft) * mix(1.0, 0.35, gNear);
  // breaker: foam on the crest and down its face. Close to the eye it is not a white sheet (that read as a smooth pale
  // tube): froth pours down the face in streaks with green glass between them
  // (the streaks lean 25 degrees with the flow as they run down the wall, and a third, broader noise breaks them along
  // their length and varies their width: upright, unbroken and all of one width they were the bars of a zebra)
  vec4 sk = texture2D(uNoise, vec2(vP.x * 610.0 + 0.2 * a1.z + 0.76 * vCrest, vCrest * 0.42 - uTime * 0.09));
  float sk2 = texture2D(uNoise, vec2(vP.x * 2350.0 + 0.3 * a1.w, vCrest * 1.3 - uTime * 0.21 + 0.4)).g;
  float sk3 = texture2D(uNoise, vec2(vP.x * 940.0 + 0.12 * a1.z + 1.17 * vCrest, vCrest * 0.3 - uTime * 0.05 + 0.6)).r;      // threads a hand wide and metres long
  float skB = texture2D(uNoise, vec2(vP.x * 313.0 + 0.39 * vCrest + 0.7, vCrest * 0.8 + uTime * 0.02)).g, skGate = smoothstep(0.4, 0.62, skB);
  float streak = smoothstep(0.3, 0.6, sk.g * 0.45 + sk2 * 0.36 + sk.r * 0.3);
  float brk = smoothstep(0.03, 0.3, vCrest) * nearF;      // on the breaker, near the eye
  // (the sea mesh's breaker, all round the rim: white on its upper half. The fine strip seen from further than the block
  // below reaches: its seaward back is dark water, only its top 0.8 m and its falling face are white, so from the race
  // it is a dark green wall under a broken white line, not a snow ridge)
  float c01 = clamp(vCrest / max(vBk.x, 0.2), 0.0, 1.0), bq = vBk.w, bBack = (1.0 - smoothstep(0.36, 0.44, bq)) * smoothstep(0.06, 0.3, c01) * vBk.y;
  foam *= 1.0 - 0.7 * bBack;
  foam = max(foam, mix(smoothstep(0.5, 0.95, vCrest + (a1.y - 0.5) * 0.7), max(smoothstep(0.8, 0.98, c01 + (a1.y - 0.5) * 0.22), smoothstep(0.44, 0.52, bq) * smoothstep(0.08, 0.4, c01) * (0.4 + 0.55 * a1.y)), vBk.y));
  foam *= mix(1.0, 0.08 + 0.92 * streak, brk);
  // the fine breaker at the crossing. Where it stands high it is dark green glass: on its back only thin streaks of
  // froth sliding seaward, along the lip a torn white line, under the lip the shadowed hollow. Where it is low, or the
  // lip has slumped, it has collapsed into lumpy white churn with holes of green. At its inner foot a pile of foam.
  // The two states alternate with the height of the crest, the curl and the noise: no two metres alike.
  float fineB = vBk.y * smoothstep(0.03, 0.2, vCrest) * (1.0 - smoothstep(150.0, 300.0, camD)), glassB = 0.0, underLip = 0.0, bTop = 0.0;
  vec3 bLump = vec3(0.0, 0.0, 0.5);      // the breaker's froth: a tilt for its shading and a lumpiness 0..1 (white water is heaped, never a smooth pillow)
  if (fineB > 0.001) {
    vec2 bm = vP * 1885.0;      // metres along the crest, metres across it
    vec2 bgx = gPx * 1885.0, bgy = gPy * 1885.0;      // (explicit gradients: these look-ups sit inside a branch)
    vec4 b1 = textureGrad(uNoise, bm / vec2(31.0, 17.0) + vec2(0.0, -uTime * 0.03), bgx / vec2(31.0, 17.0), bgy / vec2(31.0, 17.0));
    vec4 b2 = textureGrad(uNoise, bm / vec2(6.1, 4.3) + vec2(0.37, -uTime * 0.16), bgx / vec2(6.1, 4.3), bgy / vec2(6.1, 4.3));
    float q = bq, notch = brkNotch(vP.x);
    float collapsed = (1.0 - smoothstep(0.4, 0.62, vBk.x / max(1.0 - 0.42 * notch, 0.3) + 0.5 * (b1.g - 0.5) + 0.25 * vBk.z)) * (1.0 - notch);      // (only the lowest stretches: collapsed, the face is half froth, and seen along the crest that was the grey-white wedge)
    bLump = vec3((b2.ba - 0.5) * 2.0 + (b1.ba - 0.5) * 1.2, b2.g * 0.55 + b1.r * 0.45);
    // white water here is drawn out down the slope in streaks and threads (sk, sk2: 0.1 - 0.8 m wide, metres long), never
    // in blots with round holes: that was the leopard skin of the old crest
    // (every threshold sits above the noise's mean: seen along the crest, where the pattern blurs to its mean, the wall
    // goes to green glass, not to a grey-white smear)
    float thin = smoothstep(0.6 + 0.16 * (0.5 - skB), 0.68 + 0.16 * (0.5 - skB), sk3) * skGate;
    // (sk2's 5 cm speckle is kept out of these sums: under the thresholds it aliased into a mosaic on the near wall)
    float thread = max(thin * (0.35 + 0.65 * b1.r), 0.6 * skGate * smoothstep(0.6, 0.7, sk.g * 0.52 + sk3 * 0.5)) * uBrkK;      // (uBrkK: half as strong under the squall, where white on dark iron-green is at its harshest)
    float fall = max(0.8 * smoothstep(0.62, 0.74, sk.g * 0.45 + sk3 * 0.36 + sk.r * 0.3 + 0.06 * collapsed) * mix(1.0, skGate, 0.6), 0.9 * thin) * mix(1.0, uBrkK, 0.8);
    float lipLine = (1.0 - smoothstep(0.004, 0.01 + 0.014 * b2.r, abs(q - 0.55 + 0.02 * (b1.g - 0.5)))) * (0.55 + 0.45 * b2.g) * smoothstep(0.3, 0.5, b2.b);      // a torn white line along the lip, a hand to half a metre wide, with gaps (a metre wide it was a white road along the crest)
    float back = 1.0 - smoothstep(0.36, 0.44, q), hollow = smoothstep(0.6, 0.68, q) * (1.0 - smoothstep(0.84, 0.94, q));
    // (by height alone the "top" was a road of froth 4 m wide over the whole rounded crown: seen from on top of the crest,
    // the smooth white mound. It is the inner edge of the crown only, where the water starts to pitch over)
    float topW = smoothstep(0.92, 0.995, c01 + 0.1 * (b2.r - 0.5)) * (0.35 + 0.65 * smoothstep(0.3, 0.55, b2.g)) * smoothstep(0.44, 0.5, q + 0.03 * (b1.g - 0.5));      // only the top half metre is white, torn along its lower edge and broken along its length
    // THE BACK (the seaward slope, what the eye sees as it comes up to the rim and along the crest from on top of it):
    // dark bottle-green glass whether the lip stands or has slumped. Thin threads of froth are drawn down it from the
    // crest, thinning out toward its foot; no lace, no sheet. Green shows everywhere between the white.
    float backF = max(thread * 0.42 * smoothstep(0.2, 0.9, c01), topW);
    // THE FACE (toward the funnel): green glass too, with white water falling down it in streaks (a third of it where the
    // lip stands, more where it has slumped: never a white ramp). Where the lip pitches forward the hollow under it is in
    // shadow with only a few threads falling through it. At the inner foot a pile of foam.
    float frontF = fall * (0.6 + 0.4 * collapsed) * smoothstep(0.03, 0.25, c01) * (1.0 - 0.88 * hollow * (1.0 - collapsed));
    frontF = max(max(frontF, lipLine * (1.0 - 0.4 * collapsed)), max(topW, smoothstep(0.86, 0.98, q + 0.1 * (b2.g - 0.5)) * (0.4 + 0.5 * b2.r) * smoothstep(0.32, 0.6, b1.g)));
    foam = mix(foam, mix(frontF, backF, back) * (1.0 - 0.6 * notch), fineB);      // (the saddle we go over is green water with a little lace)
    glassB = fineB * (1.0 - collapsed * (1.0 - back)) * c01 * (1.0 - 0.5 * hollow);
    underLip = fineB * hollow * (1.0 - collapsed) * smoothstep(0.0, 0.45, vBk.z);      // the hollow under a lip that pitches forward: shadow
    bTop = fineB * smoothstep(0.45, 0.95, c01) * (1.0 - 0.6 * hollow);
  }
  // THE BREAKER FROM THE RACE (the eye still outside the rim, the breaker's seaward back over ~40 m off): a low line of
  // surf, lighter than the sea in front of it. Its top third is white, the rest thin green water full of froth (see
  // the finished colour below); dark with a pale edge it was a hedge on the horizon. Near the eye and from inside the
  // funnel the breaker is as it was.
  float farBrk = smoothstep(0.03, 0.2, vCrest) * smoothstep(38.0, 85.0, camD) * (1.0 - smoothstep(0.4, 0.5, bq)) * smoothstep(RIM - 6.0, RIM + 14.0, length(uCam.xz));
  foam = max(foam, farBrk * smoothstep(0.56, 0.7, c01 + 0.14 * (a1.y - 0.5)) * (0.75 + 0.25 * a1.y));
  // a strong wake (strength over 1: the barrels and the yard) has a churned white core, not only lace
  foam = max(foam, smoothstep(0.75, 1.5, wk) * mix(0.6, 1.0, max(cA, cB)));
  // THE BROW WHERE WE GO OVER (uPour, driven by the world from u 0.8 to 0.93; near the eye only): white water drawn out
  // down the fall line over the last 25 m of the wall, heaped where the lip rounds over, and falling in streaks into the
  // top of the shaft. The streaks ride a noise stretched eight times along the fall line and stream down it.
  float pourN = texture2D(uNoise, vec2(vP.x * 19.0, W * 0.37 + uTime * 0.11)).g, pourM = texture2D(uNoise, vec2(vP.x * 53.0 + 0.31, W * 1.1 + uTime * 0.23)).r;
  float pourS = smoothstep(0.46, 0.72, pourN * 0.62 + pourM * 0.45);
  float pourUp = (1.0 - smoothstep(58.0, 84.0, vR)) * (1.0 - shaft);
  float pourBrow = smoothstep(94.0, 107.0, d) * (1.0 - smoothstep(116.0, 128.0, d));
  float pourDn = smoothstep(108.0, 118.0, d) * (1.0 - smoothstep(132.0, 158.0, d));
  float pourK = uPour * (1.0 - smoothstep(70.0, 120.0, camD));
  float pourBand = (1.0 - smoothstep(57.0, 71.0, vR)) * (1.0 - shaft);      // the last 14 m of the wall: seen along the wall from above it is the white line of the brow
  foam = max(foam, pourK * max(max(pourBand * (0.4 + 0.6 * pourS), 0.7 * pourUp * pourS), max(0.8 * pourS * pourDn, pourBrow * (0.45 + 0.55 * smoothstep(0.3, 0.6, pourM)) * (0.5 + 0.5 * pourS))));
  float pourLit = pourK * max(pourBrow, pourDn);
  foam = clamp(foam, 0.0, 1.0) * (1.0 - contact * 0.7);
  // a window in all three foam layers where the world wants to be seen into (setClear: over the seal)
  float cw = (1.0 - smoothstep(0.45, 1.0, length(P - uClearAt.xyz) / max(uClearAt.w, 0.01))) * step(0.02, uClearAt.w);
  foam *= 1.0 - 0.8 * cw; f2 *= 1.0 - 0.9 * cw; f3 *= 1.0 - 0.9 * cw;
  // ... and a second, broader and partial one (setClearB: over the shoal as we run along the glass)
  float cwB = (1.0 - smoothstep(0.35, 1.0, length(P - uClearB.xyz) / max(abs(uClearB.w), 0.01))) * step(0.02, abs(uClearB.w)) * 0.78;
  float seeIn = 1.0 - 0.8 * cwB;      // ... where the surface is also less of a mirror: under a pale sky its reflection lay over the cod as a grey film
  foam *= 1.0 - cwB; f2 *= 1.0 - min(1.5 * cwB, 1.0); f3 *= 1.0 - min(1.5 * cwB, 1.0);      // (the sunk layers go altogether at its middle: magnified beside the bow they were a pale smear)
  // detail normal from the surface layer, flattened under foam
  vec3 ts = 0.9397 * tT - 0.3420 * tW, tc = 0.3420 * tT + 0.9397 * tW;
  // (near the eye the texture's own slopes are magnified into soft blobs: there the analytic wavelets take over)
  vec3 Nd = normalize(N + (ts * a1.z + tc * a1.w) * (1.1 - 0.7 * foam) * (1.0 - 0.7 * nearF) + (ts * ch.x + tc * ch.y) * (1.0 - 0.6 * foam));
  float facet = clamp(dot(ts * ch.x + tc * ch.y, normalize(uSunDir + vec3(0.0, 0.8, 0.0))) * 1.0, -0.18, 0.26) * (1.0 - 0.6 * foam);      // each wavelet face a little lighter or darker than the next
  float nv = max(dot(Nd, V), 0.0);
  float F = (0.02 + 0.8 * pow(clamp(1.0 - nv, 0.0, 1.0), 5.0)) * (1.0 - max(0.6 * brk, 0.85 * fineB));      // (the breaker is no mirror of the pale sky: its back is green glass, its face churned)
  // the far wall, seen at a grazing angle from across the funnel, is still green water: it does not turn into a film of
  // the sky's colour; and the pit holds no sky at all
  F *= mix(1.0, 0.3, smoothstep(200.0, 430.0, camD) * inside) * (1.0 - 0.9 * pit);
  // (the brow of the wall below the eye, seen at a grazing angle, mirrored the glowing far wall as one straight pale
  // stripe across the frame: beyond ~70 m the wall is never more than a third mirror)
  F = min(F, mix(1.0, 0.35, inside * smoothstep(40.0, 100.0, camD) * (1.0 - shaft))) * seeIn;
  vec3 Rv = reflect(-V, Nd);
  // light
  float lit = sunLit(P), lobe = sunLobe(rh);
  float wrap = clamp(dot(normalize(N + (ts * bLump.x + tc * bLump.y) * 1.5 * fineB), uSunDir) * 0.6 + 0.4, 0.0, 1.0);
  // what the reflection sees: sky above the far rim, otherwise the far wall
  float Rh = max(length(Rv.xz), 1e-4); vec2 Rd = Rv.xz / Rh;
  float vis = mix(smoothstep(-6.0, 14.0, P.y + cylExit(P.xz, Rd) * Rv.y / Rh), 1.0, 1.0 - inside);
  vec3 skyR = skyCol(vec3(Rv.x, max(Rv.y, 0.03), Rv.z));
  vec3 wallRef = mix(uDeep, uBottle, 0.7) * 1.3 + (uFoam * uAmb * 0.1 + uGlow * uGlowAmt * 0.3 * sunLobe(Rd)) * exp(-d / 45.0);
  vec3 refl = mix(mix(wallRef, skyR, 0.22), skyR, vis) * (1.0 - 0.88 * shaft);
  float sd = max(dot(Rv, uSunDir), 0.0);
  // (glints: short broken dashes strung along the crests. gMk: a mask riding the flow, drawn out along the crests, lets
  // one stretch in three flash; without it every wavelet's bent crest lit up whole, as closed loops of one size. No hard
  // facets on the breaker: under the squall they made it a ridge of wet rock.)
  float glK = mix(1.0, 2.4 * smoothstep(0.5, 0.66, gMk), nearF) * (1.0 - 0.8 * fineB);
  vec3 glint = uSunCol * (pow(sd, 420.0) * 7.0 * glK + pow(sd, 40.0) * 0.13 * mix(1.0, 0.4 + 0.6 * glK, 0.7)) * lit * (1.0 - foam);
  // the body of the water. farPit: the shaft seen from the rim and the upper wall (over 110 m off) is a black hole,
  // its foam all but out (at its mean coverage it was a flat blue-grey pane in the throat); close to, it is as it was
  float farPit = smoothstep(110.0, 230.0, camD);
  vec3 body = mix(uBottle, uDeep, max(smoothstep(10.0, 70.0, d), 0.55 * (1.0 - inside))) * (0.62 + 0.3 * lit * wrap) * (1.0 + 1.3 * shaft * (1.0 - 0.85 * farPit)) * (1.0 + facet);
  // (seen from more than ~150 m along the wall the glow is a step down and the fog there is green-grey, darker than the
  // sky: the far wall stays green water with white bands instead of washing into the sky's own beige)
  float farW = smoothstep(110.0, 300.0, camD) * inside * (1.0 - shaft);
  vec3 glow = uGlow * uGlowAmt * exp(-d / uGlowFall) * lobe * inside * (1.0 - 0.92 * pit) * (1.0 - 0.45 * farW);
  body = mix(body, uDeep * 0.4, pit);
  body += glow * 0.52;
  // the glass of the breaker's high teeth: thin water, lighter green where the lip thins
  body += (uBottle + vec3(0.0, 0.012, 0.012)) * (uSunCol * (0.25 + 0.5 * lit) + uAmb) * (0.22 * glassB * glassB + 0.55 * bTop * bTop);      // (the top of the wall is thin: lighter, sea-green)
  // in the rim's shadow and under the squall the water keeps a floor of cool sky light: black-green with readable
  // blue-grey faces, never a crushed lower third
  body += uSkyCool * 0.045 * (1.0 - lit) * (1.0 - shaft) * inside * (1.0 + 2.0 * max(facet, 0.0));
  // THE FLOOR. The grade's contrast takes everything under about 0.06 (linear) to pure black, and deep water is 0.02:
  // beside the bow on the lower wall and in the dive the lower third of the frame was a black hole with lace on it.
  // Within ~70 m of the eye the water never falls below a black-green that survives the grade, and each wavelet's face
  // is a step lighter or darker than the next (readable blue-grey facets). Far off, the pit stays black.
  float nearW = 1.0 - smoothstep(26.0, 80.0, camD);
  body = max(body, (uDeep * 2.3 + uSkyCool * 0.085) * (1.0 + 2.2 * facet + 0.25 * (a1.y - 0.5)) * nearW * inside);
  float T = (0.5 + uClear * lobe * inside) * (1.0 - smoothstep(540.0, 640.0, vR)) * (1.0 - shaft) * (1.0 - 0.9 * pit);      // (the far pit is not a window on the glowing shell behind it)
  // foam over the glowing wall is lit from underneath as well: paler than the water it rides on, blue-white in the rim's shadow
  // the exit ring lights the water round it: a warm wash on the wall of the shaft, strongest on the faces turned to
  // it, and its own gold glint on the wavelets
  vec3 toS = uSeat.xyz - P; float dS = max(length(toS), 1e-3); toS /= dS;
  vec3 ember = mix(uGold, vec3(1.0, 0.86, 0.62), 0.3) * uSeat.w;
  vec3 warm = ember * exp(-dS / 46.0) * (0.03 + 0.3 * max(dot(Nd, toS) * 0.75 + 0.25, 0.0));      // 45 m falloff and a wrap: a gold rim-light on every face turned to the ring (longer, it washed the whole shaft tan)
  body += warm;
  vec3 foamCol = (uFoam * 0.75 * (uSunCol * lit * (0.2 + 0.8 * wrap) + uAmb * (1.0 + 0.3 * inside + 0.6 * farK)) + uFoam * glow * 0.55) * mix(1.0, mix(mix(0.42, 0.07, farPit), mix(0.62, 0.8, 1.0 - smoothstep(12.0, 34.0, camD)), 1.0 - smoothstep(30.0, 62.0, camD)), shaft) + uFoam * warm * 1.6;
  foamCol *= 0.86 + 0.3 * a1.y * (1.0 - shaft);      // froth is lumpy: soft mottling, never one flat white
  foamCol *= 1.0 + 0.9 * pourLit * shaft;      // the water pouring off the brow stays white as it falls into the shaft's dark
  foamCol = mix(foamCol, foamCol * vec3(0.5, 0.58, 0.62), smoothstep(122.0, 175.0, d) * smoothstep(34.0, 80.0, camD));      // down the shaft the foam threads sink into the dark: depth, and the ring the brightest thing
  foamCol *= mix(1.0, 0.5 + 0.8 * smoothstep(0.25, 0.75, bLump.z), fineB);      // ... and on the breaker heaped: grey hollows between its white heaps
  // the sunk layers are seen through 1.5 and 4 m of green water: teal, not the lime wash sunlit foam colour gave them
  vec3 c2 = foamCol * vec3(0.2, 0.72, 0.64) * 0.48 + glow * 0.45, c3 = foamCol * vec3(0.07, 0.46, 0.43) * 0.3 + glow * 0.6;
  vec3 under = body * (1.0 - T * 0.7);
  // (the floor again, after the window: under the squall the deep colour itself is below the grade's black. Not on the
  // glass, where the surface is a window: there it would lie over the seal and the shoal as a pale veil)
  under = max(under, vec3(0.019, 0.088, 0.09) * uFloor * (1.0 + 0.6 * facet + 0.15 * (a1.y - 0.5)) * nearW * inside * (1.0 - smoothstep(0.52, 0.7, T)));
  under = mix(under, c3, f3 * 0.7); under = mix(under, c2, f2 * 0.75);
  under *= (1.0 - contact * 0.75) * (1.0 - 0.6 * cwB * min(uGlowAmt, 1.0));      // (the window's own water adds little light: what hangs behind it stays dark against the lit glass)
  float Tf = T * (1.0 - f3 * 0.5) * (1.0 - f2 * 0.6);
  Tf = mix(Tf, max(Tf, 0.9), cwB * step(0.5, T));      // (the window over the shoal is clear glass: what hangs behind it shows dark and whole)
  glint += ember * pow(max(dot(Rv, toS), 0.0), 90.0) * exp(-dS / 45.0) * 1.4 * (1.0 - foam);
  vec3 col = F * refl + glint * (0.25 + F) + (1.0 - F) * mix(under, foamCol, foam);
  // (and once more on the finished colour: a wavelet face turned to mirror the dark shaft was a pure black stripe)
  col = max(col, vec3(0.02, 0.092, 0.094) * uFloor * (1.0 + 1.1 * facet + 0.15 * (a1.y - 0.5)) * nearW * inside * (1.0 - smoothstep(0.52, 0.7, T)));
  // the breaker lit through from behind on the sunward side: bronze-gold glass
  float crest = vCrest * sqrt(max(vCrest, 0.0)) * smoothstep(-0.1, 0.8, dot(rh, uSunH));
  crest *= (1.0 - smoothstep(90.0, 230.0, camD)) * (0.35 + 0.65 * smoothstep(0.3, 0.7, a1.y));      // seen from across the funnel (from the glass, the sunward rim ahead) it was one straight pale-gold stripe laid across the frame: the gold is for the breaker near the eye, and broken by the foam
  col += uGold * uSunCol * crest * (1.0 - 0.5 * foam) * 1.7 * uGlowAmt * (1.0 - 0.6 * fineB);      // (close to, the gold lay on the green wall as khaki smears)
  col *= 1.0 - 0.6 * underLip;
  col = mix(col, mix(uBottle * 1.6 + vec3(0.0, 0.02, 0.02), foamCol, 0.4), 0.8 * farBrk * (1.0 - foam));      // (the far line of surf: thin green water full of froth, 40 % foam)
  float alpha = max(1.0 - (1.0 - F) * (1.0 - foam) * Tf, 0.9 * farBrk);
  // the breaker's body is 9 m of water: opaque, its own dark bottle green. Half see-through it took the colour of
  // whatever stood behind it (under the squall's bright cloud: a pale mint ice ridge); only its thin top lets light through
  alpha = max(alpha, fineB * (1.0 - 0.28 * smoothstep(0.8, 1.0, c01)));
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col = applyFogPremul(col, alpha, mix(fogColor, fogColor * vec3(0.7, 0.8, 0.76) + vec3(0.0, 0.03, 0.018), farW), ff);
  #endif
  gl_FragColor = vec4(col, alpha);
}`,nt=`
${ee}
attribute vec2 aPolar;
varying vec3 vPos; varying vec2 vP; varying float vR;
#include <fog_pars_vertex>
void main(){
  vPos = position; vP = aPolar; vR = length(position.xz);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,it=`
${ee}
uniform float uPh2[9], uPh3[9];
varying vec3 vPos; varying vec2 vP; varying float vR;
#include <fog_pars_fragment>
vec4 patOct(vec2 P, vec2 gPx, vec2 gPy, float k, float ph, vec2 off){
  float nc = 16.0 * exp2(-k);
  vec2 uv = nc * vec2(P.x - TANA * P.y, P.x + COTA * P.y) + off; uv.x -= ph;
  vec2 gx = nc * vec2(gPx.x - TANA * gPx.y, gPx.x + COTA * gPx.y);
  vec2 gy = nc * vec2(gPy.x - TANA * gPy.y, gPy.x + COTA * gPy.y);
  return textureGrad(uNoise, uv, gx, gy);
}
float fogF(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      return smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 0.0;
  #endif
}
vec3 fogC(){
  #ifdef USE_FOG
    return fogColor;
  #else
    return vec3(0.0);
  #endif
}`,Tt=`
${it}
void main(){
  vec3 P = vPos; float r = max(vR, 1e-3); vec2 rh = P.xz / r;
  float d = max(-P.y, 0.0), W = TAU * vP.y;
  float L = clamp(log2(RIM / r), -4.0, 3.999), k = floor(L), f = smoothstep(0.15, 0.85, L - k); int ki = int(k) + 4;
  vec2 gPx = dFdx(vP), gPy = dFdy(vP);
  vec4 t = mix(patOct(vP, gPx, gPy, k, uPh3[ki], vec2(0.13, 0.47)), patOct(vP, gPx, gPy, k + 1.0, uPh3[ki + 1], vec2(0.13, 0.47)), f);
  // broad dark rifling: two sets of slow spiral bands
  float r1 = 0.5 + 0.5 * sin(TAU * 9.0 * (vP.x - 2.0 * uBigPh + 1.6 * vP.y) + 1.3 * sin(TAU * 4.0 * vP.x + 7.0 * W));
  float r2 = 0.5 + 0.5 * sin(TAU * 26.0 * (vP.x - 3.0 * uBigPh + 2.1 * vP.y) + 2.0 * sin(TAU * 7.0 * vP.x - 5.0 * W + 1.0));
  float rif = smoothstep(0.12, 0.9, r1 * 0.62 + r2 * 0.38) * (0.45 + 0.75 * t.g);
  float caust = smoothstep(0.35, 0.95, t.r);
  float lit = sunLit(P), lobe = sunLobe(rh), inside = 1.0 - smoothstep(300.0, 330.0, r);
  vec3 col = mix(uBottle * 0.9, uDeep * 0.8, smoothstep(8.0, 65.0, d)) * (0.3 + 1.0 * rif) * mix(0.5, 1.0, inside);
  float farW = smoothstep(110.0, 300.0, length(uCam - P)) * inside;
  col += uGlow * uGlowAmt * exp(-d / uGlowFall) * lobe * inside * (0.12 + 1.9 * rif * rif * (0.45 + 1.1 * caust)) * (1.0 - 0.45 * farW);
  col += uBottle * uSunCol * lit * (0.25 + 0.9 * caust) * rif * 0.32 * mix(0.35, 1.0, inside);
  // seen from across the funnel, the wall below 40 - 74 m is the dark of the pit (see pit in the surface shader)
  col *= 1.0 - 0.9 * smoothstep(110.0, 210.0, length(uCam - P)) * smoothstep(40.0, 74.0, d) * inside * smoothstep(140.0, 176.0, length(uCam.xz));
  col = mix(col, mix(fogC(), fogC() * vec3(0.7, 0.8, 0.76) + vec3(0.0, 0.03, 0.018), farW), fogF());
  gl_FragColor = vec4(col, 1.0);
}`,Mt=`
${it}
uniform float uVeilPh;
void main(){
  vec3 P = vPos; float r = max(vR, 1e-3); vec2 rh = P.xz / r;
  float d = max(-P.y, 0.0), W = TAU * vP.y;
  float L = clamp(log2(RIM / r), -4.0, 3.999), k = floor(L), f = smoothstep(0.15, 0.85, L - k); int ki = int(k) + 4;
  vec2 gPx = dFdx(vP), gPy = dFdy(vP);
  vec2 off = vec2(0.59, 0.23 + uVeilPh);
  vec4 t = mix(patOct(vP, gPx, gPy, k, uPh2[ki], off), patOct(vP, gPx, gPy, k + 1.0, uPh2[ki + 1], off), f);
  float m = 0.5 + 0.3 * sin(TAU * 7.0 * (vP.x - 2.5 * uBigPh) - 9.0 * W + 0.7) + 0.2 * sin(TAU * 13.0 * vP.x + 15.0 * W);
  float a = smoothstep(0.42, 0.95, t.r * (0.5 + 0.8 * t.g)) * smoothstep(0.25, 0.8, m) * 0.55;
  a *= (1.0 - smoothstep(280.0, 300.0, r)) * (1.0 - smoothstep(108.0, 122.0, d)) * (1.0 - 0.9 * smoothstep(110.0, 210.0, length(uCam - P)) * smoothstep(40.0, 74.0, d) * smoothstep(140.0, 176.0, length(uCam.xz)));
  float lit = sunLit(P), lobe = sunLobe(rh);
  vec3 c = uFoam * vec3(0.55, 0.9, 0.72) * (uAmb * 0.45 + uSunCol * lit * 0.3) + uGlow * uGlowAmt * exp(-d / (uGlowFall * 1.2)) * lobe * 1.3;
  c *= a; float ff = fogF();
  gl_FragColor = vec4(mix(c, fogC() * a, ff), a);
}`,Bt=`
${ee}
uniform float uBreath, uMist, uPlume, uCollar;
attribute vec4 aA, aB;     // aA: theta, radius, y, size   aB: phase, speed, kind, seed
varying vec2 vQ; varying vec3 vL; varying vec3 vK; varying vec4 vSunB;   // vK: alpha, seed, kind; vSunB: sun in the billboard frame, up.y
#include <fog_pars_vertex>
void main(){
  float kind = aB.z, th, r, y, size, alpha;
  if (kind < 0.5) {            // collar round the lip, breathing
    float b = 0.5 + 0.5 * sin(TAU * (uBreath - 0.12 * aB.x));
    th = aA.x + uTime * aB.y; r = aA.y * (0.9 + 0.2 * b);
    y = aA.z + b * 9.0 * aB.w + 2.0 * sin(uTime * 0.45 + aB.x * TAU);
    size = aA.w * (0.8 + 0.4 * b); alpha = (0.16 + 0.16 * b) * uMist * uCollar;
    // seen from the rim and the upper wall the collar is thin torn mist over a black pit (thick, it lay on the throat
    // as a flat blue-grey pane and hid the hole); from u 0.6 on (within 120 m of the axis) it is the full collar
    alpha *= mix(1.0, 0.3 + 0.25 * aB.w, smoothstep(120.0, 190.0, length(uCam.xz)));
  } else if (kind < 1.5) {     // wisps climbing the axis
    float p = fract(uTime * aB.y + aB.x), b = 0.5 + 0.5 * sin(TAU * (uBreath - 0.25 - p * 0.8));
    th = aA.x + p * 2.4 + uTime * 0.12; r = aA.y * (0.35 + 1.0 * p);
    y = mix(-116.0, uPlume, p) + 4.0 * sin(p * 9.0 + aB.w * TAU);
    size = aA.w * (0.55 + 0.95 * p); alpha = pow(max(sin(3.14159 * p), 0.0), 0.8) * (0.22 + 0.26 * b) * uMist;
    // seen from the rim and the upper wall the column stands OUT of the pit: its foot, down in the dark, is thin, so the
    // black-green crescent of the far wall shows under it (the plume's foot lay across the pit as a pale pane)
    alpha *= mix(1.0, 0.1 + 0.9 * smoothstep(-42.0, 6.0, y), smoothstep(120.0, 190.0, length(uCam.xz)));
  } else {                     // spindrift torn off the breaker crest
    float p = fract(uTime * aB.y + aB.x), torn = min(aA.y, 1.0), close = step(1.5, aA.y);
    th = aA.x + 0.03 * p * (1.0 - 0.6 * close); r = 299.5 - mix(17.0, 8.5, close) * p;
    float ba = brkAmpAt(th / TAU, uTime);
    y = 4.3 * ba + 2.6 * sin(3.14159 * p) - 3.4 * p;
    size = aA.w * (0.5 + 1.1 * p); alpha = sin(3.14159 * p) * mix(0.42, 0.8, close);
    // (aA.y = 1: the extra spindrift at the crossing, torn off the high teeth only, thrown higher; aA.y = 2: the same
    // again within 60 m of where the route goes over, small bright rags flung off the top)
    alpha *= mix(1.0, 0.95 * smoothstep(mix(0.7, 0.55, close), 1.0, ba), torn); y += torn * 2.2 * sin(3.14159 * p); size *= 1.0 + 0.5 * torn * p;
    // over the fine strip the plain spindrift is thin: the torn rags and the crest's own fringe do the work there (a
    // soft cloud 8 m across veiled whatever stood beyond the crest)
    alpha *= 1.0 - 0.85 * (1.0 - torn) * brkFineW(th / TAU) * brkNear(th / TAU);
  }
  vec3 c = vec3(cos(th) * r, y, sin(th) * r);
  vec3 toCam = uCam - c; float dc = max(length(toCam), 1e-3); toCam /= dc;
  vec3 right = cross(vec3(0.0, 1.0, 0.0), toCam); right /= max(length(right), 1e-3);
  vec3 up = cross(toCam, right);
  vec3 p3 = c + (right * position.x + up * position.y) * size;
  alpha *= smoothstep(size * 0.7, size * 0.7 + mix(34.0, 13.0, step(1.5, kind)), dc);
  // clear air round the sight line to whatever the world asks to keep crisp (its leader, as we come over the crest)
  if (kind > 1.5 && uKeep.w > 0.01) { vec3 ab = uKeep.xyz - uCam; float tk = clamp(dot(c - uCam, ab) / max(dot(ab, ab), 1e-3), 0.0, 1.3); alpha *= smoothstep(uKeep.w * 0.5, uKeep.w * 1.6, length(c - uCam - ab * tk) - size * 0.6); }
  vSunB = vec4(dot(uSunDir, right), dot(uSunDir, up), dot(uSunDir, toCam), up.y);
  vQ = position.xy; vL = p3; vK = vec3(alpha, aB.w + aB.x * 3.7, kind);
  vec4 mvPosition = modelViewMatrix * vec4(p3, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ct=`
${ee}
varying vec2 vQ; varying vec3 vL; varying vec3 vK; varying vec4 vSunB;
uniform float uPit;      // 0..1: the mist down in the pit is thinner, darker and greener (the world: while we look down the throat from the lower wall)
#include <fog_pars_fragment>
// rough distance from p to the nearest water (dish, lip or shaft wall), positive in the air
float airDist(vec3 p){
  float r = length(p.xz);
  float a1 = (p.y - wallYg(r)) * 0.7;
  float a2 = (p.y - (-110.0 - (55.0 - r) * 2.1)) * 0.45;
  float sr = mix(30.0, 46.0, clamp((p.y + 200.0) / 71.0, 0.0, 1.0));
  float a3 = max(sr - r, p.y + 129.0);
  return r >= 55.0 ? a1 : (r >= 46.0 ? a2 : a3);
}
void main(){
  float rr = dot(vQ, vQ); if (rr > 1.0) discard;
  vec2 nuv = vQ * 0.19 + vec2(vK.y * 7.31, vK.y * 3.17) + vec2(0.0, -uTime * 0.013);
  float n = texture2D(uNoise, nuv).g * 0.65 + texture2D(uNoise, nuv * 3.1 + vec2(0.4, uTime * 0.02)).g * 0.35;
  float a = (1.0 - smoothstep(0.05, 1.0, rr)) * smoothstep(0.34, 0.78, n * 1.0 + (1.0 - rr) * 0.34);
  vec3 nb = vec3(vQ, sqrt(max(1.0 - rr, 0.0)));
  float shade = 0.5 + 0.5 * clamp(dot(nb, vSunB.xyz) * 0.8 + 0.35 + (n - 0.5) * 0.7, 0.0, 1.0);
  float top = 0.72 + 0.28 * nb.y * vSunB.w + (n - 0.5) * 0.3;
  a *= vK.x * smoothstep(0.3, 7.0, airDist(vL));
  float lit = sunLit(vL);
  // from the rim and the upper wall, the mist down in the pit's shadow is thin: the black throat shows through it and the
  // lit column stands out of it (pale blue-grey over the hole, it read as a pane laid on the sea)
  a *= 1.0 - 0.7 * (1.0 - lit) * smoothstep(120.0, 190.0, length(uCam.xz));
  vec3 V = normalize(uCam - vL);
  float fwd = pow(max(dot(-V, uSunDir), 0.0), 3.0);
  vec3 c = uFoam * (uAmb * 1.35 * top + uSunCol * lit * (0.36 + 0.3 * fwd) * shade) * (0.78 + 0.4 * fract(vK.y * 5.3));
  // the exit ring burning in the throat: the mist that lies on and round the sight line to it scatters its light toward
  // us (a halo about three ring-widths across, textured by the mist itself, seen even while the lip hides the ring),
  // and the mist close round the ring is lit by it from any side
  vec3 toS = uSeat.xyz - uCam; float tS = dot(toS, -V), dS = length(toS + V * tS), dR = length(uSeat.xyz - vL);
  // (a tight halo: spread wide it turned the whole throat khaki, and the ring was no longer the one bright thing in a
  // dark shaft. The mist down in the shaft itself is dim blue-grey.)
  float halo = (exp(-dS * dS / 70.0) * 0.2 + exp(-dS / 10.0) * 0.55 + exp(-dS / 26.0) * 0.1) * smoothstep(-20.0, 10.0, tS) + exp(-dR / 12.0) * 0.7;
  c *= mix(1.0, 0.45, smoothstep(-88.0, -132.0, vL.y));
  // (under a pale sky the collar's own blue-grey plus the ring's gold made the throat a khaki bowl: black-green instead)
  float pitK = uPit * smoothstep(-66.0, -100.0, vL.y);
  c *= mix(vec3(1.0), vec3(0.3, 0.5, 0.44), pitK); a *= 1.0 - 0.5 * pitK;
  c += mix(uGold, vec3(1.0, 0.86, 0.62), 0.08) * uSeat.w * halo * (0.75 + 0.5 * n);
  c *= a;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    c = mix(c, fogColor * a, ff);
  #endif
  gl_FragColor = vec4(c, a);
}`,Ft=`
${ee}
attribute vec4 iOrb, iRnd;   // iOrb: r, theta0, omega, Yn   iRnd: spin rate, phase, scale, shade
varying vec3 vWp, vNn; varying vec3 vInfo; varying float vFar;   // vInfo: height above the water, shade, along; vFar: 0 near .. 1 about to sink away
#include <fog_pars_vertex>
void main(){
  float th = iOrb.y + iOrb.z * uTime, r = iOrb.x; vec2 rh = vec2(cos(th), sin(th));
  float x = (RIM - clamp(r, 55.0, RIM)) / 245.0, sl = 330.0 * x * x / 245.0;
  vec3 n = normalize(vec3(-sl * rh.x, 1.0, -sl * rh.y)), tT = vec3(-rh.y, 0.0, rh.x), tW = cross(n, tT);
  float h = ridgeH(vec2(th / TAU, iOrb.w), r, uTime);
  float yaw = iRnd.y * TAU + iRnd.x * uTime, roll = 0.11 * sin(uTime * 0.9 + iRnd.y * 17.0) + iRnd.x * 2.0 * uTime * step(1.0, iRnd.w);
  float bob = 0.1 * sin(uTime * 1.3 + iRnd.y * 40.0);
  vec3 c = vec3(rh.x * r, wallYg(r), rh.y * r) + n * (h + bob + 0.035 * iRnd.z * step(iRnd.w, 1.0) + 0.14 * step(1.0, iRnd.w));
  // never within arm's reach of the eye: drift aside as the camera comes through. The long spars (scale 6 - 10) keep
  // 20 m off: nearer, a spar is a bare pale bar across the frame.
  vec3 dc = c - uCam; float dd = length(dc), isSpar = step(4.5, iRnd.z), isBarrel = step(1.0, iRnd.w);
  c += tW * (dot(dc, tW) < 0.0 ? -1.0 : 1.0) * (1.0 - smoothstep(4.0, mix(9.0, 27.0, isSpar), dd)) * mix(5.0, 21.0, isSpar);
  // and nothing is drawn where it would be thinner than a pixel (far planks and spars were black dashes on the pale
  // water, like stray line geometry): each piece sinks away with distance, barrels last
  float farS = 1.0 - smoothstep(mix(mix(26.0, 30.0, isSpar), 58.0, isBarrel), mix(mix(46.0, 52.0, isSpar), 88.0, isBarrel), dd);      // (a barrel 100 m off is a black dot three pixels across)
  // a bare board is a primitive shape at arm's length: the staves go under before they come within 12 m of the eye
  farS *= mix(smoothstep(11.0, 19.0, dd), 1.0, max(isSpar, isBarrel));
  // a board seen flatter than a few degrees from over 20 m off is one or two pixels thick whatever its length: it sinks too
  farS *= mix(mix(1.0, smoothstep(0.04, 0.17, abs(dot(n, dc)) / max(dd, 1.0)), smoothstep(12.0, 24.0, dd)), 1.0, isBarrel);
  vec3 lp = position * iRnd.z * farS, ln = normal;
  float cr = cos(roll), sr = sin(roll);
  lp.yz = vec2(cr * lp.y - sr * lp.z, sr * lp.y + cr * lp.z); ln.yz = vec2(cr * ln.y - sr * ln.z, sr * ln.y + cr * ln.z);
  vec3 ax = cos(yaw) * tT + sin(yaw) * tW, az = -sin(yaw) * tT + cos(yaw) * tW;
  vec3 wp = c + ax * lp.x + n * lp.y + az * lp.z;
  vWp = wp; vNn = ax * ln.x + n * ln.y + az * ln.z; vInfo = vec3(lp.y + bob * 0.5, fract(iRnd.w), position.x * 3.0 + iRnd.y * 9.0);
  vFar = smoothstep(18.0, mix(40.0, 75.0, isBarrel), dd);
  vec4 mvPosition = modelViewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,zt=`
${ee}
uniform vec4 uRag;       // the strip's crest ring: radius, radial and vertical offset at full height, lip weight
attribute vec2 aRag;     // X (turns), v: 0 on the crest .. 1 the torn edge
varying vec3 vPos, vRg;  // vRg: metres along the crest, v, strength
#include <fog_pars_vertex>
void main(){
  float X = aRag.x, v = aRag.y, th = TAU * X; vec2 rh = vec2(cos(th), sin(th));
  float fw = brkFineW(X), amp = mix(mix(brkAmp(X, uTime), brkAmpF(X, uTime), fw), 0.85, 0.5 * brkFar(X)), cu = brkCurl(X, uTime) * fw * mix(0.45, 1.0, brkNear(X)), lipK = uRag.w * fw;
  float r = uRag.x + uRag.y * amp - lipK * (0.3 + 3.0 * max(cu, 0.0) + 1.3 * min(cu, 0.0)) * amp;
  float y = uRag.z * amp - lipK * (0.8 * max(cu, 0.0) + 1.5 * max(-cu, 0.0)) * amp;
  float s = X * 1885.0;
  float n = textureLod(uNoise, vec2(s / 9.3, uTime * 0.045), 0.0).g, n2 = textureLod(uNoise, vec2(s / 2.3 + 0.4, uTime * 0.1 + 0.3), 0.0).g;
  float str = fw * (1.0 - smoothstep(30.0, 90.0, length(uCam.xz - rh * uRag.x))) * (1.0 - 0.7 * brkNotch(X));      // (only near the eye: from the race it was the white teeth of a mountain range)
  // how high it is thrown: most off the high teeth, in bursts
  float H = (0.18 + 0.6 * smoothstep(0.4, 0.75, n) + 0.5 * smoothstep(0.45, 0.8, n2)) * smoothstep(0.55, 0.95, amp + 0.25) * str;      // rags a hand to 1.3 m high (2.8 m of solid white was a snow peak on every tooth)
  float lean = 0.3 + 0.55 * v + 0.7 * max(cu, 0.0);
  r -= H * v * lean; y += H * v * (1.0 - 0.3 * v * v) + 0.05;
  vec3 p = vec3(rh.x * r, y, rh.y * r);
  p.y += chopH(p.xz, uTime) * chopEnv(uRag.x);
  vPos = p; vRg = vec3(s, v, str * smoothstep(0.02, 0.2, H));
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Rt=`
${ee}
varying vec3 vPos, vRg;
#include <fog_pars_fragment>
void main(){
  float s = vRg.x, v = vRg.y;
  float n = texture2D(uNoise, vec2(s / 3.1, v * 0.3 - uTime * 0.33)).g;
  float n2 = texture2D(uNoise, vec2(s / 0.9 + 0.37, v * 0.8 - uTime * 0.7)).g;
  float m = n * 0.62 + n2 * 0.42;
  // dense at the root, torn into rags and then droplets toward the edge
  float a = smoothstep(0.42 + 0.38 * v, 0.56 + 0.38 * v, m + 0.12 * (1.0 - v)) * (1.0 - smoothstep(0.7, 1.0, v)) * vRg.z * 0.9;
  if (a < 0.004) discard;
  float lit = sunLit(vPos);
  vec3 V = normalize(uCam - vPos);
  float fwd = pow(max(dot(-V, uSunDir), 0.0), 3.0);
  vec3 c = uFoam * 0.75 * (uSunCol * lit * (0.5 + 0.35 * n2 + 0.3 * fwd) + uAmb * 1.3) * (0.82 + 0.3 * m) * a;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    c = mix(c, fogColor * a, ff);
  #endif
  gl_FragColor = vec4(c, a);
}`,Wt=`
${ee}
uniform vec3 uWood;
varying vec3 vWp, vNn; varying vec3 vInfo; varying float vFar;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vNn); if (!gl_FrontFacing) N = -N;
  float grain = 0.75 + 0.25 * sin(vInfo.z * 5.0 + sin(vInfo.z * 1.7) * 3.0);
  // wet brown timber. Never black: the grade takes everything under 0.06 to pure black, and in the rim's shadow a tarred
  // board at albedo 0.05 was a black dash or a black slab. The wood is mid brown, the sky fills every face, the wet top
  // mirrors a little of the sky, and the edge turned to the sun is gold.
  vec3 wood = mix(uWood * 0.2, uWood * 0.62, vInfo.y) * grain;      // dark wet timber (sunlit, pale wood read as pink bars)
  float wet = 1.0 - smoothstep(0.02, 0.22, vInfo.x);
  wood *= mix(1.0, 0.68, wet);
  float lit = sunLit(vWp);
  vec3 V = normalize(uCam - vWp);
  float nv = max(dot(N, V), 0.0), fres = clamp(1.0 - nv, 0.0, 1.0);
  vec3 up = skyCol(vec3(0.0, 1.0, 0.0));
  vec3 col = wood * (uSunCol * lit * (0.15 + 0.85 * max(dot(N, uSunDir), 0.0)) + uAmb * (0.9 + 0.4 * N.y) + up * 0.45 + uBottle * 0.6);
  col += uSunCol * lit * pow(max(dot(reflect(-V, N), uSunDir), 0.0), 120.0) * 0.22 * (0.3 + wet);      // a glint, not a sheet: a flat board mirroring the low sun was a pale pink bar
  col += uSunCol * wood * fres * fres * max(dot(-V, uSunDir), 0.0) * 0.9;      // the rim toward the sun
  vec3 Rv = reflect(-V, N);
  col += mix(up, skyCol(vec3(Rv.x, abs(Rv.y) + 0.05, Rv.z)), 0.4) * (0.035 + 0.1 * fres * fres * fres * fres) * (0.6 + 0.4 * max(N.y, 0.0));      // the wet top (a little: mirroring the pale horizon a board is a pale lens)
  col = max(col, uWood * (0.14 + 0.1 * vInfo.y) * grain + vec3(0.028, 0.03, 0.03));      // the floor: brown, above the grade's black
  // a collar of foam where it sits in the water (a little broader with distance)
  float collar = (1.0 - smoothstep(-0.03, mix(0.06, 0.1, vFar), vInfo.x)) * 0.85;
  col = mix(col, uFoam * 0.7 * (uSunCol * lit * 0.6 + uAmb * 1.15), clamp(collar, 0.0, 1.0));
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col = mix(col, fogColor, ff);
  #endif
  gl_FragColor = vec4(col, 1.0);
}`;function Ge(s,h,c=0,w=0,S=1,k=null){const L=s.length,n=L*(h+1),V=new Float32Array(n*3),E=new Float32Array(n*3),Y=new Float32Array(n*2),U=new Float32Array(n*4);let T=0;for(let D=0;D<L;D++){const i=s[D],m=i.r-i.nr*c,f=i.y-i.ny*c;for(let b=0;b<=h;b++,T++){const C=w+(S-w)*(b/h),M=C*X,A=Math.cos(M),a=Math.sin(M);V[T*3]=A*m,V[T*3+1]=f,V[T*3+2]=a*m,E[T*3]=A*i.nr,E[T*3+1]=i.ny,E[T*3+2]=a*i.nr,Y[T*2]=C,Y[T*2+1]=i.W/X,k&&b>k[0]&&b<k[1]&&i.r<313.9&&i.r>295.1?(U[T*4+1]=-.6,E[T*3]=0,E[T*3+1]=1,E[T*3+2]=0):(U[T*4]=i.br,U[T*4+1]=i.by,U[T*4+2]=i.crest,U[T*4+3]=i.lip||0)}}const z=new Uint32Array((L-1)*h*6);let K=0;for(let D=0;D<L-1;D++)for(let i=0;i<h;i++){const m=D*(h+1)+i,f=m+1,b=m+h+1,C=b+1;z[K++]=m,z[K++]=b,z[K++]=f,z[K++]=f,z[K++]=b,z[K++]=C}const W=new t.BufferGeometry;return W.setAttribute("position",new t.BufferAttribute(V,3)),W.setAttribute("normal",new t.BufferAttribute(E,3)),W.setAttribute("aPolar",new t.BufferAttribute(Y,2)),W.setAttribute("aBrk",new t.BufferAttribute(U,4)),W.setIndex(new t.BufferAttribute(z,1)),W}const Dt=s=>new t.Color(s);async function Ot(s,h={}){const c=s.rng.fork?s.rng.fork("maelstrom-hero"):s.rng,w=s.quality?.detail??1,S=(h.palette&&h.palette.length>=6?h.palette:wt).map(Dt),k=new t.Group;k.name="maelstrom-descent-hero";const L=new t.Vector3(Math.cos(.157)*.866,Math.sin(.157),Math.cos(.157)*.5),n={uTime:{value:0},uCam:{value:new t.Vector3(0,80,500)},uSunDir:{value:L.clone()},uSunH:{value:new t.Vector2(.866,.5)},uSunTan:{value:Math.tan(.157)},uSunCol:{value:new t.Color("#FFD9A0").multiplyScalar(1.6)},uAmb:{value:new t.Color(.2,.31,.46)},uSkyZen:{value:new t.Color("#6F93A8")},uSkyWarm:{value:S[3].clone().lerp(new t.Color(1,.86,.62),.45)},uSkyCool:{value:new t.Color("#7F9DB0")},uDeep:{value:S[0].clone()},uBottle:{value:S[1].clone()},uGlow:{value:S[2].clone().multiplyScalar(1.45)},uGold:{value:S[3].clone()},uFoam:{value:S[5].clone()},uGlowAmt:{value:1},uBigPh:{value:0},uNoise:{value:null},uShade:{value:new t.Vector4(.006,.004,0,0)},uShadeE:{value:new t.Vector2(.45,.75)},uGlowFall:{value:h.glowFall??25},uClear:{value:h.clear??.12},uPh1:{value:new Array(9).fill(0)},uPh2:{value:new Array(9).fill(0)},uPh3:{value:new Array(9).fill(0)},uWake:{value:Array.from({length:8},()=>new t.Vector4(0,0,0,0))},uWakeDir:{value:Array.from({length:8},()=>new t.Vector4(1,0,0,0))},uWakeC:{value:new Array(8).fill(1)},uClearAt:{value:new t.Vector4(0,0,0,0)},uBreath:{value:0},uMist:{value:1},uVeilPh:{value:0},uSeat:{value:new t.Vector4(0,-170,-24,0)},uBigN:{value:new t.Vector2(3,5)},uCov:{value:1},uRib:{value:1},uPlume:{value:46},uBrkArc:{value:new t.Vector3(.5,.07,-1)},uClearB:{value:new t.Vector4(0,0,0,0)},uCollar:{value:1},uFloor:{value:1},uPour:{value:0},uPit:{value:0},uBrkK:{value:1},uKeep:{value:new t.Vector4(0,0,0,0)}};function V(e={}){if(e.sunDir){const o=n.uSunDir.value.copy(e.sunDir).normalize(),r=Math.hypot(o.x,o.z);r>.001&&n.uSunH.value.set(o.x/r,o.z/r),n.uSunTan.value=Math.min(40,Math.max(0,o.y)/Math.max(r,.02))}e.sunColor&&n.uSunCol.value.set(e.sunColor).multiplyScalar(e.sunIntensity??1.6),e.ambient&&n.uAmb.value.set(e.ambient),e.zenith&&n.uSkyZen.value.set(e.zenith),e.horizonWarm&&n.uSkyWarm.value.set(e.horizonWarm),e.horizonCool&&n.uSkyCool.value.set(e.horizonCool),e.glow!==void 0&&(n.uGlowAmt.value=e.glow),e.glowColor&&n.uGlow.value.set(e.glowColor)}V(h);const E=[[3,5],[2,5],[4,7],[3,7],[5,8]],Y=c.pick(E);n.uBigN.value.set(Y[0],Y[1]),n.uCov.value=h.foam??c.range(.82,1.1),n.uRib.value=h.streets??(c.chance(.4)?2:1),n.uPlume.value=h.plumeTop??c.range(32,58);const U=h.mist??c.range(.8,1.15),T=c.range(0,400);n.uNoise.value=await kt(c,()=>s.yield?.()),await s.yield?.();const{rings:z,topY:K,strip:W}=At();await s.yield?.();const D=22,i=22,m=23,f=82,b=9,C=D+i,M=C+m,A=M+f,a=A+b,l=(e,o,r)=>new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...n},vertexShader:e,fragmentShader:o,fog:!0,...r}),u={transparent:!0,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.OneFactor,blendDstAlpha:t.OneMinusSrcAlphaFactor},p=w<.7?192:256,P=Math.round(p*115/256),R=Math.round(p*152/256),q=h.fineBreaker!==!1,le=(h.crossing??Math.PI)/X;n.uBrkArc.value.set((P+R)/(2*p),q?(R-P)/(2*p):0,q&&h.crossing!==!1?le:-1);const ve=Ge(z,p,0,0,1,q?[P,R]:null);ve.boundingSphere=new t.Sphere(new t.Vector3(0,-100,0),Ee+200);const me=l(Pt,St,{...u,depthWrite:!0}),se=new t.Mesh(ve,me);se.renderOrder=10,se.name="surface",k.add(se),await s.yield?.();let te=null,oe=null;if(q){const e=Ge(W,(R-P)*(w<.7?7:13),0,P/p,R/p),o=Math.PI*(P+R)/p;e.boundingSphere=new t.Sphere(new t.Vector3(Math.cos(o)*300,2,Math.sin(o)*300),160),te=new t.Mesh(e,me),te.renderOrder=9.6,te.name="breaker-strip",k.add(te),await s.yield?.();let r=0;for(let F=1;F<W.length;F++)W[F].y+W[F].by>W[r].y+W[r].by&&(r=F);const v=W[r],y=(R-P)*(w<.7?7:13),N=4,I=new Float32Array((y+1)*N*3),d=new Float32Array((y+1)*N*2),g=new Uint32Array(y*(N-1)*6);for(let F=0,x=0;F<=y;F++)for(let H=0;H<N;H++,x++){const j=(P+(R-P)*(F/y))/p,ne=j*X;I[x*3]=Math.cos(ne)*300,I[x*3+1]=5,I[x*3+2]=Math.sin(ne)*300,d[x*2]=j,d[x*2+1]=H/(N-1)}for(let F=0,x=0;F<y;F++)for(let H=0;H<N-1;H++){const j=F*N+H,ne=j+N;g[x++]=j,g[x++]=ne,g[x++]=j+1,g[x++]=j+1,g[x++]=ne,g[x++]=ne+1}const B=new t.BufferGeometry;B.setAttribute("position",new t.BufferAttribute(I,3)),B.setAttribute("aRag",new t.BufferAttribute(d,2)),B.setIndex(new t.BufferAttribute(g,1)),B.boundingSphere=e.boundingSphere.clone();const _=l(zt,Rt,{...u,depthWrite:!1,side:t.DoubleSide});_.uniforms.uRag={value:new t.Vector4(v.r,v.br,v.by,v.lip)},oe=new t.Mesh(B,_),oe.renderOrder=10.5,oe.name="breaker-rags",k.add(oe),await s.yield?.()}const we=[];for(let e=0;e<C;e++)z[e].r<700&&(e%2===0||e===C-1)&&we.push(z[e]);we.push({...z[M],r:300,y:0,nr:0,ny:1});for(let e=M+2;e<A;e+=3)we.push(z[e]);for(let e=A;e<z.length;e+=e<a?2:1)we.push(z[e]);const xe=new t.Mesh(Ge(we,128,Le),l(nt,Tt,{}));xe.name="shell",xe.renderOrder=1,xe.geometry.boundingSphere=new t.Sphere(new t.Vector3(0,-60,0),760),k.add(xe),await s.yield?.();const _e=[];for(let e=M+1;e<A;e+=3)_e.push(z[e]);for(let e=A;e<a;e+=2)_e.push(z[e]);const ye=new t.Mesh(Ge(_e,128,gt),l(nt,Mt,{...u,depthWrite:!1}));ye.name="veil",ye.renderOrder=6,ye.geometry.boundingSphere=new t.Sphere(new t.Vector3(0,-60,0),340),k.add(ye);const be=new t.Mesh(new t.CircleGeometry(tt+Le+3,32),new t.MeshBasicMaterial({color:S[0].clone().multiplyScalar(.25),fog:!0}));be.rotation.x=-Math.PI/2,be.position.y=Xe+.5,be.name="shaft-floor",k.add(be),await s.yield?.();const Ve=Math.round(260*w),Ke=Math.round(130*w),lt=Math.round(170*w),Se=q?Math.round(170*w):0,de=Ve+Ke+lt,ht=n.uBrkArc.value.z>=0?Math.round(170*w):0,Te=de+Se+ht,O=new Float32Array(Te*4),G=new Float32Array(Te*4),Q=e=>{const o=Math.sin(e*127.1+311.7)*43758.5453;return o-Math.floor(o)};for(let e=de+Se;e<Te;e++){const o=e*4,r=e-de-Se;O[o]=n.uBrkArc.value.z*X-.035+.235*Math.pow(Q(r*1.73+3),1.3),O[o+1]=2,O[o+2]=0,O[o+3]=.45+1.25*Q(r*4.9+7),G[o]=Q(r*7.3+1),G[o+1]=.3+.3*Q(r*3.7+5),G[o+2]=2,G[o+3]=Q(r*5.1+8)}for(let e=de;e<de+Se;e++){const o=e*4,r=e-de,v=n.uBrkArc.value.x*X,y=n.uBrkArc.value.y*X;O[o]=v+y*(-.7+1.12*(Q(r*1.37)+Q(r*2.91+5))*.5),O[o+1]=1,O[o+2]=0,O[o+3]=1.5+2.6*Q(r*4.3+1),G[o]=Q(r*7.7+2),G[o+1]=.22+.2*Q(r*3.1+9),G[o+2]=2,G[o+3]=Q(r*5.9+4)}for(let e=0;e<de;e++){const o=e<Ve?0:e<Ve+Ke?1:2,r=e*4;if(o===0){const v=30+40*Math.pow(c(),.9),y=v>=Z?J(v):Math.max(K-6,-fe-(Z-v)*2.1);O[r]=c()*X,O[r+1]=v,O[r+2]=y+2+22*c()*c(),O[r+3]=c.range(7,17),G[r]=c(),G[r+1]=c.range(.07,.16),G[r+2]=0,G[r+3]=c()}else o===1?(O[r]=c()*X,O[r+1]=c.range(4,19),O[r+2]=0,O[r+3]=c.range(8,18),G[r]=c(),G[r+1]=c.range(.035,.06),G[r+2]=1,G[r+3]=c()):(O[r]=c()*X,O[r+1]=0,O[r+2]=0,O[r+3]=c.range(3.5,8),G[r]=c(),G[r+1]=c.range(.16,.3),G[r+2]=2,G[r+3]=c())}const pe=new t.InstancedBufferGeometry;pe.setAttribute("position",new t.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),pe.setIndex([0,1,2,0,2,3]),pe.setAttribute("aA",new t.InstancedBufferAttribute(O,4)),pe.setAttribute("aB",new t.InstancedBufferAttribute(G,4)),pe.instanceCount=Te,pe.boundingSphere=new t.Sphere(new t.Vector3(0,-40,0),360);const ke=new t.Mesh(pe,l(Bt,Ct,{...u,depthWrite:!1,side:t.DoubleSide}));ke.name="mist",ke.renderOrder=14,ke.frustumCulled=!1,k.add(ke),n.uMist.value=U,await s.yield?.();const he=[],Me=[];for(let e=0;e<A;e++)he.push(z[e].r),Me.push(z[e].W);const qe=e=>{if(e>=he[0])return Math.log(e);let o=0,r=he.length-1;if(e<=he[r])return Me[r];for(;r-o>1;){const v=o+r>>1;he[v]>=e?o=v:r=v}return $(Me[o],Me[r],(he[o]-e)/Math.max(1e-6,he[o]-he[r]))};let ae=T;function He(e,o,r=ae,v=new t.Vector3,y=null){const N=Math.max(e,Z),I=Math.cos(o),d=Math.sin(o),g=Oe(N),B=Math.hypot(g,1),_=-g/B,F=1/B,x=o/X,H=qe(N)/X,j=xt(x,H,N,r),ne=I*(N+_*j),et=d*(N+_*j);return v.set(ne,J(N)+F*j+yt(ne,et,r)*bt(N),et),y&&y.set(I*_,F,d*_),v}const je=new t.Vector3;function ct(e,o,r=2.2,v=ae,y=new t.Vector3){return He(e,o,v,y,je),y.addScaledVector(je,r)}const Be=(e,o,r)=>{const v=Oe(Math.max(e,Z)),y=Math.hypot(v,1);return new t.Vector3(Math.cos(o)*(e-v/y*r),J(e)+r/y,Math.sin(o)*(e-v/y*r))};let Ae=null;if(h.flotsam!==!1){const e=c.fork?c.fork("flotsam"):c,o=new t.BoxGeometry(1,.05,.2,5,1,2);{const d=o.attributes.position;for(let g=0;g<d.count;g++){const B=d.getX(g),_=d.getZ(g);let F=d.getY(g);F+=.03*(1-4*B*B)+(Math.abs(_)>.09?-Math.sign(F)*.012:0);const x=B>.49?B-.09*Math.abs(Math.sin(_*60+1))-(_>0?.05:0):B;d.setXYZ(g,x,F,_*(1-.25*Math.max(0,-B)))}o.computeVertexNormals()}const r=[[0,-.5],[.2,-.5],[.27,-.485],[.3,-.5],[.32,-.44],[.345,-.4],[.335,-.36],[.38,-.16],[.4,-.12],[.39,-.08],[.4,0],[.39,.08],[.4,.12],[.38,.16],[.335,.36],[.345,.4],[.32,.44],[.3,.5],[.27,.485],[.2,.5],[0,.5]].map(d=>new t.Vector2(d[0],d[1])),v=new t.LatheGeometry(r,10);v.rotateZ(Math.PI/2);const y=new t.CylinderGeometry(.012,.02,1,7,6,!1);y.rotateZ(Math.PI/2);{const d=y.attributes.position;for(let g=0;g<d.count;g++){const B=d.getX(g);d.setY(g,d.getY(g)+.02*Math.sin(B*3)),B>.49&&d.setX(g,B-.03*Math.abs(Math.sin(d.getZ(g)*400)))}y.computeVertexNormals()}const N=[{geo:o,n:Math.round(200*w),scale:[1.3,3.2],lift:0,shade:[.15,.95],spin:.12,rMin:86},{geo:v,n:24,scale:[.8,.98],lift:.12,shade:[1.2,1.8],spin:.5,rMin:112},{geo:y,n:10,scale:[6,10],lift:0,shade:[.05,.35],spin:.05,rMin:130}],I=l(Ft,Wt,{side:t.DoubleSide});I.uniforms.uWood={value:S[6]?S[6].clone():new t.Color("#B8864C")},Ae=new t.Group,Ae.name="flotsam";for(const d of N){const g=new t.InstancedBufferGeometry;g.index=d.geo.index,g.setAttribute("position",d.geo.attributes.position),g.setAttribute("normal",d.geo.attributes.normal);const B=new Float32Array(d.n*4),_=new Float32Array(d.n*4);for(let x=0;x<d.n;x++){const H=d.rMin+(282-d.rMin)*Math.pow(e(),1.25),j=Math.floor(e()*5)/5;B[x*4]=H,B[x*4+1]=(j+.07*e.gauss())*X+Math.log(H)*ot*-1,B[x*4+2]=Ie(H)*e.range(.93,1),B[x*4+3]=qe(H)/X,_[x*4]=e.range(-1,1)*d.spin,_[x*4+1]=e(),_[x*4+2]=e.range(d.scale[0],d.scale[1]),_[x*4+3]=e.range(d.shade[0],d.shade[1])}g.setAttribute("iOrb",new t.InstancedBufferAttribute(B,4)),g.setAttribute("iRnd",new t.InstancedBufferAttribute(_,4)),g.instanceCount=d.n,g.boundingSphere=new t.Sphere(new t.Vector3(0,-50,0),320);const F=new t.Mesh(g,I);F.frustumCulled=!1,F.renderOrder=2,Ae.add(F)}k.add(Ae),await s.yield?.()}const Ce=Math.PI,$e=1.5*Math.PI,ge=Math.atan2(n.uSunH.value.y,n.uSunH.value.x),Fe=new t.Vector3(0,-170,-24),ze=new t.Vector3(0,-Math.sin(65*Math.PI/180),Math.cos(65*Math.PI/180)),Ye=Fe.clone().addScaledVector(ze,-62),ce=[];for(let e=0;e<=3;e++){const o=112-e*34,r=-311+e*3.2,v=Math.hypot(r,o);ce.push(new t.Vector3(r,2.4+5.2*ie(316,302,v),o))}for(let e=1;e<=7;e++){const o=e/7;ce.push(Be($(300,185,o*o*(3-2*o)*.6+o*.4),Ce+1*o,2.2+3*(1-o)*(1-o)))}const ft=$e+X-.95-(Ce+1);for(let e=1;e<=26;e++){const o=e/26;ce.push(Be($(185,78,Math.pow(o,.85)),Ce+1+ft*o,2.2))}ce.push(Be(66,$e-.42,3.2)),ce.push(Ye.clone()),ce.push(Fe.clone().addScaledVector(ze,-31)),ce.push(Fe.clone());const ut={portalSeat:{position:Fe,normal:ze.clone().negate(),direction:ze.clone(),radius:7},flyThrough:ce,diveStart:Ye,rimCrossing:new t.Vector3(-301.5,5,0),funnelView:{position:Be(262,Ce+.45,4),lookAt:new t.Vector3(0,-45,0)},farWall:new t.Vector3(Math.cos(ge)*190,J(190),Math.sin(ge)*190),glass:{theta:ge,thetaSpan:2.1,rFrom:80,rTo:215,position:new t.Vector3(Math.cos(ge)*112,J(112),Math.sin(ge)*112),depthFrom:3,depthTo:9,shell:Le},shadowLine:{theta:ge+Math.PI,depth:60},throat:new t.Vector3(0,-fe,0),mistTop:new t.Vector3(0,n.uPlume.value,0),shaft:{topY:K,topRadius:We,midY:Ne,midRadius:De,floorY:Xe},sunDir:n.uSunDir.value,rimRadius:re,lipRadius:Z,lipDepth:fe},Pe=new t.Vector3;function mt(e,o,r=3,v=1,y=null,N=1){if(e<0||e>7)return;n.uWakeC.value[e]=N;const I=n.uWake.value[e],d=n.uWakeDir.value[e];if(!o||r<=0){I.w=0;return}if(I.set(o.x,o.y,o.z,r),y)Pe.copy(y).normalize();else{const g=Math.max(Math.hypot(o.x,o.z),1),B=o.x/g,_=o.z/g,F=Oe(g),x=Math.hypot(F,1);Pe.set(-B/x*.9+_*.4,-F/x*.9,-_/x*.9-B*.4).normalize()}d.set(Pe.x,Pe.y,Pe.z,v)}let Ze=null;const Qe=new t.Vector3,dt=new t.Matrix4,pt=1+Ue*Ue;function Je(e,o,r){ae=T+o,n.uTime.value=ae,r&&(k.updateWorldMatrix(!0,!1),r.getWorldPosition(Qe).applyMatrix4(dt.copy(k.matrixWorld).invert()),n.uCam.value.copy(Qe));for(let v=0;v<9;v++){const y=v-4,N=16*Math.pow(2,-y),I=N*Ie(re*Math.pow(2,-y))*pt/X;n.uPh1.value[v]=I*ae%1,n.uPh2.value[v]=(I*.78*ae+.3)%1,n.uPh3.value[v]=(I*.55*ae+.6)%1}n.uBigPh.value=ae*.006%10,n.uVeilPh.value=ae*.011%1,n.uBreath.value=Ze??ae/7%1}return Je(0,0,null),{object:k,radius:re,height:240,center:new t.Vector3(0,65,0),anchors:ut,update:Je,dispose(){n.uNoise.value?.dispose()},ground:!1,groundY:0,uniforms:n,meshes:{surface:se,shell:xe,veil:ye,mist:ke,cap:be,flotsam:Ae,breaker:te,rags:oe},setKeep(e,o=0){!e||o<=0?n.uKeep.value.w=0:n.uKeep.value.set(e.x,e.y,e.z,o)},wallY:J,flowSpeed:rt,angularSpeed:Ie,surfaceAt:He,eyeAt:ct,setWake:mt,setLight:V,setBreath(e){Ze=e??null},setMist(e,o=1){n.uMist.value=U*e,n.uCollar.value=o},setPour(e=0){n.uPour.value=e},setPit(e=0){n.uPit.value=e},setClearB(e,o=0){!e||o<=0?n.uClearB.value.w=0:n.uClearB.value.set(e.x,e.y,e.z,o)},setSeat(e,o=0){e?n.uSeat.value.set(e.x,e.y,e.z,o):n.uSeat.value.w=o},setClear(e,o=0){!e||o<=0?n.uClearAt.value.w=0:n.uClearAt.value.set(e.x,e.y,e.z,o)}}}export{Ut as MAELSTROM_GLSL,Ie as angularSpeed,Ot as buildHero,rt as flowSpeed,J as wallY};
