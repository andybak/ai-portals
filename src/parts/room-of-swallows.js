import*as u from"three";import{makePath as je,smoothstep as B,clamp as C,lerp as j}from"../kit/core.js";const be=["#EFE8DA","#FFFBF0","#A63A24","#D9A441","#3A6EA5","#1E1B1A","#A9C9DF"],ut=Math.PI*2,et=50,Y=42.5,Pt=75,At=285,at=285,ke=85,Pe=at+ke,Ae=1280,Ve=4096,St=512,ht=Ve/At,ze=St/ht,ae=10,se=24,re=192,H={x:et,xo:et+15,z:-.5,y:40,hw:9,hh:12},Mt={plaster:0,red:1,yellow:2,blue:3,black:4},qe={az:47,el:24.5};function Bt(t,n,r,o){return t<100?o.set(et-t,n,Y-r):t<185?o.set(-et+r,n,Y-(t-100)):t<at?o.set(-et+(t-185),n,-Y+r):o.set(et-r,n,-Y+(t-at))}function Ye(t,n,r){t<100?(n.set(-1,0,0),r.set(0,0,-1)):t<185?(n.set(0,0,-1),r.set(1,0,0)):t<at?(n.set(1,0,0),r.set(0,0,1)):(n.set(0,0,1),r.set(-1,0,0))}function Fe(t,n){let r=(se*n-t)%re;r<0&&(r+=re);const o=B(0,7,r)*(1-B(9,22,r)),e=Math.exp(-r/26)*Math.sin(r*.42)*B(16,30,r)*.45;return[o-e,r]}const Te=`
vec3 stripToRoom(vec2 q, float off){
  if (q.x < 100.0) return vec3(50.0 - q.x, q.y, 42.5 - off);
  if (q.x < 185.0) return vec3(-50.0 + off, q.y, 42.5 - (q.x - 100.0));
  if (q.x < 285.0) return vec3(-50.0 + (q.x - 185.0), q.y, -42.5 + off);
  if (q.x < 400.0) return vec3(50.0 - off, q.y, -42.5 + (q.x - 285.0));
  if (q.x < 440.0) return vec3(50.0 + clamp(q.x - 410.0, 0.0, 14.7), q.y, -9.5 + off);
  return vec3(50.0 + clamp(q.x - 460.0, 0.0, 14.7), q.y, 8.5 - off);
}
`,le=`
uniform float uGustT;
vec2 gustAt(float s){
  float ph = mod(${se.toFixed(1)} * uGustT - s, ${re.toFixed(1)});
  float bump = smoothstep(0.0, 7.0, ph) * (1.0 - smoothstep(9.0, 22.0, ph));
  float ring = exp(-ph / 26.0) * sin(ph * 0.42) * smoothstep(16.0, 30.0, ph) * 0.45;
  return vec2(bump - ring, ph);
}
`,Ut=`
uniform vec3 uSunDir;
uniform vec4 uWinIn;   // x plane, z centre, y centre, unused
uniform vec4 uWinOut;
uniform vec4 uWinHalf; // inner half width (z), inner half height, outer half width, outer half height
float sunAt(vec3 p){
  float dx = max(uSunDir.x, 0.02);
  float t1 = (uWinIn.x - p.x) / dx;
  float t2 = (uWinOut.x - p.x) / dx;
  vec3 a = p + uSunDir * t1;
  vec3 b = p + uSunDir * t2;
  float e = 0.3;
  float ia = (1.0 - smoothstep(uWinHalf.x - e, uWinHalf.x + e, abs(a.z - uWinIn.y))) * (1.0 - smoothstep(uWinHalf.y - e, uWinHalf.y + e, abs(a.y - uWinIn.z)));
  float ib = (1.0 - smoothstep(uWinHalf.z - e, uWinHalf.z + e, abs(b.z - uWinOut.y))) * (1.0 - smoothstep(uWinHalf.w - e, uWinHalf.w + e, abs(b.y - uWinOut.z)));
  return ia * ib * step(0.01, t1) * step(0.02, uSunDir.x);
}
`,Dt=`
uniform vec3 uPig[5];
uniform vec3 uPigSun[5];
vec3 pigment(float idx, float sun){
  vec3 a = uPig[0], b = uPigSun[0];
  if (idx > 3.5) { a = uPig[4]; b = uPigSun[4]; }
  else if (idx > 2.5) { a = uPig[3]; b = uPigSun[3]; }
  else if (idx > 1.5) { a = uPig[2]; b = uPigSun[2]; }
  else if (idx > 0.5) { a = uPig[1]; b = uPigSun[1]; }
  return mix(a, b, sun);
}
`,Le=`
float hash21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}
`,Ie=`
float vorEdge(vec2 x){
  vec2 n = floor(x), f = fract(x);
  vec2 mg = vec2(0.0), mr = vec2(0.0);
  float md = 8.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 r = g + vec2(hash21(n + g + 17.0), hash21(n + g + 43.0)) - f;
    float d = dot(r, r);
    if (d < md) { md = d; mr = r; mg = g; }
  }
  md = 8.0;
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
    vec2 g = mg + vec2(float(i), float(j));
    vec2 r = g + vec2(hash21(n + g + 17.0), hash21(n + g + 43.0)) - f;
    vec2 dr = r - mr;
    float l2 = dot(dr, dr);
    if (l2 > 1e-5) md = min(md, dot(0.5 * (mr + r), dr) / sqrt(l2));
  }
  return md;
}
float crackLines(vec2 q, float px){
  vec2 w = q + 0.8 * (vec2(vnoise(q * 0.4 + 3.0), vnoise(q * 0.4 + 19.0)) - 0.5);
  float d = vorEdge(w / 17.0) * 17.0;
  float he = max(0.04, 0.8 * px);
  float l = (1.0 - smoothstep(he - 0.6 * px, he + 0.6 * px, d)) * min(1.0, 0.04 / he + 0.4);
  // only some stretches of the network have opened: a crack starts, forks at a corner and stops
  float open = smoothstep(0.52, 0.57, vnoise(q * 0.085 + 31.7)) * smoothstep(0.4, 0.5, vnoise(q * 0.021 + 7.0));
  return l * open;
}
`;function Ke(t,n=46){const r=[];for(let o=0;o<=n;o++){const e=o/n,s=Math.pow(Math.max(0,Math.sin(Math.PI*e)),t.pw),w=1+t.a1*Math.sin(ut*t.f1*e+t.p1)+t.a2*Math.sin(ut*t.f2*e+t.p2),h=t.h*s*w,A=t.c+t.w*(e-.5)*(1+t.bulge*s)+t.lean*h+t.wob*Math.sin(ut*t.f3*e+t.p3)*s;r.push([A,h])}return r}function Ge(t,n,r,o,e){return t.map(([s,w])=>[n+(s-n)*r+e*(w>0?1:0),w*o])}function ie(t,n,r,o,e){if(e){t.moveTo(n[0][0],-3),t.lineTo(n[0][0],n[0][1]);for(let h=1;h<n.length-1;h++)t.quadraticCurveTo(n[h][0],n[h][1],(n[h][0]+n[h+1][0])/2,(n[h][1]+n[h+1][1])/2);const w=n[n.length-1];t.lineTo(w[0],w[1]),t.lineTo(w[0],-3),t.closePath();return}const s=o>=r?1:-1;t.moveTo(n[r][0],n[r][1]);for(let w=r+s;w!==o;w+=s)t.quadraticCurveTo(n[w][0],n[w][1],(n[w][0]+n[w+s][0])/2,(n[w][1]+n[w+s][1])/2);t.lineTo(n[o][0],n[o][1])}function Gt(t,n,r){const o=[],e=r>=n?1:-1;for(let s=n;s!==r+e;s+=e)o.push(t[s]);return o}async function Xe(t,n,r){let o=n;const e=[],s=[],w={1:[2,3],2:[1,3],3:[1,2]},h=c=>{for(let m=0;m<8;m++){const k=o(),b=k<.52?r.lead:w[r.lead][k<.76?0:1];if(b!==c)return b}return w[c][0]},A=(c,m,k)=>({c,w:m,h:k,pw:o.range(.42,.62),bulge:o.range(.05,.3),lean:o.range(-.1,.1),a1:o.range(.06,.15),f1:o.range(1.4,2.6),p1:o.range(0,ut),a2:o.range(.03,.07),f2:o.range(3.5,6.5),p2:o.range(0,ut),wob:m*o.range(.02,.05),f3:o.range(2,4),p3:o.range(0,ut)}),g=(c,m,k={})=>{const b=Ke(c);let y=0;for(const X of b)y=Math.max(y,X[1]);if(y>33.6){const X=33.6/y;for(const lt of b)lt[1]*=X}const F=b.length-1,S={pts:b,pig:m,fills:[],strokes:[],s0:c.c-c.w*.7,s1:c.c+c.w*.7,east:!!k.east},T=Math.round(F*o.range(.42,.6)),_=k.redLine?1:0,U=!k.cleft&&(e.length%5===1||e.length%5===3),E=Math.min(F,T+3),W=Math.max(0,T-1);if(S.strokes.push({pts:U?Gt(b,E,0):Gt(b,0,E),red:_,w:o.range(.75,1),dry:1}),S.strokes.push({pts:U?Gt(b,W,F):Gt(b,F,W),red:_,w:o.range(.7,1),dry:1}),k.band!==!1&&c.h>9){const X=o.range(.56,.72),lt=o.range(.6,.78),Q=o.range(-.06,.06)*c.w,rt=Ge(b,c.c,X,lt,Q),ot=k.bandPig??h(m);S.fills.push({pts:rt,pig:ot});const nt=Math.round(F*o.range(.06,.2)),ct=Math.round(F*o.range(.7,.92)),Z=o.chance(.5);if(S.strokes.push({pts:Z?Gt(rt,nt,ct):Gt(rt,ct,nt),red:ot===1||m===1?0:o.chance(.7)?1:0,w:o.range(.3,.6),dry:1}),k.core!==!1&&o.chance(.45)&&c.h>15){const tt=Ge(rt,c.c+Q,o.range(.45,.6),o.range(.5,.66),0);S.fills.push({pts:tt,pig:o.chance(.5)?0:h(ot)})}if(o.chance(.55)){const tt=c.c+Q+o.range(-.12,.12)*c.w,xt=c.h*lt*o.range(.45,.7),$=o.range(0,ut),mt=[];for(let qt=0;qt<=12;qt++){const Ft=qt/12;mt.push([tt+Math.sin(Ft*5+$)*.9+c.lean*xt*Ft,1.5+xt*Ft])}S.strokes.push({pts:mt,red:ot===1?0:1,w:o.range(.2,.4),dry:1})}}if(k.cleft){const X=c.c+c.lean*20+.8,lt=[],Q=[];for(let ot=0;ot<=14;ot++){const nt=ot/14,ct=9+19.5*nt,Z=2.1*Math.pow(Math.sin(Math.PI*(.06+.9*nt)),.8),tt=Math.sin(nt*3.4)*1.1;lt.push([X+tt-Z,ct]),Q.push([X+tt+Z*.9,ct])}const rt=lt.concat(Q.slice().reverse());S.fills.length=0,S.strokes.length=2,S.fills.push({pts:rt,pig:3,open:!0}),S.strokes.push({pts:lt,red:0,w:.75,dry:1}),S.strokes.push({pts:Q.slice().reverse(),red:0,w:.6,dry:1})}if(e.push(S),k.roots!==!1){const X=k.rootsN??Math.round(c.w*.7)+3;for(let lt=0;lt<X;lt++){const Q=k.rootT?o.range(k.rootT[0],k.rootT[1]):o.range(.05,.95),rt=Math.min(F-1,Math.floor(Q*F)),ot=Q*F-rt,nt=j(b[rt][0],b[rt+1][0],ot),ct=j(b[rt][1],b[rt+1][1],ot),Z=k.east?nt>at+.8&&nt<Pe-1&&(!k.cap||k.cap-ct>4.2):nt>2.5&&nt<At-2.5;if(ct>Math.min(c.h*.5,9)&&Z){const tt={s:nt,y:ct-.4,lean:(Q-.5)*2.2+o.range(-.2,.2),top:c.h,lobe:e.length-1};k.east&&(tt.east=!0,tt.lean*=.25,tt.cap=Math.min(k.cap??46,tt.y+7.5)),s.push(tt)}}}return S},i=(c,m,k,b={})=>{const y=b.back??o.chance(.62),F=b.all||{};let S=0;y&&(S=b.backPig??h(0),g(A(c+o.range(-.18,.18)*m,m*o.range(.5,.66),k),S,{...F,...b.backOpts||{}}));const T=b.mainPig??h(S);g(A(c+(b.mainShift??0),m*o.range(.82,1),y?k*o.range(.58,.8):k),T,{...F});const _=b.fronts??o.int(1,2);let U=o.sign();for(let E=0;E<_;E++)g(A(c+U*m*o.range(.24,.4),m*o.range(.3,.46),k*o.range(.24,.42)),h(T),{core:!1,...F}),U=-U},f=[[99,127],[227,270]];let a=2+o.range(0,5);for(;a<281;){const c=o.range(15,30),m=f.find(b=>a<b[1]&&a+c>b[0]);if(m){m[0]-a>9&&i((a+m[0])/2-.5,m[0]-a-2,o.range(17,24)),a=m[1]+o.range(2,5);continue}if(a+c>284)break;const k=a>124&&a<186;i(a+c/2,c,k?o.range(21,27):o.range(18,31.5)),a+=c+(k?o.range(2.5,6):o.chance(.6)?o.range(2.5,8):o.range(10,19)),await t.yield()}g(A(114.5,27,20.5),r.lead===1?2:r.lead);const p=A(113,19,33.5);p.lean=.03,p.pw=.46,p.bulge=.22,g(p,1,{cleft:!0,band:!1,rootsN:5,rootT:[.36,.64]}),g(A(102.5,8.5,8.5),3,{core:!1,roots:!1}),g(A(124.5,9.5,7.5),r.lead===1?2:3,{core:!1,roots:!1}),await t.yield(),i(238,20,o.range(19,23)),i(257,21,12.5,{back:!1,fronts:1});const I=(c,m,k)=>{let b=!1;for(let y=0,F=c.length-1;y<c.length;F=y++){const S=c[y],T=c[F];S[1]>k!=T[1]>k&&m<(T[0]-S[0])*(k-S[1])/(T[1]-S[1])+S[0]&&(b=!b)}return b};await t.yield();const q=e.length,P=s.length,G=s.filter(c=>{for(let m=c.lobe+1;m<q;m++)if(I(e[m].pts,c.s,c.y-.6))return!1;return!0});await t.yield(),o=n.fork("fill");const d=new Float32Array(At+2);for(const c of e)for(let m=0;m<c.pts.length-1;m++){const k=c.pts[m],b=c.pts[m+1],y=Math.max(k[1],b[1]),F=Math.max(0,Math.floor(Math.min(k[0],b[0]))),S=Math.min(At,Math.ceil(Math.max(k[0],b[0])));for(let T=F;T<=S;T++)y>d[T]&&(d[T]=y)}let v=-1,l=0;for(let c=1;c<=At;c++){const m=c<At-1&&d[c]<7.5;if(m&&v<0&&(v=c),!m&&v>=0){let k=v-2.5;const b=Math.min(c+2.5,At-.5);if(v=-1,b-k<8)continue;for(;b-k>=6.5;){const y=Math.min(b-k,o.range(11,17));l=h(l),g(A(k+y/2,y,o.range(9,15.5)),l,{core:!1}),o.chance(.65)&&g(A(k+y*o.range(.25,.75),y*o.range(.34,.5),o.range(4,7)),h(l),{core:!1,roots:!1}),k+=y*.88}await t.yield()}}const x=(c,m,k,b,y)=>{const F=A(at+c,m,k);return F.lean=0,F.wob=Math.min(F.wob,.15),F.bulge=Math.min(F.bulge,.1),F.pw=.5,g(F,b,{east:!0,core:!1,...y})},V=h(0),M=h(V);x(2.5,4.3,25,V,{rootsN:3,rootT:[.38,.62],cap:36}),x(24.3,6,28,M,{rootsN:4,rootT:[.36,.64],cap:40}),x(59.3,5,27,h(M),{rootsN:4,rootT:[.36,.64],cap:39}),await t.yield(),i(at+13,20,14,{all:{east:!0,cap:19.2},fronts:2}),i(at+42,24,16.5,{all:{east:!0,cap:23.6},fronts:2}),g(A(at+83.2,3.2,11),h(0),{east:!0,core:!1,band:!1,roots:!1}),await t.yield();const L=s.slice(P).filter(c=>{for(let m=c.lobe+1;m<e.length;m++)if(I(e[m].pts,c.s,c.y-.6))return!1;return!0});return{lobes:e,roots:G,extraRoots:L}}async function Be(t,n,r,o=Ve,e=0){const s=(I,q)=>{const P=document.createElement("canvas");return P.width=I,P.height=q,P},w=s(o,St),h=s(o,St),A=s(o/4,St/4),g=w.getContext("2d"),i=h.getContext("2d"),f=A.getContext("2d");g.fillStyle="#000",g.fillRect(0,0,o,St),i.fillStyle="#000",i.fillRect(0,0,o,St),f.fillStyle="rgb(128,0,0)",f.fillRect(0,0,o/4,St/4),g.setTransform(ht,0,0,-ht,-e*ht,St),i.setTransform(ht,0,0,-ht,-e*ht,St),f.setTransform(ht/4,0,0,-ht/4,-e*ht/4,St/4),i.lineCap="round",i.lineJoin="round",f.lineCap="round",f.lineJoin="round";const a=["#000","#f00","#0f0","#00f"];await t.yield();for(let I=0;I<n.length;I++){const q=n[I],P=new Path2D;ie(P,q.pts,0,0,!0),g.fillStyle=a[q.pig],g.fill(P);for(const d of q.fills){const v=new Path2D;if(d.open){v.moveTo(d.pts[0][0],d.pts[0][1]);for(let l=1;l<d.pts.length;l++)v.lineTo(d.pts[l][0],d.pts[l][1]);v.closePath()}else ie(v,d.pts,0,0,!0);g.fillStyle=a[d.pig],g.fill(v)}i.globalCompositeOperation="source-over",i.fillStyle="#000",i.fill(P);const G=new Path2D;for(const d of q.strokes)ie(G,d.pts,0,d.pts.length-1,!1);i.globalCompositeOperation="lighten";for(let d=ae;d>=1;d--){const v=Math.round(255*(1-(d-.5)/ae));i.lineWidth=2*d/ht,i.strokeStyle=`rgb(${v},${v},${v})`,i.stroke(G)}for(const d of q.strokes){const v=d.pts,l=v.length;f.lineWidth=1.5;let x=0,V=0;for(let M=0;M<l-1;M++)x+=Math.hypot(v[M+1][0]-v[M][0],v[M+1][1]-v[M][1]);for(let M=0;M<l-1;M++){const L=Math.hypot(v[M+1][0]-v[M][0],v[M+1][1]-v[M][1]),c=(V+.5*L)/Math.max(x,.001);V+=L;let m=0;if(M>0){const y=v[M][0]-v[M-1][0],F=v[M][1]-v[M-1][1],S=v[M+1][0]-v[M][0],T=v[M+1][1]-v[M][1],_=(y*S+F*T)/Math.max(1e-6,Math.hypot(y,F)*Math.hypot(S,T));m=Math.min(1,Math.acos(C(_,-1,1))/.3)}const k=C(d.w*j(.4,1,B(0,.14,c))*j(1,.5,B(.55,1,c))*(.8+.5*m)+.2*m,0,1),b=d.dry*B(.74,.98,c);f.strokeStyle=`rgb(${Math.round(k*255)},${Math.round(b*255)},${d.red?255:0})`,f.beginPath(),f.moveTo(v[M][0],v[M][1]),f.lineTo(v[M+1][0],v[M+1][1]),f.stroke()}}(I&1)===1&&await t.yield()}const p=(I,q)=>{const P=new u.CanvasTexture(I);return P.colorSpace=u.NoColorSpace,P.wrapS=P.wrapT=u.ClampToEdgeWrapping,P.generateMipmaps=q,P.minFilter=q?u.LinearMipmapLinearFilter:u.LinearFilter,P.magFilter=u.LinearFilter,P.anisotropy=q?r:1,P};return{tFill:p(w,!0),tLine:p(h,!0),tAux:p(A,!1)}}const Re=`
attribute vec2 aSY;
varying vec2 vSY; varying vec3 vP;
#include <common>
#include <fog_pars_vertex>
void main(){
  vSY = aSY; vP = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,_e=`
uniform sampler2D tFill, tLine, tAux;
uniform float uTime, uFloodS, uUnfinished, uCrackEnd, uBands;
uniform vec2 uStrip;   // where this mesh's canvases start along the strip, and their length in metres
uniform vec3 uPlaster, uPlasterSun;
varying vec2 vSY; varying vec3 vP;
#include <common>
#include <fog_pars_fragment>
${le}
${Ut}
${Dt}
${Le}
${Ie}
float hair(float c, float w){ return 1.0 - smoothstep(w * 0.5, w, abs(c) / max(fwidth(c), 1e-5)); }
void main(){
  vec2 q = vSY;
  float px = max(length(vec2(dFdx(q.x), dFdy(q.x))), length(vec2(dFdx(q.y), dFdy(q.y))));
  px = clamp(px, 1e-4, 4.0);
  float sun = sunAt(vP);
  vec2 g = gustAt(q.x);

  // ---- plaster: burnish, hairline cracks, day-joins, snapped string lines
  vec3 base = mix(uPlaster, uPlasterSun, sun);
  float bn = vnoise(q * 0.06) + vnoise(q * 0.19 + 11.0) - 1.0;
  base *= 1.0 + 0.016 * bn;
  float crack = crackLines(q, px);
  // the one long crack in the north wall (the tremor lengthens it): straight runs and sharp turns
  float yc = 52.0 + 9.0 * (abs(fract(q.x * 0.043) - 0.5) - 0.25) + 3.4 * (abs(fract(q.x * 0.19 + 0.3) - 0.5) - 0.25) + 0.9 * (abs(fract(q.x * 0.77) - 0.5) - 0.25);
  float big = hair(q.y - yc, 2.2) * smoothstep(196.0, 199.0, q.x) * (1.0 - smoothstep(uCrackEnd - 2.5, uCrackEnd, q.x));
  crack = max(crack, big);
  float j1 = q.y - (38.6 + 2.4 * (vnoise(vec2(q.x * 0.05, 3.0)) - 0.5));
  float j2 = q.y - (57.5 + 2.0 * (vnoise(vec2(q.x * 0.04, 13.0)) - 0.5));
  float cv = (fract(q.x / 47.5 + 0.21) - 0.5) * 47.5 + 2.0 * (vnoise(vec2(q.y * 0.06, 9.0)) - 0.5);
  float joins = max(max(hair(j1, 1.6), hair(j2, 1.6)), hair(cv, 1.6) * step(abs(cv), 3.0));
  float snap = smoothstep(0.22, 0.3, vnoise(vec2(q.x * 0.11, 5.0)));
  float strings = max(hair(q.y - 45.7, 1.5) * snap, hair(q.y - 68.9, 1.5));
  float snap2 = smoothstep(0.3, 0.36, vnoise(vec2(q.x * 0.13, 21.0)));
  float sy2 = q.y - 29.2 - 0.05 * sin(q.x * 0.9);
  strings = max(strings, hair(sy2, 1.9) * snap2 * (0.75 + 0.25 * step(0.5, vnoise(vec2(q.x * 2.3, 2.0)))));
  // where the taut string was snapped it left a spatter of beads either side of the line
  vec2 bq = vec2(q.x / 0.7, sy2 / 0.7); vec2 bi = floor(bq);
  float bh = hash21(bi + 91.0);
  float bead = (1.0 - smoothstep(0.16, 0.16 + px / 0.7, length(fract(bq) - 0.5 - 0.3 * (vec2(bh, hash21(bi + 5.0)) - 0.5))));
  strings = max(strings, 0.8 * bead * step(0.86, bh) * step(abs(sy2), 1.05) * snap2 * (1.0 - smoothstep(0.1, 0.3, px)));
  vec3 col = base * (1.0 - 0.17 * crack) * (1.0 - 0.07 * joins) * (1.0 - 0.2 * strings);

  // ---- the unfinished wall: a red sketch until the flood front has passed
  float zone = uUnfinished * smoothstep(99.0, 101.0, q.x) * (1.0 - smoothstep(184.0, 186.0, q.x));
  float flooded = smoothstep(0.0, max(0.12, 1.5 * px), uFloodS - q.x + 10.0 * (vnoise(q * 0.2) - 0.5) + 2.2 * (vnoise(q * 0.9 + 7.0) - 0.5) + 0.5 * (vnoise(q * 4.0 + 3.0) - 0.5));
  float sketch = zone * (1.0 - flooded);
  float sv = (fract(q.x / 14.2 + 0.4) - 0.5) * 14.2;
  float guide = max(max(hair(q.y - 11.8, 1.6), hair(q.y - 23.6, 1.6)), max(hair(q.y - 34.4, 1.6), hair(sv, 1.6) * step(abs(sv), 2.0) * step(q.y, 46.0)));
  col = mix(col, pigment(1.0, sun), guide * zone * mix(0.16, 0.8, 1.0 - flooded));

  // ---- the crags: flat fields butted edge to edge, then the loaded-brush outline
  float pin = smoothstep(0.0, 7.0, q.y);
  vec2 rp = q + g.x * pin * vec2(0.6 * sin(0.33 * q.y + 0.35 * g.y), 0.24 * sin(0.4 * q.x + 0.5 * g.y));
  vec2 uv = vec2((rp.x - uStrip.x) / uStrip.y, rp.y / ${ze.toFixed(4)});
  float inTex = 1.0 - step(${(ze-.2).toFixed(3)}, rp.y);
  vec3 cov = texture2D(tFill, uv).rgb * inTex;
  float prox = texture2D(tLine, uv).r * inTex;
  vec3 aux = texture2D(tAux, uv).rgb;
  float d = (1.0 - prox) * ${(ae/ht).toFixed(4)};
  float m = max(cov.r, max(cov.g, cov.b));
  float idx = cov.r >= m ? 1.0 : (cov.g >= m ? 2.0 : 3.0);
  float aa = clamp(px * ${(ht*.6).toFixed(3)}, 0.03, 0.45);
  float fillA = smoothstep(0.5 - aa, 0.5 + aa, m) * (1.0 - sketch);
  float hw = mix(0.075, 0.3, aux.r) * (1.0 - 0.3 * aux.g) * mix(1.0, 0.75, sketch);
  float hwe = max(hw, 0.8 * px);
  float line = 1.0 - smoothstep(hwe - 0.7 * px, hwe + 0.7 * px, d);
  float speck = mix(0.5 * vnoise(rp * vec2(6.5, 1.7)) + 0.3 * vnoise(rp * vec2(1.9, 7.5) + 5.0) + 0.2 * vnoise(rp * 12.0 + 3.0), 0.5, smoothstep(0.1, 0.4, px));
  line *= smoothstep(aux.g * 1.15 - 0.14, aux.g * 1.15, speck + 0.12) * min(1.0, hw / hwe + 0.35);
  col = mix(col, pigment(idx, sun), fillA);
  float lineRed = max(step(0.5, aux.b), step(0.5, sketch));
  col = mix(col, pigment(mix(4.0, 1.0, lineRed), sun), line);

  // ---- the bands under the ceiling
  float e = px * 0.8;
  float bRed1 = smoothstep(69.6 - e, 69.6 + e, q.y) * (1.0 - smoothstep(71.6 - e, 71.6 + e, q.y));
  float bBlk = smoothstep(72.35 - e, 72.35 + e, q.y) * (1.0 - smoothstep(73.0 - e, 73.0 + e, q.y));
  float bRed2 = smoothstep(73.8 - e, 73.8 + e, q.y) * step(2.5, uBands);
  col = mix(col, pigment(1.0, sun), max(bRed1, bRed2));
  col = mix(col, pigment(4.0, sun), bBlk);

  // ---- flecks of red pigment blown along with the front
  vec2 fq = vec2(q.x - ${(se*.8).toFixed(1)} * uGustT, q.y) / 1.9;
  vec2 fi = floor(fq);
  float fh = hash21(fi);
  vec2 fc = fi + 0.5 + 0.5 * (vec2(hash21(fi + 3.1), hash21(fi + 7.7)) - 0.5);
  fc.y += 0.12 * sin(uTime * 3.0 + fh * 40.0);
  float fr = 0.07 + 0.09 * hash21(fi + 1.7);
  float fre = max(fr, 0.9 * px);
  float fl = (1.0 - smoothstep(fre - 0.6 * px, fre + 0.6 * px, length(fq - fc) * 1.9)) * step(0.9, fh) * (fr * fr) / (fre * fre);
  col = mix(col, pigment(1.0, sun), fl * smoothstep(0.12, 0.45, g.x) * step(q.y, 68.0));

  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}
`;function Je(){const t=[],n=[],r=[],o=new u.Vector3,e=(w,h)=>{const A=t.length/3;for(const[g,i]of[[w,0],[h,0],[h,Pt],[w,Pt]])Bt(g===h?h-1e-6:g,i,0,o),t.push(Math.round(o.x*1e3)/1e3,o.y,Math.round(o.z*1e3)/1e3),n.push(g,i);r.push(A,A+1,A+2,A,A+2,A+3)};e(0,100),e(100,185),e(185,285);const s=new u.BufferGeometry;return s.setAttribute("position",new u.Float32BufferAttribute(t,3)),s.setAttribute("aSY",new u.Float32BufferAttribute(n,2)),s.setIndex(r),s.boundingSphere=new u.Sphere(new u.Vector3(0,Pt/2,0),80),s}const Ze=[{z0:-37,z1:-22,y0:20,y1:42},{z0:-9.5,z1:8.5,y0:28,y1:52},{z0:21.5,z1:37.5,y0:-1,y1:50}];function Qe(){const t=[],n=[],r=[],o=[-Y,-37,-22,-9.5,8.5,21.5,37.5,Y],e=[0,20,28,42,50,52,Pt],s=(h,A)=>Ze.some(g=>h>g.z0&&h<g.z1&&A>g.y0&&A<g.y1);for(let h=0;h<o.length-1;h++)for(let A=0;A<e.length-1;A++){if(s((o[h]+o[h+1])/2,(e[A]+e[A+1])/2))continue;const g=t.length/3;for(const[i,f]of[[o[h],e[A]],[o[h+1],e[A]],[o[h+1],e[A+1]],[o[h],e[A+1]]])t.push(et,f,i),n.push(at+i+Y,f);r.push(g,g+1,g+2,g,g+2,g+3)}const w=new u.BufferGeometry;return w.setAttribute("position",new u.Float32BufferAttribute(t,3)),w.setAttribute("aSY",new u.Float32BufferAttribute(n,2)),w.setIndex(r),w.boundingSphere=new u.Sphere(new u.Vector3(0,Pt/2,0),80),w}function to(t){const n=[],r=[],o=[],e=[];for(let f=0;f<=12;f++){const a=f/12;if(n.push(-1,a,0,1,a,0),r.push(0,0,0,0),o.push(-1,.1,1,.1),f<12){const p=f*2;e.push(p,p+1,p+3,p,p+3,p+2)}}const w=(f,a,p,I)=>{const q=n.length/3,P=[],G=[];let d=[0,0],v=[0,0];for(let l=0;l<=f;l++){const x=l/f,V=a(x),M=p(x);P.push([d[0],d[1],V.a,V.w]),G.push([v[0],v[1],M.a,M.w]),d=[d[0]+Math.sin(V.a)*V.len/f,d[1]+Math.cos(V.a)*V.len/f],v=[v[0]+Math.sin(M.a)*M.len/f,v[1]+Math.cos(M.a)*M.len/f]}for(let l=0;l<=f;l++){for(const x of[-1,1]){const[V,M,L,c]=P[l],[m,k,b,y]=G[l];n.push(V+Math.cos(L)*x*c,M-Math.sin(L)*x*c,I),r.push(m+Math.cos(b)*x*y,k-Math.sin(b)*x*y),o.push(x,c)}if(l<f){const x=q+l*2;e.push(x,x+1,x+3,x,x+3,x+2)}}return[P[f],G[f]]},h=(f,a,p,I)=>{const q=n.length/3;n.push(f[0],f[1],I),r.push(a[0],a[1]),o.push(0,p);for(let P=0;P<6;P++){const G=P/6*ut;n.push(f[0]+Math.cos(G)*p,f[1]+Math.sin(G)*p,I),r.push(a[0]+Math.cos(G)*p*.4,a[1]+Math.sin(G)*p*.4),o.push(1,p)}for(let P=0;P<6;P++)e.push(q,q+1+P,q+1+(P+1)%6)},A=t==="papyrus",g=A?[-.66,-.22,.22,.66]:[-.62,-.2,.2,.62];for(const f of g){const[a,p]=w(3,I=>({a:f*(1+.5*I),len:A?3.15:1.9,w:.07-.02*I}),I=>({a:f*.08,len:1.5,w:.03}),1);h(a,p,A?.2:.17,1)}for(const f of[-1,1,0]){const a=f===0?2.8:f<0?2:2.4;A?w(8,p=>({a:f*.52,len:2.45,w:.1+.8*p-(p>.9?(p-.9)*3.5:0)}),p=>({a:f*.06,len:2,w:.08+.2*Math.sin(Math.PI*Math.min(1,.05+.95*p))}),a):f===0?w(10,p=>({a:.14*Math.sin(p*3),len:2.35,w:.4*Math.pow(Math.sin(Math.PI*(.1+.9*p)),.75)}),p=>({a:.03*Math.sin(p*3),len:2.3,w:.21*Math.pow(Math.sin(Math.PI*(.05+.95*p)),.8)}),a):w(10,p=>({a:f*(.42+2.3*Math.pow(p,1.25)),len:2.75,w:.43*Math.pow(Math.sin(Math.PI*(.1+.9*p)),.75)*(1-.15*p)}),p=>({a:f*.06*p,len:2.2,w:.2*Math.pow(Math.sin(Math.PI*(.05+.95*p)),.8)}),a)}const i=new u.BufferGeometry;return i.setAttribute("position",new u.Float32BufferAttribute(n,3)),i.setAttribute("aBud",new u.Float32BufferAttribute(r,2)),i.setAttribute("aAcr",new u.Float32BufferAttribute(o,2)),i.setIndex(e),i}const eo=`
attribute vec2 aBud; attribute vec2 aAcr;
attribute vec4 iRoot;  // s, y, stem length, lean
attribute vec4 iMisc;  // seed, bud-opening u (negative: open from the start), head scale, metres off the wall
uniform float uTime, uU, uFloodS, uUnfinished;
varying vec2 vAcr; varying float vPart; varying vec3 vP; varying float vSketch;
#include <common>
#include <fog_pars_vertex>
${le}
${Te}
void main(){
  float part = position.z;
  float seed = iMisc.x;
  vec2 g = gustAt(iRoot.x);
  float bow = iRoot.w + 0.6 * g.x * (0.75 + 0.5 * fract(seed * 7.13)) + 0.03 * sin(uTime * 0.9 + seed * 6.283);
  float lim = mix(1.3, 0.3, step(${at.toFixed(1)}, iRoot.x));   // stiff on the east wall: nothing leans out over an opening
  bow = clamp(bow, -lim, lim);
  float L = iRoot.z;
  float open = iMisc.y < 0.0 ? 1.0 : smoothstep(iMisc.y, iMisc.y + 0.03, uU);
  vec3 rootP = stripToRoom(iRoot.xy, 0.1);
  float dist = length((modelViewMatrix * vec4(rootP, 1.0)).xyz);
  vec2 q;
  if (part < 0.5) {
    float t = position.y;
    vec2 c = vec2(L * bow * t * t, L * t * (1.0 - 0.2 * bow * bow * t));
    vec2 tg = normalize(vec2(2.0 * bow * t, 1.0 - 0.4 * bow * bow * t));
    float w = mix(0.075, 0.04, t) * (1.0 + 0.45 * sin(3.14159 * t));
    w = max(w, 0.0013 * dist);
    q = c + vec2(tg.y, -tg.x) * position.x * w;
    vAcr = vec2(position.x, w);
  } else {
    vec2 tip = vec2(L * bow, L * (1.0 - 0.2 * bow * bow));
    float ang = atan(2.0 * bow, 1.0 - 0.4 * bow * bow) * 1.25;
    vec2 h = mix(aBud, position.xy, open) * iMisc.z;
    float cs = cos(ang), sn = sin(ang);
    q = tip + vec2(h.x * cs + h.y * sn, -h.x * sn + h.y * cs);
    vAcr = vec2(aAcr.x, aAcr.y * iMisc.z * mix(0.5, 1.0, open));
  }
  vPart = part;
  // on the unfinished wall a lily is a red sketch until the colour has reached its root (one value for the whole lily)
  vSketch = uUnfinished * step(100.0, iRoot.x) * step(iRoot.x, 185.0) * (1.0 - smoothstep(-1.5, 1.5, uFloodS - iRoot.x - 4.0 * (fract(seed * 13.7) - 0.5)));
  vec3 P = stripToRoom(iRoot.xy + q, iMisc.w + 0.012 * part);
  vP = P;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,oo=`
uniform float uPetal, uStamen, uOutline;
varying vec2 vAcr; varying float vPart; varying vec3 vP; varying float vSketch;
#include <common>
#include <fog_pars_fragment>
${Ut}
${Dt}
void main(){
  float sun = sunAt(vP);
  float ed = (1.0 - abs(vAcr.x)) * vAcr.y;
  float aa = max(fwidth(ed), 1e-4);
  float lw = max(0.085, 1.2 * aa);
  float inner = smoothstep(lw - aa, lw + aa, ed);
  vec3 redP = pigment(1.0, sun);
  vec3 col = pigment(2.0, sun);
  if (vPart > 1.5) {
    col = pigment(uPetal, sun);
    if (uOutline > 0.5) col = mix(redP, col, inner);
    // the sketch: bare plaster inside one red line
    col = mix(col, mix(redP, pigment(0.0, sun), inner), vSketch);
  } else if (vPart > 0.5) {
    col = mix(pigment(uStamen, sun), redP, vSketch);
  } else {
    col = mix(col, redP, vSketch);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}
`;function no(t,n){return t<100?n?.63+(t-20)/447*.6:(t+2)/447:t<185?.19+(t-100)/85*.12:t<at?.325+(t-185)/100*.115:.46+(t-at)/ke*.09}function ce(t,n,r){const o=r*3,e=new Float32Array(o*4),s=new Float32Array(o*4),w=[];for(const A of[3.4,2.2,1.2,0])for(const g of t.shuffle(n.slice())){if(w.length>=r)break;w.includes(g)||(A===0||w.every(i=>Math.abs(i.s-g.s)>A||Math.abs(i.y-g.y)>A*1.5))&&w.push(g)}let h=0;for(let A=0;A<r;A++){const g=w[A%w.length],i=Math.floor(A/w.length),f=g.s+i*t.range(-1.6,1.6),a=C(g.lean,-.85,.85),p=t.range(8,14)*(1-.3*Math.abs(a)),I=t.chance(.25),q=C(no(f,t.chance(.4))+t.range(-.05,.02),.02,.9),P=t.shuffle([-1,0,1]);for(let G=0;G<3;G++){const d=P[G],v=Math.max(g.east?3.4:5,Math.min(p*(d===0?1.08:t.range(.78,.98)),(g.cap??46.5)-g.y));e[h*4]=g.east?C(f+d*.45,at+.4,Pe-.5):C(f+d*.45,1,At-1),e[h*4+1]=g.y-Math.abs(d)*.3,e[h*4+2]=v,e[h*4+3]=a*.6+d*t.range(.16,.3)+t.range(-.04,.04),s[h*4]=t(),s[h*4+1]=I?q+G*.006:-1,s[h*4+2]=t.range(.85,1.15),s[h*4+3]=.12+.012*(h%16),h++}}return{iRoot:e,iMisc:s,n:o}}function ao(t,n,r){const o=t.reduce((g,i)=>g+i.n,0),e=new Float32Array(o*4),s=new Float32Array(o*4);let w=0;for(const g of t)e.set(g.iRoot,w*4),s.set(g.iMisc,w*4),w+=g.n;const h=new u.InstancedBufferGeometry;h.index=n.index;for(const g of["position","aBud","aAcr"])h.setAttribute(g,n.getAttribute(g));h.setAttribute("iRoot",new u.InstancedBufferAttribute(e,4)),h.setAttribute("iMisc",new u.InstancedBufferAttribute(s,4)),h.instanceCount=o;const A=new u.Mesh(h,r);return A.frustumCulled=!1,A}function so(){const t=[],n=[],r=[],o=[],e=(l,x)=>new u.Vector2(l,x),s=(l,x)=>new u.SplineCurve(l.map(V=>e(V[0],V[1]))).getPoints(x),h=(l,x,V,M,L,c)=>{t.push(l,x,V),n.push(M),r.push(L?L*Math.max(0,Math.abs(x)-.42):0,c?C((-l-1.2)/3.4,0,1):0)},A=(l,x,V,M=0,L=!1)=>{const c=t.length/3;for(const m of l)h(m.x,m.y,x,V,M,L);for(const m of u.ShapeUtils.triangulateShape(l,[]))o.push(c+m[0],c+m[1],c+m[2])},g=(l,x,V,M,L=0,c=!1)=>{const m=t.length/3,k=l.length-1;for(let b=0;b<=k;b++){const y=l[Math.max(0,b-1)],F=l[Math.min(k,b+1)];let S=F.x-y.x,T=F.y-y.y;const _=Math.hypot(S,T)||1;S/=_,T/=_;const U=x(b/k);if(h(l[b].x-T*U,l[b].y+S*U,V,M,L,c),h(l[b].x+T*U,l[b].y-S*U,V,M,L,c),b<k){const E=m+b*2;o.push(E,E+1,E+3,E,E+3,E+2)}}},i=l=>l>1?.36*Math.sqrt(Math.max(0,1-(l-1)/.4*((l-1)/.4))):l>.2?j(.45,.36,B(.2,1,l)):j(.12,.45,B(-1.25,.2,l)),a=[];for(let l=0;l<=14;l++)a.push(j(-1.25,1.4,l/14));for(const l of[1,-1]){const x=s([[.6,.38],[.82,1.25],[.25,2.25],[-1.95,3]].map(([L,c])=>[L,c*l]),12),V=s([[-1.95,3],[-.95,2.05],[-.72,1.15],[-.5,.38]].map(([L,c])=>[L,c*l]),9),M=x.concat(V.slice(1));A(l>0?M.slice().reverse():M,0,Mt.plaster,l),g(x,L=>.1+.16*Math.pow(Math.sin(Math.PI*Math.min(1,.12+.88*L)),.7)*(L>.97?.2:1),1,Mt.black,l),g(V,L=>.03+.085*Math.sin(Math.PI*Math.min(1,.1+.9*L)),1,Mt.black,l);for(const[L,c]of[[.42,.95],[.6,.8],[.78,.6]]){const m=x[Math.round(L*12)],k=s([[m.x,m.y],[m.x-c*.6,m.y-l*.1],[m.x-c,m.y-l*.32]],3);g(k,b=>.085*(1-.75*b),1,Mt.black,l)}}A([e(-1.15,.13),e(-2.35,.42),e(-2,0),e(-2.35,-.42),e(-1.15,-.13)],0,Mt.plaster,0,!0);for(const l of[1,-1]){const x=s([[-1.1,.1*l],[-2.3,.4*l],[-3.6,.72*l],[-4.65,1.15*l]],10);g(x,V=>.17*(1-.55*V)*(V>.96?.25:1),1,Mt.black,0,!0)}const p=a.map(l=>e(l,i(l))),I=a.map(l=>e(l,-i(l)));A(I.concat(p.slice().reverse()),0,Mt.plaster);const q=a.map(l=>e(l,i(l)*(l>.7?j(.12,-.25,B(.7,1.3,l)):.12)));A(q.concat(p.slice().reverse()),1,Mt.black);const P=[];for(let l=0;l<=6;l++)P.push(j(.5,1.36,l/6));const G=P.map(l=>e(l,i(l)*j(0,-.3,B(.5,1.3,l)))),d=P.map(l=>e(l,-i(l)));A(d.concat(G.slice().reverse()),2,Mt.red),g(a.slice(0,10).map(l=>e(l,-i(l)+.05)),l=>.06+.05*Math.sin(Math.PI*l),1,Mt.black),A([e(1.3,.13),e(1.3,-.1),e(1.9,0)],1,Mt.black);const v=new u.BufferGeometry;return v.setAttribute("position",new u.Float32BufferAttribute(t,3)),v.setAttribute("aPig",new u.Float32BufferAttribute(n,1)),v.setAttribute("aAnim",new u.Float32BufferAttribute(r,2)),v.setIndex(o),v}const ro=`
attribute float aPig; attribute vec2 aAnim;
attribute vec4 iState;   // wing angle, air 0..1, seed, opacity (ghost only)
uniform float uTime, uGhost;
varying float vPig; varying vec3 vP; varying float vA;
#include <common>
#include <fog_pars_vertex>
void main(){
  vec3 p = vec3(position.xy, 0.0);
  float r = abs(aAnim.x), sg = sign(aAnim.x);
  float ang = iState.x * (0.35 + 0.65 * smoothstep(0.0, 2.6, r)) * (1.0 - uGhost);
  if (r > 0.0) { p.y = sg * (0.42 + r * cos(ang)); p.z = r * sin(ang); }
  float tl = aAnim.y;
  p.y += tl * tl * 0.55 * sin(uTime * 7.0 + iState.z * 6.283 - tl * 3.0) * iState.y * (1.0 - uGhost);
  p.z += tl * tl * 0.35 * sin(uTime * 5.3 + iState.z * 9.1 - tl * 2.4) * iState.y * (1.0 - uGhost);
  p.z += position.z * 0.014;
  vec4 lp = iMat * vec4(p, 1.0);
  vP = lp.xyz; vPig = aPig; vA = iState.w;
  vec4 mvPosition = modelViewMatrix * lp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Ee=`
uniform float uGhost;
uniform vec3 uGhostCol, uGhostSun, uGhostLine;
varying float vPig; varying vec3 vP; varying float vA;
#include <common>
#include <fog_pars_fragment>
${Ut}
${Dt}
void main(){
  float sun = sunAt(vP);
  vec3 col = pigment(vPig, sun);
  float a = 1.0;
  if (uGhost > 0.5) { col = mix(mix(uGhostCol, uGhostSun, sun), uGhostLine * mix(1.0, 1.08, sun), step(0.5, vPig) * step(vPig, 4.5) * 0.85); a = vA; }
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}
`,R=new u.Vector3,wt=new u.Vector3,fe=new u.Vector3,Nt=new u.Vector3,K=new u.Vector3(0,1,0),Vt=t=>{const n=C(t,0,1);return n*n*(3-2*n)};function Wt(t,n,r){const o=t.length-1,e=C(n,0,1)*o,s=Math.min(o-1,Math.floor(e)),w=e-s,h=t[Math.max(0,s-1)],A=t[s],g=t[s+1],i=t[Math.min(o,s+2)],f=w*w,a=f*w,p=-.5*a+f-.5*w,I=1.5*a-2.5*f+1,q=-1.5*a+2*f+.5*w,P=.5*a-.5*f;return r.set(p*h.x+I*A.x+q*g.x+P*i.x,p*h.y+I*A.y+q*g.y+P*i.y,p*h.z+I*A.z+q*g.z+P*i.z)}function ue(t,n,r){let o=0;for(;o<t.length-2&&n>t[o+1].u;)o++;const e=t[o],s=t[o+1],w=Math.max(1e-6,s.u-e.u),h=C((n-e.u)/w,0,1),A=h*h,g=A*h,i=2*g-3*A+1,f=(g-2*A+h)*w,a=-2*g+3*A,p=(g-A)*w;return r.set(i*e.p.x+f*e.m.x+a*s.p.x+p*s.m.x,i*e.p.y+f*e.m.y+a*s.p.y+p*s.m.y,i*e.p.z+f*e.m.z+a*s.p.z+p*s.m.z)}function he(t){for(let n=0;n<t.length;n++){const r=t[n];if(r.m)continue;if(r.stop||n===0||n===t.length-1){r.m=new u.Vector3;continue}const o=t[n-1],e=t[n+1];r.m=e.p.clone().sub(o.p).multiplyScalar(1/Math.max(1e-6,e.u-o.u))}return t}const lo=17,gt={lift:.35,off:.362,kiss0:.795,kiss1:.818,kiss2:.922,kiss3:.952,back:9,down:9},bt={len:172,dive:347,pts:[[40,60,-30],[20,58,-34],[0,54,-33],[-18,45,-26],[-32,36,-14],[-38,29.5,-5],[-31.5,27,.5],[-17,26.5,2],[0,26.5,1.5],[14,28,3],[25,31,8.5],[32.5,34,18],[29,38,29.5],[12,43,33],[-10,49,33],[-30,55,30],[-41,58,16],[-38,60,5],[-28,61,-1],[-10,58.5,-.5],[10,55,-.5],[30,49,-.5],[42,44.5,-.5],[50,41.5,-.5],[64,41,-.5],[88,47,-1],[130,62,-2],[200,90,-4]],s:[[.62,145],[.64,160],[.66,175],[.68,192],[.7,215],[.72,247],[.75,303],[.79,352],[.818,365],[.83,395],[.87,475],[.905,523],[.94,543],[.97,556],[1,568]],off0:.636,offSpan:.032},$t=[[1,0],[.8,4.6],[.6,9],[.42,13],[.26,16.5]];function io(t){const n=[],r=[],o=(i,f,a,p,I)=>{for(let q=0;q<60;q++){const P=t.range(i,f),G=t.range(a,p);if(r.every(d=>Math.abs(d[0]-P)>I||Math.abs(d[1]-G)>7))return[P,G]}return[t.range(i,f),t.range(a,p)]},e=(i,f,a,p,I,q=!1)=>{const P={i:n.length,pair:i,role:f,s:a,y:p,ang:I,hero:q,seed:t(),flights:[],keys:null,sgn:1,wallP:new u.Vector3,wallOut:new u.Vector3,wf:new u.Vector3,wn:new u.Vector3,wl:new u.Vector3,pf:new u.Vector3,face:new u.Vector3,face2:new u.Vector3(1,0,0),flock:[t.range(-1.1,0),t.range(-8,8),t.range(-8,8)],ring:n.length*.618034%1};return r.push([a,p]),Bt(a,p,.4,P.wallP),Bt(a,p,1.7,P.wallOut),Ye(a,R,P.wn),P.wf.copy(R).multiplyScalar(Math.cos(I)).addScaledVector(K,Math.sin(I)),P.wl.crossVectors(P.wn,P.wf),P.wl.y<0&&P.wl.negate(),P.pf.copy(P.wf),n.push(P),P},s=(i,f,a,p,I,q=!1,P=t.chance(.65))=>{const[G,d]=o(f+5,a-5,p,I,13);if(P){const V=t.range(3.4,4.3),M=t.range(-.2,.25);return[e(i,0,G-V,d+t.range(-.6,.6),M,q),e(i,1,G+V,d+t.range(-.6,.6),Math.PI-M*t.range(.4,1.2),q)]}const v=e(i,0,G,d,t.range(-.5,.6)+(t.chance(.5)?Math.PI:0),q),[l,x]=o(Math.max(f+5,G-30),Math.min(a-5,G+30),p,I,11);return[v,e(i,1,l,x,t.range(-.5,.6)+(t.chance(.5)?Math.PI:0),q)]},w=[];r.push([259,22]),w.push({hero:!0,birds:[e(0,0,254.6,22.4,.12,!0),e(0,1,263.4,21.6,Math.PI-.1,!0)]}),[{rest:[104,124,46,52],win:[.03,.25],ph:[.08,.5,.69,.95],meet:[-33,22.5,10],at:[.16,-9.5,12.5,-18.5]},{rest:[138,168,47,60],win:[.16,.33],ph:[.07,.42,.66,.94],meet:[-42.5,18.5,-15.5],at:[.25,-5,10,-21]},{rest:[196,226,47,60],win:[.27,.43],ph:[.07,.44,.6,.94],meet:[-12,25,-27]},{rest:[236,280,48,62],win:[.43,.59],ph:[.07,.44,.6,.94],meet:[45,41,-19]},{rest:[4,34,47,60],win:[.49,.66],ph:[.07,.44,.6,.94],meet:[6,45,17]},{rest:[40,78,50,64],win:[.6,.77],ph:[.07,.44,.6,.94],meet:[2,50,35]}].forEach((i,f)=>{const a=s(f+1,i.rest[0],i.rest[1],i.rest[2],i.rest[3],!1,!0);w.push({birds:a,flights:[{u0:i.win[0],u1:i.win[1],ph:i.ph,meet:new u.Vector3(...i.meet),at:i.at||null}],taught:!0})});for(let i=7;i<20;i++){const f=i%3,a=f===0?[0,100]:f===1?[100,185]:[185,285],p=s(i,a[0],a[1],47,66),I=[];let q=-.1+(i-7)/13*.5+t.range(-.02,.02);for(let P=0;P<2;P++){const G=t.range(.17,.23),d=new u.Vector3(t.range(-32,32),t.range(44,63),t.range(-27,27));I.push({u0:q,u1:q+G,ph:[.07,.44,.6,.94],meet:d}),q+=G+t.range(.24,.34)}w.push({birds:p,flights:I})}const A=[{rest:[62,96,40,54],ang:.15,flights:[{u0:-.02,back:.105,sp:.7,fan:4.5,way:[["L",.05,26,5,13],["L",.068,26,5,15],["L",.085,24,5,14]]}]},{rest:[124,165,44,57],ang:Math.PI-.2,flights:[{u0:.125,back:.232,sp:1,fan:3.6,way:[["L",.185,26,-2,15],["L",.205,26,-3,17]]}]},{rest:[192,240,46,58],ang:.2,flights:[{u0:.255,back:.365,sp:.55,fan:4.6,way:[["L",.325,21,4,8.5],["L",.342,21,4,9]]}]},{rest:[at+3,at+82,58.5,66.5],ang:Math.PI-.15,flights:[{u0:.478,back:.75,sp:0,sink:[7,.6,.645,.7,.73],trail:{gap:7.4,pts:[[2,62,14],[-14,56,23],[-29,37.5,27.5],[-36.5,36.5,13],[-37.5,36.5,-6],[-37,36.5,-22],[-30,36.5,-33],[-15,37,-36.5],[2,38,-35.5],[19,41,-31],[34,55,-14]],s:[[.531,0],[.55,30],[.568,58],[.587,85],[.605,99],[.66,113],[.685,133],[.708,156],[.735,190]]}}]},{n:14,rest:[5,60,60.5,67.5],ang:Math.PI-.1,flights:[{u0:.345,back:.492,sp:0,ring:{c:[10,47.5,3],r:17.5,tilt:2.6,turn:620}}]}];for(const i of A){const f=[];for(let a=0;a<(i.n||8);a++){const[p,I]=o(i.rest[0],i.rest[1],i.rest[2],i.rest[3],i.n?5.5:6.5),q=e(w.length,a,p,I,i.ang+t.range(-.3,.3)),P=a*3%8-3.5;q.off=[(P+3.5)*5.5,t.range(-5,5),P*4+t.range(-1.5,1.5),t.range(0,ut)],f.push(q)}w.push({birds:f,loose:!0,flights:i.flights.map(a=>({u0:a.u0,u1:a.back+.05,back:a.back,sp:a.sp,way:a.way,trail:a.trail,ring:a.ring,sink:a.sink,fan:a.fan||0,per:null}))})}const g={birds:n,pairs:w,kiss:new u.Vector3,kissFwd:new u.Vector3(1,0,0),kissLeft:new u.Vector3(0,0,-1),path:null};g.setPath=i=>{g.path=i;const f=28/i.length,a=i.pointAt(.8),p=i.pointAt(.87);g.kissFwd.copy(p).sub(a).setY(0),g.kissFwd.lengthSq()<1e-6&&g.kissFwd.set(1,0,0),g.kissFwd.normalize(),g.kissLeft.crossVectors(K,g.kissFwd).normalize(),g.kiss.copy(a).addScaledVector(g.kissFwd,14);const I=g.kiss,q=g.kissFwd,P=g.kissLeft;for(const G of w){if(G.loose){for(const d of G.flights){let v=null,l=null;if(d.trail){const x=d.trail.pts.map(m=>new u.Vector3(m[0],m[1],m[2])),V=220,M=[],L=[0];for(let m=0;m<=V;m++)M.push(Wt(x,m/V,new u.Vector3)),m&&L.push(L[m-1]+M[m].distanceTo(M[m-1]));v=(m,k)=>{const b=C(m,0,L[V]-.001);let y=0;for(;y<V-1&&L[y+1]<b;)y++;return k.copy(M[y]).lerp(M[y+1],(b-L[y])/Math.max(1e-6,L[y+1]-L[y]))};const c=d.trail.s;l=m=>{let k=0;for(;k<c.length-2&&m>c[k+1][0];)k++;return j(c[k][1],c[k+1][1],C((m-c[k][0])/(c[k+1][0]-c[k][0]),0,1))}}d.per=G.birds.map((x,V)=>{const M=d.u0+(d.ring?.002:d.trail?.003:.005)*V,L=M+.013,c=d.back+.004*V,m=c+.013,k=[],b=(y,F)=>k.push({u:y,p:F.clone(),stop:!1});if(b(L,x.wallOut),b(L+.012,R.copy(x.wallP).addScaledVector(x.wn,9).addScaledVector(K,2).addScaledVector(x.wf,5)),d.ring){const y=d.ring,F=G.birds.length;for(let S=L+.03;S<c-.026;S+=.006){const T=ut*(V/F)+y.turn*(S-d.u0)/y.r,_=y.r+1.3*Math.sin(V*2.4);b(S,R.set(y.c[0]+_*Math.cos(T),y.c[1]+y.tilt*Math.sin(T+.8)+.9*Math.sin(V*1.7),y.c[2]+_*Math.sin(T)))}}else if(v){const y=d.sink,F=(V&1?-1.3:1.3)+.2*x.off[1];for(let S=d.trail.s[0][0];S<c-.03;S+=.007){const T=l(S)-V*d.trail.gap*(.25+.75*B(.525,.59,S))*(1-.55*B(.685,.72,S));T<0||S<L+.04||(v(T,R),R.y+=(y?-y[0]*B(y[1],y[2],S)*(1-B(y[3],y[4],S)):0)+F+.7*Math.sin(S*80+x.off[3]),R.z+=.7*Math.cos(S*60+x.off[3]),b(S,R.set(C(R.x,-et+2.5,et-2.5),C(R.y,3.5,Pt-6),C(R.z,-Y+2.5,Y-2.5))))}}else for(const y of d.way){const F=y[1],S=Math.sin(F*90+x.off[3])*1.5,T=Math.cos(F*70+x.off[3])*1.2,_=d.sp;if(y[0]==="L"){const U=C(F+(y[2]+x.off[0]*_)/i.length,0,1),E=i.pointAt(U,R),W=i.tangentAt(U,wt).setY(0).normalize(),X=fe.crossVectors(W,K);E.addScaledVector(X,y[3]+x.off[1]*_+S+d.fan*(V-3.5)).addScaledVector(K,y[4]+x.off[2]*_+T)}else R.set(y[2]+.35*x.off[1]*_,y[3]+x.off[2]*_+T,y[4]+(x.off[0]-19)*_+S);b(F,R.set(C(R.x,-et+2.5,et-2.5),C(R.y,3.5,Pt-6),C(R.z,-Y+2.5,Y-2.5)))}return b(c-.016,R.copy(x.wallP).addScaledVector(x.wn,10).addScaledVector(K,3).addScaledVector(x.wf,-6)),b(c,x.wallOut),{uA:M,uOff:L,uBack:c,uD:m,keys:he(k)}})}continue}if(G.hero){G.birds.forEach((d,v)=>{const l=v===0?1:-1,x=[],V=(y,F,S=!1,T=null)=>x.push({u:y,p:F.clone(),stop:S,m:T});V(gt.off,d.wallOut);const M=Nt.copy(G.birds[0].wallP).add(G.birds[1].wallP).multiplyScalar(.5);for(let y=.374;y<.428;y+=.012){const F=(y-gt.off)/.05,S=ut*.8*F+(v?Math.PI:0)+.4,T=B(0,.35,F);R.copy(d.wallP).lerp(M,T).addScaledVector(d.wn,2+3.4*T),V(y,R.add(wt.set(6*F+5.6*T*Math.cos(S),.5+2.6*F+4.2*T*Math.sin(S),0)))}V(.437,R.set(35-v*3,33.5+v*3,-15+v*4));for(let y=.45;y<.725;y+=.03){const F=i.pointAt(y+f,R),S=i.tangentAt(y+f,wt).setY(0).normalize(),T=fe.crossVectors(S,K),_=Math.sin((y-.42)/.3*ut*1.5+(v?Math.PI:0)),U=4.2+2.6*Math.cos((y-.42)/.3*ut*1.5+(v?Math.PI:0))+2*B(.42,.6,y),E=-9.5*B(.55,.59,y)*(1-B(.65,.69,y));V(y,F.addScaledVector(T,5.5*_*(1+E/16)+E).addScaledVector(K,U))}V(.748,R.copy(I).addScaledVector(P,l*19).addScaledVector(K,6.5).addScaledVector(q,7)),V(.773,R.copy(I).addScaledVector(P,l*9.5).addScaledVector(K,-2.6).addScaledVector(q,2.5));const L=Nt.copy(I).addScaledVector(P,l*2.02).addScaledVector(q,-1.5),c=q.clone().multiplyScalar(i.length);V(gt.kiss0,L,!0,c.clone()),V(gt.kiss1,wt.copy(L).addScaledVector(q,i.length*(gt.kiss1-gt.kiss0)),!0,c.clone());const m=(y,F,S,T)=>V(y,i.pointAt(y,R).addScaledVector(q,F+v*1.5).addScaledVector(P,l*S).addScaledVector(K,T+v*(y<.86?3.1:2.2)));m(.834,15,6.5,2.5),m(.85,19.5,11.5,5.8),m(.866,20.5,12.6,6.8),m(.882,19.5,13.2,7);const k=Nt.set(H.x+10.5,H.y+6.6,H.z);V(.903,R.copy(k).addScaledVector(P,l*5.5).add(wt.set(-9,1.5+v*1.5,0)));const b=k.clone().addScaledVector(P,l*2.02);V(gt.kiss2,b,!0),V(gt.kiss3,b,!0),V(.975,R.copy(b).addScaledVector(P,l*1.5).add(wt.set(11.5,4.4,0))),V(.999,R.copy(b).addScaledVector(P,l*6).add(wt.set(40,20,0))),d.keys=he(x),d.face.copy(P).multiplyScalar(-l),d.face2.copy(P).multiplyScalar(l*.8).addScaledVector(K,.52).addScaledVector(q,.22).normalize()});continue}for(const d of G.flights){d.at&&(i.pointAt(d.at[0],d.meet),d.meet.set(C(d.meet.x+d.at[1],-et+7.5,et-8),d.meet.y+d.at[2],C(d.meet.z+d.at[3],-Y+8,Y-8)));const v=d.u0+(d.u1-d.u0)*(d.ph[1]+d.ph[2])*.5;d.uMeet=v;const l=i.pointAt(C(v,0,1),R),x=wt.copy(d.meet).sub(l).setY(0);x.lengthSq()<1&&x.set(1,0,0);const V=new u.Vector3().crossVectors(K,x.normalize()).normalize();d.face=V,d.curves=G.birds.map((M,L)=>{const c=L===0?1:-1;L===0&&fe.copy(M.wallP).sub(d.meet).dot(V)<Nt.copy(G.birds[1].wallP).sub(d.meet).dot(V)&&V.negate();const m=d.meet.clone().addScaledVector(V,c*2.02),k=M.wallP.clone().lerp(m,.5),b=[M.wallOut.clone(),M.wallP.clone().addScaledVector(M.wn,10).addScaledVector(K,3+L*2).addScaledVector(M.wf,6),k.clone().addScaledVector(V,c*9).addScaledVector(K,7-L*5),m.clone().addScaledVector(V,c*8).addScaledVector(K,4-L*2).addScaledVector(x,-3*c),m],y=[m,m.clone().addScaledVector(V,c*7).addScaledVector(K,5+L*2).addScaledVector(x,4*c),k.clone().addScaledVector(V,c*5).addScaledVector(K,9-L*3).addScaledVector(M.wn,6),M.wallP.clone().addScaledVector(M.wn,10).addScaledVector(K,3).addScaledVector(M.wf,-7),M.wallOut.clone()];return{out:b,back:y,seat:m,face:V.clone().multiplyScalar(-c)}})}}for(const G of n)G.fin=null;g.leave=()=>{const G=bt.pts.map(S=>new u.Vector3(S[0],S[1],S[2])),d=420,v=[],l=[0];for(let S=0;S<=d;S++)v.push(Wt(G,S/d,new u.Vector3)),S&&l.push(l[S-1]+v[S].distanceTo(v[S-1]));const x=l[d],V=(S,T,_)=>{const U=C(S,0,x-.001);let E=0,W=d;for(;W-E>1;){const X=E+W>>1;l[X]<=U?E=X:W=X}return _&&_.copy(v[E+1]).sub(v[E]).normalize(),T.copy(v[E]).lerp(v[E+1],(U-l[E])/Math.max(1e-6,l[E+1]-l[E]))},M=bt.s,L=S=>{let T=0;for(;T<M.length-2&&S>M[T+1][0];)T++;return j(M[T][1],M[T+1][1],C((S-M[T][0])/(M[T+1][0]-M[T][0]),-1,2))};g.finCourse=V,g.finHead=L,g.finTotal=x;const c=n.filter(S=>!S.hero),m=c.length,k=L(.67),b=new u.Vector3,y=new u.Vector3,F=c.map(S=>{const T=_t(S,w[S.pair],.652,new u.Vector3);let _=k,U=1e9;for(let E=k-bt.len;E<=k;E+=2){const W=V(E,R).distanceToSquared(T);W<U&&(U=W,_=E)}return{b:S,at:_}});F.sort((S,T)=>T.at-S.at||S.b.i-T.b.i),F.forEach((S,T)=>{const _=S.b,U=w[_.pair],E=bt.len*(T+.5)/m,W=bt.off0+bt.offSpan*(1-T/Math.max(1,m-1))*(.75+.25*_.seed),X=W-.013;_t(_,U,X,R,yt);const lt=yt.wall<1||yt.lift>.001,Q=[];let rt=1,ot=1;if(lt){const Z=_t(_,U,W,new u.Vector3,yt);rt=yt.wall,ot=yt.ghost,_t(_,U,W-.004,wt),Q.push({u:W,p:Z,stop:!1,m:Z.clone().sub(wt).multiplyScalar(1/.004)})}else Q.push({u:W,p:_.wallOut.clone(),stop:!0}),Q.push({u:W+.012,p:_.wallP.clone().addScaledVector(_.wn,9).addScaledVector(K,2).addScaledVector(_.wf,5),stop:!1});const nt=T*.754878%1*2-1,ct=T*.56984%1*2-1;for(let Z=W+.032;Z<=1.0061;Z+=.006){const tt=L(Z)-E,xt=tt<bt.dive?tt:bt.dive+(tt-bt.dive)*1.5;V(xt,R,b),y.set(-b.z,0,b.x),y.lengthSq()<1e-6&&y.set(1,0,0),y.normalize();const $=B(335,370,xt),mt=B(392,450,xt),qt=j(7.8,5.6,$)+10*mt,Ft=j(5.4,7.4,$)+6*mt;if(R.addScaledVector(y,nt*qt).addScaledVector(K,ct*Ft+.5*Math.sin(Z*70+_.seed*40)),xt<372&&R.set(C(R.x,-et+3,et-3),C(R.y,4,Pt-6),C(R.z,-Y+3,Y-3)),Q.push({u:Z,p:R.clone(),stop:!1}),xt>x-3)break}_.fin={uA:lt?W:X,uOff:W,wall0:rt,ghost0:ot,keys:he(Q),lag:E}})},g.defer||g.leave()};{const i=$t.reduce((a,p)=>a+p[0],0);let f=0;$t.forEach((a,p)=>{const I=p===$t.length-1?n.length-f:Math.round(n.length*a[0]/i);for(let q=0;q<I&&f<n.length;q++,f++)n[f].tier=p,n[f].ring=q/I+.37*p})}return g}const zt={x:-13,y:34,z:2,rx:17,rz:29,tilt:3.5},yt={wall:1,hold:0,lift:0,ghost:0,face:null},Ht={air:0,hold:0};function Rt(t,n,r,o,e){const s=t.fin;if(!s||r<=s.uA)return _t(t,n,r,o,e);if(r<s.uOff){const w=Vt((r-s.uA)/(s.uOff-s.uA));return e&&(e.wall=1,e.hold=0,e.lift=w,e.ghost=w),o.copy(t.wallP).lerp(t.wallOut,w*w)}return e&&(e.wall=s.wall0*(1-B(s.uOff,s.uOff+.014,r)),e.hold=0,e.lift=1,e.ghost=j(s.ghost0,1,B(s.uOff,s.uOff+.012,r)),e.face=null),ue(s.keys,r,o)}function _t(t,n,r,o,e){if(t.hero){const s=gt;if(r<=s.lift||r>=s.down||!t.keys)return e&&(e.wall=1,e.hold=0,e.lift=0,e.ghost=0),o.copy(t.wallP);if(r<s.off){const w=Vt((r-s.lift)/(s.off-s.lift));return e&&(e.wall=1,e.hold=0,e.lift=w,e.ghost=w),o.copy(t.wallP).lerp(t.wallOut,w*w)}if(r>s.back){const w=1-Vt((r-s.back)/(s.down-s.back));return e&&(e.wall=1,e.hold=0,e.lift=w,e.ghost=.15*w),o.copy(t.wallP).lerp(t.wallOut,w*w)}return e&&(e.wall=Math.max(1-B(s.off,s.off+.014,r),B(s.back-.014,s.back,r)),e.hold=Math.max(B(.776,s.kiss0,r)*(1-B(s.kiss1,s.kiss1+.016,r)),B(s.kiss2-.014,s.kiss2,r)*(1-B(s.kiss3,s.kiss3+.012,r))),e.lift=1,e.ghost=1-.85*B(.89,s.back,r),e.face=t.face),ue(t.keys,r,o)}for(const s of n.flights){if(s.per){const a=s.per[t.role];if(r<=a.uA||r>=a.uD)continue;if(r<a.uOff){const p=Vt((r-a.uA)/(a.uOff-a.uA));return e&&(e.wall=1,e.hold=0,e.lift=p,e.ghost=p),o.copy(t.wallP).lerp(t.wallOut,p*p)}if(r>a.uBack){const p=1-Vt((r-a.uBack)/(a.uD-a.uBack));return e&&(e.wall=1,e.hold=0,e.lift=p,e.ghost=.15*p),o.copy(t.wallP).lerp(t.wallOut,p*p)}return e&&(e.wall=Math.max(1-B(a.uOff,a.uOff+.014,r),B(a.uBack-.014,a.uBack,r)),e.hold=0,e.lift=1,e.ghost=1-.85*B(a.uBack-.035,a.uBack,r),e.face=null),ue(a.keys,r,o)}if(r<=s.u0||r>=s.u1||!s.curves)continue;const w=(r-s.u0)/(s.u1-s.u0),[h,A,g,i]=s.ph,f=s.curves[t.role];if(w<h){const a=Vt(w/h);return e&&(e.wall=1,e.hold=0,e.lift=a,e.ghost=a),o.copy(t.wallP).lerp(t.wallOut,a*a)}if(w>i){const a=1-Vt((w-i)/(1-i));return e&&(e.wall=1,e.hold=0,e.lift=a,e.ghost=.15*a),o.copy(t.wallP).lerp(t.wallOut,a*a)}if(e&&(e.wall=Math.max(1-B(h,h+.07,w),B(i-.07,i,w)),e.hold=B(A-.08,A-.01,w)*(1-B(g+.01,g+.07,w)),e.lift=1,e.ghost=1-.85*B(g+.1,i,w),e.face=f.face),w<A){const a=(w-h)/(A-h);return Wt(f.out,1-(1-a)*(1-a),o)}return w<g?o.copy(f.seat):Wt(f.back,Vt((w-g)/(i-g)),o)}return e&&(e.wall=1,e.hold=0,e.lift=0,e.ghost=0),o.copy(t.wallP)}const vt=new u.Vector3,O=new u.Vector3,it=new u.Vector3,dt=new u.Vector3,st=new u.Vector3,ft=new u.Vector3;function co(t,n,r,o,e,s,w,h,A,g){const i=t.pairs[n.pair];Rt(n,i,r,vt,yt);let f=yt.wall,a=yt.hold,p=yt.lift,I=yt.ghost;const q=yt.face;f<1&&(Rt(n,i,r+.003,R),Rt(n,i,r-.003,wt),R.sub(wt),R.lengthSq()>.02&&n.pf.copy(R.normalize())),O.copy(n.pf),a>0&&q&&O.lerp(q,a).normalize();const P=n.hero?B(.822,.842,r)*(1-B(.884,.9,r)):0;P>0&&(O.lerp(n.face2,.92*P),O.lengthSq()<1e-4&&O.copy(n.face2),O.normalize());const G=n.fin&&r>n.fin.uOff?B(n.fin.uOff+.015,n.fin.uOff+.045,r):0;if(s>0){const L=$t[n.tier||0],c=ut*(n.ring+(.7+.22*(n.tier||0))*w)+o*.1,m=Math.cos(c),k=Math.sin(c),b=B(.5,.56,r);st.set(zt.x-7*b+zt.rx*L[0]*m,zt.y+L[1]+zt.tilt*L[0]*m+.6*Math.sin(2*c+n.seed*9),zt.z+(zt.rz-4*b)*L[0]*k),vt.lerp(st,s),st.set(-zt.rx*k,-zt.tilt*k,zt.rz*m).normalize(),O.lerp(st,s),O.lengthSq()<1e-4&&O.copy(st),O.normalize(),f*=1-s,a*=1-s,p=Math.max(p,s),I=Math.max(I,s)}const d=1-f,v=n.i*16,[l]=Fe(n.s,o);let x;const V=p*.8+.16*Math.max(0,l)*Math.sin(o*27+n.seed*60);if(d<=0)O.copy(n.wf),dt.copy(n.wl),it.copy(n.wn),x=V;else{if(st.copy(e).sub(vt),G>0){const F=Math.max(st.length(),.001),S=O.dot(st)/F,T=st.y/F;ft.copy(O).addScaledVector(st,-.88*G*S/F),ft.y+=.35*G*Math.abs(S),ft.addScaledVector(st,-.35*G*Math.abs(S)*T/F),ft.lengthSq()>1e-4&&O.copy(ft).normalize()}it.copy(st).addScaledVector(O,-st.dot(O)),ft.copy(K).addScaledVector(O,-O.y),ft.lengthSq()<1e-4&&ft.set(1,0,0).addScaledVector(O,-O.x),ft.normalize(),it.lengthSq()<1e-4?it.copy(ft):it.normalize(),it.multiplyScalar(.82).addScaledVector(ft,.18),it.addScaledVector(O,-it.dot(O)).normalize(),dt.crossVectors(it,O),dt.y*n.sgn<-.25&&(n.sgn=-n.sgn),dt.multiplyScalar(n.sgn),f>0&&(O.lerp(n.wf,f),O.lengthSq()<1e-4&&O.copy(n.wf),O.normalize(),dt.lerp(n.wl,f),dt.addScaledVector(O,-dt.dot(O)),dt.lengthSq()<1e-4&&dt.copy(n.wl),dt.normalize(),ft.copy(it).lerp(n.wn,f),it.crossVectors(O,dt),it.dot(ft)<0&&it.negate());const L=B(.2,.8,Math.sin(o*.8+n.seed*30)),c=.2+.62*Math.sin(o*(9.5+3*n.seed)+n.seed*50)*(1-.5*L),m=.5+.32*Math.sin(o*12+n.seed*50);x=j(j(c,m,a),V,f);const k=d*(1-.6*a);vt.x+=Math.sin(o*1.3+n.seed*20)*.5*k,vt.y+=Math.sin(o*1.9+n.seed*33)*.4*k,vt.z+=Math.cos(o*1.1+n.seed*11)*.5*k,st.copy(vt).sub(e);const b=st.length(),y=G>0?14:15+6*B(0,.3,s);b<y&&!n.hero&&(b<.05?st.set(0,1,0):st.multiplyScalar(1/b),vt.addScaledVector(st,(y-b)*d))}const M=G>0||n.hero&&r>.95?1-B(H.xo+3,H.xo+20,vt.x):1;h[v]=O.x*M,h[v+1]=O.y*M,h[v+2]=O.z*M,h[v+3]=0,h[v+4]=dt.x*M,h[v+5]=dt.y*M,h[v+6]=dt.z*M,h[v+7]=0,h[v+8]=it.x*M,h[v+9]=it.y*M,h[v+10]=it.z*M,h[v+11]=0,h[v+12]=vt.x,h[v+13]=vt.y,h[v+14]=vt.z,h[v+15]=1,A[n.i*4]=x,A[n.i*4+1]=d,A[n.i*4+2]=n.seed,A[n.i*4+3]=1,g[n.i*4+3]=C(I,0,1)*.9,Ht.air=d,Ht.hold=a}function fo(t){const n=[],r=(f,a,p,I)=>n.push({len:Math.hypot(p-f,I-a),at:q=>[j(f,p,q),j(a,I,q)]}),o=(f,a,p,I,q)=>n.push({len:Math.abs(q-I)*p,at:P=>{const G=j(I,q,P);return[f+Math.cos(G)*p,a+Math.sin(G)*p]}}),e=Math.PI/2;r(48,29.5,-22,29.5),o(-22,14.5,15,e,2*e),r(-37,14.5,-37,-14.5),o(-22,-14.5,15,2*e,3*e);const s=20;r(-22,-29.5,s-15,-29.5),o(s-15,-14.5,15,3*e,4*e),r(s,-14.5,s,14.5),o(s-15,14.5,15,0,e),r(s-15,29.5,-24,29.5),o(-24,14.5,15,e,3*e),r(-24,-.5,64,-.5);const w=n.reduce((f,a)=>f+a.len,0),h=(t||[[0,7],[146,7],[180,13],[228,24],[262,29],[296,36]]).concat([[w-88,40],[w,40]]),A=f=>{let a=0;for(;a<h.length-2&&f>h[a+1][0];)a++;return j(h[a][1],h[a+1][1],Vt((f-h[a][0])/(h[a+1][0]-h[a][0])))},g=[];let i=0;for(const f of n){const a=Math.max(1,Math.round(f.len/7.8));for(let p=0;p<a;p++){const I=p/a,[q,P]=f.at(I);g.push([q,A(i+f.len*I),P])}i+=f.len}return g.push([64,40,-.5]),g}const de="kiss";async function po(t,n={}){const r=t.rng,o=t.vary||{},e=t.quality?.detail??1,s=(n.palette&&n.palette.length>=6?n.palette:be).map(z=>new u.Color(z)),w=r(),h=r(),A=r(),g=r(),i=n.look||(o.hour==="day"?"noon":w<.5?"spring":w<.75?"unfinished":"noon"),f=n.cast||(i==="noon"?"blue":h<.4?"red":h<.7?"yellow":"blue"),a=n.lily||(i==="noon"?"papyrus":A<.62?"red":"white"),p={look:i,lead:f==="red"?1:f==="yellow"?2:3,lily:a,bands:g<.6?3:2,rare:n.rare??!!o.rare},I=C(n.density??o.density??1,.7,1.3),q=o.hour==="night",P=new u.Color(n.sunPlaster||(q?n.palette?.[1]||be[1]:"#FFF2C6")),G=q?new u.Color(1,1,1):new u.Color(1.06,1,.8),d=z=>z.clone().multiplyScalar(1.26).multiply(G).lerp(P,.02),v=[s[0],s[2],s[3],s[4],s[5]],l=i==="noon"?{az:62,el:58}:{az:qe.az,el:qe.el},x={uTime:{value:0},uGustT:{value:0},uU:{value:0},uSunDir:{value:new u.Vector3(1,.4,.6).normalize()},uWinIn:{value:new u.Vector4(H.x,H.z,H.y,0)},uWinOut:{value:new u.Vector4(H.xo,H.z,H.y,0)},uWinHalf:{value:new u.Vector4(H.hw,H.hh,60,60)},uPlaster:{value:s[0]},uPlasterSun:{value:P},uPig:{value:v},uPigSun:{value:[P,d(s[2]),d(s[3]),d(s[4]),d(s[5])]}},V=(z,D)=>{const N=z*Math.PI/180,J=D*Math.PI/180;x.uSunDir.value.set(Math.cos(J)*Math.cos(N),Math.sin(J),Math.cos(J)*Math.sin(N))};V(l.az,l.el);const M={uTime:x.uTime,uGustT:x.uGustT,uSunDir:x.uSunDir,uWinIn:x.uWinIn,uWinOut:x.uWinOut,uWinHalf:x.uWinHalf,uPig:x.uPig,uPigSun:x.uPigSun},L=u.UniformsUtils.clone(u.UniformsLib.fog),c=new u.Group;c.name="room-of-swallows-hero",await t.yield();const m=await Xe(t,r.fork("crags"),p);await t.yield();const k=Math.min(8,t.renderer?.capabilities?.getMaxAnisotropy?.()||1),b=await Be(t,m.lobes.filter(z=>!z.east),k);await t.yield();const y=await Be(t,m.lobes.filter(z=>z.east),k,Ae,at);await t.yield();const F={...M,...L,tFill:{value:b.tFill},tLine:{value:b.tLine},tAux:{value:b.tAux},uStrip:{value:new u.Vector2(0,At)},uPlaster:x.uPlaster,uPlasterSun:x.uPlasterSun,uFloodS:{value:i==="unfinished"?128:400},uUnfinished:{value:i==="unfinished"?1:0},uCrackEnd:{value:222},uBands:{value:p.bands}},S=new u.ShaderMaterial({uniforms:F,vertexShader:Re,fragmentShader:_e,fog:!0}),T=new u.Mesh(Je(),S);T.name="painted-walls",c.add(T);const _={...F,tFill:{value:y.tFill},tLine:{value:y.tLine},tAux:{value:y.tAux},uStrip:{value:new u.Vector2(at,Ae/ht)}},U=new u.ShaderMaterial({uniforms:_,vertexShader:Re,fragmentShader:_e,fog:!0}),E=new u.Mesh(Qe(),U);E.name="painted-east-wall",c.add(E),await t.yield();const W=r.fork("lilies"),X=Math.round(160*Math.max(.7,e)*I),lt=m.roots.map(z=>z.s>242&&z.s<273?{...z,cap:17}:z),Q=new u.ShaderMaterial({uniforms:{...M,...L,uU:x.uU,uFloodS:F.uFloodS,uUnfinished:F.uUnfinished,uPetal:{value:a==="red"?1:a==="white"?0:3},uStamen:{value:2},uOutline:{value:a==="white"?1:0}},vertexShader:eo,fragmentShader:oo,fog:!0,side:u.DoubleSide}),rt=ce(W,lt,X),ot=W.fork("more"),nt=m.extraRoots.filter(z=>!z.east),ct=m.extraRoots.filter(z=>z.east),Z=[rt],tt=Math.max(.7,e)*I;nt.length&&Z.push(ce(ot,nt,Math.min(nt.length,Math.round(46*tt)))),ct.length&&Z.push(ce(ot,ct,Math.min(ct.length,Math.round(30*tt))));{const z=ot.fork("jamb"),D=30,N=new Float32Array(D*4),J=new Float32Array(D*4);let pt=0;for(let It=0;It<2;It++)for(let kt=0;kt<5;kt++){const Ct=1.8+kt*2.7+z.range(-.5,.5),Tt=z.range(8.5,13.5)+(kt===2?4:kt===1||kt===3?2:0);for(let Lt=0;Lt<3;Lt++){const ne=Lt-1;N[pt*4]=410+It*50+Ct+ne*.4,N[pt*4+1]=28.12,N[pt*4+2]=Math.min(Tt*(ne===0?1.08:z.range(.7,.95)),19.5),N[pt*4+3]=ne*z.range(.14,.26)+z.range(-.05,.05),J[pt*4]=z(),J[pt*4+1]=-1,J[pt*4+2]=z.range(.95,1.25),J[pt*4+3]=.12+.012*(pt%16),pt++}}Z.push({iRoot:N,iMisc:J,n:D})}const xt=ao(Z,to(a),Q);xt.name="lilies",c.add(xt),await t.yield();const $=io(r.fork("swallows")),mt=$.birds.length,qt=so(),Ft=()=>{const z=new u.InstancedBufferGeometry;z.index=qt.index;for(const D of["position","aPig","aAnim"])z.setAttribute(D,qt.getAttribute(D));return z.instanceCount=mt,z},pe=new Float32Array(mt*16),ge=new Float32Array(mt*4),me=new Float32Array(mt*16),jt=new Float32Array(mt*4),Yt=Ft(),Kt=Ft(),Xt=new u.InstancedBufferAttribute(pe,16),Jt=new u.InstancedBufferAttribute(ge,4),Zt=new u.InstancedBufferAttribute(jt,4);Xt.setUsage(u.DynamicDrawUsage),Jt.setUsage(u.DynamicDrawUsage),Zt.setUsage(u.DynamicDrawUsage),Yt.setAttribute("iMat",Xt),Yt.setAttribute("iState",Jt);for(const z of $.birds){const D=z.i*16,N=Bt(z.s,z.y,.06,R);me.set([z.wf.x,z.wf.y,z.wf.z,0,z.wl.x,z.wl.y,z.wl.z,0,z.wn.x,z.wn.y,z.wn.z,0,N.x,N.y,N.z,1],D),jt[z.i*4+2]=z.seed}Kt.setAttribute("iMat",new u.InstancedBufferAttribute(me,16)),Kt.setAttribute("iState",Zt);const we=z=>({...M,...L,uGhost:{value:z},uGhostCol:{value:s[1].clone()},uGhostSun:{value:s[1].clone().lerp(s[0],.75)},uGhostLine:{value:s[0].clone().multiplyScalar(.83)}}),ye=ro.replace("attribute float aPig;",`attribute mat4 iMat;
attribute float aPig;`),Oe=new u.ShaderMaterial({uniforms:we(0),vertexShader:ye,fragmentShader:Ee,fog:!0,side:u.DoubleSide,transparent:!0}),Ce=new u.ShaderMaterial({uniforms:we(1),vertexShader:ye,fragmentShader:Ee,fog:!0,side:u.DoubleSide,transparent:!0,depthWrite:!1}),Et=new u.Mesh(Kt,Ce);Et.frustumCulled=!1,Et.renderOrder=1,Et.name="ghosts";const Ot=new u.Mesh(Yt,Oe);Ot.frustumCulled=!1,Ot.renderOrder=3,Ot.name="swallows",c.add(Et,Ot),await t.yield();const ve=fo();let Qt=n.path||je(ve);$.defer=!0,$.setPath(Qt),await t.yield(),$.leave(),$.defer=!1,await t.yield();const Ue=$.pairs.filter(z=>z.taught).map(z=>({u0:z.flights[0].u0,u1:z.flights[0].u1,uMeet:z.flights[0].uMeet,meet:z.flights[0].meet.clone()})),De=new u.Vector3(H.x-(H.z+Y)/Math.tan(l.az*Math.PI/180),H.y-(H.z+Y)/Math.sin(l.az*Math.PI/180)*Math.tan(l.el*Math.PI/180),-Y),Ne={flyThrough:ve,portalSeat:{position:new u.Vector3(64,40,-.5),normal:new u.Vector3(-1,0,0),radius:8},window:{center:new u.Vector3(H.x,H.y,H.z),width:18,height:24,sill:28,depth:15},kiss:{position:$.kiss,u0:gt.kiss0,u1:gt.kiss1,facing:$.kissFwd},heroNest:$.pairs[0].birds.map(z=>z.wallP.clone()),pairs:Ue,crag:new u.Vector3(-et,33.5,29.5),entry:new u.Vector3(48,7,29.5),sunShape:De,viewpoints:{entry:new u.Vector3(48,7,29.5),closePass:new u.Vector3(-37,7,2),sun:new u.Vector3(2,8.5,-29.5),window:new u.Vector3(37,21,4),kissEye:new u.Vector3(-24,40,-.5)},pace:[[0,1.13],[.66,1.13],[.72,.45],[.83,.45],[.9,1],[1,1]],leaving:{u0:bt.off0,u1:.96,kiss2:[gt.kiss2,gt.kiss3]}};let te=-1,xe=0,Me=0;const We=n.demo!==!1,ee=new u.Vector3(60,30,0),$e=z=>1-Math.abs((z%2+2)%2-1);function Se(z,D,N){const J=te>=0?te:We?.65+.31*((D/24%1+1)%1):0;x.uTime.value=D,x.uGustT.value=D,x.uU.value=J;const pt=$e(D/55)*55;if(V(l.az+.135*pt,l.el+.04*pt),i==="unfinished"){let Tt=131;J>.13&&(Qt.pointAt(Math.min(J,.3),R),Tt=Math.max(131,142.5-R.z+lo)),F.uFloodS.value=j(Tt,197,B(.3,.335,J))}let It=0,kt=0;p.rare&&(It=B(.445,.47,J)*(1-B(.553,.578,J)),kt=(J-.445)/.13,F.uCrackEnd.value=222+14*B(.45,.5,J)),N&&(N.getWorldPosition(ee),c.worldToLocal(ee));let Ct=0;for(let Tt=0;Tt<mt;Tt++){const Lt=$.birds[Tt];co($,Lt,J,D,ee,It,kt,pe,ge,jt),Ht.air>.5&&Ct++,Lt.hero&&Lt.role===0&&(xe=Ht.hold)}Me=Ct,Xt.needsUpdate=!0,Jt.needsUpdate=!0,Zt.needsUpdate=!0}Se(0,0,null);const He=$.kiss,oe=de==="crag"?{center:new u.Vector3(-et,16,29.5),radius:4.5,height:10}:de==="sun"?{center:new u.Vector3(-8,14,-Y),radius:5.5,height:8}:de==="entry"?{center:new u.Vector3(-et,22,29.5),radius:26,height:2}:{center:He.clone(),radius:8,height:10};return{object:c,radius:oe.radius,height:oe.height,center:oe.center,size:new u.Vector3(2*et,Pt,2*Y),anchors:Ne,uniforms:x,glsl:{sun:Ut,gust:le,pigment:Dt,strip:Te,hash:Le,crack:Ie},look:p,stripToRoom:(z,D,N=0,J=new u.Vector3)=>Bt(z,D,N,J),gustAt:Fe,setProgress(z){te=C(z,0,1)},setPath(z){Qt=z,$.setPath(z)},ribbonAt(z,D,N=new u.Vector3){return $.finCourse(Math.min($.finHead(z)-D,$.finTotal-1),N)},pairAt(z,D=new u.Vector3){const N=$.pairs[0];return Rt(N.birds[0],N,z,D),Rt(N.birds[1],N,z,ft),D.add(ft).multiplyScalar(.5)},sunShapeAt(z=new u.Vector3){const D=x.uSunDir.value,N=(H.z+Y)/Math.max(D.z,.05);return z.set(H.x-D.x*N,H.y-D.y*N,-Y)},sun0:l,get kiss(){return xe},get air(){return Me},update:Se,dispose(){},ground:!0,groundY:0}}export{Ze as EAST_OPENINGS,fo as buildFlyThrough,po as buildHero};
