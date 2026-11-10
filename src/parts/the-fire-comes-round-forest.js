import*as Q from"three";import{clamp as $t,lerp as bt,smoothstep as Rt}from"../kit/core.js";const St=(u,x)=>Math.sqrt(u*u+x*x),jt=(u,x,c)=>Math.sqrt(u*u+x*x+c*c),Fe=u=>{const x=Math.max(Math.min(u,1.25)-.3333333333333333,0)*1.5;return x*x},re=(u,x)=>u.H*Fe(x/u.H),ie=(u,x)=>{const c=Math.min(Math.max(x/u.H-.3333333333333333,0)*1.5,1);return u.H*Math.min(.5*St(u.lx,u.lz),.24)*c*c*c},le={pods:{h:[25,45],ref:35,big:75,crown:8.4,top:1.3},bottles:{h:[22,38],ref:30,big:68,crown:7.6,top:1.24},spires:{h:[30,48],ref:40,big:80,crown:6.8,top:1.2}},Qt={pods:u=>1*(1-.5*u),bottles:u=>u<.62?(1.25+.8*Math.pow(Math.sin(Math.PI*u/.62),.8))*(.7+.3*Math.pow(Math.abs(Math.sin(Math.PI*u/.155)),.6)):bt(.875,.6,Rt(.62,.86,u)),spires:u=>.72*(1-.72*u)+.06},ce={pods:u=>1.5*Math.sqrt(Math.max(0,1-((u-.035)/.08)**2)),bottles:()=>0,spires:u=>1.15*Math.sqrt(Math.max(0,1-((u-.05)/.1)**2))},pe={pods:1.5,bottles:0,spires:1.15},Pe=[60,90],$={belt:60,speed:9,rise:[1.2,2.2],torch:[7,11],sink:4,black:[12,16],grow:50,P:[90,130],clump:40,deep:130,cell:[26,34],Pset:[50,64],lag:[5,8],growLeast:12,before:38,torchSet:[13,18],blackSet:[8,12],hot:[1.8,.72,.09],burst:[1.4,.32,.025]},Be=u=>$t(u-$.before,$.growLeast,$.grow),Ke=.68,we=1.3,Vt=u=>{const x=Math.sin(u*127.1+311.7)*43758.5453;return x-Math.floor(x)},De=u=>{const x=u*9.7;return(Math.floor(x)+.02+.18*(x-Math.floor(x)))/9.7},gt=u=>u-Math.floor(u),Ie=(u,x,c)=>{const U=u.n,j=u.span/U,p=new Float32Array(U*U),E=N=>1-Rt(40,1700,N);for(const N of x){if(!N.pods)continue;const W=E(N.d);if(gt(N.seed*9.7)>=.24+.76*W)continue;const zt=(.55+.45*W)*Math.min(N.pods,6)/6,K=8+.25*N.H,D=c.pe(N.bow?N.x+N.lx*re(N,.7*N.H):N.x+N.lx*.7*N.H),O=c.pn(N.bow?N.z+N.lz*re(N,.7*N.H):N.z+N.lz*.7*N.H),ut=Math.max(0,Math.floor((D-K-u.e0)/j)),Z=Math.min(U-1,Math.ceil((D+K-u.e0)/j)),ht=Math.max(0,Math.floor((O-K-u.n0)/j)),P=Math.min(U-1,Math.ceil((O+K-u.n0)/j));for(let lt=ht;lt<=P;lt++)for(let X=ut;X<=Z;X++){const T=St(u.e0+(X+.5)*j-D,u.n0+(lt+.5)*j-O)/K;if(T<1){const J=1-T*T;p[lt*U+X]+=zt*J*J}}}return p},qe=(u,x)=>{const c=u.data,U=u.n*u.n;for(let j=0;j<U;j++)c[j]=Math.round(255*Math.min(1,x[j]*.8));u.tex.needsUpdate=!0};function _e(u,x){if(!(u.P>0))return"ripe";const c=gt((x+u.off)/u.P)*u.P-u.delay;if(c<0)return"ripe";const U=u.set?$.torchSet:$.torch,j=u.set?$.blackSet:$.black,p=bt(U[0],U[1],gt(u.seed*13.7)),E=bt(j[0],j[1],gt(u.seed*29.3));return c<u.rise?"catching":c<u.rise+p?"torch":c<u.rise+p+$.sink?"sinking":c<u.rise+p+$.sink+E?"black":c<u.rise+p+$.sink+E+Be(u.P)?"growing":"ripe"}function je(u){const x=u.bursts&&u.bursts.places||null,c=$.clump,U=(W,zt=40)=>{let K=-1,D=zt;return x&&x.forEach((O,ut)=>{const Z=Math.abs(O.x-W);O.on!==!1&&Z<D&&(D=Z,K=ut)}),K},j=.6180339887,p=W=>gt(W*j+.37);let E=null;const N=(W,zt=0,K=!1)=>{if(K){const X=$.cell[0],T=Math.floor((W+4*Math.sin(W*.171))/X),J=Math.min(3,Math.floor(Math.max(zt,0)/$.cell[1])),_=(T+.5)*X,ct=_+(Vt(T*3.17+J*.7)-.5)*12,at=u.frontZ(ct)+3+J*$.cell[1],ot=U(_,16);let vt=.5*($.Pset[0]+$.Pset[1]),pt=vt*(E&&E.has(T)?E.get(T):p(T));if(ot>=0){const nt=x[ot],V=$t(Math.ceil(50/nt.period),1,3);vt=V*nt.period,pt=(nt.phase+Math.floor(Vt(T*7.1)*V))*nt.period}return pt-=J*bt($.lag[0],$.lag[1],Vt(T*5.3+J*1.9)),{c:1e6+T*4+J,P:vt,off:pt,ix:ct,iz:at,led:ot,set:!0}}const D=Math.floor((W+5*Math.sin(W*.131))/c),O=(D+.5)*c,ut=O+(Vt(D*3.17)-.5)*14,Z=u.frontZ(ut)+2,ht=U(O);let P=bt($.P[0],$.P[1],Vt(D*1.37+.2)),lt=P*Vt(D*2.91+.7);if(ht>=0){const X=x[ht],T=$t(Math.round(110/X.period),3,6);P=T*X.period,lt=(X.phase+Math.floor(Vt(D*7.1)*T))*X.period}return{c:D,P,off:lt,ix:ut,iz:Z,led:ht,set:!1}};return N.spread=W=>{const zt=new Map;let K=0;for(const O of W)if(O.set&&O.led<0){const ut=Math.floor((O.clump-1e6)/4);zt.set(ut,(zt.get(ut)||0)+1),K++}if(!K)return 0;E=new Map;let D=0;for(const O of[...zt.keys()].sort((ut,Z)=>p(ut)-p(Z)))E.set(O,(D+.5*zt.get(O))/K),D+=zt.get(O);return E.size},N}async function Je(u){const{L:x,plan:c,way:U,forks:j,deal:p,detail:E,pause:N,routePts:W,rockY:zt,zoneD:K}=u,D=le[p.kind]||le.pods,O=u.ctx.noise,ut=je(x),Z=c.lineD,ht=t=>bt(1,.6,Rt(300,1300,t));W.forEach((t,s)=>{t.i=s});const P=32,lt=new Map,X=(t,s)=>(t+4096)*8192+(s+4096);for(const t of W){const s=X(Math.floor(t.x/P),Math.floor(t.z/P));let l=lt.get(s);l||lt.set(s,l=[]),l.push(t)}const T=(t,s,l,d)=>{const w=Math.floor((t-l)/P),z=Math.floor((t+l)/P),b=Math.floor((s-l)/P),q=Math.floor((s+l)/P);for(let dt=w;dt<=z;dt++)for(let mt=b;mt<=q;mt++){const Tt=lt.get(X(dt,mt));if(Tt)for(const Lt of Tt)d(Lt)}},J=(t,s,l,d,w)=>{let z=1/0;return T(t,s,w+48,b=>{const q=Math.max(St(b.x-t,b.z-s)-w,0),dt=b.y>d?b.y-d:b.y<l?l-b.y:0,mt=St(q,dt);mt<z&&(z=mt)}),z},_=t=>.045*t+1.6,ct=(t,s)=>(Qt[p.kind in Qt?p.kind:"pods"](s)+pe[p.kind in pe?p.kind:"pods"])*(t.H/D.ref)*t.girth+_(t.H),at=(t,s=30)=>{const l=t.H*D.top+.6,d=Math.max(8,Math.ceil(l/3)),w=l/d/2;let z=1/0;for(let b=0;b<=d;b++){const q=l*b/d,dt=t.x+t.lx*q,mt=t.z+t.lz*q,Tt=t.y+q,Lt=q<.1*t.H?ct(t,q/t.H):t.r;if(!t.bow){T(dt,mt,Lt+s,Et=>{const Ut=jt(Et.x-dt,Et.y-Tt,Et.z-mt)-Lt-w;Ut<z&&(z=Ut)});continue}const Mt=(Et,Ut)=>{const Yt=t.x+t.lx*Et,Jt=t.z+t.lz*Et;T(Yt,Jt,Lt+s,qt=>{const ae=jt(qt.x-Yt,qt.y-Ut,qt.z-Jt)-Lt-w;ae<z&&(z=ae)})},Kt=ie(t,t.H);if(Mt(re(t,q),Tt-ie(t,q)),q>.2*t.H&&q<t.H){const Et=Math.min(q+.2*t.H,t.H);Mt(re(t,Et),Tt-ie(t,Et))}if(q>t.H){const Et=q-t.H,Ut=St(t.lx,t.lz),Yt=Math.min(2*Ut,1);Mt(t.H+Et*.8*Math.min(2,1/Math.max(Ut,.05)),t.y+t.H-Kt+Et*(1-1.3*Yt)),Mt(t.H,Tt-Kt)}}return z},ot=(t,s,l)=>{let d=1/0,w=0;return T(t,s,l,z=>{const b=St(z.x-t,z.z-s);b<d&&(d=b,w=z.y)}),[d,w]},vt=W.filter((t,s)=>s%20===0),pt=(t,s,l)=>{for(const d of vt)if(St(d.x-t,d.z-s)<l)return!1;return!0},nt=u.lanes?u.lanes.laneNear:()=>99,V=[],At=new Map,ft=(t,s)=>(t+8192)*16384+(s+8192),xt=(t,s,l)=>{const d=Math.floor(t/16),w=Math.floor(s/16);for(let z=d-1;z<=d+1;z++)for(let b=w-1;b<=w+1;b++){const q=At.get(ft(z,b));if(q){for(const dt of q)if(St(dt.x-t,dt.z-s)<Math.max(l,dt.gap||0))return!0}}return!1},kt=t=>{const s=ft(Math.floor(t.x/16),Math.floor(t.z/16));let l=At.get(s);return l||At.set(s,l=[]),l.push(t),V.push(t),t},Pt=36,Ct=60,Nt=t=>Math.max(.31*t,4.5)+.07*t+10,Ft=6,F=(t,s,l,d,w={})=>{const z=c.pe(s),b=c.pn(l),q=Z(s,l),dt=c.setPiece(z,b)>=.5,mt=dt?$.deep:$.belt;if(q<3||w.fuse&&q>mt||w.gate&&q<=mt||q<=mt&&ot(s,l,Pt)[0]<Pt||w.wild&&!w.giant&&t()>Rt(.22,.5,.5+.5*O.n2(s/47+9,l/47+2)))return null;const Tt=.5+.5*O.n2(s/31+40,l/31-7),Lt=t();let Mt=bt(D.h[0],D.h[1],$t(.2*t()+.8*Tt*(.55+.9*t()),0,1))*ht(q),Kt=2+Math.floor(t()*5),Et=6+Math.floor(t()*6);if(Lt<.07?(Mt*=t.range(.7,.95),Kt=0,Et=0):Lt<.11?(Mt*=.45,Kt=0,Et=0):Lt<.24&&(Mt*=t.range(.45,.7),Kt=1+Math.floor(t()*2),Et=4+Math.floor(t()*3)),w.young&&(Mt=t.range(4,11),Kt=t()<.4?1:0,Et=3+Math.floor(t()*3)),w.ledge&&(Mt=Math.min(Mt,t.range(9,16))),w.isle&&(Mt=Math.min(Mt,t.range(18,30)),c.isletAt(z,b)<1.6))return null;w.giant&&(Mt=t.range(Pe[0],Pe[1]),Kt=5+Math.floor(t()*5),Et=10+Math.floor(t()*4));const Ut=Mt/D.ref,Yt=D.crown*(w.giant?.62:1)*Ut+_(Mt)+3.2;let Jt,qt=99;if(w.ledge)Jt=zt(c.sdRock(z,b));else{if(qt=c.watAt(z,b),!w.isle&&qt<(w.young?1:2.6+(w.giant?2:0)))return null;Jt=c.groundAt(s,l)}if(nt(s,l)<3.2+(w.giant?2:0))return null;const ae=w.young?3:w.giant?15:d===0?6.5:5.5;if(xt(s,l,Lt>.96?2.4:ae))return null;let be=t.range(-.045,.045),xe=t.range(-.045,.045);if(qt<16&&!w.isle&&!w.ledge){const Me=c.watAt(z+3,b)-qt,ke=c.watAt(z,b+3)-qt,ze=St(Me,ke)||1,Ae=t.range(.03,.15)*(w.giant?1.5:1)*Rt(16,5,qt);be+=-Me/ze*Ae*c.m,xe+=ke/ze*Ae}const te={x:s,y:Jt,z:l,d:q,H:Mt,r:Yt,level:d,young:!!w.young,giant:!!w.giant,isle:!!w.isle,gap:ae,turn:t()*6.2832,girth:t.range(.85,1.25),lx:be,lz:xe,pods:Kt,plumes:Et,seed:w.giant?De(t()):t(),wat:qt};let ue=at(te,Ft+2);if(ue<Ft&&!w.isle&&(te.lx=t.range(-.02,.02),te.lz=t.range(-.02,.02),ue=at(te,Ft+2)),ue<Ft)return null;const ye=q<=mt&&c.sdMoat(z,b)>=Ct+Nt(Mt);if(w.fuse&&!ye)return null;const Ot=ye?ut(s,q,dt):null;return Object.assign(te,{P:Ot?Ot.P:0,off:Ot?Ot.off:0,delay:Ot?St(s-Ot.ix,l-Ot.iz)/$.speed+.6*t():0,rise:t.range($.rise[0],$.rise[1]),clump:Ot?Ot.c:-1,led:Ot?Ot.led:-1,set:Ot?Ot.set:!1}),kt(te)},B=W.filter(t=>t.way>U.rideLevel-40&&t.way<U.rideEnd+40),tt=W.filter(t=>t.way>0&&t.way<U.rideLevel-40),st=W.filter(t=>t.way>U.turn2Start+20&&t.way<U.shore+6);await N();const I=(t,s,l,d)=>{const w=s[Math.floor(t()*s.length)],z=W[Math.max(0,w.i-1)],b=W[Math.min(W.length-1,w.i+1)],q=b.x-z.x,dt=b.z-z.z,mt=St(q,dt)||1,Tt=t.range(l,d)*(t()<.5?-1:1);return[w.x-dt/mt*Tt,w.z+q/mt*Tt]},et=(t,s)=>{const l=c.at(t);return[c.wx(l[0]-Math.cos(l[2])*s),c.wz(l[1]+Math.sin(l[2])*s)]},G=(t,s)=>c.watAt(c.pe(t),c.pn(s));let C=0;const o=async(t,s,l,d,w=300)=>{let z=0;for(let b=0;b<l&&z<s;b++)d()&&z++,++C%w===0&&await N();return z},h=j.near,v=j.mid,a={giants:0,banks:0,belt:0,isles:0,beltBehind:0,ranks:0,rims:0,last:0,shores:0,ledges:0,fuse:0,young:0},n=U.rideEnd-20,r=U.turn2Start+70;for(const[t,s,l]of[[tt,7,90],[B,9,80],[st,5,110]])t.length&&(a.giants+=await o(h,Math.round(s*E),700,()=>{const[d,w]=I(h,t,24,l),z=G(d,w);return z>4&&z<30?F(h,d,w,0,{giant:!0}):null}));const i=W.filter(t=>t.way>60&&t.way<U.rideEnd+40);a.banks=await o(h,Math.round(88*E),6e3,()=>{const[t,s]=I(h,i,16,88),l=G(t,s);return l>2.6&&l<30?F(h,t,s,0,{wild:!0}):null}),a.belt=await o(h,Math.round(34*E),5e3,()=>{const[t,s]=et(h.range(n,r),h.range(36,108));return F(h,t,s,0,{fuse:!0})}),a.isles=await o(h,Math.round(9*E),4e3,()=>{const[t,s]=et(h.range(n,r),h.range(22,78));return c.isletAt(c.pe(t),c.pn(s))>1.6?F(h,t,s,0,{fuse:!0,isle:!0}):null}),a.beltBehind=await o(v,Math.round(120*E),7e3,()=>{const[t,s]=et(v.range(n,r),v.range(84,176));return F(v,t,s,1,{fuse:!0})}),i.length&&(a.ranks=await o(v,Math.round(110*E),6e3,()=>{const[t,s]=I(v,i,30,128);return G(t,s)>18?F(v,t,s,1,{wild:!0}):null})),a.rims=await o(v,Math.round(60*E),5e3,()=>{const[t,s]=et(v.range(n,r),v()<.6?-v.range(48,140):v.range(100,190));return Z(t,s)>$.deep?F(v,t,s,1,{wild:!0}):null}),st.length&&(a.last=await o(v,Math.round(70*E),6e3,()=>{const[t,s]=I(v,st,40,150);return Z(t,s)>$.deep?F(v,t,s,1,{wild:!0}):null}));const f=u.PLAN.moat,e=u.PLAN.rock,m=u.PLAN.K;a.shores=await o(v,Math.round(60*E),6e3,()=>{const t=v.range(f.a[0]-60,f.a[1]+60),s=v.range(f.c[0]-60,f.c[1]+60),[l,d]=c.fromLocal(t,s),w=c.sdMoat(l,d);return w<0||w>56?null:F(v,c.wx(l),c.wz(d),1,{wild:!0})}),a.ledges=await o(v,Math.round(16*E),2500,()=>{const t=v.range(e.a[0],e.a[1]),s=v.range(e.c[0],e.c[1]),[l,d]=c.fromLocal(t,s),w=c.sdRock(l,d)/m,z=t/m,b=Math.abs(s)/m;return z>-140&&z<-98&&b>31&&b<63||z>-103&&z<72&&b<84.5||Math.abs(s)<46*m||!(w<-3.8&&w>-6.6||w<-11.4&&w>-14.4)?null:F(v,c.wx(l),c.wz(d),1,{ledge:!0})});let M=1/0,H=-1/0;for(const t of W)M=Math.min(M,t.x),H=Math.max(H,t.x);a.fuse=await o(v,Math.round(80*E),7e3,()=>{const t=v.range(M-500,H+500),s=x.frontZ(t)+v.range(4,62);return pt(t,s,500)?null:F(v,t,s,1,{fuse:!0})}),i.length&&(a.young=await o(v,Math.round(36*E),5e3,()=>{const[t,s]=I(v,i,18,70),l=G(t,s);return l>1&&l<9?F(v,t,s,1,{young:!0}):null})),await N();const R=new Map;if(u.lanes&&u.lanes.lanes)for(const t of u.lanes.lanes)for(const s of t.world){const l=X(Math.floor(s[0]/P),Math.floor(s[2]/P));let d=R.get(l);d||R.set(l,d=[]),d.push(s)}const g=(t,s)=>{let l=128;const d=Math.floor(t/P),w=Math.floor(s/P);for(let z=d-4;z<=d+4;z++)for(let b=w-4;b<=w+4;b++){const q=R.get(X(z,b));if(q)for(const dt of q){const mt=St(dt[0]-t,dt[2]-s);mt<l&&(l=mt)}}return l},k=U.turn2Start,y=W.filter(t=>t.way>k&&t.way<U.shore+30&&t.i%3===0),S=(t,s)=>{let l=1/0;for(const d of y){const w=St(d.x-t,d.z-s);w<l&&(l=w)}return l},L=90,A=30,Y={moat:0,channel:0,files:0},rt=(t,s,l)=>{const d=c.sdMoat(c.pe(t),c.pn(s))-l<Ct?"moat":S(t,s)-l<L?"channel":g(t,s)-l-4<A?"files":null;return d&&Y[d]++,!d},wt=t=>Math.max(.31*t,4.5)+.07*t;for(const t of V)t.P>0&&!rt(t.x,t.z,Nt(t.H))&&Object.assign(t,{P:0,off:0,delay:0,clump:-1,led:-1,set:!1});await N(),a.setColumns=ut.spread(V);for(const t of V)if(t.set&&t.P>0){const s=ut(t.x,t.d,!0);t.off=s.off}const it=j.cards,yt=[];await o(it,Math.round(1050*E),22e3,()=>{const t=W[Math.floor(it()*W.length)],s=it()*6.2832,l=60+190*Math.sqrt(it()),d=t.x+Math.cos(s)*l,w=t.z+Math.sin(s)*l,z=Z(d,w),b=c.pe(d),q=c.pn(w);if(z<(c.setPiece(b,q)>=.5?$.deep:$.belt)+2||K(b,q)>14||it()>Rt(.14,.5,.5+.5*O.n2(d/47+9,w/47+2)))return null;const dt=it.range(26,40);if(ot(d,w,72)[0]<64||c.watAt(b,q)<.5*dt+2||xt(d,w,9))return null;const mt=it()<.07,Tt=(mt?it.range(1.35,1.8)*D.h[1]:bt(.5*D.h[0],D.h[1],Math.pow(it(),.7)))*ht(z),Lt=c.groundAt(d,w);return yt.push({x:d,y:Lt,z:w,d:z,W:mt?dt*1.2:dt,H:Tt,variant:Math.floor(it()*6),turn:it()*6.2832,seed:it(),P:0,off:0,delay:0,clump:-1}),!0},900),await o(it,Math.round(380*E),7e3,()=>{const t=it.range(M-1500,H+1500),s=x.frontZ(t)+it.range(3,60),l=Z(t,s);if(l<2||l>$.belt)return null;const d=c.pe(t),w=c.pn(s),z=it.range(24,36);if(c.watAt(d,w)<.5*z||xt(t,s,9)||c.sdMoat(d,w)<Ct+.5*z+6)return null;const b=ut(t,l,c.setPiece(d,w)>=.5);return yt.push({x:t,y:c.groundAt(t,s),z:s,d:l,W:z,H:bt(.6*D.h[0],D.h[1],Math.pow(it(),.7)),variant:Math.floor(it()*6),turn:it()*6.2832,seed:it(),P:b.P,off:b.off,delay:St(t-b.ix,s-b.iz)/$.speed+.6*it(),rise:it.range($.rise[0],$.rise[1]),clump:b.c,set:b.set}),!0}),await N();const Ht=j.mist,Dt=[];for(let t=0;t<700&&Dt.length<Math.round(46*E);t++){const[s,l]=et(Ht.range(n,r),Ht.range(-44,118)),d=c.pe(s),w=c.pn(l);c.sdAsh(d,w)>-4||ot(s,l,48)[0]<30||Dt.push({x:s,y:c.groundAt(s,l),z:l,H:Ht.range(5,10),W:Ht.range(36,70),seed:Ht(),d:Z(s,l)})}const Bt=[];for(let t=0;t<1500&&Bt.length<Math.round(18*E);t++){const[s,l]=et(Ht.range(n,r),Ht.range(26,110)),d=c.pe(s),w=c.pn(l),z=Z(s,l),b=Ht.range(3,7),q=Ht();z<6||z>(c.setPiece(d,w)>=.5?$.deep:$.belt)||c.sdMoat(d,w)<Ct+.6*b+4||c.isletAt(d,w)<1.2||ot(s,l,40)[0]<26||xt(s,l,5)||S(s,l)-.6*b-1<L||g(s,l)-.6*b-5<A||Bt.push({x:s,y:c.groundAt(s,l),z:l,H:b,seed:q,d:z})}await N();for(const t of yt)t.P>0&&!rt(t.x,t.z,.5*t.W)&&Object.assign(t,{P:0,off:0,delay:0,clump:-1,set:!1});for(let t=Bt.length-1;t>=0;t--)rt(Bt[t].x,Bt[t].z,.6*Bt[t].H+1)||Bt.splice(t,1);a.neverCatchBy=Y;const ee=(t,s,l)=>{let d=1/0,w=-1;return T(t,s,l,z=>{const b=St(z.x-t,z.z-s);b<d&&(d=b,w=z.way)}),[d,w]},fe=.5+.5*O.n2(.37,9.1),_t=t=>.5+.5*Math.cos(6.2832*(t/290+fe+.2*O.n2(t/230+3.1,7.7))),It={taken:0,greater:0,gates:0,gatesAtWay:[]},Zt=U.rideEnd+30,Xt=[],ne=t=>{if(t.giant||t.isle||t.P>0)return!0;const[s,l]=ee(t.x,t.z,144);if(l<0||l>=Zt||s>=140)return!0;const d=_t(l),w=Rt(.5,.2,d),z=Rt(.6,.85,d),b=gt(t.seed*13.7+.31),q=t.pods===0,dt=gt(t.seed*9.7)<.24,mt=t.level===0?s<62?bt(bt(.34,.6,z),.1,w)*(q?.3:1):bt(.62,.3,w)*(q?.5:1):s<62?bt(bt(.2,.4,z),.06,w):dt?bt(.72,.5,w):bt(.45,.3,w);if(b>=mt)return!1;if(t.level===0&&!q&&s<75){const Tt=t.H,Lt=t.r,Mt=Math.min(Math.max(Tt,56),Tt*(1.24+.16*gt(t.seed*5.1)));t.H=Mt,t.r=D.crown*(Mt/D.ref)+_(Mt)+3.2,at(t,Ft+2)<Ft?(t.H=Tt,t.r=Lt):(t.pods=Math.max(t.pods,4),It.greater++)}return!0};for(let t=0;t<V.length;t++)ne(V[t])?Xt.push(V[t]):It.taken++,t%60===59&&await N();V.length=0,At.clear();for(const t of Xt)kt(t);{let t=0;for(let s=yt.length-1;s>=0;s--){const l=yt[s];if(l.P>0)continue;const[d,w]=ee(l.x,l.z,152);w<0||w>=Zt||d>=150||gt(l.seed*13.7+.31)>=bt(.75,.4,Rt(.5,.2,_t(w)))&&(yt.splice(s,1),t++)}It.cardsTaken=t}const se=(t,s)=>{const l=c.pe(t.x),d=c.pn(t.z),w=c.watAt(l,d),z=c.watAt(l+3,d)-w,b=c.watAt(l,d+3)-w,q=St(z,b)||1;return[-z/q*s*c.m,b/q*s]},Wt=j.gates;if(Wt)for(let t=Math.max(U.rideMouth-30,240);t<U.rideEnd-30;t+=10){const s=_t(t);if(!(s<.9||s<_t(t-10)||s<=_t(t+10))){for(const l of[1,-1]){let d=null;for(let b=0;b<220&&!d;b++){const q=b>=110,[dt,mt]=et(t+Wt.range(-30,30)*(q?1.7:1),l*Wt.range(12,q?92:70)),Tt=G(dt,mt);Tt>=(q?8:10)&&Tt<=(q?26:18)&&(d=F(Wt,dt,mt,0,{giant:!0,gate:!0}))}if(await N(),!d)continue;const w=d.lx,z=d.lz;{const[b,q]=ee(d.x,d.z,144),dt=et(q,0),mt=(dt[0]-d.x)/Math.max(b,1),Tt=(dt[1]-d.z)/Math.max(b,1);let Lt=!1;if(d.bow=1,q>=0&&b<140)for(const Mt of[.96,.8,.62]){const Kt=Math.min(Mt*b/d.H,.85);if(d.lx=mt*Kt,d.lz=Tt*Kt,at(d,Ft+2)>=Ft){Lt=!0,It.gatesMeet=(It.gatesMeet||0)+(Mt>.9?1:0);break}}if(Lt)d.pods=Math.max(d.pods,6);else{d.lx=w,d.lz=z;for(const Mt of[.2,.13]){if([d.lx,d.lz]=se(d,Mt),at(d,Ft+2)>=Ft)break;d.lx=w,d.lz=z}}}It.gates++,It.gatesAtWay.push(Math.round(t))}await N()}}if(Wt)for(let t=0,s=0;t<400&&s<Math.round(10*E);t++){const[l,d]=et(Wt.range(U.turn2End-30,U.shore+120),Wt.range(-110,110)),w=c.pe(l),z=c.pn(d);c.watAt(w,z)>-8||c.sdRock(w,z)<70||ot(l,d,48)[0]<30||(Dt.push({x:l,y:c.groundAt(l,d),z:d,H:Wt.range(4,7.5),W:Wt.range(34,64),seed:Wt(),d:Z(l,d)}),s++)}a.order=It;{const t=p.kind in Qt?p.kind:"pods",s=t==="spires"?.05:.035;let l=0;for(const d of V){const w=d.H/D.ref*d.girth,z=Qt[t](s)*w,b=(Qt[t](s)+pe[t])*w*1.05,q=(d.isle?c.isletAt(c.pe(d.x),c.pn(d.z)):d.wat)-2;d.foot=b>z+1e-6?$t((q-z)/(b-z),0,1):1,d.foot<1&&l++}a.lesserFeet=l}const Gt=new Map,he=(t,s,l)=>{const d=X(Math.floor(t/P),Math.floor(s/P));let w=Gt.get(d);w||Gt.set(d,w=[]),w.push([t,s,l])};for(const t of V)t.P>0&&he(t.x,t.z,wt(t.H));for(const t of yt)t.P>0&&he(t.x,t.z,.5*t.W);for(const t of Bt)he(t.x,t.z,.6*t.H+1);const de=(t,s)=>{let l=160;const d=Math.floor(t/P),w=Math.floor(s/P);for(let z=d-5;z<=d+5;z++)for(let b=w-5;b<=w+5;b++){const q=Gt.get(X(z,b));if(q)for(const dt of q){const mt=St(dt[0]-t,dt[1]-s)-dt[2];mt<l&&(l=mt)}}return l};{let t=160;if(u.lanes&&u.lanes.lanes)for(const s of u.lanes.lanes)for(const l of s.world)t=Math.min(t,de(l[0],l[2]));a.filesToWhatBurns=+t.toFixed(1)}await N();const We=(t,s,l)=>!pt(t,s,l);if(u.podMap){const t=Ie(u.podMap,V,c);await N(),qe(u.podMap,t)}await N();const Oe=(()=>{const t=b=>c.sdMoat(c.pe(b.x),c.pn(b.z)),s=b=>Number.isFinite(b)?+b.toFixed(1):"none",l={fusePlantFoot:1/0,torchAndBursts:1/0,burningCard:1/0,spotFire:1/0};let d=0,w=0;for(const b of V)if(b.P>0){const q=t(b);l.fusePlantFoot=Math.min(l.fusePlantFoot,q),l.torchAndBursts=Math.min(l.torchAndBursts,q-Nt(b.H)),b.set?w=Math.max(w,b.d):d=Math.max(d,b.d)}for(const b of yt)b.P>0&&(l.burningCard=Math.min(l.burningCard,t(b)-.5*b.W));for(const b of Bt)l.spotFire=Math.min(l.spotFire,t(b)-.6*b.H-1);const z=Math.min(l.torchAndBursts,l.burningCard,l.spotFire);return{need:Ct,ok:z>=Ct,fusePlantFoot:s(l.fusePlantFoot),torchAndBursts:s(l.torchAndBursts),burningCard:s(l.burningCard),spotFire:s(l.spotFire),farthestCatchingFromLine:+d.toFixed(1),inTheSetPiece:+w.toFixed(1),belt:$.belt,beltOfTheSetPiece:$.deep}})(),ge=await Ze(u,{K:D,plants:V,cards:yt,drifts:Dt,spots:Bt,count:a,moatLeast:Oe,burnNear:de,airOf:J,airPlant:at,nearRoute:We,fuseAt:ut,heightK:ht,x0:M,x1:H,tools:{airOf:J,routeAt:ot,sidePt:et,beside:I,watOf:G,lowPts:B,bankPts:i,lastPts:st,flatA:n,flatB:r,laneNear:nt}});return ge.burnNear=de,ge}function oe(u,x,c){const U=le[u],j=x===2,p=x!==1,E=j?U.big:U.ref,N=E/U.ref,W=j?N*.62:1,zt=j?1.5:1,K=[],D=[],O=[],ut=[],Z=[],ht=[],P=(F,B,tt,st)=>{K.push(F[0],F[1],F[2]);const I=jt(B[0],B[1],B[2])||1;return D.push(B[0]/I,B[1]/I,B[2]/I),O.push(tt[0],tt[1],tt[2]),ut.push(st[0],st[1],st[2],st[3]),K.length/3-1},lt=c.range(-1,1),X=c.range(-1,1),T=c.range(0,6.28),J=.02*E,_=F=>Qt[u](F)*N,ct=F=>{const B=F/E;return[J*lt*Math.sin(B*3.1+T)*B,J*X*Math.sin(B*2.3+T*1.7)*B]},at=u==="bottles"?.86*E:E,ot=j?14:p?12:6,vt=u==="bottles"?(p?[0,.0775,.155,.2325,.31,.3875,.465,.5425,.62,.74,.86]:[0,.0775,.155,.2325,.31,.3875,.465,.5425,.62,.86]).map(F=>F/.86):u==="spires"?j?[0,.025,.06,.1,.135,.16,.3,.4,.5,.6,.69,.77,.85,.93,1]:p?[0,.025,.06,.1,.135,.16,.3,.5,.75,1]:[0,.05,.15,.5,1]:j?[0,.02,.045,.08,.105,.125,.25,.38,.5,.6,.69,.77,.85,.93,1]:p?[0,.02,.045,.08,.105,.125,.25,.45,.7,1]:[0,.04,.115,.5,1],pt=F=>_(F)+ce[u](Math.max(F,0))*N;vt.forEach(F=>{const B=at*F,tt=B/E,[st,I]=ct(B),et=u==="bottles"?tt<.63:ce[u](tt)>.02,G=$t((pt(tt+.004)-pt(Math.max(tt-.004,0)))/(E*(tt<.004?.004:.008)),-2.5,2.5);for(let C=0;C<=ot;C++){const o=C/ot*6.2832,h=pt(tt)*(et&&ot>6?C%2?u==="bottles"?.89:.93:1.05:1);P([st+h*Math.cos(o),B-(F===0?.6:0),I+h*Math.sin(o)],[Math.cos(o),.1-G,Math.sin(o)],[st,B,I],[0,ce[u](Math.max(tt,0))*N/Math.max(pt(tt),.001),tt,C/ot])}});for(let F=0;F<vt.length-1;F++)for(let B=0;B<ot;B++){const tt=F*(ot+1)+B,st=tt+ot+1;Z.push(tt,st,tt+1,tt+1,st,st+1)}const nt=(F,B,tt,st,I,et)=>{const G=F.map((C,o)=>{const h=F[Math.max(0,o-1)],v=F[Math.min(F.length-1,o+1)],a=v[0]-h[0],n=v[2]-h[2],r=St(a,n)||1,i=-n/r,f=a/r,e=o/(F.length-1);return[P([C[0]-i*B,C[1],C[2]-f*B],et,I,[tt,st,e,-1]),P([C[0]+i*B,C[1],C[2]+f*B],et,I,[tt,st,e,1])]});for(let C=0;C<G.length-1;C++)Z.push(G[C][0],G[C][1],G[C+1][0],G[C+1][0],G[C][1],G[C+1][1])},V=(F,B,tt,st,I)=>{const G=K.length/3;F.forEach((C,o)=>{const h=F[Math.max(0,o-1)],v=F[Math.min(F.length-1,o+1)];let a=[v[0]-h[0],v[1]-h[1],v[2]-h[2]];const n=jt(a[0],a[1],a[2])||1;a=[a[0]/n,a[1]/n,a[2]/n];let r=[-a[2],0,a[0]];const i=jt(r[0],r[1],r[2])||1;r=[r[0]/i,0,r[2]/i];const f=[a[1]*r[2]-a[2]*r[1],a[2]*r[0]-a[0]*r[2],a[0]*r[1]-a[1]*r[0]],e=o/(F.length-1),m=bt(B,tt,e);for(let M=0;M<4;M++){const H=M/4*6.2832,R=Math.cos(H),g=Math.sin(H),k=r[0]*R+f[0]*g,y=r[1]*R+f[1]*g,S=r[2]*R+f[2]*g;P([C[0]+k*m,C[1]+y*m,C[2]+S*m],[k,y,S],I,[4,st,e,M/4])}});for(let C=0;C<F.length-1;C++)for(let o=0;o<4;o++){const h=G+C*4+o,v=G+C*4+(o+1)%4;Z.push(h,v,h+4,v,v+4,h+4)}},At=(F,B,tt,st,I)=>{const et=Math.cos(tt),G=Math.sin(tt),C=[et,.25,G],o=Math.max(I,.08)*st,h=(v,a)=>[B[0]+et*v*o,B[1]+a*st,B[2]+G*v*o];nt(p?[B,h(.42,.34),h(.78,.68),h(1,1)]:[B,h(.6,.5),h(1,1)],.1*st+.45,2,F,B,C)},ft=(F,B,tt,st,I)=>{const et=j?10:p?8:5,G=jt(B[0],B[1],B[2]),C=[B[0]/G,B[1]/G,B[2]/G];let o=[C[1],-C[0],0];const h=jt(o[0],o[1],o[2])||1;o=[o[0]/h,o[1]/h,o[2]/h];const v=[C[1]*o[2]-C[2]*o[1],C[2]*o[0]-C[0]*o[2],C[0]*o[1]-C[1]*o[0]],a=M=>[F[0]+C[0]*tt*M,F[1]+C[1]*tt*M,F[2]+C[2]*tt*M],n=p?[[.14,.4],[.47,.96],[.8,.86]]:[[.3,.7],[.72,1]],r=P(a(0),[-C[0],-C[1],-C[2]],F,[1,I,0,.5]),i=[];for(const[M,H]of n){const R=a(M),g=[];for(let k=0;k<=et;k++){const y=k/et*6.2832,S=Math.cos(y),L=Math.sin(y),A=o[0]*S+v[0]*L,Y=o[1]*S+v[1]*L,rt=o[2]*S+v[2]*L,wt=(M-.55)*1.3;g.push(P([R[0]+A*st*H,R[1]+Y*st*H,R[2]+rt*st*H],[A+C[0]*wt,Y+C[1]*wt,rt+C[2]*wt],F,[1,I,M,k/et]))}i.push(g)}const f=P(a(1),C,F,[1,I,1,.5]),e=i.length;for(let M=0;M<et;M++)Z.push(r,i[0][M+1],i[0][M]),Z.push(f,i[e-1][M],i[e-1][M+1]);for(let M=0;M<e-1;M++)for(let H=0;H<et;H++)Z.push(i[M][H],i[M][H+1],i[M+1][H],i[M+1][H],i[M][H+1],i[M+1][H+1]);const m=a(.55);ht.push({n:I,x:m[0],y:m[1],z:m[2],r:st,hp:$t(F[1]/E,0,1.25)})},xt=(F,B,tt,st,I)=>{const[et,G]=ct(B),C=_(B/E),o=Math.cos(tt),h=Math.sin(tt),v=[et+o*C*.5,B,G+h*C*.5],a=[et+o*st,B+I,G+h*st],n=[et+o*(C+.55*(st-C)),B+I*.92,G+h*(C+.55*(st-C))];if(p)V([v,n,a],.5*N,.27*N,F,[et,B,G]);else{const r=.55*N,i=.3*N,f=[et,B,G],e=[-h,0,o],m=P([v[0],v[1]-r,v[2]],e,f,[4,F,0,.25]);P([v[0],v[1]+r,v[2]],e,f,[4,F,0,.75]),P([a[0],a[1]+i,a[2]],e,f,[4,F,1,.75]),P([a[0],a[1]-i,a[2]],e,f,[4,F,1,.25]),Z.push(m,m+1,m+2,m,m+2,m+3)}return{e:a,ca:o,sa:h}},kt=j?9:p?6:3,Pt=j?[4,1,7,2,6,0,8,3,5]:p?[3,0,5,2,4,1]:[1,2,0],Ct=c.range(0,6.28),Nt=[];if(u==="bottles"){const[F,B]=ct(at);ft([F,at-.3,B],[.05,1,.03],.26*E*(j?.7:1),.09*E*(j?.7:1),0);for(let I=1;I<kt;I++){const et=(Pt[I]+.5)/kt,G=E*(.3+.5*et),C=Ct+Pt[I]*2.4+c.range(-.3,.3),o=c.range(.9,1.5)*zt,h=xt(I,G,C,_(G/E)+c.range(2.2,3.4)*W,c.range(.5,1.4)*W);Nt.push(h),ft([h.e[0],h.e[1]-.1*N,h.e[2]],[h.ca*.1,-1,h.sa*.1],2.5*o,o,I)}const tt=j?12:p?9:5,st=c.range(0,6.28);for(let I=0;I<tt;I++){const et=st+I*6.2832/tt+c.range(-.3,.3);At(I,[F+Math.cos(et)*1.1*N,at-.5,B+Math.sin(et)*1.1*N],et,(I%3?c.range(5,7.5):c.range(8,9.5))*W,c.range(.3,.46))}}else if(u==="spires"){const F=p?2:1,B=Math.ceil(kt/F);for(let G=0;G<B;G++){const C=E*(.9-.44*G/B),o=Ct+G*2.2+c.range(-.3,.3),h=xt(G,C,o,c.range(3.2,4.8)*W,c.range(.4,1)*W),v=c.range(7,10)*W,a=h.e;Nt.push(h),nt([a,[a[0]+h.ca*.2,a[1]-v,a[2]+h.sa*.2]],.2*N,3,0,a,[h.ca,.2,h.sa]);for(let n=0;n<F&&G*F+n<kt;n++){const r=(n+.75)/(F+.3),i=c.range(.8,1.3)*zt*(n?1.15:.9);ft([a[0]+h.ca*.2*r,a[1]-v*r+1.25*i,a[2]+h.sa*.2*r],[.06*h.ca,-1,.06*h.sa],2.5*i,i,Pt.indexOf(G*F+n))}}const[tt,st]=ct(E),I=j?9:p?7:4,et=c.range(0,6.28);for(let G=0;G<I;G++){const C=et+G*6.2832/I+c.range(-.3,.3);At(G,[tt,E-.3,st],C,(G%3?c.range(4,6):c.range(6.5,7.6))*W,c.range(.08,.22))}}else{for(let I=0;I<kt;I++){const et=Pt[I],G=(et+.5)/kt,C=E*(.42+.46*G+c.range(-.015,.015)),o=Ct+et*2.4+c.range(-.3,.3),h=bt(2.3,1.35,G)*c.range(.88,1.1)*(j?1.25:1),v=xt(I,C,o,bt(5.6,3.2,G)*W*c.range(.88,1.08),c.range(.8,1.8)*W);Nt.push(v),ft([v.e[0],v.e[1]-.15*N,v.e[2]],[v.ca*.12,-1,v.sa*.12],2.5*h,h,I)}const[F,B]=ct(E),tt=j?14:p?11:6,st=c.range(0,6.28);for(let I=0;I<tt;I++){const et=st+I*6.2832/tt+c.range(-.3,.3);At(I,[F,E-.3,B],et,(I%3?c.range(5.5,8):c.range(8.5,10))*W,c.range(.1,.28))}}const Ft=new Q.InstancedBufferGeometry;return Ft.setAttribute("position",new Q.Float32BufferAttribute(K,3)),Ft.setAttribute("normal",new Q.Float32BufferAttribute(D,3)),Ft.setAttribute("aC",new Q.Float32BufferAttribute(O,3)),Ft.setAttribute("aK",new Q.Float32BufferAttribute(ut,4)),Ft.setIndex(Z),{geometry:Ft,triangles:Z.length/3,podAt:ht,ref:E}}const Te=u=>`vec3(${u[0].toFixed(3)}, ${u[1].toFixed(3)}, ${u[2].toFixed(3)})`,Se=`
#define FIRE_PLANT 4.2
#define TORCH_HOT ${Te($.hot)}
#define BURST_HOT ${Te($.burst)}
#define AMBER vec3(1., .43, .07)
#define SEAM_MAX ${Ke.toFixed(2)}
// A RIPE PLANT'S LANTERNS: of the plants at d metres from the line this share has its seams lit (a quarter of the
// far forest, all by the line: amber points, denser toward the fire; every giant is one of them); x: 1 if this plant
// (by its own dealt number) is one of them, y: how strongly its seams show
vec2 fuLit(float d, float seed){ float r = wRipe(d), lit = step(fract(seed*9.7), .24 + .76*r); return vec2(lit, mix(.06, .55 + .45*r, lit)); }

// the phase of a plant in its clump's cycle (s; under 0: ripe and waiting), by the world clock alone
float fuPhase(vec4 f){ return f.x > 0. ? fract((uFcrT + f.y)/f.x)*f.x - f.z : -1.; }
// the ends of its torch, its sinking, its black snag and its growing back (s of phase)
vec4 fuEnds(vec4 f, float seed){
  float st = step(f.w, 0.);
  float t2 = abs(f.w) + mix(${$.torch[0].toFixed(1)} + ${($.torch[1]-$.torch[0]).toFixed(1)}*fract(seed*13.7), ${$.torchSet[0].toFixed(1)} + ${($.torchSet[1]-$.torchSet[0]).toFixed(1)}*fract(seed*13.7), st), t3 = t2 + ${$.sink.toFixed(1)};
  float t4 = t3 + mix(${$.black[0].toFixed(1)} + ${($.black[1]-$.black[0]).toFixed(1)}*fract(seed*29.3), ${$.blackSet[0].toFixed(1)} + ${($.blackSet[1]-$.blackSet[0]).toFixed(1)}*fract(seed*29.3), st);
  return vec4(t2, t3, t4, t4 + clamp(f.x - ${$.before.toFixed(1)}, ${$.growLeast.toFixed(1)}, ${$.grow.toFixed(1)}));
}
// NO PALE SKIN: what the fire's light gives a plant's skin beyond a deep orange is taken back (by the value alone,
// the same at every look), so that a trunk beside the line is dark with an orange side and never cream or white
vec3 fuDeep(vec3 c){ return c/(1. + 1.2*max(c.r - .22, 0.)); }
// the wind at a place: the air is drawn toward the line and goes with the visit's wind (uWind); x metres of play at a crown's tip
vec3 fuWind(vec3 foot, vec4 Lf, float d, float seed){
  vec2 wd = normalize(normalize(Lf.xz + vec2(1e-4, -1e-4))*uWind.w + uWind.xy);
  float amp = mix(1.2, .3, smoothstep(100., 1300., d))*uWind.z;
  float own = sin(uFcrT*(.9 + .5*fract(seed*7.1)) + seed*40.);
  float gust = smoothstep(.55, 1., sin(dot(foot.xz, vec2(.011, .019)) + uFcrT*.78 + 2.*sin(uFcrT*.11)));   // through the crowns every 6 to 10 s
  return vec3(wd, amp*(.45 + .25*own + .55*gust));
}
`,Ee=`
attribute vec3 aC; attribute vec4 aK, iA, iB, iC, iD;
// iA: foot x, y, z, turn (and 8 times the bulb's share in sevenths: stage E). iB: scale, girth (under 0 in the mirror: a giant), lean x, lean z. iC: pods, plumes, seed, d (m from the line). iD: P, offset, delay, rise
uniform vec4 uShape;             // x reference height (m), y share of the dealt pods this shape shows, z of the plumes, w 1 on a near shape
varying vec3 vW, vN; varying vec4 vK, vS, vL, vF; varying vec3 vA;
void main(){
  float kind = aK.x, refH = uShape.x, d = iC.w, seed = iC.z, s = iB.x, rise = abs(iD.w);
  float ripe = wRipe(d);
  float ph = fuPhase(iD); vec4 e = fuEnds(iD, seed);
  float act = step(0., ph)*(1. - step(e.w, ph));
  bool part = kind > .5 && kind < 2.5;                                      // a pod or a plume: it folds about its anchor
  float hp = clamp((part ? aC.y : position.y)/max(refH, 1e-3), 0., 1.25);              // how high on the plant this part sits
  float tc = hp*rise;                                                       // the fire's edge reaches it then
  float back = clamp((ph - e.z)/max(e.w - e.z, 1e-3), 0., 1.);                       // pods and plumes come back at one rate
  // a pod swells a little as the fire comes up to it and is gone in half a second (its burst is a card of the torches' mesh)
  float gPod = mix(1., ph < e.z ? (1. + .2*smoothstep(tc - .5, tc + .1, ph))*(1. - smoothstep(tc + .12, tc + .55, ph)) : back, act);
  float gPlu = mix(1., ph < e.z ? 1. - smoothstep(tc, tc + 1.4, ph) : back, act);
  float warm = act*smoothstep(tc - 1.6, tc - .1, ph)*(1. - step(e.z, ph));  // its seams brighten to orange before it goes
  float chr = act*smoothstep(tc, tc + 1.2, ph)*(1. - back*back);
  float glow = act*smoothstep(tc, tc + 1., ph)*(1. - smoothstep(e.y, e.z - 2., ph));
  vec3 p = position, n = normal, c = aC;
  float turnQ = floor(iA.w/8. + .001), bowK = step(7.5, turnQ); turnQ -= 8.*bowK;      // (stage F2: a gate's giant is marked: it bows)
  float footK = turnQ/7., turnA = iA.w - 64.*bowK - 8.*turnQ;
#ifdef MIRROR
  if (iB.y < 0. && kind > .5) { p.xz *= .66; c.xz *= .66; }               // (a giant's crown is narrower for its height)
#endif
  if (part) {
    float cnt = kind < 1.5 ? max(iC.x*uShape.y, min(iC.x, 1.)) : iC.y*uShape.z, show = step(aK.y + .5, cnt);
    float sw = kind < 1.5 ? mix(.72, 1., ripe)*gPod : gPlu;
    p = c + (p - c)*(show*sw);
    // (stage F2) on a bowed giant a pod that stands up from its anchor is turned over about it: every pod HANGS
    if (bowK > .5 && kind < 1.5 && p.y > c.y) { p.xy = 2.*c.xy - p.xy; n.xy = -n.xy; }
  } else if (kind < .5) p.xz = c.xz + (p.xz - c.xz)*(abs(iB.y)*(1. - aK.y*(1. - footK)));   // (the trunk; its bulb as great as its dry ground allows)
  else if (kind < 3.5) p = c + (p - c)*step(.5, iC.x);                    // the cords the pods are strung on: gone with the pods
  else p = c + (p - c)*step(.5, iC.x);                                    // an arm: a bare plant has lost its arms with its pods
  float ca = cos(turnA), sa = sin(turnA);
  p.xz = vec2(ca*p.x - sa*p.z, sa*p.x + ca*p.z); n.xz = vec2(ca*n.x - sa*n.z, sa*n.x + ca*n.z);
  p *= s;
  float hy = p.y, hr = clamp(hy/max(refH*s, 1e-3), 0., 1.25);
  vec3 foot = iA.xyz; vec4 Lf = fcrLight(foot); vec3 w = fuWind(foot, Lf, d, seed);
  // THE DEALT LEAN; and (stage F2) THE BOW OF A GATE'S GIANT: its foot, bulb and first third stand upright, then the
  // mast bows over toward the route's line in one long curve, more and more toward the crown (the crown where the
  // straight lean had it); a pod or a plume moves whole with its anchor, so the pods hang plumb, unsheared
  float hb = part ? c.y*s : hy, tb = max(clamp(hb/max(refH*s, 1e-3), 0., 1.25) - .3333, 0.)*1.5, tb1 = min(tb, 1.), bL = length(iB.zw), bD = min(.5*bL, .24);
  float bowDrop = refH*s*bD*(tb1*tb1*tb1)*bowK;                             // (and its crown comes down as it bows: the cube)
  if (bowK > .5 && kind < .5) {                                            // the mast's rings stand square to the curve: a round mast to its crown, never a flat band
    vec2 bu = iB.zw/max(bL, 1e-3), cR = vec2(ca*c.x - sa*c.z, sa*c.x + ca*c.z)*s, tg = normalize(vec2(3.*bL*tb, 1. - 4.5*bD*tb1*tb1)); float ru = dot(p.xz - cR, bu), nu = dot(n.xz, bu);
    p.xz -= bu*(ru*(1. - tg.y)); bowDrop += ru*tg.x; n.xz -= bu*(nu*(1. - tg.y)); n.y -= nu*tg.x; }
  p.xz += iB.zw*mix(hy, refH*s*(tb*tb), bowK) + w.xy*(w.z*hr*hr + .012*hy);    // (and the wind's lean and play toward the fire)
  // THE CROWN STREAMS ONE WAY: every plume is bent downwind by its height over its root (0.42 to 0.76 of that
  // height at its tip, by the plant's own number, and a little more in a gust), and sinks a little as it bends: a
  // torn brush leaning with the air dealt and the fire's draught at this place, never a round or drooping head
  if (kind > 1.5 && kind < 2.5) { float upP = max(p.y - c.y*s, 0.), ln = (.42 + .34*fract(seed*3.3) + .12*w.z)*aK.z; p.xz += w.xy*(upP*ln); p.y -= upP*(.2*ln*ln);
    // (stage F2) the brush of a bowed giant streams on past the crown and DOWN, the way the mast bows
    p.xz += iB.zw*(upP*.8*min(2., 1./max(bL, .05))*bowK); p.y -= upP*(1.3*min(2.*bL, 1.)*bowK); }
  p.y -= bowDrop;
  vec3 wp = foot + p, wa = wp;
#ifdef MIRROR
  float up = max(wp.y - W_LEVEL, 0.);
  wp.xz += vec2(sin(up*.55 + uFcrT*1.3 + wp.x*.3), cos(up*.47 + uFcrT*1.1 + wp.z*.3))*(.35*min(up*.06, 1.));   // the water's face is never still
  wp.y = 2.*W_LEVEL - wp.y;
#endif
  vW = wp; vN = n; vK = vec4(kind, aK.w, aK.z, hr); vL = Lf;
  float breath = 1. + ${.15.toFixed(2)}*sin(uFcrT*6.2832/(5. + 4.*fract(seed*5.3)) + seed*50.);   // seams breathe by 15 per cent over 5 to 9 s
  float amb = fuLit(d, seed).y*(1. - chr);
  vS = vec4(warm, chr, amb*(.75 + .25*fract(seed*3.7))*breath, glow);
  // x: how open this plant stands to the fire (a bank's plant sees the wall down the river; inside the forest the
  // ranks before it shade its foot); y: right before the line a plant is a dark body with a rim (its lit side is
  // held back); z: how much amber its own pods lay on it
  float wat = (wPlanMap(wPlan(foot)).g - .5)*160.;
  vA = vec3((1. - smoothstep(8., 46., wat)), mix(.3, 1., smoothstep(25., 140., d)), amb*min(iC.x, 6.)/6.);
  // the air between: mist, haze, the low air's glow; and before the line the smoke of a nearer lobe (the part's veil)
  vec4 air = wAir(wa, Lf, 0.);
#ifndef MIRROR
  if (d < 330.) { vec4 vl = fcrSmokeVeil(cameraPosition, wa); air = vec4(vl.rgb*(1. - air.a) + air.rgb, 1. - (1. - vl.a)*(1. - air.a)); }
#endif
  vF = air;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.);
}`,Le=`
uniform vec4 uShape;
varying vec3 vW, vN; varying vec4 vK, vS, vL, vF; varying vec3 vA;
void main(){
  float kind = vK.x;
  vec3 n = normalize(vN);
  vec3 V = vW - cameraPosition; vec3 rd = V/max(length(V), 1e-3);
#ifdef MIRROR
  vec3 hp; float wat = wFace(cameraPosition, rd, hp);                      // where the eye's ray meets the water's level
  if (wat > -.2) discard;
  float cover = wDouble(hp, rd, wat);
  rd.y = -rd.y;                                                            // the look as the water turns it
  if (dot(n, rd) > 0.) n = -n;
#else
  if (!gl_FrontFacing) n = -n;
#endif
  vec3 alb; float seam = 0., thin = 0., pod = 0.;
  float g1 = fcrN3(vW*vec3(.9, .22, .9));
  if (kind > 1.5 && kind < 2.5) {
    // a plume: a long dry feather cut out of its strip (its barbs on a near shape)
    float t = clamp(vK.z, 0., 1.), a = abs(vK.y), wd = sin(3.1416*pow(t, .6))*.9 + .1;
    float barb = .62 + .38*step(.4, fract(t*23. + a*2.3));
    if (a > wd*mix(1., barb, uShape.w)) discard;
    alb = vec3(.076, .065, .058)*(.55 + .45*(1. - a))*(.75 + .25*t); thin = 1.;   // dark and dry, darker along its quill
  } else if (kind > .5 && kind < 1.5) {
    // a pod: a gourd of sixteen ribs; in each groove between two ribs a seam, a thin line of amber with the skin beside it lit from within
    float gv = vK.y*16., q = abs(fract(gv) - .5), fq = fwidth(gv);
    vec3 tg = normalize(cross(vec3(0., 1., 0.), n) + vec3(1e-4, 0., 0.));
    n = normalize(n + tg*((fract(gv + .5) - .5)*1.1*(1. - smoothstep(.2, .8, fq))));   // each rib rounded
    float groove = 1. - smoothstep(.0, .5, abs(fract(gv + .5) - .5)*2.);
    seam = mix((1. - smoothstep(.02, .055 + fq, .5 - q))*min(1., .075/max(fq, 1e-3)) + .18*(1. - smoothstep(0., .26, .5 - q)), .21, smoothstep(.25, .7, fq))*smoothstep(.03, .2, vK.z)*(1. - smoothstep(.86, 1., vK.z));
    seam *= smoothstep(.1, .45, abs(dot(n, rd)));                            // (a seam is seen on the skin that faces the eye, never as an outline: optics)
    alb = vec3(.088, .040, .030)*(.6 + .5*vK.z)*(1. - .45*groove); pod = 1.;
  } else if (kind > 2.5 && kind < 3.5) {
    float t = vK.z, a = abs(vK.y);
    if (a > .8) discard;                                                     // a cord: thick, stiff, ribbed across
    alb = vec3(.050, .042, .036)*(.7 + .3*step(.5, fract(t*11.)));  thin = .4;
  } else {
    // the trunk and its arms: ribbed bark, deep umber going to violet-brown, darker in the grooves and at the foot
    float rib = abs(fract(vK.y*(kind > 3.5 ? 2. : 7.) + .12*sin(vK.z*31.)) - .5)*2., fq = fwidth(vK.y*7.);
    alb = mix(vec3(.098, .062, .048), vec3(.082, .056, .074), smoothstep(.3, .7, g1))*mix(mix(.45, 1., smoothstep(.05, .6, rib)), .78, smoothstep(.3, .9, fq));
    alb *= .7 + .3*smoothstep(0., .12, vK.z) + .25*smoothstep(.5, .9, fcrN3(vW*vec3(2.3, .6, 2.3)));
  }
  alb = mix(alb, vec3(.012, .010, .010), vS.y);                              // charred: black
  float crown = mix(mix(.42, 1., smoothstep(.15, .8, vK.w)), 1., vA.x);     // the fire's light comes through the ranks: less of it low down; a bank's plant stands open to it
  float wE = wFar(vL.w);
  vec3 light = wLitF(n, vL, .10, FIRE_PLANT*crown*vA.y);
  // THE FIRE'S SIDE AND THE NIGHT'S (optics for the rims): a bright orange rim on the side toward the fire and on
  // what stands between the eye and the fire; the night's blue as a sheen on the side away from it
  vec2 fdir = normalize(vL.xz + vec2(1e-5, 1e-5));
  float fres = pow(1. - clamp(abs(dot(n, rd)), 0., 1.), 2.6);
  float toward = max(dot(normalize(rd.xz + vec2(1e-5, 1e-5)), fdir), 0.), facing = clamp(dot(n.xz, fdir)*.5 + .5, 0., 1.);
  light *= 1. - .62*thin;                                                   // (a plume is a dry dark feather: it takes less of every light than the bark; from above the crowns are a dark wood, never a pale one)
  vec3 col = alb*light + uFire*(wE*crown*(.05 + 1.3*alb.r)*(fres*(1.5*facing + 1.1*toward)*(1. - .6*thin)*(1. - .8*pod) + .22*thin*toward));   // (a pod takes no rim: an outline round a dark oval reads as a ring hanging in the air)
  // the night's side is deep blue, never black: the sky's light as a sheen on what faces away from the fire
  col += uAmbSky*((.21*fres + .042)*(1. - facing)*(1. - .5*pod)*(1. - .7*thin)) + alb*uDuskCol*(.5*thin*max(dot(n, uDuskDir), 0.));
  // THE PODS' LIGHT LIES ON THE PLANT: on the trunk from the arms up, on the arms, on the plumes of the crown over
  // them (most on what faces down toward the pods), and on each pod's own dark body between its seams
  col += AMBER*alb*(3.2*vA.z*(1. - pod)*smoothstep(.2, .44, vK.w)*(1. - smoothstep(.96, 1.38, vK.w))*mix(.62 - .38*n.y, .4, thin));
  col += AMBER*(.075*vS.z*pod*(.35 + .65*abs(dot(n, rd))));                 // (the skin between the seams glows a little, least at the limb: a body, lit from within)
  col = fuDeep(col);
  // the seams: amber (the only glow a plant has); as the fire comes up to it they brighten to orange
  vec3 glw = mix(AMBER*min(1.05*vS.z*seam, SEAM_MAX), BURST_HOT*(.9*seam), vS.x*pod);
  // charred and burning: glowing cracks in the black, small, deep orange (never the flame's pale colours)
  float crack = smoothstep(.74, .86, fcrN3(vec3(vW.xz*1.4, vW.y*.8 + 3.)))*(.55 + .45*fcrN3(vec3(vW.xz*.4, vW.y*.3 - uFcrT*.6)));
  glw += BURST_HOT*(.8*vS.w*crack*(1. - .7*thin));
#ifdef MIRROR
  // (stage F: an image in water is DARKER AND SOFTER than its source, never paler: the body at four tenths, the air's
  // light between left out of it, its cover eased; the lanterns' and the cracks' glow stay as paths at seven tenths)
  col = (col*.4 + glw*.7)*(1. - vF.a) + vF.rgb*.2; cover *= .82;
  gl_FragColor = vec4(col*cover, cover);
#else
  col = (col + glw)*(1. - vF.a) + vF.rgb;
  gl_FragColor = vec4(col, 1.);
#endif
}`,He=`
attribute vec2 aQ; attribute vec4 tA, tB, tC;     // tA: foot x, y, z, height. tB: P, offset, delay, rise. tC: seed, kind (0 torch, 1 a clump's smoke, 2 steam, 3 a pod's burst, 4 a spot fire), breadth (m), d
varying vec2 vQ; varying vec4 vT; varying vec3 vW, vM; varying vec2 vA;
void main(){
  float seed = tC.x, H = tA.w, ph = fuPhase(tB); vec4 e = fuEnds(tB, seed);
  float on, hh, ww, y0 = 0.;
  if (tC.y < .5) {
    float up = clamp(ph/max(abs(tB.w), 1e-3), 0., 1.), sink = smoothstep(e.x, e.y, ph);
    on = step(0., ph)*(1. - step(e.y, ph));
    hh = 2.7*H*mix(.22 + .78*up, .55, sink); ww = max(.62*H, 9.)*(.6 + .4*up);   // the card: its flame takes the lower half (one and a third times the plant), its own smoke the rest
    vT = vec4(up, sink, seed, 0.);
  } else if (tC.y < 1.5) {
    on = step(e.x - 2., ph)*(1. - step(e.w, ph));                           // from the sinking to the end of the growing back
    hh = H; ww = tC.z; vT = vec4(smoothstep(e.x - 2., e.y + 3., ph)*(1. - smoothstep(e.w - 10., e.w, ph)), 0., seed, 1.);
  } else if (tC.y < 2.5) { on = 1.; hh = H; ww = tC.z; vT = vec4(1., 0., seed, 2.); }   // the thin steam and low smoke that lie on the drowned shallows: always there
  else if (tC.y < 3.5) {
    // a pod's burst: tB.z is the moment the fire's edge reaches this pod; sparks for 1.6 s, a puff of dark smoke that rises and thins over 3.2 s
    float age = ph/3.2; on = step(0., ph)*(1. - step(3.2, ph));
    ww = 2.*H*(2.2 + 2.6*sqrt(clamp(age, 0., 1.))); hh = ww; y0 = -.5*hh + 2.2*H*age*age + 1.5*H*age;
    vT = vec4(age, 0., seed, 3.);
  } else {
    // a spot fire on an islet of the shallows: a small flame that stands there, higher and lower by turns over 20 to 30 s
    on = 1.; hh = 2.*H; ww = 1.2*H + 2.; vT = vec4(.6 + .3*sin(uFcrT*(.21 + .1*seed) + seed*40.), 0., seed, 0.);
  }
  vec3 c = tA.xyz; vec3 ey = cameraPosition - c; vec2 r = normalize(vec2(ey.z, -ey.x) + vec2(1e-5, 0.));
  vec4 Lf = fcrLight(c); vec3 w = fuWind(c, Lf, tC.w, seed);
  vec3 wp = c + vec3(r.x, 0., r.y)*(aQ.x*ww*.5) + vec3(0., y0 + aQ.y*hh, 0.);
  wp.xz += w.xy*(tC.y < .5 || tC.y > 3.5 ? .1*hh*aQ.y*aQ.y : tC.y < 1.5 ? 16.*aQ.y*aQ.y : tC.y < 2.5 ? 7.*aQ.y*aQ.y : 5.*vT.x);    // it leans with the fire's wind
#ifdef MIRROR
  if (tC.y > .5 && tC.y < 2.5) on = 0.;
  wp.y = 2.*W_LEVEL - wp.y;
#endif
  vQ = aQ; vW = wp; vM = vec3(aQ.x*ww*.5, aQ.y*hh, hh);
  vec3 V = wp - cameraPosition; float dist = length(V);
  vA = vec2(wFogAt(dist), Lf.w);
  gl_Position = on > .5 ? projectionMatrix*viewMatrix*vec4(wp, 1.) : vec4(0., 0., 2., 1.);
}`,Ce=`
varying vec2 vQ; varying vec4 vT; varying vec3 vW, vM; varying vec2 vA;
void main(){
  vec2 q = vQ; float seed = vT.z, a; vec3 col; vec4 o;
  if (vT.w < .5) {
    // a torch: one form of the part's own flame (its gift), slender, its hearts small and low; cut off at TORCH_HOT:
    // never pale yellow, never white. The plant's black trunk stands in it (the trunk is nearer the eye than the card)
    vec4 c = fcrFlame(q, vM.xy, max(vM.z, 1.), seed, .5 + .5*fract(seed*7.3), .42*clamp(vT.x*(1. - .6*vT.y), 0., 1.))*(1. - .92*vT.y);
    c.rgb = min(c.rgb, TORCH_HOT*c.a);
    o = vec4(mix(c.rgb, uHazeCol*c.a, vA.x), c.a);
  } else if (vT.w > 2.5) {
    // a pod's burst: a spray of deep orange sparks flung out and falling, and a puff of dark smoke
    vec2 p = vec2(q.x, q.y*2. - 1.); float age = vT.x, r = length(p), an = atan(p.y, p.x);
    float k = floor(an*(23./6.2832)), h1 = fract(sin(k*91.7 + seed*311.)*4375.5), h2 = fract(h1*37.3);
    float t = clamp(age*2., 0., 1.), rs = (.25 + .7*h1)*(1. - (1. - t)*(1. - t))*.8;
    float da = abs(fract(an*(23./6.2832)) - .5 - (h2 - .5)*.5);
    float spark = (1. - smoothstep(.0, .16, da))*(1. - smoothstep(.0, .07, abs(r - rs)))*step(h2, .8)*(1. - t)*(1. - t);
    float core = (1. - smoothstep(0., .34, r))*(1. - smoothstep(0., .22, age));
    float n1 = fcrN3(vec3(vW.x*.35, vW.y*.35 - uFcrT*.4, vW.z*.35 + seed*9.));
    float puff = clamp((1. - smoothstep(.25, .95, r))*(.45 + n1) - .35, 0., 1.)*smoothstep(0., .12, age)*(1. - smoothstep(.45, 1., age))*.75;
    float f = clamp(spark*1.4 + core, 0., 1.);
    col = vec3(.028, .022, .021)*puff*(1. - f) + mix(BURST_HOT*.55, BURST_HOT, clamp(core + spark, 0., 1.))*f; a = max(puff, f);
    o = vec4(mix(col, uHazeCol*a, vA.x), a);
  } else {
    if (vT.w > 1.5) {
      float n1 = fcrN3(vec3(vW.x*.03 + uFcrT*.03, vW.y*.11 - uFcrT*.05, vW.z*.03)), n2 = fcrN3(vec3(vW.x*.09 + 5., vW.y*.3 - uFcrT*.12, vW.z*.09));
      float env = (1. - smoothstep(.25, 1., abs(q.x)))*(1. - smoothstep(.2, 1., q.y))*smoothstep(0., .14, q.y);
      a = clamp(env*(n1*1.5 + n2*.6 - .6), 0., 1.)*.36;
      col = vec3(.050, .047, .050) + uFire*(.2*vA.y*(1. - .5*q.y));
    } else {
      float n1 = fcrN3(vec3(vW.x*.045 + uFcrT*.02, vW.y*.07 - uFcrT*.11, vW.z*.045)), n2 = fcrN3(vec3(vW.x*.13, vW.y*.2 - uFcrT*.2, vW.z*.13 + 7.));
      float env = (1. - smoothstep(.3, 1., abs(q.x)))*(1. - smoothstep(.45, 1., q.y))*smoothstep(0., .1, q.y);
      a = clamp(env*(n1*1.4 + n2*.5 - .5), 0., 1.)*.62*vT.x;
      col = vec3(.034, .028, .026) + uFire*(.11*vA.y*(1. - q.y));
    }
    col = mix(col, uHazeCol, vA.x); o = vec4(col*a, a);
  }
#ifdef MIRROR
  vec3 rd = normalize(vW - cameraPosition), hp; float wat = wFace(cameraPosition, rd, hp);
  if (wat > -.2) discard;
  o *= wDouble(hp, rd, wat);
#endif
  gl_FragColor = o;
}`;function Ue(u,x){const c=le[u],U=256,j=document.createElement("canvas");j.width=U*8,j.height=U;const p=j.getContext("2d",{willReadFrequently:!0}),E=36,N=c.h[1]*we,W=(Z,ht,P)=>`rgb(${Math.round(Z*255)},${Math.round(ht*255)},${Math.round(P*255)})`,zt=(Z,ht,P)=>{const lt=p.createLinearGradient(Z,0,ht,0);return lt.addColorStop(0,W(P,.14,0)),lt.addColorStop(.5,W(P,.5,0)),lt.addColorStop(1,W(P,.86,0)),lt},K=(Z,ht,P,lt,X)=>{p.save(),p.translate(Z,ht),X&&p.scale(1,-1),p.fillStyle=zt(-lt,lt,.53),p.beginPath(),p.moveTo(0,0),p.bezierCurveTo(lt*.7,-.2*P,lt*1.3,-.95*P,0,-P),p.bezierCurveTo(-lt*1.3,-.95*P,-lt*.7,-.2*P,0,0),p.fill(),p.strokeStyle=W(.45,.5,1),p.lineWidth=.15;for(const T of[-.8,-.4,0,.4,.8])p.beginPath(),p.moveTo(0,-.05*P),p.quadraticCurveTo(T*lt*1.95,-.62*P,0,-.97*P),p.stroke();p.restore()},D=(Z,ht,P,lt,X)=>{for(let T=0;T<P;T++){const J=(T+.5)/P-.5,_=lt*(T%3?x.range(.6,.85):x.range(.9,1.05)),ct=Z+J*2*X,at=J*.55*_;p.fillStyle=W(.76,J>0?.68:.32,0),p.beginPath(),p.moveTo(ct-.3,ht),p.quadraticCurveTo(ct+.55*at-1,ht+.45*_,ct+at,ht+_),p.quadraticCurveTo(ct+.55*at+1,ht+.45*_,ct+.3,ht),p.fill()}},O=(Z,ht,P,lt,X)=>{p.strokeStyle=W(1,.5,0),p.lineWidth=X,p.beginPath(),p.moveTo(Z,ht),p.quadraticCurveTo(.5*(Z+P),lt,P,lt),p.stroke()};for(let Z=0;Z<6;Z++){p.setTransform(U/E,0,0,-U/N,Z*U,U);const ht=2+Math.floor(x()*3),P=[];for(let X=0;X<ht;X++)P.push(7+22*(X+.2+.6*x())/ht);const lt=Math.floor(x()*ht);P.forEach((X,T)=>{const J=c.h[1]*(T===lt?1:x.range(.8,.96)),_=J/c.ref,ct=x.range(-.04,.04)*J,at=u==="bottles"?.86*J:J,ot=x()<.1,vt=nt=>(Qt[u](nt)+ce[u](nt))*_,pt=nt=>X+ct*(nt/J)*(nt/J);p.fillStyle=zt(X-vt(.3)-.4,X+vt(.3)+.4,1),p.beginPath(),p.moveTo(pt(0)-vt(0),0);for(let nt=1;nt<=40;nt++){const V=at*nt*nt/1600;p.lineTo(pt(V)-vt(V/J),V)}for(let nt=40;nt>=0;nt--){const V=at*nt*nt/1600;p.lineTo(pt(V)+vt(V/J),V)}if(p.closePath(),p.fill(),!ot)if(u==="bottles"){K(pt(at),at-.3,.26*J,.09*J,!0);for(let nt=0;nt<3;nt++){const V=J*(.62+.07*nt),At=nt%2?1:-1,ft=pt(V)+At*(vt(V/J)+x.range(2.2,3.4)*_),xt=x.range(.9,1.5)*_;O(pt(V),V,ft,V+.9*_,.9*_),K(ft,V+.9*_,2.5*xt,xt,!1)}D(pt(at),at-.5,7,9*_,2.2*_)}else if(u==="spires"){for(let nt=0;nt<3;nt++){const V=J*(.9-.14*nt),At=nt%2?1:-1,ft=pt(V)+At*x.range(3.2,4.8)*_,xt=x.range(7,10)*_;O(pt(V),V,ft,V+.7*_,.8*_),p.strokeStyle=W(1,.5,0),p.lineWidth=.4*_,p.beginPath(),p.moveTo(ft,V+.7*_),p.lineTo(ft,V-xt),p.stroke();for(let kt=0;kt<2;kt++){const Pt=x.range(.8,1.3)*_*(kt?1.15:.9);K(ft,V-xt*((kt+.75)/2.3)+1.25*Pt,2.5*Pt,Pt,!1)}}D(pt(J),J-.3,6,7.2*_,.3*_)}else{const nt=2+Math.floor(x()*4);for(let V=0;V<nt;V++){const At=(V+.5)/nt,ft=J*(.42+.46*At),xt=V%2?1:-1,kt=pt(ft)+xt*bt(5.6,3.2,At)*_*x.range(.85,1.05),Pt=bt(2.3,1.35,At)*_*x.range(.88,1.1);O(pt(ft),ft,kt,ft+1.2*_,.95*_),K(kt,ft+1.2*_,2.5*Pt,Pt,!1)}D(pt(J),J-.3,9,9.6*_,.4*_)}})}for(let Z=6;Z<8;Z++){p.setTransform(U/E,0,0,-U/E,Z*U,U);const ht=2+Math.floor(x()*2);for(let P=0;P<ht;P++){const lt=P/ht*6.2832+x(),X=18+Math.cos(lt)*x.range(5,9),T=18+Math.sin(lt)*x.range(5,9),J=x.range(5.5,8.2);for(let _=0;_<9;_++){const ct=((_+.5)/9-.5)*1.3+x.range(-.08,.08),at=J*(_%3?x.range(.55,.8):x.range(.9,1.05)),ot=X+Math.cos(ct)*at,vt=T+Math.sin(ct)*at;p.strokeStyle=W(.76,.5+.36*Math.sin(ct),0),p.lineWidth=1.2,p.beginPath(),p.moveTo(X,T),p.lineTo(ot,vt),p.stroke()}for(let _=0;_<4;_++){const ct=x()*6.2832,at=x.range(3,5),ot=X+Math.cos(ct)*at,vt=T+Math.sin(ct)*at,pt=x.range(1.1,1.9);p.strokeStyle=W(1,.5,0),p.lineWidth=.9,p.beginPath(),p.moveTo(X,T),p.lineTo(ot,vt),p.stroke(),p.fillStyle=W(.53,.5,0),p.beginPath(),p.arc(ot,vt,pt,0,6.2832),p.fill(),p.strokeStyle=W(.45,.5,1),p.lineWidth=.16;for(let nt=0;nt<4;nt++){const V=nt/4*3.1416;p.beginPath(),p.moveTo(ot-Math.cos(V)*pt,vt-Math.sin(V)*pt),p.lineTo(ot+Math.cos(V)*pt,vt+Math.sin(V)*pt),p.stroke()}}p.fillStyle=W(1,.5,0),p.beginPath(),p.arc(X,T,.9,0,6.2832),p.fill()}}const ut=new Q.CanvasTexture(j);return ut.wrapS=ut.wrapT=Q.ClampToEdgeWrapping,ut.magFilter=Q.LinearFilter,ut.minFilter=Q.LinearMipmapLinearFilter,ut.generateMipmaps=!0,ut.needsUpdate=!0,ut}const Ve=`
attribute vec2 aUv; attribute vec3 aT; attribute vec4 cA, cB, cC, cD;   // cA: foot x, y, z, turn. cB: breadth, height, variant, seed. cC: d. cD: P, offset, delay, rise
varying vec2 vUv; varying vec3 vW, vN, vTn; varying vec4 vS, vL, vF; varying vec3 vA; varying float vLn;
void main(){
  float seed = cB.w, d = cC.x, top = aT.z, rise = abs(cD.w);
  float ph = fuPhase(cD); vec4 e = fuEnds(cD, seed);
  float act = step(0., ph)*(1. - step(e.w, ph)), back = clamp((ph - e.z)/max(e.w - e.z, 1e-3), 0., 1.);
  float ca = cos(cA.w), sa = sin(cA.w);
  vec3 p = position; p.xz = vec2(ca*p.x - sa*p.z, sa*p.x + ca*p.z);
  vec2 tn = vec2(ca*aT.x - sa*aT.y, sa*aT.x + ca*aT.y);                    // the card's own breadth, in the world
  p.xz *= cB.x; p.y *= cB.y*${we.toFixed(2)};
  vec4 Lf = fcrLight(cA.xyz); vec3 w = fuWind(cA.xyz, Lf, d, seed);
  p.xz += w.xy*(w.z*position.y*position.y + .012*p.y);
  vec3 wp = cA.xyz + p;
  vW = wp; vTn = vec3(tn.x, 0., tn.y); vN = top > .5 ? vec3(0., 1., 0.) : vec3(-tn.y, 0., tn.x); vL = Lf;
  // THE CROWNS STREAM ONE WAY on the cards too: the wind at this place, in the card's own frame; an upright leaf's
  // crowns are bent along the leaf by the wind's share along it (0.155 of the plants' height at the tufts' tips,
  // by the card's own number); the lying leaf's picture is turned so that its brushes stream downwind
  vec2 wl = vec2(ca*w.x + sa*w.y, -sa*w.x + ca*w.y);
  if (top > .5) { vUv = vec2(dot(aUv - .5, wl), dot(aUv - .5, vec2(-wl.y, wl.x))) + .5; vLn = 0.; }
  else { vUv = aUv; vLn = dot(aT.xy, wl)*(.155*cB.y/max(cB.x, 1e-3))*(.7 + .5*fract(seed*3.3)); }
  float ripeS = fuLit(d, seed).y;                                           // (the same law as the whole plants': amber points, denser toward the fire)
  // x: the fire edge's height (over 1: all of it alight), y: charred, z: pods and plumes grown back, w: ripeness
  vS = vec4(act*(1. - step(e.y, ph))*(ph/max(rise, .1))*1.2, act*smoothstep(0., rise + 1.5, ph)*(1. - back*back), mix(1., ph < e.z ? 1. - smoothstep(rise, rise + 3., ph) : back, act), ripeS);
  vA = vec3(top > .5 ? 6. + mod(cB.z, 2.) : cB.z, mix(.3, 1., smoothstep(25., 140., d)), top);   // (x: which picture of the atlas)
  vec4 air = wAir(wp, Lf, 0.);
  if (d < 330.) { vec4 vl = fcrSmokeVeil(cameraPosition, wp); air = vec4(vl.rgb*(1. - air.a) + air.rgb, 1. - (1. - vl.a)*(1. - air.a)); }
  vF = air;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.);
}`,Ge=`
uniform sampler2D uAtlas;
varying vec2 vUv; varying vec3 vW, vN, vTn; varying vec4 vS, vL, vF; varying vec3 vA; varying float vLn;
void main(){
  // what stands over the trunks' ends (the upper 0.44 of a leaf) is bent along the leaf, more toward the top
  float bend = clamp((vUv.y - .56)/.44, 0., 1.), ul = vUv.x - vLn*bend*bend;
  if (ul < 0. || ul > 1. || vUv.y < 0. || vUv.y > 1.) discard;
  vec4 t = texture2D(uAtlas, vec2((floor(vA.x + .5) + .02 + .96*ul)/8., vUv.y));
  if (t.a < .4) discard;
  float trunk = smoothstep(.82, .95, t.r), hsh = fcrN3(vec3(vW.xz*1.7, vW.y*1.7));
  if (trunk < .5 && hsh > vS.z*1.02) discard;                                // pods and plumes gone with the fire, and back by degrees
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 tn = normalize(vTn); if (!gl_FrontFacing) tn = -tn;
  n = normalize(n + tn*((t.g - .5)*1.7)*(1. - vA.z));
  vec3 V = vW - cameraPosition; vec3 rd = V/max(length(V), 1e-3);
  vec3 alb = mix(vec3(.088, .040, .030), mix(vec3(.070, .056, .046), vec3(.092, .060, .054), trunk), smoothstep(.5, .7, t.r));
  alb = mix(alb, vec3(.012, .010, .010), vS.y);
  float crown = mix(mix(.5, 1., smoothstep(.15, .8, vUv.y)), 1., vA.z);
  vec3 light = wLitF(n, vL, .10, FIRE_PLANT*crown*vA.y)*mix(.5, 1., trunk)*(1. - .3*vA.z);   // (plumes and pods take less of every light than the bark; the crowns from above are a dark wood)
  float edge = 1. - smoothstep(.4, .8, t.a), wE = wFar(vL.w);                                 // a cut-out's rim (optics): orange toward the fire
  vec2 fdir = normalize(vL.xz + vec2(1e-5, 1e-5));
  float toward = max(dot(normalize(rd.xz + vec2(1e-5, 1e-5)), fdir), 0.), facing = clamp(dot(n.xz, fdir)*.5 + .5, 0., 1.);
  vec3 col = alb*light + uFire*(wE*crown*(.05 + 1.3*alb.r)*(edge*(.9*facing + 1.1*toward) + .3*(1. - trunk)*toward)) + uAmbSky*(.03 + .05*edge)*(1. - facing);
  col += AMBER*alb*(1.3*vS.w*(1. - vS.y)*smoothstep(.3, .6, vUv.y));          // the pods' amber on the trunks and crowns round them
  col = fuDeep(col);
  col += AMBER*min(.7*vS.w*t.b*(1. - vS.y), SEAM_MAX);                      // the seams' amber
  float fl = fcrN3(vec3(vW.xz*.5, vW.y*.4 - uFcrT*2.));
  float lit = step(vUv.y, vS.x)*step(.001, vS.x);
  col = mix(col, min(fcrRamp(clamp(.25 + .5*fl, 0., 1.)), BURST_HOT), lit*smoothstep(.2, .5, fl + .3)*(1. - .75*trunk));   // alight far off: deep orange, its trunk black in it
  col = col*(1. - vF.a) + vF.rgb;
  gl_FragColor = vec4(col, 1.);
}`,$e=`
varying vec3 vW;
void main(){ vW = position; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.); }`,Qe=`
varying vec3 vW;
vec2 ch22(vec2 p){ vec3 q = fract(vec3(p.xyx)*vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz)*q.zy); }
// the forest's large forms: clumps whose hearts stand taller, 50 to 110 m across, and the giants' heads over them
float clumpH(vec2 p){ return fcrN3(vec3(p/96., 7.)) + .55*fcrN3(vec3(p/41. + 40., 3.)); }
void main(){
  vec3 wp = vW; float d0 = wp.z - fcrFront(wp.x);
  if (d0 < 3.) discard;
  vec4 pm = wPlanMap(wPlan(wp));
  float ragged = fcrN3(vec3(wp.xz/27., 3.)) - .5;
  if (pm.a < .5 + .45*ragged) discard;
  vec3 V = wp - cameraPosition; float dist = length(V); vec3 rd = V/max(dist, 1e-3);
  float px = max(length(dFdx(wp.xz)), length(dFdy(wp.xz)));
  // far off the forest opens here and there: glades, and old channels as thin wandering lines (the dark land shows)
  float farK = smoothstep(.985, 1., pm.a)*smoothstep(260., 420., d0);
  float open = fcrN3(vec3(wp.xz/210., 19.)), ride = abs(fcrN3(vec3(wp.xz/640. + 5., 23.)) - .5);
  if (farK > .5 && (open < .2 + .05*ragged || ride < .0055)) discard;
  vec2 q = wp.xz/15., iq = floor(q), fq = fract(q); float md = 9., mh = 0.; vec2 mr = vec2(0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 g = vec2(float(i), float(j)), o = ch22(iq + g), r = g + .15 + .7*o - fq; float dd = dot(r, r); if (dd < md) { md = dd; mr = r; mh = o.x; } }
  float lod = (1. - smoothstep(1.4, 4.5, px)), heart = (1. - smoothstep(0., .7, md));
  if (px < 2. && md > .5 + .25*mh) discard;                                  // the gaps between crowns, where they can be seen
  vec4 Lf = fcrLight(wp);
  vec2 wd = normalize(Lf.xz + vec2(1e-4, -1e-4));
  float along = dot(wp.xz, wd), across = dot(wp.xz, vec2(-wd.y, wd.x));
  float grain = fcrN3(vec3(across*.55, along*.09, mh*9.));                    // the plumes' grain, all streaming one way
  float ripe = wRipe(d0), wE = wFar(Lf.w);
  // CALM LARGE FORMS: each clump of crowns is a dome with a side toward the light and a side in shade; a giant's head here and there
  float c0 = clumpH(wp.xz); vec2 gC = vec2(clumpH(wp.xz + vec2(5., 0.)) - c0, clumpH(wp.xz + vec2(0., 5.)) - c0)*(1./5.);
  float giant = step(.93, mh)*heart;
  vec3 alb = mix(vec3(.050, .030, .027), vec3(.082, .068, .054), .2 + .5*smoothstep(.45, .75, grain)*lod)*mix(.6 + .55*smoothstep(.5, 1.1, c0), .45 + .55*heart, lod*.7);
  vec3 n = normalize(vec3(-gC.x*24. - mr.x*(1.2 + 1.5*giant)*lod, 1., -gC.y*24. - mr.y*(1.2 + 1.5*giant)*lod));
  float toward = max(dot(normalize(rd.xz + vec2(1e-5, 1e-5)), wd), 0.);
  float lightP = .6 + .8*fcrN3(vec3(wp.xz/330., uFcrT*.01 + 5.));              // the fire's light falls in broad patches (the smoke's shade between)
  float rake = clamp(dot(n, Lf.xyz)/max(Lf.y, .05), 0., 3.);                  // slopes toward the fire take its low light
  vec3 light = mix(uAmbGnd, uAmbSky, .5 + .5*n.y) + uDuskCol*max(dot(n, uDuskDir), 0.)*1.6 + uFire*(FIRE_PLANT*.5*wE*lightP*(rake + .5*toward));
  vec3 col = alb*light;
  float sp = step(1. - .06 - .16*ripe, ch22(iq*1.7 + floor(fq*2.)).y)*lod*(1. - smoothstep(.3, .75, md));
  col += AMBER*((.3 + .7*ripe)*mix(.014, .5*sp, lod));                       // the seams: amber points in the dark wood, denser toward the front; a faint warmth far off
  // thin mist lying in the hollows between the clumps (it takes the dusk's cool and a little of the fire). STAGE F, rule 16: it
  // is there by place at one strength; what is seen of it is what a pixel's footprint leaves of the hollows (a filter by
  // the footprint's root, never by the lens's distance: where a pixel holds a clump whole the hollow's mist is under the crowns)
  float mist = (1. - smoothstep(.35, .8, c0))*smoothstep(3.2, 12., sqrt(max(px, 0.)))*(.35 + .65*fcrN3(vec3(wp.xz/480., 31.)));
  col = mix(col, uHor*1.1 + uFire*(.05*Lf.w), .55*mist);
  vec4 air = wAir(wp, Lf, 0.); col = col*(1. - air.a) + air.rgb;
  gl_FragColor = vec4(col, 1.);
}`,me={pods:[[1,1],[.5,6/11],[1,1]],bottles:[[1,9/11],[.5,5/11],[1,12/13]],spires:[[1,7/11],[.5,4/11],[1,9/13]]},ve=u=>new Q.ShaderMaterial({...u,defines:{MIRROR:1},side:Q.DoubleSide,transparent:!1,depthWrite:!1,depthFunc:Q.GreaterDepth,blending:Q.CustomBlending,blendEquation:Q.AddEquation,blendSrc:Q.OneFactor,blendDst:Q.OneMinusSrcAlphaFactor,blendSrcAlpha:Q.OneFactor,blendDstAlpha:Q.OneMinusSrcAlphaFactor});async function Ze(u,x){const{L:c,plan:U,U:j,forks:p,deal:E,pause:N,glsl:W}=u,{K:zt,plants:K,cards:D,drifts:O,spots:ut,count:Z,moatLeast:ht,airOf:P,airPlant:lt,heightK:X}=x,T=new Q.Group;T.name="forest";const J=W.front+W.noise+W.ramp+W.mirror+W.world+W.air+Se,_=J+W.water,ct={near:0,giants:0,middle:0,doubled:0,cards:0,carpet:0,torches:0};let at=0;const ot=(o,h,v)=>o.setAttribute(h,new Q.InstancedBufferAttribute(v,4)),vt=[oe(E.kind,0,p.near),oe(E.kind,0,p.near),oe(E.kind,2,p.near),oe(E.kind,1,p.mid),oe(E.kind,1,p.mid)],pt=[[],[],[],[],[]],nt=o=>o.giant?2:o.level===0?gt(o.seed*7.7)<.5?0:1:3+Math.floor(gt(o.seed*5.3)*2);for(const o of K)o.shape=nt(o),pt[o.shape].push(o);await N();const V=(o,h,v)=>{const a=o.length,n=new Float32Array(a*4),r=new Float32Array(a*4),i=new Float32Array(a*4),f=new Float32Array(a*4);return o.forEach((e,m)=>{n.set([e.x,e.y,e.z,e.turn+8*Math.round((e.foot===void 0?1:e.foot)*7)+(e.bow?64:0)],m*4),r.set([e.H/h,v&&e.giant?-e.girth:e.girth,e.lx,e.lz],m*4),i.set([e.pods,e.plumes,e.seed,e.d],m*4),f.set([e.P,e.off,e.delay,e.set?-e.rise:e.rise],m*4)}),{iA:n,iB:r,iC:i,iD:f}};vt.forEach((o,h)=>{const v=pt[h],a=v.length;if(!a)return;const n=V(v,o.ref,!1),r=o.geometry;ot(r,"iA",n.iA),ot(r,"iB",n.iB),ot(r,"iC",n.iC),ot(r,"iD",n.iD),r.instanceCount=a;const i=me[E.kind][h<2?0:h===2?2:1],f=new Q.ShaderMaterial({side:Q.DoubleSide,uniforms:{...j,uShape:{value:new Q.Vector4(o.ref,i[0],i[1],h<3?1:0)}},vertexShader:J+Ee,fragmentShader:J+Le}),e=new Q.Mesh(r,f);e.name="plants-"+h,e.frustumCulled=!1,T.add(e),ct[h<2?"near":h===2?"giants":"middle"]+=o.triangles*a,at++}),await N();const At=K.filter(o=>!o.young&&o.wat<22&&x.nearRoute(o.x,o.z,200)).sort((o,h)=>o.wat-h.wat).slice(0,92);if(At.length){const o=vt[3].geometry,h=new Q.InstancedBufferGeometry,v=V(At,zt.ref,!0);for(const r of["position","normal","aC","aK"])h.setAttribute(r,o.getAttribute(r));h.setIndex(o.getIndex()),ot(h,"iA",v.iA),ot(h,"iB",v.iB),ot(h,"iC",v.iC),ot(h,"iD",v.iD),h.instanceCount=At.length;const a=me[E.kind][1],n=new Q.Mesh(h,ve({uniforms:{...j,uShape:{value:new Q.Vector4(zt.ref,a[0],a[1],0)}},vertexShader:_+Ee,fragmentShader:_+Le}));n.name="plants-doubled",n.frustumCulled=!1,n.renderOrder=-9,T.add(n),ct.doubled=vt[3].triangles*At.length,at++}await N();const ft=K.filter(o=>o.P>0&&!o.young),xt=new Map,kt=[];for(const o of ft){let h=xt.get(o.clump);h||xt.set(o.clump,h={n:0,x:0,y:0,z:0,d:0,P:o.P,off:o.off,delay:1/0,led:o.led,set:o.set}),h.n++,h.x+=o.x,h.y+=o.y,h.z+=o.z,h.d+=o.d,h.delay=Math.min(h.delay,o.delay)}for(const o of ft){if(o.level!==0&&!o.set)continue;const h=vt[o.shape],v=o.H/h.ref,a=Math.cos(o.turn),n=Math.sin(o.turn),r=Math.max(o.pods*me[E.kind][o.shape<2?0:o.shape===2?2:1][0],Math.min(o.pods,1));for(const i of h.podAt){if(i.n+.5>r)continue;const f=i.y*v,e=o.bow?o.H*Fe(i.hp):f;kt.push({x:o.x+(a*i.x-n*i.z)*v+o.lx*e,y:o.y+(o.bow?(f>i.hp*o.H?2*i.hp*o.H-f:f)-ie(o,i.hp*o.H):f),z:o.z+(n*i.x+a*i.z)*v+o.lz*e,r:i.r*v,P:o.P,off:o.off,delay:o.delay+i.hp*o.rise,rise:o.set?-o.rise:o.rise,seed:gt(o.seed*31.7+i.n*.37),d:o.d})}}const Pt=ft.length+xt.size+O.length+kt.length+ut.length;if(Pt){const o=new Float32Array(Pt*4),h=new Float32Array(Pt*4),v=new Float32Array(Pt*4);ft.forEach((e,m)=>{o.set([e.x,e.y,e.z,e.H],m*4),h.set([e.P,e.off,e.delay,e.set?-e.rise:e.rise],m*4),v.set([e.seed,0,0,e.d],m*4)});let a=ft.length;for(const[e,m]of xt)o.set([m.x/m.n,m.y/m.n,m.z/m.n,30],a*4),h.set([m.P,m.off,m.delay,m.set?-1.7:1.7],a*4),v.set([Vt(e*5.1),1,m.set?44:58,m.d/m.n],a*4),a++;for(const e of O)o.set([e.x,e.y,e.z,e.H],a*4),h.set([0,0,0,1],a*4),v.set([e.seed,2,e.W,e.d],a*4),a++;for(const e of kt)o.set([e.x,e.y,e.z,e.r],a*4),h.set([e.P,e.off,e.delay,e.rise],a*4),v.set([e.seed,3,0,e.d],a*4),a++;for(const e of ut)o.set([e.x,e.y,e.z,e.H],a*4),h.set([0,0,0,1],a*4),v.set([e.seed,4,0,e.d],a*4),a++;const n=new Q.InstancedBufferGeometry;n.setAttribute("position",new Q.Float32BufferAttribute([0,0,0,0,0,0,0,0,0,0,0,0],3)),n.setAttribute("aQ",new Q.Float32BufferAttribute([-1,0,1,0,1,1,-1,1],2)),n.setIndex([0,1,2,0,2,3]),ot(n,"tA",o),ot(n,"tB",h),ot(n,"tC",v),n.instanceCount=Pt;const r=new Q.ShaderMaterial({transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:Q.DoubleSide,uniforms:j,vertexShader:J+He,fragmentShader:J+u.hero.glsl.flame+Ce}),i=new Q.Mesh(n,r);i.name="torches",i.frustumCulled=!1,i.renderOrder=4.5,T.add(i);const f=new Q.Mesh(n,ve({uniforms:j,vertexShader:_+He,fragmentShader:_+u.hero.glsl.flame+Ce}));f.name="torches-doubled",f.frustumCulled=!1,f.renderOrder=-8.5,T.add(f),ct.torches=Pt*4,at+=2}if(await N(),D.length){const o=[],h=[],v=[],a=[];for(let g=0;g<3;g++){const k=g*Math.PI/3,y=Math.cos(k),S=Math.sin(k),L=o.length/3;o.push(-.5*y,0,-.5*S,.5*y,0,.5*S,.5*y,1,.5*S,-.5*y,1,-.5*S),h.push(0,0,1,0,1,1,0,1);for(let A=0;A<4;A++)v.push(y,S,0);a.push(L,L+1,L+2,L,L+2,L+3)}o.push(-.45,.72,-.45,.45,.72,-.45,.45,.72,.45,-.45,.72,.45),h.push(0,0,1,0,1,1,0,1);for(let g=0;g<4;g++)v.push(1,0,1);a.push(12,13,14,12,14,15);const n=D.length,r=new Float32Array(n*4),i=new Float32Array(n*4),f=new Float32Array(n*4),e=new Float32Array(n*4);D.forEach((g,k)=>{r.set([g.x,g.y,g.z,g.turn],k*4),i.set([g.W,g.H,g.variant,g.seed],k*4),f.set([g.d,0,0,0],k*4),e.set([g.P,g.off,g.delay,(g.set?-1:1)*(g.rise||1.7)],k*4)});const m=new Q.InstancedBufferGeometry;m.setAttribute("position",new Q.Float32BufferAttribute(o,3)),m.setAttribute("aUv",new Q.Float32BufferAttribute(h,2)),m.setAttribute("aT",new Q.Float32BufferAttribute(v,3)),m.setIndex(a),ot(m,"cA",r),ot(m,"cB",i),ot(m,"cC",f),ot(m,"cD",e),m.instanceCount=n;const M=Ue(E.kind,p.atlas),H=new Q.ShaderMaterial({side:Q.DoubleSide,uniforms:{...j,uAtlas:{value:M}},vertexShader:J+Ve,fragmentShader:J+Ge}),R=new Q.Mesh(m,H);R.name="plant-cards",R.frustumCulled=!1,T.add(R),ct.cards=n*8,at++}await N();const Ct=bt(zt.h[0],zt.h[1],.55);{const o=(R,g,k,y,S)=>{const L=[];for(let rt=R;rt<=g+1e-6;rt+=k)L.push(rt);let A=k,Y=L[0];for(;Y>y;)A*=1.3,Y-=A,L.unshift(Math.max(Y,y));for(A=k,Y=L[L.length-1];Y<S;)A*=1.3,Y+=A,L.push(Math.min(Y,S));return L},h=U.oz-c.zLo+20,v=o(-900,1900,52,-15e3,15e3),a=o(-500,Math.min(2100,h-60),52,-9e3,h),n=v.length,r=a.length,i=new Float32Array(n*r*3),f=new Uint32Array((n-1)*(r-1)*6),e=Ct*.86;for(let R=0;R<r;R++){for(let g=0;g<n;g++){const k=v[g],y=a[R],S=U.wx(k),L=U.wz(y),A=(R*n+g)*3,rt=k>-800&&k<1700&&y>-400&&y<2100?Rt(0,60,U.watBase(k,y)-3):1,wt=u.ctx.noise.n2,it=.8+.2*wt(S/190+3,L/190-8)+.2*wt(S/83-11,L/83+5)+.55*Rt(.5,.8,wt(S/61+40,L/61+9));i[A]=S,i[A+1]=U.relief(S,L)+e*it*X(Math.max(L-c.frontZ(S),0))*(.1+.9*rt),i[A+2]=L}R%12===11&&await N()}for(let R=0,g=0;R<r-1;R++)for(let k=0;k<n-1;k++){const y=R*n+k,S=y+n;f[g++]=y,f[g++]=S,f[g++]=y+1,f[g++]=y+1,f[g++]=S,f[g++]=S+1}const m=new Q.BufferGeometry;m.setAttribute("position",new Q.BufferAttribute(i,3)),m.setIndex(new Q.BufferAttribute(f,1));const M=new Q.ShaderMaterial({side:Q.DoubleSide,uniforms:j,vertexShader:$e,fragmentShader:J+Qe}),H=new Q.Mesh(m,M);H.name="canopy",H.frustumCulled=!1,T.add(H),ct.carpet=f.length/3,at++}await N();const Nt=["ripe","catching","torch","sinking","black","growing"],Ft=[...xt].map(([o,h])=>({P:h.P,off:h.off,delay:0,rise:1.7,seed:Vt(o*5.1),set:h.set})),F=(o,h)=>{const v=Object.fromEntries(Nt.map(a=>[a,0]));for(const a of o)v[_e(a,h)]++;return Object.fromEntries(Nt.map(a=>[a,+(v[a]/Math.max(1,o.length)).toFixed(3)]))},B={};for(const o of[0,17,43,500,5e3])B[o]={clumps:F(Ft,o),plants:F(ft,o)};let tt=0;for(const o of Ft)tt+=1/o.P;const st=ft.filter(o=>o.set),I={};for(const o of[0,17,43,500,5e3])I[o]=F(st,o);const et={kind:E.kind,bowedThatBurn:K.filter(o=>o.bow&&o.P>0).length,count:{...Z,plants:K.length,doubled:At.length,cards:D.length,torches:ft.length,bursts:kt.length,clumps:xt.size,clumpsLedByBursts:[...xt.values()].filter(o=>o.led>=0).length,setPiecePlants:st.length,setPieceClumps:[...xt.values()].filter(o=>o.set).length,drifts:O.length,spotFires:ut.length},tri:ct,shapes:vt.map(o=>o.triangles),moatLeast:ht,setShares:I,aClumpBeginsEvery:tt>0?+(1/tt).toFixed(2):0,shares:B,torchBrightest:$.hot,burstBrightest:$.burst},G=async(o,h)=>{const v=[],a=async(r,i)=>{let f=1/0,e=0;for(const m of r){const M=i(m);M<f&&(f=M),++e%120===0&&await N()}return f},n=r=>lt(r,48);for(const[r,i,f]of[["fire-plants, giants",K.filter(e=>e.giant),n],["fire-plants, near shapes",K.filter(e=>e.level===0&&!e.giant),n],["fire-plants, middle shapes",K.filter(e=>e.level===1&&!e.young),n],["young plants",K.filter(e=>e.young),n],["plant cards",D,e=>P(e.x,e.z,e.y,e.y+e.H*we,.5*e.W+1.6)],["torches (a flame one and a third times the plant)",ft,e=>P(e.x,e.z,e.y,e.y+1.35*e.H,Math.max(.31*e.H,4.5)+.07*e.H)],["pods' bursts (sparks and smoke)",kt,e=>P(e.x,e.z,e.y-5*e.r,e.y+9*e.r,5*e.r+5)],["spot fires on the islets",ut,e=>P(e.x,e.z,e.y,e.y+2*e.H,.6*e.H+1)]]){const e=await a(i,f);v.push({kind:r,least:Number.isFinite(e)?+e.toFixed(1):"over 48",need:h,ok:e>=h,n:i.length}),await N()}return v};return{object:T,heightAt:(o,h)=>{const v=h-c.frontZ(o);if(v<0)return 0;const a=U.pe(o),n=U.pn(h);return Math.max(U.cover(a,n)*Ct*X(v),U.isletAt(a,n)>.5?6:0)},update(){},triangles:Object.values(ct).reduce((o,h)=>o+h,0),calls:at,info:et,clearAir:G,plants:K,cards:D,tools:x.tools}}const Re=`
attribute vec4 aK;               // what it is (0 drowned wood, 1 a fallen trunk, 2 husk, 3 a fan's blade, 4 a coiled shoot), its seed, how far along it, metres from the line
varying vec3 vW, vN; varying vec4 vK, vL, vF; varying vec2 vA;
void main(){
  vec3 wp = position; vN = normal; vK = aK; vL = fcrLight(position);
  if (aK.x > 2.5) { vec3 w = fuWind(position, vL, aK.w, aK.y); wp.xz += w.xy*(.5*w.z*aK.z*aK.z); }   // fans and shoots stir a little
#ifdef MIRROR
  wp.y = 2.*W_LEVEL - wp.y;
#endif
  vW = wp;
  vA = vec2(wPod(wPlan(position))*smoothstep(110., 260., aK.w), mix(.3, 1., smoothstep(25., 140., aK.w)));   // the pods' amber lying here; right before the line a dark body with a rim
  vec4 air = wAir(position, vL, vA.x);
#ifndef MIRROR
  if (aK.w < 330.) { vec4 vl = fcrSmokeVeil(cameraPosition, position); air = vec4(vl.rgb*(1. - air.a) + air.rgb, 1. - (1. - vl.a)*(1. - air.a)); }
#endif
  vF = air;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.);
}`,Ne=`
varying vec3 vW, vN; varying vec4 vK, vL, vF; varying vec2 vA;
void main(){
  vec3 n = normalize(vN);
  vec3 V = vW - cameraPosition; vec3 rd = V/max(length(V), 1e-3);
#ifdef MIRROR
  vec3 hp; float wat = wFace(cameraPosition, rd, hp);
  if (wat > -.2) discard;
  float cover = wDouble(hp, rd, wat);
  rd.y = -rd.y; if (dot(n, rd) > 0.) n = -n;
  vec3 P = vec3(vW.x, 2.*W_LEVEL - vW.y, vW.z);
#else
  if (!gl_FrontFacing) n = -n;
  vec3 P = vW;
#endif
  float kind = vK.x, seed = vK.y, g = fcrN3(P*1.7);
  // drowned wood: barkless, dark and wet, one trunk in three pale and weathered (by its own number); cracked down the
  // grain; black-wet at the water's level, and a pale water mark a metre or two over it
  float hgt = P.y - W_LEVEL, grain = fcrN3(vec3(P.xz*3.1, P.y*.3));
  vec3 wood = mix(vec3(.050, .044, .040), vec3(.118, .112, .104), step(.64, fract(seed*7.3))*(.55 + .45*g))*(.7 + .3*smoothstep(.35, .6, grain));
  wood = mix(wood, vec3(.022, .020, .020), (1. - smoothstep(.15, .9, hgt)));
  wood = mix(wood, wood*1.3 + .010, .6*(1. - smoothstep(0., .3, abs(hgt - 1.2 - .7*fract(seed*3.1)))));
  vec3 alb = kind < .5 ? wood
    : kind < 1.5 ? mix(vec3(.060, .042, .036), vec3(.046, .038, .050), g)*(.8 + .2*smoothstep(.35, .65, fract(vK.z*5. + g)))       // a fallen trunk: dark bark, faintly ringed
    : kind < 2.5 ? mix(vec3(.060, .030, .022), vec3(.12, .095, .07), smoothstep(.3, .8, vK.z))                                    // a split husk, paler inside its rim
    : kind < 3.5 ? vec3(.046, .040, .050)*(.6 + .6*vK.z) : mix(vec3(.060, .050, .034), vec3(.105, .075, .040), smoothstep(.55, 1., vK.z));   // a fan's blade; a young shoot, its coil paler
  vec3 col = alb*(wLitF(n, vL, .10, FIRE_PLANT*vA.y) + AMBER*(1.5*vA.x));
  vec2 fdir = normalize(vL.xz + vec2(1e-5, 1e-5));
  float fres = pow(1. - clamp(abs(dot(n, rd)), 0., 1.), 2.6), toward = max(dot(normalize(rd.xz + vec2(1e-5, 1e-5)), fdir), 0.), facing = clamp(dot(n.xz, fdir)*.5 + .5, 0., 1.);
  col += uFire*(wFar(vL.w)*(.05 + 1.3*alb.r)*fres*(1.5*facing + 1.1*toward)) + uAmbSky*((.12*fres + .03)*(1. - facing));
  col = fuDeep(col);
  // (nothing here glows: no ember stands in drowned wood)
  col = col*(1. - vF.a) + vF.rgb;
#ifdef MIRROR
  gl_FragColor = vec4(col*(.5*cover), cover);                               // (stage F: an image in water is darker than its source)
#else
  gl_FragColor = vec4(col, 1.);
#endif
}`;async function ta(u){const{plan:x,U:c,forks:U,detail:j,pause:p,glsl:E,forest:N,life:W,routePts:zt}=u,K=N.tools,D=U.litter,O=U.under,ut=u.ctx.noise,Z=u.PLAN.water.river,ht=()=>({P:[],N:[],K:[],I:[]}),P=ht(),lt=ht(),X=[],T={snags:0,stumps:0,fallenTrunks:0,fans:0,shoots:0,husks:0},J=a=>(n,r,i,f,e,m,M)=>{a.P.push(n,r,i);const H=jt(f,e,m)||1;return a.N.push(f/H,e/H,m/H),a.K.push(M[0],M[1],M[2],M[3]),a.P.length/3-1},_=J(P),ct=J(lt),at=(a,n,r)=>K.laneNear(a,n)>r+2.6&&(!W||!W.laneNear||W.laneNear(a,n)>r+2.6)&&(!W||!W.swimNear||W.swimNear(a,n)>r+2),ot=(a,n,r,i,f,e,m,M,H)=>{const R=a.P.length/3,g=r.length;r.forEach((k,y)=>{const S=r[Math.max(0,y-1)],L=r[Math.min(g-1,y+1)];let A=L[0]-S[0],Y=L[1]-S[1],rt=L[2]-S[2];const wt=jt(A,Y,rt)||1;A/=wt,Y/=wt,rt/=wt;let it=Math.abs(Y)>.9?1:-rt,yt=Math.abs(Y)>.9?0:A,Ht=0;const Dt=jt(it,Ht,yt)||1;it/=Dt,yt/=Dt;const Bt=Y*yt-rt*Ht,ee=rt*it-A*yt,fe=A*Ht-Y*it;for(let _t=0;_t<f;_t++){const It=_t/f*6.2832+m*6,Zt=Math.cos(It),Xt=Math.sin(It),ne=it*Zt+Bt*Xt,se=Ht*Zt+ee*Xt,Wt=yt*Zt+fe*Xt,Gt=H&&y===g-1?H*(gt(m*31.7+_t*.618)-.3):0;n(k[0]+ne*i[y]+A*Gt,k[1]+se*i[y]+Y*Gt,k[2]+Wt*i[y]+rt*Gt,ne,se,Wt,[e,m,y/(g-1),M])}});for(let k=0;k<g-1;k++)for(let y=0;y<f;y++){const S=R+k*f+y,L=R+k*f+(y+1)%f;a.I.push(S,L,S+f,L,L+f,S+f)}return R},vt=(a,n,r,i,f,e,m)=>{const M=(gt(e*5.1)-.5)*.16*f,H=(gt(e*9.7)-.5)*.16*f,R=f>3.5,g=R?[[a,n-.7,r],[a+M*.15,n+.18*f,r+H*.15],[a+M*.55,n+.6*f,r+H*.55],[a+M,n+f,r+H]]:[[a,n-.7,r],[a,n+.35*f,r],[a+M,n+f,r+H]],k=ot(P,_,g,R?[i*1.1,i,i*.8,i*.55]:[i*1.1,i,i*.85],6,0,e,m,R?.16*f:.5*f),y=k+(g.length-1)*6,S=_(a+M,n+f*.9,r+H,0,1,0,[0,e,1,m]);for(let L=0;L<6;L++)P.I.push(S,y+L,y+(L+1)%6);if(R)for(let L=0;L<(gt(e*21.7)<.5?2:1);L++){const A=L?.7+.16*gt(e*20.3):.3+.14*gt(e*13.3),Y=e*40+L*(1.1+.9*gt(e*4.7)),rt=Math.cos(Y),wt=Math.sin(Y),it=a+M*A,yt=n+f*A,Ht=r+H*A,Dt=Math.min(i*2.6,f*(.07+.07*gt(e*(3.3+L))));ot(P,_,[[it,yt,Ht],[it+rt*Dt,yt+(L?1.1:.2)*Dt,Ht+wt*Dt]],[i*.42,i*.2],3,0,e,m,.3)}X.push({x:a+.5*M,z:r+.5*H,y0:n,y1:n+f*1.17,r:i*1.7+.5*St(M,H)+(R?i*4.8:0)})},pt=(a,n,r,i,f)=>{n=[bt(a[0],n[0],.6),Z-1.1*r,bt(a[2],n[2],.6)];const e=[],m=[],M=(gt(i*7.3)<.5?-1:1)*(.1+.16*gt(i*3.9)),H=-(n[2]-a[2]),R=n[0]-a[0];for(let A=0;A<=4;A++){const Y=A/4,rt=M*Math.sin(Math.PI*Y);e.push([bt(a[0],n[0],Y)+H*rt,bt(a[1],n[1],Math.pow(Y,.7)),bt(a[2],n[2],Y)+R*rt]),m.push(r*bt(1,.5,Y))}ot(P,_,e,m,6,1,i,f,0);const g=St(n[0]-a[0],n[2]-a[2]),k=(n[0]-a[0])/g,y=(n[2]-a[2])/g,S=_(a[0],a[1],a[2],-k,.2,-y,[1,i,0,f]),L=P.P.length/3;for(let A=0;A<7;A++){const Y=A/7*6.2832,rt=r*(1.9+1.3*gt(i*17+A*.37));_(a[0]-y*Math.cos(Y)*rt-k*.5,a[1]+Math.sin(Y)*rt,a[2]+k*Math.cos(Y)*rt-y*.5,-k,.2,-y,[1,i,.05,f])}for(let A=0;A<7;A++)P.I.push(S,L+A,L+(A+1)%7);for(let A=0;A<2;A++){const Y=.35+.3*A+.1*gt(i*(5+A)),rt=e[Math.round(Y*4)],wt=r*(2.5+3*gt(i*(11+A))),it=A?1:-1;ot(P,_,[rt,[rt[0]-y*it*wt*.5,rt[1]+wt,rt[2]+k*it*wt*.5]],[r*.4,r*.18],3,1,i,f,.3)}for(let A=0;A<=4;A++)X.push({x:e[A][0],z:e[A][2],y0:e[A][1]-m[A],y1:e[A][1]+m[A]+(A===0?3.2*r:r*5.5),r:.125*g+m[A]+(A===0?3.2*r:0)})},nt=(a,n,r,i,f,e)=>{const m=5+Math.floor(gt(f*9.1)*3),M=f*6.28;for(let H=0;H<m;H++){const R=M+H/m*6.2832+(gt(f*3.3+H*.7)-.5)*.5,g=.5+.8*gt(f*5.7+H*.31),k=i*(.6+.4*gt(f*7.9+H*.53)),y=Math.cos(R),S=Math.sin(R),L=Math.cos(g),A=Math.sin(g),Y=.2*k,rt=-y*A,wt=L,it=-S*A,yt=ct(a,n-.1,r,rt,wt,it,[3,f,0,e]);ct(a+y*L*.55*k-S*Y,n+A*.55*k,r+S*L*.55*k+y*Y,rt-S*.4,wt,it+y*.4,[3,f,.55,e]),ct(a+y*L*.55*k+S*Y,n+A*.55*k,r+S*L*.55*k-y*Y,rt+S*.4,wt,it-y*.4,[3,f,.55,e]),ct(a+y*L*k,n+A*k*.92,r+S*L*k,rt,wt,it,[3,f,1,e]),lt.I.push(yt,yt+1,yt+2,yt+1,yt+3,yt+2)}X.push({x:a,z:r,y0:n,y1:n+i,r:i})},V=(a,n,r,i,f,e)=>{const m=f*6.28,M=Math.cos(m),H=Math.sin(m),R=.2*i,g=[[a,n-.3,r],[a+M*.05*i,n+.45*i,r+H*.05*i]],k=[.07*i+.05,.055*i+.04],y=.12*i+R,S=.8*i;for(let L=0;L<=6;L++){const A=L/6,Y=Math.PI-A*9.2,rt=R*(1-.72*A),wt=y+Math.cos(Y)*rt,it=S+Math.sin(Y)*rt;g.push([a+M*wt,n+it,r+H*wt]),k.push((.05*i+.03)*(1-.6*A))}ot(lt,ct,g,k,3,4,f,e,0),X.push({x:a+M*y*.5,z:r+H*y*.5,y0:n,y1:n+i*1.05,r:.4*i})},At=(a,n,r,i,f,e,m,M)=>{const R=Math.cos(M),g=Math.sin(M),k=ct(a,n+f,r,0,1,0,[2,e,1,m]),y=k+1;for(let S=0;S<5;S++){const L=S/5*6.2832,A=Math.cos(L)*i*1.7,Y=Math.sin(L)*i,rt=R*A-g*Y,wt=g*A+R*Y;ct(a+rt,n-.08+.3*f*gt(e*9+S*.7),r+wt,rt,.7*i,wt,[2,e,0,m])}for(let S=0;S<5;S++)lt.I.push(k,y+(S+1)%5,y+S);X.push({x:a,z:r,y0:n,y1:n+f,r:i*1.7})},ft=(a,n,r,i,f)=>K.airOf(a,n,r,i,f)>5,xt=Math.round(60*j),kt=Math.round(90*j);for(let a=0;a<9e3&&(T.snags<xt||T.stumps<kt);a++){a%250===249&&await p();const[n,r]=K.sidePt(D.range(K.flatA-30,K.flatB+30),D.range(-58,124)),i=x.pe(n),f=x.pn(r);if(x.sdAsh(i,f)>-3||D()>.2+.8*Rt(-.3,.3,ut.n2(n/31+9,r/31-4)))continue;const e=x.lineD(n,r),m=x.isletAt(i,f)>.3,M=m?x.groundAt(n,r):Z,H=D();if(D()<.4){if(T.snags>=xt)continue;const g=D.range(.5,1.1),k=D.range(5,17)*(.6+.4*Rt(20,60,K.routeAt(n,r,64)[0]));if(!at(n,r,g*2)||!ft(n,r,M,M+k*1.17,g*6.5+.08*k))continue;vt(n,M,r,g,k,H,e),T.snags++}else{if(T.stumps>=kt)continue;const g=D.range(.5,1.2),k=D.range(.8,3.2);if(!at(n,r,g*2))continue;vt(n,M,r,g,k,H,e),T.stumps++}}await p();const Pt=Math.round(18*j),Ct=K.bankPts.concat(K.lastPts);if(Ct.length)for(let a=0;a<5e3&&T.fallenTrunks<Pt;a++){a%200===199&&await p();const[n,r]=K.beside(D,Ct,20,70),i=K.watOf(n,r);if(i<1.5||i>7)continue;const f=x.pe(n),e=x.pn(r),m=x.watAt(f+3,e)-i,M=x.watAt(f,e+3)-i,H=St(m,M);if(H<.2)continue;const R=Math.atan2(M/H,-m/H*x.m)+D.range(-.7,.7),g=D.range(20,38),k=Math.cos(R),y=Math.sin(R),S=n+k*g,L=r+y*g,A=D.range(.9,1.6);if(K.watOf(S,L)>-3||K.watOf(n+k*g*.5,r+y*g*.5)>0)continue;let Y=!0;for(let wt=0;wt<=6&&Y;wt++){const it=n+k*g*(wt/6),yt=r+y*g*(wt/6);Y=at(it,yt,A)&&ft(it,yt,Z-1,Z+2+6*A,A*4+3)}if(!Y)continue;const rt=D()<.35?D.range(1,3.5):0;pt([n,x.groundAt(n,r)+.7*A,r],[S,Z-.25*A+rt,L],A,D(),x.lineD(n,r)),T.fallenTrunks++}await p();const Nt=Math.round(160*j),Ft=Math.round(48*j),F=Math.round(70*j),B=K.bankPts.concat(K.lastPts);if(B.length)for(let a=0;a<12e3&&(T.fans<Nt||T.shoots<Ft||T.husks<F);a++){a%500===499&&await p();const[n,r]=K.beside(O,B,18,84),i=K.watOf(n,r);if(i<.8||i>46)continue;const f=.5+.5*ut.n2(n/19+31,r/19+5);if(O()>Rt(.3,.7,f)+.12)continue;const e=x.lineD(n,r);if(e<8)continue;const m=x.groundAt(n,r),M=O(),H=O();if(H<.62){if(T.fans>=Nt)continue;const R=O.range(1.4,4.2);if(!at(n,r,R*.7)||!ft(n,r,m,m+R,R))continue;nt(n,m,r,R,M,e),T.fans++}else if(H<.85){if(T.shoots>=Ft)continue;const R=1+Math.floor(O()*3);for(let g=0;g<R&&T.shoots<Ft;g++){const k=n+O.range(-2.5,2.5),y=r+O.range(-2.5,2.5),S=O.range(2,7.5);K.watOf(k,y)<.6||!at(k,y,1)||!ft(k,y,m,m+S*1.05,.4*S)||(V(k,x.groundAt(k,y),y,S,O(),e),T.shoots++)}}else{if(T.husks>=F||i<3)continue;const R=O.range(.5,1.5);if(!at(n,r,R))continue;At(n,m,r,R,R*O.range(.5,.9),M,e,O()*6.2832),T.husks++}}await p();{const a=Math.round(44*j),n=Math.round(20*j);let r=0,i=0;for(let f=0;f<7e3&&(r<a||i<n);f++){f%500===499&&await p();const[e,m]=K.sidePt(O.range(K.flatA-30,K.flatB+30),O.range(-58,124)),M=x.pe(e),H=x.pn(m);if(x.isletAt(M,H)<.9)continue;const R=x.lineD(e,m);if(R<8)continue;const g=x.groundAt(e,m),k=O();if(r<a&&O()<.7){const y=O.range(1.2,3.4);if(!at(e,m,y*.7)||!ft(e,m,g,g+y,y))continue;nt(e,g,m,y,k,R),r++}else if(i<n){const y=O.range(2,6);if(!at(e,m,1)||!ft(e,m,g,g+y*1.05,.4*y))continue;V(e,g,m,y,k,R),i++}}T.fans+=r,T.shoots+=i,T.onTheIslets=r+i}await p();{const a=Math.round(110*j);let n=0;if(K.bankPts.length)for(let r=0;r<14e3&&n<a;r++){r%400===399&&await p();const[i,f]=K.beside(O,K.bankPts,8,64),e=K.watOf(i,f);if(e<.5||e>4.5)continue;const m=x.lineD(i,f);if(m<8)continue;const M=x.groundAt(i,f),H=O(),R=O();if(R<.5){const g=2+Math.floor(O()*2);for(let k=0;k<g;k++){const y=i+O.range(-1.8,1.8),S=f+O.range(-1.8,1.8),L=O.range(1.6,5);K.watOf(y,S)<.4||!at(y,S,1)||!ft(y,S,M,M+L*1.05,.4*L)||(V(y,x.groundAt(y,S),S,L,O(),m),T.shoots++,n++)}}else if(R<.86){const g=O.range(1.2,3.2);if(!at(i,f,g*.7)||!ft(i,f,M,M+g,g))continue;nt(i,M,f,g,H,m),T.fans++,n++}else{const g=O.range(.4,1.1);if(!at(i,f,g))continue;At(i,M,f,g,g*O.range(.5,.9),H,m,O()*6.2832),T.husks++,n++}}T.atTheWatersEdge=n}await p();const tt=a=>{const n=new Q.BufferGeometry;return n.setAttribute("position",new Q.Float32BufferAttribute(a.P,3)),n.setAttribute("normal",new Q.Float32BufferAttribute(a.N,3)),n.setAttribute("aK",new Q.Float32BufferAttribute(a.K,4)),n.setIndex(a.I),n},st=E.front+E.noise+E.ramp+E.mirror+E.world+E.air+Se,I=new Q.Group;I.name="ground-bodies";const et=(a,n,r,i)=>{const f=new Q.Mesh(a,n);f.name=r,f.frustumCulled=!1,i!==void 0&&(f.renderOrder=i),I.add(f)},G=tt(P),C=tt(lt),o=()=>new Q.ShaderMaterial({side:Q.DoubleSide,uniforms:c,vertexShader:st+Re,fragmentShader:st+Ne});await p(),et(G,o(),"snags-and-trunks"),et(C,o(),"undergrowth"),await p(),et(G,ve({uniforms:c,vertexShader:st+E.water+Re,fragmentShader:st+E.water+Ne}),"snags-doubled",-8.8);const h=(2*P.I.length+lt.I.length)/3;return{object:I,triangles:h,calls:3,clearAir:async(a,n)=>{let r=1/0;for(const i of X){const f=K.airOf(i.x,i.z,i.y0,i.y1,i.r);f<r&&(r=f)}return[{kind:"snags, stumps, fallen trunks, fans, shoots and husks",least:Number.isFinite(r)?+r.toFixed(1):"over 48",need:n,ok:r>=n,n:X.length}]},info:{...T,triangles:h}}}export{$ as FUSE,Ke as SEAM_MAX,Je as buildForest,ta as buildGround,_e as fuseState,Be as growOf};
