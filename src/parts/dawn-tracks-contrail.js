import*as W from"three";import{clamp as ot,lerp as J,smoothstep as X,makePath as Gt}from"../kit/core.js";const Qt=["#0B1522","#2C3E5E","#131A3F","#C9809A","#FF7F57","#FFC98A","#6FE3C8"],It=[[-150,-128,0],[-150,-128,60],[-150,-125,450],[-60,-78,630],[-20,-112,690],[0,-135,750],[18,-108,810],[0,-85,870],[-20,-112,930],[0,-128,990],[0,-95,1350],[0,-22,1750],[14,12,1975],[12,8,2020],[8,12,2090],[0,8,2240],[0,75,2400]],Ot=[...It.slice(0,16),[0,30.2,2293],[0,52.4,2346],[0,75,2400]],tt=Math.PI*2,nt=30,mt=2060,ut=2.2,Pt=[11.5,21];function qt(e){const i=Gt(e.map(S=>[S[0],S[1],-S[2]]),{samples:64}),n=1400,u=new Float32Array(1300),s=new Float32Array(1300),l=new W.Vector3;let h=0,f=e[0][0],M=e[0][1],y=0;for(let S=0;S<=n&&h<1300;S++){i.pointAt(S/n,l);const D=-l.z;for(;h<1300&&h*2<=D;){const _=D>y?(h*2-y)/(D-y):0;u[h]=J(f,l.x,_),s[h]=J(M,l.y,_),h++}f=l.x,M=l.y,y=D}for(;h<1300;h++)u[h]=f,s[h]=M;const v=(S,D)=>{const _=ot(S/2,0,1298.999),B=Math.floor(_),L=_-B;return D[0]=J(u[B],u[B+1],L),D[1]=J(s[B],s[B+1],L),D},V=[0,0];return{at:v,dist:(S,D,_)=>{const B=-_;let L=1e9;for(let C=-40;C<=40;C+=4){const F=B+C;if(F<-30||F>2400)continue;v(Math.max(0,F),V);const N=S-V[0],P=D-V[1],A=C,d=N*N+P*P+A*A;d<L&&(L=d)}return Math.sqrt(L)},path:i}}function Ht(e){const i=e.length,n=new Array(i);for(let u=0;u<i;u++){const s=e[Math.max(0,u-1)],l=e[Math.min(i-1,u+1)];n[u]=(l[1]-s[1])/Math.max(1e-6,l[0]-s[0])}return u=>{if(u<=e[0][0])return e[0][1];if(u>=e[i-1][0])return e[i-1][1];let s=0;for(;u>e[s+1][0];)s++;const l=e[s+1][0]-e[s][0],h=(u-e[s][0])/l,f=h*h,M=f*h;return(2*M-3*f+1)*e[s][1]+(M-2*f+h)*l*n[s]+(-2*M+3*f)*e[s+1][1]+(M-f)*l*n[s+1]}}const St={p:3,n:3,a:4,k:4,q:2};function Nt(e=16384){const i={nv:0,nt:0,cap:e,capT:e*2,idx:new Uint32Array(e*6),bias:new Float32Array(e*2)};for(const n in St)i[n]=new Float32Array(e*St[n]);return i}function gt(e,i,n,u,s,l,h,f,M,y,v,V,x,S,D,_,B){if(e.nv===e.cap){e.cap*=2;for(const a in St){const m=new Float32Array(e.cap*St[a]);m.set(e[a]),e[a]=m}}const L=e.nv++,C=L*3,F=L*4,N=L*2,P=e.p,A=e.n,d=e.a,g=e.k,q=e.q;return P[C]=i,P[C+1]=n,P[C+2]=u,A[C]=s,A[C+1]=l,A[C+2]=h,d[F]=f,d[F+1]=M,d[F+2]=y,d[F+3]=v,g[F]=V,g[F+1]=x,g[F+2]=S,g[F+3]=D,q[N]=_,q[N+1]=B,L}function wt(e,i,n,u,s){if(e.nt===e.capT){e.capT*=2;const f=new Uint32Array(e.capT*3),M=new Float32Array(e.capT);f.set(e.idx),M.set(e.bias),e.idx=f,e.bias=M}const l=e.nt++,h=l*3;e.idx[h]=i,e.idx[h+1]=n,e.idx[h+2]=u,e.bias[l]=s}function Bt(e,i,n){const{C:u,m:s,n:l,closed:h,ref:f,o:M,noise:y,P:v,D:V}=e;for(let x=i;x<n;x++){const S=u[x%s],D=u[h?(x-1+s)%s:Math.max(0,x-1)],_=u[h?(x+1)%s:Math.min(s-1,x+1)];let B=_.x-D.x,L=_.y-D.y,C=_.z-D.z;const F=Math.hypot(B,L,C)||1;B/=F,L/=F,C/=F;const N=f[0]*B+f[1]*L+f[2]*C;let P=f[0]-N*B,A=f[1]-N*L,d=f[2]-N*C;const g=Math.hypot(P,A,d)||1;P/=g,A/=g,d/=g;const q=L*d-C*A,a=C*P-B*d,m=B*A-L*P;for(let w=0;w<=l;w++){const z=w%l/l*tt,k=Math.cos(z),K=Math.sin(z)*(M.squash||1),I=k*q+K*P,j=k*a+K*A,G=k*m+K*d,Q=S.r*(M.rMul||1),o=S.x+I*Q,T=S.y+j*Q,E=S.z+G*Q;let O=Q*(1+(M.lobe||0)*(S.lobe??1)*y.fbm3(o*M.lobeF,T*M.lobeF,E*M.lobeF,2));if(M.hang){const c=Math.max(0,-j);O+=M.hang*(S.hang??1)*c*c*(.5+.5*y.n3(o*.045,T*.045+7,E*.045))}const t=(x*(l+1)+w)*3;v[t]=S.x+I*O,v[t+1]=S.y+j*O,v[t+2]=S.z+G*O,V[t]=I,V[t+1]=j,V[t+2]=G}}}function Yt(e,i){const{C:n,m:u,n:s,closed:l,o:h,P:f,D:M,rows:y,L:v,aScale:V,tile:x,along0:S,base:D}=i;for(let _=0;_<y;_++){const B=n[_%u],L=l?(_-1+u)%u:Math.max(0,_-1),C=l?(_+1)%u:Math.min(y-1,_+1);for(let F=0;F<=s;F++){const N=(_*(s+1)+F)*3,P=(F%s-1+s)%s,A=(F%s+1)%s,d=(L*(s+1)+F)*3,g=(C*(s+1)+F)*3,q=(_*(s+1)+P)*3,a=(_*(s+1)+A)*3,m=f[g]-f[d],w=f[g+1]-f[d+1],z=f[g+2]-f[d+2],k=f[a]-f[q],K=f[a+1]-f[q+1],I=f[a+2]-f[q+2];let j=w*I-z*K,G=z*k-m*I,Q=m*K-w*k,o=Math.hypot(j,G,Q);(o<1e-6||j*M[N]+G*M[N+1]+Q*M[N+2]<.15*o)&&(j=M[N],G=M[N+1],Q=M[N+2],o=Math.hypot(j,G,Q)||1);const T=S+v[_]*V;gt(e,f[N],f[N+1],f[N+2],j/o,G/o,Q/o,T,F/s,B.age,B.fade??1,h.kind,(h.spin||0)*(B.spin??1),0,0,v[_]/x+(h.nu0||0),F/s*(h.vt||1))}}for(let _=0;_<y-1;_++)for(let B=0;B<s;B++){const L=D+_*(s+1)+B,C=L+(s+1),F=C+1,N=L+1;wt(e,L,C,N,h.bias||0),wt(e,C,F,N,h.bias||0)}}async function yt(e,i,n,u,s){const l=i.length,h=n.n,f=!!n.closed,M=n.ref||[0,1,0],y=f?l+1:l,v=e.nv,V=new Float32Array(y);let x=0;for(let N=1;N<y;N++){const P=i[(N-1)%l],A=i[N%l];x+=Math.hypot(A.x-P.x,A.y-P.y,A.z-P.z),V[N]=x}const S=n.kA||.25,D=f?Math.max(1,Math.round(S*x/tt))*tt/(S*x):1,_=f?x/Math.max(1,Math.round(x/n.tile)):n.tile,B=n.along0||0,L=new Float32Array(y*(h+1)*3),C=new Float32Array(y*(h+1)*3),F={C:i,m:l,n:h,closed:f,ref:M,o:n,noise:u,P:L,D:C,rows:y,L:V,aScale:D,tile:_,along0:B,base:v};for(let N=0;N<y;N+=16)Bt(F,N,Math.min(y,N+16)),await s.yield();return Yt(e,F),x}function dt(e,i,n,u,s,l,h,f,M,y){const v=f(),V=f(),x=f(),S=e.nv,D=M?M[2]:0,_=M?M[0]:0,B=M?M[1]:0,L=y===!0?1:y||0;gt(e,i,n,u,s,x,D,v,V,l,h,3,L,-1,-1,_,B),gt(e,i,n,u,s,x,D,v,V,l,h,3,L,1,-1,_,B),gt(e,i,n,u,s,x,D,v,V,l,h,3,L,1,1,_,B),gt(e,i,n,u,s,x,D,v,V,l,h,3,L,-1,1,_,B),wt(e,S,S+1,S+2,1.5),wt(e,S,S+2,S+3,1.5)}function Rt(e){const i=e.nt,n=new Float32Array(i),u=e.p,s=e.idx;let l=1e9,h=-1e9;for(let v=0;v<i;v++){const V=(u[s[v*3]*3+2]+u[s[v*3+1]*3+2]+u[s[v*3+2]*3+2])/3+e.bias[v];n[v]=V,V<l&&(l=V),V>h&&(h=V)}const f=Math.min(32768,Math.ceil((h-l)/.2)+2),M=(f-1)/Math.max(1e-6,h-l),y=new Uint32Array(f+1);for(let v=0;v<i;v++)y[Math.floor((n[v]-l)*M)+1]++;for(let v=0;v<f;v++)y[v+1]+=y[v];return{key:n,lo:l,sc:M,cnt:y}}function Xt(e,i){const n=e.nt,u=new Uint32Array(n),s=e.idx,{key:l,lo:h,sc:f,cnt:M}=i;for(let v=0;v<n;v++)u[M[Math.floor((l[v]-h)*f)]++]=v;const y=e.nv>65535?new Uint32Array(n*3):new Uint16Array(n*3);for(let v=0;v<n;v++){const V=u[v]*3;y[v*3]=s[V],y[v*3+1]=s[V+1],y[v*3+2]=s[V+2]}return y}function Zt(e,i){let n=1e9,u=-1e9,s=1e9,l=-1e9,h=1e9,f=-1e9;for(let M=0;M<i*3;M+=33){const y=e[M],v=e[M+1],V=e[M+2];y<n&&(n=y),y>u&&(u=y),v<s&&(s=v),v>l&&(l=v),V<h&&(h=V),V>f&&(f=V)}return i===0&&(n=u=s=l=h=f=0),new W.Sphere(new W.Vector3((n+u)/2,(s+l)/2,(h+f)/2),.5*Math.hypot(u-n,l-s,f-h)+90)}async function Tt(e,i){const n=Rt(e);await i.yield();const u=Xt(e,n),s=e.nv,l=e.p;await i.yield();const h=new W.BufferGeometry;return h.setAttribute("position",new W.BufferAttribute(l.subarray(0,s*3),3)),h.setAttribute("normal",new W.BufferAttribute(e.n.subarray(0,s*3),3)),await i.yield(),h.setAttribute("aA",new W.BufferAttribute(e.a.subarray(0,s*4),4)),h.setAttribute("aK",new W.BufferAttribute(e.k.subarray(0,s*4),4)),h.setAttribute("aQ",new W.BufferAttribute(e.q.subarray(0,s*2),2)),h.setIndex(new W.BufferAttribute(u,1)),await i.yield(),h.boundingSphere=Zt(l,s),h}function kt(e){let i=(Math.floor(e*1e6)^2654435769)>>>0;const n=()=>{i=i+1831565813>>>0;let u=i;return u=Math.imul(u^u>>>15,u|1),u^=u+Math.imul(u^u>>>7,u|61),((u^u>>>14)>>>0)/4294967296};return n.range=(u,s)=>u+(s-u)*n(),n.int=(u,s)=>Math.floor(u+(s-u+1)*n()),n.chance=u=>n()<u,n}const vt=e=>ot((1985-e)/1985,0,1);function Jt(e,i,n){const u=n.moist??(e.chance(.5)?e.range(.62,1):e.range(.05,.42)),s=[0,0],l=V=>(n.axisCam||i).at(V,s)[1],h=Ht([[0,-110],[990,-110],[1110,-104],[1230,-94.5],[1350,l(1350)],[1450,l(1450)],[1550,l(1550)],[1650,l(1650)],[1750,l(1750)],[1850,l(1750)+.5*(-2.9-l(1750))],[1990,-2.9]]),f=V=>30*(1-X(0,600,V)),M=e.range(.93,1.06),y=e.range(0,tt),v=(V,x)=>{const S=Math.sin(.5*Math.PI*ot((1350+nt-V)/240,0,1)),D=tt*(V-1350-nt)/120,_=Math.sin(D*.5),B=22.5*(1-S),L=Math.max(1.2,22.5*(1-S*Math.cos(D))+6*M*S*S*_*_);return x[0]=L,x[1]=.35*M*Math.max(0,L-Math.max(1.2,B)),x};return{cam0:n.axisCam||i,moist:u,rT:J(.84,1.16,u),hang:J(.45,1.25,u),dens:J(.6,1.1,u)*(n.detail??1),axisY:h,axisX:f,wave:v,wPh:y}}async function $t(e,i,n,u,s,l){const h=Nt(),f=[0,0],M=[0,0];for(const y of[1,-1]){const v=[],V=(a,m,w,z)=>{const k=X(1350+nt,1010+nt,a),K=n.n2(a*.011+y*7,3.3)*(.6+2.4*k),I=n.n2(a*.012-y*5,9.1)*(.5+1.8*k),j=z?0:X(1560,1600,a)*(1-X(1752,1785,a)),G=ot(n.n2(a*.075+y*5.3,2.2)+.35*n.n2(a*.17-y*3.7,6.1),-1,1),Q=z?0:1,o=1-.36*Q*X(1500,1620,a),T=(1+.2*n.n2(a*.045+y*3.1,1.7)+.1*n.n2(a*.13,y*9.1+4))*(1+(Q?.42:.3)*j*G),E={x:y*(m+K*Math.min(1,m/10)),y:s.axisY(a)+w+I+2.4*Q*j*G,z:-a,s:a,cz:Q*j,r:s.rT*J(4.9,6.4,k)*o*T*(z?1:.6+.4*X(993+nt,1003+nt,a))*(1-.4*X(1745,1790,a)),age:vt(a),fade:(z?1:X(991+nt,999+nt,a))*(1-X(1752,1790,a)),lobe:.9+.5*k,hang:k*X(5,18,m),gulf:j*X(.05,-.6,G)};u.at(a,M);const O=E.r*1.45+10,t=E.x-M[0],c=E.y-M[1],p=Math.hypot(t,c);if(p<O){const r=(O-p)/Math.max(p,.001);E.x+=t*r,E.y+=c*r}return E};{const m=993+nt+58.5,w=s.wPh>Math.PI?1:-1,z=47*(1+.075*y*w);let k=0,K=0,I=0,j=3,G=null;for(let Q=0;Q<=600;Q++){const o=Math.PI*Q/600,T=Math.cos(o),E=Math.sin(o),O=m-58.5*Math.sign(T)*Math.pow(Math.abs(T),.84),t=X(0,-1,T),c=X(0,1,T),p=z*Math.pow(E,.84-.44*t-.2*c)*(1-(T>0?.2:.36)*T)+8*E*E*n.n2(O*.021+y*31,5.5+s.wPh),r=Q<300?p-6*(1-X(0,.3,o)):Math.max(1.2,p),b=V(O,r,(.33-.2*t)*Math.max(0,r-1.2),!0);b.r*=.5+.5*X(0,.1,o),Q>0&&(j+=Math.hypot(b.x-k,b.y-K,b.z-I)),k=b.x,K=b.y,I=b.z,G=b,j>=3&&(v.push(b),j-=3,G=null)}G&&j>1.2&&v.push(G)}await e.yield();for(let a=1143;a<=1790;a+=3)s.wave(a,f),v.push(V(a,f[0],f[1],!1));const x=new Int16Array(257).fill(-1),S=new Float32Array(257).fill(1e9);for(let a=0;a<v.length;a++){const m=ot(Math.round((v[a].s-993-nt)/3),0,256),w=Math.abs(v[a].s-(993+nt+3*m));w<S[m]&&(S[m]=w,x[m]=a)}for(let a=1;a<257;a++)x[a]<0&&(x[a]=x[a-1]);const D=a=>v[ot(x[ot(Math.round((a-993-nt)/3),0,256)],3,v.length-15)];await yt(h,v,{n:24,kind:0,spin:y,lobe:.17,lobeF:.06,tile:62,vt:1,along0:993},n,e),await e.yield(),await yt(h,v,{n:16,kind:1,spin:y,rMul:1.34,lobe:.16,lobeF:.045,hang:3.2*s.hang,tile:62,vt:1,bias:7,along0:993,nu0:.37},n,e),await e.yield();for(let a=0;a<2;a++){const m=l[a],w=[];for(let z=1738;z<=m+.01;z+=3){const k=ot((1975-z)/225,0,1.06),K=k*k*(3-2*Math.min(1,k)),I=J(16.25,22.5,Math.min(1,K)),j=J(4.75,1.1,X(.35,1,k)),G=(a===0?Math.PI:0)+2.25*Math.PI*Math.pow(k,1.6),Q=m-z,o=n.n2(z*.09+a*13,y*4.2),T=n.n2(z*.19+a*7.3,y*2.9+11);w.push({x:y*(I+j*Math.cos(G)),y:s.axisY(z)+j*Math.sin(G)+(a===0?.25:-.25)*X(40,0,Q),z:-z,r:s.rT*(1.3+1.3*X(.1,.9,k))*(.12+.88*Math.pow(X(0,26,Q),.7))*(1+.16*o)*(1+.48*T),age:ot(Q/1985,0,1),fade:X(0,9,Q)*X(1738,1772,z)*(.3+.7*X(-.62,-.08,T)),lobe:1,bn:T})}await yt(h,w,{n:12,kind:0,spin:y,lobe:.2,lobeF:.12,tile:40,vt:1,along0:1738},n,e),await yt(h,w,{n:8,kind:1,spin:y,rMul:1.25,lobe:.25,lobeF:.09,tile:40,vt:1,bias:3,along0:1738,nu0:.6},n,e),await e.yield();{const z=kt(s.wPh+.9+.13*y+.29*a);let k=1738;for(let K=0;K<w.length;K++)K&&(k+=Math.hypot(w[K].x-w[K-1].x,w[K].y-w[K-1].y,3)),w[K].al=k;for(let K=0;K<620;K++){const I=w[z.int(8,w.length-1)],j=m+I.z,G=z.range(0,tt),Q=.25+.75*Math.pow(z(),1.8),o=z.range(.4,.75),T=z.range(-1.5,1.5),E=z()<.17;if(I.bn<-.25||j<4||K%3!==0)continue;const O=.55+(o-.4)*(.4/.35),t=ot(I.r*1.15*Q*(j<25?.6:1),.6,3),c=Math.max(.1*I.r,I.r-O*t),p=I.x+Math.cos(G)*c,r=I.y+Math.sin(G)*c;u.dist(p,r,I.z+T)<=t+7||(dt(h,p,r,I.z+T,t,I.age,.85*Math.min(1,j/12),z,[I.al,0,-1]),E&&t>.9&&dt(h,p+Math.cos(G+1.2)*t*.55,r+Math.sin(G+1.2)*t*.55,I.z+T+.8*t,t*.68,I.age,.85*Math.min(1,j/12),z,[I.al+.8*t,0,-1]))}}await e.yield()}const _=Math.round(70*s.dens),B=Math.round(180*s.dens),L=[],C=s.cam0;for(let a=993;a<=1790;a+=a<1350?3:5){s.wave(a+nt,f);const m=X(1350,1010,a),w=n.n2(a*.011+y*7,3.3)*(.6+2.4*m),z=n.n2(a*.012-y*5,9.1)*(.5+1.8*m),k={x:y*(f[0]+w*Math.min(1,f[0]/10)),y:s.axisY(a)+f[1]+z,z:-a,r:s.rT*J(4,6.2,m)*(.35+.65*X(993,1006,a))*(1-.4*X(1745,1790,a))};if(a<1340){C.at(a,M);const K=k.r*1.45+10,I=Math.hypot(k.x-M[0],k.y-M[1]);I<K&&(k.y+=K-I)}L.push(k)}let F=y*517;const N=()=>{F+=1;const a=Math.sin(F*91.7+3.1)*43758.5453;return a-Math.floor(a)},P=(a,m,...w)=>{m?dt(h,...w.slice(0,6),a?i:N,...w.slice(6)):a&&(i(),i(),i())};let A=993;for(let a=0;a<v.length;a++)a>0&&(A+=Math.hypot(v[a].x-v[a-1].x,v[a].y-v[a-1].y,v[a].z-v[a-1].z)),v[a].al=A;for(let a=0;a<_;a++){const m=Math.floor(i.range(2,118)),w=D(993+nt+3*m),z=L[m],k=i.range(0,tt),K=i.chance(.55)?-Math.abs(Math.sin(k)):Math.sin(k),I=i.range(.7,.95),j=.35+(I-.7)*1.2,G=i.range(.28,.5),Q=w.x+Math.cos(k)*w.r*j,o=w.y+K*w.r*j*1.1,T=z.r*G,E=w.r*G*.85;P(C.dist(z.x+Math.cos(k)*z.r*I,z.y+K*z.r*I*1.1,z.z)>T+8,u.dist(Q,o,w.z)>E+8&&w.fade>.9,Q,o,w.z,E,w.age,.8,[w.al,0,-1])}await e.yield();const d=kt(s.wPh+(y>0?.31:.77)),g=Math.round(1850*Math.max(.85,s.dens)),q=(a,m,w,z,k,K,I)=>{const j=a.gulf||0,G=a.cz||0,Q=J(z,Math.min(z,1.02)*(1-.12*j),G),o=(K?k*(1-.25*G):a.r*J(k,Math.min(k,.62),G))*(1-.3*j*G),T=a.x+Math.cos(w)*a.r*Q,E=a.y+Math.sin(w)*a.r*Q,O=m*.6180339887;a.fade>.9&&u.dist(T,E,I)>o+7&&!(G*j>.2&&O-Math.floor(O)<.45*j)&&dt(h,T,E,I,o,a.age,.85,d,[a.al,0,-1],.45*j)};for(let a=0;a<g;a++){const m=v[d.int(3,v.length-15)],w=a%5===0,z=d.range(0,tt),k=w?d.range(.9,1.15):d.range(.8,1.05),K=w?d.range(.5,.85):d.range(.26,.6),I=m.z+d.range(-1.5,1.5);q(m,a,z,k,K,!1,I),a%200===199&&await e.yield()}for(let a=0;a<Math.round(760*Math.max(.85,s.dens));a++){const m=a%5<2?d.range(1001+nt,1165):d.range(1585,1765),w=D(m),z=a%4===0,k=d.range(0,tt),K=z?d.range(.95,1.2):d.range(.85,1.08),I=z?d.range(.5,.8):d.range(.28,.55),j=w.z+d.range(-1.5,1.5);q(w,a+.37,k,K,I,!1,j),a%200===199&&await e.yield()}for(let a=0;a<Math.round(950*Math.max(.85,s.dens));a++){const m=D(d.range(1595,1765)),w=(y>0?Math.PI:0)+d.range(-1.45,1.45),z=d.range(.82,1.22),k=d.range(1.4,3.6),K=m.z+d.range(-1.5,1.5);q(m,a+.71,w,z,k,!0,K),a%200===199&&await e.yield()}await e.yield();for(let a=0;a<B;a++){const m=L[Math.floor(i.range(120,L.length-12))],w=D(-m.z),z=i.range(0,tt),k=a%5===0,K=k?-y*i.range(.9,1):Math.cos(z);let I=k?i.range(13,27):i.range(5,12);const j=k?i.range(.15,.4):i.range(.45,1.15),G=k?.32+(j-.15)*1.6:j,Q=-y*(k?.3:.14),o=k?I*.5:I*1.1,T=G*.85,E=w.x+K*w.r*.5,O=w.y-w.r*.8,t=c=>u.dist(E+Q*c,O-c,w.z)>T*3.4+6;t(o)&&t(o*.6)&&t(o*.25)&&dt(h,E,O,w.z,T,w.age,k?.9:.6,i,[Q,-1,o],.75)}await e.yield();for(let a=0;a<2;a++)for(let m=0;m<Math.round(16*s.dens);m++){const w=l[a]-i.range(2,60),z=i.range(0,tt);dt(h,y*(Pt[a]+Math.cos(z)*1.4),s.axisY(w)+Math.sin(z)*1.2,-w,.5+(i.range(1.2,2.6)-1.2)*.5,0,.5,i,[Math.cos(z)*.3,Math.sin(z)*.3,2.5],!0)}await e.yield()}return Tt(h,e)}async function _t(e,i,n,u,s,l){const h=Nt(),f=192,M=Math.cos(l.tilt),y=Math.sin(l.tilt),v=l.noseDown?1:-1,V=[0,M,v*y],x=[0,v*y,-M],S=[],D=i.range(0,50),_=2/i.range(2.2,2.7),B=P=>{let A=0;for(const d of l.gaps||[]){let g=Math.abs(P-d[0])%tt;g>Math.PI&&(g=tt-g),A=Math.max(A,d[2]*(1-X(d[1]*.4,d[1],g)))}return A};for(let P=0;P<f;P++){const A=P/f*tt,d=Math.cos(A),g=Math.sin(A),q=Math.sign(d)*Math.pow(Math.abs(d),_),a=Math.sign(g)*Math.pow(Math.abs(g),_),m=l.a*(1+.08*n.n2(d*1.2+D,g*1.2)+.035*n.n2(d*3.4-D,g*3.4)),w=l.b*(1+.09*n.n2(d*1.2-D,g*1.2+4)+.04*n.n2(d*3.1+D,g*3.1+7)),z=(l.wob??8.5)*n.n2(d*1.6+9,g*1.6+D),k=m*q,K=x[1]*w*a+V[1]*z,I=x[2]*w*a+V[2]*z,j=.5*l.wall*s.rT*(l.even?.8+.16*d*d:.68+.46*d*d)*(1+(l.even?.2:.3)*n.n2(d*3.1+D,g*3.1-2)),G=ot(B(A)*(.85+.3*n.n2(d*5.3-D,g*5.3+3)),0,1);S.push({x:k,y:K,z:I,r:j*(1-.72*G),open:G,age:l.age??vt(l.s),fade:1-X(.3,.62,G),hang:.35+.65*X(10,-25,K),lobe:1})}await yt(h,S,{n:32,closed:!0,ref:V,kind:0,spin:.55,lobe:.24,lobeF:.055,hang:5*s.hang*(l.hangK??1),tile:52,vt:1},n,e),await e.yield(),await yt(h,S.filter((P,A)=>A%2===0),{n:20,closed:!0,ref:V,kind:1,spin:.55,rMul:1.36,lobe:.2,lobeF:.04,hang:6.5*s.hang*(l.hangK??1),tile:52,vt:1,bias:7,nu0:.41},n,e),await e.yield();const L=(P,A,d,g)=>u.dist(P+l.x,A+l.y,d-l.s)>g+12,C=(P,A,d,g,q,a,m)=>{if(!(g>l.puffMax)){dt(h,P,A,d,g,q,a,i,m);return}for(let w=0;w<3;w++){const z=i.range(0,tt),k=i.range(.4,.56);dt(h,P+Math.cos(z)*g*.5,A+Math.sin(z)*g*.45,d+i.range(-.5,.5)*g,g*k,q,a,i,m)}};for(let P=0;P<Math.round(560*(l.puffK??1)*Math.max(.85,s.dens));P++){const A=P%5===0,d=S[i.int(0,f-1)],g=i.range(0,tt),q=i.range(-1,.75),a=Math.sqrt(1-q*q),m=A?i.range(.9,1.15):i.range(.84,1.08),w=A?i.range(.5,.85):i.range(.25,.6),z=Math.cos(g)*a*d.r*m,k=q*d.r*m,K=Math.sin(g)*a*d.r*m;d.open<=.5&&L(d.x+z,d.y+k,d.z+K,d.r*w)&&C(d.x+z,d.y+k,d.z+K,d.r*w,d.age,.85,null),P%160===159&&await e.yield()}for(let P=0;P<Math.round(70*(l.puffK??1)*s.dens*s.hang);P++){const A=S[i.int(0,f-1)];if(A.hang<.5&&i.chance(.7))continue;const d=i.range(.9,1.9),g=A.r*i.range(.7,.4)*(1.3-.3*d),q=A.x+i.range(-3,3),a=A.y-A.r*d,m=A.z+i.range(-3,3);A.open<=.5&&L(q,a-5,m,g)&&C(q,a,m,g,A.age,.8,i.chance(.5)?[0,-1,i.range(4,9)]:null)}const F=kt(s.wPh+71e-5*l.s+.37),N=Math.sign(x[1])||1;if(l.curtain){const P=[];let d=0;for(let q=0;q<f;q+=2){const a=X(.2,.75,N*Math.sin(q/f*tt));a>.01&&P.push([q,a])}for(let q=0;q<P.length;q++){const a=P[q][0],m=P[q][1],w=S[a],z=S[(a-2+f)%f],k=S[(a+2)%f];q>0&&(d+=Math.hypot(w.x-S[P[q-1][0]].x,w.y-S[P[q-1][0]].y,w.z-S[P[q-1][0]].z));let K=k.x-z.x,I=k.z-z.z;const j=Math.hypot(K,I)||1;K/=j,I/=j;const G=44*Math.pow(m,.7)*(.6+.4*n.n2(d*.03+D,4.4)),Q=5*n.n2(d*.02-D,8.1);for(let o=0;o<=8;o++){const T=o/8,E=T*G,O=(2.5+5*T)*n.n2(d*.045+D,E*.06+2.7)+Q*T*T,t=w.x-I*O,c=w.y+.45*w.r+E,p=w.z+K*O,r=u.dist(t+l.x,c+l.y,p-l.s)>14;gt(h,t,c,p,-I,0,K,d,T,w.age,r?Math.pow(m,.3)*(1-.3*X(.45,1,T)):0,2,.5,0,0,d/120+.2,E/52)}}const g=h.nv-P.length*9;for(let q=0;q<P.length-1;q++)for(let a=0;a<8;a++){const m=g+q*9+a,w=m+8+1;wt(h,m,w,m+1,0),wt(h,w,w+1,m+1,0)}await e.yield()}if(l.shed){let P=0;for(let a=1;a<f;a++)S[a].y<S[P].y&&(P=a);const A=S[(P+9)%f],d=A.x+5,g=A.y-A.r-17,q=A.z+3;for(let a=0;a<30;a++){const m=Math.pow((a+F())/30,.8),w=F.range(0,tt),z=F.range(-1,1),k=Math.sqrt(1-z*z),K=J(5.2,2,m)*F.range(.8,1.15),I=d+Math.cos(w)*k*7.5*m,j=g+z*4.6*m-1.5*m*m,G=q+Math.sin(w)*k*6.5*m;L(I,j,G,K)&&dt(h,I,j,G,K,A.age,.85,F,null)}for(let a=0;a<5;a++){const m=(a+.5)/5,w=J(3,1.7,Math.sin(Math.PI*m)),z=J(A.x,d,m)+F.range(-1,1),k=J(A.y-A.r*.9,g+4,m),K=J(A.z,q,m)+F.range(-1,1);L(z,k,K,w)&&dt(h,z,k,K,w,A.age,.8,F,null)}}return Tt(h,e)}async function te(e,i,n,u,s,l){const h=Nt(),f=[0,0],M=i.range(0,90),y=i.range(0,90),v=31,V=new Float64Array(832*4).fill(-1),x=(t,c,p)=>{const r=Math.sin(t*127.1+c*311.7+p*74.7+M)*43758.5453;return r-Math.floor(r)},S=(t,c,p)=>{if(t<-13||t>12||c<-6||c>25)return x(t,c,p);const r=((c+6)*26+t+13)*4+p-1;let b=V[r];return b<0&&(b=x(t,c,p),V[r]=b),b},D=[];for(let t=0;t<=450;t+=15)u.at(t,f),D.push([t,f[0],f[1]]);const _=(t,c,p)=>{let r=9;for(const b of D){const U=b[0];if(p<=U+4)break;const H=(p-U)/(l.s-U);if(H>=1)continue;const R=Math.hypot((t-(b[1]+(l.x-b[1])*H))/(H*88+4),(c-(b[2]+(l.y-b[2])*H))/(H*50+2));R<r&&(r=R)}return r},B=(t,c)=>{let p=-1e9;for(const r of D){const b=r[0];if(c<=b+4)break;const U=(c-b)/(l.s-b);if(U>=1)continue;const H=(t-(r[1]+(l.x-r[1])*U))/((U*88+4)*1.18);if(Math.abs(H)>=1)continue;const R=r[2]+(l.y-r[2])*U+(U*50+2)*1.1*Math.sqrt(1-H*H)+1.5;R>p&&(p=R)}return p},L=(t,c,p)=>{const r=t-s.axisX(c),b=4.5*n.fbm2(t/150+M,c/150,3),U=X(-.3,.3,n.fbm2(t/170+y,c/170+5,2))*(1-.6*X(330,520,c)),H=Math.floor(t/v),R=Math.floor(c/v);let $=0;for(let bt=-1;bt<=1;bt++)for(let Ct=-1;Ct<=1;Ct++){const Mt=H+bt,At=R+Ct,Dt=(Mt+.2+.6*S(Mt,At,1))*v,Et=(At+.2+.6*S(Mt,At,2))*v,Lt=v*(.42+.26*S(Mt,At,3)),Kt=((t-Dt)*(t-Dt)+(c-Et)*(c-Et))/(Lt*Lt);Kt<1&&($=Math.max($,Math.pow(1-Kt,1.15)*(.3+.7*S(Mt,At,4))))}u.at(ot(c,0,2400),f);const Y=f[1]<-117?X(7,34,Math.abs(t-f[0])):1,Z=-110+b-3,et=B(t,c);let at=$*U*Y*24*Math.min(1.1,.55+.5*s.hang);et>-1e8&&(at=Math.min(at,Math.max(0,Z-et)));const it=Math.min(at,8*$*U*Y),lt=Z-it,rt=X(5,13,Math.hypot(t-f[0],lt-f[1])),ft=X(1,1.3,_(t,Z,c)),ht=r<0?-r-25*X(40,200,c)*(1-X(430,540,c)):r,st=1-X(176,216,ht+24*n.fbm2(c/70+y,r/110,2)),ct=X(-60,-10,c)*(1-X(360,560,c+55*n.n2(t/90,c/120+M))),pt=X(10,25,Math.hypot(t+150,c-4));return p[0]=lt,p[1]=ot(st*ct,0,1)*pt*rt*ft,p[2]=$*U,p[3]=it,p[4]=at-it,p},C=[];for(let t=-240;t<=215;t+=5)C.push(t);const F=[];for(let t=-60;t<=570;t+=5)F.push(t);const N=C.length,P=F.length,A=new Float32Array(N*P),d=new Float32Array(N*P),g=[0,0,0,0,0],q=h.nv;for(let t=0;t<P;t++){for(let c=0;c<N;c++)L(s.axisX(F[t])+C[c],F[t],g),A[t*N+c]=g[0],d[t*N+c]=g[1];t%2===1&&await e.yield()}for(let t=0;t<P;t++)for(let c=0;c<N;c++){const p=Math.max(0,c-1),r=Math.min(N-1,c+1),b=Math.max(0,t-1),U=Math.min(P-1,t+1),H=s.axisX(F[t])+C[c],R=(A[t*N+r]-A[t*N+p])/(C[r]-C[p]),$=(A[U*N+c]-A[b*N+c])/(F[U]-F[b]),Y=Math.hypot(R,1,$);gt(h,H,A[t*N+c],-F[t],R/Y,-1/Y,-$/Y,F[t],H/50,vt(F[t]),d[t*N+c],2,0,0,0,H/90,F[t]/72),c===0&&t%12===11&&await e.yield()}for(let t=0;t<P-1;t++)for(let c=0;c<N-1;c++){const p=q+t*N+c,r=p+1,b=p+N+1,U=p+N;d[t*N+c]+d[t*N+c+1]+d[(t+1)*N+c]+d[(t+1)*N+c+1]<.02||(wt(h,p,U,r,0),wt(h,r,U,b,0))}await e.yield();const a=[{s:505,a:72,b:62,r:10.5,arc:.84,tilt:.4,open:0,dx:132},{s:335,a:90,b:70,r:12,arc:.7,tilt:.2,open:1,dx:85},{s:165,a:102,b:74,r:13.5,arc:.58,tilt:.1,open:0,dx:28}],m=[];for(const t of a){const c=[],r=t.tilt*i.range(.8,1.2),b=[0,Math.cos(r),Math.sin(r)],U=[0,Math.sin(r),-Math.cos(r)],H=s.axisX(t.s)+t.dx+i.range(-14,14),R=i.range(0,40),$=(t.open?Math.PI*1.5:Math.PI*.5)+Math.PI*(1-t.arc)+i.range(-.25,.25);for(let Y=0;Y<76;Y++){const Z=Y/75,et=$+Z*tt*t.arc,at=Math.cos(et),it=Math.sin(et),lt=Math.sin(Math.PI*Z),rt=t.a*(1+.1*n.n2(Z*3+R,1.1)),ft=t.b*(1+.12*n.n2(Z*3-R,5.1)),ht=H+rt*at,st=-113+U[1]*ft*it+4*n.n2(Z*4+R,8.8),ct=-t.s+U[2]*ft*it,pt=t.r*s.rT*(.45+.55*Math.pow(lt,.5))*(1+.22*n.n2(Z*7+R,2.2)),bt=X(1,1.45,Math.min(_(ht,st,-ct),_(ht,st-2*pt,-ct),_(ht-1.5*pt,st-pt,-ct)));c.push({x:ht,y:st,z:ct,r:pt,age:vt(t.s),fade:bt*Math.pow(lt,.6)*(.72+.28*X(-.5,.2,n.n2(Z*6+R,4.4+t.s))),hang:bt,lobe:1})}await yt(h,c,{n:20,ref:b,kind:0,spin:.22,squash:.66,lobe:.24,lobeF:.04,hang:5*s.hang,tile:60,vt:1,bias:.3},n,e),await yt(h,c,{n:18,ref:b,kind:1,spin:.22,squash:.7,rMul:1.3,lobe:.3,lobeF:.035,hang:6*s.hang,tile:60,vt:1,bias:7,nu0:.3},n,e),m.push(c),await e.yield()}const w=(t,c,p)=>c>478+10*n.n2(t*.06,3.3)&&(p<.5||t<-120),z=(t,c,p,r,b,U)=>{w(t,p,b)?(i(),i(),i()):dt(h,t,c,-p,r,vt(p),U,i,null)},k=(t,c,p,r)=>_(t,c,p)>1.06&&_(t,c-r,p)>1.06&&_(t-r,c,p)>1.06&&_(t+r,c,p)>1.06&&u.dist(t,c,-p)>r+8.5,K=Math.max(.78,s.dens),I=Math.round(1700*K);for(let t=0;t<I;t++){const c=i.range(-20,545),p=i.range(-232,-96),r=i.range(2.1,4.9),b=i.range(-.1,.6),U=i();if(L(p,c,g),g[1]>.3&&U<.35+.65*g[1]){const H=g[0]-r*b-g[4]*i();k(p,H,c,r)&&z(p,H,c,r,g[1],.9)}t%150===149&&await e.yield()}const j=Math.round(2500*K);for(let t=0;t<j;t++){const c=i.range(-40,530),p=s.axisX(c)+i.range(-205,205);L(p,c,g);const r=i(),b=i.range(3.4,7)*(.8+.5*g[2])*(1-.35*r);if(g[1]<.45||g[2]<.12&&i.chance(.75))continue;const U=g[0]-r*g[4]-b*i.range(-.3,.35);k(p,U,c,b)&&z(p,U,c,b,g[1],.9),t%150===149&&await e.yield()}const G=Math.round(5200*K);for(let t=0;t<G;t++){const c=i.range(-30,560),p=s.axisX(c)+i.range(-245,215);if(L(p,c,g),g[1]>.12&&g[1]<.68){const r=i.range(2.4,5.6),b=g[0]+r*i.range(-.5,.3);k(p,b,c,r)&&z(p,b,c,r,g[1],.8)}t%150===149&&await e.yield()}for(const t of m)for(let c=0;c<Math.round(130*s.dens);c++){const p=t[i.int(6,t.length-7)],r=i.range(0,tt),b=p.r*i.range(.3,.75),U=p.x+Math.cos(r)*p.r*.9,H=p.y-Math.abs(Math.sin(r))*p.r*i.range(.4,1.3),R=p.z+i.range(-5,5);p.fade>.25&&k(U,H,-R,b)&&dt(h,U,H,R,b,p.age,.85*p.fade,i,null)}await e.yield();const Q=kt(s.wPh+.55),o=D[0],T=9,E=Math.round(40*Math.max(.85,s.dens)),O=[];for(let t=0;t<T;t++){const c=122+(t+.5+Q.range(-.28,.28))*(262/T),p=(c-o[0])/(l.s-o[0]),r=p*88+4;O.push({s:c,x:o[1]+(l.x-o[1])*p+(t%2?1:-1)*Q.range(.25,.95)*r,R:Q.range(20,33)*(.75+.25*Math.min(1,r/30)),up:Q.range(1.5,5)})}for(const t of O){for(let c=0;c<E;c++){const p=Math.pow((c+Q())/E,.75),r=Q.range(0,tt),b=t.R*p,U=t.s+Math.sin(r)*b*1.25,H=t.x+Math.cos(r)*b,R=J(11.5,3.8,Math.pow(p,.7))*Q.range(.78,1.12),$=2+c%3,Y=B(H,U);if(Q()<X(340,398,U))continue;const et=Math.max(Y,-117)+t.up+5*p*p,at=-2+p;for(let it=0;it<$;it++){const lt=Q.range(0,tt),rt=Q.range(.55,.95),ft=R*(it===0?1:Q.range(.36,.62)),ht=H+(it?Math.cos(lt)*R*rt:0),st=U+(it?Math.sin(lt)*R*rt:0),ct=et+(it?R*.6+Q.range(-.35,.3)*R:ft*.6);ct-ft*.85>B(ht,st)&&u.dist(ht,ct,-st)>ft+9&&st<400&&dt(h,ht,ct,-st,ft,vt(st),.9,Q,null,at)}}await e.yield()}await e.yield();{const t=h.k,c=h.p,p=h.n,r=h.a,b=16,U=new Map,H=[];for(let Y=0;Y<h.nv;Y+=1)t[Y*4]===3&&t[Y*4+2]===-1&&t[Y*4+3]===-1&&H.push(Y);const R=(Y,Z,et)=>Math.floor(Y/b)+4096*(Math.floor(Z/b)+64)+1048576*Math.floor(-et/b+8);for(const Y of H){const Z=R(c[Y*3],c[Y*3+1],c[Y*3+2]);let et=U.get(Z);et||U.set(Z,et=[]),et.push(Y)}await e.yield();const $=Y=>{const Z=c[Y*3],et=c[Y*3+1],at=c[Y*3+2],it=Math.min(b,1.5*p[Y*3]);let lt=!1;for(let rt=-1;rt<=1&&!lt;rt++)for(let ft=-1;ft<=1&&!lt;ft++)for(let ht=-1;ht<=1&&!lt;ht++){const st=U.get(R(Z+rt*b,et+ft*b,at+ht*b));if(st)for(let ct=0;ct<st.length;ct++){const pt=st[ct];if(pt!==Y&&Math.hypot(c[pt*3]-Z,c[pt*3+1]-et,c[pt*3+2]-at)<it){lt=!0;break}}}if(!lt&&(L(Z,-at,g),g[1]<.6||g[0]-et>p[Y*3]))for(let rt=0;rt<4;rt++)r[(Y+rt)*4+3]=0};for(let Y=0;Y<H.length;Y++)$(H[Y]),Y%100===99&&await e.yield()}return Tt(h,e)}async function ee(e,i){const u=new Uint8Array(262144),s=[[4,8,16,32,64],[5,10,20,40,80],[3,6,12,24,48]];for(let h=0;h<3;h++){const f=new Float32Array(65536);let M=1;for(const x of s[h]){const S=new Float32Array(x*x),D=new Float32Array(x*x);for(let m=0;m<x*x;m++){const w=i()*tt;S[m]=Math.cos(w),D[m]=Math.sin(w)}const _=new Float64Array(256),B=new Float64Array(256),L=new Int32Array(256),C=new Int32Array(256);for(let m=0;m<256;m++){const w=m/256*x,z=Math.floor(w),k=w-z;_[m]=k,B[m]=k*k*k*(k*(k*6-15)+10),L[m]=z%x,C[m]=(z+1)%x}const F=new Float64Array(256),N=new Float64Array(256),P=new Float64Array(256),A=new Float64Array(256),d=new Float64Array(x),g=new Float64Array(x);let q=-1;const a=(m,w)=>{for(let z=m;z<w;z++){const k=z/256*x,K=Math.floor(k),I=k-K,j=I*I*I*(I*(I*6-15)+10),G=K%x*x,Q=(K+1)%x*x;if(K!==q){q=K;for(let o=0;o<256;o++){const T=_[o],E=L[o],O=C[o];F[o]=S[G+E]*T,N[o]=S[G+O]*(T-1),P[o]=S[Q+E]*T,A[o]=S[Q+O]*(T-1)}}for(let o=0;o<x;o++)d[o]=D[G+o]*I,g[o]=D[Q+o]*(I-1);for(let o=0,T=z*256;o<256;o++,T++){const E=B[o],O=L[o],t=C[o],c=F[o]+d[O],p=N[o]+d[t],r=P[o]+g[O],b=A[o]+g[t];f[T]+=M*J(J(c,p,E),J(r,b,E),j)}}};for(let m=0;m<256;m+=32)a(m,m+32),await e.yield();M*=.55}await e.yield();const y=[];for(let x=0;x<256*256;x+=13)y.push(f[x]);y.sort((x,S)=>x-S),await e.yield();const v=y[Math.floor(y.length*.01)],V=y[Math.floor(y.length*.99)];for(let x=0;x<256*256;x++)u[x*4+h]=Math.round(ot((f[x]-v)/(V-v),0,1)*255);await e.yield()}for(let h=0;h<256*256;h++)u[h*4+3]=255;const l=new W.DataTexture(u,256,256,W.RGBAFormat);return l.wrapS=l.wrapT=W.RepeatWrapping,l.minFilter=W.LinearMipmapLinearFilter,l.magFilter=W.LinearFilter,l.generateMipmaps=!0,l.needsUpdate=!0,l}const ae=`
attribute vec4 aA; attribute vec4 aK; attribute vec2 aQ;
uniform float uTime;
varying vec3 vN; varying vec3 vWp; varying vec4 vA; varying vec4 vK; varying vec2 vQ; varying vec2 vNuv;
#include <fog_pars_vertex>
void main() {
  float kind = aK.x;
  vec3 p = position; vec4 a = aA; vec2 q = vec2(0.0); vec2 nuv = aQ; vec3 nrm = vec3(0.0, 1.0, 0.0);
  vec4 mvPosition;
  if (kind > 2.5 && kind < 3.5) {
    // lit puff: a billboard about its centre. normal = (size, phase, drift length), aQ = drift direction
    float size = normal.x, ph = normal.y, dl = normal.z, moving = step(0.01, dl);
    float life = fract(uTime * 0.05 + ph);
    p.xy += aQ * dl * life * moving;
    // a lump seated in a wandering tube (drift length -1, aQ.x = metres along) sways with it, or it is left hanging in clear air
    float ride = step(dl, -0.5), rw = (0.25 + 5.0 * aA.z) * ride;
    p.x += sin(aQ.x * 0.019 + uTime * 0.27) * rw;
    p.y += sin(aQ.x * 0.023 - uTime * 0.21 + 2.0) * rw * 0.7;
    p.y -= (1.0 - moving) * 0.9 * sin(uTime * 0.23 + ph * 6.2832);
    float sz = size * (1.0 + 0.07 * sin(uTime * 0.31 + ph * 40.0)) * mix(1.0, 0.45 + 0.95 * life, moving);
    a.w *= mix(1.0, sin(3.14159 * life), moving);
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vWp = wp.xyz;
    mvPosition = viewMatrix * wp;
    // the canyon's peeling wisps (aK.y = 1) are drawn out along their drift: a round one near the lens reads as a pom-pom
    float ice = step(0.5, aK.y) * step(aK.y, 0.9);                                // falling ice (flag 0.75): a finer, longer streak
    vec2 dr = aQ / max(length(aQ), 1e-4), st = vec2(aK.z * mix(2.6, 3.4, ice), aK.w * mix(0.5, 0.42, ice));
    mvPosition.xy += mix(aK.zw, dr * st.x + vec2(-dr.y, dr.x) * st.y, moving * step(0.5, aK.y)) * sz;
    q = aK.zw; nuv = aA.xy;
    nrm = vec3(size, 1.0, 0.0);                                               // a puff has no normal to pass: it sends its size (m)
  } else if (kind > 3.5) {
    // curtain fibre: a strip about its own spine that always faces the lens. normal = (half width, phase, azimuth of the curtain's normal)
    float hw = normal.x, ph = normal.y, f = aA.y;
    vec3 sn = vec3(cos(normal.z), 0.0, sin(normal.z));
    float wa = (0.25 + 5.0 * aA.z) * step(0.75, abs(aK.y));                   // it rides the wander of the tube beneath it
    p.x += sin(aA.x * 0.019 + uTime * 0.27) * wa;
    p.y += sin(aA.x * 0.023 - uTime * 0.21 + 2.0) * wa * 0.7;
    // the fibres sway and ripple, more toward their tips
    p += sn * sin(aA.x * 0.06 + uTime * 0.4 + ph * 6.2832) * 1.6 * f;
    p += vec3(-sn.z, 0.0, sn.x) * sin(aA.x * 0.11 - uTime * 0.31 + ph * 21.0) * 0.9 * f;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec3 tc = cameraPosition - wp.xyz; float dc = max(length(tc), 1e-3);
    vec3 sv = cross(vec3(0.0, 1.0, 0.0), tc / dc);                            // level, across the line of sight
    sv /= max(length(sv), 0.08);                                              // seen from straight below a fibre narrows, it does not spin
    float hwT = hw * (1.0 + 0.25 * f), hwE = max(hwT, dc * 0.0032);          // never thinner than about a pixel and a half: dimmer instead
    wp.xyz += sv * aK.z * hwE;
    vWp = wp.xyz;
    mvPosition = viewMatrix * wp;
    // where the curtain runs along the line of sight its fibres stack into a column: there it thins away instead
    vec2 sw = (mat3(modelMatrix) * sn).xz, th = tc.xz;
    float face = abs(dot(sw / max(length(sw), 1e-4), th / max(length(th), 1e-3)));
    q = vec2(aK.z, smoothstep(0.1, 0.55, face) * hwT / hwE);
    nuv = aQ + vec2(aK.z * hw * 0.035, -uTime * 0.011);                       // streaks 10:1 up the fibre, lifting slowly
  } else {
    // slow billow of the lobes, a wandering braid on the tubes
    float tube = step(kind, 1.5), sheet = step(1.5, kind) * step(kind, 2.5);
    // one wave along (25 m, eight vertices a cycle) shaped round the tube: a product of two waves along beat at 8 m, which the 3 m
    // grid cannot carry, and folded the surface into flat facets with chevroned streaks at the 22 m pass
    float w1 = sin(aA.x * 0.25 + uTime * 0.33 + aA.y * 12.566) * (0.6 + 0.4 * sin(aA.y * 6.2832 - uTime * 0.19 + 1.7));
    float w2 = sin(aA.x * 0.085 + uTime * 0.27 + aA.y * 3.1) * sin(aA.x * 0.031 - uTime * 0.17 + aA.y * 1.3);
    p += normal * (w1 * tube * (0.2 + 1.3 * aA.z) * (1.0 + 0.6 * kind) + w2 * sheet * 2.2);
    float free = tube * step(0.75, abs(aK.y));
    float wa = (0.25 + 5.0 * aA.z) * free;
    p.x += sin(aA.x * 0.019 + uTime * 0.27) * wa;
    p.y += sin(aA.x * 0.023 - uTime * 0.21 + 2.0) * wa * 0.7;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vWp = wp.xyz;
    mvPosition = viewMatrix * wp;
    nrm = mat3(modelMatrix) * normal;
  }
  vN = nrm; vA = a; vK = aK; vQ = q; vNuv = nuv;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oe=`
uniform sampler2D uNoise;
uniform float uTime, uGain, uHalo, uStreak, uSheet, uBump, uCrease;
uniform vec2 uFar;
uniform vec3 uSunDir, uBody, uRim, uShade, uSky;
varying vec3 vN; varying vec3 vWp; varying vec4 vA; varying vec4 vK; varying vec2 vQ; varying vec2 vNuv;
#include <fog_pars_fragment>
void main() {
  float kind = vK.x, spin = vK.y;
  // (back faces of the tubes are not discarded: their alpha already falls to nothing with the smooth normal's facing ratio, and a
  // discard by triangle cut the lumpy outline of a tube seen end-on into saw teeth)
  bool puff = kind > 2.5 && kind < 3.5;
  float r2 = dot(vQ, vQ);
  if (puff && r2 > 1.0) discard;
  vec3 V = cameraPosition - vWp; float dist = length(V); V /= max(dist, 1e-3);
  float age = vA.z, fade = vA.w, tube = step(kind, 1.5), sgn = spin < 0.0 ? -1.0 : 1.0;
  // four octaves from one tile. On the tubes every octave turns about the core at the same rate, so the surface rolls.
  // a large puff takes twice the noise across it, so its outline is torn into lobes (at 0.16 a 6 m puff was one airbrushed disc)
  // (a bead on a young jet, age under 0.1, is torn from 0.8 m up: as a round disc it was a ball on a string)
  float ypB = puff ? 1.0 - smoothstep(0.09, 0.13, vA.z) : 0.0;
  float bigP = puff ? smoothstep(mix(1.8, 0.8, ypB), mix(4.2, 1.8, ypB), vN.x) : 0.0;
  vec2 uv = puff ? vQ * mix(0.16, 0.33, bigP) + vA.xy * 9.0 : vNuv;
  // COTTON: everything older than the four jets is soft lumpy cloud. The wound tubes of the waves and the canyon (cotF) are shaded
  // like the rings: billowed relief, creases, a wide wrap of light, and the helical streaks only a faint modulation of it
  float cot = tube * smoothstep(0.105, 0.135, age), cotF = cot * step(0.75, abs(spin));
  // the ropes of the waves and the canyon roll fast enough to see which way the wake winds (both inner walls going down)
  // (a puff's flag is not a spin: only a wisp, 1, and a head of the crown, -1..-2, scroll their noise, at the one rate they always had)
  float rollS = puff ? (spin > 0.5 ? 1.0 : (spin < -0.5 ? -1.0 : 0.0)) : spin;
  vec2 roll = vec2(0.0, -rollS * uTime * mix(0.075, 0.12, cotF)) * step(kind, 3.5), drift = vec2(uTime * 0.0022, uTime * 0.0013) * (1.0 - tube);
  float n1 = texture2D(uNoise, uv + roll + drift).r;
  float n2 = texture2D(uNoise, uv * 3.0 + roll * 3.0 - drift * 2.0).g;
  float n3 = texture2D(uNoise, uv * 9.0 + roll * 9.0 + drift * 5.0).b;
  float n4 = texture2D(uNoise, uv * 23.0 + roll * 23.0).r;
  // helical fibres: noise stretched along the lines the vortex winds (two samples, coarse and fine)
  float h1 = texture2D(uNoise, vec2(3.0 * vA.y + 3.0 * roll.y - sgn * vA.x / 12.5664, vNuv.x)).b;
  float h2 = texture2D(uNoise, vec2(7.0 * vA.y + 7.0 * roll.y - sgn * vA.x / 6.2832, vNuv.x * 2.0 + 0.37)).b;
  // billows for the relief: the coarse octaves only (three mip levels up), folded so lumps are round and creases sharp
  float bil = min(1.0, abs(2.0 * texture2D(uNoise, uv * 2.0 + roll * 2.0 + drift, 3.0).g - 1.0) * 1.15
    + abs(2.0 * texture2D(uNoise, uv * 6.0 + roll * 6.0 + 0.31, 2.0).r - 1.0) * 0.5);
  float bs = smoothstep(0.0, 0.7, bil);          // soft-shouldered: creases shade gently instead of drawing veins
  // (within 70 m of the lens a tube's folds are wide valleys between round tops, not thin lines: there the shade of a fold begins
  // higher up its sides. Thin dark folds on a broad lit surface were the veins of marble.)
  bs = mix(smoothstep(0.1, 0.92, bil), bs, max(smoothstep(22.0, 70.0, dist), 1.0 - step(kind, 1.5)));
  // derivatives are taken here, outside every branch (Direct3D). ex, ey: the step between neighbouring pixel rays, which does
  // not depend on the triangle under the pixel (derivatives of the position do, and showed the mesh as facets)
  vec3 ex = -dFdx(V), ey = -dFdy(V);
  float dbx = dFdx(bil), dby = dFdy(bil), kpx = max(length(ex), 1e-6);
  ex /= kpx; ey /= max(length(ey), 1e-6);
  float fl = texture2D(uNoise, vec2(vA.x * 0.021 - uTime * 0.9, vA.y * 0.5 + 0.3)).b;
  float fbm = n1 * 0.5 + n2 * 0.27 + n3 * 0.15 + n4 * 0.08, fine = n3 * 0.6 + n4 * 0.4, fib = smoothstep(0.22, 0.78, h1 * 0.55 + h2 * 0.45);
  // stripes belong to the wound tubes: faint on the fresh jets (soft and flickering), fading again on the old rings (lumps)
  float sAmt = min(abs(spin), 1.0) * uStreak * tube * mix(1.0, 0.45, smoothstep(0.4, 0.62, age)) * mix(0.4, 1.0, smoothstep(0.03, 0.12, age));
  sAmt = min(sAmt, mix(3.0, 1.2, smoothstep(0.27, 0.33, age)));            // on the waves the rolls are old enough to be soft
  sAmt *= (1.0 - 0.8 * cotF) * mix(1.0, smoothstep(25.0, 70.0, dist), cotF);   // (no streaks beside the lens: there they drew the wall out along its length)
  // the jets are taut round ropes from a few metres behind their birth (when this waited for age 0.1, the 200 m of jet nearest
  // the aircraft were lit as flat bands)
  float young = tube * (1.0 - cot) * smoothstep(0.003, 0.02, age);
  vec3 N = vN; float nl = length(N); N = nl > 1e-4 ? N / nl : vec3(0.0, 1.0, 0.0);
  float facing;
  if (puff) {
    vec3 nv = normalize(vec3(vQ * mix(0.7, 0.5, bigP) + (vec2(n2, n3) - 0.5) * mix(0.8, 1.5, bigP), 1.0 - 0.45 * r2));   // (a large puff is lit as several heads, not as one ball)
    N = normalize((vec4(nv, 0.0) * viewMatrix).xyz + vec3(0.0, 1e-5, 0.0));
    facing = nv.z;
  } else if (kind > 3.5) {
    N = normalize(V + vec3(0.0, 0.5, 0.0)); facing = 1.0;                     // a fibre has no side: lit as thin haze
  } else {
    float d = dot(N, V);
    if (kind > 1.5 && d < 0.0) { N = -N; d = -d; }
    facing = clamp(d, 0.0, 1.0);
    // the sheet is a coarse height field: light it by its noise more than by its facets, or the triangles show at 20 m
    if (kind > 1.5 && kind < 2.5) N = normalize(N * 0.55 + vec3((n1 - 0.5) * 1.6, N.y < 0.0 ? -0.6 : 0.6, (n2 - 0.5) * 1.6));
    // cauliflower relief on the tubes: the billows as a height field (metres) whose slope across the view tilts the normal.
    // Old cloud is lumpy, the young tubes stay taut.
    if (kind < 1.5) {
      float bk = uBump * mix(mix(0.2, 0.85, young), 1.0, max(smoothstep(0.15, 0.5, age), cotF)) * mix(1.0, 0.4 + 0.6 * smoothstep(25.0, 110.0, dist), cotF) * facing / max(dist * kpx, 1e-4);
      // within 110 m the valleys between billows are rounded (the slope goes to nothing at the crease): the fold of the noise is a
      // cusp, and at close range each cusp was a thin dark vein across the wall (the marbling)
      float vein = mix(min(1.0, 2.2 * bil), 1.0, smoothstep(40.0, 110.0, dist));
      dbx *= vein; dby *= vein;
      // (ON THE WOUND ROPES THE TILT IS CAPPED BY DISTANCE: none within 15 m, at most 0.9 by 45 m, free beyond 150 m. A wall seen
      // along its length has its billows foreshortened into bands a pixel wide; their slope, uncapped, threw the normal right over
      // from band to band, and beside the lens each wall carried fans of straight hard blades of lilac, blue and gold)
      vec3 tb = (dbx * ex + dby * ey) * min(bk, 60.0);
      tb *= mix(1.0, min(1.0, (0.9 * smoothstep(15.0, 45.0, dist) + 59.0 * smoothstep(60.0, 150.0, dist)) / max(length(tb), 1e-4)), cotF);
      N = normalize(N - tb + vec3(0.0, 1e-6, 0.0));
      // beside the lens old cloud is lit as the puffs are, by the view and the noise and hardly by the mesh: the raw vertex
      // normals of 1.6 m quads showed as hard triangular shards of shadow in the nearest stretch of rope
      // (on the wound ropes out to 75 m: the canyon's walls are looked along for all of that)
      float nearN = (1.0 - smoothstep(mix(16.0, 30.0, cotF), mix(46.0, 75.0, cotF), dist)) * max(cot, smoothstep(0.3, 0.5, age));
      // (a normal that faces the lens, tilted by the slope of the billows at full strength: every lump keeps a lit and a shadow side)
      // (the tilt is capped: on a wall seen along its length the billows are foreshortened into bands, and an uncapped slope
      // drew them as stripes)
      vec3 tl = (dbx * ex + dby * ey) * min(uBump * 1.5 * (0.3 + 0.7 * facing) / max(dist * kpx, 1e-4), 60.0);
      tl *= min(1.0, 0.5 / max(length(tl), 1e-4));
      vec3 nn = normalize(V * 0.7 - tl + vec3(n2 - 0.5, 0.0, n3 - 0.5) * 0.7 + vec3(0.0, 1e-4, 0.0));
      N = normalize(mix(N, nn, nearN * 0.85) + vec3(0.0, 1e-3, 0.0));
    }
  }
  // density: the depth of cloud a ray crosses in a tube goes with the facing ratio, so every outline is soft; noise and fibres vary it
  // (the streaks are in the light, hardly in the density: at 1.7 the sky showed between the bands and a roll read as slatted cloth)
  float dens = clamp(1.0 + (fbm - 0.5) * mix(2.2, 3.4, age) + (fib - 0.5) * 0.5 * sAmt, 0.0, 3.0);
  // the tubes of the waves and the canyon have no holes (where the noise ran low the sky showed through the wall as a dark lens)
  dens = max(dens, 0.55 * tube * smoothstep(0.02, 0.1, age) * (1.0 - smoothstep(0.44, 0.52, age)));
  float hole = fbm * 1.7 - 0.35 + (fade - 1.0) * (0.5 + 1.5 * fine);
  // a ring's curtain (flag 0.5) is one veil: whole where its fade is whole, torn only as the fade falls toward its top
  float curt = step(1.5, kind) * step(kind, 2.5) * step(0.25, spin);
  hole = mix(hole, fbm + 0.25 + (fade - 1.0) * (1.0 + 2.2 * fine), curt);
  // A YOUNG JET IS A KNOTTED ROPE: its core is eaten by the two coarse octaves (knot), from the outline inward, right through
  // where they run lowest, so it swells and necks and the deck shows in the necks; its sheath is eaten the same way and thinner.
  // (Smooth, with beads set along it, each jet was a stroke of paint with balls on it.)
  float knot = n1 * 0.6 + n2 * 0.4;
  float a;
  // silhouettes are eaten by the noise (no outline is ever a clean polygon edge); the halo shell is for distance only: within
  // 160 m it thins away (gone by 45 m), or the near wall of a ring shows a glassy second outline
  // (the core of a rope thins out from 42 m of the lens and is gone at 14: beside us it dissolves and its puffs carry the outline)
  if (kind < 0.5) a = (1.0 - exp(-smoothstep(0.04, 0.6, facing) * dens * mix(3.0, 6.5, age))) * smoothstep(0.0, mix(0.35, 0.5, cotF), facing + (fbm - 0.5) * mix(0.5 + 0.3 * young, 0.9, cotF)) * mix(1.0, smoothstep(14.0, 42.0, dist), cotF) * mix(1.0, smoothstep(0.34, 0.6, knot + 0.22 * facing), young * 0.9);
  else if (kind < 1.5) a = (1.0 - exp(-smoothstep(0.2, 0.9, facing) * dens * 1.7)) * uHalo * smoothstep(0.25, 0.6, fbm + facing * 0.6) * mix(0.22 * smoothstep(0.36, 0.62, knot + 0.15 * facing), 1.0, max(smoothstep(0.08, 0.12, age), cot))
    * mix(1.0, smoothstep(45.0, 160.0, dist) * mix(min(1.0, smoothstep(0.38, 0.7, fbm) * 1.5), 1.0, smoothstep(140.0, 320.0, dist)), max(smoothstep(0.06, 0.2, age), cot));
    // (within 140 m: torn wisps, not a shell. The fresh jets, age under 0.06, keep their soft sheath at any range)
  // THE SHEET SEEN ALONG ITS SPAN: a flat sheet looked at sideways (far more across the track than along it) has its texture drawn
  // out along the track, and from under the vault its wings were smears streaming to the vanishing point. The cure is in the sheet's
  // own coordinates: its noise is laid a little shorter along the track than across (72 m to 90). Nothing thins the sheet by the
  // direction it is seen from.
  else if (kind < 2.5) a = smoothstep(0.3, 0.68, hole) * smoothstep(0.3, 0.6, fbm + facing * 2.0) * uSheet * mix(0.5, 1.0, smoothstep(20.0, 80.0, dist))
    * (1.0 - 0.45 * step(0.25, spin));   // (a ring's curtain, flag 0.5, is a thinner veil)
  else if (kind < 3.5) {
    // eroded hard enough that a small puff never reads as a disc; a bead on a young jet (age under 0.1) harder still, so its outline
    // is the noise's and it reads as a lump of the rope (at night, pale on black, the softer edge showed as a disc)
    float ypE = 1.0 - smoothstep(0.09, 0.13, age);
    a = 0.9 * smoothstep(0.0, 0.5, (1.0 - sqrt(r2)) * (0.12 + mix(1.85, 2.2, ypE) * (n1 * 0.4 + n2 * 0.36 + n3 * 0.24)) - mix(0.1, 0.24, ypE));
    // a puff over about 2 m: its OUTLINE is the noise (the radius of its edge runs from 0.45 to 0.98 round it, so it is a torn
    // clump of heads with a soft edge), and its body is eaten into as well. As a soft disc with a noisy rim it was a cotton ball.
    float pe = 0.5 + 1.05 * clamp(n1 * 0.62 + n2 * 0.38 - 0.22, 0.0, 0.5), pd = sqrt(r2);
    // (a head in the middle of a clump of the vault's crown, flag toward -2, keeps a solid body inside its torn outline: eaten into
    // like the rest, a clump was a spatter of small pieces with the sky showing through it)
    float solid = spin < -0.5 ? 0.85 * clamp(-spin - 1.0, 0.0, 1.0) : 0.0;
    float aBig = 0.92 * smoothstep(0.0, 0.4, pe - pd) * mix(smoothstep(-0.05, 0.3, n2 * 0.55 + n3 * 0.45 - 0.3 + (1.0 - pd) * 0.55), 1.0, solid);
    a = mix(a, aBig, bigP);
    // a drawn-out wisp is a soft streak (as an eroded disc it crossed the canyon as a solid petal), and it thins out beside the lens
    float sw = (1.0 - r2) * (1.0 - r2);
    // falling ice (flag 0.75) is a faint fall with grains glinting in it (drawn as solidly as a wisp it was a row of needles)
    if (spin > 0.5) a = 0.75 * sw * mix(smoothstep(0.38, 0.8, n1 * 0.2 + n2 * 0.4 + n3 * 0.4 + 0.12 * sw), 0.2 + 0.8 * smoothstep(0.56, 0.8, n3) * smoothstep(0.4, 0.7, n4), step(spin, 0.9)) * mix(1.0, 0.5, step(spin, 0.9)) * smoothstep(5.0, 16.0, dist);   // (the ice at half strength; shed ice is where it falls, and like a wisp it only fades out from 16 m to 5 m of the lens)
  }
  else {
    // curtain fibres: no floor under the alpha. Soft across the strip, eroded into finer threads, gone toward the tip (fade),
    // where the curtain is seen end-on (vQ.y) and beside the lens
    float px = 1.0 - vQ.x * vQ.x;
    a = 0.46 * px * px * vQ.y * smoothstep(0.3, 0.85, n1 * 0.45 + n2 * 0.55 + (fade - 0.5) * 0.5) * smoothstep(25.0, 90.0, dist);
  }
  if (kind < 1.5 || kind > 2.5) a *= fade;
  // the jets freeze out of clear air in flickers
  float fresh = (1.0 - smoothstep(0.0, 0.028, age)) * tube;
  a *= mix(1.0, smoothstep(0.3, 0.62, fl + (1.0 - fresh) * 0.5), fresh);
  a *= smoothstep(2.5, 8.0, dist) * (1.0 - smoothstep(uFar.x, uFar.y, dist));   // (uFar: the rings round the exit come out of the haze late)
  // light: a low red sun wrapped far round the body, forward scattering when we look toward it, lilac only in the folds
  // the young tubes are round rolls: a steeper wrap, undersides coral in the low sun, tops lilac from the sky, a terminator between
  float wrap = smoothstep(mix(-0.72, -0.4, young), mix(0.8, 0.88, young), dot(N, uSunDir));
  // sunUp: the light is high (the night's moon, 50 degrees up; 0 at dawn and dusk, whose sun is below level). Then the tops of the
  // jets are already their lit side, and the hot crest and the thinner lilac top that the low sun's jets are given would wash
  // them out flat: under the moon they keep the light they had
  float sunUp = smoothstep(0.1, 0.5, uSunDir.y);
  float roll2 = (0.3 * smoothstep(0.0, 0.8, -N.y) - mix(0.42, mix(0.15, 0.26, sunUp), young) * smoothstep(0.05, 0.75, N.y)) * max(young, 0.3 * cotF);
  // a jet is lit round: its middle holds the body colour (hotter where the ray crosses the most cloud), the flank turned from the
  // sun goes lilac, the sunward flank brightens. (A lilac TOP was tried: from behind and above, where the jets are seen at a
  // grazing angle, the whole band is top, and the four jets went pale.)
  // (the crest is hot on every jet seen from a distance, 0.38: at 0.25, with a lilac top, the pair on the far side of the sun was
  // a blue-white ribbon. Within 40 m of the lens it stays 0.25: a jet that fills a corner of the picture is not one hot stroke)
  float crestK = smoothstep(40.0, 150.0, dist) * (1.0 - sunUp);
  roll2 += young * (0.1 + mix(0.25, 0.38, crestK) * facing * facing - 0.2 * smoothstep(-0.1, 0.7, -dot(N, uSunDir)));
  float vs = max(dot(-V, uSunDir), 0.0), trans = vs * vs;
  // a jet between the lens and the sun is thin enough for the light to come through its middle: a hot crest there too, lilac
  // only on its flanks (lit from the front alone, that pair was a blue ribbon with white edges)
  roll2 += young * trans * (0.12 + 0.42 * facing * facing) * mix(0.35, 1.0, crestK);
  float thin = kind < 0.5 ? 0.5 : (kind < 1.5 ? 0.9 : (kind < 2.5 ? 0.5 : (kind < 3.5 ? 0.6 : 1.0)));
  // old tubes near the lens: lump tops coral, creases lilac (the cauliflower); far off the whole trail simply blazes
  float farK = smoothstep(250.0, 650.0, dist), oldK = tube * max(smoothstep(0.3, 0.55, age), cotF) * (1.0 - smoothstep(70.0, 240.0, dist));
  // near the lens the fine octaves are held back (they marbled a wall with veins): relief there comes from the billows
  float nearK = (1.0 - smoothstep(45.0, 120.0, dist)) * (puff ? 1.0 : tube);
  // a rope between the lens and the sun, close by: the light comes THROUGH it in patches (as flat lilac it was a pane of glass)
  // HEADS: a puff over a metre across, near the lens, is shaded as a heap of heads by the billow field: tops lit and creases dark
  // when the light falls on it, and the other way round (dark bodies, glowing creases) when the light comes through it
  float headP = puff ? (1.0 - smoothstep(30.0, 95.0, dist)) * smoothstep(1.0, 2.2, vN.x) : 0.0;
  float nearC = mix(1.5, 1.0, smoothstep(25.0, 60.0, dist));
  // a bead on a young jet (a puff of age under 0.1): the rope's own body colour and hardly any pale rim, so it is a lump of the rope
  // (with a pale rim and a lilac face, seen from above against the hot core, it was a cotton ball on a string)
  float yp = puff ? 1.0 - smoothstep(0.09, 0.13, age) : 0.0;
  // a clump of the vault's crown (spin -1) seen from below has a shadowed belly inside its lit rim
  // (deeper toward the middle of its clump, flag -2; the rim of every head keeps its light)
  float belly = (puff && spin < -0.5) ? smoothstep(0.2, 0.75, -V.y) * (1.0 - r2) * (0.75 + 0.9 * clamp(-spin - 1.0, 0.0, 1.0)) : 0.0;
  // a head seated in a gulf between two lobes of a canyon wall (flag 0..0.45): in the lobes' shadow
  float gulf = (puff && spin > 0.0 && spin < 0.5) ? spin * 2.2 : 0.0;
  float nearT = tube * (1.0 - smoothstep(20.0, 75.0, dist)) * max(cot, smoothstep(0.3, 0.5, age)) * trans * clamp(0.75 * fbm + 0.3 * bs - 0.22, 0.0, 0.6);
  float lit = clamp(0.15 + roll2 + nearT + (puff ? 0.14 + 0.12 * yp + 0.2 * max(-N.y, 0.0) + 0.22 * step(0.5, spin) : 0.0) + 0.2 * farK + (bs - 0.65) * 0.24 * uCrease * oldK * nearC + (bs - 0.6) * 0.3 * headP * (1.0 - 1.7 * trans) - 0.26 * belly - 0.33 * gulf * (0.5 + 0.5 * uCrease) + (bs - 0.62) * 0.26 * young + mix(0.62, 0.46, young) * wrap + trans * 0.3 * thin + (fine - 0.5) * mix(0.3, 0.12, nearK) + (fbm - 0.5) * mix(0.45, 0.3, nearK) + (fib - 0.5) * 0.55 * sAmt, 0.0, 1.0);   // streaks tint the roll, they do not paint it (at full strength the canyon walls were flat zebra wedges)
  vec3 mid = uBody * 0.74 + uShade * 0.12;
  // beside the lens (within 95 m, wholly within 25) the folds of cloud are a dusky mauve, a soft shadow between the heads: in the full lilac of
  // the far shadow side, next to the coral, they were blue veins
  float softK = tube * (1.0 - smoothstep(25.0, 95.0, dist)) * max(max(cot, smoothstep(0.3, 0.5, age)), young);
  vec3 shadeC = mix(uShade, uShade * 0.55 + uBody * 0.3, 0.75 * softK);
  vec3 col = mix(mix(shadeC, mid, clamp(lit * 2.0, 0.0, 1.0)), uBody, clamp(lit * 2.0 - 1.0, 0.0, 1.0));
  col *= mix(1.0, 0.7 + 0.6 * fbm, step(1.5, kind) * step(kind, 2.5));
  col *= (1.0 + 0.5 * farK) * mix(1.0, 1.0 - (0.16 - 0.2 * bs) * uCrease * nearC, oldK) * mix(1.0, 0.84 + 0.24 * bs, headP);
  col += uSky * (0.5 + 0.5 * N.y);
  float rim = (puff || kind < 1.5) ? pow(1.0 - facing, 3.0) : (kind < 2.5 ? (1.0 - smoothstep(0.0, 0.2, hole - 0.3)) * (spin > 0.25 ? 0.2 : 0.7) : (1.0 - fade) * 0.22);   // (a curtain fibre's tip takes only a little gold: at 0.5 the tips outshone the roots and read as spikes)
  // on the tubes the rim is torn by the noise and held back near the lens: an unbroken highlight along a smooth outline is
  // what made a ring wall read as wrapped plastic
  rim *= (0.12 + 0.88 * trans) * mix(1.0, 0.6 * smoothstep(0.3, 0.7, fbm) * mix(0.4, 1.0, smoothstep(40.0, 200.0, dist)), tube);
  rim *= mix(1.0, smoothstep(20.0, 70.0, dist), cotF) * (1.0 - 0.5 * young);   // no gold edge on a rope beside the lens (it drew the mesh), half of it on a jet
  if (puff && spin > 0.5 && spin < 0.9) col = mix(col, uRim, 0.55);              // falling ice glints pale gold, it is not cloud
  // (a young jet's edge brightens toward its own body colour, not toward the pale gold of the old cloud's rims)
  vec3 rimC = mix(uRim, uBody * 1.25, young);
  col = mix(col, rimC, clamp(rim, 0.0, 0.7 - 0.54 * yp)) * uGain;
  gl_FragColor = vec4(col * a + rimC * rim * 0.2 * min(a * 3.0, 1.0) * tube, a);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor * a, fogFactor);
  #endif
}`;function ne(){return{p:[],n:[],c:[],a:[],f:[],idx:[]}}async function xt(e,i,n,u,s={}){const l=n+1,h=e.p.length/3,f=new Float32Array(i*l*3),M=new Float32Array(i*l*3),y={x:0,y:0,z:0,r:.7,g:.7,b:.7,p0:9,p1:0,p2:0,p3:0,fx:0};let v=0,V=0,x=0;for(let C=0;C<i;C++)for(let F=0;F<=n;F++){u(C,s.wrap?F%n:F,y,F);const N=(C*l+F)*3;f[N]=y.x,f[N+1]=y.y,f[N+2]=y.z,v+=y.x,V+=y.y,x+=y.z,e.c.push(y.r,y.g,y.b),e.a.push(y.p0,y.p1,y.p2,y.p3),e.f.push(y.fx)}s.pause&&await s.pause();const S=i*l,D=s.ref||[v/S,V/S,x/S];let _=0;for(let C=0;C<i;C++)for(let F=0;F<=n;F++){const N=Math.max(0,C-1),P=Math.min(i-1,C+1),A=s.wrap?(F%n-1+n)%n:Math.max(0,F-1),d=s.wrap?(F%n+1)%n:Math.min(n,F+1),g=(N*l+F)*3,q=(P*l+F)*3,a=(C*l+A)*3,m=(C*l+d)*3,w=(C*l+F)*3,z=f[q]-f[g],k=f[q+1]-f[g+1],K=f[q+2]-f[g+2],I=f[m]-f[a],j=f[m+1]-f[a+1],G=f[m+2]-f[a+2];let Q=k*G-K*j,o=K*I-z*G,T=z*j-k*I;const E=Math.hypot(Q,o,T);E>1e-9?(Q/=E,o/=E,T/=E):(Q=0,o=0,T=0),M[w]=Q,M[w+1]=o,M[w+2]=T,_+=Q*(f[w]-D[0])+o*(f[w+1]-D[1])+T*(f[w+2]-D[2])}s.pause&&await s.pause();const B=_<0!=!!s.inward,L=B?-1:1;for(let C=0;C<S;C++){let F=M[C*3]*L,N=M[C*3+1]*L,P=M[C*3+2]*L;if(F===0&&N===0&&P===0){const A=f[C*3]-D[0],d=f[C*3+1]-D[1],g=f[C*3+2]-D[2],q=Math.hypot(A,d,g)||1,a=s.inward?-1:1;F=a*A/q,N=a*d/q,P=a*g/q}e.p.push(f[C*3],f[C*3+1],f[C*3+2]),e.n.push(F,N,P)}for(let C=0;C<i-1;C++)for(let F=0;F<n;F++){const N=h+C*l+F,P=N+l,A=P+1,d=N+1;B?e.idx.push(N,d,P,P,d,A):e.idx.push(N,P,d,P,A,d)}}function jt(e,i,n,u){const s=i/2,l=e<=s,h=l?.5*(1+Math.cos(Math.PI*e/s)):.5*(1-Math.cos(Math.PI*(e-s)/s)),f=5*n*(.2969*Math.sqrt(h)-.126*h-.3516*h*h+.2843*h*h*h-.1036*h*h*h*h);return u[0]=h,u[1]=(l?f:-f)+.07*n*4*h*(1-h)*2,u[2]=l?1:-1,u}const se=.7002,ie=.1051,zt=e=>23.5+(Math.max(3,e)-3)*se,Ut=e=>e<12.5?J(12.4,8,(Math.max(3,e)-3)/9.5):J(8,2.9,(e-12.5)/21),Ft=e=>-.85+(Math.max(3,e)-3)*ie,Wt=e=>J(.135,.095,ot((e-3)/30.5,0,1));async function le(e,i,n,u){const s=ne(),l=-mt,h=[0,0,0],f=n<.75?.6:1,M=[.7,.7,.71],y=[.56,.58,.62],v=[.035,.037,.045],V=[.62,.6,.58],x=(o,T,E,O,t,c,p)=>{o.r=T[0],o.g=T[1],o.b=T[2],o.p0=E,o.p1=O,o.p2=t,o.p3=c,o.fx=p||0},S=[0,.1,.3,.62,1.05,1.6,2.3,3.1,4,5,6.1,7.4];for(let o=8.8;o<46.2;o+=1.55/f)S.push(o);for(let o=47.4;o<71.9;o+=1.7/f)S.push(o);S.push(72);const D=o=>o<8?Math.max(.03,3*Math.pow(Math.sin(.5*Math.PI*o/8),.62)):o>46?3*(1-.88*Math.pow((o-46)/26,1.7)):3,_=o=>ut-.75*Math.pow(1-X(0,8,o),1.5)+(o>46?2.3*Math.pow((o-46)/26,1.8):0),B=Math.round(60*f);await u(),await xt(s,S.length,B,(o,T,E,O)=>{const t=S[o],c=T/B*tt,p=Math.sin(c),r=Math.cos(c),b=D(t),U=i.humped?.42*X(2.5,8.5,t)*(1-X(15,25,t)):0,H=X(19,24,t)*(1-X(38,44,t)),R=b*(r>0?1+U*r:1+.2*H*X(.35,.95,-r)),$=b*(1+.1*H*X(.2,.8,-r));E.x=$*p,E.y=_(t)+R*r,E.z=l+t,x(E,M,1,t,E.y-ut,O/B*tt,0)},{wrap:!0,pause:u}),await u(),xt(s,2,12,(o,T,E)=>{const O=T/12*tt,t=o===0?.36:.02;E.x=t*Math.sin(O),E.y=_(72)+t*Math.cos(O),E.z=l+72+(o?.02:0),x(E,v,9,0,0,0,0)},{wrap:!0,ref:[0,_(72),l+70]});const L=[2.6,3.3,4.5,6,7.5,9,10.5,11.5,12.5,13.5,15,17,19,21,23,25,27,29,31,32.4,33.5],C=[];for(const o of L)C.push({x:o,y:Ft(o),le:zt(o),ch:Ut(o),tc:Wt(o),b:0,span:o,tw:J(.045,-.05,ot((o-3)/30.5,0,1))});const F=Ft(33.5),N=zt(33.5);for(const o of[15,30,45,60,75]){const T=o*Math.PI/180,E=o/75;C.push({x:33.5+1.6*Math.sin(T),y:F+1.6*(1-Math.cos(T)),le:N+.55*E,ch:J(2.9,2.2,E),tc:.09,b:T,span:33.5+1.6*T,tw:-.05})}const P=75*Math.PI/180,A=33.5+1.6*Math.sin(P),d=F+1.6*(1-Math.cos(P));for(const o of[.8,1.6,2.3,2.5]){const T=o/2.5;C.push({x:A+Math.cos(P)*o,y:d+Math.sin(P)*o,le:N+.55+1.5*T,ch:o>2.4?.12:J(2.2,.95,T),tc:.09,b:P,span:33.5+1.6*P+o,tw:-.05})}const g=Math.round(36*f),q=(o,T,E,O)=>xt(s,o.length,g,(t,c,p)=>{const r=o[t];jt(c,g,r.tc,h);const b=(h[0]-.25)*r.ch,U=h[1]*r.ch,H=Math.cos(r.tw||0),R=Math.sin(r.tw||0),$=b*H+U*R,Y=-b*R+U*H,Z=r.x-Math.sin(r.b)*Y,et=r.y+Math.cos(r.b)*Y;O?(p.x=Y,p.y=r.y):(p.x=T*Z,p.y=et),p.z=l+r.le+.25*r.ch+$;const at=E===2?Math.pow(ot((r.span-3)/31,0,1.15),2):0;x(p,E===2?y:M,E,r.span,h[0],O?Math.sign(Y)||1:h[2],at)},{wrap:!0});q(C,1,2,!1),await u(),q(C,-1,2,!1),await u();const a=[];for(const o of[0,1.5,3,4.5,6,7.5,9,10.2,11,11.12])a.push({x:0,y:ut+1.5+o,le:55.2+.84*o,ch:o>11.05?.3:J(10.8,4,o/11)*(o>10.5?.82:1),tc:J(.1,.085,o/11),b:0,span:o});q(a,1,7,!0),await u();const m=[];for(const o of[.7,2,3.5,5,6.5,8,9.5,10.8,11.5,11.62])m.push({x:o,y:ut+1.05+o*.12,le:59.3+o*.7,ch:o>11.55?.25:J(7.2,2.5,o/11.5),tc:.09,b:0,span:o,tw:0});q(m,1,8,!1),await u(),q(m,-1,8,!1),await u();const w=Math.round(34*f),z=[],k=(o,T,E,O,t,c,p,r,b)=>xt(s,o.length,w,(U,H,R,$)=>{const Y=H/w*tt,Z=o[U];R.x=T+Z[1]*Math.sin(Y),R.y=E+Z[1]*Math.cos(Y),R.z=O+Z[0];const et=typeof c=="function"?c(Z):c;t===5||t===6?x(R,et,t,Z[2],$/w*tt,r,p):x(R,et,t,Z[0],$/w*tt,r,p)},{wrap:!0,...b});let K=0;for(const o of[1,-1])for(let T=0;T<2;T++){const E=Pt[T],O=o*E,t=Ft(E)-2.3,c=zt(E)-3.9,p=l+c,r=Math.pow((E-3)/31,2),b=K++;k([[0,1.26],[.05,1.36],[.2,1.46],[.7,1.55],[1.7,1.58],[2.9,1.52],[3.6,1.42],[3.95,1.33]],O,t,p,3,M,r,b),k([[0,1.26],[.06,1.17],[.3,1.13],[.8,1.15],[1.3,1.19]],O,t,p,3,H=>H[0]<.2?M:[.11,.115,.13],r,b,{inward:!0,ref:[O,t,p+.6]}),k([[1.3,1.19,1],[1.3,.93,.78],[1.3,.68,.57],[1.3,.44,.37]],O,t,p,5,v,r,b,{ref:[O,t,p+3]}),k([[.62,.03,.07],[.78,.2,.45],[1.03,.36,.82],[1.3,.44,1]],O,t,p,6,v,r,b,{ref:[O,t,p+3]}),k([[3.95,1.33],[3.95,1]],O,t,p,9,v,r,b,{ref:[O,t,p]}),k([[3.95,1],[4.5,.9],[5.1,.74],[5.4,.64]],O,t,p,4,[.4,.37,.34],r,b),k([[5.4,.64],[5.4,.4]],O,t,p,9,[.02,.02,.022],r,b,{ref:[O,t,p]}),k([[5.4,.4],[5.9,.26],[6.4,.03]],O,t,p,4,[.3,.28,.26],r,b),z.push(new W.Vector3(O,t,p+5.4));const U=[{y:t+1.4,le:c+.6,ch:4.6},{y:t+1.9,le:c+1.6,ch:4.6},{y:Ft(E)-.1,le:zt(E)+.5,ch:4.4}];xt(s,3,12,(H,R,$)=>{const Y=U[H];jt(R,12,.085,h),$.x=O+h[1]*Y.ch,$.y=Y.y,$.z=l+Y.le+h[0]*Y.ch,x($,M,9,0,0,0,r)},{wrap:!0}),await u()}for(const o of[1,-1])for(const T of[6.2,9,15.3,18.2,25.6]){const E=Ut(T),O=l+zt(T)+.5*E,t=.5*E+1.15,c=Ft(T)-.5*Wt(T)*E*.55-.2,p=Math.pow((T-3)/31,2);xt(s,9,8,(r,b,U)=>{const H=r/8,R=b/8*tt,$=Math.pow(Math.sin(Math.PI*ot(H*.94+.03,0,1)),.6);U.x=o*T+.34*$*Math.sin(R),U.y=c-.1-.25*H+.5*$*Math.cos(R),U.z=O+H*t,x(U,y,9,0,0,0,p)},{wrap:!0})}await u();const I=new W.BufferGeometry;I.setAttribute("position",new W.BufferAttribute(new Float32Array(s.p),3)),I.setAttribute("normal",new W.BufferAttribute(new Float32Array(s.n),3)),await u(),I.setAttribute("color",new W.BufferAttribute(new Float32Array(s.c),3)),I.setAttribute("aP",new W.BufferAttribute(new Float32Array(s.a),4)),I.setAttribute("aF",new W.BufferAttribute(new Float32Array(s.f),1)),await u(),I.setIndex(s.p.length/3>65535?new W.BufferAttribute(new Uint32Array(s.idx),1):new W.BufferAttribute(new Uint16Array(s.idx),1)),I.computeBoundingSphere();const j=C[C.length-2],G=l+j.le+.4,Q=[[0,ut+3.12,l+30,1,.07,.04,.36,1,0,0],[0,ut-3.72,l+33,1,.07,.04,.36,1,0,0],[j.x,j.y-1.2,G,1,1,1,.3,2,0,1.1],[-j.x,j.y-1.2,G,1,1,1,.3,2,0,1.1],[0,_(72),l+72.2,1,1,1,.26,2,0,0],[-j.x+.3,j.y-2,G-.9,1,.05,.03,.24,0,0,1.1],[j.x-.3,j.y-2,G-.9,.16,.76,.58,.24,0,0,1.1],[0,_(71)+.2,l+71.6,.9,.9,1,.18,0,0,0]];return{geometry:I,nozzles:z,lamps:Q}}const re=`
attribute vec4 aP; attribute float aF;
uniform float uTime, uPix;
varying vec3 vN; varying vec3 vWp; varying vec3 vCol; varying vec4 vP;
#include <fog_pars_vertex>
void main() {
  vec3 p = position;
  p.y += aF * (0.4 * sin(uTime * 1.1) + 0.12 * sin(uTime * 2.7 + 1.0));   // the wing breathing
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec3 wn = mat3(modelMatrix) * normal;
  // FAR OFF the thin parts (wing, fin, tailplane: a metre thick or less) are swelled along their normals, so that from any range
  // they are at least a pixel and a half thick and an aircraft hundreds of metres away is a whole cross, not a few dashes
  // (uPix: metres across one pixel at one metre; nothing moves within about 180 m)
  float thinPart = ((aP.x > 1.5 && aP.x < 2.5) || aP.x > 6.5) ? 1.0 : 0.0;
  wp.xyz += wn / max(length(wn), 1e-4) * clamp(0.75 * length(wp.xyz - cameraPosition) * uPix - 0.35, 0.0, 1.6) * thinPart;
  vWp = wp.xyz; vN = wn; vCol = color; vP = aP;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,he=`
uniform sampler2D uNoise;
uniform float uTime, uWin, uHump, uLogo;
uniform vec3 uSunDir, uSunCol, uEnvGlow, uEnvAnti, uEnvZen, uEnvDeck, uAmbUp, uAmbDn, uTail, uWinCol;
varying vec3 vN; varying vec3 vWp; varying vec3 vCol; varying vec4 vP;
#include <fog_pars_fragment>
float hash1(float n) { return fract(sin(n * 12.9898 + 4.1) * 43758.5453); }
// a small analytic sky for the gloss: glow at the sun's azimuth, rose opposite, indigo above, slate deck below
vec3 skyEnv(vec3 d) {
  vec2 h = d.xz; h /= max(length(h), 1e-4);
  vec2 sh = uSunDir.xz; sh /= max(length(sh), 1e-4);
  vec3 hor = mix(uEnvAnti, uEnvGlow, smoothstep(-0.3, 0.95, dot(h, sh)));
  vec3 up = mix(hor, uEnvZen, smoothstep(0.02, 0.5, d.y));
  return mix(uEnvDeck, up, smoothstep(-0.1, 0.01, d.y));
}
float aaLine(float d, float w) { return 1.0 - smoothstep(w, w + fwidth(d) * 1.2 + 1e-5, abs(d)); }
// line every 'period' of x, half-width w (derivative taken on x itself, so there is no spike where the cell wraps)
float aaLineP(float x, float period, float w) { float d = (fract(x / period + 0.5) - 0.5) * period; return 1.0 - smoothstep(w, w + fwidth(x) * 1.2 + 1e-5, abs(d)); }
float box(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main() {
  float part = vP.x;
  vec3 N = normalize(vN + vec3(0.0, 1e-6, 0.0)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWp);
  vec3 alb = vCol, emis = vec3(0.0); float gloss = 0.4, metal = 0.0, pool = 0.0;
  float fr = texture2D(uNoise, vec2(vP.y * 0.05, vP.z * 0.45 + 0.2)).r * 0.6 + texture2D(uNoise, vec2(vP.y * 0.17, vP.z * 1.5)).g * 0.4;   // frost field (wing only; sampled outside the branches)
  if (part < 1.5) {
    // fuselage: paint scheme, joints, cabin windows, doors, cockpit glazing
    float t = vP.y, y = vP.z, ang = vP.w > 3.14159 ? vP.w - 6.28318 : vP.w, side = ang < 0.0 ? -1.0 : 1.0;
    float px = fwidth(t) + fwidth(y) + 1e-4;
    alb = mix(alb, vec3(0.47, 0.49, 0.54), 1.0 - smoothstep(-2.05, -1.85, y));
    float sweep = smoothstep(0.0, 0.5, (t - 49.0) - (2.4 - y) * 1.15);
    alb = mix(alb, uTail, sweep);
    alb = mix(alb, uTail, aaLine(y + 0.42, 0.085) * step(7.0, t) * (1.0 - sweep));
    alb *= 1.0 - 0.22 * aaLineP(t, 5.8, 0.012) * step(7.0, t) * step(t, 62.0);
    alb *= 1.0 - 0.35 * aaLine(t - 1.75, 0.012);
    alb = mix(alb, vec3(0.5, 0.5, 0.52), (1.0 - smoothstep(1.6, 1.8, t)) * 0.3);
    float wx = (t - 9.3) / 0.82, wi = floor(wx), wf = (fract(wx) - 0.5) * 0.82;
    float inRow = step(9.3, t) * step(t, 60.2);
    float dd = min(min(abs(t - 10.6), abs(t - 23.7)), min(abs(t - 38.5), abs(t - 54.3)));
    float door = 1.0 - smoothstep(0.78, 0.86, dd);
    float lit = hash1(wi * 1.37 + side * 31.7) > 0.145 ? 0.5 + 0.5 * hash1(wi * 7.13 + side * 3.0) : 0.015;
    float sd = box(vec2(wf, y - 0.72), vec2(0.125, 0.175), 0.07);
    float win = (1.0 - smoothstep(-px, px, sd)) * inRow * (1.0 - door);
    alb *= 1.0 - 0.3 * (1.0 - smoothstep(0.02, 0.02 + px, abs(sd - 0.03))) * inRow * (1.0 - door);
    float usd = box(vec2(wf, y - 3.2), vec2(0.11, 0.15), 0.06);
    win = max(win, (1.0 - smoothstep(-px, px, usd)) * step(8.0, t) * step(t, 19.5) * uHump);
    alb = mix(alb, vec3(0.02), win); emis += uWinCol * uWin * lit * win;
    float dline = 1.0 - smoothstep(0.012, 0.012 + px, abs(box(vec2(dd, y - 0.42), vec2(0.53, 0.97), 0.12)));
    alb *= 1.0 - 0.45 * dline;
    float dwin = 1.0 - smoothstep(-px, px, box(vec2(dd, y - 0.78), vec2(0.09, 0.13), 0.06));
    alb = mix(alb, vec3(0.02), dwin); emis += uWinCol * uWin * 0.45 * dwin;
    float c0 = mix(1.75, 4.5, uHump), c1 = mix(5.0, 7.5, uHump), sill = mix(0.25 + 0.1 * (t - 2.0), 1.75 + 0.22 * (t - 4.6), uHump);
    float gz = smoothstep(-px, px, y - sill) * smoothstep(-px, px, sill + 0.72 - y) * smoothstep(-px, px, c1 - t) * smoothstep(-px, px, t - c0);
    float aa = abs(ang), mul = min(aa, min(abs(aa - 0.62), abs(aa - 1.14)));
    gz *= smoothstep(0.02, 0.02 + fwidth(aa) + 1e-4, mul);
    alb = mix(alb, vec3(0.012, 0.016, 0.026), gz); gloss = mix(gloss, 1.0, gz); emis += vec3(1.0, 0.55, 0.25) * 0.04 * gz * uWin;
  } else if (part < 2.5) {
    // wing: slats, spoilers, flaps and ailerons with their gaps, tank panel lines, walkway, frost over the tanks
    float sp = vP.y, xc = vP.z, up = smoothstep(0.0, 0.5, vP.w);
    alb = mix(vec3(0.46, 0.48, 0.53), vec3(0.6, 0.62, 0.66), up);
    float ob = step(5.0, sp) * step(sp, 32.6);
    float ln = aaLine(xc - 0.13, 0.0022) * ob;
    ln = max(ln, aaLineP(sp, 5.4, 0.02) * step(xc, 0.13) * ob);
    float flap = step(3.4, sp) * step(sp, 23.8), ail = step(24.2, sp) * step(sp, 31.6);
    ln = max(ln, aaLine(xc - 0.72, 0.0032) * flap);
    ln = max(ln, aaLine(xc - 0.75, 0.0026) * ail);
    float ends = min(min(abs(sp - 12.6), abs(sp - 23.8)), min(abs(sp - 24.2), min(abs(sp - 27.9), abs(sp - 31.6))));
    ln = max(ln, aaLine(ends, 0.025) * step(0.735, xc));
    float spz = step(6.0, sp) * step(sp, 23.4) * step(0.6, xc) * step(xc, 0.72) * up;
    alb *= 1.0 - 0.12 * spz;
    ln = max(ln, max(aaLine(xc - 0.6, 0.002), aaLineP(sp - 6.0, 2.9, 0.018)) * step(6.0, sp) * step(sp, 23.4) * step(0.598, xc) * step(xc, 0.722) * up);
    float tank = step(3.6, sp) * step(sp, 31.0) * step(0.14, xc) * step(xc, 0.6);
    alb *= 1.0 - 0.13 * clamp(max(aaLine(xc - 0.3, 0.0016), aaLine(xc - 0.47, 0.0016)) + aaLineP(sp, 2.3, 0.012), 0.0, 1.0) * tank;
    alb *= 1.0 - 0.5 * (1.0 - smoothstep(0.03, 0.03 + fwidth(sp) * 1.5 + 1e-4, abs(box(vec2(sp - 5.3, (xc - 0.4) * 9.0), vec2(1.7, 1.7), 0.15)))) * up;
    float frost = smoothstep(0.5, 0.72, fr) * up * step(4.5, sp) * (1.0 - smoothstep(19.0, 24.0, sp)) * smoothstep(0.15, 0.22, xc) * (1.0 - smoothstep(0.5, 0.58, xc));
    alb = mix(alb, vec3(0.74, 0.79, 0.88), frost * 0.75); gloss = 0.55 * (1.0 - 0.85 * frost);
    alb *= 1.0 - 0.62 * ln;
    metal = (1.0 - smoothstep(0.012, 0.035, xc)) * 0.7;
    alb = mix(alb, uTail, smoothstep(35.3, 35.6, sp));
  } else if (part < 3.5) {
    // nacelle: polished lip, cowl seams, a band of the tail colour
    float z = vP.y, ang = vP.z;
    metal = 1.0 - smoothstep(0.2, 0.26, z);
    alb = mix(alb, uTail, step(0.25, vCol.r) * smoothstep(0.85, 0.9, z) * (1.0 - smoothstep(1.2, 1.25, z)));
    alb *= 1.0 - 0.3 * max(max(aaLine(z - 1.75, 0.012), aaLine(z - 2.95, 0.012)), aaLineP(ang, 1.5708, 0.008) * step(1.75, z)) * step(0.25, vCol.r);
    gloss = 0.5;
  } else if (part < 4.5) {
    metal = 1.0; gloss = 0.8;
  } else if (part < 5.5) {
    // fan: a spinning blur
    float r = vP.y, ang = vP.z;
    float bl = 0.5 + 0.5 * sin(ang * 22.0 + r * 5.0 - uTime * 37.0), beat = 0.5 + 0.5 * sin(ang * 2.0 - uTime * 6.3 + vP.w * 1.7);
    alb = vec3(0.022, 0.024, 0.03) + vec3(0.07, 0.072, 0.08) * bl * beat * smoothstep(0.37, 0.62, r) + vec3(0.05) * smoothstep(0.9, 1.0, r);
    gloss = 0.25;
  } else if (part < 6.5) {
    float r = vP.y, ang = vP.z;
    alb = mix(vec3(0.03), vec3(0.62), smoothstep(0.55, 0.8, sin(ang + r * 7.0 - uTime * 9.0)) * smoothstep(0.1, 0.3, r));
    gloss = 0.6;
  } else if (part < 7.5) {
    // fin: tail colour, a pale crescent, rudder split, the logo light's pool
    float h = vP.y, xc = vP.z, cw = mix(10.8, 4.0, clamp(h / 11.0, 0.0, 1.0));
    alb = uTail;
    vec2 e = vec2((xc - 0.42) * cw, h - 6.0);
    float cres = (1.0 - smoothstep(1.55, 1.62, length(e))) * smoothstep(1.3, 1.37, length(e - vec2(0.75, 0.45)));
    alb = mix(alb, vec3(0.74, 0.72, 0.68), cres);
    float rl = max(aaLine(xc - 0.68, 0.0035), aaLine(min(abs(h - 3.9), abs(h - 7.6)), 0.02) * step(0.68, xc));
    alb *= 1.0 - 0.5 * rl;
    pool = uLogo * exp(-(h - 5.0) * (h - 5.0) / 16.0) * smoothstep(0.05, 0.3, xc);
    gloss = 0.5;
  } else if (part < 8.5) {
    float sp = vP.y, xc = vP.z;
    alb *= 1.0 - 0.5 * max(aaLine(xc - 0.68, 0.0035) * step(1.6, sp), aaLine(sp - 6.0, 0.02) * step(0.68, xc));
    gloss = 0.5;
  }
  // light: coral key, blue fill from above, slate from the deck, the horizon glow as a broad side light, glossy sky reflection
  float ndl = dot(N, uSunDir), key = max(ndl, 0.0);
  vec2 sh = uSunDir.xz; sh /= max(length(sh), 1e-4);
  float az = N.x * sh.x + N.z * sh.y, lvl = 1.0 - 0.6 * abs(N.y);
  vec3 amb = mix(uAmbDn, uAmbUp, 0.5 + 0.5 * N.y) + uEnvGlow * (0.5 + 0.5 * az) * (0.5 + 0.5 * az) * lvl * 0.15 + uEnvAnti * (0.5 - 0.5 * az) * (0.5 - 0.5 * az) * lvl * 0.3;
  vec3 col = alb * (uSunCol * key + amb + vec3(1.0, 0.92, 0.8) * pool);
  vec3 R = reflect(-V, N);
  float fres = pow(clamp(1.0 - dot(N, V), 0.0, 1.0), 5.0);
  vec3 env = skyEnv(R);
  float spec = pow(max(dot(N, normalize(uSunDir + V + vec3(0.0, 1e-5, 0.0))), 0.0), 90.0);
  col = mix(col, env, clamp((0.04 + 0.96 * fres) * gloss * 1.5, 0.0, 1.0));
  col = mix(col, env * (0.4 + alb) + uSunCol * spec * 2.0, metal);
  col += uSunCol * spec * gloss * 1.2 + emis;
  // far off (beyond about 200 m) the surfaces seen edge-on take a rim of the low sun, strongest on the sunward side: from behind,
  // against the glow, the wing and the nacelles are then drawn by a coral line and not only by their shadow
  float gz2 = 1.0 - abs(dot(N, V)); gz2 *= gz2;
  col += uSunCol * 0.42 * gz2 * smoothstep(180.0, 420.0, length(cameraPosition - vWp)) * (0.35 + 0.65 * smoothstep(-0.3, 0.6, ndl));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,ce=`
attribute vec4 aL; attribute vec4 aC; attribute float aF;
uniform float uTime, uLamp;
varying vec2 vQ; varying vec3 vC;
#include <fog_pars_vertex>
float blink(float x) { return smoothstep(0.0, 0.09, x) * (1.0 - smoothstep(0.09, 0.36, x)); }
void main() {
  vec3 p = position;
  p.y += aF * (0.4 * sin(uTime * 1.1) + 0.12 * sin(uTime * 2.7 + 1.0));
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  float I = 1.0;
  if (aL.z > 1.5) { float ph = fract(uTime / 1.2 + aL.w) * 1.2; I = blink(ph) + blink(ph - 0.42); }
  else if (aL.z > 0.5) { I = blink(fract(uTime + aL.w)); }
  float size = max(aC.w, -mvPosition.z * 0.0032) * (0.55 + 0.75 * I);
  mvPosition.xy += aL.xy * size * 3.2;
  vQ = aL.xy; vC = aC.rgb * I * uLamp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fe=`
varying vec2 vQ; varying vec3 vC;
#include <fog_pars_fragment>
void main() {
  float r2 = dot(vQ, vQ);
  vec3 col = vC * (exp(-r2 * 22.0) + 0.16 * exp(-r2 * 4.0)) * (1.0 - smoothstep(0.7, 1.0, r2));
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      col *= 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(col, 1.0);
}`;function Vt(e,i){const n=(s,l=1)=>new W.Color(s).multiplyScalar(l),u=(s,l=1)=>i[s].clone().multiplyScalar(l);return e==="golden"?{body:n("#E0607A",.8),rim:n("#FF8FD0",1.55),shade:n("#8A5AA0",.85),sky:n("#2A1E55",.25),bump:.5,crease:.5,sun:n("#FF5A4A",1.3),glow:n("#FF6A5A",1.1),anti:n("#7A4AA8",.4),zen:n("#1B1446",1),deck:n("#3A3358",.6),up:n("#3A3A8C",.5),dn:n("#3A3358",.35),win:n("#FFB060",2.4)}:e==="night"?{body:n("#C9D4EE",.8),rim:n("#EAF0FF",1.45),shade:n("#3A4E8C",.95),sky:n("#0A1230",.3),sun:n("#9FB4E8",.75),glow:n("#5A74B8",.5),anti:n("#22305E",.4),zen:n("#060A1E",1),deck:n("#A8B4CC",.25),up:n("#2A3A70",.45),dn:n("#8090B0",.12),win:n("#FFA550",3)}:{body:u(4,.9),rim:u(5,1.6),shade:n("#5A6599",1),sky:u(2,.3),sun:n("#FF8A62",1.35),glow:u(5,.75).lerp(u(4,1.1),.45),anti:u(3,.4),zen:u(2,1),deck:u(1,.6),up:u(1,1.6).lerp(u(2,2.2),.4),dn:u(1,.8),win:n("#FFB266",2.4)}}async function ue(e,i={}){const n=["#0E6F7A","#B01E3C","#1D3FA6","#D99A1B","#5E2A6E","#1E6B45","#C8452A"],u={humped:i.humped??e.chance(.4),tail:new W.Color(i.tailColor||e.pick(n))},s=await le(e,u,i.detail??1,i.pause||(async()=>{})),l=W.UniformsUtils.merge([W.UniformsLib.fog,{uTime:{value:0},uWin:{value:1},uHump:{value:u.humped?1:0},uLogo:{value:.9},uPix:{value:.0026},uSunDir:{value:new W.Vector3(.642,-.052,-.765)},uSunCol:{value:new W.Color},uEnvGlow:{value:new W.Color},uEnvAnti:{value:new W.Color},uEnvZen:{value:new W.Color},uEnvDeck:{value:new W.Color},uAmbUp:{value:new W.Color},uAmbDn:{value:new W.Color},uTail:{value:u.tail.clone().multiplyScalar(.85)},uWinCol:{value:new W.Color}}]);l.uNoise={value:i.noiseTex};const h=new W.ShaderMaterial({uniforms:l,vertexShader:re,fragmentShader:he,vertexColors:!0,fog:!0,side:W.DoubleSide}),f=new W.Mesh(s.geometry,h);f.name="airliner",f.frustumCulled=!1;const M=s.lamps,y=M.length,v=new Float32Array(y*12),V=new Float32Array(y*16),x=new Float32Array(y*16),S=new Float32Array(y*4),D=new Uint16Array(y*6),_=[1,5,6],B=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let A=0;A<y;A++)for(let d=0;d<4;d++){const g=M[A],q=A*4+d,a=g[7]===0?2.6:_[g[7]];v.set([g[0],g[1],g[2]],q*3),V.set([B[d][0],B[d][1],g[7],g[8]],q*4),x.set([g[3]*a,g[4]*a,g[5]*a,g[6]],q*4),S[q]=g[9],d===0&&D.set([q,q+1,q+2,q,q+2,q+3],A*6)}const L=new W.BufferGeometry;L.setAttribute("position",new W.BufferAttribute(v,3)),L.setAttribute("aL",new W.BufferAttribute(V,4)),L.setAttribute("aC",new W.BufferAttribute(x,4)),L.setAttribute("aF",new W.BufferAttribute(S,1)),L.setIndex(new W.BufferAttribute(D,1));const C=W.UniformsUtils.merge([W.UniformsLib.fog,{uTime:{value:0},uLamp:{value:1}}]),F=new W.Mesh(L,new W.ShaderMaterial({uniforms:C,vertexShader:ce,fragmentShader:fe,fog:!0,transparent:!0,depthWrite:!1,blending:W.AdditiveBlending}));F.name="airliner-lamps",F.frustumCulled=!1,F.renderOrder=9;const N=new W.Group;N.add(f,F);const P=A=>{l.uSunCol.value.copy(A.sun),l.uEnvGlow.value.copy(A.glow),l.uEnvAnti.value.copy(A.anti),l.uEnvZen.value.copy(A.zen),l.uEnvDeck.value.copy(A.deck),l.uAmbUp.value.copy(A.up),l.uAmbDn.value.copy(A.dn),l.uWinCol.value.copy(A.win)};return{object:N,hull:f,lamps:F,uniforms:l,lampUniforms:C,nozzles:s.nozzles,cast:u,setHour:P,update(A){l.uTime.value=A,C.uTime.value=A}}}async function pe(e,i={}){const n=e.rng.fork?e.rng.fork("dawn-tracks"):e.rng,u=e.noise,s=(i.palette&&i.palette.length>=7?i.palette:Qt).map(r=>new W.Color(r)),l=e.quality?.detail??1,h=i.pathPoints||It,f=qt(h);await e.yield();const M=Jt(n,f,{moist:i.moist,detail:l,axisCam:qt(Ot)}),y=new W.Group;y.name="dawn-tracks-contrail";const v=await ee(e,n);let V=i.hour==="golden"||i.hour==="night"?i.hour:"dawn",x=Vt(V,s);const S=(i.sunDir?i.sunDir.clone():new W.Vector3(Math.sin(40*Math.PI/180)*Math.cos(3*Math.PI/180),-Math.sin(3*Math.PI/180),-Math.cos(40*Math.PI/180)*Math.cos(3*Math.PI/180))).normalize();await e.yield();let D=null;i.airliner!==!1&&(D=await ue(n,{detail:l,humped:i.humped,tailColor:i.tailColor,noiseTex:v,pause:()=>e.yield()}),D.setHour(x),D.uniforms.uSunDir.value.copy(S),y.add(D.object)),await e.yield();const _=D?D.nozzles:[new W.Vector3(11.5,-2.25,-2029),new W.Vector3(21,-1.25,-2022.4)],B=[-_[0].z-34,-_[1].z-34],L=W.UniformsUtils.merge([W.UniformsLib.fog,{uTime:{value:0},uGain:{value:.95},uHalo:{value:J(.62,.95,M.moist)},uStreak:{value:1},uBump:{value:x.bump??1.2},uCrease:{value:x.crease??1},uFar:{value:new W.Vector2(1e6,2e6)},uSheet:{value:J(.86,1,M.moist)},uSunDir:{value:S.clone()},uBody:{value:x.body.clone()},uRim:{value:x.rim.clone()},uShade:{value:x.shade.clone()},uSky:{value:x.sky.clone().multiplyScalar(.25)}}]);L.uNoise={value:v};const C=new W.ShaderMaterial({uniforms:L,vertexShader:ae,fragmentShader:oe,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:W.DoubleSide,fog:!0}),F=(r,b,U)=>{const H=new W.Mesh(r,C);return H.name=b,H.renderOrder=U,H.frustumCulled=!1,y.add(H),H};F(await $t(e,n,u,f,M,B),"trail-head",10),await e.yield();const N=Math.PI/180,P=[],A=[{s:930,x:20,noseDown:!0,tilt:n.range(41,52)*N,shed:!0},{s:810,x:-20,noseDown:!1,tilt:n.range(36,46)*N,curtain:!0},{s:690,x:20,noseDown:!0,tilt:n.range(45,54)*N,gaps:[[Math.PI*.5+.6,.85,1]]}];for(let r=0;r<3;r++){const b={...A[r],y:-110,a:75*n.range(.95,1.05),b:60*n.range(.94,1.05),wall:16*n.range(.92,1.1)},U=await _t(e,n,u,f,M,b),H=U.attributes.position,R=U.attributes.aK;let $=1e9;{const Z=H.array,et=R.array;for(let at=0;at<H.count;at+=2)et[at*4]<1.5&&($=Math.min($,f.dist(Z[at*3]+b.x,Z[at*3+1]+b.y,Z[at*3+2]-b.s)))}b.x-=Math.sign(b.x)*ot(35-$,-16,20);const Y=F(U,"loop-"+(6-r),11+r);Y.position.set(b.x,b.y,-b.s),P.push({...b,mesh:Y,loop:6-r,ph:n.range(0,tt),rate:n.range(.85,1.15)}),await e.yield()}F(await te(e,n,u,f,M,{x:P[2].x,y:P[2].y,s:P[2].s}),"trail-ribbon",14),await e.yield();const d=h[h.length-1],g=h[h.length-2],q=Math.atan2(d[2]-g[2],d[1]-g[1]),a=async(r,b,U,H,R,$)=>{const Y=C.clone();Y.uniforms={...L,uFar:{value:new W.Vector2(H,R)}};const Z=new W.Mesh(await _t(e,kt(M.wPh+$),u,f,M,r),Y);return Z.name=b,Z.renderOrder=U,Z.frustumCulled=!1,Z.position.set(r.x,r.y,-r.s),y.add(Z),await e.yield(),Z},m={s:d[2],x:d[0],y:d[1],noseDown:!1,tilt:q,a:24,b:22,wall:7.5,age:.6,wob:2,hangK:.4,puffK:.45,puffMax:3.6,even:!0},w=await a(m,"portal-wreath",8,400,500,.123),z=50,k=ot((d[2]-z-g[2])/Math.max(1e-6,d[2]-g[2]),-3,1),K={s:d[2]-z,x:J(g[0],d[0],k),y:J(g[1],d[1],k),noseDown:!1,tilt:q,a:58,b:46,wall:13,age:.62,wob:5,hangK:.8,puffK:1,puffMax:4.2,even:!0,gaps:[[Math.PI*.5+.75,.2,.4]]},I=await a(K,"exit-gate",8.5,360,460,.456),j=[0,0];f.at(d[2]-170,j);const G={s:d[2]-170,x:j[0],y:j[1]+14,noseDown:!1,tilt:1.47,a:54,b:43,wall:12,age:.62,wob:4,hangK:.7,puffK:1,puffMax:4.2,even:!0},Q=await a(G,"exit-arch",8.7,250,340,.789),o=(r,b,U)=>new W.Vector3(r,b,-U),T=P.map(r=>({loop:r.loop,center:o(r.x,r.y,r.s),normal:new W.Vector3(0,Math.cos(r.tilt),(r.noseDown?1:-1)*Math.sin(r.tilt)),across:2*r.a,along:2*r.b,wall:r.wall})).reverse(),E=h[h.length-1],O=h[h.length-2],t={flyThrough:h.map(r=>o(r[0],r[1],r[2])),pathPoints:h.map(r=>r.slice()),portalSeat:{position:o(E[0],E[1],E[2]),normal:new W.Vector3(O[0]-E[0],O[1]-E[1],E[2]-O[2]).normalize(),radius:7},wreath:{center:o(m.x,m.y,m.s),across:2*m.a,wall:m.wall},gate:{center:o(K.x,K.y,K.s),across:2*K.a,wall:K.wall},arch:{center:o(G.x,G.y,G.s),across:2*G.a,wall:G.wall},rings:T,loop5:T[1].center.clone(),pinch:o(0,M.axisY(1110+nt),1110+nt),loop7:o(0,M.axisY(1052+nt)+6,1052+nt),canyon:[o(0,M.axisY(1350),1350),o(0,M.axisY(1750),1750)],airliner:{nose:o(0,ut-.75,mt),tail:o(0,ut+2.3,mt-72),fuselage:o(0,ut,mt-30),windows:o(3,ut+.72,mt-34),finTop:o(0,ut+12.6,mt-66),wingTip:o(35.5,4.5,mt-48)},nozzles:_.map(r=>r.clone()),jetBirth:[o(Pt[0],M.axisY(B[0]),B[0]),o(Pt[1],M.axisY(B[1]),B[1])],sunDir:S.clone(),viewpoints:[{name:"entry",position:o(-150,-128,0),target:o(20,-110,690)},{name:"chain",position:o(-95,-88,575),target:o(-20,-110,810)},{name:"inside-loop-5",position:o(18,-108,810),target:o(20,-110,930)},{name:"canyon",position:o(-1,-60,1550),target:o(0,ut,mt-40)},{name:"wing",position:o(12,8,2020),target:o(3,ut,mt-10)}]},c=()=>{L.uBody.value.copy(x.body),L.uRim.value.copy(x.rim),L.uShade.value.copy(x.shade),L.uSky.value.copy(x.sky).multiplyScalar(.25),L.uBump.value=x.bump??1.2,L.uCrease.value=x.crease??1,D&&D.setHour(x)},p={object:y,radius:250,height:200,center:new W.Vector3(0,-105,-810),anchors:t,ground:!1,groundY:-3e3,material:C,uniforms:L,hullUniforms:D?D.uniforms:null,lampUniforms:D?D.lampUniforms:null,airliner:D,rings:P,noiseTex:v,moist:M.moist,hour:V,setProgress(r){L.uGain.value=J(.9,1.06,ot(r,0,1))},setSun(r){S.copy(r).normalize(),L.uSunDir.value.copy(S),D&&D.uniforms.uSunDir.value.copy(S)},setHour(r){V=r==="golden"||r==="night"?r:"dawn",p.hour=V,x=Vt(V,s),c()},update(r,b){L.uTime.value=b,D&&D.update(b);for(const U of P){const H=U.mesh,R=b*.2*U.rate+U.ph;H.rotation.set(.1*Math.sin(R),.035*Math.sin(R*.63+1.3),.05*Math.sin(R*.81+2.1)),H.position.y=U.y+2*Math.sin(R*1.37+.7)}w.rotation.set(.03*Math.sin(b*.17),0,.05*Math.sin(b*.13+1)),I.rotation.set(.04*Math.sin(b*.15+2),0,.05*Math.sin(b*.11)),Q.rotation.set(.03*Math.sin(b*.13+1),0,.04*Math.sin(b*.1+2.6))},dispose(){v.dispose()}};return y.userData.hero=p,p}export{It as DAWN_TRACKS_PATH,ue as buildAirliner,pe as buildHero};
