import*as i from"three";import{makePath as mo,clamp as _e,lerp as Re,smoothstep as te}from"../kit/core.js";import{Geo as go}from"../kit/fauna.js";import"three/addons/utils/BufferGeometryUtils.js";const pe=Math.PI*2,wo=["#FBE7DA","#F4B8A6","#5B7DB6","#A9CBE2","#FFC46A","#4B3B32","#E9E0CF"],yo=62,Le=66,vt=200,xe=2.2,je=36,xo=[15,38,68],bo=[17.5,42,74],Ot=[140,520,760],qt=[40,27],Pt=[20,13],zo=3400,tt=v=>1.4+4.6*te(64,92,v)+5*te(92,165,v),zt=Le+2.5*xe,oo=138,ao=36,Vt=2.2,Et=Le+57.5*xe,Ue=Et+4.6,rt=Math.PI/180,Ct=92*rt,Mo=135*rt,kt=181*rt,So=213*rt,It=246*rt,ko=277*rt;function Ao(){const v=[[352,48,-30],[330,47.6,-30],[308,43.8,-30],[286,35.5,-30],[264,27,-30.2],[244,21,-31.2]],n=()=>{let G=0;for(let U=1;U<v.length;U++)G+=Math.hypot(v[U][0]-v[U-1][0],v[U][1]-v[U-1][1],v[U][2]-v[U-1][2]);return G},e=n(),y=[224,-34.6],p=Math.atan2(-y[1],y[0])+Math.acos(zt/Math.hypot(y[0],y[1])),o=[zt*Math.cos(p),-zt*Math.sin(p)];for(const G of[0,.17,.34,.51,.68,.85])v.push([Re(y[0],o[0],G),Re(17,3.3,te(0,1,G)),Re(y[1],o[1],G)]);const q=G=>zt+(oo-zt)*te(Ct,Mo,G)+(Et-oo)*te(kt+14*rt,It,G),Y=G=>{if(G<=kt)return 3.3+(ao-3.3)*te(Ct+2*rt,kt,G);const U=1-te(kt,It,G),ne=U*U;return Vt+(ao-Vt)*ne*ne},r=G=>{const U=q(G);return v.push([U*Math.cos(G),Y(G),-U*Math.sin(G)]),n()},A=r(p),c={};let N=p;for(const[G,U]of[[Ct,"rim1"],[kt,"top"],[So,"low1"],[It,"wheel1"],[ko,"run1"]]){const ne=Math.max(1,Math.round((G-N)*q((N+G)/2)/19));for(let Pe=1;Pe<=ne;Pe++)c[U]=r(N+(G-N)*Pe/ne);N=G}let F=n(),E=Et,_=0,S=0;const k=.02,ee=13;let V=F;for(;E>Le;){const G=te(.8,3,_),U=Re(ee,.8*tt(E)*te(63,80,E),G),ne=Math.sqrt(Math.max(0,ee*ee-U*U));G===0&&(V=F),N+=U/E*k,E-=ne*k,_+=k,S+=ee*k,F+=ee*k,S>=20&&E>Le+9&&(S=0,v.push([E*Math.cos(N),Vt,-E*Math.sin(N)]))}const ze=Math.cos(N),ve=-Math.sin(N),me=F;for(const G of[66,45,24,2])v.push([G*ze,Re(4.4,2.6,te(2,66,G)),G*ve]);const M=mo(v),H=M.length,h=H/(F+64),oe=e*h,I=A*h,a=c.rim1*h,t=c.top*h,P=c.low1*h,d=c.wheel1*h,D=c.run1*h,C=V*h,O=me*h,$=G=>30-8*te(I-70,I+8,G)-7*te(t-100,t-22,G)+5*te(t+16,t+60,G)-5.5*te(P-10,d-30,G)-2.5*te(O+10,H,G),fe=512,ie=new Float32Array(fe+1);for(let G=1;G<=fe;G++)ie[G]=ie[G-1]+H/fe/$((G-.5)/fe*H);const le=ie[fe];return{pts:v,path:M,L:H,duration:le,clockAt:G=>{const U=_e(G,0,1)*fe,ne=Math.min(fe-1,Math.floor(U));return ie[ne]+(ie[ne+1]-ie[ne])*(U-ne)},pace:G=>$(_e(G,0,1)*H)/(H/le),cleft:[ze,ve],rim:[p,Ct+.9],marks:{dive1:oe/H,wheel0:I/H,rim1:a/H,top:t/H,low1:P/H,wheel1:d/H,run1:D/H,slide0:C/H,straight0:O/H}}}const jt=v=>v-Math.floor(v);function ht(v,n){let e=jt(Math.fround(v*.1031)),y=jt(Math.fround(n*.1031)),p=e;const o=Math.fround(e*(y+33.33)+y*(p+33.33)+p*(e+33.33));return e+=o,y+=o,p+=o,jt(Math.fround(Math.fround(e+y)*Math.fround(p)))}const Ut=(v,n)=>{const e=Math.floor(v),y=Math.floor(n);let p=v-e,o=n-y;p=p*p*(3-2*p),o=o*o*(3-2*o);const q=ht(e,y),Y=ht(e+1,y),r=ht(e,y+1),A=ht(e+1,y+1);return q+(Y-q)*p+(r-q)*o+(q-Y-r+A)*p*o},ft=[.891,.454],Kt=1.7,Lo=(v,n)=>[Kt*(Ut(v*.13+3.7,n*.13+3.7)-.5),Kt*(Ut(v*.13+41.3,n*.13+41.3)-.5)];function Bo(){const v=[];for(let n=-17;n<17;n++)for(let e=-17;e<17;e++){const y=ht(e+9.7,n+9.7),p=Ut(e*.31+17,n*.31+17);if(y<.18||p<.545)continue;const o=Re(.45,1.1,ht(e+3.1,n+3.1)),q=2*Math.max(0,.48-.38*o),Y=(e+.5+(ht(e,n)-.5)*q)*4.2,r=(n+.5+(ht(e+7.3,n+7.3)-.5)*q)*4.2,A=Math.hypot(Y,r);if(A>56.5||A<15.5)continue;const c=ft[0]*Y+ft[1]*r,N=-ft[1]*Y+ft[0]*r;let F=c,E=N;for(let _=0;_<8;_++){const S=Lo(F,E);F=c-S[0],E=N-S[1]}v.push({x:F,z:E,R:o,sure:y>.22&&p>.585})}return v}const Ft=[331,-8],ut=96,Wt=-42,$t=3,mt=ut+4,_t=10;function Rt(v,n,e,y){const p=-104+41*v,o=Math.sqrt(43260-p*p)-Ft[0],q=p-Ft[1],Y=Math.hypot(o,q),r=o/Y,A=q/Y;let c=-(4.2*Math.sin(e*.043+v*2.1)+1.3*Math.sin(e*.127+v*5))*te(0,34,e);return n&&(c+=2.2+2.4*Math.sin(e*.061+v*3.3)),y[0]=Ft[0]+r*e+A*c,y[1]=Ft[1]+A*e-r*c,y}const no=[4,5,6,7].map(v=>Ue+xe*v);function so(v,n,e=0,y=_t){const p=[0,0],o=[0,0],q=[0,0],Y=(r,A)=>v?Math.max(0,v(r,A)):0;for(let r=e;r<y;r++){const A=r>>1,c=r&1;for(let N=0;N<ut;N++){const F=Wt+N*$t;Rt(A,c,F,p),Rt(A,c,F-.5,o),Rt(A,c,F+.5,q);const E=q[0]-o[0],_=q[1]-o[1],S=Math.hypot(E,_)||1,k=_/S,ee=-E/S,V=(r*mt+N)*4;n[V]=p[0],n[V+1]=Y(p[0],p[1]),n[V+2]=p[1],n[V+3]=(Y(p[0]+k,p[1]+ee)-Y(p[0]-k,p[1]-ee))/2}for(let N=3,F=0;N>=0;N--){for(;F<230&&(Rt(A,c,F,p),!(Math.hypot(p[0],p[1])<=no[N]));F+=.25);const E=(r*mt+ut+N)*4;n[E]=F,n[E+1]=Math.atan2(-p[1],p[0]),n[E+2]=no[N],n[E+3]=0}}return n}function ro(v,n,e,y,p,o){const q=n>>2,Y=(q*mt+ut+(n&3))*4,r=v[Y],A=v[Y+1],c=v[Y+2],N=(r-e)/y,F=te(N-2.2,N+2.2,p),E=A+tt(c)/c*(p-N),_=_e((e+y*p-Wt)/$t,0,ut-1.001),S=Math.floor(_),k=_-S,ee=(q*mt+S)*4;for(let V=0;V<4;V++)o[V]=v[ee+V]+(v[ee+4+V]-v[ee+V])*k;return o[0]+=(c*Math.cos(E)-o[0])*F,o[1]*=1-F,o[2]+=(-c*Math.sin(E)-o[2])*F,o[3]*=1-F,o}async function Do(v,n,e,y,p){let o=v.escorts;const q=1300,Y=e.marks.dive1-.02,r=[],A=[],c=[],N=[],F=[],E=[],_=new i.Vector3;for(let l=0;l<=q;l++){const f=Y+(1-Y)*(l/q);if(e.path.pointAt(f,_),_.y>14)continue;const z=_.y<3.6?3.4:_.y<4.6?3:_.y<6?2.2:0;r.push(Math.hypot(_.x,_.z)),A.push(Math.atan2(-_.z,_.x)),c.push(e.clockAt(f)),N.push(_.y),F.push(f),E.push(z*z),l%260===259&&await p()}const S=r.length,k=[],ee=[],V=Math.floor((vt-Le)/xe)+1;for(let l=0;l<V;l++)ee.push([]);const ze=ee.map((l,f)=>{const z=Le+f*xe,u=[];for(let T=0;T<S;T++)E[T]>0&&Math.abs(r[T]-z)<12&&u.push(T);return u}),ve=(l,f,z,u,T)=>{let m=1e9,w=0,g=0;const J=ze[l];for(let K=0;K<J.length;K++){const R=J[K],W=f*f+r[R]*r[R]-2*f*r[R]*Math.cos(z+u*c[R]-A[R]);W<m&&(m=W),W<E[R]&&(g=1),W<100&&w++}T.d=Math.sqrt(Math.max(0,m)),T.near=w,T.bad=g},me=l=>(l%=pe,l>Math.PI?l-pe:l<-Math.PI?l+pe:l),M={d:0,near:0,bad:0},H=y.arms,h=y.period,oe=y.armPhase,I=e.marks,a=new Map;for(let l=0;l<S;l++)if(E[l]>0){const f=Math.floor(r[l]);let z=a.get(f);z||a.set(f,z=[]),z.push(l)}const t=(l,f,z)=>{let u=1e9;for(let T=Math.floor(l-4.5);T<=Math.floor(l+4.5);T++){const m=a.get(T);if(m)for(let w=0;w<m.length;w++){const g=m[w],J=f+z*c[g],K=Math.cos(J),R=Math.sin(J),W=r[g]*Math.cos(A[g])-l*K,ae=-r[g]*Math.sin(A[g])+l*R,L=-W*R-ae*K,se=W*K-ae*R,ge=L-_e(L,-.9,1.37),ue=Math.hypot(ge,se)-.32;if(ue<Math.sqrt(E[g])-1.2)return-1;ue<u&&(u=ue)}}return u},P=[],d=new i.Vector3,D=new i.Vector3;if(y.whiteCow){const l=(I.straight0*e.L-14.2)/e.L;for(let f=0;f<S;f++){const z=F[f];if(z<=I.low1+.005||z>=l)continue;const u=Math.min(e.L-.5,z*e.L+6.2+60*(1-te(I.low1+.01,I.wheel1-.02,z)));e.path.posAtDist(u,D),e.path.tangentAtDist(u,d);const T=Math.hypot(d.x,d.z)||1,m=D.x+d.z/T*1.9,w=D.z-d.x/T*1.9;P.push(m,w,c[f],Math.hypot(m,w))}}const C=(l,f,z)=>{for(let u=0;u<P.length;u+=4){if(Math.abs(P[u+3]-l)>2.7)continue;const T=f+z*P[u+2],m=l*Math.cos(T)-P[u],w=-l*Math.sin(T)-P[u+1];if(m*m+w*w<6.8)return!1}return!0};await p();const O=[],$=(l,f)=>{for(const z of O)if(Math.abs(z[0]-l)<1.7&&Math.abs(me(z[1]-f))*l<3.4)return!1;return!0},fe=I.low1-.014,ie=I.straight0+.012,le=Math.ceil((ie-fe)*e.L/2.4),Me=[0,0,0,0,0];if(y.river){const l=v.young,f=Ue,z=tt(f)/f;let u=1e9,T=-1e9,m=0,w=!0;for(let J=0;J<=le;J++){const K=Re(fe,ie,J/le);if(e.path.pointAt(K,_),_.y>6.5||Math.abs(Math.hypot(_.x,_.z)-f)>14)continue;let R=Math.atan2(-_.z,_.x)-z*(e.clockAt(K)-je);w?(w=!1,m=R):(R=m+me(R-m),m=R),R<u&&(u=R),R>T&&(T=R)}await p();let g=0;if(T>=u)for(let J=u-14/f;J<T+46/f;J+=(3.25+.75*l())/f){const K=l(),R=l(),W=l(),ae=l(),L=J-z*je,se=t(f,L,z);se<0||P.length&&!C(f,L,z)||(O.push([f,J]),Me[3]++,k.push({r:f,th:L,sc:.98+.19*K,seed:R,state:0,ant:1+Math.floor(W*3),tint:ae*.9,yaw:0,d:se,near:0,young:1}),(++g&15)===15&&await p())}}await p();for(let l=0;l<S;l+=5){if(l%100===0&&await p(),N[l]>12)continue;const f=F[l]>I.slide0+.01&&F[l]<I.straight0-.02,z=F[l]>I.wheel0-.07&&F[l]<I.rim1+.04||F[l]>I.low1-.02&&F[l]<=I.slide0+.01;for(let u=0;u<(z||f?12:5);u++){const T=(u&1?1:-1)*(u<2?f?u===0?o.range(4.8,7):o.range(4.2,5.4):o.range(4,6.2):u>4?o.range(4,14):o.range(4.6,9.5+1.6*N[l])),m=Math.round((r[l]+T-Le)/xe),w=u>4?o.range(-4,30):o.range(-9,14),g=o()<.08,J=o()<y.paleShare,K=o(),R=o();if(m<0||m>=V)continue;const W=Le+m*xe,ae=tt(W)/W,L=A[l]+w/W-ae*(c[l]-je),se=ee[m],ge=2.9/W;let ue=!0;for(let we=0;we<se.length;we++){let de=Math.abs(se[we]-L)%pe;if(de>Math.PI&&(de=pe-de),de<ge){ue=!1;break}}!ue||W>194.5&&!$(W,L)||(ve(m,W,L-ae*je,ae,M),!M.bad&&(se.push(L),k.push({r:W,th:L-ae*je,sc:g?1.1:.88+.14*K,seed:K,state:0,ant:g?0:1+Math.floor(R*3),tint:(J?1:0)+R*.9,yaw:0,d:M.d,near:M.near})))}}await p(),o=v.runners;let Ve=0;for(;k.length<y.runners+300&&Ve++<y.runners*60;){(Ve&511)===0&&await p();const l=o()<.08?o.range(Le-1,80):Math.sqrt(Re(Le*Le,(vt+3)*(vt+3),o())),f=_e(Math.round((l-Le)/xe),0,V-1),z=Le+f*xe,u=o()*pe,T=(((u+oe)*H/pe+z/h)%1+1)%1,m=n.n2(z*.021+7,Math.floor((u+oe)*H/pe+z/h)*3.1),w=.5+.07*m,g=te(0,.07,T)*te(w,w-.07,T)*te(77,82,z),J=te(80,75,z)*.9,K=te(vt+3,vt-12,z);if(o()>Math.max(g,J)*(.35+.65*K))continue;const R=ee[f],W=2.9/z;let ae=!0;for(let de=0;de<R.length;de++){let Q=Math.abs(R[de]-u)%pe;if(Q>Math.PI&&(Q=pe-Q),Q<W){ae=!1;break}}if(!ae||z>194.5&&!$(z,u))continue;const L=tt(z)/z,se=u-L*je;if(ve(f,z,se,L,M),M.bad)continue;R.push(u);const ge=o()<(z>187?.5:.06),ue=o()<y.paleShare,we=!ue&&o()<.035;k.push({r:z,th:se,sc:ge?o.range(1.06,1.18):o.range(.86,1.02),seed:o(),state:0,ant:ge?0:1+Math.floor(o()*3),tint:(ue?1:we?2:0)+o()*.9,yaw:0,d:M.d,near:M.near})}await p();const G=[];if(y.stragglers>0&&y.trail){const l=v.trails,f=y.stragglers,z=Math.ceil(f/5),u=y.trail,T=[0,0,0,0],m=[],w=[[],[],[],[],[]];for(let g=0;g<5;g++)m.push(l.range(4.4,5.6));for(let g=0;g<f;g++){const J=g%5,K=Math.floor(g/5),R=l(),W=l()<.36?1:0,ae=Math.floor(l()*4),L=l(),se=l(),ge=l(),ue=l(),we=l()<y.paleShare,de=J*2+W,Q=de*4+ae,qe=(de*mt+ut+ae)*4,Ce=u[qe],$e=u[qe+1],Fe=u[qe+2],Be=m[J],Z=tt(Fe)/Fe;let Se=4+(Ce-10)*(K+.12+.76*R)/z,ke=!1;for(let He=0;He<7&&!ke;He++,Se-=3.7){ke=!0;for(const De of w[J])if(Math.abs(De-Se)<3.7){ke=!1;break}const Je=$e+Z*(je-(Ce-Se)/Be);if(ke){for(const De of G)if(De[0]===Fe&&Math.abs(me(De[1]-Je))*Fe<3.6){ke=!1;break}}if(ke)for(let De=0;De<S;De+=2){if(!E[De])continue;ro(u,Q,Se,Be,c[De],T);const Ke=T[0]-r[De]*Math.cos(A[De]),We=T[2]+r[De]*Math.sin(A[De]);if(Ke*Ke+We*We<13){ke=!1;break}}ke&&(w[J].push(Se),G.push([Fe,Je]),k.push({r:800+Q,th:Se,sc:.88+.2*ge,seed:L,state:0,ant:1+Math.floor(ue*3),tint:(we?1:0)+se*.9,yaw:Be,d:600+g,near:0,trail:1}))}(g&7)===7&&await p()}for(const g of G)O.push(g)}if(await p(),y.river){let l=(Math.floor(Math.abs(y.armPhase)*1e5)^2135587861)>>>0;const f=()=>{l=l+1831565813|0;let g=Math.imul(l^l>>>15,1|l);return g=g+Math.imul(g^g>>>7,61|g)^g,((g^g>>>14)>>>0)/4294967296},z=g=>tt(g)/g,u=new Map,T=g=>Math.round(g*10);O.length=0;for(const g of G)O.push(g);const m=(g,J)=>{const K=T(g);let R=u.get(K);R||u.set(K,R=[]),R.push(J),g>194.5&&O.push([g,J])};for(const g of k)g.state===0&&g.r<800&&m(g.r,g.th+z(g.r)*je);const w=(g,J,K,R,W)=>{const ae=u.get(T(g));if(ae){for(let L=0;L<ae.length;L++)if(Math.abs(me(ae[L]-J))*g<3)return!1}if(g>194.5)return $(g,J);for(const L of[-xe/2,xe/2]){const se=u.get(T(g+L));if(!se)continue;const ge=K+R*W-z(g+L)*(W-je);for(let ue=0;ue<se.length;ue++)if(Math.abs(me(se[ue]-ge))*g<3.1)return!1}return!0};await p();{const g=[3.3,5.5,7.7,9.9,0],J=[1,.84,.62,.42,.9],K=new Set,R=(ae,L)=>{const se=Math.sin(ae*127.1+L*311.7)*43758.5453;return se-Math.floor(se)},W=(ae,L,se)=>{const ge=u.get(T(ae));let ue=-1e9,we=1e9;if(ge)for(let de=0;de<ge.length;de++){const Q=me(ge[de]-L)*ae;Q<=0?Q>ue&&(ue=Q):Q<we&&(we=Q)}return we-ue<2*se?NaN:L+(ue>-se?se+ue:we<se?we-se:0)/ae};for(let ae=0;ae<=le;ae++){await p();const L=Re(fe,ie,ae/le),se=e.clockAt(L);if(e.path.pointAt(L,_),e.path.tangentAt(L,d),_.y>6.5)continue;const ge=Math.hypot(d.x,d.z)||1,ue=d.x/ge,we=d.z/ge;for(let de=0;de<9;de++){const Q=de>>1,qe=(de&1?-1:1)*g[Q];for(let Ce=-4;Ce<=36;Ce+=1.6){const $e=_.x+ue*Ce+we*qe,Fe=_.z+we*Ce-ue*qe,Be=Math.atan2(-Fe,$e);let Z=Math.hypot($e,Fe);if(Z>Ue-1.1?Z=Ue+xe*Math.max(0,Math.round((Z-Ue)/xe)):Z=Le+xe*Math.round((Z-Le)/xe),Z<Le-.1||Z>Ue+5.2*xe)continue;const Se=z(Z),ke=Be-Se*(se-je),He=Math.round(ke*Z/1.6),Je=(T(Z)*4096+(He%4096+4096)%4096)*8+Q;if(K.has(Je))continue;K.add(Je);const De=(((ke+oe)*H/pe+Z/h)%1+1)%1,Ke=De>.5&&Z<vt;if(R(He,Z)>J[Q]*(Ke&&Q>1&&Q<4?.5:1))continue;Me[1]++;const We=W(Z,ke,3.05+.85*R(He+.5,Z));if(We!==We){Me[2]++;continue}const ot=We-Se*je;if(!w(Z,We,ot,Se,se)){Me[2]++;continue}const at=t(Z,ot,Se);if(at<0||P.length&&!C(Z,ot,Se)){Me[4]++;continue}m(Z,We),Me[0]++;const dt=R(He,Z+1),Qe=R(He,Z+2),be=R(He,Z+3),gt=R(He,Z+4),et=dt<(Z>Ue+2.5*xe?.55:.04),At=Qe<y.paleShare,Ze=!At&&Qe>.965;k.push({r:Z,th:ot,sc:et?1.06+.1*be:.87+.15*be,seed:be,state:0,ant:et?0:1+Math.floor(gt*3),tint:(At?1:Ze?2:0)+gt*.9,yaw:0,d:at,near:0})}}}}await p();for(let g=0;g<=le;g++){(g&3)===3&&await p();const J=Re(fe,ie,g/le),K=e.clockAt(J);if(e.path.pointAt(J,_),e.path.tangentAt(J,d),_.y>6.5)continue;const R=Math.hypot(d.x,d.z)||1,W=d.x/R,ae=d.z/R,L=J<I.slide0+.004;for(let se=0;se<(L?y.riverTries[0]:y.riverTries[1]);se++){const ge=f(),ue=f(),we=f(),de=f();let Q,qe;if(ge<.06)Q=(ue-.5)*2.2,qe=18+46*we;else{const et=ge<.53?1:-1;Q=et*(2.9+(L&&et<0?20:12)*Math.pow(ue,1.5)),qe=L?-5+52*we:-6+40*we}const Ce=_.x+W*qe+ae*Q,$e=_.z+ae*qe-W*Q,Fe=Math.atan2(-$e,Ce),Be=Math.abs(Q);let Z=Math.hypot(Ce,$e);if(Z>Ue-1.1)Z=Ue+xe*Math.max(0,Math.round((Z-Ue)/xe));else{const et=Be<10.5?xe/2:xe;Z=Le+et*Math.round((Z-Le)/et)}if(Z<Le-.1||Z>Ue+9.2*xe)continue;const Se=z(Z),ke=Fe-Se*K,He=ke+Se*je,Je=(((He+oe)*H/pe+Z/h)%1+1)%1,De=Je>.5&&Z<vt;if(de>(Be<7.5?.95:Be<11?.7:.45)*(De&&Be>5.5?Be<9.5?.7:.4:1))continue;if(Me[1]++,!w(Z,He,ke,Se,K)){Me[2]++;continue}const Ke=t(Z,ke,Se);if(Ke<0||P.length&&!C(Z,ke,Se)){Me[4]++;continue}m(Z,He),Me[0]++;const We=f(),ot=f(),at=f(),dt=f(),Qe=We<(Z>Ue+2.5*xe?.55:.04),be=ot<y.paleShare,gt=!be&&ot>.965;k.push({r:Z,th:ke,sc:Qe?1.06+.1*at:.87+.15*at,seed:at,state:0,ant:Qe?0:1+Math.floor(dt*3),tint:(be?1:gt?2:0)+dt*.9,yaw:0,d:Ke,near:0})}}await p()}const[U,ne]=e.cleft,Pe=[],Ee=(l,f,z,u,T,m,w,g=o,J=59.5,K=4.4,R=7.3)=>{const W=Math.hypot(l,f);if(W<16.5||W>J||e.path.nearestXZ(l,f).dist<K)return!1;for(const L of y.craters)if((L.x-l)*(L.x-l)+(L.z-f)*(L.z-f)<(L.R+.45)*(L.R+.45))return!1;for(const L of Pe)if((L.x-l)*(L.x-l)+(L.z-f)*(L.z-f)<R)return!1;Pe.push({x:l,z:f});const ae=g()<y.paleShare;return k.push({r:W,th:Math.atan2(-f,l),sc:z?g.range(.7,.78):g.range(.92,1.02),seed:g(),state:u,ant:z?4:1+Math.floor(g()*3),tint:w??(ae?1:0)+g()*.9,yaw:T,d:m,near:0}),!0},it=(l,f)=>Math.atan2(l*ne*Math.cos(f)+U*Math.sin(f),-l*U*Math.cos(f)+ne*Math.sin(f));if(y.whiteCow){const z=U*10.6-ne*6.1,u=ne*10.6+U*6.1;Pe.push({x:z,z:u}),k.push({r:Math.hypot(z,u),th:Math.atan2(-u,z),sc:1.04,seed:.61,state:1,ant:1,tint:3.5,yaw:Math.atan2(U*.9+ne*.44,ne*.9-U*.44),d:3.6,near:0})}o=v.aisle;for(let l=0;l<14;l++)for(const f of[-1,1]){const z=15.5+l*2.95+o.range(-.3,.3)+(f>0?1.4:0),u=(l+(f>0?1:0)&1)===1,T=f*(u?o.range(4.6,5.1):o.range(4.7,5.4)),m=o(),w=it(f,o.range(-1.7,1.7));for(const W of[0,.85,-.85,1.5])if(Ee(U*(z+W)-ne*T,ne*(z+W)+U*T,u,u?m<.45?2:1:m<.4?3:1,w,3.5+Math.abs(T)*.01))break;const g=z+1.5,J=f*o.range(8,10.4),K=o(),R=it(f,o.range(-2.4,2.4));for(const W of[0,.9,-.9])if(Ee(U*(g+W)-ne*J,ne*(g+W)+U*J,K<.3,K<.3?2:K<.6?3:1,R,8))break}o=v.bowls;for(let l=0;l<y.craters.length;l++){const f=y.craters[l];if(!f.sure||o()<.42)continue;const z=o()*pe,u=f.R+.95,T=f.x+Math.cos(z)*u,m=f.z+Math.sin(z)*u,w=T*U+m*ne,g=Math.abs(-T*ne+m*U);w>0&&g<11||Ee(T,m,!1,3,Math.atan2(f.x-T,f.z-m),Math.max(Math.hypot(T,m),20))}o=v.rimside;for(let l=0,f=0;l<46&&f<1200;f++){const z=e.rim[0]-.15+o()*(e.rim[1]-e.rim[0]+.55),u=o.range(40,59),T=o()<.35,m=o();Ee(u*Math.cos(z),-u*Math.sin(z),T,T?m<.6?2:1:m<.25?2:m<.5?3:1,o()*pe,Math.max(zt-u,6))&&l++}for(o=v.eye,Ve=0;Pe.length<y.eye+46&&Ve++<y.eye*80;){const l=o()*pe,f=Math.sqrt(Re(289,3364,o())),z=Math.cos(l)*f,u=Math.sin(l)*f,T=z*U+u*ne,m=Math.abs(-z*ne+u*U);if(T>0&&m<11||Math.abs(z)<16&&u<-8&&u>-52&&o()<.7)continue;const w=o()<.2,g=o();Ee(z,u,w,w?g<.55?2:1:g<.2?2:g<.4?3:1,o()*pe,Math.max(f,20))}{let l=(Math.floor(Math.abs(y.armPhase)*1e5)^1013904242)>>>0;const f=()=>{l=l+1831565813|0;let u=Math.imul(l^l>>>15,1|l);return u=u+Math.imul(u^u>>>7,61|u)^u,((u^u>>>14)>>>0)/4294967296};f.range=(u,T)=>u+(T-u)*f();const z=u=>{const T=Math.cos(u),m=Math.sin(u);return Math.atan2(-U*T+ne*m,-U*m-ne*T)};for(const u of y.craters){if(!u.sure)continue;const T=u.x*U+u.z*ne,m=-u.x*ne+u.z*U;if(T<14||T>63||Math.abs(m)<3.2||Math.abs(m)>12.5)continue;const w=m>0?1:-1,g=-ne*w*.8+U*.6,J=U*w*.8+ne*.6,K=u.x+g*(u.R+.95),R=u.z+J*(u.R+.95);Ee(K,R,!1,3,Math.atan2(u.x-K,u.z-R),5,void 0,f,64.3)}for(let u=14;u<64.4;u+=1.45)for(const T of[-1,1])for(let m=0;m<4;m++){const w=f(),g=f(),J=f(),K=f(),R=f();if(m===0&&R>.5||m===3&&R>.62)continue;const W=T*(m===0?3.7+.8*w:m===1?4.6+1.3*w:m===2?6.5+1.9*w:9+3.6*w),ae=u+(g-.5)*1.2,L=m===0?J<.7:m===1?J<.36:J<.3,se=m===0?2:L?K<.3?2:1:K<.12?2:K<.4?3:1;Ee(U*ae-ne*W,ne*ae+U*W,L,se,z((R-.5)*2.6),3.6+m,void 0,f,64.3,m===0?3.6:4.4,m===0?4.2:5.3)}}y.whiteCow&&k.push({r:999,th:0,sc:1.04,seed:.37,state:0,ant:1,tint:3.5,yaw:0,d:0,near:0}),await p();{const l=new Map,f=new Float32Array(S),z=new Float32Array(S);for(let m=0;m<S;m++)if(f[m]=r[m]*Math.cos(A[m]),z[m]=-r[m]*Math.sin(A[m]),E[m]>0){const w=Math.floor(r[m]);let g=l.get(w);g||l.set(w,g=[]),g.push(m)}let u=0,T=0;for(const m of k){if(m.state!==0||m.r>800||m.d>5)continue;(++T&31)===0&&await p();const w=tt(m.r)/m.r,g=-.9*m.sc,J=1.37*m.sc;let K=!1;for(let R=Math.floor(m.r-5);R<=Math.floor(m.r+5)&&!K;R++){const W=l.get(R);if(W)for(let ae=0;ae<W.length&&!K;ae++){const L=W[ae],se=Math.sqrt(E[L])-1.2,ge=L+1<S&&F[L+1]-F[L]<.002?L+1:L;for(let ue=0;ue<(ge===L?1:2);ue++){const we=ue*.5,de=c[L]+(c[ge]-c[L])*we,Q=m.th+w*de,qe=Math.cos(Q),Ce=Math.sin(Q),$e=f[L]+(f[ge]-f[L])*we-m.r*qe,Fe=z[L]+(z[ge]-z[L])*we+m.r*Ce,Be=-$e*Ce-Fe*qe,Z=$e*qe-Fe*Ce;if(Math.hypot(Be-_e(Be,g,J),Z)-.32<se){K=!0;break}}}}K&&(m.out=1,u++)}if(u){const m=k.filter(w=>!w.out);k.length=0;for(const w of m)k.push(w)}Me.push(u)}return await p(),k.sort((l,f)=>l.d-f.d),k.eyeSpots=Pe,k.river=Me,k}const io=[0,.95,.5],lo=[[-.125,.86,.4,0,.25],[.125,.86,.4,.5,.75],[-.13,.9,-.5,.5,0],[.13,.9,-.5,0,.5]];function To(v,n){const e=new go,y=(M,H,h)=>M.clone().lerp(H,h),p=M=>_e((M-io[2])/.28,0,1);if(v===2){const M=e.v(0,.95,-.8,n.rump),H=e.v(0,1,1.26,n.face),h=(a,t,P,d,D,C,O)=>[e.v(0,t,a,D),e.v(-d,(t+P)*.52,a,C),e.v(0,P,a,O),e.v(d,(t+P)*.52,a,C)],oe=h(-.5,1.1,.6,.26,n.coat,n.flank,n.belly),I=h(.44,1.15,.5,.25,y(n.coat,n.ruff,.5),y(n.flank,n.ruff,.35),y(n.belly,n.ruff,.6));for(let a=0;a<4;a++){const t=(a+1)%4;e.tri(M,oe[t],oe[a]),e.quad(oe[a],oe[t],I[t],I[a]),e.tri(I[a],I[t],H)}e.anim([I[0],I[3]+1],()=>[.25,0,2,0]),e.anim([H,H+1],()=>[1,0,2,0]);for(const[a,t,P,d,D]of lo){const C=e.n;e.v(a,t*.72,P-.08,n.leg),e.v(a,t*.72,P+.08,n.leg),e.v(a,0,P,n.leg),e.tri(C,C+1,C+2),e.anim([C,C+3],(O,$)=>[d,1-$/t,1,D]),e.pivot([C,C+3],a,t,P)}for(const a of[-1,1]){const t=e.n;e.v(a*.05,1.2,.98,n.horn),e.v(a*.12,1.24,.8,n.horn),e.v(a*.4,1.95,.84,n.horn),e.tri(t,t+1,t+2),e.anim([t,t+3],()=>[1,0,6,0]),e.pivot([t,t+3],a*.06,1.2,.93)}return e.build()}const o=v===0,q=v===3,Y=o?12:q?6:8,r=o?[[-.85,.9,0,0],[-.825,.9,.065,.095],[-.76,.895,.145,.18],[-.64,.885,.222,.248],[-.47,.875,.262,.27],[-.25,.885,.234,.236],[0,.86,.26,.275],[.25,.835,.268,.325],[.43,.85,.232,.33],[.57,.885,.165,.245],[.7,.91,0,0]]:q?[[-.84,.9,0,0],[-.66,.885,.2,.235],[-.24,.88,.24,.245],[.3,.84,.262,.32],[.56,.875,.17,.25],[.7,.9,0,0]]:[[-.84,.9,0,0],[-.72,.89,.17,.2],[-.32,.88,.25,.25],[.28,.835,.266,.322],[.56,.88,.17,.245],[.7,.905,0,0]],A=e.loft(r.map(([M,H,h,oe])=>({z:M,y:H,rx:h,ry:oe})),{sides:Y,top:n.coat,belly:n.belly,shade:[-.8,-.25]});if(o)for(const M of[-1,1])e.blob(M*.165,.775,-.47,.112,.245,.215,n.coat,n.belly,6,3),e.blob(M*.15,.765,.385,.098,.235,.175,n.coat,n.belly,6,3);const c=[A[0],e.n];e.glow(c,1),e.paint(c,(M,H,h,oe)=>{const I=(H-.55)/.6;I>.12&&I<.5&&oe.lerp(n.flank,.75*te(.12,.25,I)*te(.5,.36,I)),oe.lerp(n.ruff,.8*te(.4,.6,h)*te(1.12,.8,H)),oe.lerp(n.ruff,.3*te(.66,.58,H)*te(-.5,-.2,h)),oe.multiplyScalar(.86+.14*te(.6,1.1,H))});for(const[M,H,h,oe,I]of lo){const a=h>0,t=a?1:1.3,P=a?.012:-.03,d=o?[1,.8,.5,.42,.2,.085,.04,0]:q?[1,.45,0]:[1,.45,.08,0],D=o?[.085*t,.07*t,.043,.047,.03,.036,.058,.064]:q?[.08*t,.048,.056]:[.08*t,.046,.036,.062],C=e.tube(d.map(O=>[M,H*O,h+(O>.3&&O<.6?P:0)+(O<.05?.02:0)]),D,o?5:3,n.leg,n.leg);if(o){const O=e.n,$=e.v(M,0,h+.02,n.hoof);for(let fe=0;fe<5;fe++)e.tri($,O-5+fe,O-5+(fe+1)%5)}e.anim([C[0],e.n],(O,$)=>[oe,_e(1-$/H,0,1),1,I]),e.pivot([C[0],e.n],M,H,h),e.glow([C[0],e.n],(O,$)=>$>.1?1:0),e.paint([C[0],e.n],(O,$,fe,ie)=>{$<.05?ie.copy(n.hoof):$<.2?ie.lerp(n.ruff,.5*te(.2,.1,$)):$>.55&&ie.lerp(n.flank,te(.55,.8,$))})}const N=e.n,F=o?[[0,.93,.44],[0,.98,.62],[0,1.03,.8],[0,1.08,.95],[0,1.1,1.02]]:q?[[0,.93,.44],[0,1.09,1]]:[[0,.93,.44],[0,1,.72],[0,1.09,1]],E=e.tube(F,o?[.2,.165,.13,.105,.09]:q?[.2,.095]:[.2,.14,.09],o?8:q?4:5,y(n.coat,n.ruff,.8),y(n.coat,n.ruff,.55),{flatten:.72});e.glow(E,1);const _=.3,S=Math.cos(_),k=Math.sin(_),ee=e.n,V=o?[[-.1,0,0,0],[-.04,0,.085,.095],[.1,0,.092,.1],[.24,-.015,.066,.075],[.34,-.025,.056,.06],[.385,-.03,0,0]]:[[-.08,0,0,0],[.04,0,.09,.1],[.3,-.02,.058,.064],[.385,-.03,0,0]],ze=e.loft(V.map(([M,H,h,oe])=>({z:M,y:H,rx:h,ry:oe})),{sides:o?8:q?4:5,top:n.face,belly:y(n.face,n.ruff,.5)});e.paint(ze,(M,H,h,oe)=>{oe.lerp(n.ruff,.7*te(.27,.34,h)),h>(o?.33:.365)&&(H<.03||h>.365)&&oe.copy(n.hoof),o&&h>.05&&h<.12&&Math.abs(M)>.07&&H>0&&oe.copy(n.hoof)}),e.glow(ze,(M,H,h)=>h<.3?1:0),e.move([ee,e.n],M=>{const H=M.y*1.15,h=M.z*1.12;M.x*=1.15,M.y=H*S-h*k+1.13,M.z=H*k+h*S+1});for(const M of[-1,1]){if(!q){const I=e.fan([[M*.075,1.2,.97],[M*.2,1.27,.9],[M*.15,1.2,.93]],n.coat,y(n.coat,n.ruff,.4));e.anim(I,a=>[1,_e((Math.abs(a)-.075)/.12,0,1),5,0]),e.pivot(I,M*.075,1.2,.97)}const H=e.n,h=[[M*.06,1.2,.93],[M*.17,1.42,.76],[M*.3,1.68,.7],[M*.37,1.87,.8],[M*.34,1.98,.97]],oe=[[h[0],[M*.05,1.27,1.12],[M*.02,1.36,1.24]],[h[1],[M*.22,1.5,.95],[M*.2,1.6,1.06]],[h[2],[M*.36,1.7,.52],null],[h[3],[M*.47,1.99,.72],null],[h[3],[M*.3,2.02,.84],null],[h[4],[M*.22,2.06,1.1],null]];if(o){e.tube(h,[.034,.03,.025,.02,.006],4,n.horn,n.hornTip);for(const[I,a,t]of oe){const P=e.tube(t?[I,a,t]:[I,a],t?[.021,.018,.004]:[.019,.004],3,n.horn,n.hornTip);e.anim(P,()=>[0,1,0,0])}}else{const I=(t,P)=>[t[0]+M*P*.5,t[1]-P*.3,t[2]+P],a=q?[h[0],h[2],h[4]]:h;e.strip(a,a.map((t,P)=>I(t,.075*(1-P/(a.length-.6)))),n.horn,n.hornTip);for(const[t,P,d]of oe.slice(0,q?3:5)){const D=e.n;e.v(t[0],t[1]-.035,t[2],n.horn),e.v(t[0],t[1]+.035,t[2]+.035,n.horn);const C=d||P;e.v(C[0],C[1],C[2],n.hornTip),e.tri(D,D+1,D+2)}}e.anim([H,e.n],(I,a,t,P)=>[1,e.a[P*4+1],6,0]),e.pivot([H,e.n],M*.06,1.2,.93)}const ve=(M,H,h)=>{const oe=[],I=[],a=o?4:2;for(let P=0;P<=a;P++){const d=P/a,D=.5+d*.48,C=.84+d*.2,O=H*Math.sin((.25+.75*d)*Math.PI)*(1-.3*d);oe.push([Math.sin(M)*.07,C,D]),I.push([Math.sin(M)*(.07+O*.5),C-O*Math.cos(M),D-O*.25])}const t=e.strip(oe,I,y(n.ruff,n.coat,.2),h);e.glow(t,1)};if(ve(0,.26,n.ruff),o&&(ve(.6,.2,n.ruff),ve(-.6,.2,n.ruff)),!q){const M=e.blob(0,.83,.7,o?.115:.105,.2,.21,y(n.ruff,n.coat,.12),n.ruff,o?6:5,o?4:3);e.glow(M,1)}for(let M=N;M<e.n;M++)e.a[M*4+2]===0&&(e.a[M*4+2]=2,e.a[M*4]=p(e.p[M*3+2]));const me=e.fan([[0,1,-.78],[.045,.93,-.86],[0,.84,-.9],[-.045,.93,-.86]],n.rump,n.rump);return e.anim(me,(M,H)=>[0,_e((1-H)/.16,0,1),3,0]),e.pivot(me,0,1,-.78),e.build()}function qo(v,n,e,y){const p=new i.InstancedBufferGeometry,o=y-e,q=new Float32Array(o*4),Y=new Float32Array(o*4);p.index=v.index;for(const r in v.attributes)p.setAttribute(r,v.attributes[r]);for(let r=0;r<o;r++){const A=n[e+r];q.set([A.r,A.th,A.sc,A.seed],r*4),Y.set([A.state,A.ant,A.tint,A.yaw],r*4)}return p.setAttribute("iA",new i.InstancedBufferAttribute(q,4)),p.setAttribute("iB",new i.InstancedBufferAttribute(Y,4)),p.instanceCount=o,p.boundingSphere=new i.Sphere(new i.Vector3(0,10,0),360),p}const co=`
#define K_FAR .7
float farOf(float d){ return smoothstep(110., 380., d); }
`,Jt=`
${co}uniform float uClock, uTime;
uniform vec4 uLead; uniform vec3 uLeadB;      // the led animal (iA.x > 900): xyz position, w speed; forward x, forward z, gait cycle
// the stragglers' trails (trailTable); a straggler has 800 < iA.x < 900
uniform highp sampler2D uTrail;
attribute vec4 iA, iB;
// set by slotFrame for a straggler: its gait cycle, the slope of the ground under it
float gCyc = 0.; vec2 gGrad = vec2(0.);
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float speedOf(float r){ return 1.4 + 4.6 * smoothstep(64., 92., r) + 5. * smoothstep(92., 165., r); }
float strideOf(float v){ return 1.1 + 1.3 * smoothstep(1.4, 6., v) + smoothstep(6., 11., v); }
float dutyOf(float v){ return .62 - .22 * smoothstep(1.4, 6., v) - .11 * smoothstep(6., 11., v); }
// a straggler at clock t: down its trail at its own pace, then (blended in over 4.4 s) round the ring it joins; w = how far it has joined
vec4 trailPos(float t, int row, vec4 J, float s0, float vT, out float w){
  float tJ = (J.x - s0) / vT, th = J.y + speedOf(J.z) / J.z * (t - tJ);
  w = smoothstep(tJ - 2.2, tJ + 2.2, t);
  float f = clamp((s0 + vT * t - (${Wt}.)) / ${$t}., 0., ${ut-1.001}); int k = int(f);
  vec4 T = mix(texelFetch(uTrail, ivec2(k, row), 0), texelFetch(uTrail, ivec2(k + 1, row), 0), f - float(k));
  return vec4(mix(T.xyz, vec3(J.z * cos(th), 0., -J.z * sin(th)), w), T.w * (1. - w));
}
void slotFrame(float t, out vec3 base, out vec3 fwd, out float v){
  gGrad = vec2(0.);
  if(iA.x > 900.){ fwd = vec3(uLeadB.x, 0., uLeadB.y); v = uLead.w; base = vec3(uLead.x, 0., uLead.z) - fwd * (v * (uClock - t)); return; }
  if(iA.x > 800.){
    int code = int(iA.x - 799.5), row = code / 4; float s0 = iA.y, vT = max(iB.w, .5), w, w2;
    vec4 J = texelFetch(uTrail, ivec2(${ut} + code - row * 4, row), 0);
    vec4 P = trailPos(t, row, J, s0, vT, w), A = trailPos(t - .2, row, J, s0, vT, w2), B = trailPos(t + .2, row, J, s0, vT, w2);
    vec3 dv = B.xyz - A.xyz; float dl = max(length(dv), 1e-4), hl = max(length(dv.xz), 1e-4);
    base = P.xyz; fwd = dv / dl; v = dl / .4;
    vec2 fx = dv.xz / hl; gGrad = fx * (dv.y / hl) + vec2(fx.y, -fx.x) * P.w;
    float tJ = (J.x - s0) / vT, vR = speedOf(J.z), cT = vT / (strideOf(vT) * iA.z);
    gCyc = mix(cT * t, cT * tJ + vR * (t - tJ) / (strideOf(vR) * iA.z), w) + iA.w * 17.;
    return;
  }
  float r = iA.x, th0 = iA.y;
  v = iB.x < .5 ? speedOf(r) : 0.;
  float th = th0 + v / r * t, c = cos(th), s = sin(th);
  base = vec3(r * c, 0., -r * s); fwd = vec3(-s, 0., -c);
  if(iB.x > .5) fwd = vec3(sin(iB.w), 0., cos(iB.w));
}
// 0 standing .. 1 lying (state 2: they get up and lie down again on a slow cycle)
float lieOf(){ return (iB.x > 1.5 && iB.x < 2.5) ? smoothstep(-.55, -.25, sin(uTime * .11 + iA.w * 40.)) : 0.; }
float cycOf(float v){ return iA.x > 900. ? uLeadB.z : iA.x > 800. ? gCyc : uClock * v / (strideOf(v) * iA.z) + iA.w * 17.; }
// one foot relative to its rest spot, in unscaled animal metres: x forward, y lift. During stance the foot
// travels back exactly one stride per cycle, i.e. at body speed: it is fixed in the world.
vec2 footOf(float cyc, float tp, float wp, float v, float front){
  if(iB.x > .5){
    vec2 f = vec2((h11(iA.w * 9. + tp * 3. + wp) - .5) * .16, 0.);
    if(iB.x > 2.5 && front > .5 && tp < .25){ float a = uTime * 5.2 + iA.w * 20., on = smoothstep(.1, .5, sin(uTime * .5 + iA.w * 30.)); f = mix(f, vec2(.16 + .2 * sin(a), .13 * max(cos(a), 0.)), on); }
    return f;
  }
  float trot = smoothstep(2., 4.5, v), ph = fract(cyc + mix(wp, tp, trot)), beta = dutyOf(v), a = .5 * beta * strideOf(v);
  if(ph < beta) return vec2(a * (1. - 2. * ph / beta), 0.);
  float s = (ph - beta) / (1. - beta), e = s * s * (3. - 2. * s);
  return vec2(-a + 2. * a * e, sin(3.14159 * s) * mix(.09, .24, trot) * (front > .5 ? 1. : .8));
}
// body height offset: crouch, trot bounce, lying down
float bodyOf(float cyc, float v){
  float trot = smoothstep(2., 4.5, v);
  return -.04 - .045 * trot + .03 * trot * sin(cyc * 12.566 + 1.2) + .012 * (1. - trot) * step(.1, v) * sin(cyc * 12.566) - .36 * lieOf();
}
`,Mt=`
float hash3(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float hash2(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float vnoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(hash3(i), hash3(i + vec3(1, 0, 0)), f.x), mix(hash3(i + vec3(0, 1, 0)), hash3(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash3(i + vec3(0, 0, 1)), hash3(i + vec3(1, 0, 1)), f.x), mix(hash3(i + vec3(0, 1, 1)), hash3(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
float vnoise2(vec2 x){ vec2 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(hash2(i), hash2(i + vec2(1, 0)), f.x), mix(hash2(i + vec2(0, 1)), hash2(i + vec2(1, 1)), f.x), f.y); }
float fbm2(vec2 p){ return vnoise2(p) * .5 + vnoise2(p * 2.03 + 11.) * .25 + vnoise2(p * 4.01 + 5.) * .125 + vnoise2(p * 8.1) * .0625; }
`,Zt=`
uniform vec3 uHazeCol, uHazeGold; uniform vec4 uHaze4;      // x strength, y scale height, z time
float hazeA(vec3 p, vec3 cam){
  float r = length(p.xz), ring = smoothstep(60., 78., r) * smoothstep(224., 198., r);
  float K = uHaze4.x * ring * mix(1., .22, smoothstep(4.5, 13., cam.y));      // seen from the air the layer is a thin veil: the rings read dark through it
  if(K < .0005) return 0.;
  float H = uHaze4.y, D = distance(p, cam);
  float tau = K * D * H * abs(exp(-max(p.y, 0.) / H) - exp(-max(cam.y, 0.) / H)) / max(abs(cam.y - p.y), .03);
  float n = vnoise2(p.xz * .1 + vec2(uHaze4.z * .33, -uHaze4.z * .21)) * .6 + vnoise2(p.xz * .33 - vec2(uHaze4.z * .5, uHaze4.z * .28)) * .4;
  return (1. - exp(-tau * (.4 + 1.2 * n))) * .86;
}
vec3 hazeMix(vec3 c, vec3 p, vec3 cam, vec3 sunDir){
  float a = hazeA(p, cam);
  if(a < .002) return c;
  vec3 d = p - cam; float fs = max(dot(d / max(length(d), 1e-3), sunDir), 0.); fs *= fs; fs *= fs;
  return mix(c, uHazeCol + uHazeGold * fs, a);
}`,Po=`
#include <common>
#include <fog_pars_vertex>
${Jt}
attribute vec4 aAnim; attribute vec3 aPivot; attribute float aGlow;
uniform vec3 uCamL, uNeck, uPale; uniform float uThin;
varying vec3 vColor, vN, vP, vL, vBase; varying vec4 vInfo;
void main(){
  float sc = iA.z, state = iB.x, part = aAnim.z, v;
  vec3 base, fwd; slotFrame(uClock, base, fwd, v);
  // if the clock ever leaves the route's own (a paused camera), animals step round the lens instead of through it
  vec2 dcam = base.xz - uCamL.xz; float dlen = length(dcam);
  base.xz += dcam / max(dlen, .05) * max(0., 2.8 - dlen) * step(uCamL.y, 4.4) * step(iB.x, .5);
  float cyc = cycOf(v), by = bodyOf(cyc, v), trot = smoothstep(2., 4.5, v), lie = lieOf();
  vec3 p = position, n = normal;
  if(part > .5 && part < 1.5){
    // leg: two-bone IK in the (z, y) plane from the hip to the planted (or swinging) foot
    float front = step(0., aPivot.z), Lg = aPivot.y;
    vec2 ft = footOf(cyc, aAnim.x, aAnim.w, v, front);
    // lying: forelegs folded, the knees on the snow in front of the chest and the cannons tucked back under it; hind legs
    // folded beside the belly, hocks back, feet forward. Nothing goes under the snow.
    vec2 F = vec2(mix(ft.x, front > .5 ? -.05 : .3, lie), -(Lg + by) + ft.y + lie * .05);
    float d = max(length(F), .06), st = max(1., d / (Lg * .997)), L1 = Lg * .55 * st, L2 = Lg * .45 * st;
    vec2 fh = F / d, pr = vec2(-fh.y, fh.x);
    float ca = clamp((L1 * L1 + d * d - L2 * L2) / (2. * L1 * d), -1., 1.), sa = sqrt(max(1. - ca * ca, 0.));
    vec2 K = L1 * (ca * fh + (front > .5 ? sa : -sa) * pr), u1 = K / L1, u2 = (F - K) / L2;
    float t = aAnim.y * Lg * st, k = smoothstep(L1 - .05, L1 + .05, t);
    vec2 c = t < L1 ? u1 * t : K + u2 * (t - L1);
    vec2 ub = normalize(mix(u1, u2, k) + vec2(0., -1e-4)), nb = vec2(-ub.y, ub.x);
    vec2 zy = vec2(aPivot.z, aPivot.y + by) + c + nb * (p.z - aPivot.z);
    vec2 nzy = n.z * nb - n.y * ub;
    p.z = zy.x; p.y = zy.y; n.z = nzy.x; n.y = nzy.y;
    p.x += sign(aPivot.x) * lie * (front > .5 ? .05 : .11);
  } else {
    if(part > 5.5){
      // antlers: one mesh, shaped per animal (three builds and the calf's spikes); bare bulls collapse them
      vec3 d = p - aPivot; float var = iB.y;
      vec3 s = var < .5 ? vec3(0.) : var < 1.5 ? vec3(1.) : var < 2.5 ? vec3(1.3, .86, 1.12) : var < 3.5 ? vec3(.78, 1.12, .9) : vec3(.5, .42, .5);
      if(var > 3.5) d = mix(d, vec3(d.x * .3, d.y, d.z * .3), aAnim.y);
      d *= s * (.88 + .26 * h11(iA.w * 5.)); d.z -= d.y * d.y * .14 * (h11(iA.w * 3.) - .3);
      p = aPivot + d;
    }
    if(part > 4.5 && part < 5.5){ float fl = pow(max(sin(uTime * 1.3 + iA.w * 50. + sign(aPivot.x)), 0.), 12.); p.z -= aAnim.y * .07 * fl; p.y -= aAnim.y * .03 * fl; }
    if(part > 2.5 && part < 3.5){ p.x += aAnim.y * .04 * sin(uTime * 3. + iA.w * 30.); p.y += aAnim.y * .06 * trot; }
    if(part > 1.5 && (part < 2.5 || part > 4.5)){
      // neck and head nod with the stride; standing animals look about and chew; pawing ones lower the head
      float w = aAnim.x, graze = state > 2.5 ? smoothstep(0., .6, sin(uTime * .5 + iA.w * 30.)) : 0.;
      float idle = state > .5 ? .035 * sin(uTime * .7 + iA.w * 20.) + .018 * sin(uTime * 4.4 + iA.w * 9.) * step(.5, h11(iA.w * 7.)) : 0.;
      float ang = .05 * trot * sin(cyc * 12.566 + 2.2) + .05 * (1. - trot) * step(.1, v) * sin(cyc * 6.2832) + idle + 1.0 * graze - .92 * lie + (h11(iA.w * 13.) - .5) * .16, a = w * ang;
      vec3 d = p - uNeck; float c = cos(a), s = sin(a);
      d.yz = vec2(d.y * c - d.z * s, d.z * c + d.y * s); n.yz = vec2(n.y * c - n.z * s, n.z * c + n.y * s);
      float yw = w * (state > .5 ? .5 * sin(uTime * .23 + iA.w * 60.) : .04 * sin(cyc * 6.2832 + 1.));
      d.x += d.z * yw;
      p = uNeck + d;
      if(lie > .001){
        // a lying animal carries its neck upright and its head level, above the line of the back: the head turns back down about its own joint
        vec3 hr = vec3(0., 1.12, .98) - uNeck; float ca = cos(ang), sa = sin(ang);
        vec3 hj = uNeck + vec3((hr.z * ca + hr.y * sa) * yw, hr.y * ca - hr.z * sa, hr.z * ca + hr.y * sa);
        float b = .66 * lie * (part > 4.5 ? 1. : smoothstep(.86, 1., position.z)), cb = cos(b), sb = sin(b);
        vec3 e = p - hj; e.yz = vec2(e.y * cb - e.z * sb, e.z * cb + e.y * sb); n.yz = vec2(n.y * cb - n.z * sb, n.z * cb + n.y * sb);
        p = hj + e;
      }
    }
    if(part < .5 && state > .5){ p.x *= 1. + .03 * sin(uTime * 1.9 + iA.w * 40.) * smoothstep(.5, 0., abs(p.z - .05)) + lie * mix(.44, .08, smoothstep(.56, 1., p.y)); p.y += lie * .12 * smoothstep(.95, .15, abs(p.z + .08)) * smoothstep(.78, 1.05, p.y); }      // breathing; a lying body spreads at the belly (a pear, not a log) and its back rounds
    p.y += by;
  }
  // (a straggler on the slope stands square to the ground under it: fwd follows the trail downhill)
  vec3 side = normalize(vec3(fwd.z, 0., -fwd.x)), up = cross(fwd, side);
  p *= sc * (1. + K_FAR * farOf(distance(base, uCamL)));
  vec3 lp = base + side * p.x + up * (p.y - .05) + fwd * p.z;
  vec3 ln = normalize(side * n.x + up * n.y + fwd * n.z + vec3(0., 1e-5, 0.));
  if(part > 5.5) lp += ln * clamp(distance(lp, uCamL) * uThin - .02, 0., .11) * step(.5, iB.y);
  // pale and white animals keep dark eyes, nose and hooves, greyer lower legs and a shaded belly
  float code = floor(iB.z), jit = fract(iB.z), keep = smoothstep(.018, .032, dot(color, vec3(.333)));
  float isLeg = step(.5, part) * step(part, 1.5), lowLeg = isLeg * smoothstep(.4, .85, aAnim.y);
  float under = step(part, .5) * smoothstep(.1, -.7, normal.y) * smoothstep(.8, .6, position.y);
  vec3 col = color * (.84 + .32 * jit);
  vBase = col;
  if(code > .5 && code < 1.5) col = mix(col, uPale * (.8 + .2 * jit), (.62 * aGlow + .2) * keep * (1. - .82 * lowLeg) * (1. - .5 * under));
  if(code > 2.5) col = mix(col, mix(mix(vec3(.67, .65, .61), vec3(.36, .33, .3), under * .85), mix(vec3(.46, .43, .39), vec3(.2, .18, .16), smoothstep(.2, .75, aAnim.y)), isLeg), (.5 + .46 * aGlow) * keep);
  vColor = col; vN = ln; vP = lp; vL = position; vInfo = vec4(aGlow, code, iA.w, lie);
  vec4 mvPosition = modelViewMatrix * vec4(lp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Co=`
#include <common>
#include <fog_pars_fragment>
${Mt}
${Zt}
${co}
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce, uCamL, uPale, uDriftCol, uSnow, uShade; uniform float uDrift, uTime;
varying vec3 vColor, vN, vP, vL, vBase; varying vec4 vInfo;
void main(){
  float vFur = vInfo.x, vTint = vInfo.y, vSeed = vInfo.z, lie = vInfo.w;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if(!gl_FrontFacing) N = -N;
  vec3 toCam = uCamL - vP; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
  vec3 alb = vColor;
  float near = smoothstep(45., 8., dist), close = smoothstep(26., 5., dist), white = step(2.5, vTint);
  // the white rump patch: soft-edged, breaking up onto the haunch and running a little way down the back of the thigh
  float rn = vnoise(vL * vec3(8., 6., 8.) + vSeed * 13.) - .5 + .45 * (vnoise(vL * 25. + vSeed * 5.) - .5);
  float rump = smoothstep(-.63, -.76, vL.z + rn * .1) * smoothstep(.17, .06, abs(vL.x) + rn * .08) * smoothstep(.7, .82, vL.y + rn * .1) * vFur;
  alb = mix(alb, vec3(.66, .64, .6), rump * (1. - white));
  // the face: a dark muzzle and a dark eye against the cream cheek (they stay dark on a pale or white animal)
  float muz = smoothstep(1.325, 1.365, vL.z + rn * .02) * smoothstep(1.2, 1.1, vL.y);
  float eyeD = length(vec3(abs(vL.x) - .094, vL.y - 1.15, vL.z - 1.12));
  alb = mix(alb, vec3(.022, .018, .016), max(muz, 1. - smoothstep(.022, .04, eyeD)) * step(1.02, vL.z));
  if(vTint > 1.5 && vTint < 2.5) alb = mix(alb, uPale, .9 * vFur * smoothstep(.56, .64, vnoise(vL * 3.3 + vSeed * 19.)));   // pied
  // one pale animal in three is pied the other way: brown saddle patches over the back and the haunch, the head and legs left pale
  if(vTint > .5 && vTint < 1.5 && fract(vSeed * 7.31 + .13) < .34){
    float sad = vnoise(vL * vec3(2.7, 2.3, 2.9) + vSeed * 19.) + .3 * smoothstep(.74, 1.02, vL.y) - .3 * smoothstep(.55, 1.05, vL.z) - .25 * smoothstep(.6, .3, vL.y);
    alb = mix(alb, vBase, .94 * vFur * smoothstep(.5, .57, sad));
  }
  // the coat: hair lies along the body and hangs on the throat mane and the legs; frosted guard hairs on the back
  float hang = max(smoothstep(.42, .56, vL.z) * smoothstep(1.02, .88, vL.y), smoothstep(.6, .48, vL.y));
  vec3 fq = vL * mix(vec3(64., 26., 9.), vec3(58., 7., 46.), hang) + vSeed * 31.;
  float fur = vnoise(fq), fur2 = vnoise(fq * 2.6 + 9.);
  alb *= 1. + vFur * near * ((fur - .5) * .44 + (fur2 - .5) * .34 * close);
  alb = mix(alb, alb * 1.4 + .02, vFur * .3 * close * smoothstep(.25, .8, N.y) * smoothstep(.42, .62, fur2));
  // keep the winter coat dark against snow from a distance (ruff and rump stay pale); beside the lens it is grey-brown and takes light
  alb *= mix(mix(.55, 1., smoothstep(.1, .42, dot(alb, vec3(.333)))), 1., max(.5 * close, .8 * smoothstep(85., 30., dist)));
  float lowS = 1. - smoothstep(.1, .24, uSunDir.y);                 // the last sun: coats stay brown, never black
  alb = mix(alb, alb * 1.5 + .012, max(.6 * lie, .45 * lowS * close));
  float ndl = dot(N, uSunDir), dif = max(ndl, 0.) * .78 + .22 * max(ndl * .6 + .4, 0.);
  float ao = mix(.5, 1., smoothstep(.2, .95, vL.y)) * (1. - .1 * lie * smoothstep(.75, .45, vL.y));
  vec3 c = alb * (mix(uBounce * (1. + .9 * smoothstep(90., 20., dist)), uSkyCol * (1. + .4 * close), N.y * .5 + .5) * ao * (1. + .35 * smoothstep(90., 20., dist)) + uSunCol * dif * mix(.38, .54, close));
  // a pale coat is lit like the snow it stands on: cream where the sun reaches it, the blue of the snow's shade where it does
  // not, darker under the belly; so a white animal has a lit side and a shade side and is not a flat cut-out
  // (round 6: no wrapped sunlight on the shade side, a lit side no brighter than sunlit snow, the belly and the inner legs darker,
  // a warm rim where the sun grazes the coat: the form reads in full sun)
  float paleK = smoothstep(.3, .6, dot(alb, vec3(.333))) * vFur, pUnder = smoothstep(.15, -.65, N.y);
  c = mix(c, alb * ((uShade * 1.02 + uBounce * .85) * ao * (.74 + .26 * N.y) * (1. - .34 * pUnder) + uSunCol * max(ndl, 0.) * .45), paleK * .88);
  c += uSunCol * vec3(1., .74, .5) * paleK * .16 * pow(1. - max(dot(N, V), 0.), 2.) * smoothstep(-.15, .45, ndl) * (.4 + .6 * near);
  float fr = pow(1. - max(dot(N, V), 0.), 3.);
  c += (uSkyCol * .3 + uSunCol * (.2 + alb) * smoothstep(-.1, .9, dot(-V, uSunDir))) * fr * (.12 + .3 * vFur) * (.3 + .7 * near) * (1. + .7 * close);   // fur halo, gold when backlit
  c += (uSunCol * .55 + uSkyCol * .5) * (.05 + alb) * (lie * .7 + lowS * .5) * near * vFur * smoothstep(.3, .9, N.y);      // light along the back of a resting animal
  vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
  c += uSunCol * vFur * close * .035 * pow(max(dot(N, H), 0.), 9.) * (.5 + fur2) + uSkyCol * vFur * close * .05 * smoothstep(.35, .95, N.y);   // sheen: gold on the sun side, sky on the back
  // rime on the back of an animal that has been lying in the snow
  float kk = clamp(ndl / max(uSunDir.y, .07), 0., 1.6);
  c = mix(c, mix(uShade, uSnow * (.3 + .44 * kk), smoothstep(0., .5, kk)), lie * .42 * smoothstep(.45, .9, N.y) * smoothstep(.3, .75, vnoise(vL * vec3(23., 23., 12.) + vSeed * 7.)) * vFur);
  // from far off: dark bodies, pale ruff and rump dots, the more so the farther the animal is (the one rule of distance, FAR_GLSL)
  float farK = K_FAR * farOf(dist);
  c *= mix(1., mix(.5 - .2 * farK, 1.2 + .7 * farK, smoothstep(.1, .3, dot(alb, vec3(.333)))), smoothstep(75., 200., dist));
  if(uDrift > 0.){ float dn = vnoise(vec3(vP.xz * .35 - vec2(uTime * 2.4, 0.), uTime * .3)); c = mix(c, uDriftCol * (.9 + .25 * dn), min(1., uDrift * 1.25) * smoothstep(.56, .1, vP.y - .2 * dn) * (.65 + .35 * dn) * (.4 + .6 * smoothstep(45., 75., length(vP.xz)))); }
  c = hazeMix(c, vP, uCamL, uSunDir);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,ho=`
vec2 cwarp(vec2 p){ return ${Kt.toFixed(2)} * (vec2(vnoise2(p * .13 + 3.7), vnoise2(p * .13 + 41.3)) - .5); }
float craterH(vec2 p, out float rel){
  vec2 pr = vec2(${ft[0]} * p.x - ${ft[1]} * p.y, ${ft[1]} * p.x + ${ft[0]} * p.y);
  vec2 cp = pr / 4.2, ci = floor(cp);
  float cR = mix(.45, 1.1, hash2(ci + 3.1)), jit = 2. * max(0., .48 - .38 * cR);
  vec2 cj = ci + .5 + (vec2(hash2(ci), hash2(ci + 7.3)) - .5) * jit, cd = (cp - cj) * 4.2;
  float rc = length(cj) * 4.2;
  rel = 9.;
  if(hash2(ci + 9.7) < .2 || vnoise2(ci * .31 + 17.) < .565 || rc > 56.5 || rc < 15.5) return 0.;
  rel = length(cd) / cR;
  float lump = vnoise2(p * 4.7 + 13.), x = rel - 1.1;
  return -.3 * (1. - smoothstep(.52, .95, rel)) * (.45 + .6 * cR) + (.04 + .08 * lump) * (.6 + .5 * cR) * exp(-x * x * 14.);
}`,Ht=`
vec2 capD(vec3 ro, vec3 rd, vec3 a, vec3 b){
  vec3 ba = b - a, oa = ro - a;
  float baba = dot(ba, ba), bard = dot(ba, rd), baoa = dot(ba, oa), rdoa = dot(rd, oa);
  float s = clamp((baoa - bard * rdoa) / max(baba - bard * bard, 1e-4), 0., 1.);
  vec3 c = a + ba * s; float t = max(dot(c - ro, rd), 0.);
  return vec2(length(ro + rd * t - c), t);
}`,Fo=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogK = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    float fogK = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  float fogK = 0.;
#endif`,_o=`
#include <fog_pars_vertex>
${Jt}
uniform vec3 uSunDir, uCamS; uniform float uShLen;
varying vec3 vQ, vSunA; varying vec4 vFz, vFy, vInfo; varying vec2 vUv, vW;
void main(){
  vec3 base, fwd; float v; slotFrame(uClock, base, fwd, v); vUv = position.xy;
  float sc = iA.z * (1. + K_FAR * farOf(distance(base, uCamS))), cyc = cycOf(v), lie = lieOf();
  vec2 sh = -normalize(uSunDir.xz + vec2(1e-5, 0.)), pb = vec2(-sh.y, sh.x);
  float tall = (iB.y < .5 ? 1.3 : iB.y > 3.5 ? 1.5 : 2.1) * (1. - .5 * lie);
  float len = tall * sc * uShLen + 1.3;
  vec2 g = base.xz + sh * mix(-1.5, len, position.x) + pb * position.y * 1.75 * sc;
  // (the card lies on the ground under the animal: the lake, or for a straggler the slope, by its gradient gGrad)
  vec3 lp = vec3(g.x, base.y + dot(gGrad, g - base.xz) + .03, g.y), side = normalize(vec3(fwd.z, 0., -fwd.x)), up = cross(fwd, side), rel = lp - base; vW = g;
  vQ = vec3(dot(rel, side), dot(rel, up) + .02, dot(rel, fwd)) / sc;
  vSunA = vec3(dot(uSunDir, side), dot(uSunDir, up), dot(uSunDir, fwd));
  vec2 f0 = footOf(cyc, 0., .25, v, 1.), f1 = footOf(cyc, .5, .75, v, 1.), f2 = footOf(cyc, .5, 0., v, 0.), f3 = footOf(cyc, 0., .5, v, 0.);
  vFz = vec4(f0.x, f1.x, f2.x + lie * .22, f3.x + lie * .22); vFy = vec4(f0.y, f1.y, f2.y, f3.y);
  vInfo = vec4(bodyOf(cyc, v), iB.y, lie, sc);
  vec4 mvPosition = modelViewMatrix * vec4(lp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ro=`
#include <fog_pars_fragment>
${Mt}
${ho}
${Ht}
${Zt}
uniform vec3 uShCol, uCamS; uniform float uShStr;
varying vec3 vQ, vSunA; varying vec4 vFz, vFy, vInfo; varying vec2 vUv, vW;
float k = 0., px = 0., pt = 0.;
vec3 ro, rd;
void cap(vec3 a, vec3 b, float r){ vec2 d = capD(ro, rd, a, b); float soft = .02 + .011 * d.y + px; k = max(k, (1. - smoothstep(r - soft, r + soft, d.x)) * min(1., 1.6 * r / (r + soft))); }
// legs, neck and antlers: once a pixel covers more ground than the member is wide it keeps three quarters of a pixel and most of its strength,
// so every shadow stays joined to its hooves and keeps an animal's outline
void capT(vec3 a, vec3 b, float r){ vec2 d = capD(ro, rd, a, b); float rr = max(r, .75 * pt), soft = .012 + .006 * d.y + .55 * pt; k = max(k, (1. - smoothstep(rr - soft, rr + soft, d.x)) * max(.62, min(1., 1.6 * r / (r + soft)))); }
void main(){
  ro = vQ; rd = normalize(vSunA); px = min(.7 * length(fwidth(vQ.xz)), .5);
  float pf = min(1.2 * min(length(dFdx(vQ.xz)), length(dFdy(vQ.xz))), .5);
  pt = min(.5 * (px + pf), .22);
  float by = vInfo.x, var = vInfo.y;
  cap(vec3(0., .87 + by, -.58), vec3(0., .85 + by, .42), .265);
  capT(vec3(0., .98 + by, .5), vec3(0., 1.1 + by, 1.24), .115);
  capT(vec3(-.125, .8 + by, .4), vec3(-.125, vFy.x, .4 + vFz.x), .05);
  capT(vec3(.125, .8 + by, .4), vec3(.125, vFy.y, .4 + vFz.y), .05);
  capT(vec3(-.13, .84 + by, -.5), vec3(-.13, vFy.z, -.5 + vFz.z), .055);
  capT(vec3(.13, .84 + by, -.5), vec3(.13, vFy.w, -.5 + vFz.w), .055);
  if(var > .5){
    float s = var > 3.5 ? .45 : 1.; vec3 b0 = vec3(.06, 1.2 + by, .93);
    vec3 m = vec3(.3, .48, -.23) * s, e = vec3(.34, .78, .04) * s, f = vec3(.2, .4, .13) * s;
    capT(b0, b0 + m, .04); capT(b0 + m, b0 + e, .04); capT(b0 + m * .35, b0 + f, .03);
    b0.x = -b0.x; m.x = -m.x; e.x = -e.x; f.x = -f.x;
    capT(b0, b0 + m, .04); capT(b0 + m, b0 + e, .04); capT(b0 + m * .35, b0 + f, .03);
  }
  // far away the capsules fall below a pixel: carry the shadow as one soft stroke
  k = max(k, smoothstep(.12, .4, pf) * smoothstep(.1, .17, vUv.x) * smoothstep(.92, .7, vUv.x) * smoothstep(.36 + .4 * pf, .16, abs(vUv.y)));
  ${Fo}
  k *= uShStr * (1. - fogK) * smoothstep(1., .55, abs(vUv.y)) * smoothstep(0., .04, vUv.x) * smoothstep(1., .9, vUv.x);
  // a shadow crossing a pawed bowl: the dark floor is not snow, leave it be
  if(k > .01 && dot(vW, vW) < 3500.){ float rel; craterH(vW + cwarp(vW), rel); k *= mix(.2, 1., smoothstep(.5, .85, rel)); }
  k *= 1. - hazeA(vec3(vW.x, .03, vW.y), uCamS);
  if(k < .004) discard;
  // blended toward the colour of shaded snow: where shadows overlap, or fall on the printed arms, the blue stays this blue
  gl_FragColor = vec4(uShCol, k);
  #include <fog_fragment>
}`,Ho=`
float sasH(vec2 w, vec2 cell, float seed){
  vec2 g = w / cell; float row = floor(g.y); g.x += hash2(vec2(row, seed)) * 7.3;
  vec2 gi = vec2(floor(g.x), row), f = g - gi;
  float h1 = hash2(gi + seed), h2 = hash2(gi + seed + 3.7), h3 = hash2(gi + seed + 9.1);
  float u = f.x / (.62 + .38 * h2), v = (f.y - .5 - (h1 - .5) * .2) * 2., wd = (.5 + .36 * h1) * (.5 + .5 * smoothstep(0., .45, u));
  // they stand in fields, with smooth snow between the fields
  float on = step(h3, .15 + .7 * vnoise2(gi * .13 + seed));
  return on * cell.y * smoothstep(0., .09, u) * (1. - .5 * u) * (1. - smoothstep(.78, 1., u)) * (1. - smoothstep(wd * .3, wd, abs(v)));
}
// the trails: each a trench some two and a half metres wide trodden by animals in file, two strands that part and join
float trailH(vec2 q, float fw){
  float h = 0., wd = max(1.25, fw * .8);
  if(q.x > 118. && q.x < 345.){
    vec2 p = q - vec2(331., -8.);
    for(int i = 0; i < 5; i++){
      float fi = float(i), ez = -104. + 41. * fi; vec2 E = vec2(sqrt(43260. - ez * ez) - 331., ez + 8.); float len = length(E); vec2 d = E / len;
      float s = dot(p, d), l = p.x * d.y - p.y * d.x;
      l += (4.2 * sin(s * .043 + fi * 2.1) + 1.3 * sin(s * .127 + fi * 5.)) * smoothstep(0., 34., s);
      float l2 = l - 2.2 - 2.4 * sin(s * .061 + fi * 3.3);
      float m = max(1. - smoothstep(wd * .55, wd, abs(l)), 1. - smoothstep(wd * .4, wd * .75, abs(l2)));
      h = max(h, m * smoothstep(-3., 5., s) * (1. - smoothstep(len + 30., len + 62., s)));
    }
  }
  return -.15 * h * min(1., 1.6 / wd) * (.5 + .5 * vnoise2(q * 3.1));
}
// k = how much of the large, the middle and the small sastrugi is still resolved
float groundH(vec2 q, vec3 k, float fw){
  vec2 w = vec2(q.x * .669 + q.y * .743, q.y * .669 - q.x * .743);
  w.y += 1.7 * sin(w.x * .045 + 1.7 * sin(w.y * .031));
  float h = sasH(w + 5., vec2(15., 7.), 9.) * .06 * k.x + trailH(q, fw);
  if(k.y > .001) h += sasH(w, vec2(5.2, 2.6), 1.) * .11 * k.y;
  if(k.z > .001) h += sasH(w + 13., vec2(1.9, .95), 5.) * .1 * k.z;
  return h;
}
// xy = the slope of the ground, z = the shadow a ridge on the sun side throws on this point
vec3 groundRelief(vec2 q, vec2 sunXZ, float tanEl, float fw, float nearK){
  vec3 k = vec3(1. - smoothstep(1.4, 4., fw), 1. - smoothstep(.5, 1.5, fw), nearK * (1. - smoothstep(.2, .6, fw)));
  float e = max(.1, fw * .7), h0 = groundH(q, k, fw);
  vec2 g = vec2(groundH(q + vec2(e, 0.), k, fw) - h0, groundH(q + vec2(0., e), k, fw) - h0) / e;
  float sh = 0.;
  for(int i = 0; i < 4; i++){
    float fi = float(i), t = .35 + .5 * fi * (1. + .45 * fi);
    sh = max(sh, smoothstep(0., .05, groundH(q + sunXZ * t, k, fw) - h0 - t * tanEl));
  }
  return vec3(g, sh);
}
// heath tussocks standing out of the snow: x = the tuft, y = its short shadow on the snow beyond it; dens = share of cells that hold one
vec2 tussock(vec2 q, vec2 sunXZ, float cs, float dens){
  vec2 g = q / cs, gi = floor(g), f = g - gi;
  float h1 = hash2(gi + 21.3), h2 = hash2(gi + 47.1), rad = .12 + .08 * h2;
  vec2 lat = vec2(-sunXZ.y, sunXZ.x), d = f - (vec2(.5) + sunXZ * (.2 + .12 * (h1 - .5)) + lat * (.2 * (hash2(gi + 5.5) - .5)));
  float tuft = 1. - smoothstep(rad * .55, rad, length(d) + (vnoise2(q * 6. / cs) - .5) * .09);
  vec2 ds = d + sunXZ * (rad * 1.3);
  float shd = 1. - smoothstep(.65, 1., length(vec2(dot(ds, lat) / (rad * .85), dot(ds, sunXZ) / (rad * 1.5))));
  return vec2(tuft, shd * (1. - tuft)) * step(hash2(gi + 77.7), dens);
}
`,No={from:.033,to:1,weight:.88,fade:.0735},Go=`
#include <fog_pars_vertex>
varying vec3 vP;
void main(){ vP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Oo=`
#include <fog_pars_fragment>
${Mt}
${Ht}
${Zt}
${Ho}
uniform vec3 uSunDir, uGold, uCamL, uSnow, uWarm, uShade, uHeath, uLichen, uB1, uB2;
uniform float uClock, uTime, uArms, uPeriod, uArmPhase, uWet, uDrift, uBoulder, uGlint;
varying vec3 vP;
float speedOf(float r){ return 1.4 + 4.6 * smoothstep(64., 92., r) + 5. * smoothstep(92., 165., r); }
${ho}
// wind crust (low plates) and hoof pocks; dens = share of cells holding a print
float detailH(vec2 p, float dens){
  float h = .45 * smoothstep(.36, .64, vnoise2(p * 1.9 + 3.)) + .3 * smoothstep(.34, .66, vnoise2(p * 5.3 + 11.)) + .15 * vnoise2(p * 17.);
  vec2 g = p * 2.3, gi = floor(g), gc = gi + .5 + (vec2(hash2(gi + 1.7), hash2(gi + 5.9)) - .5) * .55;
  float sz = .55 + .75 * hash2(gi + 8.1);
  float pk = step(hash2(gi + 2.3), dens) * smoothstep(.26 * sz, .03 * sz, length((g - gc) * vec2(1., .7 + .6 * hash2(gi + 4.4))));      // a print is a soft dimple, shaded, seldom deep enough to hold its own shadow
  return h * .024 - pk * .036;
}
// the floor of the trampled ring under the lens (height in metres): a trench of churned snow (clods, crumbs, slabs of crust
// left standing) and over it the prints of the last animals through, in lines along the rings, a print every stride
float churnH(vec2 p){
  float r = length(p);
  float lump = vnoise2(p * 2.3 + 7.) * .5 + vnoise2(p * 5.7 + 3.) * .32 + vnoise2(p * 13.1 + 9.) * .18;
  float slab = smoothstep(.52, .6, vnoise2(p * .8 + 31.) + .25 * (vnoise2(p * 3.9 + 5.) - .5));
  float ln = floor(r * 1.7), rl = (ln + .5) / 1.7, arc = atan(p.y, -p.x) * rl * 1.55 + hash2(vec2(ln, 3.)) * 9.;      // (the seam lies due east, where the lens never comes low)
  float st = floor(arc); vec2 jit = vec2(hash2(vec2(ln, st)), hash2(vec2(st, ln + 7.))) - .5;
  vec2 d = vec2((r - rl) - jit.x * .26, (fract(arc) - .5 - jit.y * .4) / 1.55);
  float pr = step(.3, hash2(vec2(ln + 11., st))) * (1. - smoothstep(.05, .125, length(d * vec2(1.3, 1.))));
  return .05 * (lump - .5) * (1. - .6 * slab) + .022 * slab - .06 * pr;
}
void main(){
  vec2 q0 = vP.xz, q = q0; float dist = distance(uCamL, vP), r0 = length(q0);
  vec3 V = (uCamL - vP) / max(dist, 1e-3);
  vec2 sunXZ = normalize(uSunDir.xz + vec2(1e-5, 0.));
  float lowSun = clamp(uSunDir.y * 3.4, .35, 1.), tanEl = uSunDir.y / max(length(uSunDir.xz), .05);
  // ---- the eye floor is a height field: march the line of sight into it, so bowls have depth and lips hide what is behind them
  float eyeK = smoothstep(63., 58., r0), hgt = 0., rel = 9., crSh = 0., tmp; vec2 cgrad = vec2(0.);
  if(eyeK > 0.){
    vec2 cw = cwarp(q0);
    float K = smoothstep(70., 35., dist) * smoothstep(.05, .2, V.y);
    if(K > .01){
      vec2 dv = V.xz / max(V.y, .05) * K;
      float hPrev = .17, dPrev = .1, hHit = -.36;
      for(int i = 0; i < 7; i++){
        float hh = .17 - .53 * float(i + 1) / 7., d = hh - craterH(q0 + cw + dv * hh, tmp);
        if(d <= 0.){ hHit = mix(hh, hPrev, clamp(d / min(d - dPrev, -1e-4), 0., 1.)); break; }
        hPrev = hh; dPrev = d;
      }
      q = q0 + dv * hHit;
    }
    hgt = craterH(q + cw, rel);
    cgrad = vec2(craterH(q + cw + vec2(.05, 0.), tmp) - hgt, craterH(q + cw + vec2(0., .05), tmp) - hgt) / .05;
    for(int i = 0; i < 4; i++){
      float t = .14 * float(i + 1) * (1. + .5 * float(i));
      crSh = max(crSh, smoothstep(0., .04, craterH(q + cw + sunXZ * t, tmp) - (hgt + t * tanEl)));
    }
  }
  float r = length(q), fwr = fwidth(r0);
  // broad soft drifts; flattened where hooves have packed the snow, calm in the eye
  float tr = smoothstep(59., 67., r) * smoothstep(215., 203., r), eyeM = smoothstep(63., 57., r);
  vec2 sq = q * vec2(.07, .13); float e = .3;
  float h0 = fbm2(sq), hx = fbm2(sq + vec2(e * .07, 0.)), hz = fbm2(sq + vec2(0., e * .13));
  float relief = mix(mix(.75, .8, eyeM), .32, tr) * lowSun;
  vec3 n = vec3(-(hx - h0) / e * relief, 1., -(hz - h0) / e * relief);
  // the arms as they stand now (printed on the snow further down): fresh churn under the animals, clean packed lanes between
  float ang = atan(-q.y, abs(q.x) < 1e-4 ? 1e-4 : q.x), om = speedOf(max(r, 1.)) / max(r, 1.);
  float a = fract((ang - om * (uClock - ${je}.) + uArmPhase) * uArms / 6.28318 + r / uPeriod);
  float arm = max(smoothstep(0., .08, a) * smoothstep(.54, .45, a) * smoothstep(77., 82., r), smoothstep(81., 76., r)) * tr;
  // outside the trampled ring: sastrugi with their short shadows, and the trails down from the col. On the eastern side, where
  // the lens comes down off the slope, the wind has carved the snow again between the outer arms, and the trails run on to them
  float eastK = smoothstep(128., 150., r) * smoothstep(88., 128., q0.x) * (1. - smoothstep(.02, .5, arm));
  float fwq = length(fwidth(q0)) * .7, gK = max(1. - tr, .9 * eastK) * (1. - eyeM) * (1. - smoothstep(3., 6., fwq)), gSh = 0., gTr = 0.;
  if(gK > .001){
    vec3 gr = groundRelief(q0, sunXZ, tanEl, fwq, smoothstep(70., 12., dist));
    n.xz -= gr.xy * gK * (.55 + .45 * lowSun); gSh = gr.z * gK;
    gTr = clamp(-trailH(q0, fwq) * 9., 0., 1.) * gK;
  }
  if(eyeM > .001){      // small sharp drifts in the eye: short blue streaks, not long smears
    vec2 s2 = q * vec2(.22, .5) + 31.; float a0 = fbm2(s2), ax = fbm2(s2 + vec2(.03, 0.)), az = fbm2(s2 + vec2(0., .1));
    n.xz -= vec2(ax - a0, az - a0) / .2 * .7 * eyeM * lowSun * smoothstep(75., 18., dist);
  }
  n.xz -= cgrad;
  // near detail everywhere the lens comes low: crust plates, hoof pocks
  float nearD = smoothstep(42., 7., dist) * lowSun, pockM = 0.;
  if(nearD > .001){
    float dens = mix(.14 + .3 * smoothstep(.4, .65, vnoise2(q * .31 + 5.)), .3 + .4 * smoothstep(.3, .7, vnoise2(q * .45 + 9.)), tr), ee = clamp(dist * .004, .015, .12);
    float d0 = detailH(q, dens), dx = detailH(q + vec2(ee, 0.), dens), dz = detailH(q + vec2(0., ee), dens);
    n.xz -= vec2(dx - d0, dz - d0) / ee * nearD * (1. - .6 * smoothstep(.5, .3, rel));
    pockM = smoothstep(-.004, -.022, d0) * nearD;
  }
  n = normalize(n);
  // under the lens in the trampled ring: ruts worn along the rings and clods of churned snow, raked by the low sun
  float nearT = tr * smoothstep(55., 6., dist) * lowSun, clodT = smoothstep(24., 4., dist);
  if(nearT > .001){
    vec2 rdir = q / max(r, 1.);
    n = normalize(n + vec3(rdir.x, 0., rdir.y) * sin((r - ${Le}.) * ${(pe/xe).toFixed(4)} + 2.2 * vnoise2(q * .23 + 61.)) * .04 * smoothstep(.25, .7, vnoise2(q * .17 + 7.)) * nearT * (1. - smoothstep(.5, 1.5, fwr))
      + vec3(vnoise2(q * 6.3 + 3.) - .5, 0., vnoise2(q * 6.3 + 17.) - .5) * .22 * nearT * clodT);
  }
  float chK = tr * smoothstep(27., 8., dist), chLow = 0., chHi = 0.;
  if(chK > .001){
    float ee = clamp(dist * .006, .02, .16), c0 = churnH(q), cx1 = churnH(q + vec2(ee, 0.)), cz1 = churnH(q + vec2(0., ee));
    n = normalize(n - vec3(cx1 - c0, 0., cz1 - c0) / ee * chK * lowSun);
    chLow = smoothstep(-.012, -.045, c0) * chK; chHi = smoothstep(.008, .03, c0) * chK;
  }
  float near = smoothstep(70., 8., dist);
  float churn = vnoise2(q * 1.7) * .6 + vnoise2(q * 5.9) * .4 * near;
  float groove = (.5 + .5 * cos((r - ${Le}.) * ${(pe/xe).toFixed(4)})) * (1. - smoothstep(.5, 1.5, fwr));
  // what the pawing reaches: lichen cushions and heath on the bowl floors; the scoured islet round the erratic
  float floorM = 1. - smoothstep(.56, .74, rel + (vnoise2(q * 9.) - .5) * .25);
  float patchy = fbm2(q * .23 + 3.), islet = smoothstep(19., 11., r + (patchy - .5) * 10.) * uBoulder;
  float isletB = islet * smoothstep(.55, .6, fbm2(q * .9) + (vnoise2(q * 6.) - .5) * .16) * .8;
  float bare = max(max(floorM, isletB), uWet * tr * (1. - arm) * smoothstep(.5, .7, patchy));
  float cush = smoothstep(.5, .62, vnoise2(q * 5.1 + 40.) * .7 + vnoise2(q * 13. + 3.) * .3);
  vec3 soil = mix(uHeath * (.6 + .8 * vnoise2(q * 17.)), uLichen * (.85 + .4 * vnoise2(q * 23. + 9.)), cush);
  soil = mix(soil, uSnow * .8, smoothstep(.62, .75, vnoise2(q * 11. + 70.)) * .6 * floorM);             // crumbs of snow fallen in
  // light
  float ndl = dot(n, uSunDir), kk = clamp(ndl / max(uSunDir.y, .07), 0., 2.);
  vec3 alb = mix(uSnow, uWarm, .55 * smoothstep(1.15, 2., kk));
  alb *= 1. - tr * (.05 + .09 * arm + .1 * churn * (.4 + .6 * arm) + .02 * groove) - uWet * .12;
  // the arms printed on the snow: with distance the print goes toward the mean of the bodies with their shadows and the lit
  // snow between them (half and half at most), never to the tone of the bodies, so that arm and lane stay apart from far off
  alb = mix(alb, uShade * 1.5, min(.5, arm * (mix(.2, .36, smoothstep(14., 60., dist)) + .1 * churn) * (1. + 1.2 * smoothstep(50., 280., dist))));
  float pock = smoothstep(.62, .72, vnoise2(q * 9.5 + 17.) * .65 + vnoise2(q * 21. + 3.) * .35) * smoothstep(30., 5., dist) * tr;
  alb = mix(alb, uShade * 1.9, max(pock * .2, pockM * .22));
  alb = mix(alb, uShade * 1.75, chLow * .42) * (1. + .14 * chHi);          // blue prints and troughs, sunlit crumbs
  alb = mix(alb, uShade * 1.8, gTr * .42);
  float flow = vnoise2(q * vec2(.03, .24) + vec2(-uTime * 1.1, uTime * .05));
  alb *= 1. + (1. - tr) * (1. - eyeM) * .1 * smoothstep(.55, .9, flow);
  vec3 lit = alb * (.30 + .44 * pow(max(kk, 1e-3), .7));
  vec3 soilLit = soil * uSnow * 1.25 * (.3 + .7 * min(kk, 1.3));
  lit = mix(lit, soilLit, bare * .9);
  vec3 shade = mix(uShade, uShade * (soil * 1.6 + .4), bare * .9);
  float sh = 0.;
  if(uBoulder > .5 && r < 90.){
    vec2 d1 = capD(vP, uSunDir, uB1 + vec3(0., 1.5, 0.), uB1 + vec3(0., 8.4, 0.)), d2 = capD(vP, uSunDir, uB2 + vec3(0., 1.5, 0.), uB2 + vec3(0., 6.2, 0.));
    float n1 = (fbm2(q * .35) - .5) * 1.6;
    sh = max(1. - smoothstep(4.4, 5.2 + d1.y * .03, d1.x + n1), 1. - smoothstep(4.2, 5.0 + d2.y * .03, d2.x - n1));
  }
  vec3 c = mix(shade, lit, smoothstep(-.3, .62, kk) * (1. - sh * .96) * (1. - crSh * .94) * (1. - gSh * .9));
  // sparkle: fixed grains that flash as the view turns
  vec2 gi = floor(q * 27.); float gh = hash2(gi);
  float gl = step(.985, gh) * pow(max(sin(gh * 911. + dot(V.xz, vec2(31., 23.)) + V.y * 47.), 0.), 24.) * smoothstep(34., 5., dist) * (1. - sh) * (1. - bare) * (1. - crSh);
  c += uGold * gl * uGlint;
  if(uDrift > 0.){
    // ground blizzard: the snow surface is seen through a flowing layer; bright ribbons stream downwind over a bluer ground
    vec2 w = q0 * vec2(.036, .58) + vec2(-uTime * .7, uTime * .03);
    float a1 = vnoise2(w), a2 = vnoise2(w * vec2(2.3, 2.9) + vec2(-uTime * 1.4, 7.)), a3 = vnoise2(w * vec2(5.1, 9.) + vec2(-uTime * 2.6, 3.));
    float rib = smoothstep(.53, .7, a1 * .55 + a2 * .4 + a3 * .22 * smoothstep(90., 10., dist));
    float fs = pow(max(dot(-V.xz / max(length(V.xz), 1e-3), sunXZ), 0.), 2.);
    float nearB = smoothstep(260., 40., dist);       // from the air the flowing layer thins, so the spiral still reads through it
    c = mix(c, uShade * 1.2 + uSnow * .1, uDrift * (.36 + .26 * nearB));
    c = mix(c, uSnow * .86 + uGold * (.06 + .24 * fs), min(1., uDrift * 1.15) * rib * (.45 + .55 * nearB));
  }
  c = hazeMix(c, vP, uCamL, uSunDir);
  gl_FragColor = vec4(c, 1. - smoothstep(300., 338., r0));
  #include <fog_fragment>
}`,Vo=`
#include <fog_pars_vertex>
${Jt}
attribute vec4 iS;
uniform vec3 uCamL, uCamR, uCamU, uSunDir, uGold, uPuffLit, uPuffShade; uniform float uHaze; uniform vec4 uNear;
varying vec2 vUv; varying vec4 vCol, vLd; varying float vSeed, vFs;
void main(){
  float type = iS.x, sc = iA.z, v, size, alpha, nearA, nearB, wide = 1.; vec3 base, fwd, pos;
  if(type < 1.5){
    slotFrame(uClock, base, fwd, v);
    float run = step(.5, v), period = run > .5 ? strideOf(v) * sc / max(v, .1) : 3.4, m = (type < .5 && run > .5) ? 3. : 1.;
    float cyc = run > .5 ? cycOf(v) : uTime / period + iA.w * 17.;
    float f = fract(cyc / m + iS.y), age = f * m * period;
    // (the breath of the young animals' file, iS.z > 1.2, is dragged along in each one's wake: a plume, not a string of puffs)
    slotFrame(uClock - age * run * (type < .5 && iS.z > 1.2 ? .2 : 1.), base, fwd, v);
    vec3 side = normalize(vec3(fwd.z, 0., -fwd.x));
    if(type < .5){
      float lie = lieOf();
      // a jet ahead of the muzzle, no larger than the head; a runner leaves it behind, so it lifts clear of the back as it goes
      pos = base + fwd * (1.52 * sc) + vec3(0., (.98 - .34 * lie) * sc, 0.);
      pos += fwd * (.5 * (1. - exp(-4. * age))) + vec3(.5 * age, .08 + (run > .5 ? 1.5 : .4) * age, 0.) + side * ((iS.w - .5) * (.34 + .5 * age));
      size = sc * iS.z * (.08 + (run > .5 ? .27 : .3) * pow(min(age, .8), .7));
      alpha = smoothstep(0., .06, f) * pow(1. - f, 1.6) * (run > .5 ? .5 : .3) * (.55 + .45 * iS.z);
      if(iS.z > 1.2){
        // the young animals' file: a plume no larger than the head, let out on the sun side of the muzzle and trailing back and up
        // over the neck, so that head, eye and muzzle stay dark and sharp against the glow
        float sg = dot(side, uSunDir) > 0. ? 1. : -1.;
        pos = base + fwd * (1.5 * sc - .45 * age) + vec3(0., 1.02 * sc + .05 + .78 * age, 0.) + side * (sg * (.22 + .3 * age) + (iS.w - .5) * .16);
        size = sc * (.075 + .2 * pow(min(age, .8), .7));
        alpha = smoothstep(0., .05, f) * smoothstep(.95, .3, f) * .5;
      }
    } else {
      float tk = smoothstep(1.2, 9., v);
      pos = base + fwd * ((iS.y < .25 ? .55 : -.45) * sc - .7 * age * (.4 + tk)) + side * ((iS.w - .5) * (.5 + age));
      // powder stays below the belly line
      pos.y = base.y + .06 + (2.2 * age - 3.4 * age * age) * (.25 + .5 * iS.w) * (.4 + tk);
      pos.x += .5 * age;
      size = sc * (.15 + .68 * age) * (.5 + .6 * tk); wide = 1.7;
      alpha = smoothstep(0., .1, f) * (1. - f) * .6 * tk * run * (1. + .3 * smoothstep(9., 4., uCamL.y));
    }
    nearA = .9; nearB = 2.6;
  } else if(type > 3.5){
    // steam round the erratic: the breath of the animals of the eye hangs in the calm air before the cleft, and where the
    // rock stands in the sun it curls up the lit faces. iA.xyz = where a billow starts, iB = (how far it rises, drift x, drift z, seconds)
    float f = fract(uTime / iB.w + iS.y);
    pos = iA.xyz + vec3(iB.y * f, iB.x * pow(f, .8), iB.z * f);
    size = iS.z * (.8 + .9 * f);
    alpha = min(uHaze, 1.5) * .15 * smoothstep(0., .25, f) * smoothstep(1., .4, f);
    nearA = 4.; nearB = 12.;
  } else if(type > 2.5){
    // the knee-high haze of kicked-up snow that rolls round with the herd: low wide billows, gold against the sun
    float r = iA.x, f = fract(uTime / 11. + iA.w), th = iA.y + .5 * speedOf(r) / r * uClock;
    pos = vec3(r * cos(th) + 3. * f, .2 + .3 * f, -r * sin(th));
    size = iA.z * (.8 + .3 * f); wide = 4.6;
    alpha = uHaze * iS.z * smoothstep(0., .25, f) * smoothstep(1., .5, f) * mix(1., .35, smoothstep(4.5, 13., uCamL.y));
    nearA = 5.; nearB = 16.;
  } else {
    float r = iA.x, f = fract(uTime / 30. + iA.w), th = iA.y + .55 * speedOf(r) / r * uClock * (1. - iB.x);      // iB.x = 1: the standing curtain on the sun side
    pos = vec3(r * cos(th) + 24. * f, 2. + mix(25., 12., iB.x) * pow(f, .8), -r * sin(th));
    size = iA.z * (.65 + .7 * f);
    alpha = uHaze * iS.z * smoothstep(0., .2, f) * smoothstep(1., .55, f);
    nearA = 16.; nearB = 55.;
  }
  vec3 toP = pos - uCamL; float dist = length(toP); vec3 vd = toP / max(dist, 1e-3);
  alpha *= smoothstep(nearA, nearB, dist) * (type > 1.5 ? 1. : mix(1., .55, smoothstep(22., 75., dist)));
  // the sprites dealt to the animals beside the lens come in with nearness (iB.w = 1: the second half of them, which come in nearer still)
  // (beside the lens the powder at the hooves and the jets of breath stand out a little more than across the lake)
  if(uNear.x > 0.) alpha *= smoothstep(uNear.x, uNear.y, dist) * mix(1., smoothstep(uNear.z, uNear.w, dist), step(.5, iB.w)) * (type > .5 ? 1.35 : 1.15);
  float fs = pow(max(dot(vd, uSunDir), 0.), 6.), back = 0.;
  // against the sun breath and kicked powder light up: larger, denser, gold
  if(type < 1.5){ float bl = pow(max(dot(vd, uSunDir), 0.), 2.5); size *= 1. + .45 * bl * (type < .5 && iS.z > 1.2 ? 0. : 1.); alpha = min(alpha * (1. + 1.1 * bl), .8); }
  float cloud = type < 1.5 ? 1. : 0., steam = type > 3.5 ? 1. : 0.;
  if(cloud + steam < .5){
    // looked at toward the sun the wreath lights up: a gold wall of steam and powder between the herd and the taiga
    back = pow(max(dot(vd, uSunDir), 0.), 3.) * smoothstep(30., 13., uCamL.y);
    // looked down through, the wreath is thin; the farther a billow stands from the lens the denser it is drawn (the one rule
    // of distance, FAR_GLSL); the curtain (iB.x = 1) shows against the sun, and its eastern end stands only for a lens above the antlers
    alpha *= mix(1., .4, abs(vd.y)) * (1. + 1.5 * K_FAR * farOf(dist)) * mix(1., .12 + 1.2 * back, iB.x) * mix(1., smoothstep(2.5, 3.8, uCamL.y), iB.x * step(-1.69, iA.y));
    // from among the animals one looks along the wreath through many billows: thinner there, so that the taiga and the sky stand behind it
    alpha *= mix(.42, .5, smoothstep(4.5, 14., uCamL.y));
    alpha = min(alpha, mix(.7, .3, iB.x));      // the curtain glows, it does not wall off the taiga and the sky behind it
  }
  if(alpha < .004) size = 0.;
  vec3 pc = mix(uPuffShade, uPuffLit, .72 + .28 * iS.w);
  // breath and powder are lit as small clouds in the fragment shader (sun side, shade side, a glow against the sun); the wreath and
  // the steam round the erratic stay soft veils, pale where the sun is behind the lens and gold where the lens looks toward it
  pc = steam > .5 ? uPuffLit * (.96 + .12 * iS.w) + uGold * .55 * fs : cloud < .5 ? mix(pc + uGold * .5 * fs, uGold * .62 + uPuffLit * .42, back * (.55 + .45 * iB.x)) : uPuffLit * (1.22 + .14 * iS.w);
  vCol = vec4(pc, alpha); vFs = cloud * fs;
  vLd = vec4(dot(uSunDir, uCamR), dot(uSunDir, uCamU), -dot(uSunDir, vd), cloud);
  vUv = position.xy; vSeed = iS.w * 37. + iA.w * 11.;
  vec3 lp = pos + (uCamR * (position.x * wide) + uCamU * position.y) * size;
  vec4 mvPosition = modelViewMatrix * vec4(lp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Eo=`
#include <fog_pars_fragment>
${Mt}
uniform vec3 uPuffShade, uGold;
varying vec2 vUv; varying vec4 vCol, vLd; varying float vSeed, vFs;
void main(){
  float d = length(vUv), n = vnoise2(vUv * 2.2 + vSeed) * .6 + vnoise2(vUv * 5. - vSeed) * .4;
  float a = vCol.a * smoothstep(1., .15, d + (n - .5) * .5);
  if(a < .002) discard;
  vec3 c = vCol.rgb * (.85 + .3 * n);
  if(vLd.w > .5){
    vec3 nn = vec3(vUv, sqrt(max(1. - d * d, 0.)));
    float wrap = dot(nn, vLd.xyz) * .5 + .5 + (n - .5) * .35;
    c = mix(uPuffShade * (.84 + .3 * n), vCol.rgb * (.9 + .22 * n), smoothstep(.3, .72, wrap));
    c += vCol.rgb * .45 * smoothstep(0., -.8, vLd.z) * smoothstep(.3, .95, d) + uGold * 2.2 * vFs * (.45 + .6 * n);
  }
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
}`,Io=`
#include <fog_pars_vertex>
attribute float aEdge; attribute vec2 aTone;
varying vec3 vP, vN; varying float vEdge; varying vec2 vTone;
void main(){ vP = position; vN = normal; vEdge = aEdge; vTone = aTone; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,jo=`
#include <fog_pars_fragment>
${Mt}
${Ht}
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce, uSnow, uShade, uRock, uLichen, uGold, uCamL, uB1, uB2;
uniform vec2 uCleft;
varying vec3 vP, vN; varying float vEdge; varying vec2 vTone;
void main(){
  vec3 Nf = normalize(vN + vec3(0., 1e-5, 0.)), V = normalize(uCamL - vP + vec3(0., 1e-4, 0.));
  float tone = clamp(vTone.x, .5, 1.3), fresh = clamp(vTone.y, 0., 1.);
  float dist = distance(uCamL, vP), near = smoothstep(60., 10., dist);
  // one tone per fracture plane, then grain: feldspar, quartz and biotite flecks
  float face = hash3(floor(Nf * 6. + .5) + floor(dot(vP, Nf) * .7));
  // (grain finer than the eye resolves goes to its mean between 25 m and 60 m: from across the eye a face is a plane with one tone)
  float farR = smoothstep(25., 60., dist);
  float big = vnoise(vP * .3), mid = vnoise(vP * 2.1 + 7.), fine = mix(vnoise(vP * 9.) * .6 + vnoise(vP * 31.) * .4, .5, farR);
  vec3 alb = uRock * (.62 + .5 * face) * (.76 + .42 * big) * (.9 + .2 * mid) * tone;
  // the old skin is darker and browner (rock varnish, rain streaks down the face); a new break is pale and clean
  float streak = vnoise(vP * vec3(1.3, .16, 1.3) + 61.);
  alb = mix(alb * vec3(.68, .62, .58) * (.76 + .44 * streak), alb * vec3(1.3, 1.27, 1.24) + .015, fresh);
  float zone = smoothstep(.3, .62, vnoise(vP * .5 + 11.)) * (1. - .6 * fresh);      // the speckle comes in patches, not evenly
  alb *= 1. + (fine - .5) * .4 * near;
  alb = mix(alb, uRock * vec3(1.5, 1.32, 1.2), smoothstep(.62, .7, vnoise(vP * 14. + 3.)) * .34 * near * zone);       // pale feldspar
  alb = mix(alb, vec3(.03), smoothstep(.7, .76, vnoise(vP * 23. + 40.)) * .4 * near * zone);                          // biotite
  // three joint sets: sheeting near the horizontal and two steep ones; a few wide dark cracks, broken by a mask
  float w = .028 + .0025 * dist;
  float j1 = abs(fract(dot(vP, vec3(.06, .31, -.04)) + .08 * mid) - .5) / .31, j2 = abs(fract(dot(vP, vec3(.21, .03, .14)) + .1 * big) - .5) / .25, j3 = abs(fract(dot(vP, vec3(-.12, .02, .2)) + .09 * mid) - .5) / .23;
  float crack = max(smoothstep(w, w * .3, j1) * step(.42, vnoise(vP * .23 + 3.)), max(smoothstep(w, w * .3, j2) * step(.5, vnoise(vP * .19 + 9.)), smoothstep(w, w * .3, j3) * step(.55, vnoise(vP * .21 + 15.))));
  alb *= 1. - .78 * crack;
  // bump: the plane is rough at close range
  vec3 N = normalize(Nf + (vec3(vnoise(vP * 5. + 1.), vnoise(vP * 5. + 17.), vnoise(vP * 5. + 31.)) - .5) * .32 * near + (vec3(mid, big, fine) - .5) * .1);
  // lichen in patches: grey-green crusts, a little yellow map lichen, dark seep streaks below ledges
  float lp = smoothstep(.56, .62, vnoise(vP * .9 + 20.) + (fine - .5) * .3) * smoothstep(-.6, .2, Nf.y) * mix(smoothstep(.3, .55, vnoise(vP * 5.3 + 4.)), .5, farR);
  alb = mix(alb, uLichen * (.75 + .5 * fine), lp * .7 * (1. - .85 * fresh));
  float yl = smoothstep(.7, .74, vnoise(vP * 2.3 + 55.) + (fine - .5) * .34) * mix(smoothstep(.35, .6, vnoise(vP * 7. + 12.)), .5, farR);
  alb = mix(alb, vec3(.3, .29, .12), yl * .55 * (1. - fresh));
  alb *= 1. - .4 * smoothstep(.55, .8, vnoise(vP * vec3(1.9, .22, 1.9) + 80.)) * smoothstep(.5, -.2, Nf.y);
  // arrises: fresh pale chips along the edges of each plane
  float edge = smoothstep(.1, .0, vEdge + (fine - .5) * .08);
  alb = mix(alb, uRock * 1.5, edge * .35);
  // snow on what faces the sky, hoar on the windward faces and along the arrises
  float cap = smoothstep(.56, .74, Nf.y + (vnoise(vP * .8) - .5) * .3 + (fine - .5) * .1);      // (steep broken roofs keep only patches)
  float lee = max(smoothstep(.2, .85, -Nf.x), .35 * smoothstep(.15, .7, -dot(Nf, uSunDir)));
  // (hoar in patches at close range; from across the eye a veil that thickens toward the top of each face)
  float hoar = lee * mix(smoothstep(.4, .62, vnoise(vP * 2.6 + 70.) + edge * .5 + (fine - .5) * .3), .22 + .5 * smoothstep(1., 11., vP.y), farR) * .75;
  float foot = smoothstep(.06, -.06, vP.y - .25 - 1.1 * vnoise(vP * .7 + 33.) - (fine - .5) * .3);                                // snow plastered on the foot
  float sn = max(max(cap, hoar), foot);
  // the other half's shadow (the sun is low: the sunlit half shades the cleft)
  float bx = vP.x * uCleft.y - vP.z * uCleft.x, sh = 0.;
  if(dot(Nf, uSunDir) > 0.){
    vec3 ro = vP + Nf * .05;
    if(bx > 0.){ vec2 d1 = capD(ro, uSunDir, uB1 + vec3(0., 1.5, 0.), uB1 + vec3(0., 9.4, 0.)); sh = (1. - smoothstep(3.2, 4.0 + d1.y * .03, d1.x + (big - .5) * 1.2)) * step(.3, d1.y); }
  }
  float ndl = dot(N, uSunDir), dif = max(ndl, 0.) * (1. - sh);
  float ao = mix(.5, 1., smoothstep(0., 4., vP.y)) * mix(.75, 1., smoothstep(0., .25, vEdge));
  vec3 rock = alb * (mix(uBounce * 1.3, uSkyCol, N.y * .5 + .5) * ao + uSunCol * dif * .62);
  float kk = clamp(ndl / max(uSunDir.y, .07), 0., 2.) * (1. - sh);
  vec3 snow = mix(uShade, uSnow * (.30 + .44 * pow(max(kk, 1e-3), .7)), smoothstep(0., .5, kk));
  vec3 c = mix(rock, snow, sn);
  c += uSkyCol * .2 * pow(1. - max(dot(N, V), 0.), 3.);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,fo=`
#include <fog_pars_vertex>
attribute float aOcc;
varying vec3 vP, vN; varying float vOcc;
void main(){ vP = position; vN = normal; vOcc = aOcc; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,uo=`
#include <fog_pars_fragment>
${Mt}
${Ht}
uniform vec3 uSunDir, uGold, uCamL, uSnow, uWarm, uShade, uB1, uB2; uniform float uGlint;
varying vec3 vP, vN; varying float vOcc;
float rip(vec2 p){ return .7 * vnoise2(p * vec2(.9, 3.1)) + .14 * smoothstep(.35, .65, vnoise2(p * 2.3 + 9.)) + .1 * vnoise2(p * 13.); }
void main(){
  vec2 q = vP.xz; float dist = distance(uCamL, vP); vec3 V = (uCamL - vP) / max(dist, 1e-3);
  float lowSun = clamp(uSunDir.y * 3.4, .35, 1.), ee = clamp(dist * .004, .02, .15);
  float r0 = rip(q), rx = rip(q + vec2(ee, 0.)), rz = rip(q + vec2(0., ee));
  vec3 n = normalize(normalize(vN + vec3(0., 1e-5, 0.)) - vec3(rx - r0, 0., rz - r0) / ee * .07 * lowSun * smoothstep(60., 6., dist));
  float ndl = dot(n, uSunDir), kk = clamp(ndl / max(uSunDir.y, .07), 0., 2.);
  vec3 alb = mix(uSnow, uWarm, .55 * smoothstep(1.15, 2., kk));
  vec3 lit = alb * (.30 + .44 * pow(max(kk, 1e-3), .7));
  vec2 d1 = capD(vP, uSunDir, uB1 + vec3(0., 1.5, 0.), uB1 + vec3(0., 8.4, 0.)), d2 = capD(vP, uSunDir, uB2 + vec3(0., 1.5, 0.), uB2 + vec3(0., 6.2, 0.));
  float n1 = (fbm2(q * .35) - .5) * 1.6;
  float sh = max(1. - smoothstep(4.4, 5.2 + d1.y * .03, d1.x + n1), 1. - smoothstep(4.2, 5.0 + d2.y * .03, d2.x - n1));
  vec3 c = mix(uShade, lit, smoothstep(0., .5, kk) * (1. - sh * .96));
  c = mix(c, uShade * 1.02, vOcc * .78);                  // the blue hollow under a lying animal
  vec2 gi = floor(q * 27.); float gh = hash2(gi);
  c += uGold * uGlint * (1. - vOcc) * step(.985, gh) * pow(max(sin(gh * 911. + dot(V.xz, vec2(31., 23.)) + V.y * 47.), 0.), 24.) * smoothstep(34., 5., dist) * (1. - sh);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;function Uo(v){const n=(o,q,Y,r,A)=>({n:o,pts:[q,Y,r,A],f:0}),e=(o,q,Y)=>[o,q,Y];let y=[n([1,0,0],e(1,-1,-1),e(1,1,-1),e(1,1,1),e(1,-1,1)),n([-1,0,0],e(-1,-1,1),e(-1,1,1),e(-1,1,-1),e(-1,-1,-1)),n([0,1,0],e(-1,1,1),e(1,1,1),e(1,1,-1),e(-1,1,-1)),n([0,-1,0],e(-1,-1,-1),e(1,-1,-1),e(1,-1,1),e(-1,-1,1)),n([0,0,1],e(-1,-1,1),e(1,-1,1),e(1,1,1),e(-1,1,1)),n([0,0,-1],e(1,-1,-1),e(-1,-1,-1),e(-1,1,-1),e(1,1,-1))];const p=(o,q)=>o[0]*q[0]+o[1]*q[1]+o[2]*q[2];for(const[o,q,Y]of v){const r=[],A=[];for(const c of y){const N=[],F=c.pts,E=F.length;for(let _=0;_<E;_++){const S=F[_],k=F[(_+1)%E],ee=p(S,o)-q,V=p(k,o)-q;if(ee<=0&&N.push(S),ee<0&&V>0||ee>0&&V<0){const ze=ee/(ee-V),ve=[S[0]+(k[0]-S[0])*ze,S[1]+(k[1]-S[1])*ze,S[2]+(k[2]-S[2])*ze];N.push(ve),r.push(ve)}}N.length>=3&&A.push({n:c.n,pts:N,f:c.f})}if(r.length>=3){const c=[0,0,0];for(const k of r)c[0]+=k[0]/r.length,c[1]+=k[1]/r.length,c[2]+=k[2]/r.length;const N=Math.abs(o[1])<.9?[0,1,0]:[1,0,0],F=[N[1]*o[2]-N[2]*o[1],N[2]*o[0]-N[0]*o[2],N[0]*o[1]-N[1]*o[0]],E=[o[1]*F[2]-o[2]*F[1],o[2]*F[0]-o[0]*F[2],o[0]*F[1]-o[1]*F[0]],_=k=>Math.atan2((k[0]-c[0])*E[0]+(k[1]-c[1])*E[1]+(k[2]-c[2])*E[2],(k[0]-c[0])*F[0]+(k[1]-c[1])*F[1]+(k[2]-c[2])*F[2]);r.sort((k,ee)=>_(k)-_(ee));const S=[];for(const k of r){const ee=S[S.length-1];(!ee||Math.abs(ee[0]-k[0])+Math.abs(ee[1]-k[1])+Math.abs(ee[2]-k[2])>1e-5)&&S.push(k)}S.length>=3&&A.push({n:o,pts:S,f:Y??.6})}y=A}return y}function Ko(v,n,e,y){const p=new i.Vector3,o=new i.Vector3,q=new i.Vector3,Y=new i.Vector3,r=new i.Vector3,A=new i.Vector3,c=new i.Vector3;for(const N of n){const F=N.pts.map(S=>new i.Vector3(S[0],S[1],S[2]).applyMatrix4(e)),E=F.length;Y.set(0,0,0);for(const S of F)Y.addScaledVector(S,1/E);r.set(0,0,0);for(let S=0;S<E;S++)A.subVectors(F[S],Y),c.subVectors(F[(S+1)%E],Y),r.add(A.cross(c));if(r.lengthSq()<1e-10)continue;r.normalize();let _=1e9;for(let S=0;S<E;S++){A.subVectors(F[(S+1)%E],F[S]);const k=A.length();k<1e-6||(c.subVectors(Y,F[S]),_=Math.min(_,c.cross(A).length()/k))}for(let S=0;S<E;S++)p.copy(Y),o.copy(F[S]),q.copy(F[(S+1)%E]),v.p.push(p.x,p.y,p.z,o.x,o.y,o.z,q.x,q.y,q.z),v.n.push(r.x,r.y,r.z,r.x,r.y,r.z,r.x,r.y,r.z),v.e.push(_,0,0),v.t.push(y,N.f,y,N.f,y,N.f)}}async function Wo(v,n,e,y){const[p,o]=e,q={p:[],n:[],e:[],t:[]},Y=[],r=new i.Matrix4().makeBasis(new i.Vector3(o,0,-p),new i.Vector3(0,1,0),new i.Vector3(p,0,o)),A=new i.Matrix4,c=new i.Matrix4,N=new i.Quaternion,F=new i.Euler,E=a=>{const t=Math.hypot(a[0],a[1],a[2]);return[a[0]/t,a[1]/t,a[2]/t]},_=(a,t,P,d,D,C)=>{A.compose(new i.Vector3(t[0],t[1],t[2]),N.setFromEuler(F.set(d[0],d[1],d[2])),new i.Vector3(P[0],P[1],P[2])),C&&(c.makeTranslation(C[0],0,0).multiply(new i.Matrix4().makeRotationZ(-C[1])).multiply(new i.Matrix4().makeTranslation(-C[0],0,0)),A.premultiply(c)),A.premultiply(r),Ko(q,Uo(D),A,.78+.4*a())},S=(a,t,P,d,D)=>{const C=[];for(let O=0;O<t;O++){let $=a.range(.35,1)*a.sign();D&&$*d<0&&O>0&&($=-$),C.push([E([$,a.range(.5,1.1),a.range(.3,1)*a.sign()]),a.range(1.02,1.3)])}for(let O=0;O<P;O++){let $=a.range(.6,1)*a.sign();D&&$*d<0&&($=-$),C.push([E([$,a.range(-.12,.2),a.range(.6,1)*a.sign()]),a.range(1.14,1.32)])}return C},k=(a,t,P,d,D)=>{const C=[],O=a()*pe;for(let $=0;$<3;$++){const fe=O+$*pe/3+a.range(-.35,.35),ie=a.range(t,P),le=Math.hypot(ie,1);C.push([[Math.cos(fe)*ie/le,1/le,Math.sin(fe)*ie/le],a.range(d,D)/le,a()<.5?a.range(.5,1):0])}return C},ee=(a,t,P,d,D)=>{const C=[];for(const[O,$]of[[0,1],[0,-1],[2,1],[2,-1]]){if(P&&O===0&&$*t<0)continue;const fe=a.range(d,D),ie=[0,fe,0],le=Math.hypot(1,fe);ie[O]=$,C.push([[ie[0]/le,ie[1]/le,ie[2]/le],(1-fe*a.range(.1,.9))/le,0])}return C};for(const a of[-1,1]){const t=v["half"+a],P=a<0,d=P?13:t.range(11.2,11.8),D=t.range(2.75,3.05),C=t.range(5.3,5.8),O=t.range(.09,.15),$=a*(4.1+D),fe=[...ee(t,a,!0,.1,.24),...k(t,.28,.55,.5,.8),...S(t,5,2,a,!0)];fe.push([E([-a*.5,1,t.range(-.2,.2)]),1.26]),_(t,[$,d/2-.7,t.range(-.3,.3)],[D,d/2+.7,C],[0,a*t.range(-.04,.04),0],fe,[a*4.1,a*O]),await y();const ie=d*t.range(.26,.34);_(t,[a*(4.1+2*D+.5),ie-.6,t.range(-1.6,.6)],[t.range(1.5,1.9),ie+.6,t.range(3.2,4)],[0,a*t.range(.1,.28),a*t.range(.03,.09)],[...ee(t,a,!1,.12,.3),...k(t,.2,.42,.72,.92),...S(t,4,2,a,!1)],null);const le=d*t.range(.3,.42);_(t,[$+a*t.range(.5,1.1),le-.6,C+.55],[D*t.range(.7,.85),le+.6,t.range(.75,1.05)],[t.range(.02,.07),a*t.range(-.12,.12),0],[...k(t,.25,.5,.6,.88),...S(t,4,1,a,!0)],[a*4.1,a*O*.6]),_(t,[$+a*t.range(1.2,1.9),le*.4-.5,C+1.9],[D*.55,le*.4+.5,t.range(.7,.9)],[t.range(.05,.12),a*t.range(-.3,.3),a*.05],[...k(t,.2,.4,.7,.92),...S(t,4,1,a,!1)],null);const Me=d*t.range(.22,.3);_(t,[$+a*t.range(-.2,.8),Me-.6,-C-.9],[D*.8,Me+.6,t.range(1.1,1.5)],[-t.range(.03,.09),a*t.range(-.15,.15),0],[...k(t,.25,.5,.6,.9),...S(t,4,1,a,!0)],null),await y(),P?_(t,[$+a*.4,d*.79,-1.2],[1.5,1.25,2],[.05,.5,-.1],[...ee(t,a,!1,.15,.3),...k(t,.3,.6,.45,.75),...S(t,3,2,a,!1)],[a*4.1,a*O]):_(t,[$+a*.9,d*.76,1.3],[1.3,1.05,1.7],[-.08,-.4,.14],[...ee(t,a,!1,.15,.3),...k(t,.3,.6,.45,.75),...S(t,3,1,a,!1)],[a*4.1,a*O]);for(let Ve=0;Ve<7;Ve++){const G=Ve<3,U=G?t.range(.35,.62):t.range(.45,1.15),ne=G?a*t.range(4.6,7.6):a*t.range(7.5,13.5),Pe=G?C+t.range(2.6,4.4):t.range(-9,7.5);a<0&&Math.hypot(ne+6.1,Pe-10.6)<2.6||_(t,[ne,U*t.range(.1,.45),Pe],[U*t.range(.8,1.5),U*t.range(.6,1),U*t.range(.8,1.4)],[t.range(-.5,.5),t()*pe,t.range(-.5,.5)],S(t,3,2,a,!1),null)}Y.push(new i.Vector3(a*(4.1+D+.6),0,0).applyMatrix4(r)),await y()}const V=new i.BufferGeometry;V.setAttribute("position",new i.Float32BufferAttribute(q.p,3)),V.setAttribute("normal",new i.Float32BufferAttribute(q.n,3)),V.setAttribute("aEdge",new i.Float32BufferAttribute(q.e,1)),V.setAttribute("aTone",new i.Float32BufferAttribute(q.t,2));const ze=26,ve=96,me=new Float32Array((ze+1)*ve*3),M=[],H=new i.Vector3,h=(a,t,P,d,D)=>Math.hypot(Math.max(Math.abs(a-P)-d,0),Math.max(Math.abs(t)-D,0)),oe=(a,t)=>{const P=Math.min(h(a,t,-7.4,3.5,6.6),h(a,t,7.4,3.5,6.6)),d=Math.hypot(a,t),D=.5+.5*n.fbm2(a*.22+40,t*.22,3),C=n.n2(a*.9,t*.9+7);let O=(.75+.75*D)*Math.exp(-P/1.7)+.05*C*Math.exp(-P/4);return O+=.45*Math.exp(-(a*a)/30)*te(13,6,Math.abs(t))*(.6+.8*D),O*te(17,9.5,d+2.5*(D-.5))-.07*te(10,17,d)};for(let a=0,t=0;a<=ze;a++)for(let P=0;P<ve;P++,t+=3){const d=17*Math.pow(a/ze,.8),D=P/ve*pe,C=Math.cos(D)*d,O=Math.sin(D)*d;H.set(C,oe(C,O),O).applyMatrix4(r),me[t]=H.x,me[t+1]=H.y,me[t+2]=H.z}for(let a=0;a<ze;a++)for(let t=0;t<ve;t++){const P=a*ve+t,d=a*ve+(t+1)%ve,D=P+ve,C=d+ve;M.push(P,d,D,d,C,D)}await y();const I=new i.BufferGeometry;return I.setAttribute("position",new i.BufferAttribute(me,3)),I.setAttribute("aOcc",new i.BufferAttribute(new Float32Array(me.length/3),1)),I.setIndex(M),I.computeVertexNormals(),{geometry:V,halves:Y,drift:I}}async function $o(v,n,e,y){const p=[],o=[],q=[],r=[0,.5,.8,1.03,1.42,2.05],A=[.012,.03,.062,.095,.04,-.03],c=[.9,.8,.42,.05,0,0],N=Math.hypot(e.x,e.z)||1,F=Math.max(e.y,.05)/N,E=e.x/N,_=e.z/N;let S=0;for(const V of v){if(V.state!==2)continue;const ze=V.r*Math.cos(V.th),ve=-V.r*Math.sin(V.th),me=Math.sin(V.yaw),M=Math.cos(V.yaw),H=M,h=-me,oe=1*V.sc,I=.5*V.sc,a=-.06*V.sc,t=p.length/3,P=V.seed*40;p.push(ze+me*a,A[0],ve+M*a),o.push(1);for(let d=1;d<r.length;d++)for(let D=0;D<16;D++){const C=D/16*pe,O=Math.cos(C),$=Math.sin(C),fe=.72+.56*(.5+.5*n.n2(O*1.9+P,$*1.9+d*.35)),ie=1+.12*n.n2(O*1.3+P+9,$*1.3),le=I*r[d]*$*ie*(d>3?1.12:1),Me=a+oe*r[d]*O*ie,Ve=A[d]*(d===2||d===3?fe:1)*(.55+.6*V.sc);let G=0;if(d>2){const U=E*H+_*h,ne=E*me+_*M,Pe=Math.min(.66*V.sc/F,2.6);for(let Ee=1;Ee<=8;Ee++){const it=Pe*Ee/8,l=(le+U*it)/(.33*V.sc),f=(Me-a+ne*it+.05)/(.8*V.sc),z=l*l+f*f;if(z<1&&Ve+it*F<.64*V.sc*Math.sqrt(1-z)+.04){G=1;break}}}p.push(ze+H*le+me*Me,Ve,ve+h*le+M*Me),o.push(Math.max(c[d],G*.78))}for(let d=0;d<16;d++)q.push(t,t+1+d,t+1+(d+1)%16);for(let d=0;d<r.length-2;d++)for(let D=0;D<16;D++){const C=t+1+d*16+D,O=t+1+d*16+(D+1)%16;q.push(C,C+16,O,O,C+16,O+16)}S++,S%24===0&&await y()}if(!S)return null;await y();const k=new i.BufferGeometry;k.setAttribute("position",new i.Float32BufferAttribute(p,3)),k.setAttribute("aOcc",new i.Float32BufferAttribute(o,1)),k.setIndex(q),k.computeVertexNormals();const ee=k.attributes.normal;for(let V=0;V<ee.count;V++)ee.getY(V)<0&&ee.setXYZ(V,-ee.getX(V),-ee.getY(V),-ee.getZ(V));return k.userData.count=S,k}function Jo(v,n,e,y,p){const o=c=>new i.Color(c),q=new i.Color(1,1,1);let Y=17,r={sunColor:q.clone().lerp(o(v[4]),.35),sunIntensity:2.1,sky:o(v[3]),skyIntensity:.55,bounce:o(v[0]).multiplyScalar(.4),snow:o(v[0]),warm:o(v[1]),shade:o(v[2]).multiplyScalar(.95),gold:o(v[4]),shadowStrength:1,glint:2.6,haze:1,drift:0,wet:0};n==="lastSun"?(Y=4,r.sunColor=o("#ff9a6a"),r.sunIntensity=1.7,r.snow=o(v[1]).lerp(o("#f2a0a8"),.4),r.warm=o("#ff8a6a"),r.shade=o("#5a4fa0").multiplyScalar(.8),r.sky=o("#7f7fc8"),r.gold=o("#ff8a50"),r.bounce=o(v[1]).multiplyScalar(.3)):n==="moon"&&(Y=34,p+=.5,r.sunColor=o("#a9c4ff"),r.sunIntensity=.5,r.snow=o("#5f7fb8").multiplyScalar(.75),r.warm=o("#8fa8d8"),r.shade=o("#16244a"),r.sky=o("#1c2a55"),r.skyIntensity=.5,r.gold=o("#cfe0ff"),r.bounce=o("#22335a").multiplyScalar(.5),r.glint=1.6),e==="overcast"&&(r.sunIntensity*=.3,r.skyIntensity*=1.7,r.shadowStrength=.3,r.snow=r.snow.clone().lerp(o("#d9dde2"),.7).multiplyScalar(.82),r.warm=r.snow.clone(),r.shade=r.shade.clone().lerp(r.snow,.55),r.glint=0,r.sky=r.sky.clone().lerp(q,.5)),e==="blizzard"&&(r.drift=.85,r.haze=1.6,r.shadowStrength*=.6,r.glint=0),y==="april"&&(r.wet=1,r.snow=r.snow.clone().lerp(o("#b9c0c8"),.35),r.glint*=.4);const A=Y*Math.PI/180;return r.sunDir=new i.Vector3(Math.sin(p)*Math.cos(A),Math.sin(A),Math.cos(p)*Math.cos(A)),r}async function oa(v,n={}){const e=v.rng.fork("reindeer-cyclone"),y=v.noise,p=v.quality?.detail??1,o=(n.palette&&n.palette.length>=7?n.palette:wo).slice(0,7),q=n.hour||"noon",Y=n.weather||"clear",r=n.season||"march",A=s=>new i.Color(s),c=Ao();await v.yield();const N=_e(Math.round(n.arms??(e()<.7?4:e()<.5?3:5)),3,5),F=_e(n.density??e.range(.94,1.04),.73,1.13),E=Math.round(3e3*F),_=Math.round(150*Math.min(1,F+.1)),S=27.5*(4/N)*e.range(.95,1.05),k=n.paleHerd?.7:1/15,ee=Re(c.marks.wheel1,c.marks.slide0,.5),V=c.path.pointAt(ee),ze=Math.hypot(V.x,V.z),ve=(.3-ze/S)*pe/N-(Math.atan2(-V.z,V.x)-tt(ze)/ze*(c.clockAt(ee)-je));c.marks.run=ee;const me=n.whiteCow??e.chance(1/8),M=Bo(),H=e.range(-.07,.07),h=Jo(o,q,Y,r,H);n.sunDir&&h.sunDir.set(n.sunDir[0],n.sunDir[1],n.sunDir[2]).normalize();const oe={};for(const s of["half-1","half1","puffs","billows","curtain","escorts","runners","aisle","bowls","rimside","eye","trails","young","gate"])oe[s]=e.fork(s);const I=new Float32Array(mt*_t*4);for(let s=0;s<_t;s+=2)so(n.ground,I,s,s+2),await v.yield();const a=new i.DataTexture(I,mt,_t,i.RGBAFormat,i.FloatType);a.minFilter=a.magFilter=i.NearestFilter,a.generateMipmaps=!1,a.needsUpdate=!0,await v.yield();let t=await Do(oe,y,c,{runners:E-_,eye:_,arms:N,period:S,paleShare:k,armPhase:ve,whiteCow:me,craters:M,trail:I,river:n.river!==!1,riverTries:n.riverTries||[30,44],stragglers:Math.max(0,Math.round(n.stragglers||0))},v.yield);await v.yield();const P=t.eyeSpots,d=new i.Vector3,D=new i.Vector3,C=new i.Vector3,O=new i.Vector3,$=c.marks,fe=Math.hypot(h.sunDir.x,h.sunDir.z)||1,ie=h.sunDir.x/fe,le=h.sunDir.z/fe,Me=new i.Vector3(ie*14,-3,le*14),Ve=new i.Vector3(c.pts[c.pts.length-1][0],5,c.pts[c.pts.length-1][2]),G=2.14,U=1.08,ne=Math.atan2(ie,le),Pe=s=>s>0?s*s/(s+.08):0,Ee=(s,b,x,j,ce)=>{c.path.pointAt(s,d),c.path.tangentAt(s,D);const ye=Math.hypot(D.x,D.z)||1,nt=D.x/ye,Te=D.z/ye,Ge=Math.cos(b),B=Math.sin(b),re=Math.cos(x);return ce.set(d.x+(nt*Ge+Te*B)*re*j,d.y-Math.sin(x)*j,d.z+(Te*Ge-nt*B)*re*j)},it=s=>(s%=pe,s>Math.PI?s-pe:s<-Math.PI?s+pe:s),l=s=>{const b=Math.atan2(-d.x,-d.z),x=it(b-ne),j=b+Pe(U-Math.abs(x))*(x<0?-1:1),ce=60/Math.hypot(G,1);return s.set(d.x+Math.sin(j)*G*ce,d.y-ce,d.z+Math.cos(j)*G*ce)},f=(s,b)=>{c.path.tangentAt(s,D);const x=Math.hypot(D.x,D.z)||1,j=D.x/x,ce=D.z/x,ye=Math.atan2(j*le-ce*ie,j*ie+ce*le);return Ee(s,.2+Pe(U-ye-.2)*te(-.9,-.4,ye),0,26,b).y=.4,b},z=(s,b)=>{c.path.pointAt(s,d);const x=d.x*ie+d.z*le,j=d.x*d.x+d.z*d.z-Ue*Ue,ce=Math.min(-x+Math.sqrt(Math.max(0,x*x-j)),14);c.path.tangentAt(s,D);const ye=Math.hypot(D.x,D.z)||1;return b.set(d.x+ie*ce+D.x/ye*1.5,1.6,d.z+le*ce+D.z/ye*1.5)},u=(s,b)=>{c.path.pointAt(Math.min(1,s+.03),b),b.y*=.25,b.x*=.55,b.z*=.55,b.lerp(Me,te(.135,.255,s)),c.path.pointAt(s,d);const x=d.y;return s>$.wheel0&&s<=$.top?b.lerp(l(C),te(3.6,7.5,x)):s>$.top&&(l(C),b.copy(C.lerp(f(s,O),te(27,6,x)))),s>.74&&s<.84&&b.lerp(z(s,O),te(.745,.772,s)*(1-te(.797,.83,s))),s>.79&&(Ee(s,(me?34:62)*rt,0,40,C).y=.9,b.lerp(C,te(.8,.835,s))),s>.86&&b.lerp(Ve,te(.872,.93,s)),b},T=s=>s.young===1;if(p<1){const s=t.eyeSpots,b=t.river;t=t.filter(x=>x.state>0||x.r>800||T(x)||x.d<30||x.seed<.25+.75*p),t.eyeSpots=s,t.river=b}if(r==="april")for(const s of t)s.sc>1.05&&(s.ant=0);const m=i.UniformsLib.fog,w={uClock:{value:0},uTime:{value:0},uTrail:{value:a},uCamL:{value:new i.Vector3(0,60,250)},uCamR:{value:new i.Vector3(1,0,0)},uCamU:{value:new i.Vector3(0,1,0)},uSunDir:{value:h.sunDir.clone()},uSunCol:{value:new i.Color},uSkyCol:{value:new i.Color},uBounce:{value:new i.Color},uGold:{value:new i.Color},uSnow:{value:new i.Color},uWarm:{value:new i.Color},uShade:{value:new i.Color},uShTint:{value:new i.Color},uShCol:{value:new i.Color},uShStr:{value:1},uShLen:{value:3.3},uPuffLit:{value:new i.Color},uPuffShade:{value:new i.Color},uDriftCol:{value:new i.Color},uDrift:{value:0},uHaze:{value:1},uGlint:{value:2.6},uWet:{value:0},uHazeCol:{value:new i.Color},uHazeGold:{value:new i.Color},uHaze4:{value:new i.Vector4(.05,.55,0,0)},uCamS:{value:null},uPale:{value:A(o[6]).multiplyScalar(.64)},uNeck:{value:new i.Vector3(...io)},uThin:{value:.0016},uHeath:{value:A("#3a2428").lerp(A(o[5]),.4)},uLichen:{value:A("#9aa58c").multiplyScalar(.8)},uRock:{value:A(o[5]).lerp(A(o[6]),.42)},uLead:{value:new i.Vector4(1e5,0,1e5,0)},uLeadB:{value:new i.Vector3(0,1,0)},uCleft:{value:new i.Vector2(c.cleft[0],c.cleft[1])},uArms:{value:N},uPeriod:{value:S},uArmPhase:{value:ve},uBoulder:{value:n.boulder===!1?0:1},uB1:{value:new i.Vector3},uB2:{value:new i.Vector3}};w.uCamS.value=w.uCamL.value;const g=new i.Color,J=(s={})=>{Object.assign(h,s),s.sunDir&&(h.sunDir=(s.sunDir.isVector3?s.sunDir.clone():new i.Vector3(...s.sunDir)).normalize());for(const x of["sunColor","sky","bounce","snow","warm","shade","gold"])h[x].isColor||(h[x]=A(h[x]));w.uSunDir.value.copy(h.sunDir),w.uSunCol.value.copy(h.sunColor).multiplyScalar(h.sunIntensity),w.uSkyCol.value.copy(h.sky).multiplyScalar(h.skyIntensity),w.uBounce.value.copy(h.bounce),w.uGold.value.copy(h.gold),w.uSnow.value.copy(h.snow),w.uWarm.value.copy(h.warm),w.uShade.value.copy(h.shade);const b=h.shadowTint?A(h.shadowTint):new i.Color(_e(h.shade.r/(h.snow.r*.74),.05,1),_e(h.shade.g/(h.snow.g*.74),.05,1),_e(h.shade.b/(h.snow.b*.74),.05,1));w.uShTint.value.copy(b),w.uShCol.value.copy(h.shade).multiplyScalar(.93),w.uShStr.value=h.shadowStrength,w.uShLen.value=Math.min(1/Math.tan(Math.max(.03,Math.asin(_e(h.sunDir.y,.02,1)))),9.5),w.uPuffLit.value.copy(h.snow).lerp(h.sunColor,.3).multiplyScalar(Math.max(.34*h.sunIntensity+.2,.72)),w.uPuffShade.value.copy(h.sky).lerp(h.snow,.45).multiplyScalar(.62),w.uHazeCol.value.copy(h.shade).lerp(g.copy(h.snow).multiplyScalar(.74),.74),w.uHazeGold.value.copy(h.gold).multiplyScalar(.2*Math.min(h.sunIntensity,2.4)),w.uHaze4.value.x=h.hazeK??.05,w.uHaze4.value.y=h.hazeH??.55,w.uDriftCol.value.copy(h.snow).multiplyScalar(.72),w.uDrift.value=h.drift,w.uHaze.value=h.haze,w.uGlint.value=h.glint,w.uWet.value=h.wet};J();const K=(s,b,x,j={})=>{const ce={...i.UniformsUtils.clone(m)};for(const ye of x)ce[ye]=w[ye];return new i.ShaderMaterial({vertexShader:s,fragmentShader:b,uniforms:ce,fog:!0,...j})},R=new i.Group;R.name="reindeer-cyclone";const W=(s,b,x)=>{const j=new i.Mesh(s,b);return j.frustumCulled=!1,j.renderOrder=x,j.matrixAutoUpdate=!1,R.add(j),j};if(n.snow!==!1){const s=new i.RingGeometry(.01,340,96,13);s.rotateX(-Math.PI/2),await v.yield(),W(s,K(Go,Oo,["uSunDir","uGold","uCamL","uSnow","uWarm","uShade","uHeath","uLichen","uB1","uB2","uClock","uTime","uArms","uPeriod","uArmPhase","uWet","uDrift","uBoulder","uGlint","uHazeCol","uHazeGold","uHaze4"],{transparent:!0}),-2)}let ae=new i.Vector3(0,0,0);if(n.boulder!==!1){const s=await Wo(oe,y,c.cleft,v.yield);w.uB1.value.copy(s.halves[0]),w.uB2.value.copy(s.halves[1]),W(s.geometry,K(Io,jo,["uSunDir","uSunCol","uSkyCol","uBounce","uSnow","uShade","uRock","uLichen","uGold","uCamL","uB1","uB2","uCleft"]),0),W(s.drift,K(fo,uo,["uSunDir","uGold","uCamL","uSnow","uWarm","uShade","uB1","uB2","uGlint"]),0);const b=s.geometry.attributes.position;let x=-1;for(let j=0;j<b.count;j++)b.getY(j)>x&&(x=b.getY(j),ae.fromBufferAttribute(b,j))}await v.yield();const L=A(o[5]),se=A(o[6]),ge={coat:L.clone().lerp(se,.055),belly:L.clone().lerp(se,.22),flank:L.clone().multiplyScalar(.95),ruff:se.clone().multiplyScalar(.84),rump:new i.Color(.78,.76,.72),leg:L.clone().multiplyScalar(.85),hoof:L.clone().multiplyScalar(.3),face:L.clone().multiplyScalar(.8),horn:L.clone().multiplyScalar(.8).lerp(se,.16),hornTip:se.clone().multiplyScalar(.62)},we=K(Po,Co,["uLead","uLeadB","uClock","uTime","uTrail","uCamL","uNeck","uPale","uThin","uSunDir","uSunCol","uSkyCol","uBounce","uDriftCol","uDrift","uSnow","uShade","uHazeCol","uHazeGold","uHaze4"],{vertexColors:!0,side:i.DoubleSide}),de=t.length,Q=new Float32Array(de*8),qe=new Float32Array(de),Ce=new Uint8Array(de).fill(3),$e=t.findIndex(s=>s.r>900),Fe=new Uint8Array(de),Be=[0,0,0,0];for(let s=0;s<de;s++){const b=t[s];Q.set([b.r,b.th,b.sc,b.seed,b.state,b.ant,b.tint,b.yaw],s*8),qe[s]=b.state===0&&b.r<800?tt(b.r)/b.r:0,Fe[s]=b.r>800&&b.r<900?1:T(b)?2:0}const Z=[Ot[0],Ot[1],Ot[2],de],Se=xo.map(s=>s*s),ke=bo.map(s=>s*s),He=[0,1,3,2],Je=[],De=[],Ke=(s,b)=>{const x=new i.InstancedBufferAttribute(new Float32Array(s*b),b);return x.setUsage(i.DynamicDrawUsage),x};for(let s=0;s<4;s++){const b=To(He[s],ge),x=new i.InstancedBufferGeometry,j=Ke(Z[s],4),ce=Ke(Z[s],4);De.push(b.index.count/3),x.index=b.index;for(const ye in b.attributes)x.setAttribute(ye,b.attributes[ye]);x.setAttribute("iA",j),x.setAttribute("iB",ce),x.instanceCount=0,x.boundingSphere=new i.Sphere(new i.Vector3(0,10,0),360),W(x,we,1),Je.push({g:x,A:j,B:ce}),await v.yield()}let We=0;{const s=await $o(t,y,h.sunDir,v.yield);s&&(We=s.userData.count,W(s,K(fo,uo,["uSunDir","uGold","uCamL","uSnow","uWarm","uShade","uB1","uB2","uGlint"],{side:i.DoubleSide}),0))}await v.yield();{const s=new i.BufferGeometry;s.setAttribute("position",new i.BufferAttribute(new Float32Array([0,-1,0,1,-1,0,1,1,0,0,1,0]),3)),s.setIndex([0,1,2,0,2,3]);const b=K(_o,Ro,["uLead","uLeadB","uClock","uTime","uTrail","uSunDir","uShLen","uShCol","uShStr","uCamS","uHazeCol","uHazeGold","uHaze4"],{transparent:!0,depthWrite:!1,side:i.DoubleSide,blending:i.CustomBlending,blendEquation:i.AddEquation,blendSrc:i.SrcAlphaFactor,blendDst:i.OneMinusSrcAlphaFactor,blendSrcAlpha:i.ZeroFactor,blendDstAlpha:i.OneFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4});W(qo(s,t,0,t.length),b,-1)}await v.yield();const ot=["uLead","uLeadB","uClock","uTime","uTrail","uCamL","uCamR","uCamU","uSunDir","uGold","uPuffLit","uPuffShade","uHaze"],at=new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),dt=s=>{const b=K(Vo,Eo,ot,{transparent:!0,depthWrite:!1,side:i.DoubleSide});return b.uniforms.uNear={value:new i.Vector4(s?qt[0]:0,s?qt[1]:1,Pt[0],Pt[1])},b};{const s=[],b=[],x=[],j=oe.puffs,ce=(B,re,he,Ie)=>{s.push(B.r,B.th,B.sc,B.seed),b.push(B.state,B.ant,B.tint,B.yaw),x.push(re,he,Ie,j())};t.forEach(B=>{if(B.state>0){ce(B,0,j(),1),j()<.55&&ce(B,0,j(),1.15);return}if(T(B)){for(let re=0;re<5;re++)ce(B,0,re/5,1.6);for(let re=0;re<4;re++)ce(B,1,re/4,1);return}if(B.trail){ce(B,0,j(),1),ce(B,0,j(),1),ce(B,1,0,1),ce(B,1,.5,1);return}j()<.3*p&&ce(B,0,j(),1),j()<.4*p&&ce(B,1,j()<.5?0:.5,1)});{const B=oe.billows,re=Math.round(560*p);for(let he=0;he<re;he++)s.push(Math.sqrt(Re(5184,42436,B())),B()*pe,B.range(.55,.9),B()),b.push(0,0,0,0),x.push(3,0,B.range(.3,.5),B())}const ye=Math.round(170*p);for(let B=0;B<ye;B++){const re=j()<.6?j.range(150,208):Math.sqrt(Re(6084,42025,j()));s.push(re,j()*pe,j.range(15,27),j()),b.push(0,0,0,0),x.push(2,0,j.range(.2,.33),j())}const nt=Math.round(84*p),Te=oe.curtain;for(let B=0;B<nt;B++)s.push(Te.range(170,218),-Math.PI/2+Te.range(-1.1,-.12),Te.range(9,14),Te()),b.push(1,0,0,0),x.push(2,0,Te.range(.14,.22),Te());for(let B=0;B<Math.round(32*p);B++)s.push(Te.range(176,218),-Math.PI/2+Te.range(-.12,.33),Te.range(9,14),Te()),b.push(1,0,0,0),x.push(2,0,Te.range(.14,.22),Te());if(n.boulder!==!1){const B=oe.gate,re=c.cleft[0],he=c.cleft[1],Ie=.5+.5*p,wt=Math.round(40*Ie),Bt=Math.round(18*Ie),Dt=Math.round(72*Ie),yt=(Ae,lt,Ye,Ne,Xe,ct)=>{s.push(Ae*re-lt*he,Ye,Ae*he+lt*re,B()),b.push(Ne,B.range(.5,1.6),B.range(-.4,.4),Xe),x.push(4,B(),ct,B())};for(let Ae=0;Ae<wt;Ae++)yt(B.range(12,60),B.sign()*B.range(5.2,12),B.range(1.4,2.4),B.range(1.2,2.6),B.range(14,22),B.range(2.2,3.6));for(let Ae=0;Ae<Bt;Ae++)yt(B.range(5,16),B.sign()*B.range(5,9.5),B.range(.8,2),B.range(2,4),B.range(12,18),B.range(2,3.2));for(let Ae=0;Ae<Dt;Ae++){const lt=Ae&1?1:-1,Ye=B(),Ne=B.range(-1,1),Xe=B.range(.6,5),ct=B.range(5,9),xt=B.range(9,15),pt=B.range(1.8,3),bt=Ye<.5?Ne*6.2:(Ye<.8?1:-1)*6.5,Tt=lt*(Ye<.5?10.9:7+Ne*3.6),st=Ye<.5?0:Ye<.8?1:-1,Oe=Ye<.5?lt:0;(st*re-Oe*he)*ie+(st*he+Oe*re)*le>.15&&yt(bt,Tt,Xe,ct,xt,pt)}}const Ge=new i.InstancedBufferGeometry;Ge.setAttribute("position",new i.BufferAttribute(at,3)),Ge.setIndex([0,1,2,0,2,3]),Ge.setAttribute("iA",new i.InstancedBufferAttribute(new Float32Array(s),4)),Ge.setAttribute("iB",new i.InstancedBufferAttribute(new Float32Array(b),4)),Ge.setAttribute("iS",new i.InstancedBufferAttribute(new Float32Array(x),4)),Ge.instanceCount=x.length/4,W(Ge,dt(!1),3)}const Qe=Math.round(zo*(.5+.5*p)),be={g:new i.InstancedBufferGeometry,A:Ke(Qe,4),B:Ke(Qe,4),S:Ke(Qe,4)};be.g.setAttribute("position",new i.BufferAttribute(at,3)),be.g.setIndex([0,1,2,0,2,3]),be.g.setAttribute("iA",be.A),be.g.setAttribute("iB",be.B),be.g.setAttribute("iS",be.S),be.g.instanceCount=0,W(be.g,dt(!0),3);const gt=[0,0,0,.5,1,0,1,.5,0,.25,0,.75,1,.25,1,.75],et=qt[0]*qt[0],At=(Pt[0]+2)*(Pt[0]+2),Ze=[0,0,0,0,0],Xt=(s,b,x,j)=>{const ce=(b-1)*(b-1),ye=w.uLead.value,nt=be.A.array,Te=be.B.array,Ge=be.S.array;let B=0;Ze[0]=Ze[1]=Ze[2]=Ze[3]=0;for(let re=0,he=0;re<de;re++,he+=8){let Ie,wt,Bt=ce;if(re===$e)Ie=ye.x,wt=ye.z;else if(Fe[re]===1)ro(I,Math.round(Q[he]-800),Q[he+1],Q[he+7],j,Be),Ie=Be[0],wt=Be[2],Bt=(b-1-Be[1])*(b-1-Be[1]);else{const pt=Q[he],bt=Q[he+1]+qe[re]*j;Ie=pt*Math.cos(bt),wt=-pt*Math.sin(bt)}const Dt=Ie-s,yt=wt-x,Ae=Dt*Dt+yt*yt+Bt,lt=Ae<Se[0]?0:Ae<Se[1]?1:Ae<Se[2]?2:3,Ye=Ae<ke[0]?0:Ae<ke[1]?1:Ae<ke[2]?2:3;let Ne=Ce[re];for(Ne>lt?Ne=lt:Ne<Ye&&(Ne=Ye),Ce[re]=Ne;Ze[Ne]>=Z[Ne];)Ne++;const Xe=Ze[Ne]++*4,ct=Je[Ne].A.array,xt=Je[Ne].B.array;if(ct[Xe]=Q[he],ct[Xe+1]=Q[he+1],ct[Xe+2]=Q[he+2],ct[Xe+3]=Q[he+3],xt[Xe]=Q[he+4],xt[Xe+1]=Q[he+5],xt[Xe+2]=Q[he+6],xt[Xe+3]=Q[he+7],Ae<et&&Q[he+4]===0&&Fe[re]===0){const pt=gt,bt=Ae<At?16:8,Tt=Q[he+3];for(let st=0;st<bt&&B<Qe;st+=2,B++){const Oe=B*4,vo=Math.abs(Math.sin(Tt*127.1+st*31.7)*43758.5453)%1;nt[Oe]=Q[he],nt[Oe+1]=Q[he+1],nt[Oe+2]=Q[he+2],nt[Oe+3]=Tt,Te[Oe]=0,Te[Oe+1]=Q[he+5],Te[Oe+2]=Q[he+6],Te[Oe+3]=st<8?0:1,Ge[Oe]=pt[st],Ge[Oe+1]=pt[st+1],Ge[Oe+2]=1,Ge[Oe+3]=vo}}}for(let re=0;re<4;re++){const he=Je[re];he.g.instanceCount=Ze[re];for(const Ie of[he.A,he.B])Ie.clearUpdateRanges(),Ie.addUpdateRange(0,Math.max(4,Ze[re]*4)),Ie.needsUpdate=!0}be.g.instanceCount=B,Ze[4]=B;for(const re of[be.A,be.B,be.S])re.clearUpdateRanges(),re.addUpdateRange(0,Math.max(4,B*4)),re.needsUpdate=!0};{const s=c.pts[0];Xt(s[0],s[1],s[2],0)}await v.yield();const Yt=s=>new i.Vector3(s[0],s[1],s[2]),St=s=>c.path.pointAt(s),[Qt,eo]=c.cleft,Nt=Yt(c.pts[c.pts.length-1]),po={flyThrough:c.pts.map(Yt),portalSeat:{position:Nt.clone(),base:new i.Vector3(Nt.x,0,Nt.z),facing:new i.Vector3(Qt,0,eo),width:8,height:10},viewpoints:{above:St(c.marks.top),wheel:St(.63),arm:St(ee),slide:St(.87),aisle:St(.965)},eye:{center:new i.Vector3(0,0,0),radius:yo},boulderTop:ae,cleftDir:new i.Vector3(Qt,0,eo),sunDir:h.sunDir.clone(),wind:new i.Vector3(1,0,0),uMarks:c.marks};let Gt=null;const Lt=new i.Matrix4,X={on:!!me,u0:c.marks.low1+.005,N:400,s:null,cyc:null,uB:(c.marks.straight0*c.L-14.2)/c.L,p:new i.Vector3,t:new i.Vector3};if(X.on){const s=x=>1.1+1.3*te(1.4,6,x)+te(6,11,x),b=x=>x<=X.uB?x*c.L+6.2+60*(1-te(c.marks.low1+.01,c.marks.wheel1-.02,x)):X.uB*c.L+6.2+14*(1-Math.exp(-(x-X.uB)*c.L/14));X.s=new Float32Array(X.N+1),X.cyc=new Float32Array(X.N+1),X.v=new Float32Array(X.N+1);for(let x=0;x<=X.N;x++){const j=X.u0+(1-X.u0)*(x/X.N);if(X.s[x]=b(j),x){const ce=Math.max(1e-4,c.clockAt(j)-c.clockAt(X.u0+(1-X.u0)*((x-1)/X.N))),ye=Math.max(0,X.s[x]-X.s[x-1])/ce;X.v[x]=ye,X.cyc[x]=X.cyc[x-1]+(X.s[x]-X.s[x-1])/(s(ye)*1.04)}}X.v[0]=X.v[1]}const to=s=>{if(!X.on||s<X.u0){w.uLead.value.set(1e5,0,1e5,0);return}const b=_e((s-X.u0)/(1-X.u0),0,1)*X.N,x=Math.min(X.N-1,Math.floor(b)),j=b-x,ce=Re(X.s[x],X.s[x+1],j);c.path.posAtDist(Math.min(ce,c.L),X.p),c.path.tangentAtDist(Math.min(ce,c.L-.5),X.t),X.t.y=0,X.t.normalize();const ye=-(1.9+2.9*te(X.uB,X.uB+.03,s));w.uLead.value.set(X.p.x-X.t.z*ye,0,X.p.z+X.t.x*ye,Re(X.v[x],X.v[x+1],j)),w.uLeadB.value.set(X.t.x,X.t.z,Re(X.cyc[x],X.cyc[x+1],j))};return{object:R,path:c.path,radius:95,height:60,trueRadius:340,center:new i.Vector3(0,4,0),anchors:po,ground:!0,groundY:-.4,duration:c.duration,pace:c.pace,clockAt:c.clockAt,count:t.length,tiers:{caps:Z,counts:Ze,triangles:De},arms:N,whiteCow:me,light:h,craters:M,eyeSpots:P,beds:We,gazeAt:u,gazePoi:No,river:t.river,slots:t,setLight:J,setLead:to,setGround(s){so(s,I),a.needsUpdate=!0},setClock(s){Gt=s},setProgress(s){Gt=c.clockAt(s),to(s)},update(s,b,x){w.uTime.value=b,w.uClock.value=Gt??b,w.uHaze4.value.z=b,x&&(Lt.copy(R.matrixWorld).invert(),w.uCamL.value.setFromMatrixPosition(x.matrixWorld).applyMatrix4(Lt),w.uCamR.value.setFromMatrixColumn(x.matrixWorld,0).transformDirection(Lt),w.uCamU.value.setFromMatrixColumn(x.matrixWorld,1).transformDirection(Lt)),Xt(w.uCamL.value.x,w.uCamL.value.y,w.uCamL.value.z,w.uClock.value)},dispose(){}}}export{No as GAZE_POI,Ho as GROUND_GLSL,oa as buildHero};
