import*as f from"three";import{clamp as w0,lerp as f0,smoothstep as b0,makeRng as ge,hashSeed as xe}from"../kit/core.js";const ke=["#f6e8d0","#e6c9a0","#b89a7a","#8f96c4","#2f2a44","#3fb8c9","#ff7a4a"],E0=112,U0=82,z0=12.5,A0=62;function Te(e){let i=Math.max(64,Math.ceil(e))*3,y=new Float32Array(i*3),T=new Float32Array(i*3),u=new Float32Array(i*3),A=new Float32Array(i);const H=(o,a)=>{const h=new Float32Array(a);return h.set(o),h},I=()=>{i=Math.ceil(i*.5)*3,y=H(y,i*3),T=H(T,i*3),u=H(u,i*3),A=H(A,i)};let D=0,n=new f.Matrix4;const g=[],P={r:1,g:1,b:1,kind:0,tint:1,axis:null},S=[0,0,0],x=[0,0,0],c=[0,0,0],m=[0,0,0],C=[0,0,0],v=[0,0,0],d=(o,a)=>{const h=n.elements,l=o[0],w=o[1],q=o[2];a[0]=h[0]*l+h[4]*w+h[8]*q+h[12],a[1]=h[1]*l+h[5]*w+h[9]*q+h[13],a[2]=h[2]*l+h[6]*w+h[10]*q+h[14]};function b(o,a,h,l,w,q=1,V=q,z=q){D+3>i&&I(),d(o,S),d(a,x),d(h,c),d(l,m);let k=x[0]-S[0],M=x[1]-S[1],p=x[2]-S[2],N=c[0]-S[0],G=c[1]-S[1],_=c[2]-S[2],L=M*_-p*G,Y=p*N-k*_,U=k*G-M*N;const e0=Math.hypot(L,Y,U);if(e0<1e-9)return;L/=e0,Y/=e0,U/=e0;const X=L*(S[0]-m[0])+Y*(S[1]-m[1])+U*(S[2]-m[2]),J=w?X>0:X<0;J&&(L=-L,Y=-Y,U=-U);const n0=P.tint,r0=L*L,c0=Y*Y,k0=U*U,W0=1+n0*(c0*(Y>0?.03:-.17)+r0*.01+k0*-.1),D0=1+n0*(c0*(Y>0?0:-.19)+r0*-.08+k0*-.08),I0=1+n0*(c0*(Y>0?-.05:-.06)+r0*-.17+k0*.04),t0=D*3,y0=J?c:x,T0=J?x:c,G0=J?z:V,M0=J?V:z;y[t0]=S[0],y[t0+1]=S[1],y[t0+2]=S[2],y[t0+3]=y0[0],y[t0+4]=y0[1],y[t0+5]=y0[2],y[t0+6]=T0[0],y[t0+7]=T0[1],y[t0+8]=T0[2];for(let s0=0;s0<9;s0+=3)T[t0+s0]=L,T[t0+s0+1]=Y,T[t0+s0+2]=U;if(P.axis){const s0=[o,J?h:a,J?a:h];for(let v0=0;v0<3;v0++){const q0=s0[v0],O0=Math.hypot(q0[0]-P.axis[0],q0[2]-P.axis[1]);C[0]=P.axis[0],C[1]=q0[1]-.3*O0-.02,C[2]=P.axis[1],d(C,v);const N0=v0===0?S:v0===1?y0:T0;let g0=N0[0]-v[0],m0=N0[1]-v[1],u0=N0[2]-v[2];const V0=Math.hypot(g0,m0,u0)||1;g0=L*.22+g0/V0*.78,m0=Y*.22+m0/V0*.78,u0=U*.22+u0/V0*.78;const p0=Math.hypot(g0,m0,u0)||1;T[t0+v0*3]=g0/p0,T[t0+v0*3+1]=m0/p0,T[t0+v0*3+2]=u0/p0}}const H0=[q,G0,M0];for(let s0=0;s0<3;s0++)u[t0+s0*3]=P.r*W0*H0[s0],u[t0+s0*3+1]=P.g*D0*H0[s0],u[t0+s0*3+2]=P.b*I0*H0[s0],A[D+s0]=P.kind;D+=3}function t(o,a,h,l,w,q,V=1,z=V,k=z,M=V){b(o,a,h,w,q,V,z,k),b(o,h,l,w,q,V,k,M)}const s={st:P,tri:b,quad:t,get tris(){return D/3},push(o){g.push(n),n=n.clone().multiply(o)},pop(){n=g.pop()},at(o,a){s.push(o),a(),s.pop()},pt(o){const a=[0,0,0];return d(o,a),a},color(o,a=0,h=1){P.r=o.r,P.g=o.g,P.b=o.b,P.kind=a,P.tint=h},box(o,a,h,l,w,q,V=.8,z=0){const k=[(o+l)/2,(a+w)/2,(h+q)/2],M=p=>[p&1?l:o,p&2?w:a,p&4?q:h];t(M(0),M(4),M(6),M(2),k,!1,V,V,1,1),t(M(1),M(5),M(7),M(3),k,!1,V,V,1,1),t(M(0),M(1),M(3),M(2),k,!1,V,V,1,1),t(M(4),M(5),M(7),M(6),k,!1,V,V,1,1),z&1||t(M(0),M(1),M(5),M(4),k,!1,V),z&2||t(M(2),M(3),M(7),M(6),k,!1,1)},cbox(o,a,h,l,w,q,V=.3,z=.8){const k=[(o+l)/2,(a+w)/2,(h+q)/2],M=[(l-o)/2,(w-a)/2,(q-h)/2],p=(_,L,Y,U)=>{const e0=[L,Y,U],X=[0,0,0];for(let J=0;J<3;J++)X[J]=k[J]+e0[J]*(M[J]-(J===_?0:V));return X},N=_=>_[1]<k[1]?z:1,G=(_,L,Y,U)=>t(_,L,Y,U,k,!1,N(_),N(L),N(Y),N(U));for(const _ of[-1,1]){G(p(0,_,-1,-1),p(0,_,1,-1),p(0,_,1,1),p(0,_,-1,1)),G(p(1,-1,_,-1),p(1,1,_,-1),p(1,1,_,1),p(1,-1,_,1)),G(p(2,-1,-1,_),p(2,1,-1,_),p(2,1,1,_),p(2,-1,1,_));for(const L of[-1,1]){G(p(0,_,L,-1),p(0,_,L,1),p(1,_,L,1),p(1,_,L,-1)),G(p(0,_,-1,L),p(0,_,1,L),p(2,_,1,L),p(2,_,-1,L)),G(p(1,-1,_,L),p(1,1,_,L),p(2,1,_,L),p(2,-1,_,L));for(const Y of[-1,1]){const U=p(0,_,L,Y),e0=p(1,_,L,Y),X=p(2,_,L,Y);b(U,e0,X,k,!1,N(U),N(e0),N(X))}}}},archWall(o,a,h,l,w,q=1,V=8,z=.62,k=!1){const M=l/2,p=h/2,N=[0,w,0],G=[o/2-.2,a-.1,0],_=[];for(let X=0;X<=V;X++){const J=Math.PI*(1-X/V),n0=Math.cos(J),r0=Math.sin(J),c0=q>1.01?Math.pow(r0,.8):r0;_.push([M*n0,Math.min(a-.4,w+M*q*c0)])}for(const X of[-p,p]){const J=[0,a/2,0];t([-o/2,0,X],[-M,0,X],[-M,a,X],[-o/2,a,X],J,!1,.86,.8,1,1),t([M,0,X],[o/2,0,X],[o/2,a,X],[M,a,X],J,!1,.8,.86,1,1);for(let n0=0;n0<V;n0++){const r0=_[n0],c0=_[n0+1];t([r0[0],r0[1],X],[c0[0],c0[1],X],[c0[0],a,X],[r0[0],a,X],J,!1,.84,.84,1,1)}}t([-M,0,-p],[-M,0,p],[-M,w,p],[-M,w,-p],N,!0,z*1.15,z*1.15,z,z),t([M,0,-p],[M,0,p],[M,w,p],[M,w,-p],N,!0,z*1.15,z*1.15,z,z);for(let X=0;X<V;X++){const J=_[X],n0=_[X+1];t([J[0],J[1],-p],[J[0],J[1],p],[n0[0],n0[1],p],[n0[0],n0[1],-p],[0,w-M,0],!0,z)}if(t([-o/2,a,-p],[o/2,a,-p],[o/2,a,p],[-o/2,a,p],[0,0,0],!1),t([-o/2,0,-p],[-o/2,0,p],[-o/2,a,p],[-o/2,a,-p],G,!1),t([o/2,0,-p],[o/2,0,p],[o/2,a,p],[o/2,a,-p],[-G[0],G[1],0],!1),k)return;const L=.9,Y=.55,U=.28;s.box(-M-L,w-Y,-p-U,-M+.12,w,p+U,.75),s.box(M-.12,w-Y,-p-U,M+L,w,p+U,.75);const e0=_[V>>1][1];s.box(-.55,e0-.5,-p-U,.55,Math.min(a,e0+1.3),p+U,.75)},column(o,a,h,l,w,q=8){const V=l-h,z=Math.min(.6,V*.08),k=[o,(h+l)/2,a];s.box(o-w*1.35,h,a-w*1.35,o+w*1.35,h+z,a+w*1.35),s.box(o-w*1.3,l-z,a-w*1.3,o+w*1.3,l,a+w*1.3,.7);for(let M=0;M<q;M++){const p=M/q*6.2832,N=(M+1)/q*6.2832,G=w*.82;t([o+Math.cos(p)*w,h+z,a+Math.sin(p)*w],[o+Math.cos(N)*w,h+z,a+Math.sin(N)*w],[o+Math.cos(N)*G,l-z,a+Math.sin(N)*G],[o+Math.cos(p)*G,l-z,a+Math.sin(p)*G],k,!1,.85,.85,1,1)}},lathe(o,a,h,l=10,w=1,q=1){const V=[o,(h[0][1]+h[h.length-1][1])/2,a];for(let z=0;z<h.length-1;z++){const[k,M]=h[z],[p,N]=h[z+1],G=f0(w,q,z/(h.length-1)),_=f0(w,q,(z+1)/(h.length-1));for(let L=0;L<l;L++){const Y=L/l*6.2832,U=(L+1)/l*6.2832,e0=[o+Math.cos(Y)*k,M,a+Math.sin(Y)*k],X=[o+Math.cos(U)*k,M,a+Math.sin(U)*k],J=[o+Math.cos(U)*p,N,a+Math.sin(U)*p],n0=[o+Math.cos(Y)*p,N,a+Math.sin(Y)*p];k<1e-4?b(e0,J,n0,V,!1,G,_,_):p<1e-4?b(e0,X,J,V,!1,G,G,_):t(e0,X,J,n0,V,!1,G,G,_,_)}}},finish(){const o=new f.BufferGeometry;return o.setAttribute("position",new f.BufferAttribute(y.subarray(0,D*3),3)),o.setAttribute("normal",new f.BufferAttribute(T.subarray(0,D*3),3)),o.setAttribute("color",new f.BufferAttribute(u.subarray(0,D*3),3)),o.setAttribute("aK",new f.BufferAttribute(A.subarray(0,D),1)),o}};return s}async function Ae(e,i){const y=e.attributes.position.array,T=y.length,u=15e3;let A=1/0,H=1/0,I=1/0,D=-1/0,n=-1/0,g=-1/0;for(let x=0;x<T;x+=3){i&&x&&x%u===0&&await i();const c=y[x],m=y[x+1],C=y[x+2];c<A&&(A=c),c>D&&(D=c),m<H&&(H=m),m>n&&(n=m),C<I&&(I=C),C>g&&(g=C)}const P=new f.Vector3(A,H,I).add(new f.Vector3(D,n,g)).multiplyScalar(.5);let S=0;for(let x=0;x<T;x+=3){i&&x&&x%u===0&&await i();const c=P.x-y[x],m=P.y-y[x+1],C=P.z-y[x+2],v=c*c+m*m+C*C;v>S&&(S=v)}e.boundingSphere=new f.Sphere(P,Math.sqrt(S))}function a0(e,i,y=0,T=0,u=0){const A=new f.Vector3(...e),H=new f.Vector3(...i),I=new f.Vector3().crossVectors(A,H);return new f.Matrix4().makeBasis(A,H,I).setPosition(y,T,u)}const d0=[[1,0,0],[0,1,0],[0,0,1]],ee=e=>[-e[0],-e[1],-e[2]];function qe(e,i,y,T){const A=y/T,H=y/2;for(let I=0;I<=T;I++){const D=-H+I*A,n=Math.max(-H,D-1.1),g=Math.min(H,D+1.1);i.tone(.02,4),e.st.r*=1.75,e.st.g*=1.58,e.st.b*=1.55,e.quad([n,14.03+.04,-5.4],[g,14.03+.04,-5.4],[g,14.03+.04,5.4],[n,14.03+.04,5.4],[D,0,0],!1)}for(const I of[-1,1]){const D=I*(H-8.2),n=I*(H-.6),g=(D+n)/2;i.tone(.3),e.box(Math.min(D,n),14.03,-5.7,Math.max(D,n),14.03+1.7,5.7,.7,1),i.tone(.3,4),e.st.r*=1.4,e.st.g*=1.32,e.st.b*=1.5,e.lathe(g,0,[[3.3,14.03+1.7],[1.9,14.03+3.4],[0,14.03+7.2]],4,.9,1.05);const P=I*A*2,S=I*3.9;i.tone(.4),e.box(P-.3,14.03,S-.3,P+.3,14.03+5.2,S+.3,.7,3),i.lantern(P,14.03+5.2,S,.62)}for(const I of[-1,1])for(const D of[-1,1])i.tone(.14),e.box(I*3.4-.5,14.03,D*3.3-.5,I*3.4+.5,14.03+6.6,D*3.3+.5,.7,3);i.tone(.3),e.box(-4.5,14.03+6.6,-4.4,4.5,14.03+7.6,4.4,.55),i.tone(.05,4),e.st.r*=1.5,e.st.g*=1.4,e.st.b*=1.62,e.lathe(0,0,[[5,14.03+7.6],[3.2,14.03+9.6],[0,14.03+12.4]],8,.9,1.05),i.lantern(0,14.03+12.3,0,.7)}function Ne(e,i,y){for(const T of[-1,1]){const u=T*7.2;i.tone(.4),e.box(u-1.75,-71,37.55,u+1.75,-68.6,38.6,.7,1);for(const A of[-52.5,-43.5])i.tone(.08),e.box(u-1.55,A,37.7,u+1.55,A+.7,38.4,.7);i.tone(.3),e.box(u-1.8,-34.4,37.5,u+1.8,-32.6,38.6,.7),i.tone(.05),e.box(u-2.1,-32.6,37.3,u+2.1,-31.8,38.6,.7),i.tone(.45),e.box(u-.6,-64.2,35.6,u+.6,-61.7,38,.7)}i.tone(.35),e.box(-9.6,-61.7,34.6,9.6,-61,38,.6),i.tone(.2,1),e.quad([-9.3,-60.97,35.3],[9.3,-60.97,35.3],[9.3,-60.97,38],[-9.3,-60.97,38],[0,-70,36],!1),i.balustrade(-9.3,9.3,-61,34.95,2),i.tone(.05),e.box(-9.7,-71.25,35.7,9.7,-70.75,36.3,.7),i.tone(.03,4),e.st.r*=1.3,e.st.g*=1.25,e.st.b*=1.3,e.quad([-8.9,-73.3,35.97],[8.9,-73.3,35.97],[8.9,-71.45,35.97],[-8.9,-71.45,35.97],[0,-72.3,40],!1);for(let T=-1;T<=1;T++)e.color(y,4,0),e.quad([T*5.8-2.6,-73.05,35.94],[T*5.8+2.6,-73.05,35.94],[T*5.8+2.6,-71.7,35.94],[T*5.8-2.6,-71.7,35.94],[0,-72.3,40],!1,.8,.8,1,1);for(const T of[-1,1])e.at(a0([1,0,0],[0,0,-1],T*9,-72.3,36),()=>i.lantern(0,0,0,.5))}function ie(e,i,y,T){const u=i[0].clone().multiplyScalar(.86),A=i[0].clone().lerp(i[1],.7).multiplyScalar(.82),H=i[2].clone().multiplyScalar(.85),I=new f.Color,D=(t=0,s=0)=>{I.copy(u).lerp(A,w0(t+y.range(-.06,.06),0,1)),e.color(I,s)},n=(t=.5)=>{I.copy(A).lerp(H,t),e.color(I,0)},g=(t=0,s=0)=>{I.copy(u).lerp(A,w0(t,0,1)),e.color(I,s)},P=(t=0)=>{I.copy(i[4]).lerp(i[5],.25+t*.3).multiplyScalar(.5+t*.4),e.color(I,4,0)},S=()=>{I.copy(i[1]).lerp(i[6],T.roofWarm*.6).multiplyScalar(.74),e.color(I,4)},x=()=>{I.copy(i[6]).lerp(i[0],.25),e.color(I,2,0)},c=t=>{I.setRGB(.112+t*.05,.215+t*.062,.158+t*.036),e.color(I,3,.3)},m=(t,s,o,a,h,l,w,q,V)=>{const z=V===void 0?y.range(0,6.283):V,k=o.length-1,M=o[0][1],p=o[k][1],N=(G,_)=>{const L=o[G][0],Y=(o[G][1]-M)/(p-M),U=_%a/a*6.2832+z+Y*1.1,e0=L*(1+h*Math.sin(_%a*2.4+G*1.9+z*3));return[t+Math.cos(U)*e0,o[G][1]+(L>1e-4&&G?h*1.6*L*Math.sin(_%a*1.7+G*2.3+z):0),s+Math.sin(U)*e0]};e.st.axis=[t,s];for(let G=0;G<k;G++){const _=[t,(o[G][1]+o[G+1][1])/2,s],L=f0(w,q,G/k),Y=f0(w,q,(G+1)/k);for(let U=0;U<a;U++)c(w0(l+.25*Math.sin(U*1.3+G*2.1+z*2)+.12*Math.sin(U*3.1+G),0,1.6)),o[G][0]<1e-4?e.tri(N(G,U),N(G+1,U+1),N(G+1,U),_,!1,L,Y,Y):e.quad(N(G,U),N(G,U+1),N(G+1,U+1),N(G+1,U),_,!1,L,L,Y,Y)}return e.st.axis=null,z},C=(t,s,o)=>new f.Matrix4().makeTranslation(t,s,o),v=t=>new f.Matrix4().makeRotationY(t),b={stone:D,dark:n,tone:g,deep:P,roof:S,lamp:x,leaf:c,tuft:m,T:C,RY:v,lanterns:[],lantern(t,s,o,a=.42){n(.8),e.box(t-a*.5,s,o-a*.5,t+a*.5,s+a*.5,o+a*.5),x(),e.lathe(t,o,[[a*.8,s+a*.5],[a*1.3,s+a*1.25],[a*1.2,s+a*2.6]],4,.5,1.05),n(.8),e.lathe(t,o,[[a*1.7,s+a*2.55],[a*.5,s+a*3.4],[0,s+a*4.1]],4),b.lanterns.push([...e.pt([t,s+a*1.5,o]),a])},balustrade(t,s,o,a,h=0,l=0){const w=s-t,q=Math.max(2,Math.round(w/2.4)),V=w/q;D(.15),e.box(t,o,a-.3,s,o+.22,a+.3),e.box(t,o+1.05,a-.34,s,o+1.32,a+.34,.7);for(let z=0;z<=q;z++){const k=t+z*V;if(z%4===0)D(.3),e.box(k-.42,o,a-.42,k+.42,o+1.62,a+.42),h&&z/4%h===0?b.lantern(k,o+1.62,a):e.lathe(k,a,[[.4,o+1.62],[.26,o+1.9],[0,o+2.25]],4);else if(D(.05),!l)e.box(k-.16,o+.22,a-.16,k+.16,o+1.05,a+.16,.9,3);else{const p=a+l*.1,N=Math.max(t,k-V/2),G=Math.min(s,k+V/2);e.st.r*=.8,e.st.g*=.8,e.st.b*=.88,e.quad([N,o+.22,p],[G,o+.22,p],[G,o+1.05,p],[N,o+1.05,p],[k,o+.6,a],!1,.9,.9,1,1)}}if(l){const z=a-l*.1;g(.36),e.st.r*=.8,e.st.g*=.8,e.st.b*=.88,e.quad([t,o+.22,z],[s,o+.22,z],[s,o+1.05,z],[t,o+1.05,z],[(t+s)/2,o+.6,a],!1,.9,.9,1,1)}},cypress(t,s,o,a){n(.55),e.lathe(t,o,[[.75,s],[1,s+.9],[.85,s+1]],6),e.column(t,o,s+.9,s+1.9,.22,5);const h=a*.125,l=s+1.7,w=.3+y()*.5,q=m(t,o,[[h*.28,l],[h*.86,l+a*.08],[h*1.06,l+a*.22],[h*.98,l+a*.42],[h*.62,l+a*.6],[0,l+a*.7]],16,.12,w,.6,1.05);m(t,o,[[h*.3,l+a*.3],[h*.84,l+a*.46],[h*.72,l+a*.64],[h*.45,l+a*.8],[h*.2,l+a*.93],[0,l+a*1.04]],14,.13,w+.25,.8,1.22,q+2.1)},orangeTree(t,s,o,a){n(.5),e.cbox(t-a,s,o-a,t+a,s+a*1.2,o+a,.12*a),e.column(t,o,s+a*1.2,s+a*2.8,a*.16,5),m(t,o,[[0,s+a*2.4],[a*.95,s+a*2.7],[a*1.45,s+a*3.3],[a*1.55,s+a*3.95],[a*1.2,s+a*4.6],[a*.6,s+a*5],[0,s+a*5.15]],12,.1,.7,.66,1.2),x();for(let h=0;h<5;h++){const l=h*1.257+a,w=a*1.38,q=s+a*(3.2+h%3*.55);e.box(t+Math.cos(l)*w-.2,q,o+Math.sin(l)*w-.2,t+Math.cos(l)*w+.2,q+.4,o+Math.sin(l)*w+.2,1)}},flight(t,s,o,a,h=1.5){const l=a/2,w=t*s,q=t*o,V=[0,q/2-h-2,w/2+2];for(let z=0;z<t;z++){const k=z*s,M=k+s,p=z*o,N=p+o;D(.1+.25*(z%2)),e.st.kind=4,e.quad([-l,p,k],[l,p,k],[l,N,k],[-l,N,k],[0,p,k+1],!1,.56,.56,.74,.74),e.quad([-l,N,k],[l,N,k],[l,N,M],[-l,N,M],[0,N-1,k],!1,1.03,1.03,.8,.8),e.st.kind=0;for(const G of[-l,l])e.quad([G,p-h,k],[G,N-h,M],[G,N,M],[G,N,k],[0,p-h,k+s],!1,.8,.8,1,1)}D(.5,1);{const z=e.st.r,k=e.st.g,M=e.st.b;e.st.r*=1.45,e.st.g*=1.3,e.st.b*=1.2,e.quad([-l,-h,0],[l,-h,0],[l,q-h,w],[-l,q-h,w],[0,q,0],!1,.78),e.st.r=z,e.st.g=k,e.st.b=M,e.st.kind=0}e.quad([-l,-h,0],[l,-h,0],[l,0,0],[-l,0,0],[0,0,1],!1,.7);for(const z of[-1,1]){const k=z*l,M=z*(l+.55),p=[(k+M)/2,q/2+.5,w/2],N=(_,L,Y)=>[_,(Y?q:0)+o+(L?1.25:-h*.4),Y?w:0];D(.2),e.quad(N(k,0,0),N(k,0,1),N(k,1,1),N(k,1,0),p,!1,.85,.85,1,1),e.quad(N(M,0,0),N(M,0,1),N(M,1,1),N(M,1,0),p,!1,.85,.85,1,1),e.quad(N(k,1,0),N(k,1,1),N(M,1,1),N(M,1,0),p,!1),e.quad(N(k,0,0),N(k,0,1),N(M,0,1),N(M,0,0),p,!1,.6),e.quad(N(k,0,0),N(k,1,0),N(M,1,0),N(M,0,0),p,!1),e.quad(N(k,0,1),N(k,1,1),N(M,1,1),N(M,0,1),p,!1);const G=Math.max(2,Math.round(w/10));for(let _=0;_<=G;_++){const L=_/G,Y=L*w,U=L*q+o+1.25,e0=(k+M)/2;D(.35),e.box(e0-.5,U-2.2,Y-.5,e0+.5,U+.5,Y+.5),_%2===0?b.lantern(e0,U+.5,Y,.36):e.lathe(e0,Y,[[.45,U+.5],[0,U+1.3]],4)}}},gallery(t,s,o){b.galleryA(t,s),b.galleryB(t,s,o)},galleryA(t,s,o=!1){const a=t/s,h=12.5,l=T.archRise;if(D(.45),e.cbox(-t/2,-1.5,-6.4,t/2,0,6.4,.35,.62),o){for(const w of[-5.2,5.2])g(.5),e.box(-t/2,-2.1,w-.4,t/2,-1.5,w+.4,.6);g(.2,1),e.st.r*=1.7,e.st.g*=1.45,e.st.b*=1.3,e.quad([-t/2+.4,-1.53,-4.8],[t/2-.4,-1.53,-4.8],[t/2-.4,-1.53,4.8],[-t/2+.4,-1.53,4.8],[0,0,0],!1,.9);for(let w=0;w<s;w++)e.at(a0([1,0,0],[0,-1,0],-t/2+(w+.5)*a,-1.53,0),()=>b.lantern(0,0,0,.45))}D(.2,1),e.quad([-t/2,.03,-3.4],[t/2,.03,-3.4],[t/2,.03,3.4],[-t/2,.03,3.4],[0,-5,0],!1,.8);for(let w=0;w<s;w++){const q=-t/2+(w+.5)*a;for(const V of[-4.7,4.7])D(.05+.1*(w%2)),e.at(C(q,0,V),()=>e.archWall(a,h,2.3,a*.66,5.4,l,8))}},galleryB(t,s,o,a=!1){const h=t/s,l=12.5;D(.3),a?e.box(-t/2,l,-6.9,t/2,l+.6,6.9,.6):e.cbox(-t/2,l,-6.9,t/2,l+.6,6.9,.2,.6),D(.12),a?e.box(-t/2,l+.6,-6.5,t/2,l+1.5,6.5,.7):e.cbox(-t/2,l+.6,-6.5,t/2,l+1.5,6.5,.25,.7),D(.2,1),e.quad([-t/2,l+1.53,-5.4],[t/2,l+1.53,-5.4],[t/2,l+1.53,5.4],[-t/2,l+1.53,5.4],[0,0,0],!1),b.balustrade(-t/2+9,t/2-9,l+1.5,-6,2,a?-1:0),b.balustrade(-t/2+9,t/2-9,l+1.5,6,2,a?1:0);for(let w=0;w<o;w++){const q=-t/2+y.int(1,s-1)*h+y.range(-1,1),V=y.pick([-3.2,0,3.2]);y.chance(.6)?b.cypress(q,l+1.5,V,y.range(9,15)):b.orangeTree(q,l+1.5,V,y.range(.9,1.3))}},pavilion(){b.pavilionA(),b.pavilionB()},pavilionA(){const t=T.archRise;for(let s=0;s<4;s++)e.at(v(s*Math.PI/2).multiply(C(0,-11,10)),()=>{D(.1),e.archWall(22.4,21,2.4,9.5,9,t,8)});for(const s of[-1,1])for(const o of[-1,1])D(.3),e.cbox(s*9.4,-11,o*9.4,s*12,10,o*12,.3,.75);D(.4),e.cbox(-12.8,-12.6,-12.8,12.8,-11,12.8,.4,.6),e.cbox(-13.2,10,-13.2,13.2,11.6,13.2,.4,.6),D(.2,1),e.quad([-9,-10.97,-9],[9,-10.97,-9],[9,-10.97,9],[-9,-10.97,9],[0,-20,0],!1,.75)},pavilionB(){D(.25),e.lathe(0,0,[[9.4,11.6],[9.4,12.4],[8.6,12.4],[8.6,14.6],[9,14.6],[9,15.2]],12,.85,1),S();const t=[];for(let o=0;o<=6;o++){const a=o/6*Math.PI/2;t.push([8.5*Math.cos(a),15.2+8.5*T.domeH*Math.sin(a)])}t[6][0]=.7,e.lathe(0,0,t,12,.8,1.08);const s=15.2+8.5*T.domeH;D(.3),e.lathe(0,0,[[.9,s-.1],[.5,s+1.2],[.95,s+1.7],[.3,s+2.6]],6),b.lantern(0,s+2.6,0,.7);for(const o of[-1,1])for(const a of[-1,1])D(.25),e.lathe(o*11,a*11,[[1.1,11.6],[1.1,12.6],[.8,12.6],[.5,16.5],[0,18]],4);D(.5),e.cbox(-9.5,-15,-9.5,9.5,-12.6,9.5,.4,.6),D(.6),e.cbox(-6,-17.2,-6,6,-15,6,.4,.6),n(.3),e.lathe(0,0,[[0,-22.5],[1.2,-20.5],[.6,-19.4],[3.2,-17.2]],8,.6,.8)}};return b}function Ve(e,i,y,T){const{stone:u,dark:A,tone:H,T:I}=i,D=n=>{const g=w0((-14-n)/62,-1,1);return 36+23.6*Math.sqrt(1-g*g)};return{aqueduct(){const n=A0,g=T.archRise;for(const c of[-89,-77])u(.12),e.at(I(0,30,c),()=>e.archWall(19,45,2.4,9,27.5,g,8));for(const c of[-1,1])u(.25),e.cbox(c*7.4,30,-88,c*9.5,75,-78,.3,.7),u(.35),e.cbox(c*8.2-1.6,26.5,-90.4,c*8.2+1.6,30,-75.6,.3,.6);u(.4),e.cbox(-10.4,75,-91,10.4,76.8,-75,.35,.6),i.roof(),e.lathe(0,-83,[[9.6,76.8],[7.2,79.4],[3.2,81.2],[.6,81.8]],4,.85,1.05);for(const c of[-1,1])for(const m of[-90,-76])u(.25),e.lathe(c*9.2,m,[[.9,76.8],[.55,79.6],[0,81]],4);u(.3),e.box(-5.3,n-1.9,-100,5.3,n-.7,-5,.6),u(.1),e.box(-5.9,n-2.5,-100,5.9,n-1.9,-4.6,.6);for(const c of[-1,1]){const m=Math.min(c*4.1,c*5.3),C=Math.max(c*4.1,c*5.3);u(.15),e.box(m,n-.7,-100,C,n+1.1,-5,.8,1),u(.3),e.cbox(m-.25,n+1.1,-100,C+.25,n+1.6,-5,.14,.75);for(let v=0;v<12;v++){const d=-72+v*5.4;v%3===1?i.lantern(c*4.7,n+1.6,d,.34):(u(.3),e.box(c*4.7-.38,n+1.6,d-.38,c*4.7+.38,n+2,d+.38,.9,1))}}for(let c=0;c<14;c++){const m=-74+c*5;u(.5),H(.25),e.box(-5.9,n-3.4,m,5.9,n-2.5,m+1.1,.55)}for(let c=0;c<13;c++){const m=-74+c*5+1.6,C=m+2.9,v=(m+C)/2;A(.85),e.st.kind=4,e.quad([-4.7,n-2.53,m],[4.7,n-2.53,m],[4.7,n-2.53,C],[-4.7,n-2.53,C],[0,n,v],!1,.62,.62,.8,.8),H(.2,4),e.lathe(0,v,[[0,n-3.5],[.55,n-3.05],[1.05,n-2.55]],6,.7,1)}const P=18,S=2.4;for(const c of[-1,1]){const m=c*2.9,C=c*4.7,v=[(m+C)/2,0,0];for(let d=0;d<P;d++){const b=d/P*Math.PI/2,t=(d+1)/P*Math.PI/2,s=(M,p)=>[-14-(62-p)*Math.cos(M),36+(23.6-p)*Math.sin(M)-p*0],[o,a]=s(b,0),[h,l]=s(t,0),[w,q]=s(t,S),[V,z]=s(b,S),k=[v[0],(a+q)/2,(o+w)/2];u(.15+.12*(d%2)),e.quad([m,a,o],[C,a,o],[C,l,h],[m,l,h],k,!1),e.quad([m,z,V],[C,z,V],[C,q,w],[m,q,w],k,!1,.6),e.quad([m,a,o],[m,l,h],[m,q,w],[m,z,V],k,!1,1,1,.8,.8),e.quad([C,a,o],[C,l,h],[C,q,w],[C,z,V],k,!1,1,1,.8,.8)}for(const d of[-68,-59,-50,-41,-32])u(.2),e.column(c*3.8,d,D(d)-.3,n-3.4,.62,6)}for(const c of[-68,-50,-32])u(.4),e.box(-3,D(c)+(n-3.4-D(c))*.5,c-.35,3,D(c)+(n-3.4-D(c))*.5+.7,c+.35,.6);u(.45),e.cbox(-6.2,31,-78.5,6.2,37.5,-73.5,.4,.6);const x=a0([0,0,1],[0,1,0]);for(const c of[-1,1]){const m=c*5.3,C=-7.55,v=c*6.1;u(.2),e.cbox(m-.8,n-4.2,-10.5,m+.8,n+1.6,-4.6,.18,.7),u(.35),e.cbox(m-1.05,n+1.6,-10.8,m+1.05,n+2.05,-4.3,.14,.6),H(.42),e.cbox(m-1,n-4.7,-10.75,m+1,n-4.2,-4.35,.14,.6);for(const d of[-9.95,-5.15])H(.3),e.cbox(Math.min(v-c*.1,v+c*.24),n-4.2,d-.4,Math.max(v-c*.1,v+c*.24),n+1.6,d+.4,.08,.8);H(.08),e.at(x.clone().setPosition(v+c*.1,n-4.2,C),()=>e.archWall(3.5,5.3,.3,1.9,3,g,6,.7,!0)),A(.8),e.st.kind=4,e.quad([v+c*.02,n-4.2,C-.95],[v+c*.02,n-4.2,C+.95],[v+c*.02,n-.1,C+.95],[v+c*.02,n-.1,C-.95],[m,n-2,C],!1,.5,.5,.75,.75),H(.14),e.at(x.clone().setPosition(m,n+2.05,C),()=>e.archWall(5.5,4.6,1.5,2.2,1.9,g,8)),H(.4),e.cbox(m-1,n+6.65,-10.5,m+1,n+7.1,-4.6,.14,.6),H(.3),e.cbox(m-.8,n+7.1,-10.25,m+.8,n+7.5,-4.85,.12,.7),H(.34),e.lathe(m,C,[[.72,n+7.5],[.46,n+8.3],[.74,n+8.75],[.34,n+9.5],[0,n+10.2]],8,.85,1.05),i.lantern(m,n+2.05,C,.46)}u(.4),e.cbox(-4.1,n-1.5,-5.2,4.1,n-.75,-3.4,.2,.6),H(.3),e.at(a0([0,1,0],[1,0,0],0,n-1.55,-3.75),()=>e.lathe(0,0,[[0,-4.45],[.7,-4.45],[.92,-4.1],[.92,4.1],[.7,4.45],[0,4.45]],10)),H(.3),e.lathe(0,-7.5,[[0,n-5.3],[.5,n-4.9],[.35,n-4.6],[1.3,n-4.2],[1.1,n-3.95],[2.4,n-3.6],[3.6,n-3.4]],16,.7,.95);for(const c of[-60,-40,-20])e.at(a0([1,0,0],[0,-1,0],0,n-3.4,c),()=>i.lantern(0,0,0,.3))},cascade(n,g,P){u(.3),e.cbox(-10.6,-4.5,-1.5,10.6,-.5,12,.4,.55);for(const v of[-1,1])u(.15),e.box(Math.min(v*4.5,v*10.6),-.5,-1.5,Math.max(v*4.5,v*10.6),0,12,1,1),e.at(i.RY(Math.PI/2).multiply(I(0,0,0)),()=>i.balustrade(-12+.6,1.2,0,v*10.1,1));e.at(I(0,0,-1.1),()=>{i.balustrade(4.8,10.4,0,0,0),i.balustrade(-10.4,-4.8,0,0,0)}),H(.42),e.cbox(-9.8,-5.3,-.9,9.8,-4.5,11.4,.25,.6);for(const v of[-5.3,5.3])H(.55),e.cbox(v-.45,-6.1,-.9,v+.45,-5.3,11.4,.12,.6);for(const v of[-.45,10.95])H(.5),e.cbox(-9.8,-5.9,v-.45,9.8,-5.3,v+.45,.12,.6);for(const v of[-7.55,7.55])for(const d of[2.4,8.1])A(.45),e.st.kind=4,e.quad([v-1.5,-5.33,d-1.9],[v+1.5,-5.33,d-1.9],[v+1.5,-5.33,d+1.9],[v-1.5,-5.33,d+1.9],[v,0,d],!1,.7,.7,.88,.88),H(.2,4),e.lathe(v,d,[[0,-5.7],[.7,-5.6],[1.15,-5.33]],12,.85,1);H(.5),e.lathe(0,5.25,[[4.55,-5.3],[4.55,-5.85],[4.1,-5.85]],16,.8,1),H(.3),e.lathe(0,5.25,[[4.1,-5.85],[3.7,-6.9],[2.5,-7.9],[1.25,-8.5]],16,.7,1),H(.3),e.lathe(0,5.25,[[1.25,-8.5],[1,-8.9],[.45,-9.15],[0,-9.2]],16,.7,.95);for(let v=0;v<n;v++){const d=12+v*g,b=d+g,t=-v*P,s=t-P-4.2;u(.35+.1*(v%2)),e.box(-4.5,s,d,4.5,t-P-.5,b,.55);for(const o of[-1,1]){const a=o*4.5,h=o*(4.5+.9),l=o*9.6,w=o*10.6;u(.25),e.box(Math.min(a,h),s,d,Math.max(a,h),t-P+.75,b,.6),u(.3),e.box(Math.min(l,w),s,d,Math.max(l,w),t-P+1.9,b,.6),u(.4),e.box(Math.min(l,w)-.15,t-P+1.9,d-.15,Math.max(l,w)+.15,t-P+2.3,d+1.3,.8,1),v%2===0&&i.lantern((l+w)/2,t-P+2.3,d+.6,.4),v%3===1&&i.cypress((a+h)/2+o*.2,t-P+.75,b-1.2,7.5);const q=6;for(let V=0;V<q;V++)u(.05+.3*(V%2)),e.box(Math.min(h,l),V===0?s:t-P-.2,d+V*g/q,Math.max(h,l),t-(V+1)*P/q,d+(V+1)*g/q,.7,V===0?0:1)}}{const v=12+n*g,d=b=>-((b-12)/g+1)*P-4.25;H(.2,1),e.st.r*=1.7,e.st.g*=1.45,e.st.b*=1.3,e.quad([-10.55,d(12),12],[10.55,d(12),12],[10.55,d(v),v],[-10.55,d(v),v],[0,0,(12+v)/2],!1,.9);for(const b of[-10.1,10.1]){H(.5),e.quad([b-.5,d(12)-.5,12],[b+.5,d(12)-.5,12],[b+.5,d(v)-.5,v],[b-.5,d(v)-.5,v],[b,0,(12+v)/2],!1,.75);for(const t of[-.5,.5])e.quad([b+t,d(12),12],[b+t,d(v),v],[b+t,d(v)-.5,v],[b+t,d(12)-.5,12],[b,d(12)-.2,12],!1,.85)}for(let b=1;b<n;b+=3)for(const t of[-5.6,5.6]){const s=12+(b+.5)*g;e.at(a0([1,0,0],[0,-1,0],t,d(s),s),()=>i.lantern(0,0,0,.42))}}const c=12+n*g,m=-n*P;u(.3),e.cbox(-10.6,m-4.5,c,10.6,m-.5,c+12,.4,.55);for(const v of[-1,1]){const d=v*7.1,b=c+8.4,t=c+12.3,s=(b+t)/2;H(.25),e.cbox(d-1.5,m-4.5,b,d+1.5,m+7.2,t,.22,.7),H(.42),e.cbox(d-1.85,m+7.2,b-.35,d+1.85,m+7.9,t+.35,.16,.6),e.cbox(d-1.8,m-.5,b-.3,d+1.8,m+.6,t+.3,.16,.8),H(.3),e.cbox(d-1.4,m+7.9,b+.1,d+1.4,m+8.5,t-.1,.12,.7),i.roof(),e.lathe(d,s,[[1.55,m+8.5],[1.05,m+9.9],[.2,m+11.2]],4,.85,1.05),i.lantern(d,m+11.2,s,.5),H(.45),e.box(d-v*1.5-.35,m+3.2,s-.35,d-v*1.5+.35,m+3.7,s+.35,.7),i.lantern(d-v*1.5,m+3.7,s,.36)}H(.3),e.at(a0([0,1,0],[1,0,0],0,m-.8,c+12.2),()=>e.lathe(0,0,[[0,-5.5],[.7,-5.5],[.95,-5.1],[.95,5.1],[.7,5.5],[0,5.5]],10));for(const v of[-1,1])u(.15),e.box(Math.min(v*4.5,v*10.6),m-.5,c,Math.max(v*4.5,v*10.6),m,c+12,1,1);const C=v=>-Math.min(n,Math.floor((v-12)/g+1e-6)+1)*P-4.2;for(const v of[-1,1])for(const d of[46,62,78]){const b=C(d+7.9)+71;u(.2),e.at(a0([0,0,1],[0,1,0],v*7.2,-71,d),()=>e.archWall(16,b,2.6,10.5,b-12,T.archRise,8));for(let t=0;t<n;t++){const s=Math.max(12+t*g,d-8),o=Math.min(12+(t+1)*g,d+8);if(o-s<.2)continue;const a=C(s+.1);a>b-71+.05&&(u(.3),e.box(v*7.2-1.3,b-71,s,v*7.2+1.3,a,o,.7))}}u(.45),e.cbox(-9.4,-73.6,36,9.4,-71,88,.4,.6);for(const v of[38,54,70,86])u(.35),e.box(-7.2,-62,v-.7,7.2,-60.8,v+.7,.6)},belvedere(n){u(.3),e.lathe(0,0,[[6.5,-3.2],[9.6,-1.5],[10.2,-1.5],[10.2,0]],8,.6,1),u(.2,1),e.lathe(0,0,[[10.2,0],[0,.02]],8);for(let P=0;P<8;P++){const S=(P+.5)*Math.PI/4;e.at(i.RY(-S+Math.PI/2).multiply(I(0,0,9)),()=>i.balustrade(-3.5,3.5,0,0,P%2?1:0))}const g=n/2;for(let P=0;P<2;P++)for(let S=0;S<2;S++)e.at(i.RY(S*Math.PI/2).multiply(I(0,-3.2-n+P*g,0)),()=>{u(.15+.1*P),e.archWall(13,g,2.6,7.6,g-9.5,T.archRise,8)});u(.4),e.cbox(-7.2,-3.2-g-.6,-7.2,7.2,-3.2-g+.6,7.2,.3,.6),e.cbox(-7.6,-3.2-n-1.2,-7.6,7.6,-3.2-n,7.6,.3,.6)},cornerRib(n,g){const P=g-n,S=18,x=1.7,c=2.8,m=(d,b,t,s,o,a,h,l)=>{for(let w=0;w<h;w++){const q=o+(a-o)*(w/h),V=o+(a-o)*((w+1)/h),z=(M,p,N)=>[d+Math.cos(M)*p,b+Math.sin(M)*p,N],k=z((q+V)/2,(t+s)/2,0);u(l+.14*(w%2)),e.quad(z(q,s,-x),z(V,s,-x),z(V,s,x),z(q,s,x),k,!1),e.quad(z(q,t,-x),z(V,t,-x),z(V,t,x),z(q,t,x),k,!1,.66),e.quad(z(q,t,x),z(V,t,x),z(V,s,x),z(q,s,x),k,!1,.82,.82,1,1),e.quad(z(q,t,-x),z(V,t,-x),z(V,s,-x),z(q,s,-x),k,!1,.82,.82,1,1)}};m(P,P,n-c,n,0,Math.PI/2,S,.15);const C=n*.1716,v=g-C;m(v,v,C-1.7,C-.1,0,Math.PI*2,20,.3);for(const d of[.25,.5,.75]){const b=d*Math.PI/2,t=P+Math.cos(b)*(n+.2),s=P+Math.sin(b)*(n+.2);u(.4),e.box(t-.9,s-.9,-x-.4,t+.9,s+.9,x+.4,.8)}u(.35),e.cbox(g-3.2,P-2.2,-x-.5,g+.4,P+2.2,x+.5,.3,.7),e.cbox(P-2.2,g-3.2,-x-.5,P+2.2,g+.4,x+.5,.3,.7)},stairBridge(n,g,P,S){const x=n*g,c=n*P;i.flight(n,g,P,S,1.8),u(.35),e.cbox(-S/2-1.2,-4.2,-9.5,S/2+1.2,0,.2,.35,.6),u(.2,1),e.quad([-S/2,.03,-9],[S/2,.03,-9],[S/2,.03,0],[-S/2,.03,0],[0,-3,0],!1),u(.35),e.cbox(-S/2-1.2,c-3.4,x-.2,S/2+1.2,c,x+9.5,.35,.6),u(.2,1),e.quad([-S/2,c+.03,x],[S/2,c+.03,x],[S/2,c+.03,x+9],[-S/2,c+.03,x+9],[0,0,0],!1);const m=x*.5,C=c*.5-1.8;A(.3),e.lathe(0,m,[[0,C-6.5],[1.1,C-4.2],[.55,C-3.2],[2.6,C-1.2],[2.6,C+.6]],6,.6,.85)}}}function Ce(e,i,y,T,u,A=0,H=40){const I=(T+u)/2,D=n=>{const g=Math.cos(n),P=Math.sin(n),S=i/Math.max(Math.abs(g),Math.abs(P));return[g*S,P*S]};for(let n=0;n<H;n++){const g=n/H*Math.PI*2,P=(n+1)/H*Math.PI*2,S=[y*Math.cos(g),y*Math.sin(g)],x=[y*Math.cos(P),y*Math.sin(P)],c=D(g),m=D(P),C=(S[0]+m[0])/2,v=(S[1]+m[1])/2;for(const d of[T,u])e.quad([S[0],S[1],d],[x[0],x[1],d],[m[0],m[1],d],[c[0],c[1],d],[C,v,I],!1,.8,.8,1,1);if(e.quad([S[0],S[1],T],[x[0],x[1],T],[x[0],x[1],u],[S[0],S[1],u],[0,0,I],!0,.62),A){const d=[(y+A)*Math.cos(g),(y+A)*Math.sin(g)],b=[(y+A)*Math.cos(P),(y+A)*Math.sin(P)],t=u+.45;e.quad([S[0],S[1],t],[x[0],x[1],t],[b[0],b[1],t],[d[0],d[1],t],[C,v,I],!1,n%2?.85:1),e.quad([d[0],d[1],u],[b[0],b[1],u],[b[0],b[1],t],[d[0],d[1],t],[0,0,t],!1,.8),e.quad([S[0],S[1],u],[x[0],x[1],u],[x[0],x[1],t],[S[0],S[1],t],[0,0,t],!0,.62)}}for(const n of[-1,1])e.quad([n*i,-i,T],[n*i,i,T],[n*i,i,u],[n*i,-i,u],[0,0,I],!1),e.quad([-i,n*i,T],[i,n*i,T],[i,n*i,u],[-i,n*i,u],[0,0,I],!1,n<0?.7:1)}function _e(e,i,y,T,u,A,H){const D=-u-4.25-.06,n=y*2,g=T/2,P=u/2,S=8.6,x=S/2;e.push(a0([-1,0,0],[0,-1,0],0,D,12)),i.flight(n,g,P,S,.3);for(let c=0;c<n;c++){const m=c*g,C=m+g,v=c*P,d=v+P,b=.05;for(const[t,s,o]of[[-1.7,-1.36,H],[-1.36,1.36,A],[1.36,1.7,H]])e.color(o,4,1),e.quad([t,v,m-b],[s,v,m-b],[s,d+b,m-b],[t,d+b,m-b],[0,v,m+1],!1,.95,.95,1.15,1.15),e.quad([t,d+b,m-b],[s,d+b,m-b],[s,d+b,C-b],[t,d+b,C-b],[0,d-1,m],!1,1,1,.84,.84)}for(let c=3;c<n-2;c+=8)for(const m of[-1,1]){const C=(c+.5)*g,v=(c+1)*P,d=m*(x+3.3);i.tone(.4),e.cbox(d-1.3,v-P*1.4,C-1.3,d+1.3,v,C+1.3,.15,.7),i.orangeTree(d,v,C,.72)}e.pop(),e.push(a0([-1,0,0],[0,-1,0],0,-5.3,0)),i.balustrade(-9.4,9.4,.6,-.45,2);for(const c of[-1,1])e.at(i.RY(Math.PI/2),()=>i.balustrade(-11.1,.4,0,c*9.4,2));for(const c of[-1,1])i.orangeTree(c*7.55,0,5.25,.8);return e.pop(),{hw:x,nS:n,ru:g,ri:P,y0:D,top:12}}function Fe(e,i){e.at(a0([1,0,0],[0,0,-1],0,0,0),()=>{i.tone(.2,1),Ce(e,12.5,7,0,1.6,.9,32)}),i.tone(.55),e.at(a0([1,0,0],[0,0,-1],0,0,0),()=>{for(let u=0;u<32;u++){const A=u/32*6.2832,H=(u+1)/32*6.2832;e.quad([7*.99*Math.cos(A),7*.99*Math.sin(A),.02],[7*.99*Math.cos(H),7*.99*Math.sin(H),.02],[7*.99*Math.cos(H),7*.99*Math.sin(H),1.25],[7*.99*Math.cos(A),7*.99*Math.sin(A),1.25],[0,0,.6],!0,.6,.6,.9,.9)}});for(const u of[-1,1])i.balustrade(-12.5+.4,12.5-.4,1.6,u*(12.5-.5),1);for(const u of[-1,1])e.at(i.RY(Math.PI/2),()=>i.balustrade(-12.5+1.2,12.5-1.2,1.6,u*(12.5-.5),0));for(const u of[-1,1])for(const A of[-1,1])i.tone(.45),e.cbox(u*(12.5-.2)-.9,-1.2,A*(12.5-.2)-.9,u*(12.5-.2)+.9,0,A*(12.5-.2)+.9,.2,.7),i.dark(.3),e.lathe(u*(12.5-.2),A*(12.5-.2),[[0,-5.6],[.55,-4.4],[.3,-3.6],[.95,-2.2],[.95,-1.2]],8,.6,.85);return e.at(a0([1,0,0],[0,-1,0],0,0,0),()=>{i.orangeTree(-9.6,0,9.6,.95),i.orangeTree(9.6,0,-9.6,.95);for(const[u,A]of[[9.4,9.4],[-9.4,-9.4]])i.tone(.4),e.cbox(u-.45,0,A-.45,u+.45,1.3,A+.45,.1,.8),i.lantern(u,1.3,A,.45)}),{H:12.5,R:7}}const te=`
float sh21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float svn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(sh21(i), sh21(i + vec2(1.0, 0.0)), f.x), mix(sh21(i + vec2(0.0, 1.0)), sh21(i + vec2(1.0, 1.0)), f.x), f.y); }
float sfb(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * svn(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
float sh31(vec3 p){ p = fract(p * vec3(0.1031, 0.1130, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float svn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(sh31(i), sh31(i + vec3(1,0,0)), f.x), mix(sh31(i + vec3(0,1,0)), sh31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(sh31(i + vec3(0,0,1)), sh31(i + vec3(1,0,1)), f.x), mix(sh31(i + vec3(0,1,1)), sh31(i + vec3(1,1,1)), f.x), f.y), f.z); }
float sfb3(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++) { s += a * svn3(p); p = p * 2.02 + 11.3; a *= 0.5; } return s; }
`,we=`
float fogFade(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      return 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 1.0;
  #endif
}`;function be(e,i,y,T={}){const u=new f.MeshStandardMaterial({vertexColors:!0,roughness:.88,metalness:0});return T.rest&&(u.defines.USE_REST=""),T.lamps&&(u.defines.USE_GLAMPS=""),T.point&&(u.defines.USE_PLAMP=""),u.onBeforeCompile=A=>{T.lamps&&(A.uniforms.uGL=T.lamps.pts,A.uniforms.uGLC=T.lamps.col,A.uniforms.uGLP=T.lamps.par),T.point&&(A.uniforms.uPL=T.point.pos,A.uniforms.uPLC=T.point.col,A.uniforms.uPLR=T.point.par),A.uniforms.uTime=e.time,A.uniforms.uPlum={value:i},A.uniforms.sunD=e.sunD,A.uniforms.sunC=e.sunC,A.uniforms.uSelf=e.self,A.uniforms.uHazeS={value:y},A.uniforms.uShade=e.shade,A.uniforms.uLampE=e.lampE,A.uniforms.uBounce=e.bounce,A.uniforms.uLeafT=e.leafT,A.vertexShader=A.vertexShader.replace("#include <common>",`#include <common>
attribute float aK; uniform float uTime; varying float vK; varying vec3 vOP; varying vec3 vON; varying vec3 vWNs;
#ifdef USE_REST
attribute vec3 aRP; attribute vec3 aRN;
#endif
#ifdef USE_PLAMP
varying vec3 vWPs;
#endif`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vK = aK; vOP = position; vON = normal;
        #ifdef USE_REST
          vOP = aRP; vON = aRN;
        #endif
        { vec3 wn = normal;
          #ifdef USE_INSTANCING
            wn = mat3(instanceMatrix) * wn;
          #endif
          vWNs = normalize(mat3(modelMatrix) * wn); }
        #ifdef USE_PLAMP
          vWPs = (modelMatrix * vec4(transformed, 1.0)).xyz;
        #endif
        if (aK > 2.5 && aK < 3.5) transformed += 0.17 * vec3(sin(uTime * 1.3 + position.y * 0.35 + position.x), sin(uTime * 1.1 + position.z * 0.4), sin(uTime * 1.7 + position.x * 0.3 + position.y * 0.5));`),A.fragmentShader=A.fragmentShader.replace("#include <common>",`#include <common>
varying float vK; varying vec3 vOP; varying vec3 vON; varying vec3 vWNs; uniform float uTime, uSelf, uLampE, uLeafT; uniform vec2 uShade; uniform vec3 uBounce; uniform vec3 uPlum; uniform vec3 uHazeS; uniform vec3 sunD[3]; uniform vec3 sunC[3];
#ifdef USE_GLAMPS
uniform vec4 uGL[4]; uniform vec3 uGLC; uniform vec4 uGLP;
#endif
#ifdef USE_PLAMP
uniform vec3 uPL; uniform vec3 uPLC; uniform vec2 uPLR; varying vec3 vWPs;
#endif
`+te).replace("#include <color_fragment>",`#include <color_fragment>
        {
          vec3 an = abs(vON); vec2 suv;
          if (an.y > an.x && an.y > an.z) suv = vOP.xz; else if (an.x > an.z) suv = vOP.zy; else suv = vOP.xy;
          if (vK > 2.5 && vK < 3.5) suv = vec2(vOP.x + vOP.z * 0.7, vOP.y + vOP.z * 0.4);      // foliage has rounded normals: one continuous mapping
          float fw = length(fwidth(suv));
          float n1 = sfb(suv * 0.31 + 3.0), n2 = svn(suv * 3.1);
          if (vK < 0.5) {
            // ashlar: 1.2 x 0.58 m blocks, fine joints, a lit arris under each bed joint, slow stains down the courses
            float row = floor(suv.y / 0.58);
            vec2 bb = vec2(suv.x / 1.2 + mod(row, 2.0) * 0.5 + sh21(vec2(row, 3.0)) * 0.25, suv.y / 0.58);
            vec2 fb = fract(bb), f = 0.5 - abs(fb - 0.5);
            float lodJ = clamp(1.2 - fw * 5.0, 0.0, 1.0);
            float j = (1.0 - smoothstep(0.02, 0.06, min(f.x * 1.2, f.y * 0.58))) * lodJ;
            float tone = sh21(floor(bb)) * clamp(1.4 - fw * 0.9, 0.0, 1.0);
            float bev = (smoothstep(0.76, 0.88, fb.y) - smoothstep(0.26, 0.12, fb.y)) * (1.0 - j) * lodJ;
            diffuseColor.rgb *= (0.94 + 0.11 * tone) * (1.0 + 0.07 * bev) * mix(vec3(1.0), uPlum * 1.6 + 0.35, j * 0.42);
            diffuseColor.rgb *= 0.97 + 0.06 * n2;
            vec2 sq = vec2(suv.x * 0.15, suv.y * 0.04) + 9.0;
            diffuseColor.rgb *= 0.9 + 0.2 * (0.65 * svn(sq) + 0.35 * svn(sq * 2.7 + 5.0));
          } else if (vK < 1.5) {
            vec2 c = floor(suv / 2.0); float ck = mod(c.x + c.y, 2.0);
            ck = mix(0.5, ck, clamp(1.7 - fw * 0.55, 0.0, 1.0));
            // a thin inlaid line round every tile, so a floor near the camera is paving and not flat paint
            vec2 tf = 0.5 - abs(fract(suv / 2.0) - 0.5);
            float tj = (1.0 - smoothstep(0.012, 0.03, min(tf.x, tf.y))) * clamp(1.2 - fw * 5.0, 0.0, 1.0);
            diffuseColor.rgb *= mix(uPlum * 1.5 + 0.62, vec3(1.04), ck) * (1.0 - 0.16 * tj) * (0.96 + 0.08 * n2);
          } else if (vK > 2.5 && vK < 3.5) {
            // leaves: soft masses, a fine dapple of leaf-sized dabs near the camera, warmer tips where a dab catches the light
            float lf = svn(suv * vec2(6.0, 3.2) + 11.0), lf2 = svn(suv * vec2(13.0, 7.0) + 5.0), lodL = clamp(1.4 - fw * 2.5, 0.0, 1.0);
            diffuseColor.rgb *= (0.74 + 0.6 * svn(suv * 1.9 + 2.0)) * mix(1.0, 0.7 + 0.42 * lf + 0.3 * lf2, lodL);
            diffuseColor.rgb *= mix(vec3(1.0), vec3(1.2, 1.1, 0.84), smoothstep(0.6, 0.9, lf2) * 0.5 * lodL);
          }
          diffuseColor.rgb *= 0.84 + 0.3 * n1;
        }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        #ifdef USE_GLAMPS
          vec3 gAlb = diffuseColor.rgb;
          { float gIn = smoothstep(0.0, 9.0, vOP.z) * (1.0 - smoothstep(uGLP.w - 9.0, uGLP.w, vOP.z)) * step(abs(vOP.x), 9.3) * step(abs(vOP.y), 9.3);
            diffuseColor.rgb *= mix(1.0, uGLP.z, gIn); }
        #endif
        { // the haze lights a face that looks toward the three suns; a face that looks away from all of them sinks toward plum
          float toSuns = 0.5 + 0.5 * dot(vWNs, normalize(sunD[0] + sunD[1] + sunD[2] + vec3(1e-4)));
          vec3 sl = mix(uPlum * uShade.x + uHazeS * uShade.y, uHazeS * 0.7 + uPlum * 0.2 + vec3(0.06, 0.04, 0.02), smoothstep(0.15, 0.85, toSuns));
          sl += uBounce * max(-vWNs.y, 0.0);                       // warm light thrown back up by the sunlit floors below
          for (int i = 0; i < 3; i++) sl += sunC[i] * max(dot(vWNs, sunD[i]), 0.0) * 0.95; totalEmissiveRadiance += diffuseColor.rgb * sl * uSelf; }
        #ifdef USE_GLAMPS
        { vec3 gl = vec3(0.0); float per = max(uGLP.x, 0.5), rr = max(uGLP.y * uGLP.y, 0.01);
          for (int i = 0; i < 4; i++) { float zl = (floor((vOP.z - uGL[i].z) / per) + 0.5) * per + uGL[i].z;
            vec3 dl = vec3(uGL[i].xy, zl) - vOP; float d2 = dot(dl, dl);
            float nl = dot(vON, dl) * inversesqrt(max(d2, 1e-3));
            gl += uGLC * uGL[i].w * (0.3 + 0.7 * max(nl, 0.0)) / (1.0 + d2 / rr); }
          totalEmissiveRadiance += gAlb * gl; }
        #endif
        #ifdef USE_PLAMP
        { vec3 dl = uPL - vWPs; float d2 = dot(dl, dl);
          float nl = dot(vWNs, dl) * inversesqrt(max(d2, 1e-3));
          totalEmissiveRadiance += diffuseColor.rgb * uPLC * (0.25 + 0.75 * max(nl, 0.0)) / (1.0 + d2 / max(uPLR.x * uPLR.x, 0.01)); }
        #endif
        if (vK > 2.5 && vK < 3.5) totalEmissiveRadiance += diffuseColor.rgb * (sunC[0] + sunC[1] * 0.6) * uLeafT;     // leaves let the suns through
        if (vK > 1.5 && vK < 2.5) totalEmissiveRadiance += vColor.rgb * uLampE * (0.8 + 0.2 * sin(uTime * 2.3 + vOP.x * 1.7 + vOP.z * 2.1 + vOP.y));`).replace("#include <fog_fragment>",`
        #ifdef USE_FOG
        {
          #ifdef FOG_EXP2
            float fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
          #else
            float fogF = smoothstep(fogNear, fogFar, vFogDepth);
          #endif
          vec3 vd = normalize(-vViewPosition - vec3(0.0, 0.0, 1e-4));
          vec3 fc = mix(fogColor, uPlum * 1.3 + uHazeS * 0.4, smoothstep(0.1, -0.9, dot(vd, (viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz)) * 0.4);
          for (int i = 0; i < 3; i++) { float k = max(dot(vd, (viewMatrix * vec4(sunD[i], 0.0)).xyz), 0.0); float k2 = k * k;
            fc += sunC[i] * (k2 * k2 * 0.08 + pow(k, 36.0) * 0.5) + vec3(0.92, 0.81, 0.63) * pow(k, 10.0) * 0.16; }
          gl_FragColor.rgb = mix(gl_FragColor.rgb, fc, fogF);
        }
        #endif`)},u}const ye=[[0,0,132],[0,0,100],[2,.4,74],[10,2.6,50],[23,8,28],[31,13,5],[30,12,-17],[21,6.5,-45],[7,1,-76],[0,0,-100],[0,0,-132]],We=[[-104,-15,-86,-8,15,-2],[-13,26,-104,13,86,2],[26,-104,-13,86,2,13],[-104,-86,-13,2,-26,13],[-12,-78,72,12,-2,97],[-12,-78,-97,12,-2,-72]];async function Ge(e,i={}){const y=e.rng.fork("triple-fall"),T=(i.palette&&i.palette.length>=7?i.palette:ke).map(r=>new f.Color(r)),u=w0(i.detail??1,.6,1.2),A={archRise:y.pick([1,1,1.2,1.36]),domeH:y.range(.8,1.4),roofWarm:y.range(.12,.55)},H=y.range(-.05,.05);T[0].offsetHSL(H*.2,0,0),T[1].offsetHSL(H*.3,y.range(-.05,.08),0);const I=i.suns&&i.suns.length===3?i.suns:[{dir:[.08,1,.1],color:"#fff2da",intensity:1},{dir:[-1,.12,.1],color:"#ffc49a",intensity:.85},{dir:[.1,.1,-1],color:"#b8b2ff",intensity:.75}],D=I.map(r=>new f.Vector3().fromArray(r.dir.isVector3?r.dir.toArray():r.dir).normalize()),n=I.map(r=>new f.Color(r.color).multiplyScalar(r.intensity??1)),g={self:{value:w0(i.selfLight??.5,0,1.5)},shade:{value:new f.Vector2(...i.shade||[.2,.7])},lampE:{value:i.lampEmissive??5},bounce:{value:new f.Vector3(...i.bounce||[0,0,0])},leafT:{value:i.leafGlow??0},time:{value:0},surge:{value:0},prog:{value:-1},spin:{value:0},leap:{value:0},leapMode:{value:0},viewH:{value:540},sunD:{value:D},sunC:{value:n}},P=new f.Group;P.name="triple-fall";const S=new f.Group;S.position.set(0,E0,0),P.add(S);const x=Te(11e4),c=ie(x,T,y,A),m=Ve(x,c,y,A);await e.yield?.();const C=[],v=ie(x,T,ge(xe("hero-decks7:"+(e.seed??0))),A);for(let r=0;r<3;r++){const W=(r+1)%3,F=(r+2)%3;for(const R of[-1,1])for(const Q of[-1,1]){const O=[d0[W],ee(d0[W]),d0[F],ee(d0[F])],Z=y.pick(O),i0=y.chance(.5)?d0[r]:ee(d0[r]),K=[0,0,0];K[W]=R*U0,K[F]=Q*U0;const E=K.map((l0,B)=>l0-Z[B]*7),j=r===0&&R===1&&Q===-1||r===2&&R===1&&Q===-1||r===2&&R===-1&&Q===-1||r===0&&R===-1;{const l0=j?0:Math.round(y.int(1,3)*u),B=Z[W]*R+Z[F]*Q<0;x.push(a0(i0,Z,E[0],E[1],E[2])),c.galleryA(140,8),await e.yield?.(),c.galleryB(140,8,l0,!B),B&&(await e.yield?.(),qe(x,v,140,8)),x.pop()}const $=E.map((l0,B)=>l0+Z[B]*14-d0[r][B]*60),o0=E.map((l0,B)=>l0+Z[B]*14+d0[r][B]*60);C.push({a:new f.Vector3($[0],$[1]+E0,$[2]),b:new f.Vector3(o0[0],o0[1]+E0,o0[2]),up:new f.Vector3(...Z)}),await e.yield?.()}await e.yield?.()}for(const r of[-1,1])for(const W of[-1,1])for(const F of[-1,1]){const R=y.int(0,2),Q=y.chance(.5)?d0[R]:ee(d0[R]),O=d0[(R+1)%3];x.push(a0(O,Q,r*U0,W*U0,F*U0)),c.pavilionA(),await e.yield?.(),c.pavilionB(),x.pop(),await e.yield?.()}await e.yield?.();const d=[a0([1,0,0],[0,1,0]),a0([0,0,1],[1,0,0]),a0([0,0,1],[0,-1,0])];for(const r of d)x.at(r,()=>m.aqueduct()),await e.yield?.();const b=17,t=3.6,s=2.3,o=a0([0,-1,0],[0,0,1],-12,0,-9);x.at(o,()=>m.cascade(b,t,s)),await e.yield?.();const a=ie(x,T,ge(xe((e.seed??0)+":hero-polish5")),A),h=new f.Matrix4().makeTranslation(-1.1,-35.2,0),l=(()=>{let r=null;return x.at(o,()=>{r=_e(x,a,b,t,s,T[6].clone().lerp(T[4],.55).multiplyScalar(.8),T[0].clone().multiplyScalar(.74))}),r})();await e.yield?.(),x.at(h,()=>Fe(x,a)),x.at(o,()=>Ne(x,v,T[0].clone().multiplyScalar(.86).lerp(T[3],.55).multiplyScalar(1.25)));for(const r of a.lanterns)c.lanterns.push(r);await e.yield?.(),x.at(c.T(0,-10,84),()=>m.belvedere(60.8)),x.at(c.T(0,-10,-84),()=>m.belvedere(60.8));const w=(r,W,F)=>{for(const R of We)if(r>R[0]-7&&r<R[3]+7&&W>R[1]-7&&W<R[4]+7&&F>R[2]-7&&F<R[5]+7)return!0;for(const R of ye)if(Math.hypot(r-R[0],W-R[1],F-R[2])<22)return!0;return!1};let q=0;const V=y.range(32,42);for(let r=0;r<3;r++)for(const W of[-1,1]){const F=(r+1)%3,R=(r+2)%3,Q=[],O=y.int(0,1);for(const K of[-1,1])for(const E of[-1,1]){Q.push({sa:K,su:E,swap:O});const j=[0,0,0],$=[0,0,0],o0=[0,0,0];j[F]=K,$[R]=E,o0[r]=W*80,x.at(a0(j,$,o0[0],o0[1],o0[2]),()=>m.cornerRib(V,75.5))}y.shuffle(Q);let Z=0;const i0=Math.round(y.int(2,3)*u);for(const K of Q){if(Z>=i0)break;const E=[0,0,0],j=[0,0,0];E[K.swap?R:F]=K.sa,j[K.swap?F:R]=K.su;const $=[0,0,0];for(let B=0;B<3;B++)$[B]=(B===r?W*71:0)+E[B]*14+j[B]*-70;let o0=!1;for(let B=-.12;B<=1.13;B+=.125){const x0=w0(B,0,1);if(w($[0]+E[0]*(B*60)+j[0]*x0*40,$[1]+E[1]*(B*60)+j[1]*x0*40,$[2]+E[2]*(B*60)+j[2]*x0*40)){o0=!0;break}}if(o0)continue;const l0=new f.Vector3(...j).cross(new f.Vector3(...E));x.at(a0([l0.x,l0.y,l0.z],j,$[0],$[1],$[2]),()=>m.stairBridge(40,1.5,1,7)),Z++,q++,await e.yield?.()}await e.yield?.()}await e.yield?.();const z=x.finish();await e.yield?.(),await Ae(z,e.yield?()=>e.yield():null),await e.yield?.();const k=be(g,T[4],T[3]),M=new f.Mesh(z,k);M.name="stone",S.add(M),await e.yield?.();const p=[],N=[],G=[],_=[],L=new f.Vector3,Y=new f.Vector3,U=(r,W,F,R,Q,O,Z,i0)=>{L.set(W[0],W[1],W[2]).applyMatrix4(r),Y.set(F[0],F[1],F[2]).transformDirection(r),p.push(L.x,L.y,L.z),N.push(Y.x,Y.y,Y.z),G.push(R,Q),_.push(O,Z,i0)},e0=(r,W,F,R,Q)=>{for(const O of[W,F,R,W,R,Q])U(r,O.p,O.n,O.u,O.v,O.k,O.a,O.f)},X=(r,W,F,R,Q,O,Z)=>{const K=[];for(let E=0;E<=F;E++){const j=E/F,$=W(j),o0=W(Math.min(1,j+.01)),l0=W(Math.max(0,j-.01));let B=o0.p[1]-l0.p[1],x0=o0.p[2]-l0.p[2];const J0=Math.hypot(B,x0)||1;B/=J0,x0/=J0;const Q0=-x0,Z0=B,de=[];for(let K0=0;K0<=12;K0++){const me=K0/12*6.2832,he=Math.cos(me),B0=Math.sin(me);de.push({p:[he*$.hw,$.p[1]+B0*$.th*Q0,$.p[2]+B0*$.th*Z0],n:[he*$.th,B0*$.hw*Q0,B0*$.hw*Z0],u:Math.abs(K0/12*2-1),v:f0(R,Q,j),k:1,a:b0(-1e-4,Math.max(O,1e-4),j)*(1-b0(1-Math.max(Z,1e-4),1.0001,j)),f:j})}K.push(de)}for(let E=0;E<F;E++)for(let j=0;j<12;j++)e0(r,K[E][j],K[E][j+1],K[E+1][j+1],K[E+1][j])},J=(r,W,F,R,Q,O,Z,i0,K=0,E=0,j=1,$=1)=>{const o0=(l0,B,x0,J0,Q0,Z0)=>({p:[l0,R,B],n:[0,1,0],u:x0,v:J0,k:0,a:Z0,f:Q0});e0(r,o0(W,Q,0,Z,K,j),o0(F,Q,1,Z,K,j),o0(F,O,1,i0,E,$),o0(W,O,0,i0,E,$))},n0=r=>({p:[0,A0-.25-(A0-.25-z0*.9)*r*r,-5+5.3*r],hw:f0(4,4.9,b0(.02,.45,r))+1.2*b0(.72,1,r),th:f0(.9,2.8,Math.sqrt(r))});for(const r of d){for(let W=0;W<6;W++){const F=-100+W*15.8,R=F+15.8;J(r,-4.1,4.1,A0,F,Math.min(R,-5),F/9,Math.min(R,-5)/9,0,W===5?.5:0,W===0?0:1,1)}X(r,n0,40,-.55,3.2,.03,.1),await e.yield?.()}{const r=o,W=4.2;X(r,O=>({p:[0,3.6-3.75*O*O,-1.2+5*O],hw:f0(3,4,O),th:f0(1,.45,O)}),12,-1.2,0,.25,.08),J(r,-W,W,-.12,2.6,12,.3,1.35,.9,.15);let F=1.35;for(let O=0;O<b;O++){const Z=12+O*t,i0=-O*s-.12,K=i0-s;X(r,E=>({p:[0,i0-.15-(s-.1)*E*E,Z-.1+1.3*E],hw:W*.98,th:.3}),4,F,F+.5,0,.12),J(r,-W,W,K,Z,Z+1.8,F+.4,F+.6,1,.8),J(r,-W,W,K,Z+1.8,Z+t,F+.6,F+.9,.8,.1),F+=.9}const R=12+b*t,Q=-b*s-.12;J(r,-W,W,Q,R,R+12,F,F+1.3,.1,.4),X(r,O=>({p:[0,Q-.2-16*O*O,R+11.9+3.5*O],hw:W,th:f0(.3,.8,O)}),10,F+1.3,F+2.6,0,.7)}{const F=R=>Math.sqrt(Math.max(0,(A0-.25-R)/(A0-.25-z0*.9)));X(d[2],R=>{const Q=f0(39.4,29.8,R),O=F(Q),Z=b0(0,.5,R)*(1-b0(.56,1,R)),i0=f0(4,4.9,b0(.02,.45,O)),K=f0(.9,2.8,Math.sqrt(O));return{p:[0,Q,-5+5.3*O],hw:f0(i0*1.02,6.5,Z),th:f0(K*1.02,6.1,Z)}},10,1.9,2.6,.22,.22)}await e.yield?.();const r0=new f.BufferGeometry;r0.setAttribute("position",new f.Float32BufferAttribute(p,3)),r0.setAttribute("normal",new f.Float32BufferAttribute(N,3)),r0.setAttribute("uv",new f.Float32BufferAttribute(G,2)),r0.setAttribute("aW",new f.Float32BufferAttribute(_,3)),await e.yield?.();const c0=()=>f.UniformsUtils.clone(f.UniformsLib.fog),k0=T[5].clone(),W0=T[3].clone(),D0=T[4].clone(),I0=T[6].clone(),t0=T[0].clone(),y0=`
    uniform vec3 sunD[3]; uniform vec3 sunC[3]; uniform vec3 uHaze; uniform vec3 uPlum; uniform vec3 uCream;
    vec3 sunWrap(vec3 n){ vec3 s = vec3(0.0); for (int i = 0; i < 3; i++) s += sunC[i] * (0.32 + 0.68 * max(dot(n, sunD[i]), 0.0)); return s * 0.62; }
    vec3 sunSpec(vec3 r, float p){ vec3 s = vec3(0.0); for (int i = 0; i < 3; i++) s += sunC[i] * pow(max(dot(r, sunD[i]), 0.0), p); return s; }
    // the world's "sky": luminous periwinkle haze, plum in the gaps, three soft suns
    vec3 hazeEnv(vec3 d, float sharp){ vec3 c = mix(uPlum * 1.3, uHaze, 0.55 + 0.45 * sfb3(d * 2.0));
      for (int i = 0; i < 3; i++) { float k = max(dot(d, sunD[i]), 0.0); c += sunC[i] * (pow(k, 3.0) * 0.38 + pow(k, 28.0 * sharp) * 2.4) + uCream * pow(k, 8.0) * 0.25; }
      return c; }`,T0=new f.ShaderMaterial({transparent:!0,depthWrite:!1,side:f.DoubleSide,fog:!0,uniforms:{...c0(),uTime:g.time,uSurge:g.surge,sunD:g.sunD,sunC:g.sunC,uTeal:{value:k0},uHaze:{value:W0},uPlum:{value:D0},uCream:{value:t0}},vertexShader:`
      attribute vec3 aW; varying vec2 vUv; varying vec3 vW; varying vec3 vN; varying vec3 vWP;
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        vUv = uv; vW = aW; vN = normalize(mat3(modelMatrix) * normal);
        vec4 wp = modelMatrix * vec4(position, 1.0); vWP = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uSurge; uniform vec3 uTeal; varying vec2 vUv; varying vec3 vW; varying vec3 vN; varying vec3 vWP;
      #include <common>
      #include <fog_pars_fragment>
      ${te}
      ${y0}
      void main(){
        vec3 V = normalize(cameraPosition - vWP); vec3 N = normalize(vN); if (dot(N, V) < 0.0) N = -N;
        float t = uTime * (1.0 + 0.35 * uSurge);
        float fwUv = length(fwidth(vUv));      // taken here, before any branch or loop
        vec2 gp = (vWP.xz + vWP.yy * 0.71) * 3.0; float fwG = length(fwidth(gp));
        vec3 col; float alpha;
        if (vW.x > 0.5) {
          // falling water: long streaks that stretch as they accelerate, white where it tears
          float s = vW.z;
          float streak = sfb(vec2(vUv.x * 7.0, vUv.y * 2.6 - t * 1.25));
          float fine = svn(vec2(vUv.x * 26.0, vUv.y * 9.0 - t * 3.6));
          // It has a body (teal, nearly opaque), strands (thin threads drawn out along the fall, with darker gaps between them,
          // seen only close by) and spray (white flecks along its silhouette); it turns white where it tears.
          // (round 7, the owner's limit) The sheet is lit water: after the suns and the lanterns the brightest thing in a view, but
          // capped under the bloom threshold, so it never blooms into a pale beam. Only its sun glints pass the threshold: sparse
          // points where a strand mirrors one of the suns.
          float white = smoothstep(0.5, 0.94, streak * 0.8 + fine * 0.38 + s * 0.07 + uSurge * 0.04) * 0.8;
          float vein = smoothstep(0.35, 0.6, sfb(vec2(vUv.x * 13.0 + 4.0, vUv.y * 1.4 - t * 0.9)));
          float lodS = clamp(1.4 - fwUv * 90.0, 0.0, 1.0), lodT = clamp(1.4 - fwUv * 200.0, 0.0, 1.0);
          float th1 = svn(vec2(vUv.x * 58.0, vUv.y * 1.6 - t * 1.5)), th2 = svn(vec2(vUv.x * 131.0 + 9.0, vUv.y * 2.3 - t * 2.1));
          float strand = smoothstep(0.55, 0.8, th1) * 0.6 * lodS + smoothstep(0.6, 0.85, th2) * 0.4 * lodT;
          float gap = smoothstep(0.42, 0.2, th1) * lodS, gap2 = smoothstep(0.4, 0.2, th2) * lodT;
          vec3 lit = sunWrap(N);
          lit = mix(vec3(dot(lit, vec3(0.3, 0.5, 0.2))), lit, 0.55);        // the water keeps its own colour under any sun
          lit = clamp(lit * 1.3, vec3(0.8), vec3(1.2));
          vec3 aqua = uTeal * vec3(0.9, 1.1, 1.12) + vec3(0.2, 0.25, 0.24);
          vec3 body = uTeal * mix(0.62, 1.15, vein) * (1.0 - 0.4 * gap) * (1.0 - 0.25 * gap2);
          body = mix(body, aqua, 0.22 + 0.2 * vein + 0.5 * strand);
          col = mix(body, vec3(0.76, 0.91, 0.95), white) * lit * 1.08;
          float nv = dot(N, V);
          float spray = step(0.8, svn(vec2(vUv.x * 90.0, vUv.y * 14.0 - t * 5.0))) * smoothstep(0.4, 0.12, nv) * lodS;
          col = mix(col, vec3(0.8, 0.9, 0.94) * min(lit, vec3(1.0)), spray * 0.7);
          col = min(col, vec3(0.9));
          { vec3 T1 = normalize(cross(N, vec3(0.31, 0.54, 0.78)) + 1e-5), T2 = cross(N, T1);
            vec3 Ng = normalize(N + ((fine - 0.5) * T1 + (th1 - 0.5) * T2) * 0.9);
            float gm = smoothstep(0.66, 0.9, svn(vec2(vUv.x * 41.0 + 3.0, vUv.y * 5.2 - t * 2.6))) * smoothstep(0.35, 0.7, streak);
            col += min(sunSpec(reflect(-V, Ng), 48.0) * gm * 2.6 * clamp(1.5 - fwUv * 60.0, 0.0, 1.0), vec3(4.0)); }      // (a glint is a point of light, not a flare: four times white at most)
          float edge = smoothstep(0.02, 0.24, nv + (th1 - 0.5) * 0.24 * lodS);      // the silhouette breaks into strands: no soft blurred rim
          alpha = vW.y * max(edge, spray * 0.6) * mix(0.88, 0.98, white) * (1.0 - 0.3 * smoothstep(0.6, 1.0, s) * (1.0 - streak));
          // a stream built as a tube (kind 2 and up) thins out toward its two sharp edges, in strands
          if (vW.x > 1.5) alpha *= smoothstep(0.0, 0.5, clamp((vW.x - 2.0) / 0.45, 0.0, 1.0) + (th1 - 0.5) * 0.3 * lodS);
        } else {
          // channel and pool surfaces: deep teal, the haze mirrored at grazing angles, fine ripples that run with the flow
          float lod = clamp(1.0 - fwUv * 6.0, 0.0, 1.0);
          vec2 p = vec2(vUv.x * 22.0, vUv.y * 30.0 - t * 2.4);
          float r1 = sfb(p * vec2(1.0, 0.55)), r2 = sfb(p * 2.3 + vec2(5.0, 5.0 + t * 0.6));
          vec3 T1 = normalize(cross(N, vec3(0.31, 0.54, 0.78)) + 1e-5), T2 = normalize(cross(N, vec3(-0.71, 0.2, 0.4)) + 1e-5);
          vec3 Nr = normalize(N + ((r1 - 0.5) * 0.3 * T1 + (r2 - 0.5) * 0.2 * T2) * (0.3 + 0.7 * lod));
          float f0 = clamp(1.0 - dot(Nr, V), 0.0, 1.0); float fr = f0 * f0 * f0;
          vec3 R = reflect(-V, Nr);
          float edge = min(vUv.x, 1.0 - vUv.x);
          vec3 sw = sunWrap(N); sw = mix(vec3(dot(sw, vec3(0.3, 0.5, 0.2))), sw, 0.45);      // teal under any sun, not the sun's colour
          vec3 body = mix(uTeal, uPlum, 0.08) * (0.46 + 0.30 * r1) * sw * 1.25 * mix(1.3, 0.85, smoothstep(0.0, 0.25, edge));
          // caustic threads: the middle contour of a slow, warped noise
          float cz = svn(p * 0.55 + vec2(r2 * 1.6, t * 0.35));
          float ca = smoothstep(0.44, 0.5, cz) * smoothstep(0.56, 0.5, cz) * lod;
          body += uTeal * vec3(0.7, 1.0, 1.0) * ca * 0.18;
          vec3 env = mix(uPlum * 1.3, uHaze, 0.5 + 0.5 * r2);
          for (int i = 0; i < 3; i++) { float k = max(dot(R, sunD[i]), 0.0); env += sunC[i] * k * k * k * k * 0.3; }
          env = mix(env, uTeal * 1.1, 0.35);
          // sparkle: a much finer normal, so the suns break into points of light and not into patches; sparse and near white,
          // so it reads as glitter on water and never as flecks in stone
          vec2 ps = p * 3.1 + vec2(0.0, t * 0.8);
          vec3 Ns = normalize(N + ((svn(ps) - 0.5) * T1 + (svn(ps * 1.37 + 7.0) - 0.5) * T2) * 0.25);
          vec3 spk = sunSpec(reflect(-V, Ns), 220.0); float spkL = dot(spk, vec3(0.3, 0.5, 0.2));
          spk = mix(spk, spkL * vec3(0.9, 0.97, 1.0), 0.6) * smoothstep(0.74, 0.9, svn(vec2(ps.x, ps.y * 0.35) * 0.37 + 3.0));      // sparse, drawn out along the flow
          col = mix(body, env, 0.08 + 0.5 * fr) + spk * lod + sunSpec(R, 30.0) * 0.08;
          float foam = smoothstep(0.8, 0.3, r2 + (1.0 - vW.z) * 0.9) * vW.z;
          float lace = smoothstep(0.55, 0.95, sfb(vec2(p.x, p.y * 0.18)) * 0.75 + 0.45 * sfb(vec2(p.x * 2.3, p.y * 0.4) + 5.0)) * 0.07 * lod;      // pale marks drawn out along the flow: ripple light, not flecks
          col = mix(col, vec3(0.86, 0.95, 0.98) * sw, clamp(foam + lace, 0.0, 1.0));
          // glints fixed in the world: few, and gone before they shrink to single-pixel flecks
          vec2 gq = vec2(gp.x, gp.y * 0.35);      // stretched, so what is left is drawn-out ripple light and not angular flecks
          float glint = smoothstep(0.78, 0.98, svn(gq * 2.3 + vec2(t * 0.9, -t * 0.6)) * svn(gq * 3.1 - vec2(t * 0.7, t) + 13.0) * 1.9) * lod * clamp(1.0 - fwG * 6.0, 0.0, 1.0);
          col += mix(sunC[0] + sunC[1] * 0.6, vec3(1.3, 1.45, 1.5), 0.6) * glint * 0.1;
          float side = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
          alpha = vW.y * mix(0.9, 1.0, foam) * mix(0.75, 1.0, side);
        }
        gl_FragColor = vec4(col, alpha);
        #include <fog_fragment>
      }`}),G0=new f.Mesh(r0,T0);G0.name="water",G0.renderOrder=3,S.add(G0),await e.yield?.();const M0=[new f.Vector3(0,1,0),new f.Vector3(1,0,0),new f.Vector3(0,-1,0),new f.Vector3(-.894,0,-.447)],H0=y.range(-.3,.3),s0=y.range(.07,.11)*y.sign(),v0=new f.SphereGeometry(z0,72,44),q0=()=>({...c0(),uTime:g.time,uSpin:g.spin,uSurge:g.surge,uHit:{value:M0},sunD:g.sunD,sunC:g.sunC,uTeal:{value:k0},uHaze:{value:W0},uPlum:{value:D0},uCream:{value:t0}}),O0=`
    uniform float uTime, uSurge; uniform vec3 uHit[4];
    varying vec3 vWP; varying vec3 vWN; varying vec3 vD;
    #include <common>
    #include <fog_pars_vertex>
    void main(){
      vec3 d = normalize(position); vD = d;
      float wob = 0.2 * sin(d.x * 3.1 + uTime * 0.9) * sin(d.y * 2.7 - uTime * 0.7) + 0.14 * sin(d.z * 4.3 + uTime * 1.3);
      float hit = 0.0;
      for (int k = 0; k < 4; k++) { float a = acos(clamp(dot(d, uHit[k]), -1.0, 1.0));
        hit += -0.5 * exp(-a * a * 16.0) + sin(a * 22.0 - uTime * 5.0) * exp(-a * 3.2) * 0.1 * (1.0 + uSurge); }
      vec3 p = position + d * (wob + hit);
      vec4 wp = modelMatrix * vec4(p, 1.0); vWP = wp.xyz; vWN = normalize(mat3(modelMatrix) * d);
      vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
    }`,N0=`
    uniform float uTime, uSpin, uSurge; uniform vec3 uHit[4]; uniform vec3 uTeal;
    varying vec3 vWP; varying vec3 vWN; varying vec3 vD;
    #include <common>
    #include <fog_pars_fragment>
    ${te}
    ${y0}
    ${we}
    vec3 spun(vec3 d){ float c = cos(uSpin), s = sin(uSpin); return vec3(d.x * c - d.z * s, d.y, d.x * s + d.z * c); }`,g0=new f.Mesh(v0,new f.ShaderMaterial({side:f.BackSide,fog:!0,uniforms:q0(),vertexShader:O0,fragmentShader:N0+`
      void main(){
        // what you see THROUGH the ball: the hazy world and its three suns, flipped as by a lens
        vec3 I = normalize(vWP - cameraPosition), Nb = normalize(vWN);
        float thick = clamp(dot(Nb, I), 0.0, 1.0);
        vec3 outD = normalize(I - 1.3 * (Nb - dot(Nb, I) * I));
        vec3 env = hazeEnv(outD, 0.55);
        vec3 q = outD / max(abs(outD.x), max(abs(outD.y), abs(outD.z)));
        vec3 g = abs(fract(q * 1.5 + 0.5) - 0.5) + step(0.999, abs(q));
        float lat = smoothstep(0.07, 0.015, min(g.x, min(g.y, g.z)));
        env = mix(env, uCream * 0.95, lat * 0.4);
        vec3 dr = spun(vD);
        float ca = sfb3(dr * 3.2 + vec3(0.0, uTime * 0.12, 0.0));
        float bands = smoothstep(0.49, 0.53, ca) * smoothstep(0.58, 0.53, ca);
        float tk = thick * thick;
        vec3 deep = uTeal * vec3(0.5, 0.11, 0.13) + uPlum * 0.14, mid = uTeal * vec3(0.5, 0.6, 0.66), rim = uTeal * vec3(0.9, 1.0, 1.0);
        vec3 col = mix(mix(rim, mid, smoothstep(0.0, 0.35, thick)), deep, smoothstep(0.25, 1.0, tk));
        col += env * vec3(0.4, 0.88, 1.0) * (0.03 + 0.17 * (1.0 - thick));
        for (int i = 0; i < 3; i++) { float k = max(dot(outD, sunD[i]), 0.0); col += sunC[i] * (pow(k, 26.0) * 0.4 + pow(k, 110.0) * 6.0); }
        col += bands * (uTeal * 0.9 + 0.08) * 0.3;
        col *= 0.75 + 0.5 * sfb3(dr * 1.7 - vec3(uTime * 0.05));
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}));g0.name="sphere-back",S.add(g0);const m0=new f.Mesh(v0,new f.ShaderMaterial({side:f.FrontSide,fog:!0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,uniforms:q0(),vertexShader:O0,fragmentShader:N0+`
      void main(){
        vec3 V = normalize(cameraPosition - vWP), N = normalize(vWN);
        vec3 dr = spun(vD);
        float nx = sfb3(dr * 5.0 + vec3(uTime * 0.2, 0.0, 0.0)) - 0.5, ny = sfb3(dr * 5.0 + vec3(7.3, uTime * 0.2, 1.7)) - 0.5;
        vec3 T1 = normalize(cross(N, vec3(0.03, 1.0, 0.01)) + 1e-5), T2 = cross(N, T1);
        float foam = 0.0, ring = 0.0;
        for (int k = 0; k < 4; k++) { float a = acos(clamp(dot(vD, uHit[k]), -1.0, 1.0));
          ring += sin(a * 24.0 - uTime * 5.5) * exp(-a * 2.6);
          foam += smoothstep(0.4 + 0.1 * uSurge, 0.14, a + 0.4 * nx) * smoothstep(0.25, 0.7, svn(vD.xz * 11.0 + vD.y * 9.0 - uTime * 1.5) + 0.6 * smoothstep(0.3, 0.1, a)); }
        N = normalize(N + 0.24 * (nx * T1 + ny * T2) + 0.16 * ring * T2);
        float F = pow(clamp(1.0 - dot(N, V), 0.0, 1.0), 3.1);
        vec3 R = reflect(-V, N);
        vec3 refl = hazeEnv(R, 1.0) * 1.05 + uCream * 0.08;
        vec3 spec = sunSpec(R, 240.0) * 7.0 + sunSpec(R, 30.0) * 0.25;
        foam = clamp(foam, 0.0, 1.0);
        float a = clamp(F * 0.9 + 0.07, 0.0, 1.0) * (1.0 - foam) + foam * 0.92;
        vec3 col = refl * clamp(F * 0.9 + 0.07, 0.0, 1.0) * (1.0 - foam) + vec3(0.88, 0.96, 1.0) * sunWrap(N) * 1.05 * foam * 0.92 + spec;
        #ifdef USE_FOG
          col = mix(col, fogColor * a, 1.0 - fogFade());
        #endif
        gl_FragColor = vec4(col, a);
      }`}));m0.name="sphere-front",m0.renderOrder=2,S.add(m0),await e.yield?.();const u0=Math.round(w0(i.fish??y.int(40,54),8,90)),V0=Math.min(6,Math.max(2,Math.round(u0/8))),p0=new f.InstancedBufferGeometry;{const r=[-.5,-.32,-.08,.18,.38,.5],W=[.035,.09,.17,.165,.1,.012],F=6,R=[],Q=[],O=[];for(let E=0;E<r.length;E++)for(let j=0;j<F;j++){const $=j/F*6.2832;R.push(Math.cos($)*W[E]*.72,Math.sin($)*W[E]*1.3,r[E]),Q.push(Math.cos($),Math.sin($)*.6,0)}for(let E=0;E<r.length-1;E++)for(let j=0;j<F;j++){const $=E*F+j,o0=E*F+(j+1)%F;O.push($,o0,o0+F,$,o0+F,$+F)}const Z=E=>{const j=R.length/3;for(const $ of E)R.push(0,$[0],$[1]),Q.push(1,0,0);for(let $=1;$<E.length-1;$++)O.push(j,j+$,j+$+1)};Z([[0,-.44],[.3,-.92],[.06,-.78],[-.3,-.92]]),Z([[.2,.16],[.4,-.06],[.33,-.22],[.15,-.3]]),Z([[-.19,.12],[-.34,-.02],[-.17,-.1]]),p0.setAttribute("position",new f.Float32BufferAttribute(R,3)),p0.setAttribute("normal",new f.Float32BufferAttribute(Q,3)),p0.setIndex(O);const i0=new Float32Array(u0*4),K=new Float32Array(u0*4);for(let E=0;E<u0;E++){const j=y.range(3.2,9.4),$=Math.sqrt(Math.max(1,10.4*10.4-j*j))-1;i0.set([j,y.range(-$,$)*.8,y.range(0,6.283),y.range(.16,.42)*(y.chance(.8)?1:-1)*(5.5/j+.4)],E*4),K.set([y.range(1.5,2.9)*(y.chance(.12)?1.35:1),y.range(-.3,.3),y(),E<V0?E:-1],E*4)}p0.setAttribute("iA",new f.InstancedBufferAttribute(i0,4)),p0.setAttribute("iB",new f.InstancedBufferAttribute(K,4)),p0.instanceCount=u0}const Me=new f.ShaderMaterial({side:f.DoubleSide,fog:!0,uniforms:{...c0(),uTime:g.time,uSpin:g.spin,uLeap:g.leap,uLeapMode:g.leapMode,uLeapN:{value:V0},sunD:g.sunD,sunC:g.sunC,uCoral:{value:I0},uTeal:{value:k0},uHaze:{value:W0},uPlum:{value:D0},uCream:{value:t0},uTilt:{value:H0}},vertexShader:`
      attribute vec4 iA; attribute vec4 iB;
      uniform float uTime, uSpin, uLeap, uLeapMode, uLeapN, uTilt;
      varying vec3 vN; varying vec3 vL; varying float vSeed; varying float vIn;
      #include <common>
      #include <fog_pars_vertex>
      vec3 swimPos(float t){
        float ang = iA.z + t * iA.w + uSpin;
        vec3 p = vec3(cos(ang) * iA.x, iA.y + sin(ang * 2.0 + iB.z * 6.283) * 0.9, sin(ang) * iA.x);
        float tl = iB.y + uTilt, c = cos(tl), s = sin(tl);
        return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
      }
      vec3 leapPos(float q){
        float az = (iB.w / max(uLeapN - 1.0, 1.0) - 0.5) * 2.3;
        vec3 d0 = normalize(vec3(cos(az), -0.3 + 0.25 * sin(iB.w * 1.7), sin(az)));
        vec3 d1 = normalize(vec3(cos(az + 0.55), 0.62, sin(az + 0.55)));
        return normalize(mix(d0, d1, q)) * ${z0.toFixed(1)} * (0.84 + 0.82 * sin(3.14159 * q));
      }
      void main(){
        float sc = iB.x; vec3 c0, c1, up;
        if (iB.w > -0.5) {
          float q = uLeapMode > 0.5 ? (uLeap - iB.w / uLeapN * 0.78) / 0.22 : fract(uLeap + iB.w / uLeapN) / 0.3;
          float qq = clamp(q, 0.0, 1.0); c0 = leapPos(qq); c1 = leapPos(qq + 0.02); up = normalize(c0);
          sc *= smoothstep(0.0, 0.07, q) * smoothstep(1.0, 0.93, q);
        } else { c0 = swimPos(uTime); c1 = swimPos(uTime + 0.1); up = vec3(0.0, 1.0, 0.0); }
        vec3 fw = normalize(c1 - c0), rt = normalize(cross(up, fw)); up = cross(fw, rt);
        vec3 lp = position;
        lp.x += sin(lp.z * 5.5 - uTime * (3.0 + abs(iA.w) * 8.0) + iB.z * 20.0) * 0.12 * (0.55 - lp.z);
        vec3 p = c0 + (rt * lp.x + up * lp.y + fw * lp.z) * sc;
        vN = normalize(mat3(modelMatrix) * (rt * normal.x + up * normal.y + fw * normal.z));
        vL = position; vSeed = iB.z; vIn = step(length(p), ${z0.toFixed(1)});
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uCoral, uTeal; varying vec3 vN; varying vec3 vL; varying float vSeed; varying float vIn;
      #include <common>
      #include <fog_pars_fragment>
      ${te}
      ${y0}
      void main(){
        vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
        float pch = smoothstep(0.5, 0.62, svn(vec2(vL.z * 4.0 + vSeed * 31.0, vL.y * 6.0 + vSeed * 17.0)) + (vSeed - 0.5) * 0.5);
        vec3 base = mix(uCoral * vec3(1.0, 0.78, 0.5), vec3(1.0, 0.9, 0.8), pch) * mix(0.75, 1.1, smoothstep(-0.15, 0.15, vL.y));
        vec3 col = base * (0.55 + sunWrap(N)) * 1.5;
        col = mix(col, col * vec3(0.85, 1.0, 1.0) + uTeal * 0.06, vIn * 0.5);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}),R0=new f.Mesh(p0,Me);R0.name="goldfish",R0.frustumCulled=!1,R0.renderOrder=1,S.add(R0),await e.yield?.();const re=[],le=[],ce=[],fe=[],C0=new f.Vector3,oe=new f.Vector3,j0=new f.Vector3,S0=(r,W,F,R,Q,O,Z,i0,K,E,j)=>{for(let $=0;$<r;$++)C0.set(y.gauss(),y.gauss(),y.gauss()),oe.copy(R),C0.addScaledVector(oe,-C0.dot(oe)).normalize().multiplyScalar(F).addScaledVector(R,Q*y.range(.4,1)),j0.set(y.gauss(),y.gauss(),y.gauss()).multiplyScalar(j).add(W),re.push(j0.x,j0.y,j0.z),le.push(C0.x,C0.y,C0.z),ce.push(O.x,O.y,O.z),fe.push(y(),y.range(.14,.3),y.range(Z,i0),y.range(K,E))},P0=[new f.Vector3(0,-1,0),new f.Vector3(-1,0,0),new f.Vector3(0,1,0)],ue=[];for(let r=0;r<3;r++){const W=M0[r].clone().multiplyScalar(z0),F=new f.Vector3(0,A0,-5).applyMatrix4(d[r]);S0(150,W.clone().multiplyScalar(1.08),.8,M0[r],.95,P0[r].clone().multiplyScalar(2.5),3.5,8,6,13,1.8),S0(70,W.clone().multiplyScalar(1.3),.5,M0[r],1,P0[r].clone().multiplyScalar(-2),6,11,6,12,3);for(let R=0;R<9;R++){const Q=(R+.5)/9,O=F.clone().lerp(W,Q*Q*.96+.04);S0(10,O,.55,P0[r],.6,P0[r].clone().multiplyScalar(16+22*Q),1.6,3.4,3,6,2.6)}S0(30,F.clone().addScaledVector(P0[r],6),.35,P0[r],1,P0[r].clone().multiplyScalar(14),2.5,4.5,3,6,2.2),ue.push({lip:F.clone().add(S.position),end:W.clone().add(S.position),gravity:P0[r].clone()})}const Y0=new f.Vector3(0,0,-1),Se=new f.Vector3(0,0,1);S0(50,M0[3].clone().multiplyScalar(z0*1.02),.8,M0[3],.5,Y0.clone().multiplyScalar(4),2.5,5,4,8,1.2);for(let r=0;r<b;r++){const W=new f.Vector3(0,-(r+1)*s+.3,12+r*t+1.2).applyMatrix4(o);for(let F=0;F<7;F++)S0(1,W.clone().add(new f.Vector3(0,y.range(-3.8,3.8),0)),.5,Se,1,Y0.clone().multiplyScalar(1.5),1.6,3.2,2,4.5,.4)}S0(40,new f.Vector3(0,-b*s-6,12+b*t+14).applyMatrix4(o),.5,Y0,1,Y0.clone().multiplyScalar(10),3,6,4,9,2.5),S0(70,new f.Vector3(-1.1,-33.2,0),.9,new f.Vector3(0,1,0),.8,new f.Vector3(0,2.2,0),2.6,5.5,3,6.5,3.2);const _0=new f.BufferGeometry;_0.setAttribute("position",new f.Float32BufferAttribute(re,3)),_0.setAttribute("aDir",new f.Float32BufferAttribute(le,3)),_0.setAttribute("aG",new f.Float32BufferAttribute(ce,3)),_0.setAttribute("aP",new f.Float32BufferAttribute(fe,4)),_0.boundingSphere=new f.Sphere(new f.Vector3,140);const ae=new f.Color(0,0,0);for(let r=0;r<3;r++)ae.add(n[r]);ae.multiplyScalar(.36).lerp(new f.Color(.8,.94,1),.55);const ne=new f.Points(_0,new f.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:{...c0(),uTime:g.time,uSurge:g.surge,uViewH:g.viewH,uCol:{value:ae},uMistA:{value:i.mistAlpha??.2}},vertexShader:`
      attribute vec3 aDir; attribute vec3 aG; attribute vec4 aP; uniform float uTime, uSurge, uViewH; varying float vA;
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        float age = fract(uTime * aP.y * (1.0 + 0.3 * uSurge) + aP.x), e = 1.0 - (1.0 - age) * (1.0 - age);
        vec3 p = position + aDir * aP.w * e + aG * age * age;
        vA = smoothstep(0.0, 0.14, age) * pow(1.0 - age, 1.4) * (0.75 + 0.35 * uSurge);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = min(aP.z * 1.5 * (0.4 + 0.9 * age) * uViewH * 0.5 * projectionMatrix[1][1] / max(-mvPosition.z, 1.0), 220.0);
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uCol; uniform float uMistA; varying float vA;
      #include <common>
      #include <fog_pars_fragment>
      void main(){
        vec2 q = gl_PointCoord * 2.0 - 1.0; float r2 = dot(q, q); if (r2 > 1.0) discard;
        float s = exp(-r2 * 3.2) * (1.0 - r2);
        gl_FragColor = vec4(uCol * 0.95, s * vA * uMistA);
        #include <fog_fragment>
      }`}));ne.name="mist",ne.renderOrder=4,S.add(ne),await e.yield?.();const ve=[],pe=[];for(const r of v.lanterns)c.lanterns.push(r);for(const r of c.lanterns)ve.push(r[0],r[1],r[2]),pe.push(r[3]);const $0=new f.BufferGeometry;$0.setAttribute("position",new f.Float32BufferAttribute(ve,3)),$0.setAttribute("aS",new f.Float32BufferAttribute(pe,1)),$0.boundingSphere=new f.Sphere(new f.Vector3,170);const se=new f.Points($0,new f.ShaderMaterial({transparent:!0,depthWrite:!1,blending:f.AdditiveBlending,fog:!0,uniforms:{...c0(),uTime:g.time,uViewH:g.viewH,uGS:{value:i.glowSize??11},uCol:{value:I0.clone().lerp(t0,.2).multiplyScalar(i.glowGain??1)}},vertexShader:`
      attribute float aS; uniform float uTime, uViewH, uGS; varying float vF;
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        vF = 0.8 + 0.2 * sin(uTime * 2.3 + position.x * 1.7 + position.z * 2.1 + position.y);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = clamp(aS * uGS * uViewH * 0.5 * projectionMatrix[1][1] / max(-mvPosition.z, 1.0), 2.0, 90.0);
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uCol; varying float vF;
      #include <common>
      #include <fog_pars_fragment>
      ${we}
      void main(){
        vec2 q = gl_PointCoord * 2.0 - 1.0; float r = length(q); if (r > 1.0) discard;
        float k = max(1.0 - r, 0.0); float g = k * k * k * 1.6 + smoothstep(0.22, 0.0, r) * 1.2;
        gl_FragColor = vec4(uCol * g * vF * fogFade(), 1.0);
      }`}));se.name="lantern-glow",se.renderOrder=5,S.add(se);const h0=(r,W,F)=>new f.Vector3(r,W+E0,F),Pe={sphereCenter:h0(0,0,0),sphereRadius:z0,entry:{position:h0(0,0,100),facing:new f.Vector3(0,0,-1)},exit:{position:h0(0,0,-100),facing:new f.Vector3(0,0,-1)},portalSeat:{position:h0(0,0,-96),facing:new f.Vector3(0,0,1),radius:7},flyThrough:ye.map(r=>h0(r[0],r[1],r[2])),viewpoints:{front:h0(0,4,150),orbitApex:h0(31,13,5),high:h0(118,62,124),low:h0(-60,-40,120)},falls:ue,cascade:{top:new f.Vector3(0,0,6).applyMatrix4(o).add(S.position),bottom:new f.Vector3(0,-b*s,18+b*t).applyMatrix4(o).add(S.position),gravity:new f.Vector3(0,0,-1),along:new f.Vector3(-1,0,0)},walkways:C,soffitStair:{a:new f.Vector3(0,l.y0,l.top).applyMatrix4(o).add(S.position),b:new f.Vector3(0,l.y0-l.nS*l.ri,l.top+l.nS*l.ru).applyMatrix4(o).add(S.position),side:new f.Vector3(0,-1,0),up:new f.Vector3(0,0,-1),hw:l.hw},well:{center:new f.Vector3(-1.1,-35.2+1.6+E0,0),half:12.5,radius:7},arcadeBalcony:{a:new f.Vector3(-8,-61,36.6).applyMatrix4(o).add(S.position),b:new f.Vector3(8,-61,36.6).applyMatrix4(o).add(S.position),up:new f.Vector3(0,1,0).transformDirection(o)},suns:D.map(r=>r.clone())};let F0=-1,L0=.45,X0=.64;const ze=new f.Vector2;return{object:P,radius:112,height:224,center:h0(0,0,0),anchors:Pe,uniforms:g,sphere:{back:g0,front:m0,fish:R0},kit:{pal:T,style:A,U:g,stoneMaterial:k,waterMaterial:T0,makeStone:r=>be(g,T[4],T[3],r)},stats:{triangles:Math.round(x.tris+p.length/9+2*(3168*2)+u0*76),bridges:q,lanterns:c.lanterns.length,fish:u0},setProgress(r){F0=r},setWindow(r,W){L0=r,X0=Math.max(r+.01,W)},update(r,W,F){g.time.value=W,g.spin.value=W*s0,F0>=0?(g.leapMode.value=1,g.leap.value=w0((F0-L0)/(X0-L0),-.3,1.4),g.prog.value=F0,g.surge.value=b0(L0-.08,L0+.02,F0)*(1-b0(X0,X0+.1,F0))):(g.leapMode.value=0,g.leap.value=W*.035,g.surge.value=.3+.3*Math.sin(W*.21)),e.renderer?.getDrawingBufferSize&&(g.viewH.value=e.renderer.getDrawingBufferSize(ze).y)},dispose(){},ground:!1,groundY:0}}export{Ae as boundsInSteps,Ge as buildHero,a0 as frame,Ve as makeBig,Te as makeBuilder,ie as makeKit,be as makeStoneMaterial,Ce as ringWall};
