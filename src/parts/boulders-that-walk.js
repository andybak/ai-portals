import*as i from"three";import{clamp as Q,lerp as G,smoothstep as W}from"../kit/core.js";const j=["#DDE6EA","#8FA3C4","#6B5B4B","#C9B48A","#F3E3C3","#2F3B45","#F29A4B"],q=Math.PI*2,H=n=>{const e=new i.Color(n);return[e.r,e.g,e.b]},Z=(n,e,a)=>[n[0]+(e[0]-n[0])*a,n[1]+(e[1]-n[1])*a,n[2]+(e[2]-n[2])*a],N=(n,e)=>[n[0]*e,n[1]*e,n[2]*e];function n0(){const n=[],e=[],a=[],c=[],y=[],_=[],p={count:0,v(f,d,F,V,C){return n.push(f[0],f[1],f[2]),e.push(d[0],d[1],d[2]),a.push(F[0],F[1],F[2],F[3]),c.push(V[0],V[1],V[2]),y.push(C?C[0]:0,C?C[1]:0,C?C[2]:0),p.count++},tri(f,d,F){_.push(f,d,F)},grid(f,d,F,V=!1,C=!1){const b=V?f:f+1,g=p.count;for(let M=0;M<=d;M++)for(let T=0;T<b;T++){const L=F(T/f,M/d,T,M);p.v(L.p,L.c,L.b,L.pv,L.s)}for(let M=0;M<d;M++)for(let T=0;T<f;T++){const L=V?(T+1)%f:T+1,s=g+M*b+T,k=g+M*b+L,A=g+(M+1)*b+L,v=g+(M+1)*b+T;C?_.push(s,A,k,s,v,A):_.push(s,k,A,s,A,v)}return g},cone(f,d,F,V,C,b,g,M,T,L,s=1,k=!1){const A=Math.abs(d[1])>.9?[1,0,0]:[0,1,0],v=O($(d,A)),x=$(d,v),S=k?[[0,1],[.5,.52],[1,0]]:p.low?[[0,1],[.6,.62],[1,0]]:[[0,1],[.45,.78],[.82,.42],[1,0]];p.low&&(C=Math.min(C,3)),p.grid(C,S.length-1,(l,h,U,r)=>{const o=l*q,w=F*S[r][1],m=V*S[r][0],u=Math.cos(o)*w,t=Math.sin(o)*w*s;return{p:[f[0]+d[0]*m+v[0]*u+x[0]*t,f[1]+d[1]*m+v[1]*u+x[1]*t,f[2]+d[2]*m+v[2]*u+x[2]*t],c:Z(b,g,S[r][0]),b:M,pv:T,s:L}},!0)},build(){const f=new i.BufferGeometry;return f.setAttribute("position",new i.Float32BufferAttribute(n,3)),f.setAttribute("color",new i.Float32BufferAttribute(e,3)),f.setAttribute("aBone",new i.Float32BufferAttribute(a,4)),f.setAttribute("aPivot",new i.Float32BufferAttribute(c,3)),f.setAttribute("aShell",new i.Float32BufferAttribute(y,3)),f.setIndex(_),f.computeVertexNormals(),f}};return p}const $=(n,e)=>[n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]],O=n=>{const e=Math.hypot(n[0],n[1],n[2])||1;return[n[0]/e,n[1]/e,n[2]/e]},e0=(n,e)=>Math.sign(n)*Math.pow(Math.abs(n),e);function m0(n){const e=n==="doedicurus",a=e?{hw:.8,front:1.1,back:1.06,top:1.52,apexZ:.22,rim:.36,notchF:.3,notchB:.26,hump:.17}:{hw:.76,front:1.02,back:.98,top:1.5,apexZ:-.14,rim:.35,notchF:.3,notchB:.24,hump:0};return a.rimAt=c=>{const y=Math.cos(c),_=Math.exp(-Math.pow((1-y)/.11,1.6)),p=Math.exp(-Math.pow((1+y)/.075,1.6));return a.rim+a.notchF*_+a.notchB*p},a.at=(c,y)=>{const _=Math.sin(c),p=Math.cos(c),f=.82,d=e0(_,f)*a.hw,F=e0(p,f)*(p>0?a.front:a.back),V=p*.5+.5,C=G(.36,.56,Math.pow(V,1.5))+.1*Math.abs(_),b=y*Math.PI*.5,g=Math.pow(Math.cos(b),C*1.25),M=Math.pow(Math.sin(b),.92),T=a.rimAt(c);let L=T+(a.top-T)*M;const s=a.apexZ*(1-g);let k=F*g+s;return e&&(L+=a.hump*Math.exp(-Math.pow((k-.42)/.34,2))*Math.pow(Math.max(0,Math.cos(Math.asin(Q(d*g/a.hw,-1,1)))),1.5)*M),[d*g,L,k]},a}const s0=n=>{let e;for(;!(e=n.next()).done;);return e.value},r0=async(n,e)=>{let a;for(;!(a=n.next()).done;)e&&await e();return a.value};function v0(n,e={}){const[a,c]=s0(c0(n,e));return s0(l0(a,c))}async function i0(n,e={},a=null){const[c,y]=await r0(c0(n,e),a);return a&&await a(),r0(l0(c,y),a)}function*c0(n,e){const a=e.kind==="doedicurus"?"doedicurus":"glyptodon",c=a==="doedicurus",y=e.lod??1,_=e.palette||j,p=m0(a),f=n0();f.low=y<1;const d=H(c?"#7c746c":_[2]),F=H("#75624f"),V=H("#6e5a49"),C=H("#221d1a"),b=H(_[0]),g=H("#8c8274"),M=[0,0,0],T=Math.round(64*y/4)*4,L=Math.round(20*y),s=v=>{let x=0,S=p.at(v,0);for(let l=1;l<=10;l++){const h=p.at(v,l/10);x+=Math.hypot(h[0]-S[0],h[1]-S[1],h[2]-S[2]),S=h}return x},k=[];for(let v=0;v<T;v++)k.push(s(v/T*q));f.grid(T,L,(v,x,S)=>{const l=v*q,h=1-Math.pow(1-x,1.35),U=p.at(l,h),r=k[S]*(1-h),o=G(1.1,.76,W(.35,1,h))*(.94+.1*Math.sin(l*5+h*9)*Math.sin(l*3-h*4));return{p:U,c:N(d,o),b:[0,0,0,1],pv:M,s:[Math.sin(l)*r,Math.cos(l)*r,1]}},!0),yield,f.grid(T,2,(v,x,S,l)=>{const h=v*q,U=p.at(h,0),r=p.at(h,.25),o=[U[0]*.9,U[1]+.012,U[2]*.92];return{p:l===0?U:l===1?o:[r[0]*.8,r[1],r[2]*.84],c:l===0?N(d,.9):N(F,.55),b:[0,0,0,l===0?1:0],pv:M,s:[0,0,0]}},!0,!0);{const v=c?36:44,x=360,S=[0];let l=p.at(0,0);for(let r=1;r<=x;r++){const o=p.at(r/x*q,0);S.push(S[r-1]+Math.hypot(o[0]-l[0],o[1]-l[1],o[2]-l[2])),l=o}const h=S[x];let U=0;for(let r=0;r<v;r++){const o=(r+.5)/v*h;for(;S[U+1]<o;)U++;const w=(U+(o-S[U])/Math.max(1e-6,S[U+1]-S[U]))/x*q,m=p.at(w,.03),u=O([Math.sin(w)*1,-.95,Math.cos(w)*1]),t=(p.rimAt(w)-p.rim)/.3,B=(c?.55:1)*G(1,.6,Q(t,0,1))*(.92+.16*n());f.cone([m[0]*.985,m[1],m[2]*.985],u,h/v*.52*B+.012,(c?.05:.105)*B,y<1?4:6,N(d,.95),N(Z(d,H("#B98A52"),.4),.95),[0,0,0,.42],M,[0,0,0])}}yield,f.grid(Math.round(10*y),8,(v,x)=>{const S=v*q,l=G(-.86,.84,x),h=Math.sin(x*Math.PI),U=W(.55,.86,x)*(1-.3*W(.93,1,x)),r=Math.max(.3+.3*Math.pow(h,.6),.55*U),o=Math.max(.2+.2*Math.pow(h,.6),.34*U),w=.6+.03*h;return{p:[Math.sin(S)*r,w-Math.cos(S)*o*(Math.cos(S)>0?1:1.2),l],c:N(Z(V,F,U*.7),.8+.3*Math.cos(S)+.25*U),b:[0,0,0,.15],pv:M,s:[0,0,0]}},!0);const A=[0,.56,.8];{const v=[0,.57,.66],x=O([0,-.16,1]),S=.92,l=[[0,.175,.17,0],[.22,.165,.17,0],[.4,.17,.185,0],[.5,.205,.21,.005],[.62,.215,.215,.01],[.76,.185,.205,.02],[.88,.15,.18,.03],[.96,.125,.14,.04],[1,.05,.06,.05]],h=Math.round(14*y/2)*2;f.grid(h,l.length-1,(o,w,m,u)=>{const t=l[u],B=o*q,P=Math.sin(B),z=Math.cos(B),D=u>=3&&u<=6&&z>.42?1:0,R=u>=2?1.12:1,I=e0(P,.72)*t[1]*R*(z<-.2?.86:1),K=e0(z,.78)*t[2]*R*(z>0?.92:1.08)+D*.03,E=v[2]+x[2]*S*t[0],X=v[1]+x[1]*S*t[0]-t[3];let Y=N(Z(F,H("#c2a888"),u>=2?.62:.2),.92+.22*z);D&&(Y=N(Z(d,H("#B98A52"),.55),(m+u)%2?1.18:.98)),u>=7?Y=C:u===6&&z<.4&&(Y=Z(Y,C,.6)),u>=5&&u<7&&z<-.5&&(Y=N(F,.42));const o0=W(.02,.36,t[0]);return{p:[I*(1+D*.04),X+K,E],c:Y,b:[1,o0,0,D?.85:.42],pv:A,s:D?[I*1.5,E*1.5,.8]:[0,0,0]}},!0);const U=[1,1,0,.2],r=o=>[v[2]+x[2]*S*o,v[1]+x[1]*S*o];for(const o of[-1,1]){const[w,m]=r(.66);f.grid(8,3,(I,K)=>{const E=I*q,X=K*Math.PI;return{p:[o*(.214+.012*Math.sin(X)),m+.078+.058*Math.sin(X)*Math.sin(E),w+.004+.062*Math.sin(X)*Math.cos(E)*1.2],c:[.66,.56,.42],b:[1,1,5,0],pv:A,s:[0,0,0]}},!0,o>0),f.grid(6,3,(I,K)=>{const E=I*q,X=K*Math.PI;return{p:[o*(.222+.02*Math.cos(X)*.4+0)+o*.016*Math.sin(X),m+.078+.036*Math.sin(X)*Math.sin(E),w+.004+.036*Math.sin(X)*Math.cos(E)*1.25],c:[.012,.01,.009],b:[1,1,5,0],pv:A,s:[0,0,0]}},!0,o>0);const u=f.v([o*.2445,m+.096,w+.006],[1.6,1.5,1.3],[1,1,5,0],A),t=f.v([o*.2445,m+.084,w+.018],[1.6,1.5,1.3],[1,1,5,0],A),B=f.v([o*.2445,m+.099,w+.022],[1.6,1.5,1.3],[1,1,5,0],A);o>0?f.tri(u,t,B):f.tri(u,B,t);const[P,z]=r(.47);f.cone([o*.195,z+.145,P],O([o*.75,.6,-.3]),.045,.1,5,N(F,1.1),N(F,.8),U,A,null,.55);const[D,R]=r(.7);f.cone([o*.205,R-.07,D],O([o*.12,-1,.12]),.06,.17,5,N(F,.95),N(F,.7),U,A,null,.7)}}return[f,{K:p,D:c,lod:y,rng:n,horn:d,hide:F,hair:V,dark:C,frost:b,claw:g,Z3:M}]}function*l0(n,e){const{K:a,D:c,lod:y,rng:_,horn:p,hide:f,hair:d,dark:F,frost:V,claw:C}=e;for(let l=0;l<4;l++){const h=l%2===0,U=l<2?1:-1,r=h?1.26:1,o=h?[U*.43,.62,-.47]:[U*.4,.6,.5],w=h?[U*.5,0,-.5]:[U*.45,0,.53],m=h?.07:-.06,u=[[0,.17,0],[.24,.168,.4],[.48,.14,1],[.7,.105,.35],[.86,.1,0],[.95,.13,-.5],[1,.142,-.6]],t=Math.round(10*y/2)*2;n.grid(t,u.length-1,(P,z,D,R)=>{const I=u[R],K=P*q,E=I[1]*r,X=I[0],Y=G(o[0],w[0],X),o0=G(o[1],w[1],X),p0=G(o[2],w[2],X)+m*I[2]*(I[2]<0?-1:1)*(I[2]<0?h?.6:-.9:1),d0=.75+.3*Math.sin(K*5+R*2.1)*Math.sin(K*3+R);return{p:[Y+Math.sin(K)*E,o0,p0+Math.cos(K)*E*(R>=5?1.18:1.05)],c:N(R>=5?f:d,d0),b:[2,1-X,l,.3],pv:o,s:[0,0,0]}},!0);const B=h?3:4;for(let P=0;P<B;P++){const z=((P+.5)/B-.5)*1.9+U*.25,D=.125*r;n.cone([w[0]+Math.sin(z)*D,.045,w[2]+.03+Math.cos(z)*D],O([Math.sin(z),-.28,Math.cos(z)]),.05*r,.105*r,y<1?4:5,N(C,.7),C,[2,0,l,.2],o,null,.75)}}yield;const b=c?[0,.47,-.9]:[0,.45,-.82],g=O(c?[0,-.05,-1]:[0,-.25,-1]),M=c?1.5:1.02,T=[1,0,0],L=$(T,g),s=(l,h,U,r)=>{const o=Math.sin(h)*U,w=-Math.cos(h)*r;return[b[0]+g[0]*M*l+T[0]*o+L[0]*w,b[1]+g[1]*M*l+T[1]*o+L[1]*w,b[2]+g[2]*M*l+T[2]*o+L[2]*w]},k=Math.round(10*y/2)*2,A=c?4:9,v=c?.34:.93,x=l=>c?G(.18,.12,Math.pow(l/.34,.8)):G(.18,.05,Math.pow(l,.85));for(let l=0;l<A;l++){const h=l/A*v,U=(l+1)/A*v,r=x(h),o=x(U);if(n.grid(k,2,(w,m,u,t)=>{const B=w*q,P=t===0?h:t===1?G(h,U,.84):G(h,U,.9),z=t===0?r*.9:t===1?r*1.1:o*.86;return{p:s(P,B,z,z),c:N(p,(t===2?.45:t===1?1.08:.8)*(c?.72:1)),b:[3,P,r,.8],pv:b,s:[B*r,P*M,.45]}},!0),!c){const w=y<1?3:5,m=G(h,U,.74);for(let u=0;u<w;u++){const t=Math.PI+((u+.5)/w-.5)*4.4+l%2*.3,B=[Math.sin(t),-Math.cos(t)*L[1],-Math.cos(t)*L[2]],P=s(m,t,r*1,r*1),z=O([B[0]*.9+g[0]*.35,B[1]*.9+g[1]*.35,B[2]*.9+g[2]*.35]);n.cone(P,z,.02+r*.15,(.06+r*.5)*(.85+.3*_()),5,N(p,.8),N(p,.5),[3,m,r,.35],b,null,1,!0)}}}if(!c)n.cone(s(v,0,0,0),g,.05,.1,6,N(p,.8),C,[3,1,.05,.7],b,null);else{const l=[[.34,.118,.118],[.47,.1,.1],[.58,.088,.085],[.67,.115,.13],[.77,.165,.205],[.87,.185,.235],[.945,.15,.195],[.99,.075,.1],[1,.015,.02]];n.grid(k,l.length-1,(r,o,w,m)=>{const u=l[m],t=r*q;return{p:s(u[0],t,u[1],u[2]),c:N(p,(m>=3?.46:.56)+.16*Math.cos(t+Math.PI)),b:[3,u[0],u[2],m>=3?.22:.8],pv:b,s:[t*.1,u[0]*M,.3]}},!0);const h=r=>{const o=Math.max(1,l.findIndex(t=>t[0]>=r)),w=l[o-1],m=l[o],u=(r-w[0])/Math.max(1e-4,m[0]-w[0]);return[G(w[1],m[1],u),G(w[2],m[2],u)]},U=(r,o,w,m,u)=>{const[t,B]=h(r),P=s(r,o,t*.9,B*.9),z=s(r,0,0,0),D=O([P[0]-z[0]+g[0]*u,P[1]-z[1]+g[1]*u,P[2]-z[2]+g[2]*u]);n.cone(P,D,w,m,y<1?4:5,N(p,.9),N(C,1.5),[3,r,B,.12],b,null,.8)};for(let r=0;r<7;r++){const o=(r+.5)/7*q;U(.765,o,.055,.1,.02),U(.87,o+.45,.068,.135,.05)}for(let r=0;r<4;r++)U(.95,(r+.5)/4*q,.055,.11,.4)}yield;for(let l=0;l<(y<1?0:6);l++){const h=(l+.5+(_()-.5)*.5)/6*q,U=.36+.14*_(),r=.24+.1*_(),o=.66+.16*_(),w=_(),m=a.at(h,r),u=a.at(h,o),t=O([m[0]-u[0]+Math.sin(h)*.25,m[1]-u[1],m[2]-u[2]+Math.cos(h)*.25]);n.grid(6,4,(B,P,z,D)=>{const R=z===0||z===6||D===0||D===4?1:0,I=Math.min(1,Math.min(z,6-z)/2,Math.min(D,4-D)/1.5),K=h+(B-.5)*2*U*(1+R*.18*Math.sin(z*7.1+D*3.3+l)),E=G(r,o,P)+R*.04*Math.sin(z*4.7+D*9.1+l*2),X=a.at(K,Q(E,.02,.98)),Y=O([X[0],(X[1]-.55)*.9,X[2]]);return{p:[X[0]+Y[0]*.022,X[1]+Y[1]*.022,X[2]+Y[2]*.022],c:N(V,.92),b:[4,l/6,w,1],pv:t,s:[I,0,0]}})}yield;const S=n.build();return S.boundingSphere=new i.Sphere(new i.Vector3(0,.7,0),2.6),S}const w0=`
attribute vec4 aBone; attribute vec3 aPivot; attribute vec3 aShell;
attribute vec4 iA; attribute vec4 iB; attribute vec4 iC;
uniform float uTime; uniform vec4 uTail; uniform float uKind;
varying vec3 vShell; varying vec4 vFx; varying vec3 vLoc; varying float vSeed;
vec3 gPos; vec3 gNrm; float gTake;
vec3 rotX(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x, p.y * c - p.z * s, p.z * c + p.y * s); }   // + = nose down
vec3 rotY(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x * c + p.z * s, p.y, p.z * c - p.x * s); }
vec3 rotZ(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x * c - p.y * s, p.y * c + p.x * s, p.z); }
float bump01(float a, float b, float x){ float t = clamp((x - a) / (b - a), 0., 1.); return sin(t * 3.14159265); }
// body pose: x = pitch, y = roll, z = lift
vec3 bodyPose(float r, float gait, float wk, float seed){
  float rearL = smoothstep(0.03, 0.50, r), frontL = smoothstep(0.42, 0.96, r);
  float rear = -0.35 * (1. - rearL) + 0.13 * bump01(0.12, 0.80, r);
  float front = -0.35 * (1. - frontL) + 0.012 * sin(uTime * 0.8 + seed * 40.) * (1. - rearL);
  float g = gait * 6.2831853;
  float pitch = atan((rear - front) / 1.8) + wk * 0.018 * sin(2. * g + 0.6);
  float roll = wk * 0.07 * sin(g) + 0.05 * bump01(0.05, 0.9, r) * sin(r * 9. + seed * 30.);
  float lift = 0.5 * (rear + front) + wk * 0.014 * sin(2. * g);
  lift = max(lift, sin(abs(pitch)) * 1.02 - 0.27);
  return vec3(pitch, roll, lift);
}
vec3 bodyXf(vec3 p, vec3 bp){ vec3 q = p - vec3(0., 0.35, 0.); q = rotZ(rotX(q, bp.x), bp.y); return q + vec3(0., 0.35 + bp.z, 0.); }
vec3 bodyN(vec3 n, vec3 bp){ return rotZ(rotX(n, bp.x), bp.y); }
void animate(){
  float r = iB.x, gait = iB.y, wk = iB.z, seed = iC.z, side = iC.x;
  vec3 p = position, n = normal; float part = aBone.x; gTake = 1.;
  vec3 bp = bodyPose(r, gait, wk, seed);
  float g = gait * 6.2831853;
  if (part < 0.5) { p = bodyXf(p, bp); n = bodyN(n, bp); }
  else if (part < 1.5) {
    float tk = 1. - smoothstep(0.08, 0.46, r), w = aBone.y; gTake = mix(0.22, 0.8, tk * tk);
    float yaw = side * tk * 1.08 + (1. - tk) * (0.22 * sin(uTime * 0.31 + seed * 50.) * (1. - 0.5 * wk) + 0.5 * side * bump01(0.45, 1.0, r));
    float pit = -0.10 * tk - 0.50 * bump01(0.16, 1.0, r) + wk * (0.16 + 0.10 * sin(2. * g + 1.2)) + (1. - tk) * 0.05 * sin(uTime * 0.53 + seed * 9.);
    vec3 q = p - aPivot; vec3 qr = rotY(rotX(q, pit), yaw); vec3 nr = rotY(rotX(n, pit), yaw);
    p = aPivot + mix(q, qr, w); n = normalize(mix(n, nr, w));
    p = bodyXf(p, bp); n = bodyN(n, bp);
    p.y = max(p.y, 0.015 * w);
  } else if (part < 2.5) {
    float li = aBone.z, hind = 1. - mod(li, 2.), w = aBone.y;
    float ph = fract(gait + li * 0.25 + 0.1), duty = 0.72, stride = 0.86;
    float sw = clamp((ph - duty) / (1. - duty), 0., 1.), ss = sw * sw * (3. - 2. * sw);
    float fz = ph < duty ? stride * duty * (0.5 - ph / duty) : stride * duty * (ss - 0.5);
    float lift = sin(sw * 3.14159265) * 0.10;
    vec3 hipNow = bodyXf(aPivot, bp);
    float comp = clamp((aPivot.y - hipNow.y) / 0.35, 0., 1.);
    vec3 pf = p + vec3(0., lift, fz) * wk;
    vec3 pb = bodyXf(p, bp);
    float ww = w * w * (3. - 2. * w);
    p = mix(pf, pb, ww);
    float knee = sin(w * 3.14159265);
    p.z += knee * (comp * 0.13 + lift * wk * 0.9) * (hind * 2. - 1.);
    p.x += knee * comp * 0.05 * sign(aPivot.x);
    p.y = max(p.y, 0.0);
    n = bodyN(n, bp * ww);
  } else if (part < 3.5) {
    float t = aBone.y, rr = aBone.z;
    float bend = mix(t * t, t, uKind);
    float asleep = 1. - smoothstep(0.25, 0.85, r);
    vec3 c = aPivot + vec3(0., uTail.x, uTail.y) * uTail.z * t;
    float sx = bend * (wk * 0.20 * sin(g + 3.14159265) + (1. - asleep) * 0.07 * sin(uTime * 0.6 + seed * 70.) - side * asleep * mix(0.42, 0.55, uKind));
    float sz = asleep * bend * 0.14 * (1. - uKind);
    // two bulls sparring (tuck = +-2 on an animal that is up): a slow heavy swing of the club toward the other's shell
    // (tuck = +-3: a bull standing as a gatepost, its club held level and swung slowly)
    float post = step(2.5, abs(side)), duel = step(1.5, abs(side)) * (1. - post), dph = uTime * 1.15 + floor(seed * 2.) * 3.14159265;
    sx += bend * post * 0.30 * sin(uTime * 0.55 + seed * 70.);
    sx += bend * duel * sign(side) * (0.30 + 0.85 * sin(dph) * (0.65 + 0.35 * sin(dph)));
    p.x += sx; p.z += sz; c.x += sx; c.z += sz;
    float lifted = (1. - asleep) * bend * mix(0.05, 0.0, uKind) + 0.10 * bend * bump01(0.3, 1.0, r);
    p.y += lifted; c.y += lifted;
    p = bodyXf(p, bp); c = bodyXf(c, bp); n = bodyN(n, bp);
    p.y += max(0., rr + 0.012 - c.y);
  } else {
    float dl = aBone.z, r0 = 0.03 + dl * 0.30;
    float s = clamp((r - r0) / 0.40, 0., 1.);
    if (r < 0.002 || s >= 0.999) { p = vec3(0., -3., 0.); }
    else {
      p = bodyXf(p, bp); n = bodyN(n, bp);
      p += aPivot * (s * s * 0.9 + s * 0.25) + vec3(0., -1.5 * s * s, 0.);
      p.y = max(p.y, 0.02 + 0.01 * dl);
    }
  }
  float sc = iB.w, h = iA.w;
  gPos = rotY(p * sc, h) + iA.xyz; gNrm = rotY(n, h);
  vShell = aShell; vFx = vec4(aBone.w * gTake, r, iC.y, iC.w); vLoc = position; vSeed = seed;
  if (part > 3.5) vShell = vec3(clamp((r - (0.03 + aBone.z * 0.30)) / 0.40, 0., 1.), aShell.x, -1.);
}
`,g0=`
varying vec3 vShell; varying vec4 vFx; varying vec3 vLoc; varying float vSeed;
uniform float uTime; uniform float uKind; uniform float uCap; uniform vec3 uFrost; uniform vec3 uAmber; uniform vec3 uFill;
float gH; float gFrost; float gButton; float gWet; vec3 gEmis;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
vec4 hexCell(vec2 p){ const vec2 s = vec2(1., 1.7320508);
  vec4 hc = floor(vec4(p, p - vec2(0.5, 1.)) / s.xyxy) + 0.5;
  vec4 h = vec4(p - hc.xy * s, p - (hc.zw + 0.5) * s);
  return dot(h.xy, h.xy) < dot(h.zw, h.zw) ? vec4(h.xy, hc.xy) : vec4(h.zw, hc.zw + 0.5); }
// one bony plate: x height 0..1, y button mask, z groove, w cell hash
vec4 plate(vec2 uv, float kind){
  vec4 hc = hexCell(uv); vec2 q = hc.xy;
  float d = max(dot(abs(q), vec2(0.5, 0.8660254)), abs(q.x)), r = length(q);
  float groove = smoothstep(0.39, 0.48, d), id = h21(hc.zw);
  float button = 1. - smoothstep(0.15, 0.23, r);
  float ang = atan(q.y, q.x + sign(q.x) * 1e-4 + 1e-5);
  float spoke = abs(fract(ang * 1.2732395 + id) - 0.5) * 2.;                 // eight facets round the button
  float facet = smoothstep(0.21, 0.27, r) * (1. - groove) * (1. - 0.75 * smoothstep(0.72, 0.95, spoke));
  float hG = button * (0.75 + 0.25 * (1. - r * 4.)) + 0.52 * facet;
  vec2 pq = fract(q * 4.5 + id * 7.) - 0.5;
  float pits = smoothstep(0.10, 0.26, length(pq));
  float hD = (1. - groove) * (0.45 + 0.55 * pits);
  return vec4(mix(hG, hD, kind), button * (1. - kind), groove, id);
}
`,x0=`
if (vShell.z < -0.5) {   // a frost sheet breaking into flakes as it slides
  float fl = 0.50 * vnoise(vLoc.xz * 9. + vLoc.y * 5.) + 0.32 * vnoise(vLoc.zy * 23. + 3.) + 0.18 * vnoise(vLoc.xy * 67. + 1.);
  float inn = clamp(vShell.y, 0., 1.);
  if (fl < 0.34 + clamp(vShell.x, 0., 1.) * 1.0 + (1. - inn) * (1. - inn) * 0.6) discard;
}
{
  float ps = vShell.z; vec3 base = diffuseColor.rgb;
  float cell = mix(0.054, 0.034, uKind);
  vec2 uvp = vShell.xy / cell; vec2 fwv = fwidth(uvp);
  float fade = (1. - smoothstep(0.30, 0.85, max(fwv.x, fwv.y))) * step(0.01, ps);
  vec4 pl = plate(uvp, uKind);
  float groove = pl.z * fade; gButton = pl.y * fade; gH = pl.x * fade * ps;
  vec3 detail = base * (0.82 + 0.36 * pl.w);
  detail = mix(detail, uAmber * (0.80 + 0.35 * pl.w), pl.y * 0.9);
  detail *= 1. - 0.62 * pl.z;
  vec3 mean = mix(base, uAmber, 0.16 * (1. - uKind)) * 0.93;
  base = mix(base, mix(mean, detail, fade), step(0.01, ps) * min(1., ps * 1.6));
  { vec2 ub = vShell.xy / 0.17; vec2 fwb = fwidth(ub); float fadeB = 1. - smoothstep(0.5, 1.5, max(fwb.x, fwb.y));
    vec4 hb = hexCell(ub); float boss = 1. - smoothstep(0.20, 0.42, length(hb.xy)), idb = h21(hb.zw + 3.);
    float mott = vnoise(vShell.xy * 2.3 + vSeed * 20.) * 0.6 + vnoise(vShell.xy * 5.1 + 4.) * 0.4, dK = uKind * step(0.9, ps);     // the shell only: tail and club keep their dark horn
    vec3 bd = base * mix(1., (0.78 + 0.36 * boss) * (0.86 + 0.28 * idb), fadeB * 0.9) * (0.74 + 0.52 * mott) * (1. - 0.34 * smoothstep(1.0, 1.5, vLoc.y));
    bd = mix(bd, vec3(0.40, 0.35, 0.27) * (0.8 + 0.4 * mott), 0.42 * (1. - smoothstep(0.42, 0.95, vLoc.y)));     // dust low on the flanks
    base = mix(base, bd, dK); }
  // wet flanks for the waders
  float wetK = vFx.w * (1. - smoothstep(0.52, 0.95, vLoc.y + 0.22 * (vnoise(vLoc.xz * 7. + vSeed * 9.) - 0.5)));
  base *= 1. - 0.55 * wetK; gWet = wetK;
  // hoar frost: a blanket while asleep, cleared from the top down as the animal stands; a residue stays in the grooves
  float take = vFx.x, rise = vFx.y, amt = vFx.z;
  float nz = vnoise(vLoc.xz * 4. + vSeed * 31.) * 0.6 + vnoise(vLoc.zy * 11. + 7.) * 0.4;
  float line = mix(2.0, -0.6, smoothstep(0.04, 0.78, rise));
  float keep = 1. - smoothstep(line - 0.06, line + 0.06, vLoc.y + (nz - 0.5) * 0.20 + 0.05 * sin(vShell.x * 9. + vSeed * 40.));
  float thin = smoothstep(0.30, 0.62, vnoise(vLoc.xy * 2.6 + vSeed * 17.) * 0.6 + 0.4 * nz);
  // hoar lies thick on what faces the sky and thin on the steep flanks, where the plates ghost through it with white grooves:
  // a frosted stone with a strange tiled skin, darker than the white ground it lies on
  float upK = dot(normalize(vNormal), normalize((viewMatrix * vec4(0., 1., 0., 0.)).xyz + vec3(0., 1e-4, 0.)));
  float spk = vnoise(vLoc.xz * 37. + vLoc.y * 23. + vSeed * 9.);
  float lie = smoothstep(0.34, 0.92, upK + (nz - 0.5) * 0.26 + (spk - 0.5) * 0.30);
  float blanket = amt * take * keep * mix(0.08 + 0.20 * smoothstep(0.45, 0.8, spk) + 0.10 * groove * fade + 0.05 * (1. - fade), 0.84 + 0.14 * thin - 0.30 * pl.x * fade * ps + 0.3 * groove, max(lie, 1. - step(0.01, ps) * 0.999 * (1. - uCap)));
  float resid = amt * take * (1. - keep) * (0.20 * groove * (1. - 0.7 * smoothstep(0.45, 1.25, vLoc.y)) + 0.04 * (1. - smoothstep(0.35, 1.0, vLoc.y)) * smoothstep(0.45, 0.8, nz));
  // after snow (uCap 1) the white is a cap on the shell above its shoulder; the lower shell and saw rim stay dark horn
  float capK = mix(1., smoothstep(0.64, 0.80, vLoc.y + (nz - 0.5) * 0.24), uCap);
  gFrost = clamp(blanket * capK + resid * (1. - uCap), 0., 1.);
  diffuseColor.rgb = mix(base, uFrost * (0.90 + 0.10 * nz), gFrost);
  gH *= 1. - 0.8 * gFrost;
  // slow glitter (each glint lasts a second or more), only where a crystal is larger than a pixel
  vec3 gp = vLoc * 55.; vec2 gc = floor(gp.xz + gp.y * 0.71); vec2 gfw = fwidth(gp.xz + gp.y * 0.71);
  float hs = h21(gc + vSeed * 13.);
  float tw = sin(uTime * (0.7 + hs) + hs * 40.);
  gEmis = uFrost * smoothstep(0.955, 1., hs) * smoothstep(0.55, 1., tw) * gFrost * 1.5 * (1. - smoothstep(0.5, 1.2, max(gfw.x, gfw.y)));
  if (vShell.z < -0.5) {   // a crust, not paper: granular lumps that take the light and the shade
    float gr = vnoise(vLoc.xz * 41. + vLoc.y * 29.) * 0.6 + vnoise(vLoc.zy * 97.) * 0.4;
    diffuseColor.rgb = uFrost * (0.74 + 0.30 * gr); gH = gr * 2.2; gEmis += uFrost * 0.06; }
}
`,y0=`
{
  vec3 sp = -vViewPosition; vec2 dH = vec2(dFdx(gH), dFdy(gH)) * 0.0075;
  vec3 sX = dFdx(sp), sY = dFdy(sp);
  vec3 R1 = cross(sY, normal), R2 = cross(normal, sX);
  float fDet = dot(sX, R1) * faceDirection;
  vec3 nn = abs(fDet) * normal - sign(fDet) * (dH.x * R1 + dH.y * R2);
  if (dot(nn, nn) > 1e-14) normal = normalize(nn);
}
`;function a0(n=j,e=.8){return{uTime:{value:0},uCap:{value:0},uFrost:{value:new i.Color(n[0]).multiplyScalar(.9)},uFill:{value:new i.Color(n[1]).multiplyScalar(e)}}}function b0(n,e,a=null){const c=e==="doedicurus",y=new i.MeshStandardMaterial({vertexColors:!0,roughness:.6,metalness:0,side:i.DoubleSide}),_=O(c?[0,-.05,-1]:[0,-.25,-1]),p={uTime:n.uTime,uCap:n.uCap||{value:0},uFrost:n.uFrost,uFill:n.uFill,uAmber:{value:new i.Color(c?"#7d766c":"#B98A52")},uKind:{value:c?1:0},uTail:{value:new i.Vector4(_[1],_[2],c?1.5:1.02,0)}};return y.onBeforeCompile=f=>{Object.assign(f.uniforms,p),f.vertexShader=f.vertexShader.replace("#include <common>",`#include <common>
`+w0).replace("#include <beginnormal_vertex>",`animate();
vec3 objectNormal = gNrm;`).replace("#include <begin_vertex>",a?`float my = max(gPos.y - iA.y - uMirror.w * iB.w, 0.); gPos.x += sin(my * 9. + uTime * 2.3 + iA.x) * 0.03 * my; gPos.z += sin(my * 7. + uTime * 1.9 + iA.z) * 0.02 * my; vMir = my;
vec3 transformed = gPos;`:"vec3 transformed = gPos;"),a&&(f.uniforms.uMirror=a.uMirror,f.vertexShader=f.vertexShader.replace("#include <common>",`#include <common>
uniform vec4 uMirror; varying float vMir;`),f.fragmentShader=f.fragmentShader.replace("#include <common>",`#include <common>
uniform vec4 uMirror; varying float vMir;`).replace("#include <dithering_fragment>",`gl_FragColor.rgb = mix(gl_FragColor.rgb * vec3(0.80, 0.86, 1.0) + uMirror.rgb * 0.9, uMirror.rgb * 1.6, clamp(0.04 + 0.22 * vMir, 0., 0.55));
#include <dithering_fragment>`)),f.fragmentShader=f.fragmentShader.replace("#include <common>",`#include <common>
`+g0).replace("#include <color_fragment>",`#include <color_fragment>
`+x0).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(mix(0.66, 0.40, gButton), 0.9, gFrost) * (1. - 0.6 * gWet);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
`+y0).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += gEmis + diffuseColor.rgb * uFill * (0.8 + 0.5 * vFx.y);`)},y.customProgramCacheKey=()=>"btw-glyptodont-v4"+(a?"-mirror":""),y}const u0=(n,e,a)=>{let c=(e-n)%q;return c>Math.PI&&(c-=q),c<-Math.PI&&(c+=q),n+c*a};function f0(n,e={}){const a=e.kind==="doedicurus"?"doedicurus":"glyptodon",c=e.palette||j,y=e.rng||n.rng,_=e.slots||[],p=_.length,f=e.duration??44,d=e.timeOfU||(o=>o*f),F=1.8/f,V=e.shared||a0(c,e.fill),C=e.geometry||v0(y,{kind:a,lod:e.lod??1,palette:c}),b=new i.InstancedBufferGeometry;b.setIndex(C.index);for(const o of["position","normal","color","aBone","aPivot","aShell"])b.setAttribute(o,C.attributes[o]);const g=new Float32Array(p*4),M=new Float32Array(p*4),T=new Float32Array(p*4),L=_.map((o,w)=>{const m=o.heading??0,u=o.scale??(a==="doedicurus"?1.07:1);return T[w*4]=o.tuck??(y()<.5?-1:1),T[w*4+1]=o.awake?0:o.frost??1,T[w*4+2]=y(),T[w*4+3]=o.wet??0,{x0:o.x,y0:o.y??0,z0:o.z,h0:m,h1:o.walkHeading??m,scale:u,wakeU:o.wakeU??.2,awake:!!o.awake,never:!!o.never,walkFromU:o.walkFromU??0,speed:o.speed??.8,riseU:o.riseU??F,seed:T[w*4+2],gait0:y(),x:o.x,y:o.y??0,z:o.z,h:m,rise:o.awake?1:0,riseT:0,d:0,wk:0,extra:0,want:0,moving:!1}}),s=new i.InstancedBufferAttribute(g,4).setUsage(i.DynamicDrawUsage),k=new i.InstancedBufferAttribute(M,4).setUsage(i.DynamicDrawUsage);b.setAttribute("iA",s),b.setAttribute("iB",k),b.setAttribute("iC",new i.InstancedBufferAttribute(T,4)),b.instanceCount=p;const A=e.material||b0(V,a),v=new i.Mesh(b,A);v.frustumCulled=!1,v.name="btw-"+a;const x=.86,S=3.5;let l=0,h=0;const U=o=>{let w=o.x0,m=o.z0,u=o.h0;const t=10,B=o.d;for(let P=0;P<t;P++){const z=B*(P+.5)/t;u=u0(o.h0,o.h1,W(0,S,z)),w+=Math.sin(u)*B/t,m+=Math.cos(u)*B/t}o.x=w,o.z=m,o.h=u0(o.h0,o.h1,W(0,S,B))},r={mesh:v,count:p,shared:V,kind:a,slots:L,setProgress(o){l=o},update(o,w){V.uTime.value=w;const m=Math.abs(l-h)>.02;h=l;for(let u=0;u<p;u++){const t=L[u],B=t.awake?-1:t.never?9:t.wakeU+t.riseU;t.riseT=t.awake?9:t.never?0:(l-t.wakeU)/t.riseU,t.rise=Q(t.riseT,0,1);const P=Math.max(B,t.walkFromU),z=l>P?t.speed*Math.max(0,d(l)-d(Math.max(0,P))):0;let D=0;if(m||z<=0)t.extra=0,D=z>0?1:0,t.wk=D;else if(z>t.want+1e-6)D=1;else{const I=Q((2.5-t.extra)/.6,0,1);t.extra+=t.speed*o*I,D=Q(I*3,0,1)}t.want=z,t.d=z+t.extra,t.wk+=(D-t.wk)*Math.min(1,o*4),t.moving=t.wk>.05,U(t);const R=(t.gait0+t.d/(x*t.scale))%1;g[u*4]=t.x,g[u*4+1]=t.y0,g[u*4+2]=t.z,g[u*4+3]=t.h,M[u*4]=t.rise,M[u*4+1]=R,M[u*4+2]=t.rise>=1?t.wk:0,M[u*4+3]=t.scale}s.needsUpdate=!0,k.needsUpdate=!0},state(o){return L[o]}};return r.update(0,0),r}function M0(n,e,a=.03,c=null){const y=new i.InstancedBufferGeometry;y.setAttribute("position",new i.Float32BufferAttribute([-.2,0,-1,1,0,-1,1,0,1,-.2,0,1],3)),y.setIndex([0,2,1,0,3,2]);const _=new Float32Array(n*4),p=new i.InstancedBufferAttribute(_,4).setUsage(i.DynamicDrawUsage);y.setAttribute("iS",p),y.instanceCount=n;const f=new i.Vector2(-e.x,-e.z).normalize(),d=Math.hypot(e.x,e.z)/Math.max(.05,e.y),F=new i.ShaderMaterial({uniforms:{uDir:{value:f},uY:{value:a},uMul:{value:new i.Vector3(.48,.56,.75)},uOpacity:{value:.85},uRiseA:c?c.uRiseA:{value:new i.Vector4(0,0,1,0)},uRiseB:c?c.uRiseB:{value:new i.Vector4(0,1,0,1)}},vertexShader:`attribute vec4 iS; uniform vec2 uDir; uniform float uY; uniform vec4 uRiseA, uRiseB; varying vec2 vQ;
      void main(){ vQ = position.xz; vec2 side = vec2(-uDir.y, uDir.x);
        vec2 p = iS.xy + uDir * position.x * iS.z + side * position.z * iS.w;
        vec2 q = p - uRiseA.xy; float rs = dot(q, uRiseA.zw), rt = abs(dot(q, vec2(-uRiseA.w, uRiseA.z)));
        float gy = uRiseB.z * smoothstep(uRiseB.x, uRiseB.y, rs) * (1. - smoothstep(uRiseB.w, uRiseB.w + 26., rt));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p.x, uY + gy * 1.02, p.y, 1.); }`,fragmentShader:`uniform vec3 uMul; uniform float uOpacity; varying vec2 vQ;
      void main(){ float e = length(vec2((vQ.x - 0.40) / 0.60, vQ.y));
        float a = (1. - smoothstep(0.86, 1.0, e)) * (1. - 0.35 * smoothstep(0.3, 1., vQ.x)) * uOpacity;      // a cast shadow has an edge
        gl_FragColor = vec4(mix(vec3(1.), uMul, a), 1.); }`,transparent:!0,depthWrite:!1,side:i.DoubleSide,blending:i.MultiplyBlending,premultipliedAlpha:!0}),V=new i.Mesh(y,F);return V.frustumCulled=!1,V.renderOrder=1,V.name="btw-shadows",{mesh:V,set(C,b,g,M,T){_[C*4]=b,_[C*4+1]=g,_[C*4+2]=M*d*1.05+.9,_[C*4+3]=T},commit(){p.needsUpdate=!0}}}function k0(n,e,a){const c=H("#8A7A66"),y=N(H(a[0]),.86),_=30,p=96,f=[],d=[],F=[];for(let b=0;b<=_;b++)for(let g=0;g<p;g++){const M=e*Math.pow(b/_,2.4),T=g/p*q,L=Math.sin(T)*M,s=Math.cos(T)*M,k=Q(.84+.3*n.fbm2(L*.045,s*.045,2)*Math.min(1,14/(M+1))+.12*n.n2(L*.35,s*.35)*Math.min(1,5/(M+1)),.5,1),A=Z(N(c,.8),y,k);f.push(L,0,s),d.push(A[0],A[1],A[2],1-W(.55,1,b/_))}for(let b=0;b<_;b++)for(let g=0;g<p;g++){const M=(g+1)%p,T=b*p+g,L=b*p+M,s=(b+1)*p+M,k=(b+1)*p+g;F.push(T,k,s,T,s,L)}const V=new i.BufferGeometry;V.setAttribute("position",new i.Float32BufferAttribute(f,3)),V.setAttribute("color",new i.Float32BufferAttribute(d,4)),V.setIndex(F),V.computeVertexNormals();const C=new i.Mesh(V,new i.MeshStandardMaterial({vertexColors:!0,transparent:!0,depthWrite:!1,roughness:.95,metalness:0}));return C.position.y=.012,C.renderOrder=0,C.name="btw-ground",C}function z0(n,e,a,c,y,_){const p=[],f=[],d=[],F=[],V=[],C=H(y[3]),b=N(H(y[0]),.88);let g=0;for(let s=0;s<a;s++){const k=n()*q,A=Math.pow(n(),.8)*c,v=Math.sin(k)*A,x=Math.cos(k)*A,S=n(),l=.7+.7*n();if(!_(v,x))for(let h=0;h<5;h++){const U=n()*q,r=(.08+.16*n())*l,o=(.2+.2*n())*l,w=.022*l,m=Math.sin(U),u=Math.cos(U);p.push(v-u*w,0,x+m*w,v+u*w,0,x-m*w,v+m*r,o,x+u*r);const t=N(C,.55+.2*n()),B=Z(C,b,.55+.4*n());f.push(t[0],t[1],t[2],t[0],t[1],t[2],B[0],B[1],B[2]),d.push(0,1,0,0,1,0,0,1,0),F.push(S,0,S,0,S,1),V.push(g,g+1,g+2),g+=3}}const M=new i.BufferGeometry;M.setAttribute("position",new i.Float32BufferAttribute(p,3)),M.setAttribute("color",new i.Float32BufferAttribute(f,3)),M.setAttribute("normal",new i.Float32BufferAttribute(d,3)),M.setAttribute("aTuft",new i.Float32BufferAttribute(F,2)),M.setIndex(V);const T=new i.MeshStandardMaterial({vertexColors:!0,roughness:.9,metalness:0,side:i.DoubleSide});T.onBeforeCompile=s=>{s.uniforms.uTime=e.uTime,s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aTuft; uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
transformed.x += aTuft.y * (0.018 * sin(uTime * 2.6 + aTuft.x * 40. + position.z * 0.7) + 0.012 * sin(uTime * 0.7 + position.x * 0.3));`),s.fragmentShader=s.fragmentShader.replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
normal = normalize((viewMatrix * vec4(0., 1., 0., 0.)).xyz);`)},T.customProgramCacheKey=()=>"btw-tufts";const L=new i.Mesh(M,T);return L.name="btw-tufts",L}function J(n,e,a,c,y,_){const p=e.length,f=[];for(let d=0;d<p;d++){const F=e[Math.max(0,d-1)],V=e[Math.min(p-1,d+1)],C=O([V[0]-F[0],V[1]-F[1],V[2]-F[2]]),b=O($(C,y)),g=$(C,b);f.push([b,g])}return n.grid(c,p-1,(d,F,V,C)=>{const b=d*q,g=Math.cos(b),M=Math.sin(b),[T,L]=f[C],s=a[C],k=e[C],A=_(C,b,g,M),v=s[0]*(A.k1??1),x=s[1];return{p:[k[0]+T[0]*g*v+L[0]*M*x,k[1]+T[1]*g*v+L[1]*M*x,k[2]+T[2]*g*v+L[2]*M*x],c:A.c,b:A.b,pv:A.pv,s:A.s}},!0),f}function t0(n,e,a,c,y,_,p,f,d,F,V){const C=a.length;for(let b=0;b<_;b++){const g=(b+.5)/_*(C-1),M=Math.min(C-2,Math.floor(g)),T=g-M,L=a[M],s=a[M+1],k=[G(L[0],s[0],T),G(L[1],s[1],T),G(L[2],s[2],T)],A=G(c[M][0],c[M+1][0],T),v=G(c[M][1],c[M+1][1],T),x=O([s[0]-L[0],s[1]-L[1],s[2]-L[2]]),S=O($(x,y)),l=$(x,S),h=V(k),U=e()*q;for(let r=0;r<p;r++){const o=U+r/p*q,w=o+q/p*1.15,m=(o+w)/2,u=f*(.6+.8*e()),t=(D,R,I)=>[k[0]+(S[0]*Math.cos(D)*A+l[0]*Math.sin(D)*v)*R,k[1]+(S[1]*Math.cos(D)*A+l[1]*Math.sin(D)*v)*R-I,k[2]+(S[2]*Math.cos(D)*A+l[2]*Math.sin(D)*v)*R],B=n.v(t(o,.98,0),d,h.b,h.pv,h.s),P=n.v(t(w,.98,0),d,h.b,h.pv,h.s),z=n.v(t(m,1+(.1+.12*e())/Math.max(.3,Math.max(A,v))*.5,u),F,[h.b[0],h.b[1],h.b[2],1],h.pv,h.s);n.tri(B,P,z)}}}function A0(n,e={}){const a=n0(),c=H(e.color||"#7A6650"),y=N(c,.55),_=N(c,1.25),p=H("#2a2622"),f=[1,0,0],d=[0,0,0],F=[[1.02,-.3,.34,.4],[1.22,-.27,.66,.8],[1.55,-.22,.8,.96],[1.98,-.15,.78,.88],[2.4,-.06,.66,.72],[2.78,.03,.54,.58],[3.04,.12,.42,.47],[3.2,.34,.27,.28],[3.3,.54,.215,.205],[3.36,.74,.2,.175],[3.39,.96,.145,.13],[3.4,1.13,.115,.1],[3.4,1.2,.04,.04]],V=F.map(s=>[0,s[0],s[1]]),C=F.map(s=>[s[2],s[3]]),b=[0,3.1,.24],g=s=>s>=7?[3,s>=8?1:.4,0,0]:[0,0,0,0];J(a,V,C,20,f,(s,k,A)=>({k1:A<0&&s>=1&&s<=5?1.16:1,c:N(s>=11?p:c,.8+.25*A+.12*Math.sin(k*7+s*3)),b:g(s),pv:b,s:d})),t0(a,n,V.slice(0,8),C.slice(0,8),f,15,26,.26,y,_,s=>({b:s[1]>3.2?[3,.4,0,0]:[0,0,0,0],pv:b,s:d}));for(const s of[-1,1]){a.cone([s*.17,3.44,.5],O([s*.8,.5,-.4]),.06,.12,5,c,y,[3,1,0,0],b,d,.5),a.cone([s*.165,3.44,.8],O([s,.2,0]),.03,.025,5,[.01,.01,.01],[.01,.01,.01],[3,1,0,0],b,d);const k=s*.44,A=[[s*.5,1.55,-.2+k*.3],[s*.62,1.12,.02+k*.75],[s*.66,.74,.1+k],[s*.64,.4,.02+k],[s*.62,.17,-.04+k]],v=[[.46,.42],[.4,.36],[.31,.29],[.25,.24],[.22,.22]];J(a,A,v,10,f,(t,B,P)=>({c:N(c,.78+.2*P+.1*Math.sin(B*5+t)),b:[0,0,0,0],pv:d,s:d})),t0(a,n,A.slice(0,3),v,f,4,14,.2,y,_,()=>({b:[0,0,0,0],pv:d,s:d}));const x=[[s*.62,.15,-.26+k],[s*.6,.15,.05+k],[s*.5,.13,.36+k],[s*.4,.1,.58+k]];J(a,x,[[.13,.17],[.15,.21],[.13,.19],[.07,.11]],8,[0,1,0],(t,B,P)=>({c:N(y,.9+.2*P),b:[0,0,0,0],pv:d,s:d}));for(let t=0;t<3;t++)a.cone([s*(.44-t*.07),.11,.52+t*.05+k],O([-s*.75,-.05,.6]),.05,.26,5,p,N(p,1.6),[0,0,0,0],d,d,.7);const S=s<0,l=[s*.5,2.9,.12],h=S?[s*.62,3.88,.52]:[s*.62,2.62,.92],U=S?[s*.5,4.2,1.5]:[s*.5,2.86,1.62],r=S?[s*.44,4.33,1.86]:[s*.44,2.98,1.92],o=[l,[G(l[0],h[0],.5),G(l[1],h[1],.5)-.03,G(l[2],h[2],.5)],h,[G(h[0],U[0],.5),G(h[1],U[1],.5),G(h[2],U[2],.5)],U,r],w=[[.31,.28],[.26,.24],[.21,.2],[.19,.17],[.15,.15],[.1,.15]],m=[0,0,.5,1,1,1],u=s>0?1:2;J(a,o,w,10,f,(t,B,P)=>({c:N(c,.78+.2*P+.1*Math.sin(B*5+t)),b:[u,1,m[t],0],pv:l,s:h})),t0(a,n,o.slice(0,5),w,f,8,12,.22,y,_,t=>({b:[u,1,t[1]>h[1]?1:0,0],pv:l,s:h}));for(let t=-1;t<=1;t++){const B=[r[0]+t*.085,r[1],r[2]];J(a,[B,[B[0],B[1]+.13,B[2]+.12],[B[0],B[1]+.13,B[2]+.28],[B[0],B[1]+.02,B[2]+.38],[B[0],B[1]-.09,B[2]+.37]],[[.05,.05],[.05,.045],[.04,.035],[.025,.022],[.006,.006]],5,f,P=>({c:N(p,1+P*.25),b:[u,1,1,0],pv:l,s:h}))}}const M=[[0,1.18,-.52],[0,.8,-1.02],[0,.42,-1.48],[0,.22,-1.95],[0,.15,-2.42],[0,.1,-2.75]],T=[[.44,.44],[.36,.36],[.27,.28],[.19,.2],[.11,.12],[.03,.03]];J(a,M,T,10,f,(s,k,A)=>({c:N(c,.78+.2*A),b:[0,0,0,0],pv:d,s:d})),t0(a,n,M.slice(0,5),T,f,5,12,.2,y,_,()=>({b:[0,0,0,0],pv:d,s:d}));const L=a.build();return L.boundingSphere=new i.Sphere(new i.Vector3(0,2.2,0),3.6),L}async function S0(n,e,a,c=!1,y=null){const _=n0(),p=H(y?.bark||"#2b231d"),f=H(y?.rime||"#cfd8de"),d=[0,0,0],F=[.12,1.7,.05],V=Math.hypot(a[0]-F[0],a[1]-F[1],a[2]-F[2]);let C=0;const b=(L,s,k,A,v,x,S,l,h,U,r,o)=>{const w=[L],m=[[A,A]],u=[];let t=s.slice(),B=L.slice();for(let z=1;z<=x;z++){const D=z%2?1:-1,R=O($(t,[0,1,0]));t=O([t[0]+R[0]*l*D*(.6+.8*e())+(e()-.5)*l*.5,Math.max(o>=2?-.45:-.04,t[1]+(e()-.5)*l*.6-h*(.03+Math.max(0,B[1]-6.2)*.35)),t[2]+R[2]*l*D*(.6+.8*e())+(e()-.5)*l*.5]),B=[B[0]+t[0]*k/x,B[1]+t[1]*k/x,B[2]+t[2]*k/x],w.push(B);const I=G(A,v,z/x);m.push([I,I]),u.push([B.slice(),t.slice(),I])}const P=o>=2?.75:o===1?.3:.06;return J(_,w,m,S,Math.abs(s[1])>.9?[1,0,0]:[0,1,0],(z,D,R,I)=>{const K=w[z],E=U?Math.min(1.5,Math.hypot(K[0]-F[0],K[1]-F[1],K[2]-F[2])/V):0;return{c:Z(N(p,.8+.4*e()),f,Q(P*(.6+.5*I)+(I>.3?.25:0),0,.92)),b:[0,E,r*z/x,o>=2?1:0],pv:d,s:d}}),C+=x,u};J(_,[[0,-.1,0],[.02,.35,0],[-.05,.9,.04],[.06,1.35,0],F],[[.62,.58],[.44,.42],[.38,.4],[.37,.35],[.4,.42]],9,[1,0,0],(L,s)=>({k1:1+.12*Math.sin(s*3+L*1.7),c:N(p,.75+.3*Math.sin(s*5+L*2)**2),b:[0,0,0,0],pv:d,s:d}));const g=5,M=Math.atan2(a[0]-F[0],a[2]-F[2]);for(let L=0;L<g;L++){const s=L===0&&!c,k=M+L/g*q+(s?0:(e()-.5)*.5);let A,v;if(s)A=O([a[0]-F[0],a[1]-F[1],a[2]-F[2]]),v=V*1.45;else{const S=.8+.3*e();A=[Math.sin(k)*Math.cos(S),Math.sin(S),Math.cos(k)*Math.cos(S)],v=5.6+1.3*e()}const x=b(F,A,v,.24,.1,7,7,s?.05:.2,s?.5:1.5,s,.05,0);for(let S=1;S<x.length;S++){if(S<2&&!s)continue;const[l,h,U]=x[S],r=S===x.length-1?2:1;for(let o=0;o<r+(e()<.5?1:0);o++){const w=(e()-.5)*2.2,m=O([h[0]*Math.cos(w)+h[2]*Math.sin(w),h[1]*.4+.25+.3*e(),h[2]*Math.cos(w)-h[0]*Math.sin(w)]),u=b(l,m,2+1.3*e(),U*.72,.042,5,5,.34,1.6,s,.3,1);for(let t=0;t<u.length;t++){const[B,P,z]=u[t],D=1+t%2+(t===u.length-1?1:0);for(let R=0;R<D;R++){const I=(e()-.5)*2.6,K=O([P[0]*Math.cos(I)+P[2]*Math.sin(I),P[1]*.3+(e()-.35)*.7,P[2]*Math.cos(I)-P[0]*Math.sin(I)]),E=b(B,K,.8+.9*e(),Math.min(.036,z*.85),.018,4,3,.5,2.2,s,1,2),[X,Y]=E[1];b(X,O([Y[2]*.8+Y[0]*.3,Y[1]*.2-.1,-Y[0]*.8+Y[2]*.3]),.35+.4*e(),.022,.014,2,3,.5,2,s,1,2),e()<.1&&_.cone(E[2][0],O([.2*(e()-.5),-1,.2*(e()-.5)]),.022,.22,4,H("#5a4026"),H("#7a5a34"),[0,s?Math.min(1.5,Math.hypot(X[0]-F[0],X[1]-F[1],X[2]-F[2])/V):0,1,0],d,d,.5)}}C>120&&(C=0,await n.yield())}}}await n.yield();const T=_.build();return T.boundingSphere=new i.Sphere(new i.Vector3(0,4.5,0),9),T}function h0(n,e,a,c,y){const _=new i.MeshStandardMaterial({vertexColors:!0,roughness:.85,metalness:0,side:i.DoubleSide}),p={uTime:n.uTime,uFill:n.uFill,uPose:{value:a},uSunW:{value:c},uAccent:{value:new i.Color(y)}},f=`
    attribute vec4 aBone; attribute vec3 aPivot; attribute vec3 aShell; uniform float uTime; uniform vec4 uPose; varying float vTip;
    vec3 gPos; vec3 gNrm;
    vec3 rX(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x, p.y * c - p.z * s, p.z * c + p.y * s); }
    void animate(){ vec3 p = position, n = normal; vTip = aBone.w;
    ${e==="sloth"?`
      float part = aBone.x;
      if (part > 0.5 && part < 2.5) {
        float fl = aBone.z * (uPose.y * 0.55 + (1. - uPose.x) * 1.1);
        p = aShell + rX(p - aShell, fl); n = rX(n, fl);
        float sh = (1. - uPose.x) * 0.80 + uPose.y * 0.30;
        p = aPivot + rX(p - aPivot, sh); n = rX(n, sh);
      } else if (part > 2.5) {
        float hd = aBone.y * (uPose.z * (0.55 + 0.07 * sin(uTime * 5.2)) - 0.10 * uPose.y + 0.03 * sin(uTime * 0.7));
        p = aPivot + rX(p - aPivot, hd); n = rX(n, hd);
      }
      float lw = smoothstep(1.2, 3.2, position.y), ln = -uPose.w * lw + 0.006 * sin(uTime * 1.1) * lw;
      p = vec3(0., 1.3, -0.3) + rX(p - vec3(0., 1.3, -0.3), ln); n = rX(n, ln);
      p.z -= 0.012 * sin(uTime * 1.1) * (1. - abs(position.y - 2.0) * 0.5) * step(position.y, 3.0);
      p.x += aBone.w * 0.035 * sin(uTime * 1.6 + position.y * 4. + position.z * 3.);
    `:`
      float w = aBone.y;
      p += vec3(0., -0.80, 0.20) * uPose.x * w * sqrt(w);
      float fx = aBone.z;
      p.x += fx * (0.035 * sin(uTime * 1.2 + position.y * 1.7 + position.z * 0.9) + uPose.y * step(0.01, w) * 0.05 * sin(uTime * 15. + position.x * 5.));
      p.y += fx * 0.02 * sin(uTime * 0.9 + position.x * 1.3);
    `}
      gPos = p; gNrm = n; }`;return _.onBeforeCompile=d=>{Object.assign(d.uniforms,p),d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
`+f).replace("#include <beginnormal_vertex>",`animate();
vec3 objectNormal = gNrm;`).replace("#include <begin_vertex>","vec3 transformed = gPos;"),d.fragmentShader=d.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uSunW; uniform vec3 uAccent; uniform vec3 uFill; varying float vTip;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        { vec3 vd = normalize(vViewPosition + vec3(0., 0., 1e-6)); vec3 sv = normalize((viewMatrix * vec4(uSunW, 0.)).xyz);
          float back = clamp(dot(-vd, sv), 0., 1.); back *= back;
          float rimF = 1. - abs(dot(normalize(vNormal + vec3(0., 0., 1e-6)), vd)); rimF *= rimF; rimF *= rimF;
          totalEmissiveRadiance += diffuseColor.rgb * uFill * 0.6 + uAccent * back * (rimF * 2.4 + vTip * 0.12); }`)},_.customProgramCacheKey=()=>"btw-silhouette-"+e,_}async function B0(n,e={}){const a=n.rng,c=e.palette||j,y=e.shared||a0(c,e.fill),_=e.detail??1,p=e.duration??44,f=e.sunDir||new i.Vector3(.75,.19,-.63).normalize(),d=e.timeOfU||(r=>r*p),F=e.pullAtU??.45,V=new i.Group;V.name="btw-sloth-tree";const C=-4.2,b=[0,4.42,C+1.95],g=new i.Vector4(1,0,0,0),M=new i.Vector4(0,0,0,0),T=new i.Mesh(A0(a,{color:e.slothColor}),h0(y,"sloth",g,f,c[6]));T.position.set(0,0,C),T.name="btw-megatherium",await n.yield();const L=new i.Mesh(await S0(n,a,b),h0(y,"tree",M,f,c[6]));L.name="btw-algarrobo",await n.yield();const s=Math.round(260*_),k=Math.round(420*_),A=s+k,v=new i.InstancedBufferGeometry;v.setAttribute("position",new i.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),v.setIndex([0,1,2,0,2,3]);const x=new Float32Array(A*4),S=new Float32Array(A*4);for(let r=0;r<A;r++){const o=r<s,w=Math.pow(a(),.7),m=a()*q,u=Math.sqrt(a())*(.5+2*w);x[r*4]=Math.sin(m)*u,x[r*4+1]=G(3.4,6.6,w)+(a()-.5),x[r*4+2]=G(-.6,b[2]-1.6,w)+Math.cos(m)*u*.8,x[r*4+3]=o?.35+.5*a():.035+.03*a(),S[r*4]=a()*2.4*(.4+.6*w),S[r*4+1]=a(),S[r*4+2]=o?0:1,S[r*4+3]=o?.7+.5*a():1.1+.9*a()}v.setAttribute("sA",new i.InstancedBufferAttribute(x,4)),v.setAttribute("sB",new i.InstancedBufferAttribute(S,4)),v.instanceCount=A;const l=new i.Mesh(v,F0(y,f,c));l.frustumCulled=!1,l.renderOrder=5,l.name="btw-frost-shower",V.add(L,T,l);let h=null;const U={object:V,sloth:T,tree:L,shower:l,hook:new i.Vector3(b[0],b[1],b[2]),slothAt:new i.Vector3(0,0,C),setProgress(r){h=r},update(r,o){const m=(h===null?o:d(h)-d(F)+4.5+9e3)/9%1,u=W(.42,.56,m)*(1-W(.62,.74,m));g.set(.45+.55*W(.05,.3,m)-.55*W(.66,.8,m),u,W(.68,.8,m)*(1-W(.94,1,m)),u*.07);const t=(m-.6)*9;M.x=m<.6?W(.42,.56,m):Math.exp(-t*1.5)*Math.cos(t*6.5),M.y=m<.6?W(.42,.56,m)*.4:Math.exp(-t*.9),l.material.uniforms.uT.value=(m-.5+1)%1*9}};return U.update(0,0),U}function F0(n,e,a){const c=new i.ShaderMaterial({uniforms:i.UniformsUtils.merge([i.UniformsLib.fog,{uT:{value:0},uSun:{value:e.clone()},uShade:{value:new i.Color("#9FB0CC").multiplyScalar(.8)},uLit:{value:new i.Color(a[4]).multiplyScalar(.85)},uAccent:{value:new i.Color(a[6])}}]),vertexShader:`
      attribute vec4 sA; attribute vec4 sB; uniform vec3 uSun; uniform float uTime; uniform float uT;
      varying vec2 vUv; varying vec4 vFx;
      #include <fog_pars_vertex>
      void main(){
        float age = uT - sB.x, life = mix(4.2, 3.4, sB.z);
        float on = step(0., age) * step(age, life);
        vec3 c = sA.xyz; float fall = sB.w * age + 0.25 * age * age * sB.z;
        c.y -= min(fall, max(sA.y - 0.15, 0.)); c.x += 0.22 * age * (sB.y - 0.3) + 0.12 * sin(age * 1.7 + sB.y * 30.); c.z -= 0.18 * age;
        vec4 wc = modelMatrix * vec4(c, 1.);
        float sz = sA.w * mix(1. + 0.5 * age, 1., sB.z) * on * length(modelMatrix[0].xyz);
        vec4 mvPosition = viewMatrix * wc; mvPosition.xy += position.xy * sz;
        gl_Position = projectionMatrix * mvPosition;
        vec3 toS = wc.xyz - cameraPosition; float l = max(length(toS), 1e-3);
        float back = max(dot(toS / l, normalize(uSun)), 0.);
        float fade = smoothstep(0., 0.35, age) * (1. - smoothstep(life * 0.6, life, age)) * smoothstep(0.1, 0.6, c.y);
        float tw = 0.55 + 0.45 * sin(uTime * (1.3 + sB.y * 1.4) + sB.y * 50.);
        vUv = position.xy; vFx = vec4(fade * on, sB.z, back * back, tw);
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uShade; uniform vec3 uLit; uniform vec3 uAccent; varying vec2 vUv; varying vec4 vFx;
      #include <fog_pars_fragment>
      void main(){
        float r = length(vUv); if (r > 1.) discard;
        float soft = 1. - r * r; soft *= soft;
        float a = vFx.x * soft * mix(0.11, 0.9 * vFx.w, vFx.y);
        vec3 col = mix(mix(uShade, uLit, 0.5) + uAccent * vFx.z * 2.2, uLit * 1.2 + uAccent * (0.6 + vFx.z * 3.2), vFx.y);
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`,transparent:!0,depthWrite:!1,fog:!0});return c.uniforms.uTime=n.uTime,c}async function C0(n,e={}){const a=n.rng,c=e.palette||j,y=e.detail??1,_=e.duration??44,p=new i.Group;p.name="boulders-that-walk-hero";const f=(e.sunDir?e.sunDir.clone():new i.Vector3(Math.sin(.873)*Math.cos(.192),Math.sin(.192),-Math.cos(.873)*Math.cos(.192))).normalize(),d=a0(c,e.fill),F=13,V=e.count??a.int(9,11),C=a.chance(.35)?2:1,b=-Math.PI*.75,g=[{x:2.9+a()*.5,z:5.5+a()*1.5}];e.first&&(g[0].x=e.first.x,g[0].z=e.first.z);const M=P=>e.first?.heading??P;for(let P=0;g.length<V&&P<4e3;P++){const z=a()*q,D=Math.sqrt(a())*(F-3),R=Math.sin(z)*D*1,I=Math.cos(z)*D*.92-1;Math.abs(R)<2.7||e.clear&&e.clear(R,I)||Math.hypot(R-9.5,I+6.6)<5.2||g.every(K=>Math.hypot(K.x-R,K.z-I)>4.9)&&g.push({x:R,z:I})}const T=a.shuffle([.18,.183,.2,.22,.222,.226,.25,.272,.288,.305,.32,.335].slice(0,g.length-1)),L=1+a.int(0,g.length-2),s=new Set;for(;s.size<C;)s.add(2+a.int(0,g.length-3));const k=[],A=[],v=[];g.forEach((P,z)=>{const D={x:P.x,z:P.z,heading:z===0?M(-2.2+a()*.5):a()*q,scale:z===0?1.04:a.range(.86,1.08),wakeU:z===0?.15:T[z-1],never:z===L,riseU:z===0?e.first?.riseU:void 0,walkHeading:b+a.range(-.22,.22),walkFromU:e.walkFromU??.24,speed:.8*a.range(.9,1.08)};if(e.wakeOf){const R=e.wakeOf(P.x,P.z,z,D.wakeU);R!=null&&(D.wakeU=R)}s.has(z)?(D.scale*=1.07,v.push(["d",A.length]),A.push(D)):(v.push(["g",k.length]),k.push(D))}),await n.yield();const x=()=>n.yield(),S=await i0(a,{kind:"glyptodon",palette:c},x);await n.yield();const l=await i0(a,{kind:"doedicurus",palette:c},x);await n.yield();const h=f0(n,{kind:"glyptodon",slots:k,palette:c,shared:d,duration:_,timeOfU:e.timeOfU,geometry:S}),U=f0(n,{kind:"doedicurus",slots:A,palette:c,shared:d,duration:_,timeOfU:e.timeOfU,geometry:l});p.add(h.mesh,U.mesh);const r=v.map(([P,z])=>({herd:P==="g"?h:U,i:z,s:(P==="g"?h:U).state(z),kind:P}));await n.yield();const o=e.shadows===!1?null:M0(r.length+2,f);o&&p.add(o.mesh),e.groundPatch!==!1&&(p.add(k0(n.noise,170,c)),await n.yield(),p.add(z0(a,d,Math.round(3200*y),46,c,(P,z)=>g.some(D=>Math.hypot(D.x-P,D.z-z)<1.7)||Math.hypot(P-9.5,z+10.5)<.9))),await n.yield();const w=T0(n,{animals:r,detail:y,pal:c,sunDir:f,shared:d});p.add(w.mesh),await n.yield();const m=e.sloth===!1?null:await B0(n,{shared:d,sunDir:f,palette:c,detail:y,duration:_,timeOfU:e.timeOfU,pullAtU:e.pullAtU}),u=new i.Vector3(9.5,0,-10.5);m&&(m.object.position.copy(u),m.object.rotation.y=Math.PI,p.add(m.object));let t=null;const B={object:p,radius:m?10:F,height:m?8:1.6,center:new i.Vector3(m?2.5:0,m?1.5:.8,m?-2.5:0),ground:e.groundPatch===!1,groundY:0,slothTree:m,herds:[h,U],animals:r,setProgress(P){t=P},update(P,z,D){const R=t??.125+(z+14)%20/44;if(h.setProgress(R),U.setProgress(R),h.update(P,z),U.update(P,z),o){for(let I=0;I<r.length;I++){const K=r[I].s,E=W(.05,.9,K.rise);o.set(I,K.x,K.z,(1.12+.36*E)*K.scale,(.95-.1*E)*K.scale)}m&&(o.set(r.length,u.x,u.z+4.2,3.6,1.25),o.set(r.length+1,u.x,u.z,6.2,2.6)),o.commit()}w.update(P,z,D),m&&(t!==null&&m.setProgress(t),m.update(P,z))},dispose(){}};return B.anchors=P0(r,F,b),B.anchors.sunDir=f.clone(),m&&(B.anchors.tree=u.clone(),B.anchors.sloth=new i.Vector3(u.x,0,u.z+4.2),B.anchors.slothHook=new i.Vector3(u.x,4.42,u.z+2.25),B.anchors.viewpoints.sloth={position:new i.Vector3(u.x-8,2.4,u.z+9),lookAt:new i.Vector3(u.x,3.2,u.z+2.5)}),B.update(0,0,null),B}function T0(n,{animals:e,detail:a,pal:c,sunDir:y,shared:_}){const p=n.rng,f=Math.max(6,Math.round(14*a)),d=e.length*f,F=new i.InstancedBufferGeometry;F.setAttribute("position",new i.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),F.setIndex([0,1,2,0,2,3]);const V=new Float32Array(d*4),C=new Float32Array(d*4),b=new i.InstancedBufferAttribute(V,4).setUsage(i.DynamicDrawUsage),g=new i.InstancedBufferAttribute(C,4).setUsage(i.DynamicDrawUsage);F.setAttribute("sA",b),F.setAttribute("sB",g),F.instanceCount=d;const M=[];for(let k=0;k<d;k++){const A=p()*q;M.push({a:A,r:.45+.35*p(),y:.55+.75*p(),birth:.03+.9*Math.pow(p(),1.25),life:1.5+1.3*p(),size:.36+.34*p(),out:.5+.9*p(),upv:.5+1.1*p()}),C[k*4+1]=p()}const T=new i.Vector3(-.9,0,-.35),L=new i.ShaderMaterial({uniforms:i.UniformsUtils.merge([i.UniformsLib.fog,{uSun:{value:y.clone()},uShade:{value:new i.Color(c[1]).multiplyScalar(.8)},uLit:{value:new i.Color(c[4]).multiplyScalar(.85)},uAccent:{value:new i.Color(c[6])}}]),vertexShader:`
      attribute vec4 sA; attribute vec4 sB; uniform vec3 uSun; uniform float uTime;
      varying vec2 vUv; varying vec3 vFx; varying float vY;
      #include <fog_pars_vertex>
      void main(){
        vec4 wc = modelMatrix * vec4(sA.xyz, 1.);
        float rot = sB.y * 6.2831853 + uTime * 0.25 * (sB.y - 0.5);
        float c = cos(rot), s = sin(rot);
        vec2 q = vec2(position.x * c - position.y * s, position.x * s + position.y * c) * sA.w * length(modelMatrix[0].xyz);
        vec4 mvPosition = viewMatrix * wc; mvPosition.xy += q;
        gl_Position = projectionMatrix * mvPosition;
        vec3 toS = wc.xyz - cameraPosition; float l = max(length(toS), 1e-3);
        float back = max(dot(toS / l, normalize(uSun)), 0.);
        vUv = position.xy; vFx = vec3(sB.x, sB.y, back * back * back); vY = wc.y + q.y;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uShade; uniform vec3 uLit; uniform vec3 uAccent; uniform float uTime;
      varying vec2 vUv; varying vec3 vFx; varying float vY;
      #include <fog_pars_fragment>
      float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
      void main(){
        float r = length(vUv); if (r > 1.) discard;
        float soft = (1. - r * r); soft *= soft;
        vec2 p = vUv * 2.2 + vFx.y * 37. + vec2(0., -uTime * 0.07);
        float nz = 0.6 * vn(p) + 0.4 * vn(p * 2.3 + 5.);
        float a = vFx.x * soft * smoothstep(0.30, 0.74, nz) * smoothstep(-0.05, 0.3, vY);
        vec3 col = mix(uShade, uLit, 0.35 + 0.4 * nz) + uAccent * vFx.z * 1.5 * (0.5 + 0.5 * soft);
        gl_FragColor = vec4(col, min(a, 0.3));
        #include <fog_fragment>
      }`,transparent:!0,depthWrite:!1,fog:!0});L.uniforms.uTime=_.uTime;const s=new i.Mesh(F,L);return s.frustumCulled=!1,s.renderOrder=4,s.name="btw-frost-smoke",{mesh:s,update(){for(let k=0;k<d;k++){const A=e[k/f|0].s,v=M[k],x=(A.riseT-v.birth)/v.life;if(!(x>0&&x<1)||A.awake||A.never){V[k*4+3]=0,C[k*4]=0;continue}const S=A.scale,l=v.a+A.h0,h=Math.sin(l),U=Math.cos(l),r=1-(1-x)*(1-x);V[k*4]=A.x0+h*(v.r+v.out*r)*S+T.x*(.5+2.3*x+1.2*x*x),V[k*4+1]=Math.max(.25,(v.y-.9*r+v.upv*x*x*1.7)*S),V[k*4+2]=A.z0+U*(v.r+v.out*r)*S+T.z*(.5+2.3*x+1.2*x*x),V[k*4+3]=v.size*(.6+1.25*r)*S,C[k*4]=.42*W(0,.07,x)*Math.pow(1-x,1.2)}b.needsUpdate=!0,g.needsUpdate=!0}}}function P0(n,e,a){const c=n[0].s;return{firstRiser:new i.Vector3(c.x0,0,c.z0),owlLanding:new i.Vector3(c.x0,1.25*c.scale,c.z0-.1),flyThrough:[new i.Vector3(0,2.2,e+8),new i.Vector3(0,2.2,10),new i.Vector3(.2,2,3),new i.Vector3(-.2,2,-5),new i.Vector3(0,2.1,-e-6)],viewpoints:{entry:{position:new i.Vector3(0,2.2,e+4),lookAt:new i.Vector3(1,.8,0)},firstRise:{position:new i.Vector3(c.x0-2.6,1.8,c.z0+2.4),lookAt:new i.Vector3(c.x0,.8,c.z0)},againstSun:{position:new i.Vector3(-13,2.4,12),lookAt:new i.Vector3(2,.8,-2)}},portalSeat:{position:new i.Vector3(0,7.5,-e-30),facing:new i.Vector3(0,0,1)},walkHeading:a,walkDir:new i.Vector3(Math.sin(a),0,Math.cos(a)),wake:n.map(y=>({x:y.s.x0,z:y.s.z0,wakeU:y.s.never?null:y.s.wakeU,never:y.s.never,kind:y.kind==="d"?"doedicurus":"glyptodon",scale:y.s.scale}))}}export{S0 as buildAlgarroboGeometry,v0 as buildGlyptodontGeometry,i0 as buildGlyptodontGeometryAsync,C0 as buildHero,A0 as buildMegatheriumGeometry,B0 as buildSlothTree,b0 as makeAnimalMaterial,T0 as makeFrostFx,f0 as makeGlyptodonts,M0 as makeShadows,a0 as makeShared,h0 as makeSilhouetteMaterial};
