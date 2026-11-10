import*as R from"three";import{makeNoise as Rt,makeRng as xn,makePath as mn,hashSeed as At,clamp as q,lerp as T,smoothstep as O}from"../kit/core.js";const dt=24,j=12*Math.sqrt(3),D=20,We=[-6,-5,-4],Ft=1,Tt=28,vn=50,z=[0,0,D*Tt],ue=5,V={x0:-400,x1:430,y0:-300,y1:300},Ht=t=>t>=Tt,pe=t=>t>=Ft&&t<=vn||t>=We[0]&&t<=We[2],U=(t,e)=>j*(t+(Ht(e)?0:2/3)),Gt=(t,e,a)=>[12*t,U(e,a),D*a],Jt=(t,e,a)=>((t+512)*1024+(e+512))*128+(a+16),$e=[[2,0],[1,1],[-1,1],[-2,0],[-1,-1],[1,-1]],gn=Rt(At("where-the-lattice-grows:face")),wn=Rt(At("where-the-lattice-grows:face-wide")),yn=Rt(At("where-the-lattice-grows:far-wall")),k={x:84,z:340,ax:250,ay:130,az:250,ripple:.05},Ve=k.x+k.ax,Ke=new Map;function An(t,e){const a=Math.round(t*16)*4096+Math.round(e*2);let o=Ke.get(a);if(o===void 0){o=36+8*gn.n2(t/90,e/90);const n=bt(o+48,t,e,o+48,t,e,80);o+=20*wn.n2(t/38,e/150)*O(40,80,n),Ke.set(a,o)}return o}const Mn=(t,e)=>An(t,e)+48,J={x:112,y:0,z:80,ax:62,ay:58,az:70},En=(t,e,a)=>{const o=J,n=(t-o.x)/o.ax,r=(e-o.y)/o.ay,l=(a-o.z)/o.az,f=Math.hypot(n,r,l);return f<1e-6?-Math.min(o.ax,o.ay,o.az):(f-1)/(Math.hypot(n/o.ax,r/o.ay,l/o.az)/f)};function nt(t,e,a){const o=k,n=Mn(e,a),r=(t-n)/o.ax,l=e/o.ay,f=(a-o.z)/o.az,i=Math.hypot(r,l,f),c=En(t,e,a);if(i<1e-6)return Math.min(n-t,c);const u=1+o.ripple*yn.n3(t/110,e/110,a/110),d=Math.hypot(r/o.ax,l/o.ay,f/o.az)/i;return Math.min(Math.max(n-t,(i-u)/d),c)}const bn=0,_n=1,qt=2,Ct=3,te=t=>t>48?bn:t>26?_n:t>0?qt:Ct,xe=(t,e,a)=>te(nt(t,e,a)),In=Rt(At("where-the-lattice-grows:net-edge")),Rn=Rt(At("where-the-lattice-grows:net-reach")),Ye=[30,90],Fn=40,je=[150,230],Tn=40,Ue=-.1,Cn=.3,Ln=.35;function Sn(t,e,a){const o=O(je[0],je[1],a);if(o<=0)return 0;const n=q((In.n3(t/75,e/55,a/65)-Ue)/(.6-Ue),0,1);return n<=0?0:o*Math.sqrt(n)*T(Ye[0],Ye[1],q(.5+.8*Rn.n3(t/160,e/120,a/140),0,1))}function er(t,e,a,o,n,r,l){if(Math.hypot(o,n)<Tn)return 1;const f=Sn(o,n,r);if(f<=0)return 1;const i=l-f;if(i<=0)return 0;const c=O(0,Fn,i),u=O(0,12,f);return at(t,e,a,521)>T(1,T(Cn,1,c),u)?0:T(1,T(Ln,1,c),u)}const On=Rt(At("where-the-lattice-grows:net-rest")),me=[330,290,370],Wt=[.08,.22,.56,.66],Mt=[2*dt,4*dt];function Nn(t,e,a,o){const n=Math.hypot(t,e);if(n<Mt[0])return 1;const r=q(.5+.8*On.n3((t+o[0])/me[0],(e+o[1])/me[1],(a+o[2])/me[2]),0,1),l=r<Wt[2]?O(Wt[0],Wt[1],r)/3:1/3+2/3*O(Wt[2],Wt[3],r);return Math.max(l,1-O(Mt[0],Mt[1],n))}const or=(t,e,a,o,n,r,l)=>at(t,e,Ht(a)?1:0,531)<Nn(o,n,r,l),Bn=130,Dn=.22,nr=.45,ee=.55,Pn=.55,zn=(t,e)=>Math.min(e,V.x1-t);function ar(t,e,a){const o=O(0,Bn,zn(t,a));return T(1,o,O(Mt[0],Mt[1],Math.hypot(t,e)))}const sr=(t,e,a,o)=>o>=1||at(t,e,a,551)<T(Dn,1,o);function rr(t,e,a,o){if(o>=1)return t;const n=o<ee?gt(a,e,o/ee):gt(e,t,(o-ee)/(1-ee));return Pt(n,T(Pn,1,o))}const oe=.03,Xe=[3,4],ir=.5,Ze=[.5,1];function hr(t,e,a){const o=at(t,e,a,541);return o<oe?T(Xe[0],Xe[1],o/oe):T(Ze[0],Ze[1],((o-oe)/(1-oe))**2)}const ne=(t,e,a)=>Ht(a)&&t===0&&e===0;function kn(t){const e=[],a=D*t,o=Math.ceil(V.y0/j-1),n=Math.floor(V.y1/j+1);for(let r=o;r<=n;r++){const l=U(r,t);if(l<V.y0||l>V.y1)continue;const f=r&1;let i=Math.ceil(V.x0/12);for((i&1)!==f&&i++;12*i<=V.x1;i+=2){if(ne(i,r,t))continue;const c=12*i,u=nt(c,l,a),d=te(u);d!==Ct&&e.push({c:i,j:r,k:t,x:c,y:l,z:a,state:d,depth:u})}}return e}const ht={k:21,c:17,j:-1,pitch:dt/4},L=[12*ht.c,j*(ht.j+2/3),D*ht.k],ve=40,ae=80,Hn=50,Gn=70,ge=64,qn=4,Wn=12,Qe=-12,$n=Math.atan2(36,D),Lt=D*(ht.k-1.5),cr=D*(ht.k-1),Je=z[2]-ge-qn,Vn=Je-Lt,Kn=(()=>{const t=[],e=Hn,a=Gn,o=$n,n=Vn,r=n+a,l=Lt-a,f=L[1],i=(v,y)=>t.push([v,0,y]);for(let v=0;v<=4;v++)i(0,ve*v/4);const c=(v,y,b,w,A,E)=>{for(let _=1;_<=E;_++){const I=w+(A-w)*_/E;i(v+b*Math.cos(I),y+b*Math.sin(I))}};c(ae,ve,ae,Math.PI,Math.PI-o,8);const u=Math.sin(o),d=Math.cos(o),p=ae*(1-Math.cos(o)),h=ve+ae*Math.sin(o),x=r-e*(1-Math.cos(o)),s=(x-p)/u,m=h+s*d;for(let v=1;v<=6;v++)i(p+u*s*v/6,h+d*s*v/6);c(r-e,m+e*Math.sin(o),e,-o,0,6);const g=m+e*Math.sin(o);for(let v=1;v<=8;v++)i(r,g+(l-g)*v/8);c(r-a,l,a,0,Math.PI/2,11),c(n,Lt+n,n,-Math.PI/2,-Math.PI,14);for(let v=0;v<=4;v++)i(0,z[2]-ge*(1-v/4));let M=!1;for(const v of t){if(v[2]>=Lt-1e-6&&v[0]<=n+1e-6&&(M=!0),v[0]<1e-6){v[1]=0;continue}const y=Math.atan2(n-v[0],Lt+n-v[2])/(Math.PI/2);v[1]=M?(f+Qe)*(1-O(.1,1,q(y,0,1))):T((f+Wn)*O(h,g,v[2]),f+Qe,O(g,Lt,v[2]))}return t})(),X=t=>t-Math.floor(t);function Yn(t,e,a){const o=e-U(0,a),n=Math.sqrt(3)/2,r=Math.abs(X(o/j+.5)-.5),l=Math.abs(X((n*t-.5*o)/j+.5)-.5),f=Math.abs(X((n*t+.5*o)/j+.5)-.5);return Math.min(r,l,f)*j}function lr(t,e,a){let o=1/0;const n=Math.round(a/D);for(let r=n-1;r<=n+1;r++){if(!pe(r))continue;let l=Yn(t,e,r);if(r===Tt&&Math.hypot(t,e)<ue){l=1/0;for(let i=0;i<6;i++)l=Math.min(l,Math.hypot(t-ue*Math.cos(i*Math.PI/3),e-ue*Math.sin(i*Math.PI/3)))}const f=Math.hypot(l,a-D*r);f<o&&(o=f)}return o}function fr(t,e,a){let o=1/0;const n=Math.round(a/D);for(let r=n-1;r<=n+1;r++){if(!pe(r))continue;const l=Math.round((e-U(0,r))/j);for(let f=l-1;f<=l+1;f++){const i=Math.round(t/12);for(let c=i-2;c<=i+2;c++){if((c^f)&1||ne(c,f,r))continue;const u=Math.hypot(t-12*c,e-U(f,r),a-D*r);u<o&&(o=u)}}}return o}let St=null;const to=t=>{const e=[1/0,-1/0,1/0,-1/0,1/0,-1/0];for(let a=0;a<t.n;a++)for(let o=0;o<3;o++){const n=t.fine[a*3+o];n<e[2*o]&&(e[2*o]=n),n>e[2*o+1]&&(e[2*o+1]=n)}return t.box=e,t},we=(t,e,a,o,n)=>{const r=t.box;return e<r[0]-n||e>r[1]+n||a<r[2]-n||a>r[3]+n||o<r[4]-n||o>r[5]+n},dr=(t,e,a,o)=>we(Et(),t,e,a,o),eo=()=>{const t=mn(Kn),e=Math.floor(t.length/.25);return{path:t,fine:new Float32Array((e+1)*3),n:e+1}},oo=(t,e,a,o)=>{for(let n=e;n<a;n++)t.path.posAtDist(Math.min(t.path.length,n*.25),o),t.fine[n*3]=o.x,t.fine[n*3+1]=o.y,t.fine[n*3+2]=o.z};function Et(){if(St)return St;const t=eo();return oo(t,0,t.n,new R.Vector3),St=to(t)}async function ye(t){if(St)return St;const e=eo(),a=new R.Vector3;await t.yield();for(let o=0;o<e.n;o+=100)oo(e,o,Math.min(e.n,o+100),a),await t.yield();return St=to(e)}const jn=(t,e,a,o,n,r,l,f,i)=>{const c=l-o,u=f-n,d=i-r,p=c*c+u*u+d*d,h=p>0?q(((t-o)*c+(e-n)*u+(a-r)*d)/p,0,1):0,x=t-o-c*h,s=e-n-u*h,m=a-r-d*h;return Math.sqrt(x*x+s*s+m*m)};function bt(t,e,a,o,n,r,l=40){const f=Et(),i=f.fine,c=.5*Math.hypot(o-t,n-e,r-a),u=(t+o)/2,d=(e+n)/2,p=(a+r)/2;if(we(f,u,d,p,l+c))return l;let h=1/0;const x=l+c+4.5,s=x*x;for(let m=0;m<f.n;m+=16){const g=i[m*3]-u,M=i[m*3+1]-d,v=i[m*3+2]-p;if(!(g*g+M*M+v*v>s))for(let y=Math.max(0,m-8);y<Math.min(f.n,m+9);y++){const b=jn(i[y*3],i[y*3+1],i[y*3+2],t,e,a,o,n,r);b<h&&(h=b)}}return Math.min(h,l)}function $t(t,e,a,o=90){const n=Et(),r=n.fine;if(we(n,t,e,a,o))return o;let l=1/0;for(let d=0;d<n.n;d+=16){const p=r[d*3]-t,h=r[d*3+1]-e,x=r[d*3+2]-a,s=p*p+h*h+x*x;s<l&&(l=s)}const f=Math.sqrt(l);if(f>o+2.1)return o;let i=l;const c=(f+4.2)*(f+4.2);for(let d=0;d<n.n;d+=16){const p=r[d*3]-t,h=r[d*3+1]-e,x=r[d*3+2]-a;if(!(p*p+h*h+x*x>c))for(let s=Math.max(0,d-8);s<Math.min(n.n,d+9);s++){const m=r[s*3]-t,g=r[s*3+1]-e,M=r[s*3+2]-a,v=m*m+g*g+M*M;v<i&&(i=v)}}const u=Math.sqrt(i);return Math.min(u,o)}function at(t,e,a,o){let n=Math.imul(t+512,73856093)^Math.imul(e+512,19349663)^Math.imul(a+64,83492791)^Math.imul(o+1,2654435761);return n=Math.imul(n^n>>>15,2246822519),n=Math.imul(n^n>>>13,3266489917),((n^n>>>16)>>>0)/4294967296}const xt=[0,0,0,0],mt=2.5,_t=30,ct=2,Un=6,Ae=5,Xn=12,Zn=1.2,no=4,Qn=16,ao=6,so=1.2,Jn=90,ta=()=>Je,Me=(t,e,a)=>Math.hypot(t,e,a-q(a,ta(),z[2])),ea=(t,e,a)=>Me(t,e,a)<Jn,ro=20,oa=.75;function Ee(t,e,a,o,n=ro){if(ea(12*t,U(e,a),D*a))return xt;const r=(36+24*at(t,e,a,1))/o,l=Math.min(T(oa,.15,O(0,ro,n)),1-(mt+ct+3)/r);return[r,at(t,e,a,2),l,1-(ct+.2)/r]}function ur(t,e){if(!(t[0]>0))return{age:1e3,gone:-1,present:!0,coming:1,leaving:0,white:0};const a=X(e/t[0]+t[1]),o=(a-t[2])*t[0],n=(a-t[3])*t[0],r=q(1+o/mt,0,1),l=q(n/ct,0,1);return{age:o,gone:n,present:o>=0&&n<ct,coming:r,leaving:l,white:o>=0?1-O(Ae,Ae+no,o):1}}function pr(t,e){const a=[],o=new Map,n=[],r=[],{k0:l,shape:f,rate:i}=t,c=t.a??0,u=!!t.ribbon,d=t.panes>0,p=d?0:t.half,h=F=>$e[((c+F)%6+6)%6],x=h(0),s=x[0]*12/dt,m=x[1]*j/dt,g=(F,B,H)=>12*F*s+U(B,H)*m,M=e(),v=.6180339887,y=()=>{const F={T:T(t.period[0],t.period[1],e())/i,ph:X(M+r.length*v),members:[]};return r.push(F),F},b=(F,B,H,Z)=>{const rt=Jt(F,B,H);if(o.has(rt))return-1;const[lt,wt,st]=Gt(F,B,H);return xe(lt,wt,st)!==Ct||ne(F,B,H)?-1:(a.push({c:F,j:B,k:H,x:lt,y:wt,z:st,clock:xt,rank:Z,weight:W,pane:d?H-l:-1}),o.set(rt,a.length-1),a.length-1)},w=(F,B,H)=>{const Z=o.get(Jt(F,B,H));return Z===void 0?-1:Z},A=(F,B,H)=>n.push([F,B,H]),E=(F,B,H)=>{for(let Z=0;Z<80;Z++,F+=x[0],B+=x[1])if(xe(12*F,U(B,H),D*H)===Ct)return Z?[F,B]:null;return null},_=E(t.root[0],t.root[1],l);if(!_)return{sites:a,threads:n};const I=t.tip!==void 0?t.tip-g(_[0],_[1],l)+12:t.len,C=g(_[0],_[1],l)-12+I,P=q(I/132,.3,1.6),Y=d?F=>I*(1-(2/3)**F):t.taper??(F=>dt*F),W=q(P,.8,1.5);for(let F=l-p;F<=l+(d?t.panes-1:p);F++){if(!pe(F)||F<Ft)continue;const B=Math.abs(F-l),H=d?P*(2/3)**B:P,Z=d?0:B,rt=u&&!(d&&B>0),lt=d&&B>0||f==="sprig"?1:0,wt=rt?[t.root,[t.root[0]+h(5)[0],t.root[1]+h(5)[1]]]:[t.root],st=[];for(const et of wt){const ut=E(et[0],et[1],F),G=[];if(!ut){st.push(null);continue}const $=f==="sprig"?y():null;for(let ot=ut[0],S=ut[1],Q=0;g(ot,S,F)<=C-Y(B)+1e-6;ot+=x[0],S+=x[1],Q++){const it=b(ot,S,F,lt);if(it<0)break;A(it,Q?G[Q-1]:[ot-x[0],S-x[1],F],lt),G.push(it),$&&$.members.push({i:it,order:Q+1})}!$&&G.length>2&&y().members.push({i:G[G.length-2],order:1},{i:G[G.length-1],order:2}),st.push({line:G,standing:$?G.length:Math.max(0,G.length>2?G.length-2:G.length),live:$})}if(rt&&st[0]&&st[1])for(const et of st[0].line){const ut=a[et];for(const G of[5,4]){const $=ut.c+h(G)[0],ot=ut.j+h(G)[1],S=w($,ot,F);S>=0?A(et,S,0):xe(12*$,U(ot,F),D*F)!==Ct&&A(et,[$,ot,F],0)}}const pn=[[st[0],1],[rt?st[1]:st[0],5]];for(const[et,ut]of pn){if(!et)continue;const G=et.standing,$=[],ot=h(ut);for(let S=0;S<G;S++){const Q=G>1?S/(G-1):0,it=a[et.line[S]];let pt=f==="needles"?Math.round(T(6,2,Q)*H):f==="broad"?Math.max(2,Math.round(3*H)):f==="sprig"?e()<.7?1:0:Math.round(T(4,1.5,Q)*H)-(S&1?1+(e()<.35?1:0):0);f==="broad"&&S%3===2&&(pt=0),pt=Math.max(f==="mixed"?1:0,pt)-Z,f==="broad"&&S%3===1&&(pt=$[S-1]?$[S-1].length:0);const zt=f==="sprig"?et.live:f==="broad"&&S%3===1&&$[S-1]&&$[S-1].g?$[S-1].g:pt>0?y():null,ft=[];ft.g=zt;let yt=et.line[S];for(let It=1;It<=pt;It++){const kt=b(it.c+ot[0]*It,it.j+ot[1]*It,F,1);if(kt<0)break;A(kt,yt,1),zt.members.push({i:kt,order:f==="sprig"?10+It:2*It-(f==="broad"&&S%3===1?0:1)}),ft.push(kt),yt=kt}$.push(ft)}if(f==="mixed")for(const S of $)for(let Q=0;Q<S.length-1;Q++){const it=a[S[Q]],pt=e()<.4;let zt=S[Q];for(let ft=1;ft<=(pt?2:1);ft++){const yt=b(it.c+x[0]*ft,it.j+x[1]*ft,F,2);if(yt<0)break;A(yt,zt,2),S.g.members.push({i:yt,order:2*(Q+1)+.25*ft}),zt=yt}}}}for(const F of r){F.members.sort((rt,lt)=>rt.order-lt.order);const B=F.members.length,H=(mt+.3)/F.T,Z=1-(ct+.2)/F.T;F.members.forEach((rt,lt)=>{const wt=B>1?lt/(B-1):0;a[rt.i].clock=[F.T,F.ph,T(H,.6,wt),T(Z,Math.min(.9,Z),wt)]})}return{sites:a,threads:n}}const io=[15,20],na=40,Ot=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],se=(t,e,a,o)=>at(t*37+e,a,0,200+o),aa=t=>se(t,0,0,1)<.5?18:19,sa=(t,e)=>Math.max(0,Math.min(t-1,5,Math.ceil((e-t)/2.5)));function re(t,e=null){const a=[],o=new Map,n=[],r=[],l=e?e.pitch:ht.pitch,[f,i,c]=e?e.at:L,u=e?6*e.salt:0,d=t?T(io[0],io[1],t()):0,p=t?t():0,h=.6180339887,x=(y,b,w,A,E)=>{const _=(y+64)*256+(b+64);return o.has(_)?o.get(_):(a.push({a:y,b,x:f+l*(y+b/2),y:i+l*b*Math.sqrt(3)/2,z:c,rank:w,arm:A,clock:xt,grow:[E[0]+E[1]/2,E[1]*Math.sqrt(3)/2]}),o.set(_,a.length-1),a.length-1)},s=(y,b,w)=>n.push([y,b,w]),m=x(0,0,3,-1,[0,0]),g=[],M=[],v=[];for(let y=0;y<6;y++){const b=Ot[y],w=e?e.arm:aa(y),A=[m];for(let E=1;E<=w;E++){const _=x(b[0]*E,b[1]*E,E===1?3:0,y,b);s(_,A[E-1],E===1?3:0),A.push(_)}g.push(A[1]),M.push(A),r.push([A[w-1],A[w]]);for(const E of[1,5]){const _=Ot[(y+E)%6];for(let I=2;I<=w-2;I++){if(I&1){if(I>=3){const W=x(b[0]*I+_[0],b[1]*I+_[1],2,y,_);s(W,A[I],2)}continue}let C=sa(I,w);C>=3&&se(y+u,I,E,2)<.2&&C--;let P=A[I];const Y=[P];for(let W=1;W<=C;W++){const F=x(b[0]*I+_[0]*W,b[1]*I+_[1]*W,1,y,_);if(s(F,P,1),P=F,Y.push(F),W>=2&&se(y+u,I,W*8+E,3)<.85){const B=x(b[0]*(I+1)+_[0]*W,b[1]*(I+1)+_[1]*W,2,y,b);s(B,F,2)}}C>=3&&(r.push([P]),v.push(Y))}}}for(let y=0;y<6;y++)s(g[y],g[(y+1)%6],3);return d>0&&r.forEach((y,b)=>{const w=X(p+b*h),A=(mt+.3)/d,E=1-(ct+.2)/d;a[y[0]].clock=[d,w,A,E],y.length>1&&(a[y[1]].clock=[d,w,A+(mt+.5)/d,E-(ct+.2)/d])}),{sites:a,threads:n,tips:r,period:d,spines:M,ribs:v}}function xr(t,e,a,o,n){const r=[],l=[],f=ht.pitch,i=Ot[e],c=[-1],u=(h,x,s,m)=>{const g=t[0]+f*(h+x/2),M=t[1]+f*x*Math.sqrt(3)/2;return n(g,M,t[2])?(r.push({a:h,b:x,x:g,y:M,z:t[2],rank:s,arm:e,clock:xt,grow:[m[0]+m[1]/2,m[1]*Math.sqrt(3)/2]}),r.length-1):-1};let d=0;for(;d<4&&!n(t[0]+f*(d+i[0]+i[1]/2),t[1]+f*i[1]*Math.sqrt(3)/2,t[2]);)d++;for(let h=1;h<=a;h++){const x=u(d+i[0]*h,i[1]*h,0,i);if(x<0)break;h>1&&l.push([x,c[h-1],0]),c.push(x)}const p=c.length-1;for(const h of[1,5]){const x=Ot[(e+h)%6];for(let s=2;s<=p-1;s++){const m=s&1?1:Math.max(1,Math.min(s-1,Math.ceil((p-s)/2)));let g=c[s];for(let M=1;M<=m;M++){const v=u(d+i[0]*s+x[0]*M,i[1]*s+x[1]*M,s&1?2:1,x);if(v<0)break;l.push([v,g,s&1?2:1]),g=v}}}if(p>=3&&o){const[h,x]=o,s=(mt+.3)/h,m=1-(ct+.2)/h;r[c[p-1]].clock=[h,x,s,m],r[c[p]].clock=[h,x,s+(mt+.5)/h,m-(ct+.2)/h]}return{sites:r,threads:l,root:p>=1?[c[1],t]:null}}const be=[4,6],ho=30.5;function ra(t){const e=[],a=[],o=ht.pitch,[n,r,l]=L,f=(i,c,u,d,p)=>{const h=n+o*(i+c/2),x=r+o*c*Math.sqrt(3)/2;return bt(h,x,l,h,x,l,ho+2)<ho?-1:(e.push({a:i,b:c,x:h,y:x,z:l,rank:u,arm:d,clock:xt,grow:[p[0]+p[1]/2,p[1]*Math.sqrt(3)/2]}),e.length-1)};return t.spines.forEach((i,c)=>{const u=Ot[c],d=i.length-1,p=be[0]+Math.floor(se(c,0,0,7)*(be[1]-be[0]+.999));let h=f(u[0]*d,u[1]*d,0,c,u);for(let x=1;x<=p&&h>=0;x++){const s=x<=2?0:1,m=f(u[0]*(d+x),u[1]*(d+x),s,c,u);if(m<0)break;if(a.push([m,h,s]),h=m,!(x&1||x>=p))for(const g of[1,5]){const M=Ot[(c+g)%6],v=f(u[0]*(d+x)+M[0],u[1]*(d+x)+M[1],2,c,M);v>=0&&a.push([v,m,2])}}}),{sites:e,threads:a}}function _e(t,e,a,o,n=na){const r=o-L[2];if(Math.abs(r)>=n||Math.hypot(e-L[0],a-L[1])>20*ht.pitch+n)return n;let l=n*n;const f=r*r;for(const i of t.sites){const c=(i.x-e)*(i.x-e)+(i.y-a)*(i.y-a)+f;c<l&&(l=c)}return Math.sqrt(l)}const ia=`
const vec3 HOL_C = vec3(${k.x.toFixed(1)}, 0., ${k.z.toFixed(1)}), HOL_R = vec3(${k.ax.toFixed(1)}, ${k.ay.toFixed(1)}, ${k.az.toFixed(1)});
// THE HOLLOW as the shaders know it (the almond without its ripples). hollowLen: the length of the sight from p
// along the unit d that lies inside the hollow, as far as tmax (a closed form: the ray against half an ellipsoid).
// the bay: the length of the sight inside the second lobe (a whole ellipsoid)
const vec3 BAY_C = vec3(${J.x.toFixed(1)}, ${J.y.toFixed(1)}, ${J.z.toFixed(1)}), BAY_R = vec3(${J.ax.toFixed(1)}, ${J.ay.toFixed(1)}, ${J.az.toFixed(1)});
float bayLen(vec3 p, vec3 d, float tmax){
  vec3 q = (p - BAY_C) / BAY_R, e = d / BAY_R;
  float a = max(dot(e, e), 1e-9), b = dot(q, e), h = b * b - a * (dot(q, q) - 1.);
  if (h <= 0.) return 0.;
  h = sqrt(h);
  return max(0., min((-b + h) / a, tmax) - max((-b - h) / a, 0.));
}
// (round r11) THE COLD DEEP BEYOND THE CRYSTAL IS CLEAR AS THE HOLLOW IS: on the cold side the crystal ends at its own
// bound (x DEEP_X: no net stands further out), and the length of a sight that lies beyond that bound counts with the
// hollow's (a sight from the crystal to a thing out in the cold deep). No lamp stands there, so no lamp's light changes.
const float DEEP_X = ${Ve.toFixed(1)};
float deepLen(vec3 p, vec3 d, float tmax){ return d.x > 1e-5 ? clamp(tmax - max((DEEP_X - p.x) / d.x, 0.), 0., tmax) : (p.x > DEEP_X ? tmax : 0.); }
float almondLen(vec3 p, vec3 d, float tmax){
  vec3 q = (p - HOL_C) / HOL_R, e = d / HOL_R;
  float a = max(dot(e, e), 1e-9), b = dot(q, e), h = b * b - a * (dot(q, q) - 1.);
  if (h <= 0.) return bayLen(p, d, tmax);
  h = sqrt(h); float t0 = (-b - h) / a, t1 = (-b + h) / a;
  if (abs(d.x) > 1e-5) { float tp = (HOL_C.x - p.x) / d.x; if (d.x > 0.) t0 = max(t0, tp); else t1 = min(t1, tp); }
  else if (p.x < HOL_C.x) return bayLen(p, d, tmax);
  return max(0., min(t1, tmax) - max(t0, 0.)) + bayLen(p, d, tmax);
}
float hollowLen(vec3 p, vec3 d, float tmax){ return almondLen(p, d, tmax) + deepLen(p, d, tmax); }
// how far a place stands inside the crystal from the hollow's wall (the part's hollowDepth without its ripples)
float crystalDepth(vec3 p){
  vec3 q = (p - HOL_C) / HOL_R; float rho = max(length(q), 1e-4), g = max(length(q / HOL_R) / rho, 1e-6);
  return max(HOL_C.x - p.x, (rho - 1.) / g);
}
`,ha="#FFF1C8",ca=10,la=2,fa=t=>Tt-Math.floor((t-1)/la),Ie=[];function da(t){if(Ie[t])return Ie[t];const e=fa(t),a=D*e,o=[],n=[];if(Ht(e))for(let r=0;r<6;r++)o.push([z[0]+t*dt*Math.cos(r*Math.PI/3),z[1]+t*dt*Math.sin(r*Math.PI/3)]),n.push(t);else{const r=l=>{const f=(-90+60*l)*Math.PI/180;return[Math.cos(f),Math.sin(f),j*(t+(l&1?.6666666666666666:.3333333333333333))]};for(let l=0;l<6;l++){const[f,i,c]=r(l),[u,d,p]=r(l+1),h=f*d-u*i;o.push([z[0]+(c*d-p*i)/h,z[1]+(f*p-u*c)/h])}o.unshift(o.pop());for(let l=0;l<6;l++)n.push(l&1?t:t+1)}return Ie[t]={n:t,k:e,z:a,corners:o,sides:n}}function Re(t,e,a,o=200){let n=o;for(let r=1;r<=ca;r++){const l=da(r),f=a-l.z;if(!(Math.abs(f)>=n))for(let i=0;i<6;i++){const c=l.corners[i],u=l.corners[(i+1)%6],d=u[0]-c[0],p=u[1]-c[1],h=q(((t-c[0])*d+(e-c[1])*p)/(d*d+p*p),0,1),x=Math.hypot(c[0]+d*h-t,c[1]+p*h-e,f);x<n&&(n=x)}}return n}const co=[60,180],Nt=[70,200,430],ua=.45,Bt=`
uniform float uTime;
uniform vec3 uCold, uSpark, uWhiteGold;
const float FEATHER_M = ${ao.toFixed(1)}, BARB_M = ${so.toFixed(2)};
const float ARRIVE_S = ${mt.toFixed(2)}, ARRIVE_M = ${_t.toFixed(1)}, LEAVE_S = ${ct.toFixed(2)}, LEAVE_M = ${Un.toFixed(1)}, WHITE_S = ${Ae.toFixed(1)}, COOL_S = ${Xn.toFixed(1)}, TINT_S = ${no.toFixed(1)}, DRAW_S = ${Zn.toFixed(2)};
float hash3(vec3 q){ q = fract(q * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
// heat: every lamp shakes up to a quarter of a metre about its site, 3 to 5 beats a second, with a phase of its own
vec3 tremble(vec3 s){
  vec3 id = floor(s / vec3(12., 6.9282032, 20.) + .5);
  float a = hash3(id), b = hash3(id + 7.3), c = hash3(id + 19.1), w = 6.2832 * (3. + 2. * a);
  return vec3(.15 * sin(uTime * w + b * 6.2832), .15 * sin(uTime * w * 1.13 + c * 6.2832), .12 * sin(uTime * w * .87 + a * 40.));
}
${ia}
// THE HAZE OF AMBER DARK (round r4), ONE LAW FOR EVERY LAMP AND THREAD: the share of a light that reaches the eye
// over a sight of length d of which L lies in the hollow. Through crystal (c = d - L) it sinks as in fog: half at
// 150 m, a tenth at 320 m, nothing past 500 m. Through the hollow's clear dark gold thins by exp(-L / 600) (round r6:
// clear dark dims less than amber crystal, so the hollow's far wall stands as ranks of dim gold across it; it was 260)
// and the frost's cold light by exp(-L / 700) (the hollow is clear, not haze: frost is seen across it). A thread is
// seen only as part of its net: none further than 240 m from the eye (threads are built to 240 m from the line).
float hazeAll(float c){ float q = clamp(c / 190., 0., 4.); return exp(-q * sqrt(q)) * (1. - smoothstep(380., 500., c)); }
float hazeGold(float d, float L){ return hazeAll(max(d - L, 0.)) * exp(-L / 600.); }
float hazeThread(float d, float L){ return hazeGold(d, L) * (1. - smoothstep(170., 240., d)); }
float hazeCold(float d, float L){ return hazeAll(max(d - L, 0.)) * exp(-L / 700.); }
// DISTANCE READS ON THE COLD SIDE (round r9): a gold lamp or thread that stands on the cold side (by its own place: none of
// it at x COLD_X[0], wholly from x COLD_X[1]) COOLS with the length of the sight to it, gold near, rose gold from
// COOL_M[0] to COOL_M[1] metres, violet grey by COOL_M[2], and a lamp there SHRINKS to 1 - COOL_SHRINK of its size by
// COOL_M[2]: the far rows on that side sink into the cold deep. A part of the haze (a law of the sight's length).
// Frost keeps its own cold light.
const vec3 ROSE_GOLD = vec3(1., .56, .46), VIOLET_GREY = vec3(.5, .46, .86);
float coldSide(float x){ return smoothstep(${co[0].toFixed(1)}, ${co[1].toFixed(1)}, x); }
vec3 coolFar(vec3 col, float cs, float d){
  float lum = max(col.r, max(col.g, col.b));
  col = mix(col, ROSE_GOLD * lum, cs * smoothstep(${Nt[0].toFixed(1)}, ${Nt[1].toFixed(1)}, d));
  return mix(col, VIOLET_GREY * lum, cs * smoothstep(${Nt[1].toFixed(1)}, ${Nt[2].toFixed(1)}, d));
}
float coolShrink(float cs, float d){ return 1. - ${ua.toFixed(2)} * cs * smoothstep(${Nt[0].toFixed(1)}, ${Nt[2].toFixed(1)}, d); }
const vec3 ICE = vec3(${(156/255)**2.2}, ${(196/255)**2.2}, 1.);
const float ICE_S = ${Qn.toFixed(1)};
// THE SPARK'S LIGHT on what stands round it: within 110 m it TINTS toward white gold and lifts nothing; within
// 60 m the surround DEEPENS to dark gold, so that the ring is the one bright thing there. keep: the share left be.
// THE DEEPENING REACHES THE ROWS ABOVE AND BELOW THE RANK AS IT REACHES THE RANK'S OWN ROWS (round r7): its measure
// counts how far a place stands off the rank's line only out to the rank's own rows (RANK_ROW metres) and again from
// the next rows on (twice that), so a lamp of the row above or below deepens as the rank's lamp of its sheet does.
const float RANK_ROW = ${(2*j/3).toFixed(3)};
vec3 sparkLaw(vec3 col, vec3 p, float keep){
  vec3 v = p - uSpark; float d2 = dot(v, v), lum = max(col.r, max(col.g, col.b)), off = length(v.xy);
  float dq = length(vec2(v.z, min(off, RANK_ROW) + max(off - 2. * RANK_ROW, 0.)));
  float w = clamp(1311. / (d2 + 1014.), 0., 1.) * (1. - smoothstep(10000., 15625., d2)), deep = (1. - smoothstep(18., 60., dq)) * (1. - keep);
  col = mix(col, uWhiteGold * lum, .8 * w);
  return mix(col, vec3(1., .45, .05) * lum, deep) * (1. - .62 * deep);
}
// a clock is (period, phase, birth share, let-go share). x: seconds since the site locked on (negative while it
// is still coming), y: seconds since it let go (negative before). A period of nothing stands for ever.
vec2 clockAges(vec4 k){ if (k.x <= 0.) return vec2(1000., -1.); float c = fract(uTime / k.x + k.y); return vec2((c - k.z) * k.x, (c - k.w) * k.x); }
`,lo=`
uniform vec4 uFault, uFaultB;    // the sheet's z, the row's y, the kink's x now, its direction along x (0: no fault)
uniform vec4 uFaultX;            // the two rows' own ends along x: nothing beyond them slides
uniform vec3 uWavePh;
float waves(vec3 p){
  return .16 * sin(6.2832 * (p.z + 22. * uTime) / 160. + uWavePh.x) + .11 * sin(6.2832 * (p.x - 15. * uTime) / 240. + uWavePh.y) + .08 * sin(6.2832 * (.5 * p.x + .866 * p.y - 6. * uTime) / 90. + uWavePh.z);
}
// x: how far a lamp of the faulted row has slid toward its neighbour's place (0 to 1), y: the ripple's lift at this site
vec2 faultOf(vec3 s, vec4 F, vec2 ends){
  if (F.w == 0. || abs(s.z - F.x) > 1.) return vec2(0.);
  float tau = (F.z - s.x) * F.w / 120., dy = abs(s.y - F.y);
  float slide = dy < 1. && s.x > ends.x - 1. && s.x < ends.y + 1. ? smoothstep(0., .5, tau) : 0.;
  // the ripple spreads at 90 m a second from the kink's own track (the row between its two ends, 10 m beyond each):
  // a lamp beside the track is reached from the point of the track nearest to it, never from beyond the row's ends
  float xc = clamp(s.x, ends.x - 10., ends.y + 10.), tauR = (F.z - xc) * F.w / 120., dist = length(vec2(s.x - xc, dy));
  float q = (dist - 90. * tauR) / 14.;
  return vec2(slide, exp(-q * q) * step(0., tauR) * (1. - smoothstep(100., 150., dist)));
}
vec2 fault(vec3 s){ return faultOf(s, uFault, uFaultX.xy); }
vec2 fault2(vec3 s){ return faultOf(s, uFaultB, uFaultX.zw); }
`,fo=`
attribute vec4 aSite;    // the site; w: 0 a common lamp, 1 the far end of its row, 2 the near end (finished crystal); 3 a frost stem's lamp (growth)
attribute vec4 aCol;     // the cooled colour times its strength; w: how much of the crystal's waves it takes (growth: the share of the cold white it wears when young, less on a fern's older panes)
attribute vec4 aAux;     // its size in common lamps; its skirt's share (a third within 14 m of the route's line, a half at 30 m); (a figure nothing reads); the share of it the spark's law leaves be
attribute float aNear;   // how near the route's line it stands (1 within 30 m, nothing from 90 m): its white hot centre
#ifdef GROWTH
attribute vec4 aClock; attribute vec3 aDir;
#endif
varying vec2 vP; varying vec3 vCol; varying vec2 vR; varying vec2 vN;
${Bt}${lo}
void main(){
  vec3 site = aSite.xyz, pos = site + tremble(site), col = aCol.rgb;
  float core = .35 * min(aAux.x, 2.), skirt = 2.2 * aAux.x, cold = 0., show = 1.;
#ifdef GROWTH
  vec2 ag = clockAges(aClock);
  float fl;
  if (ag.x < 0.) {
    // coming in from the dark: a small cold point that slows into its place
    float p = clamp(1. + ag.x / ARRIVE_S, 0., 1.), q = 1. - p;
    show = step(-ARRIVE_S, ag.x);
    pos = site + aDir * (ARRIVE_M * q * q) + tremble(site) * p;
    col = uCold * ((.5 + 2.7 * p * p) * aCol.w); core = mix(.14, core, p * p); skirt = mix(.7, skirt, p * p);
    fl = smoothstep(-.1, 0., ag.x); cold = 1.;
  } else {
    // locked on: frost white, then cooling to its own colour; at its period's end it dims and drifts off
    // (the cold light carries further through the amber than what has cooled: a frost stem's lamp is cold for good)
    cold = max(1. - smoothstep(ICE_S, ICE_S + TINT_S, ag.x), step(2.5, aSite.w));
    // white when new, ice blue for a while, then its own colour
    col = mix(col, ICE * (2.6 * aCol.w), 1. - smoothstep(ICE_S, ICE_S + TINT_S, ag.x));
    col = mix(col, uCold * (3.2 * aCol.w), 1. - smoothstep(WHITE_S, WHITE_S + TINT_S, ag.x));
    fl = exp(-ag.x * 8.5);
    float l = clamp(ag.y / LEAVE_S, 0., 1.);
    col *= (1. - l) * (1. - l); pos += aDir * (LEAVE_M * l * l); show = step(ag.y, LEAVE_S);
  }
  // the lock-on flash: at most one and a half times its lamp (by place, not beside the way: aAux.y), not hotter than 6
  float big = .5 * fl * clamp(1.5 * aAux.y - .5, 0., 1.);
  col += uCold * (2.8 * fl * aCol.w); core *= 1. + big; skirt *= 1. + big;
#else
  vec2 f = fault(site) , f2 = fault2(site);
  pos.x += 24. * (f.x + f2.x);
  col *= 1. + waves(site) * aCol.w + .35 * max(f.y, f2.y);
  if (aSite.w > .5) col *= aSite.w < 1.5 ? max(f.x, f2.x) : 1. - max(f.x, f2.x);
#endif
  col = sparkLaw(col, pos, aAux.w);
  vec4 mv = modelViewMatrix * vec4(pos, 1.);
  vec3 toP = pos - cameraPosition; float d = length(toP), L = hollowLen(cameraPosition, toP / max(d, 1e-3), d);
  float hz = mix(hazeGold(d, L), hazeCold(d, L), cold);
  // every lamp keeps its size in metres at every distance; far gold sinks into the haze and goes to ember
  float coreD = core, skirtD = max(skirt, coreD * 6.3);
  // (on the cold side a gold lamp cools and shrinks with the sight's length; elsewhere far gold goes to ember as before)
  float cs = coldSide(pos.x) * (1. - cold), far = smoothstep(120., 380., d - L) * (1. - cold) * (1. - cs), shrink = coolShrink(cs, d);
  coreD *= shrink; skirtD *= shrink;
  col = coolFar(col, cs, d) * vec3(1., 1. - .2 * far, 1. - .45 * far) * hz;
  show *= step(.0015, max(col.r, max(col.g, col.b)));
  mv.xy += position.xy * (skirtD * show);
  gl_Position = projectionMatrix * mv;
  vP = position.xy * skirtD; vCol = col; vR = vec2(coreD, skirtD); vN = vec2(aNear, aAux.y);
}`,uo=`
varying vec2 vP; varying vec3 vCol; varying vec2 vR; varying vec2 vN;
uniform float uSkirt, uBody;
void main(){
  // a lamp: a core with a centre a quarter of it wide that is white hot beside the way (vN.x, by place), a soft body about it, a skirt out to 2.2 m
  float r2 = dot(vP, vP), core = max(vR.x, 1e-3), skirt = max(vR.y, 1e-3), q = r2 / (core * core);
  float c = exp(-1.4 * q), h = exp(-18. * q), b = exp(-q / 7.);
  float s = clamp(1. - sqrt(r2) / skirt, 0., 1.); b *= smoothstep(0., .35, s); s = s * s * s;
  float lum = max(vCol.r, max(vCol.g, vCol.b));
  gl_FragColor = vec4(vCol * (c + (uBody * b + uSkirt * s) * vN.y) + vec3(1., .97, .92) * (h * lum * (.2 + .9 * vN.x)), 1.);
}`,po=[.8,.97],pa=.45,xo=`
attribute vec4 aA, aB;   // the two sites it joins; aA.w: its feather's cap in metres (growth) or 1 on the last thread of a standing row; aB.w: its width in common threads
attribute vec4 aCol;     // its cooled colour times its strength; w: the share of its feather it keeps for good (the frost of a stem braid)
attribute vec4 aAux;     // the share of its light its feather gives up (the snow crystal's fine barbs; nothing elsewhere); its vane (none within 7 m of the line); the share of it the spark's law leaves be; how near the line it stands (1 within 30 m, nothing from 90 m)
#ifdef GROWTH
attribute vec4 aClkA, aClkB;
attribute float aDim;    // the share of the cold white it wears when young (less on a fern's older panes)
#endif
varying vec4 vT;   // metres along from the older end, across (half widths, or metres on the feather), the length, the drawn length
varying vec4 vC;   // colour; w: 0 the line, 1 the feather
varying float vL;  // on the feather: its length now; on the line: 1 (a thread is drawn at its own width in metres at every distance)
varying float vH;  // a whole number of the thread's own, so no two feathers are alike (rounded again where it is read: a varying comes back a hair off)
varying vec2 vX;   // how near the route's line it stands (1 within 30 m, nothing from 90 m); its vane's share
varying float vE;  // 1 on frost that keeps its whole feather for good (a thread of the snow crystal): its barbs do not shorten toward the thread's two ends
${Bt}${lo}
void main(){
  vec3 A = aA.xyz, B = aB.xyz, col = aCol.rgb;
  float bright = 1., front = 2., feather = 0., cold = 0.;
#ifdef GROWTH
  // as old as its younger end; it draws itself from the older end to the younger, and goes when either end lets go
  vec2 a = clockAges(aClkA), b = clockAges(aClkB);
  float age = min(a.x, b.x), l = clamp(max(a.y, b.y) / LEAVE_S, 0., 1.);
  if (b.x > a.x) { vec3 t = A; A = B; B = t; }
  front = age < DRAW_S ? clamp(age / DRAW_S, 0., 1.) : 2.;
  bright = step(0., age) * (1. - l) * (1. - l);
  cold = max(1. - smoothstep(ICE_S, ICE_S + TINT_S, age), step(.01, aCol.w));
  col = mix(col, ICE * (1.1 * aDim), 1. - smoothstep(ICE_S, ICE_S + TINT_S, age));
  col = mix(col, uCold * (1.5 * aDim), 1. - smoothstep(WHITE_S, WHITE_S + TINT_S, age));
  feather = min(aA.w, FEATHER_M * max(1. - clamp(age / (WHITE_S + COOL_S), 0., 1.), aCol.w)) * step(.001, bright);
  A += tremble(A); B += tremble(B);
#else
  // a fault: a thread of the faulted row slides with its two lamps; a thread that crosses the row dims out and relights
  vec2 fa = max(fault(A), fault2(A)), fb = max(fault(B), fault2(B));
  bright = 1. + .35 * max(fa.y, fb.y);
  float over = abs(fa.x - fb.x) * step(.5, abs(A.y - B.y));
  bright *= 1. - smoothstep(0., .15, over) * (1. - smoothstep(.85, 1., over));
  if (abs(A.y - B.y) < .5) { A.x += 24. * fa.x; B.x += 24. * fb.x; bright *= 1. - aA.w * max(fa.x, fb.x); }
  A += tremble(aA.xyz); B += tremble(aB.xyz);
#endif
  vec3 ax = B - A; float len = length(ax); ax /= max(len, 1e-4);
  vec3 P = A + ax * (len * position.x);
  vec4 mv = modelViewMatrix * vec4(P, 1.);
  vec3 toP = P - cameraPosition; float d = length(toP), L = hollowLen(cameraPosition, toP / max(d, 1e-3), d);
  float hz = mix(hazeThread(d, L), hazeCold(d, L), cold);
  col = coolFar(sparkLaw(col, P, aAux.z), coldSide(P.x) * (1. - cold), d);
  float gain = bright * hz;
  // (round r11) NO WHITE BAR: A THREAD OF FROST SEEN ALONG ITSELF. Where the sight runs along a thread its barbs lie
  // one behind another and their light would add up to one bright streak: a feather gives up its light as the sight
  // comes within 37 degrees of its own thread (all of it by 14 degrees), and the line of frost that keeps its feather
  // for good (the snow crystal, a wall fern) goes down to END_ON of its light there. The gold net's threads keep theirs.
  float endOn = smoothstep(${po[0].toFixed(2)}, ${po[1].toFixed(2)}, abs(dot(ax, toP)) / max(d, 1e-3));
  if (position.z < .5) {
    vec3 side = cross(ax, cameraPosition - P); float sl = length(side); side = sl > 1e-5 ? side / sl : vec3(0., 1., 0.);
    float hw0 = .08 * aB.w, hw = hw0;
    // frost that keeps its feather for good (the snow crystal, a wall fern) is a flat figure in its sheet: seen along the
    // sheet (within 6 degrees of edge on) its threads too give up light, down to a quarter at 1 degree
    gain *= mix(1., mix(.25, 1., smoothstep(.02, .1, abs(toP.z) / max(d, 1e-3))), step(.99, aCol.w));
    gain *= mix(1., mix(1., ${pa.toFixed(2)}, endOn), step(.99, aCol.w));
    P += side * (position.y * hw * 2.5 * step(.002, gain));
    vT = vec4(position.x * len, position.y * 2.5, len, front * len); vL = hw0 / hw;
  } else {
    vec3 side = cross(ax, vec3(0., 0., 1.)); float sl = length(side); side = sl > 1e-5 ? side / sl : vec3(0., 1., 0.);
    float wide = feather * .9;
    // a feather is flat, in its sheet's plane: turned edge on to the eye it has no breadth, so it gives up its light
    // between 7 and 2 degrees from edge on and only its spine is left
    gain *= smoothstep(.03, .12, abs(toP.z) / max(d, 1e-3)) * (1. - aAux.x) * (1. - endOn);
    P += side * (position.y * wide * step(.02, feather) * step(.002, gain));
    vT = vec4(position.x * len, position.y * wide, len, front * len); vL = feather;
  }
  vE = step(.99, aCol.w);
  vC = vec4(col * gain, position.z); vH = floor(mod(aA.x * .25 + aA.y * 1.7 + aB.x * .5 + aB.y * 2.3, 50.));
  // the soft frost light between the barbs is given up sooner than the barbs as the feather turns from the eye (whole from 45 degrees, nothing under 17)
  vX = vec2(aAux.w, aAux.y * smoothstep(.3, .7, abs(toP.z) / max(d, 1e-3)));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.);
}`,mo=`
varying vec4 vT; varying vec4 vC; varying float vL, vH, vE; varying vec2 vX;
uniform float uLine, uBarb, uVane;
const float BARB_M = ${so.toFixed(2)};
void main(){
  float s = vT.x, len = max(vT.z, 1e-3), front = vT.w, k;
  if (vC.w < .5) {
    // the line: dim, brighter for the 2 m next to each node (beside the way brighter still: the six short rays of a
    // lamp by the route's line lie on its threads); while it draws itself, a bright head with the line behind it
    // across: a hot fine core in a faint sheath (vL is 1 on every line, so the mix below takes its second figure)
    // (beside the way the sheath goes, by place: a thread there is a fine line, never a soft bar)
    // (FROST THAT WEARS A FEATHER FOR GOOD HAS A QUARTER OF THE SHEATH, a rule of the thread's own light (round r7): its
    // feather is its soft light. Sheath on feather, thread beside thread, lay as a soft veil where the crystal's threads
    // stand close: between the spines at its centre.)
    float y2 = vT.y * vT.y, prof = mix(exp(-1.6 * y2), 1.3 * exp(-9. * y2) + .22 * (1. - .75 * vE) * (1. - .85 * vX.x) * exp(-1.2 * y2), smoothstep(.45, .9, vL));
    float node = 1. - smoothstep(.6, 2.4, min(s, len - s));
    float drawn = 1. - smoothstep(front - .4, front, s), q = (s - front) / .9;
    k = (mix(.5, .9 + 1.5 * vX.x, node) * drawn + 2.5 * exp(-q * q) * step(front, len)) * prof * uLine;
  } else {
    // the feather: barbs at 60 degrees, each of a length of its own, shorter toward the thread's two ends, a needle
    // that thins from 0.11 m at the spine to 0.03 m at its tip, brightest at the spine,
    // going out to nothing over its outer half; and on every barb small side barbs that run with the spine. Where a
    // screen's dot is wider than a barb the barb is drawn a dot wide and dimmer, and where a dot is a fifth of the
    // barbs' spacing wide (barbs that crowd toward their vanishing point, or stand far off) every barb has the mean length.
    float L = max(vL, 1e-3), t = abs(vT.y), run = min(front, len);
    float q = s - t * .57735, n = floor(q / BARB_M + .5), cell = q - n * BARB_M;
    float px = length(vec2(dFdx(q), dFdy(q))) * .866, py = length(vec2(dFdx(vT.y), dFdy(vT.y)));
    float own = mix(fract(sin((n + floor(vH + .5) + step(0., vT.y) * 31.) * 12.9898) * 43758.5453), .5, smoothstep(.05 * BARB_M, .2 * BARB_M, px));
    float reach = max(L * .866 * (.45 + .55 * own) * mix(mix(.35, 1., smoothstep(0., 7., min(q, run - q))), 1., vE), 1e-3);
    float e = clamp(t / reach, 0., 1.);
    float hb0 = mix(.055, .015, e), hb = max(hb0, .7 * px);
    float barb = (1. - smoothstep(.5 * hb, 1.5 * hb, abs(cell) * .866)) * (hb0 / hb) * (.5 + .5 * hb0 / .055);
    float tick = abs(fract(t / .45) - .5) * .45, hs = max(.02, .7 * py), far = .55 * (1. - e);
    float side = (1. - smoothstep(.5 * hs, 1.5 * hs, tick)) * (.02 / hs) * step(0., cell) * (1. - smoothstep(.4 * far, far + .01, cell)) * .7;
    float on = (1. - smoothstep(.55, 1., e)) * step(0., n) * step(n * BARB_M, run - .2) * smoothstep(.04, .16, t);
    // and between the barbs the vane's own faint body, so that a feather is a blade of frost and not a comb
    float ev = clamp(t / (reach * .725 / (.45 + .55 * own)), 0., 1.);
    float vane = uVane * vX.y * (1. - ev) * (1. - ev) * step(0., q) * (1. - smoothstep(run - .6, run, q)) * smoothstep(0., .5, L);
    k = (max(barb, side) * on * mix(1., .33, e)) * uBarb + vane;
  }
  gl_FragColor = vec4(vC.rgb * k, 1.);
}`,xa=[-Math.cos(Math.PI/6),-Math.sin(Math.PI/6),0],ma=[Math.cos(Math.PI/6),Math.sin(Math.PI/6),0],vo=.05,va=1.2,go=.5,ga=9,wa=.55,wo=`
attribute vec3 aN;    // the face's own normal
attribute vec4 aW;    // metres from the face's middle line; the face's breadth there; the share of the way from root to tip; the bar's own phase
varying vec3 vLight; varying vec4 vW; varying float vHz;
${Bt}
const vec3 GOLD_FROM = vec3(${xa.map(t=>t.toFixed(5)).join(", ")}), FROST_FROM = vec3(${ma.map(t=>t.toFixed(5)).join(", ")});
uniform vec3 uIceDark, uIceGold, uIceCold, uIceViolet, uIceTeal;
void main(){
  vec3 toP = position - cameraPosition; float d = length(toP);
  vHz = hazeCold(d, hollowLen(cameraPosition, toP / max(d, 1e-3), d));
  // a face is wholly warm (or wholly cold) once it is turned ICE_TURN of the way toward that side; a face square to both is dark ice
  vLight = (uIceDark + uIceGold * smoothstep(0., ${go.toFixed(2)}, dot(aN, GOLD_FROM)) + uIceCold * smoothstep(0., ${go.toFixed(2)}, dot(aN, FROST_FROM))) * vHz;
#ifdef BODY
  // a body of deep ice (round r10): a face leaning out of its sheet has the ice's own colour, violet toward the way
  // in (-Z) and teal toward the far end (+Z)
  vLight += (uIceViolet * smoothstep(.2, .9, -aN.z) + uIceTeal * smoothstep(.2, .9, aN.z)) * (${wa.toFixed(2)} * vHz);
#endif
  vW = aW;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`,yo=`
varying vec3 vLight; varying vec4 vW; varying float vHz;
uniform float uTime; uniform vec3 uIceEdge;
void main(){
  // metres to the face's nearer long border
  // (the line stands ICE_EDGE metres inside the border and the face's own light begins at the border from nothing, so no
  // face ends in a step of light; a face narrower than ICE_FULL metres has as much less light, line and all: where a
  // bar thins to its point its light thins with it, and a thin rib is a faint one)
  float e = max(.5 * vW.y - abs(vW.x), 0.), q = e / ${vo.toFixed(3)} - 1., rise = smoothstep(0., ${vo.toFixed(3)}, e) * clamp(vW.y / ${va.toFixed(2)}, 0., 1.);
  float edge = exp(-q * q) * rise;
  // the light that runs out along the bar: it comes in before the root and has gone beyond the tip before it comes again
  float g = (clamp(vW.z, 0., 1.) - (fract(uTime / ${ga.toFixed(1)} + vW.w) * 1.4 - .2)) / .07, run = exp(-g * g);
  gl_FragColor = vec4(vLight * (rise * (1. + .8 * run)) + uIceEdge * (edge * (1. + .8 * run) * vHz), 1.);
}`,ya=[-.94,-.2,-.28],Aa=[.94,.2,.28],Ao=.22,Ma=11,Ea=.22,ba=2.4,Mo=[.8,.98],_a=.3,Eo=[0,0,0],bo=[110,330],Ia=.7,Ra=.08,Fa=.4,Ta=.3,Ca=1.35,La=1/1.31,Sa=.25,Oa=.5,Na=[.2,.095,.03],Ba=[.085,.06,.23],Da=[.03,.15,.17],_o=`
attribute vec3 aN;    // the face's own normal (in the body's frame)
attribute vec3 aE;    // metres to each of the three borders of its triangle (a border that is not a true border of the face: far)
attribute vec4 aK;    // the share the running light reads; the body's phase; the face's strength; the line's strength
attribute vec3 aT;    // the ice's inner light (a body of deep ice)
varying vec3 vLight, vE, vBehind; varying vec4 vK; varying float vHz, vClear;
${Bt}
const vec3 BEHIND_WARM = vec3(${Na.join(", ")}), BEHIND_COLD = vec3(${Ba.join(", ")}), BEHIND_TEAL = vec3(${Da.join(", ")});
const vec3 NET_FROM = vec3(${ya.map(t=>t.toFixed(3)).join(", ")}), COLD_FROM = vec3(${Aa.map(t=>t.toFixed(3)).join(", ")});
uniform vec3 uIceDark, uIceGold, uIceCold;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  vec3 n = normalize(mat3(modelMatrix) * aN), toP = wp.xyz - cameraPosition; float d = length(toP);
  vHz = hazeCold(d, hollowLen(cameraPosition, toP / max(d, 1e-3), d));
#ifdef BODY
  float g = ${_a.toFixed(2)} * smoothstep(${Mo[0].toFixed(2)}, ${Mo[1].toFixed(2)}, dot(n, NET_FROM)), c = smoothstep(.35, .85, dot(n, COLD_FROM));
  vLight = ((uIceDark * 2.5 + aT) * mix(${Ea.toFixed(2)}, 1., clamp(.5 + ${ba.toFixed(2)} * n.y, 0., 1.)) + uIceGold * g + uIceCold * c) * (vHz * aK.z);
#else
  float g = smoothstep(.35, .85, dot(n, NET_FROM)), c = smoothstep(.35, .85, dot(n, COLD_FROM));
  vLight = (uIceDark * 2.5 + uIceGold * g + uIceCold * c) * (vHz * aK.z);
#endif
  // (round r11) a clear face: how squarely it is seen; the sight bent at it and the colour of the deep it runs to
  vec3 v = toP / max(d, 1e-3); float nv = dot(n, v); vec3 nn = nv < 0. ? n : -n, r = refract(v, nn, ${La.toFixed(4)});
  float slant = 1. - abs(nv); slant *= slant; vClear = mix(${Ra.toFixed(2)}, ${Fa.toFixed(2)}, slant * slant);
  // (the clear of a face is a thing of nearness: from FACE_FAR[0] metres of sight on a face fills again, to FACE_FILL of its light by FACE_FAR[1])
  float fill = ${Ia.toFixed(2)} * smoothstep(${bo[0].toFixed(1)}, ${bo[1].toFixed(1)}, d); vClear = mix(vClear, 1., fill);
  vec3 behind = mix(BEHIND_WARM, BEHIND_COLD, smoothstep(-.15, .75, r.x));
  behind = mix(behind, BEHIND_TEAL, smoothstep(.1, .7, r.x) * smoothstep(.05, -.35, r.y));
  vBehind = behind * (${Sa.toFixed(2)} * (1. - slant) * (1. - fill) * vHz * aK.z);
  vE = aE; vK = aK;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Io=`
varying vec3 vLight, vE, vBehind; varying vec4 vK; varying float vHz, vClear;
uniform float uTime; uniform vec3 uIceEdge;
void main(){
  float e = max(min(vE.x, min(vE.y, vE.z)), 0.), q = e / ${Ao.toFixed(3)} - 1., rise = smoothstep(0., ${Ao.toFixed(3)}, e);
  float g = (clamp(vK.x, 0., 1.) - (fract(uTime / ${Ma.toFixed(1)} + vK.y) * 1.5 - .25)) / .09, run = exp(-g * g);
  // (round r11) the face's own light is whole along its borders and falls to its clear share into the face; through
  // the clear of it the bent tint of what lies behind; a narrow glint runs with the running light
  float deep = exp(-e / ${Ta.toFixed(2)}), fill = rise * mix(vClear, 1., deep), glint = exp(-g * g * 9.);
  gl_FragColor = vec4(vLight * (fill * (1. + .7 * run)) + vBehind * (rise * (1. - deep)) + uIceEdge * ((${Ca.toFixed(2)} * exp(-q * q) * rise * vK.w * (1. + .7 * run) + ${Oa.toFixed(2)} * glint * fill * vK.z) * vHz), 1.);
}`;function Ro(t=1){const e=[],a=[],o=[],n=[],r=[],f=(i,c,u)=>{const d=u[0]-c[0],p=u[1]-c[1],h=u[2]-c[2],x=i[0]-c[0],s=i[1]-c[1],m=i[2]-c[2],g=p*m-h*s,M=h*x-d*m,v=d*s-p*x;return Math.hypot(g,M,v)/Math.max(Math.hypot(d,p,h),1e-6)/t};return{get triangles(){return e.length/9},tri(i,c,u,d,p,h,x,s,m=0,g=1,M=1,v=Eo){for(let A=0;A<3;A++)r.push(v[0],v[1],v[2]);const y=p[1]?f(i,c,u):1e3,b=p[2]?f(c,u,i):1e3,w=p[0]?f(u,i,c):1e3;e.push(i[0],i[1],i[2],c[0],c[1],c[2],u[0],u[1],u[2]);for(let A=0;A<3;A++)a.push(d[0],d[1],d[2]);o.push(p[0]?0:1e3,y,p[2]?0:1e3,p[0]?0:1e3,p[1]?0:1e3,b,w,p[1]?0:1e3,p[2]?0:1e3),n.push(h,m,g,M,x,m,g,M,s,m,g,M)},face(i,c,u,d=[],p=0,h=1,x=1,s=Eo){const m=i.length,[g,M,v]=i,y=(M[1]-g[1])*(v[2]-g[2])-(M[2]-g[2])*(v[1]-g[1]),b=(M[2]-g[2])*(v[0]-g[0])-(M[0]-g[0])*(v[2]-g[2]),w=(M[0]-g[0])*(v[1]-g[1])-(M[1]-g[1])*(v[0]-g[0]);y*c[0]+b*c[1]+w*c[2]<0&&(i=i.map((E,_)=>i[(m-_)%m]),u=u.map((E,_)=>u[(m-_)%m]),d=d.map(E=>m-1-E));const A=E=>d.includes(E);for(let E=1;E<m-1;E++)this.tri(i[0],i[E],i[E+1],c,[E===1&&!A(0),!A(E),E===m-2&&!A(m-1)],u[0],u[E],u[E+1],p,h,x,s)},mesh(i){const c=new R.BufferGeometry;c.setAttribute("position",new R.Float32BufferAttribute(e,3)),c.setAttribute("aN",new R.Float32BufferAttribute(a,3)),c.setAttribute("aE",new R.Float32BufferAttribute(o,3)),c.setAttribute("aK",new R.Float32BufferAttribute(n,4)),c.setAttribute("aT",new R.Float32BufferAttribute(r,3));const u=new R.Mesh(c,i);return u.frustumCulled=!1,u}}}const Fe=70,Pa=35,Fo=[250,400],To=[-3*dt,0,-D],za=160,Co=30,ka=20,Lo=8,Ha=.07;function ie(t,e,a,o){const n=e-t.at[0],r=a-t.at[1],l=o-t.at[2],f=n*t.axis[0]+r*t.axis[1]+l*t.axis[2],i=Math.sqrt(Math.max(n*n+r*r+l*l-f*f,0));return Math.hypot(Math.max(i-t.R,0),Math.max(Math.abs(f)-Ha*t.R,0))}function Te(t){const e=Et(),a=e.fine;let o=1/0;for(let n=0;n<e.n;n+=4)o=Math.min(o,ie(t,a[n*3],a[n*3+1],a[n*3+2]));return o}const Vt=(t,e=36)=>{const a=t.axis,o=Math.hypot(a[2],a[0])||1,n=[a[2]/o,0,-a[0]/o],r=[a[1]*n[2]-a[2]*n[1],a[2]*n[0]-a[0]*n[2],a[0]*n[1]-a[1]*n[0]],l=[];for(let f=0;f<e;f++)for(const i of[.5,1]){const c=Math.cos(f*2*Math.PI/e)*t.R*i,u=Math.sin(f*2*Math.PI/e)*t.R*i;l.push([t.at[0]+n[0]*c+r[0]*u,t.at[1]+n[1]*c+r[1]*u,t.at[2]+n[2]*c+r[2]*u])}return l};let Ce=null;function he(){if(Ce)return Ce;const t=Math.hypot(...To),e=To.map(h=>h/t),a=re(null),o=180/Math.PI,n=Et(),r=n.fine,l=L,f=[];let i=0,c=1/0;for(let h=0;h<n.n;h+=8){const x=Math.hypot(l[0]-r[h*3],l[1]-r[h*3+1],l[2]-r[h*3+2]);x<c&&(c=x,i=h)}for(let h=0;h<=i;h+=8)nt(r[h*3],r[h*3+1],r[h*3+2])<=0&&f.push([r[h*3],r[h*3+1],r[h*3+2],l[0]-r[h*3],l[1]-r[h*3+1],l[2]-r[h*3+2]]);const u=h=>{let x=1/0;for(const[s,m,g,M,v,y]of f){const b=q(((h[0]-s)*M+(h[1]-m)*v+(h[2]-g)*y)/(M*M+v*v+y*y),0,1),w=Math.hypot(s+M*b-h[0],m+v*b-h[1],g+y*b-h[2]);w<x&&(x=w)}return x};let d=0;for(let h=-2;h<=2;h++)Math.abs(U(h,Ft))<Math.abs(U(d,Ft))&&(d=h);let p=null;for(let h=Ft;h<Tt;h++){const x=U(d,h),s=D*h;let m=k.x-24,g=V.x1;for(;m<g&&nt(m,x,s)>=0;)m++;for(;g>m&&nt(g,x,s)>=0;)g--;if(g-m<2*Fe)continue;let M=Math.round((m+g)/24);(M^d)&1&&(M+=12*(M+1)-(m+g)/2<(m+g)/2-12*(M-1)?1:-1);const v=12*M,y=Math.hypot(v,x,s),b=Math.atan2(v,s)*o;if(y<Fo[0]||y>Fo[1]||p&&b>=p.bearing)continue;const w={at:[v,x,s],R:Fe,axis:e,k:h,bearing:b,ahead:y,share:(v-m)/(g-m)};if(w.line=Te(w),!(w.line<Pa)){w.wall=1/0,w.snow=1/0,w.sight=1/0;for(const A of Vt(w))w.wall=Math.min(w.wall,-nt(A[0],A[1],A[2])),w.snow=Math.min(w.snow,_e(a,A[0],A[1],A[2],200)),w.sight=Math.min(w.sight,u(A));w.wall>=ka&&w.snow>=Co&&w.sight>=Lo&&(p=w)}}return Ce=p}const Le={heart:.3,broad:.2,at:.5,end:.2,endAt:.8},Ga=3,qa=1.3;function Wa(t,e,a=0,o=Le,n=1){const r=(u,d,p)=>[u*Math.cos(d),u*Math.sin(d),p],l=u=>Math.hypot(u[0],u[1])/e,f=(u,d,p)=>{const h=d[0]-u[0],x=d[1]-u[1],s=d[2]-u[2],m=p[0]-u[0],g=p[1]-u[1],M=p[2]-u[2],v=[x*M-s*g,s*m-h*M,h*g-x*m],y=Math.hypot(v[0],v[1],v[2])||1;return v.map(b=>b/y)},i=o,c=u=>u<.5?gt(Dt,Ut,O(.12,.5,u)):gt(Ut,fe,O(.5,.8,u));for(const u of[1,-1]){const d=(h,x)=>{const s=h.map(g=>[g[0],g[1],g[2]*u]);let m=f(s[0],s[1],s[2]);m[2]*u<0&&(m=m.map(g=>-g)),t.face(s,m,s.map(l),[],a,n,qa,x)},p=(h,x,s,m,g,M,v,y)=>{const b=(w,A,E)=>{const _=r(w,m+A*Math.PI/3,E);return[_[0]+h,_[1]+x,_[2]]};d([0,1,2,3,4,5].map(w=>b(.5*s,w,g)),v);for(let w=0;w<6;w++)d([b(.5*s,w,g),b(s,w,M),b(s,w+1,M),b(.5*s,w+1,g)],y)};p(0,0,i.heart*e,0,.07*e,.012*e,Dt,c(.3));for(let h=0;h<6;h++){const x=h*Math.PI/3,s=Math.cos(x),m=Math.sin(x),g=(A,E,_)=>[s*A-m*E,m*A+s*E,_],M=.73*i.heart,v=i.endAt-.5*i.end,y=g(M*e,0,.05*e),b=i.broad,w=[[T(M,i.at,.07),.5*b],[T(M,i.at,.5),.85*b],[i.at,b],[T(i.at,v,.6),.8*b],[v,.42*b],[v,0]];for(const A of[1,-1])for(let E=0;E<w.length-1;E++){const _=E&1?.055:.006,I=E&1?.006:.055;d([y,g(w[E][0]*e,A*w[E][1]*e,_*e),g(w[E+1][0]*e,A*w[E+1][1]*e,I*e)],c((w[E][0]+w[E+1][0])/2))}p(s*i.endAt*e,m*i.endAt*e,i.end*e,x,.05*e,.008*e,ze,fe)}}}function mr(t,e=0,a=he(),o=Le,n=za){const r=Ro(Ga*a.R/Fe);Wa(r,a.R,e,o);const l=r.mesh(t),f=new R.Vector3(a.axis[0],a.axis[1],a.axis[2]).normalize(),i=new R.Quaternion().setFromUnitVectors(new R.Vector3(0,0,1),f),c=new R.Quaternion,u=new R.Vector3(0,0,1);l.position.set(a.at[0],a.at[1],a.at[2]),l.name="plate";const d=p=>{c.setFromAxisAngle(u,2*Math.PI*(p/n+e)),l.quaternion.copy(i).multiply(c)};return d(0),{mesh:l,update:d,triangles:r.triangles,axis:f,at:a.at,R:a.R,spec:a}}const vr=(t,e,a)=>ie(he(),t,e,a),$a=3,Se=[30,60],Oe=35,So=30,Oo=2,No=10,Bo=20,Va=70,Do=[70,130],Po=14,Ka=20,zo=[D*(ht.k+1),z[2]-D],vt=[8,3],Kt=[{heart:.16,broad:.1,at:.5,end:.26,endAt:.74},{heart:.24,broad:.3,at:.55,end:.12,endAt:.88},{heart:.5,broad:.14,at:.7,end:.14,endAt:.86}],ko=6;async function gr(t,e){const a=Et(),o=a.fine,n=re(null),r=he(),l=[];let f=0,i=1/0;for(let v=0;v<a.n;v+=4){const y=Math.hypot(L[0]-o[v*3],L[1]-o[v*3+1],L[2]-o[v*3+2]);y<i&&(i=y,f=v)}let c=a.n-1;for(;c>f&&z[2]-o[c*3+2]<ge;)c--;const u=[];for(let v=f;v<a.n;v+=8)u.push([o[v*3],o[v*3+1],o[v*3+2],z[0]-o[v*3],z[1]-o[v*3+1],z[2]-o[v*3+2]]);const d=v=>{let y=1/0;for(const[b,w,A,E,_,I]of u){const C=q(((v[0]-b)*E+(v[1]-w)*_+(v[2]-A)*I)/(E*E+_*_+I*I),0,1),P=Math.hypot(b+E*C-v[0],w+_*C-v[1],A+I*C-v[2]);P<y&&(y=P)}return y},p=(v,y,b)=>{let w=0,A=1/0;for(let E=0;E<a.n;E+=4){const _=Math.hypot(v-o[E*3],y-o[E*3+1],b-o[E*3+2]);_<A&&(A=_,w=E)}return[w,A]},h=[],x=Oe+So+Se[1]/2;for(let v=Ft;v<Tt;v++){const y=D*v;if(!(y<zo[0]||y>zo[1])){for(let b=-Oo-1;b<=Oo;b++)for(let w=Math.ceil(V.x0/12);w<=V.x1/12;w++){if((w^b)&1)continue;const[A,E]=Gt(w,b,v),[_,I]=$t(A,E,y,x+1)<x?p(A,E,y):[0,1/0];I<x&&_>f&&_<c&&h.push([A,E,y])}e&&await e.yield()}}const s=[o[f*3],o[f*3+1],o[f*3+2]],m=v=>{const y=[s[0]-v[0],s[1]-v[1],s[2]-v[2]],b=Math.hypot(...y);let w=null,A=-2;for(let E=1;E<=2;E++)for(let _=-vt[1];_<=vt[1];_++)for(let I=-vt[0];I<=vt[0];I++){if(I+_&1)continue;const C=[12*I,j*_,-D*E],P=Math.hypot(...C),Y=(C[0]*y[0]+C[1]*y[1]+C[2]*y[2])/(P*b);Y>A&&(A=Y,w=C.map(W=>W/P))}return w},g=[0,1,2].map(v=>[v,t()]).sort((v,y)=>v[1]-y[1]).map(v=>v[0]),M=h.length%37?37:41;for(let v=0;v<$a&&h.length;v++){const y=T(Se[0],Se[1],(g[v%3]+t())/3),b=t(),w=T(Do[0],Do[1],t()),A=Math.floor(t()*h.length);for(let E=0;E<h.length;E++){e&&E%ko===ko-1&&await e.yield();const _=h[(A+E*M)%h.length],I={at:_,R:y/2,axis:m(_),habit:Kt[v%Kt.length],phase:b,turn:w};if(!l.some(C=>Math.hypot(C.at[0]-_[0],C.at[1]-_[1],C.at[2]-_[2])<Va)&&!(Math.hypot(_[0],_[1])<Mt[0]+I.R+Po)&&(I.line=Te(I),!(I.line<Oe||I.line>Oe+So))){I.sight=1/0,I.snow=1/0;for(const C of Vt(I,18))I.sight=Math.min(I.sight,d(C)),I.snow=Math.min(I.snow,_e(n,C[0],C[1],C[2],200),r?ie(r,C[0],C[1],C[2]):200);if(!(I.sight<No||I.snow<Bo)){I.rose=Re(_[0],_[1],_[2]);for(const C of[...Vt(I,18),...Vt({...I,R:I.R/2},9)])I.rose=Math.min(I.rose,Re(C[0],C[1],C[2]));if(!(I.rose<Ka)){l.push(I);break}}}}}return l}const Ho=9,Ya=.17,ce=[-35,65],Go=3,Ne=2,qo=[120,60],ja=35,Ua=30,Xa=20,Wo=[120,220],Za={heart:.18,broad:.1,at:.45,end:.13,endAt:.87},$o=[Le,Kt[0],Kt[1],Za,Kt[2]];let Be=null;function wr(){if(Be)return Be;const t=Et(),e=t.fine,a=re(null),o=he(),n=k,r=.6180339887,l=[];let f=0,i=1/0;for(let s=0;s<t.n;s+=8){const m=Math.hypot(L[0]-e[s*3],L[1]-e[s*3+1],L[2]-e[s*3+2]);m<i&&(i=m,f=s)}const c=[],u=[];for(let s=0;s<t.n;s+=8){const m=[e[s*3],e[s*3+1],e[s*3+2]];s<=f&&nt(m[0],m[1],m[2])<=0&&c.push([...m,L[0]-m[0],L[1]-m[1],L[2]-m[2]]),s>=f&&u.push([...m,z[0]-m[0],z[1]-m[1],z[2]-m[2]])}const d=(s,m)=>{let g=1/0;for(const[M,v,y,b,w,A]of s){const E=q(((m[0]-M)*b+(m[1]-v)*w+(m[2]-y)*A)/(b*b+w*w+A*A),0,1),_=Math.hypot(M+b*E-m[0],v+w*E-m[1],y+A*E-m[2]);_<g&&(g=_)}return g},p=[n.x+n.ax/2,0,n.z],h=s=>{const m=[p[0]-s[0],p[1]-s[1],p[2]-s[2]],g=Math.hypot(...m);let M=null,v=-2;for(let y=-2;y<=2;y++)for(let b=-vt[1];b<=vt[1];b++)for(let w=-vt[0];w<=vt[0];w++){if(w+b&1||!w&&!b&&!y)continue;const A=[12*w,j*b,D*y],E=Math.hypot(...A),_=(A[0]*m[0]+A[1]*m[1]+A[2]*m[2])/(E*g);_>v&&(v=_,M=A.map(I=>I/E))}return M},x=s=>{const[m,g,M]=s.at,v=Math.hypot(m,g,M);if(Math.hypot(m,g)<Mt[0]+s.R+Po||l.some(A=>Math.hypot(A.at[0]-m,A.at[1]-g,A.at[2]-M)<A.R+s.R+Ua))return!1;const y=Math.acos(q((m*o.at[0]+g*o.at[1]+M*o.at[2])/(v*o.ahead),-1,1)),b=Math.asin(Math.min(1,s.R/v)),w=Math.asin(o.R/o.ahead);if(v-s.R<o.ahead+o.R&&y<b+w||m<Ve||(s.line=Te(s),s.line<ja))return!1;s.snow=1/0,s.sight=1/0,s.spark=1/0,s.rose=1/0,s.plate=1/0;for(const A of Vt(s,24))s.snow=Math.min(s.snow,_e(a,A[0],A[1],A[2],200)),s.plate=Math.min(s.plate,ie(o,A[0],A[1],A[2])),s.sight=Math.min(s.sight,d(c,A)),s.spark=Math.min(s.spark,d(u,A)),s.rose=Math.min(s.rose,Re(A[0],A[1],A[2]));return s.ahead=v,s.bearing=Math.atan2(m,M)*180/Math.PI,s.snow>=Co&&s.plate>=Bo&&s.sight>=Lo&&s.spark>=No&&s.rose>=Xa};for(let s=1;s<=Ho;s++){const m=1+s*Ya,g=Math.acos(1/m)*180/Math.PI,M=[Math.max(ce[0],-g),Math.min(ce[1],g)],v=T(M[0],M[1],X(s*r)),y=T(qo[0],qo[1],(s-1)/(Ho-1)),b=s*Ne%(2*Ne+1)-Ne;for(let w=0;w<2*Math.ceil((ce[1]-ce[0])/Go);w++){const A=(v+(w&1?1:-1)*Math.ceil(w/2)*Go)*Math.PI/180;if(A<M[0]*Math.PI/180-1e-6||A>M[1]*Math.PI/180+1e-6)continue;const E=Math.round((n.z+m*n.az*Math.sin(A))/D),_=Math.round(-(Ht(E)?0:2/3))+b;let I=Math.round((n.x+m*n.ax*Math.cos(A))/12);(I^_)&1&&I++;const C=Gt(I,_,E),P={n:s,at:C,R:y/2,axis:h(C),habit:$o[(s-1)%$o.length],phase:X(s*r*r),turn:T(Wo[0],Wo[1],X(s*r+.5)),shell:m,angle:A*180/Math.PI,walked:w};if(x(P)){l.push(P);break}}}return Be=l}const le=[k.z-k.az,k.z+k.az],Qa=24;let Yt=null;const De=4,jt=[],Ja=t=>{const e=Math.max(k.x+Es(t),Math.abs(t-J.z)<J.az?J.x+J.ax*Math.sqrt(1-((t-J.z)/J.az)**2):0);let a=0;for(const o of[-24,0,24]){let n=Math.min(V.x1,e+60);for(;n>60&&nt(n,o,t)>0;)n-=2;n>a&&(a=n)}return a},Vo=t=>{for(;jt.length<t;)jt.push(Ja(le[0]+De*jt.length))},Pe=()=>Math.floor((le[1]-le[0])/De)+1;async function yr(t){if(Yt)return Yt;for(let e=8;jt.length<Pe();e+=8)Vo(Math.min(e,Pe())),await t.yield();return ts()}function ts(){if(Yt)return Yt;const t=le[0],e=De,a=jt,o=[];Vo(Pe());const n=Math.round(Qa/e);for(let l=0;l<a.length;l++){let f=0,i=0;for(let c=Math.max(0,l-n);c<=Math.min(a.length-1,l+n);c++)f+=a[c],i++;o.push(f/i)}return Yt={farX:l=>{const f=q((l-t)/e,0,o.length-1),i=Math.min(o.length-2,Math.floor(f));return T(o[i],o[i+1],f-i)}}}const tt={n:30,z:[300,900],x:380,y:230,size:[150,300],light:.5,half:400,gone:820,violet:"#6B46E6",blue:"#3A6CF0"},es=`
attribute vec4 aAt;     // the cloud's middle; its radius
attribute vec4 aCol;    // its light (linear); the sight's length that halves it
attribute vec3 aBreath; // its rate (radians a second), its first phase; the sight's length at which it is gone
uniform float uTime;
varying vec2 vP; varying vec3 vCol;
void main(){
  vec4 mv = modelViewMatrix * vec4(aAt.xyz, 1.);
  float d = length(aAt.xyz - cameraPosition);
  vCol = aCol.rgb * exp(-.6931 * d / aCol.w) * (1. - smoothstep(.4 * aBreath.z, aBreath.z, d)) * (.85 + .15 * sin(uTime * aBreath.x + aBreath.y));
  mv.xy += position.xy * aAt.w; vP = position.xy;
  gl_Position = projectionMatrix * mv;
}`,os=`
varying vec2 vP; varying vec3 vCol;
void main(){ float q = max(1. - dot(vP, vP), 0.); gl_FragColor = vec4(vCol * (q * q * q), 1.); }`;function Ar(t){const e=[],a=[],o=[],n=(u,d)=>at(u,0,5,700+d),r=N(tt.violet,tt.light),l=N(tt.blue,tt.light);for(let u=0;u<tt.n;u++){const d=h=>(n(u,h)-.5)*2*Math.sqrt(n(u,h+1)),p=gt(r,l,n(u,16));e.push(z[0]+tt.x*d(10),z[1]+tt.y*d(12),z[2]+T(tt.z[0],tt.z[1],n(u,14)),T(tt.size[0],tt.size[1],n(u,15))),a.push(p[0],p[1],p[2],tt.half),o.push(.04+.06*n(u,17),6.283*n(u,18),tt.gone)}const f=ke();f.setAttribute("aAt",new R.InstancedBufferAttribute(new Float32Array(e),4)),f.setAttribute("aCol",new R.InstancedBufferAttribute(new Float32Array(a),4)),f.setAttribute("aBreath",new R.InstancedBufferAttribute(new Float32Array(o),3)),f.instanceCount=e.length/4;const i=new R.ShaderMaterial({transparent:!0,depthWrite:!1,depthTest:!0,blending:R.AdditiveBlending,uniforms:{uTime:t.uTime},vertexShader:es,fragmentShader:os}),c=new R.Mesh(f,i);return c.frustumCulled=!1,c.name="mist",{mesh:c,count:e.length/4}}function ns(t){const e={transparent:!0,depthWrite:!1,depthTest:!0,blending:R.AdditiveBlending,side:R.DoubleSide},a={...t,uSkirt:{value:.22},uBody:{value:.5}},o={...t,uLine:{value:1},uBarb:{value:.95},uVane:{value:.05}},n=(f,i,c,u,d={})=>new R.ShaderMaterial({...e,uniforms:c,vertexShader:f,fragmentShader:i,defines:u?{GROWTH:1}:{},...d}),r=f=>({value:new R.Vector3(f[0],f[1],f[2])}),l={...t,uIceDark:r(ss),uIceGold:r(rs),uIceCold:r(is),uIceEdge:r(hs),uIceViolet:r(Dt),uIceTeal:r(Ut)};return{lamp:n(fo,uo,a,!1),lampGrowth:n(fo,uo,a,!0),thread:n(xo,mo,o,!1),threadGrowth:n(xo,mo,o,!0),ice:n(wo,yo,l,!1),facet:n(_o,Io,l,!1),facetBody:n(_o,Io,l,!1,{defines:{BODY:1},side:R.FrontSide}),iceBody:n(wo,yo,l,!1,{defines:{BODY:1},side:R.FrontSide}),lampU:a,threadU:o,iceU:l}}function as(t){return{uTime:{value:0},uCold:{value:new R.Color(t||"#F2F8FF")},uSpark:{value:new R.Vector3(z[0],z[1],z[2])},uWhiteGold:{value:new R.Color(ha)},uFault:{value:new R.Vector4(0,0,0,0)},uFaultB:{value:new R.Vector4(0,0,0,0)},uFaultX:{value:new R.Vector4(0,0,0,0)},uWavePh:{value:new R.Vector3(0,0,0)}}}const N=(t,e=1)=>{const a=new R.Color(t);return[a.r*e,a.g*e,a.b*e]},ss=N("#5C8FE0",.08),rs=N("#F2A93B",.45),is=N("#9CC4FF",.42),hs=N("#EAF3FF",.2),Dt=N("#7A5CE0",.6),Ut=N("#2FB5B0",.62),fe=N("#8DB8FF",.5),ze=N("#DCEBFF",.42),Ko=N("#F2A93B",2.6),cs=N("#FFD98A",2.2),ls=N("#E8701E",2.5),fs=N("#B5260F",2.3),Mr=N("#DCEBFF",1.5),Er=N("#DCEBFF",.4),ds=N("#A8681C",1),us=N("#FFD98A",.62),ps=N("#A8481A",1),xs=N("#8A2210",.9),gt=(t,e,a)=>[T(t[0],e[0],a),T(t[1],e[1],a),T(t[2],e[2],a)],Pt=(t,e)=>[t[0]*e,t[1]*e,t[2]*e],Yo=(t,e,a,o,n)=>t<100?gt(e,a,O(0,40,t)):t<224?gt(a,o,O(144,224,t)):gt(o,n,O(224,304,t)),ms=t=>Yo(t,cs,Ko,ls,fs),vs=t=>Yo(t,us,ds,ps,xs);function gs(t,e,a,o=1,n=0){const r=$t(t,e,a,90),l=q((r-14)/16,0,1);return[o>1?T(1,o,l):o,r<30?T(1/3,1/2,l):T(1/2,1,q((r-30)/16,0,1)),O(30,40,r),n,1-O(30,90,r)]}function ws(t,e){const a=bt(t[0],t[1],t[2],e[0],e[1],e[2],45),o=O(7,10,a),n=a<45?a:$t((t[0]+e[0])/2,(t[1]+e[1])/2,(t[2]+e[2])/2,90);return{width:T(.5,1,o),light:T(.6,1,o),floor:O(30,40,a),vane:o,stout:O(10,20,a),near:1-O(30,90,n)}}const ke=()=>{const t=new R.InstancedBufferGeometry;return t.setAttribute("position",new R.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),t.setIndex([0,1,2,0,2,3]),t},jo=t=>{const e=new R.InstancedBufferGeometry,a=[0,-1,0,1,-1,0,1,1,0,0,1,0],o=[0,1,2,0,2,3];return t&&(a.push(0,-1,1,1,-1,1,1,1,1,0,1,1),o.push(4,5,6,4,6,7)),e.setAttribute("position",new R.Float32BufferAttribute(a,3)),e.setIndex(o),e},K=(t,e,a,o)=>t.setAttribute(e,new R.InstancedBufferAttribute(new Float32Array(a),o));function ys(t){const e=[],a=[],o=[],n=[],r=[],l=[];return{get count(){return e.length/4},add(f,i,c,u,d,p,h,x,s){e.push(f,i,c,u),a.push(d[0],d[1],d[2],p),o.push(s[0],s[1],s[2],s[3]),n.push(s[4]??0),t&&(r.push(h[0],h[1],h[2],h[3]),l.push(x[0],x[1],x[2]))},mesh(f){const i=ke();K(i,"aSite",e,4),K(i,"aCol",a,4),K(i,"aAux",o,4),K(i,"aNear",n,1),t&&(K(i,"aClock",r,4),K(i,"aDir",l,3)),i.instanceCount=e.length/4;const c=new R.Mesh(i,f);return c.frustumCulled=!1,c},async meshInSteps(f,i){const c=ke(),u=[["aSite",e,4],["aCol",a,4],["aAux",o,4],["aNear",n,1]];t&&u.push(["aClock",r,4],["aDir",l,3]);for(const[p,h,x]of u)K(c,p,h,x),await f.yield();c.instanceCount=e.length/4;const d=new R.Mesh(c,i);return d.frustumCulled=!1,d}}}function As(t){const e=[],a=[],o=[],n=[],r=[],l=[],f=[];return{get count(){return e.length/4},add(i,c,u,d,p,h,x,s,m,g=1){e.push(i[0],i[1],i[2],u),a.push(c[0],c[1],c[2],d),o.push(p[0],p[1],p[2],s),n.push(m[0],m[1],m[2],m[3]??0),t&&(r.push(h[0],h[1],h[2],h[3]),l.push(x[0],x[1],x[2],x[3]),f.push(g))},mesh(i){const c=jo(t);K(c,"aA",e,4),K(c,"aB",a,4),K(c,"aCol",o,4),K(c,"aAux",n,4),t&&(K(c,"aClkA",r,4),K(c,"aClkB",l,4),K(c,"aDim",f,1)),c.instanceCount=e.length/4;const u=new R.Mesh(c,i);return u.frustumCulled=!1,u},async meshInSteps(i,c){const u=jo(t),d=[["aA",e,4],["aB",a,4],["aCol",o,4],["aAux",n,4]];t&&d.push(["aClkA",r,4],["aClkB",l,4],["aDim",f,1]);for(const[h,x,s]of d)K(u,h,x,s),await i.yield();u.instanceCount=e.length/4;const p=new R.Mesh(u,c);return p.frustumCulled=!1,p}}}function Ms(t,e,a){const[o,n,r]=Gt(t,e,a);let l=null,f=-1;for(let i=0;i<6;i++){const c=.55+.45*at(t,e,a,10+3*i),u=1.3*(at(t,e,a,11+3*i)-.5),d=1.3*(at(t,e,a,12+3*i)-.5),p=Math.hypot(c,u,d),h=[c/p,u/p,d/p],x=bt(o,n,r,o+h[0]*_t,n+h[1]*_t,r+h[2]*_t,8);if(x>=3)return h;x>f&&(f=x,l=h)}return l}const Uo=(t,e)=>q(.45*(bt(t[0],t[1],t[2],e[0],e[1],e[2],17)-2.6),0,ao),Es=t=>k.ax*Math.sqrt(Math.max(0,1-((t-k.z)/k.az)**2)),br=t=>k.ay*Math.sqrt(Math.max(0,1-((t-k.z)/k.az)**2)),bs=(t,e,a,o)=>{const n=nt(12*t,U(e,a),D*a);return te(n)===qt?Ee(t,e,a,o,n):xt};function _r(t,e,a,o,n){const r=[],l=[],f=D*t;for(const i of n||kn(t)){if(i.state!==qt)continue;const c=Ee(i.c,i.j,t,e,i.depth),u={c:i.c,j:i.j,k:t,x:i.x,y:i.y,z:f,clock:c};a(i.c,i.j,t)&&r.push(u);for(const[d,p]of $e){const h=i.c+d,x=i.j+p,s=12*h,m=U(x,t);if(s<V.x0||s>V.x1||m<V.y0||m>V.y1||ne(h,x,t))continue;const g=nt(s,m,f),M=te(g);M!==Ct&&(M===qt&&Jt(h,x,t)<Jt(i.c,i.j,t)||o(i,{c:h,j:x,k:t})&&l.push([u,{c:h,j:x,k:t,x:s,y:m,z:f,clock:M===qt?Ee(h,x,t,e,g):xt},1]))}}return{sites:r,threads:l}}function Ir(t,e){const a=t.threads.map(([o,n,r])=>{if(typeof n=="number")return[t.sites[o],t.sites[n],r];const[l,f,i]=Gt(n[0],n[1],n[2]);return[t.sites[o],{c:n[0],j:n[1],k:n[2],x:l,y:f,z:i,clock:bs(n[0],n[1],n[2],e)},r]});return{sites:t.sites,threads:a}}const _s=[1.5,1,.72],Is=[2,1,.6],Rs=[1.6,1,.8],Xo=.8;function Rr(t,e,a,o){for(const n of a.sites){const r=n.rank??1,l=nt(n.x,n.y,n.z),f=n.weight??1,i=Pt(ms(l),l<0?r===0?1.2:.8:1);t.add(n.x,n.y,n.z,0,i,Xo,n.clock,n.clock[0]>0?Ms(n.c,n.j,n.k):[1,0,0],gs(n.x,n.y,n.z,_s[r]*f))}for(const[n,r,l]of a.threads){const f=l??1,i=[n.x,n.y,n.z],c=[r.x,r.y,r.z],u=nt((n.x+r.x)/2,(n.y+r.y)/2,n.z),d=ws(i,c),p=n.weight??1,h=Is[f]*p,x=T(.5,T(Math.min(1,h),h,d.stout),d.vane),s=T(.6,Rs[f]*(u<0?.85:.6),d.vane);e.add(i,c,Uo(i,c),x,Pt(vs(u),s),n.clock,r.clock,0,[0,d.vane,0,d.near],Xo)}}const Fs=[9,4.5,2.2,3],Ts=[4.2,3.2,2.2,1.6],de=[N("#DCEBFF",2.1),N("#C0DAFF",1.5),N("#9CC4FF",1.3),N("#EAF3FF",2)],Cs=N("#9CC4FF",1.2),Ls=.4,Zo=[2/3,.5],Qo=[.3,.4],He=[24,48],Ss=.25,Os=.6;function Jo(t,e,a,o=!1,n=1){const r=o==="great",l=p=>o?Math.min(2,p+1):p,f=(p,h)=>o&&!r?T(1/3,1,O(He[0],He[1],bt(p[0],p[1],p[2],h[0],h[1],h[2],He[1]+2))):1,i=(p,h,x,s=1,m=1)=>{const g=[p.x,p.y,p.z],M=[h.x,h.y,h.z];e.add(g,M,n<.5?0:Math.min(Ts[x]*n,Uo(g,M)),Fs[x]*Math.max(n,n<1?Ss:1)*s*f(g,M),o&&!r?Pt(de[x],.7):n<1?Pt(de[x],Os):m<1?Pt(de[x],m):de[x],p.clock,h.clock??xt,1,[Ls,.4,0,0],1)},c=new Map;for(const p of a.spines||[])p.forEach((h,x)=>c.set(h,x/(p.length-1)));const u=(p,h)=>h===0&&c.has(p)?T(1,Zo[1],O(Zo[0],1,c.get(p))):1,d=(p,h,x)=>!o&&n===1&&x===0&&!(a.sites[p].clock[0]>0)&&!(a.sites[h].clock[0]>0);for(const[p,h,x]of a.threads){const s=d(p,h,x);i(a.sites[p],a.sites[h],l(x),u(p,x)*(s?Qo[0]:1),s?Qo[1]:1)}a.root&&i(a.sites[a.root[0]],{x:a.root[1][0],y:a.root[1][1],z:a.root[1][2]},l(0));for(const p of a.sites){if(!(p.clock[0]>0))continue;const h=at(p.a,p.b,0,300)<.5?-.3:.3;let x=null,s=-1;for(const m of[h,-h,4*h,-4*h]){const g=Math.hypot(p.grow[0],p.grow[1],m),M=[p.grow[0]/g,p.grow[1]/g,m/g],v=bt(p.x,p.y,p.z,p.x+M[0]*_t,p.y+M[1]*_t,p.z+M[2]*_t,8);if(v>s&&(s=v,x=M),v>=3)break}t.add(p.x,p.y,p.z,3,Cs,1,p.clock,x,[.7,1,0,0,0])}}const Ns=2.4,tn=[.5,.9],Bs=.42,Ds=8;function Ps(){const t=[],e=[],a=[],o=[];return{get triangles(){return o.length/3},bar(n,r,l,f,i,c=1){const u=r[0]-n[0],d=r[1]-n[1],p=Math.hypot(u,d);if(p<.001)return;const h=u/p,x=d/p,s=-x,m=h,g=.5*l/Math.cos(Math.PI/6),M=v=>g*(1-v*v);for(let v=0;v<6;v++){const y=(v+.5)*Math.PI/3,b=y+Math.PI/3,w=y+Math.PI/6,A=[s*Math.cos(w),m*Math.cos(w),Math.sin(w)];for(let E=0;E<=f;E++){const _=E/f,I=M(_),C=n[0]+u*_,P=n[1]+d*_,Y=t.length/3;for(const[W,F]of[[y,-1],[b,1]])t.push(C+s*I*Math.cos(W),P+m*I*Math.cos(W),n[2]+I*Math.sin(W)),e.push(A[0],A[1],A[2]),a.push(F*.5*I/c,I/c,_,i);E<f&&o.push(Y,Y+1,Y+3,Y,Y+3,Y+2)}}},mesh(n){const r=new R.BufferGeometry;r.setAttribute("position",new R.Float32BufferAttribute(t,3)),r.setAttribute("aN",new R.Float32BufferAttribute(e,3)),r.setAttribute("aW",new R.Float32BufferAttribute(a,4)),r.setIndex(o);const l=new R.Mesh(r,n);return l.frustumCulled=!1,l}}}function zs(t,e,a=1){const o=c=>[e.sites[c].x,e.sites[c].y,e.sites[c].z],n=.6180339887,r=c=>{let u=0;for(;u+1<c.length&&!(e.sites[c[u+1]].clock[0]>0);)u++;return u};if(e.spines.forEach((c,u)=>{const d=r(c);d>1&&t.bar(o(c[1]),o(c[d]),Ns*a,a<1?4:Ds,X(u*n+(a<1?e.sites[0].x*.37:0)),a)}),a===1&&e.threads.forEach(([c,u,d],p)=>{d===2&&!(e.sites[c].clock[0]>0)&&!(e.sites[u].clock[0]>0)&&t.bar(o(u),o(c),Bs,2,X(.25+p*n))}),!e.ribs.length)return;const l=e.ribs.map(r),f=Math.min(...l),i=Math.max(...l);e.ribs.forEach((c,u)=>{const d=l[u];d>0&&t.bar(o(c[0]),o(c[d]),T(tn[0],tn[1],i>f?(d-f)/(i-f):1)*a,3,X(.5+u*n),a)})}const Ge=12,en=[4.4,.7],on=.3,Xt=[6.4,2.4,3.6],Zt=4,ks=.7,Hs=1.5;function Gs(t,e){const a=.6180339887,o=L[2],n=(l,f,i)=>{const c=f[0]-l[0],u=f[1]-l[1],d=f[2]-l[2],p=i[0]-l[0],h=i[1]-l[1],x=i[2]-l[2],s=[u*x-d*h,d*p-c*x,c*h-u*p],m=Math.hypot(s[0],s[1],s[2])||1;return s.map(g=>g/m)},r=l=>{let f=0;for(;f+1<l.length&&!(e.sites[l[f+1]].clock[0]>0);)f++;return f};for(const l of[1,-1]){const f=(d,p,h,x)=>{const s=d.map(g=>[g[0],g[1],o+g[2]*l]);let m=n(s[0],s[1],s[2]);m[2]*l<0&&(m=m.map(g=>-g)),t.face(s,m,p,[],h,ks,Hs,x)},i=(d,p,h,x,s,m,g,M,v,y=v)=>{const b=(w,A,E)=>[d+w*Math.cos(x+A*Math.PI/3),p+w*Math.sin(x+A*Math.PI/3),E];f([0,1,2,3,4,5].map(w=>b(.5*h,w,s)),[0,0,0,0,0,0].map(()=>g),M,v);for(let w=0;w<6;w++)f([b(.5*h,w,s),b(h,w,m),b(h,w+1,m),b(.5*h,w+1,s)],[g,g,g,g],M,w&1?y:v)};i(L[0],L[1],Ge/2,0,.08*Ge,.012*Ge,0,0,Dt,fe),e.spines.forEach((d,p)=>{const h=r(d);if(h<2)return;const x=e.sites[d[1]],s=e.sites[d[h]],m=Math.hypot(s.x-x.x,s.y-x.y),g=(s.x-x.x)/m,M=(s.y-x.y)/m,v=X(p*a),y=en[0]/2,b=en[1]/2;for(const w of[1,-1])f([[x.x,x.y,on*y],[x.x-M*y*w,x.y+g*y*w,0],[s.x-M*b*w,s.y+g*b*w,0],[s.x,s.y,on*b]],[0,0,1,1],v,w>0?Ut:Dt);i(s.x,s.y,Xt[0]/2,p*Math.PI/3,.08*Xt[0],.012*Xt[0],1,v,ze,Ut)});const c=e.ribs.map(r),u=Math.max(Zt,...c);e.ribs.forEach((d,p)=>{const h=c[p];if(h<Zt-1)return;const x=e.sites[d[h]],s=T(Xt[1],Xt[2],u>Zt-1?(h-Zt+1)/(u-Zt+1):1);i(x.x,x.y,s/2,Math.atan2(x.grow[1],x.grow[0]),.08*s,.012*s,1,X(.5+p*a),p&1?fe:ze,Dt)})}}const nn=20,an=[30,56],qs=22,Ws=64,$s=.012,Vs=.1,Ks=4,sn=N("#7A5CE0",1),rn=N("#2FB5B0",.55),Ys=`
attribute vec4 aAir;   // its distance from the crystal's axis; its angle about it at clock nought; its depth beyond the sheet; its radius
attribute vec3 aTurn;  // its colour's share (violet to teal); its breath's rate; its breath's first phase
varying vec2 vP; varying vec3 vC;
${Bt}
uniform vec3 uGlowViolet, uGlowTeal; uniform float uGlowLevel;
const vec3 AIR_C = vec3(${L[0].toFixed(2)}, ${L[1].toFixed(3)}, ${L[2].toFixed(1)});
void main(){
  float a = aAir.y + ${$s.toFixed(4)} * uTime;
  vec3 p = AIR_C + vec3(aAir.x * cos(a), aAir.x * sin(a), aAir.z);
  vec3 toP = p - cameraPosition; float d = length(toP);
  vC = mix(uGlowViolet, uGlowTeal, smoothstep(.35, .65, aTurn.x)) * (uGlowLevel * (.8 + .2 * sin(uTime * aTurn.y + aTurn.z)) * hazeCold(d, hollowLen(cameraPosition, toP / max(d, 1e-3), d)));
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  mv.xy += position.xy * aAir.w;
  gl_Position = projectionMatrix * mv; vP = position.xy;
}`,js=`
varying vec2 vP; varying vec3 vC;
void main(){
  float r2 = dot(vP, vP), g = max(1. - r2, 0.);
  gl_FragColor = vec4(vC * (exp(-2.6 * r2) * g * g), 1.);
}`,hn=t=>.2126*t[0]+.7152*t[1]+.0722*t[2];async function Fr(t,e,a){await ye(t);const o=[],n=[],r=24,l=[];for(let s=0;s<nn*4;s++)l.push([Ws*Math.pow(e(),.7),e()*Math.PI*2,qs*e(),T(an[0],an[1],e()),e(),e.range(.05,.12),e()*Math.PI*2]);for(const[s,m,g,M,v,y,b]of l){if(o.length>=nn*4)break;const w=Ks+M+(s+M)*(1-Math.cos(Math.PI/r));let A=!0;for(let E=0;E<r&&A;E++){const _=E/r*Math.PI*2,I=L[0]+s*Math.cos(_),C=L[1]+s*Math.sin(_),P=L[2]+g;A=$t(I,C,P,w+4)>=w&&Me(I,C,P)>=ln+w}A&&(o.push(s,m,g,M),n.push(v,y,b)),await t.yield()}const f=o.length/4,i=s=>{const m=O(.35,.65,s);return hn([0,1,2].map(g=>T(sn[g],rn[g],m)))};let c=1e-6;for(let s=0;s<f;s++){let m=0;for(let g=0;g<f;g++){const M=o[g*4]*Math.cos(o[g*4+1])-o[s*4]*Math.cos(o[s*4+1]),v=o[g*4]*Math.sin(o[g*4+1])-o[s*4]*Math.sin(o[s*4+1]),y=(M*M+v*v)/(o[g*4+3]*o[g*4+3]);y<1&&(m+=i(n[g*3])*Math.exp(-2.6*y)*(1-y)*(1-y))}c=Math.max(c,m)}const u=Vs*hn(Ko)/c,d=new R.InstancedBufferGeometry;d.setAttribute("position",new R.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),d.setIndex([0,1,2,0,2,3]),d.setAttribute("aAir",new R.InstancedBufferAttribute(new Float32Array(o),4)),d.setAttribute("aTurn",new R.InstancedBufferAttribute(new Float32Array(n),3)),d.instanceCount=f;const p=s=>({value:new R.Vector3(s[0],s[1],s[2])}),h=new R.ShaderMaterial({transparent:!0,depthWrite:!1,depthTest:!0,blending:R.AdditiveBlending,side:R.DoubleSide,uniforms:{...a,uGlowViolet:p(sn),uGlowTeal:p(rn),uGlowLevel:{value:u}},vertexShader:Ys,fragmentShader:js}),x=new R.Mesh(d,h);return x.frustumCulled=!1,x.name="frost glow",{mesh:x,count:f,level:u}}const Us=t=>xn(At("where-the-lattice-grows:snow:"+t)),Qt=60,Xs=22,Zs=380,cn=6,ln=6.9,fn=1.5,dn=[.006,.02],un=[.3,1.5],qe=N("#C4DCFF",1.2),Qs=`
attribute vec4 aAir;   // its distance from the crystal's axis; its angle about it at clock nought; its depth from the sheet; half its breadth
attribute vec3 aTurn;  // its turning in radians a second; its twinkle's rate; its phase
varying vec2 vP; varying float vK;
${Bt}
const vec3 AIR_C = vec3(${L[0].toFixed(2)}, ${L[1].toFixed(3)}, ${L[2].toFixed(1)});
void main(){
  float a = aAir.y + aTurn.x * uTime;
  vec3 off = vec3(aAir.x * cos(a), aAir.x * sin(a), aAir.z + ${fn.toFixed(1)} * sin(uTime * .19 + aTurn.z)), p = AIR_C + off;
  float fade = (1. - smoothstep(${Xs.toFixed(1)}, ${Qt.toFixed(1)}, length(off))) * (.55 + .45 * sin(uTime * aTurn.y + aTurn.z * 7.));
  vec3 toP = p - cameraPosition; float d = length(toP);
  vK = fade * hazeCold(d, hollowLen(cameraPosition, toP / max(d, 1e-3), d));
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  mv.xy += position.xy * aAir.w;
  gl_Position = projectionMatrix * mv; vP = position.xy;
}`,Js=`
uniform vec3 uAir; varying vec2 vP; varying float vK;
void main(){
  // a small bright grain in a soft round skirt that is nothing at the mote's rim
  float r2 = dot(vP, vP), g = max(1. - r2, 0.);
  gl_FragColor = vec4(uAir * (vK * (exp(-5. * r2) + .35 * g * g)), 1.);
}`;async function Tr(t,e,a,o=Zs){await ye(t);const n=[],r=[],l=24,f=Qt*(1-Math.cos(Math.PI/l));for(let d=0;d<o*4&&n.length<o*4;d++){const p=Qt*Math.pow(e(),.75),h=e()*Math.PI*2,x=e()<.5?-1:1,s=e(),m=x*Math.sqrt(Math.max(Qt*Qt-p*p,0))*s*s*s,g=T(un[0],un[1],Math.pow(e(),2)),M=e.range(dn[0],dn[1]),v=e.range(1.2,3.2),y=e()*Math.PI*2,b=fn+g+f;let w=!0;for(let A=0;A<l&&w;A++){const E=A/l*Math.PI*2,_=L[0]+p*Math.cos(E),I=L[1]+p*Math.sin(E),C=L[2]+m;w=$t(_,I,C,cn+b+4)>=cn+b&&Me(_,I,C)>=ln+b}w&&(n.push(p,h,m,g),r.push(M,v,y)),d%30===29&&await t.yield()}const i=new R.InstancedBufferGeometry;i.setAttribute("position",new R.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]),i.setAttribute("aAir",new R.InstancedBufferAttribute(new Float32Array(n),4)),i.setAttribute("aTurn",new R.InstancedBufferAttribute(new Float32Array(r),3)),i.instanceCount=n.length/4;const c=new R.ShaderMaterial({transparent:!0,depthWrite:!1,depthTest:!0,blending:R.AdditiveBlending,side:R.DoubleSide,uniforms:{...a,uAir:{value:new R.Vector3(qe[0],qe[1],qe[2])}},vertexShader:Qs,fragmentShader:Js}),u=new R.Mesh(i,c);return u.frustumCulled=!1,u.name="frost air",{mesh:u,count:n.length/4,motes:n}}async function Cr(t,e={}){const a=e.shared??as(e.cold),o=e.materials??ns(a),n=ys(!0),r=As(!0);await ye(t);const l=re(e.rng??Us(t.seed));await t.yield(),Jo(n,r,l),Jo(n,r,ra(l),!0),await t.yield();const f=Ps();zs(f,l);const i=Ro();Gs(i,l),await t.yield();const c=new R.Group;c.add(n.mesh(o.lampGrowth),r.mesh(o.threadGrowth),f.mesh(o.iceBody),i.mesh(o.facetBody));const u=l.sites.map(m=>m.y),d=l.sites.map(m=>m.x),p=Math.min(...u),h=Math.max(...u),x=Math.min(...d),s=Math.max(...d);return{object:c,radius:(s-x)/2,height:h-p,center:new R.Vector3(L[0],L[1],L[2]),ground:!1,anchors:{centre:new R.Vector3(L[0],L[1],L[2]),tip:new R.Vector3(x,L[1],L[2])},figure:l,sites:l.sites,counts:{lamps:n.count,threads:r.count,iceTriangles:f.triangles,bodyTriangles:i.triangles},update(m,g){a.uTime.value=g}}}export{fn as AIR_BOB,Xs as AIR_FULL,qe as AIR_LIGHT,cn as AIR_LINE,Qt as AIR_M,Zs as AIR_N,un as AIR_SIZE,ln as AIR_TUBE,dn as AIR_TURN,ae as ARC_OUT,Gn as ARC_PASS,Hn as ARC_R,Qo as ARM_CORE,be as ARM_ON,ho as ARM_ON_CLEAR,_t as ARRIVE_M,mt as ARRIVE_S,so as BARB_M,wa as BAR_TINT,J as BAY,Ba as BEHIND_COLD,Da as BEHIND_TEAL,Na as BEHIND_WARM,Ct as BEYOND,en as BODY_BLADE,Xt as BODY_END,Mo as BODY_GLINT,_a as BODY_GOLD,Ge as BODY_HEART,ks as BODY_LIGHT,Hs as BODY_LINE,ba as BODY_RAKE,Zt as BODY_RIB,on as BODY_RIDGE,Ea as BODY_SHADE,V as BOUNDS,Aa as COLD_FROM,co as COLD_X,qo as COMPANY_ACROSS,Ua as COMPANY_APART,ce as COMPANY_ARC,$o as COMPANY_HABITS,ja as COMPANY_LINE,Ho as COMPANY_N,Xa as COMPANY_RING,Ne as COMPANY_ROWS,Za as COMPANY_STAR,Ya as COMPANY_STEP,Wo as COMPANY_TURN_S,Go as COMPANY_WALK,Nt as COOL_M,Xn as COOL_S,ua as COOL_SHRINK,Ve as DEEP_FROM,Zn as DRAW_S,Ye as EDGE_BAY,Ln as EDGE_DIM,Cn as EDGE_KEEP,Ue as EDGE_SHARE,Fn as EDGE_SOFT,je as EDGE_Z,fs as EMBER,pa as END_ON,po as END_ON_COS,Ao as FACET_EDGE,Ma as FACET_RUN_S,Sa as FACE_BEHIND,Ra as FACE_CLEAR,Ta as FACE_DEEP,bo as FACE_FAR,Ia as FACE_FILL,Oa as FACE_GLINT,Ca as FACE_LINE,Fa as FACE_SLANT,Qa as FAR_SMOOTH,le as FAR_Z,ao as FEATHER_M,bn as FINISHED,Ss as FLAKE_FINE,Os as FLAKE_LIGHT,ma as FROST_FROM,D as GAP,Jn as GATE_M,qs as GLOW_DEEP,Ks as GLOW_LINE,nn as GLOW_N,Ws as GLOW_REACH,Vs as GLOW_SHARE,an as GLOW_SIZE,rn as GLOW_TEAL,$s as GLOW_TURN,sn as GLOW_VIOLET,ia as GLSL_HOLLOW,Bt as GLSL_LAWS,Ko as GOLD,xa as GOLD_FROM,k as HOLLOW,La as ICE_BEND,fe as ICE_BLUE,is as ICE_COLD,ss as ICE_DARK,vo as ICE_EDGE,va as ICE_FULL,rs as ICE_GOLD,hs as ICE_LINE,ze as ICE_PALE,tn as ICE_RIB,ga as ICE_RUN_S,Qn as ICE_S,Ds as ICE_SEGS,Ns as ICE_SPINE,Ut as ICE_TEAL,go as ICE_TURN,Bs as ICE_TWIG,Dt as ICE_VIOLET,We as K_BEHIND,Tt as K_FAULT,Ft as K_FIRST,vn as K_LAST,oe as LAMP_GREAT,ir as LAMP_GREAT_LIGHT,Xe as LAMP_GREAT_SIZE,Ze as LAMP_SMALL,ge as LAST_M,qn as LEAD_M,Un as LEAVE_M,ct as LEAVE_S,Se as LESSER_ACROSS,Va as LESSER_APART,Kt as LESSER_HABITS,Oe as LESSER_LINE,$a as LESSER_N,So as LESSER_NEAR,Po as LESSER_NET,vt as LESSER_RANK,Ka as LESSER_RING,Oo as LESSER_ROWS,No as LESSER_SIGHT,Bo as LESSER_SNOW,Do as LESSER_TURN_S,zo as LESSER_Z,tt as MIST_ROSE,ya as NET_FROM,Mr as NET_FROST,Er as NET_FROST_THREAD,Dn as NET_KEEP,Pn as NET_LIGHT,ee as NET_PALE,nr as NET_SMALL,Bn as NET_THIN,Eo as NO_TINT,ls as ORANGE,cs as PALE,cr as PASS_SHEET_Z,Qe as PASS_Y,Lt as PASS_Z,Fo as PLATE_AHEAD,Le as PLATE_HABIT,Pa as PLATE_LINE,qa as PLATE_LINE_LIGHT,Ga as PLATE_LINE_WIDE,Fe as PLATE_R,To as PLATE_RANK,Lo as PLATE_SIGHT,Co as PLATE_SNOW,Ha as PLATE_THICK,za as PLATE_TURN_S,ka as PLATE_WALL,oa as RAG_AWAY,ro as RAG_M,Tn as RANK_CORE,ve as RANK_OUT,Je as RANK_Z,me as REST_M,Wt as REST_V,Mt as REST_WHOLE,ue as RIM,_n as RIND,qt as RIND_LIVE,la as ROSE_PER,ca as ROSE_RINGS,Kn as ROUTE_POINTS,j as ROW,dt as SIDE,$n as SLANT,ht as SNOW,L as SNOW_AT,Ls as SNOW_BARB_DIM,na as SNOW_CLEAR,de as SNOW_COL,Cs as SNOW_POINT,io as SNOW_T,z as SPARK,Zo as SPINE_TAPER,xt as STANDING,$e as STEPS,xs as THREAD_EMBER,ds as THREAD_GOLD,ps as THREAD_ORANGE,us as THREAD_PALE,no as TINT_S,Vn as TURN_R,He as WALL_FINE,ha as WHITE_GOLD,Ae as WHITE_S,Xo as YOUNG_DIM,Wn as Y_HIGH,Gs as addBody,Rr as addGrowth,zs as addIce,Jo as addSnow,ra as armRunOn,aa as armSites,Ms as arrivalDir,Tr as buildFrostAir,Fr as buildFrostGlow,Cr as buildHero,Ar as buildMist,mr as buildPlate,ea as byGate,wr as companySpecs,ie as discClear,Te as discLine,lr as distanceToLattice,Yn as distanceToNet,fr as distanceToNode,Ro as facetBatch,ts as farWall,Uo as featherCap,pr as fernFigure,Ir as fernSet,Me as gateDist,ur as growthState,pe as hasSheet,Es as hollowDeep,nt as hollowDepth,br as hollowHigh,Ps as iceBatch,Ht as isB,gs as lampAux,ys as lampBatch,ms as lampColourOf,hr as lampSize,ta as lastRankZ,kn as latticeSites,gr as lesserPlates,bt as lineClear,ns as makeMaterials,as as makeShared,Sn as netBay,er as netEdge,zn as netIn,Nn as netRest,or as netStands,ar as netThin,rr as netThinColour,sr as netThinStands,dr as offRouteBox,ne as onSparkRow,bs as placeClock,vr as plateClear,Wa as plateFaces,he as plateSpec,$t as pointClear,yr as primeFarWall,ye as primeRouteLine,Ee as rindClock,_r as rindSet,Re as roseClear,da as roseRing,fa as roseRingK,Et as routeLine,U as rowY,at as siteHash,Jt as siteKey,Gt as siteXYZ,_e as snowClear,re as snowFigure,Us as snowFork,xe as stateAt,te as stateOfDepth,As as threadBatch,vs as threadColourOf,ws as threadNear,xr as wallFern,Mn as xFace,An as xFinished};
