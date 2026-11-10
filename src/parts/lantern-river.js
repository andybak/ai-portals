import*as a from"three";import{clamp as We,lerp as te,smoothstep as Le}from"../kit/core.js";const He=["#0b1640","#2b4a9a","#6a5f9a","#1c1a2a","#3a2a2a","#ffb35a","#ff4d3d"],ae=Math.PI*2,Ae=o=>{const t=new a.Color(o);return[t.r,t.g,t.b]},ie=(o,t,i)=>[o[0]+(t[0]-o[0])*i,o[1]+(t[1]-o[1])*i,o[2]+(t[2]-o[2])*i],j=(o,t)=>[o[0]*t,o[1]*t,o[2]*t],oe=0,Be=1,Qe=2,_e=3,ge=4,$e=5,Ke=6,Xe=7,Je=8;let Ce=null;function Ze(){if(!Ce){const o=new a.IcosahedronGeometry(1,1);Ce=Float32Array.from(o.attributes.position.array),o.dispose()}return Ce}class Ve{constructor(){this.p=[],this.n=[],this.c=[],this.uv=[],this.m=[],this.idx=[],this.count=0}v(t,i,s,c,u,n,r,f,v,g){return this.p.push(t,i,s),this.n.push(c,u,n),this.c.push(r[0],r[1],r[2]),this.uv.push(f,v),this.m.push(g),this.count++}quad(t,i,s,c,u,n,r=0,f=0){const v=i[0]-t[0],g=i[1]-t[1],l=i[2]-t[2],e=c[0]-t[0],m=c[1]-t[1],M=c[2]-t[2];let d=g*M-l*m,b=l*e-v*M,S=v*m-g*e;const k=Math.hypot(d,b,S)||1;d/=k,b/=k,S/=k;const h=Math.hypot(v,g,l),C=Math.hypot(e,m,M),O=this.v(t[0],t[1],t[2],d,b,S,u,r,f,n),G=this.v(i[0],i[1],i[2],d,b,S,u,r+h,f,n),I=this.v(s[0],s[1],s[2],d,b,S,u,r+h,f+C,n),Q=this.v(c[0],c[1],c[2],d,b,S,u,r,f+C,n);this.idx.push(O,G,I,O,I,Q)}grid(t,i,s,c,u=!1,n=!1){const r=t+1,f=i+1,v=new Array(r*f),g=this.count;for(let l=0;l<f;l++)for(let e=0;e<r;e++)v[l*r+e]=s(e/t,l/i);for(let l=0;l<f;l++)for(let e=0;e<r;e++){const m=e>0?e-1:n?t-1:0,M=e<t?e+1:n?1:t,d=v[l*r+m],b=v[l*r+M],S=v[Math.max(l-1,0)*r+e],k=v[Math.min(l+1,i)*r+e],h=b[0]-d[0],C=b[1]-d[1],O=b[2]-d[2],G=k[0]-S[0],I=k[1]-S[1],Q=k[2]-S[2];let X=C*Q-O*I,Y=O*G-h*Q,H=h*I-C*G;const L=Math.hypot(X,Y,H);if(L<1e-9)X=0,Y=u?-1:1,H=0;else{const N=(u?-1:1)/L;X*=N,Y*=N,H*=N}const q=v[l*r+e];this.v(q[0],q[1],q[2],X,Y,H,q,q[6],q[7],c);const p=(this.count-1)*3;this.c[p]=q[3],this.c[p+1]=q[4],this.c[p+2]=q[5]}for(let l=0;l<i;l++)for(let e=0;e<t;e++){const m=g+l*r+e,M=m+1,d=m+r+1,b=m+r;u?this.idx.push(m,d,M,m,b,d):this.idx.push(m,M,d,m,d,b)}}lathe(t,i,s,c,u,n=0,r=0){const f=t.length-1;this.grid(i,f,(v,g)=>{const l=Math.round(g*f),e=t[l],m=n+v*ae,M=e[2];return[s+Math.sin(m)*e[0],e[1],c+Math.cos(m)*e[0],M[0],M[1],M[2],r||v*i,e[1]]},u,!1,!0)}sweep(t,i,s,c,u){const n=t.length,r=[];for(let l=0;l<n;l++){const e=t[Math.max(l-1,0)],m=t[Math.min(l+1,n-1)],M=l/(n-1);let d=m[0]-e[0],b=m[1]-e[1],S=m[2]-e[2];const k=Math.hypot(d,b,S)||1;d/=k,b/=k,S/=k;let h=-S,C=d;const O=Math.hypot(h,C);O<1e-4?(h=1,C=0):(h/=O,C/=O);const G=-C*b,I=C*d-h*S,Q=h*b,X=typeof i=="function"?i(M):i,Y=typeof s=="function"?s(M):s,H=t[l];r.push({p:H,S:[h,0,C],U:[G,I,Q],w:X,h:Y})}const f=[[1,1,-1,1,0,1],[-1,1,-1,-1,-1,0],[-1,-1,1,-1,0,-1],[1,-1,1,1,1,0]];let v=0;const g=[];for(let l=0;l<n;l++){const e=r[l];l>0&&(v+=Math.hypot(e.p[0]-r[l-1].p[0],e.p[1]-r[l-1].p[1],e.p[2]-r[l-1].p[2]));const m=[];for(let M=0;M<4;M++){const d=f[M],b=e.S[0]*d[4]+e.U[0]*d[5],S=e.U[1]*d[5],k=e.S[2]*d[4]+e.U[2]*d[5];for(let h=0;h<2;h++){const C=d[h*2]*e.w,O=d[h*2+1]*e.h;m.push(this.v(e.p[0]+e.S[0]*C+e.U[0]*O,e.p[1]+e.U[1]*O,e.p[2]+e.S[2]*C+e.U[2]*O,b,S,k,c,v,M+h,u))}}g.push(m)}for(let l=0;l<n-1;l++)for(let e=0;e<4;e++){const m=g[l][e*2],M=g[l][e*2+1],d=g[l+1][e*2+1],b=g[l+1][e*2];this.idx.push(m,b,d,m,d,M)}}box(t,i,s,c,u,n,r,f,v,g=!1,l=1){const e=Math.cos(r),m=Math.sin(r),M=(I,Q,X)=>{const Y=Q>0?l:1;return I*=Y,X*=Y,[t+I*e+X*m,i+Q,s-I*m+X*e]},d=M(-c,-u,n),b=M(c,-u,n),S=M(c,u,n),k=M(-c,u,n),h=M(-c,-u,-n),C=M(c,-u,-n),O=M(c,u,-n),G=M(-c,u,-n);this.quad(d,b,S,k,f,v),this.quad(b,C,O,S,f,v),this.quad(C,h,G,O,f,v),this.quad(h,d,k,G,f,v),this.quad(k,S,O,G,f,v),g&&this.quad(h,C,b,d,f,v)}blob(t,i,s,c,u,n,r,f,v,g,l){const e=Ze(),m=this.count,M=t*.37+s*.71+i*.13;for(let d=0;d<e.length;d+=3){const b=e[d],S=e[d+1],k=e[d+2],h=1+f*r.n3(b*v+M,S*v-M,k*v+2.3*M),C=Math.hypot(b/c,S/u,k/n)||1;this.v(t+b*h*c,i+S*h*u,s+k*h*n,b/c/C,S/u/C,k/n/C,g(S,h),b*c+t,k*n+s,l)}for(let d=0;d<e.length/3;d+=3)this.idx.push(m+d,m+d+1,m+d+2)}get triangles(){return this.idx.length/3}}function et(o,t,i,s,c){const u=c.sides||t.pick([4,4,4,6,8]),n=9,r=Math.tan(Math.PI/u),f=u===4?1:u===6?1.1:1.16,v=t.range(6.8,7.6)*f,g=v*t.range(.43,.5),l=t.range(4.7,5.5)*(u===4?1:.86),e=l*t.range(.66,.76),m=t.range(1.4,2.5)*(u===4?1:.8),M=u===4?.055:.035,d=1.25,b=2.2,S=3.6,k=t.range(4.6,5.6),C=70-S-k-10.4,O=[],G=[],I=[],Q=[];let X=S,Y=0;for(let P=0;P<n;P++)Y+=te(1.16,.84,P/(n-1));for(let P=0;P<n;P++){const x=P/(n-1);O.push(te(v,g,Math.pow(x,.92))),G.push(O[P]+te(l,e,x)),Q.push(te(1.16,.84,x)*C/Y),I.push(X),X+=Q[P]}const H=P=>{const x=P*ae/u;return[Math.sin(x),Math.cos(x),Math.cos(x),-Math.sin(x)]},L=(P,x,F)=>{const A=H(P),E=F*r*x;return[A[0]*F+A[2]*E,A[1]*F+A[3]*E]},q=(P,x,F,A)=>{for(let E=0;E<u;E++)o.grid(P,x,(J,le)=>F(E,J*2-1,le),A)},p=u===4?16:u===6?10:8,N=ie(s.ink,s.violet,.5),K=j(N,.6),U=j(ie(s.red,s.timber,.35),.62),ue=ie(s.timber,[.26,.15,.09],.55),ne=[.6,.54,.44],fe=j(ie(s.violet,[.32,.31,.3],.62),.85),y=[.74,.5,.17],z=[],R=[],T=[],W=[],$=G.reduce((P,x)=>P+x,0),B=v+d+1.7;q(1,1,(P,x,F)=>{const A=B+.5*(1-F),E=L(P,x,A),J=fe;return[E[0],te(b-.3,S-.22,F),E[1],J[0],J[1],J[2],x*A*r+P*37,F*1.5]},ge),q(1,1,(P,x,F)=>{const A=L(P,x,B+.18),E=j(fe,1.15);return[A[0],S-.22+.22*F,A[1],E[0],E[1],E[2],x*B*r+P*11,5+F*.22]},ge),q(1,1,(P,x,F)=>{const A=te(B+.18,v-.1,F),E=L(P,x,A),J=j(fe,1.05);return[E[0],S,E[1],J[0],J[1],J[2],x*A*r+P*5,A]},ge);const Z=u===4?[0,1,2,3]:u===6?[0,3]:[0,2,4,6];for(const P of Z){const x=H(P),F=P*ae/u;for(let A=0;A<5;A++){const E=.42*(A+1)+.6,J=S-A*.28,le=B-.1+E*.5,be=(J-b+.3)*.5;o.box(x[0]*le,J-be,x[1]*le,1.8,be,E*.5,F,j(fe,1.1-A*.03),ge)}for(const A of[-1,1]){const E=B+1.25;o.box(x[0]*E+x[2]*A*2.1,b+.75,x[1]*E+x[3]*A*2.1,.28,1.05,1.5,F,j(fe,.95),ge,!1,.9)}}for(let P=0;P<n;P++){const x=P/(n-1),F=O[P],A=I[P],E=Q[P]*.56,J=G[P],le=A+E+.3,be=P===n-1,Re=be?.45:O[P+1]+d-.25,Ye=be?A+E+k:I[P+1]-.12,we=m*te(1,.78,x),ke=Math.max(1,Math.round(2*F*r/(u===4?2.9:2.5))),Me=F+d,Oe=J-Re,Te=(D,_)=>te(Re,J,D)*(1+M*D*D*_*_*_*_),Se=(D,_)=>le+(Ye-le)*Math.pow(1-D,2.1)+we*D*D*_*_*_,ze=1+.12*i.n2(P*3.1,7.7);q(1,1,(D,_,V)=>{const w=L(D,_,F);return[w[0],A+V*E,w[1],ne[0]*ze,ne[1]*ze,ne[2]*ze,(_*.5+.5)*ke+16*(P*u+D),V]},Qe);for(let D=0;D<u;D++)for(let _=0;_<ke;_++){const V=L(D,-1+2*_/ke,F+.1),w=_===0?.27:.2;o.lathe([[w*1.1,A,U],[w,A+E*.5,U],[w*.94,A+E,U]],6,V[0],V[1],oe)}P>0&&(q(1,1,(D,_,V)=>{const w=L(D,_,te(Me,F,V));return[w[0],A+.02,w[1],ue[0],ue[1],ue[2],_*Me*r,V*d]},_e),q(1,1,(D,_,V)=>{const w=L(D,_,Me);return[w[0],A-.32+V*.34,w[1],U[0],U[1],U[2],_*Me*r,V]},oe),q(1,1,(D,_,V)=>{const w=L(D,_,Me-.06);return[w[0],A+.02+V*1.05,w[1],U[0],U[1],U[2],_*Me*r+50,V]},Je)),q(1,2,(D,_,V)=>{const w=F+.06+.72*V,se=L(D,_,w),ce=j(ue,1.5);return[se[0],A+E-.62+.64*Math.pow(V,.7),se[1],ce[0],ce[1],ce[2],_*w*r*1.6,V]},_e),q(p,3,(D,_,V)=>{const w=Math.abs(_),se=te(F+.7,(J-.1)*(1+M*w*w*w*w),V),ce=L(D,_,se),xe=j(ie(ue,ne,.35),1.1);return[ce[0],te(A+E+.02,le-.2,Math.pow(V,1.5))+we*V*V*w*w*w,ce[1],xe[0],xe[1],xe[2],_*se*r,V*Oe]},_e),q(p,1,(D,_,V)=>{const w=Math.abs(_),se=(J-.1+.1*V)*(1+M*w*w*w*w),ce=L(D,_,se);return[ce[0],le-.2+.28*V+we*w*w*w,ce[1],.5,.42,.3,_*se*r+.25,V]},_e),q(p,be?9:7,(D,_,V)=>{const w=1-V,se=Math.abs(_),ce=Te(w,se),xe=L(D,_,ce),Fe=.82+.22*i.n3(xe[0]*.35,xe[1]*.35,P*1.7)+.1*w;return[xe[0],Se(w,se)+.08,xe[1],N[0]*Fe*ze,N[1]*Fe*ze,N[2]*Fe,_*ce*r,w*Oe*1.15]},Be);for(let D=0;D<u;D++){const _=[];for(let w=0;w<=7;w++){const se=w/7,ce=L(D,1,Te(se,1));_.push([ce[0],Se(se,1)+.24,ce[1]])}const V=L(D,1,Te(1,1)*1.04);_.push([V[0],Se(1,1)+.75,V[1]]),o.sweep(_,w=>te(.24,.13,w),w=>te(.22,.12,w),K,oe),W.push([V[0],Se(1,1)+.2,V[1],.5])}const Ie=Math.max(2,Math.round(400*J/$/u));for(let D=0;D<u;D++)for(let _=0;_<Ie;_++){const V=-.95+1.9*(_+.5)/Ie,w=Math.abs(V),se=L(D,V,(J-.32)*(1+M*w*w*w*w));z.push([se[0],le-.28+we*w*w*w,se[1],t()*ae,t.range(.9,1.1)*te(1.08,.92,x)])}R.push({N:u,r:J-.32,y:le-1,col:s.lanternLight,I:2.3,fall:2.3,y0:P>0?A-Q[P-1]*.55:.2,y1:le+we+.4,lift:we}),R.push({N:u,r:F+.35,y:A+E*.5,col:s.windowLight,I:1.5,fall:1.7,y0:A-.5,y1:A+E+1.6,lift:0}),T.push({y:A,eaveY:le,eaveRadius:J,bodyRadius:F})}const ve=I[n-1]+Q[n-1]*.56+k,re=y,he=j(y,.6),me=[];me.push([.95,ve-.45,he],[.95,ve+.35,re],[.6,ve+.45,re],[.82,ve+.55,re],[.78,ve+1,re],[.46,ve+1.42,re],[.16,ve+1.55,he]);const de=t.int(7,9),ye=ve+1.95,ee=5.6/de;for(let P=0;P<de;P++){const x=ye+P*ee,F=te(1.2,.62,P/(de-1));me.push([.13,x-.22,he],[F,x-.05,re],[F,x+.05,re],[.13,x+.22,he])}const pe=ye+de*ee-.1;return me.push([.12,pe,he],[.55,pe+.75,re],[.14,pe+1.5,re],[.36,pe+1.8,re],[.4,pe+2.05,re],[.02,pe+2.6,re]),o.lathe(me,10,0,0,Xe),W.push([0,pe+2.1,0,2.2]),{N:u,tanN:r,HW:O,RE:G,Y:I,PITCH:Q,tiers:T,lanterns:z,sources:R,glows:W,rPod:B,yTerrace:b,yF:S,top:pe+2.6,side:H,PP:L,colors:{tile:N,lacquer:U,wood:ue,plaster:ne,stone:fe,gold:y}}}function tt(o,t,i,s,c){const u=t.range(26,30),n=t.range(20.5,23),r=t.range(0,50),f=c.yTerrace,v=y=>{const z=Math.sin(y),R=Math.cos(y);return(1+.07*i.n2(R*1.4+r,z*1.4))/Math.sqrt(z/u*(z/u)+R/n*(R/n))},g=c.colors.stone,l=c.colors.lacquer,e=c.colors.wood,m=[],M=[],d=[],b=[],S=56,k=[[1.1,-2.2],[.5,.25],[.08,f-.3],[.2,f-.28],[.2,f]];o.grid(S,k.length-1,(y,z)=>{const R=y*ae,T=Math.round(z*(k.length-1)),W=k[T],$=v(R)+W[0],B=Le(1,0,W[1]),Z=.9+.2*i.n2(R*9,W[1]);return[Math.sin(R)*$,W[1],Math.cos(R)*$,g[0]*Z*(1-.45*B),g[1]*Z*(1-.4*B),g[2]*Z*(1-.3*B),R*24,W[1]]},ge,!1,!0),o.grid(S,1,(y,z)=>{const R=y*ae,T=v(R)+.2-1.1*z;return[Math.sin(R)*T,f,Math.cos(R)*T,g[0]*1.15,g[1]*1.15,g[2]*1.15,R*24,9+z]},ge,!1,!0);const h=[.3,.28,.27],C=[.07,.13,.07];o.grid(S,5,(y,z)=>{const R=y*ae,T=te(v(R)-.9,c.rPod*.8,z),W=Math.sin(R)*T,$=Math.cos(R)*T,B=Le(.1,.7,i.fbm2(W*.12+r,$*.12,3)+.45-z*.9),Z=ie(h,C,B);return[W,f+.02+.12*B*(z>0&&z<1?1:0),$,Z[0],Z[1],Z[2],W,$]},oe,!1,!0);const O=t.int(9,14);for(let y=0;y<O;y++){const z=t.range(.5,ae-.5),R=v(z)+t.range(.9,2.2),T=t.range(.7,2),W=t.range(.7,1.1);o.blob(Math.sin(z)*R,t.range(-.1,.35)*T,Math.cos(z)*R,T*t.range(1,1.5),T*t.range(.5,.8),T,i,.28,1.3,$=>j(ie(g,C,We($*.8,0,.6)),W*(.75+.25*$)),oe)}const G=v(0);for(let y=0;y<6;y++){const z=f-y*.36,R=(z+1.6)*.5;o.box(0,z-R,G+.1+y*.52,2.6,R,.45,0,j(g,1.12-y*.03),ge)}o.box(0,-.6,G+5.2,2.6,.95,2.4,0,j(g,.92),ge);for(const y of[-1,1])for(const z of[3.2,7.3])o.lathe([[.2,-1,e],[.17,1.25,e],[.2,1.3,j(g,1.2)],[0,1.5,j(g,1.2)]],6,y*2.5,G+z,oe);const I=(y,z,R)=>{const T=j(g,1.1),W=$=>$.map(B=>[B[0]*R,f+B[1]*R,B[2]]);o.lathe(W([[.58,0,T],[.52,.24,T],[.22,.36,T],[.18,1.22,T],[.44,1.38,T],[.46,1.5,T],[.3,1.52,T]]),6,y,z,oe),o.lathe(W([[.3,1.52,s.amber],[.3,1.96,s.amber]]),6,y,z,Ke,0,3.2),o.lathe(W([[.3,1.96,T],[.68,1.98,T],[.52,2.14,T],[.17,2.4,T],[.1,2.56,T],[.17,2.64,T],[0,2.8,T]]),6,y,z,oe),m.push({x:y,y:f+1.75*R,z,col:s.windowLight,I:2.4,fall:2.2}),M.push([y,f+1.75*R,z,1.3])},Q=t.int(6,9),X=t.range(.25,.6);for(let y=0;y<Q;y++){const z=X+(y+.5)/Q*(ae-2*X),R=v(z)-2.1;I(Math.sin(z)*R,Math.cos(z)*R,t.range(1.05,1.3))}I(-3.5,G-1.6,1.35),I(3.5,G-1.6,1.35);const Y=G+t.range(12.5,15),H=t.range(6.4,7.4),L=H*.43,q=j(ie(s.red,s.timber,.15),.7),p=j(s.ink,1.4);for(const y of[-1,1]){o.lathe([[.48,-2,p],[.46,.9,p],[.4,.95,q],[.33,H,q]],8,y*L,Y,oe);for(const z of[-1.5,1.5])o.lathe([[.22,-2,p],[.2,.7,p],[.18,.75,q],[.16,2.6,q],[.24,2.65,p],[0,2.9,p]],6,y*L,Y+z,oe);o.box(y*L,1.9,Y,.1,.13,1.5,0,q,oe,!0)}o.box(0,H-1.45,Y,L+.85,.2,.17,0,q,oe,!0),o.box(0,H-.72,Y,.16,.52,.12,0,q,oe);const N=(y,z,R)=>{const T=[];for(let W=0;W<=10;W++){const $=(W/10*2-1)*z;T.push([$,y+R*Math.pow(Math.abs($/z),2.2),Y])}return T};o.sweep(N(H-.02,L+1.25,.32),.24,.2,q,oe),o.sweep(N(H+.36,L+1.6,.52),y=>.33,.17,p,oe);for(const y of[-1,1])d.push([y*L*.5,H-1.67,Y,t()*ae,1.15]),m.push({x:y*L*.5,y:H-2.4,z:Y,col:s.lanternLight,I:2.6,fall:2.4});const K=t.int(4,7),U=[];for(let y=0;y<K*6&&U.length<K;y++){const z=t.range(.35,ae-.35),R=v(z)-3.4,T=Math.max(c.rPod+3.6,c.RE[0]+1.5);if(R<T)continue;const W=t.range(T,R),$=Math.sin(z)*W,B=Math.cos(z)*W;if(U.some(x=>Math.hypot(x[0]-$,x[1]-B)<6.5))continue;U.push([$,B]);const Z=t.range(3,4.4),ve=t.range(.4,1.2),re=t.range(0,ae),he=j(e,.7),me=[];for(let x=0;x<=5;x++){const F=x/5;me.push([$+Math.sin(re)*ve*F*F+.25*Math.sin(F*5+y),f+Z*F,B+Math.cos(re)*ve*F*F])}o.sweep(me,x=>te(.32,.15,x),x=>te(.3,.14,x),he,oe);const de=me[5][0],ye=me[5][1],ee=me[5][2],pe=t.int(6,9),P=t.range(0,1);for(let x=0;x<pe;x++){const F=t.range(0,ae),A=x===0?0:t.range(1.2,3),E=t.range(1.3,2.3)*(x===0?1.25:1),J=ye+t.range(-.3,1.5)-A*.25;x>0&&x<4&&o.sweep([[de,ye-.6,ee],[de+Math.sin(F)*A*.6,J-.5,ee+Math.cos(F)*A*.6],[de+Math.sin(F)*A,J,ee+Math.cos(F)*A]],.09,.09,he,oe);const le=ie([.7,.36,.46],[.8,.62,.64],P*.6+t()*.4);o.blob(de+Math.sin(F)*A,J,ee+Math.cos(F)*A,E,E*.7,E,i,.3,1.7,(be,Re)=>j(le,(.62+.3*be)*(.55+.5*Re)),$e)}}const ue=c.tiers[2],ne=[],fe=[];for(let y=0;y<c.N;y++)fe.push([y,1]),c.N===4&&fe.push([y,0]);for(const[y,z]of fe){const R=c.PP(y,z,ue.eaveRadius*(z?1.03:1)),T=Math.atan2(R[0],R[1]);if(Math.abs(T)<.2)continue;const W=[R[0],ue.eaveY+(z?1.2:.1),R[1]],$=v(T)-1.3,B=6.2+t.range(-.6,.8),Z=[Math.sin(T)*$,f+B,Math.cos(T)*$],ve=Math.hypot(Z[0]-W[0],Z[1]-W[1],Z[2]-W[2]),re=ve*t.range(.1,.16),he=[],me=14,de=ee=>[te(W[0],Z[0],ee),te(W[1],Z[1],ee)-re*4*ee*(1-ee),te(W[2],Z[2],ee)];for(let ee=0;ee<=me;ee++)he.push(de(ee/me));o.sweep(he,.035,.035,p,oe);const ye=Math.round(ve/1.5);for(let ee=1;ee<ye;ee++){const pe=de(ee/ye);b.push([pe[0],pe[1]-.22,pe[2],ee%3===0?1:0])}o.lathe([[.13,f,e],[.09,Z[1],e],[.15,Z[1]+.05,c.colors.gold],[0,Z[1]+.4,c.colors.gold]],5,Z[0],Z[2],oe),ne.push({from:W,to:Z})}return{R:v,rx:u,rz:n,rL:G,yT:f,sources:m,glows:M,lanterns:d,bulbs:b,strings:ne,torii:[0,H,Y],toriiW:L,landing:[0,.4,G+5.2]}}function ot(o,t,i){const s=o.count,c=new Float32Array(s*3),u=o.p,n=o.n;for(let r=0;r<s;r++){const f=u[r*3],v=u[r*3+1],g=u[r*3+2],l=n[r*3],e=n[r*3+1],m=n[r*3+2];let M=0,d=0,b=0;const S=Math.atan2(f,g);for(let k=0;k<t.length;k++){const h=t[k];if(v<h.y0||v>h.y1)continue;const C=Math.round(S/(ae/h.N))*(ae/h.N),O=Math.sin(C),G=Math.cos(C),I=h.r*Math.tan(Math.PI/h.N),Q=We(f*G-g*O,-I,I),X=Math.abs(Q)/I,Y=O*h.r+G*Q-f,H=h.y+h.lift*X*X*X-v,L=G*h.r-O*Q-g,q=Math.hypot(Y,H,L)+1e-4,p=(l*Y+e*H+m*L)/q,N=(p>0?p*.88:0)+.12,K=h.I*N/(1+q/h.fall*(q/h.fall));M+=h.col[0]*K,d+=h.col[1]*K,b+=h.col[2]*K}for(let k=0;k<i.length;k++){const h=i[k],C=h.x-f,O=h.y-v,G=h.z-g,I=C*C+O*O+G*G;if(I>200)continue;const Q=Math.sqrt(I)+1e-4,X=(l*C+e*O+m*G)/Q,Y=(X>0?X*.85:0)+.15,H=h.I*Y/(1+I/(h.fall*h.fall));M+=h.col[0]*H,d+=h.col[1]*H,b+=h.col[2]*H}c[r*3]=M,c[r*3+1]=d,c[r*3+2]=b}return c}const qe=`
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
`,at=`
attribute vec3 color; attribute vec3 aWarm; attribute float aMat;
uniform float uTime;
varying vec3 vCol; varying vec3 vWarm; varying vec3 vN; varying vec3 vWp; varying vec3 vOp; varying vec2 vUv; varying float vMat;
#include <fog_pars_vertex>
void main(){
  vCol = color; vWarm = aWarm; vUv = uv; vMat = aMat; vOp = position;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vec3 n = normalize(mat3(modelMatrix) * normal);
  #ifdef MIRROR
    float h = max(position.y, 0.);
    float w = sin(h * 0.55 - uTime * 1.7 + wp.x * 0.21) * (0.06 + 0.008 * h) + sin(h * 1.9 + uTime * 2.6 + wp.z * 0.3) * 0.04;
    wp.x += w; wp.z += w * 0.6;
    n.y = -n.y;
  #endif
  vN = n; vWp = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,nt=`
uniform float uTime; uniform float uSeed;
uniform vec3 uSky; uniform vec3 uGround; uniform vec3 uMoonDir; uniform vec3 uMoonCol; uniform vec3 uAmber; uniform vec3 uLacquer; uniform vec3 uWood; uniform vec3 uWater;
varying vec3 vCol; varying vec3 vWarm; varying vec3 vN; varying vec3 vWp; varying vec3 vOp; varying vec2 vUv; varying float vMat;
#include <fog_pars_fragment>
${qe}
void main(){
  vec3 n = normalize(vN);
  vec3 V = normalize(cameraPosition - vWp);
  #ifdef MIRROR
    if (vOp.y < 0.03) discard;
    V.y = -V.y;
  #endif
  if (dot(n, V) < 0.) n = -n;
  vec3 alb = vCol; vec3 emi = vec3(0.); float spec = 0.; float gloss = 16.; float amb2 = 1.;
  if (vMat < 0.5) {
    alb *= 0.82 + 0.36 * vnoise(vOp.xz * 1.7 + vOp.y * 2.3);
  } else if (vMat < 1.5) {                                   // roof tiles: ridged rows running down the slope
    float tx = vUv.x / 0.46, row = vUv.y / 0.8;
    float k = clamp(1.2 - fwidth(tx) * 1.6, 0., 1.);
    float f = abs(fract(tx) - 0.5) * 2., id = hash21(vec2(floor(tx), floor(row)));
    float pat = mix(0.5, 1.22, smoothstep(0.05, 0.75, f)) * (0.8 + 0.4 * id) * mix(0.6, 1., smoothstep(0., 0.18, fract(row)));
    alb *= mix(0.9, pat, k);
    spec = 0.35 + 0.4 * k * smoothstep(0.3, 0.9, f); gloss = 20.;
  } else if (vMat < 2.5) {                                   // wall: dado, lacquer rails, paper windows with lattice
    float bx = fract(vUv.x), by = vUv.y, id = floor(vUv.x);
    if (by < 0.15) { alb = uWood * (0.8 + 0.5 * vnoise(vec2(vUv.x * 9., by * 3.))); }
    else if (by < 0.2 || (by > 0.8 && by < 0.85)) { alb = uLacquer; }
    else if (by < 0.8 && bx > 0.13 && bx < 0.87) {
      float lx = (bx - 0.13) / 0.74, ly = (by - 0.2) / 0.6;
      float bar = max(step(0.42, abs(fract(lx * 4.) - 0.5)), step(0.43, abs(fract(ly * 5.) - 0.5)));
      float lit = step(0.2, hash21(vec2(id, uSeed)));
      float fl = 0.86 + 0.14 * sin(uTime * (1.2 + 2.5 * hash21(vec2(id, 3.))) + id);
      float shade = 0.5 + 0.5 * smoothstep(1.1, 0., ly) + 0.25 * vnoise(vec2(id * 7. + lx * 2., ly * 3.));
      alb = mix(vec3(0.5, 0.45, 0.36), uWood * 0.6, bar);
      emi = uAmber * (2.4 * lit * fl * shade) * mix(1., 0.06, bar);
    } else if (by > 0.85) { alb *= 0.85 + 0.25 * step(0.5, fract(vUv.x * 6.)); }
  } else if (vMat < 3.5) {                                   // rafters / planks
    float s = vUv.x / 0.42, k = clamp(1.2 - fwidth(s) * 1.6, 0., 1.);
    alb *= mix(0.8, mix(0.42, 1.12, smoothstep(0.4, 0.5, fract(s))), k);
  } else if (vMat < 4.5) {                                   // coursed stone
    vec2 q = vec2(vUv.x / 1.3, vUv.y / 0.55); q.x += 0.5 * mod(floor(q.y), 2.);
    vec2 f = fract(q); float id = hash21(floor(q));
    float mortar = smoothstep(0., 0.05, f.x) * smoothstep(1., 0.95, f.x) * smoothstep(0., 0.1, f.y) * smoothstep(1., 0.9, f.y);
    alb *= (0.74 + 0.42 * id) * mix(0.42, 1., mortar) * (0.85 + 0.3 * vnoise(vUv * 5.));
  } else if (vMat < 5.5) {                                   // blossom
    float a = vnoise(vOp.xz * 2.9 + vOp.y * 2.3), b = vnoise(vOp.xy * 7.3 + vOp.z * 5.1);
    alb *= 0.55 + 0.9 * a; alb = mix(alb, alb * 1.5 + 0.06, step(0.68, b)); amb2 = 1.5;
  } else if (vMat < 6.5) {                                   // emissive
    emi = vCol * vUv.x * (0.85 + 0.15 * sin(uTime * 3.1 + vOp.x * 7. + vOp.z * 5.)); alb = vec3(0.02);
  } else if (vMat < 7.5) {                                   // gilt metal
    spec = 2.2; gloss = 34.; alb *= 0.8 + 0.3 * vnoise(vOp.xy * 6.);
  } else {                                                   // railing lattice (alpha cut)
    float x = vUv.x / 0.42, y = vUv.y, k = clamp(1.3 - fwidth(x) * 1.4, 0., 1.);
    float keep = step(0.86, y) + step(y, 0.1) + step(abs(y - 0.5), 0.04) + k * step(fract(x), 0.2) + step(fract(x / 6.), 0.05);
    if (keep < 0.5) discard;
  }
  float ndv = max(dot(n, V), 0.);
  vec3 amb = mix(uGround, uSky, n.y * 0.5 + 0.5) * amb2;
  float ml = max(dot(n, uMoonDir), 0.);
  vec3 R = reflect(-V, n);
  float sp = pow(max(dot(R, uMoonDir), 0.), gloss);
  #ifdef MIRROR
    float h = vOp.y;
    vec3 col = alb * (vWarm * 1.0 + amb * 0.6 + uMoonCol * ml * 0.35) + emi * 0.85;
    col *= 0.72 * (0.78 + 0.22 * sin(h * 2.3 - uTime * 2.1 + vWp.x * 0.6 + vWp.z * 0.4));
    col = mix(uWater, col, exp(-h * 0.005));
  #else
    vec3 col = alb * (amb + uMoonCol * ml + vWarm) + emi;
    col += spec * sp * uMoonCol * 0.7 + spec * alb * vWarm * 0.6 * pow(1. - ndv, 2.);
    if (vMat > 6.5 && vMat < 7.5) col += alb * (mix(uGround, uSky, R.y * 0.5 + 0.5) * 1.4 + uAmber * 0.22 * smoothstep(0.2, -0.6, R.y));
    col += alb * uSky * pow(1. - ndv, 3.) * 0.9;
  #endif
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Pe=o=>Object.assign(a.UniformsUtils.clone(a.UniformsLib.fog),o);function rt(o,t,i){const s=new a.BufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute(o.p,3)),s.setAttribute("normal",new a.Float32BufferAttribute(o.n,3)),s.setAttribute("color",new a.Float32BufferAttribute(o.c,3)),s.setAttribute("uv",new a.Float32BufferAttribute(o.uv,2)),s.setAttribute("aMat",new a.Float32BufferAttribute(o.m,1)),s.setAttribute("aWarm",new a.BufferAttribute(t,3)),s.setIndex(o.count>65535?new a.Uint32BufferAttribute(o.idx,1):new a.Uint16BufferAttribute(o.idx,1)),s.computeBoundingSphere();const c=r=>new a.ShaderMaterial({uniforms:Pe(i),vertexShader:at,fragmentShader:nt,fog:!0,side:a.DoubleSide,defines:r?{MIRROR:1}:{}}),u=new a.Mesh(s,c(!1)),n=new a.Mesh(s,c(!0));return n.scale.y=-1,n.renderOrder=-.5,{mesh:u,mirror:n,geometry:s}}const Ue=`
// launch position -> where the sky lantern is at release progress p; w = visibility
vec4 risePos(vec3 base, vec4 a, vec2 b, float p, float time){
  float s = clamp((p - a.x) / 0.42, 0., 2.);
  float e = 1. - exp(-1.9 * s);
  float ang = b.y * (e * 0.9 + time * 0.012);
  float cs = cos(ang), sn = sin(ang);
  vec2 xz = base.xz * (1. + b.x * e);
  xz = vec2(xz.x * cs - xz.y * sn, xz.x * sn + xz.y * cs);
  xz += vec2(sin(time * 0.31 + a.z), cos(time * 0.27 + a.z * 1.3)) * 0.6 * e;
  float y = base.y + a.y * e + sin(time * 0.4 + a.z * 2.1) * 0.4 * e;
  return vec4(xz.x, y, xz.y, smoothstep(0., 0.06, s));
}`,De=`
uniform float uU;
vec4 risePos(vec3 base, vec4 a, vec2 b, float p, float time){
  float s = max(uU - a.x, 0.) / 0.085;
  float e = 1. - exp(-1.6 * s);
  float w = fract(time * 0.021 + a.z * 0.37);
  vec2 xz = base.xz + b * e + vec2(sin(time * 0.31 + a.z), cos(time * 0.27 + a.z * 1.3)) * 0.7 * e;
  float y = base.y + a.y * e + (w - 0.5) * 26. * e + sin(time * 0.4 + a.z * 2.1) * 0.4 * e;
  return vec4(xz.x, y, xz.y, smoothstep(0., 0.12, s) * mix(1., smoothstep(0., 0.12, w) * (1. - smoothstep(0.88, 1., w)), e));
}`;function Ee(o,t){const i=new Ve;i.lathe(o,t,0,0,0);const s=new a.InstancedBufferGeometry;return s.setAttribute("position",new a.Float32BufferAttribute(i.p,3)),s.setAttribute("normal",new a.Float32BufferAttribute(i.n,3)),s.setAttribute("color",new a.Float32BufferAttribute(i.c,3)),s.setIndex(i.idx),s}function Ge(o,t){const i=[1,1,1],s=[0,0,0],c=Ee([[0,-1.62,s],[.15,-1.2,s],[.2,-1.1,i],[.45,-.86,i],[.45,-.5,i],[.2,-.27,i],[.15,-.13,s]],6),u=o.length,n=new Float32Array(u*4),r=new Float32Array(u);for(let g=0;g<u;g++)n.set(o[g].slice(0,4),g*4),r[g]=o[g][4];c.setAttribute("aInst",new a.InstancedBufferAttribute(n,4)),c.setAttribute("aScale",new a.InstancedBufferAttribute(r,1)),c.instanceCount=u;const f=new a.ShaderMaterial({uniforms:Pe(t),fog:!0,vertexShader:`
      attribute vec3 color; attribute vec4 aInst; attribute float aScale;
      uniform float uTime;
      varying vec3 vN; varying vec3 vWp; varying float vPaper; varying float vY; varying float vPh;
      #include <fog_pars_vertex>
      void main(){
        float a1 = sin(uTime * 1.1 + aInst.w) * 0.1 + sin(uTime * 0.63 + aInst.w * 1.7) * 0.05;
        float a2 = sin(uTime * 0.9 + aInst.w * 2.3) * 0.08;
        vec3 p = position * aScale; vec3 n = normal;
        float c = cos(a1), s = sin(a1);
        p.xy = vec2(p.x * c - p.y * s, p.x * s + p.y * c); n.xy = vec2(n.x * c - n.y * s, n.x * s + n.y * c);
        c = cos(a2); s = sin(a2);
        p.zy = vec2(p.z * c - p.y * s, p.z * s + p.y * c); n.zy = vec2(n.z * c - n.y * s, n.z * s + n.y * c);
        vec4 wp = modelMatrix * vec4(p + aInst.xyz, 1.);
        vN = normalize(mat3(modelMatrix) * n); vWp = wp.xyz; vPaper = color.r; vY = position.y; vPh = aInst.w;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uRed; uniform vec3 uAmber; uniform vec3 uSky;
      varying vec3 vN; varying vec3 vWp; varying float vPaper; varying float vY; varying float vPh;
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN), V = normalize(cameraPosition - vWp);
        float ndv = abs(dot(n, V));
        float rib = 0.84 + 0.16 * sin(vY * 52.);
        float fl = 0.88 + 0.12 * sin(uTime * (2.3 + fract(vPh) * 2.) + vPh * 5.);
        float core = pow(ndv, 1.4) * smoothstep(-1.2, -0.75, vY) * smoothstep(-0.2, -0.6, vY);
        vec3 glow = mix(uRed * 2.6, mix(uRed, uAmber, 0.3) * 4.2, core) * rib * fl;
        vec3 cap = vec3(0.012, 0.01, 0.012) + uSky * 0.03 + uRed * 0.05;
        vec3 col = mix(cap, glow, step(0.5, vPaper));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),v=new a.Mesh(c,f);return v.frustumCulled=!1,v}function Ne(o,t,i=Ue){const s=[1,1,1],c=Ee([[.27,0,s],[.42,.55,s],[.46,.95,s],[.31,1.22,s],[0,1.31,s]],7),u=o.length,n=new Float32Array(u*3),r=new Float32Array(u*4),f=new Float32Array(u*2);for(let l=0;l<u;l++){const e=o[l];n.set(e.base,l*3),r.set(e.a,l*4),f.set(e.b,l*2)}c.setAttribute("aBase",new a.InstancedBufferAttribute(n,3)),c.setAttribute("aA",new a.InstancedBufferAttribute(r,4)),c.setAttribute("aB",new a.InstancedBufferAttribute(f,2)),c.instanceCount=u;const v=new a.ShaderMaterial({uniforms:Pe(t),fog:!0,side:a.DoubleSide,vertexShader:`
      attribute vec3 aBase; attribute vec4 aA; attribute vec2 aB;
      uniform float uTime; uniform float uProgress;
      varying vec3 vN; varying vec3 vWp; varying float vY; varying float vPh;
      #include <fog_pars_vertex>
      ${i}
      void main(){
        vec4 r = risePos(aBase, aA, aB, uProgress, uTime);
        float tilt = sin(uTime * 0.7 + aA.z * 3.) * 0.1;
        vec3 p = position * (aA.w * r.w);
        p.xy = vec2(p.x * cos(tilt) - p.y * sin(tilt), p.x * sin(tilt) + p.y * cos(tilt));
        vec4 wp = modelMatrix * vec4(p + r.xyz, 1.);
        vN = normalize(mat3(modelMatrix) * normal); vWp = wp.xyz; vY = position.y; vPh = aA.z;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uAmber; uniform vec3 uRed;
      varying vec3 vN; varying vec3 vWp; varying float vY; varying float vPh;
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN), V = normalize(cameraPosition - vWp);
        float inside = step(dot(n, V), 0.);
        float fl = 0.85 + 0.15 * sin(uTime * (3. + fract(vPh) * 3.) + vPh * 9.);
        float hot = smoothstep(1.3, 0., vY);
        vec3 col = mix(uAmber * 1.3, mix(uAmber, vec3(1., 0.75, 0.4), 0.3) * 3.3, hot * hot) * fl;
        col = mix(col, mix(uAmber, uRed, 0.25) * 1.2, smoothstep(0.9, 1.3, vY));
        col *= 1. + inside * 0.8;
        col *= 0.8 + 0.2 * sin(atan(n.x, n.z) * 7.);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),g=new a.Mesh(c,v);return g.frustumCulled=!1,g}function je(o,t,i=Ue){const s=o.length,c=new Float32Array(s*3),u=new Float32Array(s*4),n=new Float32Array(s*4),r=new Float32Array(s*3);for(let e=0;e<s;e++){const m=o[e];c.set(m.p,e*3),u.set(m.a||[0,0,e*1.37,0],e*4),n.set([m.b?m.b[0]:0,m.b?m.b[1]:0,m.type,m.size],e*4),r.set(m.col,e*3)}const f=new a.BufferGeometry;f.setAttribute("position",new a.BufferAttribute(c,3)),f.setAttribute("aA",new a.BufferAttribute(u,4)),f.setAttribute("aB",new a.BufferAttribute(n,4)),f.setAttribute("aCol",new a.BufferAttribute(r,3));const v=e=>new a.ShaderMaterial({uniforms:Pe(t),fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,defines:e?{MIRROR:1}:{},vertexShader:`
      attribute vec4 aA; attribute vec4 aB; attribute vec3 aCol;
      uniform float uTime; uniform float uProgress; uniform float uPx;
      varying vec3 vCol; varying float vTw;
      #include <fog_pars_vertex>
      ${i}
      void main(){
        float type = aB.z, vis = 1.;
        vec3 p = position;
        if ((type > 0.5 && type < 1.5) || (type > 2.5 && type < 3.5)) { vec4 r = risePos(position, aA, aB.xy, uProgress, uTime); p = r.xyz; vis = r.w; }
        else p.xz += aA.xy * sin(uTime * 0.8 + aA.w);                      // static glows may sway: aA.xy = amplitude (m), aA.w = phase
        #ifdef MIRROR
          if (type > 3.5) vis = 0.;
          float h = max(p.y, 0.);
          p.x += sin(h * 0.55 - uTime * 1.7 + p.x * 0.21) * (0.06 + 0.008 * h);
          p.y = -p.y;
        #else
          if (type > 1.5 && type < 3.5) vis = 0.;
        #endif
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        gl_PointSize = clamp(vis * aB.w * uPx * projectionMatrix[1][1] / max(-mvPosition.z, 1.), 0., 96.);
        vTw = vis * (0.82 + 0.18 * sin(uTime * (2. + fract(aA.z) * 3.) + aA.z * 7.));
        vCol = aCol;
        gl_Position = projectionMatrix * mvPosition;
        if (vis < 0.01) gl_Position = vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime;
      varying vec3 vCol; varying float vTw;
      #include <fog_pars_fragment>
      void main(){
        vec2 q = (gl_PointCoord - 0.5) * 2.;
        #ifdef MIRROR
          q.x *= 2.4;
          float rip = 0.55 + 0.45 * sin(gl_FragCoord.y * 1.3 + uTime * 5. + gl_FragCoord.x * 0.15);
        #else
          float rip = 1.;
        #endif
        float d = length(q);
        float a = exp(-d * d * 5.) * 0.45 + pow(max(1. - d, 0.), 7.) * 1.5;
        a *= smoothstep(1., 0.7, d);
        vec3 col = vCol * a * vTw * rip;
        #ifdef MIRROR
          col *= 0.42;
        #endif
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
          #else
            col *= 1. - smoothstep(fogNear, fogFar, vFogDepth);
          #endif
        #endif
        gl_FragColor = vec4(col, 1.);
      }`}),g=new a.Points(f,v(!1)),l=new a.Points(f,v(!0));return g.frustumCulled=l.frustumCulled=!1,{above:g,below:l}}function st(o,t){const i=new a.Group,s=new a.Mesh(new a.CircleGeometry(Math.max(3e3,t*1.2),48),new a.ShaderMaterial({uniforms:Pe(o),fog:!0,depthWrite:!1,vertexShader:`#include <fog_pars_vertex>
      void main(){ vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
      }`,fragmentShader:`uniform vec3 uWater;
      #include <fog_pars_fragment>
      void main(){ gl_FragColor = vec4(uWater, 1.);
      #include <fog_fragment>
      }`}));s.rotation.x=-Math.PI/2,s.position.y=-.4,s.renderOrder=-.8,s.frustumCulled=!1;const c=new a.Mesh(new a.CircleGeometry(t,72),new a.ShaderMaterial({uniforms:Pe(o),fog:!0,transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,vertexShader:`
      varying vec3 vWp; varying vec3 vLp;
      #include <fog_pars_vertex>
      void main(){
        vLp = vec3(position.x, 0., -position.y);
        vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform float uWaterR; uniform vec3 uWater; uniform vec3 uHorizon; uniform vec3 uSky; uniform vec3 uAmber; uniform vec3 uRed;
      uniform vec3 uOrigin; uniform vec4 uPortal; uniform vec3 uPortalCol; uniform vec3 uMoonDir; uniform vec3 uMoonGlint; uniform vec2 uEmberDir; uniform vec3 uEmberCol;
      varying vec3 vWp; varying vec3 vLp;
      #include <fog_pars_fragment>
      ${qe}
      void main(){
        vec3 V = normalize(cameraPosition - vWp);
        vec2 p = vLp.xz; float t = uTime;
        float dist = length(cameraPosition - vWp), lod = clamp(60. / dist, 0.15, 1.);
        float gx = 0.05 * sin(p.x * 1.3 + t * 1.2 + sin(p.y * 0.7 + t * 0.3) * 1.5) + lod * (0.04 * sin(p.x * 3.1 - p.y * 2.3 + t * 2.1) + 0.07 * (vnoise(p * 1.9 + t * 0.6) - 0.5));
        float gz = 0.05 * sin(p.y * 1.1 - t * 0.9 + sin(p.x * 0.6 - t * 0.2) * 1.5) + lod * (0.04 * sin(p.y * 3.7 + p.x * 1.9 - t * 1.7) + 0.07 * (vnoise(p * 2.3 - t * 0.5 + 7.) - 0.5));
        vec3 n = normalize(vec3(gx, 1., gz));
        float ndv = max(dot(n, V), 0.);
        float F = 0.03 + 0.97 * pow(1. - ndv, 5.);
        vec3 R = reflect(-V, n); R.y = abs(R.y);
        vec3 sky = mix(uHorizon, uSky * 0.35, smoothstep(0., 0.5, R.y));
        // the ember band of the horizon, mirrored where the water looks toward it
        sky += uEmberCol * pow(max(dot(normalize(R.xz + 1e-5), uEmberDir), 0.), 5.) * (1. - smoothstep(0.02, 0.3, R.y));
        // light of the tower smeared toward the viewer: where does the rippled reflection ray pass the tower axis?
        // (world frame: the piece may be rotated in the world)
        vec2 pw = vWp.xz - uOrigin.xz;
        vec2 r2 = R.xz; float tt = -dot(pw, r2) / max(dot(r2, r2), 1e-4);
        float dmin = length(pw + r2 * tt), hy = R.y * tt;
        float glow = step(0., tt) * exp(-dmin * dmin / 90.) * smoothstep(1., 6., hy) * (1. - smoothstep(48., 72., hy));
        float glit = pow(vnoise(p * vec2(1.6, 1.1) + vec2(t * 0.7, -t * 0.4)), 2.) * 2.2;
        vec3 smear = mix(uRed, uAmber, 0.6) * glow * (0.05 + 0.34 * glit);
        // the same for a ring of light standing in the water (the world's exit portal): uPortal = (x, z, top height, strength)
        vec2 pq = vWp.xz - uPortal.xy; float t2 = -dot(pq, r2) / max(dot(r2, r2), 1e-4);
        float d2 = length(pq + r2 * t2), h2 = R.y * t2;
        smear += uPortalCol * (uPortal.w * step(0., t2) * exp(-d2 * d2 / 46.) * smoothstep(0.2, 3., h2) * (1. - smoothstep(uPortal.z * 0.75, uPortal.z, h2)) * (0.08 + 0.5 * glit));
        // moon glitter
        smear += uMoonGlint * pow(max(dot(R, uMoonDir), 0.), 260.) * (0.4 + 2.4 * glit);
        float a0 = 0.22, k = F * 0.5;
        float alpha = a0 + (1. - a0) * k;
        vec3 rgb = uWater * a0 * (1. - k) + sky * k + smear;
        float fade = 1. - smoothstep(uWaterR * 0.75, uWaterR, length(p));
        rgb *= fade; alpha *= fade;
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            float ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
          #else
            float ff = smoothstep(fogNear, fogFar, vFogDepth);
          #endif
          rgb = mix(rgb, fogColor * alpha, ff);
        #endif
        gl_FragColor = vec4(rgb, alpha);
      }`}));return c.rotation.x=-Math.PI/2,c.position.y=.01,c.renderOrder=2,i.add(s,c),i}function it(o){const t=new a.Mesh(new a.PlaneGeometry(2,2),new a.ShaderMaterial({uniforms:o,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:`
      varying vec2 vQ;
      void main(){
        vQ = position.xy;
        vec4 mv = viewMatrix * modelMatrix * vec4(0., 27., 0., 1.);
        mv.xy += position.xy * vec2(62., 66.); mv.z -= 24.;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uAmber; uniform vec3 uRed; varying vec2 vQ;
      void main(){
        float d = length(vQ * vec2(1., 0.85) + vec2(0., 0.12));
        float a = exp(-d * d * 3.2) * (1. - smoothstep(0.75, 1., length(vQ)));
        gl_FragColor = vec4(mix(uRed, uAmber, 0.6) * 0.085 * a, 1.);
      }`}));return t.frustumCulled=!1,t.renderOrder=3,t}function lt(o,t){const n=new Float32Array(6480),r=new Float32Array(2160*3);for(let g=0,l=0;g<6;g++)for(let e=0;e<72;e++){const m=o.range(-1,1),M=o.range(0,ae),d=Math.sqrt(1-m*m),b=o.chance(.75)?o.range(.9,1):o.range(.35,.9),S=o();for(let k=0;k<5;k++,l++)n.set([d*Math.cos(M)*b,m*b,d*Math.sin(M)*b],l*3),r.set([g,k*.075,S],l*3)}const f=new a.BufferGeometry;f.setAttribute("position",new a.BufferAttribute(n,3)),f.setAttribute("aS",new a.BufferAttribute(r,3));const v=new a.Points(f,new a.ShaderMaterial({uniforms:t,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:`
      attribute vec3 aS;
      uniform float uTime; uniform float uPx; uniform vec3 uFwC; uniform vec2 uFwT; uniform vec3 uAmber; uniform vec3 uRed;
      varying vec3 vCol;
      float h1(float x){ return fract(sin(x * 127.1) * 43758.5453); }
      void main(){
        float sh = aS.x, T = 6.4, life = 3.6;
        float ct = uTime / T + 0.31 + step(2.5, sh) * 0.5 - mod(sh, 3.) * 0.045;
        float cyc = floor(ct), age = fract(ct) * T, k = sh * 17. + cyc * 3.7;
        float lane = mod(sh, 3.) - 1.;
        vec3 c = uFwC + vec3(uFwT.x, 0., uFwT.y) * (lane * 46. + (h1(k) - 0.5) * 34.) + vec3(0., (h1(k + 1.3) - 0.5) * 34. + abs(lane) * -8., 0.);
        float Rb = 21. + 15. * h1(k + 2.9);
        float lag = aS.y, ageP = max(age - lag, 0.);
        float e = 1. - exp(-ageP * 2.3);
        vec3 p = c + position * Rb * e - vec3(0., 0.55 * ageP * ageP, 0.);
        float b = (1. - step(life, age)) * (1. - smoothstep(0.5, 1., age / life));
        b *= (1. - lag * 2.3) * step(lag, age);
        b *= 0.65 + 0.35 * sin(uTime * 23. + aS.z * 40.) * smoothstep(0.8, 2.5, age);
        float gold = step(0.5, h1(k + 5.1));
        vec3 base = mix(uRed * 1.2 + vec3(0.25, 0.02, 0.02), mix(uAmber, vec3(1., 0.8, 0.45), 0.5), gold);
        vCol = mix(base, vec3(1., 0.9, 0.75), exp(-age * 5.)) * b * (5. + 7. * exp(-age * 4.));
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_PointSize = clamp((1.0 + 1.1 * aS.z) * (1. - lag * 1.6) * (0.5 + 0.5 * b) * uPx * projectionMatrix[1][1] / max(-mv.z, 1.), 1.6, 24.);
        gl_Position = b > 0.002 ? projectionMatrix * mv : vec4(2., 2., 2., 1.);
      }`,fragmentShader:`
      varying vec3 vCol;
      void main(){ float d = length(gl_PointCoord - 0.5) * 2.; gl_FragColor = vec4(vCol * pow(max(1. - d, 0.), 2.5), 1.); }`}));return v.frustumCulled=!1,v.renderOrder=1.5,v}async function ut(o,t={}){const i=o.rng,s=o.noise,c=t.palette&&t.palette.length>=7?t.palette:He,u=(p,N)=>{const K=new a.Color(p);return K.offsetHSL(N,0,0),[K.r,K.g,K.b]},n={night:Ae(c[0]),cobalt:Ae(c[1]),violet:Ae(c[2]),ink:Ae(c[3]),timber:Ae(c[4]),amber:u(c[5],i.range(-.012,.012)),red:u(c[6],i.range(-.012,.02))};n.lanternLight=ie(n.red,n.amber,.28),n.windowLight=ie(n.amber,[1,.8,.6],.3);const r=new Ve,f=et(r,i,s,n,t);await o.yield();const v=tt(r,i,s,n,f);await o.yield();const g=ot(r,f.sources,v.sources);await o.yield();const l=p=>new a.Vector3(p[0],p[1],p[2]),e={uTime:{value:0},uSeed:{value:i.range(1,90)},uProgress:{value:t.progress??.78},uPx:{value:270},uSky:{value:l(j(ie(n.cobalt,n.violet,.25),1.8))},uGround:{value:l(j(ie(n.night,n.cobalt,.3),1.2))},uMoonDir:{value:new a.Vector3(.55,.5,.67).normalize()},uMoonCol:{value:new a.Vector3(.28,.34,.5)},uAmber:{value:l(n.amber)},uRed:{value:l(n.red)},uLacquer:{value:l(f.colors.lacquer)},uWood:{value:l(f.colors.wood)},uWater:{value:l(j(ie(n.night,n.cobalt,.12),.8))},uHorizon:{value:l(j(ie(n.cobalt,n.violet,.4),.45))},uWaterR:{value:t.waterRadius??2600},uU:{value:0},uOrigin:{value:new a.Vector3},uPortal:{value:new a.Vector4(0,0,16,0)},uPortalCol:{value:new a.Vector3(1,.8,.5)},uMoonGlint:{value:new a.Vector3(0,0,0)},uEmberDir:{value:new a.Vector2(0,-1)},uEmberCol:{value:new a.Vector3(0,0,0)},uFwC:{value:new a.Vector3(0,78,-100)},uFwT:{value:new a.Vector2(1,0)}},m=new a.Group;m.name="lantern-pagoda";const M=rt(r,g,e);m.add(M.mesh,M.mirror);const d=f.lanterns.concat(v.lanterns);m.add(Ge(d,e)),await o.yield();const b=[],S=n.amber,k=n.lanternLight;for(const p of v.bulbs)b.push({p:[p[0],p[1],p[2]],type:0,size:.8,col:p[3]?j(n.red,3):j(S,2.4)});for(const p of f.glows.concat(v.glows))b.push({p:[p[0],p[1],p[2]],type:0,size:1.3*p[3]+.5,col:j(S,.9)});for(const p of d)b.push({p:[p[0],p[1]-.7,p[2]],type:2,size:1.6,col:j(k,1)}),b.push({p:[p[0],p[1]-.7,p[2]],type:4,size:3,col:j(k,.14)});const h=[],C=[];if(t.release!==!1){const p=i.sign(),N=f.RE[0]*(f.N===4?1.45:1.12)+1.5,K=240,U=640,ue=i.range(0,ae);for(let ne=0;ne<K+U;ne++){const fe=ne>=K,y=Math.pow(i(),1.5),z=ue+ne%3*ae/3+i.gauss()*.42,R=v.R(z),T=Math.max(N,R*(fe?i.range(.85,1.9):i.range(.8,1.45))),W=[Math.sin(z)*T,T<R-.5?v.yT+1.3:.9,Math.cos(z)*T],$=[.55*Math.pow(i(),1.3),8+(fe?100:82)*y,i.range(0,40),i.range(1,1.5)],B=[.1+.75*y+i.range(0,.18),p*(.5+2.2*y)];fe?b.push({p:W,a:$,b:B,type:1,size:i.range(.9,1.5),col:j(ie(S,n.red,i.range(0,.25)),i.range(.9,1.6))}):(h.push({base:W,a:$,b:B}),b.push({p:[W[0],W[1]+.6,W[2]],a:$,b:B,type:3,size:1.8,col:j(S,1)}),ne%13===0&&C.push(l(W)))}m.add(Ne(h,e))}const O=je(b,e);O.below.renderOrder=1,O.above.renderOrder=4,m.add(O.below,O.above),t.water!==!1&&m.add(st(e,e.uWaterR.value)),m.add(it(e));const G=t.fireworks===void 0?"auto":t.fireworks;G&&m.add(lt(i,e)),await o.yield();const I=f.tiers,Q=I[4],X=f.RE[0]*(f.N===4?1.5:1.12),Y={gaze:new a.Vector3(0,Q.y+2,0),flyBy:[[-90,17,64],[-45,20.5,53.5],[0,22,50],[45,21,53.5],[90,18,64]].map(l),viewpoints:{entry:new a.Vector3(-150,4,120),low:new a.Vector3(-20,3.5,95),mid:new a.Vector3(0,22,62),high:new a.Vector3(55,40,70)},clearance:{minCameraDistance:30,eaveRadius:X,islandRadius:Math.max(v.rx,v.rz)*1.08},portalSeat:null,landing:l(v.landing),torii:l(v.torii),releasePoints:C,lightSpots:[new a.Vector3(0,I[1].eaveY-1,I[1].eaveRadius+2),new a.Vector3(I[3].eaveRadius+2,I[3].eaveY-1,0),new a.Vector3(-I[3].eaveRadius-2,I[3].eaveY-1,0),new a.Vector3(0,4,v.rL+3)],fireworks:[new a.Vector3(-46,62,-105),new a.Vector3(0,78,-105),new a.Vector3(46,60,-105)],tiers:I},H=r.triangles*2+d.length*72+h.length*56+2+72+48,L=new a.Vector3,q=new a.Vector2;return{object:m,radius:50,height:70,center:new a.Vector3(0,24,0),anchors:Y,ground:!1,groundY:0,uniforms:e,info:{sides:f.N,top:f.top,triangles:H,solidTriangles:r.triangles,lanterns:d.length,skyLanterns:h.length,glowPoints:b.length,island:[v.rx,v.rz]},setProgress(p){e.uProgress.value=We(p,0,1)},setU(p){e.uU.value=p},setWater(p={}){const N=(K,U)=>{U!=null&&(U.isColor?K.value.set(U.r,U.g,U.b):U.isVector3?K.value.copy(U):K.value.set(U[0],U[1],U[2]))};p.portal&&e.uPortal.value.set(p.portal[0],p.portal[1],p.portal[2],p.portal[3]),N(e.uPortalCol,p.portalColor),N(e.uMoonGlint,p.moonGlint),N(e.uEmberCol,p.emberColor),p.emberDir&&e.uEmberDir.value.set(p.emberDir[0],p.emberDir[1]).normalize()},kit:{hung:p=>Ge(p,e),rising:p=>Ne(p,e,De),glows:p=>{const N=je(p,e,De);return N.below.renderOrder=1,N.above.renderOrder=4,N}},setLight(p={}){const N=(K,U)=>{U!==void 0&&(U.isColor?K.value.set(U.r,U.g,U.b):K.value.copy(U))};N(e.uSky,p.skyColor),N(e.uGround,p.groundColor),N(e.uMoonCol,p.moonColor),N(e.uWater,p.waterColor),N(e.uHorizon,p.horizonColor),p.moonDir&&e.uMoonDir.value.copy(p.moonDir).normalize()},update(p,N,K){if(e.uTime.value=N,m.updateWorldMatrix(!0,!1),e.uOrigin.value.setFromMatrixPosition(m.matrixWorld),o.renderer&&(o.renderer.getDrawingBufferSize(q),e.uPx.value=q.y*.5),G==="auto"&&K){m.updateWorldMatrix(!0,!1),m.worldToLocal(L.copy(K.position));const U=Math.hypot(L.x,L.z)||1,ue=-L.x/U,ne=-L.z/U;e.uFwC.value.set(ue*100,78,ne*100),e.uFwT.value.set(-ne,ue)}},dispose(){}}}export{ut as buildHero};
