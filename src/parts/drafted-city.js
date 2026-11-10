import*as w from"three";import{clamp as G,lerp as W,smoothstep as ae}from"../kit/core.js";const ge=["#0B2A4A","#12406E","#1E5A94","#F3F7FB","#9FC2E0","#F1E6C8","#E63A2E"],we=3.8,ne=300,j=0,q=1,O=2,D=0,L=1,oe=2,Y=0,K=1,ce=2,ee=3,J=4,se=0,fe=1,he=2,xe=3,ye=4,be=5,ke=6,Pe=7,X=46+486/16,U=1e9;function Me(){const e=[],f=[],a={hid:e,vis:f,w:[.24,.13,.08],col:Y,rank:j,style:D,grp:se,hidden:!1,extra:0,fade:U,set(o){return Object.assign(a,o),a},seg(o,g,u,c,h,p,d=-1,T=-.5){(a.hidden?e:f).push(o,g,u,c,h,p,a.w[a.rank]*(a.wScale||1),a.style+4*a.rank,a.col,a.grp,d,T,a.fade,a.extra)},poly(o,g=-1,u=-.5,c=!1){const h=o.length-(c?0:1);for(let p=0;p<h;p++){const d=o[p],T=o[(p+1)%o.length];a.seg(d[0],d[1],d[2],T[0],T[1],T[2],W(g,u,p/h),W(g,u,(p+1)/h))}},circle(o,g,u,c,h,p=-1,d=-.5,T=0,B=Math.PI*2){const l=[];for(let b=0;b<=h;b++){const t=W(T,B,b/h),k=Math.cos(t)*c,n=Math.sin(t)*c;l.push([o[0]+g[0]*k+u[0]*n,o[1]+g[1]*k+u[1]*n,o[2]+g[2]*k+u[2]*n])}a.poly(l,p,d)}};return a}function de(e){const f=e*40;return f<17?10+20*ae(14,17,f):f<34.5?W(30,445,(f-17)/17.5):W(445,578,G((f-34.5)/5.5,0,1))}function ue(e){const f=e*40;return f<16.4?-5:f<36?de(e)-14:W(de(.9)-14,592,ae(0,1,(f-36)/2.4)*.5+.5*G((f-36)/2.4,0,1))}function Se(e){const f=g=>Math.round((g+e.range(-2,2))*.5)*2,a=[0,120,240,360,450,520,560];return[48,f(39),f(31),24,f(15),12].map((g,u)=>({y0:a[u],y1:a[u+1],half:g}))}const Q=[[0,1],[1,0],[0,-1],[-1,0]],te=[[1,0],[0,-1],[-1,0],[0,1]],re=(e,f,a)=>[Q[e][0]*f+te[e][0]*a,Q[e][1]*f+te[e][1]*a],pe=re,le=(e,f,a)=>{const o=G(a/Math.max(f,1e-6),-1.5,1.5)*Math.PI/4,g=Math.cos(o),u=Math.sin(o);return[(Q[e][0]*g+te[e][0]*u)*f,(Q[e][1]*g+te[e][1]*u)*f]},ze=(e,f,a)=>{const o=G(a/Math.max(f,1e-6),-1.5,1.5)*Math.PI/4,g=Math.cos(o),u=Math.sin(o);return[-Q[e][0]*u+te[e][0]*g,-Q[e][1]*u+te[e][1]*g]};function Ae(e,f,a,o){const g=[-100,-99],u=o.round?le:re,c=o.round?ze:t=>te[t],h=(t,k,n,P,A,i,z)=>{const M=o.round?6:1;for(let r=0;r<M;r++){const m=u(t,k,W(n,P,r/M)),s=u(t,k,W(n,P,(r+1)/M));e.seg(m[0],A,m[1],s[0],A,s[1],W(i,z,r/M),W(i,z,(r+1)/M))}};a.forEach((t,k)=>{const n=t.half,P=Math.max(1,Math.round((t.y1-t.y0)/we)),A=(t.y1-t.y0)/P,i=Math.max(3,Math.round(2*n/o.bay)),z=2*n/i,M=z*(o.round?.785:1);t.nF=P,t.fh=A,t.nb=i,e.set({grp:se,rank:q,col:K,style:D,hidden:!1,fade:t.y0,wScale:2});for(let s=0;s<4;s++){const[x,y]=u(s,n,n),[v,E]=u(s,n,-n);e.seg(x,t.y0,y,x,t.y1+3,y,...g),e.set({fade:t.y1-12,style:L}),h(s,n,-n,n,t.y1,...g),e.set({fade:t.y0,style:D})}e.set({wScale:1}),e.set({rank:j,col:Y,hidden:!0,fade:U});for(let s=0;s<4;s++){const[x,y]=u(s,n,n);e.seg(x,t.y0-.6,y,x,t.y1+.7,y,t.y0,t.y1)}e.set({rank:q});for(let s=0;s<4;s++)for(let x=1;x<i;x++){const y=-n+x*z,[v,E]=u(s,n,y),C=x%o.pier===0;if(e.set({rank:C?q:O,col:C?Y:J,hidden:C,extra:C?M*o.pier:M}),e.seg(v,t.y0,E,v,t.y1,E,t.y0+1.5,t.y1+1.5),C&&o.paired){const[S,H]=u(s,n,y+.9);e.set({hidden:!1,extra:1.6}),e.seg(S,t.y0,H,S,t.y1,H,t.y0+2.5,t.y1+2.5)}}e.set({extra:0});for(let s=0;s<=P;s++){const x=t.y0+s*A,y=s%o.belt===0||s===P,v=y?.9:.45;e.set({rank:y?j:q,col:y?Y:J,hidden:y,style:D,extra:y?-A*o.belt:-A,wScale:y?1.25:1});for(let S=0;S<4;S++)y?h(S,n,-n-v,n+v,x,x+S*3.2,x+S*3.2+3.6):h(S,n,-n-v,n+v,x,x+.6+S*.5,x+2.6+S*.5);if(e.set({wScale:1,extra:0}),s===P)break;e.set({rank:O,col:J,hidden:!1,extra:Math.max(1.2,2*M*o.winW)});const E=x+A*.26,C=x+A*.8;for(let S=0;S<4;S++)for(let H=0;H<i;H++){const _=-n+(H+.5)*z,F=x+1.2+3*((S+(H+.5)/i)/4),I=F+.5;if(k===0&&s<3)continue;const R=z*o.winW;if(o.win===0){const[Z,$]=u(S,n,_);e.seg(Z,E,$,Z,C,$,F,I);continue}const N=u(S,n,_-R),V=u(S,n,_+R);e.seg(N[0],E,N[1],N[0],C,N[1],F,I),e.seg(V[0],E,V[1],V[0],C,V[1],F+.15,I+.15),o.win===2&&e.seg(N[0],C,N[1],V[0],C,V[1],F+.3,I+.3)}}if(e.set({extra:0}),o.braced[k]&&!o.round){e.set({rank:q,col:J,hidden:!1});const s=Math.max(1,Math.round(i/o.pier)),x=2*n/s,y=A*o.belt*2;for(let v=0;v<4;v++)for(let E=0;E<s;E++)for(let C=t.y0;C<t.y1-y*.5;C+=y){const S=Math.min(t.y1,C+y),H=u(v,n+.05,-n+E*x),_=u(v,n+.05,-n+(E+1)*x);e.seg(H[0],C,H[1],_[0],S,_[1],C,S),e.seg(_[0],C,_[1],H[0],S,H[1],C+1,S+1)}}e.set({rank:O,col:J,hidden:!1});const r=Math.round(2*n/2.4);for(let s=0;s<4;s++){e.set({extra:2});for(let x=0;x<=r;x++){const[y,v]=u(s,n,-n+x/r*2*n);e.seg(y,t.y1,v,y,t.y1+1.3,v,t.y1+4+s,t.y1+5+s)}e.set({rank:q,col:Y,extra:0}),h(s,n,-n-.4,n+.4,t.y1+1.3,t.y1+5+s,t.y1+8+s),e.set({rank:O,col:J})}const m=a[k+1];if(m&&o.buttress){const s=(n-m.half)*2.6;for(let x=0;x<4;x++){const y=u(x,n,n),v=u(x,m.half,m.half),E=[];for(let C=0;C<=8;C++){const S=C/8,H=(1-S)*(1-S),_=2*S*(1-S),F=S*S;E.push([y[0]*H+y[0]*_+v[0]*F,t.y1+s*(.75*_+F),y[1]*H+y[1]*_+v[1]*F])}e.set({rank:O,col:K,style:L,hidden:!1,fade:t.y1+s+10}),e.seg(y[0],t.y1,y[1],v[0],t.y1+s,v[1],t.y1+1,t.y1+5),e.set({rank:j,col:Y,style:D,fade:U}),e.poly(E,t.y1+5,t.y1+s+5)}e.set({rank:O,col:J})}if(m&&n-m.half>=5){const s=(n+m.half)*.5,x=Math.max(2,Math.round(2*s/o.treeGap));for(let y=0;y<4;y++)for(let v=0;v<x;v++){const E=-s+(v+.5)/x*2*s,[C,S]=u(y,s,E),H=f.range(1.5,2.4)*(1+k*.06),_=f.range(2.4,3.6),F=t.y1+9+6*((y+v/x)/4);e.set({rank:q,col:Y}),e.seg(C,t.y1,S,C,t.y1+_,S,F,F+.6);const I=c(y,s,E);e.set({rank:O,col:Y}),e.circle([C,t.y1+_+H,S],[I[0],0,I[1]],[0,1,0],H,9,F+.6,F+2.2,-Math.PI/2,Math.PI*1.5)}}}),o.gothic&&a.forEach((t,k)=>{const n=t.half,P=k===0?n+13:a[k-1].half-1.2;if(P-n<4)return;const A=Math.min((t.y1-t.y0)*.42,44),i=t.y0+A,z=i+(P-n)*1.25;for(let M=0;M<4;M++)for(const r of[-.62,0,.62]){const m=r*n,s=u(M,P,m),x=t.y0+2+M;e.set({grp:se,rank:q,col:Y,style:D,hidden:!1,fade:U}),e.seg(s[0],t.y0,s[1],s[0],i+4,s[1],x,i+4);const y=u(M,P+.9,m),v=u(M,P-.9,m);e.set({rank:O}),e.seg(y[0],i+4,y[1],s[0],i+11,s[1],i+4,i+8),e.seg(v[0],i+4,v[1],s[0],i+11,s[1],i+5,i+9),e.seg(y[0],i+4,y[1],v[0],i+4,v[1],i+4,i+5);const E=u(M,n,m);e.set({rank:q}),e.seg(s[0],i+3,s[1],E[0],z+3,E[1],i+6,z+6);const C=[];for(let S=0;S<=8;S++){const H=S/8,_=P-(P-n)*Math.sin(H*Math.PI/2),F=u(M,_,m);C.push([F[0],i-3+(z+4-i)*(1-Math.cos(H*Math.PI/2)),F[1]])}e.set({rank:j,wScale:1.5}),e.poly(C,i+2,z+4),e.set({wScale:1}),e.set({rank:O,col:K,style:L,fade:z+10}),e.seg(s[0],i-3,s[1],E[0],i-3,E[1],t.y0,t.y0+4),e.set({style:D,fade:U})}});const p=a[0],d=o.arches;for(let t=0;t<4;t++)for(let k=0;k<d;k++){const n=2*p.half/d,P=-p.half+(k+.5)*n,A=t===0&&k===(d-1)/2,i=n*(A?.44:.36),z=A?9.5:6.5,M=u(t,p.half+.1,P),r=c(t,p.half,P),m=i*(o.round?.8:1),s=[M[0]-r[0]*m,M[1]-r[1]*m],x=[M[0]+r[0]*m,M[1]+r[1]*m];e.set({rank:A?j:q,col:Y,hidden:!1}),e.seg(s[0],0,s[1],s[0],z,s[1],.5,z),e.seg(x[0],0,x[1],x[0],z,x[1],.5,z),e.circle([M[0],z,M[1]],[r[0],0,r[1]],[0,1,0],m,10,z,z+m+2,Math.PI,0),e.set({rank:O,col:K,style:oe}),e.seg(M[0],-.5,M[1],M[0],z+i+2.5,M[1],0,z+i),e.set({style:D})}const T=a[a.length-1],B=T.half,l=T.y1;e.set({rank:j,col:Y,hidden:!0});const b=l+15;for(let t=0;t<4;t++){const[k,n]=u(t,B*.72,B*.72),[P,A]=u(t,B*.72,-B*.72);e.seg(P,l+1.3,A,k,l+1.3,n,l+2,l+5),o.crown===0?e.seg(k,l+1.3,n,0,b,0,l+3,b+2):(e.seg(k,l+1.3,n,k*.45,l+9,n*.45,l+3,l+9),e.seg(k*.45,l+9,n*.45,P*.45,l+9,A*.45,l+9,l+11),e.seg(k*.45,l+9,n*.45,0,b,0,l+10,b+2))}e.set({rank:q,hidden:!1}),e.seg(0,b,0,0,b+10,0,b+2,b+6),e.set({rank:O});for(let t=0;t<3;t++)e.seg(-1.6+t*.4,b+3+t*2.4,0,1.6-t*.4,b+3+t*2.4,0,b+4,b+6)}function Te(e,f){const a=Math.PI/180,o=45*a,g=-59.8*a,u=60.2*a,c=new w.Vector3(Math.sin(o)*52,578,Math.cos(o)*52),h=new w.Vector3(Math.sin(g)*45,445,Math.cos(g)*45),p=c.clone().sub(h).normalize(),d=new w.Vector3(0,1,0).cross(p).normalize(),T=p.clone().cross(d).normalize(),B=P=>{let A=f[0].half;for(const i of f)A=W(A,i.half,ae(i.y0+4,i.y0+44,P));return A},l=[];for(let P=0;P<=16;P++){const A=P/16,i=W(30,445,A),z=W(u,u+240*a,A),M=W(B(i)+30,45,ae(390,445,i));l.push(new w.Vector3(Math.sin(z)*M,i,Math.cos(z)*M))}l.push(h.clone().lerp(c,.34),h.clone().lerp(c,.67),c.clone());const b=new w.Vector3(197,0,-66),t=new w.Vector3(.35,0,.937).normalize(),k=180,n=[3,2,1,0].map(P=>b.clone().addScaledVector(t,k*P));return{C:c,S:h,n:p,e1:d,e2:T,fly:l,P:n,step:k,sgn0:e.chance(.5)?1:-1,sgn1:-1,sweepR:295,sweepY:204}}function Fe(e,f,a,o,g,u){const c=[1,0,0],h=[0,1,0],p=[0,0,1],d=o.C.toArray(),T=o.e1.toArray(),B=o.e2.toArray(),l=[-1,-.5],b=g.round?le:re;e.set({grp:fe,rank:q,col:K,style:D,hidden:!1,fade:U,wScale:2.4}),e.set({fade:.9});for(let r=0;r<4;r++){const[m,s]=b(r,48,48),x=Math.hypot(d[0]-m,d[1],d[2]-s),y=1-13/x;e.seg(m,0,s,m+(d[0]-m)*y,d[1]*y,s+(d[2]-s)*y,...l)}e.set({fade:U}),e.set({rank:O,style:D,fade:.22,wScale:1}),e.circle([0,.15,0],c,p,130,72,...l);const t=(r,m)=>[0,1,2].map(s=>d[s]+(T[s]*Math.cos(r)+B[s]*Math.sin(r))*m);e.set({rank:q,col:K,style:oe,fade:.9,wScale:3.6}),e.circle(d,T,B,28,56,...l),e.set({rank:O,style:D,wScale:1.5}),e.circle(d,T,B,15,40,...l);for(let r=0;r<4;r++){const m=r*Math.PI/2+Math.PI/4,s=t(m,12.5),x=t(m,33);e.seg(s[0],s[1],s[2],x[0],x[1],x[2],...l)}{const r=a[a.length-1];e.set({rank:q,col:ee,style:oe,fade:.9,wScale:1.7}),e.seg(0,r.y1+15,0,d[0],d[1],d[2],...l),e.set({col:K,style:D,wScale:1.5,rank:O})}e.set({rank:q,col:ee,style:L,fade:.9,wScale:1.3}),e.circle(d,T,B,7,36,...l),e.set({rank:j,col:ee,style:D,fade:.9,wScale:1.25});for(const r of[0,Math.PI/2]){const m=t(r,-7.6),s=t(r,7.6);e.seg(m[0],m[1],m[2],s[0],s[1],s[2],...l)}e.set({fade:U}),e.set({rank:j,wScale:1.7}),e.circle(d,T,B,7,56,.825,.9),e.set({rank:O,wScale:1}),e.circle(d,T,B,6.45,40,.83,.905);const k=a[a.length-1];for(let r=0;r<4;r++){const[m,s]=b(r,k.half,k.half),x=Math.atan2(-(o.e2.x*d[0]+o.e2.z*d[2]),-(o.e1.x*d[0]+o.e1.z*d[2])),y=x+[-.38,-1.3,.38,1.3][r],v=[0,1,2].map(R=>d[R]+(T[R]*Math.cos(y)+B[R]*Math.sin(y))*8.4),E=Math.hypot(v[0]-m,v[2]-s),C=[m*1.25,k.y1+16+E*.45,s*1.25],S=[];for(let R=0;R<=14;R++){const N=R/14,V=(1-N)*(1-N),Z=2*N*(1-N),$=N*N;S.push([m*V+C[0]*Z+v[0]*$,k.y1*V+C[1]*Z+v[1]*$,s*V+C[2]*Z+v[2]*$])}e.set({rank:O,col:K,style:L,fade:.95,wScale:1.4}),e.seg(m,k.y1,s,v[0],v[1],v[2],.845,.88),e.set({rank:j,col:Y,style:D,fade:U,wScale:2}),e.poly(S,.885+r*.006,.925+r*.006);const H=S[14],_=[0,1,2].map(R=>-T[R]*Math.sin(y)+B[R]*Math.cos(y)),F=_[1]<0?-1:1;e.set({rank:j,wScale:1.3}),e.seg(H[0],H[1],H[2],H[0]+_[0]*F*4,H[1]+_[1]*F*4,H[2]+_[2]*F*4,.925+r*.006,.94+r*.006),e.set({rank:q,wScale:1.2}),e.circle([H[0]+_[0]*F*5.1,H[1]+_[1]*F*5.1,H[2]+_[2]*F*5.1],T,B,1.1,8,.94+r*.006,.952+r*.006);const I=S[11];e.seg(I[0]-T[0]*1.5,I[1],I[2]-T[2]*1.5,I[0]+T[0]*1.5,I[1],I[2]+T[2]*1.5,.918+r*.006,.925+r*.006),e.set({wScale:1})}e.set({rank:j,col:Y,wScale:1}),e.circle([0,.15,0],c,p,130,96,.17,.235),e.set({rank:q,col:J}),e.circle([0,.15,0],c,p,123,96,.185,.25),e.set({rank:O}),e.circle([0,.15,0],c,p,98,72,.2,.26),e.set({style:L}),e.circle([0,.15,0],c,p,76,64,.21,.27),e.set({style:D}),e.set({rank:q,col:ee,style:oe}),e.seg(-150,.2,0,150,.2,0,.12,.2),e.seg(0,.2,150,0,.2,-150,.1,.18),e.set({rank:q,col:J,style:D});for(const r of[52,56.5])if(g.round)e.circle([0,.15,0],c,p,r,40,.3,.34);else for(let m=0;m<4;m++){const s=b(m,r,-r-.5),x=b(m,r,r+.5);e.seg(s[0],.15,s[1],x[0],.15,x[1],.3+m*.01,.33+m*.01)}e.set({rank:O});for(let r=0;r<72;r++){const m=r/72*Math.PI*2,s=Math.cos(m),x=Math.sin(m),y=r%3?104:92;e.seg(s*y,.15,x*y,s*114,.15,x*114,.2+.06*r/72,.215+.06*r/72)}const n=g.plazaTrees;for(let r=0;r<n;r++){const m=(r+.5)/n*Math.PI*2,s=Math.cos(m),x=Math.sin(m),y=s*118,v=x*118;if(Math.abs(y)<9||Math.abs(v)<9)continue;const E=f.range(3.2,4.6),C=f.range(4.5,6.5),S=.195+.06*r/n;e.set({rank:q,col:Y}),e.seg(y,0,v,y,C,v,S,S+.008),e.set({rank:O}),e.circle([y,C+E,v],[-x,0,s],h,E,11,S+.008,S+.03,-Math.PI/2,Math.PI*1.5)}const P=-a[0].half-18,A=a[0].half+4;e.set({grp:se,rank:q,col:K}),e.seg(P,0,A,P,a[a.length-1].y1,A,0,a[a.length-1].y1);for(const r of[{y1:0,half:a[0].half},...a]){const m=r.y1;e.set({rank:O}),e.seg(-r.half-2,m,A,P-5,m,A,m,m+5),e.set({rank:q}),e.seg(P-1.6,m-1.6,A,P+1.6,m+1.6,A,m+4,m+6)}const i=o.P,z=Math.atan2(i[0].z-i[1].z,i[0].x-i[1].x),M=Math.atan2(i[1].z-i[2].z,i[1].x-i[2].x);e.set({grp:fe,rank:j,col:ee,style:D}),e.circle([i[1].x,.2,i[1].z],c,p,o.step,96,.04,.16,z,z+o.sgn0*Math.PI*2),e.set({rank:q}),e.seg(i[1].x-5,.2,i[1].z,i[1].x+5,.2,i[1].z,.035,.04),e.seg(i[1].x,.2,i[1].z-5,i[1].x,.2,i[1].z+5,.035,.04),e.set({rank:O,col:K,style:L,fade:.55}),e.circle([i[2].x,.2,i[2].z],c,p,o.step,48,.25,.4,M,M+o.sgn1*Math.PI),e.set({style:D,fade:U}),u.hoistLine&&(e.set({rank:q,col:ee,style:oe}),e.poly(o.fly.map(r=>[r.x,r.y+3.2,r.z]),.3,.42),e.set({style:D}))}function Ce(e,f){const a=(c,h,p,d=[-1,-.5])=>{e.seg(-h,c,-p,h,c,-p,...d),e.seg(h,c,-p,h,c,p,...d),e.seg(h,c,p,-h,c,p,...d),e.seg(-h,c,p,-h,c,-p,...d)},o=[1,0,0],g=[0,1,0],u=[0,0,1];for(const c of[he,xe]){e.set({grp:c,col:ce,rank:j,style:D,hidden:!1,fade:U,wScale:2});const h=46,p=289,d=3,T=1.3;for(const l of[-1,1])for(const b of[-1,1])e.set({rank:b>0?j:q}),e.seg(l*d,h,b*T,l*d,X,b*T),e.seg(l*d,X,b*T,l*d,p,b*T),e.seg(l*d,h,b*T,l*1.1,27,b*.7);e.set({rank:q,wScale:1.6});const B=16;for(let l=0;l<=B;l++)a(W(h,p,l/B),d,T);a(27,1.1,.7),a(31,1.5,.85),e.set({rank:O,wScale:1.6});for(let l=0;l<B;l++)for(const b of[-1,1]){const t=W(h,p,l/B),k=W(h,p,(l+1)/B),n=l%2?1:-1;e.seg(-d*n,t,b*T,d*n,k,b*T)}e.set({rank:q}),e.circle([d+6.5,112,0],o,g,6.5,20),e.circle([d+6.5,112,0],o,g,2.2,10),e.set({rank:O});for(let l=0;l<12;l++){const b=l/12*Math.PI*2,t=Math.cos(b),k=Math.sin(b);e.seg(d+6.5+t*5.2,112+k*5.2,0,d+6.5+t*6.5,112+k*6.5,0)}if(e.seg(-d,112,0,d+.5,112,0),e.set({rank:q}),e.circle([0,X,0],o,g,4.6,14),e.circle([0,X,0],o,g,1.4,8),c===he)e.set({rank:j,wScale:1.6}),e.seg(0,0,0,0,27,0),e.set({rank:q}),e.seg(-.9,9,0,.9,9,0),e.seg(-.7,27,0,0,3,0),e.seg(.7,27,0,0,3,0);else{e.set({rank:q,wScale:1.6}),a(22,1.3,.8),a(16,1.2,.75);for(const l of[-1,1])e.seg(l*1.2,16,0,l*1.1,27,0);e.seg(1.3,19,0,4.2,19,0),e.circle([4.2,19,0],o,g,1.3,8),e.set({rank:j,col:ee,wScale:1.8}),e.seg(0,0,0,0,16,0),e.set({rank:q}),e.seg(-.85,16,0,0,.5,0),e.seg(.85,16,0,0,.5,0)}}e.set({grp:ye,col:ce,rank:j,wScale:2});for(const c of[-1.7,1.7])e.set({rank:j}),e.circle([0,0,c],o,g,10.5,28),e.set({rank:q}),e.circle([0,0,c],o,g,7.2,22),e.circle([0,0,c],o,g,2.1,10),e.seg(-1.5,-1.5,c,1.5,1.5,c);e.set({rank:O,wScale:1.6});for(let c=0;c<20;c++){const h=c/20*Math.PI*2,p=Math.cos(h),d=Math.sin(h);e.seg(p*10.5,d*10.5,-1.7,p*10.5,d*10.5,1.7)}e.set({rank:j,wScale:1.8});for(const c of[-1,1])e.seg(c*2.6,10,0,c*2.6,44,0),e.seg(0,10,c*2.6,0,44,c*2.6);e.set({rank:O,wScale:1.6});for(let c=12;c<=42;c+=2.5)e.circle([0,c,0],o,u,2.6,8);e.set({rank:q}),e.circle([0,44,0],o,u,3.4,10),e.circle([0,10,0],o,u,3.6,10),e.circle([0,48.5,0],o,g,4.2,14),e.circle([0,48.5,0],u,g,4.2,14),e.set({wScale:1})}function Be(e){for(let f=0;f<4;f++){e.set({grp:be,col:Y,rank:j,style:D,hidden:!1,fade:U,extra:f,wScale:1.25}),e.seg(0,0,0,0,12,0),e.seg(0,9,0,14,15,0),e.set({wScale:1.1}),e.seg(0,12,0,14,15,0),e.seg(0,12,0,-4.5,7.5,0),e.seg(-4.5,7.5,0,0,6,0),e.seg(-1.6,0,0,1.6,0,0),e.set({rank:q,wScale:1.2}),e.seg(14,15,0,14,3.5,0),e.seg(13.2,3.5,0,14.8,3.5,0);for(let a=1;a<6;a++){const o=a/6;e.seg(14*o,W(9,15,o),0,14*(o+.08),W(12,15,o+.08),0)}}e.set({extra:0,wScale:1})}function Ee(e,f){const a=f.round?le:re,o=f.round?6:1;for(const u of[0,1,2]){e.set({grp:ke,col:u?ce:Y,rank:j,style:D,hidden:!1,fade:U,extra:u,wScale:u?2.6:1.6});for(let c=0;c<4;c++)for(let h=0;h<o;h++){const p=a(c,1,-1+2*h/o),d=a(c,1,-1+2*(h+1)/o);e.seg(p[0],0,p[1],d[0],0,d[1],(c+h/o)/4,(c+(h+1)/o)/4)}}e.set({grp:Pe,col:Y,rank:q,style:D,hidden:!1,fade:U,extra:0,wScale:2});let g=0;for(let u=0;u<4;u++)for(const c of[-1,-.5,0,.5]){const h=a(u,.985,c*.985),p=4.5+3.5*(g*7%5)/4;e.seg(h[0],0,h[1],h[0],p,h[1],g*.618%1,0),g++}e.set({extra:0,wScale:1,grp:se})}function me(e,f){const a=new w.InstancedBufferGeometry;a.setAttribute("position",new w.BufferAttribute(new Float32Array([0,-1,0,1,-1,0,1,1,0,0,1,0]),3)),a.setIndex([0,1,2,0,2,3]);const o=new w.InstancedInterleavedBuffer(e,14);return a.setAttribute("aA",new w.InterleavedBufferAttribute(o,3,0)),a.setAttribute("aB",new w.InterleavedBufferAttribute(o,3,3)),a.setAttribute("aS",new w.InterleavedBufferAttribute(o,4,6)),a.setAttribute("aT",new w.InterleavedBufferAttribute(o,4,10)),a.instanceCount=f,a.boundingSphere=new w.Sphere(new w.Vector3(0,400,0),1400),a}const Ie=`
  attribute vec3 aA, aB; attribute vec4 aS, aT;
  uniform float uF, uU, uTime, uHidden, uRound, uBow, uGhost; uniform vec2 uRes; uniform mat4 uM[3]; uniform vec3 uTier[6]; uniform vec3 uCol[5];
  varying float vS, vLen, vEdge, vHalf, vStyle, vTip, vAlpha, vMpp, vCrawl, vHead; varying vec3 vCol;
  #include <fog_pars_vertex>
  float halfAt(float y) { float h = uTier[0].z; for (int i = 1; i < 6; i++) h = mix(h, uTier[i].z, step(uTier[i].x, y)); return h; }
  void main() {
    float grp = aS.w, rank = floor(aS.y / 4. + 0.01), style = aS.y - rank * 4.;
    float P = grp < 0.5 ? uF : uU;
    float p = clamp((P - aT.x) / max(aT.y - aT.x, 1e-4), 0., 1.);
    vec3 A = aA, B = aB; float alpha = 1.;
    if (grp > 1.5 && grp < 4.5) {
      mat4 M = grp < 2.5 ? uM[0] : (grp < 3.5 ? uM[1] : uM[2]);
      if (grp < 3.5) {
        // the legs' knee joints open outwards (uBow metres at the knee), so the two legs stand apart on screen
        // even when their points are only the ring's radius from each other
        A.x += uBow * (A.y < ${X.toFixed(4)} ? A.y / ${X.toFixed(4)} : (300. - A.y) / ${(300-X).toFixed(4)});
        B.x += uBow * (B.y < ${X.toFixed(4)} ? B.y / ${X.toFixed(4)} : (300. - B.y) / ${(300-X).toFixed(4)});
      }
      A = (M * vec4(A, 1.)).xyz; B = (M * vec4(B, 1.)).xyz; p = 1.;
    } else if (grp > 6.5) {
      // column stubs pulled up from the slab in hand, each with its travelling tip
      float h = halfAt(uF - 0.35);
      A = vec3(A.x * h, uF - 0.3, A.z * h); B = vec3(B.x * h, uF - 0.3 + B.y, B.z * h);
      alpha = smoothstep(1., 6., uF) * (1. - smoothstep(548., 556., uF));
      p = 0.25 + 0.74 * fract(uF / 22.8 + aT.x);
    } else if (grp > 5.5) {
      // the slab outline at the draw-front; the stroke in hand goes once round for every four floors
      float h = halfAt(uF - 0.35);
      A = vec3(A.x * h, uF - 0.3, A.z * h); B = vec3(B.x * h, uF - 0.3, B.z * h);
      alpha = smoothstep(1., 6., uF) * (1. - smoothstep(556., 561., uF));
      p = 1.;
      if (aT.w > 0.5) { p = clamp((fract(uF / 15.2 + 0.5 * step(1.5, aT.w)) - aT.x) / max(aT.y - aT.x, 1e-4), 0., 1.); if (p >= 0.9999) alpha = 0.; }
    } else if (grp > 4.5) {
      // derricks: stand on the newest floor at the corners, hop floor to floor, slew the jib
      float i = aT.w, yq = floor(uF / 3.8) * 3.8, hop = fract(uF / 3.8);
      float hT = halfAt(yq - 2.), big = mix(1., 1.5, smoothstep(20., 45., hT));    // larger on the wide lower tiers
      A *= big; B *= big;
      float h = (hT - 3.) * mix(1., 0.7071, uRound);
      // (the jib works over the slab, slewing 80 degrees either side of the diagonal: it never swings out at the cage)
      float ang = i * 1.5708 + 3.927 + 1.1 * sin(uTime * 0.6 + i * 2.1) + 0.3 * sin(uTime * 1.7 + i);
      float c = cos(ang), s = sin(ang);
      vec3 base = vec3((i < 0.5 || i > 2.5 ? 1. : -1.) * h, yq, (i < 1.5 ? 1. : -1.) * h);
      base.y += 1.4 * sin(min(hop * 2., 1.) * 3.1416);
      A = base + vec3(A.x * c - A.z * s, A.y, A.x * s + A.z * c);
      B = base + vec3(B.x * c - B.z * s, B.y, B.x * s + B.z * c);
      p = 1.; alpha = smoothstep(4., 12., uF) * (1. - smoothstep(548., 556., uF));
    }
    float span = grp < 0.5 ? 26. : 0.035;
    if (grp < 5.5) alpha *= 1. - 0.9 * smoothstep(aT.z, aT.z + span, P);
    vec3 E = mix(A, B, p);
    vec4 vA = modelViewMatrix * vec4(A, 1.), vE = modelViewMatrix * vec4(E, 1.);
    float nearZ = -0.4;
    bool cull = p <= 0. || alpha <= 0.003 || (vA.z > nearZ && vE.z > nearZ);
    if (vA.z > nearZ) vA = mix(vE, vA, (nearZ - vE.z) / max(vA.z - vE.z, 1e-4));
    else if (vE.z > nearZ) vE = mix(vA, vE, (nearZ - vA.z) / max(vE.z - vA.z, 1e-4));
    vec4 cA = projectionMatrix * vA, cE = projectionMatrix * vE;
    vec2 sA = cA.xy / max(cA.w, 1e-4) * uRes * 0.5, sE = cE.xy / max(cE.w, 1e-4) * uRes * 0.5;
    vec2 d = sE - sA; float dl = length(d); d = dl > 1e-3 ? d / dl : vec2(1., 0.);
    vec2 nrm = vec2(-d.y, d.x);
    vec4 mv = mix(vA, vE, position.x);
    vec4 c4 = mix(cA, cE, position.x);
    float w = max(c4.w, 1e-3);
    float pxPerM = uRes.y * 0.5 * projectionMatrix[1][1] / w;
    float wpx = aS.x * pxPerM;
    float minPx = rank < 0.5 ? 2.0 : (rank < 1.5 ? 1.5 : 1.15);
    bool cream = aS.z > 1.5 && aS.z < 2.5;
    if (cream) minPx = rank < 0.5 ? 3.0 : (rank < 1.5 ? 1.8 : 1.15);   // the compass must stay an instrument at 300 m
    float wd = max(wpx, minPx);
    // lines thinner than their minimum keep their width but give up brightness, so facades never fuse to white
    float thin = clamp(wpx / minPx, 0., 1.);
    float dim = rank < 0.5 ? clamp(thin * 2.4, 0.46, 1.) : (rank < 1.5 ? clamp(thin * 2.2, 0.05, 1.) : clamp(thin * 2.2, 0.03, 1.));
    if (aS.z > 0.5 && aS.z < 1.5) dim = max(dim, 0.6);      // sparse construction lines keep their strength: the ghost must read from afar
    if (cream) dim = max(dim, rank < 0.5 ? 0.9 : (rank < 1.5 ? 0.5 : 0.2));
    alpha *= dim;
    // tower detail gives way when its neighbours close up on screen (aT.w = spacing in metres, negative for
    // horizontal lines, whose spacing is foreshortened when we look down the face): the fill's tone takes over
    if (grp < 0.5 && abs(aT.w) > 0.01) {
      float sp = abs(aT.w) * pxPerM;
      if (aT.w < 0.) { vec3 vd = normalize((modelMatrix * vec4(E, 1.)).xyz - cameraPosition + vec3(0., 1e-4, 0.)); sp *= sqrt(max(1. - vd.y * vd.y, 0.)); }
      alpha *= mix(rank < 0.5 ? 0.3 : 0., 1., smoothstep(4.5, 13., sp));
    }
    float dist = -mv.z;
    if (rank > 1.5) alpha *= 1. - 0.6 * smoothstep(900., 2600., dist);
    // close to the cage the tower's detail steps back, so the slab outline and the tick row carry the foreground
    float nearK = mix(0.3, 1., smoothstep(12., 28., dist)) * (rank > 1.5 ? mix(0.55, 1., smoothstep(30., 90., dist)) : 1.);
    if (grp < 0.5 && rank > 0.5) alpha *= nearK;
    float hw = wd * 0.5 + 1.0;
    c4.xy += (nrm * position.y * hw + d * (position.x * 2. - 1.) * min(wd * 0.5, 2.)) / (uRes * 0.5) * w;
    gl_Position = cull ? vec4(2., 2., 2., 1.) : c4;
    vEdge = position.y * hw; vHalf = wd * 0.5;
    vLen = length(B - A) * p; vS = position.x * vLen;
    vStyle = uHidden > 0.5 ? 1. : style;
    vTip = (p < 0.999 && (grp < 1.5 || grp > 5.5)) ? 1. : 0.;
    // the stroke in hand at the draw-front (cream, the instrument's line) ends in a red head: the pen's point
    vHead = (grp > 5.5 && grp < 6.5 && aT.w > 0.5) ? 1. : 0.;
    vCrawl = (uHidden < 0.5 && style > 0.5) ? 1. : 0.;
    // (hidden edges are a near thing: far below us they would stack into grey bands seen through the slab)
    float hid = 0.2 * (1. - smoothstep(60., 150., dist)) * nearK * mix(0.4, 1., smoothstep(90., 130., dist));
    // of the tower only the few floors just under the draw-front show through: further down, the dashes of floor
    // after floor line up into bands
    if (grp < 0.5) hid *= 1. - smoothstep(8., 34., uF - mix(A.y, E.y, position.x));
    vAlpha = alpha * (uHidden > 0.5 ? hid : 1.);
    vMpp = 1. / max(pxPerM, 1e-4);
    vCol = uCol[int(aS.z + 0.5)];
    if (grp > 0.5 && grp < 1.5 && aS.z > 0.5 && aS.z < 1.5) vCol *= uGhost;     // the idea of the tower, firmer when the world asks
    vec4 mvPosition = mv;
    #include <fog_vertex>
  }`,He=`
  uniform float uTime; uniform vec3 uHeadCol;
  varying float vS, vLen, vEdge, vHalf, vStyle, vTip, vAlpha, vMpp, vCrawl, vHead; varying vec3 vCol;
  #include <fog_pars_fragment>
  void main() {
    float a = vAlpha * (1. - smoothstep(vHalf - 0.45, vHalf + 0.75, abs(vEdge)));
    if (vStyle > 0.5) {
      // dashes cut by arc length; the period doubles with distance so a dash never falls under ~5 px.
      // Drawn dashes (construction and centre-lines) creep along their line: the hand is still at work.
      float base = vStyle > 1.5 ? 5.0 : 2.6;
      float per = base * exp2(max(0., ceil(log2(max(vMpp * 9. / base, 1e-3)))));
      float f = fract((vS - vCrawl * uTime * 0.22 * per) / per);
      float on = vStyle > 1.5 ? max(step(f, 0.58), step(0.74, f) * step(f, 0.84)) : step(f, 0.6);
      a *= on;
    }
    if (a < 0.004) discard;
    // the travelling tip: the last 3 m (never less than ~5 px) of a line still being ruled is brighter
    float tip = vTip * (1. - smoothstep(0., max(3. + 5. * vHead, vMpp * (5. + 5. * vHead)), vLen - vS));
    vec3 col = mix(vCol * (1. + 1.7 * tip), uHeadCol, vHead * smoothstep(0.15, 0.6, tip));
    gl_FragColor = vec4(col, a);
    #include <fog_fragment>
  }`;function ve(e,f){return new w.ShaderMaterial({vertexShader:Ie,fragmentShader:He,fog:!0,transparent:!0,depthWrite:!1,depthTest:!0,depthFunc:f?w.GreaterDepth:w.LessEqualDepth,uniforms:{...w.UniformsUtils.clone(w.UniformsLib.fog),uF:e.uF,uU:e.uU,uTime:e.uTime,uRes:e.uRes,uM:e.uM,uTier:e.uTier,uCol:e.uCol,uRound:e.uRound,uBow:e.uBow,uGhost:e.uGhost,uHeadCol:e.uHeadCol,uHidden:{value:f?1:0}}})}function qe(e,f,a,o){const g=[],u=[],c=[],h=[],p=(l,b,t)=>{const k=g.length/3;for(const n of l)g.push(n[0],n[1],n[2]),u.push(b[0],b[1],b[2]),c.push(t[0],t[1],t[2],n[3]);h.push(k,k+1,k+2,k,k+2,k+3)};e.forEach((l,b)=>{const t=l.half-.6,k=e[b+1]?e[b+1].half:0,n=[l.y0,l.y1,k];if(o){const A=g.length/3;for(let z=0;z<4;z++)for(let M=0;M<=6;M++){const r=le(z,t,-t+2*t*M/6);for(const m of[0,1])g.push(r[0],m?l.y1:l.y0,r[1]),u.push(r[0]/t,0,r[1]/t),c.push(n[0],n[1],n[2],m)}for(let z=0;z<4;z++)for(let M=0;M<6;M++){const r=A+(z*7+M)*2;h.push(r,r+2,r+3,r,r+3,r+1)}const i=g.length/3;for(let z=0;z<24;z++){const M=z/24*Math.PI*2;g.push(Math.sin(M)*t,l.y1,Math.cos(M)*t),u.push(0,1,0),c.push(n[0],n[1],n[2],1)}for(let z=1;z<23;z++)h.push(i,i+z,i+z+1);return}for(let P=0;P<4;P++){const A=pe(P,t,-t),i=pe(P,t,t);p([[A[0],l.y0,A[1],0],[i[0],l.y0,i[1],0],[i[0],l.y1,i[1],1],[A[0],l.y1,A[1],1]],[Q[P][0],0,Q[P][1]],n)}p([[-t,l.y1,t,1],[t,l.y1,t,1],[t,l.y1,-t,1],[-t,l.y1,-t,1]],[0,1,0],n)});const d=new w.BufferGeometry;d.setAttribute("position",new w.Float32BufferAttribute(g,3)),d.setAttribute("normal",new w.Float32BufferAttribute(u,3)),d.setAttribute("aTier",new w.Float32BufferAttribute(c,4)),d.setIndex(h),d.boundingSphere=new w.Sphere(new w.Vector3(0,300,0),320);const T=new w.ShaderMaterial({fog:!0,side:w.DoubleSide,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:4,uniforms:{...w.UniformsUtils.clone(w.UniformsLib.fog),uF:f.uF,uP0:{value:a[0]},uP1:{value:a[1]},uP2:{value:a[2]},uInk:{value:a[3]},uCons:{value:a[4]},uCream:{value:a[5]},uNight:f.uNight,uRound:f.uRound},vertexShader:`
      attribute vec4 aTier; uniform float uF;
      varying vec3 vP, vN, vWP; varying float vNext, vTop, vOpen, vHalfT, vTierY;
      #include <fog_pars_vertex>
      void main() {
        vec3 p = position;
        float top = clamp(uF - 0.35, aTier.x, aTier.y);
        if (aTier.w > 0.5) p.y = top;
        if (uF - 0.35 <= aTier.x) p = vec3(0., aTier.x, 0.);
        vP = p; vN = normal; vNext = aTier.z; vTop = top; vOpen = step(top, aTier.y - 0.05); vHalfT = length(position.xz); vTierY = aTier.y;
        vWP = (modelMatrix * vec4(p, 1.)).xyz;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uP0, uP1, uP2, uInk, uCons, uCream; uniform float uF, uNight, uRound;
      varying vec3 vP, vN, vWP; varying float vNext, vTop, vOpen, vHalfT, vTierY;
      #include <fog_pars_fragment>
      float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      // 45 degree hatching whose spacing doubles with distance (octaves cross-fade, lines stay ~6 px apart)
      float hatch(float q, float fw) {
        float base = 1.3, lv = log2(max(9. * fw / base, 1.)), l0 = floor(lv), fr = lv - l0;
        float s0 = base * exp2(l0), s1 = s0 * 2.;
        float d0 = abs(fract(q / s0 + 0.5) - 0.5) * s0, d1 = abs(fract(q / s1 + 0.5) - 0.5) * s1;
        float w = fw * 0.75;
        float h0 = 1. - smoothstep(w * 0.5, w * 1.5, d0), h1 = 1. - smoothstep(w * 0.5, w * 1.5, d1);
        return mix(h0, h1, smoothstep(0.35, 1., fr));
      }
      float rule(float d, float fw) { return 1. - smoothstep(fw * 0.6, fw * 1.6, abs(d)); }
      void main() {
        vec3 n = normalize(vN);
        bool cap = n.y > 0.5;
        float rad = max(length(vP.xz), 1e-3);
        // along-the-wall coordinate: straight faces, or the arc of a drum
        float t = uRound > 0.5 ? atan(vP.x, vP.z + (abs(vP.x) + abs(vP.z) < 1e-5 ? 1e-5 : 0.)) * rad : (abs(n.x) > 0.5 ? vP.z : vP.x);
        vec2 fc = cap ? vP.xz : vec2(t, vP.y);
        float q1 = (fc.x + fc.y) * 0.7071, q2 = (fc.x - fc.y) * 0.7071;
        vec3 fP = fwidth(vP);
        float fwW = max(max(fwidth(q1), fwidth(q2)), 1e-4), fwR = max((fP.x + fP.y + fP.z) * 0.6, 1e-4);
        float fw = (uRound > 0.5 && !cap) ? fwR : fwW;     // (the arc coordinate has a seam: use the position's own derivative)
        float mx = (uRound > 0.5 && !cap) ? vP.x - vP.z : fc.x;
        float mott = 0.5 + 0.25 * sin(mx * 0.021 + 1.3) * sin(fc.y * 0.017 + vP.z * 0.01) + 0.25 * sin(mx * 0.11 + fc.y * 0.07);
        float grain = hash(floor(vec2(mx, fc.y) * 3.)) - 0.5;
        // the conventional light falls from the upper left: faces turned from it (+X and -Z here) are hatched
        float shaded = cap ? 0. : smoothstep(0.2, 0.45, (n.x - n.z) * 0.7071);
        // a flat wash: faces to the light are pale, faces turned from it are the dark of the sheet, so the near face
        // is a tone and not a cage to be seen through; far below us the finished tower pales with distance
        float dC = length(vWP - cameraPosition);
        vec3 paper = cap ? mix(uP1, uP2, 0.26) : mix(mix(uP1, uP2, 0.45), uP0, shaded);
        paper *= 0.92 + 0.14 * mott + 0.05 * grain;
        paper = mix(paper, uP2, 0.45 * smoothstep(250., 1200., dC));
        float ink = 0.;
        vec3 col = paper;
        if (cap) {
          // terraces: cast shade of the tier above, cross-hatched
          float foot = uRound > 0.5 ? rad : max(abs(vP.x), abs(vP.z));
          float sh = step(abs(vP.x + vP.z), 2. * vNext) * step(-vNext, vP.x) * step(vP.z, vNext) * step(0.5, vNext);
          sh *= step(foot, 400.) * step(vNext, foot);
          ink = sh * max(hatch(q1, fwW), hatch(q2, fwW)) * step(0.01, uF - 3. - vTop) * (1. - vOpen);
          col = mix(paper, uInk * 0.6, ink * 0.6);
          // the slab in hand is a floor plan being drafted: the column grid in construction blue with a column
          // square at every node, the core in a double-ruled wall, cross-hatched, with its lift banks and stair, a
          // corridor round it and partitions out to the edge, an upstand and a margin line inside the edge, and the
          // footprint of the next setback set out in dashes
          vec2 f2 = max(fwidth(vP.xz), vec2(1e-4)); float f1 = max(f2.x, f2.y);
          vec2 gd = abs(fract(vP.xz / 6. + 0.5) - 0.5) * 6., gd2 = abs(fract(vP.xz / 12. + 0.5) - 0.5) * 12.;
          float grid = max(rule(gd.x, f2.x), rule(gd.y, f2.y)) * (1. - smoothstep(0.5, 1.6, f1));
          float hE = uRound > 0.5 ? vHalfT : vHalfT * 0.7071;           // the slab's half-width
          float ch = uRound > 0.5 ? vHalfT * 0.34 : vHalfT * 0.24;      // the core's
          float core = foot - ch;
          float fcr = max(fwidth(core), 1e-4);
          float coreL = max(rule(core, fcr * 1.3), rule(core + 0.9, fcr));
          float dg = min(abs(vP.x - vP.z), abs(vP.x + vP.z)) * 0.7071;
          float diag = rule(dg, max(fwidth(dg), 1e-4)) * step(core, 0.) * step(fract((vP.x + vP.z) * 0.25), 0.6);
          float marg = foot - hE + 2.4;
          float margL = max(rule(marg, fcr) * 0.7, rule(marg - 1.5, fcr) * 0.5);
          float stair = step(core, -1.) * rule(abs(fract(vP.x / 1.1 + 0.5) - 0.5) * 1.1, f2.x) * step(abs(vP.z), 2.2) * (1. - smoothstep(0.15, 0.5, f2.x));
          // columns: a small square at every node of the grid when near (every second node further off)
          float near1 = 1. - smoothstep(0.35, 1.1, f1), nearC = 1. - smoothstep(60., 95., dC);
          float colSq = mix(rule(max(gd2.x, gd2.y) - 0.75, f1), rule(max(gd.x, gd.y) - 0.6, f1), nearC) * step(0.5, core) * step(marg, -0.5) * near1;
          // lift shafts: two banks of cars inside the core
          float bz = abs(abs(vP.z) - ch * 0.6) - ch * 0.22, bx = abs(vP.x) - ch * 0.72, bank = max(bz, bx);
          float cw = max(ch * 0.36, 0.5);
          float lift = max(rule(bank, f1), rule((0.5 - abs(fract(vP.x / cw) - 0.5)) * cw, f2.x) * step(bank, 0.)) * step(core, -0.3) * near1;
          float liftX = rule(abs(abs(fract(vP.x / cw) - 0.5) * cw - abs(abs(vP.z) - ch * 0.6) * (cw / max(ch * 0.44, 0.1))), f1 * 1.2) * step(bank, 0.) * step(core, -0.3) * near1;
          // the core's walls are poche: cross-hatched between the shafts
          float coreHat = max(hatch(q1, fwW), hatch(q2, fwW)) * step(core, -0.9) * step(0.3, bank) * step(2.6, abs(vP.z));
          // a corridor round the core, and partitions from it out to the margin, one every other bay
          float corr = core - 3.2;
          float corrL = rule(corr, fcr) * step(marg, -1.);
          float part = (abs(vP.z) > abs(vP.x) ? rule(gd2.x, f2.x) : rule(gd2.y, f2.y)) * step(0., corr) * step(marg, 0.) * (1. - uRound) * (1. - smoothstep(0.5, 1.6, f1));
          // the next setback's footprint, dashed
          float sb = foot - vNext;
          float along = uRound > 0.5 ? atan(vP.x, vP.z + (abs(vP.x) + abs(vP.z) < 1e-5 ? 1e-5 : 0.)) * vNext : (abs(vP.x) > abs(vP.z) ? vP.z : vP.x);
          float setL = rule(sb, fcr * 1.3) * step(fract(along / 3.2), 0.55) * step(0.5, vNext) * step(vNext, hE - 3.5);
          col = mix(col, uCons * 0.75, clamp(max(grid * 0.26, coreHat * 0.42), 0., 1.) * vOpen);
          col = mix(col, uCons * 1.25, setL * 0.8 * vOpen);
          float white = max(max(max(coreL, margL), max(diag * 0.6, stair * 0.6)), max(max(colSq * 0.85, lift * 0.75), max(liftX * 0.45, max(corrL * 0.5, part * 0.42))));
          col = mix(col, uInk * 1.05, clamp(white, 0., 1.) * 0.8 * vOpen);
        } else {
          // hatching falls down the shaded faces just behind the front, with a ragged leading edge
          float edge = uF - 2. - 4. * (0.5 + 0.5 * sin(q1 * 0.83) * sin(q1 * 0.29 + 2.));
          float hatchInk = shaded * hatch(q1, fw) * smoothstep(0., 2.5, edge - vP.y);
          ink = 0.;
          // where the ruled floors and ticks have closed up on screen, their tone is carried here instead
          float fy = max(fP.y, 1e-4);
          float fl = abs(fract(vP.y / 3.8 + 0.5) - 0.5) * 3.8;
          float far = smoothstep(0.9, 2.0, fy);
          float tone = mix((1. - smoothstep(fy * 0.5, fy * 1.5, fl)) * 0.5 * smoothstep(0.45, 0.9, fy), 0.2, far) * step(vP.y, uF - 3.);
          ink = max(ink, tone * (1. - 0.6 * uNight));
          col = mix(paper, uInk * 0.6, ink);
          // (the hatching is ruled in construction blue, well under the white outline: shade, not more line)
          // Near the cage it is ruled firmly in pale ink; far below it sinks to a tone. Under the edge of each
          // finished terrace a second direction crosses it: cast shade
          float nearH = 1. - smoothstep(180., 350., dC);
          float xh = hatch(q2, fw) * smoothstep(vTierY - 12., vTierY - 9., vP.y) * step(vTierY, uF - 3.) * mix(0.75, 1., shaded);
          col = mix(col, mix(uCons * 0.85, uInk * 0.75, nearH), max(hatchInk, xh) * mix(0.45, 0.7, nearH));
        }
        if (uNight > 0.5 && !cap) {
          // night shift: window squares fill in a second behind the draw-front
          vec2 wc = vec2(t / 3.2, vP.y / 3.8), id = floor(wc), wf = abs(fract(wc) - 0.5);
          float wfw = max(fwidth(wc.x), fwidth(wc.y));
          float sq = (1. - smoothstep(0.22 - wfw, 0.22 + wfw, wf.x)) * (1. - smoothstep(0.26 - wfw, 0.26 + wfw, wf.y));
          // once the squares close up on screen their random lighting goes to its mean, or it turns to pixel noise
          float wk = smoothstep(0.14, 0.5, wfw);
          // near to, a lit window is drawn: ruled outline, mullion cross, a thin wash inside
          float inner = (1. - smoothstep(0.18 - wfw, 0.18 + wfw, wf.x)) * (1. - smoothstep(0.215 - wfw, 0.215 + wfw, wf.y));
          float mull = max(1. - smoothstep(wfw * 0.5, wfw * 1.6 + 0.012, wf.x), 1. - smoothstep(wfw * 0.5, wfw * 1.6 + 0.012, wf.y));
          float drawn = sq * max(max(1. - inner, mull * 0.75), 0.3);
          sq = mix(drawn, sq, smoothstep(0.035, 0.08, wfw));
          sq = mix(sq, 0.14, wk);
          // (the face normal is rounded before it seeds the hash: an interpolated 0.9999 would turn into pixel noise)
          float rr = hash(id + (uRound > 0.5 ? vec2(0.) : floor(n.xz + 0.5) * 3.));
          float on = mix(step(0.3, rr), 0.7, wk) * smoothstep(0., 3., uF - 6. - 14. * mix(fract(rr * 7.3), 0.5, wk) - vP.y);
          vec3 wcol = mix(uCream, uCons * 1.15, mix(smoothstep(0.3, 0.7, fract(rr * 5.3)), 0.5, wk));
          col = mix(col, wcol * mix(0.8 + 0.45 * fract(rr * 13.7), 1.05, wk), sq * on * 0.85);
        }
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),B=new w.Mesh(d,T);return B.renderOrder=1,B.frustumCulled=!1,B}function Re(e,f){const a=new w.CircleGeometry(900,48);a.rotateX(-Math.PI/2);const o=new w.ShaderMaterial({fog:!0,transparent:!0,polygonOffset:!0,polygonOffsetFactor:4,polygonOffsetUnits:8,uniforms:{...w.UniformsUtils.clone(w.UniformsLib.fog),uP0:{value:f[0]},uP1:{value:f[1]},uP2:{value:f[2]},uInk:{value:f[4]}},vertexShader:`
      varying vec3 vP;
      #include <fog_pars_vertex>
      void main() { vP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uP0, uP1, uP2, uInk; varying vec3 vP;
      #include <fog_pars_fragment>
      float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
      float grid(vec2 p, float s, vec2 fw) { vec2 d = abs(fract(p / s + 0.5) - 0.5) * s; vec2 l = 1. - smoothstep(fw * 0.4, fw * 1.4, d); return max(l.x, l.y); }
      void main() {
        vec2 p = vP.xz; float r = length(p);
        vec2 fw = max(fwidth(p), vec2(1e-4)); float f = max(fw.x, fw.y);
        float mott = vnoise(p * 0.004) * 0.6 + vnoise(p * 0.013 + 7.) * 0.3 + vnoise(p * 0.06) * 0.1;
        vec3 col = mix(uP0, uP1, 0.1 + 0.55 * mott);
        col *= 0.94 + 0.12 * vnoise(p * 1.7) * (1. - smoothstep(0.3, 1.5, f));
        float minor = grid(p, 10., fw * 0.7) * (1. - smoothstep(0.4, 1.6, f)) * 0.1;
        float major = grid(p, 50., fw * 0.7) * (1. - smoothstep(3., 12., f)) * 0.17;
        col = mix(col, uInk * 0.5, max(minor, major));
        // an old fold: a pale ridge with a darker valley beside it
        float c1 = p.x + 318., c2 = p.y - 262.;
        float fold = exp(-c1 * c1 * 0.08) - 0.6 * exp(-(c1 - 2.5) * (c1 - 2.5) * 0.05) + exp(-c2 * c2 * 0.08) - 0.6 * exp(-(c2 + 2.5) * (c2 + 2.5) * 0.05);
        col *= 1. + 0.55 * fold * (1. - smoothstep(1.5, 6., f));
        gl_FragColor = vec4(col, 1. - smoothstep(700., 895., r));
        #include <fog_fragment>
      }`}),g=new w.Mesh(a,o);return g.position.y=-.3,g.renderOrder=0,g}function Ne(e){const f=new w.Vector3,a=new w.Vector3,o=new w.Vector3,g=new w.Vector3(0,1,0),u=new w.Vector3,c=new w.Vector3,h=new w.Vector3,p=new w.Vector3,d=new w.Vector3,T=new w.Vector3,B=new w.Vector3,l=new w.Vector3,b=new w.Vector3,t=e.P,k=e.C,n=(F,I,R)=>ae(F,I,R),P=(F,I,R,N)=>{const V=R.x-I.x,Z=R.z-I.z,$=Math.cos(N),ie=Math.sin(N);return F.set(I.x+V*$-Z*ie,0,I.z+V*ie+Z*$)},A=Math.atan2(t[2].z-t[3].z,t[2].x-t[3].x),i=A-255.6*Math.PI/180-(A-69.6*Math.PI/180),z=(F,I)=>{const R=n(0,.4,I),N=W(A,i,n(0,1,I)),V=W(e.step,e.sweepR,R);return F.set(t[3].x+Math.cos(N)*V,e.sweepY*R,t[3].z+Math.sin(N)*V)},M=new w.Vector3(175,300,-20),r=new w.Vector3(45,445,-100),m=new w.Vector3(.55,.75,.2),s=e.n.clone().multiplyScalar(.55).add(new w.Vector3(0,.5,0)).addScaledVector(new w.Vector3(-e.n.z,0,e.n.x).normalize(),.66),x=e.n.clone().multiplyScalar(Math.cos(1)).addScaledVector(e.e1,-.62*Math.sin(1)).addScaledVector(e.e2,.78*Math.sin(1)).normalize(),y=new w.Vector3,v=37;let E=0,C=0;const S=(F,I,R,N,V)=>F.set(0,0,0).addScaledVector(I,(1-V)*(1-V)).addScaledVector(R,2*V*(1-V)).addScaledVector(N,V*V);function H(F){if(o.copy(g),E=0,F<.235)f.copy(t[1]),P(a,t[1],t[0],e.sgn0*Math.PI*3*G((F-.04)/.18,0,1));else if(F<.42)a.copy(t[2]),P(f,t[2],t[1],e.sgn1*Math.PI*n(.25,.4,F)),f.y=26*Math.sin(Math.PI*n(.25,.4,F));else if(F<.635)f.copy(t[3]),z(a,G((F-.44)/.195,0,1));else if(F<.825){const I=G((F-.635)/.18,0,1),R=(1-Math.pow(1-I,1.7))*n(0,.12,I);S(f,t[3],M,k,R),z(u,1),c.copy(k).addScaledVector(e.e1,7),S(a,u,r,c,R),S(o,g,m,x,R).normalize(),E=v*n(.25,.95,I)}else{const I=Math.PI*2*G((F-.825)/.075,0,1),R=n(.955,1,F),N=620*R*R;f.copy(k).addScaledVector(s,N),a.copy(k).addScaledVector(e.e1,Math.cos(I)*(7+60*R)).addScaledVector(e.e2,Math.sin(I)*(7+60*R)).addScaledVector(s,N*1.04),o.copy(x),E=v}}function _(F,I,R=0){H(F),C=R,o.x+=.011*Math.sin(C*.83)+.005*Math.sin(C*2.1),o.z+=.011*Math.cos(C*.61),o.normalize(),p.copy(a).sub(f);const N=p.length();N<.001?p.set(1,0,0):p.multiplyScalar(1/N),d.copy(o).addScaledVector(p,-o.dot(p)),d.lengthSq()<1e-6&&d.set(0,1,0).addScaledVector(p,-p.y),d.normalize(),y.copy(d).lerp(o,1-ae(10,80,N)).normalize(),T.copy(f).add(a).multiplyScalar(.5).addScaledVector(y,Math.sqrt(Math.max(ne*ne-N*N*.25,1))),b.copy(p).cross(y).normalize(),l.copy(T).sub(f);const V=l.length()/ne;l.normalize(),B.copy(l).cross(b).negate(),I[0].makeBasis(B,l.multiplyScalar(V),b).setPosition(f),l.copy(T).sub(a);const Z=l.length()/ne;return l.normalize(),B.copy(l).cross(b),I[1].makeBasis(B,l.multiplyScalar(Z),b).setPosition(a),B.copy(y).cross(b),I[2].makeBasis(B,y,b).setPosition(T),T}return{apply:_,A:f,B:a,get bow(){return E}}}async function Ve(e,f={}){const a=e.rng.fork?e.rng.fork("drafted-city-hero"):e.rng,g=(f.palette&&f.palette.length>=7?f.palette:ge).map(v=>new w.Color(v)),u=Se(a),c={bay:a.range(5.4,7.2),pier:a.pick([2,3,4]),paired:a.chance(.5),belt:a.pick([3,4,4,5]),win:a.pick([0,1,1,2]),winW:a.range(.16,.26),braced:u.map((v,E)=>E>0&&a.chance(.4)),crown:a.pick([0,1]),buttress:a.chance(.5),arches:a.pick([5,7]),treeGap:a.range(7,11),plazaTrees:a.pick([36,44,52])};c.gothic=f.cast==="gothic",c.round=f.cast==="drums",c.round&&(c.buttress=!1,c.paired=!1);const h=Te(a,u),p=Me();Ae(p,a,u,c),await e.yield?.(),Fe(p,a,u,h,c,{hoistLine:!!f.hoistLine}),Ce(p,a),Be(p),Ee(p,c),await e.yield?.();const d=p.hid.length/14,T=d+p.vis.length/14,B=new Float32Array(T*14);B.set(p.hid,0),B.set(p.vis,p.hid.length);const l=[g[3].clone().multiplyScalar(1.6),g[4].clone().multiplyScalar(.62),g[5].clone().multiplyScalar(1.4),g[6].clone().multiplyScalar(2),g[3].clone().lerp(g[4],.35).multiplyScalar(.95)],b={uF:{value:0},uU:{value:0},uTime:{value:0},uRes:{value:new w.Vector2(800,450)},uM:{value:[new w.Matrix4,new w.Matrix4,new w.Matrix4]},uTier:{value:u.map(v=>new w.Vector3(v.y0,v.y1,v.half))},uCol:{value:l},uNight:{value:f.night?1:0},uRound:{value:c.round?1:0},uBow:{value:0},uGhost:{value:1},uHeadCol:{value:g[6].clone().multiplyScalar(2)}},t=new w.Group;t.name="drafted-city-hero";const k=qe(u,b,g,c.round);t.add(k),f.sheet!==!1&&t.add(Re(b,g));const n=me(B,T),P=me(B,d);P.setAttribute("aA",n.getAttribute("aA")),P.setAttribute("aB",n.getAttribute("aB")),P.setAttribute("aS",n.getAttribute("aS")),P.setAttribute("aT",n.getAttribute("aT"));const A=new w.Mesh(n,ve(b,!1));A.renderOrder=3,A.frustumCulled=!1;const i=new w.Mesh(P,ve(b,!0));i.renderOrder=2,i.frustumCulled=!1,t.add(i,A);const z=Ne(h);let M=f.progress??.63,r=null;const m=new w.Vector2;function s(){b.uU.value=M,b.uF.value=r??ue(M),z.apply(M,b.uM.value,b.uTime.value),b.uBow.value=z.bow}s();const x=(v,E,C,S,H,_)=>({position:new w.Vector3(v,E,C),target:new w.Vector3(S,H,_)}),y={portalSeat:{position:h.C.clone(),normal:h.n.clone(),radius:7},ringCentre:h.C.clone(),flyThrough:h.fly.map(v=>v.clone()),hoistStart:h.fly[0].clone(),viewpoints:{entry:x(0,10,520,0,300,0),climb:x(h.fly[7].x,h.fly[7].y,h.fly[7].z,0,h.fly[7].y-40,0),crown:x(h.S.x,h.S.y,h.S.z,h.C.x,h.C.y,h.C.z)},compassStand:h.P[3].clone(),scribed:{center:h.P[1].clone(),radius:h.step},plazaRadius:130,tiers:u.map(v=>({y0:v.y0,y1:v.y1,half:v.half})),round:c.round,drawFrontAt:ue};return{object:t,radius:330,height:600,center:new w.Vector3(0,290,0),anchors:y,ground:!1,groundY:0,setProgress(v){M=G(v,0,1),s()},setDrawFront(v){r=v??null,s()},setGhost(v){b.uGhost.value=v},get progress(){return M},update(v,E,C){b.uTime.value=E,s(),e.renderer&&(e.renderer.getDrawingBufferSize(m),m.x>0&&b.uRes.value.copy(m))},dispose(){P.dispose()}}}export{Ve as buildHero};
