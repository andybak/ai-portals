import*as m from"three";import{clamp as pt,lerp as ge,smoothstep as se}from"../kit/core.js";const ke=[-23,17,-176],Xe=[18.7,22.2,-203.1],ze=[0,29,-11],le=[-36,64,-243],te=[-36,64,-300],Ue={x0:.4234-4*.3246,x1:.4234,y0:-.5,y1:.47,W:.3246},ae=49.5,p={x0:-47,x1:30,z0:-296,z1:-242},G={x:34,z:-121.3,x0:14,x1:34,y0:18,y1:41},O={x:4,hw:6.5,y0:18,y1:46},V={x:-24.2,z:-291,hw:6,y0:53.6,y1:63.9},It=[.24,.5754,.933],Gt=.379,qe={x0:-50,x1:-24.5,z0:-124,z1:0,y0:18,y1:53.5},w0={x0:-19.5,x1:47,z0:-124,z1:0,y0:18,y1:50},_t={xa:-24.5,xb:-19.5},Ie={x0:-45.5,x1:-26.5,z0:-124,z1:-24},Ge=[-44.2,-26.1,-8],vt=[-260,-266,-272],Fe=[0,1,2,3].map(e=>[(Ge[e>>1]+Ge[(e>>1)+1])/2,(vt[e&1]+vt[(e&1)+1])/2]),_e=[-16.6,60.3,-142.8];let Ht=.8;const He=0,me=1,de=2,$t=3,ne=4,xt=5,P=0,g=1,H=2,wt=3;function $e(e,t,a,l,n,s,o,i=.3,f=6){const h=Math.min(e-a,l-e),r=Math.min(t-n,s-t),u=Math.abs(o)>.5?Math.min(h,r):Math.max(h,r),d=1-i*Math.exp(-Math.max(u,0)/f);return d*d}function bt(e,t,a,l,n){if(e===He){const s=Math.min(4.5-l,l+124,56-Math.abs(t));return Ht*(.36+.5*Math.max(Math.exp(-Math.max(s,0)/13),.9*Math.exp(-Math.max(4.5-l,0)/30)))}if(e===me)return(n>.5?.96:.45+.61*se(-6,40,a))*$e(t,l,-40,50,-230,-124,n,.5,11);if(e===de){const s=Math.min(t+19.5,(47-t)*.9);return(.34+.6*Math.exp(-Math.max(s,0)/16)-.2*se(32,50,a))*$e(t,l,-19.5,47,-124,0,n,.42,10)}return e===$t?(n>.5?.94:.4+.66*se(12,48,a))*$e(t,l,-50,-24.5,-124,0,n,.5,10):e===xt?.5+.48*Math.exp(-Math.max(-280-l,0)/9):a<51&&n<.5?.55+.5*se(-4,40,a):1.04}function U0(e,t,a){return a<4.5&&a>-124&&t<17&&Math.abs(e)<54?bt(He,e,t,a,1):a<=-124&&a>-230&&t<51?.9:a<0&&a>-124&&t>=17&&t<51&&e>-22?bt(de,e,t,a,0)/$e(e,a,-19.5,47,-124,0,0,.3,7)+.06:t>=51?1.02:.92}const Ke=4.2;function Je(){const e={pos:[],nor:[],dat:[],idx:[],n:0,mat:P,zone:me,floorY:0,cell:7};return e.light=(t,a,l,n,s,o)=>bt(e.zone,t,a,l,s)*(s>.5?1:s<-.5?.76:.89+.06*s+.1*o-.04*n),e.v=(t,a,l,n,s,o,i=1)=>{e.pos.push(t,a,l),e.nor.push(n,s,o);const f=a-e.floorY,h=s>.5?0:Math.exp(-Math.max(f,0)/9);return e.dat.push(e.mat,e.light(t,a,l,n,s,o)*Math.pow(i,2.6),h),e.n++},e.quad=(t,a,l,n,s,o={})=>{let i=a[0]-t[0],f=a[1]-t[1],h=a[2]-t[2],r=n[0]-t[0],u=n[1]-t[1],d=n[2]-t[2],c=f*d-h*u,v=h*r-i*d,z=i*u-f*r;const w=Math.hypot(c,v,z)||1;c/=w,v/=w,z/=w;let M=!1;s&&c*s[0]+v*s[1]+z*s[2]<0&&(M=!0,c=-c,v=-v,z=-z);const Y=Math.hypot(i,f,h),R=Math.hypot(r,u,d),T=o.nu||pt(Math.round(Y/e.cell),1,24),b=o.nv||pt(Math.round(R/e.cell),1,24),q=o.ao||null,L=e.n;for(let W=0;W<=b;W++){const C=W/b;for(let y=0;y<=T;y++){const U=y/T,S=(1-U)*(1-C),$=U*(1-C),re=U*C,X=(1-U)*C;let A=1;q&&(A=(1-q[0]*Math.exp(-C*R/Ke))*(1-q[1]*Math.exp(-(1-C)*R/Ke))*(1-q[2]*Math.exp(-U*Y/Ke))*(1-q[3]*Math.exp(-(1-U)*Y/Ke))),e.v(t[0]*S+a[0]*$+l[0]*re+n[0]*X,t[1]*S+a[1]*$+l[1]*re+n[1]*X,t[2]*S+a[2]*$+l[2]*re+n[2]*X,c,v,z,A)}}for(let W=0;W<b;W++)for(let C=0;C<T;C++){const y=L+W*(T+1)+C,U=y+1,S=y+T+2,$=y+T+1;M?e.idx.push(y,S,U,y,$,S):e.idx.push(y,U,S,y,S,$)}},e.tri=(t,a,l,n)=>{let s=a[0]-t[0],o=a[1]-t[1],i=a[2]-t[2],f=l[0]-t[0],h=l[1]-t[1],r=l[2]-t[2],u=o*r-i*h,d=i*f-s*r,c=s*h-o*f;const v=Math.hypot(u,d,c)||1;u/=v,d/=v,c/=v;let z=!1;n&&u*n[0]+d*n[1]+c*n[2]<0&&(z=!0,u=-u,d=-d,c=-c);const w=e.v(t[0],t[1],t[2],u,d,c),M=e.v(a[0],a[1],a[2],u,d,c),Y=e.v(l[0],l[1],l[2],u,d,c);z?e.idx.push(w,Y,M):e.idx.push(w,M,Y)},e.box=(t,a,l,n,s,o,i="xXyYzZ",f={})=>{const h=f.ao||[.22,0,0,0],r=u=>i.indexOf(u)>=0;r("x")&&e.quad([t,l,s],[t,l,o],[t,n,o],[t,n,s],[-1,0,0],{ao:h}),r("X")&&e.quad([a,l,s],[a,l,o],[a,n,o],[a,n,s],[1,0,0],{ao:h}),r("z")&&e.quad([t,l,s],[a,l,s],[a,n,s],[t,n,s],[0,0,-1],{ao:h}),r("Z")&&e.quad([t,l,o],[a,l,o],[a,n,o],[t,n,o],[0,0,1],{ao:h}),r("y")&&e.quad([t,l,s],[a,l,s],[a,l,o],[t,l,o],[0,-1,0]),r("Y")&&e.quad([t,n,s],[a,n,s],[a,n,o],[t,n,o],[0,1,0],f.top||{})},e.prism=(t,a,l,n=!0,s=[.22,0,0,0])=>{let o=0,i=0;for(const f of t)o+=f[0]/t.length,i+=f[1]/t.length;for(let f=0;f<t.length;f++){const h=t[f],r=t[(f+1)%t.length],u=(h[0]+r[0])/2-o,d=(h[1]+r[1])/2-i;e.quad([h[0],a,h[1]],[r[0],a,r[1]],[r[0],l,r[1]],[h[0],l,h[1]],[u,0,d],{ao:s})}if(n)for(let f=1;f<t.length-1;f++)e.tri([t[0][0],l,t[0][1]],[t[f][0],l,t[f][1]],[t[f+1][0],l,t[f+1][1]],[0,1,0])},e.cham=(t,a,l,n,s)=>[[t+s,l],[a-s,l],[a,l+s],[a,n-s],[a-s,n],[t+s,n],[t,n-s],[t,l+s]],e}const yt=e=>e==="z"?(t,a,l)=>[t,a,l]:(t,a,l)=>[l,a,t],gt=(e,t)=>e==="z"?[0,0,t]:[t,0,0];function J(e,t,a,l,n,s,o,i,f,h,r,u,d={}){const c=yt(t),v=(C,y)=>t==="z"?[C,y,0]:[0,y,C],z=d.n||14,w=(f+h)/2,M=(h-f)/2,Y=d.mat??P,R=d.soffit??g,T=d.ring??1.6,b=[];for(let C=0;C<=z;C++){const y=Math.PI*(1-C/z);b.push([w+M*Math.cos(y),r+u*Math.sin(y)])}const q=d.faces||"cC";for(const C of[0,1]){if(q.indexOf(C?"C":"c")<0)continue;const y=C?l:a,U=gt(t,C?1:-1);e.mat=Y,f-n>.01&&e.quad(c(n,o,y),c(f,o,y),c(f,i,y),c(n,i,y),U,{ao:[.22,0,0,0]}),s-h>.01&&e.quad(c(h,o,y),c(s,o,y),c(s,i,y),c(h,i,y),U,{ao:[.22,0,0,0]});for(let S=0;S<z;S++)e.quad(c(b[S][0],b[S][1],y),c(b[S+1][0],b[S+1][1],y),c(b[S+1][0],i,y),c(b[S][0],i,y),U,{nu:1});if(T>0){e.mat=g;const S=y+(C?.3:-.3),$=(X,A)=>[w+(X[0]-w)*A,r+(X[1]-r)*(1+(A-1)*M/Math.max(u,.1))],re=1+T/M;for(let X=0;X<z;X++){const A=b[X],ve=b[X+1],I=$(A,re),ie=$(ve,re);e.quad(c(A[0],A[1],S),c(ve[0],ve[1],S),c(ie[0],ie[1],S),c(I[0],I[1],S),U,{nu:1,nv:1}),e.quad(c(I[0],I[1],S),c(ie[0],ie[1],S),c(ie[0],ie[1],y),c(I[0],I[1],y),v(I[0]-w,I[1]-r),{nu:1,nv:1})}e.quad(c(f-T,o,S),c(f,o,S),c(f,r,S),c(f-T,r,S),U,{nu:1,ao:[.22,0,0,0]}),e.quad(c(h,o,S),c(h+T,o,S),c(h+T,r,S),c(h,r,S),U,{nu:1,ao:[.22,0,0,0]})}}e.mat=R;const L=a-(T>0&&q.indexOf("c")>=0?.3:0),W=l+(T>0&&q.indexOf("C")>=0?.3:0);for(let C=0;C<z;C++){const y=b[C],U=b[C+1],S=v(w-(y[0]+U[0])/2,r-(y[1]+U[1])/2-.01);e.quad(c(y[0],y[1],L),c(U[0],U[1],L),c(U[0],U[1],W),c(y[0],y[1],W),S,{nu:1,ao:[0,0,.12,.12]})}r-o>.01&&(e.quad(c(f,o,L),c(f,o,W),c(f,r,W),c(f,r,L),t==="z"?[1,0,0]:[0,0,1],{ao:[.22,0,0,0]}),e.quad(c(h,o,L),c(h,o,W),c(h,r,W),c(h,r,L),t==="z"?[-1,0,0]:[0,0,-1],{ao:[.22,0,0,0]})),e.mat=P}function Qe(e,t,a,l,n,s,o,i=18){for(let f=0;f<i;f++){const h=Math.PI*(1-f/i),r=Math.PI*(1-(f+1)/i),u=[t+a*Math.cos(h),l+n*Math.sin(h)],d=[t+a*Math.cos(r),l+n*Math.sin(r)];e.quad([u[0],u[1],s],[d[0],d[1],s],[d[0],d[1],o],[u[0],u[1],o],[t-(u[0]+d[0])/2,l-(u[1]+d[1])/2-.01,0],{nu:1,ao:[.1,.1,0,0]})}}function Ae(e,t,a,l,n,s,o=l){const i=l/2,f=o/2,h=e.mat;e.mat=g,e.prism(e.cham(t-i-.45,t+i+.45,a-f-.45,a+f+.45,.3),n,n+1.5),e.prism(e.cham(t-i-.2,t+i+.2,a-f-.2,a+f+.2,.3),n+1.5,n+2,!0,[0,0,0,0]),e.prism(e.cham(t-i,t+i,a-f,a+f,.4),n+2,s-1.6,!1,[.18,.2,0,0]),e.prism(e.cham(t-i-.25,t+i+.25,a-f-.25,a+f+.25,.25),s-1.6,s-1.2,!0,[0,0,0,0]),e.box(t-i-.25,t+i+.25,s-1.6,s-1.6,a-f-.25,a+f+.25,"y"),e.prism(e.cham(t-i-.55,t+i+.55,a-f-.55,a+f+.55,.2),s-1.2,s,!0,[0,0,0,0]),e.box(t-i-.55,t+i+.55,s-1.2,s-1.2,a-f-.55,a+f+.55,"y"),e.mat=h}function kt(e,t,a,l,n,s,o,i){const f=(s-l)/i,h=(o-n)/i,r=Math.sign(f),u=e.mat;for(let d=0;d<i;d++){const c=l+f*d,v=n+h*(d+1);e.mat=g,e.quad([t,v-h,c],[a,v-h,c],[a,v,c],[t,v,c],[0,0,-r],{nv:1,ao:[.3,0,0,0]}),e.quad([t,v,c],[a,v,c],[a,v,c+r*.5],[t,v,c+r*.5],[0,1,0],{nv:1}),e.mat=H,e.quad([t,v,c+r*.5],[a,v,c+r*.5],[a,v,c+f],[t,v,c+f],[0,1,0],{nv:1,ao:[0,.25,0,0]})}e.mat=u}function Se(e,t,a,l,n,s,o,i,f=null){const h=e.mat;e.mat=g;const r=f??n,u=f??o,d=Math.max(1,Math.round(Math.abs(s-l)/9));for(let c=0;c<d;c++){const v=c/d,z=(c+1)/d,w=ge(l,s,v),M=ge(l,s,z),Y=ge(n,o,v)+i,R=ge(n,o,z)+i,T=ge(r,u,v),b=ge(r,u,z);e.quad([t,T,w],[t,b,M],[t,R,M],[t,Y,w],[-1,0,0],{nu:1,ao:[.2,0,0,0]}),e.quad([a,T,w],[a,b,M],[a,R,M],[a,Y,w],[1,0,0],{nu:1,ao:[.2,0,0,0]});const q=t-.3,L=a+.3;e.quad([q,Y+.6,w],[L,Y+.6,w],[L,R+.6,M],[q,R+.6,M],[0,1,0],{nu:1,nv:1}),e.quad([q,Y,w],[q,R,M],[q,R+.6,M],[q,Y+.6,w],[-1,0,0],{nu:1,nv:1}),e.quad([L,Y,w],[L,R,M],[L,R+.6,M],[L,Y+.6,w],[1,0,0],{nu:1,nv:1}),e.quad([q,Y,w],[L,Y,w],[L,R,M],[q,R,M],[0,-1,0],{nu:1,nv:1})}for(const[c,v,z]of[[l,n,Math.sign(l-s)],[s,o,Math.sign(s-l)]]){const w=f??v;e.quad([t,w,c],[a,w,c],[a,v+i,c],[t,v+i,c],[0,0,z],{nu:1,ao:[.2,0,0,0]}),e.quad([t-.3,v+i,c],[a+.3,v+i,c],[a+.3,v+i+.6,c],[t-.3,v+i+.6,c],[0,0,z],{nu:1,nv:1})}e.mat=h}function _(e,t,a,l,n,s,o,i=1.4,f=2.2){const h=yt(t),r=e.mat;e.mat=g;const u=[[.35,0],[.7,.35],[1,.7]];for(const[c,v]of u){const z=a+l*i*c,w=o+f*v,M=o+f*(v+(c===1?.3:.35));e.quad(h(n,w,z),h(s,w,z),h(s,M,z),h(n,M,z),gt(t,l),{nv:1}),e.quad(h(n,w,a),h(s,w,a),h(s,w,z),h(n,w,z),[0,-1,0],{nv:1,ao:[.35,0,0,0]})}const d=a+l*i;e.quad(h(n,o+f,a),h(s,o+f,a),h(s,o+f,d),h(n,o+f,d),[0,1,0],{nv:1}),e.mat=r}function Q(e,t,a,l,n,s,o,i="xXzZ",f=.3){e.box(t,a,l,n,s,o,i),e.box(t-f,a+f,n,n+.6,s-f,o+f,"xXzZyY",{ao:[0,0,0,0]})}function zt(e,t,a,l,n,s,o,i){const f=yt(t),h=e.mat,r=gt(t,l),u=a+l*.06,d=a+l*.45,c=Math.min(a,d),v=Math.max(a,d);e.mat=P,e.quad(f(n-o/2,s,u),f(n+o/2,s,u),f(n+o/2,s+i,u),f(n-o/2,s+i,u),r,{ao:[.3,.5,.38,.38],nu:3,nv:4}),e.mat=g;const z=[[n-o/2-.9,n-o/2,s-.9,s+i+.9],[n+o/2,n+o/2+.9,s-.9,s+i+.9],[n-o/2,n+o/2,s-.9,s],[n-o/2,n+o/2,s+i,s+i+.9],[n-o/2-1.3,n+o/2+1.3,s-1.5,s-.9],[n-o/2-1.2,n+o/2+1.2,s+i+.9,s+i+1.5]];for(let w=0;w<z.length;w++){const[M,Y,R,T]=z[w],b=w>3?.35:0,q=Math.min(c,a+l*(.45+b)),L=Math.max(v,a+l*(.45+b));t==="z"?e.box(M,Y,R,T,q,L,"xXyYzZ",{ao:[0,0,0,0]}):e.box(q,L,R,T,M,Y,"xXyYzZ",{ao:[0,0,0,0]})}e.mat=h}function et(e,t,a,l,n,s,o,i=!1,f=P){const h=t-l,r=t+l,u=a-n,d=a+n,c=e.mat,v=e.floorY;e.floorY=s,e.mat=g,e.prism(e.cham(h-.6,r+.6,u-.6,d+.6,.5),s,s+1.8),e.mat=f,e.prism(e.cham(h,r,u,d,.3),s+1.8,o,!1,[.15,.15,0,0]),e.mat=g;for(const[b,q]of[[h,u],[r-.9,u],[h,d-.9],[r-.9,d-.9]])e.prism(e.cham(b-.12,b+1.02,q-.12,q+1.02,.12),s+1.8,o,!1,[0,0,0,0]);if(e.prism(e.cham(h-.5,r+.5,u-.5,d+.5,.25),o,o+.7),e.box(h-.5,r+.5,o,o,u-.5,d+.5,"y"),e.prism(e.cham(h-1,r+1,u-1,d+1,.25),o+.7,o+1.6),e.box(h-1,r+1,o+.7,o+.7,u-1,d+1,"y"),i){e.mat=c,e.floorY=v;return}for(const[b,q,L]of[[.25,1.6,.8],[.8,2.4,.7]])e.prism(e.cham(h+b,r-b,u+b*n/l,d-b*n/l,.2),o+q,o+q+L);const z=n/l,w=[[1.05,o+3.1],[.52,o+8.4]],M=[t,o+9.6,a],Y=(b,q)=>[[t-b,q,a-b*z],[t+b,q,a-b*z],[t+b,q,a+b*z],[t-b,q,a+b*z]],R=Y(w[0][0],w[0][1]),T=Y(w[1][0],w[1][1]);for(let b=0;b<4;b++){const q=(b+1)%4,L=[(R[b][0]+R[q][0])/2-t,.12,(R[b][2]+R[q][2])/2-a];e.quad(R[b],R[q],T[q],T[b],L,{nu:1,nv:2,ao:[.2,0,0,0]}),e.tri(T[b],T[q],M,[L[0],.5,L[2]])}e.mat=c,e.floorY=v}function pe(e,t,a,l,n,s,o=[.3,.3]){for(const[i,f,h,r]of n)e.quad(t(a,i),t(l,i),t(l,f),t(a,f),s,{ao:[h,r,o[0],o[1]],nv:Math.max(2,Math.round((f-i)/2.6))})}function*b0(e){e.zone=He,e.floorY=0,e.mat=H,e.quad([-47,0,4.5],[47,0,4.5],[47,0,-124],[-47,0,-124],[0,1,0]);const t=[-44,-4,4,44],a=[2,-31,-62,-93,-124];for(const l of t)for(const n of a)Ae(e,l,n,5,0,6.5);for(const l of t)for(let n=0;n<4;n++){const s=a[n],o=a[n+1];J(e,"x",l-2.5,l+2.5,o,s,6.5,16.6,o+2.5,s-2.5,6.5,4.5,{ring:1.4,n:12})}yield;for(let l=0;l<a.length;l++){const n=a[l],s=l===0?[-.5,4.5]:l===4?[-126.5,-121.5]:[n-1.5,n+1.5];for(const o of[-24,24])J(e,"z",s[0],s[1],o-17.5,o+17.5,6.5,18,o-17.5,o+17.5,6.5,8,{ring:1.4,n:16});J(e,"z",s[0],s[1],-1.5,1.5,6.5,18,-1.5,1.5,6.5,1.5,{ring:0,n:6})}yield,e.mat=P;for(const l of[-24,24])Qe(e,l,17.5,12.5,4,4.5,-124,14);e.quad([-1.5,14,4.5],[1.5,14,4.5],[1.5,14,-124],[-1.5,14,-124],[0,-1,0]),e.mat=g,e.box(-47,47,-.6,0,4.5,8,"YZ")}function*y0(e){e.zone=me,e.floorY=0,e.mat=H,e.quad([-40,0,-124],[50,0,-124],[50,0,-186],[-40,0,-186],[0,1,0]),kt(e,-32,-16,-130,0,-186,9,18),Se(e,-33.5,-32,-130,0,-186,9,4,0),Se(e,-16,-14.5,-130,0,-186,9,4,0),kt(e,16,32,-186,9,-130,18,18),Se(e,14.5,16,-186,9,-130,18,4,0),Se(e,32,33.5,-186,9,-130,18,4,0),e.mat=g,e.box(14.5,33.5,16.4,18,-130,-124,"zy"),e.mat=H,e.box(16,32,18,18,-130,-124,"Y"),e.mat=g,Q(e,14.5,16,18,22,-130,-124,"xXz"),Q(e,32,33.5,18,22,-130,-124,"xXz"),e.floorY=0,e.mat=P;for(const[t,a]of[[-40,-33.5],[-14.5,14.5],[33.5,50]])e.quad([t,0,-186],[a,0,-186],[a,9,-186],[t,9,-186],[0,0,1],{ao:[.25,.1,0,0]}),e.mat=g,Q(e,t,a,9,13,-186,-184.5,"xXzZ"),e.mat=P;e.mat=g,e.quad([-14.5,8.2,-185.6],[14.5,8.2,-185.6],[14.5,9,-185.6],[-14.5,9,-185.6],[0,0,1],{nv:1}),e.floorY=9,e.mat=H,e.quad([-40,9,-186],[50,9,-186],[50,9,-230],[-40,9,-230],[0,1,0]),yield,e.mat=P,e.box(-16,16,9,23,-203,-200.2,"xXz"),J(e,"z",-200.2,-199,-16,16,10.5,23,-3,3,16,3,{faces:"C",ring:.9,n:12}),e.mat=P,e.quad([-3,10.5,-200.2],[3,10.5,-200.2],[3,19.2,-200.2],[-3,19.2,-200.2],[0,0,1],{ao:[.35,.35,.3,.3]}),e.quad([-16,9,-200.2],[-16,9,-199],[-16,23,-199],[-16,23,-200.2],[-1,0,0],{nu:1}),e.quad([16,9,-200.2],[16,9,-199],[16,23,-199],[16,23,-200.2],[1,0,0],{nu:1}),e.mat=g,e.box(-16.4,16.4,9,10.5,-203.4,-198.6,"xXzZY",{ao:[.25,0,0,0]}),e.box(-16.6,16.6,23,24.2,-203.6,-198.6,"xXzZyY",{ao:[0,0,0,0]}),e.box(-16.2,16.2,21.6,23,-199,-198.6,"Zy"),e.prism(e.cham(-4.2,4.2,-199,-196.2,.7),9,11.6),e.prism(e.cham(-3.5,3.5,-198.9,-196.8,.5),11.6,11.9),e.prism(e.cham(-.9,.9,-200.2,-198.9,.3),12.4,15.2),yield,e.mat=P,pe(e,(t,a)=>[t,a,-230],-40,50,[[9,22,.34,0],[22,30,0,.3],[30,42,0,0],[42,50,0,.3],[50,52,0,0]],[0,0,1]),e.mat=g,e.box(-40,50,9,11,-230,-229.5,"ZY");for(const t of[-10,20,46])e.box(t-1.6,t+1.6,11,30,-230,-229.3,"xXZ"),e.box(t-1.6,t+1.6,32.2,50,-230,-229.3,"xXZ");_(e,"z",-230,1,-40,50,30),_(e,"z",-230,1,-40,50,50,1.2,2);for(const t of[-25,5,33])zt(e,"z",-230,1,t,36.5,6,9);for(const[t,a]of[[-40,1],[50,-1]]){e.floorY=0,e.mat=P,pe(e,(l,n)=>[t,n,l],-124,-186,[[0,12,.34,0],[12,22,0,0],[22,30,0,.3],[30,42,0,0],[42,50,0,.3],[50,52,0,0]],[a,0,0],[.3,0]),e.floorY=9,pe(e,(l,n)=>[t,n,l],-186,-230,[[9,22,.34,0],[22,30,0,.3],[30,42,0,0],[42,50,0,.3],[50,52,0,0]],[a,0,0],[0,.3]),e.mat=g,e.box(t-(a>0?0:.5),t+(a>0?.5:0),9,11,-230,-186,a>0?"XY":"xY"),_(e,"x",t,a,-230,-124,30),_(e,"x",t,a,-230,-124,50,1.2,2);for(const l of[-139,-172,-192,-221])zt(e,"x",t,a,l,36.5,6,9),zt(e,"x",t,a,l,15.5,6,9);for(const l of[-155,-208])e.box(t-(a>0?0:.7),t+(a>0?.7:0),l<-186?11:0,30,l-1.6,l+1.6,a>0?"XzZ":"xzZ")}e.mat=P}function*g0(e){e.zone=de,e.floorY=18,e.mat=H,e.quad([-19.5,18,0],[47,18,0],[47,18,-124],[-19.5,18,-124],[0,1,0]);const t=O.x-O.hw,a=O.x+O.hw;for(const[o,i,f,h]of[[0,-1,-19.5,47],[4.5,1,-54,54]])i>0&&(e.zone=ne,e.floorY=0),e.mat=P,e.quad([f,18,o],[t,18,o],[t,53.5,o],[f,53.5,o],[0,0,i],{ao:[i<0?.25:0,0,0,0]}),e.quad([a,18,o],[h,18,o],[h,53.5,o],[a,53.5,o],[0,0,i],{ao:[i<0?.25:0,0,0,0]}),e.quad([t,O.y1,o],[a,O.y1,o],[a,53.5,o],[t,53.5,o],[0,0,i]);e.zone=de,e.floorY=18,e.mat=g,e.quad([t,18,0],[t,18,4.5],[t,O.y1,4.5],[t,O.y1,0],[1,0,0],{nu:1}),e.quad([a,18,0],[a,18,4.5],[a,O.y1,4.5],[a,O.y1,0],[-1,0,0],{nu:1}),e.quad([t,O.y1,0],[a,O.y1,0],[a,O.y1,4.5],[t,O.y1,4.5],[0,-1,0],{nv:1}),e.quad([t,18,0],[a,18,0],[a,18,4.5],[t,18,4.5],[0,1,0],{nv:1}),Kt(e,t+.06,a-.06,18.05,O.y1-.05,.5,1.1);const l=[-15.5,-46.5,-62,-77.5,-108.5],n=[0,-31,-54.25,-69.75,-93,-124];for(let o=0;o<5;o++)J(e,"x",47,53,n[o+1],n[o],22,53.5,l[o]-4,l[o]+4,32,4,{ring:1.1,n:10}),e.mat=g,e.quad([47,22,l[o]-4],[53,22,l[o]-4],[53,22,l[o]+4],[47,22,l[o]+4],[0,1,0],{nu:1,nv:1}),e.box(45.4,47,18,20.6,l[o]-5,l[o]+5,"xzZY");e.mat=P,e.quad([47,18,0],[47,18,-124],[47,22,-124],[47,22,0],[-1,0,0],{nv:1,ao:[.3,0,0,0]}),e.zone=ne,e.quad([53,17,4.5],[53,17,-126],[53,22,-126],[53,22,4.5],[1,0,0]),e.quad([46.5,17,4.5],[53,17,4.5],[53,17,-126],[46.5,17,-126],[0,-1,0],{nu:1}),e.zone=de,_(e,"x",47,-1,-124,0,38.2,1.1,1.8),yield;const s=[-1.25,-31,-62,-93,-124];for(let o=0;o<5;o++)Ae(e,-22,s[o],5,18,28,o===0?2.5:5);for(let o=0;o<4;o++){const i=o===0?0:s[o],f=s[o+1];J(e,"x",-24.5,-19.5,f,i,28,53.5,f+2.5,i-2.5,28,10,{ring:1.5,n:14})}_(e,"x",-19.5,1,-124,0,38.2,1.1,1.8),e.mat=g,e.quad([-24.5,18,0],[-19.5,18,0],[-19.5,18,-124],[-24.5,18,-124],[0,1,0],{nu:1}),J(e,"z",-33,-29,-19.5,10,28,52,-19.5,7.5,28,9,{ring:1.6,n:18}),J(e,"z",-33,-29,10,47,28,52,12.5,44,28,9,{ring:1.6,n:18}),Ae(e,10,-31,5,18,28),Ae(e,45.6,-31,2.8,18,28,5),e.mat=g,e.box(-19.5,47,18,18.28,-35.5,-27.6,"zZY",{ao:[0,0,0,0]}),e.mat=P,_(e,"z",-33,-1,-19.5,47,39.4,.9,1.4),et(e,6.25,-44.5,1.25,4.5,18,36,!0,g),et(e,16.75,-69.5,1.25,4.5,18,40,!0,g),J(e,"z",-126,-122,-19.5,47,18,53.5,14.5,33.5,32,8,{ring:1.6,n:14}),yield,e.mat=P,Qe(e,13.75,33.25,40,10,0,-124,26),e.mat=g;for(const o of[-15.5,-46.5,-62,-77.5,-93,-108.5]){Qe(e,13.75,32.6,40,9.45,o+1.1,o-1.1,26);for(const i of[o+1.1,o-1.1])for(let f=0;f<26;f++){const h=Math.PI*(1-f/26),r=Math.PI*(1-(f+1)/26);e.quad([13.75+32.6*Math.cos(h),40+9.45*Math.sin(h),i],[13.75+32.6*Math.cos(r),40+9.45*Math.sin(r),i],[13.75+33.25*Math.cos(r),40+10*Math.sin(r),i],[13.75+33.25*Math.cos(h),40+10*Math.sin(h),i],[0,0,i-o],{nu:1,nv:1})}}e.mat=P,e.zone=$t,e.mat=H,e.quad([-50,18,0],[-24.5,18,0],[-24.5,18,-124],[-50,18,-124],[0,1,0]),e.mat=P,pe(e,(o,i)=>[-50,i,o],0,-124,[[18,30,.34,0],[30,41,0,0],[41,49.5,0,.3],[49.5,53.5,0,0]],[1,0,0]),pe(e,(o,i)=>[o,i,0],-50,-24.5,[[18,30,.34,0],[30,53.5,0,0]],[0,0,-1]),pe(e,(o,i)=>[o,i,-124],-50,-24.5,[[18,30,.34,0],[30,52,0,0]],[0,0,1]),_(e,"x",-50,1,-124,0,49.5,1.2,2),kt(e,-44,-28,-24,18,-124,52,68),Se(e,-45.5,-44,-24,18,-124,52,4,18),Se(e,-28,-26.5,-24,18,-124,52,4,18),e.zone=me,e.floorY=18,e.mat=P,pe(e,(o,i)=>[o,i,-126],-40,-19.5,[[18,30,.3,0],[30,44,0,0],[44,53.5,0,.12]],[0,0,-1],[.3,0]),e.quad([47,18,-126],[50,18,-126],[50,53.5,-126],[47,53.5,-126],[0,0,-1],{nu:1}),yield,e.zone=ne,e.floorY=52,e.mat=H,e.quad([-24.5,52,4.5],[53,52,4.5],[53,52,-126],[-24.5,52,-126],[0,1,0]),e.mat=g,Q(e,-19.5,53,52,53.5,-126,-124.6,"zZ"),Q(e,-24.5,53,52,53.5,3.1,4.5,"zZ"),Q(e,51.6,53,52,53.5,-124.6,3.1,"xX"),Q(e,-24.5,-23.1,52,53.5,-124.6,3.1,"xX");for(const[o,i]of[[22,-42],[34,-96]])e.mat=P,e.prism(e.cham(o-2.6,o+2.6,i-2,i+2,.35),52,61,!1),e.mat=g,e.prism(e.cham(o-3.1,o+3.1,i-2.5,i+2.5,.3),61,62.2),e.box(o-3.1,o+3.1,61,61,i-2.5,i+2.5,"y"),e.prism(e.cham(o-2.2,o+2.2,i-1.6,i+1.6,.3),62.2,64);e.floorY=0,e.mat=P,e.quad([-54,17,4.5],[-54,17,-126.5],[-54,53.5,-126.5],[-54,53.5,4.5],[-1,0,0]),e.quad([-54,0,-126.5],[-54,0,-310],[-54,53.5,-310],[-54,53.5,-126.5],[-1,0,0]),e.quad([-54,17,4.5],[-46.5,17,4.5],[-46.5,17,-126.5],[-54,17,-126.5],[0,-1,0],{nu:1}),e.quad([-54,0,-126.5],[-46.5,0,-126.5],[-46.5,17,-126.5],[-54,17,-126.5],[0,0,1],{nu:1}),e.quad([-54,53.5,4.5],[-50,53.5,4.5],[-50,53.5,-124],[-54,53.5,-124],[0,1,0],{nu:1}),e.floorY=52,e.mat=H,e.quad([-54,52,-124],[-40,52,-124],[-40,52,-230],[-54,52,-230],[0,1,0]),e.mat=g,Q(e,-41.4,-40,52,53.5,-230,-126,"xX"),e.mat=H,e.quad([-38.8,52,-124],[-24.5,52,-124],[-24.5,52,-124.6],[-38.8,52,-124.6],[0,1,0]),e.mat=g,e.box(-41.4,-19.5,52,53.5,-126,-124.6,"xZY"),e.mat=H,e.quad([50,52,-126],[52.6,52,-126],[52.6,52,-230],[50,52,-230],[0,1,0]),e.mat=g,e.box(52.6,54,52,53.5,-230,-124,"xZY"),e.floorY=52,e.mat=g,e.box(-54,-52.6,52.06,53.5,-231.4,-124,"XY"),e.zone=He,e.floorY=0,e.mat=P;for(const o of[-44,-4,4,44])e.quad([o-2.5,6.5,4.5],[o+2.5,6.5,4.5],[o+2.5,18,4.5],[o-2.5,18,4.5],[0,0,1],{ao:[.22,0,0,0]});for(const o of[-4,4,44])e.quad([o-2.5,6.5,-126.5],[o+2.5,6.5,-126.5],[o+2.5,18,-126.5],[o-2.5,18,-126.5],[0,0,-1],{ao:[.22,0,0,0]});e.zone=ne,e.quad([-54,17,4.5],[-46.5,17,4.5],[-46.5,18,4.5],[-54,18,4.5],[0,0,1],{nu:1,nv:1}),e.quad([50,0,-124],[54,0,-124],[54,17,-124],[50,17,-124],[0,0,1],{nu:1}),e.zone=me,e.floorY=18,e.quad([46.5,17,-126],[50,17,-126],[50,18,-126],[46.5,18,-126],[0,0,-1],{nu:1,nv:1}),e.zone=de,e.floorY=18,e.quad([-24.5,18,0],[-19.5,18,0],[-19.5,28,0],[-24.5,28,0],[0,0,-1],{ao:[.25,0,0,0]}),e.mat=g,e.box(-19.5,47,18,18.28,-35.5,-27.6,"x",{ao:[0,0,0,0]}),e.zone=me,e.floorY=0,e.box(14.5,33.5,16.4,18,-130,-126.5,"xX");for(const[o,i]of[[-14.5,14.5],[33.5,50]])e.box(o,i,9,13,-186,-184.5,"y");e.floorY=9,e.box(-16.2,16.2,21.6,23,-199,-198.6,"X"),e.zone=ne,e.floorY=52,e.mat=P}function Kt(e,t,a,l,n,s,o){const i=e.mat;e.mat=wt,e.box(t,a,l,n,s,o,"xXzZyY",{ao:[.15,0,0,0]});const f=(t+a)/2,h=l+(n-l)*.45,r=[[t,t+1.3,l,n],[a-1.3,a,l,n],[t,a,l,l+1.8],[t,a,n-1.5,n],[t,a,h,h+1.4],[f-.65,f+.65,l,n]];a-t>15&&r.push([t+(a-t)*.25-.5,t+(a-t)*.25+.5,l,n],[t+(a-t)*.75-.5,t+(a-t)*.75+.5,l,n]);for(const[u,d,c,v]of r)e.box(u,d,c,v,s-.14,s,"xXyYz",{ao:[0,0,0,0]}),e.box(u,d,c,v,o,o+.14,"xXyYZ",{ao:[0,0,0,0]});e.mat=i}function k0(e){e.zone=de,e.floorY=18,Kt(e,G.x0,G.x1,G.y0+.05,G.y1,G.z-.3,G.z+.3)}function z0(e){e.zone=ne,e.floorY=52,e.mat=H;const t=p.x0-2.5,a=p.x1+2.5,l=p.z0-2.5,n=p.z1+2.5;e.quad([-54,52,-230],[54,52,-230],[54,52,n],[-54,52,n],[0,1,0]),e.quad([a,52,n],[54,52,n],[54,52,-310],[a,52,-310],[0,1,0]),e.quad([-54,52,n],[t,52,n],[t,52,-310],[-54,52,-310],[0,1,0],{nu:1}),e.quad([t,52,l],[a,52,l],[a,52,-310],[t,52,-310],[0,1,0],{nv:2}),e.mat=g,e.box(t,a,52,53.5,l,n,"xXzZ",{ao:[.3,0,0,0]}),e.quad([t,53.5,n],[a,53.5,n],[a,53.5,p.z1],[t,53.5,p.z1],[0,1,0],{nv:1}),e.quad([t,53.5,p.z0],[a,53.5,p.z0],[a,53.5,l],[t,53.5,l],[0,1,0],{nv:1}),e.quad([t,53.5,p.z1],[p.x0,53.5,p.z1],[p.x0,53.5,p.z0],[t,53.5,p.z0],[0,1,0],{nu:1}),e.quad([p.x1,53.5,p.z1],[a,53.5,p.z1],[a,53.5,p.z0],[p.x1,53.5,p.z0],[0,1,0],{nu:1});const s=ae-.6,o={ao:[.45,0,0,0],nv:2};e.floorY=s-30,e.quad([p.x0,s,p.z1],[p.x1,s,p.z1],[p.x1,53.5,p.z1],[p.x0,53.5,p.z1],[0,0,-1],o),e.quad([p.x0,s,p.z0],[p.x1,s,p.z0],[p.x1,53.5,p.z0],[p.x0,53.5,p.z0],[0,0,1],o),e.quad([p.x0,s,p.z0],[p.x0,s,p.z1],[p.x0,53.5,p.z1],[p.x0,53.5,p.z0],[1,0,0],o),e.quad([p.x1,s,p.z0],[p.x1,s,p.z1],[p.x1,53.5,p.z1],[p.x1,53.5,p.z0],[-1,0,0],o),J(e,"z",-304,-300,-54,-8,56,86,-44,-28,64,8,{ring:1.7,n:20}),e.mat=P,e.floorY=52,e.quad([-54,52,-300],[-8,52,-300],[-8,56,-300],[-54,56,-300],[0,0,1],{nv:1,ao:[.3,0,0,0]}),e.quad([-54,52,-304],[-8,52,-304],[-8,56,-304],[-54,56,-304],[0,0,-1],{nv:1}),e.quad([-8,52,-304],[-8,52,-300],[-8,86,-300],[-8,86,-304],[1,0,0],{nu:1}),e.mat=g,e.quad([-44,56,-304.3],[-28,56,-304.3],[-28,56,-299.7],[-44,56,-299.7],[0,1,0],{nu:2,nv:1}),e.box(-54,-7.6,52,53.6,-300,-299.5,"ZYX"),e.box(-8.4,-7.6,53.6,86,-304.4,-299.6,"xXzZ"),_(e,"z",-300,1,-54,-8,80,1.2,2),e.box(-54.4,-7.4,86,87.2,-304.6,-299.4,"xXzZyY",{ao:[0,0,0,0]}),e.zone=ne,e.floorY=52,e.mat=P;for(let r=0;r<5;r++){const u=-8+r*12.12;J(e,"z",-303.4,-300.6,u,u+12.12,52,71,u+1.1,u+11.02,61.5,5,{ring:1,n:12})}e.mat=P,e.quad([52.6,52,-303.4],[52.6,52,-300.6],[52.6,71,-300.6],[52.6,71,-303.4],[1,0,0],{nu:1}),e.mat=g,e.box(-8,53,71,72.3,-303.9,-300.1,"xXzZyY",{ao:[0,0,0,0]});for(let r=1;r<5;r++){const u=-8+r*12.12;e.box(u-1.3,u+1.3,52,53.6,-304,-300,"xXzZY"),e.box(u-1.25,u+1.25,60.6,61.5,-303.9,-300.1,"xXzZyY",{ao:[0,0,0,0]})}for(const r of vt)for(const u of Ge)e.floorY=s,e.mat=g,e.prism(e.cham(u-1.15,u+1.15,r-1.15,r+1.15,.3),s,54.4),e.prism(e.cham(u-.8,u+.8,r-.8,r+.8,.22),54.4,69.4,!1,[.12,.12,0,0]),e.prism(e.cham(u-1.1,u+1.1,r-1.1,r+1.1,.2),69.4,70.2),e.box(u-1.1,u+1.1,69.4,69.4,r-1.1,r+1.1,"y");e.mat=wt,e.floorY=52;for(const r of Ge)e.box(r-.55,r+.55,70.2,71,-276,-256,"xXyYzZ",{ao:[0,0,0,0]});for(let r=0;r<6;r++){const u=-258.5-r*3;e.box(-47.6,-4.6,71,72.5,u-.6,u+.6,"xXyYzZ",{ao:[0,0,0,0]})}for(const[r,u,d]of[[-13,-258,70],[2,-291,76]])e.floorY=s,e.mat=g,e.prism(e.cham(r-2.5,r+2.5,u-2.5,u+2.5,.4),s,54.6),e.mat=P,e.prism(e.cham(r-2,r+2,u-2,u+2,.3),54.6,d,!1,[.15,.12,0,0]),e.mat=g,e.prism(e.cham(r-2.5,r+2.5,u-2.5,u+2.5,.25),d,d+1.1),e.box(r-2.5,r+2.5,d,d,u-2.5,u+2.5,"y"),e.prism(e.cham(r-1.7,r+1.7,u-1.7,u+1.7,.3),d+1.1,d+2.8);const i=12,f=-268;e.floorY=s,e.mat=g,e.prism(e.cham(i-3.5,i+3.5,f-3.5,f+3.5,.8),s,53.2),e.floorY=53.2;const h=(r,u=12)=>{const d=[];for(let c=0;c<u;c++){const v=-c/u*Math.PI*2;d.push([i+r*Math.cos(v),f+r*Math.sin(v)])}return d};e.prism(h(2.3),53.2,53.7),e.prism(h(1.9),53.7,55.1,!1,[.2,.15,0,0]),e.prism(h(2.15),55.1,55.5),e.box(i-1.95,i-1.45,55.5,57,f-.3,f+.3,"xXzZ"),e.box(i+1.45,i+1.95,55.5,57,f-.3,f+.3,"xXzZ"),e.box(i-2.2,i+2.2,57,57.55,f-.35,f+.35,"xXyYzZ",{ao:[0,0,0,0]}),e.floorY=s,e.mat=g,e.box(-22.5,p.x1,s,53.5,-285.5,-282.5,"zZY",{ao:[.4,0,0,0]}),e.floorY=53.5,e.mat=P,e.box(-22.5,12,53.5,62,-284.8,-283.2,"XzZ"),e.mat=g,e.box(-22.5,12.3,62,62.7,-285.1,-282.9,"XzZyY",{ao:[0,0,0,0]}),e.zone=xt,e.floorY=s,e.mat=P,Qe(e,-36,11.5,64,11.5,-282,-300,22),e.quad([-47.5,s,-280],[-47.5,s,-300],[-47.5,64,-300],[-47.5,64,-280],[1,0,0],{ao:[.3,0,0,0]});for(const[r,u]of[[-285,-280],[-300,-297]])e.quad([-24.5,s,r],[-24.5,s,u],[-24.5,64,u],[-24.5,64,r],[-1,0,0],{ao:[.3,0,0,0]});e.mat=g;for(const r of[-285,-297])e.quad([-24.5,V.y0-.1,r],[-22.5,V.y0-.1,r],[-22.5,64,r],[-24.5,64,r],[0,0,r>-290?-1:1],{nu:1});e.quad([-24.5,64,-297],[-22.5,64,-297],[-22.5,64,-285],[-24.5,64,-285],[0,-1,0],{nu:1,nv:1}),e.box(-24.5,-22.5,s,V.y0-.1,-297,-285,"xXY",{ao:[.3,0,0,0]}),_(e,"x",-47.5,1,-300,-280,62.4,.5,1.6),_(e,"x",-24.5,-1,-285,-280,62.4,.5,1.6),e.zone=ne,e.mat=P,e.quad([-49.5,52,-280],[-49.5,52,-300],[-49.5,79,-300],[-49.5,79,-280],[-1,0,0]);for(const[r,u,d]of[[-285,-280,s],[-300,-297,s],[-297,-285,64]])e.quad([-22.5,d,r],[-22.5,d,u],[-22.5,79,u],[-22.5,79,r],[1,0,0]);e.mat=H,e.quad([-49.5,79,-280],[-22.5,79,-280],[-22.5,79,-300],[-49.5,79,-300],[0,1,0]),J(e,"z",-282,-280,-49.5,-22.5,s,79,-46.6,-25.4,64,10.6,{ring:1.5,n:22}),e.floorY=s,e.mat=P,e.box(-46.6,-25.4,s,56.4,-281.6,-280.4,"zZ",{ao:[.3,0,0,0]}),e.mat=g,e.box(-46.6,-25.4,56.4,57,-281.9,-280.1,"zZyY",{ao:[0,0,0,0]}),e.mat=g,_(e,"z",-280,1,-49.9,-22.1,79,1.2,2),_(e,"x",-22.5,1,-300,-280,79,1.2,2),_(e,"x",-49.5,-1,-300,-280,79,1.2,2);for(const r of[-49.5,-22.5])e.prism(e.cham(r-1.2,r+1.2,-281.2,-278.8,.3),s,54.6);e.floorY=52,e.mat=g,Q(e,-40,54,52,53.5,-231.4,-230,"zZ"),Q(e,52.6,54,52,53.5,-310,-231.4,"xX"),Q(e,-7.4,52.6,52,53.5,-310,-308.6,"zZ"),Q(e,-54,-52.6,52,53.5,-300,-231.4,"xX"),e.zone=ne,e.floorY=0,e.mat=P,e.quad([-54,0,-310],[54,0,-310],[54,53.5,-310],[-54,53.5,-310],[0,0,-1]),e.quad([54,0,-124],[54,0,-310],[54,53.5,-310],[54,53.5,-124],[1,0,0]),e.floorY=52,e.mat=g,e.box(-54,-7.4,52,53.5,-310,-308.6,"ZY"),e.box(-54,-52.6,52,53.5,-300,-231.4,"Z"),e.floorY=0,e.mat=P}function q0(e){e.zone=xt,e.floorY=V.y0,e.mat=wt;const t=V.z-V.hw+.08,a=V.z+V.hw-.08,l=V.y0,n=V.y1,s=V.x-.3,o=V.x+.3;e.box(s,o,l,n,t,a,"xXzZyY",{ao:[.12,0,0,0]});const i=[[t,t+1.1,l,n],[a-1.1,a,l,n],[t,a,l,l+1.3],[t,a,n-1.1,n],[V.z-.5,V.z+.5,l,n]];for(const[f,h,r,u]of i)e.box(o,o+.14,r,u,f,h,"XyYzZ",{ao:[0,0,0,0]})}function tt(e){const t=new m.BufferGeometry;return t.setAttribute("position",new m.Float32BufferAttribute(e.pos,3)),t.setAttribute("normal",new m.Float32BufferAttribute(e.nor,3)),t.setAttribute("aDat",new m.Float32BufferAttribute(e.dat,3)),t.setIndex(e.n>65535?new m.Uint32BufferAttribute(e.idx,1):new m.Uint16BufferAttribute(e.idx,1)),t.computeBoundingSphere(),t.computeBoundingBox(),t}const Jt=`
attribute vec3 aDat;
uniform vec3 uPiv; uniform float uMir, uWater, uTime;
varying vec3 vP, vN, vD, vL;
#include <fog_pars_vertex>
void main() {
  vP = position; vN = normal; vD = aDat;
  vec3 p = position;
  float c = cos(uPiv.z), s = sin(uPiv.z);
  vec2 r = p.xz - uPiv.xy; p.xz = uPiv.xy + vec2(c * r.x - s * r.y, s * r.x + c * r.y);
  p.y = mix(p.y, 2. * uWater - p.y, uMir);
  // the copy under the water trembles: it sways sideways, more the deeper it lies (the taller the thing above), and not at
  // all at the waterline, where a thing and its image meet (1.2 cm of sway for each metre of depth)
  float dep = uMir * max(uWater - p.y, 0.);
  p.xz += dep * 0.012 * vec2(sin(p.y * 0.61 + uTime * 1.7 + position.z * 0.23), sin(p.y * 0.53 - uTime * 1.3 + position.x * 0.29));
  vL = p;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,S0=`
uniform vec3 uBV, uBAx; uniform float uFar;
varying vec3 vL;
void main() {
  float t = clamp(dot(vL - uBV, uBAx) / uFar, 0., 0.9999);
  vec4 e = fract(t * vec4(1., 255., 65025., 16581375.));
  e -= e.yzww * vec4(1. / 255., 1. / 255., 1. / 255., 0.);
  gl_FragColor = e;
}`,Qt=`
vec2 ripSlope(vec2 p, float t) {
  float w = vn(p * 0.19 + uSeed.xy) * 5.;
  vec2 k1 = vec2(0.62, 1.48), k2 = vec2(-1.71, 0.52), k3 = vec2(1.9, -2.6);
  return 0.31 * k1 * cos(dot(p, k1) + t * 1.3 + w + uSeed.z) + 0.21 * k2 * cos(dot(p, k2) - t * 1.7 + w * 0.7 + uSeed.w) + 0.075 * k3 * cos(dot(p, k3) + t * 2.6 - w * 1.3 + uSeed.x);
}
`,P0=`
uniform vec3 uV[3]; uniform vec3 uAx[3]; uniform vec3 uRt[3]; uniform vec3 uUp[3];
uniform vec3 uVm;
uniform sampler2D uD0, uD1, uD2;
uniform float uFar, uTan, uMir, uWater, uTime, uBright, uPaintOn;
uniform vec3 uPlaster, uStone, uTile, uWood, uUmber, uSienna, uChalk, uBlue, uEye;
uniform vec4 uBasin, uSeed, uArm, uLog;
uniform vec3 uLog2, uRes, uNear, uRose;
uniform float uCells, uChk, uWr, uEyeH, uGap, uLeafNear;
uniform vec3 uV6, uAx6, uRt6, uUp6, uCSun;
uniform sampler2D uD3, uDS; uniform mat4 uSunM; uniform vec3 uSunPos, uSunDir, uSunCol, uAmb, uV0; uniform float uSunFar, uSunRes, uTan0, uFar0;
varying vec3 vP, vN, vD, vL;
#include <fog_pars_fragment>
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 h22(vec2 p) { float n = h21(p); return vec2(n, h21(p + n + 17.1)); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p) { return 0.5 * vn(p) + 0.3 * vn(p * 2.13 + 7.1) + 0.2 * vn(p * 4.37 + 3.7); }
${Qt}
float unpack(vec4 e) { return dot(e, vec4(1., 1. / 255., 1. / 65025., 1. / 16581375.)); }
float seen(sampler2D m, vec2 q, float t, float res, float cs, float near, float slack, float tn, float far) {
  vec2 uv = q / (2. * tn) + 0.5; float tx = 0.5 / res;
  float d = max(max(unpack(textureLod(m, uv + vec2(-tx, -tx), 0.)), unpack(textureLod(m, uv + vec2(tx, -tx), 0.))),
                max(unpack(textureLod(m, uv + vec2(-tx, tx), 0.)), unpack(textureLod(m, uv + vec2(tx, tx), 0.))));
  float c = clamp(cs, 0.04, 1.);
  float b = 0.1 + slack + 0.006 * t + t * (2.4 * tn / res) * sqrt(max(1. - c * c, 0.)) / c;
  float inside = step(max(abs(q.x), abs(q.y)), tn * 0.985) * step(near, t);
  return inside * (1. - smoothstep(b, b * 1.7, t - d * far));
}
// the same test with the four taps weighed by their distance (for the astrolabe, which lies on vaults and floors at a very
// low angle from its point, where one texel of the map is metres long on the surface): edges come out soft, not stepped
float seenSoft(sampler2D m, vec2 q, float t, float res, float cs, float near, float tn, float far) {
  vec2 st = (q / (2. * tn) + 0.5) * res - 0.5, i0 = floor(st), f = st - i0, b0 = (i0 + 0.5) / res; float tx = 1. / res;
  vec4 d = vec4(unpack(textureLod(m, b0, 0.)), unpack(textureLod(m, b0 + vec2(tx, 0.), 0.)), unpack(textureLod(m, b0 + vec2(0., tx), 0.)), unpack(textureLod(m, b0 + vec2(tx, tx), 0.))) * far;
  float c = clamp(cs, 0.04, 1.), b = 0.1 + 0.006 * t + t * (2.4 * tn / res) * sqrt(max(1. - c * c, 0.)) / c;
  vec4 s = 1. - smoothstep(vec4(b), vec4(b * 1.7), vec4(t) - d);
  float inside = step(max(abs(q.x), abs(q.y)), tn * 0.985) * step(near, t);
  return inside * mix(mix(s.x, s.y, f.x), mix(s.z, s.w, f.x), f.y);
}
// the sun: 1 where the point sees it (one depth map baked along the sun's rays, five taps), 0 in cast shadow
float sunVis(vec3 p, float ndl) {
  vec4 c = uSunM * vec4(p, 1.);
  if (c.x < 0.002 || c.x > 0.998 || c.y < 0.002 || c.y > 0.998) return 1.;
  float t = dot(p - uSunPos, -uSunDir) / uSunFar, tx = 1.3 / uSunRes;
  float b = (0.3 + 0.35 * min(sqrt(max(1. - ndl * ndl, 0.)) / max(ndl, 0.12), 4.)) / uSunFar;
  float s = step(t - b, unpack(textureLod(uDS, c.xy, 0.)));
  s += step(t - b, unpack(textureLod(uDS, c.xy + vec2(tx, tx * 0.4), 0.))) + step(t - b, unpack(textureLod(uDS, c.xy + vec2(-tx * 0.4, tx), 0.)));
  s += step(t - b, unpack(textureLod(uDS, c.xy + vec2(-tx, -tx * 0.4), 0.))) + step(t - b, unpack(textureLod(uDS, c.xy + vec2(tx * 0.4, -tx), 0.)));
  return s * 0.2;
}
// an arch opening seen square on (a rectangle below the springing ys, half an ellipse of rise b above it, half span a):
// 1 inside, 0 outside, soft over w metres
float archIn(float du, float y, float a, float ys, float b, float w) {
  float dy = max(y - ys, 0.), e = length(vec2(du / a, dy / b));
  float d = dy < 1e-3 ? a - abs(du) : (1. - e) * e / max(length(vec2(du / (a * a), dy / (b * b))), 1e-4);
  return smoothstep(-w, w, d);
}
// The cellar's sun: 1 where a point of the cellar sees the low sun uCSun (unit, toward the sun: from the south west), 0 in
// shade. Worked out from the plan itself, no map: in the west aisle the ray to the sun must pass the west arcade's two faces
// inside ONE opening (between the piers, under the arch: the opening it is in at the arcade's middle plane x -44, so a ray
// that would enter by one opening and leave by the next is stopped by the pier between them; a point within the arcade's
// own thickness must itself stand in that opening) and every cross arch south of it under its arch. The sun is followed
// as far east as the middle row's west faces (x -6.5: the fade lies just inside those piers, x -6.4 .. -6.2); east of them the
// law gives shade, and the east aisle is reached only through its south mouth; soft = the edge's softness in metres.
float cellarSun(vec3 p, float soft) {
  vec3 L = uCSun; float east = step(1.5, p.x), xc = mix(-24., 24., east);
  float vis = mix(1. - smoothstep(-6.4, -6.2, p.x), smoothstep(6.5, 8.5, p.x), east);
  if (vis <= 0.) return 0.;
  if (east < 0.5 && p.x > -46.45) {
    float x1 = p.x > -41.45 ? -41.5 : -46.5; vec3 h1 = p + L * ((x1 - p.x) / min(L.x, -1e-3));   // the first face met on the way west
    if (h1.z < 4.5) {
      vec3 hm = p + L * (max(p.x + 44., 0.) / max(-L.x, 1e-3));
      float far = step(hm.z, -31.), zc = mix(-14.5, -46.5 - 31. * clamp(floor((-hm.z - 31.) / 31.), 0., 2.), far);
      if (p.x < -41.45) vis *= archIn(p.z - zc, p.y, mix(14., 13., far), 6.5, 4.5, soft);
      for (int i = 0; i < 2; i++) {
        float xf = i == 0 ? -41.5 : -46.5;
        if (p.x > xf + 0.05) {
          float sx = (xf - p.x) / min(L.x, -1e-3); vec3 h = p + L * sx;
          vis *= archIn(h.z - zc, h.y, mix(14., 13., far), 6.5, 4.5, soft + 0.012 * sx);
        }
      }
    } else if (p.x < -41.45) return 0.;   // from within the arcade's thickness the way south is through the corner pier
  }
  for (int k = 0; k < 5; k++) {
    float zk = k == 0 ? 2. : -31. * float(k), hw = (k == 0 || k == 4) ? 2.5 : 1.5;
    for (int j = 0; j < 2; j++) {
      float zf = zk + (j == 0 ? -hw : hw);
      if (p.z < zf - 0.05) {
        float sz = (zf - p.z) / max(L.z, 1e-3); vec3 h = p + L * sz;
        if (east > 0.5 || h.x > -41.5) vis *= archIn(h.x - xc, h.y, 17.5, 6.5, 8., soft + 0.012 * sz);
      }
    }
  }
  return vis;
}
float lineA(float d, float w, float fw) { return 1. - smoothstep(w - fw * 0.5, w + fw * 0.5, d); }
float fillA(float d, float fw) { return 1. - smoothstep(-fw * 0.5, fw * 0.5, d); }
float sdSeg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-8), 0., 1.); return length(pa - ba * h); }
// distance to an ellipse outline: radius r along x, r*s along y
float sdEl(vec2 p, float r, float s) {
  vec2 e = vec2(p.x, p.y / s); float l = max(length(e), 1e-5);
  float g = max(length(vec2(p.x, p.y / (s * s))) / l, 1e-3);
  return (l - r) / g;
}

// ---- the four grounds (plaster, travertine, terracotta, walnut); s = surface coordinates in metres
// bk = 1 in the open west bay, whose wall and piers the eye rounds at ten to twenty-five metres in plain daylight with no
// picture on them: there the same plaster and the same stone are worked further (their mean tone is not changed: every
// term added swings about nothing, and the crazing and the joints are hairlines)
vec3 ground(float m, vec2 s, float fs, float up, float bk) {
  vec3 c;
  if (m < 0.5) {            // trowelled lime plaster: float marks, long stains, hairline crazing
    float f = fbm(s * 0.11 + uSeed.xy), tr = vn(vec2(s.x * 0.5 + f * 2., s.y * 2.2) + uSeed.yx);
    float st = fbm(vec2(s.x * 0.21, s.y * 0.035) + 11.3);
    float cz = abs(vn(s * 1.15 + 31.7) - 0.5) + abs(vn(s * 0.63 - 9.2) - 0.5) * 0.8;
    float craze = (1. - smoothstep(0.004, 0.012 + fs * 0.6, cz)) * (1. - smoothstep(0.02, 0.07, fs));
    // (bay) the crazing stays a hairline, never wider than a pixel, and is not lost before fifty metres
    craze = mix(craze, (1. - smoothstep(0.004, 0.012 + fs * 0.6, cz)) * (1. - smoothstep(0.05, 0.14, fs)), bk);
    vec2 sd = vec2(s.x * 0.866 + s.y * 0.5, s.y * 0.866 - s.x * 0.5);
    float t2 = vn(vec2(sd.x * 0.3 + f * 3., sd.y * 1.5) + uSeed.zw), far = 1. - smoothstep(0.25, 0.9, fs);
    // float marks: short arcs of the trowel, one sweep per cell, at very low contrast
    vec2 tc = s / 2.7, ti = floor(tc), tf = fract(tc) - 0.5 + (h22(ti + uSeed.xy) - 0.5) * 0.7;
    float sw = sin(length(tf + vec2(1.1, -0.8) * (0.6 + 0.8 * h21(ti + 5.3))) * 23.) * (1. - smoothstep(0.3, 0.75, length(tf)));
    c = uPlaster * (0.93 + 0.1 * f + far * (0.05 * (tr - 0.5) + 0.04 * (t2 - 0.5) + 0.028 * sw) - 0.13 * smoothstep(0.5, 0.85, st)) * (1. - (0.12 + 0.07 * bk) * craze);
    if (bk > 0.) {
      // (bay) the float's broad sweeps: one fan of arcs to each stretch of wall a man works from one stance (5.4 m at four
      // times life), arcs a float's width apart (1.6 m); the trowel's streaks and short arcs are left standing a little prouder
      vec2 bc = s / 5.4, bi = floor(bc), bf = fract(bc) - 0.5 + (h22(bi + uSeed.zw) - 0.5) * 0.6;
      float bl = length(bf + vec2(-0.9, 1.3) * (0.7 + 0.6 * h21(bi + 2.7))), bw = sin(bl * 21.2) * (1. - smoothstep(0.35, 0.8, length(bf)));
      float keep = 1. - smoothstep(0.5, 1.6, fs);
      c *= 1. + bk * keep * (0.065 * bw + 0.045 * (tr - 0.5) + 0.04 * (t2 - 0.5) + 0.04 * sw + 0.02 * (vn(s * 0.9 + uSeed.yx) - 0.5));
    }
    c = mix(c, c * vec3(1.03, 0.98, 0.9), smoothstep(0.45, 0.85, st) * 0.6);
    vec2 gp = floor((s + 1.6 * vec2(vn(s * 0.21 + 3.), vn(s * 0.21 + 19.))) / vec2(7.5, 5.5));
    c *= 0.93 + 0.14 * h21(gp + uSeed.zw);   // the day's patches of the plasterer
  } else if (m < 1.5) {     // travertine in coursed blocks: joints, per-block tone, bedding streaks and pits
    vec2 g = vec2(s.x / 3.4, s.y / 1.55); g.x += 0.5 * mod(floor(g.y), 2.) + 0.13 * h21(vec2(floor(g.y), 3.));
    vec2 id = floor(g), f = fract(g);
    vec2 e = min(f, 1. - f) * vec2(3.4, 1.55);
    float j = 1. - smoothstep(0.03, 0.05 + fs, min(e.x, e.y)); j *= 0.03 / max(fs * 0.7, 0.03);
    float bed = vn(vec2(s.x * 0.35 + id.y * 3.1, s.y * 5.5)) * 0.6 + vn(vec2(s.x * 1.7, s.y * 14.) + id * 5.) * 0.4;
    float pit = smoothstep(0.62, 0.78, vn(vec2(s.x * 2.6, s.y * 9.) + id * 7.3)) * (1. - smoothstep(0.02, 0.06, fs));
    c = uStone * (0.9 + 0.14 * h21(id + uSeed.xy) + 0.08 * (bed - 0.5)) * (1. - 0.2 * j) * (1. - 0.16 * pit);
    if (bk > 0.) {
      // (bay) coursed travertine seen close: the joints stay drawn however far off, each block has its own tone, the bedding
      // shows as streaks, and along the beds lie the stone's open voids (about a metre by a quarter, four times life)
      float jb = (1. - smoothstep(0.03, 0.05 + fs * 1.2, min(e.x, e.y))) * (1. - smoothstep(0.25, 0.7, fs));
      float vd = smoothstep(0.64, 0.8, vn(vec2(s.x * 1.1 + id.y * 2.3, s.y * 5.2) + id * 3.1)) * (1. - smoothstep(0.08, 0.28, fs));
      c *= (1. + bk * (0.1 * (h21(id + uSeed.zw) - 0.5) + 0.11 * (bed - 0.5))) * (1. - bk * 0.24 * max(jb - 0.2 * j, 0.)) * (1. - bk * 0.2 * vd);
    }
  } else if (m < 2.5) {     // terracotta tiles 1.2 m square laid diagonally
    vec2 g = vec2(s.x + s.y, s.x - s.y) * (0.7071 / 1.2); vec2 id = floor(g), f = fract(g);
    vec2 e = min(f, 1. - f) * 1.2;
    float j = 1. - smoothstep(0.025, 0.04 + fs, min(e.x, e.y)); j *= 0.03 / max(fs * 0.6, 0.03);
    float w = fbm(s * 0.09 + 5.), hh = h21(id + uSeed.zw);
    c = uTile * (0.8 + 0.3 * hh + 0.12 * (w - 0.5) + 0.05 * (vn(s * 3.) - 0.5));
    c = mix(c, c * vec3(0.9, 0.93, 1.0), smoothstep(0.6, 0.95, hh) * 0.5);
    c = mix(c, uStone * 0.86, j * 0.75);
    c = mix(c, uPlaster * 0.8, smoothstep(0.62, 0.9, w) * 0.16);
    c = mix(c, uStone * 0.8, 0.1);
  } else {                   // dark walnut boards with iron studs
    float b = s.x / 1.05, id = floor(b), f = fract(b);
    float gr = vn(vec2(s.x * 7. + id * 9., s.y * 0.45 + id * 3.)) * 0.6 + vn(vec2(s.x * 19., s.y * 1.3)) * 0.4;
    float j = (1. - smoothstep(0.02, 0.035 + fs, min(f, 1. - f) * 1.05)) * 0.03 / max(fs * 0.6, 0.03);
    c = uWood * (0.75 + 0.3 * h21(vec2(id, 7.)) + 0.3 * (gr - 0.5)) * (1. - 0.5 * j);
    vec2 sg = fract(s / 1.6) - 0.5; float sd = length(sg) * 1.6;
    float stud = fillA(sd - 0.13, fs) * (1. - smoothstep(0.03, 0.09, fs));
    c = mix(c, vec3(0.045, 0.043, 0.045) + 0.09 * fillA(length(sg * 1.6 - vec2(-0.03, 0.04)) - 0.045, fs), stud);
  }
  return c;
}
`,M0=`
void lay(inout vec3 c, vec3 p, float a) { c = mix(c, p, clamp(a, 0., 1.)); }

// one ring of the armillary: front half umber with a chalk line beside it, back half thin sienna
void ringP(inout vec3 c, vec2 pp, float r, float s, float bk, float fw, float v) {
  float d = sdEl(pp, r, s), back = bk * fillA(-pp.y, fw);
  lay(c, uChalk, v * (1. - back) * lineA(abs(d + 0.0095), 0.0028, fw));
  lay(c, mix(uUmber, uSienna, back), v * lineA(abs(d), mix(0.0052, 0.0026, back), fw));
}
// picture 1: armillary sphere. uArm = (axis tilt, ecliptic angle, ring squash, radius)
float sphereP(inout vec3 c, vec2 q, float fw, float v) {
  float R = uArm.w, sq = uArm.z, l = length(q);
  vec2 ax = vec2(sin(uArm.x), cos(uArm.x)), ex = vec2(ax.y, -ax.x);
  vec2 p = vec2(dot(q, ex), dot(q, ax));
  float disc = fillA(l - R, fw);
  // the horizon band: a broad graduated ring far wider than the sphere, its far half passing behind the globe
  vec2 hp = vec2(q.x + 0.06 * q.y, q.y - 0.06 * q.x + 0.05 * R);
  float hs = 0.21, e1 = sdEl(hp, R * 1.66, hs), e2 = sdEl(hp, R * 1.43, hs), hb = fillA(e1, fw) * (1. - fillA(e2, fw)) * (1. - disc * fillA(-hp.y, fw));
  float ha = atan(hp.y / hs, hp.x + (abs(hp.x) + abs(hp.y) < 1e-5 ? 1e-4 : 0.)) * 28.6479, hfw = max(fwidth(ha), 1e-3);
  float hr = length(vec2(hp.x, hp.y / hs)) / R, hrw = max(fwidth(hr), 1e-4), hl = 1.49 + 0.055 * step(abs(fract(ha / 6. + 0.4167) - 0.5), 0.0834);
  float tick = (1. - smoothstep(0.1 - hfw, 0.1 + hfw, abs(fract(ha) - 0.5))) * (1. - smoothstep(hl - hrw, hl + hrw, hr));
  lay(c, mix(uSienna, uChalk, 0.3), v * hb * 0.86);
  lay(c, uUmber, v * hb * tick * (1. - smoothstep(0.35, 0.8, hfw)));
  lay(c, uUmber, v * hb * max(lineA(abs(e1 + 0.004), 0.0042, fw), lineA(abs(e2 - 0.004), 0.0036, fw)));
  lay(c, uChalk, v * (1. - disc * fillA(-hp.y, fw)) * lineA(abs(e1 - 0.0075), 0.0026, fw));
  lay(c, uSienna, v * disc * 0.3);
  lay(c, uSienna, v * disc * 0.42 * (1. - fillA(length(q - R * vec2(-0.2, 0.22)) - R * 0.97, fw)));
  float st = min(sdSeg(q, vec2(0., -R), vec2(0., -R * 1.13)) - 0.0065, sdSeg(q, vec2(-R * 0.24, -R * 1.16), vec2(R * 0.24, -R * 1.16)) - 0.005);
  lay(c, uUmber, v * fillA(st, fw));
  lay(c, uChalk, v * lineA(sdSeg(q, vec2(-R * 0.2, -R * 1.135), vec2(R * 0.2, -R * 1.135)), 0.0022, fw));
  float ce = cos(uArm.y), se = sin(uArm.y);
  ringP(c, p.yx * vec2(1., -1.), R * 0.985, 0.42, 1., fw, v);                       // colure
  ringP(c, vec2(ce * p.x + se * p.y, -se * p.x + ce * p.y), R * 0.985, sq * 0.8, 1., fw, v);   // ecliptic
  ringP(c, p - vec2(0., 0.43 * R), R * 0.9, sq, 1., fw, v);                          // tropics
  ringP(c, p + vec2(0., 0.43 * R), R * 0.9, sq, 1., fw, v);
  ringP(c, p, R * 0.985, sq, 1., fw, v);                                             // equator
  ringP(c, q, R, 1., 0., fw, v);                                                     // meridian
  lay(c, uUmber, v * lineA(sdSeg(p, vec2(0., -1.1 * R), vec2(0., 1.1 * R)), 0.004, fw));
  for (int i = 0; i < 2; i++) {
    vec2 e = p - vec2(0., (i == 0 ? 1.1 : -1.1) * R);
    lay(c, uSienna, v * fillA(length(e) - 0.0105, fw)); lay(c, uUmber, v * lineA(abs(length(e) - 0.0105), 0.002, fw));
  }
  float gr = R * 0.2;
  lay(c, uSienna, v * fillA(l - gr, fw));
  lay(c, uUmber, v * fillA(l - gr, fw) * (1. - fillA(length(q - gr * vec2(-0.22, 0.24)) - gr * 0.93, fw)));
  lay(c, uChalk, v * fillA(length(q - gr * vec2(-0.36, 0.36)) - gr * 0.22, fw));
  lay(c, uUmber, v * lineA(abs(l - gr), 0.0026, fw));
  return v * max(disc, hb * 0.7);
}

// picture 2: the loggia, opaque and unframed. uLog = its rectangle (left, right, bottom, top); uLog2 = (arch pitch,
// threshold line, springing line). g = floor coordinates in metres from the eye's foot point (perspective division
// by the eye's height above the floor), gF = fwidth(g). Below the threshold lies a wind-rose pavement, true on the
// real floor; above it four arches, through them a chequer running to the horizon, sea, sky and cloud bands.
float loggiaP(inout vec3 c, vec2 q, vec2 g, vec2 gF, float fw, float v) {
  float W = uLog2.x, yb = uLog2.y, ys = uLog2.z, pw = 0.03, ow = W * 0.5 - pw, top = ys + ow;
  float rg = (fbm(q * vec2(38., 90.) + uSeed.xy) - 0.5) * 0.02;
  float mask = v * fillA(uLog.x - q.x, fw) * fillA(q.x - uLog.y + rg, fw) * fillA(q.y - uLog.w, fw) * fillA(uLog.z - q.y, fw);
  float gw = max(gF.x, gF.y);
  // far pavement: a chequer of uChk metre squares, eased to its mean where a square falls under a pixel
  vec2 gc = g / uChk;
  float sx = clamp((abs(fract(gc.x * 0.5) - 0.5) - 0.25) / max(gF.x / uChk * 0.5, 1e-4), -0.5, 0.5) * 2.;
  float sy = clamp((abs(fract(gc.y * 0.5) - 0.5) - 0.25) / max(gF.y / uChk * 0.5, 1e-4), -0.5, 0.5) * 2.;
  float chk = mix(0.5 + 0.5 * sx * sy, 0.5, smoothstep(0.45, 1.3, gw / uChk));
  vec3 pave = mix(uUmber, uChalk, chk);
  // near pavement: a wind rose of rings and wedges about a point on the floor
  vec2 rp = g - uRose.xy; float rr = length(rp), ra = atan(rp.y, rp.x + (rr < 1e-4 ? 1. : 0.));
  float wa = ra * uRose.z / 6.2831853, wf = max(gw / max(rr, 1.) * uRose.z / 6.2831853, 1e-4);
  float w1 = clamp((abs(fract(wa) - 0.5) - 0.25) / wf, -0.5, 0.5) + 0.5;                    // wedges
  float w2 = clamp((abs(fract(wa * 2. + 0.25) - 0.5) - 0.25) / (wf * 2.), -0.5, 0.5) + 0.5;  // finer wedges, turned
  float pt = fillA(abs(fract(wa) - 0.5) * 2. - (1. - (rr - 6.) / 26.), max(wf * 2., 0.02));  // star points that taper outward
  vec3 rose = mix(uSienna, uChalk, pt);
  rose = mix(rose, uUmber, fillA(abs(rr - 6.) - 0.9, gw));
  rose = mix(rose, mix(uUmber, uChalk, w1), fillA(rr - 5.1, gw));
  rose = mix(rose, uUmber, fillA(abs(rr - 33.) - 1.1, gw));
  vec3 outer = mix(mix(uChalk, uSienna, w2), mix(uSienna, uChalk, 0.5), smoothstep(0.5, 1.5, wf * 2.));
  rose = mix(outer, rose, fillA(rr - 31.9, gw));
  rose = mix(rose, uChalk, fillA(abs(rr - 44.) - 0.7, gw));
  rose = mix(rose, uUmber, fillA(abs(rr - 46.2) - 1.5, gw));
  rose = mix(pave, rose, fillA(rr - 47.7, gw));
  float xc = mod(q.x - uLog.x, W) - W * 0.5, px = W * 0.5 - abs(xc), pc = xc - (xc < 0. ? -1. : 1.) * W * 0.5;
  float ar = length(vec2(xc, max(q.y - ys, 0.)));
  float below = fillA(q.y - yb, fw), low = fillA(q.y - ys, fw), gnd = fillA(q.y, fw);
  float open = fillA(ar - ow, fw) * (1. - below);
  // sky: slate blue, a paler band of sea on the horizon, chalk cloud bands
  vec3 sky = mix(uBlue, mix(uBlue, uChalk, 0.42), fillA(q.y - 0.022 - 0.006 * sin(q.x * 23. + uSeed.y), fw));
  float cb = abs(q.y - 0.075 - 0.014 * sin(q.x * 17. + uSeed.x * 6.)) - 0.009 * (0.55 + 0.45 * sin(q.x * 37. + 1.3));
  cb = min(cb, abs(q.y - 0.17 - 0.01 * sin(q.x * 11. + uSeed.z)) - 0.006 * (0.5 + 0.5 * sin(q.x * 29. + 4.)));
  cb = min(cb, abs(q.y - 0.355 - 0.02 * sin(q.x * 7. + uSeed.w)) - 0.014 * (0.45 + 0.55 * sin(q.x * 19. + 2.)));
  cb = min(cb, abs(q.y - 0.43 - 0.012 * sin(q.x * 9. + 1.)) - 0.008 * (0.5 + 0.5 * sin(q.x * 23.)));
  sky = mix(sky, uChalk, fillA(cb, fw));
  sky = mix(sky, uChalk, lineA(abs(q.y - 0.003), 0.0028, fw));
  vec3 inside = mix(sky, pave, gnd);
  float jamb = 1. - fillA(ar - (ow - 0.013), fw);                      // the arch's own thickness, one side in shade
  inside = mix(inside, mix(mix(uSienna, uChalk, 0.35), uUmber, fillA(-xc, fw)), jamb);
  // the wall: piers in sienna with an umber shade side, pale spandrels, chalk mouldings, an attic, then open sky
  vec3 wall = mix(mix(uSienna, uChalk, 0.5), uSienna, low);
  wall = mix(wall, uUmber, low * fillA(pc + pw * 0.15, fw));
  wall = mix(wall, uUmber, low * fillA(abs(q.y - (yb + 0.009)) - 0.009, fw));
  float mo = max(low * fillA(abs(q.y - (yb + 0.022)) - 0.0035, fw), fillA(abs(q.y - ys) - 0.006, fw));
  mo = max(mo, (1. - low) * lineA(abs(ar - (ow + 0.01)), 0.0052, fw));
  mo = max(mo, max(fillA(abs(q.y - (top + 0.018)) - 0.0048, fw), fillA(abs(q.y - (top + 0.046)) - 0.0045, fw)));
  float um = max((1. - low) * lineA(abs(ar - (ow + 0.019)), 0.002, fw), max(fillA(abs(q.y - (top + 0.0105)) - 0.0026, fw), fillA(abs(q.y - (ys - 0.0085)) - 0.0022, fw)));
  um = max(um, (1. - low) * fillA(max(abs(xc) - 0.011, abs(q.y - (top + 0.004)) - 0.014), fw));          // keystones
  um = max(um, fillA(abs(q.y - (top + 0.053)) - 0.0025, fw));
  wall = mix(wall, uSienna, fillA(top + 0.024 - q.y, fw) * (1. - mo));
  wall = mix(wall, uChalk, mo);
  wall = mix(wall, uUmber, um * (1. - mo));
  float roof = fillA(top + 0.0555 - q.y, fw);                           // above the cornice
  vec3 pic = mix(mix(wall, sky, roof), inside, open);
  pic = mix(pic, rose, below);
  pic = mix(pic, uChalk, fillA(abs(q.y - (yb - 0.0035)) - 0.0035, fw));   // the threshold
  lay(c, pic, mask);
  return mask * max(max(open * (1. - gnd), roof) * 0.8, max(below, open * gnd) * 0.5);
}

// one leaf of the wreath in cell coordinates p = (along the ring, outward)
void leafP(inout vec3 c, vec2 p, vec2 ctr, float ang, float a, float b, vec3 top, vec3 bot, float fw, float v) {
  vec2 d = p - ctr; float cs = cos(ang), sn = sin(ang);
  vec2 u = vec2(cs * d.x + sn * d.y, -sn * d.x + cs * d.y);
  float t = u.x / a, sd = abs(u.y) - b * (1. - t * t);
  lay(c, mix(bot, top, fillA(-u.y, fw)), v * fillA(sd, fw));
  lay(c, uUmber, v * 0.9 * max(lineA(abs(u.y), 0.0011, fw) * (1. - smoothstep(0.78, 0.86, abs(t))), lineA(abs(sd), 0.0009, fw)));
}
void cellP(inout vec3 c, vec2 q, float idx, float R, float fw, float v) {
  v *= mix(uLeafNear, 1., step(0.64, h21(vec2(mod(idx, uCells), 1.3) + uSeed.zw)));
  float N = uCells, ac = (idx + 0.5) * 6.2831853 / N, L = 6.2831853 * R / N;
  vec2 er = vec2(cos(ac), sin(ac)), et = vec2(-er.y, er.x);
  float dir = er.x < 0. ? -1. : 1.;
  vec2 p = vec2(dot(q, et) * dir, dot(q, er) - R);
  float h = h21(vec2(mod(idx, N), 3.7) + uSeed.xy), k = mod(idx, 2.);
  lay(c, uUmber, v * fillA(length(p - vec2(-0.5 * L, 0.004 * (h - 0.5))) - 0.0034, fw));
  leafP(c, p, vec2(0.12 * L, -0.0105), -0.40 + 0.16 * (h - 0.5), 0.98 * L, 0.0086, mix(uSienna, uChalk, k), mix(uUmber, uSienna, k), fw, v);
  leafP(c, p, vec2(0.12 * L, 0.0105), 0.40 - 0.16 * (h - 0.5), 0.98 * L, 0.0086, mix(uChalk, uSienna, k), mix(uSienna, uUmber, k), fw, v);
}
// picture 3: laurel wreath round the portal
float wreathP(inout vec3 c, vec2 q, float fw, float v) {
  float R = uWr, l = length(q);
  float band = fillA(abs(l - R) - 0.027, fw);
  if (l < 1e-4) return 0.;
  lay(c, uSienna, v * band * 0.16);
  lay(c, uUmber, v * lineA(abs(l - R), 0.0015, fw));
  float f = floor(atan(q.y, q.x) * uCells / 6.2831853);
  cellP(c, q, f - 1., R, fw, v); cellP(c, q, f + 1., R, fw, v); cellP(c, q, f, R, fw, v);
  return v * band;
}

// the glory: straight and flaming rays standing out from the wreath, and two ribbons flying from it (cast from V3 like the wreath)
float gloryP(inout vec3 c, vec2 q, float fw, float v) {
  float l = length(q); if (l < 0.27) return 0.;
  float N = 32., a = atan(q.y, q.x) * N / 6.2831853, id = floor(a), f = fract(a) - 0.5, k = mod(id, 2.);
  float r0 = uWr + 0.05, r1 = mix(0.66, 0.5, k) + 0.04 * (h21(vec2(id, 5.) + uSeed.xy) - 0.5);
  float tt = clamp((l - r0) / (r1 - r0), 0., 1.), wob = k * 0.07 * sin(tt * 11. + id) * tt;
  float hw = mix(0.22, 0.15, k) * (1. - tt * 0.92), af = max(fw * N / (6.2831853 * l), 1e-4), d = abs(f - wob) - hw;
  float ray = fillA(d, af) * step(r0, l) * (1. - smoothstep(r1 - fw, r1, l)), wash = 0.;
  lay(c, mix(mix(uSienna, uChalk, 0.25 + 0.4 * k), uChalk, fillA(f - wob, af)), v * ray);
  lay(c, mix(uUmber, uSienna, 0.35), v * step(r0, l) * (1. - smoothstep(r1 - fw, r1, l)) * lineA(abs(d) * 6.2831853 * l / N, 0.0014, fw) * (1. - smoothstep(0.92, 1., tt)));
  wash = ray;
  for (int i = 0; i < 2; i++) {      // ribbons: one east and low, one west and high
    float sg = i == 0 ? 1. : -1., x = sg * q.x - 0.27;
    float yc = (i == 0 ? -0.2 : 0.2) + 0.085 * sin(x * 9. + uSeed.x + float(i) * 2.) + 0.16 * x, sl = 0.085 * 9. * cos(x * 9. + uSeed.x + float(i) * 2.) + 0.16;
    float rd = abs(q.y - yc) / sqrt(1. + sl * sl) - 0.02 * (1. - smoothstep(0.42, 0.6, x));
    float on = fillA(rd, fw) * smoothstep(0., 0.02, x);
    lay(c, mix(uBlue, mix(uChalk, uBlue, 0.25), step(0., sl * sg)), v * on);
    lay(c, uUmber, v * smoothstep(0., 0.02, x) * lineA(abs(rd), 0.002, fw));
    wash = max(wash, on);
  }
  return v * wash * 0.6;
}

// the glory's overspill: long rays and a ribbon falling from the porch down the court's north and west walls and over the
// landing behind the fountain wall, cast from the point where the flight comes out over the court (u 0.77); a region test,
// like the doorcase. On the north wall they fan from a point above its parapet, under the porch.
float fanP(inout vec3 c, vec2 q, float fw, float v) {
  float l = length(q); if (l < 0.1 || l > 1.12 || v <= 0.) return 0.;
  float ang = atan(q.y, q.x), N = 32., a = ang * N / 6.2831853, id = floor(a), f = fract(a) - 0.5, k = mod(id, 2.);
  float r1 = mix(1.04, 0.74, k) + 0.1 * (h21(vec2(id, 9.) + uSeed.zw) - 0.5);
  float tt = clamp((l - 0.1) / (r1 - 0.1), 0., 1.), wob = k * 0.11 * sin(tt * 17. + id);
  float hw = mix(0.24, 0.18, k) * (1. - 0.5 * tt), af = max(fw * N / (6.2831853 * l), 1e-4), d = abs(f - wob) - hw;
  float end = 1. - smoothstep(r1 - 0.03, r1, l), ray = fillA(d, af) * end;
  lay(c, mix(mix(uSienna, uChalk, 0.15 + 0.5 * k), uChalk, fillA(f - wob, af)), v * ray);
  lay(c, mix(uUmber, uSienna, 0.3), v * end * lineA(abs(d) * 6.2831853 * l / N, 0.0022, fw));
  float wv = ang * 7. + uSeed.x, rr = 0.34 + 0.045 * sin(wv), rd = abs(l - rr) / sqrt(1. + 0.1 * cos(wv) * cos(wv)) - 0.021;
  float on = fillA(rd, fw);
  lay(c, mix(uBlue, mix(uChalk, uBlue, 0.25), step(0., cos(wv))), v * on);
  lay(c, uUmber, v * lineA(abs(rd), 0.002, fw));
  return v * max(ray, on) * 0.6;
}

// picture 0: an astrolabe in the mouth of the cellar, whole only from the entry point, drawn BOLD in broad fields of the
// look's own paints: a limb of sienna and chalk with degree ticks and a blue quarter in every other house; a blue sea with a
// pale wave line between the limb and an eccentric zodiac ring of twelve houses, alternately chalk and sienna; almucantar
// arcs on the bare ground inside that ring; eight star pointers standing in from the limb, the two on the upright long (they
// run far down the vault and the floor); and at its heart the mater's plate. Nothing lettered.
// It is worked out as a LAYER OF ITS OWN (c.rgb the paint, c.a how much of the surface still shows through it), which main
// lays by THE RULE OF THE SURFACE: inside the cellar the painter paints plaster and tile and leaves dressed stone alone
// (see where main calls it); everywhere else the layer goes straight onto whatever it meets.
void lay(inout vec4 c, vec3 p, float a) { a = clamp(a, 0., 1.); c = vec4(mix(c.rgb, p, a), c.a * (1. - a)); }
float astroP(inout vec4 c, vec2 q, float fw, float v) {
  float R = 0.33; vec2 p = q - vec2(0., -0.015); float l = length(p);
  if (l > R + 0.02) return 0.;
  float hole = fillA(l - 0.118, fw), wash = 0.;
  float a = atan(p.y, p.x + (l < 1e-5 ? 1e-3 : 0.)) * 57.29578, afw = max(fw * 57.29578 / max(l, 0.02), 1e-3);
  // the sea between the zodiac ring and the limb
  vec2 pe = p - vec2(0.05 * R, 0.2 * R); float le = length(pe), ecl = le - 0.6 * R;
  float limb = fillA(abs(l - 0.93 * R) - 0.07 * R, fw), inner = fillA(l - 0.86 * R, fw);
  lay(c, uBlue, v * inner * (1. - fillA(ecl, fw)) * (1. - hole) * 0.92);
  lay(c, mix(uBlue, uChalk, 0.75), v * inner * (1. - hole) * fillA(abs(p.y + 0.05 * R - 0.03 * sin(p.x * 40. + uSeed.x)) - 0.012, fw) * (1. - fillA(ecl, fw)));
  // almucantars: nested arcs about a low centre, in umber on the bare plaster inside the zodiac ring
  vec2 pa = p + vec2(0., 0.3 * R);
  for (int i = 0; i < 3; i++) { float ra = (0.3 + 0.2 * float(i)) * R; lay(c, mix(uUmber, uSienna, 0.3), v * inner * (1. - hole) * fillA(ecl, fw) * lineA(abs(length(pa) - ra), 0.0034, fw)); }
  // zodiac ring: an opaque band, twelve houses alternately chalk and sienna
  float eb = fillA(abs(ecl) - 0.055 * R, fw), ea = atan(pe.y, pe.x + (le < 1e-5 ? 1e-3 : 0.)) * 57.29578, ef = max(fw * 57.29578 / max(le, 0.02), 1e-3);
  float house = clamp((abs(fract(ea / 60.) - 0.5) - 0.25) * 60. / ef, -0.5, 0.5) + 0.5;
  lay(c, mix(uSienna, uChalk, house), v * eb * (1. - hole));
  lay(c, uUmber, v * (1. - hole) * lineA(abs(abs(ecl) - 0.055 * R), 0.0022, fw));
  // limb: sienna and chalk, degree ticks, a blue quarter in every other house
  float tick = 1. - smoothstep(0.9 - afw, 0.9 + afw, abs(fract(a / 5.) - 0.5) * 5.), seg = clamp((abs(fract(a / 60. + 0.25) - 0.5) - 0.25) * 60. / afw, -0.5, 0.5) + 0.5;
  lay(c, mix(mix(uSienna, uChalk, 0.45), uBlue, seg * fillA(0.93 * R - l, fw)), v * limb);
  lay(c, uUmber, v * limb * tick * fillA(l - 0.93 * R, fw) * (1. - smoothstep(0.5, 1.2, afw)));
  lay(c, uUmber, v * max(lineA(abs(l - R), 0.003, fw), max(lineA(abs(l - 0.86 * R), 0.0026, fw), lineA(abs(l - 0.93 * R), 0.0016, fw))));
  lay(c, uChalk, v * lineA(abs(l - 1.03 * R), 0.0022, fw));
  // star pointers standing in from the limb; the two on the upright run on to the middle
  float sa = fract(a / 45. + 0.5) - 0.5, up = step(abs(abs(a) - 90.), 22.5), len = mix(0.42, 0.8, up) * R;
  float st = clamp((0.86 * R - l) / len, 0., 1.), sd = abs(sa) * 45. - mix(5.5, 4., up) * (1. - st) * (0.86 * R) / max(l, 0.03);
  float star = fillA(sd, afw) * fillA(l - 0.86 * R, fw) * step(l, 0.86 * R) * (1. - smoothstep(0.985, 1., st));
  lay(c, mix(uSienna, uChalk, fillA(sa * 45., afw)), v * star);
  lay(c, uUmber, v * fillA(l - 0.86 * R, fw) * (1. - smoothstep(0.96, 1., st)) * lineA(abs(sd) * l / 57.29578, 0.002, fw));
  wash = max(max(limb, eb * (1. - hole)), max(star, inner * (1. - fillA(ecl, fw)) * (1. - hole)));
  // the mater's plate inside the rete: broad rings that fall on the last bays of the cellar (their floor and vaults; main
  // keeps them off the piers and the end arch, which are stone) and, at its heart, on stair A: a scale ring, a blue ring of star points, a compass ring, a quartered boss
  // and the pin; over all of it the rule, a long bar from limb to limb
  if (l < 0.3) {
    float a12 = clamp((abs(fract(a / 30. + 0.25) - 0.5) - 0.25) * 30. / afw, -0.5, 0.5) + 0.5;
    float a16 = clamp((abs(fract(a / 45.) - 0.5) - 0.25) * 45. / afw, -0.5, 0.5) + 0.5;
    float a8 = clamp((abs(fract(a / 90.) - 0.5) - 0.25) * 90. / afw, -0.5, 0.5) + 0.5;
    vec3 pc = mix(mix(uSienna, uChalk, 0.5), uChalk, a12);                                   // scale ring
    float z2 = fillA(l - 0.09, fw), z1 = fillA(l - 0.058, fw), z0 = fillA(l - 0.04, fw);
    float pa2 = fract(a / 45.) - 0.5, tp = clamp((l - 0.058) / 0.03, 0., 1.);
    float pt = fillA(abs(pa2) * 45. - 10.5 * (1. - tp), afw) * (1. - smoothstep(0.93, 1., tp));
    pc = mix(pc, mix(uBlue, mix(uChalk, uSienna, fillA(pa2 * 45., afw)), pt), z2);            // blue ring, eight star points
    pc = mix(pc, mix(uSienna, uChalk, a16), z1);                                              // compass ring
    pc = mix(pc, mix(mix(uSienna, uUmber, 0.22), mix(uChalk, uSienna, 0.1), a8), z0);         // quartered boss
    float rims = max(max(lineA(abs(l - 0.118), 0.0024, fw), lineA(abs(l - 0.09), 0.002, fw)), max(lineA(abs(l - 0.058), 0.002, fw), lineA(abs(l - 0.04), 0.0024, fw)));
    pc = mix(pc, uUmber, rims);
    pc = mix(pc, uChalk, max(lineA(abs(l - 0.1125), 0.0016, fw), lineA(abs(l - 0.0455), 0.0014, fw)) * (1. - rims));
    lay(c, pc, v * hole);
    // the rule
    vec2 re = vec2(0.8829, 0.4695); float ru = dot(p, re), rv = abs(dot(p, vec2(-re.y, re.x)));
    float rw = 0.0105 * (1. - smoothstep(0.2, 0.283, abs(ru))), rule = fillA(rv - rw, fw) * step(abs(ru), 0.283);
    lay(c, mix(uChalk, mix(uSienna, uChalk, 0.25), fillA(dot(p, vec2(-re.y, re.x)), fw)), v * rule);
    lay(c, uUmber, v * step(abs(ru), 0.283) * max(lineA(abs(rv - rw), 0.0017, fw), lineA(rv, 0.0011, fw) * step(0.03, abs(ru))));
    // the pin
    lay(c, mix(uSienna, uChalk, 0.3), v * fillA(l - 0.0135, fw)); lay(c, uSienna, v * fillA(l - 0.0135, fw) * (1. - fillA(length(p - vec2(-0.003, 0.0032)) - 0.0125, fw)));
    lay(c, uUmber, v * max(lineA(abs(l - 0.0135), 0.002, fw), fillA(l - 0.0036, fw)));
    wash = max(wash, max(hole, rule));
  }
  return v * wash * 0.7;
}
// the doorcase: columns on pedestals, an entablature with a blue frieze and a pediment round the door at the head of
// stair B, cast from the stair's foot; its pedestals and steps run down the treads and along the parapets as long stripes
float doorP(inout vec3 c, vec2 q, float fw, float v) {
  float sx = q.x + 0.0125; vec2 p = vec2(abs(sx), q.y);
  if (p.x > 0.56 || p.y > 0.8) return 0.;
  float u = (p.x - 0.375) / 0.045 * (sx < 0. ? -1. : 1.), w = 0.;
  float shaft = fillA(abs(p.x - 0.375) - 0.045, fw) * fillA(p.y - 0.47, fw);
  vec3 sc = mix(mix(mix(uSienna, uChalk, 0.55), uSienna, fillA(-0.35 - u, fw * 22.)), uUmber, fillA(0.42 - u, fw * 22.));
  sc = mix(sc, mix(uSienna, uChalk, 0.3), fillA(p.y + 0.125, fw) * 0.6);                       // the pedestal and its long run below
  lay(c, sc, v * shaft); w = shaft;
  float blocks = fillA(abs(p.x - 0.375) - 0.058, fw) * max(fillA(abs(p.y + 0.105) - 0.02, fw), fillA(abs(p.y - 0.485) - 0.02, fw));
  lay(c, uChalk, v * blocks); lay(c, uUmber, v * fillA(abs(p.x - 0.375) - 0.058, fw) * max(lineA(abs(p.y + 0.125), 0.003, fw), lineA(abs(p.y - 0.465), 0.003, fw)));
  float ent = fillA(p.x - 0.47, fw) * fillA(abs(p.y - 0.553) - 0.048, fw);
  vec3 ec = mix(uChalk, uBlue, fillA(abs(p.y - 0.555) - 0.022, fw)); ec = mix(ec, uSienna, fillA(0.578 - p.y, fw));
  lay(c, ec, v * ent); lay(c, uUmber, v * fillA(p.x - 0.47, fw) * max(lineA(abs(p.y - 0.505), 0.0028, fw), lineA(abs(p.y - 0.601), 0.0028, fw)));
  float ped = 0.601 + 0.3 * (0.5 - p.x), tri = fillA(p.y - ped, fw) * fillA(0.601 - p.y, fw) * fillA(p.x - 0.5, fw);
  float rim = 1. - fillA(p.y - ped + 0.028, fw) * fillA(0.625 - p.y, fw);
  lay(c, mix(uBlue, mix(uSienna, uChalk, 0.35), rim), v * tri); lay(c, uUmber, v * fillA(p.x - 0.5, fw) * fillA(0.601 - p.y, fw) * lineA(abs(p.y - ped) * 0.958, 0.003, fw));
  lay(c, uChalk, v * tri * fillA(length(vec2(sx, q.y - 0.668)) - 0.034, fw)); lay(c, uUmber, v * lineA(abs(length(vec2(sx, q.y - 0.668)) - 0.034), 0.0022, fw));
  float pod = fillA(p.x - 0.31, fw) * fillA(abs(p.y + 0.168) - 0.034, fw);
  lay(c, mix(uSienna, uChalk, fillA(-0.15 - p.y, fw)), v * pod); lay(c, uUmber, v * fillA(p.x - 0.31, fw) * lineA(abs(p.y + 0.2), 0.0028, fw));
  return v * max(max(w, ent), max(tri, pod)) * 0.6;
}

// tiny true pictures painted flat on the surface: ship, tower, tree, harbour mole (one per 5 m cell)
float vignette(vec2 s, float fs) {
  vec2 g = s / 3.6, id = floor(g); vec2 jt = h22(id + uSeed.zw);
  vec2 p = ((fract(g) - 0.5) * 3.6 - (jt - 0.5) * 0.9) * 1.25; fs *= 1.25;
  float sc = mix(0.55, 1.2, h21(id + 9.1 + uSeed.xy)), ra = (h21(id + 3.3 + uSeed.yx) - 0.5) * 1.1, cr = cos(ra), sr = sin(ra);
  p = vec2(cr * p.x - sr * p.y, sr * p.x + cr * p.y) / sc; fs /= sc;      // each its own size and tilt
  float k = floor(fract(jt.x * 13.7 + jt.y * 7.3 + id.x * 0.37 + id.y * 0.61) * 6.), d = 1e3;
  if (k < 0.5) {            // ship under sail
    d = max(abs(p.x) - (1.15 + (p.y + 0.5) * 0.7), abs(p.y + 0.72) - 0.2);
    d = min(d, max(abs(p.x) - 0.05, abs(p.y - 0.3) - 0.85));
    d = min(d, max(max(p.x + 0.12, -0.38 - p.y), (p.y + 0.38) - (p.x + 0.95) * 1.6) * 0.6);
    d = min(d, max(max(0.12 - p.x, -0.38 - p.y), (p.y + 0.38) - (0.85 - p.x) * 1.96) * 0.5);
    d = min(d, sdSeg(p, vec2(0.05, 1.12), vec2(0.5, 1.02)) - 0.05);
  } else if (k < 1.5) {     // tower
    d = max(abs(p.x) - 0.42, abs(p.y + 0.2) - 0.75);
    d = min(d, max(abs(p.x) - 0.56, abs(p.y - 0.62) - 0.08));
    d = min(d, max(max(abs(p.x) - 0.56, abs(p.y - 0.82) - 0.13), 0.22 - abs(fract(p.x * 2.6 + 0.5) - 0.5)));
    d = max(d, -max(abs(p.x) - 0.1, abs(p.y - 0.1) - 0.18));
  } else if (k < 2.5) {     // tree
    d = max(abs(p.x) - 0.08, abs(p.y + 0.5) - 0.48);
    d = min(d, min(length(p - vec2(0., 0.42)) - 0.52, min(length(p - vec2(-0.42, 0.05)) - 0.36, length(p - vec2(0.42, 0.08)) - 0.36)));
  } else if (k < 3.5) {     // harbour mole with its beacon
    d = max(abs(p.x + 0.2) - 1.25, abs(p.y + 0.78) - 0.16);
    d = min(d, max(abs(p.x - 0.85) - 0.14, abs(p.y + 0.2) - 0.45));
    d = min(d, length(p - vec2(0.85, 0.42)) - 0.15);
    d = min(d, abs(p.y + 1.15 - 0.05 * sin(p.x * 7.)) - 0.035 + max(abs(p.x) - 1.3, 0.));
  } else if (k < 4.5) {     // wind star of eight points
    float r = length(p), a = atan(p.y, p.x + (r < 1e-4 ? 1e-3 : 0.));
    d = (r - 0.3 - 0.75 * pow(abs(cos(a * 4.)), 7.) * (0.6 + 0.4 * step(0.5, abs(cos(a * 2.))))) * 0.5;
    d = max(d, 0.1 - r);
  } else {                   // bridge of three arches over a line of water
    d = max(abs(p.x) - 1.35, abs(p.y + 0.25) - 0.5);
    d = max(d, -(length(vec2(mod(p.x + 1.35, 0.9) - 0.45, p.y + 0.75)) - 0.33));
    d = min(d, abs(p.y + 0.95 - 0.04 * sin(p.x * 8.)) - 0.03 + max(abs(p.x) - 1.5, 0.));
  }
  float sea = abs(p.y + 1.02 - 0.04 * sin(p.x * 6. + id.x)) - 0.03 + max(abs(p.x) - 1.5, 0.);
  if (k < 0.5) d = min(d, sea);
  return fillA(d, fs);
}
`,C0=`
uniform float uWet, uMirOff, uCloud; uniform vec3 uSky, uShade;
void main() {
  // picture coordinates and every derivative first
  vec3 d0 = vP - uV[0], d1 = vP - uV[1], d2 = vP - mix(uV[2], uVm, uMir);
  float t0 = dot(d0, uAx[0]), t1 = dot(d1, uAx[1]), t2 = dot(d2, uAx[2]);
  vec2 q0 = vec2(dot(d0, uRt[0]), dot(d0, uUp[0])) / max(t0, 1e-4);
  vec2 q1 = vec2(dot(d1, uRt[1]), dot(d1, uUp[1])) / max(t1, 1e-4);
  vec2 q2 = vec2(dot(d2, uRt[2]), dot(d2, uUp[2])) / max(t2, 1e-4);
  q2.y -= uMir * uMirOff;
  // the second wreath trembles with the water: its picture is pushed about by the slope of the ripples at the place where
  // the line of sight meets the water, so the ripples are seen to cross it (0.013: a ripple at its steepest moves a leaf of
  // the wreath by about a quarter of the wreath band's width)
  if (uMir > 0.5) {
    vec3 rdm = vL - uEye; vec2 hm = uEye.xz + rdm.xz * ((uWater - uEye.y) / min(rdm.y, -1e-4));
    q2 += 0.013 * ripSlope(clamp(hm, vec2(-400.), vec2(400.)), uTime);
  }
  float f0 = clamp(length(fwidth(q0)) * 0.75, 1e-5, 1.), f1 = clamp(length(fwidth(q1)) * 0.75, 1e-5, 1.), f2 = clamp(length(fwidth(q2)) * 0.75, 1e-5, 1.);
  vec2 q5d = (vP.xy - vec2(24.5, 23.)) / max(vP.z + 166., 1e-4); float f5 = clamp(length(fwidth(q5d)) * 0.75, 1e-5, 1.);
  vec3 d3 = vP - uV0; float t3 = -d3.z; vec2 q3 = d3.xy / max(t3, 1e-4); float f3 = clamp(length(fwidth(q3)) * 0.75, 1e-5, 1.);
  vec2 g = vec2(q1.x, 1.) / max(-q1.y, 1e-3) * uEyeH; vec2 gF = fwidth(g);
  vec3 d6 = vP - uV6; float t6 = dot(d6, uAx6); vec2 q6 = vec2(dot(d6, uRt6), dot(d6, uUp6)) / max(t6, 1e-4); float f6 = clamp(length(fwidth(q6)) * 0.75, 1e-5, 1.);
  vec3 an = abs(vN);
  vec2 s = an.y > 0.7 ? vP.xz : (an.x > an.z ? vP.zy : vP.xy);
  float fs = clamp(max(fwidth(s).x, fwidth(s).y), 1e-4, 4.), fv = clamp(max(fwidth(vP.x), fwidth(vP.z)), 1e-4, 4.);
  if (uMir > 0.5) {          // the copy under the water: only what is seen through the water rectangle
    vec3 rd = vL - uEye;
    if (vP.y < uWater + 0.05 || uEye.y < uWater + 0.1) discard;
    float k = (uWater - uEye.y) / min(rd.y, -1e-4);
    vec2 h = uEye.xz + rd.xz * k;
    if (h.x < uBasin.x || h.x > uBasin.y || h.y < uBasin.z || h.y > uBasin.w) discard;
  }
  float m = floor(vD.x + 0.5);
  // the open west bay: its wall, floor edge to parapet, and the arcade's piers and arches, fading out through the arcade's
  // thickness to nothing on the gallery's face; the roof stair and its parapets, which stand in the bay, are left as they were
  float bay = step(${(qe.x0-.4).toFixed(1)}, vP.x) * (1. - smoothstep(${_t.xa.toFixed(1)}, ${_t.xb.toFixed(1)}, vP.x)) * step(${(qe.z0-.6).toFixed(1)}, vP.z) * step(vP.z, ${(qe.z1+.6).toFixed(1)}) * step(${(qe.y0-.1).toFixed(1)}, vP.y) * step(vP.y, ${(qe.y1+.1).toFixed(1)}) * (1. - uMir)
    * (1. - step(${(Ie.x0-.1).toFixed(1)}, vP.x) * step(vP.x, ${(Ie.x1+.1).toFixed(1)}) * step(${(Ie.z0+.3).toFixed(1)}, vP.z) * step(vP.z, ${(Ie.z1+.1).toFixed(1)}));
  vec3 col = ground(m, s, fs, an.y, bay);
  // THE CELLAR BY PLACE (z 4.4 .. -124, below y 17.2; it fades out through the thickness of its two end arches, so the south
  // front and the court's side of the end arch are as they were). Three materials told apart at a glance: lime plaster with
  // a broad figure on the vault webs, travertine a little darker and cooler than the plaster with its courses drawn, tiles
  // with their joints and each tile's own tone. pA and pB say how plaster and tile figure a paint laid on them (a paint p
  // shows as p * pA + pB): the same strips, hair joints, tile tones and tile joints as on the bare surface.
  float cel = (1. - smoothstep(1.5, 4.4, vP.z)) * smoothstep(-126.4, -122., vP.z) * step(vP.y, 17.2) * (1. - uMir);
  float pA = 1.; vec3 pB = vec3(0.);
  if (cel > 0.) {
    if (m < 0.5) {
      vec2 sv = vN.y < -0.05 ? vP.xz : s;
      float fg = fbm(sv * 0.045 + uSeed.zw) - 0.5, sk = vn(vec2(sv.x * 0.55 + 3., sv.y * 0.06) + uSeed.xy) - 0.5;
      pA = 1. + cel * (0.2 * fg + 0.1 * sk); col *= pA;
      if (vN.y < -0.05) {   // the vault was floated in strips along the barrel, a day's work at a time: each strip its own tone, a hair joint between
        float bx = vP.x / 4.4 + 0.3, bi = floor(bx), bz = vP.z / 7.75 + h21(vec2(bi, 5.1));
        float jd = min(min(fract(bx), 1. - fract(bx)) * 4.4, min(fract(bz), 1. - fract(bz)) * 7.75);
        float st = 1. + cel * (0.11 * (h21(vec2(bi, floor(bz)) + uSeed.xy) - 0.5) - 0.13 * (1. - smoothstep(0.03, 0.09 + fv, jd)) * (1. - smoothstep(0.4, 1.2, fv)));
        col *= st; pA *= st;
      }
    } else if (m < 1.5) {
      vec2 cg = vec2(s.x / 3.4, s.y / 1.55); cg.x += 0.5 * mod(floor(cg.y), 2.) + 0.13 * h21(vec2(floor(cg.y), 3.));
      vec2 ci = floor(cg), cf = fract(cg), ce = min(cf, 1. - cf) * vec2(3.4, 1.55);
      float cj = (1. - smoothstep(0.035, 0.085 + fs * 1.1, min(ce.x, ce.y))) * (1. - smoothstep(0.3, 0.9, fs));
      col *= mix(vec3(1.), vec3(0.88, 0.9, 0.93) * (1. + 0.16 * (h21(ci + uSeed.zw) - 0.5)) * (1. - 0.24 * cj), cel);
    } else if (m < 2.5) {
      vec2 tg = vec2(s.x + s.y, s.x - s.y) * (0.7071 / 1.2), ti = floor(tg), tf = fract(tg), te = min(tf, 1. - tf) * 1.2;
      float tj = (1. - smoothstep(0.03, 0.06 + fs * 1.2, min(te.x, te.y))) * (1. - smoothstep(0.25, 0.8, fs));
      float tt = 0.88 + 0.24 * h21(ti + 7.7);
      col = mix(col, mix(col * tt, uStone * 0.62, 0.5 * tj), cel);
      pA = mix(1., tt * (1. - 0.5 * tj), cel); pB = uStone * (0.31 * tj * cel);
    }
  }
  // a cloud's tone drifting over the bay's wall: the plaster's own tone a little lighter, then a little darker, in soft
  // fields some twenty metres across that slide along the wall and down it at walking pace (nine parts in a hundred each way)
  float bcl = vn(vec2(vP.z * 0.045 + uTime * 0.11, vP.y * 0.06 - uTime * 0.05) + uSeed.xy) + 0.5 * vn(vec2(vP.z * 0.11 - uTime * 0.07, (vP.x + vP.y) * 0.09 + uTime * 0.04) + uSeed.zw);
  col *= 1. + bay * step(m, 1.5) * 0.18 * (smoothstep(0.3, 1.2, bcl) - 0.5);
  // drifting cloud tone: soft-edged bands that only ever darken, sliding over the plan; weaker where little sky reaches
  float cl = vn(vP.xz * 0.016 + vec2(uTime * 0.3, uTime * 0.1)) + 0.5 * vn(vP.xz * 0.04 + vec2(uTime * 0.42, -uTime * 0.13) + 7.3);
  float amb = vD.y * (1. - uCloud * 0.5 * (0.45 + 0.55 * smoothstep(0.2, 0.75, vD.y)) * (0.2 * cl + smoothstep(0.66, 0.96, cl)));
  // the low sun: a lit side and a shade side on every block, cast shadows from the baked map, a warm lift from sunlit floors
  vec3 nn = vN / max(length(vN), 1e-4); float ndl = dot(nn, uSunDir);
  float sun = sunVis(vP + nn * 0.12, ndl) * smoothstep(0.02, 0.3, ndl) * (0.62 + 0.38 * ndl) * (1. - uCloud * smoothstep(0.6, 0.95, cl));
  vec3 light = (amb * uAmb * mix(uShade, vec3(1.), smoothstep(0.2, 0.85, amb)) + sun * uSunCol) * uBright; float lit = dot(light, vec3(0.3, 0.5, 0.2));
  // THE CELLAR'S OWN LIGHT, by place. A painter's liberty, said plainly: the world's sun stands too high and too far south to
  // reach more than the lane's first metres, so inside the cellar the sun is taken lower and further west (uCSun, one
  // direction for every look) and comes in under the west arches.
  // Its bars lie across the lane, warm and clear-edged, three to four times the light of the shade beside them, with the piers'
  // shadows between them cool; the sunward faces of the lane's piers carry the same light. Each sunlit patch of tiles throws a warm lift
  // onto the vault above it and the pier faces beside it, so the bars are read overhead too. The shade deepens toward
  // the crown of the vault, and deepens and cools toward the lane's far end; the end arch (soffit, jambs and the face it
  // turns to the lane: from the middle of the last bay, z -108.5, to the arch's lane face, z -121.5) stands in shade, so
  // that the court beyond it is the brightest thing on the axis, and whatever there is not floor and is not turned back
  // to the lane takes a warm lift from the sunlit court floor beyond it (crt: from z -116 northward, strongest low down);
  // the tiles keep the daylight that spills in over them. Leaf shade from the garden's trees stirs in the bars. The
  // cellar's zone fades out through the end arch, so the first 2.4 m of the court's floor and side walls beyond it still
  // take a falling share of the cellar's light.
  float bar = 0.;
  if (cel > 0.) {
    float ndc = dot(nn, uCSun);
    bar = cellarSun(vP + nn * 0.1, 0.1) * smoothstep(0.02, 0.15, ndc) * (0.95 + 0.4 * ndc) * (1. - uCloud * smoothstep(0.6, 0.95, cl));
    // the garden's trees stand in the low sun before the arches: their leaves' shade stirs in the bars (hd = where the ray
    // to the sun leaves the arcade's outer face: broad masses that sway, small flecks that flicker)
    float sxd = max((-46.5 - vP.x) / min(uCSun.x, -1e-3), 0.); vec2 hd = vP.zy + uCSun.zy * sxd;
    float lfA = vn(vec2(hd.x * 0.2 + 0.7 * sin(uTime * 0.9 + hd.x * 0.07), hd.y * 0.28 + 0.4 * sin(uTime * 1.2 + hd.x * 0.13)) + uSeed.xy);
    float lfB = vn(vec2(hd.x * 0.75 + 0.5 * sin(uTime * 2.1 + hd.x * 0.31), hd.y * 0.9 + 0.4 * sin(uTime * 2.6 + hd.y * 0.4)) + uSeed.zw);
    float dap = smoothstep(0.44, 0.7, 0.68 * lfA + 0.32 * lfB) * smoothstep(0.28, 0.5, vn(vec2(hd.x * 0.03, 7.3) + uSeed.zw));
    bar *= 1. - 0.85 * dap;
    float bnc = cellarSun(vec3(vP.x, 0.1, vP.z), 5.) * (1. - 0.6 * dap) * (nn.y > 0.5 ? 0. : (nn.y < -0.2 ? 0.5 : 0.55 * exp(-vP.y / 8.)));
    float dzp = vP.z > -14.5 ? abs(vP.z - 2.) : abs(mod(-(vP.z + 15.5), 31.) - 15.5), dxa = min(abs(vP.x + 41.5), abs(vP.x + 6.5));
    float pool = smoothstep(2.5, 4.5 + 0.5 * dxa, dzp) * exp(-dxa / 15.);
    float flr = step(0.5, nn.y), deep = 1. - smoothstep(-116., -24., vP.z), crown = smoothstep(9., 16.5, vP.y) * step(nn.y, -0.05);
    float endA = (1. - smoothstep(-121.5, -108.5, vP.z)) * (1. - flr);
    float ambC = max(amb, 0.) * (0.8 + 0.45 * pool) * (1. - 0.22 * crown) * (1. - 0.16 * deep * (1. - flr)) * (1. - 0.3 * endA);
    vec3 shd = mix(vec3(0.88, 0.96, 1.1), vec3(0.8, 0.93, 1.14), max(deep * (1. - flr), endA));
    float crt = (1. - smoothstep(-124., -116., vP.z)) * (1. - flr) * step(nn.z, 0.3) * (1. - smoothstep(4., 17., vP.y) * 0.6);   // the sunlit court floor's lift near the end arch
    vec3 lc = (ambC * uAmb * shd + bar * uSunCol * vec3(1.06, 0.98, 0.88) + (bnc + 0.3 * crt) * uSunCol * (uTile * 1.1 + 0.25)) * uBright;
    light = mix(light, lc, cel);
  }
  if (m > 1.5 && m < 2.5 && vP.y > 51. && an.y > 0.7 && uWet > 0.5) {   // after rain: dark tiles, standing water that takes the sky at a low angle
    float pud = smoothstep(0.42, 0.62, fbm(s * 0.07 + 3.1)), fr = pow(1. - clamp(normalize(uEye - vL).y, 0., 1.), 4.);
    col = mix(col * mix(0.56, 0.4, pud), uSky * 1.04, clamp(0.05 + 0.2 * pud + fr * (0.3 + 0.5 * pud), 0., 0.9));
  }
  col = mix(col, uTile * (0.9 + 0.2 * step(1.5, m)), 0.5 * vD.z * (1. - step(2.5, m)) * (1. - 0.6 * step(1.5, m)));
  // the three pictures, each laid only where this is the first surface seen from its point
  float c0 = -dot(vN, d0) / max(length(d0), 1e-3), c1 = -dot(vN, d1) / max(length(d1), 1e-3), c2 = -dot(vN, d2) / max(length(d2), 1e-3);
  // inside the gallery and its west bay, north of the cross arcade, everything that faces V2 takes the loggia whether or not a
  // pier stands in front of it: a pier then throws no bare shadow on the stair and wall behind it when the eye is off the point
  float room = step(-124.3, vP.z) * step(vP.z, -33.2) * step(17.9, vP.y) * step(vP.y, 51.6) * step(-50.3, vP.x) * step(vP.x, 47.3);
  // the vault behind each rib is hidden from V2 by the rib: the sky is carried on there, so no bare arc opens beside a rib from below
  float v0 = seen(uD0, q0, t0, uRes.x, c0, uNear.x, 0., uTan, uFar) * uPaintOn, v1 = seen(uD1, q1, t1, uRes.y, c1, uNear.y, 3.2 * step(vN.y, -0.15) * step(40., vP.y) + 400. * room, uTan, uFar) * uPaintOn;
  float all2 = step(1., t2) * step(max(abs(q2.x), abs(q2.y)), uTan * 0.985);
  float v2 = mix(seen(uD2, q2, t2, uRes.z, c2, uNear.z, 0., uTan, uFar), all2, uMir) * uPaintOn;
  // the glory also lies on the porch's front and the window wall where the pergola hides them from V3, so it shows from far off
  float back = max(step(vP.z, -299.3), step(vP.z, -279.) * step(-282.2, vP.z));
  float v2g = max(v2, all2 * back * (1. - uMir) * uPaintOn);
  float c3 = -dot(vN, d3) / max(length(d3), 1e-3);
  float v3 = seenSoft(uD3, q3, t3, 2048., c3, 3., uTan0, uFar0) * max(step(t3, 151.5), step(t3, 212.45) * step(vP.x, -13.9)) * step(vP.y, 17.6) * uPaintOn * (1. - uMir);   // the cellar, and beyond it stair A and the court's west side
  v0 *= smoothstep(0., 0.03, c0); v1 *= smoothstep(0., 0.03, c1); v2 *= smoothstep(0., 0.03, c2); v2g *= smoothstep(0., 0.03, c2); v3 *= smoothstep(0., 0.03, c3);
  vec3 d5 = vP - vec3(24.5, 23., -166.); float t5 = d5.z; vec2 q5 = d5.xy / max(t5, 1e-4);
  float v5 = step(3., t5) * step(t5, 40.6) * step(0., vP.x) * step(vP.x, 50.3) * step(9.05, vP.y) * smoothstep(0., 0.03, dot(vN, -d5) / max(length(d5), 1e-3)) * uPaintOn * (1. - uMir);
  float v6 = step(1., t6) * max(step(vP.x, -39.2) * step(vP.z, -186.2), step(vP.z, -203.6)) * step(vP.x, -13.5) * step(-230.4, vP.z) * step(8.9, vP.y) * step(vP.y, 52.05)
    * smoothstep(0., 0.03, -dot(vN, d6) / max(length(d6), 1e-3)) * uPaintOn * (1. - uMir);
  // PICTURE 0 BY THE RULE OF THE SURFACE: THE PAINTER PAINTS PLASTER AND TILE; DRESSED STONE STAYS STONE. Inside the cellar
  // north of its mouth arch (z between -1.1 and -127.1, below y 17.2: from just north of the front piers' imposts to
  // just beyond the court side of the end arch's piers; the mouth arch itself, through which the
  // instrument is first seen, takes the paint like a surface outside the cellar, so the limb closes over the top from the
  // entry point) travertine takes none of the astrolabe, not a line of it: piers, bases, imposts, arch
  // rings, soffits and jambs keep their stone, its courses and the cellar's light, and the paint ends at the stone's edge
  // (hair outlines on the stone were tried and left out: on faces that lie along the rays from the entry point one line
  // spreads into a brown band). The switch is the surface's own material and the cellar's own bounds, nothing else: no
  // distance, no angle, no eye. On the cellar's plaster and tiles the layer is laid in full, and the surface's own figure
  // comes through it (pA, pB from the cellar's block above: the vault's float strips and their hair joints, each tile's
  // tone and the tiles' joints). Outside the cellar pA is 1 and pB nothing, and the layer lies on every material alike.
  vec4 pa = vec4(0., 0., 0., 1.); float washA = astroP(pa, q3, f3, v3);
  float stn = step(vP.z, -1.1) * step(-127.1, vP.z) * step(vP.y, 17.2) * (1. - uMir) * step(0.5, m) * step(m, 1.5);
  pa = mix(pa, vec4(0., 0., 0., 1.), stn); washA *= 1. - stn;
  col = col * pa.a + pa.rgb * pA + (1. - pa.a) * pB;
  float wash = washA;
  wash += fanP(col, q6, f6, v6);
  wash += doorP(col, q5, f5, v5);
  wash += sphereP(col, q0, f0, v0);
  wash += loggiaP(col, q1, g, gF, f1, v1);
  wash += gloryP(col, q2, f2, v2g);
  wash += wreathP(col, q2, f2, v2);
  float near = 1. - smoothstep(24., 40., length(vL - uEye));
  col = mix(col, col * uUmber * 1.6, 0.5 * vignette(s, fs) * clamp(wash * 1.5, 0., 1.) * near);
  // paint keeps most of its own value against the light, so a picture is one tone across its receivers; inside the cellar the
  // astrolabe's paint keeps half as much, so painted plaster and painted tiles stay plaster and tiles in the cellar's light:
  // the sun's bars lie across the painted floor, the painted vault deepens toward its crown and lifts over the bars
  col = max(col, 0.) * max(mix(light, mix(light, vec3(0.93), 0.66), clamp(clamp((wash - washA) * 2., 0., 1.) + clamp(washA * 2., 0., 1.) * (1. - 0.5 * cel), 0., 1.)), 0.);
  // the cellar's tiles are worn smooth down the lane (most on its axis, x -24): at a low angle they hold a sheen of the daylight, most in the sun's bars
  if (cel > 0. && m > 1.5 && m < 2.5 && an.y > 0.7) {
    vec3 ev = uEye - vL; float gz2 = 1. - clamp(ev.y / max(length(ev), 1e-3), 0., 1.), g4 = gz2 * gz2 * gz2 * gz2;
    float worn = (0.3 + 0.7 * exp(-(vP.x + 24.) * (vP.x + 24.) / 150.)) * (0.55 + 0.45 * fbm(s * 0.07 + uSeed.yx));
    col += cel * g4 * worn * (0.04 + 0.05 * bar) * uSunCol * vec3(1.25, 1.2, 1.15);
  }
  // daylight from the court through the north door while its leaf stands open: a pale bar on the gallery floor from the
  // west jamb as far east as the leaf lets it, narrowing as the leaf swings home
  float gz = vP.z + 121.6, ge = 0.5 + 0.022 * max(gz, 0.), gxr = 14.5 + 19. * uGap + 0.03 * gz, gxl = 14.5 - 0.1 * gz;
  float pool = step(0.004, uGap) * step(17.9, vP.y) * step(vP.y, 18.5) * step(0.7, nn.y) * smoothstep(0., 3., gz) * (1. - smoothstep(16., 66., gz))
    * smoothstep(gxl - ge, gxl + ge, vP.x) * (1. - smoothstep(gxr - ge, gxr + ge, vP.x)) * (1. - uMir);
  col = mix(col, min(col * 1.45 + vec3(0.07, 0.065, 0.05), vec3(0.99, 0.97, 0.9)), 0.9 * pool);
  col = mix(col, col * vec3(0.8, 0.83, 0.87) + uSky * 0.03, uMir);   // the image in the water: a step darker and cooler than the thing
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`,R0=`
varying vec3 vL;
#include <fog_pars_vertex>
void main() { vL = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,T0=`
uniform vec3 uSky, uSkyLo, uSkyHi, uSkyCl, uChalk, uEye; uniform vec4 uSeed; uniform float uTime, uGlaze, uBright, uSkyCv;
varying vec3 vL;
#include <fog_pars_fragment>
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
${Qt}
// The water holds the sky where nothing stands over it: the sky's own tone at the height the mirrored line of sight climbs to
// (e: 0 level, 1 straight up), warm low down and cool overhead, with long level bars of cloud; a step darker than the sky.
// With uSkyLo = uSkyHi = uSkyCl (the piece shown alone) it is one flat tone, as before.
// (eb: the same height with a third of the ripples' push, so that a bar of cloud wavers in the water and is not broken up by it)
vec3 skyIn(float e, float eb, vec2 b) {
  vec3 c = mix(uSkyLo, uSkyHi, smoothstep(0., 0.62, e));
  float bars = 0.62 * vn(vec2(dot(b, vec2(1.9, 0.8)) + uTime * 0.004, eb * 13.) + uSeed.xy) + 0.38 * vn(vec2(dot(b, vec2(-1.1, 4.4)), eb * 31.) + uSeed.zw);
  float lo = 0.7 - uSkyCv * 0.3;
  return mix(c, uSkyCl, 0.5 * smoothstep(lo, lo + 0.17, bars) * (1. - smoothstep(0.5, 0.85, eb))) * 0.86;
}
void main() {
  vec2 p = vL.xz; float fs = clamp(max(fwidth(p).x, fwidth(p).y), 1e-4, 4.);
  vec3 ev = uEye - vL + vec3(0., 1e-3, 0.), eye = ev / max(length(ev), 1e-4);
  vec2 b = eye.xz / max(length(eye.xz), 1e-4);
  // ripples: where the water tilts toward the eye or away from it the mirrored line of sight climbs lower or higher, so the
  // sky's tone in it shifts, and whatever stands mirrored there gives way to a streak of sky; ripples too fine for a pixel
  // are taken at their mean
  float near = 1. - smoothstep(0.5, 2.2, fs);
  vec2 sl = ripSlope(p, uTime) * near; float tilt = dot(sl, b);
  float e = clamp(eye.y + 0.3 * tilt, 0.02, 1.);
  vec3 base = skyIn(e, clamp(eye.y + 0.1 * tilt, 0.02, 1.), b);
  // slow rings from where the leaves turn (the four bays of water between the pergola's posts)
  float rings = 0.;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec2 c = vec2(mix(${Fe[0][0].toFixed(2)}, ${Fe[2][0].toFixed(2)}, step(1.5, fi)), mix(${Fe[0][1].toFixed(2)}, ${Fe[1][1].toFixed(2)}, mod(fi, 2.)));
    float d = length(p - c), ph = fract(uTime * 0.11 + fi * 0.27 + uSeed.x);
    rings += (1. - smoothstep(0.0, 0.5 + fs, abs(d - ph * 9.))) * (1. - ph) * smoothstep(0.3, 1.5, d);
  }
  float glint = smoothstep(0.55, 0.95, tilt) * near * 0.3 + rings * 0.3;
  if (uGlaze < 0.5) { gl_FragColor = vec4(mix(base, uChalk * 0.97, clamp(glint, 0., 1.) * 0.5), 1.); }
  else {
    // over the mirrored things: clear water, crossed by the streaks of sky and the glints; far off, where the ripples run
    // together, a thin even veil of the sky (0.16: the share of the water the streaks cover near by)
    float streak = smoothstep(0.3, 0.72, abs(tilt)) * 0.62;
    gl_FragColor = vec4(mix(base, uChalk * 0.97, clamp(glint, 0., 1.) * 0.5), clamp(mix(0.16, streak, near) + 0.3 * glint, 0., 0.9));
  }
  #include <fog_fragment>
}`,At=[48,11.5],e0={umber:{sun:[65,37],sunCol:[.6,.54,.44],amb:[.56,.52,.47],shade:[1.1,.97,.84]},verdaccio:{umber:"#474B3A",sienna:"#8A8E6E",plaster:"#DCE1DB",stone:"#BBBEB0",wet:1,bright:.95,shade:[1,1,.9],sun:[62,40],sunCol:[.52,.53,.43],amb:[.5,.54,.52]},sanguine:{umber:"#7C2F23",sienna:"#BC5C44",chalk:"#F7EFE2",plaster:"#F0D8C4",stone:"#D8BEA0",bright:.94,shade:[1.12,.92,.84],sun:[66,33],sunCol:[.7,.5,.36],amb:[.56,.47,.48]}};async function F0(e,t={}){const a=e.rng,l=e.vary||{},n=(t.palette&&t.palette.length>=7?t.palette:["#EDE6D6","#CFC3A8","#5A3A22","#B0703A","#F8F4EA","#6F8296","#B4664A"]).slice(),s=a(),o=a.range(.3,.52)*a.sign(),i=a.range(.34,.5),f=a.range(.26,.36),h=a.pick([32,36,40]),r=a.range(5,7),u=[a()*40,a()*40,a()*40,a()*40],d=l.hour,c=t.look||(d==="dawn"||d==="golden"||d==="night"?"sanguine":s<.55?"umber":"verdaccio"),v=e0[c]||e0.umber,z=t.rare??!!l.rare,w=x=>new m.Color(x),M=w(v.plaster||n[0]),Y=w(v.stone||n[1]),R=w(v.umber||n[2]),T=w(v.sienna||n[3]),b=w(v.chalk||n[4]),q=w(n[5]),L=w(n[6]),W=R.clone().lerp(w("#4A3826"),.5).multiplyScalar(1.25),C=w(c==="sanguine"?"#D9CFC0":c==="verdaccio"?"#CDD1CF":"#D6D5CF");Ht=c==="sanguine"?1.08:.96;const y=Je(),U=Je(),S=Je(),$=Je();await e.yield();for(const x of b0(y))await e.yield();await e.yield();for(const x of y0(y))await e.yield();y.zone=me,y.floorY=9,et(y,-8,-184.9,2.2,1.4,9,25),et(y,3.5,-184.9,2.2,1.4,9,25),await e.yield();for(const x of g0(y))await e.yield();await e.yield(),z0(U),await e.yield(),k0(S),q0($);const re=tt(y);await e.yield();const X=tt(U),A=tt(S),ve=tt($);await e.yield();const I=x=>new m.Vector3(x[0],x[1],x[2]),ie=new m.Vector3(Xe[0]-ke[0],Xe[1]-ke[1],Xe[2]-ke[2]).normalize(),at=new m.Vector3(te[0]-le[0],0,te[2]-le[2]),qt=at.length();at.normalize();const Pe=[ie,new m.Vector3(0,0,-1),at],St=Pe.map(x=>new m.Vector3().crossVectors(x,new m.Vector3(0,1,0)).normalize()),Pt=Pe.map((x,k)=>new m.Vector3().crossVectors(St[k],x).normalize()),ot=new m.Vector3(te[0]-_e[0],te[1]-_e[1],te[2]-_e[2]).normalize(),Mt=new m.Vector3().crossVectors(ot,new m.Vector3(0,1,0)).normalize(),t0=new m.Vector3().crossVectors(Mt,ot).normalize(),Me=130,st=.9,Ee=[1024,2048,1024,2048],Ct=.42,lt=230,Rt=2048,nt=760,a0=[-24,8,26],Tt=x=>{const k=new m.WebGLRenderTarget(x,x,{minFilter:m.NearestFilter,magFilter:m.NearestFilter,depthBuffer:!0,generateMipmaps:!1,type:m.UnsignedByteType,format:m.RGBAFormat});return k.texture.colorSpace=m.NoColorSpace,k},fe=Ee.map(Tt),rt=Tt(Rt),Lt=m.MathUtils.degToRad((v.sun||[65,37])[0]),it=m.MathUtils.degToRad((v.sun||[65,37])[1]),Ve=new m.Vector3(-Math.cos(it)*Math.cos(Lt),Math.sin(it),Math.cos(it)*Math.sin(Lt)).normalize(),Yt=m.MathUtils.degToRad(At[0]),ft=m.MathUtils.degToRad(At[1]),o0=new m.Vector3(-Math.cos(ft)*Math.cos(Yt),Math.sin(ft),Math.cos(ft)*Math.sin(Yt)).normalize(),Z=new m.OrthographicCamera(-1,1,1,-1,1,nt),Ut=new m.Vector3(0,40,-151);Z.position.copy(Ut).addScaledVector(Ve,380),Z.up.set(0,1,0),Z.lookAt(Ut),Z.updateMatrixWorld(!0);{const x=Z.matrixWorld.clone().invert(),k=new m.Vector3;let F=1e9,B=-1e9,j=1e9,E=-1e9;for(const he of[-58,58])for(const Le of[-2,90])for(const mt of[-314,12])k.set(he,Le,mt).applyMatrix4(x),F=Math.min(F,k.x),B=Math.max(B,k.x),j=Math.min(j,k.y),E=Math.max(E,k.y);Z.left=F,Z.right=B,Z.bottom=j,Z.top=E,Z.updateProjectionMatrix()}const s0=new m.Matrix4().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1).multiply(Z.projectionMatrix).multiply(Z.matrixWorldInverse),N={uV:{value:[I(ke),I(ze),I(le)]},uAx:{value:Pe},uRt:{value:St},uUp:{value:Pt},uVm:{value:new m.Vector3(le[0],2*ae-le[1],le[2])},uD0:{value:fe[0].texture},uD1:{value:fe[1].texture},uD2:{value:fe[2].texture},uFar:{value:Me},uTan:{value:st},uWater:{value:ae},uTime:{value:0},uBright:{value:(t.bright??1)*(v.bright??1)},uPaintOn:{value:1},uWet:{value:v.wet?1:0},uMirOff:{value:2*(le[1]-ae)/qt},uPlaster:{value:M},uStone:{value:Y},uTile:{value:L},uWood:{value:W},uUmber:{value:R},uSienna:{value:T},uChalk:{value:b},uBlue:{value:q},uSky:{value:C},uEye:{value:new m.Vector3(0,80,100)},uBasin:{value:new m.Vector4(p.x0,p.x1,p.z0,p.z1)},uSeed:{value:new m.Vector4(u[0],u[1],u[2],u[3])},uArm:{value:new m.Vector4(o,i,f,.35)},uCells:{value:h},uChk:{value:r},uWr:{value:13.5/qt},uRes:{value:new m.Vector3(Ee[0],Ee[1],Ee[2])},uLog:{value:new m.Vector4(Ue.x0,Ue.x1,Ue.y0,Ue.y1)},uLog2:{value:new m.Vector3(Ue.W,(18-ze[1])/(ze[2]+122),.1)},uNear:{value:new m.Vector3(1,24.5,1)},uD3:{value:fe[3].texture},uDS:{value:rt.texture},uSunM:{value:s0},uSunPos:{value:Z.position.clone()},uSunDir:{value:Ve},uSunCol:{value:new m.Vector3(...v.sunCol||[.6,.55,.47])},uAmb:{value:new m.Vector3(...v.amb||[.5,.49,.5])},uSunFar:{value:nt},uSunRes:{value:Rt},uV0:{value:I(a0)},uTan0:{value:Ct},uFar0:{value:lt},uShade:{value:new m.Vector3(...v.shade||[1.05,.95,.84])},uRose:{value:new m.Vector3(-8,58,16)},uEyeH:{value:ze[1]-18},uCloud:{value:t.cloud??.08},uCSun:{value:o0},uV6:{value:I(_e)},uAx6:{value:ot},uRt6:{value:Mt},uUp6:{value:t0},uGap:{value:0},uLeafNear:{value:1},uSkyLo:{value:C.clone()},uSkyHi:{value:C.clone()},uSkyCl:{value:C.clone()},uSkyCv:{value:.4}},l0=P0+M0+C0,Ce=(x,k)=>new m.ShaderMaterial({uniforms:{...m.UniformsUtils.clone(m.UniformsLib.fog),...N,uPiv:{value:new m.Vector3(0,0,0)},uMir:{value:x}},vertexShader:Jt,fragmentShader:l0,fog:!0,side:k}),ct=Ce(0,m.FrontSide),De=Ce(0,m.FrontSide),Be=Ce(0,m.FrontSide),Ft=Ce(1,m.BackSide),ut=Ce(1,m.BackSide);De.uniforms.uPiv.value.set(G.x,G.z,0),Be.uniforms.uPiv.value.set(V.x,V.z,0),ut.uniforms.uPiv.value.set(V.x,V.z,0);const xe=new m.ShaderMaterial({uniforms:{uPiv:{value:new m.Vector3},uMir:{value:0},uWater:{value:ae},uBV:{value:new m.Vector3},uBAx:{value:new m.Vector3},uFar:{value:Me}},vertexShader:Jt,fragmentShader:S0,side:m.DoubleSide}),n0={uSky:N.uSky,uChalk:N.uChalk,uEye:N.uEye,uTime:N.uTime,uBright:N.uBright,uSkyLo:N.uSkyLo,uSkyHi:N.uSkyHi,uSkyCl:N.uSkyCl,uSkyCv:N.uSkyCv,uSeed:N.uSeed},Et=x=>new m.ShaderMaterial({uniforms:{...m.UniformsUtils.clone(m.UniformsLib.fog),...n0,uGlaze:{value:x}},vertexShader:R0,fragmentShader:T0,fog:!0,depthWrite:!1,transparent:x>0});await e.yield();const D=new m.Group;D.name="one-standing-place";const Vt=new m.Mesh(re,ct),Dt=new m.Mesh(X,ct),Bt=new m.Mesh(A,De),Nt=new m.Mesh(ve,Be),Ne=new m.Mesh(X,Ft),We=new m.Mesh(ve,ut);Ne.renderOrder=2,We.renderOrder=2,Ne.frustumCulled=!1,We.frustumCulled=!1;const Re=new m.BufferGeometry;Re.setAttribute("position",new m.Float32BufferAttribute([p.x0,ae,p.z1,p.x1,ae,p.z1,p.x1,ae,p.z0,p.x0,ae,p.z0],3)),Re.setIndex([0,1,2,0,2,3]),Re.computeBoundingSphere();const ht=new m.Mesh(Re,Et(0)),je=new m.Mesh(Re,Et(1));ht.renderOrder=1,je.renderOrder=3,D.add(Vt,Dt,Bt,Nt,ht,Ne,We,je);const oe=new m.PerspectiveCamera(m.MathUtils.radToDeg(2*Math.atan(st)),1,.5,Me+30),ce=new m.Scene,Wt=new m.Color,r0=new m.Vector3(0,0,-1),i0=new m.Vector3(0,1,0),f0=Ve.clone().negate(),Te=(x,k=0,F=1,B=[],j=!1)=>{const E=e.renderer;if(!E)return;const he=D.parent,Le=D.matrix.clone(),mt=D.matrixAutoUpdate;D.matrixAutoUpdate=!1,D.matrix.identity(),ce.add(D),D.updateMatrixWorld(!0);const dt=[Ne,We,ht,je],u0=dt.map(K=>K.visible);for(const K of dt)K.visible=!1;ce.overrideMaterial=xe;const ye=x===4,Ye=ye?Z.position:x===3?N.uV0.value:N.uV.value[x],Ze=ye?f0:x===3?r0:Pe[x],h0=ye?Z:oe;xe.uniforms.uBV.value.copy(Ye),xe.uniforms.uBAx.value.copy(Ze),xe.uniforms.uFar.value=ye?nt:x===3?lt:Me,ye||(oe.fov=m.MathUtils.radToDeg(2*Math.atan(x===3?Ct:st)),oe.far=(x===3?lt:Me)+30,oe.updateProjectionMatrix(),oe.position.copy(Ye),oe.up.copy(x===3?i0:Pt[x]),oe.lookAt(Ye.x+Ze.x,Ye.y+Ze.y,Ye.z+Ze.z),oe.updateMatrixWorld(!0));const Ot=B.map(K=>K.parent);for(const K of B)ce.add(K);const m0=E.getRenderTarget(),d0=E.autoClear,p0=E.getClearAlpha();E.getClearColor(Wt);const ee=ye?rt:fe[x],Xt=Math.round(ee.height*k/F),v0=Math.round(ee.height*(k+1)/F);ee.scissorTest=F>1,ee.scissor.set(0,Xt,ee.width,v0-Xt);const x0=D.visible;D.visible=!j;try{E.autoClear=!j,E.setClearColor(16777215,1),E.setRenderTarget(ee),j||E.clear(),E.render(ce,h0)}finally{ee.scissorTest=!1,ee.scissor.set(0,0,ee.width,ee.height),D.visible=x0,E.setRenderTarget(m0),E.autoClear=d0,E.setClearColor(Wt,p0),ce.overrideMaterial=null,dt.forEach((K,Oe)=>{K.visible=u0[Oe]}),B.forEach((K,Oe)=>{ce.remove(K),Ot[Oe]&&Ot[Oe].add(K)}),ce.remove(D),D.matrix.copy(Le),D.matrixAutoUpdate=mt,he&&he.add(D),D.updateMatrixWorld(!0)}},we=e.renderer;if(we&&we.compileAsync){const x=new m.Scene,k=new m.BufferGeometry,F=we.getRenderTarget();k.setAttribute("position",new m.Float32BufferAttribute([0,0,0,1,0,0,0,1,0],3)),x.add(new m.Mesh(k,xe));let B=null;try{we.setRenderTarget(fe[0]),B=we.compileAsync(x,oe)}catch{B=null}we.setRenderTarget(F),B&&await B,k.dispose()}await e.yield();{const x=[Vt,Dt,Bt,Nt].map(k=>k.geometry);for(const k of x)k.setDrawRange(0,3);Te(0,0,2);for(const k of x)k.setDrawRange(0,1/0)}await e.yield();for(let x=0;x<4;x++){const k=x===1||x===3?6:3;for(let F=0;F<k;F++)Te(x,F,k),await e.yield()}const jt=async(x=[])=>{for(let k=0;k<8;k++)Te(4,k,8),await e.yield();for(const k of x){const F=k.geometry,B=F.index?F.index.count:F.attributes.position.count,j=Math.max(1,Math.ceil(B/6e4));for(let E=0;E<j;E++){const he=Math.floor(B*E/j/3)*3,Le=E===j-1?B:Math.floor(B*(E+1)/j/3)*3;F.setDrawRange(he,Le-he),Te(4,0,1,[k],!0),await e.yield()}F.setDrawRange(0,1/0)}};t.deferSun||await jt();let ue=-1;const be=new m.Vector3,Zt=x=>{let k=0,F=0;if(ue>=0){const B=z?-2.1:-1.75,j=Gt,E=It[1];k=B*(1-(z?se(E-.03,E-.004,ue):se(j+.025,j+.075,ue))),k<-.03&&(k+=.02*Math.sin(x*.7)),F=(1-se(.86,.925,ue))*1.15+(1-se(.82,.9,ue))*.04*Math.sin(x*.5+1)}De.uniforms.uPiv.value.z=k,Be.uniforms.uPiv.value.z=F,ut.uniforms.uPiv.value.z=F,N.uGap.value=pt(1-Math.cos(Math.min(-k,Math.PI/2)),0,1)};Zt(0);const c0={entry:[-24,8,26],portalSeat:{position:te,facing:[0,0,1]},flyThrough:[[-24,8,26],[-24,8,0],[-22,8,-62],[-17,8,-104],[-17,9.4,-130],[-20.5,13.2,-156],ke,[-15.5,19.4,-187.5],[-5,20.2,-192.5],[8,20.6,-192.8],[18.5,21,-190],[24,21.8,-180],[24.5,23,-166],[24.5,26,-143],[24.5,27,-124],[19,27,-108],[9,27,-95],[2,27.5,-80],[-5,29.5,-66],[-14,32.5,-55],[-23.5,33.9,-47],[-32,34.5,-37],[-35,32,-24],[-32,30,-12],[-22,29.2,-7.5],[-11,29,-7.5],ze,[2,29.3,-21],[.5,29.8,-31],[-5,31,-41],[-22,33.6,-46.5],[-31,37.6,-56],[-36,44,-72],[-36,51,-88],[-36,57,-104],[-36,61,-125],[-8.03,59.8,-150],[14.86,59.2,-176],[12.31,59.6,-200],[-8.03,61.4,-220],[-24.81,63.2,-230.5],[-35.2,64,-237],le,[-36,64,-262],te],vantage:[ke,ze,le],vantageAxis:Pe.map(x=>x.toArray()),lockU:It.slice(),doorU:Gt,pictureCenters:[Xe,[-25.3,29,-122],te],closePass:[-10.2,18,-186.3],doorPivot:{x:G.x,z:G.z,y0:G.y0,y1:G.y1,width:G.x1-G.x0},leafPivot:{x:V.x,z:V.z,y0:V.y0,y1:V.y1,halfWidth:V.hw},lane:{x:-24,clear:7,z0:4,z1:-124,rows:[-44,-4,4,44],piers:[2,-31,-62,-93,-124],pier:5},westArcadeX:-22,trestleSpots:[[-33,0,-20],[-14,0,-76],[40,9,-203],[-35,9,-207]],potSpots:[[-34,0,-24],[-31,0,-17],[-15,0,-72],[-12,0,-80],[26,9,-226],[36,9,-216],[-34,9,-194],[40,18,-40]],ringSpots:[[-15,13.3,-124],[38,46.4,-62],[-41.5,71,-258.5]],sheetSpots:[[-6.5,12,-45],[-41.5,12,-77],[47,34,-46.5],[47,34,-77.5],[28,30,-229.5],[24,44,0],[-37,45,0]],basin:{x0:p.x0,x1:p.x1,z0:p.z0,z1:p.z1,y:ae,rings:Fe.map(x=>x.slice())},bay:{...qe},gallery:{...w0},swiftCross:[[-17,32.5,-57],[41,32.5,-57]],parapetWalk:[[-30,53.5,-230.7],[40,53.5,-230.7]]};return{object:D,radius:170,height:86,center:new m.Vector3(0,30,-155),anchors:c0,ground:!1,groundY:0,look:c,rare:z,materials:{wing:ct,door:De,leaf:Be,mirror:Ft,water:je.material},uniforms:N,setProgress(x){ue=x},rebake(){for(let x=0;x<5;x++)Te(x)},bakeSun:jt,sunDir:Ve,update(x,k,F){N.uTime.value=k,F&&(be.setFromMatrixPosition(F.matrixWorld),D.worldToLocal(be),N.uEye.value.copy(be),N.uLeafNear.value=ue<0?1:1-se(64,96,Math.hypot(be.x-te[0],be.y-te[1],be.z+290))),Zt(k)},dispose(){for(const x of fe)x.dispose();rt.dispose(),xe.dispose()}}}export{F0 as buildHero,U0 as lightAt};
