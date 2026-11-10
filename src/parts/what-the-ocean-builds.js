import*as h from"three";const I={r:66,w:132,h:62},ie={H:330,r:46},X=ie.H*2/3,Ce=X+I.w,P={length:610,bays:12,crown:150,half:30,z0:Ce,flight:Ce+610+8},K=e=>Math.min(1,Math.max(0,e)),_=(e,a,n)=>{const i=K((n-e)/(a-e));return i*i*(3-2*i)},C=(e,a,n)=>e+(a-e)*n,dt=["deal","hall","legs","films","webs","tips","lumps","rain","pieces","collar","older","far","banks","wisps","flakes","wind","clock"];function mt(e){const a={};for(const n of dt)a[n]=e.fork(n);return a}function O(e,a){let n=0;for(const[i,o]of a)if(n+=i,e<n)return o;return a[a.length-1][1]}function Dt(e){const a=O(e(),[[.5,"dusk"],[.25,"dawn"],[.25,"both"]]),n=O(e(),[[3/4,-1],[1/4,1]]),i=O(e(),[[1/4,!0],[3/4,!1]])&&a!=="both",o=O(e(),[[2/3,.95],[1/3,.93]]),t=O(e(),[[2/3,[.25,.5,.75]],[1/3,[.3,.62]]]),m=O(e(),[[1/2,"rose"],[1/4,"ivory"],[1/4,"pearl"]]),r=O(e(),[[1/3,1],[1/3,2],[1/3,3]]),s=O(e(),[[1/2,-1],[1/2,1]]);return{hourKey:a,sideA:n,heavy:i,ratio:o,tiers:t,frothKey:m,structures:r,swellSide:s}}const J=e=>(P.z0-e)/P.flight,ut=e=>P.z0-P.flight*e,G=P.length/P.bays,be=e=>e/P.flight,wt=1+4/P.bays,pt=e=>G*(3+4*K(-e/P.length)),He=e=>{const a=ut(e);return Math.max(-P.length-20,Math.min(0,a-pt(a)))};function xe(e){let a=0,n=1;for(let i=0;i<30;i++){const o=.5*(a+n);He(o)>=e?a=o:n=o}return .5*(a+n)}const B={gone:J(1.5*G),up:J(X),burst:J(X+I.r),arch:be(2*G/wt),end:J(-P.length),last:0,fall:0};B.last=xe(-P.length),B.fall=xe(-P.length*2/3);const vt=e=>[_(B.burst,B.up,e),_(B.up,B.gone-be(.1*G),e)],We=e=>{const a=K((e-B.fall)/(B.end-B.fall));return a*(1.6-.6*a)},re=1.3,Ee=.6;function gt(){const e=(n,i,o)=>({value:new h.Vector3(n,i,o)}),a=n=>({value:new h.Color(n)});return{uU:{value:0},uTime:{value:0},uSag:{value:0},uFogDen:{value:55e-5},uBank:{value:1},uSunA:e(-.61,.1,-.79),uSunB:e(.61,-.07,-.79),uAzA:{value:new h.Vector2(-.61,-.79)},uAzB:{value:new h.Vector2(.61,-.79)},uSunACol:a("#FF4A38"),uSunBCol:a("#BCD4FF"),uAmbLo:a("#1C1216"),uAmbHi:a("#262A36"),uFogA:a("#5A1E2C"),uFogB:a("#3A4C86"),uFogMid:a("#2A1838"),uFroth:a("#F4E6E2"),uRose:a("#E8A0A8"),uPulseCol:a("#FFE3E6"),uFill:e(.085,.09,.115),uZen:a("#0A0A18"),uHorA:a("#A8242E"),uHorB:a("#121A3E"),uHorMid:a("#1C0C1E"),uRadA:{value:new h.Vector4(.91,.2,.165,6)},uRadB:{value:new h.Vector4(.81,.88,1,12)},uDisc:{value:new h.Vector4(2.2,.5,1,1)}}}const L=`
uniform float uU, uTime, uSag, uFogDen, uBank;
uniform vec3 uSunA, uSunB, uSunACol, uSunBCol, uAmbLo, uAmbHi, uFogA, uFogB, uFogMid, uFroth, uRose, uPulseCol, uFill;
uniform vec2 uAzA, uAzB;
float wH(vec3 p){ p = fract(p*vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y)*p.z); }
float wH2(vec2 p){ vec3 q = fract(vec3(p.xyx)*0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y)*q.z); }
float wN(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(wH(i), wH(i + vec3(1,0,0)), f.x), mix(wH(i + vec3(0,1,0)), wH(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(wH(i + vec3(0,0,1)), wH(i + vec3(1,0,1)), f.x), mix(wH(i + vec3(0,1,1)), wH(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float wN2(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(wH2(i), wH2(i + vec2(1.,0.)), f.x), mix(wH2(i + vec2(0.,1.)), wH2(i + vec2(1.,1.)), f.x), f.y);
}
// the air: exponential haze whose colour depends on where one looks (toward sun A, toward sun B, violet between),
// thicker in the low banks that lie on the sea
vec3 wFogCol(vec3 vd){
  vec2 h = vd.xz/max(length(vd.xz), 1e-3);
  float a = clamp(dot(h, uAzA)*0.5 + 0.5, 0.0, 1.0), b = clamp(dot(h, uAzB)*0.5 + 0.5, 0.0, 1.0);
  a *= a; b *= b;
  vec3 c = mix(uFogMid, uFogA, a*a); c = mix(c, uFogB, b*b);
  return c*(1.0 - 0.35*clamp(vd.y*3.0, 0.0, 1.0));
}
float wFogAmt(vec3 wp){
  vec3 v = wp - cameraPosition; float d = length(v);
  float low = exp(-max(0.5*(wp.y + cameraPosition.y), 0.0)/12.0);
  return 1.0 - exp(-d*uFogDen*(0.25 + 4.5*uBank*low));      // clear air aloft; the haze lies low on the sea
}
vec3 wFog(vec3 col, vec3 wp){ vec3 v = wp - cameraPosition; return mix(col, wFogCol(v/max(length(v), 1e-3)), wFogAmt(wp)); }
// calcified froth: matte, pale, wrapped light from both suns, wine from below and violet from above, and a soft
// back-glow through thin edges in the colour of the sun behind them. V points from the eye to the surface
// what a sun's light does on set froth: the matter is near white under either sun, so the light's colour is taken half
// way to its own grey before it falls on it (rose only where the red sun strikes; the shade is the sky's cool violet)
vec3 wPale(vec3 c){ float l = dot(c, vec3(0.3, 0.5, 0.2)); return mix(vec3(l), c, 0.34); }
// lit matter, never matter that shines: above 0.7 the light on froth rises only a fifth as fast (nothing reaches the bloom)
vec3 wKnee(vec3 c){ return min(c, 0.7 + 0.2*(c - 0.7)); }
vec3 wFrothLight(vec3 alb, vec3 N, vec3 V, float thin){
  float da = clamp(dot(N, uSunA)*0.85 + 0.15, 0.0, 1.0), db = clamp(dot(N, uSunB)*0.85 + 0.15, 0.0, 1.0);
  da *= 0.4 + 0.6*da; db *= 0.4 + 0.6*db;                                                             // hard light, a short soft edge
  vec3 amb = mix(uAmbLo*0.7, uAmbHi, clamp(N.y*0.5 + 0.5, 0.0, 1.0)) + uFill*(1.05 + 0.4*N.y);       // the shade is the sky's cool grey-violet
  vec3 la = wPale(uSunACol), lb = wPale(uSunBCol);
  vec3 c = alb*(amb + 0.56*(la*da + lb*db));                                                         // each sun lights its own side; the shade between is plainly darker
  float rim = 1.0 - clamp(dot(N, -V), 0.0, 1.0); rim *= rim;
  float ta = clamp(dot(V, uSunA), 0.0, 1.0), tb = clamp(dot(V, uSunB), 0.0, 1.0);
  return c + alb*thin*(0.06 + 0.94*rim)*(la*ta*ta + lb*tb*tb)*0.4;
}
// the crust of bubbles: x = how deep in a hollow (0 on a bubble's top .. 1 between bubbles), yzw = offset for the normal
vec4 wBubbles(vec3 p){
  vec3 b = floor(p - 0.5), f = p - b; float d1 = 9.0; vec3 dv = vec3(0.0);
  for (int k = 0; k < 8; k++) {
    vec3 o = vec3(float(k & 1), float((k >> 1) & 1), float((k >> 2) & 1));
    vec3 c = b + o; vec3 r = o + vec3(wH(c), wH(c + 7.3), wH(c + 13.7))*0.8 + 0.1 - f;
    float d = dot(r, r); if (d < d1) { d1 = d; dv = r; }
  }
  d1 = sqrt(max(d1, 0.0));
  return vec4(smoothstep(0.25, 0.7, d1), -dv*smoothstep(0.0, 0.5, d1));
}
`,Ie=`
uniform vec3 uZen, uHorA, uHorB, uHorMid; uniform vec4 uRadA, uRadB, uDisc;
vec3 wSky(vec3 d){
  vec2 h = d.xz/max(length(d.xz), 1e-3);
  float a = clamp(dot(h, uAzA)*0.5 + 0.5, 0.0, 1.0), b = clamp(dot(h, uAzB)*0.5 + 0.5, 0.0, 1.0);
  vec3 hor = mix(uHorMid, uHorA, a*a*a); hor = mix(hor, uHorB, b*b*b);
  float e = clamp(d.y, 0.0, 1.0);
  vec3 c = mix(hor, uZen, 1.0 - exp(-e*4.2));
  return mix(c, wFogCol(d), exp(-e*30.0)*0.8);                 // the haze line the far sea fades into
}`,le=`
#define W_SAG_RUN ${re.toFixed(2)}
#define W_SAG_LAG ${Ee.toFixed(2)}
vec3 wRib(vec3 A, vec3 B, vec4 sh, float k, float tn, float sag){
  float q = clamp(2.0*mix(sh.y, sh.z, tn) - 1.0, -1.0, 1.0);
  float qq = sign(q)*(1.0 - pow(max(1.0 - abs(q), 0.0), sh.w));
  float c = 1.0 - (cosh(k*qq) - 1.0)/(cosh(k) - 1.0);
  vec3 p = mix(A, B, 0.5 + 0.5*qq);
  p.y += sh.x*c*(1.0 - 0.08*sag - 0.18*sag*c*c);
  return p;
}
float wGrown(float birth, float dur){ float g = clamp((uU - birth)/max(dur, 1e-3), 0.0, 1.0); return g*g*(3.0 - 2.0*g); }
`;function H(e,a,n=0,i=[0,0,0]){const o=Math.min(1,Math.max(-1,2*C(e.t0,e.t1,a)-1)),t=Math.sign(o)*(1-Math.pow(Math.max(1-Math.abs(o),0),e.p)),m=1-(Math.cosh(e.k*t)-1)/(Math.cosh(e.k)-1),r=.5+.5*t;return i[0]=C(e.A[0],e.B[0],r),i[1]=C(e.A[1],e.B[1],r)+e.R*m*(1-.08*n-.18*n*m*m),i[2]=C(e.A[2],e.B[2],r),i}const ye=(e,a)=>{let n=0,i=1;for(let o=0;o<26;o++){const t=.5*(n+i);H(e,t)[1]<a?n=t:i=t}return .5*(n+i)};function bt(e={}){const a=e.ratio??.95,n=e.tiers??[.25,.5,.75],i=P.bays,o=P.length*(1-a)/(1-Math.pow(a,i)),t=[],m=[],r=[],s=[],u=[],g=[];for(let c=0;c<=i;c++){const v=Math.pow(a,c),p=-o*(1-v)/(1-a);t.push({i:c,z:p,H:P.crown*v,w:P.half*v,s:v,birth:xe(p),dur:B.arch,last:c===i})}const S=[...n,n.length<3?.84:.9];for(const c of t)for(const v of[-1,1]){const p={A:[v*c.w,-3,c.z],B:[-v*c.w,-3,c.z],R:c.H+3,t0:0,t1:.5,p:2,k:2.5,r0:4*c.s,r1:1.25*c.s,birth:c.birth,dur:c.dur,bay:c.i,sagW:c.last?0:1,side:v,kind:0};p.index=m.length,m.push(p),p.tierTn=S.map(M=>ye(p,M*c.H));const y=260*c.s;p.gal=[],n.forEach((M,b)=>{let N=H(p,p.tierTn[b]).slice();const x=(y-Math.abs(N[0]))/1.875,f=[];for(let l=0;l<4;l++){const d=x*Math.pow(.5,l),A=[N[0]+v*d,N[1]*.5,c.z],z=2.3*c.s*Math.pow(.66,l),F=.58*c.dur,T=c.birth+c.dur*(.35+.6*M)+l*.7*F,k={A:N,B:A,R:.3*d,t0:0,t1:1,p:1.4,k:1.8,r0:z,r1:z*.8,birth:T,dur:F,bay:c.i,sagW:c.last?.25:1,side:v,kind:1,tier:b,j:l};k.index=r.length,r.push(k),f.push(k),l<2&&g.push({a:k,b:{...k,R:.3*k.R},tn0:0,tn1:1,birth:T+.4*F,dur:1.2*F,bay:c.i,band:b,web:1,j:l});const W=[[A[0]+v*.25*d,-2,c.z+.3*d],[A[0]+v*.25*d,-2,c.z-.3*d],[A[0]+v*.45*d,-2,c.z]];(l<3?W.slice(2):W).forEach((E,V)=>s.push({outer:l===3&&V<2,A,B:E,R:.12*(A[1]+2),t0:0,t1:1,p:1.2,k:1.5,r0:z*.55,r1:z*.75,birth:T+.9*F,dur:.7*F,bay:c.i,sagW:c.last?.25:1,side:v,kind:2,j:l})),N=A}p.gal.push(f)})}for(let c=0;c<i;c++)for(const v of[0,1]){const p=m[c*2+v],y=m[(c+1)*2+v];for(let M=0;M<S.length-1;M++)(M<2||n.length<3)&&u.push({a:p,b:y,tn0:p.tierTn[M],tn1:p.tierTn[M+1],birth:Math.max(p.birth+p.dur,y.birth+y.dur*(.3+.6*S[M+1])),dur:.52*y.dur,bay:c,band:M})}return{ratio:a,tiers:n,arches:t,main:m,gal:r,leg:s,bigFilms:u,webs:g,L0:o}}function xt(e){const a=e.arches[e.arches.length-1],n=e.main[e.main.length-1];return e.seat=new h.Vector3(0,.45*a.H,a.z),e.collar={rIn:8.3,xRib:Math.abs(H(n,ye(n,e.seat.y))[0])-n.r0},e.seat}const _e=25,yt=30,At=12,Le=24,St=10,Oe=45;function Ve(e,a,n,i,o=1,t=0,m=At){const r=e.arches,s=e.seat,u=.6*e.tiers[0]*r[2].H,g=r[4].H+_e,S=f=>u+(g-u)*(r[o].z-f)/(r[o].z-r[4].z),c=[[0,7,P.z0],[0,7,X+I.r],[-3*a,7.5,X],[0,8,I.w],[.5*t*a,.5*(8+u),I.r],[t*a,u,0]];for(let f=1;f<=o;f++)c.push([t*a,u,r[f].z]);for(let f=o+1;f<4;f++)c.push([t*a*(3-f)/(3-o),S(r[f].z),r[f].z]);c.push([0,g,r[4].z],[Le*a,r[5].H+yt,r[5].z]);for(let f=6;f<n-1;f++)c.push([Le*a*(r[f].z-r[n-1].z)/(r[5].z-r[n-1].z),r[f].H+_e,r[f].z]);const v=c[c.length-1],p=r[n-1].H+m,y=Math.max(s.y,i*r[n].H),M=r[n-1].z-r[n].z,b=Math.max((p-y)/M,.05),N=Math.min(.5*M,.9*(v[1]-p)/b,.5*(v[2]-r[n-1].z));N>3&&c.push([v[0]*N/(v[2]-r[n-1].z),p+b*N,r[n-1].z+N]),c.push([0,p,r[n-1].z],[0,y,r[n].z]);const x=(y-s.y)/b;return x>12&&c.push([0,y-.3*x*b,r[n].z-.3*x],[0,s.y+.1*(y-s.y),r[n].z-x]),r[n].z-1.7*x>s.z+75&&c.push([0,s.y,r[n].z-1.7*x]),c.push([0,s.y,s.z+60],[0,s.y,s.z]),c}const he=8,ce=24,fe=Math.ceil((P.length+2*ce)/he),de=30,Ae=12;function me(e,a,n,i,o=Ae){for(let t=Math.max(0,Math.floor((ce-n-o)/he));t<=Math.min(fe-1,Math.floor((ce-a+o)/he));t++)e[t].push(...i)}function qe(e,a,n,i=Ae){for(const o of[0,.5,1])for(const t of ze(a,n,o,!0))Math.abs(t[0])<de&&me(e,t[2]-t[3],t[2]+t[3],[1,t[0],t[1],t[2],t[0],t[1],t[2],t[3],o===0?-1:(o-.25)/Se,o===1?2:(o+.75)/Se,1],i)}async function Mt(e,a=async()=>{}){const n=Array.from({length:fe},()=>[]),i=[0,0,0],o=[0,0,0];for(const t of[0,.25,.5,.75,1])for(const m of[e.main,e.gal,e.legs])for(const r of m){const s=r.kind===0?28:8;for(let u=0;u<s;u++){if(H(r,u/s,t*r.sagW,i),H(r,(u+1)/s,t*r.sagW,o),Math.min(Math.abs(i[0]),Math.abs(o[0]))>de||r.kind===0&&u/s>=1-.36*Math.max(t-.25,0)*r.sagW)continue;const g=C(r.r0,r.r1,u/s)*1.2+.2,S=Ee*(1-r.bay/P.bays),c=t===0?-1:(t-.25+S)/re,v=t===1?2:(t+.25+S)/re;me(n,Math.min(i[2],o[2])-g,Math.max(i[2],o[2])+g,[0,i[0],i[1],i[2],o[0],o[1],o[2],g,c,v,0])}await a()}for(let t=0;t<e.bigFilms.length;t+=2)qe(n,e.bigFilms.slice(t,t+2),10),await a();for(let t=0;t<e.webs.length;t+=6)qe(n,e.webs.slice(t,t+6),8),await a();return n.map(t=>new Float32Array(t))}const ee=24;async function zt(e,a=async()=>{}){const n=Array.from({length:fe},()=>[]);for(let i=0;i<e.bigFilms.length;i+=2){for(const o of ze(e.bigFilms.slice(i,i+2),10,0))Math.abs(o[0])<de+ee&&me(n,o[2]-o[3],o[2]+o[3],[1,o[0],o[1],o[2],o[0],o[1],o[2],o[3],-1,2,1],ee);await a()}for(let i=0;i<e.webs.length;i+=6){for(const o of ze(e.webs.slice(i,i+6),8,0))Math.abs(o[0])<de+ee&&me(n,o[2]-o[3],o[2]+o[3],[1,o[0],o[1],o[2],o[0],o[1],o[2],o[3],-1,2,1],ee);await a()}return n.map(i=>new Float32Array(i))}async function ue(e,a,n,i=1e9,o=8,t=null,m=-1e9,r=0){const s=new h.Vector3,u=Math.ceil(e.length/2);let g=o,S=0,c=0,v=0,p=0,y=0,M=0;for(let b=0;b<=u;b++){t&&b%16===15&&await t(),e.pointAt(b/u,s);const N=b?Math.abs(Math.atan2(s.y-v,Math.hypot(s.x-y,s.z-p)))*57.2958:0;if(y=s.x,v=s.y,p=s.z,s.z<m||(S=Math.max(S,N),s.z>i))continue;c=Math.max(c,N);const x=We(J(s.z)),f=a[Math.min(fe-1,Math.max(0,Math.floor((ce-s.z)/he)))];let l=o;for(let d=0;d<f.length;d+=11){if(x<f[d+8]||x>f[d+9])continue;let A=f[d+1],z=f[d+2],F=f[d+3];if(f[d]<.5){const k=f[d+4]-A,W=f[d+5]-z,E=f[d+6]-F,V=K(((s.x-A)*k+(s.y-z)*W+(s.z-F)*E)/Math.max(k*k+W*W+E*E,1e-6));A+=k*V,z+=W*V,F+=E*V}const T=Math.hypot(s.x-A,s.y-z,s.z-F)-f[d+7];T<l&&(l=T),T<g&&(g=T,n&&n.splice(0,7,s.x,s.y,s.z,A,z,F,f[d+7]))}l<r&&(M+=e.length/u)}return{least:g,steep:S,near:M,steepIn:c}}const Ft=20,Nt=8,kt=46;async function Ut(e,a,n,i=async()=>{}){const o=e.arches,t=await Mt(e,i),m=await zt(e,i),r=[.9,.82,.74,.66,.58,.5];let s=o.length-1;for(;s>7&&o[s].z<e.seat.z+110;)s--;let u=null,g=null;for(const f of[2,1])for(const l of[9,6,3,0]){const d=n(Ve(e,a,s,r[0],f,l)),A=await ue(d,t,null,1e9,8,i,o[5].z),z=await ue(d,m,null,1e9,ee,i,o[5].z,Ft);await i();const F={j:f,o:l,rib:A.least,skin:z.least,near:z.near,steep:A.steep};(!g||F.skin>g.skin)&&(g=F),F.rib>=6&&F.skin>=Nt&&F.steep<=kt&&(!u||F.near<u.near-1)&&(u=F)}const S=u||g;let c=null,v=null,p=null;const y=async(f,l,d)=>{const A=(o[f-1].H+l-d*o[f].H)/(o[f-1].z-o[f].z);if(A>1||A<.45)return;const z=[],F=n(Ve(e,a,f,d,S.j,S.o,l)),T=await ue(F,t,z,o[5].z,Ae,i,e.seat.z+60);await i();const k={path:F,clear:T.least,dive:T.least,steep:T.steepIn,k:f,f:d,c:l,where:z};(!p||k.clear>p.clear)&&(p=k),k.steep<=Oe&&(!c||k.clear>c.clear)&&(c=k),k.clear>=St&&k.steep<=Oe&&(!v||k.steep<v.steep-.5||k.steep<v.steep+.5&&k.clear>v.clear)&&(v=k)},M=async f=>{for(const l of[16,8,0,-8])for(const d of r)await y(f,l,d)};for(const f of[s,s-1])await M(f);for(let f=s-2;!v&&f>=7;f--)await M(f);for(const[f,l]of[[4,.04],[2,.02]])if(!v&&c){const d=c;for(const[A,z]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]])await y(d.k,d.c+A*f,d.f+z*l)}const b=v||c||p,N=[],x=await ue(b.path,t,N,1e9,8,i);return await i(),b.stands=!!v,b.diveSteep=b.steep,x.least<b.clear&&(b.clear=x.least,b.where=N),b.steep=x.steep,b.climb=S,b}const Ke=15,Ge=120,Bt=.4,Pt=.3;function Rt(e,a){const n=P.length,i=[0,0,0],o=(f,l)=>{let d=0;for(const A of[e.main,e.gal,e.leg||e.legs||[]])for(const z of A)for(let F=0;F<=8;F++)H(z,F/8,0,i),Math.abs(i[2]-f)<=l+Ke&&(d=Math.max(d,Math.abs(i[0])+Math.max(z.r0,z.r1||0)));return d},t=(f,l,d,A)=>({x:f*(Math.max(o(l,d),2*P.half)+d+Ke+60*A),z:l,r:d}),m=a()<.5?-1:1,r=-n*(.9+.45*a()),s=22+10*a(),u=t(m,r,s,a()),g=.45*n,S=1.35*n,c=Math.max(g,-r-Ge),v=Math.min(S,-r+Ge),p=c-g+(S-v),y=a()<.5?-1:1,M=22+10*a(),b=a()*p,N=-(b<c-g?g+b:v+(b-(c-g))),x=t(y,N,M,a());return u.from=0,x.from=1/(4.4*re),u.ph=6.2832*a(),x.ph=6.2832*a(),[u,x]}const De=`
#ifdef W_MIRROR
varying vec4 vM;
vec4 wMirrorAt(vec3 wp){
  float hy = max(wp.y, 0.0), cy = max(cameraPosition.y, 0.5), s = cy/(cy + hy);
  vec2 q = cameraPosition.xz + (wp.xz - cameraPosition.xz)*s;
  q += hy*0.006*(vec2(wN2(q/41.0 + vec2(uTime*0.03, 0.0)), wN2(q/41.0 + vec2(5.0, -uTime*0.025))) - 0.5);      // (third part, P1) bent a little by the glass's slow swell: 0.6 m to 100 m of height
  vM = vec4(q, hy, 1.0 - wFogAmt(vec3(wp.x, -hy, wp.z)));
  return projectionMatrix*viewMatrix*vec4(q.x, 0.0, q.y, 1.0);
}
#endif
`,Tt=`
float wGlassR(vec2 p){ return length((p - vec2(0.0, -300.0))/vec2(330.0, 430.0)); }
`,Ue=`
#ifdef W_MIRROR
varying vec4 vM;
${Tt}
vec4 wMirrorOut(vec3 col){
  float glass = 1.0 - smoothstep(0.8, 1.0, wGlassR(vM.xy));
  vec2 e = cameraPosition.xz - vM.xy;
  float om = 1.0 - clamp(cameraPosition.y/max(length(vec3(e.x, cameraPosition.y, e.y)), 1e-3), 0.0, 1.0);
  float k = (0.24 + 0.14*om*om*om)*glass*clamp(vM.w, 0.0, 1.0)/(1.0 + max(vM.z, 0.0)/16.0);      // (third part, P1: 0.24 to 0.38; U5: the world's fog, no haze of its own; fourth part, D4: the image of what stands high is blurred away by the swell: half at 16 m of height, a fifth at 64 m, so a trunk's image is whole at its foot and no thin bright line lies far out on the glass)
  return vec4(col*k*vec3(1.0, 0.84, 0.9), 1.0);
}
#endif
`,Ct=`
${L}
${Ue}
varying vec3 vW, vN; varying vec4 vI; varying vec3 vA; varying float vPulse;
void main(){
  vec3 N = vN/max(length(vN), 1e-4);
  float fA = clamp(dot(N, uSunA)*0.6 + 0.4, 0.0, 1.0), fB = clamp(dot(N, uSunB)*0.6 + 0.4, 0.0, 1.0);
  float grain = 0.8 + 0.4*wN(vW*0.35);
  vec3 col = uFroth*grain*(uAmbHi + uFill + 0.5*(wPale(uSunACol)*fA*fA + wPale(uSunBCol)*fB*fB));
  vec3 Vm = vW - vec3(cameraPosition.x, -cameraPosition.y, cameraPosition.z); Vm /= max(length(Vm), 1e-3);
  gl_FragColor = wMirrorOut(wKnee(col)*(0.22 + 0.78*clamp(vA.y, 0.0, 1.0))*smoothstep(0.0, 0.7, abs(dot(N, Vm))));      // (third part, P1) soft-edged: a rib's image fades out toward its two sides
}`,$e=`
#define W_OLD ${(1.7*B.arch).toFixed(5)}
${L}
${le}
${De}
attribute vec3 aA, aB; attribute vec4 aSh, aGrow, aMisc;      // aGrow: r0, r1, birth, dur; aMisc: bay, sag weight + 10 x place in chain, kind + seed, k
varying vec3 vW, vN; varying vec4 vI;                         // vI: tn, crown weight, bay, growing-tip glow
varying vec3 vA; varying float vPulse;                        // vA: age 0 fresh .. 1 set, how much of its width is real (far, thin ribs), how thin; vPulse: its share of the light pulse
void main(){
  float tn = position.x, ang = position.y, kind = floor(aMisc.z + 0.001), seed = fract(aMisc.z);
  float graw = clamp((uU - aGrow.z)/max(aGrow.w, 1e-3), 0.0, 1.0), g = graw*graw*(3.0 - 2.0*graw);
  float ord = floor(aMisc.y/10.0 + 0.001), sagW = aMisc.y - 10.0*ord;
  float sag = clamp(uSag*W_SAG_RUN - W_SAG_LAG*(1.0 - aMisc.x/12.0), 0.0, 1.0)*sagW;      // this bay's share of the fall: the far bays first
  float tc = min(tn, g);
  // the fall: every rib is lost from its far end back toward where it springs. A main rib loses its crown first; a gallery
  // chain goes from the outside in (its fourth arch first), and the legs under a landing go with it. Nothing is left hanging
  float stage = clamp(sag*4.4 - (3.0 - ord), 0.0, 1.0);
  float lim = kind < 0.5 ? 1.0 - 0.36*sag : 1.0 - stage;
  if (kind < 1.5) tc = min(tc, lim);
  float taper = kind < 1.5 ? mix(1.0, sqrt(clamp((lim - tc)/0.1, 0.0, 1.0)), smoothstep(0.0, 0.05, 1.0 - lim)) : 1.0 - smoothstep(0.0, 0.3, stage);      // a soft round end
  float falling = smoothstep(0.0, 0.05, 1.0 - lim);
  vec3 P = wRib(aA, aB, aSh, aMisc.w, tc, sag);
  vec3 Pa = wRib(aA, aB, aSh, aMisc.w, max(tc - 0.006, 0.0), sag), Pb = wRib(aA, aB, aSh, aMisc.w, min(tc + 0.006, 1.0), sag);
  float droop = kind > 0.5 && kind < 1.5 ? stage*0.45*length(aB - aA) : 0.0;      // what is left of a gallery arch wilts
  P.y -= droop*tc*tc; Pa.y -= droop*max(tc - 0.006, 0.0)*max(tc - 0.006, 0.0); Pb.y -= droop*min(tc + 0.006, 1.0)*min(tc + 0.006, 1.0);
  vec3 T = Pb - Pa; T /= max(length(T), 1e-4);
  vec3 Nz = cross(aB - aA, vec3(0.0, 1.0, 0.0)); Nz /= max(length(Nz), 1e-4);
  vec3 N1 = cross(Nz, T); N1 /= max(length(N1), 1e-4);
  float r = mix(aGrow.x, aGrow.y, tn);
  r *= 0.86 + 0.3*wN(P*0.11 + vec3(cos(ang), sin(ang), seed*9.0)*1.3);            // lumpy, never a turned column
  float growing = 1.0 - smoothstep(0.86, 1.0, graw);                               // the swollen tip sinks back into the rib as it completes
  float dt = (tn - g)/0.08, bulb = growing*exp(-dt*dt);
  float rTrue = r, rMin = 0.0026*length(P - cameraPosition);                     // a far rib keeps a least width (it never breaks into dots or scribble) ...
  r = max(r, rMin);                                                              // ... and what it is given beyond its own is paid for by fading into the haze (vA.y)
  if (kind < 0.5) r *= 1.0 - 0.55*sag*smoothstep(0.45, 1.0, tn);                 // in the fall a crown thins before it parts
  r *= (1.0 + 0.8*bulb)*smoothstep(0.0, 0.05, graw)*taper;
  float cap = clamp((tn - g)/0.03, 0.0, 1.0)*1.5708*growing;                      // the unborn part folds into a round tip
  vec3 dir = cos(ang)*N1 + sin(ang)*Nz;
  vec3 wp = P + dir*r*cos(cap) + T*r*sin(cap);
  float cw = kind < 0.5 ? tn : (kind < 1.5 ? 1.0 - abs(2.0*tn - 1.0) : 0.0);
  vA = vec3((uU - aGrow.z - aGrow.w*tn)/W_OLD, rTrue/max(rMin, 1e-4), 1.0 - smoothstep(0.7, 2.6, rTrue));
  vPulse = kind < 0.5 ? 1.0 : (kind < 1.5 ? 0.3 : 0.0);
  vW = wp; vN = dir*cos(cap) + T*sin(cap); vI = vec4(tn, cw, aMisc.x, max(bulb, falling*(1.0 - taper)));
#ifdef W_MIRROR
  gl_Position = wMirrorAt(wp);
#else
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
#endif
}`,Ht=`
${L}
varying vec3 vW, vN; varying vec4 vI; varying vec3 vA; varying float vPulse;
void main(){
  vec3 Vv = vW - cameraPosition; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-3);
  vec3 N = vN/max(length(vN), 1e-4); if (!gl_FrontFacing) N = -N;
  float nearK = 1.0 - smoothstep(30.0, 110.0, dist), midK = 1.0 - smoothstep(140.0, 400.0, dist);
  // THE SKIN TELLS ITS AGE. Fresh (behind the front): wet froth, deep bubbles from fist to barrel size, rose in every
  // hollow and in broad stains. Set (the lens has come 130 m since): plaster white and smooth, the bubbles only a shallow
  // relief, rose left in thin seams, and a soft sheen of each sun sliding over it
  float age = clamp(vA.x, 0.0, 1.0), fresh = 1.0 - age, wet = clamp(vI.w, 0.0, 1.0);
  float pick = smoothstep(0.38, 0.62, wN(vW*0.19 + 11.0));
  vec4 b1 = wBubbles(vW*0.42), b2 = wBubbles(vW*1.5 + 5.0), b3 = wBubbles(vW*4.6 + 9.0);
  vec4 bb = mix(mix(b1, b2, pick), b2, 0.7*fresh);
  // FROM NEAR (inside 60 m, whole inside 18 m) a rib is a surface, not a pale pole: the set froth's own cells stand in
  // relief, some have burst into pits, and long cracks run up it with rose in them
  float closeK = 1.0 - smoothstep(18.0, 60.0, dist);
  float relief = (mix(0.2, 0.8, fresh) + 0.5*closeK*age)*(1.0 - 0.7*wet);
  float pit = (1.0 - smoothstep(0.1, 0.42, b2.x))*smoothstep(0.52, 0.7, wN(vW*0.9 + 21.0))*closeK;
  float crack = (1.0 - smoothstep(0.0, 0.035, abs(wN(vW*vec3(0.55, 0.13, 0.55) + 31.0) - 0.5)))*smoothstep(0.3, 0.6, wN(vW*0.07 + 17.0))*closeK;
  vec3 Nb = N + (0.5*midK*bb.yzw + 0.3*nearK*b3.yzw)*relief; Nb /= max(length(Nb), 1e-4);
  float seamNew = max(0.6*bb.x*bb.x*midK*(1.0 - 0.7*nearK), 0.5*b3.x*b3.x*nearK), seamOld = max(smoothstep(0.9, 1.0, b2.x)*midK, 0.7*smoothstep(0.9, 1.0, b3.x)*nearK);      // set froth keeps its rose only in the fine cracks of the crust
  float hollow = max(mix(seamNew, 0.7*seamOld, age), max(0.8*pit, crack))*(1.0 - 0.8*wet);
  float blotch = wN(vW*0.045 + 3.0);                                                // broad rose stains while it is fresh
  vec3 alb = mix(uFroth*mix(0.86, 1.0, age), uRose*0.66, clamp(mix(0.7, 0.45, age)*hollow + fresh*(0.04 + 0.22*smoothstep(0.45, 0.85, blotch)), 0.0, 1.0));
  // a collar of fresh froth creeps up the foot of every main pier, rising and sinking on the 5.2 s breath
  float collar = clamp(2.0*vPulse - 1.0, 0.0, 1.0)*(1.0 - smoothstep(3.0, 8.0, vW.y + 4.0*wN(vW*0.35) - 1.5*sin(uTime*1.2083 + vI.z)));
  alb = mix(alb, uFroth*0.9, 0.85*collar); hollow *= 1.0 - 0.7*collar;
  // the foot stands in the sea: darker and wet as high as the swell throws its water (5 to 13 m, ragged)
  float foot = (1.0 - smoothstep(5.0, 13.0, vW.y + 4.0*wN(vW*0.3 + 7.0)))*(1.0 - 0.85*collar);
  alb *= 1.0 - 0.36*foot;
  // (polish 1, Q3 d) FROTH THAT SET, STILL WET: a bubbled grain that reads from the vault too (cells of 2 to 6 m, pale
  // heads and shaded hollows), and further down a wet sheen: the sky's colour at a glancing look, a broad soft light of
  // each sun, strongest low on the rib where the sea's water climbs it
  float grainB = wN(vW*0.5 + 5.0), grainS = wN(vW*1.7 + 13.0);
  alb *= 0.8 + 0.3*grainB + 0.12*(grainS - 0.5)*(1.0 - smoothstep(0.15, 0.6, max(length(dFdx(vW)), length(dFdy(vW)))));      // (the fine grain goes over into its mean by the pixel's footprint: the declared footprint fade)
  float thin = clamp(vA.z, 0.0, 1.0);                                               // a thin rib is glassy: the sun behind it comes through
  vec3 col = wFrothLight(alb, Nb, V, mix(0.5, 1.6, thin))*(1.0 - 0.5*hollow*mix(0.5, 1.0, fresh));
  vec3 R = reflect(V, Nb); float sa = clamp(dot(R, uSunA), 0.0, 1.0), sb = clamp(dot(R, uSunB), 0.0, 1.0);
  col += (wPale(uSunACol)*pow(sa, 22.0) + wPale(uSunBCol)*pow(sb, 22.0))*(0.1*age + 0.25*foot)*(1.0 - hollow)*(1.0 - collar);
  // a lit side and a shade side: each sun lays its own colour on the flank that faces it; the flank that faces neither
  // is left to the sky, darker from near
  float fA = clamp(dot(Nb, uSunA), 0.0, 1.0), fB = clamp(dot(Nb, uSunB), 0.0, 1.0);
  col += alb*(uSunACol*fA*fA + uSunBCol*fB*fB)*0.2;
  col *= 1.0 - 0.3*closeK*(1.0 - fA)*(1.0 - fB);
  { float glance = 1.0 - clamp(dot(Nb, -V), 0.0, 1.0); glance *= glance;
    float low = 0.45 + 0.55*(1.0 - smoothstep(4.0, 26.0, vW.y));
    col += (wFogCol(R)*0.34*glance + (wPale(uSunACol)*sa*sa*sa*sa*sa*sa + wPale(uSunBCol)*sb*sb*sb*sb*sb*sb)*0.09)*low*(1.0 - 0.6*hollow)*(0.7 + 0.6*grainB); }
  // the pulse: one band of light climbs every rib each 5.2 s, a little later in each bay, so a slow wave runs down the hall
  float ph = fract(uTime/5.2 - vI.z*0.085)*1.5 - 0.2, d = (vI.x - ph)/0.045;
  col += uPulseCol*0.3*clamp(vPulse, 0.0, 1.0)*exp(-min(d*d, 30.0))*(0.3 + 0.7*(1.0 - hollow));      // a faint band: lit matter, not a lamp
  col *= 1.0 + 0.12*wet; col += alb*uFill*0.8*wet;            // a growing tip is fresh wet froth: brighter, lit by the whole sky
  col = wFog(wKnee(col), vW);
  gl_FragColor = vec4(mix(wFogCol(V), col, 0.22 + 0.78*clamp(vA.y, 0.0, 1.0)), 1.0);      // a rib too thin for its distance goes into the haze
}`;function Wt(e,a){const n=[],i=[];for(let o=0;o<=e;o++)for(let t=0;t<=a;t++)n.push(o/e,t/a*Math.PI*2,0);for(let o=0;o<e;o++)for(let t=0;t<a;t++){const m=o*(a+1)+t,r=m+a+1;i.push(m,r,m+1,m+1,r,r+1)}return{pos:new Float32Array(n),idx:i}}function je(e,a){const n=a.length,i=new Float32Array(n*3),o=new Float32Array(n*3),t=new Float32Array(n*4),m=new Float32Array(n*4),r=new Float32Array(n*4);return a.forEach((s,u)=>{i.set(s.A,u*3),o.set(s.B,u*3),t.set([s.R,s.t0,s.t1,s.p],u*4),m.set([s.r0,s.r1,s.birth,s.dur],u*4),r.set([s.bay,s.sagW+10*(s.j||0),s.kind+s.seed*.98,s.k],u*4)}),e.setAttribute("aA",new h.InstancedBufferAttribute(i,3)),e.setAttribute("aB",new h.InstancedBufferAttribute(o,3)),e.setAttribute("aSh",new h.InstancedBufferAttribute(t,4)),e.setAttribute("aGrow",new h.InstancedBufferAttribute(m,4)),e.setAttribute("aMisc",new h.InstancedBufferAttribute(r,4)),e.instanceCount=n,e.boundingSphere=new h.Sphere(new h.Vector3(0,80,-300),900),e}function U(e,a,n,i){const o=Wt(a,n),t=new h.InstancedBufferGeometry;t.setAttribute("position",new h.BufferAttribute(o.pos,3)),t.setIndex(o.idx);const m=new h.Mesh(je(t,e),i);return m.frustumCulled=!1,m}const Se=2.6,Et=`
float wFilmClock(float lag){ return uSag*${Se.toFixed(1)} - 0.5*lag; }
`,It=.17,Me=24,Qe=4;function ze(e,a=12,n=0,i=!1){const o=[],t=[0,0,0],m=[0,0,0],r=(s,u)=>Math.hypot(s[0]-u[0],s[1]-u[1],s[2]-u[2]);for(const s of e){const u=.5*(s.tn0+s.tn1),g=H(s.a,s.tn0).slice(),S=H(s.a,s.tn1).slice(),c=H(s.a,u).slice(),v=H(s.b,u).slice(),p=r(g,S),y=r(c,v),M=Math.min(y,p),b=.5*Math.max(y,p)/a;for(let N=0;N<=a;N++)for(let x=0;x<=a;x++){const f=N/a,l=x/a,d=C(s.tn0,s.tn1,l);H(s.a,d,0,t),H(s.b,d,0,m);const A=Math.sin(Math.PI*f)*Math.sin(Math.PI*l),z=C(t[0],m[0],f),F=(s.web?f:Math.min(f,1-f))*y;if(!(Math.abs(z)<Me&&F>Qe)){if(i&&Math.abs(z)<Me){if(N===0||N===a&&!s.web)for(let T=0;T<(x<a?4:1);T++){const k=C(s.tn0,s.tn1,(x+T/4)/a);H(s.a,k,0,t),H(s.b,k,0,m);for(const W of[1.5,3.2]){const E=N===0?W/y:1-W/y;o.push([C(t[0],m[0],E),C(t[1],m[1],E),C(t[2],m[2],E),1.6])}}continue}o.push([z,C(t[1],m[1],f)-n*A*.25*M,C(t[2],m[2],f),It*M*A+b])}}}return o}const Ze=`
#define W_FILM_OLD ${(4*B.arch).toFixed(5)}
${L}
${Et}
${le}
${De}
attribute vec3 aA1, aB1, aA2, aB2; attribute vec4 aSh1, aSh2, aF, aM;      // aF: tn0, tn1, birth, dur; aM: bay, sag weight of rib 2 (+ 2 for a web), k + 10 x place in chain, seed
varying vec3 vW, vN; varying vec4 vUv; varying vec4 vK;                      // vUv: a, b, width across, length along (m); vK: spread, tear, seed, web
varying float vCut;                                                          // > 0 where the ribs that carry this part still stand
attribute vec3 aH0, aH1, aH2;                                                // its openings: place across, place along, radius (shares of the sheet)
varying vec3 vH0, vH1, vH2; varying float vAge;                              // vAge: 0 when it has just spread .. 1 when the lens has come four arch-closings further
varying float vX;                                                            // metres from the mirror plane, of the surface itself
varying vec2 vT;                                                             // the film's clock past its tear: x the tatters (0..1), y what is left on the ribs going (0..1)
void main(){
  vH0 = aH0; vH1 = aH1; vH2 = aH2; vAge = clamp((uU - aF.z - aF.w)/W_FILM_OLD, 0.0, 1.0);
  float a = position.x, b = position.y, tn = mix(aF.x, aF.y, b), ordF = floor(aM.z/10.0 + 0.001), kf = aM.z - 10.0*ordF;
  float web = step(1.5, aM.y), w2 = aM.y - 2.0*web;
  float s1 = clamp(uSag*W_SAG_RUN - W_SAG_LAG*(1.0 - aM.x/12.0), 0.0, 1.0)*mix(1.0, w2, web);
  float s2 = mix(clamp(uSag*W_SAG_RUN - W_SAG_LAG*(1.0 - (aM.x + 1.0)/12.0), 0.0, 1.0)*w2, s1, web);
  vec3 P1 = wRib(aA1, aB1, aSh1, kf, tn, s1), P2 = wRib(aA2, aB2, aSh2, kf, tn, s2);
  vec3 Q1 = wRib(aA1, aB1, aSh1, kf, min(tn + 0.02, 1.0), s1), Q0 = wRib(aA1, aB1, aSh1, kf, max(tn - 0.02, 0.0), s1);
  float stage = web*clamp(s1*4.4 - (3.0 - ordF), 0.0, 1.0), droop = stage*0.45*length(aB1 - aA1)*tn*tn;      // a web wilts with its arch
  P1.y -= droop; P2.y -= droop;
  vec3 across = P2 - P1, along = (Q1 - Q0)*((aF.y - aF.x)/0.04);
  float la = max(length(across), 1e-3), lb = max(length(along), 1e-3);
  vec3 N = cross(across, along); N /= max(length(N), 1e-4);
  float belly = sin(3.14159*a)*sin(3.14159*b);
  float tr = 0.5*sin(uTime*2.3 + aM.w*40.0 + a*9.0) + 0.35*sin(uTime*3.7 + b*11.0 + aM.w*17.0) + 0.3*sin(uTime*5.9 + (a + b)*14.0);
  // THE FILM'S CLOCK (one clock, the live one: 2.6 times the fall, less the film's own dealt delay). 0..1 THE TEAR: it
  // sags to its full depth and splits. 1..2 THE TATTERS (polish 1, Q5): they begin when the film's sag has reached its
  // full depth (clock = 1) and run for one more turn of the same clock. Past 2 what hangs on the ribs goes
  float clockF = wFilmClock(wH2(vec2(aM.x, aM.w*31.0))), tear = clamp(clockF, 0.0, 1.0);        // the skins go first: in tatters while the ribs only droop
  vT = vec2(clamp(clockF - 1.0, 0.0, 1.0), clamp(clockF - 2.0, 0.0, 1.0));
  float hb = min(la, lb)*(0.15 + 0.012*tr);                                         // a skin bellies between its ribs, both ways
  vec3 wp = mix(P1, P2, a) + N*belly*hb - vec3(0.0, 1.0, 0.0)*tear*belly*0.25*min(la, lb);
  // the belly's own slope tilts the surface: the light shows the curve
  vec3 Nb = N - (across/la)*(hb*3.14159*cos(3.14159*a)*sin(3.14159*b)/la) - (along/lb)*(hb*3.14159*sin(3.14159*a)*cos(3.14159*b)/lb);
  N = Nb/max(length(Nb), 1e-4); vX = abs(wp.x);
  // a film is lost with the part of its ribs that the fall has taken
  float lim = mix(1.0 - 0.36*max(s1, s2), 1.0 - stage, web);
  vCut = lim - tn - 0.04;
  vW = wp; vN = N; vUv = vec4(a, b, la, lb); vK = vec4(wGrown(aF.z, aF.w), tear, aM.w, web);
#ifdef W_MIRROR
  gl_Position = wMirrorAt(wp);
#else
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
#endif
}`,Ye=`
#define W_NAVE_OPEN ${Me.toFixed(1)}
#define W_FRINGE ${Qe.toFixed(1)}
${L}
${Ie}
${Ue}
varying vec3 vW, vN; varying vec4 vUv; varying vec4 vK; varying float vCut;
varying vec3 vH0, vH1, vH2; varying float vAge; varying float vX; varying vec2 vT;
// metres outside a TEAR. A film does not open in rounds: it tears along a cord. h: where the tear began (place across,
// place along, size, as shares of the sheet); it runs along the cord nearest to that place (q: the fragment's place
// along the rib with the cords' own wander in it; per: the cords' spacing), 1.6 to 2.8 times as long as its size and
// 0.14 to 0.3 as wide as long, blunt at the end where it began and running out to a point at the other, its edge
// ragged by rag (-1..1). grow: what age and the fall add
// (polish 1, Q1: a tear is a SPLIT: a lens that lies between two cords, widest in the middle and closing to a point at
// both ends, never wider than the cords let it; its line wanders a little (rag), it has no teeth)
float wTear(vec3 h, vec2 uv, vec2 dim, float mn, float grow, float q, float per, float rag){
  float open = step(1e-3, h.z), L = max(min((h.z*(1.0 + 0.5*vAge) + grow)*mn*(1.6 + 1.2*fract(h.x*7.3)), dim.x*(0.2 + 0.2*fract(h.x*7.3))), 1e-3);
  float W = min(L*(0.14 + 0.16*fract(h.y*5.7)), per*(0.3 + 0.14*fract(h.y*9.1)));
  float dx = (uv.x - h.x)*dim.x, dy = q - (floor(h.y*dim.y/per) + 0.5)*per + 0.4*rag, ux = clamp(dx/L, -1.0, 1.0);
  return mix(1e3, max(abs(dy) - W*(1.0 - ux*ux), abs(dx) - L), open);
}
void main(){
  vec2 uv = clamp(vUv.xy, 0.0, 1.0); float la = vUv.z, lb = vUv.w, mn = max(min(la, lb), 1e-3), web = vK.w;
  vec2 dim = vec2(la, lb), fp = uv*dim;                                             // the sheet's own metres: the same on both sides of the mirror plane
  float n1 = wN(vec3(fp*0.09, vK.z*20.0)), n2 = wN(vec3(fp*0.4, 7.0 + vK.z*3.0));
  // metres to the nearest edge where it is fast (the ribs) and to the nearest free edge. A wall film's free edges lie
  // close along its neighbours above and below (a seam between them, no gap)
  // a free edge hangs in a deep scallop between its two ribs and is torn: never a straight run of more than a few metres
  float scal = (0.1 + 0.07*n1)*sin(3.14159*uv.x);
  float dAtt = mix(min(uv.x, 1.0 - uv.x), uv.x, web)*la;
  float torn = 1.6*(wN(vec3(fp*0.33, vK.z*11.0)) - 0.5) + 0.7*(n2 - 0.5);
  float dFree = mix(min(uv.y - scal, 1.0 - scal - uv.y)*lb, (1.0 - uv.x*(1.0 + 0.12*sin(3.14159*uv.y)))*la, web) + torn;
  // the nave closes last: within NAVE_OPEN of the mirror plane only a fringe on the rib, torn, thinning to nothing
  float fr = W_FRINGE*smoothstep(0.3, 0.75, wN(vec3(fp.y*0.21, vK.z*23.0, 3.0)))*(0.6 + 0.4*n2)*(1.0 - smoothstep(0.3, 1.0, vK.y));      // (polish 1) the fringe draws back into its rib while the film sags and is gone when the sag is at its full depth, where live's tatters had taken it: the nave is bare for the dive, as in live
  // the wing's free edge hangs in a scallop from rib to rib (3.5 m further out at mid span) and wanders: it lies between
  // 24.1 and 31.4 m from the plane, never nearer. What is left: the wing outside it, the fringe on the rib
  float dNave = max(vX - W_NAVE_OPEN - 0.5 - 3.0*n1 - 3.5*sin(3.14159*uv.x)*(1.0 - web), fr - dAtt) + 0.35*torn;
  dFree = min(dFree, dNave);
  float e = mix(min(uv.x, 1.0 - uv.x)*2.0, uv.x, web);                              // 0 where it is fast .. 1 furthest from it
  float spread = vK.x*1.35 - e - 0.2*(n1 - 0.5) - 0.1;                              // > 0 where the skin has formed
  // its openings: several, of differing size, at differing heights; they widen a little with age and tear open in the fall
  float grow = vK.y*0.5, rag = 2.0*wN(vec3(fp*0.25, vK.z*13.0)) - 1.0;
  // the cords' spacing and wander (used by the tears here and by the cords below)
  float per = 6.0 + 4.0*fract(vK.z*37.0), q = fp.y + 2.6*(wN(vec3(fp*0.12, vK.z*17.0)) - 0.5) + 0.9*(n2 - 0.5);
  float hole = min(wTear(vH0, uv, dim, mn, grow, q, per, rag), min(wTear(vH1, uv, dim, mn, grow, q, per, rag), wTear(vH2, uv, dim, mn, grow, q, per, rag)));
  vec3 eye = cameraPosition;                                                        // (what is open and what is skin is weighed below, with the splits)
#ifdef W_MIRROR
  eye.y = -eye.y;                                                                   // the glass shows the film as an eye as far below the glass would see it
#endif
  vec3 Vv = vW - eye; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-3);
  vec3 N = vN/max(length(vN), 1e-4); if (dot(N, V) > 0.0) N = -N;
  // THE FILM HAS A BODY. Thick where it is fast (a fillet that runs out of the rib over 3 m, never a line), thick in a
  // curled lip round every opening and along every free edge, thick in the cords; thin and clear in the middle of each cell
  float lip = max(1.0 - smoothstep(0.1, 1.3, hole), 1.0 - smoothstep(0.05, 1.0, dFree));
  float fil = 1.0 - smoothstep(0.0, 3.2, dAtt); fil *= fil;
  // cords: they leave the rib square to it, one every 6 to 10 m of its length, stout at the rib (0.5 m) and fine at mid
  // span; 3 m in each forks in two, and the forks draw apart to a third of the way to the next cord
  float qm = abs(mod(q + 0.5*per, per) - 0.5*per), cw = 0.1 + 0.42*exp(-min(dAtt, 40.0)/8.0);
  float fork = abs(qm - per*0.33*smoothstep(3.0, 13.0, dAtt));
  float cord = max(1.0 - smoothstep(0.45*cw, cw, qm), 1.0 - smoothstep(0.3*cw, 0.7*cw, fork));      // the cords are there from the first: the film spreads between them
  float v1 = cord;
  // THE FALL TAKES A FILM BY SPLITS (polish 1, Q1 and Q5; this replaces the patches of live, cut by a noise at a tear of
  // 0.55). The film lies in CELLS between its cords. THE TEAR (the film's clock 0..1): in a few of its cells (three in
  // ten, dealt by the cell and the film's own seed) the skin first thins and sags in a long patch that lets the light
  // through, then SPLITS there: a lens along the cords, widest in the middle, pointed at both ends, 0.3 to 0.8 of the
  // sheet long, never wider than its cell. THE TATTERS (the clock 1..2; they begin when the film's sag has reached its
  // full depth): cell after cell the split opens to the cords on both sides and runs out between them toward the ribs;
  // three cords in ten stay strung across their stripped cell for a while, whole, and then go whole; what is left is a
  // few rags by the ribs (second part, P2: most of a hoop is bare), and they shrink while the clock runs on past 2
  float px = max(length(dFdx(fp)), length(dFdy(fp)));
  float cellI = floor(q/per), dqc = q - (cellI + 0.5)*per;
  float h1 = wH2(vec2(cellI + 3.0, vK.z*57.0 + 1.0)), h2 = wH2(vec2(cellI*1.7 + 11.0, vK.z*91.0 + 2.0)), h3 = wH2(vec2(cellI*2.3 + 5.0, vK.z*23.0 + 7.0));
  float early = step(h1, 0.3), s0 = 0.12 + 0.6*h2, o1 = early*clamp((vK.y - s0)/0.3, 0.0, 1.0);
  float t0 = 0.35*h3*(1.0 - 0.5*early), o2 = clamp((vT.x - t0)/0.35, 0.0, 1.0); o2 = o2*o2*(3.0 - 2.0*o2);
  float xF = (0.25 + 0.5*h3)*la, LF = (0.15 + 0.25*h2)*la, WF = per*(0.14 + 0.28*fract(h1*7.0));
  // what the stripped cells leave on a rib: one hem of skin, 0.4 to 3.5 m deep, its edge a slack curve that runs on from
  // cell to cell (the split's ends go square as it runs out: no teeth); it shrinks to a quarter while the tatters end
  // and goes on shrinking past them. Within the open nave nothing is left: the fringe there goes with its cell, as in live
  // (second part, P2) most of a hoop is BARE; here and there a rag hangs on (a quarter of a rib's length carries one),
  // a few of them long (up to 9 m), each cell's of its own length, its end ragged
  float hemL = smoothstep(0.66, 0.92, wN(vec3(q*0.13, vK.z*19.0, 5.0)));      // (third part, P5: a rag on about a seventh of a rib's length)
  float hem = 9.0*hemL*hemL*(0.08 + 0.92*h2*h2)*(1.0 - 0.6*smoothstep(0.5, 1.0, vT.x))*(1.0 - 0.8*vT.y)*smoothstep(W_NAVE_OPEN - 4.0, W_NAVE_OPEN + 8.0, vX);
  float mid = mix(0.5, 1.0, web)*la;                                                // a web is fast along its arch only: its cells are stripped out to its free edge
  float dqq = dqc - 0.22*per*(h2 - 0.5)*(1.0 - o2) - 0.3*sin(fp.x*0.45 + 6.283*h3), dx = fp.x - mix(xF, mid + (h3 - 0.5)*1.4*hem*(1.0 - web), o2) + 0.9*o2*(wN(vec3(q*0.9, fp.x*0.25, vK.z*7.0)) - 0.5)*step(0.05, hem);
  float Lh = max(mix(LF*(0.3 + 0.7*o1), mid - hem, o2), 1e-3), Wh = mix(WF*o1, 0.5*per + 0.25, o2);
  float ux = clamp(dx/Lh, -1.0, 1.0), Wloc = Wh*(1.0 - pow(abs(ux), mix(2.0, 26.0, smoothstep(0.0, 0.3, o2))));
  float dS = mix(1e3, max(abs(dqq) - Wloc, abs(dx) - Lh), step(1e-3, o1 + o2));      // metres outside the split
  // before it splits the skin thins there: a long translucent patch
  float uF = clamp((fp.x - xF)/max(LF, 1e-3), -1.0, 1.0);
  float thinning = mix(smoothstep(t0 - 0.3, t0, vK.y + vT.x - 1.0), smoothstep(s0 - 0.3, s0, vK.y), early);
  float thinP = thinning*(1.0 - smoothstep(-0.4, 0.5, max(abs(dqq) - 1.25*max(WF, 0.3*per)*(1.0 - uF*uF), abs(fp.x - xF) - LF)));
  // threads still strung across the gap where it is narrow (each parts when the gap is wider than its own length);
  // they bow and stir on the world's clock
  float inGap = step(dS, 0.0), across = clamp(dqq/max(Wloc, 1e-3), -1.0, 1.0);
  float xt = fp.x + 0.14*(1.0 - across*across)*sin(uTime*1.7 + fp.x*0.9 + cellI), tid = floor(xt/1.3), tho = wH2(vec2(tid + 7.0*cellI, vK.z*77.0 + 3.0));
  float thread = inGap*step(0.4, tho)*step(Wloc, 0.25 + 2.4*fract(tho*9.0))*(1.0 - smoothstep(0.012, 0.02 + px, abs(xt - (tid + 0.5)*1.3)))*min(0.05/max(px, 1e-3) + 0.15, 1.0);
  // shreds hang from the upper lip into the gap and from the lower lip down over the skin, pointed, unlike in length,
  // stirring on the world's clock (a wall film's cords lie level; a web's stand, so a web has none)
  float dUp = Wloc - dqq, dLow = -Wloc - dqq;
  float sway = 0.3*sin(uTime*1.3 + fp.x*0.7 + 2.0*cellI);
  float tg1 = max(wN(vec3((fp.x + sway*clamp(dUp/1.5, 0.0, 1.0))*1.1, cellI*3.7, vK.z*29.0)) - 0.42, 0.0)/0.58;
  float tg2 = max(wN(vec3((fp.x + sway*clamp(dLow/1.5, 0.0, 1.0))*1.3, cellI*5.1 + 9.0, vK.z*31.0)) - 0.45, 0.0)/0.55;
  float len1 = min(1.7*Wloc, 2.6)*tg1*sqrt(max(tg1, 0.0)), len2 = 1.1*tg2*sqrt(max(tg2, 0.0))*step(abs(dx), Lh)*step(1e-3, o1 + o2);
  float shred = inGap*(1.0 - web)*(1.0 - o2)*(1.0 - smoothstep(len1 - 0.04 - px, len1, dUp));      // (second part, P2: no shreds in a stripped cell)
  float flap = (1.0 - web)*step(0.0, dLow)*(1.0 - smoothstep(len2 - 0.04 - px, len2, dLow));
  // three cords in ten stay strung across a stripped cell for a while
  float hc = wH2(vec2(floor(q/per + 0.5) + 31.0, vK.z*63.0)), parted = 1.0 - smoothstep(0.3, 0.6, vT.x + 0.3*(hc - 0.5));      // (second part, P2: a strung cord stays whole, then goes whole: no stub is left pointing from a rib)
  float strung = cord*step(0.85, fract(hc*7.3))*parted*step(0.0, min(hole, dFree));      // (second part, P2; third part, P5: three cords in twenty; the others go with their cell, so no even row of stubs stands on a hoop)
  // no hard edge: the skin ends over 5 cm of its own surface (or one pixel's worth, from far)
  float cov = max(smoothstep(0.0, 0.05 + px, min(min(hole, dFree), dS)), max(max(thread, shred), strung*inGap));
  if (spread < 0.0 || vCut + 0.03*(n1 - 0.5) < 0.0 || cov < 0.02) discard;
  // the torn edge is a skin's edge: thick and curled back
  float rimD = min(hole, dS), rim = max((1.0 - smoothstep(0.0, 0.3 + 0.15*(1.0 - o2), rimD))*step(0.0, rimD), max(max(thread, shred), flap));
  lip = max(lip, rim);
  // set froth drawn thin: small cells with fine raised walls (sharp from near), larger plates over them
  vec4 c1 = wBubbles(vec3(fp*1.7, vK.z*9.0)), c2 = wBubbles(vec3(fp*0.42, vK.z*5.0 + 3.0));
  float nearK = 1.0 - smoothstep(14.0, 50.0, dist);
  float wall = max(smoothstep(0.78, 0.98, c1.x)*nearK, 0.35*smoothstep(0.86, 1.0, c2.x));
  float thick = clamp(max(max(lip, fil*(1.0 - 0.75*o2)), max(0.85*cord, 0.4*wall)), 0.0, 1.0)*(1.0 - 0.75*thinP*(1.0 - lip)), thin = 1.0 - thick;      // where it is about to split it is thinner than anywhere
  N.y -= 0.3*thinP; N /= max(length(N), 1e-4);                                      // and it sags there
  // the cords and the lip stand proud: the light finds their sides
  N += 0.22*c1.yzw*nearK + 0.12*c2.yzw + (0.3*(v1 - 0.5) + 0.2*(lip - 0.5))*vec3(0.0, 1.0, 0.0); N /= max(length(N), 1e-4);
  float fres = 1.0 - clamp(dot(N, -V), 0.0, 1.0); fres *= fres;
  // matter: the clear film is pale; cords are darker and denser; the fillet is milk; rose only a breath in the cords
  vec3 alb = uFroth*1.04*(0.74 + 0.26*thin + 0.22*max(fil, lip))*(1.0 - 0.2*cord*(1.0 - lip));
  // (1) LIT FROM THE EYE'S SIDE: pale, with a soft sheen where the sun's light glances off it
  vec3 col = wFrothLight(alb, N, V, 0.0)*(0.92 + 0.3*lip) + alb*uFill*0.5;
  vec3 hA = uSunA - V, hB = uSunB - V; hA /= max(length(hA), 1e-3); hB /= max(length(hB), 1e-3);
  float shA = clamp(dot(N, hA), 0.0, 1.0), shB = clamp(dot(N, hB), 0.0, 1.0);
  shA *= shA; shA *= shA; shA *= shA; shB *= shB; shB *= shB; shB *= shB;
  col += (wPale(uSunACol)*shA*step(0.0, dot(N, uSunA)) + wPale(uSunBCol)*shB*step(0.0, dot(N, uSunB)))*0.22*(0.4 + 0.6*thin);
  col += wSky(vec3(V.x, abs(V.y) + 0.05, V.z)/max(length(vec3(V.x, abs(V.y) + 0.05, V.z)), 1e-3))*0.12*fres*thin;
  col = mix(vec3(dot(col, vec3(0.3, 0.5, 0.2))), col, 0.6);                         // chalk: a dried skin on milk takes little colour of its own
  // (2) BETWEEN THE EYE AND A SUN it is a stained membrane: the sun's own colour comes through, most where the film
  // is thin, least through cord, fillet and lip (they stand dark in it); brighter the nearer the look is to the sun
  float bA = smoothstep(-0.35, 0.4, -dot(N, uSunA)), bB = smoothstep(-0.35, 0.4, -dot(N, uSunB));      // a membrane scatters: grazing light comes through too
  float ta = clamp(dot(V, uSunA), 0.0, 1.0), tb = clamp(dot(V, uSunB), 0.0, 1.0);
  float through = 0.16 + 0.84*thin*thin;
  vec3 glow = (uSunACol*bA*(0.5 + 1.1*ta*ta*ta) + uSunBCol*bB*(0.5 + 1.1*tb*tb*tb))*through*(0.8 + 0.2*n2);
  col += (wPale(uSunACol)*ta*ta + wPale(uSunBCol)*tb*tb)*alb*0.4*fres*lip;          // the curled lip catches the sun behind it
  float al = clamp(mix(0.46 + 0.25*fres, 1.0, thick), 0.0, 1.0)*(1.0 - 0.4*thinP*(1.0 - lip));
  // the rim takes the suns' light through it: rose on the side of the opening that faces the red sun, blue-white on
  // the side that faces the blue one (gr: the way from the opening into the skin, in the world)
  { vec3 gx = dFdx(vW), gy = dFdy(vW);
    vec3 gr = gx*(dFdx(rimD)/max(dot(gx, gx), 1e-8)) + gy*(dFdy(rimD)/max(dot(gy, gy), 1e-8)); gr /= max(length(gr), 1e-4);
    vec3 nA = uSunACol/max(max(uSunACol.r, uSunACol.g), max(uSunACol.b, 1e-3)), nB = uSunBCol/max(max(uSunBCol.r, uSunBCol.g), max(uSunBCol.b, 1e-3));
    float wa = clamp(0.5 - 0.5*dot(gr.xz, uAzA), 0.0, 1.0), wb = clamp(0.5 - 0.5*dot(gr.xz, uAzB), 0.0, 1.0);
    col += rim*alb*(mix(vec3(0.7), nA, 0.7)*uDisc.z*(0.2 + 0.8*wa*wa) + mix(vec3(0.85), nB, 0.7)*uDisc.w*(0.2 + 0.8*wb*wb))*0.42; }
  col = wKnee(col + glow/al);                                                       // what comes through is not thinned with the film
  al *= mix(smoothstep(0.0, 0.3, spread), 1.0, smoothstep(0.8, 1.0, vK.x));              // while it forms it is a veil that thickens from where it is fast
  al *= smoothstep(6.0, 10.0, dist);                                                // the climb keeps 8 m from every film and the dive 10 m where the layout allows (chooseRoute); this only guards the lens itself: nothing of a film is drawn within 6 m of it
#ifdef W_MIRROR
  gl_FragColor = wMirrorOut(col*al*cov);
#else
  gl_FragColor = vec4(wFog(col, vW)*al*cov, al*cov);
#endif
}`;function Xe(e,a,n){const i=[],o=[];for(let l=0;l<=a;l++)for(let d=0;d<=a;d++)i.push(l/a,d/a,0);for(let l=0;l<a;l++)for(let d=0;d<a;d++){const A=l*(a+1)+d,z=A+a+1;o.push(A,z,A+1,A+1,z,z+1)}const t=new h.InstancedBufferGeometry;t.setAttribute("position",new h.BufferAttribute(new Float32Array(i),3)),t.setIndex(o),e=e.slice().sort((l,d)=>d.bay+(d.web?0:.5)-(l.bay+(l.web?0:.5)));const m=e.length,r=()=>new Float32Array(m*3),s=()=>new Float32Array(m*4),u=r(),g=r(),S=r(),c=r(),v=s(),p=s(),y=s(),M=s(),b=new Float32Array(m*9);e.forEach((l,d)=>{u.set(l.a.A,d*3),g.set(l.a.B,d*3),S.set(l.b.A,d*3),c.set(l.b.B,d*3),v.set([l.a.R,l.a.t0,l.a.t1,l.a.p],d*4),p.set([l.b.R,l.b.t0,l.b.t1,l.b.p],d*4),y.set([l.tn0,l.tn1,l.birth,l.dur],d*4),M.set([l.bay,l.b.sagW+(l.web?2:0),l.a.k+10*(l.a.j||0),l.seed],d*4),b.set(l.holes,d*9)});const N=new h.InstancedInterleavedBuffer(b,9);for(let l=0;l<3;l++)t.setAttribute("aH"+l,new h.InterleavedBufferAttribute(N,3,l*3));const x=(l,d)=>new h.InstancedBufferAttribute(l,d);t.setAttribute("aA1",x(u,3)),t.setAttribute("aB1",x(g,3)),t.setAttribute("aA2",x(S,3)),t.setAttribute("aB2",x(c,3)),t.setAttribute("aSh1",x(v,4)),t.setAttribute("aSh2",x(p,4)),t.setAttribute("aF",x(y,4)),t.setAttribute("aM",x(M,4)),t.instanceCount=m,t.boundingSphere=new h.Sphere(new h.Vector3(0,80,-300),900);const f=new h.Mesh(t,n);return f.frustumCulled=!1,f.renderOrder=2,f}const Je=`
${L}
varying vec3 vW, vC; varying vec2 vQ; varying vec2 vS;      // vC: the lump's middle; vS: seed, size (m)
varying vec3 vM;                                         // outward normal of the mass this lump belongs to (zero for a lone one)
varying float vL;                                        // light of the portal on the rim of froth round it
#ifdef W_DEPTH
varying vec4 vZW;                                        // clip z, w of the lump's centre and of its nearest point: each lump is drawn as a ball
#endif
void main(){
  vec2 q = clamp(vQ, -1.0, 1.0); float r2 = dot(q, q), r = sqrt(max(r2, 0.0));
  // a billow: a round body with a lobed outline that boils slowly (three, five and nine lobes, the lump's own phases)
  float ang = atan(q.y, q.x + 1e-5), sd = vS.x*6.2832;
  float lob = 0.8 + 0.1*sin(ang*3.0 + sd*7.0 + uTime*0.31) + 0.06*sin(ang*5.0 - sd*13.0 - uTime*0.47) + 0.035*sin(ang*9.0 + sd*29.0);
  float e = lob - r, px = max(fwidth(r), 1e-4);
#ifdef W_DEPTH
  // a mass is solid: its edge is crisp, dithered over a pixel and a half only (no blending, so no sorting)
  float dth = fract(52.9829189*fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  if (e < px*1.5*(dth - 0.5)) discard;
#else
  float edge = smoothstep(0.0, 0.22, e);
  if (edge < 0.012) discard;
#endif
  float h = sqrt(clamp(1.0 - r2/max(lob*lob, 1e-3), 0.0, 1.0));      // the billow's roundness: 1 in its middle, 0 at its edge
  float t = uTime*0.25;
  vec2 b = vec2(wN(vec3(q*2.6 + sd, t)), wN(vec3(q*2.6 - sd, t + 7.0))) - 0.5;      // smaller billows on it
  float fine = wN(vec3(q*clamp(vS.y, 0.5, 40.0)*0.8 + sd, t*0.7));
  vec3 nv = vec3(q/max(lob, 0.3) + 0.55*b*h, h + 0.15);
  vec3 f = cameraPosition - vC; f /= max(length(f), 1e-3);                          // the card's own frame: toward the eye's place, the world's up
  vec3 rt = vec3(f.z, 0.0, -f.x); rt /= max(length(rt), 1e-3); vec3 up = cross(f, rt);
  vec3 N = rt*nv.x + up*nv.y + f*nv.z; N /= max(length(N), 1e-4);
  float body = step(0.01, dot(vM, vM));
  N = N + 0.5*vM; N /= max(length(N), 1e-4);                                        // each billow has its own lit side; the mass turns them a little
  vec3 Vv = vW - cameraPosition; vec3 V = Vv/max(length(Vv), 1e-3);
  float cleft = 1.0 - smoothstep(0.0, 0.6, h), dimple = 1.0 - smoothstep(0.3, 0.5, fine);
  vec3 alb = mix(uFroth*0.94, uRose*0.72, clamp(0.3*cleft + 0.12*dimple, 0.0, 1.0));   // white; rose only down in the clefts
  // wet froth scatters: each sun's light wraps round a billow from its own side, the whole sky fills the rest
  float wa = clamp(dot(N, uSunA)*0.5 + 0.5, 0.0, 1.0), wb = clamp(dot(N, uSunB)*0.5 + 0.5, 0.0, 1.0);
  vec3 sA = mix(uSunACol, wPale(uSunACol), 0.45), sB = mix(uSunBCol, wPale(uSunBCol), 0.45);      // fresh froth takes more of a sun's own colour on the face it strikes than set froth does
  vec3 col = wFrothLight(alb, N, V, 0.0) + alb*(uFill*2.3 + uAmbHi*0.6 + vL*vec3(0.3, 0.36, 0.5) + 0.46*(sA*wa*wa*wa + sB*wb*wb*wb));
  col *= mix(0.5 - 0.22*body, 1.0, smoothstep(0.0, 0.7, h))*(0.95 + 0.1*fine);     // shadowed hollows between the billows, deep between the lobes of a mass
  // a mass has two flanks: each sun lays a hard light of its own colour on the one that faces it (the mass's own
  // outward normal, so the edge of the light is the mass's, not each billow's); what faces neither is left dark
  float mA = smoothstep(0.1, 0.55, dot(vM, uSunA))*body, mB = smoothstep(0.1, 0.55, dot(vM, uSunB))*body;
  col += alb*(uSunACol*mA*(0.35 + 0.65*wa) + uSunBCol*mB*(0.35 + 0.65*wb))*0.55;
  col *= 1.0 - 0.3*body*(1.0 - mA)*(1.0 - mB);
  // the mass's outline against the sky: lumps on its flank take the sun that stands behind them on their rims
  float flank = 1.0 - body*abs(dot(vM, V)); flank *= flank;
  float rim = 1.0 - h; rim *= rim;
  float ta = clamp(dot(V, uSunA), 0.0, 1.0), tb = clamp(dot(V, uSunB), 0.0, 1.0);
  col += alb*flank*rim*(sA*ta*ta + sB*tb*tb)*0.8;
  // the light under the glass's skin shows in the clefts near the foot: warm and dim (lit matter, never a lamp)
  col += mix(uRose, uFroth, 0.5)*0.1*cleft*exp(-min(max(vW.y, 0.0)/70.0, 30.0))*(1.0 - clamp(vL, 0.0, 1.0));
  col = wKnee(col);
#ifdef W_DEPTH
  gl_FragDepth = clamp(0.5*mix(vZW.x, vZW.z, h)/max(mix(vZW.y, vZW.w, h), 1e-4) + 0.5, 0.0, 1.0);
  gl_FragColor = vec4(wFog(col, vW), 1.0);
#else
  float al = edge*0.94;
  gl_FragColor = vec4(wFog(col, vW)*al, al);
#endif
}`,et=`
vec3 wBill(vec3 C, float size, vec2 corner){
  vec3 f = cameraPosition - C; f /= max(length(f), 1e-3);
  vec3 rt = vec3(f.z, 0.0, -f.x); rt /= max(length(rt), 1e-3);
  return C + (rt*corner.x + cross(f, rt)*corner.y)*size;
}`,_t=`
${L}
${le}
${et}
attribute vec3 aA, aB, aOff; attribute vec4 aSh, aGrow, aMisc;       // the rib's own attributes + aOff: offset (unit), aMisc.z seed
varying vec3 vW, vC; varying vec2 vQ; varying vec2 vS; varying vec3 vM; varying float vL;
void main(){
  vM = vec3(0.0); vL = 0.0;
  float graw = clamp((uU - aGrow.z)/max(aGrow.w, 1e-3), 0.0, 1.0), g = graw*graw*(3.0 - 2.0*graw), seed = fract(aMisc.z), kind = floor(aMisc.z + 0.001);
  // froth boils on a rib's end while it grows, and again on the end that is being lost in the fall (as in the rib shader)
  float ord = floor(aMisc.y/10.0 + 0.001), sagW = aMisc.y - 10.0*ord;
  float sag = clamp(uSag*W_SAG_RUN - W_SAG_LAG*(1.0 - aMisc.x/12.0), 0.0, 1.0)*sagW;
  float lim = kind < 0.5 ? 1.0 - 0.36*sag : 1.0 - clamp(sag*4.4 - (3.0 - ord), 0.0, 1.0);
  float dying = kind < 1.5 ? smoothstep(0.0, 0.05, 1.0 - lim)*(1.0 - smoothstep(0.9, 1.0, 1.0 - lim)) : 0.0;
  // (fourth part, D2 and D3) THE FROTH ON A RIB'S END IS LIVE'S: it sits at the end, on a growing end and on a stump
  // alike, 2.0 to 3.6 radii to a lump, spread 1.6 radii round the end (the second part's small lumps strung down a
  // stump and the third part's small knot are gone). The guard's rule F1 stands in what live did not have: A GROWING
  // END IS INSIDE FROTH until the rib has met its mate or reached its landing (its own growth complete: the rib's own
  // birth and time of growing), and only then the froth thins away, over three tenths of that time again; and round
  // a growing end the lumps are drawn 2.9 radii nearer, so the swollen end (1.8 radii) does not cut them. Every lump
  // is at least 2.0 radii in radius and its middle at most 1.6 radii from the end: the end is inside every one
  float tt = min(g, lim);
  float after = clamp((uU - aGrow.z - aGrow.w)/max(0.3*aGrow.w, 1e-3), 0.0, 1.0); after = after*after*(3.0 - 2.0*after);
  vec3 C = wRib(aA, aB, aSh, aMisc.w, tt, sag);
  if (kind > 0.5 && kind < 1.5) C.y -= clamp(sag*4.4 - (3.0 - ord), 0.0, 1.0)*0.45*length(aB - aA)*tt*tt;
  float r = mix(aGrow.x, aGrow.y, tt);
  float live = max(smoothstep(0.0, 0.03, graw)*(1.0 - after), 0.8*dying)*smoothstep(12.0, 30.0, length(cameraPosition - C));      // none of it at the lens: gone at 12 m (twice the rib clearance), whole from 30 m (as the films)
  vec3 wob = vec3(sin(uTime*1.3 + seed*40.0), sin(uTime*1.7 + seed*23.0), sin(uTime*1.1 + seed*61.0));
  C += (aOff + 0.25*wob)*r*1.6;
  float size = r*(2.0 + 1.6*fract(seed*7.3))*live;
  vec3 wp = wBill(C, size, position.xy);
  vW = wp; vC = C; vQ = position.xy; vS = vec2(seed, size);
  vec4 mv = viewMatrix*vec4(wp, 1.0), cp = projectionMatrix*mv, cb = projectionMatrix*(mv + vec4(0.0, 0.0, r*mix(2.9, 1.3, dying), 0.0));
  gl_Position = vec4(cp.xy, cb.z*cp.w/max(cb.w, 1e-4), cp.w);      // where it is; its depth as if 1.3 radii nearer (2.9 round a growing end: the swollen end and the lump's own place inside it), so the rib's own end does not cut it
}`,Lt=`
${L}
${le}
${et}
uniform vec3 uHornA, uHornB; uniform vec4 uHornSh, uHornG;      // the first arch's rib (polish 1, Q4): its ends, its shape; uHornG: steepness, birth, how long it grows, its radius at the foot
uniform vec4 uTower; uniform vec4 uFront; uniform vec4 uSeat;      // uSeat: where the portal sits, and how far the collar round it has grown
attribute vec4 aP; attribute float aK;
varying vec3 vW, vC; varying vec2 vQ; varying vec2 vS; varying vec3 vM; varying vec4 vZW; varying float vL;
void main(){
  vec3 C; float size; vM = vec3(0.0); vL = 0.0;
  if (aK < 0.5) {
    // the tower: froth streams up a straight column 45 m in radius, ragged at the top, with a core inside so that it is
    // a body from every side; then it sloughs off, from the top down and from the mirror plane outward, into the sea
    float yf = fract(aP.y + uU*2.2), th = aP.x*6.2832 + 0.6*sin(uTime*0.5 + aP.z*20.0), core = step(aP.z, 0.3);
    float head = smoothstep(0.7, 0.95, yf);
    float rad = 41.0 + 9.0*fract(aP.z*5.3) + 5.0*head + 18.0*(1.0 - smoothstep(0.0, 0.08, yf));
    rad += 6.0*sin(th*3.0 + yf*9.0 + uU*30.0);                                                        // billows
    rad *= 1.0 + 0.26*smoothstep(0.3, 0.5, yf)*(1.0 - smoothstep(0.52, 0.7, yf))*max(dot(vec2(cos(th), sin(th)), uAzA), 0.0);      // one shoulder, a third of the way up, on the side the first sun (A) warms: the froth rises fastest there; the outline is not a cone
    rad *= mix(1.0, 0.45, core)*(1.0 - 0.6*smoothstep(0.55, 1.0, yf)*smoothstep(0.55, 1.0, yf));       // a round head at every height it has reached, torn and uneven
    C = vec3(cos(th)*rad, yf*uTower.x*(0.9 + 0.1*aP.w), sin(th)*rad*0.9);
    vM = vec3(cos(th), 0.25, sin(th)); vM /= max(length(vM), 1e-3);
    // the head boils unevenly: it stands higher on one bearing than another and the high side wanders as it climbs
    C.y *= 1.0 - 0.2*smoothstep(0.45, 1.0, yf)*(0.5 + 0.5*sin(th*2.0 + 1.7 + 26.0*uU))*(0.6 + 0.4*sin(th*5.0 - 17.0*uU));
    // what lets go slumps from the head down and spreads outward all round, as ONE mass: no bearing goes before another
    float rel = clamp((uTower.y*1.6 - 0.6*(1.0 - yf) - 0.1*aP.w)/0.4, 0.0, 1.0);
    C.x += cos(th)*rel*rel*(14.0 + 26.0*aP.w); C.z += sin(th)*rel*rel*(12.0 + 22.0*aP.w); C.y -= rel*rel*(80.0 + 140.0*aP.w)*yf;
    size = (6.5 + 9.0*aP.w)*mix(1.0, 1.7, core)*smoothstep(0.0, 0.03, yf)*(1.0 - smoothstep(0.96, 1.0, yf))*uTower.z*(1.0 - smoothstep(0.05, 0.6, rel))*smoothstep(-6.0, 4.0, C.y);
  } else if (aK < 1.5) {
    // the front: a bank of boiling froth across the axis, running ahead of the lens; the piers rise out of it
    float bob = sin(uTime*0.9 + aP.w*30.0);
    C = vec3((aP.x - 0.5)*2.0*uFront.z, aP.y*aP.y*uFront.w + 2.0*bob, uFront.x + (aP.z - 0.5)*80.0);
    C.y *= 1.0 - 0.6*abs(aP.x - 0.5)*2.0;
    C.y = C.y*uFront.y - 9.0*(1.0 - uFront.y);                                      // the bank wells up out of the sea as one heap (nothing hangs in the air)
    vM = vec3((aP.x - 0.5)*1.2, 0.55 + 0.4*aP.y, 0.7); vM /= max(length(vM), 1e-3);
    size = (5.0 + 8.0*aP.w)*smoothstep(0.0, 0.3, uFront.y)*(0.85 + 0.15*bob)*smoothstep(-7.0, 0.0, C.y);
  } else if (aK < 2.5) {
    // froth rain: lumps thrown from the column and its head fall in long arcs into the sea, for as long as the tower stands
    float T = 5.5 + 3.5*aP.z, ph = fract(uTime/T + aP.y), tt = ph*T, th = aP.x*6.2832;
    float v = 7.0 + 17.0*aP.w, h0 = uTower.x*(0.45 + 0.5*fract(aP.z*7.3));
    C = vec3(cos(th), 0.0, sin(th)*0.9)*(46.0 + v*tt);
    C.y = h0 + (6.0 + 10.0*aP.w)*tt - 7.0*tt*tt;
    size = (0.5 + 1.5*aP.w*aP.w)*uTower.z*smoothstep(0.0, 0.06, ph)*(1.0 - smoothstep(0.86, 1.0, ph))*smoothstep(-1.0, 2.5, C.y)*smoothstep(20.0, 110.0, uTower.x);
  } else if (aK > 5.5) {
    // (polish 1, Q4) PIECES STILL SLIDE FROM THE TWO FIRST HORNS: lumps of froth let go at the growing tip of the first
    // arch's two ribs and slide down their outer flanks into the tower's raft, each on the world's clock from its own
    // dealt phase (6 to 12 s a slide), for as long as the two horns grow and by nothing else (the rib's own growth, the
    // ribs' own function: when the arch has closed there is no end left to let go from); each ends by its own slide,
    // in the sea (aP: side, phase, pace, size)
    float sgn = aP.x < 0.5 ? 1.0 : -1.0, s = fract(uTime/(6.0 + 6.0*aP.z) + aP.y), g = wGrown(uHornG.y, uHornG.z), tn = g*(1.0 - s);
    vec3 Q = wRib(uHornA, uHornB, uHornSh, uHornG.x, tn, 0.0); float rr = mix(uHornG.w, 0.31*uHornG.w, tn);
    C = vec3(sgn*(Q.x - 1.15*rr - 0.6), Q.y, Q.z + (fract(aP.x*7.3) - 0.5)*1.6*rr);
    float act = smoothstep(0.08, 0.3, g)*(1.0 - smoothstep(0.8, 1.0, g));      // (third part, U4: the tower's fall is not read)
    size = (1.3 + 2.4*aP.w)*act*smoothstep(0.0, 0.08, s)*(1.0 - smoothstep(0.9, 1.0, s))*smoothstep(-1.0, 2.0, C.y);
  } else if (aK > 4.5) {
    // the skirt: where the froth meets the sea it boils out in a ragged ring of foam and spray, widest while the tower
    // stands, drawn back in as it falls away (aP: bearing, phase, how far out, size)
    float th = aP.x*6.2832, out2 = aP.z*aP.z, hop = abs(sin(uTime*(0.7 + 0.8*aP.w) + aP.y*40.0));
    float rad = uTower.w + 4.0 + 46.0*out2*(1.0 - 0.6*uTower.y);
    C = vec3(cos(th)*rad, (1.0 + 7.0*(1.0 - out2))*hop*(0.4 + 0.6*aP.w) - 0.5, sin(th)*rad*0.9);
    vM = vec3(cos(th)*0.5, 0.85, sin(th)*0.5);
    size = (2.0 + 4.5*aP.w)*(1.0 - 0.5*out2)*uTower.z*(1.0 - smoothstep(0.55, 0.95, uTower.y));
  } else if (aK > 3.5) {
    // the collar: a ragged mass of froth that fills the last arch round the portal (aP: offset from the seat, size)
    C = uSeat.xyz + aP.xyz + vec3(0.0, 0.25*sin(uTime*0.9 + aP.x*3.0 + aP.y), 0.0);
    vM = vec3(aP.xy*0.05, 1.0); vM /= max(length(vM), 1e-3); vL = exp(-max(length(aP.xy) - 8.0, 0.0)/9.0);
    size = aP.w*uSeat.w*(0.94 + 0.06*sin(uTime*1.2083 + aP.y*0.7));
  } else {
    // the fall: pieces let go of the crowns and galleries and drop into the floor. One per 30 m cell of the floor; the
    // sea shader draws the crown each one raises from the same cell numbers (wH2 of the cell)
    vec2 cell = aP.xy; float T = 5.0 + 4.0*wH2(cell + 9.2), ph = fract(uTime/T + wH2(cell + 2.9));
    float act = smoothstep(0.0, 0.06, uSag - 0.5*wH2(cell + 6.6));
    float x = (cell.x + 0.5)*30.0 + (wH2(cell + 1.3) - 0.5)*10.0, z = -(cell.y + 0.5)*30.0 + (wH2(cell + 5.1) - 0.5)*10.0;
    x += sign(x)*8.0;                                         // never nearer than 18 m to the mirror plane, where the lens goes
    float H0 = mix(125.0, 62.0, clamp(cell.y/20.0, 0.0, 1.0))*(1.0 - 0.5*clamp(abs(x)/120.0, 0.0, 1.0));
    float k = clamp(ph/0.62, 0.0, 1.0);
    C = vec3(x + 1.5*sin(uTime*0.8 + aP.z*20.0), H0*(1.0 - k*k), z);
    vec3 toC = C - cameraPosition;
    size = (2.2 + 3.6*aP.w)*act*step(ph, 0.62)*smoothstep(0.0, 0.05, ph)*smoothstep(-2.0, 2.0, C.y)*smoothstep(16.0, 34.0, length(toC));      // a piece is thinned from 34 m and gone at 16 m from the eye (twice the 8 m it keeps from the mirror plane, and that plus the 18 m of its nearest fall line)
  }
  vec3 wp = wBill(C, size, position.xy);
  vec4 vc = viewMatrix*vec4(C, 1.0), c0 = projectionMatrix*vc, c1 = projectionMatrix*(vc + vec4(0.0, 0.0, 0.75*size, 0.0));
  vZW = vec4(c0.z, c0.w, c1.z, c1.w);
  vW = wp; vC = C; vQ = position.xy; vS = vec2(aP.w, size);
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`;function tt(){const e=new h.InstancedBufferGeometry;return e.setAttribute("position",new h.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),e.setIndex([0,1,2,0,2,3]),e.boundingSphere=new h.Sphere(new h.Vector3(0,80,-300),900),e}function Ot(e,a){const n=je(tt(),e.map(m=>({...m.rib,seed:m.seed}))),i=e.length,o=new Float32Array(i*3);e.forEach((m,r)=>o.set(m.off,r*3)),n.setAttribute("aOff",new h.InstancedBufferAttribute(o,3));const t=new h.Mesh(n,a);return t.frustumCulled=!1,t.renderOrder=1,t}function Vt(e,a){const n=e.reduce((s,u)=>s+(u.cells?u.cells.length:u.lumps?u.lumps.length/4:u.n),0),i=tt(),o=new Float32Array(n*4),t=new Float32Array(n);let m=0;for(const s of e){const u=s.rng;if(s.lumps)for(let g=0;g<s.lumps.length;g+=4,m++)o.set(s.lumps.slice(g,g+4),m*4),t[m]=s.kind;else if(s.cells)for(const g of s.cells)o.set([g[0],g[1],u(),u()],m*4),t[m++]=s.kind;else for(let g=0;g<s.n;g++)o.set([u(),u(),u(),u()],m*4),t[m++]=s.kind}i.setAttribute("aP",new h.InstancedBufferAttribute(o,4)),i.setAttribute("aK",new h.InstancedBufferAttribute(t,1)),i.instanceCount=n;const r=new h.Mesh(i,a);return r.frustumCulled=!1,r}function qt(e,a,n,i,o){const t=[],m=n+6;for(let r=0;r<e;r++){const s=i.y+(a()*2-1)*m,u=(a()*2-1)*o(s),g=a(),S=C(1.1,2.9,Math.pow(a(),1.6)),c=(a()-.5)*3,v=Math.hypot(u,s-i.y)-n-.7*S,p=Math.abs(s-i.y)<2.2+1.6*Math.sin(u*.45)*Math.sin(u*.17+1.3)+1.2*(Math.abs(u)/Math.max(o(s),1)),y=Math.atan2(s-i.y,u),M=.25+.75*K(.5+.8*Math.sin(3*y+1.7)*Math.sin(5*y+.4));v>0&&(g<Math.exp(-v/1.1)*M||p&&g<.8)&&t.push(u,s-i.y,c,S)}return t}const at=`
uniform vec4 uSolid; uniform vec2 uSeam;
// x: how far (in the unit dome's arc) this point lies from the nearest seam's gap edge (< 0 inside the gap); y: nearness to a seam 0..1
// (polish 1, second part, R4) A RULE OF THE THING: the skin never opens in two like openings side by side. FIVE SEAMS
// run down from the crown at unlike bearings, no one the mirror of another (all five from the two bearings live deals:
// one near the mirror plane toward the approach, off it by up to 18 degrees; one on the one hand at uSeam.x; one on the
// other hand at uSeam.y - 0.55; two behind, at uSeam.y + 0.25 and at -(uSeam.y + 0.55)). Each is an IRREGULAR LINE: its
// bearing wanders on its way down (up to 17 degrees, 20 m at the foot), and each opens later and less wide than the
// one before it. wSeamOne: the arc from the bearing a to seam k at the height y
float wSeamOne(float a, float b, float y, float k){
  float w = b + (0.6*(wN(vec3(y*4.0, k*7.3, 1.0)) - 0.5) + 0.05*(wN(vec3(y*13.0, k*3.1, 5.0)) - 0.5))*(1.0 - y*y);      // (fourth part, D1: the fine zigzag is a third of the second part's: a seam is a slow wandering line, not a crack)
  return abs(mod(a - w + 3.14159, 6.28318) - 3.14159);
}
vec2 wSeam(vec3 o){
  float rxz = length(o.xz), a = atan(o.x, o.z + 1e-5), y = clamp(o.y, 0.0, 1.0);
  float soft = 0.75 + 0.5*wN(o*3.1 + 4.0);                                         // the gap's edge wanders softly
  float wide = (0.015 + 0.42*y*sqrt(y))*soft, d = 1e3, dn = 1e3, dd, z1;            // open from the crown down
  dd = wSeamOne(a, (uSeam.x - 1.1)*1.2, y, 0.0)*rxz; dn = min(dn, dd); d = min(d, dd - uSolid.z*wide);
  dd = wSeamOne(a, uSeam.x, y, 1.0)*rxz; z1 = clamp(uSolid.z*1.35 - 0.35, 0.0, 1.0); dn = min(dn, dd); d = min(d, dd - z1*wide*0.8);
  dd = wSeamOne(a, 0.55 - uSeam.y, y, 2.0)*rxz; z1 = clamp(uSolid.z*1.15 - 0.15, 0.0, 1.0); dn = min(dn, dd); d = min(d, dd - z1*wide*0.92);
  dd = wSeamOne(a, uSeam.y + 0.25, y, 3.0)*rxz; z1 = clamp(uSolid.z*1.5 - 0.5, 0.0, 1.0); dn = min(dn, dd); d = min(d, dd - z1*wide*0.7);
  dd = wSeamOne(a, -0.55 - uSeam.y, y, 4.0)*rxz; z1 = clamp(uSolid.z*1.25 - 0.25, 0.0, 1.0); dn = min(dn, dd); d = min(d, dd - z1*wide*0.86);
  // (fourth part, D1) two CREASES THAT NEVER OPEN lie in the two widest petals (half way between the first seam and
  // the third, and half way between the two seams behind): seven lines from the crown divide the skin into petals
  dn = min(dn, wSeamOne(a, 0.5*((uSeam.x - 1.1)*1.2 + 0.55 - uSeam.y), y, 5.0)*rxz); dn = min(dn, wSeamOne(a, 2.99159, y, 6.0)*rxz);
  return vec2(d - uSolid.w*0.95, 1.0 - smoothstep(0.0, 0.16, dn));                  // the lift takes the rest
}`,ot=`
${L}
${at}
uniform float uCore;      // 0: the skin; 1: the froth under it
varying vec3 vW, vN, vO;
void main(){
  vec3 o = position; float y = clamp(o.y, 0.0, 1.0);
  vec3 sc = vec3(uSolid.x, uSolid.y, uSolid.x);
  vec3 n = normal/vec3(max(uSolid.x, 1e-3), max(uSolid.y, 1e-3), max(uSolid.x, 1e-3));
  vec3 p;
  if (uCore > 0.5) {
    // the froth: a billowed body just under the skin that wells out along the seams as they open
    vec2 sm = wSeam(o);
    float bil = wN(o*2.2 + vec3(0.0, uTime*0.12, 0.0)) + 0.5*wN(o*5.3 - vec3(uTime*0.1, 0.0, 0.0));
    p = o*sc*(0.9 + 0.07*(bil - 0.75) + uSolid.z*(0.05 + 0.13*sm.y) + 0.1*uSolid.w);
  } else {
    // the skin (second part, R4): its pieces FOLD BACK AND SINK. As the froth comes up through it each piece leans out
    // from the crown, lies down outward on the glass and goes under; none is carried up, none stands as a point
    vec2 xz = o.xz/max(length(o.xz), 1e-3); float fold = clamp(uSolid.w*1.5, 0.0, 1.0); fold = fold*fold*(3.0 - 2.0*fold);
    p = o*sc + vec3(xz.x, 0.0, xz.y)*uSolid.x*y*(0.1*uSolid.z + 0.7*fold);
    // (fourth part, D1) as the pieces part their tips at the crown are carried up a little by the froth (live lifted
    // the pieces whole): up to a quarter of the dome's height at a third of the fold, and down again with the fold;
    // five unlike tips for a moment, none left standing
    float tipUp = uSolid.w*1.5; tipUp = clamp(tipUp*3.0, 0.0, 1.0)*clamp(1.0 - (tipUp - 0.33)/0.5, 0.0, 1.0);
    p.y = p.y*(1.0 - 0.95*fold) - 3.0*fold*fold + uSolid.y*0.25*y*y*tipUp*(0.6 + 0.8*wN(vec3(xz*2.3, 7.0)));
  }
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vW = wp.xyz; vN = mat3(modelMatrix)*n; vO = o;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,Kt=`
${L}
${Ie}
${at}
varying vec3 vW, vN, vO;
void main(){
  vec2 sm = wSeam(vO);
  if (sm.x < 0.0) discard;
  vec3 Vv = vW - cameraPosition; vec3 V = Vv/max(length(Vv), 1e-3); vec3 N = vN/max(length(vN), 1e-4);
  N += 0.02*(vec3(wN(vW*0.05 + uTime*0.05), 0.5, wN(vW*0.05 + 7.0 - uTime*0.04)) - 0.5); N /= max(length(N), 1e-4);      // the skin is alive: the mirror wavers
  float f = 1.0 - clamp(dot(N, -V), 0.0, 1.0);
  vec3 R = reflect(V, N);
  vec3 Ru = vec3(R.x, abs(R.y) + 0.002, R.z); Ru /= max(length(Ru), 1e-4);
  // below the horizon the bubble mirrors the sea: dark, with the sky's glare lying on it
  vec3 seaC = vec3(0.02, 0.008, 0.012) + wSky(Ru)*0.4;
  vec3 env = mix(seaC, wSky(Ru), smoothstep(-0.02, 0.02, R.y));
  float angA = length(Ru - uSunA)*57.3, angB = length(Ru - uSunB)*57.3;
  env += uRadA.rgb*uDisc.z*(uRadA.w*(1.0 - smoothstep(uDisc.x*1.6, uDisc.x*2.2, angA)) + 1.1*exp(-angA*0.16) + 0.35*exp(-angA*0.04));
  env += uRadB.rgb*uDisc.w*(uRadB.w*(1.0 - smoothstep(uDisc.y*2.0, uDisc.y*3.5, angB)) + 1.1*exp(-angB*0.2) + 0.35*exp(-angB*0.05));
  vec3 col = env*(1.0 + 0.8*f*f) + (uAmbHi + uFill)*0.7*f*f;
  float mott = wN(vW*0.06 + vec3(0.0, uTime*0.04, 0.0)), breath = 0.8 + 0.2*sin(uTime*1.2083);      // the 5.2 s rhythm
  col += mix(uFroth, uRose, 0.3)*breath*(0.14 + 0.14*mott)*(1.0 - 0.4*f);                             // the light under the skin
  vec3 hA = uSunA - V; hA /= max(length(hA), 1e-3); vec3 hB = uSunB - V; hB /= max(length(hB), 1e-3);
  float ha = clamp(dot(N, hA), 0.0, 1.0), hb = clamp(dot(N, hB), 0.0, 1.0);
  col += uSunACol*uDisc.z*0.5*pow(ha, 12.0) + uSunBCol*uDisc.w*0.5*pow(hb, 12.0);                    // each sun lies on it as a broad sheen
  // (fourth part, D1) THE SEAMS ARE THERE TO READ FROM THE FIRST MOMENT, before anything opens or lifts: along each of
  // the five seams a dark crease (0.02 of the dome's radius to each side) between two pale raised lips of set froth
  // (out to 0.07), from the crown to the foot, dividing the skin into petals. Where a seam has opened the crease lies
  // in the gap and live's own lip (below) takes its place
  { float crease = smoothstep(0.9, 0.99, sm.y), lipS = smoothstep(0.55, 0.9, sm.y)*(1.0 - crease);
    vec3 lipS3 = wFrothLight(uFroth*0.95, N, V, 1.2)*(0.6 + 0.6*lipS) + uFroth*uFill;
    col = mix(col, wKnee(lipS3), 0.8*lipS);
    col *= 1.0 - 0.6*crease; }
  // the torn edge has thickness: a lip of set froth, shaded on the cut and lit on its rim (0.05 of the dome's radius wide)
  float lipT = clamp(sm.x/0.05, 0.0, 1.0), lip = step(1e-4, uSolid.z)*(1.0 - smoothstep(0.6, 1.0, lipT));
  vec3 lipC = wFrothLight(uFroth*0.95, N, V, 1.2)*(0.5 + 0.9*smoothstep(0.0, 0.45, lipT)) + uFroth*uFill;
  col = mix(col, wKnee(lipC), lip);
  // (third part, P3) A BUBBLE GIVING WAY, not a shell breaking: beside an opening seam the skin thins and goes glassy
  // (its own light under the skin shows through) and the froth wells out through the seam and OVER the skin in
  // billows, further as the seam opens: no clean broken edge is left
  { float wB = (0.012 + 0.07*uSolid.z)*(0.45 + 1.1*wN(vO*6.0 + vec3(0.0, uTime*0.07, 0.0))), open = smoothstep(0.0, 0.08, uSolid.z);      // (fourth part, D1: a narrow band, a quarter of the third part's: the petals between the seams stay bare skin)
    float over = open*(1.0 - smoothstep(0.55*wB, wB, sm.x)), thinS = open*(1.0 - smoothstep(wB, 2.6*wB, sm.x));
    vec3 bN = N + 0.6*(vec3(wN(vO*13.0), wN(vO*13.0 + 5.0), wN(vO*13.0 + 9.0)) - 0.5); bN /= max(length(bN), 1e-4);
    vec3 welled = wKnee((wFrothLight(uFroth*0.94, bN, V, 0.6) + uFroth*(uFill*2.0 + uAmbHi*0.5))*(0.7 + 0.5*wN(vO*21.0 + 3.0)));
    col = mix(col, mix(col*0.55, mix(uFroth, uRose, 0.3)*0.5, 0.6), 0.7*thinS);
    col = mix(col, welled, over); }
  gl_FragColor = vec4(wFog(col, vW), 1.0);
}`,Gt=`
${L}
varying vec3 vW, vN, vO;
void main(){
  vec3 Vv = vW - cameraPosition; vec3 V = Vv/max(length(Vv), 1e-3); vec3 N = vN/max(length(vN), 1e-4);
  vec4 b1 = wBubbles(vO*6.5 + vec3(0.0, uTime*0.05, 0.0)), b2 = wBubbles(vO*17.0 + 3.0);
  N += 0.75*b1.yzw + 0.3*b2.yzw; N /= max(length(N), 1e-4);
  float cleft = clamp(0.8*b1.x + 0.35*b2.x, 0.0, 1.0);
  vec3 alb = mix(uFroth*0.94, uRose*0.72, 0.25*cleft);
  float wa = clamp(dot(N, uSunA)*0.5 + 0.5, 0.0, 1.0), wb = clamp(dot(N, uSunB)*0.5 + 0.5, 0.0, 1.0);
  vec3 col = (wFrothLight(alb, N, V, 0.6) + alb*(uFill*2.6 + uAmbHi*0.6 + 0.34*(wPale(uSunACol)*wa*wa*wa + wPale(uSunBCol)*wb*wb*wb)))*(1.0 - 0.5*cleft);
  col += mix(uRose, uFroth, 0.5)*0.07*cleft*cleft;                                  // the light under the glass's skin, in the clefts
  gl_FragColor = vec4(wFog(wKnee(col), vW), 1.0);
}`;async function $t(e,a={}){const n=a.forks||mt(e.rng),i=e.quality?.detail??1,o=a.shared||gt(),t=bt({ratio:a.ratio,tiers:a.tiers});a.shared||(o.uSunACol.value.multiplyScalar(2),o.uSunBCol.value.multiplyScalar(1.6),o.uSunB.value.set(.61,.12,-.79).normalize());const m=new h.Group,r=xt(t),{rIn:s}=t.collar,u=t.arches[t.arches.length-1],g=t.main[t.main.length-1];for(const w of[t.main,t.gal])for(const R of w)R.seed=n.hall();for(const w of t.leg)w.seed=n.legs();for(const w of t.bigFilms)w.seed=n.films();for(const w of t.webs)w.seed=n.webs();const S=w=>e.core.makeRng(e.core.hashSeed(w+":"+e.seed)),c=S("ocean-seams"),v=S("ocean-skirt"),p=S("ocean-holes"),y=[(48+30*c())*Math.PI/180,(112+30*c())*Math.PI/180],M=()=>{const w=p()<.5?1:-1;return[.5-w*(.08+.14*p()),.26+.12*p(),.13+.06*p(),.5+w*(.1+.16*p()),.6+.16*p(),.06+.05*p(),.2+.6*p(),.42+.4*p(),.03+.035*p()]},b=new Map;for(const w of t.bigFilms){const R=w.bay+":"+w.band;b.has(R)||b.set(R,M()),w.holes=b.get(R)}for(const w of t.webs)w.holes=[.5,.5,.15,0,0,0,0,0,0];const N=[];for(const[w,R]of[[t.main,12],[t.gal,4],[t.leg,1]])for(const ae of w)for(let j=0;j<R;j++){const oe=n.tips(),Q=n.tips()*6.283,Z=n.tips()*2-1,Y=Math.sqrt(1-Z*Z),D=.4+.6*n.tips();N.push({rib:ae,seed:oe,off:[Math.cos(Q)*Y*D,Z*D,Math.sin(Q)*Y*D]})}await e.yield();const x=w=>i>=1||!w.outer,f=t.leg.filter(x);t.legs=f;const l=new h.ShaderMaterial({uniforms:o,vertexShader:$e,fragmentShader:Ht,side:h.DoubleSide}),d=U(t.main,40,15,l);await e.yield();const A=U(t.gal,20,8,l);await e.yield();const z=U(f,6,6,l);await e.yield(),m.add(d,A,z);const F=new h.ShaderMaterial({uniforms:o,vertexShader:Ze,fragmentShader:Ye,side:h.DoubleSide,transparent:!0,depthWrite:!1,blending:h.CustomBlending,blendSrc:h.OneFactor,blendDst:h.OneMinusSrcAlphaFactor,blendSrcAlpha:h.OneFactor,blendDstAlpha:h.OneMinusSrcAlphaFactor});m.add(Xe([...t.bigFilms,...t.webs.filter(w=>i>=1||w.j===0)],12,F)),await e.yield();const T={defines:{W_MIRROR:1},side:h.DoubleSide,depthTest:!1,depthWrite:!1,blending:h.CustomBlending,blendEquation:h.MaxEquation,blendSrc:h.OneFactor,blendDst:h.OneFactor},k=new h.ShaderMaterial({uniforms:o,vertexShader:$e,fragmentShader:Ct,...T}),W=new h.ShaderMaterial({uniforms:o,vertexShader:Ze,fragmentShader:Ye,...T}),E=[U(t.main,20,8,k),U(t.gal,10,6,k),U(f,3,4,k),Xe([...t.bigFilms,...t.webs.filter(w=>i>=1||w.j===0)],6,W)];for(const w of E)w.renderOrder=-2,m.add(w);await e.yield();const V={transparent:!0,depthWrite:!1,blending:h.CustomBlending,blendSrc:h.OneFactor,blendDst:h.OneMinusSrcAlphaFactor,blendSrcAlpha:h.OneFactor,blendDstAlpha:h.OneMinusSrcAlphaFactor},st=new h.ShaderMaterial({uniforms:o,vertexShader:_t,fragmentShader:Je,...V}),nt=Ot(N.filter(w=>w.rib.kind!==2||x(w.rib)),st);await e.yield();const $={...o,uTower:{value:new h.Vector4(0,0,0,0)},uFront:{value:new h.Vector4(0,0,50,60)},uSeat:{value:new h.Vector4(r.x,r.y,r.z,0)},uHornA:{value:new h.Vector3(...t.main[0].A)},uHornB:{value:new h.Vector3(...t.main[0].B)},uHornSh:{value:new h.Vector4(t.main[0].R,t.main[0].t0,t.main[0].t1,t.main[0].p)},uHornG:{value:new h.Vector4(t.main[0].k,t.main[0].birth,t.main[0].dur,t.main[0].r0)}},it=new h.ShaderMaterial({uniforms:$,vertexShader:Lt,fragmentShader:Je,defines:{W_DEPTH:1}}),Fe=[];for(let w=0;w<=20;w++)for(let R=-4;R<=3;R++)Fe.push([R,w]);const rt=Vt([{kind:0,n:1800,rng:n.lumps},{kind:1,n:420,rng:n.lumps},{kind:2,n:Math.round(520*i),rng:n.rain},{kind:3,cells:Fe,rng:n.pieces},{kind:5,n:300,rng:v},{kind:6,n:28,rng:S("ocean-slide")},{kind:4,lumps:qt(Math.round(1500*Math.max(i,.7)),n.collar,s,r,w=>Math.abs(H(g,ye(g,Math.min(w,.98*u.H)))[0]))}],it);await e.yield(),m.add(nt,rt),await e.yield();const te={value:new h.Vector4(58,27,0,0)},Ne={value:new h.Vector2(y[0],y[1])},lt={...o,uSolid:te,uSeam:Ne,uCore:{value:0}},ht={...o,uSolid:te,uSeam:Ne,uCore:{value:1}},ke=new h.SphereGeometry(1,64,20,0,Math.PI*2,0,Math.PI/2),we=new h.Mesh(ke,new h.ShaderMaterial({uniforms:lt,vertexShader:ot,fragmentShader:Kt,side:h.DoubleSide})),pe=new h.Mesh(ke,new h.ShaderMaterial({uniforms:ht,vertexShader:ot,fragmentShader:Gt}));we.frustumCulled=!1,pe.frustumCulled=!1,m.add(we,pe),await e.yield();const q=Rt(t,S("ocean-elsewhere")),Be={value:new h.Vector4(q[0].x,q[0].z,q[0].r,0)},Pe={value:new h.Vector4(q[1].x,q[1].z,q[1].r,0)};await e.yield();let ve=0,ge=0;const Re=t.arches[t.arches.length-1].birth;function Te(){const w=ve,R=be;o.uU.value=w,o.uSag.value=We(w);const[ae,j]=vt(w);$.uTower.value.set(ie.H*ae,j,_(B.burst-R(.1*I.r),B.burst+R(.25*I.r),w)*(1-_(B.gone-R(.25*G),B.gone,w)),ie.r);const oe=He(w),Q=K(-oe/(P.length+20));$.uFront.value.set(oe,_(B.gone-R(.5*G),B.gone+R(.5*G),w)*(1-_(B.last,B.last+B.arch,w)),C(56,34,Q),C(70,46,Q));const Z=1+.05*Math.sin(ge*1.2083),Y=_(0,B.burst,w),D=K(ie.H*ae/(2*I.h)),se=_(.05,.6,j);te.value.set((I.r-14+14*Y)*(1-.8*se),Math.max(.5,C(22,I.h,Y)*Z*(1-se*se)),_(B.burst-R(.5*I.r),B.burst,w),D),we.visible=D<.999,pe.visible=se<.999,[Be,Pe].forEach((ct,ft)=>{const ne=q[ft];ct.value.w=Pt*ne.r*_(ne.from,ne.from+Bt,o.uSag.value)*(1+.05*Math.sin(ge*1.2083+ne.ph))}),$.uSeat.value.w=_(Re+.5*B.arch,Re+1.2*B.arch,w)}return Te(),{object:m,radius:330,height:150,center:new h.Vector3(0,60,-300),ground:!1,plan:t,shared:o,mirrored:{uDome:te,uTower:$.uTower,uElseA:Be,uElseB:Pe},anchors:{portalSeat:r,axis:new h.Vector3(0,0,-1)},setProgress(w){ve=w},update(w,R){ge=R,o.uTime.value=R,a.driven||(ve=R%20/20),Te()},dispose(){}}}export{Le as ARC,kt as CLIMB_STEEP,_e as CROWN_CLEAR,St as DIVE_CLEAR,Oe as DIVE_STEEP,I as DOME,Ge as ELSE_APART,Pt as ELSE_HIGH,Ke as ELSE_MARGIN,Bt as ELSE_RISE,dt as FORKS,Qe as FRINGE,P as HALL,At as LAST_CLEAR,Me as NAVE_OPEN,Ee as SAG_LAG,re as SAG_RUN,Nt as SKIN_LEAST,Ft as SKIN_NEAR,X as STANDOFF,B as TL,yt as TOP_CLEAR,ie as TOWER,L as W_COMMON,Et as W_FILM_CLOCK,Tt as W_GLASS_DISC,le as W_RIB,Ie as W_SKY,be as axisM,xe as birthAtZ,$t as buildHero,O as byShare,ut as camZ,Ut as chooseRoute,ue as clearance,Dt as dealWorld,Rt as elsewhere,ze as filmSamples,He as frontZ,bt as layout,gt as makeShared,Mt as obstacles,xt as planSeat,H as ribPoint,Ve as routePoints,We as sagAt,zt as skins,mt as takeForks,vt as towerAt,J as vAt};
