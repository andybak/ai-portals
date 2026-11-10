import*as a from"three";import{makeNoise as Ie}from"../kit/core.js";const Be=["#F4E6CF","#E6C48E","#D9963F","#C25A34","#8E3529","#5A2530","#4B3048"],ze=["sky","sand","ochre","red","oxblood","maroon","dusk"],Tt=16.5*Math.PI/180,Zt=108*Math.PI/180,yt=new a.Vector3(Math.cos(Tt)*Math.sin(Zt),Math.sin(Tt),-Math.cos(Tt)*Math.cos(Zt)).normalize(),zt=.62,gt=19,Ct=24,Et=36,Ut=14,Ce=15,Ee=16,Ne=17,Fe=24,me=30,Nt=20,Jt=60,xe=[[3,"red"],[1.5,"maroon"],[6,"oxblood"],[3,"red"],[1.5,"ochre"],[9,"red"],[3,"oxblood"],[1.5,"maroon"],[6,"red"],[3,"ochre"],[9,"oxblood"],[1.5,"maroon"],[6,"red"],[3,"oxblood"],[1.5,"ochre"],[9,"red"],[6,"oxblood"]],Pe=430,te=-52,ee=384,$t=(y,z)=>[y-te,-(z-ee)],oe=`
uniform vec3 uSun;
uniform vec4 uRingA[${gt}]; uniform vec4 uRingB[${gt}]; uniform vec4 uRingC[${gt}];
uniform vec4 uCylA[${Ct}]; uniform vec4 uCylB[${Ct}];
uniform vec4 uBoxC[${Et}]; uniform vec4 uBoxH[${Et}];
uniform vec3 uGapA; uniform vec3 uGapB;
// A: centre, outer radius (0 = unused). B: unit axis, hole radius. C: half-space normal in the ring's plane (zero = whole ring), half thickness.
// tm: where the ray's stretch inside the ring has its middle (metres along the ray), for the gap of ring ${Ut}.
bool castRing(vec3 P, vec4 A, vec4 B, vec4 C, out float tm) {
  tm = 0.;
  if (A.w <= 0.) return false;
  vec3 a = B.xyz, o = P - A.xyz;
  float d0 = dot(o, a), d1 = dot(uSun, a);
  float sd = abs(d1) < 1e-4 ? 1e-4 : d1;
  float ta = (-C.w - d0) / sd, tb = (C.w - d0) / sd;
  float lo = max(min(ta, tb), 0.02), hi = max(ta, tb);
  vec3 q0 = o - a * d0, q1 = uSun - a * d1;
  float qa = max(dot(q1, q1), 1e-5), qb = dot(q0, q1), qq = dot(q0, q0);
  float D = qb * qb - qa * (qq - A.w * A.w);
  if (D <= 0.) return false;
  float s = sqrt(D);
  lo = max(lo, (-qb - s) / qa); hi = min(hi, (-qb + s) / qa);
  if (dot(C.xyz, C.xyz) > 0.5) {
    float n0 = dot(o, C.xyz), n1 = dot(uSun, C.xyz);
    if (abs(n1) < 1e-4) { if (n0 < 0.) return false; }
    else { float tc = -n0 / n1; if (n1 > 0.) lo = max(lo, tc); else hi = min(hi, tc); }
  }
  if (hi <= lo) return false;
  float Di = qb * qb - qa * (qq - B.w * B.w);
  if (Di > 0.) { float si = sqrt(Di); if ((-qb - si) / qa <= lo && (-qb + si) / qa >= hi) return false; }
  tm = 0.5 * (lo + hi);
  return true;
}
// Upright cone frustum. A: centre x, centre z, y0, y1. B: radius at y0 (0 = unused), radius at y1.
bool castCyl(vec3 P, vec4 A, vec4 B) {
  if (B.x <= 0.) return false;
  float k = (B.y - B.x) / max(A.w - A.z, 1e-3);
  vec2 o = P.xz - A.xy, s = uSun.xz;
  float r = B.x + k * (P.y - A.z), rs = k * uSun.y;
  float qa = dot(s, s) - rs * rs, qb = dot(o, s) - r * rs, qc = dot(o, o) - r * r;
  if (qa < 1e-4) return false;
  float D = qb * qb - qa * qc;
  if (D <= 0.) return false;
  float sq = sqrt(D), sy = max(uSun.y, 1e-3);
  float lo = max(max((-qb - sq) / qa, 0.02), (A.z - P.y) / sy);
  float hi = min((-qb + sq) / qa, (A.w - P.y) / sy);
  return hi > lo;
}
// Upright box, turned about the vertical. C: centre, cosine of the turn. H: half sizes (x <= 0 = unused), sine of the turn.
bool castBox(vec3 P, vec4 C, vec4 H) {
  if (H.x <= 0.) return false;
  vec3 o = C.xyz - P;
  vec3 ol = vec3(o.x * C.w - o.z * H.w, o.y, o.x * H.w + o.z * C.w);
  vec3 sl = vec3(uSun.x * C.w - uSun.z * H.w, uSun.y, uSun.x * H.w + uSun.z * C.w);
  vec3 sdir = vec3(abs(sl.x) < 1e-4 ? 1e-4 : sl.x, abs(sl.y) < 1e-4 ? 1e-4 : sl.y, abs(sl.z) < 1e-4 ? 1e-4 : sl.z);
  vec3 t0 = (ol - H.xyz) / sdir, t1 = (ol + H.xyz) / sdir;
  vec3 mn = min(t0, t1), mx = max(t0, t1);
  float lo = max(max(mn.x, mn.y), max(mn.z, 0.02)), hi = min(mx.x, min(mx.y, mx.z));
  return hi > lo;
}
// self: 0..${gt-1} a ring, ${Nt}.. a cone, ${Jt}.. a box; a body never tests its own cast (its own faces are told by their normals).
// A body of three boxes carries the id of its first box and skips all three; the body of six (from box ${me}) likewise skips all six.
bool inShadow(vec3 P, int self) {
  for (int i = 0; i < ${gt}; i++) {
    float tm;
    if (i != self && castRing(P, uRingA[i], uRingB[i], uRingC[i], tm)) {
      // ring ${Ut} has a piece broken out of it: the wedge on the far side of both uGapA and uGapB throws nothing
      if (i == ${Ut}) { vec3 m = P + uSun * tm - uRingA[i].xyz; if (dot(m, uGapA) < 0. && dot(m, uGapB) < 0.) continue; }
      return true;
    }
  }
  for (int i = 0; i < ${Ct}; i++) { if (i + ${Nt} != self && castCyl(P, uCylA[i], uCylB[i])) return true; }
  int b = self - ${Jt};
  for (int i = 0; i < ${Et}; i++) {
    bool own = i == b || (b >= 0 && b < ${Fe} && i > b && i < b + 3) || (b == ${me} && i > b);
    if (!own && castBox(P, uBoxC[i], uBoxH[i])) return true;
  }
  return false;
}`,Vt=`
attribute vec3 aInk; attribute vec2 aId;
varying vec3 vW; varying vec3 vN; varying vec3 vInk; varying vec2 vId;
void main() {
  vec4 p = vec4(position, 1.); vec3 n = normal;
  #ifdef USE_INSTANCING
  p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
  #endif
  vec4 w = modelMatrix * p;
  vW = w.xyz; vN = mat3(modelMatrix) * n; vInk = aInk; vId = aId;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,ge=`
uniform vec3 uDusk;
varying vec3 vW; varying vec3 vN; varying vec3 vInk; varying vec2 vId;
#ifndef PLAIN
${oe}
#endif
void main() {
  vec3 col = vInk;
  #ifndef PLAIN
  bool sh = vId.y > 0.5 || dot(vN, uSun) <= 0.;
  if (!sh) sh = inShadow(vW, int(floor(vId.x + 0.5)));
  if (sh) col = mix(vInk, uDusk, ${zt});
  #endif
  gl_FragColor = vec4(col, 1.);
}`,Me=`
varying vec3 vW; varying vec3 vN; varying vec3 vInk; varying vec2 vId;
${oe}
void main() {
  if (inShadow(vW, -1)) discard;
  gl_FragColor = vec4(0., 0., 0., ${(1-zt).toFixed(2)});
}`,De=`
uniform vec3 uDusk;
void main() { gl_FragColor = vec4(uDusk, 1.); }`,_e=`
uniform vec3 uDusk;
varying vec3 vW; varying vec3 vN; varying vec3 vInk; varying vec2 vId;
${oe}
void main() {
  if (inShadow(vW, int(floor(vId.x + 0.5)))) discard;
  gl_FragColor = vec4(uDusk, ${zt});
}`,Oe=`
attribute float aEdge; attribute vec2 aDust;
uniform vec3 uFall;
varying vec3 vW; varying vec3 vN; varying vec3 vInk; varying vec2 vId;
void main() {
  float age = clamp(aDust.x, 0., 1.);
  float r = aDust.y + 16. * age * (2. - age) + aEdge * 5. * (1. - age) * step(0.001, age);
  vec4 w = modelMatrix * instanceMatrix * vec4(position.x * r, 0., position.z * r, 1.);
  vW = w.xyz; vN = vec3(0., 1., 0.); vInk = uFall; vId = vec2(-1., 0.);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;function Ge(y,z={}){const b=z.palette&&z.palette.length>=7?z.palette:Be,m={};ze.forEach((n,e)=>{m[n]=new a.Color(b[e])});const G=n=>n.clone().lerp(m.dusk,zt),H=n=>n.clone().lerp(m.sky,.35);m.far=new a.Color(z.far||"#B4A6CC"),m.straw=m.ochre.clone().lerp(m.sand,.42);const Q=[.3,.55,.78],q=(n,e)=>n.clone().lerp(m.far,Q[Math.min(2,Math.max(0,e))]);m.sandShade=G(m.sand),m.ripple=m.sand.clone().lerp(m.ochre,.36);const p=n=>Array.from({length:n},()=>new a.Vector4(0,0,0,0)),x={uSun:{value:yt.clone()},uDusk:{value:m.dusk},uTime:{value:0},uRingA:{value:p(gt)},uRingB:{value:p(gt)},uRingC:{value:p(gt)},uCylA:{value:p(Ct)},uCylB:{value:p(Ct)},uBoxC:{value:p(Et)},uBoxH:{value:p(Et)},uGapA:{value:new a.Vector3},uGapB:{value:new a.Vector3}};for(const n of x.uRingB.value)n.set(0,1,0,0);for(const n of x.uBoxC.value)n.set(0,0,0,1);const C=(n,e,A={})=>new a.ShaderMaterial({uniforms:{...x},vertexShader:Vt,fragmentShader:ge,defines:e?{PLAIN:1}:{},side:n?a.FrontSide:a.DoubleSide,fog:!1,toneMapped:!1,...A}),T=C(!1,!1),D=C(!0,!1),U=C(!1,!0),_=new Map,J=(n,e=!1)=>{const A=n+(e?"p":"");return _.has(A)||_.set(A,C(!1,e,{depthWrite:n===0,polygonOffset:n>0,polygonOffsetFactor:-1-n,polygonOffsetUnits:-2-2*n})),_.get(A)},W={transparent:!1,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.ZeroFactor,blendDst:a.OneFactor,blendSrcAlpha:a.OneFactor,blendDstAlpha:a.ZeroFactor,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-5,polygonOffsetUnits:-10},tt=new a.ShaderMaterial({uniforms:{...x},vertexShader:Vt,fragmentShader:Me,side:a.DoubleSide,fog:!1,toneMapped:!1,...W}),F=n=>new a.ShaderMaterial({uniforms:{...x},vertexShader:n,fragmentShader:Me,side:a.DoubleSide,fog:!1,toneMapped:!1,...W}),dt=new a.ShaderMaterial({uniforms:{...x},vertexShader:Vt,fragmentShader:De,side:a.DoubleSide,fog:!1,toneMapped:!1,transparent:!1,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.OneMinusDstAlphaFactor,blendDst:a.DstAlphaFactor,blendSrcAlpha:a.OneFactor,blendDstAlpha:a.ZeroFactor,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-12}),rt=new a.ShaderMaterial({uniforms:{...x},vertexShader:Vt,fragmentShader:_e,side:a.DoubleSide,fog:!1,toneMapped:!1,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-5,polygonOffsetUnits:-10}),X=(n,e={})=>new a.ShaderMaterial({uniforms:{...x,...e.uniforms||{}},vertexShader:n,fragmentShader:ge,defines:e.plain?{PLAIN:1}:{},side:e.two?a.FrontSide:a.DoubleSide,fog:!1,toneMapped:!1,...e.extra||{}}),O=[];for(let n=0,e=0;n<Pe;e++){const[A,g]=xe[e%xe.length];O.push([n,n+A,g]),n+=A}function at(){const n=[],e=[],A=[],g=[],I={tris:0,xf:null,tri(d,M,t,s,f=-1,l=0,i=null){let u,r,h;if(I.xf){const o=I.xf.elements,v=w=>[o[0]*w[0]+o[4]*w[1]+o[8]*w[2]+o[12],o[1]*w[0]+o[5]*w[1]+o[9]*w[2]+o[13],o[2]*w[0]+o[6]*w[1]+o[10]*w[2]+o[14]];d=v(d),M=v(M),t=v(t),i&&(i=[o[0]*i[0]+o[4]*i[1]+o[8]*i[2],o[1]*i[0]+o[5]*i[1]+o[9]*i[2],o[2]*i[0]+o[6]*i[1]+o[10]*i[2]])}if(i)u=i[0],r=i[1],h=i[2];else{const o=M[0]-d[0],v=M[1]-d[1],w=M[2]-d[2],N=t[0]-d[0],P=t[1]-d[1],K=t[2]-d[2];u=v*K-w*P,r=w*N-o*K,h=o*P-v*N;const $=Math.hypot(u,r,h)||1;u/=$,r/=$,h/=$}n.push(d[0],d[1],d[2],M[0],M[1],M[2],t[0],t[1],t[2]);for(let o=0;o<3;o++)e.push(u,r,h),A.push(s.r,s.g,s.b),g.push(f,l);I.tris++},quad(d,M,t,s,f,l,i,u){I.tri(d,M,t,f,l,i,u),I.tri(d,t,s,f,l,i,u)},flat(d,M,t,s,f=-1){I.tri(d,M,t,s,f,0),I.tri(d,t,M,s,f,0)},geometry(){const d=new a.BufferGeometry;return d.setAttribute("position",new a.Float32BufferAttribute(n,3)),d.setAttribute("normal",new a.Float32BufferAttribute(e,3)),d.setAttribute("aInk",new a.Float32BufferAttribute(A,3)),d.setAttribute("aId",new a.Float32BufferAttribute(g,2)),d.computeBoundingSphere(),d},mesh(d=T){const M=new a.Mesh(I.geometry(),d);return M.matrixAutoUpdate=!1,M}};return I}function bt(n,e){const A=e.sides||8,g=e.key||0,I=e.inset??3,d=e.id??-1,M=e.screeId??d,t=e.noise||y.noise,s=e.eyes??1/0,f=(r,h,o,v,w)=>{const N=w!==void 0,P=N?w:(h+o)/2,K=O[r][1]-O[r][0]<2,$=N?0:((K?-.45:.12)+.55*t.n2(r*.83+g*13.1,g*7.7+.5))*I+(v&&e.cap||0),ht=e.drift?e.drift(P):null,et=N?0:e.shift||0,lt=e.x+(ht?ht[0]:0)+t.n2(r*1.7+g*3.3,2.2)*et,ct=e.z+(ht?ht[1]:0)+t.n2(r*1.7+g*3.3,9.4)*et,ot=[];for(let c=0;c<A;c++){const S=c/A*Math.PI*2+g,E=t.n2(Math.cos(S)*2.3+g*5.1,Math.sin(S)*2.3+P*.012)*I*.7,V=N?0:Math.max(0,t.n3(Math.cos(S)*1.7+g,Math.sin(S)*1.7,r*.45+g)-.4)*I*3,pt=Math.max(.6,e.radius(P,S)+$+E-V);ot.push([lt+Math.cos(S)*pt,ct-Math.sin(S)*pt])}return ot.c=[lt,ct],ot},l=[0,1,0],i=[0,-1,0],u=[];for(let r=0;r<O.length;r++){const h=Math.max(e.y0,O[r][0]),o=Math.min(e.y1,O[r][1]);if(o-h<.2)continue;const v=u[u.length-1];e.coarse&&v&&O[r][1]-O[r][0]<2&&!(e.talus&&v.yb<=e.talus+.01)?v.yb=o:u.push({bi:r,ya:h,yb:o})}for(const r of u){const{bi:h,ya:o,yb:v}=r,w=e.talus&&v<=e.talus+.01;let N=w?m.ripple:m[O[h][2]];e.tint&&(N=e.tint(N));const P=w?f(h,o,v,!1,v):f(h,o,v,v>=e.y1-.01),K=w?f(h,o,v,!1,o):P;for(let $=0;$<A;$++){const ht=($+1)%A,et=K[$],lt=K[ht],ct=P[$],ot=P[ht];n.quad([et[0],o,et[1]],[lt[0],o,lt[1]],[ot[0],v,ot[1]],[ct[0],v,ct[1]],N,w?M:d,0),v>s||n.tri([P.c[0],v,P.c[1]],[ct[0],v,ct[1]],[ot[0],v,ot[1]],N,w?M:d,0,l),o>e.y0&&!w&&n.tri([K.c[0],o,K.c[1]],[lt[0],o,lt[1]],[et[0],o,et[1]],N,d,0,i)}}}function vt(n,e){const{R:A,r:g,h:I,ink:d}=e,M=e.id??-1,t=e.key||0,s=e.noise||y.noise,f=e.sun||[yt.x,yt.y,yt.z],l=e.furrowWide||1.6,i=e.furrowDeep||.5,u=f[1]<=0?1:0,r=e.notches||[],h=e.seam||(d===m.ochre?m.red:d===m.red?m.oxblood:m.maroon),o=Math.max(1,Math.round(I/3)),v=I/o,w=Math.max(28,Math.min(72,Math.round(A*1.3))),N=e.half?.5:e.arc||1,P=N<1,K=Math.PI*2*N,$=Math.max(2,Math.round(w*N)),ht=Math.floor((s.n2(t*3.3,1.7)*.5+.5)*o)%o,et=[0,1,0],lt=[0,-1,0],ct=A-g<13,ot=(S,E)=>{const V=t*2.1+S*2.4,pt=o>1&&!e.cut?S===ht?1.7:.35+.45*(s.n2(S*3.1+t,6.6)*.5+.5):0;let B=A-(o>1?.9:0)-((o-1-S)%2===(ct?1:0)&&o>1?2.4:0)+pt*Math.cos(E-V);const mt=e.cut?0:s.n3(Math.cos(E)*2.6+t*4.7,Math.sin(E)*2.6,S*.8+t)-(S===o-1?.3:.48);mt>0&&(B-=Math.min(A-g-.8,mt*16)*.55);for(const[kt,jt,Ht]of r){const L=1-Math.abs(Math.atan2(Math.sin(E-kt),Math.cos(E-kt)))/(jt/2);L>0&&(B-=Ht*Math.min(1,L*1.6))}return Math.max(g+.9,B)},c=(S,E,V)=>[Math.cos(E)*S,V,-Math.sin(E)*S];for(let S=e.slabs?e.slabs[0]:0;S<(e.slabs?Math.min(o,e.slabs[1]):o);S++){const E=-I/2+S*v,V=E+.85,pt=V-.44,B=E+v,mt=P?(s.n2(S*9.1+t,4.4)*.5+.5)*.14:0,kt=P?(s.n2(S*6.7+t,8.8)*.5+.5)*.14:0,jt=P||S===o-1,Ht=P||S===0;for(let L=0;L<$;L++){const k=mt+L/$*(K-mt-kt),R=mt+(L+1)/$*(K-mt-kt),xt=ot(S,k),Rt=ot(S,R),At=Math.max(g+.4,xt-1.5),wt=Math.max(g+.4,Rt-1.5);n.quad(c(At,k,E),c(wt,R,E),c(wt,R,pt),c(At,k,pt),h,M,0),n.quad(c(At,k,pt),c(wt,R,pt),c(wt,R,V),c(At,k,V),h,M,1),n.quad(c(At,k,V),c(wt,R,V),c(Rt,R,V),c(xt,k,V),d,M,0,lt);const Dt=B-1,_t=Math.max(g+.5,xt-1.7),Ot=Math.max(g+.5,Rt-1.7);n.quad(c(xt,k,V),c(Rt,R,V),c(Rt,R,Dt),c(xt,k,Dt),d,M,0),n.quad(c(xt,k,Dt),c(Rt,R,Dt),c(Ot,R,B),c(_t,k,B),d,M,0);const Qt=jt?g:Math.max(g,Math.min(_t,Ot)-14),le=Ht?g:Math.max(g,Math.min(At,wt)-14),ce=S===o-1?e.furrows??Math.max(1,Math.round((A-g)/8)-1):0,fe=(ft,Y)=>ct?g+.42*(A-g-2.6-l)+.3*Math.cos(Y*2+t):g+(A-g-3)*ft/(ce+.6)+.9*Math.cos(Y*2+t+ft),ue=(k+R)/2,Bt=[Math.cos(ue),0,-Math.sin(ue)],Se=[-Bt[0],0,-Bt[2]],nt=B-i,de=ft=>f[1]>.05?Math.min(l,i*Math.abs(f[0]*Math.cos(ft)-f[2]*Math.sin(ft))/f[1]):l,Gt=f[0]*Bt[0]+f[2]*Bt[2]>0;let Xt=Qt,Kt=Qt;for(let ft=1;ft<=ce;ft++){const Y=fe(ft,k),st=fe(ft,R);if(Math.max(Y,st)+l>Math.min(_t,Ot)-.8||Math.min(Y,st)<Qt+.5)break;n.quad(c(Xt,k,B),c(Y,k,B),c(st,R,B),c(Kt,R,B),d,M,0,et),n.quad(c(Y,k,B),c(Y,k,nt),c(st,R,nt),c(st,R,B),d,M,u,Bt);const he=de(k),pe=de(R),ye=Gt?Y+l-he:Y+he,ve=Gt?st+l-pe:st+pe;n.quad(c(Y,k,nt),c(ye,k,nt),c(ve,R,nt),c(st,R,nt),h,M,u||(Gt?0:1),et),n.quad(c(ye,k,nt),c(Y+l,k,nt),c(st+l,R,nt),c(ve,R,nt),h,M,u||(Gt?1:0),et),n.quad(c(Y+l,k,nt),c(Y+l,k,B),c(st+l,R,B),c(st+l,R,nt),d,M,u,Se),Xt=Y+l,Kt=st+l}n.quad(c(Xt,k,B),c(_t,k,B),c(Ot,R,B),c(Kt,R,B),d,M,0,et),n.quad(c(le,k,E),c(At,k,E),c(wt,R,E),c(le,R,E),d,M,0,lt),n.quad(c(g,R,E),c(g,k,E),c(g,k,B),c(g,R,B),d,M,0)}if(P)for(const[L,k]of[[mt,1],[K-kt,-1]]){const R=ot(S,L),xt=[Math.sin(L)*k,0,Math.cos(L)*k];n.quad(c(g,L,E),c(R,L,E),c(R,L,B),c(g,L,B),d,M,0,xt)}}}return{palette:m,shadeOf:G,paleOf:H,farOf:q,sun:yt.clone(),sunUp:Tt,sunBearing:Zt,shadeMix:zt,bands:O,uniforms:x,coneId:Nt,boxId:Jt,freeRing:Ut,gateRing:Ce,quarryRing:Ee,pieceRing:Ne,rock:T,blade:D,plain:U,layer:J,veil:tt,veilWith:F,lay:dt,veilOver:rt,inkWith:X,builder:at,strata:bt,ring:vt,shadowOnFloor:(n,e,A)=>[n-yt.x*e/yt.y,A-yt.z*e/yt.y],setRing(n,e,A,g,I,d,M){x.uRingA.value[n].set(e.x,e.y,e.z,g),x.uRingB.value[n].set(A.x,A.y,A.z,I),M?x.uRingC.value[n].set(M.x,M.y,M.z,d):x.uRingC.value[n].set(0,0,0,d)},setCyl(n,e,A,g,I,d,M){x.uCylA.value[n].set(e,A,g,I),x.uCylB.value[n].set(d,M,0,0)},setGap(n,e){x.uGapA.value.copy(n),x.uGapB.value.copy(e)},setBox(n,e,A,g,I,d,M,t=0){x.uBoxC.value[n].set(e,A,g,Math.cos(t)),x.uBoxH.value[n].set(I,d,M,Math.sin(t))},update(n,e){x.uTime.value=e}}}const it=[$t(92,276),$t(-52,384),$t(-196,492)],Mt=[{R:17,h:6,vUp:26,vAcross:52,ink:"straw",seam:"ochre"},{R:22,h:6,vUp:23,vAcross:46,ink:"ochre",seam:"red"},{R:28,h:9,vUp:20,vAcross:40,ink:"red",seam:"oxblood"},{R:34,h:9,vUp:17,vAcross:34,ink:"oxblood",seam:"maroon"},{R:40,h:12,vUp:14,vAcross:28,ink:"maroon",seam:"oxblood"}],j=Mt.length,Lt=(1<<j)-1,ne=9.5,se=13,ut=100,Te=180,Ue=6,$e=[7.3,21.9,38.4,52.6,66.1],Yt={footR0:17,footR1:12.5,footY:se,r0:8,r1:4.7,top:86},qt=y=>y*y*(3-2*y),be=y=>1.5*y*y-.5*y*y*y,Ve=y=>1-be(1-y),Ft=y=>Math.min(1,Math.max(0,y));function Le(){const y=[Array.from({length:j},(q,p)=>j-1-p),[],[]],z=[],b=q=>se+y[q].reduce((p,x)=>p+Mt[x].h,0);let m=0,G=!0;for(let q=1;q<=3*Lt;q++){const p=(q-1)%Lt+1;let x=0;for(;!(p>>x&1);)x++;const C=y.findIndex(X=>X.includes(x)),T=(C+((j-1-x)%2===0?2:1))%3,D=y[T];(y[C][y[C].length-1]!==x||D.length&&D[D.length-1]<x)&&(G=!1),y[C].pop();const U=b(C),_=b(T),J=Mt[x],W=q%Lt===0,tt=(q-1)%Lt===0,F=(ut-U)/J.vUp*(tt?1.5:1),dt=Math.abs(T-C)*Te/J.vAcross,rt=(ut-_)/J.vUp*(W?1.5:1);if(z.push({k:q,ring:x,from:C,to:T,yFrom:U,yTo:_,t0:m,rise:F,cross:dt,sink:rt,end:m+F+dt+rt,touchStart:tt,touchEnd:W}),D.push(x),W)m+=F+dt+rt;else{const X=1-Ue/(ut-_);let O=0,at=1;for(let bt=0;bt<30;bt++){const vt=(O+at)/2;qt(vt)<X?O=vt:at=vt}m+=F+dt+rt*O}}const H=y[0].length===j&&y[0].every((q,p)=>q===j-1-p),Q=Array.from({length:j},(q,p)=>z.filter(x=>x.ring===p));return{moves:z,byRing:Q,period:m,lawful:G&&H}}function Ae(y,z,b,m){const G=y.byRing[z],H=y.period;let Q=-1;for(let F=G.length-1;F>=0;F--)if(G[F].t0<=b){Q=F;break}let q=0;Q<0&&(Q=G.length-1,q=-H);const p=G[Q],x=b-(p.t0+q),C=it[p.from],T=it[p.to];let D,U,_,J;if(x<p.rise){const F=(p.touchStart?Ve:qt)(Ft(x/p.rise));D=C[0],_=C[1],U=p.yFrom+(ut-p.yFrom)*F,J=U-p.yFrom}else if(x<p.rise+p.cross){const F=qt(Ft((x-p.rise)/p.cross));D=C[0]+(T[0]-C[0])*F,_=C[1]+(T[1]-C[1])*F,U=ut,J=200}else{const F=(p.touchEnd?be:qt)(Ft((x-p.rise-p.cross)/p.sink));D=T[0],_=T[1],U=ut-(ut-p.yTo)*F,J=U-p.yTo}m.x=D,m.y=U,m.z=_,m.aloft=J;let W=p,tt=q;return x<p.rise+p.cross+p.sink&&(Q>0?W=G[Q-1]:(W=G[G.length-1],tt=q-H)),m.landed=b-(W.end+tt),m.seatY=W.yTo,m.peg=W.to,m}const Ye=7341,Pt=[{at:[80,893.2],footR0:26,footR1:18,footY:16,r0:11,r1:6,top:200,key:12.4,waist:.62,tip:.45,flat:.22,flatA:.9,bend:2.2,bendA:4.1},{at:[376,722.8],footR0:32,footR1:22,footY:20,r0:13.5,r1:7,top:260,key:27.9,waist:.48,tip:.5,flat:.26,flatA:2.2,bend:2.8,bendA:1.3},{at:[396,522],footR0:29,footR1:20,footY:18,r0:12,r1:6.5,top:230,key:35.2,waist:.71,tip:.38,flat:.19,flatA:.3,bend:2.5,bendA:5.6}],we=Pt.map(y=>$t(y.at[0],y.at[1])),ae=17,Z=(y,z,b)=>[y-te,b,-(z-ee)],ie=[{j:0,slot:5,key:4.1,R:30,h:9,ink:"straw",seam:"ochre",pos:Z(376,722.8,24.5),lean:0,tilt:0,spin:0},{j:3,slot:6,key:23.8,R:38,h:9,ink:"red",seam:"oxblood",pos:Z(377,721.8,36),lean:250,tilt:11,spin:40},{j:5,slot:7,key:29.3,R:43,h:12,ink:"oxblood",seam:"maroon",pos:Z(399,519,120),lean:215,tilt:30,spin:0},{j:6,slot:8,key:33.6,R:46,h:15,ink:"red",seam:"oxblood",pos:Z(282,733,177),lean:288,tilt:55,spin:15},{j:7,slot:9,key:41.5,R:50,h:15,ink:"maroon",seam:"oxblood",pos:Z(396,522,25.5),lean:0,tilt:0,spin:0},{j:4,slot:10,key:46.2,R:40,h:12,ink:"ochre",seam:"red",pos:Z(54,899,38.2),lean:262,tilt:72,spin:0,sieve:Z(77.3,867.9,38.2)},{j:2,slot:11,key:17.2,R:36,h:9,ink:"red",seam:"oxblood",half:!0,pos:Z(420,770,6),lean:240,tilt:28,spin:120},{j:2,slot:12,key:17.2,R:36,h:9,ink:"red",seam:"oxblood",half:!0,pos:Z(275.9,669.2,2.5),lean:200,tilt:14,spin:160},{j:1,slot:13,key:11.7,R:33,h:9,ink:"ochre",seam:"red",pos:Z(330,790,7),lean:300,tilt:24,spin:0}],ke={3:23,5:7,6:117},St=Math.PI/180,re=new a.Vector3(0,1,0),Re=new a.Vector3,qe=new a.Quaternion;function Wt(y,z,b,m){return Re.set(Math.sin(z*St)*Math.sin(b*St),Math.cos(b*St),-Math.cos(z*St)*Math.sin(b*St)),y.setFromUnitVectors(re,Re),qe.setFromAxisAngle(re,m*St),y.multiply(qe)}async function je(y,z={}){const b=z.style||Ge(y,z),m=y.rng,G=y.noise,H=b.palette,Q=Ie(Ye),q=new a.Group,p=Le(),x=b.builder(),C=[],T=(t,s,f,l,i)=>{const u=s.top-s.footY,r=s.top/Yt.top;b.strata(x,{x:t[0],z:t[1],y0:0,y1:s.footY,sides:18,key:l.key,inset:1.5,shift:.7,id:Nt+f*2,noise:i,radius:(h,o)=>{const v=h/s.footY,w=i.n2(Math.cos(o)*1.3+l.key,Math.sin(o)*1.3)*.3,N=s.footR0*.9+(s.footR1-s.footR0*.9)*v,P=Ft((v-.8)/.2);return(N+(s.r0*1.02-N)*P*P)*(1+(1-v)*w)}}),b.strata(x,{x:t[0],z:t[1],y0:s.footY,y1:s.top,sides:8,key:l.key+3,inset:1.15*Math.sqrt(r),shift:.9,id:Nt+1+f*2,noise:i,drift:h=>{const o=(h-s.footY)/u,v=l.bend*Math.sin(o*Math.PI*1.5)*o*1.4;return[Math.cos(l.bendA)*v,Math.sin(l.bendA)*v]},radius:(h,o)=>{const v=(h-s.footY)/u,w=1-.16*Math.exp(-((v-l.waist)*(v-l.waist))/.01),N=1-l.tip*Ft((v-.955)/.045);return(s.r0+(s.r1-s.r0)*v)*w*N*(1-l.flat*Math.abs(Math.sin(o-l.flatA)))*1.05}}),C.push({place:t,dims:s,slot:f})};for(let t=0;t<3;t++)T(it[t],Yt,t,{key:m.range(1,40),waist:m.range(.3,.8),tip:m.range(.35,.6),flat:m.range(.18,.3),flatA:m.range(0,Math.PI),bend:m.range(.9,1.6),bendA:m.range(0,Math.PI*2)},G),await y.yield();for(let t=0;t<3;t++)T(we[t],Pt[t],3+t,Pt[t],Q),await y.yield();q.add(x.mesh(b.rock)),await y.yield();const D=[];for(let t=0;t<j;t++){const s=Mt[t],f=b.builder();b.ring(f,{R:s.R,r:ne,h:s.h,ink:H[s.ink],seam:H[s.seam],id:t,key:$e[t]});const l=f.mesh(b.rock);q.add(l),D.push({mesh:l,q:s,state:{}}),await y.yield()}const U=b.builder(),_=[],J=new a.Matrix4,W=new a.Vector3(1,1,1);for(const t of ie){const s=ke[t.j]!==void 0,f={q:t,quat:Wt(new a.Quaternion,t.lean,t.tilt,t.spin),pos:new a.Vector3(...t.pos),mesh:null},l=s?b.builder():U;s||(l.xf=J.compose(f.pos,f.quat,W));const i=b.sun.clone().applyQuaternion(f.quat.clone().invert());b.ring(l,{R:t.R,r:ae,h:t.h,ink:H[t.ink],seam:H[t.seam],id:t.slot,key:t.key,half:t.half,sun:[i.x,i.y,i.z],noise:Q}),s&&(f.mesh=l.mesh(b.rock),f.mesh.position.copy(f.pos),f.mesh.quaternion.copy(f.quat),f.mesh.updateMatrix(),q.add(f.mesh)),_.push(f),await y.yield()}U.xf=null,q.add(U.mesh(b.rock)),await y.yield();const tt=new a.InstancedBufferGeometry,F=[],dt=[];for(let t=0;t<56;t++){const s=t/56*Math.PI*2,f=(t+1)/56*Math.PI*2,l=[Math.cos(s),0,Math.sin(s)],i=[Math.cos(f),0,Math.sin(f)];F.push(...l,...i,...i,...l,...i,...l),dt.push(0,0,1,0,1,1)}tt.setAttribute("position",new a.Float32BufferAttribute(F,3)),tt.setAttribute("aEdge",new a.Float32BufferAttribute(dt,1));const rt=new a.InstancedBufferAttribute(new Float32Array(2*j),2);tt.setAttribute("aDust",rt);const X=new a.InstancedMesh(tt,b.inkWith(Oe,{uniforms:{uFall:{value:H.ripple}},extra:{depthWrite:!1}}),j);X.frustumCulled=!1,X.renderOrder=-3.5,X.matrixAutoUpdate=!1;const O=X.instanceMatrix;if(q.add(X),z.floor!==!1){const t=b.builder(),s=2600,f=250,l=-280;t.quad([f-s,0,l+s],[f+s,0,l+s],[f+s,0,l-s],[f-s,0,l-s],H.sand,-1,0,[0,1,0]);const i=t.mesh(b.layer(0));i.renderOrder=-6,q.add(i),await y.yield()}const at=new a.Vector3,bt=new a.Vector3,vt=new a.Vector3,It=new a.Quaternion,n=new a.Matrix4,e=Math.PI*2,A=(t,s,f,l)=>{const i=t.q;f.copy(t.pos);let u=0;if(i.j===3){const r=s%23,h=r<4?5*qt(r/4):r<5.5?5+.3*Math.sin((r-4)/1.5*e*4):r<8.5?5*(1-qt((r-5.5)/3)):0;f.y+=h,Wt(l,i.lean,i.tilt-4*h/5,i.spin),u=h}else i.j===5?Wt(l,i.lean,i.tilt+2*Math.sin(s/7*e),i.spin):i.j===6?(u=60,f.y+=1.2*Math.sin(s/13*e),Wt(l,i.lean,i.tilt+3*Math.sin(s/9*e),i.spin)):l.copy(t.quat);return u};function g(t,s){b.update(t,s),q.updateWorldMatrix(!0,!1);const f=q.matrixWorld,l=(s%p.period+p.period)%p.period;for(let u=0;u<j;u++){const r=D[u],h=Ae(p,u,l,r.state);r.mesh.position.set(h.x,h.y+r.q.h/2,h.z),r.mesh.updateMatrix(),at.copy(r.mesh.position).applyMatrix4(f),b.setRing(u,at,re,r.q.R,ne,r.q.h/2,null)}for(let u=0;u<j;u++){const r=D[u].state,h=r.landed>=0&&r.landed<3?r.landed/3:0,o=it[r.peg];let v=D[u].q.R;for(let w=0;w<j;w++)D[w].state.peg===r.peg&&D[w].q.R>v&&(v=D[w].q.R);n.makeTranslation(o[0],.3,o[1]),X.setMatrixAt(u,n),rt.setXY(u,h,v)}O.needsUpdate=!0,rt.needsUpdate=!0;for(const u of _){const r=u.q;A(u,s,at,It),u.mesh&&(u.mesh.position.copy(at),u.mesh.quaternion.copy(It),u.mesh.updateMatrix()),bt.set(0,1,0).applyQuaternion(It).transformDirection(f),r.half&&vt.set(0,0,-1).applyQuaternion(It).transformDirection(f),at.applyMatrix4(f),b.setRing(r.slot,at,bt,r.R,ae,r.h/2,r.half?vt:null)}const i=f.elements;for(const u of C){const r=u.dims,h=u.place[0]+i[12],o=u.place[1]+i[14];b.setCyl(u.slot*2,h,o,i[13],i[13]+r.footY,r.footR0,r.footR1),b.setCyl(u.slot*2+1,h,o,i[13]+r.footY,i[13]+r.top,r.r0,r.r1)}}g(0,0);const I=(t,s=-1)=>{const f=(t%p.period+p.period)%p.period,l=[],i={},u=new a.Vector3,r=new a.Quaternion;for(let h=0;h<j;h++){if(s>=0&&s!==h){l.push(null);continue}Ae(p,h,f,i),l.push({x:i.x,y:i.y+Mt[h].h/2,z:i.z,R:Mt[h].R,r:ne,h:Mt[h].h,ax:[0,1,0],flying:i.aloft>0,stirs:0})}for(const h of _){if(s>=0&&s!==l.length){l.push(null);continue}const o=A(h,t,u,r),v=new a.Vector3(0,1,0).applyQuaternion(r);l.push({x:u.x,y:u.y,z:u.z,R:h.q.R,r:ae,h:h.q.h,ax:[v.x,v.y,v.z],flying:h.q.j===6||o>0,stirs:ke[h.q.j]||0,half:!!h.q.half})}return l},d=t=>new a.Vector3(t[0],t[1],t[2]),M={place:new a.Vector3(te,0,-ee),pegs:it.map(t=>new a.Vector3(t[0],0,t[1])),tallPegs:we.map(t=>new a.Vector3(t[0],0,t[1])),needle:Yt,giants:Pt.map(t=>({footR0:t.footR0,footY:t.footY,r0:t.r0,top:t.top})),needleTop:Yt.top,tallNeedleTop:Math.max(...Pt.map(t=>t.top)),portalSeat:{position:d(Z(264.98,716.34,80)),facing:new a.Vector3(-Math.sin(119*Math.PI/180),0,Math.cos(119*Math.PI/180)),radius:16},lane:{underside:ut,seatY:se,from:d(Z(92,276,ut)),to:d(Z(-196,492,ut)),rings:Mt.map(t=>({R:t.R,h:t.h}))},keepOut:[...C.map(t=>({x:t.place[0],z:t.place[1],r:t.dims.footR0+12})),{x:it[0][0],z:it[0][1],r:52},{x:it[1][0],z:it[1][1],r:52},{x:it[2][0],z:it[2][1],r:52},...ie.filter(t=>t.pos[1]<60).map(t=>({x:(t.sieve||t.pos)[0],z:(t.sieve||t.pos)[2],r:t.R+12}))],keepLater:ie.filter(t=>t.sieve).map(t=>({x:t.pos[0],z:t.pos[2],r:t.R+8}))};return{object:q,radius:210,height:150,center:new a.Vector3(0,60,0),anchors:M,style:b,period:p.period,lawful:p.lawful,moves:p.moves,ringsAt:I,update:g,dispose(){X.dispose(),z.style||(b.blade.dispose(),b.plain.dispose(),b.veil.dispose(),b.lay.dispose(),b.veilOver.dispose())},ground:z.floor===!1,groundY:0}}export{je as buildHero,Ge as makeStyle};
