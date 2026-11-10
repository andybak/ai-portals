import*as e from"three";import{makePath as oa}from"../kit/core.js";import{makeSky as aa,skyDirection as sa}from"../kit/sky.js";import{makeHorizonRidges as na}from"../kit/terrain.js";import*as Ao from"../kit/fx.js";import*as Lt from"../kit/fauna.js";import{buildHero as ia,SAIGA_FLOW_GLSL as ra,CLOUD_GLSL as Xt,RIVER_GLSL as Mo}from"../parts/mammoth-midnight-sun.js";const C=u=>new e.Color(u),Xe=u=>Math.min(1,Math.max(0,u)),W=(u,d,I)=>{const P=Xe((I-u)/(d-u));return P*P*(3-2*P)},Ve=(u,d,I)=>u+(d-u)*I,gt=Math.PI*2,de=280,Gt=40,Ne=[4,30],Me=[20,44,15],tt=-Ne[0]-Me[2],la={rose:{palette:["#F2A28A","#F6C877","#7F86B5","#A8A46A","#B9C2B0","#3B2620","#F4D03A"],sunEl:3,sunAz:-12,sunCol:"#F6C877",sunI:2.2,skyCol:"#7F86B5",skyI:3.2,groundCol:"#C9B48A",groundI:2.2,zenith:"#6f78b4",mid:"#c9a0a8",horizon:"#F2A28A",scatter:"#ffc27a",fog:"#D9A898",fogAway:"#8C8AB0",fogD:.00125,loess:"#C9B48A",grassRoot:"#6f6a3c",grassTip:"#d8c886",dust:"#F6C877",water:"#f3b99a",hills:"#8C86B4",snow:"#e8b0a8",cirrus:{lit:"#ffc9a0",shade:"#a98aa6",coverage:.42},cloud:0,sunDisc:9,sunSize:1.5,glow:1,exposure:1,bloom:.35,shadowTint:"#10132c",tint:"#fff3ea",snowCoat:0,shadowLen:19,shadowOp:.5,hemi:1.25,key:2.2},noon:{palette:["#d9d2cf","#ffe0b0","#6f9bd6","#96a25c","#b0beae","#3B2620","#F4D03A"],sunEl:11,sunAz:-70,sunCol:"#ffd08a",sunI:3.2,skyCol:"#7fa6da",skyI:1.9,groundCol:"#C9B48A",groundI:1.6,zenith:"#1f4f9e",mid:"#5e8fd0",horizon:"#f0d8ac",scatter:"#ffd9a0",fog:"#d6cfb8",fogAway:"#a9bcd6",fogD:7e-4,loess:"#bfa066",grassRoot:"#56622e",grassTip:"#d4c96a",dust:"#f6dfb0",water:"#9fbde0",hills:"#7890ba",snow:"#f3efe8",cirrus:{lit:"#fff0d8",shade:"#9fb0cc",coverage:.2},cloud:1,sunDisc:12,sunSize:1.3,glow:.6,exposure:.96,bloom:.3,shadowTint:"#0a1026",tint:"#fff8ee",snowCoat:0,shadowLen:5.1,shadowOp:.92,shadowCol:[.32,.36,.58],saigaFill:.8,saigaExpo:.32,hemi:1,key:3.1,gain:1.3,troughC:"#4f5c2c",troughK:.62,contrast:1.1,sat:1.12,coatExpo:.68,coatFill:1.5},ochre:{palette:["#f0c690","#ffd596","#8fa3c6","#a88c4a","#a3aa9c","#3B2620","#d8b23a"],sunEl:8,sunAz:-96,sunCol:"#ffc88e",sunI:3.2,skyCol:"#8298c6",skyI:2.1,groundCol:"#c9a86a",groundI:2,zenith:"#24509e",mid:"#7896c8",horizon:"#f6c684",scatter:"#ffb25c",fog:"#e2bf8e",fogAway:"#9aa8c4",fogD:9e-4,loess:"#b3a482",grassRoot:"#5c5a30",grassTip:"#dcc072",dust:"#f8cf86",water:"#a9bcd8",hills:"#8088ae",snow:"#f4e6d4",cirrus:{lit:"#ffd9a4",shade:"#8088ae",coverage:.4},cloud:0,sunDisc:12,sunSize:1.4,glow:.85,exposure:.96,bloom:.36,shadowTint:"#141c3c",tint:"#fff2de",snowCoat:1,shadowLen:7,shadowOp:.92,shadowCol:[.3,.33,.58],saigaFill:.8,saigaExpo:.34,hemi:1.1,key:3.1,gain:1.2,troughC:"#465c2a",troughK:.78,contrast:1.1,sat:1.1,coatExpo:.72,coatFill:1.7}};var qa={id:"mammoth-midnight-sun",name:"The Saiga River",category:"prehistoric",weirdness:.05,media:["air","open"],async build(u){const d=u.rng,I=u.vary||{},P=u.quality?.detail??1,O=I.density??1,v=()=>u.yield(),ee=d(),Z=I.hour||"any",p=Z==="day"?"noon":Z==="golden"||Z==="dawn"?ee<.5?"ochre":"rose":Z==="night"||ee>=.5?"rose":ee>=.25?"noon":"ochre",s=la[p],V=d.chance(.33),he=d.int(20,60),j=!!I.rare,T=sa(s.sunEl,s.sunAz).normalize(),g=new e.Scene;g.fog=new e.FogExp2(C(s.fog),s.fogD);const m=await ia(u,{palette:s.palette,detail:P,ground:!1,saiga:360,swell:Ne,bluff:Me,duration:Gt,bullDistance:76,wakes:!0,sunDir:T.toArray(),sunIntensity:s.sunI,skyIntensity:s.skyI,groundIntensity:s.groundI,shadowOpacity:s.shadowOp,dust:p==="noon"?.2:.34,coatExposure:s.coatExpo??.62,coatFill:s.coatFill??1.15});m.setLight({sunDir:T,sunColor:C(s.sunCol),sunIntensity:s.sunI,sky:C(s.skyCol),skyIntensity:s.skyI,ground:C(s.groundCol),groundIntensity:s.groundI}),m.uniforms.uShadow.value.x=Math.min(s.shadowLen,m.uniforms.uShadow.value.x),m.uniforms.uDustCol.value.copy(C(s.dust)),m.uniforms.uDustLit.value=p==="rose"?0:.06,s.shadowCol&&m.uniforms.uShadowCol.value.set(...s.shadowCol),m.uniforms.uSaigaFill.value=s.saigaFill??1,m.uniforms.uSaigaExpo.value=s.saigaExpo??.27,g.add(m.object);const l=m.uniforms,c=m.anchors,S=t=>Math.atan2(t.x,de-t.z)*de,i=1.3*Gt;let n=S(c.gap)+i*.6-2;l.uLane.value.z=n,l.uCloud.value=s.cloud,l.uWidth.value.set(13,78,13.5),await v();const A=c.flyThrough,x=c.portalSeat.position.clone(),k=A[A.length-2].clone();{const t=x.clone().sub(k).setY(0).normalize().multiplyScalar(4);k.add(t),x.add(t)}const b=x.clone().sub(k).setY(0).normalize(),B=new e.Vector3(-b.z,0,b.x).multiplyScalar(-1);B.z<0&&B.multiplyScalar(-1);const H=k.clone().addScaledVector(b,-10),ne=72,re=ne+13,ze=12,Se=new e.Vector3,ke=new e.Vector3,oe=800;let pe=0,Le=0;const mt=t=>{n=t,l.uLane.value.z=t,Se.copy(m.arcPoint(t,63,0)),ke.set(Math.sin(t/de),0,-Math.cos(t/de)),pe=Se.x-ke.x*oe,Le=Se.z-ke.z*oe};mt(n);const ye=u.noise,ce=[10.4,10],Ee=t=>1.1*Math.sin(t*.21)+.7*Math.sin(t*.53+1.3),Ae=2.6,wt=t=>W(0,38,t)*(1-W(re+Ae,re+Ae+2.2,t)),ht=(t,o,r)=>{const a=t-H.x,z=o-H.z,y=a*b.x+z*b.z,F=a*B.x+z*B.z;if(r&&(r[0]=y,r[1]=F),y<-4||y>re+9||Math.abs(F)>26)return 0;const R=1.1*Math.sin(y*.21)+.7*Math.sin(y*.53+1.3),M=F>0?1-W(ce[0]+Ae+R*.5,ce[0]+Ae+1+R*.5,F):1-W(ce[1]+Ae+R*.6,ce[1]+Ae+1+R*.6,-F),w=wt(y),E=W(2.6,6,Math.abs(F-(2.4*Math.sin(y*.1)+1.3*Math.sin(y*.27+1)))),f=1-(.035*(.5+.5*Math.sin(y*.9+F*.7))+.045*(.5+.5*Math.sin(y*.37-F*1.3+2)))*W(.5,1,M)*E+.012*(1-E);return ze*w*M*f},fe=(t,o)=>{const r=o-de,a=Math.hypot(t,r)-de;let z=-Ne[0]*(1-Math.exp(-(a*a)/(Ne[1]*Ne[1])));const y=Math.hypot(t-pe,o-Le)-oe;if(y>-40||a>Me[0]-2){const F=Math.atan2(t,-r)*de,R=1-W(42,60,Math.abs(F-n)),M=3.5*ye.n2(t*.021,o*.021)+1.2*ye.n2(t*.09,o*.09),w=W(-2.5,6.5,y+M),E=W(Me[0],Me[0]+Me[1],a);let f=Me[2]*Ve(w,E,R);y>20&&(f+=-.5*W(.35,.6,.5+.5*ye.n2(t*.011+9,o*.03))*W(20,40,y)-9*W(430,520,y)-16*W(900,1500,y)),z-=f}return z-ht(t,o)};m.groundAt=fe;const xt=m.mammoths.find(t=>t.kind==="matriarch"),bt=m.mammoths.find(t=>t.kind==="tailBull"),qe=m.mammoths.filter(t=>t.kind==="cow"||t.kind==="young").reduce((t,o)=>o.a<t.a?o:t),le=(t,o,r)=>m.arcPoint(t,o,r),ot=l.uLane.value.x,Re=new e.Vector3,dt=S(c.gap),Ze=m.mammoths.find(t=>t.kind==="loneBull"),Vt=(t,o,r)=>m.arcPoint(Ze.a+t*de/(de+Ze.q),Ze.q+o,r),He=(t,o,r)=>{const a=m.arcPoint(Ze.a,Ze.q,0);return a.x+=t,a.z+=o,a.y=fe(a.x,a.z)+r,a},je=(t,o,r)=>{const a=m.arcPoint(t,o,0);return a.y=Math.max(r,fe(a.x,a.z)+4.6),a};let te=null,Ce=.26,ve=.52,Fe=.74,Ke=.8,Te=0,Zt=0;for(let t=0;t<5;t++){const o=xt.a+i*Ce,r=le(o+3,-12.5,3.6);Te=dt+i*ve,Zt=qe.a+i*Fe;const a=Math.max(44,Te-Zt),z=bt.a+i*Ke;mt(Te-30);const y=[He(50,16.5,5.2),He(36,10.5,4.3),He(22.5,4,3.4),He(11.5,-7.5,3),He(11.5,-22,3.3),le(o+15,-40,6.2),le(o+16,-22,4.7),r,le(o-15,-8.3,3.3)],F=Math.max(1,Math.round((o-15-(Te+22))/26));for(let f=1;f<F;f++)y.push(le(Ve(o-15,Te+22,f/F),f%2?-9.8:-8.3,f%2?3.6:2.6));const R=le(Te-3,1.5,5),M=le(Math.min(Te-44,z+19),17,3.6),w=le(z+2,10,3.4),E=Te-.55*a;y.push(le(Te+24,-10.5,7.2),le(Te+8,-8.2,6.4),R,je(Te-4,23,3),je(Te-7,45,.6),je(Te-22,60,-4),je(Te-32,49,-7.4),je(Te-32.5,31,-2),M,w,le(z-10,1.5,4.4),k.clone(),x.clone()),te=oa(y),Ce=te.nearestXZ(r.x,r.z).u,ve=te.nearestXZ(R.x,R.z).u,Fe=te.nearestXZ(M.x,M.z).u,Ke=te.nearestXZ(w.x,w.z).u,await v()}await v();const Nt=8,at=[];for(const[t,o,r]of[[28,2,7],[58,-6,10],[33,-20,7],[57,26,9],[38,-42,8],[70,6,12],[14,30,6.5],[62,-30,9]]){const a=He(t,o,0);Math.hypot(a.x,a.z-de)-de<-46&&at.length<Nt&&at.push(new e.Vector4(a.x,a.z,r,3+at.length*7.3))}for(;at.length<Nt;)at.push(new e.Vector4(0,9e3,1,0));const Jt=(t,o)=>{let r=9;for(const a of at)r=Math.min(r,Math.hypot(t-a.x,o-a.y)/a.z);return r},eo=(t,o,r,a,z)=>{const y=[];for(let w=t;w<=o+1e-6;w+=r)y.push(w);let F=r,R=t,M=y[y.length-1];for(;M-o<z;)F*=a,R-=F,M+=F,y.unshift(R),y.push(M);return y},ct=[0,0],to=async(t,o,r,a,z)=>{const y=new Float32Array(t*o*3),F=new Float32Array(t*o*3),R=new Float32Array(t*o*3),M=new Uint32Array((t-1)*(o-1)*6);let w=0;for(let L=0;L<o;L++){for(let Q=0;Q<t;Q++,w++){const[K,q]=r(Q,L),ie=fe(K,q),ge=fe(K+a,q)-fe(K-a,q),N=fe(K,q+a)-fe(K,q-a),J=1/Math.hypot(ge,2*a,N),_=ht(K,q,ct),me=z&&ct[0]>2&&ct[0]<re+4&&Math.abs(ct[1])<20;y[w*3]=K,y[w*3+1]=me?ie-40:ie,y[w*3+2]=q,F[w*3]=-ge*J,F[w*3+1]=2*a*J,F[w*3+2]=-N*J,R[w*3]=_,R[w*3+1]=ct[0],R[w*3+2]=ct[1]}L%2===1&&await v()}await v();let E=0;for(let L=0;L<o-1;L++)for(let Q=0;Q<t-1;Q++){const K=L*t+Q,q=K+1,ie=K+t,ge=ie+1;M[E++]=K,M[E++]=ie,M[E++]=q,M[E++]=q,M[E++]=ie,M[E++]=ge}const f=new e.BufferGeometry;return f.setAttribute("position",new e.BufferAttribute(y,3)),f.setAttribute("normal",new e.BufferAttribute(F,3)),f.setAttribute("aGully",new e.BufferAttribute(R,3)),f.setIndex(new e.BufferAttribute(M,1)),f.computeBoundingSphere(),f},oo=eo(-196,216,4,1.25,2600),ao=eo(-128,188,4,1.25,2600),Fo=await to(oo.length,ao.length,(t,o)=>[oo[t],ao[o]],1.2,!0);await v();const yt=1.25,Po=Math.round((re+16)/yt)+1,Do=Math.round(52/yt)+1,Lo=await to(Po,Do,(t,o)=>{const r=-6+t*yt,a=-26+o*yt;return[H.x+b.x*r+B.x*a,H.z+b.z*r+B.z*a]},.45,!1);await v();const Pe={value:0},Ge={...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:Pe,uSunDir:l.uSunDir,uSunCol:l.uSunCol,uSkyCol:l.uSkyCol,uArc:l.uArc,uLane:l.uLane,uWidth:l.uWidth,uStream:l.uStream,uLoess:{value:C(s.loess)},uGrass:{value:C(s.palette[3])},uSage:{value:C(s.palette[4])},uPoppy:{value:C(s.palette[6])},uSilt:{value:C("#3A2F2A")},uIce:{value:C("#5F7F8A")},uWater:{value:C(s.water)},uGravel:{value:C("#8f8674")},uWillow:{value:C(p==="ochre"?"#b89a2c":"#5f7038")},uRiver:{value:new e.Vector4(pe,Le,oe,tt)},uRamp:{value:new e.Vector4(n,Me[0],Me[1],ze)},uGain:{value:s.gain??(p==="noon"?1.45:1)},uCloud:l.uCloud,uTroughC:{value:C(s.troughC??(p==="noon"?"#5a643a":"#5f7038"))},uTroughK:{value:s.troughK??(p==="noon"?.46:.38)},uLow:{value:W(20,4,s.sunEl)},uRose:{value:C(s.palette[0])},uPond:{value:at},uPondDeep:{value:C(s.zenith).multiplyScalar(.55)},uSkyHor:{value:C(s.horizon)},uSkyZen:{value:C(s.zenith)},uScatC:{value:C(s.scatter)},uCirLit:{value:C(s.cirrus.lit)},uRiverW:l.uRiverW,uBarBox:l.uBarBox,uBarTex:l.uBarTex},so=new e.ShaderMaterial({uniforms:Ge,defines:{NP:Nt},vertexShader:ua,fragmentShader:ha,fog:!0,side:e.DoubleSide}),St=new e.Mesh(Fo,so),It=new e.Mesh(Lo,so);St.renderOrder=-.5,It.renderOrder=-.5,St.frustumCulled=!1,St.name="ground-main",It.name="ground-patch",g.add(St,It),await v();{const t=[],o=[],r=[],a=d.fork("lip"),z=C(s.palette[3]).lerp(C(s.loess),.2),y=C(s.grassRoot).multiplyScalar(.8),F=C("#8a6e50"),R=C("#66503c"),M=C("#6e5740"),w=(N,J,_,me)=>{t.push(N[0],N[1],N[2]),o.push(J.r,J.g,J.b),r.push(_,me)},E=(N,J,_)=>{w(...N),w(...J),w(..._)},f=(N,J,_,me)=>{E(N,J,_),E(N,_,me)},L=(N,J,_)=>[H.x+b.x*N+B.x*J,_,H.z+b.z*N+B.z*J],Q=(N,J)=>{let _=null,me=.5;for(let Be=0;Be<=N;Be++){const D=J(Be),X=D.k,h=fe(...L(D.o[0],D.o[1],0).filter((U,ae)=>ae!==1));me=me*.72+a()*.28;const G=(.3+.55*me)*X,$=.1+.12*a(),Y={A:L(D.o[0],D.o[1],h+.07),B:L(D.e[0],D.e[1],h-$*X),C:L(D.e[0]+D.n[0]*.18,D.e[1]+D.n[1]*.18,h-$*X-G),M:L(D.e[0]+D.n[0]*.9,D.e[1]+D.n[1]*.9,h+.07),k:X,tint:.75+.5*a()};if(_&&(X>.05||_.k>.05)){const U=z.clone().multiplyScalar(_.tint),ae=z.clone().multiplyScalar(Y.tint);f([_.A,U,0,1],[Y.A,ae,0,1],[Y.M,ae,0,1],[_.M,U,0,1]),f([_.M,U,0,1],[Y.M,ae,0,1],[Y.B,y,0,.7],[_.B,y,0,.7]),f([_.B,F,0,.1],[Y.B,F,0,.1],[Y.C,R,.25,0],[_.C,R,.25,0]);const se=X>.4?1+(a()<.6?1:0):0;for(let We=0;We<se;We++){const we=a(),xe=(.5+1.9*a()*a())*X,be=.03+.03*a(),ue=Y.B.map((Ie,Ue)=>_.B[Ue]+(Ie-_.B[Ue])*we),Qe=Y.B.map((Ie,Ue)=>(Ie-_.B[Ue])*be/.9),De=[ue[0]+D.n2[0]*.25*(a()-.3),ue[1]-xe,ue[2]+D.n2[1]*.25*(a()-.3)];E([[ue[0]-Qe[0],ue[1]+.02,ue[2]-Qe[2]],M,0,.35],[[ue[0]+Qe[0],ue[1]+.02,ue[2]+Qe[2]],M,0,.35],[De,M,1,.3])}}_=Y}},K=N=>W(1,4,ze*W(0,38,N)),q=(N,J)=>{const _=L(N,J,0);return[_[0]-H.x,_[2]-H.z]};for(const N of[1,-1]){const J=N>0?ce[0]+1:ce[1]+1,_=N>0?.5:.6,me=Math.round((re+2)/.9);Q(me,Be=>{const D=1+Be*.9,X=J+Ee(D)*_,h=.45+.7*a();return{o:[D,N*(X+Ae+1.4)],e:[D,N*(X-h)],n:[0,N*1],n2:q(0,-N),k:K(D)}}),await v()}{const N=-(ce[1]+Ae+2.4),J=ce[0]+Ae+2.4,_=Math.round((J-N)/.9),me=re+2.2;Q(_,Be=>{const D=N+(J-N)*Be/_,X=.45+.7*a();return{o:[me+Ae+1.4,D],e:[me-X,D],n:[1,0],n2:q(-1,0),k:1}})}const ie=new e.BufferGeometry;ie.setAttribute("position",new e.Float32BufferAttribute(t,3)),ie.setAttribute("aCol",new e.Float32BufferAttribute(o,3)),ie.setAttribute("aSway",new e.Float32BufferAttribute(r,2)),ie.computeBoundingSphere();const ge=new e.Mesh(ie,new e.ShaderMaterial({uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:Pe,uSunDir:l.uSunDir,uSunCol:l.uSunCol,uSkyCol:l.uSkyCol,uLow:Ge.uLow,uGain:Ge.uGain},vertexShader:pa,fragmentShader:va,fog:!0,side:e.DoubleSide}));ge.name="gully-lip",g.add(ge)}await v();let no=null,kt=null,io=null;{const t=[],o=[],r=[],a=[],z=[],R=(h,G)=>{const $=Math.sin(h*127.1+G*311.7)*43758.5453;return $-Math.floor($)},M={1:[],[-1]:[]};for(const h of[1,-1])for(let G=0;G<7;G++){const $=h>0?0:7;R(G+$,1)<.84&&M[h].push([15.5+G*10.4+3.2*(R(G+$,2)-.5),1.3+.5*R(G+$,3),.5+.18*R(G+$,4),(G+$+1)/16])}const w=h=>h[0]+(Math.round(h[3]*16)%2?1:-1)*h[1]*(1+.25*(h[3]*16*.37%1)),E=(h,G)=>{let $=99;if(h)for(const Y of M[h])$=Math.min($,Math.abs(G-w(Y)));return $},f=[],L=(h,G)=>{let $=null,Y=99;if(h)for(const U of M[h]){const ae=Math.abs(G-U[0]);ae<Y&&(Y=ae,$=U)}return $?[Y,$[1],$[2],$[3]]:[99,0,.4,0]},Q=(h,G)=>{const $=t.length/3;for(let Y=0;Y<=h;Y++){const U=G(Y);for(let ae=0;ae<=9;ae++){const se=ae/9,We=W(.7,1,se),we=.16*ye.n2(U.along*.7+40,se*5)+.1*ye.n2(U.along*2.1,se*13+9),xe=(1*se+2.2*We*We)*Math.min(1,U.depth/5)+we*Math.min(1,U.depth/3)-.9;t.push(U.x+U.nx*xe,U.top-.05-se*(U.depth+.35),U.z+U.nz*xe),o.push(U.along,se*(U.depth+.35),U.depth),r.push(U.nx,U.nz),a.push(...U.wf),f.push(U.fx)}}for(let Y=0;Y<h;Y++)for(let U=0;U<9;U++){const ae=$+Y*10+U,se=ae+9+1;z.push(ae,se,ae+1,ae+1,se,se+1)}},K=(h,G)=>[H.x+b.x*h+B.x*G,H.z+b.z*h+B.z*G];for(const h of[1,-1]){const G=h>0?ce[0]:ce[1],$=h>0?.5:.6,Y=7.3,U=Math.round((re+1.5-(Y-1))/.7);Q(U,ae=>{const se=Y+ae*.7,We=h*(G+1+Ee(se)*$),[we,xe]=K(se,We),[be,ue]=K(se,We+h*(Ae+1.8));return{x:we,z:xe,nx:-h*B.x,nz:-h*B.z,along:se+(h>0?0:300),depth:ze*W(0,38,se),top:fe(be,ue),wf:L(h,se),fx:E(h,se)}}),await v()}{const h=-(ce[1]+2.5),G=ce[0]+2.5,$=Math.round((G-h)/.7),Y=re+2.2;Q($,U=>{const ae=h+(G-h)*U/$,[se,We]=K(Y,ae),[we,xe]=K(Y+Ae+3.6,ae);return{x:se,z:We,nx:-b.x,nz:-b.z,along:ae+600,depth:ze,top:fe(we,xe),wf:L(0,0),fx:99}})}const q=new e.BufferGeometry;q.setAttribute("position",new e.Float32BufferAttribute(t,3)),q.setAttribute("aW",new e.Float32BufferAttribute(o,3)),q.setAttribute("aWN",new e.Float32BufferAttribute(r,2)),q.setAttribute("aWf",new e.Float32BufferAttribute(a,4)),q.setAttribute("aWx",new e.Float32BufferAttribute(f,1)),q.setIndex(z),q.computeBoundingSphere();const ie=Math.max(.05,Math.hypot(T.x,T.z)),ge=new e.Mesh(q,new e.ShaderMaterial({uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:Pe,uSunDir:l.uSunDir,uSunCol:l.uSunCol,uSkyCol:l.uSkyCol,uGain:Ge.uGain,uLow:Ge.uLow,uSilt:Ge.uSilt,uIce:Ge.uIce,uLoess:Ge.uLoess,uLitD:{value:Math.min(3.4,Math.max(2.2,20*T.y/ie))}},vertexShader:ga,fragmentShader:wa,fog:!0,side:e.DoubleSide}));ge.name="gully-walls",g.add(ge),io=ge.material.uniforms,await v();const N=[],J=[],_=[],me=10,Be=8;no={1:M[1].map(h=>[w(h),h]),[-1]:M[-1].map(h=>[w(h),h])},kt=(h,G,$,Y)=>{const U=h>0?ce[0]:ce[1],ae=h>0?.5:.6,se=h*(U+1+Ee(G)*ae),[We,we]=K(G,se),[xe,be]=K(G,se+h*(Ae+1.8)),ue=ze*W(0,38,G),Qe=fe(xe,be),De=$/(ue+.35),Ie=W(.7,1,De),Ue=.16*ye.n2((G+(h>0?0:300))*.7+40,De*5)+.1*ye.n2((G+(h>0?0:300))*2.1,De*13+9),$e=(1*De+2.2*Ie*Ie)*Math.min(1,ue/5)+Ue*Math.min(1,ue/3)-.9;return{x:We-h*B.x*($e+Y),y:Qe-.05-$,z:we-h*B.z*($e+Y),depth:ue,nx:-h*B.x,nz:-h*B.z}};for(const h of[1,-1])for(const[G,$,Y,U]of M[h]){const ae=h>0?ce[0]:ce[1],se=h>0?.5:.6,We=N.length/3;for(let we=0;we<=me;we++)for(let xe=0;xe<=Be;xe++){const be=-1+2*xe/Be,ue=ze*W(0,38,G),Qe=Math.max(.5,ue*Y),De=.3+(Qe+.2)*we/me,Ie=Xe(1-(De-.45)/Qe),Ue=Math.max(.03,$*Math.pow(Ie,.6)*1.08-.13+.11*ye.n2(U*73,De*1.3))*1.08,$e=G+be*Ue,bo=h*(ae+1+Ee($e)*se),[Yo,Qo]=K($e,bo),[$o,Xo]=K($e,bo+h*(Ae+1.8)),$t=ze*W(0,38,$e),Zo=fe($o,Xo),Dt=De/($t+.35),yo=W(.7,1,Dt),Jo=.16*ye.n2(($e+(h>0?0:300))*.7+40,Dt*5)+.1*ye.n2(($e+(h>0?0:300))*2.1,Dt*13+9),So=(1*Dt+2.2*yo*yo)*Math.min(1,$t/5)+Jo*Math.min(1,$t/3)-.9,ea=Math.sqrt(Math.max(0,1-be*be*.97)),ta=.06*Math.sin(xe*2.4+U*60+we*.5)+.09*ye.n2(be*2.2+U*31,De*.9),ko=-.25+(.25+.42*Math.pow(Ie,.7)+ta*(.5+.9*Ie))*ea*W(-.02,.16,we/me)*Math.min(1,Ue/.3);N.push(Yo-h*B.x*(So+ko),Zo-.05-De,Qo-h*B.z*(So+ko)),J.push(be*Ue,De,Ie,U)}for(let we=0;we<me;we++)for(let xe=0;xe<Be;xe++){const be=We+we*(Be+1)+xe,ue=be+Be+1;h>0?_.push(be,ue,be+1,be+1,ue,ue+1):_.push(be,be+1,ue,be+1,ue+1,ue)}}const D=new e.BufferGeometry;D.setAttribute("position",new e.Float32BufferAttribute(N,3)),D.setAttribute("aI",new e.Float32BufferAttribute(J,4)),D.setIndex(_),D.computeVertexNormals(),D.computeBoundingSphere();const X=new e.Mesh(D,new e.ShaderMaterial({uniforms:{...ge.material.uniforms},vertexShader:xa,fragmentShader:ba,fog:!0,side:e.DoubleSide}));X.name="ice-wedges",g.add(X)}await v();const At=aa({rng:d,preset:p==="noon"?"day":"sunset",zenith:s.zenith,mid:s.mid,horizon:s.horizon,ground:s.fogAway,horizonPow:p==="rose"?2.6:4.5,midPow:p==="rose"?1.3:1.6,sunElevation:s.sunEl,sunAzimuth:s.sunAz,sunColor:s.sunCol,sunSize:s.sunSize,sunIntensity:s.sunDisc,stars:0,sunGlow:s.glow,sunGlowTight:.35,scatterColor:s.scatter,scatter:p==="noon"?.28:p==="ochre"?.55:.5,scatterPow:p==="ochre"?3.5:3,scatterHigh:.1,clouds:s.cloud>0?{coverage:.3,lit:"#ffffff",shade:"#8fa2c4",scale:1.2}:!1,clouds2:{coverage:s.cirrus.coverage,stretch:1,lit:s.cirrus.lit,shade:s.cirrus.shade,scale:.8,wind:[.006,.001],haze:.1},fogColor:s.fog,lightElevationMin:8});g.add(At.object),await v();const st=new e.Mesh(Da(d.fork("bars"),s.sunAz),new e.ShaderMaterial({uniforms:{uTime:Pe,uLit:{value:C(s.cirrus.lit).multiplyScalar(p==="rose"?1.15:1)},uShade:{value:C(s.cirrus.shade)},uAlpha:{value:p==="rose"?.9:p==="ochre"?.6:.5}},vertexShader:La,fragmentShader:Ga,transparent:!0,depthWrite:!1,side:e.DoubleSide}));st.renderOrder=-.9,st.frustumCulled=!1,g.add(st);const ro=na({rng:d.fork("ridges"),layers:3,radius:[2500,3500],height:[45,150],base:-40,jagged:.22,coverage:.8,colorNear:s.hills,fog:g.fog,sunDir:T,sunColor:s.sunCol,sunIntensity:.7,snow:s.snow,snowLine:.5,rim:.35});g.add(ro.object),await v();const lo=(t,o)=>Math.hypot(t-pe,o-Le)-oe<-5&&ht(t,o)<.3&&fe(t,o)>-Ne[0]*(1-Math.exp(-((Math.hypot(t,o-de)-de)**2)/(Ne[1]*Ne[1])))-.5?1:0,Go=(t,o)=>(Jt(t,o)<.93?0:1)*lo(t,o)*(.3+.7*W(-.3,.2,ye.n2(t*.07,o*.07))),Et=await Co({rng:d.fork("grass"),path:te,land:fe,keep:Go,noise:ye,pause:v,count:Math.round(13e3*P*Math.min(1.15,O)),radius:38,bias:1.8,blades:4,shadow:{uShadowCol:l.uShadowCol,uShOp:{value:p==="rose"?.55:.8}},uniforms:{uTime:Pe,uSunDir:l.uSunDir,uSunCol:l.uSunCol,uSkyCol:l.uSkyCol,uLow:Ge.uLow,uCloud:Ge.uCloud,uFade:{value:new e.Vector3(70,105,0)},uWind:{value:new e.Vector2(.5,.866)},uArc:l.uArc,uShLen:{value:Math.min(s.shadowLen,5.5)},uRoot:{value:C(s.grassRoot)},uTip:{value:C(s.grassTip)},uSageC:{value:C(s.palette[4])}}});g.add(Et.object,Et.shadow),await v();const Vo=await Co({rng:d.fork("flowers"),path:te,land:fe,noise:ye,pause:v,count:Math.round(2300*P*O),radius:26,bias:1.7,geometry:ma(),keep:(t,o)=>(Jt(t,o)<1.12?0:1)*lo(t,o)*W(-.15,.4,ye.n2(t*.045+31,o*.045)),flowers:[s.palette[6],s.palette[6],"#efe6c8",s.palette[6],"#8d6cc4","#8d6cc4"].map(C),yaw:Math.atan2(-T.x,T.z),uniforms:Et.material.uniforms});g.add(Vo.object),await v();const _t=Ao.makeParticles({rng:d.fork("motes"),preset:"pollen",time:Pe,count:Math.round(700*P),box:[46,3,46],follow:"xz",center:[0,-.6,0],size:[.03,.07],colors:[s.dust,"#f4dcb0",s.palette[0]],intensity:p==="rose"?.6:.5,opacity:.7});g.add(_t.object),await v();const nt=new e.Sphere(new e.Vector3(40,-5,-60),560),Mt=m.makeSaigaTier({count:150,lod:"near",qFrom:-186,qTo:-128,bias:1});g.add(Mt,Mt.userData.shadow),await v();const Ut=m.makeSaigaTier({count:Math.round(760*P),lod:"far",qFrom:-236,qTo:-36,bounds:nt,bias:1,nearFade:[12,22]});Ut.userData.shadow.geometry.boundingSphere=nt,g.add(Ut,Ut.userData.shadow),await v();const uo=m.makeSaigaTier({count:Math.round(330*P),lod:"mid",qFrom:-70,qTo:44,bounds:nt,bias:1});g.add(uo,uo.userData.shadow),await v();const zt=m.makeSaigaTier({count:Math.round(830*P),lod:"far",qFrom:14,qTo:150,bounds:nt,bias:1,wake:!0});zt.userData.shadow.geometry.boundingSphere=nt,g.add(zt,zt.userData.shadow,zt.userData.wake),await v();const Ct=m.object.children.find(t=>t.userData&&t.userData.uWrap),pt=new e.Vector3,Tt=new e.Vector4(140,480,-1e5,1e5),ho={value:[-1e5,-1e5,-1e5,-1e5,-1e5,-1e5]};{const t=Math.round(2e3*P),o=new Float32Array(t*4),r=d.fork("fords");for(let R=0;R<t;R++)o.set([r.range(-1,1),r(),r.range(.85,1.15),r()],R*4);const a=new e.InstancedBufferGeometry,z=new e.PlaneGeometry(1,1);a.setAttribute("position",z.getAttribute("position")),a.setIndex(z.getIndex()),a.setAttribute("iA",new e.InstancedBufferAttribute(o,4)),a.instanceCount=t,a.boundingSphere=nt;const y=new e.ShaderMaterial({uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),...l,uQ:{value:Tt},uCoat:{value:C("#b89a70")},uRiverY:{value:tt},uNearQ:ho},defines:{NM:m.NM},vertexShader:Ma,fragmentShader:za,fog:!0,side:e.DoubleSide}),F=new e.Mesh(a,y);F.name="fords",g.add(F)}await v();const co=m.arcPoint(n+44,96,0),Ot=Ao.makeMist({rng:d.fork("fall"),time:Pe,count:Math.round(46*P),area:[60,12,100],center:[co.x,tt+7,co.z],size:[13,26],color:C(s.dust).multiplyScalar(p==="rose"?.82:.7),opacity:.07,drift:[.5,0,.25],flatten:.6,floorFade:1});Ot.object.visible=!1,g.add(Ot.object),await v();const qt={...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:Pe,uSunDir:l.uSunDir,uSunCol:l.uSunCol,uSkyCol:l.uSkyCol,uArc:l.uArc,uDust:{value:C(s.dust).lerp(C("#fff6ea"),p==="rose"?.25:.5)},uShade:{value:C(s.fogAway).lerp(C(s.palette[0]),.35)},uRampP:{value:new e.Vector4(n+36,Me[0],Me[1],Me[2])},uPlume:{value:1},uAlpha:{value:.94},uSoft:{value:0},uSwellH:{value:Ne[0]},uPl:{value:new e.Vector4(0,0,1,1)}};{const t=Math.round(70*P),o=new Float32Array(t*4),r=new Float32Array(t*4),a=d.fork("plume");for(let M=0;M<t;M++)o.set([a.range(-1,1),a(),a.range(5.5,10),a()],M*4),r.set([a.range(.04,.065),a(),a(),a()],M*4);const z=new e.InstancedBufferGeometry,y=new e.PlaneGeometry(2,2);z.setAttribute("position",y.getAttribute("position")),z.setIndex(y.getIndex()),z.setAttribute("iA",new e.InstancedBufferAttribute(o,4)),z.setAttribute("iB",new e.InstancedBufferAttribute(r,4)),z.instanceCount=t,z.boundingSphere=nt;const F=new e.Mesh(z,new e.ShaderMaterial({uniforms:qt,vertexShader:To,fragmentShader:Bo,transparent:!0,depthWrite:!1,fog:!0}));F.name="plume",F.renderOrder=2.5,g.add(F);const R=new e.Mesh(z,new e.ShaderMaterial({uniforms:{...qt,uRampP:{value:new e.Vector4(n-156,100,24,Me[2])},uPl:{value:new e.Vector4(1,tt,2.6,2.1)},uAlpha:{value:p==="rose"?.72:.9},uSoft:{value:1}},vertexShader:To,fragmentShader:Bo,transparent:!0,depthWrite:!1,fog:!0}));R.name="plume-bars",R.renderOrder=2.4,g.add(R)}await v();const it=[new e.Vector3,new e.Vector3,new e.Vector3,new e.Vector3],No=m.arcPoint(n+9,108,0).setY(tt+1),Io=m.mammoths.filter(t=>t.kind==="cow"||t.kind==="young").reduce((t,o)=>Math.abs(o.a-(dt-15))<Math.abs(t.a-(dt-15))?o:t),Eo=t=>(o,r)=>(te.pointAt(r,Re),m.arcPoint(S(Re)-11,.3,2.2,it[t])),vt=[{at:c.loneBull.clone().setY(-1.4),from:0,to:.115,weight:.85},{at:(t,o)=>m.positionAt(xt,o,it[0]).setY(2.3),from:.125,to:Ce+.07,weight:.85},{at:Eo(1),from:Ce+.05,to:ve-.075,weight:.64},{at:(t,o)=>m.positionAt(Io,o,it[1]).setY(1.9),from:ve-.07,to:ve-.004,weight:.6},{at:No,from:ve-.012,to:ve+.1,weight:.6},{at:(t,o)=>(te.pointAt(o,Re),m.arcPoint(S(Re)-12,0,1.6,it[2])),from:ve+.2,to:Fe-.01,weight:.6},{at:m.arcPoint(n-168,129,0).setY(tt+18),from:ve+.045,to:ve+.205,weight:.85},{at:(t,o)=>m.positionAt(bt,o,it[3]).setY(2.6),from:Fe-.005,to:Ke+.012,weight:.6}],fo=Ro(),Ht=(t,o)=>new e.ShaderMaterial({uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uSunDir:l.uSunDir,uSunCol:l.uSunCol,uSkyCol:l.uSkyCol,uTime:Pe,uFlap:{value:0},uAmp:{value:1},uBias:{value:t},uSweep:{value:o}},vertexShader:Ta,fragmentShader:Ba,fog:!0,side:e.DoubleSide}),Je=new e.Group;Je.name="rider",Je.matrixAutoUpdate=!1;const mo=Ht(0,0),ft=new e.Mesh(Ro(!1),mo);ft.scale.setScalar(1.9),ft.rotation.y=Math.PI,ft.position.set(0,-.86,-.55),ft.frustumCulled=!1,Je.add(ft);const _o=[-1,1].map(t=>{const o=new e.Mesh(Ca(t),mo);return o.position.set(t*1.75,-1.02,-1.4),o.rotation.order="YXZ",o.frustumCulled=!1,o.userData.side=t,Je.add(o),o});g.add(Je);const po=Ht(.2,.22),Bt=new e.Mesh(fo,po);Bt.matrixAutoUpdate=!1,Bt.frustumCulled=!1,g.add(Bt);const vo=Ht(.2,.22),Rt=new e.Mesh(fo,vo);Rt.matrixAutoUpdate=!1,Rt.frustumCulled=!1,g.add(Rt);const Uo=[{mesh:Bt,mat:po,ahead:11.5,lat:3.8,up:1.7,ph:2,bank:0,rolls:1},{mesh:Rt,mat:vo,ahead:18,lat:-5.2,up:2.9,ph:4.4,bank:0,rolls:0}],Wt=new e.Vector3,rt=new e.Vector3,_e=new e.Vector3,Ft=new e.Vector3,Oo=new e.Vector3(1.35,1.35,1.35),qo=new e.Vector3(0,1,0);await v();const Ho={...Lt.HERD_PRESETS.horse,h:1.3,bodyLen:1.08,width:.43,depth:.6,leg:[.1,.06,.042],neckLen:.5,neck:[.33,.2],headLen:.54,headR:.125,mane:.75,chest:1.2},go=Lt.makeFauna(g,{light:{sunDir:T,sunColor:C(s.sunCol),sunIntensity:s.key*.5,sky:C(s.skyCol),skyIntensity:s.hemi*.95,ground:C(s.groundCol),groundIntensity:s.hemi*.8}}),Ye=V?null:go.add(Lt.makeHerd({rng:d.fork("horses"),preset:Ho,count:Math.round(he*.62),mode:"migrate",gait:"run",speed:2.62,heightAt:fe,spread:[5,36],cross:{path:te,u:.125,lead:5.5,offset:-39.5,side:-1,angle:25,span:120,height:0,bow:15,duration:Gt},coat:"#a98a5c",belly:"#cdb48a",legs:"#4a382c",sock:"#30251d",accent:"#2c221a",pattern:"none",fill:.5,tints:["#ffffff","#f2e6d4","#fff4e0","#e6d8c4"]}),{always:!0});await v();const wo=(t,o,r)=>new e.ShaderMaterial({uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uSunDir:l.uSunDir,uSunCol:l.uSunCol,uSkyCol:l.uSkyCol,uGroundCol:l.uGroundCol,uTime:Pe,uGait:{value:0},uMove:{value:0},uRise:{value:1},uSeed:{value:r},uExpo:{value:t},uShag:{value:o}},vertexShader:Fa,fragmentShader:Pa,fog:!0,side:e.DoubleSide}),et=[],lt=[],ut=new e.Vector3,jt=new e.Vector3,Pt=[0,0];if(j){const t=Wo(Ra),o=te.pointAt(.185),r=te.tangentAt(.185),a=te.pointAt(.12);[[7.3,2.6,1.08,1.3],[10.2,-2.8,1,4.1]].forEach(([z,y,F,R])=>{const M=new e.Mesh(t,wo(.2,.45,R)),w=o.x+r.z*z+r.x*y,E=o.z-r.x*z+r.z*y;M.position.set(w,fe(w,E),E),M.rotation.y=Math.atan2(a.x-w,a.z-E)+(R-2.5)*.08,M.scale.setScalar(F),M.frustumCulled=!1,g.add(M),et.push(M),Pt[0]+=S(M.position)/2,Pt[1]+=(Math.hypot(w,E-de)-de)/2}),await v()}if(V){const t=Wo(Wa),o=te.posAtDist(76),r=te.tangentAtDist(76),a=j?14:9.5,z=.12;jt.set(o.x+r.z*a,0,o.z-r.x*a),ut.set(r.x*Math.cos(z)+r.z*Math.sin(z),0,r.z*Math.cos(z)-r.x*Math.sin(z)).normalize(),[[0,0,1,.7],[-5.5,4.6,.9,3.3]].forEach(([y,F,R,M])=>{const w=new e.Mesh(t,wo(.42,1,M));w.scale.setScalar(R),w.rotation.y=Math.atan2(ut.x,ut.z),w.frustumCulled=!1,w.userData={back:y,left:F},g.add(w),lt.push(w)}),await v()}et.length?(vt[1].from=.185,vt.push({at:et[0].position.clone().lerp(et[1].position,.5).add(new e.Vector3(0,1,0)),from:.085,to:.185,weight:.6})):Ye?vt.push({at:(t,o)=>Ye.positionAt(t,o,it[0]).setY(-2.8),from:.095,to:.15,weight:.3}):lt.length&&vt.push({at:(t,o)=>it[0].copy(lt[0].position).setY(lt[0].position.y+1.2),from:.1,to:.17,weight:.4});let xo=0,Kt=0;const Yt=[];Ye&&Ye.object.traverse(t=>{t.material&&t.material.uniforms&&t.material.uniforms.uVis&&Yt.push(t.material.uniforms.uVis)}),l.uSnow.value=s.snowCoat;const Qt=t=>u.core.makeRng(u.core.hashSeed(t+":"+u.seed));{const t=w=>-Ne[0]*(1-Math.exp(-(w*w)/(Ne[1]*Ne[1])))-Me[2]*W(Me[0],Me[0]+Me[1],w);let o=1e9,r=-1e9,a=1e9,z=-1e9;for(let w=-200;w<=200;w+=25)for(const E of[56,200,350,500]){const f=m.arcPoint(n+w,E,0);o=Math.min(o,f.x),r=Math.max(r,f.x),a=Math.min(a,f.z),z=Math.max(z,f.z)}const y=Math.min(256,Math.ceil((r-o)/3)),F=Math.min(256,Math.ceil((z-a)/3)),R=new Uint8Array(y*F*4);for(let w=0;w<F;w++){const E=a+(w+.5)/F*(z-a);for(let f=0;f<y;f++){const L=o+(f+.5)/y*(r-o),Q=Math.hypot(L,E-de)-de,K=Math.round(255*Xe((fe(L,E)-t(Q))/.75)),q=(w*y+f)*4;R[q]=K,R[q+1]=K,R[q+2]=K,R[q+3]=255}w%12===11&&await v()}const M=new e.DataTexture(R,y,F,e.RGBAFormat,e.UnsignedByteType);M.magFilter=e.LinearFilter,M.minFilter=e.LinearFilter,M.generateMipmaps=!1,M.needsUpdate=!0,l.uBarTex.value=M,l.uBarBox.value.set(o,a,1/(r-o),1/(z-a)),l.uRiverW.value.set(pe,Le,oe,tt)}await v();const jo=125;[-5/6,-.5,-1/6,1/6,.5,5/6].forEach((t,o)=>{let r=-1e5;for(let a=Tt.x;a<=Tt.y;a+=2.5){const z=m.arcPoint(n+t*l.uWidth.value.z+t*(a-104)*.42,a,0);te.distanceTo(z.x,tt,z.z)<jo&&(r=a)}ho.value[o]=r}),await v();{const t=Qt("m7-falls"),o=[],r=[],a=[],z=[],y=[],F=[],R=1.05,M=.55;for(const ie of[1,-1])for(const[ge]of no[ie]){const N=kt(ie,ge,1,0).depth;if(N<3)continue;const J=N*.86,_=Math.max(2,Math.round((J-.7)/M)),me=o.length/3,Be=t();for(let D=0;D<=_;D++)for(const X of[-1,1]){const h=.7+(J-.7)*D/_,G=kt(ie,ge+X*R,h,.36+.03*h);o.push(G.x,G.y,G.z),r.push(X,h-.7,J-.7,Be),a.push(G.nx,G.nz,h)}for(let D=0;D<_;D++){const X=me+D*2,h=X+2;ie>0?z.push(X,h,X+1,X+1,h,h+1):z.push(X,X+1,h,X+1,h+1,h)}for(let D=0;D<6;D++){const X=kt(ie,ge+(t()-.5)*1.5,J+.1,.6+.5*t());y.push(X.x,X.y+.1,X.z,.7+.7*t()),F.push(t(),.07+.08*t(),X.nx,X.nz)}}const w={...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:Pe,uSunDir:l.uSunDir,uSunCol:l.uSunCol,uSkyCol:l.uSkyCol,uGain:Ge.uGain,uLow:Ge.uLow,uLitD:io.uLitD},E=new e.BufferGeometry;E.setAttribute("position",new e.Float32BufferAttribute(o,3)),E.setAttribute("aF",new e.Float32BufferAttribute(r,4)),E.setAttribute("aFN",new e.Float32BufferAttribute(a,3)),E.setIndex(z),E.computeBoundingSphere();const f=new e.Mesh(E,new e.ShaderMaterial({uniforms:w,vertexShader:ya,fragmentShader:Sa,transparent:!0,depthWrite:!1,fog:!0,side:e.DoubleSide}));f.name="falls",f.renderOrder=1.5,g.add(f);const L=new e.InstancedBufferGeometry,Q=new e.PlaneGeometry(2,2),K=y.length/4;L.setAttribute("position",Q.getAttribute("position")),L.setIndex(Q.getIndex()),L.setAttribute("iA",new e.InstancedBufferAttribute(new Float32Array(y),4)),L.setAttribute("iB",new e.InstancedBufferAttribute(new Float32Array(F),4)),L.instanceCount=K,L.boundingSphere=E.boundingSphere.clone(),L.boundingSphere.radius+=6;const q=new e.Mesh(L,new e.ShaderMaterial({uniforms:w,vertexShader:ka,fragmentShader:Aa,transparent:!0,depthWrite:!1,fog:!0}));q.name="falls-mist",q.renderOrder=1.6,g.add(q)}await v();{{const o=st.geometry.getAttribute("position"),r=new Float32Array(o.count);for(let a=0;a<o.count;a+=2)r[a]=r[a+1]=.5*Math.abs(o.getY(a+1)-o.getY(a));st.geometry.setAttribute("aTh",new e.Float32BufferAttribute(r,1))}const t=new e.Mesh(Va(Qt("m7-bands"),T,(o,r)=>At.colorAt(o,r)),new e.ShaderMaterial({uniforms:{uTime:Pe,uSunDir:l.uSunDir,uLit:{value:C(s.cirrus.lit).multiplyScalar(p==="rose"?1.15:1)},uShade:{value:C(s.cirrus.shade)},uAlpha:{value:p==="rose"?.8:p==="ochre"?.66:.6}},vertexShader:Na,fragmentShader:Ia,transparent:!0,depthWrite:!1,side:e.DoubleSide}));t.name="sky-bands",t.renderOrder=-.89,t.frustumCulled=!1,st.add(t)}await v();{const t=g.getObjectByName("fords").geometry,o=new Float32Array(t.instanceCount*9),r=Qt("m7b-fords");for(let a=0;a<o.length;a++)o[a]=r();t.setAttribute("iF",new e.InstancedBufferAttribute(o,9))}await v();const Ko=l.uDustA.value;return{scene:g,path:te,duration:Gt,pace:t=>Ve(Ve(Ve(Ve(1.2,.72,W(Ce-.09,Ce-.02,t)),.85,W(Ce+.04,Ce+.1,t)),1,W(ve-.02,ve+.06,t)),1.03,W(Ke,Ke+.06,t)),title:"The Saiga River \xB7 20,000 years ago",ride:"none",companion:"none",style:"none",camera:{fov:62,near:.3,far:4e3,lookAhead:22,sway:.6,bank:.15},pois:vt,portal:{shape:"circle",radius:6.2,color:"#CFE8F0",glow:.7,revealDistance:260},post:{exposure:s.exposure,bloom:{strength:s.bloom,radius:.6,threshold:.92},grade:{saturation:s.sat??1.05,contrast:s.contrast??1.05,tint:s.tint,shadowTint:s.shadowTint,vignette:.22,grain:.02}},update(t,o,r,a){Pe.value=o,m.setProgress(a);const z=1-W(Fe+0,Fe+.07,a);m.setStream(z),m.setStreamWindow(Ve(-300,130,W(Fe-.04,Fe+.07,a)),1e5),m.update(t,o,r),Tt.z=l.uQ.value.z,Ot.update(t,o,r),qt.uPlume.value=Ve(1,.45,W(Fe,Fe+.1,a)),go.update(t,o,r,a),r.getWorldPosition(pt),l.uDustA.value=Ko*(1-.7*W(7,13,pt.y))*(1-.8*W(ve-.07,ve-.01,a));const y=Math.hypot(pt.x,pt.z-de)-de,F=S(pt),R=Math.min(-80,Math.max(-232,y-13));if(Mt.userData.uQ.x=R,Mt.userData.uQ.y=R+58,Ct){Ct.userData.uWrap.set(Math.min(.56,Math.max(-.56,(F-16*W(Ce-.08,Ce+.04,a)*(1-W(ve-.05,ve,a))-l.uLane.value.y)/l.uWidth.value.y)),.88,0);const f=Math.min(14,Math.max(-52,y-44));Ct.userData.uQ.x=f,Ct.userData.uQ.y=f+88}if(Ye){const f=1-W(.19,.24,a);Ye.uniforms.uVis.value*=f;for(let L=0;L<Yt.length;L++)Yt[L].value=Ye.uniforms.uVis.value}if(et.length){const f=W(.1,.16,a);for(const L of et)L.material.uniforms.uRise.value=f;l.uRepel.value.set(Pt[0],Pt[1],Ve(5,17,f),18)}if(Ye&&!et.length&&(Ye.positionAt(o,a,Re),l.uRepel.value.set(S(Re),Math.hypot(Re.x,Re.z-de)-de,14*W(.02,.05,a)*(1-W(.2,.25,a)),28)),lt.length){const f=.5*(a*te.length-30),L=t>1e-4?(f-xo)/t:0;xo=f,Kt+=(Xe(L/3)-Kt)*Math.min(1,t*3);for(const Q of lt){const K=34*(1-Math.exp(-Math.max(0,f+6)/34))-6+Q.userData.back,q=jt.x+ut.x*K+ut.z*Q.userData.left,ie=jt.z+ut.z*K-ut.x*Q.userData.left;Q.position.set(q,fe(q,ie),ie),Q.material.uniforms.uGait.value=K*3.7,Q.material.uniforms.uMove.value=Kt*Math.exp(-Math.max(0,f+6)/34)}if(!et.length){const Q=lt[0];l.uRepel.value.set(S(Q.position),Math.hypot(Q.position.x,Q.position.z-de)-de,5,8)}}Je.visible=a>0&&!u.through,Je.matrix.copy(r.matrixWorld),Je.matrixWorldNeedsUpdate=!0;const M=Math.abs(((a-.205)/.09+.5)%1+1)%1-.5,w=0*M,E=.5+.5*Math.cos(o*gt*2.7+a*180);ft.position.y=-.86-1.3*(1-w);for(const f of _o)f.position.y=-1.02-1.9*(1-w),f.rotation.set(.14-Ve(.3,.95*E,w),f.userData.side*(.1+.12*E*w),-f.userData.side*.15*E*w);for(const f of Uo){const L=W(.83,.95,a),Q=a*te.length+f.ahead+5*L;te.posAtDist(Q,Wt),te.tangentAtDist(Q,rt),rt.normalize(),te.tangentAtDist(Q+6,_e);const K=rt.x*_e.z-rt.z*_e.x;f.bank+=(Xe(Math.abs(K)*6)*Math.sign(K)*-.5-f.bank)*Math.min(1,t*2.5),_e.crossVectors(qo,rt).normalize(),Ft.crossVectors(rt,_e),Wt.addScaledVector(_e,f.lat+Math.sign(f.lat)*28*L+.35*Math.sin(o*.6+f.ph)),Wt.y+=f.up+13*L+.25*Math.sin(o*.9+f.ph)+.1*Math.sin(o*2.3+f.ph);const q=f.rolls*Math.sin(Math.PI*Xe((a-(Ce+.115))/.045)),ie=Math.PI*q*q+f.bank,ge=Math.cos(ie),N=Math.sin(ie);Re.copy(_e).multiplyScalar(ge).addScaledVector(Ft,N),Ft.multiplyScalar(ge).addScaledVector(_e,-N),_e.copy(Re),f.mesh.matrix.makeBasis(_e,Ft,rt).scale(Oo).setPosition(Wt),f.mesh.matrixWorldNeedsUpdate=!0,f.mat.uniforms.uFlap.value=o*gt*3.3+f.ph,f.mat.uniforms.uAmp.value=W(-.3,.2,Math.sin(o*.8+f.ph*1.25))*(1-q*q)}At.update(t,o,r),ro.update(t,o,r),r.getWorldPosition(st.position),_t.setOpacity(.5*(1-W(.84,.9,a))*(1-W(12,24,y))),_t.update(t,o,r)},dispose(){At.dispose()}}}};const ua=`
attribute vec3 aGully;
varying vec3 vWorld, vN, vG;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz; vN = normal; vG = aGully;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Oe=`
float gh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 gh2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float gn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(gh(i), gh(i + vec2(1., 0.)), f.x), mix(gh(i + vec2(0., 1.)), gh(i + vec2(1., 1.)), f.x), f.y); }
`,ha=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uLoess, uGrass, uSage, uPoppy, uSilt, uIce, uWater, uGravel, uWillow, uRose;
uniform vec4 uArc, uLane, uRiver, uRamp; uniform vec4 uPond[NP]; uniform vec3 uWidth, uTroughC, uPondDeep; uniform float uTime, uLow, uStream, uGain, uTroughK;
uniform vec3 uSkyHor, uSkyZen, uScatC, uCirLit;   // (m7) this look's own sky (horizon, zenith, the wash round the sun, a lit band), for what still water mirrors
varying vec3 vWorld, vN, vG;
#include <fog_pars_fragment>
${Oe}
${Xt}
${Mo}
vec2 gMr = vec2(0.);   // set by voro: from the point to its cell's centre, in cell units
vec2 gEn = vec2(0., 1.);   // (m7) set by voro: the unit normal of the nearest cell edge (the same line from either side of it, up to its sign)
vec3 voro(vec2 x){   // x: distance to the nearest cell edge, y: cell id, z: distance to the cell centre
  vec2 n = floor(x), f = fract(x), mg = vec2(0.), mr = vec2(0.); float md = 8.;
  for(int j = -1; j <= 1; j++) for(int i = -1; i <= 1; i++){ vec2 g = vec2(float(i), float(j)), o = gh2(n + g) * .7 + .15, r = g + o - f; float d = dot(r, r); if(d < md){ md = d; mr = r; mg = g; } }
  float ed = 8.;
  for(int j = -2; j <= 2; j++) for(int i = -2; i <= 2; i++){ vec2 g = mg + vec2(float(i), float(j)), o = gh2(n + g) * .7 + .15, r = g + o - f; vec2 dr = r - mr; float l2 = dot(dr, dr); if(l2 > 1e-5){ vec2 en = dr / sqrt(l2); float e = dot(.5 * (mr + r), en); if(e < ed){ ed = e; gEn = en; } } }
  gMr = mr; return vec3(ed, gh(n + mg), sqrt(md));
}
void main(){
  vec2 p = vWorld.xz; vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float dist = length(cameraPosition - vWorld), near = 1. - smoothstep(30., 140., dist), mid = 1. - smoothstep(120., 420., dist);
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.));
  float q = length(p - vec2(0., uArc.x)) - uArc.x, dB = length(p - uRiver.xy) - uRiver.z;
  float steep = smoothstep(.02, .15, 1. - N.y);
  float n1 = gn(p * .9), n2 = gn(p * 3.7 + 11.), n3 = gn(p * .13 + 3.);
  // ---- the terrace
  vec3 poly = voro(p / 13.5 + .3 * vec2(gn(p * .05), gn(p * .05 + 7.)) + .13 * vec2(gn(p * .17 + 3.), gn(p * .17 + 9.)) + .04 * vec2(gn(p * .55 + 13.), gn(p * .55 + 1.))); vec2 pMr = gMr, pEn = gEn;
  // (polish m4) the sedge of a trough grows in clumps: its belt swells, thins and breaks along the trough, with a ragged edge
  float tvar = smoothstep(.25, .7, gn(p * .075 + 41.) * .65 + gn(p * .31 + 5.) * .35);
  float trough = (1. - smoothstep(.02 + .02 * tvar, .06 + .11 * tvar, poly.x + .03 * (n1 - .5) + .035 * (gn(p * .43 + 7.) - .5))) * (.45 + .55 * tvar);
  float tn = gn(p * 2.3) * .45 + gn(p * 5.9 + 3.) * .33 + gn(p * 13. + 9.) * .22, tuft = smoothstep(.5, .6, tn) * (.6 + .4 * gn(p * 23.));
  float sage = smoothstep(.62, .7, gn(p * 2.9 + 31.) * .6 + gn(p * 8.1 + 5.) * .4) * smoothstep(.45, .6, n3) * (1. - tuft);
  vec3 cv = voro(p * 1.3 + 40. + .5 * vec2(n2, n1)); vec2 hMr = gMr; float crack = (1. - smoothstep(.0, .035, cv.x)) * near * smoothstep(.3, .6, n1) * .6;
  vec3 c = uLoess * (.8 + .3 * n3 + .12 * n1) * (1. - .35 * crack);
  vec3 grass = mix(uGrass, uLoess, .25) * (.55 + .5 * n2 + .4 * tuft) * mix(vec3(1.), vec3(.75, 1.05, .7), trough);
  float cover = mix(.5 + .25 * trough, tuft * (.85 + .15 * n2) + trough * .45, near);
  c = mix(c, grass, clamp(cover, 0., 1.));
  c = mix(c, mix(uSage, uGrass, .4) * (.5 + .3 * n2), sage * mix(.4, .85, near));
  // three tones: pale raised polygon centres, grey sage in drifts 30 m across, dark sedge-green troughs
  float drift = smoothstep(.5, .68, gn(p * .033 + 17.) * .7 + .3 * n3);
  c = mix(c, uSage * (.62 + .2 * n2), drift * .5);
  c *= 1. + .08 * smoothstep(.2, .5, poly.x) * (1. - drift);
  c = mix(c, uTroughC * (.7 + .4 * n2), trough * uTroughK);
  // (m7) A FINER SECOND SCALE INSIDE THE NET. At a grazing angle the sedge belts of the troughs ran together into broad dark bands
  // and the polygon centres lay as large flat tiles. The belt is now tussocks (clumps a hand to a stride across: darker hearts,
  // paler gaps, the same mean tone), and second-order frost cracks 3 to 5 m apart net each polygon's centre in thin sedge lines.
  // (Mend 2) the first m7's tussocks were a smooth noise and did not show. Now the belt is broken into sharp-edged patches a
  // stride to a few metres across (dark wet sedge hollows, pale dry cotton-sedge tops: 1.3 and .64 of the belt's tone, the same
  // mean) and, within some 100 m, into single tussocks (the 0.8 m cells of the hummock net, each its own tone, a dark gap round
  // it). From 260 m on the belt is live's. The straight distance from the eye (dist): a 2 m patch is seen under half a degree
  // across beyond 260 m and a 0.8 m tussock beyond 100 m; there they merge into the belt's own tone.
  float tus = smoothstep(.32, .64, tn), fineK = 1. - smoothstep(90., 260., dist);
  float tpat = smoothstep(.44, .56, gn(p * .33 + 7.) * .55 + gn(p * 1.1 + 2.) * .45);
  c *= mix(1., mix(1.3, .64, tpat) * mix(1., (.8 + .4 * cv.y) * (1. - .28 * (1. - smoothstep(.0, .1, cv.x))), 1. - smoothstep(40., 100., dist)), trough * fineK);
  float sec = (1. - smoothstep(.0, .035 + dist * .0006, abs(gn(p * .27 + 19.) + .12 * (gn(p * 1.7 + 3.) - .5) - .5))) * smoothstep(.1, .2, poly.x) * (1. - smoothstep(110., 260., dist));
  c = mix(c, uTroughC * (.62 + .5 * n2), sec * uTroughK * .7 * (.4 + .6 * tus));
  vec3 fv = voro(p * 2.9 + 90.); float fl = (1. - smoothstep(.03, .07, fv.z)) * near * step(.72, fv.y) * (1. - sage);
  c = mix(c, fv.y > .9 ? vec3(.3, .14, .5) : (trough > .5 ? vec3(.8) : uPoppy), fl);
  // thaw ponds: water inside a wobbling outline, wet dark silt at the edge, a margin of sedge round it
  float dz = uArc.x - p.y; if(abs(dz) < 1e-3) dz = 1e-3; float a = atan(p.x, dz) * uArc.x;
  float pond = 0., pring = 0., pdepP = 0., pwet = 0.;
  for(int i = 0; i < NP; i++){
    vec4 pd = uPond[i]; float d = length(p - pd.xy) / max(pd.z, 1.) + .36 * (gn(p * .15 + pd.w) - .5) + .08 * (n1 - .5);
    // (m7) the pool lies IN the ground: its bed shelves in from the waterline over the outer third (live: one tenth, a rim), and a
    // band of wet silt as wide again lies outside the water, under the sedge
    pond = max(pond, 1. - smoothstep(.84, .88, d)); pring = max(pring, 1. - smoothstep(.9, 1.3, d)); pdepP = max(pdepP, 1. - smoothstep(.56, .87, d)); pwet = max(pwet, 1. - smoothstep(.87, 1.04, d + .05 * (n2 - .5)));
  }
  float wetT = smoothstep(.47, .6, gn(p * .019 + 3.) * .7 + gn(p * .06 + 11.) * .3) * (1. - smoothstep(-12., -4., dB)) * (1. - smoothstep(.1, .5, vG.x)) * (1. - smoothstep(15., 21., q) * (1. - smoothstep(44., 60., abs(a - uRamp.x))));
  float tedge = poly.x + .014 * (n1 - .5) + .01 * (n2 - .5);
  float twn = gn(p * .045 + 5.) * .7 + gn(p * .16 + 2.) * .3, twid = (.022 + .03 * smoothstep(.3, .6, twn) + .08 * smoothstep(.62, .8, twn)) * smoothstep(.2, .36, gn(p * .028 + 21.));
  float tw = (1. - smoothstep(twid * .5, twid + .008, tedge)) * wetT * step(.004, twid), tm = (1. - smoothstep(twid + .015, twid + .04 + .09 * tvar, tedge + .02 * (n2 - .5))) * wetT * (.5 + .5 * smoothstep(.3, .55, tn)), pondR = pond;
  float pdep = mix(1. - smoothstep(0., 1., tedge / max(twid, 1e-3)), pdepP, pondR);   // 0 at the waterline .. 1 where it is a hand deep
  pring = max(pring, tm * .9); pond = max(pond, tw);
  c = mix(c, vec3(.2, .27, .1) * (.6 + .7 * n2 + .6 * tuft), pring * .92);
  c = mix(c, uSilt * 1.5, smoothstep(.86, 1., pring) * (1. - pond) * .6);
  // (m7) wet dark silt at every water's edge: a band round the pools, a line along each running thread
  float twet = (1. - smoothstep(twid + .004, twid + .02, tedge + .006 * (n2 - .5))) * wetT * step(.004, twid);
  c = mix(c, uSilt * 1.3 * (.8 + .4 * n2), max(pwet, twet) * (1. - pond) * .78);
  float trail = (1. - smoothstep(1.2, 3.6, abs(q))) * (.6 + .4 * n1);
  float k1 = smoothstep(-110., -12., q), k2 = smoothstep(6., 38., q), ac = mix(mix(uLane.x, uLane.y, k1), uLane.z, k2), w = mix(mix(uWidth.x, uWidth.y, k1), uWidth.z, k2);
  float ln = (a - ac) / max(w, 1.), inS = (1. - smoothstep(.85, 1.1, abs(ln))) * smoothstep(-330., -250., q);
  float beaten = inS * (.25 + .5 * smoothstep(.3, .7, gn(p * .31 + 5.) * .6 + n1 * .4)) * mid;   // trampled patches (polish 3: the lanes were noise stretched 60:1 and read as a smeared texture)
  float hoof = (1. - smoothstep(.05, .1 + .08 * fract(fv.y * 31.), fv.z)) * step(fv.y, .34) * inS * (1. - smoothstep(10., 34., dist));
  float stone = (1. - smoothstep(.1, .2 + .1 * fract(fv.y * 17.), fv.z)) * step(.86, fract(fv.y * 7.3)) * (1. - smoothstep(14., 46., dist)) * (1. - sage) * (1. - tuft);
  c = mix(c, uLoess * .62, trail * .55);
  c = mix(c, uLoess * (.95 + .2 * n2), beaten * .6);
  c *= 1. - .42 * hoof;
  c = mix(c, uGravel * (.9 + .5 * fract(fv.y * 53.)), stone * .8);
  // ---- bare faces: the bluff, the slump ramp churned by hooves
  float rampTop = smoothstep(uRamp.y - 4., uRamp.y + 10., q);
  vec3 face = uLoess * (.6 + .25 * gn(vec2(vWorld.y * 1.7, (p.x + p.y) * .05)) + .2 * gn(vec2((p.x - p.y) * .9, vWorld.y * .25)));
  face = mix(face, uSilt * 1.7, .4 * smoothstep(.45, .75, gn(vec2(vWorld.y * .6 + 3., (p.x + p.y) * .02))));
  face *= (.74 + .5 * gn(p * 1.1 + 3.)) * (1. - .35 * (1. - smoothstep(.06, .28, cv.z)) * near);
  float bare = max(max(steep, rampTop * max(inS, steep)), max(smoothstep(-5., 1., dB), rampTop * (1. - smoothstep(40., 58., abs(a - uRamp.x)))));   // nothing of the terrace's net on the slump or below the bluff
  float churn = gn(p * 1.3 + 2.) * .45 + gn(p * 3.3 + 7.) * .33 + gn(p * 7.9) * .22;   // clods and scuffs, no streaks
  float bench = smoothstep(.5, .66, gn(vec2(ln * 2.6 + 9., q * .19 + 1.7 * gn(p * .07))));
  float rampM = 1. - smoothstep(38., 56., abs(a - uRamp.x) + 5. * (n1 - .5));
  // (polish m4) terracettes: slumped steps along the contour, warped, each dying out after a few metres; a few runnels wander down the slope
  float tq = q * .55 + 2.4 * gn(p * .06 + 2.) + .9 * gn(p * .21) + .25 * gn(p * .9), tfr = fract(tq), riser = smoothstep(.7, .93, tfr) * (1. - smoothstep(.93, 1., tfr)) * smoothstep(.3, .55, gn(p * .1 + 17.) * .6 + gn(vec2(a * .31, q * .09)) * .4);
  float rn = gn(vec2(a * .085 + .3 * gn(p * .2), q * .022) + 5.), runnel = (1. - smoothstep(.0, .035 + .02 * n1, abs(rn - .5))) * smoothstep(.45, .7, gn(vec2(a * .04 + 3., q * .03)));
  float clod = smoothstep(.55, .75, gn(p * 4.1 + 1.) * .6 + gn(p * 9.3) * .4) * near;
  vec3 rampC = mix((uLoess * .66 + uSilt * .4) * vec3(.9, .9, 1.08), uLoess * 1.08, smoothstep(.3, .7, churn)) * (1. - .2 * bench) * (1. - .16 * (1. - smoothstep(.08, .3, cv.z)) * near) * (1. - .2 * hoof);
  rampC *= (1. - .34 * riser) * (1. + .12 * smoothstep(.1, .6, tfr) * (1. - riser)) * (1. - .3 * runnel) * (1. - .22 * clod) * mix(.9, 1.04, inS);
  rampC *= (1. - .3 * (1. - smoothstep(.0, .05, cv.x)) * (1. - smoothstep(8., 34., dist))) * (1. - .28 * hoof);   // mud cracks and hoof pits, sharp where we skim it
  rampC = mix(rampC, uGrass * vec3(.5, .56, .3) * (.7 + .6 * n2), smoothstep(.6, .72, tn) * (1. - inS) * .7 * step(.5, tfr));   // sedge has taken the treads outside the beaten lane
  // (m7) DETAIL OF A FINER SCALE INSIDE THE BIG FORMS of the slump and the bluff, where the lens passes close: clods and scuffs a
  // hand to a forearm across over the whole ramp (live's fine marks ended 8 to 34 m from the eye and the slope beyond lay smooth),
  // stones thawed out of it; on the steep faces the grain is laid on the face itself (by height and along it), so nothing drawn
  // on the ground plan is dragged down the bank.
  float rfk = 1. - smoothstep(90., 220., dist);   // (the straight distance from the eye: a clod a forearm across is under a tenth of a degree beyond 220 m)
  rampC *= mix(1., .68 + .64 * smoothstep(.3, .7, tn), rfk) * mix(1., .86 + .28 * gn(p * 6.7 + 13.), near);
  rampC = mix(rampC, uGravel * (.8 + .6 * fract(fv.y * 53.)), (1. - smoothstep(.08, .2 + .1 * fract(fv.y * 17.), fv.z)) * step(.8, fract(fv.y * 7.3)) * (1. - smoothstep(18., 60., dist)) * .7);
  // (m7c) THE SLUMP IS CRACKED GROUND. A thaw slump moves as blocks: plates of silt 2 to 4 m across with a dark fissure round every one,
  // and the fissure is what says that the ground has broken. A plate's own tone lies within .985 to 1.015 of the ramp's and its own tilt
  // (in the RELIEF below) is about a sixtieth of a degree at the most: under the sun of any of the three looks two plates differ across
  // their shared edge by no more than four hundredths of the ramp's lit tone. PLATES LIE ON A SLOPE: the whole block term goes with the
  // ground's own slope by the mesh's normal (N here, before any painted relief): none of it under 4 degrees, all of it from 9 (.0698, .1564: their sines). To 330 m of straight distance from the eye (from 140 m it weakens: a 3 m block is under half a degree across at 330 m). The figures: verify-m7c/tiltlaw.mjs, slump.mjs.
  float blkK = bare * rampTop * rampM * (1. - smoothstep(140., 330., dist)) * (.3 + .7 * smoothstep(.3, .62, gn(p * .045 + 31.))) * smoothstep(.0698, .1564, length(N.xz)), blkFis = 0.; vec2 blkTilt = vec2(0.);   // (broken tracts some 20 to 40 m across among ground that has slid whole: a slump is not broken evenly)
  if(blkK > .01){
    vec3 bv = voro(p / 2.9 + 60. + .3 * vec2(gn(p * .21 + 4.), gn(p * .21 + 9.)));
    blkFis = (1. - smoothstep(.0, .035 + dist * .0006, bv.x)) * (.5 + .5 * smoothstep(.2, .6, gn(p * .4 + bv.y * 9.)));
    blkTilt = (vec2(fract(bv.y * 17.3), fract(bv.y * 41.7)) - .5) * 2.;
    rampC *= mix(1., (.985 + .03 * bv.y) * (1. - .5 * blkFis), blkK);
  }
  vec2 tw3 = vec2(N.x * N.x, N.z * N.z) / max(N.x * N.x + N.z * N.z, 1e-4);
  float fcl = tw3.x * (gn(vec2(p.y * 2.3, vWorld.y * 3.1)) * .6 + gn(vec2(p.y * 5.9 + 3., vWorld.y * 7.3)) * .4) + tw3.y * (gn(vec2(p.x * 2.3, vWorld.y * 3.1) + 5.) * .6 + gn(vec2(p.x * 5.9 + 8., vWorld.y * 7.3)) * .4);
  face *= mix(1., .7 + .6 * fcl, steep * rfk);
  c = mix(c, mix(face, rampC, rampTop * rampM), bare);
  // ---- the braided river
  float riv = (1. - smoothstep(uRiver.w + 1.1, uRiver.w + 2.4, vWorld.y)) * step(0., dB), water = 0., rivCh = 1., wetRim = 0.; vec2 barBump = vec2(0.);
  if(riv > 0.){
    float bx = p.x - uRiver.x, bz = -(p.y - uRiver.y); if(abs(bz) < 1e-3) bz = 1e-3;
    vec2 rp = vec2(atan(bx, bz) * uRiver.z, dB);
    float wv = gn(rp * vec2(.004, .012)) * 2. - 1., wv2 = gn(rp * vec2(.011, .03) + 7.) * 2. - 1.;
    float ch1 = abs(sin(dB * .047 + wv * 2.6 + wv2 * .9 + rp.x * .004)), ch2 = abs(sin(dB * .027 - rp.x * .019 + wv2 * 2.4 + 1.7)), ch3 = abs(sin(dB * .021 + rp.x * .013 + wv * 3.1 + 4.));
    float ch = min(ch1, min(ch2, ch3) + .1);
    rivCh = ch + .25 * (gn(rp * vec2(.02, .07)) - .5);   // (m7: live's own value, named) under .36 to .44 open water; it falls toward mid channel
    water = (1. - smoothstep(.36, .44, rivCh)) * smoothstep(6., 16., dB);
    vec3 bar = uGravel * (.7 + .5 * n2 * near + .3 * gn(rp * vec2(.03, .1)));
    // LIVE'S WILLOW, letter for letter: mats along the waterlines of the bars and of the near shore, in live's own colour and amount
    // (Mend 2: the first m7 moved the willow 2 to 5 m in from the water and laid a wet rim where it had stood; wherever a bar
    // is narrow that took the willow away)
    float wlive = smoothstep(.5, .66, gn(rp * vec2(.035, .08) + 3.)) * (1. - smoothstep(.44, .7, ch)) * .8;
    bar = mix(bar, uWillow * (.5 + .5 * n1) * mix(1., .75 + .5 * tn, near), wlive);   // (m7: near the lens the mat is leaves and twigs, the same mean tone)
    // (m7) MORE WILLOW, further in on the broad bars: ragged clumps 4 to 13 m across with silt between, from 2 m inside the
    // waterline (METRES IN FROM THE WATERLINE: the braid value above the waterline over its own slope, a metre to either side)
    float wcl = smoothstep(.36, .6, gn(p * .075 + 9.) * .5 + gn(p * .23 + 9.) * .3 + tn * .2);
    float dBa, dBb; vec2 rgr = vec2(riverChv(p + vec2(1., 0.), dBa), riverChv(p + vec2(0., 1.), dBb)) - rivCh;
    float mIn = max(rivCh - .44, 0.) / max(length(rgr), .004);
    float wmat = smoothstep(.42, .6, gn(rp * vec2(.035, .08) + 3.) + .08 * (n1 - .5) + .2 * (gn(p * .09 + 5.) - .5)) * (1. - smoothstep(.52, .8, ch)) * smoothstep(2., 5., mIn);
    bar = mix(bar, uWillow * (.5 + .5 * n1) * (.62 + .7 * tn) * (.85 + .5 * smoothstep(.5, .8, gn(p * .6 + 2.))), wmat * (.1 + .9 * wcl) * .9 * (1. - wlive * 1.25));
    // (Mend 2) THE WET MARGIN of every channel, .6 to 2.6 m wide, only where no willow stands at the water: looked down into it is
    // dark wet silt; looked along it mirrors the sky as the water beside it does (wetRim, below), so from afar a bar has no dark
    // ring round it. (The first m7's pale dry crest is gone: it paled live's gravel.)
    wetRim = (1. - smoothstep(.6, 2.6, mIn)) * smoothstep(6., 16., dB) * (1. - wlive * 1.25);
    bar *= 1. - .4 * wetRim * (.7 + .3 * n1) * clamp(V.y * 2.5, 0., 1.);
    // (Mend 2) THE BARS HAVE FORM: low scroll ridges and chutes 5 to 16 m apart lying along the flow, a hand to a forearm high.
    // Flat, a bar under a sun 3 to 11 degrees up takes almost no light and lies on the bright water as a dark flat shape; with
    // its own relief (barBump, added to the normal in the RELIEF below) the faces toward the sun are lit and those away from
    // it shaded. In the bank circle's own frame: rp = (metres along the bank, metres out from it).
    { vec2 rh = normalize(p - uRiver.xy + vec2(1e-4, 0.)), th = vec2(-rh.y, rh.x);
      float b0 = gn(rp * vec2(.06, .19) + 11.) * .65 + gn(rp * vec2(.17, .45) + 3.) * .35, b1 = gn((rp + vec2(1.2, 0.)) * vec2(.06, .19) + 11.) * .65 + gn((rp + vec2(1.2, 0.)) * vec2(.17, .45) + 3.) * .35, b2 = gn((rp + vec2(0., .5)) * vec2(.06, .19) + 11.) * .65 + gn((rp + vec2(0., .5)) * vec2(.17, .45) + 3.) * .35;
      barBump = (th * (b1 - b0) / 1.2 + rh * (b2 - b0) / .5) * .8 * (1. - water) * smoothstep(6., 16., dB) * (1. - smoothstep(500., 900., dist)); }   // (slopes to some 15 degrees; gone by 900 m of straight distance, where a 5 m ridge is a third of a degree across)
    bar = mix(bar, uLoess * .9, inS * (1. - smoothstep(60., 140., dB)) * .5);   // the beaten fan at the foot of the ramp
    c = mix(c, bar, riv);
  }
  // ---- the thaw gully: a cut bank of frozen ground. vG = (depth below the rim here, metres along it, metres across it)
  float gd = vG.x, gs = vG.y, glat = vG.z, inG = smoothstep(.25, 1.4, gd), gwall = 0., thread = 0., tf = 1.;
  if(inG > 0.){
    // the walls seen are their own ribbons (WALL_FRAG); this heightfield wall stands behind them, plain dark silt
    float wall = smoothstep(.5, .8, 1. - N.y) * max(smoothstep(8., 11., abs(glat)), smoothstep(84., 87., gs)); gwall = wall;   // only the cut banks (polish 3: a silt mound's steeper side took the wall's dark tone and read as a shapeless dark mass in the stream)
    if(wall > .6 && gd > 1.5) discard;   // (hidden behind the ribbons; its stretched cells must never poke through them)
    vec3 wc = uSilt * (1.3 + .8 * gn(vec2(gs * .9, vWorld.y * 2.3)));
    wc = mix(mix(vec3(.4, .27, .16), uLoess * .7, n1) * (.75 + .5 * n2), wc, smoothstep(1.6, 4.5, gd));   // (polish m3) where the cut is still shallow its bank is thawed brown soil in the sun (it stood there as a grey slab)
    // the floor: silt mounds, and three or four thin dark threads of meltwater with a pale glint, leading to the ring
    float cl = 2.4 * sin(gs * .1) + 1.3 * sin(gs * .27 + 1.), hw = 3.2 + 1.3 * sin(gs * .17 + 2.);   // the stream's middle and half-width here
    float sd = abs(glat - cl) + 1.2 * (gn(vec2(gs * .45, glat * .7)) - .5), bars = smoothstep(.6, .68, gn(vec2(gs * .16 + 3., glat * .45 + 5.)));
    thread = (1. - smoothstep(hw - .3, hw, sd)) * (1. - bars * smoothstep(.2, .5, sd / max(hw, .5) + .3)) * (1. - wall) * smoothstep(1.2, 3.5, gd);
    tf = sd / max(hw, .5);
    float damp = (1. - smoothstep(hw, hw + 1.8, sd)) * (1. - wall) * (1. - .85 * thread);
    // (polish 3) the floor read as a dark shapeless mass: paler drying silt broken into mud-crack plates, cobbles thawed out of
    // the banks, and a margin of sedge with white cotton heads along the stream
    // (polish m3) the floor: warm slumped silt in mounds and mud plates (no grey noise), wet and dark toward the water, mossy
    // sedge in ragged drifts along the stream and in patches under the banks, cotton heads, cobbles thawed out of the walls;
    // the stream itself is DARK open water between pale silt bars, carrying the sky and the sun's sparkle to the ring
    float mud = 1. - smoothstep(.0, .06, cv.x);
    float mnd = gn(vec2(gs * .23, glat * .31) + 3.) * .6 + gn(vec2(gs * .61, glat * .8)) * .4;
    vec3 fc = mix(uSilt * 2.3 * vec3(1.08, 1., .9), uLoess * .7, clamp(.2 + .75 * mnd + .2 * (n2 - .5), 0., 1.)) * (.8 + .4 * cv.y) * (1. - .34 * mud);
    fc = mix(fc, uSilt * 1.25, damp * .7);                                                    // wet silt at the water's edge
    float barM = bars * (1. - smoothstep(hw - .1, hw + .4, sd));
    fc = mix(fc, mix(uLoess * .8, uGravel * 1.1, n2) * (1. - .3 * mud), barM * (1. - wall) * .85);   // the bars: pale washed silt and gravel
    float peb = (1. - smoothstep(.1, .22, fv.z)) * step(.62, fv.y);
    fc = mix(fc, uGravel * (.8 + .7 * fv.y), peb * .75);
    float sdn = sd + 1.4 * (gn(vec2(gs * .5 + 9., glat * .6)) - .5);
    float sedge = max((1. - smoothstep(hw + .3, hw + 3.2, sdn)) * smoothstep(hw - .6, hw + .3, sdn), .8 * smoothstep(.56, .7, gn(vec2(gs * .19 + 2., glat * .27 + 7.)))) * (1. - wall) * smoothstep(.22, .5, tn);
    fc = mix(fc, mix(vec3(.15, .2, .08), vec3(.3, .33, .12), n2) * (.7 + .6 * tuft), sedge * .85 * (.45 + .55 * smoothstep(.3, .6, gn(p * 1.1 + 4.))));
    fc = mix(fc, vec3(.8, .8, .76), (1. - smoothstep(.05, .11, fv.z)) * step(fv.y, .3) * sedge);
    c = mix(c, mix(fc, wc, wall), inG);
  }
  // ---- light
  float cs = cloudShade(p, uTime);
  // in the gully the sun reaches only the top of the walls (the low looks: the top metre, lit rose); the rest is open
  // shade filled by the sky above and by the pale rim, and it never goes black
  float gShade = inG * mix(smoothstep(.8, 3.0, gd) * .8, smoothstep(1.0, 3.0, gd), uLow);
  float sunVis = (1. - .64 * cs) * (1. - gShade);
  { // RELIEF (polish 3). Three scales, all sharp-edged, so a low sun rakes the ground into light and shade and nothing reads
    // as a smeared texture: frost hummocks 0.8 m across with a crack round each (near), the banks of the polygon troughs
    // (out to the middle distance), and a little broad swell. Hoof prints are pits.
    float open = (1. - inG) * (1. - riv) * (1. - pond);
    float e = .3, bk = (1. - smoothstep(50., 200., dist)) * open * ((.13 + .08 * uLow) * (1. - .7 * rampTop) + .15 * rampTop * rampM);
    vec2 pa = p * .8, pb = p * 2.6 + 5.;
    float hA = gn(pa) * .6 + gn(pb) * .4, hB = gn(pa + vec2(e * .8, 0.)) * .6 + gn(pb + vec2(e * 2.6, 0.)) * .4, hC = gn(pa + vec2(0., e * .8)) * .6 + gn(pb + vec2(0., e * 2.6)) * .4;
    vec2 hd = -hMr / max(length(hMr), 1e-3), td = -pMr / max(length(pMr), 1e-3);
    float hf = (1. - smoothstep(16., 70., dist)) * max(open, inG * (1. - gwall) * (1. - thread)) * (1. - .5 * bare), bareP = smoothstep(.3, .62, gn(p * .11 + 9.) * .65 + n3 * .35), hs = (1. - smoothstep(.0, .15, cv.x)) * hf * (.13 + .08 * uLow) * (.25 + .75 * bareP) * (.6 + .8 * n1) * (1. - .8 * bare * (1. - .7 * rampTop * rampM));
    float tfk = (1. - smoothstep(120., 420., dist)) * open * (1. - bare), ts = smoothstep(.0, .025, poly.x) * (1. - smoothstep(.03, .16, poly.x)) * tfk * (.3 + .2 * uLow);
    N = normalize(N - vec3(hB - hA, 0., hC - hA) * (bk / e) + vec3(hd.x, 0., hd.y) * hs + vec3(td.x, 0., td.y) * ts
      - vec3(barBump.x, 0., barBump.y) * riv + vec3(blkTilt.x, 0., blkTilt.y) * .0002 * blkK);   // (Mend 2) the bars' scroll ridges; each block of the slump tilted its own way
    c *= 1. - .2 * (1. - smoothstep(.0, .03, cv.x)) * hf * (1. - inS * .5) * (.2 + .8 * bareP) * (1. - .8 * bare); }
  float ndl = max(dot(N, uSunDir), 0.), back = max(0., -dot(V, uSunDir)), graze = 1. - abs(V.y);
  ndl = mix(ndl, max(ndl, .55), inG * gwall * step(.05, dot(N, uSunDir)) * (1. - smoothstep(.6, 2.6, gd)));                              // the lit lip of the cut
  vec3 fill = uSkyCol * (.3 + .08 * N.y) * (1. + 1.2 * inG);
  vec3 lit = c * (fill + uSunCol * sunVis * uGain * (.1 * uLow + .62 * ndl + .2 * back * back * graze * graze * uLow));
  if(thread > 0.){   // the stream mirrors the sky, and the bright sky round the sun even where the sun itself is behind the wall
    vec2 rip = vec2(gn(vec2(gs * 1.1 - uTime * .9, glat * 2.3)), gn(vec2(gs * 1.7 - uTime * 1.3, glat * 3.1 + 4.))) - .5;
    vec3 Rr = reflect(-V, normalize(vec3(rip.x * .12, 1., rip.y * .12)));
    float fres = 1. - max(V.y, 0.); fres *= fres;
    float sp = max(dot(Rr, normalize(vec3(uSunDir.x, max(uSunDir.y, .25), uSunDir.z))), 0.), sp2 = sp * sp; sp2 *= sp2; sp2 *= sp2; sp2 *= sp2;
    float shal = smoothstep(.55, 1., tf);                                                     // shallow over the silt at its edges
    vec3 deepC = mix(uPondDeep * .55, lit * vec3(.6, .7, .8), .18 + .5 * shal);
    float spk = smoothstep(.8, .93, gn(vec2(gs * 4.3 - uTime * 2.6, glat * 6.1)) * .6 + gn(vec2(gs * 9.1 - uTime * 4., glat * 11.) + 3.) * .4);
    vec3 wc2 = mix(deepC, mix(uPondDeep * 1.5, uWater * .5 + uSunCol * .02, sp * sp), fres * .4) * (.86 + .34 * rip.x)
      + uSunCol * (sp2 * sp2 * .025 + .6 * spk * (.25 + .75 * sp * sp)) * (1. - .6 * shal);
    lit = mix(lit, wc2, thread);
  }
  lit += uSunCol * uGrass * tuft * near * .08 * back * (1. - bare) * (1. - riv) * (1. - inG) * sunVis;
  if(water > 0.){
    vec2 rip = vec2(gn(p * .7 + uTime * vec2(.5, .2)), gn(p * .9 - uTime * vec2(.3, .4))) - .5;
    vec3 Rr = reflect(-V, normalize(vec3(rip.x * .16, 1., rip.y * .16)));
    float fres = 1. - max(V.y, 0.); fres = fres * fres * fres;
    float sp = max(dot(Rr, uSunDir), 0.), sp2 = sp * sp; sp2 *= sp2; sp2 *= sp2; float sp3 = sp2 * sp2; sp3 *= sp3;
    float gl = smoothstep(.5, .85, gn(p * 2.3 + uTime * vec2(.7, -.4))) * smoothstep(.35, .7, gn(p * .9 - uTime * vec2(.2, .5)));
    // (m7) THE RIVER HAS DEPTH. Looked into (not along), a channel darkens toward its middle and the shallows at its margins show
    // the bed; along the water (fres near 1) it is live's bright mirror, untouched. THE GLITTER SPARKLES: live's glints were laid
    // at one scale (0.4 m), which is under a pixel beyond a few tens of metres, so under the sun the lobes summed to a white sheet.
    // The glints now keep a size that follows the distance (two octaves of cells about a hundredth of the distance across,
    // blended, so nothing pops): points of light with darker ripple between them. The mean under the sun is live's (the glint
    // factor averages .1 in both: .17 and .62 of the two lobes), the points are brighter (to 1.07 and 3.5 against .62 and 1.7).
    float dpt = 1. - smoothstep(.1, .4, rivCh), shal = 1. - smoothstep(.0, .5, dpt);
    float lg = log2(max(dist, 6.)), l0 = floor(lg), lfr = lg - l0, sc0 = exp2(l0) * .011; vec2 q0 = p / sc0, q1 = q0 * .5, dft = uTime * vec2(.9, -.5);
    float gk = mix(smoothstep(.56, .84, gn(q0 + dft)) * smoothstep(.3, .7, gn(q0 * .31 - dft * .3)), smoothstep(.56, .84, gn(q1 + dft)) * smoothstep(.3, .7, gn(q1 * .31 - dft * .3)), lfr);
    float rl = gn(vec2(dot(p, vec2(.8, .6)) * 1.7 + uTime * .5, dot(p, vec2(-.6, .8)) * .45)) * near;   // ripple lines, near
    vec3 wbody = uWater * (.42 + .5 * fres) * (.9 + .25 * rip.x);                                                    // live's body
    wbody = mix(wbody, wbody * vec3(.56, .66, .8) + uPondDeep * .1, smoothstep(.3, 1., dpt) * (1. - .8 * fres));     // the channels darken
    wbody = mix(wbody, lit * vec3(.54, .64, .66), shal * .56 * (1. - fres));                                        // the shallows show the bed (Mend 2: .56 of it, wet and cooler; at .72 the shallows read as sand flats)
    wbody *= 1. - (.1 + .22 * shal) * (rl - .5);                                                                     // (the riffle over a shallow bed)
    vec3 wcol = wbody + uSunCol * (sp2 * sp2 * (.03 + 1.4 * gk) + sp3 * (.12 + 5. * gk)) * sunVis;   // (Mend 1) the same means (.17, .62: gk averages .1), more of it in the points and less between them, so the path under a higher sun sparkles instead of whiting out
    lit = mix(lit, wcol, water * riv);
  }
  if(wetRim > 0.){   // (Mend 2) the wet margin of a bar, looked along: it mirrors the sky as the water beside it does
    float fr = 1. - max(V.y, 0.); fr = fr * fr * fr;
    lit = mix(lit, uWater * (.42 + .5 * fr) * .9, wetRim * fr * .75 * riv * (1. - water));
  }
  if(pond > 0.){   // still water: the deep sky straight down, the bright horizon at a grazing angle, the sun's glitter toward the light
    // (polish m4) shallow meltwater: the silt bed shows through at the rim, olive, then the sky's deep blue where it is a hand deep;
    // long cat's-paws of wind cross it; emergent sedge stands in the shallows; the fine ripple fades with distance (no white specks)
    float nf = 1. - smoothstep(22., 80., dist);
    vec2 rip = vec2(gn(p * 1.3 + uTime * vec2(.35, .15)), gn(p * 1.7 - uTime * vec2(.2, .3))) - .5, rf = (vec2(gn(p * 7. + uTime * vec2(.9, .4)), gn(p * 8.3 - uTime * vec2(.5, .8))) - .5) * nf;
    vec3 Rr = reflect(-V, normalize(vec3(rip.x * .08 + rf.x * .1, 1., rip.y * .08 + rf.y * .1)));
    float fres = 1. - max(V.y, 0.); fres *= fres; fres *= fres;
    float sp = max(dot(Rr, uSunDir), 0.), sp2 = sp * sp; sp2 *= sp2; sp2 *= sp2; sp2 *= sp2; float sp3 = sp2 * sp2; sp3 *= sp3;
    float spk = mix(.12, smoothstep(.74, .92, gn(p * 4.3 + uTime * vec2(1.7, .6)) * .6 + gn(p * 9.1 - uTime * vec2(.9, 2.1)) * .4), nf);   // the sun's glitter as points, not a white sheet
    vec3 bed = uLoess * vec3(.4, .46, .38) * (.75 + .5 * n2) * (uSkyCol * .34 + uSunCol * sunVis * uGain * .3);
    float deepK = smoothstep(.0, mix(.3, .6, pondR), pdep + .25 * (n1 - .5) * pondR);
    // (m7) RUNNING WATER in the threads: the current's lines, drawn along the trough itself (the net's own edge line, turned one way
    // down the plain's fall so both banks agree), slipping downstream; riffles sparkle where the thread pinches
    vec2 tT = vec2(pEn.y, -pEn.x); if(dot(tT, vec2(.5, .866)) < 0.) tT = -tT;
    float sAl = dot(p, tT), tAc = clamp(tedge / max(twid, 1e-3), 0., 1.);
    float cur = gn(vec2(sAl * .7 - uTime * .9, tAc * 3.4)) * .6 + gn(vec2(sAl * 1.9 - uTime * 1.7, tAc * 7. + 3.)) * .4, run = 1. - pondR;
    vec3 body = mix(bed, mix(mix(uPondDeep * 1.5, uWater * .62, .3) * (.88 + .24 * rip.x) * (.78 + .44 * cur), uPondDeep * (.75 + .5 * rip.y), pondR), deepK);
    vec2 wd = vec2(dot(p, vec2(.5, .866)), dot(p, vec2(-.866, .5)));
    float paw = smoothstep(.5, .8, gn(vec2(wd.x * .22 - uTime * .35, wd.y * .9)) * .65 + gn(vec2(wd.x * .7 - uTime * .6, wd.y * 2.9)) * .35);
    body += uWater * .12 * paw * deepK * nf * pondR;
    // (m7) STILL WATER MIRRORS THIS SKY: straight down the deep zenith (the body above), toward a grazing angle the bright horizon
    // warmed on the sun's side, and the high bands lying in it as long soft streaks that slide as we pass
    float ry = clamp(Rr.y, 0., 1.); vec2 Rh = Rr.xz / max(length(Rr.xz), 1e-3), Sh = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
    float toS = max(dot(Rh, Sh), 0.);
    vec3 skyR = mix(mix(uSkyHor, uWater, .5), mix(uSkyZen, uWater, .35) * .8, sqrt(ry));
    skyR = mix(skyR, uScatC, toS * toS * toS * (1. - ry) * .5);
    vec2 cu = Rr.xz / max(Rr.y + .1, .1);
    float cband = smoothstep(.5, .74, gn(vec2(dot(cu, vec2(.8, .6)) * .3 + 3. + uTime * .006, dot(cu, vec2(-.6, .8)) * 1.5)) * .65 + gn(cu * 1.9 + 7.) * .35) * (1. - smoothstep(3., 8., length(cu)));
    skyR = mix(skyR, uCirLit * .9, cband * .5 * pondR);
    float fr5 = 1. - max(V.y, 0.), fS = .05 + .95 * fr5 * fr5 * fr5 * fr5;
    vec3 pc = mix(body, mix(uWater * mix(.7, .95, pondR), skyR, .75), max(fres, fS * pondR * .9) * mix(.45, 1., pondR)) + uSunCol * (sp2 * .05 + sp3 * .1 + spk * sp2 * .55) * sunVis;
    pc += uSunCol * run * smoothstep(.62, .86, cur) * (.03 + .5 * sp2) * sunVis * nf;                    // the riffle's glints
    // (m7) sedge stands in the shallows all round, each stem over its own dark image in the water
    float reed = (1. - smoothstep(.05, .1, fv.z)) * step(.3, fv.y) * (1. - smoothstep(.2, .72, pdep)) * near;
    pc = mix(pc, vec3(.2, .28, .1) * (.6 + .8 * n2) * (uSkyCol * .34 + uSunCol * sunVis * uGain * .4), reed * .8);
    lit = mix(lit, pc, pond);
  }
  gl_FragColor = vec4(lit, 1.);
  #include <fog_fragment>
}
`,zo=`
attribute vec4 iA, iB; attribute vec3 iTint; attribute vec2 aBlade;   // aBlade: (0 root .. 1 tip, blade seed)
uniform float uTime, uShLen; uniform vec3 uFade, uSunDir; uniform vec2 uWind; uniform vec4 uArc;
varying vec3 vWorld, vCol; varying float vH, vKind; varying vec2 vSh;
#include <fog_pars_vertex>
void main(){
  float c = cos(iA.w), s = sin(iA.w), h = aBlade.x;
  vec3 p = vec3(position.x * c - position.z * s, position.y, position.x * s + position.z * c) * vec3(iB.x, iB.y, iB.x);
  vec3 base = iA.xyz; float d = length(cameraPosition - base), keep = 1. - smoothstep(uFade.x, uFade.y, d);
  // wind: gusts cross the plain as visible waves; every blade also shivers on its own
  float gust = sin(dot(base.xz, uWind) * .075 - uTime * 1.5) * .5 + .5; gust *= gust;
  float gust2 = sin(dot(base.xz, vec2(-uWind.y, uWind.x)) * .05 + dot(base.xz, uWind) * .021 - uTime * .7) * .5 + .5;
  float bend = (.05 + .22 * gust * (.5 + .5 * gust2)) * h * h * (1. - .6 * iB.z) + .012 * h * sin(uTime * 5. + aBlade.y * 40. + iB.w * 9.);
  p.xz += uWind * bend * iB.y * 1.6; p.y -= bend * bend * iB.y * .8;
  if(iB.z > 1.5 && h < .1) p.xz *= max(1., d * .0016 / (.006 * iB.x));   // a flower stalk stays a pixel and a half wide at its distance
  if(h < -.5){   // the bunch's shadow: a fan laid on the ground away from the sun, following the swell
    vec2 sd = -uSunDir.xz / max(length(uSunDir.xz), 1e-3), o = vec2(-sd.y, sd.x) * position.x * iB.x * 1.3 + sd * position.y * iB.y * uShLen;
    float w = max(uArc.z, 1.), q0 = length(base.xz - vec2(0., uArc.x)) - uArc.x, q1 = length(base.xz + o - vec2(0., uArc.x)) - uArc.x;
    p = vec3(o.x, uArc.y * (exp(-(q1 * q1) / (w * w)) - exp(-(q0 * q0) / (w * w))) + .06, o.y);
  }
  vec4 wp = modelMatrix * vec4(base + p * keep, 1.);
  vWorld = wp.xyz; vH = h; vKind = iB.z; vSh = vec2(position.x / .42, position.y); vCol = iTint * (iB.z > 1.5 ? 1. : .85 + .3 * fract(aBlade.y * 7.31));
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,da=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uRoot, uTip, uSageC; uniform float uLow, uTime;
varying vec3 vWorld, vCol; varying float vH, vKind;
#include <fog_pars_fragment>
${Xt}
void main(){
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.));
  float back = max(0., -dot(V, uSunDir)), h = clamp(vH, 0., 1.);
  vec3 fes = mix(uRoot, uTip, h * h) , sg = uSageC * (.45 + .65 * h);
  vec3 c = vKind > 1.5 ? mix(uRoot * .7, vCol * (.75 + .35 * h), smoothstep(.3, .6, h)) : mix(fes, sg, vKind) * vCol;
  vec2 p = vWorld.xz;
  float cs = cloudShade(p, uTime);
  float sun = (1. - .64 * cs) * (.1 * uLow + .62 * max(uSunDir.y, 0.) + h * (.22 + 1.5 * back * back * uLow));
  gl_FragColor = vec4(c * (uSkyCol * (.26 + .12 * h) + uSunCol * sun), 1.);
  #include <fog_fragment>
}
`,ca=`
uniform vec3 uShadowCol; uniform float uShOp, uTime;
varying vec3 vWorld; varying vec2 vSh;
${Xt}
void main(){
  float v = vSh.y, u = abs(vSh.x) / max(v, .04);
  float a = (1. - smoothstep(.35, 1., u)) * smoothstep(0., .1, v) * (1. - smoothstep(.45, 1., v)) * uShOp * (1. - .9 * cloudShade(vWorld.xz, uTime));
  gl_FragColor = vec4(mix(vec3(1.), uShadowCol, clamp(a, 0., 1.)), 1.);
}
`;function fa(u=6){const d=[],I=[];for(let O=0;O<u;O++){const v=O/u*gt+.9*Math.sin(O*12.9898),ee=.18+.5*Math.abs(Math.sin(O*78.233+1)),Z=.72+.28*Math.abs(Math.sin(O*37.7+2)),p=Math.cos(v),s=Math.sin(v),V=.1,he=.085;d.push(p*V-s*he,0,s*V+p*he,p*V+s*he,0,s*V-p*he,p*(V+ee*Z),Z*Math.cos(ee),s*(V+ee*Z));const j=(O+.5)/u;I.push(0,j,0,j,1,j)}const P=new e.BufferGeometry;return P.setAttribute("position",new e.Float32BufferAttribute(d,3)),P.setAttribute("aBlade",new e.Float32BufferAttribute(I,2)),P}function ma(){const u=[-.006,0,0,.006,0,0,0,.2,0],d=[0,.3,0,.3,.25,.3],I=[0,.2,0],P=.05;for(let v=0;v<4;v++){const ee=v*Math.PI/2+.12,Z=(v+1)*Math.PI/2-.12,p=(ee+Z)/2,s=.2+v*.2,V=(g,m,l)=>[I[0]+Math.cos(g)*m,I[1]+Math.sin(g)*m*.7+l*.7,I[2]-Math.sin(g)*m*.7+l*.7],he=V(ee,P*.8,.022),j=V(Z,P*.8,.022),T=V(p,P*1.15,.034);u.push(...I,...he,...T,...I,...T,...j),d.push(.55,s,1,s,1,s,.55,s,1,s,1,s)}const O=new e.BufferGeometry;return O.setAttribute("position",new e.Float32BufferAttribute(u,3)),O.setAttribute("aBlade",new e.Float32BufferAttribute(d,2)),O}async function Co(u){const{rng:d,path:I,land:P,keep:O,noise:v,pause:ee}=u,Z=u.count,p=new Float32Array(Z*4),s=new Float32Array(Z*4),V=new Float32Array(Z*3),he=new e.Vector3,j=new e.Vector3;let T=0;for(let i=0;i<Z;i++){const n=d.range(-.03,1),A=u.radius*Math.pow(d(),u.bias)*(d()<.5?-1:1),x=d()*gt,k=d(),b=d(),B=d(),H=d();I.pointAt(n,he),I.tangentAt(Math.min(1,Math.max(0,n)),j);const ne=he.x-j.z*A,re=he.z+j.x*A,ze=O(ne,re);if(ze<=0||H>ze)continue;const Se=v.n2(ne*.03+77,re*.03+5)>.25&&B<.5?1:0,ke=.75+.6*k;if(u.flowers){const oe=u.flowers[Math.min(u.flowers.length-1,Math.floor(B*u.flowers.length))],pe=1.5+.8*k;p.set([ne,P(ne,re)-.01,re,u.yaw+(b-.5)*.5],T*4),s.set([pe,pe*(.8+.5*b),2,b],T*4),V.set([oe.r,oe.g,oe.b],T*3)}else{p.set([ne,P(ne,re)-.02,re,x],T*4),s.set(Se?[.5*ke,.22*ke,1,b]:[.42*ke,.48*ke*(.8+.4*B),0,b],T*4);const oe=.8+.4*b;V.set([oe*(1+.1*(B-.5)),oe,oe*(1-.15*B)],T*3)}T++,i%600===599&&await ee()}const g=new e.InstancedBufferGeometry,m=u.geometry||fa(u.blades||6);g.setAttribute("position",m.getAttribute("position")),g.setAttribute("aBlade",m.getAttribute("aBlade")),g.setAttribute("iA",new e.InstancedBufferAttribute(p.subarray(0,T*4),4)),g.setAttribute("iB",new e.InstancedBufferAttribute(s.subarray(0,T*4),4)),g.setAttribute("iTint",new e.InstancedBufferAttribute(V.subarray(0,T*3),3)),g.instanceCount=T,g.boundingSphere=new e.Sphere(new e.Vector3(0,0,60),420);const l=new e.ShaderMaterial({uniforms:u.flowers?u.uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),...u.uniforms},vertexShader:zo,fragmentShader:da,fog:!0,side:e.DoubleSide}),c=new e.Mesh(g,l);c.frustumCulled=!1;let S=null;if(u.shadow){const i=new e.InstancedBufferGeometry;i.setAttribute("position",new e.Float32BufferAttribute([0,0,0,-.42,1,0,.42,1,0],3)),i.setAttribute("aBlade",new e.Float32BufferAttribute([-1,0,-1,0,-1,0],2));for(const n of["iA","iB","iTint"])i.setAttribute(n,g.getAttribute(n));i.instanceCount=T,i.boundingSphere=g.boundingSphere,S=new e.Mesh(i,new e.ShaderMaterial({uniforms:{...l.uniforms,...u.shadow},vertexShader:zo,fragmentShader:ca,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.ZeroFactor,blendDst:e.SrcColorFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),S.frustumCulled=!1,S.renderOrder=.9}return{object:c,count:T,material:l,shadow:S}}const pa=`
attribute vec3 aCol; attribute vec2 aSway;
uniform float uTime;
varying vec3 vCol, vWP; varying float vLit;
#include <fog_pars_vertex>
void main(){
  vec3 p = position; vWP = position;
  float sw = aSway.x * (.07 * sin(uTime * 1.6 + p.x * 2.3 + p.z * 1.7) + .04 * sin(uTime * 3.1 + p.x * 5.1));
  p.x += sw; p.z += sw * .7;
  vCol = aCol; vLit = aSway.y;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,va=`
uniform vec3 uSunDir, uSunCol, uSkyCol; uniform float uLow, uGain;
varying vec3 vCol, vWP; varying float vLit;
#include <fog_pars_fragment>
${Oe}
void main(){
  float mt = gn(vWP.xz * 2.3) * .45 + gn(vWP.xz * 5.9 + 3.) * .33 + gn(vWP.xz * 13. + 9.) * .22;
  vec3 c = vCol * mix(1., .72 + .6 * smoothstep(.35, .65, mt), vLit) * (uSkyCol * (.34 + .5 * (1. - vLit)) + uSunCol * uGain * vLit * (.3 * uLow + .62 * max(uSunDir.y, 0.)));
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}
`,ga=`
attribute vec3 aW; attribute vec2 aWN; attribute vec4 aWf; attribute float aWx;
varying vec3 vW, vWorld; varying vec2 vWN; varying vec4 vWf; varying float vWx;
#include <fog_pars_vertex>
void main(){
  vW = aW; vWN = aWN; vWf = aWf; vWx = aWx; vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,wa=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uSilt, uIce, uLoess; uniform float uTime, uGain, uLow, uLitD;
varying vec3 vW, vWorld; varying vec2 vWN; varying vec4 vWf; varying float vWx;
#include <fog_pars_fragment>
${Oe}
void main(){
  float s = vW.x, h = max(vW.y, 0.), D = max(vW.z, .5), y = vWorld.y, dist = length(cameraPosition - vWorld), near = 1. - smoothstep(18., 60., dist);
  // (polish m3) ICE WEDGES are ground ice IN the wall, not something hanging in front of it: a V of solid banded grey-blue ice
  // 2 to 3 m wide under the thawed layer, tapering to a point; the silt beds beside it are dragged UP against its flanks
  // (as real wedges do), a dark thawed gap outlines it, the ice face stands a little proud and wet, so it carries a sheen of
  // sky down one side and dripping glints, and it is foliated in upright milky and clear bands with silt frozen into it.
  // (polish m4) where the wedges stand comes from the mesh (aWf: metres along the wall from the nearest wedge's middle, its top
  // half-width, its share of the wall's depth, its seed); the ice itself is a body standing proud of this wall ('ice-wedges'),
  // and what this shader draws under and round it is its shadowed socket, the upturned beds and the seepage
  float wf = max(vWf.x, 0.), wi = floor(clamp(vWf.w, 0., 1.) * 16. + .5), wtop = max(vWf.y, 0.), wdeep = D * clamp(vWf.z, .2, .7);
  float wt = clamp(1. - (h - .45) / max(wdeep, .5), 0., 1.), has = step(.5, wtop) * step(3., D);
  float whalf = wtop * pow(max(wt, 1e-4), .6) * 1.08 - .13 + (.22 * (gn(vec2(wi * 7.3, y * 1.3)) - .5) + .07 * (gn(vec2(s * 2.7, y * 5.)) - .5)) * step(.01, wt);
  float aa = .03 + dist * .0012, apron = smoothstep(.74, .9, h / (D + .35));
  float inW = step(0., whalf) * smoothstep(.4, .55, h) * has * (1. - apron);
  float wedge = (1. - smoothstep(whalf - aa, whalf + aa, abs(wf))) * inW;
  float flank = exp(-max(abs(wf) - max(whalf, 0.), 0.) / .9) * has * step(.01, wt) * (1. - apron);   // 1 at the ice, fading into the bank
  // level beds: each its own tone, a dark line under every ledge; they undulate, pinch, and turn up against a wedge
  float by = (y - .55 * flank * flank) * 3.1 + .5 * gn(vec2(s * .11, y * .3)) + .25 * gn(vec2(s * .6, 7.)), bi = floor(by), bf = fract(by);
  float tone = gh(vec2(bi, 3.)), tone2 = gh(vec2(bi, 11.));
  vec3 silt = uSilt * (2.8 + 1.5 * tone + 1.2 * gn(vec2(s * .9, y * 2.3)));
  silt = mix(silt, uLoess * .6, step(.84, tone2) * .4);                                   // a paler sandy bed now and then
  silt = mix(silt, uSilt * 1.5, step(tone2, .12) * .7);                                    // a peaty one
  silt *= 1. - .34 * (1. - smoothstep(.0, .16, bf)) * (.4 + .6 * near);
  // clods and cracks up close
  float cl = gn(vec2(s * 3.3, y * 3.7)) * .6 + gn(vec2(s * 8.1 + 5., y * 9.3)) * .4, crk = smoothstep(.47, .5, cl) * (1. - smoothstep(.5, .53, cl));
  silt *= (.82 + .36 * cl) * (1. - .5 * crk * near);
  // the thawed layer under the turf, and the apron of slumped silt at the foot
  float act = 1. - smoothstep(.35, .8, h + .25 * gn(vec2(s * 1.3, 2.)));
  silt = mix(silt, vec3(.4, .27, .16) * (.8 + .5 * cl), act * .85);
  silt = mix(silt, uSilt * (3.4 + 1.6 * cl) * vec3(1.06, 1., .92), apron);
  // the ice: upright foliation, a dark frost crack down its middle, silt streaks, darker and bluer with depth
  float xr = clamp(wf / max(whalf, .08), -1., 1.), edge = xr * xr;
  float fol = .5 + .5 * sin(wf * 17. + 2.2 * gn(vec2(wf * 3., y * .35)) + wi * 2.), fol2 = gn(vec2(wf * 31. + wi, y * .4));
  vec3 ice = mix(uIce, vec3(dot(uIce, vec3(.3333))) * vec3(1.02, 1., .98), .68) * (.86 + .22 * fol + .16 * (fol2 - .5));
  ice = mix(ice, silt * 1.1, .45 * smoothstep(.5, .72, gn(vec2(s * .4 + wi, y * 2.6))));               // the silt beds run on through it
  ice = mix(ice, vec3(.8, .86, .9) * .6, .35 * smoothstep(.6, .9, fol2) * near);                       // milky bubble bands
  ice = mix(ice, uSilt * 2.6, .5 * smoothstep(.62, .8, gn(vec2(wf * 11. + wi * 5., y * .22))));       // silt frozen into it in upright streaks
  ice = mix(ice, uSilt * 1.6, (1. - smoothstep(.02, .07 + dist * .001, abs(wf + .12 * (gn(vec2(wi, y * 1.1)) - .5)))) * .7);   // the frost crack
  ice *= (1. - .45 * edge * edge) * (.78 + .3 * wt);                                                     // rounded: darker toward its flanks and its point
  // (m7) the thawed gap round the ice is a hand to a forearm wide and black: the ice sits IN the bank, back from its face (the body's flanks sink behind this surface)
  float gap = (1. - smoothstep(.03, .2 + dist * .001, abs(abs(wf) - whalf + .05))) * inW;
  // (m7) WET ROCK behind the falls: the bank is soaked dark under and beside the falling water, widening downward, ragged at its edges
  float wetF = (1. - smoothstep(.45, 1.25 + .1 * h, abs(vWx) + .5 * (gn(vec2(s * 1.7, y * .55)) - .5))) * smoothstep(.25, .8, h) * step(3., D);
  silt *= mix(vec3(1.), vec3(.5, .53, .6), wetF);
  vec3 c = mix(silt * (1. - .82 * gap), ice * (1. - .5 * gap), wedge);
  c *= 1. - .3 * wedge * (1. - smoothstep(.45, 1.1, h));                                                 // the overhang of thawed soil shades its head
  // light: sun on the top of the sunward wall only, sky shade below, a little bounce off the floor
  vec2 sh = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  float facing = smoothstep(.05, .45, dot(vWN, sh)), lit = facing * (1. - smoothstep(uLitD - .35, uLitD + .45, h + .3 * gn(vec2(s * .35, 5.))));
  vec3 fill = uSkyCol * (.52 + .4 * (1. - h / (D + .35))) + uSkyCol * uLoess * .16 + uSunCol * .035;
  vec3 col = c * (fill + uSunCol * uGain * lit * (.55 + .25 * uLow));
  // wet sheen: the ice face is a low rounded boss, so one side of it mirrors the open sky above the far rim; meltwater runs down it
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.)), Nw = normalize(vec3(vWN.x, .25, vWN.y) + vec3(-vWN.y, 0., vWN.x) * xr * .8 + vec3(0., .5, 0.) * (fol - .5) * .5 + vec3(0., 1e-4, 0.));
  vec3 Rw = reflect(-V, Nw); float skyUp = smoothstep(.15, .7, Rw.y), fr = 1. - max(dot(V, Nw), 0.); fr = .08 + .92 * fr * fr * fr;
  vec3 sheenC = mix(uSkyCol, vec3(dot(uSkyCol, vec3(.3333))), .55);
  col += sheenC * wedge * (.04 * skyUp + .16 * fr * skyUp) * (.6 + .4 * smoothstep(.3, .7, gn(vec2(wf * 1.3 + wi, y * .8))));
  float gl = (1. - smoothstep(.0, .04 + dist * .0012, abs(fract(wf * 1.7 + gh(vec2(wi, 13.))) - .5))) * wedge;
  float dash = smoothstep(.55, .95, .5 + .5 * sin(y * 3.3 + uTime * 3. + 6.28 * gh(vec2(floor(wf * 1.7), wi))));
  col += (sheenC * .5 + uSunCol * .06) * gl * (.01 + .12 * dash) * step(.55, gh(vec2(floor(wf * 1.7), wi + 3.)));
  col = mix(col, col * vec3(.72, .78, .86), flank * (1. - wedge) * .35 * smoothstep(.4, .9, h));       // seepage darkens the bank beside it
  col += sheenC * wetF * (1. - wedge) * (.03 + .1 * fr) * skyUp * smoothstep(.45, .7, gn(vec2(s * 5., y * 1.4 - uTime * .6)));   // (m7) the wet bank glistens where the water runs over it
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`,xa=`
attribute vec4 aI;
varying vec4 vI; varying vec3 vWorld, vN;
#include <fog_pars_vertex>
void main(){
  vI = aI; vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.)); vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,ba=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uSilt, uIce, uLoess; uniform float uTime, uGain, uLow, uLitD;
varying vec4 vI; varying vec3 vWorld, vN;
#include <fog_pars_fragment>
${Oe}
void main(){
  float x = vI.x, h = max(vI.y, 0.), t = clamp(vI.z, 0., 1.), seed = vI.w * 16., y = vWorld.y, dist = length(cameraPosition - vWorld), near = 1. - smoothstep(14., 50., dist);
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.)), N = normalize(vN + vec3(0., 1e-4, 0.)); if(dot(N, V) < 0.) N = -N;
  // upright foliation: milky bubbly bands and clear dark ones a finger to a hand wide, wavering
  float wv = x + .1 * (gn(vec2(x * 2.3 + seed, y * .5)) - .5);
  float fol = .5 + .5 * sin(wv * 12. + 1.5 * gn(vec2(wv * 3., y * .3)) + seed * 5.), fol2 = gn(vec2(wv * 27. + seed * 3., y * .45)), flu = gn(vec2(wv * 5.5 + seed, y * .3));
  vec3 base = mix(uIce, vec3(dot(uIce, vec3(.3333))) * vec3(.99, 1., 1.02), .8) * 1.02;
  vec3 ice = mix(base * .86, base * 1.08, smoothstep(.3, .7, fol * .6 + fol2 * .4));
  float blk = fract(y * 1.3 + .8 * gh(vec2(floor(wv * 1.6 + seed), seed)) + .2 * gn(vec2(x * 2., y)));
  ice *= 1. - .3 * (1. - smoothstep(.0, .06 + dist * .0015, abs(blk - .5))) * step(.35, gh(vec2(floor(wv * 1.6 + seed), floor(y * 1.3))));   // it breaks in blocks: level fractures, offset from one column to the next
  ice = mix(ice, vec3(.74, .8, .84) * .55, .22 * smoothstep(.66, .9, fol2) * near);                              // milky bubble bands
  ice = mix(ice, uSilt * 2.4, .45 * smoothstep(.6, .78, gn(vec2(wv * 12. + seed * 5., y * .22))) * (.6 + .4 * near));     // silt frozen in, in upright streaks
  float part = fract(y * 1.9 + .35 * gn(vec2(x * 1.3 + seed, y * .7)));
  ice = mix(ice, uSilt * 2.9, .45 * smoothstep(.86, .93, part) * (1. - smoothstep(.95, 1., part)) * step(.4, gn(vec2(floor(y * 1.9), seed))));   // a level dirty parting now and then: the beds it grew through
  ice = mix(ice, uSilt * 1.4, (1. - smoothstep(.015, .05 + dist * .001, abs(x + .1 * (gn(vec2(seed, y * 1.1)) - .5)))) * .75);   // the frost crack
  ice *= (.7 + .36 * t) * (.8 + .4 * flu);                                                                               // darker toward its point; fluted
  ice *= 1. - .4 * (1. - smoothstep(.3, .95, h));                                                                         // under the overhang of thawed soil and sod
  // light: the sun reaches only the head of the sunward wall; the rest is open shade from the sky above, so the form reads
  // from what each facet sees of the sky
  vec2 sh = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  float facing = smoothstep(.05, .45, dot(normalize(N.xz + vec2(1e-4, 0.)), sh)), lit = facing * (1. - smoothstep(uLitD - .35, uLitD + .45, h));
  vec3 fill = mix(uSkyCol, vec3(dot(uSkyCol, vec3(.3333))), .35) * (.26 + .42 * smoothstep(-.5, .8, N.y) + .2 * abs(dot(N, V))) + uSkyCol * uLoess * .14 + uSunCol * .03;
  vec3 col = ice * (fill + uSunCol * uGain * lit * .3);
  // wet sheen: the sky above the far rim mirrored on every shoulder that leans back; a tight glint where a bulge faces it
  vec3 Rw = reflect(-V, N); float fr = 1. - max(dot(V, N), 0.); fr = .06 + .94 * fr * fr * fr;
  vec3 sheenC = mix(uSkyCol, vec3(dot(uSkyCol, vec3(.3333))), .45);
  col += sheenC * fr * smoothstep(-.05, .55, Rw.y) * .42;
  float gl = max(dot(Rw, normalize(vec3(sh.x * .5, .85, sh.y * .5))), 0.); gl *= gl; gl *= gl; gl *= gl; gl *= gl;
  col += (sheenC * .55 + uSunCol * .1) * gl * (.5 + .5 * flu);
  // meltwater: thin bright runs slipping down the flutes, and a drop now and then
  float run = (1. - smoothstep(.0, .035 + dist * .0012, abs(fract(wv * 2.3 + seed * .37) - .5))) * step(.5, gh(vec2(floor(wv * 2.3 + seed * .37), seed)));
  float dash = smoothstep(.5, .95, .5 + .5 * sin(y * 3.1 + uTime * 3. + 6.28 * gh(vec2(floor(wv * 2.3 + seed * .37), 3.))));
  col += sheenC * run * (.015 + .1 * dash) * smoothstep(.3, .8, h);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`,To=`
attribute vec4 iA, iB;
uniform float uTime, uPlume, uSwellH, uSoft; uniform vec4 uArc, uRampP, uPl; uniform vec3 uSunDir;   // uPl: (1 = it stands on level ground, that ground's y, height scale, size scale)
varying vec2 vUV; varying float vAlpha, vBack, vSeed, vH, vSoft; varying vec2 vSunS;
#include <fog_pars_vertex>
void main(){
  float seed = iA.w, life = fract(uTime * iB.x + seed * 17.3), h = life * (2. - life);
  float q = uRampP.y + uRampP.z * (.3 + .8 * iA.y) + 5. * iA.x * (1. - h);
  float k = smoothstep(uRampP.y, uRampP.y + uRampP.z, q), sw = q / max(uArc.z, 1.);
  float gy = mix(-uSwellH * (1. - exp(-sw * sw)) - uRampP.w * k, uPl.y, uPl.x);
  float spr = mix(1., uPl.w * .6, uSoft);
  float a = uRampP.x + 27. + spr * (8. * iB.y + h * (8. + 16. * iB.w)) + 1.5 * sin(uTime * .11 + seed * 40.);
  float ph = a / uArc.x, rr = uArc.x + q;
  float top = 27. * (.4 + .6 * iB.z) * (1. - .35 * iA.y) * uPl.z;
  vec3 c = vec3(rr * sin(ph), gy + 2. + h * top, uArc.x - rr * cos(ph));
  float size = iA.z * (.55 + .6 * h) * (1. - .3 * h * iB.z) * uPl.w;
  float alpha = smoothstep(0., mix(.1, .035, uSoft), life) * (1. - smoothstep(.78, 1., life)) * uPlume;   // (the column on the bars stands on its own dust: its foot is as dense as its body)
  vec4 wp = modelMatrix * vec4(c, 1.), mvPosition = viewMatrix * wp;
  mvPosition.xy += position.xy * size;
  alpha *= smoothstep(12., 30., -mvPosition.z); vSoft = uSoft * (1. - smoothstep(150., 195., -mvPosition.z));   // from the file it is the far plume it always was; nearer, seen against the light, it softens
  vec3 V = normalize(cameraPosition - wp.xyz + vec3(0., 1e-4, 0.));
  vBack = -dot(V, uSunDir); vUV = position.xy; vAlpha = alpha; vSeed = seed; vH = h;
  vec3 sv = (viewMatrix * vec4(uSunDir, 0.)).xyz; vSunS = sv.xy / max(length(sv.xy), .35);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Bo=`
uniform vec3 uSunCol, uSkyCol, uDust, uShade; uniform float uAlpha, uTime, uSoft;
varying vec2 vUV; varying float vAlpha, vBack, vSeed, vH, vSoft; varying vec2 vSunS;
#include <fog_pars_fragment>
${Oe}
void main(){
  float r = length(vUV); if(r > 1.) discard;
  float bil = gn(vUV * 2.3 + vSeed * 31. + vec2(0., -uTime * .04)) * .6 + gn(vUV * 5.3 + vSeed * 7.) * .4;   // billows
  // (polish m4) uSoft: the column on the bars is seen against the light from our wheel: every head melts into the air at its
  // edge (no outline), its shaded cells are filled by the light that passes through the dust (no dark holes), its rim glows
  float sf = clamp(vSoft, 0., 1.), rr = r + (bil - .5) * .5;
  float a = (1. - smoothstep(mix(.58, .44, sf), mix(.84, .93, sf), rr)) * clamp(vAlpha, 0., 1.) * uAlpha;
  if(a < .004) discard;
  float side = clamp(.5 + .62 * dot(vUV, vSunS) + .45 * (bil - .5), 0., 1.), back = clamp(vBack, 0., 1.), front = clamp(-vBack, 0., 1.);     // each puff has a lit and a shaded side
  vec3 lit = uDust * (uSkyCol * .12 + uSunCol * (.2 + .22 * back * back));
  vec3 shade = uShade * (uSkyCol * .26 + uSunCol * .05); shade = mix(shade, lit * vec3(.8, .72, .72), .55 * sf);
  vec3 c = mix(shade, lit, smoothstep(.2, .8, side * .8 + .2 * (.5 + .5 * vUV.y) + .4 * front * (.4 + .6 * bil))) * mix(.82, 1.06, clamp(vH, 0., 1.));
  c += uDust * uSunCol * .3 * back * back * smoothstep(.3, .75, rr) * (1. - .45 * sf);   // against the sun the rim of every head burns
  c += uDust * uSunCol * .07 * sf * (1. - smoothstep(.0, .5, a));                                // ... and its thin edge lets the light through
  gl_FragColor = vec4(min(c, vec3(.9)), a);
  #include <fog_fragment>
}
`,ya=`
attribute vec4 aF; attribute vec3 aFN;
varying vec4 vF; varying vec3 vFN, vWorld;
#include <fog_pars_vertex>
void main(){
  vF = aF; vFN = aFN; vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Sa=`
uniform vec3 uSunDir, uSunCol, uSkyCol; uniform float uTime, uGain, uLow, uLitD;
varying vec4 vF; varying vec3 vFN, vWorld;
#include <fog_pars_fragment>
${Oe}
void main(){
  float x = clamp(vF.x, -1., 1.) * 1.05, y = max(vF.y, 0.), L = max(vF.z, 1.), seed = vF.w * 50., h = max(vFN.z, 0.);
  float dist = length(cameraPosition - vWorld), px = dist * .0012;                    // (Mend 2) the least breadth a bright thread is seen at: 1.2 mm for each metre of straight distance, four minutes of arc. White water against wet dark rock is seen by its glare, which an eye spreads over three to five minutes of arc however thin the thread is, so at 50 m a finger of water reads 6 cm wide
  float yn = clamp(y / L, 0., 1.), tau = sqrt(y + .3);                                // tau: time since the lip, by the law of falling (y is clamped above)
  float edge = 1. - x * x / 1.1025; edge = clamp(edge, 0., 1.); edge *= edge;         // nothing reaches the ribbon's edge
  float ends = smoothstep(0., .5, y) * (1. - smoothstep(L - 1.1, L - .1, y));
  float water = 0., halo = 0.;
  for(int i = 0; i < 4; i++){
    float fi = float(i), id = fi * 7.31 + seed;
    float cx = (fi - 1.5) * .34 + .16 * (gh(vec2(id, 1.)) - .5) + .07 * sin(y * 1.1 + id * 3.) + .1 * (gn(vec2(y * .5 - uTime * 3., id)) - .5) * (.4 + yn);
    float alive = smoothstep(.3, .5, gn(vec2(y * .16 - uTime * 1.1, id * 1.7 + 3.)) + .25 * (1. - yn));   // a thread gives out and takes up again
    float wd = .045 + .11 * gn(vec2(y * .55 - uTime * 3.4, id * 2.3)) + .03 * yn;                        // it swells to a hand and a half and pinches to two fingers
    float w = max(wd, px * .9), d = abs(x - cx);
    float ph = (tau * .452 - uTime) * 8.4 + gh(vec2(id, 5.)) * 9., bi = floor(ph), bf = ph - bi;             // beads, let go one after another
    float bead = smoothstep(.0, .3, bf) * (1. - smoothstep(.4, 1., bf)) * (.35 + .65 * step(.22, gh(vec2(bi, id))));   // (Mend 2) a bead swells and tails off (it began and ended at a step, and near the lens a thread's edge was stair-stepped)
    float strand = mix(1., .72 + .56 * gn(vec2((x - cx) * 70. + id, y * 1.3 - uTime * 6.)), 1. - smoothstep(8., 30., dist));   // near the lens a thread is strands of water, not a ribbon
    float line = (1. - smoothstep(w * .45, w, d)) * alive * (.42 + .58 * bead) * strand * min(1., wd / max(w, 1e-3) + .45);
    water = max(water, line);
    halo += exp(-d * d / ((.003 + .016 * yn + px * px))) * alive * (.25 + .75 * bead);
  }
  float mistN = gn(vec2(x * 3.4, y * .9 - uTime * 5.)) * .6 + gn(vec2(x * 9., y * 2.3 - uTime * 11. + 5.)) * .4;
  float spray = clamp(halo * .3, 0., .5) * (.4 + .9 * mistN) + .1 * yn * yn * yn * smoothstep(.4, .75, mistN);
  float a = clamp(water * .95 + spray * (.5 + .5 * yn), 0., .96) * edge * ends;
  if(a < .004) discard;
  // white water: the sky's light all down it, and the sun on the top of the sunward wall (the wall's own law: uLitD)
  vec2 sh = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  float facing = smoothstep(.05, .45, dot(vFN.xy, sh)), lit = facing * (1. - smoothstep(uLitD - .35, uLitD + .45, h));
  vec3 col = vec3(.93, .96, 1.) * (uSkyCol * (.95 + .25 * water) + uSunCol * uGain * lit * (.75 + .3 * uLow) * (.6 + .4 * water)) + uSunCol * .04;
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}
`,ka=`
attribute vec4 iA, iB;
uniform float uTime;
varying vec2 vUV; varying float vA, vSeed;
#include <fog_pars_vertex>
void main(){
  float life = fract(uTime * (.16 + .1 * fract(iB.x * 7.7)) + iB.x), sz = iA.w * (.55 + .8 * life);
  vec3 c = iA.xyz + vec3(iB.z, 0., iB.w) * life * .9 + vec3(0., 1.3 * life * (2. - life), 0.);
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(c, 1.);
  mvPosition.xy += position.xy * sz * vec2(2.3, .8);   // (Mend 1) each tuft lies low and long, so the six of a fall run into one drift along the wall's foot
  vUV = position.xy; vSeed = iB.x; vA = iB.y * smoothstep(0., .2, life) * (1. - life);   // (it thins with its own life only: no term of the eye; it keeps off the route by where it is seated: verify-m7b/r2_mist.mjs)
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Aa=`
uniform vec3 uSunCol, uSkyCol; uniform float uTime;
varying vec2 vUV; varying float vA, vSeed;
#include <fog_pars_fragment>
${Oe}
void main(){
  float r2 = dot(vUV, vUV); if(r2 >= 1.) discard;
  float n = gn(vUV * vec2(4.2, 2.2) + vSeed * 40. + vec2(0., -uTime * .3)), rr = sqrt(r2) + .55 * (n - .5);   // (Mend 1) torn at its rim: a drift, not a ball
  float a = (1. - smoothstep(.15, 1., rr)) * clamp(vA, 0., 1.) * (.6 + .8 * n);
  gl_FragColor = vec4(vec3(.92, .95, 1.) * uSkyCol * 1.05 + uSunCol * .03, a);
  #include <fog_fragment>
}
`,Ma=`
attribute vec4 iA; attribute mat3 iF;   // (m7b) iF, nine numbers a card from the stream 'm7b-fords': (its turning number, the first animal's size draw, the second's), (the third's, the fourth's, the first gap), (the second gap, the third, whether a fourth runs with them)
uniform float uWalk, uTime, uRiverY, uNearQ[6]; uniform vec4 uArc; uniform vec3 uSunDir;
varying vec2 vUV; varying float vVis, vSeed, vKind; varying vec4 vW, vAx, vAs;
${ra}
${Mo}
#include <fog_pars_vertex>
vec3 arcP(float a, float q){ float ph = a / uArc.x, rr = uArc.x + q; return vec3(rr * sin(ph), uRiverY, uArc.x - rr * cos(ph)); }
const float FORD_FOUR = .85;   // the share of the animal cards that carry a fourth animal (see below)
float sizeOf(float u){ return u < .17 ? .72 : .85 + .15 * (u - .17) / .83; }   // this year's young at the tiers' own share and size (the piece's SAIGA_VERT: .17, .72); a grown one .85 to 1, the spread live deals its cards; none larger than the one size m7 drew
void main(){
  float seed = iA.w, span = max(uQ.y - uQ.x, 1.), run = uFlow * (.94 + .12 * fract(seed * 7.7)) + iA.y * span, q = uQ.x + fract(run / span) * span;
  // (the fords' law itself, six loose drifts fanning out over the bars, is fordAt in the piece's SAIGA_FLOW_GLSL: live's lines, moved)
  float a1 = fordAt(iA.x, q, seed);
  vec3 P = arcP(a1, q), P2 = arcP(fordAt(iA.x, q + 1., seed), q + 1.);
  float vis = step(uQ.z, q) * smoothstep(0., 10., q - uQ.x) * smoothstep(0., 60., uQ.y - q);
  vec3 rt = normalize(vec3(cameraPosition.z - P.z, 0., P.x - cameraPosition.x) + vec3(1e-4, 0., 0.));
  float big = max(1., length(cameraPosition - P) * .0036);   // far off each card stands for a knot of animals, so the fords stay dotted lines
  // (m7b) ONE THING OR THE OTHER. A card is three or four whole animals (kind 1) or the knot, live's block (kind 0), and nothing
  // between. Over the 40 m of its ford's run round that line's own near reach (see FORD_NEAR in build) each card has a turning
  // place of its own, the stretch's start plus its number times the stretch's length: animals before it, a knot beyond. So the
  // share of animal cards falls evenly along the stretch and no line lies across the fords where one kind ends.
  float nq = uNearQ[int(clamp(floor(iA.x * 3.) + 3., 0., 5.))], kind = step(q, nq - 20. + 40. * iF[0].x);
  // (m7b) IT STANDS IN THE WATER BY WHERE IT STANDS, animals and knot alike: on the plain's true surface, sunk by the river's own
  // law under its own place and by nothing else (riverAt, the piece's): of a card one metre tall, to the hock (0.12) at the
  // waterline, to the belly (0.38) in mid channel; the land hides what is under water. Live's size law (big) scales the card
  // whole, the sink, the bob of its stride and so the waterline with it: the only term of the eye in the card. (The bob is
  // live's 3 cm for a whole card within 278 m, where big is 1; it grows and fades with the card.)
  vec3 rv = riverAt(P.xz); float sunk = (.12 + .26 * rv.y) * rv.x, bob = .03 * sin(run * 3. + seed * 20.), sc = iA.z * vis * big;
  P.y += rv.z - sunk * sc + bob * vis * big;
  float hd = dot(P2 - P, rt) < 0. ? -1. : 1.;
  vec3 wpos = P + (rt * position.x * 3.6 + vec3(0., position.y + .5, 0.) * 1.0) * sc;
  vUV = vec2(position.x * hd, position.y); vVis = vis; vSeed = seed; vKind = kind;
  // (m7b) NO TWO ALIKE IN A ROW: the row of a card's animals, nose to tail, by its own nine numbers. An animal of size s reaches
  // 0.79 s before its middle (the nose) and 0.545 s behind it (a hind hoof at full swing). Two middles lie from a third of the
  // two sizes' sum apart (the bodies overlapping by a third) to their whole sum apart (a body's length between them), as far
  // as the card lets them: the room left over is shared out by the gaps' own numbers, so every row lies inside the card and
  // is centred on it. The card is 3.6 m wide: four grown animals at their closest are 3.34 m, and in less than that a
  // fourth can only stand half hidden. A fourth runs with the three on FORD_FOUR of the cards, so that a seed's animal cards
  // carry no less dark than live's block (three alone: 1.27 m2 against 1.50; verify-m7b/cardlaw.mjs).
  vec4 s = vec4(sizeOf(iF[0].y), sizeOf(iF[0].z), sizeOf(iF[1].x), sizeOf(iF[1].y));
  vec3 dm = vec3(s.x + s.y, s.y + s.z, s.z + s.w) / 3.;
  float four = step(iF[2].z, FORD_FOUR);
  dm.z *= four;
  vec3 dx = dm * 2. * vec3(iF[1].z, iF[2].x, iF[2].y);
  float lmin = .79 * s.x + .545 * mix(s.z, s.w, four) + dm.x + dm.y + dm.z, ext = dx.x + dx.y + dx.z;
  vec3 dd = dm + dx * min(1., (3.58 - lmin) / max(ext, 1e-3));
  float o0 = .5 * (lmin + dd.x + dd.y + dd.z - dm.x - dm.y - dm.z) - .79 * s.x;
  vAx = vec4(o0, o0 - dd.x, o0 - dd.x - dd.y, o0 - dd.x - dd.y - dd.z); vAs = vec4(s.xyz, s.w * four);
  vec2 sh = -uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  vW = vec4(rv.x, sunk - bob / max(iA.z, .5), clamp(dot(sh, rt.xz) * hd, -1., 1.), run * 3.49 + seed * 20.);   // in water; how high the water stands on the card, in the card's own measure; which way its shadow lies across the card; stride phase
  vec4 mvPosition = viewMatrix * vec4(wpos, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,za=`
uniform vec3 uSunCol, uSkyCol, uCoat; uniform float uTime;
varying vec2 vUV; varying float vVis, vSeed, vKind; varying vec4 vW, vAx, vAs;
#include <fog_pars_fragment>
void main(){
  vec2 p = vec2(clamp(vUV.x, -.5, .5) * 3.6, clamp(vUV.y, -.5, .5) + .5);   // x -1.8 .. 1.8 m (the head toward +x), y 0 .. 1 m
  float wet = clamp(vW.x, 0., 1.), d = clamp(vW.y, -.1, 1.1), ph = vW.w;
  float kind = step(.5, vKind);   // (m7b) 1: whole animals; 0: the knot. One number for the whole card, and no weight between
  // THE KNOT: live's card as live drew it, the whole block 1.5 m by 1 m in the coat's dark tone with a lit back, standing for a
  // knot of animals (live's shader never cut its blot out of the card; that is the fullness the far fords have, kept)
  float animal = step(abs(p.x), .75) - .5, foot = step(abs(p.x), .75), shB = 0., xh = .75, xr = -.75, xt = -.75;
  if(kind > .5){
    // (m7, m7b) THE ANIMALS: the knot drawn as what it is, three or four whole animals nose to tail, each of its own size at
    // its own place in the row (vAs, vAx): body, the neck carried forward, the head up with its swollen nose, horns on some of
    // the grown, four legs, each pair scissoring with the stride
    animal = -1.; foot = 0.; xh = vAx.x + .5 * vAs.x; xr = vAx.x - .5 * vAs.x; xt = xr;
    for(int i = 0; i < 4; i++){
      float s = clamp(vAs[i], 0., 1.); if(s < .5) continue;   // (no fourth on this card)
      float fi = float(i), phi = ph + 2.1 * fi; vec2 pp = (p - vec2(vAx[i], 0.)) / max(s, .5);
      vec2 b = (pp - vec2(0., .58)) / vec2(.5, .2); float body = 1. - dot(b, b);
      vec2 nk = (pp - vec2(.44, .68)) / vec2(.16, .15); float neck = 1. - dot(nk, nk);
      vec2 h2 = (pp - vec2(.62, .8)) / vec2(.17, .1); float head2 = 1. - dot(h2, h2);
      float horn = step(abs(pp.x - .55 + .5 * (pp.y - .88)), .028) * step(.86, pp.y) * step(pp.y, 1.) * step(.5, fract(vSeed * 3.7 + fi * .37)) * step(.8, s);
      float k = clamp((.5 - pp.y) / .5, 0., 1.), sw = .2 * sin(phi) * k, sw2 = .2 * sin(phi + 1.3) * k;
      float legs4 = max(max(step(abs(pp.x - .3 - sw), .045), step(abs(pp.x - .3 + sw), .045)), max(step(abs(pp.x + .3 - sw2), .045), step(abs(pp.x + .3 + sw2), .045))) * step(pp.y, .5);
      animal = max(animal, max(max(max(body, neck), max(head2, horn - .5)), legs4 - .5));
      foot = max(foot, step(abs(pp.x - .12), .67));                                       // from its hind hooves to its nose
      shB = max(shB, step(pp.y, .075) * step(abs(pp.x - .12 - .5 * vW.z), .67));          // on a bar: its own shadow at its own feet, lying away from the sun
      xt = min(xt, vAx[i] - .5 * s);
    }
  }
  // (m7b) IN OPEN WATER, every card alike, by the river's law under its own place (vW.x, vW.y) and nothing else: a dark line
  // where it stands in its own reflection, along the whole foot of what is drawn; broken water thrown up at the leader's chest;
  // a pale streak trailing under and behind it, tapering out over 0.7 m behind the last tail (the knot's whole wake: under
  // half the knot's own 1.5 m, and inside the 1.05 m the card has behind the block)
  float wy = p.y - d, inW = step(.5, wet) * step(0., wy), tb = clamp((xt - p.x) / max(min(.7, xt + 1.78), .05), 0., 1.);
  float wake = inW * max(step(wy, .1 * (1. - tb)) * step(xt - .7, p.x) * step(p.x, xr) * step(.3, fract(p.x * 2.6 + ph * .16 + vSeed * 7.)),
    step(wy, .17) * step(xh - .13, p.x) * step(p.x, min(xh + .27, 1.78)) * step(.42, fract(p.x * 5. + ph * .31)));
  float dark = inW * step(wy, .07) * foot;
  float shadow = max((1. - step(.5, wet)) * kind * shB, dark);   // (a knot on a bar has no shadow, as in live)
  if(animal < 0. && wake < .5 && shadow < .5) discard;
  vec3 c = uCoat * (uSkyCol * .34 + uSunCol * (.2 + .5 * smoothstep(.55, .78, p.y))) * (.7 + .5 * fract(vSeed * 13.3)) * .19;
  if(animal < 0. || dark > .5) c = shadow > .5 ? uSkyCol * .045 + uSunCol * .012 : uSkyCol * .2 + uSunCol * .12;   // the shadow and the waterline: dark; the wake: pale, never brighter than the water's own glitter (live's splash colour)
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}
`;function Ro(u=!0){const d=[],I=[],P=[],O=[],v=[],ee=C("#161517"),Z=C("#222123"),p=C("#211f24"),s=(c,S,i,n,A,x,k,b)=>(d.push(c,S,i),I.push(n,A,x),P.push(k.r,k.g,k.b),O.push(b[0],b[1],b[2],b[3]),d.length/3-1),V=[0,0,0,0],he=[[-.21,.03,.025,0],[-.13,.068,.058,0],[-.02,.095,.086,0],[.09,.09,.088,.008],[.165,.068,.078,.022],[.215,.058,.062,.05],[.262,.046,.05,.055],[.285,.021,.031,.048],[.335,.016,.024,.04],[.372,.004,.007,.022]],j=10,T=[];he.forEach((c,S)=>{T.push(d.length/3);for(let i=0;i<j;i++){const n=i/j*gt,A=Math.sin(n),x=Math.cos(n),k=x<0&&S>=3&&S<=5?1.25:1;s(A*c[1],c[3]+x*c[2]*k,c[0],A,x,0,S>=7?Z:x>.3?p:ee,V)}});for(let c=0;c<he.length-1;c++)for(let S=0;S<j;S++){const i=T[c]+S,n=T[c]+(S+1)%j,A=T[c+1]+S,x=T[c+1]+(S+1)%j;v.push(i,A,n,n,A,x)}const g=(c,S,i,n,A,x,k,b)=>{const B=s(c[0],c[1],c[2],n[0],n[1],n[2],A,x),H=s(S[0],S[1],S[2],n[0],n[1],n[2],A,k),ne=s(i[0],i[1],i[2],n[0],n[1],n[2],A,b);v.push(B,H,ne)};for(let c=0;c<7;c++){const S=.1+c*.016,i=(c%2?1:-1)*.02*(1+c%3);g([i-.02,-.06,S+.03],[i+.02,-.06,S+.03],[i,-.125-.012*(c%3),S-.02],[0,-.3,1],ee,V,V,V)}for(let c=0;c<6;c++){const S=(c-2.5)*.02;g([S-.016,.1,.2],[S+.016,.1,.2],[S,.12+.01*(c%2),.13],[0,1,.2],p,[0,0,0,.3+c],[0,0,0,.3+c],[0,0,0,-1-c])}for(let c=-3;c<=3;c++){const S=c*.085,i=.3-.028*Math.abs(c),n=.024,A=Math.sin(S),x=-Math.cos(S),k=Math.cos(S)*n,b=Math.sin(S)*n,B=c*.008,H=-.17,ne=.006*(3-Math.abs(c));g([B-k,ne,H-b],[B+k,ne,H+b],[B+A*i+k*.7,ne-.02,H+x*i+b*.7],[0,1,0],ee,V,V,V),g([B-k,ne,H-b],[B+A*i+k*.7,ne-.02,H+x*i+b*.7],[B+A*i-k*.7,ne-.02,H+x*i-b*.7],[0,1,0],ee,V,V,V)}const m=.62;for(const c of u?[-1,1]:[]){const i=(x,k)=>[c,Xe((x-.06)/(m-.06)),.06,k],n=(x,k)=>[c*x,.03,k],A=[[.06,.1,-.11],[.15,.115,-.125],[.24,.11,-.13],[.31,.09,-.115]];for(let x=0;x<3;x++){const k=A[x],b=A[x+1];g(n(k[0],k[1]),n(b[0],b[1]),n(k[0],k[2]),[0,1,0],p,i(k[0],0),i(b[0],0),i(k[0],0)),g(n(b[0],b[1]),n(b[0],b[2]),n(k[0],k[2]),[0,1,0],ee,i(b[0],0),i(b[0],0),i(k[0],0)),g(n(k[0],k[2]),n(b[0],b[2]),n((k[0]+b[0])/2+.01,k[2]-.05),[0,1,0],ee,i(k[0],0),i(b[0],0),i(b[0],0))}for(let x=0;x<5;x++){const k=.38-x*.27,b=.3+.035*(2-Math.abs(x-1.5)),B=.021,H=.3-x*.012,ne=.075-x*.04,re=Math.cos(k),ze=Math.sin(k),Se=-ze*B,ke=re*B,oe=[H+re*b,ne+ze*b],pe=.2+x*.17;g(n(H-Se,ne-ke),n(H+Se,ne+ke),n(oe[0]+Se*.55,oe[1]+ke*.55),[0,1,0],ee,i(H,pe),i(H,pe),i(oe[0],pe)),g(n(H-Se,ne-ke),n(oe[0]+Se*.55,oe[1]+ke*.55),n(oe[0]-Se*.55,oe[1]-ke*.55),[0,1,0],ee,i(H,pe),i(oe[0],pe),i(oe[0],pe))}}const l=new e.BufferGeometry;return l.setAttribute("position",new e.Float32BufferAttribute(d,3)),l.setAttribute("normal",new e.Float32BufferAttribute(I,3)),l.setAttribute("color",new e.Float32BufferAttribute(P,3)),l.setAttribute("aWing",new e.Float32BufferAttribute(O,4)),l.setIndex(v),l.boundingSphere=new e.Sphere(new e.Vector3,1.2),l}function Ca(u){const d=[],I=[],P=[],O=[],v=C("#161517"),ee=C("#27252b");for(let p=0;p<5;p++){const s=u*(p-2)*.17-u*.1,V=.62-.05*Math.abs(p-1.6),he=.05,j=Math.sin(s),T=-Math.cos(s),g=-T*he,m=j*he,l=.012*p,c=[j*.04,l,T*.04],S=[j*V*.55-g,l,T*V*.55-m],i=[j*V*.55+g,l,T*V*.55+m],n=[j*V,l-.02,T*V];for(const[A,x]of[[c,v],[S,ee],[n,v],[c,v],[n,v],[i,v]])d.push(A[0],A[1],A[2]),I.push(0,1,0),P.push(x.r,x.g,x.b),O.push(0,0,0,.2+p)}const Z=new e.BufferGeometry;return Z.setAttribute("position",new e.Float32BufferAttribute(d,3)),Z.setAttribute("normal",new e.Float32BufferAttribute(I,3)),Z.setAttribute("color",new e.Float32BufferAttribute(P,3)),Z.setAttribute("aWing",new e.Float32BufferAttribute(O,4)),Z.boundingSphere=new e.Sphere(new e.Vector3,1),Z}const Ta=`
attribute vec4 aWing; attribute vec3 color;
uniform float uFlap, uAmp, uTime, uBias, uSweep;
varying vec3 vN, vWorld, vCol;
#include <fog_pars_vertex>
void main(){
  vec3 p = position, n = normal; float side = aWing.x, s = aWing.y;
  if(abs(side) > .5){
    // flap from the shoulder; the hand lags and folds on the upstroke, sweeps forward on the downstroke; glide = a shallow dihedral
    float ph = uFlap - 1.0 * s, th = uAmp * (uBias + .85 * sin(ph)) * (.35 + .65 * s) + (1. - uAmp) * (.1 + .05 * sin(uTime * 1.3));
    th -= uAmp * .45 * s * s * max(0., cos(uFlap - .5));
    float r = abs(p.x) - aWing.z, c = cos(th), sn = sin(th), fold = 1. - .22 * uAmp * s * max(0., cos(uFlap));
    float sw = uAmp * uSweep * (.5 - .5 * cos(ph)) * (.4 + .6 * s), cw = cos(sw), sw2 = sin(sw), z0 = p.z;   // the whole wing sweeps forward on the downstroke
    p.z = z0 * cw + r * sw2; r = r * cw - z0 * sw2;
    p.x = side * (aWing.z + r * c * fold); p.y += r * sn;
    p.z += .012 * sin(uTime * 9. + aWing.w * 20.) * s;
    n = vec3(-side * sn, c, 0.);
  } else if(aWing.w < 0.){ p.y += .006 * sin(uTime * 7. + aWing.w * 3.); p.x += .004 * sin(uTime * 5.3 + aWing.w); }
  vec4 wp = modelMatrix * vec4(p, 1.); vWorld = wp.xyz; vN = normalize(mat3(modelMatrix) * n + vec3(0., 1e-4, 0.)); vCol = color;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Ba=`
uniform vec3 uSunDir, uSunCol, uSkyCol;
varying vec3 vN, vWorld, vCol;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN), V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.)); if(dot(N, V) < 0.) N = -N;
  float fres = 1. - abs(dot(N, V)); fres *= fres;
  vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.)); float sp = max(dot(N, H), 0.); sp *= sp; sp *= sp; sp *= sp;
  float lum = dot(uSkyCol, vec3(.3333));
  vec3 c = vCol * 3.2 * (vec3(lum) * (.6 + .35 * N.y) + uSunCol * (.4 * max(dot(N, uSunDir), 0.) + .12));
  c += uSkyCol * (.012 + .03 * max(N.y, 0.) + .04 * fres) + uSunCol * vec3(.5, .42, .7) * (sp * .3 + .02 * fres);   // glossed blue-violet: never a flat black cut-out
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}
`;function Wo(u){const d=new Lt.Geo,I=C(u.top),P=C(u.belly),O=C(u.dark),v=u.sides||10,ee=[{z:u.body[0][0]-.08,y:(u.body[0][1]+u.body[0][2])/2,rx:0,ry:0}];for(const i of u.body)ee.push({z:i[0],y:(i[1]+i[2])/2,rx:i[3],ry:(i[1]-i[2])/2});const Z=d.loft(ee,{sides:v,top:I,belly:P,shade:[-.4,.4]});d.paint(Z,(i,n,A,x)=>{const k=Math.sin(i*9.1+A*5.3)*Math.sin(A*7.7-n*6.1);x.multiplyScalar(1+.1*k),u.saddle&&x.lerp(O,u.saddle*W(.2,.9,Math.sin(A*2.2+1)*.5+.5)*W(.6,1,n/u.body[2][1]))});const p=u.head,s=Math.cos(p.pitch),V=Math.sin(p.pitch),he=i=>d.move(i,n=>{const A=n.y*s-n.z*V,x=n.z*s+n.y*V;n.y=A+p.at[1],n.z=x+p.at[2]}),j=[{z:p.rings[0][0]-.05,y:0,rx:0,ry:0}];for(const i of p.rings)j.push({z:i[0],y:i[3]||0,rx:i[1],ry:i[2]});j.push({z:p.rings[p.rings.length-1][0]+.03,y:p.rings[p.rings.length-1][3]||0,rx:0,ry:0});const T=[d.loft(j,{sides:v,top:I,belly:P,shade:[-.3,.5]})],g=p.rings[p.rings.length-1][0];d.paint(T[0],(i,n,A,x)=>{A>g-.035&&x.copy(O)});for(const i of[-1,1]){const n=p.ear;T.push(d.anim(d.fan([[i*n[0],n[1],n[2]],[i*(n[0]-n[3]*.6),n[1]+n[3]*.2,n[2]+.02],[i*(n[0]+n[3]*.1),n[1]+n[3],n[2]-.02],[i*(n[0]+n[3]*.7),n[1]+n[3]*.5,n[2]],[i*(n[0]+n[3]*.6),n[1],n[2]+.02]],I,O),()=>[i>0?.2:.7,1,2,0]));const A=p.eye;T.push(d.glow(d.blob(i*A[0],A[1],A[2],.022,.022,.022,O,O,5,3),-1))}for(const i of p.horns||[]){const n=d.tube(i.pts,i.radii,6,C(i.c0),C(i.c1));d.move(n,A=>{A.x*=i.flat}),d.glow(n,-1),T.push(n)}for(const i of T)he(i),d.anim(i,(n,A,x)=>[0,1,2,0]),d.pivot(i,0,p.neck[1],p.neck[2]);for(const i of u.legs)for(const n of[-1,1]){const A=i.pts.map(B=>[n*(i.x+(B[2]||0)),B[0],B[1]]),x=d.tube(A,i.radii,7,I,P),k=i.pts[0][0];d.anim(x,(B,H)=>[i.phase+(n>0?0:.5),Xe((k-H)/k),1,0]),d.pivot(x,n*i.x,k,i.pts[0][1]);const b=d.blob(n*i.x,.035,i.pts[i.pts.length-1][1]+i.foot[1]*.35,i.foot[0],.04,i.foot[1],O,O,6,3);d.anim(b,()=>[i.phase+(n>0?0:.5),1,1,0]),d.pivot(b,n*i.x,k,i.pts[0][1])}const m=u.tail,l=d.tube(m.pts,m.radii,5,I,m.tuft?O:I),c=m.pts[0],S=m.pts.length-1;if(d.anim(l,(i,n,A)=>[0,Xe(Math.hypot(n-c[1],A-c[2])/(Math.hypot(m.pts[S][1]-c[1],m.pts[S][2]-c[2])+.3)),3,0]),m.tuft&&d.anim(d.blob(m.pts[S][0],m.pts[S][1],m.pts[S][2],m.tuft,m.tuft,m.tuft*1.8,O,O,5,3),()=>[0,1,3,0]),u.fringe)for(const i of[-1,1])for(let n=0;n<u.fringe.n;n++){const A=n/(u.fringe.n-1),x=Ve(u.fringe.z[0],u.fringe.z[1],A),k=Math.abs(Math.sin(n*12.99+i)),b=u.fringe.y+.1*k,B=i*u.fringe.x*(.85+.2*Math.sin(A*Math.PI)),H=d.v(B,b,x-.07,I),ne=d.v(B,b,x+.07,I),re=d.v(B*1.04,b-u.fringe.len*(.6+.8*k),x-.03,P);d.tri(H,ne,re)}return d.build()}const Ra={top:"#C9A468",belly:"#E8D8B0",dark:"#3a2c22",sides:10,body:[[-1,1.06,.8,.13],[-.86,1.16,.66,.26],[-.56,1.18,.6,.31],[-.16,1.14,.64,.275],[.24,1.19,.52,.32],[.54,1.24,.53,.32],[.76,1.24,.62,.26],[.92,1.27,.76,.2]],head:{at:[0,1.36,1.13],pitch:.2,neck:[0,1.14,.8],rings:[[-.3,.17,.2,-.05],[-.12,.185,.19],[.03,.185,.17],[.14,.14,.135,-.02],[.28,.115,.105,-.04],[.35,.085,.075,-.04]],ear:[.115,.13,-.08,.085],eye:[.125,.065,.1]},legs:[{x:.2,phase:0,radii:[.14,.1,.065,.07],foot:[.09,.115],pts:[[.98,.5],[.62,.46],[.3,.52],[.05,.53]]},{x:.2,phase:.5,radii:[.18,.115,.06,.065],foot:[.085,.11],pts:[[1,-.62],[.6,-.5],[.33,-.76],[.05,-.68]]}],tail:{pts:[[0,1.04,-1],[0,.8,-1.28],[0,.5,-1.44],[0,.32,-1.6],[0,.36,-1.82]],radii:[.05,.04,.032,.028,.026],tuft:.045}},Wa={top:"#6A4A30",belly:"#8a6846",dark:"#2e221a",sides:12,saddle:.35,body:[[-1.62,1.22,.86,.2],[-1.42,1.42,.64,.45],[-.92,1.5,.5,.6],[-.3,1.47,.45,.66],[.3,1.58,.47,.64],[.72,1.67,.54,.56],[1.02,1.56,.6,.45],[1.24,1.38,.64,.36]],head:{at:[0,.98,1.6],pitch:.55,neck:[0,1.2,1.1],rings:[[-.4,.27,.27],[-.18,.26,.25],[.08,.21,.2],[.34,.165,.17],[.56,.15,.15],[.68,.11,.1]],ear:[.17,.2,-.3,.11],eye:[.2,.06,.02],horns:[{flat:.38,c0:"#4a3a2a",c1:"#8a7658",radii:[.14,.12,.085,.03],pts:[[0,.1,.5],[0,.42,.66],[0,.78,.7],[0,1.08,.62]]},{flat:.5,c0:"#4a3a2a",c1:"#7a6648",radii:[.1,.07,.02],pts:[[0,.14,.16],[0,.3,.2],[0,.42,.2]]}]},legs:[{x:.37,phase:0,radii:[.21,.15,.11,.12],foot:[.14,.15],pts:[[.82,.86],[.5,.83],[.24,.87],[.05,.87]]},{x:.36,phase:.5,radii:[.25,.16,.11,.12],foot:[.14,.15],pts:[[.84,-1.06],[.5,-.98],[.26,-1.12],[.05,-1.08]]}],tail:{pts:[[0,1.26,-1.62],[0,1,-1.74],[0,.72,-1.76]],radii:[.05,.035,.03],tuft:.04},fringe:{n:26,z:[-1.3,1.15],y:.62,x:.6,len:.32}},Fa=`
attribute vec4 aAnim; attribute vec3 aPivot, color; attribute float aGlow;
uniform float uGait, uMove, uTime, uRise, uSeed;
varying vec3 vN, vWorld, vObj, vCol; varying float vBare;
#include <fog_pars_vertex>
void rotX(inout vec3 d, float a){ float c = cos(a), s = sin(a); d.yz = vec2(d.y * c - d.z * s, d.z * c + d.y * s); }
void main(){
  vec3 p = position, n = normal; float part = aAnim.z, w = aAnim.y;
  if(part > .5 && part < 1.5){            // legs swing from shoulder and hip, the lower leg lifts as it comes forward
    float ph = uGait + aAnim.x * 6.2832, ang = uMove * .5 * sin(ph);
    vec3 d = p - aPivot; rotX(d, ang); rotX(n, ang); d.y += w * w * .11 * uMove * max(0., cos(ph)); p = aPivot + d;
  } else if(part > 1.5 && part < 2.5){    // head: nods with the stride; at rest it turns to watch
    vec3 d = p - aPivot; float yaw = .32 * sin(uTime * .45 + uSeed * 5.) * (1. - uMove), c = cos(yaw), s = sin(yaw);
    d.xz = vec2(d.x * c + d.z * s, d.z * c - d.x * s); n.xz = vec2(n.x * c + n.z * s, n.z * c - n.x * s);
    rotX(d, .05 * sin(2. * uGait) * uMove + .03 * sin(uTime * .7 + uSeed));
    p = aPivot + d;
  } else if(part > 2.5 && part < 3.5){    // tail: swishes, the tip flicks
    p.x += w * w * (.2 * sin(uTime * 1.7 + uSeed * 3.) + .1 * w * w * sin(uTime * 6.3 + uSeed));
  }
  p.y += uMove * .035 * sin(2. * uGait + .6);
  if(part < .5) p.x *= 1. + .014 * sin(uTime * 1.3 + uSeed * 4.);      // the flank breathes
  p.y *= mix(.46, 1., uRise);                                         // crouched in the grass until it rises
  vObj = position; vCol = color; vBare = aGlow;
  vec4 wp = modelMatrix * vec4(p, 1.); vWorld = wp.xyz; vN = normalize(mat3(modelMatrix) * n + vec3(0., 1e-4, 0.));
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Pa=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGroundCol; uniform float uExpo, uShag;
varying vec3 vN, vWorld, vObj, vCol; varying float vBare;
#include <fog_pars_fragment>
${Oe}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)), V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.)); if(dot(N, V) < 0.) N = -N;
  float ndl = dot(N, uSunDir), wrap = max(0., (ndl + .5) / 1.5), back = max(0., -dot(V, uSunDir)), fres = 1. - abs(dot(N, V)); fres *= fres;
  vec3 hemi = mix(uGroundCol, uSkyCol, N.y * .5 + .5);
  float dist = length(cameraPosition - vWorld), fade = 1. - smoothstep(18., 60., dist);
  float st = gn(vec2((vObj.z + vObj.x * .7) * 24., vObj.y * 5.)), cl = gn(vObj.zy * 3.1 + vObj.x * 1.7);
  vec3 base = vCol * mix(1., (.72 + .42 * st) * (.86 + .28 * cl), uShag * fade);
  vec3 c = base * (uSunCol * wrap * wrap + hemi) + base * uSunCol * fres * fres * (.12 + 1.8 * back * back) + base * uSkyCol * fres * .3;
  if(vBare < -.5) c = vCol * (hemi * .5 + uSunCol * wrap * .5) + uSunCol * fres * fres * .05;
  gl_FragColor = vec4(c * uExpo, 1.);
  #include <fog_fragment>
}
`;function Da(u,d){const I=[],P=[],O=[],v=[];for(let s=0;s<5;s++){const V=(4.5+s*3.1+u.range(-.6,.6))*Math.PI/180,he=u.range(34,62)*Math.PI/180,j=(d+u.range(-34,34))*Math.PI/180,T=u.range(.8,1.5)*Math.PI/180,g=u(),m=I.length/3;for(let l=0;l<=28;l++){const c=l/28,S=j+(c*2-1)*he,i=-.25*Math.PI/180*Math.sin(c*7+g*9);for(const n of[-1,1]){const A=V+i+n*T;I.push(Math.sin(S)*3300,Math.tan(A)*3300,-Math.cos(S)*3300),P.push(c,n),O.push(g)}}for(let l=0;l<28;l++){const c=m+l*2;v.push(c,c+1,c+2,c+1,c+3,c+2)}}const p=new e.BufferGeometry;return p.setAttribute("position",new e.Float32BufferAttribute(I,3)),p.setAttribute("uv",new e.Float32BufferAttribute(P,2)),p.setAttribute("aSeed",new e.Float32BufferAttribute(O,1)),p.setIndex(v),p}const La=`
attribute float aSeed, aTh; varying vec2 vUV; varying float vSeed, vT;
void main(){
  vUV = uv; vSeed = aSeed;
  float w = uv.x * 6.2832, sd = aSeed * 40.;
  vT = 1. + .34 * (.5 + .5 * sin(w * 2.3 + sd * 2.3)) + .2 * (.5 + .5 * sin(w * 5.9 + sd));
  vec3 p = position;
  p.y += uv.y * aTh * (vT - 1.) + 18. + 60. * sin(w * 1.3 + sd) + 34. * sin(w * 3.1 + sd * 1.7) + (uv.x - .5) * 300. * (fract(aSeed * 7.3) - .5) * 2.;   // (18: a third of a degree up. With Mend 2's wider swing the low end of the lowest bar can go down behind the far ridges, which stand before it as before any low cloud: the bars lie on the far shell behind all land)
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}
`,Ga=`
uniform vec3 uLit, uShade; uniform float uAlpha, uTime;
varying vec2 vUV; varying float vSeed, vT;
${Oe}
void main(){
  float T = clamp(vT, 1., 1.6), x = vUV.x * 60. + vSeed * 40. + uTime * .02, y = vUV.y * T;   // y: live's own across coordinate (the strip is T times live's)
  float n = gn(vec2(x, y * 1.5 + vSeed * 9.)) * .6 + gn(vec2(x * 3.1, y * 3. + 4.)) * .4;
  float ends = smoothstep(0., .22, vUV.x) * (1. - smoothstep(.78, 1., vUV.x));
  float body = (1. - smoothstep(.25, 1., abs(y + .25 * (n - .5)))) * ends * smoothstep(.2, .6, n + .35 * ends);
  // (m7) a feathered edge: combed wisps trail off the body into the swollen strip; all fades before the strip's own edge. The body itself is live's or more: nothing thins it
  float n3 = gn(vec2(x * .55 + 9., y * 4.2 + vSeed * 17.)), yo = clamp(abs(vUV.y), 0., 1.);
  float wisp = smoothstep(.42, .72, n3) * (1. - smoothstep(.55, 1., yo)) * ends * .62;
  body = max(body, wisp) * (1. - smoothstep(.93, 1., yo));
  vec3 c = mix(uLit, uShade, smoothstep(-.5, .7, y + .5 * (n - .5)));   // lit from below
  gl_FragColor = vec4(c, clamp(body, 0., 1.) * uAlpha);
}
`;function Va(u,d,I){const P=[],O=[],v=[],ee=[],Z=[],j=Math.PI/180,T=Math.hypot(d.x,d.z)||1,g=Math.atan2(d.x,-d.z)+Math.PI/2+u.range(-.3,.3),m=d.x/T,l=d.z/T,c=new e.Vector3,S=new e.Color,i=A=>1+3.2*W(8*j,30*j,A);for(let A=0;A<36;A++){const x=(5.5+50*Math.pow(u(),1.6))*j,k=u()*Math.PI*2,b=330/Math.tan(x),B=330/Math.sin(x),H=g+u.range(-.2,.2),ne=B*u.range(.16,.62),re=u.range(.02,.055),ze=u.range(-.14,.14),Se=u(),ke=re*i(x),oe=ne/B,pe=W(12*j,26*j,x),Le=B*Ve(oe,Math.min(oe,2.4*ke),pe),mt=Math.sin(H),ye=-Math.cos(H),ce=Math.cos(H),Ee=Math.sin(H),Ae=b*Math.sin(k),wt=-b*Math.cos(k),ht=Math.abs(ce*Math.sin(k)-Ee*Math.cos(k)),fe=ce*m+Ee*l,xt=P.length/3,bt=Math.max(4,1.75*(Le/B)/(re*Math.max(i(x),1+2.4*(1-ht*ht))));for(let qe=0;qe<=14;qe++){const le=qe/14,ot=le*2-1,Re=ze*Le*ot*ot,dt=Ae+mt*ot*Le+ce*Re,Ze=wt+ye*ot*Le+Ee*Re,Vt=Math.hypot(dt,Ze)||1,He=Math.hypot(Vt,330),je=Math.asin(330/He),te=Math.abs(ce*dt+Ee*Ze)/Vt,Ce=Math.min(.7*330,He*re*Math.max(i(je),1+2.4*(1-te*te))/Math.sqrt(te*te*Math.sin(je)*Math.sin(je)+(1-te*te))),ve=Re*(1-.85*pe)+(.5*Ce*Math.sin(le*5+Se*20)+.15*Ce*Math.sin(le*13+Se*47))*(1-.8*pe),Fe=Ce*(.55+.45*Math.pow(Math.sin(Math.PI*Math.min(1,Math.max(0,le))),.6))*(1+.4*Math.sin(le*11+Se*31));for(const Ke of[-1,1])c.set(Ae+mt*ot*Le+ce*(ve+Ke*Fe),330,wt+ye*ot*Le+Ee*(ve+Ke*Fe)).normalize(),P.push(c.x*3300,c.y*3300,c.z*3300),O.push(le,Ke),v.push(Se,fe,pe,bt),I(c,S),ee.push(S.r,S.g,S.b)}for(let qe=0;qe<14;qe++){const le=xt+qe*2;Z.push(le,le+1,le+2,le+1,le+3,le+2)}}const n=new e.BufferGeometry;return n.setAttribute("position",new e.Float32BufferAttribute(P,3)),n.setAttribute("uv",new e.Float32BufferAttribute(O,2)),n.setAttribute("aB",new e.Float32BufferAttribute(v,4)),n.setAttribute("aSky",new e.Float32BufferAttribute(ee,3)),n.setIndex(Z),n}const Na=`
attribute vec4 aB; attribute vec3 aSky; varying vec2 vUV; varying vec4 vB; varying vec3 vSky, vDir;
void main(){ vUV = uv; vB = aB; vSky = aSky; vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`,Ia=`
uniform vec3 uLit, uShade, uSunDir; uniform float uAlpha, uTime;
varying vec2 vUV; varying vec4 vB; varying vec3 vSky, vDir;
${Oe}
void main(){
  vec3 dir = normalize(vDir + vec3(0., 1e-4, 0.));
  float seed = vB.x, x = vUV.x * vB.w + seed * 40. + uTime * .012, y = clamp(vUV.y, -1., 1.), yo = abs(y);
  float n = gn(vec2(x, y * 1.4 + seed * 9.)) * .6 + gn(vec2(x * 3.1, y * 3. + 4.)) * .4, n3 = gn(vec2(x * .7 + 2., y * 2.4 + seed * 3.));
  float broad = clamp(vB.z, 0., 1.), ends = smoothstep(0., mix(.2, .4, broad), vUV.x) * (1. - smoothstep(mix(.8, .6, broad), 1., vUV.x));   // (a broad patch feathers out over more of its length)
  float strch = smoothstep(.3, .62, gn(vec2(x * .16 + seed * 13., seed * 5.)) + .25 * ends);                          // it comes in stretches, with clear sky between
  float body = (1. - smoothstep(.12, .95, abs(y + .3 * (n - .5)))) * ends * smoothstep(.2, .6, n + .3 * ends) * (.25 + .75 * strch);   // soft rims; it breaks where the noise runs low
  float wisp = (1. - smoothstep(.4, 1., yo)) * ends * smoothstep(.44, .8, n3) * .45;                                // soft wisps beside and between
  float a = max(body, wisp) * (1. - smoothstep(.86, 1., yo));
  float sunward = smoothstep(-.15, .75, dot(dir, uSunDir));                    // 1 on the sun's side of the sky
  float litk = smoothstep(-.75, .8, y * clamp(vB.y, -1., 1.) * 1.4 + .7 * (n - .5));   // its edge toward the sun's quarter is lit, the other in its own shade
  vec3 warm = mix(uShade, uLit, litk);
  vec3 cool = mix(vSky * vec3(.66, .7, .79), mix(vSky, uLit, .45), litk);      // away from the sun: darker and cooler than the sky behind at the shaded edge, brighter at the lit one
  vec3 c = mix(cool, warm, sunward);
  a *= 1. - smoothstep(.9925, .9986, dot(dir, uSunDir));                       // the sun's disc stays clear (from 7 degrees off it to 3)
  a *= smoothstep(.05, .085, dir.y);                                           // nothing below 3 degrees: the far ridges stand there
  gl_FragColor = vec4(c, clamp(a, 0., 1.) * uAlpha);
}
`;export{qa as default};
