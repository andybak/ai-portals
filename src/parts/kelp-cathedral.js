import*as r from"three";import{clamp as o0,lerp as G,smoothstep as F,bell as v0}from"../kit/core.js";const w0=["#e8f6c8","#5fb89a","#1f7f86","#0d4a5c","#062a38","#a88f2e","#ff8a3c"];function f0(o,s){const n=o.length;if(s<=o[0][0])return o[0][1];if(s>=o[n-1][0])return o[n-1][1];let a=0;for(;a<n-2&&s>o[a+1][0];)a++;const b=o[a][0],p=o[a+1][0],C=o[a][1],h=o[a+1][1],c=p-b,f=(s-b)/c,R=a>0?(h-o[a-1][1])/(p-o[a-1][0]):(h-C)/c,_=a<n-2?(o[a+2][1]-C)/(o[a+2][0]-b):(h-C)/c,D=f*f,U=D*f;return(2*U-3*D+1)*C+(U-2*D+f)*c*R+(-2*U+3*D)*h+(U-D)*c*_}function x0(o=2e4,s=1e5){const n=a=>{const b=new a.constructor(a.length*2);return b.set(a),b};return{pos:new Float32Array(o*3),col:new Float32Array(o*3),anim:new Float32Array(o*3),mat:new Float32Array(o*3),idx:new Uint32Array(s),n:0,ni:0,v(a,b,p,C,h,c,f,R,_,D,U,Y){const y=this.n*3;return y+3>this.pos.length&&(this.pos=n(this.pos),this.col=n(this.col),this.anim=n(this.anim),this.mat=n(this.mat)),this.pos[y]=a,this.pos[y+1]=b,this.pos[y+2]=p,this.col[y]=C,this.col[y+1]=h,this.col[y+2]=c,this.anim[y]=f,this.anim[y+1]=R,this.anim[y+2]=_,this.mat[y]=D,this.mat[y+1]=U,this.mat[y+2]=Y,this.n++},tri(a,b,p){this.ni+3>this.idx.length&&(this.idx=n(this.idx)),this.idx[this.ni]=a,this.idx[this.ni+1]=b,this.idx[this.ni+2]=p,this.ni+=3}}}async function b0(o,s){const n=new r.BufferGeometry,a=o.n*3,b=o.pos,p=o.idx,C=o.ni;n.setAttribute("position",new r.BufferAttribute(b.slice(0,a),3)),n.setAttribute("color",new r.BufferAttribute(o.col.slice(0,a),3)),n.setAttribute("aAnim",new r.BufferAttribute(o.anim.slice(0,a),3)),n.setAttribute("aMat",new r.BufferAttribute(o.mat.slice(0,a),3)),n.setIndex(new r.BufferAttribute(o.n>65535?p.slice(0,C):new Uint16Array(p.subarray(0,C)),1)),await s();const h=new Float32Array(a);for(let c=0;c<C;c+=3){const f=p[c]*3,R=p[c+1]*3,_=p[c+2]*3,D=b[_]-b[R],U=b[_+1]-b[R+1],Y=b[_+2]-b[R+2],y=b[f]-b[R],q=b[f+1]-b[R+1],N=b[f+2]-b[R+2],V=U*N-Y*q,I=Y*y-D*N,H=D*q-U*y;h[f]+=V,h[f+1]+=I,h[f+2]+=H,h[R]+=V,h[R+1]+=I,h[R+2]+=H,h[_]+=V,h[_+1]+=I,h[_+2]+=H,c%6e3===0&&await s()}for(let c=0;c<a;c+=3){const f=Math.hypot(h[c],h[c+1],h[c+2])||1;h[c]/=f,h[c+1]/=f,h[c+2]/=f,c%12e3===0&&await s()}return n.setAttribute("normal",new r.BufferAttribute(h,3)),n}const y0=[[0,0],[.004,.018],[.015,.036],[.04,.057],[.09,.077],[.17,.097],[.28,.112],[.36,.113],[.48,.1],[.6,.079],[.72,.054],[.82,.034],[.9,.021],[.96,.015],[1,.011]],M0=[[0,.002],[.004,.008],[.02,.016],[.06,.024],[.12,.036],[.17,.057],[.2,.067],[.24,.066],[.34,.084],[.46,.093],[.58,.086],[.66,.077],[.76,.056],[.86,.038],[.94,.025],[1,.012]],S0=[[0,.002],[.004,.014],[.02,.036],[.06,.064],[.12,.09],[.2,.11],[.3,.117],[.42,.108],[.52,.092],[.62,.074],[.72,.056],[.82,.041],[.9,.031],[.96,.023],[1,.012]],z0=[[0,.52],[.12,.76],[.32,1],[.58,.9],[.8,.66],[.93,.4],[1,.05]];async function k0(o,s){const{L:n,rng:a,noise:b}=o,p=x0(o.calf?9e3:2e4,o.calf?4e4:1e5),C=a.range(0,100),h=o.girth,c=o.dark,f=o.pale,R=e=>G(.3,-.12,F(0,.2,e)),_=e=>1-F(.17,.27,e);function D(e,t,i,u=1){const l=Math.cos(t),m=Math.sin(t),v=.004*Math.max(0,Math.sin((e-.7)*95))*v0(e,.7,.93,.2),g=.012*Math.exp(-(((e-.64)/.045)**2)),M=n*f0(y0,e)*h,P=n*(f0(M0,e)*h+v+g),x=n*f0(S0,e)*h,d=_(e),S=F(-.07,.07,m-R(e));let z=M*Math.sign(l)*Math.pow(Math.abs(l),.86),k=(m>0?P:x)*Math.sign(m)*Math.pow(Math.abs(m),.9);z*=1-.2*d*S;const B=1+.02*b.n3(e*7+C,l*1.6,m*1.6)*F(.02,.1,e),W=1+.05*v0(e,.05,.42,.4)*F(-.3,-.95,m);return i.set(z*B*u,k*B*W*u,n*(.5-e)),i}function U(e,t,i,u){const l=b.fbm3(u.x*.55+C,u.y*.55,u.z*.4,3),m=b.n3(u.x*2.3,u.y*2.3+C,u.z*2.3),v=-i,g=G(.95,.05,o.white);let M=F(g-.1,g+.1,v+.45*l+.08*m)*(1-F(.5,.74,e+.08*l));M=Math.max(M,.75*F(.55,.9,v)*(1-F(.3,.6,e))*o.white);const P=F(.35,-.7,i);let x=c.r*(1+.9*P+.35*m),d=c.g*(1+.9*P+.35*m),S=c.b*(1+.85*P+.3*m);x=G(x,f.r,M),d=G(d,f.g,M),S=G(S,f.b,M);const z=_(e),k=i-R(e),B=z*Math.exp(-((k/.045)**2)),W=z*Math.exp(-(((k+.12)/.06)**2))*.35;x=G(x,f.r*.8,W),d=G(d,f.g*.8,W),S=G(S,f.b*.8,W);const X=1-.8*B;x*=X,d*=X,S*=X;const r0=1-.85*(Math.exp(-(((e-.192)/.012)**2))*Math.exp(-(((Math.abs(t)-.1)/.06)**2))*(i>.8?1:0));return x*=r0,d*=r0,S*=r0,[x,d,S]}const Y=o.calf?84:128,y=o.calf?48:68,q=new r.Vector3,N=p.n;for(let e=0;e<=Y;e++){const t=e/Y,i=Math.pow(t,1.18);for(let u=0;u<y;u++){const l=Math.PI*.5+u/y*Math.PI*2;D(i,l,q);const m=Math.cos(l),v=Math.sin(l),g=U(i,m,v,q),M=_(i)>.02?F(.02,-.1,v-R(i)):0,P=Math.max(F(-.12,-.5,v),M*_(i))*F(.012,.06,i)*(1-F(.44,.55,i));p.v(q.x,q.y,q.z,g[0],g[1],g[2],0,0,0,m,v,P)}await s()}for(let e=0;e<Y;e++){for(let t=0;t<y;t++){const i=N+e*y+t,u=N+e*y+(t+1)%y,l=i+y,m=u+y;p.tri(i,l,u),p.tri(u,l,m)}e%8===7&&await s()}const V=new r.Vector3,I=new r.Vector3;function H(e,t,i,u){return D(e,t,i),D(Math.min(1,e+.004),t,V),D(e,t+.02,I),u.crossVectors(V.sub(i),I.sub(i)).normalize(),i}const K=new r.Vector3,L=new r.Vector3;function Q(e){K.set(0,1,0),Math.abs(e.y)>.9&&K.set(1,0,0),K.crossVectors(e,K).normalize(),L.crossVectors(e,K)}function Z(e,t,i,u,l,m,v,g=3,M=7){Q(t);const P=p.n;for(let d=0;d<g;d++){const S=d/g*Math.PI*.5,z=i*Math.cos(S),k=d===0?-.25*u:u*Math.sin(S),B=d===0?.8:1;for(let W=0;W<M;W++){const X=W/M*Math.PI*2,$=Math.cos(X)*z,r0=Math.sin(X)*z;p.v(e.x+K.x*$+L.x*r0+t.x*k,e.y+K.y*$+L.y*r0+t.y*k,e.z+K.z*$+L.z*r0+t.z*k,l[0]*B,l[1]*B,l[2]*B,m[0],m[1],v,0,1,0)}}const x=p.v(e.x+t.x*u,e.y+t.y*u,e.z+t.z*u,l[0]*1.1,l[1]*1.1,l[2]*1.1,m[0],m[1],v,0,1,0);for(let d=0;d<g-1;d++)for(let S=0;S<M;S++){const z=P+d*M+S,k=P+d*M+(S+1)%M,B=z+M,W=k+M;p.tri(z,k,B),p.tri(k,W,B)}for(let d=0;d<M;d++)p.tri(P+(g-1)*M+d,P+(g-1)*M+(d+1)%M,x)}function e0(e,t,i,u,l){Q(t);const m=p.n,v=6,g=a.range(.45,1),M=a.range(0,6.28);for(let x=0;x<2;x++){const d=x===0?i:i*.5,S=x===0?-.3*u:u,z=(x===0?.62:1)*g;for(let k=0;k<v;k++){const B=M+k/v*Math.PI*2,W=x===0?1+.25*(k&1):1,X=Math.cos(B)*d*W,$=Math.sin(B)*d*W;p.v(e.x+K.x*X+L.x*$+t.x*S,e.y+K.y*X+L.y*$+t.y*S,e.z+K.z*X+L.z*$+t.z*S,.56*z,.54*z,.43*z,l[0],l[1],1,0,1,0)}}const P=p.v(e.x+t.x*u*.45,e.y+t.y*u*.45,e.z+t.z*u*.45,.17,.16,.13,l[0],l[1],1,0,1,0);for(let x=0;x<v;x++){const d=m+x,S=m+(x+1)%v,z=d+v,k=S+v;p.tri(d,S,z),p.tri(S,k,z),p.tri(z,k,P)}}const J=n*.0042*(o.calf?1.6:1);function s0(e,t,i,u){const l=new r.Vector3,m=new r.Vector3;for(let v=0;v<i;v++){const g=u*Math.sqrt(a()),M=a.range(0,6.28),P=o0(e+Math.cos(M)*g/n,.006,.99),x=Math.max(.2,n*f0(y0,P));H(P,t+Math.sin(M)*g/x,l,m);const d=J*a.range(.7,1.5);e0(l,m,d,d*a.range(.7,1.1),[0,0])}}async function u0(e){const t=e.span.clone().normalize(),i=e.chord.clone().addScaledVector(t,-e.chord.dot(t)).normalize(),u=new r.Vector3().crossVectors(t,i).normalize();let l=!1;u.y<0&&(u.negate(),l=!0);const m=e.nV,v=e.nU,g=p.n,M=new r.Vector3,P=(x,d,S)=>{const z=(1-Math.cos(d))*.5,k=e.chordFn(x),B=e.thick(x)*(e.tipRound?Math.sqrt(Math.max(0,1-Math.pow(x,6))):1),W=Math.min(1,2.6*Math.sqrt(z)*(1-z))*Math.sign(Math.sin(d)||0),X=-e.sweepFn(x)-z*k,$=W*B*.5+(e.curl?e.curl(x):0);return S.copy(e.root).addScaledVector(t,e.len*x).addScaledVector(i,X).addScaledVector(u,$)};for(let x=0;x<=m;x++){const d=1-Math.pow(1-x/m,1.25);for(let S=0;S<v;S++){const z=S/v*Math.PI*2;P(d,z,M);const k=e.colFn(d,(1-Math.cos(z))*.5,Math.sin(z)>=0,M);p.v(M.x,M.y,M.z,k[0],k[1],k[2],e.side,d,-(e.thin?e.thin(d,(1-Math.cos(z))*.5):0),0,1,0)}await s()}await s();for(let x=0;x<m;x++)for(let d=0;d<v;d++){const S=g+x*v+d,z=g+x*v+(d+1)%v,k=S+v,B=z+v;l?(p.tri(S,k,z),p.tri(z,k,B)):(p.tri(S,z,k),p.tri(z,B,k))}return{at:P,chord:i,up:u,span:t}}const i0=n*o.pecRatio,l0=i0*.235,h0=e=>l0*.1*Math.pow(Math.max(0,Math.sin(e*Math.PI*8.5+.6)),2)*F(.08,.2,e)*(1-F(.9,1,e)),T=[],t0=new r.Vector3,d0=new r.Vector3;let w=null;for(const e of[1,-1]){await s(),D(.29,e>0?-.52:Math.PI+.52,t0,.88),e>0&&(w=t0.clone());const t=a.range(0,50);T.push({side:e,fin:await u0({root:t0.clone(),span:new r.Vector3(e*.84,-.3,-.44),chord:new r.Vector3(e*.1,.12,1),len:i0,nV:o.calf?20:34,nU:14,side:e,tipRound:!0,thin:(i,u)=>o0(.25+.5*i+.45*u,0,1),chordFn:i=>l0*f0(z0,i)+h0(i),sweepFn:i=>i0*.2*Math.pow(i,1.9)-h0(i),thick:i=>l0*.3*(1-.68*i),curl:i=>-i0*.035*i*i,colFn:(i,u,l,m)=>{const v=b.fbm3(m.x*.9+t,m.y*.9,m.z*.9,3);let g=F(.34,.06,i+.3*v);l&&(g=Math.max(g,o.pecDark*F(.1,-.25,v+(u-.4)*.8)));const M=1-.12*F(.85,1,i);return[G(f.r*M,c.r*1.4,g),G(f.g*M,c.g*1.4,g),G(f.b*M,c.b*1.4,g)]}})})}const j=[],O=a.range(0,50),n0=o.flukeWhite;for(const e of[1,-1])await s(),j.push({side:e,fin:await u0({root:new r.Vector3(0,n*.002,-n*.412),span:new r.Vector3(e,0,-.1),chord:new r.Vector3(0,0,1),len:n*.186,nV:o.calf?18:30,nU:12,side:0,thin:(t,i)=>o0(.15+.35*t+.5*i,0,1),chordFn:t=>(n*.106*Math.pow(1-t,.78)+n*.004)*(1-.22*Math.exp(-((t/.07)**2)))+n*.0035*Math.sin(t*58+e*1.3)*F(.08,.3,t)*(1-t),sweepFn:t=>n*.088*Math.pow(t,1.4),thick:t=>n*.02*(1-.8*t)+n*.002,curl:t=>-n*.006*t*t,colFn:(t,i,u,l)=>{if(u){const g=b.n3(l.x+O,l.y,l.z);return[c.r*(1.1+.3*g),c.g*(1.1+.3*g),c.b*(1.1+.3*g)]}const m=b.fbm3(Math.abs(l.x)*.7+O,3.1,l.z*.7,3),v=F(.1,-.15,m-(n0-.5)*1.2+F(.6,.95,i)*.9+F(.2,0,t)*.6);return[G(c.r*1.3,f.r,v),G(c.g*1.3,f.g,v),G(c.b*1.3,f.b,v)]}})});await s(),D(.645,Math.PI*.5,t0,.93),await u0({root:t0.clone(),span:new r.Vector3(0,1,-.9),chord:new r.Vector3(0,.35,1),len:n*.034,nV:7,nU:8,side:0,chordFn:e=>n*.06*Math.pow(1-e,.7)+n*.004,sweepFn:e=>n*.012*e*e,thick:e=>n*.014*(1-.6*e),colFn:()=>[c.r*1.05,c.g*1.05,c.b*1.05]});const A=new r.Vector3,E=new r.Vector3,c0=[];for(const e of[1,-1]){const t=e>0?-.02:Math.PI+.02;H(.212,t,A,E),Z(A,E,n*.013,n*.0032,[c.r*.9,c.g*.9,c.b*.9],[0,0],0,2,9),Z(A,E,n*.0062,n*.0048,[.012,.012,.014],[0,0],2,3,8),c0.push(A.clone())}const a0=[];for(let e=0;e<6;e++)a0.push([.022+e*.024+a.range(-.004,.004),Math.PI*.5+a.range(-.05,.05),1.2]);for(const e of[1,-1]){for(let t=0;t<6;t++)a0.push([.03+t*.025+a.range(-.005,.005),Math.PI*.5+e*(.62+.05*t)+a.range(-.05,.05),1]);for(let t=0;t<8;t++)a0.push([.016+t*.021+a.range(-.004,.004),(e>0?0:Math.PI)-e*(-.12+.26*F(0,7,t))-e*a.range(0,.08),1.1]);for(let t=0;t<4;t++)a0.push([.012+t*.016,(e>0?0:Math.PI)-e*(.75+a.range(-.1,.1)),.9])}a0.push([.008,-Math.PI*.5,1.8]);let p0=0;for(const[e,t,i]of a0){p0++%3===2&&await s(),H(e,t,A,E);const u=U(e,Math.cos(t),Math.sin(t),A),l=n*.0072*i*a.range(.85,1.2),m=G(u[0],c.r*1.9,.7),v=G(u[1],c.g*1.9,.7),g=G(u[2],c.b*1.9,.7);Z(A,E,l,l*.62,[m,v,g],[0,0],0,3,7),a.chance(.55*o.barnacles)&&s0(e,t,a.int(1,3),l*1.3)}if(o.barnacles>0){const e=o.barnacles;await s();for(let t=0;t<Math.round(5*e);t++)s0(a.range(.008,.05),-Math.PI*.5+a.range(-.7,.7),a.int(6,12),n*.016),await s();await s();for(let t=0;t<Math.round(11*e);t++)s0(a.range(.07,.46),-Math.PI*.5+a.range(-.9,.9),a.int(4,10),n*.02),await s();for(let t=0;t<Math.round(4*e);t++)s0(a.range(.52,.7),-Math.PI*.5+a.range(-.25,.25),a.int(3,7),n*.014);for(const{side:t,fin:i}of T){await s();for(let l=0;l<8;l++){l===4&&await s();const m=o0((Math.PI*(l+.5)-.6)/(Math.PI*8.5)+.06,.1,.97),v=Math.round(a.int(2,5)*e);for(let g=0;g<v;g++){const M=a.range(-.5,.5);i.at(o0(m+a.range(-.012,.012),0,1),M,A),E.copy(i.chord).addScaledVector(i.up,Math.sin(M)*1.5).normalize();const P=J*a.range(.7,1.4);e0(A,E,P,P,[t,m])}}const u=Math.round(7*e);for(let l=0;l<u;l++){const m=a.range(.9,.995),v=a.range(0,6.28);i.at(m,v,A),E.copy(i.up).multiplyScalar(Math.sin(v)>=0?1:-1);const g=J*a.range(.6,1.2);e0(A,E,g,g,[t,m])}}for(const{fin:t}of j){await s();const i=Math.round(12*e);for(let u=0;u<i;u++){const l=a.chance(.5),m=l?a.range(.82,.99):a.range(.2,.9),v=l?a.range(0,6.28):Math.PI+a.range(-.35,.35);t.at(m,v,A),E.copy(t.up).multiplyScalar(Math.sin(v)>=0?1:-1),l||E.addScaledVector(t.chord,-1).normalize();const g=J*a.range(.6,1.2);e0(A,E,g,g,[0,0])}}}D(.192,Math.PI*.5,A),await s();const g0=await b0(p,s);return await s(),{geometry:g0,pivot:w,eyes:c0,blowhole:A.clone(),triangles:p.ni/3}}const C0=`
float hash31(vec3 p){ p = fract(p*vec3(0.1031,0.1030,0.0973)); p += dot(p, p.yzx+33.33); return fract((p.x+p.y)*p.z); }
float vnoise(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x), mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x), f.y),
             mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x), mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x), f.y), f.z); }
float fbm3(vec3 p){ return 0.5*vnoise(p) + 0.3*vnoise(p*2.1+3.7) + 0.2*vnoise(p*4.3+9.1); }
float caustic(vec2 p, float t){
  const float TAU = 6.2831853; vec2 pp = mod(p*TAU, TAU) - 250.0; vec2 i = pp; float c = 1.0; const float inten = 0.005;
  for (int n = 0; n < 4; n++) { float tt = t*(1.0 - (3.5/float(n+1)));
    i = pp + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    vec2 sc = vec2(sin(i.x+tt), cos(i.y+tt)); sc = mix(vec2(-1.0), vec2(1.0), step(0.0, sc))*max(abs(sc), 1e-3);   // never divide by zero
    c += 1.0/max(length(pp*inten/sc), 1e-6); }
  c /= 4.0; c = 1.17 - pow(max(c, 0.0), 1.4); return pow(abs(c), 8.0); }
`,R0=`
attribute vec3 aAnim; attribute vec3 aMat;
uniform float uLen, uPhase, uAmp; uniform vec3 uPivot, uFinR, uFinL;
varying vec3 vCol, vN, vWP, vRest, vMat, vAxis; varying float vKind;
#include <fog_pars_vertex>
float bend(float z, float lag){
  float s = 0.5 - z/uLen; float w = smoothstep(0.2, 1.1, s); w = w*w*(0.55 + 0.45*w);
  return uAmp*(w*sin(uPhase - s*3.0 - lag) + 0.09*(1.0 - smoothstep(0.0, 0.5, s))*sin(uPhase + 2.0));
}
void main(){
  vec3 p = position, n = normal;
  float side = aAnim.x, isFin = step(0.5, abs(side));
  if (isFin > 0.5) {
    vec3 piv = vec3(side*uPivot.x, uPivot.y, uPivot.z);
    vec3 f = side > 0.0 ? uFinR : uFinL; float v = aAnim.y;
    float flap = side*(f.x + f.y*sin(uPhase*0.5 + 0.8 + side*0.35 - v*1.5))*(0.35 + 0.9*v);
    float sweep = side*f.z*(0.4 + 0.6*v);
    vec3 r = p - piv; float c = cos(flap), s = sin(flap);
    r.xy = vec2(r.x*c - r.y*s, r.x*s + r.y*c); n.xy = vec2(n.x*c - n.y*s, n.x*s + n.y*c);
    c = cos(sweep); s = sin(sweep);
    r.xz = vec2(r.x*c + r.z*s, -r.x*s + r.z*c); n.xz = vec2(n.x*c + n.z*s, -n.x*s + n.z*c);
    p = piv + r;
  }
  float zr = mix(position.z, uPivot.z, isFin);
  float lag = (1.0 - isFin)*abs(position.x)/uLen*2.2*(1.0 - smoothstep(-0.46, -0.36, position.z/uLen));
  float e = 0.02*uLen;
  float b0 = bend(zr, lag), slope = (bend(zr + e, lag) - bend(zr - e, lag))/(2.0*e);
  float a = atan(slope), ca = cos(a), sa = sin(a), zrel = p.z - zr, yr = p.y;
  p.y = b0 + yr*ca + zrel*sa; p.z = zr - yr*sa + zrel*ca;
  n.yz = vec2(n.y*ca + n.z*sa, -n.y*sa + n.z*ca);
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vWP = wp.xyz; vN = normalize(mat3(modelMatrix)*n); vAxis = normalize(mat3(modelMatrix)*vec3(0.0, sa, ca));
  vCol = color; vRest = position; vMat = aMat; vKind = aAnim.z;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,A0=`
uniform float uTime, uPleatN, uSeed, uCaustic;
uniform vec3 uSunDir, uSunCol, uSkyCol, uDeepCol, uRimCol;
varying vec3 vCol, vN, vWP, vRest, vMat, vAxis; varying float vKind;
#include <fog_pars_fragment>
${C0}
void main(){
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vWP);
  float skin = 1.0 - step(0.5, vKind), eye = step(1.5, vKind), thin = clamp(-vKind, 0.0, 1.0);
  float n1 = fbm3(vRest*1.3 + uSeed), n2 = vnoise(vRest*8.0 + uSeed);
  vec3 alb = vCol*(0.8 + 0.4*n1)*(0.88 + 0.24*n2);
  // healed scars and rake marks: thin pale scratches in patches
  float sc = sin((vRest.x*1.3 + vRest.y*4.0 + vRest.z*0.5 + vnoise(vRest*0.6 + uSeed)*9.0)*3.0);
  float scar = smoothstep(0.985, 1.0, sc)*smoothstep(0.58, 0.75, vnoise(vRest*0.4 + 7.0 + uSeed))*smoothstep(0.4, 0.6, vnoise(vRest*2.2 + uSeed))*skin;
  alb = mix(alb, vec3(0.3, 0.33, 0.32), scar*0.4);
  // ventral pleats
  float pl = vMat.z*skin; float g = atan(vMat.y, vMat.x)*uPleatN;
  vec3 T = normalize(cross(normalize(vAxis + vec3(0.0, 0.0, 1e-5)), N) + vec3(1e-4, 0.0, 0.0));   // never a zero vector (rostrum tip, fluke notch)
  N = normalize(N + T*pl*0.6*sin(g));
  alb *= mix(1.0, 0.5 + 0.5*smoothstep(-1.0, -0.2, cos(g)), pl);
  // light: hemisphere of water colour, sun with caustics from above, back-light rim
  float up = N.y*0.5 + 0.5;
  vec3 amb = mix(uDeepCol, uSkyCol, up*up*(3.0 - 2.0*up))*(1.0 + 0.9*(1.0 - skin)*(1.0 - eye));
  float ndl = dot(N, uSunDir), sun = smoothstep(-0.2, 0.9, ndl);
  vec2 cq = (vWP.xz - uSunDir.xz/max(uSunDir.y, 0.2)*vWP.y)*0.05;
  float ca = caustic(cq, uTime*0.55) + 0.5*caustic(cq*1.7 + 3.1, uTime*0.4 + 4.0);
  vec3 lit = uSunCol*sun*(0.42 + uCaustic*ca*smoothstep(-0.05, 0.5, ndl));
  float fres = pow(max(1.0 - max(dot(N, V), 0.0), 0.0), 2.6);
  vec3 rim = uRimCol*fres*(0.3 + 0.7*smoothstep(-0.5, 0.6, N.y));
  vec3 H = normalize(V + uSunDir);
  float spec = pow(max(dot(N, H), 0.0), mix(36.0, 160.0, eye))*mix(0.22*skin, 3.0, eye)*sun;
  // thin fins and fluke edges let the sun through: seen from below they glow pale against the surface
  vec3 trans = uSunCol*vCol*thin*smoothstep(-0.15, 0.8, -ndl)*(0.5 + 0.45*ca);
  vec3 col = alb*(amb + lit) + trans + rim*(0.3 + 0.7*alb) + uSunCol*spec + eye*uSkyCol*fres*0.6;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function F0(o,s){return new r.ShaderMaterial({uniforms:r.UniformsUtils.merge([r.UniformsLib.fog,s]),vertexShader:R0,fragmentShader:A0,vertexColors:!0,fog:!0})}function m0(o,s){for(const n in s)o.uniforms[n]=s[n];return o}const V0=`
attribute vec3 aBase; attribute vec4 aRay;      // aRay: width, phase, brightness, drift
uniform float uTime, uRayUp, uRayDown; uniform vec3 uSunDir;
varying vec2 vUv; varying vec3 vRay; varying float vNear;
#include <fog_pars_vertex>
void main(){
  float along = position.y, sideK = position.x;
  vec3 base = aBase + vec3(sin(uTime*0.11 + aRay.y), 0.0, cos(uTime*0.09 + aRay.y*1.7))*aRay.w;
  vec3 wb = (modelMatrix*vec4(base, 1.0)).xyz;
  // keep the shaft's anchor on the horizontal plane through the whale so it stays put when she rolls
  vec3 org = (modelMatrix*vec4(0.0, 0.0, 0.0, 1.0)).xyz; wb.y = org.y;
  vec3 P = wb + uSunDir*mix(-uRayDown, uRayUp, along)/max(uSunDir.y, 0.3);
  vec3 toCam = cameraPosition - P;
  vec3 sideV = normalize(cross(uSunDir, toCam) + vec3(1e-4, 0.0, 0.0));
  float w = aRay.x*(0.55 + 0.75*(1.0 - along));                      // shafts spread as they descend
  P += sideV*sideK*w;
  vUv = vec2(sideK, along); vRay = aRay.yzw; vNear = smoothstep(3.0, 16.0, length(toCam));
  vec4 mvPosition = viewMatrix*vec4(P, 1.0);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,D0=`
uniform float uTime, uRayGain; uniform vec3 uSunCol, uSkyCol;
varying vec2 vUv; varying vec3 vRay; varying float vNear;
#include <fog_pars_fragment>
void main(){
  float x = vUv.x, a = 1.0 - x*x; a *= a;
  float streak = 0.78 + 0.22*sin(x*6.0 + vRay.x*5.0 + uTime*0.3)*sin(x*13.0 - vRay.x*3.0);
  float len = smoothstep(0.0, 0.3, vUv.y)*(1.0 - smoothstep(0.82, 1.0, vUv.y));
  float core = 0.4 + 0.6*smoothstep(0.25, 0.75, vUv.y);              // brighter toward the surface
  float fl = 0.5 + 0.5*sin(uTime*0.7 + vRay.x*6.283)*sin(uTime*0.43 + vRay.x*11.0);
  float I = a*streak*len*core*(0.3 + 0.7*fl)*vRay.y*vNear*uRayGain;
  vec3 col = mix(uSkyCol, uSunCol, 0.65)*I;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col *= exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      col *= 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(col, 1.0);
}`;function P0(o,s,n){const a=[],b=[],p=[],C=[];for(let c=0;c<n;c++){const f=c/n*Math.PI*2+o.range(-.15,.15),R=o.chance(.3)?o.range(1.5,2.3):o.range(.95,1.3),_=Math.cos(f)*s*.36*R+s*.03,D=Math.sin(f)*s*.6*R-s*.02,U=o.range(1.3,3.4)*(R>1.4?1.5:1),Y=o.range(0,6.28),y=o.range(.45,1)*(R>1.4?.7:1),q=o.range(.3,1.2),N=p.length/3;for(const[V,I]of[[-1,0],[1,0],[-1,1],[1,1]])p.push(V,I,0),a.push(_,0,D),b.push(U,Y,y,q);C.push(N,N+1,N+2,N+1,N+3,N+2)}const h=new r.BufferGeometry;return h.setAttribute("position",new r.Float32BufferAttribute(p,3)),h.setAttribute("aBase",new r.Float32BufferAttribute(a,3)),h.setAttribute("aRay",new r.Float32BufferAttribute(b,4)),h.setIndex(C),h}const U0=`
attribute vec4 aSeed;                           // emitter (0 mother, 1 calf), phase, size, wobble
uniform float uTime, uTrail, uRise; uniform vec3 uEmit[2];
varying vec2 vUv; varying float vA;
#include <fog_pars_vertex>
void main(){
  float life = mix(9.0, 6.0, aSeed.x), age = fract(uTime/life + aSeed.y), t0 = uTime - age*life;
  float burst = smoothstep(0.15, 0.7, sin(t0*0.55 + aSeed.x*2.3) + 0.35*sin(t0*1.7 + aSeed.x));
  vec3 e = aSeed.x < 0.5 ? uEmit[0] : uEmit[1];
  float k = mix(1.0, 0.45, aSeed.x), wob = aSeed.w*6.283;
  vec3 p = e + vec3(sin(age*17.0 + wob)*0.5*age + cos(wob)*0.3*age, age*uRise*(0.7 + 0.6*fract(aSeed.y*7.3)), -age*uTrail + sin(wob*3.0)*0.6*age)*k;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
  mvPosition.xy += position.xy*aSeed.z*(0.6 + 0.9*age);
  vUv = position.xy; vA = burst*smoothstep(0.0, 0.04, age)*(1.0 - smoothstep(0.6, 1.0, age))*smoothstep(2.0, 8.0, -mvPosition.z);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,_0=`
uniform vec3 uSunCol, uSkyCol;
varying vec2 vUv; varying float vA;
#include <fog_pars_fragment>
void main(){
  float d = length(vUv); if (d > 1.0) discard;
  float ring = smoothstep(0.5, 0.95, d)*(1.0 - smoothstep(0.9, 1.0, d));
  float hi = 1.0 - smoothstep(0.0, 0.35, length(vUv - vec2(-0.3, 0.38)));
  vec3 col = (uSkyCol*(0.25 + 1.1*ring) + uSunCol*hi*1.6)*vA;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col *= exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      col *= 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(col, 1.0);
}`;function B0(o,s){const n=new r.InstancedBufferGeometry;n.setAttribute("position",new r.Float32BufferAttribute([-1,-1,0,1,-1,0,-1,1,0,1,1,0],3)),n.setIndex([0,1,2,1,3,2]);const a=new Float32Array(s*4);for(let b=0;b<s;b++){const p=b%3===0?1:0;a.set([p,o(),(p?o.range(.025,.06):o.range(.04,.11))*(o.chance(.08)?1.8:1),o()],b*4)}return n.setAttribute("aSeed",new r.InstancedBufferAttribute(a,4)),n.instanceCount=s,n}async function L0(o,s={}){const n=o.rng.fork("kelp-cathedral-hero"),a=o.noise,p=(s.palette&&s.palette.length>=5?s.palette:w0).map(w=>new r.Color(w)),C=w=>p[Math.min(w,p.length-1)],h=s.length??n.range(14.2,15.8),c=s.calfLength??n.range(4.6,5.5),f=s.calfSide??n.sign(),R=n.range(.3,.8),_=C(0).clone().lerp(new r.Color(1,1,1),.35).multiplyScalar(.7),D=new r.Color(.07,.082,.098).lerp(C(4),.22),U=new r.Group;U.name="kelp-cathedral-hero";const Y=(s.sunDir?s.sunDir.clone():new r.Vector3(.12,1,.38)).normalize(),y={uTime:{value:0},uSunDir:{value:Y},uSunCol:{value:C(0).clone().multiplyScalar(1.55)},uSkyCol:{value:C(1).clone().lerp(C(0),.3).multiplyScalar(.62)},uDeepCol:{value:C(2).clone().lerp(C(0),.25).multiplyScalar(.52)},uRimCol:{value:C(0).clone().lerp(C(1),.45).multiplyScalar(1.1)},uCaustic:{value:1.25}},q=typeof o.yield=="function"?()=>o.yield():async()=>{};async function N(w,j){const O=await k0(w,q);O.geometry.boundingSphere=new r.Sphere(new r.Vector3,w.L*.8);const n0=m0(F0(y,{uLen:{value:w.L},uPhase:{value:0},uAmp:{value:w.L*w.amp},uPivot:{value:O.pivot.clone()},uFinR:{value:new r.Vector3(.05,.16,0)},uFinL:{value:new r.Vector3(.05,.16,0)},uPleatN:{value:w.pleats},uSeed:{value:n.range(0,40)},uTime:{value:0},uSunDir:{value:null},uSunCol:{value:null},uSkyCol:{value:null},uDeepCol:{value:null},uRimCol:{value:null},uCaustic:{value:1}}),y),A=new r.Mesh(O.geometry,n0);A.name=j;const E=new r.Group;return E.add(A),{...O,mesh:A,mat:n0,pivot:E,L:w.L}}const V=await N({L:h,girth:n.range(.97,1.05),pecRatio:n.range(.31,.34),white:R,pleats:n.int(22,30),barnacles:n.range(.75,1.4),pecDark:n.range(0,.45),flukeWhite:n.range(.25,.9),calf:!1,amp:.07,rng:n.fork("mother"),noise:a,dark:D,pale:_},"humpback-mother");U.add(V.pivot),await o.yield();const I=await N({L:c,girth:1.12,pecRatio:.285,white:o0(R+n.range(-.15,.2),.3,1),pleats:n.int(18,22),barnacles:0,pecDark:n.range(0,.3),flukeWhite:n.range(.3,.8),calf:!0,amp:.085,rng:n.fork("calf"),noise:a,dark:D.clone().multiplyScalar(1.55),pale:_.clone().multiplyScalar(.95)},"humpback-calf"),H=new r.Vector3(f*h*.2,-h*.2,h*.07);I.pivot.position.copy(H),U.add(I.pivot),await o.yield();const K=s.surfaceY??12;let L=null;if(s.rays!==!1){const w=m0(new r.ShaderMaterial({uniforms:r.UniformsUtils.merge([r.UniformsLib.fog,{uRayUp:{value:K},uRayDown:{value:26},uRayGain:{value:.14},uTime:{value:0},uSunDir:{value:null},uSunCol:{value:null},uSkyCol:{value:null}}]),vertexShader:V0,fragmentShader:D0,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending,side:r.DoubleSide,fog:!0}),{uTime:y.uTime,uSunDir:y.uSunDir,uSunCol:y.uSunCol,uSkyCol:y.uSkyCol});L=new r.Mesh(P0(n.fork("rays"),h,18),w),L.frustumCulled=!1,L.renderOrder=3,L.name="sun-shafts",U.add(L)}let Q=null;const Z=V.blowhole.clone(),e0=new r.Vector3;if(s.bubbles!==!1){const w=m0(new r.ShaderMaterial({uniforms:r.UniformsUtils.merge([r.UniformsLib.fog,{uTrail:{value:17},uRise:{value:5.5},uEmit:{value:[Z,e0]},uTime:{value:0},uSunCol:{value:null},uSkyCol:{value:null}}]),vertexShader:U0,fragmentShader:_0,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending,fog:!0}),{uTime:y.uTime,uSunCol:y.uSunCol,uSkyCol:y.uSkyCol});w.uniforms.uEmit.value=[Z,e0],Q=new r.Mesh(B0(n.fork("bubbles"),150),w),Q.frustumCulled=!1,Q.renderOrder=4,Q.name="bubbles",U.add(Q)}let J=o0(s.progress??0,0,1);const s0=n.range(0,6.28),u0=n.range(0,6.28),i0=new r.Euler;function l0(w,j){y.uTime.value=j;const O=j*1.12+s0,n0=j*2.25+u0;V.mat.uniforms.uPhase.value=O,I.mat.uniforms.uPhase.value=n0;const A=v0(J,.18,.86,.42),E=F(.45,.8,J),c0=v0(J,.36,.92,.35);V.pivot.position.y=h*.012*Math.sin(O+2.6),V.pivot.rotation.set(.028*Math.sin(O+1.1),0,-f*.3*A+.02*Math.sin(j*.31));const a0=f>0?V.mat.uniforms.uFinL.value:V.mat.uniforms.uFinR.value,p0=f>0?V.mat.uniforms.uFinR.value:V.mat.uniforms.uFinL.value;a0.set(.05+.42*A,.16,.22*A),p0.set(.05-.1*A,.14,-.08*A),I.pivot.position.set(H.x+f*.9*c0+.25*Math.sin(j*.37+1),H.y-1.6*c0+c*.02*Math.sin(n0+2.6)+.2*Math.sin(j*.23),H.z+.5*Math.sin(j*.19)+1.2*c0),I.pivot.rotation.set(.05*Math.sin(n0+1.1)-.05,-f*.07,f*(.16+Math.PI*2*E)+.05*Math.sin(j*.5)),Z.copy(V.blowhole),Z.y+=V.pivot.position.y,i0.copy(I.pivot.rotation),e0.copy(I.blowhole).applyEuler(i0).add(I.pivot.position)}l0(0,0);function h0(w={}){w.sunDir&&y.uSunDir.value.copy(w.sunDir).normalize(),w.sunColor&&y.uSunCol.value.copy(w.sunColor),w.skyColor&&y.uSkyCol.value.copy(w.skyColor),w.deepColor&&y.uDeepCol.value.copy(w.deepColor),w.rimColor&&y.uRimCol.value.copy(w.rimColor),w.caustic!==void 0&&(y.uCaustic.value=w.caustic),w.surfaceY!==void 0&&L&&(L.material.uniforms.uRayUp.value=w.surfaceY),w.rayGain!==void 0&&L&&(L.material.uniforms.uRayGain.value=w.rayGain)}const T=(w,j,O)=>new r.Vector3(w,j,O),t0=T(f*h*.07,-h*.07,h*.03),d0={bodyCenter:T(0,0,0),head:T(0,-h*.02,h*.5),blowhole:V.blowhole.clone(),eyeR:V.eyes[0].clone(),eyeL:V.eyes[1].clone(),flukes:T(0,0,-h*.5),calfCenter:H.clone(),center:t0,flyUnder:[T(f*7,-16,30),T(f*4,-15,15),T(f*1.5,-14.5,2),T(0,-14.5,-12),T(-f*2,-16,-28)],viewpoints:{below:T(f*1.5,-14.5,2),belowAhead:T(f*4,-13,16),flank:T(f*22,-3,7),calfSide:T(f*13,-7,4)},clearance:{radius:h*.66,minCameraDistance:12},travel:{heading:T(0,0,1),speed:2.6},portalSeat:null};return{object:U,radius:h*.66,height:h*.6,center:t0,anchors:d0,update:l0,dispose(){},ground:!1,groundY:-40,setProgress(w){J=o0(w,0,1)},setLight:h0,uniforms:y,calfSide:f,length:h,calfLength:c,triangles:V.triangles+I.triangles+36+300}}export{L0 as buildHero};
