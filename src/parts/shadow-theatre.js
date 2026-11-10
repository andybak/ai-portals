import*as L from"three";const _=Math.PI*2,a0=["#FBE2A0","#F2A541","#D9512C","#8E2A5A","#1E4C6B","#0A0608","#6FE3D0"],G=[40,20,0,-20,-40],K=30;function o0(){const t={pos:[],aL:[],aDim:[],aInfo:[],aLay:[],aRot:[],aN:[],idx:[],n:0};return t.v=(e,a,n,o,l,s,i,r,f,p,y,b,h,m,d)=>(t.pos.push(e,a,n),t.aL.push(o,l),t.aDim.push(s[0],s[1],s[2],s[3]||0),t.aInfo.push(i,r,f,p),t.aLay.push(y,b),h?t.aRot.push(h[0],h[1],h[2],h[3]):t.aRot.push(0,0,0,0),t.aN.push(m||0,d||0),t.n++),t}function z(t,e){let a=e.pts,n=e.ox||0,o=e.slide||0;const l=e.oy||0,s=e.z,i=e.thick??.3,r=e.dim||[1,1,1,0],f=e.style||0,p=e.hue||0,y=e.seed||0,b=e.lay||0,h=e.rot||null;e.mirror&&(a=a.map(u=>[-u[0],u[1]]).reverse(),n=-n,o=-o);const m=[];for(let u=0;u<a.length;u++){const T=a[u],C=m.length?m[m.length-1]:null;(!C||Math.abs(T[0]-C[0])+Math.abs(T[1]-C[1])>.001)&&m.push(T)}m.length>2&&Math.abs(m[0][0]-m[m.length-1][0])+Math.abs(m[0][1]-m[m.length-1][1])<.001&&m.pop(),a=m;const d=a.length;if(d<3)return;let g=0;for(let u=0;u<d;u++){const T=a[u],C=a[(u+1)%d];g+=T[0]*C[1]-C[0]*T[1]}g<0&&(a=a.slice().reverse());const x=a.map(u=>new L.Vector2(u[0],u[1])),c=L.ShapeUtils.triangulateShape(x,[]),v=s+i/2,M=s-i/2,w=(u,T,C,q,k)=>t.v(n+u[0],l+u[1],T,u[0],u[1],r,f,p,y,C,b,o,h,q,k),F=t.n;for(let u=0;u<d;u++)w(a[u],v,0);const R=t.n;for(let u=0;u<d;u++)w(a[u],M,1);for(const u of c)t.idx.push(F+u[0],F+u[1],F+u[2]),t.idx.push(R+u[0],R+u[2],R+u[1]);const B=[];for(let u=0;u<d;u++){const T=a[(u+d-1)%d],C=a[u],q=a[(u+1)%d];let k=C[0]-T[0],A=C[1]-T[1],W=q[0]-C[0],S=q[1]-C[1];const I=Math.hypot(k,A)||1,O=Math.hypot(W,S)||1;k/=I,A/=I,W/=O,S/=O;let H=-A-S,U=k+W;const Z=Math.hypot(H,U);if(Z<.2)H=-A,U=k;else{const X=Math.min(1.8,2/Z)/Z;H*=X,U*=X}B.push([H,U])}const E=e.rim!==!1;for(let u=0;u<d;u++){const T=(u+1)%d,C=a[u],q=a[T];if(C[1]+l<.02&&q[1]+l<.02)continue;const k=w(C,v,2),A=w(q,v,2),W=w(q,M,2),S=w(C,M,2);if(t.idx.push(k,A,W,k,W,S),E){const I=w(C,v+.05,3),O=w(q,v+.05,3),H=w(q,v+.05,3,B[T][0],B[T][1]),U=w(C,v+.05,3,B[u][0],B[u][1]);t.idx.push(I,O,H,I,H,U)}}}function D(t,e,a,n,o,l,s,i=1){for(let r=0;r<=s;r++){const f=o+(l-o)*(r/s);t.push([e+Math.cos(f)*n*i,a+Math.sin(f)*n])}}function Y(t,e,a){return t.push([.32*a,e],[.32*a,e+1*a]),D(t,0,e+1.9*a,.95*a,-1.2,1.2,6),t.push([.24*a,e+3.1*a]),D(t,0,e+3.7*a,.55*a,-1.1,1.1,4),t.push([.14*a,e+4.6*a],[0,e+7*a]),e+7*a}function J(t,e,a,n,o=22){for(let l=0;l<=o;l++){const s=l/o,i=.8*(1-s);let r=Math.pow(Math.sin(Math.PI*Math.pow(i,.9)),.8)*(.3+.7*Math.min(1,i/.42)**1.5);t.push([Math.max(.34,a*r),e+n*s])}return e+n}function s0(t,e,a,n,o=16){for(let l=0;l<=o;l++){const s=l/o*Math.PI*.5;t.push([Math.max(.34,a*Math.pow(Math.cos(s),.72)),e+n*Math.pow(Math.sin(s),.9)])}return e+n}function n0(t,e,a,n,o=14){for(let l=0;l<=o;l++){const s=l/o;t.push([Math.max(.34,a*(1.12-s)*(1-.55*Math.sin(s*Math.PI*.5))/1.12*1.1),e+n*s])}return e+n}function N(t,e,a,n,o,l){const s=[[t+.6,0],[t+.6,1.3],[t,1.9],[t,e-1.5],[t+.8,e-1],[t+.8,e-.2],[t+.3,e]],i=t*.8,r=Math.max(1.2,n*.12);s.push([i,e],[i,e+r*.7],[i+.35,e+r*.8],[i+.35,e+r]);let f;a===0?f=J(s,e+r,t*o,n):a===1?f=s0(s,e+r,i+.35,n*.8):f=n0(s,e+r,t+1.2,n*.7);const p=Y(s,f,l);return{pts:s,bodyH:e,H:p}}function $(t,e,a){const s=[];let i=0,r=!0;for(s.push([0,e+2.4]),i=1.7/2;i<t-.4;)r?(a?s.push([i-.45,e+2.4],[i-.45,e+2.4*.55],[i,e+2.4*.55]):s.push([i,e+2.4]),s.push([i,e]),i+=1.5):(s.push([i,e]),a?s.push([i,e+2.4*.55],[i+.45,e+2.4*.55],[i+.45,e+2.4]):s.push([i,e+2.4]),i+=1.7),r=!r;s.push([t,r?e+2.4:e]);const f=[[t,0]];for(let p=s.length-1;p>=0;p--)f.push(s[p]);return{pts:f,bodyH:e,H:e+2.4}}function e0(t,e,a){const n=[[t*1.5,0],[t*1.5,2.5],[t*1.1,3.6]],o=e*.5,l=e*.76,s=e*.86,i=(p,y,b)=>{n.push([y,p-2.2],[y+.5,p-1.6],[y*1.9+.3,p-.5],[y*1.9+.3,p+.9],[y*1.9-.1,p+.9],[y*1.9-.1,p+.3],[b,p+.3])};i(o,t,t*.86),i(l,t*.8,t*.62),n.push([t*.62,s-.8],[t*1.05,s-.4],[t*1.05,s]);const r=J(n,s,t*1,e*.085,12),f=Y(n,r,a);return{pts:n,bodyH:l-2.4,H:f}}const P=t=>{const e=t.slice();for(let a=t.length-1;a>=0;a--)t[a][0]>1e-4&&e.push([-t[a][0],t[a][1]]);return e},i0=t=>{const e=t.slice();return e.push([0,0]),e};function Q(t){const e=[],a=Math.PI/180;return D(e,0,0,t,53.4*a,-233.4*a,18),D(e,0,.3*t,.78*t,-220.1*a,40.1*a,14),e}function j(t,e){const a=[],n=[];for(let o=0;o<t.length;o++){const l=t[Math.max(0,o-1)],s=t[Math.min(t.length-1,o+1)];let i=s[0]-l[0],r=s[1]-l[1];const f=Math.hypot(i,r)||1;i/=f,r/=f,a.push([t[o][0]-r*e[o],t[o][1]+i*e[o]]),n.push([t[o][0]+r*e[o],t[o][1]-i*e[o]])}return a.concat(n.reverse())}function c0(t){const e=[];for(let n=0;n<=8;n++){const o=n/8;e.push([o*t,.75*(1-.45*o)])}e.push([t*.8,0]);for(let n=8;n>=0;n--){const o=n/8;e.push([o*t,-.75*(1-.45*o)])}return e}function V(t,e,a,n,o,l){const s=[1,1,1,0],i=n*.42,r=a-.15,f=(p,y,b,h,m)=>{let d=b-p,g=h-y;const x=Math.hypot(d,g)||1,c=-g/x*m,v=d/x*m,M=t.v(e,p+c,y+v,0,0,s,0,0,0,5,o,l),w=t.v(e,b+c,h+v,0,0,s,0,0,0,5,o,l),F=t.v(e,b-c,h-v,0,0,s,0,0,0,5,o,l),R=t.v(e,p-c,y-v,0,0,s,0,0,0,5,o,l);t.idx.push(M,w,F,M,F,R)};f(.25,r-.3,n,r-.3,.3),f(.45,r,.45,r-i,.25),f(n*.92,r-.3,.45,r-i,.22),f(n*.5,r-.3,.45,r-i*.52,.16)}const t0=[100,90,78,64,72],l0=[31,52,74,97,0];function r0(t,e,a,n){const o=G[e],l=n.layerBase+e,s=e+1,i=t0[e],r=l0[e]*a.range(.94,1.04),f=[],p=()=>a.pick(n.hues),y=13+e*2.2+a.range(-1,2);{const d=n.capBias[e%n.capBias.length],g=r*(d===0?.36:.3),x=.7+e*.12,c=r-g*(d===0?1:.8)-Math.max(1.2,g*.12)-7*x,v=N(y,c,d,g,a.range(1.02,1.14),x);f.push({pts:i0(v.pts),ox:0,dim:[y,v.bodyH,v.H,2+(e<2?1:0)],style:1,hue:p(),seed:a.range(1,90)})}let b=y,h=0,m=!1;for(;b<i-3;){const d=b/i,g=r*(1-.5*Math.pow(d,1.35)),x=i-b;if(h%2===0&&x>16){const c=Math.min(x-10,a.range(10,19)),v=c/2,M=g*a.range(.4,.54)+(e===0?3:0),w=$(v,M,a.chance(.5));if(f.push({pts:P(w.pts),ox:b+v,dim:[v,w.bodyH,w.H,e<3&&a.chance(e===0?.9:.5)?1:0],style:1,hue:p(),seed:a.range(1,90)}),c>12){const F=N(a.range(1.5,2),a.range(3,4.5),2,a.range(4,5.5),1,.3);f.push({pts:P(F.pts),ox:b+v,oy:w.bodyH,dim:[1,1,1,0],style:0})}b+=c,m=!1}else if(!m&&a.chance(n.minaretP)&&e>0&&x>8){const c=a.range(2,2.7),v=Math.min(r*1.12,g*a.range(1.15,1.35)),M=e0(c,v,.55);f.push({pts:P(M.pts),ox:b+c*1.5,dim:[c,M.bodyH,M.H,0],style:1,hue:p(),seed:a.range(1,90),top:1}),b+=c*3,m=!0}else{const c=Math.min(x/2,a.range(4.2,6.8)+e*.5),v=g*a.range(.78,.98),M=a.chance(.55)?n.capBias[(e+h)%n.capBias.length]:a.int(0,2),w=Math.min(v*.4,c*a.range(2.2,3)),F=.5+c*.05,R=Math.max(8,v-w-7*F),B=N(c,R,M,w,a.range(1,1.15),F);f.push({pts:P(B.pts),ox:b+c,dim:[c,B.bodyH,B.H,0],style:1,hue:p(),seed:a.range(1,90),flag:a.chance(.6)?a.range(4,7.5):0}),b+=c*2,m=!0}h++}for(let d=0;d<4;d++){const g=i*(.14+.25*d),x=(8+e*6.5)*(1-.15*d);V(t,g,o,x,l,s),V(t,-g,o,x,l,-s)}for(const d of f){const g={...d,z:o,lay:l,slide:s};if(z(t,{...g}),z(t,{...g,mirror:!0}),d.top){const x={pts:Q(1.1),ox:d.ox,oy:d.dim[2]+.5,z:o,lay:l,slide:s,dim:[1,1,1,0],style:0};z(t,x),z(t,{...x,mirror:!0})}if(d.flag){const x={pts:c0(d.flag),ox:d.ox,oy:d.dim[2]-1.6,z:o,lay:l,slide:s,dim:[1,1,1,0],style:5,seed:d.seed,thick:.1};z(t,x),z(t,{...x,mirror:!0})}}}function f0(t,e,a){const n=G[4],o=a.layerBase+4,l=26+e.range(-1,1.5),s=60+e.range(-3,3),i=1.5,r=e.range(48,55),f=N(l,s,0,r,e.range(1.02,1.2),i),p=[[6.3,0]].concat(f.pts);for(let c=f.pts.length-1;c>=0;c--)f.pts[c][0]>1e-4&&p.push([-f.pts[c][0],f.pts[c][1]]);p.push([-6.3,0]);const y=Math.atan2(-4.25,-6.3),b=Math.atan2(-4.25,6.3);D(p,0,9.5,7.6,y,b-_,40),z(t,{pts:p,ox:0,z:n,lay:o,dim:[l,f.bodyH,f.H,0],style:2,hue:0,seed:e.range(1,90)}),z(t,{pts:Q(2.4),ox:0,oy:f.H+1.6,z:n,lay:o,style:0});const h=[];let m=l;const d=(c,v,M)=>{const w=$(c/2,v,!0);h.push({pts:P(w.pts),ox:m+c/2,dim:[c/2,w.bodyH,w.H,M?1:0],style:1,hue:e.pick(a.hues),seed:e.range(1,90)}),m+=c},g=(c,v,M)=>{const w=Math.min(v*.4,c*2.7),F=.5+c*.05,R=N(c,v-w-7*F,M,w,1.12,F);h.push({pts:P(R.pts),ox:m+c,dim:[c,R.bodyH,R.H,0],style:1,hue:e.pick(a.hues),seed:e.range(1,90)}),m+=c*2},x=(c,v)=>{const M=e0(c,v,.8);h.push({pts:P(M.pts),ox:m+c*1.5,dim:[c,M.bodyH,M.H,0],style:1,hue:e.pick(a.hues),seed:e.range(1,90),top:1}),m+=c*3};for(const c of[22,38,55,68])V(t,c,n,30-c*.2,o,0),V(t,-c,n,30-c*.2,o,0);d(e.range(9,13),e.range(40,48),!1),x(e.range(3,3.5),e.range(114,122)),d(e.range(10,14),e.range(30,38),!0),g(e.range(5.5,7),e.range(56,68),e.int(0,1)),m<70&&d(72-m,e.range(20,26),!0);for(const c of h)if(z(t,{...c,z:n,lay:o}),z(t,{...c,z:n,lay:o,mirror:!0}),c.top){const v={pts:Q(1.5),ox:c.ox,oy:c.dim[2]+.7,z:n,lay:o,style:0};z(t,v),z(t,{...v,mirror:!0})}return{hw:l,H:f.H+4}}function h0(t,e,a){const n=[];return[e.range(24,30),e.range(58,66)].forEach((l,s)=>{const i=s===0?10.5:8,r=9,f=[[i*.55,0],[i*.55,.9],[i*.62,1.2],[i*.62,1.7],[.9,2.1],[.9,2.6]];for(let y=0;y<=44;y++){const b=-1.35+1.35*y/44,h=i*(.94+.06*Math.abs(Math.cos(b*r)));f.push([Math.max(0,-Math.sin(b)*h),2.6+Math.cos(b)*h])}const p={pts:P(f),ox:l,z:G[0]+8+s*1.5,lay:a.layerBase-1,dim:[i,2.6,i+2.6,0],style:3,hue:0,seed:e.range(1,90)};z(t,p),z(t,{...p,mirror:!0}),n.push(new L.Vector3(l,0,p.z),new L.Vector3(-l,0,p.z))}),n}function p0(t,e,a){const o=G[4]+6,l=a.layerBase+3.4,s=[20+1.2,4.3],i=17,r=11.5,f=1;for(let h=0;h<i;h++){const m=h/(i-1),d=[],g=r*(.82+.18*Math.sin(m*Math.PI))*e.range(.96,1.03);for(let v=0;v<=14;v++){const M=v/14;d.push([f*(.1+.9*Math.pow(Math.sin(Math.PI*Math.pow(M,1.7)),.8)),M*g])}const x=-1.38+2.76*m+e.range(-.02,.02),c=-1.78+(m-.5)*.3;z(t,{pts:P(d),ox:s[0],oy:s[1],z:o-.6+h*.035,thick:.08,lay:l,dim:[f,g,g,0],style:4,hue:h%2,seed:3+h,rot:[s[0],s[1],c||1e-4,x||1e-4]})}const p=(h,m=o)=>z(t,{pts:h,ox:0,oy:0,z:m,lay:l,style:0,thick:.2}),y=[];D(y,20+.2,4.7,1.75,0,_*.999,22,1.45),p(y.map(([h,m])=>[h+(m-4.7)*-.35,m])),p(j([[20-1.3,5.2],[18,6.4],[20-2.1,7.5],[20-1.7,8.3],[20-1.9,8.9]],[.95,.6,.42,.36,.3]),o+.03);const b=[];D(b,18,8.95,.62,0,_*.999,12),p(b,o+.06),p([[20-2.5,9.15],[20-3.6,8.75],[20-2.5,8.7]],o+.06);for(let h=0;h<3;h++){const m=1.2+h*.38,d=18+Math.cos(m)*1.9,g=9.3+Math.sin(m)*1.7;p(j([[18,9.4],[d,g]],[.07,.07]),o+.02);const x=[];D(x,d,g,.27,0,_*.999,8),p(x,o+.02)}return p(j([[20-.2,3.4],[20-.5,1.6],[20-.6,0]],[.2,.12,.1]),o+.02),p(j([[20+.9,3.3],[20+.9,1.6],[20+.7,0]],[.2,.12,.1]),o+.02),p([[20-1.5,0],[20+1.6,0],[20+1.6,.25],[20-1.5,.25]],o+.02),new L.Vector3(20,0,o)}function u0(t,e){for(let a=0;a<5;a++){const n=G[a],o=-(t0[a]+K+12),l=-o,s=.9,i=.3,r=[1,1,1,0],f=e.layerBase+a,p=t.v(o,i,n-s,o,-s,r,0,0,0,4,f,0),y=t.v(l,i,n-s,l,-s,r,0,0,0,4,f,0),b=t.v(l,i,n+s,l,s,r,0,0,0,4,f,0),h=t.v(o,i,n+s,o,s,r,0,0,0,4,f,0);t.idx.push(p,b,y,p,h,b)}}const d0=`
attribute vec2 aL; attribute vec4 aDim; attribute vec4 aInfo; attribute vec2 aLay; attribute vec4 aRot; attribute vec2 aN;
uniform float uProgress, uTime, uFan, uSlide;
varying vec2 vL; flat varying vec4 vDim; flat varying vec4 vInfo; flat varying vec2 vLay; varying vec3 vW; varying float vFace; varying float vRim;
#include <fog_pars_vertex>
void main() {
  vec3 p = position;
  vL = aL; vDim = aDim; vInfo = aInfo; vLay = aLay; vW = position;
  vec4 mv0 = modelViewMatrix * vec4(p, 1.0);
  if (aN.x != 0.0 || aN.y != 0.0) {                 // rim ribbon: keep about 1.5 px wide
    float w = max(0.3, -mv0.z * 0.0016);
    p.xy += aN * w; vL += aN * w; 
  }
  vRim = clamp(0.3 / max(0.3, -mv0.z * 0.0016), 0.3, 1.0);
  if (aInfo.x > 4.5) {                              // pennants on pins
    float f = abs(aL.x);
    p.y += sin(f * 0.75 - uTime * 3.0 + aInfo.z) * 0.11 * f + sin(uTime * 1.1 + aInfo.z) * 0.05 * f;
  }
  if (aRot.z != 0.0 || aRot.w != 0.0) {             // pinned parts (peacock tail)
    float a = mix(aRot.z, aRot.w, uFan) + sin(uTime * 1.3 + aRot.w * 5.0) * (0.012 + 0.02 * uFan);
    vec2 d = p.xy - aRot.xy; float c = cos(a), s = sin(a);
    p.xy = aRot.xy + vec2(c * d.x - s * d.y, s * d.x + c * d.y);
  }
  float sc = aLay.y;
  if (sc != 0.0) {
    float i = abs(sc) - 1.0;
    float o = clamp((uProgress - i * 0.2) / 0.4, 0.0, 1.0); o = o * o * (3.0 - 2.0 * o);
    p.x += sign(sc) * uSlide * o;
    p.x += sin(uTime * 0.7 + i * 2.1) * 0.03;       // the slight wobble of a hand-worked flat
  }
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  // which way the camera sees this flat: + from the front (+Z side), - from the lamp side
  vec3 camL = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  vFace = camL.z - p.z;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,m0=`
uniform vec3 uInk, uAmber, uTeal, uCream, uGold; uniform vec3 uGel[4];
uniform float uTime, uFlick, uGlow;
varying vec2 vL; flat varying vec4 vDim; flat varying vec4 vInfo; flat varying vec2 vLay; varying vec3 vW; varying float vFace; varying float vRim;
#include <fog_pars_fragment>
const float TAU = 6.2831853;
float h11(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float sdStar8(vec2 p, float r) { vec2 a = abs(p); vec2 q = abs(vec2(p.x + p.y, p.x - p.y)) * 0.7071;
  return min(max(a.x, a.y), max(q.x, q.y)) - r; }
float sdArch(vec2 p, float w, float h) { p.x = abs(p.x);
  float box = max(p.x - w, max(-p.y, p.y - h));
  return min(box, length(p - vec2(0.0, h + 0.3 * w)) - 1.12 * w); }
float sdPoint(vec2 p, float w, float h) { p.x = abs(p.x);          // pointed (two-centred) arch window
  float box = max(p.x - w, max(-p.y, p.y - h));
  float og = max(length(p - vec2(-w * 0.55, h)) - w * 1.55, -(p.y - h));
  return min(box, og); }
vec2 gCC; float gOpen; float gSel;

float bodyWin(vec2 L, vec4 dim, float seed, out float id) {
  float hw = dim.x, bodyH = dim.y, H = dim.z;
  bool arcade = mod(dim.w, 2.0) > 0.5; bool halfP = dim.w > 1.5;
  id = 0.0; gOpen = 0.0; gCC = L;
  float mx = hw < 3.6 ? 0.7 : 1.3; float W = hw - mx; float d = 1e3;
  float ah = arcade ? min(13.0, bodyH * 0.55) : 2.2;
  if (abs(L.x) < W && L.y < bodyH - 1.8) {
    if (L.y < ah) {
      if (arcade) {
        float uh = ah - 1.2;
        float nc = max(1.0, floor(2.0 * W / (uh * 0.72))); float cw = 2.0 * W / nc;
        float ci = floor((L.x + W) / cw); float cx = (ci + 0.5) * cw - W;
        float w = min(cw * 0.33, uh * 0.3);
        d = sdArch(vec2(L.x - cx, L.y), w, uh - w * 1.5);
        gCC = vec2(cx, uh * 0.5); gOpen = 1.0;
        if (halfP && abs(cx) < cw * 0.5 + 0.2) d = 1e3;
      }
    } else {
      float span = bodyH - 1.8 - ah;
      float nb = max(1.0, floor(span / (7.0 + 5.0 * h11(seed)) + 0.5)); float bh = span / nb;
      float y = L.y - ah; float bi = min(floor(y / bh), nb - 1.0); float yb = y - bi * bh;
      float bs = floor(h11(seed * 1.7 + bi * 3.1) * 5.3);
      float uh = bh - 1.3; float yy = yb - 0.65;
      if (yy > 0.0 && yy < uh) {
        if (bs < 0.5) {
          float nc = max(1.0, floor(2.0 * W / (3.3 + 2.0 * h11(seed + bi)))); float cw = 2.0 * W / nc;
          float ci = floor((L.x + W) / cw); float cx = (ci + 0.5) * cw - W;
          float w = min(cw * 0.3, uh * 0.2);
          d = sdPoint(vec2(L.x - cx, yy - 0.3), w, uh - 0.6 - w * 1.5);
          d = max(d, -(abs(L.x - cx) - 0.09) * step(1.2, w));             // mullion
          gSel = -1.0;
          id = h21(vec2(ci, bi) + seed); gCC = vec2(cx, ah + bi * bh + bh * 0.5);
          if (halfP && abs(cx) < cw * 0.5 + 0.2) d = 1e3;
        } else if (bs < 1.5) {
          float nr = max(1.0, floor(uh / 3.0)); float ch = uh / nr;
          float nc = max(1.0, floor(2.0 * W / ch)); float cw = 2.0 * W / nc;
          vec2 ci = vec2(floor((L.x + W) / cw), floor(yy / ch));
          vec2 cc = vec2((ci.x + 0.5) * cw - W, (ci.y + 0.5) * ch);
          vec2 p = vec2(L.x, yy) - cc; float r = min(cw, ch) * 0.3;
          d = mod(ci.x + ci.y, 2.0) < 0.5 ? sdStar8(p, r * 0.82) : (abs(p.x) + abs(p.y)) * 0.7071 - r * 0.6;
          id = h21(ci + seed + bi * 7.0); gCC = vec2(cc.x, ah + bi * bh + 0.65 + cc.y);
          if (halfP && abs(cc.x) < cw * 0.5 + 0.2) d = 1e3;
        } else if (bs < 2.5) {
          float c = 2.3; vec2 g = vec2(L.x, yy) / c; vec2 q = fract(g) - 0.5;
          float bars = min(abs(length(q) - 0.37) - 0.075, abs(length(abs(q) - 0.5) - 0.37) - 0.075) * c;
          float box = max(abs(L.x) - (W - 0.3), abs(yy - uh * 0.5) - uh * 0.5 + 0.3);
          if (halfP) box = max(box, 0.45 - abs(L.x));
          d = max(-bars, box);
          id = h11(seed * 2.3 + bi * 5.7);                 // one gel per lattice panel: a calm screen, not confetti
        } else {
          float nc = max(1.0, floor(2.0 * W / uh)); float cw = 2.0 * W / nc;
          float ci = floor((L.x + W) / cw); float cx = (ci + 0.5) * cw - W;
          vec2 p = vec2(L.x - cx, yy - uh * 0.5); float R = min(cw, uh) * 0.41;
          float a = atan(p.x, p.y); float pet = length(p) - R * (0.86 + 0.14 * cos(a * 8.0));
          d = max(pet, -sdStar8(p, R * 0.4));
          d = min(d, length(p) - R * 0.13);
          id = h21(vec2(ci, bi) + seed * 3.0); gCC = vec2(cx, ah + bi * bh + bh * 0.5);
          if (halfP && abs(cx) < cw * 0.5 + 0.2) d = 1e3;
        }
        if (bs > 3.5) d = 1e3;                          // a plain course
      } else if (abs(L.x) < W - 0.5 && (!halfP || abs(L.x) > 0.7)) {   // frieze of pin-pricks between courses
        vec2 p = vec2((fract(L.x / 1.15) - 0.5) * 1.15, yb < 0.65 ? yb - 0.3 : yb - bh + 0.3);
        d = (abs(p.x) + abs(p.y)) - 0.19; gSel = 2.0; id = 0.95;
      }
    }
  } else if (L.y > bodyH + 1.0) {
    float capH = H - bodyH;
    vec2 c = vec2(0.0, bodyH + capH * 0.34), rad = vec2(hw * 0.62, capH * 0.22);
    float s = clamp(hw * 0.3, 1.9, 3.4);
    vec2 ci = floor(L / s); vec2 cc = (ci + 0.5) * s;
    if (length((cc - c) / rad) < 1.0) {
      vec2 p = L - cc;
      d = mod(ci.x + ci.y, 2.0) < 0.5 ? sdStar8(p, s * 0.27) : (abs(p.x) * 1.3 + abs(p.y) * 0.75) - s * 0.3;
      id = h21(ci + seed * 5.0); gCC = cc;
    }
  }
  return d;
}

float laceBand(vec2 q, float r, float th, float rmid, float n, out vec2 p, out float ci) {
  float a = th / TAU * n; ci = floor(a + 0.5);
  p = vec2((a - ci) * TAU * rmid / n, r - rmid);
  float thc = ci * TAU / n;
  return 9.5 + cos(thc) * rmid;                      // height of the cell centre
}
float gateWin(vec2 L, vec4 dim, float seed, out float id) {
  vec2 q = L - vec2(0.0, 9.5); float r = length(q); float th = atan(q.x, q.y);
  float d = 1e3; id = 0.3; gOpen = 0.0; gSel = -1.0; vec2 p; float ci;
  if (r < 21.6) {
    if (r > 8.7 && r < 12.0) {
      float cy = laceBand(q, r, th, 10.35, 24.0, p, ci);
      if (cy > 1.6) { d = max(abs(p.x) * 1.2 + abs(p.y) * 0.72 - 0.86, -(length(p) - 0.2)); gSel = 1.0; id = h11(ci); }
    } else if (r > 12.0 && r < 16.1) {
      float cy = laceBand(q, r, th, 14.1, 26.0, p, ci);
      if (cy > 2.0) { d = max(sdStar8(p, 1.12), -(sdStar8(p, 0.42))); d = min(d, length(p) - 0.22); gSel = 0.0; id = h11(ci + 9.0); }
      float dash = max(abs(r - 12.35) - 0.11, (abs(fract(th / TAU * 60.0) - 0.5) - 0.32) * 1.2);
      if (L.y > 1.0) { if (dash < d) { d = dash; gSel = 2.0; } }
    } else if (r >= 16.1) {
      float cy = laceBand(q, r, th, 18.6, 30.0, p, ci);
      if (cy > 2.4) { d = sdPoint(vec2(p.x, p.y + 1.9), 1.0, 2.3); gSel = mod(ci, 2.0) < 0.5 ? 2.0 : 0.0; id = h11(ci + 17.0); }
      float dash = max(abs(r - 16.35) - 0.11, (abs(fract(th / TAU * 80.0) - 0.5) - 0.32) * 1.2);
      if (L.y > 1.0) { if (dash < d) { d = dash; gSel = 2.0; } }
    }
  } else {
    float idb; float db = bodyWin(L, dim, seed, idb);
    if (length(gCC - vec2(0.0, 9.5)) > 25.5 && gOpen < 0.5) { d = db; id = idb; }
    gOpen = 0.0;
    // one great rose window high in the drum of the dome
    vec2 c = vec2(0.0, dim.y - 12.0); vec2 pr = L - c; float rr = length(pr);
    if (rr < 9.5 && dim.y > 50.0) {
      float a = atan(pr.x, pr.y);
      float pet = max(rr - 7.6 * (0.88 + 0.12 * cos(a * 12.0)), -(rr - 3.1));
      pet = max(pet, -(abs(fract(a / TAU * 12.0 + 0.5) - 0.5) * TAU * rr / 12.0 - 0.16));
      d = min(pet, sdStar8(pr, 2.0)); gSel = rr < 3.0 ? 1.0 : 0.0; id = h11(floor(a / TAU * 12.0 + 0.5) + 3.0);
    } else if (rr < 11.0 && dim.y > 50.0) d = 1e3;
  }
  return d;
}
float fountainWin(vec2 L, vec4 dim, float seed, out float id) {
  vec2 q = L - vec2(0.0, 2.6); float r = length(q); float th = atan(q.x, q.y);
  float n = 19.0; float a = th / 2.7 * n; float ci = floor(a + 0.5);
  float la = (a - ci) * 2.7 * r / n; id = h11(ci + seed);
  float flow = (abs(fract(r * 0.33 - uTime * (0.45 + 0.3 * id) + id * 7.0) - 0.5) - 0.34) * 3.0;
  float d = max(abs(la) - (0.05 + 0.012 * r), flow);
  d = max(d, max(1.6 - r, r - dim.x * 0.9));
  d = max(d, abs(th) - 1.28);
  gSel = 4.0; gOpen = 0.0;
  return d;
}
float featherWin(vec2 L, vec4 dim, float hue, out float id) {
  float hw = dim.x, len = dim.y; vec2 c = vec2(0.0, len * 0.8);
  vec2 p = (L - c) / vec2(1.0, 1.35);
  float eye = max(length(p) - hw * 0.6, -(length(p - vec2(0.0, -0.08)) - hw * 0.26));
  float t = L.y / len; float wv = hw * (0.1 + 0.9 * pow(max(sin(3.14159 * pow(clamp(t, 0.0, 1.0), 1.7)), 0.0), 0.8));
  float sl = (abs(fract((L.y - abs(L.x) * 1.3) / 0.62) - 0.5) - 0.2) * 0.5;
  sl = max(sl, max(0.16 - abs(L.x), abs(L.x) - (wv - 0.22)));
  sl = max(sl, max(len * 0.22 - L.y, L.y - len * 0.66));
  id = 0.2; gOpen = 0.0;
  if (eye < sl) { gSel = hue < 0.5 ? 0.0 : 3.0; return eye; }
  gSel = 2.0; return sl;
}
vec3 gelColour(float id, float hueShift) {
  if (gSel > 3.5) return mix(uGel[0], vec3(1.0), 0.45);
  float k = gSel >= 0.0 ? gSel : mod((id < 0.58 ? 0.0 : id < 0.78 ? 1.0 : id < 0.92 ? 2.0 : 3.0) + hueShift, 4.0);
  return k < 0.5 ? uGel[0] : k < 1.5 ? uGel[1] : k < 2.5 ? uGel[2] : uGel[3];
}

void main() {
  float side = floor(vInfo.w + 0.5), style = floor(vInfo.x + 0.5), lay = vLay.x;
  float fib = vnoise(vW.xy * vec2(0.9, 5.0)) * 0.6 + vnoise(vW.xy * vec2(7.0, 1.3) + 9.0) * 0.4;
  vec3 tintTo = mix(uAmber * 0.55, uTeal * 1.25, smoothstep(0.5, 5.0, lay));
  vec3 ink = mix(uInk, tintTo, clamp(0.06 + 0.07 * lay, 0.0, 0.6)) * (0.8 + 0.4 * fib);
  vec3 col;
  if (side > 4.5) {                                   // timber stage braces behind the flats
    col = mix(uAmber * 0.2, uCream * 0.42, vnoise(vW.yz * vec2(6.0, 0.7))) * (0.7 + 0.5 * fib);
  } else if (side > 3.5) {                            // brass-lined floor slot
    float e = abs(vL.y);
    float brass = smoothstep(0.28, 0.34, e) * (1.0 - smoothstep(0.8, 0.9, e));
    float rivet = smoothstep(0.16, 0.1, length(vec2(fract(vL.x / 3.0) - 0.5, (e - 0.6) / 3.0) * 3.0));
    col = mix(uInk * 0.5, uGold * (0.22 + 0.5 * vnoise(vL.xy * vec2(0.6, 30.0))), brass) + uGold * rivet * 0.5;
  } else if (side > 2.5) {                            // warm rim just inside every cut edge
    col = vFace > 0.0 ? uAmber * 0.8 * (0.75 + 0.5 * fib) * vRim : uCream * 0.6;
  } else if (side > 1.5) {                            // raw card edge catching the lamp
    col = uCream * (0.85 + 0.35 * fib);
  } else {
    float id = 0.0; float d = 1e3; gSel = -1.0; gOpen = 0.0;
    if (style > 4.5) d = 1e3;
    else if (style > 3.5) d = featherWin(vL, vDim, vInfo.y, id);
    else if (style > 2.5) d = fountainWin(vL, vDim, vInfo.z, id);
    else if (style > 1.5) d = gateWin(vL, vDim, vInfo.z, id);
    else if (style > 0.5) d = bodyWin(vL, vDim, vInfo.z, id);
    if (gOpen > 0.5 && d < 0.0) discard;
    float fwRaw = length(fwidth(vL));
    float lod = smoothstep(0.08, 0.3, fwRaw);            // far away the smallest motifs melt into an even gel tint, not moire
    float fw = max(fwRaw * (0.75 + 2.2 * lod), 0.002);
    float win = gOpen > 0.5 ? 0.0 : clamp(0.5 - d / fw, 0.0, 1.0) * (1.0 - 0.22 * lod);
    vec3 gel = gelColour(id, vInfo.y);
    float tw = 0.82 + 0.3 * sin(uTime * (0.5 + 2.2 * h11(id * 9.1)) + id * 40.0);
    tw += 0.9 * pow(max(0.0, sin(vW.x * 0.045 + vW.y * 0.03 + vW.z * 0.05 - uTime * 0.6)), 10.0);
    float dd = max(d, 0.0);
    if (side < 0.5) {
      vec3 spill = gel * exp(-dd * 2.2) * 0.08 + uAmber * exp(-dd * 7.0) * 0.28;
      if (style > 1.5 && style < 2.5 && gSel >= 0.0) tw *= 1.4;
      if (gOpen > 0.5) spill = uAmber * exp(-dd * 5.0) * 0.8;
      col = mix(ink + spill, gel * uGlow * tw, win);
    } else {
      // lamp side: warm card, stage-flat battens, pencil construction lines, tape
      vec3 card = uCream * (0.5 + 0.16 * fib);
      vec2 g = abs(fract(vW.xy / vec2(15.0, 11.0)) - 0.5) * vec2(15.0, 11.0);
      float batten = 1.0 - smoothstep(0.26, 0.26 + fw + 0.05, min(g.x, g.y));
      card = mix(card, mix(uAmber, uCream, 0.35) * 0.36 * (0.7 + 0.6 * vnoise(vW.xy * vec2(1.0, 14.0))), batten * 0.6);
      vec2 pg = abs(fract(vL / 2.5) - 0.5) * 2.5;
      card *= 1.0 - 0.1 * (1.0 - smoothstep(0.0, fw + 0.04, min(pg.x, pg.y)));
      card *= 1.0 - 0.3 * (1.0 - smoothstep(0.03, fw + 0.12, abs(dd - 0.35))) * step(d, 50.0);
      vec2 tc = floor(vW.xy / vec2(7.0, 5.0)); vec2 tp = fract(vW.xy / vec2(7.0, 5.0)) - 0.5;
      float tape = step(0.72, h21(tc)) * step(abs(tp.x + tp.y * 0.3), 0.16) * step(abs(tp.y), 0.07);
      card = mix(card, uCream * 0.82, tape);
      card *= 0.72 + 0.4 * smoothstep(-10.0, 120.0, vW.y);
      card *= 0.86 + 0.14 * step(0.5, fract(vInfo.z * 3.7));
      col = mix(card, gel * (0.5 + 0.5 * uGlow * 0.4) * tw, win);
    }
  }
  gl_FragColor = vec4(col * uFlick, 1.0);
  #include <fog_fragment>
}`;async function v0(t,e={}){const a=t.rng.fork?t.rng.fork("filigree-palace"):t.rng,n=(e.palette&&e.palette.length>=7?e.palette:a0).map(S=>new L.Color(S)),[o,l,s,i,r,f,p]=n,y=a.int(0,2),b={layerBase:e.layerBase??0,capBias:[[0,1,0,2],[1,0,1,0],[0,0,2,1]][y],minaretP:[.35,.6,.2][y],hues:[[0,0,0,1,2],[0,0,1,1,3],[0,0,2,2,1]][a.int(0,2)]},h=o0();for(let S=0;S<4;S++)r0(h,S,a.fork("flat"+S),b),S%2&&await t.yield?.();const m=f0(h,a.fork("gate"),b);await t.yield?.();const d=h0(h,a.fork("fountain"),b),g=p0(h,a.fork("peacock"),b);u0(h,b);const x=new L.BufferGeometry;x.setAttribute("position",new L.Float32BufferAttribute(h.pos,3)),x.setAttribute("aL",new L.Float32BufferAttribute(h.aL,2)),x.setAttribute("aDim",new L.Float32BufferAttribute(h.aDim,4)),x.setAttribute("aInfo",new L.Float32BufferAttribute(h.aInfo,4)),x.setAttribute("aLay",new L.Float32BufferAttribute(h.aLay,2)),x.setAttribute("aRot",new L.Float32BufferAttribute(h.aRot,4)),x.setAttribute("aN",new L.Float32BufferAttribute(h.aN,2)),x.setIndex(h.idx);const c=m.H;x.boundingSphere=new L.Sphere(new L.Vector3(0,c*.45,0),190),x.boundingBox=new L.Box3(new L.Vector3(-150,0,-45),new L.Vector3(150,c+6,52)),await t.yield?.();const v=s.clone().lerp(i,.45).lerp(new L.Color("#ff6aa0"),.55),M=p.clone().lerp(new L.Color("#2fd27a"),.65),w=l.clone().lerp(o,.25),F=L.UniformsUtils.merge([L.UniformsLib.fog,{uProgress:{value:e.progress??0},uFan:{value:0},uTime:{value:0},uSlide:{value:K},uFlick:{value:1},uGlow:{value:e.glow??2.2},uInk:{value:f.clone()},uAmber:{value:l.clone()},uTeal:{value:r.clone()},uCream:{value:o.clone()},uGold:{value:l.clone().lerp(o,.5)},uGel:{value:[p.clone(),v,w,M]}}]),R=new L.ShaderMaterial({uniforms:F,vertexShader:d0,fragmentShader:m0,fog:!0,side:L.DoubleSide}),B=new L.Mesh(x,R);B.frustumCulled=!1,B.name="filigree-palace";const E=new L.Group;E.name="shadow-theatre-hero",E.add(B);let u=!1,T=e.progress??0,C=1;const q=e.autoDemo!==!1,k=S=>{F.uProgress.value=S;const I=Math.min(1,Math.max(0,(S-.5)/.5));F.uFan.value=I*I*(3-2*I)};k(T);const A=(S,I,O)=>new L.Vector3(S,I,O),W={portalSeat:{position:A(0,9.5,G[4]),facing:A(0,0,1),radius:7},flyThrough:[A(0,22,170),A(0,18,110),A(0,13.5,62),A(0,11,30),A(0,9.8,0),A(0,9.5,-25),A(0,9.5,G[4])],viewpoints:{front:A(0,30,250),threeQuarter:A(150,46,180),between:A(118,24,30),behind:A(-120,50,-170)},flatZ:G.slice(),slide:K,lampAxis:A(0,45,-190),peacock:g,fountains:d,gateArch:{centre:A(0,9.5,G[4]),radius:7.6,jambHalfWidth:6.3}};return{object:E,radius:105,height:c,center:A(0,52,0),anchors:W,ground:!0,groundY:0,setProgress(S){u=!0,T=Math.min(1,Math.max(0,S)),k(T)},setFlicker(S){C=S},uniforms:F,update(S,I){F.uTime.value=I,F.uFlick.value=C*(1+.06*Math.sin(I*.9)*Math.sin(I*.37+1)+.02*Math.sin(I*11.3)),!u&&q&&k(.5-.5*Math.cos(I/24*_))},dispose(){}}}export{v0 as buildHero};
