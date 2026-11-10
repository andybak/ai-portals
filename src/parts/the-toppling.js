import*as u from"three";import{clamp as Dt,lerp as It,smoothstep as gt}from"../kit/core.js";const je=["#E9DFC6","#C8923F","#5E7FB4","#F6F1E4","#137E8C","#1E3F9A","#D9A62B"],xe=480,ae=880,Ge=-80,Lt=150,Wt=.497,Zt=1.1,mt=2,Ye=1,re=.3,Ze=1.2566,v=m=>new u.Color(m),Kt=m=>{const l=Math.sin(m*127.1+311.7)*43758.5453;return l-Math.floor(l)},Xt=(m,l)=>Kt(m*1.37+l*71.13+.5),ie=(m,l)=>{const y=Math.floor(m),d=Math.floor(l),w=m-y,wt=l-d,Mt=w*w*(3-2*w),pt=wt*wt*(3-2*wt);return It(It(Xt(y,d),Xt(y+1,d),Mt),It(Xt(y,d+1),Xt(y+1,d+1),Mt),pt)};function Ke(m){let l=2.5;m>235&&(l=2.5+6.5*gt(235,275,m)),m>400&&(l=9+11*gt(392,568,m)),m>560&&(l=Math.max(l,20+18*gt(560,822,m)));let y=0;if(m>560&&m<820){const d=Math.sin(Math.PI*(m-560)/260);y=-30*d*d}return[y,l,xe-m]}function Xe(m,l,y,d={}){const w=v(l[0]),wt=v(l[1]),Mt=v(l[2]),pt=v(l[4]),ut=v(l[5]),Z=v(l[6]),xt=(C,at,E)=>C.clone().lerp(at,E);if(m==="sunflower"){const C=v("#e2a218"),at=v("#e3661a"),E=v("#96381a"),F=v("#1b3ea6"),M=v("#128c9a"),D=v("#4a9a2c"),K=v("#1c5424"),H=v("#1c0e08"),vt=v("#562a10"),$=v("#f1e3b4"),J=d.rim??Lt,B=d.phi??Wt,L=230/J,ft=118,b=26,zt=17,Pt=y.range(0,1),lt=7+y.int(0,2),X=lt+5,U=(rt,nt,z,S,R,k,_)=>{const N=Math.cos(_),tt=Math.sin(_),p=((rt-z)*N+(nt-S)*tt)/R,Q=(-(rt-z)*tt+(nt-S)*N)/k;if(Math.abs(p)>=1)return-1;const j=Math.pow(1-p*p,.8),ot=Math.abs(Q);return ot>j?-1:ot>j-.16?6:ot<.09?9:Math.abs(((p*3.5-ot*1.3)%1+1)%1-.5)<.1?6:5},W=(rt,nt,z,S,R)=>{const k=(rt-b+2)/S;if(k<=0||k>=1)return null;const _=Math.abs(((nt/(Math.PI*2)*zt+z)%1+1)%1-.5),N=R*(k<.42?.6+.4*Math.sin(Math.PI*.5*k/.42):Math.pow(Math.cos(Math.PI*.5*(k-.42)/.58),.75));return _<N?[k,(N-_)*rt*6.2832/zt,_]:null};return{paints:[C,at,E,F,M,D,K,H,vt,$,v("#e6c25e")],line:[0,3,1,4,2,0,9],neck:[6,5,5,5,0,1],crest:1,wall:{bg:3,rays:[0,1],edge:2,disc:0,ring:9,dark:7,eye:[2,10,4,7]},fn(rt,nt,z){if(rt>146.5)return 7;if(rt>143)return Math.floor(Math.abs(z)/3.6)&1?0:9;const S=rt*J/Lt,R=nt*B,k=S*Math.sin(R)*L,_=S*Math.cos(R)*L,N=Math.abs(k),tt=_-ft,p=Math.hypot(k,tt),Q=Math.atan2(k,tt);if(p<b){if(p>b-2.6)return 7;if(p<6.5)return Math.sin(p*1.3+Q*5)>.2?6:8;const Nt=Math.sin(p*.62+Q*lt)*Math.sin(p*.62-Q*X);return Nt>.3?2:Nt<-.25?7:8}let j=W(p,Q,Pt,38,.47);if(j)return j[1]<1.5?2:j[2]<.05&&j[0]<.8||j[0]<.26?1:0;if(j=W(p,Q,Pt+.5,49,.42),j)return j[1]<1.5?8:j[0]>.8?2:1;let ot=U(N,_,24,30,24,10.5,.5);return ot>=0||(ot=U(N,_,61,197,19,9,.5),ot>=0)?ot:_<50&&N<4.6?N>3.2?6:5:p*.085%1<.24?4:3}}}if(m==="koi"){const C=v("#efe9dc"),at=v("#c93a22"),E=v("#eea2ae"),F=v("#4fb3b4"),M=v("#b9e2d8"),D=xt(pt,v("#0c3b46"),.45),K=v("#e58a2c"),H=y.range(0,6.28),vt=y.range(4,7);return{paints:[C,at,E,F,D,K,M],line:[1,0,2,3,0,1,5],neck:[3,3,2,0,1,1],crest:1,wall:{bg:4,rays:[0,1],edge:5,disc:5,ring:6,dark:4,eye:[6,5,3,4]},fn($,J,B){const L=J<0?-1:1,ft=Math.abs(J);let b=($-34)/104;if(L>0&&(b=1-b),b>0&&b<1){const Pt=L*($*Wt*.52+3)+vt*Math.sin($/17+H*L),lt=Math.abs(B-Pt),X=b<.78?7.2*Math.pow(Math.sin(Math.PI*Math.pow(b/.78,.75)*.94+.1),.8)+.6:0;if(b<.78&&lt<X)return b>.05&&b<.09&&lt>X*.45&&lt<X*.8||lt>X-1?4:ie($*.085+31*L,B*.085+7)>.5?ie($*.3,B*.3)>.74?5:1:0;if(b>=.74){const U=1.5+(b-.74)*46;if(lt<U)return Math.floor(lt*.9+b*30)&1?2:0}if(b>.2&&b<.36&&lt<X+5.5*Math.sin(Math.PI*(b-.2)/.16))return 2}const zt=Math.sin(Math.hypot($-70,B-20*L)*.55);return zt>.8?6:ie($*.05,B*.05+40)>.7?4:zt<-.86?2:3}}}if(m==="kingfisher"){const C=v("#10b4d2"),at=v("#2259c6"),E=v("#e4601a"),F=v("#f3eee0"),M=v("#0a1730"),D=v("#86e8f2"),K=v("#f59a3c"),H=v("#0a4650"),vt=v("#116a74"),$=v("#5a3516"),J=d.rim??Lt,B=d.phi??Wt,L=230/J,ft=-2.2,b=79.5,zt=219,Pt=Math.sin(.572),lt=Math.cos(.572),X=374/1.83,U=(z,S,R,k,_,N)=>{const tt=(z-R)/_,p=(S-k)/N;return tt*tt+p*p},W=[0,0],rt=(z,S,R)=>{const k=zt-S,_=Math.max(k*lt+b*Pt,20);return R[0]=17+(z-ft)/_*X,R[1]=28.9+(k*Pt-b*lt)/_*X,R},nt=(z,S)=>{const R=(z+12)*.927-(S+8)*.375,k=(z+12)*.375+(S+8)*.927,_=U(z,S,10,38,36,27)<1,N=R*R/1600+k*k/2500<1;return z>40&&z<93&&Math.abs(S-(40-.08*(z-40)))<8.5*(1-(z-40)/53)?4:_?U(z,S,24,44,6,6)<1?4:U(z,S,24,44,9.5,9.5)<1?3:U(z,S,36,41,5,4)<1||U(z,S,14,30,16,8)<1?2:U(z,S,-12,24,13,10)<1||U(z,S,33,21,17,10)<1?3:S<26-.2*(z-10)?N&&R>2?2:1:0:N?R>2?2:R<-29?5:k>8?0:Math.abs((R+60)/9%1-.5)>.38?4:1:k>-72&&k<=-44&&Math.abs(R+8)<13-.15*(-44-k)?1:U(z,S,-14,-53,7,3.4)<1?6:-1};return{paints:[C,at,E,F,M,D,K,H,vt,$],line:[0,2,1,0,3,2,5],neck:[2,2,3,0,0,1],crest:0,wall:{bg:1,rays:[2,6],edge:4,disc:6,ring:5,dark:4,eye:[3,0,5,4]},fn(z,S,R){if(z>145)return 4;if(z>142)return Math.floor(Math.abs(R)/4.2)&1?2:3;const k=z*J/Lt,_=S*B,N=k*Math.sin(_)*L,tt=k*Math.cos(_)*L,p=rt(N,tt,W)[0],Q=W[1],j=nt(p,Q);if(j>=0)return j;const ot=2.2;return nt(p+ot,Q)>=0||nt(p-ot,Q)>=0||nt(p,Q+ot)>=0||nt(p,Q-ot)>=0?4:U(p,Q,43,37,45,45)<1?6:Math.abs(Q-(-58.5+.08*p))<3.6?9:Math.sin(Math.hypot(N-40,tt-236)*.16)>.9?8:7}}}const h=xt(pt,v("#58d8c0"),.42),x=ut.clone().multiplyScalar(.42),it=xt(Z,v("#3a2a10"),.5),st=[];for(const C of d.arcs??[{r:57,n:2},{r:92,n:5},{r:127,n:7}]){const E=C.r*Wt*.985,F=(E-8.5)/C.n;for(let M=-1;M<=1;M+=2)for(let D=0;D<C.n;D++)st.push({r:C.r+y.range(-1.5,1.5)+(D&1?2.5:-2.5),w:M*(8.5+F*(D+.5)),at:Math.min(4.9,F*.47),ar:10.5})}const bt=8+y.int(0,2),Ct=y.range(.27,.34);return{paints:[ut,pt,Z,h,x,it,v("#ead79c")],line:[0,1,3,1,2,0,1],neck:[0,0,3,0,1,0],crest:2,eyes:st,wall:{bg:0,rays:[2,3],edge:4,disc:2,ring:3,dark:4,eye:[5,6,3,4]},fn(C,at,E){for(let K=0;K<st.length;K++){const H=st[K],vt=(C-H.r)/H.ar,$=(E-H.w)/H.at,J=vt*vt+$*$;if(J>1.45)continue;const B=(C-H.r+2.2)/(H.ar*.42),L=(E-H.w)/(H.at*.52),ft=B*B+L*L;if(ft<.3)return 4;if(ft<1)return 0;const b=Math.sqrt(J);return b<.6?3:b<.76?1:b<1?2:5}if(C<31){const K=Math.floor(C/2.3),H=Math.floor(E/2.3+(K&1)*.5);return(K+H*2)%3===0?3:C<6?4:0}if(C<34.5)return 2;const F=Math.abs(at)*bt%1,M=Math.abs(F-.5);if(M<.045)return 2;const D=Math.floor(C*Ct+M*5.5)%6;return D===0?3:D===3&&M>.3?0:1}}}function Ut(m,l=!0){const y=Ye/2,d=re/2,w=m?.04:0,wt=[],Mt=[],pt=(h,x,it)=>{const st=x[0]-h[0],bt=x[1]-h[1],Ct=x[2]-h[2],C=it[0]-h[0],at=it[1]-h[1],E=it[2]-h[2];let F=bt*E-Ct*at,M=Ct*C-st*E,D=st*at-bt*C;const K=Math.hypot(F,M,D)||1;F/=K,M/=K,D/=K;const H=(h[0]+x[0]+it[0])/3,vt=(h[1]+x[1]+it[1])/3-1,$=(h[2]+x[2]+it[2])/3,J=F*H+M*vt*.2+D*$<0,B=J?[h,it,x]:[h,x,it];J&&(F=-F,M=-M,D=-D);for(const L of B)wt.push(L[0],L[1],L[2]),Mt.push(F,M,D)},ut=(h,x,it,st)=>{pt(h,x,it),pt(h,it,st)},Z=mt-w;for(const h of[-1,1])ut([-y+w,0,h*d],[y-w,0,h*d],[y-w,Z,h*d],[-y+w,Z,h*d]);if(l)for(const h of[-1,1])ut([h*y,0,-d+w],[h*y,0,d-w],[h*y,Z,d-w],[h*y,Z,-d+w]);if(ut([-y+w,mt,-d+w],[y-w,mt,-d+w],[y-w,mt,d-w],[-y+w,mt,d-w]),m){for(const h of[-1,1])for(const x of[-1,1])ut([h*(y-w),0,x*d],[h*y,0,x*(d-w)],[h*y,Z,x*(d-w)],[h*(y-w),Z,x*d]),pt([h*(y-w),mt,x*(d-w)],[h*(y-w),Z,x*d],[h*y,Z,x*(d-w)]);for(const h of[-1,1])ut([-y+w,Z,h*d],[y-w,Z,h*d],[y-w,mt,h*(d-w)],[-y+w,mt,h*(d-w)]);for(const h of[-1,1])ut([h*y,Z,-d+w],[h*y,Z,d-w],[h*(y-w),mt,d-w],[h*(y-w),mt,-d+w])}const xt=new u.BufferGeometry;return xt.setAttribute("position",new u.Float32BufferAttribute(wt,3)),xt.setAttribute("normal",new u.Float32BufferAttribute(Mt,3)),xt}const $t=`
uniform vec4 uFront, uWidth;
uniform float uTime, uShiver, uMaskOn, uSunAmount, uFront2;
uniform vec3 uSunDir;
uniform vec4 uWin[11];
uniform float uWinX[11];
uniform vec4 uRoof[5];
uniform float uRoofY, uSplitZ;
uniform vec2 uSlat;
float leanAngle(float trig, float k, out float tc) {
  float front = k < 0.5 ? uFront.x : (k < 1.5 ? uFront.y : (k < 2.5 ? uFront.z : (k > 4.5 ? uFront.w : -1.0e6)));
  float W = k < 0.5 ? uWidth.x : (k < 1.5 ? uWidth.y : (k < 2.5 ? uWidth.z : uWidth.w));
  float t = (front - trig) / max(W, 0.01);
  tc = clamp(t, 0.0, 1.0);
  float th = ${Ze.toFixed(4)} * tc * tc * (1.7 - 0.7 * tc);
  float ts = max(t - 1.0, 0.0);
  th -= 0.085 * exp(-2.0 * ts) * abs(sin(5.5 * ts));
  // the tiles just ahead of the crest tremble on their feet, less with distance
  th += step(t, 0.0) * step(k, 2.5) * 0.065 * exp(min(t, 0.0) * 0.45) * sin(uTime * 12.0 + trig * 2.3) * step(-1.0e5, front);
  if (k > 4.5) {      // a tile on a wall shelf only tips back against the wall; the second wave rocks it once more
    float t2 = clamp((uFront2 - trig) / max(W, 0.01), 0.0, 1.0);
    th = th * 0.2 - 0.16 * sin(3.14159 * t2);
  }
  return th;
}
// direct sun at P: 1 inside the shape a window (in a wall x = const) or a roof light (at y = uRoofY) throws.
// Windows on the near side of uSplitZ light only that room, the others (and the roof lights) only the hall.
float sunMask(vec3 P) {
  float m = 1.0;
  if (uMaskOn > 0.5) {
    m = 0.0;
    float side = step(uSplitZ, P.z);
    for (int i = 0; i < 11; i++) {
      vec4 a = uWin[i];
      float tt = (uWinX[i] - P.x) / max(uSunDir.x, 0.05);
      vec3 Q = P + uSunDir * tt;
      float dz = a.z - abs(Q.z - a.x), dy = a.w - abs(Q.y - a.y);
      float k = clamp(dz / 1.6 + 0.5, 0.0, 1.0) * clamp(dy / 1.6 + 0.5, 0.0, 1.0) * step(0.01, a.z) * step(0.0, tt);
      k *= 1.0 - abs(side - step(uSplitZ, a.x));
      if (uSlat.x > 0.01) { float f = fract(Q.y / uSlat.x); k *= smoothstep(0.0, 0.08, f) * (1.0 - smoothstep(uSlat.y, uSlat.y + 0.08, f)); }
      m = max(m, k);
    }
    for (int i = 0; i < 5; i++) {
      vec4 a = uRoof[i];
      float tt = (uRoofY - P.y) / max(uSunDir.y, 0.05);
      vec3 Q = P + uSunDir * tt;
      float dx = a.z - abs(Q.x - a.x), dz = a.w - abs(Q.z - a.y);
      m = max(m, clamp(dx / 1.6 + 0.5, 0.0, 1.0) * clamp(dz / 1.6 + 0.5, 0.0, 1.0) * step(0.01, a.z) * (1.0 - side));
    }
  }
  return m * uSunAmount;
}
`,Ue=`
attribute vec4 aA;      // trigger, which front (0 line, 1 fan, 2 second line, 3 neck, 4 arch), random, paint while standing
attribute vec3 aCol, aCol2;
varying vec3 vL, vLN, vN, vWP, vCol;
varying float vT2, vBand;
varying vec4 vS;
varying float vK;
#include <common>
#include <fog_pars_vertex>
${$t}
void main() {
  float tc;
  float th = leanAngle(aA.x, aA.y, tc);
  vec3 p = position, n = normal;
  float c = cos(th), s = sin(th), zz = p.z - ${(re/2).toFixed(3)};
  p = vec3(p.x, p.y * c - zz * s, p.y * s + zz * c + ${(re/2).toFixed(3)});
  n = vec3(n.x, n.y * c - n.z * s, n.y * s + n.z * c);
  if (aA.y > 3.5 && aA.y < 4.5) { float w = uShiver * sin(uTime * (23.0 + aA.z * 17.0) + aA.z * 50.0); p.x += 0.04 * w; p.z += 0.06 * w * sin(aA.z * 91.0); }
  vec4 lp = instanceMatrix * vec4(p, 1.0);
  vec4 wp = modelMatrix * lp;
  vN = mat3(modelMatrix) * (mat3(instanceMatrix) * n);
  vBand = step(aA.y, 2.5) * step(0.5, fract(aA.x / 18.0));      // standing tiles: every other 9 m ring shows a band of its paint
  vT2 = aA.y > 4.5 ? clamp((uFront2 - aA.x) / max(uWidth.w, 0.01), 0.0, 1.0) : 0.0;
  vL = position; vLN = normal; vWP = wp.xyz; vCol = mix(aCol, aCol2, smoothstep(0.3, 0.7, vT2)); vK = aA.y;
  vec3 mid = (instanceMatrix * vec4(0.0, 1.0, 0.0, 1.0)).xyz;
  vS = vec4(tc, sunMask(mid), aA.z, max(aA.w, smoothstep(0.1, 0.7, tc)));
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,$e=`
uniform vec3 uIvory, uBrass, uSun, uSky, uBounce, uSunDir;
uniform float uTime;
uniform vec2 uPaint;     // how far the sun is taken to white on painted faces, and the paints' saturation
uniform float uDap;      // how deep the slow shade of passing cloud lies on the tiles' sun
varying vec3 vL, vLN, vN, vWP, vCol;
varying vec4 vS;
varying float vK, vT2, vBand;
#include <common>
#include <fog_pars_fragment>
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1.0e-5, 0.0));
  vec3 an = abs(vLN);
  vec2 fuv, hf;
  if (an.z > 0.5) { fuv = vec2(vL.x, vL.y - 1.0); hf = vec2(0.5, 1.0); }
  else if (an.x > 0.5) { fuv = vec2(vL.z, vL.y - 1.0); hf = vec2(0.15, 1.0); }
  else { fuv = vL.xz; hf = vec2(0.5, 0.15); }
  vec2 e2 = hf - abs(fuv);
  float e = min(e2.x, e2.y), rnd = vS.z, tc = vS.x;
  float grain = sin(vL.x * 83.0 + rnd * 40.0 + sin(vL.y * 5.0 + rnd * 9.0) * 1.5);
  vec3 col = uIvory * (0.93 + 0.07 * rnd) * (1.0 - 0.035 * grain);
  col *= mix(0.8, 1.0, smoothstep(0.0, 0.04, e));                       // worn dark arris
  float face = step(0.5, -vLN.z);                                       // the face that ends uppermost
  float bandM = vBand * 0.9 * smoothstep(0.5, 0.54, fuv.y) * (1.0 - smoothstep(0.84, 0.88, fuv.y));      // a painted band under the head of the face
  float panel = smoothstep(0.055, 0.085, e) * face * max(vS.w, bandM);
  float brush = sin(vL.y * 31.0 + rnd * 60.0) * sin(vL.x * 9.0 + rnd * 20.0);
  vec3 paint = max(mix(vec3(dot(vCol, vec3(0.3, 0.55, 0.15))), vCol, uPaint.y), vec3(0.0)) * (0.92 + 0.14 * brush + 0.1 * (rnd - 0.5));
  paint *= mix(0.78, 1.0, smoothstep(0.085, 0.16, e));                  // darker painted border
  float big = step(0.5, an.z);
  float groove = (1.0 - smoothstep(0.0, 0.014, abs(e - 0.115))) * big;
  col *= 1.0 - 0.2 * groove;
  paint *= 1.0 + 0.16 * (1.0 - smoothstep(0.0, 0.55, length(fuv * vec2(1.7, 1.0) - vec2(0.0, 0.2))));
  paint += vec3(0.07) * (1.0 - smoothstep(0.0, 0.012, abs(e - 0.2)));
  col = mix(col, paint, max(panel, vBand * 0.85 * step(0.5, an.y) * smoothstep(0.02, 0.05, e)));      // (and its top edge)
  float pd = length(fuv - vec2(0.0, 0.52));
  float pin = (1.0 - smoothstep(0.07, 0.09, pd)) * face;
  col = mix(col, uBrass * (1.25 - 0.5 * smoothstep(0.0, 0.08, pd)), pin);
  // light
  float ndl = max(dot(N, uSunDir), 0.0);
  float stand = mix(0.66, 1.0, smoothstep(0.0, 1.4, vL.y));              // contact darkening at the foot
  float lap = smoothstep(0.86, 1.2, vL.y);                                // the part of a fallen tile that shows past the next one
  float down = mix(mix(0.62, 0.3, step(0.5, vLN.z)), mix(0.3, 1.0, lap), face);
  float ao = mix(stand, down, tc);
  if (vK > 2.5) ao = 0.8 + 0.2 * rnd;      // stacked, static tiles
  if (N.y < -0.5) ao *= 0.5;
  vec3 V = normalize(cameraPosition - vWP + vec3(0.0, 1.0e-4, 0.0));
  vec3 H = normalize(uSunDir + V + vec3(0.0, 1.0e-4, 0.0));
  float nh = max(dot(N, H), 0.0);
  float sunK = vS.y * mix(1.0, lap * 0.75 + 0.25, tc * face);
  float cl = 0.5 + 0.3 * sin(vWP.x * 0.045 + vWP.z * 0.021 + uTime * 0.33) + 0.2 * sin(vWP.z * 0.06 - vWP.x * 0.03 - uTime * 0.21);
  sunK *= 1.0 - uDap * smoothstep(0.5, 0.85, cl);
  vec3 sunC = mix(uSun, vec3(dot(uSun, vec3(0.3, 0.55, 0.15))), uPaint.x * panel);
  vec3 sunL = sunC * ndl * sunK * mix(1.0, ao, 0.5), ambL = (uSky * (0.62 + 0.38 * N.y) + uBounce * (0.55 - 0.45 * N.y)) * ao;
  vec3 light = sunL + ambL;
  // the wall's tiles: lifted, so the burst glows in the shade; the patch of sun on them is held to a warm glow (at full
  // strength it burns gold, orange and blue alike to white, and the picture beside the gateway is lost)
  if (vK > 4.5) light = sunL * 0.34 + ambL * 1.25 + (uSky + uBounce) * 0.3;
  vec3 outc = col * light;
  // a slow sheen crosses the lacquered faces, as when a cloud's edge passes the roof lights
  float sheen = 0.5 + 0.5 * sin(vWP.z * 0.07 + vWP.x * 0.04 + vWP.y * 0.09 - uTime * 1.1); sheen *= sheen * sheen; sheen *= sheen;
  outc *= 1.0 + 0.32 * sheen * (0.35 + 0.65 * panel);
  outc += uSun * pow(nh, 60.0) * sunK * (0.06 + 0.1 * panel);
  float band = pow(0.5 + 0.5 * sin(vWP.z * 0.07 + vWP.x * 0.045 - uTime * 1.7 + rnd * 1.3), 24.0);
  outc += uBrass * pin * (pow(nh, 14.0) * 5.0 * sunK + band * 2.2 * (0.25 + 0.75 * vS.y));
  // the crest: tiles in mid-fall flash as they turn
  float crest = (4.0 * tc * (1.0 - tc) + 4.0 * vT2 * (1.0 - vT2)) * (step(vK, 2.5) + step(4.5, vK));
  float tw = 0.5 + 0.5 * sin(uTime * 13.0 + rnd * 70.0); tw *= tw; tw *= tw;
  outc += (uSun * 0.3 + uBrass * 0.9) * crest * (0.18 + 1.25 * tw) * (0.4 + 0.6 * vS.y);
  gl_FragColor = vec4(outc, 1.0);
  #include <fog_fragment>
}`,Je=`
attribute vec3 aBase;
attribute vec2 aDir;
attribute vec4 aB;      // trigger, which front, clip half-width, random
varying vec3 vQ;        // u, v, lateral metres
varying vec2 vM;        // sun mask, clip
#include <common>
#include <fog_pars_vertex>
${$t}
void main() {
  float tc;
  float th = leanAngle(aB.x, aB.y, tc);
  vec3 d = vec3(aDir.x, 0.0, aDir.y), wv = vec3(aDir.y, 0.0, -aDir.x);
  float hy = ${mt.toFixed(1)} * cos(th), hd = ${mt.toFixed(1)} * sin(th);
  vec2 off = d.xz * hd - uSunDir.xz * (hy / max(uSunDir.y, 0.12));
  vec3 P = aBase + wv * position.x * 1.04 + vec3(off.x, 0.0, off.y) * position.y + d * 0.15 * (1.0 - 2.0 * position.y) * -1.0;
  P.y = aBase.y + 0.035;
  vQ = vec3(position.x, position.y, dot(P - aBase, wv));
  vM = vec2(sunMask(aBase + vec3(0.0, 1.0, 0.0)), aB.z);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,tn=`
uniform vec3 uShadowColor;
uniform float uShadowStrength;
varying vec3 vQ;
varying vec2 vM;
#include <common>
#include <fog_pars_fragment>
void main() {
  if (abs(vQ.z) > vM.y) discard;
  float a = uShadowStrength * vM.x * (1.0 - smoothstep(0.36, 0.5, abs(vQ.x))) * (1.0 - 0.55 * smoothstep(0.45, 1.0, vQ.y)) * smoothstep(0.0, 0.04, vQ.y);
  float ff = 0.0;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      ff = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(mix(vec3(1.0), uShadowColor, a * (1.0 - ff)), 1.0);
}`,en=`
attribute vec3 color;
attribute vec3 aM;      // metal, ruler u (metres, < -100 = not a ruler), ruler v
varying vec3 vN, vWP, vCol, vM;
varying float vMask;
#include <common>
#include <fog_pars_vertex>
${$t}
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vN = mat3(modelMatrix) * normal; vWP = wp.xyz; vCol = color; vM = aM;
  vMask = sunMask(position);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,nn=`
uniform vec3 uSun, uSky, uBounce, uSunDir;
varying vec3 vN, vWP, vCol, vM;
varying float vMask;
#include <common>
#include <fog_pars_fragment>
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1.0e-5, 0.0));
  vec3 col = vCol;
  if (vM.y > -100.0) {
    float g = sin(vM.z * 23.0 + sin(vM.y * 0.9) * 2.0) * 0.5 + 0.5;
    col *= 0.9 + 0.1 * g;
    if (N.y > 0.5) {
      float av = abs(vM.z);
      float f1 = abs(fract(vM.y / 0.25 + 0.5) - 0.5) * 0.25, f5 = abs(fract(vM.y / 1.25 + 0.5) - 0.5) * 1.25;
      float ink = (1.0 - smoothstep(0.012, 0.026, f1)) * step(0.74, av) + (1.0 - smoothstep(0.02, 0.04, f5)) * step(0.5, av);
      ink = max(ink, 1.0 - smoothstep(0.0, 0.03, abs(av - 0.985)));
      col = mix(col, vec3(0.1, 0.06, 0.035), clamp(ink, 0.0, 1.0) * 0.85);
    }
  }
  vec3 V = normalize(cameraPosition - vWP + vec3(0.0, 1.0e-4, 0.0));
  vec3 H = normalize(uSunDir + V + vec3(0.0, 1.0e-4, 0.0));
  float ndl = max(dot(N, uSunDir), 0.0), nh = max(dot(N, H), 0.0), metal = vM.x;
  vec3 amb = uSky * (0.62 + 0.38 * N.y) + uBounce * (0.55 - 0.45 * N.y);
  vec3 R = reflect(-V, N);
  vec3 env = mix(uBounce * 1.6, uSky * 1.8, smoothstep(-0.2, 0.5, R.y));
  vec3 outc = col * (uSun * ndl * vMask * mix(1.0, 0.45, metal) + amb * mix(1.0, 0.35, metal));
  outc += col * env * metal * 0.9 + uSun * col * pow(nh, mix(30.0, 90.0, metal)) * vMask * mix(0.05, 2.2, metal);
  gl_FragColor = vec4(outc, 1.0);
  #include <fog_fragment>
}`,on=`
varying vec3 vN, vWP, vOP;
#include <common>
#include <fog_pars_vertex>
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vN = mat3(modelMatrix) * normal; vWP = wp.xyz; vOP = position;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,an=`
uniform vec3 uColor, uSun, uSky, uBounce, uSunDir;
varying vec3 vN, vWP, vOP;
#include <common>
#include <fog_pars_fragment>
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1.0e-5, 0.0));
  vec3 V = normalize(cameraPosition - vWP + vec3(0.0, 1.0e-4, 0.0));
  float nv = max(dot(N, V), 0.0), fres = (1.0 - nv) * (1.0 - nv) * (1.0 - nv);
  float tw = sin(vOP.y * 5.0 + 4.0 * (vOP.x * cos(vOP.y * 3.0) + vOP.z * sin(vOP.y * 3.0)));
  vec3 inner = uColor * (0.35 + 0.9 * smoothstep(0.2, 0.95, tw)) + vec3(0.25, 0.4, 0.5) * smoothstep(0.9, 1.0, tw) * 0.5;
  float through = max(dot(-N, uSunDir), 0.0);                       // sun gathered on the far side of the glass
  vec3 col = inner * (uSky * 0.9 + uBounce * 0.5 + uSun * (0.25 + 1.6 * through * through)) * (0.45 + 0.55 * nv);
  vec3 R = reflect(-V, N);
  vec3 env = mix(uBounce * 1.4, uSky * 2.2, smoothstep(-0.3, 0.6, R.y));
  col += env * (0.04 + 0.6 * fres);
  vec3 H = normalize(uSunDir + V + vec3(0.0, 1.0e-4, 0.0));
  float nh = max(dot(N, H), 0.0);
  col += (uSun * 1.6 + uColor * 2.0) * pow(nh, 220.0) * 2.2;
  col += uSky * pow(max(dot(R, normalize(vec3(-0.4, 0.75, 0.5))), 0.0), 90.0) * 2.0;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,rn=`
attribute vec4 aP;      // trigger, which front, random, size (m)
uniform float uBufH;
varying float vA;
#include <common>
#include <fog_pars_vertex>
${$t}
void main() {
  float front = aP.y < 0.5 ? uFront.x : (aP.y < 1.5 ? uFront.y : uFront.z);
  float W = aP.y < 0.5 ? uWidth.x : (aP.y < 1.5 ? uWidth.y : uWidth.z);
  float q = ((front - aP.x) / max(W, 0.01) - 0.9) / 2.6;
  float live = step(0.0, q) * step(q, 1.0);
  float qc = clamp(q, 0.0, 1.0);
  vec3 P = position + vec3(sin(aP.z * 40.0) * 0.7, 0.25 + 1.5 * sqrt(qc), cos(aP.z * 71.0) * 0.7) * (0.3 + qc);
  vA = live * smoothstep(0.0, 0.08, qc) * (1.0 - qc) * (1.0 - qc) * (0.3 + 0.7 * sunMask(position));
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = live * aP.w * (0.7 + 1.8 * qc) * min(projectionMatrix[1][1] * uBufH * 0.5 / max(gl_Position.w, 0.5), 160.0);
  if (live < 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  #include <fog_vertex>
}`,sn=`
uniform vec3 uDust;
varying float vA;
#include <common>
#include <fog_pars_fragment>
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = 1.0 - smoothstep(0.1, 0.5, length(c));
  gl_FragColor = vec4(uDust, d * vA * 0.3);
  #include <fog_fragment>
}`;async function cn(m,l={}){const y=m.rng,d=je.map((t,e)=>l.palette&&l.palette[e]||t),w=m.quality?.detail??1,wt=l.eye??Ke,Mt=l.lineEye??wt,pt=l.lineDrop??(()=>0),ut=l.rare??!!(m.vary&&m.vary.rare),Z=y(),xt=l.design??(m.vary&&m.vary.hour==="golden"?"kingfisher":Z<.52?"peacock":Z<.7?"sunflower":Z<.85?"koi":"kingfisher"),h=Xe(xt,d,y.fork("design"),l);await m.yield();const x=y.fork("layout"),it=l.marbleColor?!1:x.chance(.3),st=l.rim??Lt,bt=l.phi??Wt,Ct=Lt/st,C=l.apexZ??Ge,at=x.range(.02,.1),E=l.chuteX??-3,F=new u.Vector3().fromArray(l.archAt??[0,31,xe-ae+1]),M=new u.Vector3().fromArray(l.neckAt??[9,0,C-12]),D=new u.Vector3(E,0,C+(l.strikeR??14)),K=l.aisle??0,H=l.notch??0,vt=l.clipX??1e6,$=v(d[0]).multiplyScalar(.92),J=[],B=[],L=[],ft=[],b=new u.Matrix4,zt=new u.Vector3,Pt=new u.Vector3,lt=new u.Vector3,X=(t,e,n,r,o,a,i,c,s)=>{b.makeRotationY(o),b.setPosition(e,n,r),t.push({m:b.toArray(),trig:a,k:i,r:x(),paint0:c,col:s})},U=(t,e,n,r,o,a,i,c,s,f)=>{b.makeBasis(zt.fromArray(e),Pt.fromArray(n),lt.fromArray(r)),b.setPosition(o,a,i),t.push({m:b.toArray(),trig:0,k:c,r:x(),paint0:s,col:f})},W=h.paints,rt=(t,e)=>{const n=Mt(t-.5),r=Mt(t+.5),o=Mt(t);let a=r[0]-n[0],i=r[2]-n[2];const c=Math.hypot(a,i)||1;a/=c,i/=c;const s=e*(l.lineOffset?l.lineOffset(t):4+4.6*gt(835,872,t));return{x:o[0]-i*s,y:l.lineY?l.lineY(t):Math.max(0,o[1]-2.5-pt(t)),z:o[2]+a*s,tx:a,tz:i}},nt=235,z=l.secondFrom??197,S=873,R=[],k=async(t,e,n,r=B)=>{const o=5+x.int(0,4);let a=0;for(let i=t;i<=S;i+=Zt,a++){const c=rt(i,e),s=Math.atan2(c.tx,c.tz)+x.range(-.035,.035),f=Math.floor(a/o),g=a%o===o-1?h.line[6]:h.line[f%6];X(r,c.x,c.y,c.z,s,i,n,0,W[g%W.length]),L.push({x:c.x,y:c.y,z:c.z,dx:c.tx,dz:c.tz,trig:i,k:n,clip:i>=nt&&c.y>.2?.86:1e4}),a%3===0&&ft.push({x:c.x+c.tx*1.9,y:c.y,z:c.z+c.tz*1.9,trig:i,k:n}),a%100===99&&await m.yield()}};await k(l.lineStart??4,1,0),await m.yield(),ut&&await k(z,-1,2,R);for(const t of l.branches||[]){const e=t.from[0],n=t.from[1],r=t.from[2],o=t.to[0]-e,a=t.to[2]-r,i=Math.hypot(o,a)||1,c=o/i,s=a/i;for(let f=0,g=0;f<=i;f+=Zt,g++){const A=e+c*f,q=r+s*f,G=t.trig+f;X(B,A,n,q,Math.atan2(c,s)+x.range(-.035,.035),G,0,0,W[h.line[g%6]%W.length]),L.push({x:A,y:n,z:q,dx:c,dz:s,trig:G,k:0,clip:n>.1?.86:1e4})}}await m.yield();let _=0;for(let t=-1;t<=1;t+=2){let e=[{t0:0,t1:1,ph:x(),th:x.range(2.35,2.6)}],n=0;for(let r=2.6;r<=st;r+=Zt,n++){const o=K>0?K+H*(1-gt(6,22,r)):6*gt(9,20,r),a=Math.asin(Math.min(1,o/r)),i=bt-a;if(i<.02)continue;const c=[];for(const s of e)if((s.t1-s.t0)*i*r>s.th){const f=(s.t0+s.t1)/2;c.push({t0:s.t0,t1:f,ph:s.ph,th:x.range(2.35,2.6)},{t0:f,t1:s.t1,ph:(s.ph+.37)%1,th:x.range(2.35,2.6)})}else c.push(s);e=c;for(const s of e){const f=r+(s.ph-.5)*Zt*.8;if(f>st+.4)continue;const g=a+i*(s.t0+s.t1)/2,A=t*g*(1+at*Math.sin(Math.PI*f/st)),q=f*Math.sin(A)+x.range(-.04,.04),G=C+f*Math.cos(A);if(Math.abs(q)>vt)continue;const P=-Math.sin(A),V=-Math.cos(A),I=Math.hypot(q-D.x,G-D.z),Y=h.fn(f*Ct,A/bt,f*Ct*A*Wt/bt);X(J,q,0,G,Math.atan2(P,V)+x.range(-.03,.03),I,1,0,W[Y]),L.push({x:q,y:0,z:G,dx:P,dz:V,trig:I,k:1,clip:1e4}),x()<.12*w&&ft.push({x:q+P*1.9,y:0,z:G+V*1.9,trig:I,k:1}),I>_&&(_=I)}(n&3)===0&&await m.yield()}}_+=16,await m.yield();const N=l.neckTiers??[[0,7],[.7,4],[1.6,2],[2.3,2],[1.8,2],[.8,3]],tt=N.length;N.forEach(([t,e],n)=>{const r=M.y+n*2.3,o=W[h.neck[Math.min(5,Math.round(n*5/(tt-1)))]];for(let i=0;i<e;i++){const c=M.x+t+(i-(e-1)/2)*1.04;X(B,c,r,M.z+.68,Math.PI,0,3,1,o),X(B,c,r,M.z-.68,0,0,3,1,o)}X(B,M.x+t+e*.52+.17,r,M.z,-Math.PI/2,0,3,1,o),X(B,M.x+t-e*.52-.17,r,M.z,Math.PI/2,0,3,1,o);const a=Math.ceil((e*1.04+.5)/2.05);for(let i=0;i<a;i++)for(const c of[-.52,.52])U(B,[0,0,1],[1,0,0],[0,1,0],M.x+t+(i-a/2)*2.05,r+2.15,M.z+c,3,0,o)});{const[t]=N[tt-1],e=M.y+(tt-1)*2.3,n=M.y+tt*2.3;U(B,[0,0,-1],[1,0,0],[0,-1,0],M.x+t-4.1,e+1.25,M.z,3,1,W[h.crest]);for(let r=0;r<5;r++){const o=(r-2)*.36;b.makeRotationZ(-o).multiply(new u.Matrix4().makeRotationY(Math.PI)),b.setPosition(M.x+t+(r-2)*.62,n-.06*Math.abs(r-2),M.z+(r-2)*.33),B.push({m:b.toArray(),trig:0,k:3,r:x(),paint0:1,col:W[h.crest]})}}const p=Object.assign({inner:7.6,outer:11,spring:10.4,course:1.01,courses:20},l.arch||{}),Q=p.courses,j=Math.round(p.spring/p.course),ot=Math.ceil(2*p.outer/2.03),Nt=t=>t<p.spring?p.inner:Math.sqrt(Math.max(0,p.inner*p.inner-(t-p.spring)*(t-p.spring)));for(let t=0;t<Q;t++){const e=t*p.course,n=Nt(e),r=n<.6,o=t===0||t===Q-1||t===j;for(let a=-1;a<=1;a++){const i=F.z+a*.42,c=a>=0?[0,0,-1]:[0,0,1],s=a>=0?[0,1,0]:[0,-1,0],f=(g,A)=>{const q=x.range(-.035,.035),G=A===2&&t>j,P=o||(A===!0||G)&&a!==0,V=o?W[Math.round(g*.5)&1?0:1]:G&&l.wall?W[h.wall.bg]:W[h.crest];U(B,s,[1,0,0],c,F.x+g+q,F.y+e+.5,i+x.range(-.02,.02),4,P?1:0,V)};if(r){const g=t+a&1?0:1;for(let A=0;A<ot;A++)f(-p.outer-.15+g*.5+A*2.03,!1)}else{const g=a===0&&t>j?.5:t&1&&t<=j?.3*a*a:0,A=Math.max(1,Math.ceil((p.outer-n-g-.5)/2.03));for(let q=0;q<A;q++){const G=q===0?!0:q===1?2:!1;f(n+g+q*2.03,G),f(-(n+g+q*2.03)-2,G)}}}(t&7)===7&&await m.yield()}{const t=Math.round(2*p.outer/1.55)+1;for(let e=0;e<t;e++)X(B,F.x+(e-(t-1)/2)*1.55,F.y+Q*p.course,F.z,Math.PI,0,4,0,W[0])}await m.yield();const Jt=[],se=[];let Rt=0;if(l.wall){const t=l.wall,e=h.wall,n=t.cy,r=t.r0,o=t.r1,a=t.rays??14,i=t.pitch??2.16,c=(P,V)=>{const I=V-n,Y=Math.hypot(P,I),et=Math.atan2(P,I),ht=I>=0?o-Y:Math.min(o-Math.abs(P),V-t.yMin+1.3);if(ht<2.3)return Math.floor((I>=0?et*o:V+Math.sign(P)*40)/3.2+100)&1?e.ring:e.rays[0];if(ht<3.6)return e.dark;if(Y<r-2.6)return e.disc;if(Y<r)return e.ring;const ct=et/(Math.PI*2)*a,T=Math.round(ct),yt=Math.abs(ct-T),_t=.29,Qe=1.25/(Y*Math.PI*2/a);return yt<_t?yt>_t-Qe?e.edge:e.rays[(T%2+2)%2]:e.bg},s=e.eye??[e.ring,e.bg,e.disc,e.dark],f=r+(o-r)*.705,g=r+(o-r)*.333,A=(P,V,I,Y,et)=>{if(n+Y*Math.cos(I*Math.PI*2/a)<t.yMin+et*1.22+2.5)return-1;const ht=(P-Y)/1.22,ct=(V-I)*(P*Math.PI*2/a),T=Math.hypot(ht,ct)/et;return T>=1?-1:T<.36?s[3]:T<.68?s[2]:T<.86?s[1]:s[0]},q=(P,V)=>{const I=c(P,V),Y=V-n,et=Math.hypot(P,Y),ht=Math.atan2(P,Y);if((Y>=0?o-et:Math.min(o-Math.abs(P),V-t.yMin+1.3))<3.6||et<r)return I;const T=ht/(Math.PI*2)*a;let yt=A(et,T,Math.round(T),f,(o-r)*.187);if(yt>=0||(yt=A(et,T,Math.floor(T)+.5,g,(o-r)*.145),yt>=0))return yt;if(I===e.bg&&et>f+1){const _t=Math.abs(T-Math.round(T));if(((et-_t*30)/9%1+1)%1<.42)return s[2]}return I};let G=0;for(let P=t.yMin;P<n+o-1.5;P+=i,G++){const V=P+1-n,I=V<=0?o:Math.sqrt(Math.max(0,o*o-V*V));if(I<2)continue;const Y=Math.floor(2*I/1.06),et=-(Y-1)/2*1.06;for(let ht=0;ht<Y;ht++){const ct=et+ht*1.06,T=Math.hypot(ct,P+1-n);T<(t.hole??5)||t.skip&&t.skip(ct,P)||(b.makeRotationY(Math.PI),b.setPosition(ct+x.range(-.03,.03),P,t.z+.72),Jt.push({m:b.toArray(),trig:T,k:5,r:x(),paint0:0,col:W[c(ct,P+1)],col2:W[q(ct,P+1)]}),T>Rt&&(Rt=T))}se.push({y:P,half:I+.4}),(G&3)===3&&await m.yield()}Rt+=12}await m.yield();const Vt=new u.Vector3().fromArray(l.sunDir??[.557,.616,.557]).normalize(),qt=[],te=[],Ht=[];for(let t=0;t<11;t++)qt.push(new u.Vector4(0,0,0,0)),te.push(75);for(let t=0;t<5;t++)Ht.push(new u.Vector4(0,0,0,0));const O={uFront:{value:new u.Vector4(-1e3,-1e3,-1e3,-1e3)},uWidth:{value:new u.Vector4(11,14,11,1)},uTime:{value:0},uShiver:{value:0},uMaskOn:{value:0},uSunAmount:{value:1},uFront2:{value:-1e3},uSunDir:{value:Vt},uWin:{value:qt},uWinX:{value:te},uRoof:{value:Ht},uRoofY:{value:l.roofY??120},uSplitZ:{value:l.splitZ??-1e6},uSlat:{value:new u.Vector2(0,.5)},uIvory:{value:$},uBrass:{value:v(d[6]).lerp(v("#ffd98a"),.25)},uSun:{value:new u.Color().copy(l.sunColor?v(l.sunColor):new u.Color(1,.93,.8).multiplyScalar(1.5))},uSky:{value:l.skyColor?v(l.skyColor):new u.Color(.5,.63,.88).multiplyScalar(.55)},uBounce:{value:l.bounceColor?v(l.bounceColor):v(d[1]).multiplyScalar(.45)},uShadowColor:{value:new u.Color(.4,.5,.78)},uShadowStrength:{value:.85},uColor:{value:v(l.marbleColor??(it?"#d98a1c":d[5]))},uDust:{value:v(d[3]).multiplyScalar(.9)},uBufH:{value:450},uPaint:{value:new u.Vector2(0,1)},uDap:{value:.2}},le=(t,e)=>{const n=Math.min(11,t?t.length:0),r=Math.min(5,e?e.length:0);for(let o=0;o<11;o++)if(o<n){const a=t[o];qt[o].set(a.z,a.y,a.w/2,a.h/2),te[o]=a.x}else qt[o].set(0,0,0,0);for(let o=0;o<5;o++)if(o<r){const a=e[o];Ht[o].set(a.x,a.z,a.w/2,a.d/2)}else Ht[o].set(0,0,0,0);O.uMaskOn.value=n+r>0?1:0};le(l.windows,l.roofs),l.slats&&O.uSlat.value.set(l.slats[0],l.slats[1]);const Tt=(t,e,n={})=>new u.ShaderMaterial({uniforms:Object.assign(u.UniformsUtils.clone(u.UniformsLib.fog),O),vertexShader:t,fragmentShader:e,fog:!0,...n}),be=Tt(Ue,$e),ze=Tt(Je,tn,{transparent:!0,depthWrite:!1,side:u.DoubleSide,blending:u.CustomBlending,blendEquation:u.AddEquation,blendSrc:u.ZeroFactor,blendDst:u.SrcColorFactor,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2}),ce=Tt(en,nn),Pe=Tt(on,an),Se=Tt(rn,sn,{transparent:!0,depthWrite:!1});await m.yield();const Ft=new u.Group;Ft.name="the-toppling-hero";const Qt=async(t,e)=>{const n=t.length,r=new u.InstancedMesh(e,be,n),o=new Float32Array(n*4),a=new Float32Array(n*3),i=new Float32Array(n*3),c=r.instanceMatrix.array;for(let s=0;s<n;s++){const f=t[s];c.set(f.m,s*16),o[s*4]=f.trig,o[s*4+1]=f.k,o[s*4+2]=f.r,o[s*4+3]=f.paint0,a[s*3]=f.col.r,a[s*3+1]=f.col.g,a[s*3+2]=f.col.b;const g=f.col2||f.col;i[s*3]=g.r,i[s*3+1]=g.g,i[s*3+2]=g.b,(s&1023)===1023&&await m.yield()}return e.setAttribute("aA",new u.InstancedBufferAttribute(o,4)),e.setAttribute("aCol",new u.InstancedBufferAttribute(a,3)),e.setAttribute("aCol2",new u.InstancedBufferAttribute(i,3)),r.instanceMatrix.needsUpdate=!0,r.frustumCulled=!1,Ft.add(r),r},ke=await Qt(J,Ut(!1,!1));await m.yield();const Ae=await Qt(B,Ut(!0));R.length&&await Qt(R,Ut(!1));const Ce=Jt.length?await Qt(Jt,Ut(!1,!1)):null;await m.yield();{const t=L.length,e=new u.InstancedBufferGeometry;e.setAttribute("position",new u.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,0,0,.5,1,0,-.5,1,0],3));const n=new Float32Array(t*3),r=new Float32Array(t*2),o=new Float32Array(t*4);for(let i=0;i<t;i++){const c=L[i];n[i*3]=c.x,n[i*3+1]=c.y,n[i*3+2]=c.z,r[i*2]=c.dx,r[i*2+1]=c.dz,o[i*4]=c.trig,o[i*4+1]=c.k,o[i*4+2]=c.clip,o[i*4+3]=Kt(i)}e.setAttribute("aBase",new u.InstancedBufferAttribute(n,3)),e.setAttribute("aDir",new u.InstancedBufferAttribute(r,2)),e.setAttribute("aB",new u.InstancedBufferAttribute(o,4)),e.instanceCount=t;const a=new u.Mesh(e,ze);a.frustumCulled=!1,a.renderOrder=1,Ft.add(a)}{const t=ft.length,e=new Float32Array(t*3),n=new Float32Array(t*4);for(let a=0;a<t;a++){const i=ft[a];e[a*3]=i.x,e[a*3+1]=i.y+.3,e[a*3+2]=i.z,n[a*4]=i.trig,n[a*4+1]=i.k,n[a*4+2]=Kt(a*3.1+7),n[a*4+3]=1.6+1.6*Kt(a*1.7)}const r=new u.BufferGeometry;r.setAttribute("position",new u.BufferAttribute(e,3)),r.setAttribute("aP",new u.BufferAttribute(n,4));const o=new u.Points(r,Se);o.frustumCulled=!1,o.renderOrder=3,Ft.add(o)}await m.yield();const ue=[],fe=[],he=[],ve=[],St=(t,e,n,r,o,a)=>{ue.push(t[0],t[1],t[2]),fe.push(e[0],e[1],e[2]),he.push(n.r,n.g,n.b),ve.push(r,o,a)},kt=(t,e,n,r,o,a,i,c,s,f,g)=>{St(t,o,a,i,c,f),St(e,o,a,i,c,g),St(n,o,a,i,s,g),St(t,o,a,i,c,f),St(n,o,a,i,s,g),St(r,o,a,i,s,f)},de=v(d[1]).lerp(v(d[0]),.5),Fe=v(d[1]).lerp(v(d[0]),.36),Be=v(d[6]).lerp(v("#8a5a1a"),.45),me=(t,e)=>{let n=null;for(let r=t;r<=S+2.2;r+=2.2){const o=rt(r,e),a=-o.tz,i=o.tx,c=o.y+.02,s={s:r,y:o.y,L:[o.x-a*.86,c,o.z-i*.86],R:[o.x+a*.86,c,o.z+i*.86],wx:a,wz:i};if(n&&(o.y>.2||n.y>.2)){const f=Math.floor(n.s/22.9)&1?de:Fe,g=A=>[A[0],Math.max(A[1]-.26,0),A[2]];kt(n.L,n.R,s.R,s.L,[0,1,0],f,0,n.s,s.s,-1,1),kt(n.L,g(n.L),g(s.L),s.L,[-a,0,-i],f,0,n.s,s.s,.3,.3),kt(n.R,g(n.R),g(s.R),s.R,[a,0,i],f,0,n.s,s.s,.3,.3),kt(g(n.L),g(n.R),g(s.R),g(s.L),[0,-1,0],f,0,n.s,s.s,.3,.3)}n=s}};me(nt,1),ut&&me(nt,-1),await m.yield();const ee=l.wall?W[h.wall.bg].clone().multiplyScalar(.34):v("#4a2e1a");for(const t of se){const e=l.wall.z+.05,n=l.wall.z+1.25,r=t.y-.02,o=t.half;kt([-o,r,e],[-o,r,n],[o,r,n],[o,r,e],[0,1,0],ee,0,-1e3,-1e3,0,0),kt([-o,r-.12,n],[o,r-.12,n],[o,r,n],[-o,r,n],[0,0,1],ee,0,-1e3,-1e3,0,0)}if(l.wall){const t=l.wall,e=t.z+.07,n=t.r1+.9,r=t.yMin-.5,o=ee.clone().multiplyScalar(.8),a=24;kt([-n,r,e],[n,r,e],[n,t.cy,e],[-n,t.cy,e],[0,0,1],o,0,-1e3,-1e3,0,0);for(let i=0;i<a;i++){const c=Math.PI*i/a,s=Math.PI*(i+1)/a,f=[0,0,1];St([0,t.cy,e],f,o,0,-1e3,0),St([n*Math.cos(c),t.cy+n*Math.sin(c),e],f,o,0,-1e3,0),St([n*Math.cos(s),t.cy+n*Math.sin(s),e],f,o,0,-1e3,0)}}const Et=118,pe=D.z+3,jt=.8,ye=t=>.75+6.6*(1-gt(0,.28,t))-.15*t,Ot=[];for(let t=0;t<=40;t++){const e=t/40;Ot.push(new u.Vector3(E,ye(e),It(Et,pe,e)))}for(const t of[-.42,.42])for(let e=0;e<40;e++){const n=Ot[e],r=Ot[e+1];for(let o=0;o<6;o++){const a=o/6*Math.PI*2,i=(o+1)/6*Math.PI*2,c=(a+i)/2,s=.13,f=[Math.cos(a)*s+t,Math.sin(a)*s],g=[Math.cos(i)*s+t,Math.sin(i)*s];kt([n.x+f[0],n.y+f[1],n.z],[n.x+g[0],n.y+g[1],n.z],[r.x+g[0],r.y+g[1],r.z],[r.x+f[0],r.y+f[1],r.z],[Math.cos(c),Math.sin(c),0],Be,1,-1e3,-1e3,0,0)}}const _e=(t,e,n,r,o)=>{const a=[[.95,0],[.95,.12],[.56,.2],[.56,.8],[.95,.88],[.95,1],[.02,1]],i=de;for(let c=0;c<a.length-1;c++){const[s,f]=a[c],[g,A]=a[c+1],q=c===2?o:i;let G=s-g,P=(A-f)*r;const V=Math.hypot(G,P)||1;G/=V,P/=V;for(let I=0;I<10;I++){const Y=I/10*Math.PI*2,et=(I+1)/10*Math.PI*2,ht=(Y+et)/2,ct=Math.cos(Y),T=Math.sin(Y),yt=Math.cos(et),_t=Math.sin(et);kt([t+ct*s,e+f*r,n+T*s],[t+yt*s,e+f*r,n+_t*s],[t+yt*g,e+A*r,n+_t*g],[t+ct*g,e+A*r,n+T*g],[Math.cos(ht)*P,G,Math.sin(ht)*P],q,0,-1e3,-1e3,0,0)}}};for(let t=1;t<=40;t+=3){const e=Ot[t],n=e.y-.13,r=Math.max(1,Math.round(n/1.3)),o=n/r;for(let a=0;a<r;a++)_e(e.x,a*o,e.z,o,W[(t+a)%Math.min(4,W.length)])}{const t=new u.BufferGeometry;t.setAttribute("position",new u.Float32BufferAttribute(ue,3)),t.setAttribute("normal",new u.Float32BufferAttribute(fe,3)),t.setAttribute("color",new u.Float32BufferAttribute(he,3)),t.setAttribute("aM",new u.Float32BufferAttribute(ve,3)),ce.side=u.DoubleSide;const e=new u.Mesh(t,ce);e.frustumCulled=!1,Ft.add(e)}const Gt=new u.Mesh(new u.SphereGeometry(jt,28,18),Pe);Ft.add(Gt);const ge=(t,e=new u.Vector3)=>{const n=Dt(t,0,1),r=n*(.3+.7*n),o=It(Et,D.z+jt+.2,r),a=(Et-o)/(Et-pe),i=It(ye(Math.min(a,1))+.81,jt,gt(1,1.25,a));return e.set(E,i,o)};await m.yield();const Bt=(t,e=new u.Vector3)=>e.fromArray(wt(t)),ne=[];for(let t=0;t<=ae;t+=20)ne.push(Bt(t));const De={station:Bt,eyeStations:ne,flyThrough:ne,portalSeat:{position:new u.Vector3(F.x,F.y+(p.spring+p.inner)/2,F.z-1),facing:new u.Vector3(0,0,1),shape:"arch",width:p.inner*2-1.2,height:p.spring+p.inner-.6,radius:p.inner-.6},arch:{foot:F.clone(),inner:p.inner,outer:p.outer,spring:p.spring,top:Q*p.course+2},wallFrontMax:Rt,neck:{foot:M.clone(),top:new u.Vector3(M.x+.8,M.y+tt*2.3+2,M.z),height:tt*2.3+2},fan:{apex:new u.Vector3(0,0,C),rim:st,halfAngle:bt*(1+at),aisle:6},strike:D.clone(),fanFrontMax:_,line:{offset:4,rulerFrom:nt,end:S,base:(t,e=new u.Vector3)=>{const n=rt(t,1);return e.set(n.x,n.y,n.z)}},second:{present:ut,start:z,base:(t,e=new u.Vector3)=>{const n=rt(t,-1);return e.set(n.x,n.y,n.z)}},chute:{x:E,points:Ot},marble:ge,lookAt:new u.Vector3(0,1,-10),viewpoints:{entry:Bt(0),crest:Bt(200),rim:Bt(405),peacock:Bt(520),arch:Bt(845)},design:xt};let At=!1,Yt=0;const dt=O.uFront.value,Re=new u.Vector2,oe=new u.Vector3,Ie=t=>{At=!0,dt.x=t},Le=t=>{At=!0,dt.y=t},We=t=>{At=!0,dt.z=t},Ne=t=>{At=!0,Yt=t},Ve=t=>{At=!0,O.uShiver.value=t},Te=(t,e=-1e3)=>{At=!0,dt.w=t,O.uFront2.value=e},we=(t,e=9)=>{At=!0;const n=t*ae;dt.x=-2+(n+e+2)*gt(.012,.05,t),dt.y=_*Dt((t-.47)/.13,0,1),dt.z=t<.22?-1e3:n+e-14*(1-gt(.22,.9,t)),Yt=Dt((t-.4)/.07,0,1),O.uShiver.value=gt(.93,.985,t)},Ee=(t={})=>{t.sunDir&&(Vt.fromArray(t.sunDir.isVector3?t.sunDir.toArray():t.sunDir).normalize(),Vt.y<.1&&(Vt.y=.1,Vt.normalize())),t.sunColor&&O.uSun.value.copy(t.sunColor.isColor?t.sunColor:v(t.sunColor)),t.skyColor&&O.uSky.value.copy(t.skyColor.isColor?t.skyColor:v(t.skyColor)),t.bounceColor&&O.uBounce.value.copy(t.bounceColor.isColor?t.bounceColor:v(t.bounceColor)),t.shadowColor&&O.uShadowColor.value.copy(t.shadowColor.isColor?t.shadowColor:v(t.shadowColor)),t.shadowStrength!==void 0&&(O.uShadowStrength.value=t.shadowStrength),t.sunAmount!==void 0&&(O.uSunAmount.value=t.sunAmount),t.slats&&O.uSlat.value.set(t.slats[0],t.slats[1]),t.paintNeutral!==void 0&&(O.uPaint.value.x=t.paintNeutral),t.paintSat!==void 0&&(O.uPaint.value.y=t.paintSat)};l.progress!==void 0&&we(l.progress);function Me(t,e,n){if(O.uTime.value=e,m.renderer&&m.renderer.getDrawingBufferSize&&(O.uBufH.value=m.renderer.getDrawingBufferSize(Re).y),!At){const r=e%20;dt.x=e*25%900,dt.y=_*Dt((r-2)/14,0,1),dt.z=dt.x-12,dt.w=Rt*Dt((r-6)/12,0,1),O.uFront2.value=Rt*Dt((r-16)/8,0,1)-1,Yt=Dt(r/2,0,1),O.uShiver.value=.3+.3*Math.sin(e*.7)}ge(Yt,oe),Gt.position.copy(oe),Gt.rotation.x=-(Et-oe.z)/jt}Me(0,0,null);const Oe=70,qe=80,He=new u.Vector3(0,26,-10);return{object:Ft,radius:Oe,height:qe,center:He,anchors:De,update:Me,dispose(){},ground:!0,groundY:0,setProgress:we,setLineFront:Ie,setFanFront:Le,setSecondFront:We,setWallFront:Te,setMarble:Ne,setShiver:Ve,setLight:Ee,setWindows:le,uniforms:O,meshes:{fan:ke,near:Ae,wall:Ce,marble:Gt},counts:{fan:J.length,near:B.length,shadows:L.length,puffs:ft.length}}}export{cn as buildHero};
