import*as t from"three";import{clamp as fe,lerp as H,smoothstep as se}from"../kit/core.js";const qe=["#E3B23C","#2E5FA8","#8C8377","#C9C2B2","#4A3A2A","#6FA79A","#B5562B"],te=a=>new t.Color(a),me=(a,o,e)=>a.clone().lerp(o,e),Le=Math.PI*2,$t=a=>{const o=Math.sin(a*127.1+311.7)*43758.5453;return o-Math.floor(o)};class Ft{constructor(){this.p=[],this.c=[],this.b=[],this.pv=[],this.idx=[],this.bone=[0,0,0,0],this.pivot=[0,0,0]}get n(){return this.p.length/3}set(o,e=0,u=0,l=0,f=null){return this.bone=[o,e,u,l],f&&(this.pivot=f),this}v(o,e,u,l){return this.p.push(o,e,u),this.c.push(l.r,l.g,l.b),this.b.push(...this.bone),this.pv.push(...this.pivot),this.n-1}quad(o,e,u,l){this.idx.push(o,e,u,o,u,l)}tri(o,e,u){this.idx.push(o,e,u)}loft(o,e,u,l={}){const f=[],p=this.n;for(let c=0;c<o.length;c++){const i=o[c],d=[],b=Math.cos(i.a||0),S=Math.sin(i.a||0),P=2/(i.e||2);i.t!==void 0&&(this.bone[1]=i.t),i.w!==void 0&&(this.bone[2]=i.w);for(let C=0;C<e;C++){const M=C/e*Le,m=Math.cos(M),v=Math.sin(M),w=l.mod?l.mod(M,c,i):1,A=Math.sign(m)*Math.pow(Math.abs(m),P)*i.hw*w,x=Math.sign(v)*Math.pow(Math.abs(v),P)*(v>0?i.up:i.dn)*w,D=u(v,m,i,c);i.dk&&D.multiplyScalar(i.dk),d.push(this.v((i.x||0)+A,i.y+x*b,i.z-x*S,D))}f.push(d)}for(let c=0;c<f.length-1;c++)for(let i=0;i<e;i++){const d=(i+1)%e;this.quad(f[c][i],f[c][d],f[c+1][d],f[c+1][i])}return l.capStart&&this.cap(f[0],!0),l.capEnd&&this.cap(f[f.length-1],!1),[p,this.n]}cap(o,e){let u=0,l=0,f=0;const p=new t.Color(0,0,0);for(const d of o)u+=this.p[d*3],l+=this.p[d*3+1],f+=this.p[d*3+2],p.r+=this.c[d*3],p.g+=this.c[d*3+1],p.b+=this.c[d*3+2];const c=o.length;p.multiplyScalar(1/c);const i=this.v(u/c,l/c,f/c,p);for(let d=0;d<c;d++){const b=o[d],S=o[(d+1)%c];e?this.tri(i,S,b):this.tri(i,b,S)}}limb(o,e,u,l,f={}){const p=[],c=this.n,i=o.length,d=new t.Vector3,b=new t.Vector3,S=new t.Vector3;for(let P=0;P<i;P++){const C=o[P],M=o[Math.max(0,P-1)],m=o[Math.min(i-1,P+1)];d.set(m[0]-M[0],m[1]-M[1],m[2]-M[2]).normalize(),b.set(1,0,0),f.side&&b.set(f.side[0],f.side[1],f.side[2]),b.addScaledVector(d,-b.dot(d)).normalize(),S.crossVectors(b,d).multiplyScalar(-1),f.ring&&f.ring(P,this);const v=[],w=e[P];for(let A=0;A<u;A++){const x=A/u*Le,D=Math.cos(x),h=Math.sin(x),n=h>0?w[1]:w[2]!==void 0?w[2]:w[1];v.push(this.v(C[0]+b.x*D*w[0]+S.x*h*n,C[1]+b.y*D*w[0]+S.y*h*n,C[2]+b.z*D*w[0]+S.z*h*n,l(P,x)))}p.push(v)}for(let P=0;P<i-1;P++)for(let C=0;C<u;C++){const M=(C+1)%u;this.quad(p[P][C],p[P][M],p[P+1][M],p[P+1][C])}return f.capStart&&this.cap(p[0],!0),f.capEnd&&this.cap(p[i-1],!1),[c,this.n]}blob(o,e,u,l,f,p,c,i=6){const d=[];for(let b=0;b<=i;b++){const S=b/i*Math.PI,P=[];for(let C=0;C<i*2;C++){const M=C/(i*2)*Le;P.push(this.v(o+Math.sin(S)*Math.cos(M)*l,e+Math.cos(S)*f,u+Math.sin(S)*Math.sin(M)*p,c(Math.cos(S),M)))}d.push(P)}for(let b=0;b<i;b++)for(let S=0;S<i*2;S++){const P=(S+1)%(i*2);this.quad(d[b][S],d[b][P],d[b+1][P],d[b+1][S])}}build(){const o=new t.BufferGeometry;return o.setAttribute("position",new t.Float32BufferAttribute(this.p,3)),o.setAttribute("color",new t.Float32BufferAttribute(this.c,3)),o.setAttribute("aBone",new t.Float32BufferAttribute(this.b,4)),o.setAttribute("aPivot",new t.Float32BufferAttribute(this.pv,3)),o.setIndex(this.idx),o.computeVertexNormals(),o}}const zt={adult:{h:4.8,head:1.1,ear:.9,depth:1,width:1,leg:1.22,neck:1,fold:1,ribs:1,brown:0},half:{h:3.4,head:1.18,ear:1.1,depth:.93,width:.92,leg:1.1,neck:.96,fold:.65,ribs:.4,brown:.3},calf:{h:2.2,head:1.32,ear:1.5,depth:.84,width:.84,leg:.98,neck:.86,fold:.3,ribs:0,brown:1}},it=40*Math.PI/180,Me=-14*Math.PI/180;function kt(a="adult",o=qe,e=null,u=!1){const l=zt[a]||zt.adult,f=l.h/4.8,p=new Ft,c=me(me(te(o[2]),te("#6c7689"),.8).multiplyScalar(.8),te("#8a7c72"),l.brown*.7),i=me(te(o[4]).multiplyScalar(.62),c,.1+.25*l.brown),d=me(te(o[3]),c,.35),b=te("#3a3128"),S=te("#d8cdb4"),P=te("#0b0806"),C=e?(g,k,y)=>e.n3(g,k,y):(g,k,y)=>Math.sin(g*1.7+k*2.3)*Math.cos(y*1.9+k),M=(g,k,y,q=1)=>{const O=d.clone().lerp(c,se(-.85,-.1,g));O.lerp(i,se(.6,.92,g)*.94*q);const Y=.5+.5*C(y*1.3,k*1.3,g*2),ae=.5+.5*C(y*5.1,k*5.1,g*6);return O.multiplyScalar(.76+.2*Y+.1*ae)},m=(g,k,y)=>M(g,y.y,y.z,y.stripe===void 0?1:y.stripe),v=2.42,w=l.depth,A=l.width,x=[[-2.34,3.66,3,.4,2],[-2.2,4.02,2.74,.8,2.1],[-1.9,4.25,2.62,1.06,2.2],[-1.45,4.35,v+.14,1.17,2.3],[-1,4.36,v+.08,1.2,2.4],[-.5,4.39,v-.04,1.25,2.5],[0,4.45,v-.1,1.26,2.5],[.5,4.57,v-.12,1.22,2.4],[.95,4.72,v-.07,1.12,2.2],[1.3,4.8,v+.02,1,1.9],[1.6,4.72,v+.14,.9,1.9],[1.88,4.5,v+.4,.74,2],[2.12,4.2,3.2,.45,2]];p.set(0,0,0,0,[0,0,0]),p.loft(x.map(([g,k,y,q,O])=>{const Y=k-(k-y)*w,ae=Y+.56*(k-Y);return{y:ae,z:g,up:k-ae,dn:ae-Y,hw:q*A,e:O}}),26,m,{capStart:!0,capEnd:!0,mod:(g,k,y)=>{const q=Math.max(0,Math.cos(g))**2+Math.max(0,-Math.cos(g))**2;return 1+.012*l.ribs*q*Math.sin(y.z*14)*se(-1.2,-.6,y.z)*se(.9,.3,y.z)}});for(const g of[1,-1])p.set(0,g>0?0:1,1),p.blob(g*.8*A,3.5,1.2,.33*A,1.05,.66,(k,y)=>M(k*.6,3.5+k,1.2,0),7),p.set(0,g>0?2:3,1),p.blob(g*.82*A,3.42,-1.32,.46*A,1,.9,(k,y)=>M(k*.6,3.4+k,-1.3,0),7);const D=2.48*l.neck,h=[3.95,1.7],n=[Math.sin(it),Math.cos(it)],F=l.fold,L=[[-.4,.98,1.12,.74],[0,.93,1.02,.71],[.42,.83,.88,.63],[.72,.735,.77,.555],[1.1,.61,.63,.465],[1.5,.47,.49,.36],[1.82,.43,.45,.33],[2.04,.42,.44,.325],[2.2,.4,.42,.315]],G=g=>{let k=0;for(;k<L.length-2&&L[k+1][0]<g;)k++;const y=L[k],q=L[k+1],O=fe((g-y[0])/(q[0]-y[0]),0,1);return[g,H(y[1],q[1],O),H(y[2],q[2],O),H(y[3],q[3],O)]},r=[[...G(-.4).slice(0),1],[...G(-.1),1]],V=(g,k,y)=>{const q=k*F;for(const[O,Y,ae]of[[-y,1+.035*q,1],[0,1-.07*q,1-.18*q],[y,1+.04*q,1.02]]){const ve=G(g+O);r.push([ve[0],ve[1]*Y,ve[2]*Y,ve[3]*Y,ae])}};V(.08,1,.07),V(.4,.75,.06),V(.86,.45,.05),r.push([...G(1.1),1],[...G(1.4),1]),V(1.9,.6,.05),r.push([...G(2.06),1],[...G(2.2),1]),p.set(1,0,0,0,[0,h[0],h[1]]),p.loft(r.map(([g,k,y,q,O])=>{const Y=g*l.neck*(g>0?1.1272727272727272:1),ae=H(1.1,1.02,fe(Y/D,0,1));return{y:h[0]+n[0]*Y,z:h[1]+n[1]*Y,a:it,up:k*ae,dn:y*ae*1.05,hw:q*ae,e:2.1,dk:O,t:fe(Y/D,0,1)}}),20,m);const W=[h[0]+n[0]*D,h[1]+n[1]*D],N=[Math.sin(Me),Math.cos(Me)],U=[Math.cos(Me),-Math.sin(Me)],Q=l.head,X=(g,k,y)=>[y*Q,W[0]+(N[0]*g+U[0]*k)*Q,W[1]+(N[1]*g+U[1]*k)*Q],re=[[-.2,.34,.37,.28,0,0],[.04,.39,.4,.31,0,0],[.24,.405,.36,.315,0,0],[.44,.375,.22,.295,0,0],[.64,.32,.16,.255,0,0],[.84,.265,.135,.22,0,0],[1.02,.225,.12,.195,.1,0],[1.15,.185,.115,.165,.35,-.01],[1.25,.125,.1,.115,.7,-.04],[1.33,.05,.05,.05,1,-.085]];p.set(2,0,0,0,[0,W[0],W[1]]),p.loft(re.map(([g,k,y,q,O,Y])=>{const ae=X(g,Y,0);return{y:ae[1],z:ae[2],a:Me,up:k*Q,dn:y*Q,hw:q*Q,e:2.2,w:O,stripe:.5}}),16,(g,k,y)=>M(.3+.7*g,y.y,y.z,.32).multiplyScalar(g<-.3?.7:1),{capEnd:!0});const J=X(.16,-.2,0),oe=[[.1,-.2,.14,.2,.27],[.34,-.27,.12,.21,.265],[.6,-.25,.08,.13,.205],[.85,-.215,.06,.095,.16],[1.04,-.185,.05,.07,.125],[1.14,-.17,.03,.035,.06]];p.set(3,0,0,0,J),p.loft(oe.map(([g,k,y,q,O])=>{const Y=X(g,k,0);return{y:Y[1],z:Y[2],a:Me,up:y*Q,dn:q*Q,hw:O*Q,e:2.2,stripe:0}}),12,(g,k,y)=>M(.1+.3*g,y.y,y.z,0).multiplyScalar(.9),{capStart:!0,capEnd:!0});const le={A:l,k:f,hp:W,hd:N,hu:U,HS:Q,nb:h,Ln:D,headPt:X,jp:J,hideAt:M,cDark:i,cHide:c,cHorn:b,cTusk:S,cEye:P,pal:o};return u?{m:p,q:le}:Pt(p,le)}const rt=new WeakMap,St=(a,o)=>a+"|"+o.join(",");async function Mt(a,o="adult",e=qe){let u=rt.get(a);u||rt.set(a,u=new Map);const l=St(o,e);if(u.has(l))return u.get(l);a.yield&&await a.yield();const f=kt(o,e,a.noise,!0);a.yield&&await a.yield();const p=Pt(f.m,f.q,!0);a.yield&&await a.yield();const c=p();return u.set(l,c),a.yield&&await a.yield(),c}const Tt=[[-.55,.33,.42,.42,1],[0,.36,.45,.46,1],[.4,.34,.4,.48,1],[.72,.31,.34,.53,1],[.82,.29,.31,.44,.9],[.98,.27,.3,.34,1],[1.3,.225,.25,.25,1],[1.7,.19,.21,.2,1],[1.9,.195,.23,.2,1],[1.97,.185,.225,.19,.9],[2.1,.235,.31,.22,1],[2.22,.2,.235,.2,.9],[2.3,.195,.215,.2,1],[2.55,.165,.17,.17,1],[2.9,.16,.165,.17,1],[3.08,.19,.2,.225,1],[3.2,.24,.275,.26,.85],[3.34,.275,.315,.275,1],[3.42,.255,.295,.255,.8]],jt=[[-.6,.38,.6,.55,1],[0,.4,.57,.5,1],[.3,.36,.47,.42,.92],[.42,.35,.44,.41,1],[.78,.29,.34,.33,1],[1.2,.22,.24,.27,1],[1.42,.2,.2,.31,1],[1.56,.21,.215,.35,1],[1.68,.19,.19,.26,.9],[1.8,.18,.18,.21,1],[2.15,.165,.17,.18,1],[2.5,.165,.17,.18,1],[2.68,.19,.2,.225,1],[2.8,.24,.275,.26,.85],[2.94,.275,.315,.275,1],[3.02,.255,.295,.255,.8]],be={fore:{py:3.4,pz:1.22,px:.72,L1:2.1,L2:1.32,rows:Tt},hind:{py:2.95,pz:-1.22,px:.74,L1:1.56,L2:1.46,rows:jt}};function Pt(a,o,e=!1){const{A:u,k:l,hp:f,hu:p,hd:c,HS:i,headPt:d,jp:b,hideAt:S,cDark:P,cHide:C,cHorn:M,cTusk:m,cEye:v,pal:w}=o,A=u.width,x=me(te("#a08878"),C,.6),D=me(te(w[3]),te("#a89a80"),.6).multiplyScalar(.8);for(const r of[1,-1]){const V=d(.5,.105,r*.262);a.set(2,0,0,1,[0,f[0],f[1]]),a.blob(V[0],V[1],V[2],.05*i,.05*i,.058*i,()=>v.clone(),5),a.set(7,0,0,0,[0,-p[0]*.062*i,-p[1]*.062*i]);const W=d(.5,.158,r*.25);a.blob(W[0],W[1],W[2],.062*i,.05*i,.085*i,O=>S(.3,W[1],W[2],0).multiplyScalar(.8+.15*O),5),a.set(2,0,0,0,[0,f[0],f[1]]);const N=d(.5,.04,r*.262);a.blob(N[0],N[1],N[2],.05*i,.035*i,.08*i,()=>S(0,N[1],N[2],0).multiplyScalar(.72),4);const U=d(1.11,.135,r*.1);a.set(2,0,.3,0),a.blob(U[0],U[1],U[2],.03*i,.022*i,.05*i,()=>P.clone().multiplyScalar(.35),4);const Q=d(1.1,-.09,r*.075),X=d(1.12,-.19,r*.075);a.set(2,0,0,2),a.limb([Q,X],[[.024*i,.024*i],[.008,.008]],5,()=>m.clone(),{capEnd:!0});const re=d(1.07,-.185,r*.045),J=d(1.2,-.16,r*.05);a.set(3,0,0,2,b),a.limb([re,J],[[.022*i,.022*i],[.007,.007]],5,()=>m.clone(),{capEnd:!0});const oe=d(.05,.33,r*.2),le=.46*u.ear,g=[],k=[],y=new t.Vector3(r*.42,p[0]*.95-c[0]*.2,p[1]*.95-c[1]*.2).normalize(),q=[[0,.05,.045],[.18,.085,.04],[.42,.125,.03],[.7,.105,.022],[.9,.055,.015],[1,.008,.006]];for(const[O,Y,ae]of q)g.push([oe[0]+y.x*O*le,oe[1]+y.y*O*le-.02*O*O,oe[2]+y.z*O*le-.05*O*O*le]),k.push([Y*u.ear*.95,ae*u.ear]);a.set(4,r,0,0,oe),a.limb(g,k,8,(O,Y)=>Math.sin(Y)>.2?x.clone():S(.5,oe[1],oe[2],0).multiplyScalar(.85),{side:[r*.78,0,-.62],capEnd:!0})}const h=[0,3.74,-2.22],n=[[0,3.74,-2.2],[0,3.56,-2.43],[0,3.22,-2.52],[0,2.9,-2.53],[0,2.7,-2.53],[0,2.42,-2.52],[0,2.1,-2.5]],F=[.16,.125,.095,.075,.13,.12,.02];a.set(5,0,0,0,h),a.limb(n,F.map(r=>[r,r]),7,r=>r>=3?me(P,C,.4):S(.4,3.3,-2.4,.6),{ring:(r,V)=>{V.bone[1]=r/6,V.bone[3]=r>=4?3:0},capEnd:!0});let L=0;for(const r of[be.fore,be.hind])for(const V of[1,-1]){const W=V*r.px*A,N=u.leg,U=r===be.hind;a.set(6,L++,0,0,[W,r.py,r.pz]),a.limb(r.rows.map(([X])=>[W,r.py-X,r.pz]),r.rows.map(([X,re,J,oe])=>{const le=X<.5?H(1,N,fe(X/.5+.5,0,1)):N;return[re*le,J*le,oe*le]}),12,(X,re)=>{const J=r.rows[X][0],oe=Math.cos(re)*V;return S(-.75+.75*se(-.7,.4,oe),r.py-J,r.pz+(U?3:0),0).multiplyScalar(r.rows[X][4])},{capEnd:!0});const Q=r.py-r.L1-r.L2;a.bone[3]=2;for(const[X,re,J]of[[0,.29,.115],[.2,.19,.1],[-.2,.19,.1]])a.blob(W+X*N,Q+.085,r.pz+re*N,J*N,.1,J*.85*N,oe=>M.clone().multiplyScalar(.8+.5*Math.max(0,oe)),4)}for(let r=0;r<a.n;r++){const V=a.p[r*3+1],W=se(2,.3,V)*(a.b[r*4+3]===2?.12:.5);a.c[r*3]=H(a.c[r*3],D.r,W),a.c[r*3+1]=H(a.c[r*3+1],D.g,W),a.c[r*3+2]=H(a.c[r*3+2],D.b,W)}for(let r=0;r<a.p.length;r++)a.p[r]*=l,a.pv[r]*=l;const G=()=>{const r=a.build(),V=d(1.3,-.12,0),W={age:u,k:l,h:u.h,neckBase:[0,o.nb[0]*l,o.nb[1]*l],headPivot:[0,f[0]*l,f[1]*l],jawPivot:b.map(N=>N*l),lipTip:V.map(N=>N*l),legs:[be.fore.L1*l,be.fore.L2*l,be.hind.L1*l,be.hind.L2*l],withers:[0,4.8*l,1.3*l],length:7.2*l};return{geometry:r,rig:W,triangles:a.idx.length/3}};return e?G:G()}const Pe=`
float h31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(mix(h31(i), h31(i+vec3(1,0,0)), f.x), mix(h31(i+vec3(0,1,0)), h31(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i+vec3(0,0,1)), h31(i+vec3(1,0,1)), f.x), mix(h31(i+vec3(0,1,1)), h31(i+vec3(1,1,1)), f.x), f.y), f.z); }
float h11(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
`,Wt=`
attribute vec4 aBone; attribute vec3 aPivot; attribute vec4 iA, iB, iC, iD;
uniform float uTime, uStride, uK, uDuty; uniform vec3 uNeckBase, uHeadPiv, uJawPiv; uniform vec4 uLegs;
varying vec3 vCol, vN, vWorld, vRest; varying vec4 vInfo; varying float vDapple;
#include <fog_pars_vertex>
${Pe}
void rX(inout vec3 p, vec3 c, float a){ float s = sin(a), k = cos(a); vec3 d = p - c; p = c + vec3(d.x, d.y*k + d.z*s, d.z*k - d.y*s); }
void rY(inout vec3 p, vec3 c, float a){ float s = sin(a), k = cos(a); vec3 d = p - c; p = c + vec3(d.x*k + d.z*s, d.y, d.z*k - d.x*s); }
void rZ(inout vec3 p, vec3 c, float a){ float s = sin(a), k = cos(a); vec3 d = p - c; p = c + vec3(d.x*k - d.y*s, d.y*k + d.x*s, d.z); }
// where a foot is in its cycle: x = fore-aft position -0.5..0.5 of the stance travel, y = lift 0..1, z = stance progress 0..1 (or -1 in swing)
vec3 footCycle(float leg, float ph){
  float off = leg < 0.5 ? 0.25 : leg < 1.5 ? 0.75 : leg < 2.5 ? 0.0 : 0.5;
  float f = fract(ph + off), st = f / uDuty, sw = clamp((f - uDuty) / (1. - uDuty), 0., 1.);
  float e = sw*sw*sw*(sw*(sw*6.-15.)+10.);
  return f < uDuty ? vec3(0.5 - st, 0., st) : vec3(e - 0.5, sin(sw * 3.14159), -1.);
}
void main(){
  vec3 p = position, n = normal;
  float part = aBone.x, ph = iB.x, walk = iB.y, seed = iB.z, t = uTime + seed * 23.7;
  float S = uStride * uDuty;
  // the body rides over the planted feet: bob twice a stride, sway once, breathe
  vec3 bodyOff = vec3(0.045 * uK * sin(6.2832 * ph), -0.04 * uK * (0.5 + 0.5 * cos(12.566 * ph)), 0.) * walk;
  if (part > 5.5 && part < 6.5) {
    float leg = aBone.y; bool hind = leg > 1.5;
    float L1 = hind ? uLegs.z : uLegs.x, L2 = hind ? uLegs.w : uLegs.y, LL = L1 + L2;
    vec3 fc = footCycle(leg, ph);
    float stand = (h11(leg + seed * 7.) - 0.5) * 0.5 * uK * (1. - walk);
    vec2 P = vec2(aPivot.z + fc.x * walk * 0.3 * uK, aPivot.y + bodyOff.y);
    vec2 Ft = vec2(aPivot.z + fc.x * S * walk + stand, fc.y * walk * 0.42 * uK);
    vec2 d = Ft - P; float dl0 = max(length(d), 1e-3); vec2 dn = d / dl0;
    float dl = clamp(dl0, abs(L1 - L2) + 0.02, LL * 0.9995);
    float a = (L1*L1 - L2*L2 + dl*dl) / (2. * dl), h = sqrt(max(L1*L1 - a*a, 0.));
    vec2 K = P + dn * a + vec2(-dn.y, dn.x) * h * (hind ? -1. : 1.);
    vec2 Fe = P + dn * dl, u1 = (K - P) / L1, u2 = (Fe - K) / L2;
    float s = aPivot.y - p.y; vec2 rel = vec2(p.z - aPivot.z, p.y - aPivot.y), nr = vec2(n.z, n.y);
    // upper bone (fades into the body above the joint), lower bone, level foot
    vec2 ra = vec2(-u1.y * rel.x - u1.x * rel.y, u1.x * rel.x - u1.y * rel.y), na = vec2(-u1.y * nr.x - u1.x * nr.y, u1.x * nr.x - u1.y * nr.y);
    float w0 = smoothstep(-0.55 * uK, 0.2 * uK, s);
    vec2 A = P + mix(rel + vec2(0., 0.), ra, w0); na = mix(nr, na, w0);
    vec2 r2 = vec2(rel.x, rel.y + L1);
    vec2 B = K + vec2(-u2.y * r2.x - u2.x * r2.y, u2.x * r2.x - u2.y * r2.y), nb = vec2(-u2.y * nr.x - u2.x * nr.y, u2.x * nr.x - u2.y * nr.y);
    float wK = smoothstep(L1 - 0.24 * uK, L1 + 0.24 * uK, s);
    vec2 q = mix(A, B, wK), nq = mix(na, nb, wK);
    float pitch = fc.y * 0.7 * walk + (fc.z > 0. ? smoothstep(0.84, 1., fc.z) * 0.14 * walk : 0.);   // toes hang in swing, heel lifts at push-off
    float spread = 1. + 0.1 * (fc.z > 0. ? smoothstep(0., 0.12, fc.z) : 0.) * walk + 0.05 * (1. - walk);
    vec2 r3 = vec2(rel.x, rel.y + LL) * vec2(spread, 1.); float cp = cos(pitch), sp = sin(pitch);
    vec2 C = Fe + vec2(r3.x * cp + r3.y * sp, r3.y * cp - r3.x * sp);
    float wF = smoothstep(LL - 0.46 * uK, LL - 0.3 * uK, s);
    q = mix(q, C, wF); nq = mix(nq, nr, wF);
    p.x = aPivot.x + (p.x - aPivot.x) * mix(1., spread, wF) + bodyOff.x * clamp(1. - s / LL, 0., 1.);
    p.z = q.x; p.y = q.y; n = normalize(vec3(n.x, nq.y, nq.x) + vec3(1e-5, 0., 0.));
  } else {
    if (part < 0.5) {
      // shoulder blades and haunches slide under the skin with their leg; the flank breathes
      p.z += footCycle(aBone.y, ph).x * walk * 0.3 * uK * aBone.z;
      p.x += sign(p.x) * 0.018 * uK * sin(t * 1.15) * smoothstep(1.3 * uK, -0.2 * uK, abs(p.z + 0.2 * uK));
    } else if (part < 1.5 || (part > 1.5 && part < 4.5) || part > 6.5) {
      // ambient life: chew, ear flicks, a slow blink, small looks about, a nod once a stride
      float chew = iD.x, flickT = t * 0.42 + aBone.y * 0.31, fl = fract(flickT);
      float flick = smoothstep(0., 0.05, fl) * (1. - smoothstep(0.05, 0.22, fl)) * step(0.35, h11(floor(flickT) + seed));
      float bl = fract(t / 6.0), blink = smoothstep(0., 0.02, bl) * (1. - smoothstep(0.03, 0.07, bl));
      if (part > 2.5 && part < 3.5) { rX(p, uJawPiv, -(0.05 + 0.05 * sin(t * 6.2832)) * chew - 0.02); p.x += 0.04 * uK * sin(t * 6.2832 + 1.2) * chew; }
      if (part > 3.5 && part < 4.5) { rY(p, aPivot, aBone.y * (0.9 * flick - 0.25 + 0.18 * sin(t * 0.7 + aBone.y)) ); rX(p, aPivot, -0.55 * iD.z - 0.3 * flick); }
      if (part > 6.5) p += aPivot * blink;
      if (part > 1.5 && part < 2.5) p += vec3(0., -0.11, -0.09) * uK * aBone.z * iD.y + vec3(0.02 * sin(t * 6.2832 + 0.6) * chew * aBone.z * uK, 0., 0.);
      float w = part < 1.5 ? aBone.y : 1.;
      float nP = iC.x + 0.045 * walk * sin(6.2832 * ph + 0.8) + 0.012 * sin(t * 0.9);
      float nY = iC.y + 0.05 * sin(t * 0.37 + seed);
      if (part > 1.5) {
        vec3 n1 = p + n; float hP = iC.z - 0.03 * walk * sin(6.2832 * ph + 0.3), hY = iC.w + 0.06 * sin(t * 0.53 + 2. * seed);
        rX(p, uHeadPiv, hP); rY(p, uHeadPiv, hY); rX(n1, uHeadPiv, hP); rY(n1, uHeadPiv, hY); n = n1 - p;
      }
      vec3 n2 = p + n; float ww = w * w * (3. - 2. * w);
      rX(p, uNeckBase, nP * ww); rY(p, uNeckBase, nY * w); rX(n2, uNeckBase, nP * ww); rY(n2, uNeckBase, nY * w); n = n2 - p;
    } else {
      float sw = (0.3 * sin(t * 1.4) + 0.5 * sin(t * 0.61 + 2.) * sin(t * 2.9)) * aBone.y;   // tail switches
      rZ(p, aPivot, sw); rX(p, aPivot, -0.12 * aBone.y * walk * sin(12.566 * ph));
    }
    p += bodyOff;
  }
  float ch = cos(iA.w), sh = sin(iA.w);
  p *= iB.w; vec3 wp = vec3(p.x * ch + p.z * sh, p.y, p.z * ch - p.x * sh) + iA.xyz;
  vec3 wn = vec3(n.x * ch + n.z * sh, n.y, n.z * ch - n.x * sh);
  vec4 world = modelMatrix * vec4(wp, 1.);
  vWorld = world.xyz; vN = normalize(mat3(modelMatrix) * wn + vec3(0., 1e-5, 0.));
  vCol = color; vRest = position / uK; vInfo = vec4(part, aBone.y, aBone.w, seed); vDapple = iD.w;
  vec4 mvPosition = viewMatrix * world; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ee="uniform vec3 uSunDir, uSunCol, uSkyCol, uGroundCol; uniform float uTime;",Gt=`
${Ee}
uniform float uFold, uGlade;
varying vec3 vCol, vN, vWorld, vRest; varying vec4 vInfo; varying float vDapple;
#include <fog_pars_fragment>
${Pe}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), toC = cameraPosition - vWorld; float dist = max(length(toC), 1e-3); vec3 V = toC / dist;
  if (!gl_FrontFacing) N = -N;
  float part = vInfo.x, surf = vInfo.z, hide = surf < 0.5 ? 1. : 0., near = 1. - smoothstep(22., 70., dist), close = 1. - smoothstep(8., 26., dist);
  // skin at two scales: broad mottle, then a crackle of wrinkles, with fold rings round neck and limbs
  float m1 = vn3(vRest * 1.7 + vInfo.w * 9.), m2 = vn3(vRest * 4.3 + 3.1);
  float w1 = abs(vn3(vRest * vec3(13., 19., 13.)) - 0.5) * 2., w2 = abs(vn3(vRest * vec3(34., 46., 34.) + 7.) - 0.5) * 2.;
  float crack = (1. - smoothstep(0.0, 0.2, w1)) * 0.36 * near + (1. - smoothstep(0., 0.25, w2)) * 0.5 * close;
  // folds: rings round the neck, at knee, hock and fetlock, behind the elbow and in front of the stifle
  bool isNeck = part > 0.5 && part < 1.5, isLeg = part > 5.5 && part < 6.5;
  float ringc = isNeck ? vInfo.y * 20. + 3.6 * sin(vInfo.y * 8.3 + vInfo.w * 2.) : isLeg ? vRest.y * 30. : (vRest.z + vRest.y * 0.22) * 16.;
  float fmask = isNeck ? (0.2 + 0.8 * smoothstep(0.5, 0.0, vInfo.y) + 0.7 * smoothstep(0.7, 1., vInfo.y)) * (0.6 + 0.4 * smoothstep(0.3, 0.7, m2))
              : isLeg ? 0.5 * max(1. - smoothstep(0.1, 0.42, abs(vRest.y - 1.35)), 1. - smoothstep(0.05, 0.25, abs(vRest.y - 0.42)))
              : (part < 0.5 ? max(1. - smoothstep(0.15, 0.55, abs(vRest.z - 0.6)), 1. - smoothstep(0.15, 0.55, abs(vRest.z + 0.7))) * smoothstep(4.1, 3.2, vRest.y) * smoothstep(0.55, 0.85, abs(vRest.x)) : 0.);
  float fph = ringc + (m1 - 0.5) * 5. + (m2 - 0.5) * 2.; float fold = smoothstep(0.55, 1., sin(fph)) * uFold * fmask, crest = smoothstep(0.4, 1., sin(fph + 1.1)) * uFold * fmask;
  float rib = (part < 0.5) ? smoothstep(0.3, 1., sin(vRest.z * 13.5 + vRest.y * 1.2)) * smoothstep(0.75, 1.05, abs(vRest.x)) * smoothstep(-1.3, -0.5, vRest.z) * smoothstep(0.9, 0.2, vRest.z) : 0.;
  float sideK = smoothstep(0.45, 0.8, abs(vRest.x)), eD = vRest.z - 0.66 - 0.22 * (vRest.y - 3.0) + (m2 - 0.5) * 0.12, sD = vRest.z + 0.62 + 0.3 * (vRest.y - 3.0) + (m2 - 0.5) * 0.12, hD = vRest.z + 1.72 - 0.42 * (vRest.y - 3.3) + (m1 - 0.5) * 0.15;
  float lowK = smoothstep(4.05, 3.35, vRest.y) * sideK * (part < 0.5 ? 1. : 0.);
  float crease = max(max(1. - smoothstep(0.02, 0.13, abs(eD)), 1. - smoothstep(0.02, 0.12, abs(sD))), (1. - smoothstep(0.02, 0.1, abs(hD))) * 0.8) * lowK * uFold;
  float lipL = max(max(1. - smoothstep(0.05, 0.3, abs(eD - 0.26)), 1. - smoothstep(0.05, 0.3, abs(sD + 0.26))), 1. - smoothstep(0.05, 0.28, abs(hD + 0.24))) * lowK * uFold;
  float blade = (part < 0.5) ? (1. - smoothstep(0.0, 0.1, abs(vRest.z - 1.05 + 0.3 * (vRest.y - 3.6) + (m1 - 0.5) * 0.1))) * smoothstep(4.5, 4.1, vRest.y) * smoothstep(3.0, 3.5, vRest.y) * sideK * uFold : 0.;
  N = normalize(N + (vec3(m1 - 0.5, (w1 - 0.5) * 0.6, m2 - 0.5) * 0.42 + vec3(w2 - 0.5, 0., w1 - 0.5) * 0.3 * close) * near * hide);
  vec3 alb = vCol * mix(1., (1. - 0.3 * crease * (0.4 + 0.6 * near)) * (1. + 0.14 * lipL * near) * (1. - 0.22 * blade * near) * 1.08 * (0.84 + 0.26 * m1) * (0.92 + 0.16 * m2) * (1. - crack * 0.5) * (1. - (isNeck ? 0.2 : isLeg ? 0.3 : 0.26) * fold * near) * (1. + 0.1 * crest * near) * (1. - 0.2 * rib * uFold * near) * (1. + 0.1 * smoothstep(0.2, 1., sin(vRest.z * 13.5 + vRest.y * 1.2 + 2.2)) * rib * uFold * near), hide);
  // the broad pattern: a darker saddle over back and neck with a ragged lower edge, pale patches of dried silt on flank and haunch
  bool trunk = part < 1.5;
  float sad = trunk ? smoothstep(3.1, 4.3, vRest.y - (isNeck ? 0.9 * vInfo.y * 2.4 : 0.) + (m1 - 0.5) * 1.1 + (m2 - 0.5) * 0.4) : 0.;
  float pat = trunk ? smoothstep(0.52, 0.66, vn3(vRest * vec3(0.9, 1.3, 0.9) + vInfo.w * 3.)) * (1. - sad) * smoothstep(4.4, 3.4, vRest.y) : 0.;
  alb *= mix(1., 0.86, sad * hide); { float lum = dot(alb, vec3(0.3, 0.5, 0.2)); alb = mix(alb, alb * mix(vec3(1.36, 1.24, 1.06), vec3(0.86, 0.8, 0.7), smoothstep(0.16, 0.34, lum)), vDapple * hide); }   // under the gold ceiling the grey is lifted and warmed, never navy alb = mix(alb, alb * 1.22 + vec3(0.035, 0.03, 0.02), pat * 0.6 * hide);
  // low sun from the side, wrapped; sky above and gold leaf-light from below; coin dapples under the leaves
  float ndl = dot(N, uSunDir), diff = clamp((ndl + 0.12) / 1.12, 0., 1.); diff *= diff * (3. - 2. * diff) * 0.6 + 0.4;
  float dap = smoothstep(0.34, 0.72, vn3(vec3(vWorld.xz * 0.8 + uTime * vec2(0.3, 0.12), vWorld.y * 0.25)));
  float sunK = mix(1., 0.36 + 0.7 * dap, vDapple);   // soft pools of sun under the leaves, never hard coins that read as leaves stuck to the hide
  vec3 gnd = mix(mix(vec3(dot(uGroundCol, vec3(0.3, 0.5, 0.2))), uGroundCol, 0.45) * 0.6, uGroundCol, vDapple);
  vec3 hemi = mix(gnd, uSkyCol * 1.3, clamp(N.y * 0.5 + 0.55, 0., 1.)) * (0.5 + 0.5 * smoothstep(-0.5, 0.5, N.y + (m2 - 0.5) * 0.3));
  hemi += dot(uSunCol, vec3(0.3, 0.5, 0.2)) * mix(0.17, 0.29, vDapple) * mix(mix(vec3(0.8, 0.84, 0.95), vec3(1.0, 0.9, 0.66), vDapple), vec3(0.6, 0.8, 1.3), clamp(N.y * 0.5 + 0.5, 0., 1.));   // open sky and gold canopy: the shadow side is never black
  vec3 col = alb * (uSunCol * mix(vec3(0.84, 0.97, 1.22), vec3(1.), max(vDapple, 1. - hide)) * diff * sunK * 1.12 + hemi);
  float f3 = 1. - clamp(dot(N, V), 0., 1.); f3 = f3 * f3 * f3;
  col += uSunCol * vec3(1.15, 0.86, 0.42) * f3 * smoothstep(-0.1, 0.6, N.y) * (0.5 + 0.5 * clamp(ndl + 0.6, 0., 1.)) * mix(0.55, 0.25, vDapple) * (part > 1.5 && part < 4.5 ? 1.5 : 1.) * sunK;   // a thin gold line along nape, brow and ears
  // a burning rim along brow, ears and neck when the sun is behind the animal; a gold edge when it is lit
  float fres = 1. - clamp(dot(N, V), 0., 1.); fres *= fres;
  float back = clamp(dot(-V, uSunDir), 0., 1.), toSun = clamp(ndl + 0.55, 0., 1.);
  col += uSunCol * vec3(1.1, 0.88, 0.55) * (alb * 0.9 + 0.08) * fres * toSun * (0.3 + 3.6 * smoothstep(0.03, 0.75, back)) * sunK;
  if (part > 3.5 && part < 4.5 || surf > 2.5) col += uSunCol * vec3(1., 0.8, 0.55) * alb * (0.6 * back * back + 0.12 * fres) * sunK;   // ear fuzz, tail tuft
  vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.)); float nh = clamp(dot(N, H), 0., 1.);
  if (surf > 0.5 && surf < 1.5) { float s2 = nh * nh; s2 *= s2; s2 *= s2; s2 *= s2; s2 *= s2; col = alb * 0.4 + uSunCol * (s2 * s2 * 2.5 + smoothstep(0.78, 0.96, nh) * 1.5) + uSkyCol * fres * 0.7 + uSkyCol * 0.05;
    vec3 Hc = normalize(V + vec3(0., 0.75, 0.) + uSunDir * 0.45); col += vec3(1.0, 0.95, 0.85) * smoothstep(0.9, 0.97, clamp(dot(N, Hc), 0., 1.)) * 1.3; }   // a catchlight from the sky even in shade
  else { float s1 = nh * nh; s1 *= s1; s1 *= s1; col += uSunCol * s1 * (surf > 1.5 && surf < 2.5 ? 0.22 : 0.035) * sunK * clamp(ndl * 4., 0., 1.); }
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Ct=()=>({uSunDir:{value:new t.Vector3(-.92,.28,.27).normalize()},uSunCol:{value:new t.Color(.95,.8,.56)},uSkyCol:{value:new t.Color(.17,.22,.33)},uGroundCol:{value:new t.Color(.2,.15,.06)},uTime:{value:0}});function lt(a,o={}){const e=o.age||"adult",u=o.count||1,l=o.palette||qe,f=a&&rt.get(a),p=f&&f.get(St(e,l))||kt(e,l,a&&a.noise),c=p.rig,i=new t.InstancedBufferGeometry;i.index=p.geometry.index;for(const h of Object.keys(p.geometry.attributes))i.setAttribute(h,p.geometry.attributes[h]);const d=(h,n)=>{const F=new t.InstancedBufferAttribute(new Float32Array(u*4),4);F.setUsage(t.DynamicDrawUsage);for(let L=0;L<u;L++)F.setXYZW(L,n[0],n[1],n[2],n[3]);return i.setAttribute(h,F),F},b=d("iA",[0,0,0,0]),S=d("iB",[0,0,0,1]),P=d("iC",[0,0,0,0]),C=d("iD",[.6,0,0,0]);i.instanceCount=u;const M=(o.stride||3.9)*c.k*(e==="calf"?.73:1),m=t.UniformsUtils.merge([t.UniformsLib.fog,Ct(),{uStride:{value:M},uK:{value:c.k},uDuty:{value:.68},uFold:{value:c.age.fold},uGlade:{value:0},uNeckBase:{value:new t.Vector3(...c.neckBase)},uHeadPiv:{value:new t.Vector3(...c.headPivot)},uJawPiv:{value:new t.Vector3(...c.jawPivot)},uLegs:{value:new t.Vector4(...c.legs)}}]),v=new t.ShaderMaterial({uniforms:m,vertexShader:Wt,fragmentShader:Gt,vertexColors:!0,fog:!0}),w=new t.Mesh(i,v);w.frustumCulled=!1,w.name="paraceratherium-"+e;const A=[];for(let h=0;h<u;h++)A.push({x:0,y:0,z:0,heading:0,phase:0,walk:0,seed:h*1.37,size:1,neckPitch:0,neckYaw:0,headPitch:0,headYaw:0,chew:.6,lip:0,ears:0,dapple:0});const x=new t.Vector3,D=(h,n,F,L)=>{const G=Math.sin(L),r=Math.cos(L),V=h.x-n[0],W=h.y-n[1],N=h.z-n[2];F===0?h.set(n[0]+V,n[1]+W*r+N*G,n[2]+N*r-W*G):h.set(n[0]+V*r+N*G,n[1]+W,n[2]+N*r-V*G)};return{mesh:w,object:w,material:v,uniforms:m,rig:c,stride:M,count:u,state:A,triangles:p.triangles*u,set(h,n){return Object.assign(A[h],n),this},commit(){for(let h=0;h<u;h++){const n=A[h];b.setXYZW(h,n.x,n.y,n.z,n.heading),S.setXYZW(h,n.phase,n.walk,n.seed,n.size),P.setXYZW(h,n.neckPitch,n.neckYaw,n.headPitch,n.headYaw),C.setXYZW(h,n.chew,n.lip,n.ears,n.dapple)}b.needsUpdate=S.needsUpdate=P.needsUpdate=C.needsUpdate=!0},lipPoint(h,n=new t.Vector3,F=c.lipTip){const L=A[h];x.set(F[0],F[1],F[2]),D(x,c.headPivot,0,L.headPitch),D(x,c.headPivot,1,L.headYaw),D(x,c.neckBase,0,L.neckPitch),D(x,c.neckBase,1,L.neckYaw);const G=Math.cos(L.heading),r=Math.sin(L.heading);return x.multiplyScalar(L.size),n.set(x.x*G+x.z*r+L.x,x.y+L.y,x.z*G-x.x*r+L.z)},setLight(h){h.sunDir&&m.uSunDir.value.copy(h.sunDir).normalize(),h.sunColor&&m.uSunCol.value.copy(h.sunColor),h.sky&&m.uSkyCol.value.copy(h.sky),h.ground&&m.uGroundCol.value.copy(h.ground)},update(h){m.uTime.value=h}}}const xe=8,Ut=`
attribute vec3 aUv; attribute vec4 iP, iQ, iR;
uniform float uTime, uWind, uFlat; uniform vec2 uWindDir; uniform vec4 uAnim[${xe}]; uniform vec4 uAnimS[${xe}]; uniform vec3 uBough;
varying vec3 vN, vWorld, vObj, vUv; varying vec4 vVar; varying float vGust, vBig;
#include <fog_pars_vertex>
${Pe}
void main(){
  float kind = aUv.z, sz = iP.w, cy = cos(iQ.x), sy = sin(iQ.x), ct = cos(iQ.y), st = sin(iQ.y);
  vec3 p = position * vec3(sz, sz * iR.z, sz), n = normal;
  p = vec3(p.x, p.y * ct - p.z * st, p.z * ct + p.y * st); n = vec3(n.x, n.y * ct - n.z * st, n.z * ct + n.y * st);
  p = vec3(p.x * cy + p.z * sy, p.y, p.z * cy - p.x * sy); n = vec3(n.x * cy + n.z * sy, n.y, n.z * cy - n.x * sy);
  if (kind < 0.5 && iR.w < 0.5) { float lmp = vn3(position * 2.7 + iQ.z) - 0.42; p += vec3(n.x, n.y * 0.6, n.z) * lmp * 0.3 * sz; }
  vec3 c = iP.xyz, w = c + p;
  float hgt = kind < 0.5 ? clamp(position.y + 0.25, 0., 1.2) : 1.;
  // wind: a slow roll of each crown, a flutter of its sprays, and gust fronts that lay it over
  vec2 gp = c.xz * 0.028 - uWindDir * uTime * 0.21;
  float gust = smoothstep(0.44, 0.66, vn3(vec3(gp, 0.3)) * 0.75 + vn3(vec3(gp * 2.7, 1.7)) * 0.25 + 0.14 * (uWind - 1.));
  float roll = sin(uTime * 1.25 + iQ.z + c.x * 0.21) + 0.5 * sin(uTime * 2.9 + iQ.z * 1.7 + c.z * 0.4);
  float flut = sin(uTime * (kind > 1.5 ? 9.0 : 5.5) + iQ.z * 7. + position.x * 9. + position.z * 7.) * (kind > 0.5 ? 1. : 0.25);
  vec2 push = uWindDir * (0.09 * roll + 0.34 * gust + 0.045 * flut) * uWind * hgt * (kind > 1.5 ? 0.55 : 1.) * (kind < 0.5 ? sz * 0.5 : 1.);
  w.xz += push; w.y -= 0.35 * dot(push, push);
  if (kind > 0.5) w.y += 0.035 * flut * uWind;
  // the animals: crowns part round the body and thrash in the wake
  float thr = 0., trough = 0.;
  if (kind < 1.5) {
    for (int i = 0; i < ${xe}; i++) {
      vec4 a = uAnim[i]; vec4 s = uAnimS[i];
      vec2 rel = c.xz - a.xy; float al = dot(rel, a.zw); vec2 lat = rel - a.zw * al; float ld = length(lat);
      float behind = max(-al - s.z, 0.), age = behind / max(s.x, 0.05), ahead = max(al - s.z - 1.5, 0.);
      float near = (1. - smoothstep(1.3, 3.8, ld)) * (1. - smoothstep(0., 2.5, ahead)) * s.y;
      float fresh = exp(-age * 0.9) * near;
      vec2 side = ld > 0.05 ? lat / ld : vec2(a.w, -a.z);
      float wob = sin(age * 6.5 + iQ.z * 3.) * exp(-age * 0.75) * smoothstep(0., 0.5, age) * near;
      float partK = fresh * (1. - smoothstep(0., 1.2, age));
      w.xz += side * (0.55 * partK + 0.75 * wob) * hgt; w.y -= (0.2 * partK + 0.3 * abs(wob)) * hgt;
      // the parted trough: crowns on the line are laid outward and down for 10 m behind a walker (a hole round a stander),
      // dark inside, with the crowns along its edges turned silver side up
      float tl = mix(1.6, 10.5, smoothstep(0.1, 0.8, s.x)), alongK = (1. - smoothstep(0.3, 2.2, ahead)) * (1. - smoothstep(tl * 0.45, tl, behind)) * s.y;
      float tk = (1. - smoothstep(0.9, 2.9, ld)) * alongK, edgeK = smoothstep(1.4, 2.6, ld) * (1. - smoothstep(3.0, 4.6, ld)) * alongK;
      w.xz += side * tk * 1.25 * hgt; w.y -= tk * 1.55 * hgt;
      trough = max(trough, tk); thr += fresh + abs(wob) + 0.9 * edgeK;
    }
  }
  w += uBough * iR.y * iR.y;
  vec4 world = modelMatrix * vec4(w, 1.);
  vWorld = world.xyz; vN = normalize(mat3(modelMatrix) * n + vec3(0., 1e-5, 0.)); vObj = position; vUv = aUv;
  vVar = vec4(iQ.w, iR.x, iQ.z, clamp(trough, 0., 1.)); vBig = kind < 0.5 ? iR.w : sz; vGust = clamp(gust * min(uWind, 1.3) * (1. - uFlat) + 0.5 * thr + uFlat * 0.8, 0., 1.);
  vec4 mvPosition = viewMatrix * world; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,_t=`
${Ee}
uniform vec3 uGold, uSilver, uGreen, uPoplar, uFrost; uniform float uFrostK, uUnder; uniform sampler2D uShade; uniform vec4 uShadeST;
varying vec3 vN, vWorld, vObj, vUv; varying vec4 vVar; varying float vGust, vBig;
#include <fog_pars_fragment>
${Pe}
void main(){
  float kind = vUv.z; vec3 toC = cameraPosition - vWorld; float dist = max(length(toC), 1e-3); vec3 V = toC / dist;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  float detail = 1. - smoothstep(90., 160., dist), cell = 0.5, ao = 1., a = 1.;
  if (kind < 0.5) {
    // dome: streaks of narrow leaves hanging outward, dark gaps between sprays, a ragged cut-out edge
    vec3 q = vObj * vec3(8.5, 3.1, 8.5) + vVar.z;
    float n1 = vn3(q), n2 = vn3(q * 2.9 + 5.), n3v = vn3(vObj * 2.1 + vVar.z * 3.), nh = vn3(vObj * vec3(53., 21., 53.) + vVar.z * 5.);
    float edge = 1. - abs(dot(N, V));
    if (vBig > 0.5) {                                   // the tall crowns of the old wood keep their leaf-noise shell
      float dB = 1. - smoothstep(260., 520., dist), c1 = vn3(vObj * 6.3 + vVar.z), c2 = vn3(vObj * 13. + vVar.z * 2.);
      cell = c1 * 0.6 + c2 * 0.4;
      a = cell + 0.5 - edge * 0.95 * dB * (0.55 + 0.9 * c1) - smoothstep(0.1, -0.3, vObj.y) * 0.6;
      ao = (0.3 + 0.7 * smoothstep(-0.3, 0.8, vObj.y)) * (0.5 + 0.8 * smoothstep(0.3, 0.7, cell)) * (0.82 + 0.18 * n3v);
      N = normalize(N + (vec3(c1, 0.5, c2) - 0.5) * 0.7 + vec3(0., 0.1, 0.));
    } else {
      // a willow crown is ONE soft mass: a few broad lobes of spray, a fine leaf grain inside its tone, a dark foot, and a
      // ragged cut only along its outline (never holes through the body: at a distance those are pixel noise)
      // the core of a willow crown: a shaded mass under its sprays. Tufts of spray (a lit crest, a dark gap), and within 25 m
      // the narrow hanging leaves as pale dashes; never a hole through the body (at a distance those are pixel noise)
      float nearK = 1. - smoothstep(26., 64., dist), leafK = 1. - smoothstep(9., 26., dist); vec3 lp = vObj * vec3(5.6, 3.6, 5.6) + vVar.z * 1.7;
      float tuf = vn3(lp) * 0.62 + vn3(lp * 2.4 + 3.1) * 0.38, gap = smoothstep(0.32, 0.6, tuf);
      float dash = smoothstep(0.42, 0.66, vn3(vObj * vec3(19., 6., 19.) + vVar.z * 5.)), grain = (nh - 0.5) * detail * nearK;
      cell = clamp(0.5 + (tuf - 0.5) * 0.5 + (dash - 0.4) * 0.5 * leafK + grain * 0.3, 0., 1.);
      float midK = 1. - smoothstep(12., 38., dist);
      a = min(1. - smoothstep(0.02, -0.2, vObj.y + (n1 - 0.5) * 0.3), mix(1., 0.5 + (tuf - 0.31 - 0.2 * midK * smoothstep(0.45, 0.9, edge)) * 6., nearK));        // gaps between tufts, a hand wide and more; ragged at the foot
      ao = (mix(0.16, 0.5, uUnder) + mix(0.84, 0.5, uUnder) * smoothstep(-0.2, 0.85, vObj.y)) * mix(mix(0.78, mix(0.62, 0.8, uUnder), nearK) - 0.2 * midK, 1.08 + 0.06 * midK, gap) * mix(1., 0.84 + 0.28 * dash, leafK) * (1. + 0.2 * grain);
      float closeK = 1. - smoothstep(4.5, 13., dist), l1 = vn3(vObj * vec3(41., 8., 41.) + vVar.z * 3.), l2 = vn3(vObj * vec3(17., 23., 17.) + vVar.z * 7.), leafy = smoothstep(0.38, 0.6, l1 * 0.7 + l2 * 0.3);
      float holeK = closeK * mix(smoothstep(0.3, -0.15, vObj.y), 1., uUnder);                          // from above a crown is a closed mass of leaves; from beside and below it is sprays with air between
      ao *= mix(1., mix(0.3 + 1.0 * leafy * (0.7 + 0.6 * l2), 0.5 + 0.8 * leafy, uUnder), closeK); cell = mix(cell, clamp(0.25 + 0.7 * l1, 0., 1.), closeK * 0.7);
      a = min(a, mix(1., 0.5 + (l1 * 0.55 + l2 * 0.2 + tuf * 0.45 - 0.56 + 0.3 * smoothstep(0.75, 0.2, edge)) * 7., holeK));
      a = min(a, mix(1., 0.5 + (l2 * 0.6 + tuf * 0.5 + l1 * 0.3 - 0.62) * 7., (1. - smoothstep(6., 24., dist)) * smoothstep(0.5, 0.85, edge)));
      { float t2 = vn3(lp * 1.7 + 9.3), hole2 = (1. - smoothstep(13., 40., dist)) * (1. - closeK) * mix(smoothstep(0.3, -0.15, vObj.y), 1., uUnder);
        a = min(a, mix(1., 0.5 + (tuf * 0.6 + t2 * 0.5 - 0.63 + 0.2 * smoothstep(0.75, 0.2, edge)) * 7., hole2)); ao *= mix(1., 0.62 + 0.62 * smoothstep(0.3, 0.7, t2), hole2); }
      N = normalize(N + (vec3(tuf, 0.5, n3v) - 0.5) * 0.5 + (vec3(n1, 0.5, n2) - 0.5) * 0.3 * detail * nearK + (vec3(l1, 0.5, l2) - 0.5) * 0.8 * closeK);
    }
    if (vBig > 0.5) { float cl = vn3(vObj * 2.6 + vVar.z), cl2 = vn3(vObj * 6.1 + vVar.z * 2.); ao *= 0.7 + 0.5 * cl; a -= smoothstep(0.42, 0.24, cl * 0.6 + cl2 * 0.4) * 0.9 + smoothstep(0.25, -0.15, vObj.y) * 0.5 * cl2; }
  } else if (kind < 1.5) {
    // willow spray: many small narrow leaves at their own angles on a card (a thin shoot of them when kind is 1.25)
    float whip = step(1.1, kind), aLeaf = -4.; vec2 gs = mix(vec2(4.6, 9.2), vec2(1.4, 11.), whip), g0 = vec2(vUv.x * gs.x, vUv.y * gs.y) + vVar.z * vec2(1.3, 2.1);
    cell = 0.5;
    for (int L = 0; L < 2; L++) {
      float fl = float(L); vec2 g = g0 * (1. + 0.31 * fl) + fl * vec2(3.7, 1.9), id = floor(g), f = fract(g) - 0.5;
      float hc = h11(id.x * 7.3 + id.y * 13.7 + fl * 31. + floor(vVar.z * 4.)), ang = (hc - 0.5) * 2.4 + sign(vUv.x) * 0.45;
      vec2 q = f - (vec2(h11(hc * 9.1), h11(hc * 5.3)) - 0.5) * 0.4; float ca = cos(ang), sa = sin(ang); q = vec2(q.x * ca - q.y * sa, q.x * sa + q.y * ca);
      float l = clamp(abs(q.y) / 0.46, 0., 1.), al = (0.125 * (1. - l * l) - abs(q.x)) * 14. + 0.5 - step(0.8, hc) * 9.;
      if (al > aLeaf) { aLeaf = al; cell = hc; }
    }
    float rim = max(abs(vUv.x), abs(vUv.y * 2. - 1.) * mix(1., 0.9, whip));
    aLeaf -= smoothstep(0.8, 1., rim) * 4.;
    float farS = smoothstep(9., 30., dist), tuft = vn3(vec3(vUv.xy * vec2(3.4, 6.8) * mix(1., 0.6, whip), vVar.z * 3.)) * 0.7 + 0.3 * vn3(vec3(vUv.xy * vec2(2., 4.), vVar.z));
    a = mix(aLeaf, 0.5 + (tuft - 0.26 - 0.5 * rim * rim - 0.2 * whip) * 6., farS); cell = mix(cell, tuft, farS);
    ao = (0.62 + 0.38 * smoothstep(0., 0.6, vUv.y)) * (0.78 + 0.44 * vn3(vec3(vUv.xy * vec2(7., 15.), vVar.z * 5.)));
    N = normalize(N + (vec3(cell, h11(cell * 3.), h11(cell * 7.)) - 0.5) * 0.7 * (1. - farS) + vec3(0., 0.35, 0.) * farS);
  } else {
    // poplar cluster: round leaves on long stalks, each turning on its own
    vec2 cuv = vec2(vUv.x * 0.5, vUv.y) * max(vBig, 0.3); float rim = length(vec2(vUv.x, vUv.y * 2. - 1.)), aLeaf = -4.; cell = 0.5;
    for (int L = 0; L < 2; L++) {
      float fl = float(L), cs = L == 0 ? 0.83 : 0.36, sn = L == 0 ? 0.56 : -0.93;
      vec2 g = vec2(cuv.x * cs - cuv.y * sn, cuv.x * sn + cuv.y * cs) * (L == 0 ? 8.2 : 6.6) + vVar.z * (1. + fl * 2.7); g.x += 0.5 * mod(floor(g.y), 2.);
      vec2 id = floor(g), f = fract(g) - 0.5; float hc = h11(id.x * 7.3 + id.y * 13.7 + vVar.z + fl * 31.);
      vec2 o = (vec2(h11(hc * 9.1), h11(hc * 5.3)) - 0.5) * 0.52;
      float r = length((f - o) * vec2(1., 1.15)), al = (0.25 + 0.2 * h11(hc * 3.7) - r) * 6. + 0.5 - step(0.8, hc) * 9.;
      if (al > aLeaf) { aLeaf = al; cell = hc; }
    }
    aLeaf -= smoothstep(0.78, 1., rim) * 3.;
    float far = smoothstep(14., 44., dist), tuft = vn3(vec3(cuv * 3.3, vVar.z * 3.)) * 0.6 + vn3(vec3(cuv * 9., vVar.z)) * 0.4;
    a = mix(aLeaf, 0.5 + (tuft - 0.34 - 0.4 * rim * rim) * 5., far); cell = mix(cell, tuft, far); ao = 0.7 + 0.3 * vUv.y;
    N = normalize(N + vec3(0., 0.5, 0.) + (vec3(cell, h11(cell * 3.), h11(cell * 7.)) - 0.5) * 1.3);
  }
  a -= (1. - smoothstep(1.3, 3.0, dist)) * (0.4 + 2.2 * h31(floor(vObj * 23.) + 0.5));
  if (a < 0.5) discard;
  // gold above, silver-sage beneath: gusts and wakes turn the leaves over; poplar leaves flicker even in still air
  float flick = kind > 1.5 ? smoothstep(0.55, 0.9, sin(uTime * (5. + 6. * cell) + cell * 40.) * 0.5 + 0.5) * 0.55
                           : smoothstep(0.62, 0.95, vn3(vec3(vWorld.xz * (kind < 0.5 ? 0.45 : 1.7), uTime * 1.6 + cell * 3.))) * (kind < 0.5 ? 0.28 : 0.5);
  float silver = clamp(vGust * (0.5 + 0.8 * cell) + flick * detail, 0., 1.) * (kind > 1.5 ? 0.4 : 0.92);
  vec3 base = kind > 1.5 ? mix(uPoplar, uGreen * 1.15, vVar.y) : mix(uGold, uGreen, vVar.y);
  float bigT = (kind < 0.5 && vBig > 0.5) ? 1. : 0.;
  base *= 1. + vVar.x * mix(0.22, 0.13, bigT) + (cell - 0.5) * 0.3 * max(detail, bigT); base.g *= 1. + vVar.x * mix(0.1, 0.02, bigT); base *= 1. - 0.12 * bigT;
  if (kind < 0.5 && vBig < 0.5) base *= mix(vec3(1.), mix(vec3(1.1, 0.8, 0.5), vec3(0.95, 1.05, 1.1), step(0., vVar.x)), abs(vVar.x) * 0.4);
  vec3 alb = mix(base, uSilver, silver * (kind > 1.5 ? 1. : kind < 0.5 ? 0.45 : 0.45));
  float lee0 = (kind < 1.5 ? 1. : 0.) * (1. - smoothstep(-0.05, 0.6, dot(N, uSunDir))); alb *= mix(vec3(1.), kind < 0.5 ? vec3(0.86, 0.8, 0.62) : vec3(0.7, 0.98, 0.95), lee0);   // the lee is olive-bronze, not maroon
  // a low sun from the side: each crown is lit on its sunward shoulder and falls to olive-bronze on its lee side and in the
  // troughs between crowns (its lower half stands in its neighbour's shadow)
  float ndl = dot(N, uSunDir), lit = smoothstep(-0.05, 0.6, ndl), bigK = (kind < 0.5 && vBig > 0.5) ? 1. : 0.;
  lit = mix(lit, smoothstep(-0.5, 0.55, ndl), bigK);   // the tall crowns of the old wood: a softer turn, so faces square to us are not black
  if (kind < 0.5) lit *= mix(1., smoothstep(-0.12, 0.5, vObj.y), 0.85 * (1. - vBig) * (1. - 0.7 * uUnder));
  if (kind > 1.5) lit = max(lit, 0.62 * smoothstep(-0.1, 0.7, abs(ndl)) + 0.12); else if (kind > 0.5) lit = lit * 0.72 + 0.26;
  // long shadows thrown across the canopy by the spires (a top-down map baked by the world; white when there is none)
  float shd = kind < 1.5 ? texture2D(uShade, vWorld.xz * uShadeST.xy + uShadeST.zw).r : 1.; lit *= shd;
  float back = clamp(dot(-V, uSunDir), 0., 1.);
  alb = mix(alb, uFrost, uFrostK * (1. - lit) * smoothstep(-0.1, 0.6, N.y));
  float wil = (kind < 1.5 ? 1. : 0.) * (1. - 0.75 * bigK), tro = vVar.w * wil * (1. - 0.6 * uUnder); ao *= 1. - 0.72 * tro; lit *= 1. - 0.6 * tro;
  if (!gl_FrontFacing && kind < 0.5 && vBig < 0.5) { ao *= 0.5; lit *= 0.2; }
  if (kind < 1.5 && bigK < 0.5) alb *= mix(vec3(0.84, 1.06, 0.9), vec3(1.), smoothstep(0.25, 0.75, ao * (0.4 + 0.6 * lit)));
  vec3 hemi = mix(uGroundCol * mix(0.75, kind < 0.5 ? 0.6 : 0.3, wil), uSkyCol * mix(1.12, kind < 0.5 ? 1.05 : 1.7, wil), clamp(N.y * 0.5 + 0.5, 0., 1.)) * mix(mix(0.72, 0.5, wil), 1., shd);
  vec3 col = alb * (uSunCol * lit * (0.55 + 0.6 * ao) + hemi * ao);
  col += alb * uSunCol * (0.13 + 0.12 * uUnder) * (1. - lit) * wil * (0.5 + 0.5 * ao);   // gold light thrown back by the sunlit leaves all round: a willow's lee is bronze, never a black hole
  // leaves between us and the sun glow with transmitted light, more saturated than lit ones
  col += base * vec3(1.15, 0.92, 0.5) * uSunCol * back * back * (1. - 0.6 * lit) * (0.35 + 0.4 * cell) * ao * mix(0.35, 1., shd);
  // seen from underneath (uUnder = 1 when the camera is below the canopy) the ceiling is stained-glass gold, never dark
  if (kind > 1.5) col *= mix(1., mix(1.12, 0.5, smoothstep(7.3, 5.9, vWorld.y)) * (0.72 + 0.56 * h11(floor(vVar.z * 9.))), uUnder);   // depth in the ceiling: the lower, nearer sprays a darker gold
  float under = uUnder * (kind > 1.5 ? 0.8 * mix(1.3, 0.42, smoothstep(7.3, 5.9, vWorld.y)) * (0.7 + 0.6 * h11(floor(vVar.z * 9.))) : smoothstep(0.45, -0.35, N.y));   // lower, nearer sprays darker against the bright ones above
  col += base * vec3(1.1, 0.88, 0.42) * uSunCol * under * (0.3 + 0.45 * cell) * (1. - 0.5 * lit);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function Ot(a){const o=new t.IcosahedronGeometry(1,1),e=o.attributes.position,u=[],l=[],f=[],p=(m,v,w)=>1+.2*Math.sin(m*3.1+1.3)*Math.sin(w*2.7+.4)+.14*Math.sin(v*4.3+m*2.2)+.1*Math.sin(w*5.9-v*3.1);for(let m=0;m<e.count;m++){let v=e.getX(m),w=e.getY(m),A=e.getZ(m);const x=p(v,w,A);v*=x,A*=x,w*=x,w<-.2&&(w=-.2+(w+.2)*.25);const D=Math.hypot(v,w*1.5+.25,A)||1;u.push(v,w,A),l.push(v/D,(w*1.5+.25)/D,A/D),f.push(0,0,0)}o.dispose();const c=[];for(let m=0;m<72;m++)c.push(a());let i=0;const d=(m,v)=>m+(v-m)*c[i++%72],b=(m,v,w,A,x,D,h,n=0,F=1)=>{const L=(N,U)=>[m.x+v.x*A*N+w.x*x*U,m.y+v.y*A*N+w.y*x*U,m.z+v.z*A*N+w.z*x*U],G=L(0,-1),r=L(0,1),V=L(1,1),W=L(1,-1);for(const[N,U,Q]of[[G,-1,n],[r,1,n],[V,1,F],[G,-1,n],[V,1,F],[W,-1,F]])u.push(...N),l.push(D.x,D.y,D.z),f.push(U,Q,h)},S=new t.Vector3(0,1,0),P=22,C=6;for(let m=0;m<P+C;m++){const v=m>=P,w=m*2.39996+d(-.3,.3),A=v?d(.55,1.3):Math.asin(fe(1-(m+.5)/P*.98,.02,.99))+d(-.1,.1),x=new t.Vector3(Math.cos(w)*Math.cos(A),Math.sin(A),Math.sin(w)*Math.cos(A)),D=p(x.x,x.y,x.z),h=new t.Vector3(-Math.sin(w),0,Math.cos(w)),n=d(-1.1,1.1),F=x.clone().multiplyScalar(1).addScaledVector(S,v?.5:.32).addScaledVector(h,d(-.5,.5)*(v?.5:.75)).normalize(),L=new t.Vector3().crossVectors(h,x).normalize(),G=h.clone().multiplyScalar(Math.cos(n)).addScaledVector(L,Math.sin(n)).addScaledVector(F,0);G.addScaledVector(F,-G.dot(F)).normalize();const r=x.clone().multiplyScalar(.75).addScaledVector(S,.45).normalize();if(v){const V=d(.5,.8),W=x.clone().multiplyScalar(D*.8),N=W.clone().addScaledVector(F,V*.5),U=F.clone().addScaledVector(x,.35).addScaledVector(S,-.4).normalize();b(W,F,G,V*.5,.055,r,1.25,0,.5),b(N,U,G,V*.5,.05,r,1.25,.5,1)}else b(x.clone().multiplyScalar(D*d(.62,.8)),F,G,d(.42,.58),d(.22,.31),r,1)}const M=new t.BufferGeometry;return M.setAttribute("position",new t.Float32BufferAttribute(u,3)),M.setAttribute("normal",new t.Float32BufferAttribute(l,3)),M.setAttribute("aUv",new t.Float32BufferAttribute(f,3)),M}function qt(){const a=[],o=[],e=[];for(const[l,f]of[[1,0],[.3,.95]]){const p=[[-1,0],[1,0],[1,1],[-1,0],[1,1],[-1,1]];for(const[c,i]of p)a.push(l*c*.5,i-.5,f*c*.5),o.push(-f,.3,l),e.push(c,i,2)}const u=new t.BufferGeometry;return u.setAttribute("position",new t.Float32BufferAttribute(a,3)),u.setAttribute("normal",new t.Float32BufferAttribute(o,3)),u.setAttribute("aUv",new t.Float32BufferAttribute(e,3)),u}function Vt(a,o){const e=new t.InstancedBufferGeometry,u=o.length;for(const c of Object.keys(a.attributes))e.setAttribute(c,a.attributes[c]);const l=new Float32Array(u*4),f=new Float32Array(u*4),p=new Float32Array(u*4);for(let c=0;c<u;c++)l.set(o[c].p,c*4),f.set(o[c].q,c*4),p.set(o[c].r,c*4);return e.setAttribute("iP",new t.InstancedBufferAttribute(l,4)),e.setAttribute("iQ",new t.InstancedBufferAttribute(f,4)),e.setAttribute("iR",new t.InstancedBufferAttribute(p,4)),e.instanceCount=u,e}const Et=`
attribute vec3 aW;   // height fraction 0..1, phase, bough t
uniform float uTime, uWind; uniform vec2 uWindDir; uniform vec3 uBough;
varying vec3 vCol, vN, vWorld, vObj;
#include <fog_pars_vertex>
${Pe}
void main(){
  vec3 w = position;
  vec2 gp = w.xz * 0.028 - uWindDir * uTime * 0.21;
  float gust = smoothstep(0.44, 0.66, vn3(vec3(gp, 0.3)) * 0.75 + vn3(vec3(gp * 2.7, 1.7)) * 0.25 + 0.14 * (uWind - 1.));
  float roll = sin(uTime * 1.25 + aW.y + w.x * 0.21) + 0.5 * sin(uTime * 2.9 + aW.y * 1.7 + w.z * 0.4);
  vec2 push = uWindDir * (0.09 * roll + 0.34 * gust) * uWind * aW.x * aW.x * 0.55;
  w.xz += push; w += uBough * aW.z * aW.z;
  vec4 world = modelMatrix * vec4(w, 1.);
  vWorld = world.xyz; vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.)); vCol = color; vObj = position;
  vec4 mvPosition = viewMatrix * world; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,It=`
${Ee}
varying vec3 vCol, vN, vWorld, vObj;
#include <fog_pars_fragment>
${Pe}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  // pale bark with dark diamond scars
  vec2 b = vec2(atan(N.z, N.x + 1e-4) * 1.6, vObj.y * 2.2); vec2 f = abs(fract(b + vec2(0.5 * floor(b.y), 0.)) - 0.5);
  float scar = smoothstep(0.16, 0.06, f.x * 0.6 + f.y) * step(0.45, h11(floor(b.y) * 3.7 + floor(b.x + 0.5 * floor(b.y))));
  vec3 alb = vCol * (0.8 + 0.4 * vn3(vObj * vec3(6., 1.5, 6.))) * (1. - 0.7 * scar);
  float lit = clamp((dot(N, uSunDir) + 0.2) / 1.2, 0., 1.);
  vec3 col = alb * (uSunCol * lit * 0.8 + mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5) + dot(uSunCol, vec3(0.3, 0.5, 0.2)) * 0.22);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Yt=`
attribute vec4 iS, iV;   // iS: start xyz, seed    iV: velocity xyz, mode
uniform float uTime, uWind, uBurst, uDensity; uniform vec2 uWindDir; uniform vec3 uBox, uCenter, uBurstPos;
varying vec2 vQ; varying vec3 vN, vWorld; varying float vSeed;
#include <fog_pars_vertex>
void main(){
  float seed = iS.w, mode = iV.w, size = 0.11 + 0.07 * fract(seed * 13.7), show = 1.;
  vec3 wind = vec3(uWindDir.x, 0., uWindDir.y) * 4.2 * uWind, c;
  if (mode < 0.5) {
    vec3 q = iS.xyz + (wind * (0.7 + 0.6 * fract(seed * 5.1)) + vec3(0., -0.45, 0.)) * uTime;
    q += vec3(sin(uTime * 1.3 + seed * 40.), 0.6 * sin(uTime * 2.1 + seed * 17.), cos(uTime * 1.1 + seed * 29.)) * 0.5;
    vec3 f = fract(q / (2. * uBox) + 0.5); c = uCenter + (f - 0.5) * 2. * uBox;
    vec3 e = min(f, 1. - f); show = smoothstep(0., 0.08, min(e.x, min(e.y * 2., e.z))) * step(fract(seed * 7.13), uDensity);
  } else {
    float a = uBurst - fract(seed * 3.3) * 0.35, k = 1. - exp(-max(a, 0.) * 1.5);
    c = uBurstPos + iS.xyz + iV.xyz * k / 1.5 + wind * max(a, 0.) * k + vec3(0., -0.75 * max(a, 0.) * k, 0.);
    c += vec3(sin(a * 3.1 + seed * 40.), 0.5 * sin(a * 4.3 + seed * 17.), cos(a * 2.7 + seed * 29.)) * 0.3 * k;
    show = step(0., a) * (1. - smoothstep(4.5, 6.5, a));
  }
  vec4 wc = modelMatrix * vec4(c, 1.);
  float dist = length(cameraPosition - wc.xyz); size = max(size, dist / 400.) * show * smoothstep(1.2, 3.5, dist);   // never a leaf filling the lens
  float A = uTime * (2.5 + 4. * fract(seed * 9.7)) + seed * 60.;
  vec3 e1 = normalize(vec3(cos(A), 0.55 * sin(A), sin(A) * 0.8) + vec3(1e-4, 0., 0.));
  vec3 e2 = normalize(cross(e1, vec3(sin(seed * 9.) * 0.6, 0.9, cos(seed * 9.) * 0.6)) + vec3(0., 1e-4, 0.));
  vec3 w = wc.xyz + (e1 * position.x + e2 * position.y) * size;
  vQ = position.xy * 2.; vN = normalize(cross(e1, e2) + vec3(0., 1e-4, 0.)); vWorld = w; vSeed = seed;
  vec4 mvPosition = viewMatrix * vec4(w, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ht=`
${Ee}
uniform vec3 uGold, uPoplar;
varying vec2 vQ; varying vec3 vN, vWorld; varying float vSeed;
#include <fog_pars_fragment>
void main(){
  float r = vQ.x * vQ.x + vQ.y * vQ.y * (1.6 + 1.2 * step(0.5, fract(vSeed * 3.7)));   // round poplar leaves and narrow willow ones
  if (r > 1.) discard;
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.)); vec3 N = vN;
  float ndl = abs(dot(N, uSunDir)), back = clamp(dot(-V, uSunDir), 0., 1.);
  vec3 alb = mix(uGold, uPoplar, fract(vSeed * 11.3)) * (0.8 + 0.4 * fract(vSeed * 23.1));
  vec3 col = alb * (uSunCol * (0.25 + 0.75 * ndl) + mix(uGroundCol, uSkyCol, 0.6)) + alb * vec3(1.15, 0.92, 0.5) * uSunCol * back * back * 0.7;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function ct(a,o,e,u,l,f,p,c){const i=new t.Vector3,d=new t.Vector3,b=new t.Vector3,S=o.length,P=a.p.length/3;for(let C=0;C<S;C++){const M=o[C],m=o[Math.max(0,C-1)],v=o[Math.min(S-1,C+1)],w=C/(S-1),A=H(e,u,w);i.set(v[0]-m[0],v[1]-m[1],v[2]-m[2]).normalize(),d.set(1,0,.01),d.addScaledVector(i,-d.dot(i)).normalize(),b.crossVectors(i,d);const x=c(M,w);for(let D=0;D<l;D++){const h=D/l*Le,n=Math.cos(h),F=Math.sin(h);a.p.push(M[0]+(d.x*n+b.x*F)*A,M[1]+(d.y*n+b.y*F)*A,M[2]+(d.z*n+b.z*F)*A),a.n.push(d.x*n+b.x*F,d.y*n+b.y*F,d.z*n+b.z*F),a.c.push(H(f.r,p.r,w),H(f.g,p.g,w),H(f.b,p.b,w)),a.w.push(x[0],x[1],x[2])}}for(let C=0;C<S-1;C++)for(let M=0;M<l;M++){const m=P+C*l+M,v=P+C*l+(M+1)%l,w=m+l,A=v+l;a.i.push(m,w,v,v,w,A)}}const At={gold:{green:0,frost:0,bare:0},early:{green:.5,frost:0,bare:0},frost:{green:0,frost:.65,bare:.5}},Qt={steady:1,calm:.3,blow:1.75},Ie=.72,Ne=a=>fe((a-.25)/.75,0,1),ce={rest:[0,0,0,0],reach:[.15,.12,.5,.06],drag:[.15,-.3,.06,-.2],chew:[.12,-.04,-.1,-.3]};async function Zt(a,o={}){const e=a.rng,u=o.palette||qe,l=0,f=async()=>{a.yield&&await a.yield()},p=fe(o.detail??(a.quality&&a.quality.detail)??1,.6,1),c=e(),i=e(),d=e(),b=o.season||(c<.24?"early":c<.38?"frost":"gold"),S=At[b]||At.gold,P=o.wind||(i<.6?"steady":i<.8?"calm":"blow"),C=typeof o.wind=="number"?o.wind:Qt[P]||1,M=o.blizzard??d<.1,m=o.windDir?new t.Vector2(o.windDir[0],o.windDir[1]).normalize():new t.Vector2(-.78,-.62).normalize(),v=new t.Group;v.name="treetop-giants-hero",o.yaw&&(v.rotation.y=o.yaw);const w=te(u[0]).multiplyScalar(.86),A=me(te(u[3]),te("#9fa587"),.45).multiplyScalar(.66),x=me(te("#6E7B3A"),te("#7F9A3C"),.45).multiplyScalar(.72),D=te("#EBC24E").multiplyScalar(.86),h=Ct(),n={uTime:h.uTime,uSunDir:h.uSunDir,uSunCol:h.uSunCol,uSkyCol:h.uSkyCol,uGroundCol:h.uGroundCol,uWind:{value:C},uWindDir:{value:m},uBough:{value:new t.Vector3}},F=()=>t.UniformsUtils.clone(t.UniformsLib.fog),L=o.herd===!1?0:fe(o.herdCount??e.int(4,6),0,xe-1),G=L>=2?Math.min(2,L-1):0,r=1+L-G;await Mt(a,"adult",u),G&&await Mt(a,"half",u);const V=lt(a,{age:"adult",count:r,palette:u});await f();const W=G?lt(a,{age:"half",count:G,palette:u}):null;await f();const N=W?[V,W]:[V];for(const s of N)Object.assign(s.uniforms,{uTime:n.uTime,uSunDir:n.uSunDir,uSunCol:n.uSunCol,uSkyCol:n.uSkyCol,uGroundCol:n.uGroundCol}),v.add(s.mesh);const U=V.state[0];Object.assign(U,{x:0,y:0,z:0,heading:0,walk:0,seed:e.range(0,9),chew:.2});const Q=[];for(let s=0;s<L;s++){const z=s>=L-G,K=z?W:V,B=z?s-(L-G):s+1,E=e.range(-.55,.55),ee=19+s*(30/Math.max(1,L-1))*.9+e.range(-2,2),$=s%2===0,ne=Math.sin(E)*ee+(s%2?5:-4),I=-Math.cos(E)*ee-4,T=e.range(15,24),j=e.chance(.5)?1:-1,ie=e.range(-.6,.6),de=e.range(.85,1.15)*1.5,R=e.range(0,9),_=e.range(.94,1.04),Z={herd:K,i:B,walker:$,px:ne,pz:I,R:T,dir:j,hd:ie,sp:de,seed:R,cx:ne-Math.cos(ie)*T*j,cz:I+Math.sin(ie)*T*j,feedT:e.range(0,20),len:z?2.3:3.3};Object.assign(K.state[B],{x:ne,z:I,heading:ie,seed:R,size:_,walk:$?1:0,chew:$?.25:1}),Q.push(Z)}const X=o.calf&&Q.length?lt(a,{age:"calf",count:1,palette:u}):null;X&&(Object.assign(X.uniforms,{uTime:n.uTime,uSunDir:n.uSunDir,uSunCol:n.uSunCol,uSkyCol:n.uSkyCol,uGroundCol:n.uGroundCol}),v.add(X.mesh),N.push(X));for(const s of N)s.commit();const re=(()=>{const s={...U};Object.assign(U,{neckPitch:ce.reach[0],neckYaw:ce.reach[1],headPitch:ce.reach[2],headYaw:ce.reach[3]});const z=V.lipPoint(0);return Object.assign(U,s),z})(),J=[re.x+.55,0,re.z+1.5],oe=[J[0]+(re.x-J[0])/Ie,re.y/Ie,J[2]+(re.z-J[2])/Ie],le=re.clone(),g={p:[],n:[],c:[],w:[],i:[]},k=[],y=te(u[3]).multiplyScalar(.62),q=te("#8a7a52").multiplyScalar(.6),O=te("#6e5a34").multiplyScalar(.55),Y=[],ae=(s,z,K,B,E)=>{const ee=e.range(0,6.28),$=z[1],ne=8,I=[],T=[e.range(-.25,.25),e.range(-.25,.25)];for(let R=0;R<=ne;R++){const _=R/ne,Z=Math.sin(_*Math.PI)*(K?0:1);I.push([H(s[0],z[0],_)+T[0]*Z,$*_,H(s[2],z[2],_)+T[1]*Z])}const j=R=>{const _=Math.sin(R*Math.PI)*(K?0:1);return[H(s[0],z[0],R)+T[0]*_,$*R,H(s[2],z[2],R)+T[1]*_]};ct(g,I,.055+$*.004,.012,5,y,q,(R,_)=>[_,ee,K?Ne(_):0]),Y.push([s[0],s[2],.9]);const ie=(R,_,Z)=>{e()<S.bare*(K?.3:1)||k.push({p:[R[0],R[1],R[2],Z*e.range(.8,1.25)],q:[e.range(0,6.28),e.range(-.5,.5),ee,B+e.range(-.35,.35)],r:[E,K?Ne(_):0,1,_]})},de=Math.round($*e.range(1,1.3));for(let R=0;R<de;R++){const _=H(.3,.94,(R+e())/de),Z=j(_),he=R*2.4+e.range(-.5,.5),ue=(1.7*(1-_)+.4)*e.range(.8,1.2),ke=e.range(1,1.3),ye=[Math.cos(he)*Math.cos(ke),Math.sin(ke),Math.sin(he)*Math.cos(ke)],pe=[Z,[Z[0]+ye[0]*ue*.5,Z[1]+ye[1]*ue*.5+.06*ue,Z[2]+ye[2]*ue*.5],[Z[0]+ye[0]*ue*.85,Z[1]+ye[1]*ue+.1,Z[2]+ye[2]*ue*.85]];ct(g,pe,.022,.008,3,y,q,()=>[_,ee,K?Ne(_):0]);const Rt=Math.round(H(4,7,1-_)*(K?1.25:1));for(let xt=0;xt<Rt;xt++){const Oe=e.range(.25,1.05),Se=Oe<.5?0:1,st=Oe<.5?Oe*2:Math.min(1,Oe*2-1);ie([H(pe[Se][0],pe[Se+1][0],st)+e.range(-.25,.25),H(pe[Se][1],pe[Se+1][1],st)+e.range(-.2,.3),H(pe[Se][2],pe[Se+1][2],st)+e.range(-.25,.25)],_,.95)}}for(let R=.42;R<1;R+=.035){const _=j(R);ie([_[0]+e.range(-.3,.3)*(1-R),_[1]+e.range(-.1,.1),_[2]+e.range(-.3,.3)*(1-R)],R,H(1,.7,R))}};ae(J,oe,!0,.1,0);const ve=[[J[0]+2.4,J[2]+1.6,e.int(7,11),1],[23+e.range(0,6)*.83,17+e.range(0,10)*.5,e.int(5,8),.9],[e.range(-29,-23),e.range(-8,6),e.int(5,9),.95]];for(const[s,z,K,B]of ve){const E=e.chance(.3)?-.5:.1;for(let ee=0;ee<K;ee++){const $=ee/K*Le+e.range(-.3,.3),ne=Math.sqrt(e())*2.3+.35,I=e.range(9,12.2)*B,T=s+Math.cos($)*ne,j=z+Math.sin($)*ne;ae([T,0,j],[T+Math.cos($)*ne*.18+e.range(-.3,.3),I,j+Math.sin($)*ne*.18+e.range(-.3,.3)],!1,E+e.range(-.2,.2),e.chance(.12)?.6:0)}await f()}const Ye=[],we=o.willowRadius??34,Ke=3;if(o.willow!==!1)for(let s=-we;s<=we;s+=Ke*.866)for(let z=-we;z<=we;z+=Ke){const K=Math.round(s/(Ke*.866)),B=z+(K&1)*Ke*.5+e.range(-.8,.8),E=s+e.range(-.8,.8),ee=Math.hypot(B,E),$=e.range(1.75,2.4),ne=e.range(.6,.85),I=e.range(3.6,4.5),T=e(),j=e.range(0,6.28),ie=e.range(-1,1),de=e(),R=e.range(0,6.28);if(ee>we||T>(1-se(we-7,we,ee))*(ee>18?p:1)+.02||Y.some(([Z,he,ue])=>Math.hypot(B-Z,E-he)<ue))continue;const _=de<.035?1:de<.035+S.green?e.range(.5,.9):0;if(Ye.push({p:[B,I-$*ne,E,$],q:[R,0,j,ie],r:[_,0,ne,0]}),ee<15)for(let Z=0;Z<5;Z++){const he=Z*1.257+j,ue=$*e.range(.35,.75),ke=I-$*ne*e.range(.3,.9);ct(g,[[B+Math.cos(he)*.15,0,E+Math.sin(he)*.15],[B+Math.cos(he)*ue*.45,ke*.55,E+Math.sin(he)*ue*.45],[B+Math.cos(he)*ue,ke,E+Math.sin(he)*ue]],.04,.014,3,O,q,(ye,pe)=>[pe*.6,j,0])}}await f();const He=new t.DataTexture(new Uint8Array([255,255,255,255]),1,1,t.RGBAFormat);He.needsUpdate=!0;const Ce={...F(),...n,uFlat:{value:P==="blow"?.35:0},uAnim:{value:Array.from({length:xe},()=>new t.Vector4(0,0,0,1))},uAnimS:{value:Array.from({length:xe},()=>new t.Vector4(1,0,3,0))},uGold:{value:w},uSilver:{value:A},uGreen:{value:x},uPoplar:{value:D},uFrost:{value:te("#dfe6ea").multiplyScalar(.8)},uFrostK:{value:S.frost},uUnder:{value:0},uShade:{value:He},uShadeST:{value:new t.Vector4(0,0,0,0)}},Qe=new t.ShaderMaterial({uniforms:Ce,vertexShader:Ut,fragmentShader:_t,side:t.DoubleSide,fog:!0}),ut=Ot(e),dt=qt(),Re=new t.Mesh(Vt(ut,Ye),Qe),Fe=new t.Mesh(Vt(dt,k),Qe);Re.name="willow",Fe.name="poplar-leaves",Re.frustumCulled=Fe.frustumCulled=!1,v.add(Re,Fe),await f();const ze=new t.BufferGeometry;ze.setAttribute("position",new t.Float32BufferAttribute(g.p,3)),ze.setAttribute("normal",new t.Float32BufferAttribute(g.n,3)),ze.setAttribute("color",new t.Float32BufferAttribute(g.c,3)),ze.setAttribute("aW",new t.Float32BufferAttribute(g.w,3)),ze.setIndex(g.i);const ht=new t.ShaderMaterial({uniforms:{...F(),...n},vertexShader:Et,fragmentShader:It,vertexColors:!0,side:t.DoubleSide,fog:!0}),Te=new t.Mesh(ze,ht);Te.name="wood",Te.frustumCulled=!1,v.add(Te),await f();const Ve=(()=>{const s={...U};Object.assign(U,{neckPitch:ce.drag[0],neckYaw:ce.drag[1],headPitch:ce.drag[2],headYaw:ce.drag[3]});const z=V.lipPoint(0);return Object.assign(U,s),z})(),Ae=Ve.clone().sub(le),Be=Ne(Ie),Xe=Ae.clone().multiplyScalar(-1).normalize(),ft=Math.round(1300*p),Bt=300,je=ft+Bt,$e=new Float32Array(je*4),Ze=new Float32Array(je*4),ge=new t.Vector3(24,3.6,24);for(let s=0;s<je;s++){if(s<ft){$e.set([e.range(-ge.x,ge.x),e.range(-ge.y,ge.y),e.range(-ge.z,ge.z),e()],s*4),Ze.set([0,0,0,0],s*4);continue}const z=e.range(.5,1),K=Ne(z)/Be,B=e.range(4,9.5)*K;$e.set([H(J[0],oe[0],z)+Ae.x*K*K-Ve.x+e.range(-.5,.5),oe[1]*z+Ae.y*K*K-Ve.y+e.range(-.4,.4),H(J[2],oe[2],z)+Ae.z*K*K-Ve.z+e.range(-.5,.5),e()],s*4),Ze.set([Xe.x*B+e.range(-2,2),Xe.y*B+e.range(.5,3),Xe.z*B+e.range(-2,2),1],s*4)}const De=new t.InstancedBufferGeometry;De.setAttribute("position",new t.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,-.5,0,.5,.5,0,-.5,.5,0],3)),De.setAttribute("iS",new t.InstancedBufferAttribute($e,4)),De.setAttribute("iV",new t.InstancedBufferAttribute(Ze,4)),De.instanceCount=je;const Je={...F(),...n,uBurst:{value:-1},uDensity:{value:M?1:.4},uBox:{value:ge},uCenter:{value:new t.Vector3(0,7.6,0)},uBurstPos:{value:Ve.clone()},uGold:{value:w},uPoplar:{value:D}},We=new t.Mesh(De,new t.ShaderMaterial({uniforms:Je,vertexShader:Yt,fragmentShader:Ht,side:t.DoubleSide,fog:!0}));We.name="leaves-in-air",We.frustumCulled=!1,v.add(We),await f();let vt=null;o.progress!==void 0&&(vt=o.progress);const et=o.cycleSeconds||8,pt=[.24,0,-.06,0],Ge=(s,z,K)=>s.map((B,E)=>H(B,z[E],K)),Dt=s=>s<.22?Ge(pt,ce.reach,se(0,.22,s)):s<.32?ce.reach:s<.58?Ge(ce.reach,ce.drag,se(.32,.58,s)):s<.68?Ge(ce.drag,ce.chew,se(.58,.68,s)):Ge(ce.chew,pt,se(.88,1,s));for(const s of Q)s.walker&&(s.cz=Math.min(s.cz,-19-s.R),s.th0=Math.atan2(-Math.sin(s.hd)*s.dir,Math.cos(s.hd)*s.dir));const tt=new t.Vector3(0,V.rig.headPivot[1]+.1,V.rig.headPivot[2]+.6),Lt={leaderHead:tt.clone(),withers:new t.Vector3(0,4.8,1.3),bough:le.clone(),clump:new t.Vector3(ve[0][0],0,ve[0][1]),clumps:ve.map(s=>new t.Vector3(s[0],0,s[1])),viewpoints:{approach:new t.Vector3(-9.5,7,46),closePass:new t.Vector3(-8.2,8,2.5),behind:new t.Vector3(-4.5,8,-9)},flyThrough:[[-10.5,6.5,52],[-9.5,7.4,28],[-8.6,8,12],[-8.2,8,2.5],[-7,8,-4],[-3.5,8,-9.5],[3,7.8,-12],[14,7,-10.5],[30,6.5,-6]].map(s=>new t.Vector3(...s)),exitDir:new t.Vector3(.95,-.03,.3).normalize(),sunSide:new t.Vector3(-1,0,0),windDir:new t.Vector3(m.x,0,m.y),extent:{center:new t.Vector3(0,4,-8),radius:we+4,top:12.5},herd:Q.map(s=>new t.Vector3(s.px,0,s.pz)),portalSeat:null};let ot=vt,at=!1,mt=0;const Ue=new t.Vector3,wt=new t.Vector3,_e=new t.Vector3,gt=new t.Vector3,yt=new t.Vector3,Nt=s=>{for(const z of N)z.setLight(s);at=!0};o.sunDir&&n.uSunDir.value.set(o.sunDir[0],o.sunDir[1],o.sunDir[2]).normalize();const Kt=()=>{let s=v;for(;s.parent;)s=s.parent;if(s===v)return;let z=null,K=null;s.traverse(E=>{E.isDirectionalLight&&!z&&(z=E),E.isHemisphereLight&&!K&&(K=E)}),z&&(z.getWorldPosition(gt),z.target.getWorldPosition(yt),o.sunDir||n.uSunDir.value.copy(gt.sub(yt)).normalize(),n.uSunCol.value.copy(z.color).multiplyScalar(z.intensity/Math.PI)),K&&(n.uSkyCol.value.copy(K.color).multiplyScalar(K.intensity/Math.PI),n.uGroundCol.value.copy(K.groundColor).multiplyScalar(.6*K.intensity/Math.PI));const B=n.uSunCol.value;n.uGroundCol.value.r+=w.r*B.r*.2,n.uGroundCol.value.g+=w.g*B.g*.2,n.uGroundCol.value.b+=w.b*B.b*.2,at=!0},nt=(s,z,K,B,E,ee,$)=>{Ce.uAnim.value[s].set(z,K,Math.sin(B),Math.cos(B)),Ce.uAnimS.value[s].set(E,ee,$,0)};function bt(s,z,K){!at&&o.adoptLight!==!1&&Kt(),n.uTime.value=z;const B=ot===null?((z/et-.1)%1+1)%1:fe(ot,0,.9999);mt=B;const E=Dt(B),ee=se(.6,.72,B)*(1-se(.9,1,B));let $=0;if(K){Ue.setFromMatrixPosition(K.matrixWorld),v.worldToLocal(Ue);const I=Math.atan2(Ue.x-tt.x,Ue.z-tt.z);$=fe(I,-1.3,1.3)*(1-se(2.7,3.05,Math.abs(I)))}U.neckPitch=E[0],U.neckYaw=E[1]+$*.2*ee,U.headPitch=E[2],U.headYaw=E[3]*(1-ee)+$*.55*ee,U.lip=se(.2,.3,B)*(1-se(.57,.6,B)),U.chew=B>.6?1:B<.2?.5:.1,U.ears=.7*se(.3,.5,B)*(1-se(.58,.7,B));const ne=(B-.58)*et;B>=.3&&B<.58?(V.lipPoint(0,wt),_e.copy(wt).sub(le).multiplyScalar(1/(Be*Be))):B>=.58?_e.copy(Ae).multiplyScalar(Math.exp(-1.7*ne)*Math.cos(8.5*ne)/(Be*Be)):_e.set(0,0,0),n.uBough.value.copy(_e),Je.uBurst.value=B>=.58?ne:-1,nt(0,0,0,0,.05,1,3.3);for(let I=0;I<Q.length;I++){const T=Q[I],j=T.herd.state[T.i];if(T.walker){const ie=T.sp*z,de=T.th0+T.dir*ie/T.R;if(j.x=T.cx+T.R*Math.cos(de),j.z=T.cz+T.R*Math.sin(de),j.heading=Math.atan2(-Math.sin(de)*T.dir,Math.cos(de)*T.dir),j.phase=ie/T.herd.stride,j.neckPitch=.04+.05*Math.sin(z*.17+T.feedT),j.headYaw=.25*Math.sin(z*.11+T.seed),nt(I+1,j.x,j.z,j.heading,T.sp,1,T.len),X&&I===0){const R=X.state[0],_=Math.cos(j.heading),Z=Math.sin(j.heading);R.x=j.x+_*2.1+Z*.9,R.z=j.z-Z*2.1+_*.9,R.heading=j.heading,R.walk=1,R.phase=ie/X.stride,R.chew=.1}}else{const ie=se(.1,.8,Math.sin(z*.21+T.feedT));j.neckPitch=.1+.3*ie,j.headPitch=.2*ie,j.neckYaw=.2*Math.sin(z*.09+T.seed*3),j.headYaw=.3*Math.sin(z*.13+T.feedT*2),j.lip=ie,nt(I+1,j.x,j.z,j.heading,.05,.9,T.len)}}for(let I=Q.length+1;I<xe;I++)Ce.uAnimS.value[I].y=0;for(const I of N)I.commit()}return bt(0,0,null),{object:v,radius:2,height:7,center:new t.Vector3(0,5.6,1.5),anchors:Lt,update:bt,dispose(){He.dispose()},ground:!0,groundY:0,setProgress(s){ot=s??null},get feedPhase(){return mt},cycleSeconds:et,setLight:Nt,headPosition(s=new t.Vector3){return V.lipPoint(0,s,[0,V.rig.headPivot[1]+.1,V.rig.headPivot[2]+.6])},herds:{adults:V,halves:W},uniforms:{shared:n,leaf:Ce,air:Je},kit:{leafMat:Qe,woodMat:ht,crownBase:ut,cardBase:dt,crownMesh:Re,cardMesh:Fe,wood:Te,air:We,cGold:w,cSilver:A,cGreen:x,cPoplar:D,seasonDef:S,windK:C},season:b,wind:P,blizzard:M,stats:{crowns:Ye.length,cards:k.length,animals:1+L}}}export{Pe as GLSL_NOISE,Ee as LIGHT_PARS,Zt as buildHero,qt as clusterGeometry,Ot as crownGeometry,Vt as instanced,lt as makeParaceratherium,kt as paraceratheriumGeometry,Mt as prepareParaceratherium,ct as pushTube};
