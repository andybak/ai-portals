import*as v from"three";import{clamp as te,lerp as F,smoothstep as ge,makeRng as rt,hashSeed as St}from"../kit/core.js";const Dt=["#232936","#0A1C26","#E9E38A","#E4DCFF","#8E62FF","#B4506F","#FFB45A"],a=(c,s,o)=>new v.Vector3(c,s,o),Ze=Math.PI*2,et=1e3,It=2.8,At=1.2,De=256,Ke=512,Tt=-210,zt=560,mt=-20,pt=820,tt=c=>te((c+10)/50,0,1);function Ye(c,s,o,p=a()){return p.lerpVectors(s,o,te((s.y-c)/(s.y-o.y),-.2,1.1))}function Et(c,s,o,p,y){const k=[a(60,690,525),a(60,690,500)],i=Ye(690,c,s),u=Ye(45,c,s),n=Math.atan2(480-i.z,60-i.x),w=Math.hypot(480-i.z,60-i.x);let e=Math.atan2(395-u.z,60-u.x);const m=Math.hypot(395-u.z,60-u.x);for(;e<n+Math.PI;)e+=Ze;const r=f=>ge(.5,.9,.5-.5*Math.cos(F(n,e,f))),g=240,S=[0],O=f=>F(1,.3,r(f))*(.35+.65*ge(0,.1,f));for(let f=1;f<=g;f++)S.push(S[f-1]+.5*(O((f-1)/g)+O(f/g)));const E=(f,U)=>{const le=te(U,0,1)*g,ue=Math.min(g-1,Math.floor(le));return F(f[ue],f[ue+1],le-ue)},B=(f,U=a())=>{const le=F(690,45,E(S,f)/S[g]),ue=Ye(le,c,s,U),oe=F(n,e,f),T=Math.sin(Math.PI*te(f,0,1)),we=F(w,m,Math.pow(te(f,0,1),.8))+42*T*T;return U.set(ue.x+Math.cos(oe)*we,le,ue.z+Math.sin(oe)*we)},G=[0],C=B(0),R=a();for(let f=1;f<=g;f++)B(f/g,R),G.push(G[f-1]+R.distanceTo(C)/F(74,48,r((f-.5)/g))),C.copy(R);const x=f=>3+13*E(G,f)/G[g];for(let f=0;f<=18;f++)k.push(B(f/18));const q=[];for(let f=0;f<=18;f++)q.push(x(f/18));k.push(a(F(60,o.x,.45),16,F(395,o.z,.5)),o.clone(),o.clone().lerp(p,.5),p.clone()),k.push(y.clone().lerp(p,.55).setY(F(y.y,p.y,.62)),y.clone());const ce=Math.sin(18*Math.PI/180),$=Math.cos(18*Math.PI/180),N=f=>a(y.x,y.y-f*ce,y.z+f*$),Q=[a(60,690,548),...k.slice(0,24).map(f=>f.clone()),a(33.3,6.1,171),N(80),N(55),N(28),N(0)],P=new v.CatmullRomCurve3(Q,!1,"centripetal",.5);P.arcLengthDivisions=Math.max(400,Q.length*60);const A=P.getSpacedPoints(Math.ceil(P.getLength()/2.5)),D=[0,1,2.1],ae=f=>{let U=0,le=1;for(let ue=0;ue<26;ue++){const oe=(U+le)/2;x(oe)<f?U=oe:le=oe}return(U+le)/2};return{pts:k,dense:A,helix:B,timeAt:x,helixTimes:q,westOf:r,camAt:(f,U=a())=>f<=D[1]?U.lerpVectors(Q[0],Q[1],te(f/D[1],0,1)):f<=D[2]?U.lerpVectors(Q[1],Q[2],(f-D[1])/(D[2]-D[1])):f<=3?U.lerpVectors(Q[2],Q[3],(f-D[2])/(3-D[2])):B(ae(Math.min(f,16)),U),entryTimes:D}}const Te=a(),ke=a(),lt=a(),xe=a(),Oe=a(),_e=23,Ct=.26,ct=Math.PI/180;function vt(c,s){const o=s.dense,p=i=>{let u=1e18;for(let n=0;n<o.length;n++){const w=o[n],e=w.x-i.x,m=w.y-i.y,r=w.z-i.z,g=e*e+m*m+r*r;g<u&&(u=g)}return Math.sqrt(u)},y=(i,u)=>{const n=u*u;for(let w=0;w<o.length;w++){const e=o[w],m=e.x-i.x,r=e.y-i.y,g=e.z-i.z;if(m*m+r*r+g*g<n)return!1}return!0};function k(i,u,n){const w=[i.clone()],e=[],m=i.clone();let r=c()*Ze,g=0,S=0;const O=n.reach??n.stepMax*.6,E=n.clearance??_e+1,B=n.drift??.1,G=n.dir0?n.dir0.clone().normalize():a(),C=.37,R=1.08,x=a();let q=!!n.dir0;const ce=P=>{if(B&&(P.y-=B,P.normalize()),!q)return P;const A=te(P.dot(G),-1,1),D=Math.acos(A);if(D>=C&&D<=R)return P;x.copy(P).addScaledVector(G,-A),x.lengthSq()<1e-6&&(x.set(G.z,0,-G.x),x.lengthSq()<1e-6&&x.set(1,0,0)),x.normalize();const ae=te(D,C,R);return P.copy(G).multiplyScalar(Math.cos(ae)).addScaledVector(x,Math.sin(ae))},$=(P,A)=>{G.subVectors(A,P).normalize(),q=!0};let N=1e9,Q=0;for(;g<u.length&&w.length<400;){const P=g===u.length-1,A=u[g];Te.subVectors(A,m);const D=Te.length(),ae=P&&n.exact&&D<Math.max(O,n.stepMax)&&D>.001&&(!q||(()=>{const ne=Math.acos(te(Te.dot(G)/D,-1,1));return ne>=C*.8&&ne<=R})());if(D<O||ae){P&&n.exact&&($(m,A),m.copy(A),w.push(m.clone()),S+=D),e[g]=w.length-1,g++,N=1e9,Q=0;continue}if(D<N-.5)N=D,Q=0;else if(++Q>9){Q=0,N=1e9,P&&n.exact&&($(m,A),m.copy(A),w.push(m.clone()),S+=D),e[g]=w.length-1,g++;continue}Te.multiplyScalar(1/D),ke.set(0,1,0),Math.abs(Te.y)>.9&&ke.set(1,0,0),ke.addScaledVector(Te,-ke.dot(Te)).normalize(),lt.crossVectors(Te,ke);const ze=Math.min(8,n.stepMax),f=ne=>Math.max(ze,Ct*p(ne));let U=Math.min(c.range(n.stepMin,n.stepMax),Math.max(n.stepMin*.6,D*.85),f(m));r+=Math.PI+c.range(-1.1,1.1);const le=c.range(.17,.61)*(n.kink??1),ue=a();let oe=!1,T=-1;const we=a(),de=ne=>{we.copy(ne),xe.copy(we).multiplyScalar(U).add(m);const ye=f(xe);U>ye&&xe.copy(we).multiplyScalar(ye).add(m),Oe.copy(xe).add(m).multiplyScalar(.5)},He=()=>{if(E<=0)return!0;const ne=y(xe,E)&&y(Oe,E);if(!ne&&n.must){const ye=Math.min(p(xe),p(Oe));ye>T&&(T=ye,ue.copy(xe))}return ne};for(let ne=0;ne<10&&!oe;ne++){const ye=r+ne*.9,Ce=ne<7?le:le*.3,Fe=Math.sin(Ce),Ie=Math.cos(Ce);de(ce(xe.copy(Te).multiplyScalar(Ie).addScaledVector(ke,Math.cos(ye)*Fe).addScaledVector(lt,Math.sin(ye)*Fe))),oe=He()}if(oe||(de(ce(xe.copy(Te))),oe=He(),!oe&&n.must&&xe.copy(ue)),U=xe.distanceTo(m),!oe&&!n.must||($(m,xe),m.copy(xe),w.push(m.clone()),S+=U,n.minY!==void 0&&m.y<n.minY)||n.maxLen!==void 0&&S>n.maxLen)break}for(let P=0;P<u.length;P++)e[P]===void 0&&(e[P]=w.length-1);return{pts:w,marks:e}}return{chain:k,clear:y,dRoute:p}}function je(c){const s=[0];for(let o=1;o<c.length;o++)s.push(s[o-1]+c[o].distanceTo(c[o-1]));return s}function dt(c,s,o,p){const y=je(c),k=new Array(c.length).fill(o);let i=0,u=o;for(let n=0;n<s.length;n++){const w=s[n],e=Math.max(p[n],u+.02);for(let m=i;m<=w;m++)k[m]=w>i?F(u,e,(y[m]-y[i])/Math.max(y[w]-y[i],.001)):m===0?u:e;w>i&&(i=w,u=e)}for(let n=i+1;n<c.length;n++)k[n]=k[n-1]+(y[n]-y[n-1])/30;return{birth:k,dist:y}}function Pe(c,s,o,p={}){const y=je(s),k=y[y.length-1]||1,i=o[o.length-1],u=p.alive?et:p.stall??i,n=y.map(w=>u>=et?et:u+(p.linger??.4)+(1-w/k)*(p.dieRun??It));return{name:c,pts:s,birth:o,dist:y,len:k,fade:n,stall:u,end:i,cool:p.cool??0,width:p.width??1,stroke:p.stroke?1:0,run:p.run||null,level:p.level??1,corona:p.corona??1,coronaI:p.coronaI??1,seed:p.seed??0,o:p}}const qe=14,Gt=-19,Rt=40;function _t(c,s,o){const p=c.entryTimes[1],y=.05,k=Math.round((qe+1.5-p)/y),i=new Float64Array(k+1),u=new Float64Array(k+1),n=a(),w=a();let e=0;for(let S=0;S<=k;S++){const O=p+S*y;c.camAt(O,n),Ye(n.y-30,s,o,w);let E=Math.atan2(w.x-n.x,-(w.z-n.z))/ct;S&&(E+=360*Math.round((e-E)/360)),e=E,i[S]=E-Rt,u[S]=te(60+.35*Math.hypot(w.x-n.x,w.z-n.z),60,120)}for(let S=0,O=i[0]+Rt;S<=k;S++)i[S]=Math.max(i[S],O);const m=S=>{for(let O=0;O<2;O++){const E=Float64Array.from(S);for(let B=0;B<=k;B++){let G=0,C=0;for(let R=-6;R<=6;R++){const x=te(B+R,0,k);G+=E[x],C++}S[B]=G/C}}};m(i),m(u);const r=(S,O)=>{const E=te((O-p)/y,0,k),B=Math.min(k-1,Math.floor(E));return F(S[B],S[B+1],E-B)};return{T0:p,at:(S,O,E,B,G=a())=>{const C=(r(i,S)+O)*ct,R=(Gt+E)*ct,x=r(u,S)*B,q=Math.cos(R);return c.camAt(S,G).add(xe.set(Math.sin(C)*q*x,Math.sin(R)*x,-Math.cos(C)*q*x))},rangeAt:S=>r(u,S)}}async function Ht(c,s,o){const{route:p,top:y,foot:k,junction:i,mastheads:u,crests:n,count:w,treeRng:e}=o,m=vt(e,p),r=[],g=[];for(let t=1;t<=6;t++){const d=F(y.y+90,k.y,t/6),h=Ye(d,y,k);g.push(h.add(a(e.range(-9,9),0,e.range(-9,9))))}g[5].copy(k);const S=k.clone().add(a(e.range(18,40),-e.range(28,40),e.range(-45,-20)));g.push(S);const O=Ye(y.y+90,y,k).clone(),E=m.chain(O,g,{stepMin:16,stepMax:45,kink:.9,exact:!0,must:!0,clearance:16}),B=g.map((t,d)=>d<5?F(-10.5,15,(d+1)/6):d===5?13.9:46),G=dt(E.pts,E.marks,-10.5,B);{const t=E.marks[5],d=G.dist[t],h=G.dist[G.dist.length-1];for(let b=t+1;b<G.birth.length;b++)G.birth[b]=13.9+32.1*Math.pow(te((G.dist[b]-d)/Math.max(h-d,.001),0,1),1.9)}const C=Pe("trunk",E.pts,G.birth,{alive:!0,width:1.25,level:0,stroke:!0,seed:e()});r.push(C),await c.yield();let R=1;for(let t=1;t<C.pts.length;t++)Math.abs(C.pts[t].y-430)<Math.abs(C.pts[R].y-430)&&(R=t);const x=C.pts[R].clone(),q=C.birth[R],ce=a(F(x.x,i.x,.92),i.y+15,F(x.z,i.z,.9)),$=[x.clone().lerp(ce,.3).add(a(e.range(-14,14),e.range(-8,12),0)),x.clone().lerp(ce,.65).add(a(e.range(-14,14),e.range(-8,12),0)),ce,i.clone()],N=m.chain(x,$,{stepMin:14,stepMax:42,kink:.85,exact:!0,must:!0,clearance:_e+1}),Q=[F(q,20,.3),F(q,20,.65),20,35.5],P=dt(N.pts,N.marks,q,Q),A=Pe("ship",N.pts,P.birth,{alive:!0,width:1.15,level:0,stroke:!0,seed:e()});r.push(A);const D=50+A.len+C.dist[R];A.run=A.dist.map(t=>(50+(A.len-t))/D),C.run=C.dist.map((t,d)=>d<=R?(50+A.len+(C.dist[R]-t))/D:2),await c.yield();const ae=o.station,ze=ae.T0,f=(qe-ze)/3,U=1,le=[],ue=[],oe=p.pts[20].clone().lerp(p.pts[21],.55).add(a(28,5,0)),T=19;for(let t=0;t<3;t++){const d=e.range(-4,4),h=e.range(-3,3),b=e.range(.92,1.08),Y=e(),I=t?ze+t*f-U:ze,M=ze+(t+1)*f,_=t?le[t-1]:C;let H=1;if(t)for(let X=1;X<_.pts.length-1;X++)Math.abs(_.birth[X]-(I-1.2))<Math.abs(_.birth[H]-(I-1.2))&&(H=X);else{const X=ae.at(I,d,h,b);for(let Se=1;Se<_.pts.length-1;Se++)_.pts[Se].distanceTo(X)<_.pts[H].distanceTo(X)&&(H=Se)}const L=[],W=[];if(t<2)for(let X=I+(t?0:.5);X<M+.75;X+=.5)L.push(ae.at(X,d,h,b)),W.push(X);else{const X=se=>{const Xe=se-qe,Ve=ge(-1.1,0,Xe),$e=ge(-.25,.75,Xe),Qe=ae.rangeAt(se)*b;return ae.at(se,d*(1-Ve)+70*$e,h+F(0,-14,Ve)-12*$e,F(Qe,32,Ve)/ae.rangeAt(se))};for(let se=I;se<qe-1.25;se+=.5)L.push(X(se)),W.push(se);for(let se=qe-1.25;se<qe+.8;se+=.25)L.push(X(se)),W.push(se);const Se=L[L.length-1].clone(),Ae=W[W.length-1];for(let se=1;se<=3;se++)L.push(Se.clone().lerp(oe,se/4)),W.push(F(Ae,T-1,se/4));L.push(oe.clone()),W.push(T-1)}const j=_.pts[H],Z=t?Math.max(_.birth[H],I-Math.max(.8,j.distanceTo(L[0])/50)):Math.max(_.birth[H],I-.5),ee=m.chain(j,L,{stepMin:9,stepMax:20,kink:.6,exact:!0,must:!0,clearance:_e+1,reach:6}),me=ee.pts,he=dt(ee.pts,ee.marks,Z,W).birth;t===2&&(me.push(oe.clone().add(a(-1.2,-2.6,-2.4))),he.push(Math.max(T,he[he.length-1]+.05)));const J=Pe("dive"+t,me,he,{width:1,level:1,seed:Y,linger:t===2?2.4:1.2,corona:t===2?1.45:1.6});r.push(J),le.push(J),ue.push({name:J.name,on:I,to:M}),await c.yield()}const we=[C,C,C,A,A,...le];let de=0,He=0;for(;de<w&&He++<w*6;){const t=He%3===2&&r.length>6?r[5+Math.floor(e()*(r.length-5))]:we[Math.floor(e()*we.length)];if(t.level>2||t.pts.length<3)continue;const d=1+Math.floor(e()*(t.pts.length-2)),h=t.pts[d],b=t.birth[d];if(h.y>715||b>37||h.y<60||t===A&&t.dist[d]>t.len-150)continue;const Y=Te.subVectors(t.pts[d+1],t.pts[d-1]).normalize().clone(),I=e()*Ze,M=t===A?e.range(.25,.8):e.range(.1,.9),_=a(Math.cos(I),0,Math.sin(I)).multiplyScalar(1.25-M*.55).add(a(0,-.15-M*.8,0)).addScaledVector(Y,.45).normalize(),H=e.range(20,55)*(t.level===0?1:.75),L=o.habit==="willow"?.55:o.habit==="sparse"?1.5:1,W=Math.min(e.range(90,320)*L*(t.level===0?1:.6),H*16),j=h.clone().addScaledVector(_,W*.5).add(a(e.range(-.12,.12)*W,0,e.range(-.12,.12)*W)),Z=h.clone().addScaledVector(_,W),ee=m.chain(h,[j,Z],{stepMin:8,stepMax:t.level===0?40:28,kink:1.1,minY:26,maxLen:W});if(ee.pts.length<3)continue;const me=je(ee.pts),he=me[me.length-1],J=e.chance(.36),X=b+.7*he/H,Se=me.map(Ae=>J||Ae<.7*he?b+Ae/H:F(X,Math.max(46,X+6),Math.pow((Ae-.7*he)/(.3*he),1.15)));r.push(Pe("b"+de,ee.pts,Se,{alive:!J,width:t.level===0?.8:.62,level:t.level+1,seed:e(),linger:e.range(.2,1.4)})),de++,de%4===0&&await c.yield()}await c.yield();const ne=r.length,ye=Math.round(w*2.6);for(let t=0;t<ye;t++){const d=r[Math.floor(e()*ne)],h=1+Math.floor(e()*Math.max(1,d.pts.length-2));if(h>=d.pts.length)continue;const b=d.pts[h],Y=d.birth[h]+e.range(0,.6);if(b.y>720||b.y<40||d===A&&d.dist[h]>d.len-110)continue;const I=e()*Ze,M=a(Math.cos(I),-e.range(.2,1.2),Math.sin(I)).normalize(),_=e.range(14,46),H=m.chain(b,[b.clone().addScaledVector(M,_)],{stepMin:8,stepMax:19,kink:1.25,maxLen:_});if(H.pts.length<2)continue;const L=e.range(14,30),W=je(H.pts),j=W.map(ee=>Y+ee/L),Z=Pe("t"+t,H.pts,j,{width:.42,level:3,seed:e(),linger:e.range(.3,2.5),corona:.45});o.habit==="willow"&&t%5<3&&d!==C&&d!==A||r.push(Z),t%15===0&&await c.yield()}await c.yield();const Ce=.5,Fe=r.length;let Ie=0;for(let t=0;t<Fe;t++){const d=r[t],h=d===A?2:0;for(let b=1;b<d.pts.length-1-h;b++){const Y=e()<Ce,I=e.range(25,75)*ct,M=e()*Ze,_=e.range(3,8),H=e.range(7,14),L=e.range(0,.12),W=e(),j=d.pts[b];if(!Y||j.y<30||j.y>800||d.birth[b]>38)continue;const Z=a().subVectors(j,d.pts[b-1]).normalize();ke.set(0,1,0),Math.abs(Z.y)>.9&&ke.set(1,0,0),ke.addScaledVector(Z,-ke.dot(Z)).normalize(),lt.crossVectors(Z,ke);const ee=Z.multiplyScalar(Math.cos(I)).addScaledVector(ke,Math.cos(M)*Math.sin(I)).addScaledVector(lt,Math.sin(M)*Math.sin(I)),me=Math.min(_,Math.max(3,Ct*m.dRoute(j))),he=j.clone().addScaledVector(ee,me),J=d.birth[b]+L;(d!==C?!(m.clear(he,_e+1)&&m.clear(Oe.lerpVectors(j,he,.5),_e+1)):!m.clear(he,16))||r.push(Pe("k"+Ie++,[j.clone(),he],[J,J+me/H],{alive:d.stall>=et,stall:d.stall,width:.34,level:3,seed:W,linger:Math.max(0,d.fade[b]-d.stall-.5),dieRun:.5,corona:.3,coronaI:.55,cool:.6}))}t%12===11&&await c.yield()}if(await c.yield(),o.stray){const t=o.strayRng,d=o.stray,h=vt(t,p);let b=1,Y=1e9;for(let J=1;J<A.pts.length-1;J++){const X=Math.abs(A.pts[J].z-(d.z+25));A.birth[J]<13.5&&X<Y&&(Y=X,b=J)}const I=A.pts[b],M=A.birth[b],_=I.clone().lerp(d,.45).add(a(t.range(4,22),t.range(0,24),t.range(-10,12))),H=a(d.x+9,d.y+31,d.z-14),L=h.chain(I,[_,H],{stepMin:10,stepMax:30,kink:.9,exact:!0,must:!0,clearance:12}),W=[[6,19.5,-9],[2.2,11.5,-5.5],[3.6,5,-1.5],[0,0,0],[.4,-.5,1],[.1,-1.1,1.7]],j=L.pts.slice(),Z=j.length-1;for(const J of W)j.push(a(d.x+J[0],d.y+J[1],d.z+J[2]));const ee=o.strayT??22.7,me=ee-1.7,he=dt(j,[L.marks[0],Z,Z+4,Z+6],M,[F(M,me,.5),me,ee,ee+2.3]);r.push(Pe("stray",j,he.birth,{width:.8,level:1,seed:t(),linger:.9,corona:.55}))}await c.yield();{const t=h=>h.x.toFixed(3)+","+h.y.toFixed(3)+","+h.z.toFixed(3),d=new Set;for(const h of r){if(h===C||h.name==="dive2"||h.name==="stray")continue;let b=-1,Y=m.clear(h.pts[0],_e);for(let M=0;M<h.pts.length-1&&b<0;M++){const _=h.pts[M],H=h.pts[M+1],L=Math.max(1,Math.ceil(_.distanceTo(H)/2));for(let W=1;W<=L;W++)if(Oe.lerpVectors(_,H,W/L),!Y)Y=m.clear(Oe,_e);else if(!m.clear(Oe,_e)){b=M;break}}if(b<0)continue;for(let M=b+1;M<h.pts.length;M++)d.add(t(h.pts[M]));if(b<1){h.gone=!0;continue}const I={...h.o,run:h.run?h.run.slice(0,b+1):null};Object.assign(h,Pe(h.name,h.pts.slice(0,b+1),h.birth.slice(0,b+1),I))}for(let h=d.size>0;h;){h=!1;for(const b of r)if(!b.gone&&b!==C&&d.has(t(b.pts[0]))){for(let Y=1;Y<b.pts.length;Y++)d.add(t(b.pts[Y]));b.gone=!0,h=!0}}for(let h=r.length-1;h>=0;h--)r[h].gone&&r.splice(h,1)}await c.yield();const Ee=vt(s,p),Me=[];for(let t=0;t<u.length;t++){const d=u[t],h=t===0,b=h?i.clone():d.clone().lerp(i,.2).add(a(s.range(-5,5),s.range(34,44),s.range(-4,4))),Y=d.clone().lerp(b,.5).add(a(s.range(-2.5,2.5),3,s.range(-2.5,2.5))),I=Ee.chain(d,[Y,b],{stepMin:3,stepMax:7.5,kink:.55,exact:!0,must:!0,clearance:0,reach:4,drift:0}),M=je(I.pts),_=M[M.length-1],H=13.3+t*.8,L=h?35.5:35.2,W=M.map(Z=>F(H,L,Math.pow(Z/_,.9))),j=Pe(h?"fore":"mast"+t,I.pts,W,{alive:h,stall:h?et:35.6,width:.5,level:1,stroke:h,seed:s(),linger:.1,corona:.7});h&&(j.run=M.map(Z=>Z/_*50/D)),r.push(j),Me.push(j)}for(let t=0;t<n.length;t++){const d=n[t],h=s.range(2.2,4.4),b=s.range(17,30),Y=Ee.chain(d,[d.clone().add(a(s.range(-.6,.6),h,s.range(-.6,.6)))],{stepMin:.5,stepMax:1.1,kink:.6,exact:!0,must:!0,clearance:0,reach:.6,drift:0}),I=je(Y.pts),M=I[I.length-1],_=s.range(3,6),H=I.map(L=>b+_*L/M);r.push(Pe("crest"+t,Y.pts,H,{width:.07,level:3,seed:s(),linger:s.range(.5,2),corona:.12}))}return await c.yield(),{branches:r,fork:x,forkIndex:R,trunk:C,ship:A,dive:le,streamers:Me,lead:ue,rest:oe}}async function Lt(c,s){let o=0;for(const r of s)o+=r.pts.length-1;const p=new Float32Array(o*12),y=new Float32Array(o*12),k=new Float32Array(o*8),i=new Float32Array(o*16),u=new Float32Array(o*16),n=new Float32Array(o*16),w=new Uint32Array(o*6);let e=0;for(const r of s){for(let g=0;g<r.pts.length-1;g++,e++){const S=r.pts[g],O=r.pts[g+1],E=R=>r.level===0?F(1,.82,R/r.len):F(1,.5,R/r.len),B=g===r.pts.length-2?1:0,G=r.width*E(r.dist[g]),C=r.width*E(r.dist[g+1])*(B?.4:1);for(let R=0;R<4;R++){const x=e*4+R;p[x*3]=S.x,p[x*3+1]=S.y,p[x*3+2]=S.z,y[x*3]=O.x,y[x*3+1]=O.y,y[x*3+2]=O.z,k[x*2]=R>>1,k[x*2+1]=(R&1)*2-1,i[x*4]=r.birth[g],i[x*4+1]=Math.max(r.birth[g+1],r.birth[g]+.001),i[x*4+2]=r.fade[g],i[x*4+3]=r.fade[g+1],u[x*4]=G,u[x*4+1]=r.stroke+2*B,u[x*4+2]=r.run?r.run[g]:2,u[x*4+3]=r.run?r.run[g+1]:2,n[x*4]=r.seed,n[x*4+1]=r.dist[g],n[x*4+2]=C,n[x*4+3]=r.cool}w.set([e*4,e*4+1,e*4+2,e*4+2,e*4+1,e*4+3],e*6)}await c.yield()}const m=new v.BufferGeometry;return m.setAttribute("position",new v.BufferAttribute(p,3)),m.setAttribute("aOther",new v.BufferAttribute(y,3)),m.setAttribute("aCorner",new v.BufferAttribute(k,2)),m.setAttribute("aTime",new v.BufferAttribute(i,4)),m.setAttribute("aMisc",new v.BufferAttribute(u,4)),m.setAttribute("aSeed",new v.BufferAttribute(n,4)),m.setIndex(new v.BufferAttribute(w,1)),m.boundingSphere=new v.Sphere(a(70,380,280),700),{geometry:m,steps:o}}async function Wt(c,s){const o=new Uint8Array(De*Ke*4);for(let i=0;i<Ke;i++){const u=mt+(i+.5)/Ke*pt,n=Math.round(tt(F(-10.5,15,te((790-u)/720,0,1))+1.5)*255);for(let w=0;w<De;w++){const e=(i*De+w)*4;o[e+1]=n,o[e+2]=255,o[e+3]=255}i%24===23&&await c.yield()}const p=new Uint8Array(De*Ke);let y=0;for(const i of s){if(i.level===3&&i.width<.2)continue;const u=Math.round(255*te(.35+.65*i.width,0,1));for(let n=0;n<i.pts.length-1;n++){const w=i.pts[n],e=i.pts[n+1],m=w.distanceTo(e),r=Math.max(1,Math.ceil(m/1.1));for(let g=0;g<=r;g++){const S=g/r,O=F(w.x,e.x,S),E=F(w.y,e.y,S),B=(O-Tt)/zt*De,G=(E-mt)/pt*Ke,C=Math.round(B),R=Math.round(G),x=Math.round(tt(F(i.birth[n],i.birth[n+1],S))*255),q=Math.round(tt(Math.min(F(i.fade[n],i.fade[n+1],S)+.8,60))*255);for(let ce=-2;ce<=2;ce++)for(let $=-2;$<=2;$++){const N=C+$,Q=R+ce;if(N<0||Q<0||N>=De||Q>=Ke)continue;const P=(Q*De+N)*4,A=$*$+ce*ce,D=A===0?u:A===1?u*.6:A===2?u*.3:0;D>o[P]&&(o[P]=D);const ae=Q*De+N;p[ae]?(x<o[P+1]&&(o[P+1]=x),q>o[P+2]&&(o[P+2]=q)):(p[ae]=1,o[P+1]=x,o[P+2]=q)}}y+=r,y>200&&(y=0,await c.yield())}}await c.yield();const k=new v.DataTexture(o,De,Ke,v.RGBAFormat,v.UnsignedByteType);return k.magFilter=v.LinearFilter,k.minFilter=v.LinearMipmapLinearFilter,k.wrapS=k.wrapT=v.ClampToEdgeWrapping,k.generateMipmaps=!0,k.colorSpace=v.NoColorSpace,k.needsUpdate=!0,k}const Pt=`
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fq = fogDensity * uHaze * vFogDepth; col *= exp(-fq * fq);
    #else
      col *= 1.0 - smoothstep(fogNear, fogFar, vFogDepth * uHaze);
    #endif
  #endif`,Kt=`
  attribute vec3 aOther; attribute vec2 aCorner; attribute vec4 aTime; attribute vec4 aMisc; attribute vec4 aSeed;   // aMisc: width at the step's start, stroke (+2 on a channel's last step), stroke run at both ends; aSeed: seed, metres along the branch, width at the step's end, how cool the channel is from the start (kink twigs)
  uniform float uT, uResY, uStroke, uFront, uWidth;
  varying vec2 vP; varying vec4 vTime; varying vec4 vK; varying vec4 vS; varying vec2 vDim; varying vec3 vX; varying float vHalo;
  #include <fog_pars_vertex>
  void main() {
    float g = clamp((uT - aTime.x) / max(aTime.y - aTime.x, 1e-3), 0., 1.);
    vec4 a = modelViewMatrix * vec4(position, 1.), b4 = modelViewMatrix * vec4(aOther, 1.);
    vec3 b = mix(a.xyz, b4.xyz, g);
    vec3 axis = b - a.xyz; float L = length(axis);
    vec3 ax = L > 1e-4 ? axis / L : vec3(0., 1., 0.);
    vec3 p = mix(a.xyz, b, aCorner.x);
    float dist = max(length(p), 0.3);
    vec3 sd = cross(ax, -p / dist); float sl = length(sd);
    sd = sl > 1e-4 ? sd / sl : vec3(1., 0., 0.);
    float run = mix(aMisc.z, aMisc.w, aCorner.x);
    float strokeK = mod(aMisc.y, 2.), endK = step(1.5, aMisc.y);
    float st = uStroke * strokeK * (1. - smoothstep(uFront - 0.05, uFront, run));
    float pxPerM = uResY * projectionMatrix[1][1] * 0.5 / dist;
    float wv = mix(aMisc.x, aSeed.z, g * aCorner.x);              // the channel's width here: it tapers along every step
    // (the sleeve and the halo of a channel close to the lens are drawn a little slimmer than their true size, 0.7 at
    // 10 m: a fork that splits past is a bright wire in a sleeve, not a beam across the frame; the core keeps the
    // brief's width at every distance)
    float wc = wv * uWidth * (1. + 0.7 * st), ws = wc * mix(0.7, 1., smoothstep(10., 40., dist));
    float w = max(3.0 * ws, 3.2 / pxPerM);                      // half width of the quad: 6 m halo, never under ~6 px
    float core = max(0.15 * wc * (1. + 0.9 * st), 0.8 / pxPerM) / w;    // THE BRIEF'S 0.3 m WHITE-HOT CORE (a channel of width 1), never under ~1.6 px
    float glow = max(0.75 * ws, 2.0 / pxPerM) / w;              // 1.5 m glow
    p += sd * aCorner.y * w + ax * (aCorner.x * 2. - 1.) * w;
    vP = vec2(aCorner.y * w, mix(-w, L + w, aCorner.x));
    vK = vec4(L, w, core, glow);
    vTime = vec4(aTime.x, mix(aTime.x, aTime.y, g), aTime.z, mix(aTime.z, aTime.w, g));
    vS = vec4(st, aSeed.x, aSeed.y, strokeK);
    // where the pixel floors widen a far channel, dim it so that a distant tree is fine bright wire, not a white bar
    vDim = vec2(pow(clamp(0.15 * wc * pxPerM / 0.8, 0.06, 1.), 0.5), pow(clamp(0.75 * ws * pxPerM / 2.0, 0.06, 1.), 0.7));
    // BRIGHTNESS TAPERS WITH WIDTH (trunk and limbs full, forks less, twigs under half) and with nothing else: a far
    // channel takes the scene's own haze (FOG_ATTEN) and the brief's cooling by age; its light does not know the lens
    vX = vec3(aSeed.w, endK * smoothstep(0., 1., uT - aTime.y), clamp(0.22 + 0.78 * wv, 0.4, 1.));
    vHalo = 1.;
    vec4 mvPosition = vec4(p, 1.);
    gl_Position = g <= 0. ? vec4(2., 2., 2., 1.) : projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Ot=`
  uniform float uT, uAfter, uHaze, uGain;
  uniform vec3 uCore, uGlowC, uViolet, uRose;
  varying vec2 vP; varying vec4 vTime; varying vec4 vK; varying vec4 vS; varying vec2 vDim; varying vec3 vX; varying float vHalo;
  #include <fog_pars_fragment>
  void main() {
    float pm = max(fwidth(vP.x), 1e-4);                           // metres per pixel here
    float L = vK.x, W = max(vK.y, 1e-3);
    float t = clamp(vP.y / max(L, 1e-3), 0., 1.);
    float dy = vP.y - t * L;
    float ya = vS.z + vP.y, sd1 = vS.y * 37.;
    float wob = (sin(ya * 1.9 + sd1) + 0.6 * sin(ya * 4.7 + sd1 * 1.7 + uT * 0.8)) * 0.3 * vK.z * W * step(0.03, vK.z);
    // EVERY STEP IS STRAIGHT (the brief: a chain of straight steps joined at hard kinks); the channel only SWELLS within
    // two metres of a kink (1.4 times) and thins between kinks (0.82): a thing that feels its way, joint by joint
    float yc = clamp(vP.y, 0., L), kd = min(yc, L - yc);
    float swell = 0.82 + 0.6 * exp(-kd / 1.4);
    float xx = vP.x + wob;
    float d = sqrt(max(vP.x * vP.x + dy * dy, 0.)) / W;
    if (d >= 1.) discard;
    float dc = sqrt(max(xx * xx + dy * dy, 0.)) / W;
    float cap = 1. - 0.5 * smoothstep(0., 0.03 * W, abs(dy));    // round ends at half weight so kinks do not double
    float birth = mix(vTime.x, vTime.y, t), fade = mix(vTime.z, vTime.w, t);
    float age = max(uT - birth, 0.);
    float young = exp(-age / 1.6) * (1. - 0.5 * vX.x), cool = mix(1. - exp(-age / 8.), 1., clamp(vX.x, 0., 1.));   // (vX.x: a kink twig is violet and dim from the start)
    float fresh = exp(-max(uT - vTime.x, 0.) / 0.55);            // the step that is being laid down now flares as it forms
    // A LOSING BRANCH FADES FROM ITS TIP BACK TO ITS FORK THROUGH DULL ROSE (the brief; four seconds in all): fade
    // is when the rose front, running back from the stalled tip, reaches this place; here the channel cools to dull
    // rose in half a second and is out by DIE_OUT. Never brighter or more saturated than the rose itself.
    float fx = uT - fade;
    float roseS = smoothstep(-0.15, 0.45, fx);
    float rose = max(roseS, uAfter * (1. - vS.w));                              // (after the stroke every loser goes to rose)
    float gone = (1. - smoothstep(0.45, ${At.toFixed(2)}, fx)) * (1. - 0.3 * uAfter * (1. - vS.w));
    // THREE LAYERS. A thin white-hot core ...
    float core = 1. - smoothstep(vK.z * 0.3 * swell, vK.z * swell, dc);
    core = core * (0.7 + 0.3 * core);
    // ... inside a sleeve of glow with a cusp at the core and a soft skirt (a luminous channel, never an even tube):
    // violet-white next to the core, violet at its edge, swelling and narrowing along the channel, wider on a new step ...
    float gw = vK.w * (0.8 + 0.4 * (0.5 + 0.5 * sin(ya * 0.23 + sd1 * 2.1))) * (1. + 0.5 * fresh) * swell;
    // where the front has passed the channel is a dull-rose THREAD, half as wide as the live sleeve was and under half
    // as bright, breaking into dashes as it goes out. Never a wide pink ribbon.
    gw *= mix(1. + 0.6 * rose, 0.5, roseS);
    float dph = ya / 4.6 + sd1, dcell = floor(dph), dtri = 1. - abs(fract(dph) - 0.5) * 2.;
    float dth = 0.1 + 0.6 * smoothstep(0.3, ${At.toFixed(2)}, fx) + (fract(sin(dcell * 91.7 + sd1) * 43758.5453) - 0.5) * 0.3;
    float emberK = mix(1., 0.42 * smoothstep(dth - 0.1, dth + 0.1, dtri), roseS);
    float q = dc / max(gw, 1e-4);
    float glow = 0.62 * exp(-q * 2.6) + 0.38 * exp(-q * q * 1.6);
    // ... with fine side feelers: short streamers that leave the channel leaning the way it grows, each its own
    // length, breathing in length (drawn only where a pixel is fine enough to hold them)
    float ax = abs(xx), sgn = xx < 0. ? -1. : 1., u = ya - ax * 0.75, sp = 2.3, ci = floor(u / sp);
    float h1 = fract(sin(ci * 12.9898 + sd1 + sgn * 3.7) * 43758.5453), h2 = fract(h1 * 17.31 + 0.37);
    float flen = W * (0.26 + 0.62 * h2) * (0.7 + 0.3 * sin(uT * (1.2 + 2. * h1) + h2 * 30.));
    float du = abs(fract(u / sp) - 0.5) * sp * 0.8, lw = max(0.045, 0.9 * pm);
    float feel = (1. - smoothstep(lw * 0.5, lw * 1.6, du)) * max(1. - ax / max(flen, 1e-3), 0.) * step(0.42, h1) * step(dy * dy, 1e-6)
      * min(1., 0.045 / lw + 0.5) * (1. - smoothstep(0.3, 0.7, pm));
    // ... inside a faint halo
    float halo = (1. - d) * (1. - d);
    float shim = 0.88 + 0.12 * sin((vS.z + vP.y) * 0.21 - uT * 2.3 + vS.y * 40.);
    vec3 cc = mix(uCore, mix(uCore, uViolet, 0.45), cool) * 3.4 * mix(0.45, 1., young) * (1. + 0.7 * fresh);
    vec3 gc = mix(mix(uGlowC, uViolet, 0.3 + 0.45 * cool), uViolet, smoothstep(0.12, 0.85, q)) * mix(0.36, 0.66, young) * (1. + 1.1 * fresh);
    vec3 fc = mix(uViolet, uGlowC, 0.45) * mix(0.35, 1.2, young);
    vec3 hc = uViolet * (0.07 + 0.1 * young + 0.18 * fresh);
    vec3 dull = mix(uRose, vec3(dot(uRose, vec3(0.2126, 0.7152, 0.0722))), 0.15);
    cc = mix(cc, dull * 0.3, rose); gc = mix(gc, dull * 0.46, rose); fc = mix(fc, dull * 0.1, rose); hc = mix(hc, dull * 0.09, rose);
    core *= 1. - 0.75 * rose; glow = mix(glow, 0.5 * exp(-q * 1.5) + 0.5 * exp(-q * q), rose);   // an ember has no hot wire in it: its sleeve, fuller and softer
    float ember = 1.;
    float bright = vX.z, tipFade = 1. - 0.92 * vX.y * smoothstep(0.1, 1., t);   // a channel that has stopped ends in a point, not in a stub
    vec3 col = (cc * core * vDim.x * mix(1., bright, 0.6) * ember + (gc * glow * (1. - 0.5 * core) + fc * feel * (1. - core) + hc * halo * clamp(vHalo, 0., 1.)) * vDim.y * bright) * cap * shim * gone * tipFade * emberK;
    float st = vS.x;
    col = col * (1. + 0.9 * st) + uCore * core * cap * st * 2.6 * vDim.x;   // the stroke: the joined channel only
    col *= uGain;
    ${Pt}
    gl_FragColor = vec4(col, 1.);
  }`,qt=`
  attribute vec3 iPos; attribute vec3 iDir; attribute vec4 iParm;     // iParm: size, intensity, seed, rose
  uniform float uResY, uT;
  varying vec2 vQ; varying vec4 vParm; varying vec3 vAim; varying float vHot;   // vAim: tip heading on the quad (xy) and px per metre; vHot: the hot heart's gain
  #include <fog_pars_vertex>
  void main() {
    vec4 c = modelViewMatrix * vec4(iPos, 1.);
    float dist = max(length(c.xyz), 0.3);
    float pxPerM = uResY * projectionMatrix[1][1] * 0.5 / dist;
    float breathe = 1. + 0.09 * sin(uT * 1.7 + iParm.z * 50.);
    float R = max(11. * iParm.x, 7. / pxPerM);                    // quad half size: room for the feelers
    vec3 dv = mat3(modelViewMatrix) * iDir;
    vec2 aim = dv.xy; float al = length(aim);
    aim = al > 1e-3 ? aim / al : vec2(0., -1.);
    vQ = position.xy * R;
    vParm = vec4(max(4. * iParm.x * breathe, 2.4 / pxPerM), iParm.y, iParm.z, iParm.w);
    vAim = vec3(aim * mix(0.45, 1., al), pxPerM);                 // feelers foreshorten when the tip comes at the lens
    vHot = mix(0.3, 1., smoothstep(5., 15., dist));              // A CORONA KEEPS ITS VIOLET EDGE AT ANY DISTANCE: within 15 m of the lens its white heart is turned down (the same at every place)
    vec4 mvPosition = vec4(c.xyz + vec3(position.xy * R, 0.), 1.);
    gl_Position = iParm.y <= 0.001 ? vec4(2., 2., 2., 1.) : projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Nt=`
  uniform float uT, uHaze, uGain;
  uniform vec3 uCore, uGlowC, uViolet, uRose;
  varying vec2 vQ; varying vec4 vParm; varying vec3 vAim; varying float vHot;
  #include <fog_pars_fragment>
  void main() {
    float R = vParm.x, r = length(vQ);
    float x = r / R;
    // a soft violet bloom, whiter toward a small hot heart
    float hk = clamp(vHot, 0., 1.), soft = exp(-x * x * 2.4) * 0.7 + exp(-x * x * 12.) * 0.5 * mix(0.6, 1., hk) + exp(-x * x * 50.) * 1.3 * hk;
    vec3 bc = mix(uViolet, uGlowC, 0.3 + 0.6 * exp(-x * x * 4.));
    float fl = length(vAim.xy);
    vec2 e0 = fl > 1e-3 ? vAim.xy / fl : vec2(0., -1.);
    vec2 e1 = vec2(-e0.y, e0.x);
    float lw = max(0.018 * R, 0.8 / max(vAim.z, 1e-4));
    // a brush of twelve hair-fine feelers, none longer than the corona's radius, fading along their length
    float feel = 0.;
    for (int i = 0; i < 12; i++) {
      float fi = float(i), sd = vParm.z * 31. + fi * 2.39;
      float ang = (fi - 5.5) * 0.27 + 0.26 * sin(sd * 3.1) + 0.05 * sin(uT * 0.9 + sd);
      float len = R * (0.5 + 0.6 * (0.5 + 0.5 * sin(uT * (1.1 + 0.23 * fi) + sd * 5.))) * fl;   // length flickers, brightness does not
      vec2 e = e0 * cos(ang) + e1 * sin(ang);
      float pr = clamp(dot(vQ, e), 0., len);
      float dd = length(vQ - e * pr), fade = 1. - pr / max(len, 1e-3);
      feel += (1. - smoothstep(lw * 0.4, lw * 1.6, dd)) * fade * fade;
    }
    // the tip itself: a small crisp white-hot point inside the bloom (never under a pixel; dimmed where the floor widens it)
    float rc = max(0.05 * R, 1.1 / max(vAim.z, 1e-4)), hot = exp(-r * r / (rc * rc)) * min(1., 0.3 + 0.7 * 0.05 * R / rc);
    vec3 col = bc * soft + uCore * hot * 2.6 * hk + mix(uViolet, uCore, 0.3) * min(feel, 1.3) * 0.8 * min(1., 0.018 * R / lw + 0.45);
    col = mix(col, uRose * (soft * 0.45 + feel * 0.2), vParm.w);
    col *= vParm.y * uGain;
    ${Pt}
    gl_FragColor = vec4(col, 1.);
  }`,Ut=`
  attribute vec3 iBase; attribute vec4 iParm;                       // iParm: radius, seed, wobble period, kind (1 = milky hail)
  uniform vec3 uCam, uCamRight, uCamFwd, uVelDir, uTreeC;
  uniform float uBox, uWrap, uSink, uAmb, uT, uResY, uMinPx, uFloorA, uStreak, uCheat, uSize, uRide, uShow;
  varying vec3 vWorld; varying vec3 vC; varying vec4 vShape; varying vec4 vInfo; varying vec4 vTaz; varying vec2 vAx;
  #include <fog_pars_vertex>
  void main() {
    float seed = iParm.y;
    float sink = uSink * (0.6 + 0.8 * fract(seed * 7.13));
    vec3 rel;
    float streak = uStreak * (1. - 0.4 * uRide);                     // (the large drops that travel with the lens at half its speed are drawn out too: long needles, close to)
    if (uWrap > 0.5) { vec3 b = iBase * uBox; b.y -= sink; rel = mod(b - uCam * (1. - 0.5 * uRide) + 0.5 * uBox, vec3(uBox)) - 0.5 * uBox; }
    else { rel = iBase - uCam; rel.y -= (uT - 25.) * 0.02 * (0.6 + 0.8 * fract(seed * 7.13)); }
    float dist = max(length(rel), 0.05);
    vec3 view = rel / dist;
    vec3 c = uCam + rel;
    float a = iParm.x * uSize;
    float pxPerM = uResY * projectionMatrix[1][1] * 0.5 / dist;
    float hail = step(0.5, iParm.w);
    // at speed a bead is a needle a fifth as wide as the bead it came from (hail does not streak: it only reads smaller)
    float sp = clamp(1. + streak / a, 1., 8.), sk = clamp((sp - 1.) / 1.5, 0., 1.) * (1. - hail);
    float thin = mix(mix(1., 0.2, sk), mix(1., 0.6, clamp((sp - 1.) / 1.5, 0., 1.)), hail);
    float grow = max(1., uMinPx / max(a * thin * pxPerM, 1e-4));    // tiny beads (and thin needles) are drawn at a floor size and thinned in alpha instead
    float alpha = max(mix(1. / (grow * grow), 1. / grow, sk), uFloorA * step(1.001, grow));
    float edge = max(abs(rel.x), max(abs(rel.y), abs(rel.z))) / max(0.5 * uBox, 1e-3);
    alpha *= 1. - uWrap * smoothstep(0.78, 1., edge);               // no popping where the field wraps
    alpha *= smoothstep(0.32 + 0.85 * uRide, 0.6 + 1.35 * uRide, dist) * uShow;   // none at the near plane (a riding drop is whole glass from 1.95 m: never a disc a third of the frame tall cut by its corner)
    a *= grow;
    // A NEEDLE IS A HAIR OF GLASS: however large the drop and however near, its drawn half-width is capped at one
    // pixel (at 360 lines of picture) and its length at eight times the bead it came from, so a streak at arm's
    // length is a thread, never a spindle or a bar
    thin *= mix(1., min(1., 1.0 * uResY / 360. / max(a * thin * pxPerM, 1e-4)), smoothstep(0.12, 0.5, sk));   // (a drop that is half drawn out is already held to the hair's width)
    // bun <-> sphere wobble (real drop oscillation, slowed)
    float wb = 0.5 + 0.5 * sin(uAmb * 6.2832 / max(iParm.z, 0.5) + seed * 40.);
    float ah = a * mix(1.08, 0.99, wb), bu = a * mix(mix(0.72, 0.97, wb), 0.96, hail), bl = a * mix(mix(0.42, 0.7, wb), 0.9, hail);
    float fl = sk * smoothstep(1., 1.6, grow); bu = mix(bu, ah, fl); bl = mix(bl, ah, fl);   // a needle drawn at the floor is round in section: its full pixel floor wide, so a far streak is a hairline and never a row of dots
    // needles at speed: stretch along the camera's velocity
    float s = mix(max(sp / grow, mix(1., 4.5 * thin, sk)), 1., hail);   // drawn out by its TRUE size; one that is drawn at the floor keeps a dash four and a half times its width
    ah *= thin; bu *= thin; bl *= thin; s = min(s / mix(thin, 1., hail), 240.);
    alpha *= mix(1., 0.55, clamp((s - 1.) / 10., 0., 1.));
    alpha *= mix(1., 0.55, sk * smoothstep(40., 90., 2. * ah * s * pxPerM));   // (a needle longer than forty pixels is fainter still)
    vec3 e1 = uVelDir - view * dot(uVelDir, view); float l1 = length(e1);
    vec3 er = uCamRight - view * dot(uCamRight, view);
    if (l1 > 1e-3 && s > 1.02) e1 /= l1; else { e1 = er / max(length(er), 1e-3); l1 = 0.; }
    vec3 e2 = cross(view, e1);
    float h1 = ah * sqrt(1. + (s * s - 1.) * l1 * l1) * 1.1, h2 = ah * 1.1;
    vec3 wp = c + e1 * position.x * h1 + e2 * position.y * h2;
    vWorld = wp; vC = c;
    vShape = vec4(ah, bu, bl, s);
    vAx = vec2(position.x * step(1.02, s) * step(1e-3, l1), sk);          // along the needle (-1 tail .. 1 leading end), how much of a needle it is
    // sparkle for beads too small to resolve
    float spark = step(0.965, fract(seed * 91.7)) * (0.55 + 0.45 * sin(uAmb * 0.9 + seed * 60.)) * step(1.5, grow);
    vInfo = vec4(alpha, seed, hail, spark);
    // where this bead's little tree sits: toward the real tree, turned by uCheat toward the camera's heading
    vec2 toT = uTreeC.xz - c.xz; float dT = length(toT); toT /= max(dT, 1e-3);
    vec2 cf = uCamFwd.xz; float cl = length(cf); cf = cl > 1e-3 ? cf / cl : toT;
    vec2 tz = mix(toT, cf, uCheat); float tl = length(tz); tz = tl > 0.05 ? tz / tl : cf;
    vTaz = vec4(tz, clamp(mix(dT, 260., uCheat), 110., 520.), a * pxPerM * mix(1., thin / 0.35, sk));
    vec4 mvPosition = viewMatrix * modelMatrix * vec4(wp, 1.);
    gl_Position = alpha <= 0.002 ? vec4(2., 2., 2., 1.) : projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Yt=`
  uniform vec3 uCam, uVelDir, uTreeC, uKey;
  uniform vec3 uBand, uCloud, uSea, uCore, uGlowC, uViolet;
  uniform vec2 uBandDir;
  uniform float uBandW, uBandH, uTenc, uStroke, uKeyI, uTreeGain;
  uniform sampler2D uMap;
  varying vec3 vWorld; varying vec3 vC; varying vec4 vShape; varying vec4 vInfo; varying vec4 vTaz; varying vec2 vAx;
  #include <fog_pars_fragment>

  // the sky a bead refracts: lemon slot in the west, slate cloud, teal sea, and the growing tree
  vec3 env(vec3 d) {
    float hl = max(length(d.xz), 1e-4);
    vec2 hz = d.xz / hl;
    float el = d.y / hl;
    float west = smoothstep(uBandW - 0.25, uBandW + 0.2, dot(hz, uBandDir));
    vec3 sky = mix(mix(uCloud, uBand, 0.16 * west) * 1.5, uCloud, smoothstep(0.03, 0.7, el));
    sky += uViolet * 0.10 * smoothstep(0.5, 3., el);
    float band = smoothstep(0., 0.014, el) * (1. - smoothstep(uBandH * 0.55, uBandH * 1.5, el));
    sky = mix(sky, uBand * 1.35, band * west);
    vec3 sea = mix(uSea * 0.8, uSea * 2.1 + uBand * 0.14 * west, smoothstep(-0.5, 0., el));
    vec3 c = mix(sea, sky, smoothstep(-0.006, 0.006, el));
    float fw = dot(d.xz, vTaz.xy);
    if (fw > 0.04) {
      float lat = dot(d.xz, vec2(-vTaz.y, vTaz.x)) / fw * vTaz.z, hy = d.y / fw * vTaz.z;
      vec2 uv = vec2((lat + uTreeC.x - (${Tt.toFixed(1)})) / ${zt.toFixed(1)}, (hy - (${mt.toFixed(1)})) / ${pt.toFixed(1)});
      float lod = clamp(log2(280. / max(vTaz.w, 1.)), 0., 4.5);          // the whole tree is a few dozen pixels inside a bead
      vec4 m = textureLod(uMap, clamp(uv, 0., 1.), lod);
      m.r = min(m.r * exp2(lod * 0.5), 0.85) * (0.2 + 0.8 * smoothstep(4., 40., vTaz.w));   // unresolved beads only take a breath of violet
      float inside = step(0., uv.x) * step(uv.x, 1.) * step(0., uv.y) * step(uv.y, 1.);
      float lit = smoothstep(0., 0.012, uTenc - m.g) * (1. - smoothstep(0., 0.03, uTenc - m.b));
      c += mix(uViolet, uCore, m.r) * m.r * lit * inside * uTreeGain * (1. + 2.5 * uStroke);
    }
    return c;
  }

  void main() {
    vec3 ro = uCam - vC, rw = normalize(vWorld - uCam);
    float kk = 1. - 1. / vShape.w;
    vec3 o = ro - kk * dot(ro, uVelDir) * uVelDir, dd = rw - kk * dot(rw, uVelDir) * uVelDir;
    vec3 su = 1. / vec3(vShape.x, vShape.y, vShape.x), sl = 1. / vec3(vShape.x, vShape.z, vShape.x);
    // upper half: oblate; lower half: flatter still (the flat underside of a falling drop)
    vec3 o1 = o * su, d1 = dd * su;
    float A = dot(d1, d1), B = dot(o1, d1), C = dot(o1, o1) - 1., disc = B * B - A * C;
    vec3 p = vec3(0.), n = vec3(0., 1., 0.); float hit = 0.;
    if (disc > 0.) { float t = (-B - sqrt(disc)) / max(A, 1e-6); vec3 q = o + dd * t; if (q.y >= 0.) { hit = 1.; p = q; n = q * su * su; } }
    if (hit < 0.5) {
      o1 = o * sl; d1 = dd * sl; A = dot(d1, d1); B = dot(o1, d1); C = dot(o1, o1) - 1.; disc = B * B - A * C;
      if (disc > 0.) { float t = (-B - sqrt(disc)) / max(A, 1e-6); vec3 q = o + dd * t; if (q.y < 0.) { hit = 1.; p = q; n = q * sl * sl; } }
    }
    if (hit < 0.5) discard;
    n -= kk * dot(n, uVelDir) * uVelDir;
    n = normalize(n + vec3(0., 1e-5, 0.));
    float ndv = clamp(dot(n, -rw), 0., 1.);
    // a ball lens: refract in, cross the ball, refract out. The scene comes out upside down and reversed.
    vec3 r1 = refract(rw, n, 0.75);
    vec3 p2 = n - 2. * dot(r1, n) * r1;
    vec3 outd = refract(r1, -p2, 1.333);
    if (dot(outd, outd) < 1e-4) outd = reflect(r1, -p2);
    outd = normalize(outd + vec3(0., 1e-5, 0.));
    vec3 refl = reflect(rw, n);
    float sk = vAx.y, inv = 1. / max(vShape.w, 1.);                  // at speed a bead is a glass dash: dark body, one thread of light, a lemon tick
    float F = (0.03 + 0.97 * pow(max(1. - ndv, 0.), 4.)) * inv;
    vec3 lk = uKey - vC; float lkd = max(length(lk), 1e-3); lk /= lkd;
    float keyI = uKeyI * (1. + 1.5 * uStroke);
    // (nk: how much of a HAIR it is to the eye. A drop that is half drawn out is already all hair: dark glass, never a
    // pale spindle that still carries the bead's glint and its lit heart along its whole length)
    float nk = smoothstep(0.12, 0.5, sk);
    vec3 col = (env(outd) * vec3(0.92, 0.97, 1.) * (1. - F) + env(refl) * F) * mix(1., 0.35, nk);
    float rim = (1. - ndv) * (1. - ndv);
    vec3 sx = cross(rw, uVelDir); float side = dot(n, sx / max(length(sx), 1e-3));
    float lead = vAx.x;
    float fine = smoothstep(1.2, 4., vTaz.w * mix(1., 0.35, sk));
    col += uGlowC * keyI * (pow(max(dot(refl, lk), 0.), 140.) * 4. + pow(max(dot(outd, lk), 0.), 120.) * 0.8);   // glint and the caustic heart
    float edgeK = mix(1., fine, sk);                                 // (nor can it hold a lit edge: that too would break into dots)
    col += uViolet * keyI * rim * rim * (0.2 + max(dot(n, lk), 0.)) * 0.9 * edgeK; col += uCloud * rim * 1.6 * inv;                                                    // violet edge from the leader
    col += uBand * rim * max(n.y, 0.) * max(-dot(n.xz, uBandDir) * 0.5 + 0.6, 0.) * 0.55 * edgeK;                       // cold-yellow edge on the bead top
    // AT SPEED A BEAD IS A HAIR OF DARK GLASS: a dark body, ONE pale edge, and the slot as a lemon tick in the leading
    // tenth of it and nowhere else (no thread of light down its length, no glint: a needle is never a lit bar)
    float tick = smoothstep(0.76, 0.84, lead) * (1. - smoothstep(0.93, 1., lead));
    vec3 needle = uSea * 0.9 + uCloud * 0.22 + (uCloud * 1.25 + uGlowC * keyI * 0.2) * smoothstep(0.2, 0.8, side) + uBand * 1.3 * tick;
    col = mix(col, needle, nk);
    // milky hail: a frosted ball. Mottled body lit from above, a bright Fresnel rim, the slot along its top edge,
    // the leader as a soft glint and a violet edge
    float frost = 0.5 + 0.5 * sin(dot(n, vec3(9.1, 7.3, 8.7)) + vInfo.y * 40.) * sin(dot(n, vec3(-6.2, 11.4, 5.1)) + vInfo.y * 17.);
    frost = mix(frost, 0.5 + 0.5 * sin(dot(n, vec3(23., -17., 29.)) + frost * 3.), 0.35);
    vec3 milk = uCloud * (0.75 + 0.85 * (0.5 + 0.5 * n.y)) * (0.7 + 0.5 * frost) + uCloud * rim * 2.4
      + uBand * max(n.y, 0.) * (rim * 0.9 + 0.12 * frost) * max(-dot(n.xz, uBandDir) * 0.5 + 0.7, 0.)
      + uGlowC * keyI * (0.22 * max(dot(n, lk), 0.) + pow(max(dot(refl, lk), 0.), 24.) * 0.9) + uViolet * keyI * rim * 0.7;
    col = mix(col, milk, vInfo.z * 0.82);
    float al = vInfo.x * smoothstep(0., 0.2, ndv) * mix(1., max(0.35 * smoothstep(-0.95, -0.2, lead) * (1. - smoothstep(0.86, 1., lead)), 0.9 * tick), nk);    // the body of a needle is thin dark glass (a third opaque at most) that thins to nothing at its tail; only the tick is solid
    vec3 spark = mix(uBand, uGlowC, step(0.25, fract(vInfo.y * 13.7))) * vInfo.w * ndv * ndv * (0.35 + keyI);
    spark *= mix(1., tick, nk);                                      // (a far bead's sparkle, on a needle, is its tick and nothing else: never a lit dash)
    #ifdef USE_FOG
      #ifdef FOG_EXP2
        float ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
      #else
        float ff = smoothstep(fogNear, fogFar, vFogDepth);
      #endif
      col = mix(col, fogColor, ff); spark *= 1. - ff;
    #endif
    gl_FragColor = vec4(max(col * al + spark, 0.), al);
  }`;async function gt(c,s,o,p){const y=new Float32Array(o*3),k=new Float32Array(o*4);for(let u=0;u<o;u++){if(p.place){const w=p.place(u);y[u*3]=w.x,y[u*3+1]=w.y,y[u*3+2]=w.z}else y[u*3]=s(),y[u*3+1]=s(),y[u*3+2]=s();const n=s()<p.bigShare;k[u*4]=.5*(n?s.range(p.big[0],p.big[1]):s.range(p.size[0],p.size[1])),k[u*4+1]=s(),k[u*4+2]=s.range(4,8),k[u*4+3]=s()<p.hail?1:0,u%1e3===999&&await c.yield()}const i=new v.InstancedBufferGeometry;return i.setAttribute("position",new v.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),3)),i.setIndex([0,1,2,2,1,3]),i.setAttribute("iBase",new v.InstancedBufferAttribute(y,3)),i.setAttribute("iParm",new v.InstancedBufferAttribute(k,4)),i.instanceCount=o,i.boundingSphere=new v.Sphere(a(0,0,0),1e5),i}async function $t(c,s={}){const o=rt("the-leader-hero:"+Math.floor(c.rng()*1e9)),p=rt(St("the-leader-tree:"+(c.seed??1))),y=c.quality?.detail??1,k=(s.palette&&s.palette.length>=6?s.palette:Dt).map(l=>new v.Color(l)),[i,u,n,w,e,m]=k,r=o(),g=s.branches?s.branches>=72?"willow":s.branches<=38?"sparse":"even":r<.28?"sparse":r<.62?"even":"willow",S=Math.round(te(s.branches??(g==="sparse"?32:g==="willow"?80:60),20,90)),O=o()<.35,E=o(),B=s.rain||(E<.28?"drizzle":E<.75?"beads":"hail"),G=w.clone().lerp(new v.Color(1,1,1),.45),C=w.clone(),R=e.clone();if(O){const l=new v.Color("#5f8dff");R.lerp(l,.7),C.lerp(new v.Color("#d8e6ff"),.7)}const x=a(72+o.range(-5,5),700,470),q=a(140+o.range(-10,10),70,380+o.range(-10,10)),ce=(s.mastheads||[a(0,29.1,7.3),a(-11,29.6,7.4),a(-22,27.2,6.8)]).map(l=>l.clone()),$=s.skim?a(...s.skim[0]):a(45,6,290),N=s.skim?a(...s.skim[1]):a(33,6,165),Q=a(33,37,70),P=ce[0].clone().add(a(5.5,49,7)),A=Et(x,q,$,N,Q),D=(s.crests||Array.from({length:9},(l,V)=>a(F($.x,N.x,(V+.5)/9)+(V%2?-1:1)*o.range(9,26),2.4,F($.z,N.z,(V+.5)/9)-o.range(8,30)))).map(l=>l.clone());await c.yield();const ae=s.stray?s.stray.isVector3?s.stray.clone():$.clone().lerp(N,.415).add(a(4,1,0)):null,ze=_t(A,x,q),f=await Ht(c,o,{treeRng:p,station:ze,route:A,top:x,foot:q,junction:P,mastheads:ce,crests:D,count:S,habit:g,stray:ae,strayT:s.strayT,strayRng:ae?rt(St("the-leader-stray:"+(c.seed??1))):null}),U=f.branches;await c.yield();const{geometry:le,steps:ue}=await Lt(c,U);await c.yield();const oe=await Wt(c,U);await c.yield();const T={uT:{value:12},uAmb:{value:0},uResY:{value:450},uStroke:{value:0},uFront:{value:0},uAfter:{value:0},uHaze:{value:s.haze??.35},uGain:{value:1},uWidth:{value:1},uCore:{value:G},uGlowC:{value:C},uViolet:{value:R},uRose:{value:m.clone()}},we=()=>v.UniformsUtils.clone(v.UniformsLib.fog),de=new v.Group;de.name="the-leader";const He=new v.ShaderMaterial({uniforms:{...we(),uT:T.uT,uResY:T.uResY,uStroke:T.uStroke,uFront:T.uFront,uAfter:T.uAfter,uHaze:T.uHaze,uGain:T.uGain,uWidth:T.uWidth,uCore:T.uCore,uGlowC:T.uGlowC,uViolet:T.uViolet,uRose:T.uRose},vertexShader:Kt,fragmentShader:Ot,transparent:!0,depthWrite:!1,blending:v.AdditiveBlending,side:v.DoubleSide,fog:!0}),ne=new v.Mesh(le,He);ne.frustumCulled=!1,ne.renderOrder=2,ne.name="leader-tree",de.add(ne);const ye=U.slice().sort((l,V)=>l.level-V.level||V.width-l.width).slice(0,760),Ce=ye.length,Fe=new Float32Array(Ce*3),Ie=new Float32Array(Ce*3),Ee=new Float32Array(Ce*4),Me=new v.InstancedBufferGeometry;Me.setAttribute("position",new v.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),3)),Me.setIndex([0,1,2,2,1,3]);const t=new v.InstancedBufferAttribute(Fe,3),d=new v.InstancedBufferAttribute(Ie,3),h=new v.InstancedBufferAttribute(Ee,4);t.setUsage(v.DynamicDrawUsage),d.setUsage(v.DynamicDrawUsage),h.setUsage(v.DynamicDrawUsage),Me.setAttribute("iPos",t),Me.setAttribute("iDir",d),Me.setAttribute("iParm",h),Me.instanceCount=Ce,Me.boundingSphere=new v.Sphere(a(70,380,280),700);const b=new v.ShaderMaterial({uniforms:{...we(),uT:T.uT,uResY:T.uResY,uHaze:T.uHaze,uGain:T.uGain,uCore:T.uCore,uGlowC:T.uGlowC,uViolet:T.uViolet,uRose:T.uRose},vertexShader:qt,fragmentShader:Nt,transparent:!0,depthWrite:!1,blending:v.AdditiveBlending,side:v.DoubleSide,fog:!0}),Y=new v.Mesh(Me,b);Y.frustumCulled=!1,Y.renderOrder=3,Y.name="leader-coronas",de.add(Y),await c.yield();const I=a(F(x.x,q.x,.5),350,F(x.z,q.z,.5)),M={uCam:{value:a(0,300,600)},uCamRight:{value:a(1,0,0)},uCamFwd:{value:a(0,0,-1)},uVelDir:{value:a(0,-1,0)},uStreak:{value:0},uTreeC:{value:I},uKey:{value:a().copy(q)},uKeyI:{value:.6},uSink:{value:0},uCheat:{value:s.cheat??.75},uSize:{value:1},uBand:{value:n.clone()},uCloud:{value:i.clone()},uSea:{value:u.clone()},uBandDir:{value:new v.Vector2(0,-1)},uBandW:{value:Math.cos(70*Math.PI/180)},uBandH:{value:.17},uTenc:{value:tt(12)},uTreeGain:{value:2},uMap:{value:oe}},_=(l,V,K,z,re=0)=>new v.ShaderMaterial({uniforms:{...we(),...M,uT:T.uT,uAmb:T.uAmb,uResY:T.uResY,uStroke:T.uStroke,uCore:T.uCore,uGlowC:T.uGlowC,uViolet:T.uViolet,uBox:{value:l},uWrap:{value:V},uMinPx:{value:K},uFloorA:{value:z},uRide:{value:re},uShow:{value:1}},vertexShader:Ut,fragmentShader:Yt,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,blending:v.NormalBlending,side:v.DoubleSide,fog:!0}),H=(s.beads??1)*y*(B==="drizzle"?1.25:B==="hail"?.62:1),L=B==="drizzle"?[.02,.045]:B==="hail"?[.05,.11]:[.03,.07],W=B==="hail"?.24:0,j=[{name:"rain-far",n:Math.round(24e3*H),box:200,minPx:1,floorA:.03,bigShare:.05},{name:"rain-near",n:Math.round(15e3*H),box:60,minPx:1.2,floorA:.05,bigShare:.08},{name:"rain-close",n:Math.round(5e3*H),box:14,minPx:1.2,floorA:.12,bigShare:.1}],Z=[];for(let l=0;l<j.length;l++){const V=j[l],K=await gt(c,o,V.n,{size:L,big:[L[1]*1.15,L[1]*2.1],bigShare:V.bigShare,hail:W}),z=new v.Mesh(K,_(V.box,1,V.minPx,V.floorA));z.frustumCulled=!1,z.renderOrder=4+l,z.name=V.name,de.add(z),Z.push(z),await c.yield()}const ee=N.clone().sub($),me=ee.length();ee.multiplyScalar(1/me);const he=a(-ee.z,0,ee.x),J=[],X=140;for(let l=0;l<X;l++){const V=(l+o.range(.1,.9))/X,K=o.range(-1.2,1.2)+(o()<.5?0:Math.PI),z=o.range(.7,2.9);J.push($.clone().addScaledVector(ee,F(8,me+6,V)).addScaledVector(he,Math.cos(K)*z).add(a(0,Math.sin(K)*z*.55+.15,0)))}const Se=await gt(c,o,X,{place:l=>J[l],size:[.12,.3],big:[.12,.3],bigShare:0,hail:B==="hail"?.15:0});{const l=Se.attributes.iParm,V=a();for(let K=0;K<X;K++)V.subVectors(J[K],$),V.addScaledVector(ee,-V.dot(ee)),V.length()<1.6&&l.setW(K,0)}const Ae=new v.Mesh(Se,_(1,0,1.2,.2));Ae.frustumCulled=!1,Ae.renderOrder=8,Ae.name="rain-hero-beads",de.add(Ae),Z.push(Ae),await c.yield();const se=await gt(c,rt("the-leader-ride:"+(c.seed??1)),Math.round(64*Math.max(y,.6)*Math.min(s.beads??1,1)),{size:[.14,.26],big:[.26,.34],bigShare:.15,hail:0}),Xe=_(8,1,1.2,.2,1),Ve=new v.Mesh(se,Xe);Ve.frustumCulled=!1,Ve.renderOrder=8.5,Ve.name="rain-riding-drops",de.add(Ve),Z.push(Ve),await c.yield();const $e={};for(const l of U)$e[l.name]=l;const Qe=(l,V,K=a(),z=null)=>{const re=typeof l=="string"?$e[l]:l;if(!re)return K.set(0,0,0);const fe=re.birth,Be=fe.length;if(V<=fe[0])return z&&z.subVectors(re.pts[1],re.pts[0]).normalize(),K.copy(re.pts[0]);if(V>=fe[Be-1])return z&&z.subVectors(re.pts[Be-1],re.pts[Be-2]).normalize(),K.copy(re.pts[Be-1]);let ve=0,Re=Be-1;for(;Re-ve>1;){const Ne=ve+Re>>1;fe[Ne]<=V?ve=Ne:Re=Ne}return z&&z.subVectors(re.pts[Re],re.pts[ve]).normalize(),K.lerpVectors(re.pts[ve],re.pts[Re],(V-fe[ve])/Math.max(fe[Re]-fe[ve],1e-4))},Ft=a(),Vt=(l,V=a())=>{const K=f.lead;V.set(0,0,0);for(let z=0;z<K.length;z++){const re=(z?ge(K[z].on,K[z].on+1,l):1)*(z<K.length-1?1-ge(K[z+1].on,K[z+1].on+1,l):1);if(!(re<=0))for(let fe=-4;fe<=4;fe++)V.addScaledVector(Qe(K[z].name,Math.max(l+fe*.2,K[z].on),Ft),re/9)}return V},ie={object:de,radius:300,height:700,center:a(66,330,250),ground:!0,groundY:0,T:12,stroke:0,key:{position:q.clone(),intensity:.6},growthMap:oe,uniforms:T,beadUniforms:M,habit:g,rain:B,blue:O,branchCount:U.length,steps:ue,tipAt:Qe,leadAt:Vt,station:ze,branches:U};let xt=!1,ht=null,at=!1;const ut=a(),wt=a(),Le=a(),Je=a(),Ge=a(),ot=a(),yt=a(),bt=a(),nt=q.clone(),kt=new v.Vector2,st=new v.Matrix4;ie.setTime=l=>{xt=!0,ie.T=te(l,0,40)},ie.setProgress=l=>ie.setTime(te(l,0,1)*40);const Bt=a();return ie.setVelocity=l=>{ht=l?Bt.copy(l):null},ie.setEnv=(l={})=>{l.band&&M.uBand.value.copy(l.band),l.cloud&&M.uCloud.value.copy(l.cloud),l.sea&&M.uSea.value.copy(l.sea),l.bandDir&&M.uBandDir.value.set(l.bandDir.x,l.bandDir.y).normalize(),l.bandWidth!==void 0&&(M.uBandW.value=Math.cos(te(l.bandWidth,.05,Math.PI)*.5)),l.bandHeight!==void 0&&(M.uBandH.value=l.bandHeight)},ie.update=(l,V,K)=>{xt||(ie.T=V%40);const z=ie.T,re=te((z-35.5)/.5,0,1),fe=z<35.5?0:z<36?ge(0,1,re):z<36.8?1:1-ge(36.8,38.3,z),Be=ge(35.6,37.2,z);ie.stroke=fe,T.uT.value=z,T.uAmb.value=V,T.uStroke.value=fe,T.uFront.value=re*1.06,T.uAfter.value=Be,M.uTenc.value=tt(z),M.uSink.value=V*.02,c.renderer&&(c.renderer.getDrawingBufferSize(kt),T.uResY.value=kt.y),de.updateWorldMatrix(!0,!1),st.copy(de.matrixWorld).invert(),wt.setFromMatrixPosition(K.matrixWorld),Le.copy(wt).applyMatrix4(st);const ve=K.matrixWorld.elements;bt.set(ve[0],ve[1],ve[2]).transformDirection(st),yt.set(-ve[8],-ve[9],-ve[10]).transformDirection(st),M.uCam.value.copy(Le),M.uCamRight.value.copy(bt),M.uCamFwd.value.copy(yt),ht?Je.copy(ht):at&&l>.001&&l<.25&&Le.distanceTo(ut)<14?(Ge.subVectors(Le,ut).multiplyScalar(1/l),Je.lerp(Ge,te(l*6,0,1))):Je.multiplyScalar(.5),ut.copy(Le),at=!0;const Re=Je.length();Re>.5&&M.uVelDir.value.copy(Je).multiplyScalar(1/Re),M.uStreak.value=Math.max(0,Math.min(Re,80)-20)*.0075*(s.streak??1),Xe.uniforms.uShow.value=ge(45,110,Le.y);let Ne=1e9,Mt=0;for(let be=0;be<Ce;be++){const pe=ye[be];let We=0,ft=pe.corona*(.55+.45*Math.min(pe.width,1.2)),it=0;if(z>pe.birth[0]){if(Qe(pe,z,Ge,ot),We=ge(0,.5,z-pe.birth[0]),z>=pe.stall){const Ue=(z-pe.stall)/1.6;We*=1-ge(0,1,Ue),ft*=1-.6*ge(0,1,Ue),it=ge(0,.6,Ue)}if(pe.stroke?(pe.level===0||pe.name==="fore")&&(We*=1+.8*fe,ft*=1+.5*fe):(We*=1-.75*Be,it=Math.max(it,Be)),Fe[be*3]=Ge.x,Fe[be*3+1]=Ge.y,Fe[be*3+2]=Ge.z,Ie[be*3]=ot.x,Ie[be*3+1]=ot.y,Ie[be*3+2]=ot.z,We>.3&&pe.level<3){const Ue=Ge.distanceTo(Le)/(.4+pe.corona*pe.width);Ue<Ne&&(Ne=Ue,Mt=We,nt.copy(Ge))}}Ee[be*4]=ft,Ee[be*4+1]=We*pe.coronaI,Ee[be*4+2]=pe.seed,Ee[be*4+3]=it}t.needsUpdate=!0,d.needsUpdate=!0,h.needsUpdate=!0,ie.key.position.distanceTo(nt)>400||!at?ie.key.position.copy(nt):ie.key.position.lerp(nt,te(l*2.5,0,1)),ie.key.intensity=te(Mt,0,1)*(1+.6*fe),M.uKey.value.copy(ie.key.position),M.uKeyI.value=.35+.65*ie.key.intensity},ie.dispose=()=>{},ie.anchors={entry:a(60,690,525),flyThrough:A.pts.map(l=>l.clone()),entryTimes:A.entryTimes.slice(),helixTimes:A.helixTimes.slice(),lead:f.lead.map(l=>({...l})),overtake:qe,lowLimbRest:f.rest.clone(),stray:ae?ae.clone():null,trunkTop:x.clone(),trunkFoot:q.clone(),fork:f.fork.clone(),junction:P.clone(),shipLimbEnd:P.clone(),mastheads:ce.map(l=>l.clone()),crests:D.map(l=>l.clone()),skim:[$.clone(),N.clone()],heroBeads:J,portalSeat:{position:Q.clone(),normal:a(0,-Math.sin(18*Math.PI/180),Math.cos(18*Math.PI/180)),radius:7},viewpoints:[{position:a(60,690,525),target:a(66,660,470),T:1},{position:A.helix(.45),target:A.helix(.6),T:9},{position:$.clone().lerp(N,.33),target:a(8,30,0),T:23},{position:$.clone().lerp(N,.62),target:a(8,30,0),T:26},{position:a(33,17.5,130),target:Q.clone(),T:35.5}]},de.userData.hero=ie,ie.update(0,12,{matrixWorld:new v.Matrix4().makeTranslation(0,300,600)}),at=!1,ie}export{$t as buildHero};
