import*as v from"three";const Y=v.Vector3,je=["#F7F3EA","#86A9D8","#A6E6D2","#2EC4BE","#0E6E7C","#5E9FDD","#E8402A"],J=-660,he=660,$=-1160,de=840,V=336,re=512,ve=Math.tan(32*Math.PI/180),Oe=4.6,we=690,be=-345,Se=[[840,-220],[630,-270],[442,-317],[397,-311],[316,-254],[264,-227],[130,-220],[63,-197],[14,-130],[-20,-44],[-71,0],[-1200,0]];function ye(s){for(let x=1;x<Se.length;x++)if(s>=Se[x][0]){const d=Se[x-1],F=Se[x];return d[1]+(F[1]-d[1])*(d[0]-s)/(d[0]-F[0])}return 0}function Qe(s,x,d=1.3){const F=[],b=[],g=[],E=(e,h,m,f,r,t=0)=>{const n={x:e,z:h,W:m,H:f,bow:r,auth:t,back:Oe,sk:s.range(-.1,.1),ph:s.range(0,40),wa:s.range(3,8),wf:s.range(.008,.016),ca:s.range(3,7)*(t?.5:1),cf:s.range(.02,.04),lump:s.range(.03,.09),lf:s.range(.025,.05)};return F.push(n),n},p=(e,h,m,f,r)=>b.push({x:e,z:h,a:m,b:f,dep:r}),A=e=>s.range(-e,e),j=E(-411+A(4),494,150+A(8),19+A(1),80,1),W=E(-128+A(4),280,160+A(8),21.5+A(1),86,1),u=E(0,-25,235+A(8),42+A(1.2),125,1);u.back=3.6;const S=116+A(6),q=E(-(15+S),-415,S,22+A(2),72,1),z=E(15+S,-415,S,23+A(2),72,1);for(const e of[j,W,u,q,z])e.sk*=.2;const B=[j,W,u,q,z];p(-291,634,124,132,2),p(-277,376,112,50,3.4),p(0,98,195,56,3.9),p(0,-265,180,128,3.7),p(q.x,-343,74,44,2.6),p(z.x,-343,74,44,2.6),p(-153,150,60,42,6.4),g.push({x:-255,z:599,a:15,b:5.5,c:.95,s:.3,top:.75},{x:-307,z:589,a:19,b:6.5,c:.9,s:-.43,top:.9},{x:-263,z:573,a:13,b:5,c:1,s:.1,top:.6});let _=0;for(let e=705+A(20);e>$+20;e-=s.range(180,215),_++){const h=_%2*118+A(30);for(let m=J-60+h;m<he+60;m+=s.range(205,255)){const f=m+A(34),r=e+A(38),t=s.range(98,150),n=(s.chance(.14)?s.range(27,33):s.range(15,25))*(r<-480?.44:1);let o=!(Math.abs(f-ye(r))<150+t*.55&&r>-330&&r<760)&&!(Math.abs(f)<120&&r>-520&&r<=-330);for(const c of F)c.auth&&Math.abs(f-c.x)<(c.W+t)*.86&&r-c.z<150&&c.z-r<130+c.H*3&&(o=!1);if(!o)continue;const l=E(f,r,t,n,t*s.range(.5,.68));{const c=r<-480,w=A(12),M=s.range(30,46),K=s.range(.66,.9),P=s.range(40,62),I=s.range(2.6,3.9);c?p(f+w,r+n/ve+P*1.15+6,t*K*1.25,P*1.5,I):p(f+w,r+n/ve+M,t*K,P,I)}}}{const e=s.fork?s.fork("far-ponds"):s;for(let h=0,m=0;h<18&&m<400;m++){const f=e.range(J+40,he-40),r=e.range($+40,-520),t=e.range(34,62),n=e.range(24,40);let o=!0;for(const l of b){const c=(f-l.x)/(l.a*.8+t),w=(r-l.z)/(l.b*.8+n);if(c*c+w*w<1){o=!1;break}}o&&(p(f,r,t,n,e.range(2.4,3.2)),h++)}}const k=12,Z=16,L=(he-J)/k,O=(de-$)/Z,ee=Array.from({length:k*Z},()=>[]),te=Array.from({length:k*Z},()=>[]),R=(e,h,m,f,r,t)=>{const n=Math.max(0,Math.floor((m-J)/L)),o=Math.min(k-1,Math.floor((f-J)/L)),l=Math.max(0,Math.floor((r-$)/O)),c=Math.min(Z-1,Math.floor((t-$)/O));for(let w=l;w<=c;w++)for(let M=n;M<=o;M++)e[w*k+M].push(h)};for(const e of F)R(ee,e,e.x-e.W*1.12-10,e.x+e.W*1.12+10,e.z-e.H*e.back-30,e.z+e.bow+e.W*.12+e.H/ve+20);for(const e of b)R(te,e,e.x-e.a,e.x+e.a,e.z-e.b,e.z+e.b);for(const e of F){const h=e.H*(1+e.lump),m=Math.abs(e.sk)*e.W+e.ca+1;e.bx=e.W+e.wa,e.z0=e.z-m-h*e.back-6,e.z1=e.z+e.bow+m+h/ve}const U={dz:0};function X(e,h,m){if(m<e.z0||m>e.z1||Math.abs(h-e.x)>e.bx)return 0;const f=h-e.x+e.wa*Math.sin(m*e.wf+e.ph),r=Math.abs(f)/e.W;if(r>=1)return 0;const t=e.H*Math.pow(1-Math.pow(r,2.4),.9)*(1+e.lump*Math.sin(f*e.lf+e.ph*3)),n=e.z+e.bow*r*r+e.sk*f+e.ca*Math.sin(f*e.cf+e.ph*2),o=m-n;if(U.dz=o,o>=0)return Math.max(0,t-o*ve);const l=-o/(t*e.back+6);return l>=1?0:t*Math.pow(1-l,1.3)}const C={dz:99,h:0,d:null,beach:!1};function N(e,h,m){const f=Math.min(k-1,Math.max(0,Math.floor((e-J)/L))),r=Math.min(Z-1,Math.max(0,Math.floor((h-$)/O))),t=ee[r*k+f],n=te[r*k+f];let o=0,l=99,c=null;for(let G=0;G<t.length;G++){const y=X(t[G],e,h);y>o&&(o=y,l=U.dz,c=t[G])}let w=0;for(let G=0;G<n.length;G++){const y=n[G],ae=(e-y.x)/y.a,oe=(h-y.z)/y.b,se=ae*ae+oe*oe;se<1&&(w+=y.dep*(1-se)*(1-se))}m&&(C.dz=l,C.h=o,C.d=c);const M=Math.abs(e-ye(h)),K=h<-440||M>=260?1:M<=150?.35:.35+.65*(M-150)/110,P=h<-520?1:h>-440?K:K+(1-K)*(-440-h)/80;let ie=1.4-(h<-520?-.5:h>-420?0:-.5*(-420-h)/100)+(.85*x.n2(e*.0043+7.1,h*.0043-3.3)+.25*x.n2(e*.017,h*.017+9))*P+o-3.9*(1-Math.exp(-w/3.9)),ne=0;for(let G=0;G<B.length;G++){const y=B[G];if(h<y.z-12||h>y.z1+13||Math.abs(e-y.x)>y.bx)continue;const ae=e-y.x+y.wa*Math.sin(h*y.wf+y.ph),oe=Math.abs(ae)/y.W;if(oe>=1)continue;const se=h-(y.z+y.bow*oe*oe+y.sk*ae+y.ca*Math.sin(ae*y.cf+y.ph*2));if(se<-7||se>14+y.H*1.9)continue;const ce=y.H*Math.pow(1-Math.pow(oe,2.4),.9)*(1+y.lump*Math.sin(ae*y.lf+y.ph*3));if(ce<1)continue;const ue=se-ce/ve;if(ue<-7||ue>12)continue;const pe=Math.min(1,(ce-1)/2.5),ge=ue<7?1:1-(ue-7)/5,xe=pe*pe*(3-2*pe)*ge*ge*(3-2*ge)*(d+.28-.1*Math.max(ue,0)-ie);xe>ne&&(ne=xe)}if(ie+=ne,m&&(C.beach=ne>.03),h>555&&h<625&&e>-335&&e<-232)for(let G=0;G<g.length;G++){const y=g[G],ae=e-y.x,oe=h-y.z,se=(ae*y.c+oe*y.s)/y.a,ce=(oe*y.c-ae*y.s)/y.b,ue=se*se+ce*ce;if(ue<1.7){const pe=d+y.top*(1.25-1.25*ue)/(1+.6*ue);pe>ie&&(ie=pe)}}return ie}function T(e,h){const m=Math.min(k-1,Math.max(0,Math.floor((e-J)/L))),f=Math.min(Z-1,Math.max(0,Math.floor((h-$)/O))),r=ee[f*k+m];let t=0,n=99,o=null;for(let l=0;l<r.length;l++){const c=X(r[l],e,h);c>t&&(t=c,n=U.dz,o=r[l])}return C.dz=n,C.h=t,C.d=o,t}return{dunes:F,basins:b,heightAt:N,dom:T,info:C,duneH:X,named:{d1:j,d2:W,tall:u,gL:q,gR:z}}}function qe(s,x){const d=x*s.W,F=Math.abs(x),b=s.H*Math.pow(1-Math.pow(F,2.4),.9)*(1+s.lump*Math.sin(d*s.lf+s.ph*3)),g=s.z+s.bow*F*F+s.sk*d+s.ca*Math.sin(d*s.cf+s.ph*2);return[s.x+d-s.wa*Math.sin(g*s.wf+s.ph),b,g]}async function Ye(s,x){const d=new Float32Array(V*re),F=(he-J)/V,b=(de-$)/re;for(let g=0;g<re;g++){const E=$+(g+.5)*b;for(let p=0;p<V;p++)d[g*V+p]=x.heightAt(J+(p+.5)*F,E);(g&3)===3&&await s.yield?.()}return d}async function Xe(s,x,d,F){const b=new Float32Array(V*re),g=(he-J)/V,E=(de-$)/re,p=Math.max(1e-4,Math.hypot(F.x,F.z)),A=F.x/p/g,j=F.z/p/E,W=Math.max(.02,F.y/p),u=[],S=26;for(let z=1;z<=S;z++)u.push(3.2*z*(1+.07*z));for(let z=0;z<re;z++){for(let B=0;B<V;B++){const _=Math.max(x[z*V+B],d)+.25;let k=1;for(let Z=0;Z<S;Z++){const L=u[Z],O=_+L*W;if(O>48)break;const ee=B+A*L,te=z+j*L;if(ee<0||te<0||ee>V-1.001||te>re-1.001)break;const R=ee|0,U=te|0,X=ee-R,C=te-U,N=U*V+R,T=(x[N]*(1-X)+x[N+1]*X)*(1-C)+(x[N+V]*(1-X)+x[N+V+1]*X)*C,e=(O-T)/(.06*L+.6);if(e<k&&(k=e,k<=0)){k=0;break}}b[z*V+B]=k}(z&1)===1&&await s.yield?.()}const q=new Float32Array(V*re);for(let z=0;z<2;z++){for(let B=0;B<re;B++){const _=B*V;for(let k=0;k<V;k++)q[_+k]=.25*b[_+Math.max(0,k-1)]+.5*b[_+k]+.25*b[_+Math.min(V-1,k+1)];(B&127)===127&&await s.yield?.()}await s.yield?.();for(let B=0;B<re;B++){const _=B*V,k=Math.max(0,B-1)*V,Z=Math.min(re-1,B+1)*V;for(let L=0;L<V;L++)b[_+L]=.25*q[k+L]+.5*q[_+L]+.25*q[Z+L];(B&127)===127&&await s.yield?.()}await s.yield?.()}return b}function $e(s,x){const d=new Uint16Array(V*re*4),F=v.DataUtils.toHalfFloat,b=F(1);for(let E=0,p=0;E<V*re;E++,p+=4)d[p]=F(s[E]),d[p+1]=F(x[E]),d[p+2]=0,d[p+3]=b;const g=new v.DataTexture(d,V,re,v.RGBAFormat,v.HalfFloatType);return g.magFilter=g.minFilter=v.LinearFilter,g.wrapS=g.wrapT=v.ClampToEdgeWrapping,g.generateMipmaps=!1,g.colorSpace=v.NoColorSpace,g.needsUpdate=!0,g}async function Je(s,x,d){const F=[0],b=[],g=-160,E=[];for(let t=0;t<he-g;)t+=3.1+.02*Math.max(0,t-110),F.push(Math.min(t,he-g));for(let t=0;t<g-J;)t+=3.1+.02*Math.max(0,t-110),E.push(Math.min(t,g-J));const p=E.reverse().map(t=>g-t).concat(F.map(t=>g+t));for(let t=de;t>$;)b.push(t),t-=t>722?10:t>-350?5:5+.025*(-350-t);b.push($),b.reverse();const A=p.length,j=b.length,W=A*j,u=new Float32Array(W*3),S=new Float32Array(W*3),q=new Float32Array(W*3),z=new Float32Array(W*4),B=new Uint8Array(W),_=new Uint8Array(W),k=new Float32Array(W),Z=new Float32Array(W),L=x.heightAt,O=x.info,ee=.25,te=(t,n)=>x.dom(t,n)>.05&&O.dz>=0?O.h>6?1:(L(t,n,!0),O.beach?0:1):0;for(let t=0;t<j;t++){for(let n=0;n<A;n++)B[t*A+n]=te(p[n],b[t]);(t&3)===3&&await s.yield?.()}await s.yield?.();const R=(t,n,o,l,c)=>{let w=0,M=1;for(let K=0;K<9;K++){const P=(w+M)/2;te(t+(o-t)*P,n+(l-n)*P)===c?w=P:M=P}return(w+M)/2};for(let t=1;t<j-1;t++){for(let n=1;n<A-1;n++){const o=t*A+n,l=B[o],c=p[n],w=b[t];let M=1e9,K=0,P=0;if(B[o-1]!==l){const I=R(c,w,p[n-1],w,l),D=I*(c-p[n-1]);I<=.5&&D<M&&(M=D,K=-D,P=0)}if(B[o+1]!==l){const I=R(c,w,p[n+1],w,l),D=I*(p[n+1]-c);I<=.5&&D<M&&(M=D,K=D,P=0)}if(B[o-A]!==l){const I=R(c,w,c,b[t-1],l),D=I*(w-b[t-1]);I<=.5&&D<M&&(M=D,K=0,P=-D)}if(B[o+A]!==l){const I=R(c,w,c,b[t+1],l),D=I*(b[t+1]-w);I<=.5&&D<M&&(M=D,K=0,P=D)}M<1e8&&(_[o]=1,k[o]=K,Z[o]=P)}(t&3)===3&&await s.yield?.()}await s.yield?.();const U=new Float32Array(W),X=new Uint8Array(W),C=new Float32Array(W),N=new Float32Array(W);for(let t=0;t<j;t++){for(let n=0;n<A;n++){const o=t*A+n;U[o]=L(p[n]+k[o],b[t]+Z[o],!0),C[o]=O.dz,N[o]=O.h}(t&3)===3&&await s.yield?.()}await s.yield?.();const T=[-1,1,0,0],e=[0,0,-1,1];for(let t=1;t<j-1;t++){for(let n=1;n<A-1;n++){const o=t*A+n;if(U[o]>=d)continue;const l=p[n]+k[o],c=b[t]+Z[o];let w=1e9,M=0,K=0;for(let P=0;P<4;P++){const I=o+e[P]*A+T[P];if(U[I]<=d+.02)continue;const D=p[n+T[P]]+k[I]-l,ie=b[t+e[P]]+Z[I]-c;let ne=0,G=1;for(let oe=0;oe<8;oe++){const se=(ne+G)/2;L(l+D*se,c+ie*se)<d?ne=se:G=se}const y=(ne+G)/2,ae=y*Math.hypot(D,ie);ae<w&&(w=ae,M=D*y,K=ie*y)}w<1e8&&(k[o]+=M,Z[o]+=K,U[o]=d,X[o]=1,_[o]=0)}(t&3)===3&&await s.yield?.()}await s.yield?.();const h=(t,n,o,l,c)=>{const w=o-L(t+ee,n),M=o-L(t,n+ee),K=1/Math.hypot(w,ee,M);l[c]=w*K,l[c+1]=ee*K,l[c+2]=M*K};for(let t=0;t<j;t++){for(let n=0;n<A;n++){const o=t*A+n,l=o*3,c=o*4,w=p[n]+k[o],M=b[t]+Z[o];if(u[l]=w,u[l+1]=X[o]?L(w,M,!0):U[o],u[l+2]=M,X[o]||(O.dz=C[o],O.h=N[o]),_[o]){const K=Math.hypot(k[o],Z[o])||1,P=B[o]?-.35/K:.35/K,I=w+k[o]*P,D=M+Z[o]*P,ie=w-k[o]*P,ne=M-Z[o]*P;h(ie,ne,L(ie,ne),S,l),h(I,D,L(I,D,!0),q,l);const G=Math.max(0,O.dz),y=G+O.h/ve,ae=G<.9&&O.h>.05;z[c]=ae?0:y>.001?Math.min(1,G/y):1,z[c+1]=ae?0:Math.min(20,Math.max(G,.9)),z[c+2]=Math.min(1,Math.max(0,(u[l+1]+G*ve-d-.3)/6)),z[c+3]=1}else{const K=O.dz,P=O.h,I=X[o]?P>.05&&K>=0&&!O.beach?1:0:B[o];h(w,M,u[l+1],S,l),q[l]=S[l],q[l+1]=S[l+1],q[l+2]=S[l+2];const D=I?K+P/ve:1;z[c]=I?Math.min(1,K/Math.max(D,.001)):0,z[c+1]=P>.05?Math.min(20,Math.abs(K)):20,z[c+2]=Math.min(1,Math.max(0,(u[l+1]+(I?Math.max(K,0)*ve:0)-d-.3)/6)),z[c+3]=I}}(t&3)===3&&await s.yield?.()}await s.yield?.();const m=new Uint32Array((A-1)*(j-1)*6);let f=0;for(let t=0;t<j-1;t++){for(let n=0;n<A-1;n++){const o=t*A+n,l=o+1,c=o+A,w=c+1;let M;const K=U[o]>d+.02,P=U[l]>d+.02,I=U[c]>d+.02,D=U[w]>d+.02;if(K&&U[w]<d-.02||D&&U[o]<d-.02)M=!1;else if(P&&U[c]<d-.02||I&&U[l]<d-.02)M=!0;else if(_[o]|_[l]|_[c]|_[w]||B[o]+B[l]+B[c]+B[w]!==4*B[o]){const ie=Math.abs((u[o*3+1]+u[w*3+1])/2-L((u[o*3]+u[w*3])/2,(u[o*3+2]+u[w*3+2])/2)),ne=Math.abs((u[l*3+1]+u[c*3+1])/2-L((u[l*3]+u[c*3])/2,(u[l*3+2]+u[c*3+2])/2));M=ie<=ne}else M=Math.abs(u[o*3+1]-u[w*3+1])<=Math.abs(u[l*3+1]-u[c*3+1]);M?(m[f++]=o,m[f++]=c,m[f++]=w,m[f++]=o,m[f++]=w,m[f++]=l):(m[f++]=o,m[f++]=c,m[f++]=l,m[f++]=l,m[f++]=c,m[f++]=w)}(t&7)===7&&await s.yield?.()}const r=new v.BufferGeometry;return r.setAttribute("position",new v.BufferAttribute(u,3)),r.setAttribute("normal",new v.BufferAttribute(S,3)),r.setAttribute("aNs",new v.BufferAttribute(q,3)),r.setAttribute("aF",new v.BufferAttribute(z,4)),r.setIndex(new v.BufferAttribute(m,1)),r.boundingSphere=new v.Sphere(new Y(0,10,($+de)/2),1160),r.boundingBox=new v.Box3(new Y(J,-4,$),new Y(he,50,de)),r}function et(s,x,d){const F=Math.round((we-be)/3)+1,b=new Float32Array(F),g=new Float32Array(F),E=(u,S,q)=>{const z=Math.min(1,Math.max(0,(q-u)/(S-u)));return z*z*(3-2*z)},p=u=>{const S=s.heightAt(ye(u),u);return S>x?S+2.5:x+.5};for(let u=0;u<F;u++){const S=we-u*3;let q=p(S);for(let z=-4.5;z<=4.5;z+=1.5)q=Math.max(q,p(S+z));if(g[u]=q,b[u]=q+7.5*E(d+34,d-4,S)*E(-205,-70,S),S<-255){const z=E(-255,-285,S);b[u]=b[u]*(1-z)+(x+2.5)*z,g[u]=Math.min(g[u],b[u])}}const A=new Float32Array(F);for(let u=0;u<10;u++){for(let S=0;S<F;S++)A[S]=.25*b[Math.max(0,S-1)]+.5*b[S]+.25*b[Math.min(F-1,S+1)];for(let S=0;S<F;S++)b[S]=Math.max(A[S],g[S])}const j=[];for(let u=0;u<F;u+=5)j.push(new Y(ye(we-u*3),b[u],we-u*3));const W=j[j.length-1];return W.z>be+.5?j.push(new Y(0,x+2.5,be)):W.set(0,x+2.5,be),j}const Te=`
float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
float fbm3(vec2 p){ return vn(p)*.5+vn(p*2.03+17.)*.3+vn(p*4.1+41.)*.2; }
`,He=`
uniform float uBowl;
float bowlY(vec2 xz){
  float t=max(length(xz)-480.,0.), w=1.-smoothstep(-350.,150.,xz.y);
  float r=t<900.?t*t*4.1667e-5:33.75+0.075*(t-900.);
  return r*w*uBowl;
}`,_e={x:760,z:-820},tt=`
uniform vec4 uSq;
float sqK(vec2 xz){
  vec2 d=xz-uSq.xy; float al=dot(d,vec2(0.7071,0.7071)), ac=dot(d,vec2(0.7071,-0.7071));
  float r=length(vec2(al/540.,ac/290.))+0.3*(vn(xz*0.0045+3.)-.5)+0.12*(vn(xz*0.021)-.5);
  return (1.-smoothstep(0.45,1.05,r))*uSq.z;
}`,at=`
uniform float uWater;
${He}
attribute vec3 aNs; attribute vec4 aF;
varying vec3 vL; varying vec3 vN; varying vec3 vNs; varying float vH; varying vec4 vF;
#include <fog_pars_vertex>
void main(){
  vH=position.y; vN=normal; vNs=aNs; vF=aF;
  vec3 p=position; p.y=max(p.y,uWater)+bowlY(p.xz); vL=p;
  vec4 mvPosition=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ot=`
uniform sampler2D uMap; uniform vec4 uRect; uniform vec4 uBounds;
uniform vec3 uCamL,uSun,uSunCol,uFill,uSand,uMint,uTurq,uTeal,uZen,uHor;
uniform float uTime,uWater,uCloud,uEdgeFade,uWet,uPlume,uGlit,uRoad; uniform vec4 uNight,uGrove;
varying vec3 vL; varying vec3 vN; varying vec3 vNs; varying float vH; varying vec4 vF;
#include <fog_pars_fragment>
${Te}
${tt}
vec2 muv(vec2 xz){ return (xz-uRect.xy)*uRect.zw; }
#define BK(k,dx,dy) (1.-smoothstep(1.1,2.7,(k)*((dx)*fwx+(dy)*fwz)))
#define BKS(k,dx,dy) (1.-smoothstep(1.7,3.6,(k)*((dx)*fwx+(dy)*fwz)))
const vec2 KR=vec2(0.5,0.866);             // ripple wave vector: oblique to the wind and square to the low sun, which rakes every band
void main(){
  vec3 Vv=uCamL-vL; float dist=length(Vv); vec3 V=Vv/max(dist,1e-3);
  vec2 xz=vL.xz;
  float fwx=fwidth(xz.x), fwz=fwidth(xz.y), fwh=fwidth(vH);          // a pixel's footprint on the ground: ripple bands fade before they alias
  // the triangle's own slope: slip faces are told by it, so brink and foot are exactly the mesh edges laid along them
  vec3 Pg=vec3(xz.x,vH,xz.y); vec3 Ng=cross(dFdx(Pg),dFdy(Pg)); float ngl=length(Ng);
  Ng=ngl>1e-12?Ng/ngl:vec3(0.,1.,0.); if(Ng.y<0.) Ng=-Ng;
  // ... and by which side of the outline the triangle lies on: aF.w is 1 at all three corners only inside a slip face,
  // so a triangle of the windward back that touches the brink (as steep as 26 degrees on the tall dune's shoulder)
  // is never taken for one; the test widens to a pixel and a half, which antialiases the brink
  float inW=smoothstep(1.-clamp(1.6*fwidth(vF.w),0.012,0.5),0.9995,vF.w);
  // a horn tip's face is lower than a mesh cell is wide: there the blue fades out and the tip is plain pale sand
  float slip0=(1.-smoothstep(0.862,0.895,Ng.y))*inW;
  float slip=slip0*smoothstep(0.55,1.0,vF.z);
  vec3 N=normalize(mix(vN,vNs,slip)+vec3(0.,1e-4,0.));
  vec4 mp=texture2D(uMap,muv(xz));
  float cl=fbm3(vec2(xz.x*0.0052+xz.y*0.0016,xz.y*0.0058-uTime*0.052));
  float cs=1.-uCloud*smoothstep(.60,.72,cl);
  // under the squall the rain takes most of the sun: the dunes there stand in a soft blue shade, and are wet
  float sq=sqK(xz);
  cs*=1.-0.62*sq;
  float sh=clamp(mp.g,0.,1.)*cs;
  float wob=vn(xz*0.11)*5.+vn(xz*0.9)*1.3;
  float bslope=length(vN.xz)/max(vN.y,0.2);                 // the bed's slope: on a flat flooded floor the lapping would draw rings, so it only laps where the bed shelves
  float depth=uWater-vH+0.035*sin(uTime*1.2+vn(xz*0.15)*12.)*smoothstep(0.012,0.05,bslope);
  float f1=(1.-smoothstep(20.,140.,dist));
  float gentle=smoothstep(0.66,0.80,N.y)*(1.-slip0)*smoothstep(0.68,0.80,Ng.y);
  float kp=dot(xz,KR);
  // MEGARIPPLES: sinuous ridges some seven metres apart, square to the low sun. Each has a sharp crest, a short lee flank
  // that stands in its own blue shadow, and a trough where the damp flats hold a film of water. They carry to a few hundred
  // metres and melt away before they can alias.
  float pm=kp*0.92+wob*0.5+2.6*vn(xz*0.013+5.), ms=fract(pm*0.15915);
  float fwM=(0.92*(0.5*fwx+0.866*fwz)+0.05*(fwx+fwz))*0.15915;
  float mAA=(1.-smoothstep(0.2,0.5,fwM))*(1.-smoothstep(280.,720.,dist)), mk=mAA*gentle;
  float me=max(0.03,1.6*fwM);
  float mlee=smoothstep(0.,me,ms)*(1.-smoothstep(0.16,0.42,ms));
  float mtr=smoothstep(0.10,0.30,ms)*(1.-smoothstep(0.44,0.66,ms));
  // between the megaripples a second, finer train (some three metres apart, wandering on its own): on a sunlit back the
  // seven-metre bands alone leave broad blank white between them; with these the whole back is raked. It melts away
  // before it can alias and is gone by 330 m.
  float pf2=kp*2.17+wob*0.9+1.7*vn(xz*0.021+9.), fs2=fract(pf2*0.15915);
  float fwF=2.17*(0.5*fwx+0.866*fwz)*0.15915;
  float fAA=(1.-smoothstep(0.16,0.42,fwF))*(1.-smoothstep(120.,330.,dist));
  float flee=smoothstep(0.,max(0.04,1.6*fwF),fs2)*(1.-smoothstep(0.20,0.50,fs2))*fAA*gentle*(1.-0.7*mlee*mk);
  float pud=vn(xz*0.047+11.)*0.62+vn(xz*0.15+3.)*0.38;
  // THE WATER'S EDGE. Where the bed shelves, the water ends at a line (foam, lapping). On the flat interdune floors it has
  // no edge: the sand runs from damp, to a film standing in every megaripple trough, to a sheet that mirrors the sky, to
  // shallows; there the two shadings are blended across the first hand's depth of water.
  float shoreK=smoothstep(0.012,0.045,bslope);
  // (seen from more than a hundred metres every pool has a clear shoreline: no feathering, no film, a dark wet rim)
  float farK=smoothstep(55.,170.,dist);
  float wk=smoothstep(0.,mix(mix(0.24,0.02,shoreK),0.025,farK),depth+(1.-shoreK)*(1.-farK)*(0.08*(mtr*mk-0.3)+0.07*(pud-.5)));
  // glitter on standing films and sheets: thin bright dashes lying along the ripples (never blobs), band-limited
  float kq=dot(xz,vec2(-0.866,0.5));
  float gstr=smoothstep(0.84,0.98,cos(kp*9.+2.2*vn(xz*0.7+uTime*vec2(0.3,0.2))))*BKS(9.,0.5,0.866)*smoothstep(0.42,0.6,vn(vec2(kq*0.7+uTime*0.6,kp*1.1+3.)));
  vec3 col=vec3(0.), colS=vec3(0.), colW=vec3(0.);
  if(wk<0.999){
    // ------------------------------ SAND ------------------------------
    float f2=(1.-smoothstep(2.5,10.,dist));
    float p1=kp*3.1+wob, p2=kp*50.+wob*7., p0=kp*0.5+vn(xz*0.02)*3.;
    float hi=smoothstep(0.5,0.8,uSun.y);                 // a high sun: softer knee, stronger ripples, deeper blue troughs
    float n1=(cos(p1)+0.35*cos(2.*p1+1.))*f1*BKS(3.1,0.5,0.866);
    float rm=n1*0.17*(1.+0.9*hi)*gentle+(mlee-0.27)*0.22*(1.+0.6*hi)*mk*(1.-0.6*uRoad)+(flee-0.2)*0.09*(1.-uRoad);
    float ro=cos(p2)*0.3*f2*gentle*BKS(50.,0.5,0.866) + (cos(p0)*0.07+(vn(xz*0.045+3.)-.5)*0.15)*(1.+0.5*hi)*gentle*(1.-smoothstep(150.,900.,dist));
    float r=rm+ro;
    // grainflow on the slip faces: narrow avalanche tongues, each a low rounded ridge with a soft toe, sliding
    // down over fine contour ripples; the raking light picks out one flank of every tongue. Close range only.
    float ax=abs(N.x), az=abs(N.z);
    float lat=mix(xz.y,xz.x,step(ax,az)); vec2 acv=mix(vec2(0.,1.),vec2(1.,0.),step(ax,az));
    float seam=smoothstep(0.,0.3,abs(az-ax)/max(az+ax,1e-3));
    float tnear=(1.-smoothstep(22.,70.,dist))*slip*seam;
    float cxw=lat/1.35+0.55*vn(vec2(vH*0.16,lat*0.11));
    float ci=floor(cxw), fx=fract(cxw)-.5, hs=h21(vec2(ci,7.3));
    float ph=vH*0.11+uTime*(0.07+0.06*hs)+hs*9.+0.10*(1.-4.*fx*fx);
    float fp=fract(ph), len=0.24+0.3*h21(vec2(ci,floor(ph)+3.));
    float wm=(1.-smoothstep(0.30,0.5,abs(fx)*(1.+1.3*fp/len)))*step(0.68,hs)*tnear;
    float body=wm*smoothstep(0.,0.045,fp)*(1.-smoothstep(len*0.5,len,fp));
    float front=wm*smoothstep(0.,0.02,fp)*(1.-smoothstep(0.02,0.09,fp));
    float tf=vn(vec2(lat*2.6,vH*0.7+uTime*1.7));
    float crip=cos(vH*34.+vn(xz*0.7)*5.)*(1.-smoothstep(3.,14.,dist))*slip;
    // broad chutes down the fall line, seen from hundreds of metres: old avalanche lanes, some paler, some darker,
    // each with a soft shoulder that the sky's glow picks out; they wander a little and narrow toward the foot
    float chw=lat*0.06+0.8*vn(vec2(lat*0.02,5.))+0.3*vn(vec2(lat*0.3,vF.x*2.+3.))*vF.x;
    float chA=vn(vec2(chw,1.3+vF.x*1.7)), chB=vn(vec2(chw*2.1+17.,vF.x*3.1));        // lanes that start and die out down the face
    float chK=slip*(1.-smoothstep(420.,800.,dist))*(1.-smoothstep(1.2,3.0,0.08*max(fwx,fwz)))*(0.25+0.75*smoothstep(25.,90.,dist));
    float faceSun=smoothstep(-0.03,0.30,dot(N,uSun))*(1.-uRoad);                         // how much of the low sun this face takes
    float chute=((smoothstep(0.28,0.72,chA)-.5)*1.15+(chB-.5)*0.4)*chK*smoothstep(0.,0.10,vF.x)*(1.-0.6*faceSun);
    // a second, coarser train of avalanche tongues that carries to a few hundred metres: pale lobes with a dark flank
    float tfar=(1.-smoothstep(170.,320.,dist))*smoothstep(14.,40.,dist)*slip*seam;
    float cx2=lat/4.4+0.6*vn(vec2(vH*0.07,lat*0.05)), ci2=floor(cx2), fx2=fract(cx2)-.5, hs2=h21(vec2(ci2,3.7));
    float ph2=vH*0.05+uTime*(0.022+0.02*hs2)+hs2*9., fp2=fract(ph2), len2=0.3+0.35*h21(vec2(ci2,floor(ph2)+5.));
    float body2=(1.-smoothstep(0.26,0.5,abs(fx2)*(1.+1.2*fp2/len2)))*step(0.5,hs2)*tfar*(1.-0.7*faceSun)*smoothstep(0.,0.05,fp2)*(1.-smoothstep(len2*0.5,len2,fp2));
    // sand, not a painted plane: wind ripples lie across every face, a fine set and a broader one, each fading before
    // it aliases; at a distance the broader bands read as strata
    float frip=cos(vH*10.5+vn(xz*0.35)*3.+1.5*vn(vec2(lat*0.12,vH*0.3)))*(1.-smoothstep(1.1,2.8,10.5*fwh))*(1.-smoothstep(70.,160.,dist))
              +0.8*cos(vH*3.3+vn(xz*0.12)*4.)*(1.-smoothstep(1.1,2.8,3.3*fwh))*(1.-smoothstep(mix(160.,50.,uRoad),mix(420.,130.,uRoad),dist));
    float cband=frip*slip*(1.-0.95*uRoad);
    float chS=(vn(vec2(chw+0.11,1.3+vF.x*1.7))-chA)*chK;                                   // the lane's cross slope
    vec2 tn=acv*(sin(6.2832*fx)*body*0.15+(tf-.5)*0.10*body+chS*1.5+sin(6.2832*fx2)*body2*0.22)+vec2(N.x,N.z)*(front*0.3+crip*0.12+cband*0.3);
    vec3 Nn=normalize(N+vec3(KR.x*r+0.1*(vn(xz*0.6)-.5)*f1+tn.x,0.,KR.y*r+tn.y));
    float ndl=max(dot(Nn,uSun),0.);
    // slip faces stand in their own shade: none of the grazing sun, half of a high one, so each is a bluer plane
    // (not under the moon, which stands high ahead of us and silvers them)
    // the low sun is true to each face: the half of a crescent that turns from it stands in blue shade, the middle takes
    // a raking light that picks out every chute, the far horn is lit; a high sun gives every face a softened light
    float slipSh=mix(1.-slip*(1.-smoothstep(-0.03,0.30,dot(N,uSun))*mix(0.66,0.5,hi)),1.,uRoad);
    body*=1.-0.6*faceSun; front*=1.-0.6*faceSun;
    float sunT=(1.-exp(-ndl*mix(5.4,2.0,hi)))*sh*slipSh, shade=1.-sunT;
    vec3 alb=uSand*(0.93+0.07*vn(xz*0.035)+0.05*(vn(xz*1.7)-.5)*f1)*mix(0.94,1.,smoothstep(0.2,3.5,-depth))*(1.+0.05*slip);
    // THE INTERDUNE FLATS lie within half a metre of the water table: damp sand a shade darker and bluer (never grey),
    // and wherever it dips, in every ripple trough near us and in broad sheets further off, a thin film of standing
    // water that mirrors the sky; the ripple crests stand out of it dry, white and sunlit
    float damp=(1.-smoothstep(0.05,0.62,-depth))*uWet*gentle;
    // how wet: the troughs fill first (megaripple troughs, and near us the hollows of the wind ripples), so every patch of
    // film has a feathered edge that follows the ripples
    float trf=max(mtr*mk,0.7*smoothstep(0.2,0.9,sin(p1))*f1*BKS(3.1,0.5,0.866)*gentle);
    float film=smoothstep(-0.10,0.28,damp*0.62+(pud-.5)*0.9+(trf-0.35)*0.55-0.36)*smoothstep(0.,0.08,damp)*(1.-farK);
    alb*=mix(vec3(1.),vec3(0.90,0.915,0.94),damp*(1.-film));
    // the wet rim: the hand's breadth of sand above every waterline is soaked, a clear shade darker and bluer
    // (a band a few metres wide in plan, whatever the slope: the flats themselves stay bright)
    float rimD=max(-depth,0.)/max(bslope,0.006), rimWd=2.2+0.022*dist;
    float rimWet=(1.-smoothstep(0.35*rimWd,rimWd,rimD))*uWet;
    alb*=mix(vec3(1.),vec3(0.62,0.74,0.90),rimWet*mix(0.35,0.92,farK));
    float wetK=max(film,0.22*damp);
    alb*=(1.+0.05*body*(0.5+tf)+0.03*crip+0.055*cband+0.2*body2-0.1*body2*smoothstep(0.1,0.45,abs(fx2)))*clamp(1.+chute*0.42,0.72,1.3);
    // the bright sky round the sun rakes every shaded surface too: relief shows where the sun does not reach, each
    // megaripple with a lighter and a darker flank
    vec3 L2=normalize(vec3(uSun.x,0.3,uSun.z)+vec3(1e-4,0.,0.));
    alb*=clamp(1.+1.15*dot(Nn-N,L2)*mix(0.42*shade,1.,slip),0.80,1.30);
    // saltation streamers snaking downwind over the backs: sinuous lines of blown sand in lanes some 7 m apart, each
    // meandering and running in gusts, a soft veil torn into wisps, with its blue shadow half a metre to leeward of the sun
    float lu=xz.x*0.143+0.9*vn(vec2(xz.y*0.02-uTime*0.4,3.7))+0.3*sin(xz.y*0.21-uTime*2.6+vn(xz*0.03)*9.);
    float li=floor(lu), lf=fract(lu)-.5;
    float sgate=step(0.26,h21(vec2(li,9.1)))*smoothstep(0.38,0.62,vn(vec2(li*7.3,xz.y*0.04-uTime*0.6)));
    float swd=0.075+0.09*fwx;                                 // a soft veil 0.7 m wide, torn into wisps along its length
    float strK=gentle*(1.-smoothstep(-1.5,-0.3,depth))*smoothstep(10.,34.,dist)*(1.-smoothstep(80.,380.,dist))*(1.-smoothstep(0.12,0.24,swd))*min(uPlume,1.5)*sgate;
    float wisp=smoothstep(0.15,0.8,vn(vec2(li*3.1+lf*26.,xz.y*0.22-uTime*5.)));
    float stream=exp(-lf*lf/(swd*swd))*wisp*strK;
    float strSh=exp(-(lf-0.09)*(lf-0.09)/(swd*swd*1.6))*(0.2+0.8*wisp)*strK*(1.-stream)*(1.-uRoad);
    // every shadow, unlit face and trough is filled by the sky: clear blue, never slate. Down a slip face the tone
    // runs from deepest just under the brink to pale at the foot, where the lagoon throws a little mint back up
    float tone=mix(1.,mix(0.86,1.2,smoothstep(0.,0.9,vF.x)),slip);
    vec3 amb=uFill*mix(0.26,0.96,shade)*(0.7+0.3*Nn.y)*mix(vec3(1.),vec3(0.97,1.06,1.24),shade*(1.-0.42*slip*(1.-uRoad)))*tone;       // a shaded face is paler and greyer than a cast shadow: sand lit by the whole sky
    amb*=mix(vec3(1.),mix(vec3(0.80,0.92,1.10),vec3(0.98,1.02,1.0),vF.x),slip*shade*(1.-uRoad));       // cobalt under the brink, paler toward the foot
    amb+=uMint*uFill.g*0.34*slip*vF.x*vF.x*(1.-smoothstep(0.5,9.,vH-uWater))*(1.-uRoad);
    // (the sun's share is held where the brightest back sits a little under white: what the tone curve leaves above it
    // goes to the ripples' sunward flanks and the brink rims)
    col=alb*(amb+uSunCol*sunT*mix(0.84,0.94,uRoad));
    // every ripple trough is filled by the sky: on sunlit sand that is what shows the relief (a white this bright
    // flattens anything subtler), in shade the raking sky-glow already does
    // (a back that faces the sun squarely takes no shading from a ripple at all: there the megaripple troughs are filled
    // harder, a white crest and a sky-blue trough to every band, so the windward backs are raked sand, never a blank white)
    vec3 trough=mix(vec3(0.40,0.55,0.93),vec3(0.52,0.66,0.95),hi);
    float leeK=max(max(mlee*mk,0.62*flee*smoothstep(0.25,0.7,sunT)),0.8*smoothstep(0.15,0.8,n1)*gentle);
    col*=mix(vec3(1.),mix(vec3(0.80,0.88,1.0),trough,sunT),leeK*mix(0.5,1.,sunT)*(1.-film)*(1.-0.8*uRoad));
    // ... and the sunward flank of every ripple takes the low sun a little harder than the flat
    col*=1.+0.12*clamp(-r*5.,0.,1.)*sunT*gentle*(1.-uRoad);
    // A SLIP FACE THAT TAKES THE SUN (the far horn of every crescent) would be one blank white plane: the wind ripples
    // that lie across it show as bands with a sky-blue trough each, and its chutes as paler and bluer lanes
    float faceLit=slip*faceSun*(1.-uRoad);
    col*=mix(vec3(1.),mix(vec3(0.80,0.88,1.0),trough,sunT),faceLit*(0.75*smoothstep(0.,1.,frip)+0.3*smoothstep(0.02,0.3,-chute)));
    // the brink catches the sun: a white rim along every crest, never thinner than a couple of pixels
    float rimW=max(0.8,dist*0.012);
    float rimK=(1.-smoothstep(rimW*0.3,rimW,vF.y))*clamp(vF.z,0.,1.)*smoothstep(0.02,0.2,uSun.y)*cs*(0.45+0.55*clamp(mp.g*1.6,0.,1.));
    col=mix(col,uSand*(uSunCol*0.95+uFill*0.24),min(rimK*1.05,1.));
    if(wetK>0.001){
      vec3 Rf=reflect(-V,normalize(vec3(Nn.x-N.x,4.,Nn.z-N.z))); Rf.y=abs(Rf.y)+0.02;
      vec3 skyF=mix(uHor,uZen,uNight.y+(1.-uNight.y)*pow(clamp(Rf.y,0.,1.),0.4))*1.2+vec3(0.05)*(1.-uRoad);
      float frF=mix(0.24,0.46,film)+mix(0.76,0.54,film)*pow(1.-clamp(V.y,0.,1.),3.);
      vec3 wetc=mix(col*vec3(0.66,0.82,0.93),skyF*(0.8+0.2*sh),frF);
      vec2 slF=uSun.xz/max(length(uSun.xz),1e-4); float towF=max(dot(-V.xz/max(length(V.xz),1e-4),slF),0.);
      float tkF=vn(xz*3.3+uTime*vec2(.9,2.3))*vn(xz*5.6-uTime*vec2(1.7,.6)+5.);
      wetc+=uSunCol*smoothstep(.5,.6,tkF)*towF*towF*smoothstep(9.,22.,dist)*(1.-smoothstep(22.,70.,dist))*sh*1.6*uGlit;
      // glitter streaks lying along the ripples, wherever the film stands
      wetc+=uSunCol*gstr*(0.25+0.75*towF*towF)*(1.-smoothstep(30.,110.,dist))*sh*0.9*min(uGlit,1.7)*max(film,0.3*wetK);
      col=mix(col,wetc,wetK);
    }
    col*=mix(vec3(1.),vec3(0.58,0.72,0.97),strSh*0.8*sh);
    col=mix(col,uSand*(uFill*0.35+uSunCol*0.9*sh),stream*0.85);
    col+=uSand*(uFill*0.09+uSunCol*0.10*max(sh,0.3))*front;                              // the pale toe of each tongue
    // sparkle of quartz grains
    float sp=step(0.9935,h21(floor(xz*30.)))*(1.-smoothstep(4.,26.,dist));
    float rv=max(dot(reflect(-uSun,Nn),V),0.);
    col+=uSunCol*sp*sh*slipSh*(0.6+3.4*rv*rv);
    colS=col;
  }
  if(wk>0.001){
    // ------------------------------ WATER ------------------------------
    float d=max(depth,0.);
    float bedR=0.5+0.5*cos(dot(xz,KR)*3.1+wob);
    float ca=vn(xz*0.9+vec2(uTime*0.35,uTime*0.21)), cb=vn(xz*1.18-vec2(uTime*0.28,-uTime*0.17)+7.);
    float caus=1.-smoothstep(0.,0.10,abs(ca-cb));
    float alg=smoothstep(.50,.70,fbm3(vec2(xz.x*0.052+xz.y*0.031,xz.y*0.052-xz.x*0.031)+11.))*smoothstep(.3,1.3,d);
    float nearW=1.-smoothstep(2.,7.,dist);                                              // straight down under the bill
    // at arm's length the metre-wide light net and the 2 m bed ripples are bigger than the frame: there a fine net
    // (cells of 6 to 20 cm) and hand-wide bed ripples take over, each fading before it aliases
    float nearL=1.-smoothstep(2.5,9.,dist), nearM=1.-smoothstep(3.5,13.,dist), fwm=max(fwx,fwz);
    float ca2=vn(xz*13.+vec2(uTime*1.3,uTime*0.8)), cb2=vn(xz*16.7-vec2(uTime*1.0,-uTime*0.65)+3.);
    float ca3=vn(xz*5.3+vec2(uTime*0.8,uTime*0.45)+9.), cb3=vn(xz*6.8-vec2(uTime*0.6,-uTime*0.4)+5.);
    float causN=(1.-smoothstep(0.,0.13,abs(ca2-cb2)))*(1.-smoothstep(0.7,1.9,13.*fwm))*nearL;
    float causM=(1.-smoothstep(0.,0.11,abs(ca3-cb3)))*(1.-smoothstep(0.7,1.9,5.3*fwm))*nearM;
    caus=caus*(1.-0.8*nearM)+max(causN,0.8*causM);
    float bedF=cos(dot(xz,KR)*23.+wob*4.+2.*vn(xz*1.7))*BKS(23.,0.5,0.866)*nearM;
    vec3 bed=uSand*(0.60+0.20*bedR*f1*(1.-0.6*nearM)+0.085*bedF)*(1.-0.5*alg);
    bed*=1.+caus*0.55*(1.-smoothstep(12.,110.,dist))*exp(-d*mix(0.7,0.22,nearW));
    float dr=d*mix(1.,1.8,farK);                          // far pools: mint rim, turquoise, teal heart, each band wide enough to see
    vec3 wc=mix(uMint,uTurq,smoothstep(0.1,0.95,dr)); wc=mix(wc,uTeal,smoothstep(0.8,2.5,dr));
    wc=mix(wc,wc*vec3(0.70,1.10,0.76)+vec3(0.,0.015,0.),smoothstep(0.40,0.66,vn(xz*0.0045+7.3))*0.85*(1.-uRoad));       // some pools run to emerald
    // the oasis pool under the buriti palms: deep, shaded, stained dark teal
    float gk=1.-smoothstep(0.5,1.12,length((xz-uGrove.xy)*uGrove.zw)+0.12*(vn(xz*0.07)-.5));
    wc=mix(wc,uTeal*vec3(0.46,0.60,0.62),gk*smoothstep(0.2,1.3,d)*0.85);
    vec3 body=mix(bed*uMint*1.7,wc*(1.-0.25*alg),1.-exp(-d*mix(0.8,mix(1.6,3.4,farK),smoothstep(2.5,22.,dist))*(1.-0.5*nearW)*(1.+2.5*gk)));      // at arm's length the bed shows through
    body*=mix(vec3(0.44,0.57,0.76),vec3(1.04),sh);                                     // under a dune's shadow: a darker, bluer teal
    // wind ripples and cat's-paws running downwind (+Z)
    float cat=smoothstep(.45,.75,vn(vec2(xz.x*0.035+3.,xz.y*0.02-uTime*0.11)));
    float amp=(0.03+0.075*cat)/(1.+dist*0.01);
    vec2 g=vec2(0.); float q;
    q=dot(xz,vec2(0.29,0.96))*4.1-uTime*3.1+wob;       g+=vec2(0.29,0.96)*cos(q)*BK(4.1,0.29,0.96); float q1=q;
    q=dot(xz,vec2(-0.6,0.8))*7.3-uTime*4.2+wob*1.7;    g+=vec2(-0.6,0.8)*cos(q)*0.7*BK(7.3,0.6,0.8);
    q=dot(xz,vec2(0.87,0.5))*13.+uTime*5.0+wob*2.3;    g+=vec2(0.87,0.5)*cos(q)*0.5*BK(13.,0.87,0.5);
    q=dot(xz,vec2(-0.2,0.98))*1.3-uTime*1.6+wob*0.5;   g+=vec2(-0.2,0.98)*cos(q)*0.8*BK(1.3,0.2,0.98); float q4=q;
    q=dot(xz,vec2(0.12,0.99))*0.42-uTime*0.9+wob*0.3;  g+=vec2(0.12,0.99)*cos(q)*0.55*BK(0.42,0.12,0.99);   // a long slow band that survives at range
    // capillary ripples: at arm's length under the bill the metre-long waves are bigger than the frame (there they are
    // eased off: the noise that breaks them up reads as blurred blotches), and these crisp hand-wide lines are what shows
    float wobc=vn(xz*0.11)*5.+vn(xz*0.43)*2.2, nearC=1.-smoothstep(1.2,7.5,dist);
    vec2 gc=vec2(0.); float qc;
    qc=dot(xz,vec2(0.5,0.866))*37.-uTime*9.+wobc*3.;       gc+=vec2(0.5,0.866)*cos(qc)*0.5*BK(37.,0.5,0.866);
    qc=dot(xz,vec2(-0.37,0.93))*59.+uTime*12.+wobc*4.3;    gc+=vec2(-0.37,0.93)*cos(qc)*0.38*BK(59.,0.37,0.93);
    qc=dot(xz,vec2(0.1,0.995))*21.-uTime*7.+wobc*2.1;      gc+=vec2(0.1,0.995)*cos(qc)*0.62*BK(21.,0.1,0.995);
    vec2 gsl=g*amp*(1.-0.78*nearL)+gc*(amp+0.075*nearC);
    vec3 n=normalize(vec3(-gsl.x,1.,-gsl.y));
    vec3 R=reflect(-V,n); R.y=abs(R.y)+0.015;
    float rl=max(length(R.xz),1e-4); vec2 rd=R.xz/rl; float tanR=R.y/rl;
    vec3 sky=mix(uHor,uZen,uNight.y+(1.-uNight.y)*pow(clamp(R.y,0.,1.),0.4));
    // mirror of the dunes: march the height map along the reflected ray
    float hit=0., hsh=1., ht=0., t=3.;
    for(int i=0;i<10;i++){
      vec4 m=textureLod(uMap,muv(xz+rd*t),0.);
      float c=smoothstep(-0.015,0.015,(m.r-uWater)/t-tanR)*(1.-hit);
      hsh=mix(hsh,m.g,c); ht=mix(ht,t,c); hit+=c; t*=1.6;
    }
    vec3 mcol=uSand*(uFill*0.42+uSunCol*0.8*clamp(hsh,0.,1.)*cs);
    mcol=mix(mcol,uHor,1.-exp(-ht*0.0014));
    vec3 refl=mix(sky,mcol,clamp(hit,0.,1.));
    float sheetK=(1.-shoreK)*(1.-smoothstep(0.1,0.42,d))*(1.-farK);
    refl=mix(refl,mix(uHor,uZen,0.78)*1.05,0.6*sheetK*(1.-clamp(hit,0.,1.))*(1.-uRoad));
    float fr=uNight.x+(1.-uNight.x)*pow(1.-clamp(dot(V,n),0.,1.),5.);
    fr=max(fr,sheetK*(0.36+0.5*pow(1.-clamp(V.y,0.,1.),3.)));      // a sheet of water on a flat floor mirrors the sky
    col=mix(body,refl,fr*uNight.z*(1.-uNight.w*smoothstep(40.,350.,dist)));                 // far pools keep their colour
    col*=1.-0.10*cat*(1.-fr);
    // sun glitter: true specular plus sparse twinkles that gather on the sunward half of each pool
    vec3 Hh=normalize(V+uSun+vec3(0.,1e-3,0.));
    float spec=pow(max(dot(n,Hh),0.),420.)*2.4;
    spec*=mix(1.,0.25+2.2*smoothstep(.45,.8,vn(xz*mix(34.,9.,smoothstep(2.,30.,dist))+uTime*vec2(2.3,3.1))),1.-smoothstep(25.,60.,dist));   // the sun's own glints break into sparkle, not ovals
    vec2 sl=uSun.xz/max(length(uSun.xz),1e-4);
    float toward=dot(-V.xz/max(length(V.xz),1e-4),sl);
    col*=1.+clamp(dot(n.xz,sl)*2.4*(1.+1.6*nearW),-0.16-0.16*nearW,0.2+0.22*nearW)*(1.-smoothstep(8.,70.,dist));           // each ripple has a lit and a shaded flank
    col+=uSunCol*uMint*caus*mix(0.09,0.15,nearL)*nearW*sh;                                 // the light net just under the surface
    float gs=mix(5.,0.35,smoothstep(8.,420.,dist));
    float tk=vn(xz*gs+uTime*vec2(.9,2.3))*vn(xz*gs*1.7-uTime*vec2(1.7,.6)+5.);
    // within a few metres the twinkles are fine streaks lying along the ripple crests, never blobs
    float nearK=1.-smoothstep(6.,16.,dist), gn=mix(44.,11.,smoothstep(1.5,12.,dist));
    vec2 gq=vec2(dot(xz,vec2(0.96,-0.29))*0.55,dot(xz,vec2(0.29,0.96))*1.5)*gn;
    float tkn=vn(gq+uTime*vec2(1.3,2.9))*vn(gq*1.7-uTime*vec2(2.1,.9)+5.);
    float tkk=mix(smoothstep(.5,.6,tk),smoothstep(.46,.56,tkn)*smoothstep(0.15,0.85,0.5+0.5*cos(q1))*smoothstep(0.5,1.8,dist),nearK);
    // where a twinkle is smaller than a pixel it would be static: there the glitter becomes its own mean, a smooth
    // sheen broken only by the long ripple lines
    float sub=smoothstep(0.3,0.85,gs*1.7*max(fwx,fwz))*(1.-nearK);
    float lines=0.62+0.38*cos(q4)*BK(1.3,0.2,0.98)+0.2*cos(q)*BK(0.42,0.12,0.99);
    float tg2=smoothstep(0.05,0.95,toward); float road=smoothstep(0.93,0.998,toward); road*=road;
    float day=mix(tkk,0.045*lines,sub)*tg2*tg2*(0.3+0.7*cat);
    float night=mix(mix(smoothstep(.5-.26*road,.6-.22*road,tk),tkk,nearK),(0.07+0.3*road)*lines,sub)*road*(0.6+0.4*cat);
    float tw=mix(day,night,uRoad);
    tw=mix(tw,gstr*0.3*(0.25+0.75*tg2*tg2)*(1.-smoothstep(30.,110.,dist)),sheetK);
    col+=uSunCol*(spec+tw*3.)*uGlit*sh;
    // lapping foam line and a second, scalloped lap band: only where the bed shelves; on flooded flats the water just ends
    float shore=smoothstep(0.03,0.065,bslope)*mix(1.,0.55,uRoad);
    float foam=((1.-smoothstep(0.0,0.075,d))*0.85+(1.-smoothstep(.0,.03,abs(d-0.16-0.07*vn(xz*.8+uTime*.3))))*0.25)*shore;
    vec3 fmc=vec3(0.86,0.9,0.92)*min(vec3(1.),(uSunCol+uFill)*1.3)*(0.42+0.58*sh);
    col=mix(col,mix(fmc,max(col,fmc),uRoad),clamp(foam,0.,1.));              // (under the moon foam never dims the glitter it lies in)
    colW=col;
  }
  col=mix(colS,colW,wk);
  col*=mix(vec3(1.),vec3(0.80,0.845,0.91),sq);              // rain-wet sand, and water under the shower: a shade darker
  #ifdef USE_FOG
    // the outer 50 m dissolve into plain lit sand (the world's far rings do the same), so no seam shows
    float e=max(max(smoothstep(uBounds.y-50.,uBounds.y,abs(xz.x)),1.-smoothstep(uBounds.z,uBounds.z+50.,xz.y)),smoothstep(uBounds.w-50.,uBounds.w,xz.y));
    float sF=(1.-exp(-max(uSun.y,0.)*5.4))*cs;
    col=mix(col,uSand*0.95*(uFill*mix(0.26,0.96,1.-sF)*mix(vec3(1.),vec3(0.97,1.06,1.24),1.-sF)+uSunCol*sF*0.84)*mix(vec3(1.),vec3(0.80,0.845,0.91),sq),e*uEdgeFade);
  #endif
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`;function st(s){const x=[],d=[],F=[],b=[],g=[],E=[.022,.022,.027],p=[.84,.84,.82],A=[.3,.31,.33],j=[s.r*1.25,s.g*1.1,s.b*1.1],W=(C,N,T,e,h,m,f,r=0,t=0,n=0,o=0)=>(x.push(C,N,T),d.push(e,h,m),F.push(f[0],f[1],f[2]),b.push(r,t,n,o),x.length/3-1),u=(C,N,T,e)=>g.push(C,N,T,C,T,e),S=[[-.204,.011,.008,.004],[-.182,.027,.022,.012],[-.145,.034,.03,.015],[-.1,.031,.029,.007],[-.04,.046,.045,0],[.04,.047,.046,.001],[.11,.032,.031,.006],[.172,.011,.014,.011]],q=8,z=[];S.forEach(([C,N,T,e],h)=>{z.push(x.length/3);for(let m=0;m<q;m++){const f=m/q*Math.PI*2,r=Math.sin(f),t=Math.cos(f),n=t>.2&&!(h<=1)&&!(h===2&&t<.6);W(r*T,e+t*N,C,r,t,h===0?-.6:h===7?.6:0,n?E:p,0,0,0,0)}});for(let C=0;C<S.length-1;C++)for(let N=0;N<q;N++){const T=z[C]+N,e=z[C]+(N+1)%q,h=z[C+1]+(N+1)%q,m=z[C+1]+N;u(T,m,h,e)}const B=(C,N,T,e,h)=>{const m=[[0,1,j],[.42,.62,j],[.5,.56,E],[1,.12,E]],f=[];for(const[r,t,n]of m){const o=-.2-C*r,l=.0055*t+8e-4,c=(N+T)/2-h*r,w=(N-T)/2*t;f.push([W(0,c+w,o,0,1,0,n,0,0,e,0),W(l,c,o,1,0,0,n,0,0,e,0),W(0,c-w,o,0,-1,0,n,0,0,e,0),W(-l,c,o,-1,0,0,n,0,0,e,0)])}for(let r=0;r<m.length-1;r++)for(let t=0;t<4;t++)u(f[r][t],f[r][(t+1)%4],f[r+1][(t+1)%4],f[r+1][t])};B(.082,.02,.003,0,.006),B(.112,.001,-.016,2,-.002);const _=.54,k=[0,.16,.32,.45,.63,.8,.93,1],Z=[.118,.128,.118,.105,.084,.058,.032,.006];for(const C of[-1,1]){const N=[];k.forEach((T,e)=>{const h=-.058-.04*Math.sin(Math.min(1,T/.45)*Math.PI/2)+.42*Math.pow(Math.max(0,T-.45),1.7),m=C*(.034+T*_),f=Z[e],r=.022;N.push([W(m,r,h,0,1,0,E,C,T,1,0),W(m,r+.009*(1-T),h+f*.4,0,1,0,E,C,T,1,.4),W(m,r-.002,h+f,0,1,0,T<.5?p:E,C,T,1,1)])});for(let T=0;T<N.length-1;T++)for(let e=0;e<2;e++){const h=N[T][e],m=N[T+1][e],f=N[T+1][e+1],r=N[T][e+1];C>0?u(h,r,f,m):u(h,m,f,r)}}const L=W(0,.014,.15,0,1,0,E,0,0,3,0),O=W(-.02,.012,.16,0,1,0,E,0,0,3,0),ee=W(.02,.012,.16,0,1,0,E,0,0,3,0),te=W(-.05,.012,.262,0,1,0,p,0,0,3,1),R=W(.05,.012,.262,0,1,0,p,0,0,3,1),U=W(0,.012,.218,0,1,0,A,0,0,3,1);g.push(L,O,te,L,te,U,L,U,R,L,R,ee);const X=new v.BufferGeometry;return X.setAttribute("position",new v.Float32BufferAttribute(x,3)),X.setAttribute("normal",new v.Float32BufferAttribute(d,3)),X.setAttribute("aCol",new v.Float32BufferAttribute(F,3)),X.setAttribute("aAnim",new v.Float32BufferAttribute(b,4)),X.setIndex(g),X}const Ie=`
uniform sampler2D uMap; uniform vec4 uRect; uniform vec4 uBounds; uniform vec3 uCamL; uniform vec4 uLine; uniform vec4 uFlock;
uniform float uTime,uWater,uMinSpan,uMaxSc,uFold,uPeel,uTilt,uSkein,uNear; uniform vec2 uHead; uniform vec3 uEsc;
attribute vec4 aBird; attribute vec4 aBird2;
// which way this bird flies: the birds round the camera take its heading, the far ends of the line keep straight upwind
vec2 birdHead(){ vec2 h=mix(uHead,vec2(0.,-1.),smoothstep(30.,170.,abs(aBird.x))); return h/max(length(h),1e-3); }
float surfY(vec2 xz){ return max(textureLod(uMap,(xz-uRect.xy)*uRect.zw,0.).r,uWater); }
float flockW(){ return uFlock.y*clamp(uFlock.w+1.-aBird2.z,0.,1.); }
// WINGMATES (uNear): while we skim, the two nearest pairs close in on either side, each at the head of its own furrow
float nearW(){ return uNear*(1.-step(2.5,aBird2.z)); }
// THE ESCORT (uEsc.x): along the tall brink the two nearest pairs close up on our right, out over the slip face
float escW(){ return uEsc.x*(1.-step(2.5,aBird2.z))*(1.-uSkein); }
// flock slot: x lateral, y metres ahead, z metres below the camera's own line of flight
vec3 flockSlot(){
  float rk=aBird2.z, sd=aBird.x<0.?-1.:1.;
  float a=5.4+0.6*(rk-6.)+2.6*aBird2.y, lat=1.3+aBird.z*(0.78*a+1.2), dn=0.5+aBird2.w*(0.40*a+0.6);
  if(rk<1.5){ a=4.1; lat=2.2; dn=0.55; } else if(rk<2.5){ a=4.4; lat=3.5; dn=0.1; } else if(rk<3.5){ a=5.6; lat=1.5; dn=1.25; }
  else if(rk<4.5){ a=5.3; lat=4.7; dn=1.5; } else if(rk<5.5){ a=6.0; lat=2.7; dn=0.45; } else if(rk<6.5){ a=6.3; lat=6.2; dn=0.6; }
  // THE SKEIN (uSkein): seen from high above, the flock strings out into a V well ahead of us, its leader furthest and lowest
  a=mix(a,17.+(19.-min(rk,19.))*2.5,uSkein); lat=mix(lat,0.8+rk*2.3,uSkein); dn=mix(dn,0.6*sin(rk*1.7),uSkein);
  // every slot drifts on its own slow clock, so the flock never holds a pattern
  lat+=0.35*sin(uTime*0.6+aBird.z*40.)+1.0*sin(uTime*0.23+aBird.z*91.); dn+=0.22*sin(uTime*0.83+aBird.z*23.)+0.45*sin(uTime*0.19+aBird2.y*50.);
  a+=0.4*sin(uTime*0.47+aBird.z*61.)+1.5*sin(uTime*0.15+aBird2.w*44.);
  // the dive (uPeel): pairs peel away ahead and down in turn while the outer ones come through from behind
  float pk=uPeel*1.7-fract(aBird.z*7.31), tt=clamp(pk,0.,1.);
  float bk=step(6.5,rk)*smoothstep(0.,0.25,uPeel)*(1.-smoothstep(0.,0.5,pk+0.45));
  a+=15.*tt-12.*bk; dn+=7.*tt*tt; lat=lat*(1.+0.7*tt)+3.*bk;
  vec3 o=vec3(sd*lat,a,dn); float ek=escW();
  if(ek>0.){
    vec3 es=rk<1.5?(sd<0.?vec3(1.9,5.7,-0.1):vec3(4.4,6.9,-0.9)):(sd<0.?vec3(0.2,7.9,1.2):vec3(6.0,8.6,0.2));
    es+=vec3(0.35*sin(uTime*0.5+aBird.z*40.),0.45*sin(uTime*0.41+aBird.z*61.),0.22*sin(uTime*0.7+aBird.z*23.));
    o=mix(o,es,ek);
  }
  return o;
}
vec2 birdXZ(){
  vec2 hd=birdHead(), rt=vec2(-hd.y,hd.x);
  float lx=aBird.x+sin(uTime*0.23+aBird.z*40.)*0.45;
  float flex=5.*sin(aBird.x*0.021+uTime*0.31)+2.5*sin(aBird.x*0.063-uTime*0.5);
  float ah=uLine.z*(0.5+aBird2.x)-aBird.y-flex*min(1.,abs(aBird.x)*0.05);
  float nk=nearW();
  if(nk>0.){
    float sd=aBird.x<0.?-1.:1., p1=1.-step(1.5,aBird2.z);
    float nl=mix(3.3,1.5,p1)+0.14*sin(uTime*0.5+aBird.z*40.), na=mix(6.6-0.45*sd,4.6+0.35*sd,p1)+0.3*sin(uTime*0.37+aBird.z*61.);
    lx=mix(lx,sd*nl,nk); ah=mix(ah,na,nk);
  }
  vec3 f=flockSlot(); float w=flockW();
  lx=mix(lx,f.x,w); ah=mix(ah,f.y,w);
  vec2 c=vec2(uLine.y,uLine.x)+rt*lx+hd*ah;
  return vec2(clamp(c.x,uBounds.x+12.,uBounds.y-12.),clamp(c.y,uBounds.z+30.,uBounds.w-12.));
}
vec3 birdCentre(vec2 c,out float skim,out float pitch,out float scale,out float loft){
  vec2 hd=birdHead(); float hD=surfY(c+hd*14.), hA=surfY(c+hd*7.), hB=surfY(c), hC=surfY(c-hd*7.);
  float y0=max((hD+2.*hA+2.*hB+hC)/6.,max(hB,hA-2.));
  vec3 f=flockSlot(); float w=flockW();
  skim=(1.-smoothstep(0.02,0.3,hB-uWater))*(1.-smoothstep(0.02,0.3,hA-uWater))*(1.-smoothstep(0.,0.25,w));
  loft=max(uLine.w*aBird.w,w*uFold*0.42); skim*=1.-smoothstep(0.02,0.2,loft);
  float dist=length(uCamL-vec3(c.x,y0+1.,c.y));
  scale=max(clamp(dist*uMinSpan,1.,uMaxSc),1.+0.22*w);
  scale=max(scale,1.+nearW()*(1.-smoothstep(0.,0.25,w))*mix(0.5,0.15,1.-step(1.5,aBird2.z))+0.3*escW()*w);
  float y=y0+mix(1.0+0.7*aBird2.w,0.074*scale,skim)+uLine.w*aBird.w*(3.+9.*aBird2.w)+sin(uTime*0.9+aBird.z*17.)*0.12*(1.-skim);
  float yf=max(uFlock.x-f.y*mix(uFlock.z,uEsc.y,escW())-f.z,max(hB,hA)+0.75);
  y=mix(y,yf,w);
  pitch=clamp(atan((hA-hC)/14.),-0.7,0.7)*(1.-0.5*loft);
  pitch=mix(pitch,clamp(-atan(uFlock.z)*0.85,-0.7,0.7)*(1.-0.8*uSkein),w);
  return vec3(c.x,y,c.y);
}`,nt=`
${Ie}
attribute vec4 aAnim; attribute vec3 aCol;
varying vec3 vCol; varying vec3 vNl; varying vec3 vInfo;
#include <fog_pars_vertex>
void main(){
  float skim,pitch,scale,loft; vec2 c=birdXZ(); vec3 ctr=birdCentre(c,skim,pitch,scale,loft);
  vec3 p=position; vec3 n=normal; float part=aAnim.z;
  float ph=uTime*(21.+6.*aBird2.y)+aBird.z*60.;
  float climb=clamp(pitch*2.,0.,1.);
  float amp=mix(0.50,0.27,skim)*(1.-0.6*loft)+0.15*climb, bias=mix(0.10,0.60,skim)+0.2*loft;
  float th1=bias+amp*sin(ph), th2=-0.12+amp*0.85*sin(ph-1.15)-0.55*loft;
  if(part>0.5&&part<1.5){
    float r=aAnim.y, sd=aAnim.x, li=min(r,0.45)*0.54, lo=max(r-0.45,0.)*0.54, a2=th1+th2;
    p.x=sd*(0.034+li*cos(th1)+lo*cos(a2)*(1.-0.3*loft));
    p.y+=li*sin(th1)+lo*sin(a2);
    p.z+=lo*loft*0.8;
    float an=r<0.45?th1:a2;
    n=vec3(-sd*sin(an),cos(an),0.);
  } else if(part>1.5&&part<2.5){
    float a=0.72*skim; vec3 q=p-vec3(0.,-0.004,-0.2);
    p.y=-0.004+q.y*cos(a)+q.z*sin(a); p.z=-0.2+q.z*cos(a)-q.y*sin(a);
  } else { p.y-=0.012*sin(ph); }
  float roll=sin(uTime*0.45+aBird.z*31.)*0.14*(1.-skim)+uEsc.z*flockW()*(0.55+0.9*aBird2.y);
  float cr=cos(roll), sr=sin(roll); p.xy=vec2(p.x*cr-p.y*sr,p.x*sr+p.y*cr); n.xy=vec2(n.x*cr-n.y*sr,n.x*sr+n.y*cr);
  // far birds seen from behind and barely above are edge-on and vanish: uTilt tips their backs toward such a camera
  float pt=pitch+uTilt*smoothstep(12.,35.,length(uCamL-ctr));
  float cp=cos(pt), sp=sin(pt);
  p.yz=vec2(p.y*cp-p.z*sp,p.z*cp+p.y*sp); n.yz=vec2(n.y*cp-n.z*sp,n.z*cp+n.y*sp);
  vec2 hd=birdHead(); p.xz=vec2(-hd.y*p.x-hd.x*p.z,hd.x*p.x-hd.y*p.z); n.xz=vec2(-hd.y*n.x-hd.x*n.z,hd.x*n.x-hd.y*n.z);
  vCol=aCol; vNl=n; vInfo=vec3(part,aAnim.y,aAnim.w);
  vec4 mvPosition=modelViewMatrix*vec4(ctr+p*scale,1.);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,it=`
uniform vec3 uSun,uSunCol,uFill;
varying vec3 vCol; varying vec3 vNl; varying vec3 vInfo;
#include <fog_pars_fragment>
void main(){
  vec3 n=normalize(vNl+vec3(0.,1e-4,0.)); vec3 alb=vCol;
  float sheet=step(0.5,vInfo.x)*(1.-step(1.5,vInfo.x))+step(2.5,vInfo.x);
  if(!gl_FrontFacing){
    n=-n;
    vec3 under=mix(vec3(0.82,0.83,0.82),vec3(0.16,0.165,0.18),clamp(smoothstep(0.55,1.,vInfo.z)*0.6+smoothstep(0.55,0.95,vInfo.y)*0.8,0.,1.));
    alb=mix(alb,under,sheet);
  }
  float ndl=max(dot(n,uSun),0.);
  vec3 col=alb*(uFill*(0.62+0.3*n.y)+uSunCol*(1.-exp(-ndl*3.))+vec3(0.30,0.33,0.34)*max(-n.y,0.));
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`,lt=`
${Ie}
uniform float uPx,uWakeLen,uWakeW,uWakeSolid;
varying vec4 vWk; varying vec3 vSh;
#include <fog_pars_vertex>
void main(){
  float skim,pitch,scale,loft; vec2 c=birdXZ(); vec3 ctr=birdCentre(c,skim,pitch,scale,loft);
  float s=position.z, sd=position.x;
  vec2 hd=birdHead(), rt=vec2(-hd.y,hd.x);
  vec2 ctrl=c-hd*(s*uWakeLen-0.22*scale);
  float dist=length(uCamL-vec3(ctrl.x,uWater,ctrl.y));
  float w=max((0.03+0.8*pow(s,0.8))*uWakeW,dist*uPx*0.9);
  float mx=(0.16*sin(s*7.+uTime*1.3+aBird.z*40.)+0.09*sin(s*17.-uTime*2.1+aBird.z*71.))*s*uWakeW;
  vec2 q=ctrl+rt*(mx+sd*w);
  vec4 m=textureLod(uMap,(q-uRect.xy)*uRect.zw,0.);
  float wet=smoothstep(0.03,0.22,uWater-m.r);
  float a=wet*pow(1.-s,1.5)*(1.-smoothstep(0.02,0.25,loft))*(1.-flockW())*smoothstep(0.,0.5,skim+0.5*wet);
  a*=mix(smoothstep(1.3,4.4,dist),1.,uWakeSolid);          // a neighbour's furrow is gone before it reaches us: it never crosses the corner of the frame
  vWk=vec4(sd,s,a,dist); vSh=vec3(clamp(m.g,0.,1.),aBird.z,nearW());
  vec4 mvPosition=modelViewMatrix*vec4(q.x,uWater+0.03+dist*0.0005,q.y,1.);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,rt=`
uniform vec3 uSunCol,uFill; uniform float uTime,uWakeSolid;
varying vec4 vWk; varying vec3 vSh;
#include <fog_pars_fragment>
${Te}
void main(){
  float e=abs(vWk.x), s=vWk.y, id=vSh.y*53.;
  float edge=smoothstep(0.78,0.9,e)*(1.-smoothstep(0.93,1.,e));
  float br=smoothstep(0.34,0.62,vn(vec2(s*11.-uTime*1.1+id,e*2.5+id*3.)));
  float fill=(1.-e)*0.10*vn(vec2(s*24.-uTime*2.,vWk.x*3.+id));
  float core=pow(clamp(1.-s,0.,1.),12.)*(1.-e*e);
  // close by: the cut itself, a thin bright furrow soon gone, and two faint broken lines of ripples spreading from it
  float fur=exp(-e*e*46.)*pow(clamp(1.-s,0.,1.),2.2)*(0.5+0.5*br);
  float near=fur*1.25+(edge*br*smoothstep(0.03,0.3,s)+fill)*0.2+core*1.2;
  // a wingmate's furrow at our side stays a thin silver cut, never a white wedge
  float thin=max(smoothstep(60.,220.,vWk.w),uWakeSolid*(1.-vSh.z));
  float I=mix(near,0.5*(0.5+0.5*br)*(1.-0.5*s),thin)*vWk.z;
  vec3 col=(uFill*0.6+uSunCol*(0.4+1.1*vSh.x))*(1.+2.2*core);
  gl_FragColor=vec4(col,clamp(I*mix(0.5+0.35*vSh.z,0.95,thin),0.,1.));
  #include <fog_fragment>
}`,ct=`
uniform sampler2D uMap; uniform vec4 uRect; uniform float uTime,uPlume,uFar; uniform vec3 uCamL;
${He}
attribute vec4 aP; attribute vec4 aQ;
varying vec2 vUv; varying vec3 vPl;
#include <fog_pars_vertex>
void main(){
  float f=fract(uTime*aQ.y+aQ.w);
  float gust=0.55+0.45*sin(uTime*0.35+aP.x*0.013+aP.z*0.02);
  float farK=smoothstep(140.,420.,length(uCamL-aP.xyz))*clamp((uFar-0.75)/2.35,0.,1.);
  vec3 p=aP.xyz+vec3(sin(aP.w*40.)*3.*f,0.5+aQ.z*(3.2*f-2.4*f*f)*(1.+0.6*farK),f*(18.+aQ.x*2.6)*(1.+0.6*farK));
  p.y+=bowlY(p.xz);
  float sh=clamp(textureLod(uMap,(p.xz-uRect.xy)*uRect.zw,0.).g,0.,1.);
  vec4 mvPosition=modelViewMatrix*vec4(p,1.);
  float size=aQ.x*(0.5+1.5*f)*(1.+0.15*farK);
  mvPosition.xy+=position.xy*size*vec2(2.1,0.7);
  float a=smoothstep(0.,0.14,f)*pow(1.-f,mix(1.25,0.75,farK))*gust*uPlume*smoothstep(4.,34.,-mvPosition.z)*mix(1.,uFar,smoothstep(110.,340.,-mvPosition.z));
  vUv=position.xy; vPl=vec3(a,mix(sh,1.,0.8),aP.w);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ut=`
uniform vec3 uSunCol,uFill,uSand;
varying vec2 vUv; varying vec3 vPl;
#include <fog_pars_fragment>
${Te}
void main(){
  float r2=dot(vUv,vUv);
  float a=max(exp(-r2*3.4)-0.033,0.)*(0.55+0.75*vn(vUv*2.3+vPl.z*9.));
  vec3 col=uSand*(uFill*0.42+uSunCol*0.86*vPl.y);         // sunlit white sand in the air (bright against a shaded face), never bright enough to bloom into a glare
  gl_FragColor=vec4(col,clamp(a*vPl.x*0.7,0.,0.92));
  #include <fog_fragment>
}`,De=68,Ge={afternoon:{az:De,el:20,sun:[1,.925,.78],sunI:1.04,fillI:.95,cloud:.62,plume:1,glit:1,wet:1,hor:"#E6EEF2",sandMul:1,refl:[.03,.3,.56,.7],road:0},noon:{az:62,el:52,sun:[1,.975,.92],sunI:.96,fillI:1,cloud:.4,plume:.45,glit:1.4,wet:1,hor:"#EAF1F4",sandMul:1,refl:[.03,.3,.56,.7],road:0},squall:{az:De,el:20,sun:[1,.925,.78],sunI:1.06,fillI:.92,cloud:.6,plume:.8,glit:.9,wet:1,hor:"#C4D3E2",sandMul:.97,refl:[.03,.2,.6,.6],road:0},moon:{az:-44,el:35,sun:[.66,.76,1],sunI:.23,fillI:.085,water:[.035,.05,.075],grey:.65,cloud:.35,plume:.7,glit:2.6,wet:.3,hor:"#2A3A5C",sandMul:1,refl:[.3,.1,1,.1],road:1}};async function ht(s,x={}){const d=s.rng.fork?s.rng.fork("thousand-lagoons-hero"):s.rng,F=s.noise||s.core.makeNoise(Math.floor(d()*1e9)),b=(x.palette&&x.palette.length>=7?x.palette:je).map(a=>new v.Color(a)),g=Ge[x.hour]||Ge.afternoon,E=x.season||"july",p=.9+(x.waterBias??0)+(E==="june"?.9:E==="september"?-.7:0)+d.range(-.08,.08),A=(x.plumeStrength??1)*g.plume*(E==="september"?1.5:1),j=s.quality?.detail??1,W=g.az*Math.PI/180,u=g.el*Math.PI/180,S=x.sunDir?new Y().fromArray(x.sunDir).normalize():new Y(-Math.sin(W)*Math.cos(u),Math.sin(u),-Math.cos(W)*Math.cos(u)),q=(a,i=1)=>new Y(a.r*i,a.g*i,a.b*i),z=new Y().fromArray(g.water||[1,1,1]),B=a=>{const i=q(a,.95),H=(i.x+i.y+i.z)/3,Q=g.grey||0;return i.lerp(new Y(H,H,H),Q).multiply(z)},_=new v.Group;_.name="thousand-lagoons-hero";const k=Qe(d,F,p);await s.yield?.();const Z=await Ye(s,k);await s.yield?.();const L=await Xe(s,Z,p,S),O=(a,i)=>{const H=Math.min(V-1.001,Math.max(0,(a-J)/(he-J)*V-.5)),Q=Math.min(re-1.001,Math.max(0,(i-$)/(de-$)*re-.5)),le=H|0,fe=Q|0,me=H-le,Ke=Q-fe,Me=fe*V+le;return Math.min(1,Math.max(0,(L[Me]*(1-me)+L[Me+1]*me)*(1-Ke)+(L[Me+V]*(1-me)+L[Me+V+1]*me)*Ke))};await s.yield?.();const ee=$e(Z,L);await s.yield?.();const te=()=>v.UniformsUtils.clone(v.UniformsLib.fog),R={uMap:{value:ee},uRect:{value:new v.Vector4(J,$,1/(he-J),1/(de-$))},uBounds:{value:new v.Vector4(J,he,$,de)},uCamL:{value:new Y(0,60,200)},uTime:{value:0},uWater:{value:p},uSun:{value:S.clone()},uSunCol:{value:new Y().fromArray(g.sun).multiplyScalar(g.sunI*(x.sunIntensity??1))},uFill:{value:q(b[1],g.fillI)},uSand:{value:q(b[0],g.sandMul)},uPlume:{value:A},uLine:{value:new v.Vector4(0,0,0,0)},uMinSpan:{value:.01},uPx:{value:.003},uFlock:{value:new v.Vector4(0,0,0,0)},uFold:{value:0},uPeel:{value:0},uMaxSc:{value:6},uHead:{value:new v.Vector2(0,-1)},uWakeLen:{value:7.5},uWakeW:{value:1},uWakeSolid:{value:0},uSkein:{value:0},uNear:{value:0},uEsc:{value:new Y(0,.1,0)},uTilt:{value:0},uFar:{value:.6},uBowl:{value:x.bowl===!1?0:1}},U=(...a)=>Object.fromEntries(a.map(i=>[i,R[i]])),X=await Je(s,k,p),C=new v.ShaderMaterial({uniforms:{...te(),...U("uMap","uRect","uBounds","uCamL","uTime","uWater","uSun","uSunCol","uFill","uSand","uPlume","uBowl"),uMint:{value:B(b[2])},uTurq:{value:B(b[3])},uTeal:{value:B(b[4])},uNight:{value:new v.Vector4().fromArray(g.refl)},uRoad:{value:g.road},uZen:{value:q(b[5],x.hour==="moon"?.08:.95)},uHor:{value:q(new v.Color(g.hor),x.hour==="moon"?1:.9)},uGrove:{value:new v.Vector4(-153,150,1/60,1/42)},uSq:{value:new v.Vector4(_e.x,_e.z,x.hour==="squall"?1:0,0)},uCloud:{value:g.cloud},uEdgeFade:{value:x.edgeFade===!1?0:1},uWet:{value:g.wet},uGlit:{value:g.glit}},vertexShader:at,fragmentShader:ot,fog:!0}),N=new v.Mesh(X,C);N.name="sand-and-lagoons",N.frustumCulled=!1,_.add(N),await s.yield?.();const T=Math.max(120,Math.min(260,Math.round(x.birds??200))),e=Math.ceil(T/2),h=Math.max(.004,(560-3*e)/(e*e)),m=new Float32Array(T*4),f=new Float32Array(T*4);for(let a=0;a<T;a++){const i=(a>>1)+1,H=a&1?1:-1,Q=Math.min(1,i/30);m[a*4]=H*(3*i+h*i*i)+d.range(-.6,.6)*Q;{const le=i<=4?d.range(-.4,.4):d.range(-1,1)*(2+8*Q),fe=Math.min(1,Math.max(0,(i-7)/8)),me=3*i+h*i*i;m[a*4+1]=-((3+1.12*me)*(1-fe)+6*fe)+le*(i<=4?1:.35+.65*fe)}m[a*4+2]=d(),m[a*4+3]=i<3?.25:Math.pow(d(),1.6),f[a*4]=i<3?.15:d.range(0,.9),f[a*4+1]=d(),f[a*4+2]=d(),f[a*4+3]=d(),f[a*4+2]=i}const r=st(b[6]),t=new v.InstancedBufferGeometry;t.index=r.index;for(const a of["position","normal","aCol","aAnim"])t.setAttribute(a,r.getAttribute(a));t.setAttribute("aBird",new v.InstancedBufferAttribute(m,4)),t.setAttribute("aBird2",new v.InstancedBufferAttribute(f,4)),t.instanceCount=T,await s.yield?.();const n=new v.ShaderMaterial({uniforms:{...te(),...U("uMap","uRect","uBounds","uCamL","uTime","uWater","uLine","uFlock","uFold","uPeel","uHead","uMinSpan","uMaxSc","uTilt","uSkein","uNear","uEsc","uSun","uSunCol","uFill")},vertexShader:nt,fragmentShader:it,fog:!0,side:v.DoubleSide}),o=new v.Mesh(t,n);o.name="skimmer-line",o.frustumCulled=!1,_.add(o);const l=10,c=[],w=[];for(let a=0;a<=l;a++){const i=Math.pow(a/l,1.6);c.push(-1,0,i,0,0,i,1,0,i)}for(let a=0;a<l;a++)for(let i=0;i<2;i++){const H=a*3+i,Q=H+1,le=H+3,fe=le+1;w.push(H,le,Q,Q,le,fe)}const M=new v.InstancedBufferGeometry;M.setAttribute("position",new v.Float32BufferAttribute(c,3)),M.setIndex(w),M.setAttribute("aBird",new v.InstancedBufferAttribute(m,4)),M.setAttribute("aBird2",new v.InstancedBufferAttribute(f,4)),M.instanceCount=T;const K=new v.ShaderMaterial({uniforms:{...te(),...U("uMap","uRect","uBounds","uCamL","uTime","uWater","uLine","uFlock","uFold","uPeel","uHead","uMinSpan","uMaxSc","uTilt","uSkein","uNear","uEsc","uSunCol","uFill","uPx","uWakeLen","uWakeW","uWakeSolid")},vertexShader:lt,fragmentShader:rt,fog:!0,transparent:!0,depthWrite:!1,side:v.DoubleSide}),P=new v.Mesh(M,K);P.name="wakes",P.frustumCulled=!1,P.renderOrder=2,_.add(P),await s.yield?.();const I=Math.max(200,Math.round((x.plumes??1400)*j)),D=k.dunes.map(a=>a.W*(a.H/22)*(a===k.named.tall?1.3:a.auth?2.6:1)),ie=D.reduce((a,i)=>a+i,0),ne=[],G=[];k.dunes.forEach((a,i)=>{const H=Math.round(I*D[i]/ie);for(let Q=0;Q<H;Q++){const[le,fe,me]=qe(a,d.range(-.9,.9));fe<4||Math.abs(le)>he-30||me<$+30||me>de-40||(ne.push(le,k.heightAt(le,me)+.15,me,d()),G.push(d.range(5.5,10.5)*(.7+.016*fe),d.range(.12,.22),d.range(1.5,4.2),d()))}});const y=new v.InstancedBufferGeometry;y.setAttribute("position",new v.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),y.setIndex([0,1,2,0,2,3]),y.setAttribute("aP",new v.InstancedBufferAttribute(new Float32Array(ne),4)),y.setAttribute("aQ",new v.InstancedBufferAttribute(new Float32Array(G),4)),y.instanceCount=ne.length/4;const ae=new v.ShaderMaterial({uniforms:{...te(),...U("uMap","uRect","uTime","uPlume","uSunCol","uFill","uSand","uBowl","uFar","uCamL")},vertexShader:ct,fragmentShader:ut,fog:!0,transparent:!0,depthWrite:!1}),oe=new v.Mesh(y,ae);oe.name="crest-plumes",oe.frustumCulled=!1,oe.renderOrder=3,_.add(oe),await s.yield?.();const{d1:se,d2:ce,tall:ue,gL:pe,gR:ge}=k.named,xe=(a,i)=>k.heightAt(a,i),We=(a,i)=>R.uWater.value-k.heightAt(a,i),Re=(a,i)=>Math.max(k.heightAt(a,i),R.uWater.value),ke=(a,i)=>{const H=qe(a,i);return new Y(H[0],xe(H[0],H[2]),H[2])},Ae=ke(ue,0),Ce=et(k,p,Ae.z);for(const a of Ce){const i=xe(a.x,a.z);a.y=Math.max(a.y,i>p?i+2.4:p+.45)}const Pe=new Y(0,Ae.y+10,Ae.z-2),Le={flyThrough:Ce,reveal:{position:Pe,lookAt:Pe.clone().add(new Y(0,-Math.tan(12*Math.PI/180)*100,-100))},portalSeat:{position:new Y(0,p,be),normal:new Y(0,0,1),width:14,height:7},hornTips:{left:ke(pe,.95),right:ke(ge,-.95)},crests:[se,ce,ue,pe,ge].map(a=>({position:ke(a,0),height:a.H,width:a.W*2})),lagoons:k.basins.slice(0,4).concat(k.basins.slice(6,7)).map(a=>({position:new Y(a.x,p,a.z),radii:[a.a,a.b]})),grove:new Y(-153,p,150),buriedTrunks:new Y(ye(ce.z-55)+8,xe(ye(ce.z-55)+8,ce.z-55),ce.z-55),routeX:ye,crestLine:(a,i)=>ke([se,ce,ue,pe,ge][a],i),sunDir:S.clone(),windDir:new Y(0,0,1),waterLevel:p,bounds:{x0:J,x1:he,z0:$,z1:de},heightAt:xe,waterAt:()=>R.uWater.value,surfaceAt:Re,depthAt:We,shadeAt:O},ze=(a,i,H)=>{const Q=Math.min(1,Math.max(0,(H-a)/(i-a)));return Q*Q*(3-2*Q)};let Fe=x.autoplay===!1;const Ee=R.uLine.value,Be=a=>{a=Math.min(1,Math.max(0,a)),Ee.set(we+(be-we)*a,0,45*ze(.605,.7,a)*(1-ze(.9,.99,a)),ze(.65,.73,a)*(1-ze(.8,.89,a)))};Be(.7);const Ve=new v.Matrix4,Ue=new Y,Ze=new v.Vector2;let Ne=x.birdMinPx??6;return{object:_,radius:110,height:80,center:new Y(0,30,-150),anchors:Le,ground:!1,groundY:0,uniforms:R,sheetUniforms:C.uniforms,heightAt:xe,waterAt:Le.waterAt,surfaceAt:Re,depthAt:We,setProgress(a){Fe=!0,Be(a)},setLine(a,i=0,H=0,Q=0){Fe=!0,Ee.set(a,i,H,Q)},setFlock(a,i=0,H=0,Q=4,le=0){R.uFlock.value.set(a,i,H,Q),R.uFold.value=le},progressAtZ(a){return Math.min(1,Math.max(0,(we-a)/(we-be)))},setPlume(a,i){R.uPlume.value=a,i!==void 0&&(R.uFar.value=i)},setBirdMinPx(a,i=6){Ne=a,R.uMaxSc.value=i},setHeading(a,i){R.uHead.value.set(a,i)},setWake(a=7.5,i=1,H=0){R.uWakeLen.value=a,R.uWakeW.value=i,R.uWakeSolid.value=H},setTilt(a){R.uTilt.value=a},setPeel(a){R.uPeel.value=a},setSkein(a){R.uSkein.value=a},setNear(a){R.uNear.value=a},setEscort(a,i=.1,H=0){R.uEsc.value.set(a,i,H)},update(a,i,H){if(R.uTime.value=i,!Fe){const Q=(i+4)/28%1;Be(.5+.42*Q)}if(H){_.updateWorldMatrix(!0,!1),R.uCamL.value.copy(Ue.setFromMatrixPosition(H.matrixWorld)).applyMatrix4(Ve.copy(_.matrixWorld).invert());const Q=Math.max(.2,H.projectionMatrix.elements[5]),le=s.renderer?s.renderer.getDrawingBufferSize(Ze).y:900;R.uPx.value=2/(Q*Math.max(64,le)),R.uMinSpan.value=Ne*R.uPx.value/1.08}},dispose(){ee.dispose(),r.dispose()}}}export{He as GLSL_BOWL,tt as GLSL_SQUALL,Se as ROUTE,_e as SQUALL,ht as buildHero};
