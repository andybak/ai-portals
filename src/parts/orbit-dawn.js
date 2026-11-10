import*as w from"three";import{clamp as At,lerp as ut,smoothstep as Wt}from"../kit/core.js";const se=["#000003","#0a1a44","#3fa0ff","#ffe9c4","#c8ccd4","#1a1d24","#ffb040"],N=Math.PI*2,i=(t,n,h)=>new w.Vector3(t,n,h),lt=8,et=300,q=0,st=1,Q=2,ft=3,Dt=4,Qt=5,pt=6,Vt=7,Mt=8,gt=9,Et=10,Ut=11;class Nt{constructor(){this.P=[],this.N=[],this.C=[],this.U=[],this.D=[],this.I=[],this.n=0,this.m=new w.Matrix4,this.rnd=0,this.stack=[]}push(n){return this.stack.push(this.m.clone()),this.m.multiply(n),this}pop(){return this.m.copy(this.stack.pop()),this}v(n,h,l,a,r,f,c,o,s,y=0){const p=this.m.elements;this.P.push(p[0]*n+p[4]*h+p[8]*l+p[12],p[1]*n+p[5]*h+p[9]*l+p[13],p[2]*n+p[6]*h+p[10]*l+p[14]);const d=p[0]*a+p[4]*r+p[8]*f,M=p[1]*a+p[5]*r+p[9]*f,u=p[2]*a+p[6]*r+p[10]*f,b=Math.hypot(d,M,u)||1;return this.N.push(d/b,M/b,u/b),this.C.push(s.c[0],s.c[1],s.c[2]),this.U.push(c,o),this.D.push(s.m,this.rnd,s.e||0,y),this.n++}quad(n,h,l,a){this.I.push(n,h,l,n,l,a)}tri(n,h,l){this.I.push(n,h,l)}get tris(){return this.I.length/3}build(){const n=new w.BufferGeometry;n.setAttribute("position",new w.Float32BufferAttribute(this.P,3)),n.setAttribute("normal",new w.Float32BufferAttribute(this.N,3)),n.setAttribute("color",new w.Float32BufferAttribute(this.C,3)),n.setAttribute("uv",new w.Float32BufferAttribute(this.U,2)),n.setAttribute("aData",new w.Float32BufferAttribute(this.D,4));const h=[[],[],[]],l=this.I,a=this.D;for(let c=0;c<l.length;c+=3){const o=a[l[c]*4];h[o===st?1:o===ft||o===Dt||o===Vt?2:0].push(l[c],l[c+1],l[c+2])}const r=h[0].concat(h[1],h[2]);n.setIndex(this.n>65535?new w.Uint32BufferAttribute(r,1):new w.Uint16BufferAttribute(r,1));let f=0;return h.forEach((c,o)=>{c.length&&n.addGroup(f,c.length,o),f+=c.length}),n.computeBoundingSphere(),n}async buildAsync(n){const h=new w.BufferGeometry;h.setAttribute("position",new w.Float32BufferAttribute(this.P,3)),h.setAttribute("normal",new w.Float32BufferAttribute(this.N,3)),await n(),h.setAttribute("color",new w.Float32BufferAttribute(this.C,3)),h.setAttribute("uv",new w.Float32BufferAttribute(this.U,2)),h.setAttribute("aData",new w.Float32BufferAttribute(this.D,4)),await n();const l=[[],[],[]],a=this.I,r=this.D;for(let o=0;o<a.length;o+=3){const s=r[a[o]*4];l[s===st?1:s===ft||s===Dt||s===Vt?2:0].push(a[o],a[o+1],a[o+2])}await n();const f=l[0].concat(l[1],l[2]);h.setIndex(this.n>65535?new w.Uint32BufferAttribute(f,1):new w.Uint16BufferAttribute(f,1));let c=0;return l.forEach((o,s)=>{o.length&&h.addGroup(c,o.length,s),c+=o.length}),await n(),h.computeBoundingSphere(),h}}const g=(t,n,h=0,l=1)=>({m:t,c:[n.r*l,n.g*l,n.b*l],e:h});function B(t,n,h,l={}){const a=!!l.closed,r=l.a0??0,f=l.a1??N,c=Math.max(2,l.n??48),o=a?n.length:n.length-1;for(let s=0;s<o;s++){const y=n[s],p=n[(s+1)%n.length],d=Array.isArray(h)?h[s%h.length]:h;if(!d)continue;const M=p[0]-y[0],u=p[1]-y[1],b=Math.hypot(M,u);if(b<1e-5)continue;const m=u/b,k=-M/b,C=l.uR??Math.max(y[0],p[0]);let A=-1,V=-1;for(let I=0;I<=c;I++){const L=r+(f-r)*(I/c),e=Math.cos(L),x=Math.sin(L),v=L*C,z=t.v(y[0]*e,y[0]*x,y[1],m*e,m*x,k,v,0,d,b),P=t.v(p[0]*e,p[0]*x,p[1],m*e,m*x,k,v,b,d,b);I>0&&t.quad(A,z,P,V),A=z,V=P}}if(a&&l.caps){let s=0,y=0;for(const p of n)s+=p[0],y+=p[1];s/=n.length,y/=n.length;for(const[p,d]of[[r,-1],[f,1]]){const M=Math.cos(p),u=Math.sin(p),b=-u*d,m=M*d,k=t.v(s*M,s*u,y,b,m,0,0,0,l.caps,8),C=n.map(A=>t.v(A[0]*M,A[0]*u,A[1],b,m,0,A[1],A[0]-s,l.caps,8));for(let A=0;A<C.length;A++)t.tri(k,C[A],C[(A+1)%C.length])}}}const zt=new w.Vector3,$t=new w.Vector3,ct=new w.Vector3;function te(t,n){ct.subVectors(n,t);const h=ct.length();return ct.multiplyScalar(1/(h||1)),zt.set(0,0,1),Math.abs(ct.z)>.9&&zt.set(1,0,0),zt.addScaledVector(ct,-zt.dot(ct)).normalize(),$t.crossVectors(ct,zt),{L:h,d:ct.clone(),u:zt.clone(),w:$t.clone()}}function _(t,n,h,l,a,r,f,c={}){const o=te(n,h),s=[],y=[];for(let p=0;p<=r;p++){const d=p/r*N+(c.rot||0),M=Math.cos(d),u=Math.sin(d),b=o.u.x*M+o.w.x*u,m=o.u.y*M+o.w.y*u,k=o.u.z*M+o.w.z*u;s.push(t.v(n.x+b*l,n.y+m*l,n.z+k*l,b,m,k,d*l,0,f,o.L)),y.push(t.v(h.x+b*a,h.y+m*a,h.z+k*a,b,m,k,d*l,o.L,f,o.L)),p>0&&t.quad(s[p-1],s[p],y[p],y[p-1])}if(c.cap)for(const[p,d,M]of[[n,l,-1],[h,a,1]]){const u=t.v(p.x,p.y,p.z,o.d.x*M,o.d.y*M,o.d.z*M,0,0,f,2*d);let b=-1;for(let m=0;m<=r;m++){const k=m/r*N+(c.rot||0),C=Math.cos(k),A=Math.sin(k),V=t.v(p.x+(o.u.x*C+o.w.x*A)*d,p.y+(o.u.y*C+o.w.y*A)*d,p.z+(o.u.z*C+o.w.z*A)*d,o.d.x*M,o.d.y*M,o.d.z*M,C*d,A*d,f,2*d);m>0&&t.tri(u,b,V),b=V}}}function Bt(t,n,h,l,a,r,f=.5,c={}){const o=te(n,h),s=Math.max(1,Math.round(o.L/a)),y=l/2;if(c.roll){const d=Math.cos(c.roll),M=Math.sin(c.roll),u=o.u.clone(),b=o.w.clone();o.u.copy(u).multiplyScalar(d).addScaledVector(b,M),o.w.copy(b).multiplyScalar(d).addScaledVector(u,-M)}const p=(d,M)=>{const u=d===0||d===3?-1:1,b=d<2?-1:1;return i().copy(n).addScaledVector(o.d,M*o.L).addScaledVector(o.u,u*y).addScaledVector(o.w,b*y)};for(let d=0;d<4;d++)_(t,p(d,0),p(d,1),f,f,4,r);for(let d=0;d<=s;d++){const M=d/s;for(let u=0;u<4;u++)if(_(t,p(u,M),p((u+1)%4,M),f*.62,f*.62,3,r),d<s){const b=(d+u)%2;_(t,p(b?u:(u+1)%4,M),p(b?(u+1)%4:u,(d+1)/s),f*.55,f*.55,3,r)}}}function nt(t,n,h,l,a,r,f,c,o){const s=[n,h,l],y=[a,r,f];c=Math.min(c,a*.45,r*.45,f*.45);const p=(d,M,u,b,m,k,C,A,V)=>{const I=[0,0,0];return I[d]=s[d]+M*(y[d]-C*c),I[u]=s[u]+b*(y[u]-A*c),I[m]=s[m]+k*(y[m]-V*c),I};for(let d=0;d<3;d++){const M=(d+1)%3,u=(d+2)%3;for(const b of[-1,1]){const m=[0,0,0];m[d]=b;const k=[];for(const[C,A]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const V=p(d,b,M,C,u,A,0,1,1);k.push(t.v(V[0],V[1],V[2],m[0],m[1],m[2],V[M]-s[M]+y[M],V[u]-s[u]+y[u],o,2*y[u]))}t.quad(k[0],k[1],k[2],k[3]);for(const C of[-1,1]){const A=[0,0,0];A[d]=b*.7071,A[M]=C*.7071;const V=[];for(const[I,L,e]of[[0,1,-1],[0,1,1],[1,0,1],[1,0,-1]]){const x=p(d,b,M,C,u,e,I,L,1);V.push(t.v(x[0],x[1],x[2],A[0],A[1],A[2],x[u]-s[u]+y[u],I*c*1.4,o,2*y[u]))}t.quad(V[0],V[1],V[2],V[3])}}}for(const d of[-1,1])for(const M of[-1,1])for(const u of[-1,1]){const m=[];for(let k=0;k<3;k++){const C=p(0,d,1,M,2,u,k===0?0:1,k===1?0:1,k===2?0:1);m.push(t.v(C[0],C[1],C[2],d*.5774,M*.5774,u*.5774,0,0,o,1))}t.tri(m[0],m[1],m[2])}}function It(t,n,h,l,a){const r=i().crossVectors(h,l).normalize(),f=h.length(),c=l.length(),o=t.v(n.x,n.y,n.z,r.x,r.y,r.z,0,0,a,c),s=t.v(n.x+h.x,n.y+h.y,n.z+h.z,r.x,r.y,r.z,f,0,a,c),y=t.v(n.x+h.x+l.x,n.y+h.y+l.y,n.z+h.z+l.z,r.x,r.y,r.z,f,c,a,c),p=t.v(n.x+l.x,n.y+l.y,n.z+l.z,r.x,r.y,r.z,0,c,a,c);t.quad(o,s,y,p)}function dt(t,n,h,l,a,r=16,f=.6){const c=[[.001,h]],o=n*f;for(let s=1;s<=4;s++){const y=s/4*Math.PI*.5;c.push([n*Math.sin(y)*1,h+o-o*Math.cos(y)])}for(let s=3;s>=0;s--){const y=s/4*Math.PI*.5;c.push([Math.max(.001,n*Math.sin(y)),l-o+o*Math.cos(y)])}B(t,c,a,{n:r})}const ie=`
attribute vec4 aData;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec2 vUv; varying vec4 vD;
#include <fog_pars_vertex>
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vC = color; vUv = uv; vD = aData;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,le=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uEarthCol; uniform vec3 uUp;
uniform vec3 uWarm; uniform vec3 uGreen; uniform vec3 uCool;
uniform vec4 uShadow; uniform float uPen; uniform float uTime; uniform float uWin; uniform float uFill;
uniform vec3 uMoonDir; uniform vec3 uMoonCol;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec2 vUv; varying vec4 vD;
#include <fog_pars_fragment>
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p) { return vn(p) * 0.55 + vn(p * 2.13 + 7.1) * 0.3 + vn(p * 4.7 + 3.3) * 0.15; }
// 1 on panels, 0 in the seams between cells of this size (metres); fades out when the cells get small on screen
float seam(vec2 uv, vec2 cell) {
  vec2 q = uv / cell; vec2 f = abs(fract(q) - 0.5); vec2 w = fwidth(q);
  float d = min((0.5 - f.x) * cell.x, (0.5 - f.y) * cell.y);
  float fade = 1.0 - smoothstep(0.1, 0.4, max(w.x, w.y));
  return mix(1.0, smoothstep(0.02, 0.12, d), fade);
}
void main() {
  int m = int(vD.x + 0.5); float rnd = vD.y; float L = max(vD.w, 0.001);
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW);
  if ((m == 5 || m == 9) && dot(N, V) < 0.0) N = -N;
  vec2 uv = vUv; if (vD.z < 0.0) uv.y = L - uv.y;
  vec3 alb = vC; vec3 emis = vec3(0.0); float shin = 20.0; float specK = 0.12; float metal = 0.0; float trans = 0.0; float rail = 0.0; vec3 tcol = vec3(1.0, 0.75, 0.5);
  // tangent frame from derivatives (for foil crinkle and window parallax)
#if CLS != 0
  vec3 dpx = dFdx(vW), dpy = dFdy(vW); vec2 dux = dFdx(vUv), duy = dFdy(vUv);
#endif
#if CLS != 0
  vec3 T = normalize(dpx * duy.y - dpy * dux.y + vec3(1e-7, 0.0, 0.0));
  vec3 B = normalize(dpy * dux.x - dpx * duy.x + vec3(0.0, 1e-7, 0.0));
  if (vD.z < 0.0) B = -B;
  vec3 Vt = vec3(dot(V, T), dot(V, B), max(dot(V, N), 0.22));
#endif
  if (m == 0 || m == 11) {                        // painted hull panels (11: bevels that catch the backlight)
#if CLS == 0
    vec2 cell = vec2(7.0, 4.4); vec2 id = floor(uv / cell) + floor(rnd * 97.0);
    float pr = h21(id);
    alb *= 0.8 + 0.28 * pr; alb *= mix(0.8, 1.06, fbm(uv * 0.09 + rnd * 9.0));
    alb *= mix(0.45, 1.0, seam(uv, cell)); alb *= mix(0.8, 1.0, seam(uv + 1.3, cell * vec2(0.25, 0.5)));
    if (pr > 0.93) alb *= 0.45;
    if (m == 11) rail = 0.5;
#endif
  } else if (m == 1) {                            // gold foil blankets
#if CLS == 1
    vec2 q = uv * 0.8 + rnd * 31.0; float e = 0.2; float n0 = fbm(q);
    vec2 gr = vec2(fbm(q + vec2(e, 0.0)) - n0, fbm(q + vec2(0.0, e)) - n0) / e;
    N = normalize(N + (T * gr.x + B * gr.y) * 0.5);
    alb *= 0.8 + 0.4 * n0; alb *= mix(0.6, 1.0, seam(uv, vec2(3.2, 3.2)));
    metal = 1.0; shin = 36.0; specK = 1.5;
#endif
  } else if (m == 2) {                            // bare metal, truss
#if CLS == 0
    alb *= 0.8 + 0.4 * vn(uv * 0.6 + rnd * 5.0); metal = 0.6; shin = 28.0; specK = 0.5;
#endif
  } else if (m == 3) {                            // rows of room windows
#if CLS == 2
    vec2 cs = vec2(2.6, 3.3); float rows = max(1.0, floor((L - 1.2) / cs.y)); float y0 = (L - rows * cs.y) * 0.5;
    vec2 q = vec2(uv.x / cs.x, (uv.y - y0) / cs.y); vec2 id = floor(q), f = fract(q);
    float inRow = step(0.0, q.y) * step(q.y, rows) * (rows > 3.5 ? step(0.5, mod(id.y, 2.0)) : 1.0);
    vec2 w = fwidth(q); float far = smoothstep(0.3, 1.0, max(w.x, w.y));
    float win = smoothstep(0.15, 0.2, f.x) * (1.0 - smoothstep(0.8, 0.85, f.x)) * smoothstep(0.25, 0.31, f.y) * (1.0 - smoothstep(0.7, 0.76, f.y)) * inRow;
    float blk = step(0.2, h21(vec2(floor(id.x / 6.0), id.y) + rnd * 41.0));
    float on = step(0.4, h21(id + rnd * 71.0)) * blk;
    vec3 wc = mix(uWarm, uCool, step(0.86, h21(id + 3.7))) * (1.3 + 2.7 * h21(id + 9.1));
    emis = mix(win * on * wc, uWarm * 0.42 * inRow * blk, far) * uWin;
    alb *= mix(1.0, 0.2, win * (1.0 - far)); alb *= mix(0.5, 1.0, seam(uv, vec2(cs.x * 6.0, L)));
#endif
  } else if (m == 4) {                            // garden gallery: tall windows, trees inside (parallax)
#if CLS == 2
    float mx = abs(fract(uv.x / 8.0 + 0.5) - 0.5) * 8.0;
    float gh = min(L - 2.0, 8.5), g0 = (L - gh) * 0.5;
    float glass = smoothstep(0.22, 0.38, mx) * smoothstep(g0, g0 + 0.2, uv.y) * (1.0 - smoothstep(g0 + gh - 0.2, g0 + gh, uv.y));
    vec2 p = uv - Vt.xy / Vt.z * 5.0;
    float hg = clamp((p.y - g0 + 1.0) / (gh + 1.0), 0.0, 1.0);
    float cl = 0.36 + 0.36 * vn(vec2(p.x * 0.17, rnd * 9.0)) + 0.12 * vn(vec2(p.x * 0.8, 3.0 + rnd));
    float tree = 1.0 - smoothstep(cl - 0.03, cl + 0.03, hg + 0.07 * vn(p * 1.1));
    float tr = step(abs(fract(p.x / 5.5 + 0.3 * h21(vec2(floor(p.x / 5.5), rnd))) - 0.5), 0.03) * step(hg, cl);
    vec2 pb = uv - Vt.xy / Vt.z * 13.0;
    float nearK = 1.0 - smoothstep(70.0, 150.0, length(cameraPosition - vW));      // close up the planting carries the light, not the lamps
    vec3 back = uWarm * mix(0.45, 1.5, hg) * (0.8 + 0.4 * vn(pb * vec2(0.25, 0.6))) * (1.0 - 0.5 * nearK);
    back += uWarm * 2.2 * pow(max(0.0, 1.0 - abs(fract(pb.x / 6.0) - 0.5) * 6.0), 3.0) * smoothstep(0.75, 0.95, hg);
    vec3 fol = mix(uGreen, vec3(0.2, 0.62, 0.1), 0.6 * nearK) * (0.15 + 1.1 * fbm(p * 0.7 + rnd * 3.0)) * (0.4 + 0.9 * hg) * (1.0 + 1.5 * nearK);
    vec3 inside = mix(back, fol, max(tree, tr * 0.85));
    emis = inside * glass * uWin; alb *= 1.0 - 0.8 * glass;
#endif
  } else if (m == 7) {                            // garden skylights: the garden seen from above
#if CLS == 2
    float hh = L * 0.5;
    float mx = abs(fract(uv.x / 6.0 + 0.5) - 0.5) * 6.0; float my = abs(fract(uv.y / hh + 0.5) - 0.5) * hh;
    float glass = smoothstep(0.18, 0.34, mx) * smoothstep(0.18, 0.34, my);
    vec2 p = uv - Vt.xy / Vt.z * 7.0;
    vec2 tc = p / 7.0; vec2 ti = floor(tc); vec2 tf = fract(tc) - 0.5;
    vec2 jit = vec2(h21(ti + rnd), h21(ti + 7.7 + rnd)) - 0.5;
    float td = length(tf - jit * 0.45); float rad = 0.24 + 0.2 * h21(ti + 3.3);
    float tree = (1.0 - smoothstep(rad - 0.07, rad, td + 0.05 * vn(p * 1.3))) * step(0.28, h21(ti + 5.1 + rnd));
    float shade = clamp(1.0 - td / rad, 0.0, 1.0);
    float nearK = 1.0 - smoothstep(70.0, 150.0, length(cameraPosition - vW));
    vec3 grn = mix(uGreen, vec3(0.2, 0.62, 0.1), 0.6 * nearK) * (1.0 + 0.9 * nearK);
    vec3 lawn = grn * vec3(0.55, 0.7, 0.4) * (0.22 + 0.3 * vn(p * 0.5));
    vec3 treeC = grn * (0.3 + 1.25 * shade * shade) * (0.7 + 0.6 * vn(p * 1.6 + 4.0));
    float pth = 1.0 - smoothstep(0.3, 1.1, abs(p.y - hh - sin(p.x * 0.07 + rnd * 6.0) * L * 0.24));
    vec2 lc = (fract(vec2(p.x / 11.0, p.y / hh)) - 0.5) * vec2(11.0, hh);
    float lamp = pow(max(0.0, 1.0 - length(lc) / 2.2), 2.0);
    vec3 inside = mix(lawn + uWarm * 1.5 * pth * (1.0 - 0.4 * nearK), treeC, tree) + uWarm * 3.0 * lamp * (1.0 - 0.45 * nearK);
    emis = inside * glass * uWin * 0.85; alb *= 1.0 - 0.8 * glass;
#endif
  } else if (m == 5) {                            // solar cells
#if CLS == 0
    vec2 q = uv / 1.5; vec2 f = abs(fract(q) - 0.5); vec2 w = fwidth(q);
    float fade = 1.0 - smoothstep(0.12, 0.45, max(w.x, w.y));
    float line = mix(1.0, smoothstep(0.0, 0.07, 0.5 - max(f.x, f.y)), fade);
    alb = mix(vec3(0.3, 0.33, 0.38), vC * (0.7 + 0.6 * h21(floor(q) + rnd)), line);
    alb *= mix(0.4, 1.0, seam(uv, vec2(9.0, L))) * 0.6;
    shin = 70.0; specK = 1.4; trans = 0.3;
    tcol = vec3(1.0, 0.36, 0.05) * (0.12 + 0.88 * line) * (0.5 + 0.6 * h21(floor(q) + rnd + 2.0));
    // by night: each cell is a dark glassy tile (its own shade, brighter toward grazing angles where it mirrors the
    // glow of the air and the moonlit sky), with the grid between them only a little lighter
    float cr5 = h21(floor(q) + rnd + 5.0), fr5 = pow(1.0 - max(dot(N, V), 0.0), 2.5);
    float pan5 = mix(0.35, 1.0, seam(uv, vec2(9.0, L)));
    emis = (uMoonCol * (0.36 * (1.0 - line) + line * (0.07 + 0.3 * cr5 + 0.55 * fr5)) + uEarthCol * line * (0.04 + 0.16 * fr5) * (0.5 + cr5)) * pan5;
    // the back of a sunlit blanket (what a camera flying into the sun sees): dark kapton, the cell grid as darker lines,
    // a low even amber glow through it instead of the bright orange checker
    float bk5 = smoothstep(0.0, 0.25, -dot(N, uSunDir)) * smoothstep(-uPen, uPen, dot(vW, uShadow.xyz) - uShadow.w);
    alb = mix(alb, vec3(0.2, 0.087, 0.012) * (0.35 + 0.65 * line) * (0.85 + 0.3 * cr5) * pan5, bk5);
    tcol = mix(tcol, vec3(1.0, 0.5, 0.1) * (0.25 + 0.75 * line) * (0.85 + 0.15 * cr5) * pan5, bk5);
    trans = mix(0.3, 0.17, bk5); specK = mix(1.4, 0.3, bk5); emis *= 1.0 - 0.85 * bk5;
#endif
  } else if (m == 9) {                            // radiator panels
#if CLS == 0
    alb *= 0.86 + 0.14 * step(0.5, fract(uv.x / 1.1)); alb *= mix(0.5, 1.0, seam(uv, vec2(5.5, L)));
    shin = 14.0; specK = 0.25; trans = 0.1;
#endif
  } else if (m == 10) {                           // rails, cables: thin round members that catch a silver lining
#if CLS == 0
    alb *= 0.85; rail = 1.0; specK = 0.3;
#endif
  } else if (m == 6) {                            // light strips
#if CLS == 0
    emis = vC * abs(vD.z); alb = vec3(0.02);
#endif
  } else {                                        // black thermal tiles
#if CLS == 0
    alb *= 0.6 + 0.6 * h21(floor(uv / 1.4) + rnd); shin = 50.0; specK = 0.45;
#endif
  }
  // sunrise: the Earth's shadow edge is a plane sweeping down; just above it the light is red, then gold, then white
  float hgt = dot(vW, uShadow.xyz) - uShadow.w;
  float lit = smoothstep(-uPen, uPen, hgt);
  vec3 tint = mix(vec3(1.0, 0.1, 0.02), vec3(1.0, 0.52, 0.16), smoothstep(-uPen, uPen * 1.4, hgt));
  tint = mix(tint, vec3(1.0), smoothstep(uPen * 2.5, uPen * 9.0, hgt));
  vec3 sunC = uSunCol * tint * lit;
  float ndl = dot(N, uSunDir);
  float wr = max((ndl + 0.3) / 1.3, 0.0);
  float diff = mix(max(ndl, 0.0), wr * wr, 0.3);
  vec3 H = normalize(uSunDir + V);
  float fr = pow(1.0 - max(dot(V, H), 0.0), 5.0);
  float sp = pow(max(dot(N, H), 0.0), shin) * specK * mix(1.0, 5.0, fr) * smoothstep(-0.08, 0.08, ndl);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  float back = max(dot(-V, uSunDir), 0.0);
  float rim = fres * (0.12 + 1.5 * back * back) * smoothstep(-0.7, 0.12, ndl);
  vec3 specCol = mix(vec3(1.0), alb * 1.6, metal);
  vec3 earth = uEarthCol * (0.3 + 0.7 * pow(max(0.5 - 0.5 * dot(N, uUp), 0.0), 1.5));
  vec3 fillC = uSunCol * lit * mix(tint, vec3(1.0, 0.68, 0.36), 0.6) * uFill * (1.0 - diff);
  vec3 col = alb * (1.0 - 0.6 * metal) * (sunC * diff + fillC + earth);
  col += sunC * specCol * (sp + rim * (0.22 + 0.5 * metal)) + earth * specCol * fres * (0.4 + metal);
  col += trans * sunC * max(-ndl, 0.0) * tcol * (0.7 + 0.5 * back);
  // moonlight (off by default): a faint second key so the night side of the hull is not a hole in the stars
  float ndm = dot(N, uMoonDir);
  col += uMoonCol * (alb * (1.0 - 0.6 * metal) * max(ndm, 0.0) + specCol * pow(max(dot(N, normalize(uMoonDir + V)), 0.0), shin) * specK * 0.8 * step(0.0, ndm));
  rail *= mix(0.12, 1.0, smoothstep(140.0, 480.0, length(cameraPosition - vW)));
  col += rail * sunC * (0.06 + 1.25 * back * back) * mix(tint, vec3(1.0, 0.8, 0.55), 0.5);
  col += emis;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,ee=`
attribute vec4 aB;   // size (m), phase, blink rate (0 = steady), rotates with the wheel
uniform float uTime; uniform float uAngle; uniform float uPx;
varying vec3 vC; varying float vI;
#include <fog_pars_vertex>
void main() {
  vec3 p = position;
  if (aB.w > 0.5) { float c = cos(uAngle), s = sin(uAngle); p.xy = mat2(c, s, -s, c) * p.xy; }
  float b = aB.z > 0.0 ? pow(max(0.0, sin(uTime * aB.z + aB.y)), 16.0) + 0.6 * pow(max(0.0, sin(uTime * aB.z + aB.y - 0.55)), 30.0) : 0.75 + 0.25 * sin(uTime * 1.7 + aB.y);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  float px = aB.x * uPx / max(-mvPosition.z, 1.0);
  gl_PointSize = clamp(px, 3.0, 72.0);
  vI = b * clamp(px / 3.0, 0.35, 1.0); vC = color;
  #include <fog_vertex>
}`,oe=`
varying vec3 vC; varying float vI;
#include <fog_pars_fragment>
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float core = 1.0 - smoothstep(0.0, 0.3, r); float halo = pow(max(0.0, 1.0 - r), 3.0);
  vec3 col = vC * (core + halo * 0.3) * vI;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      col *= 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(col, 1.0);
}`,$=t=>new w.Matrix4().makeRotationZ(t),Ot=new w.Matrix4().makeBasis(i(0,1,0),i(0,0,1),i(1,0,0)),me=new w.Matrix4().makeBasis(i(0,0,1),i(1,0,0),i(0,1,0));async function ce(t,n,h,l){const{rng:a,C:r,W:f,ro:c,ri:o,rs:s,rw:y,perGap:p}=n,d=lt*p,M=N/d,u=2.6/c,b=Math.round(384/d),m=[[c,-(f-3)],[c,f-3],[c-3.5,f],[o+s,f],[o,f-y],[o,-(f-y)],[o+s,-f],[c-3.5,-f]],k=(c+o)/2,C=m.map(([L,e])=>[k+(L-k)*.8,e*.8]),A=n.gardenLobes,V=a()*N;for(let L=0;L<d;L++){L%3===0&&L>0&&await l();const e=L*M+u,x=(L+1)*M-u;t.rnd=a();const v=Math.sin((L+.5)/d*N*A+V)>-.3,z=v&&(L%2===0||a.chance(.3)),P=.9+.16*a(),O=g(q,r.white,0,P),E=g(q,r.white,0,.5*P),S=F=>g(z?Dt:ft,r.white,F?-1:1,P*(z?.75:1)),W=F=>v?g(Vt,r.white,F?-1:1,.7*P):g(ft,r.white,F?-1:1,.8*P),X=a.chance(.3)?g(st,r.gold,0,.9):g(Mt,r.dark,0,1.2),it=g(Ut,r.white,0,P),mt=a.chance(.5)?g(st,r.gold,0,.9):E;B(t,m,[X,it,S(!1),W(!1),E,W(!0),S(!0),it],{closed:!0,a0:e,a1:x,n:b,caps:E}),B(t,C,g(Q,r.metal,0,1.1),{closed:!0,a0:x,a1:x+2*u,n:1});for(const[F,j]of[[c+.3,f-2.5],[c-3.3,f+.4],[o+s+.2,f+.4]])for(const R of[-1,1]){const tt=R*j;B(t,[[F+.6,tt],[F,tt+.6],[F-.6,tt],[F,tt-.6]],g(Et,r.white,0,.9),{closed:!0,a0:e+.003,a1:x-.003,n:b})}for(let F=1,j=p===2?3:2;F<=j;F++){const R=ut(e,x,F/(j+1)),tt=m.map(([wt,xt])=>[k+(wt-k)*1.05,xt*1.045]);B(t,tt,mt,{closed:!0,a0:R-.45/c,a1:R+.45/c,n:1,caps:mt})}const vt=(e+x)/2;for(let F=0,j=a.int(1,3);F<j;F++){const R=ut(e,x,a.range(.12,.88));t.push($(R)),t.rnd=a();const tt=a.range(.9,1.8),wt=a.range(2,5),xt=a.range(1.5,3.2),Tt=a.range(-1,1)*(f-y-xt-.5);nt(t,o-tt+.2,0,Tt,tt,wt,xt,.35,a.chance(.45)?g(st,r.gold):g(q,r.white,0,a.range(.55,1))),t.pop()}if(a.chance(.3)){t.push($(vt));const F=a.sign()*(f-y-1.2),j=a.range(9,16);_(t,i(o,0,F),i(o-j,0,F),.35,.12,5,g(Q,r.metal,0,1.3)),_(t,i(o-j*.6,-1.6,F),i(o-j*.6,1.6,F),.1,.1,3,g(Q,r.metal,0,1.3)),t.pop(),h.push({p:i(Math.cos(vt)*(o-j),Math.sin(vt)*(o-j),F),c:r.red,s:3.2,ph:a()*N,rate:2.1,rot:1})}for(const F of[-1,1])h.push({p:i(Math.cos(e)*(c-1),Math.sin(e)*(c-1),F*(f+.3)),c:L%p===0?r.amber:r.warm,s:L%p===0?3.4:2.2,ph:L*.7,rate:0,rot:1})}t.rnd=a(),B(t,[[c+.1,-(f-4.5)],[et,-(f-6.5)],[et,f-6.5],[c+.1,f-4.5]],[g(Q,r.metal),g(Mt,r.dark,0,1.5),g(Q,r.metal)],{n:192}),B(t,[[o-.05,.45],[o-.5,.3],[o-.5,-.3],[o-.05,-.45]],g(pt,r.warm,2.2),{n:192});for(const L of[-1,1]){const e=L*(f-y-.9),x=o-.8;B(t,[[x+.7,e],[x,e+.7],[x-.7,e],[x,e-.7]],g(Q,r.metal,0,1.4),{closed:!0,n:192})}const I=n.rBrace;B(t,[[I+1.5,0],[I,1.5],[I-1.5,0],[I,-1.5]],g(Q,r.metal,0,1.5),{closed:!0,n:160})}async function he(t,n,h,l){const{rng:a,C:r,ri:f,hubR:c,rBrace:o}=n,s=g(Q,r.metal,0,1.25),y=g(q,r.white),p=g(st,r.gold);for(let d=0;d<lt;d++){d%2===0&&d>0&&await l();const M=d/lt*N;t.push($(M)),t.rnd=a();const u=c-1.5,b=f+1,m=3.3,k=[[8.5,u],[6.2,u+5],[m,u+17]],C=[y,y];for(let e=u+40;e<b-26;e+=29)k.push([m,e],[m+.8,e+.5],[m+.8,e+2.1],[m,e+2.6]),C.push(y,s,g(q,r.accent,0,.9),s);k.push([m,b-15],[5.6,b-5],[7.5,b]),C.push(y,y,g(q,r.white,0,.6)),t.push(Ot),B(t,k,C,{n:14}),t.pop(),Bt(t,i(u+8,0,0),i(b-6,0,0),10.5,10.2,s,.5);for(const e of[.9,2.3,4.4])_(t,i(u+18,Math.cos(e)*(m+.5),Math.sin(e)*(m+.5)),i(b-16,Math.cos(e)*(m+.5),Math.sin(e)*(m+.5)),.32,.32,4,g(Q,r.metal,0,e>2?1.6:.8));for(const e of[-1,1]){const x=e*.3;_(t,i(Math.cos(x)*(c-.5),Math.sin(x)*(c-.5),0),i(78,e*4.5,0),.85,.6,6,y);const v=e*(Math.PI/lt)*.62;_(t,i(o,e*4,0),i(Math.cos(v)*(f+.5),Math.sin(v)*(f+.5),0),.7,.55,5,s),_(t,i(o-44,e*5,0),i(Math.cos(v*.52)*o,Math.sin(v*.52)*o,0),.55,.45,5,s)}for(const e of[-1,1])for(const x of[-1,1]){const v=x*.13,z=x*.1;_(t,i(Math.cos(v)*(c-2.6),Math.sin(v)*(c-2.6),e*(n.hl-9)),i(Math.cos(z)*(f+.6),Math.sin(z)*(f+.6),e*(n.W-n.rw-.6)),.17,.17,4,g(Et,r.white,0,.55))}const A=n.radPerSpoke,V=n.radTilt*(d%2?-1:1);for(let e=0;e<A;e++){const x=ut(150,232,A>1?e/(A-1):.5)+a.range(-6,6),v=a.range(20,27),z=a.range(24,32);for(const P of[-1,1]){const O=i(0,Math.sin(V)*z*P,Math.cos(V)*z*P),E=i(x,Math.sin(V)*6*P,Math.cos(V)*6*P);_(t,i(x+v/2,0,0),i(x+v/2,0,0).add(O).addScaledVector(E.clone().setX(0),1),.4,.25,4,s);for(let S=0;S<3;S++)It(t,E.clone().add(i(S*(v/3)+.25,0,0)),i(v/3-.5,0,0),O,g(gt,r.white,0,1.1))}}t.rnd=a();for(let e=0,x=a.int(2,4);e<x;e++){const v=a.range(52,128),z=a.sign(),P=a();if(P<.5){const O=a.range(1.7,2.6),E=a.range(7,12),S=a.sign()*a.range(0,3);t.push(new w.Matrix4().makeTranslation(v,z*(5.6+O),S).multiply(Ot)),dt(t,O,-E/2,E/2,a.chance(.5)?p:g(q,r.white,0,a.range(.6,1.05)),12),t.pop(),_(t,i(v,z*5.2,S-O),i(v,z*5.2,S+O),.3,.3,4,s)}else{const O=a.range(3,6),E=a.range(1.6,2.6),S=a.range(2.2,4);nt(t,v,0,a.sign()*(5.4+S),O,E,S,.5,P<.8?p:g(q,r.white,0,.7))}}{const e=a.range(70,240);t.push(new w.Matrix4().makeTranslation(e,0,8.4).multiply(Ot)),dt(t,2.7,-4.5,4.5,g(q,r.white,0,1.05),12,.8),B(t,[[2.78,-1.1],[2.78,1.1]],g(pt,r.warm,3.2),{n:12}),t.pop();for(const v of[-1,1])_(t,i(e+v*3,0,5.3),i(e+v*3,0,6.6),.4,.4,4,s)}t.pop();const I=Math.cos(M),L=Math.sin(M);for(let e=u+41;e<b-26;e+=29)h.push({p:i(I*e,L*e,4.6),c:r.warm,s:1.5,ph:e,rate:0,rot:1});h.push({p:i(I*(o+2)+-L*0,L*(o+2),-6),c:r.blue,s:2.2,ph:d,rate:0,rot:1})}}function ue(t,n,h){const{rng:l,C:a,hubR:r,hl:f}=n;t.rnd=l();const c=g(q,a.white),o=g(q,a.white,0,.45),s=g(Q,a.metal,0,1.2),y=g(st,a.gold),p=g(ft,a.white,1,.9),d=g(q,a.accent,0,.9),M=g(Mt,a.dark,0,1.3),u=r-5,b=r-2,m=[[13,-f],[u-6,-f],[u-2,-f+2.5],[u-2,-f+6],[b,-f+7.5],[b,-f+11],[u,-f+12.5]],k=[M,o,n.hubFoil?y:c,s,d,s],C=n.hubRibs,A=-f+12.5,V=-7.5;for(let e=0;e<C;e++){const x=ut(A,V,e/C),v=ut(A,V,(e+1)/C);m.push([u,v-1.6],[u+1.1,v-1.2],[u+1.1,v-.4],[u,v]),k.push(e%2===0?p:c,s,s,s)}m.push([r,-5.5]),k.push(o);const I=m.slice(),L=k.slice();L.push(c);for(let e=m.length-1;e>=0;e--)I.push([m[e][0],-m[e][1]]),e>0&&L.push(k[e-1]);B(t,I,L,{n:72}),B(t,[[13,f],[13,-f]],M,{n:36});{const e=Math.max(17,u-16),x=u-9.5;B(t,[[x,f+.08],[e,f+.08]],p,{n:72}),B(t,[[e,-f-.08],[x,-f-.08]],p,{n:72});for(const v of[-1,1])for(const z of[e-1.2,x+1.4]){const P=v*(f+.35);B(t,[[z+.45,P],[z,P+.45],[z-.45,P],[z,P-.45]],s,{closed:!0,n:72})}}for(let e=0;e<lt;e++){const x=(e+.5)/lt*N;t.push($(x)),t.rnd=l(),nt(t,r+1.1,0,l.range(-2,2),1.4,l.range(3,6),l.range(1.5,3),.4,l.chance(.5)?y:c);for(const v of[-1,1])nt(t,b+.25,0,v*(f-9.2),.3,2.6,.5,.1,g(pt,a.blue,2.6));t.pop(),h.push({p:i(Math.cos(x)*(u-4),Math.sin(x)*(u-4),f+.4),c:e%2?a.warm:a.blue,s:1.8,ph:e*1.3,rate:0,rot:1})}}function kt(t,n,h,l,a,r){const f=i().subVectors(h,n).cross(i().subVectors(a,n)).normalize(),c=[n,h,l,a],o=[];for(let s=0;s<4;s++)o.push(t.v(c[s].x,c[s].y,c[s].z,f.x,f.y,f.z,c[s].z-n.z,c[s].y-n.y+c[s].x-n.x,r,6));t.quad(o[0],o[1],o[2],o[3])}function fe(t,n,h,l,a){const{rng:r,C:f}=n,c=g(Q,f.metal,0,1.3),o=g(q,f.white,0,1.08),s=g(Mt,f.dark,0,1.1);t.push($(a)),t.rnd=r(),_(t,i(14.5,0,l),i(20.8,0,l),2,1.7,10,c);const y=24;t.push(new w.Matrix4().makeTranslation(y,0,l+2));const p=[[2.5,-15],[3.4,-12],[3.4,6],[3,10],[2,14],[.9,16.3],[.01,17]];B(t,p,o,{n:10,a0:Math.PI/2,a1:Math.PI*1.5}),B(t,p,s,{n:10,a0:-Math.PI/2,a1:Math.PI/2}),B(t,[[.01,-15],[2.5,-15]],c,{n:10});for(const d of[-1,1]){const M=[i(1.6,d*3,5),i(1.6,d*12.5,-9.5),i(1.6,d*12.5,-13),i(1.6,d*3,-13.5)];kt(t,M[0],M[1],M[2],M[3],s);const u=M.map(b=>b.clone().setX(b.x-.7+(Math.abs(b.y)>4?.45:0)));kt(t,u[0],u[1],u[2],u[3],g(gt,f.white,0,1)),kt(t,M[0],u[0],u[1],M[1],o),kt(t,M[1],u[1],u[2],M[2],o),t.push(new w.Matrix4().makeTranslation(-1.2,d*1.5,0)),B(t,[[.6,-15],[1.25,-17.4]],c,{n:8}),t.pop(),h.push({p:i(y+1.6,d*12.5,l+2-11).applyMatrix4($(a)),c:d>0?f.red:f.blue,s:1.6,ph:0,rate:0,rot:0})}return t.push(new w.Matrix4().makeTranslation(1.3,0,0)),B(t,[[.6,-15],[1.25,-17.4]],c,{n:8}),t.pop(),kt(t,i(-3.2,0,-5.5),i(-9.6,0,-12.2),i(-9.6,0,-15.4),i(-3,0,-14.2),g(gt,f.white,0,1.05)),nt(t,-2.35,0,11.6,.35,1.5,.8,.12,g(pt,f.warm,1.8)),nt(t,-3.3,0,-2,.25,1.9,6.5,.1,g(q,f.white,0,.6)),t.pop(),t.pop(),h.push({p:i(y-9.6,0,l+2-15).applyMatrix4($(a)),c:f.white,s:2.4,ph:1,rate:2.6,rot:0}),i(y,0,l+2).applyMatrix4($(a))}async function pe(t,n,h,l){const{rng:a,C:r,hl:f}=n,c=g(q,r.white),o=g(q,r.white,0,.5),s=g(Q,r.metal,0,1.25),y=g(st,r.gold),p=g(Mt,r.dark,0,1.3),d=g(ft,r.white,1,.95),M=g(q,r.accent,0,.9),u={};t.rnd=a(),B(t,[[9.5,-f-8],[9.5,f+8]],s,{n:24});const b=f+4;B(t,[[9.5,b],[14,b],[16.5,b+3],[16.5,b+8],[15,b+9.5],[15,b+30],[16.5,b+31.5],[16.5,b+36],[12,b+42],[12,b+52],[8,b+57],[.01,b+57]],[o,c,M,s,d,s,n.hubFoil?c:y,c,y,o,p],{n:40}),Bt(t,i(0,0,b+55),i(0,0,150),11,11.6,s,.55,{roll:Math.PI/4}),B(t,[[8.6,146.5],[8.6,150],[.01,150]],[c,o],{n:16});for(const e of[.8,2.4,4,5.5])t.push($(e)),t.rnd=a(),nt(t,15.6,0,b+a.range(14,26),1,a.range(1.5,3),a.range(1.5,3.5),.3,a.chance(.5)?y:c),t.pop();n.shuttle&&(u.shuttle=fe(t,n,h,b+19,n.shuttlePhi));for(const e of[-1,1])h.push({p:i(0,e*8.5,150.5),c:r.white,s:3.4,ph:e,rate:2.4,rot:0});await l();const m=-(f+4);t.rnd=a(),B(t,[[.01,m-52],[7,m-52],[12,m-46],[12,m-34],[15.5,m-30],[15.5,m-12],[13,m-9.5],[13,m-3],[16,m-1.5],[16,m],[9.5,m]],[p,o,d,c,n.hubFoil?c:y,s,M,s,c,o],{n:40});const k=-350;Bt(t,i(0,0,m-50),i(0,0,k),11,11.5,s,.55,{roll:Math.PI/4});let C=m-70;for(;C>k+30;){await l();const e=a(),x=a.range(15,26);if(t.rnd=a(),e<.62){const v=a.range(4.4,6.4),z=Math.PI+a.range(-.95,.95),P=7.2+v;t.push($(z).multiply(new w.Matrix4().makeTranslation(P,0,C-x/2)));const O=a.chance(.55)?y:g(q,r.white,0,a.range(.7,1.05));dt(t,v,-x/2,x/2,O,18,.55);for(const E of[-x*.28,x*.28])B(t,[[v+.3,E-.5],[v+.3,E+.5]],s,{n:18});a.chance(.6)&&B(t,[[v+.08,-2.4],[v+.08,2.4]],d,{n:18}),_(t,i(-v-1.4,0,0),i(-v+.3,0,0),1.3,1.3,8,s),t.pop()}else{const v=a.range(3,3.8);for(let z=0;z<4;z++){const P=Math.PI/4+z*Math.PI/2;t.push(new w.Matrix4().makeTranslation(Math.cos(P)*(5.4+v),Math.sin(P)*(5.4+v),C-6)),dt(t,v,-v,v,z%2?y:g(q,r.white,0,.95),14,1),t.pop()}B(t,[[5.4+v,C-6.5],[5.4+v,C-5.5]],s,{n:4,a0:Math.PI/4,a1:Math.PI/4+N})}C-=x+a.range(10,30)}await l(),u.wings=[];for(const e of n.wingZ){const x=n.wingTilt,v=i(Math.cos(x),0,Math.sin(x));t.rnd=a();for(const z of[-1,1]){_(t,i(0,z*6,e),i(0,z*81,e),.6,.32,6,s);for(let P=0;P<4;P++){const O=z*(15+P*16.4);for(const E of[-1,1])It(t,i(0,O,e).addScaledVector(v,E*.8),v.clone().multiplyScalar(E*6.1),i(0,z*15.8,0),g(Qt,r.solar));_(t,i(0,O,e).addScaledVector(v,-7),i(0,O,e).addScaledVector(v,7),.2,.2,3,s)}_(t,i(0,z*80.8,e).addScaledVector(v,-7),i(0,z*80.8,e).addScaledVector(v,7),.2,.2,3,s),h.push({p:i(0,z*82,e),c:r.red,s:3,ph:e*.1+z,rate:2,rot:0}),u.wings.push(i(0,z*48,e))}}await l();{let e=-228;for(const S of n.wingZ)Math.abs(e-S)<22&&(e=S-26);const x=n.portalOff,v=17,z=v+2.6,P=(S,W,X)=>i(Math.cos(W)*S,Math.sin(W)*S,X);t.push(new w.Matrix4().makeTranslation(x,0,e));const O=g(Ut,r.white,0,.95);for(const S of[-1.7,1.7])B(t,[[v+.45,S],[v,S+.45],[v-.45,S],[v,S-.45]],O,{closed:!0,n:64});B(t,[[z+.4,0],[z,.4],[z-.4,0],[z,-.4]],s,{closed:!0,n:64});const E=24;for(let S=0;S<E;S++){const W=S/E*N,X=(S+1)/E*N,it=(W+X)/2;_(t,P(v,W,-1.7),P(v,X,1.7),.16,.16,3,s),_(t,P(v,W,1.7),P(v,W,-1.7),.16,.16,3,s),_(t,P(v,W,-1.7),P(z,it,0),.14,.14,3,s),_(t,P(v,X,1.7),P(z,it,0),.14,.14,3,s),S%2===0&&B(t,[[v-.5,.55],[v-.5,-.55]],g(pt,S%4===0?r.blue:r.warm,2.8),{n:3,a0:W+.05,a1:X-.05}),S%4===1&&(t.push($(it)),nt(t,v+1.3,0,0,1,1.9,1.5,.3,S%8===1?y:c),t.pop())}t.pop();for(const S of[-1,1]){const W=Math.PI+S*.42;_(t,i(5.5,S*3.5,e),i(x+Math.cos(W)*z,Math.sin(W)*z,e),.55,.4,6,c),_(t,i(5.5,S*3.5,e+16),i(x+Math.cos(W)*z,Math.sin(W)*z,e),.3,.3,4,s),h.push({p:i(x,S*(z+1.2),e),c:r.red,s:3,ph:2.1+S,rate:2,rot:0})}for(let S=0;S<12;S++){const W=S/12*N;h.push({p:i(x+Math.cos(W)*(v+1.3),Math.sin(W)*(v+1.3),e+2.3),c:S%3===0?r.amber:r.white,s:1.7,ph:-S*N/12,rate:1.9,rot:0})}u.gantry=i(x,0,e),u.gantryRadius=v}await l(),t.rnd=a();const A=ut(m-60,k,.55);for(const e of[-1,1])It(t,i(-7,e*.8,A),i(-34,0,0),i(0,e*6,e*13),g(gt,r.white,0,1.1));if(_(t,i(-6,0,A),i(-41.5,0,A),.45,.3,5,s),n.dish){const e=m-62;_(t,i(-6,-3,e),i(-21,-13,e),.5,.35,5,s),t.push(new w.Matrix4().makeTranslation(-21,-13,e).multiply(new w.Matrix4().makeRotationX(Math.PI/2+.35)).multiply(new w.Matrix4().makeRotationY(-.4))),B(t,[[.3,0],[2.2,.2],[4.2,.8],[6.2,1.75],[8,2.9]],g(gt,r.white,0,1.05),{n:24}),B(t,[[8,2.9],[8.25,3],[8.25,2.6]],s,{n:24});for(let x=0;x<3;x++){const v=x*N/3;_(t,i(Math.cos(v)*6,Math.sin(v)*6,1.6),i(0,0,6.2),.12,.12,3,s)}dt(t,.6,5.6,7.2,y,6,1),t.pop()}t.push(new w.Matrix4().makeTranslation(0,0,k-7)),dt(t,7,-7.5,7.5,c,20,.7),B(t,[[7.1,-1],[7.1,1]],M,{n:20}),t.pop();const V=n.portalOff,I=k-22,L=8.8;t.push(new w.Matrix4().makeTranslation(V,0,I)),t.rnd=a(),B(t,[[11.6,-1.6],[11.6,1.6],[10.9,2.4],[10.45,2.4],[9.85,2.4],[9.4,2.4],[L,1.6],[L,-1.6],[9.4,-2.4],[10.9,-2.4]],[c,o,c,g(pt,r.blue,3.2),c,o,p,o,y,o],{closed:!0,n:48});for(let e=0;e<6;e++){const x=(e+.5)*N/6;t.push($(x)),nt(t,12.1,0,0,.8,1.5,2,.25,e%2?y:c),t.pop()}for(let e=0;e<8;e++){const x=e*N/8;h.push({p:i(V+Math.cos(x)*11.2,Math.sin(x)*11.2,I+2.8),c:r.blue,s:1.5,ph:e,rate:0,rot:0})}for(let e=0;e<8;e++){const x=(e+.5)*N/8;h.push({p:i(V+Math.cos(x)*12.4,Math.sin(x)*12.4,I+2.2),c:e%2?r.white:r.amber,s:2.3,ph:-e*N/8,rate:1.7,rot:0})}t.pop();for(const[e,x,v]of[[Math.PI,0,-5],[Math.PI*.72,4.5,-8],[Math.PI*1.28,-4.5,-8]]){const z=i(V+Math.cos(e)*11.4,Math.sin(e)*11.4,I),P=i(5.2,x,k+v);_(t,P,z,.6,.45,6,c),_(t,i(5.2,-x,k-12),z,.3,.3,4,s)}return u.portal=i(V,0,I),u.portalRadius=L,u.zEnd=k,u.foreEnd=i(0,0,150),u}async function ve(t,n={}){const h=t.rng.fork?t.rng.fork("orbit-dawn-hero"):t.rng,l=(n.palette&&n.palette.length>=7?n.palette:se).map(D=>new w.Color(D)),a={white:l[4].clone(),dark:l[5].clone().lerp(l[4],.1),metal:l[5].clone().lerp(l[4],.38),gold:l[6].clone().multiplyScalar(.85),accent:(h.chance(.5)?l[6]:l[2]).clone().multiplyScalar(.8),solar:l[1].clone().lerp(l[2],.22).multiplyScalar(1.6),warm:l[3].clone(),amber:l[6].clone(),blue:l[2].clone().lerp(new w.Color(1,1,1),.25),red:l[6].clone().lerp(new w.Color(1,.05,.02),.75),white1:new w.Color(1,1,1)};a.white=l[4].clone().multiplyScalar(.76);const r=l[3].clone().lerp(new w.Color(1,1,1),.6),f=new w.Color(.3,.6,.12).lerp(l[3],.42),c=h.range(13.5,17),o=h.range(22,29),s=et-2,y=h.range(30,38),p={rng:h,C:a,W:c,ro:s,ri:s-o,rs:h.range(6,9.5),rw:Math.min(h.range(7.5,11),c-3.6),perGap:h.pick([2,2,3]),gardenLobes:h.pick([2,3,3]),rBrace:h.range(188,204),hubR:h.range(34,38),hl:y,radPerSpoke:h.pick([1,2,2]),radTilt:h.range(.5,.95),hubRibs:At(Math.floor((y-20)/4.5),1,4),hubFoil:h.chance(.5),shuttle:n.shuttle!==!1,shuttlePhi:h.range(-.55,.55),wingZ:h.chance(.6)?[-158-h.range(0,20),-262-h.range(0,25)]:[-205-h.range(0,30)],wingTilt:h.range(-.3,.3),dish:h.chance(.7),portalOff:32},d=[],M=new Nt,u=async()=>{await t.yield?.()};await u(),await ce(M,p,d,u),await u(),await he(M,p,d,u),await u(),ue(M,p,d),await u();const b=new Nt,m=await pe(b,p,d,u);await u();const k=(n.sunDir?i().copy(n.sunDir):i(0,-.2,-1)).normalize(),C=w.UniformsUtils.merge([w.UniformsLib.fog,{uSunDir:{value:k.clone()},uSunCol:{value:new w.Color(1.3,1.27,1.22)},uEarthCol:{value:new w.Color},uUp:{value:i(0,1,0)},uWarm:{value:l[3].clone()},uGreen:{value:f},uCool:{value:l[2].clone().lerp(new w.Color(1,1,1),.45)},uMoonDir:{value:i(.3,.5,-.8).normalize()},uMoonCol:{value:new w.Color(0,0,0)},uShadow:{value:new w.Vector4(0,1,0,0)},uPen:{value:55},uTime:{value:0},uWin:{value:1},uFill:{value:.16}}]),A=[0,1,2].map(D=>new w.ShaderMaterial({uniforms:C,defines:{CLS:D},vertexShader:ie,fragmentShader:le,vertexColors:!0,fog:!0,side:w.DoubleSide})),V=new w.Group;V.name="orbit-dawn-hero";const I=n.hubAtOrigin?0:et,L=new w.Group;L.position.y=I,V.add(L);const e=new w.Group;L.add(e);const x=new w.Mesh(await M.buildAsync(u),A);e.add(x),await u();const v=new w.Mesh(await b.buildAsync(u),A);L.add(v),await u();const z=new w.ShaderMaterial({vertexShader:"void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition; }",fragmentShader:"void main() { gl_FragColor = vec4(0.0); }",colorWrite:!1,side:w.DoubleSide,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:2}),P=D=>{const T=new w.Mesh(D.geometry,z);return T.renderOrder=-5,D.add(T),T};P(x),P(v);const O=[],E=[],S=[];for(const D of d){const T=D.rate>0?7:4.5,G=D.c===a.white?r:D.c;O.push(D.p.x,D.p.y,D.p.z),E.push(G.r*T,G.g*T,G.b*T),S.push(D.s,D.ph,D.rate,D.rot)}const W=new w.BufferGeometry;W.setAttribute("position",new w.Float32BufferAttribute(O,3)),W.setAttribute("color",new w.Float32BufferAttribute(E,3)),W.setAttribute("aB",new w.Float32BufferAttribute(S,4));const X=w.UniformsUtils.merge([w.UniformsLib.fog,{uTime:{value:0},uAngle:{value:0},uPx:{value:500}}]),it=new w.ShaderMaterial({uniforms:X,vertexShader:ee,fragmentShader:oe,vertexColors:!0,fog:!0,transparent:!0,depthWrite:!1,blending:w.AdditiveBlending}),mt=new w.Points(W,it);mt.frustumCulled=!1,mt.renderOrder=2,L.add(mt);const vt=n.period??60,F=N/vt,j=N/lt,R={phase0:h()*N,dir:h.sign(),steer:0,override:null,prevValid:!1,sunrise:At(n.sunrise??.55,0,1),earth:null},tt=n.steer!==!1,wt=new w.Color(1.3,1.27,1.22),xt=l[2].clone().multiplyScalar(.06).add(l[1].clone().multiplyScalar(.3)),Tt=l[2].clone().multiplyScalar(.2),rt=i(),ae=i(),ne=new w.Color,Gt=i(),Ct=i(),H=i(),Lt=i(),St=i(),qt=i(),Kt=new w.Matrix4,re=new w.Vector2,jt=5.6,Ht=3.4,_t=.008,ht=(D,T,G)=>Wt(D,T,G);function Yt(D,T){return L.updateWorldMatrix(!0,!1),L.worldToLocal(T.setFromMatrixPosition(D.matrixWorld))}function Xt(D){const T=Yt(D,ae);Kt.copy(L.matrixWorld).invert(),H.copy(C.uSunDir.value).transformDirection(Kt);let G=1;if(Math.abs(H.z)>1e-4){const K=-T.z/H.z;if(K>0){const ot=T.x+H.x*K,at=T.y+H.y*K,Z=Math.hypot(ot,at),Y=Math.max(1,K*_t);if(G*=ht(p.hubR-Y,p.hubR+Y,Z),G*=1-ht(p.ri-Y,p.ri+Y,Z)*(1-ht(et-Y,et+Y,Z)),Z>p.hubR&&Z<p.ri){let yt=Math.atan2(at,ot)-e.rotation.z;yt-=Math.round(yt/j)*j;const Pt=Math.abs(Math.sin(yt))*Z;G*=1-(.45*(1-ht(jt-Y,jt+Y,Pt))+.55*(1-ht(Ht-Y,Ht+Y,Pt)))}}}if(Math.abs(H.z)>1e-4){const K=(m.gantry.z-T.z)/H.z;if(K>0){const ot=Math.hypot(T.x+H.x*K-m.gantry.x,T.y+H.y*K-m.gantry.y)-m.gantryRadius-.6,at=Math.max(.6,K*_t);G*=1-.6*(1-ht(1.6-at,1.6+at,Math.abs(ot)))}}const bt=H.x*H.x+H.y*H.y;if(bt>1e-6){const K=-(T.x*H.x+T.y*H.y)/bt,ot=T.z+H.z*K;if(K>0&&ot<152&&ot>m.zEnd-14){const at=Math.hypot(T.x+H.x*K,T.y+H.y*K),Z=Math.max(1,K*_t);G*=ht(8-Z,8+Z,at)}}return At(G,0,1)}const J={object:V,radius:et,height:et*2,center:i(0,I,0),ground:!1,groundY:0,sunVis:1,phase:0,params:{hubRadius:p.hubR,rimInner:p.ri,rimOuter:et,rimHalfWidth:c,spokes:lt,period:vt,spinDir:R.dir},setSunrise(D){R.sunrise=At(D,0,1)},setProgress(D){R.sunrise=Wt(.42,.64,D)},setSun(D,T){D&&C.uSunDir.value.copy(D).normalize(),T&&wt.copy(T)},setEarthshine(D){R.earth=D?ne.copy(D):null},setPhase(D){R.override=D},sunVisibility:Xt,update(D,T,G){const bt=R.phase0+R.dir*F*T;if(G){if(Yt(G,rt),tt&&R.prevValid&&D>1e-4){Ct.subVectors(rt,Gt).multiplyScalar(1/D);const Z=-Ct.z;if(rt.z>1.5&&rt.z<480&&Z>1&&Ct.length()<120){const Y=rt.z/Z,yt=rt.x+Ct.x*Y,Pt=rt.y+Ct.y*Y,Zt=Math.hypot(yt,Pt);if(Zt>p.hubR+4&&Zt<p.ri-4){let Ft=Math.atan2(Pt,yt)-(bt+R.steer+R.dir*F*Y)-j/2;Ft-=Math.round(Ft/j)*j;const Jt=F*(rt.z<60?.6:.3);R.steer+=At(Ft/Math.max(Y,.4),-Jt,Jt)*D}}}Gt.copy(rt),R.prevValid=!0}const K=R.override!==null?R.override:bt+R.steer;R.override!==null&&(R.steer=R.override-bt,R.override=null),e.rotation.z=K,J.phase=K,L.updateWorldMatrix(!0,!1);const ot=R.sunrise,at=C.uSunDir.value;if(Lt.setFromMatrixColumn(L.matrixWorld,1).normalize(),qt.setFromMatrixPosition(L.matrixWorld),St.copy(Lt).addScaledVector(at,-Lt.dot(at)).normalize(),C.uShadow.value.set(St.x,St.y,St.z,qt.dot(St)+ut(et*1.25,-et*2.5,ot)),C.uUp.value.copy(Lt),C.uSunCol.value.copy(wt),R.earth?C.uEarthCol.value.copy(R.earth):C.uEarthCol.value.copy(xt).lerp(Tt,Wt(.1,.9,ot)),C.uTime.value=T,X.uTime.value=T,X.uAngle.value=K,G){const Z=t.renderer?.getDrawingBufferSize?t.renderer.getDrawingBufferSize(re).y:720;X.uPx.value=Z*.5*G.projectionMatrix.elements[5],J.sunVis=Xt(G)}},dispose(){}},U=(D,T,G)=>i(D,T+I,G),Rt=U(m.portal.x,m.portal.y,m.portal.z);return J.anchors={hub:U(0,0,0),axis:i(0,0,1),crossing:U(110,0,0),flyThrough:[U(122,10,460),U(116,5,260),U(111,1,90),U(110,0,0),U(100,0,-45),U(62,0,-105),U(38,0,-150),U(32,0,-195),U(32,0,-300),Rt.clone()],portalSeat:{position:Rt.clone(),normal:i(0,0,1),radius:m.portalRadius},foreEnd:U(0,0,150),aftEnd:U(0,0,m.zEnd),shuttle:m.shuttle?U(m.shuttle.x,m.shuttle.y,m.shuttle.z):null,gardenLook:U(p.ri,0,0),solarWings:m.wings.map(D=>U(D.x,D.y,D.z)),gantry:{position:U(m.gantry.x,m.gantry.y,m.gantry.z),radius:m.gantryRadius},viewpoints:[{position:U(70,45,540),target:U(0,0,0)},{position:U(112,2,130),target:U(250,40,0)},{position:U(32,0,-160),target:Rt.clone()}]},V.userData.hero=J,J.uniforms=C,J.addPrepass=P,J.material=A,J.colors=a,J.design=p,J.beaconUniforms=X,J.stats={triangles:M.tris+b.tris,beacons:d.length},J.update(0,0,null),J}const we={Geo:Nt,sty:g,lathe:B,tube:_,truss:Bt,cbox:nt,plate:It,capsule:dt,quadP:kt,rotZ:$,M:{PAINT:q,FOIL:st,METAL:Q,ROOMS:ft,GALLERY:Dt,SOLAR:Qt,GLOW:pt,SKYLIGHT:Vt,BLACK:Mt,RADIATOR:gt,RAIL:Et,EDGE:Ut}};function xe(t){const n=[],h=[],l=[];for(const o of t){const s=o.rate>0?7:4.5;n.push(o.p.x,o.p.y,o.p.z),h.push(o.c.r*s,o.c.g*s,o.c.b*s),l.push(o.s,o.ph||0,o.rate||0,0)}const a=new w.BufferGeometry;a.setAttribute("position",new w.Float32BufferAttribute(n,3)),a.setAttribute("color",new w.Float32BufferAttribute(h,3)),a.setAttribute("aB",new w.Float32BufferAttribute(l,4));const r=w.UniformsUtils.merge([w.UniformsLib.fog,{uTime:{value:0},uAngle:{value:0},uPx:{value:500}}]),f=new w.ShaderMaterial({uniforms:r,vertexShader:ee,fragmentShader:oe,vertexColors:!0,fog:!0,transparent:!0,depthWrite:!1,blending:w.AdditiveBlending}),c=new w.Points(a,f);return c.frustumCulled=!1,c.renderOrder=2,{object:c,uniforms:r}}export{ve as buildHero,xe as makeBeacons,we as stationKit};
