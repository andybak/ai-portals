import*as c from"three";import{makePath as U0,smoothstep as Ue,clamp as ze,lerp as Le}from"../kit/core.js";import{buildHero as L0,LIGHT_GLSL as Me,RELIEF_GLSL as O0,UNDER_GLSL as W0,GOLD_FS as q0,DEFAULT_PALETTE as $0}from"../parts/mended-country.js";const Ie=1600,n0=1e3,ce=9,i0=67,s0=.832,w0=150,He=5,z0=420,y0=330,b0=95,j0=-.21,Be=(a,h)=>Ie-Math.sqrt(Math.max(1,Ie*Ie-a*a-h*h)),ge=a=>{const h=Math.sin(a*127.1+311.7)*43758.5453;return h-Math.floor(h)},ye=(a,h=1)=>{const P=new c.Color(a);return new c.Vector3(P.r*h,P.g*h,P.b*h)};function pe(a,h,P,_=new c.Vector3){const s=Be(a,h);return _.set(a,s,h),_.addScaledVector(new c.Vector3(-a,Ie-s,-h).multiplyScalar(1/Ie),P)}const Ze=[{name:"celadon",pal:$0,crack:"#8E9A82"},{name:"ivory",pal:["#DDD1C6","#F4EFE8","#B9A9AE","#F2ECE2","#C9703A","#A8402E","#F3C9A8"],crack:"#A2969C"},{name:"sea-green",pal:["#5FA08E","#BFE0D2","#2F6E62","#E9EEE6","#C9D2D6","#8E3A2C","#F3C9A8"],crack:"#6F8F86"}],K0={dusk:{peach:"#F3C9A8",deep:"#E89B6E",up:2.4,zen:"#2A4C56",rim:"#5B8580",glow:"#F6E3CF",glowK:.9,fill:"#9DB5AC",haze:"#3F6566",az:300,portal:"#FBE6D2"},moon:{peach:"#B9CBE6",deep:"#7F9FD6",up:2,zen:"#3E4F6E",rim:"#6F86A6",glow:"#E4ECF6",glowK:.8,fill:"#94A3B6",haze:"#70849A",az:300,portal:"#E6F0FF"},dawn:{peach:"#F6B7B4",deep:"#EE8F9C",up:2.3,zen:"#343E66",rim:"#84769A",glow:"#FBE0D6",glowK:.95,fill:"#B0AFC2",haze:"#5A5676",az:120,portal:"#FFE4DA"}};async function H0(a,h){const P=[];for(let _=0;_<a.length;_++){(_&7)===7&&await h();let s=[];for(let p=0;p<40;p++){const n=p/40*Math.PI*2;s.push({x:Math.cos(n)*n0,z:-Math.sin(n)*n0,nb:-1})}const S=a[_];for(let p=0;p<a.length&&s.length>2;p++){if(p===_)continue;const n=a[p],i=n.x-S.x,t=n.z-S.z,b=(S.x+n.x)/2,d=(S.z+n.z)/2,m=R=>(R.x-b)*i+(R.z-d)*t,B=[];for(let R=0;R<s.length;R++){const g=s[R],V=s[(R+1)%s.length],Z=m(g),q=m(V);if(Z<=0&&B.push({x:g.x,z:g.z,nb:(q<=0,g.nb)}),Z<=0!=q<=0){const H=Z/(Z-q),I=g.x+(V.x-g.x)*H,ne=g.z+(V.z-g.z)*H;B.push({x:I,z:ne,nb:Z<=0?p:g.nb})}}s=B}let y=0,M=0;for(const p of s)y+=p.x,M+=p.z;P.push({id:_,poly:s,cx:y/Math.max(1,s.length),cz:M/Math.max(1,s.length)})}return P}async function Z0(a,h,P){const _=new Map;for(const s of a){await P(),s.edges=[];const S=s.poly.length;for(let y=0;y<S;y++){const M=s.poly[y],p=s.poly[(y+1)%S],n=M.nb,i=Math.hypot(p.x-M.x,p.z-M.z);if(i<.05)continue;const t=n<0?`r${s.id}_${y}`:`${Math.min(s.id,n)}_${Math.max(s.id,n)}`;let b=_.get(t);if(!b){const d=h((M.x+p.x)/2,(M.z+p.z)/2),m=Math.max(1,Math.ceil(i/d)),B=[],R=-(p.z-M.z)/i,g=(p.x-M.x)/i,V=ge(M.x*.013+p.z*.017),Z=n<0?0:Math.min(i*.035,9);for(let q=0;q<=m;q++){const H=q/m;let I=Le(M.x,p.x,H),ne=Le(M.z,p.z,H);if(q>0&&q<m&&n>=0){const U=Math.min(1,Math.min(H,1-H)*6),G=l=>Math.abs((l%1+1)%1-.5)*2-.5,le=U*Z*(G(H*1.7+V)+.45*G(H*4.3+V*7))+(ge(I*3.7+ne*1.3)-.5)*Math.min(1.4,d*.28),$=(ge(I*1.9-ne*2.3)-.5)*d*.3;I+=R*le+g*$,ne+=g*le-R*$}B.push({x:I,z:ne})}b={key:t,a:s.id,b:n,pts:B,len:i},_.set(t,b)}s.edges.push({seam:b,rev:b.a!==s.id})}s.ring=[];for(const y of s.edges){const M=y.rev?y.seam.pts.slice().reverse():y.seam.pts;for(let p=0;p<M.length-1;p++)s.ring.push({x:M[p].x,z:M[p].z,seam:y.seam,corner:p===0})}}return _}const Ee=new c.Vector3,l0=new c.Vector3;function Oe(a,h,P=0){const _=Be(a,h);return l0.set(-a,Ie-_,-h).multiplyScalar(1/Ie),Ee.set(a,_,h).addScaledVector(l0,-P)}async function X0(a,h,P,_,s){const S=[],y=[],M=[];let p=0;const n=[],i=[],t=[],b=[];let d=0;const m=(l,x,u,r,K,ie,z)=>{const A=Oe(l,x,u);return S.push(A.x,A.y,A.z),y.push(r,K,ie,z),p++},B=(l,x,u,r,K,ie,z=0,A=1,X=0)=>{const E=Oe(l,x,u);return n.push(E.x,E.y,E.z),i.push(u,r,K,ie),t.push(z,A,X),d++},R=[0,1.2,3.6,9,22],g=[.7,.48,.27,.1],V=[0,.5,2.2,5.2,ce];for(const l of a){await s();const x=l.ring,u=x.length;if(u<3)continue;const r=l.poly,K=r.length,ie=f=>f.seam.b<0?-1:f.seam.a===l.id?f.seam.b:f.seam.a,z=(f,F)=>{let L=1e9;for(let N=0;N<K;N++){const j=r[N],T=r[(N+1)%K],ee=T.x-j.x,oe=T.z-j.z,Y=Math.hypot(ee,oe);Y<.05||(L=Math.min(L,Math.abs((f-j.x)*oe-(F-j.z)*ee)/Y))}return L},A=R.length+g.length,X=p;for(let f=0;f<u;f++){(f&15)===15&&await s();const F=x[f],L=F.x-l.cx,N=F.z-l.cz,j=Math.max(1,Math.hypot(L,N));for(let T=0;T<A;T++){const ee=T<R.length?Math.max(1-R[T]/j,.78-.01*T):g[T-R.length],oe=l.cx+L*ee,Y=l.cz+N*ee;m(oe,Y,0,T===0?0:Math.max(z(oe,Y),R[Math.min(T,R.length-1)]*.5),ie(F),l.id,1)}}const E=m(l.cx,l.cz,0,z(l.cx,l.cz),l.id,l.id,1);for(let f=0;f<u;f++){const F=X+f*A,L=X+(f+1)%u*A;for(let N=0;N<A-1;N++)M.push(F+N,F+N+1,L+N,L+N,F+N+1,L+N+1);M.push(F+A-1,E,L+A-1)}await s();const O=p;for(let f=0;f<u;f++)m(x[f].x,x[f].z,ce,0,ie(x[f]),l.id,-1);for(let f=0;f<u;f++){const F=x[f];m(Le(l.cx,F.x,.5),Le(l.cz,F.z,.5),ce,30,l.id,l.id,-1)}const de=m(l.cx,l.cz,ce,60,l.id,l.id,-1);for(let f=0;f<u;f++){const F=(f+1)%u;M.push(O+f,O+F,O+u+f,O+F,O+u+F,O+u+f,O+u+f,O+u+F,de)}const re=d;await s();for(let f=0;f<u;f++){(f&31)===31&&await s();const F=x[f],L=l.cx-F.x,N=l.cz-F.z,j=Math.max(1,Math.hypot(L,N)),T=x[(f+u-1)%u],ee=x[(f+1)%u];let oe=ee.z-T.z,Y=-(ee.x-T.x);const ke=Math.max(1e-4,Math.hypot(oe,Y));oe/=ke,Y/=ke,oe*L+Y*N>0&&(oe=-oe,Y=-Y);for(let ae=0;ae<V.length;ae++){const Se=F.x*.731+F.z*1.377+ae*7.7+l.id*3.1,v=(ae>0&&ae<V.length-1?1:0)*(.2+.35*ge(Se)+(ge(Se*.37)>.8?.4:0))+(ae===V.length-1?.5:0);B(F.x+L/j*v,F.z+N/j*v,V[ae],l.id,ge(Se+2.2),ie(F),oe,.03,Y)}}await s();for(let f=0;f<u;f++){(f&31)===31&&await s();const F=(f+1)%u,L=V.length;if(!(h(x[f].x,x[f].z)<1&&h(x[F].x,x[F].z)<1))for(let N=0;N<L-1;N++){const j=re+f*L+N,T=re+F*L+N;f+N&1?b.push(j,j+1,T,T,j+1,T+1):b.push(j,j+1,T+1,j,T+1,T)}}}const Z=120,q=[[P-7,ce-1],[P-7.6,ce+8],[P-6.2,ce+21],[P-3,ce+22.4],[P+3,ce+22.4],[P+6.2,ce+21],[P+7.6,ce+8],[P+7,ce-1],[P+7,ce-1],[P-7,ce-1]],H=d;for(let l=0;l<=Z;l++){const x=l/Z*Math.PI*2,u=Math.cos(x),r=Math.sin(x);q.forEach(([K,ie],z)=>{const A=K+(z>0&&z<7?(ge(l*1.7+z*9.1)-.5)*.9:0),X=z<4?-1:1,E=z===3||z===4?1:0,O=z>7?1:0;B(u*A,r*A,ie,-1,ge(l*3.3+z),-3,O?0:u*X*(1-.6*E),O?1:-.8*E,O?0:r*X*(1-.6*E))})}for(let l=0;l<Z;l++)for(let x=0;x<q.length-1;x++){const u=H+l*q.length+x,r=u+q.length;l+x&1?b.push(u,u+1,r,r,u+1,r+1):b.push(u,u+1,r+1,u,r+1,r)}const I=async(l,x,u,r)=>{const K=new c.BufferGeometry;return K.setAttribute("position",new c.Float32BufferAttribute(l,3)),await s(),K.setAttribute("aInfo",new c.Float32BufferAttribute(x,4)),await s(),r&&(K.setAttribute("aNrm",new c.Float32BufferAttribute(r,3)),await s()),K.setIndex(u),K};await s();const ne=d,U=_.length,G=V.length;for(let l=0;l<U;l++)for(let x=0;x<G;x++){const u=_[l],r=l*5.31+x*7.7,K=(x>0&&x<G-1?.2+.35*ge(r):0)+(x===G-1?.5:0);B(u.x+u.ox*K,u.z+u.oz*K,V[x],-1,ge(r+2.2),-2,-u.ox,.03,-u.oz)}for(let l=0;l<U;l++)for(let x=0;x<G-1;x++){const u=ne+l*G+x,r=ne+(l+1)%U*G+x;l+x&1?b.push(u,u+1,r,r,u+1,r+1):b.push(u,u+1,r+1,u,r+1,r)}await s();const le=await I(S,y,M);await s();const $=await I(n,i,b,t);return await s(),{glaze:le,biscuit:$}}async function Y0(a,h,P,_,s,S,y){const M=[],p=[],n=[],i=[],t=[];let b=0;const d=[],m=[],B=[],R=[];let g=0;const V=[],Z=[],q=[],H=[],I=[];let ne=0;const U=new c.Vector3,G=new c.Vector3,le=[];for(const r of a.values()){if(r.b<0)continue;await y();const K=h[r.a],ie=h[r.b],z=r.pts,A=z.length,X=[0];for(let v=1;v<A;v++)X.push(X[v-1]+Math.hypot(z[v].x-z[v-1].x,z[v].z-z[v-1].z));const E=r.fixed&&r.fixed.river,O=X[A-1],de=E?Math.hypot(z[0].x-E.ax,z[0].z-E.az)<Math.hypot(z[A-1].x-E.ax,z[A-1].z-E.az):r.fixed&&r.fixed.flip!==void 0?r.fixed.flip:Math.hypot(z[0].x,z[0].z)>Math.hypot(z[A-1].x,z[A-1].z),re=v=>de?O-X[v]:X[v],f=E?.2:_+1.2,F=z.map(v=>P(v.x,v.z)>f);let L=O;for(let v=0;v<A;v++)F[v]||(L=Math.min(L,re(v)));const N=Math.max(K.u1,ie.u1),j=N>0;let T=-2,ee=-1;E?(T=E.uRef-(O-E.rRef)/E.v,ee=T+(O+8)/E.v,E.uA=T+L/E.v):r.fixed&&r.fixed.g0!==void 0?(T=r.fixed.g0,ee=r.fixed.g1):r.fixed&&(T=r.fixed.u-re(r.fixed.i)/1750,ee=T+(O+8)/1750),j&&!r.fixed&&(T=N+.004,ee=T+Math.max(.03,(O+8)/1080/s.range(1.3,2))),r.g0=T,r.g1=ee,r.L=O,r.sOf=re,r.near=X[1]<6.5;const oe=r.fixed?E?E.r:1.6:(s.range(.55,1.1)+Math.min(1.2,O/400)*s.range(.3,1))*1.5,Y=E?8:r.near?6:4,ke=b;for(let v=0;v<A;v++){(v&63)===63&&await y();const te=z[v],W=z[Math.max(0,v-1)],me=z[Math.min(A-1,v+1)];Oe(te.x,te.z),G.set(me.x-W.x,Be(me.x,me.z)-Be(W.x,W.z),me.z-W.z).normalize(),U.crossVectors(l0,G).normalize();const Ae=E||L>=O?1:.06+.94*Ue(0,7,Math.abs(L-re(v))-1);for(let ue=0;ue<=Y;ue++)M.push(Ee.x,Ee.y,Ee.z),p.push(U.x,U.y,U.z),n.push(re(v),(ue/Y-.5)*Math.PI,oe*Ae,O),i.push(T,ee),b++}for(let v=0;v<A-1;v++)if(!(!F[v]||!F[v+1]))for(let te=0;te<Y;te++){const W=ke+v*(Y+1)+te,me=W+Y+1;t.push(W,me,W+1,me,me+1,W+1)}if(ee>0&&le.push(r),!j)continue;const ae=g;for(let v=0;v<A;v++){const te=Oe(z[v].x,z[v].z,2);for(let W=0;W<2;W++)d.push(te.x,te.y,te.z),m.push(r.a,r.b),B.push(W,X[v],Math.min(1,Math.min(X[v],O-X[v])/12)),g++;if(v<A-1){const W=ae+v*2;R.push(W,W+2,W+1,W+1,W+2,W+3)}}const Se=(r.a===He||r.b===He?.3:r.near?.24:.07)*S,Fe=8;for(let v=1;v<A-1;v++){if(s()>Se||!F[v])continue;const te=Oe(z[v].x,z[v].z,.6),W=s(),me=s(),Ae=ne;for(let ue=0;ue<=Fe;ue++)for(let se=-1;se<=1;se+=2)V.push(te.x,te.y,te.z),Z.push(r.a,r.b),q.push(ue/Fe,se),H.push(W,me),ne++;for(let ue=0;ue<Fe;ue++){const se=Ae+ue*2;I.push(se,se+1,se+2,se+1,se+3,se+2)}}}const $=async(r,K,ie)=>{const z=new c.BufferGeometry;z.setAttribute("position",new c.Float32BufferAttribute(r,3));for(const[A,X,E]of K)await y(),z.setAttribute(A,new c.Float32BufferAttribute(X,E));return await y(),z.setIndex(ie),z};await y();const l=await $(M,[["aAcross",p,3],["aGold",n,4],["aWin",i,2]],t);await y();const x=await $(d,[["aIds",m,2],["aBl",B,3]],R);await y();const u=await $(V,[["aIds",Z,2],["aT",q,2],["aRnd",H,2]],I);return await y(),{gold:l,blades:x,threads:u,fronts:le}}const Xe=`
uniform highp sampler2D uShards; uniform float uU;
float openOf(float id) {
  if (id < -1.5) return 1.0; if (id < -0.5) return 0.0;
  vec4 a2 = texelFetch(uShards, ivec2(int(id + 0.5), 2), 0);
  return 1.0 - smoothstep(a2.x, a2.y, uU);
}
vec3 poseOf(vec3 p, float id) {
  if (id < -0.5) return p;
  int ix = int(id + 0.5);
  vec4 a2 = texelFetch(uShards, ivec2(ix, 2), 0);
  float k = 1.0 - smoothstep(a2.x, a2.y, uU);
  if (k <= 0.0) return p;
  vec4 a0 = texelFetch(uShards, ivec2(ix, 0), 0), a1 = texelFetch(uShards, ivec2(ix, 1), 0), a3 = texelFetch(uShards, ivec2(ix, 3), 0);
  vec3 c = a0.xyz, v = (p - c) * (1.0 - a0.w * k), ax = a1.xyz;
  float ang = (a1.w + a2.w * sin(uTime * 0.47 + a2.z)) * k, ca = cos(ang), sa = sin(ang);
  v = v * ca + cross(ax, v) * sa + ax * dot(ax, v) * (1.0 - ca);
  vec3 nC = normalize(vec3(0.0, 1600.0, 0.0) - c);
  return c + v + nC * (a3.x + 14.0 * a2.w * sin(uTime * 0.71 + a2.z * 1.7)) * k;
}`,J0=`
attribute vec4 aInfo;
varying vec3 vPos, vN, vSeat; varying vec4 vInfo; varying vec3 vSh;   // vSh = (open, crazeU, tint)
${Me}
${Xe}
void main() {
  vec3 up = normalize(vec3(0.0, 1600.0, 0.0) - position);
  float id = aInfo.z, side = aInfo.w;
  vSeat = side < 0.0 ? position + up * ${ce.toFixed(1)} : position;
  vec3 wp = poseOf(position, id), w2 = poseOf(position + up * 4.0, id);
  vN = normalize(w2 - wp) * side;
  vec4 a3 = texelFetch(uShards, ivec2(int(max(id, 0.0) + 0.5), 3), 0);
  vSh = vec3(max(openOf(id), openOf(aInfo.y)), a3.y, a3.z);
  vPos = wp; vInfo = aInfo;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,Q0=`
precision highp float;
varying vec3 vPos, vN, vSeat; varying vec4 vInfo; varying vec3 vSh;
uniform vec3 uCopper, uCrackCol, uAbsorb, uMilk, uIron, uPig;
uniform sampler2D uPaint, uCollar;
uniform vec4 uCollarBox, uPaintW, uSeal, uStream;     // (minx, minz, 1/w, 1/h) (cx, cz, w, h) (cx, cz, half, on) (x, z, flow, on)
uniform float uU, uCrack, uFishScale, uFishAmt, uCrazeAll, uPaintAmt, uPigMix;
${Me}
${O0}
${W0}
// the potter's seal: a fret maze of grooves 2 m wide pressed into the floor (no characters)
float sealAt(vec2 q) {
  vec2 a = abs(q); float m = max(a.x, a.y), hs = uSeal.z;
  if (m > hs) return 0.0;
  float frame = 1.0 - smoothstep(0.8, 1.25, abs(m - (hs - 2.5)));
  vec2 c = a - hs * 0.45; float cm = max(abs(c.x), abs(c.y));
  float ri = floor(cm / 4.0 + 0.5), dl = abs(cm - ri * 4.0);
  float g = (1.0 - smoothstep(0.8, 1.25, dl)) * step(cm, hs * 0.45 - 2.6) * step(0.5, ri);
  float sgn = mod(ri, 2.0) < 0.5 ? 1.0 : -1.0;
  float gap = step(0.0, sgn * c.x) * (1.0 - smoothstep(0.9, 1.4, abs(c.y - 2.0 * sgn)));       // each square broken once: a meander
  return clamp(max(frame, g * (1.0 - gap)), 0.0, 1.0);
}
float reliefAll(vec2 p, float fine, float top) {
  return (relief(p, fine) - 0.6 * sealAt(p - uSeal.xy) * uSeal.w) * top;
}
void main() {
  float side = vInfo.w, top = step(0.0, side);
  vec2 pw = vSeat.xz;
  // the hero's collar owns its ground: cut the wall to its outline, leaving the crack
  vec2 cuv = (pw - uCollarBox.xy) * uCollarBox.zw;
  float sd = 1e3;
  if (cuv.x > 0.0 && cuv.x < 1.0 && cuv.y > 0.0 && cuv.y < 1.0) { sd = textureLod(uCollar, cuv, 0.0).r * 64.0 - 16.0; if (sd < uCrack - 0.5) discard; }
  float d = min(vInfo.x, max(sd - uCrack, 0.0));
  float open = max(vSh.x, 1.0 - smoothstep(0.0, 8.0, sd - uCrack));
  vec3 V = normalize(cameraPosition - vPos + vec3(0.0, 1e-4, 0.0));
  vec3 N0 = normalize(vN), Nt = N0 * side;
  vec3 Tx = normalize(vec3(1.0, 0.0, 0.0) - Nt * Nt.x), Tz = normalize(vec3(0.0, 0.0, 1.0) - Nt * Nt.z);
  float nv0 = dot(N0, V);
  vec2 par = -vec2(dot(V, Tx), dot(V, Tz)) / max(abs(nv0), 0.35);
  float fw = max(length(fwidth(pw)), 1e-4);
  float fine = top * (1.0 - smoothstep(0.16, 0.75, fw * 0.33)) * (0.25 + 0.75 * smoothstep(0.12, 0.55, abs(nv0)));   // throwing rings soften to faint ridges at grazing angles
  float h0 = reliefAll(pw, fine, top), e = clamp(fw * 1.2, 0.3, 4.0);
  vec2 grad = vec2(reliefAll(pw + vec2(e, 0.0), fine, top) - h0, reliefAll(pw + vec2(0.0, e), fine, top) - h0) / e;
  vec3 N = normalize(N0 - (Tx * grad.x + Tz * grad.y) * 1.6);
  float nv = max(dot(N, V), 0.0);
  float tint = vSh.z, rOut = length(pw);
  float run = 0.16 * (1.0 - smoothstep(540.0, 800.0, rOut)) + 0.34 * (vnoise(pw * 0.013 + tint * 9.0) - 0.5) + 0.42 * (1.0 - smoothstep(60.0, 460.0, rOut));   // glaze ran down and pooled deep in the well
  float t = clamp(0.46 - 1.6 * h0 + run + (tint - 0.5) * 0.2 + 0.07 * (vnoise(pw * 0.045) - 0.5), 0.1, 1.4) * smoothstep(0.0, 2.5, d);
  t = mix(t, (0.6 + 0.3 * (vnoise(pw * 0.035) - 0.5) + 0.07 * sin(rOut * 1.0472)) * smoothstep(0.0, 2.5, d), 1.0 - top);
  float ta = min(t * (1.0 + uPool * smoothstep(0.5, 1.2, t)), 1.75);        // pooled glaze goes deep: dark jade in every groove and hollow
  vec3 base = uBiscuit * exp(-ta * uAbsorb / max(nv, 0.6));
  base = mix(base, uMilk * (0.82 + 0.3 * exp(-t * 1.2)), 0.14 * smoothstep(0.05, 0.4, t) * (1.0 - smoothstep(0.6, 1.1, t)));
  float under = smoothstep(0.12, 0.3, t) * top;
  vec2 pF = pw + par * 0.5, pC1 = pw + par * 0.3, pC2 = pw + par * 0.12;
  // iron red pressed into the seal's grooves, green pooled over it
  float sl = sealAt(pF - uSeal.xy) * uSeal.w * top;
  base = mix(base, base * uIron, sl * 0.75);
  // paint under the glaze: the wall picture and the shore strip beside the low pass
  vec2 dW = pF - uPaintW.xy, upW = normalize(uPaintW.xy), wuv = vec2(dot(dW, vec2(upW.y, -upW.x)) / uPaintW.z + 0.5, dot(dW, upW) / uPaintW.w + 0.5);
  float inW = step(0.0, wuv.x) * step(wuv.x, 1.0) * smoothstep(0.0, 0.07, wuv.y) * step(wuv.y, 1.0);
  float pm = texture2D(uPaint, vec2(clamp(wuv.x, 0.0, 1.0), 0.25 + 0.75 * clamp(wuv.y, 0.002, 1.0))).r * inW;
  vec2 suv = vec2(pF.y / 104.0, (pF.x - 30.0) / 28.0);
  float inS = step(0.0, suv.y) * step(suv.y, 1.0) * smoothstep(-200.0, -186.0, pF.y) * (1.0 - smoothstep(70.0, 100.0, pF.y));
  pm = max(pm, texture2D(uPaint, vec2(suv.x, clamp(suv.y, 0.0, 0.995) * 0.25)).r * inS);
  pm = smoothstep(0.1, 0.66, pm + (vnoise(pF * 2.3) - 0.5) * 0.3 * pm);                 // a brushed edge, crisp when the lens is close
  pm *= under * uPaintAmt * (0.75 + 0.25 * vnoise(pF * 1.3));
  float lumB = dot(base, vec3(0.3, 0.5, 0.2));
  base = mix(base, mix(base * uCopper * 0.95 + uCopper * vec3(0.1, 0.015, 0.0), uPig * max(0.55 + 0.6 * lumB, 0.82), uPigMix), pm * mix(0.86, 0.95, uPigMix));   // pigment under glass: copper red on any ware
  // glaze fish: copper dabs half a metre down, idling in shoals, packing at open cracks, streaming over under new gold
  float rr = length(pF), aa = atan(pF.x, abs(pF.y) < 1e-3 ? 1e-3 : pF.y), band = floor(rr / 42.0);
  float dirn = mod(band, 2.0) * 2.0 - 1.0;
  vec2 q = vec2(aa * 660.0 + dirn * (uTime * (3.2 + 2.0 * hash21(vec2(band, 3.0)))), (rr + 1.5 * sin(aa * 90.0 + uTime * 0.2)) * 0.62) / uFishScale;
  float lane = (1.0 - smoothstep(18.0, 60.0, abs(pF.x - 62.0))) * smoothstep(-200.0, -150.0, pF.y) * (1.0 - smoothstep(110.0, 190.0, pF.y));
  float shoal = smoothstep(0.4, 0.56, vnoise(vec2(q.x, q.y / 0.62) * 0.021 * uFishScale + vec2(band * 3.7, uTime * 0.01)) + 0.35 * open * exp(-d / 30.0) + 0.4 * lane);
  float fishFade = under * uFishAmt * (1.0 - smoothstep(0.12, 0.4, fw / uFishScale)) * smoothstep(0.17 + 0.055 * uFishScale, 0.4 + 0.055 * uFishScale, abs(nv0)) * smoothstep(1.6, 3.4, length(cameraPosition - vPos) / uFishScale);   // seen along the glaze a dab is only a streak: they show where the lens looks down on them
  vec2 sq = pF - uStream.xy; float srm = (1.0 - smoothstep(40.0, 58.0, length(sq))) * uStream.w;
  vec2 f2 = vec2(0.0);
  if (fishFade > 0.01) {
    if (srm < 0.99 && shoal > 0.01) {
      f2 = fish(q, uTime);
      if (fw < 0.5) f2 = max(f2, fish(q * 1.31 + vec2(17.3, 41.9), uTime + 3.0));     // a second, smaller year-class when near
      f2 *= shoal * (1.0 - srm);
    }
    if (srm > 0.01) {
      float al = sq.y - uStream.z; fishFade = max(fishFade, under * srm * (1.0 - smoothstep(0.2, 0.5, fw)));
      float sm = smoothstep(-40.0, -32.0, al) * (1.0 - smoothstep(-8.0, -2.0, al)) * (1.0 - smoothstep(15.0, 24.0, abs(sq.x + 4.0)));
      f2 = max(f2, fish(vec2(al + 0.6 * sin(uTime * 0.5), sq.x * 0.62) / 0.5, uTime * 1.6) * sm * srm);
      f2 = max(f2, fish(vec2(al * 1.13 + 0.5 * sin(uTime * 0.4 + 2.0) + 9.4, sq.x * 0.7 + 23.7) / 0.5, uTime * 1.6 + 2.0) * sm * srm);   // the shoal is thick here
    }
    f2 *= fishFade;
  }
  base *= mix(vec3(1.0), vec3(0.84, 0.96, 0.88), f2.y * 0.6);                 // the copper bled a little green round each dab
  base = mix(base, mix(base * uCopper * 0.92 + uCopper * vec3(0.07, 0.01, 0.0), uPig * max(0.55 + 0.6 * lumB, 0.82), uPigMix), f2.x * 0.82);   // dabs lie under the glass, dimmer than the gold, never darker than deep jade
  // crackle: a net that arrives on each shard as weather
  float crz = clamp((uU - vSh.y) / 0.025, 0.0, 1.0) + uCrazeAll;
  float crazeOn = smoothstep(0.0, 0.22, crz * 1.3 - vnoise(pw * 0.017 + 5.0)), crazeOld = (0.32 + 0.68 * crazeOn) * (0.25 + 0.75 * vnoise(pw * 0.09 + 11.0));
  vec2 warp = (vec2(vnoise(pw * 0.31), vnoise(pw * 0.31 + 37.0)) - 0.5) * 1.5;
  float cf1 = 1.0 - smoothstep(0.2, 0.7, fw / 1.6), cf2 = 1.0 - smoothstep(0.1, 0.36, fw / 0.45);
  vec2 c1 = cf1 > 0.01 ? crackle((pC1 + warp) / 1.9) : vec2(1.0, 0.0);
  float line1 = (1.0 - smoothstep(0.006, 0.018 + fw * 0.55, c1.x)) * cf1, line2 = 0.0;
  if (cf2 > 0.01) { vec2 c2 = crackle((pC2 + warp * 0.6) / 0.45 + 17.0); line2 = (1.0 - smoothstep(0.02, 0.05 + fw * 1.0, c2.x)) * cf2 * 0.4; }
  base *= mix(vec3(1.0), uCrackCol * 0.9, clamp(line1 * 0.6 * crazeOld + line2 * (0.35 + 0.65 * step(c1.y, 0.45)) * crazeOn, 0.0, 1.0) * under);
  // light: wrapped diffuse from the afterglow and the dove fill; nothing falls below deep jade
  float kd = dot(N, uGlowDir) * 0.5 + 0.5, fd = N.y * 0.5 + 0.5;
  vec3 light = uGlowCol * 1.2 * (litK(N) - uShade * 0.85) + uFillCol * (0.3 + 0.7 * fd * fd) * 1.2;   // the shaded side keeps only the sky's cool fill
  vec3 col = base * light;
  // peach up-light: a 3 m lip beside an open crack, and the undersides of what hangs
  float lip = (exp(-d / 3.0) + 0.3 * exp(-d / 16.0)) * open * top;
  col += base * mix(uPeach, uDeep, 0.3) * 1.1 * uUpLight * (0.3 * lip + (1.0 - top) * (0.18 + 0.42 * max(-N.y, 0.0)));
  col = max(col, uBiscuit * exp(-1.75 * uAbsorb) * 0.34);                 // the deepest pool is ink green, never black
  col = mix(col, max(col, uPig * (0.3 + dot(uFillCol, vec3(0.33)))), clamp(f2.x * 1.15, 0.0, 1.0) * top);   // a dab keeps its copper red on the shaded side
  vec3 Rr = reflect(-V, normalize(mix(N0, N, 0.25 + 0.6 * smoothstep(0.15, 0.6, abs(nv0))))); Rr.y = mix(Rr.y, abs(Rr.y) + 0.02, top);   // seen along the wall the sky lies on the glaze as one soft streak, not a band per ring   // the bowl hides the cloud sea from its own inside
  float fres = 0.04 + 0.96 * pow(clamp(1.0 - nv, 0.0, 1.0), 5.0);
  col = mix(col, min(skyCol(Rr), vec3(1.1)), clamp(fres, 0.0, 1.0) * 0.36 * (1.0 - 0.65 * pm));   // the brushwork holds its colour under the sky's reflection
  float hl = max(dot(Rr, uGlowDir), 0.0); float hl2 = hl * hl; hl2 *= hl2; hl2 *= hl2; hl2 *= hl2 * hl2 * hl;
  col = min(col, vec3(0.86));
  col += uGlowCol * 0.2 * hl2 * (0.8 + 0.4 * vnoise(pw * 0.35 + vec2(uTime * 0.16, uTime * 0.09))) * top;        // the one long wet highlight, never quite still
  if (top < 0.5) {
    // what hangs shows its foot: rough unglazed clay, no rings, lit only by the cloud sea below it. Deep peach beside
    // the broken edge, falling to a dusky rose-grey toward the middle, so it stands a stop under the cloud it hangs over.
    float gU = 0.5 * vnoise(pw * 0.8) + 0.3 * vnoise(pw * 0.09 + 3.0) + 0.2 * vnoise(pw * 4.1) * (1.0 - smoothstep(0.1, 0.5, fw));
    float eU = exp(-d / 30.0), eN = exp(-d / 5.0), dn = 0.45 + 0.55 * max(-N0.y, 0.0);
    vec4 ch = chips(vec3(pw.x, 0.0, pw.y) / 7.5 + 2.1);              // the foot was never trimmed: broad shallow scoops
    float sc = clamp(0.5 + 1.1 * (ch.x * 0.6 + ch.z * 0.8), 0.0, 1.0), crk = 1.0 - smoothstep(0.0, 0.05 + fw * 0.02, ch.w);
    vec3 clay = uBiscuit * (0.36 + 0.2 * gU + 0.12 * sc) * (1.0 - 0.3 * crk);
    vec3 lightU = mix(mix(uPeach, uDeep, 0.55) * 0.5 + uFillCol * 0.55, mix(uPeach, uDeep, 0.6), eU) * uUpLight * (0.3 + 0.5 * eU + 0.35 * eN);
    lightU *= 0.86 + 0.28 * vnoise(pw * 0.035 + vec2(uTime * 0.3, -uTime * 0.2));   // the cloud sea's light is never still on what hangs over it
    col = clay * (lightU * dn * (0.35 + 0.65 * open) + uFillCol * 0.12);
  }
  gl_FragColor = vec4(haze(min(col, vec3(0.97)), length(cameraPosition - vPos)), 1.0);
}`,et=`
attribute vec4 aInfo; attribute vec3 aNrm;
varying vec3 vPos, vSeat, vN; varying vec4 vInfo; varying float vOpen;
${Me}
${Xe}
void main() {
  vec3 wp = poseOf(position, aInfo.y);
  vN = normalize(poseOf(position + aNrm * 3.0, aInfo.y) - wp + vec3(0.0, 1e-5, 0.0));   // a smooth wall normal: the chips are cut in the shader
  vOpen = max(openOf(aInfo.y), openOf(aInfo.w));
  vPos = wp; vSeat = position; vInfo = aInfo;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,tt=`
precision highp float;
varying vec3 vPos, vSeat, vN; varying vec4 vInfo; varying float vOpen;
uniform vec3 uGlass;
uniform sampler2D uCollar; uniform vec4 uCollarBox; uniform float uCrack;
${Me}
void main() {
  vec3 V = normalize(cameraPosition - vPos + vec3(0.0, 1e-4, 0.0));
  vec3 N = normalize(vN + vec3(0.0, 1e-6, 0.0));
  if (dot(N, V) < -0.2) N = -N;
  // a shard's own wall stops where the collar's ground begins (its unlit end would stand in the collar's crack)
  vec2 cuv = (vSeat.xz - uCollarBox.xy) * uCollarBox.zw; float sd = 1e3;
  if (cuv.x > 0.0 && cuv.x < 1.0 && cuv.y > 0.0 && cuv.y < 1.0) sd = textureLod(uCollar, cuv, 0.0).r * 64.0 - 16.0;
  if (vInfo.w > -1.5 && sd < uCrack + 0.4) discard;
  float nearCrack = 1.0 - smoothstep(0.0, 8.0, sd - uCrack);
  float depth = vInfo.x, rimK = vInfo.w > -1.5 && vInfo.w < -0.5 ? 1.0 : 0.0, open = mix(max(smoothstep(0.0, 0.3, vOpen), nearCrack), 0.25, rimK) * (vInfo.w < -1.5 && depth > 7.5 ? 0.5 : 0.85);
  vec2 gp = vSeat.xz * 0.9 + vSeat.y * vec2(0.63, -0.41);
  float fw = max(length(fwidth(gp)), 1e-4);
  // the foot ring: a wall of its own under the floor. Sky and fill on its top and upper face, the cloud sea's peach only
  // toward its foot, and the glaze that ran down the bowl's outside pooled dark in its inner corner
  float foot = step(vInfo.w, -2.5), rr = length(vSeat.xz) - ${w0.toFixed(1)}, dW = mix(depth, clamp((depth - 8.0) * 0.4, 0.0, 9.0), foot);
  open = mix(open, 0.7 * smoothstep(12.0, 29.0, depth), foot);
  float lipK, edgeK; vec3 Nb = N;
  N = biscuitN(Nb, vSeat, fw, lipK, edgeK);
  vec3 col = biscuitShade(N, Nb, gp, dW, fw, open, lipK, edgeK, vInfo.z);
  float capK = foot * smoothstep(0.5, 0.8, Nb.y);
  col = mix(col, col * 0.55 + uBiscuit * (uFillCol * 0.9 + uGlowCol * 0.35 * litK(Nb)) * 0.5, capK);          // its top catches the sky: a pale line
  float pool = foot * max(capK * (1.0 - smoothstep(-5.6, -4.2, rr)), step(rr, 0.0) * (1.0 - capK) * (1.0 - smoothstep(9.2, 11.0, depth)));
  col = mix(col, uGlass * 0.22 * (uFillCol * 1.4 + uGlowCol * 0.4) + skyCol(reflect(-V, Nb)) * 0.06, pool * 0.9);
  float glassLine = (1.0 - smoothstep(0.42, 0.55 + fw * 0.3, depth));
  vec3 glass = uGlass * (0.3 + 0.22 * vnoise(gp * 3.3)) * (uFillCol * 1.3 + uGlowCol * 0.6 * litK(Nb)) + skyCol(reflect(-V, N)) * 0.05 + uGlass * uPeach * uUpLight * 0.05 * open;
  col = mix(col, min(glass, vec3(0.5)), glassLine);
  gl_FragColor = vec4(haze(col, length(cameraPosition - vPos)), 1.0);
}`,ot=`
attribute vec3 aAcross; attribute vec4 aGold; attribute vec2 aWin;
uniform float uU; uniform vec2 uRes;
varying vec3 vPos, vN, vT, vA; varying vec4 vG;
void main() {
  float s = aGold.x, phi = aGold.y, baseR = aGold.z, L = aGold.w;
  float prog = clamp((uU - aWin.x) / max(aWin.y - aWin.x, 1e-4), 0.0, 1.0), front = (L + 8.0) * prog, behind = front - s;
  float running = step(0.0005, prog) * (1.0 - step(0.9995, prog));
  float grow = (1.0 - smoothstep(front - 6.0, front, s)) * step(0.0005, prog);
  float crown = exp(-behind * behind / 9.0) * running;
  float heat = behind > 0.0 ? exp(-behind / (baseR > 1.5 ? 60.0 : 18.0)) * (1.0 - smoothstep(0.0, 0.07, uU - aWin.y)) : 0.0;   // a river glows a long way behind its front
  vec3 nrm = normalize(vec3(0.0, 1600.0, 0.0) - position);
  float rad = baseR * grow * (1.0 + 1.2 * crown), sp = sin(phi), cp = cos(phi);
  float pxm = distance(cameraPosition, position) * 2.0 / max(projectionMatrix[1][1] * uRes.y, 1.0);
  rad = max(rad, 2.3 * pxm * grow);                                   // a far seam holds three pixels: mended with gold reads from across the bowl
  vec3 p = position + aAcross * sp * rad + nrm * (cp * rad * (0.5 + 0.25 * crown) - 0.06);
  vN = normalize(aAcross * sp * 0.55 + nrm * cp + nrm * 0.02); vA = aAcross; vT = normalize(cross(nrm, aAcross));
  vPos = p; vG = vec4(s, sp * baseR, heat * 0.85, crown * 0.8);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`,at=`
attribute vec2 aIds, aT, aRnd;
uniform vec2 uRes;
varying vec3 vPos; varying vec3 vTR;
${Me}
${Xe}
void main() {
  vec3 A = poseOf(position, aIds.x), B = poseOf(position, aIds.y);
  float gap = length(B - A), t = aT.x, bow = 4.0 * t * (1.0 - t);
  float slack = min(gap * (0.1 + 0.5 * aRnd.x), 6.0 + gap * 0.08) + 0.3;   // a long thread is nearly taut: it draws its shard home
  vec3 sway = vec3(sin(uTime * 0.43 + aRnd.y * 6.28), 0.0, cos(uTime * 0.37 + aRnd.x * 6.28)) * gap * 0.03;
  vec3 p = mix(A, B, t) + (vec3(0.0, -slack, 0.0) + sway) * bow;
  vec3 tg = (B - A) + vec3(0.0, -slack, 0.0) * 4.0 * (1.0 - 2.0 * t) + vec3(1e-3, 0.0, 0.0);
  vec3 toCam = cameraPosition - p; float dist = max(length(toCam), 0.1);
  vec3 sd = cross(tg, toCam); float sl = length(sd); sd = sl > 1e-5 ? sd / sl : vec3(1.0, 0.0, 0.0);
  float px = dist * 2.0 / max(projectionMatrix[1][1] * uRes.y, 1.0);
  float base = 0.07 + 0.05 * aRnd.y, halfW = max(base, 0.8 * px) * smoothstep(0.25, 1.2, gap);
  p += sd * aT.y * halfW;
  vPos = p; vTR = vec3(t, clamp(base / max(halfW, 1e-4), 0.0, 1.0), aRnd.x);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  if (gap < 0.25) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,nt=`
precision highp float;
varying vec3 vPos; varying vec3 vTR;
uniform vec3 uF0, uEmber; uniform float uGoldLift;
${Me}
void main() {
  float g = 0.5 + 0.5 * sin(vTR.x * 9.0 + uTime * 1.3 + vTR.z * 40.0); g *= g; g *= g;
  vec3 col = uF0 * (uFillCol * 0.4 + uGlowCol * 0.3 + uPeach * uUpLight * 0.16) + uEmber * (0.12 + 1.9 * g * g) * mix(0.4, 1.0, vTR.y);
  col += uF0 * mix(uF0, vec3(1.0), 0.3) * (0.1 + 1.2 * uGoldLift) * mix(0.5, 1.0, vTR.y);
  col = mix(col, mix(uF0, vec3(1.0), 0.6) * (uGlowCol * 0.75 + uPeach * 0.35), (1.0 - vTR.y) * 0.7);   // far off: a pale bright hairline
  gl_FragColor = vec4(haze(col, length(cameraPosition - vPos)), 1.0);
}`,it=`
attribute vec2 aIds; attribute vec3 aBl;
varying vec3 vB; varying float vDist;
${Me}
${Xe}
void main() {
  vec3 A = poseOf(position, aIds.x), B = poseOf(position, aIds.y);
  float gap = length(B - A);
  float hgt = min(7.0 + gap * 2.2, 30.0) * (0.7 + 0.3 * sin(aBl.y * 0.07 + uTime * 0.13));   // low: the light stands in the crack, it never veils the floes behind
  vec3 p = mix(A, B, 0.5) + normalize(vec3(0.0, 1600.0, 0.0) - position) * hgt * aBl.x;
  vB = vec3(aBl.x, aBl.y, smoothstep(0.4, 3.0, gap) * aBl.z); vDist = distance(cameraPosition, p);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`,st=`
precision highp float;
varying vec3 vB; varying float vDist;
uniform float uBlade;
${Me}
void main() {
  float t = vB.x, f = 1.0 - t; f = f * f * f * smoothstep(0.0, 0.04, t);
  float streak = 0.55 + 0.45 * vnoise(vec2(vB.y * 0.22 + 0.5 * sin(uTime * 0.21 + vB.y * 0.01), uTime * 0.17));
  float a = f * streak * vB.z * uBlade * exp(-vDist * uHazeK) * smoothstep(1.5, 9.0, vDist);
  gl_FragColor = vec4(mix(uPeach, uDeep, 0.6) * uUpLight * a, 1.0);
}`,lt="varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0); if (abs(gl_Position.w) < 1e-4) gl_Position.w = 1e-4; gl_Position.z = gl_Position.w * 0.9999; }",rt=`
precision highp float;
varying vec3 vD;
${Me}
void main() {
  vec3 d = normalize(vD + vec3(0.0, 1e-5, 0.0));
  vec3 c = skyCol(d);
  if (d.y < 0.02) {
    vec2 cp = d.xz / max(-d.y + 0.12, 0.05) * 3.0 + vec2(uTime * 0.034, uTime * 0.02);   // the cloud tops roll under the bowl
    float n = vnoise(cp) * 0.5 + vnoise(cp * 2.3 + 7.0) * 0.27 + vnoise(cp * 5.1 + vec2(uTime * 0.07, -uTime * 0.04)) * 0.15 + vnoise(cp * 11.3) * 0.08;
    float bil = smoothstep(0.25, 0.8, n), rim = smoothstep(0.5, 0.72, n) * (1.0 - smoothstep(0.72, 0.92, n));
    // a floor to the hole: saturated peach billows, deeper rose in the troughs between them, a paler lit crest on each
    vec3 sea = mix(uDeep * vec3(0.8, 0.7, 0.76), mix(uDeep, uPeach, 0.72) * 1.08, bil) + uPeach * 0.16 * rim;
    c = mix(c, sea, 1.0 - smoothstep(-0.05, 0.02, d.y));
  }
  c += uGlowCol * 0.1 * pow(max(1.0 - abs(d.y), 0.0), 8.0);
  // Where the ray leaves the bowl's sphere below the rim it has passed through a crack or the gap: the bowl hangs
  // IN the lit cloud, so every break blazes peach whatever the angle, not only those we look down through.
  vec3 ro = cameraPosition - vec3(0.0, 1600.0, 0.0);
  float bq = dot(ro, d), disc = bq * bq - (dot(ro, ro) - 2560000.0);
  if (disc > 0.0) {
    float yExit = cameraPosition.y + d.y * (-bq + sqrt(disc));
    float thru = (1.0 - smoothstep(322.0, 356.0, yExit)) * smoothstep(-0.02, 0.06, d.y);
    vec2 cq = d.xz * 5.0 + vec2(uTime * 0.011, d.y * 7.0 - uTime * 0.008);
    float cn = vnoise(cq) * 0.65 + vnoise(cq * 2.7 + 5.0) * 0.35;
    c = mix(c, mix(uDeep * 0.8, mix(uDeep, uPeach, 0.5) * 1.3, cn * cn * (3.0 - 2.0 * cn)), thru);
  }
  gl_FragColor = vec4(c, 1.0);
}`,ct=`
attribute vec4 aRnd;
uniform vec2 uRes; uniform float uTime, uDust;
varying float vA;
void main() {
  vec3 drift = vec3(0.6, 0.25, 0.9) * uTime * (0.7 + 1.5 * aRnd.x) + vec3(sin(uTime * 0.31 + aRnd.y * 30.0), sin(uTime * 0.23 + aRnd.z * 30.0), cos(uTime * 0.27 + aRnd.w * 30.0)) * 1.4;
  vec3 p = mod(position + drift - cameraPosition + 40.0, 80.0) - 40.0;
  float dc = length(p); p += cameraPosition;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float dist = max(-mv.z, 0.1), sizeM = 0.09 + 0.3 * aRnd.z * aRnd.z;
  float px = sizeM * projectionMatrix[1][1] * uRes.y * 0.5 / dist;
  gl_PointSize = clamp(px, 1.6, 16.0);
  vA = uDust * clamp(px / 1.6, 0.35, 1.0) * (0.45 + 0.55 * aRnd.w) * (1.0 - smoothstep(30.0, 40.0, dc)) * smoothstep(1.0, 4.0, dist) * (0.55 + 0.45 * sin(uTime * 2.0 + aRnd.x * 50.0));   // each mote turns in the light: a slow twinkle (a third of a hertz, eased)
  gl_Position = projectionMatrix * mv;
}`,ht=`
precision highp float;
varying float vA; uniform vec3 uEmber;
void main() { vec2 c = gl_PointCoord - 0.5; float f = max(1.0 - dot(c, c) * 4.0, 0.0); gl_FragColor = vec4(uEmber * 2.1 * f * f * vA, 1.0); }`;async function pt(a,h,P){const _=document.createElement("canvas");_.width=_.height=1024;const s=_.getContext("2d");s.fillStyle="#000",s.fillRect(0,0,1024,1024),s.strokeStyle="#fff",s.fillStyle="#fff",s.lineCap="round",s.lineJoin="round";const S=(p,n,i,t,b,d,m,B=.5)=>{const R=(p+i)/2-(t-n)*b,g=(n+t)/2+(i-p)*b,V=Math.max(8,Math.round(Math.hypot(i-p,t-n)/5));let Z=p,q=n;for(let H=1;H<=V;H++){const I=H/V,ne=(1-I)*(1-I),U=2*I*(1-I),G=I*I,le=ne*p+U*R+G*i,$=ne*n+U*g+G*t,l=Math.max(0,(I-(1-B))/Math.max(B,.001));s.globalAlpha=(.95-.55*l)*(l>.2&&a()<l*.55?.25:1),s.lineWidth=Math.max(1,Le(d,m,Math.pow(I,.8))*Math.min(1,.22+I*7)),s.beginPath(),s.moveTo(Z,q),s.lineTo(le,$),s.stroke(),Z=le,q=$}s.globalAlpha=1},y=(p,n,i,t,b,d=.95)=>{s.globalAlpha=d,s.beginPath(),s.ellipse(p,n,i,t,b,0,Math.PI*2),s.fill(),s.globalAlpha=1};if(h===0){for(let n=0;n<9;n++){await P();const i=90+n*100+a.range(-30,30),t=a.range(300,420),b=a.range(-70,70);S(i,768,i+b,768-t,a.range(-.08,.08),20,5,.45);for(let d=0;d<3;d++){const m=768-t*a.range(.25,.8),B=a.sign();S(i+b*(768-m)/t,m,i+B*a.range(60,130),m-a.range(10,120),B*.25,13,2,.6)}y(i+b,768-t-16,9,30,b*.004,.85)}const p=(n,i,t,b)=>{y(n,i,52*t,30*t,-.25),S(n+40*t,i-12*t,n+78*t,i-110*t,-.35,13*t,7*t,.1),y(n+80*t,i-116*t,11*t,8*t,0),S(n+86*t,i-116*t,n+128*t,i-104*t,0,5*t,1.5,.2),S(n-6*t,i+24*t,n-14*t,i+(b?100:140)*t,.05,5*t,3*t,.2),S(n+12*t,i+24*t,n+(b?40:16)*t,i+(b?96:140)*t,-.1,5*t,3*t,.2);for(let d=0;d<5;d++)S(n-36*t,i-4*t,n-(88+d*10)*t,i+(22-d*13)*t,.12,15*t,3,.5);if(b)for(let d=0;d<7;d++)S(n-6*t,i-18*t,n-(70-d*26)*t,i-(130+22*Math.sin(d*.6))*t,.1,17*t,3,.5)};p(330,300,1.1,!0),p(690,520,1.25,!1)}else if(h===1){for(let n=0;n<4;n++){await P();const i=130+n*250+a.range(-50,50),t=a.range(380,560),b=a.range(-80,80);S(i,768,i+b,768-t,a.range(-.15,.15),30,9,.2);for(let d=0;d<6;d++){const m=.35+d*.11,B=i+b*m,R=768-t*m,g=d%2?1:-1,V=a.range(70,150)*(1.2-m*.6);S(B,R,B+g*V,R-a.range(-10,40),g*.2,11,4,.2);for(let Z=0;Z<9;Z++){const q=B+g*V*a.range(.3,1.05),H=R-a.range(0,30);for(let I=0;I<5;I++)S(q,H,q+a.range(-34,34),H-a.range(14,40),0,3.5,1,.5)}}}const p=(n,i,t,b)=>{const d=b?-1:1;y(n,i,58*t,26*t,.05*d),S(n+d*44*t,i-10*t,n+d*70*t,i-66*t,.1*d,20*t,11*t,.05),y(n+d*80*t,i-72*t,18*t,10*t,.3*d);for(const m of[-42,-28,30,44])S(n+d*m*t,i+16*t,n+d*(m+a.range(-8,8))*t,i+92*t,.05,8*t,3*t,.2);for(const m of[-.3,.25])S(n+d*74*t,i-80*t,n+d*(74+40*m)*t,i-140*t,m*.4,4.5*t,2,.2),S(n+d*(74+20*m)*t,i-110*t,n+d*(90+50*m)*t,i-128*t,0,3.5*t,1.5,.2)};p(400,560,1.2,!1),p(700,640,.9,!0)}if(h!==2){for(let p=0;p<110;p++){p%12===0&&await P();const n=a.range(0,1024),i=782+228*Math.pow(a(),.7),t=a.range(14,38),b=a.int(3,6);for(let d=0;d<b;d++){const m=(d/(b-1)-.5)*1.1+a.range(-.1,.1);for(const B of[0,-1024,1024])S(n+B,i,n+B+Math.cos(m)*t,i+Math.sin(m)*t,m*.3,3.2,1,.6)}}for(let p=0;p<6;p++){const n=80+p*165+a.range(-30,30),i=800+a.range(0,180),t=a.range(.9,1.3);s.fillStyle="#000",s.fillRect(n-6,i-26*t,44*t,52*t),s.fillStyle="#fff",S(n+30*t,i,n+20*t,i-22*t,.25,6,2.5,.1),S(n+30*t,i,n+20*t,i+22*t,-.25,6,2.5,.1),S(n,i-11*t,n+20*t,i-11*t,0,2.5,2.5,0),S(n,i+11*t,n+20*t,i+11*t,0,2.5,2.5,0),S(n,i-15*t,n,i+15*t,0,3,3,0)}}await P();const M=new c.CanvasTexture(_);return M.wrapS=c.RepeatWrapping,M.wrapT=c.ClampToEdgeWrapping,M.anisotropy=4,M.colorSpace=c.NoColorSpace,M}var mt={id:"mended-country",name:"The Country Mended with Gold",category:"bizarre",media:["air","interior"],weirdness:.8,async build(a){const{rng:h}=a,P=a.vary||{},_=ze(a.quality?.detail??1,.5,1),s=ze(P.density??1,.7,1.3),S=P.hour==="night"?"moon":P.hour==="dawn"?"dawn":P.hour==="golden"||P.hour==="day"?"dusk":h.pick(["dusk","dusk","moon","dawn"]),y=K0[S],M=h.pick([Ze[0],Ze[0],Ze[1],Ze[2]]),p=h.int(0,2),n=h.pick(["still","dust","craze"]),i=!!P.rare,t=M.pal.slice();t[6]=y.peach,S==="moon"&&M.name!=="sea-green"&&(t[4]=M.name==="ivory"?"#D69A6A":"#E3CB86");const b=new c.Vector3(S==="dawn"?-.6:.6,.37,.79).normalize(),d=new c.Scene,m=await L0(a,{palette:t,glowDir:b,detail:_,startU:.1,seatU:s0,meetU:.925,chipU:.948}),B=m.anchors.placement;m.object.position.fromArray(B.position),m.object.rotation.y=B.rotationY,m.object.updateMatrixWorld(!0),d.add(m.object);const R=e=>new c.Vector3(-e[0],e[1]+B.position[1],B.position[2]-e[2]),g=m.uniforms;g.uPeach.value.copy(ye(y.peach)),g.uDeep.value.copy(ye(y.deep)),g.uUpLight.value=y.up,g.uZenith.value.copy(ye(y.zen)),g.uRimSky.value.copy(ye(y.rim)),g.uGlowCol.value.copy(ye(y.glow,y.glowK)),g.uFillCol.value.copy(ye(y.fill,.45)),M.name==="ivory"&&(g.uFillCol.value.lerp(ye("#ECE6D8",.64),.8),g.uAbsorb.value.set(.36,.41,.31),g.uMilk.value.copy(ye("#E9E3D6")),g.uPool.value=2),g.uHazeCol.value.copy(ye(y.haze)),g.uHazeK.value=S==="moon"?1/1500:1/2600,g.uCrackCol.value.copy(new c.Vector3().fromArray(new c.Color(M.crack).toArray().map(Math.sqrt))),await a.yield();const V=m.anchors.flyThrough.map(R),Z=new c.Vector3().subVectors(V[6],V[5]).normalize(),q=e=>V[6].clone().addScaledVector(Z,-e),H=[[60,92,-362],[60,92,-305],pe(58,-232,76),pe(57,-165,42),pe(60,-105,21),pe(61,-45,14),pe(62,12,14),pe(72,72,24),pe(100,140,44),pe(138,205,58),pe(166,285,66),pe(182,365,76),pe(184,440,104),pe(166,505,160),pe(128,570,222),new c.Vector3(104,352,655),q(120),V[5],V[6]];await a.yield();const I=U0(H);await a.yield();const ne=R(m.anchors.portalSeat.position),U=new c.Vector3,G=e=>{let o=0,w=.8;for(let C=0;C<30;C++){const D=(o+w)/2;I.pointAt(D,U).z<e?o=D:w=D}return o},le=2.6,$=m.anchors.collarOutline.filter((e,o)=>o%3===0).map(e=>{const o=R(e);return{x:o.x,z:o.z}});let l=1e9,x=-1e9,u=1e9,r=-1e9,K=0,ie=0;await a.yield();for(const e of $)l=Math.min(l,e.x),x=Math.max(x,e.x),u=Math.min(u,e.z),r=Math.max(r,e.z),K+=e.x/$.length,ie+=e.z/$.length;l-=44,x+=44,u-=44,r+=44;const z=(e,o)=>{if(e<l||e>x||o<u||o>r)return 99;let w=1e18,C=!1;for(let D=0,J=$.length-1;D<$.length;J=D++){const k=$[J],Q=$[D],fe=Q.x-k.x,he=Q.z-k.z,ve=ze(((e-k.x)*fe+(o-k.z)*he)/Math.max(1e-6,fe*fe+he*he),0,1),xe=e-k.x-fe*ve,$e=o-k.z-he*ve;w=Math.min(w,xe*xe+$e*$e),k.z>o!=Q.z>o&&e<k.x+(o-k.z)/(Q.z-k.z)*fe&&(C=!C)}return C?-Math.sqrt(w):Math.sqrt(w)},A=224,X=new Uint8Array(A*A);for(let e=0;e<A;e++)for(let o=0;o<A;o++){o===0&&(e&15)===0&&await a.yield();const w=z(l+(o+.5)/A*(x-l),u+(e+.5)/A*(r-u));X[e*A+o]=Math.round(ze((w+16)/64,0,1)*255)}const E=new c.DataTexture(X,A,A,c.RedFormat,c.UnsignedByteType);E.minFilter=E.magFilter=c.LinearFilter,E.needsUpdate=!0,await a.yield();const O=$.map((e,o)=>{const w=$[(o+$.length-1)%$.length],C=$[(o+1)%$.length];let D=C.z-w.z,J=-(C.x-w.x);const k=Math.max(1e-4,Math.hypot(D,J));return D/=k,J/=k,D*(e.x-K)+J*(e.z-ie)<0&&(D=-D,J=-J),{x:e.x+D*le,z:e.z+J*le,ox:D,oz:J}});await a.yield(),await a.yield();const de=[{x:60,z:-272},{x:i0+30,z:-112},{x:i0-30,z:-112},{x:-118,z:-70},{x:72+0*h.range(-10,10),z:108+0*h.range(-8,8)},{x:z0,z:y0},{x:250,z:168},{x:420,z:122},{x:600,z:205},{x:632,z:400},{x:505,z:525}],re=m.anchors.rivers,f=R([re.apex[0],0,re.apex[1]]),F=de.length,L=re.phi.length,N=285,j=re.phi.map(e=>{const o=e*Math.PI/180;return[Math.sin(o),-Math.cos(o)]});for(const e of j)de.push({x:f.x+e[0]*N,z:f.z+e[1]*N});const T=[[.74,20,1300],[.68,20,1300],[.5,60,1200],[.5,150,1400],[.4,0,1150,235],[.56,90,1400],[.56,50,1300],[.56,22,1300],[.7,0,1350,35],[.7,0,1350,50],[.7,0,1300,60],[.7,0,1200,72],[.76,0,1150,112],[.775,0,1100,112],[.81,0,900,78]],ee=e=>(I.pointAt(e,U),Math.hypot(U.x-f.x,U.z-f.z));await a.yield();const oe=T.map(([e,o,w,C])=>C??ee(e)-o),Y=T.map(([e,o,w],C)=>e-(380-oe[C])/w);await a.yield();const ke=h.int(38,54);for(let e=0;de.length<ke&&e<6e3;e++){e%150===149&&await a.yield();const o=h.range(0,Math.PI*2),w=Math.sqrt(h())*(n0-40),C=Math.cos(o)*w,D=Math.sin(o)*w,J=Le(150,235,ze(w/800,0,1))*(e>3e3?.75:1);z(C,D)<30||de.every(k=>Math.hypot(k.x-C,k.z-D)>J)&&de.push({x:C,z:D})}await a.yield();const ae=await H0(de,()=>a.yield()),Se=ae.length;await a.yield();const Fe=(e,o)=>{let w=0,C=1e18;for(let D=0;D<Se;D++){const J=(de[D].x-e)**2+(de[D].z-o)**2;J<C&&(C=J,w=D)}return w},v=0,te=1,W=2,me=3,Ae=4,ue=_<.9?12.5:10,se=await Z0(ae,(e,o)=>I.nearestXZ(e,o).dist<170?4.5:ue,()=>a.yield());await a.yield(),await a.yield();for(let e=0;e<=.8;e+=.004){I.pointAt(e,U);const o=ae[Fe(U.x,U.z)];o.uIn===void 0&&U.y-Be(U.x,U.z)<30&&(o.uIn=e)}await a.yield();const De=G(-2.5),r0=G(34),M0=(I.pointAt(r0+.005,U),Fe(U.x,U.z)),We=new Uint16Array(256*4),je=c.DataUtils.toHalfFloat,qe=(e,o,w,C,D,J)=>{const k=(e*64+o)*4;We[k]=je(w),We[k+1]=je(C),We[k+2]=je(D),We[k+3]=je(J)};for(const e of ae){(e.id&7)===0&&await a.yield();const o=e.id,w=I.nearestXZ(e.cx,e.cz);let C=0;for(const be of e.ring)C+=Math.hypot(be.x-e.cx,be.z-e.cz)/Math.max(1,e.ring.length);C=Math.max(C,40);const D=e.ring.some((be,G0)=>G0%3===0&&z(be.x,be.z)<24),J=ze(.03*(Math.hypot(e.cx-60,e.cz+335)-110),3,15)*h.range(.8,1.25);let k=-2,Q=-1,fe=0,he=0,ve=0,xe=0,$e=h.range(0,Math.PI*2),Ge=[Math.cos($e),0,Math.sin($e)];const we=o-F,_0=we>=0&&we<L;let g0=e.cx,x0=e.cz;if(_0)g0=f.x+j[we][0]*112,x0=f.z+j[we][1]*112,Ge=[-j[we][1],0,j[we][0]],Q=Math.max(.3,Math.min(Y[Math.max(we-1,0)],Y[Math.min(we,Y.length-1)])-.012),k=Q-.1,he=-(.012+.02*ge(we*4.7+1.3)),ve=.0028,we===4&&(Q=.5,k=.41,he=-.04,ve=.006);else if(!(o===v||D||o>He&&o<F)){if(o===te||o===W)k=.012,Q=G(-218),fe=2.6,he=h.sign()*.006,ve=.002,xe=2.5/C;else if(o===me)Q=G(-40),k=Q-.1,fe=26,he=18*Math.PI/180,ve=.005,xe=.03,Ge=[0,0,1];else if(o===Ae)Q=De-.002,k=De-.021,fe=9,he=h.sign()*.006,ve=.003,xe=8/C;else if(o===He)k=.44,Q=.74,fe=b0,he=j0,ve=.004,xe=.035,Ge=[-.54,0,.84];else if(!(Math.hypot(e.cx-60,e.cz+300)<330)){if(e.uIn!==void 0)Q=Math.max(.03,e.uIn-.004),k=Q-.055,fe=Math.min(J,13),he=h.sign()*h.range(.004,.012),ve=.004,xe=h.range(6,9)/C;else if(h()>.6){const be=w.dist<130;Q=ze(w.u+h.range(.08,.4),.2,.97),k=Math.max(.02,Q-h.range(.12,.3)),fe=be?-h.range(3,10):J,he=h.range(-1,1)*(be?.014:.03),ve=be?.005:h.range(.008,.018),xe=h.range(6,10)/C}}}e.u0=k,e.u1=Q,e.tint=h();const V0=o===M0?r0:h()<.4?-1:n==="craze"?ze(w.u+h.range(-.06,.02),.02,.9):h.range(.05,1.3);Oe(g0,x0),qe(0,o,Ee.x,Ee.y,Ee.z,xe),qe(1,o,Ge[0],Ge[1],Ge[2],he),qe(2,o,k,Q,h.range(0,6.28),ve),qe(3,o,fe,V0,e.tint,0)}qe(2,63,-2,-1,0,0);const Re=new c.DataTexture(We,64,4,c.RGBAFormat,c.HalfFloatType);Re.minFilter=Re.magFilter=c.NearestFilter,Re.generateMipmaps=!1,Re.needsUpdate=!0,await a.yield();const Ye=se.get(`${te}_${W}`);if(Ye){const e=Ye.pts,o=Math.min(e[0].z,e[e.length-1].z),w=Math.max(e[0].z,e[e.length-1].z);Ye.fixed={flip:e[0].z>e[e.length-1].z,g0:G(o-62),g1:G(w+8-62)}}for(const e of[`${W}_${Ae}`,`${te}_${Ae}`]){const o=se.get(e);if(!o)continue;let w=-1,C=30;o.pts.forEach((D,J)=>{const k=I.nearestXZ(D.x,D.z).dist;k<C&&(C=k,w=J)}),w>=0&&(o.fixed={i:w,u:De-.02})}re.theta.forEach((e,o)=>{const w=se.get(`${F+o}_${F+o+1}`);w&&(w.fixed={river:{k:o,ax:f.x,az:f.z,uRef:T[o][0],rRef:oe[o],v:T[o][2],r:re.radius}})});const c0=()=>a.yield(),h0=await X0(ae,z,w0,O,c0);await a.yield();const Je=await Y0(se,ae,z,le,h.fork("seams"),_,c0);for(const e of se.values()){const o=e.fixed&&e.fixed.river;o&&o.uA!==void 0&&m.setRiver(o.k,o.uA,o.v)}await a.yield();const p0=ae[Ae].u1,Ne=I.pointAt(De,new c.Vector3),A0=p===2?4.2:p===1?1:1.9;g.uFishScale.value=A0,g.uCarve.value=p===2?1:0,g.uPig.value.copy(ye(t[5],M.name==="sea-green"?1.7:M.name==="celadon"?1.6:1.3)),g.uPigMix.value=M.name==="ivory"?.35:.82,M.name==="sea-green"&&g.uGoldWarm.value.set(.96,1,1.05),g.uGoldLift.value=M.name==="sea-green"?.16:S==="moon"?.26:.22;const _e={...g,uShards:{value:Re},uU:{value:0},uPaint:{value:null},uCollar:{value:E},uCollarBox:{value:new c.Vector4(l,u,1/(x-l),1/(r-u))},uPaintW:{value:new c.Vector4(98,328,430,290)},uSeal:{value:new c.Vector4(24,-118,30,1)},uStream:{value:new c.Vector4(Ne.x,Ne.z,0,p===2?0:1)},uCrack:{value:le},uFishAmt:{value:1},uCrazeAll:{value:0},uPaintAmt:{value:1},uIron:{value:new c.Vector3(.74,.36,.27)},uBlade:{value:.3},uDust:{value:n==="dust"?1.9:1.25}};await a.yield();const S0=await pt(h.fork("paint"),p,()=>a.yield());await a.yield();const Ce=(e,o,w={})=>new c.ShaderMaterial({uniforms:_e,vertexShader:e,fragmentShader:o,...w}),F0=new c.Sphere(new c.Vector3(0,200,0),1400);_e.uPaint.value=S0;const Pe=(e,o,w=0)=>(e.geometry.boundingSphere=F0,e.name=o,e.frustumCulled=!1,e.renderOrder=w,d.add(e),e);Pe(new c.Mesh(h0.glaze,Ce(J0,Q0,{side:c.DoubleSide})),"glaze"),Pe(new c.Mesh(h0.biscuit,Ce(et,tt,{side:c.DoubleSide})),"biscuit"),await a.yield(),Pe(new c.Mesh(Je.gold,Ce(ot,q0)),"gold"),Pe(new c.Mesh(Je.threads,Ce(at,nt,{side:c.DoubleSide})),"threads"),Pe(new c.Mesh(Je.blades,Ce(it,st,{side:c.DoubleSide,transparent:!0,depthWrite:!1,blending:c.AdditiveBlending})),"blades",2),Pe(new c.Mesh(new c.IcosahedronGeometry(1,4),Ce(lt,rt,{side:c.BackSide,depthWrite:!1})),"sky",-1),await a.yield();const Qe=Math.round(5600*_*Math.max(s,.95)*(n==="dust"?2.2:1)),Ke=new Float32Array(Qe*3),u0=new Float32Array(Qe*4);for(let e=0;e<Qe;e++){Ke[e*3]=h.range(0,80),Ke[e*3+1]=h.range(0,80),Ke[e*3+2]=h.range(0,80);for(let o=0;o<4;o++)u0[e*4+o]=h()}const e0=new c.BufferGeometry;e0.setAttribute("position",new c.BufferAttribute(Ke,3)),e0.setAttribute("aRnd",new c.BufferAttribute(u0,4)),Pe(new c.Points(e0,Ce(ct,ht,{transparent:!0,depthWrite:!1,blending:c.AdditiveBlending})),"dust",3);const t0=new c.Vector3,C0=new c.Vector3,Ve=new c.Vector3,P0=new c.Vector3(-80,112,-70),ut=new c.Vector3,T0=m.anchors.capPoint(0,-125),I0=e=>(e.applyMatrix4(m.pose),e.set(-e.x,e.y+B.position[1],B.position[2]-e.z)),o0=()=>I0(t0.fromArray(T0)),f0=s0-.002,d0=60,a0=[];for(let e=0;e<=d0;e++){const o=m.beadPositions(f0+e*.002).map(w=>new c.Vector3(-w[0],w[1]+B.position[1],B.position[2]-w[2]));a0.push([o[1],o[0].clone().add(o[1]).multiplyScalar(.5)])}await a.yield();const m0=G(-185),v0=G(-62),B0=pe(z0-30,y0-22,b0*.5),E0=new c.Vector3,k0=R(m.anchors.capPoint(0,-135)),D0=new c.Vector3,R0=(e,o)=>{const w=ze((Math.max(o,s0+.012)-f0)/.002,0,d0-.001),C=Math.floor(w),D=w-C;return E0.copy(k0).lerp(C0.lerpVectors(a0[C][1],a0[C+1][1],D),Ue(.885,.93,o))},N0=[{at:o0,from:0,to:.06,weight:.5,fade:.4},{at:P0,from:.05,to:m0-.02,weight:.7,fade:.35},{at:(e,o)=>(I.pointAt(Math.min(o+.04,.4),Ve),Ve.x=i0-1,Ve.y=Be(Ve.x,Ve.z)+2,Ve),from:m0-.03,to:v0,weight:.8,fade:.25},{at:(e,o)=>D0.set(Ne.x+2,Be(Ne.x,Ne.z+40)+4,Ne.z+40),from:v0-.015,to:De+.004,weight:.75,fade:.3},{at:()=>(o0(),t0.x-=105,t0),from:De+.012,to:G(160),weight:.85,fade:.3},{at:B0,from:G(128),to:G(262),weight:.9,fade:.3},{at:o0,from:G(250),to:.8,weight:.9,fade:.2},{at:R0,from:.775,to:.97,weight:1,fade:.12}];g.uRare&&(g.uRare.value=i?1:0);let Te=0;return{scene:d,path:I,duration:49,title:i?"The Country Mended with Gold (a piece from another bowl)":"The Country Mended with Gold",camera:{fov:62,near:.3,far:4e3,lookAhead:58,sway:.5,bank:.5},pois:N0,portal:{shape:"circle",radius:7,color:y.portal,glow:1,revealDistance:400,tilt:!0},post:{exposure:.94,bloom:{strength:.55,radius:.6,threshold:1},grade:{saturation:1.08,contrast:1.1,tint:"#ffffff",shadowTint:"#0b1512",vignette:.22,grain:0,aberration:0}},ride:"none",style:"none",companion:"none",update(e,o,w,C){Te=ze(C||0,0,1),m.setProgress(Te),m.update(e,o,w),_e.uU.value=Te,_e.uStream.value.z=72*Ue(p0-.03,p0+.045,Te),_e.uCrazeAll.value=n==="craze"?.25*Ue(.3,.9,Te):0,g.uBeacon.value=Ue(.6,.74,Te)*(1-Ue(.81,.865,Te))},dispose(){m.dispose(),Re.dispose(),E.dispose(),_e.uPaint.value.dispose()}}}};export{mt as default};
