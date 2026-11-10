import*as a from"three";import{clamp as U,lerp as Y,smoothstep as j}from"../kit/core.js";const ce=["#E6E3DA","#7C93B8","#F2A51E","#F9E45B","#B5600F","#A9D6F0","#6F8F5A"],K=new a.Vector3(0,-40,0),H=35,oe=12.5,se=150;function W(e,d,v,F,x){const w=(Math.cosh(1.3)-Math.cosh(1.3*(2*F-1)))/(Math.cosh(1.3)-1);return x.set(Y(e.x,d.x,F),Y(e.y,d.y,F)-v*w,Y(e.z,d.z,F))}function $(e,d){let v=1e9;for(let F=0;F<d.length-1;F++){const x=d[F],y=d[F+1],w=y.x-x.x,A=y.y-x.y,f=y.z-x.z,_=U(((e.x-x.x)*w+(e.y-x.y)*A+(e.z-x.z)*f)/Math.max(w*w+A*A+f*f,1e-6),0,1),S=x.x+w*_-e.x,T=x.y+A*_-e.y,V=x.z+f*_-e.z;v=Math.min(v,Math.sqrt(S*S+T*T+V*V))}return v}const Q={groove:0,cap:0,h:0};function ne(e,d,v,F){const x=e.height,y=e.radius,w=e.seed,A=Math.sin(d),f=Math.cos(d),_=.5+.5*Math.sin(d*2+w)*Math.cos(d*3-w*1.7),S=U(v/x,0,1),T=U(S+.17*_*j(.45,.95,S),0,1);let V=y*(1-.33*T)-y*.14;for(let c=0;c<4;c++){const o=e.ledges[c]+.025*Math.sin(d*2+c*2.1+w);T<o&&(V+=y*.03+y*.09*j(o-.035,o-.004,T))}const P=j(.86,1,T);V*=Math.sqrt(Math.max(1-P*P,0))*.98+.02*(1-P),V*=1+.13*Math.sin(d*2+w*2.3+T*1.5)+.07*Math.sin(d*3+w),v<0&&(V+=y*(.1*j(0,-12,v)-.12*j(-2,-7,v)*j(-14,-8,v))+y*.3*j(-20,-78,v));const B=F.n3(A*1.3+w,v*.018,f*1.3)*.1+F.n3(A*3.1,v*.05+w,f*3.1)*.04,C=Math.abs(Math.sin(d*e.flutes*.5+F.n2(A*2+w,v*.02)*.9)),M=(1-C)*(1-C);return Q.groove=M,Q.cap=P,Q.h=T,V*(1+B)*(1-.125*(1-M)*(1-P*.7))}async function he(e,d,v,F){const x={},y=a.MathUtils.degToRad(e.range(24,30)),w=new a.Vector3(-Math.sin(y),0,Math.cos(y)),A=new a.Vector3(45,-32,44),f=[];{let o=y,r=A.clone(),l=-30;f.push(r.clone().setY(-31));for(let i=15;i<=300&&(i>90&&(o=Math.max(o-15/120,-.5)),r=r.clone().add(new a.Vector3(Math.sin(o)*15,0,-Math.cos(o)*15)),i>110&&(l=Math.min(l+15*.26,14)),f.push(r.clone().setY(i<90?-30-1*(1-i/90):l)),!(r.z<-se-25));i+=15);f.reverse()}x.fly=f,x.exit=w,x.seat=A,x.head=y;const _=f[0].x,S=[],T=[_+e.range(62,70),_-e.range(72,78),-e.range(128,144)],V=[e.range(140,165),e.range(0,28),-e.range(100,128)];for(let o=0;o<6;o++){const r=o<3,l=r?T[o]:V[o-3],i=e.range(17,24),u=e.range(72,96)*(o%3===1?1.08:1);S.push({position:new a.Vector3(l,0,(r?-1:1)*(se+i*.55+e.range(0,8))),radius:i,height:u,lip:r?"near":"far",seed:e()*100});const k=S[o],n=k.seed;k.flutes=2*(5+Math.floor(n%3)),k.ledges=[.16+n%7*.01,.38+n%3*.03,.58+n%4*.02,.78]}x.towers=S;const P=(o,r,l,i)=>{const u=Math.atan2(l.x-o.position.x,l.z-o.position.z)+i,k=ne(o,u,r,v)*.95-.4;return new a.Vector3(o.position.x+Math.sin(u)*k,r,o.position.z+Math.cos(u)*k)},B=[],C=new a.Vector3,M=(o,r,l,i,u)=>{for(let k=1;k<40;k++)if(W(o,r,l,k/40,C),$(C,f)<u+i||C.distanceTo(A)<15+i||Math.hypot(C.x-K.x,C.z-K.z)<H+6&&Math.abs(C.y-K.y)<oe+5+i&&k>3&&k<37)return!1;return!0};for(let o=0;o<6;o++){const r=S[o];for(let l=0;l<2;l++){const i=e.range(2.6,3.9),u=(l?1:-1)*e.range(.16,.3),k=e.range(12,38)+l*e.range(4,22),n=Math.atan2(r.position.x,r.position.z)+u*1.5,m=new a.Vector3(K.x+Math.sin(n)*(H-5),K.y+e.range(-3,3),K.z+Math.cos(n)*(H-5)),p=e.range(10,22);let z=P(r,k,m,u),N=Math.min(p,Math.max(1,(z.y-m.y)*.17)),R=!1,s=m,t=n;for(const h of[0,.45,-.45,.9,-.9,1.4,-1.4]){const g=n+h,b=h===0?m:new a.Vector3(K.x+Math.sin(g)*(H-5),m.y,K.z+Math.cos(g)*(H-5));for(const D of[0,14,-10,28,42]){const L=P(r,Math.min(k+D,r.height*.8),b,u),q=Math.max(1,(L.y-b.y)*.17);for(const G of[1,.55,.2,-.35]){const O=Math.min(p,q)*G;if(M(L,b,O,i,9)){z=L,N=O,s=b,t=g,R=!0;break}}if(R)break}if(R)break}B.push({a:z,b:s,sag:N,r:i,kind:0,s0:0,dir:-1,gain:(o*2+l)%2?1:-1,ang:t,rootA:r.position})}}const c=Math.round(e.range(25,31));for(let o=0,r=0;o<c&&r<400;r++){const l=e.int(0,2),i=e(),u=e()<.5?-1:1,k=i<.42?l:U(l+u,0,2)===l?U(l-u,0,2):U(l+u,0,2),n=S[l],m=S[3+k],p=e()<.25?e.range(2.2,3.4):e.range(1,2),z=e.range(-22,n.height-6),N=e.range(-22,m.height-6),R=P(n,z,m.position,e.range(-.9,.9)),s=P(m,N,n.position,e.range(-.9,.9)),t=e.range(30,60);r%12===11&&await F.yield(),M(R,s,t,p,9.5)&&(B.push({a:R,b:s,sag:t,r:p,kind:1,s0:e.range(120,300),dir:1,gain:e()<.5?1:-1,rootA:n.position,rootB:m.position}),o++)}return x.strands=B,x.clearOf=M,x.attach=P,x}async function ue(e,d,v,F,x){const y=[],w=new a.Vector3,A=new a.Vector3,f=[];for(let o=0;o<e.strands.length;o++){const r=e.strands[o],l=r.a.distanceTo(r.b)*(1+1.6*(r.sag*r.sag)/Math.max(r.a.distanceToSquared(r.b),1)),i=Math.max(12,Math.round(l/(r.kind===0?3.4:4.6))),u=new Float32Array((i+1)*3),k=new Float32Array(i+1),n=new Float32Array(i+1),m=d()*6.28;for(let p=0;p<=i;p++){const z=p/i;W(r.a,r.b,r.sag,z,w),u[p*3]=w.x,u[p*3+1]=w.y,u[p*3+2]=w.z;const N=z*l,R=(1-z)*l,s=1+.85*Math.exp(-N/5)+(r.kind===0?-.3*Math.exp(-R/7):.85*Math.exp(-R/5));k[p]=r.r*s*(1+.07*Math.sin(N*.21+m)+.04*Math.sin(N*.53+m*2)),n[p]=r.kind===0?R+30:r.s0+N,p>2&&p<i-2&&p%2===0&&f.push({p:w.clone(),si:o,r:r.r,s:n[p],t:z})}r.len=l,r.P=u,r.n=i,r.S=n,y.push({P:u,R:k,S:n,sides:r.r>2.1?10:7,gain:r.gain,r0:r.r,seed:d(),ref:null,rootA:r.rootA,rootB:r.rootB}),o%8===7&&await x.yield()}e.samples=f;const _=Math.round(d.range(62,74)*(.5+.5*v)),S=[];for(let o=0,r=0;o<_&&r<900;r++){r%25===24&&await x.yield();const l=f[Math.floor(d()*f.length)];let i=null,u=1e9;const k=d.range(12,30);for(let h=0;h<40;h++){const g=f[Math.floor(d()*f.length)];if(g.si===l.si)continue;const b=l.p.distanceTo(g.p);b<9||b>46||Math.abs(b-k)<u&&(u=Math.abs(b-k),i=g)}if(!i)continue;const n=l.p.distanceTo(i.p),m=n*d.range(.08,.2),p=d.range(.5,1);if(!e.clearOf(l.p,i.p,m,p,9.5))continue;let z=!1;for(const h of S)if(h.a.distanceTo(l.p)<7||h.b.distanceTo(i.p)<7||h.a.distanceTo(i.p)<7||h.b.distanceTo(l.p)<7){z=!0;break}if(z)continue;S.push({a:l.p,b:i.p});const N=Math.max(6,Math.round(n/2.4)),R=new Float32Array((N+1)*3),s=new Float32Array(N+1),t=new Float32Array(N+1);for(let h=0;h<=N;h++){const g=h/N;W(l.p,i.p,m,g,w),R[h*3]=w.x,R[h*3+1]=w.y,R[h*3+2]=w.z,s[h]=p*(.82+1.5*Math.exp(-g*n/2.2)*(l.r/1.6)+1.5*Math.exp(-(1-g)*n/2.2)*(i.r/1.6)),t[h]=l.s+g*n}y.push({P:R,R:s,S:t,sides:6,gain:d()<.5?1:-1,r0:p,seed:d(),ref:null}),o++}const T=v>.9?3:2;await x.yield();for(const o of e.strands){const r=o.kind===0?[o.a]:[o.a,o.b];for(const l of r){const i=e.towers.reduce((k,n)=>Math.hypot(n.position.x-l.x,n.position.z-l.z)<Math.hypot(k.position.x-l.x,k.position.z-l.z)?n:k,e.towers[0]),u=Math.atan2(l.x-i.position.x,l.z-i.position.z);for(let k=0;k<T;k++){const n=d.range(-1,1),m=d.range(-1,.6),p=d.range(6,14)+o.r*2,z=6,N=d.range(.14,.3)*(.7+o.r*.25),R=Math.hypot(n,m)||1,s=new Float32Array((z+1)*3),t=new Float32Array(z+1),h=new Float32Array(z+1),g=d()*6.28;for(let b=0;b<=z;b++){const D=b/z,L=l.y+m/R*p*D+Math.sin(D*5+g)*.8*D,q=u+(n/R*p*D+Math.cos(D*4+g)*.9*D)/i.radius,G=ne(i,q,L,F)+.05;s[b*3]=i.position.x+Math.sin(q)*G,s[b*3+1]=L,s[b*3+2]=i.position.z+Math.cos(q)*G,t[b]=N*(1-.8*D)+(b===0?o.r*.25:0),h[b]=(o.kind===0?o.len+30:o.s0+(l===o.a?0:o.len))+D*p}y.push({P:s,R:t,S:h,sides:3,gain:.5,r0:N,seed:d(),ref:null,thin:1})}}}const V=e.exit.clone().multiplyScalar(-1),P=new a.Vector3(0,1,0).cross(V).normalize(),B=new a.Vector3(0,1,0);e.ring={nrm:V,ax:P,ay:B},await x.yield();const C=9.1,M=168;for(let o=0;o<6;o++){const r=new Float32Array((M+1)*3),l=new Float32Array(M+1),i=new Float32Array(M+1);for(let u=0;u<=M;u++){const k=u/M*Math.PI*2,n=k*7+o/6*Math.PI*2+o%2*.5,m=C+.95*Math.cos(n),p=.95*Math.sin(n)*(o%2?1:-1);w.copy(e.seat).addScaledVector(P,Math.cos(k)*m).addScaledVector(B,Math.sin(k)*m).addScaledVector(V,p),r[u*3]=w.x,r[u*3+1]=w.y,r[u*3+2]=w.z,l[u]=.74*(1+.1*Math.sin(k*13+o)),i[u]=60+(o%2?1:-1)*k*C}y.push({P:r,R:l,S:i,sides:6,gain:o%2?1:-1,r0:.75,seed:d(),ref:V,closed:!0})}const c=(o,r,l)=>{for(let i=1;i<=16;i++)if(W(o,r,l,i/17,w),$(w,e.fly)<8.9)return!1;return!0};e.guys=[],e.rim=[];for(let o=0;o<16;o++)e.rim.push({p:new a.Vector3(K.x+Math.sin(o*.3927)*33,K.y+3,K.z+Math.cos(o*.3927)*33),si:-1,r:3,s:30,t:.5});for(let o=0;o<8;o++){const r=(o+.5+d.range(-.2,.2))/8*Math.PI*2,l=P.clone().multiplyScalar(Math.cos(r)).addScaledVector(B,Math.sin(r));await x.yield();const i=e.seat.clone().addScaledVector(l,C+.6);let u=null,k=1e9;for(const s of f.concat(e.rim)){A.subVectors(s.p,i);const t=A.length();if(t<12||t>110)continue;const h=A.dot(l)/t;if(h<.25)continue;const g=t*(1.6-h);g<k&&c(i,s.p,t*.05)&&(k=g,u=s)}if(!u)continue;const n=u.p,m=i.distanceTo(n),p=Math.max(8,Math.round(m/3)),z=new Float32Array((p+1)*3),N=new Float32Array(p+1),R=new Float32Array(p+1);for(let s=0;s<=p;s++){const t=s/p;W(i,n,m*.05,t,w),z[s*3]=w.x,z[s*3+1]=w.y,z[s*3+2]=w.z,N[s]=.72*(1+.9*Math.exp(-t*m/2)+1.6*Math.exp(-(1-t)*m/2.5)),R[s]=60+t*m}y.push({P:z,R:N,S:R,sides:6,gain:o%2?1:-1,r0:.75,seed:d(),ref:null}),e.guys.push({a:i,b:n})}return y}function fe(e){if(e.closed||e.nocap||e.r0<.6)return e;const d=e.P.length/3,v=e.r0>=1.5||e.rootA||e.rootB?2:1,F=d+2*v,x=new Float32Array(F*3),y=new Float32Array(F),w=new Float32Array(F);x.set(e.P,v*3),y.set(e.R,v),w.set(e.S,v);for(let A=0;A<2;A++){const f=A?d-1:0,_=A?d-2:1,S=e.R[f];let T=e.P[f*3]-e.P[_*3],V=e.P[f*3+1]-e.P[_*3+1],P=e.P[f*3+2]-e.P[_*3+2];const B=Math.hypot(T,V,P)||1;T/=B,V/=B,P/=B;const C=A?e.rootB:e.rootA;if(C){const M=e.P[f*3],c=e.P[f*3+1],o=e.P[f*3+2];for(let r=1;r<=v;r++){const l=A?v+d-1+r:v-r,i=r/v;x[l*3]=M+(C.x-M)*i,x[l*3+1]=c-1.5*i,x[l*3+2]=o+(C.z-o)*i,y[l]=S*(1-.25*i),w[l]=e.S[f]}continue}for(let M=1;M<=v;M++){const c=A?v+d-1+M:v-M,o=M===v,r=(o?v===2?1.5:.7:.8)*S;x[c*3]=e.P[f*3]+T*r,x[c*3+1]=e.P[f*3+1]+V*r,x[c*3+2]=e.P[f*3+2]+P*r,y[c]=o?.03*S:.8*S,w[c]=e.S[f]}}return{...e,P:x,R:y,S:w}}async function ie(e,d){const v=e.map(fe);let F=0,x=0;for(const i of v){const u=i.P.length/3;F+=u*(i.sides+1),x+=(u-1)*i.sides*6}const y=new Float32Array(F*3),w=new Float32Array(F*3),A=new Float32Array(F*3),f=new Float32Array(F*4),_=new Float32Array(F*2),S=new Uint32Array(x),T=new a.Vector3,V=new a.Vector3,P=new a.Vector3,B=new a.Vector3(0,1,0),C=new a.Vector3(1,0,0);let M=0,c=0,o=0;const r=i=>{const u=i.P,k=u.length/3,n=i.sides,m=M;V.set(0,0,0);for(let p=0;p<k;p++){const z=Math.max(p-1,0),N=Math.min(p+1,k-1);i.closed&&(p===0||p===k-1)?T.set(u[3]-u[(k-2)*3],u[4]-u[(k-2)*3+1],u[5]-u[(k-2)*3+2]):T.set(u[N*3]-u[z*3],u[N*3+1]-u[z*3+1],u[N*3+2]-u[z*3+2]),T.lengthSq()<1e-10&&T.set(0,0,1),T.normalize(),i.ref?V.copy(i.ref):p===0&&V.copy(Math.abs(T.y)>.9?C:B),V.addScaledVector(T,-V.dot(T)),V.lengthSq()<1e-8&&V.copy(Math.abs(T.y)>.9?C:B).addScaledVector(T,-(Math.abs(T.y)>.9?T.x:T.y)),V.normalize(),P.crossVectors(T,V);const R=i.R[p],s=u[p*3],t=u[p*3+1],h=u[p*3+2];for(let g=0;g<=n;g++){const b=g/n*Math.PI*2,D=Math.cos(b),L=Math.sin(b),q=V.x*D+P.x*L,G=V.y*D+P.y*L,O=V.z*D+P.z*L;y[M*3]=s+q*R,y[M*3+1]=t+G*R,y[M*3+2]=h+O*R,w[M*3]=q,w[M*3+1]=G,w[M*3+2]=O,A[M*3]=T.x,A[M*3+1]=T.y,A[M*3+2]=T.z,f[M*4]=i.S[p],f[M*4+1]=R,f[M*4+2]=g/n,f[M*4+3]=i.r0,_[M*2]=i.gain,_[M*2+1]=i.seed,M++}}for(let p=0;p<k-1;p++)for(let z=0;z<n;z++){const N=m+p*(n+1)+z,R=N+n+1;S[c++]=N,S[c++]=N+1,S[c++]=R,S[c++]=R,S[c++]=N+1,S[c++]=R+1}return k*n};for(const i of v)o+=r(i),o>9e3&&(o=0,await d.yield());const l=new a.BufferGeometry;return l.setAttribute("position",new a.BufferAttribute(y,3)),l.setAttribute("normal",new a.BufferAttribute(w,3)),l.setAttribute("aAxis",new a.BufferAttribute(A,3)),l.setAttribute("aTube",new a.BufferAttribute(f,4)),l.setAttribute("aFlow",new a.BufferAttribute(_,2)),l.setIndex(new a.BufferAttribute(S,1)),l.boundingSphere=new a.Sphere(new a.Vector3(0,-10,0),320),l}const ee=`
uniform float uTime;      // wind clock
uniform float uPulseT;    // pulse clock (seconds)
uniform float uPeriod;
uniform vec3 uSeat, uRareP; uniform float uRareA;
float pulseD(float t){ return 70.0 * sin(3.14159265 * t / uPeriod) + 1.5 * t; }
#ifdef IS_VERTEX
// camera in the hero's local space (the hero may be moved and turned by the world; uniform scale only)
vec3 camLocal(){ mat3 m = mat3(modelMatrix); return ((cameraPosition - modelMatrix[3].xyz) * m) / max(dot(m[0], m[0]), 1e-6); }
#endif
// everything hanging in the gorge sways together as a smooth function of where it is (about 1 m)
vec3 swayAt(vec3 p){
  float w = clamp(1.0 - (p.z * p.z) / 21000.0, 0.0, 1.0);
  w *= w * smoothstep(11.0, 42.0, distance(p, uSeat));
  vec3 dr = p - uRareP; float spring = uRareA * exp(-dot(dr.xz, dr.xz) / 1500.0) * smoothstep(-60.0, -10.0, dr.y);
  return vec3(0.0, spring * w, 0.0) + w * vec3(sin(uTime * 0.45 + p.z * 0.012 + p.y * 0.02) + 0.35 * sin(uTime * 1.1 + p.z * 0.05),
                  0.3 * sin(uTime * 0.6 + p.x * 0.015),
                  0.25 * sin(uTime * 0.37 + p.x * 0.02));
}
`,ae=`
uniform vec3 uSun, uSunCol, uSky, uShade, uDark, uLemon, uAbs;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
// 1 below lo, 0 above hi (lo < hi)
float fall(float lo, float hi, float x){ float t = clamp((x - lo) / max(hi - lo, 1e-5), 0.0, 1.0); return 1.0 - t * t * (3.0 - 2.0 * t); }
// dark grains: one layer of cells in (along, around) metres; wrap = whole cells round the tube
float grainLayer(vec2 uv, float wrap, float stretch, float big){
  vec2 id = floor(uv), f = fract(uv); float m = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)), c = id + o; c.y = mod(c.y, wrap);
    float rnd = h21(c + 0.37);
    vec2 q = o + vec2(h21(c + 7.1), h21(c + 3.3)) * 0.64 + 0.18 - f;
    q.x *= stretch;
    // grains travel in lanes that wind slowly round the tube, so they read as streams, not spots
    float lane = 0.5 + 0.5 * sin(c.y / wrap * 12.566 + c.x * 0.23 + sin(c.x * 0.071) * 2.0);
    float rad = (0.05 + 0.13 * rnd * rnd) * big;
    m = max(m, step(mix(0.74, 0.16, lane * lane), rnd) * fall(rad * 0.25, rad, length(q)));
  }
  return m;
}
// hue-keeping shoulder: through-lit cores may bloom a little but never clip to yellow-white
vec3 knee(vec3 c){ float m = max(c.r, max(c.g, c.b)); float k = m < 0.85 ? m : 0.85 + 0.8 * (1.0 - exp(-(m - 0.85) / 0.8)); return c * (k / max(m, 1e-4)); }
// env seen through / reflected in the glass: blue sky above, shadowed gorge below
vec3 envCol(vec3 d){ return mix(uShade * 0.55, uSky, smoothstep(-0.25, 0.35, d.y)); }
// GLASS: what hangs in the gorge is clear enough to see through. gGl (0..1) and gP (hero-local position) are set by
// the caller; behindCol is the gorge as it lies behind a point, worked out from the two walls, the mist and the sky
// (no second pass): pale ledge lines on blue shade, lit mist below, sky above the lips, the sun, and gold bands for
// the strands that hang behind.
float gGl = 0.0, gThin = 1.0; vec3 gP = vec3(0.0);        // gThin < 1: clearer glass than its width would give
vec3 behindCol(vec3 P, vec3 d){
  float dz = abs(d.z) < 0.06 ? (d.z < 0.0 ? -0.06 : 0.06) : d.z;
  float t = clamp(((dz > 0.0 ? 126.0 : -126.0) - P.z) / dz, 0.0, 1200.0);
  float y = P.y + d.y * t, x = P.x + d.x * t;
  float hz = 1.0 - exp(-t / 700.0);
  vec3 sky = mix(uSky * 1.08, uSky * vec3(0.6, 0.76, 1.0), smoothstep(0.0, 0.45, d.y));
  vec3 mistC = mix(uShade, uSky, 0.6) * 1.12;
  float led = fall(0.02, 0.14, abs(fract(y / 23.0 + 0.16 * sin(x * 0.021 + y * 0.05)) - 0.5));
  float flu = 0.5 + 0.5 * sin(x * 0.19 + 2.0 * sin(x * 0.043));
  vec3 wall = mix(uShade * (0.2 + 0.12 * flu + 1.5 * led), mistC * 0.8, hz * 0.55);
  vec3 col = mix(wall, mistC, 1.0 - smoothstep(-128.0, -84.0, y));
  col = mix(col, sky, smoothstep(-4.0, 10.0, y));
  float tx = x * 0.019 + 0.35 * sin(x * 0.0043), tf = abs(fract(tx) - 0.5) * 2.0, th = (96.0 - 250.0 * tf) * (0.55 + 0.45 * sin(floor(tx) * 12.9));
  col = mix(col, mix(uShade * (0.5 + 0.5 * flu), mistC, 0.25 + 0.5 * hz), smoothstep(0.0, 6.0, th - y) * smoothstep(-4.0, 6.0, y));       // towers on the lip
  float sn = max(dot(d, uSun), 0.0), s2 = sn * sn, s8 = s2 * s2; s8 *= s8;
  col += uSunCol * (0.16 * s8 + 2.2 * s8 * s8 * s8 * s8) * smoothstep(-30.0, 10.0, y);
  // strands behind: a few gold bands, slowly different from place to place
  float st = sin(d.y * 9.0 + d.x * 5.0 + P.x * 0.031 + 1.7 * sin(d.z * 4.0 + P.z * 0.02)) * sin(d.y * 4.3 - d.x * 7.0 + P.y * 0.045 + 0.6);
  col = mix(col, uSunCol * exp(-1.6 * uAbs) * 0.95, smoothstep(0.55, 0.9, st) * 0.75);
  return col;
}
// honey glass. N,V unit; r = local radius in metres; returns linear HDR colour before grains.
// thick = view thickness in metres (out), back = how much the sun is behind what we look at (out)
// xr = how far across the rod's seen width this point lies: 0 on its axis, 1 at its outline
vec3 honeyX(vec3 N, vec3 V, float r, float xr, out float ndv, out float back){
  ndv = max(dot(N, V), 0.0);
  back = max(-dot(V, uSun), 0.0);
  float b2 = back * back;
  float sunN = dot(N, uSun), toward = max(sunN, 0.0), away = max(-sunN, 0.0);
  // optical depth: threads are lemon, strands gold, mains deep honey; and every rod deepens from its bright
  // core out to its rind, as a jar of honey does
  float heC = 1.0 + (2.6 * smoothstep(0.1, 0.75, r) + 0.8 * smoothstep(1.2, 3.6, r)) * gThin;
  // light that comes out on the side away from the sun, or straight through with the sun behind, took the short way
  float shortp = clamp(0.45 * away * away + 0.5 * b2 * b2, 0.0, 0.6);
  float he = heC * (0.55 + 3.4 * xr * (0.35 + 0.65 * xr)) * (1.0 - 0.4 * shortp);
  vec3 trans = exp(-he * uAbs);
  // light inside the glass: some is piped along it everywhere, more leaves by the far side, and with the sun
  // behind it the whole core lights up
  float lit = 0.5 + 0.06 * toward + 0.26 * away * away + b2 * (0.3 + 0.7 * b2);
  float core = 1.0 - smoothstep(0.0, 0.55, xr);              // the bright heart is about a third of the seen width
  // a rod of glass gathers the sun into one bright line along its far side
  float cs = sunN + 0.62, streak = exp(-cs * cs * 46.0) * (0.25 + 0.75 * ndv);
  // what is seen THROUGH a solid rod is upside down: gorge shade along its top, sky along its belly
  vec3 seen = envCol(normalize(-V - N * (1.15 - 0.6 * ndv)));
  // a pale, clear organism (citrine) keeps its flanks light; honey and garnet fall to deep colour
  float deep = clamp((uAbs.y - 0.05) / 0.17, 0.3, 1.0);
  vec3 col = trans * (uSunCol * (lit * mix(0.66 + 0.85 * core * core, 0.26 + 1.75 * core * core, deep) + 0.4 * (1.0 - 0.8 * gGl) * streak) + seen * vec3(0.12, 0.1, 0.08));
  // hanging glass: through the middle of the rod the gorge behind it shows, upside down, squeezed and tinted amber;
  // nothing shows through the flanks, where the light is turned back inside
  if (gGl > 0.001) {
    float x2 = xr * xr, chord = sqrt(max(1.0 - x2, 0.0));
    // nearly straight through the middle; toward the edge the view is bent further and further aside, as a rod of glass does
    vec3 Rf = normalize(-V + (N - V * dot(N, V)) * (0.12 + 0.8 * x2 * x2));
    vec3 bh = behindCol(gP, Rf);
    bh = mix(bh, vec3(dot(bh, vec3(0.3, 0.5, 0.2))), 0.5);      // amber takes the blue out: mostly how bright it is behind
    float win = 1.0 - smoothstep(0.62, 0.93, xr);
    // the colour deepens with the glass the light crossed: a thread is clear lemon, a main or a teardrop deep in its middle
    vec3 tint = exp(-(0.35 + 1.5 * min(r, 4.5) * (0.35 + 0.65 * chord)) * gThin * (0.6 + 0.4 * deep) * uAbs);
    col = mix(col, bh * tint * 1.6 + col * 0.1, gGl * win * 0.94);
    // the light that crossed the rod gathers into a thin bright line just inside its far edge
    float cx = xr - 0.76; col += uLemon * tint * (0.55 * gGl * exp(-cx * cx * 260.0) * smoothstep(0.05, 0.6, away) * smoothstep(0.3, 1.2, r));
  }
  // the brightest of the core pales toward the young-growth lemon, as light does through the middle of a jar;
  // in hanging glass it flares only where the sun stands behind it
  col += uLemon * (core * core * core * mix(0.55 + 0.5 * min(lit, 1.3) + 0.4 * b2, 0.03 + 0.22 * b2 * b2, gGl)) * smoothstep(0.15, 0.9, r);
  // thin places go lemon rather than white
  col = mix(col, uLemon * (0.3 + 0.5 * min(lit, 1.4)), 0.45 * exp(-r * 5.0));
  // the edge of the glass: a dark rind with the deepest colour just inside it
  // the flanks fall to deep honey well inside the outline, and the rind is darker still
  float thickR = smoothstep(0.1, 0.6, r);
  col = mix(col, uDark * (0.5 + 0.5 * min(lit, 1.5)), (0.4 + 0.34 * deep) * smoothstep(0.3 + 0.36 * gGl, 0.86 + 0.1 * gGl, xr) * thickR);
  col *= 1.0 - (0.2 + 0.3 * deep) * smoothstep(0.86, 0.995, xr) * thickR;
  return knee(col);
}
vec3 honey(vec3 N, vec3 V, float r, out float ndv, out float back){
  float d = max(dot(N, V), 0.0);
  return honeyX(N, V, r, sqrt(max(1.0 - d * d, 0.0)), ndv, back);
}
vec3 skin(vec3 col, vec3 N, vec3 V, float ndv, float spec){
  float e = 1.0 - ndv, fres = 0.03 + 0.97 * e * e * e * e * e;
  vec3 R = reflect(-V, N);
  col += envCol(R) * (fres * 0.13 + 0.008);
  float sp = max(dot(R, uSun), 0.0); float s4 = sp * sp; s4 *= s4; float s16 = s4 * s4; s16 *= s16; float s64 = s16 * s16; s64 *= s64;
  col += uSunCol * spec * (s64 * s64 * 2.4 + vec3(1.0, 0.78, 0.42) * s16 * 0.02);
  // sky sheen sliding on the upper skin
  col += uSky * 0.016 * smoothstep(0.2, 1.0, N.y);
  return col;
}
`;function de(e,d){return{uTime:{value:0},uPulseT:{value:0},uPeriod:{value:d.period},uSeat:{value:d.seat},uSun:{value:d.sunDir},uSunCol:{value:new a.Color(d.sunColor).multiplyScalar(1.1)},uSky:{value:new a.Color(d.skyColor)},uShade:{value:new a.Color(d.shadeColor)},uDark:{value:new a.Color(e[4]).multiplyScalar(.55)},uLemon:{value:new a.Color(e[3])},uGrain:{value:new a.Color("#5A2C08")},uAbs:{value:d.abs},uHeroT:{value:-1e3},uHeroOn:{value:0},uBranch:{value:new a.Vector4(1,1,0,0)},uRareP:{value:new a.Vector3(0,1e3,0)},uRareA:{value:0},uFar:{value:.002}}}function pe(e){return new a.ShaderMaterial({fog:!0,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...e},vertexShader:`
      attribute vec3 aAxis; attribute vec4 aTube; attribute vec2 aFlow;
      uniform vec4 uBranch; uniform float uFar;
      #define IS_VERTEX
      varying vec3 vN, vT, vW, vCam; varying vec4 vTube; varying vec2 vFlow; varying float vBulge;
      #include <fog_pars_vertex>
      ${ee}
      void main(){
        float s = aTube.x;
        float D = pulseD(uPulseT - s / 400.0);
        float b = fract((s - 2.2 * D) / 80.0) - 0.5;
        float bump = exp(-b * b * 60.0) * smoothstep(0.4, 1.2, aTube.w);
        float tipD = uBranch.z - (s - 1000.0);
        // seed 6..7: the climber, a vein with fat bulges half as wide again strung along it, travelling toward larger s
        float cb = fract((s - uPulseT * 5.0) / 14.0) - 0.5, climb = step(6.0, aFlow.y) * exp(-cb * cb * 22.0);
        float br = aFlow.y > 6.0 ? 1.0 + 0.7 * climb : aFlow.y > 5.0 ? 1.0 + 0.2 * (0.5 + 0.5 * sin(s * 0.13 + uPulseT * 1.7)) : aFlow.y > 4.0 ? smoothstep(0.0, 4.5, tipD) * (1.0 + 0.75 * exp(-(tipD - 6.0) * (tipD - 6.0) * 0.07)) : (aFlow.y > 3.0 ? uBranch.y * (1.0 + 0.16 * (uBranch.y - 1.0) * (0.5 + 0.5 * sin(s * 0.06 + uPulseT * 1.5))) : (aFlow.y > 2.0 ? uBranch.x : 1.0));
        vec3 p = position + normal * aTube.y * (0.2 * bump + br - 1.0);
        // far off, a strand is never thinner than about two pixels: the web reads as a soft gold band
        float dC = distance(camLocal(), p);
        p += normal * max(dC * uFar - aTube.y * br, 0.0) * step(0.02, br);
        p += swayAt(p);
        vN = normal; vT = aAxis; vW = p; vCam = camLocal();
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vTube = vec4(s, aTube.y * (br + 0.2 * bump), aTube.z, aTube.w * br); vFlow = aFlow; vBulge = max(bump, climb);
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        vFogDepth *= 0.55;            // the glass carries its own light through the haze
      }`,fragmentShader:`
      varying vec3 vN, vT, vW, vCam; varying vec4 vTube; varying vec2 vFlow; varying float vBulge;
      uniform vec3 uGrain; uniform vec4 uBranch;
      #include <fog_pars_fragment>
      ${ee}
      ${ae}
      void main(){
        vec3 N = normalize(vN), V = normalize(vCam - vW), T = normalize(vT);
        float r = vTube.y, r0 = max(vTube.w, 0.05), s = vTube.x;
        float ndv, back;
        // across-the-rod position, taken square to the tube so that a vein seen along its length keeps its bright core
        vec3 Vp = V - T * dot(V, T); float lp = max(length(Vp), 0.05), nvp = clamp(dot(N, Vp) / lp, 0.0, 1.0);
        gP = vW; gGl = smoothstep(-172.0, -150.0, vW.z) * (1.0 - smoothstep(150.0, 172.0, vW.z));     // glass where it hangs in the gorge
        float pour = step(5.0, vFlow.y) * step(vFlow.y, 6.0);          // the three strands by which the river leaves the lip
        gThin = 1.0 - 0.5 * pour;                                     // they are the clearest, palest glass in the net
        vec3 col = honeyX(N, V, r, sqrt(max(1.0 - nvp * nvp, 0.0)), ndv, back);
        // grains: two depths sliding past each other, scrolled by the pulse
        float D = pulseD(uPulseT - s / 400.0) * vFlow.x;
        vec3 Bt = cross(N, T);
        float inv = 1.0 / max(ndv, 0.3), vt = dot(V, T) * inv, vb = dot(V, Bt) * inv;
        float cell = clamp(r0 * 0.16, 0.26, 0.7), circ = 6.2832 * r0;
        float wrap = max(1.0, floor(circ / cell + 0.5)), cy = circ / wrap;
        float fw = fwidth(s) / cell + fwidth(vTube.z) * wrap * 0.3;
        float keep = 1.0 - smoothstep(0.3, 0.8, fw);
        float d1 = 0.3 * r, d2 = 0.7 * r;
        vec2 u1 = vec2((s - vt * d1 - D) / cell, (vTube.z * circ - vb * d1) / cy + vFlow.y * 17.0);
        vec2 u2 = vec2((s - vt * d2 - D * 0.62) / (cell * 1.5) + 31.7, (vTube.z * circ - vb * d2) / (cy * 1.5) + vFlow.y * 5.0);
        float g1 = grainLayer(u1, wrap, 0.34, 0.8), g2 = grainLayer(u2, max(1.0, floor(wrap / 1.5 + 0.5)), 0.3, 0.9);
        // a main seen from just above its own skin is all grazing angles: its grains stay in right to the rind
        float thickV = smoothstep(3.0, 4.5, r0);
        float inC = smoothstep(mix(0.1, 0.02, thickV), mix(0.5, 0.2, thickV), ndv) * smoothstep(33.0, 47.0, s);
        g1 = mix(0.06, g1, keep) * inC; g2 = mix(0.06, g2, keep) * inC;
        // when the fine grains fall below a pixel, larger ones take over, so thin and distant strands still stream
        { float cellF = cell * 2.7, wrapF = max(1.0, floor(circ / cellF + 0.5)), cyF = circ / wrapF;
          float gF = grainLayer(vec2((s - vt * d1 - D) / cellF + 11.3, (vTube.z * circ - vb * d1) / cyF + vFlow.y * 9.0), wrapF, 0.34, 0.95);
          g1 = max(g1, gF * smoothstep(0.3, 0.7, fw) * (1.0 - smoothstep(0.3, 0.8, fw / 2.7)) * inC * gGl); }
        vec3 gcol = uGrain * (0.3 + 0.5 * back);
        // the deep layer is seen through more honey: warmer and fainter; a thin bright lee follows each near grain
        // through-lit honey is bright enough for the tone curve to flatten a grain, so grains bite harder there
        float gk = 1.0 + 0.5 * smoothstep(0.45, 1.1, max(col.r, col.g));
        col = mix(col, gcol * 0.5 + col * 0.6, min(g2 * 0.36 * gk, 0.7));
        col = mix(col, gcol * 1.1 + col * 0.32, min(g1 * 0.5 * gk, 0.85));
        // bright motes ride with the near grains: specks of light caught in the stream
        // (a finer layer, three cells to each grain cell, long in the direction of the flow, quicker than the grains)
        float keep3 = 1.0 - smoothstep(0.1, 0.27, fw);
        vec2 u3 = vec2((s - vt * d1 * 0.5 - D * 1.25) / cell * 2.0 + 57.3, ((vTube.z * circ - vb * d1 * 0.5) / cy + vFlow.y * 17.0) * 3.0);
        float g3 = grainLayer(u3, wrap * 3.0, 0.22, 1.25) * keep3 * inC;
        col += (col * 1.6 + uSunCol * vec3(0.7, 0.5, 0.16)) * g3 * (0.5 + 0.5 * back * back + 0.25 * max(-dot(N, uSun), 0.0));
        // fine lengthwise flow lines and bubble strings
        float fl = sin(vTube.z * wrap * 5.0 + sin(s * 0.07 + vFlow.y * 40.0) * 3.0) * sin(s * 0.9 + vTube.z * 40.0);
        col *= 1.0 + (0.022 + 0.035 * smoothstep(2.5, 4.5, r0)) * fl * keep;
        // on the mains: lengthwise streaks whose beads run with the pulse, so the stream reads even along the tube
        float fzw = fwidth(vTube.z) * wrap * 3.0;
        float fl2 = sin(vTube.z * wrap * 18.85 + sin(s * 0.05 + vFlow.y * 9.0) * 2.0) * (0.55 + 0.45 * sin((s - D) * 0.35 + vTube.z * 18.85));
        col *= 1.0 + 0.06 * thickV * fl2 * (1.0 - smoothstep(0.15, 0.45, fzw));
        // a starving arm goes dull and brown as its flow leaves it; a feeler's swollen tip is young lemon growth
        float starve = step(2.0, vFlow.y) * step(vFlow.y, 3.0) * (1.0 - uBranch.x);
        col = mix(col, (col * 0.5 + uDark * 0.12) * vec3(1.0, 0.82, 0.7), starve * 0.75);
        float fat = step(3.0, vFlow.y) * step(vFlow.y, 4.0) * (uBranch.y - 1.0);          // the arm that takes the flow is the brightest amber there is
        col *= 1.0 + 0.3 * fat;
        float tipG = step(4.0, vFlow.y) * step(vFlow.y, 5.0) * exp(-max(uBranch.z - (s - 1000.0), 0.0) * 0.11);
        col = mix(col, uLemon * (0.75 + 0.5 * ndv), tipG * 0.8);
        // every strand carries a thread of light down its core whose beads run with the pulse
        float xrT = sqrt(max(1.0 - nvp * nvp, 0.0)), coreT = 1.0 - smoothstep(0.0, 0.5, xrT);
        float bead = 0.5 + 0.5 * sin((s - D) * (2.2 / max(r0, 0.5)) + 2.0 * sin(s * 0.11 + vFlow.y * 20.0));
        col *= 1.0 + coreT * coreT * (0.55 * bead * bead - 0.12) * smoothstep(33.0, 47.0, s) * (1.0 - smoothstep(0.5, 1.2, fwidth(s) / max(r0, 0.5)));
        // the pour: slow swells of light run down the three clear strands to the Knot
        float pp = 0.5 + 0.5 * sin((s - D) * 0.11); pp *= pp;
        col = col * (1.0 - 0.14 * pour + 0.42 * pour * pp) + uLemon * (pour * coreT * coreT * (0.04 + 0.4 * pp) * (0.7 + 0.5 * bead));
        col *= 1.0 + 0.28 * vBulge;                       // each travelling bulge gathers a little more light, so the flow reads from afar
        col = skin(col, N, V, ndv, 1.0);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}async function ve(e,d,v,F){const x=new a.SphereGeometry(1,96,44),y=x.attributes.position,w=new a.Vector3,A=new a.Vector3,f=new a.Vector3,_=d.strands.filter(c=>c.kind===0).map(c=>{W(c.a,c.b,c.sag,1,f),W(c.a,c.b,c.sag,.93,A);const o=Math.max(Math.hypot(A.x-f.x,A.z-f.z),1);return{bx:f.x-K.x,bz:f.z-K.z,dx:(A.x-f.x)/o,dz:(A.z-f.z)/o,slope:U((A.y-f.y)/o,-.4,.8),y:f.y-K.y,r:c.r}}),S=new Float32Array(y.count);await F.yield();for(let c=0;c<y.count;c++){w.fromBufferAttribute(y,c);const o=Math.atan2(w.x,w.z),r=1-w.y*w.y,l=r*r*r,i=1-.07*l+.02*Math.sin(o*5+1.7)*l;let u=w.x*i*H,k=w.z*i*H;const n=Math.hypot(u,k),m=u,p=k;let z=0,N=0,R=0;for(const h of _){const g=m-h.bx,b=p-h.bz,D=g*h.dx+b*h.dz,L=g*h.dz-b*h.dx,q=Math.exp(-(L*L)/24)*j(-10,3,D);if(q<.003)continue;const G=15*q*l,O=Math.max(D,0)+G;u+=h.dx*G,k+=h.dz*G,R+=q*(h.y+h.slope*O),q>z&&(z=q,N=O)}const s=w.y<0?1.16:.84+.1*Math.sin(o*3+1)*r,t=w.y*s*oe*(1+.5*z*l)*Y(1,U((21-N)/7,.05,1),z*z)+R*j(22,33,n);y.setXYZ(c,u,t,k),S[c]=z*j(2,12,N),c%2400===2399&&await F.yield()}await F.yield(),x.setAttribute("aLobe",new a.BufferAttribute(S,1)),x.computeVertexNormals(),await F.yield(),x.boundingSphere=new a.Sphere(new a.Vector3,60);const T=[],V=[],P=_.map((c,o)=>o);v.shuffle(P);const B=(c,o)=>new a.Vector3(c.bx+c.dx*11,c.y+c.slope*11+o*.5,c.bz+c.dz*11);for(let c=0;c<6;c++){const o=_[P[c*2]],r=_[P[c*2+1]],l=v()*6.28,i=v.range(2,9),u=new a.Vector4(Math.sin(l)*i,(c-2.5)*2.7+v.range(-.6,.6),Math.cos(l)*i,c%2?1:-1);T.push(B(o,v.range(-2,2)),B(r,v.range(-2,2))),V.push(u,new a.Vector4(u.x,u.y,u.z,-u.w))}const C=new a.ShaderMaterial({fog:!0,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...e,uRopeA:{value:T},uRopeM:{value:V},uKnot:{value:K.clone()},uKS:{value:new a.Vector3(H,oe,H)}},vertexShader:`
      #define IS_VERTEX
      varying vec3 vN, vW, vL, vCam; varying float vLobe;
      attribute float aLobe;
      uniform vec3 uKnot;
      #include <fog_pars_vertex>
      ${ee}
      void main(){
        float br = 1.0 + 0.018 * sin(3.14159265 * uPulseT / uPeriod);
        vec3 p = position * vec3(br, 2.0 - br, br);
        vL = p; vN = normal; vLobe = aLobe;
        vec3 w = p + uKnot; w += swayAt(uKnot) * 0.6; vW = w; vCam = camLocal();
        vec4 mvPosition = viewMatrix * (modelMatrix * vec4(w, 1.0));
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:me}),M=new a.Mesh(x,C);return M.frustumCulled=!1,M}const me=`
  varying vec3 vN, vW, vL, vCam; varying float vLobe;
  uniform vec3 uRopeA[12]; uniform vec4 uRopeM[12]; uniform vec3 uKS, uGrain;
  #include <fog_pars_fragment>
  ${ee}
  ${ae}
  float h31(vec3 p){ p = fract(p * vec3(0.1031, 0.1130, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
  void main(){
    vec3 V = normalize(vCam - vW), rd = -V, N = normalize(vN);
    // faint dimples in the skin (none on the fillets, which must meet the veins cleanly)
    vec3 q = vL * 0.42;
    vec3 dn = vec3(cos(q.x) * sin(q.z + 1.3), 0.6 * cos(q.y * 2.0 + q.x), cos(q.z) * sin(q.x * 1.1 + 0.4)) + 0.5 * vec3(cos(q.x * 2.7 + q.y), 0.0, cos(q.z * 2.3 - q.y));
    N = normalize(N + 0.07 * (1.0 - vLobe) * dn);
    // exit of the view ray from the lens (ellipsoid): thickness in metres
    vec3 o = vL / uKS, d = rd / uKS;
    float a = max(dot(d, d), 1e-6), b = dot(o, d), c = min(dot(o, o) - 1.0, 0.0);
    float thick = max((-b + sqrt(max(b * b - a * c, 0.0))) / a, 0.0);
    vec3 pc = o - d * (b / a); float dc = min(length(pc), 1.0);          // 0 where we look through the middle, 1 at the outline
    float heartS = 1.0 - smoothstep(0.08, 0.72, dc), rimS = smoothstep(0.5, 1.0, dc);
    float ndv = max(dot(N, V), 0.0), back = max(-dot(V, uSun), 0.0);
    // honey lit from inside: how far the sun has come through the lens to the place we are looking at
    vec3 P = vL + rd * min(thick * 0.5, 13.0);
    vec3 po = P / uKS, sd = uSun / uKS;
    float sa2 = max(dot(sd, sd), 1e-6), sb = dot(po, sd), sc = min(dot(po, po) - 1.0, 0.0);
    float tl = max((-sb + sqrt(max(sb * sb - sa2 * sc, 0.0))) / sa2, 0.0);
    float heS = clamp(2.9 + tl * 0.05, 2.9, 4.8);
    vec3 glow = uSunCol * exp(-heS * uAbs) * (0.7 + 0.45 * exp(-tl * 0.05));
    // and the sun seen straight through it when it stands behind
    vec3 trans = exp(-clamp(thick * 0.17, 3.2, 4.4) * uAbs);
    vec3 mid = vL + rd * min(thick * 0.5, 30.0) - uSun * 10.0;
    float heart = exp(-dot(mid, mid) / 760.0);
    float through = 0.5 + 0.5 * back;
    vec3 glowH = uSunCol * exp(-heS * (1.0 - 0.7 * heartS) * uAbs) * (0.7 + 0.45 * exp(-tl * 0.05));   // the heart is clear: far less colour in the way
    vec3 col = glowH * (0.22 + 0.5 * heart + 1.9 * heartS * heartS) + uLemon * (0.8 * heartS * heartS * heartS) + trans * (uSunCol * (0.45 * back * back + heart * (0.2 + 0.5 * back)) + envCol(normalize(rd - N * 0.5)) * 0.3);
    // ropes of grains: found by closest approach of the view ray to each stream's axis
    float D = pulseD(uPulseT), rope = 0.0, sheath = 0.0;
    for (int i = 0; i < 12; i++) {
      vec3 A = uRopeA[i], M = uRopeM[i].xyz; float sg = uRopeM[i].w, fi = float(i);
      vec3 e = M - A; float Ls = max(length(e), 1e-3); e /= Ls;
      vec3 w = vL - A; float be = dot(rd, e), dd = dot(rd, w), ee = dot(e, w), den = max(1.0 - be * be, 1e-3);
      float l = clamp((ee - be * dd) / den, 0.0, Ls);
      float t = clamp(dot(A + e * l - vL, rd), 0.0, thick);
      vec3 dv = vL + rd * t - (A + e * l);
      vec3 cr = cross(rd, e); cr = cr / max(length(cr), 1e-4);
      float side = dot(dv, cr), dist = length(dv), rw = 3.0 + 1.4 * l / Ls;
      // two interwoven strands per rope, grains streaming along it with the pulse
      float lf = l - sg * D * 0.45 + fi * 13.0, braid = 1.25 * sin(l * 0.36 + fi);
      float s1 = abs(side - braid), s2 = abs(side + braid);
      vec2 c1 = vec2(lf / 1.5, (side - braid) / 1.0), c2 = vec2((lf * 0.8 + 5.0) / 1.5, (side + braid) / 1.0 + 9.0);
      vec2 f1 = fract(c1) - 0.5, f2 = fract(c2) - 0.5; float r1 = h21(floor(c1) + 0.5), r2 = h21(floor(c2) + 2.5);
      float g1 = step(0.2, r1) * fall(0.12, 0.22 + 0.24 * r1, length(f1 + (vec2(r1, fract(r1 * 7.3)) - 0.5) * 0.3));
      float g2 = step(0.2, r2) * fall(0.12, 0.22 + 0.24 * r2, length(f2 + (vec2(r2, fract(r2 * 5.7)) - 0.5) * 0.3));
      float body = fall(0.3, 1.0, s1) * (0.74 + 0.26 * g1) + fall(0.3, 1.0, s2) * (0.6 + 0.3 * g2);     // two cords twisting round each other, grainy
      float seen = exp(-t * 0.022) * smoothstep(0.0, 1.5, thick - t + 0.5) * smoothstep(1.2, 5.5, t);   // inside the glass, never on its skin
      rope = max(rope, body * fall(rw * 0.45, rw, dist) * seen);
      sheath = max(sheath, fall(rw * 0.4, rw * 2.8, dist) * seen);
    }
    // each stream pipes light along itself: a gold sheath round the dark grains
    col += sqrt(trans) * uSunCol * sheath * (0.22 + 0.3 * back);
    col = mix(col, uGrain * (0.4 + 0.5 * back) + col * 0.13, clamp(rope * 1.5, 0.0, 1.0) * 0.92);
    // bubbles rising slowly: three slices through a field of cells
    float bub = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i), dep = min(thick * (0.12 + 0.2 * fi), 4.0 + 9.0 * fi);
      vec3 pp = vL + rd * dep;
      pp.y -= uTime * (0.5 + 0.12 * fi); pp.x += 0.5 * sin(pp.y * 0.6 + fi);
      vec3 cid = floor(pp / 3.2), cf = fract(pp / 3.2) - 0.5;
      float hr = h31(cid + fi * 17.0);
      vec3 off = (vec3(hr, fract(hr * 13.7), fract(hr * 91.3)) - 0.5) * 0.5;
      float dq = length(cf - off), rad = 0.05 + 0.09 * fract(hr * 37.1);
      float ring = fall(rad * 0.6, rad, dq) * (0.35 + 0.65 * smoothstep(rad * 0.3, rad, dq));
      bub += step(0.55, hr) * ring * (1.0 - 0.25 * fi) * step(1.0, thick);
    }
    col += uLemon * bub * (0.35 + 0.8 * through) * 0.6 * (1.0 - vLobe);
    float e1 = 1.0 - ndv; col = mix(col, uDark * (0.42 + 0.4 * through), max(0.5 * e1 * e1 * e1 * e1, max(0.62 * (1.0 - smoothstep(3.0, 26.0, thick)), 0.72 * rimS)));
    // the fillets are shaded exactly as the veins they become
    gP = vW; gGl = 1.0;
    float nl, bl; vec3 hc = honey(N, V, 4.2, nl, bl);
    // ... and the lens itself wears the same honey skin, with a clear window into its lit inside where we look straight in
    float window = smoothstep(0.0, 0.16, ndv) * (1.0 - smoothstep(0.45, 1.0, vLobe));
    col = mix(hc, knee(col), window);
    col = skin(col, N, V, mix(max(ndv, 0.2), ndv, vLobe), 0.12);
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }`;async function ge(e,d,v,F,x){const y=e.fly,w=new a.Vector3,A=[],f=(s,t)=>Math.hypot(s.top.x-t.x,s.top.z-t.z)<13&&Math.abs(s.top.y-t.y)<26,_=(s,t)=>{const h=w.set(s.x,s.y-13.5*t,s.z);if($(h,y)<9.5+4.6*t||h.distanceTo(e.seat)<16+5*t||Math.hypot(h.x-K.x,h.z-K.z)<H+9&&Math.abs(h.y-K.y)<oe+16)return!1;for(const g of A)if(f(g,s))return!1;for(const g of e.samples){const b=s.y-g.p.y;if(b>4&&b<21*t&&Math.hypot(g.p.x-s.x,g.p.z-s.z)<5.2*t+g.r)return!1}return!0},S=2+Math.hypot(1+.35,.25)+.2*(1+2.5+1.6)+.25,T=y.map(s=>new a.Vector3(s.x,0,s.z)),V=(s,t,h)=>{let g=1e9;for(let b=0;b<y.length-1;b++)Math.min(y[b].y,y[b+1].y)>t+S||Math.max(y[b].y,y[b+1].y)<t-125-S||(g=Math.min(g,$(w.set(s,0,h),[T[b],T[b+1]])));return g};let P=null;const B=Math.cosh(1.3),C=new a.Vector3,M=new a.Vector3;e:for(const[s,t]of[[0,4],[0,5],[0,3],[1,3],[1,4]])for(const h of[36,50,22])for(const g of[.4,-.2]){const b=e.towers[s],D=e.towers[t];C.copy(e.attach(b,h,D.position,g)),M.copy(e.attach(D,h+6,b.position,-g)),await x.yield();for(let L=8;L<=52;L++){const q=L/60,G=Y(C.x,M.x,q),O=Y(C.z,M.z,q);let X=-1,I=1e9;for(let J=8;J<=14;J++){const te=y[y.length-1-J];if(!te)continue;const re=Math.hypot(te.x-G,te.z-O);re<I&&(I=re,X=y.length-1-J)}if(X<0||I<7||I>9.5)continue;const E=(B-Math.cosh(1.3*(2*q-1)))/(B-1),Z=(Y(C.y,M.y,q)-(y[X].y+13))/E;if(!(Z<12||Z>80||!e.clearOf(C,M,Z,.9,9.5))){P={A:{p:C.clone(),s:150},B:{p:M.clone()},sag:Z,t:q,d:C.distanceTo(M)};break e}}}let c=null;if(P){const{A:s,B:t,sag:h,d:g}=P,b=Math.max(8,Math.round(g/4)),D=new Float32Array((b+1)*3),L=new Float32Array(b+1),q=new Float32Array(b+1);for(let G=0;G<=b;G++){const O=G/b;W(s.p,t.p,h,O,w),D[G*3]=w.x,D[G*3+1]=w.y,D[G*3+2]=w.z,L[G]=.9*(1+1.1*Math.exp(-O*g/4)+1.1*Math.exp(-(1-O)*g/4)),q[G]=s.s+O*g}d.push({P:D,R:L,S:q,sides:6,gain:1,r0:.8,seed:v(),ref:null}),c=W(s.p,t.p,h,P.t,new a.Vector3),A.push({top:c.clone(),scale:.3,s:s.s+P.t*g,sign:1,seed:v(),bead:!1})}for(let s=0;A.length<26+(P?1:0)&&s<3e3;s++){const t=e.samples[Math.floor(v()*e.samples.length)],h=v.range(.86,1.12);if(t.t<.1||t.t>.9)continue;s%20===19&&await x.yield();const g=t.p.clone();g.y-=t.r*.5,_(g,h)&&A.push({top:g,scale:h,s:t.s,sign:A.length%2?1:-1,seed:v(),bead:!1})}let o=!1;if(P&&V(c.x,c.y-20*.3,c.z)<S){const{A:s,B:t,sag:h,d:g}=P,b=Math.round(P.t*240),D=A[0],L=new a.Vector3;o=!0;e:for(let q=1;q<=176;q++)for(const G of[b-q,b+q]){if(G<32||G>208)continue;const O=G/240;if(W(s.p,t.p,h,O,L),!(V(L.x,L.y-20*.3,L.z)<S||A.some(X=>X!==D&&f(X,L)))){P.t=O,c.copy(L),D.top.copy(L),D.s=s.s+O*g,o=!1;break e}}}let r=null,l=1e9;const i=y.slice(Math.max(0,y.length-12));for(const s of A){if(s.scale<.5)continue;const t=w.set(s.top.x,s.top.y-13.5*s.scale,s.top.z),h=$(t,i),g=(t.x-e.seat.x)*e.exit.z-(t.z-e.seat.z)*e.exit.x>0?0:30,b=Math.abs(h-27)+g+.35*Math.abs(t.y+30);b<l&&(l=b,r=s)}r&&(r.sign=1);const{ax:u,ay:k}=e.ring,n=Math.round(11*(.6+.4*F));for(let s=0;s<n;s++){const t=(s+v.range(-.25,.25))/n*Math.PI*2,h=v.range(.1,.17)*(Math.sin(t)<-.3?1.3:1),g=e.seat.clone().addScaledVector(u,Math.cos(t)*9.6).addScaledVector(k,Math.sin(t)*9.6-.6);A.push({top:g,scale:h,s:60+t*9,sign:s%2?1:-1,seed:v(),bead:!0})}for(const s of e.guys){const t=v.range(.3,.7),h=s.a.distanceTo(s.b),g=W(s.a,s.b,h*.05,t,new a.Vector3);$(g,y)>13?A.push({top:g,scale:v.range(.16,.26),s:60+t*h,sign:v()<.5?1:-1,seed:v(),bead:!0}):(v(),v())}const m=[],p=A.filter(s=>!s.bead&&s.scale>.5),z=Math.min(p.length,Math.round(12*F));if(c){const s=v();o||m.push({p:new a.Vector3(c.x,c.y-20*.3,c.z),K:3,off:0,seed:s,hero:1})}const N=v.shuffle(p.map((s,t)=>t));let R=z;for(let s=0;s<z;s++){let t=p[N[s]];for(;t&&V(t.top.x,t.top.y-20*t.scale,t.top.z)<S;)t=p[N[R++]];const h=v.int(3,5),g=v.int(0,4),b=v();t&&m.push({p:new a.Vector3(t.top.x,t.top.y-20*t.scale,t.top.z),K:h,off:g,seed:b,hero:0,res:t})}if((!c||o)&&m.length){let s=0,t=1e9;m.forEach((h,g)=>{const b=$(h.p,i);b<t&&(t=b,s=g)}),m[s].hero=1,m[s].K=3,m[s].off=0}return{res:A,drips:m,swell:r,heroDrip:m.find(s=>s.hero)||null}}function le(e,d){return new a.ShaderMaterial({fog:!0,defines:d?{DRIP:1}:{},uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...e},vertexShader:`
      #define IS_VERTEX
      attribute vec3 iPos; attribute vec4 iPar;
      varying vec3 vN, vW, vCam, vO; varying float vRad, vSeed, vTurn;
      #include <fog_pars_vertex>
      ${ee}
      #ifdef DRIP
      attribute float aPart; uniform float uHeroT, uHeroOn;
      #endif
      void main(){
        vec3 p; vec3 n = normal;
        #ifdef DRIP
          float cyc = iPar.x * uPeriod;
          float tc = mod(uPulseT - uPeriod * 0.5 + iPar.y * uPeriod, cyc);
          float form = clamp((tc - (cyc - 6.0)) / 6.0, 0.0, 1.0), t = tc * (1.0 - step(cyc - 6.0, tc));
          if (iPar.w > 0.5 && uHeroOn > 0.5) { t = max(uHeroT, 0.0); form = clamp(1.0 + uHeroT / 6.0, 0.0, 1.0) * step(uHeroT, 0.0); }
          float fallen = 8.0 * (t - 3.5 * (1.0 - exp(-t / 3.5)));
          float y = mix(1.5 + fallen, 1.5 * form * form, step(0.001, form));
          float sz = mix(1.0 - smoothstep(95.0, 125.0, y), 0.25 + 0.75 * form, step(0.001, form));
          float snap = clamp(1.0 - (y - 12.0) / 4.0, 0.0, 1.0);
          float len = min(y, 12.0) * snap, vv = -position.y;
          float rr = 0.2 * (1.0 - 0.72 * min(y / 12.0, 1.0)) * snap * (1.0 + 2.5 * exp(-vv * len * 1.5) + 1.6 * exp(-(1.0 - vv) * len * 2.2));
          vec3 pt = vec3(position.x * rr, -vv * len, position.z * rr);
          float hang = 1.0 + 0.45 * snap * step(0.5, y) ;
          vec3 pd = position * vec3(sz, sz * hang, sz) - vec3(0.0, y, 0.0);
          p = mix(pt, pd, aPart);
          vRad = mix(rr, 0.5 * sz, aPart); vTurn = 0.0;
        #else
          float sn = sin(3.14159265 * (uPulseT - iPar.y / 400.0) / uPeriod) * iPar.w;
          float vv = -position.y / 20.0, wgt = smoothstep(0.08, 0.55, vv);
          float sw = 1.0 + 0.3 * sn * wgt;
          p = position * vec3(sw, 1.0 + 0.07 * sn, sw) * iPar.x;
          // a slow pendulum swing about the neck
          float sg = 0.03 * sin(uTime * 0.6 + iPar.z * 40.0);
          p.x += -p.y * sg; p.z += -p.y * 0.6 * 0.03 * sin(uTime * 0.47 + iPar.z * 23.0);
          vRad = length(position.xz) * sw * iPar.x; vTurn = pulseD(uPulseT - iPar.y / 400.0) * iPar.w;
        #endif
        vO = p; vN = n; vSeed = iPar.z;
        vec3 w = p + iPos + swayAt(iPos); vW = w; vCam = camLocal();
        vec4 mvPosition = viewMatrix * (modelMatrix * vec4(w, 1.0));
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vN, vW, vCam, vO; varying float vRad, vSeed, vTurn;
      uniform vec3 uGrain;
      #include <fog_pars_fragment>
      ${ee}
      ${ae}
      void main(){
        vec3 N = normalize(vN), V = normalize(vCam - vW);
        float ndv, back;
        gP = vW; gGl = 1.0;
        vec3 col = honey(N, V, max(vRad, 0.02), ndv, back);
        #ifndef DRIP
          // grains turning inside, two depths turning at different rates
          float zz = abs(vO.z) < 1e-4 ? 1e-4 : vO.z;
          float ang = atan(vO.x, zz) / 6.2832;
          float cell = clamp(vRad * 0.3, 0.2, 1.0);
          float keep = 1.0 - smoothstep(0.3, 0.8, (fwidth(vO.y) + fwidth(vO.x)) / cell);
          float g1 = grainLayer(vec2(vO.y / cell + vSeed * 31.0 + vTurn * 0.01, (ang + vTurn * 0.0045) * 26.0), 26.0, 0.8, 0.8);
          float g2 = grainLayer(vec2(vO.y / (cell * 1.6) + vSeed * 7.0, (ang - vTurn * 0.003 + 0.37) * 17.0), 17.0, 0.8, 0.9);
          float g3 = grainLayer(vec2(vO.y / cell * 2.0 + vSeed * 13.0 - vTurn * 0.016, (ang + vTurn * 0.007 + 0.61) * 52.0), 52.0, 0.5, 0.7) * (1.0 - smoothstep(0.12, 0.3, (fwidth(vO.y) + fwidth(vO.x)) / cell));
          g1 = mix(0.06, g1, keep); g2 = mix(0.06, g2, keep);
          vec3 gcol = uGrain * (0.3 + 0.5 * back);
          float inside = smoothstep(0.3, 1.2, vRad);
          col = mix(col, gcol + col * 0.4, g2 * 0.3 * inside);
          col = mix(col, gcol * 0.8 + col * 0.25, g1 * 0.5 * inside);
          float band = 0.5 + 0.5 * sin(ang * 37.7 + vO.y / cell * 0.8 + vTurn * 0.012 + vSeed * 40.0);
          col += (col * 0.7 + uSunCol * vec3(0.4, 0.26, 0.06)) * g3 * band * band * band * inside * smoothstep(0.15, 0.5, ndv) * (0.4 + 0.5 * back * back);     // bright motes turning with them
        #else
          col *= 1.2;
        #endif
        { float xe = 1.0 - ndv, aw = smoothstep(0.15, 0.85, -dot(N, uSun)); col += (col * 0.9 + uLemon * 0.3) * aw * xe * xe * (1.0 - xe * xe * xe); }   // the far edge takes the light
        col = skin(col, N, V, ndv, 1.0);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}function we(e,d,v){const F=[];for(let n=0;n<=13;n++){const m=1-n/13,p=m*Math.PI,z=Math.sin(p)*Math.pow(Math.sin(p/2),1.6)/.7;F.push(new a.Vector2(n===0?0:Math.max(z*4,.95*(1-m)*(1-m)*(1-m)),-20*(1-Math.cos(p))/2))}const x=new a.LatheGeometry(F,20),y=new a.InstancedBufferGeometry;y.index=x.index,y.setAttribute("position",x.attributes.position),y.setAttribute("normal",x.attributes.normal);const w=d.res.length,A=new Float32Array(w*3),f=new Float32Array(w*4);d.res.forEach((n,m)=>{A.set([n.top.x,n.top.y,n.top.z],m*3),f.set([n.scale,n.s,n.seed,n.sign],m*4)}),y.setAttribute("iPos",new a.InstancedBufferAttribute(A,3)),y.setAttribute("iPar",new a.InstancedBufferAttribute(f,4)),y.instanceCount=w;const _=new a.Mesh(y,le(e,!1));_.frustumCulled=!1;const S=d.drips.length,T=[],V=[],P=[],B=[],C=6,M=10;for(let n=0;n<=M;n++)for(let m=0;m<=C;m++){const p=m/C*Math.PI*2;T.push(Math.cos(p),-n/M,Math.sin(p)),V.push(Math.cos(p),0,Math.sin(p)),P.push(0)}for(let n=0;n<M;n++)for(let m=0;m<C;m++){const p=n*(C+1)+m,z=p+C+1;B.push(p,p+1,z,z,p+1,z+1)}const c=new a.SphereGeometry(.5,16,12),o=T.length/3;for(let n=0;n<c.attributes.position.count;n++)T.push(c.attributes.position.getX(n),c.attributes.position.getY(n),c.attributes.position.getZ(n)),V.push(c.attributes.normal.getX(n),c.attributes.normal.getY(n),c.attributes.normal.getZ(n)),P.push(1);for(let n=0;n<c.index.count;n++)B.push(c.index.getX(n)+o);c.dispose();const r=new a.InstancedBufferGeometry;r.setAttribute("position",new a.Float32BufferAttribute(T,3)),r.setAttribute("normal",new a.Float32BufferAttribute(V,3)),r.setAttribute("aPart",new a.Float32BufferAttribute(P,1)),r.setIndex(B);const l=new Float32Array(S*3),i=new Float32Array(S*4);d.drips.forEach((n,m)=>{l.set([n.p.x,n.p.y,n.p.z],m*3),i.set([n.K,n.off,n.seed,n.hero],m*4)}),r.setAttribute("iPos",new a.InstancedBufferAttribute(l,3)),r.setAttribute("iPar",new a.InstancedBufferAttribute(i,4)),r.instanceCount=S;const u=le(e,!0),k=new a.Mesh(r,u);return k.frustumCulled=!1,{tear:_,drip:k}}async function ye(e,d,v,F,x){const f=e.towers.length,_=v.uSun.value,S=new Float32Array(2257*f*3),T=new Float32Array(2257*f*3),V=new Float32Array(2257*f*4),P=new Uint32Array(2160*6*f),B=new Float32Array(2257*f*3),C=new Float32Array(2257*f*4),M=new a.Color(d[0]).multiplyScalar(.72),c=new a.Color(d[1]),o=new a.Color(d[6]),r=new a.Color("#F3E9D2").multiplyScalar(.8),l=new a.Color;let i=0;for(let n=0;n<f;n++){const m=e.towers[n],p=m.height,z=m.seed,N=n*2257,R=-78;for(let s=0;s<=36;s++){const t=s/36,h=t<.28?Y(R,0,t/.28):Y(0,p,Math.pow((t-.28)/.72,.9));for(let g=0;g<=60;g++){const b=g/60*Math.PI*2,D=Math.sin(b),L=Math.cos(b),q=ne(m,b,h,F),G=Q.groove,O=Q.cap,X=Q.h,I=N+s*61+g,E=I*3;S[E]=m.position.x+D*q,S[E+1]=h+F.n2(D*4+z,L*4)*1.2*O,S[E+2]=m.position.z+L*q;const Z=.5+.5*F.n2(b*9+z*3,h*.03);l.copy(M).multiplyScalar(.84+.22*G+.12*(Z-.5)),l.lerp(c,.2*(1-G)+.1*j(0,-60,h)),l.lerp(r,.5*O+.25*j(.6,1,X)*G);const J=U(-(D*_.x+L*_.z),0,1),te=j(.15,.6,F.n3(D*2.2+z,h*.06,L*2.2)+.5*J-.25*X)*.5;l.lerp(o,te*.8),T[E]=l.r,T[E+1]=l.g,T[E+2]=l.b,V[I*4]=G,V[I*4+1]=O,V[I*4+2]=b,V[I*4+3]=z,B[E]=p,B[E+1]=b*m.flutes*.5+F.n2(D*2+z,h*.02)*.9,B[E+2]=m.radius,C[I*4]=m.ledges[0],C[I*4+1]=m.ledges[1],C[I*4+2]=m.ledges[2],C[I*4+3]=m.ledges[3]}s%8===7&&await x.yield()}for(let s=0;s<36;s++)for(let t=0;t<60;t++){const h=N+s*61+t,g=h+60+1;P[i++]=h,P[i++]=h+1,P[i++]=g,P[i++]=g,P[i++]=h+1,P[i++]=g+1}}const u=new a.BufferGeometry;u.setAttribute("position",new a.BufferAttribute(S,3)),u.setAttribute("color",new a.BufferAttribute(T,3)),u.setAttribute("aRock",new a.BufferAttribute(V,4)),u.setAttribute("aTow",new a.BufferAttribute(B,3)),u.setAttribute("aLedge",new a.BufferAttribute(C,4)),u.setIndex(new a.BufferAttribute(P,1)),await x.yield(),u.computeVertexNormals(),await x.yield();const k=new a.ShaderMaterial({fog:!0,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),uSun:v.uSun,uSunCol:v.uSunCol,uSky:v.uSky,uShade:v.uShade},vertexShader:`
      attribute vec3 color; attribute vec4 aRock;
      varying vec3 vN, vCol, vP; varying vec4 vRock;
      attribute vec3 aTow; attribute vec4 aLedge; varying vec3 vTow; varying vec4 vLedge;
      #include <fog_pars_vertex>
      void main(){
        vN = normal; vCol = color; vP = position; vRock = aRock;
        vTow = aTow; vLedge = aLedge;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vN, vCol, vP; varying vec4 vRock;
      varying vec3 vTow; varying vec4 vLedge;
      uniform vec3 uSun, uSunCol, uSky, uShade;
      #include <fog_pars_fragment>
      void main(){
        vec3 N = normalize(vN);
        float ridge = vRock.x, cap = vRock.y;
        // fine solution grooves (an angular function, faded before they alias) and faint bedding
        float ph = vRock.z * 46.0 + sin(vP.y * 0.11 + vRock.w) * 1.4, fw = fwidth(ph);
        float fine = mix(0.6, abs(sin(ph)), 1.0 - smoothstep(0.2, 0.7, fw));
        float bed = sin(vP.y * 0.41 + sin(vRock.z * 3.0 + vRock.w) * 2.0 + sin(vP.y * 0.13) * 3.0);
        vec3 alb = vCol * (0.88 + 0.16 * fine * (1.0 - 0.6 * cap) + 0.04 * bed);
        float ao = 0.62 + 0.38 * ridge;
        // K8: THE STONE'S RELIEF PER PIXEL, the same rule as on the world's lattice towers, written from this tower's own
        // height, radius, four ledge heights and flute phase (vTow, vLedge). It goes into the fill's occlusion and the
        // shading normal only; it reads no camera and no distance, and fades only by its own width on the screen.
        {
          float tH = max(vTow.x, 1.0), fa = vTow.y, ta = vRock.z, tsd = vRock.w;
          // the flute's knife ridge, cut per pixel from the interpolated phase: live's occlusion (the line above) is
          // taken from the pixel's own groove value in place of the one interpolated between the mesh's columns; no
          // second occlusion is laid over it. Finer than a pixel it is live's again.
          float flP = abs(sin(fa)), grooveP = (1.0 - flP) * (1.0 - flP), rKeep = 1.0 - smoothstep(0.2, 0.7, fwidth(fa));
          float rAo = mix(1.0, (0.62 + 0.38 * grooveP) / (0.62 + 0.38 * clamp(ridge, 0.0, 1.0)), rKeep);
          // ridges and runnels turn the normal round the tower, by the tilts the lattice towers carry (the same stone)
          float gKeep = 1.0 - smoothstep(0.2, 0.7, fw);
          vec3 tang = vec3(cos(ta), 0.0, -sin(ta));
          vec3 Nr = N + tang * (0.5 * cos(fa) * sign(sin(fa)) * rKeep + 0.22 * cos(ph) * sign(sin(ph)) * gKeep) * (1.0 - cap);
          // fine solution grooves: nil on the knife ridge (sin(ph) = 0), only in the runnel at the bottom (abs(sin(ph))
          // to the 32nd, an eighth of the groove wide); depth 0.22 as on the lattice towers; its mean where finer than a pixel
          float gS = sin(ph); gS *= gS; gS *= gS; gS *= gS; gS *= gS; gS *= gS;
          rAo *= 1.0 - 0.22 * (1.0 - 0.6 * cap) * mix(0.14, gS, gKeep);
          // the four ledges at this tower's own heights (towerR): under each lip the rock swells out by 0.09 of the radius
          // over 0.035 - 0.004 of the height and stands in the lip's shade; at the lip it steps back by 0.12 of the radius
          float crown = 0.5 + 0.5 * sin(ta * 2.0 + tsd) * cos(ta * 3.0 - tsd * 1.7);
          float h0 = clamp(vP.y / tH, 0.0, 1.0), h = clamp(h0 + 0.17 * crown * smoothstep(0.45, 0.95, h0), 0.0, 1.0);
          float fwh = fwidth(h), rel = vTow.z / tH, lipW = 0.035 - 0.004;
          float topW = max(0.25 * 0.12 * rel, 1e-4);          // a shelf falls outward at one in four: its top is a band a quarter of its depth tall
          float under = 0.0, tilt = 0.0, top = 0.0;
          for (int k = 0; k < 4; k++) {
            float lg = vLedge[k] + 0.025 * sin(ta * 2.0 + float(k) * 2.1 + tsd);
            float below = clamp((lg - h) / max(fwh, 1e-5) + 0.5, 0.0, 1.0);
            float tt = clamp((h - (lg - 0.035)) / lipW, 0.0, 1.0);
            under = max(under, tt * tt * (3.0 - 2.0 * tt) * below);
            tilt = max(tilt, 6.0 * tt * (1.0 - tt) * below);
            top = max(top, (1.0 - below) * (1.0 - smoothstep(0.0, topW, h - lg)));
          }
          float lKeep = (1.0 - smoothstep(0.3, 1.0, fwh / lipW)) * (1.0 - cap), tKeep = (1.0 - smoothstep(0.3, 1.0, fwh / topW)) * (1.0 - cap);
          rAo *= 1.0 - 0.25 * under * lKeep;                   // under a lip a quarter of the sky fill goes, as on the lattice towers
          Nr.y -= min(0.09 * rel / lipW * tilt, 2.0) * lKeep;
          Nr = Nr / max(length(Nr), 1e-4);
          Nr = mix(Nr, vec3(0.0, 1.0, 0.0), top * tKeep);
          N = Nr / max(length(Nr), 1e-4); ao *= rAo;
        }
        // the gorge below the lip never sees the low sun
        float sunVis = 0.12 + 0.88 * smoothstep(-26.0, 4.0, vP.y);
        float ndl = max(dot(N, uSun), 0.0);
        vec3 fill = mix(uShade * 1.5 + vec3(0.17, 0.17, 0.21), uSky * vec3(0.62, 0.62, 0.76) + vec3(0.1, 0.1, 0.13), 0.5 + 0.5 * N.y) * ao;
        vec3 col = alb * (fill + uSunCol * vec3(0.84, 0.78, 0.62) * ndl * sunVis * (0.8 + 0.2 * ridge));
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`});return new a.Mesh(u,k)}async function xe(e,d={}){const v=e.rng,F=e.noise,x=Array.isArray(d.palette)&&d.palette.length>=7?d.palette:ce,y=U(d.detail??e.quality?.detail??1,.6,1),w=d.period??8,A=d.duration??46,f=await he(v,y,F,e);await e.yield();const _=await ue(f,v,y,F,e);await e.yield();const S=await ge(f,_,v,y,e);await e.yield();const T=a.MathUtils.degToRad(50)-f.head,V=a.MathUtils.degToRad(15),P=(d.sunDir?d.sunDir.clone():new a.Vector3(Math.sin(T)*Math.cos(V),Math.sin(V),Math.cos(T)*Math.cos(V))).normalize(),B=new a.Color(x[2]),C=v.range(.92,1.1),M=new a.Vector3(-Math.log(Math.max(B.r,.004)),-Math.log(Math.max(B.g,.004))*C,-Math.log(Math.max(B.b,.004))*1.15).multiplyScalar(.25);M.x=Math.max(M.x,.012);const c=de(x,{period:w,abs:M,seat:f.seat.clone(),sunDir:P,sunColor:d.sunColor??"#FFE7C2",skyColor:d.skyColor??x[5],shadeColor:d.shadeColor??"#4F6690"}),o=new a.Group;o.name="amber-reticulum:crossing";const r=await ie(_,e),l=new a.Mesh(r,pe(c));l.frustumCulled=!1,o.add(l),await e.yield(),await e.yield();const i=await ve(c,f,v,e);o.add(i),await e.yield();const{tear:u,drip:k}=we(c,S,f);o.add(u,k),await e.yield(),d.towers!==!1&&o.add(await ye(f,x,c,F,e)),await e.yield();const n=[],m=f.fly.slice(Math.max(0,f.fly.length-12));for(const t of f.samples){if(n.length>=14)break;const h=$(t.p,m);h<13||h>70||t.p.y<-75||n.some(g=>g.position.distanceTo(t.p)<9)||n.push({position:new a.Vector3(t.p.x,t.p.y+t.r,t.p.z)})}const p=f.fly,z=p[Math.min(4,p.length-1)],N={knot:K.clone(),knotRadius:H,knotThickness:oe*2,portalSeat:{position:f.seat.clone(),normal:f.exit.clone().multiplyScalar(-1),radius:7},flyThrough:p.map(t=>t.clone()),exitHeading:f.exit.clone(),viewpoints:{sideOn:new a.Vector3(z.x+60,z.y+6,z.z-10),underKnot:new a.Vector3(-30,-88,-70),approach:p[Math.max(0,p.length-7)].clone()},towers:f.towers.map(t=>({position:t.position.clone(),radius:t.radius,height:t.height,lip:t.lip})),lipVein:new a.Vector3(f.towers[0].position.x+6,2,-se-6),reservoirs:S.res.filter(t=>!t.bead&&t.scale>.5).map(t=>new a.Vector3(t.top.x,t.top.y-13.5*t.scale,t.top.z)),perches:n,heroDrip:S.heroDrip?S.heroDrip.p.clone():null,swellReservoir:S.swell?new a.Vector3(S.swell.top.x,S.swell.top.y-13.5*S.swell.scale,S.swell.top.z):null,sunDir:P.clone(),strandSamples:f.samples.map(t=>({p:t.p.clone(),r:t.r}))};let R=null;const s=t=>70*Math.sin(Math.PI*t/w)+1.5*t;return{object:o,radius:215,height:175,center:new a.Vector3(0,-22,0),anchors:N,ground:!0,groundY:-200,pulse:s,veinKit:{meshTubes:ie,material:l.material,uniforms:c,glsl:ae},setPulseTime(t){R=t},setProgress(t){c.uHeroOn.value=1,c.uHeroT.value=(t-.83)*A},setSun(t,h){c.uSun.value.copy(t).normalize(),h&&c.uSunCol.value.set(h).multiplyScalar(1.1)},update(t,h){c.uTime.value=h,c.uPulseT.value=R??h},dispose(){}}}export{xe as buildHero};
