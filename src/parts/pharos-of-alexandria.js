import*as A from"three";import{makePath as zt,makeRng as Re,hashSeed as Me,clamp as Ce,lerp as U,smoothstep as Oo}from"../kit/core.js";const h={PLATFORM_Y:4,S1_FOOT:30,S1_TOP:26,S1_H:60,S2_FLATS:16.4,S2_H:30,S3_DIA:8.7,S3_H:8,PIER_H:5,PIER_W:2.2,FIGURE_H:7,COURSE_H:.5,BLOCK_L:1,DOOR_H:12.76,DOOR_W:6,DOOR_SILL:9,DOOR_JAMB:1.6,DOOR_LINTEL:1.2,RAMP_L:68,RAMP_W:9,RAMP_ARCHES:16,RAMP_PARAPET:.9,CORNER_FIG_H:5,PARAPET_H:1.2,WIN_W:.8,WIN_H:1.7,BAND_SHAPE_H:.5,BAND_L:24,BAND_UP:48,MERCHANT_L:14,MERCHANT_W:4.4,WARSHIP_L:40,WARSHIP_W:5,WARSHIP_DECK:3,HOUSE_H:9,TOWN_TOWER_LO:14,TOWN_TOWER_HI:18,SUN_AZ:298,TONGUE_X0:30,TONGUE_X1:98,TONGUE_HALF:13,SHELF_X0:76,SHELF_X1:98,SHELF_Z0:5,SHELF_Z1:13,SHELF_Y:1.5,STAIR_W:5,RAMP_FOOT_X:88,RAMP_HEAD_X:20,DOOR_X:15},Z=h.PLATFORM_Y+h.S1_H,fe=Z+h.S2_H,B=fe+h.S3_H,ke=B+h.PIER_H,qt=ke+h.FIGURE_H,Xt=h.DOOR_H-h.DOOR_LINTEL,Ae=h.PLATFORM_Y+h.DOOR_SILL,Qe=Ae+Xt/2,Lo=4.2,To=.7,Ro=["low sun","sunset","early dusk"],Mo=[6,1,-2.5],yo=["calm","light","moderate"],Fo=[.32,.48,.64];function de(e){return h.PLATFORM_Y+h.DOOR_SILL*Ce((h.RAMP_FOOT_X-e)/h.RAMP_L,0,1)}const Je=90,et=78.5,De=5,mt=10,ye=72,Po=78.5,tt=22,ae={donkey:{half:.6,fore:1.23,aft:.77,high:1.46},walker:{half:.36,fore:.52,aft:.53,high:1.79},stander:{half:.32,high:1.75}},pe=.25,Ge=.2,No=h.RAMP_W/2,wt=15.75,gt=No-(ae.donkey.half+pe),_t=2*ae.donkey.half+Ge,Ho=gt-_t,Yt=ae.donkey.fore+_t/2+pe,Wo=h.RAMP_FOOT_X-Yt,Co=wt+Yt,Kt=8,bt=.45,ot=[91,97.5,7.6],Ie=.27,At=2*ae.walker.half+Ge,ko=[De+ae.walker.half+pe,De+ae.walker.half+pe+At],Vt=[ot[2]+ae.walker.half+pe,ot[2]+ae.walker.half+pe+At],jt=[[63,-12.6,4,5],[64.7,-12.6,3,5],[49,-12.6,4,4],[79.5,-12.5,3,5]],Do=([e,a,,t])=>[e,e+1.5,a,a+.27*t];function Go(e){const a=(Je-e)/(Je-et);return a<=0?h.SHELF_Y:U(h.SHELF_Y,de(et),Math.min(tt,Math.floor(a*tt)+1)/tt)}const Io=[2.6,2.4,1.9],Uo=[2,2,1.9],zo=.6,qo=.6,$t=1/8,xe=new A.Color(.19,.08,.02),Zt=.4,xt=.5,Et=.55,at=.92,Ue=.6,ze=[[h.SHELF_X0+8,h.SHELF_Y,h.TONGUE_HALF-Ue,at],[h.SHELF_X1-1,h.SHELF_Y,h.TONGUE_HALF-Ue,at],[h.TONGUE_X1-3,h.PLATFORM_Y,-(h.TONGUE_HALF-Ue),at],[h.TONGUE_X1-12,h.PLATFORM_Y,-(h.TONGUE_HALF-Ue),at]],Xo=Et*.4;function Bt(e,a){return e<h.DOOR_X||e>h.TONGUE_X1||Math.abs(a)>(e<h.TONGUE_X0?35:h.TONGUE_HALF)?0:e<h.TONGUE_X0?Math.abs(a)<=8&&e<=h.RAMP_HEAD_X||Math.abs(a)<=h.RAMP_W/2+.5?de(e):h.PLATFORM_Y:Math.abs(a)<=h.RAMP_W/2+.5&&e<=h.RAMP_FOOT_X?de(e):a>=De&&a<=mt&&e<=Je&&e>=ye?Go(e):e>=h.SHELF_X0&&a>=h.SHELF_Z0?h.SHELF_Y:h.PLATFORM_Y}const Yo=[1.25,.85,1.1,.95],Ee={merchant:[8.6,13,4.9,8.6],anchored:[9.5,13,9.5,9.5],roadstead:[9.5*1.25,13*1.25,9.5*1.25,9.5*1.25],warship:[24,9,11.6,24],fisher:[4.2,3.2,4.2,4.2],moored:[3.2,2.2,3.2,3.2]},St=1.5,qe=1,Xe=h.MERCHANT_L,Se=128.5,nt=-220,st=45,Ko=30,rt=20,Vo=44.5,Ye=h.TONGUE_X1+Vo,Fe=32,ne=Math.PI/180,it=(e,a,t,o,i)=>[e+(i?-t:t)*Math.cos(o*ne),a+(i?-t:t)*Math.sin(o*ne)],Qt=1,te=(()=>{const e=180-rt,a=Math.sin(rt*ne),t=Math.cos(rt*ne),o=nt+st+Qt,i=it(Ye,-Fe,Fe,e,!0),l=i[0]-Se,s=((i[1]-o)*a-l*t)/(1-t),r=(l-s*(1-t))/a,u=it(Se+s,o,s,e,!1);return{hB:e,arcR:s,straight:r,levelEnd:[Se,nt+st],bear0:[Se,o],bear:u,turn0:i,turnEast:[Ye+Fe,-Fe],turnEnd:[Ye,0],leftAt:f=>it(Se+s,o,s,f,!1),turnAt:f=>it(Ye,-Fe,Fe,f,!0)}})(),jo=1.8,Jt=2,$o=4,Ot=h.PLATFORM_Y+jo+Jt;function Zo(){const e=Lo,a=[],t=h.TONGUE_X1,o=h.RAMP_FOOT_X,i=h.PLATFORM_Y+$o,l=h.DOOR_X+.5;for(const n of[0,20,40,50,55,58,60])a.push([Se,e,nt+st*n/60]);a.push([Se,e,nt+st+Qt]);for(const n of[1,7/3,13/3,20/3,10,15,20]){const s=te.leftAt(180-rt*n/20);a.push([s[0],e,s[1]])}for(let n=1;n<=2;n++)a.push([U(te.bear[0],te.turn0[0],n/3),e,U(te.bear[1],te.turn0[1],n/3)]);{const n=Math.round((270-te.hB)/15);for(let s=0;s<=n;s++){const r=te.turnAt(te.hB+(270-te.hB)*s/n);a.push([r[0],e,r[1]])}}for(let n=1;n<=4;n++){const s=U(Ye,t,n/5);a.push([s,U(e,Ot,n/5),0])}a.push([t,Ot,0],[(t+o)/2,(Ot+i)/2,0]);for(let n=0;n<=6;n++)a.push([U(o,l,n/6),U(i,Qe,n/6),0]);return a}function Xa(){return zt(Zo())}function Ya(e){const a=e.length,t=new A.Vector3,o=(c,m=0)=>{let w=m,_=a;for(let E=m;E<=a;E+=.25){if(c(e.posAtDist(E,t))){_=E;break}w=E}for(let E=0;E<12;E++){const g=(w+_)/2;c(e.posAtDist(g,t))?_=g:w=g}return _},i=o(c=>c.z>te.levelEnd[1]),l=o(c=>c.z>te.bear[1],i),n=o(c=>c.z>te.turn0[1],l),s=o(c=>c.z>te.turnEast[1],n),r=o(c=>c.x<te.turnEnd[0],s),u=o(c=>c.x<h.TONGUE_X1,r),f=o(c=>c.x<h.RAMP_FOOT_X,u),d=o(c=>c.x<(h.RAMP_FOOT_X+h.RAMP_HEAD_X)/2,f);return{level:i,bear:l,turn0:n,east:s,turnEnd:r,tip:u,foot:f,rampMid:d,last40:a-40,length:a}}function Bo(e,a={}){const t=Re(Me("pharos-visit:"+e));let o=t.int(0,2);a.hour==="golden"||a.hour==="day"?o=0:a.hour==="night"&&(o=2);const i=t.int(0,2);return{hour:o,swell:i,hourName:Ro[o],swellName:yo[i],sunElevation:Mo[o],swellHeight:Math.min(To,Fo[i]+t.range(-.03,.03)),swellLength:t.range(84,112),haze:t.range(0,1),warshipOutbound:t.chance(.5),laneOff:t.range(0,2.5),rare:!!a.rare,density:Ce(a.density??1,.7,1.3)}}const eo=.3;function to(e){const a=[];let t=0;for(let s=0;s<e.length;s++){const r=e[s],u=e[(s+1)%e.length],f=Math.hypot(u[0]-r[0],u[1]-r[1]);a.push({a:r,b:u,l:f,s:t}),t+=f}const o=(s,r)=>{s=(s%t+t)%t;let u=0;for(;u<a.length-1&&s>a[u].s+a[u].l;)u++;const f=a[u],d=f.l>0?(s-f.s)/f.l:0;return r[0]=U(f.a[0],f.b[0],d),r[1]=U(f.a[1],f.b[1],d),r},i=[0,0],l=[0,0];return{pts:e,length:t,at:(s,r=[0,0,0,0])=>{o(s-eo,i),o(s+eo,l),o(s,r);const u=l[0]-i[0],f=l[1]-i[1],d=Math.hypot(u,f)||1;return r[2]=u/d,r[3]=f/d,r}}}const lt=(e,a,t,o,i,l=16)=>{const n=[];for(let s=0;s<=l;s++){const r=U(o,i,s/l);n.push([e+t*Math.cos(r),a+t*Math.sin(r)])}return n};function Qo(e){const a=new A.CatmullRomCurve3(e.map(i=>new A.Vector3(i[0],0,i[1])),!0,"centripetal");a.arcLengthDivisions=e.length*60;const t=a.getLength(),o=i=>(i%t+t)%t/t;return{length:t,closed:!0,posAtDist:(i,l=new A.Vector3)=>a.getPointAt(o(i),l),tangentAtDist:(i,l=new A.Vector3)=>a.getTangentAt(o(i),l)}}const j=[h.TONGUE_X1,0],oo=[566,214],X=[(j[0]+oo[0])/2,(j[1]+oo[1])/2],G=Ee.anchored[0]+Math.SQRT2*St,ao=Ee.roadstead[0]+Math.SQRT2*(St+qe),Lt=[44,62],Tt=[2.5,4.8],Ka=Lt[1]+4+6,no=12,so=.762,ro=1.12,Jo=1.5,io=2.5,ea=Jo/(2*so*ro),lo=so*ro*ea,ho=(e,a)=>[io*.45*e[0]+1.5*Math.max(a[0],a[2])+lo,io*.45*e[1]+1.5*a[1]+lo],Rt={spread:[3.5,3],wander:[2,2,2,.35],clear:1.5,over:7,head:3,rise:4,long:[1.2,1.55]},ta={spread:[2.5,2],wander:[2.5,2,2.5,.35],bend:7,y:11,rise:2},co=[5,2.5,4,.35],ve=j[0]+5*Xe,uo=[560,1262],Ke=e=>X[1]-(X[0]-e)/Math.tan(Ko*ne),fo={shoal:[j[0]-33,j[0]-20,-(h.TONGUE_HALF+76),-(h.TONGUE_HALF+32),3],east:[ve+32,ve+48,Ke(ve)-128,Ke(ve)-38,3],outer:[ve+92,ve+132,Ke(ve)-203,Ke(ve)+57,2]},oa=fo.shoal[1]+Tt[1],Mt=[X[0]-70,X[0]-56,X[1]-7,X[1]+93],po=[[0,0],[2.5,0],[0,1],[0,2]].map(([e,a],t)=>[oa+(1.5+e)*ao,-(h.TONGUE_HALF+(2+2*a)*ao),Yo[t]]),yt=e=>[j[0]-2*G-6,j[0]-2*G+6,h.TONGUE_HALF+(3.4+4*e)*G-8,h.TONGUE_HALF+(3.4+4*e)*G+8],Ft=9,vo=91,_e=.8*h.WARSHIP_L,aa=2.5*h.WARSHIP_L,na=j[0]-Ee.warship[0]-_e,sa=8,ht=-(h.TONGUE_HALF+vo+Ft+Ee.fisher[0]+Ee.warship[2]+Jt),ct=ht-2*_e-Ee.warship[2]-2*G,Pe=yt(1)[3]+3.7*G,me={north:[.5*G,3.5*G,ct-3*G,ct],northWest:[-6*G,-3*G,ct-3*G,ct],leeA:yt(0),leeB:yt(1),harbourA:[j[0]-3*G,j[0],Pe,Pe+4*G],harbourC:[j[0]-2.4*G,j[0]+1.2*G,Pe+7*G,Pe+12*G],harbourB:[j[0]+2*G,j[0]+9*G,Pe+13*G,Pe+23*G],mouthA:[X[0]+4*G,X[0]+7*G,X[1]-20,X[1]+40],mouthB:[X[0]+6*G,X[0]+10*G,X[1]+70,X[1]+150]},ra=[j[0]+4*G,j[0]+6*G,h.TONGUE_HALF+8.5*G,h.TONGUE_HALF+8.5*G+20],ia={bight:[h.TONGUE_X0-2,h.TONGUE_X0+28,-(h.TONGUE_HALF+vo),-(h.TONGUE_HALF+35)],lee:[h.DOOR_X+1,h.TONGUE_X0+10,h.TONGUE_HALF+47,h.TONGUE_HALF+97],harbour:[j[0]+3*Xe,j[0]+7*Xe,h.TONGUE_HALF+13*Xe,h.TONGUE_HALF+16.5*Xe],mouth:[Mt[0]-62,Mt[0]-18,X[1]-9,X[1]+32]},la=["bight","lee","harbour","mouth","bight","lee","harbour","mouth"].map(e=>ia[e]);function Va(e,a={}){const t=mo(e,a);for(;;){const o=t.next();if(o.done)return o.value}}async function ja(e,a,t){const o=mo(e,a||{});for(;;){const i=o.next();if(i.done)return i.value;await t()}}function*mo(e,a={}){const t=Bo(e,a),o={deal:t},i=v=>Re(Me("pharos-"+v+":"+e)),l=ve+t.laneOff,n=Ke(l),s=[];for(const v of[1720,1320,920,620,420,290,200,120,60])s.push([l,0,n-v]);for(const v of[0,.12,.3,.5,.75,1])s.push([U(l,X[0],v),0,U(n,X[1],v)]);for(const v of[.1,.25,.5,.75,1])s.push([U(X[0],uo[0],v),0,U(X[1],uo[1],v)]);yield;const r=zt(s,{samples:900}),u=i("merchants");yield;const f=Math.round(r.length/u.range(135,165)),d=r.length/f,c=u.range(0,d),m=u.range(2,2.5),w=Math.ceil(1600/d),_=w*d,E=r.posAtDist(0),g=E.x,p=E.z,b={length:_+r.length,runIn:_,posAtDist:v=>v>=_?r.posAtDist(v-_):{x:g,y:0,z:p-(_-v)},tangentAtDist:v=>v>=_?r.tangentAtDist(v-_):{x:0,y:0,z:1}};o.merchantLane=b,o.merchants=Array.from({length:f+w},(v,O)=>({kind:"merchant",lane:b,s0:_+c+(O<f?O:f-1-O)*d,v:m,phase:u.range(0,6.2832)}));const S=i("warships"),T=na-S.range(0,sa),M=T-aa,W=ht-_e,k=[],R=[0,.25,.5,.75,1];for(const v of R)k.push([U(T,M,v),ht]);for(const v of[30,60,90,120,150])k.push([M-_e*Math.sin(v*ne),W+_e*Math.cos(v*ne)]);for(const v of R)k.push([U(M,T,v),ht-2*_e]);for(const v of[30,60,90,120,150])k.push([T+_e*Math.sin(v*ne),W-_e*Math.cos(v*ne)]);t.warshipOutbound&&k.reverse();const $=Qo(k),we=t.rare?3:2,q=$.length/we,ge=S.range(0,q),Te=S.range(110,140),se=S.range(3,3.6);yield,o.warshipCourse=$,o.warships=[];for(let v=0;v<3;v++)for(let O=0;O<2;O++){const L=S.range(0,6.2832);v<we&&O<(t.rare?1:2)&&o.warships.push({kind:"warship",lane:$,s0:ge+v*q-O*Te,v:se,phase:L})}{const v=i("roadstead");o.roadstead=[];for(let P=0;P<po.length;P++){const[C,D,z]=po[P],H={kind:"roadstead",scale:z,x:C+v.range(-qe,qe),z:D+v.range(-qe,qe),yaw:Math.PI+v.range(-.1,.1),phase:v.range(0,6.28)};(P<3||t.density>.85)&&o.roadstead.push(H)}const O=v.sign(),L=o.roadstead[0],x=O*(h.MERCHANT_W/2*L.scale+1.3),F=v.range(-2,3);o.lighter={kind:"moored",alongside:L,off:x,fore:F,x:L.x-x,z:L.z-F,yaw:Math.PI,phase:v.range(0,6.28)}}const re=(v,O,L)=>{const x=i("anchored-"+v);return{kind:"anchored",x:x.range(O[0],O[1]),z:x.range(O[2],O[3]),yaw:Math.PI+x.range(-L,L),phase:x.range(0,6.28)}};o.anchored=[re("north",me.north,.3)],t.density>.95&&o.anchored.push(re("northwest",me.northWest,.3)),o.anchored.push(re("lee-road",me.leeA,.4),re("lee",me.leeB,.4)),o.anchored.push(re("harbour-a",me.harbourA,.6),re("harbour-b",me.harbourB,.6),re("harbour-c",me.harbourC,.6),re("mouth-a",me.mouthA,.5),re("mouth-b",me.mouthB,.5)),yield,o.reefs=[],o.reefGroups={};const ie=(v,O)=>{o.reefs.push(O),(o.reefGroups[v]=o.reefGroups[v]||[]).push(O)};{const v=i("reefs-ring");for(let O=0;O<13;O++){const L=(O+v.range(.1,.9))/13,x=U(-2.75,-.45,L),F=v.range(Lt[0],Lt[1]),P=v.range(2.5,6);ie("ring",{x:-4+Math.cos(x)*F*1.05,z:Math.sin(x)*F-4,r:P,h:v.range(.5,1.5)*Math.min(1,P/4),seedK:v()})}}for(const[v,O]of Object.entries(fo)){const L=i("reefs-"+v);for(let x=0;x<O[4];x++){const F=U(O[2],O[3],(x+L.range(.2,.8))/O[4]),P=L.int(3,4);for(let C=0;C<4;C++){const D=F+L.range(-no,no),z=L.range(O[0],O[1]),H=L.range(Tt[0],Tt[1]),K=L.range(.5,1.4),y=L();C<P&&ie(v+x,{x:z,z:D,r:H,h:K,seedK:y})}}}{const v=i("reefs-mouth"),O=v.int(5,7),L=Mt;for(let x=0;x<7;x++){const F=(x+v.range(.15,.85))/7,P={x:U(L[0],L[1],v()),z:U(L[2],L[3],F),r:v.range(2.5,4.6),h:v.range(.6,1.5),seedK:v()};x<O&&ie("mouth",P)}}o.spray=[];{const v=i("spray-reefs");for(const x of o.reefs){const F={x:x.x+v.range(-.3,.3)*x.r,z:x.z-x.r*.75,w:x.r*v.range(.9,1.3),h:1.8+x.r*v.range(.45,.8),ph:v.range(0,.12),k:v.range(0,40),second:0},P={x:x.x+v.range(-.7,.7)*x.r,z:x.z-x.r*.35,w:x.r*.7,h:1.5+x.r*.4,ph:v.range(0,.12),k:v.range(0,40),second:1};o.spray.push(F),x.r>4&&o.spray.push(P)}const O=i("spray-walls"),L=(x,F,P,C,D=0)=>o.spray.push({x,z:F,w:P,h:C,ph:O.range(0,.12),k:O.range(0,40),second:D});for(let x=0;x<9;x++)L(U(-34,26,(x+O.range(.2,.8))/9),-37.5-O.range(0,2.5),O.range(3,5),O.range(3.5,6),x%2);for(let x=0;x<5;x++)L(U(36,94,(x+O.range(.2,.8))/5),-14.6-O.range(0,1.2),O.range(2.2,3.6),O.range(2,3.4));for(let x=0;x<3;x++)L(31.5+O.range(0,1.5),U(-33,-16,(x+O.range(.2,.8))/3),O.range(2.5,4),O.range(3,4.5))}yield,o.standers=[];{const v=i("standers"),O=Math.round(14*t.density),L=h.RAMP_W/2,x=ae.stander.half,F=x+pe,P=y=>{const N=gt+ae.donkey.half+Ge+x,I=Kt-bt-F;return[wt+F,h.RAMP_HEAD_X-bt-F,y>0?N:-I,y>0?I:-N]},C=[h.SHELF_X0+15,h.SHELF_X1-1,Vt[1]+ae.walker.half+Ge+x,h.SHELF_Z1-Ue-Ie-F],D=[P(1),P(-1),[h.TONGUE_X0+10,h.RAMP_FOOT_X-4,-(h.TONGUE_HALF-1.5),-(L+2.7)],[h.TONGUE_X0+6,ye-2,L+2.9,h.TONGUE_HALF-1.5],C,P(1),C],z=[...jt.map(Do),...kt.flatMap(([y,N,I,ee])=>[-1,1].flatMap(V=>[-1,1].map(ue=>[y+V*I/2-.05,y+V*I/2+.05,N+ue*ee/2-.05,N+ue*ee/2+.05]))),...ze.map(([y,,N])=>[y-Ie,y+Ie,N-Ie,N+Ie])],H=y=>z.every(N=>Math.hypot(Math.max(N[0]-y.x,0,y.x-N[1]),Math.max(N[2]-y.z,0,y.z-N[3]))>=F)&&o.standers.every(N=>Math.hypot(N.x-y.x,N.z-y.z)>=2*x+Ge);for(let y=0;y<18;y++){const N=D[y%D.length],I=v.range(N[0],N[1]),ee=v.range(N[2],N[3]),V={x:I,z:ee,y:Bt(I,ee),yaw:v.range(0,6.28),tint:v()};y<O&&H(V)&&o.standers.push(V)}const K=i("keepers");for(let y=0;y<6;y++){const N=y>=4,I=N?2:4,ee=((N?y-4:y)-.4+.8*K.range(0,6.28)/6.28)*2*Math.PI/I,V=ma[N?1:0];o.standers.push({x:Math.cos(ee)*V,z:Math.sin(ee)*V,y:N?fe:Z,yaw:ee,tint:K()})}}const ce=Ce(Math.round(6.5*t.density),5,8),Eo=2*(Ft+Ee.fisher[0])+2;o.fishers=[];for(let v=0;v<ce;v++){const O=i("fisher"+v),L=la[v];let x=0,F=0,P=!1;for(let N=0;N<40&&!P;N++)x=O.range(L[0],L[1]),F=O.range(L[2],L[3]),P=o.fishers.every(I=>Math.hypot(I.x-x,I.z-F)>Eo)&&o.reefs.every(I=>Math.hypot(I.x-x,I.z-F)>I.r+15);const C=i("fisher-habit"+v),D=C.chance(.5),z=C.range(5,Ft),H=C.range(.06,.1)*C.sign(),K=C.range(0,6.28),y=C.range(0,6.28);P&&o.fishers.push({kind:"fisher",x,z:F,r:D?z:0,w:D?H:0,yaw:K,phase:y})}{const v=i("net"),O=ra,L=v.range(O[0],O[1]),x=v.range(O[2],O[3]),F=v.range(11,13),P=v.range(-.35,.35),C=Math.cos(P),D=Math.sin(P),z={kind:"fisher",x:L-C*F,z:x-D*F,r:0,w:0,yaw:Math.PI+v.range(-.5,.5),phase:v.range(0,6.28)},H={kind:"fisher",x:L+C*F,z:x+D*F,r:0,w:0,yaw:Math.PI+v.range(-.5,.5),phase:v.range(0,6.28)};o.fishers.push(z,H),o.net={a:[z.x,z.z],b:[H.x,H.z],boats:[z,H],sag:v.range(5,8),mid:[L,x]}}{const v=i("moored"),O=Ce(Math.round(6*t.density),5,7);o.moored=[];for(let L=0;L<7;L++){const x=v.range(.35,.65),F=v.range(-.06,.06),P=v.range(0,6.28);L<O&&o.moored.push({kind:"moored",x:U(h.TONGUE_X0+16,ye,(L+x)/O),z:h.TONGUE_HALF+3.1,yaw:F,phase:P})}o.moored.push(o.lighter)}yield;const Dt=v=>{const O=v*(gt+Ho)/2,L=_t/2,x=v*Math.PI/2;return to([...lt(Co,O,L,x,3*x),...lt(Wo,O,L,-x,x)])},$e=Dt(-1),Ze=Dt(1),pt=(()=>{const[v,O]=Vt,[L,x]=ko,F=At/2,P=F*Math.tan(Math.PI/8),C=ot[0]-(ae.walker.half+pe),D=C-(v-L),z=(ye+et)/2,H=h.SHELF_X1-(pe+ae.walker.fore+F),K=Math.PI/2;return to([[H,v],[C+P,v],[D+P,L],...lt(z,(L+x)/2,F,-K,-3*K),[D-P,x],[C-P,O],...lt(H,(v+O)/2,F,K,-K).slice(0,-1)])})();o.northWalk=$e,o.southWalk=Ze,o.shelfWalk=pt,o.walkSpeed=1.15;{const v=i("donkeys"),O=v.int(5,6),L=v.range(0,$e.length);o.donkeys=[];for(let H=0;H<O;H++)o.donkeys.push({s0:L-H*2.7,walk:$e});const x=v.int(5,6),F=v.range(0,Ze.length);for(let H=0;H<x;H++)o.donkeys.push({s0:F-H*2.7,walk:Ze});const P=i("ramp-walkers"),C=Math.round(18*t.density);o.rampWalkers=[];for(let H=0;H<24;H++){const K=P.range(.15,.85),y=P(),N=H%2===0,I=N?Ze:$e,ee=Math.floor(H/2),V=(N?F:L)+8+(I.length-30)*(ee+K)/12;H<C&&o.rampWalkers.push({s0:V,side:0,tint:y,walk:I})}const D=i("shelf-walkers"),z=Math.round(5*t.density);o.shelfWalkers=[];for(let H=0;H<7;H++){const K=D.range(.2,.8),y=D();H<z&&o.shelfWalkers.push({s0:pt.length*(H+K)/z,side:0,tint:y,walk:pt})}}const So=v=>v&&v.length?[v.reduce((O,L)=>O+L.x,0)/v.length,v.reduce((O,L)=>O+L.z,0)/v.length]:null,Be=i("gull-loops"),Gt=(v,O,L)=>{const x=Rt,[F,P]=ho(x.spread,x.wander),C=v+x.clear+Math.SQRT2*F,D=C*Be.range(x.long[0],x.long[1]),z=Be.range(0,2*Math.PI),H=Be()<.5?-1:1,K=Be.range(0,2*Math.PI),y=O+P+x.rise,N=[],I=16;let ee=0;for(let V=0;V<I;V++){const ue=H*V/I*2*Math.PI,We=D*Math.cos(ue),Ut=C*Math.sin(ue);N.push([We*Math.cos(z)-Ut*Math.sin(z),y+x.rise*Math.sin(2*ue+K),We*Math.sin(z)+Ut*Math.cos(z)])}for(let V=0;V<I;V++){const ue=N[V],We=N[(V+1)%I];ee+=Math.hypot(We[0]-ue[0],We[2]-ue[2])}return{route:N,wheel:!0,corner:v,lowest:O,center:[0,y,0],radius:D,height:x.rise,spread:[x.spread[0],x.spread[1],ee],wander:x.wander,count:L}};o.gulls=[{...Gt(h.S2_FLATS/2/Math.cos(Math.PI/8),Z+Rt.head,Math.round(36*t.density)),stream:"gull-wheel-upper"}];const vt=So(o.reefGroups.shoal2),It=o.net.mid;vt&&o.gulls.push({stream:"gulls1",center:[vt[0],11,vt[1]],radius:9,height:3,spread:[4,2.5,4],wander:co,count:Math.round(9*t.density)}),o.gulls.push({stream:"gulls2",center:[It[0],11,It[1]+4],radius:12,height:3,spread:[6,3,6],wander:co,count:Math.round(8*t.density)}),o.gulls.push({...Gt(Math.SQRT2*h.S1_FOOT/2,Qe+Rt.over,Math.round(80*t.density)),stream:"gull-wheel-lower",overRamp:!0});{const v=ta,O=ho(v.spread,v.wander)[0],L=v.bend,x=h.TONGUE_HALF+O,F=x+L,P=h.TONGUE_X0+16+O+L,C=h.SHELF_X1-O-L,D=[],z=[0,.25,.5,.75,1];for(const y of z)D.push([U(P,C,y),x]);for(const y of[30,60,90,120,150])D.push([C+L*Math.sin(y*ne),F-L*Math.cos(y*ne)]);for(const y of z)D.push([U(C,P,y),x+2*L]);for(const y of[30,60,90,120,150])D.push([P-L*Math.sin(y*ne),F+L*Math.cos(y*ne)]);const H=D.map(([y,N],I)=>[y,v.y+v.rise*Math.sin(I/D.length*4*Math.PI),N]),K=2*(C-P)+2*Math.PI*L;o.gulls.push({stream:"gull-low-moored",route:H,reach:O,center:[(P+C)/2,v.y,F],radius:(C-P)/2+L,height:v.rise,spread:[v.spread[0],v.spread[1],K],wander:v.wander,count:Math.round(12*t.density)})}return o}function ha(e,a,t=[0,0,0,1]){if(e.alongside){ha(e.alongside,a,t);const o=t[2],i=t[3];t[0]+=i*e.off+o*e.fore,t[1]+=-o*e.off+i*e.fore}else if(e.lane){const o=e.lane.length,i=((e.s0+e.v*a)%o+o)%o,l=e.lane.posAtDist(i),n=e.lane.tangentAtDist(i);t[0]=l.x,t[1]=l.z;const s=Math.hypot(n.x,n.z)||1;t[2]=n.x/s,t[3]=n.z/s}else if(e.kind==="fisher"&&e.r>0){const o=e.phase+e.w*a;t[0]=e.x+Math.cos(o)*e.r,t[1]=e.z+Math.sin(o)*e.r;const i=Math.sign(e.w);t[2]=-Math.sin(o)*i,t[3]=Math.cos(o)*i}else{const o=e.kind==="moored"?.25:St;t[0]=e.x+Math.sin(a*.05+e.phase)*o,t[1]=e.z+Math.cos(a*.043+e.phase*1.7)*o*(e.kind==="moored"?.4:1);const i=e.yaw+Math.sin(a*.037+e.phase)*(e.kind==="moored"?.03:.12);t[2]=Math.sin(i),t[3]=Math.cos(i)}return t}function $a(e,a){const t=Re(Me("pharos-sea:"+e));return{rng:t,preset:"swell",height:a.swellHeight,wavelength:a.swellLength,steepness:.5,spread:.4,speed:1,windAngle:Math.PI/2+t.range(-.14,.14)}}const Pt=ze.length,wo=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uGlowDir, uGlowCol, uFillTurn, uFirePos, uFireCol, uDoorPos, uDoorCol;
uniform vec3 uCresset[${Pt}]; uniform float uCressetGain;
void phPl(vec3 n, float d, vec3 L, inout float tin, inout float tout, inout float miss){
  float v = dot(n, L);
  if (v > 1e-5) tout = min(tout, -d / v); else if (v < -1e-5) tin = max(tin, -d / v); else if (d > 0.) miss = 1.;
}
float phCyl(vec3 p, vec3 L, float r, float y0, float y1){
  float a = max(dot(L.xz, L.xz), 1e-5), b = dot(p.xz, L.xz), c = dot(p.xz, p.xz) - r * r, disc = b * b - a * c;
  if (disc <= 0.) return 0.;
  float sq = sqrt(max(disc, 0.)), ly = max(L.y, 1e-3);
  float lo = max(max((-b - sq) / a, (y0 - p.y) / ly), .05), hi = min((-b + sq) / a, (y1 - p.y) / ly);
  return hi > lo ? 1. : 0.;
}
// 1 where the sun reaches p, 0 in the tower's shadow: the square stage as its own leaning planes, the others as cylinders
float phSun(vec3 p){
  vec3 L = uSunDir; vec3 q = p - vec3(0., 4., 0.);
  float tin = .05, tout = 1e5, miss = 0.;
  phPl(vec3(.99944, .03331, 0.), dot(vec3(.99944, .03331, 0.), q) - 14.9917, L, tin, tout, miss);
  phPl(vec3(-.99944, .03331, 0.), dot(vec3(-.99944, .03331, 0.), q) - 14.9917, L, tin, tout, miss);
  phPl(vec3(0., .03331, .99944), dot(vec3(0., .03331, .99944), q) - 14.9917, L, tin, tout, miss);
  phPl(vec3(0., .03331, -.99944), dot(vec3(0., .03331, -.99944), q) - 14.9917, L, tin, tout, miss);
  phPl(vec3(0., 1., 0.), p.y - 65.2, L, tin, tout, miss);
  float s = (miss < .5 && tout > tin) ? 1. : 0.;
  s = max(s, phCyl(p, L, 8.1, 64., 94.));
  s = max(s, phCyl(p, L, 4.3, 94., 102.));
  return 1. - s;
}
// the harbour lights of the landing and the quay (lit at the afterglow only: uCressetGain is 0 by day): each throws
// a warm pool some 6 m across on the stone round it. Only the tongue's outer half asks.
vec3 phSmallFires(vec3 n, vec3 p){
  if (uCressetGain <= 0. || p.x < 60. || p.x > 104. || abs(p.z) > 22. || p.y > 12.) return vec3(0.);
  float s = 0.;
  for (int i = 0; i < ${Pt}; i++) { vec3 v = uCresset[i] - p; float d2 = dot(v, v); s += (.35 + .65 * max(dot(n, v) / sqrt(d2 + 1e-3), 0.)) / (1. + d2 / 7.); }
  return vec3(1., .5, .18) * (s * uCressetGain);
}
// THE HOUR'S LIGHT, ONE TWO-SIDED LAW FOR EVERY MATERIAL OF THE PLACE (round 6). Each standing hour has a bright
// quarter (the sun, or after sunset the glow where it went down, 28 degrees north of west) and a cool sky opposite.
// A face takes, BY ITS OWN FACING and the hour's row of colours, nothing else:
//   the bright quarter's colour (uGlowCol: white gold at the low sun, orange gold at sunset, rose at early dusk) by
//   the share of that quarter it is turned to (phTurn: all of it full on, nine tenths on the tower's north face,
//   a seventh on a face turned an eighth of a turn past side-on, none on a face turned away; a top takes six tenths
//   of its share, for the quarter lies low and a top looks at the zenith);
//   the sun itself while it is up (uSunCol), cut off by the tower's own shadow;
//   the cool sky: the zenith's on a top (uSkyCol), the sea's dim return on what looks down (uGndCol), half of each
//   on a wall: the upper sky's blue-violet, which is all a face turned away has, A CLEAR STEP DARKER than the lit
//   side (on the tower's white about six tenths of it as shown) and never black;
//   (r6c) THE SKY'S FILL ON A WALL TAKES ITS HUE BY THE WALL'S FACING, FROM THE HOUR'S OWN SKY (phFill): a wall
//   turned from the bright quarter keeps the blue-violet above; turned toward it the fill goes over to the tone of
//   the sky that stands before such a wall (uFillTurn: the kit's sky of the hour, gathered in the world's build over
//   the half of the dome before a wall turned to the bright quarter, divided by the same for a wall turned from it:
//   more red, less green and blue), by half of one plus the cosine of the angle between the wall's facing and the
//   quarter's bearing; a top keeps the zenith's tone whole. No new light: the same fill, told by quarter.
// and BY ITS PLACE the hearth's light, the door's and the small fires', as before. ao: the share of the sky and the
// bright quarter that reaches it (contact shade under a cornice, a sill, a belt).
float phTurn(vec3 n){ return smoothstep(-.6, .7, dot(n, uGlowDir)) * (1. - .4 * max(n.y, 0.)); }
vec3 phFill(vec3 n){
  float toward = .5 + .5 * dot(n.xz / max(length(n.xz), 1e-3), uGlowDir.xz / max(length(uGlowDir.xz), 1e-3));
  return mix(uGndCol, uSkyCol, clamp(n.y * .5 + .5, 0., 1.)) * mix(vec3(1.), uFillTurn, clamp(1. - n.y * n.y, 0., 1.) * toward);
}
vec3 phLight(vec3 alb, vec3 n, vec3 p, float ao){
  float ndl = max(dot(n, uSunDir), 0.);
  vec3 sky = phFill(n);
  // the fire: by distance from the hearth (a wide bed of fire, so the light falls off gently)
  vec3 fv = uFirePos - p; float fd = max(length(fv), .5);
  vec3 fire = uFireCol * (.45 + .55 * max(dot(n, fv / fd), 0.)) / (1. + fd * fd / 140.);
  // the door's own light, from a point 2 m before the middle of the opening
  vec3 dv = uDoorPos - p; float dd = max(length(dv), .3);
  vec3 door = uDoorCol * max(dot(n, dv / dd), 0.) / (1. + dd * dd / 30.);
  return alb * (uSunCol * ndl * phSun(p) + (sky + uGlowCol * phTurn(n)) * ao + fire + door + phSmallFires(n, p));
}
float phHash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float phNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(phHash(i), phHash(i + vec2(1., 0.)), f.x), mix(phHash(i + vec2(0., 1.)), phHash(i + vec2(1., 1.)), f.x), f.y); }
float phFbm(vec2 p){ return .5 * phNoise(p) + .25 * phNoise(p * 2.03 + 17.1) + .125 * phNoise(p * 4.1 + 31.7) + .0625 * phNoise(p * 8.3 + 5.3); }
// THE TOWER AS A MIRROR SEES IT: where a ray from o along d first meets the tower's three stages (the square stage
// as its own leaning planes, the others as cylinders: the measures the shadow law above reads). Returns the distance
// along the ray, or -1. where it passes the tower; n: the wall's facing there.
float phTowerHit(vec3 o, vec3 d, out vec3 n){
  float best = -1.; n = vec3(0., 1., 0.);
  vec3 q = o - vec3(0., 4., 0.); float tin = .05, tout = 1e5, miss = 0.; vec3 nin = vec3(0.);
  for (int i = 0; i < 4; i++) {
    vec3 pn = i == 0 ? vec3(.99944, .03331, 0.) : i == 1 ? vec3(-.99944, .03331, 0.) : i == 2 ? vec3(0., .03331, .99944) : vec3(0., .03331, -.99944);
    float v = dot(pn, d), dist = dot(pn, q) - 14.9917;
    if (v < -1e-5) { float t = -dist / v; if (t > tin) { tin = t; nin = pn; } } else if (v > 1e-5) tout = min(tout, -dist / v); else if (dist > 0.) miss = 1.;
  }
  if (d.y > 1e-5) tout = min(tout, (65.2 - o.y) / d.y);
  if (miss < .5 && tout > tin && dot(nin, nin) > .5) { best = tin; n = vec3(nin.x, 0., nin.z); }
  for (int i = 0; i < 2; i++) {
    float r = i == 0 ? 8.1 : 4.3, y0 = i == 0 ? 64. : 94., y1 = i == 0 ? 94. : 102.;
    float a = max(dot(d.xz, d.xz), 1e-6), b = dot(o.xz, d.xz), c = dot(o.xz, o.xz) - r * r, disc = b * b - a * c;
    if (disc > 0.) { float t = (-b - sqrt(disc)) / a, y = o.y + t * d.y;
      if (t > .05 && y > y0 && y < y1 && (best < 0. || t < best)) { best = t; vec3 h = o + d * t; n = normalize(vec3(h.x, 0., h.z)); } }
  }
  return best;
}
// GLINTS: the facets of the water that are too small to draw, each a mirror that shines for a moment when it stands
// as the mirror's law asks. p: the place on the water (m); share: the share of the facets there that stand right
// (0 to 1); px: the pixel's size on the water (m: the mean of its size across the view and along it, which at a low
// slant is far the longer); t: the world clock. A glint is a small round dot in a cell of the water, lit for about
// three quarters of a second and then dark (each cell by its own clock), in a new place within its cell each time.
// A cell is 0.15 m across near the eye and never less than five such pixels (it doubles
// as often as THE PIXEL'S SIZE asks, the two sizes blended: this reads the pixel's size alone), and a glint's light
// is such that THE MEAN OVER THE WATER IS share AT EVERY SIZE (a dot covers 0.1056 of its cell, is lit 0.6366 of
// its life at the mean, and six times share of the cells are lit: 1 / (6 x 0.1056 x 0.6366) = 2.48 at its peak).
float phGlintCells(vec2 p, float cell, float share, float t){
  vec2 g = p / cell, id = floor(g);
  float life = t * 1.3 + phHash(id + 11.7) * 9., k = floor(life);
  vec2 c = vec2(phHash(id + k * 7.13), phHash(id + k * 3.71 + 5.5)) * .5 + .25;
  float on = step(phHash(id * 1.37 + k * 13.9 + 2.2), min(share * 6., 1.));
  return on * (1. - smoothstep(.12, .24, length(fract(g) - c))) * sin(3.14159 * fract(life)) * 2.48;
}
float phGlints(vec2 p, float share, float px, float t){
  float l = log2(max(px * 5. / .15, 1.)), l0 = floor(l), c0 = .15 * exp2(l0);
  return mix(phGlintCells(p, c0, share, t), phGlintCells(p + 37.7, c0 * 2., share, t), l - l0);
}
`;function ca(e){return{uSunDir:{value:e.sunDir.clone()},uSunCol:{value:e.sunCol.clone()},uSkyCol:{value:e.skyCol.clone()},uGndCol:{value:e.gndCol.clone()},uGlowDir:{value:e.glowDir.clone()},uGlowCol:{value:e.glowCol.clone()},uFillTurn:{value:(e.fillTurn||new A.Color(1,1,1)).clone()},uFirePos:{value:new A.Vector3(0,B+2,0)},uFireCol:{value:e.fireCol.clone()},uDoorPos:{value:new A.Vector3(h.DOOR_X+2.5,Qe,0)},uDoorCol:{value:(e.doorCol||new A.Color(0,0,0)).clone()},uCresset:{value:Array.from({length:Pt},()=>new A.Vector3(0,-99,0))},uCressetGain:{value:0}}}const ua=`
attribute vec3 aC; attribute float aK; varying vec3 vW, vN, vC; varying float vK;
#include <fog_pars_vertex>
void main(){
  mat4 mm = modelMatrix;
  #ifdef USE_INSTANCING
  mm = modelMatrix * instanceMatrix;
  #endif
  vec4 wp = mm * vec4(position, 1.); vW = wp.xyz; vN = normalize(mat3(mm) * normal); vC = aC; vK = aK;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,go=9,Ve=10.6,ut=5.6,ft=1,Oe=.55,Ne=.32,fa=.14,da=[.45,.24,.12],be=[.4,.2,.1],pa=3,va=.55,Q={s1:[1.9,.55,.3,1.6,.22],s2:[1.4,.4,.22,1.1,.18],s3:[1,.3,.15,.7,.14]},je=[.6,.5],ma=[(h.S2_FLATS/2+h.S1_TOP/2+Q.s1[3]-je[0])/2,(h.S3_DIA/2+h.S2_FLATS/2+Q.s2[3]-je[1])/2],wa={jamb:[.28,.16],head:[.34,.24,.4],sill:[.28,.34,.46]},ga=.3,Nt=.85,_a=5*h.WIN_W*h.WIN_H/(ut*(h.S1_FOOT+h.S1_TOP)/2),ba=`
varying vec3 vW, vN, vC; varying float vK;
#define FLOOR_STEP ${ut.toFixed(2)}
#define U1 ${(Z-Q.s1[0]).toFixed(2)}
#define U2 ${(fe-Q.s2[0]).toFixed(2)}
#define U3 ${(B-Q.s3[0]).toFixed(2)}
#define WIN_SHARE ${_a.toFixed(4)}
#define BELT_Y0 ${(Ve-ft).toFixed(2)}
#define PLINTH_COURSE ${((Ve-ft-h.PLATFORM_Y)/5).toFixed(3)}
#define BELT_OUT ${Ne.toFixed(3)}
#define LEDGE_REACH ${pa.toFixed(2)}
#define LEDGE_SHADE ${va.toFixed(3)}
#define WINDOW_FAR ${ga.toFixed(3)}
#define O1 ${Q.s1[3].toFixed(2)}
#define O2 ${Q.s2[3].toFixed(2)}
#define O3 ${Q.s3[3].toFixed(2)}
${wo}
#include <fog_pars_fragment>
// A joint line of half width w (in cells) seen through a pixel a cells wide: the share of the pixel it covers. Under
// two pixels to a cell it goes over to the plain mean, so far masonry is one even tone and never a moire.
float phLine(float f, float w, float a){
  a = max(a, 1e-4);
  float c = min(clamp((w + .5 * a - min(f, 1. - f)) / a, 0., 1.), 2. * w / a);
  return mix(c, 2. * w, smoothstep(.3, .65, a));
}
// (p1) THE SHADE UNDER A LEDGE: below metres under a ledge that stands s proud, seen through a pixel a metres of wall high. The shade is
// 1 - smoothstep(0, LEDGE_REACH s, below), and what is returned is ITS MEAN OVER THE PIXEL (the integral in closed form), so that far off it goes over
// toward the band's plain mean (the mean is taken under the ledge alone: the part of a pixel that lies over the ledge takes none) and never steps
// from one pixel row to the next as the eye moves (no crawl; nothing finer than a pixel is drawn).
float phLedgeG(float t){ t = clamp(t, 0., 1.); return t - t * t * t + .5 * t * t * t * t; }
float phLedge(float below, float s, float a){
  float r = LEDGE_REACH * s; a = max(a, 1e-3);
  return r * (phLedgeG((below + .5 * a) / r) - phLedgeG((below - .5 * a) / r)) / a;
}
// coursed masonry: uv in metres, course height ch, block length bl, joint half width jw in metres.
// returns (joint share, the course's tone, the block's tone), tones about 0 with their own fade by distance
vec3 phCourses(vec2 uv, float ch, float bl, float jw){
  float v = uv.y / ch, row = floor(v);
  float u = uv.x / bl + mod(row, 2.) * .5 + phHash(vec2(row, 3.7)) * .3;
  float ay = fwidth(v), au = fwidth(u);
  float j = max(phLine(fract(v), jw / ch, ay), phLine(fract(u), jw / bl, au) * .8);
  float tc = (phHash(vec2(row, 1.3)) - .5) * (1. - smoothstep(.3, .9, ay));
  float tb = (phHash(vec2(floor(u), row)) - .5) * (1. - smoothstep(.3, .9, max(au, ay)));
  return vec3(j, tc, tb);
}
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-6, 0.)), alb = vC; float k = floor(vK + .5), ao = 1., sunCut = 0.;
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.)), spec = vec3(0.);
  vec2 tg = normalize(vec2(-n.z, n.x) + vec2(1e-4, 0.));
  vec2 uv = vec2(dot(vW.xz, tg), vW.y - 4.);
  if (k == 7.) uv.x = atan(vW.z, vW.x) * 4.35;
  if (k == 1. || k == 7.) {
    // limestone in courses half a metre high under a thin wash of white plaster: joints, a tone to each course and block
    vec3 c = phCourses(uv, ${h.COURSE_H.toFixed(2)}, ${h.BLOCK_L.toFixed(2)}, .024);
    float blot = phFbm(uv * vec2(.22, .3) + 3.), fine = phNoise(uv * vec2(1., 2.) * 2.);
    alb *= (.9 + .16 * blot) * (1. + .15 * c.y + .13 * c.z) * (.97 + .06 * fine) * (1. - .5 * c.x);
    // near scale, BY THE PIXEL'S SIZE ON THE WALL (fwNear: metres of wall to a pixel, as phCourses reads it): where
    // a pixel is smaller than about 4 cm, and fully under about 2 cm, each course shows as two bands of smaller
    // facing stones with hairline joints, and the plaster is crazed with fine cracks and pitted (INVENTED). Each
    // comes in ABOUT ITS OWN MEAN (joints 0.0813, cracks 0.0100, pits 0.2045 of the wall: counted, scratchpad
    // plaster-means.mjs), so the wall's tone is the same far and near.
    float fwNear = max(fwidth(uv.x), fwidth(uv.y)), near = 1. - smoothstep(.022, .044, fwNear);
    if (near > 0.) {
      vec3 c2 = phCourses(uv + vec2(.37, 0.), ${(h.COURSE_H/2).toFixed(3)}, ${(h.BLOCK_L*.42).toFixed(3)}, .007);
      float crack = smoothstep(.016, 0., abs(phNoise(uv * 1.7 + 11.) - .5)) * smoothstep(.45, .65, phNoise(uv * .35 + 4.));
      alb *= 1. - near * (.24 * (c2.x - .0813) + .2 * (crack - .01) + .1 * (smoothstep(.6, .8, phNoise(uv * 13.)) - .2045)) + near * .07 * c2.z;
    }
    // the first stage's four faces: the shade under each belt course (the belts stand at every floor, FLOOR_STEP
    // apart). (r6c: the corner is the plain meeting of two plastered faces, the courses' own faint lines running to
    // it; the dressed corner stones that stood here are gone: nothing invented is set on the Wonder as a thing of
    // it. The corner has its edge by the two faces' light.)
    float fh = ${(h.S1_FOOT/2).toFixed(2)} - ${((h.S1_FOOT-h.S1_TOP)/2).toFixed(3)} * clamp((vW.y - 4.) / ${(h.S1_H-.9).toFixed(2)}, 0., 1.);
    float onFace = step(abs(n.y), .3) * step(vW.y, U1 - .2) * step(BELT_Y0, vW.y) * step(abs(dot(vW.xz, normalize(n.xz + vec2(1e-5, 0.))) - fh), .2) * step(k, 1.5);
    if (onFace > 0.) {
      float below = FLOOR_STEP - mod(vW.y - BELT_Y0, FLOOR_STEP), onBelts = step(BELT_Y0 - FLOOR_STEP, vW.y) * step(vW.y, BELT_Y0 + 8.2 * FLOOR_STEP);
      // (p1) the shade under each belt by the belt's own stand (phLedge), and THE SUN'S OWN SHADE under it at the hours with the sun up: the belt's nose
      // cuts the sun off the wall for stand x (the sun's height / its bearing onto the face) below it (a hand's breadth at the low sun, less at sunset)
      ao *= 1. - LEDGE_SHADE * phLedge(below, BELT_OUT, fwidth(vW.y)) * onBelts;
      float toSun = dot(n, uSunDir);
      if (toSun > 0.) sunCut = onBelts * (1. - smoothstep(-.5, .5, (below - BELT_OUT * uSunDir.y / max(length(uSunDir.xz) * toSun, 1e-3)) / max(fwidth(vW.y), 1e-3)));
    }
    // weather: a grey-brown wash under each cornice and terrace, long dark streaks down the face from them
    float under = smoothstep(9., 0., U1 - vW.y) * step(vW.y, U1) + smoothstep(5., 0., U2 - vW.y) * step(64.5, vW.y) * step(vW.y, U2) + smoothstep(2.4, 0., U3 - vW.y) * step(95.2, vW.y) * step(vW.y, U3);
    float streak = phNoise(vec2(uv.x * .9, 1.)) * phNoise(vec2(uv.x * .23, 7.));
    alb *= mix(vec3(1.), vec3(.66, .62, .58), under * (.3 + .7 * streak) * .85);
    alb *= 1. - .12 * smoothstep(.55, .8, phNoise(vec2(uv.x * 1.7, uv.y * .05 + 9.)));
    // STONE, NOT PAINT: at middle distance the courses show as a faint banding, four courses to a band (each band
    // its own tone; it goes over to the mean where a pixel holds a band: by the pixel's size alone); low on the
    // tower, where the spray reaches, the plaster is a little warmer and darker (to about 12 m over the sea)
    float bandRow = floor(uv.y / ${(h.COURSE_H*4).toFixed(2)});
    alb *= 1. + .1 * (phHash(vec2(bandRow, 9.1)) - .5) * (1. - smoothstep(.5, 1.6, fwidth(uv.y)));
    alb *= mix(vec3(.93, .88, .8), vec3(1.), smoothstep(5., 16., vW.y + 2. * phNoise(vec2(uv.x * .12, 2.))));
    // the shade under the cornices, where the sky is shut out: a firm line of it close under each, thinning below
    float c1 = U1 - vW.y, c2 = U2 - vW.y, c3 = U3 - vW.y;
    // (p1) each cornice's shade by its own overhang, the one law of the ledges (phLedge), and the firm line close under it: .22, .2 and .18 (r6: .26,
    // .24 and .22), so that close under the first cornice the fill is 1 - .55 - .22 = .23 of the wall's (r6 left .44)
    float aw = fwidth(vW.y);
    ao *= 1. - (LEDGE_SHADE * phLedge(c1, O1, aw) + .22 * smoothstep(.9, .1, c1)) * step(vW.y, U1) - (LEDGE_SHADE * phLedge(c2, O2, aw) + .2 * smoothstep(.7, .1, c2)) * step(65.3, vW.y) * step(vW.y, U2)
      - (LEDGE_SHADE * phLedge(c3, O3, aw) + .18 * smoothstep(.5, .1, c3)) * step(95.2, vW.y) * step(vW.y, U3);
    // (the windows' dark is softened far off, below: the wall gives up the same light, so that the face's mean tone
    // is one far and near)
    alb *= 1. - WIN_SHARE * WINDOW_FAR * smoothstep(.06, .3, max(fwidth(uv.x), fwidth(uv.y))) * step(abs(n.y), .3) * step(vW.y, U1) * step(k, 1.5);
  } else if (k == 9.) {
    alb *= .96 + .08 * phNoise(vW.xz * 1.3 + vW.y * 2.);
  } else if (k == 10.) {
    // the plinth: five courses of large stones, each face of a stone a little bossed (paler toward its top edge),
    // darker with damp at the foot and crusted pale with salt above the damp
    vec3 c = phCourses(uv, PLINTH_COURSE, 2.7, .05);
    float inb = fract(uv.y / PLINTH_COURSE);
    alb *= (.86 + .2 * phFbm(uv * .5 + 7.)) * (1. + .16 * c.z + .08 * c.y) * (.9 + .16 * inb) * (1. - .5 * c.x);
    float wet = phNoise(vec2(uv.x * .35, 3.)) * 1.2 + phNoise(vec2(uv.x * 1.9, 5.)) * .4;
    alb *= mix(vec3(.5, .5, .47), vec3(1.), smoothstep(4.3, 5.4, vW.y - wet * .6));
    alb = mix(alb, vec3(.9, .9, .86), .5 * smoothstep(5.0, 5.7, vW.y - wet * .6) * smoothstep(7.4, 6.2, vW.y - wet * .8) * (.4 + .6 * phNoise(uv * vec2(.8, 2.5))));
    ao *= 1. - LEDGE_SHADE * phLedge(BELT_Y0 - vW.y, BELT_OUT, fwidth(vW.y));
  } else if (k == 2.) {
    vec3 c = phCourses(uv, .75, 1.7, .04);
    alb *= (.8 + .3 * phFbm(uv * .6)) * (1. + .2 * c.z + .08 * c.y) * (1. - .45 * c.x);
    alb *= mix(vec3(.42, .46, .44), vec3(1.), smoothstep(.2, 2.2, vW.y + .8 * phNoise(vW.xz * .3)));
  } else if (k == 3.) {
    float r = phFbm(vW.xz * .45 + vW.y * .3);
    alb *= (.6 + .8 * r) * mix(.5, 1., smoothstep(-.1, .7, vW.y));
  } else if (k == 4.) {
    // red granite, polished: dark and pale grains, a sheen of the sky and the bright quarter on it. No joint is drawn:
    // as built: each post is a single stone 11.56 m high and the lintel over them a single stone 1.2 m high (after the
    // one measured stone of this doorway, a post of over 11.50 m)
    float sp = phNoise(vW.yz * 9. + vW.x * 5.), sp2 = phNoise(vW.zy * 23. + 5.);
    alb *= (.8 + .34 * sp) * (.88 + .24 * sp2);
    float fr = pow(max(1. - max(dot(n, V), 0.), 0.), 3.);
    spec = uSkyCol * (.1 + .5 * fr) + (uGlowCol + uSunCol * .6) * pow(max(dot(n, normalize(V + uGlowDir + vec3(0., 1e-4, 0.))), 0.), 40.) * 1.5;
  } else if (k == 6.) {
    vec2 g = vW.xz / vec2(1.2, .8); g.x += mod(floor(g.y), 2.) * .5; vec2 f = fract(g); vec2 ag = fwidth(g);
    float j = max(phLine(f.x, .03, ag.x), phLine(f.y, .04, ag.y));
    alb *= (.82 + .3 * phFbm(vW.xz * .5)) * (.92 + .16 * phHash(floor(g)) * (1. - smoothstep(.3, .9, max(ag.x, ag.y)))) * (1. - .34 * j);
  } else if (k == 5.) {
    // dark bronze: a glint on the side toward the bright quarter of the sky, the sun and the fire
    alb *= .75 + .5 * phNoise(vW.xy * 1.7 + vW.z);
    vec3 fl = normalize(uFirePos - vW + vec3(0., 1e-3, 0.));
    spec = (uGlowCol * 1.6 + uSunCol * phSun(vW)) * pow(max(dot(n, normalize(V + uGlowDir + vec3(0., 1e-4, 0.))), 0.), 18.) * vec3(1., .82, .6)
      + uFireCol * pow(max(dot(n, normalize(V + fl + vec3(0., 1e-4, 0.))), 0.), 14.) * 6. / (1. + dot(uFirePos - vW, uFirePos - vW) / 60.);
  }
  vec3 col = phLight(alb, n, vW, ao) + spec;
  if (sunCut > 0.) col -= alb * uSunCol * max(dot(n, uSunDir), 0.) * phSun(vW) * sunCut;   // (p1) the sun cut off by a belt's nose
  // (p1) A REVEAL LIES IN ITS WALL'S SHADE. Inside an opening of the first stage (behind the wall's own face) a face looks out through the opening's mouth
  // at the sky THE WALL looks at: the bright quarter and the sky's fill reach it by no more than the wall's own facing gives (none of the quarter in a wall
  // turned away; the sun is cut there already, by the tower's own shadow: phSun). r6 lit a jamb by its own facing alone, so that in a wall turned from
  // the quarter one jamb of every window stood bright: the deeper reveal would have shown it twice as wide. From 2 to 12 cm behind the face the shade comes
  // on (no hard edge at the mouth). The hearth's light, the door's and the small fires' reach it as before, by its place.
  if ((k == 1. || k == 12.) && vW.y > BELT_Y0 && vW.y < U1 - .2) {
    vec3 wn = abs(vW.x) > abs(vW.z) ? vec3(sign(vW.x), 0., 0.) : vec3(0., 0., sign(vW.z));
    float fhw = ${(h.S1_FOOT/2).toFixed(2)} - ${((h.S1_FOOT-h.S1_TOP)/2).toFixed(3)} * clamp((vW.y - 4.) / ${(h.S1_H-.9).toFixed(2)}, 0., 1.);
    float inRev = smoothstep(.02, .12, fhw - max(abs(vW.x), abs(vW.z))) * step(dot(n, wn), .5);
    if (inRev > 0.) {
      col -= alb * max(phFill(n) + uGlowCol * phTurn(n) - phFill(wn) - uGlowCol * phTurn(wn), 0.) * ao * inRev;
      // (p1) THE REVEAL DARKENS INWARD AT r6'S OWN RATE: r6's reveal fell from its tone at the wall's face to .4 of it at the room, 0.42 m in; the
      // reveal's own colours still run evenly between those two tones over the whole depth (WINDOW_DEEP, 0.85 m), which alone would leave the reveal
      // paler inside than r6's at the same depth; so the tone is brought to .4 to the power (depth / 0.42 m): r6's own at 0.42 m, and on at that rate
      // (.16 at the room). A deep opening is dark inside: seen askew it is a dark slot, not a pale niche. (The lamp's light on a lit reveal, below, is
      // added after it, as before.)
      float dIn = clamp((fhw - max(abs(vW.x), abs(vW.z))) / ${Nt.toFixed(2)}, 0., 1.);
      col *= mix(1., pow(.4, dIn * ${(Nt/.42).toFixed(3)}) / mix(1., .4, dIn), inRev);
    }
  }
  // kind 8: a lamp, its own light
  if (k == 8.) col = vC;
  // kind 12: a lit window's reveal: the lamp's light lies on it, more the deeper in (the reveal's own colour tells
  // how deep: pale at the wall's face, dark at the room)
  if (k == 12.) col += vec3(${xe.r.toFixed(3)}, ${xe.g.toFixed(3)}, ${xe.b.toFixed(3)}) * (.75 * clamp((.86 - vC.r) / .5, 0., 1.));
  // kind 11: the dark of a room through a window. FAR OFF THE DARK IS SOFTENED, BY THE PIXEL'S SIZE ON THE WALL ALONE:
  // where a pixel is wider than 6 cm of wall the opening begins to take the wall's own lit tone, and where it is
  // wider than 30 cm it has taken WINDOW_FAR of it (.3; r6: .62): far off the wall is stone with a rhythm of openings, near
  // to it has real ones. The wall gives up what the openings gain (above), so the face's mean tone holds.
  if (k == 11.) col = mix(col, phLight(vec3(.74, .67, .56), n, vW, 1.), WINDOW_FAR * smoothstep(.06, .3, max(fwidth(uv.x), fwidth(uv.y))));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function Aa(e,a={}){return new A.ShaderMaterial({uniforms:{...A.UniformsUtils.clone(A.UniformsLib.fog),...e},vertexShader:ua,fragmentShader:ba,fog:!0,side:A.DoubleSide,...a})}function _o(){const e=[],a=[],t=[],o=[],i=(n,s,r,u)=>{e.push(n[0],n[1],n[2]),a.push(s[0],s[1],s[2]),t.push(r.r,r.g,r.b),o.push(u)},l={};return l.tri=(n,s,r,u,f,d)=>{const c=s[0]-n[0],m=s[1]-n[1],w=s[2]-n[2],_=r[0]-n[0],E=r[1]-n[1],g=r[2]-n[2];let p=m*g-w*E,b=w*_-c*g,S=c*E-m*_;const T=Math.hypot(p,b,S)||1;p/=T,b/=T,S/=T,d&&p*(n[0]-d[0])+b*(n[1]-d[1])+S*(n[2]-d[2])<0&&(p=-p,b=-b,S=-S);const M=[p,b,S];i(n,M,u,f),i(s,M,u,f),i(r,M,u,f)},l.quad=(n,s,r,u,f,d,c)=>{l.tri(n,s,r,f,d,c),l.tri(n,r,u,f,d,c)},l.quadC=(n,s,r,u,f,d,c,m,w,_)=>{const E=e.length/3;l.quad(n,s,r,u,f,w,_),[f,d,c,f,c,m].forEach((g,p)=>{t[(E+p)*3]=g.r,t[(E+p)*3+1]=g.g,t[(E+p)*3+2]=g.b})},l.box=(n,s,r,u,f,d,c,m,w)=>{const _=[(n+u)/2,(s+f)/2,(r+d)/2],E=w??m;l.quad([n,s,r],[u,s,r],[u,f,r],[n,f,r],c,m,_),l.quad([n,s,d],[u,s,d],[u,f,d],[n,f,d],c,m,_),l.quad([n,s,r],[n,s,d],[n,f,d],[n,f,r],c,m,_),l.quad([u,s,r],[u,s,d],[u,f,d],[u,f,r],c,m,_),l.quad([n,f,r],[u,f,r],[u,f,d],[n,f,d],c,E,_),l.quad([n,s,r],[u,s,r],[u,s,d],[n,s,d],c,m,_)},l.walls=(n,s,r,u,f,d,c)=>{const m=n.length;for(let w=0;w<m;w++){const _=(w+1)%m;l.quad([n[w][0],s,n[w][1]],[n[_][0],s,n[_][1]],[r[_][0],u,r[_][1]],[r[w][0],u,r[w][1]],f,d,c)}},l.cap=(n,s,r,u,f=1)=>{let d=0,c=0;for(const w of n)d+=w[0]/n.length,c+=w[1]/n.length;const m=[0,f,0];for(let w=0;w<n.length;w++){const _=(w+1)%n.length;i([d,s,c],m,r,u),i([n[w][0],s,n[w][1]],m,r,u),i([n[_][0],s,n[_][1]],m,r,u)}},l.round=(n,s,r,u,f,d,c,m,w)=>{for(let _=0;_<c;_++){const E=_/c*6.2831853,g=(_+1)/c*6.2831853,p=Math.cos(E),b=Math.sin(E),S=Math.cos(g),T=Math.sin(g),M=[[n+p*r,u,s+b*r],[n+S*r,u,s+T*r],[n+S*f,d,s+T*f],[n+p*f,d,s+b*f]],W=[p,0,b],k=[S,0,T];i(M[0],W,m,w),i(M[1],k,m,w),i(M[2],k,m,w),i(M[0],W,m,w),i(M[2],k,m,w),i(M[3],W,m,w)}},l.count=()=>e.length/9,l.geometry=()=>{const n=new A.BufferGeometry;return n.setAttribute("position",new A.Float32BufferAttribute(e,3)),n.setAttribute("normal",new A.Float32BufferAttribute(a,3)),n.setAttribute("aC",new A.Float32BufferAttribute(t,3)),n.setAttribute("aK",new A.Float32BufferAttribute(o,1)),n.computeBoundingSphere(),n},l.geometryInSteps=async n=>{const s=new A.BufferGeometry;return s.setAttribute("position",new A.Float32BufferAttribute(e,3)),await n(),s.setAttribute("normal",new A.Float32BufferAttribute(a,3)),await n(),s.setAttribute("aC",new A.Float32BufferAttribute(t,3)),await n(),s.setAttribute("aK",new A.Float32BufferAttribute(o,1)),await n(),s.computeBoundingSphere(),s},l}const le=(e,a,t=0,o=0,i=0)=>{const l=[];for(let n=0;n<e;n++){const s=t+n/e*Math.PI*2;l.push([o+Math.cos(s)*a,i+Math.sin(s)*a])}return l},Ht=e=>[[-e,-e],[e,-e],[e,e],[-e,e]],Y={plaster:new A.Color("#e6dccb"),block:new A.Color("#cbbd9e"),rock:new A.Color("#7d766a"),granite:new A.Color("#b25a4c"),bronze:new A.Color("#3a2f28"),paving:new A.Color("#bdb096"),wood:new A.Color("#6b5138"),dark:new A.Color("#0c0b0a"),soot:new A.Color("#3b352f")};function xa(e,a){const t=h.PLATFORM_Y,o=Y,i=[[-40,-27],[-32,-35],[22,-35],[30,-27],[30,27],[22,35],[-32,35],[-40,27]],l=i.map(p=>[p[0]*1.03-.15,p[1]*1.035]);e.walls(l,-2.5,i,t,o.block,2,[-5,0,0]),e.cap(i,t,o.paving,6);const n=56,s=[];for(let p=0;p<n;p++){const b=p/n*Math.PI*2,S=Math.cos(b),T=Math.sin(b),M=Math.min(S>0?35/Math.max(S,1e-6):35/Math.max(-S,1e-6),35/Math.max(Math.abs(T),1e-6))*1.02,W=.55+.9*(.5+.5*a.n2(S*2.3+7,T*2.3)),k=Oo(.86,.97,S),R=[];for(const[$,we]of[[0,2.3],[3,1.1],[7.5,.35],[13,-2.2]]){const q=M+$*W*(1-.85*k),ge=$>0&&$<13?.9*a.n2(S*9+$,T*9)+.5*a.n2(S*23,T*23+$):0;R.push([-5+S*q,we+ge*(1-k),T*q])}s.push(R)}for(let p=0;p<n;p++){const b=s[p],S=s[(p+1)%n];for(let T=0;T<3;T++)e.quad(b[T],S[T],S[T+1],b[T+1],o.rock,3,[-5,-30,0])}const r=h.TONGUE_X0-.5,u=h.TONGUE_X1,f=h.TONGUE_HALF,d=h.SHELF_X0,c=h.SHELF_Z0,m=h.SHELF_Y;e.box(r,-2.5,-f,u,t,c,o.block,2,6),e.box(r,-2.5,c,d,t,f,o.block,2,6),e.box(d,-2.5,c,u,m,f,o.block,2,6);for(let p=0;p<6;p++)e.box(d,-2.5,f+p*.36,u,m-(p+1)*.3,f+(p+1)*.36,o.block,2,6);const w=tt,_=Je,E=et,g=(_-E)/w;for(let p=0;p<w;p++)e.box(_-(p+1)*g,m,De,_-p*g,U(m,de(E),(p+1)/w),mt,o.block,2,6);e.box(ye,m,De,E,de(E),mt,o.block,2,6);{const[p,b,S]=ot;e.quad([b,m,5],[b,m,S],[p,t,S],[p,t,5],o.paving,6),e.tri([b,m,S],[p,t,S],[p,m,S],o.block,2)}return{out:i}}async function Ea(e,a){const t=Y,o=h.PLATFORM_Y,i=h.RAMP_FOOT_X,l=h.RAMP_HEAD_X,n=h.RAMP_L/h.RAMP_ARCHES,s=1.6,r=h.RAMP_W/2+.5,u=new A.Shape;u.moveTo(i,o),u.lineTo(l,o),u.lineTo(l,o+h.DOOR_SILL),u.closePath();let f=0;for(let b=0;b<h.RAMP_ARCHES;b++){const S=i-(b+.5)*n,T=de(S+s)-o-.6,M=new A.Path;if(!(T<.5)){if(T>=s+.2){const W=T-s;M.moveTo(S-s,o+.05),M.lineTo(S-s,o+W),M.absarc(S,o+W,s,Math.PI,0,!0),M.lineTo(S+s,o+.05)}else{const W=o+T-s,k=Math.asin((o+.05-W)/s);M.moveTo(S+s*Math.cos(k),o+.05),M.absarc(S,W,s,k,Math.PI-k,!1)}M.closePath(),u.holes.push(M),f++}}await a();const d=new A.ExtrudeGeometry(u,{depth:r*2,bevelEnabled:!1,curveSegments:10}).toNonIndexed();await a();const c=d.attributes.position,m=d.attributes.normal,w=b=>[c.getX(b),c.getY(b),c.getZ(b)-r];for(let b=0;b<c.count;b+=3){const S=m.getY(b)>.5&&m.getX(b)>.05,T=Math.abs(m.getZ(b))<.5&&!S;e.tri(w(b),w(b+1),w(b+2),T?t.block.clone().multiplyScalar(.55):S?t.paving:t.block,S?6:2),b%900===897&&await a()}d.dispose();const _=(b,S,T,M)=>{const W=de(b),k=de(S),R=h.RAMP_PARAPET,$=[(b+S)/2,(W+k)/2+.4,(T+M)/2];e.quad([b,W,T],[S,k,T],[S,k+R,T],[b,W+R,T],t.block,2,$),e.quad([b,W,M],[S,k,M],[S,k+R,M],[b,W+R,M],t.block,2,$),e.quad([b,W+R,T],[S,k+R,T],[S,k+R,M],[b,W+R,M],t.block,2,$),e.quad([b,W,T],[b,W+R,T],[b,W+R,M],[b,W,M],t.block,2,$),e.quad([S,k,T],[S,k+R,T],[S,k+R,M],[S,k,M],t.block,2,$)};_(i,l,-r,-r+.5),_(i,Po,r-.5,r),_(ye,l,r-.5,r);const E=o+h.DOOR_SILL,g=Kt,p=bt;e.box(14.4,o,-g,l,E,g,t.block,2,6);for(const b of[-1,1])e.box(14.6,E,b*g-(b>0?p:0),l,E+.9,b*g+(b>0?0:p),t.block,2),e.box(l-p,E,b*r,l,E+.9,b*g,t.block,2);return{arches:h.RAMP_ARCHES,open:f}}function Wt(e,a,t,[o,i,l,n,s],r){const u=t-o,f=u+i,d=[0,u-40,0],c=[0,t+40,0],m=[0,u,0];e.walls(a(0),u-.06,a(l),u,r,9,c),e.walls(a(l),u,a(l),f,r,9,m),e.walls(a(l),f,a(n-.1),f+.001,r.clone().multiplyScalar(.8),9,c),e.walls(a(n-.1),f,a(n-.1),t-s,r,9,m),e.walls(a(n-.1),t-s,a(n),t-s+.001,r,9,c),e.walls(a(n),t-s,a(n),t,r,9,m)}function bo(e,a,t,o,i,l,n,s){e.walls(a(o),t,a(o),t+l-.16,n,s,[0,t,0]),e.walls(a(i),t,a(i),t+l-.16,n,s,[0,t,600]),e.walls(a(o+.07),t+l-.16,a(o+.07),t+l,n,9,[0,t,0]),e.walls(a(i-.07),t+l-.16,a(i-.07),t+l,n,9,[0,t,600]),e.walls(a(i-.07),t+l,a(o+.07),t+l+.001,n,9,[0,t-40,0]),e.walls(a(i-.07),t+l-.16,a(o+.07),t+l-.159,n,9,[0,t+40,0])}function Sa(e){const a=Y,t=h.PLATFORM_Y,o=h.S1_TOP/2,i=[0,40,0],l=a.plaster.clone().multiplyScalar(1.06),n=Q.s1[3];Wt(e,_=>Ht(o+_),Z,Q.s1,l),e.cap(Ht(o+n),Z,a.paving,6),bo(e,_=>Ht(o+_),Z,n-.15,n-je[0],h.PARAPET_H,a.plaster,1);const s=h.S2_FLATS/2/Math.cos(Math.PI/8),r=_=>le(8,_,Math.PI/8),u=Q.s2[3],f=1/Math.cos(Math.PI/8);e.walls(r(s),Z,r(s),fe-.3,a.plaster,1,i),Wt(e,_=>r(s+_*f),fe,Q.s2,l),e.cap(r(s+u*f),fe,a.paving,6),bo(e,_=>r(s+_*f),fe,u-.12,u-je[1],1,a.plaster,1);for(const _ of[Z+h.S2_H/3,Z+2*h.S2_H/3]){const[E,g,p]=da,b=s+g*f;e.walls(r(b),_,r(b),_+E,l,9,i),e.walls(r(b),_+E,r(s),_+E+p,l,9,[0,_-30,0]),e.walls(r(s),_,r(b),_+.001,l.clone().multiplyScalar(.8),9,[0,_+30,0])}const d=h.S3_DIA/2,c=_=>le(40,_),m=fe+h.S3_H*.4;e.round(0,0,d,fe,d,B-.2,40,a.plaster,7),e.round(0,0,d+be[1],m,d+be[1],m+be[0],40,l,9),e.walls(c(d+be[1]),m+be[0],c(d),m+be[0]+be[2],l,9,[0,m-30,0]),e.walls(c(d),m-.001,c(d+be[1]),m,l.clone().multiplyScalar(.8),9,[0,m+30,0]),Wt(e,_=>c(d+_),B,Q.s3,l),e.cap(c(d+Q.s3[3]),B,a.soot,0),e.round(0,0,3.75,B,3.75,B+.55,32,a.soot,0),e.round(0,0,3.4,B,3.4,B+.55,32,a.soot,0),e.walls(le(32,3.4),B+.55,le(32,3.75),B+.551,a.soot,0,[0,0,0]);const w=h.PIER_W/2;e.box(-w,B,-w,w,ke-.3,w,a.plaster,1),e.box(-w-.18,ke-.3,-w-.18,w+.18,ke,w+.18,a.plaster,0)}function Oa(e){const a=Y,t=Ae,o=Ae+Xt,i=Ae+h.DOOR_H,l=h.DOOR_W/2,n=h.DOOR_JAMB,s=13.9,r=wt;for(const m of[-1,1])e.box(s,t,m>0?l:-l-n,r,o,m>0?l+n:-l,a.granite,4);const u=l+n+.25,f=.21,d=(h.DOOR_LINTEL-f)/3;for(let m=0;m<3;m++)e.box(s,o+m*d,-u-m*.05,r+.05+m*.07,o+(m+1)*d,u+m*.05,a.granite,4);e.box(s,i-f,-u-.24,r+.36,i,u+.24,a.granite,4);const c=a.granite.clone().multiplyScalar(.42);e.quad([r+.2,i-f-.11,-u-.1],[r+.2,i-f-.11,u+.1],[r+.2,i-f,u+.1],[r+.2,i-f,-u-.1],c,0,[0,i,0]);for(const m of[-1,1])e.quad([r+.012,o-.3,m*l],[r+.012,o-.3,m*(l+n)],[r+.012,o,m*(l+n)],[r+.012,o,m*l],c.clone().lerp(a.granite,.35),0,[0,o,0]);e.quad([14.95,t,-l],[14.95,t,l],[14.95,o,l],[14.95,o,-l],a.dark,0)}function oe(e,a,t,o,i,l,n,s){const r=new A.Vector3(t[0]-a[0],t[1]-a[1],t[2]-a[2]),u=r.length()||1;r.divideScalar(u);const f=new A.Vector3(0,1,0);Math.abs(r.y)>.92&&f.set(1,0,0);const d=new A.Vector3().crossVectors(r,f).normalize(),c=new A.Vector3().crossVectors(r,d),m=(g,p)=>{const b=[];for(let S=0;S<l;S++){const T=S/l*Math.PI*2,M=Math.cos(T),W=Math.sin(T);b.push([g[0]+(d.x*M+c.x*W)*p,g[1]+(d.y*M+c.y*W)*p,g[2]+(d.z*M+c.z*W)*p])}return b},w=m(a,o),_=m(t,i),E=[(a[0]+t[0])/2,(a[1]+t[1])/2,(a[2]+t[2])/2];for(let g=0;g<l;g++){const p=(g+1)%l;e.quad(w[g],w[p],_[p],_[g],n,s,E)}for(let g=1;g<l-1;g++)e.tri(_[0],_[g],_[g+1],n,s,E),e.tri(w[0],w[g],w[g+1],n,s,E)}function dt(e,a,t,o,i,l,n,s=8,r=5){const u=(f,d)=>{const c=d/r*Math.PI,m=f/s*Math.PI*2;return[a[0]+Math.sin(c)*Math.cos(m)*t,a[1]+Math.cos(c)*o,a[2]+Math.sin(c)*Math.sin(m)*i]};for(let f=0;f<r;f++)for(let d=0;d<s;d++)f===0?e.tri(u(d,0),u(d,1),u(d+1,1),l,n,a):f===r-1?e.tri(u(d,f),u(d+1,f),u(d,r),l,n,a):e.quad(u(d,f),u(d,f+1),u(d+1,f+1),u(d+1,f),l,n,a)}function La(e){const a=Y.bronze,t=ke,o=5;oe(e,[0,t,0],[0,t+2.6,.05],.78,.7,10,a,o),oe(e,[0,t+2.6,.05],[0,t+4.3,0],.7,.8,10,a,o),oe(e,[0,t+4.3,0],[0,t+5.55,0],.8,.98,10,a,o),dt(e,[0,t+5.6,0],.62,.42,1.02,a,o),oe(e,[0,t+5.7,0],[0,t+6.1,0],.26,.24,8,a,o),dt(e,[0,t+6.52,0],.42,.48,.44,a,o),oe(e,[0,t+5.5,.92],[.5,t+5.2,1.75],.24,.2,7,a,o),oe(e,[.5,t+5.2,1.75],[.62,t+6,2.05],.19,.16,7,a,o),oe(e,[.62,t-.02,2.1],[.62,t+8.1,2.1],.085,.07,6,a,o),oe(e,[0,t+5.5,-.92],[.1,t+4.2,-1.1],.24,.2,7,a,o),oe(e,[.1,t+4.2,-1.1],[.45,t+3.3,-.95],.2,.16,7,a,o),oe(e,[.05,t+4.9,-1],[.1,t+2.2,-1.02],.34,.22,6,a,o)}const Ta=4.4;function Ra(e){const t=[],o=[],i=[];for(const[u,f]of[[2.5,0],[3.4,.41]]){const d=t.length/3;for(let c=0;c<=28;c++){const m=c/28*Math.PI*2;for(const w of[0,1])t.push(Math.cos(m)*u*(1-.3*w),B+.35+w*Ta,Math.sin(m)*u*(1-.3*w)),o.push(c/28+f,w)}for(let c=0;c<28;c++){const m=d+c*2;i.push(m,m+2,m+1,m+1,m+2,m+3)}}const l=new A.BufferGeometry;l.setAttribute("position",new A.Float32BufferAttribute(t,3)),l.setAttribute("uv",new A.Float32BufferAttribute(o,2)),l.setIndex(i);const n=new A.Mesh(l,new A.ShaderMaterial({uniforms:{uTime:e.uTime,uGain:e.uFireGain},transparent:!0,depthWrite:!1,side:A.DoubleSide,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uTime, uGain; varying vec2 vUv;
      float h(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y); }
      void main(){
        float v = clamp(vUv.y, 0., 1.);
        vec2 q = vec2(vUv.x * 28., v * 3.2 - uTime * 1.5);
        float f = .6 * n(q) + .3 * n(q * 2.1 + 7.) + .1 * n(q * 4.3);
        // tongues: full at the bed, torn toward the tips; never a flat sheet
        // (separate tongues with dark between them from a third of the way up, so the fire is never one rounded mass)
        // and three or four great licks round the ring that rise and sink slowly, so its outline is ragged from afar)
        float lick = .7 + .3 * n(vec2(vUv.x * 4. + 3., uTime * .35 + floor(vUv.x) * 7.));
        float body = smoothstep(0., .3, f + .84 - v * 1.3) * smoothstep(lick, lick - .3, v) * smoothstep(0., .06, v);
        // a white-orange core low in the bed, an orange body, red tips
        vec3 col = mix(vec3(1., .18, .03), vec3(1., .45, .08), smoothstep(.9, .35, v + .25 * (1. - f)));
        col = mix(col, vec3(1., .75, .35) * 1.3, smoothstep(.36, .0, v + .45 * (1. - f)));
        // the flame covers what is behind it (its own colour, not a wash of white over the plaster)
        gl_FragColor = vec4(col * uGain * 1.5, clamp(body, 0., 1.) * .9);
      }`}));n.name="fire",n.renderOrder=6,n.frustumCulled=!1;const s=new A.PlaneGeometry(1,1),r=new A.Mesh(s,new A.ShaderMaterial({uniforms:{uGain:e.uGlowGain??e.uFireGain,uSize:{value:64},uAt:{value:new A.Vector3(0,B+2.3,0)}},transparent:!0,depthWrite:!1,blending:A.AdditiveBlending,vertexShader:`uniform float uSize; uniform vec3 uAt; varying vec2 vUv;
      void main(){ vUv = position.xy * 2.; vec4 mv = viewMatrix * vec4(uAt, 1.); mv.xy += position.xy * uSize; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform float uGain; varying vec2 vUv;
      void main(){ float r = clamp(length(vUv), 0., 1.); float a = 1. - r; float wide = a * a * a, warm = smoothstep(.3, 0., r);
        gl_FragColor = vec4(vec3(1., .4, .1) * wide * .3 * uGain + vec3(1., .5, .16) * warm * warm * .26 * uGain, 1.); }`}));return r.name="fire-glow",r.renderOrder=7,r.frustumCulled=!1,{flame:n,glow:r}}const he=e=>h.S1_FOOT/2-(h.S1_FOOT-h.S1_TOP)/2*Ce((e-h.PLATFORM_Y)/(h.S1_H-.9),0,1),J=(e,a,t,o)=>{const i=he(t)+o;return[e[0]*i-e[1]*a,t,e[1]*i+e[0]*a]};function He(e,a,t,o,i,l,n,s,r,u){const f=J(a,(t+o)/2,(i+l)/2,(n+s)/2),d=(c,m,w)=>J(a,c,m,w);e.quad(d(t,i,s),d(o,i,s),d(o,l,s),d(t,l,s),r,u,f),e.quad(d(t,l,n),d(o,l,n),d(o,l,s),d(t,l,s),r,u,f),e.quad(d(t,i,n),d(o,i,n),d(o,i,s),d(t,i,s),r,u,f),e.quad(d(t,i,n),d(t,l,n),d(t,l,s),d(t,i,s),r,u,f),e.quad(d(o,i,n),d(o,l,n),d(o,l,s),d(o,i,s),r,u,f)}const Ct=[[1,0],[-1,0],[0,1],[0,-1]];function Le(e,a,t,o,i,l,n,s,r,u){const f=r??-(he(t)+o),d=u??he(t)+o,c=r??-(he(i)+l),m=u??he(i)+l;e.quad(J(a,f,t,o),J(a,d,t,o),J(a,m,i,l),J(a,c,i,l),n,s,[0,(t+i)/2+(l-o)*40,0])}function Ma(e,a,t){const o=Y,i=h.PLATFORM_Y,l=o.plaster.clone().multiplyScalar(.46),n=o.plaster.clone().multiplyScalar(1.05),s=o.plaster.clone().multiplyScalar(.42),r=Nt;let u=0,f=0;for(const d of Ct){const c=(E,g,p)=>J(d,E,g,p),m=[0,40,0],w=(E,g,p,b)=>e.quad(c(p??-he(E),E,0),c(b??he(E),E,0),c(b??he(g),g,0),c(p??-he(g),g,0),o.plaster,1,m);let _=i;for(let E=0;E<go;E++){const g=Ve+E*ut,p=h.WIN_W/2,b=h.WIN_H,S=xe,T=xe.clone().multiplyScalar(Zt),M=[];w(_,g),_=g+b;for(const k of[-2,-1,0,1,2]){const R=k*he(g)*.36,$=a()<$t,we=t&&$;if(d[0]===1&&Math.abs(R)<6.4&&g<Ae+h.DOOR_H+.9)continue;M.push(R);const q=g+b,ge=[0,g,0],Te=we?12:1;e.quadC(c(R-p,g,0),c(R-p,q,0),c(R-p,q,-r),c(R-p,g,-r),n,n,s,s,Te,c(R-p-1,g+b/2,-r/2)),e.quadC(c(R+p,g,0),c(R+p,q,0),c(R+p,q,-r),c(R+p,g,-r),n,n,s,s,Te,c(R+p+1,g+b/2,-r/2)),e.quadC(c(R-p,q,0),c(R+p,q,0),c(R+p,q,-r),c(R-p,q,-r),n,n,s,s,Te,c(R,q+1,-r/2)),e.quadC(c(R-p,g,0),c(R+p,g,0),c(R+p,g,-r),c(R-p,g,-r),n,n,s,s,Te,c(R,g-1,-r/2)),we?e.quadC(c(R-p,g,-r),c(R+p,g,-r),c(R+p,q,-r),c(R-p,q,-r),S,S,T,T,8,ge):e.quad(c(R-p,g,-r),c(R+p,g,-r),c(R+p,q,-r),c(R-p,q,-r),o.dark,11,ge),we&&f++;const se=wa,re=se.jamb[0],ie=se.sill[2],ce=se.sill[0];He(e,d,R-p-re,R-p,g,q,0,se.jamb[1],n,9),He(e,d,R+p,R+p+re,g,q,0,se.jamb[1],n,9),He(e,d,R-p-se.head[2],R+p+se.head[2],q,q+se.head[0],0,se.head[1],n,9),He(e,d,R-p-ie,R+p+ie,g-ce,g,0,se.sill[1],n,9),e.quad(c(R-p-ie,g-ce-.3,.012),c(R+p+ie,g-ce-.3,.012),c(R+p+ie,g-ce,.012),c(R-p-ie,g-ce,.012),l,0,ge),e.quad(c(R-p-.3,g-ce-.3,.01),c(R+p+.3,g-ce-.3,.01),c(R+p*.4,g-3.4,.01),c(R-p*.6,g-2.9,.01),l.clone().lerp(o.plaster,.55),0,ge),u++}let W;for(const k of M)w(g,g+b,W,k-p),W=k+p;w(g,g+b,W,void 0)}w(_,Z-.9)}return{n:u,lamps:f}}function ya(e){const a=Y.plaster.clone().multiplyScalar(1.06),t=a.clone().multiplyScalar(.8),o=h.DOOR_W/2+h.DOOR_JAMB+.3;let i=0;for(const l of Ct)for(let n=1;n<go;n++){const s=Ve-ft+n*ut,r=l[0]===1&&s<Ae+h.DOOR_H&&s+Oe>Ae;for(const[u,f]of r?[[void 0,-o],[o,void 0]]:[[void 0,void 0]])Le(e,l,s,Ne,s+Oe,Ne,a,9,u,f),Le(e,l,s+Oe,Ne,s+Oe+fa,0,a,9,u,f),Le(e,l,s,0,s+.001,Ne,t,9,u,f),i++}return i}function Fa(e,a,t){const o=Y,i=h.S2_FLATS/2,l=o.plaster.clone().multiplyScalar(1.05),n=o.plaster.clone().multiplyScalar(.46);let s=0,r=0;for(let u=0;u<8;u++)for(let f=0;f<3;f++){const d=u*Math.PI/4,c=Math.cos(d),m=Math.sin(d),w=Z+(f+.5)*h.S2_H/3-.3,_=a()<$t&&t,E=xe,g=xe.clone().multiplyScalar(Zt),p=(S,T,M)=>[c*(i+M)-m*S,T,m*(i+M)+c*S],b=[0,w,0];_?e.quadC(p(-.25,w,.02),p(.25,w,.02),p(.25,w+1.6,.02),p(-.25,w+1.6,.02),E,E,g,g,8,b):e.quad(p(-.25,w,.02),p(.25,w,.02),p(.25,w+1.6,.02),p(-.25,w+1.6,.02),o.dark,0,b),e.quad(p(-.45,w-.2,.14),p(.45,w-.2,.14),p(.45,w,.14),p(-.45,w,.14),l,9,b),e.quad(p(-.45,w,.14),p(.45,w,.14),p(.45,w,0),p(-.45,w,0),l,9,[0,w-30,0]),e.quad(p(-.45,w-.4,.012),p(.45,w-.4,.012),p(.3,w-2.6,.012),p(-.2,w-2.2,.012),n.clone().lerp(o.plaster,.5),0,b),s++,_&&r++}return{n:s,lamps:r}}function Pa(e){const a=new A.Color("#5a4630"),t=xt/2;for(const[o,i,l,n]of ze){const s=n-.16;e.walls(le(8,.27,0,o,l),i,le(8,.22,0,o,l),i+s,Y.block,2,[o,i-20,l]),e.cap(le(8,.22,0,o,l),i+s,Y.block,2),e.walls(le(8,.11,0,o,l),i+s,le(8,t,0,o,l),i+n+.03,a,5,[o,i+n+3,l]),e.cap(le(8,t-.03,0,o,l),i+n,Y.soot,0)}}function Na(e){const a=[],t=[],o=[],i=[];ze.forEach(([s,r,u,f],d)=>{for(const c of[.4,.4+Math.PI/2]){const m=a.length/3,w=Math.cos(c)*xt/2,_=Math.sin(c)*xt/2,E=r+f-.02;a.push(s-w,E,u-_,s+w,E,u+_,s+w,E+Et,u+_,s-w,E+Et,u-_),t.push(0,0,1,0,1,1,0,1);for(let g=0;g<4;g++)o.push(d*1.618+.37);i.push(m,m+1,m+2,m,m+2,m+3)}});const l=new A.BufferGeometry;l.setAttribute("position",new A.Float32BufferAttribute(a,3)),l.setAttribute("uv",new A.Float32BufferAttribute(t,2)),l.setAttribute("aPh",new A.Float32BufferAttribute(o,1)),l.setIndex(i);const n=new A.Mesh(l,new A.ShaderMaterial({uniforms:{uTime:e.uTime,uGain:{value:zo}},transparent:!0,depthWrite:!1,side:A.DoubleSide,vertexShader:"attribute float aPh; varying vec2 vUv; varying float vPh; void main(){ vUv = uv; vPh = aPh; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uTime, uGain; varying vec2 vUv; varying float vPh;
      float h(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y); }
      void main(){
        float v = clamp(vUv.y, 0., 1.), x = (vUv.x - .5) * 2.;
        // one tongue that leans and tears: wide at the bowl, a point at the tip
        float lean = (n(vec2(vPh * 5. + v * 2.2, uTime * 1.9 + vPh * 11.)) - .5) * 1.1 * v;
        float wd = (1. - v) * (.5 + .3 * n(vec2(vPh * 3., uTime * 1.4 - v * 3.))) + .02;
        float body = (1. - smoothstep(wd * .45, wd, abs(x + lean))) * smoothstep(0., .07, v) * smoothstep(1., .7, v);
        vec3 col = mix(vec3(1., .2, .03), vec3(1., .46, .08), smoothstep(.85, .3, v));
        col = mix(col, vec3(1., .6, .2) * 1.1, smoothstep(.38, 0., v + abs(x + lean) * .8));
        gl_FragColor = vec4(col * uGain, clamp(body, 0., 1.) * .92);
      }`}));return n.name="cresset-fires",n.renderOrder=6,n.frustumCulled=!1,n}const Ha=[0,-1];function Wa(e){const a=Re(Me("pharos-band")),t=h.PLATFORM_Y+h.BAND_UP,o=h.BAND_SHAPE_H,i=Ha,l=Y.bronze.clone().multiplyScalar(.5);He(e,i,-h.BAND_L/2-.6,h.BAND_L/2+.6,t-.4,t+.9,0,.06,Y.plaster.clone().multiplyScalar(1.07),0),He(e,i,-h.BAND_L/2-.7,h.BAND_L/2+.7,t-.52,t-.4,0,.12,Y.plaster.clone().multiplyScalar(.8),0);let n=-h.BAND_L/2,s=0;for(;n<h.BAND_L/2-.3;){const r=a.range(.24,.42),u=a.range(-.12,.12),f=a.range(.04,.16),d=a.range(0,.1),c=.1,m=J(i,n+Math.max(u,0),t,c),w=J(i,n+r,t+(u>0?0:f),c),_=J(i,n+r-Math.max(u,0)*.5,t+o-d,c),E=J(i,n+Math.max(-u,0),t+o-(u>0?f:0),c);if(e.quad(m,w,_,E,l,0,[0,t,0]),n+=r+.1,a.chance(.3)){const g=a.range(.1,.16),p=t+a.range(.05,o-g-.05);e.quad(J(i,n,p,c),J(i,n+g,p,c),J(i,n+g,p+g,c),J(i,n,p+g,c),l,0,[0,t,0]),n+=g+.1}n+=a.chance(.14)?.34:.06,s++}return s}function Ca(e){const a=h.PLATFORM_Y,t=Ve-ft,o=Y.plaster.clone().multiplyScalar(1.06),i=Y.plaster.clone().multiplyScalar(.95);for(const l of Ct){Le(e,l,a,.45,t,.3,i,10);const n=.3+Ne;Le(e,l,t-.001,.3,t,n,o.clone().multiplyScalar(.8),9),Le(e,l,t,n,t+Oe,n,o,9),Le(e,l,t+Oe,n,t+Oe+.45,0,o,9)}}function ka(e,a,t,o){const i=Y.bronze,l=5,n=Z+1.5,s=Math.cos(o),r=Math.sin(o),u=h.CORNER_FIG_H/4,f=E=>[a+(E[0]*s-E[2]*r)*u,n+E[1]*u,t+(E[0]*r+E[2]*s)*u],d=(E,g,p,b,S=7)=>oe(e,f(E),f(g),p,b,S,i,l),c=[[-1.25,1.45,.3],[-1.45,.75,.25],[-1,.26,-.3],[-.25,.3,-.5],[.4,.42,-.05],[.25,1,.15]],m=[.1,.17,.26,.33,.4,.44];for(let E=0;E<c.length-1;E++)d(c[E],c[E+1],m[E],m[E+1]);e.tri(f([-1.25,1.45,.3]),f([-1.75,1.95,.75]),f([-1.2,2.05,.4]),i,l),e.tri(f([-1.25,1.45,.3]),f([-1.6,1.9,-.25]),f([-1.2,2.05,.4]),i,l),d([.25,1,.15],[.3,2.3,.08],.44,.5,9);const w=f([.3,2.42,.08]);dt(e,w,.62,.27,.62,i,l),d([.32,2.5,.08],[.36,2.85,.08],.17,.16);const _=f([.38,3.08,.08]);dt(e,_,.29,.33,.29,i,l),d([.3,2.45,.58],[.78,2.5,.78],.16,.14),d([.78,2.5,.78],[.9,3.05,.42],.14,.12),d([.6,3.02,.2],[1.05,3.3,.36],.07,.15),d([1.05,3.3,.36],[1.5,3.68,.5],.15,.33,8),d([.3,2.45,-.45],[.56,1.72,-.62],.16,.14),d([.56,1.72,-.62],[.52,1.18,-.3],.14,.12)}function Da(e){const a=h.S1_TOP/2+Q.s1[3]-je[0]-1.05;for(const[t,o]of[[1,1],[1,-1],[-1,1],[-1,-1]])e.box(t*a-1,Z,o*a-1,t*a+1,Z+1.5,o*a+1,Y.plaster,1),e.box(t*a-1.12,Z+1.36,o*a-1.12,t*a+1.12,Z+1.5,o*a+1.12,Y.plaster,0),ka(e,t*a,o*a,Math.atan2(o,t))}const Ao={rise:13,lean:40,size0:2.6,size1:9.5,puffs:36,period:18,alpha:.2},Za=[1,.8,.5],Ga=[{rise:20,lean:20,size0:3.2,size1:13,puffs:40,period:20,alpha:.2,tone:.62,thin:1.4},{rise:19,lean:21,size0:3.4,size1:13.6,puffs:40,period:20,alpha:.18,tone:.66,thin:1.4},Ao];function Ia(e,a,t,o,i,l,n){const s=a.puffs,r=[],u=[],f=[],d=[];for(let _=0;_<s;_++){const E=(_+n())/s,g=n()*2-1,p=n(),b=r.length/3;for(const[S,T]of[[-1,-1],[1,-1],[1,1],[-1,1]])r.push(0,0,0),u.push(S,T),f.push(E,g,p);d.push(b,b+1,b+2,b,b+2,b+3)}const c=new A.BufferGeometry;c.setAttribute("position",new A.Float32BufferAttribute(r,3)),c.setAttribute("uv",new A.Float32BufferAttribute(u,2)),c.setAttribute("aD",new A.Float32BufferAttribute(f,3)),c.setIndex(d),c.boundingSphere=new A.Sphere(new A.Vector3(t[0],t[1]+a.rise*.5,t[2]+a.lean*.5),a.rise+a.lean);const m=new A.ShaderMaterial({uniforms:{...A.UniformsUtils.clone(A.UniformsLib.fog),uTime:e.uTime,uSkyCol:e.uSkyCol,uGndCol:e.uGndCol,uGlowCol:e.uGlowCol,uGlowDir:e.uGlowDir,uSunCol:e.uSunCol,uFireCol:e.uFireCol,uShape:{value:new A.Vector4(a.rise,a.lean,a.size0,a.size1)},uBase:{value:new A.Vector3(t[0],t[1],t[2])},uPeriod:{value:a.period},uRoot:{value:new A.Vector4(o,i,a.alpha,l)},uTone:{value:new A.Vector2(a.tone??1,a.thin??1.7)}},transparent:!0,depthWrite:!1,fog:!0,vertexShader:`attribute vec3 aD; uniform float uTime, uPeriod; uniform vec4 uShape, uRoot; uniform vec3 uBase, uGlowDir; varying vec2 vUv, vLd; varying vec3 vP;
      #include <fog_pars_vertex>
      void main(){ vUv = uv;
        float h = fract(aD.x + uTime / uPeriod), sl = aD.y;
        // quick at the root, slower as it spreads; it leans more and more to the south, and wanders a little as it goes
        vec3 c = uBase + vec3(uRoot.y * (sl * (1.1 + 10. * h) + 5. * h * sin(h * 7. + aD.z * 6.28)), uShape.x * pow(h, .8) + uRoot.y * sl * 3. * h, uShape.y * pow(h, 1.2) + uRoot.y * 6. * h * cos(aD.z * 6.28 + h * 3.));
        float size = mix(uShape.z, uShape.w, pow(h, .75)) * (.8 + .4 * aD.z);
        vec4 mv = viewMatrix * vec4(c, 1.); mv.xy += uv * size;
        vLd = normalize((viewMatrix * vec4(uGlowDir, 0.)).xy + vec2(1e-4, 0.)); vP = vec3(h, aD.z, sl);
        vec4 mvPosition = mv; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`uniform float uTime; uniform vec2 uTone; uniform vec3 uSkyCol, uGndCol, uGlowCol, uSunCol, uFireCol; uniform vec4 uRoot; varying vec2 vUv, vLd; varying vec3 vP;
      #include <fog_pars_fragment>
      float h(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y); }
      void main(){
        float r = length(vUv); if (r > 1.) discard;
        float hh = clamp(vP.x, 0., 1.);
        // a soft ball with no edge (it thins to nothing at its rim), eaten a little by its own curl
        vec2 q = vUv * 1.6 + vP.y * 17. + vec2(0., -uTime * .05);
        float f = .55 * n(q) + .3 * n(q * 2.3 + 4.) + .15 * n(q * 4.9 + 9.);
        float ball = smoothstep(1., 0., r + (f - .5) * .5); ball *= ball;
        // it comes on at its birth and thins to nothing at its end
        float a = ball * smoothstep(0., .05, hh) * uRoot.z * pow(max(1. - hh, 0.), uTone.y) * uRoot.w;
        // light: the sky from above, the ground and sea from below, the bright quarter on the side that faces it
        float up = clamp(vUv.y * .5 + .5, 0., 1.), tw = clamp(dot(vUv, vLd) * .5 + .5, 0., 1.);
        vec3 lit = mix(uGndCol, uSkyCol, up) * 1.3 + (uGlowCol * 1.5 + uSunCol * .8) * tw * tw;
        vec3 col = vec3(.6, .57, .56) * uTone.x * lit * (.78 + .36 * f);
        // where it is young it glows with the fire under it
        col += uTone.x * uRoot.x * uFireCol * vec3(.6, .32, .13) * smoothstep(.45, 0., hh) * (.5 + .5 * f) * (1. - .4 * up);
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}),w=new A.Mesh(c,m);return w.name="smoke",w.renderOrder=5,w.frustumCulled=!1,w}const kt=[[57.5,-9.9,4.2,3],[71,-9.9,4.2,3],[46,9.6,4,3]],xo=h.PLATFORM_Y+2.45;function Ua(e){const a=Y,t=h.PLATFORM_Y,o=a.wood,i=a.wood.clone().multiplyScalar(1.5),l=(n,s,r,u,f,d)=>{for(let c=0;c<u;c++)for(let m=0;m<f-c%2;m++){const w=.14+m*.27+c%2*.135,_=d+.13+c*.235,E=(m+c)%3===0?i:o;r?oe(e,[n,_,s+w],[n+1.5,_,s+w+.03],.13,.12,5,E,0):oe(e,[n+w,_,s],[n+w+.03,_,s+1.5],.13,.12,5,E,0)}};for(const[n,s,r,u]of jt)l(n,s,!0,r,u,t);for(const[n,s,r,u]of kt)for(const f of[-1,1])for(const d of[-1,1])oe(e,[n+f*r/2,Bt(n,s),s+d*u/2],[n+f*r/2,xo+.05,s+d*u/2],.05,.04,5,o,0)}function za(e){const a=[],t=[],o=[],i=[],l=[],n=["#c9bda2","#a6593f","#b89a5e","#d6ccb4","#8c6a4c"].map(f=>new A.Color(f));kt.forEach(([f,d,c,m],w)=>{const g=a.length/3,p=n[w%3];for(let b=0;b<=5;b++)for(let S=0;S<=6;S++){const T=S/6,M=b/5;a.push(f+(T-.5)*c,xo,d+(M-.5)*m),t.push(0,1,0),o.push(p.r,p.g,p.b),i.push(Math.max(4*T*(1-T),4*M*(1-M)),0)}for(let b=0;b<5;b++)for(let S=0;S<6;S++){const T=g+b*7+S;l.push(T,T+1,T+6+1,T+1,T+6+2,T+6+1)}});const s=new A.BufferGeometry;s.setAttribute("position",new A.Float32BufferAttribute(a,3)),s.setAttribute("normal",new A.Float32BufferAttribute(t,3)),s.setAttribute("aC",new A.Float32BufferAttribute(o,3)),s.setAttribute("aF",new A.Float32BufferAttribute(i,2)),s.setIndex(l);const r=new A.ShaderMaterial({uniforms:{...A.UniformsUtils.clone(A.UniformsLib.fog),...e},fog:!0,side:A.DoubleSide,vertexShader:`attribute vec3 aC; attribute vec2 aF; uniform float uTime; varying vec3 vW, vN, vC;
      #include <fog_pars_vertex>
      void main(){ vec3 p = position; float f = aF.x, w = sin(uTime * 2.1 + p.x * 2.3 + p.z * 1.1), w2 = sin(uTime * 3.3 + p.x * 1.1 - p.z * 2.7);
        p.y += -.22 * f + f * (.06 * w + .035 * w2);
        vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vN = normal; vC = aC * (1. - .12 * f * w);
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`varying vec3 vW, vN, vC;
      ${wo}
      #include <fog_pars_fragment>
      void main(){ vec3 n = normalize(vN + vec3(0., 1e-6, 0.)); gl_FragColor = vec4(phLight(vC, n, vW, 1.) * .7 + phLight(vC, -n, vW, 1.) * .45, 1.);
        #include <fog_fragment>
      }`}),u=new A.Mesh(s,r);return u.name="cloth",u.frustumCulled=!1,u}async function Ba(e,a={}){const t=ca(a.light);t.uTime={value:0},t.uFireGain={value:a.fireGain??Uo[1]},t.uGlowGain={value:a.hour!=null?Io[a.hour]:t.uFireGain.value};const o=new A.Group;o.name="pharos";const i=Aa(t),l=_o();xa(l,e.noise),await e.yield();const n=await Ea(l,e.yield);await e.yield(),Ua(l),await e.yield();const s=new A.Mesh(await l.geometryInSteps(e.yield),i);s.name="rock-tongue-ramp",o.add(s),await e.yield();const r=_o();Sa(r),await e.yield(),Oa(r),La(r),await e.yield();const u=Re(Me("pharos-window-lamps:"+e.seed)),f=Ma(r,u,!!a.lamps),d=f.n;await e.yield();const c=ya(r),m=Fa(r,u,!!a.lamps);Pa(r),await e.yield();const w=Wa(r);await e.yield(),Ca(r),await e.yield(),Da(r),await e.yield();const _=new A.Mesh(await r.geometryInSteps(e.yield),i);_.name="tower",o.add(_),await e.yield();const E=Ra(t),g=Ia(t,a.hour!=null?Ga[a.hour]:Ao,[0,B+2.4,0],1,.55,a.smokeOpacity??1,Re(Me("pharos-smoke:"+e.seed)));o.add(g,E.flame,E.glow,za(t)),ze.forEach(([b,S,T,M],W)=>t.uCresset.value[W].set(b,S+M+Xo,T)),t.uCressetGain.value=a.lamps?qo:0,a.lamps&&o.add(Na(t));const p=(a.light.fireCol||new A.Color(1,.5,.2)).clone();return{object:o,radius:110,height:qt-0,center:new A.Vector3(0,55,0),uniforms:t,material:i,ramp:n,windows:d,windowLamps:f.lamps+m.lamps,slits:m.n,belts:c,bandShapes:w,anchors:{door:new A.Vector3(15.5,Qe,0),fire:new A.Vector3(0,B+1.9,0),head:new A.Vector3(0,qt,0)},update(b,S){t.uTime.value=S;const T=1+.025*Math.sin(S*.9)+.015*Math.sin(S*2.3+1.1);t.uFireCol.value.copy(p).multiplyScalar(T)},ground:!1}}export{St as ANCHOR_SWING,Ot as APRON_EYE,kt as AWNINGS,xo as AWNING_Y,Ha as BAND_FACE,rt as BEAR_AWAY,da as BELT2,be as BELT3,Oe as BELT_H,Ne as BELT_OUT,ft as BELT_UNDER,fa as BELT_WEATHER,qe as BERTH_DRAW,vo as BIGHT_NORTH,ae as BODY,Ge as BODY_GAP,at as BOLLARD_H,Ue as BOLLARD_IN,Ie as BOLLARD_R,xt as BOWL_W,Y as COL,Q as CORNICE,ze as CRESSETS,Xo as CRESSET_FLAME_UP,wt as DOOR_FACE_X,Xt as DOOR_OPEN_H,Ae as DOOR_Y0,Qe as DOOR_YC,Ho as DOWN_LANE,Se as ENTRY_X,nt as ENTRY_Z,Ft as FISHER_RING,Ta as FLAME_H,io as FLOCK_SIGMA,ye as GAP_X0,Po as GAP_X1,sa as GUARD_DRAW,na as GUARD_EAST,aa as GUARD_LEG,_e as GUARD_R,ht as GUARD_SOUTH,lo as GULL_REACH,ea as GULL_SIZE,Jo as GULL_SPAN_MOST,co as GULL_WANDER,pe as HAND,Uo as HEARTH_GAIN,Io as HEARTH_GLOW,Ro as HOURS,ma as KEEPER_WALK,so as KIT_GULL_HALF,ro as KIT_GULL_LARGEST,_t as LANE_PASS,pa as LEDGE_REACH,va as LEDGE_SHADE,st as LEVEL_RUN,wo as LIT_PARS,oo as LOCHIAS_TIP,ta as LOW_FLOCK,h as M,X as MOUTH_MID,ra as NET_GROUND,Pt as N_CRESSETS,Xe as OUR_LENGTH,ot as PACK_SLOPE,je as PARAPET_IN,jo as PERSON_H,Kt as PLATFORM_HALF,bt as PLATFORM_PARAPET,$o as RAMP_EYE,No as RAMP_IN,Ee as REACH,fo as REEF_BANDS,po as ROADSTEAD,Yo as ROADSTEAD_SCALE,ao as ROAD_ROOM,te as ROUTE,Lo as ROUTE_DECK_Y,Jt as RUN_CLEAR,Vo as RUN_WATER,Ye as RUN_X0,Vt as SHELF_LANES,qo as SMALL_FIRE_LIGHT,zo as SMALL_FLAME_GAIN,Et as SMALL_FLAME_H,Ao as SMOKE,Ga as SMOKE_BY_HOUR,Za as SMOKE_OPACITY,jt as STACKS,ko as STAIR_LANES,tt as STAIR_STEPS,Je as STAIR_X_FOOT,et as STAIR_X_HEAD,De as STAIR_Z0,mt as STAIR_Z1,Mo as SUN_ELEVATION,yo as SWELLS,To as SWELL_HEIGHT_MAX,j as TONGUE_TIP,Fe as TURN_R,gt as UP_LANE,At as WALKER_PASS,Wo as WALK_FOOT_X,Co as WALK_HEAD_X,Yt as WALK_TURN,Ko as WAY_BEAR,uo as WAY_END,ve as WAY_X,Rt as WHEEL,Nt as WINDOW_DEEP,ga as WINDOW_FAR,wa as WINDOW_FRAME,xe as WINDOW_LAMP,$t as WINDOW_LIT_SHARE,Zt as WINDOW_ROOM_TOP,go as WINDOW_ROWS,ut as WINDOW_ROW_STEP,Ve as WINDOW_ROW_Y0,_a as WINDOW_WALL_SHARE,Z as Y1,fe as Y2,B as Y3,qt as Y_HEAD,ke as Y_PIER,Ba as buildHero,Bo as dealVisit,ho as flockReach,Bt as footingY,Va as layPlace,ja as layPlaceInSteps,oe as limb,dt as lump,_o as makeBuilder,Na as makeCressetFlames,ca as makeLightUniforms,Aa as makeLitMaterial,Xa as makeRoute,Ia as makeSmoke,de as rampY,Ya as routeMarks,Zo as routePoints,$a as seaOptions,ha as shipAt,Do as stackBox,Go as stairY,Ke as wayBearZ};
