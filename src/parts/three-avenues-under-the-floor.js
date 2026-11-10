import*as f from"three";import{clamp as st,lerp as Z}from"../kit/core.js";const R=Math.PI*2,et=a=>{const e=new f.Color(a);return[e.r,e.g,e.b]},Q=(a,e)=>[a[0]*e,a[1]*e,a[2]*e],dt=(a,e,i)=>[Z(a[0],e[0],i),Z(a[1],e[1],i),Z(a[2],e[2],i)],X=`
float h11(float p){ p = fract(p*.1031); p *= p+33.33; p *= p+p; return fract(p); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec2 h22(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3 += dot(p3, p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
float vn2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
float fbm2(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vn2(p); p=p*2.03+vec2(17.1,9.2); a*=.5; } return s; }
vec3 hue(float h){ return clamp(abs(fract(h+vec3(0.,.6667,.3333))*6.-3.)-1., 0., 1.); }
uniform vec3 uFogCol; uniform float uFogDen;
vec3 fogged(vec3 c, float d, float k){ float f = 1.-exp(-max(d,0.)*uFogDen*k); return mix(c, uFogCol, clamp(f,0.,1.)); }
`;class at{constructor(){this.p=[],this.n=[],this.uv=[],this.idx=[],this.count=0}tube(e,i,t=0){const u=e.length;let r=null,w=t;const b=[];for(let v=0;v<u;v++){const F=e[Math.max(v-1,0)],y=e[Math.min(v+1,u-1)],s=e[v];let c=y[0]-F[0],l=y[1]-F[1],h=y[2]-F[2];const M=Math.hypot(c,l,h)||1;c/=M,l/=M,h/=M,r||(r=Math.abs(l)>.9?[1,0,0]:[0,1,0]);const C=r[0]*c+r[1]*l+r[2]*h;let A=r[0]-c*C,k=r[1]-l*C,n=r[2]-h*C;const o=Math.hypot(A,k,n)||1;A/=o,k/=o,n/=o,r=[A,k,n];const m=l*n-h*k,d=h*A-c*n,p=c*k-l*A;if(v>0){const T=e[v-1];w+=Math.hypot(s[0]-T[0],s[1]-T[1],s[2]-T[2])}const z=this.count,g=s[3];for(let T=0;T<=i;T++){const B=T/i*R,x=Math.cos(B),S=Math.sin(B),W=A*x+m*S,P=k*x+d*S,q=n*x+p*S;this.p.push(s[0]+W*g,s[1]+P*g,s[2]+q*g),this.n.push(W,P,q),this.uv.push(T/i*R*Math.max(g,.2),w),this.count++}b.push(z)}for(let v=0;v<u-1;v++)for(let F=0;F<i;F++){const y=b[v]+F,s=y+1,c=b[v+1]+F+1,l=b[v+1]+F;this.idx.push(y,l,c,y,c,s)}}toGeometry(){const e=new f.BufferGeometry;return e.setAttribute("position",new f.Float32BufferAttribute(this.p,3)),e.setAttribute("normal",new f.Float32BufferAttribute(this.n,3)),e.setAttribute("uv",new f.Float32BufferAttribute(this.uv,2)),e.setIndex(this.idx),e}get triangles(){return this.idx.length/3}}const lt=[[1,0,0],[1,.4,1],[1,1,0],[-1,0,0],[-1,1,0],[-1,.4,1]];class ot{constructor(e=512){this.cap=e,this.p=new Float32Array(e*18),this.n=new Float32Array(e*18),this.ax=new Float32Array(e*18),this.cr=new Float32Array(e*24),this.count=0}add(e,i,t,u,r){if(this.count===this.cap){this.cap*=2;for(const c of["p","n","ax","cr"]){const l=new Float32Array(this.cap*(c==="cr"?24:18));l.set(this[c]),this[c]=l}}const w=this.count*18,b=this.count*24,v=this.p,F=this.n,y=this.ax,s=this.cr;for(let c=0;c<6;c++){const l=w+c*3,h=b+c*4,M=lt[c];v[l]=e[0],v[l+1]=e[1],v[l+2]=e[2],F[l]=t[0],F[l+1]=t[1],F[l+2]=t[2],y[l]=i[0]*u,y[l+1]=i[1]*u,y[l+2]=i[2]*u,s[h]=M[0],s[h+1]=M[1],s[h+2]=r,s[h+3]=M[2]}this.count++}toGeometry(){const e=new f.BufferGeometry,i=this.count;return e.setAttribute("position",new f.BufferAttribute(this.p.slice(0,i*18),3)),e.setAttribute("normal",new f.BufferAttribute(this.n.slice(0,i*18),3)),e.setAttribute("aAx",new f.BufferAttribute(this.ax.slice(0,i*18),3)),e.setAttribute("aCr",new f.BufferAttribute(this.cr.slice(0,i*24),4)),e}}const O=a=>{const e=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/e,a[1]/e,a[2]/e]},nt=(a,e)=>[a[1]*e[2]-a[2]*e[1],a[2]*e[0]-a[0]*e[2],a[0]*e[1]-a[1]*e[0]];function*it(a,e){const i=e.height??28,t=e.spread??10,u=e.leaves??1800,r=e.leafLen??.62,w=e.sides??8,b=e.clearY??10,v=e.detail??1,F=e.trunk??1.15,y=new at,s=[],c=i*a.range(.4,.46),l=[a.range(-.8,.8),a.range(-.8,.8)],h=a.range(0,R),M=x=>[l[0]*x*x+.3*Math.sin(x*5+h)*x,-1.2+(c+1.2)*x,l[1]*x*x+.3*Math.cos(x*4+h)*x],C=[];for(let x=0;x<=12;x++){const S=x/12,W=M(S);C.push([W[0],W[1],W[2],F*(1+.9*Math.pow(1-S,6))*(1-.34*S)*(1+.07*Math.sin(S*19+h)*Math.min(1,S*4))])}y.tube(C,w);const A=v?a.int(5,7):4,k=a.range(0,R);for(let x=0;x<A;x++){const S=k+x/A*R+a.range(-.3,.3),W=a.range(2.6,4.4)*F,P=Math.cos(S),q=Math.sin(S),L=a.range(-.5,.5),N=[];for(let H=0;H<=5;H++){const G=H/5,I=F*.55+W*G,j=1.9*Math.pow(1-G,2.2)-.25-.3*G;N.push([P*I-q*L*G*G*1.4,j,q*I+P*L*G*G*1.4,F*(.5*Math.pow(1-G,1.3)+.09)])}y.tube(N,v?5:4)}yield;const n=(x,S,W,P,q,L)=>{const N=Math.cos(S),H=Math.sin(S),G=[],I=L===0?6:4,j=a.range(-.35,.35),K=L===0?a.range(.15,.4):a.range(0,.3);for(let _=0;_<=I;_++){const U=_/I,E=P*Math.cos(W)*U,Y=P*Math.sin(W)*(U-K*U*U),V=j*P*U*U*.5;G.push([x[0]+N*E-H*V,x[1]+Y,x[2]+H*E+N*V,q*Math.pow(1-U,.75)*.94+q*.06+.035])}return y.tube(G,L===0?Math.max(4,w-2):v?4:3),G},o=v?a.int(6,8):5,m=a.range(0,R),d=x=>t*(.35+.65*Math.sin(Math.PI*st((x-b)/(i-b),.02,.98))**.7);for(let x=0;x<o;x++){const S=m+x/o*R+a.range(-.25,.25),W=x%2===0,P=W?a.range(.8,1):a.range(.66,.84),q=W?a.range(.75,1.15):a.range(.3,.6),L=W?(i-c)*a.range(.7,.92):t*a.range(.85,1.12),N=n(M(P),S,q,L,F*(W?.42:.36),0);for(const H of v?[.38,.6,.8,1]:[.5,1]){const G=H*6,I=Math.min(5,Math.floor(G)),j=G-I,K=N[I],_=N[I+1],U=[Z(K[0],_[0],j),Z(K[1],_[1],j),Z(K[2],_[2],j)];if(H<1){const E=n(U,S+a.pick([-1,1])*a.range(.5,1.2),a.range(.1,.9),t*a.range(.32,.55),F*.15,1),Y=E[E.length-1],V=E[2];s.push([Y[0],Y[1],Y[2],a.range(2.3,3.5)]),v&&s.push([V[0],V[1],V[2],a.range(1.8,2.7)])}else s.push([U[0],U[1],U[2],a.range(2.8,3.9)]);v&&H>.5&&s.push([U[0]+a.range(-1.5,1.5),U[1]+a.range(.5,2.2),U[2]+a.range(-1.5,1.5),a.range(2,3)])}x%2===1&&(yield)}for(let x=0,S=v?14:6;x<S;x++){const W=Z(b+3.5,i-2.5,Math.pow(a(),.7)),P=a.range(0,R),q=d(W)*Math.sqrt(a())*.9;s.push([l[0]+Math.cos(P)*q,W,l[1]+Math.sin(P)*q,a.range(2.4,3.6)])}const p=new ot,z=Math.max(4,Math.round(u/s.length));let g=0;for(const x of s){++g%6===0&&(yield);const S=O([x[0]-l[0],(x[1]-(b+i)*.5)*.6,x[2]-l[1]]);for(let W=0;W<z;W++){let P=a.gauss(),q=a.gauss()*.75,L=a.gauss();const N=Math.hypot(P,q,L)||1;P/=N,q/=N,L/=N;const H=x[3]*(.55+.45*Math.cbrt(a())),G=r*a.range(.7,1.35),I=x[0]+P*H,j=Math.max(x[1]+q*H,b+G),K=x[2]+L*H,_=O([P*.55+S[0]*.25+a.range(-.35,.35),-.95+q*.4+a.range(-.3,.3),L*.55+S[2]*.25+a.range(-.35,.35)]),U=O(nt(_,O([a.range(-1,1),a.range(-.3,.3),a.range(-1,1)])));p.add([I,j,K],_,U,G,a())}}yield;const T=y.toGeometry();yield;const B=p.toGeometry();return yield,T.computeBoundingSphere(),B.computeBoundingSphere(),yield,{wood:T,leaves:B,height:i,radius:t+3,trunkTop:M(1),leafCount:p.count,woodTriangles:y.triangles,clusters:s}}function wt(a,e={}){const i=it(a,e);let t=i.next();for(;!t.done;)t=i.next();return t.value}async function xt(a,e,i){const t=it(a,e);let u=t.next();for(;!u.done;)await i(),u=t.next();return u.value}function gt(a,e={}){const i=e.length??14,t=e.radius??.8,u=e.leaves??520,r=e.leafLen??.62,w=new at,b=new ot,v=[],F=a.range(0,R),y=[];for(let l=0;l<=10;l++){const h=l/10,M=t*(1-.82*h)+.06;y.push([i*h,M*.8+.5*Math.sin(h*3.1)*h+.9*h*h,.9*Math.sin(h*4+F)*h,M])}w.tube(y,8);for(let l=0;l<6;l++){const h=l/6*R+a.range(-.3,.3),M=a.range(.8,1.7),C=t*.8,A=Math.sin(h)*t,k=Math.cos(h)*t;w.tube([[.15,C+A*.6,k*.6,.22],[-M*.5,C+A*.75,k*.75,.13],[-M,C+A*.9+a.range(-.1,.25),k*.9,.02]],4)}const s=7;for(let l=0;l<s;l++){const h=.22+.7*l/(s-1),M=y[Math.round(h*10)],C=l%2?1:-1,A=a.range(.15,1.05),k=a.range(3.2,5.6)*(1-.3*h),n=a.range(.3,.8),o=[];for(let p=0;p<=4;p++){const z=p/4;o.push([M[0]+n*k*z,Math.max(M[1]+Math.sin(A)*k*z*(1-.25*z),.12),M[2]+C*Math.cos(A)*k*z,M[3]*.55*(1-.8*z)+.04])}w.tube(o,5);const m=o[4],d=o[2];v.push([m[0],m[1],m[2],a.range(1.5,2.3)],[d[0],d[1],d[2],a.range(1.1,1.7)])}v.push([y[10][0],y[10][1],y[10][2],2.2],[y[8][0],y[8][1],y[8][2],1.6]);const c=Math.max(4,Math.round(u/v.length));for(const l of v)for(let h=0;h<c;h++){let M=a.gauss(),C=a.gauss()*.6,A=a.gauss();const k=Math.hypot(M,C,A)||1;M/=k,C/=k,A/=k;const n=l[3]*(.4+.6*Math.cbrt(a())),o=r*a.range(.7,1.3),m=Math.max(l[1]+C*n,.1);let d=O([M*.6+a.range(-.4,.4),-.5+C*.5+a.range(-.4,.4),A*.6+a.range(-.4,.4)]);m<o&&(d=O([d[0],.05,d[2]]));const p=O(nt(d,O([a.range(-1,1),a.range(-.3,.3),a.range(-1,1)]))),z=a();(!e.keep||e.keep(l[0]+M*n,m,l[2]+A*n))&&b.add([l[0]+M*n,m,l[2]+A*n],d,p,o,z)}return{wood:w.toGeometry(),leaves:b.toGeometry(),length:i,leafCount:b.count}}const $={fall:[4.4,7.4],drag:1.4,delay:1.3},ut=`
// small sliding spectra, as thrown by cut stones: q in metres, each cell may hold one short smear of pure hues
vec3 spectra(vec2 q, float t){
  q += vec2(t*.11, -t*.07);
  vec2 i = floor(q), f = fract(q); vec2 o = h22(i)*.5+.25;
  vec2 d = f-o; float a = h21(i+3.7)*6.2832; d = vec2(d.x*cos(a)+d.y*sin(a), -d.x*sin(a)+d.y*cos(a));
  float on = step(.5, h21(i+11.3))*(.6+.4*sin(t*1.3+h21(i)*40.));
  float m = (1.-smoothstep(0., .2, abs(d.x)))*(1.-smoothstep(0., .07, abs(d.y)));
  return hue(.62 - d.x*2.2 + h21(i)*.2)*m*on;
}`,J=`
attribute vec3 aAx; attribute vec4 aCr;
uniform float uTime, uTremble, uWidth;
varying vec3 vN, vWp, vCr;
vec3 rotAbout(vec3 v, vec3 k, float a){ float c = cos(a), s = sin(a); return v*c + cross(k, v)*s + k*dot(k, v)*(1.-c); }
// blade(): the kite, built at stem point c from its axis (unit axn, length len) and normal n, rolled by ang about the axis
vec3 blade(vec3 c, vec3 axn, float len, vec3 n, float ang, out vec3 nOut){
  vec3 sd = cross(n, axn); float ca = cos(ang), sa = sin(ang);
  vec3 s2 = sd*ca + n*sa, n2 = n*ca - sd*sa;
  nOut = normalize(n2 - s2*aCr.x*.55);
  return c + axn*(aCr.y*len) + s2*(aCr.x*aCr.w*len*uWidth);
}`,tt=`
uniform vec3 uLeaf, uShade; uniform float uKind, uTime, uGain; uniform vec4 uWave, uRing; uniform vec3 uRingO, uRingD; uniform vec2 uFar;
varying vec3 vN, vWp, vCr;
void main(){
  vec3 v = cameraPosition - vWp; float dist = length(v); v /= max(dist, 1e-4);
  if (dist > uFar.x && h21(gl_FragCoord.xy) < (dist - uFar.x)/max(uFar.y - uFar.x, 1.)) discard;
  vec3 n = normalize(vN + vec3(1e-5)); if (dot(n, v) < 0.) n = -n;
  float ndv = clamp(dot(n, v), 0., 1.), ph = vCr.z;
  vec3 r = reflect(-v, n);
  float e = .5+.5*sin(dot(r, vec3(2.3,1.1,2.9))*2.6 + ph*40.);
  float e2 = .5+.5*sin(dot(r, vec3(-1.7,2.6,1.3))*4.1 + ph*91. + uTime*.9);
  float lum = smoothstep(.15, .95, e*.65+e2*.35);
  float glint = clamp(e*e2, 0., 1.); glint = glint*glint*glint; glint *= glint;
  float wave = smoothstep(.5, 1., sin(dot(vWp, uWave.xyz) - uTime*uWave.w + sin(vWp.y*.21)*1.3));
  float rs = dot(vWp - uRingO, uRingD), rq = (rs - uRing.x)/max(uRing.z, 1.);
  float ring = exp(-min(rq*rq, 40.))*uRing.y;
  float rib = smoothstep(0., .14, abs(vCr.x));
  vec3 col;
  float deep = step(.62, h11(ph*57.3));
  if (uKind < 1.5) {
    col = mix(uShade*.1, uLeaf*.82, lum*lum)*(.55+.45*rib)*(1.-.6*deep) + uLeaf*glint*(2.4+3.*wave) + uLeaf*wave*.16;
  } else {
    vec3 sp = hue(ph*3.7 + dot(r, vec3(.9,.4,.7))*.9 + uTime*.04);
    float clear = .1 + .9*(1.-ndv)*(1.-ndv);
    col = uShade*.07 + uLeaf*clear*lum*.5*(1.-.5*deep) + mix(uLeaf, sp, .8)*glint*(3.4+4.*wave) + sp*(1.-rib)*.42*(.4+.6*lum) + uLeaf*wave*.14;
    col += hue(rs*.012 + ph*.3)*ring*(.3 + 1.5*lum*lum) + uLeaf*ring*.1;
  }
  gl_FragColor = vec4(fogged(col*uGain, dist, .55), 1.);
}`;function ct(a,e={}){const i={uTime:{value:0},uFogCol:{value:new f.Color(e.fog??"#070a18")},uFogDen:{value:e.fogDensity??.0021},uRing:{value:new f.Vector4(-1e5,0,26,0)},uRingO:{value:new f.Vector3},uRingD:{value:new f.Vector3(0,0,-1)},uMinAng:{value:.003},uFar:{value:new f.Vector2(e.farA??250,e.farB??300)}},t={silver:{leaf:new f.Color("#cfd8ff"),shade:new f.Color("#8fa0d8"),kind:0,gain:1},gold:{leaf:new f.Color("#ffcc55"),shade:new f.Color("#b8791c"),kind:1,gain:.8},diamond:{leaf:new f.Color("#f3fbff"),shade:new f.Color("#9fc8ee"),kind:2,gain:1}},u=(s,c,l={})=>({uTime:i.uTime,uFogCol:i.uFogCol,uFogDen:i.uFogDen,uRing:i.uRing,uRingO:i.uRingO,uRingD:i.uRingD,uFar:i.uFar,uLeaf:{value:t[s].leaf},uShade:{value:t[s].shade},uKind:{value:t[s].kind},uGain:{value:t[s].gain*(c.gain??1)},uTremble:{value:c.tremble??1},uWidth:{value:c.width??.42},uWave:{value:new f.Vector4(...c.wave??[.05,.11,-.085,1.5])},...l});return{U:i,METALS:t,leafMaterial:(s,c={})=>new f.ShaderMaterial({side:f.DoubleSide,uniforms:u(s,c),vertexShader:J+`
void main(){
  #ifdef USE_INSTANCING
    mat4 mm = modelMatrix*instanceMatrix;
  #else
    mat4 mm = modelMatrix;
  #endif
  float len = length(aAx); vec3 axn = aAx/max(len, 1e-4); float ph = aCr.z*6.2832;
  vec3 wc = (mm*vec4(position, 1.)).xyz;
  float ang = (sin(uTime*(2.+3.2*aCr.z) + ph*7. + wc.x*.31 + wc.z*.27)*.6 + sin(uTime*7.3 + ph*13.)*.2)*uTremble;
  vec3 nn; vec3 p = blade(position, axn, len, normal, ang, nn);
  vec4 wp = mm*vec4(p, 1.);
  vN = normalize(mat3(mm)*nn); vWp = wp.xyz; vCr = vec3(aCr.x*aCr.w, aCr.y, aCr.z);
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,fragmentShader:X+tt}),fallingMaterial:(s,c={})=>new f.ShaderMaterial({side:f.DoubleSide,uniforms:u(s,c,{uFall:{value:c.fall??22},uFloor:{value:c.floor??0},uAmount:{value:1}}),vertexShader:X.split("uniform vec3 uFogCol")[0]+J+`
uniform float uFall, uFloor, uAmount;
void main(){
  float pz = aCr.z, sp = mix(1.0, 2.3, h11(pz*71.3)), ph = pz*6.2832;
  float drop = mod(uTime*sp + pz*uFall*7., uFall);
  vec3 c = position; c.y -= drop;
  c.x += sin(uTime*.8 + ph*5.)*1.3 + sin(uTime*.33 + ph*11.)*.8; c.z += cos(uTime*.66 + ph*7.)*1.3;
  float len = length(aAx); vec3 axn = aAx/max(len, 1e-4);
  vec3 k = normalize(vec3(h11(pz*13.1)-.5, .35, h11(pz*29.7)-.5));
  float a = uTime*(1.1+1.6*h11(pz*5.3)) + ph*3.;
  axn = rotAbout(axn, k, a); vec3 n = rotAbout(normal, k, a);
  float show = smoothstep(0., 1.5, drop)*smoothstep(uFloor, uFloor+.8, c.y)*step(h11(pz*91.7), uAmount);
  vec3 nn; vec3 p = blade(c, axn, len*show, n, sin(uTime*3.+ph)*.5, nn);
  vN = nn; vWp = p; vCr = vec3(aCr.x*aCr.w, aCr.y, pz);
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
}`,fragmentShader:X+tt}),burstMaterial:(s,c={})=>new f.ShaderMaterial({side:f.DoubleSide,uniforms:u(s,c,{uBurst:{value:-1},uFloor:{value:c.floor??0}}),vertexShader:X.split("uniform vec3 uFogCol")[0]+J+`
uniform float uBurst, uFloor;
void main(){
  float pz = aCr.z, ph = pz*6.2832, tau = uBurst - h11(pz*37.1)*${$.delay.toFixed(2)};
  float tt = max(tau, 0.), kd = ${$.drag.toFixed(2)}, glide = (1.-exp(-tt*kd))/kd;
  vec3 vel = vec3(h11(pz*17.3)-.5, h11(pz*23.9)*.5, h11(pz*41.1)-.5)*vec3(4., 5., 4.);
  vec3 c = position + vel*glide; c.y -= mix(${$.fall[0].toFixed(2)}, ${$.fall[1].toFixed(2)}, h11(pz*7.7))*(tt - glide);
  c.x += sin(tt*1.7 + ph*5.)*.25*min(tt, 2.); c.z += cos(tt*1.3 + ph*9.)*.25*min(tt, 2.);
  float rest = step(c.y, uFloor + .06); c.y = max(c.y, uFloor + .06);
  float len = length(aAx); vec3 axn = aAx/max(len, 1e-4);
  vec3 k = normalize(vec3(h11(pz*13.1)-.5, .35, h11(pz*29.7)-.5));
  float a = (tt*(2.+2.*h11(pz*5.3)) + ph*3.)*(1.-rest);
  axn = rotAbout(axn, k, a); vec3 n = rotAbout(normal, k, a);
  axn = normalize(mix(axn, normalize(vec3(axn.x, 0., axn.z) + vec3(1e-4)), rest)); n = normalize(mix(n, vec3(0., 1., 0.), rest*.9));
  float show = step(0., tau);
  vec3 nn; vec3 p = blade(c, axn, len*show, n, 0., nn);
  vN = nn; vWp = p; vCr = vec3(aCr.x*aCr.w, aCr.y, pz);
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
}`,fragmentShader:X+tt}),woodMaterial:(s,c={})=>new f.ShaderMaterial({uniforms:{uTime:i.uTime,uFogCol:i.uFogCol,uFogDen:i.uFogDen,uFar:i.uFar,uGlow:{value:t[s].leaf},uSpectra:{value:s==="diamond"?1:0},uCanopy:{value:c.canopy??12},uLift:{value:c.lift??1}},vertexShader:`
varying vec3 vN, vWp; varying vec2 vUv; varying float vY;
void main(){
  #ifdef USE_INSTANCING
    mat4 mm = modelMatrix*instanceMatrix;
  #else
    mat4 mm = modelMatrix;
  #endif
  vec4 wp = mm*vec4(position, 1.); vN = normalize(mat3(mm)*normal); vWp = wp.xyz; vUv = uv; vY = position.y;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,fragmentShader:X+ut+`
uniform vec3 uGlow; uniform float uTime, uSpectra, uCanopy, uLift; uniform vec2 uFar;
varying vec3 vN, vWp; varying vec2 vUv; varying float vY;
void main(){
  vec3 v = cameraPosition - vWp; float dist = length(v); v /= max(dist, 1e-4);
  if (dist > uFar.x && h21(gl_FragCoord.xy) < (dist - uFar.x)/max(uFar.y - uFar.x, 1.)) discard;
  vec3 n = normalize(vN + vec3(1e-5));
  float rg = fbm2(vec2(vUv.x*2.4, vUv.y*.3));
  // old bark: deep furrows running up the stem and thick plates between them. The furrow's slope round the stem tilts the
  // normal, so the plates take the light on one flank and stand in their own shade on the other
  float fur = vn2(vec2(vUv.x*3.6 + rg*1.6, vUv.y*.24)), fur2 = vn2(vec2((vUv.x + .09)*3.6 + rg*1.6, vUv.y*.24)), fine = vn2(vec2(vUv.x*12., vUv.y*1. + rg*3.));
  float furrow = smoothstep(.26, .62, fur)*(.62+.38*fine), furrow2 = smoothstep(.26, .62, fur2)*(.62+.38*fine);
  float knots = smoothstep(.62, .8, vn2(vec2(vUv.x*.9 + 7., vUv.y*.55)));
  n = normalize(n - normalize(cross(vec3(0., 1., 0.), n) + vec3(1e-4))*(furrow2 - furrow)*5.);
  vec3 bark = mix(vec3(.016,.014,.02), vec3(.13,.105,.1), rg)*(.12+.88*furrow)*(1.-.5*knots);
  float top = clamp(n.y*.5+.5, 0., 1.), hgt = smoothstep(1., uCanopy, vY), low = 1.-smoothstep(-.5, 4., vY);
  float form = .5 + .75*clamp(dot(n, normalize(v + vec3(0., .9, 0.))), 0., 1.);
  vec3 light = uGlow*(.22 + .95*hgt*(.3+.7*top) + .5*low*(1.-.6*top))*form;
  float rim = 1.-clamp(dot(n, v), 0., 1.); rim = rim*rim*rim;
  vec3 col = bark*light*1.6*uLift + uGlow*rim*(.035+.11*hgt)*uLift*(.35+.65*furrow);
  col += spectra(vWp.xz*.6 + vWp.y*.45, uTime)*uSpectra*(.35+.65*top)*.5;
  gl_FragColor = vec4(fogged(col, dist, 1.), 1.);
}`}),makeSparks:(s,c={})=>{const l=s.length,h=new f.InstancedBufferGeometry;h.setAttribute("position",new f.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),h.setIndex([0,1,2,0,2,3]);const M=new Float32Array(l*3),C=new Float32Array(l*3),A=new Float32Array(l*4),k=new Float32Array(l);s.forEach((p,z)=>{M.set(p.p,z*3),C.set(p.c,z*3),A.set([p.size??1,p.ph??0,p.kind??0,p.s??0],z*4),k[z]=p.mirror?1:0});const n=new f.InstancedBufferAttribute(M,3);h.setAttribute("iPos",n),h.setAttribute("iCol",new f.InstancedBufferAttribute(C,3)),h.setAttribute("iPar",new f.InstancedBufferAttribute(A,4)),h.setAttribute("iM",new f.InstancedBufferAttribute(k,1)),h.instanceCount=l;const o={uTime:i.uTime,uFogCol:i.uFogCol,uFogDen:i.uFogDen,uMinAng:i.uMinAng,uBeat:{value:c.beat??1.6},uPulse:{value:c.pulse??.7},uGain:{value:c.gain??1},uFogK:{value:c.fogK??.35}},m=new f.ShaderMaterial({uniforms:o,transparent:!0,depthWrite:!1,blending:f.AdditiveBlending,vertexShader:`
attribute vec3 iPos, iCol; attribute vec4 iPar; attribute float iM;
uniform float uTime, uMinAng, uBeat, uPulse, uGain, uFogK, uFogDen;
varying vec2 vQ; varying vec3 vC; varying float vK;
float hs(float p){ p = fract(p*.1031); p *= p+33.33; p *= p+p; return fract(p); }
void main(){
  vec4 mv = viewMatrix*modelMatrix*vec4(iPos, 1.);
  float d = max(-mv.z, .01), sz = iPar.x, s = max(sz, d*uMinAng), k = (sz*sz)/(s*s);
  float ph = iPar.y, a = 1.;
  if (iPar.z < .5) a = .82 + .18*sin(uTime*(5.+4.*hs(ph)) + ph*30.)*sin(uTime*2.3 + ph*11.);
  else if (iPar.z < 1.5) { float b = .5+.5*sin(6.2832*(uTime*uBeat - iPar.w*.11)); b *= b; b *= b; a = (1.-uPulse*.6) + uPulse*1.9*b; }
  else { float tw = .5+.5*sin(uTime*(.7+1.6*hs(ph*3.)) + ph*50.); tw *= tw; tw *= tw; a = .12 + 1.5*tw*tw; }
  vec2 q = position.xy; vQ = q; vK = iM;
  mv.xy += q*s*vec2(1., 1.+iM*1.1);
  float deep = mix(1., exp(clamp((modelMatrix*vec4(iPos, 1.)).y, -400., 0.)*.02), iM);
  vC = iCol*a*k*uGain*exp(-d*uFogDen*uFogK)*(1.-iM*.6)*deep;
  gl_Position = projectionMatrix*mv;
}`,fragmentShader:`
varying vec2 vQ; varying vec3 vC; varying float vK;
void main(){
  float r2 = dot(vQ, vQ); float g = exp(-r2*5.5) + .35*exp(-r2*1.7); g *= clamp(1.-r2, 0., 1.);
  gl_FragColor = vec4(vC*g, 1.);
}`}),d=new f.Mesh(h,m);return d.frustumCulled=!1,d.renderOrder=c.renderOrder??6,{mesh:d,uniforms:o,positions:M,attribute:n,count:l}},update:(s,c,l)=>{if(i.uTime.value=s,c&&l){const h=l.getDrawingBufferSize(ft);i.uMinAng.value=1.7*2*Math.tan((c.fov||60)*Math.PI/360)/Math.max(h.y,1)}}}}const ft=new f.Vector2;class ht{constructor(){this.p=[],this.n=[],this.uv=[],this.a=[],this.b=[],this.idx=[],this.count=0,this.A=[0,1,0,0],this.B=[0,0,1,0]}mat(e,i=1){return this.A=[e,1,0,0],this.B=[0,0,i,0],this}win(e,i,t,u,r,w=1){return this.A=[1,e,i,t],this.B=[u,r,w,0],this}v(e,i,t,u,r,w,b){return this.p.push(e[0],e[1],e[2]),this.n.push(i,t,u),this.uv.push(r,w),this.a.push(this.A[0],b??this.A[1],this.A[2],this.A[3]),this.b.push(this.B[0],this.B[1],this.B[2],this.B[3]),this.count++}quad(e,i,t,u,r,w,b){const v=i[0]-e[0],F=i[1]-e[1],y=i[2]-e[2],s=u[0]-e[0],c=u[1]-e[1],l=u[2]-e[2];let h=F*l-y*c,M=y*s-v*l,C=v*c-F*s;const A=Math.hypot(h,M,C)||1;h/=A,M/=A,C/=A;const k=r||[0,0,Math.hypot(v,F,y),Math.hypot(s,c,l)],n=b||[[h,M,C],[h,M,C],[h,M,C],[h,M,C]],o=this.v(e,n[0][0],n[0][1],n[0][2],k[0],k[1],w),m=this.v(i,n[1][0],n[1][1],n[1][2],k[2],k[1],w),d=this.v(t,n[2][0],n[2][1],n[2][2],k[2],k[3],w),p=this.v(u,n[3][0],n[3][1],n[3][2],k[0],k[3],w);this.idx.push(o,m,d,o,d,p)}fit(e){return this.A[0]===1?e/Math.max(1,Math.round(e/this.A[1])):void 0}wallX(e,i,t,u,r,w=1){const b=i-e,v=this.fit(b);w>0?this.quad([e,t,r],[i,t,r],[i,u,r],[e,u,r],[0,0,b,u-t],v):this.quad([i,t,r],[e,t,r],[e,u,r],[i,u,r],[0,0,b,u-t],v)}wallZ(e,i,t,u,r,w=1){const b=i-e,v=this.fit(b);w>0?this.quad([r,t,i],[r,t,e],[r,u,e],[r,u,i],[0,0,b,u-t],v):this.quad([r,t,e],[r,t,i],[r,u,i],[r,u,e],[0,0,b,u-t],v)}top(e,i,t,u,r){this.quad([e,r,u],[t,r,u],[t,r,i],[e,r,i],[e,i,t,u])}box(e,i,t,u,r,w,b={}){this.wallX(e,u,i,r,w,1),b.back!==!1&&this.wallX(e,u,i,r,t,-1),this.wallZ(t,w,i,r,u,1),this.wallZ(t,w,i,r,e,-1),b.top!==!1&&this.top(e,t,u,w,r)}lathe(e,i,t,u,r={}){const w=r.rot??0;for(let b=0;b<t.length-1;b++){const[v,F]=t[b],[y,s]=t[b+1],c=R*Math.max(v,y),l=this.fit(c),h=Math.hypot(y-v,s-F)||1,M=(v-y)/h,C=(s-F)/h;for(let A=0;A<u;A++){const k=w+A/u*R,n=w+(A+1)/u*R,o=Math.cos(k),m=Math.sin(k),d=Math.cos(n),p=Math.sin(n),z=[e+m*v,F,i+o*v],g=[e+p*v,F,i+d*v],T=[e+p*y,s,i+d*y],B=[e+m*y,s,i+o*y],x=[m*C,M,o*C],S=[p*C,M,d*C],W=r.ribs?A/u*r.ribs:A/u*c,P=r.ribs?(A+1)/u*r.ribs:(A+1)/u*c;this.quad(z,g,T,B,[W,r.v0??F-t[0][1],P,r.v0!==void 0?r.v0+h:s-t[0][1]],l,r.flat?null:[x,S,S,x])}}}toGeometry(){const e=new f.BufferGeometry;return e.setAttribute("position",new f.Float32BufferAttribute(this.p,3)),e.setAttribute("normal",new f.Float32BufferAttribute(this.n,3)),e.setAttribute("uv",new f.Float32BufferAttribute(this.uv,2)),e.setAttribute("aA",new f.Float32BufferAttribute(this.a,4)),e.setAttribute("aB",new f.Float32BufferAttribute(this.b,4)),e.setIndex(this.idx),e}get triangles(){return this.idx.length/3}}const D={sill:6.3,doorHalf:5.1,portalW:9.4,portalH:14,doorZ:4,stairFootZ:60,landZ:20,width:164,height:92};async function vt(a,e,i){const t=new ht,u=[],r=6,w=()=>a.range(0,50),b=et("#ffd9a0"),v=(n,o,m,d,p=b,z=0)=>u.push({p:[n,o,m],c:p,size:d,kind:z,ph:a()}),F=(n,o,m,d,p=1.5)=>{const z=Math.hypot(o[0]-n[0],o[1]-n[1],o[2]-n[2]),g=Math.max(2,Math.round(z/p));for(let T=0;T<=g;T++){const B=T/g,x=e[(Math.round(d/p)+T)%e.length];u.push({p:[Z(n[0],o[0],B),Z(n[1],o[1],B)-m*4*B*(1-B),Z(n[2],o[2],B)],c:x,size:.62,kind:1,s:d+B*z,ph:a()})}return d+z},y=(n,o,m,d,p=1)=>{t.mat(0,.8),t.box(n-.2*p,o,m-.2*p,n+.2*p,o+d,m+.2*p,{top:!1}),t.mat(5,1),t.box(n-.42*p,o+d,m-.42*p,n+.42*p,o+d+.95*p,m+.42*p),t.mat(2,1),t.lathe(n,m,[[.75*p,o+d+.95*p],[.05,o+d+1.7*p]],4,{rot:Math.PI/4,flat:!0}),v(n,o+d+.5*p,m,1.5*p)};for(const n of[-1,1]){const o=n>0?D.doorHalf:-27,m=n>0?27:-D.doorHalf;t.win(7.3,2.1,2.3,13.6,w(),1.15),t.wallX(o,m,r,22,4),t.win(6.8,1.9,2.3,13.6,w(),.9),t.wallZ(-30,4,r,22,n*27,n),t.win(6.8,1.8,2,11,w(),.8),t.wallZ(-30,4,22,35,n*27,n),t.mat(0,.7),t.wallZ(-30,4,-2,r,n*27,n)}t.win(7.7,2,2,11,w(),1),t.wallX(-27,27,22,35,4),t.mat(0,.5),t.wallX(-27,27,-2,35,-30,-1);const s=D.doorHalf,c=D.sill+D.portalH-D.portalW/2+.3,l=14;for(let n=0;n<l;n++){const o=Math.PI*n/l,m=Math.PI*(n+1)/l,d=[s*Math.cos(o),c+s*Math.sin(o)],p=[s*Math.cos(m),c+s*Math.sin(m)];t.mat(0,1.25),t.quad([p[0],p[1],4],[d[0],d[1],4],[d[0],22,4],[p[0],22,4]);const z=[(s+1)*Math.cos(o),c+(s+1)*Math.sin(o)],g=[(s+1)*Math.cos(m),c+(s+1)*Math.sin(m)];t.mat(3,1.5),t.quad([p[0],p[1],4.2],[d[0],d[1],4.2],[z[0],z[1],4.2],[g[0],g[1],4.2]),t.mat(5,1.3),t.quad([d[0],d[1],4.2],[p[0],p[1],4.2],[p[0],p[1],-2],[d[0],d[1],-2])}for(const n of[-1,1])t.mat(5,1.3),t.wallZ(-2,4.2,r,c,n*s,-n),t.mat(3,1.5),t.wallX(n>0?s:-s-1,n>0?s+1:-s,r,c,4.2);t.mat(6,1),t.wallX(-s,s,r,c+s,-2),t.mat(5,.8),t.top(-s,-2,s,4.2,r+.02),t.mat(3,.9),t.box(-28,35,-31,28,36.1,5),t.mat(0,.75),t.box(-27.6,36.1,4.1,27.6,37.3,4.6);for(const n of[-1,1])t.box(n>0?27.1:-27.6,36.1,-30.6,n>0?27.6:-27.1,37.3,4.6);await i.yield(),t.win(6.3,1.8,1.6,11.2,w(),.85),t.wallX(-19,19,36.1,50,-3);for(const n of[-1,1])t.win(6,1.7,1.6,11.2,w(),.7),t.wallZ(-27,-3,36.1,50,n*19,n);t.mat(3,.8),t.box(-19.8,50,-27.8,19.8,51,-2.2),t.win(6.3,1.6,1.2,7.4,w(),.8),t.lathe(0,-15,[[12,51],[12,59.5]],36),t.mat(3,.8),t.lathe(0,-15,[[12,59.5],[12.9,59.9],[12.9,60.7],[12.2,61]],36);const h=[];for(let n=0;n<=9;n++){const o=n/9*Math.PI/2;h.push([12.2*Math.pow(Math.cos(o),.8)+.9*Math.sin(o),61+15.5*Math.pow(Math.sin(o),.92)])}t.mat(2,1),t.lathe(0,-15,h,36,{ribs:12}),t.win(2.9,.8,.8,4.6,w(),1.4),t.lathe(0,-15,[[2.8,76],[2.8,81.5]],12),t.mat(2,1),t.lathe(0,-15,[[3.5,81.5],[1.2,85],[.35,87],[.05,92]],12,{ribs:6}),v(0,79,-15,7,Q(b,1.3)),await i.yield();for(const n of[-1,1]){const o=g=>n*g,m=(g,T,B,x,S,W=1)=>t.wallX(Math.min(o(g),o(T)),Math.max(o(g),o(T)),B,x,S,W),d=(g,T,B,x,S,W,P)=>t.box(Math.min(o(g),o(x)),T,B,Math.max(o(g),o(x)),S,W,P);t.win(5.5,1.45,2,5.9,w(),.75),m(16,82.6,-2,r,10),t.mat(4,1),t.top(Math.min(o(16),o(82.6)),-2,Math.max(o(16),o(82.6)),10,r),t.mat(0,1.1),d(16,r,9.55,82.6,r+1.15,10,{}),t.mat(0,.7),t.wallZ(-14,10,-2,r,o(82.6),n),t.win(6.5,1.9,2.2,15.6,w(),1),m(27,66,r,26,-2),t.mat(3,.85),d(27,26,-26.5,66,27,-1.4,{}),t.mat(0,.7),d(27,27,-1.95,66,28.1,-1.5,{}),t.mat(0,.4),m(27,66,-2,27,-26,-1),t.win(5.33,1.55,2.2,14.4,w(),1.1),m(66,82,r,24,2),t.win(5.33,1.45,1.8,10.8,w(),.9),m(66,82,24,38,2),t.win(5.33,1.6,2.2,14.4,w(),.8),t.wallZ(-14,2,r,24,o(82),n),t.win(5.33,1.5,1.8,10.8,w(),.7),t.wallZ(-14,2,24,38,o(82),n),t.win(5.33,1.5,1.8,10.8,w(),.7),t.wallZ(-14,2,24,38,o(66),-n),t.mat(0,.8),t.wallZ(-2,2,r,24,o(66),-n),t.mat(0,.4),m(66,82,-2,38,-14,-1),t.mat(3,.85),d(65.2,38,-14.8,82.8,39,2.8,{}),t.mat(2,1),t.lathe(o(74),-6,[[12.4,39],[9.2,43.5],[5.2,49],[2.2,54],[.5,58],[.05,63]],4,{rot:Math.PI/4,flat:!0,ribs:4}),v(o(74),63.4,-6,3.4,Q(b,1.1)),await i.yield();for(let g=0;g<6;g++)t.win(5.8,1,3.2,8.6,w()+g*.5,.75),t.lathe(o(42),-31,[[4.6,g*11],[4.6,g*11+11]],14,{rot:g*.63});t.mat(3,.7),t.lathe(o(42),-31,[[4.6,66],[5.5,66.6],[5.5,67.6]],14),t.mat(2,1),t.lathe(o(42),-31,[[5.6,67.6],[3.4,73],[1.2,80],[.05,87]],14,{ribs:7}),v(o(42),87.3,-31,3,Q(b,1.1));for(let g=0;g<4;g++)t.win(5.4,.7,2.6,7.6,w(),.9),t.lathe(o(27),4,[[3.4,-2+g*11],[3.4,9+g*11]],12,{rot:g*.8});t.mat(3,.8),t.lathe(o(27),4,[[3.4,42],[4.1,42.5],[4.1,43.3]],12),t.mat(2,1),t.lathe(o(27),4,[[4.2,43.3],[2.3,47.5],[.6,52],[.05,56]],12,{ribs:6}),v(o(27),56.3,4,2.6,Q(b,1.1)),await i.yield();let p=0,z=null;for(let g=18.5;g<=81;g+=10.4){y(o(g),r+1.15,9.78,3.3);const T=[o(g),r+5.3,9.78];z&&(p=F(z,T,1,p)),z=T}p=30,z=null;for(let g=28;g<=66;g+=9.5){const T=[o(g),30.2,-1.7];t.mat(0,.8),t.box(T[0]-.14,28.1,T[2]-.14,T[0]+.14,30.2,T[2]+.14,{top:!1}),z&&(p=F(z,T,.8,p)),z=T}F([o(27.3),37.4,4.4],[o(66),39.2,2.6],5.2,60),F([o(19),51.2,-3],[o(2.6),81.6,-15],4,90),F([o(19),51.2,-27],[o(2.6),81.6,-15],4,90),F([o(27.3),37.5,4.4],[o(27.3),37.5,-30],.1,20,1.9);for(let g=0;g<4;g++){const T=20+g*10,B=6.9-g*1.9;t.mat(0,1.15),d(9,-2,T,11.6,B,T+10,{}),y(o(10.3),B,T+8.6,2.6),F([o(10.3),B+4.3+(g?1.9:.3),T-1.4],[o(10.3),B+4.3,T+8.6],.9,100+g*10,1.25)}t.mat(0,1.1),d(9,-2,60,12.4,1.6,63.4,{}),y(o(10.7),1.6,61.7,4.2,1.7),t.mat(0,.9),t.wallZ(10,20,-2,r,o(16),n),m(11.6,16,-2,r,20),t.mat(0,1.1),d(11.6,r,19.55,16,r+1.15,20,{}),d(15.55,r,10,16,r+1.15,20,{}),y(o(15.78),r+1.15,19.78,3.3)}F([-27.3,37.5,4.4],[27.3,37.5,4.4],.1,0,1.9),await i.yield(),t.mat(4,1.2),t.top(-16,4,16,20,r);const M=21,C=.37,A=1.9;for(let n=0;n<M;n++){const o=20+n*A,m=r-(n+1)*C;t.mat(4,1.2),t.quad([-9,m,o],[9,m,o],[9,m+C,o],[-9,m+C,o]),t.top(-9,o,9,o+A,m),t.mat(7,1.2),t.quad([-3.2,m,o+.03],[3.2,m,o+.03],[3.2,m+C+.03,o+.03],[-3.2,m+C+.03,o+.03]),t.quad([-3.2,m+.03,o+A+.03],[3.2,m+.03,o+A+.03],[3.2,m+.03,o+.03],[-3.2,m+.03,o+.03])}t.mat(7,1.3),t.quad([-3.2,r+.04,20.03],[3.2,r+.04,20.03],[3.2,r+.04,4.2],[-3.2,r+.04,4.2]),await i.yield();const k=t.toGeometry();return await i.yield(),{geometry:k,lights:u,triangles:t.triangles}}function rt(a,e,i){return new f.ShaderMaterial({uniforms:{uTime:a.uTime,uFogCol:a.uFogCol,uFogDen:a.uFogDen,uMirror:{value:i?1:0},uWin:{value:e.win},uStone:{value:e.stone},uRoof:{value:e.roof},uGilt:{value:e.gilt},uAmb:{value:e.amb},uWarm:{value:e.warm},uRose:{value:e.rose},uFestive:e.festive},vertexShader:`
attribute vec4 aA, aB;
varying vec2 vUv; varying vec4 vA, vB; varying vec3 vNo, vPo, vWp;
void main(){
  vUv = uv; vA = aA; vB = aB; vNo = normal; vPo = position;
  vec4 wp = modelMatrix*vec4(position, 1.); vWp = wp.xyz;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,fragmentShader:X+`
uniform vec3 uWin, uStone, uRoof, uGilt, uAmb, uWarm, uRose; uniform float uTime, uMirror, uFestive;
varying vec2 vUv; varying vec4 vA, vB; varying vec3 vNo, vPo, vWp;
// the soft shadow of one dancer on the glass: p from the figure's axis and its feet, H its height, w how broad it stands, gown 0..1
float figure(vec2 p, float H, float w, float gown){
  float hy = p.y/max(H, .01);
  float skirt = mix(mix(.2, .36, gown), .07, smoothstep(0., .56, hy));
  float sho = .12*smoothstep(.56, .7, hy)*(1.-smoothstep(.8, .86, hy));
  float hfw = max(skirt, sho)*w*H;
  float d = abs(p.x) - hfw; d = max(d, p.y - .86*H);
  d = min(d, length(vec2(p.x, p.y - .925*H)) - .07*H);
  d = max(d, -p.y);
  return 1.-smoothstep(-.1*H*.2, .1*H*.2 + .06, d);
}
float dancers(vec2 q, float hw, float ci, float seed, float H){
  float sh = 0.;
  for (int k = 0; k < 2; k++) {
    float fk = float(k), h = h21(vec2(ci*1.7 + fk*13.1, seed + 2.3));
    float x0 = sin(uTime*(.2+.28*h) + h*6.2832 + fk*2.4)*hw*1.7;
    float th = uTime*(1.3+.9*h) + h*40.; float cs = cos(th), sn = sin(th);
    vec2 pa = vec2(q.x - x0 - cs*H*.12, q.y + H*.1), pb = vec2(q.x - x0 + cs*H*.12, q.y + H*.1);
    float a = figure(pa, H, .72+.28*abs(sn), 1.);
    float b = figure(pb, H*1.07, .7+.2*abs(cs), 0.);
    float arm = 1.-smoothstep(.0, .09*H, abs(q.y + H*.1 - H*.7 - abs(cs)*H*.05) + max(abs(q.x - x0) - abs(cs)*H*.12, 0.));
    sh = max(sh, max(max(a, b), arm)*step(h, .35+.6*uFestive));
  }
  return sh;
}
void main(){
  if (uMirror > .5 && vWp.y > -.03) discard;
  vec3 vv = cameraPosition - vWp; float dist = length(vv);
  float m = vA.x, lit = vB.z, aa = (fwidth(vUv.x) + fwidth(vUv.y))*.75 + 1e-4;
  vec2 uvv = vUv;
  if (uMirror > .5) uvv.x += sin(vWp.y*.55 + uTime*1.1 + vWp.x*.11)*.16*clamp(-vWp.y*.12, 0., 1.);
  float facing = .5 + .5*clamp(vNo.z, 0., 1.), low = exp(-max(vPo.y - 6., 0.)*.04);
  float blocks = step(.5, fract(uvv.y/1.25*.5));
  vec2 bq = vec2(uvv.x/2.5 + blocks*.5, uvv.y/1.25);
  float jd = min((.5-abs(fract(bq.x)-.5))*2.5, (.5-abs(fract(bq.y)-.5))*1.25);
  float joint = 1.-smoothstep(.02, .05+aa, jd);
  joint *= clamp(1.-aa*6., 0., 1.);
  vec3 stone = uStone*(.82+.18*vn2(uvv*.9))*(1.-.22*joint);
  vec3 col = stone*(uAmb + uWarm*lit*facing*(.13+.36*low));
  if (m > .5 && m < 1.5) {
    float cw = max(vA.y, .1), hw = vA.z, wb = vA.w, wt = vB.x, seed = vB.y;
    float cx = uvv.x/cw, ci = floor(cx), lx = (fract(cx)-.5)*cw, y = uvv.y, yc = wt - hw;
    float d = y > yc ? length(vec2(lx, y - yc)) - hw : abs(lx) - hw; d = max(d, wb - y);
    float inside = 1.-smoothstep(-aa, aa, d);
    float hsh = h21(vec2(ci, seed*7.3)), gy = clamp((y - wb)/max(wt - wb, .1), 0., 1.);
    float glowIn = mix(1.35, .75, gy)*(1.-.3*min(lx*lx/max(hw*hw, .01), 1.))*(.8+.45*hsh);
    float flick = .93+.07*sin(uTime*(2.+3.*hsh) + hsh*50.);
    float H = min((wt - wb)*.62, 6.5);
    float sh = dancers(vec2(lx, y - wb), hw, ci, seed, H);
    float bars = min(abs(lx), min(abs(abs(lx) - hw*.55), abs(fract((y - wb)/2.4) - .5)*2.4));
    float bar = 1.-smoothstep(.05, .09+aa, bars); bar *= clamp(1.-aa*3., 0., 1.);
    vec3 wc = uWin*glowIn*flick*(1.-.85*sh)*(1.-.75*bar)*1.18;
    col += uWin*.16*exp(-max(d, 0.)*.8)*lit;
    float frame = (1.-smoothstep(.22, .22+aa*2., d))*(1.-inside);
    col = mix(col, uGilt*(.3+.35*lit), frame*.85);
    col = mix(col, wc, inside);
  } else if (m > 1.5 && m < 2.5) {
    float rib = 1.-smoothstep(.012, .03+aa, abs(fract(vUv.x + .5) - .5));
    float sc = fract(vUv.y*.55 + floor(vUv.x*6.)*.5);
    col = uRoof*(.55+.45*clamp(vNo.y, 0., 1.))*(.8+.2*sc) + uWarm*.07*(1.-clamp(vNo.y, 0., 1.))*uRoof*4.;
    col = mix(col, uGilt*.8, rib*.8);
  } else if (m > 2.5 && m < 3.5) {
    col = uGilt*(.2 + .34*lit*facing) + uGilt*.12*vn2(vUv*3. + uTime*.2);
  } else if (m > 3.5 && m < 4.5) {
    float wet = 1.-smoothstep(.0, 1.6, vPo.y);
    col = stone*(uAmb + uWarm*lit*(.42+.3*low))*(1.-.45*wet) + uWin*wet*.06;
    float tile = 1.-smoothstep(.02, .05+aa, min(abs(fract(vUv.x/3.)-.5)*3., abs(fract(vUv.y/3.)-.5)*3.));
    col *= 1.-.2*tile*clamp(1.-aa*5., 0., 1.);
  } else if (m > 4.5 && m < 5.5) {
    col = uWin*(.95+.5*lit)*(.9+.1*sin(uTime*3.1 + vPo.x*.7 + vPo.y*.4));
  } else if (m > 6.5) {
    float edge = min(vUv.x, 6.4 - vUv.x);
    col = uRose*(uAmb*2. + uWarm*lit*(.3+.26*low))*(.8+.2*vn2(vUv*5.));
    col = mix(col, uGilt*(.35+.3*lit), (1.-smoothstep(.28, .34, edge))*step(.1, edge));
  } else if (m > 5.5) {
    vec2 q = vUv*vec2(.5, .5); vec2 ci2 = floor(q), f = fract(q) - .5;
    float ch = exp(-dot(f, f)*14.)*(.6+.4*sin(uTime*2.+h21(ci2)*20.));
    col = uWin*(1.2 + 1.5*ch)*(.75+.25*clamp(vUv.y/14., 0., 1.));
  }
  if (uMirror > .5) col *= .85*exp(clamp(vWp.y, -400., 0.)*.02);
  gl_FragColor = vec4(fogged(col, dist, .5), 1.);
}`})}async function bt(a,e={}){const i=(e.rng||a.rng).fork("palace"),t=e.kit||ct(a,{}),u=e.festive??i.range(.4,1),r=[["#ff8fa3","#ffd9a0","#ff8fa3","#fff1d0"],["#ff8fa3","#ffd9a0"],["#ffd9a0","#ffb070","#ff8fa3"],["#ff8fa3","#ffe2b0","#b9c8ff"]],w=(e.lanterns||i.pick(r)).map(n=>Q(et(n),1.5)),b=new f.Group,v=await vt(i,w,a);await a.yield();const F=i.range(0,1),y={win:new f.Color("#ffd9a0").lerp(new f.Color("#ffc078"),F*.5),stone:new f.Color("#9a8168"),roof:new f.Color("#1c2440"),gilt:new f.Color("#ffc86a"),amb:new f.Color("#141a34"),rose:new f.Color("#b8506e"),warm:new f.Color("#ffc58a").multiplyScalar(1.15),festive:{value:u}},s=rt(t.U,y,!1),c=rt(t.U,y,!0),l=new f.Mesh(v.geometry,s);b.add(l);const h=new f.Mesh(v.geometry,c);h.scale.y=-1,h.renderOrder=-.5,b.add(h);const M=[];for(const n of v.lights)n.kind===1&&i()>.55+.45*u&&n.p[1]>30||(M.push(n),M.push({...n,p:[n.p[0],-n.p[1],n.p[2]],mirror:1}));await a.yield();const C=t.makeSparks(M,{beat:1.3+.5*u,pulse:.45+.5*u,gain:1.25,renderOrder:6});b.add(C.mesh);let A=null;if(e.water!==!1){A=new f.Mesh(new f.CircleGeometry(1400,48).rotateX(-Math.PI/2),new f.MeshBasicMaterial({color:"#03050c",transparent:!0,opacity:.5,depthWrite:!1})),A.position.y=.02,A.renderOrder=2,b.add(A);const n=new f.Mesh(new f.CircleGeometry(1400,48).rotateX(-Math.PI/2),new f.MeshBasicMaterial({color:"#02030a"}));n.position.y=-100,n.renderOrder=-1,b.add(n)}const k=!e.kit;return{object:b,radius:86,height:92,center:new f.Vector3(0,30,0),ground:!1,anchors:{portal:new f.Vector3(0,D.sill+D.portalH/2,3.2),sill:new f.Vector3(0,D.sill,D.doorZ),stairFoot:new f.Vector3(0,0,D.stairFootZ),gaze:new f.Vector3(0,30,0)},info:{triangles:v.triangles*2,lights:M.length,festive:u},palette:y,sparks:C,real:l,mirror:h,update(n,o,m){k&&t.update(o,m,a.renderer)},dispose(){}}}export{$ as BURST,X as GLSL_COMMON,ut as GLSL_SPECTRA,ot as Leaves,D as PALACE,bt as buildHero,gt as jewelBoughGeometry,wt as jewelTreeGeometry,xt as jewelTreePaced,et as lin,ct as makeJewelKit};
