import*as a from"three";import{clamp as U,lerp as Y,smoothstep as re}from"../kit/core.js";const Ne=["#C9D3D0","#8FA6B8","#24382F","#4A4038","#8C7A66","#FFF1D0","#F2811D"],_e=16,Fe=7.5,We=.45,ze=`
uniform float uTe, uTime, uY0, uSpeed, uAfter;
uniform vec3 uSunH;      // xy = sun azimuth (x,z), z = lean
float hHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hHash(i), hHash(i+vec2(1.,0.)), f.x), mix(hHash(i+vec2(0.,1.)), hHash(i+vec2(1.,1.)), f.x), f.y); }
float hEff(vec3 p){ return p.y - uSunH.z * dot(p.xz, uSunH.xy); }
// event time at which the light front reaches p (ragged)
float flipBase(vec3 p){ return (uY0 - hEff(p)) / uSpeed + 0.45*hNoise(p.xz*0.33 + p.y*0.09) + 0.18*hNoise(p.xz*1.9 + 3.1); }
// 0 in shade, 1 inside the shaft, uAfter once it has passed
float shaftLit(vec3 p, float te){ float d = hEff(p) - (uY0 - uSpeed*te);
  return smoothstep(-2.5, 0.5, d) * mix(1.0, uAfter, smoothstep(11.0, 17.0, d)); }
`;function qe(c,s){const e={pos:new Float32Array(c*3),nor:new Float32Array(c*3),uv:new Float32Array(c*2),col:new Float32Array(c*3),piv:new Float32Array(c*4),inf:new Float32Array(c*4),dim:new Float32Array(c*2),idx:new Uint32Array(s),nv:0,ni:0,c:[1,1,1],pv:[0,0,0,0],kind:0,rand:0,coat:0,d:[1,1],v(t,v,o,l,x,h,u,p,n=0,d=1){const r=e.nv++;if(r>=c)throw new Error("monarch-sanctuary: vertex budget");return e.pos[r*3]=t,e.pos[r*3+1]=v,e.pos[r*3+2]=o,e.nor[r*3]=l,e.nor[r*3+1]=x,e.nor[r*3+2]=h,e.uv[r*2]=u,e.uv[r*2+1]=p,e.col[r*3]=e.c[0]*d,e.col[r*3+1]=e.c[1]*d,e.col[r*3+2]=e.c[2]*d,e.piv[r*4]=e.pv[0],e.piv[r*4+1]=e.pv[1],e.piv[r*4+2]=e.pv[2],e.piv[r*4+3]=e.pv[3],e.inf[r*4]=e.kind,e.inf[r*4+1]=n,e.inf[r*4+2]=e.rand,e.inf[r*4+3]=e.coat,e.dim[r*2]=e.d[0],e.dim[r*2+1]=e.d[1],r},tri(t,v,o){if(e.ni+3>s)throw new Error("monarch-sanctuary: index budget");e.idx[e.ni++]=t,e.idx[e.ni++]=v,e.idx[e.ni++]=o},quad(t,v,o,l){e.tri(t,v,o),e.tri(t,o,l)},geometry(){const t=new a.BufferGeometry;return t.setAttribute("position",new a.BufferAttribute(e.pos.slice(0,e.nv*3),3)),t.setAttribute("normal",new a.BufferAttribute(e.nor.slice(0,e.nv*3),3)),t.setAttribute("uv",new a.BufferAttribute(e.uv.slice(0,e.nv*2),2)),t.setAttribute("color",new a.BufferAttribute(e.col.slice(0,e.nv*3),3)),t.setAttribute("aPivot",new a.BufferAttribute(e.piv.slice(0,e.nv*4),4)),t.setAttribute("aInfo",new a.BufferAttribute(e.inf.slice(0,e.nv*4),4)),t.setAttribute("aDim",new a.BufferAttribute(e.dim.slice(0,e.nv*2),2)),t.setIndex(new a.BufferAttribute(e.idx.slice(0,e.ni),1)),t}};return e}const k=new a.Vector3,Te=new a.Vector3,_=new a.Vector3,K=new a.Vector3;function De(c,s,e,t,v){const o=s.length,l=[],x=Math.PI*2*e(0);c.d=[x,v];for(let h=0;h<o;h++){const u=s[h],p=h/(o-1);k.copy(s[Math.min(h+1,o-1)]).sub(s[Math.max(h-1,0)]).normalize(),Te.set(0,1,0),Math.abs(k.y)>.92&&Te.set(1,0,0),_.crossVectors(k,Te).normalize(),K.crossVectors(_,k).normalize();const n=e(p),d=[];for(let r=0;r<=t;r++){const m=r/t*Math.PI*2,g=Math.cos(m),C=Math.sin(m),H=_.x*g+K.x*C,T=_.y*g+K.y*C,L=_.z*g+K.z*C,V=c.wFn?c.wFn(u):0;d.push(c.v(u.x+H*n,u.y+T*n,u.z+L*n,H,T,L,r/t,p,V,.85+.3*((r*7+h*3)%5)/5))}l.push(d)}for(let h=0;h<o-1;h++)for(let u=0;u<t;u++)c.quad(l[h][u],l[h][u+1],l[h+1][u+1],l[h+1][u])}function we(c,s,e,t,v,o,l,x){const h=[c.clone()],u=Math.sin(s),p=Math.cos(s);let n=c.clone(),d=0;for(let r=1;r<=o;r++){const m=r/o,g=Y(e,t,Math.pow(m,.75))-l*m*m;d+=(x()-.5)*.09;const C=Math.cos(d),H=Math.sin(d),T=u*C+p*H,L=p*C-u*H,V=v/o,S=Math.cos(g);n=new a.Vector3(n.x+T*S*V,n.y+Math.sin(g)*V,n.z+L*S*V),h.push(n)}return h}function xe(c,s,e,t,v,o,l=0){const x=s.length,h=[],u=Math.cos(l),p=Math.sin(l);for(let n=0;n<x;n++){const d=s[n],r=n/(x-1);if(k.copy(s[Math.min(n+1,x-1)]).sub(s[Math.max(n-1,0)]).normalize(),_.set(k.z,0,-k.x),_.lengthSq()<1e-4&&_.set(1,0,0),_.normalize(),K.crossVectors(_,k).normalize(),K.y<0&&K.negate(),l){const H=_.x*u+K.x*p,T=_.y*u+K.y*p,L=_.z*u+K.z*p;K.set(K.x*u-_.x*p,K.y*u-_.y*p,K.z*u-_.z*p),_.set(H,T,L)}const m=e(r),g=[],C=c.wFn?c.wFn(d):0;c.d=[v,m];for(let H=-t;H<=t;H++){const T=H/t,L=Math.abs(T),V=-Math.pow(L,1.4)*m*o,S=L*m*.25,W=d.x+_.x*T*m+k.x*S,P=d.y+_.y*T*m+V+k.y*S,E=d.z+_.z*T*m+k.z*S,I=K.x+_.x*T*.7*o,X=K.y,j=K.z+_.z*T*.7*o,A=1/Math.hypot(I,X,j);g.push(c.v(W,P,E,I*A,X*A,j*A,r,T,C,.8+.35*r))}h.push(g)}for(let n=0;n<x-1;n++)for(let d=0;d<t*2;d++)c.quad(h[n][d],h[n][d+1],h[n+1][d+1],h[n+1][d])}function Pe(c,s,e,t,v,o,l,x,h,u,p,n=4){c.d=[x,h];let d=-1,r=-1;for(let m=0;m<=n;m++){const g=m/n,C=u*Math.sin(g*Math.PI*.85)+u*.4*g,H=1-.25*g,T=s.x+o*C,L=s.y-h*g+t*0-.04,V=s.z+l*C,S=e*x*.5*H,W=t*x*.5*H*(1-g),P=v*x*.5*H,E=.25-.5*g,I=1/Math.hypot(o,E,l),X=c.v(T-S,L-W,V-P,o*I,E*I,l*I,0,g,p,1-.3*g),j=c.v(T+S,L+W,V+P,o*I,E*I,l*I,1,g,p,1-.3*g);m>0&&c.quad(d,r,j,X),d=X,r=j}}function*Oe(c,s,e){const t=c.rng.fork("great-bough"),v=c.noise;yield;const o=qe(21e4,66e4);yield;const l=s.height,x=4,h=new a.Color(e[3]),u=new a.Color(e[2]),p=new a.Color(e[4]),n=u.clone().lerp(new a.Color("#6f7f52"),.55),d=t.range(0,Math.PI*2),r=t.range(.4,1.6),m=t.range(-.5,.5),g=(f,b)=>{const y=U(f/l,0,1),F=r*y*y+m*Math.sin(y*5)*.25*y;return b.set(Math.sin(d)*F,f,Math.cos(d)*F)},C=t.int(4,6),H=t.range(0,6.28),T=s.trunkRadius,L=f=>T*Math.pow(U(1-f/(l+.4),.004,1.2),.82)+.02;o.kind=0,o.pv=[0,0,0,0],o.rand=t(),o.wFn=null;const V=16,S=40,W=[],P=new a.Vector3;o.d=[Math.PI*2*T,l+x];for(let f=0;f<=S;f++){const b=f/S,y=-x+(l+x)*Math.pow(b,1.5);g(y,P);const F=L(Math.max(y,0)),z=[];o.coat=y>4.5&&y<l*.93?.82:y>2.5?.35:0;for(let R=0;R<=V;R++){const G=R%V/V*Math.PI*2,ce=Math.exp(-Math.max(y+.6,0)/1.5)*(.35+.9*Math.pow(.5+.5*Math.cos(C*G+H),2)),ge=.05*v.n3(Math.cos(G)*2.2,y*.35,Math.sin(G)*2.2)+.03*v.n2(G*9,y*.8),le=F*(1+ce*1.25+ge*(.4+2*F/T*.5)),$=Math.cos(G),B=Math.sin(G),fe=U(.5+.5*Math.cos(G-1.2)*1.4,0,1)*re(9,.5,y)*(.55+.45*v.n2(G*3,y*.6)),ue=re(.35,.75,v.n3($*3+9,y*.22,B*3))*.35,oe=h.clone().multiplyScalar(1.7).lerp(n,U(fe,0,.85)).lerp(new a.Color(e[0]),ue*.5);o.c=[oe.r,oe.g,oe.b],z.push(o.v(P.x+$*le,y,P.z+B*le,$,ce*.4,B,R/V,b,0,.85+.3*v.n2(G*5+3,y*1.3)))}W.push(z)}for(let f=0;f<S;f++)for(let b=0;b<V;b++)o.quad(W[f][b],W[f+1][b],W[f+1][b+1],W[f][b+1]);yield;const E=[],I=[],X=[],j=new a.Vector3,A=new a.Vector3;let J=0;const se=8400,he=f=>{o.c=[h.r*f*1.7,h.g*f*1.7,h.b*f*1.7]},ie=()=>{const f=t.range(.75,1.25),b=t.range(-.012,.02);o.c=[u.r*f,(u.g+b)*f,(u.b+b*.5)*f]},Q=()=>{const f=t.range(.6,1.1);o.c=[p.r*f,p.g*f*t.range(.92,1.02),p.b*f*t.range(.85,1)]},de=t.int(6,11);for(let f=0;f<de;f++){const b=t.range(2.6,s.yLow-.3),y=t.range(0,6.28),F=t.range(.5,2.6);g(b,P),j.set(P.x+Math.sin(y)*L(b)*.7,b,P.z+Math.cos(y)*L(b)*.7),o.kind=0,o.coat=0,o.rand=t(),o.pv=[0,0,0,0],o.wFn=null,he(t.range(.7,1.1));const z=we(j,y,t.range(-.1,.3),t.range(-.5,.1),F,4,0,t);De(o,z,R=>Y(.05+.03*F,.012,R),4,F)}yield;const w=t.range(0,6.28),i=t.range(.05,.3);let M=s.yLow,N=0,O=t.range(0,6.28),q=0;for(;M<l-1.3;){const f=U((M-s.yLow)/(l-s.yLow),0,1),b=f>.92?4:t.int(5,6);O+=.9+t.range(-.2,.2);for(let y=0;y<b;y++){if(f<.9&&t.chance(.06))continue;const F=O+y/b*Math.PI*2+t.range(-.22,.22);let z=Y(s.limbMax,.9,Math.pow(f,.9))*t.range(.78,1.12)*(1-i*Math.max(0,Math.cos(F-w)));f<.5&&t.chance(.07)&&(z*=.55),z*=1+.15*(1-re(.05,.4,f));const R=M+t.range(-.3,.3);g(R,P);const G=L(R);j.set(P.x+Math.sin(F)*G*.6,R,P.z+Math.cos(F)*G*.6);const ce=re(.8,1,f),ge=Y(.12,.55,f)+t.range(-.08,.08),le=Y(-t.range(.68,.9),-.25,ce),$=z>4?10:z>2?7:5,B=we(j,F,ge,le,z,$,Y(.16,0,ce),t),fe=j.x,ue=j.y,oe=j.z;o.pv=[fe,ue,oe,F],o.rand=t(),o.wFn=D=>.55+.45*U(Math.hypot(D.x-fe,D.z-oe)/(z*.8),0,1),o.kind=0,o.coat=.9,he(t.range(.75,1.05));const Ee=Math.max(3,Math.round($*.8));De(o,B.slice(0,Ee+1),D=>Y(.045+.016*z,.02,D),4,z*.8),o.kind=1,o.coat=.92,ie();const Ge=z*t.range(.035,.05)+.3;xe(o,B,D=>Ge*Math.pow(Math.sin(Math.PI*(.1+.9*D)),.6)+.02,2,z,1),X.push(B[$].clone()),q++;const Le=(D,ae)=>{const ee=U(D,0,.9999)*$,ne=Math.floor(ee);return ae.lerpVectors(B[ne],B[ne+1],ee-ne)},Me=(D,ae,ee,ne,ye,pe,Ae=4)=>{for(let ve=ne;ve<ee;ve+=ye*t.range(.8,1.2)){if(J>=se)return;const me=U(ve/ee,0,.999)*ae,te=Math.floor(me);A.lerpVectors(D[te],D[te+1],me-te),k.copy(D[te+1]).sub(D[te]).normalize();const be=t.sign(),Se=Math.hypot(k.z,k.x)||1,ke=k.z/Se*be,He=-k.x/Se*be,Ie=t.range(.75,1.55)*pe*(1-.45*ve/ee),Ue=t.range(.5,.8);o.kind=2,o.coat=t.range(.86,.98),o.rand=t(),Q(),A.x+=ke*t.range(0,.12),A.z+=He*t.range(0,.12),Pe(o,A,k.x,k.y,k.z,ke,He,Ue,Ie,t.range(.05,.2),o.wFn(A),Ae),J++,E.push(A.x+ke*.15,A.y-Ie*t.range(.1,.9),A.z+He*.15)}};if(Me(B,$,z,.5,Y(.46,.62,f)*Y(.7,1,re(.55,.75,f)),1+.5*(1-f)),z>6.5)for(const D of[-1,1]){Le(t.range(.2,.36),A);const ae=A.clone(),ee=z*t.range(.5,.66),ne=we(ae,F+D*t.range(.42,.62),ge*.4,le+.08,ee,6,.12,t);o.kind=1,o.coat=.92,o.rand=t(),ie();const ye=ee*.1+.4;xe(o,ne,pe=>ye*Math.pow(Math.sin(Math.PI*Math.min(1,.08+.92*Math.pow(pe,1.3))),.6)+.02,1,ee,1.15),Me(ne,6,ee,.5,.95,1.1,3)}const Ce=U(Math.round(z/.62),3,17);for(let D=0;D<Ce;D++){const ae=Y(.1,.93,(D+t.range(.3,.7))/Ce),ee=D%2?1:-1;Le(ae,A);const ne=A.clone(),ye=U(ae,0,.999)*$,pe=Math.floor(ye);k.copy(B[pe+1]).sub(B[pe]).normalize();const Ae=Math.atan2(k.x,k.z)+ee*t.range(.7,1.05),ve=Math.asin(U(k.y,-1,1)),me=Math.max(.5,z*Y(.2,.4,Math.sin(Math.PI*Math.min(1,ae*1.25)))*(1.05-.45*ae)*t.range(.8,1.2)),te=we(ne,Ae,ve*.6-.05,ve-t.range(.4,.75),me,4,.25,t);o.kind=1,o.coat=.9,o.rand=t(),ie();const be=me*t.range(.05,.08)+.2;xe(o,te,Se=>be*Math.pow(Math.sin(Math.PI*(.12+.88*Se)),.6)+.015,1,me,1.3),Me(te,4,me,.35,f<.66?.9:1.15,.8,3),D%3===0&&I.push(te[3].x,te[3].y,te[3].z,fe,ue,oe)}I.push(B[$>>1].x,B[$>>1].y,B[$>>1].z,fe,ue,oe),yield}M+=Y(1.75,.8,f)*t.range(.9,1.1),N++,yield}yield,o.pv=[0,0,0,0],o.wFn=null;for(let f=0;f<260&&J<se+260;f++){const b=t.range(4.5,l*.86),y=t.range(0,6.28);if(v.n3(Math.sin(y)*1.3,b*.2,Math.cos(y)*1.3)<-.25)continue;g(b,P);const F=L(b)*1.12+.1,z=Math.sin(y),R=Math.cos(y);A.set(P.x+z*F,b,P.z+R*F),o.kind=2,o.coat=t.range(.85,.97),o.rand=t(),Q();const G=t.range(.8,1.5);Pe(o,A,R,0,-z,z,R,Math.min(.9,F*1.3),G,.07,0),J++,E.push(A.x+z*.1,A.y-G*.5,A.z+R*.1)}yield;const Z=o.geometry();return yield,{geometry:Z,sources:E,needleSrc:I,limbTips:X,cards:J,nLimbs:q,triangles:o.ni/3,trunkAt:g}}const Ye=`
// wing of row 'row' at pattern point p: returns e (< 1 inside the teardrop); q = (across, 0..1 down the wing)
float hWing(vec2 p, float row, float rnd, out vec2 id, out vec2 q){
  float px = p.x + 0.5 * mod(row, 2.0) + 0.37 * hHash(vec2(row, 7.0 + rnd * 3.0));
  float cx = floor(px);
  id = vec2(cx, row) + floor(rnd * 97.0) * 13.0;
  float a = (hHash(id + 3.7) - 0.5) * 0.87;
  vec2 d = vec2(px - cx - 0.5, p.y - row);
  float c = cos(a), s = sin(a);
  d = vec2(d.x * c - d.y * s, d.x * s + d.y * c);
  float t = d.y / 1.75, tc = clamp(t, 0.0, 1.0);
  q = vec2(d.x, t);
  float hw = 0.5 * sqrt(max(sin(3.14159 * pow(tc, 1.35)), 0.0)) + 0.02;
  return max(abs(d.x) / hw, abs(t - 0.5) * 2.0);
}
// x = seconds since this wing flipped open (negative: still shut), y = how long it holds, z = 1 if it is there
vec3 hWingState(vec2 id, float coat, float tF, float te){
  float h = hHash(id), h2 = hHash(id + 17.3);
  float dt = te - (tF + h * 0.6), hold = 0.5 + h2 * 0.6;
  return vec3(dt, hold, (h2 < coat && dt < hold) ? 1.0 : 0.0);
}`,je=`
  // ---- the coat of wings ----
  vec2 p = m / vec2(0.07, 0.062);
  float fw = max(fwidth(p.x), fwidth(p.y));
  float lod = smoothstep(0.24, 0.1, fw) * (1.0 - hFarK), lodc = smoothstep(0.9, 0.3, fw) * (1.0 - hFarK);      // wing detail only where a wing is 5+ pixels
  float patchy = card ? 1.0 : smoothstep(0.06, 0.3, hNoise(vHPos.xz * 0.9 + vHPos.y * 0.6 + rnd * 20.0));
  float row = floor(p.y), tF = flipBase(vHPos);
  vec2 idA, qA, idB, qB;
  float eA = hWing(p, row - 1.0, rnd, idA, qA), eB = hWing(p, row, rnd, idB, qB);
  // far off a wing is smaller than a pixel: every cell counts as there and the coat is blended in by its coverage
  // instead (a per-cell coin toss there is pixel noise)
  float cov = coat * patchy, covT = mix(cov, step(0.02, cov), 1.0 - lodc), covB = card ? 1.0 : mix(1.0, min(1.0, cov * 1.25), 1.0 - lodc);
  vec3 base0 = base;
  vec3 sA = hWingState(idA, covT, tF, vHTe), sB = hWingState(idB, covT, tF, vHTe);
  if (card) {
    // the card's outline follows the wings: one whose root lies past the ragged hem or the sides is not there
    vec2 rA = (m - vec2(qA.x * 0.07, qA.y * 0.1085)) / vHDim, rB = (m - vec2(qB.x * 0.07, qB.y * 0.1085)) / vHDim;
    if (rA.y > 0.62 + 0.26 * hNoise(vec2(rA.x * 5.0 + rnd * 31.0, rnd * 7.0)) || abs(rA.x - 0.5) > 0.4 + 0.07 * hNoise(vec2(rA.y * 9.0, rnd * 13.0))) sA.z = 0.0;
    if (rB.y > 0.62 + 0.26 * hNoise(vec2(rB.x * 5.0 + rnd * 31.0, rnd * 7.0)) || abs(rB.x - 0.5) > 0.4 + 0.07 * hNoise(vec2(rB.y * 9.0, rnd * 13.0))) sB.z = 0.0;
  }
  float limA = sA.x < 0.0 ? 1.0 : smoothstep(sA.y, sA.y - 0.12, sA.x), limB = sB.x < 0.0 ? 1.0 : smoothstep(sB.y, sB.y - 0.12, sB.x);
  bool hitA = sA.z > 0.5 && (lod < 0.5 || eA < limA), hitB = sB.z > 0.5 && (lod < 0.5 || eB < limB);
  float clump = 0.78 + 0.44 * hNoise(m * 3.1 + rnd * 9.0);                      // survives distance
  if (hitA || hitB) {
    vec2 id = hitA ? idA : idB, q = hitA ? qA : qB;
    float e = hitA ? eA : eB, dt = hitA ? sA.x : sB.x;
    float h = mix(0.5, hHash(id), lodc);
    float fan = atan(q.x, q.y * 1.75 + 0.3);
    if (dt < 0.0) {
      // shut: grey-brown, veined from the root, dark where it tucks under the wing above, pale margin, dark outline
      vec3 wc = (card ? base : uWing) * (0.74 + 0.62 * h) * clump;
      wc = mix(wc, vec3(dot(wc, vec3(0.3333))) * vec3(1.03, 1.0, 0.95), 0.42);                 // dead-leaf grey-brown, not ochre
      if (card) {
        // each hanging cluster is a turned form: pale straw where it bellies out, shaded down one side and up under
        // the bough, so that a drape reads as a mass of closed wings with a body and not as a flat card
        float tx = clamp(vHUv.x, 0.0, 1.0) - 0.5, ty = clamp(vHUv.y, 0.0, 1.0), sd = rnd < 0.5 ? -1.0 : 1.0;
        float form = (0.6 + 0.62 * sqrt(max(0.0, 1.0 - 3.4 * tx * tx))) * (0.74 + 0.5 * clamp(0.5 + tx * sd, 0.0, 1.0));
        wc *= form * (0.78 + 0.4 * smoothstep(0.0, 0.3, ty)) * vec3(1.55, 1.5, 1.32);
      } else wc *= vec3(1.32, 1.25, 1.08);
      // dew on the wing edges: cold points of light, each winking on its own clock (only where a wing is large enough to carry one)
      float dewH = hHash(floor(m / 0.045) + rnd * 53.0), dewS = max(0.0, sin(uTime * (0.6 + 1.7 * dewH) + dewH * 90.0));
      hEmis += vec3(0.75, 0.86, 1.0) * (step(0.93, dewH) * dewS * dewS * dewS * dewS * lod * (1.0 - uWarm) * (0.8 + 1.6 * uRime));
      wc *= mix(1.0, 0.74 + 0.26 * smoothstep(0.0, 0.3, abs(sin(fan * 16.0))), lod);
      wc *= mix(1.0, 0.55 + 0.6 * smoothstep(0.0, 0.7, q.y), lod);
      wc = mix(wc, wc * 1.45 + 0.025, lod * smoothstep(0.6, 0.85, e) * 0.5);
      wc *= mix(1.0, 0.5, lod * smoothstep(0.88, 1.0, e));
      // shivering to warm up: single wings in 25 Hz bursts, and a tremor that passes through the whole cluster
      float ahead = smoothstep(-2.2, 0.0, dt);
      float burst = step(0.972 - 0.5 * ahead, hHash(id + floor(uTime * 1.3 + h * 7.0)));
      float shiv = burst * (0.5 + 0.5 * sin(uTime * 157.0 + h * 40.0)) * lodc;
      float wave = smoothstep(0.58, 0.85, hNoise(vHPos.xz * 0.7 + vec2(vHPos.y * 0.9 - uTime * 0.8, uTime * 0.35) + rnd * 30.0));
      wc *= 1.0 + 0.45 * shiv + 0.32 * wave * (0.6 + 0.4 * sin(uTime * 31.0 + h * 40.0 + vHPos.y * 3.0));
      wc = mix(wc, uOrange * 0.55, min(1.0, ahead * ahead * 0.35 * step(0.5, hHash(id + 5.1)) + 0.25 * shiv * ahead + 0.7 * shiv * hNearK));
      base = mix(base0, wc, covB);
    } else {
      // open: blazing orange, black veins and border, white dots; then it lets go
      float bord = max(smoothstep(0.55, 0.8, e), smoothstep(0.8, 0.95, q.y));
      float vein = smoothstep(0.0, 0.25, abs(sin(fan * 13.0)));
      float ink = mix(0.8, min(1.0 - 0.92 * bord, 0.35 + 0.65 * vein), lod);
      vec3 oc = uOrange * (0.7 + 0.6 * h) * ink * mix(clump * clump, 1.0, lodc);
      oc += vec3(0.5) * lod * bord * step(0.8, hHash(floor(q * vec2(7.0, 11.0)) + id));
      float flash = smoothstep(0.0, 0.1, dt);
      base = mix(base0, oc * 0.6, covB); hOpen = 1.0;
      hEmis += oc * vec3(1.0, 0.7, 0.4) * flash * (1.1 + 2.0 * lit) * covB;
    }
  } else if (card) {
    // between wings: the shaded layer underneath while the cluster hangs, nothing once it has flown
    bool inside = vHUv.y < 0.6 && abs(vHUv.x - 0.5) < 0.38 && vHTe < tF + 0.25 && coat > 0.5;
    if (!inside) discard;
    base *= 0.52 * clump;
  }
  if (uRime > 0.0 && kind > 0.5) {
    // rime: a smooth frosting of whatever faces the sky, breathing slowly over the tree, gone at arm's length
    float upN = (transpose(mat3(viewMatrix)) * normalize(vNormal)).y * (gl_FrontFacing ? 1.0 : -1.0);
    float rk = max(smoothstep(-0.15, 0.7, upN), card ? 0.3 * (1.0 - vHUv.y) : 0.0) * (0.42 + 0.3 * hNoise(vHPos.xz * 0.3 + vHPos.y * 0.17 + rnd * 3.0));
    base = mix(base, vec3(0.74, 0.79, 0.85), uRime * rk * (1.0 - hOpen) * smoothstep(4.0, 12.0, hVd));
  }
`;function Ve(c,s){const e=new a.MeshStandardMaterial({vertexColors:!0,side:a.DoubleSide,roughness:.92,metalness:0});return e.customProgramCacheKey=()=>"monarch-great-bough-v2",e.onBeforeCompile=t=>{Object.assign(t.uniforms,c),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
${ze}
uniform float uSpring;
attribute vec4 aPivot; attribute vec4 aInfo; attribute vec2 aDim;
#ifdef USE_INSTANCING
attribute vec3 aInst;      // x = clock offset (s), y = coat multiplier, z = pattern offset
#endif
varying vec3 vHPos; varying vec2 vHUv; varying vec4 vHInfo; varying vec2 vHDim; varying float vHRel, vHTe;
float gTe;
float hLimbAngle(){
  float w = aInfo.y; if (w <= 0.0) return 0.0;
  vec2 d = vec2(sin(aPivot.w), cos(aPivot.w));
  float tRel = flipBase(aPivot.xyz + vec3(d.x, 0.0, d.y) * 2.5) + 1.25;
  float t = gTe - tRel;
  float a = t > 0.0 ? uSpring * (1.0 - exp(-1.5 * t) * cos(7.54 * t)) : 0.0;
  // heavy slow sway before release, light wind after
  a += (t > 0.0 ? 0.02 : 0.008) * sin(uTime * (t > 0.0 ? 1.3 : 0.7) + aPivot.w * 7.0 + aPivot.y * 1.7);
  return a * w;
}
vec3 hBend(vec3 q, float a){
  vec2 d = vec2(sin(aPivot.w), cos(aPivot.w));
  float r = dot(q.xz, d); vec2 lat = q.xz - d * r;
  float c = cos(a), s = sin(a);
  float r2 = r * c - q.y * s, h2 = q.y * c + r * s;
  return vec3(lat.x + d.x * r2, h2, lat.y + d.y * r2);
}`).replace("#include <beginnormal_vertex>",`gTe = uTe;
#ifdef USE_INSTANCING
gTe = uTe - aInst.x;
#endif
float hAng = hLimbAngle();
vec3 objectNormal = hBend(normal, hAng);`).replace("#include <begin_vertex>",`vec3 transformed = aPivot.xyz + hBend(position - aPivot.xyz, hAng);
vHPos = position; vHUv = uv; vHInfo = aInfo; vHDim = aDim; vHRel = hAng; vHTe = gTe;
#ifdef USE_INSTANCING
vHInfo.w *= aInst.y; vHInfo.z = fract(aInfo.z + aInst.z);
#endif`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
${ze}
uniform vec3 uShaftCol, uOrange, uSunDir, uWing, uFill; uniform float uRime, uWarm;
varying vec3 vHPos; varying vec2 vHUv; varying vec4 vHInfo; varying vec2 vHDim; varying float vHRel, vHTe;
${Ye}
vec3 hEmis; float hTrans, hBack;`).replace("#include <color_fragment>",`#include <color_fragment>
{
  float kind = vHInfo.x, rnd = vHInfo.z, coat = vHInfo.w;
  vec3 base = diffuseColor.rgb;
  hEmis = vec3(0.0); hTrans = 0.0; hBack = 0.0;
  float lit = shaftLit(vHPos, vHTe);
  vec2 m = vHUv * vHDim;                       // metres on the surface
  float fwm = max(fwidth(m.x), fwidth(m.y));   // metres per pixel (taken here, outside every branch)
  bool card = kind > 1.5;
  float hVd = length(vViewPosition), hFarK = smoothstep(26.0, 42.0, hVd), hNearK = 1.0 - smoothstep(12.0, 30.0, hVd), hOpen = 0.0;
  if (kind < 0.5) {
    // bark: long vertical plates with dark furrows
    float pl = hNoise(vec2(m.x * 7.0 + rnd * 9.0, m.y * 0.9));
    float fu = smoothstep(0.42, 0.5, abs(hNoise(vec2(m.x * 15.0, m.y * 1.6 + pl * 2.0)) - 0.5) * 2.0 * 0.5 + 0.25 * pl);
    base *= 0.8 + 0.7 * pl; base *= mix(0.55, 1.0, fu);
  } else if (!card) {
    // fir frond: branchlets angled forward off the rachis, needles across them
    // (a comb of branchlets every 22 cm with a fringe of needle tips cut into the outline; beyond ~35 m the
    // stripes give way to their average so a distant fir is a dark toothed cone, not a zig-zag)
    // The pad is cut into sprays: side branches swept forward off the rachis, each one tapering to a point with
    // a saw edge of needle tufts and open air between it and the next. Every scale of the pattern is faded out by
    // its own size in pixels (fwidth), so it never turns to moire: far off the gaps close and a toothed outline is left.
    float v = abs(vHUv.y), lat = abs(m.y);
    float nS = clamp(floor(vHDim.x / 0.42), 4.0, 16.0), per = max(vHDim.x / nS, 0.05);
    float bx = (m.x - lat * 0.75) / per + rnd * 5.0 + 0.3 * hNoise(m * 1.3 + rnd * 11.0);
    float bid = floor(bx), bf = abs(fract(bx) - 0.5) * 2.0;                                  // 0 on a spray's midrib, 1 half way to the next
    float blen = 0.68 + 0.32 * hHash(vec2(bid, floor(rnd * 64.0) + 1.0)), vv = v / blen;
    float fine = 1.0 - smoothstep(0.2, 0.55, fwm / per), fine2 = 1.0 - smoothstep(0.25, 0.7, fwm / 0.075);
    float tuft = fract(lat / 0.075 + bid * 0.37 + rnd * 3.0);
    float wS = mix(1.0, 0.15, smoothstep(0.08, 1.0, vv)) * (1.0 - 0.3 * tuft * fine2);
    float cutN = max(bf / wS, vv + 0.25 * bf * bf), cutF = v / (0.94 - 0.3 * bf);
    if (mix(cutF, cutN, fine) > 1.0) discard;
    float ndK = 1.0 - smoothstep(0.25, 0.7, fwm / 0.024);
    float nd = abs(fract(lat / 0.024 + bf * 1.5) - 0.5) * 2.0;
    base *= mix(0.86, 0.64 + 0.46 * nd, ndK);                                                // needles across each spray
    base *= mix(0.9, 0.62 + 0.4 * smoothstep(0.0, 0.3, bf), fine);                           // its dark midrib
    base *= mix(1.0, 0.8 + 0.4 * hHash(vec2(bid, floor(rnd * 64.0) + 9.0)), fine);           // no two sprays the same green
    base = mix(base, base * vec3(1.15, 1.28, 1.05), smoothstep(0.5, 1.0, vv) * 0.65);      // paler new growth at the tips
    base *= mix(0.6, 1.0, smoothstep(0.0, 0.1, v));                                       // dark rachis
    base = mix(base, vec3(dot(base, vec3(0.3333))) * vec3(0.9, 1.0, 1.03), 0.5) * 2.2;      // a dark, desaturated blue-green: orange is the only loud colour here
    base *= (1.0 - 0.3 * uWarm) * mix(1.0, 0.8, hFarK);                                                               // in sun it stays the dark fir of the brief, never mint
    bool hTop = dot(vNormal, vViewPosition) > 0.0;                                           // looking at the bough's upper side
    if (!hTop) { base *= 0.72; hBack = 1.0; }                                                // shaded underside: sky light comes through the needles (see emissive)
    // the wings hang under the bough and along its hem: from above the fir's own green shows through
    else coat *= mix(0.1, 1.0, max(smoothstep(0.62, 0.92, vHUv.x), smoothstep(0.55, 0.95, v)));
    hTrans = 0.5;
  } else {
    // card outline: ragged hem and sides so the drape reads as hanging wings, not a rectangle
    hTrans = 0.3;
  }
${je}
  diffuseColor.rgb = base;
}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
{
  float lit = shaftLit(vHPos, vHTe);
  float nl = dot(normal, normalize((viewMatrix * vec4(uSunDir, 0.0)).xyz));
  float wrap = mix(clamp(nl * 0.75 + 0.25, 0.0, 1.0), 0.35 + 0.65 * abs(nl), hTrans);
  float skyUp = 0.5 + 0.5 * (transpose(mat3(viewMatrix)) * normal).y;
  totalEmissiveRadiance += diffuseColor.rgb * (uShaftCol * (lit * wrap) + uFill * (0.55 + 0.45 * skyUp) + uShaftCol * (uWarm * 0.16 * (0.4 + 0.6 * skyUp))
    + (uFill * vec3(0.8, 1.05, 0.85) * 0.9 + uShaftCol * (0.08 * uWarm)) * hBack) + hEmis;
}`)},e}const Be=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float hFog = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    float hFog = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  float hFog = 0.0;
#endif`,Ke=[0,0,.62,0,0,-.95,-1.3,0,.36,1.3,0,.36],$e=`
float flyWing(vec3 b, float px, float seed, out float white){
  white = 0.0;
  if (px < 2.4) return 0.85;
  vec2 w = vec2(1.3 * b.z, 0.62 * b.x - 0.95 * b.y + 0.36 * b.z);
  vec2 q1 = vec2((w.x - 0.55) / 0.6, (w.y - 0.1 * w.x - 0.2) / 0.25), q2 = vec2((w.x - 0.3) / 0.34, (w.y + 0.2) / 0.3);
  float a2 = atan(q2.y, q2.x + 1.0e-4);
  float d1 = length(q1), d2 = length(q2) * (1.0 + 0.055 * cos(a2 * 9.0));
  bool body = w.x < 0.05 && w.y > -0.5 && w.y < 0.54;
  float d = min(d1, d2);
  if (d > 1.0 && !body) discard;
  float det = smoothstep(4.0, 10.0, px);
  bool fore = d1 < d2;
  vec2 root = fore ? vec2(-0.1, 0.16) : vec2(-0.06, -0.12);
  float fan = atan(w.y - root.y, w.x - root.x);
  float vein = smoothstep(0.0, 0.2, abs(sin(fan * (fore ? 11.0 : 8.0) + 0.6)));
  float cell = smoothstep(0.02, 0.07, abs(d - 0.5));                                   // the cross vein that closes the cell
  float margin = smoothstep(0.8, 0.9, d);
  vec2 dg = vec2(fract(fan * (fore ? 9.0 : 6.5) + seed * 3.0) - 0.5, fract((d - 0.82) * 11.0) - 0.5);
  white = det * step(0.84, d) * step(d, 0.99) * smoothstep(0.42, 0.22, length(dg * vec2(1.0, 1.3)));
  float ink = (1.0 - 0.94 * margin) * (0.55 + 0.45 * vein * cell) * (1.14 - 0.25 * d);
  if (body || d > 1.0) { ink = 0.05; white = 0.0; }
  return mix(0.85, ink, det);
}`;function Xe(c,s,e,t){const v=c.rng.fork("flyers"),o=t.flyers,l=new a.InstancedBufferGeometry;l.setAttribute("position",new a.BufferAttribute(new Float32Array(Ke),3)),l.setAttribute("aBary",new a.BufferAttribute(new Float32Array([1,0,0,0,1,0,0,0,1,0,0,1]),3)),l.setIndex([0,2,1,0,1,3]);const x=new Float32Array(o*3),h=new Float32Array(o*4),u=e.sources,p=u.length/3;for(let r=0;r<o;r++){const m=Math.floor(v()*p)*3;x[r*3]=u[m]+v.range(-.25,.25),x[r*3+1]=u[m+1]+v.range(-.4,.3),x[r*3+2]=u[m+2]+v.range(-.25,.25),h[r*4]=v(),h[r*4+1]=v(),h[r*4+2]=v(),h[r*4+3]=v()}l.setAttribute("aSrc",new a.InstancedBufferAttribute(x,3)),l.setAttribute("aSeed",new a.InstancedBufferAttribute(h,4)),l.instanceCount=o;const n=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),side:a.DoubleSide,fog:!0,vertexShader:`
#include <common>
#include <fog_pars_vertex>
${ze}
attribute vec3 aBary; attribute vec3 aSrc; attribute vec4 aSeed;
uniform vec3 uRiver[8], uSunDir; uniform float uRiverLen, uSize, uSlope, uLinger, uWarm, uBurst;
varying vec3 vBary; varying float vLit; varying float vSeed; varying float vFade; varying float vPx; varying float vBack;
vec3 riverPt(float s){
  float f = clamp(s / uRiverLen, 0.0, 1.0) * 7.0; float fi = min(floor(f), 6.0); float t = f - fi; int k = int(fi);
  vec3 p0 = uRiver[max(k - 1, 0)], p1 = uRiver[k], p2 = uRiver[min(k + 1, 7)], p3 = uRiver[min(k + 2, 7)];
  return 0.5 * ((2.0 * p1) + (p2 - p0) * t + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t * t + (3.0 * p1 - p0 - 3.0 * p2 + p3) * t * t * t);
}
vec3 wander(float s, float t){
  return vec3(sin(t * 0.83 + s * 6.3) + 0.5 * sin(t * 1.9 + s * 17.0),
              0.7 * sin(t * 1.07 + s * 11.0) + 0.4 * sin(t * 2.3 + s * 5.0),
              cos(t * 0.71 + s * 9.0) + 0.5 * cos(t * 1.7 + s * 13.0));
}
vec3 flyPos(float te, float tr, out float fade){
  float a = max(te - tr, 0.0);
  float rs = length(aSrc.xz) + 0.001; vec2 rad = aSrc.xz / rs;
  float out1 = 1.0 - exp(-a * 0.8);
  float sw = a * 0.2 * (aSeed.y - 0.35) + out1 * (aSeed.x - 0.5) * 1.6;
  float cs = cos(sw), sn = sin(sw); vec2 rr = vec2(rad.x * cs - rad.y * sn, rad.x * sn + rad.y * cs);
  float cr = rs + out1 * (3.0 + 17.0 * aSeed.w * aSeed.w + 5.0 * aSeed.y);
  vec3 cloud = vec3(rr.x * cr, aSrc.y + out1 * (1.0 + 10.0 * aSeed.z * aSeed.z) + 0.6 * sin(a * 0.5 + aSeed.x * 6.0), rr.y * cr);
  float sp = smoothstep(0.0, 0.3, a) * (1.0 - smoothstep(0.9, 2.2, a));
  float sa = a * 7.0 + aSeed.x * 40.0;
  cloud += vec3(cos(sa) * rad.y, sin(sa), -cos(sa) * rad.x) * 0.55 * sp;
  cloud += wander(aSeed.x * 10.0 + aSeed.w, te * 0.8) * (0.25 + 2.4 * out1);
  // the river
  float tG = aSeed.w > 1.0 - uLinger ? 1.0e4 : 1.6 + aSeed.z * 6.5;
  float gth = smoothstep(tG, tG + 4.5, a);
  float s = aSeed.x * 30.0 + max(a - tG - 1.2, 0.0) * (9.0 + 2.5 * aSeed.y);
  vec3 rp = riverPt(s);
  float ca = aSeed.x * 6.2832 + s * 0.035 + te * 0.15;
  float funnel = 1.0 - 0.55 * smoothstep(uRiverLen - 62.0, uRiverLen - 14.0, s);              // the river narrows into the portal
  float crad = sqrt(aSeed.y) * (3.6 + 1.2 * sin(s * 0.05 + aSeed.z * 6.0)) * (1.0 + 1.6 * (1.0 - smoothstep(0.0, 45.0, s))) * funnel;
  float braid = smoothstep(25.0, 70.0, s), strand = floor(aSeed.z * 3.0);                    // the river runs in three plaited strands
  rp += vec3(cos(ca) * crad, sin(ca) * crad * 0.6, 0.0) * (1.0 - 0.3 * braid) + wander(aSeed.y * 9.0 + aSeed.z, te * 1.1 + s * 0.05) * 0.7;
  rp += vec3(2.3 * sin(s * 0.052 + strand * 2.1 + te * 0.13), 0.9 * sin(s * 0.041 + strand * 4.0), 0.0) * braid * funnel;
  vec3 pos = mix(cloud, rp, gth);
  pos.y = max(pos.y, 1.2 - uSlope * pos.z + aSeed.x);
  fade = step(tr, te) * (1.0 - smoothstep(uRiverLen - 18.0, uRiverLen - 2.0, s));
  return pos;
}
void main(){
  float tr = flipBase(aSrc) + aSeed.x * 0.6 + 0.35 + aSeed.y * 0.35;
  float fade, f2;
  vec3 c = flyPos(uTe, tr, fade);
  vec3 c2 = flyPos(uTe + 0.12, tr, f2);
  vec3 fw = c2 - c; float fl = length(fw);
  fw = fl > 1e-4 ? fw / fl : vec3(0.0, 0.0, 1.0);
  fw = normalize(fw + vec3(0.0, 0.15, 0.0));
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)) + 1e-4), up = cross(rt, fw);
  // no two fly alike: each holds its own heading and bank about the stream's direction, and wavers
  float yaw = (fract(aSeed.y * 13.7 + aSeed.z) - 0.5) * 1.6 + 0.3 * sin(uTime * 1.3 + aSeed.x * 31.0);
  float rol = (fract(aSeed.z * 9.1 + aSeed.w) - 0.5) * 1.6 + 0.3 * sin(uTime * 1.7 + aSeed.y * 23.0);
  vec3 fwY = fw * cos(yaw) + rt * sin(yaw); rt = rt * cos(yaw) - fw * sin(yaw); fw = fwY;
  vec3 rtR = rt * cos(rol) + up * sin(rol); up = up * cos(rol) - rt * sin(rol); rt = rtR;
  // flap with glide pauses
  float ph = uTime * (46.0 + 16.0 * aSeed.z) + aSeed.x * 60.0;
  float glide = smoothstep(0.55, 0.7, fract(uTime * 0.37 + aSeed.w * 5.0 + aSeed.y));
  float ang = mix(0.15 + 1.05 * sin(ph), 0.06 + 0.34 * aSeed.z, glide);
  ang = mix(1.45, ang, smoothstep(0.0, 0.35, uTe - tr));          // wings still shut as it lets go
  vec4 mc = modelViewMatrix * vec4(c, 1.0);
  float sc = max(uSize, -mc.z * 0.0021) * (0.7 + 0.7 * fract(aSeed.w * 7.31 + aSeed.x * 3.7)) * fade * smoothstep(0.4, 3.2, -mc.z);   // shrink away at the lens
  sc *= 1.0 + uBurst * (1.0 - smoothstep(0.8, 4.5, uTe - tr));                       // the burst: larger while it pours out of the tree
  float side = position.x;
  vec3 lp = fw * position.z + rt * (side * cos(ang)) + up * (abs(side) * sin(ang));
  vec4 mvPosition = modelViewMatrix * vec4(c + lp * sc, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vBary = aBary; vSeed = aSeed.x; vFade = fade; vPx = sc / max(-mc.z * 0.0022, 1e-4);
  vec3 wv = (modelMatrix * vec4(c, 1.0)).xyz - cameraPosition;
  vBack = uWarm * smoothstep(0.6, 0.95, dot(wv, uSunDir) / max(length(wv), 1e-3));      // between the lens and the sun: amber glass
  vLit = shaftLit(c, uTe);
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uOrange, uShaftCol, uAmb;
varying vec3 vBary; varying float vLit; varying float vSeed; varying float vFade; varying float vPx; varying float vBack;
${$e}
void main(){
  if (vFade < 0.01) discard;
  float white, ink = flyWing(vBary, vPx, vSeed, white);
  vec3 col = mix(uOrange * (0.8 + 0.5 * vSeed) * ink, vec3(0.75), white);
  if (!gl_FrontFacing) col = mix(col, vec3(dot(col, vec3(0.5))) * vec3(1.3, 0.9, 0.55), 0.3);   // paler underside
  // shade light + amber-glass glow where the shaft backlights it
  vec3 outc = col * (uAmb + uShaftCol * vLit * 0.35) + col * vec3(1.0, 0.74, 0.45) * (0.15 + vLit * 0.8 + vBack * 0.9) * ink;
  ${Be}
  #ifdef USE_FOG
    outc = mix(outc, fogColor, hFog);
  #endif
  gl_FragColor = vec4(outc, 1.0);
}`});Object.assign(n.uniforms,s);const d=new a.Mesh(l,n);return d.frustumCulled=!1,d.name="monarch-flyers",d}function Je(c,s,e,t){const v=c.rng.fork("needles"),o=1800,l=e.needleSrc,x=l.length/6,h=new a.InstancedBufferGeometry;h.setAttribute("position",new a.BufferAttribute(new Float32Array([-.5,-1,0,.5,-1,0,.5,1,0,-.5,1,0]),3)),h.setIndex([0,1,2,0,2,3]);const u=new Float32Array(o*3),p=new Float32Array(o*3),n=new Float32Array(o*4);for(let m=0;m<o;m++){const g=Math.floor(v()*x)*6;u[m*3]=l[g]+v.range(-.5,.5),u[m*3+1]=l[g+1]+v.range(-.3,.6),u[m*3+2]=l[g+2]+v.range(-.5,.5),p[m*3]=l[g+3],p[m*3+1]=l[g+4],p[m*3+2]=l[g+5],n[m*4]=v(),n[m*4+1]=v(),n[m*4+2]=v(),n[m*4+3]=v()}h.setAttribute("aSrc",new a.InstancedBufferAttribute(u,3)),h.setAttribute("aPiv",new a.InstancedBufferAttribute(p,3)),h.setAttribute("aSeed",new a.InstancedBufferAttribute(n,4)),h.instanceCount=o;const d=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),side:a.DoubleSide,fog:!0,vertexShader:`
#include <common>
#include <fog_pars_vertex>
${ze}
attribute vec3 aSrc; attribute vec3 aPiv; attribute vec4 aSeed;
uniform float uSlope;
varying float vLit; varying float vShow;
void main(){
  // released over the limb's two bounces
  float tr = flipBase(aPiv) + 1.25 + aSeed.x * aSeed.x * 3.5;
  float a = uTe - tr;
  float fall = 1.4 + 1.3 * aSeed.y;
  vec3 c = aSrc;
  c.y -= fall * max(a, 0.0) - 0.4 * (1.0 - exp(-max(a, 0.0) * 2.0));
  c.xz += vec2(sin(a * 1.7 + aSeed.z * 6.3), cos(a * 1.3 + aSeed.w * 6.3)) * 0.35 * min(a, 2.0);
  float gy = -uSlope * c.z + 0.05;
  vShow = step(0.0, a) * step(gy, c.y) * smoothstep(0.0, 0.2, a);
  float sp = a * (5.0 + 6.0 * aSeed.w) + aSeed.z * 6.3;
  vec3 ax = normalize(vec3(sin(sp), 0.6 * cos(sp * 0.7), cos(sp)));
  vec3 bx = normalize(cross(ax, vec3(0.3, 1.0, 0.2)));
  vec4 mc = modelViewMatrix * vec4(c, 1.0);
  float wd = max(0.012, -mc.z * 0.0011), ln = max(0.09 + 0.07 * aSeed.x, -mc.z * 0.003);
  vec4 mvPosition = modelViewMatrix * vec4(c + (ax * position.y * ln + bx * position.x * wd) * vShow, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vLit = shaftLit(c, uTe);
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uShaftCol, uAmb, uNeedle;
varying float vLit; varying float vShow;
void main(){
  if (vShow < 0.5) discard;
  vec3 outc = uNeedle * (uAmb + uShaftCol * vLit * 2.2);
  ${Be}
  #ifdef USE_FOG
    outc = mix(outc, fogColor, hFog);
  #endif
  gl_FragColor = vec4(outc, 1.0);
}`});Object.assign(d.uniforms,s);const r=new a.Mesh(h,d);return r.frustumCulled=!1,r.name="monarch-needles",r}function Qe(c){const s=new a.CylinderGeometry(1,1,1,40,1,!0);s.translate(0,.5,0);const e=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uShaftI:{value:0},uLen:{value:120},uLow:{value:.2},uLocal:{value:new a.Matrix4}}]),side:a.DoubleSide,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,fog:!0,vertexShader:`
#include <common>
#include <fog_pars_vertex>
uniform mat4 uLocal; uniform float uSlope;
varying vec3 vN; varying vec3 vV; varying vec3 vP; varying float vH;
void main(){
  vP = position;
  vec3 hl = (uLocal * vec4(position, 1.0)).xyz; vH = hl.y + uSlope * hl.z;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * vec3(position.x, 0.0, position.z));
  vV = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uShaftCol; uniform float uShaftI, uTime, uLen, uLow;
varying vec3 vN; varying vec3 vV; varying vec3 vP; varying float vH;
float hHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hHash(i), hHash(i+vec2(1.,0.)), f.x), mix(hHash(i+vec2(0.,1.)), hHash(i+vec2(1.,1.)), f.x), f.y); }
void main(){
  float body = pow(abs(dot(normalize(vN), normalize(vV))), 1.8);
  float ang = atan(vP.z, vP.x);
  float along = vP.y * uLen;
  float streak = 0.55 + 0.45 * hNoise(vec2(ang * 5.0 + 20.0, along * 0.03 - uTime * 0.05))
               + 0.35 * hNoise(vec2(ang * 17.0, along * 0.06 + uTime * 0.11));
  float mist = 0.75 + 0.5 * hNoise(vec2(ang * 2.0 + uTime * 0.07, along * 0.16 - uTime * 0.5));
  float ends = smoothstep(0.0, uLow, vP.y) * (1.0 - smoothstep(0.35, 1.0, vP.y)) * smoothstep(0.0, 16.0, vH);
  vec3 outc = uShaftCol * (uShaftI * body * streak * mist * ends);
  ${Be}
  gl_FragColor = vec4(outc * (1.0 - hFog * 0.7), 1.0);
}`});e.uniforms.uShaftCol=c.uShaftCol,e.uniforms.uTime=c.uTime,e.uniforms.uSlope=c.uSlope;const t=new a.Mesh(s,e);return t.frustumCulled=!1,t.renderOrder=5,t.name="monarch-shaft",t}function*Re(c,s){const e=s.rng||c.rng.fork("lite-fir"),t=c.noise,v=s.palette||Ne,o=s.lod??1,l=s.height??38,x=s.yLow??e.range(3.4,4.6),h=s.limbMax??l*.2,u=l*.014+.12,p=4,n=qe(14e3,42e3),d=new a.Color(v[3]),r=new a.Color(v[2]),m=new a.Color(v[4]),g=e.range(0,6.28),C=e.range(.2,1),H=(i,M)=>{const N=U(i/l,0,1);return M.set(Math.sin(g)*C*N*N,i,Math.cos(g)*C*N*N)},T=i=>u*Math.pow(U(1-i/(l+.4),.004,1.2),.82)+.02,L=()=>{const i=e.range(.75,1.25),M=e.range(-.012,.02);n.c=[r.r*i,(r.g+M)*i,(r.b+M*.5)*i]},V=()=>{const i=e.range(.6,1.1);n.c=[m.r*i,m.g*i*e.range(.92,1.02),m.b*i*e.range(.85,1)]};n.kind=0,n.pv=[0,0,0,0],n.rand=e(),n.wFn=null;const S=[8,6,5][o-1],W=[10,6,4][o-1],P=[],E=new a.Vector3;n.d=[Math.PI*2*u,l+p];for(let i=0;i<=W;i++){const M=i/W,N=-p+(l+p)*Math.pow(M,1.4),O=[];H(N,E);const q=T(Math.max(N,0))*(1+.6*Math.exp(-Math.max(N+.6,0)/1.5));n.coat=N>3.5&&N<l*.93?.82:.3;for(let Z=0;Z<=S;Z++){const f=Z%S/S*Math.PI*2,b=Math.cos(f),y=Math.sin(f),F=1.7*(.85+.3*t.n2(f*5+3,N*1.3));n.c=[d.r*F,d.g*F,d.b*F],O.push(n.v(E.x+b*q,N,E.z+y*q,b,0,y,Z/S,M))}P.push(O)}for(let i=0;i<W;i++)for(let M=0;M<S;M++)n.quad(P[i][M],P[i+1][M],P[i+1][M+1],P[i][M+1]);const I=new a.Vector3,X=new a.Vector3,j=(i,M,N,O,q)=>{const Z=U(N/O,0,.999)*M,f=Math.floor(Z);X.lerpVectors(i[f],i[f+1],Z-f),k.copy(i[f+1]).sub(i[f]).normalize();const b=e.sign(),y=Math.hypot(k.z,k.x)||1,F=k.z/y*b,z=-k.x/y*b,R=e.range(1.2,2.3)*q*(1-.4*N/O),G=e.range(.9,1.5)*(o===3?1.5:1);n.kind=2,n.coat=e.range(.86,.98),n.rand=e(),V(),X.x+=F*e.range(0,.15),X.z+=z*e.range(0,.15),Pe(n,X,k.x,k.y,k.z,F,z,G,R,e.range(.08,.25),n.wFn(X),2)};let A=x,J=e.range(0,6.28),se=0;const he=[6,5,4][o-1],ie=[1.3,1.65,2.2][o-1],Q=[3,2,2][o-1],de=[.6,.7,.9][o-1];for(;A<l-1.2;){const i=U((A-x)/(l-x),0,1),M=i>.9?4:he;J+=.9+e.range(-.2,.2);for(let N=0;N<M;N++){const O=J+N/M*Math.PI*2+e.range(-.25,.25),q=Y(h,.9,Math.pow(i,.9))*e.range(.78,1.12),Z=A+e.range(-de,de)*(1-.6*i);H(Z,E);const f=T(Z);I.set(E.x+Math.sin(O)*f*.6,Z,E.z+Math.cos(O)*f*.6);const b=re(.8,1,i),y=Y(.12,.55,i)+e.range(-.08,.08),F=Y(-e.range(.68,.9),-.25,b),z=we(I,O,y,F,q,Q,Y(.16,0,b),e),R=I.x,G=I.y,ce=I.z;n.pv=[R,G,ce,O],n.rand=e(),n.wFn=B=>.55+.45*U(Math.hypot(B.x-R,B.z-ce)/(q*.8),0,1),n.kind=1,n.coat=.92,L();const ge=o===1?q*.16+.55:o===2?q*.21+.65:q*.31+.9,le=B=>ge*Math.pow(Math.sin(Math.PI*Math.min(1,.08+.92*Math.pow(B,1.3))),.6)+.03;xe(n,z,le,1,q,1.15),se=Math.max(se,Math.hypot(z[Q].x,z[Q].z));const $=q>2.2?[2,1,1][o-1]:1;for(let B=0;B<$;B++)j(z,Q,q*(.3+.62*(B+e.range(.2,.8))/$),q,1);if(o<3){const B=q*e.range(.55,.72),fe=e.sign()*e.range(.5,.72),ue=we(I,O+e.range(-.4,.4),y-e.range(.3,.5),F-.1,B,Q,.1,e);n.kind=1,n.rand=e(),n.coat=.9,L(),xe(n,ue,oe=>.85*le(oe),1,B,1.3,fe)}}A+=Y(1.75,.8,i)*e.range(.9,1.1)*ie,yield}const w=n.geometry();return w.computeBoundingSphere(),w.userData={height:l,radius:se,yLow:x,limbMax:h,triangles:n.ni/3},w}function et(c,s={}){const e=Re(c,s);let t;for(;!(t=e.next()).done;);return t.value}async function tt(c,s={}){const e=Re(c,s);let t;for(;!(t=e.next()).done;)await c.yield?.();return t.value}async function ot(c,s={}){const e=c.rng.fork("monarch-hero"),t=(s.palette&&s.palette.length>=7?s.palette:Ne).slice(),v={height:e.range(42,47),yLow:e.range(6.5,9),limbMax:e.range(12.4,14.4),trunkRadius:e.range(.95,1.15),flyers:Math.round(U(s.flyers??26e3,1e3,3e4))},o=new a.Color(t[2]).lerp(new a.Color(e.chance(.5)?"#2f4a52":"#3d4a2c"),e.range(.1,.35)).multiplyScalar(1.25),l=new a.Color(t[4]).lerp(new a.Color(e.chance(.5)?"#7d766e":"#8e7a66"),e.range(0,.4)),x=t.slice();x[2]="#"+o.getHexString(),x[4]="#"+l.getHexString();const h=v.height,u=Math.tan(s.slope??0),p=new a.Vector3().fromArray(s.sunDir||[-.6,.7,.4]).normalize(),n=new a.Vector2(p.x,p.z);n.lengthSq()<1e-6&&n.set(1,0),n.normalize();let d;if(s.riverPoints&&s.riverPoints.length>=2){const w=s.riverPoints.map(i=>i.isVector3?i.clone():new a.Vector3(i[0],i[1],i[2]));d=w.length===8?w:new a.CatmullRomCurve3(w,!1,"centripetal").getSpacedPoints(7)}else{d=[];const w=e.range(0,6.28);for(let i=0;i<8;i++){const M=10+i*30;d.push(new a.Vector3(i?Math.sin(w+i*.9)*3:0,Y(11,4.5,re(0,2.2,i))-u*M,M))}}let r=0;for(let w=1;w<8;w++)r+=d[w].distanceTo(d[w-1]);const m=h+6.5,g={uTe:{value:-2},uTime:{value:0},uY0:{value:m},uSpeed:{value:Fe},uAfter:{value:s.afterLight??.6},uSunH:{value:new a.Vector3(n.x,n.y,We)},uSunDir:{value:p.clone()},uSpring:{value:.39},uShaftCol:{value:new a.Color(t[5]).multiplyScalar(2.3)},uOrange:{value:new a.Color(t[6])},uWing:{value:l.clone()},uAmb:{value:new a.Color(t[0]).multiplyScalar(.62)},uFill:{value:new a.Color(t[0]).multiplyScalar(s.fill??.5)},uNeedle:{value:new a.Color(t[2]).lerp(new a.Color("#c9b46a"),.45).multiplyScalar(1.6)},uRiver:{value:d},uRiverLen:{value:r},uSize:{value:.12},uSlope:{value:u},uLinger:{value:.16},uRime:{value:0},uWarm:{value:0},uBurst:{value:s.burst??.6}},C=new a.Group;C.name="great-bough-tree";let H;{const w=Oe(c,v,x);let i;for(;!(i=w.next()).done;)await c.yield?.();H=i.value}await c.yield?.(),await c.yield?.();const T=new a.Mesh(H.geometry,Ve(g,x));T.name="great-bough",T.frustumCulled=!1,C.add(T),await c.yield?.();const L=Xe(c,g,H,v);C.add(L),await c.yield?.();const V=Je(c,g,H,v);C.add(V),await c.yield?.();let S=null;const W=170,P=7.5;s.shaft!==!1&&(S=Qe(g),S.material.uniforms.uLen.value=W,S.quaternion.setFromUnitVectors(new a.Vector3(0,1,0),p),S.scale.set(P,W,P*1.15),C.add(S));const E=H.limbTips.slice().sort((w,i)=>w.y-i.y).slice(0,24),I=[];for(let w=0;w<6;w++)I.push(E[Math.floor(e()*E.length)].clone());const j={crown:H.trunkAt(h,new a.Vector3).clone(),revealHold:new a.Vector3(-21,7,-21),revealLook:new a.Vector3(0,h*.62,0),flyThrough:[[-21,7,-21],[-22.5,7,-8],[-21.5,6.6,6],[-16,6.2,21],[-7.5,5.6,36],[-2,5,52],[0,4.6,74]].map(w=>new a.Vector3(w[0],w[1]-u*w[2],w[2])),riverMouth:d[1].clone(),riverDir:d[2].clone().sub(d[1]).normalize(),riverPoints:d.map(w=>w.clone()),portalSeat:{position:d[7].clone().add(new a.Vector3(0,2.5,0)),facing:d[6].clone().sub(d[7]).setY(0).normalize()},sunDir:p.clone(),limbTips:I};let A=null,J=-2;const se=s.shaftGain??.2,he=new a.Vector3(0,0,0),ie=w=>m-Fe*w,Q=new a.Vector3;function de(w){if(J=A!==null?A:((w-6.7)%18+18)%18-2,g.uTe.value=J,g.uTime.value=w,S){const i=ie(J)+P,M=Math.max(0,3-i)*1.07;Q.set(0,Math.max(i,3)-u*M,M);const N=(Q.y+u*M+14)/Math.max(p.y,.2);S.position.copy(Q).addScaledVector(p,-N),S.material.uniforms.uLow.value=8/W,S.updateMatrix(),S.material.uniforms.uLocal.value.copy(S.matrix);const O=re(-.8,.4,J)*(1-re(25,70,M));S.material.uniforms.uShaftI.value=se*O,S.visible=O>.001;const q=Math.max(i,3)-1;he.set(Q.x-p.x*q/Math.max(p.y,.2),Q.z-p.z*q/Math.max(p.y,.2),O)}}return de(0),{object:C,radius:14,height:h,center:new a.Vector3(0,h*.5,0),anchors:j,eventSeconds:_e,sweepSeconds:(m+5)/Fe,setProgress(w){A=U(w,0,1)*_e},setEventTime(w){A=w},frontY(){return U(ie(J),0,h)},shaftFoot:he,uniforms:g,palette:x,yTop:m,makeMaterial(w={}){return Ve({...g,...w},x)},flyers:L,update(w,i){de(i)},dispose(){},ground:!0,groundY:0,info:{cards:H.cards,limbs:H.nLimbs,treeTriangles:H.triangles,flyers:v.flyers}}}export{Ke as FLYER_VERTS,$e as GLSL_FLYWING,ot as buildHero,et as liteFirGeometry,tt as liteFirGeometryAsync};
