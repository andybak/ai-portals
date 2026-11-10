import*as k from"three";const Yo=["#5A3A22","#4F5B3C","#FFC76B","#F3EEDF","#D8622A","#2E6B4C","#494A6E"],Vo=3.2,wo=78;function Fo(e){const t=e*3,o={pos:new Float32Array(t*3),nrm:new Float32Array(t*3),col:new Float32Array(t*3),uv:new Float32Array(t*2),mat:new Float32Array(t),sway:new Float32Array(t),count:0,max:t,tx:0,ty:0,tz:0,c:1,s:0,sc:1};return o.setT=(a,l,f,r=0,p=1)=>{o.tx=a,o.ty=l,o.tz=f,o.c=Math.cos(r),o.s=Math.sin(r),o.sc=p},o.resetT=()=>o.setT(0,0,0,0,1),o}const uo=[0,0,0],ho=[0,0,0],mo=[0,0,0];function To(e,t,o){const a=t[0]*e.sc,l=t[1]*e.sc,f=t[2]*e.sc;o[0]=a*e.c+f*e.s+e.tx,o[1]=l+e.ty,o[2]=-a*e.s+f*e.c+e.tz}function oo(e,t,o,a,l,f,r,p,s,y,v,F=0,c=0,b=0){if(e.count+3>e.max)return;To(e,t,uo),To(e,o,ho),To(e,a,mo);const d=ho[0]-uo[0],w=ho[1]-uo[1],h=ho[2]-uo[2],z=mo[0]-uo[0],N=mo[1]-uo[1],D=mo[2]-uo[2];let _=w*D-h*N,M=h*z-d*D,W=d*N-w*z;const T=Math.hypot(_,M,W);if(T<1e-9)return;_/=T,M/=T,W/=T;const P=e.count,O=e.pos,L=e.nrm,u=e.col,g=e.uv;O[P*3]=uo[0],O[P*3+1]=uo[1],O[P*3+2]=uo[2],O[P*3+3]=ho[0],O[P*3+4]=ho[1],O[P*3+5]=ho[2],O[P*3+6]=mo[0],O[P*3+7]=mo[1],O[P*3+8]=mo[2];for(let S=0;S<3;S++)L[(P+S)*3]=_,L[(P+S)*3+1]=M,L[(P+S)*3+2]=W,e.mat[P+S]=p;u[P*3]=l[0],u[P*3+1]=l[1],u[P*3+2]=l[2],u[P*3+3]=f[0],u[P*3+4]=f[1],u[P*3+5]=f[2],u[P*3+6]=r[0],u[P*3+7]=r[1],u[P*3+8]=r[2],s&&(g[P*2]=s[0],g[P*2+1]=s[1],g[P*2+2]=y[0],g[P*2+3]=y[1],g[P*2+4]=v[0],g[P*2+5]=v[1]),e.sway[P]=F,e.sway[P+1]=c,e.sway[P+2]=b,e.count+=3}function co(e,t,o,a,l,f,r,p,s,y,v,F,c,b,d){oo(e,t,o,a,p||f,s||f,y||f,r,F,c,b),oo(e,t,a,l,p||f,y||f,v||f,r,F,b,d)}const Q=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],ao=(e,t,o)=>[e[0]+(t[0]-e[0])*o,e[1]+(t[1]-e[1])*o,e[2]+(t[2]-e[2])*o];function x(e,t,o,a,l,f,r,p,s,y={}){const v=y.tx??y.taper??1,F=y.tz??y.taper??1,c=y.ox||0,b=y.oz||0,d=l/2,w=r/2,h=o+f,z=d*v,N=w*F,D=Q(p,y.ao??.78),_=p,M=[[t-d,o,a+w],[t+d,o,a+w],[t+d,o,a-w],[t-d,o,a-w]],W=[[t+c-z,h,a+b+N],[t+c+z,h,a+b+N],[t+c+z,h,a+b-N],[t+c-z,h,a+b-N]];for(let T=0;T<4;T++){const P=(T+1)%4;co(e,M[T],M[P],W[P],W[T],p,s,D,D,_,_)}y.noTop||co(e,W[0],W[1],W[2],W[3],_,y.topMat??s),y.bottom&&co(e,M[3],M[2],M[1],M[0],D,s)}function $(e,t,o,a,l,f,r,p,s,y=0,v=0){const F=l/2,c=f/2,b=[t+y,o+r,a+v],d=Q(p,.8),w=[[t-F,o,a+c],[t+F,o,a+c],[t+F,o,a-c],[t-F,o,a-c]];for(let h=0;h<4;h++)oo(e,w[h],w[(h+1)%4],b,d,d,p,s)}function zo(e,t=.52){const o=e*t,a=(e-o)/3,l=[[e,o,0],[e-a,o,1],[e-a,o+a,0],[e-2*a,o+a,1],[e-2*a,o+2*a,0],[o,o+2*a,1],[o,e,0]],f=[];for(let r=0;r<4;r++){const p=Math.round(Math.cos(r*Math.PI/2)),s=Math.round(Math.sin(r*Math.PI/2));for(const y of l)f.push([y[0]*p-y[1]*s,y[0]*s+y[1]*p,y[2]])}return f}function Uo(e,t,o,a,l=.6){let f=null;for(const r of t){const p=zo(r.w,r.a??a);if(f){const s=f.ring,y=p,v=s.length;for(let F=0;F<v;F++){const c=(F+1)%v,b=s[F][2]?l:1,d=s[c][2]?l:1,w=[s[F][0],f.y,s[F][1]],h=[s[c][0],f.y,s[c][1]],z=[y[c][0],r.y,y[c][1]],N=[y[F][0],r.y,y[F][1]];co(e,w,N,z,h,r.c,r.m??o,Q(f.c,f.sh*b),Q(r.c,r.sh*b),Q(r.c,r.sh*d),Q(f.c,f.sh*d))}}f={ring:p,y:r.y,c:r.c,sh:r.sh}}}function fo(e,t,o,a,l,f,r,p,s,y,v,F,c,b,d,w){const h=o[0]-t[0],z=o[1]-t[1],N=o[2]-t[2],D=l[0]-t[0],_=l[1]-t[1],M=l[2]-t[2],W=z*M-N*_,T=N*D-h*M,P=h*_-z*D,O=(t[0]+a[0])/2-f[0],L=(t[1]+a[1])/2-f[1],u=(t[2]+a[2])/2-f[2];W*O+T*L+P*u>=0?co(e,t,o,a,l,r,p,s,y,v,F,c,b,d,w):co(e,t,l,a,o,r,p,s,F,v,y,c,w,d,b)}function Ro(e,t,o,a,l,f,r){const p=o[0]-t[0],s=o[1]-t[1],y=o[2]-t[2],v=a[0]-t[0],F=a[1]-t[1],c=a[2]-t[2],b=s*c-y*F,d=y*v-p*c,w=p*F-s*v,h=(t[0]+o[0]+a[0])/3-l[0],z=(t[1]+o[1]+a[1])/3-l[1],N=(t[2]+o[2]+a[2])/3-l[2];b*h+d*z+w*N>=0?oo(e,t,o,a,f,f,f,r):oo(e,t,a,o,f,f,f,r)}function go(e,t,o,a,l,f,r,p={}){const s=(w,h,z)=>o==="x"?[z,h,w]:[w,h,z];let y=0,v=0;for(const w of t)y+=w[0],v+=w[1];y/=t.length,v/=t.length;const F=s(y,v,(a+l)/2),c=t.length,b=p.capMat??r,d=p.capCol||f;for(let w=0;w<c;w++){const h=t[w],z=t[(w+1)%c],N=Math.abs(z[0]-h[0])>Math.abs(z[1]-h[1])*.6&&(h[1]+z[1])/2>v;fo(e,s(h[0],h[1],a),s(z[0],z[1],a),s(z[0],z[1],l),s(h[0],h[1],l),F,N&&p.topCol?p.topCol:f,N&&p.topMat!=null?p.topMat:r),p.noCaps||(Ro(e,s(y,v,a),s(h[0],h[1],a),s(z[0],z[1],a),F,d,b),Ro(e,s(y,v,l),s(h[0],h[1],l),s(z[0],z[1],l),F,d,b))}}function eo(e,t,o,a,l,f=0,r=1){const p=Math.cos(t.rot),s=Math.sin(t.rot),y=o*t.sc,v=l*t.sc;e.setT(t.x+y*p+v*s,t.y+a*t.sc,t.z-y*s+v*p,t.rot+f,t.sc*r)}const Mo={x:0,y:0,z:0,rot:0,sc:1};function Ho(e,t,o,a){const l=Q(t,.7);x(e,-.27,0,.3,.26,.5,.3,l,a,{ox:.07,ao:.6}),x(e,.27,0,.3,.26,.5,.3,l,a,{ox:-.07,ao:.6}),x(e,0,.44,.27,.74,.56,.42,t,a,{taper:.82,ao:.7}),x(e,0,.98,.3,.34,.3,.32,o,a,{ao:.75}),x(e,-.5,.78,.24,.2,.72,.22,t,a,{ox:-.1,ao:.7}),x(e,.5,.78,.24,.2,.72,.22,t,a,{ox:.1,ao:.7}),$(e,0,1.28,.3,.3,.3,.22,o,a)}function Ko(e,t,o,a){x(e,0,0,0,2.6,.7,2.2,t.stucco,3,{taper:.9}),x(e,-.55,.7,0,.7,1.9,.8,a,0,{taper:.8,ao:.6}),x(e,.55,.7,0,.7,1.9,.8,a,0,{taper:.8,ao:.6}),x(e,0,2.5,0,1.7,.7,1.05,t.gold,2,{taper:.92}),x(e,0,3.15,0,1.5,1.5,.95,o,0,{tx:1.12,tz:1,ao:.7}),x(e,0,4.65,0,1.9,.3,1.1,t.gold,2,{taper:.6}),x(e,-1.02,3.1,.1,.45,1.5,.5,o,0,{ox:-.1,ao:.7}),x(e,1.02,3.1,.25,.45,1.5,.5,o,0,{ox:.1,oz:.2,ao:.7}),x(e,0,4.9,.02,.8,.8,.78,o,0,{taper:.92,ao:.75}),x(e,0,5.7,.02,.86,.22,.84,t.gold,2,{taper:.8}),$(e,0,5.92,.02,.62,.62,1.25,t.gold,2),x(e,0,.7,.72,.3,2.9,.3,t.teak,4,{taper:.6,ao:.6}),x(e,0,.7,.72,.5,.5,.5,t.gold,2,{taper:.7})}function qo(e,t,o,a,l,f=!0){const r=o*.3;x(e,-o*.5,0,r*.5,o*.18,a,r,t.white,0,{ao:.7}),x(e,o*.5,0,r*.5,o*.18,a,r,t.white,0,{ao:.7}),x(e,0,a,r*.5,o*1.36,a*.1,r*1.2,l,0,{ao:.6}),co(e,[-o*.42,0,.04],[o*.42,0,.04],[o*.42,a,.04],[-o*.42,a,.04],t.recess,5),go(e,[[-o*.72,a*1.1],[o*.72,a*1.1],[o*.3,a*1.42],[0,a*1.95],[-o*.3,a*1.42]],"z",r*.35,r*.75,t.white,0,{capCol:l}),go(e,[[-o*.5,a*1.1],[o*.5,a*1.1],[0,a*1.62]],"z",r*.75,r*1,l,0,{capCol:t.ochre}),f&&(x(e,0,0,r*.42,o*.32,a*.56,o*.2,t.gold,2,{taper:.7}),x(e,0,a*.56,r*.42,o*.18,a*.13,o*.16,t.gold,2),$(e,0,a*.69,r*.42,o*.16,o*.14,a*.2,t.gold,2))}function jo(e,t,o,a,l,f,r){const p=r/2,s=l+f;co(e,[-p,o,s],[p,o,s],[p,a,l],[-p,a,l],t.stone,6);for(const y of[-1,1]){const v=y*p,F=y*(p+.6);go(e,[[l-.2,o],[s+.5,o],[s+.5,o+.9],[l+.3,a+.9],[l-.2,a+.9]],"x",Math.min(v,F),Math.max(v,F),t.white,0,{topCol:t.ochre}),x(e,y*(p+.3),o+.9,s+.15,.8,.9,.8,t.green,0,{taper:.6})}}function*Go(e,t,o,a,l){const f=[],r=[],p=[],s=(u,g,S,q=1,G)=>f.push({y:u,w:g,c:S,sh:q,a:G}),y=l.bands;let v=0,F=0;const c=l.main?[[25,4.8],[20.5,6],[16.5,7],[13,7]]:[[14,5],[11.5,6]],b=[];c.forEach(([u,g],S)=>{const q=y[F++%y.length];s(v,u+.7,o.ochreDk,.62),s(v+.55,u+.7,o.ochre,.95),s(v+.55,u+.25,o.white,.8),s(v+1,u,o.white,.9),s(v+g-2.6,u,o.white,1),s(v+g-1.15,u,o.white,.46),s(v+g-1.15,u+.45,q,.5),s(v+g-.5,u+.75,q,1),s(v+g-.5,u+.95,o.white,.85),s(v+g,u+.95,o.white,1),S>=(l.main?1:9)&&r.push({y:v+g-1.15-1.5*.92,w:u,s:.92,sp:2.3-S*.15}),b.push({y0:v,y1:v+g,w:u}),v+=g});const d=9.6,w=12,h=v;s(v,d+1.3,o.ochreDk,.6),s(v+.7,d+1.3,o.ochre,.95),s(v+.7,d+.6,o.green,.75),s(v+1.5,d+.2,o.green,1),s(v+1.5,d,o.white,.85),s(v+w-3.2,d-.15,o.white,1),s(v+w-1.5,d-.15,o.white,.44),s(v+w-1.5,d+.5,y[1],.5),s(v+w-.7,d+.9,y[1],1),s(v+w-.7,d+1.15,o.white,.85),s(v+w,d+1.15,o.white,1),r.push({y:v+w-1.5-1.5*(l.main?1:1.25),w:d-.15,s:l.main?1:1.25,sp:l.main?1.75:3.3}),v+=w;const z=l.tiers,N=l.H-8.6,D=N-v;let _=0;for(let u=0;u<z;u++)_+=Math.pow(.93,u);const M=u=>9.3*Math.pow(Math.cos(u*1.27),.82)*(1+.035*Math.sin(u*3.1));let W=0;for(let u=0;u<z;u++){const g=D*Math.pow(.93,u)/_,S=W/D,q=(W+g)/D,G=M(S),V=M(S+(q-S)*.7),I=.34*(1-S*.45),ro=y[(u+F)%y.length],E=.52+.05*S;s(v,G,o.white,.82,E),s(v+g*.48,(G+V)/2,u%2?o.cream:o.white,1,E),s(v+g*.72,V,o.white,.42,E),s(v+g*.72,V+I,ro,.5,E),s(v+g*.92,V+I*1.9,ro,1,E),s(v+g,V+I*1.9,o.white,1,E),p.push({y0:v,yTop:v+g,w:G,wLip:V+I*1.9,dh:g,t:S}),v+=g,W+=g}const T=M(1);s(v,T*.96,o.white,.7,.6),s(v+1.2,T*1.04,o.white,1,.6),s(v+2.4,T*.86,o.ochre,1,.62),s(v+2.4,T*.62,o.gold,.6,.64),s(v+3.6,T*.5,o.gold,1,.66),s(v+4.6,T*.2,o.gold,1,.7),e.setT(t.x,t.y,t.z,t.rot,t.sc),f.forEach((u,g)=>{u.m=g>=f.length-3?2:0}),Uo(e,f,0,.52,.56);const P=v+4.6;x(e,0,P-.4,0,.5,l.H-P+.4,.5,o.gold,2,{taper:.35});for(let u=0;u<3;u++){const g=P+.5+u*1.05,S=.85-u*.18;for(let q=0;q<4;q++)eo(e,t,0,g,0,q*Math.PI/2),x(e,0,0,S*.5,.16,.16,S,o.gold,2,{noTop:!1}),$(e,0,.1,S,.2,.2,1-u*.15,o.gold,2,0,.12)}yield;const O=[o.green,o.ochre,o.white,o.blue];let L=0;for(const u of r){L++%3===2&&(yield);const g=zo(u.w+.02);for(let S=0;S<g.length;S++){const q=g[S],G=g[(S+1)%g.length],V=G[0]-q[0],I=G[1]-q[1],ro=Math.hypot(V,I),E=Math.max(1,Math.round(ro/u.sp)),vo=Math.atan2(I/ro,-V/ro);for(let to=0;to<E;to++){const so=(to+.5)/E;eo(e,t,q[0]+V*so,u.y,q[1]+I*so,vo,u.s);const lo=O[(S*3+to)%3===0?1:(to+S)%2?0:2];Ho(e,lo,(to+S)%3?o.white:o.ochre,0)}}}yield,p.forEach((u,g)=>{const S=zo(u.w+.05,.52+.05*u.t),q=Math.max(.45,u.dh*.36);for(let G=0;G<S.length;G++){const V=S[G];if(!V[2]){eo(e,t,V[0]*1,u.y0,V[1]*1,0,1);const I=ao(o.white,(G+g)%3===0?o.ochre:(G+g)%3===1?o.green:o.blue,(G+g)%2?.75:.3);$(e,0,0,0,q*.8,q*.8,q*2.3,I,0,V[0]*.02,V[1]*.02)}}if(u.w>3.4)for(let G=0;G<4;G++){const V=Math.min(2,u.w*.26),I=u.dh*.42;eo(e,t,0,u.y0,0,G*Math.PI/2),e.tx+=Math.sin(t.rot+G*Math.PI/2)*u.w*t.sc,e.tz+=Math.cos(t.rot+G*Math.PI/2)*u.w*t.sc,qo(e,o,V,I,l.bands[(g+G)%3],g<4)}}),yield;for(let u=0;u<4;u++){const g=u*Math.PI/2;eo(e,t,Math.sin(g)*(d-.1),h+1.5,Math.cos(g)*(d-.1),g),x(e,0,-1.5,1,5.4,1.5,2.2,o.white,0,{taper:.9}),qo(e,o,3.4,5,o.green,!0),$(e,0,9.4,.5,1.1,1.1,2.6,o.gold,2)}return b.forEach((u,g)=>{const S=u.y1-u.y0;for(let q=0;q<4;q++)eo(e,t,0,0,0,q*Math.PI/2),jo(e,o,u.y0,u.y1,u.w+.95,S*.56,l.main?3.6-g*.3:4.2)}),e.resetT(),{yBody:h,hb:w,wb:d,tiers:p,terraces:b,prof:f}}function Io(e,t,o,a){const{W:l,L:f,tiers:r}=a,p=l+1.9,s=Math.min(3.2,f*.24),y=.62,v=.46*p*1.32,F=v+.3+.34*p*.72,c=F+.3+.36*p*.46-.4,b=[[0,0,.46*p,v],[.42*p,v+.3,.78*p,F],[.74*p,F+.3,1.12*p,c+.4]];eo(e,t,0,0,0);const d=[0,-5,0];for(let w=0;w<r;w++){const h=f+1.6-w*s,z=c+w*y,N=w===r-1,D=w===r-1?0:h-s-1.2;for(const _ of[-1,1])b.forEach((M,W)=>{const T=_*M[0],P=z-M[1],O=_*M[2],L=z-M[3],u=Math.hypot(M[2]-M[0],M[3]-M[1]),g=1-Math.min(.4,.75/u),S=T+(O-T)*g,q=P+(L-P)*g,G=W===0?o.roofA:ao(o.roofA,o.roofA2,.5),V=o.roofB;for(const I of N?[0]:[-1,1]){const ro=N?-h:I*D,E=N?h:I*h,vo=Math.min(ro,E),to=Math.max(ro,E),so=[vo,N||I<0?vo+.9:vo,N||I>0?to-.9:to,to];for(let lo=0;lo<3;lo++){if(so[lo+1]-so[lo]<.01)continue;const xo=lo===1?G:V,J=so[lo],C=so[lo+1];fo(e,[T,P,J],[T,P,C],[S,q,C],[S,q,J],d,xo,1,null,null,null,null,[J,0],[C,0],[C,u*g],[J,u*g]),fo(e,[S,q,J],[S,q,C],[O,L,C],[O,L,J],d,V,1,null,null,null,null,[J,u*g],[C,u*g],[C,u],[J,u])}}});for(const _ of[-1,1]){const M=_*(h-.55),W=.46*p,T=z-v;oo(e,..._>0?[[-W,T,M],[W,T,M],[0,z-.2,M]]:[[W,T,M],[-W,T,M],[0,z-.2,M]],o.pedRed,o.pedRed,o.gold,2);const P=z-c-.2,O=M+_*.035,L=(P+T-.5)/2,u=(T-.5-P)*.36;fo(e,[-W,P,M],[W,P,M],[W,T,M],[-W,T,M],[0,0,0],o.white,0),x(e,0,P-.14,M+_*.1,2*W+.36,.3,.32,o.gold,2),x(e,0,T-.17,M+_*.07,2*W,.2,.18,o.gold,2),fo(e,[-W,T-.5,O],[W,T-.5,O],[W,T-.17,O],[-W,T-.17,O],[0,0,0],o.pedRed,2),fo(e,[-u*1.25,L,O],[0,L-u,O],[u*1.25,L,O],[0,L+u,O],[0,0,0],o.gold,2),fo(e,[-u*.8,L,O+_*.02],[0,L-u*.64,O+_*.02],[u*.8,L,O+_*.02],[0,L+u*.64,O+_*.02],[0,0,0],o.pedRed,2),fo(e,[-u*.36,L,O+_*.04],[0,L-u*.29,O+_*.04],[u*.36,L,O+_*.04],[0,L+u*.29,O+_*.04],[0,0,0],o.gold,2);for(const q of[-1,1])x(e,q*(W-.13),P,M+_*.07,.26,T-P,.18,o.gold,2,{noTop:!0});for(const q of[-1,1]){const G=_>0?h-.15:-h-.3;go(e,[[0,z-.1],[q*W,T-.1],[q*(W+.5),T+.05],[q*(W+.2),T+.75],[q*W*.9,T+.62+.1*v],[0,z+.6]],"z",G,G+.45,o.gold,2),eo(e,t,q*(W+.3),T+.4,_*h),$(e,0,0,0,.42,.42,1.5,o.gold,2,q*.55,0),eo(e,t,q*1.12*p,z-c-.45,_*(h-.4)),$(e,0,0,0,.36,.36,.95,o.gold,2,q*.4,0),eo(e,t,0,0,0)}const g=_*h,S=.8+.2*w;x(e,0,z+.3,g,.36,1.1*S,.42,o.gold,2,{taper:.7,oz:_*.35*S}),$(e,0,z+.3+1.1*S,g+_*.35*S,.26,.3,1.9*S,o.gold,2,0,_*.75*S)}x(e,0,z-.12,0,.5,.42,2*h-.4,o.roofB,1,{taper:.6})}return e.resetT(),c+(r-1)*y}function _o(e,t,o,a){const{W:l,L:f,wallH:r}=a,p=a.plinth??1.4;eo(e,t,0,0,0),a.noPlinth||(x(e,0,0,0,2*l+5.6,p*.5,2*f+4.6,o.stone,3,{taper:.985,topMat:7}),x(e,0,p*.5,0,2*l+4.4,p*.5,2*f+3.4,o.stucco,3,{taper:.985,topMat:7}));const s=a.noPlinth?0:p;if(!a.open){x(e,0,s,0,2*l,r,2*f,o.stucco,3,{noTop:!0,ao:.66}),x(e,0,s,0,2*l+.5,1,2*f+.5,o.ochre,0,{taper:.97});const c=Math.max(3,Math.round(f/2.6));for(const b of[-1,1])for(let d=0;d<c;d++){const w=(d+.5)/c*2*f-f,h=b*(l+.03);fo(e,[h,s+2.2,w-.7],[h,s+2.2,w+.7],[h,s+5.6,w+.7],[h,s+5.6,w-.7],[0,s+3,w],o.pedRed,5),x(e,b*(l+.12),s+5.6,w,.3,.3,2.1,o.gold,2),$(e,b*(l+.12),s+5.9,w,.24,1.7,1.5,o.gold,2),x(e,b*(l+.12),s+1.9,w,.36,.3,2,o.gold,2)}for(const b of[-1,1]){const d=b*(f+.03);fo(e,[-1.3,s,d],[1.3,s,d],[1.3,s+6.2,d],[-1.3,s+6.2,d],[0,s+3,0],o.pedRed,5),x(e,0,s+6.2,b*(f+.15),3.6,.4,.4,o.gold,2),$(e,0,s+6.6,b*(f+.15),3,.3,2.4,o.gold,2);for(const w of[-1,1])x(e,w*1.6,s,b*(f+.15),.45,6.2,.4,o.gold,2)}}const y=l+(a.open?0:1.7),v=Math.max(2,Math.round(f/(a.open?2:2.4)));for(const c of[-1,1])for(let b=0;b<=v;b++){const d=(b/v*2-1)*(f+(a.open?0:1.2));x(e,c*y,s,d,.62,r,.62,o.white,0,{taper:.8,ao:.7,noTop:!0}),x(e,c*y,s,d,.86,.5,.86,o.ochre,0,{taper:.85}),$(e,c*y,s+r-.9,d,1,1,-.8,o.gold,2)}if(a.open){for(const c of[-1,1])for(const b of[-.34,.34])x(e,b*l*2*.5,s,c*f,.55,r,.55,o.white,0,{taper:.8,ao:.7,noTop:!0});for(const c of[-1,1])x(e,c*y,s+.9,0,.16,.14,2*f,o.teak,4);for(const c of[-1,1])for(const b of[-1,1])x(e,b*l*.67,s+.9,c*f,l*.66,.14,.16,o.teak,4)}const F=Io(e,{x:t.x,y:t.y+(s+r)*t.sc,z:t.z,rot:t.rot,sc:t.sc},o,a);return e.resetT(),s+r+F}function Po(e,t,o,a,l,f,r,p,s,y=.12){const v=(t[0]+o[0])/2,F=(t[2]+o[2])/2,c=(t[1]+o[1])/2;for(let b=0;b<l;b++){const d=b/l,w=(b+1)/l,h=-a*d,z=-a*w,N=b===l-1,D=p+(s-p)*d*d,_=p+(s-p)*w*w,M=f(b),W=[t[0],t[1]+h,t[2]],T=[v,c+h,F],P=[o[0],o[1]+h,o[2]],O=[t[0],t[1]+z,t[2]],L=[v,c+z+(N?a*y:0),F],u=[o[0],o[1]+z,o[2]],g=[r,d],S=[r,w];oo(e,W,O,L,M,M,M,0,g,S,S,D,_,_),oo(e,W,L,T,M,M,M,0,g,S,g,D,_,D),oo(e,T,L,u,M,M,M,0,g,S,S,D,_,_),oo(e,T,u,P,M,M,M,0,g,S,g,D,_,D)}}async function Xo(e,t={}){const o=e.rng.fork?e.rng.fork("khlong-hero"):e.rng,a=(t.palette&&t.palette.length>=7?t.palette:Yo).map(n=>new k.Color(n)),l=(n,i=1)=>[n.r*i,n.g*i,n.b*i],f=(n,i=1)=>l(new k.Color(n),i),r={white:l(a[3],.84),cream:ao(l(a[3],.8),l(a[2],.8),.22),ochre:ao(l(a[2],.74),l(a[4],.74),.3),green:l(a[5],.95),blue:ao(l(a[6]),f("#2a55a8"),.6),gold:f("#e2a43a"),teak:l(a[0]),stucco:ao(l(a[3],.74),l(a[1],.7),.1),stone:ao(l(a[3],.66),l(a[0],.8),.16),pedRed:f("#7c211b"),recess:f("#1c1310")};r.ochreDk=Q(r.ochre,.62);const p=o.int(0,2);r.roofA=p===1?l(a[5],1):p===2?f("#a5341f"):l(a[4],.95),r.roofA2=p===1?l(a[1]):l(a[2],.8),r.roofB=p===1?l(a[4],.95):l(a[5],.9);const s=o.shuffle([r.green,r.ochre,r.blue]),y=o.int(8,10),v=o.chance(.7)?f("#f08a1c"):o.chance(.5)?f("#d9402a"):f("#f2c230"),F=o.shuffle([f("#c92f26"),f("#ee8f1c"),f("#efc634"),f("#e0668c"),l(a[3],.85),f("#ee8f1c"),l(a[3],.8),o.chance(.5)?l(a[5],1.1):f("#c92f26")]),c=Fo(15e4),b=Fo(9e3),d=Vo,w=async n=>{let i;for(;!(i=n.next()).done;)await e.yield?.();return i.value},h=Math.max(1,Math.min(1.4,t.prangScale??1)),z=await w(Go(c,{x:0,y:d,z:0,rot:0,sc:h},r,o,{main:!0,H:80-d,tiers:y,bands:s}));await e.yield?.();const N=(28-d)/76.8,D=[[-31,31],[31,31],[-31,-31],[31,-31]],_=o.int(0,1);let M=null;for(const[n,i]of D)M=await w(Go(c,{x:n,y:d,z:i,rot:0,sc:N},r,o,{main:!1,H:76.8,tiers:y-2,bands:[s[1],s[2],s[0]]})),await e.yield?.();await e.yield?.(),c.resetT(),x(c,0,-1.6,9,132,d+1.6,118,r.stucco,3,{topMat:7,ao:.6});for(const n of[-1,1]){x(c,n*40.5,-1.6,73,51,d+1.6,10,r.stucco,3,{topMat:7,ao:.6});for(let i=0;i<9;i++)x(c,n*(17.2+i*6),-1.6,wo+.25,1,d+1.5,.6,r.stucco,3,{tx:.8,tz:.5,ao:.55});x(c,n*41.5,d,wo-.45,49,.85,.5,r.white,0,{ao:.7}),x(c,n*41.5,d+.85,wo-.45,49,.16,.7,r.ochre,0);for(let i=0;i<13;i++){const m=n*(17.6+i*4);x(c,m,d,wo-.45,.8,1.5,.8,r.white,0,{taper:.85}),$(c,m,d+1.5,wo-.45,.9,.9,1.1,i%2?r.green:r.ochre,0)}go(c,[[67.4,-1.6],[80,-1.6],[80,.5],[78.4,.5],[68.6,d+1],[67.4,d+1]],"x",n>0?15:-16,n>0?16:-15,r.white,0,{topCol:r.green}),eo(c,Mo,n*15.5,.5,79.2),x(c,0,0,0,.8,1.5,.9,r.green,0,{taper:.75,oz:.5}),x(c,0,1.5,.5,1,.8,1.1,r.ochre,0,{taper:.7,oz:.3}),$(c,0,2.3,.8,.6,.6,1.6,r.gold,2,0,-.5),c.resetT()}const W=()=>Q(r.stone,o.range(.82,1.12));for(let n=0;n<=16;n++){const i=d-n*.25,m=68.4+n*.6,R=m+.6,B=W();co(c,[-15,i,R],[15,i,R],[15,i,m],[-15,i,m],B,3),co(c,[-15,i-.25,R],[15,i-.25,R],[15,i,R],[-15,i,R],Q(B,.72),3)}co(c,[-15,d,68.4],[15,d,68.4],[15,d,67.9],[-15,d,67.9],r.stone,7);for(const n of[-1,1])for(let i=0;i<5;i++)eo(c,Mo,n*12.5,d,h>1.02?26*h+4.6+i*(63-26*h-4.6)/4:34+i*7.2,0,.9+.2*o()),x(c,0,0,0,2.2,.6,2.2,r.white,0,{taper:.9}),x(c,0,.6,0,1.7,.5,1.7,i%2?r.green:r.ochre,0,{taper:.85}),x(c,0,1.1,0,1.4,1.3,1.4,r.white,0,{taper:.5}),$(c,0,2.4,0,.6,.6,1.9,r.gold,2);const T=[[-20.5,72.5],[20.5,72.5]];T.forEach(([n,i],m)=>{eo(c,Mo,n,d,i,0,1.2),Ko(c,r,m?r.white:r.green,m?r.blue:r.ochre)}),await e.yield?.();const P=[];for(const n of[-1,1]){P.push(_o(c,{x:n*47,y:d,z:30,rot:0,sc:1},r,{W:7,L:16,wallH:8.5,tiers:o.int(3,4)})),c.resetT(),x(c,n*15.5,.95,85.2,10.4,.45,13.2,r.teak,4,{ao:.6,bottom:!0});for(const i of[-4.4,0,4.4])for(const m of[-5.6,-1.9,1.9,5.6])x(c,n*15.5+i,-2.2,85.2+m,.5,3.2,.5,Q(r.teak,.7),4,{ao:.5,noTop:!0});x(c,n*19.2,1.4,79.3,3,.6,1.6,r.stone,3),x(c,n*19.2,2,78.9,3,.6,.8,r.stone,3),_o(c,{x:n*15.5,y:1.4,z:85.2,rot:0,sc:1},r,{W:3.5,L:4.7,wallH:4.5,tiers:3,open:!0,noPlinth:!0}),await e.yield?.()}await e.yield?.(),c.resetT();const O=[];for(const n of[-1,1]){for(let i=0;i<4;i++)O.push({x:n*(24+i*8),z:75.4,y0:d,h:o.range(13,15.5),dir:n,quay:!0});O.push({x:n*11.3,z:93.6,y0:-2.2,h:o.range(12.5,14),dir:n,quay:!1}),O.push({x:n*20.4,z:94.2,y0:-2.2,h:o.range(11,12.5),dir:n,quay:!1})}const L=[];if(O.forEach((n,i)=>{const m=n.y0+n.h;if(x(c,n.x,n.y0,n.z,.36,n.h,.36,r.pedRed,2,{taper:.5,ao:.6}),x(c,n.x,Math.max(n.y0,0)+(n.quay?0:1.2),n.z,.6,.8,.6,n.quay?r.white:r.gold,n.quay?0:2,{taper:.8}),x(c,n.x,m-3.2,n.z,.3,.25,.3,r.gold,2),x(c,n.x,m-.25,n.z,.3,.25,.3,r.gold,2),$(c,n.x,m,n.z,.34,.34,1.3,r.gold,2),x(c,n.x+n.dir*.8,m-.75,n.z,1.9,.14,.14,r.gold,2),L.push(new k.Vector3(n.x,m,n.z)),t.banners===!1)return;const R=F[i%F.length],B=F[(i+2)%F.length],X=F[(i+4)%F.length],j=Math.min(n.h-3.5,o.range(7.5,10.5)),Y=16,U=o(),H=Z=>Z<2||Z>Y-3?R:Math.floor((Z-2)/2)%3===0?B:Math.floor((Z-2)/2)%3===1?X:R;Po(b,[n.x+n.dir*.3,m-.82,n.z+.02],[n.x+n.dir*1.6,m-.82,n.z+.02],j,Y,H,U,.03,1.5)}),t.banners!==!1)for(let n=0;n<O.length-1;n++){const i=O[n],m=O[n+1];if(!i.quay||!m.quay)continue;const R=i.y0+i.h-3.1,B=m.y0+m.h-3.1,X=9;for(let j=0;j<X;j++){const Y=(j+.5)/X,U=2.2*4*Y*(1-Y),H=i.x+(m.x-i.x)*Y,Z=R+(B-R)*Y-U,no=F[(j+n)%F.length],io=[o(),.5];oo(b,[H-.38,Z,i.z],[H,Z-1,i.z],[H+.38,Z,i.z],no,no,no,0,io,io,io,.02,.45,.02)}}const u=(n,i,m,R,B,X,j,Y)=>{const U=zo(B);for(let H=0;H<U.length;H++){const Z=U[H],no=U[(H+1)%U.length],io=Q(v,H%2?.92:1.05),A=[H*.37%1,.5],ko=[n+Z[0]*R,i+X*R,m+Z[1]*R],po=[n+no[0]*R,i+X*R,m+no[1]*R],Do=[n+Z[0]*R,i+j*R,m+Z[1]*R],Oo=[n+no[0]*R,i+j*R,m+no[1]*R];oo(b,ko,Do,Oo,io,io,io,0,A,A,A,Y,Y*.5,Y*.5),oo(b,ko,Oo,po,io,io,io,0,A,A,A,Y,Y*.5,Y)}};u(0,d,0,h,z.wb+.14/h,z.yBody+2.1,z.yBody+4.1,.16);for(const n of[3.3,4.5])Po(b,[n*h,d+(z.yBody+2.6)*h,z.wb*h+.4],[n*h+1,d+(z.yBody+2.6)*h,z.wb*h+.4],o.range(5,7.5)*h,8,()=>v,o(),.05,.8);x(c,4.4*h,d+(z.yBody+2.5)*h,z.wb*h+.3,1.3,1.1,.6,v,3,{taper:.7});{const[n,i]=D[_];u(n,d,i,N,M.wb+.3,M.yBody+2.2,M.yBody+5,.1)}for(const n of[-1,1])for(const i of[-1,1])for(let m=0;m<9;m++){const R=(m+.5)/9,B=n*15.5+i*(.2+2.1*R),X=5.56-.62*4*R*(1-R),j=91.12,Y=m%2?f("#f4f0e2"):f("#f09a14"),U=[(m*.37+(n+i)*.21+1)%1,.5];oo(b,[B-.13,X,j],[B,X-.42,j],[B+.13,X,j],Y,Y,Y,0,U,U,U,.01,.1,.01)}const g=[f("#f08a1c"),f("#e0661a"),f("#f3a52a")];for(const n of[-1,1])for(let i=0;i<3;i++){const m=81.6+i*2.4+o.range(-.3,.3),R=n*19.12,B=g[(i+(n>0?1:0))%3];Po(b,[R,2.4,m],[R,2.4,m+1.5],o.range(.9,1.25),3,()=>B,o(),.01,.22,0)}const S=[];for(const[n,i]of[[-23.2,88.5],[23.2,88.5],[-23.8,82.6],[23.8,82.6]]){const m=o.range(4.4,5.4);x(c,n,-2.2,i,.44,m,.44,Q(r.teak,.85),4,{taper:.8,ox:o.range(-.15,.15),ao:.45}),x(c,n,-2.2+m*.78,i,.5,.5,.5,o.chance(.5)?r.white:f("#b8322a"),3,{taper:.95,noTop:!0}),S.push(new k.Vector3(n,-2.2+m,i))}await e.yield?.();const q=(n,i)=>{const m=new k.BufferGeometry,R=n.count;return m.setAttribute("position",new k.BufferAttribute(n.pos.slice(0,R*3),3)),m.setAttribute("normal",new k.BufferAttribute(n.nrm.slice(0,R*3),3)),m.setAttribute("color",new k.BufferAttribute(n.col.slice(0,R*3),3)),m.setAttribute("uv",new k.BufferAttribute(n.uv.slice(0,R*2),2)),i?m.setAttribute("aSway",new k.BufferAttribute(n.sway.slice(0,R),1)):m.setAttribute("aMat",new k.BufferAttribute(n.mat.slice(0,R),1)),m.computeBoundingSphere(),m.computeBoundingBox(),m},G=new k.Group;G.name="khlong-run-hero";const V=new k.Vector3(-.941,.225,.252).normalize(),I=n=>(Array.isArray(n)?new k.Vector3(n[0],n[1],n[2]):n.clone()).normalize();let ro=!!t.sunDir;const E={uTime:{value:0},uSun:{value:t.sunDir?I(t.sunDir):V.clone()},uSunCol:{value:new k.Color("#ffd28a")},uGlint:{value:1},uWind:{value:1},uTip:{value:1},uF1:{value:new k.Color().fromArray(s[0])},uF2:{value:new k.Color().fromArray(s[1])},uF3:{value:new k.Color().fromArray(s[2])},uCamL:{value:new k.Vector3(0,1.5,300)},uSunL:{value:V.clone()},uLit:{value:new k.Color().fromArray(Q(ao(r.white,l(a[2]),.5),.8))},uShade:{value:new k.Color().fromArray(Q(ao(l(a[6]),r.white,.2),.6))},uRoof:{value:new k.Color().fromArray(Q(ao(r.roofA,r.roofB,.3),.6))},uGold:{value:new k.Color(1.25,.95,.5)},uPS:{value:h},uCol:{value:t.column??.5},uMK:{value:new k.Vector3(.86,.6,1.6)},uFillSky:{value:new k.Color().fromArray(ao(l(a[6],.34),f("#6f8fc4",.3),.5))},uFillGnd:{value:new k.Color().fromArray(ao(l(a[1],.3),l(a[2],.2),.5))}},vo=`
    float kh21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    vec2 kh22(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
    vec3 kh33(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
    float kvn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
      return mix(mix(kh21(i), kh21(i + vec2(1., 0.)), f.x), mix(kh21(i + vec2(0., 1.)), kh21(i + vec2(1., 1.)), f.x), f.y); }
  `,to=new k.MeshStandardMaterial({vertexColors:!0,roughness:.75,metalness:0,side:k.DoubleSide});to.customProgramCacheKey=()=>"khlong-run-porcelain-1",to.onBeforeCompile=n=>{for(const i of["uTime","uSun","uSunCol","uGlint","uF1","uF2","uF3","uFillSky","uFillGnd"])n.uniforms[i]=E[i];n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute float aMat; varying float vMat; varying vec3 vOP; varying vec3 vON; varying vec3 vWP; varying vec3 vWN; varying vec2 vUv2;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vMat = aMat; vOP = position; vON = normal; vUv2 = uv; vWP = (modelMatrix * vec4(position, 1.)).xyz; vWN = mat3(modelMatrix) * normal;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
        varying float vMat; varying vec3 vOP; varying vec3 vON; varying vec3 vWP; varying vec3 vWN; varying vec2 vUv2;
        uniform float uTime, uGlint; uniform vec3 uSun, uSunCol, uF1, uF2, uF3, uFillSky, uFillGnd;
        ${vo}
        float kGlintL(vec2 uv, float s, float fid, vec3 wn, vec3 hv, float spread){
          vec2 c = floor(uv / s); vec3 h = kh33(vec3(c, fid + s * 7.31));
          vec3 n = normalize(wn + (h - .5) * spread + .14 * sin(uTime * 1.1 + h.yzx * 40.) + vec3(0., 1e-4, 0.));
          float sp = max(dot(n, hv), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp = sp * sp * sqrt(sp); // ~^160 with a soft knee
          vec2 f = fract(uv / s) - .5; float dotm = 1. - smoothstep(.2, .5, max(abs(f.x), abs(f.y)));
          return sp * dotm;
        }
        float kGlint(vec2 uv, float fw, float fid, vec3 wn, vec3 hv, float spread){
          float l2 = log2(max(fw * 1.9, .12)), lf = floor(l2), fr = l2 - lf;
          return mix(kGlintL(uv, exp2(lf), fid, wn, hv, spread), kGlintL(uv, exp2(lf + 1.), fid, wn, hv, spread), fr);
        }`).replace("#include <color_fragment>",`#include <color_fragment>
        float mid = floor(vMat + .5);
        vec3 oN = normalize(vON + vec3(0., 1e-5, 0.));
        vec3 wN = normalize(vWN + vec3(0., 1e-5, 0.)) * (gl_FrontFacing ? 1. : -1.);
        vec2 fuv = abs(oN.y) > .7 ? vOP.xz : vec2(abs(oN.x) > abs(oN.z) ? vOP.z : vOP.x, vOP.y);
        float fid = floor(oN.x * 2. + .5) * 3. + floor(oN.z * 2. + .5) * 7. + floor(oN.y * 2. + .5) * 13.;
        float fw = max(length(dFdx(fuv)), length(dFdy(fuv)));
        float fwt = max(length(dFdx(vUv2)), length(dFdy(vUv2)));
        vec3 kNrm = vec3(0.), kEm = vec3(0.); float kRough = .78;
        vec3 base = diffuseColor.rgb, col = base;
        vec3 Vw = normalize(cameraPosition - vWP);
        vec3 Hv = normalize(uSun + Vw + vec3(0., 1e-4, 0.));
        float sunF = smoothstep(-.2, .25, dot(wN, uSun));
        float n1 = kvn(fuv * .33 + fid), n2 = kvn(vec2(fuv.x * 1.9, fuv.y * .21) + fid * 3.1), n3 = kvn(fuv * 2.7 + fid);
        float tide = 1. - smoothstep(.35, 1.25 + .5 * n1, vOP.y);
        if (mid < .5) {
          // porcelain crust: voronoi shards, faience flowers, grout, bare patches, runs of grime
          float sc = .34; vec2 q = fuv / sc, ip = floor(q), fp = fract(q);
          float d1 = 9., d2 = 9.; vec2 cid = vec2(0.);
          for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j)); vec2 r = g + kh22(ip + g + fid) - fp; float d = dot(r, r);
            if (d < d1) { d2 = d1; d1 = d; cid = ip + g; } else if (d < d2) { d2 = d; }
          }
          float edge = sqrt(d2) - sqrt(d1);
          float lod = clamp(1. - fw / (sc * .7), 0., 1.);
          vec3 hh = kh33(vec3(cid, fid));
          float mx = max(base.r, max(base.g, base.b)), mn = min(base.r, min(base.g, base.b));
          float isW = 1. - smoothstep(.34, .5, (mx - mn) / max(mx, 1e-3));
          float lum = mx;
          vec3 chip = hh.y < .05 ? uF3 * 1.4 : hh.y < .09 ? uF1 * 1.3 : hh.y < .13 ? uF2 * 1.2 : vec3(.98 + hh.x * .1, 1., 1.02 - hh.x * .12) * .74;
          vec3 wcol = mix(vec3(.72, .715, .69), chip, lod) * (lum / .7);
          // flowers on a staggered grid
          vec2 fq = fuv / 1.5; fq.x += .5 * floor(fq.y); vec2 fc = floor(fq), fl = fract(fq) - .5;
          float fh = kh21(fc + fid * 1.7), r = length(fl), ang = atan(fl.y, fl.x + 1e-5);
          float pet = .2 + .1 * cos(ang * (5. + floor(fh * 3.)) + fh * 6.28), aa = fw / 1.5 + .02;
          float flower = 1. - smoothstep(pet - aa, pet + aa, r);
          vec3 pc = fh < .34 ? uF1 : fh < .67 ? uF2 : uF3;
          pc = mix(pc * 1.25, uF2 * 1.3, 1. - smoothstep(.07 - aa, .07 + aa, r));
          float loz = smoothstep(.84 - aa, .84 + aa, abs(fl.x) + abs(fl.y));
          wcol = mix(wcol, mix(uF1, uF3, step(.5, fh)) * 1.1 * (lum / .7), loz * .85);
          wcol = mix(wcol, pc * (lum / .7) * (.8 + .4 * hh.z), flower * .9 * step(.25, fh * 1.25));
          vec3 bcol = base * (.72 + .56 * mix(.5, hh.x, lod));
          col = mix(bcol, wcol, isW);
          col *= 1. - .42 * lod * (1. - smoothstep(.02, .1, edge));
          float bare = smoothstep(.69, .76, kvn(fuv * .21 + fid * 5.3)) * isW;
          col = mix(col, vec3(.4, .36, .3) * (lum / .7) * (.8 + .4 * n3), bare * .85);
          col *= 1. - .3 * smoothstep(.45, .9, n2 * .65 + n1 * .5);
          col = mix(col, vec3(.07, .09, .04), tide * .75);
          kNrm = (hh - .5) * .55 * lod;
          kRough = mix(.34, .8, bare);
          float g = kGlint(fuv, fw, fid, wN, Hv, 2.1);
          kEm = uSunCol * g * 6. * uGlint * sunF * (1. - bare) * (1. - tide) * (.35 + .65 * isW);
        } else if (mid < 1.5) {
          // glazed roof tiles in overlapping rows
          vec2 t = vec2(vUv2.x / .34, vUv2.y / .46); float row = floor(t.y); t.x += .5 * mod(row, 2.);
          vec2 tf = fract(t); float th = kh21(vec2(floor(t.x), row) + 3.7), lod = clamp(1. - fwt / .3, 0., 1.);
          col = base * mix(.92, .74 + .42 * th, lod);
          col *= 1. - lod * (.5 * smoothstep(.78, 1., tf.y) + .22 * smoothstep(.36, .5, abs(tf.x - .5)));
          col *= 1. - .35 * smoothstep(.5, .95, n2 * .6 + n1 * .5);
          kRough = .36; kNrm = vec3(th - .5, 0., kh21(vec2(row, floor(t.x))) - .5) * .25 * lod;
          kEm = uSunCol * kGlint(vUv2 + 17., fwt, fid, wN, Hv, 1.1) * 3. * uGlint * sunF;
        } else if (mid < 2.5) {
          // gilding and lacquer: glossy, a little self-lit, beaten texture
          col = base * (.8 + .35 * n3); kRough = .3; kNrm = (kh33(vec3(floor(fuv * 9.), fid)) - .5) * .3 * clamp(1. - fw * 6., 0., 1.);
          kEm = base * .16 + uSunCol * kGlint(fuv, fw, fid, wN, Hv, 1.3) * 4.5 * uGlint * sunF;
        } else if (mid < 3.5) {
          // lime stucco and stone: rain streaks, block courses, a dark tide line with algae
          float course = 1. - smoothstep(.0, .05, abs(fract(vOP.y / .85) - .5) - .46);
          col = base * (.82 + .3 * n3 * n1 + .1 * n2);
          col *= 1. - .34 * smoothstep(.4, .9, n2 * .7 + n1 * .45);
          col *= 1. - .14 * course * step(abs(oN.y), .5) * clamp(1. - fw * 3., 0., 1.);
          col = mix(col, vec3(.06, .08, .035) + vec3(.03, .06, .01) * n3, tide * .85);
          kRough = mix(.92, .3, tide);
        } else if (mid < 4.5) {
          // teak: planks and grain
          float pl = fuv.x / .24, ph = kh21(vec2(floor(pl), fid));
          col = base * (.7 + .5 * ph) * (.85 + .3 * kvn(vec2(fuv.x * 9., fuv.y * .8)));
          col *= 1. - .45 * smoothstep(.86, .98, abs(fract(pl) - .5) * 2.) * clamp(1. - fw * 5., 0., 1.);
          col = mix(col, vec3(.05, .06, .03), tide * .8);
          kRough = mix(.7, .3, tide);
        } else if (mid < 5.5) {
          col = base * (.5 + .5 * n3); kRough = .9;
        } else if (mid < 6.5) {
          // steep stair flights drawn as treads and shadowed risers
          float st = fract(vOP.y / .34);
          col = base * (.62 + .5 * smoothstep(.3, .5, st)) * (.85 + .25 * n3);
        } else {
          // paving: flagstones with mossy joints, a pale processional way and a border round the prang
          vec2 pv = vOP.xz / 1.3; pv.x += .5 * floor(pv.y); vec2 pf = abs(fract(pv) - .5);
          float ph = kh21(floor(pv)), lod = clamp(1. - fw / .5, 0., 1.);
          float n4 = kvn(vOP.xz * .09 + 7.), n5 = kvn(vOP.xz * .6);
          col = base * mix(1., .78 + .36 * ph, lod) * (.8 + .3 * n4);
          float way = (1. - smoothstep(5.5, 6.1, abs(vOP.x))) * step(26., vOP.z);
          float sq = max(abs(vOP.x), abs(vOP.z));
          float ring = (1. - smoothstep(.0, .5, abs(sq - 36.5) - 1.6)) + (1. - smoothstep(.0, .3, abs(abs(vOP.x) - 7.2) - .5)) * step(36., vOP.z);
          col = mix(col, base * 1.28, way * .6);
          col = mix(col, uF2 * .55, clamp(ring, 0., 1.) * .75);
          col = mix(col, vec3(.1, .13, .06), lod * .7 * smoothstep(.455, .49, max(pf.x, pf.y)));
          col *= 1. - .3 * smoothstep(.45, .8, n4 * .6 + n5 * .5);
        }
        kEm += col * mix(uFillGnd, uFillSky, wN.y * .5 + .5);
        diffuseColor.rgb = col;`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = kRough;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
normal = normalize(normal + mat3(viewMatrix) * kNrm * (gl_FrontFacing ? 1. : -1.));`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += kEm;`)},await e.yield?.();const so=new k.BufferGeometry;for(const[n,i,m]of[["position",c.pos,3],["normal",c.nrm,3],["color",c.col,3],["uv",c.uv,2],["aMat",c.mat,1]])so.setAttribute(n,new k.BufferAttribute(i.slice(0,c.count*m),m)),await e.yield?.();so.computeBoundingSphere(),so.computeBoundingBox();const lo=new k.Mesh(so,to);lo.name="temple",G.add(lo),await e.yield?.();const xo=new k.MeshStandardMaterial({vertexColors:!0,roughness:.85,metalness:0,side:k.DoubleSide});if(xo.customProgramCacheKey=()=>"khlong-run-cloth-1",xo.onBeforeCompile=n=>{n.uniforms.uTime=E.uTime,n.uniforms.uWind=E.uWind,n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute float aSway; uniform float uTime, uWind;`).replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
        float kPh = uv.x * 6.2832, kW = aSway;
        float kA1 = position.y * 1.25 + position.x * .35 + uTime * 2.7 + kPh, kA2 = position.y * .52 - uTime * 1.6 + kPh * 1.7;
        float kWave = sin(kA1) * .34 + sin(kA2) * .26;
        float kSlope = cos(kA1) * .34 * 1.25 + cos(kA2) * .26 * .52;
        objectNormal = normalize(objectNormal - vec3(0., 1., 0.) * kSlope * kW * .8 * (.5 + .5 * uWind));`).replace("#include <begin_vertex>",`#include <begin_vertex>
        transformed += normal * kW * (kWave * (.45 + .55 * uWind) + kW * .16 * uWind);
        transformed.x += kW * kW * .1 * sin(uTime * .9 + kPh * 2.3) * uWind;`),n.fragmentShader=n.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += diffuseColor.rgb * .1;`)},b.count>0){const n=new k.Mesh(q(b,!0),xo);n.name="cloth",n.frustumCulled=!1,G.add(n)}await e.yield?.();let J=null;if(t.reflection!==!1){const n=new k.PlaneGeometry(240,350,1,1);n.rotateX(-Math.PI/2),n.translate(0,.05,79.8+175);const i=new k.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:k.UniformsUtils.merge([k.UniformsLib.fog,{}]),vertexShader:`
        varying vec3 vP;
        #include <fog_pars_vertex>
        void main(){ vP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform vec3 uCamL, uSunL, uLit, uShade, uRoof, uGold, uMK; uniform float uTime, uPS, uCol;
        varying vec3 vP;
        #include <fog_pars_fragment>
        float wPrang(float Y, float tb, float yc){
          if (Y < tb) return 0.;
          if (Y < yc) { float t = (Y - tb) / max(yc - tb, 1e-3); return 9.5 * pow(max(cos(t * 1.27), 0.), .82); }
          if (Y < yc + 4.6) return 3.2 * (1. - (Y - yc) / 4.6 * .9);
          if (Y < yc + 8.6) return .32;
          return 0.;
        }
        float wMain0(float y){
          float Y = y - 3.2;
          if (Y < 0.) return 0.; if (Y < 4.8) return 25.9; if (Y < 10.8) return 21.4; if (Y < 17.8) return 17.4;
          if (Y < 24.8) return 13.9; if (Y < 36.8) return 10.5;
          return wPrang(Y, 36.8, 68.2);
        }
        float wMain(float y){ return uPS * wMain0(3.2 + (y - 3.2) / uPS); }
        float wSat(float y){
          float Y = (y - 3.2) / .323;
          if (Y < 0.) return 0.; if (Y < 5.) return 14.9 * .323; if (Y < 11.) return 12.4 * .323; if (Y < 23.) return 10.5 * .323;
          return wPrang(Y, 23., 68.2) * .323;
        }
        float wHall(float y){ if (y < 3.2) return 0.; if (y < 13.1) return 9.2; if (y < 24.) return 10.2 * (24. - y) / 10.9; return 0.; }
        float wSala(float y){ if (y < .9) return 0.; if (y < 1.4) return 5.2; if (y < 5.9) return 3.9; if (y < 12.8) return 6.3 * (12.8 - y) / 6.9; return 0.; }
        void acc(vec3 P, vec3 R, vec2 C, int kind, float soft, inout vec3 colr, inout float cov){
          vec2 d = C - P.xz; float rr = max(dot(R.xz, R.xz), 1e-6); float t = dot(d, R.xz) / rr;
          if (t <= 0.) return;
          float y = R.y * t; vec2 rn = R.xz / sqrt(rr); vec2 perp = -(d - rn * dot(d, rn)); float lat = length(perp);
          float w = kind == 0 ? wMain(y) : kind == 1 ? wSat(y) : kind == 2 ? wHall(y) : wSala(y);
          float s = soft + t * .004;
          float c = (1. - smoothstep(w - s, w + s, lat)) * step(.01, w);
          float lit = smoothstep(-.55, .55, dot(perp, uSunL.xz) / max(w, .5));
          vec3 k = mix(uShade, uLit, lit);
          if (kind < 2) k *= .8 + .2 * step(.42, fract(y / (kind == 0 ? 3.3 : 1.2)));
          else if (kind == 2) k = y > 13.1 ? uRoof * (.45 + .75 * lit) : k * .9;
          else { k = y > 5.9 ? uRoof * (.45 + .75 * lit) : k * .8; c *= y > 1.4 && y < 5.9 ? .4 : 1.; }
          colr = mix(colr, k, step(cov, c) * step(.001, c)); cov = max(cov, c);
        }
        void main(){
          vec3 V = vP - uCamL; float dist = length(V); V /= max(dist, 1e-4);
          vec3 R = vec3(V.x, max(-V.y, 1e-4), V.z);
          vec2 w = vP.xz; float t = uTime;
          float r1 = sin(w.y * 1.9 + t * 1.3 + sin(w.x * .31 + t * .4) * 2.);
          float r2 = sin(w.y * 4.7 - t * 2.1 + w.x * .6), r3 = sin(w.y * .63 + t * .7 + w.x * .13);
          float rip = r1 * .5 + r2 * .3 + r3 * .4;
          R.y *= 1. + rip * .15;
          R.xz += vec2(-R.z, R.x) * (r2 * .5 + r1 * .35) * .012;
          vec3 colr = vec3(0.); float cov = 0.;
          // river wall
          if (R.z < -1e-4) { float tw = (78. - vP.z) / R.z; float yw = R.y * tw, xw = vP.x + R.x * tw;
            float cw = step(yw, 4.2) * step(abs(xw), 66.) * (abs(xw) < 15. ? .55 : 1.);
            colr = mix(uShade, uLit, .35) * mix(.25, .8, smoothstep(.6, 1.6, yw)); cov = cw; }
          acc(vP, R, vec2(-47., 30.), 2, .5, colr, cov); acc(vP, R, vec2(47., 30.), 2, .5, colr, cov);
          acc(vP, R, vec2(-31., -31.), 1, .3, colr, cov); acc(vP, R, vec2(31., -31.), 1, .3, colr, cov);
          acc(vP, R, vec2(0., 0.), 0, .5, colr, cov);
          acc(vP, R, vec2(-31., 31.), 1, .3, colr, cov); acc(vP, R, vec2(31., 31.), 1, .3, colr, cov);
          acc(vP, R, vec2(-15.5, 85.2), 3, .25, colr, cov); acc(vP, R, vec2(15.5, 85.2), 3, .25, colr, cov);
          float brk = uMK.y + (1. - uMK.y) * smoothstep(-.35, .35, sin(w.y * 2.6 + t * 1.7 + sin(w.x * .4 + t * .3) * 1.5 + rip * 1.3));
          float fres = .3 + .7 * pow(1. - clamp(-V.y, 0., 1.), 4.);
          float edge = (1. - smoothstep(95., 120., abs(vP.x))) * (1. - smoothstep(380., 428., vP.z));
          float a0 = cov * brk * fres * edge * uMK.x;
          // the spire's own light on the water: ripples draw its reflection out into a long broken column of gold that
          // runs from the foot of the stairs toward the viewer, widest and brightest near the temple, in short bright dashes
          vec2 ax = -uCamL.xz; float axl = max(length(ax), 1e-3); ax /= axl;
          vec2 dp = vP.xz - uCamL.xz; float al = dot(dp, ax), lt = abs(dp.x * ax.y - dp.y * ax.x);
          float cw = uMK.z + .02 * max(axl - al, 0.) + 5. * uPS * (1. - smoothstep(0., 60., vP.z - 78.));
          float dash = smoothstep(.1, .75, sin(al * 1.25 - t * 2.3 + 2.5 * sin(lt * .9 + t * .6) + rip * 1.6) * .5 + .5) * (.55 + .45 * smoothstep(-.3, .6, r2 + r3 * .6));
          float wob = lt + (r1 * .5 + r3 * .7) * cw * .35;
          float colm = exp(-wob * wob / (cw * cw)) * dash * smoothstep(7., 30., al) * smoothstep(78., 84., vP.z) * (.35 + .65 * smoothstep(axl * .15, axl * .8, al)) * uCol * edge;
          vec3 cc = uGold * (.7 + .6 * dash);
          float aT = clamp(a0 + colm * (1. - a0 * .5), 0., 1.);
          gl_FragColor = vec4((colr * (.85 + .15 * rip) * a0 + cc * colm) / max(a0 + colm, 1e-4), aT);
          #include <fog_fragment>
        }`});for(const m of["uCamL","uSunL","uLit","uShade","uRoof","uTime","uGold","uPS","uCol","uMK"])i.uniforms[m]=E[m];J=new k.Mesh(n,i),J.name="mirror",J.renderOrder=2,J.frustumCulled=!1,G.add(J)}{const n=[[0,d+(79.6-d)*h,0,2*h],...D.map(([U,H])=>[U,27.85,H,.8])],i=[],m=[],R=[],B=[];n.forEach((U,H)=>{for(const Z of[[-1,-1],[1,-1],[1,1],[-1,1]])i.push(U[0],U[1],U[2]),m.push(Z[0],Z[1]),R.push(U[3]);B.push(H*4,H*4+1,H*4+2,H*4,H*4+2,H*4+3)});const X=new k.BufferGeometry;X.setAttribute("position",new k.Float32BufferAttribute(i,3)),X.setAttribute("uv",new k.Float32BufferAttribute(m,2)),X.setAttribute("aSize",new k.Float32BufferAttribute(R,1)),X.setIndex(B);const j=new k.ShaderMaterial({transparent:!0,depthWrite:!1,blending:k.AdditiveBlending,fog:!0,uniforms:k.UniformsUtils.merge([k.UniformsLib.fog,{}]),vertexShader:`
        attribute float aSize; varying vec2 vC; varying float vK; varying float vDepth;
        void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); float d = length(mv.xyz);
          float sz = max(aSize, d * .0085 * sqrt(aSize * .5)); mv.xy += uv * sz; vC = uv; vDepth = d;
          vK = clamp(d / 260., .3, 1.) * (.6 + .2 * aSize) + position.x * .0;
          gl_Position = projectionMatrix * mv; }`,fragmentShader:`
        uniform vec3 uSunCol; uniform float uGlint, uTime, uTip; varying vec2 vC; varying float vK; varying float vDepth;
        #include <fog_pars_fragment>
        void main(){ float r = length(vC), ax = abs(vC.x), ay = abs(vC.y);
          float a = exp(-r * r * 11.) + .3 * (exp(-ax * 16.) * exp(-ay * 2.6) + exp(-ay * 16.) * exp(-ax * 2.6));
          a *= 1. - smoothstep(.65, 1., r);
          float f = 0.;
          #ifdef USE_FOG
            #ifdef FOG_EXP2
              f = 1. - exp(-fogDensity * fogDensity * vDepth * vDepth);
            #else
              f = smoothstep(fogNear, fogFar, vDepth);
            #endif
          #endif
          gl_FragColor = vec4(uSunCol * a * 3.6 * uGlint * uTip * vK * (.86 + .14 * sin(uTime * 2.1 + vDepth * .05)) * (1. - .65 * f), 1.); }`});for(const U of["uSunCol","uGlint","uTime","uTip"])j.uniforms[U]=E[U];const Y=new k.Mesh(X,j);Y.name="finial-glints",Y.frustumCulled=!1,Y.renderOrder=3,G.add(Y)}let C=null;if(t.birds!==!1){const n=Math.round(72*(e.quality?.detail??1)),i=[],m=[],R=[],B=o.range(0,6.28),X=o.sign();for(let U=0;U<n;U++){const H=o.chance(.2),Z=H?o.range(20,40):o.range(15,27),no=[Z*(.4+.6*h),(H?o.range(26,74):o.range(40,64))*h,B+(H?o.range(0,6.28):o.gauss()*.55),X*o.range(7.5,10.5)/Z],io=o(),A=o.range(1.1,1.6),ko=[[0,0,.4*A,0],[0,0,-.4*A,0],[-.75*A,0,-.1*A,1],[0,0,.4*A,0],[.75*A,0,-.1*A,1],[0,0,-.4*A,0]];for(const po of ko)i.push(po[0],po[1],po[2]),m.push(no[0],no[1],no[2],no[3]),R.push(io,po[3])}const j=new k.BufferGeometry;j.setAttribute("position",new k.Float32BufferAttribute(i,3)),j.setAttribute("aOrb",new k.Float32BufferAttribute(m,4)),j.setAttribute("aPh",new k.Float32BufferAttribute(R,2));const Y=new k.ShaderMaterial({side:k.DoubleSide,fog:!0,uniforms:k.UniformsUtils.merge([k.UniformsLib.fog,{uBody:{value:new k.Color(.07,.07,.09)},uWing:{value:new k.Color(.5,.46,.4)}}]),vertexShader:`
        attribute vec4 aOrb; attribute vec2 aPh; uniform float uTime; varying float vS;
        #include <fog_pars_vertex>
        void main(){
          float r = aOrb.x * (1. + .12 * sin(uTime * .23 + aPh.x * 6.)), ang = aOrb.z + uTime * aOrb.w;
          vec3 c = vec3(cos(ang) * r, aOrb.y + 2.5 * sin(uTime * .4 + aPh.x * 9.), sin(ang) * r);
          float sg = aOrb.w < 0. ? -1. : 1.;
          vec3 fwd = vec3(-sin(ang), 0., cos(ang)) * sg, side = vec3(fwd.z, 0., -fwd.x);
          float glide = smoothstep(-.2, .5, sin(uTime * .6 + aPh.x * 12.));
          float flap = sin(uTime * (9. + aPh.x * 3.) + aPh.x * 20.) * glide + .25 * (1. - glide);
          vec3 p = c + side * position.x * (1. - .25 * aPh.y * abs(flap)) + fwd * position.z;
          p.y += aPh.y * (flap * .55 - position.x * sg * .25);
          vS = aPh.y * (.5 + .5 * flap);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform vec3 uBody, uWing; varying float vS;
        #include <fog_pars_fragment>
        void main(){ gl_FragColor = vec4(mix(uBody, uWing, clamp(vS, 0., 1.)), 1.);
          #include <fog_fragment>
        }`});Y.uniforms.uTime=E.uTime,C=new k.Mesh(j,Y),C.name="pigeons",C.frustumCulled=!1,C.position.set(0,0,0),G.add(C)}const K=(n,i,m)=>new k.Vector3(n,i,m),Lo={portalSeat:{position:K(0,1.5,86),facing:K(0,0,1),radius:7},flyThrough:[K(0,1.5,330),K(0,1.5,250),K(0,1.5,170),K(0,1.5,120),K(0,1.5,86)],viewpoints:{burst:{position:K(0,1.5,300),look:K(0,30,0)},approach:{position:K(-6,1.5,160),look:K(0,34,0)},close:{position:K(0,1.5,112),look:K(0,40,0)}},prangTop:K(0,d+76.8*h,0),prangCenter:K(0,40*h,0),prangScale:h,stairsFoot:K(0,0,78),stairsTop:K(0,d,68.4),terraceY:d,waterY:0,pavilions:[K(-15.5,1.4,85.2),K(15.5,1.4,85.2)],satellites:D.map(([n,i])=>K(n,28,i)),guardians:T.map(([n,i])=>K(n,d,i)),bannerTops:L,egretPosts:S,monitorSteps:[K(-9,.2,77.6),K(11,.2,77.6)],sunDirDefault:V.clone(),mirror:J,flock:C},So=new k.Matrix4,yo=new k.Vector3,Wo=new k.Vector3;let No=0,bo=1;const Eo=()=>{let n=G;for(;n.parent;)n=n.parent;let i=null;n.traverse(m=>{!i&&m.isDirectionalLight&&(i=m)}),i&&(i.getWorldPosition(yo),i.target.getWorldPosition(Wo),yo.sub(Wo),yo.lengthSq()>1e-6&&E.uSun.value.copy(yo.normalize()))};return{object:G,radius:62,height:d+76.8*h,center:K(0,34,18),anchors:Lo,ground:!0,groundY:0,uniforms:E,setSun(n,i,m){ro=!0,E.uSun.value.copy(I(n)),i!=null&&E.uSunCol.value.set(i),m!=null&&(E.uGlint.value=m)},setProgress(n){bo=Math.min(1,Math.max(0,n))},update(n,i,m){E.uTime.value=i,!ro&&No++%45===0&&Eo();const R=bo*bo*(3-2*bo);E.uWind.value=.75+.35*R,So.copy(G.matrixWorld).invert(),m&&E.uCamL.value.copy(m.getWorldPosition(yo)).applyMatrix4(So),E.uSunL.value.copy(E.uSun.value).transformDirection(So)},dispose(){},stats:{triangles:(c.count+b.count)/3+2}}}export{Mo as IDENT,x as box,Xo as buildHero,Po as clothStrip,go as extrude,_o as hall,Fo as makeAcc,ao as mix3,Q as mul,eo as place,co as quad,fo as quadO,$ as spike,oo as tri,Ro as triO};
