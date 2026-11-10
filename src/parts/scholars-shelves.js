import*as O from"three";const va=["#D9C39A","#1F1A17","#1F3460","#3F8F6B","#C8432B","#F4EEDD","#C9952F"],I=0,i=1,f0=2,R=3,E=4,M=5,P=6,gt=7,yt=8,Gt=9,wt=10,se=11,ma=12,U=0,ut=1,st=2,Wt=3,ct=4,it=5,ft=6,R0=7,Ie=8,At=11,ce=12,Vt=13,kt=20,lt=21,k0=22,Ft=23,Mt=24,_e=25,$e=26,Ye=27,qt=28,be=29,M0=Math.PI*2,t0=[-36,-58,-85,-119,-162,-216,-285,-371,-480,-690],Qt=[24,30,38,48,60,76,96,121,152,190],F=-10.08,W0=13.92,v0=15,b=30;function G(d){if(d>=t0[0])return 1;for(let A=0;A<9;A++)if(d>=t0[A+1]){const l=(t0[A]-d)/(t0[A]-t0[A+1]);return(Qt[A]+(Qt[A+1]-Qt[A])*l)/24}return Qt[9]/24}function xa(d){let A=2166136261;const l=String(d);for(let z=0;z<l.length;z++)A^=l.charCodeAt(z),A=Math.imul(A,16777619);return()=>{A|=0,A=A+1831565813|0;let z=Math.imul(A^A>>>15,1|A);return z=z+Math.imul(z^z>>>7,61|z)^z,((z^z>>>14)>>>0)/4294967296}}function Zt(d){return{anim:d,pos:[],uv:[],q:[],pig:[],a:[],b:[],idx:[],n:0,P:[I,i,0],A:[0,0,0,0],B:[0,0,0,0],ox:0}}function N0(d,A,l,z,D,c0,P0){d.pos.push(A[0]+d.ox,A[1],A[2]),d.uv.push(l*D,z*D,D),d.q.push(c0,P0);const X=d.P;if(d.pig.push(X[0],X[1],X[2]),d.anim){const j=d.A,V=d.B;d.a.push(j[0],j[1],j[2],j[3]),d.b.push(V[0],V[1],V[2],V[3])}return d.n++}function ie(d,A){const l=d[0]-A[0],z=d[1]-A[1],D=d[2]-A[2];return Math.sqrt(l*l+z*z+D*D)}function $0(d,A,l,z,D,c0,P0,X,j,V=15){const C=V&1?0:.5,e0=V&2?1:.5,n0=V&4?0:.5,a0=V&8?1:.5;let z0=1,N=1,$=1,V0=1;const q0=ie(A,l),u0=ie(D,z),w=ie(A,D),r=ie(l,z),g0=Math.abs(q0-u0)/Math.max(q0+u0,1e-6),L0=Math.abs(w-r)/Math.max(w+r,1e-6);if(g0>L0&&g0>.001&&q0>1e-6&&u0>1e-6){const y0=Math.max(q0,u0);z0=N=q0/y0,$=V0=u0/y0}else if(L0>.001&&w>1e-6&&r>1e-6){const y0=Math.max(w,r);z0=V0=w/y0,N=$=r/y0}const m0=N0(d,A,c0,P0,z0,C,n0);N0(d,l,X,P0,N,e0,n0),N0(d,z,X,j,$,e0,a0),N0(d,D,c0,j,V0,C,a0),d.idx.push(m0,m0+1,m0+2,m0,m0+2,m0+3)}function J(d,A,l,z,D,c0,P0,X,j,V=0,C=null){const e0=V&1?0:.5,n0=V&2?1:.5,a0=V&4?0:.5,z0=V&8?1:.5;C&&C(0,A);const N=N0(d,A,c0[0],c0[1],1,e0,a0);C&&C(1,l),N0(d,l,P0[0],P0[1],1,n0,a0),C&&C(2,z),N0(d,z,X[0],X[1],1,n0,z0),C&&C(3,D),N0(d,D,j[0],j[1],1,e0,z0),d.idx.push(N,N+1,N+2,N,N+2,N+3)}function E0(d,A,l){const z=G(l);return[d*z,A*z,l]}function S0(d,A,l,z,D,c0,P0,X={}){const j=X.f??1,V=X.axAbs??A+(l-A)*(X.ax??.5),C=X.ayAbs??z+(D-z)*(X.ay??0),e0=X.k??1,n0=X.uo??0,a0=G(c0),z0=G(P0),N=(L0,m0)=>[L0*a0,m0*a0,c0],$=(L0,m0)=>[(V+(L0-V)*j)*z0,(C+(m0-C)*j)*z0,P0],V0=(c0-P0)/a0,q0=l-A,u0=D-z,w=X.faces||{},r=L0=>{d.P[0]=L0[0],d.P[1]=L0[1]??i,d.P[2]=L0[2]??0},g0=X.em??15;w.front&&(r(w.front),$0(d,N(A,z),N(l,z),N(l,D),N(A,D),n0,0,n0+q0*e0,u0*e0,g0)),w.back&&(r(w.back),$0(d,$(A,z),$(l,z),$(l,D),$(A,D),n0,0,n0+q0*e0,u0*e0,g0)),w.left&&(r(w.left),$0(d,N(A,z),$(A,z),$(A,D),N(A,D),n0,0,n0+V0*e0,u0*e0,g0)),w.right&&(r(w.right),$0(d,N(l,z),$(l,z),$(l,D),N(l,D),n0,0,n0+V0*e0,u0*e0,g0)),w.top&&(r(w.top),$0(d,N(A,D),N(l,D),$(l,D),$(A,D),n0,0,n0+q0*e0,V0*e0,g0)),w.bottom&&(r(w.bottom),$0(d,N(A,z),N(l,z),$(l,z),$(A,z),n0,0,n0+q0*e0,V0*e0,g0))}function ga(d,A,l,z,D,c0,P0,X,j,V,C={}){C.faces={front:X,left:j,right:j,top:V,bottom:C.bottom===void 0?j:C.bottom,back:C.back},S0(d,A,l,z,D,c0,P0,C)}function F0(d,A,l,z,D,c0,P0){d.P[0]=D,d.P[1]=c0,d.P[2]=P0;const X=(j,V)=>[A[0]+l[0]*j+z[0]*V,A[1]+l[1]*j+z[1]*V,A[2]+l[2]*j+z[2]*V];$0(d,X(-1,-1),X(1,-1),X(1,1),X(-1,1),-1,-1,1,1,0)}function Dt(d,A,l,z,D=28){const c0=d.A.slice(),P0=d.B.slice();for(let X=0;X<z.length-1;X++){const j=z[X],V=z[X+1],C=V[0]-j[0],e0=V[1]-j[1],n0=Math.hypot(C,e0)||1,a0=-C/n0,z0=e0/n0,N=j[5]??6,$=j[6]??3,V0=$&1?0:.5,q0=$&2?1:.5;d.P[0]=j[2],d.P[1]=j[3]??i,d.P[2]=j[4]??0,d.A[0]=9;for(let u0=0;u0<D;u0++){const w=u0/D*M0,r=(u0+1)/D*M0,g0=Math.cos(w),L0=Math.sin(w),m0=Math.cos(r),y0=Math.sin(r),q=d.n,s0=u0/D*N,i0=(u0+1)/D*N;d.B[0]=g0*z0,d.B[1]=a0,d.B[2]=L0*z0,N0(d,[A+g0*j[0],j[1],l+L0*j[0]],s0,0,1,.5,V0);const p0=d.n;N0(d,[A+g0*V[0],V[1],l+L0*V[0]],s0,1,1,.5,q0),d.B[0]=m0*z0,d.B[2]=y0*z0,N0(d,[A+m0*j[0],j[1],l+y0*j[0]],i0,0,1,.5,V0),N0(d,[A+m0*V[0],V[1],l+y0*V[0]],i0,1,1,.5,q0),d.idx.push(q,q+2,q+3,q,q+3,p0)}}d.A=c0,d.B=P0}function Kt(d,A){const l=new O.BufferGeometry;l.setAttribute("position",new O.BufferAttribute(new Float32Array(d.pos),3)),l.setAttribute("aUv",new O.BufferAttribute(new Float32Array(d.uv),3)),l.setAttribute("aQ",new O.BufferAttribute(new Float32Array(d.q),2)),l.setAttribute("aP",new O.BufferAttribute(new Float32Array(d.pig),3)),d.anim&&(l.setAttribute("aA",new O.BufferAttribute(new Float32Array(d.a),4)),l.setAttribute("aB",new O.BufferAttribute(new Float32Array(d.b),4))),l.setIndex(new O.BufferAttribute(new Uint32Array(d.idx),1)),l.boundingSphere=new O.Sphere(new O.Vector3(0,0,-345),900);const z=new O.Mesh(l,A);return z.frustumCulled=!1,z.matrixAutoUpdate=!1,z}const ya=`
attribute vec3 aUv; attribute vec2 aQ; attribute vec3 aP;
varying vec3 vUv; varying vec2 vQ; varying vec3 vP; varying float vNdv;
#ifdef ANIM
attribute vec4 aA; attribute vec4 aB;
uniform float uTime; uniform float uU; uniform float uHinge[10]; uniform float uAng[8];
vec3 rotA(vec3 p, float ax, float a) {
  float c = cos(a), s = sin(a);
  if (ax < 0.5) return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
  if (ax < 1.5) return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
}
float ease(float x) { x = clamp(x, 0., 1.); return x * x * (3. - 2. * x); }
#endif
#include <fog_pars_vertex>
void main() {
  vec3 p = position; vUv = aUv; vQ = aQ; vP = aP; vNdv = 1.;
#ifdef ANIM
  float k = aA.x;
  if (k < 0.5) {
  } else if (k < 1.5) {                       // folding screen panel: aA = (1, wall, panel, s)  aB = (side * width, hinge x, widest angle, 0)
    int wi = int(aA.y + 0.5);
    float th = clamp(uHinge[wi], 0., 1.) * aB.z, pw = abs(aB.x);
    p.x = aB.y - aB.x * (aA.z + aA.w) * cos(th);
    p.z -= pw * sin(th) * (mod(aA.z, 2.) < 0.5 ? aA.w : 1. - aA.w);
  } else if (k < 2.5) {                       // sliding case: aA = (2, delay, duration, distance along x)
    p.x += aA.w * ease((uU - aA.y) / max(aA.z, 1e-4));
  } else if (k < 3.5) {                       // unrolling scroll: aA = (3, delay, duration, v)  aB = (length, phase, sway, 0)
    float e = ease((uU - aA.y) / max(aA.z, 1e-4));
    p.y -= min(aA.w, e) * aB.x;
    p.x += aB.z * sin(uTime * 1.3 + aB.y) * (0.25 + 0.75 * e);
  } else if (k < 4.5) {                       // swing about an axis on time: aA = (4, phase, speed, amplitude)  aB = (pivot, axis)
    p = aB.xyz + rotA(p - aB.xyz, aB.w, aA.w * sin(uTime * aA.z + aA.y));
  } else if (k < 5.5) {                       // falling petal: aA = (5, phase, fall speed, spin)  aB = (x, top y, z, fall range)
    float f = fract(uTime * aA.z / max(aB.w, 1.) + aA.y);
    float sc = smoothstep(0., 0.05, f) * (1. - smoothstep(0.95, 1., f));
    vec3 l = rotA(p * sc, 2., aA.y * 17. + 0.7 * sin(uTime * aA.w * 1.3 + aA.y * 5.));
    l = rotA(l, 0., 0.95 * sin(uTime * aA.w * 2.2 + aA.y * 40.));
    l = rotA(l, 1., 0.55 * sin(uTime * aA.w * 1.7 + aA.y * 9.));
    p = vec3(aB.x + sin(uTime * 0.45 + aA.y * 31.) * aB.w * 0.02, aB.y - f * aB.w, aB.z + f * aB.w * 0.5) + l;
  } else if (k < 6.5) {                       // sway: aA = (6, phase, speed, weight)  aB = (direction * amplitude, 0)
    p += aB.xyz * (sin(uTime * aA.z + aA.y) * aA.w);
  } else if (k < 7.5) {                       // turn about an axis by a uniform: aA = (7, index, gain, 0)  aB = (pivot, axis)
    int ai = int(aA.y + 0.5);
    p = aB.xyz + rotA(p - aB.xyz, aB.w, uAng[ai] * aA.z);
  } else if (k < 8.5) {                       // curtain: aA = (8, across -1..1, down 0..1, 0)  aB = (height, 0, 0, 0); uAng[2] lifts it
    float lift = clamp(uAng[2], 0., 1.) * (1. - 0.75 * abs(aA.y) * aA.y * aA.y);
    p.y -= aA.z * aB.x * (1. - 0.78 * lift);
    p.z += aA.z * (0.9 * lift * sin(aA.y * 24.) + 0.35 * sin(uTime * 0.9 + aA.y * 3. + aA.z * 5.));
    p.x += 0.25 * sin(uTime * 0.7 + aA.z * 4.) * aA.z;
  } else if (k < 9.5) {                       // lathe: aB.xyz = normal, for the silhouette line
    vec3 wn = normalize(mat3(modelMatrix) * aB.xyz + vec3(0., 1e-6, 0.));
    vec3 wv = cameraPosition - (modelMatrix * vec4(p, 1.)).xyz;
    vNdv = abs(dot(wn, wv / max(length(wv), 1e-4)));
  } else if (k < 10.5) {                      // spin about an axis on time: aA = (10, phase, speed, 0)  aB = (pivot, axis)
    p = aB.xyz + rotA(p - aB.xyz, aB.w, uTime * aA.z + aA.y);
  } else if (k < 11.5) {                      // slide by a uniform: aA = (11, index, 0, 0)  aB = (offset at 1, 0)
    int ai = int(aA.y + 0.5);
    p += aB.xyz * uAng[ai];
  } else if (k < 12.5) {                      // travelling wave: aA = (12, phase, speed, weight)  aB = (direction * amplitude, bob)
    p += aB.xyz * (sin(uTime * aA.z + aA.y) * aA.w);
    p.y += aB.w * (0.5 + 0.5 * sin(uTime * aA.z * 0.5 + aA.y * 0.5));
  } else {                                    // widening ring: aA = (13, phase, speed, 0)  aB = (centre, 0): grows from the centre, then starts again
    p = aB.xyz + (p - aB.xyz) * (0.12 + 0.88 * fract(uTime * aA.z + aA.y));
  }
#endif
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,wa=`
uniform vec3 uPal[13]; uniform float uInk;
varying vec3 vUv; varying vec2 vQ; varying vec3 vP; varying float vNdv;
#include <fog_pars_fragment>
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float aa(float d, float w) { return 1. - smoothstep(w - 0.6, w + 0.6, d); }
void main() {
  int ib = int(vP.x + 0.5), ic = int(vP.y + 0.5);
  vec3 base = uPal[ib], sec = uPal[ic], ink = uPal[1];
  float pat = floor(vP.z + 0.5);
  vec2 uv = vUv.xy / max(vUv.z, 1e-5);
  vec2 fw = max(fwidth(uv), vec2(1e-6)); float fl = max(fw.x, fw.y);
  vec2 fq = max(fwidth(vQ), vec2(1e-6));
  float fn = max(fwidth(vNdv), 1e-6);
  // shape cards (uv -1..1): width profile along the petal / leaf, all derivatives taken here at top level
  float t = clamp(uv.y * 0.5 + 0.5, 0., 1.);
  float arch = sqrt(max(4. * t * (1. - t), 0.));
  float wPeony = 0.92 * arch * (0.4 + 0.6 * t) + 0.045 * cos(uv.x * 12.) * t;
  float wLeaf = 0.52 * sin(3.14159 * sqrt(t)) * (1. - 0.25 * t);
  float wLotus = 0.6 * arch * (1. - 0.45 * t * t);
  float wv = pat > 23.5 ? wLotus : (pat > 20.5 && pat < 21.5 ? wLeaf : wPeony);
  float dS = pat > 21.5 && pat < 22.5 ? 1. - length(uv) : wv - abs(uv.x);
  float dSpx = dS / max(fwidth(dS), 1e-6);
  float dS2 = 1. - length(uv);
  float dS2px = dS2 / max(fwidth(dS2), 1e-6);
  float vx = uv.x / max(wv, 0.05) * 1.5 + 0.5;
  float vxpx = abs(fract(vx) - 0.5) / max(fwidth(vx), 1e-6);
  vec3 col = base; float k = 0.;
  if (pat < 0.5) {
  } else if (pat < 1.5) {                     // wood grain: fine wavering ink lines along u
    float g = uv.y * 1.5 + 0.09 * sin(uv.x * 0.9 + floor(uv.y * 1.5) * 1.7) + 0.03 * sin(uv.x * 3.1);
    k = aa(abs(fract(g) - 0.5) / (fw.y * 1.5), 0.75) * smoothstep(2.5, 6., 1. / (fw.y * 1.5)) * 0.6;
  } else if (pat < 2.5) {                     // page block: fine lines stacked in v
    k = aa(abs(fract(uv.y * 3.) - 0.5) / (fw.y * 3.), 0.7) * smoothstep(2.5, 6., 1. / (fw.y * 3.)) * 0.55;
  } else if (pat < 3.5) {                     // stripes along u
    float d = (0.25 - abs(fract(uv.x) - 0.5)) / fw.x;
    col = mix(base, sec, mix(0.5, smoothstep(-0.6, 0.6, d), smoothstep(2., 5., 1. / fw.x)));
  } else if (pat < 4.5) {                     // tortoise-shell hexagons
    vec2 r = vec2(1., 1.7320508), hh = r * 0.5;
    vec2 a = mod(uv, r) - hh, b = mod(uv - hh, r) - hh;
    vec2 g = abs(dot(a, a) < dot(b, b) ? a : b);
    float e = 0.5 - max(g.x, dot(g, vec2(0.5, 0.8660254)));
    col = mix(base, sec, aa(e / fl, max(1., 0.045 / fl)) * smoothstep(3., 7., 1. / fl));
  } else if (pat < 5.5) {                     // coins: overlapping circles
    vec2 p1 = fract(uv) - 0.5, p2 = fract(uv + 0.5) - 0.5;
    float e = min(abs(length(p1) - 0.5), abs(length(p2) - 0.5));
    col = mix(base, sec, aa(e / fl, max(0.9, 0.04 / fl)) * smoothstep(3., 7., 1. / fl));
  } else if (pat < 6.5) {                     // sprinkled cloud motif
    vec2 c = floor(uv), p = fract(uv) - 0.5; float h = h21(c);
    p -= (vec2(h21(c + 7.3), h21(c + 3.1)) - 0.5) * 0.3;
    if (h > 0.42) {
      float d = length(p - vec2(0., 0.02)) - 0.17;
      d = min(d, length(p - vec2(-0.17, -0.03)) - 0.11);
      d = min(d, length(p - vec2(0.16, -0.04)) - 0.12);
      d = max(d, -(p.y + 0.09));
      d = min(d, max(abs(p.y + 0.105) - 0.02, abs(p.x - 0.1) - 0.27));
      vec3 sc2 = ic == 8 && h > 0.7 ? uPal[12] : sec;         // on the shelf backs some clouds take the second motif pigment
      col = mix(base, sc2, (1. - smoothstep(-0.6, 0.6, d / fl)) * smoothstep(1.5, 4., 0.3 / fl));
    }
  } else if (pat < 7.5 || (pat > 12.5 && pat < 13.5)) {   // inset band of the second pigment along the face (7 across q.y, 13 across q.x)
    float qq = pat < 7.5 ? vQ.y : vQ.x, fqq = pat < 7.5 ? fq.y : fq.x;
    float d = (0.2 - abs(qq - 0.5)) / fqq;
    col = mix(base, sec, smoothstep(-0.6, 0.6, d));
    k = aa(abs(d), 0.6) * 0.8;
  } else if (pat < 8.5) {                     // leopard rosettes
    vec2 c = floor(uv), p = fract(uv) - 0.5; float h = h21(c);
    p -= (vec2(h21(c + 1.7), h21(c + 9.2)) - 0.5) * 0.3;
    float r = length(p), an = atan(p.y, abs(p.x) < 1e-5 ? 1e-5 : p.x), rr = 0.2 + 0.09 * h;
    float d = max(abs(r - rr) - 0.06, -(sin(an * 3. + h * 20.) + 0.5) * 0.1);
    col = mix(col, sec, 1. - smoothstep(-0.6, 0.6, (r - rr + 0.06) / fl));
    col = mix(col, ink, 1. - smoothstep(-0.6, 0.6, d / fl));
  } else if (pat < 11.5) {                    // blank title slip
    vec2 d2 = (vec2(0.3, 0.13) - abs(vQ - 0.5)) / fq; float d = min(d2.x, d2.y);
    col = mix(base, sec, smoothstep(-0.6, 0.6, d));
    k = aa(abs(d), 0.7);
  } else if (pat < 12.5) {                    // hanging scroll: cloth borders, bands, a painted disc
    float sb = min(uv.x, 1. - uv.x), band = fract(uv.y / 5.);
    if (sb < 0.13) col = sec;
    else if (band < 0.1) col = uPal[4];
    else if (band > 0.5 && band < 0.58) col = uPal[3];
    else if (length(vec2(uv.x - 0.5, (band - 0.3) * 5. * 0.3)) < 0.19) col = uPal[6];
    k = aa(abs(sb - 0.13) / fw.x, 0.6);
  } else if (pat > 24.5 && pat < 25.5) {      // cut fruit: skin of the base pigment, white pith, flesh of the second, ink seeds
    if (dS2 < 0.) discard;
    float r = length(uv);
    col = r > 0.84 ? base : (r > 0.74 ? uPal[5] : sec);
    float sa = atan(uv.y, abs(uv.x) < 1e-5 ? 1e-5 : uv.x) * 1.9099, sr = r * 4.;
    vec2 sp = vec2(fract(sa) - 0.5, (fract(sr) - 0.5) * 0.45);
    float seed = (0.16 - length(sp)) * step(r, 0.68) * step(0.2, r) * step(0.5, h21(floor(vec2(sa, sr)) + 3.));
    k = max(max(aa(dS2px, uInk), aa(abs(r - 0.74) / fl, 0.7)), smoothstep(0., 0.06, seed));
  } else if (pat > 25.5 && pat < 26.5) {      // grid: ink lines on the integer uv lines (the go board)
    vec2 g2 = abs(fract(uv + 0.5) - 0.5) / fw;
    k = aa(min(g2.x, g2.y), 0.8) * smoothstep(2., 5., 1. / fl);
  } else if (pat > 26.5 && pat < 27.5) {      // peacock eye: disc of rings, base / second / indigo / ink heart
    if (dS2 < 0.) discard;
    float r = length(uv * vec2(1., 0.8) + vec2(0., 0.1));
    col = r > 0.62 ? base : (r > 0.42 ? sec : (r > 0.2 ? uPal[2] : ink));
    k = aa(dS2px, uInk);
  } else if (pat > 27.5 && pat < 28.5) {      // ring: a rim of the base pigment round a field of the second
    if (dS2 < 0.) discard;
    float r = length(uv);
    col = r > 0.8 ? base : sec;
    k = max(aa(dS2px, uInk), aa(abs(r - 0.8) / fl, 0.7));
  } else if (pat > 28.5 && pat < 29.5) {      // hoop: only a rim of the base pigment, nothing inside
    float r = length(uv);
    if (dS2 < 0. || r < 0.8) discard;
  } else if (pat < 21.5 && pat > 20.5) {      // leaf: two flat tones, ink midrib
    if (dS < 0.) discard;
    col = uv.x < 0. ? base : mix(base, ink, 0.26);
    k = max(aa(dSpx, uInk), aa(abs(uv.x) / fw.x, 0.7) * step(t, 0.9));
  } else if (pat < 22.5 && pat > 21.5) {      // disc with a centre
    if (dS < 0.) discard;
    float r = length(uv);
    col = r < 0.45 ? sec : base;
    k = max(aa(dSpx, uInk), aa(abs(r - 0.45) / fl, 0.7));
  } else {                                    // petals (20 stepped, 23 edged with the second pigment, 24 lotus)
    if (dS < 0.) discard;
    float st = t < 0.3 ? 0.42 : (t < 0.58 ? 0.2 : 0.);
    col = pat > 22.5 && pat < 23.5 ? (dS < 0.16 ? sec : base) : mix(base, sec, st);
    k = max(aa(dSpx, uInk), aa(vxpx, 0.6) * step(0.06, t) * step(t, 0.74) * 0.7);
  }
  // even ink line along every face edge, and the silhouette of round things
  vec2 e2 = min(vQ, 1. - vQ) / fq;
  float lw = min(uInk, min(1. / fq.x, 1. / fq.y) * 0.25);
  k = max(k, aa(min(e2.x, e2.y), lw));
  k = max(k, aa(vNdv / fn, uInk * 1.3) * step(vNdv, 0.9995));
  col *= 0.985 + 0.03 * h21(floor(uv * vec2(2.5, 31.)));      // paper tooth, within 3 %
  gl_FragColor = vec4(mix(col, ink, clamp(k, 0., 1.)), 1.);
  #include <fog_fragment>
}`,Aa=`
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,ka=`
uniform vec3 uPaper; uniform vec3 uInkC;
varying vec3 vDir;
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float fibres(vec2 p, float ang, float n) {
  float c = cos(ang), s = sin(ang); p = vec2(c * p.x + s * p.y, -s * p.x + c * p.y) * n;
  vec2 cell = floor(p * vec2(0.12, 1.)); float h = h21(cell);
  float y = fract(p.y) - 0.5 + 0.25 * sin(p.x * 0.35 + h * 6.28);
  float x = fract(p.x * 0.12) - 0.5;
  return step(0.72, h) * (1. - smoothstep(0.02, 0.07, abs(y))) * (1. - smoothstep(0.3, 0.45, abs(x)));
}
void main() {
  vec3 d = vDir / max(length(vDir), 1e-4);
  vec3 ad = abs(d);
  vec2 p = ad.z > max(ad.x, ad.y) ? d.xy / ad.z : (ad.x > ad.y ? d.zy / ad.x : d.xz / ad.y);
  float f = fibres(p, 0.4, 26.) + fibres(p + 3.7, 1.9, 34.) + fibres(p - 1.3, 2.7, 22.);
  vec2 fc = floor(p * 70.), ff = fract(p * 70.) - 0.5;
  float fleck = step(0.975, h21(fc)) * (1. - smoothstep(0.12, 0.3, length(ff - (vec2(h21(fc + 2.1), h21(fc + 5.3)) - 0.5) * 0.4)));
  vec3 col = uPaper * (1. + 0.07 * min(f, 1.)) ;
  col = mix(col, mix(uPaper, uInkC, 0.3), fleck * 0.7);
  gl_FragColor = vec4(col, 1.);
}`,le=1.3,re=9.2,fe=4.17,pe=22,Re=54,Ee=d=>-d/690,Le=[0,-.016,-.012,-.008,-.004,.07,.13,.22,.46],Ma=[.03,.024,.026,.028,.032,.03,.03,.035,.04],Pa=[1.1593,1.25,1.45,1.5,1.5,1.1593,1.1593,1.1593,1.1593],Ba=d=>Le[d];async function qa(d,A={}){const l=d.rng,z=d.quality?.detail??1,c0=(A.palette&&A.palette.length>=7?A.palette:va).slice(0,7).map(t=>new O.Color(t)),P0=l.pick(["indigo","indigo","indigo","vermilion","ink"]),X=l.pick(["peony","peony","lotus","chrysanthemum","plum"]),j=l.pick(["striped","striped","spotted"]),V=l.pick(["leopard","leopard","tiger"]),C=A.backs||P0,e0=A.flower||X,n0=A.cat||j,a0=A.rare??!!(d.vary&&d.vary.rare),z0=A.curtain===!1?"none":typeof A.curtain=="string"?A.curtain:n0==="spotted"?"leopard":V,N=c0.map(t=>t.clone());N[gt]=c0[C==="vermilion"?E:C==="ink"?i:f0].clone(),N[yt]=c0[P].clone(),N[Gt]=c0[e0==="chrysanthemum"?P:M].clone(),N[wt]=c0[e0==="chrysanthemum"?M:E].clone(),N[se]=c0[P].clone(),N[ma]=c0[C==="ink"?M:P].clone();const $={uPal:{value:N},uInk:{value:1.7*(A.inkScale??1)},uTime:{value:0},uU:{value:0},uHinge:{value:new Float32Array(10)},uAng:{value:new Float32Array(8)}},V0=t=>new O.ShaderMaterial({vertexShader:ya,fragmentShader:wa,side:O.DoubleSide,fog:!!A.fog,defines:t?{ANIM:1}:{},uniforms:{...O.UniformsUtils.clone(O.UniformsLib.fog),...$}}),q0=V0(!1),u0=V0(!0),w=Zt(!1),r=Zt(!0),g0=new O.Group;g0.name="scholars-shelves";const L0=(t,a,e,o,c,n,s,f=15)=>$0(t,E0(a,o,n),E0(e,o,n),E0(e,c,n),E0(a,c,n),a*s,o*s,e*s,c*s,f),m0=(t,a,e,o,c,n,s,f=0)=>{const p=(c-n)/G(c);$0(t,E0(a,e,c),E0(a,e,n),E0(a,o,n),E0(a,o,c),0,e*s,p*s,o*s,f)},y0=(t,a,e,o,c,n,s,f=0)=>{const p=(c-n)/G(c);$0(t,E0(a,o,c),E0(a,o,n),E0(e,o,n),E0(e,o,c),0,a*s,p*s,e*s,f)},q=(t,a,e,o)=>{t.P[0]=a,t.P[1]=e,t.P[2]=o},s0=(t,a,e,o,c)=>{t.A[0]=a,t.A[1]=e,t.A[2]=o,t.A[3]=c},i0=(t,a,e,o,c)=>{t.B[0]=a,t.B[1]=e,t.B[2]=o,t.B[3]=c},p0=t=>{s0(t,0,0,0,0),i0(t,0,0,0,0)},vt=C==="ink"?.46:.3,Y0=[I,E,R0],he=[I,E,Vt],Ot=[I,i,ut],b0=[P,i,U],jt=[I,i,U];for(let t=0;t<9;t++){const a=t0[t],e=t0[t+1],o=a-e,c=t===8,n=c?re:W0,s=t===0?1.4:.05*(t0[t-1]-a);if(q(w,I,i,ut),y0(w,-b,-v0,F,a,e,.55,8),y0(w,-v0,-9.9,F,a,e,.55,4),y0(w,9.9,v0,F,a,e,.55,8),y0(w,v0,b,F,a,e,.55,4),q(w,R,i,U),y0(w,-9.9,-9,F,a,e,1,12),y0(w,9,9.9,F,a,e,1,12),q(w,I,P,ct),y0(w,-9,9,F,a,e,.3,0),q(w,I,i,ut),c||(y0(w,-b,-v0,W0,a,e,.55,8),y0(w,-v0,v0,W0,a,e,.55,12),y0(w,v0,b,W0,a,e,.55,4)),m0(w,-b-.3,F,n,a,e,.55,15),c||m0(w,b+.3,F,n,a,e,.55,15),q(w,gt,yt,ft),m0(w,-b,F,n,a,e,vt),c){if(q(r,gt,yt,ft),s0(r,7,1,-1,0),i0(r,b*G(a),0,a,1),m0(r,b,F,n,a,e,vt,15),q(r,I,i,ut),m0(r,b+.3,F,n,a,e,.55,15),a0){q(r,I,E,R0);const p=(v,h)=>$0(r,E0(b-.12,v,a),E0(b-.12,v,e),E0(b-.12,h,e),E0(b-.12,h,a),0,0,1,1,15);p(n-1.1,n),p(F,F+.9)}p0(r)}else{m0(w,b,F,n,a,e,vt);const p=e+.5*.05*o;L0(w,-b,-v0,F,W0,p,vt,15),L0(w,v0,b,F,W0,p,vt,15)}const f=a+s;S0(w,-b,b,W0-.8,W0,f,a,{faces:{front:Y0,bottom:Ot},k:.55}),S0(w,-b,b,F,F+.4,f,a,{faces:{front:Y0,top:jt}});for(const p of[-1,1]){const v=p*v0,h=p*(b-.45);S0(w,v-.7,v+.7,F+.4,W0-.8,f,a,{faces:{front:he,left:b0,right:b0}}),S0(w,h-.45,h+.45,F+.4,W0-.8,f,a,{faces:{front:he,left:b0,right:b0}});const x=c?3:1;for(let k=1;k<=x;k++){if(a0&&c&&p>0&&k===3)continue;const m=a-k/(x+1)*o;S0(w,v-.6,v+.6,F,n,m,m-.045*o,{faces:{front:he,left:b0,right:b0,top:c?jt:null}})}}if(t!==7)for(const p of[-1,1])S0(w,p>0?v0+.7:-b+.9,p>0?b-.9:-v0-.7,le,le+.45,a-.03*o,a0&&c&&p>0?a-.42*o:e+.05*o,{faces:{front:Y0,top:jt,bottom:Ot,back:a0&&c&&p>0?Y0:null},k:.55});if(c)for(const p of[-1,1])S0(w,p*v0-.6,p*v0+.6,re,re+.5,a,a0&&p>0?a-.55*o:e,{faces:{front:Y0,left:Y0,right:Y0,top:jt,bottom:Ot,back:a0&&p>0?Y0:null},k:.55});(t&1)===1&&await d.yield()}const D0=xa("panels:"+d.seed),It=t=>t[Math.min(t.length-1,D0()*t.length|0)],Ce=C==="ink",w0=C==="vermilion"?f0:E,I0=C==="vermilion"?f0:R,Xt=Ce?P:i;let A0=null;const Z0=(t,a,e,o,c,n,s)=>A0.fold?(s0(r,1,A0.i,A0.k,t/5),N0(r,[0,A0.y0+a*A0.s,A0.zw+e*A0.pw],o,c,1,n,s)):N0(w,[(A0.a0+A0.dir*t)*A0.s,A0.y0+a*A0.s,A0.zw+e*A0.pw],o,c,1,n,s),de=t=>(A0.fold?r:w).idx.push(t,t+1,t+2,t,t+2,t+3),L=(t,a,e,o,c,n,s,f,p=1,v=15)=>{q(A0.fold?r:w,n,s,f);const h=f===ce,x=h?0:t*p,k=h?1:a*p,m=v&1?0:.5,u=v&2?1:.5,g=v&4?0:.5,y=v&8?1:.5,S=Z0(t,e,c,x,e*p,m,g);Z0(a,e,c,k,e*p,u,g),Z0(a,o,c,k,o*p,u,y),Z0(t,o,c,x,o*p,m,y),de(S)},Q=(t,a,e,o,c,n,s,f,p,v=0)=>{q(A0.fold?r:w,s,f,p);const h=Math.cos(c),x=Math.sin(c),k=v?0:.5,m=v?1:.5,u=Z0(t-h*e+x*o,a-x*e-h*o,n,-1,-1,k,k);Z0(t+h*e+x*o,a+x*e-h*o,n,1,-1,m,k),Z0(t+h*e-x*o,a+x*e+h*o,n,1,1,m,m),Z0(t-h*e-x*o,a-x*e+h*o,n,-1,1,k,m),de(u)},Fe=(t,a=.55,e=4.45)=>{q(A0.fold?r:w,P,i,U);const o=Z0(a-.2,t,.065,0,0,0,0);Z0(e+.2,t,.065,1,0,1,0),Z0(e,t-.12,.21,1,1,1,1),Z0(a,t-.12,.21,0,1,0,1),de(o),L(a,e,t-.5,t-.1,.21,I,w0,R0)},Z=.12,l0=.14,O0=.16,Jt=[t=>{let a=t;const e=2+(D0()*3|0);for(let o=0;o<e;o++){const c=1.75-.13*o+D0()*.15,n=2.5+(D0()-.5)*.3,s=It([R,P,M,I,w0]),f=.72+D0()*.25;o%2?L(n-c,n+c,a,a+f,Z,M,i,st,1.3):L(n-c,n+c,a,a+f,Z,s,s===M?I:M,At),a+=f}Q(2.5,a+.42,.5,.42,0,l0,M,I0,qt)},t=>{L(2.5-.5,2.5+.5,t,t+.4,Z,I0,i,0),L(2.5-1.75,2.5+1.75,t+.4,t+.85,Z,M,I0,R0),Q(2.5-.9,t+1.65,.85,.85,.3,l0,E,M,_e),D0()<.5?Q(2.5+.85,t+1.7,.9,.9,-.4,l0+.004,R,E,_e):Q(2.5+.85,t+1.75,.8,.95,0,l0+.004,M,E,Ft),Q(2.5,t+2.75,.72,.72,0,O0,P,I,k0),Q(2.5+.95,t+3.05,.28,.6,-.9,O0+.004,R,i,lt)},t=>{L(.9,3.3,t,t+.85,Z,R,M,it,1.6),Q(2.1,t+1.02,.95,.3,0,l0,i,f0,k0),L(3.55,4,t,t+2.5,Z,Ce?f0:i,P,R0),Q(1.25,t+1.75,.5,.5,0,l0,M,w0,k0),Q(2.3,t+2.75,.1,1.25,1.25,O0,I,w0,R0,1),Q(.92,t+2.3,.2,.42,1.25,O0,M,i,Mt)},t=>{L(.8,4.2,t,t+.45,Z,I0,i,0),L(.95,2.45,t+.45,t+1.25,Z,M,i,st,1.4),L(2.55,4.05,t+.45,t+1.25,Z,M,i,st,1.4),Q(1.72,t+2.2,.74,.74,0,l0,Xt,I,qt),Q(3.28,t+2.2,.74,.74,0,l0,Xt,I,qt),L(2.4,2.6,t+2.14,t+2.3,l0,Xt,Xt,0,1,0)},t=>{const a=[2.3,3.1,1.7],e=[M,R,P];for(let o=0;o<3;o++){const c=.95+o*1.1;L(c,c+.85,t,t+.32,Z,w0,i,0),L(c,c+.85,t+.32,t+a[o],Z,e[o],e[o]===M?I0:M,o===1?it:U,2.2),Q(c+.42,t+a[o]+.3,.32,.32,0,l0,e[(o+1)%3],i,k0)}},t=>{L(1,4,t,t+.5,Z,I,i,ut,1),L(1,4,t+.5,t+3.4,Z,P,i,$e,2.34);const e=Math.ceil((t+.75)*2.34),o=Math.floor((t+3.2)*2.34);for(let c=0;c<9;c++){const n=3+(D0()*7|0),s=e+(D0()*(o-e+1)|0),f=c%2?M:i;Q(n/2.34,s/2.34,.19,.19,0,l0+c*.001,f,f,k0)}},t=>{const e=It([P,R,M]);Q(2.2,t+1.15,1.2,1.15,0,Z,e,e,k0),Q(2.2,t+2.72,.76,.72,0,l0,e,e,k0),L(2.2-.16,2.2+.16,t+3.32,t+3.8,Z,I0,i,0),L(2.2-.8,2.2+.8,t+2,t+2.22,O0,w0,i,0),Q(2.2+.95,t+1.45,.22,.62,Math.PI,O0,w0,P,lt),L(3.6,4.3,t,t+.75,Z,M,I0,R0)},t=>{L(2.5-1,2.5-.68,t,t+.7,Z,P,i,0),L(2.5+.68,2.5+1,t,t+.7,Z,P,i,0),Q(2.5,t+1.5,1.5,1,0,l0,P,I0,qt),L(2.5-.9,2.5+.9,t+2.3,t+2.6,Z,I0,i,0),Q(2.5,t+2.85,.3,.3,0,l0,w0,w0,k0);for(let e=0;e<3;e++)Q(2.5+(e%2?.4:-.25),t+3.4+e*.42,.24+e*.09,.2+e*.07,0,O0+e*.002,M,M,k0)}],$t=[t=>{L(2.5-.75,2.5+.75,t,t+.3,Z,I0,i,0),Q(2.5,t+1.55,1.45,1.3,0,l0,M,It([I0,P,w0]),k0),L(2.5-.5,2.5+.5,t+2.75,t+3.15,Z,M,I0,R0);for(let e=-1;e<=1;e++){const o=e*.42+(D0()-.5)*.1,c=1.7+D0()*.6,n=Math.sin(o),s=Math.cos(o);Q(2.5+n*c*.5,t+3.15+s*c*.5,.05,c*.5,-o,l0,P,P,0),Q(2.5+n*(c+.45),t+3.15+s*(c+.45),.5,.62,-o,O0+e*.002,R,P,Ye)}},t=>{L(2.5-1.5,2.5+1.5,t,t+.5,Z,I,w0,R0),L(2.5-1.2,2.5+1.2,t+.5,t+2.6,Z,P,i,ct,2.2),L(2.5-.7,2.5+.7,t+.8,t+2.3,l0,M,i,0),L(2.5-.05,2.5+.05,t+1.3,t+2.3,O0,P,P,0,1,0),Q(2.5,t+1.25,.3,.3,0,O0,P,w0,k0),L(2.5-1.4,2.5+1.4,t+2.6,t+5,Z,R,M,it,2.2),Q(2.5,t+3.8,1.05,1.05,0,l0,M,M,k0);for(let e=0;e<8;e++){const o=e/8*M0;Q(2.5+Math.sin(o)*.78,t+3.8+Math.cos(o)*.78,.08,.08,0,O0,i,i,0)}Q(2.5+.17,t+3.97,.045,.3,-.75,O0+.002,i,i,0),Q(2.5-.2,t+3.6,.045,.3,-.75,O0+.002,i,i,0),L(2.5-.9,2.5+.9,t+5,t+5.4,Z,w0,i,0)},t=>{L(.9,4.1,t,t+.4,Z,I0,i,0),L(1,1.25,t+.4,t+5.2,Z,P,i,0),L(3.75,4,t+.4,t+5.2,Z,P,i,0),L(.75,4.25,t+5,t+5.4,l0,I,w0,R0);for(let a=0;a<4;a++){const e=1.6+a*.6,o=2.2+D0()*1.2,c=It([I,R,M,P]);L(e-.11,e+.11,t+5-o,t+5,Z,c,w0,R0),Q(e,t+5-o-.45,.2,.5,Math.PI,l0,M,i,Mt)}},t=>{L(2.5-.9,2.5+.9,t,t+.45,Z,I0,i,0),L(2.5-.12,2.5+.12,t+.45,t+2.4,Z,P,i,0),Q(2.5,t+3.8,1.75,1.6,0,l0,It([P,R,I]),M,qt),Q(2.5,t+3.8,.55,.55,0,O0,w0,P,k0),Q(2.5+.3,t+1.75,.2,.55,Math.PI,O0,w0,P,lt)},t=>{L(2.5-.7,2.5+.7,t,t+.35,Z,I0,i,0),L(2.5-1.2,2.5+1.2,t+.35,t+1.9,Z,M,I0,ct,2.4),L(2.5-1.35,2.5+1.35,t+1.9,t+2.2,l0,I0,i,0);const e=(o,c,n,s,f,p)=>{if(Q(o+Math.sin(n)*s*.5,c+Math.cos(n)*s*.5,f,s*.5+f*.5,-n,l0+p*.003,w0,w0,0),p>=3)return;const v=o+Math.sin(n)*s,h=c+Math.cos(n)*s;e(v,h,n-.45-D0()*.2,s*.68,f*.78,p+1),e(v,h,n+.4+D0()*.2,s*.62,f*.78,p+1)};e(2.5,t+2.1,-.05,1.35,.15,0)}],ta=(t,a)=>{const c=Math.min(5.4,a-t-1.4),n=a-.15,s=It([R,P,I0,I]);L(2.5-1.25-.2,2.5+1.25+.2,n-.3,n,l0,P,i,0),L(2.5-1.25,2.5+1.25,n-.3-c,n-.3,Z,M,s,ce,1.7),L(2.5-1.25-.25,2.5+1.25+.25,n-.62-c,n-.3-c,l0,P,i,0);for(const f of[-1,1])Q(2.5+f*(1.25+.12),n-1.15-c,.2,.55,Math.PI,O0,w0,P,lt)},De=[[2.05,7.75],[9.35,16.3],[17.75,22]];let Oe=[],je=[];const Yt=(t,a)=>{if(!t.length){for(let e=0;e<a;e++)t.push(e);for(let e=a-1;e>0;e--){const o=D0()*(e+1)|0,c=t[e];t[e]=t[o],t[o]=c}}return t.pop()},ea=()=>{for(let t=0;t<3;t++){const a=De[t][0],e=De[t][1],o=D0();if(t<2&&o<.2){ta(a,e);continue}Fe(a),t===2||o>.72?Jt[Yt(Oe,Jt.length)](a):$t[Yt(je,$t.length)](a)}};for(let t=1;t<9;t++){const a=t0[t]-.4,e=G(a),o=2*v0*e/6,c=o/e,n=(F+.4)*e,s=(W0-.8)*e,f=(s-n)/e,p=(v,h,x,k,m,u,g,y)=>{const S=n+(s-n)*m,T=n+(s-n)*u,_=vt,H=(Y,C0,_0,x0)=>{s0(r,1,t,h,Y),N0(r,[0,C0,a+g],(h+Y)*c*_+t*3.3,(C0-n)/e*_,1,_0,x0)},W=r.n;H(x,S,0,0),H(k,S,1,0),H(k,T,1,1),H(x,T,0,1),r.idx.push(W,W+1,W+2,W,W+2,W+3)};for(const v of[-1,1])for(let h=0;h<3;h++){i0(r,v*o,v*v0*e,Pa[t],0),q(r,I,E,U),p(v,h,0,1,0,1,0);const x=.1,k=.1*c/f;q(r,gt,yt,ft),p(v,h,x,1-x,k*2.2,1-k*1.2,.04*o),q(r,C==="vermilion"?f0:E,P,U),p(v,h,x,1-x,k*.7,k*1.6,.04*o),q(r,I,E,U),p(v,h,x,1-x,.345,.37,.06*o),p(v,h,x,1-x,.72,.745,.06*o),A0={fold:!0,i:t,k:h,s:e,zw:a,pw:o,y0:n},ea()}p0(r),await d.yield()}await d.yield();const ue=(t,a,e,o,c,n)=>{A0={fold:!1,a0:t/o-2.5,dir:1,s:o,zw:e,pw:c,y0:a-.6*o},Fe(.6),(n?$t[Yt(je,$t.length)]:Jt[Yt(Oe,Jt.length)])(.6)};for(let t=0;t<8;t++){const a=t0[t]-t0[t+1],e=t0[t+1]+.025*a,o=G(e);for(const c of[-1,1])for(const n of[18.9,26.1])ue(c*n*o,2.7*o,e+.01*a,o*1.42,2.2*o,D0()<.75)}{const t=t0[9]+.5;for(const a of[-34,0,34])ue(a,-61,t,4.8,5,!0);for(const a of[-70,70])a0&&a>0||ue(a,-30,t,4.8,5,!0)}await d.yield();for(let t=0;t<9;t++){const a=t===0?1.4:.05*(t0[t-1]-t0[t]),e=t0[t]+a*.5,o=G(e),c=(W0-.8)*o;for(const n of[-1,1]){const s=n*7.5*o,f=l.range(0,M0);s0(r,4,f,1.1,.16),i0(r,s,c,e,2),q(r,E,i,U),J(r,[s-.07*o,c-1.5*o,e],[s+.07*o,c-1.5*o,e],[s+.07*o,c,e],[s-.07*o,c,e],[0,0],[1,0],[1,1],[0,1],3),F0(r,[s,c-2*o,e+.02*o],[.62*o,0,0],[0,.62*o,0],R,t%2?M:P,k0),F0(r,[s,c-3.7*o,e+.04*o],[.5*o,0,0],[0,-1.15*o,0],E,P,lt)}}p0(r);const aa=[R,P,M,I,R,P,M,C==="indigo"?E:f0,E],ve=(t,a,e,o,c,n,s,f,p,v,h=F)=>{const x=G(o),k=t0[a]-t0[a+1];for(let m=0;m<n;m++){const u=h+m*p,g=u+p*.93,y=l.pick(aa),S=l.pick([P,R,I,M].filter(at=>at!==y)),T=l.pick([U,ct,it,Wt,At,At,st]),_=T===st?[M,i,st]:T===At?[y,y===M?I:M,At]:[y,y===M||y===I?R:l.pick([M,i,P]),T],H=l.chance(.65)?[M,i,st]:[y===M?R:y,M,At],W=l.range(-.5,.5),Y=l.chance(v)&&!(a===1&&e>0),C0=l.range(3,7.5)*(a===2||a===7?1:.68)*x,_0=l.range(.55,1.25),x0=l.range(.012,.026);Y?s0(t,2,Ee(o)-_0*k/690,x0,-e*C0):s0(t,0,0,0,0);const H0=e>0?s+W:-f+W,Q0=e>0?f+W:-s+W;S0(t,H0,Q0,u,g,o,c,{k:.8,uo:m*1.37,faces:{front:_,left:e>0?H:null,right:e<0?H:null,top:[S,i,U],bottom:[S,i,U]}})}s0(t,0,0,0,0)},oa=(t,a,e,o,c)=>{const n=G(o),s=a*n,f=e*n,p=l.pick([M,R,P,M]),v=l.pick([f0,E,R,P].filter(x=>x!==p&&!(x===f0&&C==="indigo"))),h=x=>x.map(k=>[k[0]*n,f+k[1]*n,k[2],k[3]??i,k[4]??0,k[5]??6,k[6]??3]).concat([[.01,f+x[x.length-1][1]*n-.05*n]]);if(p0(t),c===0)Dt(t,s,o,h([[1,0,v,i,0,6,1],[1.5,.4,p,i,0,6,1],[2.3,2.2,p,v,ft,7,3],[2.25,3.5,p,i,0,6,0],[.95,5.3,v,i,0,6,3],[.7,5.9,p,i,0,6,0],[.75,7,v,i,0,6,3],[1.15,7.5,i]]),20);else if(c===1){Dt(t,s,o,h([[1.3,0,v,i,0,6,1],[1.5,.5,p,v,it,14,3],[3.3,2.6,v,i,0,6,3],[3.4,3,i]]),20);for(let x=0;x<4;x++){const k=s+(x-1.5)*1.5*n,m=f+(3.6+x%2*1.5+(x===1?.6:0))*n,u=(1.25+.2*(x%2))*n;F0(t,[k,m,o+(.3+x*.12)*n],[u,0,0],[0,u,0],x%2?P:E,x%2?E:P,k0)}}else{Dt(t,s,o,h([[1.5,0,p,i,0,6,1],[2.6,1.3,p,v,ct,18,3],[2.7,2.6,v,i,0,6,3],[1.9,3.3,p,i,0,6,0],[2.1,3.8,i]]),20);for(let x=0;x<7;x++){const k=(x-3)*.3+l.range(-.08,.08),m=l.range(3.4,5.2)*n,u=l.range(0,M0),g=Math.sin(k),y=Math.cos(k);s0(t,6,u,.9,1),i0(t,.35*n*y,-.35*n*g,0,0),F0(t,[s+g*m,f+3.6*n+y*m,o+x*.06*n],[y*m*.3,-g*m*.3,0],[g*m,y*m,0],R,i,lt)}p0(t)}};for(let t=0;t<9;t++){const a=t0[t],e=a-t0[t+1],o=t===7?4:t===8?5:2;for(const c of[-1,1])for(let n=0;n<o;n++){if(a0&&t===8&&c>0&&n>=2)continue;const s=a-e*(.1+n/o*.86),f=s-e*.86*.8/o;if(t===7){ve(r,t,c,s,f,10,17.2,28.2,2.15,.75);continue}ve(r,t,c,s,f,l.int(2,5),17.2,28.2,2,t===2?.75:.4);const p=l.int(0,5),v=s-(s-f)*.5;p<=1?ve(r,t,c,s-(s-f)*.12,f+(s-f)*.12,l.int(2,t===8?3:5),18.6,26.4,1.6,t===2?.7:.3,le+.45):p<=4&&oa(r,c*l.range(20.5,24.5),le+.45,v,p-2)}(t&1)===1&&await d.yield()}await d.yield();const na=(t,a,e,o,c)=>{const n=G(t),s=a*v0*n,f=e*n*.5,p=(W0-1.7)*n,v=o*n,h=t+.012*690*.02*n,x=Ee(t)-2.5*v0*n/690,k=1.5*v0*n/690,m=l.range(0,M0),u=16;q(r,P,i,U),p0(r),J(r,[s-f*1.12,p,h],[s+f*1.12,p,h],[s+f*1.12,p+.45*n,h],[s-f*1.12,p+.45*n,h],[0,0],[1,0],[1,1],[0,1],15),q(r,M,c,ce);for(let g=0;g<u;g++){const y=g/u,S=(g+1)/u,T=_=>{const H=_<2?S:y;s0(r,3,x,k,H),i0(r,v,m,.1*n*H,0)};J(r,[s-f,p,h],[s+f,p,h],[s+f,p,h],[s-f,p,h],[0,S*o],[1,S*o],[1,y*o],[0,y*o],3,T)}s0(r,3,x,k,1),i0(r,v,m,.1*n,0),q(r,P,i,U),J(r,[s-f*1.08,p-.32*n,h+.05*n],[s+f*1.08,p-.32*n,h+.05*n],[s+f*1.08,p+.32*n,h+.05*n],[s-f*1.08,p+.32*n,h+.05*n],[0,0],[1,0],[1,1],[0,1],15);for(const g of[-1,1]){const y=s+g*f*1.2;q(r,E,i,U),i0(r,v,m,.1*n,0),J(r,[y-.22*n,p-.42*n,h+.08*n],[y+.22*n,p-.42*n,h+.08*n],[y+.22*n,p+.42*n,h+.08*n],[y-.22*n,p+.42*n,h+.08*n],[0,0],[1,0],[1,1],[0,1],15),i0(r,v,m+g,.45*n,0),F0(r,[y,p-1.7*n,h+.1*n],[.42*n,0,0],[0,-1.35*n,0],E,P,lt)}p0(r)},sa=[4,5,6,l.pick([2,3,7])];for(const t of sa){const a=.05*(t0[t-1]-t0[t]),e=l.pick([R,P,f0]);for(const o of[-1,1])na(t0[t]+a,o,3.6,l.range(14.5,17),e)}if(await d.yield(),z0!=="none"){const s=z0==="tiger";i0(r,28,0,0,0);for(let f=0;f<30;f++)for(let p=0;p<40;p++){const v=-17+p/40*34,h=-34/2+(p+1)/40*34,x=f/30,k=(f+1)/30,m=f===29,u=p<2||p>=38||f>=27||f<1;q(r,m?f0:u?E:se,s?i:M,m||u?U:s?Wt:Ie);const g=(S,T)=>s0(r,8,T[0]/(34/2),S<2?k:x,0),y=(S,T)=>s?[T*28/2.4+.22*Math.sin(S*.55+T*9),S/2.4]:[S/2.5,T*28/2.5];J(r,[v,15.5,-32],[h,15.5,-32],[h,15.5,-32],[v,15.5,-32],y(v,k),y(h,k),y(h,x),y(v,x),(p===0?1:0)|(p===39?2:0)|(m?4:0)|((f===27||f===1)&&u&&f===27?8:0),g)}p0(r),q(r,P,i,U),J(r,[-34/2-1.2,15.5-.1,-32+.2],[34/2+1.2,15.5-.1,-32+.2],[34/2+1.2,15.5+.7,-32+.2],[-34/2-1.2,15.5+.7,-32+.2],[0,0],[1,0],[1,1],[0,1],15);for(const f of[-1,1])s0(r,4,f,1.2,.22),i0(r,f*13.5,15.5,-32+.4,2),q(r,E,i,U),J(r,[f*13.5-.14,15.5-4.2,-32+.4],[f*13.5+.14,15.5-4.2,-32+.4],[f*13.5+.14,15.5,-32+.4],[f*13.5-.14,15.5,-32+.4],[0,0],[1,0],[1,1],[0,1],3),F0(r,[f*13.5,15.5-5.6,-32+.45],[.75,0,0],[0,-1.6,0],E,P,lt);p0(r)}const me=[C==="vermilion"?f0:E,i,U],mt=-50,Pt=-80,bt=3.2,xe=13,Bt=bt/G(mt),ge=xe/(Bt*G(Pt)),K0=-7.5,He=[P,C==="vermilion"?f0:E,it];S0(w,-Bt,Bt,K0-.75,K0,mt,Pt,{f:ge,ay:1,k:2,faces:{front:[I,me[0],R0],top:me,left:He,right:He,bottom:b0}}),S0(w,-Bt*.86,Bt*.86,K0-.1,K0+.03,mt-.5,Pt+.5,{f:ge,ay:1,faces:{top:[P,i,U]}}),S0(w,-Bt*.78,Bt*.78,K0-.1,K0+.06,mt-.9,Pt+.9,{f:ge,ay:1,faces:{top:me}});for(const[t,a]of[[.03,1.4],[.5,1.6],[.93,2]]){const e=mt+(Pt-mt)*t,o=(bt+(xe-bt)*t)/G(e)*.86;for(const c of[-1,1])S0(w,c*o-.28,c*o+.28,F,K0-.75,e,e-a,{f:1.15,faces:{front:b0,left:[R,i,U],right:[R,i,U]}})}const Ht=-54.6,ye=K0+.65;S0(w,-1.3,1.3,K0,ye,Ht,Ht-4.6,{f:1.42,faces:{front:[R,M,it],left:[f0,i,U],right:[f0,i,U],top:[R,i,U]},k:1.4});const pt=E0(0,ye+.2,Ht-2.7);{p0(r),F0(r,[pt[0],pt[1]+.05,pt[2]],[1.6,0,0],[0,0,-1.8],i,f0,k0);for(let t=0;t<3;t++)s0(r,13,t/3,.42,0),i0(r,pt[0],pt[1]+.09+t*.02,pt[2],0),F0(r,[pt[0],pt[1]+.09+t*.02,pt[2]],[1.45,0,0],[0,0,-1.63],M,i,be);p0(r)}const Tt={x:15.7,z:-72,y:F*G(-72),r:4.7,h:9.6};{const{x:t,z:a,y:e,r:o}=Tt,c=P,n=C==="indigo"?M:I;p0(r),Dt(r,t,a,[[o*.94,e,i,i,0,6,0],[o*.97,e+.5,c,i,0,6,1],[o,e+3.1,c,i,0,6,3],[o*1.035,e+3.3,c,i,0,6,3],[o,e+3.5,c,i,0,6,1],[o,e+5.4,n,f0,ct,22,3],[o,e+7.3,c,i,0,6,3],[o*1.035,e+7.5,c,i,0,6,3],[o,e+7.7,c,i,0,6,1],[o*1.02,e+9.2,E,i,0,6,3],[o*.97,e+9.6,i,i,0,6,0],[.01,e+9.3,i,i,0,6,0]],28);const s=7;for(let f=0;f<s;f++){const p=(f+.5)/s-.5,v=t+p*o*1.5,h=p*.55+l.range(-.06,.06),x=l.range(11.5,14.5),k=l.range(.22,.32),m=e+8.9,u=a+l.range(-1.2,1.2),g=v+Math.sin(h)*x,y=m+Math.cos(h)*x,S=l.range(0,M0),T=Math.cos(h)*k,_=-Math.sin(h)*k,H=l.pick([I,R,P,f0,M]),W=C0=>{s0(r,6,S,1.1,C0<2?0:1),i0(r,.5,0,0,0)};q(r,H,E,Vt),J(r,[v-T,m-_,u],[v+T,m+_,u],[g+T,y+_,u],[g-T,y-_,u],[0,0],[1,0],[1,1],[0,1],15,W),s0(r,6,S,1.1,1.15),i0(r,.5,0,0,0);const Y=l.range(1.5,2.2);F0(r,[g+Math.sin(h)*Y*.9,y+Math.cos(h)*Y*.9,u+.05],[Math.cos(h)*Y*.5,-Math.sin(h)*Y*.5,0],[Math.sin(h)*Y,Math.cos(h)*Y,0],f%3===0?i:M,i,Mt)}s0(r,4,1.3,1.6,.35),i0(r,t-o*.5,e+8.6,a+o*.9,2),F0(r,[t-o*.5,e+6.9,a+o*.9],[.5,0,0],[0,-1.7,0],E,P,lt),p0(r)}await d.yield();const B=t0[9],j0=G(B),St=22,te=8;{const t=b*j0,a=a0?Re:t,e=F*j0,o=re*j0,c=[];for(let m=0;m<48;m++)c.push(m/48*M0);for(const[m,u]of[[a,o],[-t,o],[-t,e],[a,e]])c.push((Math.atan2(u,m)+M0)%M0);c.sort((m,u)=>m-u);const n=m=>{const u=Math.cos(m),g=Math.sin(m),y=Math.min(u>1e-6?a/u:u<-1e-6?-t/u:1e9,g>1e-6?o/g:g<-1e-6?e/g:1e9);return[u*y,g*y,B]},s=m=>[m[0]/j0*vt,m[1]/j0*vt];q(w,gt,yt,ft);for(let m=0;m<c.length;m++){const u=c[m],g=m+1<c.length?c[m+1]:c[0]+M0,y=[Math.cos(u)*St,Math.sin(u)*St,B],S=[Math.cos(g)*St,Math.sin(g)*St,B],T=n(u),_=n(g);J(w,y,S,_,T,s(y),s(S),s(_),s(T),0);const H=Y=>[Y[0],Y[1],B-.8],W=Y=>[Y[1]/j0*.55,Y[0]/j0*.55];q(w,I,i,ut),J(w,H(y),H(S),H(_),H(T),W(y),W(S),W(_),W(T),0),q(w,gt,yt,ft)}const f=(m,u,g,y,S)=>{for(let T=0;T<48;T++){const _=T/48*M0,H=(T+1)/48*M0;J(m,[Math.cos(_)*u,Math.sin(_)*u,y],[Math.cos(H)*u,Math.sin(H)*u,y],[Math.cos(H)*g,Math.sin(H)*g,y],[Math.cos(_)*g,Math.sin(_)*g,y],[0,0],[1,0],[1,1],[0,1],S)}};q(w,I,E,R0),f(w,St-.4,St+3.4,B+1,12),q(w,E,P,U),f(w,te,te+1.5,B+.9,12);const p=.6,v=St-.2,h=te+.7;for(let m=-4;m<=3;m++){const u=(m+.5)*5.4,g=Math.sqrt(v*v-u*u),y=Math.abs(u)<h?Math.sqrt(h*h-u*u):0,S=y>0?[[y,g],[-g,-y]]:[[-g,g]];for(const[T,_]of S)q(w,E,i,U),J(w,[u-p,T,B+.7],[u+p,T,B+.7],[u+p,_,B+.7],[u-p,_,B+.7],[0,0],[1,0],[1,1],[0,1],3),J(w,[T,u-p,B+.4],[T,u+p,B+.4],[_,u+p,B+.4],[_,u-p,B+.4],[0,0],[1,0],[1,1],[0,1],3)}for(let m=-4;m<=3;m++)for(let u=-4;u<=3;u++){const g=(m+.5)*5.4,y=(u+.5)*5.4,S=Math.hypot(g,y);S>v-1.2||S<h+1.2||F0(w,[g,y,B+.85],[.95,0,0],[0,.95,0],P,E,k0)}const x=a0?Re/j0:b;S0(w,-b,x,fe-.87,fe,B+pe,B,{faces:{front:Y0,bottom:Ot,top:jt,right:a0?Y0:null},k:.55});const k=[[.74,17,.5,Y0,[I,E,R0],Ot],[.6,12,.5,[P,i,ct],[R,M,it],b0],[.46,7,.5,[R,M,it],[P,R,ct],[E,i,U]]];for(const m of[-26,-19,-11.5,-5.6,5.6,11.5,19,26]){if(m+.8>x)continue;let u=fe-.87;for(const[g,y,S,T,_,H]of k)S0(w,m-g,m+g,u-S,u,B+y,B,{f:1,k:2.4,faces:{front:T,left:_,right:_,bottom:H}}),u-=S}if(a0){q(w,I,I,U),f(w,7.6,27,B-1.4,0),q(w,I,E,Vt),J(w,[a-6,e,B+.3],[a,e,B+.3],[a,o,B+.3],[a-6,o,B+.3],[0,0],[1,0],[1,1],[0,1],15),q(w,P,i,U),J(w,[a,e,B+.3],[a,e,B-.8],[a,o,B-.8],[a,o,B+.3],[0,0],[1,0],[1,1],[0,1],15),s0(r,7,1,-1,0),i0(r,b*G(t0[8]),0,t0[8],1);const m=[a+.4,e,B],u=[t,e,B],g=[t,o,B],y=[a+.4,o,B],S=T=>[T[0],T[1],B-.8];q(r,gt,yt,ft),J(r,m,u,g,y,s(m),s(u),s(g),s(y),15),q(r,I,i,ut),J(r,S(m),S(u),S(g),S(y),[0,0],[12,0],[12,11],[0,11],15),q(r,I,E,Vt),J(r,[a+.4,e,B+.3],[a+7,e,B+.3],[a+7,o,B+.3],[a+.4,o,B+.3],[0,0],[1,0],[1,1],[0,1],15),q(r,P,i,U),J(r,[a+.4,e,B+.3],[a+.4,e,B-.8],[a+.4,o,B-.8],[a+.4,o,B+.3],[0,0],[1,0],[1,1],[0,1],15),q(r,I,E,R0),J(r,[a+7,o-1.1*j0,B+.35],[t,o-1.1*j0,B+.35],[t,o,B+.35],[a+7,o,B+.35],[0,0],[1,0],[1,1],[0,1],15),J(r,[a+7,e,B+.35],[t,e,B+.35],[t,e+.9*j0,B+.35],[a+7,e+.9*j0,B+.35],[0,0],[1,0],[1,1],[0,1],15),p0(r)}}await d.yield();const ee=[],Ue=(t,a,e,o,c,n,s,f,p,v)=>{const h=o+c/2,x=o-c/2,k=G(h),m=G(x),u=[R,P,M,C==="indigo"?E:f0,I];let g=F;for(let _0=0;_0<n-1;_0++){const x0=_0%2===0,H0=s*(1-.032*_0)*(x0?1:.78),Q0=f*(x0?1.12:.84),at=l.range(-.28,.28),Rt=x0?h:h-c*.06,Et=x0?x:x+c*.06,d0=u[(v+_0)%u.length],r0=u[(v+_0+2)%u.length],xt=x0?[d0,d0===M?I:M,At]:[M,i,st],Lt=x0?[r0,r0===M||r0===I?R:M,l.pick([ct,it,Wt,U])]:[d0===M?P:d0,i,U];S0(t,e+at-H0/2,e+at+H0/2,g,g+Q0,Rt,Et,{f:p,axAbs:e,ayAbs:F,k:.9,uo:_0*2.3,faces:{front:xt,left:Lt,right:Lt,top:[x0?P:r0===P?R:r0,i,U]}}),g+=Q0}const y=s*.86,S=t.ox;S0(t,e-y*.56,e+y*.56,g,g+.28,h,x,{f:p,axAbs:e,ayAbs:F,faces:{front:[u[v%u.length]===M?R:u[v%u.length],i,U],left:b0,right:b0,top:[M,i,st]}});const T=[e*k+S,(g+.3)*k,h],_=[e*m+S,(F+(g+.3-F)*p)*m,x],H=y*.52*k,W=y*.52*p*m,Y=c/k*.5,C0=l.range(0,M0);q(a,M,i,st);for(const _0 of[-1,1])for(let x0=0;x0<6;x0++){const H0=.16+x0*.24,Q0=_0*Math.cos(H0),at=Math.sin(H0),Rt=d0=>{const r0=d0===0||d0===1?T:_;s0(a,4,C0+x0*.55+(_0>0?0:1.4),.8,.07+.022*x0),i0(a,r0[0],r0[1],r0[2],2)},Et=a.ox;a.ox=0,J(a,T,[T[0]+Q0*H,T[1]+at*H,h],[_[0]+Q0*W,_[1]+at*W,x],_,[0,0],[0,y*.4],[Y,y*.4],[Y,0],15,Rt),a.ox=Et}return p0(a),ee.push(new O.Vector3(e*k+S,(g+.3)*k+H*.7,o+c*.3)),(g-F)*k};{const t=l.chance(.5),a=[[-522,-578,-640,-676],[-506,-556,-622,-668]];let e=l.int(0,4);for(let o=0;o<2;o++){const c=o===0===t?4:3;for(let n=0;n<c;n++){if(a0&&o===1&&n>=2)continue;const s=a[o][n]+l.range(-5,5),f=G(s),p=(o===0?-1:1)*l.range(54,76),v=l.int(9,13),h=l.range(88,122)/f,x=h/((v-1)*.98);Ue(w,r,p/f,s,l.range(26,34),v,l.range(4.6,5.8),x,1.2,e),e+=l.int(1,2)}await d.yield()}}const X0={x:-24,z:-600,y:F*G(-600)},Ne=[],ae={peony:{heads:9,R:[9,12],rings:[[8,1,.42,0],[7,.72,.4,.5],[5,.45,.42,1]],pat:kt,leaves:3,stem:R,stemW:.8},lotus:{heads:7,R:[10,13],rings:[[9,1,.3,0],[7,.74,.3,.5],[5,.48,.3,1]],pat:Mt,leaves:2,stem:R,stemW:.7},chrysanthemum:{heads:11,R:[8,10.5],rings:[[13,1,.26,0],[11,.76,.26,.5],[8,.5,.27,1]],pat:Mt,leaves:3,stem:R,stemW:.7},plum:{heads:26,R:[3.2,4.6],rings:[[5,1,.55,0]],pat:kt,leaves:0,stem:i,stemW:1.1}}[e0]||null,Ge=(t,a,e,o,c,n)=>{const s=p=>p*c,f=p=>o+p*c;Dt(t,a,e,[[s(7),f(0),f0,i,0,6,1],[s(8),f(2.5),M,i,0,6,1],[s(12.3),f(13),M,i,0,6,0],[s(13),f(19),M,n,ft,9,3],[s(12.5),f(29),M,i,0,6,0],[s(9.4),f(40),M,i,0,6,0],[s(5.6),f(48),n,i,0,6,3],[s(5.3),f(51),M,i,0,6,0],[s(6.3),f(57.5),n,i,0,6,3],[s(7.6),f(61),i,i,0,6,0],[s(6.6),f(62),i,i,0,6,0],[.01,f(60)]],32)},We=(t,a,e,o,c,n,s,f=1)=>{const p=(v,h)=>Math.hypot(v<0?-v:v>14?v-14:0,h);for(let v=0;v<a.heads;v++){let h=-1.3+(v+l.range(.1,.9))/a.heads*1.9,x=l.range(36,84)*n;const k=l.range(a.R[0],a.R[1])*n,m=c+l.range(-16,14)*n;let u=0,g=0;for(let K=0;K<24&&(u=e+f*Math.sin(h)*x,g=o+Math.cos(h)*x*.95,!(!s||p(u,g)>k+10));K++)h-=.07,x=Math.min(x+2,92*n);const y=l.range(0,M0),S=l.range(.45,.8),T=s?l.range(1,2)*n:0,_=.92,H=.35,W=K=>{s&&(s0(t,6,y,S,K),i0(t,_*T,H*T,0,0))},Y=e+(u-e)*.12,C0=o+(g-o)*.7,_0=c+(m-c)*.5,x0=9,H0=a.stemW*n*(a.heads>20?.6:1),Q0=K=>{const o0=1-K;return[o0*o0*e+2*o0*K*Y+K*K*u,o0*o0*o+2*o0*K*C0+K*K*g,o0*o0*c+2*o0*K*_0+K*K*m]},at=K=>{const o0=Q0(Math.max(0,K-.02)),U0=Q0(Math.min(1,K+.02)),B0=U0[0]-o0[0],G0=U0[1]-o0[1],T0=Math.hypot(B0,G0)||1;return[G0/T0,-B0/T0]};q(t,a.stem,i,U);for(let K=0;K<x0;K++){const o0=K/x0,U0=(K+1)/x0,B0=Q0(o0),G0=Q0(U0),T0=at(o0),J0=at(U0),ot=nt=>W((nt<2?o0:U0)**2);J(t,[B0[0]-T0[0]*H0,B0[1]-T0[1]*H0,B0[2]],[B0[0]+T0[0]*H0,B0[1]+T0[1]*H0,B0[2]],[G0[0]+J0[0]*H0,G0[1]+J0[1]*H0,G0[2]],[G0[0]-J0[0]*H0,G0[1]-J0[1]*H0,G0[2]],[0,0],[1,0],[1,1],[0,1],3,ot)}for(let K=0;K<a.leaves;K++){const o0=.3+K/Math.max(1,a.leaves)*.5+l.range(-.05,.05),U0=Q0(o0),B0=at(o0),G0=K%2?1:-1,T0=l.range(5.5,7.5)*n,J0=l.range(.3,.9),ot=B0[0]*G0*Math.cos(J0)-B0[1]*Math.sin(J0),nt=B0[1]*G0*Math.cos(J0)+B0[0]*Math.sin(J0),dt=Math.hypot(ot,nt)||1,zt=ot/dt,rt=nt/dt;W(o0*o0),F0(t,[U0[0]+zt*T0,U0[1]+rt*T0,U0[2]+.4*G0],[-rt*T0*.9,zt*T0*.9,0],[zt*T0,rt*T0,0],R,i,lt)}const Rt=Math.min(.6,Math.max(0,g/110)),Et=l.range(-.3,.3),d0=[Math.cos(Et),0,Math.sin(Et)],r0=[0,Math.cos(Rt),Math.sin(Rt)],xt=[d0[1]*r0[2]-d0[2]*r0[1],d0[2]*r0[0]-d0[0]*r0[2],d0[0]*r0[1]-d0[1]*r0[0]];for(let K=0;K<(a.pads||0);K++){const o0=Q0(.42+.2*(v%2)),U0=8.5*n,B0=v%2?1:-1;W(.3),F0(t,[o0[0]+B0*U0*.8,o0[1],o0[2]+.5*B0],[U0,0,0],[0,U0*.72,0],R,R,qt)}const Lt=a.white?0:v%3,ha=a.white?M:Lt===1?wt:Gt,da=a.white?E:Lt===1?M:wt,ua=Lt===2&&a.pat===kt?Ft:a.pat;W(1);for(const[K,o0,U0,B0]of a.rings){const G0=l.range(0,M0);for(let T0=0;T0<K;T0++){const J0=G0+T0/K*M0+l.range(-.08,.08),ot=Math.cos(J0),nt=Math.sin(J0),dt=k*o0*.5*l.range(.9,1.08),zt=k*U0*(.75+.25*o0),rt=[d0[0]*ot+r0[0]*nt,d0[1]*ot+r0[1]*nt,d0[2]*ot+r0[2]*nt],ze=[-d0[0]*nt+r0[0]*ot,-d0[1]*nt+r0[1]*ot,-d0[2]*nt+r0[2]*ot],qe=B0*.5*n+T0*.03*n;F0(t,[u+rt[0]*dt+xt[0]*qe,g+rt[1]*dt+xt[1]*qe,m+rt[2]*dt+xt[2]*qe],[ze[0]*zt,ze[1]*zt,ze[2]*zt],[rt[0]*dt,rt[1]*dt,rt[2]*dt],ha,da,ua)}}const Ct=k*(a.rings.length>1?.17:.3),Se=1.6*n;F0(t,[u+xt[0]*Se,g+xt[1]*Se,m+xt[2]*Se],[d0[0]*Ct,d0[1]*Ct,d0[2]*Ct],[r0[0]*Ct,r0[1]*Ct,r0[2]*Ct],P,e0==="lotus"?R:E,k0),s&&Ne.push({position:new O.Vector3(u,g,m),radius:k})}p0(t)};p0(r),Ge(r,X0.x,X0.z,X0.y,1,f0),ae&&We(r,ae,X0.x,X0.y+60,X0.z,1,!0),await d.yield();{const t=e0==="plum",a=Math.round((t?1300:300)*z*(A.petals??1)),e=t?.24:1,o=ae&&ae.pat===Mt?Mt:kt;for(let n=0;n<a;n++){const s=l.chance(.55),f=l(),p=l(),v=l(),h=l(),x=l(),k=l(),m=l();let u,g,y,S,T,_;if(s){g=-675+f*175;const Y=G(g);T=(6+3*p)*e;const C0=T*1.15+7;u=v<.66?-95+h*(95-C0):14+C0+h*(86-C0),y=25+50*x,S=y-F*Y*.98,_=(.5+.4*k)*Y}else{g=-470+f*430;const Y=G(g);T=(.8+.4*p)*Y*e;const C0=T*1.15+12,_0=v0*Y*.92;u=(v<.5?-1:1)*(C0+h*Math.max(.5,_0-C0)),y=W0*Y*.96,S=(W0-F)*Y*.95,_=(.5+.4*k)*Y}const H=T*.62,W=n%7;q(r,W===2||W===5?wt:Gt,W===2||W===5?M:wt,W===6&&o===kt?Ft:o),s0(r,5,m,_,(.25+.4*x)*(p<.5?-1:1)),i0(r,u,y,g,S),J(r,[-H,-T,0],[H,-T,0],[H,T,0],[-H,T,0],[-1,-1],[1,-1],[1,1],[-1,1],0),(n&255)===255&&await d.yield()}p0(r);const c=Math.round((t?260:70)*z);for(let n=0;n<c;n++){const s=n%3!==0,f=s?l.range(-682,-492):l.range(-470,-60),p=G(f),v=(s?l.range(6,9):l.range(.8,1.2)*p)*e,h=(s?b-4:v0-2)*p,x=l.range(-h,h),k=l.range(0,M0),m=Math.cos(k),u=Math.sin(k),g=v*.62,y=(T,_)=>{const H=x+m*T-u*_,W=f+u*T+m*_;return[H,F*G(W)+(.1+n%9*.012)*p,W]},S=n%7;q(w,S===2||S===5?wt:Gt,S===2||S===5?M:wt,S===6&&o===kt?Ft:o),J(w,y(-g,-v),y(g,-v),y(g,v),y(-g,v),[-1,-1],[1,-1],[1,1],[-1,1],0)}}const tt=fe*G(B+pe),et=B+pe+.7,Ve={uPal:$.uPal,uInk:$.uInk,uTime:$.uTime,uCat:{value:new O.Vector4(0,0,0,n0==="spotted"?1:0)}},ca=new O.ShaderMaterial({vertexShader:Ta,fragmentShader:Sa,side:O.DoubleSide,fog:!!A.fog,uniforms:{...O.UniformsUtils.clone(O.UniformsLib.fog),...Ve}}),oe=new O.BufferGeometry;oe.setAttribute("position",new O.BufferAttribute(new Float32Array([38,tt+-9,et,-34,tt+-9,et,-34,tt+28,et,38,tt+28,et]),3)),oe.setAttribute("aC",new O.BufferAttribute(new Float32Array([-38,-9,34,-9,34,28,-38,28]),2)),oe.setIndex([0,1,2,0,2,3]);const we=new O.Mesh(oe,ca);we.frustumCulled=!1,we.matrixAutoUpdate=!1;{const t=[-22,tt+3.2],a=[-33.5,tt+5],e=[-31.5,tt-22],o=[-35,tt-46],c=16,n=l.range(0,M0),s=v=>{const h=1-v,x=h*h*h,k=3*h*h*v,m=3*h*v*v,u=v*v*v;return[x*t[0]+k*a[0]+m*e[0]+u*o[0],x*t[1]+k*a[1]+m*e[1]+u*o[1]]},f=v=>{const h=s(Math.max(0,v-.02)),x=s(Math.min(1,v+.02)),k=x[0]-h[0],m=x[1]-h[1],u=Math.hypot(k,m)||1;return[m/u,-k/u]},p=v=>{const h=Math.max(0,v-.22)/.78;return h*h};q(r,se,n0==="spotted"?M:i,n0==="spotted"?Ie:Wt);for(let v=0;v<c;v++){const h=v/c,x=(v+1)/c,k=s(h),m=s(x),u=f(h),g=f(x),y=1.7+.9*h,S=1.7+.9*x,T=_=>{s0(r,6,n,.9,p(_===0||_===1?h:x)),i0(r,6,0,0,0)};J(r,[k[0]-u[0]*y,k[1]-u[1]*y,et+.3],[k[0]+u[0]*y,k[1]+u[1]*y,et+.3],[m[0]+g[0]*S,m[1]+g[1]*S,et+.3],[m[0]-g[0]*S,m[1]-g[1]*S,et+.3],[h*11,0],[h*11,1],[x*11,1],[x*11,0],3,T)}s0(r,6,n,.9,1),i0(r,6,0,0,0),F0(r,[o[0],o[1]-.6,et+.5],[3,0,0],[0,3,0],i,i,k0),p0(r)}await d.yield();let Ae=null,Qe=null;const ht={k:1.193,x:250,z:-69.6};if(a0){const t=Zt(!1),a=Zt(!0),e=F*j0,o=F*G(-520),c=12.5*j0,n=.3/j0,s=215,f=C==="vermilion"?f0:E,p=C==="vermilion"?E:f0;q(t,f,P,ft),J(t,[-s,e,B],[s,e,B],[s,c,B],[-s,c,B],[-s*n,e*n],[s*n,e*n],[s*n,c*n],[-s*n,c*n],0),q(t,I,p,R0),J(t,[-s,c-9,B+.6],[s,c-9,B+.6],[s,c,B+.6],[-s,c,B+.6],[0,0],[1,0],[1,1],[0,1],15),q(t,I,p,R0),J(t,[-s,e,B+.6],[s,e,B+.6],[s,e+7,B+.6],[-s,e+7,B+.6],[0,0],[1,0],[1,1],[0,1],15),q(t,I,i,ut),J(t,[-s,o,-520],[-s,e,B],[s,e,B],[s,o,-520],[0,-16],[13,-16],[13,16],[0,16],3),q(t,I,P,ct),J(t,[-118,o+.3,-520],[-118,e+.3,B],[-18,e+.3,B],[-18,o+.3,-520],[0,-4.5],[6.5,-4.5],[6.5,-.7],[0,-.7],15);let v=l.int(0,4);for(const[m,u]of[[-16.8,-589],[.24,-585],[4.52,-672.5]])Ue(t,a,m,u,26,l.int(10,12),l.range(3,3.5),l.range(1.6,1.9),1.2,v),v+=2;ee.length=Math.max(0,ee.length-3),p0(a);const h=-67.9,x=-604,k=F*G(x);Ge(a,h,x,k,.9,R),We(a,{heads:6,R:[12,15],rings:[[7,1,.52,0],[5,.66,.5,.5]],pat:Ft,white:!0,pads:1,leaves:0,stem:R,stemW:.8},h,k+54,x,.9,!1,-1),Ae=Kt(t,q0),Qe=Kt(a,u0),await d.yield()}const ia=Kt(w,q0);await d.yield();const la=Kt(r,u0);if(g0.add(ia,la,we),Ae){const t=new O.Matrix4().makeTranslation(ht.x,0,ht.z).multiply(new O.Matrix4().makeScale(ht.k,ht.k,ht.k));for(const a of[Ae,Qe])a.matrix.copy(t),g0.add(a)}let Ut=null;A.paper!==!1&&(Ut=new O.Mesh(new O.BoxGeometry(2,2,2),new O.ShaderMaterial({vertexShader:Aa,fragmentShader:ka,side:O.BackSide,depthWrite:!1,uniforms:{uPaper:{value:N[I]},uInkC:{value:N[i]}}})),Ut.renderOrder=-1,Ut.frustumCulled=!1,g0.add(Ut)),await d.yield();const ke=new O.Vector3,Ze=new O.Vector2,Nt=(t,a,e)=>{const o=Math.min(1,Math.max(0,(e-t)/(a-t)));return o*o*(3-2*o)},Ke=t=>(t<-85&&t>-216?5*Math.sin((t+85)/131*M0):0)+14*Nt(-495,-545,t)*(1-Nt(-556,-604,t)),Me=new Float32Array(10).fill(-1);let Xe=-1,Pe=-1,Be=-1,ne=!1,Je=0;const _t={x:0,y:0},Te=new O.Vector3(23,tt+13.5,et);function ra(t,a,e){$.uTime.value=a;let o=Xe;o<0&&(e.getWorldPosition(ke),g0.worldToLocal(ke),o=Math.min(1,Math.max(0,-ke.z/690))),Je=o,$.uU.value=o;const c=$.uHinge.value;for(let f=1;f<9;f++)c[f]=Me[f]>=0?Me[f]:Nt(Le[f],Le[f]+Ma[f],o);$.uAng.value[2]=Be>=0?Be:.8+.2*Nt(0,.04,o),$.uAng.value[1]=Pe>=0?Pe:a0?.8*Nt(.6,.84,o):0;const n=Ve.uCat.value;ne?(n.x+=(_t.x-n.x)*Math.min(1,t*2.5),n.y+=(_t.y-n.y)*Math.min(1,t*2.5)):(n.x=.75*Math.sin(a*.33)+.2*Math.sin(a*.9+1),n.y=.5*Math.sin(a*.21+2));const s=a*.23%1;n.z=s>.96?Math.sin((s-.96)/.04*Math.PI):0,d.renderer&&(d.renderer.getDrawingBufferSize(Ze),$.uInk.value=Math.min(4.5,Math.max(1.5,Ze.y/420*(A.inkScale??1))))}const fa=new O.Vector3(0,20,-400),h0=(t,a,e)=>new O.Vector3(t,a,e),pa={entry:h0(0,0,0),portalSeat:{position:h0(0,0,B),normal:h0(0,0,1),radius:7,eyeRadius:te},flyThrough:[0,-36,-60,-85,-118,-150,-183,-216,-285,-371,-480,-503,-520,-537,-550,-566,-580,-592,-606,-632,-660,-690].map(t=>h0(Ke(t),0,t)),viewpoints:{statement:h0(0,0,-44),scrolls:h0(0,0,-186),hallReveal:h0(0,0,-380),linger:h0(14,0,-566),window:h0(0,0,-655)},curtainPlane:{position:h0(0,0,-32),width:34,height:28},fronts:t0.slice(),heights:Qt.slice(),table:{near:h0(0,K0*G(mt),mt),far:h0(0,K0*G(Pt),Pt),halfNear:bt,halfFar:xe,b:K0},inkstone:h0(0,ye*G(Ht-1.2),Ht-1.2),brushPot:{position:h0(Tt.x,Tt.y,Tt.z),radius:Tt.r,rimY:Tt.y+Tt.h},vase:{position:h0(X0.x,X0.y,X0.z),mouth:h0(X0.x,X0.y+61,X0.z),radius:13},flowerHeads:Ne,pagodaTops:ee,cornice:{y:tt,zFront:B+pe},catHead:Te,rare:{gaze:h0(118,55,-800),hinge:h0(b*G(t0[8]),0,t0[8]),jamb:h0(Re,0,B),vase:h0(ht.x-67.9*ht.k,0,ht.z-604*ht.k),from:.6,to:.84},catTailTip:h0(-35,tt-46,et),windowCentre:h0(0,0,B)};return{object:g0,radius:330,height:190,center:fa,anchors:pa,ground:!1,groundY:F*j0,look:{backs:C,flower:e0,cat:n0,curtain:z0,rare:a0},uniforms:$,paper:Ut,update:ra,setProgress(t){Xe=t==null?-1:Math.min(1,Math.max(0,t))},setHinge(t,a){t>=1&&t<=8&&(Me[t]=a==null?-1:Math.min(1,Math.max(0,a)))},setFold(t){Pe=t==null?-1:Math.min(1.7,Math.max(0,t))*.5},setCurtain(t){Be=t==null?-1:Math.min(1,Math.max(0,t))},setCatLook(t,a){ne=t!=null,ne&&(_t.x=Math.min(1,Math.max(-1,t)),_t.y=Math.min(1,Math.max(-1,a||0)))},lookCatAt(t){ne=!0,_t.x=Math.min(1,Math.max(-1,-(t.x-Te.x)/70)),_t.y=Math.min(1,Math.max(-1,(t.y-Te.y)/50))},scaleAt:G,shelfPoint:(t,a,e)=>h0(t*G(e),a*G(e),e),flyX:Ke,wallOpenAt:Ba,uOfZ:Ee,get progress(){return Je},kit:{setA:s0,setB:i0,setP:q,still:p0,vtx:N0,pigment:{TAN:I,INK:i,IND:f0,MAL:R,VER:E,WHT:M,OCH:P,BACK:gt,MOTIF:yt,FLOWER:Gt,FLOWER2:wt,FUR:se},pattern:{FLAT:U,GRAIN:ut,PAGES:st,STRIPE:Wt,HEX:ct,COIN:it,CLOUD:ft,BAND:R0,BANDX:Vt,ROSETTE:Ie,SLIP:At,SCROLL:ce,PETAL:kt,LEAF:lt,DISC:k0,PETALEDGE:Ft,LOTUS:Mt,FRUIT:_e,GRID:$e,EYE:Ye,RING:qt,HOOP:be},makeBatch:Zt,prism:S0,box:ga,quad:$0,rawQuad:J,card:F0,lathe:Dt,hp:E0,finish:t=>Kt(t,t.anim?u0:q0),materials:{still:q0,moving:u0}},dispose(){}}}const Ta=`
attribute vec2 aC; varying vec2 vC;
#include <fog_pars_vertex>
void main() {
  vC = aC;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Sa=`
uniform vec3 uPal[13]; uniform float uInk; uniform float uTime; uniform vec4 uCat;   // turn, tilt, blink, spotted
varying vec2 vC;
#include <fog_pars_fragment>
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float ell(vec2 p, vec2 c, vec2 r) { vec2 q = (p - c) / r; return (length(q) - 1.) * min(r.x, r.y); }
float seg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0., 1.); return length(pa - ba * h); }
void main() {
  vec2 p = vC;
  float px = max(max(fwidth(p.x), fwidth(p.y)), 1e-5), lw = max(0.34, uInk * px), hl = lw * 0.5;
  float turn = uCat.x, tilt = uCat.y;
  vec2 H = vec2(-23. + 1.6 * turn, 13.5 + 0.7 * tilt);
  vec2 F = H + vec2(3.3 * turn, 1.5 * tilt - 0.5);
  float tw = 0.9 * max(0., sin(uTime * 6.)) * step(0.86, sin(uTime * 0.53 + 1.));
  float dBody = ell(p, vec2(3., 7.), vec2(25., 7.6));
  dBody = min(dBody, ell(p, vec2(19.5, 9.), vec2(10.5, 10.)));
  dBody = min(dBody, ell(p, vec2(-13., 8.5), vec2(9.5, 9.)));
  dBody = max(dBody, -p.y);
  float dPaw = min(ell(p, vec2(-15., -2.), vec2(3.1, 4.6)), ell(p, vec2(-7., -2.2), vec2(3.1, 4.4)));
  float dEar = min(ell(p, H + vec2(-6.7, 7.3 + tw), vec2(3.4, 3.9)), ell(p, H + vec2(6.7, 7.3), vec2(3.4, 3.9)));
  float dEarIn = min(ell(p, H + vec2(-6.7 + 0.5 * turn, 7.1 + tw), vec2(1.7, 2.2)), ell(p, H + vec2(6.7 + 0.5 * turn, 7.1), vec2(1.7, 2.2)));
  float dHead = min(ell(p, H, vec2(10.4, 9.2)), dEar);
  float dAll = min(min(dBody, dPaw), dHead);
  if (dAll > hl) discard;
  vec3 fur = uPal[11], wht = uPal[5], ink = uPal[1], ver = uPal[4], mal = uPal[3];
  vec3 col = fur; float k = 0.;
  if (uCat.w < 0.5) {                                   // tiger stripes, thick at the spine, tapering to the belly
    float tp = smoothstep(1.5, 10., p.y);
    float sd = (abs(fract((p.x + 0.45 * p.y) / 4.4) - 0.5) - 0.2 * tp) * 4.4;
    k = (1. - smoothstep(-px, px, sd)) * step(0.02, tp);
  } else {                                              // or leopard rosettes
    vec2 g = p / 3.6, c = floor(g), q = fract(g) - 0.5; float h = h21(c);
    q -= (vec2(h21(c + 1.7), h21(c + 9.2)) - 0.5) * 0.3;
    float r = length(q), an = atan(q.y, abs(q.x) < 1e-5 ? 1e-5 : q.x), rr = 0.2 + 0.09 * h;
    float d = max(abs(r - rr) - 0.065, -(sin(an * 3. + h * 20.) + 0.5) * 0.1) * 3.6;
    if (r < rr - 0.06) col = uPal[0];
    k = 1. - smoothstep(-px, px, d);
  }
  if (ell(p, vec2(2., 0.), vec2(21., 3.4)) < 0.) { col = wht; k = 0.; }          // belly
  if (dPaw < 0.) {                                      // paws hang over the ledge
    col = wht; k = 0.;
    k = max(k, 1. - smoothstep(hl * 0.6 - px, hl * 0.6 + px, min(seg(p, vec2(-15.9, -6.), vec2(-15.9, -4.4)), seg(p, vec2(-14.1, -6.), vec2(-14.1, -4.4)))));
    k = max(k, 1. - smoothstep(hl * 0.6 - px, hl * 0.6 + px, min(seg(p, vec2(-7.9, -6.), vec2(-7.9, -4.4)), seg(p, vec2(-6.1, -6.), vec2(-6.1, -4.4)))));
  }
  k = max(k, (1. - smoothstep(hl - px, hl + px, abs(dPaw))) * step(dPaw, hl));
  if (dHead < 0.) {                                     // the head, drawn over the body
    col = fur; k = 0.;
    vec2 q = p - F, qa = vec2(abs(q.x), q.y);
    if (dEarIn < 0.) col = ver;
    float bars = min(min(seg(q, vec2(-2.3, 6.4), vec2(2.3, 6.4)), seg(q, vec2(-3., 4.9), vec2(3., 4.9))), seg(q, vec2(-1.9, 3.5), vec2(1.9, 3.5))) - 0.36;
    bars = min(bars, min(seg(qa, vec2(9.2, 1.2), vec2(6.6, 0.4)), seg(qa, vec2(8.9, -1.6), vec2(6.4, -1.5))) - 0.3);
    if (uCat.w < 0.5) k = max(k, 1. - smoothstep(-px, px, bars));
    float dMuz = ell(p, F + vec2(0., -3.3), vec2(4.7, 3.2));
    if (dMuz < 0.) { col = wht; k = 0.; }
    k = max(k, 1. - smoothstep(hl * 0.6 - px, hl * 0.6 + px, abs(dMuz)));
    vec2 ec = vec2(3.9, 1.4), er = vec2(2.5, 2.5 * (1. - 0.9 * uCat.z));
    float dEye = ell(qa, ec, er);
    if (dEye < 0.) {
      col = wht; k = 0.;
      vec2 io = vec2(0.5 * turn, 0.3 * tilt);
      float dI = min(length(q - vec2(ec.x, ec.y) - io), length(q - vec2(-ec.x, ec.y) - io)) - 1.75;
      float dP = min(length(q - vec2(ec.x, ec.y) - io * 1.7), length(q - vec2(-ec.x, ec.y) - io * 1.7)) - 0.8;
      if (dI < 0.) col = mal;
      if (dP < 0.) col = ink;
    }
    k = max(k, 1. - smoothstep(hl * 0.8 - px, hl * 0.8 + px, abs(dEye)));
    if (ell(q, vec2(0., -1.75), vec2(1.3, 0.9)) < 0.) { col = ver; k = 0.; }
    float mouth = min(seg(q, vec2(0., -2.6), vec2(0., -3.7)), min(abs(length(qa - vec2(1.3, -3.7)) - 1.3) + step(-3.7, q.y) * 9., 9.));
    float whisk = min(min(seg(qa, vec2(3.4, -3.), vec2(9.6, -2.)), seg(qa, vec2(3.4, -3.7), vec2(9.9, -4.2))), seg(qa, vec2(3.2, -4.4), vec2(9.2, -6.2)));
    k = max(k, 1. - smoothstep(hl * 0.5 - px, hl * 0.5 + px, min(mouth, whisk)));
    k = max(k, 1. - smoothstep(hl - px, hl + px, abs(dHead)));
  }
  k = max(k, 1. - smoothstep(hl - px, hl + px, abs(dAll)));
  k = max(k, (1. - smoothstep(hl - px, hl + px, abs(dBody))) * step(0., dHead) * step(0.2, p.y));
  col *= 0.985 + 0.03 * h21(floor(p * vec2(0.6, 7.)));
  gl_FragColor = vec4(mix(col, ink, clamp(k, 0., 1.)), 1.);
  #include <fog_fragment>
}`;export{qa as buildHero};
