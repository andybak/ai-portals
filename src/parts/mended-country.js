import*as t from"three";import{smoothstep as ge,clamp as re,lerp as te}from"../kit/core.js";const de=1600,ze=540,Ne=de-Math.sqrt(de*de-ze*ze),xe=240,Xe=55,ke=9,T={x:-58,z:-250,r:8.6},ce={x:-2,z:-45},Oe=1.55,Ge=[-80,-50,-25,-6,5,11,17,23,29.5,37,46,58,80,97,120,139],Ae=Ge.slice(1).map((n,a)=>(n+Ge[a])/2),je=["#A9C9B4","#DCE9DC","#6E9C8A","#EFE7DA","#D8A53A","#A8402E","#F3C9A8"];function U(n,a,l=new t.Vector3){const y=ze-a,f=Math.sqrt(Math.max(1,de*de-n*n-y*y));return l.set(n,de-Ne-f,a)}function fe(n,a,l=new t.Vector3){const y=ze-a,f=Math.sqrt(Math.max(1,de*de-n*n-y*y));return l.set(-n,f,y).multiplyScalar(1/de)}const $=n=>{const a=Math.sin(n*127.1+311.7)*43758.5453;return a-Math.floor(a)};function Je(n){const a=n.range(-1,1),l=n.range(-1,1),y=n.range(0,6.28),f=n.range(0,6.28),u=n.range(.66,.72),P=n.range(.6,.7),A=n.range(4,11)*n.sign(),S=e=>Math.abs((e%1+1)%1-.5)*2-.5,c=(e,r)=>{let h=e<u?Math.sin(Math.PI*.5*Math.pow(e/u,1.25)):1-(1-P)*Math.pow((e-u)/(1-u),1.7);h*=Xe;const b=ge(0,.16,e);return h+=b*(3.2*S(e*2.3+y*r+.3*r)+1.8*S(e*6.1+f*r)),h+=b*2.5*(r>0?a:l)*Math.sin(e*3.1+1),Math.max(h,0)},s=[],x=220;for(let e=0;e<=x;e++){const r=e/x;s.push([c(r,1),-r*xe])}const E=s[s.length-1][0],M=c(1,-1);for(let e=1;e<24;e++){const r=e/24,h=te(E,-M,r);s.push([h,-xe+A*Math.max(0,1-Math.abs(r-.45)*3.2)+2*S(r*2.7+y)])}for(let e=x;e>=1;e--){const r=e/x;s.push([-c(r,-1),-r*xe])}const G=[0];for(let e=1;e<=s.length;e++){const r=s[e-1],h=s[e%s.length];G.push(G[e-1]+Math.hypot(h[0]-r[0],h[1]-r[1]))}const D=G[s.length],d=Math.round(D/2.3),v=[];let q=0;for(let e=0;e<d;e++){const r=e/d*D;for(;G[q+1]<r;)q++;const h=s[q],b=s[(q+1)%s.length],w=(r-G[q])/Math.max(1e-6,G[q+1]-G[q]);let I=te(h[0],b[0],w),N=te(h[1],b[1],w);if(e>2&&e<d-2){const _=I*3.7+N*1.3;I+=($(_)-.5)*1.3,N+=($(_+9.1)-.5)*1.3}v.push({x:I,z:N})}let o=0,m=1e9;v.forEach((e,r)=>{const h=Math.hypot(e.x-T.x,e.z-T.z);h<m&&(m=h,o=r)});let g=0;v[0].s=0,v[0].flank=1;for(let e=1;e<=o;e++)g+=Math.hypot(v[e].x-v[e-1].x,v[e].z-v[e-1].z),v[e].s=g,v[e].flank=1;const z=g;g=0;for(let e=d-1;e>o;e--){const r=v[(e+1)%d];g+=Math.hypot(v[e].x-r.x,v[e].z-r.z),v[e].s=g,v[e].flank=-1}return{pts:v,N:d,iBase:o,L1:z,L2:g,total:D}}class Ue{constructor(){this.pos=[],this.nor=[],this.info=[],this.w=[],this.idx=[],this.n=0}vert(a,l,y,f,u,P,A){return this.pos.push(a.x,a.y,a.z),this.nor.push(l.x,l.y,l.z),this.info.push(y,f,u,P),this.w.push(A),this.n++}quad(a,l,y,f){this.idx.push(a,l,y,l,f,y)}geometry(){const a=new t.BufferGeometry;return a.setAttribute("position",new t.Float32BufferAttribute(this.pos,3)),a.setAttribute("normal",new t.Float32BufferAttribute(this.nor,3)),a.setAttribute("aInfo",new t.Float32BufferAttribute(this.info,4)),a.setAttribute("aW",new t.Float32BufferAttribute(this.w,1)),a.setIndex(this.idx),a}async geometryAsync(a){const l=new t.BufferGeometry;return l.setAttribute("position",new t.Float32BufferAttribute(this.pos,3)),await a(),l.setAttribute("normal",new t.Float32BufferAttribute(this.nor,3)),await a(),l.setAttribute("aInfo",new t.Float32BufferAttribute(this.info,4)),await a(),l.setAttribute("aW",new t.Float32BufferAttribute(this.w,1)),await a(),l.setIndex(this.idx),await a(),l}}function Ve(n,a,l,y,f){const u=n.length;let P=1e9;for(let A=-f;A<=f;A++){const S=n[((y+A)%u+u)%u],c=n[((y+A+1)%u+u)%u],s=c.x-S.x,x=c.z-S.z,E=re(((a-S.x)*s+(l-S.z)*x)/Math.max(1e-6,s*s+x*x),0,1),M=Math.hypot(a-S.x-s*E,l-S.z-x*E);M<P&&(P=M)}return P}async function et(n,a,l,y){const{pts:f,N:u}=n,P=new t.Vector3,A=new t.Vector3,S=new t.Vector3,c=[],s=a.int(7,9);for(let o=0;o<s;o++)c.push(Math.round((o+a.range(.25,.75))/s*u)%u);c.sort((o,m)=>o-m);const x=(o,m,g)=>{const z=m.x-o.x,e=m.z-o.z,r=re(((T.x-o.x)*z+(T.z-o.z)*e)/Math.max(1e-6,z*z+e*e),0,1);return Math.hypot(T.x-o.x-z*r,T.z-o.z-e*r)<g},E=(o,m)=>{const g=f[o],z=re(g.z,-168,-72),e=g.x,r=g.z-z,h=Math.max(.001,Math.hypot(e,r)),b=m*(1-.3*ge(-40,0,g.z));return{x:g.x+e/h*b,z:g.z+r/h*b}},M=[];for(let o=0;o<s;o++){const m=c[o],g=c[(o+1)%s]+(o===s-1?u:0),z=a.int(1,2);M.push({i:m,q:E(m,a.range(62,118))});for(let e=1;e<=z;e++){const r=Math.round(te(m,g,(e+a.range(-.25,.25))/(z+1)));M.push({i:r,q:E(r%u,a.range(70,128))})}}const G=f.map((o,m)=>{let g=M[M.length-1],z=M[0],e=g.i-u,r=z.i;for(let w=0;w<M.length;w++){const I=M[w],N=M[(w+1)%M.length],_=w+1<M.length?N.i:N.i+u;if(m>=I.i&&m<_){g=I,z=N,e=I.i,r=_;break}}const h=(m-e)/Math.max(1,r-e),b=m*.37;return{x:te(g.q.x,z.q.x,h)+($(b)-.5)*1.5,z:te(g.q.z,z.q.z,h)+($(b+4.2)-.5)*1.5}});for(const o of G){const m=o.x-T.x,g=o.z-T.z,z=Math.hypot(m,g);if(z<34){const e=34/Math.max(z,.001);o.x=T.x+m*e,o.z=T.z+g*e}}for(let o=0;o<s;o++){let m=0;for(;m++<12&&x(f[c[o]],G[c[o]],22);)c[o]=(c[o]+9)%u}c.sort((o,m)=>o-m);const D=o=>{let m=0;for(const g of c)o>=g&&m++;return m%s},d=Array.from({length:s},()=>a()),v=async(o,m,g,z,e,r,h)=>{const b=new Float32Array(u*(o+1)*2);for(const w of[1,-1]){const I=l.n;for(let N=0;N<u;N++)for(let _=0;_<=o;_++){_===0&&(N&7)===0&&await y();const V=m(_/o),se=g[N],oe=z(N),H=te(se.x,oe.x,V),X=te(se.z,oe.z,V);U(H,X,P),fe(H,X,A);const p=(N*(o+1)+_)*2;let B,k;w>0?([B,k]=r(H,X,N,V),b[p]=B,b[p+1]=k):(B=b[p],k=b[p+1]),w<0&&(P.addScaledVector(A,-ke),A.multiplyScalar(-1)),l.vert(P,A,B,k,h(N),w,e)}for(let N=0;N<u;N++)for(let _=0;_<o;_++){const V=I+N*(o+1)+_,se=I+(N+1)%u*(o+1)+_;l.quad(V,se,V+1,se+1)}}},q=a();return await v(24,o=>Math.pow(o,1.55),f,o=>({x:0,z:re(f[o].z,-xe+28,-34)}),1,(o,m,g,z)=>{const e=z<=0?0:Ve(f,o,m,g,46);return[e,e]},()=>q),await v(26,o=>{const m=o*o*(3-2*o);return te(o,m,.72)},f,o=>G[o],0,(o,m,g,z)=>{const e=z<=0?0:Ve(f,o,m,g,30),r=z>=1?0:Ve(G,o,m,g,30);return[Math.min(e,r),e]},o=>d[D(o)]),{outer:G,seamCols:c}}const Ce=n=>T.r+.45*Math.sin(3*n+1.3)+.25*Math.sin(7*n+4.1);async function tt(n,a,l,y){const f=[0,.45,1.9,3.6,5.4,7.2,ke],u=new t.Vector3,P=new t.Vector3,A=new t.Vector3,S=new t.Vector3,c=new t.Vector3,s=new t.Vector3,x=new t.Vector3,E=(D,d,v,q,o,m=0,g=0,z=0)=>{const e=D.length,r=[],h=[];for(let b=0;b<e;b++){const w=D[b],I=D[(b+e-1)%e],N=D[(b+1)%e];let _=N.x-I.x,V=N.z-I.z;const se=Math.max(1e-4,Math.hypot(_,V));_/=se,V/=se;const oe=-V*d,H=_*d;h.push([oe,H]);const X=[];for(let p=0;p<f.length;p++){const B=p>0&&p<f.length-1?1:0,k=b*12.9898+p*78.233+o,W=$(k*.31)>.82?-.5*$(k+3.3):0,O=B*(($(k)-.5)*.45+W)+(p===1?-.12:0),C=B*($(k+5.7)-.5)*.5,R=1-m*(f[p]/ke),K=g+(w.x-g)*R,Z=z+(w.z-z)*R;U(K,Z,u),fe(K,Z,P);const J=new t.Vector3(u.x+oe*O+_*C-P.x*f[p],u.y-P.y*f[p],u.z+H*O+V*C-P.z*f[p]);J.nrm=new t.Vector3(oe,.03,H).normalize(),X.push(J)}r.push(X)}for(let b=0;b<e;b++)for(let w=0;w<f.length-1;w++){const I=(b+1)%e;(b+w&1?[[r[b][w],r[I][w],r[I][w+1],w,w,w+1],[r[b][w],r[I][w+1],r[b][w+1],w,w+1,w+1]]:[[r[b][w],r[I][w],r[b][w+1],w,w,w+1],[r[I][w],r[I][w+1],r[b][w+1],w,w+1,w+1]]).forEach((V,se)=>{A.copy(V[0]),S.copy(V[1]),c.copy(V[2]),s.subVectors(S,A).cross(x.subVectors(c,A)),s.lengthSq()<1e-10&&s.set(h[b][0],.1,h[b][1]),s.normalize(),s.x*h[b][0]+s.z*h[b][1]<0&&s.multiplyScalar(-1);const oe=$(b*3.17+w*9.7+se*1.9+o),H=$(b*.71+o),X=l.vert(A,V[0].nrm,f[V[3]],q,oe,H,v),p=l.vert(S,V[1].nrm,f[V[4]],q,oe,H,v),B=l.vert(c,V[2].nrm,f[V[5]],q,oe,H,v);l.idx.push(X,p,B)})}};E(n.pts,1,1,0,0),await y(),E(n.pts,-1,0,0,41),await y(),E(a,1,0,1,97),await y();const M=[],G=44;for(let D=0;D<G;D++){const d=D/G*Math.PI*2,v=Ce(d);M.push({x:T.x+Math.cos(d)*v,z:T.z+Math.sin(d)*v})}E(M,1,0,1,133,.18,T.x,T.z)}async function ot(n,a,l,y,f){const u=[],P=[],A=[],S=[],c=[];let s=0;const x=new t.Vector3,E=new t.Vector3,M=new t.Vector3,G=new t.Vector3,D=new t.Vector3,d=8,v=(p,B)=>{const k=p.length,W=s;for(let C=0;C<k;C++){const R=p[C],K=p[B?(C+k-1)%k:Math.max(0,C-1)],Z=p[B?(C+1)%k:Math.min(k-1,C+1)];U(R.x,R.z,x),fe(R.x,R.z,E),U(K.x,K.z,M),U(Z.x,Z.z,D),M.subVectors(D,M),M.lengthSq()<1e-8&&M.set(0,0,-1),M.normalize(),G.crossVectors(E,M).normalize();for(let J=0;J<=d;J++){const ae=(J/d-.5)*Math.PI;u.push(x.x,x.y,x.z),P.push(E.x,E.y,E.z),A.push(G.x,G.y,G.z),S.push(R.s,R.type,ae,R.r),s++}}const O=B?k:k-1;for(let C=0;C<O;C++)for(let R=0;R<d;R++){const K=W+C*(d+1)+R,Z=W+(C+1)%k*(d+1)+R;c.push(K,Z,K+1,Z,Z+1,K+1)}},{pts:q,N:o,L1:m,L2:g}=n,z=300;v(q.map(p=>({x:p.x,z:p.z,s:p.s/(p.flank>0?m:g)*z,type:1,r:2.5})),!0);let e=0,r=1e9;q.forEach((p,B)=>{const k=Math.hypot(p.x-T.x,p.z-T.z);k<r&&(r=k,e=B)});const h=Math.atan2(q[e].z-T.z,q[e].x-T.x),b=Ce(h)+.7,w=Math.max(1,r-b),I=[],N=Math.max(3,Math.round(w/1.2));for(let p=0;p<=N;p++){const B=p/N,k=Math.sin(B*Math.PI)*($(p*1.7)-.5)*1.6;I.push({x:te(q[e].x,T.x+Math.cos(h)*b,B)-Math.sin(h)*k,z:te(q[e].z,T.z+Math.sin(h)*b,B)+Math.cos(h)*k,s:z+B*w,type:1,r:1.3})}await f(),v(I,!1);const _=[],V=56;for(let p=0;p<V;p++){const B=h+p/V*Math.PI*2,k=Ce(B)+.75,W=Math.min(p,V-p)/V*Math.PI*2*T.r;_.push({x:T.x+Math.cos(B)*k,z:T.z+Math.sin(B)*k,s:z+w+W,type:1,r:1.05})}v(_,!0),await f();const se=z+w+Math.PI*T.r;for(const p of l){const B=q[p],k=a[p],W=Math.hypot(k.x-B.x,k.z-B.z),O=Math.max(4,Math.round(W/2.6)),C=[],R=-(k.z-B.z)/W,K=(k.x-B.x)/W,Z=y.range(1.2,2.6),J=y.range(0,6.28),ae=y.range(2.5,6),le=y.range(.7,1.25);for(let ne=0;ne<=O;ne++){const ie=ne/O,ue=Math.abs((ie*Z+J)%1-.5)*2-.5,ye=Math.sin(ie*Math.PI)*(ae*ue+($(p+ne*.9)-.5)*1.1);C.push({x:te(B.x,k.x,ie)+R*ye,z:te(B.z,k.z,ie)+K*ye,s:ie*W,type:0,r:le*(.85+.3*$(ne*.37+p))*1.45*(.05+.95*ge(0,.09,Math.min(ie,1-ie)))})}v(C,!1),await f()}const oe=(p,B,k,W)=>{let O=1e9;for(let C=0;C<p.length;C++){const R=p[C],K=p[(C+1)%p.length],Z=K.x-R.x,J=K.z-R.z,ae=B*J-k*Z;if(Math.abs(ae)<1e-9)continue;const le=((R.x-ce.x)*J-(R.z-ce.z)*Z)/ae,ne=((R.x-ce.x)*k-(R.z-ce.z)*B)/ae;ne>=0&&ne<=1&&le>W&&le<O&&(O=le)}return O},H=[];await f(),Ae.forEach((p,B)=>{const k=p*Math.PI/180,W=-Math.sin(k),O=Math.cos(k),C=oe(q,W,O,.5),R=oe(a,W,O,C+4);if(C>1e8||R>1e8){H.push(null);return}const K=R-C,Z=Math.max(6,Math.round(K/2.2)),J=[],ae=1.3+1.2*$(B*3.1),le=$(B*7.7),ne=1.5+2.5*$(B*1.9);for(let ie=0;ie<=Z;ie++){const ue=ie/Z,ye=Math.abs((ue*ae+le)%1-.5)*2-.5,Be=Math.sin(ue*Math.PI)*(ne*ye+($(B*5.3+ie*.9)-.5)*.9),Me=te(C,R,ue),Se=1-.45*ge(.08,0,ue);J.push({x:ce.x+W*Me-O*Be,z:ce.z+O*Me+W*Be,s:(1-ue)*K,type:2+B,r:Oe*Se*(.92+.16*$(ie*.37+B))})}v(J,!1),H.push({theta:p,len:K,inner:[ce.x+W*C,ce.z+O*C],outer:[ce.x+W*R,ce.z+O*R]})});const X=new t.BufferGeometry;return X.setAttribute("position",new t.Float32BufferAttribute(u,3)),X.setAttribute("normal",new t.Float32BufferAttribute(P,3)),X.setAttribute("aAcross",new t.Float32BufferAttribute(A,3)),X.setAttribute("aGold",new t.Float32BufferAttribute(S,4)),X.setIndex(c),{geometry:X,LM:z,sTotal:se,linkLen:w,iNear:e,rivers:H}}function at(n,a,l=40){const f=[],u=[];for(let d=0;d<=28;d++)f.push(d/28,-1,d/28,1);for(let d=0;d<28;d++){const v=d*2;u.push(v,v+1,v+2,v+1,v+3,v+2)}const P=new t.InstancedBufferGeometry;P.setAttribute("position",new t.Float32BufferAttribute(new Float32Array(174),3)),P.setAttribute("aT",new t.Float32BufferAttribute(f,2)),P.setIndex(u);const A=[],S=[],c=[],s=new t.Vector3,x=new t.Vector3,{pts:E,N:M}=n;let G=0;const D=d=>d<40?a():$(d*7.31+G++*1.37);for(let d=0;d<l;d++){const v=(z,e)=>z+(e-z)*D(d),q=Math.floor((d<40?(d+v(.15,.85))/40:(d-40+v(.15,.85))/Math.max(1,l-40))*M)%M,o=E[q];U(o.x,o.z,s),fe(o.x,o.z,x);const m=v(.3,1.2),g=v(1.5,7.5);A.push(s.x-x.x*m,s.y-x.y*m,s.z-x.z*m),S.push(s.x-x.x*g,s.y-x.y*g,s.z-x.z*g),c.push(D(d),D(d),D(d),D(d))}return P.setAttribute("aA",new t.InstancedBufferAttribute(new Float32Array(A),3)),P.setAttribute("aB",new t.InstancedBufferAttribute(new Float32Array(S),3)),P.setAttribute("aRnd",new t.InstancedBufferAttribute(new Float32Array(c),4)),P.instanceCount=l,P}function it(n,a,l,y){const f=[],u=[],P=[],A=[],S=new t.Vector3,c=new t.Vector3,{pts:s,N:x,L1:E,L2:M}=n;for(let D=0;D<y;D++){const d=l.int(0,x-1),v=s[d],q=s[(d+1)%x],o=D%10<4?0:D%10<8?1:2;let m=q.x-v.x,g=q.z-v.z;const z=Math.max(1e-4,Math.hypot(m,g));m/=z,g/=z;const e=o===2?l.range(-8,3):l.range(-1.5,1.5);U(v.x-g*e,v.z+m*e,S),fe(v.x,v.z,c),f.push(S.x,S.y,S.z),u.push(c.x,c.y,c.z),P.push(v.s/(v.flank>0?E:M)*a,o,-g,m),A.push(l(),l(),l(),l())}const G=new t.BufferGeometry;return G.setAttribute("position",new t.Float32BufferAttribute(f,3)),G.setAttribute("normal",new t.Float32BufferAttribute(u,3)),G.setAttribute("aDust",new t.Float32BufferAttribute(P,4)),G.setAttribute("aRnd",new t.Float32BufferAttribute(A,4)),G}const _e=`
uniform mat4 uPose;                       // open pose of the Shard; identity once seated, so nothing can drift
vec3 posePoint(vec3 p, float w) { return w > 0.5 ? (uPose * vec4(p, 1.0)).xyz : p; }
vec3 poseDir(vec3 d, float w) { return w > 0.5 ? mat3(uPose) * d : d; }
`,be=`
uniform vec3 uGlowDir, uGlowCol, uFillCol, uPeach, uDeep, uHazeCol, uZenith, uRimSky;   // uDeep: the cloud sea's deeper colour
uniform float uUpLight, uHazeK, uOpen, uTime;
// analytic sky of the brief: dove zenith, paler rim line, one cream afterglow band, peach cloud sea below
vec3 skyCol(vec3 d) {
  float up = clamp(d.y, -1.0, 1.0);
  vec3 c = mix(uRimSky, uZenith, smoothstep(0.0, 0.7, up));
  vec2 dh = d.xz, gh = uGlowDir.xz;
  float az = dot(dh, gh) / max(length(dh) * length(gh), 1e-4);
  float bc = uGlowDir.y * 0.56, bu = (up - bc) / 0.034;                 // the band hugs the rim line: above it the sky is deep, so what stands up into it (the Shard) is drawn against the dark
  float band = smoothstep(0.3, 1.0, az) * (exp(-bu * bu) + 0.16 * exp(-abs(up - bc) * 12.0));
  c = mix(c, mix(uPeach, uDeep, 0.4) * 0.85, clamp(band * 0.85, 0.0, 1.0)) + uGlowCol * 0.12 * band;   // the afterglow: a warm band low on the sky, never a white haze
  vec3 below = mix(uPeach * 0.95, uDeep * 0.9, (1.0 - smoothstep(-0.9, 0.0, up)));
  return mix(c, below, (1.0 - smoothstep(-0.06, 0.03, up)));
}
vec3 haze(vec3 c, float dist) { return mix(c, uHazeCol, 1.0 - exp(-dist * uHazeK)); }
// THE KEY: the afterglow rakes the bowl, so the side turned toward it is lit celadon and the side turned away falls to
// dark jade. The bowl is shallow, so its lean is exaggerated (uBowlEx) to give the light something to grade across.
uniform float uBowlEx, uPool, uShade;
float litK(vec3 N) {
  vec3 Ne = normalize(vec3(N.x * uBowlEx, N.y, N.z * uBowlEx) + vec3(0.0, 1e-4, 0.0));
  float ndl = dot(Ne, uGlowDir);
  return mix(uShade, 1.0, smoothstep(-0.3, 0.85, ndl));
}
vec3 softCap(vec3 c, vec3 cap) { return cap * (vec3(1.0) - exp(-c / max(cap, vec3(1e-3)))); }
float hash21(vec2 p) { p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
vec2 hash22(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}
vec3 hash33(vec3 p) { p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
// Broken fired clay: shell-shaped chips. Nearest of a jittered 3D lattice gives each chip its own tilt (xyz, -0.5..0.5)
// and w = how far inside the chip we are (0 at its edge). No derivatives, no textures: safe inside the loop.
vec4 chips(vec3 q) {
  vec3 ip = floor(q), fp = fract(q), best = vec3(0.0); float f1 = 9.0, f2 = 9.0;
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec3 g = vec3(float(i), float(j), float(k)), o = hash33(ip + g), d = g + o - fp; float dd = dot(d, d);
    if (dd < f1) { f2 = f1; f1 = dd; best = d; } else if (dd < f2) { f2 = dd; }
  }
  return vec4(best, sqrt(max(f2, 0.0)) - sqrt(max(f1, 0.0)));          // xyz: from here to the middle of this chip
}
// Biscuit albedo and chipped normal in wall coordinates q (metres, seated), depth down the wall, fw = metres per pixel.
vec3 biscuitN(vec3 N, vec3 q, float fw, out float lipK, out float edgeK) {
  float f1 = 1.0 - smoothstep(0.25, 0.9, fw / 1.3), f2 = 1.0 - smoothstep(0.2, 0.7, fw / 0.34);
  vec3 qs = q * vec3(1.0, 1.8, 1.0) + 0.5 * vec3(vnoise(q.xz * 0.7), 0.0, vnoise(q.zx * 0.7 + 9.0));      // shells lie wider than tall, and never in rows
  vec4 c1 = chips(qs / 1.9 + 3.7), c2 = f2 > 0.01 ? chips(qs / 0.42 + 11.0) : vec4(0.0, 0.0, 0.0, 1.0);
  vec4 c0 = chips(qs / 4.7 + 1.3);                                    // the big scoops: a quarter of the wall's height, seen from far off
  float big = step(0.42, hash33(floor(qs / 4.7 + 1.3) + 5.0).x);     // only some of the wall broke that way
  vec3 tl = c1.xyz * 0.95 * f1 + c2.xyz * 0.6 * f2 + c0.xyz * 0.75 * big;                  // each chip is a shallow scoop: its wall leans toward its middle, with a sharp lip where two meet
  tl -= N * dot(tl, N);
  edgeK = max((1.0 - smoothstep(0.0, 0.05 + fw * 0.4, c1.w)) * f1 * step(0.55, c1.x + 0.5), (1.0 - smoothstep(0.0, 0.08 + fw * 1.5, c2.w)) * f2 * 0.5 * step(0.6, c2.x + 0.5));   // only some chips have a dark crack at their edge
  vec3 Nc = normalize(N + tl);
  lipK = clamp(Nc.y - N.y, -1.0, 1.0);
  return Nc;
}
// Fired clay in section: sandy grain, darker strata running the wall's length, iron specks, chips whose upper lips
// catch the sky and whose undersides take the peach of the cloud sea, deepening toward the bottom of the wall.
uniform vec3 uBiscuit;
vec3 biscuitShade(vec3 N, vec3 Nb, vec2 gp, float depth, float fw, float open, float lipK, float edgeK, float fh) {
  float g0 = vnoise(gp * 0.45), g1 = vnoise(gp * 3.3), g2 = vnoise(gp * 26.0) * (1.0 - smoothstep(0.012, 0.04, fw)), g3 = vnoise(gp * 9.0) * (1.0 - smoothstep(0.03, 0.12, fw));
  float sy = depth + 0.5 * g0 + 0.12 * g1;
  float strata = (1.0 - smoothstep(0.07, 0.22, abs(sy - 2.6))) + 0.8 * (1.0 - smoothstep(0.06, 0.18, abs(sy - 5.3))) + 0.7 * (1.0 - smoothstep(0.05, 0.16, abs(sy - 7.4)));
  strata *= 1.0 - smoothstep(0.14, 0.7, fw);
  float speck = step(0.88, vnoise(gp * 11.0)) * (1.0 - smoothstep(0.03, 0.1, fw));
  // THE LIGHT is capped first (the up-light is several times white, and a cap laid over the finished colour would
  // press every layer of the clay into one orange); the clay's own markings are multiplied in afterwards
  vec3 alb = uBiscuit * 0.72;
  float fd = Nb.y * 0.5 + 0.5;
  vec3 col = alb * (uGlowCol * 1.15 * litK(Nb) + uFillCol * (0.25 + 0.75 * fd * fd) * 1.1);
  float dk = clamp(depth / 9.0, 0.0, 1.6), dkc = clamp(dk, 0.0, 1.0);
  float upl = (0.3 + 0.75 * smoothstep(-0.25, 0.75, -Nb.y + 0.25) + 0.55 * dk) * open;      // the lower wall takes the light from below
  col = col * (1.0 - 0.35 * open) + alb * mix(uPeach, uDeep, 0.35 + 0.5 * dkc) * uUpLight * upl * 0.9;
  col = softCap(col, mix(vec3(1.05, 0.98, 0.92), mix(uPeach, uDeep, 0.75) * 0.9, clamp(open, 0.0, 1.0)));
  vec3 rel = vec3(0.84 + 0.13 * g1 + 0.14 * g2 + 0.1 * g3 + 0.06 * (fh - 0.5) - 0.06 * sin(sy * 2.3));
  rel *= 1.0 - 0.38 * clamp(strata, 0.0, 1.0);                        // darker strata running the wall's length
  rel = mix(rel, rel * vec3(0.55, 0.36, 0.28), speck * 0.8);           // iron specks
  rel *= mix(vec3(1.0), vec3(0.9, 0.96, 0.88), g0 * 0.6);
  rel *= 1.0 - 0.14 * edgeK;                                           // the crack between two chips
  rel *= mix(vec3(1.12, 1.1, 1.06), vec3(0.82, 0.68, 0.58), dkc * (0.4 + 0.6 * open));   // pale under the glass line, deep peach at the foot
  rel *= clamp(1.0 - 1.3 * lipK * open + 0.7 * lipK * (1.0 - open), 0.5, 1.5);          // a scoop's underside takes the peach, its upper lip loses it
  col = col * rel + alb * uFillCol * 0.6 * max(lipK, 0.0);             // and the upper lip catches the cooler sky
  return min(col, vec3(0.94));
}
`,st=`
attribute vec4 aInfo; attribute float aW;
varying vec3 vPos, vN, vTx, vTz, vSeat; varying vec4 vInfo; varying float vW;
${_e}
#include <common>
#include <fog_pars_vertex>
void main() {
  vec3 n0 = normal;
  // the glazed top surface this vertex belongs to (undersides sit 9 m down the normal)
  vSeat = aInfo.w < 0.0 ? position - n0 * ${ke.toFixed(1)} : position;
  vec3 up = aInfo.w < 0.0 ? -n0 : n0;
  vec3 tx = normalize(vec3(1.0, 0.0, 0.0) - up * up.x), tz = normalize(vec3(0.0, 0.0, 1.0) - up * up.z);
  mat3 m3 = mat3(modelMatrix);
  vN = normalize(m3 * poseDir(n0, aW)); vTx = normalize(m3 * poseDir(tx, aW)); vTz = normalize(m3 * poseDir(tz, aW));
  vec4 wp = modelMatrix * vec4(posePoint(position, aW), 1.0);
  vPos = wp.xyz; vInfo = aInfo; vW = aW;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,He=`
const float PET_R0 = 604.0, PET_R1 = 776.0, PET_DA = 0.0418;
uniform float uCarve;                     // 1 on the bare visits: the lower wall is carved too
// one carved lotus petal band: v 0..1 from root to tip across the band, u = angle in petal widths
float petalH(float v, float u, float ring, float fine) {
  float uc = fract(u) - 0.5;
  float tip = clamp((v - 0.62) / 0.38, 0.0, 1.0);
  float hw = 0.46 * sqrt(max(1.0 - tip * tip, 0.0)) * (1.0 - 0.42 * tip * tip) * smoothstep(-0.02, 0.1, v) * (0.72 + 0.28 * smoothstep(0.0, 0.45, v));
  float e = hw - abs(uc);                                           // + inside the petal (petal widths)
  float inside = smoothstep(0.0, 0.07, e);
  float body = inside * (0.16 + 0.2 * smoothstep(0.0, 0.3, e));     // a low dome
  float groove = exp(-e * e / 0.0011) * step(0.0, v) * step(v, 1.0); // the knife cut round each petal
  float rib = exp(-uc * uc / 0.0007) * inside;
  float comb = (0.5 + 0.5 * cos(6.2831853 * (uc * 9.0 + 0.3 * sin(v * 5.0)))) * inside * smoothstep(0.02, 0.12, e) * fine * (0.4 + 0.6 * smoothstep(0.05, 0.8, v));
  return -0.03 * ring * fine * inside + body - 0.42 * groove + 0.13 * rib - 0.1 * comb;   // carving cuts most of the throwing rings away
}
const float REG_H = 0.5;                  // how deep the register under the gap is cut, against the petal band's own depth
// the lappets lie where the glaze has little to spare over what shows under it, so nothing of a lappet stands proud:
// a lappet is its knife cut alone, an incised outline, and the wall inside it is the wall as it was
// the knife cut alone, round the same outline as petalH draws: negative metres, the band's own depth
float petalCut(float v, float u) {
  float uc = fract(u) - 0.5, tip = clamp((v - 0.62) / 0.38, 0.0, 1.0);
  float e = 0.46 * sqrt(max(1.0 - tip * tip, 0.0)) * (1.0 - 0.42 * tip * tip) * smoothstep(-0.02, 0.1, v) * (0.72 + 0.28 * smoothstep(0.0, 0.45, v)) - abs(uc);
  return -0.42 * exp(-e * e / 0.0011) * step(0.0, v) * step(v, 1.0);
}
float relief(vec2 p, float fine) {
  float r = length(p), a = atan(p.x, max(p.y, 1.0));
  float ring = sin(6.2831853 * (r / 6.0) + a);                        // throwing rings, one spiral, 6 m pitch
  float h = 0.03 * ring * fine * (0.35 + 0.65 * sin(r * 0.037 + 2.0 * sin(a * 9.0)) * sin(r * 0.037 + 2.0 * sin(a * 9.0))) + 0.03 * sin(r * 0.21 + 1.3 + 3.0 * sin(a * 5.0 + r * 0.011));   // a broad swell, wandering so it never reads as even bands
  float v = (r - PET_R0) / (PET_R1 - PET_R0);
  if (v > -0.05 && v < 1.05) h += petalH(v, a / PET_DA, ring, fine);
  // the well of the bowl carries its own ring of forty petals round the centre (the low pass crosses it)
  float v2 = (r - 94.0) / 102.0;
  if (v2 > -0.05 && v2 < 1.05) h += petalH(v2, atan(p.x, p.y) / 0.15707963 + 0.5, ring, fine);
  float v4 = (r - 285.0) / 155.0;                                     // the bare ware: thirty-six great petals round the lower wall
  if (uCarve > 0.5 && v4 > -0.05 && v4 < 1.05) h += petalH(v4, atan(p.x, p.y) / 0.17453293 + 0.25, ring, fine);
  float v3 = (r - 26.0) / 60.0;                                       // and a heart of sixteen: a double lotus under the crossing
  if (v3 > -0.05 && v3 < 1.05) h += petalH(v3, atan(p.x, p.y) / 0.39269908, ring, fine);
  // lappets under the rim: 132 carved petals hanging tip down on the plain wall between the petal band and the rim
  float v5 = (950.0 - r) / 104.0;
  if (v5 > -0.05 && v5 < 1.05) h += petalCut(v5, atan(p.x, p.y) / 0.04759989);   // the knife cut of the band's full depth, nothing inside it
  // and a register of 180 forty-metre petals below the gap, their tips 4 m short of the Shard's own
  float v6 = (r - 496.0) / 40.0;
  if (v6 > -0.05 && v6 < 1.05) h += REG_H * petalH(v6, atan(p.x, p.y) / 0.03490659 + 0.5, 0.0, fine);
  return h;
}`,Re=`
precision highp float;
varying vec3 vPos, vN, vTx, vTz, vSeat; varying vec4 vInfo; varying float vW;
uniform vec3 uCopper, uCrackCol, uAbsorb, uMilk, uPig;
uniform float uCraze, uFishScale, uRare, uPigMix;
${be}
${He}
#include <fog_pars_fragment>
// F2 - F1 of a jittered lattice: thin where two crackle cells meet. No derivatives in here.
vec2 crackle(vec2 p) {
  vec2 ip = floor(p), fp = fract(p); float f1 = 9.0, f2 = 9.0, id = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)), o = hash22(ip + g), d = g + o - fp; float dd = dot(d, d);
    if (dd < f1) { f2 = f1; f1 = dd; id = hash21(ip + g + 7.3); } else if (dd < f2) { f2 = dd; }
  }
  return vec2(sqrt(max(f2, 0.0)) - sqrt(max(f1, 0.0)), id);
}
// copper-red brush dabs living under the glaze: round head, comma tail. q in metres (along shoal flow, across)
vec2 fish(vec2 q, float t) {
  vec2 cell = floor(q / 6.0), f = q / 6.0 - cell; vec2 m = vec2(0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)), c = cell + g, h = hash22(c + 3.1);
    float present = step(0.36, hash21(c * 1.7 + 11.0));
    vec2 ctr = g + 0.2 + 0.6 * h + 0.06 * vec2(sin(t * 0.7 + h.x * 40.0), cos(t * 0.9 + h.y * 40.0));
    vec2 d = (f - ctr) * 6.0;                                   // metres from this fish
    float len = 1.3 + 1.2 * h.y, ang = (h.x - 0.5) * 0.9 + 0.25 * sin(t * 0.5 + h.y * 20.0);
    float ca = cos(ang), sa = sin(ang);
    vec2 l = vec2(ca * d.x + sa * d.y, -sa * d.x + ca * d.y) / len;   // x along the body (head at +0.3), unit = body length
    float bend = 0.16 * sin(l.x * 4.0 - t * 3.2 + h.x * 30.0) * (1.0 - smoothstep(-0.6, 0.25, l.x));
    float w = 0.27 * smoothstep(-0.72, 0.18, l.x) + 0.03 * (1.0 - smoothstep(-0.7, -0.35, l.x)) * smoothstep(-0.78, -0.7, l.x) * 3.0;
    float ay = abs(l.y - bend), ends = smoothstep(-0.82, -0.7, l.x) * (1.0 - step(0.28, l.x));
    float hd = length(vec2(l.x - 0.28, l.y - bend));              // the head: one round press of the brush
    float body = max((1.0 - smoothstep(w - 0.13, w + 0.03, ay)) * ends, 1.0 - smoothstep(0.07, 0.23, hd));
    float halo = max((1.0 - smoothstep(w - 0.05, w + 0.22, ay)) * ends, 1.0 - smoothstep(0.15, 0.42, hd));
    m = max(m, vec2(body, halo) * present);
  }
  return m;
}
void main() {
  float side = vInfo.w, top = step(0.0, side), skin = max(top, step(0.5, vW));   // the Shard is glazed and carved on both faces (a bowl's inside and outside)
  vec3 V = normalize(cameraPosition - vPos + vec3(0.0, 1e-4, 0.0));
  vec3 N0 = normalize(vN);
  float nv0 = dot(N0, V);
  // the chip: a round spall that stays open
  vec2 cq = vSeat.xz - vec2(${T.x.toFixed(1)}, ${T.z.toFixed(1)}); float cr = length(cq);
  float cth = cr > 0.01 ? atan(cq.y, cq.x) : 0.0;
  float crim = ${T.r.toFixed(2)} + 0.45 * sin(3.0 * cth + 1.3) + 0.25 * sin(7.0 * cth + 4.1);
  float dChip = cr - crim * mix(0.82, 1.0, top);
  if (vW < 0.5 && dChip < 0.0) discard;
  float d = min(vInfo.x, mix(dChip, 1e3, step(0.5, vW)));
  float lipD = vInfo.y;
  // unrolled bowl position and the parallax of what lies under the glass
  vec2 pw = vec2(-vSeat.x, ${ze.toFixed(1)} - vSeat.z);
  vec3 Tx = normalize(vTx), Tz = normalize(vTz);
  vec2 par = vec2(dot(V, Tx), dot(V, Tz)) / max(abs(nv0), 0.35);     // local xz slide per metre of depth
  float fw = max(length(fwidth(pw)), 1e-4);
  float fine = skin * (1.0 - smoothstep(0.25, 0.9, fw * 0.33)) * (0.25 + 0.75 * smoothstep(0.12, 0.55, abs(nv0)));   // rings and combing soften at grazing angles
  float h0 = relief(pw, fine) * skin;
  float e = clamp(fw * 1.2, 0.3, 4.0);
  float hx = relief(pw + vec2(e, 0.0), fine) * skin, hz = relief(pw + vec2(0.0, e), fine) * skin;
  vec2 grad = vec2(hx - h0, hz - h0) / e;                             // in pw axes = minus local axes
  vec3 N = normalize(N0 + (Tx * grad.x + Tz * grad.y) * 1.6);
  float nv = max(dot(N, V), 0.0);
  // glaze thickness: pools in grooves and ring troughs, runs out at every rim and break
  float tint = vInfo.z;
  float run = 0.16 * (1.0 - smoothstep(540.0, 800.0, length(pw))) + 0.2 * (vnoise(pw * 0.013 + tint * 9.0) - 0.5);   // glaze ran downhill before it set
  float t = clamp(0.46 - 1.6 * h0 + run + (tint - 0.5) * 0.14 + 0.07 * (vnoise(pw * 0.045) - 0.5), 0.1, 1.4) * smoothstep(0.0, 2.5, d);
  t += 0.5 * exp(-max(dChip, 0.0) / 15.0) * (1.0 - step(0.5, vW)) * smoothstep(0.0, 2.5, d);   // glaze ran thick round the spall: dim jade behind the portal
  float rOut = length(pw);
  t = mix(t, (0.6 + 0.3 * (vnoise(pw * 0.035) - 0.5) + 0.07 * sin(rOut * 1.0472)) * smoothstep(0.0, 2.5, d), 1.0 - skin);   // the outside of the bowl: plain, ring-marked
  float ta = min(t * (1.0 + uPool * smoothstep(0.5, 1.2, t)), 1.75);        // pooled glaze goes deep: dark jade in every groove and hollow
  vec3 base = uBiscuit * exp(-ta * uAbsorb / max(nv, 0.6));
  base = mix(base, uMilk * (0.82 + 0.3 * exp(-t * 1.2)), 0.14 * smoothstep(0.05, 0.4, t) * (1.0 - smoothstep(0.6, 1.1, t)));   // bubbles in the glass: celadon is milky where it lies thin
  // the rare visit: the Shard comes from another bowl, white porcelain painted in cobalt wave scales
  float rareK = uRare * step(0.5, vW);
  if (rareK > 0.5) {
    vec3 white = vec3(0.8, 0.83, 0.86) * exp(-t * vec3(0.3, 0.18, 0.08));
    vec2 pb = pw + vec2(dot(V, Tx), dot(V, Tz)) / max(abs(nv0), 0.35) * 0.4;
    float rb = length(pb), ab = atan(pb.x, max(pb.y, 1.0));
    vec2 sc = vec2(ab * 660.0, rb) / 13.0; float odd = mod(floor(sc.y), 2.0);
    vec2 cf = vec2(fract(sc.x + 0.5 * odd) - 0.5, fract(sc.y));
    float rad = length(cf), fwb = clamp(fw / 13.0, 0.0, 0.2);
    float arcs = (1.0 - smoothstep(0.07, 0.11 + fwb * 3.0, abs(fract(rad * 2.6) - 0.5))) * step(rad, 0.86);
    float wash = smoothstep(0.35, 0.75, vnoise(pb * 0.05 + 3.0)) * 0.45 + 0.25 * (1.0 - smoothstep(0.0, 0.3, rad));
    float bandB = 1.0 - smoothstep(1.2, 2.0, abs(d - 6.0));                       // a painted line 6 m inside the break
    float m = clamp(max(arcs * 0.9, bandB) + wash * 0.5, 0.0, 1.0) * smoothstep(0.12, 0.3, t);
    base = mix(white, vec3(0.045, 0.11, 0.4) * (0.65 + 0.5 * white), m * 0.88);
  }
  // under-glaze layers (multiplies), each at its own depth so they slide against each other
  float under = smoothstep(0.12, 0.3, t);
  vec2 pF = pw + par * 0.5, pC1 = pw + par * 0.3, pC2 = pw + par * 0.12;
  float rr = length(pF), aa = atan(pF.x, max(pF.y, 1.0)), band = floor(rr / 42.0);
  float dirn = mod(band, 2.0) * 2.0 - 1.0;
  vec2 q = vec2(aa * 660.0 + dirn * (uTime * (0.7 + 0.5 * hash21(vec2(band, 3.0)))), rr + 1.5 * sin(aa * 90.0 + uTime * 0.2));
  float shoal = smoothstep(0.37, 0.53, vnoise(q * 0.021 + vec2(band * 3.7, uTime * 0.01)));
  float fishFade = skin * under * (1.0 - smoothstep(0.12, 0.4, fw));
  float fm = 0.0;
  if (fishFade > 0.01 && shoal > 0.01) {
    vec2 qf = q * vec2(1.0, 0.62) / uFishScale;
    vec2 f2 = fish(qf, uTime);
    if (fw < 0.5) f2 = max(f2, fish(qf * 1.31 + vec2(17.3, 41.9), uTime + 3.0));
    f2 *= shoal * fishFade * (1.0 - rareK); fm = f2.x;
    base *= mix(vec3(1.0), vec3(0.84, 0.96, 0.88), f2.y * 0.6);          // the copper bled a little green round each dab
  }
  base = mix(base, mix(base * uCopper * 0.92 + uCopper * vec3(0.07, 0.01, 0.0), uPig * (0.55 + 0.6 * dot(base, vec3(0.3, 0.5, 0.2))), uPigMix), fm * 0.8);   // pigment, not only a multiply: a dab stays copper red on a dark ware
  float crazeOn = smoothstep(0.0, 0.22, uCraze * 0.9 + 0.27 - vnoise(pw * 0.017 + 5.0));
  vec2 warp = (vec2(vnoise(pw * 0.31), vnoise(pw * 0.31 + 37.0)) - 0.5) * 1.5;
  float cf1 = 1.0 - smoothstep(0.2, 0.7, fw / 1.6), cf2 = 1.0 - smoothstep(0.1, 0.36, fw / 0.45);
  vec2 c1 = cf1 > 0.01 ? crackle((pC1 + warp) / 1.9) : vec2(1.0, 0.0);
  float line1 = (1.0 - smoothstep(0.006, 0.018 + fw * 0.55, c1.x)) * cf1;
  float line2 = 0.0;
  if (cf2 > 0.01) { vec2 c2 = crackle((pC2 + warp * 0.6) / 0.45 + 17.0); line2 = (1.0 - smoothstep(0.02, 0.05 + fw * 1.0, c2.x)) * cf2 * 0.4; }
  base *= mix(vec3(1.0), uCrackCol, clamp(line1 * 0.6 + line2 * step(c1.y, 0.45), 0.0, 1.0) * under * crazeOn);
  // light: wrapped diffuse from the afterglow and the dove fill; nothing falls below deep jade
  float kd = dot(N, uGlowDir) * 0.5 + 0.5, fd = N.y * 0.5 + 0.5;
  vec3 light = uGlowCol * 1.2 * (litK(N) - uShade * 0.85) + uFillCol * (0.3 + 0.7 * fd * fd) * 1.2;   // the shaded side keeps only the sky's cool fill
  vec3 col = base * light;
  // peach up-light: only a 3 m lip beside an open crack, and the undersides of what hangs
  float lip = (exp(-lipD / 3.0) + 0.3 * exp(-lipD / 16.0)) * uOpen * top + exp(-max(dChip, 0.0) / 2.5) * (1.0 - step(0.5, vW)) * 0.8;
  float lidUnder = (1.0 - top) * vW;
  col += base * mix(uPeach, uDeep, 0.3) * 1.1 * uUpLight * (0.3 * lip + (1.0 - top) * (1.0 - vW) * (0.16 + 0.2 * max(-N.y, 0.0)));
  // THE LID'S FACE. Its underside hangs over the gap, so the light of the cloud sea climbs it from the hinge: deep peach
  // beside the base edge, cooling through cream to carved, green-pooled celadon at the tip; the light rakes along the
  // face, so every petal groove and comb line has a lit side and a shaded side.
  float gT = smoothstep(-236.0, -24.0, vSeat.z);                          // 0 at the hinge (base edge), 1 at the tip
  float fall = 0.05 + 0.95 * (1.0 - smoothstep(0.04, 0.8, gT));
  float rake = clamp(dot(N, normalize(-Tz * 0.9 + N0 * 0.5)), 0.0, 1.0);
  float lumB = dot(base, vec3(0.3, 0.5, 0.2));
  vec3 dp = max(mix(vec3(dot(uDeep, vec3(0.3, 0.5, 0.2))), uDeep, 1.28), vec3(0.0));     // the cloud sea's deep colour, pushed: the tone map pales it again
  vec3 lidCol = base * uFillCol * 1.5 * (0.55 + 0.45 * smoothstep(0.1, 0.6, rake)) * (1.0 - 0.9 * fall)
    + softCap(mix(base, vec3(lumB), 0.5) * mix(dp, uPeach, 0.8 * gT) * uUpLight * fall * (0.22 + 1.5 * rake) * (0.4 + 0.6 * uOpen) * 0.92, mix(dp, uPeach, 0.15 + 0.55 * gT) * 0.95);   // it saturates to peach, never to cream
  lidCol *= 0.86 + 0.28 * vnoise(vSeat.xz * 0.035 + vec2(uTime * 0.3, -uTime * 0.2));   // the light of the rolling cloud tops drifts across the face
  col += lidCol * lidUnder * (0.35 + 0.65 * uOpen);
  col = max(col, uBiscuit * exp(-1.75 * uAbsorb) * 0.34);                 // the deepest pool is ink green, never black
  // a dab is pigment: on a wall that takes only the fill it keeps its own copper red, never a stain darker than the glaze round it
  col = mix(col, max(col, uPig * (0.3 + dot(uFillCol, vec3(0.33)))), clamp(fm * 1.15, 0.0, 1.0) * top);
  // wet surface: Fresnel sky and the one broad highlight
  vec3 R = reflect(-V, normalize(mix(N0, N, 0.25 + 0.6 * smoothstep(0.15, 0.6, abs(nv0))))); float fres = 0.04 + 0.96 * pow(clamp(1.0 - nv, 0.0, 1.0), 5.0);
  vec3 sk = min(skyCol(R), vec3(1.1));
  col = mix(col, sk, clamp(fres, 0.0, 1.0) * 0.5 * (1.0 - 0.6 * fm));
  float hl = max(dot(R, uGlowDir), 0.0); float hl2 = hl * hl; hl2 *= hl2; hl2 *= hl2; hl2 *= hl2 * hl2 * hl;   // ~ ^25
  col = min(col, vec3(0.86));
  col += uGlowCol * 0.2 * hl2 * (0.8 + 0.4 * vnoise(pw * 0.35));      // the one long wet highlight
  col = haze(min(col, vec3(0.97)), length(cameraPosition - vPos));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,nt=`
attribute vec4 aInfo; attribute float aW;
varying vec3 vPos, vN, vSeat; varying vec4 vInfo; varying float vW;
${_e}
#include <fog_pars_vertex>
void main() {
  vN = normalize(mat3(modelMatrix) * poseDir(normal, aW));
  vec4 wp = modelMatrix * vec4(posePoint(position, aW), 1.0);
  vPos = wp.xyz; vSeat = position; vInfo = aInfo; vW = aW;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,lt=`
precision highp float;
varying vec3 vPos, vN, vSeat; varying vec4 vInfo; varying float vW;
uniform vec3 uGlass;
${be}
#include <fog_pars_fragment>
void main() {
  vec3 N = normalize(vN), V = normalize(cameraPosition - vPos + vec3(0.0, 1e-4, 0.0));
  float depth = vInfo.x, open = mix(uOpen, 1.0, step(0.5, vInfo.y));
  vec2 gp = vSeat.xz * 0.9 + vSeat.y * vec2(0.63, -0.41);
  float fw = max(length(fwidth(gp)), 1e-4);
  float lipK, edgeK; vec3 Nb = N;
  N = biscuitN(Nb, vSeat, fw, lipK, edgeK);
  vec3 col = biscuitShade(N, Nb, gp, depth, fw, open, lipK, edgeK, vInfo.z);
  // the glaze seen in section: a green glass line in the top 0.35 m
  float glassLine = 1.0 - smoothstep(0.42, 0.55 + fw * 0.3, depth);
  vec3 R = reflect(-V, N);
  vec3 glass = uGlass * (0.3 + 0.22 * vnoise(gp * 3.3)) * (uFillCol * 1.3 + uGlowCol * 0.6 * litK(Nb)) + skyCol(R) * 0.05 + uGlass * uPeach * uUpLight * 0.05 * open;
  col = mix(col, min(glass, vec3(0.5)), glassLine);                    // green glass, darker than the clay it lies on
  col = haze(col, length(cameraPosition - vPos));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,rt=`
attribute vec3 aAcross; attribute vec4 aGold;
uniform float uFront, uCool, uU; uniform vec2 uRes;
uniform vec2 uRiv[${Ae.length}];                               // per river: (u at which its gold reaches the collar, metres per unit of u)
varying vec3 vPos, vN, vT, vA; varying vec4 vG;    // vG = (s, across metres, heat, crown)
#include <fog_pars_vertex>
void main() {
  float s = aGold.x, kind = aGold.y, phi = aGold.z, baseR = aGold.w;
  float live = kind > 0.5 && kind < 1.5 ? 1.0 : 0.0, river = step(1.5, kind);
  vec2 rw = uRiv[int(clamp(kind - 2.0, 0.0, ${(Ae.length-1).toFixed(1)}) + 0.5)];
  float front = mix(uFront, (uU - rw.x) * rw.y, river), behind = front - s, on = mix(step(0.01, uFront), step(0.01, front), river);
  float flowing = max(live, river);
  float grow = mix(1.0, 1.0 - smoothstep(front - 6.0, front, s), flowing) * mix(1.0, on, flowing);
  float crown = flowing * exp(-behind * behind / 9.0) * on;
  float tail = river > 0.5 ? 55.0 : (s > 300.5 ? 24.0 : 700.0);   // the fresh seam stays hot for a hundred metres and more; the chip's rim sets quickly
  float heat = flowing * (behind > 0.0 ? exp(-behind / tail) : 0.0) * mix(1.0 - uCool, 1.0 - smoothstep(0.05, 0.16, uU - rw.x), river);
  float rad = baseR * grow * (1.0 + 1.55 * crown);
  float pxm = distance(cameraPosition, (modelMatrix * vec4(position, 1.0)).xyz) * 2.0 / max(projectionMatrix[1][1] * uRes.y, 1.0);
  rad = max(rad, 1.6 * pxm * grow);                                   // a far seam holds three pixels: mended with gold reads from across the bowl
  float sp = sin(phi), cp = cos(phi);
  vec3 p = position + aAcross * sp * rad + normal * (cp * rad * (0.5 + 0.25 * crown) - 0.05);
  vec3 n = normalize(aAcross * sp * 0.55 + normal * cp + normal * 0.02);
  mat3 m3 = mat3(modelMatrix);
  vN = normalize(m3 * n); vA = normalize(m3 * aAcross); vT = normalize(m3 * cross(normal, aAcross));
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vPos = wp.xyz; vG = vec4(s, sp * baseR, heat, crown);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ke=`
precision highp float;
varying vec3 vPos, vN, vT, vA; varying vec4 vG;
uniform vec3 uF0, uEmber, uGoldWarm; uniform float uGoldLift;
${be}
#include <fog_pars_fragment>
float surf(vec2 p, float heat) {
  float molten = vnoise(vec2(p.x * 0.55 - uTime * 2.2, p.y * 1.5)) + 0.5 * vnoise(vec2(p.x * 1.3 - uTime * 4.0, p.y * 3.1));
  float ridges = 0.13 * sin(p.x * 9.0 + 5.0 * vnoise(p * 0.8)) + 0.6 * vnoise(p * vec2(1.1, 2.6)) + 0.25 * vnoise(p * vec2(4.0, 7.0));   // set: fine cross ridges
  return mix(ridges, molten, clamp(heat * 1.4, 0.0, 1.0));
}
void main() {
  vec3 V = normalize(cameraPosition - vPos + vec3(0.0, 1e-4, 0.0));
  vec2 p = vG.xy; float heat = vG.z, crown = vG.w;
  float fw = max(length(fwidth(p)), 1e-4), det = 1.0 - smoothstep(0.15, 0.6, fw);
  float h0 = surf(p, heat), hx = surf(p + vec2(0.12, 0.0), heat), hy = surf(p + vec2(0.0, 0.12), heat);
  vec3 N = normalize(normalize(vN) - (normalize(vT) * (hx - h0) + normalize(vA) * (hy - h0)) * mix(0.75, 1.5, clamp(heat * 1.4, 0.0, 1.0)) * det);
  // sparkle: 0.25 m cells, each a tiny facet with its own tilt
  vec2 sc = floor(p / 0.25); vec2 sh = hash22(sc) - 0.5;
  float glint = 1.0 - smoothstep(0.05, 0.3, length(fract(p / 0.25) - 0.5 - sh * 0.35));   // a round glint inside each cell
  vec3 Ns = normalize(N + (normalize(vT) * sh.x + normalize(vA) * sh.y) * 0.9);
  vec3 R = reflect(-V, N), Rs = reflect(-V, Ns);
  float nv = max(dot(N, V), 0.0);
  vec3 F = uF0 + (vec3(1.0) - uF0) * pow(clamp(1.0 - nv, 0.0, 1.0), 5.0);
  vec3 Re = vec3(R.x, abs(R.y) * 0.8 + 0.04, R.z);                     // the bowl hides the cloud sea from its own seams
  vec3 sk = mix(skyCol(Re), uZenith * vec3(0.5, 0.62, 0.5), 1.0 - smoothstep(-0.25, 0.1, R.y)); sk = mix(sk, vec3(dot(sk, vec3(0.3, 0.5, 0.2))) * uGoldWarm, 0.6);   // gold warms what it mirrors
  float occ = 0.5 + 0.5 * clamp(h0 * 0.9, 0.0, 1.0);                                     // troughs between ridges stay dark
  // METAL: a dark body (it mirrors the dim bowl) and one tight bright streak along the crest, which is the whole
  // pale rim of the sky seen in the half-round: it follows the eye, so every seam has it from every side
  vec3 col = (F * sk * 0.62 + uF0 * (uFillCol + uGlowCol * 0.3) * 0.2) * occ;
  // GOLD GLOWS: against the dark glaze every seam is the brightest, most saturated thing in the frame (it holds the
  // last of the day), ridged and veined so it still reads as raised metal
  col += uF0 * mix(uF0, vec3(1.0), 0.12) * uGoldWarm * (0.2 + 2.7 * uGoldLift) * (0.45 + 0.55 * occ) * (0.75 + 0.5 * vnoise(p * vec2(0.6, 1.7))) * (1.0 - 0.7 * clamp(heat + crown, 0.0, 1.0));
  float azR = dot(R.xz, uGlowDir.xz) / max(length(R.xz) * length(uGlowDir.xz), 1e-4);
  float sw = 0.1 + min(fw, 1.5) * 0.35, sy = (R.y - 0.3) / sw;
  float streak = exp(-sy * sy) * (0.45 + 0.55 * smoothstep(-0.3, 0.9, azR)) * (0.6 + 0.4 * occ) * (0.1 / sw + 0.25);
  float hl = max(dot(R, uGlowDir), 0.0); float hp = pow(hl, 180.0);
  float hs = pow(max(dot(Rs, uGlowDir), 0.0), 40.0) * step(0.66, hash21(sc + 5.0)) * (1.0 - smoothstep(0.25, 0.8, fw)) * glint;
  float hs2 = pow(clamp(Rs.y, 0.0, 1.0), 6.0) * step(0.9, hash21(sc + 9.0)) * (1.0 - smoothstep(0.25, 0.8, fw)) * glint;   // pin sparkles under the open sky
  // set gold is never quite still: a slow sheen slides uphill along every seam, as if it were still finding its level
  float sheen = 0.5 + 0.5 * sin(p.x * 0.11 - uTime * 1.2 + 3.0 * vnoise(vec2(p.x * 0.05, 1.7))); sheen *= sheen; sheen *= sheen;
  streak *= 0.75 + 1.5 * sheen;
  col += uF0 * uGlowCol * (1.9 * streak + 5.0 * hp + 2.4 * hs + 1.6 * hs2 + 0.45 * sheen * occ);
  col += uF0 * uGlowCol * 0.3 * pow(hl, 7.0) * occ;                                       // the softbox seen wide and dim
  float vein = clamp(h0 * 0.75, 0.0, 1.0); vein = 0.25 + 1.5 * vein * vein;                 // molten ripples, brighter in the troughs between skins
  col += uEmber * (1.5 * heat * heat * heat + 3.0 * crown) * vein + vec3(2.6, 2.0, 1.1) * crown * crown * crown;   // a white-orange core at the front
  col = haze(col, length(cameraPosition - vPos));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,ct=`
attribute vec2 aT; attribute vec3 aA, aB; attribute vec4 aRnd;
uniform vec2 uRes; uniform float uTime, uOpen;
varying vec3 vPos; varying vec3 vTR;     // (t, energy kept when widened to the pixel floor, random)
${_e}
#include <fog_pars_vertex>
vec3 curve(float t, vec3 A, vec3 B, float gap) {
  float slack = gap * (0.03 + 0.07 * aRnd.x) * (0.08 + 0.92 * smoothstep(0.0, 0.6, uOpen));   // they tighten as it comes in
  vec3 sway = vec3(sin(uTime * 0.43 + aRnd.y * 6.28), 0.0, cos(uTime * 0.37 + aRnd.z * 6.28)) * (gap * 0.022 + 0.4);   // a long thread bellies in the air off the gap
  float bow = 4.0 * t * (1.0 - t);
  return mix(A, B, t) + (vec3(0.0, -slack, 0.0) + sway) * bow;
}
void main() {
  vec3 A = aA, B = posePoint(aB, 1.0);
  float gap = length(B - A);
  vec3 p = curve(aT.x, A, B, gap), p2 = curve(aT.x + 0.02, A, B, gap);
  vec4 wp = modelMatrix * vec4(p, 1.0); vec3 wt = mat3(modelMatrix) * (p2 - p);
  vec3 toCam = cameraPosition - wp.xyz; float dist = max(length(toCam), 0.1);
  vec3 sd = cross(wt, toCam); float sl = length(sd); sd = sl > 1e-5 ? sd / sl : vec3(1.0, 0.0, 0.0);
  float px = dist * 2.0 / max(projectionMatrix[1][1] * uRes.y, 1.0);     // one pixel in metres at this distance
  float base = 0.07 + 0.05 * aRnd.w, halfW = max(base, 0.75 * px) * smoothstep(0.3, 1.5, gap);
  float pxA = distance(cameraPosition, (modelMatrix * vec4(A, 1.0)).xyz) * 2.0 / max(projectionMatrix[1][1] * uRes.y, 1.0);
  float keep = 0.13 + 0.87 * smoothstep(0.1, 0.55, 0.1 / max(0.75 * pxA, 0.1));   // from far off a few fine bright lines, never a cage of bars
  wp.xyz += sd * aT.y * halfW;
  vPos = wp.xyz; vTR = vec3(aT.x, clamp(base / max(halfW, 1e-4), 0.0, 1.0), aRnd.x);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  if (aRnd.z > keep) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  #include <fog_vertex>
}`,ht=`
precision highp float;
varying vec3 vPos; varying vec3 vTR;
uniform vec3 uF0, uEmber; uniform float uGoldLift;
${be}
#include <fog_pars_fragment>
void main() {
  float t = vTR.x;
  // slow beads of light sliding down each thread toward the seam (never a flash: 0.2 Hz, eased)
  float g = 0.5 + 0.5 * sin(t * 5.0 + uTime * 1.5 + vTR.z * 40.0); g *= g; g *= g; g *= g; g *= g;
  g *= 0.3 + 0.7 * step(0.62, fract(vTR.z * 7.31));                      // every thread carries a glint, some brighter
  vec3 col = uF0 * (uFillCol * 0.4 + uGlowCol * 0.28 + uPeach * uUpLight * 0.15 * uOpen) * mix(0.5, 1.0, vTR.y);
  col += uF0 * mix(uF0, vec3(1.0), 0.3) * (0.12 + 1.5 * uGoldLift) * mix(0.55, 1.0, vTR.y);      // a widened thread stays a bright fine line
  col += uEmber * (0.05 + 1.7 * g) * mix(0.3, 1.0, vTR.y);
  col = mix(col, mix(uF0, vec3(1.0), 0.6) * (uGlowCol * 0.75 + uPeach * 0.35), (1.0 - vTR.y) * 0.8);   // widened to the pixel floor it is a pale bright hairline on any ware, never a dim bar
  col = haze(col, length(cameraPosition - vPos));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,ft=`
attribute vec4 aDust, aRnd;
uniform vec2 uRes; uniform float uTime, uFront, uPuff, uOpen;
varying float vA;
void main() {
  float kind = aDust.y; vec3 outw = vec3(aDust.z, 0.0, aDust.w);
  vec3 p = position; float a = 0.0, sizeM = 0.3 + 0.35 * aRnd.z, big = 18.0;
  vec3 swirl = vec3(sin(uTime * 0.31 + aRnd.x * 30.0), sin(uTime * 0.23 + aRnd.y * 30.0), cos(uTime * 0.27 + aRnd.z * 30.0));
  if (kind < 0.5) {                         // wake of the bead: born at the front, lifts and thins behind it
    float age = uFront - aDust.x;
    float lift = 1.0 - exp(-max(age, 0.0) / 14.0);
    p += normal * (0.8 + aRnd.x * 9.0) * lift + outw * (aRnd.y - 0.5) * 7.0 * lift + swirl * 1.2 * lift;
    a = smoothstep(0.0, 3.0, age) * exp(-max(age, 0.0) / 34.0) * step(0.01, uFront);
  } else if (kind < 1.5) {                  // the puff as the Shard seats
    float e = 1.0 - (1.0 - uPuff) * (1.0 - uPuff);
    p += normal * (0.4 + aRnd.x * (2.0 + 11.0 * e)) + outw * (aRnd.y - 0.4) * (5.0 + 12.0 * e) + vec3(aDust.w, 0.0, -aDust.z) * (aRnd.w - 0.5) * 6.0 + swirl * 1.5 * e;
    p += normal * 6.0 * uPuff;
    a = smoothstep(0.0, 0.06, uPuff) * pow(max(1.0 - uPuff, 0.0), 1.3) * 0.4; sizeM = 1.0 + 2.6 * aRnd.z * aRnd.z; big = 56.0;
  } else {                                  // pollen drifting off the rim all the time
    float ph = fract(uTime * 0.022 * (0.5 + aRnd.z) + aRnd.w);
    p += normal * ph * (14.0 + 22.0 * aRnd.x) + outw * (aRnd.y - 0.5) * 12.0 * ph + swirl * 2.0;
    a = sin(3.14159 * ph) * (0.5 + 0.45 * uOpen); sizeM *= 1.05;
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = max(-mv.z, 0.1);
  float px = sizeM * projectionMatrix[1][1] * uRes.y * 0.5 / dist;
  gl_PointSize = clamp(px, 1.6, big);
  vA = a * clamp(px / 1.6, 0.25, 1.0) * (0.7 + 0.3 * sin(uTime * 1.1 + aRnd.w * 50.0));
  gl_Position = projectionMatrix * mv;
  if (a < 0.003) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,$e=`
precision highp float;
varying float vA; uniform vec3 uEmber;
void main() {
  vec2 c = gl_PointCoord - 0.5; float r2 = dot(c, c) * 4.0;
  float f = max(1.0 - r2, 0.0); f *= f;
  gl_FragColor = vec4(uEmber * 1.9 * f * vA, 1.0);
}`;function pt(n){const a=[],l=[],y=[],f=new t.Vector3,u=new t.Vector3,{pts:P,N:A}=n;let S=0;for(let s=0;s<=A;s++){const x=P[s%A],E=P[(s+A-1)%A];s>0&&(S+=Math.hypot(x.x-E.x,x.z-E.z)),U(x.x,x.z,f),fe(x.x,x.z,u),f.addScaledVector(u,-ke*.5);for(let M=0;M<2;M++)a.push(f.x,f.y,f.z),l.push(M,S,$(s*.173),ge(0,30,-x.z));if(s<A){const M=s*2;y.push(M,M+2,M+1,M+1,M+2,M+3)}}const c=new t.BufferGeometry;return c.setAttribute("position",new t.Float32BufferAttribute(a,3)),c.setAttribute("aBl",new t.Float32BufferAttribute(l,4)),c.setIndex(y),c}const ut=`
attribute vec4 aBl; uniform float uK, uTime; varying vec3 vB; varying float vDist;
void main() {
  float hgt = (16.0 + 24.0 * (0.5 + 0.5 * sin(aBl.y * 0.045 + 1.7)) + 8.0 * sin(aBl.y * 0.21 + uTime * 0.11)) * smoothstep(0.0, 0.3, uK) * (0.4 + 0.6 * aBl.w);
  vec4 wp = modelMatrix * vec4(position + vec3(0.0, hgt * aBl.x, 0.0), 1.0);
  vB = vec3(aBl.x, aBl.y, hgt); vDist = distance(cameraPosition, wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,dt=`
precision highp float;
varying vec3 vB; varying float vDist;
${be}
uniform float uK;
void main() {
  float t = vB.x, f = (1.0 - t); f = f * f * f * smoothstep(0.0, 0.05, t);
  float streak = 0.55 + 0.45 * vnoise(vec2(vB.y * 0.22 + 0.3 * sin(uTime * 0.07 + vB.y * 0.01), uTime * 0.16));
  float streak2 = 0.62 + 0.38 * vnoise(vec2(vB.y * 0.05, t * 3.0 - uTime * 0.35));
  float a = clamp(f * streak * streak2 * uOpen * (0.62 + 0.3 * (1.0 - uK)) * exp(-vDist * uHazeK) * smoothstep(3.0, 16.0, vDist), 0.0, 0.5);
  gl_FragColor = vec4(mix(uPeach, uDeep, 0.85) * uUpLight * 0.45 * a, a * 0.8);   // premultiplied: it covers what is behind it, so it never adds up to white
}`;function vt(){const n=[],a=[],l=[],y=new t.Vector3,f=48;for(let P=0;P<=f;P++){const A=P/f*Math.PI*2,S=Ce(A)*.86;U(T.x+Math.cos(A)*S,T.z+Math.sin(A)*S,y);for(let c=0;c<2;c++)n.push(y.x,y.y,y.z),a.push(c,P/f,Math.cos(A),Math.sin(A));if(P<f){const c=P*2;l.push(c,c+2,c+1,c+1,c+2,c+3)}}const u=new t.BufferGeometry;return u.setAttribute("position",new t.Float32BufferAttribute(n,3)),u.setAttribute("aBl",new t.Float32BufferAttribute(a,4)),u.setIndex(l),u}const mt=`
attribute vec4 aBl; uniform vec3 uBeaconDir; uniform float uTime; varying vec3 vB; varying float vDist;
void main() {
  float hgt = 24.0 + 3.0 * sin(aBl.y * 18.85 + uTime * 0.23);
  vec3 p = position + (uBeaconDir * hgt - vec3(aBl.z, 0.0, aBl.w) * 2.5) * aBl.x - uBeaconDir * 2.0;      // a cone that closes as it rises
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec3 rad = normalize(mat3(modelMatrix) * vec3(aBl.z, 0.0, aBl.w)), vd = cameraPosition - wp.xyz;
  vDist = max(length(vd), 1e-3);
  vB = vec3(aBl.x, aBl.y, abs(dot(rad, vd / vDist)));           // 0 at the column's silhouette, 1 where it faces the lens
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,wt=`
precision highp float;
varying vec3 vB; varying float vDist;
${be}
uniform float uBeacon;
void main() {
  float t = vB.x, f = 1.0 - t; f = f * f * smoothstep(0.0, 0.22, t);
  float streak = 0.62 + 0.38 * vnoise(vec2(vB.y * 23.0 + 0.4 * sin(uTime * 0.11), t * 2.5 - uTime * 0.3));
  float edge = smoothstep(0.0, 1.0, vB.z); edge *= edge;                // nothing at the column's silhouette: it has no outline to read as a pane
  float a = clamp(f * streak * uBeacon * 0.62 * edge * smoothstep(30.0, 120.0, vDist), 0.0, 0.34);   // no plateau: it brightens toward its middle and its foot
  gl_FragColor = vec4(mix(uPeach, uDeep, 0.5) * 1.5 * a, a * 0.4);
}`,Ee=n=>{const a=new t.Color(n);return new t.Vector3(Math.sqrt(a.r),Math.sqrt(a.g),Math.sqrt(a.b))},he=(n,a=1)=>{const l=new t.Color(n);return new t.Vector3(l.r*a,l.g*a,l.b*a)};async function xt(n,a={}){const l=n.rng,y=a.palette&&a.palette.length>=7?a.palette:je,f=re(a.detail??n.quality?.detail??1,.6,1),u=a.seatU??.84,P=a.meetU??.945,A=a.chipU??.965,S=a.startU??.03,c=new t.Group;c.name="mended-country-hero";const s=()=>n.yield?.();await s();const x=Je(l);await s();const E=new Ue,{outer:M,seamCols:G}=await et(x,l,E,s);await n.yield?.();const D=new Ue;await tt(x,M,D,s),await n.yield?.();const d=await ot(x,M,G,l,s);await n.yield?.(),await n.yield?.();const v=at(x,l,60);await n.yield?.();const q=it(x,d.LM,l,Math.round(3600*f));await n.yield?.();const o=he(y[3]),m=he(y[0]),g=new t.Vector3(-Math.log(re(m.x/Math.max(o.x,.001),.05,.98)),-Math.log(re(m.y/Math.max(o.y,.001),.05,.98)),-Math.log(re(m.z/Math.max(o.z,.001),.05,.98))).multiplyScalar(2),z=Ee(y[4]);z.multiplyScalar(1/Math.max(z.x,z.y,z.z,.001));const e=(a.glowDir?a.glowDir.clone():new t.Vector3(-.857,.139,-.495)).normalize(),r=!!a.glowDir,h={uPose:{value:new t.Matrix4},uOpen:{value:1},uK:{value:1},uTime:{value:0},uFront:{value:0},uPuff:{value:1},uCool:{value:0},uCraze:{value:.3},uGlowDir:{value:e.clone()},uGlowCol:{value:he("#F6E3CF",.9)},uFillCol:{value:he("#9DB5AC",.45)},uPeach:{value:he(y[6])},uDeep:{value:he("#E89B6E")},uUpLight:{value:2.4},uHazeCol:{value:he("#8FA9A3")},uHazeK:{value:1/2600},uZenith:{value:he("#6F8E8C")},uRimSky:{value:he("#9DB5AC")},uBiscuit:{value:o},uAbsorb:{value:g},uMilk:{value:he(y[0])},uCopper:{value:Ee(y[5])},uCrackCol:{value:Ee("#8E9A82")},uGlass:{value:he(y[2])},uF0:{value:z},uEmber:{value:new t.Vector3(1,.5,.085)},uRes:{value:new t.Vector2(1280,720)},uGoldWarm:{value:new t.Vector3(1.08,1,.9)},uRare:{value:0},uGoldLift:{value:.3},uBowlEx:{value:2.3},uCarve:{value:0},uPool:{value:.45},uShade:{value:.2},uFishScale:{value:1.5},uPig:{value:he(y[5],1.3)},uPigMix:{value:.55},uBeacon:{value:1},uBeaconDir:{value:fe(T.x,T.z).multiplyScalar(.62).add(new t.Vector3(0,.38,0)).normalize()},uU:{value:0},uRiv:{value:Ae.map((i,F)=>new t.Vector2(.5+.03*F,1700))}},b=(i,F,j={})=>new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...h},vertexShader:i,fragmentShader:F,fog:!0,...j}),w=new t.Sphere(new t.Vector3(0,120,-110),420),I=(i,F,j)=>{i.boundingSphere=w;const Q=new t.Mesh(i,F);return Q.name=j,Q.frustumCulled=!1,c.add(Q),Q};await n.yield?.(),I(await E.geometryAsync(s),b(st,Re,{side:t.DoubleSide}),"glaze"),await n.yield?.(),I(await D.geometryAsync(s),b(nt,lt,{side:t.DoubleSide}),"biscuit"),await n.yield?.(),await n.yield?.(),I(d.geometry,b(rt,Ke),"gold"),I(v,b(ct,ht,{side:t.DoubleSide}),"threads");const N=new t.Points(q,new t.ShaderMaterial({uniforms:h,vertexShader:ft,fragmentShader:$e,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}));N.name="dust",N.frustumCulled=!1,c.add(N);const _=new t.Mesh(pt(x),new t.ShaderMaterial({uniforms:h,vertexShader:ut,fragmentShader:dt,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:t.DoubleSide}));_.name="peach-blade",_.frustumCulled=!1,_.renderOrder=2,c.add(_);const V=new t.Mesh(vt(),new t.ShaderMaterial({uniforms:h,vertexShader:mt,fragmentShader:wt,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:t.DoubleSide}));V.name="chip-beacon",V.frustumCulled=!1,V.renderOrder=2,c.add(V);const se=(E.idx.length+D.idx.length+d.geometry.index.count)/3+3360+96,oe=U(0,-138),H=U(0,-(xe-4)),X=fe(0,-(xe-4)),p=l.sign(),B=l.range(7,10),k=l.range(0,6.28),W=new t.Matrix4,O=new t.Matrix4,C=new t.Quaternion,R=new t.Quaternion,K=new t.Vector3(1,0,0),Z=new t.Vector3(0,0,1),J=new t.Vector3,ae=(i,F)=>{const j=i.length,Q=new Array(j).fill(0);for(let L=1;L<j-1;L++){const Y=(F[L]-F[L-1])/(i[L]-i[L-1]),pe=(F[L+1]-F[L])/(i[L+1]-i[L]);Q[L]=Y*pe<=0?0:2*Y*pe/(Y+pe)}return L=>{if(L<=i[0])return F[0];if(L>=i[j-1])return F[j-1];let Y=0;for(;L>i[Y+1];)Y++;const pe=i[Y+1]-i[Y],me=(L-i[Y])/pe,we=me*me,Fe=we*me;return(2*Fe-3*we+1)*F[Y]+(Fe-2*we+me)*pe*Q[Y]+(-2*Fe+3*we)*F[Y+1]+(Fe-we)*pe*Q[Y+1]}},le=[0,.273,.478,.628,.738,.847,.929,1].map(i=>te(S,u,i)),ne=ae(le,[104,96,74,50,35,19,7.5,0]),ie=ae(le,[34,32,30,26,20,11,4,0]),ue=ae(le,[30,30,34,36,28,14,4,0]),ye=ae(le,[1,.8,.4,.1,0,0,0,0]),Be=i=>re(ne(i)/45,0,1),Me=ae([0,.1,.164,.3,.45,.88,1].map(i=>te(u,P,i)),[0,.5,.655,.75,.86,.955,1]),Se=(i,F)=>{const j=h.uPose.value,Q=ne(i),L=Q/104,Y=ye(i);if(i>=u||Q<=1e-4){j.identity();return}C.setFromAxisAngle(X,p*B*Math.PI/180*Y),R.setFromAxisAngle(K,-Q*Math.PI/180+.02*L*Math.sin(F*.34+k)),C.premultiply(R),R.setFromAxisAngle(Z,L*(.028*Math.sin(F*.27+k*1.7)+.007*Math.sin(F*.59+k))),C.premultiply(R),J.set(2.5*L*Math.sin(F*.2+k),ie(i)+1.6*L*Math.sin(F*.4),ue(i)).add(H),W.makeTranslation(-H.x,-H.y,-H.z),O.makeRotationFromQuaternion(C),O.setPosition(J),j.multiplyMatrices(O,W)},ee=i=>[i.x,i.y,i.z],ve=(i,F,j)=>{const Q=U(i,F),L=fe(i,F);return ee(Q.addScaledVector(L,j))},De=fe(T.x,T.z),Te=U(T.x,T.z).addScaledVector(De,-2),Pe=new t.Vector3(0,-Math.sin(50*Math.PI/180),-Math.cos(50*Math.PI/180)),Ze=Te.clone().addScaledVector(Pe,-52),Qe={portalSeat:{position:ee(Te),facing:[-Pe.x,-Pe.y,-Pe.z],wallNormal:ee(De),radius:7,tiltDeg:50},flyThrough:[ve(-77,70,13),ve(-71,0,14),ve(-61,-60,16),ve(-59,-120,17),ve(-58,-165,34),ee(Ze),ee(Te)],flyBeyond:ee(Te.clone().addScaledVector(Pe,14)),chip:{center:ee(U(T.x,T.z)),normal:ee(De),radius:T.r},gapTip:[0,0,0],gapBase:ee(U(0,-xe)),shardPivot:ee(oe),gapOutline:x.pts.map(i=>ee(U(i.x,i.z))),collarOutline:M.map(i=>ee(U(i.x,i.z))),capPoint:(i,F)=>ee(U(i,F)),capNormal:(i,F)=>ee(fe(i,F)),rivers:{apex:[ce.x,ce.z],phi:Ge.slice(),theta:Ae.slice(),radius:Oe,rays:d.rivers.map(i=>i&&{theta:i.theta,len:i.len,inner:ee(U(i.inner[0],i.inner[1])),outer:ee(U(i.outer[0],i.outer[1]))})},placement:{position:[0,Ne,ze],rotationY:Math.PI},viewpoints:{entry:[-60,10-Ne,870],wallClimb:ve(-40,150,12),gapSide:ve(-84,-20,14),overview:ve(-60,-70,55)}},Ye=i=>{const F=Me(i),j=[];for(const Q of[1,-1]){const L=Q>0?x.L1:x.L2;let Y=x.pts[0],pe=1e9;for(const me of x.pts)if(me.flank===Q){const we=Math.abs(me.s/L-F);we<pe&&(pe=we,Y=me)}j.push(ee(U(Y.x,Y.z)))}return j};let qe=0,Ie=!1;const Le=new t.Vector2,We=(i,F)=>{const j=i>=u?0:Be(i);Se(i,F),h.uOpen.value=Math.max(ge(0,.1,j),.7*(1-ge(u+.006,u+.045,i))),h.uK.value=j,h.uFront.value=d.LM*Me(i)+(d.sTotal-d.LM)*re((i-P)/Math.max(1e-4,A-P),0,1),h.uPuff.value=re((i-(u-.004))/.1,0,1),h.uCool.value=ge(A-.004,A+.014,i),h.uCraze.value=.15+.6*i,h.uU.value=i};return We(0,0),{object:c,radius:185,height:320,center:new t.Vector3(0,125,-115),anchors:Qe,uniforms:h,pose:h.uPose.value,beadPositions:Ye,triangles:Math.round(se),ground:!1,groundY:-60,setProgress(i){Ie=!0,qe=re(i||0,0,1)},setRiver(i,F,j){h.uRiv.value[i]&&h.uRiv.value[i].set(F,j)},update(i,F,j){h.uTime.value=F;const Q=Ie?qe:F/44%1;We(Q,F),r?h.uGlowDir.value.copy(e):(c.updateMatrixWorld(),h.uGlowDir.value.copy(e).transformDirection(c.matrixWorld)),n.renderer?.getDrawingBufferSize&&(n.renderer.getDrawingBufferSize(Le),h.uRes.value.copy(Le))},dispose(){}}}const bt=Re.slice(Re.indexOf("// F2 - F1"),Re.indexOf("void main()"));export{je as DEFAULT_PALETTE,$e as DUST_FS,Ke as GOLD_FS,be as LIGHT_GLSL,He as RELIEF_GLSL,bt as UNDER_GLSL,xt as buildHero};
