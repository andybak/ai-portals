import*as h from"three";import{clamp as xe,lerp as re,smoothstep as K}from"../kit/core.js";const Wt=["#DCE7E2","#4F7C46","#213F2C","#5C8A96","#7D766A","#FFE8B5","#D9652B"],Ne=1.1,nt=4.4,Le=.75,be=64,Bt=[0,.25,.5,.75],Ve=`
uniform vec4 uMist; uniform vec3 uMistCol; uniform vec3 uSunDirW;
vec3 applyMist(vec3 col, vec3 wp){
  vec3 d = wp - cameraPosition; float L = length(d);
  float ya = max(cameraPosition.y - uMist.x, 0.), yb = max(wp.y - uMist.x, 0.);
  float ea = exp(-ya / uMist.y), eb = exp(-yb / uMist.y), dy = yb - ya;
  float od = uMist.z * L * (abs(dy) > 0.02 ? uMist.y * (ea - eb) / dy : ea);
  float cs = dot(d / max(L, 1e-3), uSunDirW), fw = max(cs, 0.);
  vec3 mc = uMistCol * (0.5 + 0.3 * (cs * 0.5 + 0.5) + 0.2 * fw + 0.6 * fw * fw * fw);
  return mix(mc, col, exp(-max(od, 0.)));
}`,st=`
uniform float uTime; uniform vec4 uGait; // speed, period, duty, z offset of the walkers (m)
uniform float uBed[${be}]; uniform vec2 uBedR; uniform float uWaterY;
float bedAt(float z){ float f = clamp((z - uBedR.x) * uBedR.y, 0., ${be-1.001}); int i = int(f); return mix(uBed[i], uBed[i + 1], f - float(i)); }
// small animals wade: their footing never lies deeper than belly height under the surface
float bedS(float z, float sc){ return max(bedAt(z), uWaterY - 3.2 * sc); }
float baseAt(float z, float sc){ return (bedS(z - 4., sc) + bedS(z, sc) + bedS(z + 4., sc)) / 3.; }
float legOff(float k){ return k * 0.25; }
// x: foot offset along the body (rest units), y: lift 0..1, z: phase
vec3 footCycle(float phase, float rate, float walk, float scale, float k){
  float ph = fract(uTime / uGait.y * rate * walk + phase + legOff(k));
  float S = uGait.x * uGait.z * uGait.y / rate / scale, fz, lift = 0.;
  if (ph < uGait.z) fz = S * (0.5 - ph / uGait.z);
  else { float s = (ph - uGait.z) / (1. - uGait.z); fz = S * (-0.5 + s * s * (3. - 2. * s)); lift = sin(3.14159 * s); }
  return vec3(fz * walk, lift * walk, ph);
}
vec2 rotY(vec2 xz, float a){ float c = cos(a), s = sin(a); return vec2(xz.x * c + xz.y * s, -xz.x * s + xz.y * c); }
`,Rt=`
attribute vec2 aRig; attribute vec4 iA; attribute vec4 iB; attribute vec4 iC; attribute vec4 iD;
uniform float uRear; uniform vec3 uHip[4]; uniform vec3 uNeckB; uniform vec4 uNeckA; uniform vec4 uTail; // tail: base y, base z, length, -
varying vec3 vWPos; varying vec3 vRest; varying vec4 vInfo; varying vec3 vCamL;
vec3 rigP; vec3 rigN;
vec3 neckPose(vec3 p, float t, inout vec3 n){
  vec3 A = vec3(0., uNeckA.y, uNeckA.z); float Ln = uNeckA.w;
  vec3 q = p - uNeckB + A * (iC.y - 1.) * Ln * t;
  float ang = (iC.x + 0.05 * sin(uTime * 0.23 + iB.y * 9.)) * smoothstep(0., 0.6, t);
  float c = cos(ang), s = sin(ang);
  q = vec3(q.x, q.y * c + q.z * s, q.z * c - q.y * s);
  n = vec3(n.x, n.y * c + n.z * s, n.z * c - n.y * s);
  float sw = iD.x * sin(uTime * 0.31 + iB.y * 6.2832) + iD.y;
  q.x += sw * Ln * iC.y * t * t;
  n = normalize(n - A * (2. * sw * t) * n.x);
  return q + uNeckB;
}
vec3 tailPose(vec3 p, float t, inout vec3 n){
  float w = uTime * 0.85 * (0.4 + 0.6 * iC.z) - 4.2 * t + iB.z * 6.2832;
  float a = iD.z * uTail.z * 0.16 * pow(t, 1.5);
  p.x += a * sin(w); p.y += 0.25 * a * sin(w * 0.7 + 1.3) + 0.35 * a;
  float m = iD.z * uTail.z * 0.16 * (1.5 * sqrt(t) * sin(w) - 4.2 * pow(t, 1.5) * cos(w)) / uTail.z;
  n = normalize(n + vec3(0., 0., 1.) * m * n.x);
  return p;
}
void rig(vec3 p, vec3 n){
  float part = aRig.x, t = aRig.y, sc = iA.w, walk = iC.z, rate = iC.w;
  float zc = iA.y + (uGait.x * uTime + uGait.w) * walk;
  float base = baseAt(zc, sc);
  float ph0 = uTime / uGait.y * rate * walk + iB.x;
  float bob = 0.045 * sin(12.566 * ph0 + 0.6) * walk;
  float sway = 0.11 * sin(6.2832 * ph0 + 1.2) * walk;
  if (part > 2.5 && part < 6.5) {
    float k = part - 3.; vec3 hip = uHip[int(k)];
    vec3 fc = footCycle(iB.x, rate, walk, sc, k);
    float cy = cos(iA.z);
    float footY = (bedS(zc + (hip.z + fc.x) * sc * cy, sc) - base) / sc + fc.y * iD.w / sc;
    vec2 H = vec2(hip.z + 0.4 * fc.x, hip.y + bob);          // (z, y)
    vec2 d = vec2(hip.z + fc.x, footY) - H;
    float L1 = 0.5 * max(hip.y * 0.995, length(d) * 1.0005);  // column-straight in stance (<3% telescoping), knee folds in swing
    float D = min(length(d), 2. * L1 * 0.9995);
    float th = atan(d.x, max(-d.y, 0.01));
    float al = acos(clamp(D / (2. * L1), -1., 1.)) * (hip.z > 0. ? -1. : 1.);
    float a1 = th + al, a2 = th - al;
    float tt = clamp((hip.y - p.y) / hip.y, 0., 1.), dy0 = max(p.y - hip.y, 0.);
    float u1 = min(tt, 0.5) * 2., u2 = max(tt - 0.5, 0.) * 2.;
    vec2 b = H + L1 * u1 * vec2(sin(a1), -cos(a1)) + L1 * u2 * vec2(sin(a2), -cos(a2));
    float a = mix(a1, a2, smoothstep(0.36, 0.64, tt)) * (1. - smoothstep(0.86, 0.97, tt)) * smoothstep(0., 0.12, tt);
    float ca = cos(a), sa = sin(a), oz = p.z - hip.z;
    p = vec3(p.x + sway * (1. - tt), b.y + oz * sa + dy0, b.x + oz * ca);
    n = vec3(n.x, n.y * ca + n.z * sa, n.z * ca - n.y * sa);
  } else {
    if (part > 0.5 && part < 1.5) p = neckPose(p, t, n);
    else if (part > 1.5 && part < 2.5) p = tailPose(p, t, n);
    else if (part > 6.5) p = neckPose(p, 1., n);
    p.y += bob; p.x += sway;
  }
  if (iC.w > 6.5 && uRear > 0.001) {            // the rearing bull (opts.bull): everything but hind legs and tail pivots on the hips
    float w = 1.;
    if (part > 2.5 && part < 6.5) { float k = part - 3.; if (k < 0.5 || (k > 1.5 && k < 2.5)) w = 1. - smoothstep(0.02, 0.4, clamp((uHip[0].y - position.y) / uHip[0].y, 0., 1.)); }
    else if (part > 1.5 && part < 2.5) w = 1. - smoothstep(0., 0.3, t);
    float ra = uRear * 0.98 * w, rc = cos(ra), rs = sin(ra);
    vec2 pv = vec2(uHip[0].z, uHip[0].y);
    vec2 dq = vec2(p.z, p.y) - pv;
    p.z = pv.x + rc * dq.x - rs * dq.y; p.y = pv.y + rs * dq.x + rc * dq.y - 0.5 * uRear * w;
    n = vec3(n.x, rs * n.z + rc * n.y, rc * n.z - rs * n.y);
    if (w > 0.5 && part > 2.5 && part < 6.5) { float tt2 = clamp((uHip[1].y - position.y) / uHip[1].y, 0., 1.); p.z -= uRear * 1.6 * tt2 * tt2 * rc; p.y += uRear * 1.6 * tt2 * tt2 * rs * 0.6; }
  }
  vec2 xz = rotY(p.xz * sc, iA.z); vec2 nxz = rotY(n.xz, iA.z);
  rigP = vec3(xz.x + iA.x, p.y * sc + base, xz.y + zc);
  rigN = vec3(nxz.x, n.y, nxz.y);
}`,ee={name:"diplo",radial:14,step:.62,headStep:.2,headZ:11.4,keys:[[-17.6,3,.03,.03,.03],[-15.5,3.02,.05,.05,.05],[-13,3.1,.09,.09,.09],[-10,3.3,.19,.21,.19],[-7,3.68,.4,.46,.4],[-4.6,4.12,.78,.8,.72],[-2.6,4.45,1.2,.86,.86],[-.5,4.5,1.46,.8,.95],[1.6,4.4,1.36,.76,.86],[3,4.32,1.02,.7,.76],[4.4,4.42,.6,.56,.56],[6.5,4.7,.42,.42,.42],[9,5,.33,.34,.33],[11,5.2,.26,.27,.26],[11.6,5.25,.23,.23,.2],[12.1,5.27,.27,.2,.17],[12.65,5.17,.23,.12,.12],[12.98,5.1,.13,.06,.06]],hips:[[1,4.3,-2.5],[.86,3.9,2.6],[-1,4.3,-2.5],[-.86,3.9,2.6]],legR:[.58,.46],neckB:[0,4.36,3.7],neckEnd:[0,5.25,11.6],tailZ:-3.6,tailLen:14,tailY:4.3,eye:[.2,5.33,12],eyeR:.06,crest:[0,5.5,12.3],spines:!0,lift:1.25,belly:[4.5,.95,1.45,-2.6,3]},Ae={name:"brachio",radial:16,step:.56,headStep:.13,headZ:8.4,keys:[[-10.6,3.5,.04,.04,.04],[-9.3,3.8,.1,.1,.1],[-7.8,4.3,.22,.24,.22],[-6,5.05,.46,.52,.46],[-4.6,5.9,.92,.9,.82],[-3.2,6.6,1.5,1.05,1],[-.5,6.9,1.78,1.28,1.3],[2,7.2,1.68,1.4,1.5],[3.6,7.65,1.32,1.28,1.3],[4.9,8.55,1,1,.94],[6.3,9.8,.74,.74,.74],[7.25,11.35,.56,.55,.57],[7.9,12.85,.42,.41,.43],[8.4,13.62,.35,.35,.35],[8.8,13.95,.36,.36,.3],[9.15,14.02,.38,.4,.32],[9.5,14.02,.36,.62,.33],[9.8,13.98,.34,.7,.33],[10.1,13.86,.35,.36,.32],[10.4,13.76,.36,.24,.3],[10.62,13.7,.33,.2,.26],[10.74,13.68,.2,.1,.14]],hips:[[1.2,6.05,-3.25],[1.15,6.7,3.25],[-1.2,6.05,-3.25],[-1.15,6.7,3.25]],legR:[.64,.58],neckB:[0,8.3,4.4],neckEnd:[0,13.75,8.55],tailZ:-4.2,tailLen:6.4,tailY:5.9,eye:[.33,14.02,9.2],eyeR:.1,crest:[0,14.75,9.8],spines:!1,lift:1.45,belly:[6.9,1.3,1.76,-3.2,3.6]};function Lt(r,u,o,y,f){const d=f*f,c=d*f;return .5*(2*u+(o-r)*f+(2*r-5*u+4*o-y)*d+(3*u-r-3*o+y)*c)}function _t(){const r=[],u=[],o=[],y=[];return{P:r,C:u,R:o,I:y,v(f,d,c,N,L,_,g,H){return r.push(f,d,c),u.push(N,L,_),o.push(g,H),r.length/3-1},tri(f,d,c){y.push(f,d,c)},finish(){const f=new h.BufferGeometry;return f.setAttribute("position",new h.Float32BufferAttribute(r,3)),f.setAttribute("color",new h.Float32BufferAttribute(u,3)),f.setAttribute("aRig",new h.Float32BufferAttribute(o,2)),f.setIndex(y),f.computeVertexNormals(),f}}}async function rt(r,u,o,y,f,d){const c=_t(),N=y.hide,L=y.dark,_=y.pale,g=r.neckB,H=r.neckEnd,$=Math.hypot(H[1]-g[1],H[2]-g[2]),ke=[0,(H[1]-g[1])/$,(H[2]-g[2])/$];r.neckLen=$,r.neckAxis=ke;const He=(s,n)=>{const P=((s-g[1])*ke[1]+(n-g[2])*ke[2])/$;if(P>0)return[1,Math.min(P,1)];const B=(r.tailZ-n)/r.tailLen;return B>0?[2,Math.min(B,1)]:[0,0]},ae=r.keys,D=[];for(let s=0;s<ae.length-1;s++){const n=ae[Math.max(s-1,0)],P=ae[s],B=ae[s+1],C=ae[Math.min(s+2,ae.length-1)],S=Math.hypot(B[0]-P[0],B[1]-P[1]),z=(P[0]>=r.headZ?r.headStep:r.step)/u*(u>=1&&B[0]<=r.tailZ-1?1.7:1),I=Math.max(1,Math.round(S/z));for(let v=0;v<I;v++){const m=v/I;D.push([0,1,2,3,4].map(w=>Lt(n[w],P[w],B[w],C[w],m)))}}D.push(ae[ae.length-1].slice());const ue=Math.max(8,Math.round(r.radial*(u<1?.6:1))),k=new h.Color,W=new h.Color,fe=(s,n,P,B,C)=>{const S=o.fbm3(s*.45+f*7,n*.45,P*.22,3),z=K(.1,.5,o.n3(s*.9,n*.9+f*3,P*.35));return k.copy(N).multiplyScalar(.92+.22*S),k.lerp(L,xe(K(.05,.9,B)*.82+z*.2*K(-.3,.5,B),0,.9)),k.lerp(_,K(-.15,-.85,B)*Math.min(1,C*1.45)),k},ne=[];for(let s=0;s<D.length;s++){const n=D[s],P=D[Math.max(s-1,0)],B=D[Math.min(s+1,D.length-1)];let C=B[1]-P[1],S=B[0]-P[0];const z=Math.hypot(C,S)||1;C/=z,S/=z;const I=S,v=-C;ne.push(c.P.length/3);const m=n[0]>=r.headZ;for(let w=0;w<ue;w++){const M=w/ue*Math.PI*2,A=Math.cos(M),R=Math.sin(M);let F=n[2]*Math.sign(A)*Math.pow(Math.abs(A),.85),O=(R>0?n[3]:n[4])*Math.sign(R)*Math.pow(Math.abs(R),.9);const q=m?0:.035*o.n3(n[0]*.9,M*1.5,f*5)*Math.min(1,n[2]*1.4);F*=1+q,O*=1+q;const J=F,ye=n[1]+O*I,he=n[0]+O*v,[V,X]=He(n[1],n[0]);if(fe(J,ye,he,m?R*.45-.1:V===1?R*(1-.35*X):R,V===1?.75:.5),m){const we=Math.exp(-Math.pow((R+.42)/.11,2))*K(r.headZ+.25,r.headZ+.6,n[0]);k.multiplyScalar(1-.6*we),r.spines||k.multiplyScalar(1-.75*Math.exp(-Math.pow((n[0]-r.headZ-1.42)/.1,2)-Math.pow((R-.8)/.16,2)))}V===2&&k.multiplyScalar(.86+.14*Math.sin(n[0]*2.2)),c.v(J,ye,he,k.r,k.g,k.b,V,X)}}for(let s=0;s<D.length-1;s++)for(let n=0;n<ue;n++){const P=(n+1)%ue,B=ne[s]+n,C=ne[s]+P,S=ne[s+1]+n,z=ne[s+1]+P;c.tri(B,z,S),c.tri(B,C,z)}d&&await d();{const s=D[0],n=D[D.length-1];fe(0,s[1],s[0],0,0);const P=c.v(0,s[1],s[0]-.05,k.r,k.g,k.b,2,1);k.copy(L);const B=c.v(0,n[1]-.01,n[0]+.06,k.r*.6,k.g*.6,k.b*.6,1,1),C=ne[D.length-1];for(let S=0;S<ue;S++){const z=(S+1)%ue;c.tri(P,ne[0]+S,ne[0]+z),c.tri(B,C+z,C+S)}}const ve=u<1?8:12,oe=u<1?7:10;for(let s=0;s<4;s++){const n=r.hips[s],P=n[2]>0,B=r.legR[P?1:0],C=P?1:.85,S=n[1]+C,z=[];for(let v=0;v<=oe;v++){const m=v/oe,w=S*(1-Math.pow(m,.92)),M=xe((n[1]-w)/n[1],0,1),A=xe((w-n[1])/C,0,1);let R=B*(1.14-.31*K(0,.42,M)-.15*K(.52,.78,M)+.42*K(.84,.96,M));R*=1+.12*Math.exp(-Math.pow((M-.5)/.06,2)),v===oe&&(R*=.9);const F=Math.sqrt(1-.86*A*A),O=n[0]*(1-.42*A*A),q=R*(1+(P?.14:.3)*(1-K(0,.45,M)));z.push(c.P.length/3);for(let J=0;J<ve;J++){const ye=J/ve*Math.PI*2,he=Math.cos(ye),V=Math.sin(ye),X=1+.035*o.n3(ye*2+s*9,w*1.6,f),we=O+he*R*F*X,_e=n[2]+V*q*F*X+(P?-.12:.1)*(1-M)+(P?.07:-.06)*Math.exp(-Math.pow((M-.5)/.1,2));fe(we*2,w,_e,.25-.5*M,.3),k.multiplyScalar(.92-.25*K(.8,1,M)-.18*(1-K(0,.2,M))),c.v(we,w,_e,k.r,k.g,k.b,3+s,M)}}for(let v=0;v<oe;v++)for(let m=0;m<ve;m++){const w=(m+1)%ve,M=z[v]+m,A=z[v]+w,R=z[v+1]+m,F=z[v+1]+w;c.tri(M,F,R),c.tri(M,A,F)}const I=c.v(n[0],0,n[2],L.r*.5,L.g*.5,L.b*.5,3+s,1);for(let v=0;v<ve;v++)c.tri(I,z[oe]+v,z[oe]+(v+1)%ve);if(u>=1)for(let v=-1;v<=1;v++){const m=n[0]+v*B*.55,w=n[2]+B*(1.02-.12*Math.abs(v)),M=B*.2;W.copy(_).multiplyScalar(.55);const A=c.v(m-M,.02,w-.1,W.r,W.g,W.b,3+s,1),R=c.v(m+M,.02,w-.1,W.r,W.g,W.b,3+s,1),F=c.v(m,.36,w-.14,W.r,W.g,W.b,3+s,1),O=c.v(m+v*.05,.03,w+.26,W.r,W.g,W.b,3+s,1);c.tri(A,O,F),c.tri(O,R,F),c.tri(A,R,O)}}d&&await d();const te=s=>{for(let n=0;n<D.length-1;n++)if(D[n+1][0]>=s){const P=(s-D[n][0])/Math.max(D[n+1][0]-D[n][0],1e-4);return re(D[n][1]+D[n][3],D[n+1][1]+D[n+1][3],P)}return 0};if(r.spines&&u>=1)for(let s=-12;s<10.6;s+=.52){const n=te(s)-.03,P=.1+.13*K(-12,-3,s)*(1-.55*K(3,10,s)),B=.07+P*.22,[C,S]=He(n-.3,s);W.copy(L).multiplyScalar(.8);const z=te(s-.22)-.04,I=te(s+.22)-.04,v=c.v(-B,n-.03,s,W.r,W.g,W.b,C,S),m=c.v(B,n-.03,s,W.r,W.g,W.b,C,S),w=c.v(0,z,s-.22,W.r,W.g,W.b,C,S),M=c.v(0,I,s+.22,W.r,W.g,W.b,C,S),A=c.v(0,n+P,s-.08,W.r*1.5,W.g*1.5,W.b*1.5,C,S);c.tri(w,A,v),c.tri(v,A,M),c.tri(M,A,m),c.tri(m,A,w)}for(let s=-1;s<=1;s+=2){const n=r.eye,P=r.eyeR,B=n[0]*s,C=u<1?5:10,S=[];for(let z=0;z<=C;z++){const I=z/C*Math.PI;S.push(c.P.length/3);for(let v=0;v<C;v++){const m=v/C*Math.PI*2,w=Math.cos(I),M=Math.sin(I)*Math.cos(m),A=Math.sin(I)*Math.sin(m);c.v(B+s*w*P*.8,n[1]+M*P,n[2]+A*P,s*w*.5+.5,M*.5+.5,A*.5+.5,7,1)}}for(let z=0;z<C;z++)for(let I=0;I<C;I++){const v=(I+1)%C,m=S[z]+I,w=S[z]+v,M=S[z+1]+I,A=S[z+1]+v;s>0?(c.tri(m,M,A),c.tri(m,A,w)):(c.tri(m,A,M),c.tri(m,w,A))}if(u>=1){const v=[];for(let m=0;m<12;m++){const w=m/12*Math.PI*2,M=Math.cos(w),A=Math.sin(w);v.push(c.P.length/3);const R=P*(.36+.2*Math.max(M,0));for(let F=0;F<5;F++){const O=F/5*Math.PI*2,q=P*1.12+Math.cos(O)*R,J=Math.sin(O)*R+P*.3;fe(B,n[1]+M*q,n[2]+A*q,.5,0),k.multiplyScalar(.8),c.v(B+s*J,n[1]+M*q,n[2]+A*q,k.r,k.g,k.b,1,1)}}for(let m=0;m<12;m++)for(let w=0;w<5;w++){const M=(m+1)%12,A=(w+1)%5,R=v[m]+w,F=v[m]+A,O=v[M]+w,q=v[M]+A;s>0?(c.tri(R,q,O),c.tri(R,F,q)):(c.tri(R,O,q),c.tri(R,q,F))}}}d&&await d();const U=c.finish();return U.userData.triangles=c.I.length/3,U}const it=`
float h31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z); }`;function Ue(r,u,o){const y=new h.MeshStandardMaterial({vertexColors:!0,roughness:.82,metalness:0,side:h.DoubleSide}),f={uHip:{value:r.hips.map(d=>new h.Vector3(d[0],d[1],d[2]))},uNeckB:{value:new h.Vector3().fromArray(r.neckB)},uNeckA:{value:new h.Vector4(0,r.neckAxis[1],r.neckAxis[2],r.neckLen)},uTail:{value:new h.Vector4(r.tailY,r.tailZ,r.tailLen,0)},uBlink:{value:0},uRear:{value:0},uIris:{value:o.iris.clone()}};return y.userData.uniforms=f,y.onBeforeCompile=d=>{Object.assign(d.uniforms,u,f),d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
`+st+Rt).replace("#include <beginnormal_vertex>",`rig(position, normal);
vec3 objectNormal = rigN;`).replace("#include <begin_vertex>",`vec3 transformed = rigP;
        vWPos = (modelMatrix * vec4(rigP, 1.)).xyz; vRest = position;
        vInfo = vec4(aRig.x > 6.5 ? 1. : 0., iB.w, aRig.x, iA.w);
        vec3 cl = (cameraPosition - vWPos) * mat3(modelMatrix); cl.xz = rotY(cl.xz, -iA.z); vCamL = cl;`),d.fragmentShader=d.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 vWPos; varying vec3 vRest; varying vec4 vInfo; varying vec3 vCamL;
        uniform float uWaterW; uniform float uBlink; uniform vec3 uIris; uniform vec3 uSunCol; uniform vec3 uAmbCol; uniform float uTime;
        float gWet; float gEye; float gFold; float gBand; vec3 gIris;
        ${it}
        ${Ve}`).replace("#include <color_fragment>",`#include <color_fragment>
        {
          bool leg = vInfo.z > 2.5 && vInfo.z < 6.5;
          vec3 fp = leg ? vRest * vec3(2.2, 6.5, 2.2) : vRest * vec3(1.7, 1.7, 5.2);
          fp += 1.3 * (vnoise(vRest * 1.1 + 3.) - 0.5);
          float f1 = vnoise(fp), f2 = vnoise(fp * 2.7 + 7.), sc = vnoise(vRest * 16.), ptc = smoothstep(0.25, 0.7, vnoise(vRest * 0.8 + 11.));
          float near = smoothstep(140., 20., length(vViewPosition));
          float big = smoothstep(0.3, 0.8, vInfo.w);            // juveniles: the fine folds would only speckle
          gFold = mix(0.55, 0.3 + pow(1. - abs(f1 * 2. - 1.), 2.) * 0.42 * (0.35 + 0.65 * ptc) * (0.5 + 0.5 * big) + (f2 * 0.26 + sc * 0.12) * (0.25 + 0.75 * big) + 0.14 * (1. - big), near);
          float streak = vnoise(vec3(vRest.x * 5., vRest.y * 0.5, vRest.z * 5.));
          float wl = 1. - smoothstep(uWaterW + 0.25 * big, uWaterW + (1.25 + 0.75 * f2) * (0.3 + 0.7 * big), vWPos.y);
          float splash = (1. - smoothstep(uWaterW + 0.4, uWaterW + 3.6, vWPos.y)) * smoothstep(0.35, 0.75, streak) * 0.6;
          gBand = wl; gWet = max(wl, splash);
          gEye = 0.; gIris = vec3(0.);
          vec3 skin = diffuseColor.rgb * (0.82 + 0.3 * gFold) * (1. + vInfo.y);
          skin = mix(vec3(dot(skin, vec3(0.3, 0.55, 0.15))), skin, 0.72) * vec3(0.53, 0.585, 0.78);   // warm grey under a cream sun, never khaki
          skin *= mix(1., 0.26, gWet);
          if (vInfo.x > 0.5) {
            vec3 ed = normalize(vColor.rgb * 2. - 1.);
            vec3 o = vec3(vRest.x > 0. ? 1. : -1., 0., 0.);
            vec3 c = normalize(vCamL + vec3(0., 1e-4, 0.));
            vec3 d = (c - o * dot(c, o)) / max(dot(c, o), 0.25);
            d *= min(1., 0.62 / max(length(d), 1e-3));
            vec3 g = normalize(o + d);
            float a = dot(ed, g);
            float ring = vnoise(ed * 26.);
            vec3 iris = uIris * (0.55 + 0.9 * ring) * smoothstep(0.62, 0.9, a);
            iris = mix(iris, vec3(0.008), smoothstep(0.935, 0.955, a));
            iris = mix(vec3(0.03, 0.02, 0.012), iris, smoothstep(0.6, 0.7, a));
            float blink = max(uBlink, smoothstep(0.965, 0.985, fract(uTime * 0.09 + vInfo.y * 31.)) );
            float lid = smoothstep(0.02, -0.06, abs(ed.y - 0.12) - 0.86 * (1. - blink));
            gEye = lid; gIris = iris * lid * smoothstep(0.62, 0.8, a) * (1. - smoothstep(0.93, 0.95, a));
            skin = mix(vec3(0.09, 0.08, 0.07), iris, lid);
          }
          diffuseColor.rgb = skin;
        }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = mix(mix(0.86, 0.2, gWet), 0.1, gEye);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        {
          vec3 dpx = dFdx(vViewPosition), dpy = dFdy(vViewPosition);
          float hx = dFdx(gFold), hy = dFdy(gFold);
          vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx);
          float det = dot(dpx, r1);
          vec3 gr = sign(det) * (hx * r1 + hy * r2);
          normal = normalize(abs(det) * normal - 0.07 * (1. - gEye) * gr + vec3(0., 0., 1e-6));
        }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        {
          vec3 vd = normalize(vViewPosition);
          float fr = pow(1. - clamp(dot(normal, vd), 0., 1.), 3.);
          vec3 sv = normalize((viewMatrix * vec4(uSunDirW, 0.)).xyz);
          float toward = clamp(dot(normal, sv) * 0.6 + 0.5, 0., 1.);
          totalEmissiveRadiance += uSunCol * fr * toward * 0.06 * (1. - gEye);
          totalEmissiveRadiance += gIris * 0.55 + diffuseColor.rgb * uAmbCol * 0.33 * (1. - gEye);
        }`).replace("#include <fog_fragment>",`#include <fog_fragment>
        {
          // inside the mist the low sun is spent before it reaches a hide: animals go to near-silhouette, keeping a warm rim on the sun side
          float inM = exp(-max(vWPos.y - uMist.x, 0.) / max(uMist.y * 1.5, 0.1));
          float sil = clamp((uMist.z - 0.02) * 30., 0., 0.84) * inM * (1. - gEye);
          vec3 vdR = normalize(vViewPosition);
          float frR = 1. - clamp(dot(normal, vdR), 0., 1.); frR *= frR * frR;
          vec3 svR = normalize((viewMatrix * vec4(uSunDirW, 0.)).xyz);
          float sunSide = smoothstep(-0.1, 0.55, dot(normal, svR));
          vec3 rim = uSunCol * frR * sunSide * (0.42 + 0.3 * gWet) * (1. - gEye);
          float back = max(dot(-vdR, svR), 0.), frB = 1. - clamp(dot(normal, vdR), 0., 1.);
          rim += uSunCol * frB * frB * back * back * 0.55 * (1. - gEye);      // looking into the sun: a gold edge round the silhouette
          gl_FragColor.rgb = gl_FragColor.rgb * (1. - sil) + rim;
          // hides hold their dark through the near mist (silhouettes in a bright hall) and only dissolve far off
          float holdK = mix(0.5, 1., smoothstep(45., 190., length(vViewPosition)));
          gl_FragColor.rgb = mix(gl_FragColor.rgb, applyMist(gl_FragColor.rgb, vWPos), holdK);
        }
 gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.035, 0.06, 0.06), 0.85 * clamp((uWaterW - vWPos.y) / 0.9, 0., 1.));`)},y}function Oe(r,u,o){const y=new h.InstancedBufferGeometry;y.index=r.index;for(const g in r.attributes)y.setAttribute(g,r.attributes[g]);const f=u.length,d=new Float32Array(f*4),c=new Float32Array(f*4),N=new Float32Array(f*4),L=new Float32Array(f*4);u.forEach((g,H)=>{d.set([g.x,g.z0,g.yaw,g.scale],H*4),c.set([g.phase,g.neckPhase,g.tailPhase,g.tint],H*4),N.set([g.neckPitch,g.neckLen,g.walk,g.rate],H*4),L.set([g.neckSway,g.neckLean,g.tailAmp,g.lift],H*4)}),y.setAttribute("iA",new h.InstancedBufferAttribute(d,4)),y.setAttribute("iB",new h.InstancedBufferAttribute(c,4)),y.setAttribute("iC",new h.InstancedBufferAttribute(N,4)),y.setAttribute("iD",new h.InstancedBufferAttribute(L,4)),y.instanceCount=f;const _=new h.Mesh(y,o);return _.frustumCulled=!1,_}function It(r,u){const o=r.length,y=new h.InstancedBufferGeometry;y.setAttribute("position",new h.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),y.setIndex([0,1,2,0,2,3]);const f={iA:4,iB:4,iC:4,iD:4,sHip:4,sP:4},d={};for(const L in f)d[L]=new Float32Array(o*4);r.forEach((L,_)=>{const g=L.a;d.iA.set([g.x,g.z0,g.yaw,g.scale],_*4),d.iB.set([g.phase,g.neckPhase,0,0],_*4),d.iC.set([0,0,g.walk,g.rate],_*4),d.iD.set([g.neckSway,0,0,g.lift],_*4),d.sHip.set(L.hip,_*4),d.sP.set([L.type,L.seed,L.size,L.extra||0],_*4)});for(const L in f)y.setAttribute(L,new h.InstancedBufferAttribute(d[L],4));y.instanceCount=o;const c=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...u},transparent:!0,depthWrite:!1,fog:!0,vertexShader:`
      ${st}
      attribute vec4 iA; attribute vec4 iB; attribute vec4 iC; attribute vec4 iD; attribute vec4 sHip; attribute vec4 sP;
      varying vec2 vUv; varying vec4 vCol; varying vec3 vWPos; uniform vec4 uMist;
      #include <fog_pars_vertex>
      void main(){
        float type = sP.x, seed = sP.y, sc = iA.w, walk = iC.z, rate = iC.w;
        float zc = iA.y + (uGait.x * uTime + uGait.w) * walk, base = baseAt(zc, sc);
        float s2 = fract(seed * 7.31), s3 = fract(seed * 13.7), s4 = fract(seed * 29.3);
        vec3 c; vec2 size = vec2(sP.z); float alpha = 0.; float streak = 0.; float warm = 0.;
        if (type < 1.5) {
          vec3 fc = footCycle(iB.x, rate, walk, sc, sHip.w);
          vec2 f = rotY(vec2(sHip.x, sHip.z + fc.x) * sc, iA.z);
          float fzw = zc + f.y, bed = bedS(fzw, sc), wetF = smoothstep(uWaterY - 0.15, uWaterY - 0.5, bed);
          if (type < 0.5) {                      // spray crown thrown at touchdown
            float tau = fc.z * uGait.y / rate, life = 1.25 + 0.5 * s3;
            float th = seed * 6.2832, vr = (1.0 + 2.0 * s2) * sc, vy = (4.6 + 3.1 * s3) * sqrt(sc);
            float r = 0.55 * sc + vr * tau;
            c = vec3(iA.x + f.x + cos(th) * r, uWaterY + max(vy * tau - 4.9 * tau * tau, -0.2), fzw + sin(th) * r);
            size *= (0.5 + 0.9 * tau / life) * vec2(1., 2.1);
            alpha = wetF * walk * step(tau, life) * smoothstep(0., 0.06, tau) * (1. - tau / life) * 0.95;
          } else {                               // water pouring off the lifted foot
            float q = fract(uTime * (0.9 + 0.5 * s2) + s3), top = base + fc.y * iD.w + 0.25 * sc;
            float th = seed * 6.2832;
            c = vec3(iA.x + f.x + cos(th) * 0.42 * sc, mix(top, uWaterY, q * q), fzw + sin(th) * 0.42 * sc);
            size *= vec2(0.3, 1.0 + 1.2 * q); streak = 1.;
            alpha = wetF * smoothstep(0.03, 0.3, fc.y) * (1. - 0.6 * q) * 0.75 * step(uWaterY, top);
          }
        } else if (type < 2.5) {                 // drips falling from the wet belly
          vec2 f = rotY(sHip.xz * sc, iA.z);
          float y0 = base + sHip.y * sc, tf = sqrt(max(y0 - uWaterY, 0.01) / 4.9);
          float tau = fract(uTime * (0.28 + 0.2 * s2) + s3) * 2.6;
          c = vec3(iA.x + f.x, y0 - 4.9 * tau * tau, zc + f.y);
          size *= vec2(0.4, 1. + 5. * tau); streak = 1.;
          alpha = step(tau, tf) * 0.8 * smoothstep(uWaterY - 0.1, uWaterY - 0.5, base);
        } else if (type < 3.5) {                 // breath steaming off the head
          float q = fract(uTime * 0.2 + seed);
          vec2 f = rotY(sHip.xz * sc, iA.z);
          float sw = iD.x * sin(uTime * 0.31 + iB.y * 6.2832) * sP.w;
          vec2 l = rotY(vec2(sw * sc, 0.), iA.z);
          c = vec3(iA.x + f.x + l.x, base + sHip.y * sc, zc + f.y + l.y);
          c += vec3(2.6 * q * q + 0.5 * (s2 - 0.5) * q, 2.4 * q + 0.3 * sin(q * 9. + seed * 40.), (s3 - 0.5) * 1.4 * q);
          size *= 0.3 + 1.9 * q;
          float breath = 0.55 + 0.45 * sin(uTime * 1.3 - q * 7. + iB.y * 20.);
          alpha = smoothstep(0., 0.12, q) * (1. - q) * (1. - q) * 0.5 * breath; warm = 1.;
        } else {                                 // curls on the top of the mist, drifting with the wind
          float drift = mod(sHip.x + uTime * (0.5 + 0.5 * s2) + 60., 120.) - 60.;
          c = vec3(drift, uWaterY + sHip.y + 0.5 * sin(uTime * 0.2 + seed * 30.), sHip.z);
          size *= vec2(1.7, 0.55 + 0.25 * s3);
          alpha = (0.1 + 0.1 * s4) * smoothstep(60., 40., abs(drift)); warm = 0.45;
        }
        vec4 wc = modelMatrix * vec4(c, 1.);
        vec3 toCam = normalize(cameraPosition - wc.xyz + vec3(0., 1e-3, 0.));
        vec3 right = normalize(cross(vec3(0., 1., 0.), toCam) + vec3(1e-5, 0., 0.));
        vec3 up = mix(cross(toCam, right), vec3(0., 1., 0.), streak);
        vec3 wp = wc.xyz + right * position.x * size.x + up * position.y * size.y;
        vWPos = wp; vUv = position.xy; vCol = vec4(warm, streak, s4, alpha * uMist.w);
        vec4 mvPosition = viewMatrix * vec4(wp, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vUv; varying vec4 vCol; varying vec3 vWPos;
      uniform vec3 uSunCol; uniform vec3 uAmbCol; uniform vec3 uPearl;
      ${Ve}
      #include <fog_pars_fragment>
      void main(){
        float r2 = dot(vUv, vUv); if (r2 > 1.) discard;
        float soft = (1. - r2); soft *= soft;
        float a = vCol.a * mix(soft, sqrt(soft), vCol.y);
        if (a < 0.004) discard;
        vec3 vd = normalize(vWPos - cameraPosition);
        float fw = max(dot(vd, uSunDirW), 0.);
        vec3 light = uAmbCol * 0.75 + uSunCol * (0.2 + 0.2 * (1. - vCol.x) + (0.9 + 1.5 * vCol.x) * fw * fw * fw);
        vec3 col = uPearl * light * (0.85 + 0.3 * vCol.z);
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
        gl_FragColor.rgb = mix(gl_FragColor.rgb, applyMist(gl_FragColor.rgb, vWPos), 1. - 0.6 * vCol.x);
      }`}),N=new h.Mesh(y,c);return N.frustumCulled=!1,N.renderOrder=4,N}function Ft(r,u){const o=r.length,y=new h.InstancedBufferGeometry;y.setAttribute("position",new h.Float32BufferAttribute([-2.5,0,-3.5,7.5,0,-3.5,7.5,0,3.5,-2.5,0,3.5],3)),y.setIndex([0,2,1,0,3,2]);const f=new Float32Array(o*4),d=new Float32Array(o*4),c=new Float32Array(o*4),N=new Float32Array(o*4);r.forEach((g,H)=>{const $=g.a;f.set([$.x,$.z0,$.yaw,$.scale],H*4),d.set([$.phase,g.seed,0,0],H*4),c.set([0,0,$.walk,$.rate],H*4),N.set(g.hip,H*4)}),y.setAttribute("iA",new h.InstancedBufferAttribute(f,4)),y.setAttribute("iB",new h.InstancedBufferAttribute(d,4)),y.setAttribute("iC",new h.InstancedBufferAttribute(c,4)),y.setAttribute("sHip",new h.InstancedBufferAttribute(N,4)),y.instanceCount=o;const L=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...u},transparent:!0,depthWrite:!1,fog:!0,vertexShader:`
      ${st}
      attribute vec4 iA; attribute vec4 iB; attribute vec4 iC; attribute vec4 sHip;
      varying vec2 vP; varying vec4 vI; varying vec3 vWPos; uniform vec4 uMist;
      #include <fog_pars_vertex>
      void main(){
        float sc = iA.w, walk = iC.z, rate = iC.w, zc = iA.y + (uGait.x * uTime + uGait.w) * walk;
        vec3 fc = footCycle(iB.x, rate, walk, sc, sHip.w);
        vec2 f = rotY(vec2(sHip.x, sHip.z + fc.x) * sc, iA.z);
        float fzw = zc + f.y, wetF = smoothstep(uWaterY - 0.15, uWaterY - 0.5, bedS(fzw, sc));
        float k = max(sc, 0.45);
        vec3 c = vec3(iA.x + f.x - position.x * k, uWaterY + 0.03, fzw + position.z * k);
        vP = position.xz; vI = vec4(fc.z * uGait.y / rate, (1. - fc.y) * wetF * uMist.w, iB.y, sc);
        vec4 wp = modelMatrix * vec4(c, 1.); vWPos = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vP; varying vec4 vI; varying vec3 vWPos;
      uniform float uTime; uniform vec3 uSunCol; uniform vec3 uAmbCol; uniform vec3 uPearl;
      ${it}
      ${Ve}
      #include <fog_pars_fragment>
      void main(){
        float u = vP.x, v = vP.y, r = length(vP), tau = vI.x, t = uTime;
        float edge = smoothstep(7.5, 4.5, u) * smoothstep(3.5, 2.6, abs(v)) * smoothstep(-2.5, -1.8, u);
        float n = vnoise(vec3(u * 1.6 + t * 1.6, v * 2.2, vI.z * 9.));
        float bow = smoothstep(0.22, 0.0, abs(r - 0.92)) * smoothstep(0.6, -0.4, u) * 0.9;
        float arm = abs(v) - (0.75 + 0.36 * max(u, 0.));
        float vee = smoothstep(0.3, 0., abs(arm)) * smoothstep(-0.3, 0.6, u) * (0.35 + 0.65 * n);
        float rip = (0.5 + 0.5 * sin((arm + 0.3) * 7. + t * 3.)) * smoothstep(0., -0.4, arm) * smoothstep(-1.6, -0.5, arm) * smoothstep(0.4, 1.5, u) * 0.25;
        float trail = smoothstep(0.75, 0.2, abs(v) / (0.5 + 0.12 * max(u, 0.))) * smoothstep(0.5, 1.2, u) * smoothstep(0.45, 0.8, n) * 0.7;
        float ring = smoothstep(0.32, 0., abs(r - (0.9 + 1.5 * tau))) * max(1. - tau / 1.5, 0.) * 0.9;
        float foam = (bow + vee + rip + trail) * vI.y + ring * vI.y;
        float a = clamp(foam * edge, 0., 1.) * 0.8;
        if (a < 0.01) discard;
        gl_FragColor = vec4(uPearl * (uAmbCol * 0.8 + uSunCol * 0.45), a);
        #include <fog_fragment>
        gl_FragColor.rgb = applyMist(gl_FragColor.rgb, vWPos);
      }`}),_=new h.Mesh(y,L);return _.frustumCulled=!1,_.renderOrder=3,_}function qt(r,u){const o=new h.PlaneGeometry(1,1,1,1);o.rotateX(-Math.PI/2);const y=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...r,uRiver:{value:u.river},uSkyH:{value:u.pearl},uSkyZ:{value:u.zenith},uGravel:{value:u.gravel}},transparent:!0,depthWrite:!1,fog:!0,vertexShader:`
      varying vec3 vWPos; varying vec2 vL; uniform float uWaterY;
      #include <fog_pars_vertex>
      void main(){ vL = position.xz; vec4 wp = modelMatrix * vec4(position.x * 640., uWaterY, position.z * 640. + 40., 1.); vWPos = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vWPos; varying vec2 vL; uniform float uTime; uniform vec3 uRiver, uSkyH, uSkyZ, uGravel, uSunCol;
      ${it}
      ${Ve}
      #include <fog_pars_fragment>
      void main(){
        vec3 vd = normalize(vWPos - cameraPosition); float dist = length(vWPos - cameraPosition);
        vec2 p = vWPos.xz; float t = uTime, lod = smoothstep(260., 40., dist);
        float n1 = vnoise(vec3(p.x * 0.9 + t * 1.5, p.y * 1.5, t * 0.25)), n2 = vnoise(vec3(p.x * 2.3 + t * 2.6, p.y * 3.1, 3. + t * 0.4));
        float e = 0.35;
        float n1x = vnoise(vec3((p.x + e) * 0.9 + t * 1.5, p.y * 1.5, t * 0.25)), n1z = vnoise(vec3(p.x * 0.9 + t * 1.5, (p.y + e) * 1.5, t * 0.25));
        vec3 N = normalize(vec3(-(n1x - n1) * 0.9 * lod - (n2 - 0.5) * 0.12 * lod, 1., -(n1z - n1) * 0.9 * lod));
        float fres = 0.04 + 0.96 * pow(1. - clamp(dot(-vd, N), 0., 1.), 5.);
        vec3 R = reflect(vd, N);
        vec3 sky = mix(uSkyH * 0.62, uSkyZ * 0.5, smoothstep(0., 0.4, R.y));
        float glint = pow(max(dot(R, uSunDirW), 0.), 260.) * 7. + pow(max(dot(R, uSunDirW), 0.), 24.) * 0.35;
        float g = vnoise(vec3(p * 2.2, 1.)) * 0.6 + vnoise(vec3(p * 7., 4.)) * 0.4;
        vec3 bed = mix(uGravel * (0.4 + 0.5 * g) * mix(vec3(1.), uRiver * 1.7, 0.6), uRiver * 0.3, 0.5);
        float foam = smoothstep(0.78, 0.92, vnoise(vec3(p.x * 0.25 + t * 0.45, p.y * 0.9, 7.)) * (0.6 + 0.4 * n2)) * 0.35 * lod;
        vec3 col = mix(bed, sky, fres * 0.8) + uSunCol * glint * lod + foam * uSkyH;
        float fade = smoothstep(0.5, 0.36, length(vL));
        gl_FragColor = vec4(col, fade * mix(0.62, 1., fres));
        #include <fog_fragment>
        gl_FragColor.rgb = mix(gl_FragColor.rgb, applyMist(gl_FragColor.rgb, vWPos), 0.75);
      }`}),f=new h.Mesh(o,y);return f.frustumCulled=!1,f.renderOrder=2,f}async function Ht(r,u={}){const o=r.rng.fork?r.rng.fork("sauropod-ford"):r.rng,y=r.noise,f=(u.palette&&u.palette.length>=7?u.palette:Wt).map(e=>new h.Color(e)),d=u.waterY??1.2,c=u.duration??40,N={};f[4].getHSL(N);const L=new h.Color().setHSL((N.h+o.range(-.03,.012)+1)%1,xe(N.s*o.range(.8,1.25),0,1),N.l*o.range(.92,1.06)),_={pearl:f[0],hide:L,river:f[3],iris:new h.Color("#F2A826"),dark:L.clone().lerp(f[2],.45).multiplyScalar(.5),pale:L.clone().lerp(f[0],.42),zenith:f[3].clone().lerp(f[0],.2),gravel:L.clone().lerp(f[0],.62)},g=o.range(0,10),H=-280,$=350,ke=new Float32Array(be);for(let e=0;e<be;e++)ke[e]=u.heightAt?u.heightAt(re(H,$,e/(be-1))):0;const He=e=>{const t=xe((e-H)/($-H)*(be-1),0,be-1.001),p=Math.floor(t);return re(ke[p],ke[p+1],t-p)},ae=(e,t)=>Math.max(He(e),d-3.2*t),D=(e,t)=>(ae(e-4,t)+ae(e,t)+ae(e+4,t))/3,ue=new h.Vector3(-.927,.375,0);u.sunDir&&ue.fromArray(u.sunDir).normalize();const k={uTime:{value:0},uGait:{value:new h.Vector4(Ne,nt,Le,0)},uBed:{value:ke},uBedR:{value:new h.Vector2(H,(be-1)/($-H))},uWaterY:{value:d},uWaterW:{value:d},uMist:{value:new h.Vector4(d,3,.024*(u.mist??1),1)},uMistCol:{value:f[0].clone().multiplyScalar(.92)},uSunDirW:{value:ue.clone()},uSunCol:{value:f[5].clone().multiplyScalar(1.15)},uAmbCol:{value:f[0].clone().lerp(f[3],.35).multiplyScalar(.8)},uPearl:{value:f[0].clone()}},W=r.yield?()=>r.yield():null,fe=await rt(ee,1,y,_,g,W);await r.yield?.();const ne=await rt(Ae,1,y,_,g+3,W);await r.yield?.();const ve=await rt(ee,.42,y,{..._,hide:L.clone().lerp(f[1],.12).multiplyScalar(1.08)},g+6,W);await r.yield?.();const oe=xe(Math.round(u.count??38+o.int(-3,2)),12,60),te=u.length??300,U=u.headZ??85,s=(te-14)/oe,n=[-9.6,-4.4,4.4,9.6],P=[1,3,0,2],B=u.cast==="brachio",C=(e,t,p,a,l={})=>({S:e,x:t,z0:p,yaw:0,scale:a,phase:o(),neckPhase:o(),tailPhase:o(),tint:o.range(-.12,.1),neckPitch:o.range(-.05,.07),neckLen:1,walk:1,rate:1,neckSway:o.range(.06,.13)*(e===Ae?.5:1),neckLean:o.range(-.05,.05),tailAmp:o.range(.7,1.25),lift:e.lift*a,...l}),S=[],z=[],I=[],v=C(Ae,n[1],U,1.07,{neckPitch:.02,neckSway:.035,neckLean:.02,tint:.04,phase:.1});z.push(v);const m=4*xe(Math.round(oe*o.range(.36,.5)/4),1,Math.floor(oe/4)-2),w=new Set([m,m+3,m+4]),M=u.brachiosaurs??8;for(let e=0;w.size<Math.min(M-1,oe-2)&&e<200;e++){const t=o.int(3,oe-2);Math.abs(t-m-2)>5&&w.add(t)}const A=[];for(let e=1;e<oe;e++){const t=B||w.has(e);let p=P[e%4];e===m+3?p=2:(e===m||e===m+4)&&(p=1);const a=n[p]+o.range(-.55,.55),l=U-6-e*s+o.range(-1.2,1.2);if(t){const i=C(Ae,a,l,o.range(.9,1));z.push(i),e>=m&&e<=m+4&&A.push(i)}else S.push(C(ee,a,l,o.range(.8,.98)))}const R=z.concat(S);let F=null;u.bull&&(F=C(ee,u.bull.x,u.bull.z,u.bull.scale??1.08,{walk:0,rate:7,neckPitch:.1,neckSway:.05,tint:-.1,phase:.05,yaw:u.bull.yaw??0}));const O=u.juveniles??12;for(let e=0,t=0;e<O;e++){e%4===0&&(t=U-te*o.range(.15,.3)*(1+e/4)+o.range(-10,10));const p=o.range(.19,.25);I.push(C(ee,o.range(-2.4,2.4),t+e%4*o.range(4.5,7)*(o()<.5?1:.8),p,{rate:3,lift:.5,tailAmp:1.4,neckPitch:o.range(.05,.3),neckSway:.12,tint:o.range(0,.15)}))}const q=u.archZ??244,J=[];if(u.arch!==!1)for(let e=-1;e<=1;e+=2){const t=C(Ae,e*11.6,q+e*.85,1.12,{yaw:-e*Math.PI/2,walk:0,neckLen:1.4,neckPitch:-.2+o.range(-.015,.015),neckSway:.02,neckLean:0,phase:.05,tint:e*.05});J.push(t),z.push(t)}await r.yield?.();const ye=(e,t,p)=>{const a=((p/nt*e.rate*e.walk+e.phase+Bt[t])%1+1)%1,l=Ne*Le*nt/e.rate/e.scale;if(a<Le)return[l*(.5-a/Le)*e.walk,0,a];const i=(a-Le)/(1-Le);return[l*(-.5+i*i*(3-2*i))*e.walk,Math.sin(Math.PI*i)*e.walk,a]},he=(e,t)=>e.z0+Ne*t*e.walk,V=(e,t,p,a=[])=>{const l=Math.cos(e.yaw),i=Math.sin(e.yaw),x=he(e,p),b=t[0]*e.scale,T=t[2]*e.scale;return a[0]=b*l+T*i+e.x,a[1]=t[1]*e.scale+D(x,e.scale),a[2]=-b*i+T*l+x,a},X=(e,t,p,a)=>{const l=e.S,i=l.neckAxis,x=l.neckLen,b=l.neckB;let T=t[0],j=t[1]-b[1]+i[1]*(e.neckLen-1)*x*p,Q=t[2]-b[2]+i[2]*(e.neckLen-1)*x*p;const ie=(e.neckPitch+(a==null?0:.05*Math.sin(a*.23+e.neckPhase*9)))*K(0,.6,p),E=Math.cos(ie),Z=Math.sin(ie),ge=j*E+Q*Z,Y=Q*E-j*Z,G=(a==null?0:e.neckSway*Math.sin(a*.31+e.neckPhase*6.2832))+e.neckLean;return T+=G*x*e.neckLen*p*p,[T,ge+b[1],Y+b[2]]},we=(e,t,p)=>{const a=e.S,l=p*.85*(.4+.6*e.walk)-4.2*t+e.tailPhase*6.2832,i=e.tailAmp*a.tailLen*.16*Math.pow(t,1.5),x=a.keys[0];return[i*Math.sin(l),re(a.tailY,x[1],t)+.25*i*Math.sin(l*.7+1.3)+.35*i,a.tailZ-t*a.tailLen]},_e=(e,t,p,a=[])=>{const l=e.S.hips[t],i=ye(e,t,p),x=he(e,p),b=Math.cos(e.yaw),T=Math.sin(e.yaw),j=l[0]*e.scale,Q=(l[2]+i[0])*e.scale,ie=-j*T+Q*b+x;return a[0]=j*b+Q*T+e.x,a[1]=ae(ie,e.scale)+i[1]*e.lift,a[2]=ie,a[3]=i[1]<.01?1:0,a},pe=(e,t,p,a,l)=>{const i=l[0]-a[0],x=l[1]-a[1],b=l[2]-a[2],T=i*i+x*x+b*b||1e-6,j=xe(((e-a[0])*i+(t-a[1])*x+(p-a[2])*b)/T,0,1);return Math.hypot(e-a[0]-i*j,t-a[1]-x*j,p-a[2]-b*j)},lt=()=>R.concat(I,J,F?[F]:[]),Ce=[],Te=[];function wt(e,t,p,a){let l=1e9;for(const i of lt()){const x=i.S,b=i.scale,T=he(i,a);if(Math.hypot(e-i.x,p-T)>24*b+l+14*(i.neckLen-1))continue;const j=x.belly;V(i,[0,j[0],j[3]],a,Ce),V(i,[0,j[0],j[4]],a,Te),l=Math.min(l,pe(e,t,p,Ce,Te)-(t<Ce[1]-.3*b?j[1]:j[2])*b);for(let E=0;E<4;E++){const Z=x.hips[E],ge=ye(i,E,a);_e(i,E,a,Te),V(i,[Z[0],Z[1],Z[2]+.4*ge[0]],a,Ce),l=Math.min(l,pe(e,t,p,Ce,Te)-x.legR[Z[2]>0?1:0]*1.1*b)}let Q=V(i,x.neckB,a,[]);for(let E=1;E<=4;E++){const Z=E/4,ge=[0,re(x.neckB[1],x.neckEnd[1],Z),re(x.neckB[2],x.neckEnd[2],Z)],Y=V(i,X(i,ge,Z,a),a,[]);l=Math.min(l,pe(e,t,p,Q,Y)-re(.75,.42,Z)*b),Q=Y}const ie=x.keys[x.keys.length-1];l=Math.min(l,pe(e,t,p,Q,V(i,X(i,[0,ie[1],ie[0]],1,a),a,Ce))-.5*b),Q=V(i,we(i,0,a),a,[]);for(let E=1;E<=6;E++){const Z=E/6,ge=V(i,we(i,Z,a),a,[]);l=Math.min(l,pe(e,t,p,Q,ge)-re(.75,.08,Math.sqrt(Z))*b),Q=ge}}return l}const ct=R,ut=new Float32Array(ct.length*16),xt=e=>{const t=[];return ct.forEach((p,a)=>{for(let l=0;l<4;l++)_e(p,l,e,t),ut.set(t,(a*4+l)*4)}),ut},ft=[0,13.97,9.45],$e=(e,t=new h.Vector3)=>t.fromArray(V(v,X(v,ft,1,e),e,Ce)),me=new h.Group;me.name="sauropod-ford-hero";const vt=Ue(ee,k,_),ht=Ue(Ae,k,_),bt=Ue(ee,k,_),Ee=[];(S.length||F)&&Ee.push(Oe(fe,F?S.concat([F]):S,vt)),Ee.push(Oe(ne,z,ht)),I.length&&Ee.push(Oe(ve,I,bt)),Ee.forEach(e=>me.add(e)),await r.yield?.();const Je=r.quality?.detail??1,ze=[],Ke=[];for(const e of R){const t=e.S,p=t.legR[0];for(let l=0;l<4;l++){const i=t.hips[l],x=[i[0],i[1],i[2],l];Ke.push({a:e,hip:x,seed:o()});for(let b=0,T=Math.round(9*Je);b<T;b++)ze.push({a:e,hip:x,type:0,seed:(b+o())/T,size:o.range(.2,.42)*e.scale});for(let b=0;b<3;b++)ze.push({a:e,hip:x,type:1,seed:o(),size:o.range(.3,.5)*p*1.6*e.scale})}const a=t.belly;for(let l=0,i=Math.round(10*Je);l<i;l++){const x=o.range(-.75,.75),b=o.range(a[3],a[4]);ze.push({a:e,hip:[x*a[2],a[0]-a[1]*Math.sqrt(1-x*x)*.96,b,0],type:2,seed:o(),size:o.range(.035,.06)})}}for(const e of I)for(let t=0;t<4;t++){const p=ee.hips[t],a=[p[0],p[1],p[2],t];for(let l=0;l<2;l++)ze.push({a:e,hip:a,type:0,seed:o(),size:o.range(.35,.5)})}for(const e of R.concat(J)){const t=e.S,p=t===Ae?8:2,a=X(e,t.crest,1,null);for(let l=0;l<p;l++)ze.push({a:e,hip:[a[0],a[1],a[2],0],type:3,seed:(l+o()*.6)/p,size:(t===Ae?.85:.5)*e.scale,extra:t.neckLen*e.neckLen})}const kt={x:0,z0:0,yaw:0,scale:1,phase:0,neckPhase:0,walk:0,rate:1,neckSway:0,lift:0};for(let e=0,t=Math.round(70*Je);e<t;e++)ze.push({a:kt,hip:[o.range(-60,60),o.range(3.2,6.2),o.range(U-te-30,U+70),0],type:4,seed:o(),size:o.range(6,11)});const zt=It(ze,k),Mt=Ft(Ke,k);me.add(Mt,zt);let Xe=null;u.water!==!1&&(Xe=qt(k,_),me.add(Xe)),await r.yield?.();const pt=29.6,de=$e(pt),mt=he(v,24),We=d+2.6,dt=J.length?V(J[0],X(J[0],[0,12.9,7.9],.86,null),0,[])[1]:15.5,Pt={portalSeat:{position:[0,7,q+18],facing:[0,0,-1],radius:7},arch:{position:[0,dt,q],openingWidth:12.4,openingHeight:dt-.6,heads:J.map(e=>V(e,X(e,ft,1,null),0,[]))},flyThrough:[[0,5.2,U-te-80],[0,5,U-te-30],[0,We,U-te+10],[0,We,U-te*.6],[0,We,U-te*.25],[.2,We,mt-16],[.1,8.6,mt+1],[de.x+4,de.y-.6,de.z-2],[de.x+4.2,de.y-.2,de.z+12],[0,9.6,q-62],[0,7.6,q-42],[0,7.6,q],[0,7.6,q+18]],matriarch:{head:de.toArray(),headTime:pt,eyeSide:[1,0,0],x:v.x,z0:v.z0,scale:v.scale},brachiosaurs:A.map(e=>({x:e.x,z0:e.z0,scale:e.scale})),viewpoints:{skim:[0,5.2,U-te-80],under:A[0]?[A[0].x+6,We,A[0].z0+12]:[0,We,0],head:[de.x+4,de.y-.4,de.z],arch:[0,7.6,q-60]},extent:{center:[0,5,30],radius:240,height:17.5},waterY:d,sunDir:ue.toArray(),herdSpeed:Ne,column:{zHead:U,zTail:U-te,lanes:n}};let Ie=new h.Vector3(0,5,U-38),Ye=26,Ge=16,Qe=u.focus;if(Qe==="head")$e(12,Ie),Ie.y-=.6,Ye=-2.4,Ge=2.5;else if(Qe==="under"){const e=A[1]||v;Ie.set(0,3.2,he(e,12)),Ye=5,Ge=3.2}else Qe==="arch"&&(Ie.set(0,8,q),Ye=13,Ge=10);let Be=null,et=null,tt=null,at=!!u.sunDir;const At=ht.userData.uniforms,Ct=({sunDir:e,sunColor:t}={})=>{e&&k.uSunDirW.value.set(e.x??e[0],e.y??e[1],e.z??e[2]).normalize(),t&&k.uSunCol.value.copy(t),at=!0},je=new h.Vector3,gt=new h.Vector3;function yt(e,t,p){if(!at&&me.parent){let x=me;for(;x.parent;)x=x.parent;let b=null;x.traverse(T=>{!b&&T.isDirectionalLight&&(b=T)}),b&&(b.getWorldPosition(je),b.target.getWorldPosition(gt),je.sub(gt),je.lengthSq()>1e-6&&k.uSunDirW.value.copy(je.normalize()),k.uSunCol.value.copy(b.color).multiplyScalar(xe(b.intensity/2.6,.2,1.4))),at=!0}const a=et??(Be!=null?Be*c:t);k.uTime.value=a;const l=me.matrixWorld.elements[13]+d;k.uWaterW.value=l,k.uMist.value.x=l;const i=Be!=null?K(.745,.754,Be)*(1-K(.764,.776,Be)):0;At.uBlink.value=tt??i}yt(0,0,null);let Ze=null;function St(e){if(Ze)return Ze;const t={S:ee,x:e.x,z0:e.z,yaw:e.yaw??0,scale:e.scale??.9,phase:e.phase??.05,neckPhase:e.neckPhase??0,tailPhase:e.tailPhase??0,tint:e.tint??0,neckPitch:0,neckLen:1,walk:0,rate:1,neckSway:e.neckSway??.05,neckLean:e.neckLean??0,tailAmp:e.tailAmp??1,lift:ee.lift*(e.scale??.9)},p=e.bedY??0,a=Math.cos(t.yaw),l=Math.sin(t.yaw),i=(Y,G=[])=>{const Me=Y[0]*t.scale,Se=Y[2]*t.scale;return G[0]=Me*a+Se*l+t.x,G[1]=Y[1]*t.scale+p,G[2]=-Me*l+Se*a+t.z0,G},x=ee.keys[ee.keys.length-1],b=(Y,G=null)=>(t.neckPitch=Y,i(X(t,[0,x[1],x[0]],1,G),[]));let T=-1.3,j=.2;for(let Y=0;Y<26;Y++){const G=(T+j)/2;b(G)[1]>(e.muzzleY??d)?j=G:T=G}t.neckPitch=(T+j)/2;const Q=Ue(ee,{...k,uBed:{value:new Float32Array(be).fill(p)}},_),ie=Oe(fe,[t],Q);ie.name="sauropod-ford-wader",me.add(ie);const E=[],Z=[],ge=(Y,G,Me,Se)=>{const Pe=ee,Fe=t.scale,qe=Pe.belly;let le=1e9;i([0,qe[0],qe[3]],E),i([0,qe[0],qe[4]],Z),le=Math.min(le,pe(Y,G,Me,E,Z)-qe[2]*Fe);for(let ce=0;ce<4;ce++){const se=Pe.hips[ce];i(se,E),i([se[0],0,se[2]],Z),le=Math.min(le,pe(Y,G,Me,E,Z)-Pe.legR[se[2]>0?1:0]*1.1*Fe)}let Re=i(Pe.neckB,[]);for(let ce=1;ce<=4;ce++){const se=ce/4,De=i(X(t,[0,re(Pe.neckB[1],Pe.neckEnd[1],se),re(Pe.neckB[2],Pe.neckEnd[2],se)],se,Se),[]);le=Math.min(le,pe(Y,G,Me,Re,De)-re(.75,.42,se)*Fe),Re=De}le=Math.min(le,pe(Y,G,Me,Re,i(X(t,[0,x[1],x[0]],1,Se),E))-.5*Fe),Re=i(we(t,0,Se),[]);for(let ce=1;ce<=6;ce++){const se=ce/6,De=i(we(t,se,Se),[]);le=Math.min(le,pe(Y,G,Me,Re,De)-re(.75,.08,Math.sqrt(se))*Fe),Re=De}return le};return Ze={muzzle:b(t.neckPitch),feet:ee.hips.map(Y=>{const G=i([Y[0],0,Y[2]],[]);return[G[0],G[2]]}),body:[t.x,t.z0],neckPitch:t.neckPitch,scale:t.scale,yaw:t.yaw,clearance:ge,triangles:fe.userData.triangles,dispose(){Q.dispose()}},Ze}let ot=0;for(const[e,t]of[[fe,S.length],[ne,z.length],[ve,I.length]])ot+=e.userData.triangles*t;return ot+=ze.length*2+Ke.length*2+(Xe?2:0),{object:me,radius:Ye,height:Ge,center:Ie,anchors:Pt,update:yt,dispose(){fe.dispose(),ne.dispose(),ve.dispose()},ground:!0,groundY:0,setProgress(e){Be=e},setHerdTime(e){et=e},setBlink(e){tt=e},setLight:Ct,setRear(e){vt.userData.uniforms.uRear.value=e},setZOffset(e){k.uGait.value.w=e},clearance:wt,feet:xt,matriarchHead:$e,uniforms:k,addWader:St,animals:lt().map(e=>({species:e.S.name,x:e.x,z0:e.z0,yaw:e.yaw,scale:e.scale,walking:e.walk>0,juvenile:e.rate>1})),stats:{triangles:ot,drawCalls:me.children.length,adults:R.length,juveniles:I.length}}}export{Ve as MIST_GLSL,Ht as buildHero};
