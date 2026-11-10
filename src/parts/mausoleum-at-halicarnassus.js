import*as K from"three";import{clamp as Xe,lerp as q,smoothstep as Re,makeRng as pe,makeNoise as Zo,hashSeed as ue,makePath as zo}from"../kit/core.js";const e={T:20,POD_H:19.2,ORDER_H:12,ROOF_H:7.2,TOP_H:6.4,FOOT_HX:19.2,FOOT_HZ:16.25,SHELF1_Y:2.4,SHELF1_D:1.6,BLUE_COURSE:1.2,BLUE1_H:3.6,SHELF2_Y:10.8,SHELF2_D:1.4,BLUE2_H:2.4,FRIEZE_Y0:17.9,FRIEZE_Y1:18.8,DOOR_W:2.4,DOOR_H:4.2,COL_N_LONG:11,COL_N_SHORT:9,COL_STEP:3,COL_D:1,COL_H:9.6,PLINTH_H:.35,ENTAB_H:2.4,CELLA_BACK:3.2,ROOF_FOOT_HX:16.45,ROOF_FOOT_HZ:13.1,ROOF_TOP_HX:3.65,ROOF_TOP_HZ:2.75,ROOF_STEPS:24,ROOF_STEP_H:.3,ROOF_MARGIN:.56,SPOUT_STEP:1.07,LION_L:1.55,LION_H:1.4,LIONS_LONG:10,LIONS_SHORT:8,RIDER_H:2.6,PED_HX:3.5,PED_HZ:2.6,PED_H:2.8,GROUP_L:6.5,GROUP_W:4.5,GROUP_H:3.6,WHEEL_D:2.31,LOWER_FIG:[2.7,3],UPPER_FIG:1.8,GAP_FIG:[2.7,3],TER_X0:-202,TER_X1:40,TER_Z0:-30,TER_Z1:75.5,TER_WALL_TOP:22.56,KERB_UP:.16,SOUTH_OUT_Y:13,CYPRESS_Z:69.5,CYPRESS_X0:-190,CYPRESS_X1:20,CYPRESS_GAP:9,CYPRESS_H:[5,7],GATE_Z:58,GATE_HALF:6.5,WING_W:6,WING_X0:34,WING_X1:46,WING_H:9,STAIR_X_FOOT:72,STAIR_X_HEAD:46,STAIR_HALF:6.5,SQUARE_Y:11,SQUARE_X0:60,SQUARE_X1:125,SQUARE_Z0:28,SQUARE_Z1:90,STREET_Z0:-45,STREET_Z1:-30,STREET_Y:20.5,QUAY_Z:215,QUAY_Y:1.6,MARKET_X0:55,MARKET_X1:170,MARKET_Z0:140,MARKET_Z1:215,MARKET_Y0:4.5,MARKET_Y1:2,CLIMB_X:110,CLIMB_W:9,TEMPLE_AT:[-40,44,-150],THEATRE_AT:[130,40,-170],PALACE_AT:[520,25,420],SALMAKIS_AT:[-330,6,430],WARSHIP_L:35,WARSHIP_LANE_X:75,LAT:37,SUN_EL:[40,30,20]},Yo=(t,o=e.LAT)=>{const a=Math.PI/180,s=Math.min(1,Math.sin(t*a)/Math.cos(o*a)),n=Math.acos(s);return 180+Math.atan2(Math.sin(n),Math.sin(o*a)*s)/a};e.SUN_AZ=e.SUN_EL.map(t=>Yo(t));const Qt=60,_e={worn:1.05,dull:.84,edge:2.2,mid:4.6,riserFoot:.94,riserHead:.52},Me={y0:e.T+e.WING_H-1.9,yb:e.T+e.WING_H-1.1,y1:e.T+e.WING_H-.28,beamW:.7,beams:6,coffer:1.3,rib:.25,ribH:.3},Kt=[e.WING_X0-3.2,e.GATE_Z+4.6],je=(()=>{const t=[e.WING_X0,e.GATE_Z],o=[e.FOOT_HX,e.FOOT_HZ],a=5,s=Math.hypot(o[0]-t[0],o[1]-t[1]);return{a:t,b:[o[0]+(t[0]-o[0])*a/s,o[1]+(t[1]-o[1])*a/s],w:2.4,up:.02,short:a}})(),Qa={w:e.GATE_HALF-.25,h:6.2,t:.15},Ka=[e.STAIR_X_FOOT+4,e.GATE_Z+18],lt=[e.STAIR_X_FOOT+16,e.GATE_Z+24],Ue=2.4,Xo=6,qt=2,Vt=.634,jt=20,qa={gulls:{len:.6,span:2*.72+.03,true:"a yellow-legged gull: 0.52 to 0.68 m long, 1.2 to 1.55 m across"},crows:{len:.5,span:2*.5+.085,true:"a rock dove: 0.29 to 0.37 m long, 0.62 to 0.72 m across"},swifts:{len:.24,span:2*.33,true:"a common swift: 0.16 to 0.17 m long, 0.42 to 0.48 m across"}},Oe=e.T+e.POD_H,Se=Oe+e.ORDER_H,Ae=Se+e.ROOF_H,Va=Ae+e.TOP_H,we=Ae+e.PED_H,re=[e.FOOT_HX-e.SHELF1_D,e.FOOT_HZ-e.SHELF1_D],te=[re[0]-e.SHELF2_D,re[1]-e.SHELF2_D],be=(e.COL_N_LONG-1)*e.COL_STEP/2,ve=(e.COL_N_SHORT-1)*e.COL_STEP/2,Je=be-e.CELLA_BACK,et=ve-e.CELLA_BACK,vt={arch:.95,dentil:.35,leaf:.2,cornice:.45,sima:.45},Ee=(()=>{const t=e.ROOF_FOOT_HX-e.ROOF_MARGIN/2,o=e.ROOF_FOOT_HZ-e.ROOF_MARGIN/2,a=1.2,s=1.6;return{x:t,z:o,FIRST:a,END:s,gapLong:(t-s)/(e.LIONS_LONG/2),gapShort:(o-s)/(e.LIONS_SHORT/2),scale:e.LION_H/1.08}})(),ja=e.SUN_EL.map((t,o)=>["mid afternoon","afternoon","late afternoon"][o]+" (sun "+t+" degrees up)"),He=[e.CLIMB_X,3,e.QUAY_Z+170],tt=10.5,Pe=[0,63.8,tt],ht=[23.8,70.7,tt],xt=(ht[1]-Pe[1])/(ht[0]-Pe[0]),Uo=t=>Pe[1]+xt*(t-Pe[0]),ke={cx:75,cz:e.GATE_Z+35,r:35},ot=23.5,Fe={x0:-e.FOOT_HX-1,ease:16},Ge=(()=>{const a=e.GATE_Z-tt,s=Math.acos(Xe((a-24+48)/72,-1,1)),n=(Pe[1]-ot)/xt+Fe.ease/2,r=48*s+24*(Math.PI+s),i=72*Math.sin(s),m=(Fe.x0+r+i-n)/2,p=m-i;return{r:24,bear:48,th:s,xs:m,xe:p,px:m-48*Math.sin(s),pz:e.GATE_Z+48*(1-Math.cos(s)),cx:p,cz:tt+24,turnLen:r}})(),gt=t=>ot+xt*(t<=0?0:t<Fe.ease?t*t/(2*Fe.ease):t-Fe.ease/2);function ko(){const t=[],o=(p,d,f,w,H,I,P)=>{const W=Math.hypot(f-p,w-d),R=Math.max(1,Math.round(W/H));for(let _=0;_<R;_++){const b=_/R;t.push([q(p,f,b),q(d,w,b),typeof I=="function"?I(b*W):q(I,P,b)])}},a=(p,d,f,w,H,I,P)=>{const W=Math.abs(H-w)*f,R=Math.max(2,Math.round(W/I));for(let _=0;_<R;_++){const b=_/R,E=q(w,H,b);t.push([p+f*Math.cos(E),d+f*Math.sin(E),P(b*W)])}},s=e.CLIMB_X,n=e.GATE_Z,r=Ge;o(s,He[2],s,He[2]-60,15,3,3),o(s,He[2]-60,s,260,13,3,4),o(s,260,s,e.QUAY_Z,11,4,6.5),o(s,e.QUAY_Z,s,e.MARKET_Z0,12.5,6.5,12),o(s,e.MARKET_Z0,s,ke.cz,12,12,15.5),a(ke.cx,ke.cz,ke.r,0,-Math.PI/2,5,()=>15.5),o(ke.cx,n,e.STAIR_X_HEAD,n,7,15.5,23.2),o(e.STAIR_X_HEAD,n,e.FOOT_HX,n,7,23.2,ot),o(e.FOOT_HX,n,Fe.x0,n,8,ot,ot);const i=Fe.x0-r.xs,m=i+r.bear*r.th;o(Fe.x0,n,r.xs,n,4,p=>gt(p)),a(r.xs,n+r.bear,r.bear,-Math.PI/2,-Math.PI/2-r.th,3,p=>gt(i+p)),a(r.cx,r.cz,r.r,Math.PI/2-r.th,Math.PI*1.5,4,p=>gt(m+p));for(let d=0;d<=10;d++){const f=q(r.xe,ht[0],d/10);t.push([f,tt,Uo(f)])}return t.map(p=>[p[0],p[2],p[1]])}function Ja(){return zo(ko(),{samples:720})}const Jt=22;function es(t){const o=t.length,a=[];for(let h=0;h<=o;h+=.5){const L=t.posAtDist(h);a.push([L.x,L.y,L.z])}const s=t.posAtDist(o),n=[s.x,s.y,s.z],r=(h,L=0)=>{for(let M=L;M<=o;M+=.5){const C=Number.isInteger(M*2)?a[M*2]:n;if(h(C))return M}return o},i=r(h=>h[2]<He[2]-60),m=r(h=>h[2]<e.MARKET_Z0),p=r(h=>h[2]<e.SQUARE_Z1),d=r(h=>h[0]<e.STAIR_X_FOOT,p),f=r(h=>h[0]<e.STAIR_X_HEAD,d),w=(()=>{for(let h=p;h<d;h+=.5){const L=a[h*2],M=a[h*2+1];if((M[0]-L[0])*(lt[0]-L[0])+(M[2]-L[2])*(lt[1]-L[2])<=0)return h}return d})(),H=e.GATE_HALF/(e.GATE_Z-e.FOOT_HZ),I=(e.WING_X0-H*e.FOOT_HX)/(1-H),P=r(h=>h[0]<I,f),W=r(h=>h[0]<e.FOOT_HX,f),R=r(h=>h[0]<0,W),_=r(h=>h[0]<-e.FOOT_HX,W),b=r(h=>h[0]<Ge.xs,_),E=r(h=>h[2]<Ge.cz,b),F=r(h=>h[0]>Ge.xe,E),v=r(h=>h[0]>-e.FOOT_HX,F),O={square:Jt*Math.PI/180*ke.r,stair:9.5,south:7.3,turn:Jt*Math.PI/180*Ge.r,line:8.2},x=(h,L)=>L+(O.square-L)*Re(m,p,h)+(O.stair-O.square)*Re(p,d,h)+(O.south-O.stair)*Re(f,W,h)+(O.turn-O.south)*Re(_,b,h)+(O.line-O.turn)*Re(F,v,h),l=50,c=h=>{let L=0;for(let M=.25;M<o;M+=.5)L+=.5/x(M,h);return L};let A=O.square,S=60;for(let h=0;h<30;h++){const L=(A+S)/2;c(L)>l?A=L:S=L}return O.bay=(A+S)/2,{L:o,pts:a,DURATION:l,SPEED:O,speedAt:x,pace:h=>x(h*o,O.bay)/(o/l),xSight:I,mStraight:i,mMarketN:m,mSquare:p,mFount:w,mStairFoot:d,mStairHead:f,mSight:P,mEastLine:W,mMid:R,mWestLine:_,mBear:b,mTurnW:E,mLine:F,mWestFace:v}}function Go(t,o={}){const a=pe(ue("mausoleum-visit:"+t));let s=a.int(0,2);const n=a(),r=a.int(0,3);return o.hour==="day"?s=0:o.hour==="golden"?s=1:o.hour==="night"&&(s=2),{hour:s,haze:n,awning:r,rare:!!o.rare,density:Xe(o.density??1,.7,1.3),sunElevation:e.SUN_EL[s],sunAzimuth:e.SUN_AZ[s]}}const at=95,eo=505,$o=t=>175+160*Re(e.QUAY_Z,330,t),Bo=t=>eo+26*Math.sin(t*.011+1.3)+(Math.abs(t-at)>520?0:-18*(1-Re(330,520,Math.abs(t-at)))),to=(t,o,a,s)=>{const n=e.QUAY_Z-t,r=a-s,i=o-t,m=n>0&&r>0?Math.hypot(n,r):Math.max(n,r);return Math.min(i,m)},oo=t=>Bo(t),ao=t=>Math.abs(t-at),so=t=>$o(Math.max(t,e.QUAY_Z));function st(t,o){return to(o,oo(t),ao(t),so(o))}const Ot=260,ts=(t,o)=>st(t,o)>Ot,no=[e.GATE_Z-e.GATE_HALF,e.GATE_Z+e.GATE_HALF],ct=[[0,1.6],[15,2],[75,4.5],[125,11],[140,13],[245,20],[260,21]],ro=.22,Qo=Zo(ue("mausoleum-ground"));function Ko(t){const o=(f,w)=>125+35*t.n2(Math.atan2(w-80,f-40)*1.4,.5),a=(f,w,H)=>{if(H<=0)return Math.max(-9,H*.25-.6);let I;if(H<=Ot){let P=0;for(;P<ct.length-2&&H>ct[P+1][0];)P++;const W=ct[P],R=ct[P+1];I=q(W[1],R[1],(H-W[0])/(R[0]-W[0]))}else{const P=21+(H-Ot)*ro,W=o(f,w),R=P-W;I=R<0?P:Math.max(38,W-R*.7),I+=Re(290,520,H)*9*t.fbm2(f*.006,w*.006,3)}return 31-Math.max(Math.abs(f-e.PALACE_AT[0]),Math.abs(w-e.PALACE_AT[2]))*.16>I&&(I=Math.max(I,Math.min(e.PALACE_AT[1],31-Math.hypot(f-e.PALACE_AT[0],w-e.PALACE_AT[2])*.16))),f<-200&&w>330&&(I=Math.min(I,2+5*Re(0,40,H))),I},s=(f,w)=>a(f,w,st(f,w)),n=(f,w,H,I,P,W)=>f>=H&&f<=P&&w>=I&&w<=W,i=(f,w)=>n(f,w,e.TER_X0,e.TER_Z0,e.TER_X1,e.TER_Z1)||n(f,w,e.TER_X1,no[0],e.STAIR_X_HEAD,no[1])?e.T:n(f,w,e.STAIR_X_HEAD,e.GATE_Z-e.STAIR_HALF,e.STAIR_X_FOOT,e.GATE_Z+e.STAIR_HALF)?e.T-(f-e.STAIR_X_HEAD)/(e.STAIR_X_FOOT-e.STAIR_X_HEAD)*(e.T-e.SQUARE_Y):n(f,w,e.TER_X1,e.SQUARE_Z0,e.SQUARE_X1,e.SQUARE_Z1)?e.SQUARE_Y:n(f,w,-430,e.STREET_Z0,250,e.STREET_Z1)?e.STREET_Y:n(f,w,e.TEMPLE_AT[0]-34,e.TEMPLE_AT[2]-24,e.TEMPLE_AT[0]+34,e.TEMPLE_AT[2]+24)?e.TEMPLE_AT[1]:-1e9;return{groundY:(f,w)=>{const H=i(f,w);if(H!==-1e9)return H;const I=st(f,w);return I>0&&I<13&&w<232&&Math.abs(f-at)<172?e.QUAY_Y:a(f,w,I)},natural:s,crestAt:o,cols:f=>{const w=f.length,H=new Float64Array(w),I=new Float64Array(w);for(let P=0;P<w;P++)H[P]=oo(f[P]),I[P]=ao(f[P]);return{xs:f,n:w,coast:H,off:I}},row:(f,w,H,I=0,P=1)=>{const W=so(w),R=f.xs,_=f.coast,b=f.off;for(let E=0,F=I;E<f.n;E++,F+=P){const v=R[E],O=i(v,w);if(O!==-1e9){H[F]=O;continue}const x=to(w,_[E],b[E],W);H[F]=x>0&&x<13&&w<232&&b[E]<172?e.QUAY_Y:a(v,w,x)}}}}const nt=Ko(Qo),$e=nt.groundY,os=nt.natural,as=nt.cols,ss=nt.row,ns=(t,o)=>260+(nt.crestAt(t,o)-21)/ro,ce=(t,o=1)=>new K.Color(t).multiplyScalar(o),qo=.72,y={marble:ce("#efe7d8"),marbleB:ce("#e6ded0"),blue:ce("#3b4a5e"),paintBlue:ce("#2f7f9a"),red:ce("#b8432f"),tawny:ce("#9c7850"),bronze:ce("#8a6a3a",.55),plaster:ce("#c4b393"),tile:ce("#ad6c54"),cypress:ce("#233b29"),gravel:ce("#d8d2c4"),purple:ce("#6a3a6a"),hair:ce("#5a3c26")},Ne={d:6.5,hgt:4.6},Vo=[{a:[e.MARKET_X0+.5,e.MARKET_Z1-8],b:[e.MARKET_X0+.5,e.MARKET_Z0+2],n:[1,0],at:[e.MARKET_X0+4,175],open:!1},{a:[e.MARKET_X1-.5,e.MARKET_Z0+2],b:[e.MARKET_X1-.5,e.MARKET_Z1-8],n:[-1,0],at:[e.MARKET_X1-4,175],open:!0},{a:[e.MARKET_X0+9,e.MARKET_Z0+.5],b:[e.CLIMB_X-12,e.MARKET_Z0+.5],n:[0,1],at:[80,e.MARKET_Z0+4],open:!0},{a:[e.CLIMB_X+12,e.MARKET_Z0+.5],b:[e.MARKET_X1-9,e.MARKET_Z0+.5],n:[0,1],at:[140,e.MARKET_Z0+4],open:!0}],io=Vo.filter(t=>t.open).map(t=>{const o=$e(t.at[0],t.at[1]),a=t.n[0]*(Ne.d+.4),s=t.n[1]*(Ne.d+.4),n=-t.n[0]*.2,r=-t.n[1]*.2,i=[t.a[0]+n,t.b[0]+n,t.a[0]+a,t.b[0]+a],m=[t.a[1]+r,t.b[1]+r,t.a[1]+s,t.b[1]+s];return{lo:[Math.min(...i)-(t.n[0]?0:.3),o+Ne.hgt-.45,Math.min(...m)-(t.n[1]?0:.3)],hi:[Math.max(...i)+(t.n[0]?0:.3),o+Ne.hgt+1.35,Math.max(...m)+(t.n[1]?0:.3)]}}),rs=[[e.CLIMB_X-17,e.MARKET_Z0+11.5],[e.CLIMB_X+17,e.MARKET_Z0+11.5]],ft={x0:e.CLIMB_X-24.5,x1:e.CLIMB_X-19.5,z:e.MARKET_Z0+11},oe={GOODS:[e.CLIMB_X-12,e.CLIMB_X+12],STALLS:[e.CLIMB_X-36,e.CLIMB_X-24,e.CLIMB_X+24,e.CLIMB_X+36],AISLE:[e.CLIMB_X-30,e.CLIMB_X+30],Z0:158,N:6,STEP:8.4},lo=()=>Array.from({length:oe.N},(t,o)=>oe.Z0+o*oe.STEP),dt=[[e.CLIMB_X-13,e.QUAY_Z-9.5],[e.CLIMB_X+13,e.QUAY_Z-9.5]],is=[[e.CLIMB_X-19,e.QUAY_Z-6.5,1.2],[e.CLIMB_X+19,e.QUAY_Z-7,-.5],[e.CLIMB_X+23,e.MARKET_Z0+10.5,2.4]],X={EDGE:4.4,MID:18,OUTER:43.2,Z0:156.4,STEP:4.2,N:12,KEPT:.84,OX_LOTS:[[-1,0],[1,11]],HEM:1.55,CART:[4.1,1.6],BACK:.3,CLEAR:.1,STREW:[.8,2.8,2.2]},ho=t=>{let o=X.Z0,a=e.QUAY_Z-1;for(let s=0;s<40;s++){const n=(o+a)/2;$e(t,n)===e.QUAY_Y?a=n:o=n}return o},co=()=>{const t=X.STREW[1]+X.STREW[2]/2,o=s=>X.Z0+Math.min(X.N-1,Math.floor((s-X.CLEAR-X.HEM-X.Z0)/X.STEP))*X.STEP,a=(s,n)=>Math.min(...[-1,1].map(r=>{const i=ho(e.CLIMB_X+r*s);return Math.min(n(i)+X.HEM,i-X.CLEAR-t)}));return[a(X.EDGE,o),a(X.MID,()=>oe.Z0+(oe.N-1.5)*oe.STEP),a(X.OUTER,()=>oe.Z0+(oe.N-1)*oe.STEP)]};function ls(){const t=[],o=(a,s,n,r,i)=>{const m=e.CLIMB_X+s*n,p={x0:m,z0:r},d=w=>de(p,900+w),f=a==="edge"&&X.OX_LOTS.some(w=>w[0]===s&&w[1]===i);if(!(!f&&d(0)>=X.KEPT)){if(a==="edge"){const w=ho(m),H=I=>Math.min(X.Z0+I*X.STEP,w-X.BACK-X.CART[1]);if(f)r=H(i);else if(r+X.HEM>w-X.CLEAR||X.OX_LOTS.some(I=>I[0]===s&&r+X.HEM>H(I[1])-X.CART[0]-X.CLEAR&&r-X.HEM<H(I[1])+X.CART[1]+X.CLEAR))return}t.push({file:a,side:s,x:m,z:r+(a==="edge"?0:(d(1)-.5)*1.2),turn:a==="edge"||d(2)<.4,cloth:d(3),goods:d(4),ph:d(5)*6,hs:d,ox:f})}};for(const a of[-1,1]){for(let s=0;s<X.N;s++)o("edge",a,X.EDGE,X.Z0+s*X.STEP,s);for(let s=0;s<oe.N-1;s++)o("mid",a,X.MID,oe.Z0+(s+.5)*oe.STEP,s);for(let s=0;s<oe.N;s++)o("outer",a,X.OUTER,oe.Z0+s*oe.STEP,s)}return t}const mt={a:[e.TER_X1+3,e.SQUARE_Z0+.5],b:[e.SQUARE_X0+4,e.SQUARE_Z0+.5],n:[0,1]},hs=(()=>{const t=[];for(let o=e.SQUARE_X0+15.5;o<=e.SQUARE_X1-15.5+.01;o+=11)t.push([o,e.SQUARE_Z0+.3]);return t})(),fo={lo:[mt.a[0]-.3,e.SQUARE_Y+Ne.hgt-.45,mt.a[1]-.2],hi:[mt.b[0]+.3,e.SQUARE_Y+Ne.hgt+1.35,mt.a[1]+Ne.d+.4]},fe={BEAM:[[1,.862,.52],[1,.584,.212],[1,.502,.146]],SKY:[.066,.114,.222],SKY_SIDE:.9,BOUNCE:.04,PASS:[.55,.55,.55,.2],GROUND_ALB:[.5,.45,.36],GLOW:.05,GLOW_COL:[1,.85,.6],WHITE:[1.815,1.548,1.424]},mo=t=>.2126*t[0]+.7152*t[1]+.0722*t[2];function jo(t){const o=e.SUN_EL[t]*Math.PI/180,a=e.SUN_AZ[t]*Math.PI/180,s=new K.Vector3(Math.sin(a)*Math.cos(o),Math.sin(o),-Math.cos(a)*Math.cos(o)),n=fe.BEAM[t],r=n.map((_,b)=>_*Math.sin(o)*fe.GROUND_ALB[b]*fe.BOUNCE),i=fe.GLOW_COL.map(_=>_*fe.GLOW),m=new K.Vector3(s.x,.22,s.z).normalize(),p=Math.max(0,-s.x),d=-m.x*.5+.5,f=[y.marble.r,y.marble.g,y.marble.b],w=f.map((_,b)=>_*(n[b]*p+r[b]*.5+i[b]*d*d*d)),H=f.map((_,b)=>_*fe.SKY[b]*fe.SKY_SIDE),I=(fe.WHITE[t]-mo(H))/mo(w),P=_=>new K.Color(_[0]*I,_[1]*I,_[2]*I),W=fe.SKY.map(_=>_/I),R=_=>new K.Color(_[0],_[1],_[2]);return{hour:t,sunDir:s,sunCol:P(n),skyCol:R(fe.SKY),gndCol:P(r),glowDir:m,glowCol:P(i),exposure:I,beam:R(n),sky:R(W),ground:R(r)}}const T=t=>Number(t).toFixed(3),Jo=.012,uo={sunMore:2.4,pow:5},ea=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uGlowDir, uGlowCol, uAirAway, uAirSun;
uniform sampler2D tShade; uniform vec4 uShadeRect, uSwiftStart, uAir; uniform float uTime;
float mH(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float mN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mH(i), mH(i + vec2(1., 0.)), f.x), mix(mH(i + vec2(0., 1.)), mH(i + vec2(1., 1.)), f.x), f.y); }
float mFbm(vec2 p){ return .5 * mN(p) + .25 * mN(p * 2.03 + 17.1) + .125 * mN(p * 4.1 + 31.7) + .0625 * mN(p * 8.3 + 5.3); }
// a ray from p toward the sun against a box: 1 where it is stopped. The first tmin metres of the ray do not count, so
// a moulding or an inset wall that lies inside the box it belongs to does not shade itself
float mBox(vec3 p, vec3 L, vec3 lo, vec3 hi, float tmin){
  vec3 inv = 1. / (L + vec3(1e-5)); vec3 t0 = (lo - p) * inv, t1 = (hi - p) * inv;
  vec3 a = min(t0, t1), b = max(t0, t1);
  float tin = max(max(a.x, a.y), max(a.z, tmin)), tout = min(min(b.x, b.y), b.z);
  return tout > tin ? 1. : 0.;
}
// one face of a solid with level or sloping faces: f0 the point's own side of it (under 0 inside), df how that grows along the ray
void mFace(float f0, float df, inout float t0, inout float t1){
  if (df > 1e-6) t1 = min(t1, -f0 / df); else if (df < -1e-6) t0 = max(t0, -f0 / df); else if (f0 > 0.) t1 = -1.;
}
// the stepped roof as one sloping mass (through the inner corners of its steps): 1 where the ray to the sun enters it
float mRoofMass(vec3 p, vec3 L){
  float t0 = .35, t1 = 1e4, yy = p.y - Y_ORDER;
  mFace( p.x + PYR_SX * yy - PYR_HX,  L.x + PYR_SX * L.y, t0, t1); mFace(-p.x + PYR_SX * yy - PYR_HX, -L.x + PYR_SX * L.y, t0, t1);
  mFace( p.z + PYR_SZ * yy - PYR_HZ,  L.z + PYR_SZ * L.y, t0, t1); mFace(-p.z + PYR_SZ * yy - PYR_HZ, -L.z + PYR_SZ * L.y, t0, t1);
  mFace(p.y - Y_ROOF, L.y, t0, t1);
  return t1 > t0 ? 1. : 0.;
}
// one lion of a file as a rounded mass (its length along the file, its height, its breadth): how far the ray to the
// sun passes from its middle, in the mass's own measure (under 1: through it). c: its middle; r: its half sizes
float mLion(vec3 p, vec3 L, vec3 c, vec3 r){
  vec3 o = (p - c) / r, d = L / r; float dd = dot(d, d), t = -dot(o, d) / dd;
  return t > .02 ? length(o + d * t) : 9.;
}
// the tomb's own law (its measures are written into the source by the part file)
float mTombSun(vec3 p){
  vec3 L = uSunDir;
  float s = mBox(p, L, vec3(-ROOF_HX, Y_ARCH, -ROOF_HZ), vec3(ROOF_HX, Y_ORDER, ROOF_HZ), 1.25);
  s = max(s, mBox(p, L, vec3(-CELLA_HX, Y_POD, -CELLA_HZ), vec3(CELLA_HX, Y_ORDER, CELLA_HZ), 1.25));
  // the cornice and the gutter stand out over the architrave, the dentils and the capitals: their shadow down the entablature
  if (p.y < Y_ORDER - CORNICE_H - .01 && p.y > Y_ARCH - 2.) s = max(s, mBox(p, L, vec3(-ROOF_HX, Y_ORDER - CORNICE_H, -ROOF_HZ), vec3(ROOF_HX, Y_ORDER, ROOF_HZ), .03));
  // the pedestal, and (for what lies below its top) the chariot group's mass above it: the group does not shade itself
  s = max(s, mBox(p, L, vec3(-PED_HX, Y_ROOF, -PED_HZ), vec3(PED_HX, Y_ROOF + PED_H + (p.y < Y_ROOF + PED_H - .02 ? 1.6 : 0.), PED_HZ), 1.25));
  if (p.y > Y_ORDER - .01) {
    // the roof's own mass over its far steps, and the lions of the two files that stand toward the sun (the south
    // side's and the west side's) on the ledge and the lowest steps behind them
    s = max(s, mRoofMass(p, L));
    if (p.y < Y_ORDER + 4.) { vec3 r = vec3(LION_R);
      float tz = (LION_Z - p.z) / (L.z + 1e-5);
      if (tz > 0. && L.z > .02) { float qx = p.x + L.x * tz, i = clamp(floor((abs(qx) - LION_0) / LION_GX), 0., LION_NX - 1.);
        s = max(s, 1. - smoothstep(.8, 1.08, mLion(p, L, vec3(sign(qx) * (LION_0 + (i + .5) * LION_GX), Y_ORDER + LION_CY, LION_Z), r))); }
      float tx = (-LION_X - p.x) / (L.x - 1e-5);
      if (tx > 0. && L.x < -.02) { float qz = p.z + L.z * tx, i = clamp(floor((abs(qz) - LION_0) / LION_GZ), 0., LION_NZ - 1.);
        s = max(s, 1. - smoothstep(.8, 1.08, mLion(p, L, vec3(-LION_X, Y_ORDER + LION_CY, sign(qz) * (LION_0 + (i + .5) * LION_GZ)), r.zyx))); }
    }
  }
  // the columns' stripes: where the ray to the sun crosses a column line under the architrave, within a column's radius
  if (p.y > Y_POD - .05 && p.y < Y_ARCH + .05) {
    vec2 h = normalize(L.xz + vec2(1e-5, 0.));
    float tz = (sign(L.z) * COL_HZ - p.z) / (L.z + 1e-5 * sign(L.z + 1e-6));
    if (tz > .3 && abs(p.z) < COL_HZ - .55) { vec3 q = p + L * tz; float d = abs(q.x - floor(q.x / COL_STEP + .5) * COL_STEP) * abs(h.y);
      if (abs(q.x) < COL_HX + .6 && q.y < Y_ARCH) s = max(s, 1. - smoothstep(.4, .6, d)); }
    float tx = (sign(L.x) * COL_HX - p.x) / (L.x + 1e-5 * sign(L.x + 1e-6));
    if (tx > .3 && abs(p.x) < COL_HX - .55) { vec3 q = p + L * tx; float d = abs(q.z - floor(q.z / COL_STEP + .5) * COL_STEP) * abs(h.x);
      if (abs(q.z) < COL_HZ + .6 && q.y < Y_ARCH) s = max(s, 1. - smoothstep(.4, .6, d)); }
  }
  return 1. - s;
}
// the place's map of shadow heights, read a little outside a wall's own face so that a wall does not shade itself.
// The map holds four things for each place of the plan (the fourth: the leaves' share, see below): the height under which the sun does not reach, the ground's
// own height there (mGround keeps it: the foot of a wall reads it), and how far off the thing stands that throws the
// shadow (metres along the sun's ray on the plan). A SHADOW'S EDGE IS SOFT BY ITS LENGTH: the sun is a disc half a
// degree across, so the edge of a shadow thrown from a hundred metres is a metre and more of half light (PENUMBRA:
// the metres of height the half light spans for each metre the shadow has run), where at a wall's own foot it is sharp.
float mGround = -1e4;
float mMapSun(vec3 p, vec3 n){
  vec2 q = p.xz + n.xz * .95;
  vec2 uv = (q - uShadeRect.xy) * uShadeRect.zw;
  if (uv.x < .002 || uv.x > .998 || uv.y < .002 || uv.y > .998) return 1.;
  vec4 m = texture2D(tShade, uv); mGround = m.g;
  float h = m.r, s = smoothstep(-.75 - m.b * ${T(Jo)}, -.2, p.y - h);
  // THE SHADE OF LEAVES IS DAPPLED (the map's fourth figure: how much of the shadow at this place is thrown by a
  // broad tree's crown): the sun comes through the crown in flecks, a hand to a pace across on the ground
  // (P1: THE FLECKS MOVE WITH THE LEAVES: each fleck goes a hand's breadth to and fro by the world's clock, as the
  // crown over it stirs; by the pixel's size alone the motion goes over to nothing, so shade seen from far lies still)
  if (m.a > .03 && s < 1.) { vec2 stir = vec2(sin(uTime * .9 + p.z * .37), cos(uTime * .7 + p.x * .41)) * (.14 * (1. - smoothstep(.06, .3, fwidth(p.x) + fwidth(p.z))));
    s = max(s, .85 * min(1., m.a * 1.3) * smoothstep(.5, .7, mN(p.xz * 1.15 + 31. + stir) * .6 + mN(p.xz * 2.9 + 7. + stir * 2.) * .4)); }
  // THE ROOFS OF THE MARKET'S OPEN STOAS (the stoas whose fronts are turned to the afternoon sun; each roof a slab
  // on its columns with air under it, which the map cannot hold): a place under such a roof's height is in its
  // shadow where the ray to the sun is stopped by the slab; between the columns the low sun comes in under the eaves
  if (s > 0. && p.x > MARKET.x && p.x < MARKET.z + 22. && p.z > MARKET.y - 22. && p.z < MARKET.w) {
    float r = 0.;
${io.map((t,o)=>`    if (p.y < SR${o}_LO.y + .03) r = max(r, mBox(p, uSunDir, SR${o}_LO, SR${o}_HI, .05));`).join(`
`)}
    s *= 1. - r; }
  // THE ROOF OF THE UPPER SQUARE'S STOA (P1): the same law as the market's open stoas, for the places under its eaves
  if (s > 0. && p.y < SQS_LO.y + .03 && p.x > SQS_LO.x - 1. && p.x < SQS_HI.x + 26. && p.z > SQS_LO.z - 12. && p.z < SQS_HI.z + 1.) s *= 1. - mBox(p, uSunDir, SQS_LO, SQS_HI, .05);
  // THE GATE'S CEILING (a slab on beams over the passage, with air under it: a map of heights cannot hold it): where
  // the ray from a place of the passage, the stair or the square to the sun is stopped by it, the place is in its shadow
  if (s > 0. && p.x > GATE_LO.x - 2. && p.x < GATE_HI.x + 70. && abs(p.z - .5 * (GATE_LO.z + GATE_HI.z)) < 45.) s *= 1. - mBox(p, uSunDir, GATE_LO, GATE_HI, .05);
  return s;
}
// THE HOUR'S LIGHT: ONE LAW FOR EVERY SURFACE, by its facing, its shadow and the standing hour, and nothing else.
//   THE BEAM (uSunCol) times how squarely the face meets the sun (nothing where it is turned away), times its shadow
//   (sun: 1 in the sun, 0 in a cast shadow). So a wall that faces a low sun takes nearly all of it, level ground and
//   flat roofs the sine of the sun's height, a wall turned from it none.
//   THE SKY'S FILL (mFill) on every face, lit or shaded: the dome's blue by how much of the sky the face sees
//   (uSkyCol: all of it looking up, SKY_SIDE of it upright, a fifth of that looking down); the warm low light of the sun's
//   own quarter of the sky on faces turned to it (uGlowCol); and the warm light the sunlit ground throws up
//   (uGndCol: all of it on a face that looks down, half on an upright one, none on one that looks up).
//   ao: how much of that fill a nook or a foot keeps (a contact shade); it does not dim the beam.
vec3 mFill(vec3 n){
  float up = n.y * .5 + .5, gl = clamp(dot(n, uGlowDir) * .5 + .5, 0., 1.);
  float dome = n.y > 0. ? mix(${T(fe.SKY_SIDE)}, 1., n.y) : ${T(fe.SKY_SIDE)} * mix(1., .2, -n.y);
  return uSkyCol * dome + uGlowCol * gl * gl * gl + uGndCol * (1. - up);
}
vec3 mLight(vec3 alb, vec3 n, vec3 p, float ao, float sun, float wrap){
  float ndl = clamp((dot(n, uSunDir) + wrap) / (1. + wrap), 0., 1.) * sun;
  return alb * (uSunCol * ndl + mFill(n) * ao);
}
// THE LIT AIR between the eye and a thing (OPTICS, the world's list 5: the air's own light, by how much air lies between and by the
// bearing of the look from the sun's bearing; it reads nothing else of the lens). Toward the sun's bearing the air is
// full of the sun's own light, thrown forward by its dust and damp: a pale gold veil that thickens with distance, so
// each ridge of the hills stands paler than the one before it, and the town's roofs and its wall toward the west
// and south-west swim in it. Away from the sun the air is clear and its veil is the blue of the far sky.
// uAir: (the air's density away from the sun, how many times denser it shows toward the sun, how narrowly the
// sun's quarter is drawn: the power on the bearing's cosine, 0); uAirAway, uAirSun: the veil's two colours.
vec3 mAir(vec3 col, vec3 p){
  vec3 e = p - cameraPosition; float d = length(e);
  float toSun = dot(e.xz, uSunDir.xz) / max(length(e.xz) * length(uSunDir.xz), 1e-4);
  float w = pow(clamp(.5 + .5 * toSun, 0., 1.), uAir.z), dens = uAir.x * mix(1., uAir.y, w);
  return mix(col, mix(uAirAway, uAirSun, w), 1. - exp(-dens * dens * d * d));
}
`,ta=`
attribute vec3 aC; attribute float aK, aF; varying vec3 vW, vN, vC; varying float vK, vF;
uniform float uTime;
#ifdef SWAY
attribute vec4 aS;
#endif
void main(){
  mat4 mm = modelMatrix;
  #ifdef USE_INSTANCING
  mm = modelMatrix * instanceMatrix;
  #endif
  vec3 pos = position;
  #ifdef SWAY
  // cloth and leaves in a light sea wind: aS = (amount in metres, phase, 0 or 1: along the normal or sideways, rate)
  float ph = aS.y + uTime * aS.w;
  // (P1: a third way, aS.z = 2: the part dips straight down and comes up again, now and then: a hen's or a pigeon's
  // head at the grain; the first two ways are as they were)
  if (aS.z > 1.5) pos.y -= aS.x * smoothstep(.15, .8, sin(ph) * .7 + sin(ph * 2.3 + 1.7) * .3);
  else pos += (aS.z > .5 ? vec3(.7, 0., -.7) : normal) * aS.x * (sin(ph) * .7 + sin(ph * 2.3 + 1.7) * .3);
  #endif
  vec4 wp = mm * vec4(pos, 1.); vW = wp.xyz; vN = normalize(mat3(mm) * normal); vC = aC; vK = aK; vF = aF;
  // (a body drawn many times over takes each one's own colour on its cloth and on plain matter of kind 20, a load;
  // its skin and hair keep their own)
  #ifdef USE_INSTANCING_COLOR
  if (aK > 16.5) vC *= instanceColor;
  #endif
  gl_Position = projectionMatrix * (viewMatrix * wp);
}`,oa=`
#define T0 ${T(e.T)}
#define Y_POD ${T(Oe)}
#define Y_ORDER ${T(Se)}
#define Y_ARCH ${T(Se-e.ENTAB_H)}
#define Y_ROOF ${T(Ae)}
#define ROOF_HX ${T(e.ROOF_FOOT_HX)}
#define ROOF_HZ ${T(e.ROOF_FOOT_HZ)}
#define CELLA_HX ${T(Je)}
#define CELLA_HZ ${T(et)}
#define COL_HX ${T(be)}
#define COL_HZ ${T(ve)}
#define COL_STEP ${T(e.COL_STEP)}
#define PED_HX ${T(e.PED_HX)}
#define PED_HZ ${T(e.PED_HZ)}
#define PED_H ${T(e.PED_H)}
#define SHELF1 ${T(e.T+e.SHELF1_Y)}
#define SHELF2 ${T(e.T+e.SHELF2_Y)}
#define POD1_H vec2(${T(re[0])}, ${T(re[1])})
#define POD2_H vec2(${T(te[0])}, ${T(te[1])})
#define FIG1_H ${T(2.4)}
#define FIG2_H ${T(e.UPPER_FIG)}
#define FRIEZE_MID ${T((e.FRIEZE_Y0+e.FRIEZE_Y1)/2)}
#define FOOT_HX ${T(e.FOOT_HX)}
#define FOOT_HZ ${T(e.FOOT_HZ)}
#define GATE_Z ${T(e.GATE_Z)}
#define TER vec4(${T(e.TER_X0)}, ${T(e.TER_Z0)}, ${T(e.TER_X1)}, ${T(e.TER_Z1)})
#define CORNICE_H ${T(vt.cornice+vt.sima)}
#define PYR_HX ${T(e.ROOF_FOOT_HX-e.ROOF_MARGIN-.12)}
#define PYR_HZ ${T(e.ROOF_FOOT_HZ-e.ROOF_MARGIN-.12)}
#define PYR_SX ${T((e.ROOF_FOOT_HX-e.ROOF_MARGIN-e.ROOF_TOP_HX)/((e.ROOF_STEPS-1)*e.ROOF_STEP_H))}
#define PYR_SZ ${T((e.ROOF_FOOT_HZ-e.ROOF_MARGIN-e.ROOF_TOP_HZ)/((e.ROOF_STEPS-1)*e.ROOF_STEP_H))}
#define LION_X ${T(Ee.x)}
#define LION_Z ${T(Ee.z)}
#define LION_0 ${T(Ee.FIRST)}
#define LION_GX ${T(Ee.gapLong)}
#define LION_GZ ${T(Ee.gapShort)}
#define LION_NX ${T(e.LIONS_LONG/2)}
#define LION_NZ ${T(e.LIONS_SHORT/2)}
#define LION_CY ${T(.6*Ee.scale)}
#define LION_R ${T(.62*Ee.scale)}, ${T(.48*Ee.scale)}, ${T(.24*Ee.scale)}
#define SH1_Y ${T(e.SHELF1_Y)}
#define SH2_Y ${T(e.SHELF2_Y)}
#define BLUE1_H ${T(e.BLUE1_H)}
#define BLUE2_H ${T(e.BLUE2_H)}
#define GATE_LO vec3(${T(e.WING_X0)}, ${T(Me.y0)}, ${T(e.GATE_Z-e.GATE_HALF)})
#define GATE_HI vec3(${T(e.WING_X1)}, ${T(Me.y1)}, ${T(e.GATE_Z+e.GATE_HALF)})
#define BLUE_TONE ${T(qo)}
#define C_BLUE vec3(${T(y.blue.r)}, ${T(y.blue.g)}, ${T(y.blue.b)})
#define C_MARBLE vec3(${T(y.marble.r)}, ${T(y.marble.g)}, ${T(y.marble.b)})
#define CYP vec3(${T(e.CYPRESS_X0)}, ${T(e.CYPRESS_X1)}, ${T(e.CYPRESS_Z)})
#define CYP_GAP ${T(e.CYPRESS_GAP)}
#define PATH_0 vec2(${T(e.TER_X1)}, ${T(e.GATE_Z)})
#define PATH_A vec2(${T(e.WING_X0-.7071*Ue)}, ${T(e.GATE_Z-e.GATE_HALF+.7071*Ue)})
#define WING_X0 ${T(e.WING_X0)}
#define GATE_HALF ${T(e.GATE_HALF)}
#define WING_W ${T(e.WING_W)}
#define PATH_B vec2(${T(e.FOOT_HX+Ue)}, 0.)
#define PATH_OFF ${T(Ue)}
#define SWIFT_LANE vec3(${T(e.CYPRESS_X0)}, ${T(e.CYPRESS_X1)}, ${T(e.CYPRESS_Z-qt)})
#define SWIFT_UP ${T(e.TER_WALL_TOP+2-e.T)}
#define CLIMB vec4(${T(e.CLIMB_X)}, ${T(e.CLIMB_W/2)}, ${T(e.SQUARE_Z1)}, ${T(e.MARKET_Z0)})
#define QUAY_Z ${T(e.QUAY_Z)}
#define STAIR_FOOT vec2(${T(e.STAIR_X_FOOT)}, ${T(e.GATE_Z)})
#define STAIR_HEAD_X ${T(e.STAIR_X_HEAD)}
#define STAIR_HALF ${T(e.STAIR_HALF)}
#define SQUARE_Y ${T(e.SQUARE_Y)}
#define STAIR_STEP vec2(${T((e.STAIR_X_FOOT-e.STAIR_X_HEAD)/Qt)}, ${T((e.T-e.SQUARE_Y)/Qt)})
#define STAIR_WORN vec3(${T(y.marble.r*_e.worn)}, ${T(y.marble.g*_e.worn)}, ${T(y.marble.b*_e.worn)})
#define STAIR_DULL vec3(${T(y.marbleB.r*_e.dull)}, ${T(y.marbleB.g*_e.dull)}, ${T(y.marbleB.b*_e.dull)})
#define STAIR_RISER vec3(${T(y.marbleB.r*(_e.riserFoot+_e.riserHead)/2)}, ${T(y.marbleB.g*(_e.riserFoot+_e.riserHead)/2)}, ${T(y.marbleB.b*(_e.riserFoot+_e.riserHead)/2)})
#define STAIR_MID vec2(${T(e.STAIR_HALF-_e.mid)}, ${T(_e.mid-_e.edge)})
#define STREET_MIDZ ${T((e.STREET_Z0+e.STREET_Z1)/2-1)}
#define FOUNT vec2(${T(lt[0])}, ${T(lt[1])})
#define QUAY_Y ${T(e.QUAY_Y)}
#define RAIL vec3(${T(ft.x0)}, ${T(ft.x1)}, ${T(ft.z)})
#define FISH_A vec2(${T(dt[0][0])}, ${T(dt[0][1])})
#define FISH_B vec2(${T(dt[1][0])}, ${T(dt[1][1])})
#define FILES_OFF vec3(${T(oe.GOODS[1]-e.CLIMB_X)}, ${T(oe.STALLS[2]-e.CLIMB_X)}, ${T(oe.STALLS[3]-e.CLIMB_X)})
#define FILES_Z vec3(${T(oe.Z0)}, ${T(oe.STEP)}, ${T(oe.N-1)})
#define MARKET vec4(${T(e.MARKET_X0)}, ${T(e.MARKET_Z0)}, ${T(e.MARKET_X1)}, ${T(e.MARKET_Z1)})
#define COFFER vec4(${T(e.WING_X0+(e.WING_X1-e.WING_X0)/Me.beams/2+Me.beamW/2)}, ${T((e.WING_X1-e.WING_X0)/Me.beams)}, ${T(Me.coffer)}, ${T(Me.rib/2)})
#define C_PBLUE vec3(${T(y.paintBlue.r)}, ${T(y.paintBlue.g)}, ${T(y.paintBlue.b)})
#define C_PRED vec3(${T(y.red.r)}, ${T(y.red.g)}, ${T(y.red.b)})
#define C_GRAVEL vec3(${T(y.gravel.r)}, ${T(y.gravel.g)}, ${T(y.gravel.b)})
#define WAY_A vec2(${T(je.a[0])}, ${T(je.a[1])})
#define WAY_B vec2(${T(je.b[0])}, ${T(je.b[1])})
#define WAY_W ${T(je.w)}
#define BASIN vec2(${T(Kt[0])}, ${T(Kt[1])})
#define SHADED_OFF vec3(${T(X.EDGE)}, ${T(X.MID)}, ${T(X.OUTER)})
#define SHADED_Z vec2(${T(X.Z0-2.5)}, ${T(Math.min(...co()))})
#define SHADED_END vec3(${co().map(T).join(", ")})
#define STREW vec3(${X.STREW.map(T).join(", ")})
${io.map((t,o)=>`#define SR${o}_LO vec3(${t.lo.map(T).join(", ")})
#define SR${o}_HI vec3(${t.hi.map(T).join(", ")})`).join(`
`)}
#define SQS_LO vec3(${fo.lo.map(T).join(", ")})
#define SQS_HI vec3(${fo.hi.map(T).join(", ")})
`,aa=`
varying vec3 vW, vN, vC; varying float vK, vF;
${oa}
${ea}
// A joint line: x in cells (joints lie on the cell borders), w its half width in cells, a the width of one pixel in
// cells. A FADE BY PIXEL SIZE ALONE (it reads no distance and no direction of the lens): under about two pixels to a
// cell the line goes over to its mean share, so far masonry is one even tone and never a moire.
float mLine(float x, float w, float a){
  a = max(a, 1e-4); float d = abs(fract(x) - .5);
  float c = clamp((d - .5 + w) / a + .5, 0., 1.) * min(1., 2. * w / a + .3);
  return mix(c, 2. * w, smoothstep(.3, .7, a));
}
// masonry in courses: uv in metres, course height ch, block length bl, joint half width jw (metres).
// returns (joint share, the course's tone, the block's tone), tones about 0, each fading by pixel size
vec3 mCourses(vec2 uv, float ch, float bl, float jw){
  float v = uv.y / ch, row = floor(v);
  float u = uv.x / bl + mod(row, 2.) * .5 + mH(vec2(row, 3.7)) * .25;
  float av = fwidth(v), au = fwidth(u);
  float j = max(mLine(v, jw / ch, av), mLine(u, jw / bl, au) * .85);
  float tc = (mH(vec2(row, 1.3)) - .5) * (1. - smoothstep(.3, .9, av));
  float tb = (mH(vec2(floor(u), row)) - .5) * (1. - smoothstep(.3, .9, max(au, av)));
  return vec3(j, tc, tb);
}
// distance from p to the stretch a..b
float mSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
// THE WORN TRACKS of the paved ways, by the plan (1 on a track's middle, ragged at its sides): up the middle of the
// climbing street from the landing through the market (through the market a cart's breadth: the cart way, worn
// pale by wheels and hooves); along the quay behind its edge; across the upper square from
// the street's head to the stair's foot; through the gate's passage; along the main street
float mTrack(vec2 p){
  float d = mSeg(p, vec2(CLIMB.x, QUAY_Z - 2.), vec2(CLIMB.x, CLIMB.z)) - (p.y > CLIMB.w ? 1.5 : .5);
  d = min(d, abs(p.y - QUAY_Z + 4.5) - .4 + step(QUAY_Z, p.y) * 9.);
  d = min(d, mSeg(p, vec2(CLIMB.x, CLIMB.z), STAIR_FOOT) - .4);
  d = min(d, mSeg(p, STAIR_FOOT, vec2(TER.z, STAIR_FOOT.y)) - .6);
  d = min(d, abs(p.y - STREET_MIDZ) - 1.6);
  return 1. - smoothstep(.5, 1.7, d + .8 * (mN(p * .5 + 3.) - .5));
}
// THE DRAINS: a gutter along each side of the climbing street, half a metre in from the shop fronts' line; from the
// street's mouth two drains run down across the market to the quay, six metres either side of the street's line;
// across the quay a drain slot to the water every 24 m
float mDrain(vec2 p){
  float ax = abs(p.x - CLIMB.x), w = fwidth(p.x) + fwidth(p.y), d = 9.;
  if (p.y > CLIMB.z && p.y < CLIMB.w) d = abs(ax - CLIMB.y + .5);
  if (p.y >= CLIMB.w && p.y < QUAY_Z) d = min(d, abs(ax - 6.));
  if (p.y > QUAY_Z - 9. && p.y < QUAY_Z) d = min(d, abs(fract(p.x / 24. + .5833) - .5) * 24.);
  return (1. - smoothstep(.1, .16 + w, d)) * (1. - smoothstep(.2, .8, w));
}
// DAMP: the paving round the fountain's trough (a ragged ring of splashed water out to about four metres), the
// quay's edge, wet for a pace behind the water, and the ground round the fish sellers' trestles
float mDamp(vec2 p){
  float nn = mN(p * .7 + 2.);
  float a = 1. - smoothstep(1.4, 4.2, length(p - FOUNT) + 2.2 * (nn - .5));
  float b = (1. - smoothstep(.3, 1.5, QUAY_Z - p.y + 1.1 * (nn - .5))) * step(p.y, QUAY_Z + .5);
  // (and round the fish sellers' two trestles, where the catch is sluiced down)
  float c = 1. - smoothstep(1.2, 3.8, min(length(p - FISH_A), length(p - FISH_B)) + 1.9 * (nn - .5));
  return max(max(a * .8, b * .7), c * .78);
}
// STRAW, HUSKS AND SPILL about every lot of the market's six files (the stalls and the goods that wait for the
// carts, by the plan: the files' three distances from the cart way's middle line, the lots' step along them): 1 at
// a lot, thinning raggedly over some three metres
float mLitter(vec2 p){
  if (p.y < FILES_Z.x - 5. || p.y > FILES_Z.x + FILES_Z.y * FILES_Z.z + 5.) return 0.;
  float ax = abs(p.x - CLIMB.x), dx = min(min(abs(ax - FILES_OFF.x), abs(ax - FILES_OFF.y)), abs(ax - FILES_OFF.z));
  float zc = FILES_Z.x + clamp(floor((p.y - FILES_Z.x) / FILES_Z.y + .5), 0., FILES_Z.z) * FILES_Z.y;
  float lot = clamp(1. - smoothstep(1.3, 3.9, length(vec2(dx, (p.y - zc) * .85)) + 2. * (mN(p * .6 + 13.) - .5)), 0., 1.);
  // (P1: and along the three files of the shaded lots, the part's SHADED: a thinner strew along each file's line.
  // P1B: EACH FILE'S STREW ENDS WHERE THE FILE ENDS, NORTH OF THE QUAY'S STEP (SHADED_END, the part's strewEnds;
  // SHADED_Z.y is the first of the three ends): south of a file's end the strew is measured from the END of the
  // file's line, so it thins round its end by the same law as at its sides (no ruled line), and it is nought
  // from the step's line on: NOTHING OF IT LIES ON THE QUAY'S OWN TOP. P1 cut it square at z 204.0, 2 m onto the
  // quay's top. Live's own litter round its lots, 'lot' above, is NOT TOUCHED: round live's last lots at z 200 it
  // lies past the step as it does in live, to live's own cut 5 m past them. The strew's north end, at
  // SHADED_Z.x, is P1's cut and is not touched either.)
  float sx = min(min(abs(ax - SHADED_OFF.x), abs(ax - SHADED_OFF.y)), abs(ax - SHADED_OFF.z));
  if (p.y > SHADED_Z.y) { vec3 a = abs(ax - SHADED_OFF), e = max(p.y - SHADED_END, 0.); sx = sqrt(min(min(a.x * a.x + e.x * e.x, a.y * a.y + e.y * e.y), a.z * a.z + e.z * e.z)); }
  float strew = (1. - smoothstep(STREW.x, STREW.y, sx + STREW.z * (mN(p * .6 + 13.) - .5))) * step(SHADED_Z.x, p.y);
  return max(lot, .7 * clamp(strew, 0., 1.));
}
// CART RUTS: two grooves worn by the wheels, a cart's gauge apart (1.44 m), up the cart way from the landing through
// the market and up the climbing street to its head; they wander a hand's breadth; by the pixel's size alone they
// go over to nothing (their mean is in the worn track's tone)
float mRuts(vec2 p){
  if (p.y < CLIMB.z || p.y > QUAY_Z - 1.) return 0.;
  float w = fwidth(p.x) + fwidth(p.y), d = abs(abs(p.x - CLIMB.x + .25 * (mN(vec2(p.y * .11, 7.)) - .5)) - .72);
  return clamp((1. - smoothstep(.05, .1 + w, d)) * (1. - smoothstep(.12, .5, w)) * (.55 + .45 * mN(vec2(p.x * .3, p.y * .5 + 5.))), 0., 1.);
}
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-6, 0.)), alb = vC; float k = floor(vK + .5), ao = 1., wrap = 0., thru = 0.;
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.)), spec = vec3(0.), glint = vec3(0.); vec4 mirror = vec4(0.);
  // (inPass: a face of the gate's passage, under its roof)
  bool inPass = vF < .5 && vW.x > GATE_LO.x - .2 && vW.x < GATE_HI.x + .2 && abs(vW.z - GATE_Z) < GATE_HALF + .15 && vW.y < GATE_HI.y;
  // the half way between the eye and the sun (for the sheen and the bronze's glint); guarded: where the eye looks
  // straight down the sun's own ray the two cancel, and no length is divided by nothing
  vec3 Hs = V + uSunDir; Hs /= max(length(Hs), 1e-4);
  // A THIN SHEET HAS TWO FACES (a wall built as one sheet, an awning, a sail, a roof seen from under it): the face
  // that is seen is the one whose side the eye is on, and the light falls on it by that face's own facing
  { vec3 fn = cross(dFdx(vW), dFdy(vW)); if (dot(fn, V) < 0.) fn = -fn; if (dot(n, fn) < 0.) n = -n; }
  bool lies = abs(n.y) > .7, thrown = vF > 2.5; float lineSh = 1.;
  // a cast shadow's shape on an upright face of the tomb takes that face's own stone by its height: the blue
  // limestone behind each shelf's statues, white marble elsewhere (on a level face its builder gives it the face's own)
  if (thrown && !lies) { float hh = vW.y - T0; bool blue = (hh > SH1_Y && hh < SH1_Y + BLUE1_H) || (hh > SH2_Y && hh < SH2_Y + BLUE2_H); alb = blue ? C_BLUE : C_MARBLE; k = blue ? 2. : 1.; }
  vec2 tg = normalize(vec2(-n.z, n.x) + vec2(1e-4, 0.));
  vec2 uv = lies ? vW.xz : vec2(dot(vW.xz, tg), vW.y - T0);
  float px = max(fwidth(uv.x), fwidth(uv.y));
  float sheen = 0., stairFar = 0.;
  if (k == 1.) {
    // white marble in courses of 0.4 m: joints, a tone to each course and block, broad weathering, veins seen near.
    // THE TERRACE'S WORKS (the gate's wings, the wall's marble course: every face of this stone that is not the
    // tomb's) are laid with DRAFTED JOINTS: each block's edge is cut back a thumb's breadth, so a joint shows as a
    // sunk line of some five centimetres with its own shade, and the blocks differ more in tone
    bool works = vF < .5;
    vec3 c = mCourses(uv, .4, 1.3, works ? .026 : .011);
    float blot = mFbm(uv * vec2(.11, .16) + 3.), mid = mN(uv * vec2(.9, 1.4) + 9.);
    alb *= (.92 + .12 * blot) * (1. + .05 * c.y + (works ? .13 : .08) * c.z) * (.975 + .05 * mid) * (1. - (works ? .46 : .34) * c.x);
    float vein = (1. - smoothstep(0., .05, abs(mN(uv * vec2(1.3, 2.9) + mN(uv * .7) * 2.) - .5))) * (1. - smoothstep(.012, .05, px));
    alb = mix(alb, alb * vec3(.78, .83, .93), .55 * vein);
    sheen = .14;
  } else if (k == 2.) {
    // dark blue-grey limestone, matt, in courses of 0.6 m: paler chipped joints, a tone to each block, paler scuffs
    vec3 c = mCourses(uv, .6, 1.5, .016);
    float blot = mFbm(uv * vec2(.2, .28) + 13.), sc = mN(uv * vec2(2.1, 3.3) + 4.);
    alb = alb * BLUE_TONE * (.86 + .22 * blot) * (1. + .12 * c.y + .26 * c.z) * (.94 + .12 * sc);
    alb = mix(alb, alb * 1.7 + .012, .6 * c.x);
    alb = mix(alb, alb * 1.5 + vec3(.012, .014, .018), .3 * smoothstep(.62, .8, mN(uv * .45 + 21.)));
    // THE TERRACE'S WALL AND THE STAIR'S CHEEKS (the same dressed stone as the tomb's bands, standing in the weather;
    // every face of this stone that is not the tomb's): A SHADE PALER TOWARD THE WALL'S HEAD, where its top courses
    // under the coping take the rain and the sun (a sixth paler at the most, over the top metre and a half, ragged;
    // topY: the terrace's level, or the cheek's own sloping head beside the stair), and DARK RUNS where water comes
    // down from the joints of the course above (each its own length, to some four metres; seen near)
    if (vF < .5) {
      float topY = T0; if (vW.x > TER.z + .2 && vW.x < STAIR_FOOT.x + .3 && abs(vW.z - GATE_Z) < STAIR_HALF + 1.8) topY = mix(SQUARE_Y, T0, clamp((STAIR_FOOT.x - vW.x) / (STAIR_FOOT.x - STAIR_HEAD_X), 0., 1.)) + .95;
      float dT = topY - vW.y, s1 = mN(vec2(uv.x * 1.7, 9.3));
      alb *= 1. + .16 * clamp(1. - smoothstep(.2, 1.6, dT + .8 * (mN(vec2(uv.x * .6, 5.)) - .5)), 0., 1.);
      float run = clamp((1. - smoothstep(0., .6 + 3.4 * s1 * s1, dT)) * smoothstep(.45, .7, mN(vec2(uv.x * 4.3, dT * .25 + 6.))), 0., 1.);
      alb *= 1. - .24 * run * (1. - smoothstep(.2, .8, px)); }
  } else if (k == 3.) {
    // lime plaster: broad blotches, rain streaks down from the top, fine grain
    float blot = mFbm(uv * .33 + 5.), fine = mN(uv * 5.) * (1. - smoothstep(.04, .2, px));
    alb *= (.86 + .22 * blot) * (.95 + .1 * fine);
    alb *= 1. - .13 * smoothstep(.52, .8, mN(vec2(uv.x * 1.4, uv.y * .07 + 9.)));
    // PATCHES (seen from near; by the pixel's size alone they go over to their mean): here a newer, paler coat
    // where the wall was made good (about a fifth of it), there a place where the coat has come off and the darker
    // rubble and mud show (about a tenth), each with a ragged edge
    { float nearP = 1. - smoothstep(.07, .32, px), rag = .08 * (mN(uv * 6.3) - .5);
      float made = smoothstep(.6, .63, mN(uv * vec2(.42, .55) + 17.) + rag), bare = smoothstep(.72, .75, mN(uv * vec2(1.5, 1.2) + 41.) + rag);
      alb *= mix(1.02, 1. + .1 * made, nearP);
      // (P1: where the coat has come off, THE WALL'S BRICK SHOWS: mud brick in courses of a hand and a half, each
      // brick its own tone, the joints darker; seen near, like the patch itself; far off the wall's tone is as it was)
      vec2 bq = vec2(uv.x / .42 + mod(floor(uv.y / .13), 2.) * .5, uv.y / .13);
      vec3 brick = vec3(.5, .39, .29) * (.8 + .4 * mH(floor(bq))) * (1. - .4 * max(mLine(bq.x, .05, fwidth(bq.x)), mLine(bq.y, .1, fwidth(bq.y))));
      alb = mix(alb * vec3(.99, .987, .983), mix(alb, mix(alb * vec3(.9, .87, .83), brick, 1. - smoothstep(.02, .09, px)), bare), nearP); }
    // UNDER THE ROOF'S EDGE (a house's wall carries, in the share of its kind's number, how far each place lies
    // under the wall's own top: dTop, in metres; over 3 under a flat roof, under 3 under a tiled one, 3 itself
    // where a face carries none): the wall's head lies in the
    // coping's or the eaves' shade and is its dirtiest part (a soft dark band of 0.8 m, at any distance); below it
    // rain has run down in streaks, each its own length (to some 2 m), dark where the roof's dust is washed down
    // and held; here and there a broader stain of smoke. The streaks go over to their mean by the pixel's size.
    // Under a flat roof THE ROOF BEAMS' ENDS show in a row under the parapet, at the deck's height: dark squares of
    // a hand and a half, 0.8 m apart (seen near; by the pixel's size they go over to nothing: their mean is a
    // thirtieth of that course).
    { float fl = vK - 3., dTop = abs(fl) * 50. - 1.;
      if (abs(fl) > .01) {
        if (fl > 0.) { float bu = uv.x / .8, ba = max(fwidth(bu), 1e-4), fy = max(fwidth(dTop), 1e-4);
          float bm = clamp((.09 - abs(fract(bu) - .5)) / ba + .5, 0., 1.) * clamp((dTop - .6) / fy + .5, 0., 1.) * clamp((.77 - dTop) / fy + .5, 0., 1.);
          alb *= 1. - .62 * bm * (1. - smoothstep(.1, .3, px)); } float seenS = 1. - smoothstep(.2, .8, px), s1 = mN(vec2(uv.x * 2.3, 3.1)), len = .3 + 1.7 * s1 * s1;
        float run = clamp((1. - smoothstep(0., len, dTop)) * smoothstep(.3, .62, mN(vec2(uv.x * 6.1, dTop * .3 + 2.))), 0., 1.);
        float smoke = clamp((1. - smoothstep(0., 2.6, dTop)) * smoothstep(.66, .8, mN(vec2(uv.x * .23, 11.))), 0., 1.);
        alb *= 1. - .3 * (1. - smoothstep(0., .8, dTop));
        alb *= 1. - mix(.07 * (1. - smoothstep(0., 1.4, dTop)), .3 * run, seenS);
        alb = mix(alb, alb * vec3(.62, .6, .6), .55 * smoke * mix(.5, 1., seenS)); } }
  } else if (k == 4.) {
    // roof tiles: rows of pan tiles down the slope, raised cover tiles between them, a tone to each tile
    vec3 t3 = normalize(vec3(-n.z, 0., n.x) + vec3(1e-4, 0., 0.));
    vec2 tv = vec2(dot(vW, t3) / .3, vW.y / (max(length(n.xz), .2) * .45));
    float a1 = fwidth(tv.x), a2 = fwidth(tv.y);
    float tone = (mH(floor(tv)) - .5) * (1. - smoothstep(.3, .9, max(a1, a2)));
    alb *= (.84 + .26 * mFbm(tv * .11)) * (1. + .3 * tone) * (1. - .34 * mLine(tv.y, .1, a2)) * (1. - .3 * mLine(tv.x, .14, a1));
  } else if (k == 5.) {
    // THE TERRACE'S GRAVEL, in world space. GRAIN AT FOUR SCALES: pebbles of a finger's width with pale and dark
    // ones among them (seen near), a mottle of a hand's breadth to a pace, drifts of finer and coarser stone some
    // paces across (where the rake and the rain have sorted it), and slow changes of tone over tens of metres; each
    // finer scale goes over to its mean by the pixel's size alone, the two broad ones stand at any distance.
    float fineF = 1. - smoothstep(.05, .2, px), gritF = 1. - smoothstep(.012, .05, px), midF = 1. - smoothstep(.25, 1., px);
    float broad = mFbm(vW.xz * .03 + 7.), mid = mix(.5, mFbm(vW.xz * .7 + 2.), midF);
    float fine = mix(.5, mN(vW.xz * 9.), fineF), grit = mix(.5, mN(vW.xz * 31.), gritF), peb = mN(vW.xz * 17. + 3.);
    float drift = mFbm(vW.xz * .13 + 40.);
    alb *= (.86 + .26 * broad) * (.85 + .3 * drift) * (.92 + .16 * mid) * (.86 + .28 * fine) * (.88 + .24 * grit);
    alb = mix(alb, alb * vec3(.97, .99, 1.04), smoothstep(.5, .75, drift));
    alb = mix(alb, alb * 1.22, .6 * gritF * smoothstep(.72, .8, peb)); alb = mix(alb, alb * .72, .5 * gritF * (1. - smoothstep(.14, .2, peb)));
    alb = mix(alb, alb * vec3(1.05, .98, .88), smoothstep(.45, .7, mFbm(vW.xz * .012 + 90.)));
    // THE TRODDEN PATH: from the edge of the passage's paving on the gate's axis (PATH_0) it rounds the inner corner
    // of the north wing PATH_OFF clear of it (PATH_A), goes on to the tomb's east end (PATH_B) and right round the
    // tomb's foot, PATH_OFF out from the walls: a pace or two wide, ragged, packed flat and PALER than the loose
    // gravel (feet grind the pebbles to a pale dust and press it smooth); no rake goes over it
    float df = length(max(vec2(abs(vW.x) - FOOT_HX, abs(vW.z) - FOOT_HZ), 0.)) + min(max(abs(vW.x) - FOOT_HX, abs(vW.z) - FOOT_HZ), 0.);
    float dp = min(mSeg(vW.xz, PATH_0, PATH_A), mSeg(vW.xz, PATH_A, PATH_B));
    float trod = 1. - smoothstep(.7, 1.5, min(dp, abs(df - PATH_OFF)) + .7 * (mN(vW.xz * .45 + 5.) - .5));
    // RAKE LINES: the gravel is raked in strokes along the terrace's length, a rake's width (0.6 m) to a stroke and
    // nine metres to a pull: each pull a tone of its own, a darker seam where two strokes meet, and the teeth's
    // furrows a hand apart (their slope leans the surface, so a raking sun shows them); all fade by the pixel's
    // size alone, taken at its longer side, so a stroke is lost where the pixel is as long as the stroke is wide
    { float sv = (vW.z + .1 * (mN(vec2(vW.x * .06, floor(vW.z / .6) * 7.1)) - .5)) / .6, aSv = fwidth(sv), rk = (1. - trod) * (1. - smoothstep(.3, .9, px / .6));
      alb *= 1. + rk * (.06 * (mH(vec2(floor(sv), floor(vW.x / 9. + mH(vec2(floor(sv), 2.))))) - .5) - .08 * mLine(sv, .06, aSv));
      float tv = sv * 6., teethF = rk * (1. - smoothstep(.2, .7, px * 10.));
      alb *= 1. - .07 * teethF * (.5 + .5 * cos(tv * 6.2831853));
      n = normalize(n + vec3(0., 0., sin(tv * 6.2831853) * .35 * teethF)); }
    alb = mix(alb, alb * vec3(1.25, 1.22, 1.17) + .014, trod);
    // WHEEL AND FOOT MARKS AT THE GATE'S MOUTH: from the edge of the passage's paving (PATH_0) for some fifteen
    // metres out on the gate's axis the gravel is cut by the carts that bring the offerings and the masons' stone
    // (two pairs of wheel grooves a cart's gauge apart, wandering, the second pair bearing off toward the tomb) and
    // pocked by feet (dark dimples a hand across, seen near); all fade by the pixel's size alone
    { float ux = PATH_0.x - vW.x, rm = clamp((1. - smoothstep(7., 16., ux)) * step(-.5, ux) * (1. - smoothstep(GATE_HALF - 2., GATE_HALF + 1.5, abs(vW.z - GATE_Z))), 0., 1.);
      if (rm > 0.) { float w = fwidth(vW.z) + fwidth(vW.x), zc = vW.z - GATE_Z;
        float d1 = abs(abs(zc + .5 * (mN(vec2(vW.x * .13, 3.)) - .5)) - .72), d2 = abs(abs(zc + 1.6 + ux * .16 + .4 * (mN(vec2(vW.x * .17, 8.)) - .5)) - .72);
        float gr = (1. - smoothstep(.06, .13 + w, min(d1, d2))) * (1. - smoothstep(.15, .6, w));
        float pock = smoothstep(.62, .72, mN(vW.xz * 3.3 + 77.)) * (1. - smoothstep(.04, .2, px));
        alb *= 1. - rm * (.3 * gr + .16 * pock); alb = mix(alb, alb * vec3(1.12, 1.1, 1.06), rm * .5 * (1. - gr)); } }
    // THE GRAVEL'S OWN RELIEF UNDER A RAKING SUN: the slope of its mottle leans the surface a little (seen near), and
    // the slope of its drifts (low swells some paces across, a few fingers high, where the rake and the rain have
    // sorted it) leans it too: a low sun rakes them into light and soft shade far out over the terrace
    { vec2 q = vW.xz * .7 + 2., qd = vW.xz * .13 + 40.; float rl = 1. - smoothstep(.1, .5, px), rd = 1. - smoothstep(.8, 3., px);
      n = normalize(n + vec3(mFbm(q + vec2(.35, 0.)) - mid, 0., mFbm(q + vec2(0., .35)) - mid) * .7 * rl * (1. - trod)
        + vec3(mFbm(qd + vec2(.25, 0.)) - drift, 0., mFbm(qd + vec2(0., .25)) - drift) * .5 * rd * (1. - .6 * trod)); }
    // THE WEST KERB'S SHADOW LINE: the kerb stands a hand and a half over the gravel (KERB_UP) and throws its
    // shadow east over it, as long as the hour makes it (by the sun's place alone)
    lineSh = smoothstep(${T(e.KERB_UP)} * .7, ${T(e.KERB_UP)}, (vW.x - TER.x) * uSunDir.y / max(-uSunDir.x, .05));
    // DAMP AND SHADE AT THE EDGES: along the foot of the two walls (south and east), along the two kerbs (north and
    // west) and round the feet of the gate's two wings the gravel lies darker for a pace or two, with a contact shade
    // in the angle. The east wall stands north and south of the gate only: across the passage's mouth no wall stands
    // and nothing is laid. (gq: the place mirrored about the gate's axis; dWing: the metres to the nearer wing's foot)
    vec2 gq = vec2(vW.x, abs(vW.z - GATE_Z));
    float dWing = length(max(vec2(WING_X0 - gq.x, max(GATE_HALF - gq.y, gq.y - GATE_HALF - WING_W)), 0.));
    float eastD = gq.y > GATE_HALF + WING_W ? TER.z - vW.x - .8 : 99.;
    float edge = min(min(eastD, TER.w - vW.z - .8), min(min(vW.x - TER.x, vW.z - TER.y), dWing));
    alb *= mix(vec3(.78, .8, .8), vec3(1.), smoothstep(.2, 2.4, edge + .9 * (mN(vW.xz * .5) - .5)));
    ao *= 1. - .4 * (1. - smoothstep(0., .6, edge));
    // (P1) UNDER THE WATER BASIN'S STAND (the part's BASIN_AT): the contact shade of the stand's foot, gone within
    // three quarters of a metre of the basin's middle. (P1A: NOTHING ELSE IS LAID ON THE GRAVEL BY THE BASIN OR BY
    // THE WAY OF SLABS: no damp ring round the basin, no darker ground beside the way or round its end; the gravel
    // there is the terrace's own, as it lies everywhere else.)
    { float bd = length(vW.xz - BASIN); if (bd < .75) ao *= 1. - .35 * (1. - smoothstep(.36, .75, bd)); }
    // WHERE SHADE LIES THROUGH THE AFTERNOON THE GROUND KEEPS COOL AND DARK: on the tomb's side away from the sun
    // (by the sun's bearing alone), out to about its own breadth, and for some paces north of the south wall
    { vec2 c = clamp(vW.xz, -vec2(FOOT_HX, FOOT_HZ), vec2(FOOT_HX, FOOT_HZ)), o = vW.xz - c; float dl = length(o), nz = mN(vW.xz * .3 + 9.);
      float lee = clamp(dot(o / max(dl, 1e-3), -normalize(uSunDir.xz)) * 1.6 - .2, 0., 1.);
      float cool = max(lee * (1. - smoothstep(5., 26., dl + 5. * (nz - .5))), 1. - smoothstep(1.2, 5.5, TER.w - vW.z - .8 + 2. * (nz - .5)));
      alb *= mix(vec3(1.), vec3(.82, .85, .87), cool); }
    // DRY GRASS AND WEEDS along the walls' and the kerbs' feet and round each cypress's foot: a ragged fringe of
    // straw and dusty green, its blades seen near (the weeds themselves stand there as tufts: the world builds them)
    { float cx = (fract((vW.x - CYP.x) / CYP_GAP + .5) - .5) * CYP_GAP, cyd = length(vec2(cx, vW.z - CYP.z)) + step(vW.x, CYP.x - 2.) * 9. + step(CYP.y + 2., vW.x) * 9.;
      float wd = min(edge, cyd - .15), weeds = 1. - smoothstep(.1, 1.15, wd + .9 * (mN(vW.xz * 1.7 + 23.) - .5));
      float blade = mix(.55, smoothstep(.35, .6, mN(vW.xz * 14.)), 1. - smoothstep(.02, .1, px));
      alb = mix(alb, mix(vec3(.5, .46, .27), vec3(.3, .34, .19), smoothstep(.4, .7, mN(vW.xz * .9 + 5.))), weeds * (.3 + .5 * blade)); }
    // UNDER THE CYPRESS ROW: the ground stays damp and dark, and the trees' litter lies on it (brown twigs and
    // cones as specks, thick at the trunks' line, thinning over three metres)
    { float dc = abs(vW.z - CYP.z) + step(vW.x, CYP.x - 3.) * 9. + step(CYP.y + 3., vW.x) * 9., under = 1. - smoothstep(.8, 3.4, dc + 1.2 * (mN(vW.xz * .6 + 8.) - .5));
      alb *= mix(vec3(1.), vec3(.84, .85, .82), under);
      float lit = smoothstep(.56, .66, mN(vW.xz * 6.3 + 12.) * .6 + mN(vW.xz * 15.) * .4) * (1. - smoothstep(.03, .14, px));
      alb = mix(alb, vec3(.33, .25, .17), .7 * under * lit); }
    // THE SWIFTS' SHADOWS: small quick shades run over the gravel beside the cypress row where the swifts hunt
    // along it (their lane's own line, thrown along the sun's rays from their height; at the flock's own speed on
    // the world's clock, each from its own dealt start: uSwiftStart, the lane's shades' own stream)
    { vec2 off = -uSunDir.xz / max(uSunDir.y, .2) * SWIFT_UP; float len = SWIFT_LANE.y - SWIFT_LANE.x, sh = 0.;
      for (int i = 0; i < 4; i++) { float fi = float(i), s = mod(uTime * ${T(jt)} + uSwiftStart[i] * len * 1.6, len * 1.6);
        vec2 c = vec2(SWIFT_LANE.y - s, SWIFT_LANE.z + sin(s * .13 + fi * 2.) * 1.1) + off;
        sh = max(sh, (1. - smoothstep(.12, .42, length((vW.xz - c) * vec2(.6, 1.)))) * step(s, len)); }
      ao *= 1. - .5 * sh; }
    // THE FOOT OF THE TOMB: a contact shade where its wall meets the ground
    ao *= 1. - .45 * (1. - smoothstep(0., 1.2, df));
  } else if (k == 6.) {
    // PAVING OF STONE SLABS, 1.4 by 0.9 m in courses: joints with dirt in them, a tone to each slab and here and
    // there a slab of a darker or a yellower stone, each slab a little dished toward its edges (seen near), broad
    // weathering, dark spills and stains
    vec2 g = vW.xz / vec2(1.4, .9); g.x += mod(floor(g.y), 2.) * .5; vec2 ag = fwidth(g), id = floor(g);
    float seen = 1. - smoothstep(.3, .9, max(ag.x, ag.y)), j = max(mLine(g.x, .022, ag.x), mLine(g.y, .03, ag.y));
    float t1 = mH(id), t2 = mH(id + 17.3); vec2 f = abs(fract(g) - .5) * 2.;
    // each slab its own tone within the stone's range; one slab in three from another bed of the quarry, greyer or yellower
    alb *= mix(vec3(1.), mix(vec3(.8, .8, .78), vec3(1.1, 1.02, .86), step(.5, t2)), seen * smoothstep(.5, .8, t1)) * (1. + .3 * (t1 - .5) * seen);
    // FAR OFF, where a slab is under a pixel, the floor is still no one tone: it was laid and mended in fields of some
    // tens of slabs, each field from one load of stone, and weather and feet have worked on it in broad stains
    alb *= mix(vec3(.9), vec3(1.08, 1.05, .98), smoothstep(.3, .7, mN(vW.xz * vec2(.055, .08) + 60.))) * (.92 + .16 * mN(vW.xz * .021 + 7.));
    alb *= (.8 + .34 * mFbm(vW.xz * .22)) * (1. - .1 * seen * smoothstep(.55, 1., max(f.x, f.y))) * (1. - .46 * j);
    // THE QUAY'S COPING: one row of long stones along the edge, a pace wide, paler and worn round, their joints across
    { float cz = QUAY_Z - vW.z; if (cz > -.4 && cz < 1.08 && abs(vW.y - QUAY_Y) < .4) { float cu = vW.x / 2.1, ca = fwidth(cu);
        vec3 cop = vC * vec3(1.14, 1.12, 1.08) * (.9 + .2 * mH(vec2(floor(cu), 5.))) * (.86 + .22 * mFbm(vW.xz * .9));
        cop *= 1. - .5 * max(mLine(cu, .012, ca), 1. - smoothstep(0., .04 + fwidth(cz), abs(cz - 1.02)));
        alb = mix(alb, cop, 1. - smoothstep(1.02, 1.07, cz)); } }
    // THE WORN TRACK (mTrack: the middle of the ways where feet and wheels go, by the plan): paler and smoother
    float tr = mTrack(vW.xz);
    alb = mix(alb, alb * vec3(1.2, 1.17, 1.1) + .02, .7 * tr);
    alb *= 1. - .2 * smoothstep(.58, .78, mFbm(vW.xz * .6 + 31.)) * (1. - .7 * tr);
    // STRAW AND CHAFF lie about the tethering rail under the market's west plane (trodden in, thick at the rail,
    // thinning over three metres; its flecks seen near)
    { float sw = 1. - smoothstep(.7, 3.4, mSeg(vW.xz, RAIL.xz, RAIL.yz) + 1.5 * (mN(vW.xz * .8 + 3.) - .5));
      float fl = mix(.5, smoothstep(.42, .6, mN(vW.xz * vec2(9., 3.) + mN(vW.xz * 2.) * 3.)), 1. - smoothstep(.03, .15, px));
      alb = mix(alb, vec3(.62, .52, .3), sw * (.3 + .5 * fl)); }
    // STRAW, HUSKS AND SPILL about the stalls and the goods (mLitter): trodden straw, its flecks seen near, and dark
    // stains where oil, wine and brine were spilt; CART RUTS up the cart way (mRuts): dark grooves in the worn stone
    { float lt = mLitter(vW.xz), fl = mix(.5, smoothstep(.42, .6, mN(vW.xz * vec2(3., 9.) + mN(vW.xz * 2.) * 3.)), 1. - smoothstep(.03, .15, px));
      alb = mix(alb, vec3(.6, .51, .31), lt * (.2 + .45 * fl));
      alb *= 1. - .36 * lt * smoothstep(.58, .7, mN(vW.xz * .9 + 51.));
      alb *= 1. - .42 * mRuts(vW.xz); }
    // DRAIN LINES (mDrain: gutters of darker, damp stone) and DAMP (mDamp: round the fountain, along the quay's edge,
    // round the fish sellers)
    alb = mix(alb, alb * vec3(.56, .59, .6), .85 * mDrain(vW.xz));
    alb *= mix(vec3(1.), vec3(.6, .64, .68), mDamp(vW.xz));
    alb *= .93 + .14 * mN(vW.xz * 6.) * (1. - smoothstep(.04, .16, px));
  } else if (k == 7.) {
    // the dry hillside: straw grass, grey rock where it is steep or by patches, olive and pine as dark dots
    float r1 = mFbm(vW.xz * .012), r2 = mFbm(vW.xz * .09 + 5.), r3 = mN(vW.xz * .9);
    // THE LAND'S OWN FOLDS, finer than its mesh (spurs and gullies some 80 m across and 20 m deep, runnels some 25 m
    // across): the slope they add turns the face to the sun or away from it, so a west or south slope stands
    // sunlit and a gully or an east slope lies in the sky's shade
    vec2 gp = vW.xz * .012, gq = vW.xz * .04 + 31.;
    vec2 fold = vec2(mFbm(gp + vec2(.07, 0.)) - r1, mFbm(gp + vec2(0., .07)) - r1) * 3.4 + vec2(mN(gq + vec2(.2, 0.)) - mN(gq), mN(gq + vec2(0., .2)) - mN(gq)) * .9;
    { vec3 nf = n - vec3(fold.x, 0., fold.y); n = nf / max(length(nf), 1e-4); }
    vec3 grass = vec3(.31, .28, .2) * (.78 + .5 * r2), rock = vec3(.29, .28, .28) * (.75 + .5 * r3);
    vec3 g = mix(grass, rock, smoothstep(.5, .7, r1 + .3 * r2 - .15 + (1. - n.y) * 1.6));
    float dots = smoothstep(.6, .68, mN(vW.xz * .21 + 11.) * .62 + mN(vW.xz * .83) * .38);
    alb = mix(g, vec3(.11, .16, .09), dots * .85) * vC;
  } else if (k == 8.) {
    alb *= .7 + .5 * mN(vW.xy * 3.7 + vW.z * 2.);
    spec = (uSunCol + uGlowCol * 2.) * pow(max(dot(n, Hs), 0.), 22.) * vec3(1., .8, .5) * .9;
    // (P1) IN THE GATE'S PASSAGE the bronze of the leaves' bands and studs stands in shade and GIVES BACK THE BRIGHT
    // WEST MOUTH (the sunlit court beyond it): where the look, mirrored in the metal, goes out toward that mouth it
    // shows the sunlit ground's own light, gold on the bronze; elsewhere the metal is dark
    if (inPass) { vec3 R = reflect(-V, n); glint = uGndCol * (${T(.9/fe.BOUNCE)} * smoothstep(.5, .9, -R.x)) * vec3(1., .8, .5); }
  } else if (k == 9.) {
    // THE BROAD STAIR FROM AFAR (stairFar: how far a tread or a riser is too fine for the picture, by the pixel's
    // size on the step alone: each tread and riser stands in its own light wherever the face is a pixel and a half
    // or more; under that it goes over to the step's mean, whole at one pixel); what it shows then is laid below,
    // after the light
    if (vW.x > STAIR_HEAD_X && vW.x < STAIR_FOOT.x && abs(vW.z - STAIR_FOOT.y) < STAIR_HALF && vW.y > SQUARE_Y - .01 && vW.y < T0 + .01)
      stairFar = smoothstep(.667, 1., max(fwidth(vW.y) / STAIR_STEP.y, fwidth(vW.x) / STAIR_STEP.x));
    // carved stone: a round form darkens a little toward its turning edge, so one body stands off the next
    alb *= (.95 + .1 * mN(vW.xz * 1.9 + vW.y * 2.3)) * mix(.66, 1., pow(abs(dot(n, V)), .55));
    sheen = .1;
  } else if (k == 10.) {
    // the frieze: a deep blue ground with pale and dun-red leaning shapes in relief that nobody can read
    vec3 gr = vec3(.035, .15, .27) * (.8 + .4 * mN(uv * 3.)); float cover = 0.; vec3 fig = vec3(0.);
    for (int q = 0; q < 2; q++) {
      float w0 = q == 0 ? .52 : .83, cell = uv.x / w0 + float(q) * 7.37, id = floor(cell);
      vec2 f = vec2(fract(cell) - .5 + (mH(vec2(id, 21.)) - .5) * .3, (uv.y - FRIEZE_MID) / .9 + (mH(vec2(id, 4.)) - .5) * .12);
      f.x += f.y * (mH(vec2(id, 2. + float(q))) - .5) * 1.5;
      float w = .13 + .2 * mH(vec2(id, 5.)), hg = .2 + .22 * mH(vec2(id, 8.));
      float blob = (1. - smoothstep(.7, 1.05, length(f / vec2(w, hg)))) * step(.22, mH(vec2(id, 31.)));
      vec3 c = mix(vec3(.72, .68, .6), vec3(.5, .22, .14), step(.7, mH(vec2(id, 13.))));
      fig = mix(fig, c * (.8 + .34 * (f.y + .5)), blob); cover = max(cover, blob);
    }
    cover *= 1. - smoothstep(.12, .5, fwidth(uv.x / .52));
    alb = mix(gr, fig, cover);
  } else if (k == 11.) {
    // the coffered ceiling: square coffers stepped in four frames, the ground of each thick blue, red on the mouldings
    vec2 g = fract(vW.xz / 1.5 + .5) - .5; float d = max(abs(g.x), abs(g.y)) * 2.;
    float step4 = floor(clamp((1. - d) / .14, 0., 4.));
    vec3 frame = vec3(.78, .76, .72) * (1. - .13 * step4);
    float edge = 1. - smoothstep(.0, .035, abs(fract((1. - d) / .14) - .5) - .42);
    frame = mix(frame, vec3(.6, .1, .05), .7 * edge * step(d, .98) * (1. - smoothstep(.02, .1, fwidth(d))));
    alb = mix(frame, vec3(.035, .25, .37), step(d, .44));
  } else if (k == 12.) {
    // ship's planking: strakes of 0.22 m along the hull, pitch-dark seams, weathered tones
    float row = vW.y / .22, a = fwidth(row);
    alb *= (.8 + .4 * mN(vec2(floor(row) * 7.3, uv.x * .3))) * (1. - .4 * mLine(row, .08, a));
  } else if (k == 13.) {
    // the town's pale ashlar: courses of 0.5 m, joints, a tone to each block, stains
    vec3 c = mCourses(uv, .5, 1.25, .016);
    alb *= (.82 + .3 * mFbm(uv * .3 + 8.)) * (1. + .1 * c.y + .16 * c.z) * (1. - .4 * c.x);
  } else if (k == 14.) {
    // trodden earth of the lanes and yards: mottled, gritty, with stones of a hand's width and, where nobody walks,
    // tufts of dry grass (both seen near; they go over to the mean tone by the pixel's size alone)
    float broad = mFbm(vW.xz * .08 + 3.), mid = mFbm(vW.xz * .9), st = mN(vW.xz * 7.) * (1. - smoothstep(.03, .14, px));
    alb *= (.76 + .4 * broad) * (.86 + .28 * mid) * (.92 + .16 * st);
    float nearF = 1. - smoothstep(.08, .35, px);
    alb = mix(alb, vec3(.5, .47, .41), .4 * nearF * smoothstep(.78, .84, mN(vW.xz * 3.1 + 11.)));
    alb = mix(alb, alb * vec3(.72, .78, .5), .6 * nearF * smoothstep(.66, .74, mN(vW.xz * 2.3 + 40.)) * smoothstep(.45, .6, broad));
  } else if (k == 18.) {
    // a flat roof of packed clay: mottled, crazed with fine cracks, stained, gritty near
    float m1 = mFbm(vW.xz * .55 + 3.), cr = (1. - smoothstep(.0, .035, abs(mN(vW.xz * 1.1 + mN(vW.xz * 2.7) * 1.5) - .5))) * (1. - smoothstep(.02, .12, px));
    alb *= (.74 + .46 * m1) * (1. - .3 * cr) * (.93 + .14 * mN(vW.xz * 11.) * (1. - smoothstep(.02, .1, px)));
    alb = mix(alb, alb * vec3(.8, .8, .74), .5 * smoothstep(.55, .75, mN(vW.xz * .23 + 50.)));
  } else if (k == 19.) {
    // plaster rubbed smooth and polished: even, bright, with the sun's glance on it
    alb *= .93 + .1 * mFbm(uv * .16 + 4.);
    sheen = .32;
  } else if (k == 22.) {
    // THE COFFERS OF THE GATE'S CEILING (P1; THE PAINT IS INVENTED: the tomb's own blue and red on a plain ground,
    // allowed by the owner's ruling of 08:00 UTC on 11 Oct 2026; NOTHING LETTERED, NO FIGURE, NO PATTERN): each
    // coffer (the slab's underside between two beams and two cross ribs: the part's GATE_CEIL) has a margin of the
    // bare marble a hand wide, a step down (its shade line), a red fillet of a hand's breadth round the sinking and
    // inside it one plain ground of blue, uneven only as a brush leaves it. By the pixel's size alone the coffer
    // goes over to its mean.
    vec2 cq = vec2(fract((vW.x - COFFER.x) / COFFER.y) * COFFER.y, fract((vW.z - GATE_LO.z) / COFFER.z) * COFFER.z - COFFER.w), cs = vec2(COFFER.z, COFFER.z - 2. * COFFER.w);
    float e = min(min(cq.x, cs.x - cq.x), min(cq.y, cs.y - cq.y)), aw = max(fwidth(vW.x), fwidth(vW.z)) + 1e-4;
    vec3 stone = alb * (.9 + .14 * mFbm(vW.xz * .9 + 5.)), ground = C_PBLUE * (.9 + .2 * mFbm(vW.xz * 2.3 + 11.));
    float inS = smoothstep(-aw, aw, e - .1), inF = smoothstep(-aw, aw, e - .13), inG = smoothstep(-aw, aw, e - .2);
    vec3 c = mix(stone, stone * .62, inS); c = mix(c, C_PRED, inF); c = mix(c, ground, inG);
    alb = mix(c, stone * .366 + C_PRED * .173 + ground * .429, smoothstep(.25, .7, aw));
    ao *= mix(.8, 1., smoothstep(0., .1, e));
  } else if (k == 23.) {
    // THE WAY OF MARBLE SLABS OVER THE TERRACE'S GRAVEL (P1; INVENTED, allowed by the owner's ruling of 08:00 UTC
    // on 11 Oct 2026; the part's SLAB_WAY): PLAIN SLABS, NO PATTERN, NO BORDER: three slabs to the way's width,
    // each a pace and a half long, laid in running courses along the way's own line; a tone to each slab, joints
    // with dust in them, paler and smoother down the middle where feet go (the wear of a way long used: none of
    // the terrace's visitors walks on it), and the terrace's gravel drifted raggedly over its two edges and its end
    vec2 wv = WAY_B - WAY_A; float wl = length(wv); wv /= wl; vec2 wq = vW.xz - WAY_A; float al = dot(wq, wv), ac = dot(wq, vec2(-wv.y, wv.x));
    vec2 g = vec2(al / 1.5, ac / (WAY_W / 3.) + 1.5); g.x += mod(floor(g.y), 2.) * .5; vec2 ag = fwidth(g), id = floor(g);
    float seen = 1. - smoothstep(.3, .9, max(ag.x, ag.y)), j = max(mLine(g.x, .02, ag.x), mLine(g.y, .035, ag.y));
    alb *= (1. + .3 * (mH(id + 3.1) - .5) * seen) * (.86 + .2 * mFbm(vW.xz * .35 + 21.)) * (1. - .6 * j);
    alb = mix(alb, alb * vec3(1.07, 1.06, 1.04), .6 * (1. - smoothstep(.25, .9, abs(ac))));
    float rag = mN(vW.xz * 1.3 + 9.) - .5;
    float drift = max(smoothstep(.72, 1.02, abs(ac) / (WAY_W * .5) + .4 * rag), max(smoothstep(wl - 1.6, wl - .1, al + 1.2 * rag), 1. - smoothstep(.0, .5, al + .5 * rag)));
    alb = mix(alb, C_GRAVEL * (.62 + .22 * mN(vW.xz * 9.) * (1. - smoothstep(.05, .2, px))), .9 * drift);
    sheen = .1 * (1. - drift);
  } else if (k == 21.) {
    // WATER (P1). LYING STILL IN A VESSEL UNDER THE OPEN SKY it gives the sky back: the low sky's own colour on the
    // far side of the look (the air's two colours: the far sky's away from the sun, the sun's quarter's toward it,
    // by the bearing of the mirrored look alone), the more of it the flatter the look lies on the water; a light
    // ripple runs over it (seen near). RUNNING DOWN FROM A SPOUT it is a pale sheet with streaks that run down by
    // the world's clock.
    if (lies) { vec2 rb = normalize(-V.xz + vec2(1e-4, 0.));
      float ws = pow(clamp(.5 + .5 * dot(rb, normalize(uSunDir.xz)), 0., 1.), uAir.z);
      float rip = (mN(vW.xz * 9. + uTime * vec2(.31, .23)) - .5) * (1. - smoothstep(.01, .06, px));
      mirror = vec4(mix(uAirAway, uAirSun, ws) * (1. + .12 * rip), clamp(mix(.5, 1., pow(1. - max(V.y, 0.), 3.)) + .1 * rip, 0., 1.));
    } else alb *= .7 + .5 * smoothstep(.3, .7, mN(vec2(uv.x * 37., uv.y * 5. + uTime * 6.)));
  } else if (k == 16.) {
    // foliage: dark leaf masses, lit by leaf clumps of two sizes
    alb *= (.62 + .7 * mN(vW.xz * 2.6 + vW.y * 3.1)) * (.8 + .4 * mN(vW.xy * 9. + vW.z * 7.) * (1. - smoothstep(.03, .15, px)));
    // light comes through a leaf mass from its far side: the side turned away from the sun takes a share of the sun
    // through the leaves (thru: up to a quarter of it, by its facing and the sun's place only), so a tree against the
    // light stands dark green and never black
    thru = .25 * max(0., -dot(n, uSunDir));
    // a leaf mass is no smooth face: its leaves stand every way, so the beam goes a little round it
    wrap = .3;
  } else if (k == 17.) {
    // woven cloth (awnings, sails, washing): seams every 0.9 m across the weave, a faint weave near, weather stains
    float sm = mLine(uv.x / .9, .02, fwidth(uv.x / .9));
    alb *= (.86 + .2 * mFbm(uv * .5 + 12.)) * (1. - .22 * sm) * (.96 + .08 * mN(uv * 30.) * (1. - smoothstep(.01, .05, px)));
    // thin cloth shows the sun through from its far side (it reads the sun's place only)
    if (dot(n, uSunDir) < 0.) { n = -n; alb *= .78; }
    wrap = .2;
  } else if (k == 15.) {
    // a fluted shaft: 24 flutes (INVENTED number) round the column's own axis; the columns stand on the 3 m grid.
    // The flutes fade by pixel size alone
    vec2 d = vW.xz - floor(vW.xz / COL_STEP + .5) * COL_STEP; float rr = max(length(d), .05);
    float a = atan(d.y, d.x) * 24., fa = length(fwidth(d)) / rr * 24. / 6.2831853, fl = 1. - smoothstep(.25, .8, fa);
    n = normalize(n + vec3(-d.y, 0., d.x) / rr * sin(a) * .55 * fl);
    alb *= (1. - .16 * fl * (.5 + .5 * cos(a))) * (.96 + .08 * mN(vec2(a * .03, vW.y * 1.7)));
    sheen = .1;
  }
  // THE WET EDGE: whatever of the standing place lies within half a metre of the sea's level (the quay's face and its
  // footing stones, the shores) is wet and darker, with a ragged upper edge, and weed grows at the water's line
  if (vF < .5 && vW.y < 1.) { alb *= mix(vec3(.58, .62, .62), vec3(1.), smoothstep(.1, .5, vW.y + .22 * (mN(vW.xz * .7) - .5)));
    // and at the water's own line a band of weed, dark green, a hand to a forearm high
    alb = mix(alb, vec3(.07, .1, .05), .8 * (1. - smoothstep(-.05, .32, vW.y + .22 * (mN(vW.xz * 1.3 + vW.y * 2.) - .5)))); }
  float sun = thrown ? 0. : (vF > 1.5 ? 1. : (vF > .5 ? mTombSun(vW) : mMapSun(vW, n))) * lineSh;
  // THE FEET OF THE WALLS: every plastered or ashlar wall of the town and the terrace's retaining walls stand
  // darker and dirtier for about a metre over the ground at their own foot (the map's ground height just outside the
  // wall): rain splashes the street's dust up them and the damp stays, a ragged band, darkest in a dirt line at the
  // very foot, with the contact shade of the angle. It goes over to nothing by the pixel's size alone (a wall
  // whose pixels are a metre tall shows no band).
  if (vF < .5 && !lies && mGround > -1e3 && (k == 3. || k == 19. || k == 13. || k == 2.)) {
    float up = vW.y - mGround, seen = 1. - smoothstep(.35, 1.2, px);
    float rag = .5 * (mN(vec2(uv.x * .9, 7.3)) - .5) + .25 * (mN(vec2(uv.x * 4.1, 1.7)) - .5);
    float band = (1. - smoothstep(.1, 1.15 + rag, up)) * seen, dirt = (1. - smoothstep(0., .45 + .5 * rag, up)) * seen;
    vec3 stain = k == 2. ? vec3(.82, .82, .8) : (k == 3. ? vec3(.72, .67, .6) : vec3(.8, .76, .7));
    alb *= mix(vec3(1.), stain, .55 * band); alb = mix(alb, alb * stain * stain * vec3(.97, .95, .92), .6 * dirt);
    ao *= 1. - .3 * (1. - smoothstep(0., .5, up)) * seen;
  }
  if ((vF > .5 && vF < 1.5) || thrown) {
    // the tomb's contact shades, by its own measures: the dim behind the column line under the ceiling, the wall's
    // foot on each shelf, the foot of each roof step
    float dIn = min(COL_HX - abs(vW.x), COL_HZ - abs(vW.z));
    if (vW.y > Y_POD + .02 && vW.y < Y_ORDER - .9) ao *= mix(1., .36, smoothstep(-.6, 2.2, dIn));
    if (!lies) { ao *= 1. - .3 * (1. - smoothstep(0., .8, vW.y - SHELF1)) * step(SHELF1, vW.y) - .3 * (1. - smoothstep(0., .8, vW.y - SHELF2)) * step(SHELF2, vW.y);
      if (vW.y > Y_ORDER && vW.y < Y_ROOF) ao *= .55 + .45 * smoothstep(0., .45, fract((vW.y - Y_ORDER) / .3)); }
  }
  vec3 col = mLight(alb, n, vW, ao, sun, wrap) + alb * uSunCol * (thru * sun);
  // (still water gives the sky back over its own dark: kind 21)
  col = mix(col, mirror.rgb, mirror.a);
  // UNDER THE GATE'S ROOF (LIGHT.PASS): less of the sky, and THE WARM LIGHT THE SUNLIT GROUND THROWS UP, before the
  // west mouth and inside the passage as far as the sun reaches in under the ceiling (reach: by the sun's place and
  // the ceiling's height alone), by the share of a face's view downward that the sunlit ground fills (seenG; uGndCol
  // over LIGHT.BOUNCE is the ground's own light: the beam's share by the sine of the sun's height on the ground's
  // colour). The bronze of the leaves gives back the bright west mouth (glint, below).
  if (inPass) {
    float reach = (GATE_LO.y - T0) * max(-uSunDir.x, 0.) / max(uSunDir.y, .05), dE = vW.x - GATE_LO.x - reach, hF = max(vW.y - T0, .6);
    float seenG = .5 * (1. - dE / sqrt(dE * dE + hF * hF));
    col += alb * (uGndCol * (${T(fe.PASS[1]/fe.BOUNCE)} * seenG * (n.y < -.5 ? 1. : (n.y > .5 ? ${T(fe.PASS[3])} : ${T(fe.PASS[2])}))) - mFill(n) * (ao * ${T(1-fe.PASS[0])}));
    col += glint; }
  if (sheen > 0.) spec = uSunCol * pow(max(dot(n, Hs), 0.), 26.) * sheen;
  col += spec * sun;
  // THE BROAD STAIR FROM AFAR: steps too fine for the picture show as THE STEP'S MEAN, the same on tread and riser:
  // the tread in its own light (its tone at that place across the stair: the worn middle, the duller sides) and
  // the riser in its own, each by the share of the step it takes in the look (OPTICS: seen from below a step
  // shows mostly its riser, from above mostly its tread). The picture holds no row of lines finer than itself.
  if (stairFar > 0.) {
    vec3 ta = mix(STAIR_DULL, STAIR_WORN, 1. - clamp((abs(vW.z - STAIR_FOOT.y) - STAIR_MID.x) / STAIR_MID.y, 0., 1.)), nu = vec3(0., 1., 0.), ne = vec3(1., 0., 0.);
    float wt = STAIR_STEP.x * max(V.y, 0.), wr = STAIR_STEP.y * max(V.x, 0.);
    vec3 mean = (wt * mLight(ta, nu, vW, ao, mMapSun(vW, nu), 0.) + wr * mLight(STAIR_RISER, ne, vW, ao, mMapSun(vW, ne), 0.)) / max(wt + wr, 1e-4);
    col = mix(col, mean, stairFar);
  }
  // THE STATUES OF THE TWO SHELVES SEEN FROM AFAR (a far fade to the mean, by the pixel's size alone): where a figure
  // stands under about four pixels high (pw: the metres of the tomb's face to a pixel) the row of figures and the
  // shadows they throw on the band go over to the row's mean tone: the band's own stone with a third of the
  // figures' pale stone in it, a soft paler line along the shelf and never a row of upright strokes. From where a
  // figure has its head and shoulders (six pixels and more) they stand as figures.
  if (vF > .5 && !lies) {
    float sh = vW.y > SHELF2 ? 2. : 1.; vec2 hw = sh > 1.5 ? POD2_H : POD1_H; float y0 = sh > 1.5 ? SHELF2 : SHELF1, fh = sh > 1.5 ? FIG2_H : FIG1_H;
    vec2 dq = abs(vW.xz) - hw; float out2 = max(dq.x, dq.y);
    if (vW.y > y0 + .04 && vW.y < y0 + fh + .5 && out2 > -.03 && out2 < 1.5 && (thrown || (k == 9. && out2 > .06))) {
      float pw = .7071 * length(vec2(length(dFdx(vW)), length(dFdy(vW)))), far = 1. - smoothstep(4., 6.5, fh / max(pw, 1e-4));
      if (far > 0.) { vec3 nw = dq.x > dq.y ? vec3(sign(vW.x), 0., 0.) : vec3(0., 0., sign(vW.z));
        vec3 band = mLight(C_BLUE * BLUE_TONE, nw, vW, .8, mTombSun(vW + nw * .05), 0.);
        col = mix(col, thrown ? mix(band, col, .5) : mix(band, col, .3), far); }
    }
  }
  gl_FragColor = vec4(mAir(col, vW), 1.);
}`;function sa(t){return{uSunDir:{value:t.sunDir.clone()},uSunCol:{value:t.sunCol.clone()},uSkyCol:{value:t.skyCol.clone()},uGndCol:{value:t.gndCol.clone()},uGlowDir:{value:t.glowDir.clone()},uGlowCol:{value:t.glowCol.clone()},tShade:{value:t.shade||null},uShadeRect:{value:t.shadeRect||new K.Vector4(0,0,0,0)},uSwiftStart:{value:new K.Vector4(0,.25,.5,.75)},uTime:{value:0},uAirAway:{value:new K.Color(.6,.66,.74)},uAirSun:{value:new K.Color(1,.8,.5)},uAir:{value:new K.Vector4(5e-4,uo.sunMore,uo.pow,0)}}}function po(t,o={}){return new K.ShaderMaterial({uniforms:{...t},vertexShader:ta,fragmentShader:aa,fog:!1,side:K.DoubleSide,...o})}const ut={PIECE:9,DEAR:6,SOME:3,PLAIN:1},na=Promise.resolve();function _o(t=async()=>{}){let o=0;const a=(s=ut.PLAIN)=>o>0&&(o+s>ut.PIECE||s>=ut.DEAR&&o>=ut.SOME)?(o=s,t()):(o+=s,na);return a.through=()=>(o=0,t()),a}const Rt=_o(),Eo={tomb:344064,statueShadows:15360};let Lt=new Float64Array(6*1024),Ht=new Float64Array(384),To=new Float64Array(384);const wo=[0,1,0],Ao=3e5,ra=(t,o,a,s)=>{let n=s[0],r=s[1],i=s[2],m=s[3],p=s[4],d=s[5];for(let f=o;f<a;f+=3){const w=t[f],H=t[f+1],I=t[f+2];w<n&&(n=w),w>m&&(m=w),H<r&&(r=H),H>p&&(p=H),I<i&&(i=I),I>d&&(d=I)}s[0]=n,s[1]=r,s[2]=i,s[3]=m,s[4]=p,s[5]=d};function So(t={}){let o=Math.max(96,Math.ceil(t.room||3072)),a=0,s=new Float32Array(o*3),n=new Float32Array(o*3),r=new Float32Array(o*3),i=new Float32Array(o),m=new Float32Array(o),p=t.sway?new Float32Array(o*4):null;const d=()=>{const l=(c,A)=>{const S=new Float32Array(o*2*A);return S.set(c),S};s=l(s,3),n=l(n,3),r=l(r,3),i=l(i,1),m=l(m,1),p&&(p=l(p,4)),o*=2},f={flag:t.flag||0,sway:null};let w=1,H=0,I=1,P=0,W=0,R=0;f.at=(l=0,c=0,A=0,S=0,u=1)=>{w=Math.cos(S),H=Math.sin(S),I=u,P=l,W=c,R=A};let _=1,b=0,E=0,F=0;f.tilt=(l=0,c=0,A=0)=>{_=Math.cos(l),b=Math.sin(l),E=c,F=A};const v=(l,c,A,S,u,h,L,M)=>{if(b!==0){const g=c,N=u;c=E+(g-E)*_+(A-F)*b,A=F+(A-F)*_-(g-E)*b,u=N*_+h*b,h=h*_-N*b}a===o&&d();const C=a*3;if(s[C]=P+(l*w+A*H)*I,s[C+1]=W+c*I,s[C+2]=R+(-l*H+A*w)*I,n[C]=S*w+h*H,n[C+1]=u,n[C+2]=-S*H+h*w,r[C]=L.r,r[C+1]=L.g,r[C+2]=L.b,i[a]=M,m[a]=f.flag,p&&f.sway){const g=f.sway,N=a*4;p[N]=g[0],p[N+1]=g[1],p[N+2]=g[2],p[N+3]=g[3]}a++};f.vert=(l,c,A,S)=>v(l[0],l[1],l[2],c[0],c[1],c[2],A,S);const O=(l,c,A,S,u,h,L,M,C,g,N,Y,k,B,D)=>{const Z=S-l,U=u-c,J=h-A,ee=L-l,se=M-c,j=C-A;let $=U*j-J*se,G=J*ee-Z*j,ae=Z*se-U*ee;const ne=Math.hypot($,G,ae)||1;$/=ne,G/=ne,ae/=ne,Y&&$*(l-k)+G*(c-B)+ae*(A-D)<0&&($=-$,G=-G,ae=-ae),v(l,c,A,$,G,ae,g,N),v(S,u,h,$,G,ae,g,N),v(L,M,C,$,G,ae,g,N)},x=(l,c,A,S,u,h,L,M,C,g,N,Y,k,B,D,Z,U)=>{O(l,c,A,S,u,h,L,M,C,k,B,!0,D,Z,U),O(l,c,A,L,M,C,g,N,Y,k,B,!0,D,Z,U)};return f.tri=(l,c,A,S,u,h)=>h?O(l[0],l[1],l[2],c[0],c[1],c[2],A[0],A[1],A[2],S,u,!0,h[0],h[1],h[2]):O(l[0],l[1],l[2],c[0],c[1],c[2],A[0],A[1],A[2],S,u,!1,0,0,0),f.quad=(l,c,A,S,u,h,L)=>{f.tri(l,c,A,u,h,L),f.tri(l,A,S,u,h,L)},f.box=(l,c,A,S,u,h,L,M,C,g)=>{const N=(l+S)/2,Y=(c+u)/2,k=(A+h)/2;x(l,c,A,S,c,A,S,u,A,l,u,A,L,M,N,Y,k),x(l,c,h,S,c,h,S,u,h,l,u,h,L,M,N,Y,k),x(l,c,A,l,c,h,l,u,h,l,u,A,L,M,N,Y,k),x(S,c,A,S,c,h,S,u,h,S,u,A,L,M,N,Y,k),x(l,u,A,S,u,A,S,u,h,l,u,h,g||L,C??M,N,Y,k)},f.boxAll=(l,c,A,S,u,h,L,M)=>{f.box(l,c,A,S,u,h,L,M),x(l,c,A,S,c,A,S,c,h,l,c,h,L,M,(l+S)/2,(c+u)/2,(A+h)/2)},f.spine=(l,c,A,S,u={})=>{const h=u.seg||8,L=u.up||wo,M=l.length,C=h*6;Lt.length<M*C&&(Lt=new Float64Array(M*C*2));const g=Lt;let N=0,Y=0,k=0,B=0,D=0,Z=0;for(let U=0;U<M;U++){const J=l[Math.max(0,U-1)],ee=l[Math.min(M-1,U+1)],se=l[U];let j=ee[0]-J[0],$=ee[1]-J[1],G=ee[2]-J[2];const ae=Math.hypot(j,$,G)||1;j=j/ae,$=$/ae,G=G/ae;let ne=L[1]*G-L[2]*$,le=L[2]*j-L[0]*G,Le=L[0]*$-L[1]*j,qe=Math.hypot(ne,le,Le);qe<1e-4&&(ne=1,le=0,Le=0,qe=1),ne=ne/qe,le=le/qe,Le=Le/qe;const zt=$*Le-G*le,Yt=G*ne-j*Le,Xt=j*le-$*ne,Ve=c[U],Ut=typeof Ve=="number",Co=Ut?Ve:Ve[0],Do=Ut?Ve:Ve[1];let Ie=U*C;for(let At=0;At<h;At++,Ie+=6){const St=At/h*6.2831853,De=Math.cos(St),Ze=Math.sin(St),kt=u.fold?u.fold(U,St):1,ze=Math.max(Co,1e-4)*kt,Ye=Math.max(Do,1e-4)*kt;g[Ie]=se[0]+ne*ze*De+zt*Ye*Ze,g[Ie+1]=se[1]+le*ze*De+Yt*Ye*Ze,g[Ie+2]=se[2]+Le*ze*De+Xt*Ye*Ze;const Gt=ne*De/ze+zt*Ze/Ye,$t=le*De/ze+Yt*Ze/Ye,Bt=Le*De/ze+Xt*Ze/Ye,bt=Math.hypot(Gt,$t,Bt)||1;g[Ie+3]=Gt/bt,g[Ie+4]=$t/bt,g[Ie+5]=Bt/bt}U===0&&(N=j,Y=$,k=G),U===M-1&&(B=j,D=$,Z=G)}for(let U=0;U<M-1;U++){const J=u.cols?u.cols[U]:A,ee=u.cols?u.cols[U+1]:A,se=U*C,j=se+C;for(let $=0;$<h;$++){const G=se+$*6,ae=se+($+1)%h*6,ne=j+$*6,le=j+($+1)%h*6;v(g[G],g[G+1],g[G+2],g[G+3],g[G+4],g[G+5],J,S),v(g[ae],g[ae+1],g[ae+2],g[ae+3],g[ae+4],g[ae+5],J,S),v(g[le],g[le+1],g[le+2],g[le+3],g[le+4],g[le+5],ee,S),v(g[G],g[G+1],g[G+2],g[G+3],g[G+4],g[G+5],J,S),v(g[le],g[le+1],g[le+2],g[le+3],g[le+4],g[le+5],ee,S),v(g[ne],g[ne+1],g[ne+2],g[ne+3],g[ne+4],g[ne+5],ee,S)}}if(u.cap0){const U=l[0],J=N*-1,ee=Y*-1,se=k*-1,j=u.cols?u.cols[0]:A;for(let $=0;$<h;$++){const G=$*6,ae=($+1)%h*6;v(U[0],U[1],U[2],J,ee,se,j,S),v(g[G],g[G+1],g[G+2],J,ee,se,j,S),v(g[ae],g[ae+1],g[ae+2],J,ee,se,j,S)}}if(u.cap1){const U=l[M-1],J=(M-1)*C,ee=u.cols?u.cols[M-1]:A;for(let se=0;se<h;se++){const j=J+se*6,$=J+(se+1)%h*6;v(U[0],U[1],U[2],B,D,Z,ee,S),v(g[j],g[j+1],g[j+2],B,D,Z,ee,S),v(g[$],g[$+1],g[$+2],B,D,Z,ee,S)}}},f.limb=(l,c,A,S,u,h,L,M)=>f.spine([l,c],[A,S],h,L,{seg:u,cap0:M,cap1:M,up:Math.abs(c[1]-l[1])>Math.hypot(c[0]-l[0],c[2]-l[2])?[1,0,0]:wo}),f.lump=(l,c,A,S,u,h,L=8,M=5)=>{Ht.length<(L+1)*6&&(Ht=new Float64Array((L+1)*12),To=new Float64Array((L+1)*12));const C=(Y,k)=>{const B=Y/M*Math.PI,D=Math.sin(B),Z=Math.cos(B);for(let U=0,J=0;U<=L;U++,J+=6){const ee=U/L*6.2831853,se=D*Math.cos(ee),j=D*Math.sin(ee),$=se/c,G=Z/A,ae=j/S,ne=Math.hypot($,G,ae)||1;k[J]=l[0]+se*c,k[J+1]=l[1]+Z*A,k[J+2]=l[2]+j*S,k[J+3]=$/ne,k[J+4]=G/ne,k[J+5]=ae/ne}};let g=Ht,N=To;C(0,g);for(let Y=0;Y<M;Y++){C(Y+1,N);for(let B=0;B<L;B++){const D=B*6,Z=D+6;Y>0&&(v(g[D],g[D+1],g[D+2],g[D+3],g[D+4],g[D+5],u,h),v(g[Z],g[Z+1],g[Z+2],g[Z+3],g[Z+4],g[Z+5],u,h),v(N[Z],N[Z+1],N[Z+2],N[Z+3],N[Z+4],N[Z+5],u,h)),Y<M-1&&(v(g[D],g[D+1],g[D+2],g[D+3],g[D+4],g[D+5],u,h),v(N[Z],N[Z+1],N[Z+2],N[Z+3],N[Z+4],N[Z+5],u,h),v(N[D],N[D+1],N[D+2],N[D+3],N[D+4],N[D+5],u,h))}const k=g;g=N,N=k}},f.count=()=>a/3,f.geometryInSteps=async(l=Rt)=>{const c=new K.BufferGeometry,A=(h,L)=>h.length===a*L?h:h.subarray(0,a*L),S=A(s,3);c.setAttribute("position",new K.BufferAttribute(S,3)),c.setAttribute("normal",new K.BufferAttribute(A(n,3),3)),c.setAttribute("aC",new K.BufferAttribute(A(r,3),3)),c.setAttribute("aK",new K.BufferAttribute(A(i,1),1)),c.setAttribute("aF",new K.BufferAttribute(A(m,1),1)),p&&c.setAttribute("aS",new K.BufferAttribute(A(p,4),4));const u=new Float64Array([1/0,1/0,1/0,-1/0,-1/0,-1/0]);for(let h=0;h<S.length;h+=Ao)await l(.6),ra(S,h,Math.min(S.length,h+Ao),u);return S.length?c.boundingSphere=new K.Sphere(new K.Vector3((u[0]+u[3])/2,(u[1]+u[4])/2,(u[2]+u[5])/2),Math.hypot(u[3]-u[0],u[4]-u[1],u[5]-u[2])/2):c.boundingSphere=new K.Sphere(new K.Vector3,0),c},f}const Te=(t,o,a,s,n,r,i)=>{const m=[0,(s+n)/2,0];t.quad([-o,s,a],[o,s,a],[o,n,a],[-o,n,a],r,i,m),t.quad([-o,s,-a],[o,s,-a],[o,n,-a],[-o,n,-a],r,i,m),t.quad([o,s,-a],[o,s,a],[o,n,a],[o,n,-a],r,i,m),t.quad([-o,s,-a],[-o,s,a],[-o,n,a],[-o,n,-a],r,i,m)},xe=(t,o,a,s,n,r,i,m,p=1)=>{const d=[0,r-p,0];t.quad([-o,r,a],[o,r,a],[s,r,n],[-s,r,n],i,m,d),t.quad([-o,r,-a],[o,r,-a],[s,r,-n],[-s,r,-n],i,m,d),t.quad([o,r,-a],[o,r,a],[s,r,n],[s,r,-n],i,m,d),t.quad([-o,r,-a],[-o,r,a],[-s,r,n],[-s,r,-n],i,m,d)},ia=(()=>{const t=[];for(const o of[1,-1])for(let a=0;a<e.COL_N_LONG;a++)t.push([-be+a*e.COL_STEP,o*ve,0,o]);for(const o of[1,-1])for(let a=1;a<e.COL_N_SHORT-1;a++)t.push([o*be,-ve+a*e.COL_STEP,o,0]);return t})(),rt=t=>[e.ROOF_FOOT_HX-e.ROOF_MARGIN-t*(e.ROOF_FOOT_HX-e.ROOF_MARGIN-e.ROOF_TOP_HX)/(e.ROOF_STEPS-1),e.ROOF_FOOT_HZ-e.ROOF_MARGIN-t*(e.ROOF_FOOT_HZ-e.ROOF_MARGIN-e.ROOF_TOP_HZ)/(e.ROOF_STEPS-1)];function la(t){const o=e.T,a=y.marble,s=y.blue;Te(t,e.FOOT_HX,e.FOOT_HZ,o-.3,o+e.SHELF1_Y-e.BLUE_COURSE,a,1),Te(t,e.FOOT_HX,e.FOOT_HZ,o+e.SHELF1_Y-e.BLUE_COURSE,o+e.SHELF1_Y,s,2),xe(t,e.FOOT_HX,e.FOOT_HZ,re[0],re[1],o+e.SHELF1_Y,y.marbleB,1),Te(t,re[0],re[1],o+e.SHELF1_Y,o+e.SHELF1_Y+e.BLUE1_H,s,2),Te(t,re[0],re[1],o+e.SHELF1_Y+e.BLUE1_H,o+e.SHELF2_Y,a,1),xe(t,re[0],re[1],te[0],te[1],o+e.SHELF2_Y,y.marbleB,1),Te(t,te[0],te[1],o+e.SHELF2_Y,o+e.SHELF2_Y+e.BLUE2_H,s,2),Te(t,te[0],te[1],o+e.SHELF2_Y+e.BLUE2_H,o+e.FRIEZE_Y0,a,1),Te(t,te[0]+.04,te[1]+.04,o+e.FRIEZE_Y0,o+e.FRIEZE_Y1,y.paintBlue,10),Te(t,te[0]+.12,te[1]+.12,o+e.FRIEZE_Y1,Oe,a,9),xe(t,te[0]+.12,te[1]+.12,te[0],te[1],o+e.FRIEZE_Y1,a,9,-1),xe(t,te[0]+.12,te[1]+.12,Je,et,Oe,y.marbleB,1)}async function ha(t,o){const a=Se-e.ENTAB_H,s=y.marble;Te(t,Je,et,Oe,a,s,1),xe(t,be+.55,ve+.55,Je,et,a-.02,s,11,-1);const n=vt,r=e.ROOF_FOOT_HX-be,i=e.ROOF_FOOT_HZ-ve;let m=a;const p=(_,b,E,F)=>{const v=be+_*r,O=ve+_*i;return Te(t,v,O,m,m+b,E,F),m+=b,[v,O]},d=(_,b,E)=>xe(t,b[0],b[1],_[0],_[1],E,y.marbleB,9,-1),f=p(.36,n.arch*.5,s,9),w=p(.4,n.arch*.5,s,9);d(f,w,m-n.arch*.5),xe(t,f[0],f[1],be-.55,ve-.55,a,y.marbleB,9,-1),Te(t,be-.55,ve-.55,a,a+n.arch,s,9);const H=p(.46,n.dentil,y.marbleB,9);d(w,H,m-n.dentil);const I=p(.56,n.leaf*.7,y.paintBlue,9);p(.58,n.leaf*.3,y.red,9),d(H,I,m-n.leaf);const P=p(.9,n.cornice,s,9);d(I,P,m-n.cornice);const W=p(1,n.sima,s,9);d(P,W,m-n.sima),await o(1.5);{const _=a+n.arch,b=H[0],E=H[1];for(let F=-b+.07;F<b-.2;F+=.34)for(const v of[-1,1])t.box(F,_+.05,v>0?E:-E-.07,F+.2,_+n.dentil-.05,v>0?E+.07:-E,s,9);for(let F=-E+.07;F<E-.2;F+=.34)for(const v of[-1,1])t.box(v>0?b:-b-.07,_+.05,F,v>0?b+.07:-b,_+n.dentil-.05,F+.2,s,9)}await o(5);{const _=Se-n.sima*.5,b=W[0],E=W[1],F=Math.floor(b/e.SPOUT_STEP),v=Math.floor((E-.3)/e.SPOUT_STEP);for(let O=-F;O<=F;O++)for(const x of[-1,1]){const l=O*e.SPOUT_STEP,c=x*(E+.05);t.lump([l,_,c],.13,.14,.11,y.marbleB,9,7,4),t.lump([l,_-.04,c+x*.1],.07,.07,.08,y.marbleB,9,5,3)}await o(2);for(let O=-v;O<=v;O++)for(const x of[-1,1]){const l=O*e.SPOUT_STEP,c=x*(b+.05);t.lump([c,_,l],.11,.14,.13,y.marbleB,9,7,4),t.lump([c+x*.1,_-.04,l],.08,.07,.07,y.marbleB,9,5,3)}}const R=rt(0);xe(t,e.ROOF_FOOT_HX,e.ROOF_FOOT_HZ,R[0],R[1],Se,y.marbleB,1)}function ca(t){const o=e.ROOF_STEPS,a=e.ROOF_STEP_H;for(let n=0;n<o;n++){const r=rt(n),i=Se+n*a;if(Te(t,r[0],r[1],i,i+a,y.marble,9),n<o-1){const m=rt(n+1);xe(t,r[0],r[1],m[0],m[1],i+a,y.marbleB,9)}}const s=rt(o-1);t.quad([-s[0],Ae,-s[1]],[s[0],Ae,-s[1]],[s[0],Ae,s[1]],[-s[0],Ae,s[1]],y.marbleB,9,[0,Ae-1,0]),Te(t,e.PED_HX,e.PED_HZ,Ae,Ae+.3,y.marbleB,9),Te(t,e.PED_HX-.1,e.PED_HZ-.1,Ae+.3,we-.28,y.marble,1),xe(t,e.PED_HX,e.PED_HZ,e.PED_HX-.1,e.PED_HZ-.1,Ae+.3,y.marbleB,9),Te(t,e.PED_HX,e.PED_HZ,we-.28,we,y.marbleB,9),xe(t,e.PED_HX,e.PED_HZ,e.PED_HX-.1,e.PED_HZ-.1,we-.28,y.marbleB,9,-1),t.quad([-e.PED_HX,we,-e.PED_HZ],[e.PED_HX,we,-e.PED_HZ],[e.PED_HX,we,e.PED_HZ],[-e.PED_HX,we,e.PED_HZ],y.marbleB,9,[0,we-1,0])}async function fa(t,o){const a=y.marble;let s=0;for(const[n,r,i,m]of ia){await o(.5);const p=Oe,d=-m,f=i;t.box(n-.66,p,r-.66,n+.66,p+e.PLINTH_H,r+.66,y.blue,2),t.spine([[n,p+.35,r],[n,p+.47,r],[n,p+.56,r],[n,p+.68,r],[n,p+.8,r]],[.64,.66,.55,.6,.5],a,9,{seg:14,up:[1,0,0]}),t.spine([[n,p+.8,r],[n,p+4.6,r],[n,p+8.75,r]],[e.COL_D/2,.485,.43],a,15,{seg:14,up:[1,0,0]}),t.spine([[n,p+8.75,r],[n,p+8.9,r],[n,p+9.02,r]],[.43,.5,.58],a,9,{seg:14,up:[1,0,0]});const w=p+9.16;t.spine([[n-d*.62,w+.12,r-f*.62],[n+d*.62,w+.12,r+f*.62]],[[.5,.11],[.5,.11]],a,9,{seg:8,cap0:!0,cap1:!0});for(const H of[-1,1]){const I=n+d*.57*H,P=r+f*.57*H;t.spine([[I-i*.52,w,P-m*.52],[I+i*.52,w,P+m*.52]],[.27,.27],a,9,{seg:10,cap0:!0,cap1:!0});for(const W of[-1,1])t.lump([I+i*.53*W,w,P+m*.53*W],.07,.07,.07,y.red,9,6,3)}t.box(n-.62,p+9.4,r-.62,n+.62,p+e.COL_H,r+.62,y.marbleB,9)}}const da=[[e.TER_X0-5,e.TER_Z0-4,e.TER_X1+4,e.TER_Z1+5],[e.TER_X1-2,e.SQUARE_Z0-2,e.SQUARE_X1+2,e.SQUARE_Z1+2],[e.MARKET_X0-3,e.MARKET_Z0-2,e.MARKET_X1+3,240],[-460,e.STREET_Z0-2,460,e.STREET_Z1+2],[e.CLIMB_X-e.CLIMB_W/2,e.SQUARE_Z1-2,e.CLIMB_X+e.CLIMB_W/2,e.MARKET_Z0+2],[44.5+.01,120+.01,55.5-.01,129-.01],[e.TEMPLE_AT[0]-40,e.TEMPLE_AT[2]-30,e.TEMPLE_AT[0]+40,e.TEMPLE_AT[2]+30],[e.THEATRE_AT[0]-62,e.THEATRE_AT[2]-62,e.THEATRE_AT[0]+62,e.THEATRE_AT[2]+50]],bo=22,ge={w:bo,d:18,lane:3};function vo(t){const o=pe(ue("mausoleum-houses:"+t)),a=[],s=(d,f,w,H)=>da.some(I=>w>I[0]&&d<I[2]&&H>I[1]&&f<I[3]),n=ge.w+ge.lane,r=ge.d+ge.lane,i=e.CLIMB_X+e.CLIMB_W/2,m=e.CLIMB_X-e.CLIMB_W/2-ge.w;return{out:a,row:d=>{for(let f=-18;f<=16;f++){const w=f>=0?i+f*n:m+(f+1)*n,H=e.SQUARE_Z1+d*r,I=w+ge.w,P=H+ge.d;for(let W=0;W<4;W++){const R=W%2?w+ge.w/2:w,_=W>1?H+ge.d/2:H,b=R+ge.w/2,E=_+ge.d/2,F=o()<.2?1:2,v=F===1?o.range(3.3,4.1):o.range(5.6,7.4),O=o()<.42,x=o(),l=o(),c=o()<.38,A=o()<.5,S=o()<.3,u=o.range(0,.7),h=o.range(0,.7),L=o()<.07,M=(R+b)/2,C=(_+E)/2,g=st(M,C);if(L||g<19||g>330||M<-345||M>440||s(R,_,b,E))continue;const N=[$e(R,_),$e(b,_),$e(R,E),$e(b,E)],Y=Math.min(...N),k=Math.max(...N);if(k-Y>5)continue;const B=(b===e.CLIMB_X-e.CLIMB_W/2||R===i)&&E>e.SQUARE_Z1&&_<e.MARKET_Z0,D=B?2.9+.4*x:v,Z=W%2?1:-1,U=W>1?1:-1;a.push({x0:R-(Z<0&&!B?-u:0),z0:_-(U<0?-h:0),x1:b-(Z>0&&!B?u:0),z1:E-(U>0?h:0),yb:Y-.4,yt:(Y+k)/2+D,storeys:B?1:F,tiled:O&&!B,tone:x,warm:l,court:c&&!B,ridge:A,room:S,ox:Z,oz:U,onClimb:B,rho:g})}}}}}function xo(t){const o=vo(t);for(let a=-16;a<=10;a++)o.row(a);return o.out}function We(t){const o=t.length,a=[0];for(let r=0;r<o;r++){const i=t[r],m=t[(r+1)%o];a.push(a[r]+Math.hypot(m[0]-i[0],m[1]-i[1]))}const s=a[o];return{length:s,at:r=>{const i=(r%1+1)%1*s;let m=0;for(;m<o-1&&a[m+1]<i;)m++;const p=t[m],d=t[(m+1)%o],f=(i-a[m])/Math.max(1e-6,a[m+1]-a[m]),w=t[(m+2)%o],H=f*f*(3-2*f),I=Math.atan2(d[0]-p[0],d[1]-p[1]);let P=Math.atan2(w[0]-d[0],w[1]-d[1]);for(;P-I>Math.PI;)P-=2*Math.PI;for(;P-I<-Math.PI;)P+=2*Math.PI;return[p[0]+(d[0]-p[0])*f,p[1]+(d[1]-p[1])*f,I+(P-I)*Math.max(0,H*2-1)]},pts:t}}const ma=(t,o,a,s,n=48)=>{const r=[];for(let i=0;i<n;i++){const m=i/n*6.2831853;r.push([t+a*Math.cos(m),o+s*Math.sin(m)])}return r},pt=(t,o,a,s,n=1.2)=>{const r=a-t,i=s-o,m=Math.hypot(r,i),p=-i/m*n/2,d=r/m*n/2,f=[];for(let w=0;w<=6;w++)f.push([t+r*w/6+p,o+i*w/6+d]);for(let w=6;w>=0;w--)f.push([t+r*w/6-p,o+i*w/6-d]);return f},Ft=18,ye=17,yt=Ft/2+.6*ye,ua=10,It=5,Mt=(()=>{const t=s=>e.QUAY_Z+1.5*ye*(s+1),o=e.CLIMB_X-yt,a=e.CLIMB_X-Ft/2-It;return[[o,t(0),.6*ye,"berth"],[a,t(1),It,"mooring"],[o,t(2),.6*ye,"berth"],[a,t(3),It,"mooring"]]})(),pa=13.2,Be=(()=>{const o=e.WARSHIP_LANE_X,a=7.6,s=Math.hypot(60+a,pa);let n=e.QUAY_Z+e.WARSHIP_L+60;for(const[r,i,m]of Mt){const p=s+ua+m,d=r-(o-60);Math.abs(d)<p&&(n=Math.max(n,i+Math.sqrt(p*p-d*d)))}return{lane:o,r:60,zn:n,zs:eo-e.WARSHIP_L-60,speed:2.9,half:e.WARSHIP_L/2,reach:a,sweep:s}})();function _a(){const t=Be,o=t.lane-t.r,a=[],s=6,n=(i,m)=>{const p=Math.round(Math.PI*t.r/s);for(let d=0;d<p;d++){const f=m+Math.PI*d/p;a.push([o+t.r*Math.cos(f),i+t.r*Math.sin(f)])}},r=Math.round((t.zs-t.zn)/s);for(let i=0;i<r;i++)a.push([t.lane,q(t.zn,t.zs,i/r)]);n(t.zs,0);for(let i=0;i<r;i++)a.push([t.lane-2*t.r,q(t.zs,t.zn,i/r)]);return n(t.zn,Math.PI),a}const cs=[.7071,-.7071],_t=Math.atan2(-.7071,.7071),Ea={x0:He[0]-20,x1:He[0]+20,z0:He[2]-15,z1:He[2]+60},me=(()=>{const t=3*ye,o=Ft/2+1.5*ye,a=[],s=[],n=e.QUAY_Z+t,r=Be.zs;for(let d=n;d<=r;d+=t)for(const f of[0,1])a.push([e.CLIMB_X+o+f*t,d,f]);const i=Be.lane-Be.reach-1.5*ye;for(let d=Be.zn;d<=r;d+=t)for(const f of[0,1])a.push([i-f*t,d,f]);const m=d=>e.QUAY_Z+1.5*ye+d*t,p=[[e.CLIMB_X+yt,m(1),1],[e.CLIMB_X+yt,m(2),1],...Mt.filter(d=>d[3]==="berth").map(d=>[d[0],d[1],-1])];for(const d of Mt)d[3]==="mooring"&&d[1]<=Ea.z0-10&&s.push([d[0],d[1]]);return{berths:a,boats:s,lighter:p,scope:22,swing:.2,nearSwing:.03,boatScope:5,boatSwing:.25,take:[.85,.4],takeNear:.7}})(),Ta=[{name:"a sailing boat off the east shore",at:[292,338,62,24],speed:1.7,sail:!0},{name:"a boat off the palace horn",at:[336,442,80,30],speed:1.4,sail:!0},{name:"a lighter between the anchorage and the east quay",at:[270,246,22,10],speed:1.2,sail:!1},{name:"a fishing boat under sail inside the mouth",at:[190,420,40,18],speed:1.9,sail:!0},{name:"a rowing boat along the west shore",at:[-130,330,40,62],speed:1.3,sail:!1},{name:"the ferry to the spring's headland",at:[-150,440,70,16],speed:1.6,sail:!0},{name:"a boat under sail standing across the head of the bay, east of the fairway",at:[e.CLIMB_X+55,e.QUAY_Z+25,38,7],speed:1.8,sail:!0}],Qe=[82,58,34,10,138,162,186],Et=(e.STREET_Z0+e.STREET_Z1)/2-1,go=-400,Oo=205;function Pt(t,o,a,s,n,r,i,m=2){const p=[],d=(w,H,I,P)=>{const W=Math.max(1,Math.round(Math.hypot(I-w,P-H)/m));for(let R=0;R<W;R++)p.push([q(w,I,R/W),0,q(H,P,R/W)])},f=(w,H,I)=>{const P=Math.max(3,Math.round(n*Math.PI/2/m));for(let W=0;W<P;W++){const R=I+W/P*Math.PI/2;p.push([w+n*Math.cos(R),0,H+n*Math.sin(R)])}};return d(t-a,o-s-n,t+a,o-s-n),f(t+a,o-s,-Math.PI/2),d(t+a+n,o-s,t+a+n,o+s),f(t+a,o+s,0),d(t+a,o+s+n,t-a,o+s+n),f(t-a,o+s,Math.PI/2),d(t-a-n,o+s,t-a-n,o-s),f(t-a,o-s,Math.PI),p.forEach((w,H)=>{w[1]=r+i*Math.sin(H/p.length*4*Math.PI)}),p}const Nt=(e.CYPRESS_X1-e.CYPRESS_X0)/2,Ro=e.TER_Z1-(e.CYPRESS_Z-qt),Lo=(t,o,a)=>({name:t,keep:a,species:"swifts",size:Vt,speed:jt,bird:.57*Vt*1.12,n:14,loop:Pt(o,e.TER_Z1,Nt/2-Ro,0,Ro,e.TER_WALL_TOP+2,.8),spread:[1.2,.8,30],wander:[.6,.5,.6,.5]}),wa=[{name:"gulls about the hulls at the west quay",species:"gulls",size:1,bird:1.32*1*1.12,n:12,center:[Qe[1]-12,13,e.QUAY_Z+17],radius:22,wobble:.15,height:3,spread:[5,3,10],wander:[2,1.5,2,.2]},{name:"gulls about the hulls at the east quay",species:"gulls",size:1,bird:1.32*1*1.12,n:10,center:[Qe[5]+6,14,e.QUAY_Z+19],radius:22,wobble:.15,height:3,spread:[5,3,10],wander:[2,1.5,2,.2]},{name:"pigeons wheeling round the tomb",species:"crows",pigeon:!0,size:.62,bird:1*.62*1.12,n:24,loop:Pt(0,0,e.ROOF_FOOT_HX,e.ROOF_FOOT_HZ,Xo,Oe+e.COL_H/2,1.2),spread:[1.6,1.2,40],wander:[.6,.5,.6,.3],keep:["stairFoot","end"]},Lo("swifts along the cypress row and over the south wall (east half)",e.CYPRESS_X1-Nt/2,["stairHead","lastLine"]),Lo("swifts along the cypress row and over the south wall (west half)",e.CYPRESS_X0+Nt/2,null)],Aa=t=>({h:2.5*.45*t.spread[0]+1.5*Math.max(t.wander[0],t.wander[2])+t.bird,v:2.5*.45*t.spread[1]+1.5*t.wander[1]+t.bird}),Sa=t=>({r:t.radius*(1+t.wobble)*1.12,rise:1.2*t.height});function fs(t,o){const a=Aa(t),s=t.loop?null:Sa(t);let n=1e9,r=0;for(let i=0;i<o.length;i++){const m=o[i];let p=1e9;if(t.loop)for(const d of t.loop){const f=Math.max(0,Math.hypot(m[0]-d[0],m[2]-d[2])-a.h-1),w=Math.max(0,Math.abs(m[1]-d[1])-a.v);p=Math.min(p,Math.hypot(f,w))}else p=Math.hypot(Math.max(0,Math.hypot(m[0]-t.center[0],m[2]-t.center[2])-s.r-a.h),Math.max(0,Math.abs(m[1]-t.center[1])-s.rise-a.v));p<n&&(n=p,r=i)}return[n,r]}const ds=10,ba=[-50,-36,46,34],Ho=(()=>{const t=e.PALACE_AT[2]+ba[1];let o=at,a=e.PALACE_AT[0];for(let s=0;s<30;s++){const n=(o+a)/2;st(n,t)<0?o=n:a=n}return[o-e.WARSHIP_L,t]})(),va=[[196,118],[22,128],[-58,122],[214,36],[262,150],[-150,104],[158,100],[40,160],[182,168],[-20,140],[240,80],[60,-90]],xa=[{name:"the market with the quay's landing",r:[e.MARKET_X0,e.MARKET_Z0,e.MARKET_X1,e.QUAY_Z]},{name:"the climbing street",r:[e.CLIMB_X-e.CLIMB_W/2,e.SQUARE_Z1,e.CLIMB_X+e.CLIMB_W/2,e.MARKET_Z0]},{name:"the upper square with the stair's foot",r:[e.SQUARE_X0,e.SQUARE_Z0,e.SQUARE_X1,e.SQUARE_Z1]},{name:"the terrace",r:[e.TER_X0,e.TER_Z0,e.TER_X1,e.TER_Z1]}],ms=(t,o,a=!1)=>{let s=1e9;for(let n=0;n<(a?3:4);n++){const r=xa[n].r;s=Math.min(s,Math.hypot(Math.max(r[0]-t,0,t-r[2]),Math.max(r[1]-o,0,o-r[3])))}return s},us={NEAR:45,FAR:150},Fo=[{name:"the cart way through the market",wide:3,keep:20,line:[[e.CLIMB_X,e.QUAY_Z],[e.CLIMB_X,e.MARKET_Z0]]},{name:"the climbing street with the upper square",wide:e.CLIMB_W,keep:20,line:[[e.CLIMB_X,e.MARKET_Z0],[e.CLIMB_X,e.SQUARE_Z1],[e.STAIR_X_FOOT,e.GATE_Z]]},{name:"the stair's approach",wide:2*e.STAIR_HALF,keep:20,line:[[e.STAIR_X_FOOT,e.GATE_Z],[e.WING_X0,e.GATE_Z]]},{name:"the gate's axis over the terrace",wide:2*e.GATE_HALF,keep:20,line:(()=>{const t=Ge,o=[[e.WING_X0,e.GATE_Z],[t.xs,e.GATE_Z]];for(let a=1;a<=4;a++){const s=-Math.PI/2-t.th*a/4;o.push([t.xs+t.bear*Math.cos(s),e.GATE_Z+t.bear+t.bear*Math.sin(s)])}for(let a=1;a<=8;a++){const s=q(Math.PI/2-t.th,Math.PI,a/8);o.push([t.cx+t.r*Math.cos(s),t.cz+t.r*Math.sin(s)])}return o})()}];function yo(t,o,a){let s=1e9;for(let n=0;n+1<t.line.length;n++){const r=t.line[n],i=t.line[n+1],m=i[0]-r[0],p=i[1]-r[1],d=Xe(((o-r[0])*m+(a-r[1])*p)/(m*m+p*p),0,1);s=Math.min(s,Math.hypot(o-r[0]-m*d,a-r[1]-p*d))}return s}function ga(t,o){let a=[1e9,0];return Fo.forEach((s,n)=>{const r=yo(s,t,o);r<a[0]&&(a=[r,n])}),a}const ps=(t,o)=>ga(t,o)[0],Wt=(t,o)=>Fo.every(a=>yo(a,t,o)>=a.keep),Q=t=>82-25*t,he=t=>138+25*t,z=t=>109.5+21*t,ie={PER:140,STREET:6,CORNER:.22,STOA:.6,QUAYSIDE_KEPT:.5,PAIR:.3,ROOFS:.062,FULL:45,STALLS:.85,PORTER_REACH:40,SQUARE_KEPT:.5,LOADED:.2,DECK_Y:1.15,SIZE:[.944,1.029],QUAYSIDE:[22,34,46,58,162,174,186,198],TERRACE:{ROUND:2,BEFORE_KEPT:.6,ROW_KEPT:.4,MOST:17,BEFORE:[[e.FOOT_HX+11,-2.5,-Math.PI/2],[7,e.FOOT_HZ+11.5,Math.PI],[-9,e.FOOT_HZ+14,Math.PI],[-e.FOOT_HX-11,3,Math.PI/2],[4,-e.FOOT_HZ-11,0]]},LANES:[["lane-w1",Q(1),105,Q(1),138],["lane-w2",Q(2),105,Q(2),205],["lane-w3",Q(3),105,Q(3),205],["lane-w4",Q(4),105,Q(4),190],["cross-w0",-60,z(0),Q(1),z(0)],["cross-w1",-60,z(1),50,z(1)],["cross-w2",-60,z(2),50,z(2)],["cross-w3",-60,z(3),50,z(3)],["lane-e1",he(1),30,he(1),138],["lane-e2",he(2),30,he(2),205],["lane-e3",he(3),30,he(3),205],["cross-e0",162,z(0),260,z(0)],["cross-e1",162,z(1),260,z(1)],["cross-e-1",162,z(-1),260,z(-1)],["cross-e-2",162,z(-2),260,z(-2)],["cross-e-3",162,z(-3),260,z(-3)],["lane-n1",Q(1),-120,Q(1),-50],["lane-n3",Q(3),-120,Q(3),-50],["lane-n5",Q(5),-120,Q(5),-50],["cross-n",-100,z(-9),100,z(-9)]],CORNERS:[[Q(0),z(0)],[Q(0),z(1)],[he(0),z(0)],[he(0),z(1)],[Q(1),z(0)],[Q(2),z(0)],[Q(3),z(0)],[Q(4),z(0)],[Q(2),z(1)],[Q(3),z(1)],[Q(4),z(1)],[Q(2),z(2)],[Q(3),z(2)],[Q(4),z(2)],[Q(2),z(3)],[Q(3),z(3)],[he(1),z(0)],[he(2),z(0)],[he(3),z(0)],[he(2),z(1)],[he(3),z(1)],[he(1),z(-1)],[he(2),z(-1)],[he(2),z(-2)],[he(3),z(-2)],[he(2),z(-3)]],DOORS:[0,1].flatMap(t=>[-1,1].map(o=>[e.CLIMB_X+o*(e.CLIMB_W/2+bo*.75),z(t),o]))};function Oa(){const t=[];for(const[o,a]of[[e.MARKET_X0+2.3,1],[e.MARKET_X1-2.3,-1]])for(let s=e.MARKET_Z0+12;s<=e.QUAY_Z-14;s+=9.6)t.push({x:o,z:s,nx:a});return t}const Ra={x0:44.5,z0:120,x1:55.5,z1:129,x:50,z:121.6};function Ct(t,o){const a={x0:t+o*5,z0:e.QUAY_Z},s=r=>de(a,500+r),n=Math.floor(s(0)*5);return{hs:s,kind:n,x:t+o*5.2-2+(s(1)-.5)*1.5,z:e.QUAY_Z-7.4+s(2)*.3,none:n===4&&s(4)>=.6}}const La=t=>t.x+(t.flip?-3.4:3.4);function Io(t,o={},a=null){const s=Go(t,o),n=s.density,r={deal:s};{const i=pe(ue("mausoleum-warship:"+t));r.warship={round:We(_a()),speed:Be.speed,start:i(),stroke:.48,strokeStart:i()}}{const i=pe(ue("mausoleum-anchored:"+t));r.anchored=[];const m=me.berths.map(d=>{const f=i(),w=i()*6.28,H=i.range(38,54),I=i(),P=i()<.5,W=_t+i.range(-.1,.1),R=i()<.5,_=i()<.45;return{lot:f,file:d[2],bx:d[0],bz:d[1],ax:d[0]+Math.sin(W)*me.scope,az:d[1]+Math.cos(W)*me.scope,yaw0:W,swing:me.swing,scope:me.scope,ph:w,per:H,tone:I,drying:P,awning:R,skiff:_}}),p=Math.min(...m.filter(d=>d.file===0&&d.bx>e.CLIMB_X).map(d=>d.lot));r.anchored=m.filter(d=>d.lot<me.take[d.file]||d.lot===p&&d.file===0&&d.bx>e.CLIMB_X)}{const i=pe(ue("mausoleum-lightering:"+t)),m=me.lighter.map(p=>{const d=i(),f=i()*6.28,w=i.range(38,54),H=i(),I=_t+i.range(-.08,.08),P=i()<.5;return{lot:d,file:2,hand:p[2],near:!0,bx:p[0],bz:p[1],ax:p[0]+Math.sin(I)*me.scope,az:p[1]+Math.cos(I)*me.scope,yaw0:I,swing:me.nearSwing,scope:me.scope,ph:f,per:w,tone:H,drying:!0,awning:P,skiff:!1}});for(const p of[1,-1]){const d=m.filter(w=>w.hand===p),f=Math.min(...d.map(w=>w.lot));for(const w of d)(w.lot===f||w.lot<me.takeNear)&&r.anchored.push(w)}}{const i=pe(ue("mausoleum-moorings:"+t));r.smallMoored=me.boats.map(m=>{const p=i(),d=_t+i.range(-.15,.15),f=i()*6.28,w=i.range(14,24),H=i(),I=i()<.5;return{lot:p,mx:m[0]+Math.sin(d)*me.boatScope,mz:m[1]+Math.cos(d)*me.boatScope,yaw0:d,swing:me.boatSwing,scope:me.boatScope,ph:f,per:w,tone:H,nets:I}}).filter(m=>m.lot<.7)}{const i=pe(ue("mausoleum-moored:"+t));r.moored=[],Qe.forEach(m=>{const p=i()<.72,d=i()*6.28,f=i(),w=i()<.5;p&&r.moored.push({x:m,z:e.QUAY_Z+4.4,ph:d,tone:f,flip:w})})}{const i=pe(ue("mausoleum-boats:"+t));r.boats=Ta.map(m=>({name:m.name,round:We(ma(m.at[0],m.at[1],m.at[2],m.at[3],40)),speed:m.speed,start:i(),sail:m.sail}))}r.second=s.rare?{x:Ho[0],z:Ho[1],yaw:_t}:null;{const i=[],m=[],p=q(.92,1.08,(n-.7)/.6),d=_=>Math.max(1,Math.round(_*p)),f=(_,b)=>{const E=new Array(b);for(let F=0;F<b;F++)E[F]=_();return E},w=_=>q(ie.SIZE[0],ie.SIZE[1],_),H=_=>pe(ue("mausoleum-people-"+_+":"+t)),I=(_,b)=>_>=ie.LOADED?0:b?_<ie.LOADED/2?2:1:_<ie.LOADED/2?3:4,P=(_,b,E,F,v={})=>{const O=H(_);for(let x=0;x<F;x++){const l=f(O,8),c={round:b,speed:q(v.slow?.6:.9,v.slow?.9:1.4,l[0]),start:l[1],kind:0,tint:l[2],size:w(l[3]),beat:_,load:v.unladen?0:I(l[7],l[2]<.4)};b.pts.every(A=>Wt(A[0],A[1]))&&(i.push(c),l[4]<ie.PAIR&&i.push({...c,round:E,tint:l[5],size:w(l[6]),load:0}))}},W=(_,b,E,F,v,O)=>P(_,We(pt(b,E,F,v,1)),We(pt(b,E,F,v,2.1)),O);W("market-west",oe.AISLE[0],e.MARKET_Z0+9,oe.AISLE[0],e.QUAY_Z-9,d(5)),W("market-east",oe.AISLE[1],e.MARKET_Z0+9,oe.AISLE[1],e.QUAY_Z-9,d(5)),W("quay-west",10,e.QUAY_Z-4,66,e.QUAY_Z-4,d(4)),W("quay-east",154,e.QUAY_Z-4,204,e.QUAY_Z-4,d(4)),W("street",go,Et,Oo,Et,d(ie.STREET));for(const _ of ie.LANES)W(_[0],_[1],_[2],_[3],_[4],d(Math.hypot(_[3]-_[1],_[4]-_[2])/ie.PER));W("lane-w0",Q(0),100,Q(0),136,1),W("lane-e0",he(0),100,he(0),136,1),W("square-north",e.SQUARE_X0+6,e.SQUARE_Z0+3.6,e.SQUARE_X1-6,e.SQUARE_Z0+3.6,1),W("square-east",e.SQUARE_X1-3.6,e.SQUARE_Z0+6,e.SQUARE_X1-3.6,e.GATE_Z,1);{const _=H("train"),b=We(pt(go,Et-2.5,Oo,Et-2.5,2.4)),E=_();for(let F=0;F<7;F++)i.push({round:b,speed:1,start:E-F*3.1/b.length,kind:F===0||F===6?0:1,tint:_(),size:1,train:!0,beat:"train",load:0})}const R=(_,b,E,F,v,O,x={})=>Wt(b,E)?(m.push({kind:_,x:b,z:E,yaw:F,tint:v,size:w(O),y:x.y??null,woman:x.woman??v<.4,roof:x.roof||null,load:x.load||0,reach:x.reach||0}),!0):!1;{const _=H("stoa");for(const b of Oa()){const E=f(_,12);if(E[0]>=ie.STOA)continue;const F=1+(E[1]<.45?1:0),v=q(-.5,.5,E[2]);R("seller",b.x-b.nx*1,b.z+v*.4,Math.atan2(b.nx,0),E[3],E[4]);for(let O=0;O<F;O++)R("buyer",b.x+b.nx*(1.15+.25*(O%2)),b.z+v+(O-(F-1)/2)*.75,Math.atan2(-b.nx,0),E[5+O*2],E[6+O*2],{load:O===0?I(E[9],E[5]<.4):0});E[10]<.4&&R("buyer",b.x+b.nx*2.9,b.z+3.2,Math.atan2(-b.nx,.6),E[11],E[9])}}{const _=H("quayside");for(const b of ie.QUAYSIDE){const E=f(_,6),F=q(-2,2,E[1]);E[0]>=ie.QUAYSIDE_KEPT||(R("quayside",b+F-.4,e.QUAY_Z-1.9,1.2,E[2],E[3]),R("quayside",b+F+.4,e.QUAY_Z-2,-1.2,E[4],E[5]))}}{const _=H("decks");for(const b of Qe){const E=f(_,10),F=r.moored.find(O=>O.x===b);if(!F||Math.abs(b-e.CLIMB_X)<50)continue;const v=1+(E[0]<.5?1:0);for(let O=0;O<v;O++)R("deck",F.x+(O?1:-1)*q(1.5,5,E[1+O*4]),F.z+q(-.6,.6,E[2+O*4]),q(-3.1,3.1,E[3+O*4]),.7+.3*E[4+O*4],E[9],{y:ie.DECK_Y,woman:!1})}}for(const _ of a||xo(t)){if(_.tiled||_.onClimb||_.room||de(_,9)>ie.ROOFS)continue;const b=(_.x0+_.x1)/2,E=(_.z0+_.z1)/2;if(Math.abs(b-60)>250||E<-140)continue;const F=q(-3.1,3.1,de(_,91)),v={y:_.yt+.02,roof:[_.x0,_.z0,_.x1,_.z1]};R("roof",b-.5,E+.3,F,.39*de(_,92),de(_,93),{...v,woman:!0}),de(_,94)<.35&&R("roof",b+.5,E-.4,F+2.6,de(_,95),de(_,96),v)}{const _=H("corners");for(const b of ie.CORNERS){const E=f(_,8),F=q(3,6,E[1]),v=E[2]<.5?1:-1;E[0]>=ie.CORNER||(R("corner",b[0]+v*1.3,b[1]+F,v>0?-1.2:1.2,E[3],E[4]),R("corner",b[0]+v*1.15,b[1]+F+.75,v>0?-2:2,E[5],E[6]))}}{const _=H("crosslanes");for(const[b,E,F]of ie.DOORS){const v=f(_,8),O=v[1]<.5?-1:1;v[0]>=.6||(R("crosslane",b,E+O*.9,O>0?Math.PI:0,v[2],v[3],{load:I(v[7],v[2]<.4)}),v[4]<.6&&R("crosslane",b+.8*F,E+O*.55,O>0?Math.PI-.9*F:.9*F,v[5],v[6]))}}{const _=H("fountain"),b=f(_,16),E=3+Math.floor(b[0]*3),F=Ra;for(let v=0;v<Math.min(E,3);v++){const O=-.9+1.8*(v+b[1+v])/3,x=q(1.5,2.4,b[4+v]);R("fountain",F.x+Math.sin(O)*x,F.z+.9+Math.cos(O)*x,O+Math.PI,.39*b[7+v],b[10+v],{woman:!0})}for(let v=3;v<E;v++)R("fountain",F.x+(b[13]<.5?-2.6:2.6)+(v-3)*.8,F.z1-1-(v-3)*.2,Math.PI+(v-3?.7:-.5),.39*b[11+v],b[10+v],{woman:!0,load:1})}{const _=H("stalls");for(const b of Mo()){const E=f(_,10),F=b.turn?1.3:.95,v=q(-.3,.3,E[2]);if(E[0]>=ie.STALLS)continue;const O=E[1]<.2?0:E[1]<.62?1:2;R("stall-seller",b.x+v,b.z-F*.7-.5,0,E[3],E[4],{reach:1});for(let x=0;x<O;x++)R("stall-buyer",b.x-v+(x-(O-1)/2)*.85,b.z+F*.7+.55,Math.PI-(x-(O-1)/2)*.35,E[5+x*2],E[6+x*2],{load:x===0?I(E[9],E[5]<.4):0})}}{const _=H("porters");for(const b of Qe){if(Math.abs(b-e.CLIMB_X)>ie.PORTER_REACH)continue;const E=f(_,8),F=r.moored.find(u=>u.x===b);if(!F)continue;const v=La(F),O=F.flip?-1:1,x=[Ct(F.x,O),Ct(F.x,-O)].filter(u=>!u.none&&u.kind!==3)[0];if(!x)continue;const l=x.x+1.6,c=We(pt(v,e.QUAY_Z-1.2,l,e.QUAY_Z-4.9,.7));if(!c.pts.every(u=>Wt(u[0],u[1])))continue;const A=1+(E[0]<.6?1:0),S=q(.8,1,E[3]);for(let u=0;u<A;u++)i.push({round:c,speed:S,start:E[2]+u*.5,kind:0,tint:.4+.6*E[4+u*2],size:w(E[5+u*2]),beat:"porter",load:x.kind<2?1:3,carry:E[1]<.5?0:.5})}}{const _=H("goods");for(const b of Qe)if(!(Math.abs(b-e.CLIMB_X)>ie.PORTER_REACH))for(const E of[-1,1]){const F=f(_,6),v=Ct(b,E),O=v.x-.9;v.none||F[0]>=.5||(R("goods",O,e.QUAY_Z-4.7,Math.PI,.4+.6*F[2],F[3]),F[1]<.4&&R("goods",O-.8,e.QUAY_Z-4.35,1.9,.4+.6*F[4],F[5]))}}{const _=H("square"),b=[];for(let E=e.SQUARE_X0+10;E<=e.SQUARE_X1-10;E+=11)b.push([E,e.SQUARE_Z0+1.3,1]);for(let E=e.SQUARE_Z0+8;E<=e.GATE_Z;E+=11)b.push([e.SQUARE_X1-1.3,E,0]);for(const[E,F,v]of b){const O=f(_,12),x=O[2]*6.2832,l=q(-2,2,O[3]);if(O[0]>=ie.SQUARE_KEPT)continue;const c=O[1]<.3?1:O[1]<.8?2:3,A=E+(v?l:0),S=F+(v?0:l),u=c>1?.5:0;for(let h=0;h<c;h++){const L=x+h*6.2832/c;R("square",A+Math.sin(L)*u,S+Math.cos(L)*u,c>1?L+Math.PI:v?0:-Math.PI/2,O[5+h*2],O[6+h*2],{load:h===0?I(O[4],O[5]<.4):0})}}}{const _=ie.TERRACE,b=O=>We(Pt(0,0,e.FOOT_HX,e.FOOT_HZ,O,0,0,2).map(x=>[x[0],x[2]])),E=i.length;P("terrace-round",b(Ue),b(Ue+1.1),_.ROUND,{slow:!0,unladen:!0});let F=i.length-E;const v=(...O)=>{R("terrace",...O)&&F++};{const O=H("terrace-before");for(const[x,l,c]of _.BEFORE){const A=f(O,10),S=A[1]<.35?1:A[1]<.8?2:3,u=Math.cos(c),h=-Math.sin(c);if(!(A[0]>=_.BEFORE_KEPT||F+S>_.MOST))for(let L=0;L<S;L++)v(x+u*(L-(S-1)/2)*.8+q(-1,1,A[2])*u,l+h*(L-(S-1)/2)*.8+q(-1,1,A[2])*h+L%2*.3,c+(L-(S-1)/2)*.25,A[3+L*2],A[4+L*2])}}{const O=H("terrace-row");for(let x=e.CYPRESS_X0,l=0;x<=e.CYPRESS_X1+.01;x+=e.CYPRESS_GAP,l++){if(l%3!==1)continue;const c=f(O,6),A=c[1]<.45?2:1;c[0]>=_.ROW_KEPT||F+A>_.MOST||(v(x+1.5,e.CYPRESS_Z-.9,-.5,c[2],c[3]),A>1&&v(x+2.3,e.CYPRESS_Z-.5,-1.9,c[4],c[5]))}}}r.walkers=i,r.standers=m}r.animals=Ia(t),r.flocks=wa.map(i=>({...i,count:Math.round(i.n*n)}));{const i=pe(ue("mausoleum-smoke:"+t)),m=va.map((d,f)=>({x:d[0],z:d[1],k:f,lot:i(),ph:i()})),p=m.map(d=>d.lot).sort((d,f)=>d-f)[7];r.smokes=m.filter(d=>d.lot<Math.max(.75,p+1e-9))}return r}const de=(t,o)=>{const a=Math.sin(t.x0*12.9898+t.z0*78.233+o*37.719)*43758.5453;return a-Math.floor(a)};function _s(t){const o=(t.z1-t.z0)*.4,a=t.oz>0?t.z1-o:t.z0,s=de(t,2),n=4.2+2.2*de(t,4),r=o/2-.25;return{d:o,cz0:a,cz1:a+o,tx:t.x0+(t.x1-t.x0)*(.35+.3*de(t,3)),tz:a+o/2,kind:s,th:s<.5?n:s<.85?n+.6:n+3.5,r:Math.min(r,s<.5?1.9+de(t,5):s<.85?2.3+de(t,5):.5+(n+3.5)*.07)}}function Mo(){const t=[];let o=0;for(const a of oe.STALLS)for(const s of lo()){o++;const n={x0:a,z0:s},r=de(n,3);r<.22||t.push({x:a+(r-.5)*2,z:s+(de(n,5)-.5)*2.4,k:o,ph:r*6,turn:o%3===0,sells:de(n,7)})}return t}function Ha(){const t=[];for(const o of oe.GOODS)for(const a of lo()){const s={x0:o,z0:a},n=r=>de(s,430+r);t.push({x:o+(n(1)-.5)*1.2,z:a+(n(2)-.5)*2,kind:Math.floor(n(0)*6),hs:n,side:o<e.CLIMB_X?1:-1})}return t}const Fa=[[e.CLIMB_X-14.2,e.MARKET_Z0+1.3],[e.CLIMB_X+14.2,e.MARKET_Z0+1.3]],ya=1/9;function Ia(t){const o={rail:[],dog:null,hens:[],pigeons:[]};{const a=pe(ue("mausoleum-animals-rail:"+t)),s=ft,n=[];for(let i=0;i<3;i++){const m=a(),p=a()<.45,d=a(),f=a()*6.28,w=a.range(.9,1.5),H=a.range(-.12,.12);n.push({x:q(s.x0+.7,s.x1-.7,i/2),z:s.z-1.25,yaw:H,lot:m,donkey:p,coat:d,ph:f,rate:w})}const r=n.map(i=>i.lot).sort((i,m)=>i-m)[1];o.rail=n.filter(i=>i.lot<Math.max(.7,r+1e-9))}{const a=pe(ue("mausoleum-animals-dog:"+t)),s=Fa[a()<.5?0:1];o.dog={x:s[0]+a.range(-.6,.6),z:s[1]+a.range(0,.5),yaw:a.range(-3.1,3.1),coat:a(),ph:a()*6.28}}{const a=pe(ue("mausoleum-animals-hens:"+t)),s=Mo().find(n=>n.sells<ya);if(s){const n=4+Math.floor(a()*3);for(let r=0;r<6;r++){const i=a()*6.28,m=a.range(1.9,3.4),p=a.range(-3.1,3.1),d=a(),f=a()*6.28;r<n&&o.hens.push({x:s.x+Math.cos(i)*m,z:s.z+Math.sin(i)*m*.8+.6,yaw:p,coat:d,ph:f})}}}{const a=pe(ue("mausoleum-animals-pigeons:"+t)),s=Ha().filter(n=>n.kind===3||n.kind===2);for(const n of s.slice(0,2))for(let r=0;r<4;r++){const i=a()*6.28,m=a.range(1.6,2.8),p=a.range(-3.1,3.1),d=a()*6.28;o.pigeons.push({x:n.x+n.side*1.2+Math.cos(i)*m*.6,z:n.z+Math.sin(i)*m,yaw:p,ph:d})}}return o}const Es=1.3,Ts={height:19,radius:[.35,4.6],size:[1.3,8.5],count:12,bend:1.25,opacity:.32,lean:1,rate:.05,cycle:1/.05};function ws(t,o={}){const a=xo(t),s=Io(t,o,a);return{deal:s.deal,houses:a,life:s}}async function As(t,o,a=Rt){const s=vo(t);for(let r=-16;r<=10;r++)await a(1),s.row(r);await a(9);const n=Io(t,o,s.out);return{deal:n.deal,houses:s.out,life:n}}const V=(t,o,a,s,n={})=>t.spine(o.map(r=>[r[0],r[1],r[2]]),o.map(r=>r.length>4?[r[3],r[4]]:r[3]),a,s,n);function Po(t,o={}){const a=o.col||y.marble,s=9,n=o.headYaw||0,r=o.headDrop||0,i=o.rear||0,m=!!o.fine,p=m?16:9,d=m?9:6,f=o.fore||[0,0],w=o.hind||[0,0];i&&t.tilt(i,1,-.55),V(t,[[0,1.2,-.88,.1,.13],[0,1.24,-.78,.23,.26],[0,1.25,-.55,.29,.31],[0,1.19,-.2,.285,.3],[0,1.17,.12,.28,.305],[0,1.19,.42,.27,.33],[0,1.25,.68,.225,.31],[0,1.31,.86,.13,.2]],a,s,{seg:p,cap0:!0,cap1:!0});const H=2.03-r*.5,I=1.07+r*.12;V(t,[[0,1.3,.56,.17,.3],[0,1.52,.75,.14,.26],[0,1.74,.9,.115,.205],[0,1.93,1,.098,.165],[0,H,I,.088,.13]],a,s,{seg:m?12:8});const P=Math.cos(n),W=Math.sin(n),R=.86+r*.5,_=Math.cos(R),b=Math.sin(R),E=(c,A,S)=>{const u=H-A*b+S*_,h=A*_+S*b;return[c*P+h*W,u,I-c*W+h*P]},F=[[-.04,.098,.11],[.1,.115,.145],[.28,.088,.115],[.45,.07,.085],[.56,.066,.07],[.61,.045,.045]];t.spine(F.map(c=>E(0,c[0],0)),F.map(c=>[c[1],c[2]]),a,s,{seg:m?12:8,cap0:!0,cap1:!0});for(const c of[-1,1])t.spine([E(c*.065,-.02,.07),E(c*.08,-.06,.2)],[[.035,.022],[.008,.006]],a,s,{seg:5});V(t,[[0,1.5,.47,.03,.05],[0,1.72,.66,.04,.085],[0,1.93,.8,.042,.09],[0,2.09-r*.3,.92,.04,.08],[0,H+.1,I-.04,.03,.04]],y.marbleB,s,{seg:6,cap0:!0,cap1:!0}),V(t,[[0,1.3,-.84,.05,.05],[0,1.27,-.98,.07,.07],[0,.98,-1.07,.09,.08],[0,.58,-1.05,.075,.06],[0,.32,-1,.03,.03]],a,s,{seg:6,cap1:!0});for(let c=0;c<2;c++){const A=c?1:-1,S=f[c],u=A*.17;i?V(t,[[u,1.2,.56,.115,.15],[u,.98,.72,.085,.1],[u,.78,.98+S,.06,.065],[u,.52,.86+S,.04,.045],[u,.42,.84+S,.05,.055],[u,.33,.9+S,.06,.065]],a,s,{seg:d,cap1:!0}):V(t,[[u,1.2,.56,.125,.17],[u,.92,.57+.3*S,.098,.125],[u,.6,.585+.6*S,.068,.078],[u,.24,.56+.9*S,.05,.057],[u,.11,.57+S,.058,.066],[u,0,.6+S,.076,.086]],a,s,{seg:d,cap1:!0})}if(o.bridle){const c=y.bronze;for(const[A,S,u]of[[.3,.09,.107],[.06,.112,.13]])t.spine([E(0,A-.018,0),E(0,A+.018,0)],[[S,u],[S,u]],c,8,{seg:10});for(const A of[-1,1])t.spine([E(A*.108,.06,.02),E(A*.07,.44,-.02)],[.013,.013],c,8,{seg:4}),t.lump(E(A*.072,.45,-.03),.02,.034,.034,c,8,6,3)}o.harness&&(t.spine([[0,1.19,.4],[0,1.19,.45]],[[.279,.338],[.279,.338]],y.marbleB,s,{seg:p}),t.spine([[0,1.3,.72],[0,1.3,.77]],[[.222,.3],[.2,.275]],y.marbleB,s,{seg:p})),o.rider&&Pa(t,o.rider),t.tilt(0);const v=Math.cos(i),O=Math.sin(i),x=1+.2*v+.03*O,l=-.55+.03*v-.2*O;for(let c=0;c<2;c++){const A=c?1:-1,S=w[c],u=A*.18;i?V(t,[[u,x,l,.13,.2],[u,x-.3,l+.14,.1,.14],[u,.44,l-.16,.056,.07],[u,.13,l-.06,.045,.05],[u,0,l-.01,.066,.072]],a,s,{seg:d,cap1:!0}):V(t,[[u,1.2,-.52,.14,.22],[u,.9,-.5+.2*S,.11,.175],[u,.6,-.7+.5*S,.066,.086],[u,.24,-.62+.9*S,.05,.057],[u,.11,-.6+S,.058,.066],[u,0,-.57+S,.076,.086]],a,s,{seg:d,cap1:!0})}o.support==="pier"?t.box(-.09,0,0,.09,.92,.2,y.marbleB,s):o.support&&V(t,[[0,0,i?.25:.05,.12,.14],[0,i?1.2:.9,i?.25+.5*O:.05,.09,.11]],y.marbleB,s,{seg:8})}const Ma={down:[[.245,1.15,.02],[.225,.88,.08]],fwd:[[.245,1.2,.1],[.2,1.16,.38]],up:[[.31,1.5,-.05],[.28,1.78,.08]],chest:[[.25,1.18,.06],[.05,1.3,.17]],out:[[.33,1.3,.02],[.5,1.2,.12]]},No=(t,o,a,s=0,n=0)=>{for(const r of[-1,1]){const i=Ma[(r>0?o.armR:o.armL)||"down"];V(t,[[r*.2,1.42+s,n,.062,.062],[r*i[0][0],i[0][1]+s,i[0][2]+n,.05,.05],[r*i[1][0],i[1][1]+s,i[1][2]+n,.04,.04]],a,9,{seg:5,cap1:!0})}},Dt=(t,o,a,s,n)=>{if(t.lump([0,s,n+.012],.09,.115,.1,a,9,8,5),o.top==="cap"){const r=y.marbleB;t.lump([0,s+.045,n-.005],.1,.09,.108,r,9,8,4),t.lump([0,s+.12,n+.05],.05,.045,.06,r,9,6,3),t.lump([0,s-.05,n-.07],.085,.09,.05,r,9,6,3),t.spine([[0,s+.028,n],[0,s+.052,n]],[[.102,.111],[.102,.111]],o.accent||y.red,9,{seg:8})}else o.top==="veil"?V(t,[[0,s+.1,n+.02,.085,.07],[0,s+.03,n-.05,.125,.09],[0,s-.22,n-.1,.2,.06],[0,s-.62,n-.13,.21,.04]],o.veil||y.marbleB,9,{seg:8,cap0:!0}):t.lump([0,s+.03,n-.022],.096,.1,.098,o.hair||y.hair,9,8,4)};function Pa(t,o={}){const a=o.col||y.marble,s=o.accent||y.red;V(t,[[0,1.4,-.12,.17,.14],[0,1.72,-.1,.2,.125],[0,1.9,-.09,.19,.1],[0,1.98,-.09,.062,.06]],a,9,{seg:8,cap0:!0,cols:[a.clone().lerp(s,.5),a,a,a]});for(const n of[-1,1])V(t,[[n*.15,1.46,-.1,.1,.1],[n*.34,1.2,.2,.08,.085],[n*.345,.8,.1,.055,.06],[n*.345,.72,.2,.045,.05]],o.leg||a,9,{seg:6,cap1:!0});o.type===2&&t.spine([[0,1.6,-.105],[0,1.64,-.105]],[[.197,.137],[.199,.136]],s,9,{seg:8}),No(t,{armR:o.armR||"fwd",armL:o.armL||"fwd"},a,.47,-.09),Dt(t,o,a,2.1,-.09),o.cloak&&V(t,[[0,1.92,-.16,.18,.04],[0,1.8,-.36,.24,.05],[0,1.64,-.57,.205,.032],[0,1.62,-.6,.2,.03]],y.marbleB,9,{seg:6,cap1:!0,cols:[y.marbleB,y.marbleB,y.marbleB,s]})}function Na(t,o={}){const a=o.col||y.marble,s=9,n=o.accent||y.red,r=o.type||0,i=o.step||0,m=(p,d)=>1+(p<4?.075:.03)*Math.sin(d*5+p*1.7+(o.ph||0));if(o.noBase||t.box(-.3,-.12,-.26,.3,0,.3,y.marbleB,s),r===2){for(const p of[-1,1])V(t,[[p*.1,.94,0,.1,.11],[p*.11,.5,p*i*.5+.02,.078,.084],[p*.11,.08,p*i,.06,.066],[p*.11,0,p*i+.07,.058,.1]],o.leg||a,s,{seg:6,cap1:!0});V(t,[[0,.7,0,.235,.155],[0,.76,0,.23,.15],[0,.98,0,.19,.13],[0,1.3,.01,.21,.135],[0,1.46,0,.2,.1],[0,1.54,0,.065,.06]],a,s,{seg:8,fold:m,cap0:!0,cols:[n,a,a,a,a,a]}),t.spine([[0,.96,0],[0,1,0]],[[.2,.14],[.2,.14]],n,s,{seg:8})}else{const p=r===1?1.14:1;V(t,[[0,0,.02,.2*p,.15*p],[0,.08,.02,.21*p,.16*p],[0,.1,.02,.21*p,.16*p],[0,.5,i*.2,.18*p,.14],[0,.95,0,.19,.13],[0,1.3,.01,.21,.135],[0,1.46,0,.2,.1],[0,1.54,0,.065,.06]],a,s,{seg:8,fold:m,cols:[n,n,a,a,a,a,a,a]});for(const d of[-1,1])t.lump([d*.09,.035,.15+d*i*.6],.05,.035,.1,a,s,5,3);r===0&&V(t,[[.17,1.47,.02,.07,.11],[.02,1.2,.09,.1,.07],[-.14,.9,.06,.09,.09],[-.2,.5,.02,.05,.1]],o.cloakCol||y.marbleB,s,{seg:6,cap1:!0})}No(t,o,a),Dt(t,o,a,1.66,0)}const Wa=2.2;function Ca(t,o={}){const a=o.col||y.marble,s=9,n=o.accent||y.purple;t.box(-.42,-.1,-.42,.42,0,.5,y.marbleB,s),t.box(-.3,0,-.34,.3,.46,.12,y.marbleB,s),t.box(-.3,.46,-.34,.3,1,-.26,y.marbleB,s);const r=(i,m)=>1+.06*Math.sin(m*5+i*1.3);V(t,[[0,0,.3,.22,.15],[0,.08,.3,.22,.15],[0,.1,.3,.22,.15],[0,.5,.28,.2,.13]],a,s,{seg:8,fold:r,cols:[n,n,a,a]}),V(t,[[0,.56,.34,.2,.11],[0,.57,.1,.21,.12],[0,.56,-.14,.2,.13]],a,s,{seg:8,cap0:!0,cap1:!0,up:[0,0,1]}),V(t,[[0,.5,-.1,.2,.14],[0,.85,-.1,.2,.135],[0,1.05,-.1,.2,.1],[0,1.13,-.1,.065,.06]],a,s,{seg:8,fold:r});for(const i of[-1,1])t.lump([i*.09,.035,.44],.05,.035,.1,a,s,5,3),V(t,[[i*.2,1.01,-.1,.062,.062],[i*.25,.76,-.04,.05,.05],[i*.2,.66,.22,.04,.04]],a,s,{seg:5,cap1:!0});Dt(t,{top:"hair",hair:o.hair},a,1.25,-.1)}function Zt(t,o){const a=o.col,s=9,n=o.H,r=o.L/2,i=o.g,m=o.run||0,p=o.seg||7,d=n-i[1],f=o.hd,w=o.neck||[.2,.2];V(t,[[0,d+.03,-r,i[0]*.5,i[1]*.55],[0,d,-r*.6,i[0]*.96,i[1]*.96],[0,d-.02,0,i[0],i[1]],[0,d,r*.6,i[0]*1.02,i[1]*1.08],[0,d+.04,r,i[0]*.6,i[1]*.75]],a,s,{seg:p,cap0:!0,cap1:!0});const H=o.headYaw||0,I=Math.sin(H)*(w[1]+f[2]),P=[I,d+w[0],r+w[1]*Math.cos(H)];if(V(t,[[0,d+.03,r*.7,i[0]*.72,i[1]*.8],[I*.5,d+w[0]*.6,r+w[1]*.45,f[0]*.95,f[1]],[P[0],P[1],P[2],f[0]*.8,f[1]*.8]],a,s,{seg:p}),o.mane){const v=o.maneSize||1;t.lump([I*.6,P[1]-.03,P[2]-f[2]*.8],f[0]*1.55*v,f[1]*1.6*v,f[2]*1.3*v,o.mane,s,8,5)}t.lump(P,f[0],f[1],f[2],a,s,7,4);const W=[P[0]+Math.sin(H)*f[2]*.9,P[1]-f[1]*.3,P[2]+Math.cos(H)*f[2]*.9];t.lump(W,f[0]*.6,f[1]*.55,f[2]*.7,a,s,6,3),o.mouth&&t.lump([W[0]+Math.sin(H)*f[2]*.5,W[1]-f[1]*.22,W[2]+Math.cos(H)*f[2]*.5],f[0]*.38,f[1]*.2,f[2]*.3,o.mouth,s,5,3);for(const v of[-1,1])t.lump([P[0]+v*f[0]*.75,P[1]+f[1]*.85,P[2]-f[2]*.3],f[0]*.25,f[1]*.3,f[2]*.2,o.mane||a,s,4,3),o.horns&&t.spine([[P[0]+v*f[0]*.7,P[1]+f[1]*.6,P[2]],[P[0]+v*f[0]*1.7,P[1]+f[1]*1.1,P[2]+.03],[P[0]+v*f[0]*1.9,P[1]+f[1]*2,P[2]+.06]],[.035,.028,.008],y.marbleB,s,{seg:4});const R=o.leg,_=d-i[1]*.3;for(const v of[-1,1]){const O=v*i[0]*.62,x=v>0?1:.6;V(t,[[O,_,r*.68,R*1.7,R*2.1],[O,_*.52+m*.14,r*.72+m*.3*x,R*1.1,R*1.2],[O,m*.2*x,r*.7+m*.62*x,R,R*1.25]],a,s,{seg:5,cap1:!0}),V(t,[[O,_,-r*.72,R*2,R*2.6],[O,_*.5,-r*.86-m*.2*x,R*1.15,R*1.3],[O,m*.1*x,-r*.74-m*.6*x,R,R*1.25]],a,s,{seg:5,cap1:!0})}const b=o.tail||"down",E=-r-.02,F=d+i[1]*.4;b==="down"?V(t,[[0,F,E,R,R],[0,F-n*.3,E-.08,R*.8,R*.8],[0,n*.22,E-.05,R*1.3,R*1.3]],a,s,{seg:4,cap1:!0}):b==="curl"?V(t,[[0,F,E,R*.6,R*.6],[0,F+.1,E-.08,R*.5,R*.5],[0,F+.04,E-.14,R*.4,R*.4]],a,s,{seg:4,cap1:!0}):(V(t,[[0,F,E,R*.8,R*.8],[0,F-n*.28,E-.16,R*.6,R*.6],[0,F-n*.36,E-.4,R*.55,R*.55],[0,F-n*.2,E-.56,R*.5,R*.5]],a,s,{seg:4}),t.lump([0,F-n*.17,E-.6],R*1.4,R*1.6,R*1.6,o.mane||a,s,5,3))}const Da=.6,Wo=t=>y.marble.clone().lerp(t,Da),Tt={lion:t=>({col:Wo(y.tawny),mane:Wo(ce("#7a4a24")),maneSize:.82,mouth:y.red,L:.95,H:.86,g:[.165,.185],neck:[.2,.2],hd:[.115,.125,.14],leg:.048,tail:"tuft",...t}),cow:t=>({col:y.marble,L:1.35,H:1.28,g:[.3,.33],neck:[.1,.3],hd:[.12,.13,.2],leg:.055,horns:!0,tail:"down",...t}),sheep:t=>({col:y.marble,L:.85,H:.72,g:[.2,.2],neck:[.14,.16],hd:[.075,.08,.11],leg:.035,tail:"curl",...t}),boar:t=>({col:y.marble,L:1.1,H:.82,g:[.21,.27],neck:[-.04,.2],hd:[.11,.12,.2],leg:.045,tail:"curl",...t}),cat:t=>({col:y.marble,L:1.1,H:.74,g:[.14,.16],neck:[.14,.2],hd:[.085,.085,.1],leg:.038,tail:"tuft",...t}),deer:t=>({col:y.marble,L:1.05,H:1,g:[.16,.19],neck:[.34,.2],hd:[.065,.07,.12],leg:.03,tail:"curl",...t})};Tt.mule=t=>({col:ce("#8a7460"),L:1.25,H:1.2,g:[.22,.26],neck:[.3,.3],hd:[.09,.1,.2],leg:.045,tail:"down",...t});const Ss=(t,o,a={})=>Zt(t,Tt[o](a));async function Za(t,o,a,s,n,r=Rt,i=1.5){const m=Math.cos(n),p=Math.sin(n),d=(h,L,M=1,C=0,g=0)=>t.at(o+h*m+L*p,a+C,s-h*p+L*m,n+g,M),f=e.GROUP_H/2.25,w=e.GROUP_L/2-1.47*f,H=[-1.69,-.56,.56,1.69],I=[.16,.05,-.07,-.18],P=[.1,-.06,.04,-.1],W=[[.05,-.12],[-.1,.04],[.06,-.08],[-.13,.03]];for(let h=0;h<4;h++)await r(i),d(H[h],w+(h===1||h===2?0:-.12),f),Po(t,{fine:!0,bridle:!0,harness:!0,support:"pier",headYaw:I[h],headDrop:P[h],fore:W[h],hind:[W[h][1]*.6,W[h][0]*.6]});await r(i),d(0,0);const R=e.WHEEL_D/2,_=-e.GROUP_L/2+R+.06,b=1.2,E=9,F=y.marble;for(const h of[-1,1]){const L=h*b,M=[],C=20;for(let g=-1;g<=C+1;g++){const N=g/C*6.2831853;M.push([L,R+Math.cos(N)*(R-.07),_+Math.sin(N)*(R-.07)])}t.spine(M,M.map(()=>[.07,.055]),F,E,{seg:6,up:[1,0,0]});for(let g=0;g<6;g++){const N=g/6*6.2831853+.3;t.spine([[L,R,_],[L,R+Math.cos(N)*(R-.1),_+Math.sin(N)*(R-.1)]],[.05,.035],F,E,{seg:5,up:[1,0,0]})}t.spine([[L-h*.1,R,_],[L+h*.16,R,_]],[.14,.09],y.marbleB,E,{seg:8,cap0:!0,cap1:!0,up:[0,0,1]})}t.spine([[-b,R,_],[b,R,_]],[.07,.07],y.marbleB,E,{seg:6,up:[0,0,1]});const v=R+.1,O=.78,x=_-.62,l=_+.62,c=10,A=[];t.boxAll(-O,v-.08,x,O,v,l,y.marbleB,E);for(let h=0;h<=c;h++){const L=h/c*Math.PI,M=-Math.cos(L)*O,C=x+.25+Math.sin(L)*(l+.22-x-.25),g=.62+.42*Math.sin(L);A.push([M,C,g])}for(let h=0;h<c;h++){const L=A[h],M=A[h+1];for(const C of[0,.045]){const g=1-C/O;t.quad([L[0]*g,v,L[1]],[M[0]*g,v,M[1]],[M[0]*g,v+M[2],M[1]],[L[0]*g,v+L[2],L[1]],C?y.marbleB:F,E,C?[L[0]+M[0],v,L[1]+M[1]-_]:[0,v,_])}}t.spine(A.map(h=>[h[0],v+h[2],h[1]]),A.map(()=>.045),y.marbleB,E,{seg:5,cap0:!0,cap1:!0});const S=w+.5*f,u=1.56*f;V(t,[[0,v-.04,l,.06,.06],[0,v+.1,(l+S)/2,.055,.055],[0,u-.12,S-.3,.05,.05],[0,u,S,.05,.05]],y.marbleB,E,{seg:6,cap1:!0}),t.spine([[-.95,u-.05,S],[-.56,u+.05,S],[0,u,S],[.56,u+.05,S],[.95,u-.05,S]],[.045,.06,.05,.06,.045],y.marbleB,E,{seg:6,cap0:!0,cap1:!0,up:[0,0,1]}),t.at()}const Ce={E:[1,0],W:[-1,0],S:[0,1],N:[0,-1]},Ke=(t,o,a,s)=>t[0]?[t[0]*o,s]:[s,t[1]*a],wt=t=>Math.atan2(t[0],t[1]),it=(t,o)=>t[0]?o>0?0:Math.PI:o>0?Math.PI/2:-Math.PI/2,za=(()=>{const t=pe(ue("mausoleum-statues")),o=[],a=l=>l[Math.floor(t()*l.length)%l.length],s=(l,c)=>y.marble.clone().lerp(l,c),n=[s(y.red,.6),s(y.paintBlue,.6),s(y.purple,.55),y.marbleB,s(y.red,.45),s(y.paintBlue,.45)],r=[y.hair,ce("#3c2a1c"),ce("#6e4a2a")],i=(l={})=>({type:a([0,0,1,2]),accent:a(n),hair:a(r),ph:t()*6,armR:a(["down","chest","fwd"]),armL:a(["down","down","chest"]),...l}),m=l=>(l.type===1?l.top=t()<.6?"veil":"hair":l.type===2&&(l.top="cap",l.leg=a([y.marble,y.marbleB])),l),p=()=>q(e.LOWER_FIG[0],e.LOWER_FIG[1],t())/1.775,d=l=>(o.push(l),l),f=e.T+e.SHELF1_Y,w=re[0]+.78,H=re[1]+.78;{const l=Ce.W,c=["deer","rider","man","cat","man","rider","man","boar","man","rider","man","deer","rider","man"],A={rider:3.35,man:1.25,deer:2,cat:2,boar:2},S=c.reduce((M,C)=>M+A[C],0),u=Math.min(1.02,(2*H-.6)/S);let h=-S*u/2,L=0;for(const M of c){const C=A[M]*u,g=Ke(l,w,H,h+C/2),N=it(l,1);h+=C,M==="rider"?(L++,d({t:"rider",shelf:1,side:"W",x:g[0],y:f,z:g[1],yaw:N,sc:1.3,n:l,o:{rear:L%2?.26:0,fore:[.12,-.1],hind:[-.1,.12],headDrop:.05,support:!0,rider:m(i({type:a([0,2]),armR:"up",cloak:!0}))}})):d(M==="man"?{t:"fig",shelf:1,side:"W",x:g[0],y:f,z:g[1],yaw:N+(t()-.5)*.5-.5,sc:p(),n:l,o:m(i({type:a([0,2]),step:.2,armR:"up",armL:"out"}))}:{t:"beast",shelf:1,side:"W",b:M,x:g[0],y:f,z:g[1],yaw:N,sc:1.45,n:l,o:{run:.75+t()*.25}})}}for(const l of["N","S"]){const c=Ce[l],A=12,S=(2*w-1.6)/A;for(let u=0;u<A;u++){const h=Ke(c,w,H,-w+.8+(u+.5)*S),L=it(c,1),M=u%4===2;d(M?{t:"beast",shelf:1,side:l,b:l==="S"&&u===10?"boar":(u>>2)%2?"sheep":"cow",x:h[0],y:f,z:h[1],yaw:L,sc:1.5,n:c,o:{}}:{t:"fig",shelf:1,side:l,x:h[0],y:f,z:h[1],yaw:L+(c[1]>0?-1:1)*(.25+t()*.5),sc:p(),n:c,o:m(i({step:.14,armR:u%4===1?"fwd":void 0}))})}}{const l=Ce.E,c=5,A=(H-e.DOOR_W/2-1.3)/c;for(const S of[-1,1])for(let u=0;u<c;u++){const h=Ke(l,w,H,S*(e.DOOR_W/2+1.3+(u+.4)*A));d({t:"fig",shelf:1,side:"E",x:h[0],y:f,z:h[1],yaw:wt(l)+S*(.5+t()*.45),sc:p(),n:l,o:m(i())})}d({t:"seat",shelf:1,side:"E",x:re[0]+.86,y:f,z:0,yaw:wt(l),sc:Wa/1.39,n:l,o:{}})}const I=e.T+e.SHELF2_Y,P=te[0]+.66,W=te[1]+.66,R=e.UPPER_FIG/1.775;let _=0;for(const l of["N","E","S","W"]){const c=Ce[l],A=c[0]?W:P,S=c[0]?5:7,u=(2*A-2.2)/S;for(let h=0;h<S;h++,_++){const L=-A+1.1+(h+.5)*u,M=_%3,C=N=>Ke(c,P,W,L+N),g=wt(c);if(M===1){const N=h%2?1:-1,Y=C(-N*.35),k=C(N*1.45);d({t:"rider",shelf:2,side:l,x:Y[0],y:I,z:Y[1],yaw:it(c,N),sc:R,n:c,o:{rear:h%4<2?.34:.2,support:!0,fore:[.14,-.08],hind:[-.08,.12],headDrop:.12,headYaw:.1,rider:m(i({type:a([0,2]),armR:a(["up","out"]),cloak:!0}))}}),d({t:"fig",shelf:2,side:l,x:k[0],y:I,z:k[1],yaw:it(c,-N)+(t()-.5)*.4,sc:R,n:c,o:m(i({type:a([0,2]),step:.24,armR:"up",armL:"out"}))})}else{const N=M===0?2:3;for(let Y=0;Y<N;Y++){const k=(Y-(N-1)/2)*1.05,B=C(k),D=N===2?(Y?-1:1)*1:(Y-1)*-.8;d({t:"fig",shelf:2,side:l,x:B[0],y:I,z:B[1],yaw:g+(c[0]?-c[0]:c[1])*D+(t()-.5)*.3,sc:R*(.96+t()*.08),n:c,o:m(i({type:a([0,0,2]),step:.18+.1*t(),armR:a(["up","out","fwd","up"]),armL:a(["out","chest","down"])}))})}}}}const b=(l,c)=>{const A=Ke(l,be-.15,ve-.15,c);d({t:"fig",shelf:3,x:A[0],y:Oe,z:A[1],yaw:wt(l)+(t()-.5)*.5,sc:q(e.GAP_FIG[0],e.GAP_FIG[1],t())/1.775,n:l,o:m(i({type:a([0,1,0,1,2]),armR:a(["chest","down","out"])}))})};for(const l of["N","S"])for(let c=0;c<e.COL_N_LONG-1;c++)b(Ce[l],-be+(c+.5)*e.COL_STEP);for(const l of["E","W"])for(let c=0;c<e.COL_N_SHORT-1;c++)b(Ce[l],-ve+(c+.5)*e.COL_STEP);const E=Ee.x,F=Ee.z,v=Ee.scale;for(const l of["N","S","E","W"]){const c=Ce[l],A=(c[0]?e.LIONS_SHORT:e.LIONS_LONG)/2,S=c[0]?Ee.gapShort:Ee.gapLong;for(const u of[-1,1])for(let h=0;h<A;h++){const L=Ke(c,E,F,u*(Ee.FIRST+(h+.5)*S)),M=it(c,-u),C=[Math.sin(M),Math.cos(M)],g=C[1]*c[0]-C[0]*c[1];d({t:"lion",x:L[0],y:Se,z:L[1],yaw:M,sc:v,n:c,o:{L:.8,neck:[.2,.15],headYaw:(g>0?1:-1)*.3,run:.12}})}}for(const l of[-1,1])for(const c of[-1,1])d({t:"rider",corner:!0,x:l*(e.ROOF_FOOT_HX-.75),y:Se,z:c*(e.ROOF_FOOT_HZ-.75),yaw:Math.atan2(l,c),sc:e.RIDER_H/2.83,n:[l,c],o:{rear:.5,fore:[.06,-.08],support:!0,headDrop:.15,rider:m(i({type:2,armR:"fwd"}))}});const O=l=>o.filter(l).length,x=l=>l.t==="fig"||l.t==="seat"||l.t==="rider";return o.counts={lowerPeople:O(l=>l.shelf===1&&x(l)),lowerRiders:O(l=>l.shelf===1&&l.t==="rider"),lowerBeasts:O(l=>l.shelf===1&&l.t==="beast"),upperPeople:O(l=>l.shelf===2&&x(l)),upperRiders:O(l=>l.shelf===2&&l.t==="rider"),gaps:O(l=>l.shelf===3),lions:O(l=>l.t==="lion"),cornerRiders:O(l=>l.corner)},o})(),Ya={fig:.5,seat:.5,rider:1.2,beast:.6,lion:.6};async function Xa(t,o,a){const s=a?ka(t,a.C):t;for(const d of za)await o(Ya[d.t]),Ga(a&&a.takes(d)?s:t,d);t.at(),await o(.3);const n=re[0],r=e.T+e.SHELF1_Y,i=e.DOOR_W/2,m=e.DOOR_H,p=y.marble;t.box(n,r,-i,n+.06,r+m,i,y.marbleB,9),t.box(n,r,-.03,n+.09,r+m,.03,ce("#8f8676"),9);for(const d of[.25,.62])t.box(n,r+m*d-.05,-i,n+.085,r+m*d+.05,i,p,9);for(const d of[-1,1])t.box(n,r,d*i-(d<0?.32:0),n+.16,r+m+.3,d*i+(d>0?.32:0),p,9);t.box(n,r+m,-i-.32,n+.18,r+m+.34,i+.32,p,9),t.box(n,r+m+.34,-i-.46,n+.3,r+m+.5,i+.46,p,9),a&&a.pedestal(),await Za(s,0,we,0,Math.PI/2,o,1.5),a&&a.end()}function Ua(t,o){const a=[o.x,o.y,o.z],s={floor:null,wall:null,sway:null},n=.006;let r=1,i=0,m=1,p=0,d=0,f=0,w=1,H=0,I=0,P=0;s.at=(x=0,l=0,c=0,A=0,S=1)=>{r=Math.cos(A),i=Math.sin(A),m=S,p=x,d=l,f=c},s.tilt=(x=0,l=0,c=0)=>{w=Math.cos(x),H=Math.sin(x),I=l,P=c};const W=x=>{const l=H===0?x:[x[0],I+(x[1]-I)*w+(x[2]-P)*H,P+(x[2]-P)*w-(x[1]-I)*H];return[p+(l[0]*r+l[2]*i)*m,d+l[1]*m,f+(-l[0]*i+l[2]*r)*m]},R=x=>{const l=H===0?x:[x[0],x[1]*w+x[2]*H,x[2]*w-x[1]*H];return[l[0]*r+l[2]*i,l[1],-l[0]*i+l[2]*r]},_=(x,l)=>[x[1]*l[2]-x[2]*l[1],x[2]*l[0]-x[0]*l[2],x[0]*l[1]-x[1]*l[0]],b=(x,l)=>x[0]*l[0]+x[1]*l[1]+x[2]*l[2],E=x=>{const l=Math.hypot(x[0],x[1],x[2])||1;return[x[0]/l,x[1]/l,x[2]/l]},F=[0,1,0],v=E(_(a,F)),O=x=>{t.sway=s.sway;const l=s.floor,c=s.wall,A=(S,u,h,L)=>{for(let M=1;M<S.length-1;M++)t.vert(S[0],u,h,L),t.vert(S[M],u,h,L),t.vert(S[M+1],u,h,L)};if(l){const S=x.map(u=>{const h=(u[1]-l.y)/a[1];return[u[0]-a[0]*h,l.y+n,u[2]-a[2]*h]});(!c||S.some(u=>c.n[0]*u[0]+c.n[1]*u[2]>c.d-.02))&&A(S.map(u=>[Xe(u[0],l.x0,l.x1),u[1],Xe(u[2],l.z0,l.z1)]),F,l.col,l.k)}if(c){const S=c.n[0]*a[0]+c.n[1]*a[2],u=x.map(h=>{const L=(c.n[0]*h[0]+c.n[1]*h[2]-c.d)/S,M=h[0]-a[0]*L,C=h[2]-a[2]*L,g=Xe(-c.n[1]*M+c.n[0]*C,c.t0,c.t1);return[c.n[0]*(c.d+n)-c.n[1]*g,h[1]-a[1]*L,c.n[1]*(c.d+n)+c.n[0]*g]});u.some(h=>h[1]>c.y0+.02)&&A(u,[c.n[0],0,c.n[1]],y.blue,2)}};return s.spine=(x,l,c,A,S={})=>{const u=x.length,h=x.map(W),L=R(S.up||F);let M=null,C=null,g=null;for(let N=0;N<u;N++){const Y=h[Math.max(0,N-1)],k=h[Math.min(u-1,N+1)],B=E([k[0]-Y[0],k[1]-Y[1],k[2]-Y[2]]);let D=_(B,a);Math.hypot(D[0],D[1],D[2])<.001&&(D=v),D=E(D),g&&b(D,g)<0&&(D=[-D[0],-D[1],-D[2]]);let Z=_(L,B);Math.hypot(Z[0],Z[1],Z[2])<1e-4&&(Z=R([1,0,0])),Z=E(Z);const U=_(B,Z),J=typeof l[N]=="number"?[l[N],l[N]]:l[N],ee=Math.hypot(J[0]*b(D,Z),J[1]*b(D,U))*m,se=[h[N][0]-D[0]*ee,h[N][1]-D[1]*ee,h[N][2]-D[2]*ee],j=[h[N][0]+D[0]*ee,h[N][1]+D[1]*ee,h[N][2]+D[2]*ee];M&&O([M,C,j,se]),M=se,C=j,g=D}},s.limb=(x,l,c,A)=>s.spine([x,l],[c,A]),s.lump=(x,l,c,A)=>{if(Math.min(l,c,A)<.06)return;const S=W(x),u=R([1,0,0]),h=R(F),L=R([0,0,1]),M=E(_(a,v)),C=[];for(let g=0;g<6;g++){const N=g/6*6.2831853,Y=[v[0]*Math.cos(N)+M[0]*Math.sin(N),v[1]*Math.cos(N)+M[1]*Math.sin(N),v[2]*Math.cos(N)+M[2]*Math.sin(N)],k=b(Y,u)*l,B=b(Y,h)*c,D=b(Y,L)*A,Z=(Math.hypot(k,B,D)||1)/m;C.push([S[0]+(u[0]*l*k+h[0]*c*B+L[0]*A*D)/Z,S[1]+(u[1]*l*k+h[1]*c*B+L[1]*A*D)/Z,S[2]+(u[2]*l*k+h[2]*c*B+L[2]*A*D)/Z])}O(C)},s.box=(x,l,c,A,S,u)=>{if((S-l)*m<.25)return;const h=(L,M,C)=>W([L,M,C]);O([h(x,S,c),h(A,S,c),h(A,S,u),h(x,S,u)]),O([h(x,l,c),h(A,l,c),h(A,S,c),h(x,S,c)]),O([h(x,l,u),h(A,l,u),h(A,S,u),h(x,S,u)]),O([h(x,l,c),h(x,l,u),h(x,S,u),h(x,S,c)]),O([h(A,l,c),h(A,l,u),h(A,S,u),h(A,S,c)])},s.boxAll=s.box,s.quad=(x,l,c,A)=>O([W(x),W(l),W(c),W(A)]),s.tri=(x,l,c)=>O([W(x),W(l),W(c)]),s.vert=()=>{},s}function ka(t,o){return{at:(a,s,n,r,i)=>{t.at(a,s,n,r,i),o.at(a,s,n,r,i)},tilt:(a,s,n)=>{t.tilt(a,s,n),o.tilt(a,s,n)},spine:(a,s,n,r,i)=>{t.spine(a,s,n,r,i),o.spine(a,s,n,r,i)},limb:(a,s,n,r,i,m,p,d)=>{t.limb(a,s,n,r,i,m,p,d),o.limb(a,s,n,r)},lump:(a,s,n,r,i,m,p,d)=>{t.lump(a,s,n,r,i,m,p,d),o.lump(a,s,n,r)},box:(a,s,n,r,i,m,p,d,f,w)=>{t.box(a,s,n,r,i,m,p,d,f,w),o.box(a,s,n,r,i,m)},boxAll:(a,s,n,r,i,m,p,d)=>{t.boxAll(a,s,n,r,i,m,p,d),o.boxAll(a,s,n,r,i,m)},quad:(a,s,n,r,i,m,p)=>{t.quad(a,s,n,r,i,m,p),o.quad(a,s,n,r)},tri:(a,s,n,r,i,m)=>{t.tri(a,s,n,r,i,m),o.tri(a,s,n)},vert:(a,s,n,r)=>t.vert(a,s,n,r),get sway(){return t.sway},set sway(a){t.sway=a,o.sway=a},get flag(){return t.flag},set flag(a){t.flag=a}}}function Ga(t,o){o.t==="fig"?(t.at(o.x,o.y+.12*o.sc,o.z,o.yaw,o.sc),Na(t,o.o)):o.t==="seat"?(t.at(o.x,o.y+.1*o.sc,o.z,o.yaw,o.sc),Ca(t,o.o)):o.t==="rider"?(t.at(o.x,o.y+.1*o.sc,o.z,o.yaw,o.sc),t.box(-.34,-.1,-1.1,.34,0,1,y.marbleB,9),Po(t,o.o)):o.t==="beast"?(t.at(o.x,o.y+.08*o.sc,o.z,o.yaw,o.sc),t.box(-.26,-.08,-.75,.26,0,.85,y.marbleB,9),Zt(t,Tt[o.b](o.o))):o.t==="lion"&&(t.at(o.x,o.y,o.z,o.yaw,o.sc),Zt(t,Tt.lion(o.o)))}function $a(t){const o=So({flag:3,room:Eo.statueShadows}),a=Ua(o,t),s={1:[e.T+e.SHELF1_Y,[e.FOOT_HX,e.FOOT_HZ],re],2:[e.T+e.SHELF2_Y,re,te],3:[Oe,[te[0]+.12,te[1]+.12],[Je,et]]};return{D:o,C:a,takes:i=>{if(!i.shelf)return!1;const m=i.n,[p,d,f]=s[i.shelf];return t.x*m[0]+t.z*m[1]<.05?!1:(a.floor={y:p,x0:-d[0],z0:-d[1],x1:d[0],z1:d[1],col:y.marbleB,k:1},a.wall={n:m,d:m[0]?f[0]:f[1],t0:-(m[0]?f[1]:f[0]),t1:m[0]?f[1]:f[0],y0:p},!0)},pedestal:()=>{a.floor={y:we,x0:-e.PED_HX,z0:-e.PED_HZ,x1:e.PED_HX,z1:e.PED_HZ,col:y.marbleB,k:9},a.wall=null},end:()=>{a.at(),a.tilt(0)}}}function bs(){const t=[[-e.FOOT_HX,-e.FOOT_HZ,e.FOOT_HX,e.FOOT_HZ,e.T+e.SHELF1_Y],[-re[0],-re[1],re[0],re[1],e.T+e.SHELF2_Y],[-te[0],-te[1],te[0],te[1],Oe],[-e.ROOF_FOOT_HX,-e.ROOF_FOOT_HZ,e.ROOF_FOOT_HX,e.ROOF_FOOT_HZ,Se]];for(let o=0;o<e.ROOF_STEPS;o++){const a=rt(o);t.push([-a[0],-a[1],a[0],a[1],Se+(o+1)*e.ROOF_STEP_H])}return t.push([-e.PED_HX,-e.PED_HZ,e.PED_HX,e.PED_HZ,we]),t.push([-e.GROUP_L/2,-e.GROUP_W/2,e.GROUP_L/2,e.GROUP_W/2,we+2.4]),t}async function vs(t,o={}){const a=o.pace||_o(t&&t.yield?t.yield:void 0),s=o.light||jo(1),n=sa(s);if(!n.tShade.value){const w=new K.DataTexture(new Uint8Array([0,0,0,255]),1,1);w.needsUpdate=!0,n.tShade.value=w}const r=po(n),i=new K.Group;i.name="mausoleum";const m=So({flag:1,room:Eo.tomb}),p=$a(s.sunDir);await a(1),la(m),await a(1),await ha(m,a),await fa(m,a),await a(1),ca(m),await Xa(m,a,p);const d=new K.Mesh(await m.geometryInSteps(a),r);d.name="tomb",i.add(d);const f=po(n,{polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});{const w=new K.Mesh(await p.D.geometryInSteps(a),f);w.name="statue-shadows",i.add(w)}return{object:i,material:r,castMaterial:f,uniforms:n,radius:26,height:e.T+44.8,center:new K.Vector3(0,e.T+22,0),anchors:{horses:new K.Vector3(Pe[0],Pe[1],0),portal:new K.Vector3(...ht)},update(w,H){n.uTime.value=H},dispose(){},ground:!0,groundY:e.T}}export{uo as AIR,me as ANCHORAGE,Es as AWN_OUT,Kt as BASIN_AT,at as BAY_CX,Jt as BEND_RATE,qa as BIRD_FORMS,ge as BLOCK,qo as BLUE_TONE,It as BOAT_REACH,Ta as BOAT_ROUNDS,ut as BUILD_PACE,is as CARTS_AT,Je as CELLA_HX,et as CELLA_HZ,y as COL,ia as COLUMNS,be as COL_HX,ve as COL_HZ,Fa as DOG_AT,vt as ENTAB,He as ENTRY,Ea as ENTRY_BOX,Ft as FAIRWAY,oe as FILES,dt as FISH_AT,wa as FLOCKS,Ra as FOUNTAIN_SQ,Me as GATE_CEIL,Qa as GATE_LEAF,no as GATE_PLAT,ya as GRAIN,Ot as HILL_FROM,eo as HORN_Z,Pe as HORSES_AT,ja as HOURS,ds as KEEP_UNDER,fe as LIGHT,xt as LINE_SLOPE,tt as LINE_Z,Ee as LIONS_AT,Da as LION_WASH,oa as LIT_DEFS,ea as LIT_PARS,e as M,rs as MARKET_PLANES,Qe as MOORINGS,yt as NEAR_OFF,pa as OAR_HALF,Ho as PALACE_MOORING,ba as PALACE_PLAT,Ue as PATH_OFF,Jo as PENUMBRA,ie as PEOPLE,Xo as PIGEON_OFF,xa as PLACES,Ka as PLANE_AT,re as POD1,te as POD2,ht as PORTAL_AT,ft as RAIL_AT,Fe as RISE,Eo as ROOM,ot as RUN_Y,Wa as SEATED_H,ua as SEA_ROOM,X as SHADED,ye as SHIP_L,je as SLAB_WAY,Ts as SMOKE,va as SMOKE_SPOTS,hs as SQUARE_BENCHES,mt as SQUARE_STOA,fo as SQUARE_STOA_ROOF,Qt as STAIR_STEPS,_e as STAIR_TONE,za as STATUES,Ne as STOA,Vo as STOAS,io as STOA_ROOFS,Et as STREET_MID,go as STREET_X0,Oo as STREET_X1,qt as SWIFT_IN,Vt as SWIFT_SIZE,jt as SWIFT_SPEED,us as TOWN,ke as TURN1,Ge as TURN2,Be as WARSHIP,Fo as WAYS,lt as WELL_AT,Mt as WEST_EDGE,cs as WIND,_t as WIND_YAW,Se as Y_ORDER,we as Y_PED,Oe as Y_POD,Ae as Y_ROOF,Va as Y_TOP,$o as bayHalf,so as bayHalfAt,Zt as beast,vs as buildHero,Ct as cargoLot,Ha as cartLots,Za as chariotGroup,ps as clearOfWays,oo as coastAt,_s as courtOf,ns as crestRho,Go as dealVisit,Na as figure,lo as fileZs,es as flightPlan,fs as flockClear,Sa as flockDisc,Aa as flockStray,La as gangplankX,as as groundCols,ss as groundRow,$e as groundY,ce as hex,Po as horse,jo as hourLight,Ia as layAnimals,xo as layHouses,Io as layLife,ws as layPlace,As as layPlaceInSteps,Uo as lineY,de as lotHash,So as makeBuilder,Ua as makeCaster,sa as makeLightUniforms,po as makeLitMaterial,_o as makePace,We as makeRound,Ja as makeRoute,os as naturalY,ao as offMid,Wt as offWays,ts as onHillSlope,ms as placeDist,Ss as plainBeast,ho as quayStep,gt as riseY,rt as roofStep,Pt as roundLoop,ko as routePoints,Ca as seated,ls as shadedLots,st as shoreRho,to as shoreRhoBy,Bo as southCoast,Mo as stallSpots,Oa as stoaTables,co as strewEnds,Yo as sunBearing,bs as tombMass,_a as warshipRound,yo as wayDist,ga as wayOf,ka as withCaster};
