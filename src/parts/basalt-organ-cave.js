import*as u from"three";import{makePath as rt,clamp as me,lerp as Z,smoothstep as lt}from"../kit/core.js";const ge=1.05,We=-8.5,Ze=36,ct=46,Ke=120,Be=65,Ce=-62,ue=new u.Vector3(0,3,-81),fe=new u.Vector3(0,Math.sin(68*Math.PI/180),-Math.cos(68*Math.PI/180)),Re=new u.Vector3(0,58.6,-103.5),Ve=2.3,ft=4.6,dt=3.2,$e=6.4,mt=5.2,et=[[3,1,110],[3,3,0],[4,1,-32],[2,-1,-54],[-5,-1.5,-50],[-5,-1.5,-38],[3,0,-33],[0,1.5,-58],[0,3,-81]],ut=["#12171B","#1FC8A0","#0E5560","#D98AA0","#C99A2E","#EEF6F2","#F26A1B"],X=lt,st=y=>y-Math.floor(y);function pt(y){const P=y.n2,O=a=>{let r=Z(8,6,X(-57,-63,a))+.45*P(a*.11+y.o1,3.7);return a<-80&&(r*=Math.sqrt(Math.max(0,1-((-80-a)/8.6)**2))),a>.5?8:r},D=a=>{const r=X(-27.5,-31.5,a)*(1-X(-58,-62.5,a));let M=Z(Z(8,6,X(-57,-63,a)),18,r)+.45*P(a*.11+y.o2,9.1);return a<-80&&(M*=Math.sqrt(Math.max(0,1-((-80-a)/8.6)**2))),a>.5?8:M},b=a=>24-1.2*X(-5,-25,a)+1.6*X(-28,-38,a)*(1-X(-52,-60,a))-7*X(-58,-70,a)+.7*P(a*.07+y.o3,1.3),C=(a,r)=>{if(r>.5||r<-88.6)return-1;const M=a>=0?O(r):D(r),H=Math.abs(a)/Math.max(M,.01);if(H>=1)return-1;const W=b(r),i=Math.min(13.9,W-8),g=Math.sqrt(Math.max(0,4-(H+1)*(H+1)))/1.7320508;return W-i+i*g},I=(a,r)=>ct+12.6*X(-38,-100,r)*Math.exp(-((a/75)**2)),w=(a,r)=>{const M=I(a,r),H=a-ue.x,W=M-ue.y,i=r-ue.z,g=fe.y*W+fe.z*i,z=Math.sqrt(Math.max(0,H*H+W*W+i*i-g*g));return 2.6*(1-X(6.3,10.5,z))},F=a=>6.3+2.7*(1-X(9,21,a)),L=(a,r,M)=>{const H=a,W=r-ue.y,i=M-ue.z,g=fe.y*W+fe.z*i;if(g<9)return!1;const z=H*H+W*W+i*i-g*g,A=F(g);return z<A*A},l=(a,r)=>(.03*P(a*.022+y.o4,r*.022)+.018*P(a*.06+y.o4,r*.06)+.008*P(a*.17,r*.17+y.o4))*X(9,26,Math.abs(a)+Math.max(0,-r-20)),o=(a,r)=>a+Math.sign(a)*Math.max(0,-r-8),c=a=>{const r=Math.abs(a);return X(8.5,10.5,r)*(1-X(20,25,r))},V=a=>{const r=Math.abs(a);return Math.max(X(25,29,r)*(1-X(39,44,r)),X(.02,.3,P(a*.05+y.o1,7.7))*X(42,48,r))},ee=a=>Math.max(c(a),(1-V(a))*X(.05,.35,P(a*.031+y.o3,4.1))*X(44,52,Math.abs(a))),s=a=>1-X(-38,-50,a),d=a=>ft*V(a)-2*c(a),R=(a,r)=>d(o(a,r))*s(r),S=(a,r)=>((Math.abs(a)/Ke)**6+(Math.abs(r-Ce)/Be)**6)**(1/6)+l(a,r),N=(a,r)=>S(a,r)+R(a,r-(Ce+Be))/66,n=a=>Ce+Be*Math.max(0,1-(Math.abs(a)/Ke)**6)**(1/6),T=n(0),t=(a,r)=>N(a,r+T)<1,v=(a,r,M)=>{const H=D(r);if(-a>H)return null;if(r>-29.5&&r<-12&&-a>H-2.5)return-3.4+1.9*M*X(-12,-17,r);if(r>-29.5||r<-60.5||a>-7.2)return null;const W=me((-7.2-a)/10.6,0,1),i=Math.min(X(-29.5,-33,r),1-X(-57,-60.5,r));let g=-3+7*Math.pow(W,.62);return g=Math.round(g/.5)*.5+(M-.5)*(g<-.2?.13:.36),g=Z(-3.4,g,.35+.65*i),me(g,-3.4,4.2)};let f=NaN,p=0,h=0,m=0,E=0,k=0,q=0;return{eastW:O,westW:D,apex:b,ceilAt:C,topAt:I,lipDip:w,roughAt:l,chimR:F,inChim:L,inFoot:t,foot:N,footS:S,uAt:o,towerAt:c,bayAt:V,notchAt:ee,frontK:s,faceBackU:d,faceBack:R,frontZ0:n,FRONT_SHIFT:T,stumpTop:v,floorAt:(a,r)=>{r!==f&&(f=r,p=1*X(-8,6,r)*(1-X(8,30,r))-2.5*X(14,40,r),r<3&&(h=O(r),m=Z(8,6,X(-57,-63,r))+.9,E=1-X(-60,-66,r)),k=X(-62,-78,r),q=Z(-3.2,-4,X(-60,-66,r)));let M=-6+.9*P(a*.06+y.o1,r*.05)+.25*P(a*.21,r*.19+y.o2);if(M+=p,r<3){const H=Math.min(h-a,m+a),W=X(5.2,.8,H);W!==0&&(M+=2.7*W*(.65+.35*P(r*.11+y.o3,a*.2))*E)}return k!==0&&(M+=k*(.5+.9*Math.abs(P(a*.33+y.o3,r*.33))+.5*Math.max(0,P(a*.7,r*.7+y.o1)))),me(M,-7.6,q)}}}function wt(y){const P=y.n2,O=(s,d,R)=>st(Math.sin(s*127.1+d*311.7+R*74.7+y.h0)*43758.5453123),D=new Map,b=(s,d)=>{const R=s*4096+d;let S=D.get(R);if(S)return S;const N=(s+.5*(d&1))*ge,n=d*ge*.8660254,T=.55*P(N*.035+y.o2,n*.035),t=.55*P(N*.035,n*.035+y.o3),v=O(s,d,1)*6.2831853,f=ge*.3*Math.sqrt(O(s,d,2));return S=[N+T+Math.cos(v)*f,n+t+Math.sin(v)*f],D.set(R,S),S},C=[[1,0],[-1,0],[0,1],[1,1],[0,-1],[1,-1]],I=[[1,0],[-1,0],[-1,1],[0,1],[-1,-1],[0,-1]],w=[[0,2],[0,-2],[2,1],[-1,1],[2,-1],[-1,-1]],F=[[0,2],[0,-2],[1,1],[-2,1],[1,-1],[-2,-1]],L=s=>s&1?C:I,l=s=>s&1?w:F,o=[],c=[],V=[];{const s=ge*1.6;for(let d=0;d<8;d++){const R=d*Math.PI/4;V.push(Math.cos(R)*s,Math.sin(R)*s)}}return{point:b,cell:(s,d,R=.028)=>{const S=b(s,d);let N=o,n=c;N.length=0;for(let m=0;m<16;m++)N.push(V[m]);const T=(m,E)=>{const k=b(s+m,d+E),q=k[0]-S[0],B=k[1]-S[1],a=(q*q+B*B)*.5;n.length=0;const r=N.length/2;for(let H=0;H<r;H++){const W=N[H*2],i=N[H*2+1],g=(H+1)%r,z=N[g*2],A=N[g*2+1],x=W*q+i*B-a,G=z*q+A*B-a;if(x<=0&&n.push(W,i),x<0&&G>0||x>0&&G<0){const U=x/(x-G);n.push(W+(z-W)*U,i+(A-i)*U)}}const M=N;N=n,n=M};{const m=L(d),E=l(d);for(let k=0;k<6;k++)T(m[k][0],m[k][1]);for(let k=0;k<6;k++)T(E[k][0],E[k][1])}let t=[];for(let m=0;m<N.length;m+=2)t.push([N[m],N[m+1]]);for(;t.length>7;){let m=0,E=1/0;for(let q=0;q<t.length;q++){const B=t[(q+1)%t.length],a=(B[0]-t[q][0])**2+(B[1]-t[q][1])**2;a<E&&(E=a,m=q)}const k=t[(m+1)%t.length];t[m]=[(t[m][0]+k[0])/2,(t[m][1]+k[1])/2],t.splice((m+1)%t.length,1)}for(let m=0;m<3&&t.length>5;m++){let E=-1,k=.14*.14;for(let B=0;B<t.length;B++){const a=t[(B+1)%t.length],r=(a[0]-t[B][0])**2+(a[1]-t[B][1])**2;r<k&&(k=r,E=B)}if(E<0)break;const q=t[(E+1)%t.length];t[E]=[(t[E][0]+q[0])/2,(t[E][1]+q[1])/2],t.splice((E+1)%t.length,1)}const v=t.length;let f=0,p=0;for(const m of t){const E=Math.hypot(m[0],m[1])||.001,k=Math.max(.2,1-R/E*1.15);m[0]*=k,m[1]*=k,f=Math.max(f,E*k),p+=E*k}const h=p/t.length;for(;t.length<7;)t.push([t[t.length-1][0],t[t.length-1][1]]);return{x:S[0],z:S[1],pts:t,sides:v,rmax:f,rmean:h}},hash:O,NB:L,NB2:l}}async function vt(y,P,O,D,b,C){const I=new Map,w=(n,T)=>{const t=n*4096+T;let v=I.get(t);if(v)return v;const f=O.point(n,T),p=f[0],h=f[1],m=P.foot(p,h+P.FRONT_SHIFT),E=O.hash(n,T,3),k=O.hash(n,T,4);if(m>=1){const z=(m-1)*66,A=mt*(1-X(-34,-44,h));if(z<A&&Math.abs(p)>9.4){const x=6.3-Math.floor(z/1.05+.6*k)*1.4-.9*E+.5*D.n2(p*.3+D.o2,h*.3);if(x>-.9)return v={out:!1,apron:!0,x:p,z:h,voids:[[x,1e3]],spans:[[We,x,!1,!0]],indoor:0,h:E,h2:k,stump:null,broken:!0,ceil:-1,dFace:0},I.set(t,v),v}return v={out:!0},I.set(t,v),v}const q=[];let B=0;const a=P.ceilAt(p,h);let r=null;if(a>0){r=P.stumpTop(p,h,E);const z=a+.15+1.9*E*E+(k<.07?-.9:0)+(k>.93?1.6:0);q.push([r===null?-1e3:r,z]),B=1}if(Math.abs(p)<11&&h<-66&&h>-116){const z=P.topAt(p,h);let A=1e9,x=-1e9;for(let G=-4;G<=z+.5;G+=.25)P.inChim(p,G,h)&&(G<A&&(A=G),x=G);x>A&&(q.push([A-.3*E,x+.25+.9*k*k]),B=Math.max(B,a>0?1:2))}let M=Ze+4,H=!1,W=0;if(Math.abs(p)<17&&h<-84)M=P.topAt(p,h)-P.lipDip(p,h)-.45;else if(a<0){const z=(1-m)*66;if(W=z,h>-50&&Math.abs(p)>9.5){const A=P.uAt(p,h),x=P.notchAt(A)*P.frontK(h),G=P.towerAt(A),U=Math.min(3,Math.floor(z/1.2)),K=Math.floor(A/3.1+1.1*D.n2(A*.11+D.o1,2.2)),Q=O.hash(K,77,6),J=31.5+2.6*D.n2(A*.045+D.o2,6.1)+4.6*(Q-.5)+x*(2+5*D.n2(A*.027+D.o4,8.8))+G*5.5+U*(1.1+1.5*E)+(k-.5)*1.4;z<3.6+dt*x+2*G&&(J<Ze+3.4||x>.25)&&(M=Math.min(J,47.5),H=!0),z<1.2&&k<.07&&(M=10+18*E,H=!0)}}H&&q.push([M,1e3]),q.sort((z,A)=>z[0]-A[0]);const i=[];let g=We;for(const z of q)z[0]>g+.3&&g<M&&i.push([g,Math.min(z[0],M),!1,!0]),g=Math.max(g,z[1]);g<M-.3&&i.push([g,M,i.length>0||g>We+.01,!1]);for(const z of i)z[0]>We+.01&&(z[2]=!0),H&&z[1]===M&&(z[3]=!0);return v={out:!1,x:p,z:h,voids:q,spans:i,indoor:B,h:E,h2:k,stump:r,broken:H,ceil:a,dFace:W},I.set(t,v),v},F=[],L=[],l=[],o=[],c={stumps:[],roofEnds:[],ledges:[],chimLedges:[],runoff:[],dropped:0,minClear:1e9},V=-Math.ceil(126/ge),ee=-V,s=-Math.ceil(134/(ge*.866)),d=Math.ceil(12/(ge*.866));let R=0,S=0;const N=(n,T,t)=>{const v=O.NB(T);let f=null;for(let p=0;p<t.spans.length;p++){const h=t.spans[p];let m=1e9,E=-1e9,k=!1,q=0,B=0,a=0;for(let _=0;_<6;_++){const $=v[_][0],ae=v[_][1],se=w(n+$,T+ae);if(se.out){if(t.z>-47.5){m=Math.min(m,h[0]),E=Math.max(E,h[1]),k=!0;const re=O.point(n+$,T+ae),ne=Math.hypot(re[0]-t.x,re[1]-t.z)||1;B+=(re[0]-t.x)/ne*(h[1]-h[0]),a+=(re[1]-t.z)/ne*(h[1]-h[0])}continue}for(const re of se.voids){const ne=Math.max(h[0],re[0]),he=Math.min(h[1],re[1]);if(he-ne>.06){m=Math.min(m,ne),E=Math.max(E,he),re[1]<900&&(q=Math.max(q,se.indoor));const le=Math.hypot(se.x-t.x,se.z-t.z)||1;B+=(se.x-t.x)/le*(he-ne),a+=(se.z-t.z)/le*(he-ne)}}}{const _=Math.hypot(B,a);_>.3?(B/=_,a/=_):(B=0,a=0)}if(h[3]&&(E=h[1],m=Math.min(m,h[1]-1.4)),h[2]&&(m=h[0],E=Math.max(E,h[0]+1.1)),m>E)continue;let r=Math.max(h[0],m-.7),M=Math.min(h[1],E+.7);k&&(r=h[0]),f||(f=O.cell(n,T));const H=f,W=h[2]&&!h[3];if(t.indoor||q||Math.abs(t.x-3)<14){let _=b.clearOf(t.x,t.z,H.rmax,r,M);if(_<Ve){if(h[3]&&!W)for(let $=0;$<40&&_<Ve&&M>r+.4;$++)M-=.25,_=b.clearOf(t.x,t.z,H.rmax,r,M);else if(W)for(let $=0;$<40&&_<Ve&&M>r+.4;$++)r+=.25,_=b.clearOf(t.x,t.z,H.rmax,r,M);if(_<Ve){c.dropped++;continue}}_<c.minClear&&(c.minClear=_)}S++;const i=b.planDist(t.x,t.z,.5*(r+M)),g=h[3]?t.h2<.62?1:2:0,z=h[2]?t.h<.5?1:2:0;let A=Math.max(t.indoor,q);k&&t.z>-.8&&(A=0),A===1&&.5*(r+M)>26&&t.z<-70&&(A=2);let x=6,G=6,U=0;if(!A){const _=P.uAt(t.x,t.z),$=P.frontK(t.z),ae=(1-P.footS(t.x,t.z+P.FRONT_SHIFT))*66;for(let se=1;se<=8;se++){const re=se*1.5,ne=ae-P.faceBackU(_+re)*$,he=ae-P.faceBackU(_-re)*$;ne>.9&&(x=Math.min(x,re/ne)),he>.9&&(G=Math.min(G,re/he))}{const se=P.notchAt(_)*$;U=Math.max(0,ae+1.9*(1-se)-($e+.4)*se)}}const K={ci:n,cj:T,x:t.x,z:t.z,y0:r,y1:M,P:H,seed:t.h*.97+.015,top:g,bot:z,indoor:A,joint:.4+.8*O.hash(n,T,5),rec:U,ox:B,oz:a,tE:x,tW:G},Q=t.stump!==null&&p===0,J=A||i<26&&t.dFace<2.6;W?(l.push(K),A===1&&t.ceil>0&&c.roofEnds.push([t.x,r,t.z])):Q?(o.push(K),c.stumps.push({x:t.x,y:M,z:t.z,r:H.rmean,i:n,j:T,P:H,cup:g===1})):t.apron?(i<22?o:L).push(K):h[3]&&M-r<9&&J?(o.push(K),A===2?c.chimLedges.push([t.x,M,t.z]):A||c.ledges.push([t.x,M,t.z])):J?(F.push(K),h[3]&&(A===2?c.chimLedges:c.ledges).push([t.x,M,t.z])):(L.push(K),h[3]&&c.ledges.push([t.x,M,t.z]))}};for(let n=d;n>=s;n--){const T=n*ge*.8660254;for(let t=V;t<=ee;t++){const v=(t+.5*(n&1))*ge;if(!(T>-53&&((Math.abs(v)/Ke)**6+(Math.abs(T+P.FRONT_SHIFT-Ce)/Be)**6)**(1/6)>.74)&&!(Math.abs(v)<23&&T<4&&T>-119))continue;const p=w(t,n);if(p.out){++R%120===0&&await y.yield();continue}++R%120===0&&await y.yield();const h=S;N(t,n,p),S>>4!==h>>4&&await y.yield()}}for(const n of c.stumps){let T=null,t=.45;const v=O.NB(n.j);for(const[f,p]of v){const h=w(n.i+f,n.j+p);if(h.out)continue;const m=h.stump===null?h.ceil>0?-9:99:h.stump,E=n.y-m;E>t&&(t=E,T=h)}if(T){const f=T.x-n.x,p=T.z-n.z,h=Math.hypot(f,p)||1;c.runoff.push({x:n.x+f/h*n.r*.86,z:n.z+p/h*n.r*.86,y:n.y,nx:f/h,nz:p/h,drop:Math.min(t,8),w:n.r})}}return{near:F,far:L,roof:l,stump:o,lists:c,cellInfo:w}}function gt(){const y=et.slice(0,8).map(f=>f.slice()),P=et[7],O=et[8],D=Re.y-O[1],b=Re.z-O[2],C=Math.hypot(D,b),I=Math.atan2(D,-b),w=.16296869251325385,F=-10.349116934544327*Math.PI/180,L=.12,l=.3,o=1.5,c=.15,V=4e3,ee=(I-F)/(w*(1-L)),s=ee/V,d=[];let R=O[1]-Math.sin(I)*c,S=O[2]+Math.cos(I)*c,N=I;for(let f=0;f<V;f++){const p=(f+.5)/V,h=w*Math.min(1,p/L,(1-p)/L),m=N-h*s*.5;R-=Math.sin(m)*s,S+=Math.cos(m)*s,N-=h*s,d.push([R,S])}const n=d[V-1],T=Math.hypot(n[0]-P[1],n[1]-P[2]),t=[],v=Math.max(4,Math.round(ee/l));for(let f=l*o,p=f;p<T-f*.8;f*=o,p+=f)t.push(p);for(const f of t.reverse())y.push([0,n[0]+(P[1]-n[0])*f/T,n[1]+(P[2]-n[1])*f/T]);for(let f=v;f>=1;f--){const p=d[Math.round(V*f/v)-1];y.push([0,p[0],p[1]])}y.push(O.slice());for(let f=l*o,p=f;p<C-f*.7;f=Math.min(f*o,16),p+=f)y.push([0,O[1]+D*p/C,O[2]+b*p/C]);return y.push([Re.x,Re.y,Re.z]),y}async function xt(y){const P=gt();await y.yield();const O=rt(P,{samples:64});await y.yield();const D=1400,b=new Float32Array(D+1),C=new Float32Array(D+1),I=new Float32Array(D+1),w=new u.Vector3;for(let s=0;s<=D;s++)O.pointAt(s/D,w),b[s]=w.x,C[s]=w.y,I[s]=w.z,s%350===349&&await y.yield();const F=16,L=Math.ceil((D+1)/F),l=new Float32Array(L*3),o=new Float32Array(L*3);let c=0;for(let s=0;s<L;s++){const d=s*3,R=s*F;l[d]=o[d]=b[R],l[d+1]=o[d+1]=C[R],l[d+2]=o[d+2]=I[R];for(let S=R+1,N=Math.min(D,R+F-1);S<=N;S++)b[S]<l[d]&&(l[d]=b[S]),b[S]>o[d]&&(o[d]=b[S]),C[S]<l[d+1]&&(l[d+1]=C[S]),C[S]>o[d+1]&&(o[d+1]=C[S]),I[S]<l[d+2]&&(l[d+2]=I[S]),I[S]>o[d+2]&&(o[d+2]=I[S])}return{path:O,pts:P,clearOf:(s,d,R,S,N)=>{let n=1e9,T=c;R=R*1.015+.035,S-=.15,N+=.1;for(let t=-1;t<L;t++){if(t===c)continue;const v=t<0?c:t,f=v*3;if(t>=0){const p=o[f+1]<S?S-o[f+1]:l[f+1]>N&&l[f+1]>=S?l[f+1]-N:0,h=s<l[f]?l[f]-s:s>o[f]?s-o[f]:0,m=d<l[f+2]?l[f+2]-d:d>o[f+2]?d-o[f+2]:0,E=Math.max(0,Math.sqrt(h*h+m*m)*.999999-R);if(E*E+p*p>=n)continue}for(let p=v*F,h=Math.min(D,p+F-1);p<=h;p++){const m=C[p]<S?S-C[p]:C[p]>N?C[p]-N:0;if(m*m>=n)continue;const E=Math.max(0,Math.hypot(b[p]-s,I[p]-d)-R),k=E*E+m*m;k<n&&(n=k,T=v)}}return c=T,Math.sqrt(n)},planDist:(s,d,R)=>{let S=1e9;for(let N=0;N<=D;N+=4){const n=(b[N]-s)**2+(I[N]-d)**2+.25*(C[N]-R)**2;n<S&&(S=n)}return Math.sqrt(S)}}}function je(y,P){const O=[],D=[],b=[],C=(w,F,L,l,o,c)=>(O.push(w,F,L),D.push(l,o,c),O.length/3-1);for(let w=0;w<y.length-1;w++){const[F,L]=y[w],[l,o]=y[w+1];for(let c=0;c<7;c++){const V=C(c,F,L,c,0,0),ee=C((c+1)%7,F,L,c,1,0),s=C(c,l,o,c,0,0),d=C((c+1)%7,l,o,c,1,0);b.push(V,s,d,V,d,ee)}}if(P==="cup"||P==="fan"){const w=[],F=[];for(let L=0;L<7;L++)w.push(C(L,3,0,L,0,1));if(P==="cup"){for(let l=0;l<7;l++)F.push(C(l,3,0,l,0,2));const L=C(0,3,0,0,0,3);for(let l=0;l<7;l++){const o=(l+1)%7;b.push(w[l],F[o],F[l],w[l],w[o],F[o]),b.push(L,F[l],F[o])}for(let l=b.length-63;l<b.length;l+=3){const o=b[l+1];b[l+1]=b[l+2],b[l+2]=o}}else{const L=C(0,3,0,0,0,3);for(let l=0;l<7;l++)b.push(L,w[(l+1)%7],w[l])}}if(P==="under"){const w=[],F=[];for(let l=0;l<7;l++)w.push(C(l,-1,0,l,0,4));for(let l=0;l<7;l++)F.push(C(l,-1,0,l,0,5));const L=C(0,-1,0,0,0,6);for(let l=0;l<7;l++){const o=(l+1)%7;b.push(w[l],F[o],F[l],w[l],w[o],F[o]),b.push(L,F[l],F[o])}}const I=new u.InstancedBufferGeometry;return I.setAttribute("position",new u.Float32BufferAttribute(O,3)),I.setAttribute("aSide",new u.Float32BufferAttribute(D,3)),I.setIndex(b),I}function bt(y,P){const O=P.length,D=new Float32Array(O*4),b=new Float32Array(O*4),C=[0,1,2,3].map(()=>new Float32Array(O*4)),I=new Float32Array(O*4);for(let w=0;w<O;w++){const F=P[w],L=F.P.pts;D.set([F.x,F.z,F.y0,F.y1],w*4),b.set([F.seed,F.top+4*F.bot,F.indoor,F.joint],w*4),C[0].set([L[0][0],L[0][1],L[1][0],L[1][1]],w*4),C[1].set([L[2][0],L[2][1],L[3][0],L[3][1]],w*4),C[2].set([L[4][0],L[4][1],L[5][0],L[5][1]],w*4),C[3].set([L[6][0],L[6][1],F.P.rmean,F.rec||0],w*4),I.set([F.ox||0,F.oz||0,F.tE??6,F.tW??6],w*4)}y.setAttribute("iA",new u.InstancedBufferAttribute(D,4)),y.setAttribute("iB",new u.InstancedBufferAttribute(b,4));for(let w=0;w<4;w++)y.setAttribute("iC"+w,new u.InstancedBufferAttribute(C[w],4));y.setAttribute("iD",new u.InstancedBufferAttribute(I,4));{const w=new Float32Array(O*4).fill(-1e3);for(let F=0;F<O;F++)w[F*4+3]=0;y.setAttribute("iF0",new u.InstancedBufferAttribute(new Float32Array(O*4).fill(-1e3),4)),y.setAttribute("iF1",new u.InstancedBufferAttribute(w,4))}return y.instanceCount=O,y}async function yt(y,P,O,D,b,C,I){const w=(d,R)=>Math.round(d*64)*65536+Math.round(R*64),F=new Set;for(const d of I)F.add(w(d[0],d[2]));const L=(d,R,S)=>st(Math.sin(d*12.9898+R*78.233+S*37.719)*43758.5453),l=new Float64Array(12),o=new Float64Array(12),c=new Float64Array(12),V=[D.NB(0).concat(D.NB2(0)),D.NB(1).concat(D.NB2(1))];let ee=0,s=0;for(const[,d,R]of C){const S=d.getAttribute("iF0").array,N=d.getAttribute("iF1").array;for(let n=0;n<R.length;n++){const T=R[n];if(T.indoor)continue;const t=X(-60,-50,T.z);if(t===0)continue;if(T.ci!==void 0&&Math.max(X(16,22,Math.abs(T.x-3)),X(13,16,Math.abs(T.x)))>0){const m=V[T.cj&1];for(let k=0;k<12;k++){const q=D.point(T.ci+m[k][0],T.cj+m[k][1]);l[k]=q[0]-T.x,o[k]=q[1]-T.z,c[k]=2e3}(++s&255)===0&&await y.yield();for(let k=0;k<12;k++){const q=b.cellInfo(T.ci+m[k][0],T.cj+m[k][1]);let B=1e3;if(q.out)B=-1e3;else for(const a of q.voids)a[1]>900&&(B=a[0]);c[k]=B}const E=T.P.pts;for(let k=0;k<7;k++){const q=E[k],B=E[(k+1)%7],a=B[0]-q[0],r=B[1]-q[1],M=Math.hypot(a,r);let H=-1e3;if(M>1e-4){let W=r/M,i=-a/M;W*(q[0]+B[0])+i*(q[1]+B[1])<0&&(W=-W,i=-i);const g=W*(q[0]+B[0])+i*(q[1]+B[1])+.03,z=W*g,A=i*g;let x=0,G=1e9;for(let U=0;U<12;U++){const K=(z-l[U])*(z-l[U])+(A-o[U])*(A-o[U]);K<G&&(G=K,x=U)}if(H=c[x],G>.01)for(let U=.25;U<.8;U+=.25){const K=q[0]+a*U+W*.32,Q=q[1]+r*U+i*.32;x=0,G=1e9;for(let J=0;J<12;J++){const _=(K-l[J])*(K-l[J])+(Q-o[J])*(Q-o[J]);_<G&&(G=_,x=J)}H=Math.max(H,c[x])}}k<4?S[n*4+k]=H:N[n*4+k-4]=H}}if(!(T.ox||T.oz))continue;const v=X(16,22,Math.abs(T.x-3))*t;if(v===0||F.has(w(T.x,T.z)))continue;const f=L(T.x,T.z,1),p=P.uAt(T.x,T.z),h=Math.floor(p/3.1+1.1*O.n2(p*.11+O.o1,2.2));N[n*4+3]=me((L(h,7,4)-.5)*.6+(f-.55)*.55,-.5,.4)*v,ee++}}return ee}const kt=`
// (a vector that can be zero is never handed to normalize, nor a base that rounding can take under zero to pow)
vec3 nrm(vec3 v){ return v*inversesqrt(max(dot(v, v), 1e-12)); }
float h11(float p){ p = fract(p*.1031); p *= p+33.33; p *= p+p; return fract(p); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1.,0.)), f.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), f.x), f.y); }
float fbm2(vec2 p){ return .5*vn(p)+.25*vn(p*2.03+7.1)+.125*vn(p*4.01+3.3)+.0625*vn(p*8.07+1.7); }
// one tap of the caustic tile (stored as a square root); lod picks its smaller copies
float causTap(vec2 uv, float lod){ float c = textureLod(uCaus, uv, lod).r; return c*c; }
// the water's own colour where it is deep: the emerald with its red and blue drunk out
vec3 slab(){ return uGlowCol*mix(vec3(1.), uGlowCol/1.3, .5); }
// THE LAMP: the water's own glow, by how open the place is (1 over the pale sand in mid nave: the emerald itself; 0 in
// the shadow close under a wall: deep green)
vec3 lampBody(float open){ return mix(slab()*.17+uDeep*.03, uGlowCol*.6, open); }
// the lamp's strength down the cave: the daylight that came in by the mouth and back off the sand dies toward the deep back
float glowZ(float z){ return uGlowAmt*mix(.42, 1., smoothstep(-88., -50., z)); }
// the sky as a clear-sky gradient (used only while uSeaK is 1; the part leaves it 0 and mirrors its own sky colour)
vec3 seaSky(vec3 d){ float inv = max(1.-clamp(d.y, 0., 1.), 1e-4);
  vec3 c = mix(uSeaZen, uSeaMid, pow(inv, max(uSeaP.x, .01))); c = mix(c, uSeaHor, pow(inv, max(uSeaP.y, .01)));
  float sc = pow(max(.5+.5*dot(d, uSeaScatDir), 1e-4), max(uSeaP.w, .01))*mix(uSeaQ.x, 1., pow(inv, max(uSeaQ.y, .01)));
  return mix(c, uSeaScat, clamp(sc*uSeaP.z, 0., 1.)); }
vec3 vnd(vec2 p){ vec2 i = floor(p), f = fract(p), u = f*f*(3.-2.*f), du = 6.*f*(1.-f);
  float a = h21(i), b = h21(i+vec2(1., 0.)), c = h21(i+vec2(0., 1.)), d = h21(i+vec2(1., 1.)), k = a-b-c+d;
  return vec3(a+(b-a)*u.x+(c-a)*u.y+k*u.x*u.y, du*(vec2(b-a, c-a)+k*u.yx)); }
// what a pixel covers of the water, metres (the root of its area)
float seaFw(vec2 q){ vec2 d = fwidth(q); return max(sqrt(d.x*d.y), .35*(d.x+d.y)); }
// THE SWELL: long low backs from the open sea running onto the cliff (it faces south), 24 m and 13 m from crest to crest,
// 0.6 m from trough to crest in slack air, twice that in a gale. Returns (height, slope along x, slope along z)
vec3 seaSwell(vec2 q, float t){
  float am = mix(1., 2., smoothstep(.45, 1., uWind));
  float a1 = (q.y+.22*q.x)*.262+t*1.05+5.*vn(q*vec2(.021, .013)+3.), a2 = (q.y-.45*q.x)*.48+t*1.45+4.*vn(q*vec2(.03, .02)+11.);
  return am*vec3(.2*sin(a1)+.1*sin(a2), .0115*cos(a1)-.0216*cos(a2), .0524*cos(a1)+.048*cos(a2)); }
// metres (roughly) from a place on the sea to the nearest rock standing in it: the headland's foot, or one of the two stacks
float seaShore(vec2 q){
  float ex = q.x/120., ez = (q.y+65.)/65.; ex *= ex; ez *= ez;
  float d = (pow(ex*ex*ex+ez*ez*ez+1e-9, 1./6.)-1.)*66.-4.2;
  return min(d, min(length(q-vec2(63., 46.)), length(q-vec2(-57., 60.)))-3.5); }
// THE CLIFF AS THE SEA MIRRORS IT, by the mirrored PLACE on its face (xc across it, yc up it; L: metres from the water
// to it; fw: metres of the face one pixel's mirror covers): as bright as the cliff's own south face under this look's sun
// and sky (gold-bronze under a low sun in the south, slate by day, a grey loom through fog); pipes 1.05 m wide, each
// its own tone, a dark joint between two; broad lights and darks for the bundles and bays; the wet dark foot; the mouth
// a dark slot with the emerald low in it
vec3 cliffFace(float xc, float yc, float L, float fw){
  // (no pipe is ruled: its edges wander up its length, its width is its own, and it is built of drums of uneven tone)
  float keep = 1.-smoothstep(.2, .75, fw), wob = vn(vec2(xc*.45, yc*.16))-.5;
  float c = xc/1.05+.3*sin(xc*.7)+.55*wob*keep, id = floor(c), f = fract(c);
  float tone = mix(.82, .5+.62*h11(id*7.3+2.), keep)*mix(.86, .42+.58*smoothstep(0., .13, min(f, 1.-f)), keep);
  tone *= mix(1., .7+.6*vn(vec2(id*1.7, yc*.3)), keep);
  // (and the pipes stand in bundles of four or five, each bundle its own tone, a dark gap between two: these last when a
  // single pipe has melted)
  float cb = xc/4.6+.6*sin(xc*.19)+.2*wob, fb = fract(cb);
  tone *= mix(1., (.5+.85*h11(floor(cb)*3.7+5.))*(.4+.6*smoothstep(0., .13, min(fb, 1.-fb))), 1.-smoothstep(.9, 3.6, fw));
  float bay = smoothstep(.2, .42, vn(vec2(xc*.07, 3.))+.25*(1.-smoothstep(9., 26., abs(xc))));      // (towers by the mouth, bays and buttresses beyond: a quarter of the face is bay)
  // (up the face: the wet dark foot, the pipes' ragged heads, and over them the cap's brow in its own shade)
  tone *= (.5+.5*smoothstep(.3, 5., yc))*(1.-.6*smoothstep(32., 37., yc+5.*(vn(vec2(xc*.21, 7.))-.5)));
  float lowS = 1.-smoothstep(.2, .55, uSunDir.y), nl = max(uSunDir.z, 0.);
  vec3 sunG = uSunCol*mix(vec3(1.), uSunCol/max(max(uSunCol.r, uSunCol.g), max(uSunCol.b, 1e-3)), .7);
  vec3 lit = uBasalt*(uSunCol*nl*.62+uSkyCol*.75)+sunG*(lowS*nl*nl*.17), shade = uBasalt*uSkyCol*.45+uDeep*.004;
  vec3 col = mix(shade, lit, .12+.88*bay)*tone;
  // THE MOUTH IN THE WATER IS THE CAVE SEEN IN THE WATER: dark green-black, the emerald of the sill and of the lit walls
  // low in it, a little lighter up its jambs; its outline is soft and ragged (the jambs are broken pipes, and the dark
  // of the cave has no edge)
  float hw = 8.*(1.-.8*smoothstep(8., 24., yc)), mw = 1.5+.6*fw+.06*L, rag = (vn(vec2(xc*.8, yc*.21))-.5)*2.2+(vn(vec2(xc*2.7, yc*.6)+5.)-.5)*.9;
  float mouth = (1.-smoothstep(hw-mw, hw+mw, abs(xc)+rag))*(1.-smoothstep(18., 26., yc+2.*rag));
  vec3 cave = slab()*uGlowAmt*(.03+.15*exp(-max(yc, 0.)/4.5))*(.75+.5*smoothstep(.45, 1., abs(xc)/max(hw, 1.)))+uDeep*.012;
  col = mix(col, cave, mouth);
  return mix(col, uAirCol, 1.-exp(-uAirDen*uAirDen*L*L)); }
// THE SEA'S FACE. q: place (x, z); V: unit vector to the eye; fw: what a pixel covers of the water (seaFw); body: the
// water's own colour; sw: the water's own height and slopes there. uWind (setWind): 0 slack air .. 1 a gale.
// Chop and facets in five sizes (0.12 to 3.3 m) run before the wind (it blows onto the cliff), long-crested and low in
// slack air, short, steep and quick in a gale; what a pixel cannot hold of them becomes roughness (al). THE MIRROR is the
// true grazing law, 2% head-on: looking down at thirty degrees one sees the body, only toward the horizon the sky. Where
// the mirrored line meets the cliff's face (z = 0) under its ragged top it shows THE CLIFF (cliffFace: drawn out by the
// facets into long upright streaks that wobble and break), over that the sky, the haze low down; the sun in sparks, a
// path of dashes under a low sun. The swell has a body: a back lets more of the water's own light up than a trough, and
// its slopes turn the mirror up the cliff and down it. In a gale a little white is torn off the crests (white, 0..1)
vec3 seaFace(vec2 q, vec3 V, float fw, float t, vec3 body, vec3 sw, out float white){
  const vec2 WD = vec2(.3162, -.9487), WC = vec2(.9487, .3162);
  float w = uWind, f = .3, lost = 0., lostC = 0., hgt = sw.x*.22;
  vec2 p = vec2(dot(q, WC)*mix(.4, .85, w), dot(q, WD)), sl = sw.yz, slC = vec2(0.), slF = vec2(0.);      // (slC: the two large sizes of chop; slF: the three small: the facets)
  for(int i = 0; i < 5; i++){
    float a = i < 2 ? mix(.045, .1, w)*(1.+.4*float(i)) : mix(.07, .2, w)*(1.-.22*float(i-2)), k = 1.-smoothstep(.22, .8, fw*f);
    vec3 n = vnd(p*f+vec2(float(i)*17.3, -t*mix(.4, 1.7, w)*sqrt(f)));
    vec2 ds = (WC*(n.y*.5)+WD*n.z)*(a*k); float dl = a*a*.3*(1.-k*k);
    if(i < 2){ slC += ds; lostC += dl; } else slF += ds;
    lost += dl; hgt += (n.x-.5)*a*k; f *= i == 1 ? 2.533 : (i == 0 ? 2.5 : 2.1); }
  sl += slC+slF;
  vec3 N = nrm(vec3(-sl.x, 1., -sl.y));
  float al = sqrt(lost), fz = 1.-clamp(dot(N, V)+al*.6, 0., 1.), F = .02+.98*pow(fz, 5.);
  vec3 R = reflect(-V, N); R.y = abs(R.y)+al*.5+1e-3;
  // (where the mirrored line meets the cliff's face: the headland's front, z = 0, 240 m wide, 30 to 46 m tall)
  float tc = max(q.y, 0.)/max(-R.z, 1e-3), yc = tc*R.y, xc = q.x+R.x*tc;
  float rock = step(R.z, -1e-3)*step(0., q.y)*(1.-smoothstep(30., 46., yc+5.*vn(vec2(xc*.3, 1.))))*(1.-smoothstep(90., 126., abs(xc)));
  vec3 sky = mix(mix(uAirCol*.55+uSkyCol*.35, uSkyCol*1.15, smoothstep(0., .3, R.y)), seaSky(R), uSeaK);
  // (the cliff's image is drawn out UPRIGHT: a facet throws the mirrored place far up and down the face, but the pipes are
  // upright and all alike along their length, so their image keeps its place across the face, wobbling by a part of what
  // the facet turns it: long streaks that sway and break, never a scramble)
  // THE MIRROR IS BROKEN BY THE SEA. Under a cliff nearly every flat facet mirrors the cliff; the sky comes into the
  // water by the facets TURNED UP TOWARD THE EYE (they throw the mirrored line up over the brow): of the facets in view a
  // share that grows with the share of the sky standing open over the brow from that place (a third to a half some thirty
  // metres out, few at the cliff's foot), more of them where a cat's-paw ruffles the water, fewer in the glassy lanes
  // between. They are the SMALL facets (half a metre and under) while a pixel can hold those; as they melt, the faces of
  // the larger chop that look at the eye carry the same share; and when those melt too it is an even share. The swell's
  // face toward the eye carries a little more of them than its back. They show the sky over the brow, not the cliff
  float m1 = mix(.045, .1, w), m2 = mix(.07, .2, w), vF = .576*m2*m2, vC = .888*m1*m1;      // (the spread of the small and the large slopes)
  vec2 Vh = V.xz*inversesqrt(max(dot(V.xz, V.xz), 1e-6));
  float dq = max(q.y, .5), bias = clamp(-dot(sw.yz, Vh)*4., -.3, .3);
  // (a cat's-paw is long down the wind: lanes some ten metres wide and longer than that, drifting with it)
  float ruf = smoothstep(.3, .7, vn(p*vec2(.2, .07)+vec2(5., -t*.035))*.75+vn(p*vec2(.06, .021)+vec2(1., -t*.012))*.25);
  float fS = min(clamp(1.05*(1.-.6366*atan(30./dq)), 0., .42)*(.55+.75*ruf), .5);
  float th = 1.1*(1.-2.*fS)-bias;
  float skyF = mix(smoothstep(th-.2, th+.2, -dot(slF, Vh)*inversesqrt(vF)),
    mix(smoothstep(th-.45, th+.45, -dot(slC, Vh)*inversesqrt(vC)), fS, clamp(lostC/vC, 0., 1.)), clamp((lost-lostC)/vF, 0., 1.));
  vec3 Ru = nrm(vec3(R.x, max(R.y, 44./dq*max(-R.z, .05)), R.z));
  vec3 skyU = mix(uSkyCol*1.15, seaSky(Ru), uSeaK);
  // (the streaks sway little in a glassy lane, are thrown about where the water is ruffled: torn into runs, not combed)
  // (and no two bundles of pipes sway alike)
  float t0 = min(max(q.y, 0.)/max(V.z, 1e-3), 400.), xe = q.x-V.x*t0;
  float xs = xe+clamp(R.x*tc+V.x*t0, -30., 30.)*mix(.12, .5, ruf)*(.45+1.1*h11(floor(xe/3.7+.4*sin(xe*.31))*5.1+1.));
  // (and away from the cliff's foot the swell's own chop tears them: a streak is thrown aside by the water it lies on, a
  // metre and more, differently every few metres of its length: runs and breaks, no stripe ruled down the water)
  xs += (vn(vec2(xe*.21, q.y*.42-t*.45)+3.)+.5*vn(vec2(xe*.5, q.y*1.1-t*.8)+9.)-.75)*4.2*mix(.45, 1., ruf)*smoothstep(3., 14., q.y);
  vec3 env = mix(sky, mix(cliffFace(xs, yc, tc, fw+al*tc*.12), skyU, skyF), rock);
  float e = 2./(.0067+lost);
  // (THE CLIFF STANDS ON THE WATER: where the mirror shows the cliff it is given more than the grazing law allows the sky
  // (the law's fifth power eased to its third), so that the lit cliff is seen in the water from a little above too, as an
  // eye sees it on dark water under a bright wall. This is the order's bar, not the true law, and it is by what is mirrored.
  // A facet that shows the sky keeps the true law: turned toward the eye, it lets the water's own dark colour up)
  F = mix(F, .02+.98*fz*fz*fz, rock*(1.-skyF));
  vec3 col = mix(body*(1.+2.2*hgt), env, F)+uSunCol*min(F*.01*e*pow(max(dot(N, nrm(uSunDir+V)), 0.), e), .8);      // (a crest lets a little more of the body's light up)
  // (white: where a gust lies, thin crest lines a hand to a forearm wide and a metre or two long, torn into dashes.
  // Orders 14, 16 and 17: on a gale deal seaLook takes this white out seaward of the band before the sill and lays
  // breaking crests there; at the sill and behind it this white stands whole)
  float gust = vn(p*vec2(.2, .5)+vec2(3., -t*.7)), n1 = vn(p*vec2(.45, .3)+vec2(9., -t*.39)), rdg = (.5+.5*cos(6.2832*(p.y*.7+.9*n1-t*.9)))*smoothstep(.4, .6, n1), tear = vn(p*vec2(2.3, 6.)+vec2(0., -t*2.));
  white = smoothstep(.55, 1., w)*smoothstep(.55, .8, gust)*smoothstep(.87, .97, rdg)*smoothstep(.3, .6, tear)*(1.-smoothstep(.1, .35, fw))*.85;
  return col; }
// THE WHOLE LOOK OF OPEN WATER at q (linear light, before the air). Over seaFace: THE EMERALD FROM THE SILL, a tongue of
// the cave's lit water reaching out from the mouth, brightest at the sill, dead by 19 m (in the body, and a little of it
// up through the mirror); a gale's torn white; and froth close to rock (within 9 m of the plinth and the stacks; no
// threads or flecks on open water); grey-white, under 0.8, lit by the sky and warmed by a low sun. (Order 12, by place,
// away from the mouth's own ground: the white water at the columns' feet and foam lace in fields; orders 14, 16 and
// 17: on the open water a gale's breaking crests in the stead of its rows of dashes, the two meeting by place in the
// band before the sill: see the end of seaLook)
vec3 seaLook(vec2 q, vec3 V, float fw, float t, vec3 sw){
  float tg = (1.-smoothstep(0., 19., q.y))*(1.-smoothstep(4., 8.5+.35*max(q.y, 0.), abs(q.x)))*step(-1., q.y); tg *= tg;
  // (NO RULED EDGE where the cave's water meets the sea: the emerald RUNS OUT IN TONGUES AND LACE: lanes of it a few
  // metres wide, wavering with the flow out of the mouth, torn along their length, some reaching nearly 40 m, the dark
  // sea lying in between them; so the green is on both sides of any crest that stands before the mouth)
  // (a tongue WAVERS as it runs out, thins, pales and breaks into islands: near the sill nearly all the water is green
  // with dark holes in it, far out only a few pale patches are left: never a straight ray, never a ribbon)
  float ty = max(q.y, 0.), reach = 1.-smoothstep(3., 36., ty);
  float txw = q.x+(1.6*sin(q.y*.19+t*.07)+1.1*sin(q.y*.47+1.7-t*.05)+(vn(vec2(q.y*.31-t*.06, 3.))-.5)*2.4)*smoothstep(1., 10., ty);
  float tl = vn(vec2(txw*.3, q.y*.1-t*.02)+2.)*.65+vn(vec2(txw*.8+3., q.y*.3-t*.05)+5.)*.35, tb = vn(vec2(txw*1.3+t*.05, q.y*.7-t*.09)+7.);
  float lane = smoothstep(.66-.36*reach, .84-.3*reach, tl)*(.3+.7*smoothstep(.3, .6, tb))*reach*(.4+.6*reach)
    *(1.-smoothstep(4.5, 8.5+.22*ty, abs(txw)))*step(-1., q.y);
  tg = max(tg, .7*lane);
  vec3 em = lampBody(.6)*glowZ(0.);
  // (the sill's water has depth: clouds of the lamp's light in it, darker in the hollows; and where the sun lies on it
  // the sun's own caustic lines, fine and bright, melting to their mean as a pixel grows)
  // (ORDER 11: no fine caustic LINES on the sea's tongue: seen flat across the water they were long pale curved hairs.
  // The sun's light in it is a soft dapple, a metre across, melting to its mean as a pixel grows)
  float mo = fbm2(q*.37+vec2(.03, -.06)*t+3.);
  float cn = mix(.5, 2.*smoothstep(.4, .8, vn(q*1.1+vec2(.05, -.08)*t+1.))*vn(q*2.7-vec2(.07, .04)*t+6.), 1.-smoothstep(.3, 1.2, fw));
  vec3 sunL = uSunCol*vec3(.1, .5, .3)*(.05*cn*smoothstep(-.05, .1, uSunDir.z)*smoothstep(0., .1, uSunDir.y));
  float white; vec3 col = seaFace(q, V, fw, t, mix(uSeaBody, em*(.3+1.05*mo)+sunL, tg), sw, white)+em*(tg*.16);
  vec3 fl = min(uFoamCol*.75*(uSkyCol*.7+uSunCol*(.16+.2*(1.-smoothstep(.2, .55, uSunDir.y)))), vec3(.8));
  // (ORDERS 16 TO 18: ON A GALE DEAL (the wind as handed over 0.55: a16 over 0) THE SEA'S OWN ROWS OF DASHES GO OUT
  // BY PLACE, SEAWARD: whole on the cave's own strip of water and at the sill, as they ever were (m16 is 0 there, the
  // branch is not taken and white is the one it was, to the bit); thinner across the band before the sill (m16: by
  // the water's place alone, its measure from that strip: 0 on it, 1 from 11 m off: see the end of seaLook); none
  // seaward of the band, where the breaking crests are the sea's white. On every other deal m16 is 0 on all the water.
  // THE STRIP runs from the sill's line, z = 0, a hundred metres back, 11.5 m to a side. THE MEASURE is the length
  // of (the distance outside 8 m to a side, times a factor; the distance before the sill, or behind the strip's far
  // end). The factor is exactly 0 beside the strip's whole length out to 11.5 m (both its smoothsteps are 0 there):
  // so on the strip the length is 0 and m16 is 0, not a small number. It is exactly 1 from a metre off either end
  // of the strip on, and from 18 m out: there the measure is the old one, the distance from the 8 m strip, to the
  // bit. Between, it is continuous with no step. Why 11.5 m and 18 m: at the head)
  float a16 = smoothstep(.55, 1., uWind);
  float m16 = a16 > 0. ? smoothstep(0., 11., length(vec2(max(abs(q.x)-8., 0.)*(1.-(1.-smoothstep(0., 1., max(q.y, 0.)+max(-100.-q.y, 0.)))*(1.-smoothstep(11.5, 18., abs(q.x)))), max(q.y, 0.)+max(-100.-q.y, 0.)))) : 0.;
  if(m16 > 0.) white *= 1.-m16;
  col = mix(col, fl, white);
  // (in the mouth's own slot the nearest rock is a jamb, not the headland's foot: the water of the sill is open water,
  // and its white hugs the jambs: no milk lies over the swell there)
  float sd = max(seaShore(q), min(7.8-abs(q.x), 6.)), near = 1.-smoothstep(5., 44., sd), close = 1.-smoothstep(.5, 9., sd);
  vec2 lq = q+vec2(.11, -.27)*t+sw.yz*9.+(vec2(vn(q*.21+t*.05), vn(q*.21+7.-t*.04))-.5)*4.;
  lq = vec2(lq.x*.7+lq.y*.08, lq.y);                                           // (drawn out a little along the swell's crests)
  // (ORDER 11: NO THREADS AND NO FLECKS ON THE OPEN SEA: the long threads swept across the near water like stray hairs,
  // and clots in their place lay on it like scraps of paper. The sea's white is the froth close to rock (within 9 m of
  // the plinth and the stacks) and the gale's torn crests; open water is clean)

  float froth = close*smoothstep(.45, .8, vn(lq*.9)+.4*close-.25)*.5;
  float lace = clamp(froth, 0., 1.)*.8;
  // (in the mouth's slot the sea's lace gives way to the cave's own white: there the water glows, and lace under the
  // sky's light alone would lie dark on it)
  lace *= 1.-(1.-smoothstep(-2., 9., q.y))*(1.-smoothstep(6.5, 8.5, abs(q.x)));
  // ORDER 12, BY PLACE ALONE (g12a, g12w: 0 on the mouth's own water: the wedge before the mouth that opens southward
  // from its jambs, by 0.38 m a metre at its widest, which holds all the water that lies in sight from inside the
  // cave; these grounds begin 5 m and more outside it and open by 0.42 and 0.5 m a metre; and
  // (order 13) 0 on all the water north of z = -60, as the new look on the rock is. Where they are 0 the branch below is not
  // taken and the look is the one it was, to the bit):
  // THE WHITE WATER AT THE COLUMNS' FEET, east and west of the mouth's own ground: a broken band at the rock's foot (the
  // plinth's, the stacks') that WORKS BY THE SWELL'S OWN CLOCK: as the water handed in stands high at the rock (sw.x, the
  // sea's own height there) the white reaches 5 m out, in a trough it falls back to a metre and breaks up; it lies on
  // the water, so it rides at the water's edge wherever the sea stands.
  // AND FOAM LACE (ORDER 13: BROKEN LACE, NO NET): where foam lies (dn: fields drawn out along the crests, most of the
  // water between them clear, more of them toward the plinth's surf, fewer and smaller toward the line where the
  // mouth's view begins: it thins out over 34 m and does not end on a line) it is TORN FOAM: ragged scraps a hand to
  // three metres across, no two alike (one field of five sizes, cut at a height that rises toward a field's edge so
  // that the foam breaks up there instead of fading), full of open holes of unlike size; LONG STREAKS, a hand to two
  // hands wide and metres long, lying along one family of bearings, each of its own width from place to place, broken
  // into pieces of unlike length, ragged, holed; and thin STRANDS that leave the torn foam and end. Streaks and
  // strands are the level lines of a noise drawn out along a bearing. No tile, no cell, no mesh. It drifts on the
  // water (fq: its place wanders gently; the water's slopes are not read for it: they smeared it into blades). As a
  // pixel grows past a size of it that size melts to its mean (an edge is a pixel wide by the slope the field still
  // has), and far off a field is a faint veil of its own shape. IN A GALE the open water carries the sea's own torn
  // white and this lace stays out there (by the wind as handed, uWind); the foam beside the plinth stays, thinner.
  // Under 0.8
  float zp12 = max(q.y, 0.), g12s = smoothstep(-60., -50., q.y), g12w = smoothstep(13.+.42*zp12, 19.+.42*zp12, -q.x)*g12s, g12a = max(g12w, smoothstep(22.+.5*zp12, 28.+.5*zp12, q.x)*g12s);
  if(g12a > 0.){
    float sdr = seaShore(q), am12 = mix(1., 2., smoothstep(.45, 1., uWind)), srg = smoothstep(-.18, .26, sw.x/am12);
    vec2 fq = q+vec2(.13, -.31)*t+(vec2(vn(q*.17+t*.04), vn(q*.17+7.-t*.035))-.5)*1.8;
    float fine = 1.-smoothstep(.3, 1.2, fw);
    float n1 = mix(.5, vn(fq*.55+3.)*.6+vn(fq*1.6+9.)*.4, fine);
    float rch = 1.+4.2*srg+2.*(vn(q*.3+vec2(0., t*.1))-.5), band = 1.-smoothstep(rch-1.6, rch+.8, sdr);
    float w1 = band*smoothstep(.62-.55*band, .86-.45*band, n1+.2*srg);
    float fld = vn(fq*vec2(.07, .13)+7.)*.6+vn(fq*vec2(.23, .41)+2.)*.4+.08*(srg-.5);
    float nearK = 1.-smoothstep(3., 24., sdr), thin = smoothstep(13.+.42*zp12, 47.+.42*zp12, -q.x), calm = 1.-smoothstep(.5, .9, uWind);
    float c0 = .47+.22*(1.-thin)-.1*nearK, opn = g12w*(1.-smoothstep(38., 52., q.y))*calm, shr = nearK*(1.-smoothstep(20., 30., sdr))*g12a*mix(.6, 1., calm);
    float dn = max(smoothstep(c0, c0+.2, fld)*opn, smoothstep(c0-.04, c0+.16, fld)*shr);
    float dnS = max(smoothstep(c0-.1, c0+.1, fld)*opn, smoothstep(c0-.14, c0+.06, fld)*shr);      // (streaks reach a little past the torn foam)
    float l12 = 0.;
    if(dnS > 0.){
      // (lv4, lv5, lh: how much of each size is still alive at this footprint)
      vec4 lv4 = 1.-smoothstep(.2, .6, fw*vec4(.55, 1.35, 3.3, 8.9)); float lv5 = 1.-smoothstep(.2, .6, fw*23.);
      vec3 lh = 1.-smoothstep(.2, .6, fw*vec3(2.4, 5.6, 13.));
      vec2 vq = fq+(vec2(vn(fq*vec2(.31, .53)+11.), vn(fq*vec2(.29, .47)+23.))-.5)*vec2(.7, .6);
      // (torn: the place is pulled about by a finger to a hand, so no edge is a smooth curve and no hole an oval)
      vec2 wq = vq+(vec2(vn(vq*vec2(3.1, 3.7)+41.), vn(vq*vec2(3.3, 3.5)+57.))-.5)*(.1*(1.-smoothstep(.2, .6, fw*3.6)))
        +(vec2(vn(vq*vec2(9., 11.)+3.), vn(vq*vec2(10., 9.)+29.))-.5)*(.035*(1.-smoothstep(.2, .6, fw*10.5)));
      float pw = max(fw, .012), e = max(.012, .4*fw*(dot(lv4, vec4(.15, .3, .69, 1.6))+2.53*lv5));
      float pb = .5+(vn(wq*vec2(.4, .55)+3.)-.5)*.28*lv4.x+(vn(wq*vec2(1., 1.35)+8.)-.5)*.22*lv4.y+(vn(wq*vec2(2.6, 3.3)+1.)-.5)*.21*lv4.z
        +(vn(wq*vec2(7.3, 8.9)+6.)-.5)*.18*lv4.w+(vn(wq*vec2(19., 23.)+2.)-.5)*.11*lv5;
      float pt = .54+.16*(1.-dn)+.03*(1.-nearK), body = smoothstep(pt-e, pt+e, pb)*smoothstep(0., .08, dn), rim = smoothstep(pt-.1, pt-.02, pb);
      // (open holes: one field of three sizes, and pinholes)
      float hA = .5+(vn(wq*vec2(1.7, 2.4)+31.)-.5)*.35*lh.x+(vn(wq*vec2(4.3, 5.6)+17.)-.5)*.4*lh.y+(vn(wq*vec2(11., 13.)+4.)-.5)*.25*lh.z;
      float hS = smoothstep(.6-e, .7+e, .5+(vn(wq*vec2(17., 21.)+13.)-.5)*(1.-smoothstep(.2, .6, fw*21.)))*.8;
      float tornK = body*(1.-max(smoothstep(.47-e, .52+e, hA), hS));
      // (streaks, the first two, and strands, the last two and only in the rim round torn foam: the level line of a
      // noise drawn out along a bearing rc by kf; wd: its width here; each ends where the last noise breaks it)
      float stK = 0., sdK = 0., rgL = 1.-smoothstep(.2, .6, fw*7.3), rimK = rim*(1.-body)*smoothstep(.1, .5, dn);
      for(int i = 0; i < 4; i++){
        if(i > 1 && rimK <= 0.) break;
        vec2 rc = i == 0 ? vec2(.966, .259) : (i == 1 ? vec2(.891, .454) : (i == 2 ? vec2(1., 0.) : vec2(.94, .34)));
        vec2 kf = i == 0 ? vec2(.1, .5) : (i == 1 ? vec2(.17, .75) : (i == 2 ? vec2(1.3, 2.1) : vec2(2.9, 4.3)));
        float off = i == 0 ? 60. : (i == 1 ? 90. : (i == 2 ? 0. : 40.)), wL = i == 0 ? .2 : (i == 1 ? .11 : (i == 2 ? .03 : .018));
        vec2 uL = vec2(wq.x*rc.x-wq.y*rc.y, wq.x*rc.y+wq.y*rc.x)*kf+off;
        vec3 nd = vnd(uL); float gL = length(nd.yz*kf), dL = abs(nd.x-.5)/max(gL, .03);
        float wd = wL*(.25+1.7*vn(uL*vec2(2.3, 1.3)+9.)), rg = i < 2 ? (vn(wq*vec2(6.1, 7.3)+off)-.5)*rgL*wd*2. : 0.;
        float aL = clamp((wd-dL+rg)/pw+.5, 0., 1.)*min(1., 2.*wd/pw)*smoothstep(.48, .64, vn(uL*vec2(3.7, 1.9)+5.))*smoothstep(.08, .25, gL);
        if(i < 2) stK = max(stK, aL); else sdK = max(sdK, aL);
      }
      stK *= (1.-max(smoothstep(.56-e, .62+e, hA), hS))*smoothstep(0., .4, dnS);
      l12 = mix(max(max(sdK*rimK*.7, stK*.66), tornK*.72), smoothstep(.3, .8, dn)*.12, smoothstep(.3, 1., fw))*.8;
    }
    lace = max(lace, max(g12a*w1*.95, l12));
  }
  // ORDERS 14, 16 AND 17: ON A GALE DEAL BREAKING CRESTS ARE THE SEA'S WHITE ON ALL THE OPEN WATER: one law, no second
  // law, no edge. The branch is entered by the wind as handed alone (uWind over 0.55: a16; on every other deal it is
  // not entered and nothing of this is worked). The sea's own white is rows of like dashes, a stride apart and all
  // on one bearing; on a gale deal it is gone seaward of the band before the sill (above). Here A CREST BREAKS ALONG
  // A FRONT: the downwind edge of
  // a high place of a field that runs down the wind by the world's clock (two families of unlike size and bearing,
  // each front's bearing swinging from place to place, so no two fronts lie alike or run side by side for long; a
  // front bows, wavers and turns; it stands further forward where the water handed in stands high, sw.x). It is
  // broken along its length by one field of three sizes cut once: pieces of a hand to tens of metres, unlike gaps,
  // and a piece's ends thin out. AT THE FRONT lies thick torn foam, a hand to two feet of it, its edge pulled about at
  // three sizes; DOWN THE CREST'S BACK it leaves what the lace is made of (the same torn, holed foam, lying on the
  // water in the water's own frame fq): close and bright under the front, more holes and smaller scraps the further
  // behind, gone by one to five metres. More fronts break and the white is denser as the wind rises. As a pixel grows
  // past a size, that size melts to its mean (fw: the footprint, as everywhere in this law); when a family's own size
  // melts its fronts go, and far off a faint even share is left. Under 0.8.
  // WHERE THE OPEN SEA MEETS THE CAVE'S OWN WATER THE LAW DOES NOT REACH INSIDE: the two whites meet BY PLACE IN A BAND
  // OF 11 m BEFORE THE SILL (m16: by the measure from the cave's own strip of water, which runs from the sill, z = 0,
  // 100 m back, 11.5 m to a side: 0 on the strip, 1 from 11 m off; from a metre before the sill on it is the distance
  // from the 8 m of the strip about the middle: the band lies straight across before the sill and round at the
  // jambs' feet, its level lines drawn out sideways in the last metre: no edge along open water, no wedge; on the
  // strip nothing of the law is worked: there the water is what it ever was, to the bit, rows of dashes and all).
  // ORDER 17, ACROSS THE BAND TOWARD THE SILL
  // (k17 = 1-m16: 0 seaward of the band, 1 at the sill; every term below that the band brings is k17's or m16's and
  // is nothing where k17 is 0: seaward of the band every number is order 16's): THE NEW FOAM BREAKS UP INTO SCRAPS
  // instead of thinning: the cut of the torn foam rises (by 0.24 at the sill, as k17's square: little in the band's
  // outer half, most in the last metres), so a patch opens into pieces, the pieces shrink and are gone before the
  // sill; the thick foam at a front goes with m16; A FRONT'S LEADING EDGE IS DRAWN OUT (over up to 0.8 m at the
  // sill), so the cut is highest at the edge itself and the scraps dwindle toward it: no clean line leads a patch;
  // and only in the last three metres does what is left lose strength (so that it is nothing at the strip's edge:
  // no step there). Meanwhile the rows of dashes come in toward the sill (above). The band's terms read the
  // water's place alone: not the eye, not the lens, no clock but the sea's own, no deal's number.
  // AT THE CLIFF'S FOOT AND ON THE SKERRY THE LAW DOES NOTHING OF ITS OWN: the same fronts lie on the water up to the
  // rock; the white band at the rock's foot and the lace are order 12's and 13's, by their own places, as they were
  if(m16 > 0.){
    float gw16 = 0., k17 = 1.-m16;
    vec2 fq = q+vec2(.13, -.31)*t+(vec2(vn(q*.17+t*.04), vn(q*.17+7.-t*.035))-.5)*1.8;      // (the water's own frame, as the lace has it)
    vec2 cq = vec2(dot(q, vec2(.9487, .3162)), dot(q, vec2(.3162, -.9487))-1.8*t);      // (along the crests, down the wind)
    float pw = max(fw, .012), gT = -.2+.3*(1.-a16), gust = smoothstep(gT, gT+.3, vn(cq*vec2(.025, .04)+vec2(3., 7.+.03*t)));
    float rg = (vn(fq*vec2(.8, .9)+13.)-.5)*.7*(1.-smoothstep(.2, .6, fw*.9))+(vn(fq*vec2(2.7, 3.1)+13.)-.5)*.3*(1.-smoothstep(.2, .6, fw*3.1))
      +(vn(fq*vec2(8.3, 9.1)+71.)-.5)*.1*(1.-smoothstep(.2, .6, fw*9.1));
    float thr = .5-.2*(smoothstep(-.2, .3, sw.x/mix(1., 2., smoothstep(.45, 1., uWind)))-.5), mT = .42+.2*(1.-a16), co = 0., fr = 0., far = 0.;
    for(int i = 0; i < 2; i++){
      vec2 rc = i == 0 ? vec2(.978, .208) : vec2(.961, -.276), kf = i == 0 ? vec2(.1, .2) : vec2(.2, .4); float off = i == 0 ? 13. : 71.;
      float l1 = 1.-smoothstep(.2, .6, fw*kf.y), l2 = 1.-smoothstep(.2, .6, fw*kf.y*2.1);
      if(l1 <= 0.){ far = max(far, gust); continue; }                             // (this family's own size has melted: its even share alone)
      // (a front's bearing swings from place to place, by up to some thirty degrees over twenty metres: no two run side by side for long)
      float bb = cq.y+8.*(vn(cq*vec2(.06, .045)+vec2(31.+off, 17.))-.5);
      vec2 uL = vec2(cq.x*rc.x-bb*rc.y, cq.x*rc.y+bb*rc.x)*kf+off;
      vec3 nA = vnd(uL), nB = vnd(uL*vec2(2.3, 2.1)+5.);
      vec2 gF = (nA.yz*(.6*l1)+nB.yz*vec2(2.3, 2.1)*(.4*l2))*kf; float gl = max(length(gF), .012);
      // (live: this edge of the field looks down the wind: a front; the edges that run with the wind or look back are none)
      float live = smoothstep(.1, .55, (gF.x*rc.y-gF.y*rc.x)/gl)*gust*l1; far = max(far, (1.-l1)*gust);
      if(live <= 0.) continue;
      float m = vn(cq*vec2(.045, .23)+vec2(.05*t+off, off))*.45+vn(cq*vec2(.23, .5)+vec2(off-.04*t, 3.))*.33
        +mix(.5, vn(cq*vec2(1.3, 1.9)+vec2(off, 9.)), 1.-smoothstep(.2, .6, fw*1.9))*.22, mK = smoothstep(mT, mT+.1, m);
      if(mK <= 0.) continue;
      // (d: metres behind the front, under 0 before it; hw: half the thick foam's width here)
      float d = (.5+(nA.x-.5)*.6*l1+(nB.x-.5)*.4*l2-thr)/gl+rg, hw = (i == 0 ? .17 : .1)*(.3+1.5*vn(cq*vec2(.7, .9)+off))*mK;
      float inF = clamp(d/(pw+.8*k17)+.5, 0., 1.)*live;
      co = max(co, inF*(1.-smoothstep(hw, 3.*hw, d))*min(1., 3.*hw/pw));
      fr = max(fr, inF*smoothstep(0., .5, mK)*(1.-clamp((d-2.*hw)/((i == 0 ? 3.2 : 1.6)*(.3+1.3*mK)), 0., 1.)));
    }
    co *= m16;
    if(fr > 0.){
      vec4 lv4 = 1.-smoothstep(.2, .6, fw*vec4(.55, 1.35, 3.3, 8.9)); float lv5 = 1.-smoothstep(.2, .6, fw*23.);
      vec3 lh = 1.-smoothstep(.2, .6, fw*vec3(2.4, 5.6, 13.));
      vec2 vq = fq+(vec2(vn(fq*vec2(.31, .53)+11.), vn(fq*vec2(.29, .47)+23.))-.5)*vec2(.7, .6);
      vec2 wq = vq+(vec2(vn(vq*vec2(3.1, 3.7)+41.), vn(vq*vec2(3.3, 3.5)+57.))-.5)*(.1*(1.-smoothstep(.2, .6, fw*3.6)))
        +(vec2(vn(vq*vec2(9., 11.)+3.), vn(vq*vec2(10., 9.)+29.))-.5)*(.035*(1.-smoothstep(.2, .6, fw*10.5)));
      float e = max(.012, .4*fw*(dot(lv4, vec4(.15, .3, .69, 1.6))+2.53*lv5));
      float pb = .5+(vn(wq*vec2(.4, .55)+3.)-.5)*.28*lv4.x+(vn(wq*vec2(1., 1.35)+8.)-.5)*.22*lv4.y+(vn(wq*vec2(2.6, 3.3)+1.)-.5)*.21*lv4.z
        +(vn(wq*vec2(7.3, 8.9)+6.)-.5)*.18*lv4.w+(vn(wq*vec2(19., 23.)+2.)-.5)*.11*lv5;
      // (the cut falls at the front and rises down the back: thick foam, then lace, then scraps; and it rises across
      // the band toward the sill)
      float pt = .47+.3*(1.-fr)-.2*co+.24*k17*k17, hT = .47+.04*fr+.12*co;
      float hA = .5+(vn(wq*vec2(1.7, 2.4)+31.)-.5)*.35*lh.x+(vn(wq*vec2(4.3, 5.6)+17.)-.5)*.4*lh.y+(vn(wq*vec2(11., 13.)+4.)-.5)*.25*lh.z;
      float hS = smoothstep(.6-e, .7+e, .5+(vn(wq*vec2(17., 21.)+13.)-.5)*(1.-smoothstep(.2, .6, fw*21.)))*.8;
      gw16 = smoothstep(pt-e, pt+e, pb)*(1.-max(smoothstep(hT-e, hT+.05+e, hA), hS*(1.-.6*co)))*mix(.3+.35*fr, .85, co)*smoothstep(0., .15, fr);
    }
    gw16 = max(gw16, far*.02)*smoothstep(0., .4, a16)*smoothstep(0., .15, m16);
    lace = max(lace, gw16);
  }
  return mix(col, fl, lace); }
`,Ne=`
uniform float uTime, uLevel, uWetLine, uGlowAmt, uFoam, uPile, uSpout, uSea;
uniform vec4 uHump, uRect;                // uHump: z of the crest, height, half length, unused; uRect: the sheet's map (x0, z0, width, depth)
uniform vec3 uSunDir, uSunCol, uSkyCol, uMouthCol, uShaftCol, uGlowCol;
uniform vec3 uBasalt, uPink, uOchre, uBarn, uIvory, uDeep, uFoamCol, uAirCol, uSeaBody;
uniform float uAirDen, uSeaK, uWind, uLift, uFlood;
uniform sampler2D uCaus, uMap;
uniform vec3 uSeaZen, uSeaMid, uSeaHor, uSeaScat, uSeaScatDir; uniform vec4 uSeaP, uSeaQ;
const vec3 AX0 = vec3(0., 3., -81.), AXD = vec3(0., .92718, -.37461);
// THE SHAFT'S LIGHT IS THE LOOK'S OWN SKY'S (shaftCol): as handed under a high sun (blue-white by day, grey in fog, cold
// in a gale); under a LOW SUN the sky in the ring is orange and rose, and the light that falls down the blowhole is warm
// gold-white: the handed strength, the low sun's hue. shaftSky: the same as the spray and the wet film scatter it (the
// sky's, a shade colder than the shaft's own by day; under a low sun as warm as the shaft)
float shaftLow(){ return (1.-smoothstep(.2, .55, uSunDir.y))*smoothstep(-.02, .08, uSunDir.y); }
vec3 shaftCol(){ vec3 w = vec3(.3, .5, .2);
  return mix(uShaftCol, dot(uShaftCol, w)*mix(vec3(1.), uSunCol/max(dot(uSunCol, w), 1e-3), .85), shaftLow()); }
vec3 shaftSky(){ return shaftCol()*mix(vec3(.8, .93, 1.15), vec3(1.), shaftLow()); }
${kt}
// the same in space: a growth laid by it crosses a pipe's edges, its joints and the cracks between pipes unbroken
float h31(vec3 p){ p = fract(p*.1031); p += dot(p, p.zyx+31.32); return fract((p.x+p.y)*p.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(mix(h31(i), h31(i+vec3(1., 0., 0.)), f.x), mix(h31(i+vec3(0., 1., 0.)), h31(i+vec3(1., 1., 0.)), f.x), f.y),
             mix(mix(h31(i+vec3(0., 0., 1.)), h31(i+vec3(1., 0., 1.)), f.x), mix(h31(i+vec3(0., 1., 1.)), h31(i+vec3(1., 1., 1.)), f.x), f.y), f.z); }
float fbm3(vec3 p){ return (.5*vn3(p)+.25*vn3(p*2.03+7.1)+.125*vn3(p*4.01+3.3))*1.0714; }
// the water's level over a place: the sheet, the travelling hump of a swell, the pile against the back wall
float levelAt(float z){ float d = (z-uHump.x)/max(uHump.z, 1.); return mix(uLevel, uSea, smoothstep(2., 20., z)) + uHump.y*exp(-d*d) + uPile*(1.-smoothstep(-86., -56., z)); }
// daylight left at a place inside (1 at the mouth, dying down the nave)
float dayAt(vec3 P){ return exp(min(P.z, 0.)*.085); }
// THE SHAFT IS THE CAVE'S SECOND GREAT LIGHT (the mouth is its first). Its light at a place inside (by place): xyz the way
// to the nearest place of the BEAM (the lit column of falling spray, from the water at the blowhole's foot to the bell's
// mouth 13 m up the axis), w its strength there: strong within some metres of the beam, a half at 15 m, a sixth at
// 30 m, a twentieth at 50 m, falling off along the nave; and the recess's jambs (the walls close to 12 m behind z = -62) stand before it: a
// place out in the choir that the straight line to the beam does not reach through that opening is in their shadow
vec4 shaftAt(vec3 P){
  vec3 L = AX0+AXD*clamp(dot(P-AX0, AXD), -2., 13.)-P; float ds = dot(L, L), k = 400./(400.+ds);
  float see = mix(1., 1.-smoothstep(5.5, 7.5, abs(P.x)*18./max(P.z+80., 18.)), smoothstep(-64., -60., P.z));
  return vec4(L*inversesqrt(max(ds, 1e-4)), k*sqrt(k)*see); }
// THE LAMP'S SHAPE INSIDE, by place: brightest over the pale sand in mid nave, sliding to deep bottle green in the shadow
// under the walls (wallD: metres to the nearest wall column) and in the choir's far corner, and steadily toward the back
float lampOpen(vec2 xz, float wallD){
  float xc = 1.2*sin(xz.y*.105+.6)+.6*sin(xz.y*.27+2.);                   // (the pale lane wanders a little down the nave, and lies in pools)
  return smoothstep(.2, 3., wallD)*(1.-.97*smoothstep(1.6, 7.2, abs(xz.x-xc)))*(.72+.28*smoothstep(.3, .62, fbm2(xz*.16+4.))); }
vec3 lampIn(float open){ return mix(slab()*.07+uDeep*.03, uGlowCol*.62, open); }
float glowIn(float z){ return uGlowAmt*mix(.3, 1., smoothstep(-90., -24., z)); }
// the caustics as LIGHT on rock and sand: curved bright filaments with soft edges and brighter knots: the tile laid twice
// (the second larger, turned, drifting against the first, both swaying), a little out of focus (sp: by how much; a wall asks
// more of it with height). Each layer is weighed by its own mean at its softness, so the light's mean is 1 at any footprint:
// as a pixel grows past a filament the net melts into an even light of the same strength
float causMean(float l){ return .0105+.045*exp(-.6*l); }
float causLight(vec2 uv, float t, float fw, float sp){
  float l0 = log2(max(fw*256., 1.)), la = l0+sp, lb = max(l0-.86, 0.)+sp;
  vec2 w = .022*vec2(sin(uv.y*7.+t*2.3), sin(uv.x*6.-t*1.9));
  vec2 ub = vec2(.8*uv.x-.6*uv.y, .6*uv.x+.8*uv.y)*.55-w*.7+t*vec2(-.019, .023)+.37;
  float a = causTap(uv+w+t*vec2(.031, .017), la)/causMean(la), b = causTap(ub, lb)/causMean(lb);
  return .5+.5*min(.5*(a+b), 13.); }
// barnacles: a fine pale speckle, cones 2 to 4 cm across, each a ring round a dark mouth; it melts to its mean before a
// pixel can pick its grid out
float barnCell(vec2 g){ vec2 gi = floor(g), gf = fract(g)-.5; float h = h21(gi), h2 = fract(h*57.31), h3 = fract(h*13.7);
  float r = .17+.28*h; vec2 o = (vec2(h2, h3)-.5)*1.9*(.5-r); float d = length(gf-o)/r;
  return (1.-smoothstep(.6, 1., d))*(.35+.65*smoothstep(.1, .45, d))*step(.42, fract(h*91.7)+.25*h); }
float speck(vec2 p, float fw){
  float a = barnCell(vec2(.8*p.x-.6*p.y, .6*p.x+.8*p.y)*38.), b = barnCell(vec2(.94*p.x+.34*p.y, -.34*p.x+.94*p.y)*23.+17.);
  return mix(.22, max(a, b*.9), 1.-smoothstep(.12, .45, fw*30.)); }
// the tide bands in true order, by height over MEAN sea level (they do not move with the water): pink coralline crust,
// barnacle belt, black tar lichen, ochre lichen where daylight reaches, pale sea-ivory above. A band's limits wander by
// noise in WORLD space (a tide line does not know where a column ends); a column nudges them by a few centimetres only.
// sc: a coordinate on the surface (metres), for the mottle inside a band. crust: how much matt crust lies here.
// kin: 0 in the open day, 1 in the cave's own light, where the bands are the palette's answer to all that green: there the
// rose and the white stand at their full value and chroma (in the sun the same crusts are dusty and dull). In there the
// growth ignores the masonry: a crust is continuous across pipes and joints with small natural gaps, thicker in the
// hollow between two pipes and thinner on a pipe's proud front (hol: 0 on the front, 1 in the hollow), and the barnacles
// are a pale grain, never a wash
float gMouthR = 1.;                    // (how much of the mouth's broad daylight a pipe's side takes here, as the round thing it is: the column shader sets it)
float gTar = 0.;                       // (how much tar lichen lies at the place tideBands was last asked about: the column shader reads it)
float gShaftR = 1.;                    // (how much of the shaft's light a pipe's side takes here, as the round thing it is: its side toward the beam lit, its side away dark: the column shader sets it)
float gCalm = 0.;                      // (1 on the tall pipes of the wall behind the pavement: there the tide bands keep to their heights, the rose a low band at the waterline: the column shader sets it)
float gNose = 1.;                      // (the share of light the hollow between two pipes leaves a pipe's flank: the column shader sets it; the shaft's light comes ALONG a wall and reaches the flank that looks at it)
void tideBands(vec3 P, vec2 sc, float seed, float D, float fw, float kin, float hol, float wear, inout vec3 alb, inout float rough, out float crust){
  float ins = step(.001, kin);
  float n = fbm2(P.xz*.21+3.)-.47, m = vn(P.xz*1.3+11.)-.5;
  // (inside, a band's limit also steps from pipe to pipe, each pipe carrying its growth up to half a metre higher or
  // lower than its neighbour, and is ragged within a pipe; clusters of barnacles bite down into the rose's upper edge)
  float y = P.y+(n*1.7+m*.35)*(1.-.7*gCalm)+(h11(seed*31.7)-.5)*mix(.06, .55, ins), bite = 0.;
  if(ins > .5 && y > -2.5 && y < 5.5){
    y += (fbm3(P*vec3(1.2, .9, 1.2)+5.)-.47)*.8*(1.-.6*gCalm)+(vn(sc*vec2(6., 1.7)+seed*3.)-.5)*.24;
    bite = smoothstep(.5, .66, vn3(P*vec3(1.9, 1.2, 1.9)+9.)); }
  float yb = y+1.2*bite;
  float pink = smoothstep(-3.7, -2.9, y)*(1.-smoothstep(.2, .75, yb));
  float barn = smoothstep(.2, .75, yb)*(1.-smoothstep(1.7, 2.4, y));
  float tar = smoothstep(1.7, 2.4, y)*(1.-smoothstep(3.6, 4.6, y));
  float Do = mix(D, max(D, smoothstep(-24., -6., P.z)), ins);              // (the ochre lichen lives up the cave's walls as far in as the day reaches: some twenty metres)
  float och = smoothstep(3.8, 4.8, y)*(1.-smoothstep(9.5, 12., y))*Do, ivo = smoothstep(9., 12.5, y)*D;
  // mottle and speckle finer than a hand; each melts to its mean as the pixel grows past it
  float f1 = 1.-smoothstep(.25, .9, fw*9.), f2 = 1.-smoothstep(.25, .9, fw*26.);
  float g0 = fbm2(sc*1.6+5.), g1 = mix(.5, vn(sc*9.+3.), f1), g2 = mix(.5, vn(sc*26.+7.), f2);
  // coralline: a dusty rose crust in ragged sheets, darker pits, a paler growing edge; bare wet rock between
  float pe = g0+.14*(g1-.5)+.06*(g2-.5);
  // (inside the growth is laid by noise in SPACE: small gaps a hand or two across, a few more of them on the proud fronts;
  // a gap is a pit in the crust, dark and matt; wear: where water pours off a broken head, and here and there on a worn
  // shoulder, the crust is scoured off and the black wet rock shows)
  float gap = .47, bnI = .5, ocI = 0.;
  if(ins > .5){
    if(pink > 0.) gap = mix(.47, fbm3(P*vec3(6.5, 5.2, 6.5)+17.), 1.-smoothstep(.1, .4, fw*6.5))+.08*(g1-.5)+.05*(g2-.5)+(hol-.5)*.07;
    if(barn > 0.) bnI = fbm3(P*1.1+2.);
    if(och > 0.) ocI = fbm3(P*.55+3.); }
  // (dark wet tracks run down it where water drains off the wall: there the crust is thin and the rock shows, wet)
  float track = ins*pink*smoothstep(.6, .76, vn(vec2(sc.x*2.4+seed*7., P.y*.1+3.))+.12*(g1-.5));
  float gapE = 1.-smoothstep(.34, .44, gap), cov = smoothstep(.25, .37, gap)*(1.-.85*wear)*(1.-.8*track);
  float pk = pink*mix(smoothstep(.36, .46, pe), cov, ins);
  float pit = pink*ins*(1.-smoothstep(.25, .37, gap))*(1.-wear)*(1.-track);
  vec3 pg = vec3(dot(uPink, vec3(.3, .5, .2)));
  // (inside its colour wanders: rose, mauve where it is old, grey-pink where it is bleached; each pipe a little its own)
  float mo = .5, mo2 = .5, cs = h11(seed*47.3);
  if(ins > .5 && pink > 0.){ mo = fbm3(P*vec3(.55, .8, .55)+31.)+(cs-.5)*.24; mo2 = vn3(P*vec3(.9, 1.3, .9)+53.); }
  vec3 roseIn = mix(mix(uPink, pg, .1), mix(uPink*vec3(.7, .68, 1.1), mix(uPink, pg, .62)*1.1, smoothstep(.4, .65, mo2)), smoothstep(.42, .6, mo))*(.82+.36*cs);
  vec3 rose = mix(mix(uPink, pg, .4)*.2, roseIn*.29*(.6+.8*fbm2(sc*1.1+9.)), kin);
  vec3 pcol = rose*(.75+.5*g1)*(1.-.55*smoothstep(.58, .78, g2));
  pcol = mix(pcol, rose*1.35+.03, mix(1.-smoothstep(.46, .53, pe), gapE, ins)*.6);
  alb = mix(alb, pcol, pk*.92)*(1.-.5*pit);
  // barnacles: a speckle at the belt's ragged margins, thickening to a crust in its middle
  float bn = fbm2(sc*.9+2.)+.22*(1.-abs(y-1.25)/1.1);
  float dn = barn*mix(smoothstep(.3, .62, bn), (.5+.5*smoothstep(.3, .6, bnI+(hol-.5)*.12))*(1.-.85*wear), ins);
  float sp = speck(sc+seed*3., fw);
  float cover = smoothstep(0., 1., dn*2.-1.+sp*1.25*step(.02, dn));
  // (inside: the belt is a grain of clusters a hand across, the wet black rock between them; it melts to a pale grey only
  // when a pixel is wider than a cluster)
  float grain = mix(.62, smoothstep(.34, .6, vn3(P*vec3(11., 9., 11.)+5.)*.55+vn(sc*27.+3.)*.45), 1.-smoothstep(.2, .8, fw*11.));
  cover *= mix(1., .4+.6*grain, ins);
  alb = mix(alb, uBarn*mix(.12+.62*sp, .7+.3*sp, max(kin, .8*ins))*(.75+.5*g1)*(.7+.6*g0), cover);
  // tar lichen: a black belt, a little rock showing through
  float tarP = tar*(.72+.28*smoothstep(.3, .55, g0));
  // (INSIDE THE TAR BELT IS NO BLACK SKIN: it lay on the walls as shapeless black blotches that swallowed the pipes. In
  // there it is a thin dark stain on wet rock that keeps its film, its edge light and the net: shade follows the form)
  gTar = tarP*(1.-.8*ins);
  alb = mix(alb, vec3(.012, .013, .015)*(1.+.8*kin)*(1.-.55*ins), tarP*(1.-.12*kin)*(1.-.5*ins));
  // ochre lichen: dull, in ragged patches that thin out upward
  float thr = .53+.04*(y-4.);
  float ochP = och*smoothstep(thr, thr+.1, mix(fbm2(sc*.5+3.), ocI, ins)+.2*(g1-.5)+.12*(g2-.5));
  vec3 dull = mix(mix(uOchre, vec3(.11, .12, .08), .7)*.16, mix(uOchre, vec3(.2, .19, .1), .3)*.34, max(kin, .9*ins))*(.65+.7*g1)*(.8+.4*g2);
  alb = mix(alb, dull, ochP*.9);
  float ivp = ivo*smoothstep(.6, .72, fbm2(sc*1.9+11.))*(.4+.6*g1)*f1;
  alb = mix(alb, uIvory*.7, ivp*.3);
  crust = max(max(max(pk*.9, cover), max(ochP, ivp*.5)), pit*.6);
  rough = mix(rough, .92, max(crust, tar*(1.-.3*kin)*(1.-.8*ins)));                // (outside the tar belt dulls the rock's gloss; in the cave it is a thin dark stain and dulls it by a fifth of that only: the wet rock under it keeps its film's sheen, its edge light and the net)
}
// THE SUN THROUGH THE MOUTH, by place: a point inside is in the sun when the straight line from it toward the sun leaves
// the cave by the mouth's slot (at z = 0: 17 m wide up to 12 m, closing to its point at 24 m; open from the water up).
// Returns the sun's share there, its edge softer the deeper in (the slot's edge is ragged pipes, and the sun has a width)
float sunIn(vec3 P){
  float sz = uSunDir.z; if(sz < .02) return 0.; if(P.z >= 0.) return 1.;
  float t = -P.z/sz, bl = .3+.014*t; vec2 h = P.xy+uSunDir.xy*t;
  float hw = max(min(8.5, min(8.5-(h.y-12.)*.42, 24.-h.y)), 0.), lv0 = levelAt(0.);
  return smoothstep(.02, .1, sz)*(1.-smoothstep(hw-bl, hw+bl, abs(h.x)))*smoothstep(lv0-bl, lv0+bl, h.y)*(1.-smoothstep(23.-bl, 24.+bl, h.y)); }
// light on a surface. indoor: 0 the cliff outside, 1 inside; chim: 1 in the blowhole. sunSh: the sun's share left by the
// neighbours. cnet: the caustic light here (mean 1). crust: matt crust (it does not carry the wet film's shine).
// Nf: the face's normal without its pits (the wet film lies smooth over them). edge: 1 on a worn shoulder or a broken end,
// 0 on a pipe's flat flank. film: the share of the film's mirror this place may draw (a face narrower than a few pixels
// draws no more of it than its share of a pixel; each drum has its own). O: the body's open side (level unit vector; zero when it has none). sky: the share of the sky
// its place sees
vec3 shade(vec3 P, vec3 N, vec3 Nf, vec3 V, vec3 alb, float rough, float wet, float indoor, float chim, float ao, float sunSh, float cnet, float crust, float edge, float film, vec3 O, float sky){
  float NV = max(dot(N, V), 0.), out_ = 1.-indoor, cave = indoor*(1.-chim);
  float D = mix(1., dayAt(P), indoor)*(1.-chim);
  float gl = mix(120., 10., rough), sAmp = mix(.03, .55, wet)*(.25+gl*.012)*(1.-.85*crust);
  float F = (.04+.96*pow(clamp(1.-NV, 0., 1.), 5.))*mix(.12, 1., wet*wet);
  vec3 R = reflect(-V, N);
  float toOpen = dot(O, O) > .25 ? max(dot(N, O), 0.) : .6;                 // a face that looks out of the rock sees the sky, or the nave
  vec3 col = vec3(0.);
  // outside: the sun; the sky from the open side and from above (a face turned to its neighbour sees little of it).
  // A low sun (under some 20 degrees) is a soft one: a flat wet flank does not flash it straight back at an eye that has
  // it behind (the film mirrors little head-on); a worn shoulder turns through every bearing and keeps its glint: under
  // a low sun the edges are gilt, the flanks slate. Under a high sun nothing is changed
  float nl = max(dot(N, uSunDir), 0.);
  vec3 H = nrm(uSunDir+V);
  float flash = max(edge, max(smoothstep(.2, .55, uSunDir.y), smoothstep(.03, .3, 1.-max(dot(V, H), 0.))));
  // (and it lights a pipe as the round thing it is, a drum as a little barrel: by the film's normal, so its light slides
  // over each drum's curve and no drum is one flat colour; the film itself gives a broad warm sheen at a grazing look)
  float lowS = 1.-smoothstep(.2, .55, uSunDir.y);
  nl = mix(nl, max(dot(Nf, uSunDir), 0.), .75*lowS);
  col += out_*uSunCol*sunSh*nl*(alb+sAmp*flash*pow(max(dot(N, H), 0.), gl));
  col += out_*uSunCol*sunSh*lowS*(1.-smoothstep(.3, .78, rough))*(1.-.85*crust)*film*min((.03+.97*pow(clamp(1.-max(dot(V, H), 0.), 0., 1.), 5.))*pow(max(dot(Nf, H), 0.), 30.)*2.2, .3);
  // THE LOW SUN'S WARMTH: wet rock that faces a low sun takes a broad sheen of the sun's own colour (not the rock's): the
  // face turned to it bronze to gold, the flank falling away into the cold shade between pipes
  // (the light of a low sun comes back off wet brown-black rock deeper than it came: sunG)
  vec3 sunG = uSunCol*mix(vec3(1.), uSunCol/max(max(uSunCol.r, uSunCol.g), max(uSunCol.b, 1e-3)), .7);
  float warm = pow(max(dot(Nf, uSunDir), 0.), 2.)*(.075+.06*wet)*(1.-.6*crust)*ao;
  col += out_*sunG*sunSh*lowS*warm;
  float skyW = mix(.2+.8*toOpen, 1., max(N.y, 0.))*(1.-.7*max(-N.y, 0.));
  col += out_*uSkyCol*alb*ao*sky*skyW*1.15;
  col += out_*F*uSkyCol*ao*wet*sky*(1.-rough)*(R.y > 0. ? .5 : .12)+out_*uSkyCol*alb*ao*sky*.3*max(-N.y, 0.);   // the wet film's sheen; under an overhang, the sea's light from below
  col += cave*uSkyCol*alb*ao*D*.14*(.3+.7*toOpen);
  // the mouth: a cold white slot. The day that comes in by it is weak beside the day outside; faces that look at it take
  // a little of it, faces turned away none
  vec3 Lm = vec3(1.5, 10., 3.)-P; float dm = dot(Lm, Lm); Lm *= inversesqrt(max(dm, 1e-4));
  // (in the throat itself the mouth's light IS the open sky's: a jamb's inner face, which the sea sees, is lit and mirrors
  // no brighter than the sky that stands before it; deeper in it is the mouth's own)
  vec3 mouthC = mix(uMouthCol, min(uMouthCol, uSkyCol*1.25), smoothstep(-9., -1., P.z));
  vec3 Im = mouthC*cave*min(.5, 820./(820.+dm));
  col += Im*alb*(max(dot(Nf, Lm)*.8+.2*dot(N, Lm), 0.)*.3+(.02+.05*toOpen)*ao);      // (by the film's normal: it slides over a pipe's curve)
  // In the first twenty metres the walls take the mouth's daylight BROADLY: a cold sheen on the wet rock that looks toward
  // the mouth, and the crusts (the ochre lichen up the walls, the rose, the white) their own colours in it
  // (it is wet dark rock in daylight, not pale stone; and in the throat itself, which the sea sees, it is held back: from
  // outside the jambs' inner faces are no brighter than the cliff)
  // (where the sun itself lies, it is the light: the sky's broad sheen from the mouth is small beside it)
  float sI = cave > 0. ? sunIn(P) : 0.;
  float day20 = exp(min(P.z, 0.)/11.)*(1.-.45*smoothstep(-7., -1., P.z)), wrapM = max(dot(Nf, Lm)*.6+.4, 0.);
  col += mouthC*cave*day20*wrapM*ao*gMouthR*((.02+.03*wet)*(1.-.6*crust)*(1.-.75*sI)+alb*.36);
  // THE SUN DOWN THE NAVE (sunIn: by place, through the mouth's slot): what it reaches is gilded: a face turned to it warm
  // gold, a wet one with the sun's own sheen, a worn shoulder with its glint; a crust takes it matt
  // (sunSh: a pipe is lit as the round thing it is, its side toward the sun, its flank dark; so the gilt is no flat coat:
  // a thin bronze sheen on the face that looks at the sun, and THE GOLD ON THE WET EDGES, the worn shoulders turned to it)
  float sIr = sI*sunSh, nS = max(dot(Nf, uSunDir), 0.);
  col += uSunCol*cave*sIr*ao*(alb*max(nS*.7+.3*dot(N, uSunDir), 0.)*1.5+sAmp*.4*max(edge, .3)*pow(max(dot(N, H), 0.), gl))
    +sunG*cave*sIr*ao*(nS*nS*nS*(.027+.033*wet)*(1.-.6*crust)+edge*wet*max(dot(N, uSunDir), 0.)*.2*(1.-.7*crust));
  // THE LIT WALL'S LIGHT COMES BACK ACROSS THE NAVE: where the sun lies on the wall across from a place (sunIn there, at
  // this depth of the cave), that wall's warm light falls on what faces it and is itself out of the sun: the noses of the
  // shaded wall's pipes take a warm sheen, their flanks stay black: the dark wall reads as pipes
  if(cave > 0. && uSunDir.z > .02){
    float xo = P.x > 0. ? -7.7 : 7.7, sB = sunIn(vec3(xo, clamp(P.y, 2.5, 9.), P.z))*(1.-sI);
    vec3 Lb = nrm(vec3(xo-P.x, 1.5, 2.));
    col += sunG*sB*ao*(16./(16.+abs(xo-P.x)))*max(dot(Nf, Lb)*.75+.25, 0.)*((.03+.05*wet)*(1.-.5*crust)+alb*.6);
  }
  // THE WET FILM'S MIRROR: where the mirrored sight line leaves the cave by the mouth's slot (16 m wide at the water, closing
  // to its point at 24 m) lies a broad cold sheen: a soft streak down the flank of each pipe that has a face turned for it,
  // broken where a drum turns a little off its neighbour. The film's roughness spreads the slot's image and thins it
  float gloss = (1.-smoothstep(.3, .78, rough))*(1.-.85*crust)*ao*film;
  vec3 Rf = reflect(-V, Nf);
  float Ff = min(.06+.94*pow(clamp(1.-max(dot(Nf, V), 0.), 0., 1.), 5.), .5);
  float tz = max(-P.z, 0.)/max(Rf.z, .03), bl = 2.5+tz*mix(.12, .36, rough);
  vec2 hp = P.xy+Rf.xy*tz;
  float hw = 8.*(1.-.8*smoothstep(8., 24., hp.y));
  // (the slot's image is brightest through its middle and low down, where the day is: so the sheen slides over a drum's
  // curve and no drum mirrors one flat light)
  float slot = step(.03, Rf.z)*(1.-smoothstep(.15*hw, hw+bl, abs(hp.x)))*smoothstep(-bl, .5*bl, hp.y)*(1.-smoothstep(5., 24.+bl, hp.y))*8./(8.+bl);
  float flank = 1.-.85*smoothstep(.5, .95, Nf.y);                          // (a top that looks up is pitted rock round its cup: dark and wet, no mirror)
  col += mouthC*cave*gloss*Ff*slot*.75*flank;
  // the shaft down the blowhole: blue-white, on the back of the cave and all the way up the chimney; a broad sheen on wet
  // rock that looks toward it
  // (ITS LIGHT ON THE ROCK, by place (shaftAt): every pipe of the recess and of the nave's walls near it has a LIT SIDE,
  // the side of its curve that looks at the beam, and a shaded side: the wall reads as round pipes, crisp, and the
  // cracks between stay black; a crust takes it matt and pale; the hanging ends of the roof over the foot take the
  // light that comes up off the lit pool on their lower faces)
  vec4 sA = shaftAt(P); vec3 Ls = sA.xyz;
  vec3 Is = shaftCol()*cave*sA.w;
  vec3 Hs = nrm(Ls+V);
  float Fs = min(.06+.94*pow(clamp(1.-max(dot(V, Hs), 0.), 0., 1.), 5.), .5);
  float nlS = max(dot(Nf, Ls), 0.), aoS = ao/max(gNose, .28)*mix(1., gNose, .3);
  vec2 dFt = P.xz-vec2(0., -80.4);
  col += shaftCol()*cave*exp(-dot(dFt, dFt)/260.)*max(-N.y, 0.)*(.03+.04*wet)*(1.-.5*crust)*ao;
  col += Is*(alb*(max(dot(N, Ls), 0.)*.9+.06*ao)*gShaftR+gloss*Fs*pow(max(dot(Nf, Hs), 0.), 14.)*1.6*flank
    +(.14+.2*wet)*nlS*sqrt(nlS)*(1.-.55*crust)*aoS*gShaftR*(1.-.7*max(N.y, 0.))
    // (round the shaft the wet back wall is lit by it AS PIPES: each takes the light on the part of its curve that looks at
    // it and falls away dark at its flanks, and the cracks between stay black: a fall of light in a dark recess, no pane)
    +(.05+.08*wet)*pow(nlS, 10.)*(1.-.6*crust)*ao*(1.-.8*max(-N.y, 0.)));       // (and the wall close round its foot stands wet and bright in it)                           // (the roof's hanging ends round the bell take it on their lower faces)
  float sAx = dot(P-AX0, AXD);
  // THE CHIMNEY HAS THREE COLOURS ON ITS ROCK, by the way a face looks. What looks UP the axis (the cupped tops of the
  // steps, wet shoulders) takes the sky through the ring in the sky's own colour, deepened: blue by day, warmed by a low
  // sun. What is turned TO the axis takes the shaft's cold blue-white. What looks DOWN (the hanging hexagon ends, the
  // undersides) takes the emerald from the water below, which climbs the lower chimney and is gone some 40 m up. And
  // near the lip the sun itself, where the straight line from a place to it clears the lip's south rim, gilds the wet
  // edges that face it
  if(chim > 0.){
    float upK = smoothstep(0., 60., sAx), lumS = dot(shaftCol(), vec3(.3, .5, .2)), lumK = max(dot(uSkyCol, vec3(.3, .5, .2)), 1e-3);
    vec3 skyR = mix(uSkyCol, uSunCol*(lumK/max(dot(uSunCol, vec3(.3, .5, .2)), 1e-3)), .85*lowS);
    skyR = max(mix(vec3(dot(skyR, vec3(.3, .5, .2))), skyR, 1.7), vec3(0.))*(lumS/lumK);
    vec3 toAx = nrm(AX0+AXD*sAx-P);
    float fUp = max(dot(Nf, AXD), 0.), fAx = max(dot(Nf, toAx), 0.), fDn = max(-dot(N, AXD), 0.);
    float kw = (.05+.09*wet)*(1.-.6*crust)*ao;
    col += chim*skyR*mix(.3, 1.15, upK)*(alb*(fUp*.6+.1)+kw*fUp*fUp*1.1);
    // (THE BELL'S MOUTH IS BRIGHT WITH THE SKY'S LIGHT: low in the bell, where the shaft's light spreads on the rock that
    // stands round it, the faces turned to the axis are lit the most of all: from the nave the bell's wall over the back
    // of the cave is a lit place in the roof)
    // IT IS DARK WET ROCK, black-blue, AND ITS FORM IS READ BY GLOSS, RIMS AND LIGHT, NOT BY A PALE COAT. A face turned to
    // the axis takes the shaft's light on its rock only (basalt: little of it comes back); the broad sheen of the film is
    // kept low in the bell alone, where the light spreads on the rock round its mouth (the lit place in the nave's roof)
    float bellK = 1.-smoothstep(11., 24., sAx);
    // (ORDER 11: THE THROAT IS A LIT WELL WITH DARK SEAMS: light comes down the chimney, and its wet walls take a little
    // of the sky's light from above, by place: most high up, falling off downward to the bell, on the part of each pipe
    // that is turned to the axis; the cracks black. The well's real light is the film's mirror of the ring, below)
    float well = smoothstep(4., 14., sAx)*(1.-.65*smoothstep(19., 31., sAx))*(1.-smoothstep(36., 50., sAx));
    col += chim*shaftSky()*mix(.45, .9, upK)*(alb*fAx*.28+kw*(pow(fAx, 1.5)*(.6*bellK+well)+well*.12*fDn));
    // THE FILM MIRRORS THE RING: where the mirrored sight line (by the film's normal, which turns round a pipe as round a
    // round thing) leaves by the chimney's ring (5.6 m about the axis, 60 m up it) it shows the sky there, in the sky's
    // own colour: one bright streak down each pipe that has the bearing for it, its flanks black; a rough film spreads it
    float tR = max(60.-sAx, 0.)/max(dot(Rf, AXD), .05); vec3 qR = P+Rf*tR-AX0; qR -= AXD*dot(qR, AXD);
    float blR = .8+tR*mix(.02, .1, rough), seeR = step(.05, dot(Rf, AXD))*(1.-smoothstep(5.6-blR, 5.6+blR, length(qR)))*5.6/(5.6+blR);
    vec3 mirC = mix(shaftSky(), skyR, smoothstep(.25, .85, dot(R, AXD)));
    // (a far pipe, a pixel or two wide, keeps the MEAN of its streak, not nothing: looked up into from under the bell the
    // high walls of the well shine with the ring's sky at their grazing angle, and the throat is lit, brightest high up)
    float glossC = (1.-smoothstep(.3, .78, rough))*(1.-.85*crust)*ao*mix(.65, 1., film);
    col += chim*mix(.3, 1.15, upK)*(mirC*(sAmp*pow(max(dot(N, nrm(AXD+V)), 0.), min(gl, 90.))*.8*film)+skyR*(glossC*Ff*seeR*1.1));
    // (the RIMS: a worn shoulder, the lip of a broken end, turn through every bearing: they carry a line of the ring's light)
    col += chim*skyR*mix(.35, 1.2, upK)*edge*wet*(1.-.7*crust)*ao*.3*max(dot(N, AXD)*.7+.3, 0.)*(1.-fDn);
    // (THE EMERALD CLIMBS THE LOWER CHIMNEY: on what looks down, the hanging hexagon ends, as the net's own figure, bright
    // lines on a green-black end, never one flat green tile; a little of it on every wet face)
    float nE = max(cnet-.5, 0.)*2.;
    col += chim*uGlowCol*(uGlowAmt*exp(-max(sAx, 0.)/20.)*(1.-smoothstep(30., 50., sAx)))*(alb*(fDn+.08)*2.+kw*(fDn*fDn*2.1*(.3+.75*nE)+.05+.3*nE*(1.-fDn)));
    // (UNDER A LOW SUN the warm light of the gilded lip and of the orange sky comes down the chimney: the wet edges and
    // tops that look up and south are gilt well down it, strongest high up: gold, emerald and black to the end)
    col += chim*sunG*shaftLow()*step(.02, uSunDir.z)*mix(.25, 1., upK)*wet*(1.-.7*crust)*ao*(edge*.7+.012)*pow(max(dot(N, vec3(0., .6, .8)), 0.), 1.5);
    float tS = (-97.2-P.z)/max(uSunDir.z, .05), lipS = step(.02, uSunDir.z)*smoothstep(57., 59.5, P.y+uSunDir.y*tS)*(1.-smoothstep(4.5, 6.5, abs(P.x+uSunDir.x*tS)));
    col += chim*sunG*lipS*(kw*(max(dot(Nf, uSunDir), 0.)*.6+edge*1.6*max(dot(N, uSunDir), 0.))+uSunCol/max(max(uSunCol.r, uSunCol.g), max(uSunCol.b, 1e-3))*alb*max(dot(N, uSunDir), 0.)*2.);
  }
  // THE EMERALD FROM BELOW IS A NET OF LIGHT ON BLACK WET ROCK: the caustic net's bright lines (its dark cells are left
  // dark: the rock between the lines is near black, with its cold gloss), strong over the lowest 8 m above the water as
  // it stands now, thinning with height to a faint net under the roof; a top that looks up takes little of it; under it
  // only a faint even wash that models the rock. Daylight thins both toward the mouth. A pale crust gives back the white
  // part of the light too, so beside the green it keeps its own colour. None of it outside the cave
  float lv = levelAt(P.z), h = max(P.y-lv, 0.), hi = smoothstep(6., 12., h);
  float Wh = .58*exp(-h/7.)+.42, Wn = .9*exp(-h/5.)+.1;
  float zone = uGlowAmt*mix(.62, 1., smoothstep(-88., -50., P.z))*mix(1., mix(.7, .45, hi), smoothstep(mix(-26., -40., hi), mix(-2., -8., hi), P.z))*(1.-.8*smoothstep(-9., -2., P.z));       // (in the mouth's throat the day drowns it: from the sea the jambs do not glow)
  vec3 Lg = nrm(vec3(-P.x*.5, lv-2.-P.y, 2.5));                          // it comes up off the water, from the cave's middle and from the mouth's side, where the water is lit
  float form = .25+.2*hi+.55*max(dot(N, Lg), 0.)+.5*max(-N.y, 0.)+.16*toOpen;       // (high up the light has come off every wall on its way: it is even)
  form = mix(form, .62, .45*crust);                                        // (a matt crust takes the light more evenly than a wet face)
  vec3 gcol = uGlowCol/1.3, gw = mix(gcol, vec3(dot(gcol, vec3(.3, .5, .2))), .1+.7*crust);
  // (the lines alone: the tile's dark cells stay dark; the net lies in pools of light that drift, strong here, faint there)
  float n0 = max(cnet-.5, 0.)*2., net = n0*smoothstep(.12, 1.1, n0)*(.55+1.*smoothstep(.25, .75, vn3(P*.12+vec3(0., uTime*.035, 0.))));
  float sunK = cave > 0. ? 1.-.6*sI : 1.;                                    // (where the sun lies the net is drowned in it)
  // (ORDER 11: IT IS A WALL OF COLUMNS, quiet but plain: the net lies LOW on it, clear and slow (whole to 2 m over the
  // water, 0.43 of itself 12 m up, three tenths far up; no blotchy pools), and each pipe is read by its EDGES' LIGHT (its worn
  // shoulders carry a line of the water's green from below and of the mouth's cold day) and by its film's gloss)
  float quietW = cave*(1.-smoothstep(-11.5, -9., P.x));
  net *= mix(1., .3+.7*exp(-max(h-2., 0.)/6.), quietW);
  col += quietW*edge*wet*(1.-.7*crust)*ao*flank*(1.-max(-N.y, 0.))*(uGlowCol*(zone*.1*Wh)+mouthC*(min(.5, 820./(820.+dm))*.14));
  float light = zone*ao*sunK*(form*Wh*mix(mix(.09, .18, hi), mix(.8, 1., hi), crust)+Wn*mix(.6, .6, crust)*(1.-.85*max(N.y, 0.))*net*(.4+.6*form));
  vec3 glow = gw*alb*light*4.6;
  // the film mirrors the lit water as well: a green sheen where the mirrored sight line goes down to the sheet (a wet face
  // seen from over its own height, an underside: the roof's hanging ends shimmer with the net), and a broad soft one
  // on each pipe's flank that stands between the eye and the water
  float run = h*length(Rf.xz)/max(-Rf.y, .02);
  glow += uGlowCol*zone*gloss*(Ff*smoothstep(.02, .3, -Rf.y)*(1.-smoothstep(8., 22., run))*.42*(.6+.4*cnet)+Wh*pow(max(dot(Nf, nrm(Lg+V)), 0.), 6.)*.06);
  // (it keeps its hue under its limit: never brighter than the water it comes from)
  glow /= 1.+dot(glow, vec3(.3, .5, .2))/mix(.4, .5, crust);              // (a soft limit: a line of the net keeps its soft flanks and its brighter knots)
  col += indoor*(1.-chim*smoothstep(14., 46., P.y))*glow;
  return col;
}
// THE SHAFT (order 10: its even halo is all but gone, .005; what shows is threads, core, mist and the bell's glow, see
// below): the daylight that falls down the blowhole lights the damp AIR in a soft column round the axis (1.5 m to its
// shoulder) that stands on the water at the back of the nave: full to 22 m up the axis, gone by 32 m (by place: the upper
// chimney's air is clear), giving way as the spout comes on. A sight line gathers its light by the length it runs through
// the column (a Gaussian across the axis: closed form), and what lies behind the column is seen through that light. It is
// air: no surface carries it, and it lies on nothing that this part does not draw
float erfA(float x){ float x2 = x*x; return sign(x)*sqrt(max(1.-exp(-x2*(1.27324+.147*x2)/(1.+.147*x2)), 0.)); }
// (the light a sight line gathers in a soft ball of lit air about M, radii r in metres: a Gaussian, closed form)
float ballAir(vec3 d, float dist, vec3 M, vec3 r){
  vec3 w = (cameraPosition-M)/r, e = d/r; float a = max(dot(e, e), 1e-5), b = dot(w, e), k = sqrt(a);
  return exp(-max(dot(w, w)-b*b/a, 0.))*.8862/k*(erfA((dist*a+b)/k)-erfA(b/k));
}
vec3 shaftAir(vec3 P, float dist){
  vec3 d = (P-cameraPosition)/max(dist, 1e-4), w0 = cameraPosition-AX0; w0 -= AXD*dot(w0, AXD); vec3 wd = d-AXD*dot(d, AXD);
  float a = max(dot(wd, wd), 1e-4), b = dot(w0, wd), c = dot(w0, w0), r2 = max(c-b*b/a, 0.), tn = clamp(-b/a, 0., dist);
  vec3 Pc = cameraPosition+d*tn;                                            // the place where the line passes nearest the axis, between the eye and what it meets
  float sc = dot(Pc-AX0, AXD);                                              // and its height up the axis
  // IT IS A SKYLIGHT FULL OF FALLING SPRAY, not a slab of light: a bright narrow CORE where the drops fall thickest, in
  // the faintest of halos; the column's girth swells and thins down its length as the spray falls (each side its own), so its
  // edges are soft and uneven; puffs and wisps of it fall (laid by that place; they melt to their mean before a pixel is
  // wider than they), and near the lens single DROPS sparkle in it. The light it scatters is the sky's: colder than the shaft's own
  // (ua: the place ACROSS the shaft where the line passes it, measured from the axis: what is laid by it falls down the axis)
  vec3 o = w0+wd*tn; float side = dot(o, cross(AXD, d)) > 0. ? 1. : -1.;
  float ua = o.x*.8-(o.y*.3746+o.z*.92718)*.6-48., fa = min(fwidth(ua)+fwidth(sc)*.1, 1.), tf = uTime;
  float g1 = .65+.7*vn(vec2(sc*.27+tf*1.2, side*4.+2.)), g2 = .55+.9*vn(vec2(sc*.5+tf*2.1, side*3.+9.));
  float vh = 5.2*g1, vc = .55*g2, kh = sqrt(a/vh), kc = sqrt(a/vc);
  float Ih = exp(-r2/vh)*.8862/kh*(erfA((dist+b/a)*kh)-erfA(b/a*kh)), Ic = exp(-r2/vc)*.8862/kc*(erfA((dist+b/a)*kc)-erfA(b/a*kc));
  float keep = 1.-smoothstep(.05, .22, fa);
  float puff = fbm2(vec2(ua*.55+.4*sin(sc*.35+tf*.6), sc*.26+tf*1.5));
  float wisp = mix(.5, vn(vec2(ua*2.6+7., sc*.42+tf*2.6)), keep);
  // (drops: short bright dashes that fall fast and wink; a hand long: only near)
  vec2 dg = vec2(ua*4.5, sc*1.7+tf*8.5), di = floor(dg), df = fract(dg)-.5; float dh = h21(di), dh2 = fract(dh*57.3);
  float drop = step(.72, dh)*(1.-smoothstep(.0, .09, length(vec2(df.x-(dh2-.5)*.7, df.y*.35))))*(.35+.65*step(.45, fract(dh*31.+tf*2.3)));
  drop = mix(.004, drop, 1.-smoothstep(.012, .05, fa))*exp(-r2/2.5);
  float col = smoothstep(-4.5, -2.5, sc)*(1.-smoothstep(22., 32., sc));
  // (the core is the spray where it is thickest, over the water: it thins upward and is gone under the bell's mouth, and
  // over that the chimney's air is thin: an eye that climbs the shaft looks through little of it)
  // (THE FALLING WATER IS SEPARATE BRIGHT THREADS, a forearm wide, a metre apart, each with its own breaks, the dark wet
  // wall seen between them; they melt to their mean as a pixel grows past them. The even veil of lit air is thin)
  float cu = ua*.77+.3, ci = floor(cu), cf = fract(cu), thA = h11(ci*7.3+1.), thW = .14+.1*h11(ci*3.1+5.);
  float thB = vn(vec2(ci*1.7, sc*.22+tf*.9)), thF = fwidth(cu);
  float thL = (1.-smoothstep(thW*.45, thW+thF, abs(cf-(.3+.4*h11(ci*5.7+2.)))))*step(.22, thA)*(.65+.55*thA);
  thL *= 1.+1.6*smoothstep(.62, .9, vn(vec2(ci*5.3+2., sc*2.2+tf*6.)));        // (the threads SPARKLE in the beam: bright runs falling down each)
  float thrd = mix(.2, thL*(.3+1.3*smoothstep(.3, .7, thB))*(.75+.5*wisp), 1.-smoothstep(.3, .8, thF));
  // (sideK, ORDER 11c: IT READS ONE THING, THE SIGHT LINE'S BEARING TO THE BLOWHOLE'S AXIS (a is the squared sine of the
  // angle between the two): a line within 15 degrees of the axis itself runs with the falling water, between the
  // threads, and meets none of it; from 25 degrees on it meets all of it. THE SHAFT IS AT FULL STRENGTH FOR EVERY SIGHT
  // LINE THAT MEETS IT FROM THE SIDE, whatever its rise, from anywhere in the nave and from the pavement, however near
  // or far the eye stands. It reads nothing of where the eye is: the factor of the eleventh part that took the fall
  // away as the eye came within 7 m of the axis is OUT (it faded a thing by the lens's own distance from it))
  float sideK = smoothstep(.067, .179, a);
  // (ORDER 11: IT IS A STRONG BEAM, the brightest thing inside after the mouth: seen from the side a soft body of lit
  // spray two metres about the axis, the bright core in it from the water up to the bell's mouth, the threads
  // sparkling in it)
  float I = col*(.005*(1.-exp(-Ih*.45))*(.5+1.*puff)+sideK*(.4*(1.-exp(-Ih*.3))*thrd*exp(-r2/9.)
    +.09*(1.-exp(-Ih*.45))*(.5+1.*puff)
    +(1.-smoothstep(6., 15., sc))*(.45*(1.-exp(-Ic*.9))*(.65+.7*wisp)*(.7+.6*puff)))+(1.-smoothstep(1.5, 7.5, sc))*.5*drop);
  // THE BELL'S MOUTH in the roof is bright with the sky's light: the spray that hangs in the bell is lit from above (a
  // soft ball of it, 4 m about the bell's place); what stands before it is seen against it
  float Ib = ballAir(d, dist, vec3(0., 14.5, -84.6), vec3(4.2, 1.7, 4.2));
  // WHERE IT MEETS THE WATER lies a low white mist (a flat cloud, 0.6 m deep, 3 m about the foot), drifting
  float Im = ballAir(d, dist, vec3(0., levelAt(-80.6)+.35, -80.6), vec3(3.3, .45, 3.));
  vec2 mq = Pc.xz*.5+vec2(tf*.21, -tf*.13);
  vec3 sky = shaftSky();
  // (THE BEAM GIVES WAY TO THE WATER, BY THE EVENT ALONE, the same for every eye wherever it stands: what shows the
  // beam is the spray that falls down the blowhole. When the surge heaps against the back wall under the bell (uPile,
  // the heap's height in metres, set by the world through setPile) the air it drives up the blowhole takes the falling
  // spray up with it: the lit spray, its core, its drops, the bell's glow and the foot's mist thin from a heap of
  // 1.7 m and are gone at 2.6 m, before the spout stands in the shaft (uSpout, as before). The light itself still
  // falls: the lit rock and the pool on the water (shaftAt) stay. The part's own stand-in breath heaps 1.4 m: there the
  // spout alone takes the beam, as before)
  float give = (1.-smoothstep(1.7, 2.6, uPile))*(1.-smoothstep(0., .3, uSpout));
  return (sky*(I+.1*sideK*(1.-exp(-Ib*.3)))+shaftCol()*(.26*(.25+.75*sideK)*(1.-exp(-Im*.55))*(.55+.9*vn(mq))))*give;
}
// THE SUN'S BEAM IN THE AIR: where the sun shines in by the mouth (sunIn) the damp air shows it faintly. A sight line
// gathers it by the length it runs through the beam: the slot taken as a soft shape (a Gaussian 8.4 m by 12 m about the
// slot's middle), carried down the cave along the sun's own way: closed form, by place and the sun's bearing
vec3 sunAir(vec3 P, float dist){
  float sz = uSunDir.z; if(sz < .02) return vec3(0.);
  vec3 d = (P-cameraPosition)/max(dist, 1e-4), C = cameraPosition;
  float t0 = C.z > 0. ? clamp(C.z/max(-d.z, 1e-4), 0., dist) : 0.;                 // (the part of the line that lies inside)
  vec2 hC = C.xy-uSunDir.xy*(C.z/sz)-vec2(0., 10.), hd = d.xy-uSunDir.xy*(d.z/sz), iv = vec2(1./35., 1./72.);
  float A = max(dot(hd*hd, iv), 1e-5), B = dot(hC*hd, iv), Cc = dot(hC*hC, iv), k = sqrt(A);
  float I = exp(-max(Cc-B*B/A, 0.))*.8862/k*(erfA((dist+B/A)*k)-erfA((t0+B/A)*k));
  return uSunCol*(.05*(1.-exp(-max(I, 0.)*.035))*smoothstep(.02, .1, sz));
}
// THE AIR between eye and thing: the scene's haze outside, a dark damp breath inside
vec3 airMix(vec3 col, vec3 P, float dist, float indoor){
  float f = 1.-exp(-uAirDen*uAirDen*dist*dist);
  vec3 air = mix(uAirCol, uGlowCol*.016+uAirCol*.02*dayAt(P), indoor);
  // the cave's own damp air stands in the way for as much of the path as lies behind the mouth's plane: the far end sinks
  // into the dark. In the mouth's throat (its first 6 m) that air is thick with spray, 0.07 a metre: seen from the sea
  // the cave behind it stays a dark slot, whatever glows in there, and it clears as the eye comes in through it
  float cz = min(cameraPosition.z, 0.), pz = min(P.z, 0.), dz = max(abs(cameraPosition.z-P.z), 1e-3);
  float inFrac = cameraPosition.z < 0. && P.z < 0. ? 1. : abs(cz-pz)/dz, thr = abs(max(cz, -6.)-max(pz, -6.))/dz;
  f = 1.-(1.-f)*exp(-dist*(inFrac*.010+thr*.07)*indoor);
  col = mix(col, air, f);
  if(indoor > 0.) col += (shaftAir(P, dist)+sunAir(P, dist))*(1.-f)*indoor;
  return col;
}
`,St=`
attribute vec3 aSide; attribute vec4 iA, iB, iC0, iC1, iC2, iC3, iD, iF0, iF1;
varying vec3 vP, vWp, vN, vT; varying vec4 vF; flat varying vec4 vI, vD; varying vec3 vR; flat varying float vRec, vE, vAir;
float h11(float p){ p = fract(p*.1031); p *= p+33.33; p *= p+p; return fract(p); }
vec2 corner(float k){ k = mod(k+.5, 7.)-.5;
  return k < .5 ? iC0.xy : k < 1.5 ? iC0.zw : k < 2.5 ? iC1.xy : k < 3.5 ? iC1.zw : k < 4.5 ? iC2.xy : k < 5.5 ? iC2.zw : iC3.xy; }
void main(){
  float k = position.x, m = position.y, s = position.z, kind = aSide.z;
  // (iF1.w, order 12: how far the pipe is TAKEN to stand back (under 0) or out from its neighbours, metres, for its
  // shading alone: NO BODY IS MOVED (from inside the cave a sight line slips here and there through a hairline between
  // two wall pipes and ends on the back of the cliff's outer columns: their geometry is part of the look inside the cave))
  float y0 = iA.z, y1 = iA.w, seed = iB.x;
  float topT = mod(iB.y, 4.), botT = floor(iB.y/4.+.01);
  // three master joints: each drum sits a little off the one under it
  float mj = clamp(m, 0., 2.);
  float jy = y0+(y1-y0)*(mj+.5+(h11(seed*91.7+mj*13.1)-.5)*.6)/3.;
  float y = m < -.5 ? y0 : (m > 2.5 ? y1 : jy+s*.02);
  float drum = m < -.5 ? 0. : (m > 2.5 ? 3. : mj+(s > 0. ? 1. : 0.));
  vec2 off = (vec2(h11(seed*57.3+drum*7.7), h11(seed*23.9+drum*11.3))-.5)*.045*step(.5, drum);
  float grow = 1.+(h11(seed*77.1+drum*3.3)-.5)*.03;
  vec2 p2; vec3 N = vec3(0., 1., 0.); vec3 T = vec3(1., 0., 0.);
  vF = vec4(0.); vR = vec3(0.); vAir = -1000.;
  if(kind < .5){
    vec2 cA = corner(aSide.x), cB = corner(aSide.x+1.), d = cB-cA; float len = length(d);
    { float kf = aSide.x;      // (order 12: the height above which this side of the body looks into open air)
      vAir = kf < .5 ? iF0.x : kf < 1.5 ? iF0.y : kf < 2.5 ? iF0.z : kf < 3.5 ? iF0.w : kf < 4.5 ? iF1.x : kf < 5.5 ? iF1.y : iF1.z; }
    p2 = mix(cA, cB, aSide.y)*grow;
    if(len > 1e-4){ N = vec3(d.y, 0., -d.x)/len; T = vec3(d.x, 0., d.y)/len; }
    vF = vec4(aSide.y, len, 1., 0.); vR = vec3(p2.x, y1, p2.y);
  } else {
    bool top = kind < 3.5; float ring = top ? kind-1. : kind-4.;      // 0 rim, 1 inner, 2 centre
    float rr = ring < .5 ? 1. : (ring < 1.5 ? .6 : 0.);
    p2 = corner(k)*rr*grow;
    float ty = top ? topT : botT;
    float a = 0., b = 0.;
    if(top){ if(ty > .5 && ty < 1.5){ a = -.075; b = -.115; } else if(ty > 1.5){ a = .06; b = .09; } }
    else { if(ty > .5 && ty < 1.5){ a = -.09; b = -.14; } else if(ty > 1.5){ a = .07; b = .1; } }
    y += ring < .5 ? 0. : (ring < 1.5 ? a : b);
    N = vec3(0., top ? 1. : -1., 0.);
    vF = vec4(.5, 1., rr, top ? 1. : 2.);
    vR = vec3(p2.x, ty, p2.y);
  }
  vec3 P = vec3(iA.x+p2.x+off.x, y, iA.y+p2.y+off.y);
  vP = P; vN = N; vT = T; vI = vec4(seed, topT, iB.z, iB.w); vRec = iC3.w; vD = iD; vE = iF1.w;
  vec4 wp = modelMatrix*vec4(P, 1.); vWp = wp.xyz;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,At=`
${Ne}
// (vI, vD, vRec belong to a whole pipe: its seed and kind, its open side, its recess. They are FLAT: the same number at
// every pixel of the pipe to the last bit. Carried smoothly, a pipe's seed came out a bit's worth different at some pixels
// of a face, and on a pipe whose seed stands at the edge of a hash's step those pixels drew another pipe's tone: a stipple)
varying vec3 vP, vWp, vN, vT; varying vec4 vF; flat varying vec4 vI, vD; varying vec3 vR; flat varying float vRec, vE, vAir;
// a pipe breaks at its own heights: one cross joint somewhere in the middle half of every 0.8 m of it, so its drums are 0.4
// to 1.2 m tall and no two pipes break in step. None runs level: each is an arc, a cup or a dome across the face (xf: place
// across the face, w: the face's width)
float jointAt(float i, float seed, float xf, float w){
  return i+.5+(h11(i*7.7+seed*51.)-.5)*.68+(xf*(h11(i*7.1+seed*3.)-.5)*.34+(xf*xf-.08)*(h11(i*3.3+seed*11.)-.5)*.8)*min(w/.8, 1.); }
void main(){
  vec3 P = vP; float seed = vI.x, indoor = min(vI.z, 1.), chim = step(1.5, vI.z), outd = 1.-indoor, cave = indoor*(1.-chim);
  vec3 Vv = cameraPosition-vWp; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-4);
  // the back of a pipe is seen only through a hairline between two others, from inside the rock: it is the dark of the rock
  // (but a stump that hangs out over the bell or the nave has no underside drawn: its top, seen from below through its
  // open foot, is drawn AS that underside: a hanging hexagon end that looks down and takes the emerald and the shaft)
  // ORDER 12, THE NEW LOOK'S GROUND OUTSIDE (nw), BY PLACE ALONE: 0 on the mouth's own ground (within 16 m east and
  // west of x = 3, the line that runs into the mouth, up to 12 m, and the mouth's own slot and jambs, within
  // 13 m of x = 0, at every height; behind z = -50 and inside the cave and the blowhole); 1 on the colonnade beyond,
  // coming in over 6 m. Where it is 0 every number below is the one it was, to the bit: each new term stands inside a
  // branch that is not taken there, and no screen derivative is taken inside one
  // AND BY WHAT STANDS BEYOND THE FACE (nwF, by place: vAir, dealt by dealRelief): a side of a pipe wears the new look
  // only above the height from which it looks into OPEN AIR (the sea or the sky beyond the cliff's foot, or the air over
  // a neighbour's broken head), coming in over 0.4 m; a head wears it; a side that looks into the rock or at a
  // neighbour, and an underside, keep the old look to the bit. From inside the cave a sight line slips here and there
  // through a hairline between two wall pipes and ends, across the rock's inside (which carries no bodies), on the
  // rock-side faces of the cliff's outer columns: those faces are part of the look inside the cave (a stack has no
  // rock behind it: all its faces look to the air)
  float nwX = smoothstep(16., 22., abs(P.x-3.));
  float nwF = vN.y < -.5 ? 0. : (vN.y < .5 ? smoothstep(vAir, vAir+.4, P.y) : 1.);
  float nw = outd*smoothstep(-60., -50., P.z)*max(nwX, smoothstep(12., 18., P.y)*smoothstep(13., 16., abs(P.x)))*nwF;
  vec4 vFq = vF;
  if(!gl_FrontFacing){
    if(vF.w > .5 && vF.w < 1.5 && indoor > .5) vFq.w = 2.;
    else if(vF.w < .5 && indoor > .5 && V.y < -.3 && P.y > 8. && length(P.xz-vec2(0., -84.)) < 14.) vFq = vec4(.5, 1., .6, 2.);      // (round the bell, looked up into from below: the inside of a hanging step)
    else { gl_FragColor = vec4(airMix(uBasalt*.02, P, dist, 1.), 1.); return; }
  }
  // FOOTPRINT FILTERS: what a pixel covers of the surface (metres), up it, across it, and across a face. Every line, joint,
  // crack and speckle below fades to the mean of its face as the pixel grows past it; nothing else is read from the eye here
  float fwY = fwidth(P.y), fwX = fwidth(P.x)+fwidth(P.z), fwP = max(fwY, fwX), fwE0 = fwidth(vFq.x);
  float along = P.x*.8+P.z*.6;
  vec3 N = nrm(vN), T = nrm(vT), O = vec3(vD.x, 0., vD.y);
  float ao = 1., sunSh = 1., pool = 0., poolR = .7, prd = 0., rimWet = 0., rimL = 0., crust = 0., dark = 0., darkJ = 0., jsh = 0., edge = 1., filmT = 0., filmL = 0., filmK = 1., turn = 0., hol = .5, wear = 0., hlK = 0., hlJ = 1., hlW = 0., lipH = 0.; vec3 hlN = vec3(0., 1., 0.);
  float hcol = h11(seed*41.3);
  float D = mix(1., dayAt(P), indoor)*(1.-chim);
  float farC = 1.-smoothstep(.07, .26, fwX);                                // a column's own tone and its faces' own turns last until it is a few pixels wide
  // (order 12: in the new look's ground a pipe keeps its own tone far off too: max(farC, 0) is farC itself)
  vec3 alb = uBasalt*.85*mix(.85, .55+.6*hcol, max(farC, .9*nw));
  // (order 12, set in the side-face branch where nw is over 0: the pipe's own round (Nr) and the way its wall looks
  // (nOx), the master joint's shadow line (nLn), the long drum's tone (nTone), a niche where a drum is gone (nNi), its
  // pale sill (nSill) and the lime under it (nDrip), the pipe's nose toward the open side (nNz), the stack it is of (nSt))
  vec3 Nr = vec3(0., 0., 1.); vec2 nOx = vec2(0., 1.);
  float nLn = 0., nTone = 1., nNi = 0., nSill = 0., nDrip = 0., nNz = 1., nSt = 0., nLace = 0.;
  float rough = .78;
  // the sand under this place (inside the sheet's map), and how far over it this point stands
  vec2 muv = (P.xz-uRect.xy)/uRect.zw;
  float inMap = step(0., muv.x)*step(muv.x, 1.)*step(0., muv.y)*step(muv.y, 1.);
  float hf = P.y-(textureLod(uMap, muv, 0.).g*16.-8.);
  vec2 sc;
  if(vFq.w < .5){
    // a side face
    sc = vec2(along, P.y);
    float e = min(vFq.x, 1.-vFq.x)*vFq.y, fwE = fwE0*vFq.y, sgn = vFq.x < .5 ? -1. : 1.;
    float eA = 1.-smoothstep(.03, .14, fwE);
    // the joint between two columns is a crack in shadow; the worn shoulder beside it turns toward the neighbour, so it is
    // lit only where that way looks at a light
    float sh = 1.-smoothstep(0., .075+fwE, e);
    N = nrm(N+T*((vFq.x-.5)*.6+sgn*sh*.6*eA));
    ao *= 1.-eA*.5*sh*sh; edge = sh*eA;
    dark = (1.-smoothstep(.006, .022+fwE*1.2, e))*eA;
    // THE HARD WET HIGHLIGHT of a worn shoulder: a narrow line just inside the crack, which the shoulder shows when its
    // own bearing (half way round to the neighbour's face) looks at a light: the mouth's cold white, the sun's gold where
    // its beam reaches, the shaft's blue-white at the back. Never thinner than its share of a pixel (then as much fainter)
    hlK = smoothstep(.012, .03, e)*(1.-smoothstep(.045, .07+fwE, e))*(1.-smoothstep(.022, .075, fwE));
    hlN = nrm(N+T*sgn*.9);
    // (and beside it a soft run of light a hand's length wide down the shoulder: the sun's gold where its beam reaches)
    hlW = smoothstep(.008, .03, e)*(1.-smoothstep(.06, .24, e))*(1.-smoothstep(.1, .3, fwE));
    // cross joints: the one under this point and the one over it, and the drum between them
    float yq = (P.y+seed*13.)/.8, ci = floor(yq), xf = vFq.x-.5;
    float jm = jointAt(ci, seed, xf, vFq.y), upj = step(jm, yq), jo = jointAt(ci+2.*upj-1., seed, xf, vFq.y);
    float id = ci+upj-1., dA = max(mix(jm, jo, upj)-yq, 0.)*.8, dB = max(yq-mix(jo, jm, upj), 0.)*.8;
    float jA = 1.-smoothstep(.02, .075, fwY), jW = 1.-smoothstep(.12, .45, fwY);      // (a joint is seen only near: gone before a pixel is a hand wide)
    // (NO RULED GRID: a joint stands anywhere in its 0.8 m, bowed and tilted, and a third of the joints are closed so
    // tight that nothing of them shows: the drums are 0.15 to 2.5 m tall, no two pipes alike)
    float cl0 = step(h11(id*5.9+seed*29.), .36), cl1 = step(h11((id+1.)*5.9+seed*29.), .36);
    float cl0b = cl0*step(h11((id-1.)*5.9+seed*29.), .36), tid = id-cl0-cl0b-cl0b*step(h11((id-2.)*5.9+seed*29.), .36);      // (drums that a closed joint parts are one drum: one tone, one turn)
    dA += cl1*9.; dB += cl0*9.;
    float hd = h11(tid*1.31+seed*97.), hd2 = h11(tid*3.7+seed*5.);
    alb *= mix(1., .86+.28*hd, jW);                                         // each drum has its own tone (a little: never a tile)
    turn = (hd2-.5)*.16*jW;                                                  // and its own slight turn (given below, where no crust lies over it): the highlight breaks at every joint
    // a third of the joints are tight and flush: a hairline. At the others one drum stands a finger proud of the other, the
    // upper or the lower: a step of light and shadow
    float kA = h11((id+1.)*5.3+seed*19.), kB = h11(id*5.3+seed*19.);
    float pA = step(.34, kA)*step(kA, .67), qA = step(.67, kA), pB = step(.34, kB)*step(kB, .67), qB = step(.67, kB);
    float wA = .03+.07*h11((id+1.)*2.1+seed*7.);
    float shA = pA*(1.-smoothstep(0., wA+fwY, dA));                         // the shadow of the proud drum above, on this one's head
    float lipA = qA*(1.-smoothstep(0., .035+fwY, dA));                      // this drum's own proud head: a ledge that takes the light from above
    float shB = qB*(1.-smoothstep(0., .03+fwY, dB));                        // the corner over the proud ledge of the drum below
    float lipB = pB*(1.-smoothstep(0., .035+fwY, dB));                      // this drum's proud foot: its under-lip looks down at the water
    jsh = jA*(.55*shA+.5*shB);
    float kN = dA < dB ? kA : kB;
    darkJ = (1.-smoothstep(.003, .012+fwY*1.2, min(dA, dB)))*jA*mix(.06, .5, h11((dA < dB ? id+1. : id)*9.1+seed*3.3))*mix(.2, 1., step(.34, kN));   // some joints gape, some are closed tight
    // (A JOINT IS A DARK GROOVE WITH A HAIR OF LIGHT ON THE LIP BELOW IT: the lip takes a little more of whatever light its
    // face has; it turns no mirror and no glint, so no joint is ever a bright rule: the gilt is the long edges')
    lipH = jA*smoothstep(.004, .014, dA)*(1.-smoothstep(.016, .04+fwY, dA));
    // (a drum is a little barrel: its head rounds up to the joint, its foot down: the film's sheen has a shape on each drum)
    filmT = (hd2-.5)*.4*jW; filmL = clamp((dB-dA)/max(dA+dB, .05), -1., 1.)*.16*jW*(1.-cl0)*(1.-cl1);
    // where the water pours off a broken head, and here and there on a worn shoulder, the crust is scoured off (vR.y: the
    // height of this pipe's head)
    // and down the tracks of the ropes that run off it, a metre or so
    float topD = vR.y-P.y;
    wear = max(1.-smoothstep(.1, .55, topD+(vn(vec2(along*4., seed*9.))-.5)*.2), sh*eA*smoothstep(.4, .62, vn3(P*vec3(2.6, 1.9, 2.6))));
    wear = max(wear, smoothstep(.5, .68, vn(P.xz*2.9+3.)+.12*(vn(vec2(along*9., P.y*2.))-.5))*(1.-smoothstep(.25, 1.7, topD)));
    // the film's mirror: a face a pixel or two wide draws no more of it than its share (fwE0: the share of the face's
    // width under one pixel), and it breaks at every cross joint: each drum mirrors by its own measure, none at the joint
    filmK = (1.-smoothstep(.2, .65, fwE0))*mix(1., (.7+.3*hd)*smoothstep(0., .05+fwY, min(dA, dB)), jW);
    hlJ = mix(.6, (.25+.75*hd2)*smoothstep(0., .06+fwY, min(dA, dB))*smoothstep(.25, .6, vn(vec2(seed*40.+sgn*3., P.y*1.1))+.25*hd), jW);
    // INSIDE, A PIPE IS A ROUND THING STANDING BEFORE ITS NEIGHBOURS: its nose (the part of it that looks out of the wall)
    // takes the light, its flanks fall away into the hollow between two pipes, which stays dark. This parts the wall's
    // light into columns for as long as a pipe is a pixel or two wide: the nave is an organ, far off too
    if(dot(O, O) > .25){
      float nose = dot(vR.xz*inversesqrt(max(dot(vR.xz, vR.xz), 1e-6)), O.xz);
      hol = (1.-smoothstep(.05, .85, nose))*(1.-.5*sh*eA);
      gNose = 1.-indoor*.72*(1.-smoothstep(-.1, .75, nose))*(1.-smoothstep(.45, 1.3, fwX)); ao *= gNose;
    }
    // a neighbour standing proud throws its shadow from the sunward edge
    float sside = dot(uSunDir, T) > 0. ? (1.-vFq.x) : vFq.x;
    float wsh = .5*(h11(seed*77.+T.x*31.+T.z*17.)-.3);
    sunSh = mix(1., smoothstep(wsh-.03, wsh+.05, sside*vFq.y), eA);
    float noseS = dot(vR.xz*inversesqrt(max(dot(vR.xz, vR.xz), 1e-6)), uSunDir.xz*inversesqrt(max(dot(uSunDir.xz, uSunDir.xz), 1e-6)));
    // (and by the mouth's daylight: a pipe's side toward the mouth is lit, its flank away from it dark: no flat panel)
    vec2 toM = vec2(1.5, 3.)-P.xz; gMouthR = mix(1., .12+.88*smoothstep(-.3, .65, dot(vR.xz*inversesqrt(max(dot(vR.xz, vR.xz), 1e-6)), toM*inversesqrt(max(dot(toM, toM), 1e-6)))), cave*(1.-smoothstep(.45, 1.3, fwX)));
    sunSh *= mix(1., smoothstep(-.35+.2*cave, .55+.2*cave, noseS), max(outd*(1.-smoothstep(.2, .55, uSunDir.y)), cave)*(1.-smoothstep(.45, 1.3, fwX)));      // (inside too, where the sun comes down the nave)
    // (and by the shaft's light: a pipe's side toward the beam is lit, its side away from it dark)
    vec2 toS = vec2(0., -80.4)-P.xz; gShaftR = mix(1., .08+.92*smoothstep(-.35, .6, dot(vR.xz*inversesqrt(max(dot(vR.xz, vR.xz), 1e-6)), toS*inversesqrt(max(dot(toS, toS), 1e-6)))), cave*(1.-smoothstep(.45, 1.3, fwX)));
    // far off a pipe is one round thing: its faces' turns melt to the way the whole body looks
    // (ORDER 12: in the new look's ground to ITS OWN ROUND, the way from its axis out through this place, far off wholly
    // and near by a half: a pipe is a pipe from thirty metres, not a board. Elsewhere, as it was, to the way its wall looks)
    if(nw > 0.){
      Nr = vec3(vR.x, 0., vR.z)*inversesqrt(max(dot(vR.xz, vR.xz), 1e-6));
      // (the way the pipe's wall looks: its open side; on a stack, out from the stack's own middle, by place)
      vec2 stC = P.x > 0. ? vec2(63., 46.) : vec2(-57., 60.), stR = P.xz-vR.xz-stC;
      nSt = 1.-step(100., dot(stR, stR));
      nOx = dot(O, O) > .25 ? O.xz : (nSt > .5 ? stR*inversesqrt(max(dot(stR, stR), 1e-4)) : vec2(0., 1.));
      nNz = dot(Nr.xz, nOx);
      // MASTER JOINTS: one somewhere in every 2.9 m of a pipe, a shadow line that lasts where the fine joints have
      // melted; the long drums between them each of its own tone and turned a little, so the gloss breaks at them. Here
      // and there (one joint in seven) THE DRUM UNDER THE JOINT IS GONE for 0.3 to 1.5 m: a dark niche with a pale sill
      float pq = (P.y+seed*41.)/2.9, pj = floor(pq), jm = pj+.5+(h11(pj*5.1+seed*61.)-.5)*.76;
      float did = pj+step(jm, pq), dj = (pq-jm)*2.9, fm = 1.-smoothstep(.35, 1.5, fwY);
      nTone = mix(1., .79+.42*h11(did*3.17+seed*83.+.5), fm);
      nLn = (1.-smoothstep(.015, .05+fwY, abs(dj)))*clamp(.12/max(fwY, 1e-3), 0., 1.);
      float nh = min(.7+.8*h11(pj*1.9+seed*7.), (jm-pj)*2.9-.1), isN = step(h11(pj*9.7+seed*23.), .14)*fm*(1.-nSt);
      nNi = isN*smoothstep(-nh-.5*fwY, -nh+.04+.5*fwY, dj)*(1.-smoothstep(-.04-.5*fwY, .5*fwY, dj));
      nSill = isN*(1.-smoothstep(.02, .1+fwY, abs(dj+nh+.07)));
      nDrip = isN*smoothstep(-nh-2.2, -nh-.1, dj)*(1.-smoothstep(-nh-.12, -nh-.02, dj));
      float tr = (h11(did*5.3+seed*31.)-.5)*.5*fm, ca = cos(tr), sa = sin(tr);
      Nr = vec3(Nr.x*ca-Nr.z*sa, 0., Nr.x*sa+Nr.z*ca);
      vec3 No = dot(O, O) > .25 ? nrm(mix(N, O, (1.-farC)*.8)) : N;
      N = nrm(mix(No, nrm(mix(N, Nr, mix(.85, .5, farC))), nw));
    } else if(dot(O, O) > .25) N = nrm(mix(N, O, (1.-farC)*.8));
  } else {
    // a broken end: a cup holding a disc of water, a dome, or a flat break
    sc = P.xz;
    vec2 rd = vR.xz; float rl = length(rd); rd = rl > 1e-4 ? rd/rl : vec2(1., 0.);
    float ty = vR.y, rad = vFq.z, up = vFq.w < 1.5 ? 1. : -1.;
    float sl = ty > .5 && ty < 1.5 ? -smoothstep(.15, .95, rad)*.55 : (ty > 1.5 ? smoothstep(.1, 1., rad)*.5 : 0.);
    N = nrm(vec3(rd.x*sl*up, up, rd.y*sl*up)+vec3(vn(P.xz*9.)-.5, 0., vn(P.xz*9.+7.)-.5)*.25);
    float tA = 1.-smoothstep(.03, .14, fwP);
    dark = smoothstep(.9, .98, rad)*tA*.7;
    rimL = up > 0. ? smoothstep(.74, .86, rad)*(1.-smoothstep(.9, .97, rad))*tA : 0.;   // the worn rim of a top
    // the cup's disc: brimming to the rim while the wet line still stands over this top, sunk back when it has drained
    float brimC = smoothstep(P.y-.5, P.y+.15, max(uWetLine, levelAt(P.z)));
    poolR = mix(.68, .93, brimC)*mix(1., .76, indoor);                        // (inside, a dark wet rim of rock frames each disc)
    prd = rad;
    if(up > 0. && ty > .5 && ty < 1.5) pool = 1.-smoothstep(poolR-.04, poolR+.04, rad);
    // inside, a flat break holds a puddle of its own: ragged, smaller, a finger deep
    if(up > 0. && ty < .5 && indoor > .5){ poolR = mix(.34, .6, vn(P.xz*.7+seed*17.))*mix(.75, 1., brimC); prd = rad+(vn(P.xz*6.+seed*5.)-.5)*.22; pool = 1.-smoothstep(poolR-.05, poolR+.05, prd); }
    alb *= .85+.3*vn(P.xz*5.+seed*9.);
    rimWet = up > 0. ? mix(.25, .8, brimC) : .1;
  }
  // the rock's own skin: pitted and mottled, its relief turning the light; all of it melts with distance
  float skin = 1.-smoothstep(.012, .09, fwP);
  vec2 gp = vec2(along, P.y)*5.5+seed*7.;
  float g0 = vn(gp)*.6+vn(gp*3.7)*.4, g1 = vn(gp+vec2(.25, 0.))*.6+vn(gp*3.7+vec2(.25, 0.))*.4, g2 = vn(gp+vec2(0., .25))*.6+vn(gp*3.7+vec2(0., .25))*.4;
  // (the wet film lies smooth over the pits; for its mirror a pipe is a round thing, so every pipe that shows the right
  // flank carries the streak, and each drum's own turn breaks it at the cross joints)
  vec3 Nf = N;
  if(vFq.w < .5){ Nf = nrm(nrm(vN)+T*((vFq.x-.5)*1.15+filmT)+vec3(0., filmL, 0.));
    if(nw > 0.){ vec3 Nfo = dot(O, O) > .25 ? nrm(mix(Nf, O, (1.-farC)*.8)) : Nf; Nf = nrm(mix(Nfo, nrm(mix(Nf, Nr, mix(.85, .5, farC))+vec3(0., filmL, 0.)), nw)); }      // (order 12: the film too follows the pipe's own round there)
    else if(dot(O, O) > .25) Nf = nrm(mix(Nf, O, (1.-farC)*.8)); }
  if(vFq.w < .5) N = nrm(N+(T*(g0-g1)+vec3(0., g0-g2, 0.))*1.5*skin);
  alb *= mix(1., .62+.76*g0, skin)*mix(1., .85+.3*vn(vec2(along, P.y)*31.+seed*7.), 1.-smoothstep(.006, .03, fwP));
  vec3 alb0 = alb;
  gCalm = vFq.w < .5 ? cave*(1.-smoothstep(-11.5, -9., P.x-vR.x))*step(6.2, vR.y) : 0.;
  tideBands(P, sc, seed, D, fwP, cave*(1.-.65*D), hol, wear, alb, rough, crust);
  // (THE TAR BELT inside is a thin dark stain over the white belt (gTar is a fifth of it there): the film, the net and
  // the hard white line are hardly dimmed by it)
  float tarK = gTar*cave;
  if(vFq.w < .5) N = nrm(N+T*turn*(1.-.85*crust));                           // a drum's own turn, where no crust lies over it
  // inside, the top of a stump is scoured: a dark wet hexagon; its crusts grow on its flanks
  float topK = vFq.w > .5 && vFq.w < 1.5 ? .85*cave : 0.;
  alb = mix(alb, alb0*.8, topK); crust *= 1.-topK; rough = mix(rough, .78, topK);
  // water: the wet line trails the highest recent level; under it the rock is soaked and a film sheets down
  // (the cliff's foot stands in the open sea: its water is the sea's, its wet line the swash's reach)
  float seaK = outd*smoothstep(9., 13., abs(P.x)+max(P.z-4., 0.));
  float lv = mix(levelAt(P.z), uSea, seaK), wl = mix(max(uWetLine, lv), uSea+1., seaK);
  float wnoise = (vn(vec2(along*1.7, 3.))-.5)*.5;
  float soak = 1.-smoothstep(wl-.15+wnoise, wl+.45+wnoise, P.y);
  // (outside: uneven from column to column and in broad patches; inside all the rock is wet alike: the green on it is the
  // water's light, never a cloud in the stone)
  float damp = mix(.4+.24*vn(vec2(along*.6, P.y*.3))+.2*(h11(seed*29.)-.5), .84+.06*(h11(seed*29.)-.5), indoor);
  // the mouth's jambs stand in the spray: wet black rock (under a low sun dark slate, its light a sheen on the film)
  float jamb = outd*(1.-smoothstep(9., 16., abs(P.x)))*(1.-smoothstep(1., 7., P.z))*(1.-smoothstep(10., 22., P.y));
  damp = max(damp, .92*jamb); alb *= 1.-.45*jamb*(1.-.7*crust);
  float band = smoothstep(lv, lv+.25, P.y)*soak;
  float streak = vn(vec2(along*7., P.y*.55+uTime*1.5))*vn(vec2(along*19.+3., P.y*.21+uTime*.8));
  float film = band*smoothstep(.16, .45, streak)*(1.-smoothstep(.05, .3, fwP));
  float wet = clamp(max(damp, soak)+rimWet+film, 0., 1.);
  alb *= mix(1., .62, soak*(1.-.7*crust));                                  // wet rock is darker; a wet crust keeps its colour
  rough = mix(rough, .26, wet*wet*(1.-.8*max(crust, .85*tarK)));
  rough = mix(rough, .1, film*(1.-crust));                                   // the film behind the falling level: glass over the rock, not paint
  rough = mix(rough, .85, smoothstep(0., .12, lv-P.y)*indoor);               // (under the sheet there is no film to mirror the mouth: the sheet does that)
  dark = max(dark, darkJ*(1.-.4*crust)); ao *= 1.-jsh*(1.-.3*crust);          // a joint breaks a crust too: a dark line across it
  alb *= 1.-.92*dark;                                                        // cracks and grooves: in shadow, never a bright line
  // ORDER 13, IN THE NEW LOOK'S GROUND (nw, by place): THE WET FOOT OF THE WALL AND OF THE STUMPS IS WET BLACK ROCK. The
  // pale belts of the tide (barnacle white, rose) lay on whole faces there, five times as light as the rock beside
  // them, and in the shade the cold turn made bright blue-green panes of them: glass boxes. From the water as it stands
  // up to some four metres over it (ragged from pipe to pipe) no crust is lighter than the wet rock under it by more
  // than a third: the belts are still there, as the rock's own darker and lighter growth, on sides and tops alike
  if(nw > 0.){
    float lz13 = nw*(1.-smoothstep(3.5, 5.5, P.y-uSea-2.*wnoise));
    alb *= mix(1., min(1., 1.3*dot(alb0, vec3(.3, .5, .2))*(1.-.92*dark)*mix(1., .62, soak)/max(dot(alb, vec3(.3, .5, .2)), 1e-4)), lz13);
  }
  // ORDER 12, THE MARKS OF HEIGHT AND OF BUILD on the colonnade outside (nw, by place), all of them the rock's own
  // colour, none a light: each long drum its own tone; A WET DARK BAND over the water, riding with the sea's level, its
  // upper edge ragged from pipe to pipe; DARK SEEP running down in long stains from the cap and the ledges; PALE LIME
  // under a free head where birds sit, on a niche's sill and in streaks under both; OCHRE LICHEN in patches under the
  // cap, from some 20 m up. A stack is wet black rock all over (the spray's)
  if(nw > 0. && vFq.w < .5){
    float headD = vR.y-P.y, freeH = step(.5, vI.y)*(1.-smoothstep(36.5, 38., vR.y))*smoothstep(4., 8., vR.y-uSea);      // (order 13: no lime on a head the sea washes, under some 4 m over the water: the plinth's stumps stood as pale blocks)
    float sA = vn(vec2(along*2.1+seed*5., P.y*.05+3.)), sB = vn(vec2(along*5.3+3., P.y*.11+seed*9.));
    float seep = smoothstep(.52, .78, sA*.65+sB*.35)*smoothstep(8., 30., P.y+10.*sA);
    float lim = smoothstep(.38, .7, vn(vec2(along*8.+seed*3., P.y*.22)));
    float pale = freeH*max((1.-smoothstep(.08, .4, headD))*.9, (1.-smoothstep(.3, 1.5+2.5*h11(seed*71.), headD))*lim);
    pale = max(pale, max(nSill, .35*nDrip*lim))*(1.-nNi);          // (order 13: the lime under a niche is a faint streaked stain: it stood as a pale block a drum long and, in the shade, as a blue-green pane)
    float och = smoothstep(20., 28., P.y+(vn(vec2(along*.3, 7.))-.5)*9.)*smoothstep(.4, .62, fbm2(sc*.4+11.)+.25*(hcol-.5));
    float wb = 1.-smoothstep(1.4, 3.4, P.y-uSea-2.4*h11(seed*19.)-2.*wnoise);
    alb *= mix(1., nTone, .9*nw*(1.-.5*wb));                       // (order 13: in the wet band a drum's own tone is held to half its spread: no wet drum is lighter than the one beside it by more than a third)
    alb *= 1.-nw*(.4*seep*(1.-.5*crust)+.45*wb*(1.-.6*crust)+.55*nNi);
    alb = mix(alb, mix(uOchre, vec3(.2, .19, .1), .3)*.3*(.7+.6*g0), .75*nw*och*(1.-nNi));
    alb = mix(alb, vec3(.34, .35, .31)*(.8+.4*g0), .6*nw*pale);
    wet = max(wet, nw*max(.9*wb, .55*nSt)); rough = mix(rough, .3, nw*max(.6*wb, .3*nSt)*(1.-.8*crust));
    crust = max(crust, .7*nw*max(och, pale));
  }
  // outside, the swash runs up the causeway's stumps and drains back, leaving lace
  float sw = uSea+.45+.4*sin(uTime*.9+along*.11)+.5*vn(vec2(along*.23, uTime*.35));
  float surf = seaK*(1.-smoothstep(sw-.15, sw+.25, P.y+.3*g0))*smoothstep(uSea-1.2, uSea-.3, P.y);
  float lace = surf*smoothstep(.42, .7, fbm2(vec2(along*.9, P.y*2.2-uTime*.6)+P.xz*.7)+.25*surf);
  alb = mix(alb, uFoamCol*.6, lace*.85); rough = mix(rough, .9, lace);
  // (ORDER 12: in the new look's ground THE WHITE WATER AT THE COLUMNS' FEET goes by the swell's own clock and rides at
  // the water's edge wherever the sea stands: its top is the sea's level (uSea) and the law's own swell at this place
  // of the rock (seaSwell) and, as a crest stands at the foot, a run of white up the stump that drains in the trough
  // behind it; broken, never a ruled band)
  if(nw > 0. && seaK > 0.){
    vec3 s12 = seaSwell(P.xz, uTime); float am12 = mix(1., 2., smoothstep(.45, 1., uWind)), srg = smoothstep(-.18, .26, s12.x/am12);
    float top12 = uSea+s12.x+.1+(.2+.9*srg*srg)*1.41*(.5+.8*vn(vec2(along*.31, uTime*.3)));
    float sf12 = (1.-smoothstep(top12-.5, top12+.15, P.y+.35*g0))*smoothstep(uSea-1.4, uSea-.4, P.y);
    nLace = nw*sf12*smoothstep(.4-.2*srg, .68-.2*srg, fbm2(vec2(along*.8, P.y*1.7-uTime*.8)+P.xz*.6)+.3*sf12);
    // (ORDER 13: A THIN BRIGHT LINE AT THE WATERLINE on a pipe's or a stump's side: where the water stands against the wet
    // black rock at this moment (the sea's level and the law's own swell at this place of the rock) a hand's breadth of
    // white, a little broken along the rock; it has its footprint filter. And the run of white up the rock is by day
    // what it is in a gale (1.41: the root of the gale's 2), so the band at the feet rises and falls as heavily)
    if(vFq.w < .5) nLace = max(nLace, nw*.8*(1.-smoothstep(.04, .1+fwY, abs(P.y-uSea-s12.x-.05)))*clamp(.14/max(fwY, 1e-3), 0., 1.)*(.45+.55*smoothstep(.25, .6, vn(vec2(along*1.7, uTime*.3)))));
    alb = mix(alb, uFoamCol*.75, nLace); rough = mix(rough, .9, nLace); crust = max(crust, .8*nLace);
  }
  // inside, where the surge piles against the back wall, a little spray lifts up the rock's foot and drains back as lace
  float spr = cave*clamp(uPile, 0., 1.5)*(1.-smoothstep(-86., -64., P.z));
  spr *= (1.-smoothstep(lv+.1, lv+.5+1.5*spr, P.y+.5*g0))*smoothstep(lv-.3, lv+.05, P.y);
  float sprL = spr*smoothstep(.42, .7, fbm2(vec2(along*1.3, P.y*1.3-uTime*1.3))+.3*spr)*(1.-smoothstep(.1, .5, fwP));
  alb = mix(alb, uFoamCol*.45, sprL*.75); rough = mix(rough, .9, sprL); crust = max(crust, sprL*.8);
  // the feet: weed-dark toward the sand, and a ground shadow where the pipe meets it (the sand darkens to meet it)
  float kn = vn(vec2(along*1.1, 23.))*1.5+vn(vec2(along*4.3, P.y*1.3))*.5;
  float weed = inMap*(1.-smoothstep(.15, 1.3+kn, hf));
  alb = mix(alb, vec3(.012, .02, .012), weed*.9);
  float touch = inMap*(1.-smoothstep(0., .5, hf));
  // the caustic net crawling on walls, roof and tops: its meshes 1.7 and 3 m, its filaments a hand to a forearm wide, a
  // little taller than wide on a wall, softer with height over the water
  float flatS = step(.6, abs(N.y));
  // ONE SCALE ON EVERY FACE, whatever way it looks: on a pipe's sides the net is laid as on a round thing: across, the
  // pipe's own girth unrolled from its nose (the way its wall looks, taken to the nearer of the four quarters), carried
  // on from pipe to pipe by the pipe's place along the wall; up, its height. On a top or an underside, by place
  vec2 Oq = dot(O, O) > .25 ? (abs(O.x) > abs(O.z) ? vec2(O.x > 0. ? 1. : -1., 0.) : vec2(0., O.z > 0. ? 1. : -1.)) : vec2(1., 0.), tQ = vec2(-Oq.y, Oq.x);
  vec2 rv = vR.xz; float rvl = length(rv); vec2 rdn = rvl > 1e-4 ? rv/rvl : Oq;
  float girth = dot(P.xz-rv, tQ)+rvl*atan(dot(rdn, tQ), dot(rdn, Oq)+1e-5);
  vec2 cuv = mix(vec2(girth, P.y-uTime*.03), P.xz, flatS)/6.;
  // (on the wall behind the pavement the net is SLOW: each pipe there, by its own place, runs it at four tenths the pace)
  float cnet = causLight(cuv, uTime*mix(.3, .12, cave*step(P.x-vR.x, -10.2)), fwP/6., .85+.06*clamp(P.y-lv, 0., 24.))*mix(1., .8+.4*g0, skin*(1.-flatS));
  // (in the flood the net quickens: a second, faster net runs over the first; a little brighter, no more: the foam on
  // the water lets less light up)
  if(uFlood > 0.) cnet = mix(cnet, causLight(cuv*1.25+.37, uTime*.75, fwP/4.8, .85+.06*clamp(P.y-lv, 0., 24.)), .6*uFlood*smoothstep(-11.5, -9., P.x))*(1.+.15*uFlood);      // (not on the quiet wall behind the pavement)
  cnet = mix(cnet, .5, .6*tarK);
  // (on the pavement's blocks the net is faint: a stump's own form reads first, its dark head, its shining cup, its crust)
  cnet = mix(cnet, .55, .6*cave*(1.-smoothstep(4.6, 6.2, vFq.w < .5 ? vR.y : P.y)));
  // outside: a pipe standing back from its neighbours is in their shadow. A prouder part of the face cuts the sun off a bay
  // (vD.zw: the tangents of how far round the sky stands open to east and west of the body's open side); the cap's brow,
  // vRec metres out over the body, throws its shadow down the pipes; and a bay sees less of the sky
  sunSh *= 1.-outd*.6*(1.-smoothstep(0., .35, h11(seed*13.7)))*farC;
  vec2 Oh = dot(O, O) > .25 ? O.xz : vec2(0., 1.);
  float sf = dot(uSunDir.xz, Oh), tanAz = dot(uSunDir.xz, vec2(Oh.y, -Oh.x))/max(sf, .03);
  float openS = smoothstep(-.3, .3, (tanAz > 0. ? vD.z : vD.w)-abs(tanAz));
  float capS = mix(1., smoothstep(-.7, .7, 37.4-vRec*uSunDir.y/max(sf, .05)-P.y), step(.05, vRec)*step(P.y, 39.));
  sunSh *= mix(1., openS*capS, outd);
  // (ORDER 12, in the new look's ground: a pipe taken to stand back (vE under 0: metres; paint) is in the shadow of the prouder
  // neighbour on the sun's side, as far across it as the sun's bearing throws it; the hollow between two pipes is dark
  // (nNz: the pipe's nose toward its open side); a niche is in the shade of the drum over it, its foot alone in the sun)
  if(nw > 0. && vFq.w < .5){
    float bk = max(-vE, 0.), across = dot(vR.xz, vec2(Oh.y, -Oh.x))*(tanAz > 0. ? 1. : -1.);
    float cst = step(.04, bk)*smoothstep(-.08, .08, across-(.5-bk*abs(tanAz)));
    sunSh *= 1.-nw*max(cst, nNi*.85);
    ao *= mix(1., (.5+.5*smoothstep(-.3, .55, nNz))*(1.-.55*nLn)*(1.-.5*nNi)*(1.-.35*smoothstep(.1, .45, bk)), nw);
  }
  float skyOpen = (vD.z/(1.+vD.z)+vD.w/(1.+vD.w))/1.72;
  float sky = mix(1., (.3+.7*skyOpen)*(1.-.8*smoothstep(1., 7., vRec)*smoothstep(16., 34., P.y)), outd);      // (a recess sees little of the sky; under the cap its pipes' upper ends die into shade)
  vec3 col = shade(P, N, Nf, V, alb, rough, wet, indoor, chim, ao*(1.-.6*dark), sunSh, cnet, crust, edge, filmK, O, sky);
  // ORDER 13, IN THE NEW LOOK'S GROUND (nw, by place): THE WET FILM'S FLAT SHEEN OF THE SKY IS A DIM COOL ONE. shade() gives
  // a wet face the sky's sheen by its flat normal, four times as strong where the mirrored sight line rises as where it
  // falls: low on the wall and on the stumps' tops, a few metres over the water, whole wet faces stood as bright panes
  // beside dark ones. Here that term is taken out again (the same numbers: what is left is never under zero) and, after
  // the shade has been turned cold below, laid back at no more than two fifths of its upper strength, eased over the
  // level look, in the sky's own colour. (THIS READS THE EYE'S BEARING as the term it replaces does: named at the head)
  vec3 sh13 = vec3(0.);
  if(nw > 0.){
    float Ry13 = reflect(-V, N).y;
    vec3 s13 = uSkyCol*((1.-indoor)*(.04+.96*pow(clamp(1.-max(dot(N, V), 0.), 0., 1.), 5.))*mix(.12, 1., wet*wet)*ao*(1.-.6*dark)*wet*sky*(1.-rough));
    col = max(col-nw*s13*(Ry13 > 0. ? .5 : .12), 0.);
    sh13 = nw*s13*mix(.1, .2, smoothstep(-.4, .4, Ry13));
  }
  // a bay is in shade, not in the dark: the day comes back into it off the sea and off the lit buttress beside it, and
  // its wet shoulders take the most of that: dark slate with wet edges (the mouth alone is black)
  col += outd*(1.-openS*capS)*alb*ao*(1.-.6*dark)*(mix(uSkyCol, vec3(dot(uSkyCol, vec3(.3, .5, .2))), .6)*.7+uSunCol*(.03+.1*max(uSunDir.y, 0.)))*(1.+1.5*edge*wet);
  // (deep shade outside is the cold teal-black, never a flat blue: the pipes in a recess are faintly seen by their wet
  // shoulders and by the light that comes back off the sea)
  float shd = outd*(1.-openS*capS);
  col = mix(col, uDeep*(dot(col, vec3(.3, .5, .2))/max(dot(uDeep, vec3(.3, .5, .2)), 1e-4)), .5*shd)*(1.-.3*shd*(1.-skyOpen));
  // (ORDER 13, nw by place: THE COLD TURN OF THE SHADE IS THE DARK ROCK'S. What is light in the shade (lime, a crust, a wet
  // top) was turned to the teal by half in the line above and stood as a bright blue-green pane; there it takes its own colour back
  // in the sky's cool light: that turn is undone by the share its lightness has (the same numbers, worked back))
  if(nw > 0.){
    float a13 = .5*shd, L13 = dot(col, vec3(.3, .5, .2));
    vec3 un13 = (col-a13*uDeep*(L13/max(dot(uDeep, vec3(.3, .5, .2)), 1e-4)))/(1.-a13);
    col = mix(col, max(un13, 0.), nw*smoothstep(.06, .22, L13));
  }
  // NOTHING LARGE IS PURE BLACK OUTSIDE: a face the sun does not reach takes the sky's fill off the open sea before it
  // and, under a low sun, the warm light that comes back off the lit rock and the water (most by the mouth, where the
  // lit jamb stands across from it); its wet shoulders show its pipes
  float unlit = outd*(1.-sunSh*smoothstep(0., .25, dot(N, uSunDir)));
  vec3 sunGm = uSunCol*mix(vec3(1.), uSunCol/max(max(uSunCol.r, uSunCol.g), max(uSunCol.b, 1e-3)), .7);
  // (it is the wet film that gives it back, not the black rock: a broad sheen, most on what looks out to sea and up,
  // so a pipe in shade is a round wet thing)
  float seaW = .3+.7*max(dot(Nf, vec3(0., .45, .893)), 0.), lowB = (1.-smoothstep(.2, .55, uSunDir.y))*step(0., uSunDir.z);
  col += unlit*ao*(1.-.6*dark)*(1.-.5*crust)*(.4+.6*sky)*(uSkyCol*(.07+.11*wet)*seaW+sunGm*((.012+.04*jamb)*lowB*(.5+.5*seaW)));
  // ORDER 12, THE SHADE OF THE COLONNADE OUTSIDE (nw, by place) IS DARK WET BASALT DRAWN BY ITS GLOSS, never a flat
  // tone: what the sun does not reach is taken down (to six tenths on a pipe's nose, to a fifth in the hollow between
  // two pipes) and turned to the cold teal-black; and THE WET FILM MIRRORS THE SKY as on a round thing: a rib of the
  // sky's own colour on the part of each pipe whose mirror looks out over the sea, none where it looks along the wall
  // or into the rock, more at a grazing look. THIS READS THE EYE'S BEARING (V), as every mirror does; it is named at the
  // head. Nothing here is a light from below, and nothing is lighter than the sky that it mirrors
  if(nw > 0. && vFq.w < .5){
    float seam = 1.-smoothstep(-.3, .55, nNz), k12 = nw*unlit;
    // (A STACK stands alone under the whole sky and was a black cut-out: its shade takes a little of the sky's fill,
    // most on the pipes' noses that look out from its middle, and so comes to the cliff's own shade: dark, cold)
    col += k12*nSt*uSkyCol*alb*ao*(.3+.7*smoothstep(-.2, .8, nNz))*.5;
    vec3 teal = uDeep*(dot(col, vec3(.3, .5, .2))/max(dot(uDeep, vec3(.3, .5, .2)), 1e-4));
    col = mix(col, teal, k12*(.25+.45*seam)*(1.-smoothstep(.06, .22, dot(col, vec3(.3, .5, .2)))));      // (order 13: the cold turn is the dark rock's; what is light in the shade keeps its own colour)
    col *= 1.-k12*mix(.4+.4*seam, .2+.5*seam, nSt);
    vec3 Rf = reflect(-V, Nf);
    float outK = smoothstep(-.15, .55, dot(Rf.xz*inversesqrt(max(dot(Rf.xz, Rf.xz), 1e-6)), nOx));
    // (A STACK stands free: at its limb the mirrored sight line runs on past it into the open sky, so its outline and
    // each pipe's edge carry the sky's rim: THE LIT RIM, cold, the sky's own colour)
    outK = max(outK, nSt);
    float Fg = .05+.95*pow(clamp(1.-max(dot(Nf, V), 0.), 0., 1.), 3.);
    // (order 13: the rib on a soaked face is no more than a third over the rib on the damp pipe beside it: .45 to .65)
    col += nw*uSkyCol*(outK*Fg*mix(.45, .65, wet)*(1.-.8*crust)*(1.-.8*nNi)*ao*(.35+.65*sky)*mix(.45, .8, unlit));
  }
  // (order 13: the film's flat sheen, dim and cool: see above. And THE WET FOOT IS DARK: the stumps stand in the open
  // under the whole sky and their wet faces took twice the light of the pipes of the wall behind them; from the water
  // up to some four metres over it everything but the white water is taken down by three tenths, by place)
  if(nw > 0.){ col += sh13; col *= 1.-.3*nw*(1.-smoothstep(3.5, 5.5, P.y-uSea-2.*wnoise))*(1.-max(nLace, lace)); }
  // (order 12: the white on the rock is no brighter than the sea's own: under 0.8)
  if(nLace > 0.) col = mix(col, min(col, vec3(.8)), nLace);
  // (and in the mouth's throat a jamb's inner pipes, out of the sun, take the same fill from the sky that stands before
  // the mouth: no slab of black stands just inside it)
  float thro = cave*smoothstep(-13., -2., P.z);
  col += thro*ao*(1.-.6*dark)*(1.-.5*crust)*gMouthR*(uSkyCol*(.06+.1*wet)*(.3+.7*max(dot(Nf, vec3(0., .3, .954)), 0.))+sunGm*(.014*lowB));
  if((hlK > 0. || hlW > 0.) && cave > 0.){
    vec3 Lm = vec3(1.5, 10., 3.)-P; float dm = dot(Lm, Lm); Lm *= inversesqrt(max(dm, 1e-4));
    vec4 sA = shaftAt(P);
    float sI = sunIn(P);
    vec3 sunGc = uSunCol*mix(vec3(1.), uSunCol/max(max(uSunCol.r, uSunCol.g), max(uSunCol.b, 1e-3)), .7);
    col += cave*hlW*(1.-.8*crust)*(1.-dark)*wet*ao*sunGc*(sI*smoothstep(0., .6, dot(hlN, uSunDir))*.17)*(.5+.5*hlJ);
    vec3 hc = uMouthCol*(min(.5, 820./(820.+dm))*smoothstep(.1, .55, dot(hlN, Lm))*.5*(1.-sI))
      +uSunCol*(sI*smoothstep(.05, .5, dot(hlN, uSunDir))*.42)
      +shaftCol()*(sA.w*smoothstep(.1, .55, dot(hlN, sA.xyz))*.6);
    col += cave*hlK*(1.-.8*crust)*(1.-.6*tarK)*(1.-dark)*wet*ao*hc*hlJ;
  }
  col *= (1.-.8*touch)*(1.+.55*lipH*(1.-.6*crust));
  // EACH STUMP OF THE PAVEMENT IS A FORM (a low block inside: its top under 6 m): a LIGHTER TOP (the wet top takes the
  // light that stands over it: the mouth's day, the shaft's, the water's green, each by place) with its lighter worn rim
  // round the shining cup; DARK FLANKS, darker down into the gaps between stumps (a neighbour stands before them); the
  // crusts at its foot, the rose and the white, keep their light: the belts stay plain
  float stK = cave*(1.-smoothstep(4.6, 6.2, vFq.w < .5 ? vR.y : P.y));
  if(stK > 0.){
    if(vFq.w < .5){ float dT = vR.y-P.y; col *= 1.-stK*(.25+.4*smoothstep(.15, 1.3, dT))*(1.-.85*crust); col *= 1.+stK*.35*crust; }
    else if(vFq.w < 1.5){
      vec3 Lmt = vec3(1.5, 10., 3.)-P; float mIt = min(.5, 820./(820.+dot(Lmt, Lmt)));
      vec3 over = uMouthCol*mIt*.05+shaftCol()*shaftAt(P).w*.09+uGlowCol*uGlowAmt*.02+uSunCol*sunIn(P)*.05;
      col += stK*over*(1.-pool)*(1.-.6*dark)*(.6+.4*g0+.9*rimL);
    }
    // (THE DRAIN'S WHITE WATER is the ribbons' alone (RUNOFF): one fall where the water gathers and leaves a top. Nothing is
    // drawn on a flank: between falls it is dark wet rock with its gloss. Order 10's cords down every face read as a comb
    // of stripes and are gone)
  }
  // the cup's disc of water: it mirrors the sky outside; inside, the dark roof and the mouth's white slot
  if(pool > 0.){
    vec3 Nw = nrm(vec3((vn(P.xz*23.+uTime*.7)-.5)*.1, 1., (vn(P.xz*23.+5.-uTime*.6)-.5)*.1));
    float Fw = .03+.97*pow(clamp(1.-max(dot(Nw, V), 0.), 0., 1.), 5.);
    vec3 Rw = reflect(-V, Nw);
    vec3 Lm = vec3(1.5, 10., 3.)-P; float dm = dot(Lm, Lm), mI = min(.5, 820./(820.+dm)); Lm *= inversesqrt(max(dm, 1e-4));
    float slot = pow(max(dot(Rw, Lm), 0.), 24.);                              // the mouth is wide: its image fills a cup that looks toward it
    vec3 mirror = uSkyCol*outd*1.5+cave*(uGlowCol*uGlowAmt*.14+uMouthCol*mI*.5)+chim*mix(shaftCol(), uSkyCol*(dot(shaftCol(), vec3(.3, .5, .2))/max(dot(uSkyCol, vec3(.3, .5, .2)), 1e-3)), .6)*.9;     // (inside: the green-lit hall over it, and the mouth's day; in the chimney the sky in the ring, in its own colour)
    vec3 wc = mix(col*.25, mirror, clamp(Fw*1.4+.55, 0., 1.));
    wc += uMouthCol*cave*mI*slot*(.35+.65*Fw)*1.6+uSunCol*outd*pow(max(dot(Nw, nrm(uSunDir+V)), 0.), 300.)*2.;
    wc += (uMouthCol*cave*mI*.4+uSkyCol*outd*.5+uGlowCol*uGlowAmt*cave*.2)*(1.-smoothstep(0., .07, abs(prd-poolR)));   // the meniscus
    // (ORDER 13, nw by place: A CUP OUTSIDE HOLDS DARK WATER WITH A DIM COOL SHEEN. Its disc gave back the sky at one and a
    // half times the sky's own light from every bearing: a pane of bright glass on each stump. In the new look's ground
    // it is dark water over the rock, the sky in it at half and by the look's slant alone, the sun's point, a thin rim)
    if(nw > 0.) wc = mix(wc, mix(col*.25, uSkyCol*.5, clamp(Fw*1.2+.1, 0., 1.))+uSunCol*(pow(max(dot(Nw, nrm(uSunDir+V)), 0.), 300.)*2.)
      +uSkyCol*(.2*(1.-smoothstep(0., .07, abs(prd-poolR)))), nw);
    col = mix(col*(1.-.45*smoothstep(poolR, poolR+.12, prd)*(1.-smoothstep(.86, .97, vFq.z))), wc, pool);      // the cup's wall is in its own shade
  }
  // the wet rim of a top takes the light that comes up off the water, and the mouth's
  if(rimL > 0.){
    vec3 Lm2 = vec3(1.5, 10., 3.)-P; float mI2 = min(.5, 820./(820.+dot(Lm2, Lm2)));
    col += rimL*(1.-pool)*cave*smoothstep(0., .15, P.y-lv)*(uGlowCol*uGlowAmt*.16*exp(-max(P.y-lv, 0.)/5.)+uMouthCol*mI2*.1);
  }
  // under the sheet: the rock keeps its own detail; the water takes the red out of its light with depth, and stands between
  // it and the eye (THE WATER PATH: the length of the sight line under the sheet, from the eye's height and bearing)
  float depth = lv-P.y;
  if(depth > 0.){
    vec3 ext = exp(-depth*vec3(mix(.26, .2, indoor), .05, .08));
    float pl = min(cameraPosition.y > lv ? depth/max(V.y, .15) : dist, dist);
    float gz = mix(uGlowAmt*mix(1., .5, (1.-smoothstep(-85., -20., P.z)))*mix(.25, 1., exp(-length(P.xz)/9.)), glowIn(P.z), indoor);
    vec3 wcol = mix(slab()*mix(.3, .36, indoor), uDeep*.3, clamp(depth*.14, 0., 1.))*gz;
    // (INSIDE THE WATER IS DEEP AND STIRRED: a drowned pipe is gone into the water's own emerald, the colour the sheet
    // has under a wall, within a metre and a half of water on the sight line; within half a metre in the flood)
    wcol = mix(wcol, lampIn(.1)*glowIn(P.z), cave);
    col = mix(wcol, col*ext, exp(-pl*mix(mix(.1, .08, indoor), mix(1.5, 5., uFlood), cave)));
  }
  gl_FragColor = vec4(airMix(col, P, dist, indoor), 1.);
}`;async function Tt(y,P,O,D){const b=[],C=[],I=[],w=[],F=[],L=[[],[],[]],l=O.n2,o=P.lipDip,c=220,V=16,ee=22,s=Ce-P.FRONT_SHIFT,d=[];let R=0,S=0,N=0;for(let i=0;i<=c;i++){const g=i/c*Math.PI*2,z=Math.sin(g),A=Math.cos(g),x=Math.pow(Math.pow(Math.abs(z)/Ke,6)+Math.pow(Math.abs(A)/Be,6),-1/6),G=x*(1-P.roughAt(z*x,Ce+A*x)),U=z*G,K=s+A*G;i>0&&(R+=Math.hypot(U-S,K-N)),S=U,N=K,d.push({bx:U,bz:K,sn:z,cs:A,arc:R})}for(let i=0;i<=c;i++){const g=d[i],z=d[(i+c-1)%c],A=d[(i+1)%c];let x=A.bz-z.bz,G=-(A.bx-z.bx);const U=Math.hypot(x,G)||1;x/=U,G/=U,x*g.sn+G*g.cs<0&&(x=-x,G=-G),g.ox=x,g.oz=G;const K=1-X(-40,-54,g.bz),Q=P.uAt(g.bx,g.bz);g.nt=P.notchAt(Q)*P.frontK(g.bz)*K,g.bay=P.bayAt(Q)*P.frontK(g.bz)*K,g.dip=(3.8*g.nt+1.2*(.5+.5*l(g.arc*.013+O.o2,3.3)))*K}const n=d[c].arc;for(let i=0;i<=V+ee;i++){for(let g=0;g<=c;g++){const z=d[g],A=g%c,x=d[A];let G,U,K,Q;const J=X(-40,-54,x.bz);if(i<=V){const _=Math.max(0,(i-1)/(V-1)),$=1-J,ae=Z(Ze-1.2+2.8*l(x.arc*.021+O.o3,2.2)+1.2*l(x.arc*.09,5.5+O.o1),-5.5,J),se=P.topAt(x.bx,x.bz)-x.dip;U=Z(ae,se,Math.pow(_,Z(1,.8,J)));let ne=1+(1.3*l(x.arc*.07+O.o1,U*.11)+.5*l(x.arc*.23,U*.3+O.o2)+(.5+.9*J)*l(x.arc*.4+O.o2,U*.025))*(.3+.7*J)+J*7*(1-_)*(1-_)+.9*Math.sin(Math.min(1,_*1.15)*Math.PI)*$*(1-x.nt)-1.6*X(.86,1,_)-(4.2-2.2*x.bay)*$*(1-x.nt)*(1-X(0,.2,_))-$e*x.nt;i===0&&(ne-=9.5*$+.5,U+=1.2*$),G=x.bx+x.ox*ne,K=x.bz+x.oz*ne,Q=_>.97?1:0}else{const _=Math.pow((i-V)/ee,1.35),$=.6+$e*x.nt;G=Z(x.bx-x.ox*$,0,_),K=Z(x.bz-x.oz*$,s-3,_),U=P.topAt(G,K)-o(G,K)+.5*l(G*.05+O.o3,K*.05)+.18*l(G*.3,K*.3)+.5*X(0,.15,_)-x.dip*(1-X(0,.1,_)),Q=1}b.push(G,U,K),C.push(Q,z.arc,0),w.push(i<=V?Math.max(0,(i-1)/(V-1)):1),i>=V-1&&i<=V+1&&g<c&&L[i-V+1].push([G,U,K,x.ox,x.oz,J])}i%4===3&&await y.yield()}const T=c+1;for(let i=0;i<V+ee;i++)for(let g=0;g<c;g++){const z=i*T+g,A=z+1,x=z+T,G=x+1;I.push(z,A,x,A,G,x)}await y.yield();const t=190,v=[[-1.4,5.2],[.6,4.7],[1.7,3],[2.9,1.3],[4.3,-.5],[6.2,-2.5],[9.5,-6.2]],f=b.length/3,p=Math.round(c*.31);for(let i=0;i<v.length;i++)for(let g=0;g<=t;g++){const z=(g/t-.5)*2*p,A=Math.floor(z),x=z-A,G=d[(A%c+c)%c],U=d[((A+1)%c+c)%c],K=Z(G.bx,U.bx,x),Q=Z(G.bz,U.bz,x),J=Z(G.ox,U.ox,x),_=Z(G.oz,U.oz,x),$=z*n/c,ae=X(9.5,17.5,Math.abs(K))*(1-X(-36,-52,Q)),se=.9*l($*.16+O.o2,i*1.7)+.5*l($*.5,i*3.1+O.o1),re=v[i][0]+(i>0?se*(.5+.25*i):0),ne=v[i][1]+(i>0&&i<6?.7*l($*.21+O.o3,i*2.3):0),he=re*(.35+.65*ae)-P.faceBack(K,Q);b.push(K+J*he,Z(-6.8,ne,ae),Q+_*he),C.push(2,$,0)}for(let i=0;i<v.length-1;i++)for(let g=0;g<t;g++){const z=f+i*(t+1)+g,A=z+1,x=z+t+1,G=x+1;I.push(z,x,A,A,x,G)}await y.yield();const h=i=>5.85-Math.floor(Math.max(i,0)/1.05+.3)*1.4;let m=0;for(let i=0;i<64;i++){const g=D.hash(i,901,11),z=D.hash(i,902,12),A=D.hash(i,903,13),x=D.hash(i,904,14),G=D.hash(i,905,15),U=(g-.5)*2*p*.96,K=Math.floor(U),Q=U-K,J=d[(K%c+c)%c],_=d[((K+1)%c+c)%c],$=Z(J.bx,_.bx,Q),ae=Z(J.bz,_.bz,Q),se=Z(J.ox,_.ox,Q),re=Z(J.oz,_.oz,Q);if(Math.abs($)<19||ae<-34)continue;const ne=1.4+3.6*z-P.faceBack($,ae),he=.42+.26*A,le=2.2+4.6*x*x,we=(G-.5)*1.7,De=P.faceBack($,ae),e=-re,j=se;let Y=e*Math.cos(we)+se*Math.sin(we),te=j*Math.cos(we)+re*Math.sin(we);const oe=Math.sin(we)*le*.5,ie=h(ne+De-oe)+he*.55,de=h(ne+De+oe)+he*.55;let ce=(de-ie)/le;const Ae=Math.hypot(Y,ce,te);Y/=Ae,ce/=Ae,te/=Ae;const ke=$+se*ne,Me=ae+re*ne,Ue=.5*(ie+de);let Te=te,Fe=0,Pe=-Y;const at=Math.hypot(Te,Pe)||1;Te/=at,Pe/=at;const _e=ce*Pe-te*Fe,Ye=te*Te-Y*Pe,Xe=Y*Fe-ce*Te,ht=b.length/3,Je=A*1.05,Qe=Math.abs(ke-3)-(le*.5+he)>16?4.6:4;Qe>4.5&&F.push({n:i,c:[ke,Ue,Me],a:[Y,ce,te],u:[Te,Fe,Pe],w:[_e,Ye,Xe],rad:he,len:le,roll:Je});for(let be=0;be<6;be++){for(const ve of[0,1]){const He=Je+(be+ve)*Math.PI/3,Ee=Math.cos(He)*he,ze=Math.sin(He)*he;for(const Ge of[-.5,.5])b.push(ke+Y*le*Ge+Te*Ee+_e*ze,Ue+ce*le*Ge+Fe*Ee+Ye*ze,Me+te*le*Ge+Pe*Ee+Xe*ze),C.push(Qe,(Ge+.5)*le,G)}const pe=ht+be*4;I.push(pe,pe+2,pe+1,pe+1,pe+2,pe+3)}for(const be of[-.5,.5]){const pe=b.length/3;for(let ve=0;ve<6;ve++){const He=Je+ve*Math.PI/3,Ee=Math.cos(He)*he,ze=Math.sin(He)*he;b.push(ke+Y*le*be+Te*Ee+_e*ze,Ue+ce*le*be+Fe*Ee+Ye*ze,Me+te*le*be+Pe*Ee+Xe*ze),C.push(Qe,(be+.5)*le,G)}for(let ve=1;ve<5;ve++)be>0?I.push(pe,pe+ve,pe+ve+1):I.push(pe,pe+ve+1,pe+ve)}m++}await y.yield();const E=-22,k=18,q=-91,B=42,a=20,r=66,M=b.length/3;for(let i=0;i<=r;i++)for(let g=0;g<=a;g++){const z=Z(E,k,g/a),A=Z(q,B,i/r);b.push(z,P.floorAt(z,A),A),C.push(3,z,1)}for(let i=0;i<r;i++)for(let g=0;g<a;g++){const z=M+i*(a+1)+g,A=z+1,x=z+a+1,G=x+1;I.push(z,x,A,A,x,G)}const H=new u.BufferGeometry;H.setAttribute("position",new u.Float32BufferAttribute(b,3)),H.setAttribute("aK",new u.Float32BufferAttribute(C,3));{const i=new Float32Array(b.length/3);i.set(w),H.setAttribute("aT",new u.BufferAttribute(i,1))}H.setIndex(I),await y.yield();const W=new Float32Array(b.length);for(let i=0;i<I.length;i+=3){const g=I[i]*3,z=I[i+1]*3,A=I[i+2]*3,x=b[z]-b[g],G=b[z+1]-b[g+1],U=b[z+2]-b[g+2],K=b[A]-b[g],Q=b[A+1]-b[g+1],J=b[A+2]-b[g+2],_=G*J-U*Q,$=U*K-x*J,ae=x*Q-G*K;W[g]+=_,W[g+1]+=$,W[g+2]+=ae,W[z]+=_,W[z+1]+=$,W[z+2]+=ae,W[A]+=_,W[A+1]+=$,W[A+2]+=ae,i%6e3===5997&&await y.yield()}for(let i=0;i<W.length;i+=3){const g=Math.hypot(W[i],W[i+1],W[i+2])||1;W[i]/=g,W[i+1]/=g,W[i+2]/=g}return H.setAttribute("normal",new u.BufferAttribute(W,3)),H.boundingSphere=new u.Sphere(new u.Vector3(0,20,-62),150),{geometry:H,triangles:I.length/3,lipDip:o,browRows:L,fallen:m,pos:b,idx:I,topFrom:V*T,topTo:(V+ee+1)*T,planks:F}}async function Pt(y,P,O){const D=[],b=[],C=[],I=[],w=(s,d)=>P.hash(s,930+d,50+d),F=(s,d,R,S,N,n,T,t)=>{for(let v=0;v<6;v++){const f=T+v*Math.PI/3,p=f+Math.PI/6,h=D.length/3,m=Math.cos(p),E=Math.sin(p);for(const k of[0,Math.PI/3])for(const q of[-1,1]){const B=Math.cos(f+k)*N,a=Math.sin(f+k)*N;D.push(s[0]+d[0]*n*q+R[0]*B+S[0]*a,s[1]+d[1]*n*q+R[1]*B+S[1]*a,s[2]+d[2]*n*q+R[2]*B+S[2]*a),b.push(R[0]*m+S[0]*E,R[1]*m+S[1]*E,R[2]*m+S[2]*E),C.push(5,t,0)}I.push(h,h+2,h+1,h+1,h+2,h+3)}for(const v of[-1,1]){const f=D.length/3;for(let p=0;p<6;p++){const h=Math.cos(T+p*Math.PI/3)*N,m=Math.sin(T+p*Math.PI/3)*N;D.push(s[0]+d[0]*n*v+R[0]*h+S[0]*m,s[1]+d[1]*n*v+R[1]*h+S[1]*m,s[2]+d[2]*n*v+R[2]*h+S[2]*m),b.push(d[0]*v,d[1]*v,d[2]*v),C.push(5,t,1)}for(let p=1;p<5;p++)I.push(f,f+p,f+p+1)}};let L=0;for(const s of O.planks){let d=-s.len/2,R=0;for(;d<s.len/2-.3&&R<14;){const S=s.n*16+R,N=Math.min(.5+.6*w(S,1),s.len/2-d),n=.04+.12*w(S,2);if(w(S,3)>.14){const T=(w(S,4)-.5)*.16,t=(w(S,5)-.5)*.12,v=w(S,6)<.2?-.25-.5*w(S,7):0,f=d+N/2;F([s.c[0]+s.a[0]*f+s.u[0]*T+s.w[0]*t,s.c[1]+s.a[1]*f+s.u[1]*T+s.w[1]*t+v,s.c[2]+s.a[2]*f+s.u[2]*T+s.w[2]*t],s.a,s.u,s.w,s.rad*(.9+.2*w(S,8)),Math.max(.12,(N-n)/2),s.roll+w(S,9)*1.05,w(S,10)),L++}d+=N,R++}}await y.yield();const l=O.browRows,o=l[1].length;let c=0,V=0;for(let s=0;s<o;s++){const d=(s+1)%o,R=l[1][s],S=l[1][d];if(R[5]>.4||Math.min(Math.abs(R[0]),Math.abs(S[0]))<17.5||Math.min(R[2],S[2])<-32)continue;const N=S[0]-R[0],n=S[2]-R[2],T=Math.hypot(N,n)||1,t=N/T,v=n/T,f=R[3],p=R[4];for(let h=0;h<2;h++){const m=s*8+h,E=(h+w(m,11))/2,k=.35+.5*w(m,12),q=Math.cos(k),B=Math.sin(k),a=.6+.7*w(m,13),r=.45+.35*w(m,14),M=.3+.25*w(m,15),H=.15+.4*w(m,16),W=Z(R[0],S[0],E)+f*H,i=Z(R[1],S[1],E)-.2-.3*w(m,17),g=Z(R[2],S[2],E)+p*H,z=[f*q,-B,p*q],A=[f*B,q,p*B],x=D.length/3,G=w(m,18);for(const[K,Q]of[[1,0],[.62,.75]])for(let J=0;J<6;J++){const _=Math.cos(J*Math.PI/3)*K,$=Math.sin(J*Math.PI/3)*K,ae=t*_*a+z[0]*$*r+A[0]*Q*M,se=z[1]*$*r+A[1]*Q*M,re=v*_*a+z[2]*$*r+A[2]*Q*M;D.push(W+ae,i+se,g+re);const ne=t*_/a+z[0]*$/r+A[0]*(Q+.35)/M,he=z[1]*$/r+A[1]*(Q+.35)/M,le=v*_/a+z[2]*$/r+A[2]*(Q+.35)/M,we=Math.hypot(ne,he,le)||1;b.push(ne/we,he/we,le/we),C.push(7,G,0)}D.push(W+A[0]*M,i+A[1]*M,g+A[2]*M),b.push(A[0],A[1],A[2]),C.push(7,G,0);for(let K=0;K<6;K++){const Q=(K+1)%6;I.push(x+K,x+Q,x+6+K,x+Q,x+6+Q,x+6+K,x+6+K,x+6+Q,x+12)}const U=D.length/3;for(let K=0;K<6;K++)D.push(D[(x+K)*3],D[(x+K)*3+1],D[(x+K)*3+2]),b.push(-A[0],-A[1],-A[2]),C.push(7,G,0);for(let K=1;K<5;K++)I.push(U,U+K+1,U+K);c++}for(let h=0;h<8;h++){const m=s*8+h,E=(h+w(m,21))/8,k=.4+.9*w(m,22),q=Math.min(1,Math.floor(k)),B=k-q,a=l[q][s],r=l[q][d],M=l[q+1][s],H=l[q+1][d],W=Z(Z(a[0],r[0],E),Z(M[0],H[0],E),B),i=Z(Z(a[1],r[1],E),Z(M[1],H[1],E),B)-.1,g=Z(Z(a[2],r[2],E),Z(M[2],H[2],E),B),z=1-me(k-.6,0,1),A=w(m,23);for(let x=0;x<5;x++){const G=w(m,24)*6.283+x*1.2566,U=.11+.09*w(m+x,25),K=.8+.7*w(m+x,26),Q=Math.cos(G),J=Math.sin(G),_=f*z*.4+Q*.28,$=p*z*.4+J*.28,ae=D.length/3;D.push(W+J*U+Q*.12,i,g-Q*U+J*.12,W-J*U+Q*.12,i,g+Q*U+J*.12,W+Q*.12+_*K,i+K,g+J*.12+$*K),b.push(0,1,0,0,1,0,0,1,0),C.push(8,A,0,8,A,0,8,A,1),I.push(ae,ae+1,ae+2)}V++}s%40===39&&await y.yield()}await y.yield();const ee=new u.BufferGeometry;return ee.setAttribute("position",new u.Float32BufferAttribute(D,3)),ee.setAttribute("normal",new u.Float32BufferAttribute(b,3)),ee.setAttribute("aK",new u.Float32BufferAttribute(C,3)),ee.setAttribute("aT",new u.BufferAttribute(new Float32Array(D.length/3),1)),ee.setIndex(I),ee.boundingSphere=new u.Sphere(new u.Vector3(0,20,-62),150),{geometry:ee,triangles:I.length/3,drums:L,sods:c,tufts:V}}const Et=`
uniform float uTime;
attribute vec3 aK; attribute float aT; varying vec3 vP, vWp, vN, vK; varying float vT;
// (order 12: a tussock's blade (kind 8, the added mesh's) bows to the wind by its own height; a plank that the drums
// stand in for (kind 4.6) is folded away to one point outside the clip volume, so that it draws nothing. Every other
// vertex is as it was, to the bit)
void main(){ vec3 p = position;
  if(aK.x > 7.5 && aK.x < 8.5){ float g = sin(uTime*1.9+p.x*.31+p.z*.23)*.5+sin(uTime*3.7+p.x*.9)*.22; p.xz += vec2(.8, .25)*(aK.z*aK.z*(.22+.2*g)); }
  vP = p; vN = normal; vK = aK; vT = aT; vec4 wp = modelMatrix*vec4(p, 1.); vWp = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp;
  if(aK.x > 4.5 && aK.x < 4.7) gl_Position = vec4(0., 0., -2., 1.);
}`,zt=`
${Ne}
varying vec3 vP, vWp, vN, vK; varying float vT;
void main(){
  vec3 P = vP; float kind = vK.x;
  vec3 Vv = cameraPosition-vWp; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-4);
  vec3 N = nrm(vN);
  // ORDER 12, THE NEW LOOK'S GROUND (nw), BY PLACE ALONE, as on the columns: 0 within 16 m east and west of x = 3,
  // the line that runs into the mouth (the plinth) and within 13 m of x = 0 (the cap over the mouth), and behind z = -44
  // (the slumped sides, the top round the blowhole); 1 beyond, coming in over 3 to 10 m. Where it
  // is 0 no branch below is taken and every number is the one it was
  float nw = smoothstep(-44., -34., P.z)*(kind < 1.5 ? max(smoothstep(16., 22., abs(P.x-3.)), smoothstep(13., 16., abs(P.x))) : smoothstep(16., 22., abs(P.x-3.)));
  float nLace = 0.;
  float fwP = max(fwidth(P.y), fwidth(P.x)+fwidth(P.z));
  // the blowhole's lip: the turf is open where the chimney comes up through it
  vec3 pa = P-AX0; float sa = dot(pa, AXD); float rho = sqrt(max(dot(pa, pa)-sa*sa, 0.));
  vec3 alb; float rough = .8, wet = .2, cnet = .3, ao = 1., crust = 0., sunSh = 1.;
  float turf = 0.;
  float s = vK.y, slump = fbm2(vec2(s*.035, P.y*.05))*9.+fbm2(vec2(s*.11, P.y*.16)+3.)*2.2;
  float u = (s+slump+P.y*.25)/.42, fwU = fwidth(u)*.42, fwJ = fwidth(P.y);
  float u2 = (s+slump*.8+P.y*.2+2.4*vn(vec2(s*.11, P.y*.08)))/5.6, fw2 = fwidth(u2);
  float u3 = (s+slump+P.y*.25)/1.05, fw3 = fwidth(u3);
  float lj = (vK.y+vK.z*.4)/.8, fwL = fwidth(lj);                  // a fallen column: metres along its length, in drums
  vec4 mp = textureLod(uMap, (P.xz-uRect.xy)/uRect.zw, 0.);
  if(kind < 1.5 && rho < 6.25 && P.y > 40.) discard;
  if(!gl_FrontFacing && kind < 2.5){ gl_FragColor = vec4(airMix(uBasalt*.02, P, dist, 1.), 1.); return; }       // the rock's own dark, seen from inside it
  if(kind < 1.5){
    // the entablature: thin columns that curve and lean, slumped, standing in broad calm sheaves five to six metres wide
    // with a shadowed cleft between sheaves; its underside in shade; turf over the brow. Thin things melt to their mean
    float fu = fract(u), du = min(fu, 1.-fu)*.42;
    float amp = clamp(.05/max(fwU, 1e-4), 0., 1.);
    float line = (1.-smoothstep(.01, .03+fwU*1.5, du))*amp;
    float cid = h11(floor(u)*1.7);
    float vj = (P.y+cid*5.)/.9, fj = fract(vj), dj = min(fj, 1.-fj)*.9;
    float jl = (1.-smoothstep(.01, .03+fwJ*1.5, dj))*clamp(.05/max(fwJ, 1e-4), 0., 1.)*.6;
    float f2 = fract(u2), d2 = min(f2, 1.-f2), amp2 = clamp(.5/max(fw2, 1e-4), 0., 1.);
    float cleft = (1.-smoothstep(.01, .1+fw2, d2))*amp2;
    float sid = h11(floor(u2)*3.1);
    float f3 = fract(u3), d3 = min(f3, 1.-f3), amp3 = clamp(.3/max(fw3, 1e-4), 0., 1.)*(1.-.7*amp);
    float gap3 = (1.-smoothstep(.03, .2+fw3, d3))*amp3;                      // nearer, the thin columns read in threes
    alb = uBasalt*.8*(.8+.3*mix(.5, cid, amp))*(1.-.6*max(line, jl))*(.86+.28*mix(.5, sid, amp2))*(1.-.3*gap3);
    alb *= .8+.4*fbm2(vec2(s*.05, P.y*.09)+7.);                             // broad weathering, the size of the sheaves
    N = nrm(N+vec3(N.z, 0., -N.x)*((fu-.5)*.9*amp+(f3-.5)*.5*amp3+(f2-.5)*.75*amp2));      // each thin column is round, and so is each sheaf
    tideBands(P, vec2(vK.y, P.y), .37, 1., fwP, 0., .5, 0., alb, rough, crust);
    float under = smoothstep(.15, .6, -N.y);                                  // the soffit
    ao = (.75+.25*smoothstep(-2., 6., P.y))*(1.-.55*cleft)*(1.-.5*under)*(.55+.45*smoothstep(0., 3.5, P.y-(34.+2.*fbm2(vec2(s*.03, 1.)))));
    sunSh = (1.-.6*cleft)*(1.-under);
    float sside = dot(uSunDir, vec3(N.z, 0., -N.x)) > 0. ? 1.-f2 : f2;            // a sheaf standing proud shades its neighbour's flank
    sunSh *= mix(1., smoothstep(.0, .22, sside), amp2*step(.45, sid));
    float grass = fbm2(P.xz*.33+P.y*.21);
    vec3 turfCol = mix(vec3(.065, .1, .03), vec3(.15, .17, .055), fbm2(P.xz*.11+2.))*(.8+.5*vn(P.xz*3.1));
    float sway = vn(vec2(P.x*.21+uTime*.9, P.z*.21-uTime*.35));            // wind running over the long grass
    turfCol *= .82+.5*sway*sway;
    turf = max(smoothstep(.15, .75, kind+(grass-.5)*.5), smoothstep(.55, .8, N.y+.25*grass)*step(8., P.y));
    alb = mix(alb, turfCol, turf); rough = mix(rough, .95, turf);
    wet = mix(.4, .05, turf); sunSh = mix(sunSh, 1., turf); ao = mix(ao, 1., turf);
    // ORDER 12 (nw, by place): THE ENTABLATURE'S THIN CURVING COLUMNS ARE READ from the run: bound in threes (1.05 m)
    // they last until a pixel holds a whole one: each its own tone, round, a dark gap between two; and THE TURF HANGS
    // OVER the brow in ragged tongues, a fifth of the face deep, dark earth and its shadow under its edge
    if(nw > 0.){
      float a3 = clamp(.45/max(fw3, 1e-4), 0., 1.), g3 = (1.-smoothstep(.03, .22+fw3, d3))*a3, bare = nw*(1.-turf);
      alb *= mix(1., (.72+.56*mix(.5, h11(floor(u3)*5.3+1.), a3))*(1.-.5*g3), bare);
      N = nrm(N+vec3(N.z, 0., -N.x)*((f3-.5)*1.1*a3*bare));
      ao *= 1.-.45*g3*bare;
      float thrT = .8+.16*(vn(vec2(s*.35, 2.))-.5)+.1*(vn(vec2(s*1.3, 5.))-.5);
      float tf2 = nw*smoothstep(thrT-.02, thrT+.03, vT)*(1.-turf), earth = nw*smoothstep(thrT-.1, thrT-.02, vT)*(1.-tf2)*(1.-turf);
      alb = mix(alb, vec3(.035, .028, .02), .8*earth); ao *= 1.-.5*earth;
      alb = mix(alb, turfCol*.85, tf2); rough = mix(rough, .95, tf2); wet = mix(wet, .05, tf2); sunSh = mix(sunSh, 1., tf2); ao = mix(ao, 1., tf2);
      turf = max(turf, tf2);
    }
  } else if(kind < 2.5){
    // the plinth: rough wave-cut rock wearing every band, and the surf line: swash running up it and draining back
    float r = fbm2(vec2(vK.y*.4, P.y*.7))*.6+vn(P.xz*2.3)*.4;
    alb = uBasalt*(.2+.4*r);
    tideBands(P, mix(vec2(vK.y, P.y), P.xz, step(.6, N.y)), .11, 0., fwP, 0., .5, 0., alb, rough, crust);
    float soak = 1.-smoothstep(.9, 2.2, P.y+r*.8);
    wet = max(.3, soak); alb *= mix(1., .6, soak*(1.-.7*crust));
    ao = (.5+.3*smoothstep(-1., 5., P.y))*(.55+.6*r);
    float sw = uSea+.45+.4*sin(uTime*.9+vK.y*.11)+.5*vn(vec2(vK.y*.23, uTime*.35));
    float surf = (1.-smoothstep(sw-.15, sw+.2, P.y+r*.5))*smoothstep(uSea-1.2, uSea-.3, P.y);
    float lace = smoothstep(.25, .55, fbm2(vec2(vK.y*.9, P.y*2.2-uTime*.6))+.3*surf);
    alb = mix(alb, uFoamCol*.75, surf*lace); rough = mix(rough, .9, surf*lace);
    // (ORDER 12, nw by place: the plinth's rock is wet and dark for a metre or two over the water wherever the sea
    // stands, and its white goes by the swell's own clock, as on the stumps: see the column shader)
    if(nw > 0.){
      // (ORDER 13: THE PLINTH'S WET FOOT IS WET BLACK ROCK too: from the water up to some four metres over it no crust on it
      // is lighter than its wet rock (at the rock's middle tone) by more than a third: its pale belts stood as light boxes)
      alb *= mix(1., min(1., 1.3*dot(uBasalt, vec3(.3, .5, .2))*.45*mix(1., .6, soak)/max(dot(alb, vec3(.3, .5, .2)), 1e-4)), nw*(1.-smoothstep(3.5, 5.5, P.y-uSea+r*.8)));
      float wb = 1.-smoothstep(1.2, 3., P.y-uSea+r*.8);
      alb *= 1.-.4*nw*wb*(1.-.6*crust); wet = max(wet, .9*nw*wb);
      vec3 s12 = seaSwell(P.xz, uTime); float am12 = mix(1., 2., smoothstep(.45, 1., uWind)), srg = smoothstep(-.18, .26, s12.x/am12);
      float top12 = uSea+s12.x+.1+(.2+.9*srg*srg)*1.41*(.5+.8*vn(vec2(vK.y*.31, uTime*.3)));
      float sf12 = (1.-smoothstep(top12-.5, top12+.15, P.y+.35*r))*smoothstep(uSea-1.4, uSea-.4, P.y);
      nLace = nw*sf12*smoothstep(.4-.2*srg, .68-.2*srg, fbm2(vec2(vK.y*.8, P.y*1.7-uTime*.8)+P.xz*.6)+.3*sf12);
      // (order 13: the thin bright line at the waterline, as on the stumps: see the column shader)
      nLace = max(nLace, nw*.8*(1.-smoothstep(.04, .1+fwJ, abs(P.y-uSea-s12.x-.05)))*clamp(.14/max(fwJ, 1e-3), 0., 1.)*(.45+.55*smoothstep(.25, .6, vn(vec2(vK.y*1.7, uTime*.3)))));
      alb = mix(alb, uFoamCol*.75, nLace); rough = mix(rough, .9, nLace);
    }
  } else if(kind < 3.5){
    // pale shell sand, rippled, under the caustic light: the lamp of the whole cave. Weed and shadow gather where a pipe stands in it
    float warp = fbm2(P.xz*.21)*2.4;
    float rp = sin((P.z*.92+P.x*.3+warp)*6.2831853/.42), fwR = fwP/.42;
    float ripple = mix(.5+.5*rp, .5, smoothstep(.15, .6, fwR));
    alb = mix(vec3(.5, .47, .38), vec3(.78, .76, .66), ripple)*(.85+.3*vn(P.xz*1.3));
    float boulder = smoothstep(-5.2, -4.2, P.y)*(1.-smoothstep(-70., -60., P.z));
    alb = mix(alb, uBasalt*1.6+uPink*.25*vn(P.xz*.9), boulder);
    float cd = min(mp.r*3., mp.a*2.)+(vn(P.xz*1.7)-.5)*.4;
    alb = mix(alb, vec3(.03, .045, .028), (1.-smoothstep(.1, 1.2, cd))*.9);
    float lv = levelAt(P.z), depth = max(lv-P.y, 0.), bare = smoothstep(0., .22, P.y-lv);       // (a trough can lay a bank bare: dark wet sand, no net on it)
    cnet = mix(causLight(P.xz/6., uTime*.3, fwP/6., 1.), 1., bare);
    float gz = glowIn(P.z)*mix(.3, 1., (1.-smoothstep(6., 34., P.z)));
    // the lamp's own face: pale sand under the net, its filaments at the emerald's peak. The water drinks its light with
    // depth, red first, and stands between it and the eye: over the deep channel it is lost in the water's own glow
    vec3 col = alb*uGlowCol*gz*(.42+.5*cnet)*exp(-depth*vec3(.3, .055, .1))*(1.-.75*(1.-smoothstep(0., .5, cd)))*mix(1., .34, bare);
    float open = lampOpen(P.xz, mp.r*3.);
    col = mix(col*mix(.12, 1., open), lampIn(open)*gz, 1.-exp(-depth*.13));      // (the wall's shadow lies on the sand under it as on the water over it)
    gl_FragColor = vec4(airMix(min(col, uGlowCol), P, dist, 1.), 1.); return;
  } else if(kind > 4.8){
    // ORDER 12, THE ADDED MESH (its own triangles, none of the ground's): kind 5 A FALLEN DRUM, six-sided, a column's
    // width across and half a metre to a metre long, one of a row that a fallen column broke into (vK.y: its own tone;
    // vK.z: 1 on its two ends); kind 7 A SOD OF TURF hanging over the brow (dark earth under it); kind 8 A TUSSOCK'S
    // BLADE against the sky (vK.z: 0 at its root to 1 at its tip)
    if(kind < 5.5){
      float g = vn(P.xz*5.+P.y*3.);
      alb = uBasalt*.8*(.55+.65*vK.y)*(.7+.6*g)*(1.-.3*vK.z*smoothstep(.3, .7, vn(P.xz*9.+P.y*7.)));
      float rk13 = dot(alb, vec3(.3, .5, .2));
      tideBands(P, vec2(P.x+P.z, P.y), .23, 1., fwP, 0., .5, 0., alb, rough, crust);
      float soak = 1.-smoothstep(.9, 2.2, P.y-uSea+g*.8);
      wet = max(.35, soak); alb *= mix(1., .6, soak*(1.-.7*crust));
      // (order 13: a fallen drum's wet foot is wet black rock: no crust on it lighter than its own wet rock by more than a third)
      alb *= mix(1., min(1., 1.3*rk13*mix(1., .6, soak)/max(dot(alb, vec3(.3, .5, .2)), 1e-4)), nw*(1.-smoothstep(3.5, 5.5, P.y-uSea+g*.8)));
      rough = mix(rough, .3, wet*wet*(1.-.8*crust));
      ao = .5+.5*smoothstep(-.5, .5, N.y);
      vec3 s12 = seaSwell(P.xz, uTime); float am12 = mix(1., 2., smoothstep(.45, 1., uWind)), srg = smoothstep(-.18, .26, s12.x/am12);
      float top12 = uSea+s12.x+.1+(.2+.9*srg*srg)*1.41*(.5+.8*vn(vec2((P.x+P.z)*.31, uTime*.3)));
      float sf12 = (1.-smoothstep(top12-.5, top12+.15, P.y+.35*g))*smoothstep(uSea-1.4, uSea-.4, P.y);
      nLace = sf12*smoothstep(.4-.2*srg, .68-.2*srg, fbm2(vec2((P.x+P.z)*.8, P.y*1.7-uTime*.8)+P.xz*.6)+.3*sf12);
      alb = mix(alb, uFoamCol*.75, nLace); rough = mix(rough, .9, nLace);
    } else if(kind < 7.5){
      vec3 tc = mix(vec3(.065, .1, .03), vec3(.15, .17, .055), fbm2(P.xz*.11+2.))*(.8+.5*vn(P.xz*3.1));
      float sway = vn(vec2(P.x*.21+uTime*.9, P.z*.21-uTime*.35)), under = smoothstep(.1, .5, -N.y);
      tc *= .82+.5*sway*sway;
      alb = mix(tc*(.75+.5*vK.y), vec3(.035, .028, .02), under); rough = .95; wet = .05; ao = 1.-.55*under; turf = 1.-under;
    } else {
      float tb = vK.z; vec3 a8 = mix(mix(vec3(.05, .085, .025), vec3(.2, .24, .07), tb), vec3(.3, .27, .13), step(.7, vK.y)*tb*.8);
      gl_FragColor = vec4(airMix(a8*(uSkyCol*.9+uSunCol*(.22+.45*tb)), P, dist, 0.), 1.); return;
    }
  } else {
    // a fallen column lying on the plinth: the same rock, jointed across its length
    float fl = fract(lj), dl = min(fl, 1.-fl)*.8;
    float jn = (1.-smoothstep(.01, .03+fwL*1.2, dl))*clamp(.4/max(fwL, 1e-4), 0., 1.);
    float g = vn(P.xz*5.+P.y*3.);
    alb = uBasalt*.8*(.6+.6*h11(floor(lj)+vK.z*7.))*(.7+.6*g)*(1.-.7*jn);
    tideBands(P, vec2(vK.y, P.y+P.x), .23, 1., fwP, 0., .5, 0., alb, rough, crust);
    float soak = 1.-smoothstep(.9, 2.2, P.y+g*.8);
    wet = max(.35, soak); alb *= mix(1., .6, soak*(1.-.7*crust));
    rough = mix(rough, .3, wet*wet*(1.-.8*crust));
    ao = .6+.4*smoothstep(-.3, .5, N.y);
  }
  vec3 col = shade(P, N, N, V, alb, rough, wet, 0., 0., ao, sunSh, 1., crust, 1., 1., vec3(0.), 1.);
  // (ORDER 13, nw by place: on the plinth and the fallen drums THE WET FILM'S FLAT SHEEN OF THE SKY IS A DIM COOL ONE, as on
  // the stumps: the term shade() gave is taken out again and laid back at no more than two fifths of its upper
  // strength, eased over the level look. It reads the eye's bearing as the term it replaces does: named at the head)
  if(nw > 0. && kind > 1.5 && kind < 5.5){
    float Ry13 = reflect(-V, N).y;
    vec3 s13 = uSkyCol*((.04+.96*pow(clamp(1.-max(dot(N, V), 0.), 0., 1.), 5.))*mix(.12, 1., wet*wet)*ao*wet*(1.-rough));
    col = max(col-nw*s13*(Ry13 > 0. ? .5 : .12), 0.)+nw*s13*mix(.1, .2, smoothstep(-.4, .4, Ry13));
  }
  col += turf*uSunCol*alb*(1.-smoothstep(.2, .55, uSunDir.y))*.4;            // (long grass stands up into a low sun: the turf is warm)
  // (ORDER 12, nw by place: THE CAP'S SHADE IS THE CLIFF'S OWN: where the sun does not reach its rock it takes the
  // sky's fill, cold, turned to the teal-black of the wall's shade, and its wet film mirrors the sky at a grazing look
  // (THIS READS THE EYE'S BEARING, as every mirror does; named at the head): its thin columns are read in the shade
  // too, and it is no black cut-out. No warmth is added, and nothing from below)
  if(nw > 0. && kind < 1.5){
    float k12 = nw*(1.-turf)*(1.-sunSh*smoothstep(0., .25, dot(N, uSunDir)));
    col += k12*uSkyCol*alb*ao*.8;
    col = mix(col, uDeep*(dot(col, vec3(.3, .5, .2))/max(dot(uDeep, vec3(.3, .5, .2)), 1e-4)), .45*k12);
    col += k12*uSkyCol*((.04+.96*pow(clamp(1.-max(dot(N, V), 0.), 0., 1.), 3.))*.3*ao*(1.-.8*crust));
  }
  if(nLace > 0.) col = mix(col, min(col, vec3(.8)), nLace);
  float depth2 = uSea-P.y;
  if(depth2 > 0.) col = mix(col*vec3(.5, .9, .85), uDeep*.35, 1.-exp(-depth2*.5));
  gl_FragColor = vec4(airMix(col, P, dist, 0.), 1.);
}`,xe=-22,Oe=18,ye=-91,Le=41,Se=200,qe=660;async function Rt(y,P,O){const D=new Uint8Array(Se*qe*4),b=(Oe-xe)/Se,C=(Le-ye)/qe,I=s=>{const d=ye+(s+.5)*C;for(let R=0;R<Se;R++){const S=xe+(R+.5)*b,N=P.floorAt(S,d);D[(s*Se+R)*4+1]=Math.round(me((N+8)/16,0,1)*255)}};for(let s=0;s<qe;s++)I(s),s%3===2&&await y.yield();const w=Se*qe,F=new Float32Array(w).fill(3),L=new Float32Array(w).fill(2),l=new Float32Array(w).fill(-8);let o=0;const c=s=>{const d=s.r+(s.wall?3:2),R=s.r*.94,S=s.wall?F:L,N=Math.max(0,Math.floor((s.x-d-xe)/b)),n=Math.min(Se-1,Math.ceil((s.x+d-xe)/b)),T=Math.max(0,Math.floor((s.z-d-ye)/C)),t=Math.min(qe-1,Math.ceil((s.z+d-ye)/C));for(let v=T;v<=t;v++){const f=ye+(v+.5)*C-s.z,p=f*f;for(let h=N;h<=n;h++){const m=v*Se+h,E=xe+(h+.5)*b-s.x,k=S[m]+R+1e-6;if(E*E+p>k*k)continue;const q=Math.max(0,Math.hypot(E,f)-R);s.wall?q<F[m]&&(F[m]=q):q<L[m]&&(L[m]=q,l[m]=s.top)}}};for(const s of O)c(s),++o%40===0&&await y.yield();const V=(s,d)=>{for(let R=s;R<d;R++)D[R*4]=Math.round(F[R]/3*255),D[R*4+2]=Math.round(me((l[R]+8)/16,0,1)*255),D[R*4+3]=Math.round(L[R]/2*255)};for(let s=0;s<w;s+=16e3)V(s,Math.min(w,s+16e3)),await y.yield();const ee=new u.DataTexture(D,Se,qe,u.RGBAFormat,u.UnsignedByteType);return ee.magFilter=u.LinearFilter,ee.minFilter=u.LinearFilter,ee.wrapS=ee.wrapT=u.ClampToEdgeWrapping,ee.needsUpdate=!0,ee}async function Nt(y,P){const b=Math.PI*2,C=new Uint8Array(256*256),I=new Float32Array(16),w=new Float32Array(16),F=new Float32Array(16);for(let c=0;c<4;c++)for(let V=0;V<4;V++)I[c*4+V]=V+.15+.7*P.hash(V,c,21),w[c*4+V]=c+.15+.7*P.hash(V,c,22),F[c*4+V]=.55+.45*P.hash(V,c,23);const L=new Float64Array(256);for(let c=0;c<256;c++)L[c]=.022*Math.sin(b*((c+.5)/256*2+.7));const l=c=>{const V=(c+.5)/256,ee=.022*Math.sin(b*(V*2+.3));for(let s=0;s<256;s++){const d=(s+.5)/256,R=ee+.012*Math.sin(b*(V*5+d*3)),S=L[s]+.012*Math.sin(b*(d*4-V*3)),N=(d+R)*4,n=(V+S)*4,T=Math.floor(N)|0,t=Math.floor(n)|0;let v=9,f=9,p=1,h=1;for(let k=-1;k<=1;k++){const q=t+k,B=(q%4+4)%4,a=q-B;for(let r=-1;r<=1;r++){const M=T+r,H=(M%4+4)%4,W=B*4+H,i=I[W]+(M-H)-N,g=w[W]+a-n,z=Math.sqrt(i*i+g*g);z<v?(f=v,h=p,v=z,p=F[W]):z<f&&(f=z,h=F[W])}}const m=f-v,E=Math.min(1,.5*(p+h)*(Math.exp(-(m*m)/68e-5)+.04*Math.exp(-m/.1)));C[c*256+s]=Math.round(255*Math.sqrt(E))}};for(let c=0;c<256;c++)l(c),c%6===5&&await y.yield();const o=new u.DataTexture(C,256,256,u.RedFormat,u.UnsignedByteType);return o.wrapS=o.wrapT=u.RepeatWrapping,o.magFilter=u.LinearFilter,o.minFilter=u.LinearMipmapLinearFilter,o.generateMipmaps=!0,o.needsUpdate=!0,o}const Mt=`
uniform float uTime, uLevel, uPile, uSea; uniform vec4 uHump;
varying vec3 vP, vWp;
float levelAt(float z){ float d = (z-uHump.x)/max(uHump.z, 1.); return mix(uLevel, uSea, smoothstep(2., 20., z)) + uHump.y*exp(-d*d) + uPile*(1.-smoothstep(-86., -56., z)); }
void main(){
  vec3 P = position;
  // the sheet's own bob: 0.15 m, a period over five seconds, long in space: small and slow
  P.y = levelAt(P.z)+.15*sin(uTime*1.18+P.z*.045+P.x*.03)*(.6+.4*sin(uTime*.37+P.z*.02))*(1.-smoothstep(6., 20., P.z));   // (no bob where the open sea takes over)
  // outside the mouth, toward its rim, the sheet slips away under the open sea (1.7 m down at the rim, where it has faded
  // to nothing): a world's own sea lies over it there, so the two never show a level step or a rim
  P.y = mix(P.y, uSea-1.7, smoothstep(.6, .9, length(vec2(P.x/16.5, max(P.z-2., 0.)/34.)))*smoothstep(0., 3., P.z));
  vP = P; vec4 wp = modelMatrix*vec4(P, 1.); vWp = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp;
}`,Ct=`
${Ne}
varying vec3 vP, vWp;
// a wall of the nave as the sheet mirrors it: dark pipes, each its own tone, a crack between two, the pale crust low on
// them, all of it lit from below as the wall itself is; the pipes melt to a mean wall as a pixel grows over them
vec3 wallMirror(float zh, float yh, float lv, float fw){
  float c = zh/1.05+.35*sin(zh*.7), id = floor(c), f = fract(c), keep = 1.-smoothstep(.25, .8, fw);
  float tone = mix(.8, .5+.6*h11(id*7.3+2.), keep)*mix(1., smoothstep(0., .12, min(f, 1.-f)), keep);
  float band = 1.-smoothstep(1.4-fw, 2.6+fw, yh+.4*sin(zh*.9));
  float Wh = .5*exp(-max(yh-lv, 0.)/7.)+.5;
  return uGlowCol*(uGlowAmt*mix(.075, .15, band)*tone*Wh);
}
// TORN FOAM (order 11: thick foam is never a soft pale wash, and never a flat floe): at p (a place that drifts with the
// flow, its length down the nave halved, so everything in it is drawn long by the flow) a share cov of the water is
// white: a net of threads (the caustic tile's cell edges at two sizes, 2.4 and 1.4 m) and small clots a hand wide and a
// metre long, more and thicker as cov grows; the clear water stands between. It melts to its mean cover as a pixel
// grows past a clot (fwT)
float tornFoam(vec2 p, float cov, float ll, float fwT, float bub){
  float net = clamp((causTap(p/2.4+.13, ll+.2)+.8*causTap(vec2(.8*p.x-.6*p.y, .6*p.x+.8*p.y)/1.4+.61, ll+.9))*1.5, 0., 1.);
  vec2 g = vec2(p.x*5., p.y*1.8);
  float fine = 1.-smoothstep(.1, .5, fwT);
  float grain = vn(g)*.55+vn(g*vec2(2.7, 2.1)+5.)*.3+bub*.15+(vn(g*vec2(7., 5.)+9.)-.5)*.22*fine;      // (near, a clot is ragged and full of holes)
  float clot = smoothstep(.74-.3*cov, .8-.3*cov+fwT*.1, grain)*mix(1., .55+.45*smoothstep(.3, .6, vn(g*vec2(11., 4.)+2.)), fine);
  return mix(cov*.45, max(net*(.4+.6*cov), clot), 1.-smoothstep(.5, 1.8, fwT))*smoothstep(0., .08, cov); }
void main(){
  vec3 P = vP;
  vec3 Vv = cameraPosition-vWp; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-4);
  float fwP = fwidth(P.x)+fwidth(P.z);
  vec2 dPx = dFdx(P.xz), dPy = dFdy(P.xz);
  vec2 muv = (P.xz-uRect.xy)/uRect.zw;
  vec4 mp = texture2D(uMap, muv);
  float top = mp.b*16.-8.;
  float emerge = smoothstep(-.25, .25, top-P.y);                            // the nearest stump stands out of the water here
  float shore = min(mp.r*3., mix(2., mp.a*2., emerge));                   // metres to the nearest body standing out of the water
  float over = P.y-(mp.g*16.-8.), depth = max(over, .05);                  // (over: the water over the sand; a trough can lay a bank bare)
  // what lies under the glass here: the sand, or the top of a drowned stump
  float depthU = mix(depth, clamp(P.y-top, .05, depth), (1.-smoothstep(0., .3, mp.a*2.))*(1.-emerge));
  // (the hand-over to the sea's face is not ruled across the mouth: the sea's ripples run in here, the cave's water out there)
  float inside = (1.-smoothstep(-4., 7., P.z+5.*(vn(vec2(P.x*.38, P.z*.12+uTime*.05)+4.)-.5)+2.*(vn(vec2(P.x*1.3+uTime*.1, P.z*.5)+8.)-.5)));       // 1 in the cave, 0 out at sea
  float day = mix(1., dayAt(P), inside);
  float t = uTime;
  // small ripples; their slope turns the mirror
  vec2 q = P.xz;
  float r1 = vn(q*1.9+vec2(t*.35, -t*.22)), r2 = vn(q*4.3+vec2(-t*.5, t*.41)+3.);
  float r1x = vn(q*1.9+vec2(t*.35, -t*.22)+vec2(.12, 0.)), r1z = vn(q*1.9+vec2(t*.35, -t*.22)+vec2(0., .12));
  float r2x = vn(q*4.3+vec2(-t*.5, t*.41)+3.+vec2(.12, 0.)), r2z = vn(q*4.3+vec2(-t*.5, t*.41)+3.+vec2(0., .12));
  float melt = 1.-smoothstep(.05, .5, fwP);
  vec3 N = nrm(vec3(-((r1x-r1)*1.5+(r2x-r2)*.8)*melt, 1., -((r1z-r1)*1.5+(r2z-r2)*.8)*melt));
  // roof drips: rings opening on the sheet
  vec2 cq = q/2.7, ci = floor(cq), cf = fract(cq);
  float hc = h21(ci), ph = fract(t*(.22+.2*hc)+hc*7.);
  vec2 cc = vec2(.3+.4*h21(ci+3.1), .3+.4*h21(ci+7.7));
  float rr = length(cf-cc)*2.7, ring = (1.-smoothstep(0., .07+fwP, abs(rr-ph*1.3)))*(1.-ph)*inside*step(.35, hc)*melt;
  N = nrm(N+vec3(ring*.5*(cf.x-cc.x), 0., ring*.5*(cf.y-cc.y)));
  // the sheet's own slope (the swell's hump or trough, the pile) turns the mirror: a steep face looked at head-on is
  // smooth glass over the lamp, not a mirror of the walls
  float hd = (P.z-uHump.x)/max(uHump.z, 1.), eh = exp(-hd*hd), ps = clamp((P.z+86.)/30., 0., 1.);
  float dz = -2.*hd*uHump.y*eh/max(uHump.z, 1.)-uPile*.2*ps*(1.-ps), steep = smoothstep(.06, .22, abs(dz));
  float dxh = uHump.y*eh*(.0374*cos(P.x*.83+t*.5+P.z*.21)+.0111*cos(P.x*.37-t*.3+1.7));       // (a swell is not ruled: along its crest it leans a little this way and that, and its mirror with it)
  N = nrm(N+vec3(-dxh*inside, 0., -dz*inside));
  // IN THE CAVE (all of this down to the mirror; outside the mouth the sheet wears the sea's face, below).
  // (ripples too small to see roughen the far sheet: it never turns to a whole mirror, and the lamp's glow comes through
  // it all the way down the nave)
  float NV = max(dot(N, V), 0.), fr5 = pow(clamp(1.-NV, 0., 1.), 5.), Fr = .025+.8*fr5;
  // THE WATER PATH: the sight line bends down as it enters the water; what lies under shows through that length of it,
  // and the water's own glow gathers along it. THE LAMP: that glow is the emerald itself over the pale sand in mid nave
  // (the brightest thing in the cave after the mouth), sliding to deep green in the shadow close under a wall or a
  // standing stump, and toward the deep back. The shallows show their sand and the net on it; the deep channel is a lit slab
  float cosT = sqrt(max(1.-(1.-NV*NV)/1.77, .05));
  float gz = glowIn(P.z);
  float cl = causLight(q/7., t*.3, fwP/7., 2.2);
  float open = lampOpen(q, mp.r*3.)*mix(1., .5+.5*smoothstep(0., 1.8, mp.a*2.), emerge);
  float mott = fbm2(q*.13+2.);
  // THE SHEET CARRIES ITS OWN LIGHT AND DARK: this water is deep and stirred, and hides what is under it; so its body has its
  // own light and dark: clouds of it at two sizes drifting slowly (deep emerald in the hollows, bright where the lamp
  // is below), every ripple's trough darker than its crest, and the lamp's net seen in the water as fine bright lines
  float mot2 = fbm2(q*.47+vec2(t*.05, -t*.08)+7.), rip = (r1*.6+r2*.4-.5)*melt;
  float netL = clamp(causLight(q/3.1+.21, t*.3, fwP/3.1, .25)-.9, 0., 2.);
  float body = (.45+1.1*mott)*(.6+.8*mot2)*(1.+1.*rip)*(.92+.08*cl);
  // (a hollow is deep emerald, not the bright one dimmed: the lamp's own colour slides with it)
  vec3 scat = lampIn(clamp(open*body, 0., 1.15))*gz*min(.7+.3*body+.15*netL*(.35+.65*mot2), 1.3);
  // (where the shaft's light falls on the water at the foot of the blowhole lies a pale blue-white pool of it)
  // (ORDER 11: a BRIGHT pool, three metres about the foot, and a glow of it in the water for a dozen metres round)
  vec2 dsh = q-vec2(0., -80.4); float dS2 = dot(dsh, dsh), shOn = inside*(1.-smoothstep(0., .3, uSpout));
  float poolS = exp(-dS2/9.)*shOn, glowS = exp(-dS2/150.)*shOn;
  scat += shaftCol()*(poolS*.5*(.7+.3*cl)*(.6+.8*mot2)+glowS*.13*(.5+.5*body+.4*netL));
  // (where the sun shines in on it the water turns JADE: its own green paler and milkier, warmed by the sun's light in it)
  float sJ = inside*sunIn(P);
  // (LESS MILK, MORE WATER: the sun's own scatter in it is translucent, with depth: darker in the hollows and the
  // ripples' troughs, the bed's dark seen in patches through the hump's thin crest, the sun's caustic lines bright in it)
  float thinC = smoothstep(.85, .99, eh)*clamp(uHump.y*.45, 0., 1.)*smoothstep(.4, .7, vn(vec2(q.x*.31+t*.05, q.y*.12+3.)));
  float hol = clamp((.4+1.2*mot2)*(1.+1.2*rip)*(.7+.6*mott), .25, 1.7)*(1.-.55*thinC);
  scat = mix(scat, scat*.62+uSunCol*(vec3(.28, .52, .25)*(.08*hol*(.8+.2*cl))+vec3(.1, .5, .3)*(.05*netL)), sJ);
  // (THE WATER BETWEEN THE EYE AND WHAT LIES BELOW takes it away: the path the bent sight line runs in the water down
  // to the sand or a drowned top, or, close to a wall or a standing stump, level to the rock; an e-fold in 0.8 m in the
  // calm and in a quarter of a metre in the flood. The pale sand shows through a metre of it; a drowned top shows just
  // under the surface; nothing else)
  float sinT = sqrt(max(1.-cosT*cosT, 0.)), kS = mix(1.2, 4., uFlood);
  float aBody = 1.-exp(-min(depthU/cosT, (shore+.12)/max(sinT, .3))*kS);
  // (WHERE THE SHEET MEETS ROCK the water is dark in the rock's own shadow and stands against it: a soft dark contact
  // line, half a metre wide, under the grey-white ring: the wall stands IN the water)
  float cont = (1.-smoothstep(.05, .6, shore))*inside;
  scat *= 1.-.5*cont; aBody = max(aBody, .72*cont);
  // THE MIRROR (it reads the eye's bearing): the dark roof; near a wall, at a grazing look, the wall's own pipes standing
  // in the water; the mouth's light lying toward the eye as a path of glitter; the shaft's; outside, the sky and the sun
  vec3 R = reflect(-V, N); R.y = abs(R.y)+1e-3;
  float choir = (1.-smoothstep(-37., -26., P.z))*smoothstep(-68., -56., P.z);
  float xw = R.x > 0. ? 7.8 : -mix(7.8, 17.5, choir), tw = (xw-P.x)/(abs(R.x) > 1e-3 ? R.x : 1e-3);
  // (THE BACK WALL IS A WALL IN THE MIRROR TOO: a mirrored line that runs down the nave ends on it and shows its pipes and
  // the shaft's light on them. Before, the side walls' image gave out on a straight line there and left a dark box on
  // the water round the shaft's foot: two laws meeting on a ruled edge)
  float tb = (-88.-P.z)/min(R.z, -1e-3);
  bool bk = R.z < 0. && (tw < 0. || tb < tw); float th = bk ? tb : tw;
  float yh = P.y+th*R.y, zh = bk ? P.x+th*R.x+40. : P.z+th*R.z, zr = bk ? -88. : zh;
  float hit = step(0., th)*(1.-smoothstep(8., 15., yh-P.y))*(1.-smoothstep(-3., 1., zr));
  // (ORDER 11, THE SEAM: the wall's image lay on the far water as a RULED GRID: its cracks a fence of straight lines
  // every metre, its crust band's edge a straight step across the nave: a rectangle's edges round the shaft's foot. Water
  // does not mirror so: ripples too small to see spread the image by the length of the mirrored path (the pipes stand
  // in the water only close under a wall and melt into one soft tone a few metres out), and the larger ones sway it
  // (by place): the cracks waver and break, the band's edge wanders)
  float zhW = zh+(vn(vec2(q.x*.7+t*.15, q.y*.3-t*.1)+11.)-.5)*min(th*.3, 1.6)+(vn(q*2.3+vec2(-t*.3, t*.2)+4.)-.5)*min(th*.1, .5);
  float yhW = yh+(vn(vec2(q.x*.5-t*.1, q.y*.4+t*.12)+17.)-.5)*min(th*.4, 2.);
  vec3 wallC = wallMirror(zhW, yhW, P.y, fwidth(zh)+fwidth(yh)+steep+.6*uFlood+th*.09)+shaftCol()*(shaftAt(vec3(bk ? P.x+th*R.x : xw, yh, zr)).w*shOn*.05);
  vec3 envIn = mix(uGlowCol*.03*uGlowAmt, wallC, hit);       // (on a steep face the wall's pipes melt to a mean wall: no rows of lines)
  vec3 env = envIn;
  vec3 Lmv = vec3(1.5, 9., 4.)-P; float dmm = length(Lmv); vec3 Lm = Lmv/max(dmm, 1e-3);
  float sh = mix(.09, .2, 1.-melt)+5./max(dmm, 9.)*.5;                        // the mouth is wide; ripples too fine to see spread its image further
  vec2 dR = vec2(length(R.xz-Lm.xz), R.y-Lm.y);
  float lobe = exp(-dR.x*dR.x/(2.*sh*sh)-dR.y*dR.y/(2.*sh*sh*9.));           // long toward the mouth, narrow across
  float spk = vn(q*13.+vec2(t*1.1, -t*.7))*vn(q*21.+vec2(-t*.9, t*1.3)+5.);
  spk = mix(.3, 4.*spk*spk, melt*(1.-smoothstep(.02, .12, fwP)));           // near the lens the path breaks into sparks
  vec3 glit = uMouthCol*inside*(.35+.65*day)*lobe*(.25+.75*spk)*.9;
  // (THE BEAM IN THE WATER: where the mirrored sight line passes the lit column of spray, between the water and the
  // bell's mouth, the sheet shows it: a bright path lying on the water from the shaft's foot toward the eye, broken
  // into sparks by the ripples)
  vec3 w0s = P-AX0; w0s -= AXD*dot(w0s, AXD); vec3 wdS = R-AXD*dot(R, AXD);
  float aS = max(dot(wdS, wdS), 1e-4), bS = dot(w0s, wdS), tS = max(-bS/aS, 0.), r2S = max(dot(w0s, w0s)-bS*bS/aS, 0.);
  float scS = dot(P+R*tS-AX0, AXD);
  // (the image goes with the beam: it gives way to the heap as the beam does, by the event alone)
  float beamM = exp(-r2S/(1.5+.004*tS*tS))*step(0., -bS)*smoothstep(-3., 0., scS)*(1.-smoothstep(10., 16., scS))*shOn*(1.-smoothstep(1.7, 2.6, uPile));
  glit += shaftSky()*beamM*(.5+.8*spk)*1.1;
  float a = 1.-(1.-Fr)*(1.-aBody);
  vec3 col = (scat*aBody*(1.-Fr)+env*Fr)/max(a, 1e-3)+glit*max(Fr, .12)/max(a, .12);
  // OUTSIDE THE MOUTH THE WATER IS THE SEA (seaLook, the one text SEA_GLSL that a world's own sea includes too, so no edge
  // shows where the sheet slips under it): its face, the emerald's tongue from the sill, its lace
  vec3 seaC = seaLook(q, V, seaFw(q), t, seaSwell(q, t));
  col = mix(seaC, col, inside); a = mix(1., a, inside);
  // (THE SWELL'S CREST IS NOT RULED, in the cave and on the sill alike (to 14 m before the mouth; the open sea beyond
  // has its own): along its length the crest is thin water, the dark under it coming up through it in patches)
  float mouthK = 1.-smoothstep(4., 14., P.z);
  col *= 1.-clamp(uHump.y*.45, 0., 1.)*smoothstep(.8, 1., eh)*(.16+.5*thinC)*mouthK;
  // white water. In open water only thin white lace: threads of foam drawn out by the flow, in loose fields (the cells of
  // the caustic tile, sharp); it is thick only where the swell's crest passes (a trough takes it away), where the water
  // piles and where the spout's foot boils. Where water meets rock, where it pours off a stump and where a trough leaves
  // it thin over a sand bank it is LACE too: broken, soft-edged clots and threads drawn into streaks by the flow, the
  // green showing through; thicker and reaching further where the surge piles against the back wall
  float crest = max(uHump.y, 0.)*eh*.22;                                      // (a trough keeps the foam it has)
  float pile = uPile*(1.-smoothstep(-86., -56., P.z))*.45;
  float boil = uSpout*(1.-smoothstep(2., 8., length(P.xz-vec2(0., -81.))));   // the spout's foot boils
  float fld = uFlood*inside;                                                   // THE FLOOD (setFlood)
  float amt = clamp(uFoam+crest+pile+boil+.1*fld, 0., 1.);
  vec2 flow = vec2(.12, .5)*t*(.4+amt);
  float f1 = fbm2(q*.42+flow*.6), f2 = fbm2(q*1.25-flow*.35+4.);
  float dens = f1*.62+f2*.5, lth = mix(.74, .5, amt);
  float bub = vn(q*6.+flow*2.)*.6+vn(q*15.-flow*1.3)*.4;
  float thick = smoothstep(lth, lth+.3, dens+(bub-.5)*.2*melt+(vn(q*2.7+flow*1.5)-.5)*.22);              // 0 open water .. 1 deep white water
  vec2 lq = q+flow*1.4+(vec2(f1, f2)-.5)*1.5;
  float ll = log2(max(max(sqrt(fwidth(P.x)*fwidth(P.z)), fwP*.35)*51.2, 1.));
  float lace = causTap(lq/5.+.13, ll+.2)+.8*causTap(vec2(.8*lq.x-.6*lq.y, .6*lq.x+.8*lq.y)/2.9+.61, ll+.99);
  float marb = smoothstep(lth-.16, lth+.1, dens)*clamp(lace*1.5, 0., 1.)*(.55+.45*smoothstep(.25, .75, bub));
  float pour = emerge*smoothstep(top-.15, top+.55, uWetLine)*smoothstep(.05, .4, top-P.y);
  float reach = .45+.45*amt+.45*pour+2.2*pile+.9*fld;
  float band = max(1.-smoothstep(.0, reach, shore+(vn(q*3.1+t*.6)-.5)*.3*reach), 1.-smoothstep(.02, .3, over));
  vec2 sq = vec2(q.x*1.6, q.y*.5)+flow*vec2(.5, 1.)+(vec2(f1, f2)-.5)*.8;                    // streaks: long down the nave, with the flow
  float froth = vn(sq*2.1)*.55+vn(sq*5.3+7.)*.3+bub*.15;
  float thr = clamp((causTap(sq/3.3+.27, ll+.3)+.7*causTap(vec2(.8*sq.x-.6*sq.y, .6*sq.x+.8*sq.y)/2.1+.43, ll+.9))*1.6, 0., 1.);
  float dn = band*(.4+.6*clamp(amt+pour, 0., 1.));
  float contact = max(smoothstep(.74-.3*dn, .9-.3*dn, froth+.25*thr)*(.45+.55*bub), thr*.75)*smoothstep(0., .25, band)*.9;
  // (ORDER 11: NO PALE MUD: thick foam is never a soft wash over the water. What there is of it is TORN into crisp clots
  // and streaks, long down the flow, the clear emerald between them: its amount is the share of the water it covers)
  // (and it is LACE AND CLOTS (tornFoam): a net of white threads drawn long by the flow, with small clots where the foam
  // is deep; never a flat white floe)
  float fwT0 = fwidth(q.x)*5.+fwidth(q.y)*.9, covT = thick*amt*amt;
  float thickT = tornFoam(vec2(q.x, q.y*.5)+flow*vec2(.4, .25)+(vec2(f1, f2)-.5)*.6, covT, ll, fwT0, bub);
  float foam = clamp(max(thickT, marb*mix(.5, .95, amt))*inside+contact, 0., 1.);       // (the open water's lace and thick foam are the cave's; the sea has its own white)
  // A CONTACT RING: where the water touches rock (a wall's foot, a stump that stands out of it) a thin ragged ring of
  // grey-white froth hugs the rock, a hand to a forearm wide: white is in every view inside. In the flood the pavement
  // is under white water
  // THE FLOOD (setFlood) IS WHITE WATER ON GREEN: rafts of torn foam streaming up the nave toward the back wall, long
  // down the flow, thick in their middles, torn to lace and drawn-out threads at their edges; at its fullest they lie
  // on some four tenths of the sheet, and the emerald (jade where the sun lies) stands plain and strong between them:
  // no wash over the whole
  vec2 fq = vec2(q.x, q.y+1.3*t)+(vec2(f1, f2)-.5)*2.2;
  // (ORDER 11: IT IS FOAM, NOT PALE MUD: the rafts are smaller (a couple of metres across, long down the flow), bright,
  // and TORN: each is broken into crisp clots and threads by its own grain, thick in its middle, the clear emerald
  // showing in its holes and between the rafts)
  float fm = fbm2(vec2(fq.x*.8, fq.y*.26)+9.)+.16*(vn(vec2(fq.x*2.1, fq.y*.7))-.5), fth = mix(.78, .585, fld);
  float raftF = smoothstep(fth-.05, fth+.09, fm);
  // (the tear is long down the flow: threads and small clots streaming along the nave; it melts by its own footprint
  // to the raft's mean cover)
  float flCore = fld > 0. ? tornFoam(vec2(fq.x, fq.y*.5), raftF, ll, fwT0, bub) : 0.;
  float flF = flCore*min(fld*4., 1.);
  foam = max(foam, flF*.97);
  float ringF = (1.-smoothstep(.06, .3+.4*vn(q*2.3+vec2(0., t*.4)), shore))*(.55+.45*bub)*inside*(1.-smoothstep(.25, .9, fwP));
  float pav = fld*(1.-smoothstep(.2, 1.9, mp.a*2.))*(.45+.55*thr);
  foam = max(foam, max(ringF*.8, pav*.9));
  // (the swell's crest carries lace in patches along its length, never a line of it)
  float crL = smoothstep(.93, .995, eh)*clamp(uHump.y*.45, 0., 1.)*smoothstep(.36, .66, vn(vec2(q.x*.37-t*.06, q.y*.14+11.)))*mouthK;
  // (its threads lie along the crest, drawn out by it, with soft clots between)
  float crT = clamp(causTap(vec2(q.x*.4+f1*.6, q.y*1.2-t*.25)/2.9+.37, ll+.4)*1.8, 0., 1.);
  foam = max(foam, crL*max(crT, .4*smoothstep(.45, .8, vn(vec2(q.x*1.3+t*.2, q.y*.5))))*(.55+.45*bub)*.85);
  // THE LIFT (setLift, 0..1): within the hump's half length round its place the sheet turns to white water with body: torn
  // foam with the green in its hollows, its veins racing toward the back wall
  float lift = uLift*eh*inside;
  vec2 lw = vec2(q.x*.9, q.y*.3+t*2.2)+(vec2(f1, f2)-.5)*1.2;
  float tn = vn(lw*1.3)*.5+vn(lw*3.1+5.)*.3+bub*.2+.3*causTap(vec2(q.x*1.5, q.y*.4+t*3.)/3.+.2, ll+.3);
  // (order 11: the lift's white is torn foam too, threads and clots racing up the nave: at half strength it lay on the
  // water as soft pale patches, the "muddy" ones)
  float torn = tornFoam(vec2(q.x, q.y*.5+t*1.1)+(vec2(f1, f2)-.5)*.6, smoothstep(.68-.3*lift, .86-.3*lift, tn)*min(lift*3., 1.), ll, fwT0, bub);
  foam = max(foam, torn);
  // it has body: its thickness turns the light (the slope of the thickness itself), and its thin edges let the green through
  float hgt = max(max(thickT, band*.9), max(torn, flF))*(.55+.45*bub);
  vec2 dH = vec2(dFdx(hgt), dFdy(hgt)); float det = dPx.x*dPy.y-dPx.y*dPy.x;
  vec2 gH = abs(det) > 1e-10 ? vec2(dPy.y*dH.x-dPx.y*dH.y, dPx.x*dH.y-dPy.x*dH.x)/det : vec2(0.);
  gH *= melt/max(1., length(gH)*.4);
  vec3 Nf = nrm(vec3(-gH.x*.7, 1., -gH.y*.7));
  vec3 Lmo = vec3(1.5, 10., 3.)-P; float dmo = dot(Lmo, Lmo), mouthI = 650./(650.+dmo); Lmo *= inversesqrt(max(dmo, 1e-4));
  vec4 sAw = shaftAt(P); vec3 Lsh = nrm(sAw.xyz+vec3(0., .7, 0.)); float shaftI = sAw.w*inside*1.2;
  vec3 gw = mix(uGlowCol, vec3(dot(uGlowCol, vec3(.3, .5, .2))), .35);
  vec3 fl = uSkyCol*.55*mix(1., .5*day, inside)*(.55+.45*Nf.y)+uSunCol*(1.-inside)*.22*max(dot(Nf, uSunDir), 0.)+uSunCol*sJ*.16*(.3+.7*max(dot(Nf, uSunDir), 0.))
    +uMouthCol*inside*mouthI*(.3+.6*max(dot(Nf, Lmo), 0.))+shaftCol()*shaftI*(.35+.9*max(dot(Nf, Lsh), 0.))+gw*gz*(1.05+.25*max(flF, thickT))*(1.-.45*hgt);      // (the flood's clots are lit through from below: bright)
  col = mix(col, min(uFoamCol*.78*fl*mix(.92, .54+.62*bub, melt)*mix(1., 1.3+.15*max(flF, thickT), inside), vec3(.8)), foam);
  a = max(a, foam);
  // the sheet's rim: outside the mouth it dies away to nothing where the world's own sea takes over
  float rimM = length(vec2(P.x/16.5, max(P.z-2., 0.)/34.)), sea = 1.-smoothstep(.8, 1., rimM);
  a *= mix(sea, 1., inside*step(P.z, 0.));
  gl_FragColor = vec4(airMix(col, P, dist, inside), a);
}`,Ot=`
uniform float uTime, uLevel, uPile, uWetLine, uSea; uniform vec4 uHump;
attribute vec4 iR, iQ; varying vec4 vS; varying vec3 vP, vWp; varying vec2 vT;
float levelAt(float z){ float d = (z-uHump.x)/max(uHump.z, 1.); return mix(uLevel, uSea, smoothstep(2., 20., z)) + uHump.y*exp(-d*d) + uPile*(1.-smoothstep(-86., -56., z)); }
void main(){
  float s = position.x, t = position.y, seed = iQ.w;
  float lv = levelAt(iR.z), Hf = clamp(iR.y-lv, 0., iQ.z);
  // (A FALL ONLY WHERE WATER GATHERS AND LEAVES A TOP, by place: half the stumps pour; along the nave's foot east of
  // x = -11 (coming in from -13 to -9.5), two in five, and those falls a fifth wider (order 11c: eased from 1.35, so
  // that a veil keeps the clear air round the path: at its widest, at its foot, it is 2.03 of its stump's radius))
  float nearL = smoothstep(-13., -9.5, iR.x), pour = step(mix(.5, .6, nearL), fract(seed*7.31+.17));
  float a = smoothstep(.05, .4, iR.y-lv)*smoothstep(iR.y-2.2, iR.y+.2, uWetLine)*pour;      // (it pours while the level falls past the top and for some seconds after)
  float tau = t*sqrt(2.*Hf/9.81), veil = step(seed, .3);
  vec3 n = vec3(iQ.x, 0., iQ.y), tg = vec3(-iQ.y, 0., iQ.x);
  float w = iR.w*mix(.8, 1.25, smoothstep(0., 1., t))*mix(1., 1.35, veil)*mix(1., 1.2, nearL);        // (a little wider as it drops)
  vec3 P = vec3(iR.x, iR.y+.02, iR.z)+n*(.04+.75*tau)-vec3(0., 4.905*tau*tau, 0.)+tg*s*w*step(.004, a);
  vS = vec4(s, t*Hf, a, seed); vT = vec2(Hf, veil); vP = P;
  vec4 wp = modelMatrix*vec4(P, 1.); vWp = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp;
}`,Lt=`
${Ne}
varying vec4 vS; varying vec3 vP, vWp; varying vec2 vT;
void main(){
  float s = vS.x, m = vS.y, a = vS.z, seed = vS.w, Hf = vT.x, vk = vT.y;
  if(a < .004) discard;
  float dist = length(cameraPosition-vWp);
  // ONE FALL WITH A SHAPE (order 11; before, two or three parallel ropes and a veil: a comb of stripes): a ROPE, or on
  // three stumps in ten a ragged VEIL: a smooth bright tongue a hand or two wide at the lip, widening as it drops, its
  // edges ragged, its middle wavering; it TEARS as it falls: first into strands, lower into drops; and where it lands
  // a white SPLASH. No two alike (place, width, raggedness and breaks by the stump's own number). Strands and drops melt
  // to their mean as a pixel grows past them, and a fall narrower than a pixel is drawn a pixel wide and as much thinner
  float fwS = fwidth(s), keep = 1.-smoothstep(.03, .12, fwS);
  float x = s-(.05*sin(m*2.1+seed*30.-uTime*3.5)+.035*sin(m*5.3+seed*11.-uTime*6.))*smoothstep(0., .5, m);
  float rag = mix(.5, vn(vec2(seed*37.+(x > 0. ? 5. : 0.), m*2.3-uTime*4.)), keep);
  float hw = mix(mix(.11, .2, vk), mix(.2, .38, vk), smoothstep(0., 1.3, m))*(.75+.5*rag);
  float thin = min(1., 2.*hw/max(fwS, 1e-4));
  float body = (1.-smoothstep(hw*.5, hw+fwS, abs(x)))*thin*(1.-pow(abs(2.*s), 6.));
  float tear = smoothstep(.08, 1.2, m)*mix(1., 1.4, vk);
  float stn = mix(.5, vn(vec2(x*31.+seed*50., m*.45-uTime*5.5))*.6+vn(vec2(x*73.+seed*9., m*.8-uTime*7.))*.4, keep);
  float drp = mix(.55, vn(vec2(x*26.+seed*3., m*6.-uTime*13.)), keep);
  // (a veil of strands about a whiter core: the core a rope two fingers thick that holds together for a metre or so
  // and then breaks into drops; the veil thin enough that the wet rock shows through it)
  float dens = mix(1., smoothstep(.3+.26*tear, .52+.26*tear, stn), min(tear*1.6, 1.))*mix(.95, .6, min(tear*1.3, 1.));
  dens *= mix(1., min(smoothstep(.3, .6, drp)*1.25, 1.), smoothstep(.8, 2.4, m));
  float xc = x-(vn(vec2(seed*19., m*1.7-uTime*3.))-.5)*hw*.5;
  float core = (1.-smoothstep(hw*.12, hw*.3+fwS, abs(xc)))*thin*mix(1., smoothstep(.3, .55, drp), smoothstep(.7, 2., m))*(1.-vk*.6);
  dens = max(dens, core/max(body, .05));
  float lip = 1.-smoothstep(0., .22, m), dE = Hf-m;
  // (the splash: a ragged puff of white a hand or two over the place where it lands; the fall itself thins into it, and
  // nothing ends on a ruled line)
  float sn = mix(.5, vn(vec2(s*8.+seed*7., uTime*7.+seed*3.)), keep), dQ = dE-.14-.1*sn;
  float sg = mix(.5, vn(vec2(s*23.+seed*7., m*11.-uTime*9.)), keep);
  float spl = exp(-dQ*dQ/.012)*smoothstep(.3, .6, sn*.5+sg*.5+.12)*(1.-smoothstep(hw*1.1, hw*2.+fwS, abs(x)))*(1.-pow(abs(2.*s), 4.))*smoothstep(.3, .7, Hf)*smoothstep(0., .07, dE);
  float fallA = clamp(body*dens*(1.-.45*smoothstep(1.5, 3.5, m))*(.2+.8*smoothstep(0., .3+.2*sn, dE))+spl*.7, 0., 1.)*a*smoothstep(0., .04, m+.015)*smoothstep(0., .05, dE);
  float inside = (1.-smoothstep(-4., 7., vP.z)), day = dayAt(vP);
  float gz = glowIn(vP.z);
  vec3 Lmo = vec3(1.5, 10., 3.)-vP; float mouthI = 650./(650.+dot(Lmo, Lmo));
  vec3 gw = mix(uGlowCol, vec3(dot(uGlowCol, vec3(.3, .5, .2))), .5);
  vec3 fl = uSkyCol*.35*day+uMouthCol*mouthI*.6+gw*gz*.8+shaftCol()*shaftAt(vP).w*.7+uSunCol*sunIn(vP)*.2;
  vec3 col = min(uFoamCol*.8*fl*(.7+.3*dens+.25*lip+.2*spl), vec3(.8));       // (bright at the lip, where the tongue is whole)
  gl_FragColor = vec4(airMix(col, vP, dist, inside), min(fallA, 1.)*.95);
}`,qt=`
attribute vec2 aS; varying vec2 vS; varying vec3 vP, vWp;
void main(){ vS = aS; vP = position; vec4 wp = modelMatrix*vec4(position, 1.); vWp = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }`,It=`
${Ne}
uniform float uSpoutHead;
varying vec2 vS; varying vec3 vP, vWp;
float vnw(vec2 p, float per){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); float x0 = mod(i.x, per), x1 = mod(i.x+1., per);
  return mix(mix(h21(vec2(x0, i.y)), h21(vec2(x1, i.y)), f.x), mix(h21(vec2(x0, i.y+1.)), h21(vec2(x1, i.y+1.)), f.x), f.y); }
float ridge(float v){ return 1.-abs(2.*v-1.); }
void main(){
  float u = vS.x, s = vS.y, t = uTime;
  vec3 Vv = cameraPosition-vWp; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-4);
  float fw = fwidth(vP.x)+fwidth(vP.y)+fwidth(vP.z);
  // BY PLACE (the height s up the axis, never the lens's distance) the tube thins to NOTHING from 22 m up and is gone at
  // 32 m: the line rides the axis over its last 60 m, and from a lens at height sL on it a piece of the tube at height s,
  // r from the axis, stands on a sight line to the portal's disc (5.6 m, at 60 m) only if r*(60-sL) < 5.6*(s-sL): for no
  // s under 36.3 m with the lens on the line, under 32.2 m with the lens up to 0.6 m off it. So nothing drawn of the tube
  // can cross the disc. And it draws nothing at all at strength zero (no shaft, no film: the ropes are all there is)
  float thin = 1.-smoothstep(22., 32., s);
  // the spout: white water going up in ropes: broad rope-ways that start, swell and end as they climb, each a sheaf of thin
  // strands and racing streaks with a dense core; clots of it rise faster than the rest; open air between. Thin things melt to
  // their mean as a pixel grows over them: a white column with body where a pixel is large on it, streaks where it is small
  float tw = u+.008*sin(s*.23+t*1.3+u*12.566)+s*.0022;
  float r1 = ridge(vnw(vec2(tw*22., s*.028-t*1.6), 22.)*.6+vnw(vec2(tw*22.+7., s*.012-t*1.1), 22.)*.4);      // nearly straight: a rope drifts round the tube only slowly
  float r2 = ridge(vnw(vec2(tw*70.+3., s*.12-t*4.6), 70.));
  float r3 = vnw(vec2(tw*200., s*.5-t*8.), 200.);
  float fwU = fwidth(u)*19., fwS = fwidth(s);                                 // a pixel's reach across the ropes and along them
  float fine = 1.-smoothstep(.03, .12, fwU);
  float strands = mix(.3, max(smoothstep(.88, .985, r2), smoothstep(.7, .9, r3)*.85*(1.-smoothstep(.6, 2., fwS))), fine);
  float clot = .25+.75*smoothstep(.3, .7, vnw(vec2(tw*9., s*.22-t*5.), 9.));
  float way = smoothstep(.74, .9, r1), core = smoothstep(.92, .99, r1);
  float fleck = step(.93, vnw(vec2(tw*300., s*4.-t*20.), 300.))*.4*(1.-smoothstep(.01, .03, fwU))*(1.-smoothstep(.1, .3, fwS));
  float rope = clamp(way*(.15+.85*strands)*clot+core*.8+fleck, 0., 1.);
  float head = 1.-smoothstep(uSpoutHead-8.-5.*vnw(vec2(u*7., t*.6), 7.), uSpoutHead, s);
  float ar = rope*uSpout*head*smoothstep(-4., 2., s)*.94*thin;
  vec3 fl = shaftCol()*(.42+.5*smoothstep(0., 60., s))+uGlowCol*uGlowAmt*.45*exp(-max(s, 0.)/12.);
  vec3 cr = min(uFoamCol*.78*fl*(.45+.8*clamp(core+strands*.4*fine, 0., 1.)), vec3(.8));
  if(ar < .003) discard;
  gl_FragColor = vec4(airMix(cr, vP, dist, 1.), ar);
}`,Dt=`
uniform float uSea; varying vec3 vP, vWp;
void main(){ vec3 P = vec3(position.x, uSea-.2, position.z); vP = P; vec4 wp = modelMatrix*vec4(P, 1.); vWp = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }`,Ft=`
${Ne}
varying vec3 vP, vWp;
void main(){
  vec3 P = vP;
  if(P.z < .5 && P.z > -92. && abs(P.x) < 20.5) discard;
  if(length(vec2(P.x*2.1, max(P.z-2., 0.))) < 21. && P.z > -1.) discard;
  vec3 Vv = cameraPosition-vWp; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-4);
  float fwP = fwidth(P.x)+fwidth(P.z);
  vec2 q = P.xz, o1 = vec2(uTime*.25, uTime*.4);
  vec3 col = seaLook(q, V, seaFw(q), uTime, seaSwell(q, uTime));                   // the same look the sheet wears before the mouth
  // the surf line along the plinth (the stand-in's own; a world's ocean reads depthAt for its shore)
  float ex = P.x/120., ez = (P.z+65.)/65.; ex *= ex; ez *= ez;
  float shoreD = (pow(ex*ex*ex+ez*ez*ez+1e-9, 1./6.)-1.)*66.-4.2;
  float surf = (1.-smoothstep(.2, 3.4, shoreD+.9*sin(uTime*.9+P.x*.11)))*step(-56., P.z);
  col = mix(col, min(uFoamCol*.7*(uSkyCol+uSunCol*.2), vec3(.8)), surf*smoothstep(.25, .6, fbm2(q*.9+o1*.5)+.35*surf));
  gl_FragColor = vec4(airMix(col, P, dist, 0.), 1.);
}`;function Ht(y,P){const O=[],D=[];for(let N=0;N<=6;N++)O.push(-.5,N/6,0,.5,N/6,0);for(let N=0;N<6;N++){const n=N*2;D.push(n,n+2,n+1,n+1,n+2,n+3)}const b=new u.InstancedBufferGeometry;b.setAttribute("position",new u.Float32BufferAttribute(O,3)),b.setIndex(D);const C=y.length,I=new Float32Array(C*4),w=new Float32Array(C*4);for(let N=0;N<C;N++){const n=y[N];I.set([n.x,n.y,n.z,n.w],N*4),w.set([n.nx,n.nz,n.drop,n.seed],N*4)}b.setAttribute("iR",new u.InstancedBufferAttribute(I,4)),b.setAttribute("iQ",new u.InstancedBufferAttribute(w,4)),b.instanceCount=C,b.boundingSphere=new u.Sphere(new u.Vector3(-10,0,-45),40);const F=new u.ShaderMaterial({uniforms:P,vertexShader:Ot,fragmentShader:Lt,transparent:!0,depthWrite:!1,side:u.DoubleSide}),L=new u.Mesh(b,F);L.frustumCulled=!1,L.renderOrder=3,L.name="organ-cave-runoff";const l=44,o=28,c=[],V=[],ee=[],s=new u.Vector3(0,fe.z,-fe.y);for(let N=0;N<=l;N++){const n=-4+66*(N/l),T=Z(2.5,4,me(n/60,0,1));for(let t=0;t<=o;t++){const v=t/o*Math.PI*2,f=Math.cos(v)*T,p=Math.sin(v)*T;c.push(ue.x+fe.x*n+f,ue.y+fe.y*n+s.y*p,ue.z+fe.z*n+s.z*p),V.push(t/o,n)}}for(let N=0;N<l;N++)for(let n=0;n<o;n++){const T=N*(o+1)+n,t=T+1,v=T+o+1,f=v+1;ee.push(T,v,t,t,v,f)}const d=new u.BufferGeometry;d.setAttribute("position",new u.Float32BufferAttribute(c,3)),d.setAttribute("aS",new u.Float32BufferAttribute(V,2)),d.setIndex(ee),d.computeBoundingSphere();const R=new u.ShaderMaterial({uniforms:P,vertexShader:qt,fragmentShader:It,transparent:!0,depthWrite:!1,side:u.DoubleSide}),S=new u.Mesh(d,R);return S.frustumCulled=!1,S.renderOrder=4,S.name="organ-cave-spout",{ribbons:L,spout:S,triangles:C*12+ee.length/3}}const Wt=`
uniform float uTime;
attribute vec4 iG, iH; varying vec3 vP, vWp; varying vec2 vC;
float h11(float p){ p = fract(p*.1031); p *= p+33.33; p *= p+p; return fract(p); }
void main(){
  float bl = position.z, t = position.y, seed = iH.w;
  float yaw = iH.x+bl*2.1+seed*6., hgt = iG.w*(.7+.3*h11(seed*31.+bl*7.));
  vec2 dir = vec2(cos(yaw), sin(yaw));
  // a blade leans out over the edge and bows to the wind; gusts run through the fringe
  float gust = sin(uTime*1.9+iG.x*.31+iG.z*.23+seed*3.)*.5+sin(uTime*3.7+iG.x*.9+seed*11.)*.22;
  vec2 bow = iH.yz*(.3+.5*t)+vec2(.8, .25)*(.3+.3*gust)+dir*(h11(seed*13.+bl)-.5)*.5;
  float bend = t*t;
  vec3 P = iG.xyz+vec3(dir.x*position.x, 0., dir.y*position.x)+vec3(bow.x*bend*hgt, t*hgt*(1.-.25*bend*min(dot(bow, bow), 1.6)), bow.y*bend*hgt);
  vP = P; vC = vec2(t, h11(seed*77.+bl*3.));
  vec4 wp = modelMatrix*vec4(P, 1.); vWp = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp;
}`,Bt=`
${Ne}
varying vec3 vP, vWp; varying vec2 vC;
void main(){
  float t = vC.x, dist = length(cameraPosition-vWp);
  vec3 alb = mix(mix(vec3(.05, .085, .025), vec3(.2, .24, .07), t), vec3(.3, .27, .13), step(.7, vC.y)*t*.8);
  vec3 col = alb*(uSkyCol*.9+uSunCol*(.22+.45*t));
  gl_FragColor = vec4(airMix(col, vP, dist, 0.), 1.);
}`;async function Gt(y,P,O,D,b){const C=[],I=[],w=P.browRows,F=w[1].length,L=b;let l=0;for(let v=0;v<F;v++){const f=(v+1)%F,p=w[1][v],h=w[1][f];if(p[5]>.6)continue;const m=Math.round(Math.hypot(h[0]-p[0],h[2]-p[2])*5.2*L);for(let E=0;E<m;E++,l++){const k=O.hash(l,911,31),q=.25+1.5*O.hash(l,912,32),B=Math.min(1,Math.floor(q)),a=q-B,r=w[B][v],M=w[B][f],H=w[B+1][v],W=w[B+1][f],i=Z(Z(r[0],M[0],k),Z(H[0],W[0],k),a),g=Z(Z(r[1],M[1],k),Z(H[1],W[1],k),a),z=Z(Z(r[2],M[2],k),Z(H[2],W[2],k),a),A=1-me(q-.6,0,1);C.push(i,g-.12,z,.65+.7*O.hash(l,913,33)),I.push(O.hash(l,914,34)*6.283,p[3]*A,p[4]*A,O.hash(l,915,35))}v%40===39&&await y.yield()}const o=P.pos,c=P.idx,V=[];for(let v=0;v<c.length;v+=3){const f=c[v],p=c[v+1],h=c[v+2];if(f<P.topFrom||f>=P.topTo)continue;const m=(o[f*3]+o[p*3]+o[h*3])/3,E=(o[f*3+2]+o[p*3+2]+o[h*3+2])/3;Math.abs(m)<13&&E<-89&&E>-118&&V.push(f*3,p*3,h*3),v%3e4===29997&&await y.yield()}const ee=(v,f)=>{for(let p=0;p<V.length;p+=3){const h=V[p],m=V[p+1],E=V[p+2],k=o[m]-o[h],q=o[m+2]-o[h+2],B=o[E]-o[h],a=o[E+2]-o[h+2],r=k*a-B*q;if(Math.abs(r)<1e-9)continue;const M=v-o[h],H=f-o[h+2],W=(M*a-B*H)/r,i=(k*H-M*q)/r;if(W>=-1e-4&&i>=-1e-4&&W+i<=1.0001)return o[h+1]+W*(o[m+1]-o[h+1])+i*(o[E+1]-o[h+1])}return null},s=fe.z,d=-fe.y,R=Math.round(720*L),S=(v,f,p)=>{const h=v-ue.x,m=f-ue.y,E=p-ue.z,k=m*fe.y+E*fe.z;return[Math.sqrt(Math.max(0,h*h+m*m+E*E-k*k)),k]};for(let v=0;v<R;v++,l++){const f=(v+O.hash(l,916,36))/R*Math.PI*2,p=O.hash(l,917,37),h=.6+.7*O.hash(l,918,38);for(let m=6.7+1.6*p*p,E=0;E<7;E++,m+=.3){const k=Math.cos(f)*m,q=Math.sin(f)*m;let B=59,a=ue.x+k,r=0,M=0,H=null;for(let U=0;U<5&&(r=ue.y+fe.y*B+s*q,M=ue.z+fe.z*B+d*q,H=ee(a,M),H!==null);U++)B+=(H-r)/fe.y;if(H===null||(M=ue.z+fe.z*B+d*q,H=ee(a,M),H===null))break;const W=S(a,H,M)[1],i=ue.x,g=ue.z+fe.z*W;let z=i-a,A=g-M;const x=Math.hypot(z,A)||1;if(z/=x,A/=x,!(Math.min(S(a,H-.12,M)[0],S(a+z*.45,H,M+A*.45)[0],S(a+z*.45,H+h,M+A*.45)[0],S(a,H+h,M)[0])<6.35)){C.push(a,H-.12,M,h),I.push(O.hash(l,919,39)*6.283,-z*.6,-A*.6,O.hash(l,920,40));break}}v%60===59&&await y.yield()}const N=[],n=[];for(let v=0;v<2;v++){const f=v*5;N.push(-.05,0,v,.05,0,v,-.032,.55,v,.032,.55,v,0,1,v),n.push(f,f+1,f+2,f+1,f+3,f+2,f+2,f+3,f+4)}const T=new u.InstancedBufferGeometry;T.setAttribute("position",new u.Float32BufferAttribute(N,3)),T.setIndex(n),T.setAttribute("iG",new u.InstancedBufferAttribute(new Float32Array(C),4)),T.setAttribute("iH",new u.InstancedBufferAttribute(new Float32Array(I),4)),T.instanceCount=C.length/4,T.boundingSphere=new u.Sphere(new u.Vector3(0,46,-50),170);const t=new u.Mesh(T,new u.ShaderMaterial({uniforms:D,vertexShader:Wt,fragmentShader:Bt,side:u.DoubleSide}));return t.frustumCulled=!1,t.name="organ-cave-grass",{mesh:t,tufts:C.length/4,triangles:C.length/4*6}}const Ie=16,tt=2.6,ot=-2.5,nt=.3;function it(y){const P=(y%Ie+Ie)%Ie;return P<4.5?tt:P<8?Z(tt,ot,X(0,1,(P-4.5)/3.5)):P<13?ot:Z(ot,tt,X(0,1,(P-13)/3))}async function Vt(y,P={}){const O=y.rng,D=y.quality?.detail??1,b=(P.palette&&P.palette.length>=6?P.palette:ut).map(e=>new u.Color(e)),C={n2:y.noise.n2,o1:O.range(0,90),o2:O.range(0,90),o3:O.range(0,90),o4:O.range(0,90),h0:O.range(0,500)},I=pt(C),w=wt(C);await y.yield();const F=await xt(y);await y.yield();const L=(e,j)=>new u.Vector3(e.r*j,e.g*j,e.b*j),l=(e,j)=>{const Y=Math.max(e.r,e.g,e.b,1e-4);return new u.Vector3(e.r/Y*j,e.g/Y*j,e.b/Y*j)},o={uTime:{value:0},uLevel:{value:0},uWetLine:{value:0},uGlowAmt:{value:1},uFoam:{value:.3},uPile:{value:0},uSpout:{value:0},uSpoutHead:{value:62},uSea:{value:0},uHump:{value:new u.Vector4(60,0,16,0)},uSunDir:{value:new u.Vector3(.42,.74,.52).normalize()},uSunCol:{value:L(new u.Color("#FFF6E8"),2.6)},uSkyCol:{value:L(new u.Color("#8FA9BC"),.95)},uMouthCol:{value:new u.Vector3(2.7,2.9,3)},uShaftCol:{value:new u.Vector3(1.25,1.7,2.2)},uGlowCol:{value:l(b[1],1.3)},uBasalt:{value:l(b[0],.1)},uPink:{value:L(b[3],1)},uOchre:{value:L(b[4],1)},uBarn:{value:L(b[5],.34)},uIvory:{value:new u.Vector3(.36,.42,.33)},uDeep:{value:L(b[2],3.2)},uFoamCol:{value:L(b[5],1)},uAirCol:{value:L(new u.Color("#C9D6D8"),1)},uAirDen:{value:.0012},uSeaBody:{value:new u.Vector3(.02,.06,.07)},uSeaK:{value:0},uWind:{value:.35},uLift:{value:0},uFlood:{value:0},uSeaZen:{value:new u.Vector3(.2,.35,.6)},uSeaMid:{value:new u.Vector3(.5,.6,.7)},uSeaHor:{value:new u.Vector3(.8,.84,.85)},uSeaScat:{value:new u.Vector3(1,.95,.85)},uSeaScatDir:{value:new u.Vector3(0,1,0)},uSeaP:{value:new u.Vector4(1,4,0,8)},uSeaQ:{value:new u.Vector4(1,1,0,0)},uMap:{value:null},uRect:{value:new u.Vector4(xe,ye,Oe-xe,Le-ye)},uCaus:{value:null}};o.uCaus.value=await Nt(y,w),await y.yield();const c=await vt(y,I,w,C,F,D);await y.yield();const V=[[63,46],[-57,60]];for(const[e,j]of V){const te=Math.round(e/ge),oe=Math.round(j/(ge*.866));for(let ie=oe-7;ie<=oe+7;ie++)for(let de=te-6;de<=te+6;de++){const ce=w.point(de,ie),Ae=Math.hypot(ce[0]-e,ce[1]-j)/(5.2*(1+.25*C.n2(ce[0]*.3+C.o1,ce[1]*.3)));if(Ae>1)continue;const ke=w.hash(de,ie,3),Me=Math.max(1.5,14*(1-.75*Ae*Ae)-3*ke*ke-(w.hash(de,ie,4)<.2?4:0));c.far.push({x:ce[0],z:ce[1],y0:We,y1:Me,P:w.cell(de,ie),seed:ke*.97+.015,top:1,bot:0,indoor:0,joint:.4+.8*w.hash(de,ie,5)}),c.lists.ledges.push([ce[0],Me,ce[1]])}await y.yield()}const ee=new u.ShaderMaterial({uniforms:o,vertexShader:St,fragmentShader:At,side:u.DoubleSide}),s=new u.Group;s.name="organ-cave";const d=[[-1,0],[0,-1],[0,1],[1,-1],[1,1],[2,-1],[2,1],[3,0]],R=[[-1,0],[1,-1],[1,1],[3,0]],S=[[-1,0],[3,0]],N=[["near",je(d,"cup"),c.near,119],["stump",je(R,"cup"),c.stump,63],["roof",je(S,"under"),c.roof,35],["far",je(S,"fan"),c.far,21]],n={instances:{},triangles:{},calls:0,minClear:c.lists.minClear,dropped:c.lists.dropped};for(const[e,j,Y,te]of N){bt(j,Y),j.boundingSphere=new u.Sphere(new u.Vector3(0,20,-50),190);const oe=new u.Mesh(j,ee);oe.frustumCulled=!1,oe.name="organ-cave-"+e,s.add(oe),n.instances[e]=Y.length,n.triangles[e]=Y.length*te,n.calls++,await y.yield()}const T=await Tt(y,I,C,w),t=new u.Mesh(T.geometry,new u.ShaderMaterial({uniforms:o,vertexShader:Et,fragmentShader:zt,side:u.DoubleSide}));t.frustumCulled=!1,t.name="organ-cave-ground",s.add(t),n.triangles.ground=T.triangles,n.calls++,await y.yield();const v=await Pt(y,w,T);{const e=new u.Mesh(v.geometry,t.material);e.frustumCulled=!1,e.name="organ-cave-ground-added",s.add(e)}n.triangles.added=v.triangles,n.instances.drums=v.drums,n.instances.sods=v.sods,n.instances.tussocks=v.tufts,n.calls++,await y.yield();const f=n.triangles.near+n.triangles.stump+n.triangles.roof+n.triangles.far+T.triangles+3072*2+6200+48,p=await Gt(y,T,w,o,(.5+.5*D)*me((292e3-f)/6/2750,.35,1));s.add(p.mesh),n.triangles.grass=p.triangles,n.instances.grass=p.tufts,n.calls++,await y.yield();const h=[];for(const e of c.stump)h.push({x:e.x,z:e.z,r:e.P.rmean,top:e.y1,wall:e.y1>5});for(const e of c.near)e.y0<6&&h.push({x:e.x,z:e.z,r:e.P.rmean,top:8,wall:!0});for(const e of c.far)e.y0<6&&e.z<Le+3&&e.x>xe-3&&e.x<Oe+3&&h.push({x:e.x,z:e.z,r:e.P.rmean,top:e.y1,wall:e.y1>5});o.uMap.value=await Rt(y,I,h),await y.yield();const m=new u.PlaneGeometry(Oe-xe,Le-ye,32,96);await y.yield(),m.rotateX(-Math.PI/2),m.translate((xe+Oe)/2,0,(ye+Le)/2),m.boundingSphere=new u.Sphere(new u.Vector3(-2,0,-25),75);const E=new u.Mesh(m,new u.ShaderMaterial({uniforms:o,vertexShader:Mt,fragmentShader:Ct,transparent:!0,depthWrite:!1}));if(E.frustumCulled=!1,E.renderOrder=2,E.name="organ-cave-water",s.add(E),n.triangles.water=3072*2,n.calls++,await y.yield(),P.sea!==!1){const e=new u.CircleGeometry(1400,48);e.rotateX(-Math.PI/2);const j=new u.Mesh(e,new u.ShaderMaterial({uniforms:o,vertexShader:Dt,fragmentShader:Ft,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:4}));j.frustumCulled=!1,j.name="organ-cave-stand-in-sea",s.add(j),n.triangles.sea=48,n.calls++}const k=O.fork("runoff"),q=k.shuffle(c.lists.runoff.slice()).slice(0,Math.round(300*(.5+.5*D)));for(const e of q)e.seed=k();const B=Ht(q,o);s.add(B.ribbons,B.spout),n.triangles.whiteWater=B.triangles,n.calls+=2,n.triangles.total=Object.values(n.triangles).reduce((e,j)=>e+j,0),await y.yield();const a=O.fork("anchors"),r=a.fork("seals"),M=a.fork("kittiwakes"),H=a.fork("chimney-ledges"),W=a.fork("drips"),i=(e,j,Y)=>{const te=[];for(const oe of e){if(te.length>=j)break;te.every(ie=>Math.hypot(ie[0]-oe[0],ie[2]-oe[2])>=Y)&&te.push(oe)}return te},g=c.lists.stumps,z=i(r.shuffle(g.filter(e=>e.y>-2.7&&e.y<-.4&&e.x>-12.5).map(e=>[e.x,e.y,e.z])),12,2.1),A=i(g.filter(e=>e.y>2.8).sort((e,j)=>j.y-e.y).map(e=>[e.x,e.y,e.z]),9,1.25),x=i(M.shuffle(c.lists.ledges.filter(e=>e[1]>7)),60,2.2).concat(i(H.shuffle(c.lists.chimLedges.filter(e=>e[1]>14)),40,1.8)),G=i(W.shuffle(c.lists.roofEnds.slice()),48,3);await y.yield(),n.instances.relief=await yt(y,I,C,w,c,N,x);const U=[];for(const e of g)e.y<-.8&&U.push([e.x,e.y,e.z]);for(let e=-112;e<=112;e+=2.6){if(Math.abs(e)<13)continue;const j=I.frontZ0(e)-I.FRONT_SHIFT+6-.8*I.faceBackU(e)+1.2*C.n2(e*.2,4.4);U.push([e,-.6+1.2*C.n2(e*.31,9.9),j])}const K={path:F.pts.map(e=>new u.Vector3(e[0],e[1],e[2])),portal:Re.clone(),portalDir:fe.clone(),lip:{center:Re.clone(),radius:6.3,axisFoot:ue.clone(),axisDir:fe.clone()},mouthFoot:new u.Vector3(0,0,0),mouthTop:new u.Vector3(0,24,0),jamb:new u.Vector3(8.4,0,1.2),jambTop:new u.Vector3(8.4,15,1.2),choir:new u.Vector3(-4,0,-45),bell:new u.Vector3(0,15,-84),backWall:new u.Vector3(0,0,-88),seals:z.map(e=>new u.Vector3(e[0],e[1],e[2])),shags:A.map(e=>new u.Vector3(e[0],e[1],e[2])),kittiwakes:x.map(e=>new u.Vector3(e[0],e[1],e[2])),drips:G.map(e=>new u.Vector3(e[0],e[1],e[2])),kelp:U.map(e=>new u.Vector3(e[0],e[1],e[2])),stumps:g.map(e=>({x:e.x,y:e.y,z:e.z,r:e.r,cup:e.cup})),stacks:V.map(([e,j])=>new u.Vector3(e,14,j)),sheet:{x0:xe,x1:Oe,z0:ye,z1:Le}};let Q=!1,J=0,_=0,$=null,ae=!1,se=null,re=!1,ne=!1;const he=new u.Vector3,le=new u.Vector3,we={setLevel(e){Q||(Q=!0,_=Math.max(_,e),o.uHump.value.y=0,o.uPile.value=0,o.uSpout.value=0,o.uFoam.value=.3),J=e},setWetLine(e){$=e??null},setSwell(e,j,Y=16){o.uHump.value.set(e,j,Math.max(8,Y),0)},setPile(e){o.uPile.value=e},setSpout(e,j=62){o.uSpout.value=me(e,0,1),o.uSpoutHead.value=j},setFoam(e){o.uFoam.value=me(e,0,1)},setGlow(e){o.uGlowAmt.value=e},setLight(e={}){const j=(Y,te,oe)=>{if(te!==void 0){const ie=new u.Color(te);Y.value.set(ie.r*oe,ie.g*oe,ie.b*oe)}};e.sunDir&&o.uSunDir.value.copy(e.sunDir).normalize(),j(o.uSunCol,e.sun,e.sunIntensity??2.6),j(o.uSkyCol,e.sky,e.skyIntensity??.95),j(o.uMouthCol,e.mouth,e.mouthIntensity??3),j(o.uShaftCol,e.shaft,e.shaftIntensity??2.2)},followLights(e=!0){re=!!e},setAir(e,j){ae=!0;const Y=new u.Color(e);o.uAirCol.value.set(Y.r,Y.g,Y.b),o.uAirDen.value=j},levelAt(e){const j=o.uHump.value,Y=(e-j.x)/Math.max(j.z,1);return Z(o.uLevel.value,o.uSea.value,X(2,20,e))+j.y*Math.exp(-Y*Y)+o.uPile.value*X(-56,-86,e)},setSea(e){o.uSea.value=e},setWind(e){o.uWind.value=me(e,0,1)},setLift(e){o.uLift.value=me(e,0,1)},setFlood(e){o.uFlood.value=me(e,0,1)},setSeaBody(e){if(e==null){ne=!1;return}ne=!0;const j=new u.Color(e);o.uSeaBody.value.set(j.r,j.g,j.b)},floorAt:I.floorAt,ceilAt:I.ceilAt,topAt:I.topAt,wetLine:()=>o.uWetLine.value,sheetAt(e,j){return j<=0?Math.abs(e)<9.5?1:0:1-X(.6,.9,Math.hypot(e/16.5,Math.max(j-2,0)/34))},depthAt(e,j){return I.inFoot(e,j)?-5:j>-1&&Math.hypot(e*2.1,Math.max(j-2,0))<21?-1:me(1.3*((I.foot(e,j+I.FRONT_SHIFT)-1)*66-4.6),-6,30)}};s.userData.organCave=we,s.userData.anchors=K;function De(e,j){if(o.uTime.value=j,!Q&&P.demo!==!1){J=it(j);let Y=J;for(let de=1;de<=60;de++)Y=Math.max(Y,it(j-de*.4)-nt*de*.4);_=Y;const te=(j%Ie+Ie)%Ie,oe=X(12,13.5,te)*(1-X(15.5,16,te));o.uHump.value.set(Z(34,-86,me((te-12)/4.5,0,1)),1.3*oe,16,0);const ie=te<3?Math.sin(Math.PI*te/3):0;o.uPile.value=1.4*Math.max(ie,X(15,16,te)),o.uSpout.value=Math.pow(ie,.6),o.uSpoutHead.value=62,o.uFoam.value=.28+.45*Math.max(oe,ie)}else{const Y=se===null?0:me(j-se,0,.25);_=Math.max(J,_-nt*Y)}if(se=j,o.uLevel.value=J,o.uWetLine.value=$===null?_:$,!ae){let Y=s;for(;Y.parent;)Y=Y.parent;Y.fog&&Y.fog.isFogExp2&&(o.uAirCol.value.set(Y.fog.color.r,Y.fog.color.g,Y.fog.color.b),o.uAirDen.value=Y.fog.density)}if(!ne){const Y=o.uDeep.value,te=o.uSkyCol.value,oe=o.uSunCol.value;o.uSeaBody.value.set(Y.x*.5*(te.x*1.3+oe.x*.05),Y.y*.5*(te.y*1.3+oe.y*.05),Y.z*.5*(te.z*1.3+oe.z*.05))}if(re){let Y=s;for(;Y.parent;)Y=Y.parent;let te=null,oe=null;for(const ce of Y.children)ce.isDirectionalLight&&!te?te=ce:ce.isHemisphereLight&&!oe&&(oe=ce);te&&(he.setFromMatrixPosition(te.matrixWorld),le.setFromMatrixPosition(te.target.matrixWorld),he.sub(le),he.lengthSq()>1e-8&&o.uSunDir.value.copy(he).normalize(),o.uSunCol.value.set(te.color.r,te.color.g,te.color.b).multiplyScalar(te.intensity)),oe&&o.uSkyCol.value.set(oe.color.r,oe.color.g,oe.color.b).multiplyScalar(oe.intensity*.8);const ie=o.uSkyCol.value,de=o.uSunCol.value;o.uMouthCol.value.set(ie.x*4+de.x*.6,ie.y*4+de.y*.6,ie.z*4+de.z*.6),o.uShaftCol.value.set(ie.x*4.6,ie.y*4.6,ie.z*4.6)}}return De(0,0),{object:s,radius:125,height:60,center:new u.Vector3(0,16,-40),anchors:K,update:De,dispose(){},ground:!1,groundY:0,uniforms:o,stats:n,...we}}export{kt as SEA_GLSL,Vt as buildHero};
