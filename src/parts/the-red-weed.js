import*as l from"three";import{RW_GLSL as ee,makeShared as xe,withShared as ie,Acc as be,DEG as J,clamp as te,lerp as he,sstep as ne,fract as Me}from"./the-red-weed-common.js";const k={H0:26,hips:[[3.3,-.35,2],[-3.3,-.35,2],[0,-.35,-3.8]],L:[11,10,9],ankle:1.2,stride:29.16,lat:[13,-13,0],fa:[3.6,3.6,-9.6],lift:5.6,dip:1.2,tilt:5.2*J,yaw:4*J,fold:[1,-1.25],hoodY:5.75,shoulder:[0,-1,3.2],armL:[4.6,4.4],ropes:[[2.5,30,9.6],[2.7,95,8.2],[2.4,150,10.4],[2.6,215,7.6],[2.8,270,9.2],[2.3,330,8.6]]},A={body:0,hood:1,leg:2,foot:11,arm:14,cas:16,count:17},_={steel:0,brass:1,white:2,dark:3,dish:4,dull:5,weave:6};class ke extends be{constructor(){super(),this.part=0,this.mat=0,this.thin=!1,this.col=[0,0,0]}pm(e,s){return this.part=e,this.mat=s,this.ex=[e,s,0,0],this}rod(e,s,c,n=c,h=8,w=0){const p=Math.hypot(s[0]-e[0],s[1]-e[1],s[2]-e[2]),m=this;this.tube(e,s,c,n,h,w,(b,v,f,S,V)=>(m.col=m.thin?[f,S,V]:[0,0,0],[m.part,m.mat,b/h*6.2832*(v?n:c),v?p:0])),this.col=[0,0,0]}turn(e,s,c,n){const h=this;this.lathe(e,s,c,n,(w,p,m)=>[h.part,h.mat,w*6.2832*Math.max(m[0],.5),m[1]])}}function fe(t=k.L){const e=new ke;e.pm(A.body,_.steel),e.turn(0,0,[[.02,-1.55],[1.5,-1.55],[2.5,-1.05],[3.8,-.3],[4.3,0],[4.55,.1],[4.55,.42],[4.3,.55],[4.3,2.2],[4.42,2.28],[4.42,2.5],[4.3,2.58],[4.3,4.05],[4.55,4.2],[4.55,4.5],[4.3,4.62],[3.55,5],[3.15,5.08],[3.15,5.6],[3.3,5.66],[3.3,5.75],[.02,5.75]],28);for(const o of k.hips)e.ball(o[0],o[1],o[2],1.6,12,8);for(let o=0;o<4;o++){const r=o/4*6.2832+.78;e.rod([Math.cos(r)*3.9,-.2,Math.sin(r)*3.9],[Math.cos(r)*1.6,-1.5,Math.sin(r)*1.6],.16,.16,6)}e.ball(k.shoulder[0],k.shoulder[1],k.shoulder[2],.7,10,7);for(const o of k.ropes){const r=o[1]*J;e.rod([Math.sin(r)*o[0],-1.15,Math.cos(r)*o[0]],[Math.sin(r)*o[0],-1.75,Math.cos(r)*o[0]],.3,.2,6,1)}const s={x:0,y:-.9,z:-6.35,h:6,ax:3.5,az:2.25},c=o=>.5+.5*Math.sin(Math.PI*(.12+.62*o)),n=(o,r,u=1)=>[s.x+Math.cos(r)*s.ax*c(o)*u,s.y+o*s.h,s.z+Math.sin(r)*s.az*c(o)*u];{const u=e.count,a=.95;for(let d=0;d<=8;d++)for(let y=0;y<=24;y++){const M=d/8,N=y/24*6.2832,z=n(M,N,a),x=(c(Math.min(1,M+.05))-c(Math.max(0,M-.05)))*3;e.v(z[0],z[1],z[2],Math.cos(N)/s.ax,-x*.12,Math.sin(N)/s.az,[A.body,_.weave,y/24*18.6,M*s.h])}for(let d=0;d<8;d++)for(let y=0;y<24;y++){const M=u+d*25+y,N=M+24+1;e.i.push(M,N,N+1,M,N+1,M+1)}const g=e.v(s.x,s.y-.2,s.z,0,-1,0,[A.body,_.weave,0,0]);for(let d=0;d<24;d++)e.i.push(g,u+d,u+d+1);const i=e.count;e.v(s.x,s.y+.9*s.h,s.z,0,1,0,[A.body,_.dark,0,0]);for(let d=0;d<=24;d++){const y=n(.9,d/24*6.2832,a*.99);e.v(y[0],y[1],y[2],0,1,0,[A.body,_.dark,0,0])}for(let d=0;d<24;d++)e.i.push(i,i+2+d,i+1+d)}e.pm(A.body,_.white),e.thin=!0;const h=[0,.2,.42,.64,.84,1],w=16,p=24;for(const o of h)for(let r=0;r<p;r++)e.rod(n(o,r/p*6.2832),n(o,(r+1)/p*6.2832),o===1?.15:.1,o===1?.15:.1,4);for(let o=0;o<w;o++){const r=(o+.5)/w*6.2832;for(let u=0;u<h.length-1;u++)e.rod(n(h[u],r),n(h[u+1],r),.085,.085,4);e.rod([s.x,s.y-.25,s.z],n(0,r),.085,.085,4)}e.thin=!1,e.pm(A.body,_.steel);for(const o of[-1,1])e.rod([o*2.6,.6,-3.4],[o*2.9,.5,-5.1],.22,.18,6),e.rod([o*2.2,4.3,-3.7],[o*3,4.2,-5.3],.2,.16,6);e.pm(A.hood,_.brass),e.turn(0,0,[[3.05,-.05],[3.2,.05],[3.2,.35],[2.75,.5],[2.45,.9]],24);const m=12,b=20,v=[],f=4.9,S=98*J;{let o=.55,r=-1.25;for(let u=0;u<=m;u++){const a=u/m,g=S*Math.pow(a,1.2),i=2.25+.6*Math.pow(a,1.3)+.22*Math.pow(a,6);v.push({y:o,z:r,ph:g,r:i,t:a});const d=f/m,y=S*Math.pow((u+.5)/m,1.2);o+=Math.cos(y)*d,r+=Math.sin(y)*d}}const V=(o,r)=>1+.24*Math.pow(Math.max(0,-Math.sin(r)),5)*Math.sin(Math.PI*Math.min(1,o.t*1.05)),F=(o,r,u,a=!1)=>{const g=Math.sin(r),i=o.t*o.t,d=V(o,r),y=Math.cos(r)*u*(1+.1*i*Math.max(0,g)),M=g*u*d*(g>0?1-.42*i:1),N=a?0:(g<0?2.1*g*g:-1.3*g*g)*i*o.t;return[y,o.y-M*Math.sin(o.ph)+N*Math.cos(o.ph),o.z+M*Math.cos(o.ph)+N*Math.sin(o.ph)]},j=o=>{const r=e.count,u=o?-.14:0;e.pm(A.hood,o?_.dark:_.brass);for(let a=0;a<=m;a++)for(let g=0;g<=b;g++){const i=v[a],d=g/b*6.2832,y=F(i,d,i.r+u),M=F(i,d,1,!0);let N=M[0],z=M[1]-i.y,x=M[2]-i.z;o&&(N=-N,z=-z,x=-x),e.v(y[0],y[1],y[2],N,z,x,[A.hood,o?_.dark:_.brass,g/b*6.2832*i.r,i.t*f])}for(let a=0;a<m;a++)for(let g=0;g<b;g++){const i=r+a*(b+1)+g,d=i+b+1;o?e.i.push(i,d+1,d,i,i+1,d+1):e.i.push(i,d,d+1,i,d+1,i+1)}};j(!1),j(!0);{const o=v[m];for(let r=0;r<b;r++)e.pm(A.hood,_.brass).rod(F(o,r/b*6.2832,o.r-.02),F(o,(r+1)/b*6.2832,o.r-.02),.11,.11,5);for(const r of[3,7]){const u=v[r];for(let a=0;a<b;a++)e.rod(F(u,a/b*6.2832,u.r+.02),F(u,(a+1)/b*6.2832,u.r+.02),.09,.09,4)}}const T=[[.86,.76],[.72,.62],[.57,.46]],B=[1.4,1.22,1.02];for(let o=0;o<3;o++)for(let r=0;r<3;r++){const u=t[r],a=T[r];e.pm(A.leg+o*3+r,_.steel),e.ball(0,0,0,B[r],12,8),e.rod([0,0,0],[0,u,0],a[0],a[1],10),e.rod([0,1.15,0],[0,1.95,0],a[0]+.2,a[0]+.2,10,1),e.rod([0,u-2.1,0],[0,u-1.3,0],a[1]+.18,a[1]+.18,10,1),e.rod([0,u*.5-.25,0],[0,u*.5+.25,0],a[0]+.1,a[0]+.1,10,1),e.thin=!0,e.rod([a[0]+.5,1.55,0],[a[1]+.48,u-1.7,0],.14,.14,5),e.thin=!1,e.rod([0,1.55,0],[a[0]+.5,1.55,0],.16,.16,5),e.rod([0,u-1.7,0],[a[1]+.48,u-1.7,0],.16,.16,5)}for(let o=0;o<3;o++){e.pm(A.foot+o,_.steel),e.ball(0,0,0,.78,10,7),e.rod([0,-.3,0],[0,-.82,0],.42,.5,8),e.turn(0,0,[[.02,-k.ankle],[1,-k.ankle],[1.18,-.98],[.82,-.74],[.46,-.66]],12);for(let r=0;r<3;r++){const u=r/3*6.2832,a=Math.cos(u),g=Math.sin(u),i=(H,$,X)=>[g*H+a*$,X,a*H-g*$],d=-k.ankle,y=[.55,.56],M=[1.8,.36],N=i(y[0],-y[1],d),z=i(y[0],y[1],d),x=i(M[0],M[1],d-.06),W=i(M[0],-M[1],d-.06),Z=i(y[0],-y[1],-.68),P=i(y[0],y[1],-.68),C=i(M[0],M[1],-1),q=i(M[0],-M[1],-1);e.quad(Z,q,C,P),e.quad(N,z,x,W),e.quad(W,x,C,q),e.quad(N,W,q,Z),e.quad(x,z,P,C)}}e.pm(A.arm,_.steel),e.ball(0,0,0,.52,10,7),e.rod([0,0,0],[0,k.armL[0],0],.3,.26,8),e.pm(A.arm+1,_.steel),e.ball(0,0,0,.44,10,7),e.rod([0,0,0],[0,k.armL[1],0],.25,.22,8),e.ball(0,k.armL[1],0,.36,8,6),e.pm(A.cas,_.dull),e.box(0,-1.05,.35,1.15,.72,.62),e.box(0,-.27,.35,1.22,.1,.69),e.rod([0,-.02,.1],[0,-.2,.25],.16,.16,6),e.pm(A.cas,_.steel),e.rod([0,-1.05,.95],[0,-1.05,1.08],.8,.8,16),e.pm(A.cas,_.dish);{const o=e;e.tube([0,-1.05,1.02],[0,-1.05,1.1],.7,.7,16,1,()=>[A.cas,_.dish,0,0]),o.col=[0,0,0]}const L=new l.BufferGeometry;return L.setAttribute("position",new l.Float32BufferAttribute(e.p,3)),L.setAttribute("normal",new l.Float32BufferAttribute(e.n,3)),L.setAttribute("aAxis",new l.Float32BufferAttribute(e.c,3)),L.setAttribute("aE",new l.Float32BufferAttribute(e.e,4)),L.setIndex(e.count>65535?new l.Uint32BufferAttribute(e.i,1):new l.Uint16BufferAttribute(e.i,1)),L.boundingSphere=new l.Sphere(new l.Vector3(0,0,0),1e5),{geometry:L,triangles:e.triangles}}function Se(){const t=[],e=[],s=[];let c=0;const n=16,h=5;for(let p=0;p<k.ropes.length;p++){const m=c;for(let v=0;v<=n;v++)for(const f of[0,1]){const S=te((v+(f?.08:-.08))/n,0,1),V=v===n?1.6:f?0:.55;for(let F=0;F<h;F++)t.push(0,0,0),e.push(p,S,F/h*6.2832,V),c++}const b=(n+1)*2;for(let v=0;v<b-1;v++)for(let f=0;f<h;f++){const S=m+v*h+f,V=m+v*h+(f+1)%h,F=S+h,j=V+h;s.push(S,F,j,S,j,V)}}const w=new l.BufferGeometry;return w.setAttribute("position",new l.Float32BufferAttribute(t,3)),w.setAttribute("aR",new l.Float32BufferAttribute(e,4)),w.setIndex(s),w.boundingSphere=new l.Sphere(new l.Vector3(0,0,0),1e5),{geometry:w,triangles:s.length/3}}const Y=new l.Vector3(0,1,0),K=new l.Vector3,O=new l.Vector3,Ve=new l.Vector3,oe=new l.Vector3,R=new l.Vector3,G=new l.Vector3,se=new l.Vector3,Q=new l.Vector3,I=new l.Vector3,U=new l.Vector3,pe=new l.Matrix4,ue=new l.Matrix4;function me(){const t=()=>new l.Vector3,e=()=>[t(),t(),t()];return{mats:Array.from({length:A.count},()=>new l.Matrix4),body:t(),front:t(),left:t(),up:t(),hip:e(),k1:e(),k2:e(),ank:e(),sole:e(),q:[-1,-1,-1],anchors:k.ropes.map(t),wrist:t(),g:0,sig:0,w:0,jsw:0,hoodYaw:0,joints:new Float32Array(36)}}function ve(t,e,s,c){const n=e[0]*t,h=n+e[1]*t;return c[0]=s[0],c[1]=0,c[2]=s[0]+s[1]*Math.cos(n),c[3]=s[1]*Math.sin(n),c[4]=c[2]+s[2]*Math.cos(h),c[5]=c[3]+s[2]*Math.sin(h),Math.hypot(c[4],c[5])}const D=[0,0,0,0,0,0];function ze(t,e,s,c,n,h,w){R.subVectors(e,t);const p=n[0]+n[1]+n[2],m=te(R.length(),p*.5,p*.9985);R.normalize(),G.copy(s).addScaledVector(R,-s.dot(R)),G.lengthSq()<1e-6&&G.set(1,0,0).addScaledVector(R,-R.x),G.normalize();let b=0,v=2.2;for(let L=0;L<18;L++){const o=(b+v)/2;ve(o,c,n,D)>m?b=o:v=o}ve((b+v)/2,c,n,D);const f=Math.atan2(D[5],D[4]),S=Math.cos(f),V=Math.sin(f),F=D[0]*S+D[1]*V,j=-D[0]*V+D[1]*S,T=D[2]*S+D[3]*V,B=-D[2]*V+D[3]*S;h.copy(t).addScaledVector(R,F).addScaledVector(G,j),w.copy(t).addScaledVector(R,T).addScaledVector(G,B),se.crossVectors(R,G).normalize()}function ae(t,e,s,c,n){I.subVectors(s,e);const h=I.length()||1;return U.crossVectors(n,I).normalize(),Q.crossVectors(I,U).normalize(),I.multiplyScalar(1/c),t.makeBasis(Q,I,U).setPosition(e),h}function we(t,e,s,c,n){const{body:h,front:w,left:p,up:m}=e;e.mats[A.body].makeBasis(p,m,w).setPosition(h);for(let a=0;a<3;a++){const g=k.hips[a],i=e.hip[a].copy(h).addScaledVector(p,g[0]).addScaledVector(m,g[1]).addScaledVector(w,g[2]),d=e.ank[a].copy(s[a]);d.y+=k.ankle;const y=n.poles&&n.poles[a]||t.pole;K.copy(p).multiplyScalar(g[0]).addScaledVector(w,g[2]),K.y=0,K.normalize(),O.crossVectors(Y,K),K.multiplyScalar(y[0]).addScaledVector(O,y[2]||0),K.y+=y[1],ze(i,d,K,n.folds&&n.folds[a]||t.fold,t.L,e.k1[a],e.k2[a]);const M=oe.copy(se);ae(e.mats[A.leg+a*3],i,e.k1[a],t.L[0],M),ae(e.mats[A.leg+a*3+1],e.k1[a],e.k2[a],t.L[1],M),ae(e.mats[A.leg+a*3+2],e.k2[a],d,t.L[2],M);const N=Math.cos(c[a]),z=Math.sin(c[a]);U.copy(t.F).multiplyScalar(N).addScaledVector(Y,-z),I.copy(Y).multiplyScalar(N).addScaledVector(t.F,z),Q.crossVectors(I,U),e.mats[A.foot+a].makeBasis(Q,I,U).setPosition(d);const x=a*12,W=e.joints;W[x]=i.x,W[x+1]=i.y,W[x+2]=i.z,W[x+3]=e.k1[a].x,W[x+4]=e.k1[a].y,W[x+5]=e.k1[a].z,W[x+6]=e.k2[a].x,W[x+7]=e.k2[a].y,W[x+8]=e.k2[a].z,W[x+9]=d.x,W[x+10]=d.y,W[x+11]=d.z}e.hoodYaw=n.hoodYaw||0,pe.makeTranslation(0,k.hoodY,0).multiply(ue.makeRotationY(e.hoodYaw)).multiply(ue.makeRotationX(n.hoodTip||0)),e.mats[A.hood].multiplyMatrices(e.mats[A.body],pe);const b=n.raise||0,v=k.shoulder,f=K.copy(h).addScaledVector(p,v[0]).addScaledVector(m,v[1]).addScaledVector(w,v[2]),S=O.copy(h).addScaledVector(p,.9).addScaledVector(m,-2.4).addScaledVector(w,7),V=Ve.copy(w).addScaledVector(Y,-.16).normalize();b>0&&n.aim&&(oe.copy(f).addScaledVector(n.aim,8.1),oe.y+=1.2,S.lerp(oe,b),V.lerp(n.aim,b).normalize()),n.slack&&(S.copy(h).addScaledVector(p,1.5).addScaledVector(w,4),S.y-=8.7,V.set(0,-1,0).addScaledVector(w,.22).addScaledVector(p,.3).normalize());const F=k.armL[0],j=k.armL[1];R.subVectors(S,f);const T=te(R.length(),1,(F+j)*.995);R.normalize();const B=e.wrist.copy(f).addScaledVector(R,T),L=(F*F-j*j+T*T)/(2*T),o=Math.sqrt(Math.max(F*F-L*L,0));G.set(0,-1,0).addScaledVector(p,.25).addScaledVector(R,-(-R.y+.25*p.dot(R))),G.normalize();const r=oe.copy(f).addScaledVector(R,L).addScaledVector(G,o);se.crossVectors(R,G).normalize();const u=Ae.copy(se);ae(e.mats[A.arm],f,r,F,u),ae(e.mats[A.arm+1],r,B,j,u),U.copy(V),Q.crossVectors(Y,U).normalize(),I.crossVectors(U,Q).normalize(),e.mats[A.cas].makeBasis(Q,I,U).setPosition(B);for(let a=0;a<k.ropes.length;a++){const g=k.ropes[a],i=g[1]*J;e.anchors[a].copy(h).addScaledVector(p,Math.sin(i)*g[0]).addScaledVector(m,-1.75).addScaledVector(w,Math.cos(i)*g[0])}}const Ae=new l.Vector3,E=[new l.Vector3,new l.Vector3,new l.Vector3],le=[0,0,0],Fe=[-1,1,0];function ye(t,e,s,c,n={}){const h=t.stride,w=Math.floor(3*s+1e-7),p=te(3*s-w,0,1),m=(w%3+3)%3;e.g=s,e.sig=p,e.w=c,e.jsw=m;const b=Me(p-.11+.5)-.5,v=Math.exp(-Math.pow(b/(b<0?.085:.25),2)),f=Math.sin(Math.PI*p),S=f*f,V=t.phi+s*h-.55*c*Math.sin(6.2832*p+.5),F=t.H0-c*(t.dip*v-.35*S),j=c*t.yawAmp*Fe[m]*S,T=Math.cos(j),B=Math.sin(j);e.front.copy(t.F).multiplyScalar(T).addScaledVector(t.Lw,B),e.left.copy(t.Lw).multiplyScalar(T).addScaledVector(t.F,-B),e.up.copy(Y);const L=k.hips[m],o=Math.hypot(L[0],L[2]);K.copy(e.left).multiplyScalar(L[0]/o).addScaledVector(e.front,L[2]/o),O.crossVectors(Y,K).normalize();const r=c*t.tilt*(.4*f+.6*S);e.front.applyAxisAngle(O,r),e.left.applyAxisAngle(O,r),e.up.applyAxisAngle(O,r);const u=c*1.4*J*v;O.copy(e.left),e.front.applyAxisAngle(O,u),e.up.applyAxisAngle(O,u),e.body.copy(t.O).addScaledVector(t.F,V),e.body.y+=F;for(let a=0;a<3;a++){const g=s-a/3,i=Math.floor(g+1e-7),d=g-i,y=W=>t.phi+(W+a/3+2/3)*h+t.fa[a];let M,N=t.lat[a],z=0,x=-1;if(d>=1/3-1e-7)M=y(i);else{x=te(3*d,0,1),M=he(y(i-1),y(i),ne(.05,.95,x));const W=Math.sin(Math.PI*x);z=c*t.lift*Math.pow(W,.6),N*=1+.07*c*W}e.q[a]=x,E[a].copy(t.O).addScaledVector(t.F,M).addScaledVector(t.Lw,N),E[a].y+=z+t.sink,e.sole[a].copy(E[a]),le[a]=x<0?0:c*.42*Math.sin(6.2832*x)*(x<.5?1:.55)}return we(t,e,E,le,n),e}function ce(t,e,s,c){const n=t.phi+(s+e/3+.6666666666666666)*t.stride+t.fa[e];return c.copy(t.O).addScaledVector(t.F,n).addScaledVector(t.Lw,t.lat[e]),c.y+=t.sink,c}function Le(t,e,s,c,n={}){e.g=0,e.sig=0,e.w=0,e.jsw=0,e.front.copy(t.F),e.left.copy(t.Lw),e.up.copy(Y),e.body.copy(c),n.roll&&(O.copy(t.F),e.left.applyAxisAngle(O,n.roll),e.up.applyAxisAngle(O,n.roll)),n.pitch&&(O.copy(e.left),e.front.applyAxisAngle(O,n.pitch),e.up.applyAxisAngle(O,n.pitch));for(let h=0;h<3;h++)E[h].copy(s[h]),e.sole[h].copy(s[h]),le[h]=0,e.q[h]=-1;return we(t,e,E,le,n),e}function Pe(t={}){const e=new l.Vector3(t.dir?t.dir[0]:0,0,t.dir?t.dir[1]:1).normalize();return{O:new l.Vector3(...t.origin||[0,0,0]),F:e,Lw:new l.Vector3().crossVectors(Y,e).normalize(),phi:t.phi??0,stride:t.stride??k.stride,lat:t.lat||k.lat,fa:t.fa||k.fa,L:t.L||k.L,H0:t.H0??k.H0,dip:t.dip??k.dip,tilt:t.tilt??k.tilt,yawAmp:t.yaw??k.yaw,lift:t.lift??k.lift,sink:t.sink??-.18,fold:t.fold||k.fold,pole:t.pole||[-1,-.2]}}function We(t,e=0){const c=t/3.7+e,n=Math.floor(c),h=c-n,w=p=>{const m=Math.sin(p*127.1+311.7)*43758.5453;return(m-Math.floor(m))*2-1};return he(w(n-1),w(n),ne(0,.42,h))*55*J}const Ne=`
${ee}
uniform mat4 uPart[${A.count}];
attribute vec4 aE; attribute vec3 aAxis;
varying vec3 vW, vN; varying vec4 vE;
void main(){
  mat4 M = uPart[int(aE.x + 0.5)];
  vec4 wp = modelMatrix*(M*vec4(position, 1.0));
  float al = length(aAxis);
  if (al > 1e-4) {                                   // thin rods keep a pixel and a half of width at any distance
    float k = max(1.0, 0.8*uPx*length(wp.xyz - cameraPosition)/al);
    wp = modelMatrix*(M*vec4(position + aAxis*(k - 1.0), 1.0));
  }
  vN = mat3(modelMatrix)*(mat3(M)*normal);
  vW = wp.xyz; vE = aE;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,je=`
uniform vec4 uWeedOn;      // x: where the red gives way to white (m above the ground), y: top of the growth, z: ground y, w: amount
uniform float uDim;        // 1 near; far engines sink a little into the haze
vec3 rwMetal(vec3 n, vec3 v, vec3 wpos, float mat, vec2 st, float part){
  float dist = length(cameraPosition - wpos), fp = uPx*dist;
  vec3 alb = vec3(0.105, 0.11, 0.12), f0 = vec3(0.60, 0.61, 0.65); float rough = 0.2;
  if (mat > 5.5) {            // the woven body of the basket: strips of white metal, each rising over a rib and under the next
    float row = floor(st.y/0.5), bx = fract(st.x/0.62 + 0.5*mod(row, 2.0)), by = fract(st.y/0.5);
    float over = sin(3.14159*bx), gap = (1.0 - smoothstep(0.03, 0.09 + fp*2.0, min(by, 1.0 - by)))*(1.0 - smoothstep(0.1, 0.5, fp));
    alb = vec3(0.42, 0.41, 0.39)*(0.6 + 0.4*over)*(1.0 - 0.8*gap); f0 = vec3(0.6, 0.59, 0.56)*(0.45 + 0.55*over)*(1.0 - 0.9*gap); rough = 0.4;
  }
  else if (mat > 4.5) { alb = vec3(0.07, 0.064, 0.058); f0 = vec3(0.06); rough = 0.85; }
  else if (mat > 3.5) { alb = vec3(0.03); f0 = vec3(0.5, 0.5, 0.52); rough = 0.3; }
  else if (mat > 2.5) {       // the hollow of the hood: dull brass at the lip, darker with every metre inward
    float lip = smoothstep(1.6, 4.9, st.y);
    alb = vec3(0.19, 0.105, 0.03)*(0.03 + 0.4*lip*lip); f0 = vec3(0.05, 0.03, 0.012)*lip; rough = 1.0;
  }
  else if (mat > 1.5) { alb = vec3(0.42, 0.41, 0.39); f0 = vec3(0.62, 0.61, 0.58); rough = 0.4; }
  else if (mat > 0.5) { alb = vec3(0.21, 0.115, 0.032); f0 = vec3(0.95, 0.63, 0.25); rough = 0.22; }
  float plated = 1.0 - step(1.5, mat);
  float near = 1.0 - smoothstep(0.03, 0.14, fp);
  float bs = abs(fract(st.x/2.2 + 0.5) - 0.5)*2.2, bt = abs(fract(st.y/1.7 + 0.5) - 0.5)*1.7;
  float seam = max(1.0 - smoothstep(0.02, 0.05 + fp, bs), 1.0 - smoothstep(0.02, 0.05 + fp, bt))*plated*(1.0 - smoothstep(0.12, 0.5, fp));
  vec2 rc = vec2(fract(st.x/0.38) - 0.5, (abs(bt) - 0.16)/0.38);
  float riv = (1.0 - smoothstep(0.12, 0.24, length(rc)))*near*plated;
  alb *= 1.0 - 0.5*seam;
  vec3 r = reflect(-v, n);
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  vec3 rr = normalize(mix(r, n, rough*0.5) + vec3(0.0, 1e-4, 0.0));
  vec3 env = rwSky(rr);
  env = mix(env, vec3(0.05, 0.013, 0.022) + 0.35*uSkyGnd, (1.0 - smoothstep(-0.4, 0.02, rr.y))*0.8);       // under the horizon the metal mirrors the red swamp
  float om = 1.0 - ndv, om2 = om*om;
  vec3 F = f0 + (1.0 - f0)*om2*om2*om;
  vec3 col = alb*(uKeyCol*clamp(dot(n, uKeyDir)*0.75 + 0.25, 0.0, 1.0) + rwAmb(n)) + env*F*(1.0 - 0.35*seam + 0.5*riv);
  // the afterglow and the burning wood as two wide lights: a sheen that runs down the limbs, and small facets
  // that flash as the machine moves (plates are never quite true)
  float shine = step(mat, 2.5) + step(5.5, mat);
  vec3 gl = normalize(vec3(uGlow.x, 0.07, uGlow.z)), fd = normalize(uFire.xyz - wpos);
  float g1 = clamp(dot(r, gl), 0.0, 1.0), g2 = g1*g1, g4 = g2*g2, g16 = g4*g4*g4*g4;
  float h1 = clamp(dot(r, fd), 0.0, 1.0), h2 = h1*h1, h4 = h2*h2;
  float cell = rwH3(floor(wpos*2.3) + floor(n*3.0 + 0.5)), facet = (1.0 - smoothstep(0.12, 0.5, fp));
  float gli = step(0.84, cell)*g4*g4*facet, hli = step(0.9, 1.0 - cell)*h4*h4*facet;
  col += f0*uSkyAmber*(0.34*g4 + 0.5*g16*g16 + 1.7*gli)*shine;
  col += f0*uFireCol*uFire.w*(0.4*h4*h2 + 1.3*hli)*shine;
  // form light, never none: the dusk sky's cool from above, the red of weed and water from below, a warm rim
  // from the fires' side (no part of the machine is without shape, however near)
  float upF = 0.5 + 0.5*n.y, rimF = 1.0 - clamp(dot(n, v), 0.0, 1.0);
  col += (0.6*uMistCol + 0.4*uSkyLow)*0.2*upF*upF + uWeedA*0.16*(1.0 - upF)*(1.0 - upF)
    + uFireCol*uFire.w*0.14*rimF*rimF*clamp(0.3 + 0.7*dot(n, fd), 0.0, 1.0);
  // the weed that has climbed the legs: red below, bleached above
  float leg = step(1.5, part)*step(part, 13.5);
  if (uWeedOn.w*leg > 0.001) {
    float hgt = wpos.y - uWeedOn.z, wn = rwN3(wpos*0.5) + 0.5*rwN3(wpos*1.9 + 7.0);
    float wm = uWeedOn.w*(1.0 - smoothstep(uWeedOn.y - 4.5, uWeedOn.y, hgt + (wn - 0.75)*4.0));
    float lump = rwN3(wpos*3.1);
    wm *= smoothstep(0.25, 0.6, wn*0.6 + 0.5*lump + 0.35*(1.0 - smoothstep(0.0, uWeedOn.y, hgt)));
    float sick = smoothstep(uWeedOn.x - 2.5, uWeedOn.x + 1.5, hgt + (wn - 0.75)*3.0);
    vec3 wnrm = normalize(n + 0.7*(vec3(rwN3(wpos*2.7 + 3.0), rwN3(wpos*2.7 + 11.0), rwN3(wpos*2.7 + 19.0)) - 0.5));
    col = mix(col, rwWeed(wnrm, v, 0.35 + 0.4*lump, sick, 0.55 + 0.45*lump), clamp(wm, 0.0, 1.0));
  }
  return col*uDim;
}`,ge=`
${ee}
${je}
varying vec3 vW, vN; varying vec4 vE;
void main(){
  vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0)), v = normalize(cameraPosition - vW);
  vec3 col = rwMetal(n, v, vW, vE.y, vE.zw, vE.x);
  gl_FragColor = vec4(rwAir(col, vW, cameraPosition), 1.0);
}`,Te=`
${ee}
uniform vec3 uAnchor[6]; uniform float uRopeL[6], uLag; uniform vec4 uSwing; uniform vec3 uDirF, uDirL;
attribute vec4 aR;
varying vec3 vW, vN; varying vec4 vE;
void main(){
  int ri = int(aR.x + 0.5); float t = aR.y, L = uRopeL[ri], lag = aR.x*1.37 + uLag;
  float k = t*sqrt(t);
  float a1 = sin(6.2832*uSwing.x - 1.2 - 2.4*t - 0.5*lag), a2 = sin(6.2832*uSwing.y - 0.7 - 1.7*t + lag);
  vec3 off = uDirF*(a1*1.9*uSwing.z + 0.32*sin(uTime*0.71 + lag*3.0 + 2.0*t)) + uDirL*(a2*1.3*uSwing.z + 0.3*cos(uTime*0.53 + lag*5.1 + 1.7*t));
  vec3 c = uAnchor[ri] + vec3(0.0, -1.0, 0.0)*t*L + off*k*L*0.17;
  c.y += 0.12*L*k*k*(0.35 + 0.65*abs(a1))*(0.4 + 0.6*uSwing.z);                 // the free end curls up as it swings
  float rad = 0.105*(1.0 + aR.w*0.6)*(1.0 - 0.25*t);
  rad = max(rad, 0.8*uPx*length(c - cameraPosition));
  vec3 rn = vec3(cos(aR.z), 0.0, sin(aR.z));
  vec4 wp = modelMatrix*vec4(c + rn*rad, 1.0);
  vN = rn; vW = wp.xyz; vE = vec4(20.0, 0.0, aR.z*0.1, t*L);
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,_e=`
${ee}
uniform vec4 uFall[3];      // where each foot last came down, and how long ago (s; negative: never)
uniform vec4 uKn[6];        // where each knuckle was when its leg took the load, and how long ago
uniform vec4 uPour[6];      // the lifted pad at six moments of its swing: xyz, seconds since
uniform float uWalk; uniform vec3 uDrift;
attribute vec4 aF;
varying vec2 vUv; varying vec4 vCol; varying vec3 vW; varying vec2 vRag;
void main(){
  float kind = aF.x, s1 = aF.z, s2 = aF.w; int ow = int(aF.y + 0.5);
  vec3 p = vec3(0.0); float size = 0.0, al = 0.0; vec3 col = vec3(0.0); float stretch = 1.0, rag = 0.0;
  vec3 pale = uMistCol*1.25 + 0.2*rwAmb(vec3(0.0, 1.0, 0.0));
  float th = s1*6.2832;
  if (kind < 0.5) {
    vec4 f = uFall[ow]; float t = max(f.w, 0.0);
    float vh = 1.5 + 5.0*s2, vv = 7.0 + 4.6*fract(s2*7.31);
    p = f.xyz + vec3(cos(th), 0.0, sin(th))*(1.3 + vh*t) + vec3(0.0, vv*t - 4.9*t*t, 0.0);
    size = 0.11 + 0.26*t + 0.1*fract(s2*11.3); stretch = 1.5 + 1.2*(1.0 - smoothstep(0.3, 1.2, t));
    al = step(0.0, f.w)*smoothstep(0.0, 0.07, t)*(1.0 - smoothstep(0.9, 2.1, t))*smoothstep(-0.6, 0.3, p.y - f.y)*0.6;
    col = mix(pale*1.05, uWeedA, step(0.6, fract(s2*3.7)));
  } else if (kind < 1.5) {
    vec4 f = uFall[ow]; float t = max(f.w, 0.0);
    p = f.xyz + vec3(cos(th), 0.0, sin(th))*(0.6 + 1.3*t)*(0.4 + 1.6*s2) + vec3(0.6*t, 0.4 + 2.4*t*(0.5 + s2)/(1.0 + 0.25*t), 0.3*t);
    size = 2.3 + 2.1*t;
    al = step(0.0, f.w)*smoothstep(0.0, 0.3, t)*(1.0 - smoothstep(1.6, 4.6, t))*0.085;
    col = pale*0.8;
  } else if (kind < 2.5) {
    // a puff of green smoke squirted from a joint as its leg takes the load: thrown out fast, then it hangs and
    // is left behind on the air, ragged, green for a moment, then grey, then gone. It is smoke: the evening
    // lights it, it gives no light
    vec4 f = uKn[ow]; float t = max(f.w, 0.0);
    vec3 dir = normalize(vec3(cos(th), 0.1 + 0.6*s2, sin(th)));
    float thrown = 1.0 - exp(-t*3.4);
    p = f.xyz + dir*(0.8 + 2.7*thrown)*(0.4 + 0.8*fract(s2*5.7)) + uDrift*(1.6*t) + vec3(0.0, 0.45*t, 0.0);
    size = (0.26 + 0.42*fract(s2*9.7))*(1.0 + 1.5*thrown + 0.35*t);
    float fresh = 1.0 - smoothstep(0.2, 1.25, t);
    al = step(0.0, f.w)*smoothstep(0.0, 0.05, t)*(1.0 - smoothstep(0.9, 2.3, t))*0.5;
    col = mix(vec3(0.3, 0.31, 0.33), vec3(0.15, 0.4, 0.21), fresh)*(rwAmb(vec3(0.0, 1.0, 0.0)) + 0.5*uKeyCol)*1.05; rag = 1.0;
  } else {
    vec4 f = uPour[int(s1*5.999)]; float t = f.w;
    float tt = max(t, 0.0)*(0.75 + 0.5*s2);
    p = f.xyz + vec3(cos(th*7.0), 0.0, sin(th*7.0))*1.0*fract(s2*5.3) + vec3(0.0, -0.9 - 4.9*tt*tt, 0.0);
    size = 0.1; stretch = 6.0 + 8.0*tt;
    al = step(0.0, t)*uWalk*(1.0 - smoothstep(0.7, 1.5, t))*0.6*step(0.0, p.y);
    col = pale;
  }
  vec4 mv = viewMatrix*vec4(p, 1.0);
  mv.xy += position.xy*size*vec2(1.0, stretch);
  vUv = position.xy; vCol = vec4(col, al); vRag = vec2(rag, s1); vW = p;
  if (al < 0.003) mv = vec4(0.0, 0.0, 1e4, 1.0);
  gl_Position = projectionMatrix*mv;
}`,Re=`
${ee}
varying vec2 vUv; varying vec4 vCol; varying vec3 vW; varying vec2 vRag;
void main(){
  float r = length(vUv), a = vCol.a*(1.0 - smoothstep(0.25, 1.0, r));
  if (vRag.x > 0.5) {                               // smoke: a torn edge, no round disc
    float n = rwN(vUv*1.9 + vRag.y*37.0) + 0.5*rwN(vUv*4.3 - vRag.y*11.0);
    a = vCol.a*smoothstep(0.55, 1.05, n + 0.75*(1.0 - r))*(1.0 - smoothstep(0.7, 1.0, r));
  }
  vec3 col = rwAir(vCol.rgb, vW, cameraPosition);
  gl_FragColor = vec4(col*a, a);
}`;function Oe(t){const e=[],s=[],c=[];let n=0;const h=(p,m)=>{const b=t(),v=t();for(const f of[[-1,-1],[1,-1],[1,1],[-1,1]])e.push(f[0],f[1],0),s.push(p,m,b,v);c.push(n,n+1,n+2,n,n+2,n+3),n+=4};for(let p=0;p<3;p++){for(let m=0;m<40;m++)h(0,p);for(let m=0;m<14;m++)h(1,p)}for(let p=0;p<6;p++)for(let m=0;m<9;m++)h(2,p);for(let p=0;p<54;p++)h(3,0);const w=new l.BufferGeometry;return w.setAttribute("position",new l.Float32BufferAttribute(e,3)),w.setAttribute("aF",new l.Float32BufferAttribute(s,4)),w.setIndex(c),w.boundingSphere=new l.Sphere(new l.Vector3(0,0,0),1e5),w}function Be(t,e){const s=fe(),c=Se(),n=t.core.makeRng(t.core.hashSeed("red-weed-fx:"+t.seed)),h=t.core.makeRng(t.core.hashSeed("red-weed-ropes:"+t.seed))()*6.2832,w=Oe(n),p={},m=v=>{if(!v)return s;const f=v.join(" ");return p[f]||(p[f]=fe(v)),p[f]};function b(v={}){const f=Pe(v),S=me(),V=me();f.cycleT=v.cycleT??5.4,f.gStart=v.gStart??-1e9;const F=ie(e,{uPart:{value:S.mats},uWeedOn:{value:new l.Vector4(...v.weed||[0,0,0,0])},uDim:{value:v.dim??1}}),j=new l.Mesh(m(v.L).geometry,new l.ShaderMaterial({uniforms:F,vertexShader:Ne,fragmentShader:ge}));j.frustumCulled=!1,j.matrixAutoUpdate=!1;const T=ie(e,{uAnchor:{value:S.anchors},uRopeL:{value:k.ropes.map(i=>i[2])},uLag:{value:h},uSwing:{value:new l.Vector4(0,0,0,0)},uDirF:{value:f.F},uDirL:{value:f.Lw},uWeedOn:{value:new l.Vector4(0,0,0,0)},uDim:F.uDim}),B=new l.Mesh(c.geometry,new l.ShaderMaterial({uniforms:T,vertexShader:Te,fragmentShader:ge}));B.frustumCulled=!1,B.matrixAutoUpdate=!1;const L=new l.Group;L.add(j,B);let o=null,r=null;v.fx&&(r=ie(e,{uFall:{value:[0,1,2].map(()=>new l.Vector4(0,0,0,-1))},uKn:{value:[0,1,2,3,4,5].map(()=>new l.Vector4(0,0,0,-1))},uPour:{value:[0,1,2,3,4,5].map(()=>new l.Vector4(0,0,0,-1))},uWalk:{value:0},uDrift:{value:new l.Vector3(...v.drift||[.6,0,.3])}}),o=new l.Mesh(w,new l.ShaderMaterial({uniforms:r,vertexShader:_e,fragmentShader:Re,transparent:!0,depthWrite:!1,blending:l.CustomBlending,blendSrc:l.OneFactor,blendDst:l.OneMinusSrcAlphaFactor,blendSrcAlpha:l.OneFactor,blendDstAlpha:l.OneMinusSrcAlphaFactor})),o.frustumCulled=!1,o.matrixAutoUpdate=!1,o.renderOrder=6,L.add(o));const u=new Float32Array(32).fill(-1),a=new l.Vector3;return{object:L,mesh:j,ropes:B,fx:o,E:f,state:S,uniforms:F,events:u,joints:S.joints,triangles:s.triangles+c.triangles,walk(i,d,y){ye(f,S,i,d,y),T.uSwing.value.set(S.sig,i,d,0);const M=f.cycleT,N=Math.floor(3*i+1e-7);for(let z=0;z<8;z++){const x=N-z,W=x/3,Z=((x-1)%3+3)%3,P=Math.floor((x-1)/3+1e-7);if(W<f.gStart+1e-6){u[z*4+2]=-1;continue}ce(f,Z,P,a),u[z*4]=a.x,u[z*4+1]=a.z,u[z*4+2]=(i-W)*M,u[z*4+3]=1}if(r){r.uWalk.value=d;for(let P=0;P<3;P++){const C=i-P/3,q=Math.floor(C+1e-7),H=C-q,$=H>=1/3-1e-7,X=$?q+P/3+1/3:q-1+P/3+1/3,re=(i-X)*M,de=X>f.gStart+1e-6;ce(f,P,$?q:q-1,a),r.uFall.value[P].set(a.x,a.y+.2,a.z,de?re:-1),de&&re<4?(ye(f,V,X+.012,1,{}),r.uKn.value[P*2].set(V.k1[P].x,V.k1[P].y,V.k1[P].z,re),r.uKn.value[P*2+1].set(V.k2[P].x,V.k2[P].y,V.k2[P].z,re+.12)):(r.uKn.value[P*2].w=-1,r.uKn.value[P*2+1].w=-1)}const z=S.jsw,x=S.q[z],W=i-z/3,Z=Math.floor(W+1e-7);for(let P=0;P<6;P++){const C=.04+.11*P,q=r.uPour.value[P];if(x<0||x<C){q.w=-1;continue}const H=Math.sin(Math.PI*C),$=f.phi+(Z-1+z/3+2/3)*f.stride+f.fa[z],X=$+f.stride*ne(.05,.95,C);a.copy(f.O).addScaledVector(f.F,X).addScaledVector(f.Lw,f.lat[z]*(1+.07*d*H)),a.y+=d*f.lift*Math.pow(H,.6)+f.sink+k.ankle,q.set(a.x,a.y,a.z,(x-C)*M/3)}}},still(i,d,y){Le(f,S,i,d,y),T.uSwing.value.set(0,0,0,0)}}}return{make:b,triangles:s.triangles+c.triangles}}async function De(t,e={}){const s=e.shared||xe(e.sky||{}),c=s.U,n=e.kit||Be(t,c);await t.yield();const h=n.make({origin:[0,0,0],dir:[0,1],fx:!0,gStart:-1e9,...e.engine||{}}),w=new l.Group;w.add(h.object);const p=new l.RingGeometry(1.5,1.75,28).rotateX(-Math.PI/2),m=new l.MeshBasicMaterial({color:"#d8cdbf"}),b=[];for(let j=0;j<6;j++){const T=new l.Mesh(p,m);T.position.y=.05,w.add(T),b.push(T)}const v=new l.Vector2,f=e.speed??5.4,S=new l.Vector3,V=h.E;function F(j,T,B){c.uTime.value=T;const L=T*f/V.stride;V.O.copy(V.F).multiplyScalar(-(V.phi+L*V.stride)),h.walk(L,1,{hoodYaw:We(T,.3),raise:ne(.55,.75,Math.sin(T*.21)),aim:S.set(.5,.05,.86).normalize()});for(let o=0;o<3;o++){const r=Math.floor(L-o/3+1e-7);ce(V,o,r,b[o*2].position),ce(V,o,r-1,b[o*2+1].position),b[o*2].position.y=.06,b[o*2+1].position.y=.06}}return F(0,0,null),{object:w,radius:21,height:36,center:new l.Vector3(0,17,0),anchors:{hood:new l.Vector3(0,k.H0+k.hoodY+2.5,0)},update:F,kit:n,engine:h,shared:s,ground:!0,groundY:0}}export{A as PART,k as SZ,De as buildHero,We as hoodLook,Be as makeEngineKit,Pe as makeFrame,me as makeState,ce as plantPoint,Le as poseStill,ye as poseWalk};
