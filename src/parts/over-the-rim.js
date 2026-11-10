import*as t from"three";import{mergeGeometries as ge}from"three/addons/utils/BufferGeometryUtils.js";import{makeNoise as be,makeRng as Z0,clamp as z0,lerp as b0,smoothstep as f0}from"../kit/core.js";const we=["#143F9E","#B4603D","#CFA57C","#F4F8FC","#D62222","#10A56B","#7A3DB8"],B0=1600,V0=1600,T0=-400,Q0=45,U0=14,re=900,F0=Math.tan(22*Math.PI/180),C0=Math.tan(10*Math.PI/180),H0=-90,M0=415,$0=9.5,R0=2.9,O0=-7,j0=75,S0=905,le=8.5,_0=[[1e3,-60,70,0],[1150,-330,105,2],[1080,250,55,1],[1330,-520,80,0],[1800,420,75,0],[1250,560,90,3],[1950,-300,55,1],[2e3,150,85,3]],K0=-6,G0=38,E0=325,I0=325+(M0-325-62*Math.cos(10*Math.PI/180)),ce=$0-F0*(G0-K0)*.5,he=ce-F0*(E0-G0),fe=he-(F0+C0)*.5*(I0-E0),X0=fe-C0*(M0-I0);function y0(s){if(s<=K0)return $0;if(s<=G0){const N=s-K0;return $0-F0*N*N/(2*(G0-K0))}if(s<=E0)return ce-F0*(s-G0);if(s<=I0){const N=s-E0,f=I0-E0;return he-F0*N+(F0-C0)*N*N/(2*f)}if(s<=M0)return fe-C0*(s-I0);const i=s-M0,l=50,A=.56;if(i<=l)return X0-C0*i-(A-C0)*i*i/(2*l);const S=X0-C0*l-(A-C0)*l*.5,r=S0-45;if(s<=r)return S-A*(i-l);const F=S-A*(r-M0-l),w=Math.min(1,(s-r)/45);return F-A*45*(w-w*w*.5)}const q0=[[30,45.5],[75,39],[104,18],[124,13.2],[166,13.2],[186,26],[203,45],[221,24],[240,13.2],[312,13.2],[334,25],[362,33],[394,30.5],[432,30.5],[470,44],[540,60]];function ye(s){if(s<=q0[0][0])return q0[0][1];for(let i=1;i<q0.length;i++)if(s<=q0[i][0]){const l=q0[i-1],A=q0[i];return b0(l[1],A[1],f0(l[0],A[0],s))}return q0[q0.length-1][1]}function ze(s,i){const l=s.n2,A=i.range(1880,2150),S=[];for(let e=0;e<12;e++)S.push(i.range(-50,50));const r=i.range(48,66),F=i.range(44,62),w=i.range(30,44),N={x:i.range(268,296),z:i.range(56,68),hx:23,hz:14,y:0},f={d:0,th:0,sa:0,env:0},z=e=>{const p=Math.abs(e);return 1+.085*l(Math.cos(e)*1.4+S[0],Math.sin(e)*1.4+S[1])*f0(.12,.5,p)+.03*l(Math.cos(e)*4.1+S[2],Math.sin(e)*4.1)*f0(.2,.6,p)},b=4096,v=new Float32Array(b+2);for(let e=0;e<b+2;e++)v[e]=z(-Math.PI+e/b*2*Math.PI);const U=e=>{const p=(e+Math.PI)/(2*Math.PI)*b,q=Math.max(0,Math.min(b,Math.floor(p)));return v[q]+(v[q+1]-v[q])*(p-q)};function d(e,p){const q=(V0-e)/B0,j=p/A,P=Math.atan2(j,q);let n=(1-Math.sqrt(q*q+j*j)/U(P))*B0;const W=P*1750;if(f.th=P,f.d=n,f.sa=W,n<=0)return f.env=0,0;let t0=n-1.3;if(n<40){const V=Math.abs(Math.sin(W/9.5+1.7*l(W/60,S[3])));t0=Math.max(0,n-b0(2.6*V*f0(0,6,n),1.3,f0(24,40,n)))}let O;if(t0<U0){const V=t0/U0;O=-Q0*(1-Math.pow(1-V,2.3))}else{const V=Math.min(1,(t0-U0)/(re-U0));O=-Q0-(-T0-Q0)*(1-Math.pow(1-V,1.12))}const o0=f0(U0+2,150,n)*(1-f0(760,1010,n));if(f.env=o0,o0<=0&&n>re)return O+5*l(e/420+S[4],p/420);const x=.62+.38*f0(140,520,Math.abs(p))+.38*f0(900,1300,e),a=Math.min(1,x),Z=W+55*l(n/330+S[5],W/520),E=l(Z/310+S[6],n/1500+S[7])*r,a0=1-Math.abs(l(Z/190+S[8],n/1100)),r0=a0*a0,s0=1-Math.abs(l(Z/120+S[9],n/700+S[10])),H=s0*s0,n0=f0(18,110,n)*(1-f0(500,830,n)),K=H*Math.sqrt(s0)*F*n0*(.6+.4*l(n/70,Z/160+S[11])),L=1-Math.abs(l(Z/46+S[2],n/210+S[4])),D=L*L*13-5,Q=l(e/38+S[0],p/38)*4.5;let M=O+(E-r0*r0*w+Q+D)*o0*a+K*a+(n>700?5*l(e/420+S[4],p/420)*f0(700,950,n):0);const J=Math.abs(p);if(e>28&&e<560&&J<150){const V=f0(28,80,e)*(1-f0(470,560,e))*(1-f0(16,150,J)),i0=y0(e)-ye(e-.3*p)-J*.1+l(e/14,p/14+S[1])*1.2;M=b0(M,i0,V)}if(e>470&&e<S0+30&&J<70){const V=y0(e)-17+Math.max(0,J-26)*1.6;M>V&&(M=V)}return Math.max(M,T0-8)}const X={x:N.x,z:N.z,hx:N.hx,hz:N.hz,y:d(N.x,N.z)-2.5};N.z=47+(N.z-62)*.5,N.y=d(N.x,N.z-N.hz)-1.5;const _=(e,p,q)=>{let j=d(p,q);const P=(1-f0(e.hx,e.hx+12,Math.abs(p-e.x)))*(1-f0(e.hz,e.hz+11,Math.abs(q-e.z)));return P>0&&(j=b0(j,e.y,P)),j};return{height:(e,p)=>_(N,e,p),heightPlace:(e,p)=>_(X,e,p),info:f,barrio:(e,p)=>f0(-.7,-.46,l(e/205+S[2],p/205+S[3])+.25*l(e/70,p/70+S[5])),pitch:N,pitchOld:X,at:(e,p,q)=>{const j=(1-e/B0)*U(p);return q.x=V0-B0*j*Math.cos(p),q.z=A*j*Math.sin(p),q},B:A,wob:U}}const A0=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uCam; uniform float uTime;
uniform float uNight; uniform vec3 uRimSh; uniform vec4 uCab; uniform vec4 uLine; uniform vec3 uHaze; uniform vec3 uZen;
uniform sampler2D uHM; uniform vec4 uHMRect; uniform float uCloudY; uniform float uWet; uniform vec3 uFarK;   // uFarK = far-fog cap, far haze, warm bounce
uniform vec4 uCloudU; uniform vec4 uDist; uniform vec4 uAir;   // uAir.x = thin haze lying in the bowl (0 = none); uCloudU = the ninth cloud shadow, run by the world on its clock (x, z, radius, strength); uDist = offsets of the district field
float h11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p){ return 0.5 * vn(p) + 0.3 * vn(p * 2.03 + 7.1) + 0.2 * vn(p * 4.01 + 3.7); }
// cumulus shadows sweeping across the bowl at about 40 m/s: five from the rim toward the far wall, three smaller ones
// across the floor from left to right; soft-edged, deep enough to read from the rim. Each fades in and out at the
// ends of its run, so none ever appears or goes at a stroke
float cloudOne(vec2 p, vec2 c, vec2 r, float e0){ vec2 d = (p - c) / r; return 1.0 - smoothstep(e0, 1.0, dot(d, d)); }
float cloudRunX(float ph, float sp){ return mod(uTime * sp + ph, 3600.0) - 200.0; }
float cloudEndX(float x){ return smoothstep(-200.0, 220.0, x) * (1.0 - smoothstep(2980.0, 3400.0, x)); }
float cloudRunZ(float ph, float sp){ return mod(uTime * sp + ph, 4400.0) - 2200.0; }
float cloudEndZ(float z){ return smoothstep(-2200.0, -1800.0, z) * (1.0 - smoothstep(1800.0, 2200.0, z)); }
float cloudShade(vec2 xz){
  float s = 0.0;
  vec2 w = vec2(fbm(xz * 0.006), fbm(xz * 0.006 + 9.0)) * 160.0, p = xz + w;
  float x1 = cloudRunX(300.0, 41.0), x2 = cloudRunX(1500.0, 37.0), x3 = cloudRunX(2500.0, 43.0), x5 = cloudRunX(900.0, 39.0), x6 = cloudRunX(2050.0, 40.0);
  s = max(s, cloudOne(p, vec2(x1, -520.0 + 60.0 * sin(uTime * 0.02)), vec2(330.0, 210.0), 0.42) * cloudEndX(x1));
  s = max(s, cloudOne(p, vec2(x2, 380.0), vec2(260.0, 190.0), 0.42) * cloudEndX(x2));
  s = max(s, cloudOne(p, vec2(x3, 1150.0), vec2(380.0, 240.0), 0.42) * cloudEndX(x3));
  s = max(s, cloudOne(p, vec2(x5, 760.0), vec2(240.0, 170.0), 0.42) * cloudEndX(x5));
  s = max(s, cloudOne(p, vec2(x6, -130.0), vec2(300.0, 180.0), 0.42) * cloudEndX(x6) * smoothstep(520.0, 760.0, xz.x));   // this one keeps off the wall the cabin rides
  float z7 = cloudRunZ(500.0, 47.0), z8 = cloudRunZ(2100.0, 53.0), z9 = cloudRunZ(3400.0, 44.0);
  float off = smoothstep(600.0, 820.0, xz.x);                                 // these three cross the floor and the far wall only
  s = max(s, cloudOne(p, vec2(1280.0, z7), vec2(170.0, 230.0), 0.45) * cloudEndZ(z7) * off);
  s = max(s, cloudOne(p, vec2(1950.0, z8), vec2(190.0, 250.0), 0.45) * cloudEndZ(z8) * off);
  s = max(s, cloudOne(p, vec2(2600.0, z9), vec2(210.0, 280.0), 0.45) * cloudEndZ(z9) * off);
  vec2 d4 = (xz + w * 0.3 - uCloudU.xy) / max(uCloudU.z, 1.0) * vec2(1.0, 1.3);
  s = max(s, uCloudU.w * (1.0 - smoothstep(0.3, 1.0, dot(d4, d4))));
  return 1.0 - 0.6 * s;
}
// painted districts (the same field in the placement code): x = how painted this barrio is, y = its palette
// (0 turquoise and white, 1 pink and yellow, 2 mint and violet)
vec2 district(vec2 p){
  float a = sin(p.x * 0.0117 + uDist.x) * cos(p.y * 0.0131 + uDist.y) + 0.7 * sin((p.x * 0.6 + p.y * 0.8) * 0.0093 + uDist.x * 1.7) + 0.5 * cos((p.x * 0.8 - p.y * 0.6) * 0.0171 + uDist.y * 2.3);
  float b = sin(p.x * 0.0083 + uDist.y * 3.1 + 1.0) * sin(p.y * 0.0097 + uDist.x * 2.3) + 0.6 * sin((p.x - p.y) * 0.0061 + 4.0);
  return vec2(smoothstep(-0.15, 0.25, a), b < -0.22 ? 0.0 : (b < 0.22 ? 1.0 : 2.0));
}
vec3 districtPaint(float pal, float h){
  float k = floor(h * 4.0);
  if (pal < 0.5) return k < 1.5 ? vec3(0.014, 0.392, 0.527) : (k < 2.5 ? vec3(0.78, 0.76, 0.69) : vec3(0.20, 0.40, 0.66));
  if (pal < 1.5) return k < 0.5 ? vec3(0.807, 0.069, 0.323) : (k < 1.5 ? vec3(0.888, 0.539, 0.010) : (k < 2.5 ? vec3(0.871, 0.254, 0.012) : vec3(0.78, 0.76, 0.69)));
  return k < 0.5 ? vec3(0.005, 0.376, 0.147) : (k < 1.5 ? vec3(0.195, 0.047, 0.479) : (k < 2.5 ? vec3(0.30, 0.62, 0.45) : vec3(0.78, 0.76, 0.69)));
}
// night street lamps beside the ride: four cells in seven of a 9 m lattice (the world hangs a glow on each);
// returns the lamp light a point stands in, from its own cell and the eight round it
vec2 lampCell(vec2 c){ return (c + 0.5) * 9.0 + 1.2 * vec2(sin(c.x * 1.7 + c.y * 2.3), cos(c.x * 2.9 + c.y * 1.3)); }
vec3 lampPool(vec3 p){
  vec2 c0 = floor(p.xz / 9.0); vec3 acc = vec3(0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = c0 + vec2(float(i), float(j));
    float on = step(mod(c.x * 3.0 + c.y * 5.0, 7.0), 3.5) * step(10.5, c.x) * step(c.x, 36.5) * step(abs(c.y + 0.5), 3.6);
    float k = 1.0 - smoothstep(0.0, 8.5, length(p.xz - lampCell(c)));
    acc += mix(vec3(1.0, 0.60, 0.25), vec3(0.80, 0.90, 1.0), step(5.5, mod(c.x * 2.0 + c.y * 7.0, 8.0))) * (k * k * k * on);
  }
  return acc;
}
// low sun behind the rim: everything under the shadow plane that leaves the cliff lip is in shade (x = tan elevation, z = strength)
float rimShade(vec3 p){
  return 1.0 - uRimSh.z * smoothstep(0.0, 8.0, p.x) * (1.0 - smoothstep(-10.0, 10.0, p.y + (p.x - uRimSh.y) * uRimSh.x));
}
// the square shadow of the cabin the camera rides (uCab.xyz = its centre, w = half size; 0 = off)
// every cabin on the straight 22 degree run throws one too (uLine = slope, intercept of the eye line, phase of each row)
float cabRow(vec3 p, float zl, float ph){
  float t = (zl - p.z) / min(uSunDir.z, -0.03); vec3 h = p + uSunDir * t;
  float dx = mod(h.x - ph + 34.77, 69.54) - 34.77, e = 0.1 + 0.004 * t;
  float yc = uLine.x * (h.x - dx) + uLine.y - 0.1;
  return step(0.3, t) * (1.0 - smoothstep(1.0 - e, 1.0 + e, abs(dx))) * (1.0 - smoothstep(1.1 - e, 1.1 + e, abs(h.y - yc))) * step(42.0, h.x) * step(h.x, 322.0) * (1.0 - smoothstep(70.0, 120.0, t));
}
float cabShade(vec3 p){
  vec3 d = uCab.xyz - p; float t = dot(d, uSunDir); vec3 r = d - uSunDir * t;
  float m = max(abs(r.x), max(abs(r.y) * 0.8, abs(r.z)));
  float own = step(0.5, t) * (1.0 - smoothstep(uCab.w - 0.12, uCab.w + 0.12 + 0.012 * t, m)) * step(0.001, uCab.w);
  float rows = uSunDir.z < -0.03 && uLine.x < 0.0 ? max(cabRow(p, 0.0, uLine.z), cabRow(p, -7.0, uLine.w)) : 0.0;
  return 1.0 - max(0.74 * own, 0.45 * rows);
}
// hard shadows near the ride from a top-down height map the world supplies (uHMRect = x0, z0, 1/width, 1/depth)
float hmShade(vec3 p, vec3 n){
  vec2 u0 = (p.xz - uHMRect.xy) * uHMRect.zw;
  vec2 e = min(u0, 1.0 - u0);
  float inside = smoothstep(0.0, 0.02, min(e.x, e.y * 4.0));
  vec3 q0 = p + n * 0.7; float s = 0.0, t = 0.45, k = 1.0 / max(uSunDir.y, 0.3);
  for (int i = 0; i < 8; i++) {
    vec3 q = q0 + uSunDir * (t * k);
    float h = textureLod(uHM, (q.xz - uHMRect.xy) * uHMRect.zw, 0.0).r;
    s = max(s, smoothstep(0.05, 0.5, h - q.y));
    t *= 1.75;
  }
  return 1.0 - s * inside;
}
// morning cloud sea: light thins and whitens toward the deck (uCloudY = top of the deck, -1e5 when there is none)
float seaVeil(float y){ return 1.0 - smoothstep(uCloudY - 14.0, uCloudY + 26.0, y); }
// aerial haze in layers: it thickens with distance and pools low in the bowl, so each ridge stands a value lighter
// than the one in front of it and the far rim melts toward the sky (uAir.x = strength in the bowl, uAir.y = at the far rim)
vec3 bowlAir(vec3 col, vec3 p){
  float d = length(uCam - p), low = 1.0 - smoothstep(-390.0, -40.0, p.y);
  float k = uAir.x * smoothstep(150.0, 1500.0, d) * (0.45 + 0.55 * low) + uAir.y * smoothstep(1300.0, 3900.0, d);
  return mix(col, uHaze * (uSunCol * 0.45 + uSkyCol * 1.2), min(k, 0.8));
}
`,Ie=A0,We={cliffFoot:U0+2.6,gantry:M0,road0Width:le};async function Me(s,i,l){const A=[-236,-235,-150,-70,-25,-6,0,1.2,3.5,7,10.5,14,19,26];for(let e=26;e+=8.5+e/900*22,!(e>=892);)A.push(e);A.push(900,940,1e3,1090,1200,1330,1470,1596);const S=[0];for(let e=0;e+=.0054+.0095*f0(.15,.3,e)+.031*f0(.5,.95,e),!(e>=Math.PI-.02);)S.push(e);const r=[];for(let e=S.length-1;e>0;e--)r.push(-S[e]);for(let e=0;e<S.length;e++)r.push(S[e]);r.push(Math.PI);const F=A.length,w=r.length,N=F*w,f=new Float32Array(N*3),z=new Float32Array(N*4),b={x:0,z:0};for(let e=0;e<F;e++){for(let p=0;p<w;p++){i.at(A[e],r[p],b);const q=(e*w+p)*3;f[q]=b.x,f[q+2]=b.z,f[q+1]=e===0?T0-30:A[e]<=0?0:i.height(b.x,b.z)}await s.yield()}const v=new Uint32Array((F-1)*w*6);let U=0;for(let e=0;e<F-1;e++)for(let p=0;p<w;p++){const q=(p+1)%w,j=e*w+p,P=e*w+q,e0=(e+1)*w+p,n=(e+1)*w+q;v[U++]=j,v[U++]=P,v[U++]=e0,v[U++]=P,v[U++]=n,v[U++]=e0}const d=new t.BufferGeometry;d.setAttribute("position",new t.BufferAttribute(f,3)),d.setIndex(new t.BufferAttribute(v,1)),await s.yield(),d.computeVertexNormals();const X=d.attributes.normal.array;if(X[8*w*3+1]<0){for(let e=0;e<v.length;e+=3){const p=v[e+1];v[e+1]=v[e+2],v[e+2]=p}d.computeVertexNormals()}await s.yield();const _=Math.hypot(l.x,l.z)||1,I=l.x/_,C=l.z/_,y=l.y/_,G=y<1.4?[9,30,85,210]:[9,30];for(let e=0;e<F;e++)for(let p=0;p<w;p++){p===0&&await s.yield();const q=e*w+p,j=q*3,P=f[j],e0=f[j+1],n=f[j+2],W=A[e];let t0=1;if(W>0&&W<1010)for(let Z=0;Z<G.length;Z++){const E=G[Z],a0=i.height(P+I*E,n+C*E)-(e0+E*y);a0>0&&(t0=Math.min(t0,1-z0(a0/(E*.3),0,1)))}let O=1;if(e>6&&e<F-1){const Z=(p+w-1)%w,E=(p+1)%w,a0=(f[(e*w+Z)*3+1]+f[(e*w+E)*3+1]+f[((e-1)*w+p)*3+1]+f[((e+1)*w+p)*3+1])*.25,r0=Math.hypot(f[(e*w+E)*3]-P,f[(e*w+E)*3+2]-n)+4;O=1-z0((a0-e0)/r0*2.2,0,.55)}const o0=X[j+1];let x=0,a=0;if(W<=0)a=e===0?0:1,x=.72*f0(210,400,Math.hypot(P,n));else{const Z=Math.max(f0(520,720,P),f0(300,440,Math.abs(n)));x=i.barrio(P,n)*f0(.66,.79,o0)*Z*f0(20,60,W),W>900&&(x*=.85)}z[q*4]=t0,z[q*4+1]=x,z[q*4+2]=a,z[q*4+3]=O}return d.setAttribute("aData",new t.BufferAttribute(z,4)),d.computeBoundingSphere(),d.userData.grid={ds:A,ths:r},d}const w0=14;async function Se(s,i,l){const r=Math.ceil((i.B*1.12+250)/w0)*w0,F=Math.ceil(3892/w0),w=Math.round(2*r/w0),N=-r,f=new Float32Array(F*w),z=new Float32Array(F*w),b=new Uint8Array(F*w*4);for(let C=0;C<w;C++){(C&15)===0&&await s.yield();const y=N+(C+.5)*w0;for(let G=0;G<F;G++){const e=-252+(G+.5)*w0;f[C*F+G]=i.height(e,y),z[C*F+G]=i.info.d}}const v=Math.hypot(l.x,l.z)||1,U=l.x/v/w0,d=l.z/v/w0,X=Math.max(.08,l.y/v),_=(C,y)=>{const G=C<0?0:C>F-1.001?F-1.001:C,e=y<0?0:y>w-1.001?w-1.001:y,p=G|0,q=e|0,j=G-p,P=e-q,e0=q*F+p;return(f[e0]*(1-j)+f[e0+1]*j)*(1-P)+(f[e0+F]*(1-j)+f[e0+F+1]*j)*P};for(let C=0;C<w;C++){(C&7)===0&&await s.yield();const y=N+(C+.5)*w0;for(let G=0;G<F;G++){const e=C*F+G,p=-252+(G+.5)*w0,q=f[e],j=z[e];let P=1;if(j>0)for(let n=10,W=0;W<48;W++,n*=1.06){const t0=q+n*X;if(t0>24)break;const O=_(G+U*n,C+d*n)-t0,o0=1.5+.035*n;if(O>-o0){const x=1-(O+o0)/(2*o0);if(x<P&&(P=x<0?0:x),P<=0)break}}let e0;if(j<=0)e0=.72*f0(210,400,Math.hypot(p,y));else{const n=G>0?G-1:G,W=G<F-1?G+1:G,t0=C>0?C-1:C,O=C<w-1?C+1:C,o0=(f[C*F+W]-f[C*F+n])/((W-n)*w0),x=(f[O*F+G]-f[t0*F+G])/((O-t0)*w0),a=1/Math.sqrt(1+o0*o0+x*x),Z=Math.max(f0(520,720,p),f0(300,440,Math.abs(y)));e0=i.barrio(p,y)*f0(.66,.8,a)*Z*f0(20,60,j)*(j>900?.85:1)}for(const n of _0)Math.abs(p-n[0])<n[2]*1.02+w0&&Math.abs(y-n[1])<n[2]*1.02+w0&&(e0=0);b[e*4]=Math.round(P*255),b[e*4+1]=Math.round(z0(e0,0,1)*255),b[e*4+3]=255}}const I=new t.DataTexture(b,F,w,t.RGBAFormat,t.UnsignedByteType);return I.magFilter=t.LinearFilter,I.minFilter=t.LinearFilter,I.wrapS=I.wrapT=t.ClampToEdgeWrapping,I.generateMipmaps=!1,I.needsUpdate=!0,{tex:I,rect:new t.Vector4(-252,N,1/(F*w0),1/(w*w0))}}const L0=`#include <common>
#include <fog_pars_vertex>
`,D0=`#include <common>
#include <fog_pars_fragment>
`;function ke(s,i,l,A,S=1){const r=Math.round(9*S),F=Math.round(6*S);return new t.ShaderMaterial({fog:!0,defines:{RC_SEE:r,RC_SHADE:F,RC_REACH:(5.5*r/9).toFixed(3),RC_SREACH:(3.5*F/6).toFixed(3),RC_BAND:(1-.4*S).toFixed(3)},uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{uBrick:{value:i.brick},uPale:{value:i.pale},uPitch:{value:new t.Vector4(l.x,l.z,l.hx,l.hz)},uGreen:{value:A},uAccent:{value:i.blue},uDots:{value:1},uLm:{value:_0.map(w=>new t.Vector4(w[0],w[1],w[2],w[3]))}}]),vertexShader:L0+`
      attribute vec4 aData; varying vec3 vP; varying vec3 vN; varying vec4 vData;
      void main(){ vP = position; vN = normal; vData = aData;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:D0+A0+`
      uniform vec3 uBrick; uniform vec3 uPale; uniform vec4 uPitch; uniform float uGreen; uniform vec3 uAccent; uniform float uDots; uniform vec4 uLm[8];
      varying vec3 vP; varying vec3 vN; varying vec4 vData;
      vec2 gPd; float gFar;                                                          // this fragment's district, and how far off it is (set in main)
      // the long shadows of the towers on the floor (uTw = x, z, half width, height; height 0 = unused): each is the
      // tower's footprint swept away from the sun, narrowing a little toward its tip
      uniform vec4 uTw[48];
      float towerShade(vec3 p, float fw){
        float hl = max(length(uSunDir.xz), 1e-3); vec2 sd = uSunDir.xz / hl; float k = hl / max(uSunDir.y, 0.22 * hl);
        float s = 0.0;
        for (int i = 0; i < 48; i++) {
          vec4 t = uTw[i]; vec2 d = p.xz - t.xy; float L = max(t.w * k, 1.0);
          float a = clamp(-dot(d, sd), 0.0, L); vec2 r = d + sd * a;
          float w = t.z * (1.0 - 0.3 * a / L), e = 2.5 + 0.03 * a + 0.5 * fw;
          s = max(s, (1.0 - smoothstep(w - e, w + e, length(r))) * step(1.0, t.w));
        }
        return 1.0 - 0.74 * s * (1.0 - 0.6 * uNight);
      }
      float tri(float x){ return abs(fract(x) - 0.5) * 2.0; }
      // erosion flutes for one plan direction of fall: narrow across the slope, long down it (1 on the rill line)
      float flute(vec2 xz, vec2 dir, float w){ float v = vn(vec2(dot(xz, vec2(-dir.y, dir.x)) * 0.14 + w, dot(xz, dir) * 0.026) + 17.0 * dir); return 1.0 - abs(2.0 * v - 1.0); }
      // landmarks painted on the floor of the bowl: L = centre x, z, half size, kind (0 a market of striped tarpaulins,
      // 1 a paved church square, 2 a stadium, 3 a park); lit = light on a level surface here
      vec3 landmark(vec3 col, vec2 xz, vec4 L, float fwP, vec3 lit){
        vec2 q = (xz - L.xy) / max(L.z, 1.0);
        if (L.z < 1.0 || max(abs(q.x), abs(q.y)) > 1.5) return col;
        float e = fwP / max(L.z, 1.0), m = 0.0; vec3 c = vec3(0.0);
        if (L.w < 0.5) {
          m = 1.0 - smoothstep(0.92 - e, 0.92 + e, max(abs(q.x), abs(q.y)));
          vec2 g = (xz - L.xy) / 30.0; vec2 id = floor(g), f = fract(g) - 0.5; float hh = h21(id + L.xy * 0.01), eg = fwP / 30.0;   // market halls under awnings 30 m across
          float aisle = 1.0;
          float tarp = aisle * (1.0 - smoothstep(0.44 - eg, 0.44 + eg, max(abs(f.x), abs(f.y))));
          vec3 tc = hh < 0.34 ? vec3(0.04, 0.14, 0.60) : (hh < 0.5 ? vec3(0.62, 0.05, 0.04) : (hh < 0.64 ? vec3(0.80, 0.55, 0.03) : (hh < 0.76 ? vec3(0.03, 0.36, 0.14) : (hh < 0.88 ? vec3(0.75, 0.74, 0.68) : vec3(0.78, 0.25, 0.02)))));
          tc *= 0.72 + 0.28 * step(0.5, fract(f.x * 3.0 + 0.5)) * (1.0 - smoothstep(0.1, 0.3, eg));
          c = mix(vec3(0.42, 0.35, 0.28), tc, mix(0.75 * aisle, tarp, 1.0 - smoothstep(0.5, 1.6, eg)));
        } else if (L.w < 1.5) {
          float rr = length(q);
          m = 1.0 - smoothstep(0.95 - e, 0.95 + e, max(abs(q.x), abs(q.y)));
          c = vec3(0.60, 0.56, 0.50);
          c = mix(c, vec3(0.42, 0.33, 0.28), (1.0 - smoothstep(0.03, 0.03 + e, min(abs(q.x), abs(q.y)))) * 0.6);
          c = mix(c, vec3(0.70, 0.68, 0.64), 1.0 - smoothstep(0.0, e + 0.02, abs(rr - 0.45)));
          vec2 tf = fract(q * 6.0) - 0.5;
          float tree = step(0.72, max(abs(q.x), abs(q.y))) * (1.0 - smoothstep(0.28, 0.34 + e * 6.0, length(tf)));
          c = mix(c, vec3(0.08, 0.17, 0.07), tree * 0.9);
        } else if (L.w < 2.5) {
          vec2 o = q * vec2(1.0, 1.38); float rr = length(o);
          m = 1.0 - smoothstep(1.0 - e, 1.0 + e, rr);
          float ang = atan(o.y, o.x + 1e-5);
          vec2 sdn = uSunDir.xz / max(length(uSunDir.xz), 1e-3); float toSun = dot(o / max(rr, 1e-3), sdn);
          float blk = fract(ang * 0.955 + 0.3);                                          // blocks of seats: grey concrete, blue, a few red
          c = mix(vec3(0.27, 0.27, 0.29), vec3(0.07, 0.15, 0.40), step(0.55, blk)); c = mix(c, vec3(0.42, 0.10, 0.07), step(0.85, blk));
          c *= (0.88 + 0.12 * step(0.5, fract(ang * 3.82))) * (0.62 + 0.38 * smoothstep(0.66, 0.92, rr));   // the rake of the stand: darker toward the pitch
          c *= 0.50 + 0.50 * smoothstep(-0.1, 0.6, -toSun);                                 // the stand under the sun turns its face away from it
          c = mix(c, vec3(0.50, 0.49, 0.46), smoothstep(0.90, 0.93 + e, rr));                // the roof ring
          c = mix(c, vec3(0.08, 0.08, 0.10), (1.0 - smoothstep(0.0, 0.025 + e, abs(rr - 0.90))) * 0.8);
          c = mix(c, vec3(0.40, 0.15, 0.09), 1.0 - smoothstep(0.66, 0.66 + e, rr));
          vec2 pq = abs(q) / vec2(0.5, 0.33);
          vec3 grass = vec3(0.10, 0.30, 0.08) * (0.85 + 0.15 * step(0.5, fract(q.x * 6.0)));
          grass = mix(grass, vec3(0.8), (1.0 - smoothstep(0.0, 0.03 + e * 2.0, min(abs(q.x), abs(length(q) - 0.12)))) * 0.7);
          c = mix(c, grass * 1.25, 1.0 - smoothstep(1.0 - e * 3.0, 1.0 + e * 3.0, max(pq.x, pq.y)));
          col = mix(col, col * vec3(0.40, 0.44, 0.62), (1.0 - smoothstep(1.0, 1.30, rr - 0.12 * toSun)) * smoothstep(0.1, 0.7, -toSun) * (1.0 - m) * (1.0 - uNight));   // its shadow on the streets beyond
        } else {
          m = 1.0 - smoothstep(0.9 - e, 0.9 + e, length(q) + 0.15 * (vn(xz * 0.03) - 0.5));
          vec2 tg = xz / 11.0; vec2 tid = floor(tg); vec2 tf = fract(tg) - 0.5 - (h22(tid) - 0.5) * 0.5;
          float tree = step(h21(tid + 3.0), 0.7) * (1.0 - smoothstep(0.30, 0.36 + fwP / 11.0, length(tf)));
          c = mix(vec3(0.26, 0.34, 0.12), vec3(0.07, 0.16, 0.07), tree);
          c = mix(c, vec3(0.62, 0.55, 0.42), (1.0 - smoothstep(0.02, 0.03 + e, abs(abs(q.x) - abs(q.y)))) * 0.8);
        }
        return mix(col, c * lit, m);
      }
      // ---- the far city in relief ----
      // One lattice of houses for the whole bowl, bent by a slow warp so its streets curve. It is walked along the eye
      // ray, so every house is a true box (a level roof, the walls toward the eye, the ground between) and walked again
      // toward the sun for the shadow each one throws. Cells of 9 m are houses; cells of 18, 36 and 72 m are rows and
      // blocks for where a house is under a few pixels. Every 72 m of the lattice is a street and every 288 m an avenue,
      // at every pitch. Nothing here is a flat pattern laid on the ground, so nothing can stretch on a slope.
      uniform sampler2D uBS; uniform vec4 uBSRect; uniform float uPxK;
      vec2 rcWarp(vec2 xz){ return xz + 110.0 * vec2(vn(xz * 0.0013 + 3.0), vn(xz * 0.0013 + 11.0)) + 20.0 * vec2(vn(xz * 0.0045 + 7.0), vn(xz * 0.0045 + 17.0)); }
      vec2 gG0; vec2 gUv0; mat2 gUvM;          // this fragment's place in the lattice and in the bowl map, and the map's step per grid metre (set in main)
      // the building of cell id in the lattice of pitch c: its height (0 = an open lot) and its footprint lo..hi in grid metres
      float rcBox(vec2 id, float c, float hk, out vec2 lo, out vec2 hi){
        vec2 r = h22(id + c * 1.37 + 3.1), e0 = id * c, e1 = e0 + c;
        vec2 s0 = step(abs(mod(e0 + 36.0, 72.0) - 36.0), vec2(0.5)), s1 = step(abs(mod(e1 + 36.0, 72.0) - 36.0), vec2(0.5));
        vec2 a0 = step(abs(mod(e0 + 144.0, 288.0) - 144.0), vec2(0.5)), a1 = step(abs(mod(e1 + 144.0, 288.0) - 144.0), vec2(0.5));
        float al = 0.07 * c + 0.4, st = 3.4 + 0.03 * c, av = 7.0 + 0.03 * c;
        lo = e0 + mix(mix(vec2(al), vec2(st), s0), vec2(av), a0) + 0.08 * c * r;
        hi = e1 - mix(mix(vec2(al), vec2(st), s1), vec2(av), a1) - 0.08 * c * (1.0 - r.yx);
        float dens = textureLod(uBS, gUv0 + gUvM * (0.5 * (lo + hi) - gG0), 0.0).g;
        float pres = step(h21(id + c * 0.71 + 11.0), min(0.92, dens * 1.45)) * step(0.3 * c, min(hi.x - lo.x, hi.y - lo.y));
        return pres * (0.36 + 0.50 * h21(id + c * 0.13 + 5.0)) * 9.0 * hk;
      }
      // the eye ray walked down to the ground point gG0: dg = grid metres per metre of ray, ay = its fall per metre, dh = its
      // fall toward the ground plane, gr = the plane's gradient in the lattice. Returns 0 = the ground is seen, 1 = a roof,
      // 2 = a wall; oP = (where, metres below the roof, the house's height), oI = (cell, the wall's normal), oB = footprint
      float rcSee(vec2 dg, float ay, float dh, vec2 gr, float c, float hk, out vec4 oP, out vec4 oI, out vec4 oB){
        oP = vec4(gG0, 0.0, 0.0); oI = vec4(0.0); oB = vec4(0.0);
        vec2 d = vec2(abs(dg.x) < 1e-4 ? 1e-4 : dg.x, abs(dg.y) < 1e-4 ? 1e-4 : dg.y), sg = sign(d), inv = 1.0 / d;
        float top = 7.8 * hk + 0.5 * c * (abs(gr.x) + abs(gr.y));
        float tS = -min(top / max(-dh, 0.02), RC_REACH * c / max(abs(d.x), abs(d.y)));
        vec2 p = gG0 + d * tS, id = floor(p / c);
        vec2 tM = tS + ((id + max(sg, 0.0)) * c - p) * inv, tD = c * abs(inv);
        float kind = 0.0;
        for (int i = 0; i < RC_SEE; i++) {
          vec2 lo, hi; float h = rcBox(id, c, hk, lo, hi);
          if (h > 0.0) {
            vec2 ta = (lo - gG0) * inv, tb = (hi - gG0) * inv, t1 = min(ta, tb), t2 = max(ta, tb);
            float te = max(max(t1.x, t1.y), tS), tx = min(min(t2.x, t2.y), 0.0);
            if (te < tx) {
              float b = dot(gr, gG0 - 0.5 * (lo + hi)) - h, fe = ay * te + b;
              if (fe < 0.0) { kind = 2.0; oP = vec4(gG0 + d * te, -fe, h); oI = vec4(id, t1.x > t1.y ? vec2(-sg.x, 0.0) : vec2(0.0, -sg.y)); oB = vec4(lo, hi); break; }
              if (ay * tx + b < 0.0) { float tr = clamp(-b / min(ay, -1e-3), te, tx); kind = 1.0; oP = vec4(gG0 + d * tr, 0.0, h); oI = vec4(id, 0.0, 0.0); oB = vec4(lo, hi); break; }
            }
          }
          if (min(tM.x, tM.y) >= 0.0) break;
          if (tM.x < tM.y) { id.x += sg.x; tM.x += tD.x; } else { id.y += sg.y; tM.y += tD.y; }
        }
        return kind;
      }
      // the same lattice walked from the ground point toward the sun: 1 where a house stands in the way
      float rcShade(vec2 ds, float sy, float sdh, vec2 gr, float c, float hk){
        vec2 d = vec2(abs(ds.x) < 1e-4 ? 1e-4 : ds.x, abs(ds.y) < 1e-4 ? 1e-4 : ds.y), sg = sign(d), inv = 1.0 / d;
        float top = 7.8 * hk + 0.5 * c * (abs(gr.x) + abs(gr.y));
        float tE = min(top / max(sdh, 0.05), RC_SREACH * c / max(abs(d.x), abs(d.y)));
        vec2 id = floor(gG0 / c);
        vec2 tM = ((id + max(sg, 0.0)) * c - gG0) * inv, tD = c * abs(inv);
        float s = 0.0;
        for (int i = 0; i < RC_SHADE; i++) {
          vec2 lo, hi; float h = rcBox(id, c, hk, lo, hi);
          if (h > 0.0) {
            vec2 ta = (lo - gG0) * inv, tb = (hi - gG0) * inv, t1 = min(ta, tb), t2 = max(ta, tb);
            float te = max(max(t1.x, t1.y), 0.0), tx = min(min(t2.x, t2.y), tE);
            if (te < tx && sy * te + dot(gr, gG0 - 0.5 * (lo + hi)) - h < 0.0) { s = 1.0; break; }
          }
          if (min(tM.x, tM.y) >= tE) break;
          if (tM.x < tM.y) { id.x += sg.x; tM.x += tD.x; } else { id.y += sg.y; tM.y += tD.y; }
        }
        return s;
      }
      // what the eye meets in the lattice of pitch c, lit: a roof under the sun and the sky, a wall by the same rule as
      // the real houses (sun on the faces turned to it, cool sky and a little bounce on the others), or the ground between,
      // in the sun (gLit) or in a house's shadow (gSh). sunK = the sun left here by ridges and clouds; px = metres to a pixel
      vec3 rcCity(float c, float hk, vec2 dg, float dh, vec2 gr0, vec2 ds, float sdh, mat2 J, vec3 gLit, vec3 gSh, float sunK, float px){
        // a house has a level roof; a block of houses steps down the slope with it, so its roof leans as the ground does
        // by the share its houses cannot level (none for a 9 m house, three quarters for a 36 m block)
        vec2 gr = gr0 * min(1.0, 9.0 / c); float ay = dh + dot(gr, dg), sy = sdh + dot(gr, ds);
        vec4 oP, oI, oB; float kind = rcSee(dg, ay, dh, gr, c, hk, oP, oI, oB);
        if (kind < 0.5) {
          float s = (sunK > 0.01 && sdh > 0.02) ? rcShade(ds, sy, sdh, gr, c, hk) : 0.0;
          return mix(gLit, gSh, s);
        }
        // a 9 m cell is one house; a larger cell is a block of four, each with a roof and a front of its own tone
        float sub = 0.5 * c; vec2 sid = c < 13.0 ? oI.xy : floor(oP.xy / sub) + 0.37 * c;
        float pk = h21(sid + 11.0), pk2 = h21(sid + 17.0);
        float isP = step(h21(sid + 23.0), mix(0.10, 0.40, gPd.x));
        vec3 paintC = districtPaint(gPd.y, h21(sid + 37.0)) * 0.78;
        vec3 brick = mix(uBrick, vec3(0.62, 0.27, 0.12), 0.45) * (0.85 + 0.5 * pk2);
        float wt = h21(sid + 61.0);                                              // most walls are bare brick; some are cement render, some pale adobe
        vec3 wallC = mix(wt < 0.16 ? vec3(0.47, 0.45, 0.42) * (0.8 + 0.4 * pk2) : (wt < 0.28 ? vec3(0.60, 0.50, 0.37) * (0.8 + 0.4 * pk2) : brick), paintC, isP);
        vec3 lampC = mix(vec3(1.0, 0.62, 0.26), vec3(0.85, 0.92, 1.0), step(0.62, pk));
        if (kind > 1.5) {
          vec2 nW = vec2(dot(J[0], oI.zw), dot(J[1], oI.zw)); nW /= max(length(nW), 1e-3);
          float sunT = max(nW.x * uSunDir.x + nW.y * uSunDir.z, 0.0) * sunK;
          vec3 light = uSunCol * min(sunT * 1.9, 1.0) + uSkyCol * 0.75 + vec3(0.34, 0.25, 0.17) * uFarK.z * 0.45 * (0.3 + 0.7 * sunK) * (1.0 - 0.75 * uNight);
          float u = abs(oI.z) > 0.5 ? oP.y : oP.x, below = oP.z;
          float ws = c / 9.0;                                                  // a block's front is drawn in bays as much larger as the block is: its dark openings hold a few pixels at the distance it is seen from
          float wk = 1.0 - smoothstep(0.22, 0.6, px / (2.8 * ws));
          vec2 wg = vec2(u / (3.1 * ws), below / (2.8 * ws)), wf = fract(wg); float hw = h21(floor(wg) + sid * 1.3);
          float win = step(0.3, hw) * step(abs(wf.x - 0.5), 0.24) * step(0.32, wf.y) * step(wf.y, 0.78) * wk;
          vec3 col = wallC * (0.88 + 0.24 * h21(vec2(floor(u / (3.1 * ws)), 3.0) + sid)) * mix(1.0, 0.93 + 0.07 * step(0.12, wf.y), wk);
          col = mix(col, vec3(0.05, 0.06, 0.09), win * 0.85) * light;
          float foot = oP.w - dot(gr, oP.xy - 0.5 * (oB.xy + oB.zw)) - below;   // metres above the ground at the wall's foot
          col *= (0.66 + 0.34 * smoothstep(-0.3, 2.2, foot)) * (0.74 + 0.26 * smoothstep(0.03 * c + 0.15, 0.05 * c + 0.3, below));   // dark at the foot, and the line of shade under the eave
          col += uNight * lampC * win * step(0.5, fract(hw * 37.0)) * 1.8;
          return col;
        }
        vec3 tinC = pk2 < 0.55 ? vec3(0.54, 0.55, 0.58) * (0.8 + 0.45 * pk2) : (pk2 < 0.80 ? vec3(0.40, 0.22, 0.14) : (pk2 < 0.87 ? vec3(0.46, 0.10, 0.07) : (pk2 < 0.94 ? vec3(0.07, 0.28, 0.16) : vec3(0.08, 0.19, 0.46))));
        vec3 roof = pk < 0.45 ? tinC : (pk < 0.65 ? vec3(0.45, 0.42, 0.39) * (0.8 + 0.35 * pk2) : brick * 0.78);
        roof = mix(roof, paintC * 0.85, isP * step(0.45, h21(sid + 51.0)) * 0.7);
        vec2 ed = min(oP.xy - oB.xy, oB.zw - oP.xy); float fine = 1.0 - smoothstep(0.25, 0.8, px);
        roof *= 1.0 - 0.32 * fine * (1.0 - smoothstep(0.0, 0.5, min(ed.x, ed.y)));                       // the parapet or the eave
        if (c > 13.0) { vec2 sf = abs(fract(oP.xy / sub) - 0.5) * sub; roof *= 1.0 - 0.55 * (1.0 - smoothstep(0.25, 0.3 + px, 0.5 * sub - max(sf.x, sf.y))) * (1.0 - smoothstep(0.1, 0.35, px / sub)); }   // the alley between the houses of a block
        return roof * (uSunCol * (uSunDir.y * 1.05 * sunK) + uSkyCol * 0.9) + uNight * lampC * 0.02;
      }
      void main(){
        vec3 N0 = normalize(vN + vec3(0.0, 1e-4, 0.0));
        float flatTop = vData.z, ao = vData.w;
        vec4 bm = textureLod(uBS, (vP.xz - uBSRect.xy) * uBSRect.zw, 0.0);            // the bowl map: ridge and spur shadows, city density (none where it is too steep to build)
        float shade = bm.r, dens = bm.g;
        // rills and creases too fine for the mesh: a ridged bump that only bites on slopes
        float camD = length(uCam - vP); gFar = smoothstep(420.0, 820.0, camD);
        float bfade = (1.0 - flatTop) * (1.0 - smoothstep(900.0, 2600.0, camD));
        vec2 bp = vP.xz * 0.045;
        float b0 = abs(2.0 * vn(bp) - 1.0) + 0.5 * abs(2.0 * vn(bp * 2.3 + 5.0) - 1.0);
        float bx = abs(2.0 * vn(bp + vec2(0.09, 0.0)) - 1.0) + 0.5 * abs(2.0 * vn((bp + vec2(0.09, 0.0)) * 2.3 + 5.0) - 1.0);
        float bz = abs(2.0 * vn(bp + vec2(0.0, 0.09)) - 1.0) + 0.5 * abs(2.0 * vn((bp + vec2(0.0, 0.09)) * 2.3 + 5.0) - 1.0);
        vec3 N = normalize(N0 + bfade * 0.22 * (1.0 - 0.6 * N0.y * N0.y) * vec3(b0 - bx, 0.0, b0 - bz) * 4.0);
        float n1 = fbm(vP.xz * 0.011), n2v = fbm(vP.xz * 0.07 + 3.0), n3 = vn(vP.xz * 0.45);
        float steep = 1.0 - smoothstep(0.70, 0.89, N0.y);
        // bare clay: vertical fluting on steep faces, faint strata everywhere
        vec2 hn = abs(N.xz) / max(abs(N.x) + abs(N.z), 1e-3);
        float fwP = max(fwidth(vP.x), fwidth(vP.z));
        float fwY = fwidth(vP.y) * 1.6, fwSx = max(fwidth(vP.z), fwY), fwSz = max(fwidth(vP.x), fwY);   // footprints of the terrace grids on slopes
        float ffade = 1.0 - smoothstep(0.08, 0.3, fwP * 0.19);
        float fl = mix(0.5, tri(vP.x * 0.19 + 2.0 * vn(vP.xz * 0.05)) * hn.y + tri(vP.z * 0.19 + 2.0 * vn(vP.zx * 0.05 + 4.0)) * hn.x, ffade);
        float fl2 = mix(0.5, tri(vP.x * 0.61 + n3) * hn.y + tri(vP.z * 0.61 + n3) * hn.x, ffade * ffade);
        float strata = 0.5 + 0.5 * sin(vP.y * 0.55 + n1 * 9.0);
        vec3 clay = mix(uPale, vec3(0.80, 0.70, 0.56), 0.35) * (0.78 + 0.34 * fl + 0.10 * fl2) * (0.92 + 0.10 * strata);
        clay = mix(clay, uBrick * 1.1, 0.16 * smoothstep(0.45, 0.8, n1) + 0.08 * strata);
        vec3 earth = mix(uPale * 0.9, uBrick, 0.26 + 0.34 * n1) * (0.66 + 0.26 * n2v) * (0.9 + 0.1 * b0);
        earth *= 0.86 + 0.28 * fl * (1.0 - smoothstep(0.75, 0.95, N0.y)) * (1.0 - flatTop);
        vec3 alb = mix(earth, clay, steep);
        // erosion big enough to read from across the bowl: irregular flutes run down every bare slope, dark in the rill
        // and pale on the crest, the creases of the ground between them are dark, and strata band every 6 m of height
        float slopeK = (1.0 - smoothstep(0.80, 0.97, N0.y)) * (1.0 - flatTop) * (1.0 - 0.7 * clamp(dens * 2.0, 0.0, 1.0));
        float fadeA = 1.0 - smoothstep(1.6, 4.6, fwP), fadeB = 1.0 - smoothstep(5.0, 15.0, fwP);
        float rillA = 0.0, crestA = 0.0, rillC = 0.0;
        if (slopeK * fadeA > 0.004) {
          vec2 gd = N0.xz / max(length(N0.xz), 1e-3);
          vec4 wq = vec4(gd.x, gd.y, (gd.x + gd.y) * 0.7071, (gd.x - gd.y) * 0.7071); wq *= wq; wq *= wq; wq *= wq; wq *= wq;
          float fw = 0.9 * vn(vP.xz * 0.021 + 5.0) + 0.5 * n2v;
          float r = (wq.x * flute(vP.xz, vec2(1.0, 0.0), fw) + wq.y * flute(vP.xz, vec2(0.0, 1.0), fw) + wq.z * flute(vP.xz, vec2(0.7071, 0.7071), fw) + wq.w * flute(vP.xz, vec2(0.7071, -0.7071), fw)) / max(wq.x + wq.y + wq.z + wq.w, 1e-3);
          rillA = smoothstep(0.76, 0.97, r) * fadeA; crestA = (1.0 - smoothstep(0.0, 0.4, r)) * fadeA;
          float fadeC = 1.0 - smoothstep(0.8, 2.6, fwP);                                // a finer set between them, for the slopes the cabin passes
          if (fadeC > 0.004) {
            vec2 x2 = vP.xz * 2.9 + 31.0; float fw2 = fw * 1.7 + 0.4 * n3;
            float r2 = (wq.x * flute(x2, vec2(1.0, 0.0), fw2) + wq.y * flute(x2, vec2(0.0, 1.0), fw2) + wq.z * flute(x2, vec2(0.7071, 0.7071), fw2) + wq.w * flute(x2, vec2(0.7071, -0.7071), fw2)) / max(wq.x + wq.y + wq.z + wq.w, 1e-3);
            rillC = smoothstep(0.58, 0.95, r2) * fadeC;
          }
        }
        float crease = (1.0 - smoothstep(0.02, 0.34, b0)) * fadeB;
        alb *= 1.0 - slopeK * (0.25 * rillA + 0.15 * crease + 0.09 * rillC - 0.07 * crestA);
        alb = mix(alb, alb * vec3(0.80, 0.62, 0.52), slopeK * 0.36 * max(rillA, 0.6 * crease));
        float fy = fwidth(vP.y), st6 = smoothstep(0.30, 0.70, tri(vP.y / 6.0 + 0.9 * n1)) * (1.0 - smoothstep(1.0, 3.0, fy));
        alb *= 1.0 + slopeK * 0.16 * (st6 - 0.45);
        alb = mix(alb, uBrick * 0.95, slopeK * 0.10 * st6);
        // wet season: the clay is dark and red with rain, with a flush of new grass on the gentler ground
        alb = mix(alb, alb * vec3(0.74, 0.58, 0.50), uWet * 0.6 * (1.0 - flatTop));
        alb = mix(alb, vec3(0.20, 0.30, 0.11) * (0.8 + 0.4 * n2v), uWet * 0.42 * (1.0 - flatTop) * (1.0 - steep) * smoothstep(0.42, 0.62, n1));
        // gullies: darker, a breath of eucalyptus green; terraces on gentler far slopes
        float gul = (1.0 - ao) * (1.0 - steep);
        gul *= 0.5 + 1.0 * vn(vP.xz * 0.075 + 21.0);
        alb = mix(alb, vec3(0.215, 0.21, 0.125), clamp(gul * 1.5, 0.0, 0.26));
        { vec2 tg = vP.xz / 6.5; vec2 tid = floor(tg); vec2 tf = fract(tg) - 0.5 - (h22(tid + 1.3) - 0.5) * 0.6;       // eucalyptus crowns gather in the gullies
          float crown = step(h21(tid + 3.0), 0.7) * (1.0 - smoothstep(0.24, 0.36 + fwP / 6.5, length(tf))) * (1.0 - smoothstep(1.2, 4.5, fwP));
          alb = mix(alb, vec3(0.085, 0.14, 0.085) * (0.7 + 0.6 * h21(tid + 8.0)), crown * clamp(gul * 2.6 - 0.25, 0.0, 0.9)); }
        float terr = smoothstep(0.66 - 0.22 * uWet, 0.84 - 0.2 * uWet, vn(vP.xz * 0.0045 + 11.0)) * (1.0 - steep) * uGreen * (1.0 - flatTop) * smoothstep(900.0 - 420.0 * uWet, 1700.0 - 600.0 * uWet, vP.x);
        alb = mix(alb, vec3(0.22, 0.33, 0.13) * (0.8 + 0.4 * step(0.5, fract(vP.y * 0.16))), terr * (0.7 + 0.2 * uWet) * (1.0 - dens * (1.0 - 0.5 * uWet)));
        // plateau top: pale dust with wheel-worn lots
        vec3 dust = mix(uPale, vec3(0.62, 0.52, 0.40), 0.45) * (0.80 + 0.22 * n2v);
        // trodden earth, damp patches, wheel ruts and a scatter of litter where the market stands
        float dfade = flatTop * (1.0 - smoothstep(0.05, 0.3, fwP));
        dust *= 1.0 - dfade * (0.16 * (1.0 - n3) + 0.2 * smoothstep(0.52, 0.8, fbm(vP.xz * 0.23 + 7.0)));
        dust *= 1.0 - 0.12 * dfade * smoothstep(0.75, 0.95, tri(vP.z * 0.42 + 1.5 * vn(vP.xz * 0.11)));
        vec2 lc = floor(vP.xz * 4.0); float lh = h21(lc);
        dust = mix(dust, 0.5 + 0.4 * cos(6.2832 * (lh * 37.0 + vec3(0.0, 0.33, 0.67))), step(0.988, lh) * dfade * (1.0 - smoothstep(0.02, 0.08, fwP)) * 0.8);
        alb = mix(alb, dust, flatTop);
        // the ledge pitch
        vec2 pq = (vP.xz - uPitch.xy) / uPitch.zw;
        float inP = step(abs(pq.x), 1.0) * step(abs(pq.y), 1.0);
        float pwr = max(fwidth(pq.x), fwidth(pq.y)), pw = min(pwr * 1.2, 0.028) + 0.009;     // chalk lines keep their width at a glancing angle and fade instead
        float lines = max(max(1.0 - smoothstep(0.0, pw, abs(abs(pq.x) - 0.94)), 1.0 - smoothstep(0.0, pw * 1.6, abs(abs(pq.y) - 0.9))),
                          max(1.0 - smoothstep(0.0, pw, abs(pq.x)), 1.0 - smoothstep(0.0, pw * 2.0, abs(length(pq * vec2(1.0, 0.62)) - 0.2))));
        // the goal areas: a chalk box at each end
        float boxL = max(1.0 - smoothstep(0.0, pw, abs(abs(pq.x) - 0.70)), 1.0 - smoothstep(0.0, pw * 1.6, abs(abs(pq.y) - 0.42))) * step(0.70 - pw, abs(pq.x)) * step(abs(pq.y), 0.42 + pw * 1.6);
        lines = max(lines, boxL);
        lines *= step(abs(pq.x), 0.95) * step(abs(pq.y), 0.92) * clamp(0.035 / max(pwr, 1e-4), 0.3, 1.0);
        vec2 pc = floor((pq * 0.5 + 0.5) * vec2(5.0, 3.0));
        vec2 pf = fract((pq * 0.5 + 0.5) * vec2(5.0, 3.0)) - 0.5 - 0.3 * vec2(sin(uTime * 0.9 + pc.x * 2.1 + pc.y), cos(uTime * 0.7 + pc.y * 3.3 + pc.x));
        float dot14 = (1.0 - smoothstep(0.05, 0.09, length(pf * vec2(1.0, 0.7)))) * step(h21(pc + 2.0), 0.94);
        vec3 pitchCol = vec3(0.33, 0.205, 0.105) * (0.86 + 0.2 * n3 + 0.16 * (n2v - 0.5));
        pitchCol = mix(pitchCol, vec3(0.44, 0.31, 0.18), 0.6 * max(1.0 - smoothstep(0.0, 0.34, length((abs(pq) - vec2(0.84, 0.0)) * vec2(1.0, 0.7))), 0.7 * (1.0 - smoothstep(0.0, 0.3, length(pq * vec2(1.0, 0.62))))));   // worn pale where the play is
        pitchCol = mix(pitchCol, vec3(0.16, 0.20, 0.08), 0.5 * smoothstep(0.5, 0.75, vn(vP.xz * 0.5 + 9.0)) * smoothstep(0.55, 0.9, max(abs(pq.x), abs(pq.y))));          // weeds at the edges
        pitchCol = mix(pitchCol, vec3(0.80, 0.78, 0.72), lines * (0.62 + 0.3 * n3));
        pitchCol = mix(pitchCol, mix(vec3(0.7, 0.1, 0.1), vec3(0.1, 0.15, 0.6), step(0.5, h21(pc))), dot14 * uDots);
        // close to the eye the clay has grain: pebbles, stones, rills, trodden footpaths and specks of ichu
        float nearD = (1.0 - smoothstep(0.1, 0.5, fwP)) * (1.0 - flatTop);
        if (nearD > 0.001) {
          float g1 = vn(vP.xz * 2.3), g2 = vn(vP.xz * 7.1 + 3.0);
          alb *= 1.0 + nearD * (0.26 * (g1 - 0.5) + 0.18 * (g2 - 0.5));
          float rill = smoothstep(0.78, 0.97, tri(dot(vP.xz, vec2(0.13, 0.29)) + 1.8 * vn(vP.xz * 0.13) + vP.y * 0.23));
          alb *= 1.0 - 0.32 * rill * nearD;
          vec2 sc = floor(vP.xz * 1.6); vec2 sf = fract(vP.xz * 1.6) - 0.5 - (h22(sc) - 0.5) * 0.6; float sh2 = h21(sc + 5.0);
          float stone = step(sh2, 0.24) * (1.0 - smoothstep(0.10, 0.16 + fwP, length(sf) / (0.5 + sh2 * 2.5)));
          alb = mix(alb, vec3(0.40, 0.37, 0.33) * (0.6 + 2.2 * sh2), stone * nearD);
          float path = 1.0 - smoothstep(0.012, 0.035 + fwP * 0.05, abs(vn(vP.xz * 0.07 + 20.0) - 0.5));
          alb = mix(alb, uPale * 0.98, 0.55 * path * nearD * (1.0 - steep));
          vec2 ic = floor(vP.xz * 0.9); vec2 jf = fract(vP.xz * 0.9) - 0.5 - (h22(ic + 7.0) - 0.5) * 0.7;
          float ichu = step(h21(ic + 9.0), 0.34) * (1.0 - smoothstep(0.10, 0.2 + fwP, length(jf)));
          alb = mix(alb, mix(vec3(0.50, 0.42, 0.20), vec3(0.22, 0.30, 0.10), uGreen * 0.6) * (0.7 + 0.6 * g2), ichu * nearD * 0.85 * (1.0 - path));
        }
        alb = mix(alb, pitchCol, inP);

        float cloud = cloudShade(vP.xz) * rimShade(vP) * cabShade(vP) * hmShade(vP, vec3(0.0, 1.0, 0.0));
        if (vP.x > 950.0 && vP.x < 2400.0 && abs(vP.z - 120.0) < 900.0) cloud *= towerShade(vP, fwP);
        float sunT = max(dot(N, uSunDir), 0.0) * shade * cloud;
        float unlit = (1.0 - clamp(dot(N, uSunDir) * 4.0, 0.0, 1.0) * shade * cloud) * (1.0 - uNight);    // ground the sun does not reach takes the whole blue sky: a shadow is blue, not black
        vec3 light = uSunCol * sunT + uSkyCol * (0.5 + 0.5 * N.y) * ao * (1.0 + 0.9 * unlit) + uBrick * 0.10 * uFarK.z * (1.0 - 0.6 * N.y) * (0.35 + 0.65 * shade);
        light += uSunCol * vec3(0.10, 0.075, 0.055) * uFarK.z * (1.0 - shade * cloud) * (1.0 - uNight);       // sunlit clay across the gully throws a little warmth into the shade
        if (uNight > 0.5 && vP.x > 80.0 && vP.x < 350.0 && abs(vP.z) < 50.0) light += lampPool(vP) * 2.0;
        vec3 col = alb * light;
        gPd = district(vP.xz);

        // the city: real boxes found along the eye ray (see rcCity). Houses on the 9 m lattice near; rows, blocks and
        // whole blocks (18, 36, 72 m) as a house falls under about eight pixels, each pitch fading into the next, so the far
        // wall still shows lit roofs, a lit and a shaded wall and the shadow beside them at 3 km.
        if (dens > 0.004) {
          float sunK = shade * cloud;
          vec3 fill = uSunCol * vec3(0.10, 0.075, 0.055) * uFarK.z * sunK * (1.0 - uNight);
          vec3 gLit = alb * light * 0.9, gSh = alb * (light - uSunCol * sunT + fill) * 0.9;        // the ground between the houses, in the sun and in a house's shadow
          vec3 topLight = uSunCol * (uSunDir.y * sunK) + uSkyCol;
          vec3 dAvg = districtPaint(gPd.y, clamp(vn(vP.xz * 0.011 + 3.0) * 1.3 - 0.15, 0.0, 0.99));
          vec3 avgRoof = mix(mix(vec3(0.38, 0.36, 0.35), uBrick * 0.9, 0.55), dAvg * 0.8, 0.3 * gPd.x) * topLight;
          vec3 city = mix(gLit * 0.8, avgRoof * 0.9, 0.75);
          vec3 rd = (vP - uCam) / max(camD, 1.0);
          vec2 grad = -N0.xz / max(N0.y, 0.45);
          float dh = rd.y - dot(grad, rd.xz), sdh = uSunDir.y - dot(grad, uSunDir.xz);
          vec2 W0 = rcWarp(vP.xz);
          float px = camD * uPxK;
          if (dh < -0.012) {
            vec2 Wx = (rcWarp(vP.xz + vec2(6.0, 0.0)) - W0) / 6.0, Wz = (rcWarp(vP.xz + vec2(0.0, 6.0)) - W0) / 6.0;
            mat2 J = mat2(Wx, Wz); float det = J[0].x * J[1].y - J[1].x * J[0].y; det = abs(det) < 0.2 ? 0.2 : det;
            mat2 Ji = mat2(J[1].y, -J[0].y, -J[1].x, J[0].x) * (1.0 / det);
            vec2 gr = vec2(dot(Ji[0], grad), dot(Ji[1], grad));                    // the ground's gradient in the lattice
            vec2 dg = J * rd.xz, dsn = J * uSunDir.xz;
            gG0 = W0; gUv0 = (vP.xz - uBSRect.xy) * uBSRect.zw; gUvM = mat2(Ji[0] * uBSRect.zw, Ji[1] * uBSRect.zw);
            float lv = clamp(log2(max(px * 8.0, 9.0) / 9.0), 0.0, 3.0), l0 = min(floor(lv), 2.0), kb = smoothstep(RC_BAND, 1.0, lv - l0);
            float c0 = 9.0 * exp2(l0), hk0 = exp2(0.6 * l0);
            vec3 rc = rcCity(c0, hk0, dg, dh, gr, dsn, sdh, J, gLit, gSh, sunK, px);
            if (kb > 0.004) rc = mix(rc, rcCity(2.0 * c0, hk0 * 1.5157, dg, dh, gr, dsn, sdh, J, gLit, gSh, sunK, px), kb);
            city = mix(city, rc, smoothstep(0.012, 0.035, -dh) * (1.0 - smoothstep(24.0, 40.0, px)));
          }
          // by night the streets are lines of sodium light and each house a lamp; by day a window or a windscreen catches
          // the sun and lets it go again: points on the 9 m and 36 m lattices that hold a pixel
          {
            float full = clamp(dens * 2.5, 0.0, 1.0);
            vec2 g72 = abs(mod(W0 + 36.0, 72.0) - 36.0), g288 = abs(mod(W0 + 144.0, 288.0) - 144.0);
            float aw = 0.55 * fwP + 1e-3, hwA = max(7.0, 0.85 * fwP), hwS = max(3.5, 0.5 * fwP);
            float ave = 1.0 - smoothstep(hwA - aw, hwA + aw, min(g288.x, g288.y)), st = (1.0 - smoothstep(hwS - aw, hwS + aw, min(g72.x, g72.y))) * (1.0 - smoothstep(0.30, 0.75, fwP / 72.0));
            city += uNight * vec3(0.90, 0.55, 0.20) * (ave * 0.24 + st * 0.08) * full * (1.0 - 0.6 * smoothstep(1500.0, 2600.0, camD));
            float k9 = 1.0 - smoothstep(0.12, 0.30, fwP / 9.0), k36 = (1.0 - smoothstep(0.30, 0.80, fwP / 36.0)) * (1.0 - k9);
            vec2 c9 = floor(W0 / 9.0), q9 = fract(W0 / 9.0) - 0.29; float h9 = h21(c9 + 11.0), r9 = max(0.07, 0.7 * fwP / 9.0);
            float on9 = step(h21(c9 + 9.0), min(0.88, dens * 1.45)) * (1.0 - smoothstep(r9 * 0.55, r9, length(q9))) * k9;
            vec2 c36 = floor(W0 / 36.0), q36 = fract(W0 / 36.0) - 0.5 - (h22(c36 + 4.4) - 0.5) * 0.5; float hb = h21(c36 + 2.0), r36 = max(0.045, 0.75 * fwP / 36.0);
            float on36 = step(h21(c36 + 36.0), min(0.88, dens * 1.45)) * (1.0 - smoothstep(r36 * 0.55, r36, length(q36))) * k36;
            vec3 l9 = mix(vec3(1.0, 0.60, 0.22), vec3(0.82, 0.90, 1.0), step(0.64, h21(c9 + 17.0))), l36 = mix(vec3(1.0, 0.60, 0.22), vec3(0.82, 0.90, 1.0), step(0.64, h21(c36 + 17.0)));
            city += uNight * (l9 * on9 * 2.8 * (0.75 + 0.25 * sin(uTime * 1.7 + h9 * 50.0)) * step(0.35 + 0.5 * smoothstep(1.5, 5.0, fwP), h21(c9 + 23.0))
                            + l36 * on36 * step(0.3, hb) * (1.3 + 1.9 * hb) * (0.8 + 0.2 * sin(uTime * 1.3 + hb * 40.0)));
            float sp9 = max(sin(uTime * (0.9 + 1.6 * fract(h9 * 13.0)) + h9 * 97.0), 0.0), sp36 = max(sin(uTime * (0.9 + 1.6 * fract(hb * 13.0)) + hb * 97.0), 0.0);
            sp9 *= sp9; sp9 *= sp9; sp9 *= sp9; sp9 *= sp9; sp36 *= sp36; sp36 *= sp36; sp36 *= sp36; sp36 *= sp36;
            city += uSunCol * (1.0 - uNight) * sunK * (on9 * step(0.90, h9) * 2.2 * sp9 + on36 * step(0.80, hb) * 1.6 * sp36);
          }
          col = mix(col, city, smoothstep(0.004, 0.05, dens));
        }
        if (vP.x > 850.0) {
          vec3 lmLight = uSunCol * uSunDir.y * shade * cloud + uSkyCol;
          col = landmark(col, vP.xz, uLm[0], fwP, lmLight); col = landmark(col, vP.xz, uLm[1], fwP, lmLight);
          col = landmark(col, vP.xz, uLm[2], fwP, lmLight); col = landmark(col, vP.xz, uLm[3], fwP, lmLight);
          col = landmark(col, vP.xz, uLm[4], fwP, lmLight); col = landmark(col, vP.xz, uLm[5], fwP, lmLight);
          col = landmark(col, vP.xz, uLm[6], fwP, lmLight); col = landmark(col, vP.xz, uLm[7], fwP, lmLight);
        }
        col = bowlAir(col, vP);
        col = mix(col, uHaze * 1.25 * (uSunCol * 0.55 + uSkyCol * 1.4), seaVeil(vP.y) * 0.9);
        gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
        #include <fog_fragment>
      }`})}function ue(){const s=[],i=[],l=[],A=[],S=(F,w,N)=>{const f=s.length/3;for(const z of F)s.push(z[0],z[1],z[2]),i.push(w[0],w[1],w[2]),l.push(N);A.push(f,f+1,f+2,f,f+2,f+3)};S([[-.5,1,.5],[.5,1,.5],[.5,1,-.5],[-.5,1,-.5]],[0,1,0],0),S([[.5,0,.5],[.5,0,-.5],[.5,1,-.5],[.5,1,.5]],[1,0,0],1),S([[-.5,0,.5],[.5,0,.5],[.5,1,.5],[-.5,1,.5]],[0,0,1],2),S([[-.5,0,.5],[-.5,1,.5],[.5,1,-.5],[.5,0,-.5]],[0,1,0],3);const r=new t.InstancedBufferGeometry;return r.setAttribute("position",new t.Float32BufferAttribute(s,3)),r.setAttribute("normal",new t.Float32BufferAttribute(i,3)),r.setAttribute("aFace",new t.Float32BufferAttribute(l,1)),r.setIndex(A),r}const ve=L0+`
  uniform vec3 uSunDir; uniform vec3 uCam; uniform float uFarGrow;
  attribute float aFace; attribute vec3 iPos; attribute vec3 iSize0; attribute vec4 iRotGrad; attribute vec3 iCol; attribute vec4 iMisc;
  varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying vec4 vMisc; varying vec3 vUv; varying vec3 vSize; varying float vFace; varying vec2 vSunL;
  void main(){
    float c = iRotGrad.x, s = iRotGrad.y; vec2 grad = iRotGrad.zw;
    // across the bowl a house is a pixel or two: there half the blocks go and the rest stand half as large again, so the far city reads as blocks
    float grow = uFarGrow * smoothstep(750.0, 1250.0, max(iPos.x, abs(iPos.z) * 0.9));
    vec3 iSize = iSize0 * vec3(1.0 + 0.55 * grow, 1.0 + 0.3 * grow, 1.0 + 0.55 * grow) * (1.0 - grow * step(0.5, fract(iMisc.x * 17.31)));
    vSunL = vec2(c * uSunDir.x - s * uSunDir.z, s * uSunDir.x + c * uSunDir.z);
    vec3 p = position, n = normal; vec3 L; vec3 uv = vec3(0.0);
    float sink = (abs(grad.x) + abs(grad.y)) * max(iSize.x, iSize.z) * 0.5 + 0.6;
    if (aFace < 2.5) {
      vec3 dc = uCam - iPos; vec2 dl = vec2(c * dc.x - s * dc.z, s * dc.x + c * dc.z);
      float mx = dl.x < 0.0 ? -1.0 : 1.0, mz = dl.y < 0.0 ? -1.0 : 1.0;
      p.x *= mx; p.z *= mz; n.x *= mx; n.z *= mz;
      float rise = iMisc.y < 0.5 ? (0.25 + 0.55 * step(0.0, p.x)) * p.y : 0.0;
      L = vec3(p.x * iSize.x, p.y * (iSize.y + sink) - sink + rise, p.z * iSize.z);
      if (aFace < 0.5) { uv = vec3(L.x, L.z, 0.0); if (iMisc.y < 0.5) n = normalize(vec3(-0.55 / max(iSize.x, 1.0), 1.0, 0.0)); }
      else if (aFace < 1.5) uv = vec3(L.z + iSize.z * 0.5 + mx * 3.7, iSize.y - L.y + rise, L.y);
      else uv = vec3(L.x + iSize.x * 0.5 + mz * 9.1 + 17.0, iSize.y - L.y + rise, L.y);
    } else {
      // at a low sun the sweep would leave the slope as a slab in the air: it shrinks away (the long shadows of those
      // hours come from the rim shade and the height map), and it never reaches further than 5 m
      vec2 sl = vSunL; float lowSun = smoothstep(0.25, 0.5, uSunDir.y);
      vec2 o = -sl / max(uSunDir.y, 0.55) * (iSize.y + 0.5) * lowSun;
      o *= min(1.0, 5.0 / max(length(o), 1e-3)) * (1.0 - smoothstep(0.55, 0.95, length(grad)));   // on ground steeper than about 35 degrees the sweep would stand off the slope as a dark slab: there the house keeps its shadow under itself
      p.x *= o.x < 0.0 ? -1.0 : 1.0; p.z *= o.y < 0.0 ? -1.0 : 1.0;
      vec2 xz = p.xz * iSize.xz + o * p.y;
      vec2 wxz = vec2(c * xz.x + s * xz.y, -s * xz.x + c * xz.y);
      L = vec3(xz.x, dot(grad, wxz) + 0.28 + 0.15 * length(grad) * length(xz) + 0.0007 * length(uCam - iPos), xz.y);
    }
    vec3 W = iPos + vec3(c * L.x + s * L.z, L.y, -s * L.x + c * L.z);
    vN = vec3(c * n.x + s * n.z, n.y, -s * n.x + c * n.z);
    vP = W; vCol = iCol; vMisc = iMisc; vUv = uv; vSize = iSize; vFace = aFace;
    vec4 mvPosition = modelViewMatrix * vec4(W, 1.0); gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Pe=D0+A0+`
  uniform vec3 uBrick; uniform vec3 uPale;
  varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying vec4 vMisc; varying vec3 vUv; varying vec3 vSize; varying float vFace; varying vec2 vSunL;
  void main(){
    float seed = vMisc.x, roofType = vMisc.y, shade = vMisc.z;
    float cloud = cloudShade(vP.xz) * rimShade(vP) * cabShade(vP);
    vec2 dU = fwidth(vUv.xy);
    vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
    vec3 col;
    vec3 lampC = mix(vec3(1.0, 0.62, 0.26), vec3(0.85, 0.92, 1.0), step(0.62, fract(seed * 7.7)));
    if (vFace > 2.5) {
      // hard blue-black shadow thrown on the clay
      vec3 earth = mix(uPale, uBrick, 0.42) * 0.80;
      col = earth * (uSkyCol * 0.9 + uBrick * 0.03);
    } else if (vFace > 0.5) {
      vec2 uv = vUv.xy;
      float bay = 3.1 + fract(seed * 7.3) * 0.7;
      vec2 g = vec2(uv.x / bay, uv.y / 2.7);
      float lod = 1.0 - smoothstep(0.12, 0.45, max(dU.x / bay, dU.y / 2.7));
      vec2 id = floor(g), f = fract(g);
      float painted = step(0.5, vMisc.w);
      vec3 brick = vCol * (0.86 + 0.26 * vn(uv * vec2(1.3, 4.0) + seed * 40.0));
      float course = 0.93 + 0.07 * step(0.5, fract(uv.y * 5.5));
      brick *= mix(1.0, course, lod * (1.0 - painted));
      vec3 conc = vec3(0.50, 0.49, 0.47) * (0.85 + 0.2 * vn(uv * 2.0 + seed));
      float frame = max(step(f.y, 0.11), step(0.455, abs(f.x - 0.5)));
      float hw = h21(id + seed * 91.0);
      float wxh = 0.2 + 0.08 * fract(hw * 9.0), wqx = abs(f.x - 0.5) / wxh, wqy = (f.y - 0.36) / 0.38;
      float win = step(0.3, hw) * step(wqx, 1.0) * step(0.0, wqy) * step(wqy, 1.0);
      // near the eye a window has a pale frame with a mullion and a concrete sill under it (f.y runs down the wall)
      float fineW = 1.0 - smoothstep(0.035, 0.10, max(dU.x, dU.y));
      float wfr = win * max(max(step(0.84, wqx), step(wqx, 0.07)), max(step(0.9, wqy), step(wqy, 0.1))) * fineW;
      float sill = step(0.3, hw) * step(wqx, 1.22) * step(abs(wqy - 1.1), 0.1) * fineW;
      float open = step(0.82, hw);                               // unglazed black hole
      vec3 V = normalize(uCam - vP + vec3(0.0, 1e-3, 0.0));
      vec3 R = reflect(-V, N);
      vec3 glass = mix(vec3(0.03, 0.04, 0.06), uSkyCol * 1.6 + vec3(0.05), (1.0 - open) * smoothstep(-0.2, 0.6, R.y) * 0.8);
      vec3 curtain = mix(vec3(0.75, 0.7, 0.6), vec3(0.2, 0.45, 0.6), fract(hw * 23.0));
      glass = mix(glass, curtain * 0.5, step(0.62, fract(hw * 5.0)) * (1.0 - open) * step(0.55, f.y));
      vec3 wall = mix(brick, conc, frame * (1.0 - 0.75 * painted));
      wall = mix(wall, conc * 1.2, sill);
      wall = mix(wall, vec3(0.66, 0.64, 0.58) * (0.55 + 0.45 * fract(hw * 3.0)), wfr);
      vec3 detail = wall;
      float sunT = max(dot(N, uSunDir), 0.0) * shade * cloud;
      vec3 light = uSunCol * min(sunT * 1.9, 1.0) + uSkyCol * 0.55 + vec3(0.34, 0.25, 0.17) * uFarK.z * (0.3 + 0.7 * shade) * (0.3 + 0.7 * cloud) * (1.0 - 0.75 * uNight) * (1.0 - 0.5 * smoothstep(0.0, 8.0, vUv.z));
      detail = detail * light;
      vec3 glassL = glass * (0.5 + sunT) + uSunCol * 5.0 * pow(max(dot(R, uSunDir), 0.0), 240.0) * (1.0 - open) * shade;
      detail = mix(detail, glassL, win * (1.0 - wfr));
      vec3 flatC = mix(brick, conc, 0.24 * (1.0 - 0.75 * painted)) * light * 0.93;
      col = mix(flatC, detail, lod);
      // grime under the roof line, damp at the foot
      float streak = vn(vec2(uv.x * 1.7 + seed * 13.0, 0.5)) * (1.0 - smoothstep(0.0, 1.8, uv.y));
      col *= 1.0 - 0.28 * streak;
      col *= 0.62 + 0.38 * smoothstep(-0.4, 1.6, vUv.z);
      float litW = step(0.52, fract(hw * 37.0)) * (0.7 + 0.3 * sin(uTime * 0.9 + hw * 60.0));
      vec2 lq = vec2(mod(uv.x + seed * 9.0, 9.0) - 4.5, uv.y - 1.6) / max(0.6, 0.8 * max(dU.x, dU.y));
      float farLamp = (1.0 - smoothstep(0.5, 1.0, length(lq))) * step(0.45, fract(seed * 13.7));
      col += uNight * lampC * (win * (1.0 - wfr) * litW * lod * 3.2 * (1.0 - open) + (1.0 - lod) * farLamp * 2.4);
    } else {
      vec2 uv = vUv.xy; vec2 hs = vSize.xz * 0.5;
      float px = max(max(dU.x, dU.y), 1e-4);
      float lod = 1.0 - smoothstep(0.10, 0.5, px), fine = 1.0 - smoothstep(0.035, 0.16, px);
      float edge = min(hs.x - abs(uv.x), hs.y - abs(uv.y));
      vec2 sl = vSunL / max(uSunDir.y, 0.35);                         // roof-space reach of a shadow per metre of height
      vec3 alb; float gl = 0.0, shd = 1.0, twk = 0.0;
      if (roofType < 0.5) {
        // tin sheets weighted with stones and old tyres: rust in soft stains that gather along the laps, each sheet
        // only a touch lighter or darker than the next
        vec2 sg = vec2(uv.x / 2.4, uv.y / 0.95) + seed * 31.0; vec2 sf = fract(sg);
        float hsht = h21(floor(sg));
        float rustN = 0.55 * vn(uv * 0.45 + seed * 5.0) + 0.3 * vn(uv * 1.7 + seed * 11.0) + 0.15 * vn(uv * 6.0);
        float rust = max(0.85 * step(0.70, fract(hsht * 7.31 + seed * 3.1)), 0.8 * smoothstep(0.58, 0.84, rustN + 0.10 * (hsht - 0.5)));   // about three sheets in ten have rusted through
        rust = max(rust, 0.5 * fine * (1.0 - smoothstep(0.0, 0.1, min(sf.y, 1.0 - sf.y))) * smoothstep(0.35, 0.6, rustN));
        vec3 tin = vec3(0.44, 0.46, 0.50);
        float rc = fract(seed * 23.7);
        vec3 tinP = rc < 0.1 ? vec3(0.42, 0.10, 0.06) : (rc < 0.2 ? vec3(0.07, 0.27, 0.16) : vec3(0.08, 0.18, 0.44));
        tin = mix(tin, tinP * (0.85 + 0.3 * hsht), step(rc, 0.3) * 0.8);
        tin = mix(tin, vCol * 0.8, step(0.5, vMisc.w) * step(0.5, fract(seed * 31.3)) * 0.7);
        tin *= (0.78 + 0.44 * hsht) * (1.0 + 0.08 * vec3(hsht - 0.5, 0.0, 0.5 - hsht));
        tin = mix(tin, vec3(0.38, 0.20, 0.11) * (0.8 + 0.5 * vn(uv * 3.0 + seed)), rust);
        float corr = 0.84 + 0.16 * sin(uv.y * 26.0);
        float lap = clamp(0.6 * (1.0 - smoothstep(0.0, 0.05, sf.y)) + (1.0 - smoothstep(0.0, 0.016, sf.x)), 0.0, 1.0);
        alb = tin * mix(1.0, corr, lod * (1.0 - smoothstep(0.02, 0.09, px))) * (1.0 - 0.42 * lap * fine);
        vec2 nq = vec2((fract(uv.x / 0.8) - 0.5) * 3.4, fract(uv.y / 0.2375) - 0.5);           // nail heads along the laps
        alb *= 1.0 - 0.5 * (1.0 - smoothstep(0.012, 0.045, px)) * (1.0 - smoothstep(0.05, 0.09, length(nq)));
        vec2 sgr = uv / 1.5 + seed * 17.0; vec2 sid = floor(sgr); vec2 sc0 = (h22(sid) - 0.5) * 0.5;
        vec2 sfr = fract(sgr) - 0.5 - sc0;
        float hr = h21(sid + 4.0); float rr = length(sfr) * 1.5, rs = length(sfr + sl * 0.12) * 1.5;
        float stone = step(hr, 0.34) * (1.0 - smoothstep(0.16, 0.2, rr));
        float tyre = step(0.34, hr) * step(hr, 0.44) * (1.0 - smoothstep(0.30, 0.34, rr)) * smoothstep(0.15, 0.19, rr);
        shd *= 1.0 - 0.8 * lod * step(hr, 0.44) * (1.0 - smoothstep(0.15, 0.24 + 0.14 * step(0.34, hr), rs));
        alb = mix(alb, vec3(0.36, 0.32, 0.28) * (0.75 + 0.6 * fract(hr * 31.0)), stone * lod);
        alb = mix(alb, vec3(0.03) + 0.03 * smoothstep(0.2, 0.3, rr), tyre * lod);
        alb *= 1.0 - 0.10 * (1.0 - lod);
        gl = step(0.45, hsht) * step(fract(seed * 11.7), 0.5) * (1.0 - rust);
        // six tin roofs in ten have a spot that catches the sun and lets it go again: the bowl twinkles
        vec2 tq = uv - (vec2(fract(seed * 5.3), fract(seed * 9.1)) - 0.5) * max(vSize.xz - 1.5, vec2(0.5));
        float trad = max(0.2, 1.1 * px);
        twk = step(fract(seed * 11.7), 0.6) * (1.0 - smoothstep(trad * 0.5, trad, length(tq))) * pow(max(sin(uTime * (1.0 + 2.0 * fract(seed * 7.3)) + seed * 90.0), 0.0), 20.0) * min(1.0, 0.2 / max(px, 0.02) + 0.35);
      } else {
        // concrete slab with a brick parapet, a water tank, washing on a line, rebar where it is unfinished
        vec3 slab = mix(vec3(0.34, 0.32, 0.30), vCol * 0.62, 0.4 * step(0.5, vMisc.w)) * (0.82 + 0.25 * vn(uv * 0.8 + seed * 9.0));
        slab *= 1.0 - 0.2 * fine * smoothstep(0.5, 0.72, vn(uv * 2.3 + seed * 3.0));                      // stains and patches
        slab *= 1.0 - 0.18 * fine * step(0.93, fract(uv.x / 2.7 + seed)) ;                                // pour joints
        float hasPar = step(roofType, 1.5);
        float par = 1.0 - smoothstep(0.28, 0.34, edge);
        alb = mix(slab, vCol * 0.95 * (0.9 + 0.2 * step(0.5, fract((uv.x + uv.y) * 2.2)) * fine), par * hasPar);
        alb *= 1.0 - 0.45 * hasPar * lod * (1.0 - smoothstep(0.0, 0.07 + px, abs(edge - 0.33)));          // the dark inner face of the parapet
        // the parapet's shade on the slab along the two sides toward the sun
        vec2 din = (hs - 0.33) - uv * vec2(sl.x < 0.0 ? -1.0 : 1.0, sl.y < 0.0 ? -1.0 : 1.0);
        vec2 reach = 0.6 * abs(sl);
        float pSh = max(1.0 - smoothstep(reach.x - px, reach.x + px + 0.03, din.x), 1.0 - smoothstep(reach.y - px, reach.y + px + 0.03, din.y));
        shd *= 1.0 - pSh * hasPar * (1.0 - par) * lod;
        // a water tank: a lit drum with a lid, and the shadow it throws
        vec2 tc = (vec2(fract(seed * 5.3), fract(seed * 9.1)) - 0.5) * (vSize.xz - 2.6);
        vec2 pa = uv - tc, ba = -sl * 1.05; float td = length(pa);
        float hasTank = step(fract(seed * 13.3), 0.7);
        float hseg = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
        shd *= 1.0 - hasTank * lod * (1.0 - smoothstep(0.58, 0.70, length(pa - ba * hseg)));
        vec3 tankC = fract(seed * 2.7) < 0.55 ? vec3(0.03, 0.03, 0.035) : vec3(0.05, 0.16, 0.50);
        vec2 sn = vSunL / max(length(vSunL), 1e-3);
        float tsh = 0.62 + 0.55 * clamp(dot(pa / max(td, 1e-3), sn) * smoothstep(0.2, 0.6, td), -1.0, 1.0);
        vec3 tk = tankC * tsh + 0.09 * (1.0 - smoothstep(0.0, 0.3, length(pa - sn * 0.2)));
        tk = mix(tk, tankC * 0.45, (1.0 - smoothstep(0.0, 0.035 + px, abs(td - 0.28))) * fine);           // lid
        float tank = (1.0 - smoothstep(0.62, 0.70, td)) * hasTank;
        alb = mix(alb, tk, tank); shd = mix(shd, 1.0, tank);
        // washing: a thin row of cloths that snap in the wind, and their shade beside them
        float ly = (fract(seed * 4.9) - 0.5) * (vSize.z - 2.0);
        float lx = uv.x * 1.4 + seed * 3.0; float cid = floor(lx);
        float flut = 0.10 * sin(uTime * 5.0 + cid * 2.3 + uv.x * 3.0) * (0.5 + 0.5 * sin(uTime * 0.7 + seed * 6.0));
        float hasW = step(fract(seed * 6.1), 0.55) * hasPar * lod * (1.0 - tank);
        float cOn = step(0.16, fract(lx)) * step(h11(cid * 1.7 + seed * 3.0), 0.75) * step(abs(uv.x), hs.x - 0.6);
        float cw = 0.07 + 0.05 * h11(cid + seed);
        float cloth = (1.0 - smoothstep(cw, cw + px + 0.02, abs(uv.y - ly - flut))) * cOn;
        float cshade = (1.0 - smoothstep(0.22, 0.32 + px, abs(uv.y - ly + sl.y * 1.1))) * cOn;
        shd *= 1.0 - 0.7 * cshade * hasW * (1.0 - cloth);
        vec3 cc = 0.5 + 0.5 * cos(6.2832 * (h11(cid + seed * 8.0) + vec3(0.0, 0.33, 0.67)));
        cc = mix(mix(cc, vec3(dot(cc, vec3(0.333))), 0.35) * 0.72, vec3(0.84, 0.82, 0.76), step(0.6, h11(cid * 3.1 + seed)));
        alb = mix(alb, cc, cloth * hasW);
        alb = mix(alb, vec3(0.05), (1.0 - smoothstep(0.0, 0.02 + px, abs(uv.y - ly))) * hasW * fine * (1.0 - cloth) * step(abs(uv.x), hs.x - 0.5));   // the line
        if (roofType > 1.5) {
          vec2 cg = (uv + hs) / 3.3; vec2 cf = abs(fract(cg + 0.5) - 0.5) * 3.3;
          float stub = 1.0 - smoothstep(0.16, 0.24, max(cf.x, cf.y));
          vec2 cf2 = abs(fract(cg + 0.5 + sl * 0.4 / 3.3) - 0.5) * 3.3;
          shd *= 1.0 - 0.75 * lod * (1.0 - smoothstep(0.16, 0.26, max(cf2.x, cf2.y)));
          alb = mix(alb, vec3(0.20, 0.13, 0.10), stub * lod);
          alb = mix(alb, vCol * 0.8, step(0.86, vn(uv * 1.9 + seed * 3.0)) * 0.8 * lod);
        }
      }
      float sunT = max(dot(N, uSunDir), 0.0) * shade * cloud * shd;
      col = alb * (uSunCol * sunT * 1.05 + uSkyCol * (0.9 + 0.35 * (1.0 - shd) * (1.0 - uNight)) + uSunCol * vec3(0.10, 0.07, 0.045) * uFarK.z * (1.0 - shd));
      col *= 0.8 + 0.2 * smoothstep(0.0, 0.5, edge + (1.0 - lod));
      // pinpoint glints that slide over the tin as the eye moves
      vec3 V = normalize(uCam - vP + vec3(0.0, 1e-3, 0.0));
      vec3 Ng = normalize(N + 0.10 * vec3(fract(seed * 19.0) - 0.5, 0.0, fract(seed * 29.0) - 0.5));
      vec3 Rr = reflect(-V, Ng);
      // wet season: standing water on a quarter of the roof area mirrors the sky and flashes
      float wetM = uWet * smoothstep(0.48, 0.60, vn(uv * 0.6 + seed * 31.0)) * (roofType < 0.5 ? 0.6 : 1.0) * smoothstep(0.0, 0.5, edge);
      float fre = 0.22 + 0.78 * pow(1.0 - clamp(dot(V, N), 0.0, 1.0), 3.0);
      col = mix(col, mix(col * 0.5, mix(uHaze, uZen, smoothstep(0.02, 0.22, Rr.y)) * (0.5 + 0.5 * cloud), fre), wetM);
      gl = max(gl, 1.5 * wetM);
      float sp = pow(max(dot(Rr, uSunDir), 0.0), 700.0);
      col += uSunCol * (6.0 * sp * gl + 3.0 * twk) * shade * cloud * (1.0 - uNight);
      col += uNight * lampC * 0.02;
    }
    if (vFace < 2.5) col = mix(col, vec3(dot(col, vec3(0.3, 0.5, 0.2))) * vec3(1.06, 0.98, 0.9), 0.34 * step(0.5, vMisc.w) * smoothstep(420.0, 820.0, length(uCam - vP)) * (1.0 - uNight));
    col = bowlAir(col, vP);
    col = mix(col, uHaze * 1.25 * (uSunCol * 0.55 + uSkyCol * 1.4), seaVeil(vP.y) * 0.9);
    gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
    #include <fog_fragment>
  }`,Y0=(s,i)=>(Math.floor(s/8)+2048)*8192+(Math.floor(i/8)+4096);function Ce(s,i,l,A,S){const r=[],F=[],w=[],N=[],f=[],z=new Set,b=[],v={x:0,z:0},U=Math.hypot(S.x,S.z)||1,d=S.x/U,X=S.z/U,_=S.y/U,I=(P,e0,n)=>{let W=1;for(const t0 of[30,85,210]){const O=s.height(P+d*t0,n+X*t0)-(e0+t0*_);O>0&&(W=Math.min(W,1-z0(O/(t0*.3),0,1)))}return W},C=[{s0:0,amp:96,per:318,ph:203,d0:58,d1:893,w:le}],y=[-i.range(390,480),i.range(430,540),(Math.PI-i.range(.15,.45))*1750,-(Math.PI-i.range(.25,.6))*1750,i.range(1500,2300)*i.sign()];for(const P of y)C.push({s0:P,amp:i.range(85,125),per:i.range(270,350),ph:i.range(0,300),d0:i.range(24,60),d1:893,w:9});const G=(P,e0)=>{const n=r.length/3,W=P.length;b.push(P);let t0=0;for(let O=0;O<W;O++){const o0=P[Math.max(0,O-1)],x=P[Math.min(W-1,O+1)],a=P[O];O>0&&(t0+=Math.hypot(a[0]-P[O-1][0],a[1]-P[O-1][1],a[2]-P[O-1][2]));let Z=x[0]-o0[0],E=x[2]-o0[2];const a0=Math.hypot(Z,E)||1;Z/=a0,E/=a0;const r0=-E,s0=Z,H=e0*.5,n0=.9+.2*i(),K=I(a[0],a[1],a[2]);for(let D=-1;D<=1;D+=2)z.add(Y0(a[0]+r0*5*D,a[2]+s0*5*D));z.add(Y0(a[0],a[2]));const L=(D,Q,M,J,V,i0,o)=>{r.push(a[0]+r0*D,a[1]+Q,a[2]+s0*D),F.push(M,J,V),w.push(i0,t0,o,H),N.push(K,n0)};if(L(-H,0,0,1,0,-H,0),L(H,0,0,1,0,H,0),L(-H,0,-r0,.5,-s0,0,1),L(-H-2.2,-7,-r0,.5,-s0,7.3,1),L(H,0,r0,.5,s0,0,1),L(H+2.2,-7,r0,.5,s0,7.3,1),O<W-1){const D=n+O*6,Q=D+6;f.push(D,D+1,Q,D+1,Q+1,Q,D+2,Q+2,D+3,Q+2,Q+3,D+3,D+4,D+5,Q+4,D+5,Q+5,Q+4)}}};for(const P of C){const e0=[];for(let n=P.d0;n<=P.d1;n+=6.5){const W=P.amp*(2/Math.PI)*Math.asin(.965*Math.sin(2*Math.PI*(n-P.ph)/P.per));s.at(n,(P.s0+W)/(1750*(1-n/2100)),v),e0.push([v.x,s.height(v.x,v.z)+2.3,v.z])}for(let n=1;n<e0.length-1;n++)e0[n][1]=(e0[n-1][1]+e0[n][1]*2+e0[n+1][1])*.25;G(e0,P.w)}const e=[];for(let P=0;P<=70;P++){const e0=895+P*26,n=60+110*Math.sin(P*.09)+40*Math.sin(P*.31);e.push([e0,s.height(e0,n)+.8,n])}G(e,13);const p=new t.BufferGeometry;p.setAttribute("position",new t.Float32BufferAttribute(r,3)),p.setAttribute("normal",new t.Float32BufferAttribute(F,3)),p.setAttribute("aRd",new t.Float32BufferAttribute(w,4)),p.setAttribute("aSh",new t.Float32BufferAttribute(N,2)),p.setIndex(f);const q=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{uBrick:{value:l.brick},uPale:{value:l.pale}}]),vertexShader:L0+`
      attribute vec4 aRd; attribute vec2 aSh; varying vec3 vP; varying vec3 vN; varying vec4 vRd; varying vec2 vSh;
      void main(){ vP = position; vN = normal; vRd = aRd; vSh = aSh;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:D0+A0+`
      uniform vec3 uBrick; uniform vec3 uPale;
      varying vec3 vP; varying vec3 vN; varying vec4 vRd; varying vec2 vSh;
      void main(){
        vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
        float pxA = max(fwidth(vRd.x), 1e-4), pxL = max(fwidth(vRd.y), 1e-4), px = max(pxA, pxL);
        float n1 = vn(vP.xz * 0.55), n2 = vn(vP.xz * 3.3 + 7.0), hw = max(vRd.w, 1.0); vec3 alb;
        if (vRd.z < 0.5) {
          float ax = abs(vRd.x), lod = 1.0 - smoothstep(0.2, 0.9, px);
          alb = vec3(0.215, 0.20, 0.185) * (0.80 + 0.30 * n1 + 0.14 * n2 * lod) * vSh.y;
          alb *= 1.0 - 0.16 * (1.0 - smoothstep(0.3, 0.9, abs(ax - hw * 0.46))) * (0.55 + 0.45 * vn(vec2(vRd.x * 2.0, vRd.y * 0.07)));   // wheel tracks
          alb = mix(alb, vec3(0.16, 0.15, 0.145), 0.6 * lod * smoothstep(0.62, 0.8, vn(vec2(vRd.y * 0.12, vRd.x * 0.5) + 9.0)));       // tar patches
          float dustE = smoothstep(hw * 0.5, hw, ax + 1.1 * (vn(vec2(vRd.y * 0.19, 3.0)) - 0.5));
          alb = mix(alb, vec3(0.46, 0.37, 0.27) * (0.85 + 0.3 * n2), 0.6 * dustE);                                                    // dust blown in from the verges
          alb = mix(alb, vec3(0.44, 0.36, 0.27), 0.45 * smoothstep(0.55, 0.85, vn(vec2(vRd.y * 0.045, vRd.x * 0.9 + 4.0))) * (1.0 - smoothstep(0.0, hw, ax)));   // tyre-dust streaks
          float dash = (1.0 - smoothstep(0.10, 0.10 + pxA, ax)) * mix(0.5, step(fract(vRd.y / 9.0), 0.5), 1.0 - smoothstep(1.5, 5.0, pxL));
          alb = mix(alb, vec3(0.62, 0.57, 0.40), dash * clamp(0.22 / pxA, 0.25, 0.85));
          float kerb = smoothstep(hw - 0.62 - pxA, hw - 0.62, ax);
          vec3 kc = mix(vec3(0.55, 0.53, 0.49), vec3(0.47, 0.15, 0.11), step(0.5, fract(vRd.y / 2.6)) * (1.0 - smoothstep(0.3, 1.0, pxL)));
          alb = mix(alb, kc * (0.85 + 0.25 * n2), kerb);
        } else {
          float h = vRd.x, lod = 1.0 - smoothstep(0.12, 0.5, px);
          float crs = h / 0.62, row = floor(crs), fc = fract(crs);
          float bx = vRd.y / 1.35 + 0.5 * mod(row, 2.0) + 0.37 * h21(vec2(row, 3.0)), fb = fract(bx), hb = h21(vec2(floor(bx), row));
          float joint = max(1.0 - smoothstep(0.0, 0.07 + pxA / 0.62, min(fc, 1.0 - fc)), 1.0 - smoothstep(0.0, 0.04 + pxL / 1.35, min(fb, 1.0 - fb)));
          alb = mix(uPale * 0.82, uBrick * 0.95, 0.30 + 0.34 * hb * lod) * (0.74 + 0.36 * mix(0.5, hb, lod)) * (0.9 + 0.2 * n1);
          alb *= 1.0 - 0.5 * joint * lod;
          alb *= 1.0 - 0.5 * smoothstep(2.6, 7.3, h);                                                 // a darker, damper foot
          alb = mix(alb, vec3(0.50, 0.48, 0.45), (1.0 - smoothstep(0.22, 0.30 + pxA, h)) * 0.8);       // concrete coping under the kerb
          alb = mix(alb, alb * vec3(0.55, 0.6, 0.45), 0.5 * lod * smoothstep(0.55, 0.8, vn(vec2(vRd.y * 0.3, h * 0.8) + 5.0)) * smoothstep(2.0, 6.0, h));   // weeds and damp
        }
        float sh = vSh.x * cloudShade(vP.xz) * rimShade(vP) * hmShade(vP, N);
        float sunT = max(dot(N, uSunDir), 0.0) * sh;
        float unlit = (1.0 - clamp(dot(N, uSunDir) * 4.0, 0.0, 1.0) * sh) * (1.0 - uNight);
        vec3 light = uSunCol * sunT + uSkyCol * (0.5 + 0.5 * N.y) * (1.0 + 0.9 * unlit) + uBrick * 0.10 * uFarK.z * (1.0 - 0.6 * N.y) * (0.35 + 0.65 * sh);
        vec3 col = bowlAir(alb * light, vP);
        col = mix(col, uHaze * 1.25 * (uSunCol * 0.55 + uSkyCol * 1.4), seaVeil(vP.y) * 0.9);
        gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
        #include <fog_fragment>
      }`});return Object.assign(q.uniforms,A),{mesh:new t.Mesh(p,q),taken:z,lines:b}}async function Ae(s,i,l,A,S,r,F,w,N){const f=i.heightPlace,z=i.info,b=s.quality?.detail??1,v=Math.round(9e3*(.55+.45*b)),U=Math.round(15e3*(.55+.45*b)),d=Math.hypot(S.x,S.z)||1,X=S.x/d,_=S.z/d,I=S.y/d,C=[new t.Color("#9fc4dc"),new t.Color("#e9e6dc"),new t.Color("#a9d8c0"),new t.Color("#d9c48f"),A.green.clone().lerp(new t.Color("#ffffff"),.35)],y=A.brick.clone().lerp(new t.Color("#cf7f4c"),.55),G=A.brick.clone().multiplyScalar(.7),e=l.range(.1,.2),p=l.range(.48,.64),q=w.clearNear??0,j=new t.Color;function P(o){return{n:0,max:o,pos:new Float32Array(o*3),size:new Float32Array(o*3),rg:new Float32Array(o*4),col:new Float32Array(o*3),misc:new Float32Array(o*4)}}function e0(o,h,c,g){const B=f(h,c);if(z.d<17||B<T0-4||r.taken.has(Y0(h,c)))return!1;for(let d0=0;d0<F.length;d0+=2)if(Math.abs(h-F[d0])<8&&Math.abs(c-F[d0+1])<9)return!1;const u=i.pitchOld;if(Math.abs(h-u.x)<u.hx+6&&Math.abs(c-u.z)<u.hz+6)return!1;const k=(f(h+3,c)-B)/3,T=(f(h,c+3)-B)/3,Y=Math.hypot(k,T);if(Y>.84||Y>.56&&l()<(Y-.56)*2.6)return!1;let R=g?l.range(9,15):l.range(5.2,8.6),$=g?l.range(8,13):l.range(5,8);const h0=l();let l0=h0<.27?1:h0<.66?2:h0<.9?3:4;g&&(l0+=l.int(0,2)),Y>.45&&(R*=.85,$*=.85);let u0=l()<p?0:l()<.3?2:1;const m0=Math.abs(c);if(h>-30&&h<M0+40&&m0<14){if(m0<q&&h>95&&h<335)return!1;const d0=Math.max(0,m0-(R+$)*.36);if(d0<6.4){const k0=Math.sqrt(40.96000000000001-d0*d0)+.9,P0=Math.min(y0(h-5),y0(h+5))-k0;for(;l0>0&&B+l0*2.7+.3+.9>P0;)l0--;if(l0<1)return!1}}if(h>M0&&h<S0+20&&m0<16&&B+l0*2.7+6>y0(h))return!1;let g0=1;if(!g&&Y>.3){const d0=f(h+X*20,c+_*20)-(B+3+20*I);d0>0&&(g0=1-z0(d0/6,0,1))}const c0=o.n++;let v0=Y>.06?Math.atan2(-T,k):s.noise.n2(h/300,c/300)*3;v0+=l.range(-.1,.1)+(l()<.12?l.range(-.5,.5):0),o.pos[c0*3]=h,o.pos[c0*3+1]=B,o.pos[c0*3+2]=c,o.size[c0*3]=R,o.size[c0*3+1]=l0*2.7+.3,o.size[c0*3+2]=$,o.rg[c0*4]=Math.cos(v0),o.rg[c0*4+1]=Math.sin(v0),o.rg[c0*4+2]=k,o.rg[c0*4+3]=T;let p0=0;const x0=l();return x0<e?(j.copy(l.pick(C)).multiplyScalar(l.range(.7,.9)),p0=1):x0<e+.07?(j.setRGB(.42,.41,.4).multiplyScalar(l.range(.85,1.1)),p0=1):j.copy(A.brick).lerp(l()<.66?y:G,l()*.75).multiplyScalar(l.range(.92,1.2)),o.col[c0*3]=j.r,o.col[c0*3+1]=j.g,o.col[c0*3+2]=j.b,o.misc[c0*4]=l(),o.misc[c0*4+1]=u0,o.misc[c0*4+2]=g0,o.misc[c0*4+3]=p0,!0}const n=P(v),W=5.7,t0=.55+.45*b,O=Math.floor(682/W),o0=Math.floor(860/W);for(let o=0;o<O&&n.n<n.max;o++){for(let h=0;h<o0&&n.n<n.max;h++){const c=18+(o+.2+.6*l())*W,g=-430+(h+.2+.6*l())*W,B=Math.abs(g)<60&&c<440,m=i.barrio(c,g),u=1-.8*Math.max(f0(540,700,c),f0(320,430,Math.abs(g)));!B&&l()>Math.min(1,m*1.6)*u*t0||B&&l()>.93||e0(n,c,g,!1)}await s.yield()}const x=P(U+8),a={x:0,z:0},Z=new Set;x.max=U;const E=(o,h)=>(Math.floor(o/9)+2048)*8192+(Math.floor(h/9)+4096);for(let o=0;o<U*1.6&&x.n<x.max;o++){(o&63)===0&&await s.yield();const c=l()<.72?Math.PI+l.gauss()*.55:l.range(-Math.PI,Math.PI),g=l()<.3?l.range(900,1560):20+880*Math.pow(l(),.8);if(i.at(g,c,a),a.x<690&&Math.abs(a.z)<425)continue;const B=E(a.x,a.z);if(Z.has(B)||l()>.25+.75*i.barrio(a.x,a.z)||!e0(x,a.x,a.z,!0))continue;Z.add(B);const m=x.n-1,u=x.pos[m*3],k=x.pos[m*3+2],T=x.rg[m*4+2],Y=x.rg[m*4+3],R=Math.hypot(T,Y),$=R>.03?-Y/R:1,h0=R>.03?T/R:0,l0=R>.03?-T/R:0,u0=R>.03?-Y/R:1,m0=l()<.45?2:1,g0=l.int(2,4);for(let c0=0;c0<m0&&x.n<x.max;c0++)for(let v0=-1;v0<=1;v0+=2){let p0=u+l0*c0*l.range(13,17),x0=k+u0*c0*l.range(13,17);for(let d0=c0===0?1:0;d0<=g0&&x.n<x.max;d0++){if(c0>0&&d0===0&&v0>0)continue;const k0=d0===0?0:l.range(10.5,14);if(p0+=$*v0*k0,x0+=h0*v0*k0,p0<690&&Math.abs(x0)<425)break;const P0=E(p0,x0);if(!Z.has(P0)){if(i.barrio(p0,x0)<.12)break;if(e0(x,p0,x0,!0))Z.add(P0);else if(l()<.6)break}}}}const a0=(w.keepOut||[]).concat(_0.map(o=>[o[0]-o[2],o[0]+o[2],o[1]-o[2],o[1]+o[2]]));a0.push([i.pitch.x-i.pitch.hx-5,i.pitch.x+i.pitch.hx+5,i.pitch.z-i.pitch.hz-5,i.pitch.z+i.pitch.hz+5]);const r0=async(o,h)=>{const g=(u,k)=>(Math.floor(u/14)+4096)*16384+(Math.floor(k/14)+8192),B=new Map;for(let u=0;u<o.n;u++){(u&2047)===0&&await s.yield();const k=g(o.pos[u*3],o.pos[u*3+2]);let T=B.get(k);T||B.set(k,T=[]),T.push(u)}const m=new Uint8Array(o.n);for(let u=0;u<o.n;u++){(u&1023)===0&&await s.yield();const k=o.pos[u*3],T=o.pos[u*3+2];m[u]=1;let Y=!1;for(const v0 of a0)if(k>v0[0]&&k<v0[1]&&T>v0[2]&&T<v0[3]){Y=!0;break}if(Y){m[u]=0;continue}const R=o.rg[u*4+2],$=o.rg[u*4+3],h0=Math.sqrt(R*R+$*$),l0=Math.abs(T)<60&&k<440;if(l0){if(h&&h0>.5){m[u]=0;continue}if(h0<=.36)continue}const u0=l0?2:h||2,m0=l0||h0>.5?12:14,g0=m0*m0;if(!l0&&u0<=2&&h0<=.5&&i.barrio(k,T)>=.3)continue;let c0=0;for(let v0=-1;v0<=1&&c0<u0;v0++)for(let p0=-1;p0<=1&&c0<u0;p0++){const x0=B.get(g(k+v0*14,T+p0*14));if(x0)for(let d0=0;d0<x0.length;d0++){const k0=x0[d0],P0=o.pos[k0*3]-k,W0=o.pos[k0*3+2]-T;if(k0!==u&&P0*P0+W0*W0<g0&&++c0>=u0)break}}c0<u0&&(m[u]=0)}await s0(o,m)},s0=async(o,h)=>{const c=[[o.pos,3],[o.size,3],[o.rg,4],[o.col,3],[o.misc,4]];let g=0;for(let B=0;B<o.n;B++)if((B&2047)===0&&await s.yield(),!!h[B]){if(g!==B)for(let m=0;m<5;m++){const u=c[m][0],k=c[m][1];for(let T=0;T<k;T++)u[g*k+T]=u[B*k+T]}g++}o.n=g},H=async o=>{const c=(R,$)=>(Math.floor(R/12)+4096)*16384+(Math.floor($/12)+8192),g=new Map,B=new Uint8Array(o.n).fill(1),m=o.pos,u=o.size,k=o.rg,T=(R,$,h0,l0,u0,m0)=>{const g0=k[u0*4],c0=k[u0*4+1],v0=k[m0*4],p0=k[m0*4+1],x0=(u[u0*3]*.5+.25)*Math.abs(R*g0-$*c0)+(u[u0*3+2]*.5+.25)*Math.abs(R*c0+$*g0),d0=(u[m0*3]*.5+.25)*Math.abs(R*v0-$*p0)+(u[m0*3+2]*.5+.25)*Math.abs(R*p0+$*v0);return Math.abs(h0*R+l0*$)>x0+d0},Y=(R,$)=>{const h0=m[$*3]-m[R*3],l0=m[$*3+2]-m[R*3+2];if(h0*h0+l0*l0>196)return!1;const u0=k[R*4],m0=k[R*4+1],g0=k[$*4],c0=k[$*4+1];return!(T(u0,-m0,h0,l0,R,$)||T(m0,u0,h0,l0,R,$)||T(g0,-c0,h0,l0,R,$)||T(c0,g0,h0,l0,R,$))};for(let R=0;R<o.n;R++){(R&255)===0&&await s.yield();const $=m[R*3],h0=m[R*3+2];if(Math.abs(h0)>125||$>600)continue;let l0=!1;for(let g0=0;g0<4&&!l0;g0++){l0=!0;for(let c0=-1;c0<=1&&l0;c0++)for(let v0=-1;v0<=1&&l0;v0++){const p0=g.get(c($+c0*12,h0+v0*12));if(p0){for(let x0=0;x0<p0.length;x0++)if(Y(R,p0[x0])){l0=!1;break}}}!l0&&g0<3&&(u[R*3]*=.86,u[R*3+2]*=.86)}if(!l0){B[R]=0;continue}const u0=c($,h0);let m0=g.get(u0);m0||g.set(u0,m0=[]),m0.push(R)}await s0(o,B)},n0=w.districtOffset||[0,0],K=(o,h,c)=>{const g=Math.sin(o*12.9898+h*78.233+c*37.719)*43758.5453;return g-Math.floor(g)},L=(o,h,c)=>[o,h,c],D=L(.78,.76,.69),Q=[[L(.014,.392,.527),L(.014,.392,.527),D,L(.2,.4,.66)],[L(.807,.069,.323),L(.888,.539,.01),L(.871,.254,.012),D],[L(.005,.376,.147),L(.195,.047,.479),L(.3,.62,.45),D]],M=async o=>{for(let h=0;h<o.n;h++){(h&2047)===0&&await s.yield();const c=o.pos[h*3],g=o.pos[h*3+2],B=Math.sin(c*.0117+n0[0])*Math.cos(g*.0131+n0[1])+.7*Math.sin((c*.6+g*.8)*.0093+n0[0]*1.7)+.5*Math.cos((c*.8-g*.6)*.0171+n0[1]*2.3);if(K(c,g,1)>.34*f0(-.1,.3,B)||c<170&&K(c,g,5)>.42)continue;const m=Math.sin(c*.0083+n0[1]*3.1+1)*Math.sin(g*.0097+n0[0]*2.3)+.6*Math.sin((c-g)*.0061+4),u=Q[m<-.22?0:m<.22?1:2][Math.min(3,Math.floor(K(c,g,2)*4))],k=.66+.15*K(c,g,3),T=.3*u[0]+.5*u[1]+.2*u[2],Y=c<170?.55:Math.hypot(c-200,g)>330?.42:.2;o.col[h*3]=b0(u[0],T,Y)*k,o.col[h*3+1]=b0(u[1],T,Y)*k,o.col[h*3+2]=b0(u[2],T,Y)*k,o.misc[h*4+3]=1}};for(const o of[n,x,n,x])await r0(o,o===n?5:0),await s.yield();for(const o of[n,x]){for(let h=0;h<o.n;h++){const c=o.rg[h*4+2],g=o.rg[h*4+3];if(Math.hypot(c,g)>.3){const B=Math.atan2(-g,c)+(K(o.pos[h*3],o.pos[h*3+2],5)-.5)*.2;o.rg[h*4]=Math.cos(B),o.rg[h*4+1]=Math.sin(B)}}await s.yield()}await H(n),await s.yield(),await M(n),await s.yield(),await M(x),await s.yield();{const o=i.pitch;for(let h=0;h<n.n;h++){const c=n.pos[h*3],g=n.pos[h*3+2];if(g>18&&g<o.z-o.hz-2&&c>o.x-66&&c<o.x+22&&(n.size[h*3+1]=Math.min(n.size[h*3+1],3)),Math.abs(c-o.x)<50&&g>8&&g<110){const B=i.height(c,g);n.pos[h*3+1]=B,n.rg[h*4+2]=(i.height(c+3,g)-B)/3,n.rg[h*4+3]=(i.height(c,g+3)-B)/3}}await s.yield()}{const o=I<1.4;for(const h of[n,x]){const c=h===n?[30,90]:[70,190];for(let g=0;g<h.n;g++){(g&255)===0&&await s.yield();const B=h.pos[g*3],m=h.pos[g*3+2];if(!o)break;let u=h.misc[g*4+2];const k=h.pos[g*3+1]+h.size[g*3+1]*.6;for(const T of c){const Y=i.height(B+X*T,m+_*T)-(k+T*I);Y>0&&(u=Math.min(u,1-z0(Y/(T*.25),0,1)))}h.misc[g*4+2]=u}}}for(const o of _0)if(o[3]===1)for(const h of[[.1*o[2],0,22,19,46,0],[-.38*o[2],16,10,42,10,1],[-.38*o[2],-16,10,42,10,1]]){if(x.n>=U+8)break;const c=x.n++,g=o[0]+h[0],B=o[1]+h[1];x.pos[c*3]=g,x.pos[c*3+1]=i.height(g,B),x.pos[c*3+2]=B,x.size[c*3]=h[2],x.size[c*3+1]=h[3],x.size[c*3+2]=h[4],x.rg[c*4]=1,x.rg[c*4+1]=0,x.rg[c*4+2]=0,x.rg[c*4+3]=0,x.col[c*3]=.8,x.col[c*3+1]=.78,x.col[c*3+2]=.72,x.misc[c*4]=.137+.21*h[5],x.misc[c*4+1]=h[5],x.misc[c*4+2]=1,x.misc[c*4+3]=1}let J=x.n;{const o=x.n,h=new Uint32Array(o),c=u=>x.pos[u*3]>1150||Math.abs(x.pos[u*3+2])>1150;let g=0;const B=u=>{const k=x.misc[u*4]*17.31;return Math.max(x.pos[u*3],Math.abs(x.pos[u*3+2])*.9)>=1250&&k-Math.floor(k)>.5};for(let u=0;u<o;u++)!c(u)&&!B(u)&&(h[g++]=u);J=g;for(let u=0;u<o;u++)c(u)&&!B(u)&&(h[g++]=u);const m=g;await s.yield();for(const u of["pos","size","rg","col","misc"]){const k=x[u],T=u==="rg"||u==="misc"?4:3,Y=new Float32Array(k.length);for(let R=0;R<m;R++){const $=h[R]*T;for(let h0=0;h0<T;h0++)Y[R*T+h0]=k[$+h0]}x[u]=Y,await s.yield()}x.n=m}const V=ue(),i0=[];for(const o of[[n,0,n.n,24],[x,0,J,24],[x,J,x.n,18]]){const h=o[0],c=o[1],g=o[2]-o[1];if(g<1)continue;const B=new t.InstancedBufferGeometry;B.index=V.index,B.setAttribute("position",V.attributes.position),B.setAttribute("normal",V.attributes.normal),B.setAttribute("aFace",V.attributes.aFace);const m=(T,Y)=>new t.InstancedBufferAttribute(T.subarray(c*Y,(c+g)*Y),Y);B.setAttribute("iPos",m(h.pos,3)),B.setAttribute("iSize0",m(h.size,3)),B.setAttribute("iRotGrad",m(h.rg,4)),B.setAttribute("iCol",m(h.col,3)),B.setAttribute("iMisc",m(h.misc,4)),B.instanceCount=g,B.setDrawRange(0,o[3]),B.boundingSphere=new t.Sphere(new t.Vector3(V0,-200,0),2600);const u=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,vertexShader:ve,fragmentShader:Pe,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{uBrick:{value:A.brick},uPale:{value:A.pale},uFarGrow:{value:h===x?1:0}}])});Object.assign(u.uniforms,N);const k=new t.Mesh(B,u);k.frustumCulled=!1,i0.push(k)}return{meshes:i0,count:n.n+x.n,near:n}}function J0(s){return O0-5.6*f0(322,398,s)*(1-f0(432,500,s))}function qe(){const s=[],i=[],l=[];let A=0,S=H0,r=y0(H0)+R0;const F=[];for(let b=H0;b<=S0;b+=.5){const v=y0(b)+R0;A+=Math.hypot(b-S,v-r),F.push(A,b,v),S=b,r=v}const w=A;let N=0;for(let b=0;b<=w;b+=1){for(;N<F.length/3-2&&F[(N+1)*3]<b;)N++;const v=F[N*3],U=F[(N+1)*3],d=U>v?z0((b-v)/(U-v),0,1):0;s.push(b0(F[N*3+1],F[(N+1)*3+1],d)),i.push(b0(F[N*3+2],F[(N+1)*3+2],d)),l.push(b)}let f=0;for(let b=0;b<s.length;b++)s[b]<=M0&&(f=b);const z=(b,v)=>{const U=z0(b,0,s.length-1.001),d=Math.floor(U),X=U-d;return v.x=b0(s[d],s[d+1],X),v.y=b0(i[d],i[d+1],X),v.slope=(i[d+1]-i[d])/Math.max(1e-4,s[d+1]-s[d]),v};return{total:s.length-1,ride:f,at:z}}function ee(){const s=[],i=new t.Matrix4,l=new t.Quaternion,A=new t.Euler,S=new t.Vector3,r=new t.Vector3(1,1,1),F=new t.Vector3(0,1,0),w=new t.Vector3,N=new t.Vector3,f=(b,v,U)=>{const d=b.attributes.position.count,X=new Float32Array(d*3),_=b.attributes.position;b.computeBoundingBox();const I=b.boundingBox.min.y,C=b.boundingBox.max.y;for(let y=0;y<d;y++){const G=U?(_.getY(y)-I)/Math.max(1e-4,C-I):0;X[y*3]=b0(v.r,U?U.r:v.r,G),X[y*3+1]=b0(v.g,U?U.g:v.g,G),X[y*3+2]=b0(v.b,U?U.b:v.b,G)}return b.setAttribute("color",new t.BufferAttribute(X,3)),b};return{list:s,box(b,v,U,d,X,_,I,C=0,y=0,G=0,e=null){const p=f(new t.BoxGeometry(b,v,U),I,e);return p.applyMatrix4(i.compose(S.set(d,X,_),l.setFromEuler(A.set(C,y,G)),r)),s.push(p),p},tube(b,v,U,d,X,_,I,C,y,G=6,e=null){w.set(b,v,U),N.set(d,X,_);const p=w.distanceTo(N),q=f(new t.CylinderGeometry(C,I,p,G,1,!0),y,e);return N.sub(w).normalize(),l.setFromUnitVectors(F,N),q.applyMatrix4(i.compose(S.set((b+d)/2,(v+X)/2,(U+_)/2),l,r)),s.push(q),q},disc(b,v,U,d,X,_,I=10){const C=f(new t.CylinderGeometry(b,b,v,I,1,!1),_,null);return C.applyMatrix4(i.compose(S.set(U,d,X),l.setFromEuler(A.set(Math.PI/2,0,0)),r)),s.push(C),C},merge(){const b=ge(s,!1);for(const v of s)v.dispose();return s.length=0,b}}}async function De(s,i,l,A,S){const r=ee(),F=ee(),w=[],N=[],f=new t.Color(.6,.62,.63),z=new t.Color(.36,.37,.39),b=new t.Color(.52,.5,.47),v=A.red.clone().multiplyScalar(.9),U=new t.Color(.78,.78,.76),d=new t.Color(.75,.55,.08),X=new t.Color(.06,.06,.07),_=new t.Color(.36,.22,.14),I=[],C=(a,Z,E)=>{const a0=F.disc(.28,.13,a,Z,E,X,8),r0=F.box(.5,.09,.15,a,Z,E,d);for(const s0 of[a0,r0]){const H=s0.attributes.position.count,n0=new Float32Array(H*3);for(let K=0;K<H;K++)n0[K*3]=a,n0[K*3+1]=Z,n0[K*3+2]=E;s0.setAttribute("aPivot",new t.BufferAttribute(n0,3))}},y=(a,Z,E,a0,r0,s0)=>{const H=Math.atan(a0),n0=Math.cos(H),K=Math.sin(H),L=s0?-.3:.3;r.box(r0*1.15+.4,.2,.2,a,Z+L*1.9,E-.22,z,0,0,H),r.box(.3,.7,.3,a,Z+L*3.2,E-.22,z);for(let D=0;D<r0;D++){const Q=(D-(r0-1)/2)*1.15;C(a+n0*Q-K*L,Z+K*Q+n0*L,E)}};async function G(a,Z,E){const r0=y0(a)+R0,s0=(y0(a+1)-y0(a-1))/2,H=r0+1.65,n0=H-i.height(a,-3.5)<20,K=-5.1,L=i.height(a,K),D=a<500,Q=H-L,M=Q>25&&a<500,J=(E?n0?.58:.75:n0?.46:.5)+Q*.014+(M?.28:0),V=E?n0?.44:.5:M?.5:.38;r.box(n0?2.6:3.4,2.4,n0?2.6:3.4,a,L-.3,K,b,0,l.range(-.1,.1),0,b.clone().multiplyScalar(.8));const i0=m=>{const u=Math.sin(m*12.9898+a*.371)*43758.5453;return u-Math.floor(u)},o=H+.5,h=m=>b0(J,V,z0((m-L)/(o-L),0,1)),c=_.clone().lerp(f,.55),g=new t.Color,B=new t.Color;for(let m=L,u=0;m<o-.01;m+=3,u++){const k=Math.min(o,m+3),T=(m-L)/(o-L),Y=(k-L)/(o-L),R=.86+.24*i0(u);if(g.copy(c).lerp(f,Math.min(1,T*1.6)).multiplyScalar(R*.93),B.copy(c).lerp(f,Math.min(1,Y*1.6)).multiplyScalar(R*1.05),M&&T>.16){const $=Math.floor((o-k)/6)%2?U:v;g.copy($).multiplyScalar(R*.9),B.copy($).multiplyScalar(R)}r.tube(a,m,K,a,k,K,h(m),h(k),g.clone(),8,B.clone()),u>0&&r.tube(a,m-.05,K,a,m+.07,K,h(m)+.035,h(m)+.035,z,8)}for(let m=L+7;m<H-3;m+=9){const u=h(m)+.1;r.tube(a,m,K,a,m+.3,K,u,u,z,8)}await s.yield(),r.tube(a,L+.9,K,a,L+1.08,K,J+.32,J+.32,z,10,f),r.box((J+.32)*1.7,.03,(J+.32)*1.7,a,L+1.09,K,f,0,Math.PI/4,0);for(let m=0;m<10&&D;m++){const u=m/10*Math.PI*2;r.box(.11,.14,.11,a+Math.cos(u)*(J+.2),L+1.15,K+Math.sin(u)*(J+.2),X,0,-u,0)}{const m=a-J-.16,u=L+1.2,k=H-.6,T=(u+k)/2,Y=Q>25?.75:.5;r.box(.06,k-u,.06,m,T,K-.24,X),r.box(.06,k-u,.06,m,T,K+.24,X);for(let R=u+.3;R<k&&D;R+=Y)r.box(.05,.05,.5,m,R,K,z);for(let R=u+3;R<k;R+=3)r.box(.05,.07,.86,m-.42,R,K,d),r.box(.46,.07,.05,m-.2,R,K-.42,d),r.box(.46,.07,.05,m-.2,R,K+.42,d)}await s.yield();{const m=Q>25?2.4:1.1;for(let u=0;u<(Q>25?4:3);u++){const k=H-(Q>25?2.2:1.5)-u*m,T=b0(J,V,(k-L)/Q)+.03;r.tube(a,k-m,K,a,k,K,T+.02,T,u%2?U:v,8)}}{const m=h(L+3.4)+.03;r.box(.86,.62,.04,a,L+3.4,K+m,X),r.box(.76,.52,.05,a,L+3.4,K+m+.01,U),r.box(.76,.14,.06,a,L+3.24,K+m+.012,v),r.box(.2,.2,.06,a+.2,L+3.5,K+m+.012,d);const u=a+.55*J,k=T=>K+Math.sqrt(Math.max(.01,h(T)*h(T)-.3*J*J))+.07;r.tube(u,L+1.2,k(L+1.2),u,H-.8,k(H-.8),.045,.045,X,5);for(let T=L+2.2;T<H-1&&D;T+=1.5)r.box(.2,.05,.1,u,T,k(T),z);r.box(.36,.5,.18,u,L+2,k(L+2)+.05,z,0,0,0,f);for(let T=L+3,Y=0;T<o-.5&&D;T+=3,Y++)for(let R=0;R<5;R++){const $=i0(Y*7+R)*Math.PI*2,h0=h(T-.6)+.012,l0=.5+1.6*i0(Y*13+R*3+1);r.box(.02,l0,.07+.1*i0(Y+R*5),a+Math.cos($)*h0,T-l0/2,K+Math.sin($)*h0,_.clone().multiplyScalar(.85),0,-$,0)}}await s.yield();{const m=z.clone().multiplyScalar(.3),u=f.clone().multiplyScalar(.9),k=[v.clone().multiplyScalar(.85),u,U.clone().multiplyScalar(.92),u,U.clone().multiplyScalar(.92),v.clone().multiplyScalar(.85)],T=9.4/6;for(let Y=0;Y<6;Y++)r.box(.34,.46,T,a,H,-3.5-4.7+(Y+.5)*T,m,0,0,0,k[Y]);r.box(.6,.05,9.5,a,H+.255,-3.5,f.clone().multiplyScalar(1.1)),r.box(.6,.05,9.5,a,H-.255,-3.5,m);for(let Y=0;Y<=6&&D;Y++){const R=-8.2+Y*T;if(!(Math.abs(R-K)<.7)){r.box(.5,.52,.07,a,H,R,m,0,0,0,z);for(const $ of[-1,1])for(const h0 of[-1,1])r.box(.05,.05,.13,a+$*.2,H+h0*.13,R,X)}}for(const Y of[-1,1])r.box(.64,.58,.1,a,H,-3.5+Y*4.75,d),r.box(.66,.19,.11,a,H,-3.5+Y*4.75,X);r.box(.74,.035,8.8,a,H+.3,-3.5,X.clone().multiplyScalar(1.8));for(let Y=0;Y<12&&D;Y++)r.box(.76,.045,.05,a,H+.3,-3.5-4.2+Y*.764,z.clone().multiplyScalar(.7));for(const Y of[-1,1]){r.box(.035,.035,8.8,a+Y*.37,H+1.25,-3.5,d),r.box(.03,.03,8.8,a+Y*.37,H+.8,-3.5,d.clone().multiplyScalar(.8));for(let R=0;R<7&&D;R++)r.box(.035,.95,.035,a+Y*.37,H+.78,-3.5-4.3+R*1.433,d)}for(const Y of[0,O0])r.box(.2,H-.25-(r0+1.2),.2,a,(H-.25+r0+1.2)/2,Y-.22,z)}r.box(1.3,1.1,1.3,a,H-.1,K,z,0,0,0,f);{const m=z.clone().multiplyScalar(.62);r.tube(a,H-3.2,K,a,H-.3,-3.5+3.4,.075,.075,m,5,z),r.tube(a,H-3.2,K,a,H-.3,-3.5-3.4,.075,.075,m,5,z)}r.box(1.5,.1,5.2,a+.9,H-.4,-3.5,d.clone().multiplyScalar(.7)),r.box(.05,1,5.2,a+1.65,H+.1,-3.5,d),r.box(1.5,.05,.05,a+.9,H+.6,-3.5-2.6,d),r.box(1.5,.05,.05,a+.9,H+.6,-3.5+2.6,d),E&&(r.box(1.6,1.3,2.2,a-.2,H+1,-3.5,new t.Color(.2,.33,.3),0,0,0),r.box(1.9,.14,2.6,a-.2,H+1.72,-3.5,z)),y(a,r0,0,s0,Z,!1),y(a,r0,O0,s0,Z,!1),w.push({base:new t.Vector3(a,L,K),top:new t.Vector3(a,H+.5,-3.5)}),N.push(a,K)}for(const a of[[-60,4,!1],[-6,6,!0],[75,4,!1],[200,4,!1]])await G(a[0],a[1],a[2]),await s.yield();const e=M0,p=X0,q=p+10.2,j=p-9.6,P=[9.9,-9.9,-15.6];let e0=0;for(const a of P){for(const E of[-5.5,5.5]){const a0=i.height(e+E,a);e0=Math.min(e0,a0),r.box(2.6,2.6,2.6,e+E,a0-.4,a,b),r.tube(e+E,a0,a,e+E*.16,q,a,.62,.36,_.clone().lerp(f,.5),6,f),N.push(e+E,a)}const Z=i.height(e,a);for(let E=0;E<4;E++){const a0=.12+E*.2,r0=a0+.2,s0=b0(Z,q,a0),H=b0(Z,q,r0),n0=5.5*(1-a0*.84),K=5.5*(1-r0*.84);r.tube(e-n0,s0,a,e+K,H,a,.1,.1,z,4),r.tube(e+n0,s0,a,e-K,H,a,.1,.1,z,4)}for(let E=0;E<3;E++)r.tube(e,q-2.6-E*2.6-2.6,a,e,q-2.6-E*2.6,a,.75-E*.04,.7-E*.04,E%2?U:v,6);await s.yield()}const n=(P[0]+P[2])/2,W=P[0]-P[2]+2.4;r.box(.5,.5,W,e-.9,q+.2,n,f),r.box(.5,.5,W,e+.9,q+.2,n,f),r.box(.4,.4,W,e,q+2,n,f);for(let a=0;a<9;a++){const Z=P[2]-1+a*(W-.4)/9,E=Z+(W-.4)/9;r.tube(e-.9,q+.2,Z,e,q+2,(Z+E)/2,.08,.08,z,4),r.tube(e+.9,q+.2,E,e,q+2,(Z+E)/2,.08,.08,z,4)}r.box(.45,.6,P[0]-P[1],e,j,0,f,0,0,0,z),r.box(1.5,.1,W-1,e,q+.5,n,z),r.box(.06,.07,W-1,e+.95,q+1.5,n,d),r.box(.06,.07,W-1,e-.95,q+1.5,n,d);for(const a of[P[0],P[1]])r.tube(e,q,a,e,p+6.3,a-Math.sign(a)*3,.12,.12,z,4),r.tube(e,j,a,e,p-6.3,a-Math.sign(a)*3,.12,.12,z,4);y(e,y0(e)+R0,J0(e),-C0,4,!1),r.box(.3,q-(y0(e)+R0)-.8,.3,e,(q+y0(e)+R0+.9)/2,J0(e)-.22,z),await s.yield();const t0=[[e,q+2.5,P[0]],[e,q+2.5,P[2]]],O=w.length;if(w.push({base:new t.Vector3(e,e0,0),top:new t.Vector3(e,q+2.2,0)}),S.beyond!==!1){for(const E of[545,675,800])await G(E,4,!1),await s.yield();const a=i.height(S0,-3.5),Z=A.brick.clone().multiplyScalar(.9);r.box(16,7.5,3,S0+4,a+3.4,5.5,Z),r.box(16,7.5,3,S0+4,a+3.4,-12.5,Z),r.box(4,7.5,18,S0+10,a+3.4,-3.5,Z),r.box(18,.5,22,S0+3.5,a+7.6,-3.5,v,0,0,.05),N.push(S0+4,-3.5,S0-4,-3.5,S0+12,-3.5)}const o0=r.merge();await s.yield();const x=F.merge();return{structure:o0,wheels:x,pylons:w,pylonXZ:N,gantryIndex:O,lamps:t0}}function Ne(s,i){const l=[];for(let A=0;A<2;A++){const S={x:0,y:0,slope:0},r=[];for(let F=0;F<=s.total;F+=3)s.at(F,S),r.push([S.x,S.y,A?J0(S.x):0]);l.push(r)}return de(l,i,0)}function de(s,i,l=-1){const A=[],S=[],r=[],F=[],w=[];for(let b=0;b<s.length;b++){const v=s[b],U=A.length/3;for(let d=0;d<v.length;d++){const X=v[Math.max(0,d-1)],_=v[Math.min(v.length-1,d+1)],I=Math.hypot(_[0]-X[0],_[1]-X[1],_[2]-X[2])||1;for(const C of[-1,1])A.push(v[d][0],v[d][1],v[d][2]),S.push((_[0]-X[0])/I,(_[1]-X[1])/I,(_[2]-X[2])/I),r.push(C),F.push(b===l?1:0);if(d>0){const C=U+(d-1)*2;w.push(C,C+1,C+2,C+1,C+3,C+2)}}}const N=new t.BufferGeometry;N.setAttribute("position",new t.Float32BufferAttribute(A,3)),N.setAttribute("aTan",new t.Float32BufferAttribute(S,3)),N.setAttribute("aSide",new t.Float32BufferAttribute(r,1)),N.setAttribute("aHaul",new t.Float32BufferAttribute(F,1)),N.setIndex(w);const f=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{}]),vertexShader:L0+`
      attribute vec3 aTan; attribute float aSide; attribute float aHaul; uniform float uPxK; varying float vS;
      void main(){
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec3 tv = normalize((modelViewMatrix * vec4(aTan, 0.0)).xyz);
        vec3 sd = cross(tv, normalize(mvPosition.xyz + vec3(0.0, 0.0, -1e-3))) + vec3(1e-4, 0.0, 0.0);
        sd = normalize(sd);
        float w = max(0.012, 0.85 * uPxK * length(mvPosition.xyz));
        w *= mix(1.0, smoothstep(45.0, 90.0, length(mvPosition.xyz)), aHaul);   // the cable we hang from would rule a line down the middle of the picture: it draws in from 45 m ahead
        mvPosition.xyz += sd * aSide * w; vS = aSide;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:D0+A0+`
      varying float vS;
      void main(){ vec3 col = vec3(0.090, 0.096, 0.108) * (uSkyCol * 1.5 + uSunCol * (0.30 + 0.55 * smoothstep(-0.2, 0.9, vS))) + vec3(0.012);   // steel grey with the sun along its top
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`});Object.assign(f.uniforms,i);const z=new t.Mesh(N,f);return z.frustumCulled=!1,z}function Fe(s,i,l){const A=ee(),S=i.red.clone(),r=i.red.clone().multiplyScalar(.62),F=new t.Color(.075,.125,.2),w=new t.Color(.8,.8,.78),N=new t.Color(.07,.07,.08),f=new t.Color(.45,.46,.48);A.box(.55,.24,.22,0,.02,0,N),A.tube(0,-.05,0,0,-.3,.62,.07,.07,N,5),A.tube(0,-.3,.62,0,-1.7,.62,.07,.07,N,5),A.tube(0,-1.7,.62,0,-1.93,0,.07,.09,N,5),A.box(1.62,.12,1.52,0,-1.9,0,S),A.box(2.08,.16,1.98,0,-2.02,0,S),A.box(1.3,.05,1.2,0,-1.82,0,w),A.box(.5,.1,.36,-.42,-1.78,.3,N),A.box(.36,.08,.5,.4,-1.79,-.28,f),A.box(2.1,.05,2,0,-2.11,0,w),A.box(1.9,.94,1.8,0,-2.56,0,F);for(const j of[-1,1])A.box(.05,.94,.05,0,-2.56,j*.91,r),A.box(.04,.9,.03,0,-3.5,j*.945,N),A.box(.5,.2,.02,-.5,-3.42,j*.945,w);for(const j of[-1,1])A.box(.05,.94,.05,j*.96,-2.56,0,r);for(const j of[-1,1])for(const P of[-1,1])A.box(.15,.94,.15,j*.93,-2.56,P*.88,S);A.box(1.99,.1,1.89,0,-3.07,0,w),A.box(1.97,.9,1.87,0,-3.5,0,r,0,0,0,S),A.box(1.6,.16,1.5,0,-4.02,0,r);const z=A.merge(),b=Math.ceil(s.total/j0),v=b*j0,U=b*2,d={value:0},X=new t.MeshStandardMaterial({vertexColors:!0,roughness:.42,metalness:.15});X.onBeforeCompile=j=>{j.uniforms.uCabGlow=d,j.fragmentShader=`uniform float uCabGlow;
`+j.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 float cgGlass = step(vColor.r * 1.5, vColor.b) * step(vColor.b, 0.3), cgRed = step(vColor.g * 2.5, vColor.r) * (1.0 - cgGlass);
 totalEmissiveRadiance += (cgRed * vec3(1.0, 0.023, 0.009) * (0.3 + vColor.r) + cgGlass * vec3(1.0, 0.72, 0.42) * 1.0 + (1.0 - cgRed - cgGlass) * vColor.rgb * 0.35) * uCabGlow;`)};const _=new t.InstancedMesh(z,X,U);_.frustumCulled=!1;const I=new t.Matrix4,C=new t.Quaternion,y=new t.Euler,G=new t.Vector3,e=new t.Vector3,p={x:0,y:0,slope:0};function q(j,P,e0){for(let n=0;n<U;n++){const W=n>=b,t0=W?n-b:n;let O=W?63-j+t0*j0:j+t0*j0;O=(O%v+v)%v;const o0=O>s.total-1||e0&&!W&&t0===0||l.beyond===!1&&O>s.ride+2;s.at(Math.min(O,s.total-1),p);const x=.02*Math.sin(P*1.3+n*2.1)+.012*Math.sin(P*3.1+n);y.set(x,W?Math.PI:0,.5*x),G.set(p.x,p.y,W?J0(p.x):0),e.setScalar(o0?1e-4:1+.7*f0(s.ride+25,s.ride+150,O)),_.setMatrixAt(n,I.compose(G,C.setFromEuler(y),e))}_.instanceMatrix.needsUpdate=!0}return{mesh:_,place:q,glow:d}}const Re=D0+A0+`
  uniform vec3 uBrick; uniform vec3 uPale;
  varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying vec4 vMisc; varying vec3 vUv; varying vec3 vSize; varying float vFace;
  void main(){
    float seed = vMisc.x; float cloud = cloudShade(vP.xz) * rimShade(vP); vec2 dU = fwidth(vUv.xy);
    vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0)); vec3 col;
    if (vFace > 2.5) { col = mix(uPale, uBrick, 0.42) * 0.8 * (uSkyCol * 0.9 + uBrick * 0.03); }
    else if (vFace > 0.5 && vMisc.w > 0.5) {
      // a mid-rise in painted render: bands of windows floor by floor, a lit face and a shaded one
      vec2 g = vec2(vUv.x / 3.4, vUv.y / 3.1); vec2 id = floor(g), f = fract(g);
      float lod = 1.0 - smoothstep(0.15, 0.6, max(dU.x / 3.4, dU.y / 3.1)), hp = h21(id + seed * 57.0);
      float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.28, f.y) * step(f.y, 0.78), band = step(0.28, f.y) * step(f.y, 0.78);
      float sunT = max(dot(N, uSunDir), 0.0) * cloud;
      vec3 light = uSunCol * min(sunT * 1.8, 1.0) + uSkyCol * 0.6 + vec3(0.30, 0.22, 0.15) * uFarK.z * 0.45 * (1.0 - 0.75 * uNight);
      vec3 wallC = vCol * (0.84 + 0.26 * vn(vUv.xy * 0.35 + seed * 9.0)) * (1.0 - 0.12 * step(0.5, fract(vUv.x / 6.8)));
      vec3 glass = mix(vec3(0.02, 0.03, 0.05), mix(uHaze, uZen, 0.5), 0.4 * (1.0 - step(0.8, hp)));
      col = mix(wallC * light, glass * (0.45 + 0.9 * sunT), mix(band * 0.5, win, lod));
      col += uSunCol * 2.2 * step(0.9, hp) * win * lod * sunT * (1.0 - uNight) * pow(max(sin(uTime * (0.8 + 1.5 * fract(hp * 13.0)) + hp * 90.0), 0.0), 12.0);
      col += uNight * mix(vec3(1.0, 0.80, 0.52), vec3(0.78, 0.88, 1.0), step(0.75, fract(hp * 3.3))) * step(0.45, hp) * mix(band * 0.35, win * 1.3, lod);
      col *= 0.5 + 0.5 * smoothstep(0.0, 9.0, vUv.z);
    }
    else if (vFace > 0.5) {
      vec2 g = vec2(vUv.x / 1.9, vUv.y / 3.7);
      float lod = 1.0 - smoothstep(0.15, 0.6, max(dU.x / 1.9, dU.y / 3.7));
      vec2 id = floor(g), f = fract(g);
      float hp = h21(id + seed * 57.0);
      vec3 V = normalize(uCam - vP + vec3(0.0, 1e-3, 0.0));
      vec3 Nj = normalize(N + 0.035 * lod * vec3(hp - 0.5, fract(hp * 7.0) - 0.5, fract(hp * 13.0) - 0.5));
      vec3 R = reflect(-V, Nj);
      vec3 sky = mix(uHaze, uZen, smoothstep(0.0, 0.8, R.y));
      vec3 land = uBrick * (0.55 + 0.3 * vn(R.xz * 6.0 + seed)) * (0.5 + 0.5 * cloud);
      vec3 sky2 = mix(uHaze, uZen * 1.2, smoothstep(0.0, 0.8, abs(R.y) * 0.7 + 0.12));
      float sunW = max(dot(N, uSunDir), 0.0) * cloud;
      vec3 refl = mix(mix(sky2, land, 0.22), sky, smoothstep(-0.06, 0.04, R.y)) * (0.40 + 0.60 * sunW);
      float fr = 0.62 + 0.38 * pow(1.0 - clamp(dot(V, N), 0.0, 1.0), 3.0);
      col = vCol * (0.03 + 0.07 * sunW) + refl * fr * mix(vec3(1.0), vCol * 2.0, 0.3) * (0.30 + 0.70 * sunW);
      col += uSunCol * 0.34 * sunW * fr * (1.0 - uNight);                                        // a low sun lights the whole facade it faces
      col *= 0.60 + 0.40 * step(0.24, fract(vUv.y / 14.8));                            // spandrel bands that survive distance
      vec2 id2 = floor(vUv.xy / vec2(7.6, 7.4)); float hq = h21(id2 + seed * 31.0);       // a pane here and there flashes the sun back and lets it go
      col += uSunCol * 2.4 * step(0.86, hq) * sunW * (1.0 - uNight) * pow(max(sin(uTime * (0.8 + 1.5 * fract(hq * 13.0)) + hq * 90.0), 0.0), 12.0);
      col *= 1.0 - 0.35 * lod * step(0.72, hp);                                      // blinds
      float mull = max(step(f.y, 0.10), step(0.46, abs(f.x - 0.5)));
      float sunT = max(dot(N, uSunDir), 0.0) * cloud;
      col = mix(col, vec3(0.36, 0.38, 0.40) * (uSunCol * sunT + uSkyCol * 0.6), mull * lod * 0.85);
      // glints: the true mirror direction, plus facades whose plan angle throws the sun toward the eye flare, single panes brightest
      vec2 rh = R.xz / max(length(R.xz), 1e-3), sh2 = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
      float az = max(dot(rh, sh2), 0.0), az2 = az * az, az8 = az2 * az2 * az2 * az2, az32 = az8 * az8 * az8 * az8;
      float flare = (0.10 * az8 * az8 + 1.2 * az32 * az32 * (0.3 + 0.7 * mix(1.0, step(0.55, hp), lod)) * (0.2 + 0.8 * step(0.62, fract(seed * 13.7)))) * (1.0 - mull * lod);
      col += uSunCol * (8.0 * pow(max(dot(R, uSunDir), 0.0), 900.0) + 1.6 * pow(max(dot(R, uSunDir), 0.0), 60.0) + flare * smoothstep(0.1, 0.5, uSunDir.y)) * cloud * (1.0 - uNight);
      col += uNight * mix(vec3(1.0, 0.86, 0.62), vec3(0.75, 0.88, 1.0), step(0.7, fract(hp * 3.3))) * step(0.5, hp) * (1.0 - mull * lod) * mix(0.55, 1.5, lod);
      col *= 0.42 + 0.58 * smoothstep(0.0, 16.0, vUv.z);                                 // dark podium: the towers stand on the floor, not in it
    } else {
      vec2 hs = vSize.xz * 0.5; float edge = min(hs.x - abs(vUv.x), hs.y - abs(vUv.y));
      vec3 alb = mix(vec3(0.30, 0.31, 0.32), vec3(0.20, 0.21, 0.23), step(edge, 0.7));
      alb = mix(alb, vec3(0.62), step(abs(vUv.x - hs.x * 0.3), hs.x * 0.22) * step(abs(vUv.y + hs.y * 0.2), hs.y * 0.3));
      col = alb * (uSunCol * max(uSunDir.y, 0.0) * cloud + uSkyCol) + uNight * vec3(1.0, 0.2, 0.1) * step(edge, 0.7) * 0.6 * (1.0 - step(0.5, vMisc.w));
    }
    col = mix(col, bowlAir(col, vP), 0.6);                                              // the towers stand clear of the haze that lies on the floor
    col = mix(col, uHaze * 1.25 * (uSunCol * 0.55 + uSkyCol * 1.4), seaVeil(vP.y) * 0.9);
    gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
    #include <fog_fragment>
  }`;function Le(s,i,l,A,S,r){const f=new Float32Array(612),z=new Float32Array(612),b=new Float32Array(816),v=new Float32Array(612),U=new Float32Array(816),d=1400+i.range(-40,60),X=120+i.range(-60,80),_=i.range(0,Math.PI),I=[],C=[new t.Color("#4f86b8"),new t.Color("#3f9c98"),new t.Color("#8a94a6"),new t.Color("#b98a4e"),l.blue.clone().lerp(new t.Color("#ffffff"),.3)];let y=0;const G=[];for(let n=0,W=0;n<40&&W<900;W++){const t0=230*Math.sqrt(i()),O=i()*6.283,o0=d+Math.cos(O)*t0*1.25,x=X+Math.sin(O)*t0;let a=!0;for(const L of I)if(Math.hypot(L[0]-o0,L[1]-x)<34){a=!1;break}if(!a)continue;I.push([o0,x]),n++;const Z=(60+90*Math.pow(i(),1.6))*(1-.35*t0/230),E=i.range(20,30),a0=i.range(18,28),r0=_+(i()<.7?0:i.range(-.5,.5)),s0=i.pick(C),H=s.height(o0,x),n0=i(),K=(L,D,Q)=>{f[y*3]=o0,f[y*3+1]=H,f[y*3+2]=x,z[y*3]=L,z[y*3+1]=D,z[y*3+2]=Q,b[y*4]=Math.cos(r0),b[y*4+1]=Math.sin(r0),v[y*3]=s0.r,v[y*3+1]=s0.g,v[y*3+2]=s0.b,U[y*4]=n0,U[y*4+1]=1,U[y*4+2]=1,y++};K(E,Z*(i()<.6?i.range(.55,.8):1),a0),z[(y-1)*3+1]<Z-1?K(E*i.range(.55,.75),Z,a0*i.range(.6,.8)):n0*7.31%1<.5&&K(E*.6,Z*(1.14+.1*(n0*3.17%1)),a0*.6),G.push([o0,x,.45*(E+a0)*.5,Z])}{const n=Z0("rim-midrise:"+r),W=["#d9d2c0","#c9b79a","#b9c6d2","#d2a48c","#a8b0b4","#c88a62","#e2ddd0"].map(O=>new t.Color(O)),t0=[];for(let O=0,o0=0;O<84&&o0<2400&&y<204;o0++){const x=Math.sqrt(n()),a=170+450*x,Z=n()*6.283,E=d+Math.cos(Z)*a*1.35,a0=X+Math.sin(Z)*a,r0=(24+32*n())*(1-.5*x),s0=n.range(17,30),H=n.range(13,19),n0=n()<.5,K=n()<.8?0:n.range(-.4,.4),L=n.pick(W),D=n.range(.62,.8),Q=n();let M=!S.taken.has(Y0(E,a0));for(const V of I)M&&Math.hypot(V[0]-E,V[1]-a0)<31&&(M=!1);for(const V of _0)M&&Math.abs(E-V[0])<V[2]+16&&Math.abs(a0-V[1])<V[2]+16&&(M=!1);if(!M)continue;I.push([E,a0]),O++;const J=_+(n0?Math.PI/2:0)+K;f[y*3]=E,f[y*3+1]=s.height(E,a0),f[y*3+2]=a0,z[y*3]=s0,z[y*3+1]=r0,z[y*3+2]=H,b[y*4]=Math.cos(J),b[y*4+1]=Math.sin(J),v[y*3]=L.r*D,v[y*3+1]=L.g*D,v[y*3+2]=L.b*D,U[y*4]=Q,U[y*4+1]=1,U[y*4+2]=1,U[y*4+3]=1,y++,t0.push([E,a0,.45*(s0+H)*.5,r0])}t0.sort((O,o0)=>o0[3]-O[3]);for(const O of t0)G.push(O)}const e=A.uTw.value;for(let n=0;n<e.length;n++){const W=G[n];W?e[n].set(W[0],W[1],W[2],W[3]):e[n].set(0,0,0,0)}const p=ue(),q=new t.InstancedBufferGeometry;q.index=p.index;for(const n of["position","normal","aFace"])q.setAttribute(n,p.attributes[n]);const j=(n,W)=>new t.InstancedBufferAttribute(n.subarray(0,y*W),W);q.setAttribute("iPos",j(f,3)),q.setAttribute("iSize0",j(z,3)),q.setAttribute("iRotGrad",j(b,4)),q.setAttribute("iCol",j(v,3)),q.setAttribute("iMisc",j(U,4)),q.instanceCount=y;const P=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,vertexShader:ve,fragmentShader:Re,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{uBrick:{value:l.brick},uPale:{value:l.pale},uFarGrow:{value:0}}])});Object.assign(P.uniforms,A);const e0=new t.Mesh(q,P);return e0.frustumCulled=!1,{mesh:e0,center:new t.Vector3(d,s.height(d,X)+60,X)}}const me=`
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, min(fogFactor, uFarK.x));
  #endif`;async function Be(s,i,l,A,S){const r=24*Math.PI/180,F=4475,w=Math.cos(r),N=Math.sin(r),f=new t.Vector3(F*w,-90,F*N),z=-N,b=w,v=w,U=N,d=4400,X=2400,_=1370,I=120,C=44,y=l.range(0,50),G=l.range(0,50),e=l.shuffle([.74,1,.82]);e[0]===1&&l()<.5&&e.reverse();const p=[{u:-.26+l.range(-.03,.03),v:.42,h:e[0],r:.3},{u:.01+l.range(-.03,.03),v:.48,h:e[1],r:.33},{u:.27+l.range(-.03,.03),v:.44,h:e[2],r:.29}],q=(D,Q)=>{let M=0;for(const V of p){const i0=D-V.u,o=(Q-V.v)*.62,h=Math.atan2(o,i0),c=Math.hypot(i0,o)/(V.r*(1+.28*i.n2(h*1.9+V.u*9,y)+.12*i.n2(h*5.3,G+V.u*5))),g=Math.max(0,1-c);M=Math.max(M,V.h*(.72*Math.pow(g,1.55)+.28*g))}const J=.34*Math.max(0,1-Math.abs(Q-.46)/.42)*Math.max(0,1-Math.abs(D)/.5);return M=Math.max(M,J*(.8+.3*i.n2(D*6+y,Q*3))),M*=.8+.3*i.ridged2(D*3.4+y,Q*3.1+G,4),M*=.95+.1*i.ridged2(D*11+G,Q*8+y,2),M*f0(.5,.42,Math.abs(D))*f0(0,.1,Q)*f0(1,.86,Q)},j=Math.ceil(.66*C),P=I+1,e0=P*(C+1),n=new Float32Array(e0*3),W=new Float32Array(e0),t0=new Float32Array(e0*2),O=[];for(let D=0;D<=C;D++)for(let Q=0;Q<=I;Q++){const M=Q/I-.5,J=D/C,V=D*P+Q,i0=q(M,J);n[V*3]=f.x+z*M*d+v*(J-.35)*X,n[V*3+1]=f.y+i0*_,n[V*3+2]=f.z+b*M*d+U*(J-.35)*X,W[V]=i0,Q<I&&D<C&&D<j&&O.push(V,V+1,V+P,V+1,V+P+1,V+P)}await s.yield();{const D=S.uSunDir.value,Q=(i0,o)=>{const h=i0<0?0:i0>I-.001?I-.001:i0,c=o<0?0:o>C-.001?C-.001:o,g=h|0,B=c|0,m=h-g,u=c-B,k=B*P+g;return(W[k]*(1-m)+W[k+1]*m)*(1-u)+(W[k+P]*(1-m)+W[k+P+1]*m)*u},M=(D.x*z+D.z*b)/d*I,J=(D.x*v+D.z*U)/X*C,V=Math.max(.05,D.y)/_;for(let i0=0;i0<=C;i0++)for(let o=0;o<=I;o++){const h=i0*P+o,c=W[h];let g=1;for(let m=50,u=0;u<20&&g>0;u++,m*=1.24){const k=(Q(o+M*m,i0+J*m)-(c+V*m))*_,T=6+.05*m;k>-T&&(g=Math.min(g,z0(1-(k+T)/(2*T),0,1)))}const B=(Q(o-3,i0)+Q(o+3,i0)+Q(o,i0-2)+Q(o,i0+2))*.25;t0[h*2]=g,t0[h*2+1]=1-z0((B-c)*9,0,1)}await s.yield()}const o0=new t.BufferGeometry;if(o0.setAttribute("position",new t.BufferAttribute(n,3)),o0.setAttribute("aH",new t.BufferAttribute(W,1)),o0.setAttribute("aSh",new t.BufferAttribute(t0,2)),o0.setIndex(O),o0.computeVertexNormals(),o0.attributes.normal.array[(Math.round(C/3)*P+(I>>1))*3+1]<0){for(let D=0;D<O.length;D+=3){const Q=O[D+1];O[D+1]=O[D+2],O[D+2]=Q}o0.setIndex(O),o0.computeVertexNormals()}const x=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{uIce:{value:A.ice},uPale:{value:A.pale}}]),vertexShader:L0+`attribute float aH; attribute vec2 aSh; varying vec3 vP; varying vec3 vN; varying float vH; varying vec2 vSh;
      void main(){ vP = position; vN = normal; vH = aH; vSh = aSh; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:D0+A0+`uniform vec3 uIce; uniform vec3 uPale; varying vec3 vP; varying vec3 vN; varying float vH; varying vec2 vSh;
      void main(){
        vec3 N0 = normalize(vN + vec3(0.0, 1e-4, 0.0));
        float sh = clamp(vSh.x, 0.0, 1.0), ao = clamp(vSh.y, 0.0, 1.0);
        float n = fbm(vP.xz * 0.004 + vP.y * 0.003), n2v = fbm(vP.xz * 0.02 + vP.y * 0.017 + 5.0);
        vec3 N = normalize(N0 + 0.45 * vec3(n2v - 0.5, 0.0, fbm(vP.zx * 0.02 + 9.0) - 0.5));
        float steep = 1.0 - smoothstep(0.42, 0.74, N.y + 0.25 * (n2v - 0.5));
        // rock bands: cliffs that cross the snow faces at their own heights, too steep to hold it
        float band = smoothstep(0.60, 0.72, vn(vec2(dot(vP.xz, vec2(0.6, 0.8)) * 0.0032 + 4.0 * n, vP.y * 0.0075 + 3.0 * n2v))) * smoothstep(0.35, 0.6, vn(vP.xz * 0.0016 + 7.0)) * (1.0 - smoothstep(0.78, 0.94, N0.y));
        float snowline = smoothstep(0.24 - 0.13 * uWet, 0.40 - 0.16 * uWet, vH + 0.14 * (n - 0.5) + 0.10 * (1.0 - ao));
        vec3 rock = mix(vec3(0.13, 0.11, 0.125), vec3(0.24, 0.185, 0.17), n2v) * (0.9 + 0.2 * step(0.5, fract(vP.y * 0.013 + 3.0 * n)));
        vec3 scree = mix(uPale * 0.62, rock, 0.5 + 0.3 * n);
        vec3 ice = uIce * (1.02 + 0.10 * n2v);
        // glaciers lie in the hollows: blue ice, crossed by crevasses
        float gl = (1.0 - smoothstep(0.45, 0.85, ao)) * (1.0 - steep);
        float crev = smoothstep(0.72, 0.9, abs(sin(vP.y * 0.085 + 5.0 * n2v))) * gl;
        ice = mix(ice, vec3(0.56, 0.76, 0.93), 0.35 * smoothstep(0.55, 0.9, fbm(vP.xz * 0.012 + vP.y * 0.02)) + 0.4 * gl);
        ice = mix(ice, vec3(0.20, 0.40, 0.62), 0.6 * crev);
        vec3 alb = mix(scree, mix(ice, rock, max(steep * (0.82 - 0.3 * uWet), band * 0.85)), snowline);
        float sunT = max(dot(N, uSunDir), 0.0) * sh;
        vec3 col = alb * (uSunCol * sunT * 1.05 + uSkyCol * (0.55 + 0.5 * N.y) * (0.75 + 0.5 * ao));
        col = mix(col, uHaze, (0.16 + 0.14 * (1.0 - smoothstep(0.0, 0.35, vH))) * uFarK.y);        // air between here and there
        gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
        ${me}
      }`});Object.assign(x.uniforms,S);const a=new t.Mesh(o0,x);a.frustumCulled=!1;const Z=[],E=[],a0=[],r0=[];let s0=p[0];for(const D of p)D.h>s0.h&&(s0=D);const H=new t.Vector3(.45+z*.9,.04,b*.9).normalize();for(const D of p){const Q=D===s0,M=Q?1900:600,J=12,V=Z.length/3,i0=l.range(0,20),o=f.x+z*D.u*d+v*(D.v-.35)*X,h=f.z+b*D.u*d+U*(D.v-.35)*X,c=f.y+q(D.u,D.v)*_-(Q?15:8);for(let g=0;g<=J;g++){const B=g/J,m=Q?38+315*Math.pow(B,.7):18+113*Math.pow(B,.7),u=(Q?139:50)*B;for(const k of[-1,1])Z.push(o+H.x*B*M,c+u+k*m,h+H.z*B*M),E.push(B,k),a0.push(i0,Q?1:.55);if(g<J){const k=V+g*2;r0.push(k,k+1,k+2,k+1,k+3,k+2)}}}const n0=new t.BufferGeometry;n0.setAttribute("position",new t.Float32BufferAttribute(Z,3)),n0.setAttribute("uv",new t.Float32BufferAttribute(E,2)),n0.setAttribute("aPh",new t.Float32BufferAttribute(a0,2)),n0.setIndex(r0);const K=new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{}]),vertexShader:L0+`attribute vec2 aPh; varying vec2 vUv; varying vec2 vPh;
      void main(){ vUv = uv; vPh = aPh; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:D0+A0+`varying vec2 vUv; varying vec2 vPh;
      void main(){
        float t = clamp(vUv.x, 0.0, 1.0), s = clamp(vUv.y, -1.0, 1.0);
        vec2 q = vec2(t * 5.0 - uTime * 0.05 + vPh.x, s * 1.4 + vPh.x);
        float d = fbm(q) * 0.65 + fbm(q * 2.7 + 3.0) * 0.35;
        float env = smoothstep(0.0, 0.05, t) * (1.0 - t) * (1.0 - t * 0.3) * (1.0 - smoothstep(0.35, 1.0, abs(s + 0.25 * (d - 0.5))));
        float a = smoothstep(0.22, 0.52, d * (0.6 + env)) * sqrt(max(env, 0.0)) * vPh.y * 1.6;
        vec3 col = mix(vec3(0.62, 0.72, 0.90), vec3(1.0), smoothstep(-0.6, 0.7, s + d - 0.5)) * (uSunCol * 0.85 + uSkyCol * 0.5);
        gl_FragColor = vec4(col, clamp(a, 0.0, 0.92));
        ${me}
      }`});Object.assign(K.uniforms,S);const L=new t.Mesh(n0,K);return L.frustumCulled=!1,L.renderOrder=2,{mesh:a,banner:L,bearing:r,half:Math.atan(.5*d/F),top:new t.Vector3(f.x+z*s0.u*d+v*(s0.v-.35)*X,f.y+q(s0.u,s0.v)*_,f.z+b*s0.u*d+U*(s0.v-.35)*X),look:new t.Vector3(f.x,f.y+_*.5,f.z)}}function Te(s,i,l,A,S){const r=Math.min(Math.round(70*A),s.n),F=12,w=[],N=[],f=[],z=[];for(let I=0;I<r;I++){const C=i.int(0,s.n-1),y=s.pos[C*3]+i.range(-1.5,1.5),G=s.pos[C*3+1]+s.size[C*3+1]+.6,e=s.pos[C*3+2]+i.range(-1.5,1.5),p=i();I%2===0&&z.push([y,G,e,p,0])}const b=Z0("rim-smoke:"+S),v=[],U=[];for(let I=0;I<s.n;I++){const C=s.pos[I*3],y=s.pos[I*3+2],G=Math.abs(y);C>40&&C<480&&G>60&&G<150&&(v.push(I),C<170&&U.push(I))}for(let I=0;I<30&&v.length>0;I++){const C=I<12&&U.length>0?U:v,y=C[b.int(0,C.length-1)];z.push([s.pos[y*3]+b.range(-1,1),s.pos[y*3+1]+s.size[y*3+1]+.4,s.pos[y*3+2]+b.range(-1,1),b(),1])}for(const I of z){const C=w.length/3;for(let y=0;y<=F;y++){for(const G of[-1,1])w.push(I[0],I[1],I[2]),N.push(y/F,G,I[3],I[4]);if(y<F){const G=C+y*2;f.push(G,G+1,G+2,G+1,G+3,G+2)}}}const d=new t.BufferGeometry;d.setAttribute("position",new t.Float32BufferAttribute(w,3)),d.setAttribute("aTS",new t.Float32BufferAttribute(N,4)),d.setIndex(f);const X=new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{}]),vertexShader:L0+`
      uniform float uTime; attribute vec4 aTS; varying vec4 vTS; varying float vND;
      void main(){
        float t = aTS.x, sd = aTS.z, big = aTS.w; vTS = aTS;
        float H = mix(12.0 + 12.0 * sd, 17.0 + 13.0 * sd, big), ph = sd * 40.0;   // low and blown flat by the updraught: chimney smoke, not a pillar
        vec3 p = position + vec3(0.0, t * H, 0.0);
        p.x += t * mix(5.0 + 4.0 * sd, 9.0 + 7.0 * sd, big) + t * t * mix(8.0 + 6.0 * sd, 16.0 + 12.0 * sd, big) + sin(uTime * 0.7 + t * 5.0 + ph) * t * mix(1.6, 2.6, big);
        p.z += t * mix(2.0, 4.0, big) + t * t * mix(3.0, 7.0, big) + cos(uTime * 0.55 + t * 4.0 + ph * 1.3) * t * mix(1.5, 2.4, big);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        float w = max(mix(0.4 + 3.6 * t, 0.5 + 3.6 * t, big), 0.0016 * length(mvPosition.xyz));
        mvPosition.x += aTS.y * w; vND = length(mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:D0+A0+`
      varying vec4 vTS; varying float vND;
      void main(){
        float t = clamp(vTS.x, 0.0, 1.0), s = clamp(vTS.y, -1.0, 1.0), big = vTS.w;   // along 0..1 and across -1..1, held to their ranges before the squares below
        // puffs that climb the plume: two scales of noise scrolling up it
        float puff = 0.62 * vn(vec2(s * 1.3 + vTS.z * 9.0, t * 4.5 - uTime * 0.55)) + 0.38 * vn(vec2(s * 3.1 + vTS.z * 5.0, t * 11.0 - uTime * 1.1));
        float edge = 1.0 - s * s; edge *= edge;
        float a = smoothstep(0.0, 0.07, t) * (1.0 - t) * edge * smoothstep(0.26, 0.74, puff + 0.34 * (1.0 - t)) * mix(0.36, (0.55 + 0.25 * (1.0 - smoothstep(0.0, 0.35, t))) * (1.0 - 0.7 * t), big);
        vec3 col = mix(vec3(0.50, 0.50, 0.53), vec3(0.74, 0.72, 0.70), puff) * (uSunCol * 0.8 * (1.0 - 0.7 * uRimSh.z) * (0.6 + 0.4 * smoothstep(-0.6, 0.6, s)) + uSkyCol * 1.1);
        a *= mix(smoothstep(14.0, 40.0, vND), smoothstep(45.0, 110.0, vND), big);                    // close to the eye a plume is a smear across the picture: it thins away
        gl_FragColor = vec4(col, a * (1.0 - 0.4 * uRimSh.z) * (1.0 - 0.55 * uNight));
        #include <fog_fragment>
      }`});Object.assign(X.uniforms,l);const _=new t.Mesh(d,X);return _.frustumCulled=!1,_.renderOrder=3,_}async function Ve(s,i={}){const l=s.rng,A=be(l.int(1,2147483e3)),S=i.palette&&i.palette.length>=7?i.palette:we,r={blue:new t.Color(S[0]),brick:new t.Color(S[1]),pale:new t.Color(S[2]),ice:new t.Color(S[3]),red:new t.Color(S[4]),green:new t.Color(S[5]),violet:new t.Color(S[6])};r.ice.multiplyScalar(.84),r.pale.multiplyScalar(.92);const F=64*Math.PI/180,w=new t.Vector3(-.38*Math.cos(F),Math.sin(F),-.925*Math.cos(F)).normalize();i.sunDir&&(w.copy(i.sunDir).normalize(),w.y<.12&&(w.y=.12,w.normalize()));const N=new t.DataTexture(new Uint8Array([0,0,0,255]),1,1);N.needsUpdate=!0;const f={uSunDir:{value:w.clone()},uSunCol:{value:new t.Color("#FFF6E6").multiplyScalar(1.02)},uSkyCol:{value:new t.Color(.115,.17,.33)},uCam:{value:new t.Vector3(0,60,0)},uTime:{value:0},uNight:{value:0},uRimSh:{value:new t.Vector3(0,0,0)},uCab:{value:new t.Vector4(0,0,0,0)},uLine:{value:new t.Vector4(0,0,0,0)},uHaze:{value:new t.Color(.5,.66,.9)},uZen:{value:new t.Color(.05,.14,.42)},uHM:{value:N},uHMRect:{value:new t.Vector4(0,0,1e-7,1e-7)},uCloudY:{value:-1e5},uWet:{value:0},uFarK:{value:new t.Vector3(.42,1,1)},uCloudU:{value:new t.Vector4(0,0,100,0)},uDist:{value:new t.Vector4(0,0,0,0)},uAir:{value:new t.Vector4(0,0,0,0)},uTw:{value:Array.from({length:48},()=>new t.Vector4(0,0,0,0))},uPxK:{value:.0016},uBS:{value:N},uBSRect:{value:new t.Vector4(0,0,1e-7,1e-7)}};{const M=Z0("rim-district:"+s.seed);f.uDist.value.set(M.range(0,6.283),M.range(0,6.283),0,0)}const z=new t.Group,b=new t.Group;b.add(z),b.name="over-the-rim-hero",i.frame!=="brief"&&(z.rotation.y=Math.PI/2,z.position.set(0,-T0,V0)),z.updateMatrix();const v=z.matrix.clone(),U=v.clone().invert(),d=(M,J,V)=>new t.Vector3(M,J,V).applyMatrix4(v),X=(M,J,V)=>new t.Vector3(M,J,V).transformDirection(v),_=ze(A,l);await s.yield();const I=await Se(s,_,w);f.uBS.value=I.tex,f.uBSRect.value.copy(I.rect),await s.yield();const C=await Me(s,_,w),y=l.range(.05,.7),G=ke(f,r,_.pitch,i.green??y,s.quality?.detail??1);Object.assign(G.uniforms,f);const e=new t.Mesh(C,G);e.frustumCulled=!1,z.add(e),await s.yield();const p=Ce(_,l,r,f,w);z.add(p.mesh),await s.yield();const q=qe(),j=await De(s,_,l,r,i);await s.yield();const P=new t.MeshStandardMaterial({vertexColors:!0,roughness:.65,metalness:.1});P.onBeforeCompile=M=>{M.uniforms.uFillSun=f.uSunCol,M.fragmentShader=`uniform vec3 uFillSun;
`+M.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance += vColor.rgb * uFillSun * vec3(0.15, 0.10, 0.045);`)},z.add(new t.Mesh(j.structure,P));const e0={value:0},n=new t.MeshStandardMaterial({vertexColors:!0,roughness:.5,metalness:.3});n.onBeforeCompile=M=>{M.uniforms.uSpin=e0,M.vertexShader=`attribute vec3 aPivot; uniform float uSpin;
`+M.vertexShader.replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
 float csn = cos(uSpin), snn = sin(uSpin); objectNormal.xy = vec2(csn * objectNormal.x - snn * objectNormal.y, snn * objectNormal.x + csn * objectNormal.y);`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vec2 rel = transformed.xy - aPivot.xy; transformed.xy = aPivot.xy + vec2(csn * rel.x - snn * rel.y, snn * rel.x + csn * rel.y);`)};const W=new t.Mesh(j.wheels,n);W.frustumCulled=!1,z.add(W),z.add(Ne(q,f)),await s.yield();const t0=Fe(q,r,i);z.add(t0.mesh),await s.yield();const O=await Ae(s,_,l,r,w,p,j.pylonXZ,{...i,districtOffset:[f.uDist.value.x,f.uDist.value.y]},f);for(const M of O.meshes)z.add(M);await s.yield(),O.near.n>0&&z.add(Te(O.near,l,f,s.quality?.detail??1,s.seed)),await s.yield();const o0=Le(_,l,r,f,p,s.seed);z.add(o0.mesh),await s.yield();let x=null;i.peak!==!1&&(x=await Be(s,A,l,r,f),z.add(x.mesh),z.add(x.banner)),await s.yield();const a=M=>d(M,y0(M),0),Z=[-90,-72,-54,-36,-20,-6,4,14,26,38,62,100,150,200,250,300,325,335,345,I0,372,393,M0],E={rim:d(0,0,0),entry:a(H0),flyThrough:Z.map(a),portalSeat:{position:d(M0,X0,0),facing:X(-Math.cos(10*Math.PI/180),Math.sin(10*Math.PI/180),0),radius:7,tilt:10*Math.PI/180},viewpoints:{rimReveal:a(8),firstSpur:a(142),secondSpur:a(285),approach:a(378)},lookAt:{bowl:d(1250,-330,260),towers:o0.center.clone().applyMatrix4(v),peak:x?x.look.clone().applyMatrix4(v):d(3900,450,1750),pitch:d(_.pitch.x,_.pitch.y,_.pitch.z),farWall:d(3050,-160,300)},pylons:j.pylons.map(M=>({base:M.base.clone().applyMatrix4(v),top:M.top.clone().applyMatrix4(v)})),gantryIndex:j.gantryIndex,spurs:[{from:a(104),to:a(182)},{from:a(228),to:a(325)}],pitch:d(_.pitch.x,_.pitch.y,_.pitch.z),sunDir:w.clone().transformDirection(v),briefToLocal:v.clone(),returnCableOffset:O0,cableAboveEye:R0,rideLength:q.ride},a0=new Set;for(let M=0;M<O.near.n;M++){const J=O.near.pos[M*3],V=O.near.pos[M*3+2];J<470&&Math.abs(V)<90&&a0.add((Math.floor(J/6)+64)*1024+Math.floor(V/6)+64)}let r0=-1,s0=null;const H={c:d(560,-130,0),r:300,h:700},n0=new t.Vector3,K=new t.Matrix4,L=new t.Vector3,D=new t.Vector2,Q={object:b,radius:H.r,height:H.h,center:H.c,anchors:E,ground:!1,groundY:0,extent:{radius:1900,depth:-T0,peakTop:x?x.top.clone().applyMatrix4(v):null},stats:{houses:O.count},uniforms:f,roadLines:p.lines,pitchInfo:_.pitch,setCabinGlow(M){t0.glow.value=M},setPitchDots(M){G.uniforms.uDots.value=M},makeCable(M){return de(M,f)},landmarks:_0,barrioAt(M,J){return _.barrio(M,J)},houseAt(M,J){const V=Math.floor(M/6)+64,i0=Math.floor(J/6)+64;for(let o=-1;o<=1;o++)for(let h=-1;h<=1;h++)if(a0.has((V+o)*1024+i0+h))return!0;return!1},massif:x?{bearing:x.bearing,half:x.half}:null,farRimAt(M){const J=Math.cos(M),V=Math.sin(M),i0=c=>(_.height(J*c,V*c),_.info.d>0);let o=200;for(;o<8e3&&i0(o);)o+=50;let h=o-50;for(let c=0;c<10;c++){const g=.5*(h+o);i0(g)?h=g:o=g}return o},eyeYAt(M){return y0(M)},heightAt(M,J){return L.set(M,0,J).applyMatrix4(U),_.height(L.x,L.z)+v.elements[13]},groundAt(M,J){L.set(M,0,J).applyMatrix4(U);const V=C.userData.grid,i0=V.ds,o=V.ths,h=o.length,c=C.attributes.position.array,g=(V0-L.x)/B0,B=L.z/_.B,m=Math.atan2(B,g),u=(1-Math.hypot(g,B)/_.wob(m))*B0;let k=0,T=i0.length-1,Y=0,R=h-1;for(;T-k>1;){const N0=k+T>>1;i0[N0]<=u?k=N0:T=N0}for(;R-Y>1;){const N0=Y+R>>1;o[N0]<=m?Y=N0:R=N0}const $=(k*h+Y)*3,h0=$+3,l0=$+h*3,u0=l0+3,m0=c[h0]-c[$],g0=c[h0+2]-c[$+2],c0=c[l0]-c[$],v0=c[l0+2]-c[$+2],p0=L.x-c[$],x0=L.z-c[$+2],d0=1/(m0*v0-g0*c0),k0=(p0*v0-x0*c0)*d0,P0=(m0*x0-g0*p0)*d0;if(k0+P0<=1)return c[$+1]+k0*(c[h0+1]-c[$+1])+P0*(c[l0+1]-c[$+1])+v.elements[13];const W0=c[l0]-c[u0],te=c[l0+2]-c[u0+2],oe=c[h0]-c[u0],ae=c[h0+2]-c[u0+2],se=L.x-c[u0],ne=L.z-c[u0+2],ie=1/(W0*ae-te*oe),pe=(se*ae-ne*oe)*ie,xe=(W0*ne-te*se)*ie;return c[u0+1]+pe*(c[l0+1]-c[u0+1])+xe*(c[h0+1]-c[u0+1])+v.elements[13]},setProgress(M){r0=z0(M,0,1)*q.ride},setTravel(M){r0=Math.max(0,M)},setSun(M,J,V){s0=M?new t.Vector3().copy(M).normalize():null,J&&f.uSunCol.value.copy(J),V&&f.uSkyCol.value.copy(V)},update(M,J,V){f.uTime.value=J,z.updateWorldMatrix(!0,!1),K.copy(z.matrixWorld).invert(),V&&(n0.setFromMatrixPosition(V.matrixWorld),f.uCam.value.copy(n0.applyMatrix4(K)),s.renderer&&V.projectionMatrix&&(s.renderer.getDrawingBufferSize(D),f.uPxK.value=2/(Math.max(.2,Math.abs(V.projectionMatrix.elements[5]))*Math.max(120,D.y)))),s0&&(n0.copy(s0).transformDirection(K),n0.y>.05&&f.uSunDir.value.copy(n0));const i0=r0>=0,o=i0?r0:J*6;t0.place(o,J,i0&&!i.ownCabin),e0.value=-(o/.28)%6.2831853},dispose(){N.dispose(),I.tex.dispose()}};return Q.update(0,0,null),Q}export{Ie as RIM_GLSL,We as RIM_PLACES,Ve as buildHero,J0 as returnZ};
