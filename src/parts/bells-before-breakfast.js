import*as f from"three";import{makeSky as ss}from"../kit/sky.js";import*as me from"../kit/flora.js";import*as $t from"../kit/fauna.js";import*as te from"../kit/fx.js";import*as ns from"../kit/water.js";const rs=[[-83.3,26,164.2],[-48.9,26,115],[-31.7,26,90.5],[-14.5,26,65.9],[-8.3,21.9,55.4],[-3.7,17.7,44.1],[-.9,13.6,32.2],[0,9.4,20],[0,9.3,2],[0,9.6,-11],[0,10,-30]],Aa=[-48.9,26,115],B=33,lt=2.4,Ee=-.9,Ge=48,We=-88,He=14,pe=2.5,X=2,Y=11,ct=-44,xt=Ge+pe-He,Qe=Ge+pe,_e={hx:13,z0:-6,z1:-32,y1:46,y2:58},is=[14.3,23.9],qe=43,ls=50,cs=5,Zt=62,bt=66,ht=74,Re={a:4.5,a0:5.2,ys:11.5},Sa=96,hs=2,ye={x:150,z:115,rx:82,rz:106},Jt=[45,64],et=[-1,.25],De=[[.55,2.45],[5.2,13.2],[15.6,22.6],[25.2,31]],he=(e,q=1)=>{const I=new f.Color(e);return[I.r*q,I.g*q,I.b*q]},Pe=e=>"#"+e.getHexString();function us(){const e=[],q=[],I=[],F=[],N=[];let k=[1,1,1],w=0,s=50,x=50,S=100;const y={count:0,set(d,m="#ffffff",i=1){return w=d,k=he(m,i),y},tint(d){return k=[k[0]*d,k[1]*d,k[2]*d],y},uv(d,m,i){return s=d,x=m,S=i,y},tri(d,m,i,v,z,b){const M=m[0]-d[0],W=m[1]-d[1],L=m[2]-d[2],G=i[0]-d[0],O=i[1]-d[1],o=i[2]-d[2];let r=W*o-L*O,p=L*G-M*o,n=M*O-W*G;const u=Math.hypot(r,p,n)||1;r/=u,p/=u,n/=u;let l=m,g=i;v!==void 0&&r*v+p*z+n*b<0&&(l=i,g=m,r=-r,p=-p,n=-n),e.push(d[0],d[1],d[2],l[0],l[1],l[2],g[0],g[1],g[2]);for(let R=0;R<3;R++)q.push(r,p,n),I.push(k[0],k[1],k[2]),F.push(w);N.push(s,S,x,S,x,S),y.count++},quad(d,m,i,v,z,b,M){y.tri(d,m,i,z,b,M),y.tri(d,i,v,z,b,M)},wall(d,m,i,v,z,b,M=!0){const W=Math.hypot(i-d,v-m),L=(i-d)/W,G=(v-m)/W,O=-G,o=L,r=e.length/3;e.push(d,z,m,i,z,v,i,b,v,d,z,m,i,b,v,d,b,m);for(let p=0;p<6;p++)q.push(O,0,o),I.push(k[0],k[1],k[2]),F.push(w);if(M)N.push(0,W,W,W,W,W,0,W,W,W,0,W);else for(let p=0;p<6;p++)N.push(w===7?z:50,w===7?b:100);return y.count+=2,r},box(d,m,i,v,z,b,M="xXyYzZ"){M.includes("X")&&y.quad([v,m,b],[v,m,i],[v,z,i],[v,z,b],1,0,0),M.includes("x")&&y.quad([d,m,i],[d,m,b],[d,z,b],[d,z,i],-1,0,0),M.includes("Y")&&y.quad([d,z,b],[v,z,b],[v,z,i],[d,z,i],0,1,0),M.includes("y")&&y.quad([d,m,i],[v,m,i],[v,m,b],[d,m,b],0,-1,0),M.includes("Z")&&y.quad([d,m,b],[v,m,b],[v,z,b],[d,z,b],0,0,1),M.includes("z")&&y.quad([v,m,i],[d,m,i],[d,z,i],[v,z,i],0,0,-1)},shaft(d,m,i,v,z,b,M=8,W=0,L=0,G=!0){for(let O=0;O<M;O++){const o=O/M*6.2832,r=(O+1)/M*6.2832,p=(o+r)/2,n=[d+Math.cos(o+W)*z,i,m+Math.sin(o+W)*z],u=[d+Math.cos(r+W)*z,i,m+Math.sin(r+W)*z],l=[d+Math.cos(o+L)*b,v,m+Math.sin(o+L)*b],g=[d+Math.cos(r+L)*b,v,m+Math.sin(r+L)*b];y.quad(n,u,g,l,Math.cos(p+(W+L)/2),0,Math.sin(p+(W+L)/2)),G&&y.tri([d,v,m],l,g,0,1,0)}},cone(d,m,i,v,z,b=4,M=0){for(let W=0;W<b;W++){const L=W/b*6.2832+M,G=(W+1)/b*6.2832+M,O=(L+G)/2;y.tri([d+Math.cos(L)*z,i,m+Math.sin(L)*z],[d+Math.cos(G)*z,i,m+Math.sin(G)*z],[d,v,m],Math.cos(O),v>i?.3:-.3,Math.sin(O))}},halfShaft(d,m,i,v,z,b,M){const W=Math.atan2(M,b),L=k;for(let G=-2;G<=2;G++){const O=W+(G-.5)*.7854,o=W+(G+.5)*.7854,r=W+G*.7854,p=[d+Math.cos(O)*z,i,m+Math.sin(O)*z],n=[d+Math.cos(o)*z,i,m+Math.sin(o)*z],u=G===0?1.08:Math.abs(G)===1?.96:.82;k=[L[0]*u,L[1]*u,L[2]*u],y.quad(p,n,[n[0],v,n[2]],[p[0],v,p[2]],Math.cos(r),0,Math.sin(r))}k=L},build(){const d=new f.BufferGeometry;return d.setAttribute("position",new f.Float32BufferAttribute(e,3)),d.setAttribute("normal",new f.Float32BufferAttribute(q,3)),d.setAttribute("aCol",new f.Float32BufferAttribute(I,3)),d.setAttribute("aMat",new f.Float32BufferAttribute(F,1)),d.setAttribute("aUL",new f.Float32BufferAttribute(N,2)),d}};return y}const de="#d8c49c",Mt="#b8ac94",To="#9aa6b4",Es="#8a5a34",La="#2a2a2e",be=0,fs=1,ds=2,Eo=3,Ps=4,Po=5,Fa=6,ms=7,za=8;function ps(e,q,I,F,N){const k=Re.a0,w=Re.a,s=Re.ys,x=F-.6,S=14,y=s+k;e.set(be,de),e.wall(q,F,-k,F,0,N,!1),e.wall(k,F,I,F,0,N,!1),e.wall(-k,F,k,F,y,N,!1);const d=(m,i)=>[m*Math.cos(i),s+m*Math.sin(i)];for(let m=0;m<S;m++){const i=Math.PI*(1-m/S),v=Math.PI*(1-(m+1)/S),z=(i+v)/2,b=-Math.cos(z),M=-Math.sin(z),W=d(k,i),L=d(k,v),G=d(w,i),O=d(w,v),o=d(k+.55,i),r=d(k+.55,v);e.set(be,de).quad([W[0],W[1],F],[L[0],L[1],F],[L[0],y,F],[W[0],y,F],0,0,1),e.set(be,de,.94).quad([W[0],W[1],F],[L[0],L[1],F],[L[0],L[1],x],[W[0],W[1],x],b,M,0),e.set(be,de,1.02).quad([G[0],G[1],x],[O[0],O[1],x],[L[0],L[1],x],[W[0],W[1],x],0,0,1),e.set(be,de,.92).quad([G[0],G[1],x],[O[0],O[1],x],[O[0],O[1],0],[G[0],G[1],0],b,M,0),e.set(be,de,1.1).quad([W[0],W[1],F+.22],[L[0],L[1],F+.22],[r[0],r[1],F+.22],[o[0],o[1],F+.22],0,0,1),e.quad([o[0],o[1],F+.22],[r[0],r[1],F+.22],[r[0],r[1],F],[o[0],o[1],F],-b,-M,0),e.set(be,de,.9).quad([W[0],W[1],F+.22],[L[0],L[1],F+.22],[L[0],L[1],F],[W[0],W[1],F],b,M,0)}for(const m of[-1,1])e.set(be,de,.94).quad([m*k,0,F],[m*k,s,F],[m*k,s,x],[m*k,0,x],-m,0,0),e.set(be,de,1.02).quad([m*w,0,x],[m*k,0,x],[m*k,s,x],[m*w,s,x],0,0,1),e.set(be,de,.92).quad([m*w,0,x],[m*w,s,x],[m*w,s,0],[m*w,0,0],-m,0,0),e.set(be,de,1.1).box(m>0?k:-k-.8,s-.6,F,m>0?k+.8:-k,s,F+.3,"xXZyY")}function vs(e,q,I,F,N){const k=N-F;e.set(be,de,1.05).shaft(q,I,F,F+.4,.7,.7,4,.785,.785),e.set(be,de,1).shaft(q,I,F+.4,F+k*.54,.4,.35,6,0,0,!1),e.set(be,de,1.03).cone(q,I,F+k*.54,N-.66,.52,4,.785),e.set(be,de,1.08).cone(q,I,N-.4,N-.82,.4,4,0),e.cone(q,I,N-.4,N,.4,4,0)}function ws(e,q){const I=[],F=[],N=[];let k=0;const w=(o=1)=>e.set(be,de,o),s=[],x=(o,r,p,n,u,l)=>{e.wall(o,r,p,n,u,l,!1),s.push([o,r,p,n,u,l])},S=(o,r=3)=>o===0?0:r*10+(o===3?2:3),y=(o,r,p,n,u,l={})=>{const g=Math.hypot(p-o,n-r),R=(p-o)/g,A=(n-r)/g,D=k,C=g/u;w(),x(o,r,p,n,0,B),k+=g,N.push([o,r,p,n,B,u]);for(let T=0;T<u;T++){const $=(T+.5)*C,H=Math.min(C*.68,4.6);if(!l.plain)for(let K=0;K<4;K++){const se=K===0?H*1.1:H;q.push({x:o+R*($-se/2),z:r+A*($-se/2),tx:R,tz:A,w:se,y0:De[K][0],y1:De[K][1],st:K,s:D+$,make:S(K)})}T<u-1&&F.push([o+R*(T+1)*C,r+A*(T+1)*C,-A,R,l.plain?0:1])}l.plain||I.push({s0:D+C*.5,s1:D+g-C*.5,walked:l.walked??1})},d=(o,r)=>{const p=o*Ge,n=o*(Ge+X),u=pe-He,l=ct+Y,g=ct-Y,R=We+He-pe,A=o>0?[[u,l],[l,g],[g,R]]:[[R,g],[g,l],[l,u]];y(p,A[0][0],p,A[0][1],3,{walked:r}),w(.97),x(p,A[1][0],n,A[1][0],0,B),N.push([p,A[1][0],n,A[1][0],B]),F.push([n,A[1][0],0,0,2]),y(n,A[1][0],n,A[1][1],3,{walked:r}),F.push([n,A[1][1],0,0,2]),w(.97),x(n,A[1][1],p,A[1][1],0,B),N.push([n,A[1][1],p,A[1][1],B]),y(p,A[2][0],p,A[2][1],3,{walked:r})};d(-1,1),y(-xt,0,-Y,0,4);const m=k;k+=2*Y,w(.97),x(-Y,0,-Y,X,0,B),x(Y,X,Y,0,0,B),ps(e,-Y,Y,X,B),N.push([-Y,0,-Y,X,B],[-Y,X,Y,X,B],[Y,X,Y,0,B]);for(const o of[-1,1]){F.push([o*Y,X,0,0,2],[o*6.4,X,0,1,1]);for(let r=0;r<4;r++)q.push({x:o*8.7-1.45,z:X,tx:1,tz:0,w:2.9,y0:De[r][0],y1:De[r][1],st:r,s:m+Y+o*8.7,make:S(r,2)})}q.push({x:-4.5,z:X,tx:1,tz:0,w:9,y0:19.1,y1:De[2][1],st:2,s:m+Y,make:51,over:1}),q.push({x:-4.5,z:X,tx:1,tz:0,w:9,y0:De[3][0],y1:De[3][1],st:3,s:m+Y,make:52}),I.push({s0:m+2.3,s1:m+2*Y-2.3,walked:1}),w(1.08),e.box(-2.7,17.4,X,2.7,18.8,X+.1,"xXZyY"),e.set(ds,de,1.04).quad([-2.5,17.55,X+.13],[2.5,17.55,X+.13],[2.5,18.65,X+.13],[-2.5,18.65,X+.13],0,0,1),y(Y,0,xt,0,4),d(1,0),y(xt,We,-xt,We,10,{plain:1});for(const o of[-1,1])for(const r of[1,-1]){const p=o*Qe,n=o*xt,u=r>0?pe:We-pe,l=r>0?pe-He:We-pe+He,g=Math.min(n,p),R=Math.max(n,p),A=Math.min(l,u),D=Math.max(l,u);for(const[C,T,$,H,K]of[[g,D,R,D,r>0],[R,D,R,A,o>0],[R,A,g,A,r<0],[g,A,g,D,o<0]]){const se=($-C)/He,ie=(H-T)/He,re=He/2;if(w(),K?x(C,T,$,H,0,qe):(x(C,T,$,H,B,qe),(se!==0?C===p:T===u)?x(C,T,C+se*pe,T+ie*pe,0,B):x($-se*pe,H-ie*pe,$,H,0,B)),K)for(let ae=0;ae<4;ae++){const le=ae===0?5:4.6;q.push({x:C+se*(re-le/2),z:T+ie*(re-le/2),tx:se,tz:ie,w:le,y0:De[ae][0],y1:De[ae][1],st:ae,s:-1,make:S(ae)})}q.push({x:C+se*(re-2.2),z:T+ie*(re-2.2),tx:se,tz:ie,w:4.4,y0:36.6,y1:41.6,st:3,s:-1,make:121,dark:1}),N.push([C,T,$,H,qe])}e.set(Eo,To).quad([g,qe,D],[R,qe,D],[R,qe,A],[g,qe,A],0,1,0);for(const C of[n,p])for(const T of[l,u])F.push([C,T,0,0,C===n&&T===l?4:3])}const i=_e,v=[];for(const[o,r,p,n]of[[-i.hx,i.z0,i.hx,i.z0],[i.hx,i.z0,i.hx,i.z1],[i.hx,i.z1,-i.hx,i.z1],[-i.hx,i.z1,-i.hx,i.z0]]){const u=(p-o)/(2*i.hx),l=(n-r)/(2*i.hx);w(),x(o,r,p,n,B,i.y1),x(o,r,p,n,i.y1,i.y2);for(const[g,R,A]of[[36.4,44.2,23],[48.4,56.4,223]])for(const D of[6.2,13,19.8])q.push({x:o+u*(D-1.4),z:r+l*(D-1.4),tx:u,tz:l,w:2.8,y0:g,y1:R,st:3,s:-1,make:A,dark:1});N.push([o+u*2.3,r+l*2.3,p-u*2.3,n-l*2.3,i.y2])}e.set(Eo,To).quad([-i.hx,i.y2,i.z0],[i.hx,i.y2,i.z0],[i.hx,i.y2,i.z1],[-i.hx,i.y2,i.z1],0,1,0);for(const o of[-i.hx,i.hx])for(const r of[i.z0,i.z1]){w(1.02),e.shaft(o,r,B,Zt,2.3,2.3,8,.3927,.3927,!0),w(1.08);for(const p of[i.y1,i.y2])e.shaft(o,r,p-.3,p+.3,2.55,2.55,8,.3927,.3927,!0);w(),e.cone(o,r,Zt,bt-.7,1.5,8,.3927),w(1.08),e.cone(o,r,bt-.45,bt-.9,.45,4,0),e.cone(o,r,bt-.45,bt,.45,4,0),v.push([o,r])}e.set(Eo,To).quad([-Ge,B,0],[Ge,B,0],[Ge,B,We],[-Ge,B,We],0,1,0),e.quad([-Y,B,X],[Y,B,X],[Y,B,0],[-Y,B,0],0,1,0);for(const o of[-1,1])e.quad([o*Ge,B,ct+Y],[o*(Ge+X),B,ct+Y],[o*(Ge+X),B,ct-Y],[o*Ge,B,ct-Y],0,1,0);for(const[o,r,p,n,u]of F){const l=(u>=3?qe:B)+lt;w(1.03),u===0?e.halfShaft(o,r,B,l,.45,p,n):u===1?e.halfShaft(o,r,0,l,.45,p,n):e.shaft(o,r,u===4?B:0,l,u===2?.5:.55,u===2?.5:.55,8,.3927,.3927,!1),vs(e,o,r,l,u>=3?ls:l+cs)}const z=[],b=B+lt+5;for(const[o,r]of[[-34,-26],[-34,-50],[-12,-58],[12,-58],[34,-26],[34,-50]])w(.98),e.box(o-1.5,B,r-1,o+1.5,b-.5,r+1,"xXzZ"),w(1.07),e.box(o-1.75,b-.5,r-1.25,o+1.75,b,r+1.25,"xXzZYy"),z.push({x:o,z:r,top:[o,b,r]});const M=[0,(i.z0+i.z1)/2];e.set(Po,"#cfc8b8").shaft(M[0],M[1],i.y2,ht,.26,.18,6,0,0,!1),e.cone(M[0],M[1],ht+.05,ht-.3,.3,4),e.cone(M[0],M[1],ht+.05,ht+.4,.3,4);const W=(o,r,p,n,u,l,g)=>{const R=Math.hypot(p-o,n-r),A=-(n-r)/R,D=(p-o)/R,C=A*g,T=D*g;w(1.06),e.quad([o+C,u,r+T],[p+C,u,n+T],[p+C,l,n+T],[o+C,l,r+T],A,0,D),w(1.12),e.quad([o,l,r],[p,l,n],[p+C,l,n+T],[o+C,l,r+T],0,1,0),w(.86),e.quad([o,u,r],[p,u,n],[p+C,u,n+T],[o+C,u,r+T],0,-1,0)};s.push([-Y,X,-6.4,X,0,B],[6.4,X,Y,X,0,B],[-6.4,X,6.4,X,17.4,B]);for(const[o,r,p,n,u,l]of s){W(o,r,p,n,l-.6,l,.35);for(const g of is)u<g-.3&&l>g+.3&&W(o,r,p,n,g-.3,g+.3,.3);u<B&&l>B+1&&W(o,r,p,n,B-.6,B,.35),l===qe&&W(o,r,p,n,B+lt-.4,B+lt+.1,.25)}for(const o of q)o.tx!==1||o.st<1||o.dark||(w(1.08),e.box(o.x-.16,o.y0-.28,o.z,o.x+o.w+.16,o.y0+.02,o.z+.36,"xXZyY"),w(1.04),e.box(o.x-.24,o.y1+.02,o.z,o.x+o.w+.24,o.y1+.2,o.z+.26,"xXZyY"));const L=15,G=o=>L+Math.sqrt(Math.max(1-o*o/25,0)),O=(o,r=0)=>[(5-2*r)*Math.cos(o),L+(1-r)*Math.sin(o)];for(const o of[-1,1]){w(.95),e.quad([o*5,3,0],[o*5,L,0],[o*5,L,-10],[o*5,3,-10],-o,0,0),w(1.04),e.box(o>0?4.8:-5,L-.4,-10,o>0?5:-4.8,L,0,o>0?"xy":"Xy"),w(.95),e.quad([o*4.2,3,-10],[o*5,3,-10],[o*5,L,-10],[o*4.2,L,-10],0,0,1);for(const[r,p]of[[5,4.8],[4.8,4.5],[4.5,4.2]])e.tri([o*4.2,L,-10],[o*r,G(r),-10],[o*p,G(p),-10],0,0,1)}for(let o=0,r=12;o<r;o++){const p=Math.PI*(o/r),n=Math.PI*((o+1)/r),u=(p+n)/2,l=O(p),g=O(n),R=O(p,.15),A=O(n,.15);w(.9+.04*(o%2)),e.quad([l[0],l[1],0],[g[0],g[1],0],[g[0],g[1],-10],[l[0],l[1],-10],-Math.cos(u),-Math.sin(u),0);for(const T of[-3.4,-6.8])w(1.04),e.quad([R[0],R[1],T+.3],[A[0],A[1],T+.3],[A[0],A[1],T-.3],[R[0],R[1],T-.3],-Math.cos(u),-Math.sin(u),0),w(.86),e.quad([R[0],R[1],T+.3],[A[0],A[1],T+.3],[g[0],g[1],T+.3],[l[0],l[1],T+.3],0,0,1);const D=4.2*Math.cos(p),C=4.2*Math.cos(n);w(.95),e.tri([0,15,-10],[D,G(D),-10],[C,G(C),-10],0,0,1)}for(const o of[-1,1])e.tri([0,15,-10],[o*4.2,15,-10],[o*4.2,G(4.2),-10],0,0,1);for(const[o,r]of[[-3.8,-1.4],[-1.2,1.2],[1.4,3.8]])w(1.05),e.box(o,14.95,-12.1,r,15,-10.4,"yxXzZ");w(.95),e.quad([-4.2,3,-10],[-4.2,3,-12.5],[-4.2,15,-12.5],[-4.2,15,-10],1,0,0),e.quad([4.2,3,-10],[4.2,3,-12.5],[4.2,15,-12.5],[4.2,15,-10],-1,0,0),e.quad([-4.2,15,-10],[4.2,15,-10],[4.2,15,-12.5],[-4.2,15,-12.5],0,-1,0),e.quad([-Re.a0,3,1],[Re.a0,3,1],[Re.a0,3,-12.5],[-Re.a0,3,-12.5],0,1,0);for(let o=0;o<6;o++){const r=8-o*1.1666666666666667,p=8-(o+1)*(7/6);w(.9+.03*(o%2)),e.box(-Re.a0,0,p,Re.a0,.5*(o+1),r,"YZ")}for(const o of[-1,1]){const r=o>0?Re.a0:-Re.a0-1.1,p=r+1.1;w(.98),e.box(r,0,X,p,3.5,5.3,"xXZY"),e.box(r,0,5.3,p,1.9,8.6,"xXZY");for(const[R,A]of[[3.5,6.9],[7.3,10.7],[11.1,14.5]])w(1.05),e.box(o>0?4.15:-4.2,R,-12.1,o>0?4.2:-4.15,A,-10.4,o>0?"xzZyY":"XzZyY");const n=o*7.5,u=10;w(.95),e.box(n-.55,0,u-.55,n+.55,1,u+.55,"xXzZY"),e.set(Po,La).shaft(n,u,1,5.3,.24,.15,6),e.box(n-.5,5.2,u-.5,n+.5,5.32,u+.5),e.shaft(n,u,6.5,7.3,.7,.05,4,.785,.785),e.shaft(n,u,7.3,7.7,.1,.1,4),e.set(za,"#ffab58").uv(n,n,5.75).box(n-.42,5.3,u-.42,n+.42,6.5,u+.42,"zZ"),e.uv(u,u,5.75).box(n-.42,5.3,u-.42,n+.42,6.5,u+.42,"xX");const l=o*4.55,g=-3;e.set(Po,La).uv(50,50,100).box(Math.min(l,o*5),12.5,g-.07,Math.max(l,o*5),12.64,g+.07),e.box(l-.05,12,g-.05,l+.05,12.5,g+.05,"xXzZ"),e.cone(l,g,11.6,12.05,.36,4,.785),e.box(l-.27,10.55,g-.27,l+.27,10.62,g+.27),e.set(za,"#ffab58").uv(l,l,11.05).box(l-.25,10.62,g-.25,l+.25,11.6,g+.25,"zZ"),e.uv(g,g,11.05).box(l-.25,10.62,g-.25,l+.25,11.6,g+.25,"xX"),e.uv(50,50,100)}return{ranks:I,stacks:z,par:N,crowns:v,staff:M}}function gs(e,q){const I=(s,x,S,y)=>{e.shaft(s,x,S,S+y*.6,y*.5,y,6,0,0,!1),e.shaft(s,x,S+y*.6,S+y*1.4,y,y,6,0,0,!1),e.shaft(s,x,S+y*1.4,S+y*2,y,y*.45,6,0,0,!0)},F=[[-48,46,-12,46],[12,46,48,46],[-48,3.1,-48,46],[48,46,48,3.1]];for(const[s,x,S,y]of F){const d=Math.min(s,S)-.28,m=Math.max(s,S)+.28,i=Math.min(x,y)-.28,v=Math.max(x,y)+.28;e.set(ms,Mt,.95).uv(0,0,1.25).box(d,0,i,m,1.25,v,"xXzZY"),e.uv(50,50,100);const z=Math.hypot(S-s,y-x),b=Math.round(z/8);for(let M=0;M<=b;M++){const W=s+(S-s)*(M/b),L=x+(y-x)*(M/b);e.set(fs,Mt).box(W-.5,0,L-.5,W+.5,1.6,L+.5,"xXzZY"),I(W,L,1.6,.55)}}const N=(s,x,S,y,d=.85,m=.8)=>{const i=S-s,v=y-x,z=Math.hypot(i,v)||1,b=-v/z*d/2,M=i/z*d/2;e.quad([s-b,m,x-M],[S-b,m,y-M],[S+b,m,y+M],[s+b,m,x+M],0,1,0),e.quad([s+b,0,x+M],[S+b,0,y+M],[S+b,m,y+M],[s+b,m,x+M],b,0,M),e.quad([s-b,0,x-M],[S-b,0,y-M],[S-b,m,y-M],[s-b,m,x-M],-b,0,-M)},k=(s,x,S,y=20,d=.8)=>{for(let m=0;m<y;m++){const i=m/y*6.2832,v=(m+1)/y*6.2832;N(s+Math.cos(i)*S,x+Math.sin(i)*S,s+Math.cos(v)*S,x+Math.sin(v)*S,.85,d)}},w=(s,x,S,y=.8)=>{for(let d=0;d<S.length;d++){const m=S[d],i=S[(d+1)%S.length];N(s+m[0],x+m[1],s+i[0],x+i[1],.85,y)}};for(const s of[-1,1])for(const x of[18,36])for(const S of[15,33]){const y=s*x,d=S,m=q.int(0,2),i=q.range(.85,1.1);if(e.set(Fa,"#3f6048",i*2.4),w(y,d,[[-7.4,-7.4],[7.4,-7.4],[7.4,7.4],[-7.4,7.4]]),m===0)k(y,d,5),w(y,d,[[0,-6.9],[6.9,0],[0,6.9],[-6.9,0]],.9),k(y,d,1.9,12);else if(m===1){for(const[v,z]of[[-2.9,-2.9],[2.9,-2.9],[2.9,2.9],[-2.9,2.9]])k(y+v,d+z,3.6,16,.8+.1*(v*z>0?1:0));k(y,d,1.6,10)}else w(y,d,[[-5,-5],[5,-5],[5,5],[-5,5]],.9),w(y,d,[[0,-7],[3,-3],[7,0],[3,3],[0,7],[-3,3],[-7,0],[-3,-3]]),k(y,d,2.2,12);e.set(Fa,"#3f6048",i*2.8);for(const[v,z]of[[-7.4,-7.4],[7.4,-7.4],[7.4,7.4],[-7.4,7.4],[0,0]])I(y+v,d+z,0,v===0?.95:.8)}}const Ca=[[5.4,21.5,7.5,5.6,6,1.4],[9.6,22,7.5,6,7,.9],[13.8,20,7,5.8,7,.6],[18,17.5,6.5,5.4,6,.4],[22.2,14.5,5.8,5,6,.3],[26.2,11.5,5,4.6,5,.2],[29.8,8.5,4.2,4.2,4,.1],[32.5,6.5,6.5,6,1,0]],Ga=22;function ys(e){const q=[],I=[],F=[],N=[],k=[],w=[],s=(n,u,l,g,R,A,D=.875,C=.75)=>(q.push(n[0],n[1],n[2]),I.push(u[0],u[1],u[2]),F.push(l[0],l[1],l[2]),N.push(g,R,A,0),k.push(D,C),q.length/3-1),x=(n,u,l)=>[n[0]+(u[0]-n[0])*l,n[1]+(u[1]-n[1])*l,n[2]+(u[2]-n[2])*l],S=(n,u)=>[n[0]*u,n[1]*u,n[2]*u],y=he("#4a4038"),d=he("#5e5448"),m=he("#12261f"),i=he("#1d3b33"),v=he("#2e5849"),z=(n,u,l,g,R)=>{const A=q.length/3,D=n.length;for(let C=0;C<D;C++){const T=n[Math.max(0,C-1)],$=n[Math.min(D-1,C+1)];let H=$[0]-T[0],K=$[1]-T[1],se=$[2]-T[2];const ie=Math.hypot(H,K,se)||1;H/=ie,K/=ie,se/=ie;let re=-se,ae=H;const le=Math.hypot(re,ae);le<.2?(re=1,ae=0):(re/=le,ae/=le);const xe=K*ae,Se=se*re-H*ae,Ye=-K*re,Be=C/(D-1),Te=x(y,d,Be);for(let ve=0;ve<l;ve++){const ue=ve/l*6.2832,we=Math.cos(ue),Me=Math.sin(ue),je=[re*we+xe*Me,Se*Me,ae*we+Ye*Me];s([n[C][0]+je[0]*u[C],n[C][1]+je[1]*u[C],n[C][2]+je[2]*u[C]],je,Te,g+(R-g)*Be,0,0)}if(C>0)for(let ve=0;ve<l;ve++){const ue=(ve+1)%l,we=A+(C-1)*l,Me=A+C*l;w.push(we+ve,we+ue,Me+ue,we+ve,Me+ue,Me+ve)}}},b=[[0,-.8,0],[0,.5,0],[0,2.4,0],[0,5,0],[.2,7.6,.1],[.5,13,-.3],[-.3,20,.3],[.2,27,0],[0,32.3,0]];z(b.slice(0,5),[2.7,2.2,1.75,1.6,1.45],8,0,.01),z(b.slice(4),[1.3,1,.68,.4,.16],6,.01,.1);const M=[b];for(let n=0,u=e()*6.2832;n<4;n++){const l=u+(n+e.range(-.22,.22))*1.5708,g=Math.cos(l),R=Math.sin(l),A=e.range(3.4,6.4),D=e.range(6.5,10),C=e.range(23,29.5),T=[[g*.9,A,R*.9],[g*D*.42,A+(C-A)*.2,R*D*.42],[g*D*.74,A+(C-A)*.5,R*D*.74],[g*D*.94,A+(C-A)*.8,R*D*.94],[g*D,C,R*D]];z(T,[1.05,.8,.55,.34,.14],5,.01,.12),M.push(T)}const W=(n,u)=>{for(let l=1;l<n.length;l++)if(u>=n[l-1][1]&&u<=n[l][1]){const g=(u-n[l-1][1])/(n[l][1]-n[l-1][1]||1);return x(n[l-1],n[l],g)}return null},L=me.LEAF_CELLS.needle,G=(n,u,l,g,R,A,D,C)=>{const T=-l,$=u,H=[-u*A,1,-l*A],K=g*A*.5,se=S(D,.8),ie=x(D,v,.45),re=s([n[0]-u*g*.5-T*R*.5,n[1]-K,n[2]-l*g*.5-$*R*.5],H,se,C,.5,1,L[0],L[3]),ae=s([n[0]-u*g*.5+T*R*.5,n[1]-K,n[2]-l*g*.5+$*R*.5],H,se,C,.5,1,L[2],L[3]),le=s([n[0]+u*g*.5+T*R*.5,n[1]+K,n[2]+l*g*.5+$*R*.5],H,ie,C,1.2,1,L[2],L[1]),xe=s([n[0]+u*g*.5-T*R*.5,n[1]+K,n[2]+l*g*.5-$*R*.5],H,ie,C,1.2,1,L[0],L[1]);w.push(re,ae,le,re,le,xe)};for(let n=0;n<Ca.length;n++){const[u,l,g,R,A,D]=Ca[n],C=e()*6.2832;for(let T=0;T<A;T++){const $=C+(T+e.range(-.22,.22))*(6.2832/A),H=[Math.cos($),Math.sin($)],K=[-H[1],H[0]],se=e.range(.9,1.06),ie=g*se,re=R*e.range(.88,1.1),ae=e.range(0,1.2),le=A>1?l*se-ie:ae,xe=u+e.range(-.5,.5),Se=e.range(.88,1.12),Ye=H[0]*le,Be=H[1]*le;let Te=null,ve=1e9;for(const oe of M){const ne=W(oe,xe-.5);if(ne){const ke=Math.hypot(ne[0]-Ye,ne[2]-Be);ke<ve&&(ve=ke,Te=ne)}}Te||(Te=[0,xe-.5,0],ve=le),ve>1.5&&z([Te,[(Te[0]+Ye)/2,xe-.1,(Te[2]+Be)/2],[Ye+H[0]*ie*.35,xe-.25,Be+H[1]*ie*.35]],[.36,.24,.1],4,.04,.12+.012*le);const ue=(oe,ne,ke)=>{const fe=le+oe*ie,Ae=Math.max(0,oe);return[H[0]*fe+K[0]*ne*re,xe+ke-D*Ae*Ae,H[1]*fe+K[1]*ne*re]},we=oe=>.1+.018*Math.abs(le+oe*ie),Me=10,je=s(ue(0,0,.85),[0,1,0],S(x(i,v,.35),Se),we(0),.5,1),ut=s(ue(0,0,-.5),[0,-1,0],S(m,Se),we(0),.3,1),Z=[],Le=[],tt=[];for(let oe=0;oe<Me;oe++){const ne=oe/Me*6.2832,ke=e.range(.84,1.12),fe=Math.cos(ne)*ke,Ae=Math.sin(ne)*ke*(1-.18*Math.cos(ne)),Ne=H[0]*fe+K[0]*Ae,Fe=H[1]*fe+K[1]*Ae,ot=Math.hypot(Ne,Fe)||1,Oe=Ne/ot,Ve=Fe/ot;Z.push(s(ue(fe*.58,Ae*.58,.6),[Oe*.3,.95,Ve*.3],S(i,Se*e.range(.9,1.1)),we(fe*.58),.6,1)),Le.push(s(ue(fe,Ae,0),[Oe*.6,.8,Ve*.6],S(x(i,v,.6),Se*e.range(.9,1.1)),we(fe),1,1)),tt.push(s(ue(fe,Ae,-.02),[Oe*.5,-.86,Ve*.5],S(m,Se),we(fe),1,1));const St=e.range(2,3);G(ue(fe*1.02,Ae*1.02,.05),Oe,Ve,St,St*.8,(oe%2?1:-1)*e.range(.12,.3),S(i,Se),we(fe))}for(let oe=0;oe<Me;oe++){const ne=(oe+1)%Me;w.push(je,Z[ne],Z[oe],Z[oe],Z[ne],Le[ne],Z[oe],Le[ne],Le[oe],ut,tt[oe],tt[ne])}for(let oe=0;oe<5;oe++){const ne=e()*6.2832,ke=e.range(.15,.7),fe=Math.cos(ne)*ke,Ae=Math.sin(ne)*ke,Ne=e()*6.2832,Fe=e.range(2.4,3.4);G(ue(fe,Ae,.9-.3*ke),Math.cos(Ne),Math.sin(Ne),Fe,Fe*.8,e.range(-.2,.2),S(x(i,v,.3),Se),we(fe))}}}let O=0;for(let n=0;n<q.length;n+=3)O=Math.max(O,Math.hypot(q[n],q[n+2]));const o=Ga/O;for(let n=0;n<q.length;n+=3)q[n]*=o,q[n+2]*=o;const r=new f.BufferGeometry;r.setAttribute("position",new f.Float32BufferAttribute(q,3)),r.setAttribute("normal",new f.Float32BufferAttribute(I,3)),r.setAttribute("color",new f.Float32BufferAttribute(F,3)),r.setAttribute("wind",new f.Float32BufferAttribute(N,4)),r.setAttribute("uv",new f.Float32BufferAttribute(k,2)),r.setIndex(w),r.computeBoundingSphere(),r.computeBoundingBox();const p=r.boundingBox;return r.userData={triangles:w.length/3,height:p.max.y,radius:Ga,glowColor:null},r}const kt=(e,q=1)=>"vec3("+he(e,q).map(I=>I.toFixed(4)).join(",")+")",At=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uWarm;
// the low sky a wall is turned to, to the south, east, north and west: the sky's own colour there, laid at build
uniform vec3 uLowS, uLowE, uLowN, uLowW;
uniform float uTime;
// where in their own unsteady burning the west lantern, the east lantern and the hall fire stand: dealt by the seed
uniform vec4 uFlick;
float h12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h12(i), h12(i + vec2(1., 0.)), f.x), mix(h12(i + vec2(0., 1.)), h12(i + vec2(1., 1.)), f.x), f.y); }
float fb(vec2 p){ return .5 * vn(p) + .3 * vn(p * 2.1 + 7.3) + .2 * vn(p * 4.3 + 3.1); }
vec3 shadeLit(vec3 alb, vec3 n, float sun){
  vec3 amb = mix(uGndCol, uSkyCol, n.y * .5 + .5);
  return alb * (amb + uSunCol * max(dot(n, uSunDir), 0.) * sun);
}
// THE HOUSE'S OWN SHADOW on its stone: 1 where the line from a place toward the sun enters the block's plan (x -48 to
// 48, z -88 to 0) under its wall head (y 33), or the great tower's plan under the tower's head. A face that looks
// into the house's body never takes the sun.
float boxShade(vec3 w, vec2 a, vec2 b, float head){
  vec2 d = uSunDir.xz;
  vec2 dd = vec2(abs(d.x) < 1e-4 ? 1e-4 : d.x, abs(d.y) < 1e-4 ? 1e-4 : d.y);
  vec2 t0 = (a - w.xz) / dd, t1 = (b - w.xz) / dd;
  vec2 lo = min(t0, t1), hi = max(t0, t1);
  float te = max(max(lo.x, lo.y), 0.), tx = min(hi.x, hi.y);
  return step(te + .05, tx) * step(w.y + te * uSunDir.y, head);
}
float blockShade(vec3 w){
  return max(boxShade(w, vec2(-48., -88.), vec2(48., 0.), ${B.toFixed(1)}),
    boxShade(w, vec2(${(-_e.hx).toFixed(1)}, ${_e.z1.toFixed(1)}), vec2(${_e.hx.toFixed(1)}, ${_e.z0.toFixed(1)}), ${_e.y2.toFixed(1)}));
}
// THE STONE'S LIGHT: the sky's two halves as on everything; the low sky that a wall is turned to; under a moulding,
// a share of that light thrown back up by the pale wall it stands on; the sun by its own direction, which also rims a
// face turned a little past it; none of the sun in the house's own shadow
vec3 stoneLight(vec3 n, vec3 w, float open){
  float h = 1. - n.y * n.y, sl = dot(n, uSunDir);
  vec3 amb = mix(uGndCol, uSkyCol, n.y * .5 + .5) * .7;
  vec3 low = uLowS * max(n.z, 0.) * n.z + uLowN * max(-n.z, 0.) * -n.z + uLowE * max(n.x, 0.) * n.x + uLowW * max(-n.x, 0.) * -n.x;
  low += (uLowS + uLowN + uLowE + uLowW) * (.15 * max(-n.y, 0.));
  float sun = (max(sl, 0.) + .5 * smoothstep(-.2, .35, sl) * h) * (1. - blockShade(w));
  return (amb + low) * open + uSunCol * sun * step(.99, open);
}
// metres from a place on the ground to the nearest wall that carries basement windows: the front between the middle
// bay and the turrets, the middle bay beside the arch, the turrets' south faces, their outer faces, the flanks
float wallDist(vec2 p){
  float ax = abs(p.x), z = p.y;
  float d = length(vec2(max(max(11. - ax, ax - 36.5), 0.), z));
  d = min(d, length(vec2(max(max(6.4 - ax, ax - 11.), 0.), z - 2.)));
  d = min(d, length(vec2(max(max(36.5 - ax, ax - 50.5), 0.), z - 2.5)));
  d = min(d, length(vec2(ax - 50.5, max(max(-11.5 - z, z - 2.5), 0.))));
  d = min(d, length(vec2(ax - 48., max(max(-76.5 - z, z + 11.5), 0.))));
  return d;
}
// the two standards' lanterns at the steps' foot (7.5 m either side of the way, z 10, 5.9 m up): their unsteady light
// on a face that looks toward them, each lantern in its own time
float lampFall(float d){ float f = 1. - smoothstep(.3, 2.5, d); return f * f; }
vec3 standLight(vec3 w, vec3 n){
  vec3 lv = vec3(abs(w.x) - 7.5, w.y - 5.9, w.z - 10.);
  float ll = length(lv), lt = mix(uFlick.x, uFlick.y, step(0., w.x));
  float fl = .3 + .55 * vn(vec2(uTime * 3.4 + lt, 1.5)) + .4 * vn(vec2(uTime * 1.3 + lt, 8.5));
  float turn = .3 + .7 * max(dot(vec3(n.x * sign(w.x), n.y, n.z), -lv / max(ll, .01)), 0.);
  // a lantern lights the stone within two and a half metres of itself and no further
  return uWarm * 2.3 * fl * turn * lampFall(ll);
}
// the basement's firelight on what stands before those walls: paint read from the walls' own places
vec3 spill(vec3 w){
  float d = wallDist(w.xz);
  float fl = .45 + .55 * vn(vec2(w.x * .16 + w.z * .11, uTime * 3.2));
  // the low windows' warm light: it lies on the gravel by the wall and comes back on the wall's own foot, 3.6 m at most
  return uWarm * .35 * fl * (exp(-d / 5.) + .35 * exp(-d / 16.)) * smoothstep(3.6, .4, w.y);
}
`,xs=`
attribute float aMat; attribute vec2 aUL; attribute vec3 aCol;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vM; varying vec2 vUL;
${te.GLSL_FOG_PARS_VERT}
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vC = aCol; vM = aMat; vUL = aUL;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  ${te.GLSL_FOG_VERT}
}`,bs=`
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vM; varying vec2 vUL;
uniform float uLampGain;
// where in their own unsteady burning the passage's west and east lanterns stand: dealt by the seed
uniform vec2 uFlick2;
${At}${te.GLSL_FOG_PARS_FRAG}
// the weathering that gathers under a course whose foot is at c
float under(float y, float c){ return smoothstep(c - 1.7, c - .05, y) * (1. - step(c, y)); }
float courseShade(float y, float c, float drop){ float d = c - y; return step(0., d) * (1. - smoothstep(.14 + drop, .6 + drop, d)); }
// the carved panel's straps: metres from a place on it to the nearest strap's middle (a lozenge between two ovals, one
// level strap through all three)
float strapD(vec2 q){
  float d = abs(abs(q.x) / .95 + abs(q.y) / .46 - 1.) * .4;
  d = min(d, abs(length(vec2((abs(q.x) - 1.55) / .62, q.y / .42)) - 1.) * .42);
  return min(d, max(abs(q.y), abs(q.x) - 2.3));
}
void main(){
  vec3 n = normalize(vN);
  float m = floor(vM + .5);
  vec3 alb = vC; vec3 emis = vec3(0.);
  float px = max(fwidth(vW.y), fwidth(vW.x) + fwidth(vW.z));
  float fine = 1. - smoothstep(.1, .5, px);
  vec2 wc = abs(n.z) > abs(n.x) ? vW.xy : vW.zy;
  float isStone = 0.;
  // the forecourt's older, greyer stone (piers, balls, balustrade): every block its own tone, dark joints, a lit arris
  // under each bed joint, damp and dark toward the ground
  vec3 stone = ${kt(Mt)} * (.86 + .28 * fb(wc * .45));
  float srow = floor(wc.y / .6);
  vec2 sb = vec2(wc.x / 1.25 + mod(srow, 2.) * .5, wc.y / .6);
  vec2 sj = fract(sb);
  stone *= (.9 + .2 * mix(.5, h12(floor(sb) + 31.), fine)) * (.9 + .2 * vn(vec2(wc.x * .9, wc.y * .12)));
  stone *= 1. - .3 * fine * (1. - smoothstep(.0, .05, min(min(sj.x, 1. - sj.x) * 2., min(sj.y, 1. - sj.y))));
  stone *= 1. + .12 * fine * smoothstep(.86, .93, sj.y) * (1. - smoothstep(.93, .96, sj.y));
  stone *= mix(.84, 1., smoothstep(0., 2.6, vW.y));
  if (m < .5) {
    // THE HOUSE'S STONE: fine ashlar, its courses (0.55 m) and blocks (1.3 m) only just seen, every block a little its own
    float row = floor(wc.y / .55);
    vec2 ab = vec2(wc.x / 1.3 + mod(row, 2.) * .5, wc.y / .55), aj = fract(ab);
    float fineA = 1. - smoothstep(.06, .3, px);
    alb = vC * (.93 + .14 * fb(wc * .21)) * (.935 + .13 * mix(.5, h12(floor(ab) + 17.), fineA));
    // the ashlar's courses read from forty metres: the bed joints are the stronger and wider line, the upright joints the fainter
    float bed = 1. - smoothstep(0., .1, min(aj.y, 1. - aj.y)), perp = 1. - smoothstep(0., .07, min(aj.x, 1. - aj.x) * 2.36);
    alb *= 1. - fineA * max(.24 * bed, .14 * perp);
    // the rain's long stains down the face; a darker weathered band at the plinth (to 3 m) and under every course: the
    // two strings and the wall head; a turret's own head; on the tower its two stages' heads
    alb *= .93 + .14 * vn(vec2(wc.x * .7, wc.y * .06));
    float y = vW.y, onTower = step(abs(vW.x), 20.);
    float wth = max(1. - smoothstep(1.2, 3.1, y), max(under(y, 14.), max(under(y, 23.6), under(y, 32.4))));
    wth = max(wth, mix(under(y, 42.4), max(under(y, 45.7), under(y, 57.4)), onTower));
    alb *= mix(vec3(1.), vec3(.78, .765, .75), wth * (.75 + .5 * vn(vec2(wc.x * .35, 3.7))));
    // every string course and the cornice throws a band of shade on the wall under it: the sky's light is cut off close
    // under the projecting member, and the sun's own shadow falls below it as far as the sun's height carries it
    float drop = min(.3 * max(uSunDir.y, 0.) / max(dot(uSunDir, vec3(n.x, 0., n.z)), .25), .6);
    float cs = max(courseShade(y, 14., drop), max(courseShade(y, 23.6, drop), courseShade(y, 32.4, drop)));
    cs = max(cs, mix(courseShade(y, 42.4, drop), max(courseShade(y, 45.7, drop), courseShade(y, 57.4, drop)), onTower));
    alb *= 1. - .36 * cs * (1. - n.y * n.y);
    // the plinth's moulded head, a light line on the walls at 2.9 m
    alb *= 1. + .1 * fineA * (1. - n.y * n.y) * (smoothstep(2.8, 2.86, y) - smoothstep(2.98, 3.04, y));
    isStone = 1.;
  } else if (m < 1.5) {
    alb = stone * vC / ${kt(Mt)};
  } else if (m < 2.5) {
    // the carved panel over the arch: raised straps, light on their upper side, the sunk field between them in their shade
    vec2 q = vec2(vW.x, vW.y - 18.1);
    float d = strapD(q), up = strapD(q + vec2(0., .03));
    float strap = 1. - smoothstep(.05, .085, d);
    float k = mix(.8, 1.06 + .2 * clamp((up - d) / .03, -1., 1.), strap);
    alb = vC * (.95 + .1 * fb(wc * .6)) * mix(.88, k, fine);
    isStone = 1.;
  } else if (m < 3.5) {
    float seam = 1. - smoothstep(.0, .08, abs(fract(vW.x / 1.5) - .5) * 2. - .9);
    float roll = smoothstep(.86, .93, abs(fract(vW.x / 1.5) - .5) * 2.) * seam;
    alb = vC * (.9 + .16 * fb(vW.xz * .3)) * (1. + .4 * roll * (1. - smoothstep(.2, .9, px)));
  } else if (m < 4.5) {
    float plank = floor(wc.x / .7);
    alb = vC * (.75 + .4 * h12(vec2(plank, 3.))) * (.85 + .3 * vn(vec2(wc.x * 9., wc.y * .6)));
    float strap = 1. - step(.045, abs(fract((wc.y - 3.) / 4.) - .5));
    alb = mix(alb, vec3(.03, .03, .035), clamp(strap, 0., 1.) * .9);
  } else if (m < 5.5) {
    alb = vC;
  } else if (m < 6.5) {
    alb = vC * (.6 + .8 * fb(vW.xz * 1.9 + vW.y * 1.3)) * (.7 + .3 * smoothstep(0., .8, vW.y));
  } else if (m < 7.5) {
    float t = (vW.y - vUL.x) / max(vUL.y - vUL.x, .01);
    float slot = step(.2, t) * step(t, .78) * step(.45, fract(wc.x / .62));
    alb = stone * vC / ${kt(Mt)} * mix(1., mix(.75, .3, fine), slot);
  } else {
    // a lantern's panes: a flame's heart behind glass, iron bars at the corners and across the middle. Every pane carries
    // its own middle along itself and its flame's height; the passage's two hang high (y 11) and are the smaller.
    float high = step(8., vUL.y), hw = mix(.42, .25, high), sc = mix(1., .62, high);
    float al = (abs(n.z) > abs(n.x) ? vW.x : vW.z) - vUL.x;
    // the flame leans and stretches in the draught, each lantern in its own time
    float lt = mix(mix(uFlick.x, uFlick.y, step(0., vW.x)), mix(uFlick2.x, uFlick2.y, step(0., vW.x)), high);
    float sway = vn(vec2(uTime * 4.2 + lt, 2.5)) - .5, tall = .7 + .7 * vn(vec2(uTime * 3.1 + lt, 6.5));
    vec2 lp = vec2(al - sway * .22 * sc, (vW.y - vUL.y) / tall) / sc;
    float flame = exp(-dot(lp, lp) / .06) * 1.8 + .14;
    float bars = step(hw - .08, abs(al)) + step(abs(vW.y - vUL.y - .1 * sc), .03 * sc);
    emis = vC * uLampGain * flame * (.82 + .18 * vn(vec2(vW.x, uTime * 5.))) * (1. - clamp(bars, 0., 1.));
    alb = vec3(.02);
  }
  // UNDER COVER: within the entrance passage (north of the front's plane, between its walls, under its vault) no sun
  // comes and the sky's light thins toward the door
  float cover = step(abs(vW.x), 5.25) * step(vW.z, .02) * step(vW.y, 16.2);
  float open = 1. - cover * (.35 + .4 * smoothstep(0., -9., vW.z));
  vec3 lit = isStone > .5 ? stoneLight(n, vW, open) : mix(uGndCol, uSkyCol, n.y * .5 + .5) * open + uSunCol * max(dot(n, uSunDir), 0.) * (1. - cover);
  vec3 col = alb * (lit + spill(vW) * (1. - cover)) + emis;
  // firelight from the open door on the passage's own faces, on the arch and on the steps before it
  vec3 toDoor = vec3(0., 8.5, -11.) - vW;
  // (its reach: within the passage, the walls and the vault; before the front's plane, the arch's own round out to its
  // hood's outer edge, 5.75 m about the springing at y 11.5, and the steps between the cheeks)
  // the hall's fire lights only what it can reach through the open doorway: the passage, the arch's inner order
  // (the first 1.4 m of its depth, inside its inner round) and the upper three steps; the front outside takes none
  float inPass = step(abs(vW.x), 5.25) * step(vW.z, .02) * step(vW.y, 16.2);
  float inOrder = step(.02, vW.z) * step(vW.z, 1.42) * step(length(vec2(vW.x, max(vW.y - 11.5, 0.))), 5.21);
  float onSteps = step(.02, vW.z) * step(abs(vW.x), 5.25) * step(vW.y, 3.05) * (1. - smoothstep(3.33, 5.67, vW.z));
  float inWay = step(-12.6, vW.z) * max(inPass, max(inOrder, onSteps));
  float dl = length(toDoor);
  // the hall fire's light is never steady
  float dfl = .3 + .5 * vn(vec2(uTime * 2.8 + uFlick.z, vW.y * .22 + vW.z * .13 + vW.x * .09)) + .4 * vn(vec2(uTime * 1.1 + uFlick.z, 4.5));
  col += alb * uWarm * 1.5 * dfl * inWay * exp(-dl / 13.) * (.35 + .65 * max(dot(n, toDoor / max(dl, .01)), 0.));
  // the lanterns' own unsteady light on the stone beside them: the two standards' at the steps' foot (x 7.5 either side,
  // z 10, 5.9 m up) and the passage's two on their brackets (4.55 m either side of the way, z -3, 11.1 m up)
  vec3 nm = vec3(n.x * sign(vW.x), n.y, n.z);
  col += alb * standLight(vW, n) * (1. - step(7.5, m)) * (1. - cover);
  vec3 pv = vec3(abs(vW.x) - 4.55, vW.y - 11.1, vW.z + 3.);
  float pt = mix(uFlick2.x, uFlick2.y, step(0., vW.x));
  float pfl = .3 + .55 * vn(vec2(uTime * 3.4 + pt, 1.5)) + .4 * vn(vec2(uTime * 1.3 + pt, 8.5));
  float pturn = .3 + .7 * max(dot(nm, -pv / max(length(pv), .01)), 0.);
  col += alb * uWarm * 2. * pfl * pturn * lampFall(length(pv)) * (1. - step(7.5, m)) * inPass;
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`,Ms=`
attribute vec4 aA; attribute vec4 aB;
varying vec2 vUv; varying vec4 vA; varying vec4 vB; varying vec3 vW; varying vec3 vN;
${te.GLSL_FOG_PARS_VERT}
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vUv = uv; vA = aA; vB = aB;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  ${te.GLSL_FOG_VERT}
}`,ks=`
varying vec2 vUv; varying vec4 vA; varying vec4 vB; varying vec3 vW; varying vec3 vN;
uniform vec4 uLamp[6];
uniform vec3 uGlassLo, uGlassHi, uShutter, uLampCol, uFireCol;
uniform float uHdr;
${At}${te.GLSL_FOG_PARS_FRAG}
void main(){
  vec3 n = normalize(vN);
  vec2 size = vec2(vA.w, vB.x); vec2 p = vUv * size;
  float storey = vA.x, seed = vA.y;
  float px = max(fwidth(p.x), fwidth(p.y));
  float fr = storey < .5 ? .22 : .3;
  vec2 inner = max(size - 2. * fr, vec2(.2));
  vec2 q = (p - fr) / inner;
  float inside = step(0., q.x) * step(q.x, 1.) * step(0., q.y) * step(q.y, 1.);
  // the window's make: its stone mullions and transoms divide it into lights across and rows up
  float kind = floor(vB.w + .5), roundK = floor(kind / 100. + .01);
  vec2 nc = kind < .5 ? max(floor(inner / vec2(1.3, 2.4) + .5), vec2(1.)) : vec2(floor(mod(kind, 100.) / 10. + .01), mod(kind, 10.));
  vec2 g = clamp(q, 0., 1.) * nc; vec2 cell = floor(g); vec2 gf = fract(g);
  vec2 dm = min(gf, 1. - gf) * inner / nc;
  float bw = kind < .5 ? .1 : .13;
  float bar = 1. - smoothstep(bw - px * .5, bw + px * .5 + .002, min(dm.x, dm.y));
  // a round head: each light's own, or one over the whole window; stone fills the corners over it
  float cw = roundK > 1.5 ? inner.x : inner.x / nc.x;
  vec2 hq = q * inner - vec2(roundK > 1.5 ? inner.x * .5 : (cell.x + .5) * cw, inner.y - cw * .5);
  float head = step(.5, roundK) * step(0., hq.y) * smoothstep(-px * .5, px * .5 + .002, length(hq) - cw * .5 + (roundK > 1.5 ? 0. : bw));
  float stoneK = max(max(1. - inside, head * inside), bar * (1. - .55 * smoothstep(.25, .9, px)));
  float paneR = h12(cell + seed * 97.);
  float lit = vB.y, shut = vB.z;
  // the lamps that travel behind the ranks: a glow about two windows wide
  float sHere = vA.z + (vUv.x - .5) * size.x; float lamp = 0.;
  float hy = (q.y - .4) * size.y;
  for (int i = 0; i < 6; i++) {
    vec4 L = uLamp[i]; float d = sHere - L.y;
    lamp += L.z * (.45 * exp(-d * d / 11.6) + 1.1 * exp(-(d * d + hy * hy) / 1.7)) * (1. - step(.5, abs(L.x - storey)));
  }
  lamp *= step(0., vA.z);
  // glass that mirrors the sky, every old pane leaning its own way
  vec3 sky = mix(uGlassLo, uGlassHi, clamp(q.y * .55 + .2 + (paneR - .5) * .6, 0., 1.)) * (.7 + .6 * paneR);
  // pale shut shutters behind the glass: leaves with a seam
  float seam = smoothstep(0., .07, abs(fract(g.x) - .5));
  float rail = smoothstep(0., .05, abs(fract(q.y * 3.) - .5));
  vec3 shutC = shadeLit(uShutter * (.8 + .2 * seam * rail) * (.92 + .16 * paneR), n, 0.) * 1.35 + sky * .12;
  vec3 base = mix(sky, shutC, shut);
  // below stairs every fire flickers; above, the rooms with a fire just lit flicker and the lamp-lit ones burn steady
  float fireK = step(.55, fract(seed * 13.7));
  float fl = storey < .5 ? .6 + .4 * vn(vec2(seed * 40. + q.x * 1.5, uTime * 3.1)) : mix(.95, .66, fireK) + mix(.05, .34, fireK) * vn(vec2(seed * 40., uTime * 2.4));
  float low = mix(1.18, .78, q.y);
  vec3 warm = mix(uLampCol, uFireCol, storey < .5 ? .6 : .1);
  float crack = (1. - seam) * .8 + .04;
  // a lamp or a fire low in the room: a hot heart in an amber field
  vec2 hp = vec2((q.x - (fract(seed * 7.31) * .7 + .15)) * size.x, (q.y - .28) * size.y);
  float hot = exp(-dot(hp, hp) / 2.4);
  float room = storey < .5 ? 1.2 : .5 * low + .7 * hot;
  float amt = lit * fl * room * (.85 + .15 * paneR) * (1. - shut) + lamp * mix(1., crack, shut);
  vec3 glow = warm * uHdr * amt;
  vec3 stone = ${kt(de)} * (.92 + .16 * fb(vW.xy * .5 + vW.z * .5));
  // a thin label mould over the flat head, in the surround's own stone: a light member and the shade line under it
  float lab = step(.5, storey) * step(roundK, .5) * step(size.y - fr, p.y);
  stone *= 1. + lab * (.1 - .34 * (1. - smoothstep(.0, .07, p.y - (size.y - fr))));
  // a hint of the room: drawn curtains at the sides and a pelmet, a shutter leaf folded back; never a figure
  float cur = step(.4, fract(seed * 5.13)) * step(.5, storey);
  float cxw = min(q.x, 1. - q.x);
  float drape = cur * max(1. - smoothstep(.12, .17, cxw + .02 * sin(q.y * 11. + seed * 20.)), smoothstep(.88, .91, q.y));
  glow *= mix(vec3(1.), vec3(.36, .1, .045) * (.7 + .3 * sin(cxw * 150.)), drape);
  float leaf = step(.72, fract(seed * 3.7)) * step(.5, storey) * (1. - shut) * step(.86, q.x);
  base = mix(base, shutC, leaf); glow *= 1. - .8 * leaf;
  // the lowest rank keeps its shallow reveal: a shade under the lintel and by the west jamb
  float deepK = step(.5, storey);
  float rev = max(smoothstep(.94, 1., q.y), 1. - smoothstep(0., .05, q.x)) * (1. - deepK);
  base *= 1. - .45 * rev; glow *= 1. - .3 * rev;
  // THE GLASS OF THE THREE UPPER RANKS SITS 0.4 m BACK IN ITS OPENING, one law for every window on every face: the
  // head and the jamb on the sun's side throw their shade on the glass and its bars as far as 0.4 m of depth carries
  // it by the sun's own bearing, the sky's light is cut off close under the head and in the corners, and the reveal's
  // four faces show as a band inside the opening, each lit by the way it is turned (sill up, head down, a jamb each way)
  vec3 tw = vec3(n.z, 0., -n.x);
  float us = sign(dot(dFdx(vW), tw) * dFdx(p.x) + dot(dFdy(vW), tw) * dFdy(p.x));
  float sn = dot(uSunDir, n), sx = dot(uSunDir, tw) * us;
  vec2 em = min(q, 1. - q) * inner;
  float fromJamb = (sx > 0. ? 1. - q.x : q.x) * inner.x, fromHead = (1. - q.y) * inner.y;
  float reach = .4 / max(sn, .1), soft = .02 + px * .5;
  float shd = step(.02, sn) * max(1. - smoothstep(-soft, soft, fromJamb - min(abs(sx) * reach, inner.x * .8)), 1. - smoothstep(-soft, soft, fromHead - min(max(uSunDir.y, 0.) * reach, inner.y * .8)));
  float occ = .36 * exp(-min(em.x, em.y) / .26) + .3 * exp(-fromHead / .5);
  float dim = 1. - deepK * (1. - (1. - .5 * shd) * (1. - occ));
  base *= dim;
  float bandK = inside * deepK * (1. - head) * (1. - smoothstep(.16 - px * .5, .16 + px * .5, min(em.x, em.y)));
  vec3 nf = em.x < em.y ? tw * (us * (q.x < .5 ? 1. : -1.)) : vec3(0., q.y < .5 ? 1. : -1., 0.);
  // the reveal's shade lies along the head and along the jamb turned from the sun; the sill and the other jamb take the light
  float turned = em.x < em.y ? step(dot(nf, uSunDir), 0.) : step(.5, q.y);
  vec3 revC = stone * (stoneLight(nf, vW, 1.) + spill(vW)) * mix(1.04, .56, turned);
  vec3 sc = stone * (stoneLight(n, vW, 1.) + spill(vW) + standLight(vW, n)) * mix(1., dim, inside) + glow * .09 * inside;
  // mullions and transoms stand proud: their upper and east arrises are the lighter, the others sit in shade
  float vbar = step(dm.x, dm.y);
  float arris = mix(step(gf.y, .5), step(gf.x, .5), vbar);
  sc *= mix(1., mix(.78, 1.16, arris), bar * inside);
  vec3 col = mix(mix(base + glow, sc, stoneK), revC, bandK);
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`,As=`
varying vec3 vW; varying vec3 vN;
${te.GLSL_FOG_PARS_VERT}
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  ${te.GLSL_FOG_VERT}
}`,Ss=`
varying vec3 vW; varying vec3 vN;
uniform vec3 uLawn, uLawnDry, uGravel, uLavender, uSoil, uFrost, uLampCol;
uniform vec2 uSunXZ; uniform vec3 uShadow, uMistCol; uniform float uGraze, uLampGain, uLakeY, uFrostK, uMistK;
${At}${te.GLSL_FOG_PARS_FRAG}
void main(){
  vec3 n = normalize(vN); vec2 p = vW.xz; float ax = abs(p.x);
  float px = fwidth(p.x) + fwidth(p.y);
  float fine = 1. - smoothstep(.15, .9, px);
  // gravel round the house and over the forecourt, lawn beyond the balustrade
  float gr = (1. - smoothstep(47.4, 48.6, ax)) * (1. - smoothstep(45.4, 46.6, p.y));
  gr = max(gr, (1. - smoothstep(56., 60., ax)) * (1. - smoothstep(4., 8., p.y)) * smoothstep(-100., -95., p.y));
  vec3 lawn = mix(uLawn, uLawnDry, smoothstep(.45, .8, fb(p * .011))) * (.8 + .4 * fb(p * .07)) * (.93 + .14 * mix(.5, vn(p * 2.3), fine));
  lawn = mix(lawn, uFrost, uFrostK * (.55 + .3 * fb(p * .05)));
  // the lawn near the house is mown in stripes
  lawn *= 1. + .12 * (step(.5, fract(p.x / 11.)) - .5) * (1. - smoothstep(150., 260., length(p))) * (1. - smoothstep(.5, 2.5, px));
  vec3 gravel = uGravel * (.86 + .28 * fb(p * .35)) * (.9 + .2 * mix(.5, h12(floor(p * 5.)), fine));
  // the whole forecourt is raked east to west; two wheel ruts run from the balustrade's gap (z 46) to the steps' foot (z 8);
  // moss greens the gravel's edge along the balustrade and at the walls' feet
  gravel *= 1. + .05 * fine * sin(p.y * 19.6 + .6 * vn(p * .4));
  float rut = (1. - smoothstep(.1, .24, abs(abs(p.x + .3 * sin(p.y * .21)) - .75))) * step(8.6, p.y) * (1. - step(46., p.y));
  gravel *= 1. - .16 * rut;
  float edge = min(min(48. - ax, 46. - p.y), wallDist(p) + .2);
  gravel = mix(gravel, vec3(.13, .19, .09) * (.7 + .6 * fb(p * .9)), (1. - smoothstep(.15, 1.5, edge)) * .5 * step(0., edge));
  // the knot gardens' beds: lavender and bare earth between the clipped hedges
  vec2 kq = abs(vec2(ax - 27., p.y - 24.)) - 9.;
  float inK = step(max(abs(kq.x), abs(kq.y)), 7.4);
  float lav = smoothstep(.35, .6, vn(p * .9 + 11.) * .6 + vn(p * 2.7) * .4);
  // the lavender moves in waves under the west-going wind
  float lw = .68 + .64 * vn(vec2(p.x * .32 + uTime * .9, p.y * .32 - uTime * .22));
  gravel = mix(gravel, mix(uSoil, uLavender * (.8 + .4 * vn(p * 4.)) * lw, lav), inK * .92);
  vec3 alb = mix(lawn, gravel, gr);
  // the lake's margin: wet earth just above the water
  alb = mix(alb, uSoil * .8, (1. - smoothstep(uLakeY + .1, uLakeY + .75, vW.y)) * (1. - gr));
  // first light across the park: the house's long shadow, and soft bars of light and shade drawn out down the light
  vec2 sp = vec2(-uSunXZ.y, uSunXZ.x);
  float c = dot(p, sp), a = dot(p, uSunXZ);
  float inSh = smoothstep(uShadow.x - 14., uShadow.x + 8., c) * (1. - smoothstep(uShadow.y - 8., uShadow.y + 14., c)) * (1. - smoothstep(uShadow.z - 10., uShadow.z + 10., a));
  float bars = smoothstep(.4, .62, vn(vec2(c * .026, a * .0022)) * .62 + vn(vec2(c * .085, a * .004 + 9.)) * .38 + .06);
  float sunOn = bars * (1. - inSh);
  vec3 amb = mix(uGndCol, uSkyCol, n.y * .5 + .5);
  vec3 col = alb * (amb + uSunCol * (max(dot(n, uSunDir), 0.) * .6 + uGraze) * sunOn);
  // the windows' warm spill lies on the gravel no brighter than the stone beside it
  col += alb * spill(vW);
  // mist lies on the lawns in soft round banks with feathered edges, carried west by south on the park's wind
  vec2 mp = p + vec2(uTime * 2.4, -uTime * .6);
  float mb = smoothstep(.3, .82, vn(mp * .019) * .56 + vn(mp * .043 + 7.3) * .3 + vn(mp * .1 + 3.1) * .14);
  // it gathers in the ground's hollows and by the lake and thins away on every rise
  mb *= 1.15 - smoothstep(-.5, 1.7, vW.y);
  // none of it within forty metres of the house, and none on the forecourt's gravel: the forecourt's air is clear
  float hd = length(max(vec2(abs(p.x) - 50.5, max(p.y - 2.5, -88. - p.y)), 0.));
  mb *= smoothstep(40., 66., hd);
  // a bank is lit softly through its whole depth: the sun's bars on the grass never show in it as streaks
  col = mix(col, uMistCol * (1. + .5 * (1. - inSh)), mb * uMistK * (1. - gr));
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`,Ls=`
attribute vec4 aBird;
uniform float uTime;
varying float vWing;
${te.GLSL_FOG_PARS_VERT}
vec3 course(float th, float sx){ return vec3(sx * (2.6 + .8 * cos(th)), 5.5 + 1.3 * sin(th), 2. + 9. * sin(th)); }
void main(){
  float th = uTime * aBird.y + aBird.z;
  // the course is never upright and never at rest; both lengths have a floor all the same
  vec3 c = course(th, aBird.x), f = normalize(course(th + .03, aBird.x) - c + vec3(0., 0., 1e-5));
  vec3 r = normalize(cross(f, vec3(0., 1., 0.)) + vec3(1e-4, 0., 0.)), u = cross(r, f);
  float flap = sin(uTime * 31. + aBird.z * 9.) * aBird.w;
  vec3 p = c + r * position.x * (1. - .25 * abs(flap)) + u * (position.y + flap * .16) + f * position.z;
  vWing = aBird.w;
  vec4 mvPosition = viewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  ${te.GLSL_FOG_VERT}
}`,Fs=`
uniform vec3 uSkyCol, uGndCol, uWarm;
varying float vWing;
${te.GLSL_FOG_PARS_FRAG}
void main(){
  vec3 col = mix(vec3(.16, .12, .1), vec3(.07, .06, .06), vWing) * (uSkyCol * 1.4 + uGndCol + uWarm * .5);
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`,Ke={w:512,h:128,len:6.4,tall:lt};function Wa(e,q){const F=e-1.6,N=q-1.19,k=Math.abs(e-4.8),w=Math.abs(q-1.19);let s=Math.min(q-.26,2.12-q,Math.min(e,Ke.len-e,Math.abs(e-3.2))-.13);const x=Math.hypot(F/1.22,N/.8)||1e-6;s=Math.min(s,Math.abs(x-1)/(Math.hypot(F/1.4884,N/.64)/x)-.1,Math.abs(k/1.3+w/.84-1)*.7055-.1);const S=Math.min(Math.hypot(F,N),Math.hypot(k,w));return s=Math.min(s,Math.abs(S-.3)-.075),S>.3&&(s=Math.min(s,Math.abs(N)-.075,Math.min(Math.abs(F),k)-.075)),s}function zs(e,q,I){const{w:F,h:N,len:k,tall:w}=Ke,s=k/F,x=w/N;for(let S=q;S<I;S++)for(let y=0;y<F;y++){let d=0,m=0;for(let v=0;v<4;v++){const z=(y+.25+.5*(v&1))*s,b=(S+.25+.5*(v>>1))*x,M=Wa(z,b);M<0&&(d++,m+=Math.max(-1,Math.min(1,(Wa(z,b+.02)-M)/.02))*Math.max(0,1+M/.07))}const i=(S*F+y)*4;e[i]=Math.round(d*63.75),e[i+1]=Math.round(127.5+127.5*(d?m/d:0)),e[i+2]=0,e[i+3]=255}}const Cs=`
varying vec2 vUv; varying vec3 vW; varying vec3 vN;
${te.GLSL_FOG_PARS_VERT}
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vUv = uv;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  ${te.GLSL_FOG_VERT}
}`,Gs=`
uniform sampler2D uMap;
varying vec2 vUv; varying vec3 vW; varying vec3 vN;
${At}${te.GLSL_FOG_PARS_FRAG}
void main(){
  vec4 t = texture2D(uMap, vUv);
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.);
  vec3 alb = ${kt(de)} * (.88 + .3 * (t.g - .5)) * (.93 + .12 * vn(vW.xz * .4 + vW.y * .7));
  gl_FragColor = vec4(fxApplyFog(alb * stoneLight(n, vW, 1.)), t.r);
}`,Ws=`
attribute vec2 aFlag;
uniform float uTime; uniform vec4 uFlagA; uniform vec3 uFlagAt; uniform vec2 uFlagWind;
varying vec3 vW; varying vec3 vN;
${te.GLSL_FOG_PARS_VERT}
vec3 flagAt(vec2 f){
  float u = f.x, r1 = sin(u * 7.5 - uTime * uFlagA.x + uFlagA.z), r2 = sin(u * 16. + f.y * 2.2 - uTime * uFlagA.y + uFlagA.w);
  float side = u * (.3 + .7 * u) * (.48 * r1 + .2 * r2);
  vec2 xz = uFlagAt.xz + uFlagWind * (.25 + 7. * u) + vec2(-uFlagWind.y, uFlagWind.x) * side;
  return vec3(xz.x, uFlagAt.y + 4.5 * f.y - .4 * u * u + .08 * u * r2, xz.y);
}
void main(){
  vec3 p = flagAt(aFlag);
  // the cloth's own normal from its two neighbours along the fly and up the hoist (neither is ever at the place itself)
  vN = normalize(cross(flagAt(aFlag + vec2(.02, 0.)) - p, flagAt(aFlag + vec2(0., .02)) - p));
  vW = p;
  vec4 mvPosition = viewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  ${te.GLSL_FOG_VERT}
}`,_s=`
uniform vec3 uFlagCol;
varying vec3 vW; varying vec3 vN;
${At}${te.GLSL_FOG_PARS_FRAG}
void main(){
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.);
  float sl = dot(n, uSunDir);
  vec3 amb = mix(uGndCol, uSkyCol, n.y * .5 + .5) + uLowS * max(n.z, 0.) + uLowN * max(-n.z, 0.) + uLowE * max(n.x, 0.) + uLowW * max(-n.x, 0.);
  vec3 col = uFlagCol * (amb * 1.3 + uSunCol * (max(sl, 0.) + .7 * max(-sl, 0.)));
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`,_a={dawn:{preset:"dawn",az:52,el:.9,sky:{zenith:"#0c2666",mid:"#3c64ba",horizon:"#9aa6d2",ground:"#7c88a8",horizonPow:4,midPow:1.2,scatterColor:"#ff9a5a",scatter:1.15,scatterPow:6.5,scatterHigh:.02,scatterFall:6,sunColor:"#ffd9a0",sunSize:1.7,sunIntensity:12,sunGlow:1,stars:.05,clouds:!1,clouds2:{lit:"#f29a8c",shade:"#6f78b4",opacity:.42,coverage:.22}},sun:"#ffc58a",sunK:1.6,skyL:[.2,.288,.555],gndL:[.118,.166,.297],hdr:3.4,lit:1,fog:[30,900],graze:.5,mist:"#b4c0d4"},day:{preset:"day",az:96,el:26,sky:{clouds2:{opacity:.3}},sun:"#fff0dc",sunK:3,skyL:[.23,.29,.38],gndL:[.14,.15,.14],hdr:1.6,lit:.45,fog:[140,2800],graze:.2,mist:"#dfe6ee"},golden:{preset:"goldenHour",az:-48,el:7,sky:{},sun:"#ffc27a",sunK:2.8,skyL:[.18,.23,.38],gndL:[.13,.13,.15],hdr:2.6,lit:.8,fog:[80,1900],graze:.4,mist:"#e6d6c4"},night:{preset:"night",az:140,el:34,sky:{},sun:"#9fb6ff",sunK:1,skyL:[.08,.12,.26],gndL:[.045,.06,.12],hdr:3.6,lit:1,fog:[60,1500],graze:.12,mist:"#5a6c96"}};async function qs(e,q={}){const{core:I}=e,{clamp:F,lerp:N,smoothstep:k}=I,w=t=>I.makeRng(I.hashSeed("bbb-outside-"+t+":"+e.seed)),s={look:w("look"),sky:w("sky"),win:w("win"),lamp:w("lamp"),knot:w("knot"),tree:w("tree"),elm:w("elm"),deer:w("deer"),rook:w("rook"),rook2:w("rook2"),heron:w("heron"),mist:w("mist"),smoke:w("smoke"),lake:w("lake"),reed:w("reed"),ray:w("ray"),birds:w("birds"),flank:w("flank"),flame:w("flame"),far:w("far"),pass:w("pass"),flag:w("flag"),cedar:w("cedar")},x=I.makeNoise(I.hashSeed("bbb-outside-ground:"+e.seed)),S=e.vary||{},y=e.quality?.detail??1,d=S.density??1,m=q.hour??S.hour,i=_a[m]?m:"dawn",v=_a[i],z=v.az+s.look.range(-10,10),b=s.look.range(0,1),M=s.look.chance(.25),W=s.look.range(0,1),L=!!S.rare&&i!=="night",G=new f.Group;G.name="bells-outside";const O=I.makePath(rs),o={rng:s.sky,preset:v.preset,sunElevation:v.el,sunAzimuth:z,lightElevationMin:7,...v.sky};i==="dawn"&&(o.scatterColor=L?"#ff6a48":Pe(new f.Color("#ffae62").lerp(new f.Color("#ff8a6a"),W)),L&&(o.sunColor="#ff5a3a",o.horizon="#f0a090")),i==="night"&&(o.bake=!0,o.renderer=e.renderer);const r=ss(o);G.add(r.object),await e.yield();const p=r.lightDirection.clone().normalize(),n=new f.Vector2(r.keyDirection.x,r.keyDirection.z).normalize(),u=new f.Color(L&&i==="dawn"?"#ff9a6a":v.sun),l=3.6,g=new f.Color().setRGB(v.skyL[0]*Math.PI/l,v.skyL[1]*Math.PI/l,v.skyL[2]*Math.PI/l),R=new f.Color().setRGB(v.gndL[0]*Math.PI/l,v.gndL[1]*Math.PI/l,v.gndL[2]*Math.PI/l),A=new f.HemisphereLight(g,R,l),D=new f.DirectionalLight(u,v.sunK);D.position.copy(p).multiplyScalar(600),D.target.position.set(0,0,0),G.add(A,D,D.target);const C=v.fog[0],T=N(v.fog[1],v.fog[1]*.62,b),$=r.fogColor.clone().lerp(new f.Color(v.mist),.35),H={sunDir:[p.x,p.y,p.z],sunColor:Pe(u),horizon:Pe(r.horizonColor),zenith:Pe(r.zenithColor),fogColor:Pe($),fogNear:C,fogFar:T},K={value:0},se=.26,ie=.6,re=(t,a)=>{const h=r.colorAt(new f.Vector3(t,.06,a).normalize(),new f.Color).add(r.colorAt(new f.Vector3(t,.2,a).normalize(),new f.Color));return h.multiplyScalar(.5).lerp($,ie).multiplyScalar(se),{value:new f.Vector3(h.r,h.g,h.b)}},ae={uLowS:re(0,1),uLowE:re(1,0),uLowN:re(0,-1),uLowW:re(-1,0),uSunDir:{value:p},uSunCol:{value:new f.Vector3(u.r,u.g,u.b).multiplyScalar(v.sunK/Math.PI)},uSkyCol:{value:new f.Vector3(...v.skyL)},uGndCol:{value:new f.Vector3(...v.gndL)},uWarm:{value:new f.Vector3(...he("#ff9a4a",.8*v.lit+.12))},uTime:K,uFlick:{value:new f.Vector4(s.flame()*60,s.flame()*60,s.flame()*60,s.flame()*60)}},le=i==="day"?1:2.6,xe=us(),Se=[],{ranks:Ye,stacks:Be,par:Te,crowns:ve,staff:ue}=ws(xe,Se),we=xe.count;await e.yield(),gs(xe,s.knot),await e.yield();const Me=xe.build(),je=new f.ShaderMaterial({uniforms:{...te.fogUniforms(),...ae,uLampGain:{value:le},uFlick2:{value:new f.Vector2(s.pass()*60,s.pass()*60)}},vertexShader:xs,fragmentShader:bs,fog:!0}),ut=new f.Mesh(Me,je);ut.name="house",ut.frustumCulled=!1,G.add(ut);let Z=xe.count;await e.yield();const Le=Se.length,tt=new Float32Array(Le*12),oe=new Float32Array(Le*12),ne=new Float32Array(Le*8),ke=new Float32Array(Le*16),fe=new Float32Array(Le*16),Ae=[];let Ne=0;for(let t=0;t<Le;t++){const a=Se[t],h=s.win(),c=s.win(),_=s.win(),E=s.win(),j=a.over?.12:E;let P=0,V=0;a.st===0?P=.85+.3*_:a.st===1?(V=h<.04?1:0,P=!V&&c<.94*v.lit?.55+.45*_:0):a.st===2?(V=h<.5?1:0,P=!V&&c<.64*v.lit?.45+.45*_:0):(V=h<(a.dark?.3:.9)?1:0,P=!V&&!a.dark&&Ne<2&&c<.3*v.lit?.5+.3*_:0,P&&Ne++),a.over&&(V=0,P=1);const U=-a.tz,J=a.tx,Q=.07,ge=[[0,a.y0],[a.w,a.y0],[a.w,a.y1],[0,a.y1]],ce=[0,0,1,0,1,1,0,1];for(let ee=0;ee<4;ee++)tt.set([a.x+a.tx*ge[ee][0]+U*Q,ge[ee][1],a.z+a.tz*ge[ee][0]+J*Q],t*12+ee*3),oe.set([U,0,J],t*12+ee*3),ne.set([ce[ee*2],ce[ee*2+1]],t*8+ee*2),ke.set([a.st,j,a.s,a.w],t*16+ee*4),fe.set([a.y1-a.y0,P,V,a.make],t*16+ee*4);Ae.push(t*4,t*4+1,t*4+2,t*4,t*4+2,t*4+3)}const Fe=new f.BufferGeometry;Fe.setAttribute("position",new f.BufferAttribute(tt,3)),Fe.setAttribute("normal",new f.BufferAttribute(oe,3)),Fe.setAttribute("uv",new f.BufferAttribute(ne,2)),Fe.setAttribute("aA",new f.BufferAttribute(ke,4)),Fe.setAttribute("aB",new f.BufferAttribute(fe,4)),Fe.setIndex(Ae);const ot=[];for(let t=0;t<6;t++)ot.push(new f.Vector4(-9,0,0,0));const Oe=r.colorAt(new f.Vector3(0,.12,1).normalize()).clone().multiplyScalar(.32),Ve=r.colorAt(new f.Vector3(0,.75,.66).normalize()).clone().multiplyScalar(.36),St=new f.ShaderMaterial({uniforms:{...te.fogUniforms(),...ae,uLamp:{value:ot},uGlassLo:{value:new f.Vector3(Oe.r,Oe.g,Oe.b)},uGlassHi:{value:new f.Vector3(Ve.r,Ve.g,Ve.b)},uShutter:{value:new f.Vector3(...he("#e6dcc4",.72))},uLampCol:{value:new f.Vector3(...he("#ffab58"))},uFireCol:{value:new f.Vector3(...he("#ff8a3c"))},uHdr:{value:v.hdr}},vertexShader:Ms,fragmentShader:ks,fog:!0}),Qt=new f.Mesh(Fe,St);Qt.name="windows",Qt.frustumCulled=!1,G.add(Qt),Z+=Le*2,await e.yield();const qo=new Uint8Array(Ke.w*Ke.h*4);for(let t=0;t<Ke.h;t+=32)zs(qo,t,t+32),await e.yield();const Ue=new f.DataTexture(qo,Ke.w,Ke.h,f.RGBAFormat,f.UnsignedByteType);Ue.wrapS=f.RepeatWrapping,Ue.wrapT=f.ClampToEdgeWrapping,Ue.magFilter=f.LinearFilter,Ue.minFilter=f.LinearMipmapLinearFilter,Ue.generateMipmaps=!0,Ue.anisotropy=4,Ue.needsUpdate=!0;const eo=[],Do=[],Bo=[],Lt=[],jo=(t,a,h,c,_,E,j,P)=>{const V=Math.hypot(h-t,c-a),U=-(c-a)/V,J=(h-t)/V,Q=eo.length/3;eo.push(t,_,a,h,_,c,h,E,c,t,E,a);for(let ge=0;ge<4;ge++)Do.push(U,0,J);Bo.push(j,0,P,0,P,1,j,1),Lt.push(Q,Q+1,Q+2,Q,Q+2,Q+3)};for(const[t,a,h,c,_,E]of Te){const j=E||Math.round(Math.hypot(h-t,c-a)/Ke.len);jo(t,a,h,c,_,_+lt,j>=1?0:.5,j>=1?j:1)}for(const[t,a]of ve)for(let h=0;h<8;h++){const c=h/8*6.2832+.3927,_=(h+1)/8*6.2832+.3927;jo(t+Math.cos(_)*2.3,a+Math.sin(_)*2.3,t+Math.cos(c)*2.3,a+Math.sin(c)*2.3,Zt,Zt+1.5,.5,1)}const ft=new f.BufferGeometry;ft.setAttribute("position",new f.Float32BufferAttribute(eo,3)),ft.setAttribute("normal",new f.Float32BufferAttribute(Do,3)),ft.setAttribute("uv",new f.Float32BufferAttribute(Bo,2)),ft.setIndex(Lt);const Ra=new f.ShaderMaterial({uniforms:{...te.fogUniforms(),...ae,uMap:{value:Ue}},vertexShader:Cs,fragmentShader:Gs,fog:!0,transparent:!0,depthWrite:!1,side:f.DoubleSide}),Ft=new f.Mesh(ft,Ra);Ft.name="parapet",Ft.frustumCulled=!1,Ft.renderOrder=1,G.add(Ft),Z+=Lt.length/3,await e.yield();const Xe=14,zt=6,No=[],Oo=[],Ct=[],Gt=Math.hypot(et[0],et[1]),Vo=ht-.5-4.5;for(let t=0;t<=zt;t++)for(let a=0;a<=Xe;a++)No.push(a/Xe,t/zt),Oo.push(ue[0]+et[0]/Gt*7*(a/Xe),Vo+4.5*(t/zt),ue[1]+et[1]/Gt*7*(a/Xe));for(let t=0;t<zt;t++)for(let a=0;a<Xe;a++){const h=t*(Xe+1)+a,c=h+Xe+1;Ct.push(h,h+1,c+1,h,c+1,c)}const Wt=new f.BufferGeometry;Wt.setAttribute("position",new f.Float32BufferAttribute(Oo,3)),Wt.setAttribute("aFlag",new f.Float32BufferAttribute(No,2)),Wt.setIndex(Ct);const Ta=new f.ShaderMaterial({uniforms:{...te.fogUniforms(),...ae,uFlagCol:{value:new f.Vector3(...he("#a01624"))},uFlagA:{value:new f.Vector4(s.flag.range(4.6,6),s.flag.range(8.5,11),s.flag()*6.2832,s.flag()*6.2832)},uFlagAt:{value:new f.Vector3(ue[0],Vo,ue[1])},uFlagWind:{value:new f.Vector2(et[0]/Gt,et[1]/Gt)}},vertexShader:Ws,fragmentShader:_s,fog:!0,side:f.DoubleSide}),to=new f.Mesh(Wt,Ta);to.name="flag",to.frustumCulled=!1,G.add(to),Z+=Ct.length/3,await e.yield();const Uo=Ye.filter(t=>t.walked&&t.s1-t.s0>12),_t=[];for(const t of[1,1,1,2,2,3]){const a=Uo[s.lamp.int(0,Uo.length-1)],h=a.s1-a.s0,c=[];let _=0,E=a.s0;const j=U=>{const J=Math.abs(U-E)/4;J>.001&&(c.push([_,_+J,E,U]),_+=J,E=U)},P=U=>{c.push([_,_+U,E,E]),_+=U},V=[];for(let U=0,J=s.lamp.int(1,3);U<J;U++)V.push([a.s0+h*s.lamp.range(.08,.92),s.lamp.range(2,5)]);V.sort((U,J)=>U[0]-J[0]);for(const[U,J]of V)j(U),P(J);j(a.s1),P(s.lamp.range(1,2.5));for(const[U,J]of V.slice().reverse())j(U),P(J*.7);j(a.s0),P(s.lamp.range(1,2.5)),_t.push({st:t,seg:c,period:_,phase:s.lamp()*_})}const Ea=(t,a)=>{const h=(a+t.phase)%t.period;for(const c of t.seg)if(h<=c[1])return c[2]+(c[3]-c[2])*k(0,1,(h-c[0])/Math.max(.001,c[1]-c[0]));return t.seg[0][2]},oo=(t,a)=>Math.cbrt(Math.abs((t-ye.x)/ye.rx)**3+Math.abs((a-ye.z)/ye.rz)**3)+.12*x.n2(t*.017,a*.017)+.05*x.n2(t*.06+9,a*.06);let ao=hs;for(let t=0;t<30&&oo(Sa,ao)<1.3;t++)ao-=1.5;const ze=[Sa,ao],Ce=(t,a)=>{const h=Math.max(Math.abs(t)-52,a-50,We-8-a,0);let c=(1.7*x.fbm2(t*.0058+3.1,a*.0058-7.7,3)-.5*k(40,200,h))*k(0,70,h);const _=oo(t,a);return c=N(c,Ee+.35,k(1.5,1.08,_)),c=N(c,Ee-3.4,k(1.06,.62,_)),N(c,Math.max(c,.45),k(26,9,Math.hypot(t-ze[0],a-ze[1])))},Io=(t,a,h,c,_)=>{const E=[];for(let P=h;P<=c+1e-6;P+=_)E.push(P);let j=_;for(let P=h-j*1.3;P>t;)E.unshift(P),j*=1.3,P-=j;E.unshift(t),j=_;for(let P=c+j*1.3;P<a;)E.push(P),j*=1.3,P+=j;return E.push(a),E},$e=Io(-1500,1500,-150,270,7),dt=Io(-1500,1500,-90,270,7),Rt=new Float32Array($e.length*dt.length*3),so=[];for(let t=0,a=0;t<dt.length;t++)for(let h=0;h<$e.length;h++,a++)Rt[a*3]=$e[h],Rt[a*3+1]=Ce($e[h],dt[t]),Rt[a*3+2]=dt[t];await e.yield();for(let t=0;t<dt.length-1;t++)for(let a=0;a<$e.length-1;a++){const h=t*$e.length+a,c=h+$e.length;so.push(h,c,h+1,h+1,c,c+1)}const Tt=new f.BufferGeometry;Tt.setAttribute("position",new f.BufferAttribute(Rt,3)),Tt.setIndex(so),Tt.computeVertexNormals();let no=1e9,ro=-1e9,io=-1e9;for(const[t,a]of[[-Qe,We-pe],[Qe,We-pe],[-Qe,pe],[Qe,pe]]){const h=-t*n.y+a*n.x,c=t*n.x+a*n.y;no=Math.min(no,h),ro=Math.max(ro,h),io=Math.max(io,c)}const Pa=M?"#94906a":"#7c9a76",qa=new f.ShaderMaterial({uniforms:{...te.fogUniforms(),...ae,uLawn:{value:new f.Vector3(...he(Pa,1.2))},uLawnDry:{value:new f.Vector3(...he(M?"#a89a6a":"#98a680",1.2))},uGravel:{value:new f.Vector3(...he("#cdbf9f",1.16))},uLavender:{value:new f.Vector3(...he("#8a80b4",.7))},uSoil:{value:new f.Vector3(...he("#5a4a3c",.8))},uFrost:{value:new f.Vector3(...he("#dfe8f2",.8))},uFrostK:{value:L?.62:0},uLampCol:{value:new f.Vector3(...he("#ffb866"))},uMistCol:{value:new f.Vector3(...he(v.mist,.5))},uMistK:{value:.62+.3*b},uSunXZ:{value:n},uShadow:{value:new f.Vector3(no,ro,io)},uGraze:{value:v.graze},uLampGain:{value:le},uLakeY:{value:Ee}},vertexShader:As,fragmentShader:Ss,fog:!0}),lo=new f.Mesh(Tt,qa);lo.name="ground",lo.frustumCulled=!1,G.add(lo),Z+=so.length/3,await e.yield();const co=[],Ho=[],ho=[],uo=$.clone().lerp(new f.Color("#8fa3b4"),.5),Da=new f.Color(M?"#6f6a62":"#4f6a70").lerp($,.25),Ba=Math.atan2(n.x,-n.y),ja=new f.Color(M?"#5a4c40":"#34504c").lerp($,.15);for(const[t,a,h,c]of[[640,62,1.7,0],[470,38,5.3,0],[410,27,9.1,1],[345,21,13.7,1]]){const _=c?360:180,E=co.length/3,j=c?ja:Da;for(let P=0;P<=_;P++){const V=P/_*6.2832,U=Math.sin(V)*t,J=-Math.cos(V)*t;let Q=Math.abs(V-Ba);Q>Math.PI&&(Q=6.2832-Q);const ge=.3+.7*k(.35,1.5,Q);let ce=a*ge*(.55+.5*x.fbm2(Math.sin(V)*2.2+h,Math.cos(V)*2.2,3)+.1*x.n2(V*40,h));if(c&&(ce=(ce*.6+7*Math.abs(Math.sin(V*60+h*3)))*k(-.12,.1,x.fbm2(Math.sin(V)*5+h,Math.cos(V)*5,2))*k(.2,.8,Q)),co.push(U,-6,J,U,Math.max(c?-6:4,ce),J),Ho.push(uo.r,uo.g,uo.b,j.r,j.g,j.b),P<_){const ee=E+P*2;ho.push(ee,ee+1,ee+2,ee+2,ee+1,ee+3)}}}const Et=new f.BufferGeometry;Et.setAttribute("position",new f.Float32BufferAttribute(co,3)),Et.setAttribute("color",new f.Float32BufferAttribute(Ho,3)),Et.setIndex(ho);const fo=new f.Mesh(Et,new f.MeshBasicMaterial({vertexColors:!0,fog:!0,side:f.DoubleSide}));fo.name="ridge",fo.frustumCulled=!1,G.add(fo),Z+=ho.length/3,await e.yield();const mo=ns.makeLake({rng:s.lake,light:r,sky:r,level:Ee,center:[ye.x,ye.z],width:ye.rx*2.9,depth:ye.rz*2.9,depthAt:(t,a)=>Ee-Ce(t,a),segments:64,ripple:2,rippleScale:.8,glitter:3,shoreFoam:.25,foamWidth:1.5,deep:"#31506e",shallow:"#7f9aa6",band:{color:"#3a4c50",top:"#8a94a0",height:.06,amount:.6}});mo.object.name="lake",G.add(mo.object),Z+=4096*2,await e.yield();const Ko={wind:me.makeWind({direction:et,strength:.8,speed:.8}),backlight:1.1,backlightTint:M?"#ffc070":"#ffe7a0",ambient:2.4,leafAmbient:2.6};await me.prepareLeafTexture(Ko,e.yield);const po=me.windMaterial(Ko);await e.yield();const Ze=M?[{leaf:"#b8742c",leafLight:"#e0a040",leafDark:"#6a3c1c"},{leaf:"#c98a2e",leafLight:"#f0c050",leafDark:"#7a4a1c"},{leaf:"#a85a26",leafLight:"#d88a3a",leafDark:"#5a2c16"}]:[{leaf:"#3f6f3c",leafLight:"#6f9a52",leafDark:"#1f3a2a"},{leaf:"#4c7c40",leafLight:"#86ad5c",leafDark:"#24402c"},{leaf:"#35603a",leafLight:"#5f8a4c",leafDark:"#1b3428"}],at=60,mt=(t,a)=>O.nearestXZ(t,a).dist,Ie=[],st=[],Yo=M?"#b8a040":"#7f9f58",Xo=M?"#9a8a4a":"#6a8a4a";Ie.push(me.oakGeometry({rng:s.tree,height:21,detail:1,...Ze[0]})),await e.yield(),Ie.push(me.oakGeometry({rng:s.tree,height:24,detail:1,fullness:1.2,...Ze[1]})),await e.yield(),Ie.push(me.oakGeometry({rng:s.tree,height:18,detail:1,fullness:.9,...Ze[2]})),await e.yield(),Ie.push(me.oakGeometry({rng:s.elm,height:34,detail:0,fullness:.8,...Ze[2]})),await e.yield(),Ie.push(me.willowGeometry({rng:s.reed,height:15,detail:1,leaf:Yo})),await e.yield(),st.push(me.oakGeometry({rng:s.far,height:21,detail:0,...Ze[0]})),st.push(me.oakGeometry({rng:s.far,height:24,detail:0,fullness:1.2,...Ze[1]})),st.push(me.oakGeometry({rng:s.far,height:18,detail:0,fullness:.9,...Ze[2]})),await e.yield(),st.push(Ie[3],me.willowGeometry({rng:s.far,height:15,detail:0,leaf:Yo}));const Na=me.reedGeometry({rng:s.far,blades:6,cattails:1,leaf:Xo});await e.yield();const $o=t=>{const a=t.attributes.position;let h=0;for(let c=0;c<a.count;c++)h=Math.max(h,Math.hypot(a.getX(c),a.getZ(c)));return h},vo=Ie.map($o),Zo=st.map($o),Jo=[21,24,18,34,15],Pt=[],Qo=2.5,ea=.05,ta=.15,Oa=8,wo=Qe+8;for(let t=60;t<O.length;t+=Qo){const a=O.pointAt(t/O.length);if(a.z<Oa)break;Pt.push([a.x,a.y,a.z])}const oa=(t,a,h,c,_,E)=>(_-h)*(a-c)-(E-c)*(t-h),qt=r.sunDirection,Dt=new f.Vector2(qt.x,qt.z).normalize(),aa=Math.asin(F(qt.y/Math.max(qt.length(),1e-6),-1,1)),go=r.options.sunSize*Math.PI/180,Va=(t,a,h)=>{for(const c of Pt)if(a>-5&&a<c[2]&&oa(t,a,c[0],c[2],-wo-h,0)>0&&oa(t,a,wo+h,0,c[0],c[2])>0)return!0;return!1},sa=(t,a,h,c)=>{const _=c*(1+ta/2),E=h+Math.SQRT2*ea*_+Qo/2;for(const j of Pt){const P=t-j[0],V=a-j[2],U=Math.hypot(P,V);if(U<=E)return!0;const J=Math.acos(F((P*Dt.x+V*Dt.y)/U,-1,1)),Q=_-j[1];if(J<Math.asin(E/U)+go&&Math.atan2(Q,Q>0?U-E:U+E)>aa-go)return!0}return!1},na=(t,a,h,c)=>{const _=mt(t,a),E=(_>at?Zo:vo)[h]*c;return _<17.5+E||oo(t,a)<1.2||Math.abs(t)<wo+E&&a<52+E&&a>We-pe-8-E||Math.hypot(t-Jt[0],a-Jt[1])<24+E||Math.hypot(t-ze[0],a-ze[1])<30+E?!1:!Va(t,a,E+6)&&!sa(t,a,E,Jo[h]*c)},yo=[],pt=[],xo={approach:36,park:40,full:24},ra=d*(.8+.2*y);let bo=0,Mo=0,ko=0,ia=0;const Bt=(t,a,h,c,_)=>{const E=mt(t,a);yo.push({x:t,y:Ce(t,a),z:a,s:c,rot:_,v:h,d:E,u:0}),E<=at&&ko++},la=(t,a)=>ko>=xo.full&&mt(t,a)<=at;for(let t=0,a=Math.round(11*ra);t<a;t++){const h=s.tree()<.5?-1:1,c=s.tree(),_=s.tree(),E=s.tree.int(3,7),j=[];for(let Q=0;Q<7;Q++)j.push([s.tree(),s.tree(),s.tree(),s.tree(),s.tree()]);const P=74+190*c*c,U=Aa[0]-(P-Aa[2])*.7002+h*(34+150*_*_);let J=0;for(let Q=0;Q<E;Q++){const ge=j[Q],ce=ge[0]*6.2832,ee=6+20*Math.sqrt(ge[1]),gt=Math.floor(ge[2]*3),yt=.82+.4*ge[3],it=U+Math.cos(ce)*ee,Je=P+Math.sin(ce)*ee*.8;bo>=xo.approach||Je<70||la(it,Je)||!na(it,Je,gt,yt)||(Bt(it,Je,gt,yt,ge[4]*6.2832),bo++,J++)}J&&pt.push([U,P])}const ca=pt.length,Ao=[0,(_e.z0+_e.z1)/2],So=270,Ua=So-35,Ia=52,Ha=30,Ka=t=>{let a=0;for(;a<300&&Ce(ye.x+Math.sin(t)*a,ye.z-Math.cos(t)*a)<Ee+.25;)a+=1.5;return a};for(let t=0,a=Math.round(Ha*ra);t<a;t++){const h=s.flank()*6.2832,c=s.flank(),_=3+Math.floor(s.flank()*3),E=[];for(let ce=0;ce<5;ce++)E.push([s.flank(),s.flank(),s.flank(),s.flank(),s.flank()]);const j=t%5>=3,P=j?[ye.x,ye.z]:Ao,V=j?Ka(h)+20+25*c:Ua*Math.sqrt(c),U=P[0]+Math.sin(h)*V,J=P[1]-Math.cos(h)*V;let Q=!1,ge=0;for(const ce of pt)Math.hypot(U-ce[0],J-ce[1])<Ia&&(Q=!0);for(let ce=0;ce<_;ce++){const ee=E[ce],gt=ee[0]*6.2832,yt=5+15*Math.sqrt(ee[1]),it=Math.floor(ee[2]*3),Je=.9+.4*ee[3],_o=U+Math.cos(gt)*yt,Ro=J+Math.sin(gt)*yt*.8;Q||Mo>=xo.park||la(_o,Ro)||!na(_o,Ro,it,Je)||(Bt(_o,Ro,it,Je,ee[4]*6.2832),Mo++,ge++)}ge&&pt.push([U,J])}const Ya=pt.length-ca,ha=52*Math.PI/180,nt=[Math.sin(ha),-Math.cos(ha)],ua=[Ao[0]+nt[0]*So,Ao[1]+nt[1]*So],fa=[-nt[1],nt[0]];for(let t=0,a=0,h=0;t<22;t++){const c=[s.elm(),s.elm(),s.elm(),s.elm(),s.elm()];if(h>0){h--;continue}if(a>=4||a>=2&&c[4]<.45){a=0,h=c[0]<.5?0:1;continue}a++;const _=(t-10.5)*15+(c[0]-.5)*7,E=(c[1]-.5)*30,j=ua[0]+fa[0]*_+nt[0]*E,P=ua[1]+fa[1]*_+nt[1]*E,V=.9+.35*c[2];sa(j,P,vo[3]*V,Jo[3]*V)||(Bt(j,P,3,V,c[3]*6.2832),ia++)}const Lo=t=>{let a=ye.x;for(;a>-40&&Ce(a,t)<Ee+.25;)a-=1.5;return a};for(const t of[ye.z-34+s.reed.range(-8,8),ye.z+30+s.reed.range(-8,8)]){const a=Lo(t)-4;Bt(a,t,4,s.reed.range(1.25,1.6),s.reed()*6.2832)}await e.yield();const rt=new f.Vector3(n.x,.9,n.y).normalize(),jt=me.makeScatter({rng:s.tree,points:yo,variants:Ie,farVariants:st,farDistance:at,material:po,heightAt:Ce,tint:.2,hue:.05,stretch:ta,tilt:ea,sink:.01,groundShadow:{sunDir:[rt.x,rt.y,rt.z],strength:.42,color:"#22304a",size:1.25}});jt.object.name="trees",G.add(jt.object),Z+=jt.triangles,await e.yield();const Nt=ys(s.cedar);await e.yield();const Ot=me.makeScatter({rng:s.cedar,points:[{x:ze[0],y:Ce(ze[0],ze[1]),z:ze[1],s:1,rot:0,v:0,d:mt(ze[0],ze[1]),u:0}],variants:[Nt],material:po,heightAt:Ce,tint:0,hue:0,stretch:0,tilt:0,sink:0,groundShadow:{sunDir:[rt.x,rt.y,rt.z],strength:.42,color:"#22304a",size:1.25}});Ot.object.name="cedar",G.add(Ot.object),Z+=Ot.triangles,await e.yield();const da=[];for(let t=0,a=Math.round(16*d);t<a;t++){const h=ye.z-85+170*(t+s.reed())/a,c=Lo(h)+1.2,_=s.reed.int(4,8);for(let E=0;E<8;E++){const j=s.reed.range(-.5,3.2),P=s.reed.range(-3.5,3.5),V=s.reed.range(1.5,2.3),U=s.reed()*6.2832;E<_&&da.push({x:c+j,y:Math.max(Ce(c+j,h+P),Ee-.35),z:h+P,s:V,rot:U,v:0,d:mt(c+j,h+P),u:0})}}const Vt=me.makeScatter({rng:s.reed,points:da,variants:[me.reedGeometry({rng:s.reed,leaf:Xo})],farVariants:[Na],farDistance:at,material:po,tint:.15,sink:0});Vt.object.name="reeds",G.add(Vt.object),Z+=Vt.triangles,await e.yield();const Ut={sunDir:[p.x,p.y,p.z],sunColor:Pe(u),sunIntensity:v.sunK,sky:Pe(g),skyIntensity:l,ground:Pe(R),groundIntensity:l},It=$t.makeHerd({rng:s.deer,species:"deer",count:Math.max(7,Math.round(11*d)),size:2.1,center:[Jt[0],0,Jt[1]],radius:15,heightAt:Ce,light:Ut,path:O,clear:25,maxSigma:3});It.object.name="deer",G.add(It.object),Z+=It.triangles||0,await e.yield();const ma=ye.z-6+s.heron.range(-14,14),Xa=Lo(ma)+3.2,Ht=$t.makeWaders({rng:s.heron,species:"heron",count:1,positions:[[Xa,Ee,ma]],level:Ee,size:2.3,light:Ut,heightAt:Ce});Ht.object.name="heron",G.add(Ht.object),Z+=Ht.triangles||0,await e.yield();const vt=await $t.makeFlockAsync({rng:s.rook,species:"crows",count:Math.max(30,Math.round(34*d)),size:2.2,center:[0,62.5,(_e.z0+_e.z1)/2],radius:62,wobble:.03,height:10,spread:[3,6,70],light:Ut,maxSigma:3,wander:[1,1.5,1,.5],keepClear:{path:O,dist:2.6,each:!0}},e.yield);vt.object.name="rooks",G.add(vt.object),Z+=vt.triangles||0,await e.yield();const wt=await $t.makeFlockAsync({rng:s.rook2,species:"crows",count:Math.round(9*d),size:1.9,center:[-150,46,30],radius:50,light:Ut,maxSigma:3,wander:[5,2,4,.5],keepClear:{path:O,dist:2.6,each:!0}},e.yield);wt.object.name="rooks2",G.add(wt.object),Z+=wt.triangles||0,await e.yield();const $a=(t,a)=>Ce(t,a)+16*(1-k(0,70,Math.max(Math.abs(t)-62,a-58,-95-a,0))),pa=new f.Color(v.mist).lerp($,.3),Kt=te.makeGroundFog({time:K,heightAt:$a,mode:"pool",center:[40,0,130],size:940,segments:36,layers:6,y:-2.6,height:6.5+4*b,color:pa,opacity:.07+.05*b,coverage:.42,scale:.007,wind:[-1.2,.5],sunDir:[p.x,p.y,p.z],sunColor:Pe(u),scatter:.7});Kt.object.name="groundfog",G.add(Kt.object),Z+=Kt.triangles,await e.yield();const Fo=te.makeMist({rng:s.mist,time:K,count:Math.round((64+40*b)*y),area:[600,2,278],center:[70,1.2,211],size:[14,28],color:pa,opacity:.11+.06*b,drift:[-2.2,0,.55],softness:1,ragged:.7});Fo.object.name="mist",G.add(Fo.object),Z+=140,await e.yield();const va=[],Za=Be.slice().sort((t,a)=>t.x-a.x);for(let t=0;t<4;t++){const a=Za[t],h=t<2,c=a.top,_=te.makeSmokeColumn({rng:s.smoke,time:K,position:[c[0],c[1]+.3,c[2]],height:h?s.smoke.range(30,38):s.smoke.range(18,24),radius:h?[.7,5.5]:[.2,1.6],size:h?[2.6,12]:[.8,3.6],count:Math.round((h?110:30)*(.7+.3*y)),color:h?"#807c9c":"#908cac",colorTop:"#dcae9e",shadowColor:"#454a74",ambient:"#363c62",opacity:h?.52:.32,softness:1,ragged:h?.8:.55,billow:h?.1:.06,frequency:1.2,rotSpeed:h?.45:.2,rate:h?.058:.05,wind:[-1,0,.22],bend:h?2.8:2.1,rim:1.5,scatter:1.1,sunDir:[p.x,p.y,p.z],sunColor:Pe(u)});_.object.name="smoke"+t,G.add(_.object),va.push(_),Z+=2*(h?110:30)}await e.yield();const Yt=[-n.x,-n.y],Xt=[-Yt[1],Yt[0]],zo=Xt[1]>0?1:-1,wa=14,ga=12,ya=40+wa+ga*1.6,Ja=(Xt[0]*zo>0?1:-1)*Qe,Co=te.makeGodRays({rng:s.ray,time:K,position:[Ja+n.x*80+Xt[0]*zo*ya,21,pe+n.y*80+Xt[1]*zo*ya],direction:[Yt[0],-.05,Yt[1]],radius:wa,count:Math.round(11*y),length:330,width:[4,ga],color:L?"#ff9a70":"#ffd9a0",intensity:i==="night"?.05:.2,falloff:1,fogAmount:.4});Co.object.name="shafts",G.add(Co.object),Z+=22,await e.yield();const Qa=(t,a)=>[a*(2.6+.8*Math.cos(t)),5.5+1.3*Math.sin(t),2+9*Math.sin(t)],xa=[],ba=[],Ma=[],es=[[1,s.birds.range(.95,1.35),s.birds()*6.2832],[-1,s.birds.range(.95,1.35),s.birds()*6.2832]],ts=[[0,0,.21,0],[-.045,0,-.21,0],[.045,0,-.21,0],[-.03,.01,.1,0],[-.03,.01,-.07,0],[-.31,.01,-.04,1],[.03,.01,.1,0],[.03,.01,-.07,0],[.31,.01,-.04,1]];for(const[t,a,h]of es){for(const c of ts)xa.push(c[0],c[1],c[2]),ba.push(t,a,h,c[3]);for(let c=0;c<6.2832;c+=.07)Ma.push(Qa(c,t))}const Go=new f.BufferGeometry;Go.setAttribute("position",new f.Float32BufferAttribute(xa,3)),Go.setAttribute("aBird",new f.Float32BufferAttribute(ba,4));const os=new f.ShaderMaterial({uniforms:{...te.fogUniforms(),...ae},vertexShader:Ls,fragmentShader:Fs,fog:!0,side:f.DoubleSide}),Wo=new f.Mesh(Go,os);Wo.name="archbirds",Wo.frustumCulled=!1,G.add(Wo),Z+=6;const as=[mo,jt,Ot,Vt,It,Ht,vt,wt,Kt,Fo,Co,...va];let ka=0;return Z=0,G.traverse(t=>{if(!t.geometry)return;const a=t.geometry,h=t.isInstancedMesh?t.count:a.isInstancedBufferGeometry?a.instanceCount:1;ka++,Z+=Math.floor((a.index?a.index.count:a.attributes.position.count)/3)*(Number.isFinite(h)?h:1)}),G.userData.count={trees:yo.map(t=>[t.x,t.z,(t.d>at?Zo:vo)[t.v]*t.s]),clumps:[ca,Ya],stand:[bo,Mo,ia,ko],kept:[vt.kept,wt.kept],birds:Ma,triangles:Z,house:[we,xe.count-we,Le*2,Lt.length/3,Ct.length/3],cedar:[ze[0],ze[1],Nt.userData.radius,Nt.userData.height,Nt.userData.triangles],disc:[Dt.x,Dt.y,aa,go],eyes:Pt},{object:G,lights:[A,D],lightBase:[l,v.sunK],env:H,anchors:{front:[0,30,_e.z0],door:[0,9.6,-11]},update(t,a,h){K.value=a,r.update(t,a,h);for(let c=0;c<_t.length;c++)ot[c].set(_t[c].st,Ea(_t[c],a),1,0);for(const c of as)c.update(t,a,h)},dispose(){r.dispose?.()},triangles:Z,drawCalls:ka}}export{qs as buildHero};
