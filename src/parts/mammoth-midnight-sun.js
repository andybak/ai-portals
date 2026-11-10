import*as r from"three";import{Geo as Ne}from"../kit/fauna/common.js";const Ke=["#F2A28A","#F6C877","#7F86B5","#A8A46A","#B9C2B0","#3B2620","#F4D03A"],_=t=>new r.Color(t),Fe=Math.PI*2,oe=t=>Math.min(1,Math.max(0,t)),ne=(t,a,i)=>{const p=oe((i-t)/(a-t));return p*p*(3-2*p)},J=t=>{const a=Math.sin(t*127.1+311.7)*43758.5453;return a-Math.floor(a)};function Ze(t,a){const i=t.length-1,p=Math.min(i-1e-6,Math.max(0,a*i)),k=Math.floor(p),C=p-k,W=t[Math.max(0,k-1)],g=t[k],P=t[k+1],Y=t[Math.min(i,k+2)],E=C*C,G=E*C,D=[];for(let v=0;v<3;v++)D.push(.5*(2*g[v]+(P[v]-W[v])*C+(2*W[v]-5*g[v]+4*P[v]-Y[v])*E+(3*g[v]-W[v]-3*P[v]+Y[v])*G));return D}function Ee(t={}){const a=new Ne,i=!!t.calf,p=_(t.coat||"#3B2620"),k=_(t.skirt||"#8A4E2A"),C=_(t.wool||"#B08A62"),W=_(t.ivory||"#E8DCC0"),g=p.clone().multiplyScalar(.62),P=p.clone().lerp(k,.3),Y=_("#4a3a36"),E=k.clone().lerp(C,.15),G=C.clone().multiplyScalar(.6),D=16,v=i?[[-1.98,1.8,1.42,.3],[-1.72,2.02,1.22,.6],[-1.25,2.12,1.12,.74],[-.7,2.2,1.08,.8],[-.15,2.32,1.08,.8],[.3,2.46,1.12,.76],[.62,2.52,1.18,.7],[.92,2.46,1.28,.6],[1.16,2.36,1.4,.5],[1.34,2.3,1.5,.4]]:[[-2.02,1.74,1.4,.3],[-1.8,1.98,1.22,.62],[-1.42,2.07,1.12,.8],[-.95,2.16,1.06,.9],[-.45,2.3,1.03,.95],[0,2.5,1.05,.94],[.35,2.68,1.1,.88],[.62,2.76,1.16,.8],[.88,2.7,1.26,.7],[1.1,2.52,1.38,.58],[1.26,2.4,1.48,.5],[1.4,2.36,1.56,.4]],L=[{z:v[0][0]-.1,y:1.56,rx:0,ry:0}];for(const d of v)L.push({z:d[0],y:(d[1]+d[2])/2,rx:d[3],ry:(d[1]-d[2])/2});const N=a.loft(L,{sides:D,top:p,belly:P,shade:[-.5,.35]});a.glow(N,.25),a.paint(N,(d,y,e,n)=>{const s=ne(.1,.6,Math.sin(d*3.1+e*2.3)*Math.sin(e*4.7-y*2+1.3)*.5+.5*J(Math.round(d*5)+Math.round(e*5)*7.3)-.1)*ne(-.5,.4,e)*ne(1.5,2.2,y)*(i?.5:1);n.lerp(G,s*.55),y<1.5&&n.lerp(k,.3)});const w=d=>{for(let e=0;e<v.length-1;e++)if(d<=v[e+1][0]){const n=oe((d-v[e][0])/(v[e+1][0]-v[e][0]));return[v[e][1]+(v[e+1][1]-v[e][1])*n,v[e][2]+(v[e+1][2]-v[e][2])*n,v[e][3]+(v[e+1][3]-v[e][3])*n]}const y=v[v.length-1];return[y[1],y[2],y[3]]},S=(d,y,e=0)=>{const[n,s,f]=w(d);return[Math.sin(y)*(f+e),(n+s)/2+Math.cos(y)*((n-s)/2+e),d]},l=(d,y,e,n,s,f={})=>{const c=a.n,b=f.jit??.5;for(let M=0;M+1<d.length;M++){const A=d[M],u=d[M+1],m=J(M*3.7+A[2]*11+A[1]*5+(f.seed||0)),T=y(M,m),z=1-b+b*2*m,ee=A[0]+(u[0]-A[0])*(.2+.6*J(m*91)),I=A[1]+(u[1]-A[1])*.5,H=A[2]+(u[2]-A[2])*(.2+.6*J(m*37)),$=.86+.28*J(m*53.1+M*.37),O=e.clone().multiplyScalar($),X=n.clone().multiplyScalar($),te=a.v(A[0],A[1],A[2],O),me=a.v(u[0],u[1],u[2],O),we=a.v(ee+T[0]*z,I+T[1]*z,H+T[2]*z,X);a.tri(te,me,we);for(const[K,fe]of[[te,0],[me,0],[we,1]])a.a[K*4]=m,a.a[K*4+1]=fe,a.a[K*4+2]=s,a.a[K*4+3]=f.w??0,a.pv[K*3]=(A[0]+u[0])/2,a.pv[K*3+1]=I,a.pv[K*3+2]=(A[2]+u[2])/2,a.g[K]=fe?1:f.root??.45}return[c,a.n]},h=()=>{const d=v[1][0]+.05,y=v[v.length-3][0];for(const e of[-1,1])(i?[[1.25,.34,34,p,P],[1.9,.36,40,P,k]]:[[1,.42,44,p,P],[1.5,.52,56,p,P],[1.8,.5,60,P,k],[2.05,.64,72,P,k],[2.5,.58,56,P,E],[2.85,.5,60,g,k]]).forEach(([s,f,c,b,M],A)=>{const u=[];for(let m=0;m<=c;m++){const T=d+(y-d)*(m/c)+A%2*.04,z=S(T,s+.1*Math.sin(m*1.7+A),.03+A*.012);u.push([e*z[0],z[1],z[2]])}l(u,(m,T)=>[e*(.05+.05*T)*(s>2.3?-1:1),-f*(.75+.5*J(m*13.1+A)),-.1-.12*T],b,M,8,{seed:A*13+e,w:.6+.4*Math.min(1,A/3)})});for(const e of[-.07,.07]){const n=i?30:44,s=[];for(let f=0;f<=n;f++){const c=d+(v[v.length-1][0]-d)*(f/n),b=S(c,0,-.02);s.push([e*(.6+J(f*7.7)),b[1],c])}l(s,(f,c)=>{const b=s[f][2],M=ne(-.3,.5,b)*(1-ne(.75,1.2,b));return[e*1.2,.004+.016*M+.008*c,-.12-.07*c]},g,p.clone().lerp(k,.4),8,{seed:e*90,w:.15,root:.5})}if(!i)for(const e of[-1,1])for(let n=0;n<7;n++){const s=-.1+J(n*5.1+e)*1,f=.35+J(n*9.3+e*2)*.9,c=[];for(let b=0;b<=3;b++){const M=S(s+b*(.05+.05*J(n*3.3+b)),f+.06*J(b*7.1+n),.04);c.push([e*M[0],M[1],M[2]])}l(c,(b,M)=>[e*(.06+.1*M),-.12-.2*M,-.12*M],p.clone().lerp(C,.55),C.clone().multiplyScalar(.92),8,{seed:n*31+e,w:.9,root:.7,jit:.7})}};t.staged||h();const B={calf:i,cTop:p,cSkirt:k,cWool:C,cIvory:W,cDeep:g,cMid:P,cSkin:Y,cTip:E,skin:S,locks:l,topAt:w,coatLocks:h,staged:!!t.staged};return t.staged?{g:a,K:B}:He(a,B)}async function Qe(t={},a=async()=>{}){const i=Ee({...t,staged:!0});await a(),i.K.coatLocks(),await a(),He(i.g,i.K),await a(),Ie(i.g,i.K,!0),await a();const p=i.g.build();await a();const k=p.attributes.position.count;for(let C=0;C<k;C+=5e3)Ye(p,C,Math.min(k,C+5e3)),await a();return p.computeBoundingSphere(),p}function He(t,a){const{calf:i,cTop:p,cSkirt:k,cWool:C,cIvory:W,cDeep:g,cMid:P,cSkin:Y,cTip:E,locks:G}=a,D=(i?62:68)*Math.PI/180,v=Math.sin(D),L=Math.cos(D),N=i?.92:1,w=i?[0,2.7,1.46]:[0,2.99,1.44],S=(e,n,s)=>[w[0]+e*N,w[1]+(n*L-s*v)*N,w[2]+(n*v+s*L)*N],l=t.n,h=[[.1,0,.2,.24],[.3,.02,.3,.38],[.55,.04,.37,.46],[.8,.06,.4,.47],[1.02,.1,.38,.41],[1.22,.16,.31,.31],[1.38,.2,.25,.25]],B=t.loft([{z:-.03,y:0,rx:0,ry:0},...h.map(e=>({z:e[0],y:e[1],rx:e[2],ry:e[3]}))],{sides:14,top:p,belly:P,shade:[-.6,.2]});t.glow(B,.3),t.paint(B,(e,n,s,f)=>{s>1.05&&f.lerp(Y,ne(1.05,1.35,s)*.6),s<.4&&f.lerp(g,.5)});const d=(e,n,s=0)=>{let f=0;for(;f<h.length-2&&e>h[f+1][0];)f++;const c=h[f],b=h[f+1],M=oe((e-c[0])/(b[0]-c[0])),A=c[1]+(b[1]-c[1])*M,u=c[2]+(b[2]-c[2])*M+s,m=c[3]+(b[3]-c[3])*M+s;return[Math.sin(n)*u,A+Math.cos(n)*m,e]};for(const e of[-1,1]){const n=d(.8,1.12,-.012),s=t.n;t.blob(e*n[0],n[1],n[2],.036,.058,.062,_("#0d0907"),null,6,4),t.glow([s,t.n],-2);const f=t.n;t.fan([[e*(n[0]+.03),n[1]+.035,n[2]-.03],[e*(n[0]+.03),n[1]+.055,n[2]-.012],[e*(n[0]+.032),n[1]+.03,n[2]-.006]],_("#fff4e0")),t.glow([f,t.n],-3),t.anim([s,t.n],()=>[0,0,7,0]),t.pivot([s,t.n],e*(n[0]-.03),n[1],n[2]);const c=d(.62,1.75,0),b=t.n,M=i?.26:.3;t.fan([[e*c[0],c[1]+.07,c[2]-.08],[e*(c[0]+.1),c[1]-.12,c[2]-.1],[e*(c[0]+.14),c[1]-.16,c[2]+M*.45],[e*(c[0]+.1),c[1]-.08,c[2]+M],[e*c[0],c[1]+.04,c[2]+M*.8]],P,k),t.anim([b,t.n],u=>[e,oe((Math.abs(u)-c[0])/.14),5,0]),t.pivot([b,t.n],e*c[0],c[1],c[2]),t.glow([b,t.n],.6);const A=[];for(let u=0;u<=9;u++){const m=d(.55+u*.075,2.05+.04*Math.sin(u*2.1),.02);A.push([e*m[0],m[1],m[2]])}G(A,(u,m)=>[e*.03,-.26-.14*m,.16+.05*m],P,k,9,{seed:40+e,w:.5})}for(const e of[-.05,.05]){const n=[];for(let s=0;s<=8;s++){const f=d(.04+s*.07,0,0);n.push([e*(1+.5*J(s*3.3+e)),f[1]-Math.abs(e)*.25,f[2]-(1-s/8)*.03-Math.abs(e)*.1])}G(n,(s,f)=>[e*.8,.004+.008*f,-.08-.04*f],g,p.clone().lerp(k,.5),9,{seed:70+e*10,w:.3,root:.5})}{const e=[];for(let n=0;n<=8;n++){const s=Math.PI+(n/8-.5)*1.5,f=d(1.12,s,.01);e.push(f)}G(e,(n,s)=>[0,-.34-.12*s,.2],P,k,9,{seed:55,w:.6})}if(!i)for(const e of[-1,1]){const n=d(1.2,1.25,-.06),s=[[.27,0,0],[.38,-.46,.2],[.62,-.8,.62],[.66,-.8,1.06],[.46,-.56,1.3],[.2,-.36,1.3]],f=S(n[0],n[1],n[2]),c=[],b=[],M=14,A=t.n;for(let m=0;m<=M;m++){const T=m/M,z=Ze(s,T);c.push([e*(f[0]-s[0][0]+z[0]),f[1]+z[1],f[2]+z[2]-.02]),b.push(m===M?0:.078*(1-.72*T*T)*(.9+.1*Math.cos(T*3)))}const u=t.tube(c,b,7,W,W);t.glow(u,-4),t.paint(u,(m,T,z,ee,I)=>{const H=Math.floor((I-A)/7)/M;ee.lerp(_("#6e4a2c"),1-ne(.02,.3,H)),ee.multiplyScalar(.9+.1*Math.sin(H*60))}),t.anim(u,()=>[0,0,6,0]),t.pivot(u,c[0][0],c[0][1],c[0][2])}const y=new Set;for(let e=l;e<t.n;e++)t.a[e*4+2]===6&&y.add(e);for(let e=l;e<t.n;e++){if(y.has(e))continue;const n=S(t.p[e*3],t.p[e*3+1],t.p[e*3+2]);t.p[e*3]=n[0],t.p[e*3+1]=n[1],t.p[e*3+2]=n[2];const s=S(t.pv[e*3],t.pv[e*3+1],t.pv[e*3+2]);t.pv[e*3]=s[0],t.pv[e*3+1]=s[1],t.pv[e*3+2]=s[2],t.a[e*4+2]===0&&(t.a[e*4+2]=2)}{const e=S(0,.2,1.3),n=i?1.5:2.02,s=16,f=[],c=[];let b=e[1],M=e[2];for(let I=0;I<=s;I++){const H=I/s,$=-D+(-(Math.PI/2)-.1+D)*ne(0,.45,H)-ne(.62,1,H)*1.25;f.push([0,b,M]),c.push((.245-.165*Math.pow(H,.8))*N),b+=Math.sin($)*n/s,M+=Math.cos($)*n/s}const A=t.n,u=t.tube(f,c,9,P,Y);t.paint(u,(I,H,$,O,X)=>{const te=Math.floor((X-A)/9);O.multiplyScalar(te%2?.8:1.05)}),t.anim(u,(I,H,$,O)=>[0,Math.floor((O-A)/9)/s,4,0]),t.pivot(u,e[0],e[1],e[2]),t.glow(u,(I,H,$,O)=>Math.floor((O-A)/9)/s>.8?-1:.3);const m=f[s],T=[0,f[s][1]-f[s-1][1],f[s][2]-f[s-1][2]],z=Math.hypot(T[1],T[2])||1,ee=t.n;t.tube([[0,m[1],m[2]],[0,m[1]+T[1]/z*.1+.02,m[2]+T[2]/z*.1+.035],[0,m[1]+T[1]/z*.2+.015,m[2]+T[2]/z*.2+.05]],[.05,.03,0],5,Y,_("#6a5650")),t.anim([ee,t.n],()=>[0,1,4,0]),t.pivot([ee,t.n],e[0],e[1],e[2]),t.glow([ee,t.n],-1);for(const I of[-1,1]){const H=[];for(let O=0;O<=9;O++){const X=O,te=f[X];H.push([I*c[X]*.75,te[1],te[2]+c[X]*.55])}const $=G(H,(O,X)=>[I*.05,-.2-.1*X,.03],P,k,4,{seed:80+I,root:.4});for(let O=$[0];O<$[1];O++){const X=Math.floor((O-$[0])/3);t.a[O*4+1]=(X+.5)/s,t.pv[O*3]=e[0],t.pv[O*3+1]=e[1],t.pv[O*3+2]=e[2]}}}return a.staged?null:Ie(t,a)}function Ie(t,a,i){const{calf:p,cTop:k,cSkirt:C,cDeep:W,cMid:g,cSkin:P,cTip:Y,locks:E}=a,G=p?.84:1,D=(v,L,N)=>{const w=v*(L?.5:.48),S=L?.62:-1.42,l=L?1.95:1.72,h=L?[[w,l,S],[w,1.52,S+.03],[w,1.16,S-.05],[w,.78,S+.01],[w,.46,S+.04],[w,.2,S+.03],[w,.07,S+.06],[w,0,S+.06]]:[[w,l,S],[w,1.32,S+.12],[w,1,S+.17],[w,.64,S+.03],[w,.42,S-.05],[w,.2,S-.01],[w,.07,S+.03],[w,0,S+.03]],B=(L?[.36,.31,.25,.215,.19,.205,.25,.24]:[.4,.35,.27,.205,.18,.2,.245,.235]).map(e=>e*G),d=t.tube(h,B,9,g,W);t.anim(d,(e,n)=>[N,oe((l-n)/l),1,0]),t.pivot(d,w,l,S),t.glow(d,(e,n)=>n<.1?-1:.3),t.paint(d,(e,n,s,f)=>{n<.1&&f.copy(s>S+.2&&n<.08&&n>.01?_("#5d5247"):P)}),(p?[[1.2,.36],[.7,.3]]:[[1.42,.5],[1.02,.46],[.62,.4],[.3,.22]]).forEach(([e,n],s)=>{let f=S,c=.25;for(let u=0;u+1<h.length;u++)if(h[u][1]>=e&&h[u+1][1]<=e){const m=(h[u][1]-e)/(h[u][1]-h[u+1][1]);f=h[u][2]+(h[u+1][2]-h[u][2])*m,c=B[u]+(B[u+1]-B[u])*m}const b=[],M=9;for(let u=0;u<=M;u++){const m=u/M*Fe+s;b.push([w+Math.cos(m)*(c+.02),e+.04*Math.sin(u*2.7),f+Math.sin(m)*(c+.02)])}const A=E(b,(u,m)=>{const T=(u+.5)/M*Fe+s;return[Math.cos(T)*.07,-n*(.8+.4*m),Math.sin(T)*.07-.04]},s<2?g:W,s<2?C:g,1,{seed:100+s*7+v*3+(L?50:0),jit:.2});for(let u=A[0];u<A[1];u++){const m=t.a[u*4+1];t.a[u*4]=N,t.a[u*4+1]=oe((l-(e-(m?n*.6:0)))/l),t.a[u*4+3]=m,t.pv[u*3]=w,t.pv[u*3+1]=l,t.pv[u*3+2]=S}})};D(-1,!1,0),D(-1,!0,.22),D(1,!1,.5),D(1,!0,.72);{const v=p?1.86:1.8,L=p?-2.06:-2.1,N=t.n;t.tube([[0,v,L+.08],[0,v-.12,L-.06],[0,v-.32,L-.1],[0,v-.5,L-.08]],[.07,.055,.04,.03],5,k,W);const w=[];for(let S=0;S<=6;S++){const l=S/6*Fe;w.push([Math.cos(l)*.035,v-.46,L-.08+Math.sin(l)*.035])}E(w,(S,l)=>[0,-.22-.08*l,-.03],W,k,3,{seed:200}),t.anim([N,t.n],(S,l)=>[0,oe((v-l)/.7),3,0]),t.pivot([N,t.n],0,v,L+.08),t.glow([N,t.n],.5)}return i?t:Je(t)}function Je(t){const a=t.build();return Ye(a,0,a.attributes.position.count),a.computeBoundingSphere(),a}const et=new r.Vector3,tt=new r.Vector3;function Ye(t,a,i){const p=t.attributes.position,k=t.attributes.normal,C=t.attributes.aAnim,W=t.attributes.aGlow;for(let g=a;g<i;g++){const P=C.getZ(g);if(!(P===8||P===9||P===1&&(W.getX(g)===1||W.getX(g)===.45)||P===4&&W.getX(g)>=.4||P===3&&W.getX(g)>=.45))continue;const E=p.getX(g),G=p.getY(g),D=et.set(E*1.2,(G-1.75)*.8,.15).normalize().lerp(tt.set(k.getX(g),k.getY(g),k.getZ(g)),.25).normalize();k.setXYZ(g,D.x,D.y,D.z)}}const ce=`
uniform float uTime, uWalk, uStream;
uniform vec4 uArc, uBluff;   // uBluff: (q where the slump ramp starts, its run, its drop, 0): the stream pours down it
uniform vec3 uSunDir, uSunCol, uSkyCol, uGroundCol;
float h11(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
float groundY(float q){ float w = max(uArc.z, 1.); return -uArc.y * (1. - exp(-(q * q) / (w * w))) - uBluff.z * smoothstep(uBluff.x, uBluff.x + max(uBluff.y, 1.), q); }
vec3 arcPos(float a, float q){ float ph = a / uArc.x, rr = uArc.x + q; return vec3(rr * sin(ph), groundY(q), uArc.x - rr * cos(ph)); }
// local (x = outward, z = along the walk) -> object space at arc coordinate a
vec3 arcDir(float a, vec3 v){ float ph = a / uArc.x, c = cos(ph), s = sin(ph); return vec3(v.x * s + v.z * c, v.y, -v.x * c + v.z * s); }
`,We=`
uniform float uCloud;
float clh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float cln(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(clh(i), clh(i + vec2(1., 0.)), f.x), mix(clh(i + vec2(0., 1.)), clh(i + vec2(1., 1.)), f.x), f.y); }
float cloudShade(vec2 p, float t){ return uCloud * smoothstep(.54, .63, cln(p * .017 + t * vec2(.1, .045)) * .72 + cln(p * .05 - t * vec2(.05, .02)) * .28); }
`,at=`
${We}
float gSunVis = 1.;   // how much of the sun reaches this fragment (cloud shadow); set in main before litCoat
uniform float uTime, uFill;   // uFill: how much of the sky / ground fill reaches this coat (1 = the midnight look; lower under a high sun, so form reads)
uniform vec3 uSunDir, uSunCol, uSkyCol, uGroundCol;
varying vec3 vN, vWorld, vObj, vCol;
varying float vHair;
float vh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(vh(i), vh(i + vec2(1., 0.)), f.x), mix(vh(i + vec2(0., 1.)), vh(i + vec2(1., 1.)), f.x), f.y); }
// one light model for every animal here: wrapped low sun, sky/ground fill that never crushes, backlit hair halo
vec3 litCoat(vec3 base, vec3 N, vec3 V, float hair, float halo){
  float ndl = dot(N, uSunDir), wrap = max(0., (ndl + .5) / 1.5);
  vec3 hemi = mix(uGroundCol, uSkyCol, N.y * .5 + .5) * uFill * (1.45 - .45 * min(wrap, 1.));   // the shadow side is filled a little more: it never crushes
  float back = max(0., -dot(V, uSunDir)), fres = 1. - abs(dot(N, V)); fres = fres * fres;
  vec3 c = base * (uSunCol * wrap * wrap * gSunVis + hemi);
  // halo: hair edges and lock tips catch the level sun when we look toward it; a weaker sky rim everywhere
  vec3 tipC = mix(base, vec3(.9, .55, .32), .5);
  c += tipC * uSunCol * gSunVis * halo * (fres * fres * (.12 + 2.2 * back * back) + hair * hair * hair * (.02 + .5 * back * back * back));
  c += base * uSkyCol * fres * .35;
  return c;
}
`,ot=`
attribute vec4 aAnim, iA, iB; attribute vec3 aPivot, iTint; attribute float aGlow;
varying vec3 vN, vWorld, vObj, vCol; varying float vHair;
${ce}
#include <fog_pars_vertex>
const float LS = 2.0, DUTY = .68;
vec2 footAt(float f){   // x: fore-aft offset of the foot from its rest place, y: lift. Planted for DUTY of the stride, moving back exactly as fast as the body goes forward.
  f = fract(f);
  if(f < DUTY) return vec2(LS * (DUTY * .5 - f), 0.);
  float u = (f - DUTY) / (1. - DUTY), e = u * u * (3. - 2. * u);
  return vec2(LS * DUTY * (e - .5), sin(u * 3.14159));
}
void rotX(inout vec3 d, float a){ float c = cos(a), s = sin(a); d.yz = vec2(d.y * c - d.z * s, d.z * c + d.y * s); }
void main(){
  vec3 p = position, n = normal; float part = aAnim.z, w = aAnim.y, seed = iB.z, sc = iA.z, stand = iB.w;
  float adv = uWalk * (1. - stand), cyc = adv * (uArc.x + iA.y) / uArc.x / (LS * sc) + iA.w;
  float t = uTime;
  float raise = max(stand, uStream * smoothstep(.2, .8, .5 + .5 * sin(t * .37 + seed * 4.)));
  if(part > .5 && part < 1.5){
    vec2 fa = footAt(cyc + aAnim.x), fl = footAt(cyc + aAnim.x - .12);
    float hind = step(aPivot.z, 0.), sw = w, lw = smoothstep(.3, 1., w);
    p.z += fa.x * sw + fa.y * .2 * sin(lw * 3.14159) * (hind > .5 ? 1. : .7) + (fl.x - fa.x) * aAnim.w * .5;
    p.y += fa.y * (.16 * lw + aAnim.w * .03);
  } else {
    if(part > 5.5 && part < 6.5) p = aPivot + (p - aPivot) * iB.x;
    if(part > 6.5 && part < 7.5){ float bl = smoothstep(.985, 1., sin(t * .83 + seed * 5.)); p = mix(p, aPivot, bl); }
    if(part > 3.5 && part < 4.5){   // trunk: curl and reach, raised when the saiga come through
      float ww = w * w, A = (.22 * sin(t * .55 + seed * 3.) + .12 * sin(t * 1.3 + seed) + raise * (1.25 + .25 * sin(t * .9 + seed))) ;
      vec3 d = p - aPivot; rotX(d, -A * (w * .6 + ww * .9)); p = aPivot + d;
      p.x += ww * .22 * sin(t * .7 + seed * 2.) * (1. - .5 * raise);
    }
    if(part > 4.5 && part < 5.5){ float fk = sin(t * 1.3 + seed * 9. + aAnim.x); fk = fk * fk; fk = fk * fk; p.x += aAnim.x * w * .16 * fk; p.z -= w * .08 * fk; }
    if(part > 2.5 && part < 3.5){ p.x += w * w * .32 * sin(t * 2.1 + seed * 7.); p.z -= w * w * .05; }
    if(part > 7.5){   // hair: a pendulum a quarter-stride behind the body, and the wind
      float sw2 = sin((cyc * 2. - .25) * 6.2832) * (1. - stand);
      float gust = sin(t * 1.7 + position.z * 2.3 + seed) * .5 + sin(t * .6 - iA.x * .05) * .5;
      p.z -= w * aAnim.w * .085 * sw2;
      p.x += w * (.02 + .03 * aAnim.w) * gust * sign(position.x + 1e-4) + w * .03 * gust;
      p.y += w * aAnim.w * .015 * sw2;
    }
    if(part > 1.5 && (part < 2.5 || part > 3.5) && (part < 7.5 || part > 8.5)){   // the head nods once a stride and looks about
      vec3 np = vec3(0., 2.25, 1.12), d = p - np;
      rotX(d, -(.05 * sin(cyc * 6.2832 + 1.) * (1. - stand) + .03 * sin(t * .4 + seed * 6.) - raise * .1));
      float yw = .1 * sin(t * .23 + seed * 8.) + .05 * sin(t * .61 + seed); float c = cos(yw), s = sin(yw);
      d.xz = vec2(d.x * c + d.z * s, d.z * c - d.x * s); p = np + d;
    }
    // body: two bobs a stride, a roll over the planted side, the flank breathing every 6 s
    float bob = cos(cyc * 12.566) * (1. - stand);
    p.y += .028 * bob; p.x += .04 * sin(cyc * 6.2832 + .6) * (p.y / 2.7) * (1. - stand);
    float fl = smoothstep(.45, .9, abs(position.x)) * smoothstep(-1.5, -.9, position.z) * (1. - smoothstep(-.1, .5, position.z));
    p.x *= 1. + .03 * fl * sin(t * 1.047 + seed * 3.);
  }
  float a = iA.x + adv;
  vec3 obj = arcPos(a, iA.y) + arcDir(a, p * sc);
  vObj = position; vCol = color * iTint; vHair = aGlow;
  vec4 wp = modelMatrix * vec4(obj, 1.); vWorld = wp.xyz;
  vN = normalize(mat3(modelMatrix) * arcDir(a, n));
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,nt=`
${at}
uniform float uExpo, uShag, uSnow;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)), V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.));
  float hair = clamp(vHair, 0., 1.), dist = length(cameraPosition - vWorld), fade = 1. - smoothstep(22., 70., dist);
  vec3 base = vCol, c;
  gSunVis = 1. - .66 * cloudShade(vWorld.xz, uTime);
  if(vHair > -.5){
    // skin at the fine scale: strands running down the coat, clumps across it; fades to the mean before it can shimmer
    // (polish 3) hanging hair with form: locks a hand wide that run down the coat (the 3 cm strand noise sat at the size of
    // a pixel at 10 m and read as speckle), finer strands only within a few metres; every lock is darker at its root, in the
    // shade of the tier above it, and lighter and warmer toward its tip, so the skirt reads as layers of hair
    float fine = 1. - smoothstep(5., 14., dist);
    float st = vnoise(vec2((vObj.z + vObj.x * .7) * 12., vObj.y * 1.5)), st2 = vnoise(vec2((vObj.z - vObj.x * .5) * 37., vObj.y * 3.3));
    float cl = vnoise(vObj.zy * 2.7 + vObj.x * 1.3), shag = step(.5, uShag);
    if(shag > .5 && vHair > .5 && st * (.8 + .2 * fine) + st2 * .2 * fine < (vHair - .5) * 1.6 * fade) discard;
    float tipk = smoothstep(.42, 1., vHair) * step(.4, vHair);
    base *= mix(1., mix(1., .74 + .4 * st + .22 * (st2 - .5) * fine, fade * .9) * (.84 + .32 * cl) * mix(1., mix(.7, 1.22, tipk), step(.4, vHair)), shag);
    base = mix(base, base * vec3(1.12, 1., .86), tipk * shag * .6);
    if(uShag < .5){
      // saiga (polish 3): a short summer coat lying back along the body. The sky's fill on the back is warmed so the back stays
      // cinnamon (it read as a flat grey slab); a harder key gives the barrel form; every back carries a rose rim toward the sun.
      float fadeS = 1. - smoothstep(9., 30., dist);
      float fur = vnoise(vec2(vObj.x * 46. + vObj.y * 23., vObj.z * 11.)) * .6 + vnoise(vec2(vObj.y * 60., vObj.z * 17. + vObj.x * 9.)) * .4;
      base *= mix(1., .78 + .44 * fur, fadeS) * (.9 + .2 * vnoise(vObj.zy * 5. + vObj.x * 3.));
      float ndl = dot(N, uSunDir), wrap = max(0., (ndl + .3) / 1.3);
      vec3 skyW = mix(uSkyCol, vec3(dot(uSkyCol, vec3(.3333))) * vec3(1.1, .97, .84), .62);
      vec3 hemi = mix(uGroundCol * .95, skyW * .7, N.y * .5 + .5) * uFill;
      float back = max(0., -dot(V, uSunDir)), fres = 1. - abs(dot(N, V)); fres *= fres;
      c = base * (uSunCol * wrap * wrap * gSunVis * 1.1 + hemi * (1.75 - .5 * min(wrap, 1.)));
      c += mix(base, vec3(1., .66, .5), .6) * uSunCol * gSunVis * fres * (.1 + 1.1 * back * back) * smoothstep(-.3, .4, N.y) * .5;
      c += base * uSkyCol * fres * .22;
      c *= uExpo * mix(.76, 1., smoothstep(-.8, .05, N.y)); c = min(c, vec3(1.1));   // (polish m4) the rim never clips a back to a pale shape
    } else {
      c = litCoat(base, N, V, hair, .3 + .7 * hair);
      float bk = max(0., -dot(V, uSunDir)), sd = max(0., dot(N, uSunDir));
      c += mix(base, vec3(.95, .6, .36), .55) * uSunCol * gSunVis * hair * hair * (.05 + .3 * bk * bk + .12 * sd);   // lock tips catch the low sun: a lit edge on every tier
      c *= uExpo;
    }
    c = mix(vec3(dot(c, vec3(.3, .55, .15))), c, mix(1., .72, uShag));
    // first snow: a thin broken dusting on the dome and the hump only, the hair showing through it
    // a thin grey-white frosting with feathered edges, the dark hair showing through it as streaks; warm on the sun side, blue in shade
    float sn = vnoise(vObj.xz * 5. + 3.) * .6 + vnoise(vObj.zx * 13. + vObj.y * 4.) * .4;
    float snow = uSnow * step(.5, uShag) * smoothstep(.45, .95, N.y + .2 * cl) * smoothstep(2.42, 2.78, vObj.y + .14 * cl)
      * smoothstep(.28, .7, sn + .2 * (N.y - .7)) * (1. - smoothstep(.25, .7, hair));
    snow *= mix(.75, 1. - .8 * smoothstep(.3, .62, st * .6 + st2 * .4), fade);
    c = mix(c, vec3(.6, .64, .72) * uExpo * .85 * (uSkyCol * .34 + uSunCol * gSunVis * (.08 + .6 * max(dot(N, uSunDir), 0.))), snow * .85);
  } else if(vHair > -1.5){ c = litCoat(base, N, V, 0., .1) * uExpo * .8; }   // bare skin
  else if(vHair > -2.5){   // eye: wet dark ball
    vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.)); float sp = max(dot(N, H), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
    c = vec3(.012, .008, .006) + uSkyCol * .012 * (1. - abs(dot(N, V))) + uSunCol * sp * .4;
  } else if(vHair > -3.5){ c = uSunCol * .45 + vec3(.1); }   // the highlight
  else if(vHair > -4.5){   // ivory: smooth, a soft highlight
    vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.)); float sp = max(dot(N, H), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
    c = litCoat(base, N, V, 0., .5) * .24 + uSunCol * sp * .2;
  } else {   // saiga horn: translucent amber wax that glows against the sun
    float back = max(0., -dot(V, uSunDir));
    c = base * (uSkyCol * .25 + uSunCol * (.35 + 1.6 * back * back));
  }
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}
`;function $e(t={}){const a=new Ne,i=(t.lod||"near")==="near",p=t.lod==="far",k=i?8:4,C=_(t.coat||"#C49A62"),W=_(t.cream||"#EFE3CC"),g=C.clone().multiplyScalar(.7),P=C.clone().lerp(W,.3),Y=_("#6a5646"),E=_(t.horn||"#E0A040"),G=_("#3a2e26"),D=[{z:-.6,y:.7,rx:0,ry:0},{z:-.55,y:.69,rx:.105,ry:.13},{z:-.4,y:.665,rx:.165,ry:.185},{z:-.2,y:.69,rx:.143,ry:.135},{z:.02,y:.65,rx:.175,ry:.175},{z:.22,y:.615,rx:.19,ry:.225},{z:.36,y:.65,rx:.15,ry:.19},{z:.46,y:.69,rx:.095,ry:.13},{z:.54,y:.7,rx:.07,ry:.092}],v=a.loft(p?[{z:-.62,y:.67,rx:0,ry:0},{z:-.52,y:.655,rx:.16,ry:.18},{z:.24,y:.625,rx:.2,ry:.22},{z:.56,y:.7,rx:.08,ry:.1}]:i?D:[D[0],D[2],D[3],D[5],D[6],D[8]],{sides:k,top:C,belly:W,shade:[-.7,-.12]});a.paint(v,(l,h,B,d)=>{B<-.36&&h<.8?d.lerp(W,.92):B<-.22&&h<.72&&Math.abs(l)<.12?d.lerp(W,.7):h>.55&&h<.71&&Math.abs(l)>.1&&d.lerp(g,.14),h>.74&&B>-.42&&B<.5&&d.lerp(g,Math.abs(l)<.09?.7:.38),B>.1&&B<.4&&h<.62&&Math.abs(l)>.08&&d.lerp(g,.18),B>.43&&h<.6&&d.lerp(W,.45)}),a.glow(v,.35);const L=a.n,N={top:P,belly:P};if(p)a.fan([[0,.8,.5],[0,.6,.52],[0,.5,.9],[0,.74,.86]],C,P);else{const l=a.loft([{z:.52,y:.7,rx:.068,ry:.09},{z:.62,y:.705,rx:.08,ry:.092},{z:.7,y:.685,rx:.062,ry:.076},{z:.78,y:.655,rx:.086,ry:.115,...N},{z:.855,y:.612,rx:.09,ry:.122,...N},{z:.91,y:.56,rx:.062,ry:.082,...N},{z:.925,y:.495,rx:0,ry:0,top:Y}],{sides:i?6:3,top:C,belly:W,shade:[-.9,-.4]});a.glow(l,.3)}if(i)for(const l of[-1,1]){a.fan([[l*.065,.775,.585],[l*.175,.855,.535],[l*.085,.75,.515]],C,g);const h=a.n;a.fan([[l*.077,.735,.655],[l*.073,.712,.69],[l*.079,.704,.65]],_("#0d0907")),a.glow([h,a.n],-2)}if(!p)for(const l of[-1,1]){const h=i?a.tube([[l*.045,.78,.6],[l*.09,.89,.575],[l*.095,.99,.57],[l*.06,1.09,.59]],[.034,.03,.022,.005],3,E,E.clone().lerp(_("#fff0c0"),.3)):a.fan([[l*.025,.78,.63],[l*.075,.78,.57],[l*.07,1.09,.585]],E);i&&a.paint(h,(B,d,y,e,n)=>{Math.floor((n-h[0])/3)%2===1&&e.multiplyScalar(.62)}),a.anim(h,()=>[0,0,3,0]),a.pivot(h,l*.04,.76,.6),a.glow(h,-5)}if(!p)for(let l=L;l<a.n;l++){const h=a.p[l*3+1],B=a.p[l*3+2];a.a[l*4+2]===0&&h>.7&&B>.5&&B<.74&&(a.c[l*3]*=.74,a.c[l*3+1]*=.72,a.c[l*3+2]*=.7)}for(let l=L;l<a.n;l++)a.a[l*4+2]===0&&(a.a[l*4+2]=2,a.a[l*4+1]=oe((a.p[l*3+2]-.52)/.38));const w=(l,h,B)=>{const d=l*.105,y=h?.3:-.37,e=.6,n=h?[[d,e,y],[d,.46,y+.012],[d,.325,y+.03],[d,.05,y+.012],[d,0,y+.035]]:[[d*1.05,e+.03,y],[d*1.1,.47,y-.035],[d,.335,y-.115],[d,.05,y-.05],[d,0,y-.025]],s=h?[.09,.062,.037,.026,.032]:[.12,.088,.041,.027,.032],f=i?a.tube(n,s,3,C,g,{flatten:1.25}):p?a.strip([[0,e,y-.07],[0,0,y-.03]],[[0,e,y+.07],[0,0,y+.03]],C,g):a.strip([n[0],n[2],n[4]].map((c,b)=>[c[0],c[1],c[2]-s[b*2]*1.2]),[n[0],n[2],n[4]].map((c,b)=>[c[0],c[1],c[2]+s[b*2]*1.2]),C,g);a.anim(f,(c,b)=>[B,oe((e-b)/e),1,0]),a.pivot(f,d,e,y),a.glow(f,.2),a.paint(f,(c,b,M,A)=>{b<.04?A.copy(G):b<.34&&A.lerp(g,.45)})};w(-1,!1,0),w(-1,!0,.08),p||(w(1,!1,.5),w(1,!0,.58));{const l=a.n;a.fan([[0,.78,-.575],[.028,.66,-.635],[-.028,.66,-.635]],g),a.glow([l,a.n],.4)}const S=a.build();for(const l of["position","aPivot"]){const h=S.getAttribute(l);if(h)for(let B=0;B<h.count;B++)h.setZ(B,h.getZ(B)*.85),h.setY(B,h.getY(B)*1.03)}return S.computeBoundingSphere(),S}const De=`
uniform vec4 uRiverW, uBarBox; uniform sampler2D uBarTex;   // (centre x, centre z, radius of the near bank, y of the bars); (x0, z0, 1/width, 1/depth) of the baked plain
float rvh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float rvn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(rvh(i), rvh(i + vec2(1., 0.)), f.x), mix(rvh(i + vec2(0., 1.)), rvh(i + vec2(1., 1.)), f.x), f.y); }
float riverChv(vec2 p, out float dB){
  dB = length(p - uRiverW.xy) - uRiverW.z;
  float bx = p.x - uRiverW.x, bz = -(p.y - uRiverW.y); if(abs(bz) < 1e-3) bz = 1e-3;
  vec2 rp = vec2(atan(bx, bz) * uRiverW.z, dB);
  float wv = rvn(rp * vec2(.004, .012)) * 2. - 1., wv2 = rvn(rp * vec2(.011, .03) + 7.) * 2. - 1.;
  float ch1 = abs(sin(dB * .047 + wv * 2.6 + wv2 * .9 + rp.x * .004)), ch2 = abs(sin(dB * .027 - rp.x * .019 + wv2 * 2.4 + 1.7)), ch3 = abs(sin(dB * .021 + rp.x * .013 + wv * 3.1 + 4.));
  return min(ch1, min(ch2, ch3) + .1) + .25 * (rvn(rp * vec2(.02, .07)) - .5);
}
// x: 0 on a bar .. 1 in open water; y: 0 at the waterline .. 1 in mid channel; z: metres the plain stands above its datum here
vec3 riverAt(vec2 p){
  if(uRiverW.z <= 0.) return vec3(0.);
  float dB, chv = riverChv(p, dB), out0 = smoothstep(6., 16., dB);
  vec2 uv = (p - uBarBox.xy) * uBarBox.zw;
  float inb = step(0., uv.x) * step(uv.x, 1.) * step(0., uv.y) * step(uv.y, 1.);
  return vec3((1. - smoothstep(.36, .44, chv)) * out0, (1. - smoothstep(.12, .4, chv)) * out0, textureLod(uBarTex, clamp(uv, 0., 1.), 0.).r * .75 * inb);
}
`,Ve=`
uniform vec4 uMam[NM]; uniform vec4 uLane, uBull, uQ, uRepel; uniform vec3 uWidth, uWrap; uniform vec2 uNearFade; uniform float uRate, uFlow;   // uRepel: (a, q, radius, q reach) one more thing the stream bends round (0 radius = none)
float flowAt(float lane, float q, float seed){
  float k1 = smoothstep(-110., -12., q), k2 = smoothstep(6., 38., q), wv = 1.4 * sin(seed * 40.);
  float ac = mix(mix(uLane.x, uLane.y, k1), uLane.z, k2), w = mix(mix(uWidth.x, uWidth.y, k1), uWidth.z, k2);
  float a = ac + lane * w + 1.4 * sin(q * .06 + seed * 40.);
  float A0 = uLane.y + lane * uWidth.y + wv, sh = uWalk - q * uRate;
  float aL = -1e4, aR = 1e4, cL = 0., cR = 0.;
  for(int i = 0; i < NM; i++){ float m = uMam[i].x + sh; if(m <= A0){ if(m > aL){ aL = m; cL = uMam[i].y; } } else if(m < aR){ aR = m; cR = uMam[i].y; } }
  float A1;
  if(aR > 9e3) A1 = A0 + cL * exp(-(A0 - aL) / 5.);
  else if(aL < -9e3) A1 = A0 - cR * exp(-(aR - A0) / 5.);
  else { float lo = aL + cL, hi = aR - cR; A1 = hi > lo ? mix(lo, hi, (A0 - aL) / max(aR - aL, .01)) : (lo + hi) * .5; }
  float g = q / 7.; g *= g; g = 1. / (1. + g * g);
  a += (A1 - A0) * g;
  float d = a - uBull.x, gb = (q - uBull.y) / 6.; gb *= gb; gb = 1. / (1. + gb * gb);
  a += sign(d) * max(0., uBull.z - abs(d)) * gb;
  float d2 = a - uRepel.x, g2 = (q - uRepel.y) / max(uRepel.w, 1.); g2 *= g2; g2 = 1. / (1. + g2 * g2);
  float k2r = max(0., 1. - abs(d2) / max(uRepel.z, .01)); a += (d2 < 0. ? -1. : 1.) * uRepel.z * k2r * k2r * g2 * step(.01, uRepel.z);
  return a;
}
// THE FORDS' LAW (live's own, moved here from the world's FORD_VERT letter for letter so that cards and whole animals run the same lines):
// six fords fanning out over the bars from the foot of the slump, each a loose drift of animals that thins and bunches. x = the lane draw (-1..1).
float fordAt(float x, float q, float seed){
  float ford = (floor(x * 3.) + .5) / 3. + .05 * (fract(seed * 13.3) - .5);                // six fords
  float jit = fract(seed * 5.7) + fract(seed * 91.3) - 1., bunch = .55 + .45 * sin(q * .05 + floor(x * 3.) * 1.7 + seed * 3.);
  float fan = ford * (q - 104.) * .42 + 4. * sin(q * .013 + floor(x * 3.) * 2.1) + 15. * jit * bunch;
  return flowAt(ford, q, seed) + fan;
}
`,rt=`
attribute vec4 aAnim, iA, iB; attribute vec3 aPivot, iTint; attribute float aGlow;
varying vec3 vN, vWorld, vObj, vCol; varying float vHair;
${ce}
${Ve}
${De}
#include <fog_pars_vertex>
void rotX(inout vec3 d, float a){ float c = cos(a), s = sin(a); d.yz = vec2(d.y * c - d.z * s, d.z * c + d.y * s); }
void main(){
  vec3 p = position, n = normal; float part = aAnim.z, w = aAnim.y, seed = iA.w, t = uTime;
  float span = max(uQ.y - uQ.x, 1.), run = uFlow * iB.w + iA.y * span, q = uQ.x + fract((run - uQ.x) / span) * span;
  float lane = uWrap.x + (fract((iA.x - uWrap.x) / max(uWrap.y, .01) + .5) - .5) * uWrap.y;
  float edge = uWrap.y < 1.99 ? 1. - smoothstep(.8, 1., abs(lane - uWrap.x) / max(uWrap.y * .5, .01)) : 1.;
  float cyc = run / 1.8 + seed * 7.;
  // now and then one leaps a metre high to look
  float lp = fract(t * .2 * (.7 + .6 * h11(seed * 3.)) + h11(seed * 5. + 1.)), leap = (lp < .16 && h11(seed * 9. + 2.) > .5) ? sin(lp / .16 * 3.14159) : 0.;
  if(part > .5 && part < 1.5){
    // (polish m3) not clones: two in five bound (fore pair together, hind pair together) while the rest pace; each has its own reach
    float lph = h11(seed * 17. + 4.) > .6 ? (aPivot.z > 0. ? .02 : .47) + (aPivot.x > 0. ? .09 : 0.) : aAnim.x;
    // (m7) a leap that has legs: off the ground the fore pair reaches forward and the hind pair trails back at full length
    // (live tucked the cannon bones up under the belly, .12 m, and a body in the air read as a floating barrel)
    float ph = (cyc + lph) * 6.2832, ang = (.6 + .36 * h11(seed * 13. + 2.)) * sin(ph) * (1. - .8 * leap) + .85 * leap * (aPivot.z > 0. ? -1. : 1.);
    vec3 d = p - aPivot; float lw = smoothstep(.35, 1., w);
    rotX(d, -ang); d.y += lw * .1 * max(cos(ph), 0.) * (1. - leap); d.z -= lw * .1 * max(cos(ph), 0.) * (aPivot.z > 0. ? 1. : -.6);
    p = aPivot + d;
  }
  if(part > 2.5 && iB.x < .5) p = aPivot;                           // does carry no horns
  if(part > 1.5) p.y += w * (.022 * sin(cyc * 12.566 + 1.) + .05 * leap);   // the nose bobs; head up in the leap
  if(part > 1.5) p.y += max(p.z - .43, 0.) * ((h11(seed * 11. + 6.) - .42) * .5 + .08 * sin(cyc * 6.2832 + seed));   // head carried low by one, up by the next
  p.y += (p.z - .05) * (.035 + .04 * h11(seed * 19.)) * sin(cyc * 12.566 + seed * 9.);                                  // the body rocks over its stride
  p.y += .012 * sin(cyc * 12.566) + leap * 1.0;
  rotX(p, -leap * .25 * cos(lp / .16 * 3.14159));
  float a1 = flowAt(lane, q, seed), a2 = flowAt(lane, q + .7, seed);
  vec3 P1 = arcPos(a1, q), P2 = arcPos(a2, q + .7), fw = normalize(P2 - P1 + vec3(0., 0., 1e-5)), rt = normalize(cross(vec3(0., 1., 0.), fw) + vec3(1e-5, 0., 0.));
  fw = normalize(fw + rt * (h11(seed * 23. + 1.) - .5) * .26); rt = normalize(cross(vec3(0., 1., 0.), fw) + vec3(1e-5, 0., 0.)); vec3 up = cross(fw, rt);   // each on its own line
  // (m7) in the river it stands on the plain's true surface (the bars stand up to half a metre proud of the datum) and WADES:
  // a hand deep at the waterline, belly-deep (.46 m of a .6 m leg) in mid channel, so the land's own water hides its legs
  if(q > uBluff.x){ vec3 rv = riverAt(P1.xz); P1.y += rv.z - (.16 + .3 * rv.y) * rv.x * iA.z * (1. - .6 * leap); }
  float vis = step(uQ.z, q) * step(q, uQ.w) * smoothstep(0., 8., q - uQ.x) * smoothstep(0., 8., uQ.y - q) * edge;
  vis *= smoothstep(uNearFade.x, uNearFade.y, distance(cameraPosition, P1));   // a far tier gives way to the full animals near the camera
  vis *= h11(seed * 29. + 3.) < .17 ? .72 : 1.;                               // this year's young run among them
  vec3 obj = P1 + (rt * p.x + up * p.y + fw * p.z) * iA.z * vis;
  vObj = position; vCol = color * iTint; vHair = aGlow;
  vec4 wp = modelMatrix * vec4(obj, 1.); vWorld = wp.xyz;
  vN = normalize(mat3(modelMatrix) * (rt * n.x + up * n.y + fw * n.z));
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,st=`
attribute vec4 iA, iB;
varying vec2 vUV, vP; varying float vFade;
${ce}
uniform vec2 uShadow;   // x: length per metre of height, y: opacity
void main(){
  float sc = iA.z, a = iA.x + uWalk * (1. - iB.w);
  vec3 base = arcPos(a, iA.y), T = arcDir(a, vec3(0., 0., 1.));
  vec2 sh = -uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  float u = position.x, v = position.y, h = v * 3.0 * sc;
  vec3 obj = base + T * (u * 2.6 + .3) * sc + vec3(sh.x, 0., sh.y) * h * uShadow.x;
  float q = length(obj.xz - vec2(0., uArc.x)) - uArc.x;
  obj.y = groundY(q) + .05 + .02 * v;
  vUV = vec2(u, v); vP = obj.xz;
  vec4 wp = modelMatrix * vec4(obj, 1.), mv = viewMatrix * wp;
  vFade = (1. - smoothstep(350., 800., -mv.z)) * uShadow.y;
  gl_Position = projectionMatrix * mv;
}
`,it=`
uniform vec3 uShadowCol; uniform float uTime;
varying vec2 vUV, vP; varying float vFade;
${We}
float band(float x, float c, float w, float s){ return 1. - smoothstep(w, w + s, abs(x - c)); }
void main(){
  float u = vUV.x, v = vUV.y, h = v * 3.0, s = .05 + .22 * v;   // penumbra widens with distance from the feet
  float legs = max(max(band(u, -.66, .09, s), band(u, .12, .09, s)), band(u, .73, .05, s) * step(.15, h)) * (1. - smoothstep(1.0, 1.3, h));
  float body = band(u, -.25, .66 - .2 * smoothstep(1.9, 2.7, h), s) * smoothstep(.95, 1.2, h) * (1. - smoothstep(2.1, 2.8, h + .5 * max(0., -u - .25)));
  float hump = band(u, .1, .25, s) * smoothstep(2.0, 2.3, h) * (1. - smoothstep(2.6, 2.85, h));
  float dome = band(u, .5, .15, s) * smoothstep(1.7, 2.0, h) * (1. - smoothstep(2.85, 3.0, h));
  float a = clamp(max(max(legs, body), max(hump, dome)), 0., 1.) * (1. - .55 * v) * vFade * (1. - .9 * cloudShade(vP, uTime));
  a *= smoothstep(0., .04, v) * (1. - smoothstep(.93, 1., v));
  gl_FragColor = vec4(mix(vec3(1.), uShadowCol, a), 1.);
}
`,lt=`
attribute vec4 iA, iB;
varying vec2 vUV; varying float vAlpha, vBack, vKind;
${ce}
uniform vec4 uLane, uQ; uniform vec3 uWidth; uniform float uFlow;
#include <fog_pars_vertex>
void main(){
  float seed = iA.w, kind = iB.x, life = fract(uTime * iB.y + seed * 13.7), size, alpha; vec3 c;
  if(kind < .5){   // dust: kicked up where the stream leaves the file, rolling downstream, hanging gold in the light
    float q = mix(3., 24., iA.y) + life * 6., k2 = smoothstep(6., 38., q);   // (kept on the terrace behind the file: over the slump it veiled the fall)
    float a = mix(uLane.y, uLane.z, k2) + iA.x * mix(uWidth.y, uWidth.z, k2) * 1.05 + 3. * sin(seed * 50. + uTime * .1);
    c = arcPos(a, q); c.y += .4 + life * (2.5 + 5. * h11(seed * 3.)) * (.6 + .6 * iA.y) + sin(uTime * .5 + seed * 20.) * .3;
    size = iA.z * (.45 + .9 * life);
    alpha = smoothstep(0., .2, life) * (1. - smoothstep(.55, 1., life)) * uStream * step(uQ.z, q) * step(q - 30., uQ.w);
  } else {         // breath: a faint puff at the mouth every breath
    float sc = iB.z, a = iA.x + uWalk * (1. - iB.w);
    c = arcPos(a, iA.y) + arcDir(a, vec3(0., 1.72 + life * .5, 2.25 + life * .9) * sc);
    size = iA.z * (.3 + 1.1 * life) * sc; alpha = smoothstep(0., .12, life) * (1. - smoothstep(.2, .9, life)) * .5;
  }
  vec4 wp = modelMatrix * vec4(c, 1.), mvPosition = viewMatrix * wp;
  mvPosition.xy += position.xy * size;
  float d = -mvPosition.z;
  alpha *= kind < .5 ? smoothstep(10., 22., d) : smoothstep(1.5, 4., d);
  vec3 V = normalize(cameraPosition - wp.xyz + vec3(0., 1e-4, 0.));
  vBack = max(0., -dot(V, uSunDir)); vUV = position.xy; vAlpha = alpha; vKind = kind;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,ct=`
uniform vec3 uSunCol, uSkyCol, uDustCol; uniform float uDustA, uDustLit;   // uDustLit: front light on the dust (day looks, the sun behind the viewer)
varying vec2 vUV; varying float vAlpha, vBack, vKind;
#include <fog_pars_fragment>
void main(){
  float r2 = dot(vUV, vUV); if(r2 > 1.) discard;
  float a = (1. - r2); a *= a * vAlpha * uDustA;
  // gold toward the light, rose-grey away from it; albedo capped so it never clips
  vec3 lit = uDustCol * (uSkyCol * .16 + uSunCol * (.07 + .2 * vBack * vBack + uDustLit));
  vec3 c = min(mix(lit, lit * 1.15 + uSunCol * .02, vKind), vec3(.7));
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
}
`;function ut(){const t=new r.DataTexture(new Uint8Array([0,0,0,0]),1,1,r.RGBAFormat,r.UnsignedByteType);return t.needsUpdate=!0,t}function ue(t,a,i,p,k){const C=new r.InstancedBufferGeometry;C.index=t.index;for(const W of Object.keys(t.attributes))C.setAttribute(W,t.attributes[W]);return C.setAttribute("iA",new r.InstancedBufferAttribute(i,4)),C.setAttribute("iB",new r.InstancedBufferAttribute(p,4)),k&&C.setAttribute("iTint",new r.InstancedBufferAttribute(k,3)),C.instanceCount=a,C}async function yt(t,a={}){const i=t.rng,p=t.yield?()=>t.yield():async()=>{},k=(a.palette&&a.palette.length>=7?a.palette:Ke).map(_),C=Math.min(1,Math.max(.6,a.detail??1)),W=a.arcRadius??280,g=a.walkSpeed??1.3,P=a.saigaSpeed??11,Y=a.duration??40,E=a.swell||[0,30],G=a.bluff||[1e4,40,0],D=new r.Group;D.name="mammoth-midnight-sun";const v=a.calves??i.int(3,7),L=19,N=i.int(10,13),w=[];let S=104;for(let o=0;o<L;o++){const x=o===0,q=!x&&i.chance(.22),F=x?1.12:q?i.range(.72,.84):i.range(.9,1.06);w.push({a:S,q:x?0:i.range(-.7,.7),sc:F,tusk:x?1.02:q?i.range(.4,.55):i.range(.66,.86),kind:x?"matriarch":q?"young":"cow",stand:0,phase:i(),seed:i()*10,tint:i.range(.8,1.15),warm:i.range(0,1)}),S-=o===N?30:i.range(8.7,10.2)*(.55+.45*F)}const l=w[w.length-1].a;w.push({a:l-20-i.range(0,3),q:i.range(-.5,.5),sc:1.185,tusk:1.4,kind:"tailBull",stand:0,phase:i(),seed:i()*10,tint:.9,warm:.2});const h=w[0].a,B=w[w.length-1].a,d=w[N].a-15,y={up:h+4,mid:h-50,down:h-60+(a.rampOffset??0)},e=y.up+9,n=-(a.bullDistance??135);w.push({a:e,q:n,sc:1.185,tusk:1.45,kind:"loneBull",stand:1,phase:.31,seed:i()*10,tint:1,warm:.4});const s=i.shuffle(w.filter(o=>o.kind==="cow").slice()).slice(0,v-1),f=[];for(const o of s)f.push({a:o.a+i.range(1.2,1.9),q:o.q+i.sign()*i.range(1.4,1.65),sc:i.range(.46,.54),tusk:0,kind:"calf",stand:0,phase:i(),seed:i()*10,tint:i.range(1,1.3),warm:.6});f.push({a:l-i.range(8,10.5),q:i.range(-1.6,-.6),sc:.5,tusk:0,kind:"straggler",stand:0,phase:i(),seed:i()*10,tint:1.15,warm:.6});const c=Math.round((a.saiga??330)*(a.saiga===void 0?C:1)),b=Math.round(150*C),M=i.fork("saiga"),A=i.fork("dust"),u=new r.Vector3().fromArray(a.sunDir||[-.5,.052,-.866]).normalize(),m=L+2,T=[];for(const o of[...w.filter(x=>!x.stand),f[f.length-1]])T.push(new r.Vector4(o.a+.45*o.sc,o.kind==="straggler"?2:2.6*o.sc+.7,0,0));const z={uTime:{value:0},uWalk:{value:0},uFlow:{value:0},uStream:{value:1},uRate:{value:g/P},uArc:{value:new r.Vector4(W,E[0],E[1],0)},uBluff:{value:new r.Vector4(G[0],G[1],G[2],0)},uSunDir:{value:u},uSunCol:{value:k[1].clone().multiplyScalar(a.sunIntensity??2.2)},uSkyCol:{value:k[2].clone().multiplyScalar(a.skyIntensity??3.2)},uGroundCol:{value:_("#C9B48A").multiplyScalar(a.groundIntensity??2.2)},uMam:{value:T},uLane:{value:new r.Vector4(y.up,y.mid,y.down,0)},uWidth:{value:new r.Vector3(30,78,36)},uBull:{value:new r.Vector4(e+.45,n,4.6,0)},uRepel:{value:new r.Vector4(0,0,0,10)},uWrap:{value:new r.Vector3(0,2,0)},uNearFade:{value:new r.Vector2(-2,-1)},uSaigaFill:{value:1},uSaigaExpo:{value:.23},uSnow:{value:0},uCloud:{value:0},uQ:{value:new r.Vector4(-52,36,-1e5,1e5)},uShadow:{value:new r.Vector2(Math.min(19,1/Math.max(Math.tan(Math.asin(Math.min(1,Math.max(.02,u.y)))),.05)),a.shadowOpacity??.5)},uShadowCol:{value:_("#6A6E9E").lerp(_("#ffffff"),.25)},uDustCol:{value:k[1].clone().lerp(k[0],.35)},uDustA:{value:a.dust??.32},uDustLit:{value:0},uRiverW:{value:new r.Vector4(0,0,0,0)},uBarBox:{value:new r.Vector4(0,0,1,1)},uBarTex:{value:ut()}},ee=(o,x,q,F=1)=>new r.ShaderMaterial({uniforms:{...r.UniformsUtils.clone(r.UniformsLib.fog),...z,uExpo:{value:x},uShag:{value:F},uFill:{value:1}},defines:q||{},vertexShader:o,fragmentShader:nt,vertexColors:!0,fog:!0,side:r.DoubleSide});await p();const I="#"+k[5].getHexString(),H=new r.Sphere(new r.Vector3(0,2,45),215),$=o=>{const x=o.length,q=new Float32Array(x*4),F=new Float32Array(x*4),Q=new Float32Array(x*3);return o.forEach((U,R)=>{q.set([U.a,U.q,U.sc,U.phase],R*4),F.set([U.tusk,0,U.seed,U.stand],R*4),Q.set([U.tint*(1+.14*U.warm),U.tint*(1+.05*U.warm),U.tint],R*3)}),[x,q,F,Q]},O=await Qe({coat:I},p);await p();const X=await Qe({coat:I,calf:!0},p);await p();const te=ee(ot,a.coatExposure??.58);te.uniforms.uFill.value=a.coatFill??1;const me=new r.Mesh(ue(O,...$(w)),te),we=new r.Mesh(ue(X,...$(f)),te);for(const o of[me,we])o.geometry.boundingSphere=H,o.frustumCulled=!0,D.add(o);await p();const K=[],fe=(o={})=>{const x=Math.max(1,Math.round(o.count??400)),q=o.rng||M,F=new Float32Array(x*4),Q=new Float32Array(x*4),U=new Float32Array(x*3);for(let Z=0;Z<x;Z++){const ae=1-2*Math.pow(q(),o.bias??1.35);F.set([ae,q(),q.range(.86,1.1),q()],Z*4),Q.set([q.chance(.38)?1:0,0,0,q.range(.94,1.06)],Z*4);const le=q.range(.82,1.15);U.set([le,le*q.range(.94,1.03),le*q.range(.86,1)],Z*3)}const R=ee(rt,o.expo??.23,{NM:m},.3);R.uniforms.uQ={value:new r.Vector4(o.qFrom??-52,o.qTo??36,z.uQ.value.z,z.uQ.value.w)},R.uniforms.uWrap={value:new r.Vector3(0,2,0)},R.uniforms.uNearFade={value:new r.Vector2(...o.nearFade||[-2,-1])},R.uniforms.uFill=z.uSaigaFill,o.expo===void 0&&(R.uniforms.uExpo=z.uSaigaExpo);const j=new r.Mesh(ue($e({lod:o.lod||"near",coat:o.coat,cream:o.cream}),x,F,Q,U),R);if(j.geometry.boundingSphere=o.bounds||H,K.push(R.uniforms.uQ.value),j.userData.uQ=R.uniforms.uQ.value,j.userData.uWrap=R.uniforms.uWrap.value,o.shadows!==!1){const Z=new r.PlaneGeometry(2,1,1,2);Z.translate(0,.5,0);const ae=ue(Z,x,F,Q);ae.boundingSphere=j.geometry.boundingSphere;const le=new r.ShaderMaterial({uniforms:{...z,uQ:R.uniforms.uQ,uWrap:R.uniforms.uWrap,uNearFade:R.uniforms.uNearFade},defines:{NM:m},vertexShader:dt,fragmentShader:vt,transparent:!0,depthWrite:!1,side:r.DoubleSide,blending:r.CustomBlending,blendEquation:r.AddEquation,blendSrc:r.ZeroFactor,blendDst:r.SrcColorFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});j.userData.shadow=new r.Mesh(ae,le),j.userData.shadow.renderOrder=1}if(o.wake){const Z=new r.PlaneGeometry(2,1);Z.translate(0,.5,0);const ae=ue(Z,x,F,Q);ae.boundingSphere=j.geometry.boundingSphere;const le=new r.ShaderMaterial({uniforms:{...r.UniformsUtils.clone(r.UniformsLib.fog),...z,uQ:R.uniforms.uQ,uWrap:R.uniforms.uWrap},defines:{NM:m},vertexShader:pt,fragmentShader:mt,transparent:!0,depthWrite:!1,fog:!0,side:r.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});j.userData.wake=new r.Mesh(ae,le),j.userData.wake.renderOrder=1.1,j.userData.wake.name="wakes"}return j},ye=fe({count:c,lod:"near",qFrom:(a.saigaRange||[-52,36])[0],qTo:(a.saigaRange||[-52,36])[1],wake:!!a.wakes});a.saiga!==0&&(D.add(ye),a.shadows!==!1&&D.add(ye.userData.shadow),ye.userData.wake&&D.add(ye.userData.wake)),await p();const ke=[...w,...f];{const o=new r.PlaneGeometry(2,1,1,18);o.translate(0,.5,0);const[x,q,F]=$(ke),Q=ue(o,x,q,F);Q.boundingSphere=H;const U=new r.ShaderMaterial({uniforms:z,vertexShader:st,fragmentShader:it,transparent:!0,depthWrite:!1,side:r.DoubleSide,blending:r.CustomBlending,blendEquation:r.AddEquation,blendSrc:r.ZeroFactor,blendDst:r.SrcColorFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),R=new r.Mesh(Q,U);R.renderOrder=1,R.name="shadows",a.shadows!==!1&&D.add(R)}{const o=ke.filter(j=>j.kind!=="calf"&&j.kind!=="straggler"),x=b+o.length,q=new Float32Array(x*4),F=new Float32Array(x*4);for(let j=0;j<b;j++)q.set([A.range(-1,1),A(),A.range(3,6.5),A()],j*4),F.set([0,A.range(.07,.13),0,0],j*4);o.forEach((j,Z)=>{const ae=b+Z;q.set([j.a,j.q,.55,j.seed*.1],ae*4),F.set([1,.166*(.9+.02*j.seed),j.sc,j.stand],ae*4)});const Q=ue(new r.PlaneGeometry(2,2),x,q,F);Q.boundingSphere=H;const U=new r.ShaderMaterial({uniforms:{...r.UniformsUtils.clone(r.UniformsLib.fog),...z},vertexShader:lt,fragmentShader:ct,transparent:!0,depthWrite:!1,fog:!0}),R=new r.Mesh(Q,U);R.renderOrder=3,R.name="dust",D.add(R)}if(await p(),a.ground!==!1){const o=a.groundRadius??330,x=new r.PlaneGeometry(o*2,o*2,40,40);x.rotateX(-Math.PI/2),x.translate(0,0,40),x.boundingSphere=new r.Sphere(new r.Vector3(0,0,40),o*1.5);const q=new r.ShaderMaterial({uniforms:{...r.UniformsUtils.clone(r.UniformsLib.fog),...z,uGroundR:{value:o},uLoess:{value:_("#C9B48A")},uGrass:{value:k[3].clone()},uSage:{value:k[4].clone()},uPoppy:{value:k[6].clone()}},vertexShader:ft,fragmentShader:ht,fog:!0}),F=new r.Mesh(x,q);F.name="ground",F.renderOrder=-.5,D.add(F)}await p();const Te=(o,x)=>{const q=Math.hypot(o,x-W)-W,F=Math.max(E[1],1),Q=oe((q-G[0])/Math.max(G[1],1));return-E[0]*(1-Math.exp(-(q*q)/(F*F)))-G[2]*Q*Q*(3-2*Q)},V=(o,x,q=0,F=new r.Vector3)=>{const Q=o/W,U=W+x;return F.set(U*Math.sin(Q),0,W-U*Math.cos(Q)),F.y=Te(F.x,F.z)+q,F},Re=(o,x=new r.Vector3)=>x.set(Math.cos(o/W),0,Math.sin(o/W)),xe=o=>g*Y*o,re=(o,x,q)=>V(o,x,q).toArray(),ge=xe(.36),he=xe(.74),je=B+he-16,Se=V(je,-10,3),Ae=Re(je).multiplyScalar(-1),ze=Se.clone().addScaledVector(Ae,62);ze.y=Se.y-7.5;const Me=[re(y.up,-170,6),re(y.up,-110,6),re(y.up+2,-60,6),re(h+9,-30,5),re(h+ge-6,-10,4.2)];for(let o=h+ge-30;o>B+he+12;o-=28)Me.push(re(o,-8.5,4));Me.push(re(B+he,-7.5,4),Se.toArray(),ze.toArray());const Le={portalSeat:{position:ze.clone(),facing:Ae.clone().multiplyScalar(-1),normal:Ae.clone().multiplyScalar(-1),radius:7},flyThrough:Me.map(o=>new r.Vector3().fromArray(o)),matriarch:V(h,0,2.9),tailBull:V(B,0,3.3),loneBull:V(e,n,3.3),gap:V(d,0,2),fall:V(y.down,60,0),streamIn:[V(y.up,-170,0),V(y.up,-20,0)],sunDir:u.clone(),viewpoints:{entry:{from:V(y.up,-170,6),to:V(y.up+4,-60,1.5)},matriarch:{from:V(h+ge-5.5,-7,4),to:V(h+ge+2,0,2.2),u:.36},file:{from:V(h-30,-8.5,4),to:V(h-75,-1,2.4),u:.5},gap:{from:V(d+xe(.58)+6,-9,4),to:V(y.down,60,2),u:.58},tailBull:{from:V(B+he+7,-6.5,4),to:V(B+he,0,2.6),u:.74}},extent:{center:new r.Vector3(0,2,30),radius:200}};let de=0,_e=0,be=!1,se=0,ve=0,Oe=1,Ce=-1e5,Pe=1e5,Xe=!1;const pe={object:D,radius:200,height:6,center:new r.Vector3(0,2,30),anchors:Le,ground:a.ground===!1,groundY:0,uniforms:z,mammoths:ke,counts:{adults:w.length,calves:f.length,saiga:c},NM:m,groundAt:Te,arcPoint:V,arcTangent:Re,makeSaigaTier:fe,mammothGeometry:Ee,saigaGeometry:$e,setProgress(o){be=!0,se=Math.min(1,Math.max(0,o))},setHerdTime(o){be=!0,se=o/Y},setStream(o){Oe=Math.min(1,Math.max(0,o))},setStreamWindow(o,x){Xe=!0,Ce=o??-1e5,Pe=x??1e5},setLight(o={}){o.sunDir&&(u.copy(o.sunDir.isVector3?o.sunDir:new r.Vector3().fromArray(o.sunDir)).normalize(),z.uShadow.value.x=Math.min(19,1/Math.max(Math.tan(Math.asin(Math.min(1,Math.max(.02,u.y)))),.05))),o.sunColor&&z.uSunCol.value.copy(o.sunColor.isColor?o.sunColor:_(o.sunColor)).multiplyScalar(o.sunIntensity??1),o.sky&&z.uSkyCol.value.copy(o.sky.isColor?o.sky:_(o.sky)).multiplyScalar(o.skyIntensity??1),o.ground&&z.uGroundCol.value.copy(o.ground.isColor?o.ground:_(o.ground)).multiplyScalar(o.groundIntensity??1)},positionAt(o,x=se,q=new r.Vector3){return V(o.a+(o.stand?0:xe(x)+g*ve),o.q,0,q)},update(o,x){o=Math.min(Math.max(o||0,0),.1),be?(se<=0&&(ve=Math.min(ve+o,a.previewWalk??8)),de=se*Y+ve):de=x;const q=de-_e;if(_e=de,z.uTime.value=x,z.uWalk.value=g*de,!be)z.uFlow.value=P*x,z.uRate.value=g/P;else{z.uFlow.value+=P*(se>0?q:o);const F=se>0||ve<(a.previewWalk??8)?g/P:0;z.uRate.value+=(F-z.uRate.value)*Math.min(1,o*2)}z.uStream.value=Oe,z.uQ.value.z=Ce,z.uQ.value.w=Pe;for(let F=0;F<K.length;F++)K[F].z=Ce,K[F].w=Pe},dispose(){}};let Be=a.focus;try{Be=Be||new URLSearchParams(globalThis.location?.search||"").get("focus")}catch{}const ie=g*12,Ue=s[0]||w[1],Ge={head:[V(h+ie-2.5,0,2.3),4.6,5],close:[V(h+ie+.5,0,2.2),3.2,4],face:[V(h+ie+1.6,0,2.2),.01,3],file:[V(h+ie-45,0,2),26,7],gap:[V(d+ie,0,2),22,7],tail:[V(B+ie,0,2.4),5,5],bull:[V(e,n,2.4),5,5],calf:[V(Ue.a+ie+1,Ue.q,1.6),3.4,4],all:[Le.extent.center,95,30]},qe=Ge[Be]||Ge.head;return pe.center=qe[0].clone(),pe.radius=qe[1],pe.height=qe[2],pe.update(0,0),pe}const ft=`
varying vec3 vWorld, vObj; varying float vQ;
${ce}
#include <fog_pars_vertex>
void main(){
  vec3 obj = position; float q = length(obj.xz - vec2(0., uArc.x)) - uArc.x; obj.y = groundY(q); vQ = q; vObj = obj;
  vec4 wp = modelMatrix * vec4(obj, 1.); vWorld = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,ht=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uLoess, uGrass, uSage, uPoppy; uniform vec4 uArc, uLane; uniform vec3 uWidth; uniform float uGroundR;
varying vec3 vWorld, vObj; varying float vQ;
#include <fog_pars_fragment>
float gh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 gh2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float gn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(gh(i), gh(i + vec2(1., 0.)), f.x), mix(gh(i + vec2(0., 1.)), gh(i + vec2(1., 1.)), f.x), f.y); }
vec3 voro(vec2 x){   // x: distance to the nearest cell edge, y: cell id, z: distance to the cell centre
  vec2 n = floor(x), f = fract(x), mg = vec2(0.), mr = vec2(0.); float md = 8.;
  for(int j = -1; j <= 1; j++) for(int i = -1; i <= 1; i++){ vec2 g = vec2(float(i), float(j)), o = gh2(n + g) * .7 + .15, r = g + o - f; float d = dot(r, r); if(d < md){ md = d; mr = r; mg = g; } }
  float ed = 8.;
  for(int j = -2; j <= 2; j++) for(int i = -2; i <= 2; i++){ vec2 g = mg + vec2(float(i), float(j)), o = gh2(n + g) * .7 + .15, r = g + o - f; vec2 dr = r - mr; float l2 = dot(dr, dr); if(l2 > 1e-5) ed = min(ed, dot(.5 * (mr + r), dr / sqrt(l2))); }
  return vec3(ed, gh(n + mg), sqrt(md));
}
void main(){
  vec2 p = vObj.xz; float dist = length(cameraPosition - vWorld), near = 1. - smoothstep(30., 140., dist), mid = 1. - smoothstep(120., 420., dist);
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.));
  vec3 poly = voro(p / 13.5 + .3 * vec2(gn(p * .05), gn(p * .05 + 7.)));
  float trough = 1. - smoothstep(.03, .11, poly.x);
  float n1 = gn(p * .9), n2 = gn(p * 3.7 + 11.), n3 = gn(p * .13 + 3.);
  // bunches: fescue tufts a metre apart with bare cracked loess between; sage cushions in drifts
  vec3 tv = voro(p * 1.25 + 5. + .25 * vec2(n2, gn(p * 3.1))); float tn = gn(p * 2.3) * .45 + gn(p * 5.9 + 3.) * .33 + gn(p * 13. + 9.) * .22; float tuft = smoothstep(.5, .6, tn) * (.6 + .4 * gn(p * 23.));
  float sage = smoothstep(.62, .7, gn(p * 2.9 + 31.) * .6 + gn(p * 8.1 + 5.) * .4) * smoothstep(.45, .6, n3) * (1. - tuft);
  vec3 cv = voro(p * 1.3 + 40. + .5 * vec2(n2, n1)); float crack = (1. - smoothstep(.0, .035, cv.x)) * near * smoothstep(.3, .6, n1) * .6;
  vec3 c = uLoess * (.8 + .3 * n3 + .12 * n1) * (1. - .35 * crack);
  vec3 grass = mix(uGrass, uLoess, .25) * (.55 + .5 * n2 + .5 * tv.y * tuft) * mix(vec3(1.), vec3(.75, 1.05, .7), trough);
  float cover = mix(.5 + .25 * trough, tuft * (.85 + .15 * n2) + trough * .45, near);
  c = mix(c, grass, clamp(cover, 0., 1.));
  c = mix(c, mix(uSage, uGrass, .4) * (.5 + .3 * n2), sage * mix(.4, .85, near));
  c *= 1. - .22 * trough;
  // flowers: tiny bright specks, poppies yellow, pasqueflowers violet, only up close
  vec3 fv = voro(p * 2.9 + 90.); float fl = (1. - smoothstep(.03, .07, fv.z)) * near * step(.72, fv.y) * (1. - sage);
  c = mix(c, fv.y > .9 ? vec3(.3, .14, .5) : uPoppy, fl);
  // the trodden trail along the file and the beaten lanes of the stream
  float trail = (1. - smoothstep(1.2, 3.6, abs(vQ))) * (.6 + .4 * n1);
  float dz = uArc.x - p.y; if(abs(dz) < 1e-3) dz = 1e-3; float ang = atan(p.x, dz), a = ang * uArc.x;
  float k1 = smoothstep(-110., -12., vQ), k2 = smoothstep(6., 38., vQ), ac = mix(mix(uLane.x, uLane.y, k1), uLane.z, k2), w = mix(mix(uWidth.x, uWidth.y, k1), uWidth.z, k2);
  float ln = (a - ac) / max(w, 1.), inS = 1. - smoothstep(.85, 1.1, abs(ln));
  float beaten = inS * (.35 + .4 * gn(vec2(ln * 46., vQ * .05)) ) * mid;
  c = mix(c, uLoess * .62, trail * .55);
  c = mix(c, uLoess * (.95 + .2 * n2), beaten * .6);
  // light: the level sun barely touches the flat ground, the sky does the work; grass tips and dust glow toward the sun
  float back = max(0., -dot(V, uSunDir)), graze = 1. - abs(V.y);
  vec3 lit = c * (uSkyCol * .34 + uSunCol * (.16 + .5 * back * back * graze * graze));
  lit += uSunCol * uGrass * tuft * near * .08 * back;
  gl_FragColor = vec4(lit, 1.);
  float edge = 1. - smoothstep(uGroundR * .72, uGroundR * .98, length(p - vec2(0., 40.)));
  if(edge < gh(gl_FragCoord.xy * .37)) discard;
  #include <fog_fragment>
}
`,dt=`
attribute vec4 iA, iB;
varying vec2 vUV, vP; varying float vFade; varying vec3 vFoot;
${ce}
${Ve}
${De}
uniform vec2 uShadow;
void main(){
  float seed = iA.w, span = max(uQ.y - uQ.x, 1.), run = uFlow * iB.w + iA.y * span, q = uQ.x + fract((run - uQ.x) / span) * span;
  float lane = uWrap.x + (fract((iA.x - uWrap.x) / max(uWrap.y, .01) + .5) - .5) * uWrap.y;
  float edge = uWrap.y < 1.99 ? 1. - smoothstep(.8, 1., abs(lane - uWrap.x) / max(uWrap.y * .5, .01)) : 1.;
  float a1 = flowAt(lane, q, seed), a2 = flowAt(lane, q + .7, seed);
  vec3 P1 = arcPos(a1, q), P2 = arcPos(a2, q + .7), fw = normalize(P2 - P1 + vec3(0., 0., 1e-5));
  vec2 sh = -uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  // (m7) the same leap as the animal's own (SAIGA_VERT): while it is in the air its shadow leaves its feet, thrown by the height
  float lp = fract(uTime * .2 * (.7 + .6 * h11(seed * 3.)) + h11(seed * 5. + 1.)), leap = (lp < .16 && h11(seed * 9. + 2.) > .5) ? sin(lp / .16 * 3.14159) : 0.;
  vec3 rv = q > uBluff.x ? riverAt(P1.xz) : vec3(0.);
  float vis = step(uQ.z, q) * step(q, uQ.w) * smoothstep(0., 8., q - uQ.x) * smoothstep(0., 8., uQ.y - q) * edge;
  vis *= smoothstep(uNearFade.x, uNearFade.y, distance(cameraPosition, P1));
  float u = position.x, v = position.y;
  // the body's footprint (1.2 m by 0.38 m) seen along the light, then thrown one animal's height times the shadow length:
  // as wide as the body whichever way the animal runs against the sun (never a hairline)
  vec3 S3 = vec3(sh.x, 0., sh.y), P3 = vec3(-sh.y, 0., sh.x);
  float wAc = .2 + .42 * abs(dot(fw, P3)), lAl = .2 + .42 * abs(dot(fw, S3));
  float onRamp = smoothstep(uBluff.x - 4., uBluff.x + 8., q) * (1. - smoothstep(uBluff.x + uBluff.y - 6., uBluff.x + uBluff.y + 6., q)), slope = 1. - .6 * onRamp;   // on the slump a shadow falls short: one compact shape under each animal
  // (m7) on water a wader throws no long shadow: a short dark mirror under its body is all (its wake says the rest)
  float thrw = .78 * min(uShadow.x, 4.2) * slope * (1. - .8 * rv.x), total = 2. * lAl + .2 + thrw;
  vec3 obj = P1 + (P3 * u * wAc * 1.2 + S3 * (-lAl - .1 + v * total + leap * thrw)) * iA.z * vis;
  float qq = length(obj.xz - vec2(0., uArc.x)) - uArc.x; obj.y = groundY(qq) + .04 + (qq > uBluff.x ? riverAt(obj.xz).z : 0.);
  vUV = vec2(u, v); vP = obj.xz; vFoot = vec3((lAl + .1) / total, (lAl + .1) / total, leap);   // where the body stands along the quad, its half-length there, how far off the ground
  vec4 mv = viewMatrix * modelMatrix * vec4(obj, 1.);
  vFade = (1. - smoothstep(200., 500., -mv.z)) * uShadow.y * vis * (1. - .6 * smoothstep(12., 40., q) * (1. - .55 * onRamp));   // (polish m4) on the slump each compact shadow keeps its full depth, so no animal floats   // where the stream packs into the ribbon its shadows overlap many deep: lighter there
  gl_Position = projectionMatrix * mv;
}
`,vt=`
uniform vec3 uShadowCol; uniform vec2 uShadow; uniform float uTime;
varying vec2 vUV, vP; varying float vFade; varying vec3 vFoot;
${We}
void main(){
  // (m7) A SHADOW THAT TOUCHES THE FEET. Live drew one soft blob whose dark middle lay half-way along the throw, a metre and
  // more from the animal, fading to nothing where the hooves stand ('detached dark blob shadows, pasted on'). Now the darkest
  // part is the body's own footprint under the belly, and the throw runs on from it away from the sun, narrowing a little and
  // paling along its length. In a leap the footprint goes with the body's shadow, off along the throw, and softens.
  float u = clamp(vUV.x, -1., 1.), v = clamp(vUV.y, 0., 1.), v0 = clamp(vFoot.x, .02, .98), vh = max(vFoot.y, .02), lp = clamp(vFoot.z, 0., 1.);
  float dv = (v - v0) / vh, core = 1. - smoothstep(.5, 1., u * u + dv * dv);
  float tv = clamp((v - v0) / max(1. - v0, .02), 0., 1.), wd = u / mix(1., .72, tv);
  float lng = smoothstep(3., 12., uShadow.x);   // very long shadows overlap many deep: each one lighter along its length
  float thrown = (1. - smoothstep(.55, 1., wd * wd)) * step(v0, v) * (1. - smoothstep(.55, 1., tv)) * mix(1., .78, lng) * (1. - mix(.3, .7, lng) * v);   // (Mend 1) as dark as live's along its length (live's own two factors)
  float a = max(core * (1. - .35 * lp), thrown) * (1. - .3 * lp) * vFade * (1. - .9 * cloudShade(vP, uTime));
  gl_FragColor = vec4(mix(vec3(1.), uShadowCol, clamp(a, 0., 1.)), 1.);
}
`,pt=`
attribute vec4 iA, iB;
varying vec2 vUV; varying float vFade, vSeed, vRun;
${ce}
${Ve}
${De}
#include <fog_pars_vertex>
void main(){
  float seed = iA.w, span = max(uQ.y - uQ.x, 1.), run = uFlow * iB.w + iA.y * span, q = uQ.x + fract((run - uQ.x) / span) * span;
  float lane = uWrap.x + (fract((iA.x - uWrap.x) / max(uWrap.y, .01) + .5) - .5) * uWrap.y;
  float edge = uWrap.y < 1.99 ? 1. - smoothstep(.8, 1., abs(lane - uWrap.x) / max(uWrap.y * .5, .01)) : 1.;
  float a1 = flowAt(lane, q, seed), a2 = flowAt(lane, q + .7, seed);
  vec3 P1 = arcPos(a1, q), P2 = arcPos(a2, q + .7), fw = normalize(P2 - P1 + vec3(0., 0., 1e-5)), rt = normalize(cross(vec3(0., 1., 0.), fw) + vec3(1e-5, 0., 0.));
  vec3 rv = q > uBluff.x ? riverAt(P1.xz) : vec3(0.);
  float vis = step(uQ.z, q) * step(q, uQ.w) * smoothstep(0., 8., q - uQ.x) * smoothstep(0., 8., uQ.y - q) * edge * rv.x;
  float u = position.x, v = position.y;                                   // the plane is 2 wide, 1 long
  vec3 obj = P1 + (rt * u * (.5 + .45 * v) + fw * (.75 - v * (2.6 + 1.6 * rv.y))) * iA.z * step(.02, vis);
  obj.y = P1.y + rv.z + .05;
  vUV = vec2(u, v); vSeed = seed; vRun = run;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(obj, 1.);
  float eyeD = length(mvPosition.xyz);   // (Mend 2) the straight distance from the eye in metres (before: the depth along the gaze)
  vFade = vis * (1. - .6 * smoothstep(25., 90., eyeD)) * (1. - smoothstep(140., 320., eyeD));   // (Mend 1) a wake is a thing of the near distance: its foam lines are a hand to a forearm wide, narrower than the body that makes them: from 25 m off they are under half a degree across and weaken (to two fifths by 90 m), and from 140 to 320 m, where a foam line is under a tenth of a degree, they go, or the pale streaks outweigh the bodies they trail
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,mt=`
uniform vec3 uSunCol, uSkyCol; uniform float uTime;
varying vec2 vUV; varying float vFade, vSeed, vRun;
#include <fog_pars_fragment>
float wkh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float wkn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(wkh(i), wkh(i + vec2(1., 0.)), f.x), mix(wkh(i + vec2(0., 1.)), wkh(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  float u = clamp(vUV.x, -1., 1.), v = clamp(vUV.y, 0., 1.), au = abs(u);
  float n = wkn(vec2(u * 3.1 + vSeed * 40., v * 7. + vRun * .9)), n2 = wkn(vec2(u * 9. + vSeed * 9., v * 19. + vRun * 2.3));
  float arm = 1. - smoothstep(.0, .2 + .12 * n, abs(au - (.3 + .55 * v)));                        // the two foam lines, spreading
  float churn = (1. - smoothstep(.2, .34 + .5 * v, au)) * smoothstep(.45, .75, n * .6 + n2 * .4);     // broken water between them
  float spray = (1. - smoothstep(.0, .26, v)) * (1. - smoothstep(.3, .9, au)) * smoothstep(.5, .8, n2);   // thrown up at the forelegs
  float a = clamp(max(max(arm * (.5 + .5 * n2), churn * .7), spray), 0., 1.) * (1. - smoothstep(.5, 1., v)) * smoothstep(0., .05, v) * (1. - smoothstep(.85, 1., au)) * clamp(vFade, 0., 1.);
  if(a < .01) discard;
  vec3 c = uSkyCol * .26 + uSunCol * (.2 + .14 * spray);   // pale foam in this light: under the water's own glitter, over its body
  gl_FragColor = vec4(c, a * .66);
  #include <fog_fragment>
}
`;export{We as CLOUD_GLSL,De as RIVER_GLSL,Ve as SAIGA_FLOW_GLSL,yt as buildHero,Ee as mammothGeometry,Qe as mammothGeometryAsync,$e as saigaGeometry};
