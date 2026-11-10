import*as m from"three";import{clamp as ue,lerp as fe,smoothstep as gt,bell as yt}from"../kit/core.js";const Wt=["#c9fff2","#39c6d6","#1487b8","#0b4f86","#e9dcb8","#ff6f61","#ffd447"],Se=Math.PI/180,ie=(a,r,o)=>{const t=Math.max(o-Math.abs(a-r),0)/o;return Math.min(a,r)-t*t*o*.25},me=(a,r,o)=>{const t=Math.max(o-Math.abs(a-r),0)/o;return Math.max(a,r)+t*t*o*.25},ge=(a,r,o,t,s,d)=>{const f=a/t,h=r/s,l=o/d,y=Math.sqrt(f*f+h*h+l*l),x=f/t,i=h/s,R=l/d,k=Math.sqrt(x*x+i*i+R*R);return k>1e-7?y*(y-1)/k:-Math.min(t,s,d)},Ee=(a,r,o,t,s,d,f)=>{const h=Math.abs(a)-t+f,l=Math.abs(r)-s+f,y=Math.abs(o)-d+f,x=Math.max(h,0),i=Math.max(l,0),R=Math.max(y,0);return Math.sqrt(x*x+i*i+R*R)+Math.min(Math.max(h,l,y),0)-f},tt=(a,r,o,t,s,d,f,h,l,y,x)=>{const i=f-t,R=h-s,k=l-d,F=a-t,G=r-s,U=o-d;let $=(F*i+G*R+U*k)/(i*i+R*R+k*k);$=$<0?0:$>1?1:$;const q=F-i*$,_=G-R*$,J=U-k*$;return Math.sqrt(q*q+_*_+J*J)-(y+(x-y)*$)},T=(a,r,o)=>{let t=(o-a)/(r-a);return t=t<0?0:t>1?1:t,t*t*(3-2*t)};async function bt(a,r,o,t,s={}){const d=s.yield,f=Math.ceil((o[0]-r[0])/t)+1,h=Math.ceil((o[1]-r[1])/t)+1,l=Math.ceil((o[2]-r[2])/t)+1,y=f*h,x=new Float32Array(y*l),i=4,R=(i-1)*.5*t*1.7321*1.45+t,k=1.4*t;for(let c=0;c<l;c+=i)for(let g=0;g<h;g+=i)for(let M=0;M<f;M+=i){d&&(M&15)===0&&await d();const n=(i-1)*.5,v=a(r[0]+(M+n)*t,r[1]+(g+n)*t,r[2]+(c+n)*t),C=Math.min(M+i,f),B=Math.min(g+i,h),w=Math.min(c+i,l);if(Math.abs(v)>R){for(let P=c;P<w;P++)for(let V=g;V<B;V++){let N=P*y+V*f+M;for(let O=M;O<C;O++,N++)x[N]=v}continue}for(let P=c;P<w;P+=2)for(let V=g;V<B;V+=2)for(let N=M;N<C;N+=2){const O=a(r[0]+(N+.5)*t,r[1]+(V+.5)*t,r[2]+(P+.5)*t),D=Math.abs(O)>k,Z=Math.min(N+2,f),Q=Math.min(V+2,h),Y=Math.min(P+2,l);for(let re=P;re<Y;re++)for(let ne=V;ne<Q;ne++)for(let te=N;te<Z;te++)x[re*y+ne*f+te]=D?O:a(r[0]+te*t,r[1]+ne*t,r[2]+re*t)}}const F=new Int32Array(y*l).fill(-1),G=[],U=[0,1,f,f+1,y,y+1,y+f,y+f+1],$=[0,1,2,3,4,5,6,7,0,2,1,3,4,6,5,7,0,4,1,5,2,6,3,7];for(let c=0;c<l-1;c++){d&&(c&7)===0&&await d();for(let g=0;g<h-1;g++)for(let M=0;M<f-1;M++){const n=c*y+g*f+M;let v=0;for(let V=0;V<8;V++)x[n+U[V]]<0&&(v|=1<<V);if(v===0||v===255)continue;let C=0,B=0,w=0,P=0;for(let V=0;V<24;V+=2){const N=$[V],O=$[V+1],D=x[n+U[N]],Z=x[n+U[O]];if(D<0==Z<0)continue;const Q=D/(D-Z);C+=(N&1)+((O&1)-(N&1))*Q,B+=(N>>1&1)+((O>>1&1)-(N>>1&1))*Q,w+=(N>>2&1)+((O>>2&1)-(N>>2&1))*Q,P++}F[n]=G.length/3,G.push(r[0]+(M+C/P)*t,r[1]+(g+B/P)*t,r[2]+(c+w/P)*t)}}const q=[],_=s.yCut??-1e9,J=(c,g,M,n,v)=>{c<0||g<0||M<0||n<0||G[c*3+1]<_&&G[g*3+1]<_&&G[M*3+1]<_&&G[n*3+1]<_||(v?q.push(c,n,M,g):q.push(c,g,M,n))};for(let c=1;c<l-1;c++){d&&(c&7)===0&&await d();for(let g=1;g<h-1;g++)for(let M=1;M<f-1;M++){const n=c*y+g*f+M,v=x[n]<0;v!==x[n+1]<0&&J(F[n-f-y],F[n-y],F[n],F[n-f],v),v!==x[n+f]<0&&J(F[n-1-y],F[n-1],F[n],F[n-y],v),v!==x[n+y]<0&&J(F[n-1-f],F[n-f],F[n],F[n-1],v)}}const I=new Int32Array(G.length/3).fill(-1);let K=0;for(let c=0;c<q.length;c++){const g=q[c];I[g]<0&&(I[g]=K++)}const X=new Float32Array(K*3),W=new Float32Array(K*3),ee=new Float32Array(K*3),E=s.sun||[0,1,0],p=t*.3,S=t*.6;d&&await d();for(let c=0;c<I.length;c++){const g=I[c];if(g<0)continue;d&&(g&1023)===1023&&await d();let M=G[c*3],n=G[c*3+1],v=G[c*3+2];const C=a(M,n,v);let B=a(M+p,n,v)-C,w=a(M,n+p,v)-C,P=a(M,n,v+p)-C;const V=Math.sqrt(B*B+w*w+P*P)||1;B/=V,w/=V,P/=V;const N=ue(C,-S,S);M-=B*N,n-=w*N,v-=P*N,X[g*3]=M,X[g*3+1]=n,X[g*3+2]=v,W[g*3]=B,W[g*3+1]=w,W[g*3+2]=P;const O=a(M+B*1.6,n+w*1.6,v+P*1.6)/1.6,D=a(M+B*4.5,n+w*4.5,v+P*4.5)/4.5;ee[g*3]=ue(.12+.5*ue(O,0,1)+.38*ue(D,0,1),0,1);let Z=1;if(B*E[0]+w*E[1]+P*E[2]>-.2){const Q=M+B*.35,Y=n+w*.35,re=v+P*.35;for(let ne=0,te=1.2;ne<2;ne++,te*=4){const ce=a(Q+E[0]*te,Y+E[1]*te,re+E[2]*te);Z=Math.min(Z,4*ce/te+.15)}}ee[g*3+1]=ue(Z,0,1)}d&&await d();const z=new Uint32Array(q.length/4*6);let L=0;for(let c=0;c<q.length;c+=4){const g=I[q[c]],M=I[q[c+1]],n=I[q[c+2]],v=I[q[c+3]],C=X[M*3]-X[g*3],B=X[M*3+1]-X[g*3+1],w=X[M*3+2]-X[g*3+2],P=X[v*3]-X[g*3],V=X[v*3+1]-X[g*3+1],N=X[v*3+2]-X[g*3+2],O=B*N-w*V,D=w*P-C*N,Z=C*V-B*P;O*(W[g*3]+W[n*3])+D*(W[g*3+1]+W[n*3+1])+Z*(W[g*3+2]+W[n*3+2])>=0?(z[L++]=g,z[L++]=M,z[L++]=n,z[L++]=g,z[L++]=n,z[L++]=v):(z[L++]=g,z[L++]=n,z[L++]=M,z[L++]=g,z[L++]=v,z[L++]=n)}return{P:X,N:W,lit:ee,idx:z,count:K}}function Et(a,r,o,t,s,d=3){let f=1;for(let h=0,l=1.5;h<6;h++,l*=1.75){const y=a(r+s[0]*l,o+s[1]*l,t+s[2]*l);if(f=Math.min(f,d*y/l+.1),f<=0)return 0}return ue(f,0,1)}function Ut(a){const r=Math.cos(a.roll),o=Math.sin(a.roll),t=Math.cos(a.yaw),s=Math.sin(a.yaw),{browA:d,browArch:f,bandGap:h,crestN:l,crestH:y,crestA:x,sC:i,eyeA:R,eyeB:k,eyeK:F}=a,G=(p,S,z,L)=>{const c=p-a.c[0],g=S-a.c[1],M=z-a.c[2],n=c*t+M*s,v=-c*s+M*t;return L[0]=-n,L[1]=g*r-v*o,L[2]=g*o+v*r,L},U=(p,S,z)=>{const L=-p,c=S*r+z*o,g=-S*o+z*r;return new m.Vector3(a.c[0]+L*t-g*s,a.c[1]+c,a.c[2]+L*s+g*t)},$=(p,S,z)=>U(p,S,z).sub(U(0,0,0)),q=[0,0,0],_=(p,S,z)=>{const L=S*(1+.28*T(-4,-14,p));return ie(Ee(p-3,S,z+1.3,11,9.2,11.2,5),Ee(p+5,L,z,9.5,6.8,9.9,4.5)*.8,3)},J=(p,S,z)=>{const L=z- -36.3;return Math.sqrt(.8*p*p+S*S+L*L)-46},I=(p,S)=>9.7-(.8*p*p+S*S)/92,K=(p,S)=>(p-6.4+.85*(9.4-S))/1.3124,X=p=>{const S=p-.9;if(S<-1)return 0;const z=S<h*.5?S:S-h*Math.round(S/h);return 1-T(.55,.95,Math.abs(z))},W=(p,S,z)=>Ee(p-(d-f*S*S),S,z-(I(p,S)+.25),.85,7.3,1.3,.55);return{sdf:(p,S,z,L)=>{G(p,S,z,q);const c=q[0],g=q[1],M=q[2],n=_(c,g,M),v=tt(c,g,M,-8,0,-2.5,-27,0,-4,6.6,7.6),C=ie(n,v,2.5);if(C>11&&!L)return C-7.5;const B=J(c,g,M);let w=me(n,B,1.2);if(c<-7&&(w=ie(w,ge(c+12,g,M-6.3,2.6,3.2,2.8),1.5)),w=ie(w,v,2.5),M>4){const D=I(c,g);if(c>-6.5&&c<7){w=me(w,-ge(c-.4,g-4.3,M-(D+.5),3.1,3.4,2),.8),w=me(w,-ge(c-.4,g+4.3,M-(D+.5),3.1,3.4,2),.8),w=ie(w,W(c,g,M),.5);const Z=ue((d-c)/(d+5.4),0,1),Q=1+2.5*Z,Y=1.05+.95*Z;let re=(Math.abs(g)*Q+(M-D)*Y-Y*Q)/Math.sqrt(Q*Q+Y*Y);re=Math.max(re,M-D-Q+.3,-5.4-c-.3*(M-D),c-d-.4),w=ie(w,re,.35);const ne=g-i*k;w=ie(w,ge(c-R,ne,M-(D-1.45),1.95,3.2,1.5),.45);const te=(c-(R-.55+F*ne*ne))/Math.sqrt(1+4*F*F*ne*ne),ce=Math.max(Math.abs(ne)-3,0);w=me(w,-Math.max(Math.sqrt(te*te+ce*ce)-.42,Math.abs(M-(D-.3))-1.3),.25);const oe=g+i*k;w=me(w,-ge(c-R,oe,M-(D-1.5),2.1,3,5),.5),w=me(w,-(Math.sqrt((c-R)*(c-R)+oe*oe*.8+(M-D+6.2)*(M-D+6.2))-4.3),.6)}c<-6&&c>-11.5&&(w=ie(w,ge(c+7.9,g,M-(D+.05),.7,2.8,1),.4),w=ie(w,ge(c+9.4,g,M-(I(-9.4,g)+0),.78,2.3,1.05),.4))}const P=K(c,M),V=Math.min(Math.abs(g)-6.8,(c+9.5)*.8),N=Math.max(P,V);if(N>-2){const D=V>-.3&&P<.4?1-T(.9,1.5,V):0,Z=.85+.5*Math.max(X(P),D);w=ie(w,me(me(n-Z,B-1.2,1.5),-N,.35),.15)}const O=c-x;if(O<3.2&&O>-3.2&&n<y+3){const D=Math.atan2(g,M+1.3),Z=y*(.9+.1*Math.cos(D*l))*(.3+.7*T(2.95,1.9,Math.abs(D)));w=ie(w,me(Math.abs(O)-(.85-.08*Math.max(n,0)),n-Z,.4),.35)}return w},mat:(p,S,z,L,c)=>{G(p,S,z,q);const g=q[0],M=q[1],n=q[2],v=K(g,n),C=_(g,M,n),B=Math.min(Math.abs(M)-6.8,(g+9.5)*.8),w=B>-.3&&v<.4?1-T(.9,1.5,B):0,P=T(-.3,.1,Math.max(v,B))*T(.2,.6,C),V=Math.abs(g-x)<1.3&&C>1.6?1:0;let N=W(g,M,n)<.3&&n>6?1:0;if(N=Math.max(N,P*(1-V)*Math.max(X(v)*.6,w*.45),V*T(y*.6,y*.85,C)*.7),V){c.bronze=1,c.reef=.25,c.gold=N,c.eng=0,c.a=g,c.b=M,c.c=n;return}const O=ue(Math.max(T(-11,-17,g),T(-3,-10,n)*.9)+.38*P*T(.25,.8,L)+.25*T(8.4,9.6,Math.abs(M)),0,1);c.bronze=P,c.reef=O,c.gold=N,c.eng=T(6.5,8.3,n)*(1-P),c.a=g,c.b=M,c.c=n},loc:G,world:U,dir:$,f0:I}}function Dt(a,r){const o=a.O,t=a.F,s=a.S,d=a.N,f=(n,v,C,B)=>{const w=n-o.x,P=v-o.y,V=C-o.z;return B[0]=w*t.x+P*t.y+V*t.z,B[1]=w*s.x+P*s.y+V*s.z,B[2]=w*d.x+P*d.y+V*d.z,B},h=(n,v,C)=>new m.Vector3().copy(o).addScaledVector(t,n).addScaledVector(s,v).addScaledVector(d,C),l=[],y=[],x=[],i=[5.3,1.8,-1.9,-5.6],R=[1.5,1.56,1.48,1.3],k=h(.9,0,8.4),F=a.A,G=new m.Vector3(0,1,0).cross(F).normalize(),U=new m.Vector3,$=(n,v,C)=>(U.copy(k).addScaledVector(F,n).addScaledVector(G,v),U.y+=C,f(U.x,U.y,U.z,[0,0,0])),q=[F.dot(t),F.dot(s),F.dot(d)],_=Math.min(9.9,(a.surfaceY??26)-1.3-k.y)*(.96+.04*Math.min(a.curl,1.1)),J=[[4.8,1.6,_-.4],[4.1,-3.6,_],[3.4,-8.3,_-2],[2.8,-11.4,_-5.6]];for(let n=0;n<4;n++){const v=J[n],C=$(v[0]+r.range(-.4,.4),v[1]+r.range(-.5,.5),v[2]),B=[7.2,i[n],.25],w=[R[n],R[n]*.94,R[n]*.84,R[n]*.7],P=[B];for(const[V,N]of[[.36,4.2],[.72,3.3]])P.push([fe(B[0],C[0],V)+q[0]*N,fe(B[1],C[1],V)+q[1]*N,fe(B[2],C[2],V)+q[2]*N]);P.push(C);for(let V=0;V<3;V++)l.push({a:P[V],b:P[V+1],ra:w[V],rb:w[V+1],f:n,kn:V<2?w[V+1]*1.14:0});y.push(h(C[0],C[1],C[2])),x.push(P)}{const n=[-3.4,6.1,.5],v=$(-1.2,9.9,.8),C=[fe(n[0],v[0],.5),fe(n[1],v[1],.5)+1.7,fe(n[2],v[2],.5)-.6];l.push({a:n,b:C,ra:1.8,rb:1.46,f:4,kn:1.66},{a:C,b:v,ra:1.46,rb:1.12,f:4,kn:0}),y.push(h(v[0],v[1],v[2])),x.push([n,C,v])}const I=x.map(n=>n[n.length-1]),K=x.map(n=>{const v=[0,0,0];for(const B of n)v[0]+=B[0]/n.length,v[1]+=B[1]/n.length,v[2]+=B[2]/n.length;let C=0;for(const B of n)C=Math.max(C,Math.hypot(B[0]-v[0],B[1]-v[1],B[2]-v[2]));return[v[0],v[1],v[2],C+2.1]}),X=f(a.elbow.x,a.elbow.y,a.elbow.z,[0,0,0]),W=[-6.8,0,-.3],ee=Math.hypot(X[0]-W[0],X[1]-W[1],X[2]-W[2]),E=[(X[0]-W[0])/ee,(X[1]-W[1])/ee,(X[2]-W[2])/ee],p=9.5,S=[W[0]+E[0]*p,W[1]+E[1]*p,W[2]+E[2]*p],z=(n,v,C)=>{const B=n-W[0],w=v-W[1],P=C-W[2],V=B*E[0]+w*E[1]+P*E[2],N=B-E[0]*V,O=w-E[1]*V,D=P-E[2]*V,Z=Math.sqrt(N*N+O*O+D*D),Q=Math.abs(V-8.4)>.95?.72:.5;return me(Math.abs(V-8.4)-1.45,Z-(2.85+.047*V+Q),.25)},L=[0,0,0],c=(n,v,C,B)=>{const w=n+.5,P=Math.sqrt(w*w+(v-1)*(v-1)+(C-3)*(C-3));if(P>34&&!B)return P-27;const V=.016*(.5*n*n+v*v);let N=Ee(n+.5,v,C-V+.2,7.6,6.6,1.7,1.5);N=ie(N,ge(n+3.6,v-4.6,C-1.1,4.2,3,2),1.2),N=ie(N,ge(n+4.6,v+4.6,C-.9,4,2.4,1.7),1.2),N=ie(N,ge(n-6.1,v+.2,C-1,1.9,6.3,1.5),1);const O=n-.8,D=C-12.4;N=me(N,-(Math.sqrt(O*O+v*v+D*D)-12),1.5),N=ie(N,tt(n,v,C,W[0],W[1],W[2],S[0],S[1],S[2],2.85,3.3),2.4),N=ie(N,z(n,v,C),.2);for(let Z=0;Z<5;Z++){const Q=K[Z],Y=n-Q[0],re=v-Q[1],ne=C-Q[2];if(Math.sqrt(Y*Y+re*re+ne*ne)-Q[3]>N+1.4&&!B)continue;let te=1e9;for(let ce=0;ce<l.length;ce++){const oe=l[ce];if(oe.f!==Z)continue;const Me=tt(n,v,C,oe.a[0],oe.a[1],oe.a[2],oe.b[0],oe.b[1],oe.b[2],oe.ra,oe.rb);if(te=te>1e8?Me:ie(te,Me,.35),oe.kn){const ze=n-oe.b[0],xe=v-oe.b[1],pe=C-oe.b[2];te=ie(te,Math.sqrt(ze*ze+xe*xe+pe*pe)-oe.kn,.3)}}N=ie(N,te,Z===4?1.3:.3)}return N};return{sdf:(n,v,C,B)=>(f(n,v,C,L),c(L[0],L[1],L[2],B)),sdfL:c,mat:(n,v,C,B,w)=>{f(n,v,C,L);const P=L[0],V=L[1],N=L[2],O=B[0]*d.x+B[1]*d.y+B[2]*d.z,D=Math.sqrt((P-.8)*(P-.8)+V*V);w.eng=T(.35,.75,O)*T(8.2,6.8,D)*T(3.2,2.2,N);let Z=1e9;for(let Y=0;Y<I.length;Y++)Z=Math.min(Z,Math.hypot(P-I[Y][0],V-I[Y][1],N-I[Y][2])-(Y===4?.6:0));const Q=T(3.6,2.6,Z);w.bronze=1,w.gold=Math.max(z(P,V,N)<.25?.72:0,Q*.85),w.reef=ue(.1+.55*T(-5,-13,P)+.4*T(.1,-.6,O)*T(9,3,P)*T(6,2,N)+.12*T(.3,.9,B[1])*T(5,9,N)-w.eng-Q,0,1),w.a=P,w.b=V,w.c=N},loc:f,world:h,tips:y,fingers:x,wristEnd:h(S[0],S[1],S[2]),wristStart:h(W[0],W[1],W[2]),stubDir:E}}function Gt(){return{pos:[],nor:[],mat:[],lit:[],loc:[],idx:[],n:0}}async function It(a,r){const o=new m.BufferGeometry;return o.setAttribute("position",new m.Float32BufferAttribute(a.pos,3)),r&&await r(),o.setAttribute("normal",new m.Float32BufferAttribute(a.nor,3)),r&&await r(),o.setAttribute("aMat",new m.Float32BufferAttribute(a.mat,3)),r&&await r(),o.setAttribute("aLit",new m.Float32BufferAttribute(a.lit,3)),r&&await r(),o.setAttribute("aLoc",new m.Float32BufferAttribute(a.loc,4)),r&&await r(),o.setIndex(a.idx),o}async function xt(a,r,o,t,s){const d={bronze:0,reef:0,gold:0,eng:0,a:0,b:0,c:0},f=a.n,h=[0,0,0];for(let l=0;l<r.count;l++){s&&(l&1023)===1023&&await s();const y=r.P[l*3],x=r.P[l*3+1],i=r.P[l*3+2];h[0]=r.N[l*3],h[1]=r.N[l*3+1],h[2]=r.N[l*3+2],o(y,x,i,t===1?h[1]:h,d),a.pos.push(y,x,i),a.nor.push(h[0],h[1],h[2]),a.mat.push(d.bronze,d.reef,d.gold),a.lit.push(r.lit[l*3],r.lit[l*3+1],d.eng),a.loc.push(d.a,d.b,d.c,t)}s&&await s();for(let l=0;l<r.idx.length;l++)a.idx.push(f+r.idx[l]);a.n+=r.count}async function Ot(a,r,o,t,s){const d=o.map(p=>new m.Vector3(p[0],p[1],p[2])),f=new m.CatmullRomCurve3(d,!1,"centripetal"),h=t.rings,l=t.segs,y=a.n,x=t.sup??.82,i=o.length-1,R=[],k=new m.Vector3,F=new m.Vector3,G=new m.Vector3,U=new m.Vector3,$=t.up||new m.Vector3(0,1,0),q=new Float32Array((h+1)*(l+1)*3),_=new Float32Array(q.length),J=new Float32Array(q.length/3),I=new Float32Array(q.length/3),K=new Float32Array(q.length/3),X=new Float32Array(q.length/3),W=(p,S,z,L,c)=>.5*(2*S+(-p+z)*c+(2*p-5*S+4*z-L)*c*c+(-p+3*S-3*z+L)*c*c*c);for(let p=0;p<=h;p++){s&&p%4===3&&await s();const S=p/h,z=S*i,L=Math.min(i-1,Math.floor(z)),c=z-L,g=o[Math.max(L-1,0)],M=o[L],n=o[L+1],v=o[Math.min(L+2,i)],C=Math.max(.05,W(g[3],M[3],n[3],v[3],c)),B=Math.max(.05,W(g[4],M[4],n[4],v[4],c));f.getPoint(S,k),f.getTangent(S,F),G.copy($).addScaledVector(F,-$.dot(F)).normalize(),U.crossVectors(F,G),k.y<C&&p%3===0&&R.push({x:k.x,z:k.z,r:Math.max(Math.abs(U.x),Math.abs(U.z))*B*Math.sqrt(Math.max(.05,1-Math.min(1,k.y*k.y/(C*C))))+.5});for(let w=0;w<=l;w++){const P=-Math.PI/2+w%l/l*Math.PI*2,V=Math.cos(P),N=Math.sin(P),O=Math.sign(V)*Math.pow(Math.abs(V),x)*B,D=Math.sign(N)*Math.pow(Math.abs(N),x)*C;let Z=k.x+U.x*O+G.x*D,Q=k.y+U.y*O+G.y*D,Y=k.z+U.z*O+G.z*D;const re=Math.sqrt(O*O+D*D)||1,ne=(U.x*O+G.x*D)/re,te=(U.y*O+G.y*D)/re,ce=(U.z*O+G.z*D)/re,oe=t.bump*(t.bumpAt?t.bumpAt(Z):1)*(r.fbm3(Z*t.bumpF,Q*t.bumpF,Y*t.bumpF,3)+.35*r.n3(Z*t.bumpF*4.3,Q*t.bumpF*4.3,Y*t.bumpF*4.3))*Math.min(1,re/3),Me=Math.atan2(Math.abs(D)/C,O/B),ze=(C+B)*.5,xe=t.inset?t.inset(k.x,D,Me,ze,C):0,pe=oe-xe;Z+=ne*pe,Q+=te*pe,Y+=ce*pe;const de=(p*(l+1)+w)*3;q[de]=Z,q[de+1]=Q,q[de+2]=Y,J[de/3]=xe,I[de/3]=D,K[de/3]=Me,X[de/3]=ze}}s&&await s();const ee=t.yCut??-1.2,E=[];for(let p=0;p<h;p++)for(let S=0;S<l;S++){const z=p*(l+1)+S,L=z+1,c=z+l+1,g=c+1;q[z*3+1]<ee&&q[L*3+1]<ee&&q[c*3+1]<ee&&q[g*3+1]<ee||E.push(z,c,L,L,c,g)}for(let p=0;p<E.length;p+=3){const S=E[p]*3,z=E[p+1]*3,L=E[p+2]*3,c=q[z]-q[S],g=q[z+1]-q[S+1],M=q[z+2]-q[S+2],n=q[L]-q[S],v=q[L+1]-q[S+1],C=q[L+2]-q[S+2],B=g*C-M*v,w=M*n-c*C,P=c*v-g*n;_[S]+=B,_[S+1]+=w,_[S+2]+=P,_[z]+=B,_[z+1]+=w,_[z+2]+=P,_[L]+=B,_[L+1]+=w,_[L+2]+=P}s&&await s();{const p=Math.floor(h/2),S=(p*(l+1)+Math.floor(l/4))*3;if(f.getPoint(p/h,k),_[S]*(q[S]-k.x)+_[S+1]*(q[S+1]-k.y)+_[S+2]*(q[S+2]-k.z)<0){for(let z=0;z<_.length;z++)_[z]=-_[z];for(let z=0;z<E.length;z+=3){const L=E[z+1];E[z+1]=E[z+2],E[z+2]=L}}}for(let p=0;p<=h;p++){const S=p*(l+1)*3,z=S+l*3;for(let L=0;L<3;L++){const c=_[S+L]+_[z+L];_[S+L]=c,_[z+L]=c}}for(let p=0;p<q.length/3;p++){s&&p%400===399&&await s();let S=_[p*3],z=_[p*3+1],L=_[p*3+2];const c=Math.hypot(S,z,L)||1;S/=c,z/=c,L/=c;const g=q[p*3],M=q[p*3+1],n=q[p*3+2],v=Math.floor(p/(l+1))/h;a.pos.push(g,M,n),a.nor.push(S,z,L);const C=I[p],B=K[p],w=X[p],P=ue(J[p]/1.4,0,1);a.mat.push(typeof t.bronze=="function"?t.bronze(v,g,M,n,C,B,w):t.bronze??.7,ue(typeof t.reef=="function"?t.reef(v,g,M,n,z,C,B,w):t.reef,0,1),t.gold?t.gold(v,g,M,n,C,B,w):0),a.lit.push((.5+.5*T(0,7.5,M))*(1-.4*P),(.25+.75*T(-.4,.3,z))*(1-.4*P),0),a.loc.push(g,M,n,0)}for(let p=0;p<E.length;p++)a.idx.push(y+E[p]);return a.n+=q.length/3,R}function jt(a,r,o){return(t,s,d)=>{const f=Math.max(-132-t,t-129,-48-s,s-57,0);let h=0,l=1e9;if(f<30)for(let x=0;x<r.length;x++){const i=r[x],R=t-i.x,k=s-i.z;if(R>60||R<-60||k>60||k<-60)continue;const F=Math.sqrt(R*R+k*k)-i.r;if(F>40)continue;const G=Math.min(3.2,.5+.16*i.r)*(i.amp??1);h=Math.max(h,G*Math.exp(-Math.max(0,F)/(2.5+i.r*.45))),l=Math.min(l,F)}let y=h+.45*a.fbm2(t*.03,s*.03,3)*(1+h*.3)+.25*a.n2(t*.011+7,s*.011);return y*=T(0,22,Math.min(t+132,129-t,s+48,57-s)),o==="apron"&&(y-=1.8*T(8,45,f)),d&&(d.gap=l),y}}async function Ht(a,r,o,t,s,d){const h=[],l=[],y=($,q,_)=>{const J=t==="apron"?45:s,I=[];for(let K=4.800000000000001,X=4.800000000000001;K<J;X*=1.75,K+=X)I.push(Math.min(K,J));I.push(J);for(let K=I.length-1;K>=0;K--)_.push($-I[K]);for(let K=$;K<=q+.01;K+=3)_.push(K);for(let K=0;K<I.length;K++)_.push(q+I[K])};y(-132,129,h),y(-48,57,l);const x={gap:0},i=h.length,R=l.length,k=new Float32Array(i*R*3),F=new Float32Array(i*R*2),G=[];for(let $=0;$<R;$++){d&&$%5===0&&await d();for(let q=0;q<i;q++){const _=h[q],J=l[$],I=$*i+q,K=a(_,J,x),X=x.gap;k[I*3]=_,k[I*3+1]=K,k[I*3+2]=J;let W=1;for(const ee of r)Math.hypot(_-ee.x,J-ee.z)<ee.r&&(W=Math.min(W,Et(ee.sdf,_,K+.2,J,o,ee.k)));F[I*2]=1-.5*Math.exp(-Math.max(0,X)/3.5),F[I*2+1]=(.1+.9*W)*(1-.45*Math.exp(-Math.max(0,X)/5.5))}}for(let $=0;$<R-1;$++)for(let q=0;q<i-1;q++){const _=$*i+q,J=_+1,I=_+i,K=I+1;G.push(_,I,J,J,I,K)}const U=new m.BufferGeometry;return U.setAttribute("position",new m.BufferAttribute(k,3)),U.setAttribute("aLit",new m.BufferAttribute(F,2)),U.setIndex(G),U.computeVertexNormals(),U}function Ve(){const a=[],r=[];return{pos:a,cv:r,tri(o,t,s,d,f,h){a.push(o.x,o.y,o.z,t.x,t.y,t.z,s.x,s.y,s.z),r.push(d[0],d[1],d[2],f[0],f[1],f[2],h[0],h[1],h[2])},geometry(){const o=new m.BufferGeometry;o.setAttribute("position",new m.Float32BufferAttribute(a,3)),o.setAttribute("aCv",new m.Float32BufferAttribute(r,3));const t=Kt(o,.001);return t.computeVertexNormals(),o.dispose(),t}}}function Kt(a,r){const o=a.attributes.position.array,t=a.attributes.aCv.array,s=new Map,d=[],f=[],h=[],l=1/r;for(let x=0;x<o.length/3;x++){const i=Math.round(o[x*3]*l)+"_"+Math.round(o[x*3+1]*l)+"_"+Math.round(o[x*3+2]*l);let R=s.get(i);R===void 0&&(R=d.length/3,s.set(i,R),d.push(o[x*3],o[x*3+1],o[x*3+2]),f.push(t[x*3],t[x*3+1],t[x*3+2])),h.push(R)}const y=new m.BufferGeometry;return y.setAttribute("position",new m.Float32BufferAttribute(d,3)),y.setAttribute("aCv",new m.Float32BufferAttribute(f,3)),y.setIndex(h),y}function Ue(a,r,o,t,s,d,f=1.6){const h=[],l=new m.Vector3,y=new m.Vector3(1,0,.3).normalize(),x=new m.Vector3;for(let i=0;i<r.length;i++){l.copy(r[Math.min(i+1,r.length-1)]).sub(r[Math.max(i-1,0)]).normalize(),y.addScaledVector(l,-y.dot(l)),y.lengthSq()<1e-4&&y.set(0,0,1).addScaledVector(l,-l.z),y.normalize(),x.crossVectors(l,y);const R=[];for(let k=0;k<t;k++){const F=k/t*Math.PI*2;R.push(r[i].clone().addScaledVector(y,Math.cos(F)*o[i]).addScaledVector(x,Math.sin(F)*o[i]))}h.push(R)}for(let i=0;i<h.length-1;i++)for(let R=0;R<t;R++){const k=h[i][R],F=h[i][(R+1)%t],G=h[i+1][R],U=h[i+1][(R+1)%t];a.tri(k,F,G,s(i),s(i),s(i+1)),a.tri(F,U,G,s(i),s(i+1),s(i+1))}if(d){const i=h.length-1,R=r[i].clone().addScaledVector(l,o[i]*f);for(let k=0;k<t;k++)a.tri(h[i][k],h[i][(k+1)%t],R,s(i),s(i),d)}}function Xt(a,r){const o=Ve(),t=4,s=9,d=a.range(0,50),f=[];for(let l=0;l<=t;l++){const y=[];for(let x=0;x<s;x++){const i=l/t*1.45,R=x/s*Math.PI*2+l*.35,k=Math.sin(i)*Math.cos(R),F=Math.sin(i)*Math.sin(R),G=Math.cos(i),U=.5*(1+.38*r.n3(k*1.6+d,G*1.6,F*1.6));y.push(new m.Vector3(k*U,(G*.72+.02)*U*1.25-.06,F*U))}f.push(y)}const h=l=>[1-l/t*.75,0,0];for(let l=0;l<t;l++)for(let y=0;y<s;y++){const x=f[l][y],i=f[l][(y+1)%s],R=f[l+1][y],k=f[l+1][(y+1)%s];l>0&&o.tri(x,R,i,h(l),h(l+1),h(l)),o.tri(i,R,k,h(l),h(l+1),h(l+1))}return o.geometry()}function Zt(a){const r=Ve(),o=new m.Vector3(0,1,0),t=(s,d,f,h,l)=>{const y=new m.Vector3(s,d-.04,f),x=[],i=[],R=new m.Vector3(s,d-.16,f);for(let k=0;k<l;k++){const F=k/l*Math.PI*2,G=h*a.range(.8,1.12);x.push(new m.Vector3(s+Math.cos(F)*G*.55,d,f+Math.sin(F)*G*.55)),i.push(new m.Vector3(s+Math.cos(F)*G,d+.05+a.range(-.02,.03),f+Math.sin(F)*G))}for(let k=0;k<l;k++){const F=(k+1)%l;r.tri(y,x[F],x[k],[.7,0,0],[.85,0,0],[.85,0,0]),r.tri(x[k],x[F],i[k],[.85,0,0],[.85,0,0],[1,0,.6]),r.tri(x[F],i[F],i[k],[.85,0,0],[1,0,.6],[1,0,.6]),r.tri(R,i[k],i[F],[.25,0,0],[.5,0,.3],[.5,0,.3])}};return Ue(r,[new m.Vector3(0,-.1,0),new m.Vector3(.03,.42,.02)],[.16,.24],5,s=>[.2+s*.3,0,0]),t(0,.46,0,.62,10),t(a.range(-.2,.2),.27,a.range(.2,.34),.36,7),r.geometry()}function $t(a){const r=Ve(),o=(t,s,d,f,h)=>{const l=t.clone().addScaledVector(s,d);if(Ue(r,[t,l],[f,f*.62],3,x=>[.3+.2*(2-h)+x*.2,0,h===0&&x?.5:0],h===0?[1,0,1]:null),h===0)return;const y=h===2?3:2;for(let x=0;x<y;x++){const i=s.clone().add(new m.Vector3(a.range(-1,1),a.range(-.1,.6),a.range(-1,1)).multiplyScalar(.85)).normalize();o(t.clone().lerp(l,a.range(.55,.95)),i,d*a.range(.6,.8),f*.62,h-1)}};for(let t=0;t<2;t++)o(new m.Vector3(a.range(-.12,.12),-.08,a.range(-.12,.12)),new m.Vector3(a.range(-.4,.4),1,a.range(-.4,.4)).normalize(),.42,.09,t===0?2:1);return r.geometry()}function Qt(a){const r=Ve(),o=8,t=3,s=[];for(let f=0;f<=t;f++){const h=[];for(let l=0;l<=o;l++){const y=-1.15+l/o*2.3,x=f/t*(f===t?a.range(.82,1.08):1);h.push(new m.Vector3(Math.sin(y)*x*.7,.12+Math.cos(y)*x*.88,.1*Math.sin(y*2.2+f)*x))}s.push(h)}const d=f=>[.35+.65*(f/t),f/t*(f/t),f===t?.7:0];for(let f=0;f<t;f++)for(let h=0;h<o;h++){const l=s[f][h],y=s[f][h+1],x=s[f+1][h],i=s[f+1][h+1];f>0&&r.tri(l,y,x,d(f),d(f),d(f+1)),r.tri(y,i,x,d(f),d(f+1),d(f+1))}return Ue(r,[new m.Vector3(0,-.1,0),new m.Vector3(0,.16,0)],[.06,.04],3,()=>[.3,0,0]),r.geometry()}function Jt(a){const r=Ve(),o=5;for(let t=0;t<o;t++){const s=t/o*Math.PI*2+a.range(-.4,.4),d=t===0?.05:a.range(.25,.6),f=t===0?1:a.range(.6,.9),h=[],l=[];for(let y=0;y<=3;y++){const x=y/3;h.push(new m.Vector3(Math.cos(s)*d*x*x*f,-.08+x*f,Math.sin(s)*d*x*x*f)),l.push(.085+.06*Math.sin(x*2.3))}Ue(r,h,l,4,y=>[.3+.7*(y/3),y/3*(y/3),y===3?.8:0],[1,1,1],.75)}return r.geometry()}const De=`
uniform float uTime; uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uBounceCol;
uniform vec3 uCaus; uniform vec4 uWater;
float hash13(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), f.x), mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), f.x), mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float fbm(vec3 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + vec3(17.1, 3.7, 9.2); a *= 0.5; } return s / 0.9375; }
float causticLayer(vec2 uv, float time) {
  vec2 p = mod(uv * 6.28318, 6.28318) - 250.0, i = p; float c = 1.0;
  for (int n = 0; n < 4; n++) {
    float t = time * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + t) / 0.005), p.y / (cos(i.y + t) / 0.005)));
  }
  c = 1.17 - pow(c / 4.0, 1.4);
  return pow(abs(c), 8.0);
}
// animated caustic light, projected along the sun direction; ~0.3 on average with bright moving filaments
float caustics(vec3 wp, float dist) {
  vec2 q = (wp.xz - uSunDir.xz / max(uSunDir.y, 0.25) * wp.y) * uCaus.x; float t = uTime * uCaus.z;
  float a = causticLayer(q, t), b = causticLayer(mat2(0.8, -0.6, 0.6, 0.8) * q * 0.61 + 3.7, t * 0.83 + 4.0);
  float pch = 0.6 + 0.8 * vnoise(vec3(q * 0.31, t * 0.12));
  float c = (a * 1.25 + b * 0.95 + min(a, b) * 1.2) * pch;
  return mix(c, 0.42, smoothstep(140.0, 480.0, dist));
}
vec3 bumpN(vec3 N, vec3 p, float h, float amt) {
  vec3 dpdx = dFdx(p), dpdy = dFdy(p); float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpdy, N), r2 = cross(N, dpdx); float det = dot(dpdx, r1);
  return normalize(abs(det) * N - amt * sign(det) * (hx * r1 + hy * r2));
}
// sun (with caustics and baked shadow) + turquoise sky from above + warm sand bounce from below
vec3 seaLight(vec3 N, vec3 wp, float ao, float sh, float dist, out float caus) {
  caus = caustics(wp, dist);
  float ndl = max(dot(N, normalize(uSunDir)), 0.0);
  vec3 sun = uSunCol * ndl * sh * (0.3 + uCaus.y * caus);
  vec3 amb = mix(uBounceCol * (0.35 + 0.65 * ao), uSkyCol, smoothstep(-0.7, 0.8, N.y)) * ao * ao;
  amb *= mix(vec3(0.25, 0.5, 0.85), vec3(1.0), smoothstep(0.15, 0.7, ao));
  return sun + amb;
}
vec3 waterFog(vec3 col, float dist) { return mix(uWater.rgb, col, exp(-uWater.a * dist)); }
`,vo=De,Yt=`
uniform vec3 uSeed;
attribute vec3 aMat; attribute vec3 aLit; attribute vec4 aLoc;
varying vec3 vW; varying vec3 vN; varying vec3 vP; varying vec3 vMat; varying vec3 vLit; varying vec4 vLoc;
#include <fog_pars_vertex>
void main() {
  vP = position + uSeed; vMat = aMat; vLit = aLit; vLoc = aLoc;
  vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,eo=`
${De}
uniform vec3 uStone; uniform vec3 uBronze; uniform vec3 uVerd; uniform vec3 uVerdPale; uniform vec3 uGold;
uniform vec3 uReefA; uniform vec3 uReefB; uniform vec3 uReefC; uniform vec3 uReefRock; uniform vec3 uGlowCol;
uniform vec4 uEye; uniform vec3 uPalm; uniform vec3 uFace;   // uFace: brow a, gold survival 0..1, brow arch
varying vec3 vW; varying vec3 vN; varying vec3 vP; varying vec3 vMat; varying vec3 vLit; varying vec4 vLoc;
#include <fog_pars_fragment>
float seamLines(vec3 p, vec3 an, float size) {
  vec2 q = (an.z > an.x && an.z > an.y) ? p.yx : ((an.y > an.x) ? p.zx : p.zy);
  q /= size; q.x += 0.5 * floor(q.y);
  vec2 f = abs(fract(q) - 0.5);
  return 1.0 - smoothstep(0.03, 0.1, min(0.5 - f.x, (0.5 - f.y) * 0.8) * size);
}
void main() {
  vec3 N = normalize(vN);
  float bronze = vMat.x, reefA = vMat.y, gold = vMat.z, ao = vLit.x, sh = vLit.y, eng = vLit.z, part = vLoc.w;
  vec3 q = vLoc.xyz;
  float dist = length(cameraPosition - vW), lod = 1.0 - smoothstep(90.0, 260.0, dist), fine = 1.0 - smoothstep(22.0, 75.0, dist);
  float nBig = fbm(vP * 0.09 + 3.0), nMid = fbm(vP * 0.45 + 11.0), nFine = vnoise(vP * 2.7);
  vec3 an = abs(normalize(cross(dFdx(q), dFdy(q)) + 1e-6));
  float seam = seamLines(q, an, part > 0.5 ? 5.4 : 7.2) * lod;
  // pale stone, faintly banded and algae-tinged
  // (the body's dressed stone is a darker, greyer block than the mask, so legs and torso stand off the white sand)
  vec3 stone = uStone * (0.72 + 0.3 * nMid + 0.1 * nFine) * (part < 0.5 ? vec3(0.62, 0.64, 0.68) : vec3(1.12, 1.1, 1.06));
  stone = mix(stone, stone * vec3(0.8, 0.92, 0.84), smoothstep(0.45, 0.75, nBig) * 0.6);
  stone *= 0.9 + 0.1 * sin(q.x * 2.4 + nMid * 5.0);
  stone *= 1.0 - fine * (0.16 * smoothstep(0.5, 0.75, vnoise(vP * 5.3 + 80.0)) + 0.1 * smoothstep(0.55, 0.3, vnoise(vP * vec3(1.3, 6.0, 1.3) + 90.0)));   // pitting and tool marks up close
  // bronze: dark metal on rubbed high spots, verdigris everywhere else, streaked along gravity
  float streak = fbm(vec3(vP.x * 0.55, vP.y * 0.07, vP.z * 0.55) + 5.0);
  float verd = smoothstep(0.36, 0.62, nMid * 0.5 + streak * 0.6 + 0.08 * N.y + (1.0 - ao) * 0.3);
  vec3 bz = mix(uBronze * (0.7 + 0.6 * nFine), mix(uVerd, uVerdPale, smoothstep(0.3, 0.72, nBig + 0.3 * nFine - 0.12)), verd);
  if (part > 1.5) bz = mix(bz, uVerd * (0.8 + 0.5 * nFine), 0.4) * 0.8;   // the hand: deep verdigris, so it stands against the bright water
  float bm = smoothstep(0.35, 0.65, bronze + (nFine - 0.5) * 0.2);
  vec3 alb = mix(stone, bz, bm);
  float groove = 0.0, dark = 0.0;
  if (part > 0.5 && part < 1.5) {
    // the mask: carved crescent of the sleeping eye with gold on its lips, the lip line, verdigris tears
    float bb = q.y - uEye.y, k2 = 2.0 * uEye.z * bb;
    float da = abs(q.x - (uEye.x - 0.55 + uEye.z * bb * bb)) / sqrt(1.0 + k2 * k2);
    float endm = (1.0 - smoothstep(uEye.w, uEye.w + 0.3, abs(bb))) * eng;
    groove = (1.0 - smoothstep(0.15, 0.55, da)) * endm;
    // gold is an inlay here, not a tube: a 0.4 m line along the middle of the brow bar, a narrow lip on the crescent
    float browD = abs(q.x - (uFace.x - uFace.z * q.y * q.y));
    if (q.z > 6.0 && browD < 1.7 && abs(q.y) < 7.7) gold *= 1.0 - smoothstep(0.17, 0.3, browD);
    gold = max(gold, smoothstep(0.86, 0.72, da) * smoothstep(0.4, 0.5, da) * endm);
    float lip = (1.0 - smoothstep(0.06, 0.3, abs(q.x + 8.62))) * (1.0 - smoothstep(2.1, 2.7, abs(q.y))) * eng;
    groove = max(groove, lip); dark = groove;
    float run = vnoise(vec3(q.y * 1.15, q.x * 0.07, 2.0)) * 0.65 + vnoise(vec3(q.y * 3.3, q.x * 0.18, 7.0)) * 0.35;
    float stain = eng * smoothstep(0.56, 0.8, run) * smoothstep(uFace.x + 0.4, uFace.x - 2.0, q.x) * (0.45 + 0.55 * smoothstep(-13.0, 2.0, q.x));
    alb = mix(alb, mix(uVerd, uVerdPale, 0.6) * (0.8 + 0.3 * nFine), stain * 0.4);
  } else if (part > 1.5) {
    // the palm: concentric gold-inlaid rings and a sun-ray band, the setting that holds the portal
    vec2 pc = q.xy - uPalm.xy; float r = length(pc), ang = atan(pc.y, pc.x);
    float ring = min(min(abs(r - 2.5), abs(r - 4.3)), abs(r - 5.9));
    float ray = abs(fract(ang * 18.0 / 6.28318) - 0.5) * 6.28318 / 18.0 * r;
    float ld = min(ring, (r > 4.3 && r < 5.9) ? ray : 9.0);
    groove = (1.0 - smoothstep(0.1, 0.3, ld)) * eng;
    gold = max(gold, groove);
  } else if (q.x > 104.5) {
    // the soles: the same setting as the palm, carved where the ball and the heel of each foot press, and a gold rim
    float face = smoothstep(0.55, 0.8, N.x);
    vec2 pa = q.zy - vec2(8.6, 5.2), pb = q.zy - vec2(-2.4, 5.0); float ra = length(pa), rb = length(pb);
    float ring = min(min(min(abs(ra - 1.9), abs(ra - 3.4)), abs(ra - 4.9)), min(abs(rb - 1.5), abs(rb - 2.9)));
    float ray = abs(fract(atan(pa.y, pa.x) * 16.0 / 6.28318) - 0.5) * 6.28318 / 16.0 * ra;
    float ld = min(ring, (ra > 3.4 && ra < 4.9) ? ray : 9.0);
    groove = (1.0 - smoothstep(0.1, 0.32, ld)) * face * step(0.5, q.y);
    gold = max(gold, max(groove * 0.9, 0.8 * smoothstep(0.3, 0.45, N.x) * (1.0 - smoothstep(0.62, 0.78, N.x)) * smoothstep(106.0, 107.0, q.x) * smoothstep(0.3, 1.2, q.y)));
  }
  // gold leaf survives in flakes
  float flake = smoothstep(0.45, 0.6, fbm(vP * 1.15 + 20.0) + (gold - 0.75) * 0.8 + (uFace.y - 0.5) * 0.5);
  gold = step(0.05, gold) * mix(gold * 0.5, flake, lod);
  alb *= 1.0 - seam * (0.05 + 0.27 * bm + (part < 0.5 ? 0.2 : 0.04) * (1.0 - bm)) * (1.0 - gold);
  alb *= mix(0.55, 1.0, smoothstep(0.1, 0.5, ao));
  alb *= 1.0 - 0.75 * dark * (1.0 - gold);
  float gk = (part > 0.5 && part < 1.5) ? 0.72 : 1.0;   // the leaf on the mask is duller than on the hand
  alb = mix(alb, uGold * (0.5 + 0.2 * nFine) * gk, gold);
  // reef crust
  float cn = fbm(vP * 0.3 + 30.0);
  float crust = smoothstep(0.48, 0.62, reefA * 0.8 + cn * 0.62 + max(N.y, 0.0) * 0.14 - 0.26 - groove - gold * 0.3);
  float cell = vnoise(vP * 0.8 + 40.0) * 0.7 + nMid * 0.3, cell2 = vnoise(vP * 3.1 + 50.0);
  float cell3 = vnoise(vP * 1.9 + 70.0), mid = 1.0 - smoothstep(60.0, 200.0, dist);
  vec3 rc = mix(uReefRock, uReefRock * vec3(0.66, 0.86, 0.78), smoothstep(0.3, 0.7, nBig + 0.3 * cell2 - 0.15));
  rc = mix(rc, uReefA, smoothstep(0.56, 0.7, cell + 0.12 * (cell2 - 0.5)) * (0.45 + 0.5 * cell2));
  rc = mix(rc, uReefB, smoothstep(0.38, 0.26, cell + 0.12 * (cell2 - 0.5)) * (0.45 + 0.5 * cell2));
  rc = mix(rc, uReefC, smoothstep(0.7, 0.76, cell3) * smoothstep(0.4, 0.5, cell) * 0.85 * mid);
  rc = mix(rc, uReefRock * 1.35, smoothstep(0.3, 0.24, cell3) * 0.6 * mid);          // pale dead-coral plates
  float cFine = vnoise(vP * 5.0 + 23.0);
  rc *= mix(0.92, 0.5 + 0.5 * nFine + 0.4 * cell2, 0.35 + 0.65 * fine) * (1.0 - fine * 0.42 * smoothstep(0.62, 0.3, cFine));   // pores and polyp cups up close
  alb = mix(alb, rc, crust);
  float h = crust * (nMid * 0.6 + cell * 0.35 + (cell2 * 0.16 + nFine * 0.06 + cFine * 0.09) * fine) + (1.0 - crust) * (nMid * 0.1 + nFine * 0.035 - seam * 0.14 * bm) - groove * 0.3 + gold * 0.04;
  N = bumpN(N, vW, h, lod);
  float caus;
  vec3 light = seaLight(N, vW, ao, sh, dist, caus);
  vec3 col = alb * light;
  vec3 V = normalize(cameraPosition - vW), L = normalize(uSunDir), Hh = normalize(L + V);
  float ndh = max(dot(N, Hh), 0.0), ndl = max(dot(N, L), 0.0);
  col += uSunCol * (0.4 + caus) * sh * ndl * (pow(ndh, 60.0) * gold * 2.6 * gk * uGold + pow(ndh, 18.0) * (gold * 0.5 * gk * uGold + bm * (1.0 - crust) * 0.08));
  col += uGold * gold * gk * gk * sh * (0.2 + 0.9 * caus) * pow(max(dot(N, normalize(L + vec3(0.0, 1.0, 0.0))), 0.0), 5.0);
  col += uSkyCol * pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.35 * ao;
  // fluorescent polyps twinkling in the crust
  float pol = smoothstep(0.84, 0.9, vnoise(vP * 4.4 + 60.0)) * crust * smoothstep(0.5, 0.62, cell) * fine;
  col += uGlowCol * pol * (1.6 + 1.2 * sin(uTime * 1.7 + cell2 * 40.0));
  gl_FragColor = vec4(waterFog(col, dist), 1.0);
  #include <fog_fragment>
}`,to=`
attribute vec2 aLit; varying vec3 vW; varying vec3 vN; varying vec2 vLit;
#include <fog_pars_vertex>
void main() {
  vLit = aLit; vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oo=`
${De}
uniform vec3 uSand;
varying vec3 vW; varying vec3 vN; varying vec2 vLit;
#include <fog_pars_fragment>
void main() {
  vec3 N = normalize(vN);
  float dist = length(cameraPosition - vW), lod = 1.0 - smoothstep(50.0, 190.0, dist);
  float w = fbm(vec3(vW.xz * 0.05, 1.0));
  float r1 = sin((vW.x * 0.94 + vW.z * 0.34) * 3.6 + w * 16.0 + sin(vW.z * 0.21) * 1.5);
  r1 = r1 * (0.6 + 0.4 * r1 * r1);
  float grain = vnoise(vec3(vW.xz * 2.1, 3.0));
  N = bumpN(N, vW, (0.05 * r1 + 0.025 * grain) * lod, 1.0);
  vec3 alb = uSand * (0.84 + 0.12 * fbm(vec3(vW.xz * 0.4, 9.0)) + 0.05 * r1 * lod);
  alb = mix(alb, alb * vec3(0.8, 0.9, 0.93), smoothstep(0.45, 0.75, fbm(vec3(vW.xz * 0.018, 4.0))) * 0.3);
  float caus;
  vec3 col = alb * seaLight(N, vW, vLit.x, vLit.y, dist, caus);
  col += uSunCol * step(0.975, vnoise(vec3(vW.xz * 7.0, floor(uTime * 2.0)))) * caus * 0.5 * lod * vLit.y;
  gl_FragColor = vec4(waterFog(col, dist), 1.0);
  #include <fog_fragment>
}`,wt=`
uniform float uTime;
attribute vec3 aCv; varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vCv; varying vec3 vL;
#include <fog_pars_vertex>
void main() {
  vec4 ip = instanceMatrix * vec4(position, 1.0);
  vec3 io = instanceMatrix[3].xyz; float sc = length(instanceMatrix[1].xyz), ph = dot(io, vec3(0.37, 0.21, 0.53));
  float s1 = sin(uTime * 1.05 + ph + position.y * 2.0), s2 = cos(uTime * 0.8 + ph * 1.3 + position.y * 1.4);
  ip.xyz += aCv.y * sc * 0.3 * vec3(s1 + 0.4 * sin(uTime * 0.31 + io.x * 0.05), 0.12 * s1 * s2, s2);
  vec4 wp = modelMatrix * ip; vW = wp.xyz; vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  vCv = aCv; vL = position;
  #ifdef USE_INSTANCING_COLOR
  vCol = instanceColor;
  #else
  vCol = vec3(0.8, 0.4, 0.4);
  #endif
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Mt=`
${De}
uniform float uGlow; uniform float uLace;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vCv; varying vec3 vL;
#include <fog_pars_fragment>
void main() {
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  float dist = length(cameraPosition - vW);
  if (uLace > 0.5) {   // sea fans are nets: ribs radiating from the holdfast, cross-linked
    float rr = length(vL.xy - vec2(0.0, 0.1)), aa = atan(vL.x, vL.y - 0.1);
    float rib = abs(fract(aa * 9.0 + 0.3 * sin(rr * 9.0)) - 0.5), web = abs(fract(rr * 11.0 + 0.5 * sin(aa * 14.0)) - 0.5);
    if (min(rib * rr * 1.6, web * 0.5) > 0.075 && rr > 0.12 && dist < 110.0) discard;
  }
  vec3 alb = vCol * (0.2 + 0.8 * vCv.x) * (0.7 + 0.6 * vnoise(vW * 2.6)) * (0.74 + 0.4 * smoothstep(-0.3, 0.3, sin(vnoise(vL * 5.0) * 24.0)));
  float caus;
  vec3 col = alb * seaLight(N, vW, 0.45 + 0.55 * vCv.x, 0.55 + 0.45 * vCv.x, dist, caus);
  col += mix(vCol, vec3(1.0), 0.3) * vCv.z * vCv.z * uGlow * (0.7 + 0.3 * sin(uTime * 1.3 + vW.x * 0.7 + vW.z * 0.9));
  gl_FragColor = vec4(waterFog(col, dist), 1.0);
  #include <fog_fragment>
}`,ao=`
uniform float uTime; uniform vec3 uEyeC; uniform vec3 uEyeN; uniform vec3 uEyeT1; uniform vec3 uEyeT2; uniform float uBurst;
attribute vec4 aSeed; varying vec3 vCol; varying float vShade; varying vec3 vW;
#include <fog_pars_vertex>
vec3 fishPos(float th) {
  float s = 0.5 + 0.5 * sin(th);
  float outw = -2.6 + (2.6 + (1.5 + 5.5 * aSeed.y) * uBurst) * s;
  float rad = 0.3 + 0.6 * aSeed.y + (0.5 + 2.4 * aSeed.y) * uBurst * s * s;
  float al = th * 2.0 + aSeed.w * 6.28318 + 0.6 * sin(th * 0.5 + aSeed.x * 20.0);
  return uEyeC + uEyeN * outw + (uEyeT1 * cos(al) + uEyeT2 * sin(al)) * rad;
}
void main() {
  float th = uTime * (0.22 + 0.2 * aSeed.z) + aSeed.x * 6.28318;
  vec3 c = fishPos(th), d = normalize(fishPos(th + 0.03) - c);
  vec3 side = normalize(cross(vec3(0.0, 1.0, 0.0), d) + vec3(1e-4, 0.0, 0.0)), upv = cross(d, side);
  float size = 0.2 + 0.2 * aSeed.z;
  float wag = sin(uTime * 9.0 + aSeed.x * 40.0 - position.x * 3.0) * 0.16 * (0.55 - position.x);
  vec3 p = c + (d * position.x + upv * position.y + side * (position.z + wag)) * size;
  vec4 wp = modelMatrix * vec4(p, 1.0); vW = wp.xyz;
  vCol = aSeed.w < 0.55 ? vec3(1.0, 0.62, 0.05) : vec3(0.03, 0.25, 1.0);
  vShade = 0.55 + 0.45 * position.y * 2.5 + 0.35 * sin(th * 2.0 + aSeed.x * 9.0);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,no=`
uniform vec4 uWater; uniform vec3 uSunCol;
varying vec3 vCol; varying float vShade; varying vec3 vW;
#include <fog_pars_fragment>
void main() {
  vec3 col = vCol * (0.3 + 1.0 * clamp(vShade, 0.0, 1.4)) * (0.6 + 0.4 * uSunCol);
  col = mix(uWater.rgb, col, exp(-uWater.a * length(cameraPosition - vW)));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function ro(a,r){const o=new m.InstancedBufferGeometry,t=[.5,0,0,.2,.17,0,-.22,.1,0,-.5,.2,0,-.5,-.2,0,-.22,-.1,0,.2,-.17,0,.1,0,.07,.1,0,-.07,-.3,0,0];o.setAttribute("position",new m.Float32BufferAttribute(t,3)),o.setIndex([0,1,6,1,2,6,6,2,5,2,3,4,2,4,5,0,7,9,0,9,8]);const s=new Float32Array(a*4);for(let d=0;d<s.length;d++)s[d]=r();return o.setAttribute("aSeed",new m.InstancedBufferAttribute(s,4)),o.instanceCount=a,o}const so=`
uniform float uTime; uniform vec3 uLips; uniform vec3 uLipN; uniform float uRise; uniform float uExhale;
attribute vec4 aB; varying vec2 vUv; varying float vA;
#include <fog_pars_vertex>
void main() {
  float life = fract(uTime * (0.055 + 0.04 * aB.w) + aB.x), on = step(aB.z, 0.45 + 0.55 * uExhale);
  float spread = 0.25 + 2.4 * life, wob = life * 0.6;
  vec3 c = uLips + uLipN * (0.3 + 1.5 * smoothstep(0.0, 0.12, life)) + vec3(0.0, life * uRise, 0.0)
    + vec3((aB.y - 0.5) * spread + sin(uTime * 1.6 + aB.x * 30.0) * wob, 0.0, (fract(aB.y * 7.31) - 0.5) * spread + cos(uTime * 1.3 + aB.x * 17.0) * wob);
  float size = (0.1 + 0.3 * aB.w * aB.w) * (0.6 + 1.1 * life) * on;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(c, 1.0); mvPosition.xy += position.xy * size;
  vUv = position.xy; vA = smoothstep(0.0, 0.03, life) * (1.0 - smoothstep(0.9, 1.0, life));
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,io=`
uniform vec3 uTint; varying vec2 vUv; varying float vA;
#include <fog_pars_fragment>
void main() {
  float r = length(vUv); if (r > 1.0) discard;
  float rim = smoothstep(0.5, 0.95, r) * (1.0 - smoothstep(0.95, 1.0, r)), spot = 1.0 - smoothstep(0.0, 0.22, length(vUv - vec2(-0.35, 0.4)));
  gl_FragColor = vec4(uTint * (0.12 + 1.3 * rim + 2.2 * spot) * vA, 1.0);
  #include <fog_fragment>
}`,lo=`
uniform float uTime; uniform vec3 uSunDir; uniform float uSurfaceY;
attribute vec4 aR; varying vec2 vUv; varying float vPh;
void main() {
  // position.x = -1..1 across, position.y = 0 (foot) .. 1 (surface); a cylindrical billboard slanted along the sun
  float y = mix(aR.y, uSurfaceY, position.y);
  vec3 c = vec3(aR.x, y, aR.z) + vec3(uSunDir.x, 0.0, uSunDir.z) / max(uSunDir.y, 0.3) * (y - aR.y);
  vec4 wc = modelMatrix * vec4(c, 1.0);
  vec3 toCam = cameraPosition - wc.xyz, right = normalize(cross(vec3(0.0, 1.0, 0.0), toCam) + vec3(1e-4, 0.0, 0.0));
  float wd = aR.w * (0.6 + 0.4 * position.y);
  wc.xyz += right * position.x * wd;
  vUv = position.xy; vPh = aR.w * 3.7 + aR.x;
  gl_Position = projectionMatrix * viewMatrix * wc;
}`,co=`
uniform float uTime; uniform vec3 uTint; uniform float uGain; varying vec2 vUv; varying float vPh;
void main() {
  float a = exp(-vUv.x * vUv.x * 3.5) * smoothstep(0.0, 0.3, vUv.y) * (0.25 + 0.75 * vUv.y) * (1.0 - smoothstep(0.93, 1.0, vUv.y));
  float fl = 0.55 + 0.45 * sin(uTime * 0.9 + vPh * 5.0) * sin(uTime * 0.53 + vPh * 2.3 + vUv.x * 2.0);
  gl_FragColor = vec4(uTint * a * fl * uGain, 1.0);
}`;async function mo(a,r={}){const o=a.rng,t=a.noise,s=(e,u,b)=>new m.Vector3(e,u,b),d=(r.palette&&r.palette.length>=7?r.palette:Wt).map(e=>new m.Color(e)),f=s(0,1,0),h=r.surfaceY??26,l=(r.sunDir?r.sunDir.clone():s(-.22,1,.3)).normalize(),y=[l.x,l.y,l.z],x=r.hollowEye??(o.chance(.7)?"lower":"upper"),i={c:[-50,4.2,0],roll:(r.roll??o.range(24,32))*Se,yaw:o.range(-4,4)*Se,sC:x==="lower"?1:-1,browA:3.6,browArch:o.range(.008,.02),bandGap:o.range(3.6,5.2),crestN:o.int(9,15),crestH:o.range(5,6.4),crestA:o.range(8.6,10.2),eyeA:.5,eyeB:4.3,eyeK:o.range(.07,.1)},R=r.gold??o.range(.42,.78),k=r.reef??o.range(.85,1.1),F=Ut(i),G=9*Se,U=s(-Math.cos(G),0,-Math.sin(G)),$=s().crossVectors(U,f),q=o.range(19,23)*Se,_=o.range(5,9)*Se,J=o.range(-3,5)*Se,I=U.clone().multiplyScalar(Math.cos(q)).addScaledVector($,Math.sin(q)).multiplyScalar(Math.cos(_)).addScaledVector(f,Math.sin(_)).normalize();let K=f.clone().addScaledVector(I,-f.dot(I)).normalize();K=K.clone().multiplyScalar(Math.cos(J)).addScaledVector(s().crossVectors(I,K),Math.sin(J)).normalize();const X=s().crossVectors(K,I).normalize(),W=s(-72,-3,13),ee={O:s(-103,6.3,16.5),F:I,S:X,N:K,A:U,surfaceY:h,elbow:W,curl:r.curl??o.range(.9,1.12),fingerLen:o.range(.96,1.04)},E=Dt(ee,o),p=Gt(),S=await bt(F.sdf,[i.c[0]-21,-1.6,i.c[2]-18.5],[i.c[0]+28,21.5,i.c[2]+18.5],r.headCell??.6,{yCut:-1,sun:y,yield:a.yield});await xt(p,S,F.mat,1,a.yield),await a.yield();const z=new m.Box3;for(const e of E.fingers)for(const u of e)z.expandByPoint(E.world(u[0],u[1],u[2]));for(const e of[-8.5,8])for(const u of[-7.5,7.5])for(const b of[-2.5,2])z.expandByPoint(E.world(e,u,b));z.expandByPoint(E.wristEnd).expandByScalar(3.4);const L=await bt(E.sdf,[z.min.x,z.min.y,z.min.z],[z.max.x,z.max.y,z.max.z],r.handCell??.55,{sun:y,yield:a.yield});await xt(p,L,E.mat,2,a.yield),await a.yield();const c=[],g=[],M=async(e,u)=>{const b=await Ot(p,t,e,u,a.yield);for(const A of b)c.push(A);for(let A=0;A<e.length-1;A++)for(let H=0;H<4;H++){const j=H/4;g.push([fe(e[A][0],e[A+1][0],j),fe(e[A][1],e[A+1][1],j),fe(e[A][2],e[A+1][2],j),Math.max(fe(e[A][3],e[A+1][3],j),fe(e[A][4],e[A+1][4],j))+u.bump])}},n=e=>o.range(-e,e),v=o.range(.94,1.06),C=[[38.5+n(1.5),2.6],[-30.5,1.5]],B=63+n(1.5),w=[B+5.2,91+n(.6)],P=[.2,1.1],V=.64,N=[96.6,1.7],O=e=>{let u=0;for(const b of C)u=Math.max(u,1-T(b[1]-.5,b[1]+.3,Math.abs(e-b[0])));return u},D=e=>{let u=0;for(const b of C)u=Math.max(u,1-T(.35,.75,Math.abs(Math.abs(e-b[0])-b[1]+.6)));return u},Z=e=>{let u=0;for(const b of C)u=Math.max(u,1-T(b[1]+1,b[1]+6,Math.abs(e-b[0])));return u},Q=(e,u,b)=>Math.min(e-w[0],w[1]-e,(u-P[0])*b,(P[1]-u*(1+.012*(e-w[0])))*b),Y=(e,u,b)=>T(-.2,.35,Q(e,u,b)),re=(e,u,b)=>{const A=Q(e,u,b);return T(-.2,.3,A)*Math.max(1-T(.7,1.2,A),1-T(.35,.8,Math.abs(u-V)*b))},ne=(e,u,b)=>Math.hypot(e-B,(u-V)*b),te=(e,u,b)=>1-T(2.9,3.5,ne(e,u,b)),ce=(e,u,b)=>{const A=ne(e,u,b);return Math.max(1-T(.4,.8,Math.abs(A-2.5)),1-T(.5,.9,A))},oe=e=>1-T(N[1]-.35,N[1]+.25,Math.abs(e-N[0])),Me=e=>oe(e)*(1-T(.35,.75,Math.abs(Math.abs(e-N[0])-N[1]+.8))),ze=e=>T(47,56,e)*T(106.5,103,e),xe=e=>Math.max(1-T(.03,.045,Math.abs(e-.44)),1-T(.018,.03,Math.abs(e-.8)));await M([[-41,.8,-3,2,2],[-35,.4,-2.6,9,8.5],[-27,0,-2,18.5*v,10],[-12,0,-1,17.5*v,11.5],[6+n(2),-1,0,12.5,9.5],[23+n(2),-1,0,16.5*v,11.5],[42,-.5,2,12.8,9],[53,2,3.6,11,8.3],[B,4.2,5+n(1.2),7.6,6.7],[72,4.5,4.2,9.6,7.3],[80,4.6,3,10,7.7],[89,4.5,2.1,7.8,5.9],[97,4.4,1.5,5.8,4.4],[103.5,4.5,1,8,4.8],[107,4.7,1,2.5,2]],{rings:196,segs:72,bump:1.5,bumpF:.075,sup:.86,bumpAt:e=>(1-.6*T(58,68,e))*(1-.8*Math.max(oe(e),O(e))),inset:(e,u,b,A,H)=>{const j=.24*H,se=ne(e,b,A);return ze(e)*(1.5*Math.exp(-(u*u)/(j*j))+.9*Math.exp(-(u*u)/.5))-Math.max(Y(e,b,A)*(.45+.3*(1-T(.2,1,Math.abs(b-V)*A))),se<3.5?.3+.75*Math.sqrt(1-se*se/12.25):0,.65*oe(e)*T(.6,1.4,Math.abs(u)),.5*O(e))},bronze:(e,u,b,A,H,j,se)=>Math.max(.12,Y(u,j,se),te(u,j,se),oe(u),O(u)),gold:(e,u,b,A,H,j,se)=>T(.4,1.6,b)*Math.max(.85*re(u,j,se),.85*te(u,j,se)*ce(u,j,se),.85*Me(u),O(u)*(.42+.43*D(u))),reef:(e,u,b,A,H,j,se,be)=>{const ke=T(1.5,6.5,A)*T(.8,3.5,b),ve=T(-.3,.2,t.n3(u*.028+11,b*.05,3.7)+.25*t.n3(u*.11,b*.11,A*.11)),qe=Math.max(ke*(.35+.65*ve),T(0,1,Z(u))*T(.3,2,b)*(.5+.5*ke),Y(u,se,be),te(u,se,be),oe(u));return(.74+.3*t.n3(u*.045,b*.045,A*.045))*k*(1-.72*qe)*(1-.35*T(66,80,u)*(1-.7*T(.3,.8,H)))}}),await a.yield(),await M([[-27,13,1,3.5,3.5],[-22,14.5,3.5,5.6,5.2],[-2+n(2),10.5,8.2,4.7,4.4],[9,4,12,3.8,3.6],[15,.6,13,3,3],[18,-1.5,13,1.2,1.2]],{rings:64,segs:18,bump:.6,bumpF:.14,sup:.8,bronze:.95,gold:e=>.85*xe(e),reef:(e,u,b,A)=>(.7+.2*Math.sin(e*9))*k*(1-.75*Math.max(xe(e),T(.2,.3,e)*T(.95,.85,e)*T(-.2,.25,t.n3(u*.09,b*.09+5,A*.09))))});const pe=E.wristStart.clone().lerp(E.wristEnd,.5),de=E.wristEnd.clone().lerp(W,.12);await M([[-28,-8,6,5.4,5.4],[-50,-6.2,8.5,5.4,5.4],[W.x+2,W.y-.4,W.z-.6,5.3,5.3],[W.x-4,W.y+.9,W.z+1.2,4.7,5],[de.x,de.y,de.z,3.45,3.7],[pe.x,pe.y,pe.z,2.8,2.85]],{rings:60,segs:22,bump:.3,bumpF:.2,sup:.84,bronze:1,reef:e=>fe(.85,.3,T(.55,1,e))*k}),await a.yield(),await M([[105,3.6,-9,2.5,2],[105.6,4.9,-5.5,8.9,4.4],[106.2,5.2,3,9.4,4.3],[106.8,5.1,11,8.9,3.7],[107.2,4.9,15.6,8.2,3.2],[107.3,4.9,17.2,7,2.5],[107.3,4.9,17.9,2.6,1.2]],{rings:32,segs:24,bump:.3,bumpF:.15,sup:.5,bronze:.12,up:s(0,1,0),reef:(e,u,b,A)=>(.16+.22*t.n3(u*.08,b*.08+3,A*.08)+.3*T(2.5,0,b))*k}),await a.yield();{let e=13.2;for(const[u,b]of[1.8,1.5,1.4,1.3,1.1].entries()){const A=e-b,H=4-u*.5;e-=2*b-.1,await M([[107.2,A,14.6,b*.9,b],[107.3,A,17.6,b,b*1.08],[107.4,A-.1,18.4+H,b*.92,b],[107.4,A-.25,19.5+H,b*.35,b*.4]],{rings:9,segs:12,bump:.1,bumpF:.3,sup:.72,bronze:.12,up:s(0,1,0),yCut:-.8,gold:j=>.85*T(.7,.78,j),reef:(j,se,be)=>(.1+.3*T(1.5,0,be))*k})}}for(const e of[-9,0,9])c.push({x:i.c[0]+e,z:i.c[2]-1.5,r:10.5,amp:.8});await a.yield();const ot=await It(p,a.yield);await a.yield();const Ge=new m.Color(r.sandColor??"#f4efe2").multiplyScalar(.8),zt=d[1].clone().lerp(d[0],.3).multiplyScalar(.36),ae={uTime:{value:0},uSunDir:{value:l},uSunCol:{value:new m.Color(1.22,1.16,.95)},uSkyCol:{value:zt},uBounceCol:{value:Ge.clone().multiplyScalar(.42)},uCaus:{value:s(1/8,1,.55)},uWater:{value:new m.Vector4(d[1].r*.55,d[1].g*.75,d[1].b*.8,r.waterDensity??0)}},Le=()=>m.UniformsUtils.clone(m.UniformsLib.fog),at=o.range(-.035,.035),Ie=new m.Color("#2f9e7a"),St=d[1].clone().lerp(Ie,.62).offsetHSL(at,0,0).multiplyScalar(.5),nt=new m.Color("#b59be8").lerp(d[5],.12),Ne=F.world(i.eyeA,-i.sC*i.eyeB,F.f0(i.eyeA,i.eyeB)),Ct=F.world(i.eyeA,i.sC*i.eyeB,F.f0(i.eyeA,i.eyeB)+.8),At=new m.ShaderMaterial({vertexShader:Yt,fragmentShader:eo,fog:!0,uniforms:{...Le(),...ae,uSeed:{value:s(o.range(0,90),o.range(0,90),o.range(0,90))},uStone:{value:d[4].clone().multiplyScalar(.9)},uBronze:{value:new m.Color(.2,.115,.045)},uVerd:{value:St},uVerdPale:{value:d[0].clone().lerp(d[1],.45).lerp(Ie,.25).offsetHSL(at,0,0).multiplyScalar(.5)},uGold:{value:d[6].clone().lerp(new m.Color(1,.42,.02),.4)},uReefA:{value:d[5].clone().multiplyScalar(.95)},uReefB:{value:nt.clone().multiplyScalar(.8)},uReefC:{value:d[6].clone().multiplyScalar(.85)},uReefRock:{value:d[4].clone().lerp(new m.Color("#9a9474"),.4).multiplyScalar(.86)},uGlowCol:{value:d[6].clone().lerp(d[0],.35)},uEye:{value:new m.Vector4(i.eyeA,i.sC*i.eyeB,i.eyeK,3)},uPalm:{value:s(.8,0,0)},uFace:{value:new m.Vector3(i.browA,R,i.browArch)}}}),he=new m.Group;he.name="sunken-colossus";const rt=new m.Mesh(ot,At);rt.name="colossus",he.add(rt);const Oe=r.sand===void 0?"full":r.sand,Re=jt(t,c,Oe);let Ce=null;if(Oe){Ce=await Ht(Re,[{x:i.c[0],z:i.c[2],r:32,sdf:F.sdf,k:3},{x:ee.O.x,z:ee.O.z,r:30,sdf:E.sdf,k:2.2}],y,Oe,r.sandRadius??1400,a.yield);const e=new m.Mesh(Ce,new m.ShaderMaterial({vertexShader:to,fragmentShader:oo,fog:!0,uniforms:{...Le(),...ae,uSand:{value:Ge}}}));e.name="sand",he.add(e)}await a.yield();const we=[];for(let e=0;e<p.n;e++){const u=p.mat[e*3+1],b=p.nor[e*3+1],A=p.pos[e*3+1],H=p.loc[e*4+3];A<.4||b<.05||u<.3||H===2&&p.loc[e*4]>-9.5||H===1&&p.lit[e*3+2]>.05||we.push({x:p.pos[e*3],y:A,z:p.pos[e*3+2],nx:p.nor[e*3],ny:b,nz:p.nor[e*3+2],w:(H>0?.3:1.7)*u*u*(H===0&&p.nor[e*3+2]>.3?1.8:1),part:H})}for(let e=0;e<520;e++){const u=c[o.int(0,c.length-1)],b=o.range(0,Math.PI*2),A=u.r+o.range(.5,7)*o(),H=u.x+Math.cos(b)*A,j=u.z+Math.sin(b)*A;F.sdf(H,1,j)<2.5||Math.hypot(H-ee.O.x,j-ee.O.z)<20||we.push({x:H,y:Re(H,j)-.05,z:j,nx:0,ny:1,nz:0,w:1.3,part:-1})}await a.yield();const je={...Le(),...ae,uGlow:{value:r.glow??2.6},uLace:{value:0}},Ft=new m.ShaderMaterial({vertexShader:wt,fragmentShader:Mt,fog:!0,side:m.DoubleSide,uniforms:je}),kt=new m.ShaderMaterial({vertexShader:wt,fragmentShader:Mt,fog:!0,side:m.DoubleSide,uniforms:{...je,uLace:{value:1}}}),Ae=d[5].clone().multiplyScalar(.7),He=d[6].clone().multiplyScalar(.62),st=d[4].clone().lerp(d[5],.25).multiplyScalar(.55),Ke=d[1].clone().lerp(Ie,.4).multiplyScalar(.5),Be=nt.clone().multiplyScalar(.6),qt=r.coralDensity??1,Xe=e=>e.part===0&&(e.x<-60||e.x>58&&e.y>6.5),Lt=e=>e.part===0&&e.x>-44&&e.x<-4&&e.y>8?7:Xe(e)?3:.25,Bt=[{geo:Xt(o,t),n:560,s:[.6,2.1],aff:e=>Xe(e)?.12:1,cols:[st,He,Be,Ke,st],upMix:.3,squash:[.55,1]},{geo:Zt(o),n:150,s:[.9,1.9],aff:e=>e.ny>.45?1:.12,cols:[Ae,Ke,Be],upMix:.75},{geo:$t(o),n:230,s:[.8,1.6],aff:e=>e.ny>.3?1:.3,cols:[Ae,He,Be,Ae],upMix:.5},{geo:Qt(o),n:240,s:[1,2.2],aff:e=>e.part===1||Xe(e)?3:e.y>9?1.6:.6,cols:[Be,Ae,He],upMix:.7,mat:kt},{geo:Jt(o),n:250,s:[.9,1.9],aff:Lt,cols:[Ae,Be,Ke,Ae],upMix:.45}],Pt=o.int(0,2),Vt=new m.Matrix4,it=new m.Quaternion,Nt=new m.Quaternion,Ze=s(),lt=s(),ct=s(),ut=new m.Color;let ft=0;for(const e of Bt){const u=Math.round(e.n*qt);if(u<1)continue;const b=new Float32Array(we.length);let A=0;for(let j=0;j<we.length;j++)A+=we[j].w*e.aff(we[j]),b[j]=A;const H=new m.InstancedMesh(e.geo,e.mat||Ft,u);H.name="coral";for(let j=0;j<u;j++){const se=o()*A;let be=0,ke=we.length-1;for(;be<ke;){const et=be+ke>>1;b[et]<se?be=et+1:ke=et}const ve=we[be],qe=o.range(e.s[0],e.s[1])*(ve.part===-1?.8:1)*(ve.part===1||ve.part===2?.7:1);Ze.set(ve.nx,ve.ny,ve.nz).lerp(f,e.upMix).normalize(),it.setFromUnitVectors(f,Ze).multiply(Nt.setFromAxisAngle(f,o.range(0,Math.PI*2))),lt.set(ve.x+o.range(-.8,.8),ve.y,ve.z+o.range(-.8,.8)).addScaledVector(Ze,-.1*qe),ct.set(qe,qe*(e.squash?o.range(e.squash[0],e.squash[1]):1),qe),H.setMatrixAt(j,Vt.compose(lt,it,ct)),ut.copy(o.chance(.4)?e.cols[Pt%e.cols.length]:o.pick(e.cols)).offsetHSL(o.range(-.025,.025),0,o.range(-.05,.05)),H.setColorAt(j,ut)}H.instanceMatrix.needsUpdate=!0,H.instanceColor.needsUpdate=!0,H.frustumCulled=!1,ft+=u*e.geo.index.count/3,he.add(H),await a.yield()}await a.yield();const le={},$e=F.dir(0,0,1).normalize(),Qe=F.world(-8.62,0,F.f0(-8.62,0)+.4);if(r.shoal!==!1){le.shoalU={...Le(),uTime:ae.uTime,uWater:ae.uWater,uSunCol:ae.uSunCol,uEyeC:{value:Ne},uEyeN:{value:$e},uEyeT1:{value:F.dir(1,0,0).normalize()},uEyeT2:{value:F.dir(0,1,0).normalize()},uBurst:{value:1}};const e=new m.Mesh(ro(r.fish??320,o),new m.ShaderMaterial({vertexShader:ao,fragmentShader:no,fog:!0,side:m.DoubleSide,uniforms:le.shoalU}));e.frustumCulled=!1,e.name="eye-shoal",he.add(e)}const dt=(e,u,b)=>{const A=new m.InstancedBufferGeometry;return A.setAttribute("position",new m.Float32BufferAttribute(u==="aR"?[-1,0,0,1,0,0,1,1,0,-1,1,0]:[-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),A.setIndex([0,1,2,0,2,3]),A.setAttribute(u,new m.InstancedBufferAttribute(b,4)),A.instanceCount=e,A};if(r.bubbles!==!1){const u=new Float32Array(520);for(let A=0;A<u.length;A++)u[A]=o();le.bubU={...Le(),uTime:ae.uTime,uLips:{value:Qe},uLipN:{value:$e},uRise:{value:h-Qe.y-.5},uExhale:{value:.5},uTint:{value:d[0].clone().multiplyScalar(1.5)}};const b=new m.Mesh(dt(130,"aB",u),new m.ShaderMaterial({vertexShader:so,fragmentShader:io,fog:!0,transparent:!0,depthWrite:!1,blending:m.AdditiveBlending,uniforms:le.bubU}));b.frustumCulled=!1,b.name="lip-bubbles",he.add(b)}if(r.rays!==!1){const u=new Float32Array(64);for(let A=0;A<16;A++){const H=A<9?E.world(o.range(4,15),o.range(-8,9),0):E.world(o.range(-16,4),o.range(-14,14),0);u[A*4]=H.x,u[A*4+1]=Math.max(0,Re(H.x,H.z)),u[A*4+2]=H.z,u[A*4+3]=o.range(1.2,3.4)}le.rayU={uTime:ae.uTime,uSunDir:ae.uSunDir,uSurfaceY:{value:h},uTint:{value:d[0].clone().lerp(new m.Color(1,1,.9),.3)},uGain:{value:.2}};const b=new m.Mesh(dt(16,"aR",u),new m.ShaderMaterial({vertexShader:lo,fragmentShader:co,transparent:!0,depthWrite:!1,blending:m.AdditiveBlending,side:m.DoubleSide,uniforms:le.rayU}));b.frustumCulled=!1,b.renderOrder=5,b.name="finger-rays",he.add(b)}const ye=E.world(.9,0,8.4),ht=ye.clone().addScaledVector(U,-62),Je=F.world(0,0,9.7),vt=$e.clone(),Te=[s(150,6,36),s(104,5.5,31),s(60,6.5,31),s(22,8,32),s(-14,9.5,31),s(-32,11.5,28.5),ht,ye.clone().addScaledVector(U,-30),ye.clone()],mt=(e,u,b)=>{let A=Math.min(F.sdf(e,u,b,!0),E.sdf(e,u,b,!0));for(let H=0;H<g.length;H++){const j=g[H],se=Math.hypot(e-j[0],u-j[1],b-j[2])-j[3];se<A&&(A=se)}return A};let Ye=1e9;const _e=s();for(let e=0;e<Te.length-1;e++)for(let u=0;u<=1;u+=.05)_e.lerpVectors(Te[e],Te[e+1],u),Ye=Math.min(Ye,mt(_e.x,_e.y,_e.z));const Rt={portalSeat:{position:ye.clone(),normal:U.clone().negate(),direction:U.clone(),radius:7},flyThrough:Te,straightStart:ht.clone(),approachDir:U.clone(),clearance:Ye,viewpoints:{entry:{position:s(150,6,36),target:s(40,8,4)},shoulder:{position:s(-2,9,36),target:s(-24,11,2)},face:{position:Je.clone().addScaledVector(vt,12).add(s(6,-2,14)),target:Je.clone()},eye:{position:Ne.clone().add(s(4,1,15)),target:Ne.clone()},elbow:{position:s(W.x+2,13.5,W.z+11),target:ye.clone()},approach:{position:ye.clone().addScaledVector(U,-42),target:ye.clone()},hero:{position:s(-84,10,46),target:s(-98,9,12)}},headCenter:s(i.c[0],i.c[1],i.c[2]),faceCenter:Je,faceNormal:vt,closedEye:Ct,eyeHollow:Ne.clone(),eyeHollowRadius:2.6,lips:Qe.clone(),crown:F.world(15,0,0),shoulderTop:s(-26,18.5,-1),foldedElbow:s(-2,12,9),elbow:W.clone(),wrist:E.wristStart.clone(),palmCenter:E.world(.8,0,.5),palmNormal:K.clone(),fingerDir:I.clone(),thumbDir:X.clone(),fingertips:E.tips.slice(0,4).map(e=>e.clone()),thumbTip:E.tips[4].clone(),feet:s(106,7,6),surfaceY:h};let Fe=null;if(r.preview===!0){const e=new m.Mesh(new m.TorusGeometry(7,.2,8,72),new m.MeshBasicMaterial({color:new m.Color(1.6,3.4,3.2),fog:!1})),u=new m.Mesh(new m.CircleGeometry(6.9,48),new m.MeshBasicMaterial({color:new m.Color(.25,.5,.75),transparent:!0,opacity:.55,depthWrite:!1,side:m.DoubleSide,fog:!1}));for(const b of[e,u])b.position.copy(ye),b.lookAt(ye.clone().addScaledVector(U,-1)),he.add(b);ae.uWater.value.w=r.waterDensity??.003,Fe=new m.Mesh(new m.SphereGeometry(2400,24,12),new m.ShaderMaterial({side:m.BackSide,depthWrite:!1,fog:!1,uniforms:{uWater:ae.uWater},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform vec4 uWater; varying vec3 vD; void main(){ float h = normalize(vD).y; vec3 c = mix(uWater.rgb, vec3(0.75, 1.25, 1.2), smoothstep(0.25, 1.0, h)); c = mix(c, uWater.rgb * vec3(0.35, 0.6, 1.0), smoothstep(0.02, -0.5, h)); gl_FragColor = vec4(c, 1.0); }"})),Fe.renderOrder=-.5,Fe.frustumCulled=!1,he.add(Fe)}const Pe=r.faceU??.4;let We=-1;const pt=(e,u)=>{We=ue(e,0,1),le.shoalU&&(le.shoalU.uBurst.value=.5+.8*yt(We,Pe-.16,Pe+.18,.45)),le.bubU&&(le.bubU.uExhale.value=yt(We,Pe-.14,Pe+.12,.35)),le.rayU&&(le.rayU.uGain.value=(r.rayGain??.2)*(.7+.9*gt(.6,.92,We))*(u===void 0?1:gt(.55,.75,u)))};pt(r.progress??Pe);const Tt=(e={})=>{e.sunDir&&ae.uSunDir.value.copy(e.sunDir).normalize(),e.sunColor&&ae.uSunCol.value.copy(e.sunColor),e.skyColor&&ae.uSkyCol.value.copy(e.skyColor),e.bounceColor&&ae.uBounceCol.value.copy(e.bounceColor),e.causticScale!=null&&(ae.uCaus.value.x=1/e.causticScale),e.causticStrength!=null&&(ae.uCaus.value.y=e.causticStrength),e.causticSpeed!=null&&(ae.uCaus.value.z=e.causticSpeed),e.waterColor&&(ae.uWater.value.x=e.waterColor.r,ae.uWater.value.y=e.waterColor.g,ae.uWater.value.z=e.waterColor.b),e.waterDensity!=null&&(ae.uWater.value.w=e.waterDensity),e.glow!=null&&(je.uGlow.value=e.glow),e.surfaceY!=null&&le.rayU&&(le.rayU.uSurfaceY.value=e.surfaceY)},_t=s(-62,13,8);return{object:he,radius:62,height:26,center:_t,anchors:Rt,ground:!1,groundY:0,length:228,bounds:new m.Box3(s(-119,-1,-22),s(110,20.5,28)),uniforms:ae,setProgress:pt,setLight:Tt,distance:mt,sandHeightAt:(e,u)=>Re(e,u),sandColor:Ge,sandRect:[-132,-48,129,57],shadeSand(e){if(!Ce)return;const u=Ce.attributes.position.array,b=Ce.attributes.aLit.array;for(let A=0,H=u.length/3;A<H;A++){const j=e(u[A*3],u[A*3+2]);j<1&&(b[A*2]*=.5+.5*j,b[A*2+1]*=j)}Ce.attributes.aLit.needsUpdate=!0},seedInfo:{hollowEye:x,roll:i.roll/Se,gold:R,curl:ee.curl},triangles:Math.round(ot.index.count/3+ft),update(e,u,b){ae.uTime.value=u,Fe&&b&&Fe.position.copy(b.position).applyMatrix4(uo.copy(he.matrixWorld).invert())},dispose(){}}}const uo=new m.Matrix4;export{vo as COLOSSUS_GLSL,mo as buildHero};
