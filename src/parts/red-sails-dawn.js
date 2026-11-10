import*as c from"three";import{clamp as H,lerp as W,smoothstep as n0}from"../kit/core.js";const i0=["#7F93A8","#2F3A52","#9C4A32","#C9714A","#F2552C","#F4C9A0","#2F4A3A"];function J(e){const t=[[0,3],[.15,2],[.4,1.5],[.52,1],[.56,.6],[.62,.15],[.7,-.5],[1,-.5]];e=H(e,0,1);for(let a=0;a<t.length-1;a++)if(e<=t[a+1][0]){const i=(e-t[a][0])/(t[a+1][0]-t[a][0]);return W(t[a][1],t[a+1][1],i)}return-.5}class s0{constructor(){this.p=[],this.c=[],this.a=[],this.s=[],this.o=[],this.idx=[],this.cur=[0,0,0,1],this.sail=[0,0,0,0]}get n(){return this.p.length/3}v(t,a,i,n,s){return this.p.push(t,a,i),this.c.push(n[0],n[1],n[2]),this.a.push(this.cur[0],this.cur[1],this.cur[2],this.cur[3]),this.s.push(this.sail[0],this.sail[1],this.sail[2],this.sail[3]),s?this.o.push(s[0],s[1],s[2]):this.o.push(0,0,0),this.p.length/3-1}tri(t,a,i){this.idx.push(t,a,i)}quad(t,a,i,n){this.idx.push(t,a,i,t,i,n)}setAnim(t,a,i,n,s){const f=t*4;this.a[f]=a,this.a[f+1]=i,this.a[f+2]=n,this.a[f+3]=s}band(t,a){const i=t.length;for(let n=0;n<i;n++){const s=(n+1)%i;this.quad(t[n],a[n],a[s],t[s])}}cap(t,a,i){const n=t.length;for(let s=0;s<n;s++){const f=(s+1)%n;i?this.tri(a,t[f],t[s]):this.tri(a,t[s],t[f])}}tube(t,a,i,n,s={}){const f=[],l=t.length,d=new c.Vector3,v=new c.Vector3,p=new c.Vector3,m=new c.Vector3;let h=null;for(let r=0;r<l;r++){const u=t[r],x=t[Math.max(0,r-1)],k=t[Math.min(l-1,r+1)];v.set(k[0]-x[0],k[1]-x[1],k[2]-x[2]).normalize(),h?d.copy(h):(d.set(0,1,0),Math.abs(v.y)>.9&&d.set(1,0,0)),p.copy(d).addScaledVector(v,-d.dot(v)).normalize(),h=p.clone(),m.crossVectors(v,p);const M=a[r],b=[],w=s.flat||1;for(let C=0;C<i;C++){const L=C/i*Math.PI*2,z=Math.cos(L)*M,B=Math.sin(L)*M*w,I=p.x*z+m.x*B,T=p.y*z+m.y*B,E=p.z*z+m.z*B;b.push(this.v(u[0]+I,u[1]+T,u[2]+E,n(r/(l-1),Math.cos(L),u),s.widen?[I,T,E]:null))}f.push(b)}for(let r=0;r<l-1;r++)this.band(f[r+1],f[r]);return f}build(){const t=new c.BufferGeometry;return t.setAttribute("position",new c.Float32BufferAttribute(this.p,3)),t.setAttribute("color",new c.Float32BufferAttribute(this.c,3)),t.setAttribute("aAnim",new c.Float32BufferAttribute(this.a,4)),t.setAttribute("aSail",new c.Float32BufferAttribute(this.s,4)),t.setAttribute("aOff",new c.Float32BufferAttribute(this.o,3)),t.setIndex(this.idx),t.computeVertexNormals(),t}}const G=e=>{const t=new c.Color(e);return[t.r,t.g,t.b]},j=(e,t,a)=>[e[0]+(t[0]-e[0])*a,e[1]+(t[1]-e[1])*a,e[2]+(t[2]-e[2])*a],_=n0,e0={eda:{body:[[-1.75,.375,.345,.014,1,1],[-1.45,.45,.335,.06,1.1,.9],[-1.05,.58,.335,.125,1.15,.85],[-.65,.695,.335,.205,1.2,.8],[-.34,.765,.32,.275,1.25,.72],[-.02,.805,.29,.355,1.25,.66],[.34,.805,.285,.372,1.25,.66],[.68,.775,.305,.315,1.25,.7],[.92,.72,.36,.225,1.15,.8],[1.08,.635,.425,.108,1,.9],[1.2,.605,.445,.088,.85,.9],[1.31,.59,.455,.078,.8,.85],[1.4,.568,.468,.058,.8,.85],[1.45,.545,.485,.03,.9,.9]],neck:[.86,1.16],neckPivot:[.9,.56],tail:[-.3,-1.75],breath:[.25,.75],headLen:.24,eye:[1.285,.565,.074,.016],mouth:[1.22,1.45,.498],nostril:[1.415,.545,.04],sail:{x0:-.4,x1:1.02,n:22,h:1,peak:.5,shape:.5,fan:.34,bare:0,bars:6,scallop:.03},fore:{at:[.84,.5,.26],elbow:[.6,.33,.58],wrist:[.86,.1,.63],foot:[.95,0,.65],r:[.125,.105,.078,.062],yaw:.35},hind:{at:[-.34,.52,.24],elbow:[0,.35,.57],wrist:[-.32,.1,.63],foot:[-.22,0,.66],r:[.15,.125,.088,.068],yaw:.55},foot:.12,skin:"#5A4A4A",dark:"#33282A",belly:"#B89A84",saddles:6,dipMax:.72},dim:{body:[[-1.62,.33,.31,.01,1,1],[-1.3,.39,.31,.035,1.1,.9],[-.9,.5,.33,.075,1.15,.9],[-.5,.63,.36,.13,1.2,.85],[-.12,.74,.36,.205,1.3,.8],[.22,.775,.35,.235,1.3,.78],[.56,.775,.36,.23,1.3,.78],[.82,.755,.39,.195,1.2,.8],[.98,.735,.45,.135,1.05,.85],[1.08,.75,.47,.118,.8,.8],[1.2,.775,.475,.112,.7,.75],[1.33,.765,.49,.092,.7,.75],[1.44,.725,.505,.07,.7,.75],[1.53,.69,.52,.056,.7,.8],[1.585,.65,.535,.036,.8,.9]],neck:[.84,1.08],neckPivot:[.88,.62],tail:[-.12,-1.62],breath:[.2,.7],headLen:.53,eye:[1.215,.705,.104,.021],mouth:[1.1,1.585,.555],nostril:[1.55,.635,.035],sail:{x0:-.3,x1:.94,n:26,h:1.26,peak:.6,shape:.62,fan:.22,bare:.08,bars:0,scallop:.016},fore:{at:[.8,.56,.2],elbow:[.6,.42,.46],wrist:[.84,.13,.47],foot:[.93,0,.49],r:[.105,.09,.066,.054],yaw:.3},hind:{at:[-.16,.57,.19],elbow:[.14,.43,.45],wrist:[-.16,.13,.48],foot:[-.07,0,.5],r:[.125,.105,.074,.06],yaw:.5},foot:.11,skin:"#3A4034",dark:"#1E2420",belly:"#8A7A5E",saddles:9,dipMax:.12}};function Y(e,t){let a=0;for(;a<e.length-2&&e[a+1][0]<t;)a++;const i=e[a],n=e[a+1],s=_(0,1,H((t-i[0])/(n[0]-i[0]),0,1)),f=H((t-i[0])/(n[0]-i[0]),0,1),l=.5*(s+f);return[t,W(i[1],n[1],l),W(i[2],n[2],l),W(i[3],n[3],l),W(i[4],n[4],l),W(i[5],n[5],l)]}function r0(e,t,a,i){const n=t.body,s=i?16:10,f=[],l=n[0][0],d=n[n.length-1][0],v=i?34:20;for(let b=0;b<=v;b++){const w=b/v,C=w*w*(3-2*w)*.35+w*.65;f.push(W(l,d,C))}const p=G(t.skin),m=G(t.dark),h=G(t.belly),r=[],u=a()*6.28,x=t.saddles;e.sail=[0,0,0,0];for(const b of f){const[,w,C,L,z,B]=Y(n,b),I=C+(w-C)*.46,T=[],E=_(t.neck[0],t.neck[1],b),D=H((t.tail[0]-b)/(t.tail[0]-t.tail[1]),0,1),P=(b-l)/(d-l),g=_(t.breath[0]-.2,t.breath[0]+.1,P)*(1-_(t.breath[1]-.1,t.breath[1]+.12,P)),y=.5+.5*Math.sin(P*x*6.283+u+1.3*Math.sin(P*17+u));for(let o=0;o<s;o++){const S=(o+.5)/s*Math.PI*2,A=Math.cos(S),F=Math.sin(S),N=A>0?I+(w-I)*Math.pow(A,z):I-(I-C)*Math.pow(-A,B),R=L*Math.sign(F)*Math.pow(Math.abs(F),.8),O=_(-.75,-.05,A),q=_(.45,.95,A);let V=j(h,p,O);V=j(V,m,_(.35,.8,y)*_(-.2,.5,A)*(.55+.35*D)),V=j(V,m,q*.45),V=j(V,h,E*_(.1,-.5,A)*.5),e.cur=[E,D,g*(.35+.65*Math.abs(F))*(A>.8?.3:1),1],T.push(e.v(b,N,R,V))}r.push(T)}for(let b=0;b<r.length-1;b++)e.band(r[b],r[b+1]);const k=Y(n,l),M=Y(n,d);e.cur=[0,1,0,1],e.cap(r[0],e.v(l-.03,(k[1]+k[2])/2,0,m),!1),e.cur=[1,0,0,1],e.cap(r[r.length-1],e.v(d+.012,(M[1]+M[2])/2-.004,0,j(p,h,.4)),!0)}function l0(e,t,a,i){const n=G(t.skin),s=G(t.belly),f=j(n,s,.55),l=[.012,.01,.01],[d,v,p,m]=t.eye;for(const h of[1,-1]){e.cur=[1,0,0,1],e.sail=[0,0,0,0];const r=a?8:6,u=[],x=[];for(let y=0;y<r;y++){const o=y/r*6.283,S=Math.cos(o),A=Math.sin(o);u.push(e.v(d+S*m*1.75,v+A*m*1.5,h*(p-.004),f))}e.sail=[0,0,0,3];for(let y=0;y<r;y++){const o=y/r*6.283,S=Math.cos(o),A=Math.sin(o);x.push(e.v(d+S*m,v+A*m,h*(p+.006),[.05,.035,.025]))}for(let y=0;y<r;y++){const o=(y+1)%r;e.quad(u[y],u[o],x[o],x[y])}e.cap(x,e.v(d,v,h*(p+.006+m*.55),l),!1);const k=d+m*.3,M=v+m*.38,b=h*(p+.008+m*.5),w=m*.5,C=[2.2,2.3,2.6];e.tri(e.v(k-w,M-w*.5,b,C),e.v(k+w,M-w*.3,b,C),e.v(k,M+w,b,C)),e.sail=[0,0,0,0],e.tube([[d-m*2.2,v+m*1.2,h*(p-.006)],[d,v+m*1.9,h*(p+.004)],[d+m*2.4,v+m*1.3,h*(p-.008)]],[m*.5,m*.75,m*.45],5,()=>j(n,l,.35));const[L,z,B]=t.mouth,I=a?9:5,T=[],E=[];for(let y=0;y<=I;y++){const o=W(L,z,y/I),S=Y(t.body,o),A=S[2]+(S[1]-S[2])*.46,F=B+(i?.022*_(1.4,1.47,o)-.012*_(1.2,1.1,o):.006*Math.sin(y*.9)),N=H(Math.abs(F-A)/Math.max(A-S[2],.001),0,.98),R=S[3]*Math.pow(1-Math.pow(N,2/S[5]),.4)+.0035,O=(i?.009:.006)*(1-.6*y/I);if(T.push(e.v(o,F+O,h*R,l)),E.push(e.v(o,F-O,h*(R+.001),l)),i&&y>0&&y<I){const q=y/I,V=Math.exp(-Math.pow((o-1.455)/.03,2)),o0=.014+.034*V+.008*Math.sin(y*2.1),Q=.007+.004*V,U=[.62,.56,.44];e.tri(e.v(o-Q,F-O,h*(R+.003),U),e.v(o+Q,F-O,h*(R+.003),U),e.v(o-.004*q,F-O-o0,h*(R+.002),j(U,[1,1,1],.2)))}}for(let y=0;y<I;y++)e.quad(T[y],E[y],E[y+1],T[y+1]);const[D,P,g]=t.nostril;e.tri(e.v(D-.012,P-.004,h*(g+.004),l),e.v(D+.008,P,h*(g-.004),l),e.v(D-.004,P+.009,h*(g+.001),l))}}function t0(e,t,a,i,n,s){const f=G(t.skin),l=G(t.dark),d=G(t.belly),v=n?9:6,p=g=>[g[0],g[1],g[2]*i],m=p(a.at),h=p(a.elbow),r=p(a.wrist),u=p(a.foot),x=(g,y,o,S=0)=>[W(g[0],y[0],o),W(g[1],y[1],o)+S,W(g[2],y[2],o)],M=[[m[0],m[1]+.02,m[2]*.55],m,x(m,h,.5,.015),h,x(h,r,.3),x(h,r,.7),r,[u[0]-(u[0]-r[0])*.35,.05,W(r[2],u[2],.6)]],b=a.r,w=[b[0]*1.25,b[0]*1.2,b[0]*1.05,b[1]*1.08,(b[1]+b[2])*.56,b[2]*1.02,b[2]*.92,b[3]],C=[1,1,.85,.6,.42,.25,.12,.02],L=e.n;e.sail=[0,0,0,0],e.cur=[0,0,0,1],e.tube(M,w,v,(g,y)=>j(j(f,d,_(.2,-.7,y)*.6),l,g*.45+.1),{});for(let g=L;g<e.n;g++){const y=Math.floor((g-L)/v);e.setAnim(g,0,0,0,C[y])}const z=a.yaw*i+0,B=Math.cos(z),I=Math.sin(z),T=t.foot;e.cur=[0,0,0,0];const E=e.v(u[0],.06,u[2],j(f,l,.5)),D=[],P=n?10:7;for(let g=0;g<P;g++){const y=g/P*6.283,o=Math.cos(y),S=Math.sin(y),A=T*(.62+.38*Math.max(0,o));D.push(e.v(u[0]+(B*o-I*S)*A,.012,u[2]+(I*o+B*S)*A,j(l,f,.25)))}if(e.cap(D,E,!1),n)for(let g=0;g<5;g++){const y=(g-2)*.42+.06*i,o=Math.cos(y),S=Math.sin(y),A=B*o-I*S,F=I*o+B*S,N=T*(1.05-.14*Math.abs(g-2)+(g===3?.08:0)),R=[u[0]+A*T*.55,.035,u[2]+F*T*.55],O=[u[0]+A*(T*.55+N*.6),.03,u[2]+F*(T*.55+N*.6)],q=[u[0]+A*(T*.55+N),.008,u[2]+F*(T*.55+N)];e.tube([R,O,q],[.024,.019,.004],4,V=>j(j(f,l,.45),[.05,.04,.035],V*V),{})}}const $=6.3,a0=.6;function u0(e,t){const a=e.sail,i=a.n,n=[];for(let f=0;f<i;f++){const l=f/(i-1),d=W(a.x0,a.x1,l),v=Y(e.body,d)[1]-.025,p=l<a.peak?.5*l/a.peak:.5+.5*(l-a.peak)/(1-a.peak),m=Math.pow(Math.max(Math.sin(Math.PI*p),0),a.shape),h=a.h*(.13+.87*m)*(1+.035*(t()-.5)),r=a.fan*(l-.5)*2+.03*(t()-.5);n.push({x:d,y:v,h,lean:r,top:1-a.bare/h})}return{sp:n,at:(f,l)=>{const d=Math.min(i-2,Math.floor(f)),v=f-d,p=n[d],m=n[d+1],h=W(p.x,m.x,v),r=W(p.y,m.y,v),u=W(p.h,m.h,v),x=W(p.lean,m.lean,v);return[h+u*Math.sin(x)*Math.pow(l,1.35),r+u*Math.cos(x*.8)*l,0,u]},n:i}}function c0(e,t,a,i){const{sp:n,at:s,n:f}=u0(t,a),l=[.03,.017,.013],d=t.sail,v=u=>_(t.neck[0],t.neck[1],u)*.35,p=i?[0,.22,.48,.74,1]:[0,.5,1];for(let u=0;u<f;u++){const x=[];for(const M of p){const b=s(u,M),w=W(.017,.0065,M),C=W(.021,.0065,M),L=[];e.cur=[v(n[u].x)*(1-M),0,0,1],e.sail=[u,M,M*b[3],2];const z=j(l,[.09,.06,.05],M*.6);L.push(e.v(b[0]+w,b[1],0,z,[w,0,0]),e.v(b[0],b[1],C,z,[0,0,C]),e.v(b[0]-w,b[1],0,z,[-w,0,0]),e.v(b[0],b[1],-C,z,[0,0,-C])),x.push(L)}for(let M=0;M<x.length-1;M++)e.band(x[M],x[M+1]);const k=s(u,1);if(e.sail=[u,1,k[3],2],e.cap(x[x.length-1],e.v(k[0],k[1]+.012,0,l),!1),i&&d.bars)for(let M=1;M<=d.bars;M++){const b=Math.pow(M/$,1/a0);if(b>.95||b*n[u].h<.035)continue;const w=s(u,b),C=.05*(1-.45*b)*(.85+.3*a()),L=.0105,z=[],B=[],I=[];e.sail=[u,b,b*w[3],2],e.cur=[0,0,0,1];for(let T=0;T<3;T++){const E=T*2.0944+.5236,D=Math.cos(E)*L,P=Math.sin(E)*L*.8;z.push(e.v(w[0]+D*.6,w[1]+P*.6,-C,l,[D,P,0])),I.push(e.v(w[0]+D*1.3,w[1]+P*1.3,0,l,[D,P,0])),B.push(e.v(w[0]+D*.6,w[1]+P*.6,C,l,[D,P,0]))}e.band(z,I),e.band(I,B)}}const m=i?2:1,h=i?[0,.08,.2,.38,.58,.78,.92,1]:[0,.3,.7,1],r=[];for(let u=0;u<=(f-1)*m;u++){const x=u/m,k=Math.min(f-2,Math.floor(x)),M=x-k,b=W(n[k].top,n[k+1].top,M)-d.scallop*Math.sin(Math.PI*M)*(i?1:0),w=[];for(const C of h){const L=C*b,z=s(x,L);e.cur=[v(z[0])*(1-L),0,0,1],e.sail=[x,L,L*z[3],1],w.push(e.v(z[0],z[1],0,[C,z[3]/1.5,b]))}r.push(w)}for(let u=0;u<r.length-1;u++)for(let x=0;x<h.length-1;x++)e.quad(r[u][x],r[u+1][x],r[u+1][x+1],r[u][x+1]);return{sp:n,at:s}}function X(e,t,a=!0){const i=e0[e],n=new s0,s=e==="dim";r0(n,i,t,a),l0(n,i,a,s);for(const p of[1,-1])t0(n,i,i.fore,p,a||s,!1),t0(n,i,i.hind,p,a||s,!0);const f=c0(n,i,t,a),l=n.build(),d=l.attributes.normal,v=l.attributes.aSail;for(let p=0;p<d.count;p++)v.getW(p)===1&&d.setXYZ(p,0,0,1);return l.userData={kind:e,sailTop:Math.max(...f.sp.map(p=>p.y+p.h)),spec:i,sail:f},l}const h0=`
attribute vec4 aAnim; attribute vec4 aSail; attribute vec3 aOff;
attribute vec4 aInst;   // phase, sun-line offset (m), ground height under the feet (world), sail tilt (rad)
attribute vec4 aInst2;  // head-dip period (s), tint, pattern seed, species (0 plant-eater, 1 hunter)
uniform float uTime, uPix;
varying vec3 vWorld, vN, vCol, vObj; varying vec4 vSail, vInst; varying float vSp;
#include <fog_pars_vertex>
void main() {
  vec3 p = position; vec3 n = normal;
  float ph = aInst.x, sp = aInst2.w, skin = step(aSail.w, 0.5);
  // breathing: the flanks swell and sink
  p += n * aAnim.z * skin * 0.024 * sin(uTime * 1.5 + ph * 31.0);
  // head and neck: the plant-eater dips to crop and chews; the hunter makes one slow turn
  float c = fract(uTime / aInst2.x + ph * 3.7);
  float dip = smoothstep(0.0, 0.2, c) * (1.0 - smoothstep(0.66, 0.9, c));
  float ang = mix(0.74 * (0.22 + 0.78 * dip) + 0.03 * dip * sin(uTime * 6.5 + ph * 9.0), 0.1 + 0.05 * sin(uTime * 0.31 + ph * 5.0), sp) * aAnim.x;
  vec2 pv = mix(vec2(0.9, 0.56), vec2(0.88, 0.62), sp);
  vec2 d = p.xy - pv; float ca = cos(ang), sa = sin(ang);
  p.xy = pv + vec2(ca * d.x + sa * d.y, -sa * d.x + ca * d.y);
  float yawH = sp * aAnim.x * 0.22 * sin(uTime * 0.23 + ph * 17.0);
  p.z += (p.x - pv.x) * yawH;
  // tail: a slow travelling sway, growing toward the tip
  float tw = aAnim.y * aAnim.y;
  p.z += tw * (0.24 * sin(uTime * 1.05 + ph * 23.0 - aAnim.y * 1.9) + 0.42 * sin(ph * 57.0) * aAnim.y);
  p.y += aAnim.y * (1.0 - aAnim.y) * 0.1 * sin(ph * 77.0) - tw * 0.05;
  p.y += tw * 0.03 * sin(uTime * 0.37 + ph * 13.0);
  // weight shifting: sail and body roll about the planted feet (3 degrees), plus the display tilt
  float roll = (0.052 * sin(uTime * 0.8 + ph * 41.0) + 0.02 * sin(uTime * 0.33 + ph * 7.0) + aInst.w) * aAnim.w;
  float cr = cos(roll), sr = sin(roll);
  p.yz = vec2(cr * p.y - sr * p.z, sr * p.y + cr * p.z);
  n.yz = vec2(cr * n.y - sr * n.z, sr * n.y + cr * n.z);
  p.x += aAnim.w * 0.012 * sin(uTime * 0.29 + ph * 19.0);
  mat4 M = modelMatrix * instanceMatrix;
  vec4 w = M * vec4(p, 1.0);
  // thin parts (spines, pins, crossbars) keep about 1.5 px of width at any distance
  float ol = length(aOff);
  if (ol > 1e-5) {
    float dist = distance(w.xyz, cameraPosition);
    // ... but never wider than a third of the gap between two spines, or a far sail goes black
    float k = clamp(dist * uPix * 0.8 / ol, 1.0, clamp(0.008 / ol, 1.0, 9.0));
    w = M * vec4(p + aOff * (k - 1.0), 1.0);
  }
  vWorld = w.xyz; vN = mat3(M) * n; vCol = color; vObj = position; vSail = aSail;
  vInst = vec4(aInst.y, aInst.z, aInst2.y, aInst2.z); vSp = sp;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,f0=`
uniform float uTime, uSunLineY, uSunI, uHemiI, uMistTop, uMistAmt, uEmberGain, uStyle, uShadeLift;
uniform vec3 uSunDir, uSunColor, uSky, uGround, uMistColor, uEmber, uWebShade, uCream, uRose;
varying vec3 vWorld, vN, vCol, vObj; varying vec4 vSail, vInst; varying float vSp;
#include <fog_pars_fragment>
float h21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) N = -N;
  vec3 Vv = cameraPosition - vWorld; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  vec3 L = uSunDir;
  float kind = vSail.w, seed = vInst.w;
  // the event: one level plane; above it sun, below it shade (6 cm soft, per-animal offset up to 0.12 m)
  float lit = smoothstep(-0.03, 0.03, vWorld.y - (uSunLineY + vInst.x));
  vec3 hemi = mix(uGround, uSky, N.y * 0.5 + 0.5) * uHemiI;
  float back = max(dot(-V, L), 0.0);
  // derivatives are taken here, outside every branch
  float fwu = fwidth(vSail.x), fwv = fwidth(vSail.y);
  float g = ${$.toFixed(1)} * pow(max(vSail.y, 1e-4), ${a0.toFixed(1)}), fg = fwidth(g);
  vec3 col;
  if (kind > 0.5 && kind < 1.5) {
    // ---- the web: thin skin lit through from behind
    float u = vSail.x, v = vSail.y, hM = vSail.z, edge = vCol.r;
    float du = abs(fract(u + 0.5) - 0.5);
    // spines drawn in the web as opaque ribs, never thinner than ~1.5 px, melting into an average tone far away
    float w0 = mix(0.105, 0.05, v), rib = 1.0 - smoothstep(w0, w0 + fwu * 1.5 + 0.02, du);
    rib = mix(rib, w0 * 1.6, smoothstep(0.22, 0.6, fwu));
    // crossbars (plant-eater): short rungs across each spine, densest low down
    float dg = abs(fract(g + 0.5) - 0.5);
    float bar = (1.0 - smoothstep(0.26, 0.4, du)) * (1.0 - smoothstep(0.07, 0.07 + fg * 1.5 + 0.02, dg));
    bar *= (1.0 - vSp) * step(0.5, g) * (1.0 - step(${$.toFixed(1)} - 0.25, g)) * (1.0 - smoothstep(0.25, 0.6, fg));
    // veins: a branching net that follows the spines upward and thins toward the rim
    vec2 q = vec2(u * 0.9 + seed * 17.0, hM * 7.0);
    float n1 = vn(q * vec2(1.0, 0.55) + vn(q * 2.3) * 0.9), n2 = vn(q * vec2(2.6, 1.7) + 7.0 + n1 * 1.5);
    float lodv = 1.0 - smoothstep(0.03, 0.12, fwv + fwu * 0.2);
    float vein = (1.0 - smoothstep(0.0, 0.045, abs(n1 - 0.5))) * 0.85 + (1.0 - smoothstep(0.0, 0.05, abs(n2 - 0.5))) * 0.45;
    vein = clamp(vein, 0.0, 1.0) * lodv * (1.0 - 0.65 * smoothstep(0.3, 1.0, v));
    // thickness: fleshy at the base and beside each spine, a rolled rim at the free edge
    float rim = smoothstep(0.93, 1.0, edge);
    float thick = 0.2 + 1.15 * (1.0 - smoothstep(0.0, 0.62, v)) + 0.3 * (1.0 - smoothstep(0.1, 0.5, du)) + 0.5 * rim + 0.35 * (vn(q * 0.6 + 3.0) - 0.5);
    // sail styles: 1 = a row of dark eye-spots (always on the hunter), 2 = cream margin and banded spines
    float spots = 0.0;
    // polish 3: round ocelli in a row that follows the sail's outline (a dark pupil 10 cm across inside a thin pale halo): markings, not holes
    float hS = clamp(vCol.g * 1.5, 0.2, 2.0), spOn = max(vSp, step(0.5, uStyle) * step(uStyle, 1.5));
    float sU = (fract(u / 5.0 + 0.5) - 0.5) * 2.5, sV = (v - mix(0.5, 0.5, vSp)) * hS / 0.1, sd = length(vec2(sU, sV));
    spots = (1.0 - smoothstep(0.32, 0.5, sd)) * spOn;
    float ring = (1.0 - smoothstep(0.0, 0.2, abs(sd - 0.72))) * spOn;
    float cream = step(1.5, uStyle) * smoothstep(0.8, 0.97, edge);
    float band = step(1.5, uStyle) * smoothstep(0.3, 0.7, sin(v * 26.0)) * 0.5;
    thick += spots * 1.15 + vein * 0.9 - ring * 0.2;
    float T = exp(-max(thick, 0.0) * 1.35);
    float bl = back * back + 0.35;
    vec3 deep = uEmber * vec3(0.62, 0.22, 0.16);
    vec3 through = mix(uEmber, deep, clamp(thick * 0.75, 0.0, 1.0)) * T * uEmberGain * 1.6 * bl;
    through = mix(through, uCream * 1.6 * bl * T * 1.5, cream);
    // polish 4: the sun itself seen through the skin: a hot core and a wide glow where the view ray runs toward the sun
    float b4 = back * back * back * back, b16 = b4 * b4 * b4 * b4;
    through += mix(uEmber, uCream, 0.55) * T * (1.3 * b16 * b16 * b16 + 0.5 * b16) * uSunI;
    // light falling on the near face (seen from the sun's side the web is a red skin, not a lamp)
    vec3 alb = mix(uEmber * vec3(0.55, 0.42, 0.45), uWebShade, 0.35) * (1.0 - 0.6 * vein) * (1.0 - 0.7 * spots);
    alb = mix(alb, uCream * 0.7, max(cream, rim * 0.45));
    float nl = abs(dot(N, L));
    float facing = step(0.0, dot(N, L) * dot(N, V));         // is the lit face the one we see
    vec3 front = alb * uSunColor * uSunI * nl * facing * 0.8;
    vec3 shade = mix(uWebShade, uWebShade * vec3(0.5, 0.45, 0.5), clamp(vein + spots, 0.0, 1.0));
    // in shade the thin skin still passes the dawn band behind it: dull ochre-violet, lighter where it is thinnest, never black
    vec3 skyBack = mix(uSky, uRose * 1.25, 0.3 + 0.7 * back * back);
    shade = mix(shade, uCream * 0.55, max(cream, rim * 0.5)) * (hemi * 1.3 + uShadeLift + skyBack * (0.9 + 1.8 * T));
    // a little of the ember already bleeds below the line: scattered light inside the skin
    float bleed = smoothstep(-0.16, 0.0, vWorld.y - (uSunLineY + vInst.x)) * 0.1;
    col = mix(shade, through + front + alb * hemi * 0.6, max(lit, bleed));
    float opq = clamp(max(rib, bar) + band * rib, 0.0, 1.0);
    vec3 bone = vec3(0.027, 0.011, 0.009) + hemi * 0.05 + uSunColor * uSunI * lit * 0.02;
    col = mix(col, bone, opq);
    // where the web meets the back it becomes body skin
    col = mix(col, shade * 0.8, (1.0 - smoothstep(0.0, 0.05, v)) * (1.0 - lit) * 0.5);
  } else if (kind > 2.5) {
    col = vCol * mix(0.45, 1.0, lit) * (0.4 + 0.6 * uHemiI);
  } else {
    // ---- skin and bone
    vec3 alb = vCol;
    float bone = step(1.5, kind);
    // fine breakup: speckle and faint wrinkles that fade with distance; per-animal tint
    float fade = 1.0 - smoothstep(14.0, 40.0, dist);
    float sp1 = vn(vObj.xy * 46.0 + vObj.z * 31.0 + seed * 9.0), sp2 = vn(vObj.xz * 13.0 + vObj.y * 9.0 + seed * 5.0);
    float wr = vn(vec2(vObj.x * 60.0, vObj.y * 9.0 + vObj.z * 7.0));
    alb *= 1.0 + (1.0 - bone) * fade * ((sp1 - 0.5) * 0.5 + (wr - 0.5) * 0.22) + (sp2 - 0.5) * 0.3 * (1.0 - bone);
    alb *= mix(vec3(1.0), vec3(1.0 + vInst.z * 0.5, 1.0, 1.0 - vInst.z * 0.5), 1.0 - bone);
    float ndl = dot(N, L), wrap = clamp(ndl * 0.75 + 0.25, 0.0, 1.0);
    float fr = 1.0 - max(dot(N, V), 0.0); float fr2 = fr * fr; fr = fr2 * fr;
    // backlit rim: the sun behind catches the edge of back, skull and tail
    vec3 rimL = uSunColor * vec3(1.0, 0.7, 0.55) * uSunI * fr * (0.12 + 0.75 * back * back) * lit * mix(0.7, 0.25, bone);
    // moist skin: a soft sky sheen on upward faces
    float sheen = fr * (0.3 + 0.7 * max(N.y, 0.0)) * 0.22 * (1.0 - bone);
    // a thin rose rim from the dawn band along back, skull and tail, there from the first frame (it does not wait for the sun)
    vec3 rimSky = mix(uSky * 0.6, uRose * 1.5, 0.15 + 0.85 * back) * fr2 * fr2 * (0.25 + 0.75 * clamp(N.y * 0.6 + 0.5, 0.0, 1.0)) * mix(0.5, 0.15, bone);
    // form: the underside and the legs near the ground sit in the animal's own shade (no flat, pale flank)
    float ao = (0.42 + 0.58 * smoothstep(-0.85, 0.3, N.y)) * (0.62 + 0.38 * smoothstep(0.02, 0.42, vObj.y));
    col = alb * (hemi * 1.25 * ao + uSunColor * uSunI * (wrap + 0.28) * lit * (0.6 + 0.4 * ao)) + uSky * uShadeLift * (0.6 + 0.4 * N.y) * ao + rimL + rimSky + uSky * sheen * uHemiI * 0.5;
  }
  // legs are lost in mist: fade toward the mist colour below uMistTop above the animal's own ground
  float md = clamp(uMistTop - (vWorld.y - vInst.y), 0.0, uMistTop);
  float m = min(1.0 - exp(-md * 0.11 / max(abs(V.y), 0.05)), 0.8);
  col = mix(col, uMistColor * 0.7, m * uMistAmt * 0.18);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function d0(e){const t=a=>new c.Color(a);return{uTime:{value:0},uPix:{value:.002},uSunLineY:{value:1.25},uSunDir:{value:new c.Vector3(.16,.07,-1).normalize()},uSunColor:{value:t(e[4])},uSunI:{value:1.4},uSky:{value:t(e[0])},uGround:{value:t("#5A3A34")},uHemiI:{value:1.8},uShadeLift:{value:.05},uMistColor:{value:t(e[0]).multiplyScalar(.62)},uMistTop:{value:.4},uMistAmt:{value:.92},uEmber:{value:t(e[4])},uEmberGain:{value:1},uWebShade:{value:t("#6B4A52")},uCream:{value:t(e[5])},uStyle:{value:0},uShadow:{value:0},uShDir:{value:new c.Vector2(0,1)},uTanElev:{value:.07},uMud:{value:t(e[2])},uRose:{value:t(e[3])},uMistLit:{value:0}}}function m0(e){const t=new c.ShaderMaterial({uniforms:c.UniformsUtils.merge([c.UniformsLib.fog,{}]),vertexShader:h0,fragmentShader:f0,vertexColors:!0,fog:!0,side:c.DoubleSide});for(const a of v0)t.uniforms[a]=e[a];return t}function Z(e,t,a){for(const i of a)e.uniforms[i]=t[i];return e}const v0=["uRose","uTime","uPix","uSunLineY","uSunDir","uSunColor","uSunI","uSky","uGround","uHemiI","uShadeLift","uMistColor","uMistTop","uMistAmt","uEmber","uEmberGain","uWebShade","uCream","uStyle"];function p0(e,t,a){const i=Math.max(a.length,1),n=new c.InstancedMesh(e,t,i),s=new Float32Array(i*4),f=new Float32Array(i*4),l=new c.Matrix4,d=new c.Quaternion,v=new c.Euler,p=new c.Vector3,m=new c.Vector3,h=e.userData.kind==="dim";return a.forEach((r,u)=>{v.set(0,r.yaw||0,0),d.setFromEuler(v),p.setScalar(r.scale||1),m.set(r.x,r.y||0,r.z),l.compose(m,d,p),n.setMatrixAt(u,l),s.set([r.phase??0,r.lineOffset??0,r.mist===!1?-1e3:r.y||0,r.tilt||0],u*4),f.set([r.period??5.5,r.tint??0,r.seed??0,h?1:0],u*4)}),n.count=a.length,e.setAttribute("aInst",new c.InstancedBufferAttribute(s,4)),e.setAttribute("aInst2",new c.InstancedBufferAttribute(f,4)),n.instanceMatrix.needsUpdate=!0,n.frustumCulled=!1,n}function b0(e){const t=[],i=d=>e.range(-d,d),n=(d,v,p)=>t.push({kind:d,x:v+i(.5),z:p+i(.45),y:.3,yaw:(e.chance(.3)?Math.PI:0)+i(.22),scale:e.range(.9,1.07)}),s=-6.6+i(.4),f=i(.12);t.push({kind:"dim",x:s,z:2.4,y:.3,yaw:f,scale:1,tilt:-.1}),t.push({kind:"dim",x:s+.5,z:-.6,y:.3,yaw:Math.PI+f,scale:.96,tilt:-.1}),n("eda",-2.2,4.2),n("eda",1.6,3.2),n("eda",5,4.5),n("eda",-.2,.4),n("eda",8.4,1.2),n("eda",5.6,-2.4),n("eda",9.6,-2.6),n("eda",-3.2,-3),n("edaFar",2,-5),n("edaFar",-9.8,-3.6),n("edaFar",7.6,-5.8),n("edaFar",-5.6,-6);const l=e.int(0,2);for(let d=0;d<l;d++){const v=t[2+e.int(0,7)];t.push({kind:"edaFar",x:v.x+e.range(.9,1.5),z:v.z+e.range(.9,1.4),y:.3,yaw:v.yaw+i(.4),scale:e.range(.46,.56)})}return t}const K=`
float h21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }`;function y0(e,t,a){const i=new c.PlaneGeometry(1,1,1,10);i.translate(0,.5,0);const n=new c.InstancedBufferGeometry;n.index=i.index,n.setAttribute("position",i.attributes.position);const s=t.length,f=new Float32Array(s*4),l=new Float32Array(s*4),d=new Float32Array(s*4),v=new Float32Array(s);t.forEach((h,r)=>{const u=e0[h.kind==="dim"?"dim":"eda"].sail;f.set([h.x,(h.y||0)+(h.shadowLift??.33*(h.mist===!1?.1:1)),h.z,h.yaw||0],r*4),l.set([u.h,u.peak,u.shape,u.n],r*4),d.set([u.x0,u.x1,h.scale||1,h.phase||0],r*4),v[r]=h.shadowLen??15}),n.setAttribute("aD",new c.InstancedBufferAttribute(v,1)),n.setAttribute("aA",new c.InstancedBufferAttribute(f,4)),n.setAttribute("aB",new c.InstancedBufferAttribute(l,4)),n.setAttribute("aC",new c.InstancedBufferAttribute(d,4)),n.instanceCount=s;const p=new c.ShaderMaterial({uniforms:{uTime:e.uTime,uShadow:e.uShadow,uShDir:e.uShDir,uTanElev:e.uTanElev},vertexShader:`
      attribute vec4 aA, aB, aC; attribute float aD; uniform vec2 uShDir; uniform float uTanElev, uTime;
      varying vec4 vP; varying vec3 vS; varying float vD;
      void main() {
        float sc = aC.z, te = max(uTanElev, 0.2), len = min(min(15.0, aD), (aB.x + 0.62) * sc / te);   // drawn shorter than the true dawn shadow so the ribbed fan lies in view
        float xl = mix(aC.x - 0.9, aC.y + 0.6, position.x + 0.5) * sc, cy = cos(aA.w), sy = sin(aA.w);
        vec3 w = vec3(aA.x + cy * xl, aA.y, aA.z - sy * xl) + vec3(uShDir.x, 0.0, uShDir.y) * position.y * len;
        float rock = 1.0 + 0.035 * sin(uTime * 0.8 + aC.w * 41.0);
        vP = vec4((xl / sc - aC.x) / (aC.y - aC.x), position.y * len * te / sc * rock, position.y, aB.w);
        vS = aB.xyz; vD = position.y * len;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(w, 1.0);
      }`,fragmentShader:`
      uniform float uShadow; varying vec4 vP; varying vec3 vS; varying float vD;
      void main() {
        float s = vP.x, hp = vP.y, soft = 0.02 + vD * 0.012;
        // body: a low rounded block from tail to snout; sail: the fan profile above the back
        float bodyH = 0.47 * smoothstep(-0.6, -0.05, s) * (1.0 - smoothstep(1.08, 1.38, s));
        float sc = clamp(s, 0.0, 1.0), w = sc < vS.y ? 0.5 * sc / vS.y : 0.5 + 0.5 * (sc - vS.y) / max(1.0 - vS.y, 1e-3);
        float prof = vS.x * (0.13 + 0.87 * pow(max(sin(3.14159 * w), 0.0), vS.z));
        float eb = 0.015 + vD * 0.004, inS = smoothstep(-eb, eb, s) * (1.0 - smoothstep(1.0 - eb, 1.0 + eb, s));
        float sail = inS * (1.0 - smoothstep(prof - soft * 2.0, prof + soft * 2.0, hp - 0.44)) * smoothstep(0.40, 0.46, hp);
        float body = 1.0 - smoothstep(bodyH - soft, bodyH + soft, hp);
        float fw = fwidth(s * (vP.w - 1.0));
        float ru = s * (vP.w - 1.0) + 0.5, rid = floor(ru), rw = 0.1 + 0.1 * fract(sin(rid * 12.9898) * 43758.5453);
        float du = abs(fract(ru) - 0.5), blur = clamp(vD * 0.014 + fw, 0.0, 0.5);
        float rib = 1.0 - smoothstep(rw - blur * 0.4, rw + 0.03 + blur, du);
        rib = mix(rib, 0.3, smoothstep(0.12, 0.45, blur));
        vec3 webTint = vec3(0.92, 0.6, 0.5), dark = vec3(0.3, 0.28, 0.48);
        vec3 mult = mix(vec3(1.0), mix(webTint, dark, rib), sail);
        mult = mix(mult, mix(vec3(1.0), dark, 0.75), body);
        float fade = (1.0 - smoothstep(0.58, 1.0, clamp(vP.z, 0.0, 1.0))) * uShadow;      // dies away softly: never a hard-ended slab
        gl_FragColor = vec4(mix(vec3(1.0), mult, fade), 1.0);
      }`,transparent:!0,depthWrite:!1,blending:c.CustomBlending,blendEquation:c.AddEquation,blendSrc:c.ZeroFactor,blendDst:c.SrcColorFactor,blendSrcAlpha:c.ZeroFactor,blendDstAlpha:c.OneFactor,side:c.DoubleSide}),m=new c.Mesh(n,p);return m.frustumCulled=!1,m.renderOrder=4,m}function w0(e,t,a,i,n){const s=t/i,f=(a+1.2)/n,d=Math.pow(Math.pow(Math.abs(s),2.6)+Math.pow(Math.abs(f),2.6),1/2.6)+.09*e.fbm2(t*.11,a*.11,3);return-.28+.58*(1-_(.72,1.02,d))+.035*e.fbm2(t*.35+9,a*.35,2)*(1-_(.8,1,d))}async function x0(e,t,a,i,n){const s=Math.round(120*a),f=Math.round(64*a),l=i*2.5,d=n*2.6,v=new c.PlaneGeometry(l,d,s,f);v.rotateX(-Math.PI/2),v.translate(0,0,-1.2);const p=v.attributes.position;for(let h=0;h<p.count;h++)p.setY(h,w0(e.noise,p.getX(h),p.getZ(h),i,n)),h%1500===1499&&await e.yield();v.computeVertexNormals();const m=new c.ShaderMaterial({uniforms:c.UniformsUtils.merge([c.UniformsLib.fog,{}]),fog:!0,vertexShader:`
      varying vec3 vW, vN;
      #include <fog_pars_vertex>
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = mat3(modelMatrix) * normal;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uMud, uSky, uGround, uSunDir, uSunColor, uMistColor; uniform float uSunLineY, uSunI, uHemiI, uMistAmt, uMistTop;
      varying vec3 vW, vN;
      #include <fog_pars_fragment>
      ${K}
      void main() {
        vec2 p = vW.xz * 2.5 + vec2(vn(vW.xz * 0.9), vn(vW.xz * 0.9 + 5.0)) * 0.7;
        float fw = max(fwidth(p.x), fwidth(p.y));
        vec2 ip = floor(p), fp = fract(p); float f1 = 9.0, f2 = 9.0, id = 0.0;
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j)), c = o + vec2(h21(ip + o), h21(ip + o + 17.3)) * 0.8 + 0.1 - fp;
          float d = dot(c, c);
          if (d < f1) { f2 = f1; f1 = d; id = h21(ip + o + 3.1); } else if (d < f2) { f2 = d; }
        }
        float e = sqrt(max(f2, 0.0)) - sqrt(max(f1, 0.0));
        float lod = 1.0 - smoothstep(0.25, 0.9, fw);
        float crack = (1.0 - smoothstep(0.02, 0.07 + fw, e)) * lod;
        float curl = smoothstep(0.1, 0.45, e) * lod;            // plates dish upward at their edges
        float wet = 1.0 - smoothstep(0.02, 0.22, vW.y);         // dark wet margin at the waterline
        vec3 alb = uMud * (0.72 + 0.4 * id * lod + 0.16 * vn(vW.xz * 0.6)) * mix(1.0, 0.8, curl * 0.5);
        alb = mix(alb, uMud * vec3(0.3, 0.26, 0.3), max(crack, wet * 0.75));
        vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
        float lit = smoothstep(-0.03, 0.03, vW.y - uSunLineY);
        vec3 hemi = mix(uGround, uSky, N.y * 0.5 + 0.5) * uHemiI;
        vec3 col = alb * (hemi * 0.8 + uSunColor * uSunI * lit * (0.1 + max(dot(N, uSunDir), 0.0)));
        col += uSky * wet * 0.1 * uHemiI;
        vec3 Vd = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
        float md = clamp(0.3 + uMistTop - vW.y, 0.0, 1.0);
        col = mix(col, uMistColor * 0.8, min(1.0 - exp(-md * 0.11 / max(abs(Vd.y), 0.05)), 0.8) * uMistAmt);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`});return Z(m,t,["uMud","uSky","uGround","uSunDir","uSunColor","uMistColor","uSunLineY","uSunI","uHemiI","uMistAmt","uMistTop"]),new c.Mesh(v,m)}function M0(e,t){const a=new c.CircleGeometry(t,48);a.rotateX(-Math.PI/2);const i=new c.ShaderMaterial({uniforms:c.UniformsUtils.merge([c.UniformsLib.fog,{uRadius:{value:t}}]),fog:!0,transparent:!0,vertexShader:`
      varying vec3 vW; varying vec2 vL;
      #include <fog_pars_vertex>
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vL = position.xz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSky, uRose, uCream, uSunDir, uMistColor, uMud; uniform float uTime, uHemiI, uMistAmt, uMistTop, uMistLit, uRadius;
      varying vec3 vW; varying vec2 vL;
      #include <fog_pars_fragment>
      ${K}
      void main() {
        vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
        // trembling reflections: a faint ripple normal
        vec2 rp = vW.xz * 1.7 + uTime * 0.3;
        vec2 dn = (vec2(vn(rp), vn(rp + 9.1)) - 0.5) * 0.09;
        vec3 R = normalize(vec3(-V.x + dn.x, abs(V.y) + 0.02, -V.z + dn.y));
        float hl = max(length(uSunDir.xz), 1e-3), toSun = max(dot(R.xz, uSunDir.xz) / (hl * max(length(R.xz), 1e-3)), 0.0);
        float low = 1.0 - smoothstep(0.0, 0.4, R.y);
        vec3 sky = mix(uSky * 0.5, uSky * 1.1, low);
        sky = mix(sky, mix(uRose, uCream, low * (0.4 + 0.6 * uMistLit)) * (0.8 + 0.5 * uMistLit), toSun * toSun * low);
        float fres = 0.06 + 0.94 * pow(1.0 - clamp(abs(V.y), 0.0, 1.0), 4.0);
        vec3 col = mix(uMud * 0.07 + uSky * 0.05, sky * uHemiI * 0.55, fres) * (0.86 + 0.28 * vn(rp * vec2(0.35, 1.3)));
        float md = uMistTop + 0.3;
        col = mix(col, uMistColor * 0.8, min(1.0 - exp(-md * 0.11 / max(abs(V.y), 0.05)), 0.8) * uMistAmt);
        float a = 1.0 - smoothstep(0.8, 1.0, length(vL) / uRadius);
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`});Z(i,e,["uSky","uRose","uCream","uSunDir","uMistColor","uMud","uTime","uHemiI","uMistAmt","uMistTop","uMistLit"]);const n=new c.Mesh(a,i);return n.renderOrder=1,n.name="water",n}function k0(e,t,a){const i=t<.8?[.46,.66]:[.42,.56,.7],n=[],s=[],f=[],l=[];i.forEach((m,h)=>{const r=s.length/3;s.push(-a,m,-a,a,m,-a,a,m,a,-a,m,a),f.push(h,h,h,h),l.push(r,r+2,r+1,r,r+3,r+2)});const d=new c.BufferGeometry;d.setAttribute("position",new c.Float32BufferAttribute(s,3)),d.setAttribute("aLayer",new c.Float32BufferAttribute(f,1)),d.setIndex(l);const v=new c.ShaderMaterial({uniforms:c.UniformsUtils.merge([c.UniformsLib.fog,{uRadius:{value:a}}]),fog:!0,transparent:!0,depthWrite:!1,side:c.DoubleSide,vertexShader:`
      attribute float aLayer; varying vec3 vW; varying float vLayer; varying vec2 vL;
      #include <fog_pars_vertex>
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vLayer = aLayer; vL = position.xz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uMistColor, uCream, uRose, uSunColor; uniform float uTime, uMistLit, uRadius, uMistAmt;
      varying vec3 vW; varying float vLayer; varying vec2 vL;
      #include <fog_pars_fragment>
      ${K}
      void main() {
        vec2 p = vW.xz * 0.16 + vec2(uTime * 0.045, uTime * 0.012) * (1.0 + vLayer * 0.35) + vLayer * 7.3;
        float n = vn(p) * 0.5 + vn(p * 2.3 + 3.0 + uTime * 0.05) * 0.28 + vn(p * 5.1 + vec2(uTime * 0.2, -uTime * 0.07)) * 0.22;
        float a = mix(0.02, 0.3, smoothstep(0.25, 0.8, n)) * (1.0 - vLayer * 0.22);
        a *= 1.0 - smoothstep(0.55, 1.0, length(vL) / uRadius);
        a *= smoothstep(0.3, 1.6, distance(vW, cameraPosition));
        vec3 col = mix(uMistColor * (0.72 + 0.56 * n), mix(uRose, uCream, 0.6 + 0.3 * n) * (0.55 + 0.35 * n), uMistLit * (0.8 + 0.2 * n));
        gl_FragColor = vec4(col, a * uMistAmt);
        #include <fog_fragment>
      }`});Z(v,e,["uMistColor","uCream","uRose","uSunColor","uTime","uMistLit","uMistAmt"]);const p=new c.Mesh(d,v);return p.renderOrder=3,p.frustumCulled=!1,p}async function g0(e,t={}){const a=e.rng,i=t.palette&&t.palette.length>=7?t.palette:i0,n=H(t.detail??e.quality?.detail??1,.6,1),s=d0(i);s.uStyle.value=t.sailStyle??a.int(0,2);const f=new c.Group;f.name="red-sails-dawn-hero";const l=(t.placements||b0(a)).map(o=>({...o}));for(const o of l)o.kind=o.kind||"eda",o.y=o.y??.3,o.scale=o.scale??1,o.phase=o.phase??a(),o.period=o.period??a.range(4,7),o.tint=o.tint??a.range(-.14,.14),o.seed=o.seed??a(),o.lineOffset=o.lineOffset??a.range(0,.12);const d=a.fork?a.fork("geo"):a,v={};v.eda=X("eda",d,!0),await e.yield(),v.edaFar=X("eda",d,!1),await e.yield(),v.dim=X("dim",d,!0),await e.yield();const p=m0(s),m={};for(const o of["eda","edaFar","dim"])m[o]=p0(v[o],p,l.filter(S=>S.kind===o)),m[o].name="sailbacks-"+o,f.add(m[o]),await e.yield();const h=y0(s,l,v);f.add(h);let r=6,u=4,x=0;for(const o of l)r=Math.max(r,Math.abs(o.x)+2.2),u=Math.max(u,Math.abs(o.z+1.2)+2.2),x=Math.max(x,o.y+v[o.kind].userData.sailTop*o.scale);if(t.ground!==!1){const o=await x0(e,s,n,r*1.32,u*1.3);o.name="mudbar",f.add(o),f.add(M0(s,Math.max(r,u)*6))}await e.yield(),t.mist!==!1&&f.add(k0(s,n,Math.max(r,u)*2.4));const k=(o,S,A)=>new c.Vector3(o,S,A),M=l.filter(o=>o.kind==="eda").sort((o,S)=>S.z-o.z)[0]||l[0],b=l.filter(o=>o.kind==="dim"),w=M.z+5.6,C={portalSeat:{position:k(r+24,7,w+1),facing:k(-1,0,0)},flyThrough:[k(-r-20,1.5,w+2),k(-r*.6,1.5,w+.6),k(M.x,1.5,w),k(r*.6,1.5,w+.5),k(r+10,1.8,w+1)],viewpoints:{entry:k(-r-20,1.5,w+2),closest:k(M.x-1.5,1.5,w),display:b.length?k(b[0].x-3,1.6,b[0].z+7):k(0,1.6,w)},lookAt:k(M.x,1,M.z),nearestGroup:k(M.x,M.y,M.z),displayPair:b.length?k(b[0].x,b[0].y,b[0].z):null,sunDir:s.uSunDir.value,extent:{halfX:r,halfZ:u,top:x},animals:l.map(o=>({kind:o.kind,position:k(o.x,o.y,o.z),yaw:o.yaw||0,sailTop:o.y+v[o.kind].userData.sailTop*o.scale}))},L=new c.Color(i[4]),z=new c.Color(i[5]),B=new c.Color(i[0]).multiplyScalar(.62),I=new c.Color(i[5]).multiplyScalar(.72);let T=!1,E=null;const D=o=>{s.uSunLineY.value=E??J(o),s.uSunColor.value.copy(L).lerp(z,_(.3,.9,o)),s.uSunI.value=.9+1.3*_(.1,.7,o),s.uEmberGain.value=1.4,s.uMistLit.value=_(.44,.53,o),s.uMistColor.value.copy(B).lerp(I,s.uMistLit.value),s.uShadow.value=_(.44,.51,o)*(1-.5*_(.9,1,o))},P=(o,S,A)=>{o&&s.uSunDir.value.copy(o).normalize();const F=s.uSunDir.value,N=Math.hypot(F.x,F.z);s.uTanElev.value=Math.max(F.y,.02)/Math.max(N,.001),s.uShDir.value.set(-F.x/Math.max(N,.001),-F.z/Math.max(N,.001)),S&&L.set(S),A!==void 0&&(s.uSunI.value=A)};P(null),D(.4);const g=new c.Vector2;return{object:f,radius:t.placements?Math.hypot(r,u)*.5:1.5,height:1.4,center:k(.5,1.3,2.2),anchors:C,uniforms:s,sunLineY:J,ground:t.ground===!1,groundY:-.02,setProgress(o){T=!0,D(H(o,0,1))},setSunLine(o){E=o,s.uSunLineY.value=o},setSun:P,setMist(o,S){o&&(B.set(o),s.uMistColor.value.copy(B).lerp(I,s.uMistLit.value)),S!==void 0&&(s.uMistTop.value=S)},update(o,S,A){s.uTime.value=S,T||D(.4+.1*Math.sin(S*.21-2.6)),A&&e.renderer&&(e.renderer.getDrawingBufferSize(g),s.uPix.value=2/(Math.max(A.projectionMatrix.elements[5],.001)*Math.max(g.y,1)))},dispose(){}}}export{i0 as PALETTE,g0 as buildHero,X as sailbackGeometry,m0 as sailbackMaterial,p0 as sailbackMesh,J as sunLineY};
