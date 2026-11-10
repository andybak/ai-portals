import*as y from"three";import{clamp as Se,lerp as le,smoothstep as ge,makeRng as Ze,hashSeed as Ht}from"../kit/core.js";const nt=Math.PI/180,zt=-22,lt=6*nt,Fe=2865,Be=Math.sin(lt),St=Math.cos(lt),Tt=Math.tan(lt),de=Fe*(Math.sin(36*nt)-Be),ht=Math.tan(36*nt),Ct=9.1,Ye=46,Je=26,ue=5,Qe=4,ut=1,Te=42,Ut=-1800,Kt=4200,ft=520,Ge=26,mt=19,At=.7,Ft=3,Lt=5,ct=.42,fe={x:34,y:40,z:-86},Le={x:48,z:-104,a:142,b:100},M=e=>Number.isInteger(e)?e+".":String(e);function Ce(e){const a=Se(e,0,de),p=Be+a/Fe;let v=zt+Fe*(St-Math.sqrt(Math.max(1-p*p,1e-4)));const u=Math.max(e-de,0);return v+=Math.max(ht*u-u*u/900,-1400),v+Math.min(e,0)*Tt}function be(e,a,p,v=new y.Vector3){const u=Se(e,0,de),h=Be+u/Fe,n=Math.sqrt(Math.max(1-h*h,1e-4));return v.set(Ce(u)+n*a,p,u-h*a)}const Ee=`
uniform float uTime, uBoreZ, uLead, uPlume, uSeed, uRare, uCrossD;
float wallX(float z){
  float zc = clamp(z, 0., ${M(de)}), sn = ${M(Be)} + zc / ${M(Fe)};
  float x = ${M(zt)} + ${M(Fe)} * (${M(St)} - sqrt(max(1. - sn * sn, 1e-4)));
  float o = max(z - ${M(de)}, 0.); x += max(${M(ht)} * o - o * o / 900., -1400.);
  return x + min(z, 0.) * ${M(Tt)};
}
float wallDx(float z){
  float zc = clamp(z, 0., ${M(de)}), sn = ${M(Be)} + zc / ${M(Fe)};
  float o = z - ${M(de)};
  if (o > 0.) return (o < 1700.) ? ${M(ht)} - o / 450. : 0.;
  return sn / sqrt(max(1. - sn * sn, 1e-4));
}
float zFront(float d){
  return uBoreZ - uLead * exp(-max(d, 0.) / ${M(Je)}) + 4.5 * sin(d * 0.0021 + uSeed) + 2. * sin(d * 0.0113 + 2.1 * uSeed);
}
float dzFront(float d){
  return (d > 0. ? uLead / ${M(Je)} * exp(-d / ${M(Je)}) : 0.) + 0.00945 * cos(d * 0.0021 + uSeed) + 0.0226 * cos(d * 0.0113 + 2.1 * uSeed);
}
// river height: s metres behind the front crest (negative = ahead), d metres from the wall line.
// boreProf is the bore's own section (face, lip, swells) and boreDs its slope, exact, so a fragment can shade the
// face and the lip without the mesh showing; boreExtra is everything that also depends on the wall or the rare tide.
float boreProf(float s){
  float t = clamp(1. + s / ${M(ue)}, 0., 1.), sb = max(s, 0.);
  float env = exp(-sb / 150.) * (1. - smoothstep(${M(5.2*Te)}, ${M(6*Te)}, sb));
  float h = s < 0. ? ${M(Qe)} * t * t * (1.6 - 0.6 * t) : 2.4 + 0.4 * (1. - exp(-sb / 400.)) + 1.6 * env * cos(sb * ${M(2*Math.PI/Te)});
  float tr = s + ${M(ue+2.6)}; h -= ${M(ct)} * exp(-tr * tr / 7.);                                           // the river is drawn down just ahead of the toe
  return h + ${M(ut)} * exp(-s * s / (s < 0. ? 2.2 : 6.5));                                                    // the lip overshoots the crest
}
float boreDs(float s){
  float t = clamp(1. + s / ${M(ue)}, 0., 1.), sb = max(s, 0.), k = ${M(2*Math.PI/Te)};
  float env = exp(-sb / 150.) * (1. - smoothstep(${M(5.2*Te)}, ${M(6*Te)}, sb));
  float f = s < 0. ? ${M(Qe/ue)} * t * (3.2 - 1.8 * t) * step(${M(-ue)}, s) : 0.001 * exp(-sb / 400.) - 1.6 * env * (k * sin(sb * k) + cos(sb * k) / 150.);
  float tr = s + ${M(ue+2.6)}; f += ${M(ct)} * exp(-tr * tr / 7.) * 2. * tr / 7.;
  return f - ${M(ut)} * exp(-s * s / (s < 0. ? 2.2 : 6.5)) * 2. * s / (s < 0. ? 2.2 : 6.5);
}
float crossS(float d){ return ${M(At)} * (d - uCrossD) + 1.5 * sin(d * 0.09 + uSeed) + 0.8 * sin(d * 0.23); }      // the rare ridge: how far its crest lies ahead of the bore's, d metres off the wall (it is not a ruler line)
float boreExtra(float s, float d){
  float sb = max(s, 0.), dw = max(d - 2.5, 0.);
  float h = uPlume * 5.5 * exp(-dw / 6.) * exp(-(s - 4.) * (s - 4.) / 260.) * smoothstep(-12., -2., s);          // run-up under the plume
  h += uPlume * 0.75 * exp(-dw / 70.) * sin(dw * 0.21 - uTime * 1.9) * smoothstep(8., 40., s) * exp(-sb / 420.);   // backwash off the wall
  // the rare crossing tide: a second, oblique ridge that meets the bore uCrossD metres off the wall
  // (a steep jade front 3 m high and a long back; it reaches far out on the river side, where it runs ahead of the bore)
  float s2 = s + crossS(d), win = (d - uCrossD) / (d > uCrossD ? 130. : 45.);
  h += uRare * ${M(Ft)} * smoothstep(-25., 5., uCrossD) * exp(-win * win) * exp(-s2 * s2 / (s2 < 0. ? ${M(Lt)} : 90.));
  // the lip is torn: it stands higher here and lower there along the front, and the lumps travel along it
  float lw = 0.48 * sin(d * 0.21 + uTime * 0.9 + uSeed) + 0.34 * sin(d * 0.345 - uTime * 0.63 + 2.1 * uSeed) + 0.14 * sin(d * 0.52 + uTime * 1.31 + 4.2);
  h += lw * exp(-s * s / (s < 0. ? 3. : 9.)) * smoothstep(8., 30., d);
  return h;
}
float boreH(float s, float d){ return boreProf(s) + boreExtra(s, d); }
`,Ao=Ee,_e=`
uniform vec4 uRid;
float ridGap(float d){
  return 1. - max(uRid.y * (1. - smoothstep(2.5, 7., abs(d - uRid.x))), uRid.w * (1. - smoothstep(2.5, 7., abs(d - uRid.z))));
}`,He=`
vec2 footLobe(float x){
  // (both fields are read at a coarse level of the texture, the same in the vertex and in the fragment: nothing in them is
  // narrower than two columns of the river's mesh, which stand 1.5 to 2 m apart within 200 m of the seawall)
  float a = textureLod(uNoise, vec2(x * 0.0125 + 0.17, 0.62 + uTime * 0.017), 3.).r;
  float b = textureLod(uNoise, vec2(x * 0.041 + 0.43, 0.21 - uTime * 0.043), 4.4).a;
  float c = textureLod(uNoise, vec2(x * 0.027 + 0.83, 0.39 + uTime * 0.03), 3.8).r;
  float lobe = smoothstep(0.3, 0.7, a), tongue = clamp((b - 0.48) * 4., 0., 1.);
  float e = textureLod(uNoise, vec2(x * 0.055 + 0.37, 0.91 - uTime * 0.045), 4.8).a;
  return vec2(0.7 + 2.9 * lobe + 3.6 * tongue * tongue, max(0.06 + 0.5 * smoothstep(0.34, 0.68, c) + 0.7 * (e - 0.5), 0.03));      // (heaped knee high here, a flat sheet there)
}
float footH(float s, vec2 lb){
  float c = s + ${M(ue)}, f0 = -clamp(lb.x - 1.2, 0.8, 2.8);      // (the heap begins well behind the white water's leading edge: no bare water is ever heaped)
  float body = smoothstep(f0, f0 + 1.7, c) * (1. - smoothstep(-0.6, 1., c));      // (a low wedge with a long front slope, never a kerb at the foot of the wave)
  float sheet = smoothstep(-lb.x, -lb.x + 2.2, c) * (1. - smoothstep(-1.5, 0.1, c));
  return lb.y * body + 0.15 * sheet;
}
float crestRag(float x){
  float a = textureLod(uNoise, vec2(x * 0.033 + 0.71, 0.13 + uTime * 0.05), 4.2).a - 0.5;
  float b = textureLod(uNoise, vec2(x * 0.05 + 0.29, 0.77 - uTime * 0.11), 4.6).r - 0.5;
  return 2.4 * a + 1.8 * b;
}`,$t=`
float foamNet(vec2 p){
  vec2 ip = floor(p), fp = p - ip; float f1 = 9., f2 = 9.;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j)), c = ip + g;
      vec3 q = fract(vec3(c.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33);
      vec2 o = 0.5 + 0.4 * sin(uTime * 0.9 + 6.2832 * fract((q.xx + q.yz) * q.zy));
      vec2 r = g + o - fp; float dd = dot(r, r);
      if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) { f2 = dd; }
    }
  }
  return sqrt(f2) - sqrt(f1);
}
float foamCell(vec2 p){
  vec2 ip = floor(p), fp = p - ip; float f1 = 9., f2 = 9., f3 = 9.;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j)), c = ip + g;
      vec3 q = fract(vec3(c.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33);
      vec2 o = 0.5 + 0.4 * sin(uTime * 0.9 + 6.2832 * fract((q.xx + q.yz) * q.zy));
      vec2 r = g + o - fp; float dd = dot(r, r);
      if (dd < f1) { f3 = f2; f2 = f1; f1 = dd; } else if (dd < f2) { f3 = f2; f2 = dd; } else if (dd < f3) { f3 = dd; }
    }
  }
  float d1 = sqrt(f1), d2 = sqrt(f2), d3 = sqrt(f3);
  // (the share of the water under a width w is the same with the knots as without: 1.25 makes up for what they add)
  return 1.25 * (d2 - d1) * mix(0.5, 1., smoothstep(0.04, 0.5, d3 - d1));
}
vec2 netWarp(vec2 p){
  vec2 a = vec2(sin(p.y * 3.1 + 1.7 * sin(p.x * 1.9 + uTime * 0.31)), sin(p.x * 3.7 + 1.7 * sin(p.y * 2.3 - uTime * 0.23) + 2.));
  vec2 b = vec2(sin(p.y * 9.7 + 1.3 * a.y + p.x * 2.9), sin(p.x * 11.3 + 1.3 * a.x - p.y * 3.3));
  return 0.1 * a + 0.04 * b;
}
float netW(float F, float w, float aa, float px){
  return mix(1. - smoothstep(w - aa, w + aa, F), 1. - exp(-2.8 * max(w, 0.)), smoothstep(0.4, 1.1, px));
}`;async function jt(e,a){const v=t=>{const s=new Float32Array(t*t);for(let r=0;r<s.length;r++)s[r]=e();return s},u=async()=>{const t=new Float32Array(65536);let s=.5,r=0;for(let g=0;g<5;g++){const D=4<<g,B=v(D),q=D/256;r+=s;for(let A=0;A<256;A++){const k=A*q,S=Math.floor(k),d=k-S,i=d*d*(3-2*d),L=S%D*D,x=(S+1)%D*D;for(let z=0;z<256;z++){const F=z*q,K=Math.floor(F),P=F-K,Y=P*P*(3-2*P),X=K%D,we=(K+1)%D,$=B[L+X]+(B[L+we]-B[L+X])*Y,$e=B[x+X]+(B[x+we]-B[x+X])*Y;t[A*256+z]+=s*($+($e-$)*i)}(A&7)===7&&await a.yield()}s*=.5,await a.yield()}let m=1e9,l=-1e9;for(let g=0;g<t.length;g++){const D=t[g];D<m&&(m=D),D>l&&(l=D),(g&2047)===2047&&await a.yield()}for(let g=0;g<t.length;g++)t[g]=(t[g]-m)/(l-m),(g&2047)===2047&&await a.yield();await a.yield();let w=0,c=0;for(let g=0;g<t.length;g++)w+=t[g],(g&2047)===2047&&await a.yield();w/=t.length;for(let g=0;g<t.length;g++)c+=(t[g]-w)*(t[g]-w),(g&2047)===2047&&await a.yield();const b=.18/Math.max(Math.sqrt(c/t.length),.05);for(let g=0;g<t.length;g++){const D=.5+(t[g]-w)*b;t[g]=D<0?0:D>1?1:D,(g&2047)===2047&&await a.yield()}return await a.yield(),t},h=await u();await a.yield();const n=await u();await a.yield();const f=new Uint8Array(256*256*4);for(let t=0;t<256;t++){for(let s=0;s<256;s++){const r=t*256+s,m=t*256+(s+1)%256,l=t*256+(s+256-1)%256,w=(t+1)%256*256+s,c=(t+256-1)%256*256+s;f[r*4]=h[r]*255,f[r*4+1]=Se(.5+(h[m]-h[l])*3.2,0,1)*255,f[r*4+2]=Se(.5+(h[w]-h[c])*3.2,0,1)*255,f[r*4+3]=n[r]*255}(t&3)===3&&await a.yield()}const o=new y.DataTexture(f,256,256,y.RGBAFormat,y.UnsignedByteType);return o.wrapS=o.wrapT=y.RepeatWrapping,o.magFilter=y.LinearFilter,o.minFilter=y.LinearMipmapLinearFilter,o.generateMipmaps=!0,o.anisotropy=4,o.colorSpace=y.NoColorSpace,o.needsUpdate=!0,o}async function Dt(e,a){const p=e.attributes.position,v=e.index,u=new y.BufferAttribute(new Float32Array(p.count*3),3),h=new y.Vector3,n=new y.Vector3,f=new y.Vector3,o=new y.Vector3,t=new y.Vector3,s=new y.Vector3,r=new y.Vector3,m=new y.Vector3;if(e.setAttribute("normal",u),v)for(let l=0,w=v.count;l<w;l+=3){const c=v.getX(l),b=v.getX(l+1),g=v.getX(l+2);h.fromBufferAttribute(p,c),n.fromBufferAttribute(p,b),f.fromBufferAttribute(p,g),r.subVectors(f,n),m.subVectors(h,n),r.cross(m),o.fromBufferAttribute(u,c),t.fromBufferAttribute(u,b),s.fromBufferAttribute(u,g),o.add(r),t.add(r),s.add(r),u.setXYZ(c,o.x,o.y,o.z),u.setXYZ(b,t.x,t.y,t.z),u.setXYZ(g,s.x,s.y,s.z),l%900===897&&await a.yield()}else for(let l=0,w=p.count;l<w;l+=3)h.fromBufferAttribute(p,l),n.fromBufferAttribute(p,l+1),f.fromBufferAttribute(p,l+2),r.subVectors(f,n),m.subVectors(h,n),r.cross(m),u.setXYZ(l,r.x,r.y,r.z),u.setXYZ(l+1,r.x,r.y,r.z),u.setXYZ(l+2,r.x,r.y,r.z),l%1800===1797&&await a.yield();await a.yield();for(let l=0,w=u.count;l<w;l++)h.fromBufferAttribute(u,l),h.normalize(),u.setXYZ(l,h.x,h.y,h.z),l%2e3===1999&&await a.yield();u.needsUpdate=!0}async function Vt(e,a){const p=e.attributes.position,v=p.count,u=new y.Box3,h=new y.Vector3,n=new y.Sphere;for(let o=0;o<v;o++)u.expandByPoint(h.fromBufferAttribute(p,o)),o%4e3===3999&&await a.yield();u.getCenter(n.center);let f=0;for(let o=0;o<v;o++)h.fromBufferAttribute(p,o),f=Math.max(f,n.center.distanceToSquared(h)),o%4e3===3999&&await a.yield();n.radius=Math.sqrt(f),e.boundingSphere=n}function et(){const e=[],a=[],p=[],v=[];let u=1,h=1,n=1,f=0;const o={col(t,s=0,r){const m=r?1+(r()-.5)*2*s:1;return u=t.r*m,h=t.g*m,n=t.b*m,o},kind(t){return f=t,o},v(t,s,r,m,l){e.push(t,s,r),a.push(u,h,n),p.push(m,l),v.push(f)},tri(t,s,r,m=0,l=0,w=1,c=0,b=0,g=1){o.v(t[0],t[1],t[2],m,l),o.v(s[0],s[1],s[2],w,c),o.v(r[0],r[1],r[2],b,g)},quad(t,s,r,m,l=0,w=0,c=1,b=1){o.v(t[0],t[1],t[2],l,w),o.v(s[0],s[1],s[2],c,w),o.v(r[0],r[1],r[2],c,b),o.v(t[0],t[1],t[2],l,w),o.v(r[0],r[1],r[2],c,b),o.v(m[0],m[1],m[2],l,b)},box(t,s,r,m,l,w,c=0,b=1,g=!0){const D=Math.cos(c),B=Math.sin(c),q=[[-1,-1],[1,-1],[1,1],[-1,1]],A=(k,S,d)=>{const i=q[k][0]*m*S,L=q[k][1]*w*S;return[t+i*D+L*B,d,r-i*B+L*D]};for(let k=0;k<4;k++){const S=(k+1)%4,d=(k%2?w:m)*2;o.quad(A(k,1,s),A(S,1,s),A(S,b,l),A(k,b,l),0,s,d,l)}g&&o.quad(A(0,b,l),A(1,b,l),A(2,b,l),A(3,b,l),0,0,m*2,w*2)},get count(){return e.length/9},toGeometry(){const t=new y.BufferGeometry;return t.setAttribute("position",new y.Float32BufferAttribute(e,3)),t.setAttribute("color",new y.Float32BufferAttribute(a,3)),t.setAttribute("uv",new y.Float32BufferAttribute(p,2)),t.setAttribute("aK",new y.Float32BufferAttribute(v,1)),t.computeVertexNormals(),t.computeBoundingSphere(),t},async toGeometrySteps(t){const s=new y.BufferGeometry;return s.setAttribute("position",new y.Float32BufferAttribute(e,3)),await t.yield(),s.setAttribute("color",new y.Float32BufferAttribute(a,3)),await t.yield(),s.setAttribute("uv",new y.Float32BufferAttribute(p,2)),s.setAttribute("aK",new y.Float32BufferAttribute(v,1)),await t.yield(),await Dt(s,t),await t.yield(),await Vt(s,t),s}};return o}function Ue(e,a){const{C:p,D:v,eIn:u,eOut:h,yIn:n,drop:f,lift:o=.8,segs:t=6,rad:s=3,thick:r=.26,tile:m,edge:l,soffit:w,soffitE:c,soffitY:b,ridge:g}=a,D=p.length,B=a.cx||0,q=a.cz||0,A=(k,S,d,i=0)=>{const L=(k+1)%D,x=u+(h-u)*d,z=Math.abs(2*S-1),F=p[k][0]+v[k][0]*x,K=p[k][1]+v[k][1]*x,P=p[L][0]+v[L][0]*x,Y=p[L][1]+v[L][1]*x,X=1+.06*z*z*z*d*d;return[B+(F+(P-F)*S)*X,n-f*(1-(1-d)*(1-d))+o*z*z*z*d*d+i,q+(K+(Y-K)*S)*X]};for(let k=0;k<D;k++){const S=(k+1)%D,d=Math.hypot(p[S][0]+v[S][0]*h-p[k][0]-v[k][0]*h,p[S][1]+v[S][1]*h-p[k][1]-v[k][1]*h);for(let i=0;i<t;i++){const L=i/t,x=(i+1)/t;e.kind(1).col(m);for(let z=0;z<s;z++){const F=z/s,K=(z+1)/s;e.quad(A(k,L,F),A(k,x,F),A(k,x,K),A(k,L,K),L*d,F*(h-u),x*d,K*(h-u))}if(e.kind(0).col(l),e.quad(A(k,L,1),A(k,x,1),A(k,x,1,-r),A(k,L,1,-r),L*d,0,x*d,r),w){const z=[B+p[k][0]+v[k][0]*c,b,q+p[k][1]+v[k][1]*c],F=[B+p[S][0]+v[S][0]*c,b,q+p[S][1]+v[S][1]*c],K=[le(z[0],F[0],L),b,le(z[2],F[2],L)],P=[le(z[0],F[0],x),b,le(z[2],F[2],x)];e.kind(4).col(w),e.quad(A(k,L,1,-r),A(k,x,1,-r),P,K,L*d*3,0,x*d*3,1)}}if(g){e.kind(0).col(g);const i=(k+D-1)%D;for(let L=0;L<s;L++){const x=L/s,z=(L+1)/s,F=.5/t,K=A(i,1-F*.5,x),P=A(i,1-F*.5,z),Y=A(k,F*.5,x),X=A(k,F*.5,z),we=A(k,0,x,.32),$=A(k,0,z,.32+(L===s-1?.25:0));e.quad(K,we,$,P,0,0,1,1),e.quad(we,Y,X,$,0,0,1,1)}}}}const Nt=(e,a=0)=>{const p=[],v=[];for(let u=0;u<e;u++){const h=a+u/e*Math.PI*2;p.push([0,0]),v.push([Math.cos(h),Math.sin(h)])}return{C:p,D:v}},Mt=(e,a=0)=>{const p=Math.cos(a),v=Math.sin(a),u=[[1,1],[-1,1],[-1,-1],[1,-1]],h=(n,f)=>[n*p+f*v,-n*v+f*p];return{C:u.map(([n])=>h(n*e,0)),D:u.map(([n,f])=>h(n,f))}};function Ke(e,a,p,v,u=10,h=0){for(let n=0;n<v.length-1;n++){const[f,o]=v[n],[t,s]=v[n+1];for(let r=0;r<u;r++){const m=h+r/u*Math.PI*2,l=h+(r+1)/u*Math.PI*2,w=(c,b,g)=>[a+Math.cos(g)*c,b,p+Math.sin(g)*c];f<.001?e.tri(w(f,o,m),w(t,s,l),w(t,s,m),0,0,1,1,0,1):t<.001?e.tri(w(f,o,m),w(f,o,l),w(t,s,m),0,0,1,0,0,1):e.quad(w(f,o,m),w(f,o,l),w(t,s,l),w(t,s,m),m*f,o,l*f,s)}}}async function Ot(e,a,p,v){const{x:u,y:h,z:n}=fe,f=Nt(8,Math.PI/8),o=13;e.kind(2).col(a.stoneLight),Ke(e,u,n,[[21.5,h-6],[20.5,h+.9],[20.9,h+1.2],[18.6,h+1.2],[18.2,h+2.2],[18.6,h+2.5],[0,h+2.5]],8,Math.PI/8);let t=h+2.5;const s=m=>le(10.6,5.6,Math.pow(m/(o-1),.92));for(let m=0;m<o;m++){const l=m/(o-1),w=le(4.6,2.95,l),c=s(m),b=m<o-1?s(m+1):.5,g=w*.64,D=(A,k,S)=>{const d=Math.PI/8+A/8*Math.PI*2;return[u+Math.cos(d)*k,S,n+Math.sin(d)*k]};for(let A=0;A<8;A++){const k=A+1,S=2*c*Math.sin(Math.PI/8),d=(K,P,Y=c)=>{const X=D(A,Y,P),we=D(k,Y,P);return[le(X[0],we[0],K),P,le(X[2],we[2],K)]};e.kind(4).col(a.timberDark),e.quad(d(0,t,c+1),d(1,t,c+1),d(1,t+.62,c+1),d(0,t+.62,c+1),0,0,S*2.2,1);const i=.33,L=.67,x=g*(A%2===m%2?.72:.5),z=A%2===m%2?0:g*.22;e.kind(0).col(a.plaster,.05,p),e.quad(d(0,t),d(i,t),d(i,t+g),d(0,t+g),0,t,S*i,t+g),e.quad(d(L,t),d(1,t),d(1,t+g),d(L,t+g),S*L,t,S,t+g),e.kind(4).col(a.timber),e.quad(d(i,t+z+x),d(L,t+z+x),d(L,t+g),d(i,t+g),0,0,1,1),z>0&&e.quad(d(i,t),d(L,t),d(L,t+z),d(i,t+z),0,0,1,1),e.kind(8).col(a.opening),e.quad(d(i,t+z,c-.25),d(L,t+z,c-.25),d(L,t+z+x,c-.25),d(i,t+z+x,c-.25),0,0,1,1),e.kind(4).col(a.bracket),e.quad(d(0,t+g),d(1,t+g),d(1,t+w*.8,c+.85),d(0,t+w*.8,c+.85),0,0,S*2.5,1);const F=D(A,c+.05,t);e.kind(4).col(a.timber),e.box(F[0],t,F[2],.3,t+g,.3,-Math.PI/8-A/8*Math.PI*2,1,!1)}const B=m===o-1,q=le(3.7,2.5,l);Ue(e,{cx:u,cz:n,C:f.C,D:f.D,eIn:B?.45:b*.97,eOut:c+q,yIn:t+w+(B?3.4:.4),drop:(B?3.4:.4)+w*.2+.05,lift:le(1.25,.7,l),segs:m<6?6:4,rad:B?4:3,tile:a.tile,edge:a.tileEdge,soffit:a.timber,soffitE:c+.85,soffitY:t+w*.8,ridge:a.tileEdge}),e.kind(0).col(a.gold);for(let A=0;A<8;A++){const k=Math.PI/8+A/8*Math.PI*2,S=(c+q)*1.05,d=u+Math.cos(k)*S,i=n+Math.sin(k)*S,L=t+w*.8-.26+le(1.25,.7,l)-(.2*w+.05)+.2;e.tri([d-.2,L,i],[d+.2,L,i],[d,L-.55,i]),e.tri([d,L,i-.2],[d,L,i+.2],[d,L-.55,i])}t+=w,await v.yield()}t+=3.3;const r=[[.9,t-.4],[1.5,t+.2],[.7,t+.8],[.45,t+1]];for(let m=0;m<6;m++){const l=t+1.2+m*.72,w=1.25-m*.15;r.push([.3,l-.12],[w,l],[w,l+.16],[.3,l+.3])}return r.push([.25,t+5.6],[.62,t+6],[.62,t+6.5],[.2,t+6.9],[.08,t+8.4],[0,t+8.6]),e.kind(0).col(a.gold),Ke(e,u,n,r,8),t+8.6}function Xt(e,a,p,v,u,h,n,f,o,t){const s=Nt(f,n+Math.PI/f),r=p.chance(.5)?a.tile:a.tileGreen;e.kind(2).col(a.stoneLight,.06,p),Ke(e,v,h,[[o+1.5,u-.2],[o+1.3,u+.5],[0,u+.5]],f,n+Math.PI/f);const m=3.6+o*.22;for(let w=0;w<f;w++){const c=v+s.D[w][0]*o,b=h+s.D[w][1]*o;e.kind(4).col(a.timber),e.box(c,u+.5,b,.2,u+.5+m,.2,n,1,!1);const g=(w+1)%f,D=v+s.D[g][0]*o,B=h+s.D[g][1]*o;e.col(a.bracket),e.quad([c,u+m-.25,b],[D,u+m-.25,B],[D,u+m+.5,B],[c,u+m+.5,b],0,0,3,1),e.col(a.timberDark),e.quad([c,u+.5,b],[D,u+.5,B],[D,u+1.2,B],[c,u+1.2,b],0,0,4,1)}let l=u+.5+m;t&&(Ue(e,{cx:v,cz:h,C:s.C,D:s.D,eIn:o*.55,eOut:o+1.7,yIn:l+1.25,drop:1.25,lift:.95,segs:4,rad:3,tile:r,edge:a.tileEdge,soffit:a.timber,soffitE:o,soffitY:l,ridge:a.tileEdge}),e.kind(8).col(a.opening),Ke(e,v,h,[[o*.56,l+1],[o*.56,l+2.2]],f,n+Math.PI/f),l+=1.9,o*=.56),Ue(e,{cx:v,cz:h,C:s.C,D:s.D,eIn:.25,eOut:o+1.8,yIn:l+2.5,drop:2.5,lift:1.1,segs:4,rad:4,tile:r,edge:a.tileEdge,soffit:a.timber,soffitE:o,soffitY:l,ridge:a.tileEdge}),e.kind(0).col(a.gold),Ke(e,v,h,[[.3,l+2.4],[.5,l+2.8],[.18,l+3.2],[.34,l+3.5],[0,l+4.1]],6)}const ke={X0:-24,X1:28,YT:20,SP:7.3,A:7.3,RO:8.9,ZB:-34,PR:.4};async function Zt(e,a,p,v){const{X0:u,X1:h,YT:n,SP:f,A:o,RO:t,ZB:s,PR:r}=ke,m=x=>-.08*Se(x,0,n),l=(x,z,F=0)=>[x,z,m(z)+F];e.kind(2).col(a.stone),e.quad(l(u,-3),l(-t,-3),l(-t,f),l(u,f),u,-3,-t,f),e.quad(l(t,-3),l(h,-3),l(h,f),l(t,f),t,-3,h,f),e.col(a.stoneLight),e.quad(l(-t,-3,r),l(-o,-3,r),l(-o,f,r),l(-t,f,r),-t,-3,-o,f),e.quad(l(o,-3,r),l(t,-3,r),l(t,f,r),l(o,f,r),o,-3,t,f);const w=18,c=[];for(let x=0;x<=w;x++)c.push(x/w*Math.PI);c.push(Math.atan2(n-f,h),Math.atan2(n-f,u)),c.sort((x,z)=>x-z);const b=x=>{const z=Math.cos(x),F=Math.sin(x),K=z>1e-6?h/z:z<-1e-6?u/z:1e9,P=F>1e-6?(n-f)/F:1e9,Y=Math.min(K,P);return l(z*Y,f+F*Y)},g=(x,z,F)=>l(Math.cos(z)*x,f+Math.sin(z)*x,F);for(let x=0;x<c.length-1;x++){const z=c[x],F=c[x+1];if(F-z<1e-5)continue;e.col(x%2?a.stoneLight:a.stonePale),e.quad(g(o,z,r),g(o,F,r),g(t,F,r),g(t,z,r),z*8,0,F*8,1.6),e.col(a.stone);const K=g(t,z,0),P=g(t,F,0),Y=b(F),X=b(z);e.v(K[0],K[1],K[2],K[0],K[1]),e.v(P[0],P[1],P[2],P[0],P[1]),e.v(Y[0],Y[1],Y[2],Y[0],Y[1]),e.v(K[0],K[1],K[2],K[0],K[1]),e.v(Y[0],Y[1],Y[2],Y[0],Y[1]),e.v(X[0],X[1],X[2],X[0],X[1])}await v.yield();const D=[r,-4,-13,s],B=[.62,.2,.05];for(let x=0;x<3;x++){e.col(a.stone.clone().multiplyScalar(B[x]));for(let z=0;z<w;z++){const F=z/w*Math.PI,K=(z+1)/w*Math.PI,P=(Y,X)=>[Math.cos(Y)*o,f+Math.sin(Y)*o,X+(X>0?m(f+Math.sin(Y)*o):0)];e.quad(P(F,D[x]),P(K,D[x]),P(K,D[x+1]),P(F,D[x+1]),F*7,D[x],K*7,D[x+1])}for(const z of[-1,1])e.quad([z*o,-3,D[x]],[z*o,-3,D[x+1]],[z*o,f,D[x+1]],[z*o,f,D[x]],D[x],-3,D[x+1],f)}e.kind(0).col(new y.Color(.004,.006,.008)),e.quad([-o,-3,s],[o,-3,s],[o,f+o,s],[-o,f+o,s]),await v.yield(),e.kind(2).col(a.stone),e.quad([u,-3,0],[u,-3,s],[u,n,s],[u,n,m(n)],0,-3,-s,n),e.quad([h,-3,0],[h,-3,s],[h,n,s],[h,n,m(n)],0,-3,-s,n),e.quad([u,-3,s-.7],[h,-3,s-.7],[h,n,s-.7],[u,n,s-.7],u,-3,h,n),e.kind(5).col(a.stoneLight),e.quad([u,n,m(n)],[h,n,m(n)],[h,n,s],[u,n,s],u,0,h,-s);const q=(u+h)/2,A=(h-u)/2;e.kind(2).col(a.stoneLight),e.box(q,15.5,m(16)-.2,A+.3,16.2,.6),e.col(a.stone),e.box(q,n,m(n)-.45,A+.2,n+1,.55);for(let x=u+1;x<h;x+=2.7)e.col(a.stone,.07,p),e.box(x,n+1,m(n)-.45,.8,n+2.35,.55,0,.92);for(const x of[-1,1])e.col(a.stoneLight),e.box(x*12.7,-3,1.5,2,12.6,2.3,0,.7),e.col(a.stonePale),e.box(x*12.7,12.6,1.5,1.6,13.3,1.8,0,.6);for(const x of[u+1.2,h-1.2])e.col(a.stone),e.box(x,-3,.2,2.9,n+1.2,2.6,0,.84),e.col(a.stoneLight),e.box(x,n+1.2,.2,2.75,n+1.9,2.5,0,1);await v.yield();const k=2,S=-13,d=n;e.kind(0).col(a.plaster),e.box(k,d,S,9,d+4.2,4,0,1,!1);for(let x=0;x<=6;x++){const z=k-9+x*3;e.kind(4).col(a.timber),e.box(z,d,S+4.05,.3,d+4.2,.3,0,1,!1),x<6&&(e.kind(8).col(a.opening),e.quad([z+.55,d+.5,S+4.03],[z+2.45,d+.5,S+4.03],[z+2.45,d+3.3,S+4.03],[z+.55,d+3.3,S+4.03]))}const i=Mt(5);Ue(e,{cx:k,cz:S,C:i.C,D:i.D,eIn:3.3,eOut:7,yIn:d+5.5,drop:1.6,lift:1.1,segs:6,rad:3,tile:a.tile,edge:a.tileEdge,soffit:a.timber,soffitE:4.1,soffitY:d+4.2,ridge:a.tileEdge}),await v.yield(),e.kind(0).col(a.plaster),e.box(k,d+4.6,S,6.7,d+7.5,2.6,0,1,!1);for(let x=0;x<5;x++){const z=k-6+x*2.5;e.kind(8).col(a.opening),e.quad([z+.4,d+5.6,S+2.63],[z+1.6,d+5.6,S+2.63],[z+1.6,d+7,S+2.63],[z+.4,d+7,S+2.63])}const L=Mt(4.4);Ue(e,{cx:k,cz:S,C:L.C,D:L.D,eIn:.3,eOut:5.3,yIn:d+10.6,drop:3.5,lift:1.3,segs:6,rad:4,tile:a.tile,edge:a.tileEdge,soffit:a.timber,soffitE:2.7,soffitY:d+7.5,ridge:a.tileEdge}),e.kind(0).col(a.tileEdge),e.box(k,d+10.45,S,4.9,d+11,.32);for(const x of[-1,1])e.col(a.gold),e.box(k+x*4.8,d+10.9,S,.4,d+12.1,.3,0,.35)}const dt=[[7.5,-3.2,6,"rubble"],[3.4,-.3,6,"rubble"],[3.1,.5,3,"stone"],[2.45,3.2,2,"stoneLight"],[2,3.3,3,"stone"],[1.35,6.2,2,"stoneLight"],[.95,6.3,3,"stone"],[.35,8.65,2,"stoneLight"],[.72,8.78,2,"stonePale"],[.72,9.16,2,"stoneLight"],[.1,9.16,2,"stonePale"],[.1,9.78,2,"stoneLight"],[-.45,9.78,2,"stone"],[-.45,9.12,5,"paving"],[-24,9,7,"grass"],[-27.5,8.5,7,"grass"],[-44,4.2,7,"grass"]];async function Yt(e,a,p){const u=dt.length-1,h=u*2*241,n=new Float32Array(h*3),f=new Float32Array(h*3),o=new Float32Array(h*3),t=new Float32Array(h*2),s=new Float32Array(h),r=[],m=new y.Vector3;let l=0,w=0,c=Ce(0);for(let g=0;g<=240;g++){const D=g/240*de,B=Be+D/Fe,q=Math.sqrt(1-B*B),A=Ce(D);l+=Math.hypot(A-c,D-w),c=A,w=D;let k=0;for(let S=0;S<u;S++){const d=dt[S],i=dt[S+1],L=Math.hypot(i[0]-d[0],i[1]-d[1]),x=(i[1]-d[1])/L,z=-(i[0]-d[0])/L,F=e[d[3]],K=1+.1*a.n2(l*.012,S*.3)+.05*a.n2(l*.06,S*.4);for(let P=0;P<2;P++){const Y=P?i:d,X=(g*u+S)*2+P;be(D,Y[0],Y[1],m),n[X*3]=m.x,n[X*3+1]=m.y,n[X*3+2]=m.z,f[X*3]=q*x,f[X*3+1]=z,f[X*3+2]=-B*x,o[X*3]=F.r*K,o[X*3+1]=F.g*K,o[X*3+2]=F.b*K,t[X*2]=l,t[X*2+1]=k+(P?L:0),s[X]=d[2]}if(k+=L,g<240){const P=(g*u+S)*2,Y=P+u*2;r.push(P,P+1,Y,P+1,Y+1,Y)}}g%12===11&&await p.yield()}await p.yield();const b=new y.BufferGeometry;return b.setAttribute("position",new y.BufferAttribute(n,3)),b.setAttribute("normal",new y.BufferAttribute(f,3)),b.setAttribute("color",new y.BufferAttribute(o,3)),b.setAttribute("uv",new y.BufferAttribute(t,2)),b.setAttribute("aK",new y.BufferAttribute(s,1)),b.setIndex(r),b.computeBoundingSphere(),b}function Jt(e){const{x:a,z:p,a:v,b:u}=Le,h=2.7,n=(o,t)=>{const s=o-a,r=t-p,m=Math.atan2(r,s);return Math.pow(Math.pow(Math.abs(s)/v,h)+Math.pow(Math.abs(r)/u,h),1/h)/(1+.09*e.n2(Math.cos(m)*1.6+4,Math.sin(m)*1.6))};return{rho:n,heightAt:(o,t)=>{const s=n(o,t);if(s>=1)return-4;const r=ge(-.3,.5,(t-p)/u)*.5+ge(0,.8,(o-a)/v)*.5,m=le(.42,.87,Se(r*1.4,0,1)),l=ge(m,1,s);let w=(14.5+27*Math.exp(-((o-fe.x)**2+(t-fe.z)**2)/6800)+3*e.fbm2(o*.02,t*.02,3))*(1-Math.pow(l,1.5));const c=3.7,b=w/c+.4*e.n2(o*.021+3,t*.021),g=Math.floor(b),D=b-g;w=le(w,(g+ge(.36,.64,D)-.4*e.n2(o*.021+3,t*.021))*c,.88*ge(.06,.4,l)),w+=(1.5*e.n2(o*.07,t*.07)+.8*e.n2(o*.19,t*.19))*ge(0,.4,l),w=le(-4,w,ge(1,.955,s));const B=Math.hypot(o-fe.x,t-fe.z);return B<26&&(w=le(fe.y-.5,w,ge(17,26,B))),w}}}async function Qt(e,a,p,v){const{x:u,z:h,a:n,b:f}=Le,o=38,t=128,s=(o+1)*t+1,r=new Float32Array(s*3),m=new Float32Array(s*3),l=new Float32Array(s*2),w=new Float32Array(s).fill(6),c=new Uint32Array(t*o*6+t*3);let b=0;for(let q=0;q<t;q++){const A=q/t*Math.PI*2,k=Math.cos(A),S=Math.sin(A);let d=0,i=(n+f)*1.3;for(let L=0;L<22;L++){const x=(d+i)/2;e.rho(u+k*x,h+S*x)<1?d=x:i=x}for(let L=0;L<=o;L++){const x=(L+1)/(o+1),z=i*1.02*(1-Math.pow(1-x,2.1)),F=1+L*t+q,K=u+k*z,P=h+S*z;if(r[F*3]=K,r[F*3+1]=e.heightAt(K,P),r[F*3+2]=P,L<o){const Y=(q+1)%t,X=F+t,we=1+L*t+Y,$=we+t;c[b++]=F,c[b++]=we,c[b++]=X,c[b++]=we,c[b++]=$,c[b++]=X}else L===o&&(r[F*3+1]=-4)}c[b++]=0,c[b++]=1+(q+1)%t,c[b++]=1+q,q%4===3&&await v.yield()}r[0]=u,r[1]=e.heightAt(u,h),r[2]=h;const g=new y.BufferGeometry;await v.yield(),g.setAttribute("position",new y.BufferAttribute(r,3)),g.setIndex(new y.BufferAttribute(c,1)),await v.yield(),await Dt(g,v),await v.yield();const D=g.attributes.normal.array,B=new y.Color;for(let q=0;q<s;q++){const A=r[q*3],k=r[q*3+1],S=r[q*3+2],d=ge(.62,.9,D[q*3+1]),i=p.fbm2(A*.05+9,S*.05,3),L=p.n2(A*.012+S*.009,k*.34),x=1-d;if(B.copy(a.rock).lerp(a.rockWarm,Se(.42+.8*L,0,1)).multiplyScalar((.74+.3*i)*(1-.3*x*ge(.1,.6,p.n2(A*.05,k*.9+S*.05)))),B.lerp(a.moss,x*.45*ge(-.1,.5,p.n2(A*.045+7,S*.045))),B.lerp(a.litter,d*(.75+.25*i)),k<7.5){const z=1-ge(4.2,7.5,k+1.2*i);B.lerp(a.wetRock,.82*z)}m[q*3]=B.r,m[q*3+1]=B.g,m[q*3+2]=B.b,l[q*2]=A,l[q*2+1]=S,q%100===99&&await v.yield()}return g.setAttribute("color",new y.BufferAttribute(m,3)),g.setAttribute("uv",new y.BufferAttribute(l,2)),g.setAttribute("aK",new y.BufferAttribute(w,1)),g.computeBoundingSphere(),g}function eo(e,a,p){const v=[[5,-25.5],[-8,-37],[13,-49],[21.7,-68.6]],u=1.7,h=[];for(let o=0;o<v.length-1;o++){const[t,s]=v[o],[r,m]=v[o+1],l=Math.hypot(r-t,m-s),w=Math.round(l/.62);for(let c=o?1:0;c<=w;c++)h.push({x:le(t,r,c/w),z:le(s,m,c/w),dx:(r-t)/l,dz:(m-s)/l,turn:c===w||o===0&&c===0,y:0})}const n=h.length,f=fe.y+1.2;for(let o=0;o<n;o++){const t=h[o];t.y=Math.max(p.heightAt(t.x,t.z),p.heightAt(t.x-t.dz*u,t.z+t.dx*u),p.heightAt(t.x+t.dz*u,t.z-t.dx*u))+.25}for(let o=0;o<n;o++){const t=h[o];t.y=Math.min(Math.max(t.y,ke.YT+.05,f-(n-1-o)*.62*.6,o?h[o-1].y:0),f)}return Pt(e,a,h,u),h}function Pt(e,a,p,v){const u=p.length,h=new y.Color("#c8382a"),n=(o,t,s)=>[o.x-o.dz*v*t,s,o.z+o.dx*v*t];let f=0;for(let o=0;o<u-1;o++){const t=p[o],s=p[o+1],r=s.y,m=t.y;t.turn&&o>0&&(e.kind(5).col(a.paving),e.box(t.x,m-3.2,t.z,2.5,m,2.5,Math.atan2(t.dx,t.dz),1));const l={x:t.x,z:t.z,dx:s.dx,dz:s.dz};e.kind(5).col(a.paving,0,null),e.quad(n(l,1,r),n(l,-1,r),n(s,-1,r),n(s,1,r),0,f,v*2,f+.62),r>m+.01&&(e.kind(2).col(a.stone),e.quad(n(l,1,m),n(l,-1,m),n(l,-1,r),n(l,1,r),0,m,v*2,r));for(const w of[-1,1])e.kind(2).col(w>0?a.stoneLight:a.stone),e.quad(n(l,w,r-3.4),n(s,w,r-3.4),n(s,w,r+.38),n(l,w,r+.38),f,r-3.4,f+.62,r+.38);f+=.62}for(let o=0;o<u;o+=1){const t=p[o];if(t.turn||o%16===8)for(const s of t.turn?[-1,1]:[1]){const[r,,m]=n(t,s*1.12,0),l=t.y;e.kind(4).col(a.timber),e.box(r,l-.2,m,.11,l+2.3,.11,0,1,!1),e.kind(8).col(h),e.box(r,l+2.3,m,.3,l+3,.3,0,.82),e.kind(0).col(a.tileEdge),e.box(r,l+3,m,.46,l+3.3,.46,0,.15)}}}async function to(e,a,p,v){const t=ke.YT+.6,s=Math.round(19/.62),r=4*s+1,m=[];let l=5;for(let c=0;c<r;c++){const b=Math.min(3,Math.floor(c/s)),g=(c-b*s)/s,D=b%2?-1:1,B=D>0?le(37,56,g):le(56,37,g),q=le(2.6,t,c/(r-1));let A=Math.min(5,l+2);for(let k=0;k<60&&p.heightAt(B,A)<q-.35;k++)A-=.45;l=A,m.push({x:B,z:A,dx:D,dz:0,turn:c===0||c%s===0,y:q}),c%24===23&&await v.yield()}for(let c=0;c<2;c++)for(let b=0;b<4;b++){const g=b*s,D=Math.min(r-1,g+s),B=[];for(let q=g;q<=D;q++){let A=0,k=0;for(let S=Math.max(g,q-3);S<=Math.min(D,q+3);S++)A+=m[S].z,k++;B.push(A/k)}for(let q=g;q<=D;q++)m[q].z=B[q-g]}for(const c of m)c.z+=.9;const w=m[0];return e.kind(2).col(a.stone),e.box(w.x-1.5,-4,w.z+1.2,4.2,2.6-.05,3.4,0,1),e.kind(5).col(a.paving),e.box(w.x-1.5,2.6-.05,w.z+1.2,4.2,2.6+.02,3.4,0,1),Pt(e,a,m,1.5),m}const oo=`
uniform sampler2D uNoise; uniform float uBoreZ, uLead, uTime, uLamp, uWet, uPlume; uniform vec3 uLampCol, uSunCol, uHorizon;
varying float vK; varying vec2 vSu; varying vec3 vWp;
float h21(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
`,ao=`
float archRough = 1., archSheen = 0.; vec3 archGlow = vec3(0.);
{
  float k = floor(vK + 0.5); vec2 su = vSu;
  if (k == 6.) su += vWp.y * vec2(0.62, 0.78);            // rock: shear the map with height so cliffs do not smear
  vec4 nz = texture2D(uNoise, su * 0.11), nz2 = texture2D(uNoise, su * 0.017 + 0.37);
  vec3 c = diffuseColor.rgb * (0.86 + 0.28 * nz2.r);
  float st = texture2D(uNoise, vec2(vWp.y * 0.085 + nz2.r * 0.3, (su.x + su.y) * 0.004)).r;
  vec4 bg = texture2D(uNoise, vec2((su.x - su.y) * 0.045, vWp.y * 0.11));
  float streak = smoothstep(0.62, 0.76, texture2D(uNoise, vec2(su.x * 0.83 + nz.r * 0.5, su.y * 0.02 + uTime * 0.3)).a)
    * smoothstep(0.38, 0.62, texture2D(uNoise, vec2(su.x * 0.19 + 0.4, su.y * 0.12 + uTime * 0.85)).r);        // runnels that wander and come in pulses
  if (k == 1.) {            // glazed roof tile: ribs run down the slope, courses across it
    float rib = abs(fract(su.x * 2.4) - 0.5) * 2., course = fract(su.y * 1.8);
    c *= mix(0.5, 1.15, smoothstep(0.05, 0.8, rib)) * mix(0.8, 1.06, course) * (0.85 + 0.3 * nz.a);
    archRough = 0.55;
  } else if (k == 2.) {     // ashlar
    vec2 q = vec2(su.x / 1.3, su.y / 0.55); q.x += 0.5 * mod(floor(q.y), 2.);
    vec2 f = fract(q); float hh = h21(floor(q));
    float m = smoothstep(0., 0.05, f.x) * (1. - smoothstep(0.95, 1., f.x)) * smoothstep(0., 0.1, f.y) * (1. - smoothstep(0.9, 1., f.y));
    c *= mix(0.52, 1., m) * (0.82 + 0.34 * hh);
  } else if (k == 3.) {     // fish-scale wall: rounded stones in staggered courses, each lapping the one below, dark joints
    vec2 q = vec2(su.x / 1.9, su.y / 0.98); q.x += 0.5 * mod(floor(q.y), 2.);
    vec2 f = fract(q), id = floor(q); float px = abs(f.x - 0.5) * 2., px2 = 1. - px;
    float own = f.y - 0.5 * (1. - sqrt(max(1. - px * px, 0.)));                 // height above this stone's rounded lower edge
    float v = own, hh = h21(id);
    if (own < 0.) { v = f.y + 1. - 0.5 * (1. - sqrt(max(1. - px2 * px2, 0.))); hh = h21(id + vec2(f.x > 0.5 ? 0.5 : -0.5, -1.)); }
    float joint = smoothstep(0.012, 0.085, abs(own));
    c *= mix(0.3, 1., joint) * mix(1.16, 0.6, smoothstep(0.08, 1.05, v)) * (0.76 + 0.44 * hh);
    c = mix(c, c * vec3(0.7, 0.88, 0.62), smoothstep(0.55, 0.8, nz2.a) * 0.6);
  } else if (k == 4.) {     // lacquered timber
    float bd = abs(fract(su.x * 1.4) - 0.5) * 2.;
    c *= mix(0.68, 1.05, smoothstep(0.04, 0.3, bd)) * (0.88 + 0.24 * nz.r); archRough = 0.62;
  } else if (k == 5.) {     // paving
    vec2 q = su / vec2(1.4, 1.1); q.x += 0.5 * mod(floor(q.y), 2.); vec2 f = fract(q);
    c *= mix(0.6, 1., smoothstep(0., 0.05, f.x) * smoothstep(0., 0.06, f.y)) * (0.84 + 0.32 * nz.a);
  } else if (k == 6.) {     // rock: strata, fractures, a fake relief from the noise slope; cut away inside the gate tunnel
    if (abs(vWp.x) < 7.7 && vWp.y < 15.3 && vWp.z > -34.4 && vWp.z < 1.) discard;
    c *= (0.5 + 0.9 * st) * (0.84 + 0.32 * nz.r) * (0.62 + 1.5 * (bg.g - 0.5) + 0.76 * bg.r);
    float bed = abs(fract(vWp.y * 0.54 + nz2.r * 1.6 + nz.r * 0.25) - 0.5);                       // bedding planes
    c *= mix(0.5, 1., smoothstep(0.02, 0.1, bed)) * mix(1., 0.78, smoothstep(0.3, 0.5, bed));
  } else if (k == 7.) {
    c *= 0.72 + 0.56 * nz.a;
  } else if (k == 8.) {     // openings: dark by day, lantern-lit when uLamp rises
    archGlow = uLampCol * uLamp * (0.5 + 0.5 * nz.r); c *= 0.55;
  }
  if (k == 2. || k == 3. || k == 5. || k == 6.) {
    float zp = uBoreZ - uLead, wl = 1.2 + 1.3 * nz2.r;
    float tide = 1. - smoothstep(wl - 0.6, wl + 0.5, vWp.y);
    float past = smoothstep(-8., 8., vWp.z - zp) * uPlume * (1. - smoothstep(10., 16., vWp.y));
    float drench = past * exp(-max(vWp.z - zp, 0.) / 300.);
    float wet = clamp(max(tide * 0.95, drench * (0.5 + 0.5 * nz2.a)) + uWet * 0.35 * nz2.a, 0., 1.);
    // as the bore piles into the gate the masonry round it is drenched to a ragged tide line: dark wet stone below it, so the
    // pale arch and the dry wall above stand out
    float surge = (1. - smoothstep(25., 75., uBoreZ)) * (1. - smoothstep(30., 60., abs(vWp.x))) * step(-6., vWp.z)
      * (1. - smoothstep(9.2 + 3.6 * nz2.r, 10.2 + 3.6 * nz2.r, vWp.y + 1.5 * (nz.r - 0.5)));
    wet = max(wet, surge);
    // (under a low sun or the moon the wall is dark already)
    c *= mix(1., 0.6, wet) * mix(1., mix(0.62, 0.84, clamp(uLamp * 1.7, 0., 1.)), surge); c = mix(c, c * vec3(0.74, 0.95, 0.8), max(tide, surge * 0.6) * 0.55); archRough *= mix(1., 0.28, wet);
    c = mix(c, c * 1.6 + vec3(0.06, 0.08, 0.09), streak * past * exp(-max(vWp.z - zp, 0.) / 55.) * 0.6 * step(k, 3.5) * (1. - smoothstep(5., 11., vWp.y)) * smoothstep(0.6, 2.2, vWp.y));
    archSheen = clamp(max(max(drench * 1.4, tide * 0.7), surge), 0., 1.);
  }
  if (k == 2. || k == 3. || k == 6.) archGlow += c * uSunCol * 0.2 * clamp(1. - vWp.y / 15., 0., 1.);   // light thrown back by the water
  diffuseColor.rgb = c;
}
`;function so(e){const a=new y.MeshStandardMaterial({vertexColors:!0,roughness:.88,metalness:0,side:y.DoubleSide});return a.onBeforeCompile=p=>{for(const v of["uNoise","uBoreZ","uLead","uTime","uLamp","uWet","uPlume","uLampCol","uSunCol","uHorizon"])p.uniforms[v]=e[v];p.vertexShader=p.vertexShader.replace("#include <common>",`#include <common>
attribute float aK;
varying float vK; varying vec2 vSu; varying vec3 vWp;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vK = aK; vSu = uv; vWp = position;`),p.fragmentShader=p.fragmentShader.replace("#include <common>",`#include <common>
`+oo).replace("#include <color_fragment>",`#include <color_fragment>
`+ao).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = clamp(roughnessFactor * archRough, 0.08, 1.);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += archGlow + uHorizon * archSheen * 0.5 * pow(clamp(1. - abs(dot(normal, normalize(vViewPosition))), 0., 1.), 3.);`)},a.customProgramCacheKey=()=>"silver-dragon-arch-4",a}function pt(e){const a=[e[0][0]];for(const[p,v,u]of e){const h=Math.max(1,Math.round((v-p)/u));for(let n=1;n<=h;n++)a.push(p+(v-p)*n/h)}return a}function io(){const e=pt([[-4,20,1.5],[20,60,1.5],[60,200,2],[200,300,3.5],[300,400,5],[400,480,20],[480,1280,50],[1280,2600,165],[2600,3400,800],[3400,4500,1100],[4500,6e3,1500]]),a=pt([[-6e3,-3e3,1500],[-3e3,-1800,600],[-1800,-1e3,400],[-1e3,-600,200],[-600,-120,60],[-120,-30,3.6],[-30,-8,2.2],[-8,4,.5],[4,25,1.25],[25,235,4],[235,475,12],[475,800,110],[800,1500,350],[1500,3300,600],[3300,6e3,1350]]),p=e.length,v=a.length,u=new Float32Array(p*v*3),h=new Uint32Array((p-1)*(v-1)*6);for(let o=0;o<v;o++)for(let t=0;t<p;t++){const s=(o*p+t)*3;u[s]=e[t],u[s+2]=a[o]}let n=0;for(let o=0;o<v-1;o++)for(let t=0;t<p-1;t++){const s=o*p+t,r=s+1,m=s+p,l=m+1;h[n++]=s,h[n++]=m,h[n++]=r,h[n++]=r,h[n++]=m,h[n++]=l}const f=new y.BufferGeometry;return f.setAttribute("position",new y.BufferAttribute(u,3)),f.setIndex(new y.BufferAttribute(h,1)),f.boundingSphere=new y.Sphere(new y.Vector3(0,0,0),1e5),f}const ro=`
uniform sampler2D uNoise; uniform vec3 uCamL; uniform float uReach;
varying vec3 vL; varying vec4 vG; varying vec4 vI;
#include <common>
#include <fog_pars_vertex>
${Ee}
${_e}
${He}
void main(){
  float d = position.x, zf = zFront(d);
  float z = clamp(zf + position.z, ${M(Ut)}, ${M(Kt)}), s = z - zf, x = wallX(z) + d;
  float h = boreH(s, d), e = 0.4;
  // the slope of the surface goes to the fragment in parts: (d-slope, front slope, wall slope, the s-slope of the extras);
  // the fragment adds the bore's own exact s-slope
  vG = vec4((boreExtra(s, d + e) - boreExtra(s, d - e)) / (2. * e), dzFront(d), wallDx(z), (boreExtra(s + e, d) - boreExtra(s - e, d)) / (2. * e));
  float behind = smoothstep(-2., 12., s);
  vec2 xz = vec2(x, z);
  float n1 = textureLod(uNoise, xz * 0.021 + uTime * vec2(0.008, -0.012), 0.).r - 0.5;
  float n2 = textureLod(uNoise, xz * 0.06 + uTime * vec2(-0.02, -0.03), 0.).r - 0.5;
  float faceM = smoothstep(${M(-ue-1)}, ${M(-ue+2)}, s) * (1. - smoothstep(0., 7., s));
  // (in the gate basin, the last 70 m before the threshold, the crest's lumps are broader, so that the mesh there carries them without facets)
  float lump = textureLod(uNoise, vec2(x * 0.09, s * 0.11 + uTime * 0.55), mix(5.7, 4.5, smoothstep(22., 70., zf))).a - 0.5;
  h += (n1 * 0.9 + n2 * 0.4) * mix(0.1, 0.8, behind) + lump * faceM * mix(0.14, 0.95, smoothstep(-1.6, 0.6, s));
  // where the bore runs up the seawall it is white water, heaped and thrown about, not a smooth wedge with a front like
  // the cut end of a slab against the masonry
  float runM = uPlume * exp(-max(d - 2.5, 0.) / 4.5) * smoothstep(-13., -4., s) * (1. - smoothstep(6., 22., s));
  // (heaps a few metres across: finer ones would fall between the vertices)
  float chop = (textureLod(uNoise, vec2(x * 0.07 + uTime * 0.04, z * 0.07 - uTime * 0.085), 4.6).r - 0.5) * 1.7;
  float chop2 = (textureLod(uNoise, vec2(x * 0.085 + 0.3, s * 0.08 + uTime * 0.2), 4.4).a - 0.5) * 1.5;
  h += (chop * 2.4 + chop2 * 1.1) * runM;
  // and a tongue of it runs on ahead along the foot of the wall, so the end of the wave against the stone is a heap with a
  // ragged apron and not a straight ramp
  // (a narrow one, hard against the stone: the wave beside it keeps its trough, its face and its lip right up to the wall)
  h += uPlume * exp(-max(d, 0.) / 2.4) * smoothstep(-19., -6., s) * (1. - smoothstep(-6., 0., s)) * max(1.8 + 2.2 * chop2 + 1.7 * chop, 0.3);
  // the foot of the face is a roll of white water pushed out ahead of the toe, piled unevenly along the front, and
  // the crest stands in teeth and notches (see FOOT_GLSL; neither is in heightAt: the roll is knee high and the teeth are a
  // stride deep, within 2 m of the crest line)
  vec2 lb = footLobe(x); float ridK = ridGap(d);      // (no roll is piled round a rider in his pocket under the wall: his hull stays clear of it)
  h += footH(s, lb) * ridK;
  vG.w += (footH(s + 0.25, lb) - footH(s - 0.25, lb)) * 2. * ridK;
  h += crestRag(x) * exp(-(s + 0.2) * (s + 0.2) / 1.6) * smoothstep(3., 9., d);
  vI = vec4(s, d, h, 0.);
  // the lip pitches forward over the face: the top rows of the crest are thrown ahead and tipped down, more here and less
  // there along the front. Not round the eye once it rides the face (the camera and the riders sit under where it would be)
  float dC = uCamL.x - wallX(uCamL.z), sC = uCamL.z - zFront(dC);
  float atEye = smoothstep(-7.5, -4., sC) * (1. - smoothstep(6., 17., abs(d - dC)));
  float tear = textureLod(uNoise, vec2(x * 0.043 + 0.21, uTime * 0.045 + 0.33), 4.).r;
  float nearW = 1. - smoothstep(40., 70., abs(d - dC));
  float reach = mix(mix(1.9, 2.7, nearW * (1. - smoothstep(-12., -8., sC))), 3.3, nearW * uReach);      // (thrown further in front of an eye that waits for it; uReach: the world asks for the whole of it as the wall arrives)
  float toW = mix(0.72 * smoothstep(2.5, 7., d), 1., smoothstep(9., 26., d));      // (the lip is carried to the seawall, at 0.72 of its throw within a few metres of the stone)
  float cAmt = reach * toW * (0.5 + 0.85 * tear) * (1. - atEye) * ridGap(d);
  // The lip is a thin sheet, not a rounded bank: the crest row is thrown furthest and droops at its edge, the rows under it follow
  // less and are drawn down under the sheet (its underside, where the light comes through), the rows behind it make its top.
  float sa = abs(s + 0.15), curl = cAmt * exp(-sa * sqrt(sa) / 0.55);
  h -= cAmt * (0.19 * exp(-s * s / 0.1) + 0.1 * exp(-(s + 0.5) * (s + 0.5) / 0.08));
  vI.w = curl;      // (how far the lip overhangs here: the fragment shades its underside)
  vL = vec3(x, h, z - curl);
  vec4 mvPosition = modelViewMatrix * vec4(vL, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,no=`
uniform sampler2D uNoise;
uniform vec3 uDeep, uJade, uFoam, uSilt, uSunDir, uSunCol, uSkyAmb, uZenith, uHorizon, uCamL;
uniform float uTurbid, uRefl, uFresP, uLow, uDim;
uniform vec4 uLampR[8]; uniform vec3 uLampC;      // lamps on the water ahead of the face (x, z, strength), and their colour
varying vec3 vL; varying vec4 vG; varying vec4 vI;
#include <common>
#include <fog_pars_fragment>
${Ee}
${_e}
${He}
${$t}
void main(){
  float s = vI.x, d = vI.y, h = vI.z; vec2 xz = vL.xz;
  vec2 lb = footLobe(xz.x); float cF = s + ${M(ue)};      // the white water at the foot: how far it runs out here, and metres up the face from the toe
  vec3 toCam = uCamL - vL; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
  float behind = smoothstep(-2., 12., s), sb = max(s, 0.);
  float Fs = vG.w + boreDs(s);
  vec3 vN = normalize(vec3(Fs * vG.y - vG.x, 1., vG.x * vG.z - Fs * (1. + vG.y * vG.z)));     // the big shape's normal, exact across the lip
  float hp = boreProf(s);
  float ft = clamp(1. + s / ${M(ue)}, 0., 1.);                                            // 0 at the toe, 1 at the crest
  float onFace = smoothstep(${M(-ue-.6)}, ${M(-ue+1.2)}, s) * (1. - smoothstep(-0.4, 1.6, s));
  float lowSun = 1. - smoothstep(0.15, 0.6, uSunDir.y), low = uLow;       // low: golden hour and dawn, when the face is surfed into the light
  vec4 g1T = texture2D(uNoise, xz * 0.031 + uTime * vec2(0.011, -0.017)); vec2 g1 = g1T.gb - 0.5;
  vec4 t2 = texture2D(uNoise, xz * 0.113 + uTime * vec2(-0.031, -0.043)); vec2 g2 = t2.gb - 0.5;
  vec4 n3 = texture2D(uNoise, xz * 0.0068 + uTime * vec2(0.003, -0.004)); vec2 g3 = n3.gb - 0.5;
  // open water ahead of the bore: slicks and cat's paws, a long low swell
  float paw = smoothstep(0.38, 0.66, texture2D(uNoise, xz * 0.0125 + uTime * vec2(0.002, -0.006)).a);
  float swl = sin(xz.y * 0.19 + xz.x * 0.035 + uTime * 0.8 + n3.r * 5.);
  float calm = (1. - behind) * (1. - onFace);
  float rough = mix(0.3, 1.5, behind) * (1. - 0.65 * onFace) * mix(1., mix(0.3, 2.2, paw), calm), nearK = 1. / (1. + dist * 0.004);
  vec2 g4 = (texture2D(uNoise, xz * 0.47 + uTime * vec2(0.06, -0.09)).gb - 0.5) * (1. - smoothstep(4., 26., dist));      // fine ripples that only show close by
  vec3 N = normalize(vN + vec3(g1.x + g2.x * 0.6 * nearK + g3.x * 1.4 + g4.x * 0.5, 0., g1.y + g2.y * 0.6 * nearK + g3.y * 1.4 + g4.y * 0.5) * rough + vec3(0., 0., swl * 0.05 * calm));
  float nv = max(dot(N, V), 0.), fres = 0.025 + 0.975 * pow(max(1. - nv, 0.), uFresP);
  vec3 R = reflect(-V, N);
  float upR = smoothstep(-0.06, 0.12, R.y);                 // a steep face throws the view down into the river: no sun can be mirrored there
  R.y = abs(R.y) + 0.02; R = normalize(R);
  vec3 sky = mix(uHorizon, uZenith, pow(clamp(R.y, 0., 1.), 0.45));
  float sr = max(dot(R, uSunDir), 0.), sr2 = sr * sr, sr4 = sr2 * sr2;
  sky += uSunCol * (sr4 * sr * 0.2 + sr4 * sr4 * sr4 * sr4 * sr4 * sr4 * mix(0.5, 0.3, low)) * (0.25 + 0.75 * lowSun) * (1. - mix(0.7, 0.95, low) * onFace) * upR;      // the bright sky round a low sun (or the moon) lies on the water
  sky += uSunCol * 0.25 * low * calm * (0.55 + 0.9 * smoothstep(0.3, 0.7, n3.r)) * (1. - 0.5 * paw) * mix(0.6 + 0.8 * t2.a, 1., smoothstep(15., 40., dist));                    // and a low sun leaves a warm sheen on the whole calm river
  // (close to the eye the mirror and the glitter are sparks, not a sheet: a patch of glare under the bow blooms into one white blob)
  float nearG = mix(0.22, 1., smoothstep(5., 42., dist)), moonK = uDim * (1. - low);
  vec3 spec = uSunCol * (pow(sr, 380.) * 9. * nearG * mix(1., 0.7, moonK) * (1. - 0.92 * onFace) + pow(sr, 28.) * 0.3 * (1. - 0.8 * low * onFace)) * upR;
  // the wall's own image lies on the calm water in front of it (for an eye that is still ahead of the toe): the dark glass
  // of the face and a broken white line under the lip, cut up by the cat's paws. hImg is the height on the wall that is mirrored here
  float dCe = uCamL.x - wallX(uCamL.z), sCe = uCamL.z - zFront(dCe);
  float rW = max(-s - 1.5, 0.), dEye = s - sCe;
  float hImg = max(uCamL.y, 0.5) * rW / max(dEye, 0.5) + (N.z / max(N.y, 0.3)) * rW * 1.6;
  float inImg = (1. - smoothstep(4.8, 5.6, hImg)) * step(0.5, dEye) * (1. - smoothstep(${M(-ue-1.4)}, ${M(-ue-.2)}, s)) * (1. - smoothstep(60., 130., rW)) * (1. - 0.45 * paw) * (0.75 + 0.25 * smoothstep(0.3, 0.7, n3.r));
  inImg *= smoothstep(8., 22., -sCe - 1.5);      // (only for an eye that still waits well ahead of the toe: an eye that runs along the foot of the wall is too near and too low to see the lip's image as more than one ruled line)
  float imgLip = smoothstep(3.6, 4.4, hImg + (t2.a - 0.5) * 1.5);
  float ndlF = max(0.78 * uSunDir.y - 0.62 * uSunDir.z, 0.);
  vec3 imgCol = mix(mix(uDeep, uSilt, uTurbid * 0.22) * 0.6 * (uSkyAmb * 2.4 + uSunCol * (0.4 + 0.5 * ndlF)), uFoam * (uSkyAmb * 2.2 + uSunCol * (0.35 + 0.5 * ndlF)), imgLip);
  sky = mix(sky, imgCol, inImg); spec *= 1. - inImg;
  // the sun's road: a column of glitter under the light, all the way out to the bore
  vec2 hv = -V.xz; float hl = max(length(hv), 1e-3), sl = max(length(uSunDir.xz), 1e-3);
  float road = pow(max(dot(hv, uSunDir.xz) / (hl * sl), 0.), 48.) * smoothstep(0.02, 0.3, uSunDir.y);
  // (the lookups are turned off the river's axes by two different angles and bent by the low swell, so no row of glints
  // can be followed; far away two coarser layers take over, and slicks break the road into patches)
  vec2 q1 = vec2(0.80 * xz.x - 0.60 * xz.y, 0.60 * xz.x + 0.80 * xz.y), q2 = vec2(0.53 * xz.x + 0.85 * xz.y, -0.85 * xz.x + 0.53 * xz.y);
  vec2 wq = g3 * 9. + g1 * 2.2;
  float tw = texture2D(uNoise, (q1 + wq) * 0.37 + uTime * vec2(0.05, -0.21)).a, tw2 = texture2D(uNoise, (q2 - wq.yx) * 0.83 - uTime * vec2(0.13, 0.07)).r;
  float twF = texture2D(uNoise, (q2 + wq * 2.) * 0.113 + uTime * vec2(0.031, -0.09)).a, tw2F = texture2D(uNoise, (q1 - wq.yx * 2.) * 0.27 - uTime * vec2(0.06, 0.04)).r;
  float farK = smoothstep(40., 320., dist), farK2 = smoothstep(25., 150., dist);
  float glitN = smoothstep(0.6, 0.8, tw) * smoothstep(0.5, 0.7, tw2);
  float glitF = smoothstep(mix(0.56, 0.46, farK), mix(0.72, 0.6, farK), twF) * smoothstep(mix(0.48, 0.4, farK), 0.68, tw2F);
  float patchy = mix(0.3, 1.3, smoothstep(0.3, 0.7, n3.r * 0.55 + paw * 0.45)) * mix(1., 0.55 + 0.9 * t2.a, 1. - farK2);
  float glit = mix(glitN, glitF * 1.4, farK2) * patchy;
  spec += uSunCol * road * glit * mix(5.5, 2.6, farK) * nearG * mix(1., 0.72, moonK) * (1. - mix(0.7, 0.95, low) * onFace) * (1. - inImg);
  // body: jade, milkier and siltier behind the bore; the face is deep glass, lit through near the top
  vec3 water = mix(uDeep, uSilt, clamp(uTurbid * (0.22 + 0.6 * behind), 0., 1.)) * (0.82 + 0.36 * n3.r) * (1. + 0.1 * swl * calm) * mix(1., mix(1.25, 0.75, paw), calm);
  vec3 jadeT = uJade * mix(vec3(1.), vec3(0.62, 1.28, 0.86), moonK);                              // under the moon the wave is lit through green, not blue
  water = mix(water, uDeep * 0.46 * mix(vec3(1.), vec3(0.7, 1.2, 0.92), moonK), onFace * (1. - smoothstep(0.45, 0.95, ft)) * 0.88);
  float trg = cF + 1.1 + min(lb.x, 3.); water *= 1. - (0.4 + 0.25 * uPlume * exp(-max(d - 2.5, 0.) / 14.)) * exp(-trg * trg / 10.) * (1. - behind);            // the drawn-down trough ahead of the toe is darker
  float ndl = max(dot(N, uSunDir), 0.);
  vec3 body = water * (uSkyAmb * 2.4 + uSunCol * (0.42 + 0.5 * ndl));
  // where the light falls on the face, the pitching lip shades the glass just under it
  body *= 1. - 0.3 * onFace * smoothstep(0.45, 0.72, ft) * (1. - smoothstep(0.84, 0.97, ft)) * smoothstep(0.05, 0.4, ndlF + 0.25 * low);
  // the lip overhangs (vI.w: how far it is thrown ahead here): the glass under it is in its shadow, and right under the white
  // edge, where the curl is thin, the light comes through it
  float ov = smoothstep(0.5, 2.2, vI.w) * onFace;
  body *= 1. - 0.32 * ov * smoothstep(0.34, 0.5, ft) * (1. - smoothstep(0.58, 0.72, ft));
  float crest = s < 2. ? smoothstep(2., 4.6, hp) : smoothstep(0.25, 1., (h - 2.5) / 1.5);
  crest *= 1. - 0.75 * uPlume * exp(-max(d - 2.5, 0.) / 7.) * smoothstep(1., 4., s);      // (the mound the seawall throws up is deep water, not a thin lit crest)
  float back = max(dot(-V, uSunDir), 0.), thru = smoothstep(0.4, 1., ft) * onFace, back2 = back * back * (1. - 0.45 * back * back);     // (looking straight into the light along the face it must not white out)
  body += jadeT * uSunCol * (crest * (0.22 + 0.78 * (1. - nv) * (1. - nv)) * 0.8 + thru * (0.14 + mix(1.6, 0.7, low) * back2 * mix(0.35, 1., smoothstep(mix(0.6, 0.7, low), mix(0.95, 0.97, low), ft))));
  // The face has a body whatever the angle of the light: dark glass at its foot, and toward the lip, where the wave is thin, the
  // light comes through it (milky jade under the white). Not under a low sun, where the glass glows only under the lip.
  body *= 1. - mix(0.22, 0.5, moonK) * onFace * (1. - smoothstep(0.26, 0.7, ft));      // (the foot of the face is deep, dark water, so the wall has a body from toe to lip)
  float thin = smoothstep(mix(0.3, 0.46, moonK), 0.98, ft) * onFace * (1. - low); thin *= thin;
  body += jadeT * (uSkyAmb * mix(1.5, 2.7, moonK) + uSunCol * mix(0.26, 0.5, moonK)) * thin;
  body += jadeT * (uSkyAmb * 2.2 + uSunCol * mix(0.3, 0.45, moonK)) * ov * smoothstep(0.6, 0.8, ft) * mix(0.6, 0.3, low);
  // and it is wet: the hollow of the face throws the moon (or the sun) back as a broken band of light that runs along the wave
  vec2 rp = (g1 + g2 * 0.8) * 0.55;
  vec3 Rf = reflect(-V, normalize(vN + vec3(rp.x, 0., rp.y)));
  float sf = max(dot(Rf, uSunDir), 0.), sf2 = sf * sf, sf8 = sf2 * sf2 * sf2 * sf2, sf32 = sf8 * sf8 * sf8 * sf8;
  vec3 faceSheen = uSunCol * onFace * (1. - low) * (sf8 * sf8 * 0.3 + sf32 * sf32 * (0.5 + 1.6 * smoothstep(0.45, 0.7, t2.a))) * smoothstep(3., 12., dist) * mix(0.5, 1., uDim);
  vec3 col = mix(body, sky, fres * uRefl * (1. - mix(0.6, 0.9, low) * onFace) * (1. - ov * smoothstep(0.5, 0.68, ft))) + faceSheen;  // the face is glass to look into, not a mirror (least of all against a low sun)
  // lamp light on the wet face: every lamp on the calm water ahead of the wall (junk cabins, lamps set adrift) lies on the dark
  // glass as a broken upright streak, between the lamp and the eye
  float lampA = 0., lampGl = 0.;
  for (int i = 0; i < 8; i++) {
    vec4 Lq = uLampR[i];
    vec2 dL = xz - Lq.xy; lampGl += Lq.z / (1. + dot(dL, dL) * 0.06);      // the same lamps light the white water round them
    float ahead = xz.y - Lq.y, camA = max(xz.y - uCamL.z, 1.);
    float xr = Lq.x + (uCamL.x - Lq.x) * clamp(ahead / max(ahead + camA, 1.), 0., 0.6);
    float wd = 0.5 + 0.025 * max(ahead, 0.);
    float dxl = xz.x - xr + (g1.x + g2.x * 0.7) * (0.5 + 0.045 * max(ahead, 0.));
    lampA += Lq.z * exp(-dxl * dxl / (wd * wd)) * smoothstep(-4., 2., ahead) * (1. - smoothstep(18., 52., ahead));
  }
  // (flecks, not a wash: the streak is cut up by the ripples, and close to the eye, where a streak a stride wide would fill the frame, it is only sparks)
  float dash = texture2D(uNoise, vec2(xz.x * 0.36 + 0.4, s * 1.1 - uTime * 0.7)).a;      // (short bars across the streak, as on the calm water)
  float lampG = (0.22 + 1.1 * smoothstep(0.46, 0.6, dash + 0.1 * (tw2 - 0.5))) * mix(0.06, 1., smoothstep(7., 17., dist));
  col += uLampC * min(lampA, 1.) * lampG * onFace * smoothstep(0.02, 0.2, ft) * (1. - 0.8 * smoothstep(0.45, 0.9, ft));
  // foam. On the face: a white roll at the lip, claws of foam that hang from it to unequal depths and come apart into strands
  // at their tips, and under those a net of thin veins on the glass. Nothing is drawn out into ribs, and every edge is cut from
  // the noise at a level, so it stays an edge however close the eye comes.
  float l1 = texture2D(uNoise, xz * vec2(0.05, 0.02)).a, l2 = texture2D(uNoise, xz * vec2(0.2, 0.075) + uTime * vec2(0.004, 0.012)).a;      // drawn out along the flow
  float l3 = texture2D(uNoise, xz * vec2(1.7, 0.9) + uTime * vec2(0.02, 0.06)).a;                 // a fine layer that only shows close by
  float nearC = smoothstep(6., 30., dist), nearE = 1. - smoothstep(3., 14., dist);
  float lace = l1 * 0.6 + l2 * 0.4; lace = mix(lace, lace * 0.72 + l3 * 0.28, nearE);
  float fr = texture2D(uNoise, vec2(xz.x * 0.09, s * 0.11 + uTime * 0.55)).a;
  // along the front nothing repeats: the lookups slide on a slow warp, and broad claws, thin ones and clean glass take turns
  float wv = texture2D(uNoise, vec2(xz.x * 0.0173 + 0.11, 0.37)).r, wv2 = texture2D(uNoise, vec2(xz.x * 0.0057 + 0.5, 0.81)).a;
  float xw = xz.x + 7. * (wv - 0.5) + 18. * (wv2 - 0.5);
  float fsA = texture2D(uNoise, vec2(xw * 0.34, s * 0.085 + uTime * 0.75)).a;
  float fs = fsA * 0.2 + texture2D(uNoise, vec2(xw * 0.113 + 0.4, s * 0.06 + uTime * 0.5)).a * 0.62 + texture2D(uNoise, vec2(xw * 0.9, s * 0.2 + uTime * 1.3)).r * 0.18;
  float sec = texture2D(uNoise, vec2(xz.x * 0.031 + 0.3, uTime * 0.012)).r;                      // some stretches of the face run clean, some heavy
  float fine = texture2D(uNoise, vec2(xw * 1.3, s * 0.85 + uTime * 1.6)).a;                         // a fine grain (as wide as it is long: drawn out, it striped the foam like a curtain)
  float dayK = 1. - uDim;
  // the foam leans as it falls (one way here, the other way there) and wanders
  float xs = xw + (1. - ft) * 9. * (wv2 - 0.5) + 0.6 * (l2 - 0.5) + 0.14 * (fine - 0.5);
  float fA = texture2D(uNoise, vec2(xs * 0.047, uTime * 0.008 + 0.13)).a, fB = texture2D(uNoise, vec2(xs * 0.19 + 0.4, uTime * 0.011 + 0.57)).r;
  float fC = texture2D(uNoise, vec2(xs * 0.61 + 0.2, s * 0.05 + uTime * 0.3)).a;
  float claw = mix(fA, fB, 0.25 + 0.5 * smoothstep(0.4, 0.6, wv));
  // how far below the roll the foam hangs, as a share of the face: mostly a scalloped fringe, here and there a long tongue
  // (pointed: the depth follows the peaks of the field with no level at which it rests, so no patch of the fringe has a
  // flat bottom; under a low sun the far face keeps to two tones, dark glass and a cream roll)
  float pk = clamp((claw + 0.4 * min(sec - 0.5, 0.1) - 0.36) / 0.46, 0., 1.); pk = pk * pk * (0.35 + 0.65 * pk);
  float hang = (0.025 + 0.5 * pk + 0.07 * smoothstep(0.5, 0.75, fC) * smoothstep(0.05, 0.3, pk)) * mix(1., 0.35, smoothstep(50., 110., dist) * low);
  float roll = 0.87 - 0.1 * (fr - 0.5) - 0.07 * ov, soft = mix(0.025, 0.07, nearC);
  float tip = clamp((ft - (roll - hang)) / max(hang, 0.04), 0., 1.);                              // 0 at a claw's tip, 1 where it leaves the roll
  float holes = texture2D(uNoise, vec2(xs * 0.33, s * 0.21 + uTime * 0.7)).r;                     // its edge is scalloped, and a long tongue is torn open toward its tip
  float cap = smoothstep(roll - 0.6 * soft, roll + 0.6 * soft, ft);
  float fing = smoothstep(-soft, soft, ft - (roll - hang) + mix(0.16, 0.09, nearC) * (holes - 0.5)) * mix(1., smoothstep(0.34, 0.48, holes + 0.6 * (tip - 0.25)), smoothstep(0.12, 0.26, hang));
  fing *= mix(0.5, 1., smoothstep(0.02, 0.55, tip));      // (a finger thins to a wash at its tip)
  // and the face carries rafts of foam that follow its slope: thick under the lip, a few as far down as the foot, each torn
  // open into lace (twice as long as wide: nothing is drawn out into a smear)
  float pfA = texture2D(uNoise, vec2(xs * 0.23, s * 0.12 + uTime * 0.5)).r, pfB = texture2D(uNoise, vec2(xs * 0.62 + 0.3, s * 0.31 + uTime * 0.9)).a;
  float pf = pfA * 0.6 + pfB * 0.4 + 0.1 * (fine - 0.5), thrP = mix(0.71, 0.53, smoothstep(0.2, 0.9, ft)) - 0.12 * (sec - 0.5);
  float raft = smoothstep(thrP, thrP + mix(0.025, 0.055, nearC), pf) * onFace * smoothstep(0.06, 0.22, ft) * mix(1., smoothstep(0.3, 0.46, holes), 0.7) * (1. - smoothstep(70., 150., dist));
  // veins: the level lines of a slow field (two levels, both off its mean: far away, where the field blurs to its mean, none show)
  float vn = texture2D(uNoise, vec2(xs * 0.17, s * 0.12 + uTime * 0.55)).a + 0.1 * (fine - 0.5);
  float vd = min(abs(vn - 0.62), abs(vn - 0.37)), vw = mix(0.014, 0.028, nearC) * (1. + 0.5 * smoothstep(0.4, 0.85, ft));      // (a little thicker toward the roll, where they run together)
  float vein = (1. - smoothstep(vw, vw * 2.4, vd)) * smoothstep(0.1, 0.7, ft + 0.9 * (sec - 0.5) + 0.4 * (wv - 0.5)) * (1. - smoothstep(55., 120., dist)) * onFace;
  // (the glass itself is never one flat expanse: faint bands run along the wave, as its curve does, and fine ripples take the light close by)
  float band = texture2D(uNoise, vec2(xw * 0.14, s * 0.36 - uTime * 0.21)).r;
  col *= mix(1., 0.91 + 0.18 * band, onFace);
  // close to the eye the glass has a skin: wind ripples in fine bands along the wave, strings of bubbles drawn up the face and
  // a second, finer net of veins (so within a few boat lengths the face is never a flat slab of one colour)
  float nearSk = onFace * (1. - smoothstep(10., 40., dist));
  // (none of these fields is drawn out more than three to one: a lookup drawn out further falls to a coarse level of the
  // texture where the face is seen along its length, and each texel becomes a bar)
  float rip = texture2D(uNoise, vec2(xw * 0.17 + 0.6, s * 0.46 - uTime * 0.2)).a, rip2 = texture2D(uNoise, vec2(xw * 0.52, s * 1.3 - uTime * 0.5)).r;
  col *= mix(1., 0.74 + 0.36 * rip + 0.16 * rip2, nearSk);
  float bub = texture2D(uNoise, vec2(xs * 1.15 + 0.2, s * 0.55 + uTime * 1.0)).a * 0.62 + rip2 * 0.38;
  float vn2 = texture2D(uNoise, vec2(xs * 0.52 + 0.4, s * 0.34 + uTime * 0.8)).r + 0.08 * (rip - 0.5);
  float nearFoam = nearSk * max(smoothstep(0.6, 0.67, bub) * 0.6 * smoothstep(0.08, 0.5, ft), (1. - smoothstep(0.012, 0.032, abs(vn2 - 0.5))) * 0.5 * smoothstep(0.05, 0.4, ft));
  // ahead of the toe: a lick of foam pushed out over the calm water (web: a net of veins for the toe line and the back; of the
  // lick itself only the solid patches seen from afar are left: close by, the lace ahead of the toe is the foot's own net)
  float wn = texture2D(uNoise, xz * vec2(0.31, 0.19) + uTime * vec2(0.01, -0.05)).a + 0.08 * (l3 - 0.5);
  float web = 1. - smoothstep(0.014, 0.04, min(abs(wn - 0.62), abs(wn - 0.38)));
  float toeL = exp(-(s + ${M(ue-.4)}) * (s + ${M(ue-.4)}) * 3.) * smoothstep(0.3, 0.55, fr) * 0.75 * mix(0.15 + 0.85 * web, 1., nearC);      // (close by the toe's foam is a net too, not a smear)
  float lick = smoothstep(${M(-ue-7)}, ${M(-ue)}, s) * (1. - smoothstep(${M(-ue+.2)}, ${M(-ue+1.4)}, s));
  float lickP = l2 * 0.55 + fr * 0.45;
  float faceFoam = max(max(max(cap, fing), raft * 0.86), max(vein * 0.6, max(toeL, lick * smoothstep(0.6, 0.67, lickP) * 0.85 * nearC)));      // (close by, the lace ahead of the toe is the foot's own net, below)
  faceFoam = max(faceFoam, nearFoam);
  // THE FOOT. The face does not come down to the river in a ruled line: a roll of white water tumbles at its toe
  // and is pushed out ahead of it in lobes and tongues (footLobe: by the place along the front), ragged at its leading edge,
  // torn into lace toward the tip of a tongue and piled up the first of the face, where it frays into the glass; a dark wet
  // line lies just ahead of it, and a wash of thin lace slides out over the calm water and is drawn back under.
  float ragA = texture2D(uNoise, vec2(xz.x * 0.17 + 0.3, uTime * 0.05 + 0.7)).a, ragB = texture2D(uNoise, vec2(xz.x * 0.61 + 0.2, s * 0.27 + uTime * 0.45)).r;
  float sF = s + 1.4 * footH(s, lb);      // (measured over the heap, not in plan, so nothing on its front slope is drawn out into stripes)
  float tum = texture2D(uNoise, vec2(xz.x * 0.29 + 0.6, sF * 0.36 + uTime * 0.66)).a, tumU = texture2D(uNoise, vec2(xz.x * 0.29 + 0.6, (sF + 0.45) * 0.36 + uTime * 0.66)).a;
  float edgeF = cF + lb.x + 1.7 * (ragA - 0.5) + 1.3 * (ragB - 0.5) + 0.9 * (tum - 0.5);                 // metres behind the white water's leading edge
  vec4 tum2T = texture2D(uNoise, vec2(xz.x * 0.83, sF * 0.95 + uTime * 1.4)); float tum2 = tum2T.r;
  float topF = -0.5 + 3.4 * smoothstep(0.3, 0.74, fA * 0.6 + ragA * 0.4) + 1.3 * (fr - 0.5) + 1.2 * (tum - 0.5);      // how far up the face it is piled: a tongue of it climbs here, the glass comes down to the foot there
  topF = max(topF, mix(-1., 1.2, smoothstep(0.1, 0.3, lb.y)));                       // (wherever it is piled, the whole pile is white)
  float surge = 0.5 + 0.5 * sin(uTime * 1.2 + xz.x * 0.09 + 6.283 * ragA), reachW = 1.3 + 3.8 * surge;
  // WHITE AND WHOLE ONLY ON THE PILE. The roll is whole white water where the river is heaped under it (and up the
  // face as far as it is piled). With metres from the pile (mF: out over the river, or up the face above it) it comes apart
  // fast: within a stride into a net of white veins round holes of dark water (two nets, cells an arm and a hand across, the
  // fine one only hard by the pile), then single threads, then flecks, and at the wash's own reach nothing. Every pixel of it
  // is foam or water: no film lies over the river, and the moon's glitter and the lamps' glints stand in the holes.
  float peF = cF + clamp(lb.x - 1.2, 0.8, 2.8) + 0.5 * (tum - 0.5) + 0.35 * (ragB - 0.5);      // metres behind the pile's front (it is ragged)
  float upF = max(cF - topF, 0.), mF = max(max(-peF, 0.), 1.6 * upF);
  float cutF = max(max(-edgeF, 0.) / reachW, upF / 1.3), flk = tum * 0.5 + tum2 * 0.5 - 0.5;
  // the ropes on the back of the wave: their fields are read here, since the net behind the crest is cut by them
  float boA = texture2D(uNoise, vec2(xz.x * 0.19 + 0.35, s * 0.075 - uTime * 0.3), -1.).a, boB = texture2D(uNoise, vec2(xz.x * 0.53 + 0.1, s * 0.21 - uTime * 0.62), -1.).r;
  vec2 gp = xz - vec2(0., -8.); float gr = length(gp);      // (the way to the water gate's arch and metres from it: the streaks that run in under it converge there)
  // the net's own place: metres along the front and metres out from the foot (over the heap), carried out ahead with the
  // water; behind the crest, metres along the front and metres behind the crest, sliding down the back. Bent a little by
  // the foam's own fields, so no two cells are alike; behind the crest also by the net's own swirls (netWarp; the widest
  // cells by wider swirls), so no vein is straight there.
  vec2 pn = s < -0.2 ? vec2(xz.x + 0.8 * (ragB - 0.5), sF + uTime * 0.3 + 0.9 * (tum - 0.5)) + (tum2T.gb - 0.5) * 0.05
                     : vec2(xz.x + 0.9 * (boB - 0.5), s - uTime * 0.45 + 0.9 * (boA - 0.5));
  bool backN = s >= -0.2; vec2 pnB = pn;
  if (backN) { pnB = pn + 2.2 * netWarp(pn / 2.2 + 5.); pn += netWarp(pn); }
  // The net is cut by the pixel that sees it (netW): pxN is how many metres of the net lie under this pixel; behind the
  // crest a size of cell that is smaller than its pixel is not worked out at all (its mean cover is drawn). (What else this
  // white water reads besides the wave's own geometry and clock is named at the head of FOOT_GLSL.)
  vec2 pnX = dFdx(pn), pnY = dFdy(pn); float pxN = sqrt(abs(pnX.x * pnY.y - pnX.y * pnY.x));
  vec3 pxK = pxN / vec3(1.3, 0.55, 0.2); float netB = 1., netC = 1., netF = 1.;      // three sizes of cell: 1.3 m (behind the crest only), 0.55 m and 0.2 m across
  if (backN) {      // where white water can lie: the whole back of the wave
    if (pxK.x < 1.1) netB = foamCell(pnB / 1.3 + 3.7);
    if (pxK.y < 1.1) netC = foamCell(pn / 0.55);
    if (pxK.z < 1.1) netF = foamCell(pn / 0.2 + 7.3);
  } else if (cF > -(lb.x + reachW + 2.4) && cF < 4.8) { netC = foamNet(pn / 0.55); netF = foamNet(pn / 0.2 + 7.3); }      // and ahead of the crest from the wash's furthest reach to the top of the pile
  float pxB = pxK.x, pxC = pxK.y, pxF = pxK.z;
  float aaB = clamp(fwidth(netB), 0.012, 0.3), aaC = clamp(fwidth(netC), 0.012, 0.3), aaF = clamp(fwidth(netF), 0.012, 0.3);
  float pileF = (1. - smoothstep(0., 0.07, mF)) * smoothstep(0., 0.1, edgeF) * ridGap(d);      // (round a rider in his pocket under the wall there is no pile: lace on dark water, and his hull reads against it)
  float patchN = smoothstep(0.36, 0.64, g1T.a);      // (a field some metres across: the lace lies thick here and thin there, never an even mesh)
  float wC = 0.085 * mix(0.5, 1.4, patchN) + 0.32 * exp(-mF / 0.6) + 0.45 * flk * smoothstep(0.2, 1.4, mF) - 0.26 * cutF - smoothstep(0.85, 1., cutF);
  float wF = 0.5 * exp(-mF / 0.4) - 0.07 - 0.5 * cutF;
  wC = min(wC, mix(1., 0.1, smoothstep(0., 0.5, cutF)));      // (out in the wash only thin threads and flecks: none is wider than a hand)
  wC = min(wC, mix(0.13, 1., ridGap(d))); wF = min(wF, mix(0., 1., ridGap(d)));      // (thin threads only in a rider's pocket)
  float laceF = max(netW(netC, wC, aaC, pxC), netW(netF, wF, aaF, pxF)) * (1. - smoothstep(4.4, 4.8, cF));
  float footF = max(pileF, laceF);
  col *= 1. - 0.32 * smoothstep(-2.6, -0.2, edgeF) * (1. - smoothstep(0., 1.6, edgeF));      // the wet line
  // and thin streaks of foam are drawn up the face with the water, from the roll toward the lip (the level lines of a field
  // three times as long up the face as along it, off its mean: far away, where the field blurs, none show)
  float stv = texture2D(uNoise, vec2(xw * 0.41 + 0.15, s * 0.13 + uTime * 0.85), -1.).a * 0.7 + texture2D(uNoise, vec2(xw * 1.1 + 0.5, s * 0.3 + uTime * 1.5), -1.).r * 0.3;
  float streak = (1. - smoothstep(0.01, 0.028, abs(stv - 0.58))) * onFace * smoothstep(0.15, 0.45, ft) * (1. - smoothstep(0.9, 1., ft));
  faceFoam = max(faceFoam, streak * 0.6);
  // and lines of foam lie along the wave and are lifted up its face (the level lines of a field nine times as long along the
  // front as up it, in stretches): beside the boat, where the face is looked along, they run away down the wave
  float hlF = texture2D(uNoise, vec2(xw * 0.045 + 0.7, s * 0.2 + uTime * 0.33)).a + 0.05 * (fine - 0.5);
  float hline = (1. - smoothstep(0.011, 0.028, min(abs(hlF - 0.61), abs(hlF - 0.41)))) * onFace * smoothstep(0.12, 0.3, ft) * (1. - smoothstep(0.8, 0.94, ft)) * smoothstep(0.35, 0.6, wv2 * 0.5 + sec * 0.5 + 0.1);
  faceFoam = max(faceFoam, hline * 0.72);
  col *= mix(1., 0.84 + 0.3 * smoothstep(0.43, 0.55, stv), onFace);      // (and the glass between them is marbled, lighter and darker, with the same motion: no smooth sheet of one tone beside the boat)
  // (and close to the eye the foam on the face is lace: crisp holes of glass eaten into it)
  faceFoam = mix(faceFoam, faceFoam * (0.2 + 0.8 * smoothstep(0.4, 0.5, bub * 0.6 + rip * 0.4 + 0.5 * (faceFoam - 0.55))), nearSk * 0.9);
  faceFoam = max(faceFoam, onFace * smoothstep(0.2, 0.55, ft) * smoothstep(110., 300., dist) * 0.9);      // (far away the whole upper face is the white thread)
  faceFoam *= mix(0.62 + 0.38 * smoothstep(0.35, 0.6, fine), 1., nearC);
  faceFoam = max(faceFoam, footF);      // (the foot's white water is cut by its own net alone and takes none of the face's close-up grain)
  // behind the crest: how much foam lies where (the most in the first six metres, then less, caps on the swells, churn at
  // the wall); the net of the back is cut by it, below
  float env = exp(-sb / 150.) * (1. - smoothstep(${M(5.2*Te)}, ${M(6*Te)}, sb));
  float dw = max(d - 2.5, 0.);
  float cv = 1. * exp(-sb / 2.6) + 0.35 * exp(-sb / 30.) + 0.2 * exp(-sb / 380.) + 0.4 * pow(max(cos(sb * ${M(2*Math.PI/Te)}), 0.), 8.) * env
    + uPlume * (0.4 * exp(-dw / 14.) * exp(-sb / 380.) + 0.7 * exp(-dw / 6.) * exp(-(s - 4.) * (s - 4.) / 500.));
  float lk = smoothstep(3., 16., sb);
  // Beside and ahead of the boat the foam behind the crest is rafts and patches with jade between them, cut from layers that
  // are as wide as they are long (drawn-out layers, looked along from a few metres up, run together into parallel streaks).
  vec4 gfT = texture2D(uNoise, xz * 0.21 + vec2(0., uTime * 0.02));
  float nearB = (1. - smoothstep(14., 62., dist)) * smoothstep(-0.5, 0.5, s);
  float laceN = 0.5 + ((g1T.a - 0.5) * 0.36 + (t2.r - 0.5) * 0.3 + (gfT.r - 0.5) * 0.2 + (l3 - 0.5) * 0.14) * 1.55;
  lace = mix(lace, laceN, nearB);
  float th = max(1. - cv * 1.1, mix(0.42, 0.5, nearB) * smoothstep(mix(1.5, 0.4, nearB), mix(5., 2.6, nearB), sb));      // past the crest there is always jade between the foam
  float backFoam = smoothstep(th, th + mix(0.3, 0.13, lk) * mix(0.45, 1., nearC), lace);      // (a sharper edge near the eye)
  backFoam = max(backFoam, web * 0.66 * smoothstep(th - 0.3, th - 0.02, lace) * lk);          // the lace is a net: veins of foam run on from every patch
  // behind the crest the water is broken: ropes and rafts of thick white water are left by the lip and slide down the
  // back of the wave, close together at the crest and torn apart further back, with deep jade channels between them (by
  // metres on the wave, the whole front long)
  float boU = texture2D(uNoise, vec2(xz.x * 0.19 + 0.35, (s + 0.7) * 0.075 - uTime * 0.3), -1.).a;
  float bo = boA * 0.64 + boB * 0.36, boThr = mix(0.4, 0.62, smoothstep(0.5, 13., sb));
  float boZone = smoothstep(-0.2, 0.7, s) * (1. - smoothstep(9., 21., sb));
  // the rafts are cut from the net: thick-veined cells where a raft lies, threads between the rafts, jade in every hole
  float wBc = (0.07 + 0.5 * smoothstep(boThr - 0.1, boThr + 0.05, bo)) * boZone - 0.02, wBf = 0.55 * smoothstep(boThr - 0.02, boThr + 0.1, bo) * boZone - 0.06;
  float boil = max(netW(netC, wBc, aaC, pxC), netW(netF, wBf, aaF, pxF));
  backFoam = max(backFoam, boil);
  col = mix(col, col * vec3(0.5, 0.76, 0.76), boZone * 0.45 * (1. - boil));
  float foam = mix(faceFoam, backFoam, smoothstep(-0.3, 0.3, s));
  // the rare crossing tide: a clean jade front, a white crest, a short back of lace
  float s2 = s + crossS(d), win = (d - uCrossD) / (d > uCrossD ? 130. : 45.);
  float rk = uRare * smoothstep(-25., 5., uCrossD) * exp(-win * win);
  // (far away its crest is drawn wider than it is, like the bore's own thread: a second white line that runs at an angle to the
  // first and closes on it)
  float farR = smoothstep(60., 300., dist), rkC = smoothstep(0.04, 0.3, rk);
  foam = max(foam, rkC * max(exp(-s2 * s2 / mix(2.4, 16., farR)) * mix(0.72 + 0.28 * smoothstep(0.3, 0.5, fr), 1., farR), smoothstep(-1., 0.3, s2) * exp(-max(s2, 0.) / 2.4) * smoothstep(0.3, 0.6, lace + 0.2)));      // (its back is clean jade: seen from behind it is a smooth swell with a white mane)
  foam = max(foam, rkC * smoothstep(-3., -0.6, s2) * (1. - smoothstep(-0.2, 0.4, s2)) * smoothstep(0.46, 0.6, fs + 0.1 + 0.12 * (s2 + 1.5)) * 0.9 * (1. - behind));      // fingers down its front
  col = mix(col, col * 0.62, rkC * exp(-(s2 + 3.2) * (s2 + 3.2) / 3.) * (1. - behind) * (1. - farR));                                 // dark glass at its foot
  foam = max(foam, rkC * farR * smoothstep(-4.5, -2., s2) * (1. - smoothstep(0., 4., s2)) * (1. - behind));                          // far off its whole front is white, like the thread
  col += uJade * uSunCol * rk * exp(-(s2 + 1.4) * (s2 + 1.4) / 2.) * 0.42 * (1. - behind);
  foam = max(foam, (1. - smoothstep(3.3, 4.4 + 1.8 * l2, d)) * smoothstep(0.3, 0.55, l2 + 0.18 * sin(uTime * 1.3 + xz.y * 0.45)) * 0.8);   // lapping at the wall foot
  // at the gate the water runs in: streaks that converge on the arch
  float gk = 1. - smoothstep(-10., 85., uBoreZ);
  float ga = atan(gp.x, abs(gp.y) + 1e-3);
  ga += 0.22 * (l2 - 0.5) + 0.12 * sin(gr * 0.13 - uTime * 0.6);      // (the streaks bend and wander: they are not straight spokes)
  float gs = texture2D(uNoise, vec2(ga * 5., gr * 0.07 + uTime * 0.55)).a * 0.52 + texture2D(uNoise, vec2(ga * 12. + 0.3, gr * 0.09 + uTime * 0.8)).a * 0.38 + texture2D(uNoise, vec2(ga * 27. + 0.7, gr * 0.16 + uTime * 1.2)).r * 0.1;
  float gz = gk * (1. - smoothstep(30., 95., gr)) * smoothstep(0.34, 0.6, mix(l1, g1T.a, nearB) + 0.3 * l3);      // (and they are torn into patches with jade between)
  float gh = texture2D(uNoise, vec2(ga * 23. + 0.2, gr * 0.3 + uTime * 1.9)).a;                                                    // fine threads that race in
  foam = max(foam * (1. - 0.8 * gz * smoothstep(4., 10., sb)), gz * smoothstep(0.47, 0.56, gs * 0.6 + l2 * 0.2 + gh * 0.2) * mix(0.9, 0.78, dayK));      // (by day jade channels run between the streaks)
  // where the bore runs up the wall the water is white: churned foam over the whole mound, torn at its edges
  // (white from the crest back, and along the foot of the stone; a few metres off the wall the wave keeps its dark foot, its glass
  // face with claws of foam and its lip, so the end of the wave is not one pale mound)
  float runK = uPlume * exp(-dw / 6.) * mix(smoothstep(-2.2, 0.6, s), smoothstep(-19., -6., s), 1. - smoothstep(1.5, 4.5, d)) * (1. - smoothstep(4., 26., s));
  vec4 cgT = texture2D(uNoise, vec2(xz.x * 0.07 + uTime * 0.04, xz.y * 0.07 - uTime * 0.085));      // (the heaps the vertex shader throws up there: jade shows in the troughs between them, and they are lit by their own slope)
  foam = max(foam, smoothstep(0.34, 0.62, runK * 1.15 + (t2.r * 0.45 + gfT.r * 0.35 + l3 * 0.2 - 0.5) * 0.9));
  foam *= 1. - 0.35 * smoothstep(0.15, 0.5, runK) * (1. - smoothstep(0.26, 0.5, cgT.r + 0.3 * (l3 - 0.5)));
  // Seen from the crest, the heap against the stone is a torrent, not a pale bank: the water thrown up the wall pours back off
  // it in white ropes that run down its flank, away from the masonry, with dark jade between them, and a white seam boils where
  // it meets the stone
  float heapK = uPlume * exp(-dw / 5.5) * smoothstep(0.5, 3.5, s) * (1. - smoothstep(12., 30., s));
  // (read a level finer than the texture would choose and cut with a narrow edge, so each rope keeps its edge along its length)
  float cs1 = texture2D(uNoise, vec2(xz.y * 0.24 + 0.4 * (l2 - 0.5), d * 0.08 - uTime * 0.5), -1.2).a, cs2 = texture2D(uNoise, vec2(xz.y * 0.6 + 0.3, d * 0.2 - uTime * 0.8), -1.2).r;
  float casc = smoothstep(0.48, 0.53, cs1 * 0.66 + cs2 * 0.34 + 0.1 * (l3 - 0.5));
  float seam = 1. - smoothstep(0.5, 2.2 + 1.2 * l2, d);
  foam = mix(foam, max(foam * casc, seam * 0.95), heapK * 0.9);
  col = mix(col, col * vec3(0.34, 0.6, 0.58), heapK * 0.85);
  // THE SHOULDER AGAINST THE STONE. Where the wave ends at the seawall it comes apart: the mound the wall throws up
  // collapses outward, and white water pours off it in ropes that run down its flank and its back (crisp ropes with deep
  // green between them, by metres along the wall and off it; the mound itself is deep water, not a lit pale bank)
  float shK = uPlume * exp(-dw / 7.) * smoothstep(-0.5, 2.5, s) * (1. - smoothstep(14., 32., s));
  float rp1 = texture2D(uNoise, vec2(xz.y * 0.2 + 0.25 * (boB - 0.5), d * 0.065 - uTime * 0.42), -1.2).a, rp2 = texture2D(uNoise, vec2(xz.y * 0.57 + 0.6, d * 0.19 - uTime * 0.7), -1.2).r;
  float rope = smoothstep(0.5, 0.535, rp1 * 0.62 + rp2 * 0.38 + 0.12 * (shK - 0.5)) * smoothstep(0.08, 0.3, shK);
  foam = max(foam, rope * 0.96);
  col = mix(col, col * vec3(0.42, 0.68, 0.66), smoothstep(0.08, 0.4, shK) * 0.6);
  // lines of foam drift on the calm river ahead of the bore, near the eye (the tide's own scum lines)
  float fl1 = texture2D(uNoise, xz * vec2(0.17, 0.06) + vec2(0.3, uTime * 0.004)).a, fl2 = texture2D(uNoise, xz * vec2(0.6, 0.11) + vec2(0., uTime * 0.01)).r;
  float lineF = (1. - smoothstep(0.012, 0.036, abs(fl1 * 0.7 + fl2 * 0.3 - 0.56))) * smoothstep(0.42, 0.6, n3.r * 0.5 + paw * 0.5) * calm * (1. - smoothstep(60., 170., dist)) * smoothstep(3., 9., dist);
  foam = max(foam, lineF * 0.4);
  foam = clamp(foam, 0., 1.);
  // close to the eye the foam behind the crest has a grain of its own: holes of jade a hand to a stride across with crisp
  // edges (the coarse layers alone have no edge at a boat length), and it is lit and shaded by its own slope
  vec4 fnT = texture2D(uNoise, xz * 0.61 + vec2(0.37, 0.11) + uTime * vec2(0.01, -0.03));
  float nearP = (1. - smoothstep(9., 28., dist)) * smoothstep(0.3, 2.5, s);
  float runM = smoothstep(0.15, 0.5, runK), runH = 1. - smoothstep(0.37, 0.45, fnT.a * 0.55 + t2.r * 0.45 + 0.25 * (cgT.r - 0.5));
  foam *= 1. - 0.62 * runM * runH * (1. - nearP);
  col = mix(col, col * vec3(0.5, 0.74, 0.72), runM * 0.7 * (1. - nearP));
  foam *= mix(1., smoothstep(0.4, 0.46, fnT.a * 0.62 + l3 * 0.38 + 0.1 * (foam - 0.5)), nearP * 0.9);
  col = mix(col, col * vec3(0.5, 0.74, 0.72), nearP * 0.75);      // (and the water in the holes is deep, so the white stands against it)
  // foam has relief: lit and shaded by the slope of the lace toward the sun, cool in its hollows, sparkling on top
  vec2 gf = gfT.gb - 0.5;
  float l2s = texture2D(uNoise, (xz + uSunDir.xz * 0.5) * vec2(0.2, 0.075) + uTime * vec2(0.004, 0.012)).a;
  float facing = smoothstep(-0.35, 0.45, dot(normalize(vN), uSunDir));
  // (under a low sun or the moon the relief keeps its strength on slopes that face away: back-lit foam is all sparkle and shadow)
  float rel = ((l2 - l2s) * 3.4 * (1. - 0.8 * nearB) - (gf.x * uSunDir.x + gf.y * uSunDir.z) * (1.3 + 1.2 * nearB)) * smoothstep(2.5, 12., dist) + (l3 - 0.5) * 0.9 * nearE - ((fnT.g - 0.5) * uSunDir.x + (fnT.b - 0.5) * uSunDir.z) * 2.2 * nearP - ((cgT.g - 0.5) * uSunDir.x + (cgT.b - 0.5) * uSunDir.z) * 3.2 * runK - ((fnT.g - 0.5) * uSunDir.x + (fnT.b - 0.5) * uSunDir.z) * 1.8 * runM * (1. - nearP), fk = 0.25 + 0.75 * facing;      // (close by the relief comes from the fine layer: the coarse ones would show their texels)
  float fl = clamp(0.55 * fk + rel * mix(fk, 1.5, lowSun) * (1. - 0.5 * low * onFace), 0., 1.);
  // (on the face the relief is the foam's own billows, lit from above: the flat-water lookups are drawn out along the river and
  // would stripe the roll like a pleated curtain)
  float relF = (texture2D(uNoise, vec2(xw * 0.23, (s + 0.35) * 0.33 + uTime * 0.7)).a - texture2D(uNoise, vec2(xw * 0.23, s * 0.33 + uTime * 0.7)).a) * 4.5;
  float lipM = smoothstep(0.4, 1.6, vI.w), lipU = lipM * (1. - smoothstep(-0.45, 0.05, s));      // on the thrown sheet of the lip; on its underside
  fl = mix(fl, clamp(0.55 * fk + relF * mix(fk, 1.5, lowSun) * (1. - 0.5 * low), 0., 1.), max(onFace, lipM));
  // (on the overhanging lip the face's own coordinate is drawn out, and the relief cut from it would be upright blocks: it is eased there)
  // (and on the thrown sheet the flat-water lookups are magnified many times over, to patches with the edges of texels: eased there too)
  fl = mix(fl, 0.74 + 0.26 * fl, max(max(ov, lipM), 0.5 * onFace * moonK));
  // The white water that is cut from the net takes none of this relief (the foot's, and all that lies behind the crest): the
  // lookups are drawn out along the river and coarse, and they shade a net of thin veins in soft grey patches metres long.
  // The lace is evenly lit, as white in a thread as in a raft or on the pile, and counts as piled foam; the pile has its
  // own billows (below).
  float footS = footF * (1. - smoothstep(-0.3, 0.3, s)), backS = smoothstep(-0.2, 0.3, s);
  fl = mix(fl, 0.82, max(footS, backS));
  float thick = max(mix(smoothstep(th, th + 0.75, lace), 0.8, onFace), max(max(footS, backS), rope));       // (on the face thin lace is greyer; piled foam and the lace of the net are white)
  float flr = mix(0.74, fl, mix(0.3, mix(0.8, 0.6, uDim), gz) + mix(0.7, mix(0.2, 0.4, uDim), gz) * thick);            // only piled foam has relief; lace is evenly lit (at the gate it is all piled)
  vec3 foamLit = uFoam * mix(mix(vec3(1.), mix(uJade, uSkyAmb * 3.2, 0.5), 0.5), vec3(1.), flr) * mix(0.62, 1., flr) * (uSkyAmb * 2.4 + uSunCol * (0.22 + 0.78 * flr)) * (0.75 + 0.25 * thick);
  // By day the wall comes with the sun behind it and its foam is lit by the sky alone: it is given its form here. The roll of
  // the lip is shaded (dark under the overhang, bright along the top), the foam falls in billows (lit from above, blue in their
  // hollows), and close to the eye the streaks stay streaks
  float dayF = dayK * onFace;
  float bil = clamp(0.5 + relF * 1.3, 0., 1.);
  foamLit *= mix(1., mix(0.7, 1.08, smoothstep(0.6, 1., ft)) * (0.78 + 0.4 * bil) * mix(0.84 + 0.3 * holes, 1., nearC), dayF);
  foamLit = mix(foamLit, foamLit * vec3(0.7, 0.8, 1.) + uJade * uSkyAmb * 0.5, dayF * (1. - bil) * 0.55 * (1. - smoothstep(0.85, 1., ft)));
  foamLit *= mix(1., 0.8 + 0.28 * smoothstep(0.86, 0.975, ft), ov * uDim);      // (under the moon and a low sun too the roll is round: shaded under the overhang, bright along its edge)
  // the thrown lip has a lit top and a belly in its own shade, and where the sheet is thin the light comes through it green
  foamLit *= 1. - 0.3 * lipU * dayK;
  foamLit = mix(foamLit, jadeT * (uSkyAmb * 3. + uSunCol * mix(0.55, 0.9, moonK)), lipU * mix(0.28, 0.42, moonK) * (1. - low));
  foamLit += uJade * uSunCol * thru * (0.25 + 0.9 * back2) * 0.5 * mix(1., 0.4, low);  // sun through the lip
  foamLit += uFoam * uSunCol * thru * (0.12 + back2) * 0.8 * mix(1., 0.4, low);                 // and the lip itself rim-lit
  // (under a low sun the piled foam is cream, not grey: it takes a little of the sun's colour and its shaded side is lifted)
  foamLit = mix(foamLit, mix(foamLit, uFoam * uSunCol * 0.5, 0.2) + uFoam * (uSkyAmb * 2.4 + uSunCol * 0.22) * 0.15 * (1. - flr), low * (1. - onFace));
  // the ropes that pour off the shoulder at the seawall are lit by their own field
  foamLit = mix(foamLit, foamLit * mix(0.72, 1.2, smoothstep(0.35, 0.65, rp2)), rope);
  float boK = boil * smoothstep(-0.3, 0.3, s);
  foamLit = mix(foamLit, foamLit * mix(mix(0.6, 0.8, low), 1.22, clamp(0.5 + (boA - boU) * 5. + (boB - 0.5) * 1.1, 0., 1.)), boK * 0.4);      // (the rafts on the back are lit a little by their own slope)
  // (and the solid white just behind the crest is the same ropes run together: thinner and greener between them, never one flat sheet)
  foamLit = mix(foamLit, foamLit * mix(vec3(0.74, 0.9, 0.86), vec3(1.), max(low, smoothstep(boThr - 0.1, boThr + 0.05, bo))), boZone * smoothstep(-0.3, 0.3, s) * (1. - boil) * 0.9);
  float footK = footS * exp(-mF / 0.5);      // (the billows are the pile's: half a metre out from it the lace is flat)
  // the roll at the foot is tumbling water: billows lit from above, its leading edge in its own shade
  float footB = smoothstep(0.4, 0.6, tum * 0.7 + tum2 * 0.3), footR = clamp(0.5 + (tum - tumU) * 5.5 + (tum2 - 0.5) * 0.8, 0., 1.);
  foamLit = mix(foamLit, foamLit * mix(mix(0.8, 0.9, low), mix(1.2, 1.12, low), footR) * mix(mix(0.9, 0.95, low), 1.06, footB) * mix(0.9, 1.05, smoothstep(0., 0.9, peF)), footK);
  foamLit = mix(foamLit, foamLit * vec3(0.74, 0.86, 1.) + jadeT * uSkyAmb * 0.5, footK * (1. - footB) * 0.4 * (1. - low));      // (blue-green in its hollows)
  // and the pile has edges at arm's length: where it churns (in patches, by its own tumbling field) every cell of
  // the net is a billow of it, bright on its crown and in its own shade in the crease round it, with bubbles a hand across
  // between; elsewhere it is smooth white water (far off the creases blur into the white)
  float churn = smoothstep(0.46, 0.62, tum * 0.6 + tum2 * 0.4), domeF = mix(smoothstep(0.02, 0.5, netC), 0.4, smoothstep(0.4, 1.1, pxC));
  float crC = netW(netC, 0.05 + 0.06 * churn, aaC, pxC) * mix(0.25, 1., churn), crF = netW(netF, 0.1, aaF, pxF) * churn;
  foamLit = mix(foamLit, foamLit * mix(1., mix(0.84, 1.12, domeF), churn) * mix(vec3(1.), mix(vec3(0.42, 0.6, 0.82), vec3(0.72, 0.68, 0.62), low), max(crC * 0.62, crF * 0.4)), footK);
  foamLit += uFoam * uLampC * min(lampGl, 1.) * 0.45;      // and lamp light lies on all the white water near a lamp
  float sp1 = texture2D(uNoise, xz * 1.9 + vec2(h * 1.3, -h * 0.9) + uTime * vec2(0.21, -0.15)).a, sp2 = texture2D(uNoise, vec2(xz.x * 0.8 - xz.y * 0.6, xz.x * 0.6 + xz.y * 0.8) * 3.1 - uTime * vec2(0.17, 0.11)).r;
  foamLit += uSunCol * smoothstep(0.6, 0.76, sp1) * smoothstep(0.55, 0.72, sp2) * fl * smoothstep(0.55, 0.95, foam) * 0.9 * smoothstep(5., 16., dist);      // glints (two skewed layers, so no lattice shows; none within a boat length of the lens, where they would be flakes)
  foamLit = mix(foamLit, uFoam * (uSkyAmb * 2.0 + uSunCol * 0.9), smoothstep(110., 380., dist) * 0.85);   // far away the thread is simply bright
  // THE BACK OF THE WAVE. Behind the crest, the whole front long, all the foam that lies on the jade is cut from the net:
  // where it is thin it is the same white in thin threads round holes of jade, where it is thick the veins are thick, and the
  // back is jade with white lace on it, never a pale sheet. The lace gathers in rafts with lanes of open jade between them
  // (patchG: a field some metres across); hard behind the crest it is close-meshed (cells an arm across, froth a hand across
  // in the thickest of it), and with metres down the back the mesh opens: the widest cells take over and the close mesh is
  // left only in rafts (raftG). The foam stays whole along the crest, the wave's white edge, and in the seam where the water
  // runs up the stone of the seawall (the first metres off its foot).
  float patchG = smoothstep(0.38, 0.62, boA * 0.45 + g1T.a * 0.55), raftG = smoothstep(0.45, 0.6, t2.a), openB = smoothstep(2.5, 11., sb);
  float raftM = foam * mix(0.5, 1.25, patchG), wG = 0.26 * raftM * raftM - 0.03 + 0.1 * foam * exp(-sb / 2.5), keepG = max(1. - smoothstep(0.4, 1.4, s), 1. - smoothstep(1.5, 3.5, d));
  float wGc = wG - 0.22 * openB * (1. - raftG), wGb = 0.75 * wG * mix(0.5, 1., openB);
  // (a vein thinner than a finger is not drawn as a hair: it fades out, so the lace ends in the open jade and no mesh of hairlines lies over it)
  float laceB = max(max(netW(netC, wGc, aaC, pxC) * smoothstep(0., 0.05, wGc), netW(netB, wGb, aaB, pxB) * smoothstep(0., 0.035, wGb)), netW(netF, 1.2 * (foam * mix(0.7, 1., patchG) - 0.88), aaF, pxF));
  foam = mix(foam, max(laceB, foam * keepG), backS);
  col = mix(col + spec * (1. - foam), foamLit, foam);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,lo=`
uniform sampler2D uNoise; uniform vec3 uCamL; uniform float uReach;
varying vec3 vW; varying vec3 vNl; varying vec4 vP;
#include <common>
#include <fog_pars_vertex>
${Ee}
${_e}
${He}
// the section of the roll at one place along the front: (metres behind the crest, height) for a = 0 (its root) .. 1 (its edge)
// q: height at the root, height of the crest, how far the river's own sheet is thrown, the radius of the curl; k: how much of it there is
vec2 lipSec(float a, vec4 q, float k){
  float t = clamp(a / 0.55, 0., 1.), w = clamp((a - 0.55) / 0.45, 0., 1.);
  vec2 P0 = vec2(1., q.x - 0.06), P1 = vec2(0.1, q.y + 0.2 + 0.55 * k), P2 = vec2(-(0.3 + 0.95 * q.z), q.y - 0.17 * q.z + 0.26 * k);
  vec2 p = (1. - t) * (1. - t) * P0 + 2. * t * (1. - t) * P1 + t * t * P2;
  float th = w * 2.25;
  return p + vec2(-q.w * sin(th), -1.25 * q.w * (1. - cos(th)));
}
void main(){
  float dC = uCamL.x - wallX(uCamL.z), sC = uCamL.z - zFront(dC);
  float d = floor(dC) + position.x, zf = zFront(d), x0 = wallX(zf) + d, a = position.y;
  // (the same numbers as the river's own lip: see WATER_VERT)
  float atEye = smoothstep(-7.5, -4., sC) * (1. - smoothstep(6., 17., abs(d - dC)));
  float tear = textureLod(uNoise, vec2(x0 * 0.043 + 0.21, uTime * 0.045 + 0.33), 4.).r;
  float nearW = 1. - smoothstep(40., 70., abs(d - dC));
  float reach = mix(mix(1.9, 2.7, nearW * (1. - smoothstep(-12., -8., sC))), 3.3, nearW * uReach);
  float toW = mix(0.72 * smoothstep(2.5, 7., d), 1., smoothstep(9., 26., d));      // (carried to the seawall, as the river's own lip is)
  float gapR = ridGap(d);
  float cAmt = reach * toW * (0.5 + 0.85 * tear) * (1. - atEye) * gapR;
  float amt = toW * (1. - atEye) * gapR * (1. - smoothstep(72., 103., abs(d - dC))) * smoothstep(22., 70., zf);
  float lodL = mix(5.7, 4.5, smoothstep(22., 70., zf));
  float lumpC = textureLod(uNoise, vec2(x0 * 0.09, -0.0165 + uTime * 0.55), lodL).a - 0.5, lumpR = textureLod(uNoise, vec2(x0 * 0.09, 0.11 + uTime * 0.55), lodL).a - 0.5;
  float rag = textureLod(uNoise, vec2(x0 * 0.13 + 0.7, uTime * 0.07 + 0.11), 3.).a;
  // (against the wall the river is heaped and chopped by its own vertex shader: the roll stands on the same heaps)
  float runM = uPlume * exp(-max(d - 2.5, 0.) / 4.5);
  float chop = (textureLod(uNoise, vec2(x0 * 0.07 + uTime * 0.04, zf * 0.07 - uTime * 0.085), 4.6).r - 0.5) * 1.7;
  float chop2 = (textureLod(uNoise, vec2(x0 * 0.085 + 0.3, 0.03 + uTime * 0.2), 4.4).a - 0.5) * 1.5;
  float heap = (chop * 2.4 + chop2 * 1.1) * runM;
  float crg = crestRag(x0) * smoothstep(3., 9., d);      // (the roll stands on the crest's teeth, as the river's mesh does)
  vec4 q = vec4(boreH(1., d) + lumpR * 0.9 + heap + 0.41 * crg, boreH(-0.15, d) + lumpC * 0.73 + heap + crg, cAmt, (0.4 + 0.7 * rag) * amt);
  vec2 p = lipSec(a, q, amt), pa = lipSec(a + 0.03, q, amt), pb = lipSec(a - 0.03, q, amt);
  float z = zf + p.x;
  vec3 wp = vec3(wallX(z) + d, p.y - 4. * (1. - smoothstep(0.02, 0.07, amt)), z);
  vNl = normalize(cross(vec3(1., 0., dzFront(d)), vec3(0., pa.y - pb.y, pa.x - pb.x)) + vec3(0., 1e-4, 0.));
  vP = vec4(x0, a * (1.3 + 0.95 * cAmt + 2.3 * q.w), a, amt);
  vW = wp;
  vec4 mvPosition = modelViewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ho=`
uniform sampler2D uNoise; uniform vec3 uDeep, uJade, uFoam, uSunDir, uSunCol, uSkyAmb, uCamL; uniform float uTime, uDim, uLow;
varying vec3 vW; varying vec3 vNl; varying vec4 vP;
#include <common>
#include <fog_pars_fragment>
void main(){
  float a = vP.z, amt = clamp(vP.w, 0., 1.); vec2 uv = vP.xy;
  // (every lookup is taken here, before anything is thrown away)
  float e1 = texture2D(uNoise, vec2(uv.x * 0.083, uTime * 0.04 + 0.3)).a, e2 = texture2D(uNoise, vec2(uv.x * 0.31 + 0.5, uTime * 0.09)).r;
  float e3 = texture2D(uNoise, vec2(uv.x * 0.9, uv.y * 0.7 + uTime * 0.55)).a;
  float f1 = texture2D(uNoise, vec2(uv.x * 0.47, uv.y * 0.3 + uTime * 0.4)).a, f2 = texture2D(uNoise, vec2(uv.x * 1.5 + 0.3, uv.y * 1.05 + uTime * 0.8)).r;
  float hl = texture2D(uNoise, vec2(uv.x * 0.36 + 0.2, uv.y * 0.42 + uTime * 0.5)).r;
  // the falling edge: long tongues, short teeth and a fine fray; above it the sheet is torn open
  float edge = 0.6 + 0.4 * clamp((e1 - 0.3) * 2.4, 0., 1.) * (0.5 + 0.5 * e2);
  float fray = edge - a + 0.09 * (e3 - 0.5);
  float torn = smoothstep(0.72, 1., a / max(edge, 0.3)) * (1. - smoothstep(0.36, 0.42, hl + 0.2 * (e3 - 0.5)));
  if (amt < 0.05 || fray < 0. || torn > 0.5) discard;
  vec3 V = normalize(uCamL - vW), N = normalize(vNl);
  float nv = dot(N, V), under = 1. - step(0., nv);          // 1: the hollow underside of the curl
  N *= 1. - 2. * under;
  float low = uLow, moonK = uDim * (1. - low);
  vec3 jadeT = uJade * mix(vec3(1.), vec3(0.62, 1.28, 0.86), moonK);
  float wrap = clamp(dot(N, uSunDir) * 0.6 + 0.4, 0., 1.);
  float back = max(dot(-V, uSunDir), 0.), back2 = back * back * (1. - 0.4 * back * back);
  float rimE = 1. - smoothstep(0., 0.16, fray);              // the last hand's breadth before the torn edge: thin water
  // foam: the top of the roll is white, its falling front is streaked with jade between the streaks, its underside is glass
  float fo = f1 * 0.62 + f2 * 0.38, thr = mix(0.17, 0.55, smoothstep(0.2, 0.95, a)) + 0.22 * under;      // (the top of the roll is white: where it opened, dull violet-grey patches lay on it like stains)
  float foamK = smoothstep(thr - 0.05, thr + 0.05, fo);
  float relief = clamp(0.5 + (f2 - 0.5) * 1.6 + (f1 - 0.5) * 0.8, 0., 1.);
  vec3 glass = mix(uDeep, jadeT, mix(0.6, 0.85, rimE)) * (uSkyAmb * 2.6 + uSunCol * (0.24 + 0.36 * wrap))
    + jadeT * (uSkyAmb * mix(1.2, 2.2, moonK) + uSunCol * (mix(0.22, 0.4, moonK) + mix(1.5, 0.7, low) * back2)) * mix(0.4, 1., max(rimE, under * smoothstep(0.3, 0.95, a))) * (1. - 0.5 * low) * (0.74 + 0.5 * hl);
  glass = max(glass * mix(1., 1. + 0.6 * back2, 1. - smoothstep(0.2, 0.4, a)), jadeT * (uSkyAmb * 1.5 + uSunCol * 0.1) * (1. - under));
  vec3 foam = uFoam * (uSkyAmb * 2.4 + uSunCol * (0.2 + 0.8 * wrap * (0.55 + 0.45 * relief))) * mix(0.72, 1., relief);
  foam = mix(foam, foam * vec3(0.72, 0.84, 1.) + jadeT * uSkyAmb * 0.6, 0.55 * (1. - relief) * (1. - uDim * 0.5));      // cool in its hollows
  foam += uFoam * uSunCol * back2 * 0.5 * mix(1., 0.4, low);                                                             // and lit through against the light
  foam *= 1. - 0.3 * under;
  vec3 col = mix(glass, foam, foamK);
  col += (uFoam * 0.5 + jadeT) * uSunCol * rimE * (0.16 + 0.9 * back2) * mix(1., 0.45, low);      // the thin edge takes the light
  col *= mix(1., 1. - 0.2 * smoothstep(0.3, 0.55, a), 1. - under);                              // the front of the roll is in its own shade lower down
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function uo(){const v=new Float32Array(10659),u=new Uint16Array(3328*6);for(let f=0;f<=16;f++)for(let o=0;o<209;o++){const t=(f*209+o)*3;v[t]=o-104,v[t+1]=f/16}let h=0;for(let f=0;f<16;f++)for(let o=0;o<208;o++){const t=f*209+o,s=t+1,r=t+209,m=r+1;u[h++]=t,u[h++]=s,u[h++]=r,u[h++]=s,u[h++]=m,u[h++]=r}const n=new y.BufferGeometry;return n.setAttribute("position",new y.BufferAttribute(v,3)),n.setIndex(new y.BufferAttribute(u,1)),n.boundingSphere=new y.Sphere(new y.Vector3(0,0,0),1e5),n}function fo(e){const a=v=>e.boreZ-e.lead*Math.exp(-Math.max(v,0)/Je)+4.5*Math.sin(v*.0021+e.seed)+2*Math.sin(v*.0113+2.1*e.seed);return{zFront:a,heightAt:(v,u,h=0)=>{const n=v-Ce(u),f=u-a(n),o=Se(1+f/ue,0,1),t=Math.max(f,0),s=Math.exp(-t/150)*(1-ge(5.2*Te,6*Te,t));let r=f<0?Qe*o*o*(1.6-.6*o):2.4+.4*(1-Math.exp(-t/400))+1.6*s*Math.cos(t*2*Math.PI/Te);const m=f+ue+2.6;r-=ct*Math.exp(-m*m/7),r+=ut*Math.exp(-f*f/(f<0?2.2:6.5));const l=Math.max(n-2.5,0);if(r+=e.plume*5.5*Math.exp(-l/6)*Math.exp(-((f-4)*(f-4))/260)*ge(-12,-2,f),r+=e.plume*.75*Math.exp(-l/70)*Math.sin(l*.21-h*1.9)*ge(8,40,f)*Math.exp(-t/420),e.rare){const w=f+At*(n-e.crossD)+1.5*Math.sin(n*.09+e.seed)+.8*Math.sin(n*.23),c=(n-e.crossD)/(n>e.crossD?130:45);r+=Ft*ge(-25,5,e.crossD)*Math.exp(-c*c)*Math.exp(-w*w/(w<0?Lt:90))}if(f>-6&&f<10&&n>8){const w=.48*Math.sin(n*.21+h*.9+e.seed)+.34*Math.sin(n*.345-h*.63+2.1*e.seed)+.14*Math.sin(n*.52+h*1.31+4.2);r+=w*Math.exp(-f*f/(f<0?3:9))*ge(8,30,n)}return r}}}const vt=`
uniform vec3 uSunDir, uSunCol, uSkyAmb, uGroundAmb;
vec3 lit(vec3 alb, vec3 n, float wrap, float ao){
  float ndl = clamp((dot(n, uSunDir) + wrap) / (1. + wrap), 0., 1.);
  return alb * (uSunCol * ndl + mix(uGroundAmb, uSkyAmb, n.y * 0.5 + 0.5) * ao * 1.6);
}`,Rt=`
attribute vec4 aS;
uniform sampler2D uNoise;
uniform float uTrail, uPlumeH, uDim, uBurstK, uLow, uHeavy;
uniform vec2 uNearFade; uniform vec4 uBurst;
uniform vec3 uSunDir, uCamL;
varying vec2 vUv; varying vec4 vA; varying vec3 vSunV; varying float vP;
#include <common>
#include <fog_pars_vertex>
${Ee}
${_e}
${He}
void main(){
  vP = 0.;
  float kind = aS.w, size = 1., alpha = 0., cls = 0., grow = 0., feather = 0., ride = 1., lean = 0., softP = 0., inW = 1.; vec3 p = vec3(0.); vec2 asp = vec2(1.);
  float zp = max(uBoreZ - uLead, 3.);
  // once the plume's head has gone by the eye, what trails behind it stands between us and the gate, and we look along it:
  // its soft spray thins to a veil (by day most of all, when it is white on a pale sky), so that what is left is
  // thrown water (ropes, falling strands, drops) with the seawall and the sky between
  float passed = smoothstep(15., 40., uCamL.z - zp), thinP = 1. - mix(0.78, 0.6, uDim) * passed;
  float own = 0., farTall = 0.;
  if (kind >= 3.) {                  // white water at a hull the front is passing (aS.xy: a point on her waterline): tongues that leap
    // along the whole hull while the lip is under it, drawn larger far away so that a junk the far line takes is seen to be taken
    float d = aS.x - wallX(aS.y), sl = aS.y - zFront(d);
    float T = 0.7 + 0.6 * aS.z, ph = fract(aS.z * 17.3 + uTime / T), up = sin(ph * 3.14159), big = fract(aS.z * 7.7);
    float amp = exp(-sl * sl / 46.);
    float H = (2.4 + 3.8 * big * big) * (0.35 + 0.65 * up), wide = 2.1 + 2.7 * big;
    p = vec3(aS.x, boreH(sl, d) - 0.5 + 0.5 * H, aS.y);
    cls = 0.3; asp = vec2(wide, H) * step(0.02, amp); grow = 0.6; own = 1.;
    alpha = amp * smoothstep(0., 0.15, ph) * (1. - smoothstep(0.75, 1., ph)) * mix(0.92, 0.72, uDim);
  } else if (kind >= 2.) {           // the bore strikes the seawall: a column of water at every strike point (every ${Ge} m of wall). It
    // leaps from the foot of the stone as the tongue that runs ahead of the wave along the wall reaches the point, stands at its
    // height as the front itself goes by, and comes down over the parapet and the promenade behind it; each is thrown higher than
    // the last toward the gate. Everything about a column is a function of how far the front has run since its tongue struck
    // there: so along the wall one is rising ahead of the wave, one stands at its height beside it and one is coming down,
    // whatever the pace.
    float rr = kind - 2., slot = floor(aS.y * 4.), zq = zp - ${M(mt)}, k0 = floor(zq / ${M(Ge)}) + 1.;
    float zk = (k0 + mod(slot - k0, 4.)) * ${M(Ge)}, tt = (zk - zq) / 16.;
    float gateK = 1. - smoothstep(60., 430., zk), Hk = mix(11., 18., gateK) * uPlumeH;
    float r1 = fract(aS.x * 7.13), r2 = fract(aS.x * 13.7 + aS.z * 3.1), r3 = aS.z;
    float v0 = sqrt(19.6 * Hk) * (0.45 + 0.55 * sqrt(r1)), a = max(tt - 0.35 * fract(aS.x * 3.3), 0.), Tf = v0 / 4.9 + 0.25;
    float y = 1. + v0 * a - 4.9 * a * a, vy = v0 - 9.8 * a;
    float dOut = 1.2 + 2.6 * r2 + (r2 - 0.44) * 4.2 * a;
    if (y < 9.9) dOut = max(dOut, 0.8);                     // (only water that has cleared the parapet comes down on the promenade)
    float zz = zk + (r3 - 0.5) * 9. - (1.5 + 4.5 * fract(aS.z * 5.7)) * a;
    float here = uPlume * step(20., zk) * (1. - step(${M(de)}, zk)) * smoothstep(0., 0.08, a);
    float alive = here * (1. - smoothstep(0.8, 1., a / Tf)) * smoothstep(-0.5, 1.5, y);
    if (dOut < 0.8) alive *= smoothstep(9.2, 10.4, y);
    own = 1.; grow = 0.35;
    if (rr < 0.36) {                 // the column itself: jets that stand on the foot of the wall and reach to their own height, each with
      // a torn crown, the tallest in the middle of the strike (thinner by day, when side by side they closed into a white bank)
      float top = max(y, 0.5) * (0.5 + 0.5 * (1. - abs(r3 - 0.5) * 1.3));
      cls = 0.3; asp = vec2((2.4 + 3.2 * r2) * (1. + 0.35 * min(a, 2.)), top + 2.5);
      dOut = 0.9 + 1.5 * r2 + 0.5 * a; zz = zk + (r3 - 0.5) * (6. + 2.5 * min(a, 2.)) - 1.5 * a;
      y = 0.5 * (top + 2.5) - 0.8;
      alpha = here * (1. - smoothstep(0.72, 1., a / Tf)) * mix(0.5, 0.92, uDim);
    } else if (rr < 0.7) {           // drops: clusters of beads with air between them
      cls = 0.05; size = 1.7 + 2.3 * r1 + 0.9 * a; alpha = alive * 0.95;
    } else if (rr < 0.9) {           // gouts: short bright lengths of water
      cls = 1.; size = 0.4 + 0.55 * r1 * r1; asp = vec2(1., 1.15 + 0.7 * abs(vy) / 9.); alpha = alive * 0.9;
    } else {                         // and a little smoke that drifts inland over the parasols
      cls = 0.15; size = 4.5 + 5. * r1 + 3. * a; dOut -= 2.2 * a; alpha = alive * mix(0.1, 0.3, uDim) * smoothstep(0.3, 1.2, a);
    }
    p = vec3(wallX(zz) + dOut, y, zz);
  } else if (kind >= 1.) {                  // the crest's feather, kept round the eye: a window of the front 240 m wide that wraps as we move along it
    float WN = mix(240., 120., uHeavy);      // (uHeavy: the third draw, water thrown off the roll of the lip close round the eye: a narrower window, bigger pieces)
    float dC = uCamL.x - wallX(uCamL.z), dRaw = dC + (fract(aS.y - dC / WN) - 0.5) * WN, d = max(dRaw, 9.);
    // (the part of the window that falls behind the seawall is not drawn. It is not gathered at the wall's foot
    // either, where nearly half of the feather would stand on one spot as a white bank)
    inW = smoothstep(4., 9., dRaw) * ridGap(dRaw);      // (and none of it is thrown onto a rider in his pocket under the wall)
    float lipY = boreH(-0.25, d) + crestRag(wallX(zFront(d)) + d) * smoothstep(3., 9., d);      // (on the crest's teeth)
    float sC = uCamL.z - zFront(dC);
    ride = 1. - 0.6 * smoothstep(-7., -4., sC) * (1. - smoothstep(4., 14., sC));      // (thinned only for an eye that rides the face)
    ride *= 1. - 0.75 * smoothstep(4., 12., sC);      // (and for an eye the wave has outrun: seen from behind, the lip's smoke is thinned so that it is no bank before the gate)
    feather = smoothstep(2., 22., zFront(d));          // (none where the front piles into the gate)
    float featherT = smoothstep(26., 60., zFront(d));  // (the tongues stop sooner: none stand in a row once the front is in the gate basin)
    if (kind < 1.45) {               // spindrift smoking off the lip and falling behind it
      float T = 1.5 + aS.z, ph = fract(aS.x + uTime / T), a = ph * T;
      float sg = -0.4 + (3.2 + 3.4 * aS.z) * a + (fract(aS.x * 7.3) - 0.5) * 1.3, z = zFront(d) + sg, y0 = lipY, amp = 1.;
      if (uRare > 0.5 && fract(aS.x * 13.7 + aS.y * 5.3) < 0.24) {      // the crossing tide: the ridge's crest smokes too
        float sr = -crossS(d), win = (d - uCrossD) / 130.;
        z += sr; y0 = boreH(sr, d) - 0.1;
        amp = 0.6 * step(uCrossD + 3., d) * exp(-win * win) * smoothstep(-25., 5., uCrossD);
      }
      p = vec3(wallX(z) + d, y0 + 0.2 + mix(3. + 3.2 * fract(aS.z * 5.1), 2. + 2.3 * fract(aS.z * 5.1), uDim) * a - 0.75 * a * a, z);      // (by day it stands 5 or 6 m over the lip before it thins)
      float open = smoothstep(70., 170., zFront(d));      // (the day's heavier smoke is for the open river: over the gate basin it would bank up and hide the gate)
      size = mix(0.7, 2.9, ph) * (0.6 + 0.8 * aS.z) * mix(mix(1.15, 1.5, open), 1.35, uDim) * (1. + 0.45 * uHeavy); asp = mix(vec2(3.4, 0.7), vec2(2.3, 0.85), uDim); cls = 0.25; vP = ph;      // (by day wind-drawn sheets, not puffs)
      alpha = amp * smoothstep(0., 0.12, ph) * (1. - smoothstep(0.35, 1., ph)) * mix(mix(0.8, 1.5, open), 0.95, uDim) * mix(0.3, 1.25, smoothstep(0.3, 0.8, 0.5 + 0.5 * sin(d * 0.11 + uTime * 0.7 + 2. * sin(d * 0.037 - uTime * 0.3))));      // in gusts along the front
      alpha *= smoothstep(14., 60., zFront(d));      // (none of it across the gate: it lay over the arch and the portal as a pale band)
      alpha *= mix(0.46, 0.68, uDim);                // (a veil: the lip's own torn edge reads through it)
      if (uDim < 0.5) alpha = min(alpha, 0.3);       // (by day it is never opaque, so a sail behind the crest shows through it)
    } else if (kind < 1.7) {         // tongues of water torn up along the lip itself: they leap, lean and fall back, and break its line against the sky
      float T = 0.6 + 0.6 * aS.z, ph = fract(aS.x + uTime / T), up = sin(ph * 3.14159);
      float sg = -0.9 + 1.2 * ph + (fract(aS.x * 7.3) - 0.5), z = zFront(d) + sg;
      float big = aS.z * aS.z * aS.z, H = (0.9 + 1.3 * big) * (0.35 + 0.65 * up) * (1. + mix(0.5, 0.9, uDim) * uHeavy), wide = (1.6 + 2.6 * big) * (1. + 0.25 * uHeavy);
      float sel = fract(aS.x * 13.7 + aS.y * 5.3), foot = lipY - 0.3, amp = mix(0.95, 0.7, uDim);
      if (uRare > 0.5 && sel < 0.26) {            // the crossing tide: a quarter of them stand on the ridge's own crest
        float sr = -crossS(d), win = (d - uCrossD) / 130.;
        float rdg = step(uCrossD + 3., d) * exp(-win * win) * smoothstep(-25., 5., uCrossD);
        z = zFront(d) + sr + 0.5 * sg; foot = boreH(sr, d) - 0.35;
        amp *= 0.5 * smoothstep(0.25, 0.6, rdg); H *= 0.18 + 0.2 * rdg; wide *= 2.8;      // (a low torn fringe, not a row of peaks)
      } else if (uBurstK > 0.5 && sel > 0.9) {    // white water bursting along a hull as the lip goes under it
        float t = fract(aS.y * 9.7) * 2. - 1., sd = fract(aS.x * 3.1) < 0.5 ? -1. : 1.;
        vec2 hv = uBurst.zw, hn = normalize(vec2(-hv.y, hv.x) + vec2(1e-4, 0.));
        vec2 q = uBurst.xy + hv * t + hn * (sd * 2.3 * (1. - 0.6 * t * t));
        d = q.x - wallX(q.y); z = q.y;
        float sl = z - zFront(d);
        foot = boreH(sl, d) - 0.4; H *= 1.7; wide *= 1.2;
        amp = mix(0.8, 0.6, uDim) * exp(-sl * sl / 30.);
      }
      p = vec3(wallX(z) + d, foot + 0.5 * H, z);
      asp = vec2(wide, H); cls = 0.3;
      alpha = smoothstep(0., 0.15, ph) * (1. - smoothstep(0.75, 1., ph)) * amp * featherT / max(feather, 0.02);
    } else {                         // gouts and ropes of water thrown forward off the lip, falling down the face
      float T = 0.9 + 0.5 * aS.z, ph = fract(aS.x + uTime / T), a = ph * T;
      float sg = -0.5 - 1.7 * uHeavy - (2.2 + 4.2 * fract(aS.x * 3.7)) * a, z = zFront(d) + sg, vy = 1.2 + 3.6 * aS.z - 9.8 * a;
      p = vec3(wallX(z) + d, max(lipY + (1.2 + 3.6 * aS.z) * a - 4.9 * a * a, boreH(sg, d) + 0.1), z);
      cls = 1.; size = (0.1 + 0.27 * aS.z * aS.z) * (1. + 0.7 * uHeavy); asp = vec2(1., 1.1 + 0.6 * fract(aS.y * 9.3) + 0.8 * abs(vy) / 9.);
      alpha = smoothstep(0., 0.1, ph) * (1. - smoothstep(0.7, 1., ph)) * (0.5 + 0.5 * fract(aS.x * 5.1));
    }
  } else if (kind < 0.58) {                 // the plume: ballistic jets thrown up where the front meets the wall, trailing behind it
    float T = 3.7, ph = fract(aS.x + uTime / T), a = ph * T;
    cls = step(mix(0.24, 0.3, uDim), kind);      // half of them are bright ropes of water, the rest soft spray (by day there is less of that: it veils the gate)
    float up = (8. + 10.5 * aS.y) * uPlumeH;
    float ze = zp + uTrail * a * 0.8 + (aS.z - 0.5) * 10.;
    float side = (fract(aS.z * 7.31) - 0.6) * 6.5;
    float y = 2.2 + 3.2 * fract(aS.y * 5.7) + up * a - 4.9 * a * a;
    p = vec3(wallX(ze) + 3.4 + side * a, y, ze - (1.5 + 4. * fract(aS.x * 3.3)) * a);
    float alive = smoothstep(-0.5, 2., y) * uPlume, vy = up - 9.8 * a;
    if (uRare > 0.5 && fract(aS.x * 13.7) < 0.36) {     // the crossing tide: a burst where the two fronts meet
      float dx = max(uCrossD, 0.) + uTrail * a * 0.7, zc = zFront(dx) + uTrail * a * 0.8;
      float u2 = (5.5 + 8. * aS.y) * uPlumeH; y = 3.2 + u2 * a - 4.9 * a * a; vy = u2 - 9.8 * a;
      p = vec3(wallX(zc) + dx + (aS.z - 0.5) * 12. + side * a, y, zc + (fract(aS.z * 3.1) - 0.3) * 7.);
      alive = smoothstep(1.5, 3.5, y) * smoothstep(-20., 8., uCrossD) * (1. - smoothstep(0.5, 0.75, ph));
    }
    float born = smoothstep(0., 0.06, ph);
    if (cls > 0.5 && fract(aS.x * 9.1) < 0.5) { cls = 0.05; size = 1.6 + 2.4 * aS.z; alpha = born * (1. - smoothstep(0.6, 0.95, ph)) * alive * 0.9 * (1. - 0.25 * passed); own = 1.; }      // (drops)
    else if (cls > 0.5) { size = 0.42 + 0.7 * aS.z * aS.z; asp = vec2(1., 1.1 + 0.6 * fract(aS.y * 9.3) + 0.8 * abs(vy) / 9.); lean = clamp(side / (abs(vy) + 2.5), -0.7, 0.7) * sign(vy) * (mat3(modelViewMatrix) * vec3(1., 0., 0.)).x; alpha = born * (1. - smoothstep(0.6, 0.95, ph)) * alive * (0.55 + 0.45 * fract(aS.x * 5.1)) * (1. - 0.25 * passed); }
    else { size = mix(2., 5.5, ph) * (0.7 + 0.6 * aS.y) * mix(0.8, 1., uDim); asp = vec2(1., mix(2., 1., smoothstep(0., 0.6, ph))); alpha = born * (1. - smoothstep(0.5, 1., ph)) * alive * 0.5 * mix(0.2, 1., smoothstep(10., 70., zp)) * thinP; vP = passed; softP = 1.; }      // (thinner where the plume piles into the gate)
  } else if (kind < 0.63) {          // the leading sheet: a hard-edged crown of water at the very front of the plume
    float T = 2.7, ph = fract(aS.x + uTime / T), a = ph * T;
    float up = (11. + 6.5 * aS.y) * uPlumeH, y = max(up * a - 4.9 * a * a, 0.);
    float ze = zp - 2. + uTrail * a * 0.8 + (aS.z - 0.5) * 6.;
    p = vec3(wallX(ze) + 3. + 3. * fract(aS.z * 5.3), y * 0.5 + 2., ze);
    asp = vec2(5. + 6. * aS.y, y + 4.);
    alpha = smoothstep(0., 0.07, ph) * (1. - smoothstep(0.6, 1., ph)) * uPlume * 0.6 * (1. - 0.8 * passed); cls = 2.;
    lean = 0.27 * (mat3(modelViewMatrix) * vec3(0., 0., -1.)).x;      // it leans the way the wave runs
  } else if (kind < 0.68) {          // curtains of water falling back behind it
    float T = 4.3, ph = fract(aS.x + uTime / T), back = 5. + 34. * aS.y + ph * 9., z = zp + back;
    float top = (16. - 9. * aS.y) * uPlumeH;
    p = vec3(wallX(z) + 2.4 + 5. * fract(aS.z * 3.7), top * 0.5 + 1., z);
    asp = vec2(1.5 + 1.7 * aS.z, top);      // (a few strands each, never a broad sheet)
    alpha = sin(ph * 3.14159) * uPlume * 0.62 * mix(0.14, 1., smoothstep(10., 60., zp)) * exp(-back / 45.) * mix(step(0.5, fract(aS.z * 7.9)), 1., smoothstep(30., 70., z)); cls = 3.;      // (half as many across the gate's bastion)
    lean = 0.12 * (mat3(modelViewMatrix) * vec3(0., 0., -1.)).x;
  } else if (kind < 0.88) {          // spindrift torn off the crest, right across the river (far away it is the white thread's halo)
    float T = 1.9, ph = fract(aS.x + uTime / T), a = ph * T;
    float d = 5. + aS.y * aS.y * 2500.;
    float sg = -0.8 + 6.5 * a + (aS.z - 0.5) * 3., z = zFront(d) + sg;
    p = vec3(wallX(z) + d, boreH(sg, d) + 0.6 + 3.2 * a - 1.5 * a * a, z);
    float farK = smoothstep(200., 500., distance(p.xz, uCamL.xz));
    // by the place along the front the far line's smoke stands high here and low there and leans one way or the other
    vec4 un = textureLod(uNoise, vec2(d * 0.0037 + 0.31, 0.57 + uTime * 0.004), 1.);
    float tallP = 0.2 + 1.6 * smoothstep(0.3, 0.7, un.r);
    p.y += farK * (2.2 + 6.5 * aS.z) * a * tallP;      // (far off it is thrown higher: a lit crest of spray along the whole line)
    size = mix(1.5, 4.4, ph) * (0.6 + 0.8 * aS.z); grow = 1.; farTall = tallP; lean = farK * (un.a - 0.5) * 2.4;
    alpha = smoothstep(0., 0.1, ph) * (1. - smoothstep(0.4, 1., ph)) * 0.55 * (1. + 0.7 * farK);
    // (as the front comes into the gate basin it thins away, so no pale band lies across the arch; and beside
    // the wall it thins for an eye the plume has passed)
    alpha *= mix(0.1, 1., smoothstep(25., 110., zFront(d))) * (1. - 0.7 * passed * (1. - smoothstep(30., 90., d)));
  } else {                           // spray hanging along the wall after the plume has gone by
    float T = 9., ph = fract(aS.x + uTime / T), back = 8. + aS.y * 200., z = zp + back;
    p = vec3(wallX(z) + 2. + (aS.z - 0.6) * 15., 2. + 20. * fract(aS.z * 9.1) * fract(aS.z * 9.1) + 2.5 * ph, z + ph * 4.);      // (spread in height: no level band of it across the bastion)
    // (drops still in the air and thin torn wisps, not a hanging fog: seen along the wall the big soft sprites added up to a
    // white bank that hid the seawall, its parasols and the sky)
    p.y -= 2.2 * ph + 1.5 * ph * ph;
    size = 2.2 + 2.6 * aS.y; cls = 0.05;
    alpha = sin(ph * 3.14159) * mix(0.75, 0.6, uDim) * smoothstep(0., 60., zp) * exp(-back / 110.) * uPlume * (1. - 0.5 * passed);
  }
  vUv = position.xy; vA = vec4(alpha, aS.x * 7.7, aS.z * 5.3, cls);
  vSunV = normalize(mat3(modelViewMatrix) * uSunDir);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  float fd = -mvPosition.z;
  size *= mix(1., clamp(fd / 95., 1., 3.8), grow);
  asp.y *= 1. + 2.1 * farTall * smoothstep(200., 500., fd);      // (the far thread's smoke stands tall over it: from the first second the line on the horizon is a wall that is coming)
  if (kind >= 1.7 && kind < 2.) { vA.x *= mix(1.7, 1., smoothstep(20., 60., fd)); size *= mix(1.2, 1., smoothstep(25., 45., fd)); }      // (water thrown off the lip close by: a fringe that breaks its white line against the sky)
  // spray close to the eye thins to a veil (the ropes less than the mist, so the plume beside us is thrown water, not fog)
  float nearF = mix(abs(cls - 1.) < 0.5 ? 0.62 : 0.07, 1., smoothstep(uNearFade.x, uNearFade.y, fd)) * mix(1., 1. + 0.9 * smoothstep(120., 400., fd), grow);
  // (the feather keeps its strength to within a few boat lengths, so the wall that comes at us smokes along its whole lip)
  // (the lip's veil thins with distance: far off it would lie milky over the sails behind the crest)
  if (own > 0.5) vA.x *= smoothstep(5., 14., fd);
  else vA.x *= kind >= 1. ? inW * feather * (cls > 0.5 ? smoothstep(3.5, 12., fd) : cls > 0.28 ? smoothstep(3., 9., fd) : smoothstep(3., 10., fd) * ride * (1. - mix(0.8, 0.6, uDim) * smoothstep(mix(35., 45., uDim), mix(90., 110., uDim), fd))) * (1. - smoothstep(150., 260., fd)) : nearF * (cls > 2.5 ? 0.45 * smoothstep(60., 140., fd) : 1.) * (abs(cls - 1.) < 0.5 ? smoothstep(7., 30., fd) : 1.) * (abs(cls - 2.) < 0.5 ? smoothstep(25., 90., fd) : 1.);      // (and the leading sheets, each as broad as a house, close into a white veil when seen from near and along the wall: they are for the far view too)      // (falling strands and ropes right beside the eye are blurred streaks: they are for the middle distance)
  // (the plume's soft spray is for the far view, where it gives the column its body. Within a hundred metres its hundreds of
  // sprites, seen one behind the other, closed into a white bank: there the column is its ropes of water)
  vA.x *= 1. - softP * mix(mix(0.66, 0.54, uDim), 0.16, uLow) * (1. - smoothstep(45., 150., fd));      // (the column keeps some body beside the eye, and more of it under a low sun, where it stands against the bright sky)
  vec2 quad = position.xy * size * asp; quad.x += lean * quad.y;
  mvPosition.xy += quad;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,qt=`
uniform sampler2D uNoise; uniform vec3 uFoam, uSunCol, uSkyAmb; uniform float uTime, uDim, uLow;
varying vec2 vUv; varying vec4 vA; varying vec3 vSunV; varying float vP;
#include <common>
#include <fog_pars_fragment>
void main(){
  float r = length(vUv) * 2., a, lum, cls = vA.w;
  vec3 nn = normalize(vec3(vUv * 2., 0.75));
  float sh = clamp(dot(nn, vSunV) * 0.5 + 0.5, 0., 1.);
  float fw = clamp(-vSunV.z, 0., 1.); fw = fw * fw * fw;                // the sun behind the water: it lights up
  float n = texture2D(uNoise, vUv * vec2(0.8, 0.3) + vA.yz + vec2(0., uTime * 0.03)).a * 0.65 + texture2D(uNoise, vUv * vec2(2.4, 0.9) + vA.zy).a * 0.35;
  float ax = abs(vUv.x), rim = 0., core = 0.;
  float px = clamp(max(fwidth(vUv.x), fwidth(vUv.y)), 1e-4, 1.);      // how much of the sprite one pixel is (taken here, before any branch)
  if (cls > 2.5) {                   // water falling back behind the plume: four or five separate strands, each begun at its own
    // height and broken into lengths that fall, with air between them. Each strand is drawn from its own centre line and is
    // never thinner than a pixel (it fades instead), so from any distance it is strands or nothing, never a pale box.
    float bx = vUv.x + 0.05 * sin(vUv.y * 5. + vA.y * 6.283) + 0.1 * (n - 0.5);
    float cell = bx * 3. + vA.y * 3.1, id = floor(cell), fx = fract(cell) - 0.5;
    vec4 hr = textureLod(uNoise, vec2(id * 0.137 + vA.z, vA.y * 0.71), 0.);
    float h1 = clamp((hr.r - 0.25) * 2., 0., 1.), h2 = clamp((hr.a - 0.25) * 2., 0., 1.);
    float wn = mix(0.06, 0.16, h2), hw = max(wn, px * 3.3);
    float strand = (1. - smoothstep(hw * 0.5, hw, abs(fx - (h1 - 0.5) * 0.6 - 0.28 * sin(vUv.y * (6. + 7. * h2) + hr.g * 25.)))) * min(wn / hw, 1.);      // (each strand wanders on its own, so they are never pin-stripes)
    float bead = textureLod(uNoise, vec2(id * 0.31 + vA.z, vUv.y * 0.9 + uTime * 0.55 + vA.y), log2(max(px * 230., 1.))).a;
    float top = 0.5 - 0.42 * h2;
    a = vA.x * strand * smoothstep(0.47, 0.57, bead + 0.12 * (h1 - 0.5)) * (1. - smoothstep(0.32, 0.5, ax)) * smoothstep(-0.5, -0.38, vUv.y) * (1. - smoothstep(top - 0.14, top, vUv.y));
    lum = mix(0.85, 1.35, smoothstep(0.45, 0.7, bead));
  } else if (cls > 1.5) {            // the leading sheet: a sharp, sun-rimmed crown; torn open lower down
    float fine = textureLod(uNoise, vec2(vUv.x * 5.3 + vA.z, vUv.y * 1.1 + vA.y - uTime * 0.3), log2(max(px * 1350., 1.))).r;
    float crown = 0.5 - 0.4 * (textureLod(uNoise, vec2(vUv.x * 0.8 + vA.y, vA.z), 0.).a * 0.62 + textureLod(uNoise, vec2(vUv.x * 2.4 + vA.z, vA.y), log2(max(px * 610., 1.))).r * 0.38) - 0.9 * vUv.x * vUv.x;
    float below = crown - vUv.y + 0.07 * (fine - 0.5);
    rim = 1. - smoothstep(0., 0.09, below);
    a = vA.x * smoothstep(0., 0.05, below) * smoothstep(0.38, 0.58, n * 0.7 + fine * 0.3 + 0.26 * (1. - smoothstep(0., 0.4, below))) * (1. - smoothstep(0.3, 0.5, ax)) * smoothstep(-0.5, -0.3, vUv.y);
    lum = 0.9 + 0.3 * n + 0.8 * rim;
  } else if (cls > 0.5) {            // a rope of water: bright core, soft ends
    // (large in the frame it is a hard bright core that tapers to both ends and is broken here and there, in a faint halo of
    // drops, never a soft ellipse)
    // (the core is a thin thread and the halo a faint mist)
    float halo = (1. - smoothstep(0.15, 1., length(vec2(vUv.x * 3.1, vUv.y * 2.)))) * smoothstep(-0.5, -0.12, vUv.y);
    float ty = 1. - smoothstep(0.05, 0.5, abs(vUv.y)), hw = max((0.02 + 0.07 * ty) * (0.35 + 0.65 * ty), px * 1.2);
    float bend = (fract(vA.y * 3.7) - 0.5) * 1.1 * (vUv.y * vUv.y - 0.08) + 0.07 * (n - 0.5);                      // (bent, each its own way, and broken into lengths: straight and whole they crossed like straws)
    float bead = textureLod(uNoise, vec2(vA.y * 0.61, vUv.y * 1.5 + vA.z), log2(max(px * 380., 1.))).a;
    float coreR = (1. - smoothstep(hw * 0.15, hw * 1.3, abs(vUv.x - bend))) * smoothstep(0.36, 0.62, bead + 0.14 * ty) * ty;
    a = vA.x * mix(halo, max(coreR, 0.16 * halo), 1. - smoothstep(0.07, 0.2, px)); lum = mix(1.5, 1.9, uLow);
  } else if (cls > 0.28) {           // water torn up off the lip: a ragged, many-peaked crown, streaky inside, bright along its torn edge
    float yy = vUv.y + 0.5;
    float pk = textureLod(uNoise, vec2(vUv.x * 0.9 + vA.y, vA.z), 0.).a * 0.62 + textureLod(uNoise, vec2(vUv.x * 3.3 + vA.z, vA.y), log2(max(px * 840., 1.))).r * 0.3 + textureLod(uNoise, vec2(vUv.x * 9. + vA.y * 3., vA.z * 2.), log2(max(px * 2300., 1.))).a * 0.08;
    float fine = textureLod(uNoise, vec2(vUv.x * 6.1 + vA.z, vUv.y * 1.3 + vA.y - uTime * 0.35), log2(max(px * 1560., 1.))).r;
    float below = (0.12 + 0.88 * smoothstep(0.2, 0.8, pk)) * (1. - 4. * vUv.x * vUv.x) - yy + 0.1 * (fine - 0.5);
    float strand = textureLod(uNoise, vec2(vUv.x * 2.3 + vA.y, vUv.y * 0.5 + vA.z - uTime * 0.2), log2(max(px * 590., 1.))).a;
    // (thrown water, not a sheet: strands with air between them, thinning to nothing at the foot)
    a = vA.x * smoothstep(0., 0.34, below) * smoothstep(0.38, 0.6, strand * 0.5 + fine * 0.2 + n * 0.3 + 0.13 * smoothstep(0., 0.4, below)) * smoothstep(-0.5, -0.2, vUv.y);
    rim = (1. - smoothstep(0.05, 0.3, below)) * smoothstep(0., 0.12, below);
    lum = (0.85 + 0.3 * strand + 0.4 * rim) * mix(1.4, 1., uDim); core = smoothstep(0., 0.4, below);
  } else if (cls > 0.02 && cls < 0.1) {      // drops still in the air where the plume has been: short falling streaks and beads with air between them
    // (every drop is drawn as a drop, a bead drawn out by its fall, large ones and a finer rain between them, each in a cell
    // of its own)
    // (no two sprites share a lattice: each has its own shear and is bent by the noise, and every drop sits off-centre in its cell)
    vec2 uvd = vUv + vec2(vUv.y * (fract(vA.y * 1.7) - 0.5) * 0.8 + 0.1 * (n - 0.5), 0.07 * (n - 0.5));
    vec2 g1 = vec2(uvd.x * 6. + vA.y * 13., uvd.y * 3.5 + vA.z * 7. + uTime * 0.55), i1 = floor(g1), f1 = fract(g1) - 0.5;
    vec4 h1 = textureLod(uNoise, i1 * vec2(0.137, 0.291) + vA.zy, 0.);
    float r1 = 0.05 + 0.13 * clamp((h1.b - 0.3) * 2., 0., 1.);
    float dA = step(0.58, h1.a) * (1. - smoothstep(r1 * 0.5, r1, length((f1 - clamp((h1.rg - 0.5) * 1.6, -0.3, 0.3) * vec2(1., 0.6)) * vec2(1., 0.55))));
    vec2 g2 = vec2(uvd.x * 15. + vA.z * 9., uvd.y * 8. + vA.y * 5. + uTime * 1.0), i2 = floor(g2), f2 = fract(g2) - 0.5;
    vec4 h2 = textureLod(uNoise, i2 * vec2(0.173, 0.319) + vA.yz, 0.);
    float r2 = 0.05 + 0.08 * clamp((h2.b - 0.3) * 2., 0., 1.);
    float dB = step(0.6, h2.a) * (1. - smoothstep(r2 * 0.5, r2, length((f2 - clamp((h2.rg - 0.5) * 1.6, -0.3, 0.3) * vec2(1., 0.6)) * vec2(1., 0.55))));
    float fA = smoothstep(0.012, 0.035, px), fB = smoothstep(0.004, 0.012, px);      // (far off, where a drop is less than a pixel, it goes out: a faint even haze is all that is left)
    float pat = max(max(dA * (1. - fA), 0.75 * dB * (1. - fB)), 0.05 * fA);
    a = vA.x * (1. - smoothstep(0.45, 1., r)) * pat; lum = 1.3; core = 1.;
  } else {                           // torn spray: streaky erosion, thicker parts brighter
    // (the plume's soft spray is more torn by day, and most of all for an eye it has passed: vP)
    float vq = cls < 0.02 ? vP : 0., tq = cls < 0.02 ? 0.07 * (1. - uDim) : 0.;
    float e = smoothstep(0.3 + tq + 0.14 * vq, 0.6 + tq + 0.08 * vq, n + (1. - r) * 0.36 * (1. - 0.45 * vq));
    a = vA.x * (1. - smoothstep(0.35, 1., r)) * e; lum = (0.72 + 0.4 * e * n) * (cls > 0.1 ? 1.45 : 1.);
    core = clamp(1.4 * (1. - r), 0., 1.) * e;
    a *= 1. - 0.6 * fw * uDim * (1. - 0.5 * uLow);                      // soft spray against a low sun or the moon: a thin bright veil, not a bank
    if (cls > 0.2) a *= mix(smoothstep(0.35, 0.65, n), 1., uDim);        // (by day the lip's veil is torn wisps, and a sail behind the crest shows through it)
  }
  if (a < 0.004) discard;
  a = min(a, 1.);
  // (by day the sun stands behind the wall as it comes: its spindrift and tongues scatter the light forward and glow brighter than
  // the sky behind them, or white on white they would be lost)
  // The lip's spindrift by day is a veil, not a row of lit puffs: where it leaves the lip it is in the wave's own shade
  // (blue-grey, so it shows against a pale sky and white cumulus), and it takes the light as it rises and thins. Water thrown
  // up in tongues is glass at its heart and white along its torn edge.
  float day = 1. - uDim, fwd = 0.55 + 0.6 * rim, shd = sh; vec3 under = vec3(0.68, 0.79, 0.93);
  if (cls < 0.2) fwd = 0.4 + 0.5 * day * (0.5 + 0.5 * core);
  else if (cls < 0.28) { fwd = 0.4 + day * mix(1.4, 0.9, core); under = mix(mix(under, vec3(0.26, 0.42, 0.56), day), vec3(0.5, 0.42, 0.4), uLow);      // (the veil has a shade of its own in every light, so it shows against the sky and does not lie milky on a sail)
    shd = mix(sh, smoothstep(0.04, 0.42, vP + 0.3 * (n - 0.5)), 0.8 * day); }
  else if (cls < 0.5) { fwd = 0.4 + 1.35 * day * (0.5 + 0.5 * core) + 0.3 * rim; under = mix(under, vec3(0.7, 0.85, 0.92), day * 0.8); shd = mix(sh, 1. - 0.5 * core * (1. - rim), 0.7 * day); }      // (thrown water against a bright sky is brighter than it: the tongues have no dark heart)
  gl_FragColor = vec4(uFoam * lum * mix(under, vec3(1.), shd) * (uSkyAmb * 1.9 + uSunCol * (0.12 + 0.86 * sh * sh + fwd * fw)), a);
  #include <fog_fragment>
}`,mo=`
attribute vec4 aT;
uniform sampler2D uNoise; uniform vec4 uLampR[8];
varying vec3 vUv; varying vec4 vA; varying vec3 vW;
#include <common>
#include <fog_pars_vertex>
${Ee}
${_e}
${He}
void main(){
  float d = aT.x, r1 = aT.y, r2 = aT.z, kind = step(0.45, aT.w);            // 0: a veil carried back, 1: a crown
  float zf0 = zFront(d), x0 = wallX(zf0) + d;
  float y0 = boreH(-0.25, d) + crestRag(x0) * smoothstep(3., 9., d);
  float gust = smoothstep(0.38, 0.56, textureLod(uNoise, vec2(x0 * 0.013 + 0.9, uTime * 0.02 + 0.4), 2.).r);
  float H = 0.35 + 0.6 * r2 + 0.25 * gust;
  float s0 = mix(0.1 + 0.6 * r2, -0.5 + 0.9 * r1, kind), vs = mix(3.4 + 3. * r1, 0.3 + 1.1 * r2, kind);
  float vy = mix(0.9 + 1.2 * r2, sqrt(19.6 * H), kind), g = mix(1.8, 9.8, kind);
  float T = mix(1.3 + 0.8 * r1, 2. * vy / 9.8 + 0.08, kind), Tc = T + 0.25 + 0.9 * fract(r1 * 7.7 + r2 * 3.1);
  float a = fract(r1 * 7.31 + r2 * 3.7 + aT.w * 5.3 + uTime / Tc) * Tc;
  float aw = max(a - mix(0.55, 0.3, kind) * (1. - position.y), 0.);
  float wide = mix(1.6 + 2.2 * r2, 0.5 + 1.1 * r1, kind) * (0.45 + 0.55 * smoothstep(0., 0.3, aw));
  float sP = s0 + vs * aw, yP = y0 + mix(0.15, -0.1, kind) + vy * aw - 0.5 * g * aw * aw;
  vec2 t2 = normalize(vec2(vs, vy - g * aw) + vec2(1e-4, 0.)), n2 = vec2(-t2.y, t2.x);
  float dd = d, across = position.x;
  if (position.z < 0.5) dd += across * wide; else { sP += n2.x * across * mix(0.5, 0.42, kind); yP += n2.y * across * mix(0.5, 0.42, kind); }
  float z = zFront(dd) + sP;
  vec3 wp = vec3(wallX(z) + dd, yP, z);
  float alpha = step(a, T) * smoothstep(0., 0.1, a) * (1. - smoothstep(0.7 * T, T, a)) * mix(0.3, 1., gust) * smoothstep(6., 13., d) * ridGap(d);
  alpha *= mix(0.42 * smoothstep(14., 60., zf0), 0.9, kind);      // (no veil drifts across the gate arch once the front is in the basin)
  float lamp = 0.;
  for (int i = 0; i < 8; i++) { vec2 dL = wp.xz - uLampR[i].xy; lamp += uLampR[i].z / (1. + dot(dL, dL) * 0.02); }
  vUv = vec3(position.x, position.y, kind); vA = vec4(alpha, r1 * 9.1 + aT.w, r2 * 7.3, min(lamp, 1.2)); vW = wp;
  if (alpha < 0.004) wp.y = -40.;
  vec4 mvPosition = modelViewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,co=`
uniform sampler2D uNoise; uniform vec3 uFoam, uJade, uSunDir, uSunCol, uSkyAmb, uCamL, uLampC; uniform float uTime, uDim, uLow;
varying vec3 vUv; varying vec4 vA; varying vec3 vW;
#include <common>
#include <fog_pars_fragment>
void main(){
  float x = vUv.x, y = vUv.y, kind = vUv.z;
  float n1 = texture2D(uNoise, vec2(x * 0.9 + vA.y, y * 0.32 + vA.z - uTime * 0.15)).a, n2 = texture2D(uNoise, vec2(x * 2.6 + vA.z, y * 0.9 + vA.y - uTime * 0.3)).r;
  float n = n1 * 0.62 + n2 * 0.38;
  float edge = (1. - smoothstep(0.2, 0.5, abs(x))) * smoothstep(0., 0.12, y) * (1. - smoothstep(0.82, 1., y));
  float core = (1. - smoothstep(0.02, 0.3, abs(x))) * smoothstep(0.1, 0.5, y);
  // a veil is torn spray, thin everywhere; a crown is streaks of water that come apart into beads toward its head
  float thr = mix(0.5, mix(0.4, 0.56, smoothstep(0.45, 0.95, y)), kind) - 0.12 * core;
  float body = smoothstep(thr, thr + mix(0.16, 0.06, kind), n) * edge;
  float al = vA.x * body;
  if (al < 0.004) discard;
  vec3 V = normalize(uCamL - vW);
  float back = max(dot(-V, uSunDir), 0.), fw = back * back * back;
  float day = 1. - uDim, thick = smoothstep(thr + 0.03, thr + 0.22, n) * (0.5 + 0.5 * core);
  vec3 shade = mix(vec3(0.72, 0.82, 0.95), mix(vec3(0.42, 0.56, 0.7), vec3(0.6, 0.5, 0.46), uLow), day);      // (by day it has a shade of its own against a pale sky)
  vec3 col = uFoam * mix(shade, vec3(1.), mix(thick, 0.35 + 0.65 * thick, kind)) * (uSkyAmb * 2.1 + uSunCol * (0.2 + 0.5 * thick + mix(0.9, 0.5, uLow) * fw));
  col += uJade * uSunCol * (1. - thick) * kind * 0.22 * (1. - uLow);      // thin water is green
  col += uFoam * uLampC * vA.w * 0.7;
  gl_FragColor = vec4(col, min(al, 1.));
  #include <fog_fragment>
}`;function po(e,a){const v=[],u=[];for(let f=0;f<2;f++){const o=v.length/3;for(let t=0;t<=3;t++)v.push(-.5,t/3,f,.5,t/3,f);for(let t=0;t<3;t++){const s=o+t*2;u.push(s,s+1,s+2,s+1,s+3,s+2)}}const h=new Float32Array(e*4);for(let f=0;f<e;f++)h[f*4]=6+2494*a(),h[f*4+1]=a(),h[f*4+2]=a(),h[f*4+3]=a();const n=new y.InstancedBufferGeometry;return n.setAttribute("position",new y.Float32BufferAttribute(v,3)),n.setIndex(u),n.setAttribute("aT",new y.InstancedBufferAttribute(h,4)),n.instanceCount=e,n.boundingSphere=new y.Sphere(new y.Vector3,1e5),n}const vo=`
attribute vec3 aPos; attribute vec4 aRnd; attribute vec3 aCol; attribute float aPart;
uniform float uTime, uBoreZ, uLead, uPlume;
varying vec3 vCol; varying vec3 vNl; varying vec3 vLoc; varying float vPart;
#include <common>
#include <fog_pars_vertex>
void main(){
  float sc = 0.82 + 0.36 * aRnd.z, dz = aPos.z - (uBoreZ - uLead);
  float duck = uPlume * exp(-dz * dz / (dz > 0. ? 3000. : 420.));
  // (and harder still round each point where the bore strikes the wall, from the moment its column comes over the parapet until
  // the front has run 80 m on: the same strike points, every ${Ge} m of wall, as the columns themselves. Dk: how far the tongue
  // that runs ahead of the wave has passed the point)
  float zk = floor(aPos.z / ${M(Ge)} + 0.5) * ${M(Ge)}, Dk = zk - (uBoreZ - uLead) + ${M(mt)};
  float hit = uPlume * step(20., zk) * smoothstep(6., 16., Dk) * (1. - smoothstep(50., 100., Dk)) * exp(-(aPos.z - zk) * (aPos.z - zk) / 150.);
  duck = max(duck * 0.7, hit * (0.9 + 0.4 * aRnd.x));
  float look = sin(uTime * (0.6 + aRnd.y) + aRnd.y * 40.) + 2.2 * hit * sin(uTime * 7. + aRnd.y * 60.) * 0.3;
  vec3 p = position, n = normal;
  if (aPart < 0.5) {                 // the parasol tips toward the river when the spray comes
    float tilt = duck * (0.75 + 0.4 * aRnd.x) + 0.1 * look + 0.12 * (aRnd.w - 0.3), c = cos(tilt), s = sin(tilt);
    p.y -= 1.2; p = vec3(p.x * c + p.y * s, p.y * c - p.x * s, p.z); p.y += 1.2 - 0.25 * duck;
    n = vec3(n.x * c + n.y * s, n.y * c - n.x * s, n.z);
    vCol = aCol;
  } else {
    p.y *= 1. - 0.16 * duck; p.x += 0.05 * look * p.y;
    vCol = aPart > 1.5 ? vec3(0.02, 0.016, 0.014) : aRnd.w < 0.4 ? vec3(0.04, 0.06, 0.13) : aRnd.w < 0.72 ? vec3(0.46, 0.44, 0.38) : aRnd.w < 0.88 ? vec3(0.2, 0.1, 0.06) : vec3(0.12, 0.2, 0.17);
  }
  float yaw = aRnd.y * 6.283, cy = cos(yaw), sy = sin(yaw);
  if (aPart > 0.5) { p.xz = vec2(p.x * cy + p.z * sy, p.z * cy - p.x * sy); n.xz = vec2(n.x * cy + n.z * sy, n.z * cy - n.x * sy); }
  vLoc = position; vNl = n; vPart = aPart;
  vec4 mvPosition = modelViewMatrix * vec4(aPos + p * sc, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,wo=`
uniform vec3 uLampP;
varying vec3 vCol; varying vec3 vNl; varying vec3 vLoc; varying float vPart;
#include <common>
#include <fog_pars_fragment>
${vt}
void main(){
  vec3 n = normalize(vNl), alb = vCol;
  vec3 col;
  if (vPart < 0.5) {                 // oiled paper: ribs, a dark rim and a cap; glows a little whichever side the sun is on
    float rr = length(vLoc.xz), ang = atan(vLoc.z, vLoc.x + 1e-4);
    float rib = abs(fract(ang * 1.9099) - 0.5) * 2.;
    alb *= mix(0.62, 1., smoothstep(0.08, 0.3, rib)) * (1. - 0.4 * smoothstep(0.86, 0.97, rr)) * (1. - 0.5 * (1. - smoothstep(0.08, 0.16, rr)));
    col = lit(alb, n, 0.6, 1.) + alb * uSunCol * 0.2 + alb * uLampP * (0.55 + 0.45 * smoothstep(0.2, 0.9, rr));      // (and by lantern light the oiled paper glows from below)
  } else col = lit(alb, n, 0.4, 0.8);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,xo=`
attribute vec3 aPos; attribute vec4 aRnd; attribute vec3 aCol; attribute float aPart;
uniform float uTime, uBoreZ, uLead, uPlume; uniform vec2 uWind;
varying vec3 vCol; varying vec3 vNl; varying vec3 vUvP;
#include <common>
#include <fog_pars_vertex>
void main(){
  float H = aRnd.x, dz = aPos.z - (uBoreZ - uLead);
  float zk = floor(aPos.z / ${M(Ge)} + 0.5) * ${M(Ge)}, Dk = zk - (uBoreZ - uLead) + ${M(mt)};      // (the strike point nearest this pole: its column whips the silk)
  float hit = uPlume * step(20., zk) * smoothstep(4., 14., Dk) * (1. - smoothstep(46., 96., Dk)) * exp(-(aPos.z - zk) * (aPos.z - zk) / 200.);
  float gust = 1. + 1.6 * uPlume * exp(-dz * dz / 1800.) + 1.3 * hit + 0.3 * sin(uTime * 0.8 + aRnd.y * 20.);
  vec3 p, n;
  if (aPart < 0.5) { p = vec3(position.x, position.y * H, position.z); n = normal; vCol = vec3(0.1, 0.055, 0.035); vUvP = vec3(0., 0., 0.); }
  else {
    float u = position.x, v = position.y, ph = aRnd.y * 30.;
    float len = aRnd.z, hoist = aRnd.w;
    float w = sin(u * 5.2 - uTime * 6.4 + ph + v * 1.3) * 0.3 * u + sin(u * 11. - uTime * 9.5 + ph * 1.7 + v * 3.) * 0.09 * u;
    float dw = cos(u * 5.2 - uTime * 6.4 + ph + v * 1.3) * 1.56 * u + sin(u * 5.2 - uTime * 6.4 + ph + v * 1.3) * 0.3;
    w *= gust; dw *= gust;
    float wa = (aRnd.y - 0.5) * 0.7 + 0.12 * sin(uTime * 0.5 + ph), wc = cos(wa), ws = sin(wa);
    vec2 dir = vec2(uWind.x * wc - uWind.y * ws, uWind.x * ws + uWind.y * wc), perp = vec2(-dir.y, dir.x);
    vec2 xz = dir * (0.12 + u * len * (1. - 0.12 * abs(w))) + perp * w * len * 0.62;
    p = vec3(xz.x, H - 0.25 - v * hoist * (1. - 0.6 * u) - u * u * 0.5 * (1.3 - 0.3 * gust) + sin(u * 7. - uTime * 7.3 + ph) * 0.14 * u, xz.y);
    n = normalize(vec3(perp.x, 0., perp.y) - vec3(dir.x, 0., dir.y) * dw * 0.62);
    vCol = aCol; vUvP = vec3(u, v, 1.);
  }
  vNl = n;
  vec4 mvPosition = modelViewMatrix * vec4(aPos + p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,go=`
uniform vec3 uGold;
varying vec3 vCol; varying vec3 vNl; varying vec3 vUvP;
#include <common>
#include <fog_pars_fragment>
${vt}
void main(){
  vec3 n = normalize(vNl), alb = vCol, col;
  if (vUvP.z > 0.5) {                // silk: a gold border and tail band, lit from both sides, a little light coming through
    float bd = max(smoothstep(0.9, 0.94, abs(vUvP.y * 2. - 1.)), 1. - smoothstep(0.015, 0.035, vUvP.x));
    bd = max(bd, smoothstep(0.83, 0.86, vUvP.x) * (1. - smoothstep(0.9, 0.93, vUvP.x)));
    alb = mix(alb, uGold, bd * 0.85);
    float ndl = abs(dot(n, uSunDir));
    col = alb * (uSunCol * (0.22 + 0.78 * ndl * ndl) + uSkyAmb * 1.6);
  } else col = lit(alb, n, 0.3, 1.);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,yo=`
attribute vec3 aPos; attribute vec3 aScl; attribute vec3 aCol;
uniform sampler2D uNoise; uniform float uTime;
varying vec3 vCol; varying vec3 vNl; varying vec3 vObj; varying vec3 vLp;
#include <common>
#include <fog_pars_vertex>
void main(){
  float c = cos(aScl.z), s = sin(aScl.z);
  float lump = textureLod(uNoise, position.xz * 0.37 + position.y * 0.21 + aScl.z, 0.).r;
  vec3 q = position * (0.74 + 0.52 * lump); q.y = max(q.y, -0.55);
  vec3 p = vec3(q.x * c + q.z * s, q.y, q.z * c - q.x * s) * vec3(aScl.x, aScl.y, aScl.x);
  float sway = sin(uTime * 1.3 + aPos.x * 0.21 + aPos.z * 0.17 + p.y * 0.6) + 0.5 * sin(uTime * 2.9 + aPos.z * 0.4 + p.x);
  p.xz += vec2(0.16, 0.1) * sway * (0.4 + 0.3 * q.y);
  vNl = normalize(vec3(position.x * c + position.z * s, position.y * 1.15 + 0.2, position.z * c - position.x * s));
  vObj = q * aScl.x + aScl.z * 3.; vCol = aCol; vLp = aPos + p;
  vec4 mvPosition = modelViewMatrix * vec4(vLp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,bo=`
uniform sampler2D uNoise; uniform vec3 uCamL;
varying vec3 vCol; varying vec3 vNl; varying vec3 vObj; varying vec3 vLp;
#include <common>
#include <fog_pars_fragment>
${vt}
void main(){
  vec2 gr = texture2D(uNoise, vObj.xy * 0.13 + vObj.z * 0.09).gb - 0.5;
  vec3 n = normalize(vNl + vec3(gr.x, gr.y * 0.6, gr.y) * 2.2), V = normalize(uCamL - vLp);
  float l1 = texture2D(uNoise, vObj.xy * 0.33 + vObj.z * 0.21).a, l2 = texture2D(uNoise, vObj.zy * 1.25 + vObj.x * 0.7).r;
  float leaf = l1 * 0.55 + l2 * 0.45, fac = dot(normalize(vNl), V);
  if (fac < 0.44 && texture2D(uNoise, vObj.xy * 0.8 + vObj.z * 0.55).r > 0.27 + fac * 1.25) discard;   // ragged, leafy outline
  vec3 alb = vCol * (0.74 + 0.5 * leaf) * mix(vec3(0.66, 0.5, 0.3), vec3(1.), smoothstep(0.26, 0.5, leaf));   // gaps between sprays of leaves
  float ao = 0.3 + 0.7 * smoothstep(-0.8, 0.7, n.y);
  vec3 col = lit(alb, n, 0.55, ao);
  float back = clamp(dot(V, -uSunDir) * 0.5 + 0.5, 0., 1.);
  col += alb * uSunCol * 0.5 * back * back * (0.4 + 0.6 * leaf);                  // sun through the fans
  col += vCol * uSunCol * 0.14 * smoothstep(0.62, 0.8, l2) * max(dot(n, uSunDir), 0.);   // glints
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,ko=`
attribute vec4 aS;
uniform float uTime; uniform vec2 uWind; uniform vec3 uCamL, uSunDir, uSunCol, uSkyAmb, uLeaf;
varying vec3 vCol;
#include <common>
#include <fog_pars_vertex>
void main(){
  float ph = fract(aS.y + uTime / 44.), a = uTime * (1.6 + 2.6 * aS.w) + aS.w * 50.;
  vec3 c = vec3(aS.x + sin(uTime * 0.6 + aS.w * 31.) * 2.2, 66. * (1. - ph) + 0.6, aS.z + cos(uTime * 0.47 + aS.w * 17.) * 1.8);
  c.xz += uWind * ph * vec2(60., 60.) * (0.5 + aS.w);
  vec3 r = normalize(vec3(cos(a), 0.4 * sin(1.3 * a), sin(a))), up = normalize(cross(r, vec3(sin(0.7 * a), cos(0.7 * a), 0.3)) + vec3(0., 1e-3, 0.));
  float size = max(0.24, length(uCamL - c) * 0.0024);
  vec3 p = c + (r * position.x + up * position.y) * size;
  vec3 n = cross(r, up);
  vCol = uLeaf * (0.8 + 0.4 * aS.w) * (uSunCol * (0.35 + 0.65 * abs(dot(n, uSunDir))) + uSkyAmb * 1.6) * smoothstep(0., 0.04, ph) * 1.;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,zo=`
varying vec3 vCol;
#include <common>
#include <fog_pars_fragment>
void main(){
  gl_FragColor = vec4(vCol, 1.);
  #include <fog_fragment>
}`;function Ne(e){return e.uniforms={...y.UniformsUtils.clone(y.UniformsLib.fog),...e.uniforms},e.fog=!0,new y.ShaderMaterial(e)}const So=["#2a7f6e","#8ad8b6","#f3f0e4","#b59a63","#8d897c","#e6b422","#b52e25","#3c4a4b","#cfe0ea"],tt={day:{sunDir:[-.6,.7,.4],sunColor:"#fff1d6",sunIntensity:3,sky:[.52,.59,.79],ground:[.156,.175,.133],zenith:"#3f78c9",horizon:"#cfe2f2"},golden:{sunDir:[-.74,.34,.45],sunColor:"#ffb070",sunIntensity:2.6,sky:[.31,.3,.42],ground:[.04,.033,.05],zenith:"#2b2a5e",horizon:"#f0a070"},night:{sunDir:[-.6,.7,.4],sunColor:"#8fa8ff",sunIntensity:.5,sky:[.1,.1,.11],ground:[.003,.005,.009],zenith:"#03050d",horizon:"#101a33"}};tt.dawn=tt.golden;async function Fo(e,a={}){const p=e.rng,v=e.noise,u=e.vary||{},h=p.pick(["silt","jade","festival"]),n=p.range(.75,1),f=p.range(0,6.283),o=["jade","silt","festival"].includes(a.look)?a.look:h,t=Se(a.season??n,0,1),s=Se(a.density??u.density??1,.6,1.4),r=a.hour??u.hour,m=tt[r]?r:"day",l=a.rare??!!u.rare,w=e.quality?.detail??1,c=So.map((T,E)=>new y.Color(a.palette&&a.palette[E]||T)),b=T=>new y.Color(T),g=c[0].clone(),D=c[2].clone(),B=c[5].clone(),q=c[1].clone();let A=.35;o==="silt"&&(A=.55,g.lerp(c[3],.12),D.lerp(c[3],.1),B.lerp(b("#d98a1c"),.45),q.lerp(b("#e2b45c"),.3).multiplyScalar(.62)),o==="festival"&&(A=.2,g.lerp(b("#1d6f86"),.5));const k={stone:c[4].clone(),stoneLight:c[4].clone().multiplyScalar(1.2),stonePale:c[4].clone().lerp(b("#ffffff"),.32),rubble:c[4].clone().multiplyScalar(.55),paving:c[4].clone().lerp(c[3],.3).multiplyScalar(1.1),grass:b("#58703d").lerp(B,.08),tile:c[7].clone().multiplyScalar(1.25),tileEdge:c[7].clone().lerp(b("#b9c4bb"),.6),tileGreen:b("#2f5f52"),timber:c[6].clone().multiplyScalar(.95),timberDark:b("#5a2419"),plaster:b("#e3d4b2"),bracket:b("#2c5953"),opening:b("#1c1310"),gold:b("#e3b341").multiplyScalar(1.3),rock:b("#6f6c66"),rockWarm:b("#9a8566"),moss:b("#5d6a3a"),wetRock:b("#2c3430"),litter:B.clone().multiplyScalar(.62).lerp(b("#7a6a2c"),.25)},S={...tt[m],...a.light||{}},d={boreZ:a.boreZ??150,lead:Ye,plume:1,seed:f,rare:l,crossD:-100},i={uTime:{value:0},uBoreZ:{value:d.boreZ},uLead:{value:Ye},uPlume:{value:1},uSeed:{value:f},uRare:{value:l?1:0},uCrossD:{value:-100},uNoise:{value:null},uSunDir:{value:new y.Vector3},uSunCol:{value:new y.Color},uSkyAmb:{value:new y.Color},uGroundAmb:{value:new y.Color},uZenith:{value:new y.Color},uHorizon:{value:new y.Color},uCamL:{value:new y.Vector3(0,50,300)},uLamp:{value:m==="night"?1:m==="day"?0:.6},uLampCol:{value:b("#ffb45e").multiplyScalar(3.4)},uWet:{value:a.wet??.25},uWind:{value:new y.Vector2(-.24,-.97)},uTrail:{value:11},uPlumeH:{value:l?1.22:1},uNearFade:{value:new y.Vector2(a.sprayNear?a.sprayNear[0]:-2,a.sprayNear?a.sprayNear[1]:-1)},uTurbid:{value:A},uRefl:{value:m==="night"?.95:.86},uFresP:{value:m==="golden"||m==="dawn"?3.3:5},uLow:{value:m==="golden"||m==="dawn"?1:0},uDim:{value:m==="day"?0:1},uBurst:{value:new y.Vector4(0,0,1,0)},uBurstK:{value:0},uReach:{value:0},uRid:{value:new y.Vector4(1e5,0,1e5,0)},uLampR:{value:[0,1,2,3,4,5,6,7].map(()=>new y.Vector4(0,-1e5,0,0))},uLampC:{value:new y.Color(0,0,0)},uLampP:{value:new y.Color(0,0,0)},uDeep:{value:g},uJade:{value:q},uFoam:{value:D.clone().multiplyScalar(.92)},uSilt:{value:c[3].clone().lerp(c[1],.3)},uGold:{value:b("#e3b341")},uLeaf:{value:B.clone()}},L=(T={})=>{Object.assign(S,T);const E=(U,te)=>Array.isArray(U)?te.setRGB(U[0],U[1],U[2]):U&&U.isColor?te.copy(U):te.set(U),_=S.sunDir;i.uSunDir.value.set(_.x??_[0],_.y??_[1],_.z??_[2]).normalize(),E(S.sunColor,i.uSunCol.value).multiplyScalar((S.sunIntensity??3)/Math.PI),E(S.sky,i.uSkyAmb.value).multiplyScalar(1/Math.PI),E(S.ground,i.uGroundAmb.value).multiplyScalar(1/Math.PI),E(S.zenith,i.uZenith.value),E(S.horizon,i.uHorizon.value)};L();const x=new y.Group;x.name="silver-dragon-bore",await e.yield(),i.uNoise.value=await jt(p.fork("noise"),e),await e.yield();const z=so(i),F=(T,E,_)=>{const U=new y.Mesh(T,E);return U.name=_,x.add(U),U},K=p.fork("arch");let P=et();await Zt(P,k,K,e),await e.yield();const Y=await Ot(P,k,K,e);await e.yield(),F(await P.toGeometrySteps(e),z,"gate-and-pagoda"),await e.yield(),P=et();const X=[],we=p.fork("pavilions"),$=new y.Vector3,$e=[96,205,330,470,640,820,1020,1240];for(let T=0;T<$e.length;T++){const E=$e[T]+we.range(-22,22),_=-we.range(8,13),U=T===0?4.6:we.range(2.9,3.9),te=we.chance(.5)?6:4,H=T===0||we.chance(.35);be(E,_,9.05,$),Xt(P,k,we,$.x,$.y,$.z,-Math.asin(Be+E/Fe),T===0?6:te,U,H),X.push({x:$.x,z:$.z,r:U+2.4}),await e.yield()}await e.yield(),F(await P.toGeometrySteps(e),z,"pavilions"),await e.yield(),F(await Yt(k,v,e),z,"seawall"),await e.yield();const De=Jt(v);F(await Qt(De,k,v,e),z,"bluff"),await e.yield(),P=et();const wt=eo(P,k,De);await e.yield();const xt=await to(P,k,De,e);await e.yield(),F(await P.toGeometrySteps(e),z,"bluff-stair"),await e.yield();const gt=(T,E,_)=>{const U=T>30&&T<63&&E>-34?xt:T<-14||T>28||E>-19||E<-75?null:wt;if(!U)return!1;for(let te=0;te<U.length;te+=2){const H=U[te];if((T-H.x)**2+(E-H.z)**2<_*_)return!0}return!1};if(a.land!==!1){P=et();const T=p.fork("land"),E=[3,0,-12,-44,-70,-300,-1200,-3400],_=j=>E.map((V,W)=>{const Z=j>=0&&j<=de,I=Z?[4.2,4.2,4.2,4.2,3.6,3.5,4,7][W]:j<0?[-3,5,8.6,6,4,3.5,4,7][W]:[-3,.8,2.5,3.5,3.5,3.5,4,7][W],O=Z?Math.min(V,-44):V;return Z?be(j,O,I).toArray():[Ce(j)+O,I,j]}),U=pt([[-1800,-40,220],[-40,0,40],[0,de,de/26],[de,de+60,60],[de+60,4200,280]]);let te=_(U[0]);for(let j=1;j<U.length;j++){const V=_(U[j]);for(let W=0;W<E.length-1;W++)P.kind(7).col(k.grass.clone().lerp(W>3?b("#7f8f58"):k.grass,.6),.03,T),P.quad(te[W],V[W],V[W+1],te[W+1],te[W][2],E[W],V[W][2],E[W+1]);te=V}await e.yield();const H=220;for(let j=0;j<H;j++){const V=12+Math.pow(T(),1.5)*1150,W=-52-Math.pow(T(),1.3)*230,Z=T.range(3.2,6),I=T.range(5,10),O=T.range(2.6,4.2),pe=-Math.asin(Be+V/Fe)+(T.chance(.5)?Math.PI/2:0)+T.range(-.12,.12);be(V,W,3.6,$);const me=Math.cos(pe),ce=Math.sin(pe),R=(he,ve,N)=>[$.x+he*me+N*ce,$.y+ve,$.z-he*ce+N*me];P.kind(0).col(k.plaster,.12,T),P.box($.x,$.y,$.z,Z,$.y+O,I,pe,1,!1),P.kind(1).col(k.tileEdge,.15,T),P.quad(R(-Z-.5,O-.2,-I-.5),R(-Z-.5,O-.2,I+.5),R(0,O+Z*.55,I+.5),R(0,O+Z*.55,-I-.5),0,0,2*I,Z),P.quad(R(Z+.5,O-.2,I+.5),R(Z+.5,O-.2,-I-.5),R(0,O+Z*.55,-I-.5),R(0,O+Z*.55,I+.5),0,0,2*I,Z),P.kind(0).col(k.plaster,.1,T),P.tri(R(-Z,O,I),R(Z,O,I),R(0,O+Z*.55,I)),P.tri(R(Z,O,-I),R(-Z,O,-I),R(0,O+Z*.55,-I)),j%140===139&&await e.yield()}F(P.toGeometry(),z,"land-preview"),await e.yield()}let ot=null,at=0;const je={uSunDir:i.uSunDir,uSunCol:i.uSunCol,uSkyAmb:i.uSkyAmb,uGroundAmb:i.uGroundAmb},Ve={uTime:i.uTime,uBoreZ:i.uBoreZ,uLead:i.uLead,uPlume:i.uPlume,uSeed:i.uSeed,uRare:i.uRare,uCrossD:i.uCrossD},Bt=io();await e.yield();const Gt=F(Bt,Ne({vertexShader:ro,fragmentShader:no,uniforms:{...Ve,...je,uNoise:i.uNoise,uDeep:i.uDeep,uJade:i.uJade,uFoam:i.uFoam,uSilt:i.uSilt,uZenith:i.uZenith,uHorizon:i.uHorizon,uCamL:i.uCamL,uTurbid:i.uTurbid,uRefl:i.uRefl,uFresP:i.uFresP,uLow:i.uLow,uDim:i.uDim,uReach:i.uReach,uRid:i.uRid,uLampR:i.uLampR,uLampC:i.uLampC}}),"river");Gt.frustumCulled=!1,await e.yield();const Me=(T,E,_)=>{const U=new y.InstancedBufferGeometry;for(const te in T)U.setAttribute(te,new y.Float32BufferAttribute(T[te][0],T[te][1]));for(const te in _)U.setAttribute(te,new y.InstancedBufferAttribute(_[te][0],_[te][1]));return U.instanceCount=E,U.boundingSphere=new y.Sphere(new y.Vector3,1e5),U};{const T=Math.round(2700*(.6+.4*w)),E=p.fork("spray"),_=Math.round(450*(.6+.4*w)),U=new Float32Array((T+_+ft)*4);for(let C=0;C<T*4;C++)U[C]=E();{const C=Ze(((e.seed??1)^3906839)>>>0);for(let G=T;G<T+_;G++)U[G*4]=C(),U[G*4+1]=C(),U[G*4+2]=C(),U[G*4+3]=2+.999*C()}const te=Me({position:[[-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,-.5,0,.5,.5,0,-.5,.5,0],3]},T+_,{aS:[U,4]});ot=te,at=T+_;const H={...Ve,uSunDir:i.uSunDir,uSunCol:i.uSunCol,uSkyAmb:i.uSkyAmb,uNoise:i.uNoise,uFoam:i.uFoam,uTrail:i.uTrail,uPlumeH:i.uPlumeH,uNearFade:i.uNearFade,uCamL:i.uCamL,uDim:i.uDim,uLow:i.uLow,uBurst:i.uBurst,uBurstK:i.uBurstK,uRid:i.uRid},j=F(te,Ne({vertexShader:Rt,fragmentShader:qt,transparent:!0,depthWrite:!1,uniforms:{...H,uHeavy:{value:0}}}),"spray");j.frustumCulled=!1,j.renderOrder=3;const V=Math.round((m==="night"?1500:1800)*(.6+.4*w)),W=new Float32Array(V*4);for(let C=0;C<V*4;C++)W[C]=E();for(let C=0;C<V;C++)W[C*4+3]=1+W[C*4+3];const Z=Me({position:[[-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,-.5,0,.5,.5,0,-.5,.5,0],3]},V,{aS:[W,4]}),I=F(Z,j.material,"crest-feather");I.frustumCulled=!1,I.renderOrder=3,await e.yield();const O=Ze(((e.seed??1)^5351395)>>>0),pe=Math.round(820*(.6+.4*w)),me=new Float32Array(pe*4);for(let C=0;C<pe;C++){const G=O();me[C*4]=O(),me[C*4+1]=O(),me[C*4+2]=O(),me[C*4+3]=1+(G<.22?G*2:G<.6?.46+(G-.22)*.6:.71+(G-.6)*.7)}const ce=Me({position:[[-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,-.5,0,.5,.5,0,-.5,.5,0],3]},pe,{aS:[me,4]}),R=F(ce,Ne({vertexShader:Rt,fragmentShader:qt,transparent:!0,depthWrite:!1,uniforms:{...H,uHeavy:{value:1}}}),"lip-spray");R.frustumCulled=!1,R.renderOrder=3,await e.yield();const he=F(uo(),Ne({vertexShader:lo,fragmentShader:ho,side:y.DoubleSide,uniforms:{...Ve,uSunDir:i.uSunDir,uSunCol:i.uSunCol,uSkyAmb:i.uSkyAmb,uNoise:i.uNoise,uDeep:i.uDeep,uJade:i.uJade,uFoam:i.uFoam,uCamL:i.uCamL,uDim:i.uDim,uLow:i.uLow,uReach:i.uReach,uRid:i.uRid}}),"lip-roll");he.frustumCulled=!1,await e.yield();const ve=Math.round(1900*(.6+.4*w)),N=F(po(ve,Ze(Ht("lip-throw:"+e.seed))),Ne({vertexShader:mo,fragmentShader:co,transparent:!0,depthWrite:!1,side:y.DoubleSide,uniforms:{...Ve,uSunDir:i.uSunDir,uSunCol:i.uSunCol,uSkyAmb:i.uSkyAmb,uNoise:i.uNoise,uFoam:i.uFoam,uJade:i.uJade,uCamL:i.uCamL,uDim:i.uDim,uLow:i.uLow,uRid:i.uRid,uLampR:i.uLampR,uLampC:i.uLampC}}),"lip-throw");N.frustumCulled=!1,N.renderOrder=3}await e.yield();{const T=[],E=[],_=[],H=(N,C,G,J,ne,ie,se)=>{T.push(N,C,G),E.push(J,ne,ie),_.push(se)};for(let N=0;N<6;N++){const C=N/6*Math.PI*2,G=(N+1)/6*Math.PI*2,J=Math.cos(C),ne=Math.sin(C),ie=Math.cos(G),se=Math.sin(G);H(0,2.5,0,0,1,0,0),H(ie*.95,2.05,se*.95,ie*.45,.89,se*.45,0),H(J*.95,2.05,ne*.95,J*.45,.89,ne*.45,0)}for(let N=0;N<3;N++){const C=N/3*Math.PI*2,G=(N+1)/3*Math.PI*2,J=Math.cos(C),ne=Math.sin(C),ie=Math.cos(G),se=Math.sin(G),ze=(C+G)/2,oe=Math.cos(ze),ee=Math.sin(ze);H(J*.33,0,ne*.33,oe,.15,ee,1),H(ie*.17,1.38,se*.17,oe,.15,ee,1),H(ie*.33,0,se*.33,oe,.15,ee,1),H(J*.33,0,ne*.33,oe,.15,ee,1),H(J*.17,1.38,ne*.17,oe,.15,ee,1),H(ie*.17,1.38,se*.17,oe,.15,ee,1),H(J*.14,1.4,ne*.14,oe,.4,ee,2),H(0,1.76,0,oe,.4,ee,2),H(ie*.14,1.4,se*.14,oe,.4,ee,2)}const j=p.fork("crowd"),V=Math.min(2800,Math.round(2450*s*(.55+.45*w))),W=176,Z=xt.filter(N=>N.y>7),I=new Float32Array((V+W)*3),O=new Float32Array((V+W)*4),pe=new Float32Array((V+W)*3),me=[c[6],b("#8f1f2a"),b("#d9a441"),b("#e9dfc4"),b("#5fae8f"),b("#2f4a7a"),b("#e0702c")],ce=o==="festival"?[7,3,1.5,1.5,.5,.3,1.5]:o==="silt"?[2,1,3,3,1,1.5,2]:[3,1.5,2.5,2.5,1.5,1,1.5],R=ce.reduce((N,C)=>N+C,0);for(let N=0;N<V+W;N++){const C=j(),G=j(),J=j(),ne=j(),ie=j(),se=j(),ze=j();if(N<V){const re=5+(de-12)*Math.pow(C,1.55);let ae=-.95-Math.pow(G,2.3)*21.5;be(re,ae,0,$);for(const xe of X)if(($.x-xe.x)**2+($.z-xe.z)**2<xe.r*xe.r){ae=-.95-G*3.2,be(re,ae,0,$);break}I[N*3]=$.x,I[N*3+1]=le(9.12,9,Se(-ae/24,0,1)),I[N*3+2]=$.z}else if(N<V+62)I[N*3]=le(ke.X0+4.5,ke.X1-4.5,C),I[N*3+1]=ke.YT,I[N*3+2]=-3-G*4.6;else if(N<V+120){const re=C*Math.PI*2,ae=12.6+G*4.8;I[N*3]=fe.x+Math.cos(re)*ae,I[N*3+1]=fe.y+2.5,I[N*3+2]=fe.z+Math.sin(re)*ae}else{const re=N<V+148?wt:Z,ae=re[Math.min(re.length-1,Math.floor(C*re.length))],xe=(G*2-1)*1.1;I[N*3]=ae.x-ae.dz*xe,I[N*3+1]=ae.y,I[N*3+2]=ae.z+ae.dx*xe}let oe=J*R,ee=0;for(;ee<ce.length-1&&oe>ce[ee];)oe-=ce[ee],ee++;const Q=.72+.4*ne;pe[N*3]=me[ee].r*Q,pe[N*3+1]=me[ee].g*Q,pe[N*3+2]=me[ee].b*Q,O[N*4]=ne,O[N*4+1]=ie,O[N*4+2]=se,O[N*4+3]=ze,N%800===799&&await e.yield()}const he=Me({position:[T,3],normal:[E,3],aPart:[_,1]},V+W,{aPos:[I,3],aRnd:[O,4],aCol:[pe,3]}),ve=F(he,Ne({vertexShader:vo,fragmentShader:wo,side:y.DoubleSide,uniforms:{...je,uTime:i.uTime,uBoreZ:i.uBoreZ,uLead:i.uLead,uPlume:i.uPlume,uLampP:i.uLampP}}),"parasols");ve.frustumCulled=!1,await e.yield();{const N=[],C=[],G=[],J=(Q,re,ae,xe,Ae,Pe,Re)=>{N.push(Q,re,ae),C.push(xe,Ae,Pe),G.push(Re)};for(let Q=0;Q<6;Q++){const re=Q/6*Math.PI*2,ae=(Q+1)/6*Math.PI*2,xe=Math.cos(re),Ae=Math.sin(re),Pe=Math.cos(ae),Re=Math.sin(ae);J(0,2.5,0,0,1,0,0),J(Pe*.95,2.05,Re*.95,Pe*.45,.89,Re*.45,0),J(xe*.95,2.05,Ae*.95,xe*.45,.89,Ae*.45,0)}for(let Q=0;Q<3;Q++){const re=Q/3*Math.PI*2,ae=(Q+1)/3*Math.PI*2,xe=Math.cos(re),Ae=Math.sin(re),Pe=Math.cos(ae),Re=Math.sin(ae),Oe=(re+ae)/2,Ie=Math.cos(Oe),qe=Math.sin(Oe);J(xe*.33,0,Ae*.33,Ie,.2,qe,1),J(0,1.74,0,Ie,.2,qe,1),J(Pe*.33,0,Re*.33,Ie,.2,qe,1)}const ne=Math.min(6600,Math.round(5600*s*(.5+.5*w))),ie=new Float32Array(ne*3),se=new Float32Array(ne*4),ze=new Float32Array(ne*3);for(let Q=0;Q<ne;Q++){const re=j(),ae=j(),xe=j(),Ae=j(),Pe=j(),Re=j(),Oe=j(),Ie=6+640*Math.pow(re,1.2);let qe=-.95-Math.pow(ae,1.7)*22;be(Ie,qe,0,$);for(const Xe of X)if(($.x-Xe.x)**2+($.z-Xe.z)**2<Xe.r*Xe.r){qe=-.95-ae*3.2,be(Ie,qe,0,$);break}ie[Q*3]=$.x,ie[Q*3+1]=le(9.12,9,Se(-qe/24,0,1)),ie[Q*3+2]=$.z;let kt=xe*R,We=0;for(;We<ce.length-1&&kt>ce[We];)kt-=ce[We],We++;const rt=.72+.4*Ae;ze[Q*3]=me[We].r*rt,ze[Q*3+1]=me[We].g*rt,ze[Q*3+2]=me[We].b*rt,se[Q*4]=Ae,se[Q*4+1]=Pe,se[Q*4+2]=Re,se[Q*4+3]=Oe,Q%700===699&&await e.yield()}const oe=Me({position:[N,3],normal:[C,3],aPart:[G,1]},ne,{aPos:[ie,3],aRnd:[se,4],aCol:[ze,3]}),ee=F(oe,ve.material,"parasols-more");ee.frustumCulled=!1}}await e.yield();{const T=[],E=[],_=[],H=(R,he,ve,N,C,G,J)=>{T.push(R,he,ve),E.push(N,C,G),_.push(J)};for(let R=0;R<5;R++){const he=R/5*Math.PI*2,ve=(R+1)/5*Math.PI*2,N=Math.cos(he),C=Math.sin(he),G=Math.cos(ve),J=Math.sin(ve);H(N*.11,0,C*.11,N,0,C,0),H(G*.055,1,J*.055,G,0,J,0),H(G*.11,0,J*.11,G,0,J,0),H(N*.11,0,C*.11,N,0,C,0),H(N*.055,1,C*.055,N,0,C,0),H(G*.055,1,J*.055,G,0,J,0)}for(let R=0;R<6;R++)for(let he=0;he<4;he++){const ve=R/6,N=(R+1)/6,C=he/4,G=(he+1)/4;H(ve,C,0,0,0,1,1),H(N,C,0,0,0,1,1),H(N,G,0,0,0,1,1),H(ve,C,0,0,0,1,1),H(N,G,0,0,0,1,1),H(ve,G,0,0,0,1,1)}const j=p.fork("flags"),V=Math.round((o==="festival"?84:56)*Math.sqrt(s)),W=6,Z=new Float32Array((V+W)*3),I=new Float32Array((V+W)*4),O=new Float32Array((V+W)*3),pe=[c[6],c[6],c[6].clone().lerp(b("#ff5a2a"),.3),b("#d9a441"),b("#e9dfc4").multiplyScalar(m==="night"?.45:1),b("#2f4a7a")];for(let R=0;R<V+W;R++){const he=j(),ve=j(),N=j(),C=j(),G=j();let J=1;if(R<V){const se=8+(de-20)*Math.pow((R+he*.8)/V,1.5);be(se,-1.7-ve*1.2,9.1,$),J=le(.6,1,ge(60,210,se))}else if(R<V+2)$.set(R===V?ke.X0+1.2:ke.X1-1.2,ke.YT+1.9,.2);else{const se=Math.PI/8+(R-V-2)/4*Math.PI*2+Math.PI/4;$.set(fe.x+Math.cos(se)*19.6,fe.y+1.2,fe.z+Math.sin(se)*19.6)}Z[R*3]=$.x,Z[R*3+1]=$.y,Z[R*3+2]=$.z;const ne=R>=V?1.25:1;I[R*4]=(8.5+3.5*N)*ne*J,I[R*4+1]=C,I[R*4+2]=(3.2+1.8*G)*ne*(.5+.5*J),I[R*4+3]=(2.1+1*ve)*ne*(.5+.5*J);const ie=R>=V?pe[0]:pe[Math.floor(Math.pow(he,o==="festival"?2.2:1.5)*pe.length)];O[R*3]=ie.r,O[R*3+1]=ie.g,O[R*3+2]=ie.b}const me=Me({position:[T,3],normal:[E,3],aPart:[_,1]},V+W,{aPos:[Z,3],aRnd:[I,4],aCol:[O,3]}),ce=F(me,Ne({vertexShader:xo,fragmentShader:go,side:y.DoubleSide,uniforms:{...je,uTime:i.uTime,uBoreZ:i.uBoreZ,uLead:i.uLead,uPlume:i.uPlume,uWind:i.uWind,uGold:i.uGold}}),"banners");ce.frustumCulled=!1}await e.yield();{const T=p.fork("trees"),E=Math.round(840*(.8+.2*Math.min(s,1))),_=[],U=[],te=[],H=b("#d98a1c"),j=b("#a9b13a"),V=b("#3f5a34"),W=new y.Color;for(let C=0;C<3e3&&_.length/3<E;C++){const G=T(),J=T(),ne=T(),ie=T(),se=T(),ze=T();let oe,ee,Q;if(C%12===11)be(8+G*G*620,-29-J*13,0,$),oe=$.x,ee=$.z,Q=le(8.4,4.4,Se((-29-J*13+27.5)/-16.5,0,1));else if(oe=Le.x+(G*2-1)*Le.a,ee=Le.z+(J*2-1)*Le.b,Q=De.heightAt(oe,ee),Q<9||De.rho(oe,ee)>.925||Math.hypot(oe-fe.x,ee-fe.z)<22.5||oe>ke.X0-3&&oe<ke.X1+3&&ee>ke.ZB-2||gt(oe,ee,6.2))continue;const re=3.4+2.6*ne+1*ie,ae=re*(.62+.3*ie);W.copy(B).lerp(H,.22+se*.55).lerp(j,(1-t)*(.4+.6*ze)+(ze>.9?.35:0)).multiplyScalar(.74+.4*ie),se>.94&&W.copy(V).multiplyScalar(.8+.4*ie),_.push(oe,Q+ae*.5+2.6+3.4*se*ne,ee),U.push(re,ae,ze*6.283),te.push(W.r,W.g,W.b),C%40===39&&await e.yield()}await e.yield();const Z=p.fork("ledges"),I=b("#6c7a34");for(let C=0,G=0;C<3e3&&G<230;C++){const J=Z(),ne=Z(),ie=Z(),se=Z(),ze=Z();C%40===39&&await e.yield();const oe=Le.x+(J*2-1)*Le.a*1.03,ee=Le.z+(ne*2-1)*Le.b*1.03,Q=De.rho(oe,ee);if(Q<.85||Q>.987||oe>ke.X0-3&&oe<ke.X1+3&&ee>ke.ZB-2||gt(oe,ee,4))continue;const re=De.heightAt(oe,ee);if(re<6.8||Math.abs(De.heightAt(oe+1.5,ee)-re)>1.5||Math.abs(De.heightAt(oe,ee+1.5)-re)>1.5)continue;const ae=ze<.4?0:ze<.72?1:2,xe=ae===2?1.5+1.5*ie:1.5+2.4*ie*ie,Ae=xe*(ae===2?1.5:.62+.3*se);ae===0?W.copy(B).lerp(H,.2+se*.5):ae===1?W.copy(I).lerp(B,.25*se):W.copy(V),W.multiplyScalar(.72+.4*se),_.push(oe,re+Ae*.45,ee),U.push(xe,Ae,ie*6.283),te.push(W.r,W.g,W.b),G++}await e.yield();const O=new y.OctahedronGeometry(1,1),pe=Me({position:[O.attributes.position.array,3]},_.length/3,{aPos:[new Float32Array(_),3],aScl:[new Float32Array(U),3],aCol:[new Float32Array(te),3]});O.dispose(),await e.yield();const me=F(pe,Ne({vertexShader:yo,fragmentShader:bo,uniforms:{...je,uTime:i.uTime,uNoise:i.uNoise,uCamL:i.uCamL}}),"ginkgo");me.frustumCulled=!1,await e.yield();const ce=p.fork("leaves"),R=Math.round(760*(.45+.55*t)*(.6+.4*w)),he=new Float32Array(R*4);for(let C=0;C<R;C++)he[C*4]=-70+ce()*250,he[C*4+1]=ce(),he[C*4+2]=-175+ce()*300,he[C*4+3]=ce();const ve=Me({position:[[-.5,0,0,0,-.36,0,.5,0,0,-.5,0,0,.5,0,0,0,.36,0],3]},R,{aS:[he,4]}),N=F(ve,Ne({vertexShader:ko,fragmentShader:zo,side:y.DoubleSide,uniforms:{uTime:i.uTime,uWind:i.uWind,uCamL:i.uCamL,uSunDir:i.uSunDir,uSunCol:i.uSunCol,uSkyAmb:i.uSkyAmb,uLeaf:i.uLeaf}}),"leaves");N.frustumCulled=!1}await e.yield();const yt=fo(d),Wt=a.boreFrom??1500,It=a.boreTo??-14,st=T=>{d.boreZ=T,d.plume=ge(de+80,de-150,T),d.lead=Ye*d.plume,d.crossD=l?.9*(T-(a.crossAt??400)):-100,i.uBoreZ.value=T,i.uPlume.value=d.plume,i.uLead.value=d.lead,i.uCrossD.value=d.crossD};st(d.boreZ);const ye=(T,E,_)=>new y.Vector3(T,E,_),it=[ye(Ce(1150)+420,3.2,1150),ye(Ce(900)+190,4.2,900)];for(const T of[700,520,380,260])it.push(be(T,23,4.2));it.push(be(175,21,4.4),be(115,16,4.8),ye(0,5.4,72),ye(0,6.6,30),ye(0,7.3,-3));const Et={portalSeat:{position:ye(0,7.3,-3),facing:ye(0,0,1),shape:"arch",width:14,height:14.6,radius:7},flyThrough:it,opening:{position:ye(Ce(1e3)+260,2.2,1e3),lookAt:ye(Ce(1e3)+420,3,2600)},pagodaBase:ye(fe.x,fe.y,fe.z),pagodaTip:ye(fe.x,Y,fe.z),gateCrown:ye(0,ke.SP+ke.A,0),bluffTop:ye(fe.x,fe.y,fe.z),wallEnd:be(de,0,Ct),viewpoints:[{position:ye(6,9,190),lookAt:ye(20,34,-40)},{position:be(300,60,8),lookAt:be(270,3,10)},{position:ye(260,120,330),lookAt:ye(20,30,0)}],wall:{xAt:Ce,pointAt:be,zEnd:de,top:Ct},bore:{speed:11,height:Qe,swells:5,wavelength:Te,lead:Ye}},_t=new y.Matrix4,bt=new y.Vector3;return{object:x,radius:140,height:60,center:ye(22,40,30),anchors:Et,ground:!1,groundY:0,look:o,hour:m,season:t,rare:l,uniforms:i,wallX:Ce,setBore:st,setProgress(T){st(le(Wt,It,Se(T,0,1)))},setLight:L,setLamp(T){i.uLamp.value=T},heightAt:yt.heightAt,frontZ(T,E){return yt.zFront(T-Ce(E))},setHulls(T){const E=ot.attributes.aS,_=E.array,U=Math.max(4,Math.min(14,Math.floor(ft/Math.max(T.length,1)))),te=Ze(90731);let H=at;for(const[j,V,W,Z]of T)for(let I=0;I<U&&H<at+ft;I++,H++){const O=(I+te())/U*2-1,pe=I%2?1:-1,me=Math.cos(W),ce=Math.sin(W),R=pe*2.2*(1-.6*O*O);_[H*4]=j+me*Z*O-ce*R,_[H*4+1]=V+ce*Z*O+me*R,_[H*4+2]=te(),_[H*4+3]=3.5}ot.instanceCount=H,E.needsUpdate=!0},plumeAt(T=new y.Vector3){const E=Math.max(d.boreZ-d.lead,3);return T.set(Ce(E)+3.4,9,E)},update(T,E,_){i.uTime.value=E,_&&(bt.setFromMatrixPosition(_.matrixWorld),i.uCamL.value.copy(bt).applyMatrix4(_t.copy(x.matrixWorld).invert()))},dispose(){}}}export{Ao as BORE_GLSL,Fo as buildHero};
