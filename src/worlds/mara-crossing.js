import*as t from"three";import{makePath as co}from"../kit/core.js";import{makeSky as uo,makeLightRig as ho}from"../kit/sky.js";import*as fo from"../kit/terrain.js";import*as xt from"../kit/flora.js";import*as bt from"../kit/fauna.js";import{buildHero as po,GLSL_COMMON as lt,GLSL_FOGMIX as ia,CLOUD_GLSL as va,ANIMAL_FRAG as vo,WATER_GLSL as Ra,wildebeestGeometry as Ea,beastGeometry as Ma,SWIM_LV as mo}from"../parts/mara-crossing.js";const Xt=["#E9B45A","#C7A55E","#9A6A45","#2F2C2B","#F3EDE0","#8FB6D2","#3F6B34"],Sa=.95,Ot=42,pt=.3,ct=256,Nt=15,Te=a=>new t.Color(a),Ze=(a,e,h)=>Math.min(h,Math.max(e,a)),u=(a,e,h)=>{const i=Ze((h-a)/(e-a),0,1);return i*i*(3-2*i)},pe=(a,e,h)=>a+(e-a)*h,go={golden:{hour:"golden",weather:"haze",zenith:"#6f9cc4",mid:"#9dbcd0",horizon:"#e6c88e",ground:"#b9975c",fog:"#dcc08c",fogK:.0021,gully:"#E9B45A",gullyK:.03,sunC:"#FFD9A0",sunI:3.3,hemiSky:"#8c9fd6",hemiGnd:"#9A6A45",hemiI:1.56,exposure:.92,tint:"#fff3e2",shadow:"#1a1630",sat:1.08,clouds:.34,cloudLit:"#fff0d6",cloudShade:"#8a8fb0",grass:0,mist:0},dawn:{hour:"dawn",weather:"haze",zenith:"#5f7fb8",mid:"#a9a9cc",horizon:"#f2bfae",ground:"#8a7a84",fog:"#c9b4c0",fogK:.0026,gully:"#b9b6d6",gullyK:.027,sunC:"#ffb9a2",sunI:3,hemiSky:"#93a8dc",hemiGnd:"#7a6a70",hemiI:1.69,exposure:.95,tint:"#fff0f2",shadow:"#141c38",sat:1.05,clouds:.22,cloudLit:"#ffd9cc",cloudShade:"#7f88b4",grass:0,mist:1},storm:{hour:"golden",weather:"storm",zenith:"#1c2244",mid:"#343c66",horizon:"#c9a070",ground:"#6a5c50",fog:"#6f7390",fogK:.0023,gully:"#E9B45A",gullyK:.032,sunC:"#ffcf8a",sunI:3.6,hemiSky:"#5c68a8",hemiGnd:"#7a5a40",hemiI:1.25,exposure:.98,tint:"#f6f2ff",shadow:"#14143a",sat:1.12,clouds:.78,cloudLit:"#7c84a8",cloudShade:"#1c2038",grass:0,mist:0},rains:{hour:"golden",weather:"rains",zenith:"#5d92c6",mid:"#92b8d6",horizon:"#dcd0a8",ground:"#9a9060",fog:"#cfc7a0",fogK:.0015,gully:"#e2bd78",gullyK:.018,sunC:"#FFD9A0",sunI:3.3,hemiSky:"#8caade",hemiGnd:"#8a7a48",hemiI:1.56,exposure:.92,tint:"#fff6e6",shadow:"#161a30",sat:1.1,clouds:.46,cloudLit:"#fff4e0",cloudShade:"#7f8cae",grass:.6,mist:0},noon:{hour:"noon",weather:"rains",zenith:"#6aa0d8",mid:"#a6c6e2",horizon:"#e9e2c6",ground:"#b9a878",fog:"#e0d8ba",fogK:.0017,gully:"#e0c48a",gullyK:.022,sunC:"#fff5e6",sunI:2.7,hemiSky:"#a8c4ea",hemiGnd:"#b08a60",hemiI:1.62,exposure:.8,tint:"#fffaf0",shadow:"#1a1c2c",sat:1.04,clouds:.3,cloudLit:"#ffffff",cloudShade:"#8a98b4",grass:.25,mist:0},dusk:{hour:"dusk",weather:"haze",zenith:"#4c5084",mid:"#b08a96",horizon:"#f2ac78",ground:"#80604e",fog:"#cc9e86",fogK:.0024,gully:"#d2a68c",gullyK:.028,sunC:"#ffb47c",sunI:2.3,hemiSky:"#9488a8",hemiGnd:"#866650",hemiI:1.88,exposure:1.12,tint:"#fff4ea",shadow:"#1c1830",sat:1,clouds:.3,cloudLit:"#ffc49a",cloudShade:"#6a5c80",grass:0,mist:0}};function Jt(a,e=0){let h=1e9,i=-1e9,v=1e9,m=-1e9;for(const _ of a)h=Math.min(h,_[0]),i=Math.max(i,_[0]),v=Math.min(v,_[1]),m=Math.max(m,_[1]);const o=a.length-1,L=new Float64Array(o),P=new Float64Array(o),c=new Float64Array(o),r=new Float64Array(o),B=new Float64Array(o),te=new Float64Array(o+1);for(let _=0;_<o;_++){L[_]=a[_][0],P[_]=a[_][1],c[_]=a[_+1][0]-L[_],r[_]=a[_+1][1]-P[_];const I=c[_]*c[_]+r[_]*r[_];B[_]=1/Math.max(I,1e-9),te[_+1]=te[_]+Math.sqrt(I)}const w={d:0,s:0,side:1,i:0},M=16,O=new Map,d=new Float64Array(o),F=M*Math.SQRT2+1e-6,l=(_,I)=>{const s=(_+8192)*16384+(I+8192);let p=O.get(s);if(p)return p;const D=(_+.5)*M,U=(I+.5)*M;let z=1e18;for(let x=0;x<o;x++){const g=D-L[x],W=U-P[x];let se=(g*c[x]+W*r[x])*B[x];se=se<0?0:se>1?1:se;const ye=g-c[x]*se,Y=W-r[x]*se,R=Math.sqrt(ye*ye+Y*Y);d[x]=R,R<z&&(z=R)}let b=0;for(let x=0;x<o;x++)d[x]<=z+F&&b++;p=new Uint16Array(b),b=0;for(let x=0;x<o;x++)d[x]<=z+F&&(p[b++]=x);return O.set(s,p),p};return{near:(_,I)=>{if(e>0&&(_<h-e||_>i+e||I<v-e||I>m+e))return w.d=1e9,w;let s=1e18,p=0,D=0;const U=l(Math.floor(_/M),Math.floor(I/M)),z=U.length;for(let b=0;b<z;b++){const x=U[b],g=_-L[x],W=I-P[x];let se=(g*c[x]+W*r[x])*B[x];se=se<0?0:se>1?1:se;const ye=g-c[x]*se,Y=W-r[x]*se,R=ye*ye+Y*Y;R<s&&(s=R,p=x,D=se)}return w.d=Math.sqrt(s),w.i=p,w.s=te[p]+D*(te[p+1]-te[p]),w.side=c[p]*(I-P[p])-r[p]*(_-L[p])>=0?1:-1,w},length:te[o],pts:a}}function Rt(a,e=6){const h=new t.CatmullRomCurve3(a.map(o=>new t.Vector3(o[0],0,o[1])),!1,"centripetal"),i=Math.max(4,Math.round(h.getLength()/e)),v=[],m=new t.Vector3;for(let o=0;o<=i;o++)h.getPointAt(o/i,m),v.push([m.x,m.z]);return v}function wo(a,e,h){const i=a.rng.fork("layout"),v=e.anchors,m=v.shape,o=v.fall.center[2],L=ae=>i.range(-ae,ae),P=Math.hypot(.985,.17),c=[.985/P,-.17/P],r=[-83.5+L(1.5),6.5+h,41.5+L(2)],B=Math.max(33.5,o+29)+L(1.2),te=L(5),w=L(4),M=[[-38,.7+h,B+.4],[-21,.7+h,B],[-4,.7+h,B],[20,.7+h,B+1.2],[33,.7+h,B+9.5],[42.5,.72+h,B+19.8]],O=[[50,1.2+h,66.2],[61,2.3+h,73.2],[73,3+h,79.7],[88,3.75+h,85.7],[103,4.5+h,91.7]],d=[-240.6,12.5,-3.6+te],F=v.plume,l=[pe(F.base[0],F.top[0],.25)-d[0],pe(F.base[2],F.top[2],.25)-d[2]],S=Math.hypot(l[0],l[1]),_=[-213,12.5,3.5+te*.8],I=[-186,10.7,13+te*.5+w*.3],s=[[d[0]-76.4*l[0]/S,12.5,d[2]-76.4*l[1]/S],[d[0]-18*l[0]/S,12.5,d[2]-18*l[1]/S],d,_,I,[-160,8.9,24+w],[-135,8,32.5+w*.8],[-114,7.5,38.6+w*.4],[r[0]-14.5,7.2+h*.6,r[2]+1.6],r,[r[0]+8*c[0],6.35+h,r[2]+8*c[1]],[r[0]+16*c[0],4.95+h,r[2]+16*c[1]],[r[0]+23*c[0],2.95+h,r[2]+23*c[1]],[r[0]+29.5*c[0],1.05+h,r[2]+29.5*c[1]],...M,...O],p=13.5,D=s[s.length-1],U=new t.Vector3(.927,0,.375).normalize().multiplyScalar(Math.cos(.052)).setY(Math.sin(.052));for(const ae of[p,2*p,3*p])s.push([D[0]+U.x*ae,D[1]+U.y*ae,D[2]+U.z*ae]);const z=co(s),b=z.length,x=new t.Vector3,g=new t.Vector3,W=480,se=new Float64Array(W+1),ye=new Float64Array(W+1),Y=new Float64Array(W+1);for(let ae=0;ae<=W;ae++)z.posAtDist(ae/W*b,x),se[ae]=x.x,ye[ae]=x.y,Y[ae]=x.z;const R=(ae,Me)=>{let Se=1e18,ot=0;for(let Je=0;Je<=W;Je++){const st=se[Je]-ae,qt=Y[Je]-Me,Kt=st*st+qt*qt;Kt<Se&&(Se=Kt,ot=Je)}return ot/W*b},V=R(r[0],r[2]),j=R(_[0],_[2])+4,Q=V+30,X=R(M[2][0],M[2][2]),C=R(M[5][0],M[5][2])-2,ee=R(O[0][0],O[0][2]),y=R(O[1][0],O[1][2]),J=R(O[2][0],O[2][2]),oe=[];for(let ae=0;ae<=120;ae++)z.posAtDist(-160+ae/120*(b+230),x),oe.push([x.x,x.z]);const K=Jt(oe),E=(ae,Me)=>{const Se=K.near(ae,Me);return Se.s-=160,Se},he=ae=>{const Me=Ze(ae/b,0,1)*W,Se=Math.min(W-1,Math.floor(Me));return ye[Se]+(ye[Se+1]-ye[Se])*(Me-Se)+(ae>b?(ae-b)*U.y:0)},me=[[-128,420],[-104,300],[-90,200],[-85,120],[-84.5,78],[r[0]+.5,r[2]+6],[r[0]+.6,r[2]-6],[-81,33],[-75,24.5],[-66,m.lipZ(-66)+.8]];for(let ae=-60;ae<=60;ae+=4)me.push([ae,m.lipZ(ae)]);me.push([66,m.lipZ(66)+.5],[78,m.lipZ(66)+5],[100,m.lipZ(66)+9],[135,m.lipZ(66)+5],[180,m.lipZ(66)-14],[250,m.lipZ(66)-60],[330,m.lipZ(66)-130]);const ze=Rt([[-28,420],[-18,300],[-15.5,200],[-15,130],[-13,97],[-7,77],[5,66.5],[24,63],[50,66],[80,75],[118,82],[165,66],[240,16],[330,-56]],15),le=Jt(me),ce=Jt(ze),de=ae=>{const Me=ae*b;let Se=pe(1.12,1.28,u(0,j,Me));return Se=pe(Se,1.55,u(j,j+40,Me)),Se=pe(Se,1.3,u(V-12,V+4,Me)),Se=pe(Se,.56,u(Q-6,Q+8,Me)),Se=pe(Se,.8,u(C,y,Me)),Se=pe(Se,1.06,u(y,J+20,Me)),Se},re=64,H=new Float64Array(re+1);for(let ae=0;ae<=re;ae++)H[ae]=Ze(de(ae/re),.35,2.5);const ue=512,ie=new Float64Array(ue+1);let Be=0;const Ue=ae=>{const Me=Ze(ae,0,1)*re,Se=Math.min(re-1,Math.floor(Me));return H[Se]+(H[Se+1]-H[Se])*(Me-Se)};for(let ae=1;ae<=ue;ae++)Be+=1/Ue((ae-.5)/ue)/ue,ie[ae]=Be;for(let ae=0;ae<=ue;ae++)ie[ae]*=Ot/Be;const We=b/Ot*Ue(0)*Be,Ge=b/Ot*Ue(1)*Be;return{path:z,L:b,P:s,lip:r,hd:c,ed:U,v0:We,sLip:V,sGully:j,sSplash:Q,sAbeam:X,sWade:C,sLand:ee,sBar:y,sExit:J,pathNear:E,pathY:he,oLine:le,iLine:ce,paceAt:de,timeAtU:ae=>{const Me=Ze(ae,0,1)*ue,Se=Math.min(ue-1,Math.floor(Me));return ie[Se]+(ie[Se+1]-ie[Se])*(Me-Se)},distAtTime:ae=>{if(ae<=0)return ae*We;if(ae>=Ot)return b+(ae-Ot)*Ge;let Me=0,Se=ue;for(;Se-Me>1;){const ot=Me+Se>>1;ie[ot]<=ae?Me=ot:Se=ot}return(Me+(ae-ie[Me])/Math.max(1e-6,ie[Se]-ie[Me]))/ue*b},uOfS:ae=>ae/b,zFoot:o,sh:m,zs:B,posAt:(ae,Me)=>z.posAtDist(ae,Me),tanAt:(ae,Me)=>z.tangentAtDist(ae,Me),tv:g}}const ja=[.5,.705],Ua=[.578,.614],Da=.66,ra=.69;function yo(a,e,h,i){const v=e.anchors,m=new t.Vector3,o=new t.Vector3(v.slab[0]+3,h+5,v.slab[2]+3),L=new t.Vector3,P=a.zFoot-1,c=(B,te)=>{const w=te??0;return a.path.posAtDist(w*a.L,L),m.set(Ze(L.x+22,pe(6,-8,u(.55,.59,w)),21),h+pe(8.5,6.5,u(.52,.6,w)),P),m},r=[0,1,2,3,4,5].map(()=>({from:ja[0],to:ja[1],weight:.3187,at:c}));return i&&r.push({from:Ua[0]-.018,to:Ua[1]+.031,weight:.55,at:o}),r}const Ba=(a,e)=>5+3.6*u(a.L-30,a.L-8,e)+8*(1-u(a.sBar-10,a.sExit+6,e)),xo=(a,e,h)=>u(a.sBar+3,a.sExit+12,e)*pe(4,1.9,u(a.L-40,a.L-10,e)),Ta=11.9;function bo(a,e,h,i,v){const m=a.noise,o=e.sh,L=o.half,P=a.rng.fork("land"),c=g=>o.zBack+3*m.n2(g*.03,4.2),r=()=>P.range(-10,10),B=[Rt([[-330,-64+r()],[-250,-60+r()],[-170,-64+r()],[-100,-72],[-42,-76],[-12,-64],[-5,o.zBack-2]],14),Rt([[-190+r(),-270],[-130+r(),-205],[-70,-150],[-24,-100],[1,o.zBack-2]],14),Rt([[190+r(),-250],[120+r(),-190],[62,-135],[24,-92],[8,o.zBack-2]],14),Rt([[8,63],[18,72],[30,80],[45,87],[62,93.5],[100,104],[150,122],[200,150]],9)].map(g=>Jt(g,10)),te=[-1,1].map(g=>{const W=e.posAt(e.L-1.5,new t.Vector3),se=e.tanAt(e.L,new t.Vector3);return[W.x-se.z*g*Ta,W.z+se.x*g*Ta,g]}),w={h:0,tr:0,kind:0,lat:0,s:0,dO:0,dI:0,wall:0,hw:99,side:1},M=(g,W)=>{const se=e.oLine.near(g,W),ye=se.d,Y=se.side,R=e.iLine.near(g,W),V=R.d,j=R.side,Q=e.pathNear(g,W),X=Q.d,C=Q.s,ee=Y>0&&j<0,y=1.5*m.fbm2(g/150+3.1,W/150,3)+.25*m.n2(g/23,W/23),J=Math.hypot(g+60,W-20),oe=26*u(330,900,J)*(.55+.45*m.fbm2(g/420,W/420+7,3));let K,E=0,he=0,me=0,ze=99,le=0;if(ee)E=1,K=i-Math.min(3,.5+ye*.9,.05+Math.min(V,11)*.05+u(11,14.5,V)*.75+Math.max(0,V-12)*.12);else if(Y<=0&&(j<=0||ye<V)){const ce=1-u(48,53,Math.abs(g)),de=o.lipZ(g),re=ce*u(c(g)-2,c(g)+1,W)*(W<de+8?1:0);let H=11+y+oe;const ue=o.topY(g),ie=(1-u(56,80,Math.abs(g)))*u(o.zBack-60,o.zBack-16,W)*(1-u(de+2,de+30,W));H=pe(H,ue,ie),H=pe(H,o.lipY(g)-.6,re);const Be=1.7*ce;K=i-.6+(H-i+.6)*Math.pow(Ze((ye-Be)/2.3,0,1),.5),ye<3.5+Be&&(me=1),he=Math.max(he,(1-u(L+2,L+12,Math.abs(g)))*u(o.zBack-90,o.zBack-20,W)*(W<de+2?1:0)),le=he}else{E=2;const ce=1.5*m.n2(g/17,W/17),de=i-.05+Math.min(V,14)*.11,re=i+7+7*u(12,62,V)+y*.6+oe,H=u(9+ce,40+ce,V);K=pe(de,re,H)}if(E!==1){if(C<e.sLip+3){const ce=e.pathY(C)-1.5;if(C>e.sGully-30){const de=pe(6.6,4.9,u(e.sGully,e.sLip-30,C))+14*(1-u(e.sGully-30,e.sGully+22,C))+.5*m.n2(C*.09,Q.side*3.3);ze=de;const re=X-de-2.4,H=ce+(re<=0?0:Math.min(re*5.5,1.3+re*2.7)+.55*m.n2(C*.16+Q.side*9,re*.9)*Math.min(1,re));H<K&&(K=H,re>.02&&(me=1)),re<.6&&(he=1)}E===0&&C<e.sGully+8&&(K=pe(Math.min(K,ce),K,u(7,24,X)));{const de=u(36,96,C);he=Math.max(he,1-u(pe(0,1.2,de),pe(.4,4.6,de),X))}}else if(C>e.sBar-14){const ce=e.pathY(C)-1.5,de=Ba(e,C);ze=de,K<ce&&X<de+12&&(K=pe(ce,K,u(de-1,de+12,X)));const re=X-de-2.4,H=re<=0?0:Math.min(re*5.5,1.3+re*2.7),ue=ce+H+(re<=0?0:.55*m.n2(C*.16+Q.side*9,re*.9)*Math.min(1,re));if(ue<K&&(K=ue,re>.02&&(me=1)),re>0){const ie=xo(e,C,Q.side),Be=ce+Math.min(H,ie*(1+.1*m.n2(C*.11+Q.side*5,re*.3)))*(1-u(4,14,re));Be>K&&(K=Be,H<ie&&(me=1))}re<.6&&(he=Math.max(he,1-u(1,3.4,X),u(-1.2,.3,re)*.6))}for(const ce of B){const de=ce.near(g,W);de.d<9&&(le=Math.max(le,1-u(3.2,8.5,de.d)),he=Math.max(he,le))}}return w.h=K,w.tr=he,w.kind=E,w.lat=X,w.s=C,w.dO=ye,w.dI=V,w.wall=me,w.side=Q.side,w.hw=ze,w.trO=le,w},O=(g,W)=>M(g,W).h,d=(g,W,se)=>new t.Color(g,W,se),F=d(.58,.49,.29),l=d(.52,.39,.22),S=d(.48,.37,.24),_=d(.52,.38,.25),I=d(.46,.29,.19),s=d(.62,.55,.42),p=d(.24,.2,.155),D=d(.55,.49,.38),U=d(.25,.33,.13),z=d(.15,.11,.07),b=new t.Color;return{sample:M,height:O,color:(g,W,se,ye,Y)=>{const R=M(g,W),V=m.n2(g*.045+9,W*.045),j=m.n2(g*.21,W*.21);if(Y.copy(F).lerp(l,.55*u(-.25,.65,V)),v.grass>0&&Y.lerp(U,v.grass*u(-.5,.4,m.n2(g*.02,W*.02+5))),Y.multiplyScalar(.86+.24*j),Y.lerp(b.copy(S).multiplyScalar(.9+.16*j),R.tr*.92),R.kind===1)Y.copy(z);else if(R.kind===2){const X=1-u(10,15,R.dI);Y.lerp(b.copy(D).lerp(p,u(-.3,.5,j)*.7+.3*(1-u(0,5,R.dI))),X)}const Q=1-u(.55,.82,ye);if(Q>0){const X=se+1.1*m.n2(g*.035,W*.035),C=m.n2(7.7,X*.5);b.copy(_).lerp(I,Ze(.45+.7*C,0,1)),b.lerp(s,.4*Math.max(0,1-Math.abs(X-7.4)/.8)),Y.lerp(b,Q)}return se<i+.9&&R.kind!==1&&Y.multiplyScalar(pe(.6,1,u(i+.1,i+.9,se))),Y},tracks:B,figs:te,zB:c}}const Ha=[[2.5,.5,.11,.3],[-2.6,.55,.09,2.1],[4.3,.7,.07,4],[-4.5,.6,.08,1.2],[6.6,.8,.06,5.2],[-6.9,.8,.05,3.3]],ka=(a,e)=>{let h=1-u(.3,.8,Math.abs(e));for(const i of Ha)h=Math.max(h,.9*(1-u(.22,.6,Math.abs(e-i[0]-i[1]*Math.sin(a*i[2]+i[3])))));return h*(1-u(36,96,a))},Pt=22,$a=[-.4,-3.4],Za=[9.6,11.6,4,5.5,0,2,1,3.2,9.6,11.6,4,0,0,2.5,1.2,3.4,4.4,1.8,.6,2.6,1.4,2.2],Qa=[.33,.52],Et=[.9,.94,1,.92,1.1,1.3,1.22,1.42],ma=a=>1-u(.035,.085,a),zo=a=>Math.max(1-u(.66,.84,a),.8*(1-u(.86,5.2,a))),Xa=13.3,Mo=8,So=[-1.1,1.1,.12,-2.85,2.85,3.72,4.6,-3.73,-4.9,5.4],Ja=[-3.73,-4.9,5.4],ko=20,Ga=14,Aa=[1.4,7.6],dt=-3,zt=18.5,Ya=a=>a>1?2.45:2.9;function Ao(a,e,h,i){const v=[],m=new t.Vector3,o=new t.Vector3,L=a.core.makeRng(a.core.hashSeed("lead-wander:"+a.seed)),P=[0,1].map(()=>({a:L.range(.3,.36),w:6.2832/L.range(6,9),p:L()*6.2832})),c=(I,s)=>{const p=P[I>0?1:0];return p.a*Math.sin(s*p.w+p.p)},r=I=>{const s=Math.abs(I);return s<2||s>2.39&&s<2.42},B=I=>{const s=new Float32Array(ct*4),p=new Float32Array(ct*4);let D=0,U=0;for(let z=0;z<ct;z++){const b=I[Math.min(z,I.length-1)],x=I[Math.min(z+1,I.length-1)];if(z>0){const g=I[Math.min(z-1,I.length-1)];D+=Math.hypot(b[0]-g[0],b[2]-g[2])}b[1]<i-.45?U=1:U=Math.max(0,U-pt/Ga),s.set([b[0],b[1],b[2],D],z*4),p.set([b[3],U,Math.hypot(x[0]-b[0],x[2]-b[2])/pt,b[3]<.5&&b[1]>i+.15?1:0],z*4)}return v.push({a:s,b:p}),v.length-1},te=(I,s,p)=>{const D=Math.abs(I),U=Math.sign(I);if(D<2){let g=Ya(D);return p&&(g+=Xa*(1-u(48,84,s))),U*g}let z=pe(1.5,1,u(e.sGully-30,e.sGully+12,s));z=pe(z,1,u(e.sLip+6,e.sSplash+14,s));const b=s<e.sLip+12?s>e.sGully-30?pe(6.6,4.9,u(e.sGully,e.sLip-30,s))+14*(1-u(e.sGully-30,e.sGully+22,s))-.35:99:s>e.sBar-14?Ba(e,s):99;z=Math.min(z,pe(Math.max(.45,(b-.62-2.4)/2.6),9,u(e.sLip-4,e.sLip+10,s)));let x=2.4+(D-2.4)*z;return Ja.includes(I)&&(x+=ko*(1-u(e.sGully-50,e.sGully-10,s))),p&&(x+=(Ja.includes(I)?Mo:Xa)*(1-u(48,84,s))),D<2.5&&(x+=(U<0?$a[0]:$a[1])*u(e.sLip-16,e.sLip+3,s)*(1-(U<0?u(e.sSplash+12,e.sSplash+30,s):u(e.sSplash+2,e.sSplash+13,s)))),D>2.405&&D<2.45?x+=(U<0?10.6:8.2)*u(e.sWade-16,e.sWade+3,s)*(1-u(e.sExit+2,e.sExit+24,s)):D>3.305&&D<3.32||D>4.155&&D<4.17?x+=(D<4?10:12.5)*u(e.sWade-12,e.sWade+4,s):x+=(D<2.5?1.2:U<0?3+(D-3.3)*1.4:1.2+(D-2.4)*.75)*u(e.sWade-16,e.sWade+3,s)*(1-u(e.sBar-4,e.sExit+5,s))+(U<0&&D>2.5?2.8*u(e.sWade-10,e.sWade+4,s)*(1-u(e.sWade+8,e.sWade+18,s)):0),x=pe(x,Math.max(x,6.75+Math.min(D-2.4,2.6)*.5),u(e.L-17,e.L-4,s)),U*x},w=e.timeAtU((e.sLip-22)/e.L),M=e.timeAtU((e.sLip+4)/e.L),O=e.timeAtU((e.sGully-10)/e.L),d=e.timeAtU((e.sGully+22)/e.L),F=new Map;return{lanes:v,column:(I,s=0,p=!0,D=!1)=>{const U=[],z=r(I),b=I+":"+s+":"+D,x=p?null:F.get(b);p&&F.set(b,U);for(let g=0;g<ct;g++){const W=-Nt+g*pt,se=e.distAtTime(W+(D?.68*u(w,M,W)-.08*u(O,d,W):0)+(z?c(I,W):0));if(x&&se>84.5){U.push(x[g]);continue}e.posAt(se,m),e.tanAt(se,o);const ye=1/Math.max(1e-4,Math.hypot(o.x,o.z)),Y=te(I,se,p),R=m.x-o.z*ye*Y,V=m.z+o.x*ye*Y,j=h.height(R,V);let Q=Math.max(j,i-1.14),X=0;const C=se-s*u(e.sLip-1,e.sLip+7,se);if(se>e.sLip-2&&C<e.sSplash+3){const ee=e.pathY(C)-1.5-.04*Math.abs(Y);ee>Q+.02&&(ee>j+.3&&se>e.sLip-.5&&ee>i+.05&&(X=1),Q=ee)}D&&se>e.sSplash&&(Q=Math.min(Q,i-1.2-3.6*u(e.sSplash,e.sSplash+5,se))),U.push([R,Q,V,X])}return B(U)},free:(I,s,p,D=2.7)=>{const U=[];let z=0,b=0;for(;z<I.length&&U.length<ct-2&&b++<4e3;){const x=z/I.length*(I.pts.length-1),g=Math.min(I.pts.length-2,Math.floor(x)),W=I.pts[g],se=I.pts[g+1],ye=x-g,Y=se[0]-W[0],R=se[1]-W[1],V=1/Math.max(1e-4,Math.hypot(Y,R)),j=W[0]+Y*ye-R*V*s,Q=W[1]+R*ye+Y*V*s,X=h.height(j,Q),C=Math.max(X,i-1.14);U.push([j,C,Q,0]),z+=(C<i-.7?D:C<i+.4?5:p)*pt}return{row:B(U),period:(U.length-1)*pt}},track:(I,s=-1,p=Ot+3)=>{const D=[],U=Math.min(ct-2,Math.ceil((p-s)/pt));for(let z=0;z<U;z++){const b=s+z*pt,x=e.distAtTime(b),g=I(x,b),W=x+g[0];e.posAt(W,m),e.tanAt(W,o);const se=1/Math.max(1e-4,Math.hypot(o.x,o.z)),ye=m.x-o.z*se*g[1],Y=m.z+o.x*se*g[1];D.push([ye,Math.max(h.height(ye,Y),i-1.14)-g[2],Y,0])}return{row:B(D),period:(D.length-1)*pt,t0:s}},wander:c,colLat:te}}function Co(a){const e=a.length*2,h=new Float32Array(ct*e*4);a.forEach((v,m)=>{h.set(v.a,m*2*ct*4),h.set(v.b,(m*2+1)*ct*4)});const i=new t.DataTexture(h,ct,e,t.RGBAFormat,t.FloatType);return i.minFilter=i.magFilter=t.NearestFilter,i.generateMipmaps=!1,i.needsUpdate=!0,i}function Ca(a,e,h){const i=Ze(e/pt,0,ct-1.001),v=Math.floor(i),m=i-v,o=a.a;return h.set(pe(o[v*4],o[v*4+4],m),pe(o[v*4+1],o[v*4+5],m),pe(o[v*4+2],o[v*4+6],m)),h}const eo=1.4,Lo=20,La=`
uniform highp sampler2D uLane; uniform float uClock, uPrev, uPrevF, uSurge, uLandT[${Pt}]; uniform vec2 uPart;
float gPart = 1., gRate = 0.;        // how far this animal stands aside at the entry, and how fast it is closing in
vec4 laneT(int k, int row){ return texelFetch(uLane, ivec2(clamp(k, 0, ${ct-1}), row), 0); }
// returns lane time; vis = fade at the ends of the slot's run
float laneTime(vec4 L, out float vis){
  if (L.w < 0.) { float oe = mod(L.y + uPrev * L.z - (${dt.toFixed(1)}), ${zt.toFixed(1)}) + (${dt.toFixed(1)});
    vis = smoothstep(${dt.toFixed(1)}, ${(dt+.6).toFixed(1)}, oe) * (1. - smoothstep(${(dt+zt-1.5).toFixed(1)}, ${(dt+zt).toFixed(1)}, oe));
    // the column stands apart round the way in: whoever is within 9 m ahead stands right aside, the lines beyond are a V
    // that closes on the plume: eleven metres either side of us at fifteen metres, shoulder to shoulder with the lane ahead at sixty
    // (the lines dead ahead stand in the arms with the rest: the way between the arms is open ground to the plume's foot)
    float g2 = .8 * (1. - smoothstep(.86, 5.2, oe));
    float g = max(1. - smoothstep(.66, .84, oe), g2); gPart = uPart.x * g; gRate = uPart.y * g;
    return L.z * uClock + oe + ${Nt.toFixed(1)} + .03 * sin(uSurge * .29 + L.y * 7.3) + .012 * sin(uSurge * .83 + L.y * 17.); }       // each eases forward and back in its place: a formation, not a frieze
  gPart = 1.; gRate = 0.;
  float tau = mod(uClock + uPrevF * L.z + L.y, L.w);                      // (rate 0: a companion keyed to our own clock, which the preview does not advance)
  // a companion keyed to our own clock runs its track once: before its run begins and after it has ended it is not drawn
  if (L.z == 0.) tau = clamp(uClock + L.y, 0., L.w);
  vis = smoothstep(0., 1.4, tau) * (1. - smoothstep(L.w - 1.6, L.w - .2, tau));
  return tau;
}
void lanePos1(float tt, int row, out vec4 P, out vec4 dP){
  float f = clamp(tt / ${pt.toFixed(2)}, 1., ${(ct-3).toFixed(1)}); int k = int(floor(f)); float a = f - float(k);
  vec4 p0 = laneT(k - 1, row), p1 = laneT(k, row), p2 = laneT(k + 1, row), p3 = laneT(k + 2, row);
  vec4 c1 = .5 * (p2 - p0), c2 = p0 - 2.5 * p1 + 2. * p2 - .5 * p3, c3 = .5 * (p3 - p0) + 1.5 * (p1 - p2);
  P = p1 + a * (c1 + a * (c2 + a * c3));
  dP = (c1 + a * (2. * c2 + 3. * a * c3)) / ${pt.toFixed(2)};
}
// column lanes (the first 2 x NCOL rows) are baked twice: parted round the entry ring, and (2 x NCOL rows further on) running straight up the lane
void lanePos(float tt, int row, out vec4 P, out vec4 dP){
  lanePos1(tt, row, P, dP);
  // (the closing speed added to the lane's own is held to the tangent of CLOSE_TURN times the lane's speed)
  if (gPart < .999 && row < ${2*Pt}) { vec4 Q, dQ; lanePos1(tt, row + ${2*Pt}, Q, dQ); dP = mix(dQ, dP, gPart); vec2 cl = (P.xz - Q.xz) * gRate; dP.xz += cl * min(1., ${Math.tan(Lo*Math.PI/180).toFixed(4)} * length(dP.xz) / max(length(cl), 1e-4)); P = mix(Q, P, gPart); }
}
// the lane's own direction of travel where the animal is (xy: a unit vector on the ground plan) and the climb of the ground along it
// (z: metres up to a metre run), taken over the lane's texels either side of the animal
vec3 laneRun(float tt, int row){
  float f = clamp(tt / ${pt.toFixed(2)}, 1., ${(ct-3).toFixed(1)}); int k = int(floor(f));
  vec4 c = laneT(k + 2, row) - laneT(k - 1, row);
  if (gPart < .999 && row < ${2*Pt}) c = mix(laneT(k + 2, row + ${2*Pt}) - laneT(k - 1, row + ${2*Pt}), c, gPart);
  float l = length(c.xz);
  return l > 1e-3 ? vec3(c.xz, c.y) / l : vec3(0.);
}
vec4 laneAux(float tt, int row){
  float f = clamp(tt / ${pt.toFixed(2)}, 1., ${(ct-3).toFixed(1)}); int k = int(floor(f));
  return mix(laneT(k, row + 1), laneT(k + 1, row + 1), f - float(k));
}
`,to=`
float cap(vec2 p, vec2 a, vec2 b, float r){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0., 1.); return length(pa - ba * h) - r; }
float ell(vec2 p, vec2 c, vec2 r){ return (length((p - c) / r) - 1.) * min(r.x, r.y); }
float leg(vec2 q, vec2 hip, float a, float run){ float sw = .45 * run, lift = .2 * run * max(cos(a), 0.); return cap(q, hip, vec2(hip.x + sw * sin(a), lift), .05); }
float beastSil(vec2 q, float run, float gait, float a, float plain){
  float d = ell(q, vec2(0., .98), vec2(.7, .29));                                    // barrel
  d = min(d, ell(q, vec2(.36, 1.13), vec2(.37, .28)));                               // the hump of the withers
  d = min(d, ell(q, vec2(-.48, .97), vec2(.3, .26)));                                // the sloping quarters
  vec2 nk = vec2(.6, 1.1), hp = mix(vec2(.84, .3), vec2(1.04, .86 + .05 * sin(a + 1.) * gait), run);    // head down grazing, or carried low and forward
  d = min(d, cap(q, nk, hp, .13));
  d = min(d, cap(q, hp, hp + mix(vec2(.09, -.15), vec2(.17, -.13), run), .085));     // the long face
  d = min(d, cap(q, hp + vec2(-.07, .09), hp + vec2(-.03, .26), .03) + plain);       // horns
  d = min(d, cap(q, nk + vec2(.08, -.2), mix(nk, hp, .75) + vec2(-.02, -.2), .05) + plain);     // beard
  d = min(d, cap(q, vec2(-.76, 1.05), vec2(-.96 - .12 * gait, .6 + .25 * gait), .03));
  d = min(d, leg(q, vec2(.42, .8), a, gait)); d = min(d, leg(q, vec2(.36, .8), a + .9, gait));
  d = min(d, leg(q, vec2(-.5, .8), a + 2.6, gait)); d = min(d, leg(q, vec2(-.56, .8), a + 3.5, gait));
  return d;
}
// the same animal seen end on, going away or coming: the round of the quarters, the hump beyond, a horn either side, two pairs of legs
float beastRear(vec2 q, float gait, float a, float plain){
  float d = ell(q, vec2(0., .98), vec2(.3, .4));
  d = min(d, ell(q, vec2(0., 1.31), vec2(.19, .2)));
  vec2 m = vec2(abs(q.x), q.y);
  d = min(d, cap(m, vec2(.08, 1.43), vec2(.25, 1.4), .03) + plain); d = min(d, cap(m, vec2(.25, 1.4), vec2(.29, 1.53), .024) + plain);
  d = min(d, cap(q, vec2(0., 1.05), vec2(.05 * sin(a), .5), .028));
  float l0 = .24 * gait * max(cos(a), 0.), l1 = .24 * gait * max(cos(a + 3.1), 0.);
  d = min(d, cap(q, vec2(-.16, .8), vec2(-.17, l0), .052)); d = min(d, cap(q, vec2(.16, .8), vec2(.17, l1), .052));
  d = min(d, cap(q, vec2(-.09, .8), vec2(-.08, l1 * .8), .045)); d = min(d, cap(q, vec2(.09, .8), vec2(.08, l0 * .8), .045));
  return d;
}
`,Po=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aAnim; attribute vec3 aPivot, aSwim, aSwimN; attribute float aGlow;
attribute vec4 iL, iD; attribute vec3 iTint;
uniform float uTime, uWaterY; uniform vec4 uWaveP;
varying vec3 vCol, vN, vW, vLp; varying float vWet, vVis, vMask;
${lt}
${La}
vec2 rotP(vec2 yz, float a){ float c = cos(a), s = sin(a); return vec2(yz.x * c - yz.y * s, yz.y * c + yz.x * s); }
void main(){
  float seed = iD.x, size = iD.y, vis; int row = int(iL.x + .5) * 2;
  float tt = laneTime(iL, vis); vec4 L, dL; lanePos(tt, row, L, dL); vec4 aux = laneAux(tt, row);
  // a body heads the way it goes over the ground. When its own speed over the ground falls under a walking pace it holds its lane's
  // direction of travel (it does not spin round), and between a walk and twice a walk it comes round to its own way again (own)
  float gs = length(dL.xz), v = max(gs, .5), own = smoothstep(${eo.toFixed(1)}, ${(2*eo).toFixed(1)}, gs); vec3 run = laneRun(tt, row);
  vec2 hd = mix(run.xy, dL.xz / v, own); hd /= max(length(hd), 1e-3);
  float wAir = smoothstep(.15, .6, aux.x), deep = 1. - smoothstep(uWaterY - 1.06, uWaterY - .8, L.y), wSwim = deep * (1. - wAir);
  // heaving out: where the bottom comes up under them they get their feet down and surge: chest and head up, forelegs striking out of the water
  float wWade = (1. - deep) * (1. - smoothstep(uWaterY - .1, uWaterY + .25, L.y)) * (1. - wAir), heave = wWade * (1. - smoothstep(uWaterY - .8, uWaterY - .15, L.y));
  // the plunge: whoever comes down off the leap goes right under and comes up swimming (nobody lies on the water)
  float dl = iL.w < 0. ? tt - uLandT[clamp(row / 2, 0, ${Pt-1})] : -1., pk = clamp(dl / .9, 0., 1.), under = dl > 0. ? sin(pk * PI) : 0.;
  wSwim = max(wSwim, smoothstep(0., .12, dl) * (1. - smoothstep(.9, 1.2, dl)));
  float stride = 4.5 * size * mix(.42, 1., smoothstep(3., 9., v)), cyc = L.w / stride + seed * 7.;
  float runW = (1. - wAir) * (1. - wSwim);
  float bob = .05 * sin(cyc * 6.2832 + 1.) * runW * (1. + 1.5 * wWade), crouch = .11;
  float feet = mix(L.y, uWaterY - ${mo.toFixed(2)} * size + .04 * sin(uTime * 2.6 + seed * 40.), wSwim) + min(L.y - uWaterY + 1.2, 0.) * wSwim;
  vec3 P = vec3(L.x - hd.y * iD.w, feet + (${Sa.toFixed(2)} - crouch * (1. - wSwim) + bob) * size, L.z + hd.x * iD.w);
  P.y -= 1.45 * size * under;
  float hv = heave * (.26 + .1 * sin(cyc * 6.2832 + .8)); P.y += hv * size;                    // it bounds: the chest comes clear of the water at every surge
  float wr = length(P.xz - uWaveP.xy) - uWaveP.z, wg = uWaveP.w * exp(-wr * wr * .08) * wSwim; P.y += .05 * wg;       // the slab's wave lifts each swimmer as it passes
  // its pitch is the slope of its own track, the rise over the run (under a walking pace: the slope of the ground along its lane alone)
  float pitch = atan(mix(-run.z, -dL.y / max(v, 3.), own)) * .85 * (1. - wSwim) * (1. - wWade) + (.06 - .03 * wWade) * sin(cyc * 6.2832 + 2.4) * runW - .035 * heave + (.025 * sin(uTime * 2.3 + seed * 30.) - .1 * wg) * wSwim;      // (in the shallows it goes level: back flat, head and horns up)
  float neckA = .1 + .14 * sin(cyc * 6.2832 + .6);
  float fall = smoothstep(.5, -3., dL.y);
  neckA = mix(neckA, mix(-.32, .12, fall), wAir);
  neckA = mix(neckA, -.34 + .06 * sin(cyc * 6.2832 + .6), wWade * .85);
  float tailUp = mix(mix(.4, 1.1, wAir), .15, wSwim);
  vec3 p = position, n = normal; float part = aAnim.z;
  if (part > .5 && part < 1.5) {
    bool front = aPivot.z > 0.; float side = aPivot.x > 0. ? 1. : 0.;
    float jy = aPivot.y, l1 = jy * .5, duty = .24, Ls = stride / size * duty;
    float ph = fract(cyc + (front ? .45 : 0.) + side * .11), dz, lift;
    if (ph < duty) { dz = Ls * (.5 - ph / duty); lift = 0.; }
    else { float e = (ph - duty) / (1. - duty); dz = Ls * (e * e * (3. - 2. * e) - .5); lift = (front ? .34 : .26) * (1. + (front ? 1.2 : .5) * wWade) * sin(e * PI); }
    vec2 T = vec2(crouch - bob + lift, aPivot.z + dz);
    T = vec2(${Sa.toFixed(2)}, 0.) + rotP(T - vec2(${Sa.toFixed(2)}, 0.), -pitch * runW);
    float jit = sin(uTime * 13. + seed * 9. + side * 2. + (front ? 0. : 1.7));
    vec2 Tf = front ? mix(vec2(.52, aPivot.z + .12), vec2(.17, aPivot.z + .42), fall) : mix(vec2(.3, aPivot.z - .55), vec2(.42, aPivot.z + .04), fall);
    Tf.y += .07 * jit; T = mix(T, Tf, wAir);
    float rc = cyc * 6.2832 + side * 3.1416, sk = smoothstep(-.3, .75, sin(rc));
    if (front) T = mix(T, vec2(mix(.05, .64, sk), aPivot.z + mix(-.06, .56, sk)), heave * .9); else T.x -= hv;      // one foreleg strikes forward clear of the water while the other is planted, turn about; the hind legs drive off the bottom
    vec2 hip = vec2(jy, aPivot.z), dd = T - hip;
    float dist = clamp(length(dd), .08, 2. * l1 * .999);
    float beta = atan(dd.y, max(-dd.x, .02)), A = acos(clamp(dist / (2. * l1), -1., 1.));
    float ua = beta + (front ? A : -A);
    vec2 knee = hip + l1 * vec2(-cos(ua), sin(ua));
    float la = atan(T.y - knee.y, knee.x - T.x + 1e-4);
    float w = smoothstep(.42, .58, aAnim.y);
    vec2 up = hip + rotP(p.yz - hip, -ua), lo = knee + rotP(p.yz - vec2(jy - l1, aPivot.z), -la);
    p.yz = mix(up, lo, w); n.yz = mix(rotP(n.yz, -ua), rotP(n.yz, -la), w);
  } else if (part > 1.5 && part < 2.5) {
    if (aAnim.w > 1.5 && iD.z > .5) p = mix(p, vec3(sign(p.x) * .05, 1.36, 1.04), .6);
    float a = neckA * aAnim.x;
    p.yz = aPivot.yz + rotP(p.yz - aPivot.yz, a); n.yz = rotP(n.yz, a);
  } else if (part > 2.5) {
    float w = aAnim.y, a = w * (tailUp + .25 * sin(cyc * 12.566 + seed));
    p.yz = aPivot.yz + rotP(p.yz - aPivot.yz, a); n.yz = rotP(n.yz, a);
    p.x += w * w * .16 * sin(uTime * 9. + seed * 20.);
  }
  // swimming: the baked pose (head low and forward, chin on the water, the withers awash), with a slow nod of the head
  if (wSwim > 0.) {
    vec3 sp = aSwim, sn = aSwimN;
    if (part > 1.5 && part < 2.5) { float na = .045 * sin(uTime * 2.3 + seed * 40.) * aAnim.x; sp.yz = aPivot.yz + rotP(sp.yz - aPivot.yz, na); sn.yz = rotP(sn.yz, na); if (aAnim.w > 1.5 && iD.z > .5) sp = mix(sp, vec3(sign(sp.x) * .05, 1.42, 1.1), .6); }
    p = mix(p, sp, wSwim); n = mix(n, sn, wSwim);
  }
  vec3 b = p - vec3(0., ${Sa.toFixed(2)}, 0.);
  b.yz = rotP(b.yz, pitch); n.yz = rotP(n.yz, pitch);
  // out of the river it shakes itself: once, a second long, a few seconds after its feet are on dry ground (the spray it throws is a sprite of its own)
  float sk = ((1. - aux.y) * ${Ga.toFixed(1)} - (${Aa[0].toFixed(1)} + ${Aa[1].toFixed(1)} * fract(seed * 13.7))) / 1.;
  float shake = aux.y > .02 ? step(uWaterY + .3, L.y) * smoothstep(0., .1, sk) * (1. - smoothstep(.5, 1., sk)) : 0.;
  float roll = .1 * sin(uTime * 3. + seed * 11.) * wAir + .05 * sin(uTime * 2.6 + seed) * wSwim + .15 * shake * sin(uTime * 39. + seed * 9.) * (.5 + .5 * smoothstep(.6, 1.3, position.y));
  float cr = cos(roll), sr = sin(roll); b.xy = vec2(b.x * cr - b.y * sr, b.y * cr + b.x * sr); n.xy = vec2(n.x * cr - n.y * sr, n.y * cr + n.x * sr);
  b.xz = vec2(b.x * hd.y + b.z * hd.x, b.z * hd.y - b.x * hd.x); n.xz = vec2(n.x * hd.y + n.z * hd.x, n.z * hd.y - n.x * hd.x);
  vec3 wp = P + b * size;
  vW = wp; vN = n; vLp = position; vMask = aGlow; vCol = color * iTint;
  vWet = max(aux.y, wSwim); vVis = vis;
  vec4 mvPosition = modelViewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Fo=8,Uo=45,_a=a=>a.sGully-Fo;function qa(a,e){const h=_a(a),i=a.posAt(h,new t.Vector3),v=a.tanAt(h,new t.Vector3),m=1/Math.max(1e-4,Math.hypot(v.x,v.z)),o=i.x-v.z*m*12,L=i.z+v.x*m*12;return new t.Vector3(o,e.height(o,L),L)}const Do=(a,e)=>{const h=a.posAt(e,new t.Vector3),i=a.tanAt(e,new t.Vector3),v=1/Math.max(1e-4,Math.hypot(i.x,i.z));return{p:h,f:new t.Vector3(i.x*v,0,i.z*v),r:new t.Vector3(-i.z*v,0,i.x*v)}};function ao(a,e,h,i,v,m){const o=Do(a,i*a.L);let L=null;for(const[P,c]of v){const r=o.p.clone().addScaledVector(o.r,c).addScaledVector(o.f,P),B=e.sample(r.x,r.z);if(B.kind===1&&B.h<h-m){L=r;break}}return L||(L=o.p.clone().addScaledVector(o.r,9)),{at:L,fr:o}}function oo(a,e,h,i){const{at:v,fr:m}=ao(a,e,h,ra,[[5,14],[5,13.4],[6,13],[4,13.5],[7,12.6],[4,12],[8,12],[5,11],[5,10]],1.2),o=m.p,L=new t.Vector3(v.x-o.x,0,v.z-o.z).normalize(),P=new t.Vector3(-L.z,0,L.x),c=Math.atan2(i.x,i.z);return{at:v,sd:L,sr:P,fH:m,yaw:c,poi:new t.Vector3(v.x+Math.sin(c)*.9,h+1.35,v.z+Math.cos(c)*.9)}}function no(a,e,h){const{at:i,fr:v}=ao(a,e,h,Da,[[7,13],[6,13],[8,12.6],[5,12.6],[7,12],[9,12],[7,11]],1);return{at:i,f:v.f,r:v.r,yaw:Math.atan2(v.f.x*.25-v.r.x*.95,v.f.z*.25-v.r.z*.95),sL:Da*a.L}}const Bo=13,To=14;function Go(a,e,h,i){const v=no(a,e,h),m=oo(a,e,h,i),o=new t.Vector3(v.at.x,h+.5,v.at.z),L=new t.Vector3,P=ra*a.L;return{at:(c,r)=>L.copy(o).lerp(m.poi,u(v.sL,P,(r??0)*a.L)),from:(v.sL-Bo)/a.L,to:(P+To)/a.L,weight:.6}}const _o=1.3;function qo(a,e){const h=qa(a,e);h.y+=9;const i=new t.Vector3,v=1,m=3,o=8,L=Math.ceil(a.sLip/m),P=new Float32Array(L+1),c=new t.Vector3,r=new t.Vector3,B=e.sample(a.posAt(0,c).x,c.z).hw;for(let w=0;w<=L;w++){a.posAt(Math.min(w*m,a.sLip),c),a.tanAt(Math.min(w*m,a.sLip),r);const M=1/Math.max(1e-4,Math.hypot(r.x,r.z));for(const O of[-1,1]){const d=-r.z*M*O,F=r.x*M*O,l=e.sample(c.x+d,c.z+F),S=l.hw,_=l.h;if(S>=B)continue;let I=!1,s=_;for(let p=S;p<=S+o;p+=.5){const D=e.sample(c.x+d*p,c.z+F*p);if(D.wall)I=!0,s=D.h;else if(I){s=D.h;break}}P[w]+=.5*Math.max(0,s-_)}}return[{at:(w,M)=>{const O=Ze(M??0,0,1)*a.L,d=Math.min(O+46,a.sLip-4),F=d/m,l=Math.min(L-1,Math.floor(F));return a.posAt(d,i),i.y+=5.5+v*pe(P[l],P[l+1],F-l),i},from:.05,to:a.sLip/a.L,weight:.6},{at:h,from:0,to:_a(a)/a.L,weight:.42}]}async function Ko(a,e,h,i,v,m){const o=a.rng.fork("herd"),L=i.uniforms,P=Ao(a,e,h,v),c=m.density,r=[],B=(n,k=o)=>{const G=k.range(.66,1.05),Z=k.range(-.05,.06);return n?[2.4*G,1.8*G,1.2*G]:[G*(1.03+Z),G,G*(.98-Z)]},te=(n=o)=>{const k=n.range(.56,.66);return[k,k*.96,k*.88]},w=(n,k,G,Z,N,q,A,ve,ge,xe=o)=>{const fe=ve==="calf"||!N&&!ve&&xe.chance(.2),Ae=N?xe.range(.9,.98):fe?xe.range(.68,.8):xe.range(.93,1.1),Qe=ge||Ae;r.push({row:n,o:k,r:G,period:Z,seed:xe(),size:Qe,calf:fe?1:0,jit:A,kind:N?q===1||q===2?"zx":"z":q===2?"x":q===3?"f":q?"hi":"lo",tint:N?te(xe):B(fe,xe)})},M=[-2.4,2.4,-3.3,3.3,-4.15,4.15,-5,5,-2.41,2.41,-3.31,-4.16,...So],O=[],d=new Set,F=[],l=M.map(()=>1),S=[],_=new Set,I=n=>Math.sign(n)*(Math.abs(n)<2?Ya(Math.abs(n)):2.4+(Math.abs(n)-2.4)*1.5),s=a.rng.fork("herd-more"),p=o.chance(.5)?1:-1,D=(e.sWade-e.sSplash)/(e.timeAtU(e.sWade/e.L)-e.timeAtU(e.sSplash/e.L)),U=[[2,.8,0,1.08],[4,.2,0,1.12],[2,5.6,1,0],[4,4.4,1,0]];for(let n=0;n<M.length;n++){await a.yield();const k=M[n],G=P.column(k,Za[n],!0,n>=12);if(O.push(G),n>=12){const A=n-12;if(A<3){const ve=[.52,.66,.92][A],ge=[.52,.55,.7][A];for(let xe=ve;xe<5.4;xe+=ge*s.range(.9,1.12)){const fe=xe+s.range(-.04,.04);w(G,fe,1,-1,!1,xe<1.6?1:xe<3.2?0:3,s.range(-.2,.2),xe<2.6,void 0,s),d.add(r[r.length-1]),S.push([I(k),fe])}}else for(const[ve,ge,xe]of[[[.93,1],[1.27,1],[1.66,0]],[[.97,1],[1.33,1],[1.72,0]],[[.44,2],[.8,1],[1.16,1],[1.5,0]],[[.63,1],[1.02,1],[1.4,0]],[[.47,1],[.86,1],[1.22,0]],[[.5,1,1],[.74,1],[1.08,1],[1.45,0]],[[.52,1,1],[.84,1],[1.22,0]]][A-3]){const fe=ve+s.range(-.02,.02);w(G,fe,1,-1,!1,ge,s.range(-.12,.12),xe?"calf":!0,ge===2?1.04:void 0,s),d.add(r[r.length-1]),S.push([I(k),fe])}continue}if(n>=8)continue;const Z=[];if(n<2){for(let A=Qa[n];A<dt+zt-.4;A+=o.range(.5,.64)/Math.sqrt(c))Z.push(A);for(let A=Qa[n]-o.range(.62,.7);A>dt+.2;A-=o.range(.44,.6))Z.push(A)}else if(n<6)for(let A=dt+.25+o.range(0,.3);A<dt+zt-.4;A+=(A>-2.6&&A<4.2?o.range(.42,.66):o.range(.5,.86))/Math.min(c,1.06))Z.push(A);for(let A=Z.length-1;A>=0;A--)Z[A]>.6&&Z[A]<Et[n]+(n===3?.66:.3)&&Z.splice(A,1);Z.push(Et[n]);const N=U.filter(A=>A[0]===n).map(A=>({o:A[1]/D,zebra:A[2],size:A[3]}));for(const A of N){for(let ve=Z.length-1;ve>=0;ve--)Math.abs(Z[ve]-A.o)<.4&&Z.splice(ve,1);Z.push(A.o)}const q=A=>{let ve=!1;return n>=2&&Math.sign(k)<0&&A>.25&&A<1.5&&(ve=!0),n>=2&&Math.sign(k)===p&&A>2.6&&A<4&&(ve=!0),A>9&&A<10.2&&n>=4&&(ve=!0),Math.abs(A)<.75&&(ve=!1),ve};if(n<6)for(const A of Z){const ve=N.find(Qe=>Qe.o===A),ge=A===Et[n],xe=A>-.5&&A<.9?n<2?2:1:A>-1.2&&A<2.2?1:A>4.6?3:0;if(ve){w(G,A,1,-1,!!ve.zebra,2,0,!0,ve.size||void 0),d.add(r[r.length-1]),_.add(r[r.length-1]),F.push([r[r.length-1],n===2?10:11]);continue}let fe=m.zebraCast?o.chance(.22):!1;q(A)&&(fe=!0),Math.abs(A)<.75&&(fe=!1);const Ae=n<2?Math.sign(k)*o.range(0,.3):o.range(-.28,.28);w(G,A,1,-1,fe&&!ge,xe,ge?0:Ae,n<2&&A>-1&&A<2.2||ge),n<2&&A>-1&&A<2.2&&_.add(r[r.length-1])}if(n>=2){const A=[],ve=n>=6,ge=Z.slice().sort((fe,Ae)=>fe-Ae),xe=fe=>!(fe>.55&&fe<1)&&Math.abs(fe-Et[n])>.24&&!(n===3&&fe>Et[n]&&fe<Et[n]+.8)&&N.every(Ae=>Math.abs(Ae.o-fe)>.34);if(ve){for(let fe=dt+.3+s.range(0,.3);fe<dt+zt-.4;fe+=(fe>-1.1&&fe<6.2?s.range(.3,.46):s.range(.55,.9))/Math.min(c,1.06))xe(fe)&&A.push(fe);A.push(Et[n])}else for(let fe=0;fe<ge.length-1;fe++){const Ae=ge[fe+1]-ge[fe],Qe=ge[fe]+Ae*s.range(.42,.58);Qe>-1.1&&Qe<6.2&&Ae>.4&&xe(Qe)&&A.push(Qe)}for(const fe of A){const Ae=fe===Et[n],Qe=fe>-.9&&fe<1.7?1:fe>4.6?3:0,Ve=!Ae&&q(fe);w(G,fe,1,-1,Ve,Ve&&Qe===1?0:Qe,Ae?0:s.range(-.22,.22),Ae,void 0,s),Ae&&d.add(r[r.length-1])}}}{const n=a.rng.fork("herd-entry");for(const[k,G]of[[2,1.27],[0,1.32]])w(O[12+k],G,1,-1,!1,1,n.range(-.1,.1),!0,void 0,n),d.add(r[r.length-1]),S.push([I(M[12+k]),G])}{const n=new Set(O.slice(12,15)),k=new Map(O.map((q,A)=>[q,I(M[A])])),G=r.filter(q=>q.period<0&&!n.has(q.row)&&(q.row===O[0]||q.row===O[1]||d.has(q))),Z=[],N=r.filter(q=>n.has(q.row)).sort((q,A)=>q.o-A.o);for(const q of N){const A=ge=>xe=>Math.abs(k.get(xe.row)-k.get(q.row))<.4&&Math.abs(xe.o-ge)<.19,ve=S.findIndex(ge=>ge[1]===q.o);for(let ge=0;ge<=80;ge++){const xe=q.o+(ge&1?1:-1)*.05*(ge+1>>1);if(!(xe<.5||G.some(A(xe))||Z.some(A(xe)))){q.o=xe,ve>=0&&(S[ve][1]=xe);break}}Z.push(q),_.add(q)}}for(let n=0;n<M.length;n++)await a.yield(),P.column(M[n],Za[n],!1,n>=12);for(const[n,k]of F)n.row=O[k];for(const n of r)for(const k of[0,1])n.period<0&&n.row===O[k]&&n.o>-1&&n.o<1&&(n.row=O[8+k]);const z=a.core.makeRng(a.core.hashSeed("station-wander:"+a.seed)),b=(n,k)=>{const G=6.2832/z.range(7,11),Z=z()*6.2832,N=6.2832/z.range(9,14),q=z()*6.2832;return A=>[n*Math.sin(A*G+Z),k*Math.sin(A*N+q)]},x=n=>u(e.sWade,e.sBar,n),g=n=>2.6*(1-u(e.sLip,e.sSplash,n)),W=[[[5.2,1],[13,-4],1.06],[[1.4,4.6],[9.5,4],1.1],[[-6.5,-3.2],[14,-1.2],1.04],[[1.4,2.4],[-3,4.4],1.07]],se=W.map(([n,k])=>{const G=b(.5,.2);return(Z,N)=>{const q=x(Z),A=G(N);return[pe(n[0],k[0],q)+A[0],pe(n[1],k[1],q)+A[1],g(Z)]}}),ye=(n,k,G,Z,N,q)=>(Ca(P.lanes[n+Pt],G+k+Nt,N),Z>0&&(Ca(P.lanes[n],G+k+Nt,q),N.lerp(q,Z*zo(k))),N),Y=[[9.2,-8,.97],[12.6,-9.3,.93],[15.2,-7.8,.98],[13.4,-10.6,.7],[17.2,-9.6,.94]],R=2.4,V=Math.max(...Y.map(n=>n[1])),j=Math.min(...M.slice(0,8)),Q=new t.Vector3,X=new t.Vector3,C=O[M.indexOf(j)],ee=n=>n<0?n/e.v0:e.timeAtU(Math.min(1,n/e.L)),y=new t.Vector3,J=new t.Vector3,oe=new t.Vector3,K=new t.Vector3,E=Y.map(([n,k])=>{const G=b(.7,.3),Z=Ve=>{const Xe=ee(Ve-n);return ye(C,ee(Ve)-Xe,Xe,ma((Ve-n)/e.L),y,J),e.posAt(Ve,oe),e.tanAt(Ve,K),(-(y.x-oe.x)*K.z+(y.z-oe.z)*K.x)/Math.max(1e-4,Math.hypot(K.x,K.z))-R+(k-V)},N=Ve=>{e.posAt(Ve,Q),e.tanAt(Ve,X);const Xe=1/Math.max(1e-4,Math.hypot(X.x,X.z)),et=Z(Ve);return h.sample(Q.x-X.z*Xe*et,Q.z+X.x*Xe*et).hw},q=Math.ceil(e.sGully),A=e.sGully/q,ve=new Float32Array(q+1),ge=N(0),xe=N(e.sGully);let fe=0,Ae=0;for(let Ve=0;Ve<=q;Ve++){const Xe=N(Ve*A);Xe<ge&&(fe||(fe=Xe),Ae=Math.max(Ae,Ze((fe-Xe)/Math.max(.001,fe-xe),0,1))),ve[Ve]=Ae}const Qe=Ve=>{const Xe=Ze(Ve/A,0,q),et=Math.min(q-1,Math.floor(Xe));return pe(ve[et],ve[et+1],Xe-et)};return(Ve,Xe)=>{const et=Qe(Ve+n),ft=Math.max(0,Ve-e.sGully),Re=G(Xe);return[n+Re[0]+8*et-.85*ft,Z(Ve+n)+Re[1]-45*et-.5*ft,0]}}),he=a.rng.fork("elbows"),me=e.sLip-34,ze=.5,le=[-1,1].map(n=>{const k=n<0?2.5:2.85,G=-16,Z=[];let N=-1e9,q=e.sLip;const A=(ge,xe)=>{const fe=u(15,28,ge),Ae=u(me,me+17,ge),Qe=e.distAtTime(xe+P.wander(n,xe))-ge;return ge+pe(-7,k+Qe,fe)-9.5*Ae};for(let ge=G;ge<=e.L+1;ge++)N=Math.max(A(ge,ge<0?ge/e.v0:e.timeAtU(Math.min(1,ge/e.L))),N+ze),Z.push(N),N<e.sLip&&(q=ge);const ve=ge=>{const xe=Ze(ge-G,0,Z.length-1.001),fe=Math.floor(xe);return[pe(Z[fe],Z[fe+1],xe-fe)-ge,n*(2.4+1.4*(1-u(15,28,ge))),0]};return ve.t1=e.timeAtU(q/e.L),ve}),ce=[[0,6,-3.75,.96,"zx"],[2,6.5,-4.7,.92,"zx"],[4.5,9,-4.2,.95,"z"]],de=ce.map(([n,k,G])=>Z=>{const N=u(e.sWade-6+n,e.sBar+n,Z),q=u(e.sSplash+4,e.sSplash+40,Z);return[pe(k+5.5,k,N)+3*u(e.L-22,e.L,Z),pe(pe(-15-n,G-2.4,q),G,N),2.6*(1-u(e.sSplash+1+n,e.sSplash+7+n,Z))]}),re=[...se,...E,...le,...de];{const k=[3.2,-2,5],G=[2.7,1.05],Z=3,N=new t.Vector3,q=new t.Vector3,A=new t.Vector3,ve=[],ge=ke=>{e.posAt(ke,N),e.tanAt(ke,A);const De=1/Math.max(1e-4,Math.hypot(A.x,A.z)),Ie=e.timeAtU(ke/e.L),tt=[];for(const Oe of re){const mt=Oe(ke,Ie);mt[2]<.3&&tt.push(mt[0],mt[1])}ve.push({s:ke,t:Ie,x:N.x,z:N.z,fx:A.x*De,fz:A.z*De,gp:ma(ke/e.L),st:tt})};for(let ke=0;ke<=e.sLip;ke+=Z)ge(ke);for(let ke=e.sBar;ke<=e.L;ke+=Z)ge(ke);await a.yield();const xe=ke=>((ke-dt)%zt+zt)%zt+dt,fe=(ke,De)=>{const Ie=Math.abs(ke-De)%zt;return Math.min(Ie,zt-Ie)},Ae=(ke,De,Ie)=>{const tt=xe(De);ye(ke,tt,Ie.t,Ie.gp,N,q);const Oe=N.x-Ie.x,mt=N.z-Ie.z,Vt=Oe*Ie.fx+mt*Ie.fz,fa=-Oe*Ie.fz+mt*Ie.fx;if(Math.abs(fa)<k[0]&&Vt>k[1]&&Vt<k[2])return!0;for(let Zt=0;Zt<Ie.st.length;Zt+=2){const za=(Vt-Ie.st[Zt])/G[0],pa=(fa-Ie.st[Zt+1])/G[1];if(za*za+pa*pa<1)return!0}return!1},Qe=new Map(O.map((ke,De)=>[ke,I(M[De])])),Ve=new Map,Xe=ke=>{const De=Qe.get(ke);return Math.sign(De)*Math.round(Math.abs(De)*2+.02)};for(const ke of r)if(ke.period<0){const De=Xe(ke.row);Ve.has(De)||Ve.set(De,[]),Ve.get(De).push(ke)}const et=(ke,De,Ie)=>Ie.some(tt=>tt!==ke&&fe(tt.o,De)<.2)||ve.some(tt=>Ae(ke.row,De,tt));let ft=0,Re=0;for(let ke=r.length-1;ke>=0;ke--){(ke&3)===0&&await a.yield();const De=r[ke];if(De.period>=0||_.has(De))continue;const Ie=Ve.get(Xe(De.row));if(!et(De,De.o,Ie))continue;let tt=!1;for(let Oe=1;Oe<=360&&!tt;Oe++){const mt=De.o+(Oe&1?1:-1)*.05*(Oe+1>>1);et(De,mt,Ie)||(De.o=mt,tt=!0)}tt?ft++:Re++}P.moved=[ft,Re],await a.yield();let ne=0;for(const ke of[4,2,6])for(const De of r){if(ne>=4||De.row!==O[ke]||d.has(De)||De.calf||De.period>=0)continue;const Ie=xe(De.o);Ie>.62&&Ie<1.45&&(De.kind="zx",De.tint=te(s),De.size=s.range(.9,.98),ne++)}}const H=new t.Vector3,ue=new t.Vector3,ie=(n,k)=>{const G=[];for(let Z=n;Z<=k;Z+=3)e.posAt(Z,H),G.push([e.timeAtU(Z/e.L),H.x,H.z]);return G},Be=(n,k,G,Z)=>{let N=1e9;for(const q of Z)Ca(n,((q[0]+k)%G+G)%G,ue),N=Math.min(N,Math.hypot(ue.x-q[1],ue.z-q[2]));return N},Ue=[],We=ie(e.sLip,e.L);for(let n=0;n<h.tracks.length;n++){const k=h.tracks[n],G=n===3,Z=G?[-1.1,1.3]:[-1.4,1.5];for(const N of Z){await a.yield();const q=P.free(k,N+o.range(-.3,.3),o.range(11,13));Ue.push(q);let A=o.range(0,1.5);for(;A<q.period-.4;){const ve=m.zebraCast?o.chance(.22):o.chance(.06);w(q.row,A,1,q.period,ve,G&&Be(P.lanes[q.row],A,q.period,We)<12?0:3,o.range(-.4,.4)),A+=(o.chance(.25)?o.range(2.2,4):o.range(.8,1.5))/c*(G?1.4:1)}}}const Ge=[];{const n=a.rng.fork("water"),k=new t.Vector3,G=new t.Vector3,Z=e.sLip+4.5,N=(ve,ge)=>{e.posAt(ve,k),e.tanAt(ve,G);const xe=1/Math.max(1e-4,Math.hypot(G.x,G.z));return[k.x-G.z*xe*ge,k.z+G.x*xe*ge]},q=ie(e.sLip,e.sExit),A=(ve,ge,xe)=>Be(ve,ge,xe,q);for(let ve=0;ve<6;ve++){await a.yield();const ge=ve<3,xe=ve%3,fe=[];if(ge){const et=[-2.8,-6.6,-10.4][xe],ft=[-7.6,-10.6,-13.6][xe],Re=-(17+2.6*xe);for(let ne=Z;ne<e.sExit+5;ne+=7)fe.push(N(ne,pe(pe(et,ft,u(Z+5,e.sSplash+6,ne)),Re,u(e.sWade-14,e.sLand+6,ne))));for(const ne of[[97,76.5],[112,82.6],[126,84.6],[146,77],[166,70],[200,47.5]])fe.push([ne[0]+1.2*xe,ne[1]+2.1*xe])}else{const et=[3.1,7.2,11.6][xe],ft=[7.8,11.4,15.6][xe];for(let Re=Z;Re<e.sSplash+16;Re+=7)fe.push(N(Re,pe(et,ft,u(Z+5,e.sSplash+6,Re))));for(const Re of[[-16,57.5],[0,67.5],[10,73.5],[22,80.5],[36,88],[52,94],[72,100]])fe.push([Re[0]-1.6*xe,Re[1]+2.2*xe])}const Ae=P.free(Jt(Rt(fe,7)),0,n.range(11,12.5),ge?3.4:2.7),Qe=P.lanes[Ae.row];Ge.push(Ae.row);const Ve=ge?[[1.5,3.4],[1.9,3.9],[2.4,4.6]][xe]:[[1.1,2.1],[1.2,2.4],[1.3,2.7]][xe];let Xe=0;for(let et=n.range(0,1.2);et<Ae.period-.4;et+=n.range(Ve[0],Ve[1])/Math.min(c,1.06)*(Xe>55?2:1)){const ft=et,Re=n.chance(.16),ne=Re?n.range(.68,.8):n.range(.93,1.1);Xe=A(Qe,ft,Ae.period),r.push({row:Ae.row,o:ft,r:1,period:Ae.period,seed:n(),size:ne,calf:Re?1:0,jit:n.range(-.5,.5),kind:Xe<9?"lo":"f",tint:B(Re,n)})}}}await a.yield();const Fe=[];{const n=a.rng.fork("wade");for(let k=0;k<W.length;k++){await a.yield();const G=P.track(se[k]);Fe.push(G.row),r.push({row:G.row,o:-G.t0,r:0,period:G.period,seed:n(),size:W[k][2],calf:0,jit:0,kind:"x",tint:B(0,n)})}}const Ee=[];{const n=a.rng.fork("family");for(let k=0;k<Y.length;k++){await a.yield();const G=P.track(E[k]);Ee.push(G.row),r.push({row:G.row,o:-G.t0,r:0,period:G.period,seed:n(),size:Y[k][2],calf:0,jit:0,kind:k?"z":"zx",tint:te(n)})}}const je=[];for(let n=0;n<2;n++){await a.yield();const k=P.track(le[n],0,le[n].t1);je.push(k.row),r.push({row:k.row,o:-k.t0,r:0,period:k.period,seed:he(),size:n?.99:1.03,calf:0,jit:0,kind:"x",tint:B(0,he)})}const ae=[];{const n=a.rng.fork("exit-family");for(let k=0;k<ce.length;k++){await a.yield();const G=P.track(de[k]);ae.push(G.row),r.push({row:G.row,o:-G.t0,r:0,period:G.period,seed:n(),size:ce[k][3],calf:0,jit:0,kind:ce[k][4],tint:te(n)})}}{const n=a.rng.fork("surge"),k=m.lunge.sL,G=e.sSplash;await a.yield();const Z=P.track(N=>[pe(5.5,12,u(k-9,k,N))-3*u(k+8,k+40,N)-15*u(e.sWade-30,e.sLand+10,N),9.6+4.4*u(e.sWade-26,e.sLand,N),5*(1-u(G+3,G+9,N))]);ae.push(Z.row),r.push({row:Z.row,o:-Z.t0,r:0,period:Z.period,seed:n(),size:.97,calf:0,jit:0,kind:"z",tint:te(n)})}const Me=[],Se=(n,k)=>{const G=Math.max(0,n);e.posAt(G,ot),e.tanAt(G,Je);const Z=1/Math.max(1e-4,Math.hypot(Je.x,Je.z)),N=Je.x*Z,q=Je.z*Z;return[ot.x+N*(n-G)-q*k,ot.z+q*(n-G)+N*k]},ot=new t.Vector3,Je=new t.Vector3,st=n=>{const k=[];for(let G=-170;G<e.sGully+12;G+=30)k.push(Se(G,n*(32+3*Math.sin(G*.021+n))));return k},qt=h.tracks[0].pts,Kt=Jt(Rt([...st(-1),[-118,-58],[-70,-74],[-36,-74],[-14,-64],[-7,e.sh.zBack-2]],14),10),Ft=Jt(Rt([...st(1),[-150,98],[-134,150],[-129,230],[-142,300]],14),10),Fa=[[Kt,[-12,-7,-2.5,2.5,7,12]],[Ft,[-12,-7,-2.5,2.5,7,12]],[h.tracks[0],[-8,8]],[h.tracks[1],[-8,8]],[h.tracks[2],[-8,8]]],Ut=[];for(const[n,k]of Fa)for(const G of k){await a.yield();const Z=P.free(n,G+o.range(-1.5,1.5),o.range(10.5,12.5));let N=o.range(0,.4);for(;N<Z.period-.2;){const q=o.chance(.18);Me.push([Z.row,N,1,Z.period,o(),q?o.range(.66,.78):o.range(.92,1.1),1,o.range(-3,3),0,0,0,0]),o.chance(.22*Math.min(1,a.quality?.detail??1))&&Ut.push([Z.row,N,1,Z.period,o(),o.range(.8,1.3),o.range(-3,3),5]),N+=(o.chance(.07)?o.range(.9,2.2):o.range(.07,.2))/c}}await a.yield();{const n=e.timeAtU((e.sLip+1)/e.L)+Nt,k=e.timeAtU((e.sBar+3)/e.L)+Nt,G=a.quality?.detail??1,Z=[[0,2,.34,.74],[1,3,.34,.74],[2,4,.3,.7],[3,5,.3,.7],[4,6,.3,.7],[5,7,.3,.7],[4,6,1.25,2.1],[5,7,1.25,2.1],[12,0,.3,.75],[13,1,.3,.75],[12,13,.25,.75]];for(const[N,q,A,ve]of Z)for(let ge=1.3+o.range(0,.1);ge<dt+zt-.6;ge+=o.range(.085,.19)/(c*G)){const xe=o.chance(.18),fe=o.range(A,ve);N>=12&&ge>6.2||(Me.push([O[N],ge,l[N],-1,o(),xe?o.range(.66,.78):o.range(.92,1.1),1,0,n,O[q],fe,N>=12?1e6:k]),o.chance(.07)&&Ut.push([O[N],ge,l[N],-1,o(),o.range(.8,1.3),o.range(-3,3),5]))}}{const n=Math.round(1600*(a.quality?.detail??1)),k=a.noise;let G=0;for(let Z=0;G<n&&Z<n*12;Z++){(Z&63)===0&&await a.yield();const N=o.range(-560,380),q=o.range(-260,340),A=h.sample(N,q);if(A.kind===1||A.lat<50||A.lat>250||A.hw<30||A.wall||A.trO>.05||A.kind===2&&A.dI<16||o()>1.25-A.lat/250||k.n2(N*.011+3.1,q*.011-7.7)+.5*k.n2(N*.04,q*.04)<.05)continue;const ve=h.height(N,q);if(ve<v+1.5)continue;const ge=o.chance(.15);Me.push([0,0,1,0,o(),ge?o.range(.66,.78):o.range(.92,1.1),o.chance(.2)?.5:0,0,N,ve,q,o.range(-.9,.9)+(o.chance(.2)?Math.PI:0)]),G++}}await a.yield();{let n=0,k=0;const G=a.rng.fork("budget"),Z=Ue.slice(0,6).map(N=>N.row);for(const N of r)N.kind==="z"&&Z.includes(N.row)&&(N.kind="f",N.tint=B(0,G),N.size=G.range(.93,1.1));for(let N=r.length-1,q=0;N>=0;N--)Z.includes(r[N].row)&&q++%3===2&&r.splice(N,1);for(let N=r.length-1;N>=0;N--){const q=r[N];if(!(q.period>=0||d.has(q))){if(q.kind==="z"&&q.o>=4.6&&(q.kind="f",q.tint=B(0,G)),q.kind==="f"&&q.o>=7&&n++%4!==0){r.splice(N,1);continue}if(q.kind==="f"&&q.o>=5.6&&q.o<7&&k++%2===0){r.splice(N,1);continue}q.kind==="lo"&&(q.o>2.5||q.o<-.9)&&(q.kind="f"),q.kind==="x"&&(q.o<-.2||q.o>1.3)&&(q.kind="hi"),q.kind==="hi"&&(q.o>1.3||q.o<-.45)&&(q.kind="lo"),q.kind==="zx"&&(q.o>1.3||q.o<-.45)&&(q.kind="z")}}}await a.yield();const la=Co(P.lanes);await a.yield();const ga=e.timeAtU((e.sSplash-1)/e.L)+Nt,kt=M.map(()=>ga);O.forEach((n,k)=>{const G=P.lanes[n].b;let Z=-1;for(let N=0;N<ct;N++)G[N*4]>.5&&(Z=N);Z>=0&&n<Pt&&(kt[n]=(Z+1)*pt)});const rt={uLane:{value:la},uClock:{value:0},uPrev:{value:0},uPrevF:{value:0},uSurge:{value:0},uLandT:{value:kt},uPart:{value:new t.Vector2(1,0)}},He={};He.x=Ma(Xt,"w",2),await a.yield(),He.hi=Ma(Xt,"w",1),await a.yield(),He.lo=Ea(Xt,!0),await a.yield(),He.f=Ea(Xt,2),await a.yield(),He.zx=Ma(Xt,"z",2),await a.yield(),He.z=Ma(Xt,"z",1),await a.yield();const Dt=(n,k,G)=>{L.uCamL.value.setFromMatrixPosition(G.matrixWorld)},qe=[],wa={x:0,hi:0,lo:0,f:0,zx:0,z:0};let ya=0;for(const n of["x","hi","lo","f","zx","z"]){const k=r.filter(Ae=>Ae.kind===n),G=k.length;if(wa[n]=G,!G)continue;const Z=new Float32Array(G*4),N=new Float32Array(G*4),q=new Float32Array(G*3);k.forEach((Ae,Qe)=>{Z.set([Ae.row,Ae.o,Ae.r,Ae.period],Qe*4),N.set([Ae.seed,Ae.size,Ae.calf,Ae.jit],Qe*4),q.set(Ae.tint,Qe*3)});const A=He[n],ve=new t.InstancedBufferGeometry,ge=n==="z"||n==="zx";ve.index=A.index;for(const Ae of Object.keys(A.attributes))ve.setAttribute(Ae,A.attributes[Ae]);ve.setAttribute("iL",new t.InstancedBufferAttribute(Z,4)),ve.setAttribute("iD",new t.InstancedBufferAttribute(N,4)),ve.setAttribute("iTint",new t.InstancedBufferAttribute(q,3)),ve.instanceCount=G;const xe=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...L,...rt,uRim:L.uRim},fog:!0,vertexColors:!0,side:t.DoubleSide,transparent:!0,defines:ge?{ZEBRA:1}:{},vertexShader:Po,fragmentShader:vo}),fe=new t.Mesh(ve,xe);fe.frustumCulled=!1,fe.renderOrder=2.5,fe.onBeforeRender=Dt,qe.push(fe),ya+=A.index.count/3*G}await a.yield();const it=[],ca=a.quality?.detail??1,nt=M.map((n,k)=>Math.abs(n)>4.5?O[k]:-1);for(const n of r){const k=n.period<0,G=[n.row,n.o,n.r,n.period],Z=Ee.includes(n.row)||je.includes(n.row)||ae.includes(n.row),N=Fe.includes(n.row)?0:k||Z?n.kind==="lo"||n.kind==="f"?2:3:o.chance(.6*ca)?1:0;for(let q=0;q<N;q++)o()<ca+.2&&it.push([...G,o(),n.size*o.range(.9,1.3),o(),0]);if((k||Fe.includes(n.row)||ae.includes(n.row)||Ge.includes(n.row)||n.row===Ue[Ue.length-1].row||n.row===Ue[Ue.length-2].row)&&it.push([...G,n.seed,n.size,n.jit,1]),k&&it.push([...G,o(),n.size,n.jit,3]),(k||Fe.includes(n.row)||ae.includes(n.row))&&n.kind!=="f")for(const q of[.5,-.45,0])it.push([...G,o(),n.size,n.jit+Math.sign(q)*3.8,2]);(k||Fe.includes(n.row)||ae.includes(n.row))&&n.kind!=="f"&&n.kind!=="lo"&&(it.push([...G,n.seed,n.size,n.jit,6]),it.push([...G,(n.seed*1.7+.31)%1,n.size*1.15,n.jit,6]),it.push([...G,n.seed,n.size,n.jit,7])),k&&n.kind==="lo"&&it.push([...G,n.seed,n.size,n.jit,7]),(k||Z)&&o()<ca+.3&&!nt.includes(n.row)&&(it.push([...G,o(),n.size*o.range(1.2,1.6),.04,4]),it.push([...G,o(),n.size*o.range(1.5,2.1),o.range(.4,.75),4]))}for(const n of Ut)it.push(n);const At=it.length,Yt=new Float32Array(At*4),ua=new Float32Array(At*4);it.forEach((n,k)=>{Yt.set(n.slice(0,4),k*4),ua.set(n.slice(4),k*4)});const ht=new t.InstancedBufferGeometry,ea=new t.PlaneGeometry(2,2);ht.index=ea.index,ht.setAttribute("position",ea.attributes.position),ht.setAttribute("iL",new t.InstancedBufferAttribute(Yt,4)),ht.setAttribute("iS",new t.InstancedBufferAttribute(ua,4)),ht.instanceCount=At;const da=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...L,...rt},fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.OneFactor,blendDstAlpha:t.OneMinusSrcAlphaFactor,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 iL, iS; uniform float uTime, uWaterY, uShade; uniform vec3 uSun, uWind, uCamL;
      varying vec2 vUv, vWd; varying vec4 vK; varying vec3 vL3; varying float vG;
      ${La}
      void main(){
        float type = iS.w, vis, a = 0.; int row = int(iL.x + .5) * 2;
        float tt = laneTime(iL, vis); vec4 P, dP; vec3 pos; vec2 q = position.xy;
        vec3 right = normalize(vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]));
        vec3 up = normalize(vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]));
        float lt = 0.;
        if (type < .5) {                                    // dust puff left behind where a hoof struck
          float life = 3.4, age = fract(uTime / life + iS.x) * life; lt = age;
          lanePos(tt - age, row, P, dP); vec4 aux = laneAux(tt - age, row);
          float k = age / life, sz = iS.y * mix(.35, 1.5, 1. - (1. - k) * (1. - k));
          pos = P.xyz + vec3(sin(iS.x * 40.) * .5, .1 + sz * .42 + age * .16, cos(iS.x * 31.) * .5) + uWind * age * .5;
          a = smoothstep(0., .08, k) * pow(1. - k, 1.4) * step(uWaterY + .12, P.y) * smoothstep(.7, .98, aux.w) * (1. - .6 * aux.y) * smoothstep(3., 7., length(dP.xz)) * (1. - .3 * uShade);
          pos += right * q.x * sz + up * q.y * sz;
        } else if (type < 1.5) {                            // foam collar and wake, flat on the water
          lanePos(tt, row, P, dP); float v = max(length(dP.xz), .3); vec2 hd = dP.xz / v;
          a = (1. - smoothstep(uWaterY - .4, uWaterY - .12, P.y)) * smoothstep(uWaterY - 1.9, uWaterY - 1.3, P.y);
          q.y = q.y * .5 - .3;                              // +0.2 ahead of the chest .. -0.8 astern
          vec2 c = P.xz + vec2(-hd.y, hd.x) * iS.z + hd * .55 * iS.y;
          vec2 xz = c + vec2(hd.y, -hd.x) * q.x * 1.4 * iS.y + hd * q.y * 4.2 * iS.y;
          pos = vec3(xz.x, uWaterY + .06, xz.y);
        } else if (type < 2.5) {                            // white water thrown up round the legs of whoever wades
          lanePos(tt, row, P, dP); float v = max(length(dP.xz), .3); vec2 hd = dP.xz / v;
          float md = iS.z > 2. ? 1. : iS.z < -2. ? -1. : 0., off = md * .47, lj = iS.z - md * 3.8;
          float depth = uWaterY - P.y;                         // how deep the hooves are
          a = smoothstep(-.03, .05, depth) * (1. - smoothstep(.7, 1.05, depth)) * smoothstep(1.5, 4., v);
          q.y = q.y * .5 + .5; up = vec3(0., 1., 0.);
          if (md == 0.) {                                    // the water that sheets off its belly: a curtain of falling drops along the body
            float base = max(uWaterY, P.y), hgt = max(P.y + .8 * iS.y - base, .05);
            vec2 c = P.xz + vec2(-hd.y, hd.x) * lj;
            pos = vec3(c.x, base, c.y) + vec3(hd.x, 0., hd.y) * q.x * .6 * iS.y + up * q.y * hgt;
            a *= laneAux(tt, row).y * .9; lt = uTime; type = 2.3;
          } else if (md < 0.) {                              // the white ring each pair of legs leaves on the water, lying flat, and the churn between
            float per = .62, ph = fract(uTime / per + iS.x); lt = ph * per;
            vec2 c = P.xz + vec2(-hd.y, hd.x) * lj + hd * .1 * iS.y, xz = c + vec2(hd.y, -hd.x) * q.x * .75 * iS.y + hd * (q.y * 2. - 1.) * 1.15 * iS.y;
            pos = vec3(xz.x, uWaterY + .025, xz.y); a *= smoothstep(.02, .1, depth); type = 2.6;
          } else {
            float per = .62, ph = fract(uTime / per + iS.x); lt = ph * per;
            vec2 c = P.xz + vec2(-hd.y, hd.x) * lj + hd * (off + .25) * iS.y;
            pos = vec3(c.x, max(uWaterY, P.y) + .01, c.y) + right * q.x * iS.y * .7 * (.6 + .7 * ph) + up * q.y * iS.y * mix(.55, .95, fract(iS.x * 7.3)) * smoothstep(0., .12, ph) + vec3(hd.x, 0., hd.y) * ph * .6;
            a *= 1. - ph * ph;
          }
        } else if (type > 5.5) {                            // whoever has been in the river: steam off its back, and the halo of spray its shake throws
          vec4 aux = laneAux(tt, row); float tOut = (1. - aux.y) * ${Ga.toFixed(1)};       // seconds since it left the deep water
          if (type > 6.5) {
            lanePos(tt, row, P, dP); float v = max(length(dP.xz), .3); vec2 hd = dP.xz / v;
            float k = (tOut - (${Aa[0].toFixed(1)} + ${Aa[1].toFixed(1)} * fract(iS.x * 13.7))) / 1.; lt = clamp(k, 0., 1.3);
            a = aux.y > .02 ? step(uWaterY + .3, P.y) * smoothstep(0., .06, k) * (1. - smoothstep(.95, 1.25, k)) : 0.;
            float sz = iS.y * 1.45;                                 // a metre round the coat, no more: what it throws stays its own
            pos = P.xyz + vec3(-hd.y * iS.z, .98 * iS.y, hd.x * iS.z) + right * q.x * sz + up * q.y * sz;
          } else {
            float life = 1.5, age = fract(uTime / life + iS.x * 3.7) * life, k = age / life; lt = age;
            lanePos(tt - age * .3, row, P, dP); vec4 ax = laneAux(tt - age * .3, row); float v = max(length(dP.xz), .3); vec2 hd = dP.xz / v;
            float sz = iS.y * mix(.5, 1.7, k);
            pos = P.xyz + vec3(-hd.y * iS.z, (1.2 + .12 * sin(iS.x * 50.)) * iS.y + sz * .35 + age * .75, hd.x * iS.z) + vec3(hd.x, 0., hd.y) * (.5 * sin(iS.x * 23.)) + uWind * age * .25;
            a = sqrt(clamp(ax.y, 0., 1.)) * step(.02, ax.y) * step(uWaterY + .3, P.y) * smoothstep(.7, .98, ax.w) * smoothstep(0., .15, k) * (1. - k);
            pos += right * q.x * sz + up * q.y * sz;
          }
        } else if (type > 4.5) {                            // the pall that stands over a far line of the herd
          float life = 6., age = fract(uTime / life + iS.x) * life; lt = age;
          lanePos(tt - age, row, P, dP);
          float k = age / life, sz = iS.y * mix(1.6, 6.5, k);
          pos = P.xyz + vec3(sin(iS.x * 40.) * 3. + iS.z * .5, .5 + sz * .42 + age * .4, cos(iS.x * 31.) * 3.) + uWind * age * .8;
          a = smoothstep(0., .15, k) * (1. - k) * step(uWaterY + .12, P.y) * smoothstep(.7, .98, laneAux(tt - age, row).w) * .85;
          pos += right * q.x * sz + up * q.y * sz;
        } else if (type > 3.5) {                            // the knee-deep dust it runs in: a low wide puff at the hooves, and one trailing
          lanePos(tt - iS.z, row, P, dP); vec4 aux = laneAux(tt - iS.z, row); float sz = iS.y; lt = uTime * .3 + iS.z;
          pos = P.xyz + vec3(sin(iS.x * 40.) * .3, .24, cos(iS.x * 31.) * .3) + uWind * iS.z * .5;
          a = step(uWaterY + .12, P.y) * smoothstep(.7, .98, aux.w) * (1. - .6 * aux.y) * smoothstep(3., 7., length(dP.xz));
          pos += right * q.x * sz * 1.6 + vec3(0., 1., 0.) * (q.y + .35) * (.42 + .16 * sz);
        } else {                                            // the splash where it lands
          float tl = uLandT[clamp(int(iL.x + .5), 0, ${Pt-1})];
          lt = tt - tl - .05 - iS.x * .12; lanePos(tl + .15, row, P, dP);
          float life = 1.25, k = clamp(lt / life, 0., 1.), rise = smoothstep(0., .16, lt), fall = 1. - smoothstep(.3, 1., k);
          a = (lt > 0. && lt < life) ? smoothstep(0., .05, k) * (1. - k * k) : 0.;
          vec2 hd = normalize(dP.xz + vec2(1e-4, 0.));
          q.y = q.y * .5 + .5; up = vec3(0., 1., 0.);
          pos = vec3(P.x - hd.y * iS.z, uWaterY, P.z + hd.x * iS.z) + right * q.x * iS.y * 1.3 * (.55 + .9 * k) + up * q.y * iS.y * 1.9 * rise * (.3 + .7 * fall);
        }
        a *= vis;
        vec3 fwd = cross(right, up);
        vL3 = vec3(dot(uSun, right), dot(uSun, up), dot(uSun, fwd));
        vUv = position.xy; vK = vec4(type, a, iS.x, lt); vWd = vec2(dot(uWind, right), dot(uWind, up));
        vec3 vd = pos - uCamL; vG = max(dot(vd, uSun), 0.) / max(length(vd), .01); vG *= vG;          // seen against the sun the dust glows
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);
        if (type < .5) a *= smoothstep(3., 8., -mvPosition.z) * (1. - .6 * smoothstep(60., 110., -mvPosition.z)); else if (type > 1.5 && type < 2.7) a *= smoothstep(1.2, 3., -mvPosition.z) * (1. - smoothstep(45., 70., -mvPosition.z)); else if (type > 5.5) a *= smoothstep(1.6, 4., -mvPosition.z) * (1. - smoothstep(45., 80., -mvPosition.z)); else if (type > 4.5) a *= smoothstep(16., 34., -mvPosition.z); else if (type > 3.5) a *= smoothstep(2.5, 7., -mvPosition.z) * (1. - .7 * smoothstep(50., 90., -mvPosition.z)); else if (type > 2.5) a *= .9 * smoothstep(2.6, 6.5, -mvPosition.z);
        vK.y = a;
        gl_Position = a > .004 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC, uFoam, uTea, uSkyRef, uHaze, uDustLit, uDustShade; uniform float uTime;
      varying vec2 vUv, vWd; varying vec4 vK; varying vec3 vL3; varying float vG;
      ${lt}
      ${Ra}
      ${ia}
      void main(){
        float type = vK.x, al = 0., r = length(vUv), add = 1., pxw = fwidth(vUv.x) + fwidth(vUv.y); vec3 col;
        vec3 nn = vec3(vUv, sqrt(max(1. - min(r * r, 1.), 0.))); float lit = clamp(dot(nn, vL3) * .6 + .5, 0., 1.);
        if (type < .5) {
          float n = vn2(vUv * 1.9 + vK.z * 17. + vK.w * .25) * .65 + vn2(vUv * 4.7 - vK.z * 5.) * .35;
          al = (1. - smoothstep(.15, 1., r + (n - .5) * .9)) * (1. - smoothstep(.72, 1., r)) * .66;
          col = mix(mix(uDustShade * 1.6, uDustLit, .45), uDustLit * (.55 + .22 * uSunC), lit) + uDustLit * uSunC * vG * .3;
        } else if (type < 1.5) {
          al = wakeFoam(abs(vUv.x), .5 - vUv.y * .5, vK.z, vUv) * .96;          // 0 ahead of the chest .. 1 at the tail of the wake
          col = uFoam * (uSunC * .42 + uSkyC);
        } else if (type > 6.5) {
          // the shake: a short burst of fine bright drops flung off the coat, each on its own curved path (thrown out, slowed by the air,
          // falling), and a thin mist that drifts off downwind. The quad is 1.45 m either way from the middle of the body: nothing in it
          // travels more than a metre from the coat, and the mist is thin enough to see a zebra's stripes through.
          float k = clamp(vK.w, 0., 1.3), sd = vK.z, drops = 0.;
          for (int i = 0; i < 40; i++) {
            float fi = float(i), h1 = h21(vec2(fi * 1.31 + 3.7, sd * 91.7)), h2 = h21(vec2(fi * 2.17 + 9.1, sd * 37.3)), h3 = h21(vec2(fi * .73 + 5.3, sd * 53.9));
            float age = (k - h2 * .7) / .5;                                  // each leaves the coat at its own moment of the shake, and lives half a second
            if (age > 0. && age < 1.) {
              float th = h1 * 6.2832, tt = age * .5, sp = (.55 + .8 * h3) * 2.5, dr = (1. - exp(-tt * 3.6)) / 3.6;
              vec2 dir = vec2(cos(th), sin(th) * .75 + .4), o = vec2(cos(th) * .42, sin(th) * .2 + .03);
              vec2 p = o + dir * sp * dr + vec2(vWd.x * .12 * tt, -2.3 * tt * tt), vel = dir * sp * exp(-tt * 3.6) + vec2(0., -4.6 * tt);
              vec2 pa = vUv - p, ba = -vel * .016; float hh = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.), d = length(pa - ba * hh);
              float rad0 = .016 + .016 * h1, rad = max(rad0, pxw * .8);
              drops += (1. - smoothstep(rad * .45, rad, d)) * min(1., rad0 * rad0 / (rad * rad) * 3.) * smoothstep(0., .08, age) * (1. - age * age * age);
            }
          }
          vec2 mc = vUv - vec2(vWd.x * .2 * k, .04 + .1 * k); float mr = length(mc * vec2(1., 1.25)) / (.36 + .3 * k);
          float fine = vn2(vUv * 4.6 + vec2(sd * 17., -k * 1.4)) * .6 + vn2(vUv * 10.5 - sd * 5.) * .4;
          float mist = exp(-mr * mr * 2.2) * smoothstep(.15, .7, fine) * .3 * smoothstep(0., .15, k) * (1. - smoothstep(.7, 1.25, k));
          al = clamp(drops * .95 + mist, 0., 1.) * (1. - smoothstep(.85, 1., r));
          col = mix(uFoam, uDustLit, .42) * (uSunC * (.38 + .5 * lit) + uSkyC * .8) + uFoam * uSunC * vG * .6; add = .7;
        } else if (type > 5.5) {                             // steam: thin wisps that rise off the wet hide and take the gold of the sun
          float n = vn2(vUv * 1.7 + vK.z * 17. + vec2(0., -vK.w * .9)) * .6 + vn2(vUv * 4.3 - vK.z * 5. + vec2(0., -vK.w * 1.7)) * .4;
          al = (1. - smoothstep(.05, 1., r + (n - .5) * 1.1)) * (1. - smoothstep(.7, 1., r)) * smoothstep(.26, .6, n) * .8;
          col = mix(uFoam, uDustLit, .45) * (uSunC * (.3 + .42 * lit) + uSkyC * .55) + uDustLit * uSunC * vG * .45; add = .75;
        } else if (type > 4.5) {
          float n = vn2(vUv * 1.6 + vK.z * 17. + vK.w * .12) * .65 + vn2(vUv * 3.9 - vK.z * 5.) * .35;
          al = (1. - smoothstep(.1, 1., r + (n - .5) * .9)) * (1. - smoothstep(.7, 1., r)) * .3;
          col = mix(mix(uDustShade * 1.6, uDustLit, .5), uDustLit * (.6 + .26 * uSunC), lit) + uDustLit * uSunC * vG * .3;
        } else if (type > 3.5) {
          float n = vn2(vUv * vec2(1.6, 1.1) + vK.z * 17. + vec2(vK.w, 0.)) * .65 + vn2(vUv * 4.1 - vK.z * 5.) * .35;
          al = (1. - smoothstep(.1, 1., r + (n - .5) * .8)) * (1. - smoothstep(.72, 1., r)) * (1. - smoothstep(-.5, 1., vUv.y)) * .86;
          col = mix(mix(uDustShade * 1.6, uDustLit, .5), uDustLit * (.6 + .26 * uSunC), clamp(vL3.x * vUv.x * .7 + .55, 0., 1.)) + uDustLit * uSunC * vG * .3;
        } else {
          vec2 u = vec2(vUv.x, vUv.y * .5 + .5);
          if (type > 2.5 && type < 2.7) {                    // rings on the water round the fore and the hind legs, spreading and breaking up
            float ph = vK.w / .62, n = vn2(vUv * 7. + vK.z * 13.) * .6 + vn2(vUv * 17. - vK.z * 5.) * .4;
            float r1 = length((vUv - vec2(0., .42)) * vec2(1.5, 2.6)) / (.3 + .6 * ph), r2 = length((vUv - vec2(0., -.42)) * vec2(1.5, 2.6)) / (.3 + .6 * fract(ph + .5));
            float ring = max(smoothstep(.5, .72, r1) * (1. - smoothstep(.8, 1., r1)) * (1. - ph * ph), smoothstep(.5, .72, r2) * (1. - smoothstep(.8, 1., r2)) * (1. - fract(ph + .5) * fract(ph + .5)));
            float churn = (1. - smoothstep(.3, 1., length(vUv * vec2(1.3, .95)))) * smoothstep(.45, .7, n);
            al = clamp(ring * (.5 + .9 * n) + churn * .7, 0., 1.) * .95;
          } else if (type > 2.2 && type < 2.4) {                    // drops falling off the belly
            float fx = vUv.x * 13. + vK.z * 9., c = floor(fx), h = h21(vec2(c, vK.z * 31.)), fall = fract(u.y * (1. + h) + vK.w * (2.2 + 2. * h) + h * 7.);
            al = (1. - smoothstep(.1, .3, abs(fx - c - .5))) * smoothstep(0., .25, fall) * (1. - smoothstep(.45, 1., fall)) * step(.3, h) * (1. - smoothstep(.6, 1., abs(vUv.x))) * .8;
          } else {
            al = spray(u, vK.z, clamp(vK.w / (type < 2.5 ? .62 : 1.25), 0., 1.), vK.w) * (type < 2.5 ? 1.5 : 1.);
          }
          col = uFoam * (uSunC * (.3 + .55 * lit) + uSkyC * .8); add = .8;
        }
        al *= vK.y;
        gl_FragColor = vec4(fogMix(col, FOGD) * al, al * add);
      }`}),Ct=new t.Mesh(ht,da);Ct.frustumCulled=!1,Ct.renderOrder=3.5,Ct.onBeforeRender=Dt,await a.yield();const ha=r.filter(n=>n.kind!=="f"&&(n.period<0||Fe.includes(n.row)||Ee.includes(n.row)||je.includes(n.row)||ae.includes(n.row)||n.row===Ue[Ue.length-1].row||n.row===Ue[Ue.length-2].row)),vt=ha.length,Lt=new Float32Array(vt*4),ta=new Float32Array(vt*4);ha.forEach((n,k)=>{Lt.set([n.row,n.o,n.r,n.period],k*4),ta.set([n.seed,n.size,n.jit,n.calf||n.kind==="z"||n.kind==="zx"?1:0],k*4)});const Bt=new t.InstancedBufferGeometry;Bt.setIndex([0,1,2,0,2,3]),Bt.setAttribute("position",new t.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),Bt.setAttribute("iL",new t.InstancedBufferAttribute(Lt,4)),Bt.setAttribute("iS",new t.InstancedBufferAttribute(ta,4)),Bt.instanceCount=vt;const aa=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...L,...rt,uShK:{value:u(.03,.16,L.uSun.value.y)}},fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-8,blending:t.CustomBlending,blendSrc:t.DstColorFactor,blendDst:t.ZeroFactor,blendSrcAlpha:t.ZeroFactor,blendDstAlpha:t.OneFactor,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 iL, iS; uniform float uWaterY, uShade, uShK; uniform vec3 uSun;
      varying vec2 vQ; varying vec4 vK;
      ${La}
      ${va}
      void main(){
        float vis; int row = int(iL.x + .5) * 2; float tt = laneTime(iL, vis); vec4 P, dP; lanePos(tt, row, P, dP); vec4 aux = laneAux(tt, row);
        float v = max(length(dP.xz), .5), size = iS.y; vec2 hd = dP.xz / v;
        vec2 sd = -uSun.xz; float sl = max(length(sd), 1e-3); sd /= sl;
        float k = min(sl / max(uSun.y, .04), 4.4);                          // metres of shadow to a metre of height
        vec2 q = vec2(position.x * 1.5, position.y * 1.85) * size;
        vec2 c = P.xz + vec2(-hd.y, hd.x) * iS.z, xz = c + hd * q.x + sd * (k * q.y);
        float a = vis * step(uWaterY + .12, P.y) * smoothstep(.7, .98, aux.w) * (1. - .93 * uShade) * uShK;
        a *= 1. - 1.15 * (1. - cloudSun(P.xz));                              // under a cloud nothing throws a shadow
        a *= mix(.5, 1., smoothstep(uWaterY + .9, uWaterY + 2.6, P.y));      // and on the wet mud of the bar it is faint: the mud is dark already
        float run = smoothstep(3., 9., v), stride = 4.5 * size * mix(.42, 1., run);
        vec4 mvPosition = modelViewMatrix * vec4(xz.x, P.y + .06, xz.y, 1.);
        a *= (1. - smoothstep(55., 100., -mvPosition.z)) * exp(-max(-mvPosition.z - 5., 0.) * .022);
        vQ = q / size; vK = vec4(fract(P.w / stride + iS.x * 7.), a, iS.w, run);
        gl_Position = a > .01 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC;
      varying vec2 vQ; varying vec4 vK;
      ${to}
      ${ia}
      void main(){
        float ph = vK.x * 6.2832; vec2 q = vQ; q.y -= .05 * sin(ph) * vK.w;
        float d = beastSil(q, 1., vK.w, ph, vK.z) - .045 * (1. - smoothstep(.45, .8, q.y));        // (the legs a little stouter than life, or they are lost)
        float soft = .012 + .022 * q.y + max(fwidth(q.x), fwidth(q.y)) * .8;       // the edge softens with the height of what throws it
        float al = (1. - smoothstep(-soft, soft, d)) * vK.y * (1. - fogAt(FOGD));
        vec3 amb = mix(uGndC, uSkyC, .9) * .8, lit = uSunC * max(uSun.y, .05) * 1.15 + amb;
        gl_FragColor = vec4(mix(vec3(1.), max(amb / max(lit, vec3(1e-3)) * vec3(.98, .9, 1.), vec3(.46, .38, .32)), al), 1.);
      }`}),Ht=new t.Mesh(Bt,aa);Ht.frustumCulled=!1,Ht.renderOrder=.5,await a.yield();const $t=Me.length,xa=new Float32Array($t*4),oa=new Float32Array($t*4),ba=new Float32Array($t*4);Me.forEach((n,k)=>{xa.set(n.slice(0,4),k*4),oa.set(n.slice(4,8),k*4),ba.set(n.slice(8,12),k*4)});const Ye=new t.InstancedBufferGeometry;Ye.setIndex([0,1,2,0,2,3]),Ye.setAttribute("position",new t.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),Ye.setAttribute("iL",new t.InstancedBufferAttribute(xa,4)),Ye.setAttribute("iD",new t.InstancedBufferAttribute(oa,4)),Ye.setAttribute("iP",new t.InstancedBufferAttribute(ba,4)),Ye.instanceCount=$t;const Tt=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...L,...rt},fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 iL, iD, iP; uniform float uTime, uWaterY; uniform vec3 uCamL, uSun;
      varying vec2 vUv; varying vec4 vK; varying float vA, vE, vS, vCs;
      ${La}
      ${va}
      void main(){
        float seed = iD.x, size = iD.y, run = iD.z, vis = 1., cyc; vec3 P; vec2 hd;
        if (abs(iL.w) > .5) {
          float tt = laneTime(iL, vis); vec4 Lp, dL; lanePos(tt, int(iL.x + .5) * 2, Lp, dL);
          if (iL.w < 0.) { vec4 Lq, dQ; float gp = gPart; lanePos(tt, int(iP.y + .5) * 2, Lq, dQ);
            float fz = iL.x > 11.5 && iP.y > 11.5 ? mix(iP.z, step(.5, iP.z), smoothstep(0., .25, gp)) : iP.z;       // (who runs between the two lines dead ahead stands with the nearer of them while they are apart)
            Lp = mix(Lp, Lq, fz); dL = mix(dL, dQ, fz);
            vis *= 1. - smoothstep(iP.x - .4, iP.x, tt) + smoothstep(iP.w, iP.w + 1., tt); }
          float v = max(length(dL.xz), .5); hd = dL.xz / v; P = Lp.xyz + vec3(-hd.y, 0., hd.x) * iD.w; cyc = Lp.w / (4.5 * size) + seed * 7.;
          vis *= step(uWaterY + .2, Lp.y);
        } else { P = iP.xyz; hd = vec2(cos(iP.w), sin(iP.w)); cyc = seed * 7. + uTime * .35 * run; }
        vec3 toC = uCamL - P; float dist = max(length(toC), .01); vec2 f = -toC.xz / max(length(toC.xz), .01), r = vec2(-f.y, f.x);
        float side = dot(hd, r), lenK = mix(.4, 1., abs(side));                       // seen end on it is only as wide as its shoulders
        vec3 wp = P + vec3(r.x, 0., r.y) * (position.x * 1.3 * size * lenK) + vec3(0., position.y * 1.7 * size, 0.);
        vUv = vec2(position.x * (side < 0. ? -1. : 1.), position.y); vK = vec4(run, fract(cyc), seed, size);
        vCs = cloudSun(P.xz);
        vA = vis * smoothstep(12., 18., dist); vE = abs(side); vS = dot(normalize(uSun.xz + vec2(1e-4, 0.)), r) * (side < 0. ? -1. : 1.);
        vec4 mvPosition = modelViewMatrix * vec4(wp, 1.);
        gl_Position = vA > .004 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSunC, uSkyC, uGndC, uDustLit;
      varying vec2 vUv; varying vec4 vK; varying float vA, vE, vS, vCs;
      ${to}
      void main(){
        float run = min(vK.x * 2., 1.), gait = step(.75, vK.x), a = vK.y * 6.2832, calf = 1. - step(.85, vK.w);
        vec2 q = vec2(vUv.x * 1.3, vUv.y * 1.7); q.y -= .05 * sin(a) * gait;
        float aa = max(fwidth(q.x), fwidth(q.y)) * .7 + 1e-4;
        float d = vE < .5 ? beastRear(vec2(q.x * mix(.4, 1., vE), q.y), gait, a, calf) : beastSil(q, run, gait, a, calf);
        float al = (1. - smoothstep(-aa, aa, d)) * vA; if (al < .01) discard;
        vec3 base = mix(vec3(.105, .09, .082), vec3(.15, .115, .085), calf) * (.8 + .4 * fract(vK.z * 7.3));
        float top = smoothstep(.8, 1.35, q.y), rim = max(smoothstep(-.09, -.01, d) * smoothstep(.6, 1.1, q.y), smoothstep(-.045, -.008, d) * clamp(vUv.x * vS * 2.5 + .1, 0., 1.) * smoothstep(.3, .7, q.y) * .8);      // the sun's side of it burns
        vec3 col = base * ((uSkyC * .6 + uGndC * .35) * (.8 + .2 * vCs) + uSunC * (.03 + .14 * top + .45 * rim) * vCs);          // dark slate against the gold, a lit line along the spine
        col = mix(col, uDustLit * (.3 + .25 * vCs), (1. - smoothstep(0., .4, q.y)) * .45);              // its legs are lost in its own dust
        gl_FragColor = vec4(col, al);
        #ifdef USE_FOG
          float fd = vFogDepth * .45; gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1. - exp(-fogDensity * fogDensity * fd * fd));       // a dark shape holds its own in the haze longer than the ground does
        #endif
      }`}),Wt=new t.Mesh(Ye,Tt);return Wt.frustumCulled=!1,Wt.renderOrder=3.6,Wt.onBeforeRender=Dt,{meshes:qe,trail:Ct,shadow:Ht,far:Wt,flanks:[Kt,Ft],tex:la,HU:rt,lanes:P.lanes,colRows:O,slots:r,count:wa,triangles:ya+At*2+$t*2+vt*2,camL:Dt,bases:M,rates:l,compRows:Fe,famRows:Ee,flkRows:je,exitRows:ae,waterRows:Ge,moved:P.moved}}function Wo(a,e,h){const i=a.uniforms,v=new t.PlaneGeometry(900,900,1,1);v.rotateX(-Math.PI/2),v.translate(60,e-.035,100);const m=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...i,uMist:{value:h.mist}},fog:!0,transparent:!0,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      varying vec3 vW;
      void main(){ vW = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC, uFoam, uTea, uSkyRef, uHaze, uCamL; uniform float uTime, uCur, uCurSpeed;
      varying vec3 vW;
      ${lt}
      ${Ra}
      void main(){
        vec3 p = vW, V = uCamL - p; float dist = max(length(V), .01); V /= dist;
        vec2 dx = dFdx(p.xz), dy = dFdy(p.xz); float px = max(length(dx), length(dy));
        // two reaches: down from +Z, then away along +X past the Fall
        float up = clamp((p.z - 42.) / 34., 0., 1.) * (1. - clamp((p.x + 34.) / 34., 0., 1.));
        vec2 f = mix(p.xz - vec2(uCur * uCurSpeed * uTime, 0.), vec2(p.z + uCurSpeed * uTime, p.x), up);
        vec2 gr = riverSlope(p.xz, dx, dy, 1.);
        vec3 N = normalize(vec3(-gr.x, 1., -gr.y));
        vec3 R = reflect(-V, N); R.y = abs(R.y) + .002;
        vec3 sky = mix(uHaze, uSkyRef, smoothstep(.02, .24, R.y));          // wavelet backs turned to us mirror the blue overhead, the rest the gold of the horizon
        vec3 col = riverColor(N, V, dist, sky, 0., riverFoam(f, px) * (1. - .5 * smoothstep(30., 90., dist)), f, 0.);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),o=new t.Mesh(v,m);return o.frustumCulled=!1,o.renderOrder=.9,o}function jt(a,e={},h={}){const i=a.uniforms;return new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...i,uGloss:{value:h.gloss??.1},uWetLine:{value:h.wetLine??-1e3},uAlb:{value:h.alb??.4}},fog:!0,vertexColors:!0,side:t.DoubleSide,defines:e,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      uniform float uTime;
      #ifdef USE_ANIM
      attribute float aW; attribute vec4 iF;
      #endif
      varying vec3 vN, vW, vC;
      void main(){
        vec3 p = position, n = normal;
        #ifdef FLAP
          float a = (sin(uTime * iF.y + iF.x) * iF.z + iF.w) * aW;               // wings hinge about the body axis (z)
          float s = sign(p.x), c = cos(a), sn = sin(a) * s;
          p.xy = vec2(p.x * mix(1., c, abs(aW)), p.y + abs(p.x) * sin(a) * abs(aW)); n.xy = vec2(n.x * c - n.y * sn, n.y * c + n.x * sn);
        #endif
        #ifdef SCULL
          p.x += sin(uTime * iF.y + iF.x - p.z * 1.3) * iF.z * aW;
        #endif
        #ifdef JAW
          float ja = iF.z * aW, jc = cos(ja), js = sin(ja); vec2 h = vec2(.74, .74);             // hinge (y, z) at the back of the head
          vec2 d = p.yz - h; p.yz = h + vec2(d.x * jc - d.y * js, d.y * jc + d.x * js); n.yz = vec2(n.y * jc - n.z * js, n.z * jc + n.y * js);
        #endif
        vec4 wp = vec4(p, 1.);
        #ifdef USE_INSTANCING
          wp = instanceMatrix * wp; n = mat3(instanceMatrix) * n;
        #endif
        wp = modelMatrix * wp; vW = wp.xyz; vN = mat3(modelMatrix) * n;
        vC = color;
        #ifdef USE_INSTANCING_COLOR
          vC *= instanceColor;
        #endif
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC, uCamL, uTea; uniform float uGloss, uWetLine, uWaterY, uAlb;
      varying vec3 vN, vW, vC;
      void main(){
        vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(uCamL - vW + vec3(0., 1e-5, 0.));
        float wet = 1. - smoothstep(uWetLine, uWetLine + .25, vW.y);
        vec3 alb = vC * uAlb * mix(1., .6, wet);
        #ifdef DISTDARK
        { vec3 sv = uSun - V * dot(uSun, V); float rimS = smoothstep(.5, .9, dot(N, normalize(sv + vec3(0., 1e-5, 0.))));
          alb *= mix(1., .12, smoothstep(38., 120., length(uCamL - vW)) * (1. - rimS)); }
        #endif
        float ndl = dot(N, uSun), dif = max(ndl * .75 + .25, 0.);
        vec3 col = alb * (uSunC * dif + mix(uGndC, uSkyC, N.y * .5 + .5));
        float fr = 1. - max(dot(N, V), 0.); fr = fr * fr * fr;
        col += uSunC * fr * (.03 + .1 * max(ndl + .3, 0.)) * .5 + uSkyC * fr * (uGloss + .5 * wet) * .6;
        vec3 Hh = normalize(uSun + V); col += uSunC * pow(max(dot(N, Hh), 0.), 40.) * (uGloss + .3 * wet);
        col = mix(col, uTea * (uSunC * .25 + uSkyC), (1. - smoothstep(uWaterY - .4, uWaterY + .02, vW.y)) * .85);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}async function Vo(a,e,h,i,v,m){const o=a.rng.fork("trees"),L=new t.Group,P=a.quality?.detail??1,c={wind:m,backlight:.85,backlightTint:"#e8d890"};xt.prepareLeafTexture&&await xt.prepareLeafTexture(c,a.yield);const r=xt.windMaterial(c),B={leaf:"#857647",leafLight:"#a8925a",leafDark:"#4a3e28",bark:"#5c4c3c",barkDark:"#2e2620"};await a.yield();const te=[];for(let y=0;y<2;y++)te.push(xt.pineGeometry({rng:o.fork("t"),height:o.range(7,9),detail:1,...B})),await a.yield();const w=xt.pineGeometry({rng:o.fork("tf"),height:8,detail:0,...B}),M=xt.pineGeometry({rng:o.fork("tg"),height:8,detail:0,...B}),O=y=>y.index?y.index.count:y.attributes.position.count,d=[O(w)<=O(M)?w:M];await a.yield();const F=[],l=44;for(let y=0;F.length<l&&y<1200;y++){const J=y<500,oe=J?o.range(-330,190):o.range(-520,420),K=J?o.range(-190,210):o.range(-420,460),E=h.sample(oe,K);E.kind===1||E.wall||E.tr>.05||E.lat<16||E.dO<12||E.kind===2&&E.dI<26||Math.abs(oe)<70&&K>-70&&K<20||F.some(he=>Math.hypot(he.x-oe,he.z-K)<26)||F.push({x:oe,y:E.h-.1,z:K,s:o.range(.85,1.25),rot:o()*6.283,d:E.lat,u:Ze(E.s/e.L,0,.999),v:F.length})}{const y=a.rng.fork("rim"),J=new t.Vector3,oe=new t.Vector3;for(let K=e.sGully-16+y.range(0,6),E=0;K<e.sLip-6;K+=y.range(11,17),E++){const he=E%2?1:-1;e.posAt(K,J),e.tanAt(K,oe);const me=1/Math.max(1e-4,Math.hypot(oe.x,oe.z));for(let ze=0;ze<6;ze++){const le=he*y.range(14.5,23),ce=J.x-oe.z*me*le,de=J.z+oe.x*me*le,re=h.sample(ce,de);if(!(re.kind!==0||re.wall||re.tr>.05||re.lat<13.5||re.dO<7||F.some(H=>Math.hypot(H.x-ce,H.z-de)<9))){F.push({x:ce,y:re.h-.1,z:de,s:y.range(.8,1.2),rot:y()*6.283,d:60,u:Ze(re.s/e.L,0,.999),v:F.length});break}}}}await a.yield();{const y=qa(e,h);for(let J=F.length-1;J>=0;J--)Math.hypot(F[J].x-y.x,F[J].z-y.z)<20&&F.splice(J,1);F.forEach((J,oe)=>{J.v=oe})}const S=xt.makeScatter({rng:o.fork("s"),points:F,variants:te,farVariants:d,farDistance:52,material:r,wind:m,tint:.12,hue:.02});L.add(S.object),await a.yield();const _=[];for(let y=0;y<2;y++)_.push(xt.bushGeometry({rng:o.fork("b"),size:o.range(1.5,2.2),detail:0,leaf:"#6f7b58",leafLight:"#98a070",leafDark:"#3f4a34",bark:"#4a3c30"})),await a.yield();const I=[];for(let y=0;I.length<Math.round(70*P)&&y<2500;y++){const J=o.range(-140,190),oe=o.range(-20,200),K=h.sample(J,oe);if(K.kind===1||K.wall||K.tr>.05||K.lat<9)continue;const E=K.kind===0?K.dO:K.dI-14;E<3.5||E>13||Math.abs(J)<58&&oe<30||I.push({x:J,y:K.h-.15,z:oe,s:o.range(.8,1.5),rot:o()*6.283,d:K.lat,u:Ze(K.s/e.L,0,.999),v:I.length})}await a.yield();const s=xt.makeScatter({rng:o.fork("bs"),points:I,variants:_,material:r,wind:m,tint:.15,hue:.03});L.add(s.object),await a.yield();const p=qa(e,h),D=p.x,U=p.z,z=p.y,b=xt.deadTreeGeometry({rng:o.fork("d"),height:11.5,detail:2,bark:"#cfc5b0",barkDark:"#8a8070"});await a.yield();const x=new t.Mesh(b,jt(i,{DISTDARK:1},{alb:.86,gloss:.02}));x.position.set(D,z-.2,U),x.rotation.y=o()*6.283,x.updateMatrixWorld(!0),L.add(x);const g=[],W=b.attributes.position,se=new t.Vector3,ye=[];for(let y=0;y<W.count;y+=3)se.fromBufferAttribute(W,y),se.y>5.5&&ye.push(se.clone());ye.sort((y,J)=>J.y-y.y);for(const y of ye){if(g.length>=8)break;g.every(J=>J.distanceTo(y)>1.7)&&g.push(y)}for(const y of g)y.applyMatrix4(x.matrixWorld);const Y=[];for(const y of h.figs){await a.yield();const J=xt.oakGeometry({rng:o.fork("f"+y[2]),height:20.5+.5*o.range(19,22)-9.5,detail:2,leaf:"#467a36",leafLight:"#86b24e",leafDark:"#2c5226",bark:"#b8a468",barkDark:"#6e6038",fullness:1.38}),oe=new t.Mesh(J,r),K=h.height(y[0],y[1]);oe.position.set(y[0],K-.3,y[1]),oe.rotation.y=o()*6.283,L.add(oe),Y.push({x:y[0],y:K,z:y[1],side:y[2]}),await a.yield()}const R=new bt.Geo,V=new t.Color(.2,.165,.1),j=new t.Color(.125,.1,.06),Q=new t.Color(.04,.03,.02),X=e.pathY(e.L)-1.5;for(const y of Y){await a.yield();const J=9,oe=o()*6.283;for(let K=0;K<J;K++){const E=oe+K/J*6.283+o.range(-.18,.18),he=o.range(2.4,4.8),me=o.range(1.3,2.5),ze=Math.cos(E),le=Math.sin(E),ce=o.range(-.7,.7),de=o()*6.283,re=9,H=[];for(let ue=0;ue<=re;ue++){const ie=ue/re,Be=.35+he*ie,Ue=ce*ie*ie*1.4+.3*Math.sin(ie*5+de)*ie,We=y.x+ze*Be-le*Ue,Ge=y.z+le*Be+ze*Ue,Fe=h.height(We,Ge),Ee=Math.max(Fe+.1*(1-ie),y.y+me*Math.pow(1-ie,1.8)*(1+.12*Math.sin(ie*9+de))+.3*(1-ie))-(ue===re?.25:0),je=Math.min(Fe,Ee)-.35,ae=(.34*(1-.7*ie)+.07)*(ue===re?.3:1),Me=-le*ae,Se=ze*ae,ot=je+(Ee-je)*.55,Je=V.clone().lerp(j,.2+.6*ie),st=[R.v(We+Me*1.5,je,Ge+Se*1.5,Q),R.v(We+Me,ot,Ge+Se,Je.clone().lerp(Q,.35)),R.v(We+Me*.45,Ee-ae*.5,Ge+Se*.45,Je),R.v(We,Ee,Ge,Je),R.v(We-Me*.45,Ee-ae*.5,Ge-Se*.45,Je),R.v(We-Me,ot,Ge-Se,Je.clone().lerp(Q,.35)),R.v(We-Me*1.5,je,Ge-Se*1.5,Q)];H.push(st)}for(let ue=0;ue<re;ue++)for(let ie=0;ie<6;ie++)R.quad(H[ue][ie],H[ue][ie+1],H[ue+1][ie+1],H[ue+1][ie])}for(let K=0;K<8;K++){const E=o()*6.283,he=o.range(4,8),me=o.range(.1,.17),ze=o()*6.283,le=[],ce=[];for(let de=0;de<=6;de++){const re=de/6,H=1+he*re,ue=.7*Math.sin(re*4+ze)*re,ie=y.x+Math.cos(E)*H-Math.sin(E)*ue,Be=y.z+Math.sin(E)*H+Math.cos(E)*ue;le.push([ie,h.height(ie,Be)+me*(.5-1.3*re*re),Be]),ce.push(me*(1-.6*re))}R.tube(le,ce,5,j,Q)}for(let K=0;K<6;K++){const E=o.range(0,6.283),he=o.range(1.5,3.6),me=y.x+Math.cos(E)*he,ze=y.z+Math.sin(E)*he,le=h.height(me,ze),ce=o.range(1.2,2.8);R.tube([[me,le+.3,ze],[me+o.range(-.3,.3),le-ce*.5,ze+o.range(-.3,.3)],[me+o.range(-.4,.4),Math.max(X+.1,le-ce),ze+o.range(-.4,.4)]],[.11,.08,.04],5,j,Q)}}await a.yield();{const y=a.rng.fork("figroots"),J=e.posAt(e.L-1.5,new t.Vector3),oe=e.tanAt(e.L-1.5,new t.Vector3),K=1/Math.max(1e-4,Math.hypot(oe.x,oe.z)),E=oe.x*K,he=oe.z*K;for(const me of Y)for(let ze=0;ze<7;ze++){const le=y.range(-5.5,4.5),ce=e.L-1.5+le,de=Ba(e,ce),re=e.pathY(ce)-1.5,H=(ot,Je)=>[J.x+E*ot-he*me.side*Je,J.z+he*ot+E*me.side*Je],ue=H(le,de+5),ie=h.height(ue[0],ue[1]),Be=y.range(.55,1),Ue=y.range(.09,.17),We=y.range(-.5,.5),Ge=y.range(-.6,.6),Fe=Math.max(re+.08,ie-(ie-re)*Be),Ee=H(le*.35,Ta-.7),je=H(le*.8,de+1.5),ae=H(le,de+.25),Me=H(le+We,de-.18),Se=H(le+We+Ge,de-.2-(Be>.97?.5:0));R.tube([[Ee[0],ie+.2,Ee[1]],[je[0],ie+.16,je[1]],[ae[0],ie+.12,ae[1]],[Me[0],(ie+Fe)*.5+.2,Me[1]],[Se[0],Fe,Se[1]]],[Ue*1.2,Ue,Ue*.95,Ue*.8,Ue*.45],5,j,Q)}}await a.yield();const C=new t.Mesh(R.build(),jt(i,{},{alb:1,gloss:.03}));C.frustumCulled=!1,L.add(C);let ee=C.geometry.index.count/3+b.index.count/3+(S.triangles||0)+(s.triangles||0);return L.traverse(y=>{y.isMesh&&y.geometry.userData?.kind==="oak"&&(ee+=y.geometry.index.count/3)}),{group:L,thorns:S,bushes:s,perches:g,deadPos:new t.Vector3(D,z,U),figs:Y,pts:F,mat:r,triangles:ee,update(y,J,oe){S.update(y,J,oe),s.update(y,J,oe)}}}function Io(){const a=new bt.Geo,e=Te("#ffffff"),h=Te("#b8b8b8");a.loft([{z:-.42,y:0,rx:0,ry:0},{z:-.2,y:0,rx:.07,ry:.06},{z:.1,y:.01,rx:.1,ry:.09},{z:.3,y:.03,rx:.06,ry:.06},{z:.44,y:.04,rx:0,ry:0}],{sides:5,top:e,belly:h}),a.fan([[0,0,-.3],[-.14,0,-.56],[.14,0,-.56]],e,h);const i=a.n;for(const L of[-1,1]){const P=[[L*.06,.02,.2],[L*.45,.03,.24],[L*.8,.02,.14],[L*1,.02,-.02]],c=[[L*.06,.01,-.14],[L*.45,.01,-.16],[L*.8,.01,-.14],[L*1,.01,-.12]];a.strip(P,c,e,h)}const v=a.build(),m=v.attributes.position.count,o=new Float32Array(m);for(let L=i;L<m;L++)o[L]=Math.min(1,Math.abs(v.attributes.position.getX(L)));return v.setAttribute("aW",new t.BufferAttribute(o,1)),v}function Oo(){const a=new bt.Geo,e=Te("#5e4c3c"),h=Te("#8a7458"),i=Te("#c2aa86"),v=Te("#fff4e0"),m=Te("#d8b4a4"),o=Te("#2a221c");a.loft([{z:-.3,y:0,rx:0,ry:0},{z:-.2,y:0,rx:.085,ry:.075},{z:.04,y:-.012,rx:.135,ry:.125},{z:.25,y:-.012,rx:.12,ry:.115},{z:.36,y:0,rx:.07,ry:.07}],{sides:7,top:h,belly:i}),a.loft([{z:.32,y:0,rx:.086,ry:.082},{z:.4,y:-.012,rx:.092,ry:.088},{z:.46,y:-.025,rx:.05,ry:.05}],{sides:6,top:v,belly:v}),a.loft([{z:.44,y:-.03,rx:.04,ry:.04},{z:.53,y:-.055,rx:.043,ry:.046},{z:.6,y:-.085,rx:.03,ry:.036},{z:.67,y:-.14,rx:0,ry:0}],{sides:5,top:m,belly:m}),a.fan([[0,.005,-.22],[-.14,0,-.47],[-.06,0,-.53],[.06,0,-.53],[.14,0,-.47]],e,o);const L=a.n;for(const B of[-1,1]){const te=[[B*.07,.02,.25],[B*.33,.035,.31],[B*.6,.035,.28],[B*.82,.025,.21]],w=[[B*.07,.03,.06],[B*.33,.045,.08],[B*.6,.04,.07],[B*.82,.03,.045]],M=[[B*.07,0,-.2],[B*.33,0,-.21],[B*.6,0,-.19],[B*.82,0,-.13]];a.strip(te,w,i,h),a.strip(w,M,h,e);for(let O=0;O<5;O++){const d=.19-O*.075,F=.3-O*.115,l=B*(1-.035*Math.abs(O-1.2));a.strip([[B*.8,.02,d+.03],[B*.9,.03,(d+F)*.5+.028],[l,.045,F+.012]],[[B*.8,.02,d-.035],[B*.9,.03,(d+F)*.5-.028],[l,.045,F-.012]],e,o)}}const P=a.build(),c=P.attributes.position.count,r=new Float32Array(c);for(let B=L;B<c;B++)r[B]=Math.min(1,Math.abs(P.attributes.position.getX(B)));return P.setAttribute("aW",new t.BufferAttribute(r,1)),P}function No(){const a=new bt.Geo,e=Te("#7a6650"),h=Te("#94806a"),i=Te("#40352b"),v=Te("#2e2721"),m=Te("#e6dcc8"),o=Te("#c9a394"),L=Te("#55483c");a.loft([{z:-.5,y:.02,rx:0,ry:0},{z:-.36,y:.02,rx:.12,ry:.1},{z:-.1,y:0,rx:.2,ry:.17},{z:.16,y:.01,rx:.2,ry:.18},{z:.33,y:0,rx:.13,ry:.13}],{sides:7,top:e,belly:h}),a.loft([{z:.29,y:0,rx:.14,ry:.14},{z:.36,y:-.01,rx:.15,ry:.15},{z:.43,y:-.03,rx:.09,ry:.09}],{sides:7,top:m,belly:m}),a.loft([{z:.41,y:-.04,rx:.06,ry:.06},{z:.5,y:-.09,rx:.065,ry:.07},{z:.58,y:-.15,rx:.05,ry:.055}],{sides:6,top:o,belly:o}),a.loft([{z:.56,y:-.16,rx:.035,ry:.04},{z:.64,y:-.22,rx:.025,ry:.035},{z:.68,y:-.29,rx:0,ry:0}],{sides:5,top:L,belly:L});for(const P of[-1,1])a.strip([[P*.15,.17,.3],[P*.225,.15,.05],[P*.2,.11,-.3],[P*.08,.06,-.66]],[[P*.19,-.1,.27],[P*.235,-.12,.02],[P*.2,-.1,-.3],[P*.07,-.02,-.62]],i,v);return a.fan([[0,.03,-.4],[-.1,.02,-.7],[.1,.02,-.7]],v,v),a.build()}function so(a=0){const e=new bt.Geo,h=(d,F,l)=>new t.Color(d,F,l),i=h(.05,.055,.025),v=h(.018,.02,.012),m=h(.12,.11,.05),o=h(.36,.32,.2),L=h(.66,.4,.3),P=h(.75,.72,.62),c=e.loft([[-2.7,.05,0,0],[-2.45,.06,.035,.1],[-2,.06,.07,.15],[-1.5,.05,.14,.19],[-1,.03,.25,.22],[-.55,.02,.38,.25],[-.1,.01,.46,.27],[.35,.01,.47,.27],[.75,.01,.4,.245],[1.05,.02,.31,.2],[1.25,.03,.27,.17]].map(d=>({z:d[0],y:d[1],rx:d[2],ry:d[3]})),{sides:12,top:i,belly:m,shade:[-.2,.75],flat:.55});e.paint(c,(d,F,l,S)=>{const _=Math.max(0,Math.sin(l*5.2+Math.abs(d)*2));S.lerp(v,.55*_*_),F<-.02&&S.lerp(o,.7)});for(let d=0;d<26;d++){const F=1.05-d*.14,l=F<-1,S=Ze((F+2.7)/1.7,.1,1);for(const _ of l?[-1,1]:[-2,-1,1,2]){const I=l?_*.07*S:_*(Math.abs(_)===1?.085:.24)*Math.min(1,S*1.2),s=l?.05+.2*S:.27-(Math.abs(_)===2?.045:0)-(F>.7?(F-.7)*.2:0),p=l?.07*S+.035:.04;e.fan([[I,s+p,F-.01],[I-.045,s-.02,F+.07],[I+.045,s-.02,F+.07],[I+.045,s-.02,F-.07],[I-.045,s-.02,F-.07],[I-.045,s-.02,F+.07]],i,v)}}for(let d=0;d<9;d++){const F=-1.75-d*.105,l=Ze((F+2.7)/1,.05,1),S=.06+.15*l;e.fan([[0,S+.07*l+.03,F-.02],[0,S-.01,F+.06],[.02,S-.02,F],[0,S-.01,F-.06],[-.02,S-.02,F],[0,S-.01,F+.06]],i,v)}for(const d of[-1,1])for(const F of[.72,-.5])e.tube([[d*.36,0,F],[d*.56,-.03,F-.14],[d*.62,-.1,F-.36],[d*.6,-.14,F-.5]],[.085,.07,.05,.035],5,i,m);const r=e.n;e.loft([[1.25,.1,.26,.1],[1.42,.12,.25,.105],[1.6,.115,.2,.09],[1.9,.105,.15,.075],[2.2,.1,.13,.07],[2.36,.105,.12,.07],[2.42,.095,0,0]].map(d=>({z:d[0],y:d[1],rx:d[2],ry:d[3]})),{sides:10,top:i,belly:a>0?L:m,shade:a>0?[-.35,0]:[-.2,.6],flat:.75});for(const d of[-1,1]){e.blob(d*.135,.2,1.47,.05,.055,.085,v,i,6,4),e.blob(d*.15,.215,1.49,.02,.02,.03,h(.5,.42,.12),v,4,3),e.blob(d*.035,.15,2.36,.025,.02,.035,v,v,4,3);for(let F=0;F<9;F++){const l=1.5+F*.105,S=.2-(l-1.5)*.085;e.fan([[d*S,.03,l],[d*S,.085,l-.03],[d*S,.085,l+.03]],P,P)}}const B=e.n;e.loft([[1.2,-.03,.26,.075],[1.5,-.03,.22,.06],[1.9,-.025,.14,.045],[2.25,-.02,.11,.04],[2.38,-.02,0,0]].map(d=>({z:d[0],y:d[1],rx:d[2],ry:d[3]})),{sides:8,top:a>0?L:m,belly:o,shade:a>0?[.3,.8]:[-.6,.2],flat:.3});for(const d of[-1,1])for(let F=0;F<8;F++){const l=1.55+F*.105,S=.19-(l-1.5)*.085;e.fan([[d*S,.07,l],[d*S,.015,l-.03],[d*S,.015,l+.03]],P,P)}const te=e.n;if(a>0){const d=(F,l,S,_)=>e.move(F,I=>{const s=I.z-S,p=I.y-l;I.set(I.x,l+p*Math.cos(_)+s*Math.sin(_),S+s*Math.cos(_)-p*Math.sin(_))});d([r,B],.06,1.25,a),d([B,te],0,1.22,-a*.32),e.move([0,e.n],F=>{const l=u(-.2,1.3,F.z),S=.3*l,_=.1,I=F.z-_,s=F.y;F.z>_&&F.set(F.x,s*Math.cos(S)+I*Math.sin(S)*1,_+I*Math.cos(S)-s*Math.sin(S))})}const w=e.build(),M=w.attributes.position.count,O=new Float32Array(M);for(let d=0;d<M;d++)O[d]=Ze((-.3-w.attributes.position.getZ(d))/2.2,0,1);return w.setAttribute("aW",new t.BufferAttribute(O,1)),w}const St=[.8,.86],Pa=[.74,.5],Ro=.86,Eo=.6;function io(a=!1){const e=a?9:14,h=a?8:12,i=new bt.Geo,v=(s,p,D)=>new t.Color(s,p,D),m=new t.Color,o=v(.086,.071,.074),L=v(.118,.1,.094),P=v(.15,.118,.108),c=v(.2,.15,.135),r=v(.035,.028,.027),B=v(.4,.19,.15),te=v(.15,.045,.036),w=v(.26,.19,.165),M=v(.76,.7,.56),O=v(.52,.43,.28),d=v(.44,.21,.165),F=v(.46,.25,.19),l=(s,p,D)=>{const U=i.n,z=[];for(const b of s){const[x,g,W,se,ye=.5,Y=2,R=2,V=2]=b;if(!(se>1e-5)){const X=i.v(0,(g+W)/2,x,o);D(X,0,0,x,(g+W)/2),z.push([X]);continue}const j=[],Q=W+(g-W)*ye;for(let X=0;X<p;X++){const C=X/p*Math.PI*2,ee=Math.cos(C),y=Math.sin(C),J=se*Math.sign(y)*Math.pow(Math.abs(y),2/V),oe=ee>=0?Q+(g-Q)*Math.pow(ee,2/Y):Q-(Q-W)*Math.pow(-ee,2/R),K=i.v(J,oe,x,o);D(K,ee,y,x,oe),j.push(K)}z.push(j)}for(let b=0;b<z.length-1;b++){const x=z[b],g=z[b+1];if(!(x.length===1&&g.length===1))for(let W=0;W<p;W++){const se=(W+1)%p;x.length===1?i.tri(x[0],g[W],g[se]):g.length===1?i.tri(x[W],g[0],x[se]):i.quad(x[W],g[W],g[se],x[se])}}return[U,i.n]},S=(s,p,D,U,z,b=0)=>{i.c[s*3]=p.r,i.c[s*3+1]=p.g,i.c[s*3+2]=p.b,i.a[s*4]=D,i.a[s*4+1]=U,i.a[s*4+2]=z,i.a[s*4+3]=b},_=(s,p,D,U)=>{for(let z=s[0];z<s[1];z++)i.a[z*4]=p,i.a[z*4+1]=D,i.a[z*4+2]=U;return s},I=s=>u(.7,.92,s);l([[-1.78,.8,.7,0],[-1.72,.97,.52,.24],[-1.55,1.08,.33,.45],[-1.25,1.15,.16,.6,.5,2.2],[-.8,1.18,.06,.69,.48,2.3],[-.3,1.17,.04,.72,.48,2.3],[.1,1.17,.08,.7,.5,2.3],[.38,1.19,.16,.62,.52,2.2],[.58,1.17,.27,.5,.55],[.74,1.12,.36,.42,.55],[.9,1.07,.44,.36,.55],[.94,.78,.74,0]],e,(s,p,D,U,z)=>{m.copy(L).lerp(o,u(-.1,.6,p)),p<-.15&&m.lerp(P,u(-.15,-.75,p)),U>.42&&U<.92&&m.multiplyScalar(.84+.16*Math.cos((U-.42)*39)),m.multiplyScalar(.9+.2*Math.sin(U*7+D*3)*Math.sin(z*9)),U>.92?S(s,te,0,1,1):S(s,m,0,u(.5,.9,U),0)}),l([[.74,1.08,.8,.33,.3,2.4,6,2.4],[.9,1.13,.8,.355,.3,2.5,6,2.5],[1.05,1.13,.8,.34,.3,2.4,6,2.5],[1.22,1.05,.8,.29,.3,2.3,6,2.4],[1.42,1.01,.8,.28,.3,2.3,6,2.4],[1.62,1.05,.795,.335,.3,2.6,6,2.6],[1.82,1.09,.79,.385,.32,2.8,6,2.8],[1.96,1.05,.795,.36,.35,2.8,5,2.8],[2.04,.96,.815,.24,.4,2.4,3,2.4],[2.065,.88,.88,0]],e,(s,p,D,U,z)=>{if(p<-.35){S(s,m.copy(te).lerp(B,u(.86,1.5,U)),I(U),1,1);return}m.copy(L).lerp(o,u(-.1,.5,p)),p<.12&&m.lerp(w,u(.12,-.3,p)*u(.95,1.3,U)),m.lerp(c,.5*u(.3,.75,Math.abs(D))*(1-u(.12,.3,Math.abs(U-1.02)))),m.multiplyScalar(.92+.16*Math.sin(U*13+D*5)),S(s,m,I(U),1,0)}),l([[.78,.8,.52,.32,.8,6,2.2,2.4],[.95,.8,.44,.335,.78,6,2.2,2.4],[1.2,.8,.46,.3,.75,6,2.2,2.4],[1.45,.8,.51,.285,.75,6,2.3,2.4],[1.65,.795,.515,.33,.72,6,2.6,2.6],[1.84,.79,.525,.38,.7,6,2.8,2.8],[1.97,.795,.56,.35,.7,5,2.8,2.8],[2.035,.8,.66,.22,.7,3,2.4,2.4],[2.055,.74,.74,0]],h,(s,p,D,U,z)=>{const b=-u(.72,.95,U);if(p>.35){S(s,m.copy(te).lerp(B,u(.86,1.5,U)),b,1,1);return}m.copy(P).lerp(L,.55*u(-.6,.1,p)),p>-.1&&m.lerp(w,u(-.1,.3,p)*u(.95,1.3,U)),m.multiplyScalar(.9+.2*Math.sin(U*11+D*4)),S(s,m,b,1,0)}),a||_(l([[.98,.83,.79,0],[1.1,.875,.79,.15,.3,2,6],[1.4,.89,.79,.2,.3,2,6],[1.68,.875,.79,.18,.3,2,6],[1.86,.83,.79,0]],8,s=>S(s,d,-1,1,1)),-1,1,1),a||_(l([[1,.8,.77,0],[1.15,.8,.735,.2,.7,6,2],[1.5,.8,.728,.2,.7,6,2],[1.8,.8,.735,.25,.7,6,2],[1.96,.8,.77,0]],8,s=>S(s,F,1,1,1)),1,1,1);for(const s of[-1,1]){const p=a?[]:[0,.14,.28,.42,.54],D=[-1,-.5,0,.5,1],U=[];for(const b of p){const x=[];for(const g of D){const W=St[1]+b*1.2,se=1-Math.abs(g),ye=St[1]+b*1.2*(1-.32*se),Y=.335-.055*u(.95,1.35,W),R=i.v(s*(Y-.015)*(1-.16*se),.8,ye,o);S(R,m.copy(te).lerp(B,u(0,.5,b)).lerp(w,.55*Math.abs(g)*u(.2,.5,b)),g,1,1),x.push(R)}U.push(x)}for(let b=0;b<p.length-1;b++)for(let x=0;x<D.length-1;x++)i.quad(U[b][x],U[b+1][x],U[b+1][x+1],U[b][x+1]);const z=i.blob(s*.318,1.2,.855,.052,.09,.034,o,c,a?5:6,a?3:4);for(let b=z[0];b<z[1];b++)i.a[b*4]=I(.87),i.a[b*4+1]=1,i.a[b*4+3]=s*Ze((i.p[b*3+1]-1.12)/.17,0,1);_(i.blob(s*.245,1.135,1.05,.078,.064,.098,o,c,a?5:7,a?3:4),1,1,0),_(i.blob(s*.302,1.152,1.078,.031,.03,.036,r,r,5,3),1,1,3),_(i.blob(s*.165,1.1,1.85,.078,.052,.088,o,w,a?5:6,a?3:4),1,1,0),!a&&(_(i.blob(s*.2,1.138,1.875,.03,.018,.04,r,r,4,3),1,1,0),_(i.tube([[s*.275,.77,1.87],[s*.305,.92,1.85],[s*.318,1.05,1.8],[s*.31,1.15,1.74]],[.052,.045,.031,0],6,O,M),-1,1,2),_(i.tube([[s*.09,.78,1.955],[s*.097,.87,1.985],[s*.1,.945,1.995]],[.033,.027,0],5,O,M),-1,1,2),_(i.tube([[s*.305,.82,1.74],[s*.315,.72,1.76],[s*.315,.63,1.77]],[.042,.033,0],5,O,M),1,1,2),_(i.tube([[s*.085,.82,1.965],[s*.085,.73,1.985]],[.03,0],5,O,M),1,1,2))}for(let s=0;s<i.n;s++){const p=i.p[s*3+2];if(p<=.8)continue;const D=u(.8,1.15,p);p>St[1]&&(i.p[s*3+2]=St[1]+(p-St[1])*.86),i.p[s*3+1]=St[0]+(i.p[s*3+1]-St[0])*(1+.24*D),i.p[s*3]*=1+.14*D}return i.build()}function jo(a){const e=a.uniforms;return new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...e},fog:!0,vertexColors:!0,side:t.DoubleSide,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 aAnim, iH; uniform float uTime;
      varying vec3 vN, vW, vC, vL; varying vec4 vM;
      vec2 turn(vec2 zy, float a){ float c = cos(a), s = sin(a); return vec2(zy.x * c - zy.y * s, zy.y * c + zy.x * s); }      // (z, y): a positive angle lifts the nose
      void main(){
        vec3 p = position, n = normal;
        float ph = iH.y + sign(aAnim.w) * 1.7, e = max(sin(uTime * (.8 + .5 * fract(ph * 7.3)) + ph * 40.), 0.); e *= e; e *= e; e *= e; e *= e;
        float fl = e * sin(uTime * 31. + ph * 9.), ew = abs(aAnim.w);                               // an ear flicks: a quick shiver every few seconds
        p.z -= ew * fl * .07; p.x += sign(aAnim.w) * ew * fl * .035;
        float ja = iH.x * (aAnim.x > 0. ? ${Ro.toFixed(2)} : ${Eo.toFixed(2)}) * aAnim.x;
        p.zy = vec2(${St[1].toFixed(2)}, ${St[0].toFixed(2)}) + turn(p.zy - vec2(${St[1].toFixed(2)}, ${St[0].toFixed(2)}), ja); n.zy = turn(n.zy, ja);
        float ha = (.1 * iH.w + .03 * iH.x) * aAnim.y;
        p.zy = vec2(${Pa[1].toFixed(2)}, ${Pa[0].toFixed(2)}) + turn(p.zy - vec2(${Pa[1].toFixed(2)}, ${Pa[0].toFixed(2)}), ha); n.zy = turn(n.zy, ha);
        vL = position; vC = color; vM = vec4(aAnim.z, iH.x, iH.z, iH.y);
        vec4 wp = vec4(p, 1.);
        #ifdef USE_INSTANCING
          wp = instanceMatrix * wp; n = mat3(instanceMatrix) * n;
        #endif
        wp = modelMatrix * wp; vW = wp.xyz; vN = mat3(modelMatrix) * n;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC, uCamL, uTea, uSkyRef, uFoam; uniform float uWaterY, uTime;
      varying vec3 vN, vW, vC, vL; varying vec4 vM;
      ${lt}
      void main(){
        vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(uCamL - vW + vec3(0., 1e-5, 0.)), Hh = normalize(uSun + V);
        float m = vM.x, lining = step(.5, m) * step(m, 1.5), ivory = step(1.5, m) * step(m, 2.5), eye = step(2.5, m), hide = 1. - step(.5, m);
        float fine = 1. - smoothstep(.02, .07, fwidth(vL.z) + fwidth(vL.y));                             // nothing finer than the screen can draw
        float n1 = vn3(vL * vec3(7., 9., 5.) + vM.w * 9.), n2 = mix(.5, vn3(vL * 14.), fine), wr = mix(.5, vn2(vec2(vL.z * 9. + vL.y * 2., vL.y * 13. + vL.x * 8.)), fine);
        vec3 alb = vC;
        alb *= mix(1., (.78 + .34 * n1) * (.86 + .28 * wr), hide);                                    // blotched and creased, never one flat tone
        alb *= mix(1., .82 + .18 * sin(vL.z * 58. + n2 * 2.), lining * step(vL.y, .8));              // the ridges of the palate
        alb *= mix(1., .9 + .2 * n2, lining + ivory);
        alb *= mix(1., .42 + .58 * smoothstep(.95, 1.7, vL.z), lining);                               // the mouth is a cave: it darkens back to the throat
        N = normalize(N + (vec3(n1, wr, n2) - .5) * .35 * hide);
        float ndl = dot(N, uSun), dif = max(ndl * .6 + .4, 0.);
        float sunL = dot(uSunC, vec3(.3, .5, .2)), skyL = dot(uSkyC, vec3(.3, .5, .2));
        vec3 sunD = mix(uSunC, vec3(sunL), .64 - .46 * lining), skyD = mix(uSkyC, vec3(skyL), .35 + .25 * lining);      // the mouth takes the gold key like everything else here
        dif = mix(dif, max(ndl * .85 + .15, 0.), lining);                                             // and is modelled by it: lit on the sun's side, in its own shade on the other
        vec3 amb = mix(uGndC * .9, skyD, N.y * .5 + .5) + vec3(.09, .085, .08) * sunL;
        vec3 col = alb * (sunD * dif * .9 + amb * (1. - .3 * lining));
        col += alb * sunD * lining * .08 * (.5 + .5 * max(-ndl, 0.));                                 // light comes through the thin flesh of the mouth
        float fr = 1. - max(dot(N, V), 0.), fr2 = fr * fr, fr3 = fr2 * fr, nh = max(dot(N, Hh), 0.), up = smoothstep(-.1, .8, N.y);
        float wetK = hide * (.55 + .45 * smoothstep(uWaterY + 1.4, uWaterY + .1, vW.y)) + lining * .3 + eye;
        vec3 skyM = mix(uSkyRef, vec3(.36, .5, .8) * (dot(uSkyRef, vec3(.3, .5, .2)) * 1.4 + .1), .6);
        col += skyM * wetK * (fr3 * fr * .2 + .04 * up + .02 * fr2);                                        // the sky lying on a wet back
        col += uSunC * wetK * (pow(nh, 70.) * .9 + pow(nh, 12.) * .05 * up);                           // and the low sun in a streak along it
        col += uSunC * fr3 * fr * smoothstep(-.3, .2, ndl) * (1. - .8 * smoothstep(.3, .7, ndl)) * .5 * hide;      // a gold rim where the light grazes
        col += uSunC * ivory * pow(nh, 20.) * .15;
        if (eye > .5) { float eg = pow(max(dot(N, normalize(V + vec3(0., .8, 0.))), 0.), 16.); col = alb * amb * .5 + (uSkyRef * 2.4 + uSunC * .6) * eg * eg; }
        // water streaming off whatever has just come up: bright threads running down it
        float st = vn2(vec2(vL.z * 11. + vL.x * 7., vW.y * 2.4 + uTime * 3.6 + vM.w * 5.)), thread = smoothstep(.66, .8, st) * vM.z * hide * smoothstep(uWaterY, uWaterY + .25, vW.y) * fine;
        col = mix(col, uFoam * (uSunC * .5 + uSkyC * .9), thread * .1);
        // the waterline: a torn band of foam, and what is under water goes to the river's own brown
        float fm = vn2(vec2(vL.z * 8. + uTime * .7, vL.x * 5.)) * .6 + vn2(vL.zx * 17.) * .4, band = (1. - smoothstep(.02, .08 + .12 * fm, abs(vW.y - uWaterY - .03))) * smoothstep(.3, .6, fm);
        col = mix(col, uFoam * (uSunC * .4 + uSkyC), band * (.45 + .5 * vM.z));
        col = mix(col, uTea * (uSunC * .25 + uSkyC), (1. - smoothstep(uWaterY - .35, uWaterY + .01, vW.y)) * .88);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function Ho(a,e,h){const i=a.uniforms,v=e.length,m=new Float32Array(v*4),o=new Float32Array(v*2);e.forEach((B,te)=>{m.set([B.x,B.z,B.size,B.ph],te*4),o.set([B.k,0],te*2)});const L=new t.InstancedBufferGeometry,P=new t.PlaneGeometry(2,2);L.index=P.index,L.setAttribute("position",P.attributes.position),L.setAttribute("iR",new t.InstancedBufferAttribute(m,4)),L.setAttribute("iQ",new t.InstancedBufferAttribute(o,2)),L.instanceCount=v;const c=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...i,uRipY:{value:h+.045}},fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.OneFactor,blendDstAlpha:t.OneMinusSrcAlphaFactor,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 iR; attribute vec2 iQ; uniform float uRipY;
      varying vec2 vUv; varying vec4 vK;
      void main(){
        float sz = iR.z * (1. + .5 * iQ.y);
        vec4 mvPosition = modelViewMatrix * vec4(iR.x + position.x * sz, uRipY, iR.y + position.y * sz, 1.);
        vUv = position.xy; vK = vec4(iR.w, iQ.x, iQ.y, sz);
        gl_Position = iQ.x > .004 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSunC, uSkyC, uTea, uSkyRef, uFoam, uHaze; uniform float uTime;
      varying vec2 vUv; varying vec4 vK;
      ${lt}
      ${ia}
      void main(){
        float r = length(vUv), fw = fwidth(r), n = vn2(vUv * 3.1 + vK.x * 9.), h = 0., body = .2 / (1. + .5 * vK.z);
        if (vK.x > 9.5) {                                                        // (phase 10 and over: a patch of torn foam the waders have left, drifting)
          vec2 w = vUv * vK.w; float sd = vK.x - 10.;
          float fn = vn2(w * vec2(.5, 1.1) + sd * 17. + vec2(uTime * .08, 0.)), lace = vn2(w * vec2(2.2, 6.5) - sd * 9. + vec2(uTime * .21, uTime * .05)) * .6 + vn2(w * vec2(5., 13.) + sd * 5.) * .4;
          float fwl = fwidth(w.y) * 6.5;                                           // the lace goes to a thin even film where it is too fine to draw
          float f = smoothstep(.5, .7, fn) * mix(smoothstep(.5, .62, lace) * (1. - .6 * smoothstep(.7, .82, lace)), .22, smoothstep(.25, .8, fwl)) * (1. - smoothstep(.45, 1., r)) * vK.y * .8;
          gl_FragColor = vec4(fogMix(uFoam * (uSunC * .4 + uSkyC), FOGD) * f, f);
          return;
        }
        for (int i = 0; i < 3; i++) {
          float ph = fract(uTime * (.16 + .1 * vK.z) + float(i) / 3. + vK.x), rr = body + ph * (.95 - body) + (n - .5) * .08, wd = .09 + .08 * ph;
          float d = (r - rr) / wd, env = exp(-d * d) * (1. - ph) * smoothstep(0., .12, ph);
          h += env * sin(d * 2.4 + .6) * (1. - smoothstep(1., 3., fw / wd));                       // too fine to draw: gone, not a shimmer
        }
        h *= vK.y * (1. + .8 * vK.z) * (1. - smoothstep(.8, 1., r));
        vec3 bright = mix(uHaze, uSkyRef, .5) * 1.25 + uSunC * .12, darkC = uTea * (uSkyC * .55);
        float fo = smoothstep(.5, .75, vn2(vUv * 9. + vK.x * 5. + uTime * .2) * .6 + vn2(vUv * 23.) * .4) * (1. - smoothstep(body * .6, body * 2.6, r)) * vK.z;      // froth where it heaved up
        float al = clamp(abs(h) * 1.7, 0., .85);
        vec3 col = mix(h > 0. ? bright : darkC, uFoam * (uSunC * .4 + uSkyC), fo * .85); al = max(al, fo * .85);
        gl_FragColor = vec4(fogMix(col, FOGD) * al, al);
      }`}),r=new t.Mesh(L,c);return r.frustumCulled=!1,r.renderOrder=3.2,{mesh:r,iQ:o,attr:L.attributes.iQ}}function $o(a,e,h,i,v,m){const o=a.rng.fork("bar"),L=new t.Group,P=new bt.Geo,c=new t.Vector3,r=new t.Vector3,B=new t.Color(.4,.36,.3),te=new t.Color(.12,.1,.085),w=[],M=(s,p)=>{e.posAt(s*e.L,c),e.tanAt(s*e.L,r);const D=1/Math.max(1e-4,Math.hypot(r.x,r.z)),U=c.x-r.z*D*p,z=c.z+r.x*D*p;return[U,Math.max(h.height(U,z),v-.12),z,r.x*D,r.z*D]},O=(s,p)=>Math.max(h.height(s,p),v-.12),d=(s,p,D,U,z)=>{const[b,,x,g,W]=M(s,p);if(h.sample(b,x).wall){for(let X=0;X<4;X++)w.push(M(s,p));return}const se=Math.cos(U),ye=Math.sin(U),Y=g*se-W*ye,R=W*se+g*ye,V=[],j=[],Q=o()*6.283;for(let X=0;X<=6;X++){const C=X/6,ee=.45*Math.sin(C*3+Q),y=b+Y*D*(C-.5)-R*ee,J=x+R*D*(C-.5)+Y*ee,oe=z*(1-.62*C);V.push([y,O(y,J)+oe*.6+.7*C*C,J]),j.push(oe)}P.tube(V,j,6,B,te);for(let X=0;X<4;X++){const C=2+X,ee=V[C],y=o.range(-.8,.8),J=o.range(1,1.9)*(1-.1*X),oe=-R*Math.sin(y)+Y*.35,K=Y*Math.sin(y)+R*.35,E=[ee[0]+oe*J*.75,ee[1]+J,ee[2]+K*J*.75];P.tube([ee,[ee[0]+oe*J*.25,ee[1]+J*.55,ee[2]+K*J*.25],E],[j[C]*.5,j[C]*.34,.025],5,B,te),w.push(E)}for(let X=0;X<5;X++){const C=X/5*6.283+o.range(-.3,.3),ee=o.range(.5,1),y=V[0],J=-R*Math.cos(C),oe=Y*Math.cos(C),K=Math.sin(C);P.tube([y,[y[0]-Y*.35+J*ee*.5,y[1]+K*ee*.5,y[2]-R*.35+oe*ee*.5],[y[0]-Y*.5+J*ee,Math.max(y[1]+K*ee,O(y[0],y[2])-.1),y[2]-R*.5+oe*ee]],[z*.55,z*.32,.03],5,te,te)}};d(.814,13.4,6.5,.5,.27),d(.834,-17.2,7.5,-.9,.3),d(.886,-8.6,5.5,.7,.22);const F=new t.Mesh(P.build(),jt(i,{},{alb:1,gloss:.04}));F.frustumCulled=!1,F.onBeforeRender=m,L.add(F);const l=bt.waderGeometry({...bt.WADER_PRESETS.egret,body:"#e9e7df",belly:"#f1efe8",wing:"#dedcd2",neckC:"#ebe9e1",cap:"#ebe9e1"}),S=[[...w[5]],[...w[7]],M(.818,14.8),M(.823,16.1),M(.827,14.3),M(.812,-19.5),M(.851,-15.6),M(.855,-17.4),M(.806,15.6),[...w[9]],M(.881,-10.6),M(.894,-9.8)],_=new t.InstancedMesh(l,jt(i,{},{alb:.8}),S.length),I=new t.Object3D;return S.forEach((s,p)=>{I.position.set(s[0],s[1]-.02,s[2]),I.rotation.set(0,o()*6.283,0),I.scale.setScalar(o.range(1.05,1.25)),I.updateMatrix(),_.setMatrixAt(p,I.matrix)}),_.frustumCulled=!1,_.onBeforeRender=m,L.add(_),{group:L,triangles:F.geometry.index.count/3+S.length*l.index.count/3}}function Zo(a,e){const h=a.uniforms,i=e.length,v=new Float32Array(i*4),m=new Float32Array(i*4),o=new Float32Array(i*4);e.forEach((te,w)=>{v.set([te.p[0],te.p[1],te.p[2],te.ev],w*4),m.set([te.v[0],te.v[1],te.v[2],te.life],w*4),o.set([te.s0,te.s1,w*.618%1,te.type],w*4)});const L=new t.InstancedBufferGeometry,P=new t.PlaneGeometry(2,2);L.index=P.index,L.setAttribute("position",P.attributes.position),L.setAttribute("bA",new t.InstancedBufferAttribute(v,4)),L.setAttribute("bB",new t.InstancedBufferAttribute(m,4)),L.setAttribute("bC",new t.InstancedBufferAttribute(o,4)),L.instanceCount=i;const c={value:[-1,-1,-1,-1,-1,-1]},r=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...h,uEv:c},fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.OneFactor,blendDstAlpha:t.OneMinusSrcAlphaFactor,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 bA, bB, bC; uniform float uEv[6]; uniform vec3 uSun;
      varying vec2 vUv; varying vec4 vK; varying float vLit;
      void main(){
        int ev = int(bA.w + .5); float age = ev == 0 ? uEv[0] : ev == 1 ? uEv[1] : ev == 2 ? uEv[2] : ev == 3 ? uEv[3] : ev == 4 ? uEv[4] : uEv[5];
        float life = bB.w, type = bC.w, lt = age - bC.z * .12, k = clamp(lt / life, 0., 1.), a = (lt > 0. && lt < life) ? 1. : 0.;
        vec3 right = normalize(vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]));
        vec3 up = normalize(vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]));
        vec3 p = bA.xyz; vec2 q = position.xy; float sz = mix(bC.x, bC.y, 1. - (1. - k) * (1. - k)); vec2 ext = vec2(sz);
        if (type < .5) { p += bB.xyz * lt; p.y -= 4.9 * lt * lt; a *= smoothstep(0., .08, k) * (1. - k); }
        else if (type < 1.5) { p += bB.xyz * lt * (1. - .45 * k); a *= smoothstep(0., .18, k) * (1. - k) * (1. - k) * 1.1; }
        else if (type > 2.5) { p += bB.xyz * lt * (1. - .5 * k); a *= smoothstep(0., .07, k) * (1. - k) * 1.7; }
        else { float rise = smoothstep(0., .16, lt), fall = 1. - smoothstep(.3, 1., k); q.y = q.y * .5 + .5; up = vec3(0., 1., 0.); ext = vec2(bC.x * (.55 + .9 * k), bC.y * rise * (.3 + .7 * fall)); a *= smoothstep(0., .05, k) * (1. - k * k); }
        float dz = -(modelViewMatrix * vec4(p, 1.)).z;
        if (type < .5) ext = min(ext, vec2(.011 * dz));                 // drops stay drops however near they fly: never a disc on the screen
        a *= smoothstep(.4, 1.5, dz);
        vLit = clamp(dot(uSun, right) * q.x * .4 + dot(uSun, up) * q.y * .4 + .6, 0., 1.);
        vUv = position.xy; vK = vec4(type, a, bC.z, lt);
        vec4 mvPosition = modelViewMatrix * vec4(p + right * q.x * ext.x + up * q.y * ext.y, 1.);
        gl_Position = a > .004 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSunC, uSkyC, uFoam;
      varying vec2 vUv; varying vec4 vK; varying float vLit;
      ${lt}
      ${ia}
      void main(){
        float type = vK.x, r = length(vUv), al;
        if (type < .5) { float n = vn2(vUv * 5.5 + vK.z * 31.), n2 = vn2(vUv * 12. - vK.z * 17.); al = max(smoothstep(.55, .76, n * .62 + n2 * .5), 1. - smoothstep(.2, .5, r)) * (1. - smoothstep(.4, 1., r)) * .95; }      // a drop with a few smaller ones round it
        else if (type < 1.5 || type > 2.5) { float n = vn2(vUv * 2.2 + vK.z * 17. + vK.w * .6) * .6 + vn2(vUv * 5.5 - vK.z * 9.) * .4; al = (1. - smoothstep(.1, 1., r + (n - .5) * .8)) * (1. - smoothstep(.7, 1., r)) * .5; }
        else al = spray(vec2(vUv.x, vUv.y * .5 + .5), vK.z, clamp(vK.w / 1.2, 0., 1.), vK.w);
        al *= vK.y;
        vec3 col = uFoam * (uSunC * (.25 + .5 * vLit) + uSkyC * .8);
        gl_FragColor = vec4(fogMix(col, FOGD) * al, al * .85);
      }`}),B=new t.Mesh(L,r);return B.frustumCulled=!1,B.renderOrder=4.2,{mesh:B,ages:c.value}}const Ka=(a,e)=>{const h=Math.max(a.r,a.g,a.b);return h>e?a.multiplyScalar(e/h):a};function Qo(a,e,h){const i=a.rng.fork("air"),v=e.uniforms,m=Math.round(650*(a.quality?.detail??1)),o=new Float32Array(m*3),L=new Float32Array(m);for(let p=0;p<m;p++)o.set([i()*36,i()*14,i()*36],p*3),L[p]=i();const P=new t.BufferGeometry;P.setAttribute("position",new t.BufferAttribute(o,3)),P.setAttribute("aS",new t.BufferAttribute(L,1));const c={uPx:{value:450},uAmt:{value:1},uCam:{value:new t.Vector3}},r=new t.ShaderMaterial({uniforms:{...v,...c},transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.OneFactor,blendDstAlpha:t.OneMinusSrcAlphaFactor,vertexShader:`
      attribute float aS; uniform float uTime, uPx, uAmt; uniform vec3 uWind, uCam;
      varying float vA, vS;
      void main(){
        vec3 p = position + (uWind * .8 + vec3(.3, 0., .2)) * uTime + vec3(sin(uTime * .7 + aS * 30.), sin(uTime * .9 + aS * 50.) * .6 + uTime * (.15 + .3 * aS), cos(uTime * .6 + aS * 40.)) * .5;
        p = mod(p - uCam + vec3(18., 4., 18.), vec3(36., 14., 36.)) - vec3(18., 4., 18.) + uCam;
        vec4 mv = modelViewMatrix * vec4(p, 1.); float d = -mv.z;
        float sz = (.035 + .05 * aS) * uPx / max(d, .5);
        gl_PointSize = clamp(sz, 1.5, 9.);
        vA = smoothstep(1.2, 3.5, d) * (1. - smoothstep(11., 18., d)) * uAmt * min(1., sz / 1.5) * (.4 + .6 * fract(aS * 7.3)); vS = aS;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uSunC, uDustLit; varying float vA, vS;
      void main(){ vec2 q = gl_PointCoord * 2. - 1.; float a = (1. - smoothstep(.2, 1., dot(q, q))) * vA; gl_FragColor = vec4(uDustLit * (.5 + .35 * uSunC) * (.7 + .5 * vS) * a, a * .8); }`}),B=new t.Points(P,r);B.frustumCulled=!1,B.renderOrder=5;const te=new t.SphereGeometry(60,24,12),w={uDomeC:{value:Te(h.gully)},uDomeA:{value:.2},uDomeH:{value:0},uDomeW:{value:.22},uCore:{value:new t.Vector4(1,0,0,0)},uCoreC:{value:Te(h.gully)},uDomeL:{value:0},uDomeT:v.uTime,uDomeS:v.uSun,uDomeG:{value:Ka(Te(h.gully).lerp(Te("#ffe9b8"),.45).multiplyScalar(1.12),.9)},uDomeU:{value:Te(h.gully).multiply(new t.Color(.5,.42,.36))}},M=new t.ShaderMaterial({uniforms:w,side:t.BackSide,depthTest:!1,depthWrite:!1,blending:t.CustomBlending,blendSrc:t.SrcAlphaFactor,blendDst:t.OneMinusSrcAlphaFactor,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`uniform vec3 uDomeC, uCoreC, uDomeS, uDomeG, uDomeU; uniform vec4 uCore; uniform float uDomeA, uDomeH, uDomeW, uDomeL, uDomeT; varying vec3 vD;
      ${lt}
      void main(){ vec3 d = normalize(vD); float e = d.y, k = max(dot(d, uCore.xyz), 0.), core = k * k * k * .5 * uCore.w;
        // in the gully (uDomeL) the dust hangs in sheets that drift on the wind: read on a level plane overhead. Over the rim the sun
        // comes across they are gold, under the shaded wall umber, and straight up between them the sky shows through
        vec2 q = d.xz / max(e + .2, .14);
        float lay = vn2(q * vec2(1.1, 1.7) + uDomeT * vec2(.045, .02)) * .6 + vn2(q * 3.3 - uDomeT * vec2(.03, .07) + 5.) * .4;
        vec2 az = d.xz / max(length(d.xz), 1e-3), sz = uDomeS.xz / max(length(uDomeS.xz), 1e-3);
        float sunSide = smoothstep(-.5, .7, dot(az, sz)), high = smoothstep(.03, .3, e);
        vec3 c = mix(uDomeC, mix(uDomeU, uDomeG, sunSide), uDomeL * high * (.2 + .7 * smoothstep(.28, .7, lay)) * (1. - .6 * smoothstep(.6, .95, e)));
        c = mix(c, uCoreC, clamp(core, 0., 1.));
        float open = uDomeL * smoothstep(.13, .42, e) * (.3 + .6 * (1. - smoothstep(.3, .66, lay)));
        gl_FragColor = vec4(c, clamp(uDomeA * mix(1., uDomeH * (1. - open), smoothstep(-.02, uDomeW, e)) + core * .5, 0., 1.)); }`}),O=new t.Mesh(te,M);O.frustumCulled=!1,O.renderOrder=-.5;const d=5,F=new t.InstancedBufferGeometry,l=new t.PlaneGeometry(2,2),S=new Float32Array(d);for(let p=0;p<d;p++)S[p]=p;F.index=l.index,F.setAttribute("position",l.attributes.position),F.setAttribute("iG",new t.InstancedBufferAttribute(S,1)),F.instanceCount=d;const _={uGlowP:{value:new t.Vector3},uGlowD:{value:new t.Vector3(1,0,0)},uGlowC:{value:new t.Color(1,.82,.5)},uGlowA:{value:0}},I=new t.ShaderMaterial({uniforms:_,transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendSrc:t.SrcAlphaFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.ZeroFactor,blendDstAlpha:t.OneFactor,vertexShader:`attribute float iG; uniform vec3 uGlowP, uGlowD; uniform float uGlowA; varying vec2 vUv;
      void main(){ vec3 c = uGlowP + uGlowD * iG * 5.;
        vec3 right = normalize(vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]));
        vUv = position.xy; gl_Position = uGlowA > .002 ? projectionMatrix * modelViewMatrix * vec4(c + right * position.x * (14.5 + iG * 1.5) + vec3(0., 1., 0.) * (1.4 + position.y * (5.6 + iG * .6)), 1.) : vec4(2., 2., 2., 1.); }`,fragmentShader:`uniform vec3 uGlowC; uniform float uGlowA; varying vec2 vUv;
      void main(){ vec2 q = abs(vUv); float a = (1. - smoothstep(.1, 1., q.x)) * (1. - smoothstep(.05, 1., q.y)); gl_FragColor = vec4(uGlowC, clamp(a * a * uGlowA, 0., 1.)); }`}),s=new t.Mesh(F,I);return s.frustumCulled=!1,s.renderOrder=2.2,{points:B,dome:O,glow:s,AU:c,DU:w,GU:_}}function Xo(a,e,h){const i=a.rng.fork("cumulus"),v=e.uniforms,m=v.uSun.value,o=Math.atan2(m.z,m.x),L=[];for(let M=.62+i.range(0,.04),O=0;M<1.86;M+=i.range(.13,.19),O++){const d=O%3!==1,F=d?i.range(1e3,1350):i.range(620,800),l=d?i.range(640,900):i.range(360,480),S=Math.round(i()*512)/512;Math.abs(M-o)<.14||L.push([M,i.range(150,215),F,l,S,Math.sin(o-M),i.range(.9,1.08),d?1:0])}const P=L.length,c=new Float32Array(P*4),r=new Float32Array(P*4);L.forEach((M,O)=>{c.set(M.slice(0,4),O*4),r.set(M.slice(4,8),O*4)});const B=new t.InstancedBufferGeometry;B.setIndex([0,1,2,0,2,3]),B.setAttribute("position",new t.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),B.setAttribute("iC",new t.InstancedBufferAttribute(c,4)),B.setAttribute("iK",new t.InstancedBufferAttribute(r,4)),B.instanceCount=P;const te=new t.ShaderMaterial({uniforms:{uCamL:v.uCamL,uLit:{value:Ka(h.clouds>.7?Te(h.cloudLit).lerp(Te(h.sunC),.5).multiplyScalar(.9):Te(h.cloudLit).multiplyScalar(1.12),.8)},uShd:{value:Te(h.cloudShade).lerp(Te(h.mid),.25)},uHzn:{value:Te(h.horizon)}},depthTest:!1,depthWrite:!1,side:t.DoubleSide,blending:t.CustomBlending,blendSrc:t.SrcAlphaFactor,blendDst:t.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec4 iC, iK; uniform vec3 uCamL; varying vec2 vUv; varying vec4 vI;
      void main(){
        float az = iC.x; vec3 c = vec3(uCamL.x + cos(az) * 2700., iC.y, uCamL.z + sin(az) * 2700.);
        vec3 wp = c + vec3(-sin(az), 0., cos(az)) * (position.x * iC.z * .5) + vec3(0., position.y * iC.w, 0.);
        vUv = position.xy; vI = iK;
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`,fragmentShader:`
      uniform vec3 uLit, uShd, uHzn; varying vec2 vUv; varying vec4 vI;
      ${lt}
      void main(){
        vec2 p = vUv; float sd = floor(vI.x * 512. + .5) / 512.;
        vec2 q = p + (vec2(vn2(p * 2.6 + sd * 9.), vn2(p * 2.6 + sd * 9. + 17.)) - .5) * .13 + (vec2(vn2(p * 6.5 + sd * 3.), vn2(p * 6.5 + sd * 3. + 31.)) - .5) * .05;
        // a heap of rounds: a broad low mass, and domes piled on it that narrow to one or two heads; each round has a lit and a shaded side
        float d = 1. - length((q - vec2(0., .2)) / vec2(.82, .2)); vec2 cb = vec2(0., .2), rv = vec2(.82, .3);
        for (int i = 0; i < 8; i++) {
          float fi = float(i), h1 = h11(sd * 17.3 + fi * 3.1), h2 = h11(sd * 5.7 + fi * 7.7), h3 = h11(sd * 11.1 + fi * 1.9), t = fi / 7.;
          vec2 c = vec2((h1 - .5) * 1.3 * (1. - .62 * t), .2 + .54 * t * (.8 + .2 * h2)); float r = mix(.3, .19, t) * (.8 + .45 * h3);
          float di = 1. - length((q - c) / vec2(r * 1.05, r));
          if (di > d) { d = di; cb = c; rv = vec2(r * 1.05, r); }
        }
        float foot = smoothstep(.07, .11, p.y + (vn2(vec2(p.x * 2.1, sd * 7.)) - .5) * .025);
        float al = smoothstep(0., .1, d) * foot * (1. - smoothstep(.9, 1., abs(p.x)));
        if (al < .01) discard;
        vec2 nd = (q - cb) / rv, L2 = normalize(vec2(vI.y * 1.1, .62));
        float bil = vn2(q * 5.5 + sd * 13.) * .6 + vn2(q * 11. - sd * 7.) * .4;
        float lit = clamp(dot(nd, L2) * .55 + .45 + (bil - .5) * .3, 0., 1.);
        lit *= mix(.35, 1., smoothstep(.08, .4, p.y));                                   // the flat base in its own shade
        vec3 col = mix(uShd * (.84 + .26 * bil), uLit, smoothstep(.3, .72, lit)) * vI.z;
        col += uLit * .14 * (1. - smoothstep(0., .25, d)) * smoothstep(.45, .8, lit);     // the lit edge burns a little
        col = mix(uHzn * .95, col, .35 + .65 * smoothstep(.04, .34, p.y));               // its foot stands in the haze
        gl_FragColor = vec4(col, al * .97);
      }`}),w=new t.Mesh(B,te);return w.frustumCulled=!1,w.renderOrder=-.9,w}function Jo(a,e){const h=a.rng.fork("cloud-shadows"),i=1/e,v=h()*6.283,m=8*i;return{z:i,ox:h(),oz:h(),dx:Math.cos(v)*m,dz:Math.sin(v)*m}}const Yo=`
// one hoof print per 0.34 m cell: a cloven dimple with a pushed-up rim; returns height in metres (about -0.02 .. +0.008)
float pock(vec2 p){
  vec2 c = floor(p / .29), q = p / .29 - c - .5; float h = h21(c + 3.7);
  q -= (vec2(h21(c + 11.3), h21(c - 5.1)) - .5) * .5;
  q.x *= 1.25; q *= .8 + .9 * h21(c + 17.1); float r = length(q), on = step(.3 + .55 * smoothstep(.3, .7, vn2(c * .16 + 2.)), h);
  float split = smoothstep(.0, .05, abs(q.x)) * .6 + .4;
  return on * (-.016 * (1. - smoothstep(.06, .27, r)) * split + .0035 * exp(-((r - .3) / .08) * ((r - .3) / .08)) * smoothstep(-.3, .3, q.y));
}
float groundH(vec2 p, vec2 t, float tr, float fine){
  vec2 a = vec2(dot(p, t), dot(p, vec2(-t.y, t.x)));                 // along / across the run
  float h = .01 * (vn2(p * .9) - .5) + .009 * (vn2(a * vec2(.6, 3.2)) - .5) * tr;      // ruts worn along the run
  h += (pock(p) + .6 * pock(p * 1.7 + 4.4)) * tr * fine;
  h += .006 * vn2(p * 14.) * fine + .004 * (1. - abs(2. * vn2(p * 5.3) - 1.)) * fine;
  h += gChurn * (.035 * (vn2(p * 2.7 + 9.) - .5) + .022 * (1. - abs(2. * vn2(p * 6.1) - 1.)) * fine + (pock(p * 1.3 + 7.7) + pock(p * 2.3 + 1.1)) * .8 * fine);     // between the walls the floor is churned to clods
  return h;
}
// crushed straw lying on the earth: one stalk per cell, two layers
float straw(vec2 p, float sc){
  vec2 c = floor(p * sc), q = fract(p * sc) - .5; float h = h21(c + 1.9), an = h * 6.283, on = step(.45, h21(c - 7.7));
  vec2 d = vec2(cos(an), sin(an)); q -= (vec2(h21(c + 2.2), h21(c + 8.8)) - .5) * .4;
  float al = dot(q, d), ac = dot(q, vec2(-d.y, d.x));
  return on * (1. - smoothstep(.012, .03, abs(ac))) * (1. - smoothstep(.2, .34, abs(al)));
}
// fallen fig leaves: x = mask, y = a hash for its colour
vec2 leafv(vec2 p, float sc){
  vec2 c = floor(p * sc), q = fract(p * sc) - .5; float h = h21(c + 4.3), an = h * 6.283, on = step(.3, h21(c - 2.9));
  vec2 d = vec2(cos(an), sin(an)); q -= (vec2(h21(c + 6.1), h21(c + 9.4)) - .5) * .45;
  float al = dot(q, d), ac = dot(q, vec2(-d.y, d.x));
  return vec2(on * (1. - smoothstep(.75, 1., length(vec2(al / .3, ac / .15)))) * (1. - .5 * smoothstep(.0, .02, abs(ac)) * 0.), h);
}
`;async function en(a,e,h,i,v,m,o){const L=a.rng.fork("ground"),P=i.uniforms,c=a.quality?.detail??1,r=new t.Group,B=new t.Vector3,te=new t.Vector3,w=e.L,M=g=>{g<=w?(e.posAt(Math.max(0,g),B),e.tanAt(Math.max(0,g),te),g<0&&(B.x+=te.x*g,B.z+=te.z*g)):(e.posAt(w,B),e.tanAt(w,te),B.x+=te.x*(g-w),B.z+=te.z*(g-w));const W=1/Math.max(1e-4,Math.hypot(te.x,te.z));te.x*=W,te.z*=W},O=[-1,-.8,-.62,-.46,-.32,-.19,-.07,.07,.19,.32,.46,.62,.8,1],d=O.length,F=[],l=[],S=[],_=[],I=[];let s=0;const p=async(g,W,se)=>{const ye=s;for(let Y=g;Y<=W+.001;Y+=Y<-12?2*se:se){(s&15)===0&&await a.yield(),M(Y);const R=B.x,V=B.z,j=te.x,Q=te.z,X=h.sample(R,V),C=Math.min(11.5,Math.max(2.5,X.hw-.7))*(Y>w-14?pe(1,.62,u(w-14,w-4,Y)):1),ee=u(g,g+3,Y)*(1-u(W-3,W,Y));let y=1,J=1,oe=0;const K=X.hw;if(K<30){const E=P.uSun.value.x,he=P.uSun.value.z,me=E*-Q+he*j,ze=K+6.5,le=Math.max(0,h.sample(R-Q*(me>0?1:-1)*ze,V+j*(me>0?1:-1)*ze).h-(e.pathY(Y)-1.5));J=me>0?1:-1,y=1-.85*u(.6,2.4,le),oe=le*Math.abs(me)/Math.max(.05,P.uSun.value.y)}for(let E=0;E<d;E++){const he=O[E]*C,me=R-Q*he,ze=V+j*he,le=m(me,ze),ce=h.sample(me,ze);F.push(me,le+.03,ze),_.push(he,Y),S.push(j,Q,Y<e.sLip?1-.35*u(e.sGully-10,e.sGully+30,Y):.5*(1-u(w-6,w+20,Y)),X.hw<30?1:0);const de=Y>e.sLand?.92*(1-u(e.sExit+12,e.sExit+52,Y))*(1-.7*O[E]*O[E]):0;l.push(Math.abs(O[E])>.99?0:ee,Ze(.35+.65*ce.tr,0,1),Math.max(ce.kind===2?1-u(v+.5,v+2.6,le):0,de),pe(y,1,u(oe-1.5,oe+.5,K-J*he)))}s++}for(let Y=ye;Y<s-1;Y++)for(let R=0;R<d-1;R++){const V=Y*d+R,j=V+d;I.push(V,j,V+1,V+1,j,j+1)}};await p(-150,e.sLip-.8,1.3),await p(e.sWade-4,w+26,1.3),await a.yield();const D=new t.BufferGeometry;D.setAttribute("position",new t.Float32BufferAttribute(F,3)),D.setAttribute("aD",new t.Float32BufferAttribute(l,4)),D.setAttribute("aT",new t.Float32BufferAttribute(S,4)),D.setAttribute("aL",new t.Float32BufferAttribute(_,2)),D.setIndex(I);const U=h.figs,z={uFigs:{value:new t.Vector4(U[0][0],U[0][1],U[1][0],U[1][1])},uEarthA:{value:new t.Color(.4,.275,.165)},uEarthB:{value:new t.Color(.53,.4,.25)},uStraw:{value:new t.Color(.62,.5,.27)},uMud:{value:new t.Color(.23,.165,.105)},uGreen:{value:o.grass}},b=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...P,...z},fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 aD, aT; attribute vec2 aL; varying vec3 vW; varying vec4 vD, vT; varying vec2 vL;
      void main(){ vW = position; vD = aD; vT = aT; vL = aL; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC, uCamL, uEarthA, uEarthB, uStraw, uMud, uSkyRef, uDustLit, uDustShade; uniform float uGreen, uShade, uTime; uniform vec4 uFigs;
      varying vec3 vW; varying vec4 vD, vT; varying vec2 vL;
      ${lt}
      ${va}
      float gChurn = 0.;
      ${Yo}
      // the trails on the run in (the world's trailAt): our own and six beside it, each one animal broad, weaving
      float braid(vec2 l, vec4 c){ return .9 * (1. - smoothstep(.22, .6, abs(l.x - c.x - c.y * sin(l.y * c.z + c.w)))); }
      float trails(vec2 l){
        float w = 1. - smoothstep(.3, .8, abs(l.x));
${Ha.map(g=>`        w = max(w, braid(l, vec4(${g.map(W=>W.toFixed(3)).join(", ")})));`).join(`
`)}
        return w * (1. - smoothstep(36., 96., l.y));
      }
      void main(){
        vec2 p = vW.xz, tg = normalize(vT.xy + vec2(1e-5, 0.)); vec3 Vv = uCamL - vW; float dist = length(Vv), tr = max(vD.y, .35 + .65 * trails(vL)), wet = vD.z;
        float fine = 1. - smoothstep(14., 34., dist), e = .02 + dist * .004; gChurn = max(max(vT.w, .45 * tr), wet * .9);                // (and the bar is trodden to a slop)
        float h0 = groundH(p, tg, tr, fine), hx = groundH(p + vec2(e, 0.), tg, tr, fine), hz = groundH(p + vec2(0., e), tg, tr, fine);
        vec3 N = normalize(vec3(-(hx - h0) / e * .85, 1., -(hz - h0) / e * .85));
        float n1 = vn2(p * .23 + 7.), n2 = vn2(p * 2.1), n3 = vn2(p * 9.);
        vec3 alb = mix(uEarthA, uEarthB, smoothstep(.2, .8, n1 * .6 + n2 * .4)) * (.82 + .3 * n3);
        float pk = (pock(p) + .6 * pock(p * 1.7 + 4.4)) * tr * fine;
        alb *= (1. + 5. * clamp(h0, -.03, .02)) * (1. - .3 * smoothstep(-.002, -.014, pk)) * (1. + .12 * smoothstep(.001, .004, pk));       // prints: dark in the bottom, pale on the pushed-up rim
        float st = max(straw(p, 2.6), straw(p + 3.3, 4.3) * .8) * fine;                         // crushed straw and stubble marks
        float litter = smoothstep(.42, .66, vn2(p * .8 + 3.) * .6 + vn2(p * 3.7) * .4) * (1.45 - .75 * tr);
        alb = mix(alb, uStraw * (.7 + .5 * n3) * mix(vec3(1.), vec3(.6, 1.1, .5), uGreen * .5), clamp(st * (.35 + .65 * litter) + litter * .35 * (.4 + .6 * vn2(p * vec2(31., 27.))), 0., 1.));
        float grit = smoothstep(.8, .93, vn2(p * 23.) * .6 + vn2(p * 47.) * .4) * fine; alb = mix(alb, vec3(.5, .46, .4), grit * .7);
        float figD = min(distance(p, uFigs.xy), distance(p, uFigs.zw)), lfK = (1. - smoothstep(7., 19., figD)) * fine;
        if (lfK > 0.) { vec2 l1 = leafv(p, 3.4), l2 = leafv(p + 5.7, 5.2); float lm = max(l1.x, l2.x * .9), lh = l1.x > l2.x * .9 ? l1.y : l2.y;
          alb = mix(alb, mix(vec3(.2, .11, .04), mix(vec3(.4, .36, .09), vec3(.16, .26, .07), smoothstep(.5, .8, lh)), smoothstep(.15, .5, lh)) * (.7 + .5 * n3), lm * lfK * (.4 + .6 * smoothstep(.35, .6, vn2(p * .7 + 9.)))); }
        float sward = (1. - smoothstep(.42, .8, tr)) * (.55 + .45 * smoothstep(.3, .6, vn2(p * 1.3 + 5.)));                                    // off the beaten way: a mat of dry grass
        alb = mix(alb, uStraw * mix(vec3(1.), vec3(.6, 1.1, .5), uGreen * .5) * (.45 + .5 * vn2(p * vec2(37., 31.)) + .3 * n3) * (.7 + .5 * n2), sward * .85);
        float dungK = smoothstep(.7, .8, vn2(p * 1.7 + 11.)) * smoothstep(.25, .6, vn2(p * 8.3)) * vT.w;                         // dung trodden into the floor
        alb = mix(alb, vec3(.12, .1, .055) * (.7 + .6 * n3), dungK * .8);
        alb *= 1. - gChurn * (.3 * smoothstep(.35, .7, vn2(p * 4.4 + 2.)) + .22 * smoothstep(.4, .65, vn2(p * .9 + 17.)));                                              // damp, darker where it was turned over
        alb = mix(alb, uMud * (.62 + .42 * n2), wet * .9);
        // the bar: water stands in every hollow of the churned mud, and each one holds the sky
        float pud = smoothstep(.45, .8, wet) * smoothstep(.6, .65, vn2(p * 1.05 + 13.) * .6 + vn2(p * 3.1 + 4.) * .4 - 2.5 * clamp(h0, -.02, .02));
        N = normalize(mix(N, vec3(0., 1., 0.), pud * .93)); alb *= 1. - .5 * pud;
        vec3 V = Vv / max(dist, 1e-3);
        float ndl = max(dot(N, uSun), 0.);
        float cs = cloudSun(p), sunW = vD.w * cs;
        vec3 col = alb * (uSunC * ndl * 1.15 * sunW + (mix(uGndC, uSkyC, mix(.5, .85, vD.w)) + uDustLit * .75 * (1. - vD.w)) * (.88 + 5. * clamp(h0 + pk, -.03, .01)));
        vec3 Hh = normalize(uSun + V); float fr = 1. - max(dot(N, V), 0.); fr *= fr; fr *= fr;
        col += (uSunC * pow(max(dot(N, Hh), 0.), 60.) * .8 + uSkyRef * fr * .5) * wet * (.4 + .6 * n2);     // wet mud shines
        vec3 pc = mix(uSkyRef, vec3(dot(uSkyRef, vec3(.3, .5, .2))) * vec3(1.22, 1., .74), .92) * 1.12;                 // the low sky: pale and warm, a little blue in it
        col = mix(col, pc * (.55 + .75 * fr) + uSunC * pow(max(dot(N, Hh), 0.), 260.) * 2., pud * (.5 + .5 * fr));
        // the dust the column keeps knee-deep over the beaten way: the further the ground, the more of the layer lies between it and us; it drifts in bands
        float dn = vn2(p * .05 + vec2(uTime * .11, uTime * .05)) * .65 + vn2(p * .19 - vec2(uTime * .23, 0.)) * .35;
        float lay = (1. - exp(-max(dist - 1.5, 0.) * .12 * (.04 + 2.6 * dn * dn * dn + vT.w * (.3 + .9 * dn)))) * max(vT.z, vT.w) * (.35 + .65 * tr) * (1. - wet) * (1. - .5 * uShade);
        float toSun = max(dot(-V, normalize(vec3(uSun.x, 0., uSun.z) + 1e-4)), 0.);
        vec3 dc = mix(uDustShade * (1.3 + uSkyC * .8), uDustLit * (.6 + .26 * uSunC), (.4 + .45 * toSun * toSun) * (.3 + .7 * cs));
        col = mix(col, dc * (1. - .35 * uShade), lay * .86);
        gl_FragColor = vec4(col, vD.x);
        #include <fog_fragment>
      }`}),x=new t.Mesh(D,b);return x.frustumCulled=!1,x.renderOrder=.4,r.add(x),{group:r,ribbon:x,at:M,v:B,t:te,triangles:I.length/3}}async function tn(a,e,h,i,v,m,o,L,P){const c=a.rng.fork("stubble"),r=i.uniforms,B=a.quality?.detail??1,te=new t.Group,w=e.L,M=[],O=[],d=[];for(let j=0;j<2;j++){const Q=j/2*Math.PI+.3,X=Math.cos(Q),C=Math.sin(Q),ee=M.length/3;M.push(-X*.5,0,-C*.5,X*.5,0,C*.5,X*.5,1,C*.5,-X*.5,1,-C*.5),O.push(j*.37,0,j*.37+1,0,j*.37+1,1,j*.37,1),d.push(ee,ee+1,ee+2,ee,ee+2,ee+3)}const F=[],l=[],S=Math.round(4200*B),_=e.sLip-2+140,I=w+22-(e.sBar-6);for(let j=0;F.length/4<S&&j<S*6;j++){(j&127)===0&&await a.yield();const Q=c()<_/(_+I)?c.range(-140,_-140):c.range(e.sBar-6,w+22),X=c.chance(.5)?1:-1,C=c(),ee=X*(.8+(Q<4?14:9.5)*Math.pow(C,1.45));o.at(Q);const y=o.v.x-o.t.z*ee,J=o.v.z+o.t.x*ee,oe=h.sample(y,J);if(oe.kind===1||Math.abs(ee)>oe.hw-.25||Q>w-12&&Math.abs(ee)>6.5||ka(Q,ee)>.4)continue;const K=m(y,J);if(K<v+.35)continue;const E=u(1.3,9,Math.abs(ee)),he=c.chance(.3)?1:0;F.push(y,K-.02,J,pe(.24,.52,E)*c.range(.7,1.4)),l.push(c()*6.283,c(),c(),he)}for(const j of P)F.push(j[0],j[1],j[2],j[3]),l.push(j[4],c(),c(),2);await a.yield();const s=new t.InstancedBufferGeometry;s.setIndex(d),s.setAttribute("position",new t.Float32BufferAttribute(M,3)),s.setAttribute("uv",new t.Float32BufferAttribute(O,2)),s.setAttribute("gA",new t.InstancedBufferAttribute(new Float32Array(F),4)),s.setAttribute("gB",new t.InstancedBufferAttribute(new Float32Array(l),4)),s.instanceCount=F.length/4;const p=L.grass,D=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...r,uRoot:{value:new t.Color(.1,.068,.038).lerp(new t.Color(.08,.11,.04),p*.6)},uTip:{value:new t.Color(.4,.29,.12).lerp(new t.Color(.3,.36,.13),p*.6)}},fog:!0,side:t.DoubleSide,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 gA, gB; uniform float uTime; uniform vec3 uWind;
      varying vec2 vUv; varying vec3 vK; varying float vCs;
      ${va}
      void main(){
        float brk = step(.5, gB.w) * step(gB.w, 1.5), frg = step(1.5, gB.w);
        float c = cos(gB.x), s = sin(gB.x); vec3 p = position; p.xz *= 2.1 * mix(1., 1.3, brk); p.y *= mix(mix(1., .5, brk), .58, frg);            // broken stalks lie low and splayed; the fringe on a lip is short
        p *= gA.w; p.xz = vec2(p.x * c - p.z * s, p.z * c + p.x * s);
        float gust = .5 + .5 * sin(uTime * 1.7 + gA.x * .21 + gA.z * .13 + gB.y * 3.) + .3 * sin(uTime * 5.3 + gB.y * 40.);
        p.xz += uWind.xz * uv.y * uv.y * (.04 + .07 * gust) * gA.w;
        p.xz += vec2(c, s) * uv.y * uv.y * (.4 + .12 * gust) * gA.w * frg; p.y -= uv.y * uv.y * .12 * gA.w * frg;                             // and leans out over the edge
        vUv = uv; vK = vec3(gB.y, gB.z, frg); vCs = cloudSun(gA.xz);
        vec4 mvPosition = modelViewMatrix * vec4(p + gA.xyz, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSunC, uSkyC, uGndC, uRoot, uTip, uDustLit; uniform float uShade; varying vec2 vUv; varying vec3 vK; varying float vCs;
      ${lt}
      // one row of fine blades: x = mask, y = that blade's hash, z = height along the blade
      vec3 row(vec2 uv, float n, float sd){
        float fx = uv.x * n + sd * 13.7, c = floor(fx), f = fract(fx) - .5, h = h11(c + sd * 91.);
        float hgt = .34 + .66 * h, lean = (h11(c * 1.7 + 3. + sd * 7.) - .5) * 1.5, v = uv.y / hgt;
        float x = f - lean * v * v * .5, w = (.2 + .13 * h) * pow(max(1. - v, 0.), .6) + .11 * smoothstep(.72, .86, v) * (1. - smoothstep(.9, 1., v)) * step(.45, h);   // a seed head near the tip of the taller ones
        return vec3(step(abs(x), w) * step(v, 1.), h, v);
      }
      void main(){
        vec3 a = row(vUv, mix(15., 23., vK.z), vK.x), b = row(vUv + vec2(.31, 0.), mix(10., 16., vK.z), vK.y + .5);
        float m = max(a.x, b.x); if (m < .5) discard;
        float h = a.x > .5 ? a.y : b.y, vb = a.x > .5 ? a.z : b.z, v = vUv.y, head = smoothstep(.7, .84, vb) * step(.45, h);
        vec3 alb = mix(uRoot, uTip * (.7 + .5 * h), smoothstep(0., .8, vb));
        alb = mix(alb, uTip * vec3(1.5, 1.3, .95), head * .75);
        float sh = uShade * (1. - vK.z);                                    // the fringe on the lips stands in the sun above the gully's shade
        vec3 col = alb * (uSunC * (.12 + .44 * vb + .3 * head) * (.6 + .4 * h) * (1. - .8 * sh) * vCs + mix(uGndC, uSkyC, .3 + .6 * v) * (.45 + .55 * vb) + uDustLit * .2 * sh);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),U=new t.Mesh(s,D);U.frustumCulled=!1,te.add(U);const z=new t.IcosahedronGeometry(1,0),b=z.attributes.position,x=z.attributes.normal,g=new Map;for(let j=0;j<b.count;j++){const Q=b.getX(j).toFixed(3)+","+b.getY(j).toFixed(3)+","+b.getZ(j).toFixed(3);g.has(Q)||g.set(Q,[c.range(.8,1.2),c.range(.8,1.1),c.range(.8,1.2)]);const X=g.get(Q),C=b.getX(j),ee=b.getY(j),y=b.getZ(j),J=1/Math.hypot(C,ee,y);x.setXYZ(j,C*J,ee*J,y*J),b.setXYZ(j,C*X[0],ee*.7*X[1],y*X[2])}z.setAttribute("color",new t.BufferAttribute(new Float32Array(b.count*3).fill(1),3));const W=Math.round(200*B),se=Math.round(420*B),ye=new t.InstancedMesh(z,jt(i,{},{alb:1}),se),Y=new t.Object3D,R=new t.Color;let V=0;for(let j=0;V<se&&j<se*12;j++){(j&127)===0&&await a.yield();const Q=V>=W,X=Q?c.chance(.72)?c.range(e.sGully-8,e.sLip-2):c.range(e.sBar-2,w-8):c.chance(.62)?c.range(2,e.sLip-1):c.range(e.sBar-8,w+20),C=c.chance(.5)?1:-1;o.at(X);const ee=h.sample(o.v.x,o.v.z),y=ee.hw<30&&c.chance(Q?.7:.6),J=Q&&y?Math.pow(c(),1.7):0,oe=C*(Q?y?ee.hw+.1-J*1.1:c.range(.4,Math.max(.5,ee.hw-1.2)):y?ee.hw-c.range(.1,1.3):1.3+9*Math.pow(c(),1.6)),K=o.v.x-o.t.z*oe,E=o.v.z+o.t.x*oe,he=h.sample(K,E),me=m(K,E);if(he.kind===1||Math.abs(oe)>he.hw+.2||me<v+.2||Q&&ee.hw>30)continue;const ze=Q&&!y,le=Q?y?pe(.24,.09,J)*c.range(.7,1.15):c.range(.05,.1):y?c.range(.07,.19):c.range(.035,.085);Y.position.set(K,me-le*(ze?.1:.22),E),Y.rotation.set(c.range(-.3,.3),c()*6.283,c.range(-.3,.3)),Y.scale.set(le*c.range(.9,1.5),le*(ze?.55:1),le*c.range(.9,1.5)),Y.updateMatrix(),ye.setMatrixAt(V,Y.matrix),ze?R.setRGB(.06,.05,.03).multiplyScalar(c.range(.7,1.15)):R.setRGB(.27,.18,.11).multiplyScalar(c.range(.7,1.2)).lerp(new t.Color(.42,.34,.24),c()*.35).multiplyScalar(Q?.3:1),ye.setColorAt(V,R),V++}return ye.count=V,ye.instanceMatrix.needsUpdate=!0,ye.instanceColor&&(ye.instanceColor.needsUpdate=!0),ye.frustumCulled=!1,te.add(ye),{group:te,triangles:4*s.instanceCount+V*20}}async function an(a,e,h,i,v,m,o,L,P){const c=a.rng.fork("oats"),r=i.uniforms,B=a.quality?.detail??1,te=e.L,w=[],M=[],O=Math.round(9100*B),d=e.sLip+150,F=te+30-(e.sBar-10);for(let p=0;w.length/4<O&&p<O*7;p++){(p&127)===0&&await a.yield();const D=c()<d/(d+F)?c.range(-150,d-150):c.range(e.sBar-10,te+30),U=c.chance(.5)?1:-1,z=U*(D>e.sBar-14&&c.chance(.5)?1.4+9*Math.pow(c(),1.3):1.5+44*Math.pow(c(),2.1));o.at(D);const b=o.v.x-o.t.z*z,x=o.v.z+o.t.x*z,g=h.sample(b,x),W=D>e.sBar-14;if(g.kind===1||g.wall||g.hw<30&&(W?g.lat>g.hw+1.2&&g.lat<g.hw+3:g.lat<g.hw+2.2)||g.kind===2&&g.dI<13||D>te-12&&Math.abs(z)<7)continue;const se=u(36,96,g.s),ye=(1-u(2.2,4.4,Math.abs(g.lat-pe(17.5,4.5,u(48,84,g.s)))))*u(6,14,g.s)*(1-u(76,90,g.s)),Y=Math.max(1-u(pe(.3,1.4,se),pe(.9,4.4,se),g.lat),g.trO,ka(g.s,g.side*g.lat)),R=(1-Y)*(.45+.55*u(-.3,.25,a.noise.n2(b*.045,x*.045))),V=1-u(13,19,Math.min(P[0].near(b,x).d,P[1].near(b,x).d));if(c()>R*(1-.45*V))continue;const j=m(b,x);if(j<v+.5)continue;const Q=u(3.5,12,g.lat)*(1-.7*g.trO)*(.3+.7*u(10,50,D))*(W&&g.hw<30&&g.lat<g.hw+1.2?.35:1)*(1-.7*V);w.push(b,j-.03,x,pe(.42,1,Q)*c.range(.75,1.3)*(1-.5*ye)),M.push(c(),c(),c.range(1.5,2.5),c.range(.75,1.15))}for(let p=0;p<Math.round(300*B);p++){const D=c.range(5,72),U=c.chance(.5)?1:-1,z=U*(1.9+6.5*Math.pow(c(),1.4)+1.6*u(40,72,D));o.at(D);const b=o.v.x-o.t.z*z,x=o.v.z+o.t.x*z,g=m(b,x);ka(D,z)>.3||(w.push(b,g-.03,x,pe(.8,1.05,u(1.9,4,Math.abs(z)))*c.range(.8,1.2)*(1-.4*u(50,72,D))),M.push(c(),c(),c.range(1.5,2.5),c.range(.75,1.15)))}{const p=a.rng.fork("clumps");for(let D=0;D<Math.round(760*B);D++){const U=p.range(-6,86),z=(p.chance(.5)?1:-1)*(.55+5.2*Math.pow(p(),1.2));o.at(U);const b=o.v.x-o.t.z*z,x=o.v.z+o.t.x*z;ka(U,z)>.45||(w.push(b,m(b,x)-.02,x,p.range(.16,.34)*pe(.8,1.25,u(1,3.5,Math.abs(z)))),M.push(p(),p(),p.range(.32,.7),p.range(.7,1.05)))}for(let D=0,U=0;U<Math.round(1900*B)&&D<9e3;D++){(D&127)===0&&await a.yield();const z=p.range(e.sGully-50,e.sGully+27),b=(p.chance(.5)?1:-1)*(.4+10.6*Math.pow(p(),1.25));o.at(z);const x=o.v.x-o.t.z*b,g=o.v.z+o.t.x*b,W=h.sample(x,g);W.kind!==0||W.wall||Math.abs(b)>W.hw-.7||(w.push(x,m(x,g)-.02,g,p.chance(.3)?p.range(.38,.56):p.range(.14,.34)),M.push(p(),p(),p.range(.3,.75),p.range(.7,1.05)),U++)}}await a.yield();const l=new t.InstancedBufferGeometry;l.setIndex([0,1,2,0,2,3]),l.setAttribute("position",new t.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),l.setAttribute("uv",new t.Float32BufferAttribute([0,0,1,0,1,1,0,1],2)),l.setAttribute("gA",new t.InstancedBufferAttribute(new Float32Array(w),4)),l.setAttribute("gB",new t.InstancedBufferAttribute(new Float32Array(M),4)),l.instanceCount=w.length/4;const S=L.grass,_=(p,D)=>new t.Color(p[0],p[1],p[2]).lerp(new t.Color(D[0],D[1],D[2]),S*.6),I=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...r,uRoot:{value:_([.13,.09,.045],[.08,.11,.04])},uTip:{value:_([.5,.37,.16],[.34,.4,.15])},uHead:{value:_([.52,.2,.085],[.5,.26,.1])}},fog:!0,side:t.DoubleSide,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 gA, gB; uniform float uTime; uniform vec3 uWind, uCamL, uSun;
      varying vec2 vUv; varying vec4 vK; varying float vCs, vGu;
      ${va}
      void main(){
        vec3 toC = uCamL - gA.xyz; float dist = max(length(toC), .01); vec2 d = toC.xz / max(length(toC.xz), .01);
        float hgt = gA.w * smoothstep(.9, 2.6, dist) * (1. - smoothstep(95., 135., dist));          // none slaps the lens; far off it sinks into the plain's own colour
        vec3 p = gA.xyz + vec3(d.y, 0., -d.x) * position.x * gB.z + vec3(0., position.y * hgt, 0.);
        float gust = .5 + .5 * sin(uTime * 1.3 - dot(gA.xz, uWind.xz) * .2 + sin(dot(gA.xz, vec2(.07, -.05))) * 2.) + .25 * sin(uTime * 4.7 + gB.x * 40.);      // gusts cross the grass in bands thirty metres apart
        p.xz += uWind.xz * uv.y * uv.y * (.1 + .42 * gust * gust) * hgt; p.y -= uv.y * uv.y * .1 * gust * gust * hgt;
        vUv = uv; vK = vec4(gB.x, gB.y, gB.w, max(dot(-toC / dist, uSun), 0.)); vCs = cloudSun(gA.xz); vGu = gust * gust * sign(dot(uWind.xz, vec2(d.y, -d.x)) + 1e-4);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        gl_Position = hgt > .02 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSunC, uSkyC, uGndC, uRoot, uTip, uHead; varying vec2 vUv; varying vec4 vK; varying float vCs, vGu;
      ${lt}
      // one rank of stems: x = mask, y = that stem's hash, z = height along the stem, w = seed head
      vec4 rank(vec2 uv, float n, float sd, float aa, float top){
        float fx = uv.x * n + sd * 13.7, c = floor(fx), f = fract(fx) - .5, h = h11(c + sd * 91.);
        float hgt = (.4 + .6 * h) * top, lean = (h11(c * 1.7 + 3. + sd * 7.) - .5) * 3.4, v = uv.y / max(hgt, .05), oat = step(.3, h);
        float x = f - lean * v * v * .5 - lean * oat * smoothstep(.6, 1., v) * .4;                                     // each blade arches its own way, and the head hangs over
        float hd = oat * smoothstep(.62, .72, v) * (1. - smoothstep(.93, 1., v));
        float w = (.06 + .04 * h) * pow(max(1. - v, 0.), .55) + aa + hd * (.05 + .13 * abs(sin(v * 47. + h * 30.)));      // spikelets down the head
        return vec4(step(abs(x), w) * step(v, 1.), h, v, hd);
      }
      void main(){
        float aa = min(fwidth(vUv.x) * 9., .16);
        float bnd = ((vK.y - .5) * .34 + clamp(vGu, -1.3, 1.3) * .17) * vUv.y * vUv.y;      // the tuft arches as one, its own way and over with the gust; each rank a little differently
        vec2 u1 = vUv + vec2(bnd, 0.), u2 = vUv + vec2(.31 + bnd * .45, 0.), u3 = vUv + vec2(.67 + bnd * 1.5, 0.);
        float edge = 1. - smoothstep(.36, .5, abs(u1.x - .5));                       // the card's ends are short: a tuft, not a hedge
        vec4 a = rank(u1, 26., vK.x, aa, .55 + .45 * edge), b = rank(u2, 19., vK.y + .5, aa, (.5 + .5 * edge) * .86), c = rank(u3, 35., vK.x + vK.y, aa, .5);
        float m = max(a.x, max(b.x, c.x)); if (m < .5) discard;
        vec4 k = a.x > .5 ? a : b.x > .5 ? b : c;
        float h = k.y, vb = k.z, head = k.w;
        vec3 alb = mix(uRoot, uTip * (.62 + .5 * h) * mix(vec3(1.), vec3(.8, .95, .62), step(.72, fract(vK.x * 5.3 + h * .3))), smoothstep(0., .75, vb)) * vK.z;       // some tufts still olive at the root
        alb = mix(alb, uHead * (.8 + .5 * h), head * .9);
        float glow = vK.w * vK.w * (.25 + .75 * vb);                                 // seen against the sun the stems are lit through
        vec3 col = alb * (uSunC * (.14 + .46 * vb + .3 * head) * (.6 + .4 * h) * (1. + 2.2 * glow) * vCs + mix(uGndC, uSkyC, .3 + .6 * vUv.y) * (.42 + .58 * vb));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),s=new t.Mesh(l,I);return s.frustumCulled=!1,{mesh:s,triangles:2*l.instanceCount}}async function on(a,e,h,i,v,m,o){const L=a.rng.fork("walls"),P=a.noise,c=i.uniforms,r=e.L,B=new t.Group,te=a.quality?.detail??1,w=c.uSun.value,M=Math.max(.001,Math.hypot(w.x,w.z)),O=w.y/M,d=(Q,X,C)=>new t.Color(Q,X,C),F=d(.36,.2,.105),l=d(.3,.115,.06),S=d(.55,.43,.27),_=d(.05,.035,.025),I=d(.3,.24,.13),s=new t.Color,p=Q=>u(-.15,.35,P.n2(7.7,Q*.5)),D=(Q,X,C)=>{const ee=Math.exp(-(((X-1.25)/.45)**2));return(.5*Ze(.6*P.ridged2(Q*.12+C*17,X*.03+3.1,2)+.5*p(X),0,1)*(1-.75*ee)+.1*ee)*u(.1,1,X)},U=[-.3,0,.07,.15,.25,.37,.5,.63,.76,.87,.95,1],z=U.length+2,b=[],x=[],g=[],W=[],se=[];let ye=0;const Y=async(Q,X,C)=>{const ee=[];for(let y=Q;y<=X;y+=1.25){(ee.length&15)===0&&await a.yield(),m.at(y);const J=m.v.x,oe=m.v.z,K=m.t.x,E=m.t.z,he=e.pathY(y)-1.5,me={s:y,cx:J,cz:oe,tx:K,tz:E,floor:he,side:[]};for(const ze of[-1,1]){const le=h.sample(J-E*ze*4,oe+K*ze*4),ce=le.hw;let de=0,re=0;if(ce<30){const H=ce+2.4+3.8,ue=h.sample(J-E*ze*H,oe+K*ze*H).h;de=Math.max(0,ue-he)*u(Q,Q+4,y)*(1-u(X-4,X,y)),re=2.4+Math.max(0,de-1.3)/2.7+.3}me.side.push({sd:ze,hw:Math.min(ce,30),H:de,eT:re})}ee.push(me)}if(C){const y=a.core.makeRng(a.core.hashSeed("gully-reach:"+a.seed)),J=[0,1,2,3];for(let E=3;E>0;E--){const he=Math.floor(y()*(E+1)),me=J[E];J[E]=J[he],J[he]=me}const oe=ee[ee.length>>1],K=w.x*-oe.tz+w.z*oe.tx>0?1:0;for(let E=Q+y.range(26,34),he=0;E<X-14;E+=y.range(20,30),he++){const me=J[he%4],ze=me===0?K:y.chance(.5)?0:1,le=y.range(3.4,4.8)*(me===2?1.7:1),ce=y();let de=null;for(const re of ee){const H=1-u(le*.4,le,Math.abs(re.s-E)),ue=re.side[ze];H<=0||ue.H<1.7||(me===0?ue.H*=1-.58*H:me===1?ue.slumpK=H:me===2?ue.rootK=H:(!de||Math.abs(re.s-E)<Math.abs(de.s-E))&&(de=re))}de&&(de.side[ze].thorn=ce+.001)}}for(const y of[0,1]){const J=ye;for(let oe=0;oe<ee.length;oe++){(oe&7)===0&&await a.yield();const K=ee[oe],E=K.side[y],he=K.side[1-y],me=E.sd,ze=-K.tz*me,le=K.tx*me,ce=E.H,de=Math.max(.25,Math.abs((w.x*ze+w.z*le)/M)),re=he.H-(E.hw+he.hw)*O/de;E.line=re;for(let H=0;H<z;H++){let ue,ie,Be=0,Ue=1;if(H<U.length){ue=U[H]*ce,ie=-.1+.1*Math.max(0,ue)+D(K.s,K.floor+ue,me)*Math.min(1,ce/1.5);{const ae=Math.max(u(.18,.5,P.n2(K.s*.19+me*31,4.4)),1.7*(E.slumpK||0))*Math.min(1,ce/2),Me=U[H];ie+=ae*(.55*u(.3,.6,Me)*(1-u(.8,.95,Me))-.8*(1-u(.05,.3,Me))*u(-.2,.02,Me))}H===U.length-2&&(ie-=.3*(.4+.6*(.5+.5*P.n2(K.s*.8,me*5.5)))*Math.min(1,ce/2)),H===U.length-1&&(ie+=.05),Ue=.5+.5*u(0,.35,U[H]),H===U.length-3&&(Ue=.6)}else{const ae=H-U.length;ie=E.eT+(ae?1.7:.15),Be=1;const Me=K.cx+ze*(E.hw+ie),Se=K.cz+le*(E.hw+ie);ue=Math.max(ce,h.sample(Me,Se).h-K.floor)+(ae?-.25:.07)}const We=K.cx+ze*(E.hw+ie),Ge=K.cz+le*(E.hw+ie),Fe=K.floor+ue;b.push(We,Fe,Ge);const Ee=Fe+1.1*P.n2(We*.035,Ge*.035),je=P.n2(7.7,Ee*.5);s.copy(F).lerp(l,Ze(.45+.75*je,0,1)),s.lerp(S,.22*Math.max(0,1-Math.abs(Ee-7.4)/.8)),s.lerp(_,.3*Math.max(0,1-Math.abs(Ee-5.1)/.3)),s.multiplyScalar(.85+.3*P.n2(We*.5,Fe*.6+Ge*.5)),Be===0?s.lerp(_,.85*u(ce-.7,ce-.15,ue)):s.copy(I).multiplyScalar(.7+.4*P.n2(We*.4,Ge*.4)),x.push(s.r,s.g,s.b),g.push(Ue,ue,re,Be)}}for(let oe=0;oe<ee.length-1;oe++)for(let K=0;K<z-1;K++){const E=J+oe*z+K,he=E+z;y===0?W.push(E,he,E+1,E+1,he,he+1):W.push(E,E+1,he,E+1,he+1,he)}ye+=ee.length*z}se.push(ee)};await Y(e.sGully-22,e.sLip-.5,!0),await Y(e.sBar-4,r+9,!1),await a.yield();const R=new t.BufferGeometry;R.setAttribute("position",new t.Float32BufferAttribute(b,3)),R.setAttribute("color",new t.Float32BufferAttribute(x,3)),R.setAttribute("aData",new t.Float32BufferAttribute(g,4)),R.setIndex(W),R.computeVertexNormals();const V=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...c},fog:!0,vertexColors:!0,side:t.DoubleSide,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 aData; varying vec3 vW, vN, vCol; varying vec4 vData;
      void main(){ vW = position; vN = normal; vCol = color; vData = aData; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC, uCamL, uDustLit; uniform float uShade;
      varying vec3 vW, vN, vCol; varying vec4 vData;
      ${lt}
      float clod(vec3 p, float top){ return vn3(p * vec3(1.5, 2.6, 1.5)) * .6 + vn3(p * 5.3) * .3 + vn3(p * 13.) * .12 + (.25 * sin(p.y * 9. + vn2(p.xz * .4) * 5.) + .5 * vn2(vec2(p.x * 1.4 + p.z * .6, p.y * .13))) * (1. - top); }
      void main(){
        vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), p = vW; if (!gl_FrontFacing) N = -N;
        float top = max(smoothstep(.55, .85, N.y), vData.w), e = .1, y = vData.y, face = 1. - top;
        float polish = exp(-((y - 1.2) / .45) * ((y - 1.2) / .45)) * face;                             // the band rubbed smooth and dark by shoulders
        vec2 ta = p.xz;                 // the ground plan under the face: every pattern below is read off the earth itself, so a bulge in the face cannot bend it
        // the beds the flood cut through: each stands proud by its hardness. Where a hard bed sits on a soft one its top is a ledge that
        // takes the light; where a soft one sits under a hard one it is an undercut, dark
        // (the beds waver and break: each runs a few metres as a ledge, then is lost in the face, and a slumped scar wipes them out)
        float slump = smoothstep(.56, .74, vn3(vec3(ta.x * .19, p.y * .3 + 2., ta.y * .19)));
        float sy = p.y * 1.7 + (vn2(ta * .11 + 3.) - .5) * 2.4 + (vn2(ta * .43 + 7.) - .5) * 1.1 + (vn3(vec3(ta.x * .9, p.y * .6, ta.y * .9)) - .5) * .5, bi = floor(sy), bf = sy - bi, fw = fwidth(sy);
        float brk = smoothstep(.42, .62, vn2(ta * .27 + vec2(bi * 7.3, bi * 3.1)));
        float crisp = (1. - smoothstep(.25, .8, fw)) * face * (1. - .85 * polish) * brk * (1. - .85 * slump), hb = h21(vec2(bi, 5.3)), stp = h21(vec2(bi + 1., 5.3)) - hb;
        float edge = smoothstep(.45, 1., bf) * (1. - smoothstep(1. - max(.08, fw), 1., bf) * .5), ledge = edge * max(-stp, 0.) * crisp * .8, under = edge * max(stp, 0.) * crisp * .9;
        ledge = min(ledge, 1.); under = min(under, 1.);
        float h0 = clod(p, top); vec3 g = vec3(clod(p + vec3(e, 0., 0.), top), clod(p + vec3(0., e, 0.), top), clod(p + vec3(0., 0., e), top)) - h0;
        g = g / e; g -= N * dot(g, N); N = normalize(N - g * mix(.55, .16, top) * (1. - .8 * polish));
        N = normalize(N + vec3(0., 1., 0.) * (ledge * 1.6 - under * 1.0));
        vec3 alb = vCol * (.78 + .44 * vn3(p * vec3(.9, 3., .9)));
        alb *= mix(vec3(1.), (.88 + .24 * mix(hb, hb + stp, smoothstep(.55, 1., bf))) * mix(vec3(1.05, .97, .88), vec3(.95, 1., 1.06), mix(h21(vec2(bi, 1.7)), h21(vec2(bi + 1., 1.7)), smoothstep(.55, 1., bf))), face * (1. - polish) * (.35 + .65 * brk));     // bed by bed, where a bed shows
        alb = mix(alb, alb * vec3(1.22, .96, .8) * (.9 + .3 * vn3(p * 2.3)), slump * face * (1. - polish) * .7);          // a fresh scar: raw red earth
        { float pv = clamp((y - 2.3 - (vn2(ta * .21 + 5.) - .5) * 1.3) / .16, -6., 6.), pb = exp(-pv * pv) * smoothstep(.35, .6, vn2(ta * .33 + 8.));
          alb = mix(alb, vec3(.6, .53, .44) * (.65 + .6 * h21(floor(p.xz * 23.) + floor(p.y * 23.))), smoothstep(.62, .74, vn3(p * 7.)) * pb * face * .85 * (1. - slump)); }      // a pebble band, wavering and broken
        alb *= 1. - .3 * smoothstep(.5, .9, vn3(vec3(ta.x * 2.2, p.y * .22, ta.y * 2.2))) * face;                             // drip streaks
        alb = mix(alb, vec3(.56, .5, .42) * (.7 + .5 * h21(floor(p.xz * 31.))), smoothstep(.86, .93, vn3(p * 8.5)) * face * .7 * (1. - polish));   // pebbles in the earth
        alb *= (1. - .5 * under) * (1. + .3 * ledge);                                     // dust lies pale on the ledges
        alb = mix(alb, alb * vec3(.6, .55, .5), polish * .85);
        alb *= mix(1., (.75 + .5 * vn2(p.xz * 9.)), top);
        float ndl = dot(N, uSun), dif = max(ndl, 0.) * .85 + .15 * (ndl * .5 + .5);
        float sunV = mix(1., smoothstep(-.5, .5, y - vData.z), 1. - vData.w);
        float unlit = 1. - sunV * smoothstep(.0, .4, ndl);                 // in the other wall's shadow, or turned from the sun: the fill is the lit ground and the lit wall opposite
        vec3 V = normalize(uCamL - p + vec3(0., 1e-5, 0.)), Hh = normalize(uSun + V);
        vec3 col = alb * (uSunC * dif * sunV * .66 + mix(uGndC, uSkyC, N.y * .5 + .5) * vData.x + uSunC * vec3(.36, .24, .14) * (.3 + .72 * (1. - uShade)) * unlit * (.45 + .55 * vData.x) + uDustLit * .34 * uShade * (.4 + .6 * vData.x)
          + uSkyC * .32 * unlit * (1. - uShade));        // out of the gully's dust the shaded wall takes the open sky and the lit ground: earth, never a black hole
        col += uSunC * pow(max(dot(N, Hh), 0.), 14.) * .05 * polish * sunV + uSkyC * polish * .04;
        col += alb * (uSkyC * .3 + uSunC * .16 * sunV + uDustLit * .22 * uShade) * ledge;                        // the ledges' upper edges take the light
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),j=new t.Mesh(R,V);return j.frustumCulled=!1,B.add(j),{group:B,cols:se,relief:D,triangles:W.length/3,VH:U}}async function nn(a,e,h,i){const v=a.rng.fork("dress"),m=a.rng.fork("mats"),o=h.uniforms,L=new t.Group,P=a.quality?.detail??1,c=new bt.Geo,r=new t.Color(.17,.105,.058),B=new t.Color(.085,.055,.032),te=[],w=[],M=(z,b,x)=>b.hw-.1+.1*Math.max(0,x)+i.relief(z.s,z.floor+x,b.sd)*Math.min(1,b.H/1.5),O=(z,b,x,g,W)=>[z.cx-z.tz*b.sd*x+z.tx*W,z.floor+g,z.cz+z.tx*b.sd*x+z.tz*W],d=a.core.makeRng(a.core.hashSeed("root-curtain:"+a.seed));for(const z of i.cols)for(const b of[0,1]){let x=v.range(0,3),g=v.range(0,6),W=m.range(0,2),se=d(),ye=d();for(let Y=0;Y<z.length;Y++){(Y&31)===31&&await a.yield();const R=z[Y],V=R.side[b],j=V.H;if(j>.5){for(let C=0;C<2;C++)if(C===0||Y%2){const ee=V.eT*(C?.75:.3)+(C?0:-.25)+v.range(-.15,.15),y=v.range(-.45,.45),J=O(R,V,M(R,V,j)+Math.max(0,ee),j*(C?1:.97)+(C?.05:0),y),oe=J[0]>40;if(oe&&v.chance(.45))continue;te.push([J[0],J[1]-.05,J[2],v.range(.75,1.3)*Math.min(1,.4+j/3)*(oe?v.range(.45,1):1),Math.atan2(-R.tx*V.sd,R.tz*V.sd)+(oe?v.range(-.9,.9):0)])}}if(j<1.7)continue;const Q=C=>{const ee=C.range(-.4,.4),y=C.int(5,8);for(let J=0;J<y;J++){const oe=ee+C.range(-.45,.45),K=C.range(.25,1)*Math.min(1,j/2.4),E=C.range(.006,.012),he=j-C.range(.02,.3),me=C.range(-.12,.12),ze=J%2?r:B;let le=-1,ce=-1;for(let de=0;de<=2;de++){const re=de/2,H=he-K*re,ue=E*(1-.7*re),ie=oe+me*re*re,Be=M(R,V,H)-.035-.05*Math.sin(re*3.1),Ue=O(R,V,Be,H,ie-ue),We=O(R,V,Be,H,ie+ue),Ge=c.v(Ue[0],Ue[1],Ue[2],ze),Fe=c.v(We[0],We[1],We[2],ze);c.g[Ge]=c.g[Fe]=u(-.5,.5,H-V.line),de&&c.quad(le,ce,Fe,Ge),le=Ge,ce=Fe}}};--W<=0&&(W=m.range(1,2.6)/Math.sqrt(P),Q(m));const X=(C,ee)=>{const y=Math.min(j-.5,C.range(1.6,4.2)*ee),J=C.range(.07,.125),oe=C.range(-.8,.8),K=C()*6.283,E=C()*6.283,he=7,me=H=>oe*H*H*(3-2*H)+.13*Math.sin(H*5+K)*H+.04*Math.sin(H*12+E)*H,ze=H=>J*(1-.82*Math.pow(H,.8))+.006,le=H=>{const ue=j+.14-(y+.14)*H,ie=Math.max(0,1-H/.1);return O(R,V,M(R,V,Math.min(ue,j*.94))-ze(H)*.8-.13*Math.sin(Math.min(1,H*1.5)*Math.PI)*(1-ie)+.42*ie*ie,ue-.05*ie,me(H))},ce=(H,ue)=>u(-.5,.5,ue-R.floor-V.line),de=[],re=[];for(let H=0;H<=he;H++)de.push(le(H/he)),re.push(ze(H/he));if(c.glow(c.tube(de,re,4,r,B),ce),y>2.2){const H=C.range(.28,.5),ue=C.chance(.5)?1:-1,ie=C.range(.9,1.7),Be=j+.14-(y+.14)*H,Ue=[],We=[];for(let Ge=0;Ge<=5;Ge++){const Fe=Ge/5,Ee=Math.max(.3,Be-ie*Fe*(.55+.45*Fe));Ue.push(O(R,V,M(R,V,Ee)-ze(H)*.5-.05,Ee,me(H)+ue*ie*.6*Fe*(2-Fe)*.6)),We.push(ze(H)*.72*(1-.85*Fe)+.005)}c.glow(c.tube(Ue,We,3,r,B),ce)}for(let H=0,ue=C.int(2,3);H<ue;H++){const ie=C.range(.3,.9),Be=C.chance(.5)?1:-1,Ue=C.range(.35,.8),We=j+.14-(y+.14)*ie,Ge=[],Fe=[];for(let Ee=0;Ee<=3;Ee++){const je=Ee/3,ae=Math.max(.2,We-Ue*je*(.7+.3*je));Ge.push(O(R,V,M(R,V,ae)-.03,ae,me(ie)+Be*Ue*.5*je)),Fe.push(Math.max(.006,ze(ie)*.4*(1-.8*je)))}c.glow(c.tube(Ge,Fe,3,r,B),ce)}};if(--x<=0&&(x=v.range(1.9,3.9)/Math.sqrt(P),X(v,1)),V.rootK&&((se-=1.6*V.rootK)<=0&&(se+=d.range(1,2.6)/Math.sqrt(P),Q(d)),(ye-=2.2*V.rootK)<=0&&(ye+=d.range(1.9,3.9)/Math.sqrt(P),X(d,1+.5*V.rootK))),V.thorn){const C=a.core.makeRng(a.core.hashSeed("rim-thorn:"+a.seed+":"+Math.round(R.s))),ee=new t.Color(.12,.098,.076),y=new t.Color(.06,.048,.038),J=(le,ce)=>u(-.5,.5,ce-R.floor-V.line),oe=C.range(-.5,.5),K=C.range(-.7,.7),E=Math.min(j-.9,C.range(1.9,2.8)),he=le=>{const ce=u(.25,.55,le),de=j+.3+.25*Math.sin(le*3.1)*(1-ce)-E*ce*le;return O(R,V,M(R,V,Math.min(de,j*.94))+pe(1.9,-.45-.3*le,ce),de,oe+K*le)},me=[],ze=[];for(let le=0;le<=6;le++)me.push(he(le/6)),ze.push(.085*(1-.6*le/6));c.glow(c.tube(me,ze,4,ee,y),J);for(let le=0,ce=C.int(10,13);le<ce;le++){const de=C.range(.45,.98),re=he(de),H=le%2?1:-1,ue=C.range(.9,2.3),ie=C.range(.1,.9),Be=C.range(.1,.6),Ue=[],We=[];for(let Ge=0;Ge<=3;Ge++){const Fe=Ge/3;Ue.push([re[0]+R.tx*H*ue*Fe- -R.tz*V.sd*Be*Fe*Fe,re[1]-ie*Fe*Fe+.2*Math.sin(Fe*3.1),re[2]+R.tz*H*ue*Fe-R.tx*V.sd*Be*Fe*Fe]),We.push(.04*(1-.8*Fe)+.006)}c.glow(c.tube(Ue,We,3,ee,y),J)}}if(--g<=0){g=v.range(2.2,5.8);const C=O(R,V,M(R,V,j*.9)-.25,j*.93,0);w.push([C[0],C[1],C[2],v(),j*.93,v.range(.16,.3),v.range(.7,1.3),v()])}}}const F=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...o},fog:!0,vertexColors:!0,side:t.DoubleSide,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute float aGlow; varying vec3 vN, vW, vC; varying float vSun;
      void main(){ vW = position; vN = normal; vC = color; vSun = aGlow; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSun, uSunC, uSkyC, uGndC, uDustLit; uniform float uShade; varying vec3 vN, vW, vC; varying float vSun;
      ${lt}
      void main(){
        vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
        vec3 alb = vC * (.72 + .5 * vn3(vW * vec3(9., 2.2, 9.)));                                  // bark drawn out along the root
        float ndl = dot(N, uSun), dif = max(ndl * .7 + .3, 0.);
        vec3 col = alb * (uSunC * dif * vSun * .8 + mix(uGndC, uSkyC, N.y * .5 + .5) * .8 + uSunC * vec3(.36, .24, .14) * .26 * (1. - vSun) + uDustLit * .3 * uShade);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`});await a.yield();const l=new t.Mesh(c.build(),F);l.frustumCulled=!1,L.add(l);const S=w.length*3,_=new Float32Array(S*4),I=new Float32Array(S*4);w.forEach((z,b)=>{for(let x=0;x<3;x++)_.set([z[0],z[1],z[2],(z[3]+x*.13)%1],(b*3+x)*4),I.set([z[4],z[5],z[6],x===0?0:.5+.5*((z[7]+x*.37)%1)],(b*3+x)*4)});const s=new t.InstancedBufferGeometry,p=new t.PlaneGeometry(2,2);s.index=p.index,s.setAttribute("position",p.attributes.position),s.setAttribute("fA",new t.InstancedBufferAttribute(_,4)),s.setAttribute("fB",new t.InstancedBufferAttribute(I,4)),s.instanceCount=S;const D=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...o},fog:!0,transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.OneFactor,blendDstAlpha:t.OneMinusSrcAlphaFactor,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 fA, fB; uniform float uTime; varying vec2 vUv; varying vec3 vK;
      void main(){
        float t = fract(uTime * fB.y + fA.w), H = fB.x, clodK = fB.w; vec3 p = fA.xyz; float a;
        vec3 right = normalize(vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]));
        vec3 up = normalize(vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]));
        if (clodK < .25) { p += right * position.x * (.3 + .25 * t) + vec3(0., (position.y - 1.) * H * .5, 0.); a = sin(t * 3.14159) * .42; }          // the streak down the face
        else { float tt = fract(t * 1.7 + clodK), sz = .05 + .07 * clodK; p.y -= H * tt * tt; p += right * ((clodK - .75) * .5 + position.x * sz) + up * position.y * sz; a = 1. - smoothstep(.85, 1., tt); }
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        vUv = position.xy; vK = vec3(clodK, a * smoothstep(1.5, 4., -mvPosition.z), t);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSunC, uSkyC, uDustLit, uDustShade; varying vec2 vUv; varying vec3 vK;
      ${lt}
      ${ia}
      void main(){
        float al; vec3 col;
        if (vK.x < .25) { float n = vn2(vec2(vUv.x * 2. + vK.z * 3., vUv.y * 3. + vK.z * 9.)); al = (1. - smoothstep(.2, 1., abs(vUv.x) + (n - .5) * .6)) * smoothstep(-1., -.6, vUv.y) * (1. - smoothstep(.2, 1., vUv.y + (1. - vK.z) * 1.6 - .8)) * (.4 + .6 * n); col = mix(uDustShade * 1.5, uDustLit * (.5 + .2 * uSunC), .55); }
        else { al = 1. - smoothstep(.5, 1., length(vUv)); col = uDustShade * .35 * (uSunC * .3 + uSkyC); }
        al *= vK.y;
        gl_FragColor = vec4(fogMix(col, FOGD) * al, al);
      }`}),U=new t.Mesh(s,D);return U.frustumCulled=!1,U.renderOrder=3.4,L.add(U),{group:L,fringe:te,triangles:l.geometry.index.count/3+S*2}}function sn(a,e,h){const i=a.rng.fork("bank"),v=h.uniforms,m=[],o=new t.Vector3,L=new t.Vector3,P=a.quality?.detail??1,c=(l,S,_,I,s,p=[1,0,1,0])=>{e.posAt(l,o),e.tanAt(l,L);const D=1/Math.max(1e-4,Math.hypot(L.x,L.z));m.push([o.x-L.z*D*S,_,o.z+L.x*D*S,i(),I,s,i.range(.018,.034),i(),...p])};for(let l=0;l<Math.round(52*P);l++){const S=Math.pow(i(),1.3),_=i.range(e.sGully-26,e.sLip-8),I=i.gauss()*9,s=i.range(8,13)+7*S,p=i.range(8,18);l%3===0&&c(_,I,12+20*S,s*.8,p)}for(let l=0;l<Math.round(22*P);l++)c(i.range(26,e.sGully),i.gauss()*5,12.2+i.range(0,2.5),i.range(3.5,6.5),i.range(2,5));for(let l=0;l<Math.round(22*P);l++){const S=i.range(-20,e.sGully);e.posAt(Math.max(0,S),o),c(S,i.gauss()*8,o.y-.6+i.range(0,2.2),i.range(3.5,7),i.range(2,5))}for(let l=0;l<Math.round(14*P);l++)c(i.range(e.sExit,e.L+30),i.gauss()*6,e.pathY(e.sExit+40)+i.range(1,5),i.range(3.5,6),i.range(2,5));{const l=a.rng.fork("sheet");for(let S=0;S<Math.round(46*P);S++){const _=l.range(e.sGully-44,e.sGully+26);c(_,l.gauss()*5.5,e.pathY(_)-1.5+l.range(.25,.6),l.range(4,7),l.range(.3,.9),[1.35,0,.3,0])}}{const l=a.rng.fork("pall"),S=h.anchors.plume,_=v.uSun.value.x,I=v.uSun.value.z,s=1/Math.max(1e-4,Math.hypot(_,I)),p=_*s,D=I*s;for(let U=0;U<Math.round(48*P);U++){const z=Math.pow(l(),.85),b=l.gauss()*(15-5*z)+9*z*z,x=l.gauss()*11;m.push([pe(S.base[0],S.top[0],z)+p*b-D*x,S.base[1]-1+60*z,pe(S.base[2],S.top[2],z)+D*b+p*x,l(),l.range(15,23)-4*z,l.range(6,14),l.range(.011,.019),l(),1.55,96,1,Ze(b/13,-1,1)])}}const r=m.length,B=new Float32Array(r*4),te=new Float32Array(r*4),w=new Float32Array(r*4);m.forEach((l,S)=>{B.set(l.slice(0,4),S*4),te.set(l.slice(4,8),S*4),w.set(l.slice(8,12),S*4)});const M=new t.InstancedBufferGeometry,O=new t.PlaneGeometry(2,2);M.index=O.index,M.setAttribute("position",O.attributes.position),M.setAttribute("dA",new t.InstancedBufferAttribute(B,4)),M.setAttribute("dB",new t.InstancedBufferAttribute(te,4)),M.setAttribute("dC",new t.InstancedBufferAttribute(w,4)),M.instanceCount=r;const d=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...v,uBankA:{value:.34}},fog:!0,transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.OneFactor,blendDstAlpha:t.OneMinusSrcAlphaFactor,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 dA, dB, dC; uniform float uTime, uBankA; uniform vec3 uSun, uWind;
      varying vec2 vUv; varying vec3 vK; varying vec2 vL2; varying float vSide, vPall;
      void main(){
        float lt = fract(uTime * dB.z + dA.w), sz = dB.x * (.7 + .6 * lt);
        vec3 p = dA.xyz + vec3(0., dB.y * lt, 0.) + uWind * lt * 7.;
        vec3 right = normalize(vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]));
        vec3 up = normalize(vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]));
        vec4 mvPosition = modelViewMatrix * vec4(p + right * position.x * sz + up * position.y * sz * dC.z, 1.);
        float a = sin(lt * 3.14159) * uBankA * smoothstep(sz * .8, sz * 2.6, -mvPosition.z) * dC.x;
        if (dC.y > 0.) a *= smoothstep(dC.y, dC.y * 1.8, -mvPosition.z);
        vL2 = vec2(dot(uSun, right), dot(uSun, up)); vUv = position.xy; vK = vec3(a, dB.w, lt); vSide = dC.w; vPall = dC.y > 0. ? 1. : 0.;
        gl_Position = a > .004 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uSunC, uSkyC, uDustLit, uDustShade;
      varying vec2 vUv; varying vec3 vK; varying vec2 vL2; varying float vSide, vPall;
      ${lt}
      ${ia}
      void main(){
        float r = length(vUv), n = vn2(vUv * 1.6 + vK.y * 23. + vK.z * .5) * .6 + vn2(vUv * 3.9 - vK.y * 11.) * .4;
        float al = min((1. - smoothstep(.1, 1., r + (n - .5) * .85)) * vK.x, .96);
        float lit = clamp(dot(vUv, vL2) * .55 + .5 + (n - .5) * .3 + vSide * .42, 0., 1.);
        // the plume's own billows keep its two tones from the plain: those on the sun's side of the mass gold, the rest umber in its shade,
        // and the plain's haze takes of them only what it takes of the plume
        float lit2 = smoothstep(.2, .8, clamp(vSide * .8 + .3 + dot(vUv, vL2) * .42 + (n - .5) * .45, 0., 1.));
        vec3 col = mix(uDustShade * (1.3 + uSkyC * .8) * mix(1., .78, vPall), uDustLit * (.62 + .24 * uSunC) * mix(1., 1.3, vPall), mix(lit, lit2, vPall));
        gl_FragColor = vec4(fogMix(col, FOGD * mix(1., .55, vPall)) * al, al);
      }`}),F=new t.Mesh(M,d);return F.frustumCulled=!1,F.renderOrder=3.6,{mesh:F,triangles:r*2}}var dn={id:"mara-crossing",name:"The Crossing",category:"wilderness",weirdness:.02,media:["open","water"],async build(a){const e=a.rng,h=a.quality?.detail??1,i=a.vary||{},v=e.fork("vary"),m=v(),o=v.pick(["golden","golden","storm","rains"]),L=v.chance(.3),P=v.chance(.25);let c=m<.3?"golden":m<.44?"rains":m<.54?"dusk":m<.74?"storm":m<.84?"dawn":"golden";i.hour==="dawn"?c="dawn":i.hour==="day"?c="noon":i.hour==="night"?c="dusk":i.hour==="golden"&&(c=o);const r=go[c],B=!!i.rare,te=Ze(i.density??1,.7,1.3),w=new t.Scene,M=await po(a,{palette:Xt,hour:r.hour,weather:r.weather,season:L?"july":"october",density:Math.min(te,1)*.8,cast:P?"zebra":void 0,swimTo:[8,58.5],cycle:27,duration:Ot});w.add(M.object);const O=M.uniforms,d=M.anchors.waterY,F=new t.Vector3().fromArray(M.anchors.sunDir).normalize();O.uHaze.value.set(r.horizon).multiplyScalar(.8),c==="storm"&&O.uHaze.value.lerp(Te(r.mid),.65),O.uSkyRef.value.set(r.mid).lerp(Te(r.zenith),.3),await a.yield();const l=wo(a,M,d);await a.yield();const S=bo(a,l,M,d,r),_=l.path;await a.yield();const I=uo({rng:e,preset:"day",zenith:r.zenith,mid:r.mid,horizon:r.horizon,ground:r.ground,horizonPow:c==="storm"?6:5.5,sunDirection:F,sunColor:r.sunC,sunSize:1.6,sunIntensity:c==="dusk"?5:10,scatterColor:r.horizon,scatter:c==="storm"?.06:.4,clouds:{coverage:r.clouds,lit:r.cloudLit,shade:r.cloudShade,scale:1.3,haze:c==="storm"?.08:.3},clouds2:c==="storm"||c==="golden"?!1:{coverage:.3,stretch:1,opacity:.5},lightColor:Te(r.sunC).lerp(Te("#ffffff"),.2),lightIntensity:r.sunI,ambientColor:r.hemiSky,groundLight:r.hemiGnd,ambientIntensity:r.hemiI,fogColor:r.fog,lightElevationMin:9});w.add(I.object),await a.yield();const s=ho(I);w.add(s.object);const p=Te(r.fog),D=Te(r.gully).lerp(Te(r.fog),.18).multiplyScalar(.98);w.fog=new t.FogExp2(p.clone(),r.fogK),await a.yield();const U=await fo.makeTerrainAsync({rng:e,noise:a.noise,height:S.height,path:_,corridor:!1,bounds:[-600,-500,500,560],cell:2.4,near:30,levels:5,refine:2,maxTriangles:43e3,biome:"meadow",color:S.color,sunDir:F,skirt:30,palette:{rock:"#b08c64",rockB:"#9a6a48",rockSlope:[.5,.74],strata:.5,strataScale:5,patch:"#cbb68a",patchAmount:.25,tufts:.35,pebbles:.35,cracks:.15,clouds:.8,streaks:.2,detail:.35,bump:.3}},a.yield);w.add(U.object),await a.yield();const z=330,b=.44,x=U.uniforms&&U.uniforms.uTCloud?U.uniforms.uTCloud.value:O.uTCloud.value,g=Jo(a,z);x.z=g.z,x.w=b,O.uTCloud.value=x,O.tCloud.value=U.detailTexture||null,await a.yield();const W=Xo(a,M,r);w.add(W),await a.yield();const se=Wo(M,d,r);w.add(se);{const f=[],T=[],be=[],_e=Te("#6f7f9e").lerp(Te(r.horizon),.42),$=Te("#7f8ca6").lerp(Te(r.horizon),.62),we=a.noise,Le=(Ne,It,sa,Pe,Ce,at)=>{const Mt=f.length/3;for(let wt=0;wt<=Ne;wt++){const yt=wt/Ne,Gt=It(yt),ut=sa(yt);if(f.push(Gt[0],Pe,Gt[1],Gt[0],ut,Gt[1]),T.push(at.r,at.g,at.b,Ce.r,Ce.g,Ce.b),wt<Ne){const _t=Mt+wt*2;be.push(_t,_t+1,_t+2,_t+2,_t+1,_t+3)}}};Le(140,Ne=>[-3600+7200*Ne,2500+500*Math.sin(Ne*3.1)],Ne=>250+70*we.fbm2(Ne*9,1.5,3)+40*we.n2(Ne*40,2),-40,_e,$),Le(160,Ne=>[Math.cos(Ne*6.283)*2100,Math.sin(Ne*6.283)*2100],Ne=>60+45*we.fbm2(Math.cos(Ne*6.283)*3,Math.sin(Ne*6.283)*3+9,3),-40,$,Te(r.horizon).lerp($,.5));const Ke=new t.BufferGeometry;Ke.setAttribute("position",new t.Float32BufferAttribute(f,3)),Ke.setAttribute("color",new t.Float32BufferAttribute(T,3)),Ke.setIndex(be);const $e=new t.Mesh(Ke,new t.MeshBasicMaterial({vertexColors:!0,fog:!1,side:t.DoubleSide}));$e.frustumCulled=!1,$e.renderOrder=-.8,w.add($e)}if(r.weather==="storm"){const f=new t.PlaneGeometry(4200,620,24,1);f.translate(0,300,0);const T=new t.ShaderMaterial({uniforms:{uTime:O.uTime,uC:{value:Te(r.mid).multiplyScalar(.55)}},transparent:!0,depthWrite:!1,side:t.DoubleSide,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; vec3 p = position; p.x += (p.y - 300.) * .22; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }",fragmentShader:`uniform float uTime; uniform vec3 uC; varying vec2 vUv;
          ${lt}
          void main(){ float st = vn2(vec2(vUv.x * 90., vUv.y * 2.2 + uTime * .12)) * .6 + vn2(vec2(vUv.x * 23., vUv.y * .8 + uTime * .05)) * .4;
            float top = .5 + .32 * vn2(vec2(vUv.x * 7., 3.)); float env = smoothstep(0., .14, vUv.x) * (1. - smoothstep(.78, 1., vUv.x)) * smoothstep(.0, .2, vUv.y) * (1. - smoothstep(top - .34, top, vUv.y)) * (.55 + .45 * vn2(vec2(vUv.x * 5., 1.)));
            gl_FragColor = vec4(uC * (.8 + .4 * st), env * (.45 + .4 * st)); }`}),be=new t.Mesh(f,T);be.position.set(-500,-20,1900),be.frustumCulled=!1,be.renderOrder=-.6,w.add(be)}await a.yield(),O.uCut.value.set(l.lip[0]+.5,l.lip[2]-2,0,0);const ye=oo(l,S,d,F),Y=no(l,S,d),R=[...qo(l,S),...yo(l,M,d,B),Go(l,S,d,F)],V=await Ko(a,l,S,M,d,{density:Math.min(te,1.03),zebraCast:P,lunge:Y});for(const f of V.meshes)w.add(f);w.add(V.trail),w.add(V.far),w.add(V.shadow),se.onBeforeRender=V.camL,W.onBeforeRender=V.camL,await a.yield();const j=xt.makeWind({direction:[O.uWind.value.x,O.uWind.value.z||-.4],strength:1.1,speed:1.1}),Q=await Vo(a,l,S,M,d,j);w.add(Q.group),Q.group.traverse(f=>{f.isMesh&&f.material.isShaderMaterial&&(f.onBeforeRender=V.camL)}),U.addContact(Q.pts.map(f=>[f.x,f.z,3.2]).concat(Q.figs.map(f=>[f.x,f.z,5]),[[Q.deadPos.x,Q.deadPos.z,2.5]]),{strength:.45}),await a.yield(),await a.yield();const X=l.L,C=f=>l.timeAtU(f),ee=()=>new t.Vector3,y=(f,T={})=>{const be=l.posAt(f*X,ee()),_e=l.tanAt(f*X,ee()),$=1/Math.max(1e-4,Math.hypot(_e.x,_e.z));return T.p=be,T.f=new t.Vector3(_e.x*$,0,_e.z*$),T.r=new t.Vector3(-_e.z*$,0,_e.x*$),T},J=l.sSplash/X,oe=C((l.sSplash-2.5)/X),K=C(.1),E=_a(l),he=y(E/X),me=Q.deadPos.y,ze=30,le=C(Da)-.45,ce=C(ra)-1.7,de=C(ra)+1.5,re=C(ra)-.9,H=C(ra)+.7,ue=26,ie=Math.min(6,Math.max(0,Q.perches.length-2)),Be=14,Ue=12,We=12,Ge=ue+ie+Be+Ue+We,Fe=Io(),Ee=new Float32Array(Ge*4),je=e.fork("birds"),ae=new t.Object3D;Fe.setAttribute("iF",new t.InstancedBufferAttribute(Ee,4));const Me=new t.InstancedMesh(Fe,jt(M,{USE_ANIM:1,FLAP:1},{alb:.55}),Ge);Me.frustumCulled=!1,Me.onBeforeRender=V.camL,w.add(Me);const Se=new t.InstancedMesh(No(),jt(M,{DISTDARK:1},{alb:.95}),Math.max(1,ie));Se.frustumCulled=!1,Se.onBeforeRender=V.camL,w.add(Se);const ot=Oo(),Je=new Float32Array(Math.max(1,ie)*4);ot.setAttribute("iF",new t.InstancedBufferAttribute(Je,4));const st=new t.InstancedMesh(ot,Me.material,Math.max(1,ie));st.frustumCulled=!1,st.onBeforeRender=V.camL,w.add(st);const qt=M.anchors.plume,Kt=[],Ft=new t.Color;for(let f=0;f<Ge;f++){const T={a:je(),b:je(),c:je(),d:je(),kind:f<ue?0:f<ue+ie?1:f<ue+ie+Be?2:f<ue+ie+Be+Ue?3:4,k:0};T.k=f-[0,ue,ue+ie,ue+ie+Be,ue+ie+Be+Ue][T.kind];const be=T.kind<2?Ft.set(je.chance(.3)?"#8a7860":"#4a3c30").multiplyScalar(je.range(.7,1.1)):T.kind===2?Ft.set("#f0ede2"):T.kind===3?Ft.set("#1c2434"):Ft.set("#4a3826");Me.setColorAt(f,be),Kt.push(T),T.kind===1&&(T.t0=C((E-Uo+ze*(T.k+.8*T.a)/Math.max(1,ie))/X),st.setColorAt(T.k,Ft.setScalar(.85+.3*T.d)))}ie||(ae.scale.setScalar(.001),ae.updateMatrix(),st.setMatrixAt(0,ae.matrix),st.setColorAt(0,Ft.setScalar(1))),Me.instanceColor.needsUpdate=!0,st.instanceColor.needsUpdate=!0;const Fa=V.lanes[V.colRows[0]],Ut=Ca(Fa,K+.35+Nt,ee()),la=y(.1),ga=(f,T,be,_e,$)=>{if(f.kind===0){const we=.25+.75*f.a,Le=22+46*f.b,Ke=8.5/Le*(f.c<.5?1:-1),$e=T*Ke+f.d*6.283,Ne=f.k%5===4;$.x=pe(qt.base[0],qt.top[0],we)+Math.cos($e)*Le*(Ne?3:1)+(Ne?-120*f.a:0),$.z=pe(qt.base[2],qt.top[2],we)+Math.sin($e)*Le*(Ne?3:1)+(Ne?-40:0),$.y=34+52*we+4*Math.sin(T*.21+f.c*9),$.amp=.05,$.rate=1.3,$.bias=.16,$.scale=1.25+.2*f.c}else if(f.kind===1){const we=Q.perches[2+f.k],Le=be-f.t0;if(Le<=0)$.x=we.x,$.y=we.y+.22+.03*Math.sin(T*1.3+f.a*9),$.z=we.z+.002*T,$.amp=.03,$.rate=2,$.bias=-1.25,$.scale=1.15,$.perch=1;else{const Ke=12+2.5*f.b,$e=3.6+2.4*f.c,Ne=Ke*(Le-.9*(1-Math.exp(-Le/.9))),It=$e*(Le-.7*(1-Math.exp(-Le/.7))),sa=we.y+.22-me,Pe=Math.min(sa,4.6+1.8*f.a),Ce=Math.max(0,Le-1.1),at=he.f,Mt=he.r;$.x=we.x+at.x*Ne-Mt.x*It,$.z=we.z+at.z*Ne-Mt.z*It,$.y=me+pe(sa,Pe,u(0,1.5,Le))+(1.2+.9*f.d)*Ce*Ce/(Ce+1.3)-.16*Math.sin(T*7.4+f.a*6.283)*u(.3,1,Le),$.amp=pe(.85,.42,u(1.2,4.5,Le)),$.rate=7.4,$.bias=pe(.75,.08,u(0,.5,Le)),$.scale=1.2,$.perch=0}}else if(f.kind===2){const we=(f.a*10+_e*.6)%10-1,Le=l.distAtTime(be+we),Ke=f.k%2?1:-1;l.posAt(Le,kt),l.tanAt(Le,rt);const $e=1/Math.max(1e-4,Math.hypot(rt.x,rt.z)),Ne=Ke*(7+7*f.b)+1.5*Math.sin(T*.5+f.c*9);$.x=kt.x-rt.z*$e*Ne,$.z=kt.z+rt.x*$e*Ne,$.y=Math.max(S.height($.x,$.z),d)+2.4+2.6*f.d+.5*Math.sin(T*.9+f.a*20),$.amp=.62,$.rate=9+2*f.c,$.bias=.1,$.scale=.5}else if(f.kind===3){const we=l.distAtTime(be+_e*.3)+9+14*f.a+5*Math.sin(T*.8+f.b*9),Le=1.1+.8*f.c;l.posAt(we,kt),l.tanAt(we,rt);const Ke=1/Math.max(1e-4,Math.hypot(rt.x,rt.z)),$e=(4+6*f.d)*Math.sin(T*Le+f.b*6.283);$.x=kt.x-rt.z*Ke*$e,$.z=kt.z+rt.x*Ke*$e,$.y=kt.y-.6+1.6*(1+Math.sin(T*Le*2+f.a*9))+f.c,$.amp=.7,$.rate=16,$.bias=0,$.scale=.2}else{const we=be-K-f.k*.05;if(we<=0||we>5)$.x=Ut.x,$.y=-50,$.z=Ut.z,$.scale=.001,$.amp=0,$.rate=1,$.bias=0;else{const Le=la.f,Ke=la.r,$e=(12.5+3*f.a)*we,Ne=-(1.2+3.2*f.b)*we*(1-.08*we),It=.9+(1.3+1.5*f.c)*we-.14*we*we;$.x=Ut.x+Le.x*$e+Ke.x*Ne+.3*Math.sin(T*9+f.d*9),$.z=Ut.z+Le.z*$e+Ke.z*Ne,$.y=Ut.y+1.3+It+.2*Math.sin(T*11+f.a*9),$.amp=.9,$.rate=26,$.bias=0,$.scale=.58*u(0,.2,we)*(1-u(4,5,we))}}return $},kt=ee(),rt=ee(),He={},Dt={},qe=new t.Object3D;await a.yield();const wa=bt.waderGeometry({...bt.WADER_PRESETS.stork,body:"#e8e4dc",belly:"#f0ece4",wing:"#2a2c34",neckC:"#d8b0a8",cap:"#c89a94",beakC:"#c8b890",legC:"#b8b0a8"}),ya=Se.material,it=[];for(let f=0;f<Math.min(2,Q.perches.length);f++){const T=new t.Mesh(wa,ya),be=Q.perches[f];T.position.copy(be).y-=.05,T.scale.setScalar(1.55),T.rotation.y=je()*6.283,T.onBeforeRender=V.camL,w.add(T),it.push(T)}await a.yield();const ca=$o(a,l,S,M,d,V.camL);w.add(ca.group),await a.yield();const nt=e.fork("crocs"),At=7,Yt=so(),ua=new Float32Array(At*4);Yt.setAttribute("iF",new t.InstancedBufferAttribute(ua,4));const ht=new t.InstancedMesh(Yt,jt(M,{USE_ANIM:1,SCULL:1},{gloss:.07,wetLine:d+.16,alb:1}),At);ht.frustumCulled=!1,ht.onBeforeRender=V.camL,w.add(ht);const ea=so(.5),da=new Float32Array([0,2,.1,0]);ea.setAttribute("iF",new t.InstancedBufferAttribute(da,4));const Ct=new t.InstancedMesh(ea,ht.material,1);Ct.frustumCulled=!1,Ct.onBeforeRender=V.camL,w.add(Ct);const ha=Y,vt=Y.at,Lt=Y.yaw,ta=[],Bt=l.sSplash+34,aa=y(Bt/X),Ht=aa.f.clone().multiplyScalar(.5).addScaledVector(aa.r,-.866),$t=aa.f,xa=2.6,oa=C((Bt-13)/X),ba=Math.atan2(Ht.x,Ht.z);for(let f=1;f<At;f++){let T=0,be=0,_e=f>=5,$=!1,we=0;for(let Le=0;Le<60&&!$;Le++)if(f===1){T=l.lip[0]+nt.range(10,30),be=l.lip[2]+nt.range(-10,8);const Ke=S.sample(T,be);$=Ke.kind===1&&Ke.dO>5&&Ke.lat>2.2,we=Math.PI/2+nt.range(-.9,.3)}else if(_e){T=nt.range(-10,75),be=nt.range(60,86);const Ke=S.sample(T,be);$=Ke.kind===2&&Ke.dI>2.5&&Ke.dI<7&&Ke.lat>12,we=nt.range(0,6.283)}else{T=f<4?nt.range(-66,-30):nt.range(50,110),be=f<4?nt.range(84,150):nt.range(34,54);const Ke=S.sample(T,be);$=Ke.kind===1&&Ke.dO>10&&Ke.dI>8,we=f<4?Math.PI+nt.range(-.5,.5):Math.PI/2+nt.range(-.5,.5)}ta.push({x:T,z:be,yaw:we,bask:_e,y:_e?S.height(T,be)+.1:d-.1,ph:nt()*6.283,size:nt.range(.9,1.12)})}for(let f=0;f<At;f++)ua.set([nt()*6.283,1.6+nt(),f>=5?0:.1,0],f*4);ta[0].size=1.16,await a.yield();const Ye=e.fork("hippos"),Tt=9,Wt=io(),n=new Float32Array(Tt*4);Wt.setAttribute("iH",new t.InstancedBufferAttribute(n,4));const k=new t.InstancedMesh(Wt,jo(M),Tt);k.frustumCulled=!1,k.onBeforeRender=V.camL,w.add(k);const G=io(!0),Z=new Float32Array(Tt*4);G.setAttribute("iH",new t.InstancedBufferAttribute(Z,4));const N=new t.InstancedMesh(G,k.material,Tt);N.frustumCulled=!1,N.onBeforeRender=V.camL,w.add(N);const q=ye.fH,A=[],ve=ye.at,ge=ye.sd,xe=ye.sr,fe=ye.yaw;A.push({x:ve.x,z:ve.z,yaw:fe,ph:0,size:1.5,sink:0,rest:.7,k:1});for(const[f,T,be,_e]of[[-1.5,4.8,.5,1.2],[3,-4.4,-1.9,1.25],[6.2,1.6,-.9,1.15]]){const $=ve.x+ge.x*f+xe.x*T,we=ve.z+ge.z*f+xe.z*T,Le=S.sample($,we);Le.kind===1&&Le.lat>=8&&A.push({x:$,z:we,yaw:fe+be,ph:1.2+A.length*2.1,size:_e,sink:.08,rest:.84,k:.9})}const Ae=A.length;for(let f=0;A.length<Tt&&f<300;f++){const T=ve.x+q.r.x*Ye.range(1,13)+q.f.x*Ye.range(-12,7),be=ve.z+q.r.z*Ye.range(1,13)+q.f.z*Ye.range(-12,7),_e=S.sample(T,be);_e.kind!==1||_e.lat<8.5||A.some($=>Math.hypot($.x-T,$.z-be)<3.4)||A.push({x:T,z:be,yaw:Ye()*6.283,ph:Ye()*6.283,size:Ye.range(.8,1.05),sink:Ye.range(.2,1),rest:Ye.range(.93,1),k:.55})}const Qe=A.length;for(k.count=Ae,N.count=Math.max(0,Qe-Ae);A.length<Tt;)A.push({x:ve.x,z:ve.z,yaw:0,ph:0,size:.001,sink:0,rest:1,k:0});A.forEach((f,T)=>{T<Ae?n[T*4+1]=f.ph+T*.37:Z[(T-Ae)*4+1]=f.ph+T*.37});const Ve=A.map((f,T)=>({x:f.x+Math.sin(f.yaw)*.45*f.size,z:f.z+Math.cos(f.yaw)*.45*f.size,size:(T?3.6:3.8)*f.size,ph:T*.377%1,k:f.k}));for(let f=0;f<30;f++){const T=y(pe(l.sWade-10,l.sBar,Ye())/X),be=Ye.range(-9,9),_e=T.p.x+T.r.x*be,$=T.p.z+T.r.z*be;S.height(_e,$)<d-.04&&Ve.push({x:_e,z:$,size:Ye.range(2.6,5),ph:10+Ye(),k:Ye.range(.6,.9)})}const Xe=Ho(M,Ve,d);Xe.mesh.onBeforeRender=V.camL,w.add(Xe.mesh);const et=A[Math.min(2,Qe-1)],ft=A[Math.min(3,Qe-1)];await a.yield();const Re=[],ne=(f,T)=>je.range(f,T),ke=y(J),De=ke.p.clone().addScaledVector(ke.f,2.2);De.y=d;for(let f=0;f<Math.round(170*h);f++){const T=ne(0,6.283),be=ne(.8,4.4),_e=ne(1,4.4);Re.push({p:[De.x+Math.cos(T)*be,d+.15,De.z+Math.sin(T)*be],v:[Math.cos(T)*_e+ke.f.x*3.5,ne(3.2,9.2),Math.sin(T)*_e+ke.f.z*3.5],life:ne(.8,1.25),s0:ne(.03,.06),s1:ne(.05,.11),ev:0,type:0})}for(let f=0;f<4;f++){const T=ne(-3.4,3.4),be=ne(2.5,6.5);Re.push({p:[De.x+ke.f.x*be+ke.r.x*T,d+.05,De.z+ke.f.z*be+ke.r.z*T],v:[ke.f.x*5.5,ne(.1,.35),ke.f.z*5.5],life:ne(1.1,1.5),s0:.45,s1:ne(.8,1.1),ev:0,type:1})}for(let f=0;f<9;f++){const T=(f%2?1:-1)*ne(1.6,4.2),be=ne(.5,6);Re.push({p:[De.x+ke.f.x*be+ke.r.x*T,d,De.z+ke.f.z*be+ke.r.z*T],v:[0,0,0],life:ne(1,1.3),s0:ne(.9,1.5),s1:ne(.55,1),ev:0,type:2})}const Ie=ha.f.clone().multiplyScalar(.83).addScaledVector(ha.r,.56).multiplyScalar(2.1);for(let f=0;f<34;f++){const T=ne(0,6.283),be=ne(1,4);Re.push({p:[vt.x+Ie.x*ne(.5,1.2)+Math.sin(Lt)*ne(-1,3),d+.1,vt.z+Ie.z*ne(.5,1.2)+Math.cos(Lt)*ne(-1,3)],v:[Math.cos(T)*be+Ie.x*.8,ne(3.5,7.5),Math.sin(T)*be+Ie.z*.8],life:ne(.8,1.3),s0:ne(.05,.1),s1:ne(.1,.2),ev:1,type:0})}for(let f=0;f<7;f++)Re.push({p:[vt.x+Ie.x+Math.sin(Lt)*ne(-2,4)+ne(-.6,.6),d,vt.z+Ie.z+Math.cos(Lt)*ne(-2,4)+ne(-.6,.6)],v:[0,0,0],life:ne(1.1,1.5),s0:ne(1.4,2.2),s1:ne(1.7,2.7),ev:1,type:2});for(let f=0;f<3;f++)Re.push({p:[vt.x+Ie.x+ne(-1.5,1.5),d+.4,vt.z+Ie.z+ne(-1.5,1.5)],v:[ne(-1,1),1.5,ne(-1,1)],life:1.6,s0:1.2,s1:3.2,ev:1,type:1});[[et,2],[ft,4]].forEach(([f,T])=>{const be=Math.sin(f.yaw),_e=Math.cos(f.yaw),$=f.x+be*1.7*f.size,we=f.z+_e*1.7*f.size,Le=d+(1.2-f.rest)*f.size;for(let Ke=0;Ke<6;Ke++)Re.push({p:[$+ne(-.12,.12),Le,we+ne(-.12,.12)],v:[be*ne(.5,1.5)+ne(-.4,.4),ne(1,2.3),_e*ne(.5,1.5)+ne(-.4,.4)],life:ne(1.3,2),s0:ne(.1,.16),s1:ne(.5,.9),ev:T,type:3});for(let Ke=0;Ke<14;Ke++)Re.push({p:[$,Le,we],v:[be*ne(.6,2.2)+ne(-.7,.7),ne(2.2,4.6),_e*ne(.6,2.2)+ne(-.7,.7)],life:ne(.6,1),s0:ne(.03,.05),s1:ne(.05,.09),ev:T,type:0})});{const f=A[0],T=Math.sin(f.yaw),be=Math.cos(f.yaw);for(let _e=0;_e<6;_e++){const $=ne(-1.6,2.6);Re.push({p:[f.x+T*$+ne(-.5,.5),d,f.z+be*$+ne(-.5,.5)],v:[0,0,0],life:ne(1,1.4),s0:ne(.8,1.3),s1:ne(.5,.9),ev:3,type:2})}for(let _e=0;_e<26;_e++){const $=ne(.6,3),we=ne(0,6.283),Le=ne(.4,1.8);Re.push({p:[f.x+T*$,d+ne(.3,1.2),f.z+be*$],v:[Math.cos(we)*Le+T,ne(1.5,4.2),Math.sin(we)*Le+be],life:ne(.7,1.1),s0:ne(.03,.06),s1:ne(.06,.11),ev:3,type:0})}for(let _e=0;_e<3;_e++)Re.push({p:[f.x+T*ne(0,2.4),d+.3,f.z+be*ne(0,2.4)],v:[ne(-.5,.5),1.2,ne(-.5,.5)],life:1.7,s0:.5,s1:1.7,ev:3,type:1})}const tt=Zo(M,Re);tt.mesh.onBeforeRender=V.camL,w.add(tt.mesh),await a.yield();const Oe=Qo(a,M,r);w.add(Oe.points,Oe.dome,Oe.glow),Oe.GU.uGlowC.value.copy(Te(r.gully)),await a.yield();const mt=(f,T)=>U.surfaceAt(f,T),Vt=await en(a,l,S,M,d,mt,r);await a.yield();const fa=await on(a,l,S,M,d,Vt,r);await a.yield();const Zt=await nn(a,l,M,fa);await a.yield();const za=await tn(a,l,S,M,d,mt,Vt,r,Zt.fringe);await a.yield();const pa=await an(a,l,S,M,d,mt,Vt,r,V.flanks);pa.mesh.onBeforeRender=V.camL,w.add(pa.mesh),await a.yield();for(const f of[Vt,fa,Zt,za])w.add(f.group),f.group.traverse(T=>{T.isMesh&&(T.onBeforeRender=V.camL)});const ro=sn(a,l,M);w.add(ro.mesh),await a.yield();let Qt=0;const Wa=l.tanAt(0,ee()).setY(0).normalize(),na=ee(),Va=Ka(Te(r.gully).lerp(Te("#fff0c8"),.4).multiplyScalar(1.2),.9),gt=ee(),Ia=new t.Vector2,Oa=C(Ua[0]),lo=2.5;O.uKeep.value.z=7,O.uPDen.value*=1.3;const Na=(f,T,be,_e)=>{const $=Ze(_e??0,0,1);$<=0&&(Qt+=f);const we=C($),Le=$*X;gt.setFromMatrixPosition(be.matrixWorld);const Ke=$<=0?Ze(-((gt.x-_.start.x)*Wa.x+(gt.z-_.start.z)*Wa.z),0,140):0;V.HU.uClock.value=we,V.HU.uSurge.value=T,V.HU.uPrev.value=-.5*Ke/l.v0,V.HU.uPrevF.value=Qt,V.HU.uPart.value.set($>0?ma($):1-u(3,24,Ke),$>.03&&$<.09?(ma($+.002)-ma($-.002))/Math.max(.001,l.timeAtU($+.002)-l.timeAtU($-.002)):0),M.setClock(we+Qt),B&&M.setCollapse(Ze((we-Oa)/lo,0,1),we-Oa),M.setKeepOut(gt.x,gt.z),M.update(f,T,be),gt.setFromMatrixPosition(be.matrixWorld),O.uCamL.value.copy(gt);const $e=u(l.sGully-16,l.sGully+34,Le)*(1-u(l.sLip-24,l.sLip-3,Le)),Ne=u(l.sGully+6,l.sLip-30,Le);w.fog.density=pe(r.fogK,r.gullyK*_o*pe(.6,1.16,Ne),$e),w.fog.color.copy(p).lerp(D,$e),Oe.DU.uDomeC.value.copy(w.fog.color).multiplyScalar(pe(1,1.04,$e)),Oe.DU.uDomeA.value=pe(.22,1,$e),Oe.DU.uDomeH.value=pe(0,.97,$e),Oe.DU.uDomeW.value=pe(.11,.3,$e),Oe.DU.uDomeL.value=$e,l.tanAt(Math.min(X,Le+34),na),na.y=.05,na.normalize(),Oe.DU.uCore.value.set(na.x,na.y,na.z,pe(.42,1,Ne)*$e),Oe.DU.uCoreC.value.copy(Va),O.uShade.value=$e,O.uRim.value=pe(1,3,$e)+.3*u(l.sSplash-4,l.sSplash+14,Le)*(1-u(l.sLand,l.sBar,Le));{const Pe=Math.min(X,Le+26);l.posAt(Pe,Oe.GU.uGlowP.value),Oe.GU.uGlowP.value.y+=1.2,l.tanAt(Math.min(X,Pe+8),Oe.GU.uGlowD.value),Oe.GU.uGlowD.value.y=0,Oe.GU.uGlowD.value.normalize(),Oe.GU.uGlowA.value=pe(.14,.34,Ne)*$e,Oe.GU.uGlowC.value.copy(Va)}Oe.dome.position.copy(gt),Oe.points.visible=!a.through,a.renderer.getDrawingBufferSize(Ia),Oe.AU.uPx.value=Ia.y,Oe.AU.uCam.value.copy(gt),Oe.AU.uAmt.value=pe(1,.3,u(l.sLip,l.sSplash,Le)*(1-u(l.sBar,l.sExit,Le))),I.update(f,T,be),s.update(f,T,be),U.update(f,T),j.update(T);{const Pe=l.oLine.near(gt.x,gt.z),Ce=l.iLine.near(gt.x,gt.z),at=Pe.side>0&&Ce.side<0?0:Math.min(Pe.d,Ce.d);x.x=g.ox+g.dx*(we+Qt),x.y=g.oz+g.dz*(we+Qt),x.w=b*pe(.3,1,u(88,115,at))}Q.update(f,T,be);for(let Pe=0;Pe<Ge;Pe++){const Ce=Kt[Pe];He.perch=0,ga(Ce,T,we,Qt,He),ga(Ce,T+.08,we+($>0?.08:0),Qt+($>0?0:.08),Dt);const at=Dt.x-He.x,Mt=Dt.y-He.y,wt=Dt.z-He.z,yt=Math.hypot(at,wt);qe.position.set(He.x,He.y,He.z),He.perch?qe.rotation.set(-1.05,Ce.d*6.283,0,"YXZ"):qe.rotation.set(-Math.atan2(Mt,Math.max(yt,.02))*.8,yt>1e-4?Math.atan2(at,wt):Ce.d*6.283,Ce.kind===0?Ce.c<.5?-.32:.32:.1*Math.sin(T*2+Ce.a*9),"YXZ"),qe.scale.setScalar(He.perch?.001:He.scale),qe.updateMatrix(),Ce.kind===1&&(st.setMatrixAt(Ce.k,qe.matrix),Je[Ce.k*4]=Ce.a*6.283,Je[Ce.k*4+1]=He.rate,Je[Ce.k*4+2]=He.amp,Je[Ce.k*4+3]=He.bias,qe.scale.setScalar(.001),qe.updateMatrix()),Me.setMatrixAt(Pe,qe.matrix),Ce.kind===1&&(qe.position.set(He.x,He.y+.12,He.z),qe.rotation.set(-1.14,Ce.d*6.283,0,"YXZ"),qe.scale.setScalar(He.perch?.95+.2*Ce.c:.001),qe.updateMatrix(),Se.setMatrixAt(Ce.k,qe.matrix)),Ee[Pe*4]=Ce.a*6.283,Ee[Pe*4+1]=He.rate,Ee[Pe*4+2]=He.amp,Ee[Pe*4+3]=He.bias}Me.instanceMatrix.needsUpdate=!0,Fe.attributes.iF.needsUpdate=!0,Se.instanceMatrix.needsUpdate=!0,st.instanceMatrix.needsUpdate=!0,ot.attributes.iF.needsUpdate=!0;for(let Pe=0;Pe<it.length;Pe++)it[Pe].rotation.z=.04*Math.sin(T*.7+Pe*2);{const Pe=we-le,Ce=u(0,.25,Pe)*(1-u(1,2.2,Pe)),at=4.2*u(0,.42,Pe)-1.2*u(1.6,3.4,Pe)-2.2,Mt=Ze(we-oa,-30,5.5),wt=Math.max(0,we-oa-5.5),yt=u(4,9,we-oa);qe.position.set(vt.x+Math.sin(Lt)*at,d-.2+.32*Ce,vt.z+Math.cos(Lt)*at),qe.position.y-=1.3*(1-u(-.5,0,Pe))+1.3*u(2.4,3.4,Pe),qe.rotation.set(-.1*Ce,Lt,.05*Ce,"YXZ"),qe.scale.setScalar(1.22),qe.updateMatrix(),Ct.setMatrixAt(0,qe.matrix),Ct.instanceMatrix.needsUpdate=!0,da[2]=.1+.3*Ce,da[1]=2+6*Ce,ea.attributes.iF.needsUpdate=!0,qe.position.copy(aa.p).addScaledVector(Ht,xa*Mt).addScaledVector($t,.8*wt),qe.position.y=d-.1+.015*Math.sin(T*.9),qe.rotation.set(0,ba+1.05*yt+.1*Math.sin(T*.6),0,"YXZ"),qe.scale.setScalar(1.12),qe.updateMatrix(),ht.setMatrixAt(0,qe.matrix);for(let Gt=1;Gt<At;Gt++){const ut=ta[Gt-1],_t=ut.bask?0:2.5*Math.sin(T*.07+ut.ph);qe.position.set(ut.x+Math.sin(ut.yaw)*_t,ut.y+(ut.bask?0:.02*Math.sin(T*.8+ut.ph)),ut.z+Math.cos(ut.yaw)*_t),qe.rotation.set(0,ut.yaw+(ut.bask?0:.12*Math.sin(T*.3+ut.ph)),0,"YXZ"),qe.scale.setScalar(ut.size),qe.updateMatrix(),ht.setMatrixAt(Gt,qe.matrix)}ht.instanceMatrix.needsUpdate=!0,Yt.attributes.iF.needsUpdate=!0}const It=u(ce-.9,ce+.15,we)*(1-u(de+.5,de+2,we)),sa=u(ce-.4,ce+1.1,we)*(1-u(de,de+1.5,we));for(let Pe=0;Pe<Tt;Pe++){const Ce=A[Pe],at=Pe?0:It,Mt=Math.max(0,Math.sin(T*.26+Ce.ph)),wt=Ce.sink*Mt*Mt;if(qe.position.set(Ce.x,d-Ce.rest*Ce.size+.46*at*Ce.size-.42*wt+.03*Math.sin(T*1.1+Ce.ph),Ce.z),qe.rotation.set(-.17*at-.02*Math.sin(T*.7+Ce.ph),Ce.yaw+.06*Math.sin(T*.33+Ce.ph)*(1-at),0,"YXZ"),qe.scale.setScalar(Ce.size),qe.updateMatrix(),Pe<Ae)k.setMatrixAt(Pe,qe.matrix),n[Pe*4]=Pe?0:sa,n[Pe*4+2]=Pe?.3:at,n[Pe*4+3]=Pe?.3:at;else{const yt=Pe-Ae;N.setMatrixAt(yt,qe.matrix),Z[yt*4]=0,Z[yt*4+2]=.3,Z[yt*4+3]=.12}Xe.iQ[Pe*2]=Ce.k*(1-.7*wt),Xe.iQ[Pe*2+1]=Pe?0:at*(1-.6*u(ce+1.5,ce+4,we))}k.instanceMatrix.needsUpdate=!0,Wt.attributes.iH.needsUpdate=!0,N.instanceMatrix.needsUpdate=!0,G.attributes.iH.needsUpdate=!0,Xe.attr.needsUpdate=!0,tt.ages[0]=we-oe,tt.ages[1]=we-le,tt.ages[2]=we-re,tt.ages[3]=we-ce+.75,tt.ages[4]=we-H};{const f=new t.PerspectiveCamera;f.position.copy(_.start),f.updateMatrixWorld(!0),Na(0,0,f,0)}return await a.yield(),await I.prewarm(a.renderer,null,w),{scene:w,path:_,duration:Ot,pace:l.paceAt,camera:{fov:62,near:.25,far:4200,lookAhead:17,sway:.7,bank:.2,nearThrough:.3},pois:R,portal:{shape:"circle",radius:6,color:"#ffe6b8",glow:.9,tilt:!0,revealDistance:150},post:{exposure:r.exposure,bloom:{strength:.3,radius:.6,threshold:.93},grade:{saturation:r.sat,contrast:1.05,tint:r.tint,shadowTint:r.shadow,vignette:.3,grain:.02,aberration:0}},ride:"none",update:Na,dispose(){I.dispose?.(),V.tex.dispose()}}}};export{dn as default};
