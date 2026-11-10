import*as t from"three";import{makePath as Rs,clamp as Re,lerp as Kt,smoothstep as Ie}from"../kit/core.js";import{makeSky as Gs,makeCloudField as Ws,skyDirection as _s}from"../kit/sky.js";import*as Un from"../kit/water.js";import*as Lo from"../kit/fauna.js";import*as Vo from"../kit/fx.js";import{buildHero as Es,LIGHT_GLSL as pa}from"../parts/gannet-stack-gale.js";const ce=Math.PI*2,lo=["#12161C","#3B4650","#1D564E","#2E9A7E","#F4F0E4","#E3B04B","#7FE6C8"],Be=new t.Vector3(174,0,-207),co=new t.Vector3(178,-18,-215),St=new t.Vector3(292,0,-128),js={golden:{zenith:"#262a2c",mid:"#373c3d",horizon:"#5c6057",ground:"#1a2126",slot:"#E9D9A8",slotK:1,slotPow:3.2,slotFall:10,seaAmb:"#98a8a5",cloudLit:"#9a9888",cloudShade:"#2b3033",coverage:.9,key:"#FFE9C4",keyK:1.22,sky:[.3,.38,.42],shade:[.13,.19,.195],fog:"#56636A",fogD:.0011,deep:"#2a5e56",scatter:"#3f9c7e",foam:"#e9efe9",water:"#0c4a3e",waterDeep:"#03181a",rays:"#f1dca6",rayK:.5,exposure:1.22,tint:"#fff6e8",shadowTint:"#0a1416",sat:1.02,glow:"#000000",moon:!1},dawn:{zenith:"#232528",mid:"#34353a",horizon:"#57555a",ground:"#16181f",slot:"#F2E6A6",slotK:.95,slotPow:3.4,slotFall:7,seaAmb:"#9897a6",cloudLit:"#9c8a8c",cloudShade:"#2a2c2f",coverage:.88,key:"#FFD3C4",keyK:1.12,sky:[.25,.29,.37],shade:[.11,.125,.16],fog:"#5a5863",fogD:.0011,deep:"#2c6264",scatter:"#3fa292",foam:"#efe6e6",water:"#0b443f",waterDeep:"#03151a",rays:"#f6c9b8",rayK:.42,exposure:1.3,tint:"#fff2f0",shadowTint:"#0b1215",sat:1.08,glow:"#000000",moon:!1},day:{zenith:"#2a2f30",mid:"#3f4646",horizon:"#737b78",ground:"#262c2b",slot:"#E3E5DC",slotK:.8,slotPow:2.5,slotFall:5,seaAmb:"#aab6b0",cloudLit:"#b2b8b4",cloudShade:"#2a302f",coverage:.7,key:"#F4F3EA",keyK:1.3,sky:[.36,.4,.4],shade:[.14,.18,.17],fog:"#6f7a78",fogD:.001,deep:"#2b665a",scatter:"#4f9480",foam:"#f0f3ee",water:"#0f5145",waterDeep:"#041d1a",rays:"#e9ebea",rayK:.5,exposure:1.12,tint:"#fbfbf6",shadowTint:"#0a1517",sat:1.06,glow:"#000000",moon:!1},night:{zenith:"#343535",mid:"#353637",horizon:"#393a3c",ground:"#0c0f0f",slot:"#b4bcc6",slotK:.75,slotPow:6,slotFall:8,seaAmb:"#6a766e",cloudLit:"#414549",cloudShade:"#353536",coverage:.86,key:"#D6DCE8",keyK:.95,sky:[.175,.2,.205],shade:[.078,.1,.098],fog:"#42484b",fogD:.0012,deep:"#576f6a",scatter:"#3f9c7e",foam:"#d2d9d6",water:"#0a3d2d",waterDeep:"#03140e",rays:"#c9d0d8",rayK:.34,exposure:1.75,tint:"#f4f6f8",shadowTint:"#0a0c0e",sat:1,glow:"#000000",trail:"#0b5a44",moon:!0}};function Zn(r=!1){const c=new t.Color(lo[4]).multiplyScalar(.86),h=new t.Color(lo[5]);h.setRGB(h.r*.98,h.g*.8,h.b*.5);const X=new t.Color(.02,.02,.025),Y=new t.Color(.36,.45,.52),m=[],E=[],D=[],j=[],U=[],L=(y,S,q,C,$,oe,Q,re=0,ve=0,me=0)=>(m.push(y,S,q),E.push(C,$,oe),D.push(Q.r,Q.g,Q.b),j.push(re,ve,me),m.length/3-1),i=[[-.47,.055,.008,c,c],[-.3,.05,.045,c,c],[-.12,.085,.08,c,c],[.06,.092,.088,c,c],[.2,.07,.068,c.clone().lerp(h,.35),c],[.29,.046,.046,h,c.clone().lerp(h,.5)],[.35,.052,.05,h,h],[.4,.032,.034,Y,Y]],A=[];for(const[y,S,q,C,$]of i){const oe=[];for(let Q=0;Q<6;Q++){const re=Q/6*ce+Math.PI/6,ve=Math.cos(re),me=Math.sin(re);oe.push(L(ve*S,me*q,y,ve,me,0,me>-.2?C:$))}A.push(oe)}for(let y=0;y+1<A.length;y++)for(let S=0;S<6;S++){const q=(S+1)%6;U.push(A[y][S],A[y+1][q],A[y][q],A[y][S],A[y+1][S],A[y+1][q])}const V=L(0,-.004,.535,0,0,1,Y.clone().multiplyScalar(.8));for(let y=0;y<6;y++)U.push(A[A.length-1][y],V,A[A.length-1][(y+1)%6]);const x=[[0,.1,-.12,0,0],[.25,.09,-.11,0,0],[.5,.07,-.1,0,0],[.62,.06,-.09,.7,1],[.82,.04,-.065,1,1],[1,.012,-.02,1,1]];for(const y of[-1,1]){const S=[];for(const[q,C,$,oe,Q]of x){const re=y*(.07+.9*q);S.push([L(re,.02,.05+C,0,1,0,c.clone().lerp(X,oe),y,q,C),L(re,.02,.05+$,0,1,0,c.clone().lerp(X,Q),y,q,$)])}for(let q=0;q+1<S.length;q++)U.push(S[q][0],S[q][1],S[q+1][1],S[q][0],S[q+1][1],S[q+1][0])}if(r){const y=new t.Color(.2,.22,.23),S=L(0,.01,-.36,0,1,0,c),q=[];for(let C=0;C<=4;C++){const $=(C/4-.5)*1.5;q.push(L(Math.sin($)*.3,-.03,-.42-Math.cos($)*.3,0,1,0,c.clone().multiplyScalar(C%2?.82:1)))}for(let C=0;C<4;C++)U.push(S,q[C],q[C+1]);for(const C of[-1,1]){const $=L(C*.045,-.05,-.12,C,0,0,c),oe=L(C*.05,-.2,-.05,C,0,0,y),Q=L(C*.12,-.27,.07,0,0,1,y),re=L(C*.015,-.27,.08,0,0,1,y),ve=L(C*.04,-.07,-.2,C,0,0,c);U.push($,oe,ve,oe,Q,re)}}const T=new t.BufferGeometry;return T.setAttribute("position",new t.BufferAttribute(new Float32Array(m),3)),T.setAttribute("normal",new t.BufferAttribute(new Float32Array(E),3)),T.setAttribute("color",new t.BufferAttribute(new Float32Array(D),3)),T.setAttribute("aW",new t.BufferAttribute(new Float32Array(j),3)),T.setIndex(U),T}function Ks(r,c){const h=new t.Color(c?"#2c3338":"#3c4144"),X=new t.Color(c?"#aeb6b8":"#8a8d88"),Y=[],m=[],E=[],D=[],j=[],U=c?.78:1,L=(T,y,S,q,C,$,oe)=>(Y.push(T,y,S),m.push(q,C,$),E.push(oe.r,oe.g,oe.b),D.push(0,0,0),Y.length/3-1),i=[[-1.2,.03],[-.95,.11],[-.5,.25],[0,.33],[.45,.3],[.75,.2],[.95,.16],[1.1,.11],[1.2,.03]],A=[];for(const[T,y]of i){const S=[];for(let q=0;q<8;q++){const C=q/8*ce,$=Math.cos(C),oe=Math.sin(C),Q=r.range(.75,1.15);S.push(L($*y*U,oe*y*U*.9,T,$,oe,0,h.clone().lerp(X,Ie(.1,-.5,oe)).multiplyScalar(Q)))}A.push(S)}for(let T=0;T+1<A.length;T++)for(let y=0;y<8;y++){const S=(y+1)%8;j.push(A[T][y],A[T+1][S],A[T][S],A[T][y],A[T+1][y],A[T+1][S])}const V=(T,y,S,q,C,$,oe,Q,re)=>{const ve=L(T,y,S,0,1,0,h),me=L(q,C,$,0,1,0,h),Me=L(oe,Q,re,0,1,0,h);j.push(ve,me,Me)};V(0,0,-1.15,.34,.02,-1.5,.05,0,-1.48),V(0,0,-1.15,-.34,.02,-1.5,-.05,0,-1.48),V(.24,-.1,.4,.62,-.2,.2,.26,-.12,.15),V(-.24,-.1,.4,-.62,-.2,.2,-.26,-.12,.15),c&&V(0,.2,.05,0,.6,-.3,0,.21,-.4);const x=new t.BufferGeometry;return x.setAttribute("position",new t.BufferAttribute(new Float32Array(Y),3)),x.setAttribute("normal",new t.BufferAttribute(new Float32Array(m),3)),x.setAttribute("color",new t.BufferAttribute(new Float32Array(E),3)),x.setAttribute("aW",new t.BufferAttribute(new Float32Array(D),3)),x.setIndex(j),x}function Yn(){const r=[],c=[],h=(E,D,j,U)=>{r.push(E[0],E[1],E[2],D[0],D[1],D[2],j[0],j[1],j[2]);for(let L=0;L<3;L++)c.push(U.r,U.g,U.b)},X=(E,D,j,U,L)=>{h(E,D,j,L),h(E,j,U,L)};return{tri:h,quad:X,box:(E,D,j,U,L,i,A,V=1)=>{const x=U/2,T=i/2,y=x*V,S=T*V,q=D-L/2,C=D+L/2,$=[[E-x,q,j-T],[E+x,q,j-T],[E+x,q,j+T],[E-x,q,j+T]],oe=[[E-y,C,j-S],[E+y,C,j-S],[E+y,C,j+S],[E-y,C,j+S]];for(let Q=0;Q<4;Q++)X($[Q],$[(Q+1)%4],oe[(Q+1)%4],oe[Q],A);X(oe[0],oe[1],oe[2],oe[3],A),X($[3],$[2],$[1],$[0],A)},build:()=>{const E=new t.BufferGeometry;return E.setAttribute("position",new t.BufferAttribute(new Float32Array(r),3)),E.setAttribute("color",new t.BufferAttribute(new Float32Array(c),3)),E.computeBoundingSphere(),E}}}function Os(r){const c=Yn(),h=new t.Color("#1c3a31"),X=new t.Color("#6b3a22"),Y=new t.Color("#3c1a14"),m=new t.Color("#d8d6cc").multiplyScalar(.8),E=new t.Color("#3a3630"),D=new t.Color("#15181a"),j=[[-14,2.3,2.3],[-12.5,3.2,2.2],[-8,3.6,2.1],[0,3.7,2.1],[6,3.3,2.5],[10.5,2.1,3.1],[13,.9,3.6],[14.2,.06,3.9]],U=(L,i,A,V)=>[[0,-1.6,L],[V*i*.72,-1.1,L],[V*i,.25,L],[V*i*1.03,A,L],[V*i*.95,A,L],[V*i*.95,A-.9,L],[0,A-.9,L]];for(const L of[-1,1])for(let i=0;i+1<j.length;i++){const A=U(j[i][0],j[i][1],j[i][2],L),V=U(j[i+1][0],j[i+1][1],j[i+1][2],L);for(let x=0;x+1<A.length;x++){const T=x===0?Y:x===1?Y.clone().lerp(h,.5):x===2?h.clone().lerp(X,r()<.45?r.range(.3,.8):.05):x===5?E:x===4?h.clone().multiplyScalar(.7):h;L>0?c.quad(A[x],V[x],V[x+1],A[x+1],T):c.quad(A[x],A[x+1],V[x+1],V[x],T)}}return c.quad([-2.3,.25,-14],[2.3,.25,-14],[2.3*1.03,2.3,-14],[-2.3*1.03,2.3,-14],h.clone().lerp(X,.3)),c.quad([-2.3*.72,-1.1,-14],[2.3*.72,-1.1,-14],[2.3,.25,-14],[-2.3,.25,-14],Y),c.box(0,2.9,-7,4.6,3,5.2,m),c.box(0,4.55,-7,5.2,.3,5.9,E),c.box(0,3.3,-4.38,3.8,.8,.06,D),c.box(2.32,3.3,-6.6,.06,.8,3.4,D),c.box(0,5.6,-8.2,1.3,2.2,1.5,new t.Color("#5a2a1c"),.85),c.box(0,6.5,-8.2,1.2,.4,1.4,D,.95),c.box(0,6.6,5.5,.55,9.5,.55,E,.6),c.box(0,6,3.6,.4,.4,4.4,E),c.box(-2.6,3.9,2.2,.5,4.2,.5,D,.8),c.box(-2.6,3.9,-2.2,.5,4.2,.5,D,.8),c.box(-2.6,5.9,0,.45,.45,5,D),c.box(.6,1.9,1.2,2.4,1.3,1.8,X.clone().multiplyScalar(.8)),c.box(0,1.6,8.5,2.2,.9,2.6,E),c.box(1.4,1.75,-11.6,1.6,.9,2.2,new t.Color("#7a5a22")),c.build()}function Is(r,c,h,X,Y){const m=Yn(),E=new t.Color("#2A2C2E").multiplyScalar(1.3),D=new t.Color(lo[4]).multiplyScalar(.6),j=6,U=16,L=(i,A)=>{const V=A/U*ce,x=i/j,T=h*x*(.75+.35*c.n2(Math.cos(V)*1.3+Y,Math.sin(V)*1.3)),y=X*Math.pow(1-x,.8)*(.7+.5*c.n2(Math.cos(V)*2.1*x+Y,Math.sin(V)*2.1*x+7))-2.5*x*x;return[Math.cos(V)*T*1.5,y,Math.sin(V)*T]};for(let i=0;i<j;i++)for(let A=0;A<U;A++){const V=L(i,A),x=L(i+1,A),T=L(i+1,A+1),y=L(i,A+1),S=(V[1]+T[1])*.5/X;m.quad(V,y,T,x,E.clone().lerp(D,Re(Ie(.35,.8,S)*r.range(.5,1.1),0,1)).multiplyScalar(r.range(.8,1.1)))}return m.build()}function Qs(){const r=new t.Color("#3d4850"),c=new t.Color("#66757d"),h=new t.Color("#0c0f11"),X=new t.Color("#d9d6c8").multiplyScalar(.84),Y=new t.Color("#39413f"),m=new t.Color("#e2dfd2").multiplyScalar(.9),E=[[6.5,.04],[6.2,.27],[5.6,.52],[4.6,.86],[3.3,1.26],[1.6,1.62],[0,1.76],[-1.6,1.72],[-3.2,1.5],[-5,1.1],[-6.5,.5]],D=36,j=[],U=[],L=[];for(let V=0;V<E.length;V++)for(let x=0;x<D;x++){const[T,y]=E[V],S=x/D*ce,q=Math.sin(S),C=Math.cos(S),$=Ie(.05,-.35,q),oe=1+.22*$*Ie(-5,2,T)*Ie(6.5,3.5,T);j.push(C*y*(1+.08*$),q*y*(q<0?1.12*oe:.8),T);const Q=$*Ie(-4.5,-2,T)*Ie(6.2,5,T)*(x%2),re=(1-Ie(0,.1,Math.abs(q+.02)))*Ie(1.2,2.8,T),ve=(1-Ie(.05,.15,Math.abs(q+.17)))*Ie(.6,2.2,T),me=r.clone().lerp(c,Ie(.5,-.05,q)*.8).lerp(X,$).lerp(Y,Q*.8).lerp(m,ve*.9).lerp(h,re*.85);U.push(me.r,me.g,me.b)}for(let V=0;V+1<E.length;V++)for(let x=0;x<D;x++){const T=V*D+x,y=V*D+(x+1)%D,S=T+D,q=y+D;L.push(T,S,y,y,S,q)}const i=V=>{const x=j.length/3,T=new t.Color("#d6dbd8").multiplyScalar(.8),y=[[1.45,-.55,2.2,r],[1.5,-.6,.3,r],[3,-1,1.3,T],[3,-1.05,0,T],[4.7,-1.45,-.9,r]];for(const[S,q,C,$]of y)j.push(V*S,q,C),U.push($.r,$.g,$.b);L.push(x,x+1,x+2,x+1,x+3,x+2,x+2,x+3,x+4)};i(1),i(-1);const A=new t.BufferGeometry;return A.setAttribute("position",new t.BufferAttribute(new Float32Array(j),3)),A.setAttribute("color",new t.BufferAttribute(new Float32Array(U),3)),A.setIndex(L),A.computeVertexNormals(),A.computeBoundingSphere(),A}const nn=`
uniform vec4 uWA[18], uWB[18]; uniform float uSeaT, uSpacing, uR0, uSeaRad; uniform vec3 uSeaC; uniform vec4 uShoal;
vec3 gsDisp(vec2 xz) {
  float r = length(xz - uSeaC.xz), sp = (r + uR0) * uSpacing; vec3 d = vec3(0.);
  for (int i = 0; i < 8; i++) { vec4 a = uWA[i], b = uWB[i]; float f = smoothstep(2., 4.5, b.w / max(sp, 1e-4));
    float th = a.z * dot(a.xy, xz) - a.w * uSeaT + b.z; float c = cos(th), s = sin(th);
    d.xz += a.xy * (b.y * b.x * c * f); d.y += b.x * s * f; }
  d *= 1. - smoothstep(.3 * uSeaRad, .8 * uSeaRad, r);
  d *= mix(uShoal.w, 1., smoothstep(0., 1., (length(xz - uShoal.xy) - uShoal.z) / 30.));
  return d;
}
float gsSeaY(vec2 xz) { vec2 p = xz; for (int k = 0; k < 3; k++) { vec3 d = gsDisp(p); p += (xz - d.xz - p) * .85; } return gsDisp(p).y; }`,Ot=`
float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }`,Hs=`
float gsFog() {
  #ifdef FOG_EXP2
    return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    return 0.;
  #endif
}`,Xs=`
uniform vec3 uOpenSea; uniform vec4 uPool[4]; uniform vec4 uPoolLean; uniform vec3 uPoolCol;
const float GS_MK = .6, GS_C0 = .45, GS_C1 = .6;      // the mirror's limit (a share of the look's own angle); the patch's outline where the large lace is not drawn (the foam amount it turns over)
float gsPh(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float gsPn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(gsPh(i), gsPh(i + vec2(1., 0.)), f.x), mix(gsPh(i + vec2(0., 1.)), gsPh(i + vec2(1., 1.)), f.x), f.y); }
vec3 gsPool(vec2 xz) {
  float m = 0., n = .5 * (gsPn(xz * .011 + uPoolLean.w * .021) - .5) + .2 * (gsPn(xz * .045 - uPoolLean.w * .05) - .5);
  for (int i = 0; i < 4; i++) { vec2 d = xz - uPool[i].xy; vec2 q = vec2(d.x * uPoolLean.y - d.y * uPoolLean.x, (d.x * uPoolLean.x + d.y * uPoolLean.y) / max(uPoolLean.z, 1.)) / max(uPool[i].z, 1.);
    m += uPool[i].w * (1. - smoothstep(.4, 1., length(q) + n)); }
  return uPoolCol * min(m, 1.25);
}
// the kit's lace at one size (kitLace, its cells and its numbers), with two changes. sc: cells to the metre; foot, pixm: one pixel on the water along the
// look and across it (m); lk: the level direction from the water to the eye, in the lace's own frame; fv: what stands where the size is not drawn.
// - A wall's edge is softened by the footprint ALONG THE WALL'S OWN NORMAL (the kit took the long footprint for every wall: at a flat look the
//   walls that run toward the eye, which the picture resolves, were blurred with the rest, and the lace was a smear drawn out across the picture).
// - Where a cell is smaller than the footprint the kit drew the lace's mean, a smooth grey film; here fv stands there.
float gsLace(vec2 p, float m, float sc, float foot, float pixm, vec2 lk, float fv) {
  float fr = foot*sc; if(fr>1.6) return fv;
  p += .13*sin(p.yx*4.7+vec2(1.3,4.1))+.06*sin(p.yx*11.3+2.);
  vec2 i = floor(p), f = fract(p), r1 = vec2(1.,0.); float d1 = 8.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g = vec2(float(x),float(y)); vec2 r = g+h22(i+g)-f; float d = dot(r,r); if(d<d1){ d1 = d; r1 = r; } }
  d1 = sqrt(d1); float gl = dot(r1,lk)/max(d1,1e-4), g2 = min(gl*gl,1.);
  float r = .74*(1.-m), aa = .04+.09*(1.-m)+.6*sc*sqrt(foot*foot*g2+pixm*pixm*(1.-g2));
  float v = d1+.07*sin(p.x*17.+p.y*13.)*sin(p.y*19.-p.x*7.);
  return mix(smoothstep(r-aa, r+aa, v), fv, smoothstep(.7,1.6,fr)); }
void main(){
  vec3 toCam = cameraPosition-vWorld; float dist = length(toCam); vec3 V = toCam/dist;
  float foot = dist*kitPix()/max(abs(V.y),.03);           // pixel footprint along the view direction (m)
  #ifdef KIT_DEPTHMAP
    // sea that the depth map puts well under the land is never shaded (it is hidden by the terrain anyway)
    vec2 duv = (vXZ-uDepthRect.xy)*uDepthRect.zw;
    if(gl_FrontFacing && min(min(duv.x,duv.y),min(1.-duv.x,1.-duv.y))>0. && texture2D(uDepthTex,duv).r<-uLand) discard;
  #endif
  vec2 slope = vec2(0.); float q = 0., lost = 0.; vec3 j0 = vec3(0.), j1 = vec3(0.), j2 = vec3(0.);
  vec2 wq = vec2(vnoise(R2*vXZ*.05+uTime*.03), vnoise(R1*vXZ*.14-uTime*.05))-.5;       // bends the ripple crests
  float wq2 = vnoise(R2*vXZ*.41+uTime*.09)-.5;
  float gust = .5+vnoise(vXZ*.0065+uTime*.012)+.4*(wq.x+.5);                           // wind patches: rougher and smoother water
  int nf = gl_FrontFacing ? NF : NW+4;                    // the underside needs fewer ripples
  for(int i=0;i<NF;i++){ if(i>=nf) break; vec4 a=uWA[i], b=uWB[i];
    float ka = a.z*b.x, f0 = smoothstep(1.2,4.,b.w/foot), g = i<NW ? 1. : gust*uDetail;
    if(f0<=0.){ lost += ka*ka*.5*g*g; continue; }
    float th = a.z*dot(a.xy,vXZ)-a.w*uTime+b.z;
    int m3 = i-(i/3)*3; float e = m3==0 ? wq.x : m3==1 ? wq.y : -wq.x-wq.y;        // wave groups: crests are short, not endless lines
    if(i>=NW){ float ee = i<NW+3 ? wq.x : (i<NW+6 ? wq.y : wq2); if((i&1)==1) ee = -ee;      // each ripple train lives in its own patches, a few wavelengths across
      th += ((i&1)==0 ? wq.x : wq.y)*6.+((i&2)==0 ? wq2 : wq.y-wq2)*min(a.z*1.3,7.);       // crests wander: no ruled lines
      g *= .12+1.8*smoothstep(-.28,.28,ee); }
    else if(i>=3){ float sm = smoothstep(16.,6.,b.w);                                // short geometry waves break into groups too
      th += ((i&1)==0 ? wq.x : wq.y)*mix(1.2,5.,sm); g *= clamp(1.+mix(1.9,3.4,sm)*e,mix(.3,.08,sm),2.)*mix(1.,smoothstep(.55,1.5,gust)*1.5,sm); }   // and leave glassy slicks between the gusts
    float c=cos(th), s=sin(th), f=f0*g;
    slope += a.xy*(ka*c*f); lost += (1.-f0*f0)*ka*ka*.5*g*g;
    if(i<NW){ float qa=b.y*ka*f, qs=qa*s; q += qs; vec3 dd=vec3(a.x*a.x,a.y*a.y,a.x*a.y);
      j0 += dd*qs; j1 += dd*(qa*(s*.7648+c*.6442)); j2 += dd*(qa*(s*.0707+c*.9975)); } }      // fold now, .7 and 1.5 rad ago
  // micro ripples close to the eye
  float f1 = smoothstep(.6,3.,.9/foot), f2 = smoothstep(.6,3.,.28/foot);
  if(f1>0.){ vec3 n1 = noised(R1*vXZ*1.1+uTime*vec2(.4,.25)), n2 = noised(R2*vXZ*3.6-uTime*vec2(.55,-.4)+n1.x*1.2);
    slope += uDetail*gust*((n1.yz*R1)*.15*f1+(n2.yz*R2)*.11*f2); }
  lost += uDetail*uDetail*gust*gust*((1.-f1)*.004+(1.-f2)*.0025);
  vec3 N = normalize(vec3(-slope.x, 1.-q, -slope.y));
  if(!gl_FrontFacing){                                   // seen from below
    float net = pow(1.-min(abs(slope.x-slope.y)*3.,1.),3.);
    vec3 uc = kitUnderside(-V, -N, dist, net);
    uc = mix(uc, uUwWater, max(smoothstep(0.,.8,kitFog()), 1.-smoothstep(0.,.09,abs(V.y))));      // the far underside melts into the murk: no seam
    gl_FragColor = vec4(uc,1.);
    #include <fog_fragment>
    return; }
  float alpha = sqrt(uRough*uRough+2.*max(lost,0.));
  // CURE 1 (this world's): the mirror reads no face the eye cannot see. tl is the face's lean toward the eye (under 0: turned from it); a face
  // turned from the eye by the look's own angle or more lies hidden behind the crest before it. The lean the mirror reads never passes GS_MK of
  // that angle: it follows the face's own while that is small and closes on the limit smoothly (no flat patch). Nm is for the mirror alone.
  float pixm = foot*max(abs(V.y),.03), vl = max(length(V.xz),1e-4); vec2 lk = V.xz/vl; vec3 Nm = N;
  float tl = dot(N.xz,lk)/max(N.y,.001), te = GS_MK*max(V.y,.02)/vl;
  if(tl<0.){ float k = (te*(exp(tl/te)-1.)-tl)*N.y; Nm = normalize(vec3(N.x+lk.x*k, N.y, N.z+lk.y*k)); }
  float ndv = max(dot(Nm,V),0.);
  // reflection of the sky; rough far water tilts the mean reflection upward
  vec3 R = reflect(-V,Nm); R.y = abs(R.y); R = normalize(R+vec3(0.,alpha*.9,0.));
  vec3 refl = kitSky(R)*uReflect;
  float F = .02+.98*pow5(1.-ndv); F *= 1./(1.+alpha*1.6);
  // body colour: deep water lit by sky and sun, dark troughs, light scattering through the crests
  vec3 amb = kitAmbient(); float ndl = max(dot(N,uSunDir),0.);
  float crest = smoothstep(-.35,1.,vH);
  float toward = pow(clamp(dot(-V,uSunDir)*.5+.5,0.,1.),3.);
  vec3 body = uDeep*(amb*.9+uSunColor*(.08+.24*ndl));
  body *= mix(1., .5+.5*smoothstep(-1.,.25,vH), uContrast);
  body += uScatter*(amb*(.16+.2*uContrast)+uSunColor*(.04+.3*toward))*crest*crest*(.4+.6*clamp((1.-N.y)*14.,0.,1.))*(.3+.7*exp(-dist*.004));
  vec2 sh = kitShoal(vXZ); float shal = 1.-smoothstep(0.,1.,sh.x);
  float ft = fbm2(R1*vXZ*.33+vec2(uTime*.05,0.));
  float ring = 0.;
  if(sh.x<.6){ float lap = sin(sh.x*sh.y*.55+uTime*1.1+ft*7.)*.5+.5;                    // swash running up the shore
    ring = (1.-smoothstep(0.,.55,sh.x))*smoothstep(-.1,.04,sh.x)*smoothstep(.45,.95,lap*.6+ft*.75+(1.-smoothstep(0.,.2,sh.x))*.4); }
  body = mix(body, uShallowColor*(amb+uSunColor*(.1+.26*ndl)), shal*.62);
  vec3 gsPl = gsPool(vXZ); body *= 1. + 1.7 * gsPl; vec3 col = mix(body, refl, F);
  // sun: sharp glints up close, a glittering path far away
  vec3 spec = kitSunSpec(N,V,alpha,60.);
  float gl = kitGlitter(vXZ, dist*kitPix()*3./sqrt(max(V.y,.03)));
  spec *= mix(1., .2+9.*gl, uGlitter*smoothstep(.0,.06,alpha));
  // foam: born where the surface folds (jacobian of the gerstner displacement), ageing into lace behind the crest
  float fa = 0.;
  float J0 = (1.-j0.x)*(1.-j0.y)-j0.z*j0.z, J1 = (1.-j1.x)*(1.-j1.y)-j1.z*j1.z, J2 = (1.-j2.x)*(1.-j2.y)-j2.z*j2.z, gsFT = uFoamT-uOpenSea.z*smoothstep(uOpenSea.x,uOpenSea.y,length(vXZ)), fT = gsFT-.25*uSteep;
  float m = max(smoothstep(gsFT,fT,J0), max(smoothstep(gsFT,fT,J1)*.62, smoothstep(gsFT,fT,J2)*.36))*uFoam;
  vec2 wd = uWA[0].xy; vec2 ws = vec2(dot(vXZ,wd),dot(vXZ,vec2(-wd.y,wd.x)));
  m += uFoam*.3*smoothstep(.6,1.,crest)*smoothstep(.95,1.5,gust);                        // whitecaps flicker in the gusts
  float row = 1.-abs(2.*vnoise(ws*vec2(.014,.2)+vec2(uTime*.02,ft*1.5))-1.);              // wind rows in heavy seas
  m += uFoam*uFoam*.42*pow(row,6.)*smoothstep(-.5,.5,vH);
  m = max(m, ring);
  if(m>.004){
    vec2 fp = vXZ+wd*uTime*.3, wv = vec2(ft-.5, wq.y)*1.2;
    float mm = clamp(m*(.5+1.1*fbm2(ws*vec2(.045,.15)+vec2(uTime*.02,3.)+wv)),0.,.94);     // patchy, drawn out along the wind
    // CURE 2 (this world's): the lace by gsLace (see it); the large lace gives way to the patch's own crisp outline, the fine one to open water
    float cov = max(gsLace(fp*.42+wv, mm, .42, foot, pixm, lk, smoothstep(GS_C0,GS_C1,mm)), gsLace(R1*fp*1.5+wv*2., mm*.9, 1.5, foot, pixm, R1*lk, 0.));
    float footT = sqrt(foot*pixm);      // (cure 2) the foam's inner texture is drawn by the mean of the footprint's two axes (the kit took the long one: a patch seen at a flat look was a blank sheet)
    float dense = smoothstep(.3,.9,mm), lt = smoothstep(.5,2.5,.4/footT), lt2 = smoothstep(.5,2.5,.12/footT);
    // thick foam is marbled: wind-drawn veins of green water open through it, so a breaking crest is never a flat white sheet
    float lt0 = smoothstep(.5,2.5,2.4/footT), mar = 1.-abs(2.*fbm2(ws*vec2(.085,.3)+wv*2.2+vec2(uTime*.05,7.))-1.);
    float mar2 = 1.-abs(2.*vnoise(R1*fp*.55+wv*3.+4.)-1.);
    cov *= max(0., 1.-dense*lt0*(.8*smoothstep(.66,.95,mar)+.45*smoothstep(.72,.97,mar2)*lt));   // never below zero: where both veins cross in dense foam the cover went negative (a few dark pixels along a surf line)
    float bub = mix(.5, kitCell4(R2*fp*2.3+wv).x*1.6, lt);                                 // bubble clusters: thick foam is never a flat sheet
    float tex = (.84+.16*bub)*(.8+.4*mix(.5, fbm2(R1*fp*1.3+wv*3.), lt))*(.94+.12*mix(.5, vnoise(R1*fp*9.), lt2))*(.84+.16*crest);
    fa = cov*(.7+.3*dense)*(.9+.1*mix(1.,bub*1.6,dense));
    fa *= mix(1., mix(min(.3+1.1*fbm2(R2*fp*2.7+wv*2.),1.), 1., dense), lt);                       // flecks are ragged and uneven, not paper cut-outs
    vec3 fc = mix(mix(uScatter,uFoamColor,.5), uFoamColor, dense)*(amb+uSunColor*(.05+.2*mix(ndl,uSunDir.y,.65)))*tex;
    col = mix(col, fc, fa); }
  col += spec*(1.-fa)*(1. + 3. * gsPl * smoothstep(.05, .25, V.y));
  col += uGlow*(fa*1.5+pow(crest,4.)*.25);
  // horizon: dissolve into the sky seen in that direction
  float hf = smoothstep(uFadeA,uFadeB,length(vWorld.xz-cameraPosition.xz)); hf = hf*hf*(3.-2.*hf);
  vec3 hz = mix(kitAtmo(normalize(vec3(-V.x,.004,-V.z))), uHorizonColor, uHorizonMix);
  col = mix(col, hz, hf);
  col = max(col, 0.); gl_FragColor = vec4(col,1.);
  #ifdef USE_FOG
    gl_FragColor.rgb = mix(col, mix(fogColor, hz, hf), kitFog());
  #endif
}`,Ct={stream:{pars:"",main:`
    float s = iA.w, L = iB.w, d = mod(t * iB.z + s * L * 7.3, L) - .5 * L;
    vec3 D = vec3(iB.x, 0., iB.y);
    C = iA.xyz + D * d + vec3(0., 1.6 * sin(t * .6 + s * 40.) + .8 * sin(t * 1.7 + s * 9.), 0.) + vec3(-D.z, 0., D.x) * 1.2 * sin(t * .45 + s * 23.);
    fw = normalize(D + vec3(0., .12 * cos(t * .6 + s * 40.), 0.));
    vis = 1. - smoothstep(.5 * L - 22., .5 * L, abs(d));
    bank = .3 * sin(t * .45 + s * 23. + 1.57);
    A = mix(.1, .75, smoothstep(.1, .5, sin(t * .43 + s * 20.) + .35 * sin(t * 1.1 + s * 5.))); ph = t * 22. + s * 100.;
    tint = step(fract(s * 53.7), uJuv); size = 1.25 + .25 * fract(s * 31.);`},escort:{pars:"uniform vec3 uCam, uPF, uPR, uPU, uHead; uniform vec4 uEsc; uniform float uPart;",main:`
    float s = iA.w, kind = iB.x, pres = kind < .5 ? uEsc.x : uEsc.z, away = (1. - pres) * (1. - pres), skew = 0.;
    vec3 o = iA.xyz;
    if (kind < .5) {
      float dive = smoothstep(.35, 1., uEsc.y), spear = clamp(uEsc.y - 1., 0., 1.);
      float calm = 1. - .7 * smoothstep(.5, 1.5, uEsc.y);
      o += vec3(.9 * sin(t * .6 + s * 30.), .6 * sin(t * .8 + s * 17.), 1.4 * sin(t * .4 + s * 9.)) * calm;
      float sg = o.x < 0. ? -1. : 1.;
      o.x += uPart * 9. * step(0., o.x); o.y += uPart * 2.5 * step(0., o.x);      // (rare) the right wing opens a window on the whale
      o.x *= 1. + 4. * away; o.y += 14. * away * (fract(s * 7.) - .2) - o.z * uEsc.w; o.z -= 26. * away * fract(s * 3.);      // uEsc.w: on the hang they fly under the path's level
      fold = uEsc.y; tint = step(fract(s * 53.7), uJuv);
      A = mix(.1, .7, smoothstep(.1, .5, sin(t * .43 + s * 20.))); ph = t * 22. + s * 100.;
      bank = .2 * sin(t * .6 + s * 30. + 1.57) + (-sg * (.95 + .7 * (fract(s * 13.) - .5)) + .3 * sin(t * .9 + s * 21.)) * dive * (1. - .4 * spear);      // each rolled its own way, back toward us
      size = mix(iB.z, 1.9 - .2 * iB.w, dive);
      skew = dive * (1. - spear);
    } else {
      float lag = kind > 1.5 ? .5 : 0.;
      o += vec3(2.6 * sin(t * 1.7 - lag) + 1.2 * sin(t * 2.9 - lag * 1.4), 1.5 * sin(t * 2.3 - lag) + .6 * sin(t * 3.7 - lag), 1.5 * sin(t * 1.1 - lag));
      o.z += 45. * away; o.y += 5. * away;
      tint = iB.y; A = .8; ph = t * (kind > 1.5 ? 27. : 23.) + s * 100.;
      bank = -.55 * cos(t * 1.7 - lag);
    }
    C = uCam + uPR * o.x + uPU * o.y + uPF * o.z;
    fw = normalize(uHead + uPR * (.06 * sin(t * .7 + s * 12.) + (fract(s * 29.) - .5) * .3 * skew) + uPU * (fract(s * 37.) - .35) * .3 * skew);      // they head as the path heads
    upRef = normalize(vec3(0., 1., 0.) - uHead * uHead.y + vec3(0., 1e-4, 0.)); vis = smoothstep(0., .3, pres); if (kind > .5) size = iB.z;`},diver:{pars:`
    vec3 gsDiver(float c, vec2 S, vec2 T, float h, float rho, float X, float t, float s) {
      vec2 N = vec2(T.y, -T.x), K = S - T * X + N * rho;
      float q = clamp((c - .75) / .25, 0., 1.), al = (min(c, .75) - .75) / .75 * 6.2832;
      vec2 xz = K + rho * (-N * cos(al) + T * sin(al));
      xz = mix(xz, S - T * X * (1. - q) * (1. - q), step(.75, c));
      float y = h * (1. - q * q) + 2. * sin(t * .5 + s * 30.) * (1. - smoothstep(.55, .75, c));
      return vec3(xz.x, y, xz.y);
    }`,main:`
    float s = iA.w, per = iB.x, c = fract(t / per + s * 17.);
    vec2 S = iA.xy, T = vec2(cos(iB.z), sin(iB.z));
    vec3 P0 = gsDiver(c, S, T, iA.z, iB.y, iB.w, t, s), P1 = gsDiver(c + .004, S, T, iA.z, iB.y, iB.w, t, s);
    float q = clamp((c - .75) / .25, 0., 1.);
    C = P0 + vec3(0., gsSeaY(S), 0.); fw = normalize(P1 - P0 + vec3(1e-4, 0., 0.));
    fold = smoothstep(.02, .3, q) + smoothstep(.55, .8, q);
    vis = smoothstep(0., .04, c) * (1. - step(.996, c));
    bank = .45 * (1. - smoothstep(0., .2, q));
    A = mix(.1, .7, smoothstep(.1, .5, sin(t * .43 + s * 20.))); ph = t * 22. + s * 100.;
    tint = step(fract(s * 53.7), uJuv); size = 1.3;`},lander:{pars:"uniform vec3 uWindDir;",main:`
    float s = iA.w, cy = fract(t / iB.z + s * 13.), e = smoothstep(0., .78, cy);
    vec3 o3 = vec3(iB.x, 0., iB.y);
    C = iA.xyz + o3 * mix(3.3, .25, e) + vec3(-o3.z, 0., o3.x) * (.8 * sin(t * 1.3 + s * 17.) * (1. - .7 * e) + 2.2 * (1. - e))
      + vec3(0., mix(4.2, -.85, e * e) + .45 * sin(t * 1.9 + s * 9.) * (1. - .7 * e), 0.);
    fw = normalize(-uWindDir + vec3(0., .32 + .3 * e, 0.));
    vis = smoothstep(0., .08, cy) * (1. - smoothstep(.93, 1., cy));
    bank = .26 * sin(t * 2.1 + s * 4.) * (1. - .5 * e);
    A = .34 + .14 * e; ph = t * 29. + s * 100.; dih = .42;
    tint = 0.; size = 1.32;`},flush:{pars:"uniform float uFlush;",main:`
    float s = iA.w, k = clamp(uFlush * (1.15 + .5 * fract(s * 7.)) - .12 * fract(s * 3.), 0., 1.), tt = k * 3.2;
    vec2 D = vec2(cos(iA.z), sin(iA.z));
    float run = tt * (6.5 + 4.5 * fract(s * 11.)), lift = .4 + tt * (2.4 + 2. * fract(s * 5.)) + .5 * sin(t * 1.1 + s * 9.) * k;
    C = vec3(iA.x + D.x * run, gsSeaY(iA.xy) + lift, iA.y + D.y * run);
    fw = normalize(vec3(D.x, .4 * (1. - .6 * k), D.y));
    vis = smoothstep(0., .06, k) * (1. - smoothstep(.9, 1., uFlush));
    bank = .4 * sin(s * 40. + t * 1.4); A = .8; ph = t * 26. + s * 100.;
    tint = step(fract(s * 53.7), uJuv); size = 2.6 * (1.5 - .5 * smoothstep(.05, .4, k));`},cross:{pars:"uniform vec4 uLine;",main:`
    float s = iA.w, cyc = t / iA.x + s * 13., gen = floor(cyc), tt = fract(cyc);
    float side = gh(gen * .731 + s * 91.) < .5 ? -1. : 1., z0 = mix(58., 306., gh(gen * 1.37 + s * 47.)), y0 = mix(2.4, 8.2, gh(gen * 2.11 + s * 29.));
    vec2 xz = vec2(40. + iA.z + side * (tt - .5) * iA.y, z0 - 18. * (tt - .5));
    C = vec3(xz.x, y0 + .7 * gsSeaY(xz) + 1.3 + .35 * sin(t * 2.6 + s * 9.), xz.y);
    // THE CLEAR AIR, by place: over the route's line (uLine, read from the path at the build) a crosser passes at
    // least 4.1 m above it (2.35 m of air and its own half span), rising to that from 45 m off and easing down again
    float ln = clamp((abs(xz.x - uLine.x) - 5.) / 40., 0., 1.), over = max(uLine.y + uLine.z * (1. - smoothstep(45., uLine.w, xz.y)) - C.y, 0.);
    C.y += over * (1. - ln * ln * (3. - 2. * ln));
    fw = normalize(vec3(side * iA.y, 0., -18.) + vec3(0., 4. * cos(t * 2.6 + s * 9.) - sign(xz.x - uLine.x) * side * iA.y * over * 6. * ln * (1. - ln) / 40., 0.)); vis = smoothstep(0., .07, tt) * (1. - smoothstep(.93, 1., tt));
    bank = -side * (.25 + .1 * sin(t * 2.3 + s * 5.)); A = mix(.15, .6, smoothstep(-.2, .5, sin(t * .5 + s * 20.))); ph = t * 21. + s * 100.; size = 1.5 + .3 * fract(s * 31.);
    tint = step(fract(s * 53.7), uJuv);`},raft:{pars:"",main:`
    float s = iA.w, off = iA.x - 40., goes = step(fract(s * 7.7), 1. - smoothstep(11., 21., abs(off)));
    float tt = max((34. - (uSeaC.z - iA.y)) / 27.3 - .5 * fract(s * 3.3) - .03 * abs(off), 0.) * goes;
    float up1 = smoothstep(0., .22, tt), t1 = min(tt, 1.5), run = 3.6 * t1 * t1 + 10.8 * (tt - t1);
    vec2 D = normalize(vec2((off < 0. ? -1. : 1.) * (.3 + .5 * fract(s * 11.)), -1.)), S = iA.xy + D * run;
    float lift = (1. - exp(-tt * 1.6)) * (2.4 + 2.6 * fract(s * 5.)) + .3 * sin(t * 1.3 + s * 9.) * up1;
    C = vec3(S.x, gsSeaY(S) + .1 + lift, S.y);
    float yaw = iA.z + .3 * sin(t * .5 + s * 20.);
    fw = normalize(mix(vec3(sin(yaw), .16, cos(yaw)), vec3(D.x, .5 - .35 * smoothstep(.3, 1.6, tt), D.y), smoothstep(0., .45, tt)));
    fold = 2. * (1. - up1); bank = mix(.12 * sin(t * 1.3 + s * 33.), .45 * sin(s * 40. + t * 1.9), up1);
    A = .85; ph = t * 27. + s * 100.; size = 1.4; vis = 1. - smoothstep(4.5, 5.5, tt);
    tint = step(fract(s * 53.7), uJuv);`},swim:{pars:"uniform float uLeap;",main:`
    float s = iA.w, dir = fract(s * 5.) > .5 ? 1. : -1., a = t * (.25 + .2 * fract(s * 9.)) * dir + s * 40.;
    vec2 S = iA.xy + iA.z * vec2(cos(a), sin(a));
    float lp = sin(t * 1.9 + s * 30.), leap = max(lp, 0.);
    C = vec3(S.x, gsSeaY(S) - .14 + uLeap * (leap * 1.7 - .5) + .12 * sin(t * 1.1 + s * 7.), S.y);
    vec2 tg = vec2(-sin(a), cos(a)) * dir;
    fw = normalize(vec3(tg.x, uLeap * cos(t * 1.9 + s * 30.) * .9 + (1. - uLeap) * .25 * sin(t * .7 + s * 3.), tg.y));
    bank = (1. - uLeap) * (1.3 * sin(t * .8 + s * 12.) + .8 * sin(t * .37 + s * 5.));
    size = iB.x;`}};function Pt(r,c){const h=new t.ShaderMaterial({side:t.DoubleSide,fog:!0,vertexColors:!0,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog]),vertexShader:`
      attribute vec3 aW; attribute vec4 iA, iB;
      uniform float uTime, uJuv;
      varying vec3 vCol, vN, vV; varying float vWing;
      ${nn}
      float gh(float p) { p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
      ${c.pars}
      #include <fog_pars_vertex>
      void main() {
        vec3 C = vec3(0.), fw = vec3(0., 0., 1.), upRef = vec3(0., 1., 0.);
        float bank = 0., fold = 0., A = 0., ph = 0., vis = 1., tint = 0., size = 1.3, dih = 0., t = uTime;
        ${c.main}
        vec3 p = position, n = normal; float sx = aW.x;
        if (abs(sx) > .5) {
          float sp = aW.y, ch = aW.z, f1 = min(fold, 1.), f2 = clamp(fold - 1., 0., 1.);
          float phi1 = mix(.5 * f1, -1.15, f2), phi2 = mix(1.05 * f1, 1.45, f2);
          vec2 d1 = vec2(cos(phi1), sin(phi1)), d2 = vec2(cos(phi2), -sin(phi2)), dd = sp < .5 ? d1 : d2;
          float s1 = min(sp, .5) * 2., s2 = max(sp - .5, 0.) * 2.;
          vec2 q = d1 * (.42 * s1) + d2 * (.48 * s2) + vec2(-dd.y, dd.x) * ch * (1. - .3 * f2);
          float Af = A * (1. - .85 * f1), a1 = Af * sin(ph) + .08 + dih, a2 = a1 + Af * .9 * sin(ph - .9) - .22 * f1 * (1. - f2);
          float xw = .42 * d1.x, an = sp < .5 ? a1 : a2;
          float X = sp < .5 ? q.x * cos(a1) : xw * cos(a1) + (q.x - xw) * cos(a2);
          float Y = sp < .5 ? q.x * sin(a1) : xw * sin(a1) + (q.x - xw) * sin(a2);
          p = vec3(sx * (.07 + X), .02 + Y, .05 + q.y); n = vec3(-sx * sin(an), cos(an), 0.);
        }
        p.y -= .1 * A * sin(ph) * (1. - min(fold, 1.));
        fw = normalize(fw + vec3(0., 0., 1e-5));
        vec3 rt = normalize(cross(upRef, fw) + vec3(1e-5, 0., 0.)), up = cross(fw, rt);
        float cb = cos(bank), sb = sin(bank); vec3 r2 = rt * cb + up * sb, u2 = up * cb - rt * sb;
        size *= vis;
        vec3 wp = C + (r2 * p.x + u2 * p.y + fw * p.z) * size;
        vN = r2 * n.x + u2 * n.y + fw * n.z; vV = wp - cameraPosition;
        vec3 col = color;
        if (tint > 2.5) col = abs(sx) > .5 ? vec3(.03) : mix(col, vec3(.8), .5);
        else if (tint > 1.5) col = vec3(.075, .055, .045) * (1. + 5. * step(.55, aW.y) * step(aW.y, .7) * abs(sx));
        else if (tint > .5) col = mix(vec3(.13, .09, .065) * (.6 + .9 * gh(position.z * 91. + position.x * 37.)), col, .1);
        vCol = col; vWing = abs(sx);
        vec4 mvPosition = viewMatrix * vec4(wp, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vCol, vN, vV; varying float vWing;
      ${pa}
      #include <fog_pars_fragment>
      void main() {
        vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(n, vV) > 0.) n = -n;
        n = normalize(n + uSunDir * .35 * vWing);
        // (whites are held: the brightest channel stops at 0.9, so a flock in the low key keeps its form and is not a blot of bloom)
        vec3 c = gsLight(vCol, n, 1.); c *= min(1., .9 / max(max(c.r, max(c.g, c.b)), 1e-3));
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`});return Object.assign(h.uniforms,r),h}function $n(r,c=.3,h=!1,X=0){const Y=new t.ShaderMaterial({side:t.DoubleSide,fog:!0,vertexColors:!0,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{uWet:{value:c},uAmb:{value:X}}]),vertexShader:`
      varying vec3 vCol, vV, vNw, vOb;
      #include <fog_pars_vertex>
      void main() {
        vCol = color; vOb = position; vNw = ${h?"normalize(mat3(modelMatrix) * normal)":"vec3(0., 1., 0.)"};
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        vV = mvPosition.xyz; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uWet, uAmb, uSeaT;
      varying vec3 vCol, vV, vNw, vOb;
      ${pa}
      ${h?Ot:""}
      #include <fog_pars_fragment>
      void main() {
        vec3 vd = normalize((vec4(-normalize(vV + vec3(0., 0., -1e-6)), 0.) * viewMatrix).xyz), hv = normalize(uSunDir + vd);
        ${h?"vec3 n = normalize(vNw + vec3(0., 1e-5, 0.)); if (dot(n, vd) < 0.) n = -n;":"vec3 nv = normalize(cross(dFdx(vV), dFdy(vV)) + vec3(0., 0., 1e-9)); vec3 n = normalize((vec4(nv, 0.) * viewMatrix).xyz);"}
        float fres = pow(max(1. - max(dot(n, vd), 0.), 0.), 4.);
        float spec = uWet * (pow(max(dot(n, hv), 0.), 30.) * 1.2 + .06 * fres);
        vec3 alb = vCol;
        ${h?`// water streaming off it: white runs sliding tailward down the flanks, thickest low on the body
        float runs = vn(vec2(vOb.x * 5.3 + vOb.y * 7.1, vOb.z * .3 + uSeaT * 1.9)) * .6 + vn(vec2(vOb.x * 13.1 - vOb.y * 9.7, vOb.z * .7 + uSeaT * 3.1)) * .4;
        alb = mix(alb, vec3(.78, .84, .82), smoothstep(.56, .74, runs) * (.3 - .18 * smoothstep(-5., 4., vOb.z)));`:""}
        gl_FragColor = vec4(gsLight(alb, n, 1.) + alb * uSkyCol * uAmb + uSunCol * spec + uSkyCol * uWet * (.05 + ${h?".5":"0."} * fres), 1.);
        #include <fog_fragment>
      }`});return Object.assign(Y.uniforms,r),Y}function sn(r){const c=new t.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,side:t.DoubleSide,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{uSub:{value:0},uPlume:{value:1},uGrow:{value:0},uPatch:{value:1},uTrailGlow:{value:new t.Color(0,0,0)}}]),vertexShader:`
      attribute vec3 aK; attribute vec4 iA, iB;
      uniform float uTime, uSub, uPlume, uGrow, uPatch;      // uPatch thins the foam patches where many strikes share one spot (bow, whale)
           // uGrow 0..1: plumes hold a size on screen when seen from far above (the boil from the hang)
      varying vec2 vQ; varying vec4 vK;
      ${nn}
      #include <fog_pars_vertex>
      void main() {
        float s = iA.w, per = iB.x, c = fract(uTime / per + s * 17.), tp = c * per, kind = aK.z;
        vec2 S = iA.xy; vec3 base = vec3(S.x, gsSeaY(S), S.y), wp = base;
        vec3 rx = normalize(vec3(viewMatrix[0][0], 0., viewMatrix[2][0]) + vec3(1e-5, 0., 0.));
        float dist = distance(base, cameraPosition), a = 0.;
        if (kind < .5) {
          float grow = 1. - exp(-tp * 6.);
          float Hh = (3. + 2.4 * fract(s * 91.)) * uPlume * grow * (1. - .5 * smoothstep(.5, 1.6, tp)) * (1. + uGrow * min(dist / 120., 1.5));
          a = (1. - smoothstep(.7, 1.7, tp)) * (1. - uSub) * smoothstep(7., 30., dist);      // never a white card across the lens
          a *= 1. - .96 * smoothstep(90., 230., dist) * (1. - uGrow);                       // from sea level, far off, they melt into the spray haze
          // a tuft, never a pin: at least 0.3 of its height to each side, wider still seen from over it in the fall
          float Wd = max(max(.55 + .8 * tp, dist * mix(.002, .0075, uGrow)), Hh * .34);
          wp += (rx * aK.x * Wd + vec3(0., (aK.y * .5 + .5) * Hh - .15, 0.)) * step(.004, a);
        } else if (kind < 1.5) {
          a = smoothstep(0., .1, tp) * (1. - smoothstep(1.6, 3.8, tp)) * (1. - uSub) * min(uPlume, 1.) * .92 * uPatch;
          wp += (vec3(aK.x, 0., aK.y) * (1.3 + 2.7 * sqrt(tp)) * max(1., uPlume * .6) + vec3(0., .12, 0.)) * step(.004, a);
        } else {
          a = (1. - smoothstep(1.2, 3.6, tp)) * uSub;
          wp += (rx * aK.x * max(.3, dist * .003) - vec3(0., (aK.y * .5 + .5) * min(tp * 14., 9. + 4. * fract(s * 13.)), 0.)) * step(.004, a);
        }
        vQ = aK.xy; vK = vec4(kind, a, s, tp);
        vec4 mvPosition = viewMatrix * vec4(wp, 1.);
        if (kind > .5 && kind < 1.5) mvPosition.xyz *= 1. - min(.9 / max(length(mvPosition.xyz), 1e-3), .4);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uTrailGlow;
      varying vec2 vQ; varying vec4 vK;
      ${pa}
      ${Ot}
      #include <fog_pars_fragment>
      void main() {
        float kind = vK.x, a = 0.; vec3 col = (uSunCol * .42 + uSkyCol * 1.15) * .9;
        if (kind < .5) {
          // a short ragged tuft of thrown water: widest a third of the way up, its outline eroded by two noises that
          // rise through it, brightest at the base and torn to mist at the top
          float y = clamp(vQ.y * .5 + .5, 0., 1.), w = .55 + .45 * sin(3.1416 * min(y * 1.25, 1.));
          float n = vn(vec2(vQ.x * 2.2 + vK.z * 50., y * 3.2 - uTime * 2.5)) * .6 + vn(vec2(vQ.x * 5.5 - vK.z * 31., y * 7. - uTime * 4.)) * .4;
          float edge = abs(vQ.x) / w + (n - .5) * (.55 + .9 * y);
          a = (1. - smoothstep(.4, 1., edge)) * smoothstep(0., .07, y) * (1. - smoothstep(.3 + .55 * n, 1., y)) * (.5 + .7 * n);
          col *= mix(1.12, .7, y);
        } else if (kind < 1.5) {
          // the strike seen from above: a white burst, then a crown thrown outward as a widening, breaking ring; inside it
          // the water is beaten dark for a moment and then pales as the bird's bubbles come up; lace is left behind
          float r = length(vQ), n = vn(vQ * 4. + vK.z * 30.), n2 = vn(vQ * 9. - vK.z * 17.), rj = r + .42 * (n - .5) + .16 * (n2 - .5), tp = vK.w;
          float open = smoothstep(.2, 2.8, tp), rc = .2 + .6 * smoothstep(0., 2.7, tp);
          // a ragged disc of white water that spreads, tears into lace from the middle and is gone; its middle pales with bubbles
          float disc = (1. - smoothstep(rc - .16, rc + .04, rj)) * smoothstep(.85 * open - .12, .85 * open + .2, n2 * .55 + n * .45 + .35 * smoothstep(rc - .5, rc, rj)) * (1. - smoothstep(2.3, 3.6, tp));
          float burst = (1. - smoothstep(.1, .5, rj)) * exp(-tp * 1.6) * (.5 + .9 * n2) * 1.3;
          float bub = (1. - smoothstep(rc - .3, rc - .05, rj)) * smoothstep(.4, 1.2, tp) * (1. - smoothstep(2., 3.4, tp)) * (.3 + .7 * n2) * .3;
          float wA = max(disc, burst);
          a = max(wA, bub);
          col = mix(col * vec3(.62, .9, .82), col * (.7 + .42 * n), smoothstep(0., .45, wA));
        } else {
          float y = vQ.y * .5 + .5, n = vn(vec2(vQ.x * 3. + vK.z * 9., y * 14. + uTime * 1.5));
          a = (1. - abs(vQ.x)) * (.35 + .9 * n) * pow(max(1. - y, 0.), .6);
          col = mix(vec3(.75, .95, .88), col, .3) * 1.2 + uTrailGlow;
        }
        a *= vK.y; if (a < .01) discard;
        gl_FragColor = vec4(col, clamp(a, 0., 1.));
        #include <fog_fragment>
      }`});return Object.assign(c.uniforms,r),c}function Us(r,c){const h=new t.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,premultipliedAlpha:!0,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{uEye:{value:new t.Color(c)},uEyeK:{value:1},uEyeNear:{value:1},uBack:{value:new t.Vector4(1,0,16,0)}}]),vertexShader:`
      varying vec2 vP, vSl;
      ${nn}
      #include <fog_pars_vertex>
      void main() {
        vec3 wp = (modelMatrix * vec4(position, 1.)).xyz; vP = position.xz;
        float y0 = gsSeaY(wp.xz);
        vSl = vec2(gsSeaY(wp.xz + vec2(2.5, 0.)) - y0, gsSeaY(wp.xz + vec2(0., 2.5)) - y0) / 2.5;
        wp.y = y0 + .1;
        vec4 mvPosition = viewMatrix * vec4(wp, 1.);
        mvPosition.xyz *= 1. - min(1.1 / max(length(mvPosition.xyz), 1e-3), .4);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uEyeK, uEyeNear; uniform vec3 uEye, uHole; uniform vec4 uBack;
      varying vec2 vP, vSl;
      ${pa}
      ${Ot}
      #include <fog_pars_fragment>
      ${Hs}
      // distance to the nearest wall between foam cells (0 on a wall, about 1 in the middle of a big cell); the cells drift
      float gsWall(vec2 p, float t) {
        vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8.;
        for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y)), c = i + g;
          vec2 o = .5 + .4 * sin(t + 6.2831 * vec2(h21(c), h21(c + 17.3)));
          vec2 q = g + o - f; float d = dot(q, q);
          if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
        }
        return sqrt(max(d2, 0.)) - sqrt(max(d1, 0.));
      }
      void main() {
        float r = length(vP), nearK = 1. - smoothstep(40., 125., vFogDepth);
        float n1 = vn(vP * .045 + vec2(uTime * .015, 0.)), n2 = vn(vP * .3 - uTime * vec2(.05, .03)), n3 = vn(vP * 1.1 + uTime * vec2(.2, .1)), n4 = vn(vP * 3.1 - uTime * .4);
        float n5 = vn(vP * 6.7 + uTime * vec2(.45, -.3)), n6 = vn(vP * 18. - uTime * vec2(.7, .5));
        float rr = r + 18. * (n1 - .5) + 5. * (n2 - .5);
        float band = smoothstep(19., 31., rr) * (1. - smoothstep(56., 86., rr));
        // how much foam lies here (0..1): the wreath's body, torn by slow holes, thinning to threads at both rims
        float tear = smoothstep(.5, .7, vn(vP * .6 + 11. + uTime * vec2(.04, -.06))) * smoothstep(.4, .62, n3);
        float amt = band * (.12 + .58 * smoothstep(.3, .8, n1 * .5 + n2 * .5)) * (1. - .6 * tear);
        amt *= 1. - .85 * uHole.z * (1. - smoothstep(8., 24., length(vP - uHole.xy) + 5. * (n2 - .5)));
        // lace: the walls between foam cells at three sizes (5.5 m, 1.75 m, 0.6 m). Where there is little foam only thin
        // walls stand and green water shows through; where there is much they close into a sheet. The finer sizes come
        // in as we fall toward it, opening small holes in the sheet and drawing threads between the big walls.
        float k2 = 1. - smoothstep(110., 250., vFogDepth), k3 = 1. - smoothstep(30., 95., vFogDepth), tw = uTime * .35;
        vec2 wq = vP + 2.4 * vec2(n3 - .5, n2 - .5);
        float d1 = gsWall(wq / 5.5 + uTime * vec2(.012, .008), tw), d2 = gsWall(wq / 1.75 + 7., tw * 1.6), d3 = gsWall(vP / .6 + 3., tw * 2.3);
        float sf = .1 * (1. - k2), w1 = amt * 1.3 + .25 * (n3 - .5), w2 = amt * 1.25 + .3 * (n4 - .5), w3 = amt * 1.2 + .3 * (n3 - .5);
        float l1 = 1. - smoothstep(w1 - .1 - sf, w1 + .06 + sf, d1), l2 = 1. - smoothstep(w2 - .12, w2 + .08, d2), l3 = 1. - smoothstep(w3 - .14, w3 + .1, d3);
        float gate = smoothstep(.02, .18, amt);
        float thick = l1 * gate * mix(1., .3 + .7 * l2, k2) * mix(1., .4 + .6 * l3, k3);
        thick = max(thick, gate * max(l2 * k2 * .8 * smoothstep(.12, .45, amt), l3 * k3 * .6 * smoothstep(.22, .55, amt)));
        float solid = smoothstep(.35, .8, amt) * l1;
        // ripple scars: rings spreading from strikes (a coarse set seen from the hang, a finer one close to)
        vec2 cell = floor(vP / 11.), f = fract(vP / 11.) - .5;
        float hsh = h21(cell), rd = length(f - (vec2(h21(cell + 3.1), h21(cell + 7.7)) - .5) * .5) + .05 * (n3 - .5);
        float bandR = max(band, smoothstep(9., 16., r) * (1. - smoothstep(56., 86., rr)));      // strike rings spread into the eye's outer band too
        float age = fract(uTime * .22 + hsh * 7.), ring = (1. - smoothstep(0., .045, abs(rd - age * .42))) * (1. - age) * bandR * step(.5, hsh) * (.4 + .9 * n4) * (.5 + .5 * nearK);
        vec2 cell2 = floor(vP / 4.3 + 7.), f2 = fract(vP / 4.3 + 7.) - .5;
        float hs2 = h21(cell2), rd2 = length(f2 - (vec2(h21(cell2 + 5.1), h21(cell2 + 1.7)) - .5) * .5);
        float age2 = fract(uTime * .35 + hs2 * 5.), ring2 = (1. - smoothstep(0., .06, abs(rd2 - age2 * .4))) * (1. - age2) * bandR * step(.78, hs2) * nearK * (.3 + .9 * n4);
        thick = clamp(max(thick, max(ring * .8, ring2 * .85)), 0., 1.);            // strike rings: thin white circles spreading over foam and water alike
        // foam flecks drifting on the eye itself, seen only close to
        thick = max(thick, .5 * nearK * smoothstep(.62, .8, n5 * .55 + n6 * .45) * smoothstep(.5, .72, n3) * (1. - smoothstep(20., 34., r)));
        // foam light: cream where the slope takes the low key, blue-grey where it turns away; never past 0.7
        float lit = clamp(.3 - 2.6 * (vSl.x * uSunDir.x + vSl.y * uSunDir.z) + .35 * (solid - .4) + .4 * (n4 - .5) + .5 * k2 * (d2 - .35) + nearK * .4 * (n6 - .5), 0., 1.);
        vec3 fcol = mix(uSkyCol * .74 + uShadeCol * .34, uSkyCol * .92 + uSunCol * .27, lit) * (.82 + .2 * n1) * mix(1., .74 + .52 * (n5 * .6 + n6 * .4), nearK);
        fcol = mix(fcol * vec3(.66, .9, .82) * .86, fcol, .25 + .75 * solid);        // thin lace is wet and a little green; the sheet is white
        float fa = clamp(thick * 1.1, 0., .96);
        float pulse = .8 + .2 * sin(uTime * .9);
        // the eye is dark bottle-green water, alive: two octaves of caustic veins whose grain follows our height;
        // the glow is a core that falls off to dark at the eye's rim; the ring's image is thin and refracted, and it
        // steadies and sharpens as we close (it is never faded to a blur)
        float low = 1. - uEyeNear, s1 = mix(.11, .3, low), s2 = mix(.3, .9, low);
        vec2 q1 = vP * s1 + uTime * vec2(.05, -.035), q2 = vP * s2 - uTime * vec2(.09, .06);
        float v1 = 1. - smoothstep(0., .36, abs(vn(q1) - vn(q1 * 1.31 + 7.3))), v2 = 1. - smoothstep(0., .4, abs(vn(q2) - vn(q2 * 1.27 + 3.1)));
        v1 *= v1; v2 *= v2;
        float vein = v1 * .65 + v2 * .5, wobA = mix(.5, 1.7, uEyeNear), wid = mix(.45, 1.05, uEyeNear);
        float wob = r + wobA * (vn(vP * .33 + uTime * .3) - .5) + .4 * wobA * sin(vP.x * .55 + uTime * 1.3) * sin(vP.y * .47 - uTime * 1.1) + .5 * (vn(vP * 1.4 - uTime * .7) - .5);
        float glow = (exp(-r * r / 110.) * .43 + exp(-r * r / 600.) * .08) * pulse * (.62 + .7 * vein) + .022 * vein * (1. - smoothstep(14., 34., r));
        float img = (1. - smoothstep(wid * .25, wid, abs(wob - 6.6))) * .95 * (.78 + .22 * sin(uTime * 1.7)) * (.7 + .5 * v2) + (1. - smoothstep(1.5, 6.6, wob)) * .2;
        float dark = .8 * (1. - smoothstep(13., 36., r));                // the eye: stilled, deepened water
        // (rare) the whale's back, just under the surface behind where it stands out: a long dark shape along its own
        // heading (uBack = the way its tail lies, its length, how far it is up), tapering to the tail, the foam parted over it
        vec2 hb = vP - uHole.xy; float bl = dot(hb, uBack.xy), bc = dot(hb, vec2(-uBack.y, uBack.x)), bt = clamp(bl / max(uBack.z, 1.), 0., 1.);
        float bk = uBack.w * (1. - smoothstep(.55, 1.2, abs(bc + .5 * (n3 - .5)) / mix(2.3, .55, bt * bt))) * smoothstep(-1.5, 1., bl) * (1. - smoothstep(.8, 1., bt));
        fa *= 1. - .85 * bk; dark = max(dark, .82 * bk);
        float ff = gsFog();
        float a = clamp(fa + dark * (1. - fa), 0., 1.);
        vec3 col = mix(fcol * fa, fogColor * a, ff);
        col += uEye * (glow + img) * uEyeK * (1. - fa) * (1. - .7 * ff);
        gl_FragColor = vec4(col, a * (1. - smoothstep(88., 96., r)));
      }`});return Object.assign(h.uniforms,r),h}function Zs(r){const c=new t.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,side:t.DoubleSide,uniforms:t.UniformsUtils.merge([t.UniformsLib.fog,{uTrailGlow:{value:new t.Color(0,0,0)}}]),vertexShader:`
      attribute vec4 iA, iB;
      uniform float uTime; uniform vec3 uCam, uPF, uPR, uPU; uniform vec4 uEsc;
      varying vec2 vQ; varying vec2 vK;
      #include <fog_pars_vertex>
      void main() {
        float s = iA.w;
        vec3 o = iA.xyz + vec3(.9 * sin(uTime * .6 + s * 30.), .6 * sin(uTime * .8 + s * 17.), 1.4 * sin(uTime * .4 + s * 9.)) * .3;
        vec3 C = uCam + uPR * o.x + uPU * o.y + uPF * o.z;
        float len = 24. + 10. * fract(s * 7.), y = position.y;
        vec3 c = C - uPF * (y * len + .4);
        vec3 side = normalize(cross(uPF, c - cameraPosition) + vec3(1e-5, 0., 0.));
        float wd = max(.07 + .2 * y, distance(c, cameraPosition) * .0022);
        vec3 wp = c + side * position.x * wd;
        vQ = position.xy; vK = vec2(uEsc.x * step(iB.x, .5) * (1. - smoothstep(-1.6, -.3, wp.y)), s);
        vec4 mvPosition = viewMatrix * vec4(wp, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uTrailGlow;
      varying vec2 vQ; varying vec2 vK;
      ${Ot}
      #include <fog_pars_fragment>
      void main() {
        float n = vn(vec2(vQ.x * 2.5 + vK.y * 40., vQ.y * 46. + uTime * 2.)) * .65 + vn(vec2(vQ.x * 6., vQ.y * 150. + uTime * 4. + vK.y * 9.)) * .35;
        float a = (1. - abs(vQ.x)) * smoothstep(.3, .72, n + .3 * (1. - vQ.y)) * pow(max(1. - vQ.y, 0.), .7) * vK.x * .8;
        if (a < .01) discard;
        gl_FragColor = vec4(vec3(.78, .95, .9) * 1.15 + uTrailGlow, a);
        #include <fog_fragment>
      }`});return Object.assign(c.uniforms,r),c}function Ys(){return new t.ShaderMaterial({transparent:!0,depthWrite:!1,depthTest:!1,fog:!1,uniforms:{uA:{value:0},uTime:{value:0},uCol:{value:new t.Color("#DCEBE4").multiplyScalar(.8)}},vertexShader:"varying vec2 vQ; void main() { vQ = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uA, uTime; uniform vec3 uCol; varying vec2 vQ;
      ${Ot}
      void main() {
        float n = vn(vQ * 9. + vec2(0., uTime * 6.)) * .6 + vn(vQ * 31. - vec2(0., uTime * 11.)) * .4;
        gl_FragColor = vec4(uCol * (.72 + .5 * n), uA * (.72 + .28 * n));
      }`})}function $s(r){return new t.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!1,side:t.DoubleSide,uniforms:{uTime:{value:0},uCol:{value:new t.Color(r)}},vertexShader:"varying vec2 vQ; void main() { vQ = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform float uTime; uniform vec3 uCol; varying vec2 vQ;
      ${Ot}
      void main() {
        float st = vn(vec2(vQ.x * 60. + vQ.y * 9., vQ.y * 2.5 - uTime * .35)) * .6 + vn(vec2(vQ.x * 9. + vQ.y * 1.5, 3.)) * .4;
        float edge = smoothstep(0., .22, vQ.x) * (1. - smoothstep(.78, 1., vQ.x)) * (1. - smoothstep(.55, 1., vQ.y)) * smoothstep(0., .04, vQ.y);
        gl_FragColor = vec4(uCol, edge * (.45 + .5 * st));
      }`})}function Js(r,c){return new t.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!1,blending:t.AdditiveBlending,side:t.DoubleSide,uniforms:{uAnti:{value:r.clone().negate()},uK:{value:c}},vertexShader:"varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz - cameraPosition; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      uniform vec3 uAnti; uniform float uK; varying vec3 vW;
      void main() {
        vec3 d = normalize(vW + vec3(0., 1e-5, 0.));
        float ang = degrees(acos(clamp(dot(d, uAnti), -1., 1.))), x = (ang - 40.4) / 2.2;      // 0 violet (inside) .. 1 red (outside)
        vec3 c = clamp(vec3(1.5 - abs(x - .86) * 3.4, 1.4 - abs(x - .52) * 3.4, 1.5 - abs(x - .18) * 3.4), 0., 1.);
        float el = degrees(asin(clamp(d.y, -1., 1.)));
        float k = smoothstep(0., .14, x) * (1. - smoothstep(.86, 1., x)) * smoothstep(-.3, .8, el) * (1. - smoothstep(3., 9., el));
        gl_FragColor = vec4(c * k * uK, 1.);
      }`})}function er(r,c,h,X){return new t.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!1,side:t.BackSide,uniforms:{uDark:{value:r},uS:{value:c},uK:{value:h},uT:X},vertexShader:"varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform vec3 uDark, uS; uniform float uK, uT; varying vec3 vD;
      ${Ot}
      void main() {
        vec3 d = normalize(vD + vec3(0., 1e-5, 0.));
        float k = 1. - smoothstep(-.9, .6, dot(d, uS));
        vec2 p = d.xz / (max(d.y, 0.) + .2) - uT * vec2(.019, -.008);
        float n = vn(p * 1.2) * .54 + vn(p * 2.7 + 7.3) * .34 + vn(p * 5.9 + 2.1) * .12, e = .1 * (1. - smoothstep(.15, .6, d.y));
        float up = smoothstep(0., .12, d.y), brk = smoothstep(.5 - e, .86 + e, n) * up, rag = (1. - smoothstep(.2 - e, .5 + e, n)) * up;      // (the lowest 7 degrees are the far deck seen edge-on: even)
        // the lowest few degrees keep a little of the horizon's haze, so the far sea meets the sky without a cut-out line
        gl_FragColor = vec4(uDark, min(k * uK * (1. - .42 * brk + .16 * rag), .93) * mix(.72, 1., smoothstep(0., .09, d.y)));
      }`})}function $e(r,c,h,X,Y=0){const m=new t.InstancedBufferGeometry;m.index=r.index;for(const D of Object.keys(r.attributes))m.setAttribute(D,r.attributes[D]);for(const D of Object.keys(h))m.setAttribute(D,new t.InstancedBufferAttribute(h[D],4));m.instanceCount=c,m.boundingSphere=new t.Sphere(new t.Vector3(60,80,-60),900);const E=new t.Mesh(m,X);return E.frustumCulled=!1,E.renderOrder=Y,E}async function tr(r,c,h=256){const X=h*h,Y=[new Float32Array(X),new Float32Array(X)],m=new Int32Array(h),E=new Int32Array(h),D=new Float32Array(h);for(let V=0;V<2;V++){const x=Y[V];for(let T=0,y=V?16:4,S=.5;T<4;T++,y*=2,S*=.55){const q=new Float32Array(y*y);for(let C=0;C<q.length;C++)q[C]=r(),C%4096===4095&&await c.yield();await c.yield();for(let C=0;C<h;C++){const $=C/h*y,oe=Math.floor($),Q=$-oe;m[C]=oe%y,E[C]=(oe+1)%y,D[C]=Q*Q*(3-2*Q)}for(let C=0;C<h;C++){const $=m[C]*y,oe=E[C]*y,Q=D[C];for(let re=0,ve=C*h;re<h;re++,ve++){const me=q[$+m[re]],Me=q[$+E[re]],Z=q[oe+m[re]],be=q[oe+E[re]],wt=D[re];x[ve]+=S*(me+(Me-me)*wt+(Z+(be-Z)*wt-me-(Me-me)*wt)*Q)}C%16===15&&await c.yield()}}}const j=.5*(1+.55+.55**2+.55**3),U=new Uint8Array(X*4),L=h-1,i=V=>Math.max(0,Math.min(255,((V/j-.5)*1.75+.5)*255));for(let V=0;V<h;V++){for(let x=0;x<h;x++){const T=V*h+x,y=(V+89&L)*h+(x+151&L),S=(V+33&L)*h+(x+201&L);U[T*4]=i(Y[0][T]),U[T*4+1]=i(Y[1][T]),U[T*4+2]=i(Y[0][y]),U[T*4+3]=i(Y[0][S])}V%16===15&&await c.yield()}const A=new t.DataTexture(U,h,h,t.RGBAFormat);return A.wrapS=A.wrapT=t.RepeatWrapping,A.magFilter=t.LinearFilter,A.minFilter=t.LinearMipmapLinearFilter,A.anisotropy=4,A.generateMipmaps=!0,A.colorSpace=t.NoColorSpace,A.needsUpdate=!0,A}const Ne=new t.Vector3(.4313,0,-.9022),Jn=[{dx:0,dz:-1,L:110,amp:3,c:13,fold:.05},{dx:-.242,dz:-.9703,L:73.3,amp:1.05,c:10.7,fold:.03}];for(const r of Jn)r.k=Math.PI*2/r.L,r.w=r.c*r.k;const va=7.6,es=32*Math.PI/180,or=82,wa=90,qo=new t.Vector3(Math.sin(es),0,-Math.cos(es));function ar(r){const c=Math.cos(62*Math.PI/180),h=Math.sin(62*Math.PI/180),X=new t.Vector3(Ne.x*c,-h,Ne.z*c),Y=co.clone().addScaledVector(X,-202),m=Math.acos(Re(qo.dot(X),-1,1)),E=X.clone().addScaledVector(qo,-Math.cos(m)).normalize(),D=Y.clone().addScaledVector(qo,-wa*Math.sin(m)).addScaledVector(E,-wa*(1-Math.cos(m))),j=we=>{const ut=m*we;return D.clone().addScaledVector(qo,wa*Math.sin(ut)).addScaledVector(E,wa*(1-Math.cos(ut)))},U=D.clone().addScaledVector(qo,-or),L=[];for(let we=0;we<=28;we++)L.push(r.helixAt(we/28));const i=L[0],A=L[28],V=we=>new t.Vector3(we[0],we[1],we[2]),x=[[40,va,317],[40,va,250],[40,va,185],[40,va,125],[40,8.8,82],[40,11,45]].map(V),T=-24,y=-Math.atan2(i.z,i.x),S=Math.cos(y),q=Math.sin(y),C=((40-i.x)*S-(T-i.z)*q)/(S-1),$=((1-S)*(T-i.z)-q*(40-i.x))/(S-1),oe=C*y+Math.max($,0),Q=$>3?6:5,re=[[40,11,12],[40,11,-10]].map(V);for(let we=0;we<=Q;we++){const ut=y*we/6;re.push(new t.Vector3(40-C*(1-Math.cos(ut)),11+(i.y-11)*Math.pow(C*ut/oe,1.6),T-C*Math.sin(ut)))}const ve=[...x,...re];for(const we of L)ve.push(we);const me=new t.Vector3(15,181.5,33.5),Me=me.clone().lerp(U,.5),Z=new t.Vector3(me.z-U.z,0,U.x-me.x).normalize();Me.addScaledVector(Z,4),Me.y=D.y-10.3,U.y=D.y-2.3;const be=U.clone().lerp(D,1/3),wt=U.clone().lerp(D,2/3);be.y=D.y-.2,wt.y=D.y,ve.push(me,Me,U,be,wt,D,j(1/3),j(2/3),Y);for(const we of[.25,.5,.75])ve.push(Y.clone().lerp(co,we));ve.push(co.clone());const ga=Y.clone().lerp(co,Y.y/(Y.y-co.y));return{pts:ve,h0:i,h1:A,hangStart:U,levelEnd:D,fallStart:Y,surf:ga,fall:X}}function nr(r,c){const h={archIn:new t.Vector3(40,11,45),archOut:new t.Vector3(40,11.3,-45),climb0:c.h0,climb1:c.h1,hang0:c.hangStart,hang1:c.levelEnd,fall0:c.fallStart,surf:c.surf},X=Object.keys(h),Y=X.map(()=>1e18),m={},E=new t.Vector3;for(let D=0;D<=700;D++){r.pointAt(D/700,E);for(let j=0;j<X.length;j++){const U=E.distanceToSquared(h[X[j]]);U<Y[j]&&(Y[j]=U,m[X[j]]=D/700)}}return m.burst0=m.archIn-.1,m.burst1=m.archIn+.11,m.chase0=m.archOut-.045,m.chase1=m.climb0+.012,m.over=m.hang1-ts.lookAhead/r.length,m.spear=m.surf-30.6/r.length,m.whale0=m.fall0+.25*(m.surf-m.fall0),m}function sr(r,c,h){const X=Ie,Y=Q=>1.1-.38*X(h.archOut-.03,h.archOut+.07,Q)-.12*X(h.climb1+.02,h.hang0,Q)+.75*X(h.fall0-.025,h.fall0+.04,Q)-.3*X(h.fall0+.04,h.fall0+.085,Q),m=new t.Vector3,E=new t.Vector3,D=new t.Vector3,j=h.hang0-h.climb1,U=700,L=.55,i=Be.clone().addScaledVector(Ne,U),A=(h.fall0+h.surf)/2,V=h.archOut-.082,x=h.climb0+.01,T=h.climb1-.05,y=h.climb1+.8*j,S=h.climb1+.15*j,q=A,C=h.climb1+.2*j,$=h.hang0+.8*(h.hang1-h.hang0),oe=[{at:r.archCenter.clone(),from:h.archIn-.165,to:h.archIn-.005,weight:.4},{at:(Q,re)=>{c.pointAt(re,m);const ve=Math.atan2(m.z,m.x)-.55;return E.set(Math.cos(ve)*38,m.y+13*X(11.2,15.5,m.y),Math.sin(ve)*38)},from:V,to:x,weight:.55,fade:.36},{at:(Q,re)=>{c.pointAt(re,m);const ve=Math.max(Math.hypot(m.x,m.z),1),me=m.x/ve,Me=m.z/ve;return D.set(m.x+12*(.553*Me-.708*me),m.y-12*.438,m.z+12*(-.553*me-.708*Me))},from:h.climb0-.03,to:h.climb1-.004,weight:.7,fade:.25},{at:r.summit.clone(),from:T,to:y,weight:.78,fade:.4},{at:Be.clone(),from:S,to:q,weight:1,fade:.85*j/(q-S)},{at:i,from:C,to:$,weight:L,fade:.33}];return{pace:Y,pois:oe}}const ts={fov:62,near:.3,far:4e3,lookAhead:22,sway:.7,bank:.72},rr=46,Ae=new t.Vector3,Ft=new t.Vector3,rn=new t.Vector3(0,1,0),os=r=>"#"+r.getHexString();var hr={id:"gannet-stack-gale",name:"The White Stack",category:"ocean",weirdness:.05,media:["air","open"],async build(r){const{rng:c}=r,h=r.vary||{},X=r.quality?.detail??1,Y=Re(h.density??1,.7,1.3),m=new t.Scene,E=c.fork("look"),D=h.hour||"any",j=E(),U=E(),L=D==="golden"?"golden":D==="dawn"?"dawn":D==="day"?"day":D==="night"?"night":j<.4?"golden":j<.6?"dawn":j<.8?"day":"night",i=js[L],A=U<.5?"clear":U<.78?"rain":"haar",V=E()<.4,x=E()<.35,T=E()<.35,y=!!h.rare,S=_s(8,-45),q=new t.Color(i.sky[0],i.sky[1],i.sky[2]),C=new t.Color(i.shade[0],i.shade[1],i.shade[2]),$=i.fogD*(A==="haar"?1.3:1);m.fog=new t.FogExp2(new t.Color(i.fog),$),m.background=new t.Color(i.fog);const oe=await Es(r,{palette:lo,sunDir:S,sunColor:i.key,sunIntensity:i.keyK,skyColor:q,shadeColor:C,season:V?"august":"june",towerBirds:Math.round(4800*Re(Y,.85,1.15))});m.add(oe.object);const Q=oe.anchors,re=Q.windDir.clone(),ve=Q.lipRadius;await r.yield();const me=ar(Q),Me=Rs(me.pts,{samples:480});await r.yield();const Z=nr(Me,me);await r.yield();const be=Ie,{pace:wt,pois:ga}=sr(Q,Me,Z);await r.yield();const we=Gs({rng:c.fork("sky"),preset:"storm",lightning:0,zenith:i.zenith,mid:i.mid,horizon:i.horizon,ground:i.ground,horizonPow:3,scatterColor:i.slot,scatter:i.slotK,scatterPow:i.slotPow,scatterHigh:0,scatterFall:i.slotFall,sunElevation:8,sunAzimuth:-45,sunColor:i.key,sunIntensity:0,sunGlow:i.moon?.1:.55,sunGlowTight:.3,veil:.7,clouds:{coverage:i.coverage,softness:.4,scale:.75,lit:i.cloudLit,shade:i.cloudShade,absorb:2,silver:.7,wind:[.03,-.012],detail:.75,haze:.22},clouds2:{coverage:.97,softness:.6,scale:.5,stretch:.3,opacity:1,lit:i.mid,shade:i.zenith,wind:[.012,-.005]},lightColor:i.key,lightIntensity:i.keyK,fogColor:i.fog,cloudLit:i.cloudLit,cloudShade:i.cloudShade,...i.moon?{bodies:[{elevation:8.5,azimuth:-45,size:2.3,color:"#f2f4f8",color2:"#c2c8d2",phase:1,intensity:1.5,glow:.5,glowSize:5}],key:0,bake:!0,renderer:r.renderer}:{}});m.add(we.object),await r.yield();const ut=await tr(c.fork("scud-noise"),r,128);await r.yield();const ya=Ws({rng:c.fork("scud"),sky:we,noiseTexture:ut,count:16,altitude:350,altitudeJitter:60,size:[220,460],height:.4,center:[0,0,-150],extent:[2600,2600],wind:[17,0,-7],opacity:.8,fogFade:.6,renderOrder:-.8,bottomColor:new t.Color(i.cloudShade).lerp(new t.Color(i.slot),.3)});m.add(ya.object),await r.yield();const as=(e=>{const a=new t.Color(e),o=new t.Color(i.tint),n=new t.Color(i.shadowTint),l=1.07,d=(v,w,b)=>{const R=Math.max((v-.5*w-.5)/l+.5,.001),M=1-.983729*R,O=.0245786-.432951*R,J=90537e-9+.238081*R;return(-O+Math.sqrt(O*O+4*M*J))/(2*M)*.6/(i.exposure*b)};return new t.Color(d(a.r,n.r,o.r),d(a.g,n.g,o.g),d(a.b,n.b,o.b))})(lo[0]),fo=new t.Vector3(S.x,0,S.z).normalize(),It={value:0},uo=new t.Mesh(new t.SphereGeometry(3e3,24,12),er(as,fo,.75,It));uo.frustumCulled=!1,uo.renderOrder=-.5,m.add(uo),await r.yield();const ht=Vo.fxGroup();m.add(ht.object);const No=ht.add(Vo.makeGodRays({rng:c.fork("rays"),time:It,position:[fo.x*640,400,fo.z*640],direction:[-fo.x*.74,-.5,-fo.z*.74],radius:270,count:4,length:640,width:[42,125],color:i.rays,intensity:i.rayK*4.2,falloff:.9,speed:.55,fogAmount:.3}));await r.yield();const ns=Un.waterLight(we,{sunDir:S,sunColor:i.key,sunIntensity:i.keyK*2,glint:.42,fogColor:i.fog,ambient:i.seaAmb}),xa={color:new t.Color(i.fog),density:$},ss=[we.object,ya.object,ht.object,uo];let Ro=()=>0;const Tt=Un.makeSea({rng:c.fork("sea"),light:ns,level:0,hideBelow:ss,air:xa,ocean:{preset:"storm",height:2.9,wavelength:80,contrast:.66,windAngle:-Math.PI/2,segments:144,sprayOpacity:.8,deep:i.deep,scatter:i.scatter,foamColor:i.foam,glow:i.glow,spray:!0,shallows:[{x:0,z:0,radius:50,falloff:30},{x:-400,z:30,radius:30,falloff:26},{x:-428,z:-72,radius:24,falloff:24}],shallowColor:"#3f927c",shoreDamp:.3},underwater:{surfaceAt:(e,a,o)=>Ro(e,a,o),water:i.water,deep:i.waterDeep,floorY:-60,fogDensity:.02,sunDisc:.3,rayIntensity:1,particles:{count:Math.round(420*X),range:40,size:.05},bubbles:{count:110,columns:6,size:.14,sources:[[168,-58,-214],[186,-58,-206],[176,-58,-228],[160,-58,-200],[190,-58,-222],[172,-58,-196]]}}});m.add(Tt.object);let ba=!1,Ma=!1,Go=!1;const Wo=[0,1,2,3].map(()=>new t.Vector4(0,0,1,0)),ln=[0,0,0,0],ka=[0,0,0,0],_o=new t.Vector4(1,0,1,0);{const e=Tt.ocean.material,a="gl_FragColor = vec4(col,1.);",o="fT = uFoamT-.25*uSteep;",n="smoothstep(uFoamT,fT,",l="void main(){",d=["uniform vec4 uWA[NF], uWB[NF];","uFoamT, uFoam, uDetail, uRough, uFadeA, uFadeB, uGlitter, uReflect, uSteep, uContrast, uHorizonMix","uDeep, uScatter, uFoamColor, uGlow, uHorizonColor, uShallowColor","varying vec3 vWorld; varying vec2 vXZ; varying float vH;","const mat2 R1 = mat2(.7986,.6018,-.6018,.7986), R2 = mat2(-.3256,.9455,-.9455,-.3256);","uSunDir, uScatDir, uSunColor","uUwWater","vec3 kitUnderside(","vec2 kitShoal(","float kitFog(","float kitPix(","vec3 kitSky(","vec3 kitAtmo(","vec3 kitSunSpec(","float kitGlitter(","vec2 h22(","vec2 kitCell4(","float fbm2(","float vnoise(","vec3 noised(","float pow5(","vec3 kitAmbient("];e&&typeof e.fragmentShader=="string"&&e.fragmentShader.includes(l)&&d.every(v=>e.fragmentShader.includes(v))?(e.uniforms.uOpenSea={value:new t.Vector3(125,215,.12)},e.uniforms.uPool={value:Wo},e.uniforms.uPoolLean={value:_o},e.uniforms.uPoolCol={value:new t.Color(i.rays).multiplyScalar(i.moon?.8:1.15)},e.fragmentShader=e.fragmentShader.slice(0,e.fragmentShader.indexOf(l))+Xs,e.needsUpdate=!0,Go=ba=Ma=!0):e&&typeof e.fragmentShader=="string"&&(e.fragmentShader.includes(a)&&(e.fragmentShader=e.fragmentShader.replace(a,"col = max(col, 0.); "+a),ba=!0),e.fragmentShader.includes(o)&&e.fragmentShader.includes(n)&&e.fragmentShader.includes(l)&&(e.uniforms.uOpenSea={value:new t.Vector3(125,215,.12)},e.fragmentShader=e.fragmentShader.replace(l,`uniform vec3 uOpenSea;
`+l).replace(o,"gsFT = uFoamT-uOpenSea.z*smoothstep(uOpenSea.x,uOpenSea.y,length(vXZ)), fT = gsFT-.25*uSteep;").split(n).join("smoothstep(gsFT,fT,"),Ma=!0),e.needsUpdate=!0)}let cn=!1,fn=!1;const rs=new t.Vector4(0,0,300,225);{const e=Tt.ocean.material,a="void main(){",o="vec3 col = mix(body, refl, F);",n="col += spec*(1.-fa);",l=No.object,d=l&&l.geometry,v=d&&d.getAttribute("aOrigin"),w=d&&d.getAttribute("aParam"),b=No.uniforms&&No.uniforms.uDir&&No.uniforms.uDir.value;if(e&&typeof e.fragmentShader=="string"&&(Go||e.fragmentShader.includes(a)&&e.fragmentShader.includes(o)&&e.fragmentShader.includes(n))&&v&&w&&b&&b.y<-.1&&v.count>=4){const J=Math.hypot(b.x,b.z);_o.set(b.x/J,b.z/J,1/-b.y,0);for(let ee=0;ee<4;ee++){const se=l.position.y+v.getY(ee),ie=se/-b.y;Wo[ee].set(l.position.x+v.getX(ee)+b.x*ie,l.position.z+v.getZ(ee)+b.z*ie,Re(.6*125*w.getX(ee),45,110),0),ln[ee]=.55+.45*w.getW(ee),ka[ee]=w.getZ(ee)}Go||(e.uniforms.uPool={value:Wo},e.uniforms.uPoolLean={value:_o},e.uniforms.uPoolCol={value:new t.Color(i.rays).multiplyScalar(i.moon?.8:1.15)},e.fragmentShader=e.fragmentShader.replace(a,`uniform vec4 uPool[4]; uniform vec4 uPoolLean; uniform vec3 uPoolCol;
float gsPh(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float gsPn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(gsPh(i), gsPh(i + vec2(1., 0.)), f.x), mix(gsPh(i + vec2(0., 1.)), gsPh(i + vec2(1., 1.)), f.x), f.y); }
vec3 gsPool(vec2 xz) {
  float m = 0., n = .5 * (gsPn(xz * .011 + uPoolLean.w * .021) - .5) + .2 * (gsPn(xz * .045 - uPoolLean.w * .05) - .5);
  for (int i = 0; i < 4; i++) { vec2 d = xz - uPool[i].xy; vec2 q = vec2(d.x * uPoolLean.y - d.y * uPoolLean.x, (d.x * uPoolLean.x + d.y * uPoolLean.y) / max(uPoolLean.z, 1.)) / max(uPool[i].z, 1.);
    m += uPool[i].w * (1. - smoothstep(.4, 1., length(q) + n)); }
  return uPoolCol * min(m, 1.25);
}
`+a).replace(o,"vec3 gsPl = gsPool(vXZ); body *= 1. + 1.7 * gsPl; "+o).replace(n,"col += spec*(1.-fa)*(1. + 3. * gsPl * smoothstep(.05, .25, V.y));")),e.needsUpdate=!0,cn=!0}const R=Tt.ocean.spray&&Tt.ocean.spray.material,M="vQ = position.xy; vSeed = aB.z; vWorld = w;",O="#include <fog_pars_vertex>";R&&typeof R.vertexShader=="string"&&R.vertexShader.includes(M)&&R.vertexShader.includes(O)&&(R.uniforms.uCalm={value:rs},R.vertexShader=R.vertexShader.replace(O,`uniform vec4 uCalm;
`+O).replace(M,"vI *= 1. - smoothstep(uCalm.w, uCalm.z, distance(w.xz, uCalm.xy)); "+M),R.needsUpdate=!0,fn=!0)}await r.yield();const ot=Tt.ocean.uniforms;ot.uAmp.value=3.6;const za=ot.uWA.value,ho=ot.uWB.value;Jn.forEach((e,a)=>{za[a].set(e.dx,e.dz,e.k,e.w),ho[a].set(e.amp,e.fold/(e.k*e.amp),ho[a].z,e.L)}),Ro=(e,a,o)=>{let n=e,l=a,d=0;for(let v=0;v<5;v++){let w=0,b=0;d=0;for(let R=0;R<8;R++){const M=za[R],O=ho[R],J=M.z*(M.x*n+M.y*l)-M.w*o+O.z,ee=O.y*O.x*Math.cos(J);w+=M.x*ee,b+=M.y*ee,d+=O.x*Math.sin(J)}v<4&&(n+=(e-w-n)*.85,l+=(a-b-l)*.85)}return d};const De={...oe.uniforms,uWA:ot.uWA,uWB:ot.uWB,uSeaT:ot.uTime,uSpacing:ot.uSpacing,uR0:ot.uR0,uSeaRad:ot.uRadius,uSeaC:{value:new t.Vector3},uShoal:{value:new t.Vector4(0,0,50,ot.uShoreDamp.value)},uJuv:{value:V?1/6:1/12}},Qt=Zn(),un=(e,a,o)=>{if(a>=177)return!1;const n=Math.hypot(e,o);return n<80&&n<ve(Math.atan2(o,e),Re(a,0,170))+4},le=new Float32Array((Math.ceil(Me.length*2)+2)*3),hn=le.length-6;for(let e=0;e<le.length;e+=3)Me.posAtDist(e>hn?-.5:e/hn*Me.length,Ae),le.set([Ae.x,Ae.y,Ae.z],e),e%900===897&&await r.yield();let Ht=0;for(let e=0;e<8;e++)Ht+=ho[e].x;{let e=0,a=46,o=0;for(let n=0;le[n+2]>45;n+=3)e=Math.max(e,le[n+1]-le[1]),le[n+1]<le[1]+.02&&(a=le[n+2]);for(let n=0;le[n+2]>45;n+=3)o=Math.max(o,le[n+1]-le[1]-e*(1-be(45,a,le[n+2])));De.uLine={value:new t.Vector4(le[0],le[1]+4.1+o,e,a)}}const Aa=(e,a,o,n=1,l=0,d=0,v=0,w=0,b=le)=>{let R=1e9;for(let M=0;M<b.length;M+=3){const O=b[M]-e,J=b[M+2]-o,ee=Math.max(Math.abs(O*n+J*l)-d,0),se=Math.max(Math.abs(O*l-J*n)-v,0),ie=Math.max(Math.abs(b[M+1]-a)-w,0),de=ee*ee+se*se+ie*ie;de<R&&(R=de)}return Math.sqrt(R)},Xt=m.userData.seatFails={hangers:0,wheelers:0,...await oe.clearAir(le),tracks:0,landers:0,rafts:0,flocks:0,diversMoved:0,tracksLineOnly:0},mo=Math.round(460*Y*X),ke=c.fork("near"),Bt=new Float32Array(mo*4),po=new Float32Array(mo*4);for(let e=0;e<mo;e++){for(let a=0;a<7;a++){const o=ke(),n=o<.35?0:o<.72?1:o<.92?2:0,l=o<.2?ke.range(.02,.24):o<.35?ke.range(Z.archOut-.02,Z.climb0):o<.72?ke.range(Z.climb0,Z.climb1):o<.92?ke.range(Z.climb1,Z.hang0+.02):ke.range(Z.hang0+.02,.8),d=Me.pointAt(l,Ae),v=Math.max(Math.hypot(d.x,d.z),1),w=n===1?Math.atan2(d.z,d.x)+ke.range(-.9,.9):ke.range(0,ce),b=n===1?ke.range(8.5,30):n===2?ke.range(10,38):ke.range(9,40),R=n===1?ke.range(-9,10):n===2?ke.range(-6,12):ke.range(-4,15),M=d.x+Math.cos(w)*b,O=d.z+Math.sin(w)*b,J=Math.max(d.y+R,3.5),ee=Math.hypot(M,O),se=O/Math.max(ee,1),ie=-M/Math.max(ee,1),de=n?1:ee<130?.8:.15,xe=ke(),Ee=n?ke.range(-.25,.25):ke.range(-.5,.5);let je=xe<de?se:xe<de+(1-de)*.6?-re.x:re.x,Ge=xe<de?ie:xe<de+(1-de)*.6?-re.z:re.z;const ye=Math.cos(Ee),it=Math.sin(Ee),Fe=je*ye-Ge*it,Ve=je*it+Ge*ye,et=n===1?ke.range(70,110):ke.range(120,200),pe=n?ke.range(12,17):ke.range(13,19),lt=ke();let Ke=!0;for(let Oe=-3;Oe<=3&&Ke;Oe++){const He=Oe/3*(et*.5-12),Se=M+Fe*He,We=O+Ve*He;(un(Se,J,We)||Me.distanceTo(Se,J,We)<9)&&(Ke=!1)}if(Ke||a===6){Bt.set([M,Ke?J:J+70,O,lt],e*4),po.set([Fe,Ve,pe,et],e*4);break}}e%8===7&&await r.yield()}for(let e=0;e<mo;e++){const a=Bt[e*4],o=Bt[e*4+1],n=Bt[e*4+2],l=po[e*4],d=po[e*4+1],v=po[e*4+3]/2,w=M=>{for(let O=-v;O<=v;O+=2)if(un(a+l*O,M,n+d*O))return!0;return!1};let b=0,R=null;for(let M=o;b<400;b++,M=o+(b&1?.5:-.5)*(b+1>>1))if(Aa(a,M,n,l,d,v,1.2,2.4)>=3.75&&(!b||M>o||M>=Ht+3.4)){if(!b||!w(M)){Bt[e*4+1]=M;break}R===null&&(R=M)}b===400&&(R===null?Xt.tracks++:(Bt[e*4+1]=R,Xt.tracksLineOnly++)),e%8===7&&await r.yield()}const is=Pt(De,Ct.stream);m.add($e(Qt,mo,{iA:Bt,iB:po},is)),await r.yield();const vo=c.fork("landers"),Ut=12,Je=new Float32Array(Ut*4),Eo=new Float32Array(Ut*4);for(let e=0;e<Ut;e++){const a=Me.pointAt(Kt(Z.climb0+.012,Z.climb1-.012,(e+vo())/Ut),Ae),o=Math.atan2(a.z,a.x)-vo.range(.1,.2),n=Math.cos(o),l=Math.sin(o);Q.ledgeAt(o,a.y+vo.range(-4,2.5),Ft),Je.set([Ft.x+n*.5,Ft.y+1.25,Ft.z+l*.5,vo()],e*4),Eo.set([n,l,vo.range(5.5,8.5),0],e*4)}for(let e=0;e<Ut;e++){const a=Eo[e*4],o=Eo[e*4+1],n=Je[e*4+1]-1.25,l=[],d=Je.slice(e*4,e*4+3);for(let w=0;w<le.length;w+=3)Math.hypot(le[w]-Je[e*4],le[w+2]-Je[e*4+2])<30&&l.push(le[w],le[w+1],le[w+2]);const v=()=>{for(let w=0;w<=24;w++){const b=w/24,R=Kt(3.3,.25,b),M=2.2*(1-b);if(Aa(Je[e*4]+a*R-o*M,Je[e*4+1]+Kt(4.2,-.85,b*b),Je[e*4+2]+o*R+a*M,1,0,0,0,0,l)<3.55+.92*(1-.7*b))return!1}return!0};for(let w=1;!v()&&w<80;w++)Q.ledgeAt(Math.atan2(o,a),n+(w&1?1:-1)*(w+1>>1),Ft),Je.set([Ft.x+a*.5,Ft.y+1.25,Ft.z+o*.5],e*4);v()||(Je.set(d,e*4),Xt.landers++),await r.yield()}m.add($e(Zn(!0),Ut,{iA:Je,iB:Eo},Pt({...De,uWindDir:{value:re}},Ct.lander))),await r.yield();const Zt=Math.round(440*Y*X),mt=c.fork("rafts"),Yt=new Float32Array(Zt*4),ls=new Float32Array(Zt*4),cs=Math.atan2(-re.x,-re.z);{let e=0,a=0,o=1;for(let n=0;n<Zt;n++){if(n%20===0){const v=mt()<.5?-1:1;o=mt.range(5,9),e=40+v*(o+mt.range(3.5,15)),a=Kt(300,64,(n/20+mt())/Math.ceil(Zt/20))}const l=mt.range(0,ce),d=o*Math.sqrt(mt());Yt.set([e+Math.cos(l)*d*1.6,a+Math.sin(l)*d,cs+mt.range(-.5,.5),mt()],n*4)}}for(let e=0;e<Zt;e++){const a=Yt[e*4],o=Yt[e*4+3],n=1.4+1.3*(o*5%1),l=v=>{const w=(v<40?-1:1)*(.3+.5*(o*11%1)),b=Math.hypot(w,1);return Aa(v+25.65*w/b,n,Yt[e*4+1]-25.65/b,w/b,-1/b,25.65,0,Ht+n)>=3.6};let d=0;for(let v=a;d<80;d++,v=a+(d&1?.25:-.25)*(d+1>>1))if(l(v)){Yt[e*4]=v;break}d===80&&Xt.rafts++,e%40===39&&await r.yield()}const Sa=$e(Qt,Zt,{iA:Yt,iB:ls},Pt(De,Ct.raft));m.add(Sa),await r.yield();const jo=7,Ko=mt.fork("lift"),mn=new Float32Array(jo*4),fs=new Float32Array(jo*4);for(let e=0;e<jo;e++){const a=Ko.range(9,17);mn.set([a,a*Ko.range(12.5,15.5),Ko.range(-14,14),Ko()],e*4)}const us=$e(Qt,jo,{iA:mn,iB:fs},Pt(De,Ct.cross));m.add(us),await r.yield();const wo=c.fork("escort"),Ca=30+(x?3:2),Dt=new Float32Array(Ca*4),Lt=new Float32Array(Ca*4);for(let e=0;e<30;e++){const a=e%2?1:-1,o=wo.range(5,20),n=a*(Math.max(4.6,.42*o)+wo.range(0,5));Dt.set([n,wo.range(-2.6,3.4),o,wo()],e*4),Lt.set([0,0,wo.range(1.3,1.5),0],e*4)}Array.from({length:30},(e,a)=>[Dt[a*4+2],a]).sort((e,a)=>e[0]-a[0]).slice(0,6).forEach(([,e])=>{Lt[e*4+3]=1}),Dt.set([-6.2,.8,9,.37],120),Lt.set([1,0,1.5,0],120),Dt.set([-5,2,11.5,.71],124),Lt.set([2,x?3:2,x?1.6:1.45,0],124),x&&(Dt.set([-8.4,2.7,13.5,.13],128),Lt.set([2,3,1.5,0],128));const at={uCam:{value:new t.Vector3},uPF:{value:new t.Vector3(0,0,-1)},uPR:{value:new t.Vector3(1,0,0)},uPU:{value:new t.Vector3(0,1,0)},uHead:{value:new t.Vector3(0,0,-1)},uEsc:{value:new t.Vector4(0,0,0,0)},uPart:{value:0}},hs=Pt({...De,...at},Ct.escort);m.add($e(Qt,Ca,{iA:Dt,iB:Lt},hs));const Pa=new t.BufferGeometry;{const e=[],a=[];for(let o=0;o<=8;o++)e.push(-1,o/8,0,1,o/8,0);for(let o=0;o<8;o++)a.push(o*2,o*2+1,o*2+3,o*2,o*2+3,o*2+2);Pa.setAttribute("position",new t.BufferAttribute(new Float32Array(e),3)),Pa.setIndex(a)}const dn=Zs({...De,...at});dn.uniforms.uTrailGlow.value.set(i.trail||"#000000").multiplyScalar(4),m.add($e(Pa,30,{iA:Dt,iB:Lt},dn,6)),await r.yield();const $t=Math.round(330*Re(Y,.85,1.2)*Math.max(X,.75)),Ue=c.fork("divers"),Oo=new Float32Array($t*4),Io=new Float32Array($t*4),go=(e,a)=>{const o=e-Be.x,n=a-Be.z,l=Re(-(o*Ne.x+n*Ne.z),0,48);return Math.hypot(o+Ne.x*l,n+Ne.z*l)};for(let e=0;e<$t;e++){for(let a=0;a<8;a++){const o=Math.sqrt(Kt(625,5184,Ue())),n=Ue.range(0,ce),l=Be.x+Math.cos(n)*o,d=Be.z+Math.sin(n)*o,v=Ue.range(0,ce),w=Ue.range(13,24),b=Ue.range(8,14),R=Ue.range(22,48),M=Ue.range(8,13.5),O=Ue(),J=l-Math.cos(v)*b+Math.sin(v)*w,ee=d-Math.sin(v)*b-Math.cos(v)*w,se=go(l,d)>15&&go(J,ee)>w+9;if(se||a===7){if(Oo.set([l,d,R,O],e*4),Io.set([M,w,v,b],e*4),se)break}else continue;e:for(let ie=o;;ie=Math.min(ie+2,72)){for(let de=1;de<630;de++){const xe=(de&1?.01:-.01)*(de+1>>1),Ee=Be.x+Math.cos(n+xe)*ie,je=Be.z+Math.sin(n+xe)*ie,Ge=v+xe;if(go(Ee,je)>15&&go(Ee-Math.cos(Ge)*b+Math.sin(Ge)*w,je-Math.sin(Ge)*b-Math.cos(Ge)*w)>w+9){Oo.set([Ee,je],e*4),Io[e*4+2]=Ge,Xt.diversMoved++;break e}}if(ie===72)break}}e%60===59&&await r.yield()}await r.yield();const pn=$e(Qt,$t,{iA:Oo,iB:Io},Pt(De,Ct.diver));m.add(pn),await r.yield();const Qo=$t+Math.round(170*X),Fa=new Float32Array(Qo*4),Ta=new Float32Array(Qo*4);Fa.set(Oo),Ta.set(Io);for(let e=$t;e<Qo;e++)for(let a=0;a<6;a++){const o=Math.sqrt(Kt(529,5625,Ue())),n=Ue.range(0,ce),l=Be.x+Math.cos(n)*o,d=Be.z+Math.sin(n)*o,v=Ue.range(4.5,8),w=Ue();if(go(l,d)>13||a===5){Fa.set([l,d,0,w],e*4),Ta.set([v,0,0,0],e*4);break}}await r.yield();const Jt=new t.BufferGeometry;{const e=[],a=[];for(let o=0;o<3;o++)e.push(-1,-1,o,1,-1,o,1,1,o,-1,1,o),a.push(o*4,o*4+1,o*4+2,o*4,o*4+2,o*4+3);Jt.setAttribute("position",new t.BufferAttribute(new Float32Array(e),3)),Jt.setAttribute("aK",new t.BufferAttribute(new Float32Array(e),3)),Jt.setIndex(a)}const Ho=sn(De);Ho.uniforms.uTrailGlow.value.set(i.trail||"#000000").multiplyScalar(4);const vn=$e(Jt,Qo,{iA:Fa,iB:Ta},Ho,5);m.add(vn),await r.yield();const Ba=new t.BufferGeometry;{const o=[0,0,0],n=[];for(let l=1;l<=22;l++)for(let d=0;d<72;d++){const v=d/72*ce,w=96*l/22;o.push(Math.cos(v)*w,0,Math.sin(v)*w)}for(let l=0;l<72;l++)n.push(0,1+(l+1)%72,1+l);for(let l=0;l+1<22;l++)for(let d=0;d<72;d++){const v=1+l*72+d,w=1+l*72+(d+1)%72,b=v+72,R=w+72;n.push(v,w,R,v,R,b)}Ba.setAttribute("position",new t.BufferAttribute(new Float32Array(o),3)),Ba.setIndex(n)}const Vt=Us(De,lo[6]);Vt.uniforms.uHole={value:new t.Vector3(-Ne.z*33-Ne.x*4,Ne.x*33-Ne.z*4,0)},Vt.uniforms.uEyeK.value=L==="night"?.8:1;const yo=new t.Mesh(Ba,Vt);yo.position.copy(Be),yo.frustumCulled=!1,yo.renderOrder=4,m.add(yo),await r.yield();const ms=me.fall,Da=co.clone().addScaledVector(ms,20).add(new t.Vector3(Ne.z,0,-Ne.x).multiplyScalar(19)),xo=Lo.makeFishSchool({rng:c.fork("ball"),species:"sardines",count:Math.round(2e3*X),center:[0,0,0],radius:.4,drift:.05,spread:[7.4,6.6],size:4.6,rim:.8,top:"#93a4a8",belly:"#eef4f3",fin:"#b4c0c2",spec:5,vivid:0,light:{sunDir:new t.Vector3(.1,1,.1).normalize(),sunColor:"#f2fff8",sunIntensity:2.6,sky:"#bfe8da",skyIntensity:1.9,ground:"#1f5a4a",groundIntensity:.8}});xo.object.position.copy(Da),xo.object.visible=!1,m.add(xo.object);const eo=new t.Mesh(new t.IcosahedronGeometry(1,3),new t.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!1,uniforms:{uCol:{value:new t.Color(i.waterDeep).multiplyScalar(.5)}},vertexShader:"varying vec3 vN, vV; void main() { vec4 mv = modelViewMatrix * vec4(position, 1.); vV = mv.xyz; vN = normalMatrix * normal; gl_Position = projectionMatrix * mv; }",fragmentShader:`uniform vec3 uCol; varying vec3 vN, vV; void main() { float f = clamp(dot(normalize(vN), -normalize(vV + vec3(0., 0., -1e-6))), 0., 1.), d = length(vV) * .016;
        gl_FragColor = vec4(uCol, smoothstep(.05, .75, f) * .93 * exp(-d * d)); }`}));eo.position.copy(Da),eo.scale.set(5,4.5,5),eo.renderOrder=1,eo.visible=!1,m.add(eo),await r.yield();const wn=$n(De,.35),nt=new t.Group;nt.rotation.order="YXZ",nt.position.copy(St),nt.rotation.y=.5,nt.add(new t.Mesh(Os(c.fork("trawler")),wn)),await r.yield();const gn=new t.MeshBasicMaterial({color:new t.Color(5.2,3.5,1.8),fog:!0}),La=new t.Mesh(new t.BoxGeometry(1.9,.85,.1),gn);La.position.set(-1.1,3.3,-4.36);const yn=new t.Mesh(new t.BoxGeometry(.1,.85,1.7),gn);yn.position.set(-2.34,3.3,-5.3),nt.add(La,yn),m.add(nt),await r.yield();const ds=ht.add(Vo.makeGlow({position:[St.x,3.5,St.z],color:"#FFC27A",size:9,intensity:L==="night"?2.2:1.5,time:It})),xn=new t.Vector3(Math.sin(.5)*14.5,0,Math.cos(.5)*14.5).add(St),Xo=c.fork("bow"),bn=new Float32Array(40),Mn=new Float32Array(40);for(let e=0;e<10;e++)bn.set([xn.x+Xo.range(-2.5,2.5),xn.z+Xo.range(-2.5,2.5),0,Xo()],e*4),Mn.set([Xo.range(2.6,3.6),0,0,0],e*4);const Uo=sn(De);Uo.uniforms.uPlume.value=2.3,Uo.uniforms.uPatch.value=.5,m.add($e(Jt,10,{iA:bn,iB:Mn},Uo,5)),await r.yield();const lr=[[-400,30,24,8.5],[-428,-72,18,7]].map(([e,a,o,n],l)=>{const d=new t.Mesh(Is(c.fork("skerry"+l),r.noise,o,n,l*13.7),wn);return d.position.set(e,-1.2,a),m.add(d),d});await r.yield();const Zo={sunDir:S.clone(),sunColor:i.key,sunIntensity:i.keyK*1.7,sky:os(q),skyIntensity:1.5,ground:os(C),groundIntensity:1.3},Va=[5,2.5,4,.35],ps=[()=>Lo.makeFlock({rng:c.fork("gulls"),species:"gulls",count:16,wander:Va,center:[St.x-14,15,St.z+30],radius:30,height:9,size:1.1,light:Zo}),()=>Lo.makeFlock({rng:c.fork("kitti"),species:"gulls",count:Math.round(30*Y),wander:Va,center:[84,30,8],radius:26,height:14,size:.85,body:"#e9ebe8",wingC:"#9aa4ac",tip:"#15181a",light:Zo}),()=>Lo.makeFlock({rng:c.fork("fulmar"),species:"gulls",count:Math.round(25*Y),wander:Va,center:[78,18,-34],radius:24,height:8,size:.95,glide:.92,body:"#dcdcd4",wingC:"#7d868c",tip:"#6c747a",light:Zo}),()=>Lo.makeFlock({rng:c.fork("guille"),species:"swifts",count:Math.round(60*Y),center:[0,5,0],radius:96,height:2.5,wobble:.15,wander:[9,1,8,.7],size:1.5,speed:19,flap:9,glide:0,body:"#14171a",belly:"#e4e4dc",wingC:"#181b1e",tip:"#101214",light:Zo})],kn=[],to=.5,fe=720,Yo=[],qa=new Float64Array(fe),Na=new Float64Array(fe),zn=new Float64Array(fe),An=new Float64Array(fe),Ra=new Uint8Array(1025),vs=[];for(let e=0;e<1025;e++)Ra[e]=Math.atan(e/1024)/ce*fe;const ws=(e,a)=>{const o=Math.abs(e),n=Math.abs(a),l=o>=n?Ra[n/o*1024|0]:fe/4-1-Ra[o/n*1024|0];return e<0?a<0?fe/2+l:fe/2-1-l:a<0?fe-1-l:l};for(let e=0;e<fe;e++)e&1&&Yo.push(Q.rockColumn((e-1)*ce/fe)),qa[e]=Math.cos(e*ce/fe),Na[e]=Math.sin(e*ce/fe),zn[e]=1/(qa[e]||1e-12),An[e]=1/(Na[e]||1e-12);let gt=0,Ga=0,bo=0,$o=0;for(;Yo[0](gt);)gt--;for(;Yo[0](Ga);)Ga++;const qt=Ga-gt,Jo=new Float32Array((fe/2+1)*qt),Sn=async e=>{const a=Math.min(Math.ceil(e)-gt,qt-1);for(let o=0;o<=fe/2&&a>bo;o++){for(let n=bo+1;n<=a;n++)$o=Math.max($o,Jo[o*qt+n]=Yo[o%(fe/2)](n+gt));o%24===23&&await r.yield()}bo=Math.max(bo,a)},Cn=new Float32Array(720*172),Wa=(e,a)=>Cn[e%720+a*720]||(Cn[e%720+a*720]=Q.surfRadius(e*ce/720,a)),N=1440,st=.25,yt=.5,_a=.5,ea=.5,Pn=6,Fn=30,gs=10,ys=2,xs=24,bs=60,oo=72,ge=Q.rockGeometry.attributes.position.array,Nt=Q.rockGeometry.index.array,Mo=Nt.length/3,_e=new Float64Array(N+1),Ze=new Float64Array(N+1),Ea=new Uint16Array(1025);for(let e=0;e<=N;e++)_e[e]=Math.cos(e*ce/N),Ze[e]=Math.sin(e*ce/N);for(let e=0;e<1025;e++)Ea[e]=Math.atan(e/1024)/ce*N;let ja=1e9,ta=-1e9,xt=0,ko=0;for(let e=0;e<ge.length;e+=3)ja=Math.min(ja,ge[e+1]),ta=Math.max(ta,ge[e+1]),xt=Math.max(xt,ge[e]*ge[e]+ge[e+2]*ge[e+2]);xt=Math.sqrt(xt);const Ye=Math.floor(ja),oa=Math.ceil((ta-Ye)/st)+1,Pe=new Float32Array(N*oa),aa=new Int32Array(Mo),zo=new Int32Array(Math.ceil(ta-Ye)+2),Ka=new Int32Array(Mo);for(let e=0;e<Mo;e++)aa[e]=Math.floor(Math.min(ge[Nt[e*3]*3+1],ge[Nt[e*3+1]*3+1],ge[Nt[e*3+2]*3+1])-Ye),zo[aa[e]+1]++;for(let e=1;e<zo.length;e++)zo[e]+=zo[e-1];for(let e=0;e<Mo;e++)Ka[zo[aa[e]]++]=e;const Oa=(e,a,o)=>{for(let n=N;n--&&_e[e]*o-Ze[e]*a<0;)e=e?e-1:N-1;for(let n=N;n--&&_e[e+1]*o-Ze[e+1]*a>=0;)e=e+1<N?e+1:0;return e},Ia=(e,a)=>{const o=Math.abs(e),n=Math.abs(a),l=o>=n?Ea[n/o*1024|0]:N/4-1-Ea[o/n*1024|0];return Oa(e<0?a<0?N/2+l:N/2-1-l:a<0?N-1-l:l,e,a)},Ao=(e,a,o,n,l,d,v,w)=>{const b=Math.sqrt(e*e+a*a),R=Math.sqrt(n*n+l*l);if(b>Pe[v+o]&&(Pe[v+o]=b),R>Pe[v+d]&&(Pe[v+d]=R),w&&(b>Pe[w+o]&&(Pe[w+o]=b),R>Pe[w+d]&&(Pe[w+d]=R)),o===d)return;let M=(d-o+N+N/2)%N-N/2;const O=M<0?-1:1;for(;M!==0;M-=O){const J=O>0?o+1:o,ee=(o+O+N)%N,se=_e[J]*a-Ze[J]*e,ie=_e[J]*l-Ze[J]*n,de=se/(se-ie),xe=(e+de*(n-e))*_e[J]+(a+de*(l-a))*Ze[J];xe>Pe[v+o]&&(Pe[v+o]=xe),xe>Pe[v+ee]&&(Pe[v+ee]=xe),w&&(xe>Pe[w+o]&&(Pe[w+o]=xe),xe>Pe[w+ee]&&(Pe[w+ee]=xe)),o=ee}},na=async e=>{const a=Math.floor(e-Ye);for(;ko<Mo&&aa[Ka[ko]]<=a;ko++){const o=Ka[ko]*3;let n=Nt[o]*3,l=Nt[o+1]*3,d=Nt[o+2]*3,v;ge[n+1]>ge[l+1]&&(v=n,n=l,l=v),ge[l+1]>ge[d+1]&&(v=l,l=d,d=v),ge[n+1]>ge[l+1]&&(v=n,n=l,l=v);const w=ge[n],b=ge[n+1],R=ge[n+2],M=ge[l],O=ge[l+1],J=ge[l+2],ee=ge[d],se=ge[d+1],ie=ge[d+2],de=Math.min(oa-1,Math.floor((se-Ye)/st)),xe=Ia(M,J);let Ee=w,je=R,Ge=w,ye=R,it=Ia(w,R),Fe=it,Ve=!1;for(let et=Math.max(0,Math.floor((b-Ye)/st));et<=de;et++){const pe=Ye+(et+1)*st,lt=pe>=se||et===de,Ke=et*N;let Oe=ee,He=ie,Se=ee,We=ie;if(!lt){const qe=(pe-b)/(se-b);if(Oe=w+qe*(ee-w),He=R+qe*(ie-R),pe<O){const Xe=(pe-b)/(O-b);Se=w+Xe*(M-w),We=R+Xe*(J-R)}else{const Xe=(pe-O)/(se-O);Se=M+Xe*(ee-M),We=J+Xe*(ie-J)}}const dt=Oa(it,Oe,He),Co=!Ve&&(lt||O<=pe),tt=Oa(Co?xe:Fe,Se,We);Ao(Ee,je,it,Oe,He,dt,Ke,0),Co?(Ao(Ge,ye,Fe,M,J,xe,Ke,0),Ao(M,J,xe,Se,We,tt,Ke,0),Ve=!0):Ao(Ge,ye,Fe,Se,We,tt,Ke,0),lt||Ao(Oe,He,dt,Se,We,tt,Ke,Ke+N),Ee=Oe,je=He,Ge=Se,ye=We,it=dt,Fe=tt}ko&1023||await r.yield()}};for(const e of ps){const a=e(),o=a.geometry.attributes.iA.array,n=a.geometry.attributes.iB.array,l=a.uniforms.uWander.value,d=.84*a.uniforms.uNear.value.x,v=2.5+d,w=1.5*l.x+v+.5,b=l.z+v+.5,R=l.y+v+.25,M=[],O=[],J=[],ee=o.slice(),se=n.slice(),ie=Math.max(d,a.reach?a.reach.body:0),de=w-v+ie+to,xe=b-v+ie+to,Ee=l.y+ie+to,je=Math.hypot(de,xe),Ge=[],ye=[],it=new Int32Array(16),Fe=1.5*l.x,Ve=l.z,et=(xt+Math.hypot(Fe,Ve)+ie+to)*ce/N,pe=ie+to+(_a*_a+ea*ea+3*et*et)/(8*(ie+to)),lt=Math.hypot(Fe,Ve)+pe,Ke=(xt+lt)**2,Oe=l.y+pe+1,He=[],Se=new Float32Array(N),We=new Float32Array(N+1),dt=new Float32Array(N+1),Co=new Int32Array(16);let tt=1e9,qe=-1e9,Xe=1e9,_t=1e9,la=-1e9,ca=-1e9,Po=0,Ua=0,ct=null,fa=0,Et=0,so=0,Rn=0,ua=0,Fo=0,To=0;const Za=()=>{M.length=O.length=0,tt=Xe=_t=1e9,qe=la=ca=-1e9,fa=0;for(let s=0;s<a.route.length;s++)a.route.pointAt(s,Ae),M.push(Ae.x,Ae.y,Ae.z),tt=Math.min(tt,Ae.y),qe=Math.max(qe,Ae.y),Xe=Math.min(Xe,Ae.x-w),la=Math.max(la,Ae.x+w),_t=Math.min(_t,Ae.z-b),ca=Math.max(ca,Ae.z+b),fa=Math.max(fa,Math.hypot(Ae.x,Ae.z));for(let s=0;s<a.route.length;s+=_a)a.route.pointAt(s,Ae),O.push(Ae.x,Ae.y,Ae.z);Po=Math.ceil((la-Xe)/2)+1,Ua=Math.ceil((ca-_t)/2)+1,ct=new Float32Array(Po*Ua*2).fill(1e9);for(let s=0;s<M.length;s+=3)Cs(M[s],M[s+1],M[s+2])},Gn=(s,f)=>{const g=Math.floor((s-Xe)/2),u=Math.floor((f-_t)/2);return g>=0&&g<Po&&u>=0&&u<Ua?(g+u*Po)*2:-1},Cs=(s,f,g)=>{for(let u=Math.floor((s-w-Xe)/2);u<=(s+w-Xe)/2;u++)for(let k=Math.floor((g-b-_t)/2);k<=(g+b-_t)/2;k++){const B=(u+k*Po)*2;ct[B]=Math.min(ct[B],f),ct[B+1]=Math.min(ct[B+1],-f)}},ha=(s,f,g,u=[])=>{for(let k=0;k<g.length;k+=3){const B=Gn(g[k]-s,g[k+2]-f);if(B>=0&&ct[B]<1e8){const z=u.length-2,_=g[k+1]+ct[B+1]-R,I=g[k+1]-ct[B]+R;z>=0&&_<=u[z+1]&&I>=u[z]?(u[z]=Math.min(u[z],_),u[z+1]=Math.max(u[z+1],I)):u.push(_,I)}}return u},Ya=(s,f,g)=>{if(s<f&&tt+s-l.y<Ht+1)return!1;for(let u=0;u<g.length;u+=2)if(s>g[u]&&s<g[u+1])return!1;return!0},Ps=(s,f,g)=>{for(let u=0;u<J.length;u+=3){const k=Gn(J[u]-s,J[u+2]-g),B=J[u+1]-f;if(k>=0&&B>ct[k]-R&&B<R-ct[k+1])for(let z=0;z<M.length;z+=3){const _=Math.abs(J[u]-s-M[z])-1.5*l.x,I=Math.abs(J[u+2]-g-M[z+2])-l.z;if(_<v&&I<v&&Math.hypot(Math.max(_,0),Math.max(Math.abs(B-M[z+1])-l.y,0),Math.max(I,0))<v)return!1}}return!0},Wn=(s,f,g,u,k)=>{let B=-9;for(let z=0,_=Rn;z<M.length&&B<=k;z+=3,_=(_+3)%M.length){const I=M[_]+s,te=M[_+1]+f,P=M[_+2]+g,F=Math.hypot(I,P);if(F<80&&te<174){const p=Q.archHalf(te),G=p?Math.abs(I-Q.archCenter.x)-p:1e9,W=Math.floor((Math.atan2(P,I)/ce+1)*720),ne=Math.floor(Re(te,0,170)),K=Math.min(Math.ceil(58/F),360);let ae=Wa(W,ne);for(let H=W-K;H<W+K+2;H++)ae=u(ae,Wa(H,ne),Wa(H,ne+1));B=Math.max(B,u===Math.min?Math.min(ae-F,G-1.4):G<0?ae-F:Math.min(ae-F,G)),B>k&&(Rn=_)}}return B},_n=s=>{const f=new Float32Array(3*fe+2).fill(-1,0,fe);let g=1e9;for(let u=0;u<fe;u++){const k=s((u>>1)*qt,(u+1>>1)*qt)||NaN;f[fe+1+u]=k*qa[u],f[2*fe+1+u]=k*Na[u],k<g&&(g=k)}return f[3*fe+1]=g>je?Math.ceil(Math.asin(je/g)*fe/ce):fe/2,f},En=(s,f)=>{const g=zn[f],u=An[f],k=de*Math.abs(g),B=xe*Math.abs(u),z=s[3*fe+1]|0;let _=0;for(let I=f-z+fe,te=f+z+fe;I<=te;I++){const P=I%fe,F=s[fe+1+P]*g,p=s[2*fe+1+P]*u,G=Math.min(F+k,p+B);G>_&&Math.max(F-k,p-B)<=G&&(_=G)}return s[f]=_},Fs=s=>Ge[s+512]||(Ge[s+512]=_n((f,g)=>{let u=0;for(let k=Math.max(Math.round(s-.5-Ee)-gt,1),B=Math.min(Math.round(s+.5+Ee)-gt,bo);k<=B;k++)u=Math.max(u,Jo[f+k],Jo[g+k]);return u})),$a=(s,f,g,u)=>{const k=($o+je)**2,B=M.length/3|0;for(let z=0;z<B;z++){const _=(ma+(z&1?B-(z+1>>1):z>>1))%B,I=_*3,te=M[I]+s,P=M[I+2]+g,F=te*te+P*P;if(F<k){const p=u||Fs(Math.round(M[I+1]+f)),G=ws(te,P),W=(G+1)%fe,ne=Math.max(p[G]<0?En(p,G):p[G],p[W]<0?En(p,W):p[W]);if(F<ne*ne)return ma=_,!1}}return!0},Ja=(s,f)=>{for(let g=0;g<f.length;g+=2)if(s>f[g]&&s<f[g+1])return!1;return!0},en=(s,f,g)=>{const u=_e[g],k=Ze[g],B=1/(u||1e-12),z=1/(k||1e-12),_=Math.abs(B),I=Math.abs(z),te=s*B,P=f*z;let F=-1e9,p=Math.min(te+Fe*_,P+(Ve+pe)*I);if(p>=Math.max(te-Fe*_,P-(Ve+pe)*I)&&(F=p),p=Math.min(te+(Fe+pe)*_,P+Ve*I),p>F&&p>=Math.max(te-(Fe+pe)*_,P-Ve*I)&&(F=p),F>=Math.min(te+(Fe+pe)*_,P+(Ve+pe)*I))return F;for(let G=0;G<4;G++){const W=s-(G&1?Fe:-Fe),ne=f-(G&2?Ve:-Ve),K=W*k-ne*u,ae=pe*pe-K*K;ae>=0&&(p=W*u+ne*k+Math.sqrt(ae),p>F&&(F=p))}return F};for(let s=0;s<=N;s++)We[s]=en(0,0,s%N),dt[s]=Fe*Math.abs(_e[s])+Ve*Math.abs(Ze[s])+pe;const jn=(s,f,g,u,k,B,z,_)=>{const I=_e[f]*u,te=Ze[f]*k;let P=s.nu[f];if(!(P>0))return _;let F=P*I,p=P*te,G=Math.min(F+B,p+z);G>_&&G>=Math.max(F-B,p-z)&&(G=en(P*_e[f],P*Ze[f],g))>_&&(_=G);for(let W=s.xo[f],ne=s.xo[f+1];W<ne;W++)P=s.xr[W],F=P*I,p=P*te,G=Math.min(F+B,p+z),G>_&&G>=Math.max(F-B,p-z)&&(G=en(P*_e[f],P*Ze[f],g))>_&&(_=G);return _},Kn=(s,f)=>{const g=1/(_e[f]||1e-12),u=1/(Ze[f]||1e-12),k=(Fe+pe)*Math.abs(g),B=(Ve+pe)*Math.abs(u),z=s.bm,_=dt[f+N/4<N?f+N/4:f-3*N/4],I=dt[f],te=s.m>_?Math.ceil(Math.asin(_/s.m)*N/ce):N/2;let P=s.nu[f]>0?s.nu[f]+We[f]:0;for(let F=1,p=f;F<=te;F++){if(++p===N&&(p=0),!(p&7)&&z[p>>3]*Math.max(_e[F],0)+I<=P){F+=7,p+=7;continue}P=jn(s,p,f,g,u,k,B,P)}for(let F=1,p=f;F<=te;F++){if(p=p?p-1:N-1,(p&7)===7&&z[p>>3]*Math.max(_e[F],0)+I<=P){F+=7,p-=7;continue}P=jn(s,p,f,g,u,k,B,P)}return s.bar[f]=P},On=s=>{const f=new Float32Array(N),g=new Float32Array(N),u=new Float32Array(N),k=new Float32Array(N).fill(-1),B=new Int32Array(N+1),z=new Float32Array(N),_=new Float32Array(N>>3),I=[];let te=1e9,P=0;for(let W=0;W<N;W++){const ne=s[W?W-1:N-1],K=s[W],ae=ne>K?ne:K,H=ne>K?K:ne;f[W]=ae,B[W]=I.length,ae>0&&H<te&&(te=H),ae>P&&(P=ae),ae>_[W>>3]&&(_[W>>3]=ae);for(let ue=ae-ea;ue>H;ue-=ea)I.push(ue)}if(B[N]=I.length,!P)return{m:0,far:0};const F=te>lt?Math.ceil(Math.asin(lt/te)*N/ce):N/2,p=2*F+1,G=N+2*F;if(F>=N/2)z.fill(P);else{const W=new Float32Array(G),ne=new Float32Array(G);for(let K=0;K<G;K++){const ae=f[(K-F+N)%N];W[K]=K%p?Math.max(W[K-1],ae):ae}for(let K=G-1;K>=0;K--){const ae=f[(K-F+N)%N];ne[K]=K%p===p-1||K===G-1?ae:Math.max(ne[K+1],ae)}for(let K=0;K<N;K++)z[K]=Math.max(ne[K],W[K+2*F])}for(let W=0;W<N;W++){const ne=(W+1)%N,K=Math.max(z[W]+dt[W],z[ne]+dt[ne]),ae=Math.max(f[W]>0?f[W]+We[W]:0,f[ne]>0?f[ne]+We[ne]:0);g[W]=K*K,u[W]=ae*ae}return{nu:f,xo:B,xr:Float32Array.from(I),ub:g,lb:u,bar:k,bm:_,m:te,far:(P+lt)**2}},Ts=s=>{const f=s*yt-yt/2-l.y,g=s*yt+yt/2+l.y;Se.fill(0);for(let u=Math.max(0,Math.floor((f-pe-Ye)/st)),k=Math.min(oa-1,Math.floor((g+pe-Ye)/st));u<=k;u++){const B=Ye+u*st,z=Math.max(0,B-g,f-B-st);if(z>=pe)continue;const _=pe-Math.sqrt(pe*pe-z*z),I=u*N;for(let te=0;te<N;te++){const P=Pe[I+te]-_;P>Se[te]&&(Se[te]=P)}}return Se},In=s=>He[s+4096]||(To++,He[s+4096]=On(Ts(s))),Bs=async(s,f,g)=>{for(let u=0;u<O.length;u+=3){const k=O[u]+s,B=O[u+2]+g;k*k+B*B<Ke&&!He[Math.round((O[u+1]+f)/yt)+4096]&&(In(Math.round((O[u+1]+f)/yt)),To>=Pn&&(To=0,await r.yield()))}},Bo=(s,f,g,u)=>{const k=O.length/3|0;for(let B=0;B<k;B++){let z=Fo+(B&1?k-(B+1>>1):B>>1);z>=k&&(z-=k);const _=z*3,I=O[_]+s,te=O[_+2]+g,P=I*I+te*te;if(P>=Ke)continue;const F=u||He[Math.round((O[_+1]+f)/yt)+4096]||In(Math.round((O[_+1]+f)/yt));if(P>=F.far)continue;const p=Ia(I,te);if(P>=F.ub[p])continue;if(P<F.lb[p])return Fo=z,!1;const G=(p+1)%N,W=Math.max(F.bar[p]<0?Kn(F,p):F.bar[p],F.bar[G]<0?Kn(F,G):F.bar[G]);if(P<W*W)return Fo=z,!1}return!0},Qn=async(s,f,g,u)=>{await na(qe+s+Oe);for(let k=f;k<=g&&ye.length<u;k++)for(let B=0;B<(8*k||1)&&ye.length<u;B++){const z=B/(2*k)|0,_=B%(2*k)-k,I=2*(z===0?_:z===1?k:z===2?-_:-k)||0,te=2*(z===0?-k:z===1?_:z===2?k:-_)||0;(s>ft+9||Bo(I,0,te,Ns))&&Bo(I,s,te)&&Ja(s,ha(I,te,s>ft+9?le:Do))&&ye.push(I,s,te),B&63||await r.yield()}},Ds=async()=>{const s=a.route,f=s.data,g=s.N,u=f.slice(),k=new Uint8Array(oo),B=H=>{const ue=[1e9,1e9,1e9,-1e9,-1e9,-1e9];for(let he=0;he<g*4;he+=4)for(let Te=0;Te<3;Te++)ue[Te]=Math.min(ue[Te],H[he+Te]),ue[Te+3]=Math.max(ue[Te+3],H[he+Te]);return ue};let z=0,_=0,I=0,te=0;const P=B(u),F=a.bounds.radius-Math.hypot(P[3]-P[0],P[4]-P[1],P[5]-P[2])/2;for(let H=0;H<g;H++){const ue=(H+1)%g;z+=u[H*4]*u[ue*4+2]-u[ue*4]*u[H*4+2]}for(let H=0;H<Do.length;H+=3)k[Math.floor((Math.atan2(Do[H+2],Do[H])/ce+1)*oo)%oo]=1;for(let H=0;H<2*oo;H++)k[H%oo]?_=0:++_>te&&(te=_,I=H);const p=(I-(te-1)/2+.5)*ce/oo,G=Math.cos(p),W=Math.sin(p),ne=z<0?-1:1,K=Fn/2,ae=Math.PI*K;for(let H=xt-xs;H<=xt+bs;H+=ys){const ue=H+Fn,he=(s.length-2*ae)/(2*(H+ue)),Te=2*he*H,ro=2*he*ue,jt=Math.cos(he),da=Math.sin(he);if(he>0&&he<Math.PI/2){for(let ze=0;ze<g;ze++){let Ce=ze/g*s.length,pt,vt;if(Ce<Te)pt=H*Math.cos(Ce/H-he),vt=H*Math.sin(Ce/H-he);else if((Ce-=Te)<ae){const kt=Ce/K,zt=H+K-K*Math.cos(kt),At=K*Math.sin(kt);pt=zt*jt-At*da,vt=zt*da+At*jt}else if((Ce-=ae)<ro)pt=ue*Math.cos(he-Ce/ue),vt=ue*Math.sin(he-Ce/ue);else{const kt=(Ce-ro)/K,zt=H+K+K*Math.cos(kt),At=-K*Math.sin(kt);pt=zt*jt+At*da,vt=-zt*da+At*jt}f[ze*4]=pt*G-ne*vt*W,f[ze*4+2]=pt*W+ne*vt*G}s.texture.needsUpdate=!0,Za(),ye.length=0;for(let ze=ft;ze<=ft+9&&ye.length<a.count*3;ze++)await Qn(ze,0,gs,a.count*3);if(ye.length>=a.count*3){const ze=B(f);so=0;for(let Ce=0;Ce<a.count;Ce++){const pt=ee[Ce*4],vt=ee[Ce*4+1],kt=se[Ce*4+3];let zt=1e9,At=0;for(let io=0;io<ye.length;io+=3){const Xn=Math.hypot(ye[io]-pt,2*(ye[io+1]-vt),ye[io+2]-kt);Xn<zt&&(zt=Xn,At=io)}[o[Ce*4],o[Ce*4+1],n[Ce*4+3]]=ye.splice(At,3),so=Math.max(so,Math.hypot(o[Ce*4]-pt,o[Ce*4+1]-vt,n[Ce*4+3]-kt))}return a.bounds.center.set((ze[0]+ze[3])/2,(ze[1]+ze[4])/2,(ze[2]+ze[5])/2),a.bounds.radius=Math.hypot(ze[3]-ze[0],ze[4]-ze[1],ze[5]-ze[2])/2+F,1}}}return f.set(u),s.texture.needsUpdate=!0,Za(),ye.length=0,-1};await r.yield(),Za(),await r.yield();for(let s=1;s<o.length;s+=4)Et=Math.max(Et,o[s]);for(let s=0;s<le.length;s+=3)le[s+1]<qe+Et+25+R&&J.push(le[s],le[s+1],le[s+2]);await Sn(qe+Et+10+Ee),await na(qe+Et+9+Oe);let Mt=0,ma=0;const tn=Math.round(qe+Et+9)-gt,Ls=_n(s=>{let f=1e9;for(let g=1;g<=tn&&g<qt;g++)f=Math.min(f,Jo[s+g]);return tn>0&&tn<qt?f:0}),on=Ht+1+l.y-tt,ft=Math.ceil(on),Vs=Math.ceil((fa+$o+je)/2),Do=[];let an=ft;await na(qe+ft+9+Oe);const Hn=s=>{Se.fill(1e9);for(let f=Math.ceil(-Ye/st),g=Math.min(oa-1,Math.floor((s-Ye)/st));f<=g;f++)for(let u=0,k=f*N;u<N;u++)Pe[k+u]<Se[u]&&(Se[u]=Pe[k+u]);for(let f=0;f<N;f++)Se[f]>1e8&&(Se[f]=0);return On(Se)},qs=Hn(qe+Et+9),Ns=Hn(qe+ft+9);for(let s=0;s<le.length;s+=3)le[s+1]<qe+ft+9+R&&Do.push(le[s],le[s+1],le[s+2]);for(let s=0;s<a.count;s++){const f=o[s*4],g=o[s*4+1],u=n[s*4+3];let k=!1;if(!Ps(f,g,u)){const P=Wn(f,g,u,Math.min,1e9),F=P>.6?P-.5:-.6;let p=1e9;for(let G=0;G<3&&p>1e8;G++)for(let W=0;W<Math.min(p,G&1?92:62);W+=G&1||W<16?2:4)for(let ne=0,K=W?G&1?32:W<16?8:16:1;ne<K;ne++){const ae=f+W*Math.cos(ne*ce/K),H=u+W*Math.sin(ne*ce/K),ue=ha(ae,H,G>1?le:J);for(let he=0;he<(G>1?1801:101);he++){const Te=(he+1>>1)/2,ro=g+(he&1?Te:-Te),jt=Math.hypot(W,2*Te)+(Te>9?200:0);if(jt>=p)break;if(Ya(ro,g,ue)&&Wn(ae,ro,H,Math.max,F)<=F){p=jt,o[s*4]=ae,o[s*4+1]=ro,n[s*4+3]=H;break}}await r.yield()}k=p>1e8}const B=o[s*4],z=o[s*4+1],_=n[s*4+3];let I=z;if(z<on&&(await Sn(qe+z+1+Ee),!$a(B,z,_))){let P=1e9;I=1e9;for(let F=0;F<Math.min(P,62);F+=F<16?2:4){for(let p=0,G=F?F<16?8:16:1;p<G;p++){const W=f+F*Math.cos(p*ce/G),ne=u+F*Math.sin(p*ce/G);let K=0;if(ma=it[p*16/G],$a(W,0,ne,Ls))for(let ae=0;ae<37;ae++){const H=(ae+1>>1)/2,ue=g+(ae&1?H:-H),he=Math.hypot(F,2*H);if(he>=P)break;if(Ya(ue,g,K||vs)&&$a(W,ue,ne)&&(K||Ya(ue,g,K=ha(W,ne,J)))){P=he,I=ue;break}}it[p*16/G]=ma,K&&await r.yield()}await r.yield()}}const te=Math.min(Math.max(z,I),on);if(await na(qe+z+Oe),await Bs(B,z,_),!(Bo(B,z,_)&&(z>=te||tt+z-l.y>=Ht))){let P=1e9,F=-1;for(let p=0;p<Math.min(P,62);p+=p<16?2:4){for(let G=0,W=p?p<16?8:16:1;G<W;G++){const ne=f+p*Math.cos(G*ce/W),K=u+p*Math.sin(G*ce/W);let ae=0;if(Fo=Co[G*16/W],Bo(ne,0,K,qs))for(let H=0;H<37;H++){const ue=(H+1>>1)/2,he=g+(H&1?ue:-ue),Te=Math.hypot(p,2*ue);if(Te>=P)break;if(he>=te&&(!ae||Ja(he,ae))&&Bo(ne,he,K)&&(ae||Ja(he,ae=ha(ne,K,J)))){P=Te,o[s*4]=ne,o[s*4+1]=he,n[s*4+3]=K;break}To>=Pn&&(To=0,await r.yield())}Co[G*16/W]=Fo,ae&&await r.yield()}await r.yield()}if(P>1e8){for(;!ye.length&&Mt<3&&!(Mt===1&&!ua&&(ua=await Ds(),ua>0));)await Qn(an,Mt===1?31:0,Mt===1?Vs:30,Mt===1?a.count*3:1e9),++an>(Mt<2?ft+9:450)&&(Mt||(an=ft),Mt++);if(ua>0)break;for(let p=0;p<ye.length;p+=3){const G=Math.hypot(ye[p]-f,2*(ye[p+1]-g),ye[p+2]-u);G<P&&(P=G,F=p)}F>=0&&([o[s*4],o[s*4+1],n[s*4+3]]=ye.splice(F,3))}k=P>1e8}k&&Xt.flocks++,so=Math.max(so,Math.hypot(o[s*4]-f,o[s*4+1]-g,n[s*4+3]-u)),s%8===7&&await r.yield()}a.bounds.radius+=so,kn.push(a),m.add(a.object),await r.yield()}const Rt=c.fork("seals"),Tn=new Float32Array(32),Bn=new Float32Array(32);for(let e=0;e<8;e++)Tn.set([e<6?Rt.range(29.5,34.5):Rt.range(46,50),e<6?38-e*11.5+Rt.range(-3,3):Rt.range(-20,25),Rt.range(1.2,2.6),Rt()],e*4),Bn.set([Rt.range(1.15,1.45),0,0,0],e*4);await r.yield();const Ms=Pt({...De,uLeap:{value:T?1:0}},Ct.swim);m.add($e(Ks(c.fork("swimmer"),T),8,{iA:Tn,iB:Bn},Ms)),await r.yield();let Gt=null,Qe=null,Wt=null,sa=0;if(A==="rain"){Gt=new t.Mesh(new t.PlaneGeometry(1900,640),$s(new t.Color(i.zenith).lerp(new t.Color(i.fog),.2))),Gt.position.set(1800,318,0),Gt.rotation.y=-Math.PI/2,Gt.renderOrder=0,ht.object.add(Gt);const e=Math.atan2(-S.x,S.z),a=Math.acos(Re(Math.cos(41.5*Math.PI/180)/Math.max(Math.hypot(S.x,S.z),.75),-1,1)),o=n=>Math.abs(Math.atan2(Math.sin(n-Math.PI/2),Math.cos(n-Math.PI/2)));sa=o(e-a)<o(e+a)?e-a:e+a,Wt=new t.Mesh(new t.PlaneGeometry(1100,520),Js(S,L==="night"?.05:.15)),Wt.rotation.y=-sa,Wt.renderOrder=1,Wt.frustumCulled=!1,ht.object.add(Wt)}else A==="haar"&&ht.add(Vo.makeMist({rng:c.fork("haar"),time:It,count:70,area:[560,80,560],center:[0,228,0],size:[70,150],color:i.fog,opacity:.2,drift:[re.x*10,0,re.z*10],follow:!1}));await r.yield();const bt=new t.Vector3(Be.x-Ne.z*33-Ne.x*4,0,Be.z+Ne.x*33-Ne.z*4);if(y){const e=r.core.makeRng(r.core.hashSeed("minke:"+r.seed)),a=e.range(0,ce);Qe=new t.Mesh(Qs(),$n(De,.45,!0,.22)),Qe.position.set(bt.x,-6.2,bt.z),m.add(Qe),Qe.userData.pose={head:new t.Vector3(Math.sin(a),0,-Math.cos(a)),roll:e.range(-.6,.6),lean:e.range(.45,.62)},Vt.uniforms.uBack.value.set(-Math.sin(a),Math.cos(a),16,0);const o=30,n=new Float32Array(o*4),l=new Float32Array(o*4),d=c.fork("whale");for(let ee=0;ee<o;ee++){const se=d.range(0,ce),ie=d.range(3.4,6.6);n.set([bt.x+Math.cos(se)*ie,bt.z+Math.sin(se)*ie,0,d()],ee*4),l.set([d.range(1.4,2.4),0,0,0],ee*4)}const v=sn(De);v.uniforms.uPlume.value=0,v.uniforms.uPatch.value=.8;const w=$e(Jt,o,{iA:n,iB:l},v,5);m.add(w),Qe.userData.splash=v,await r.yield();const b=48,R=new Float32Array(b*4),M=new Float32Array(b*4),O=Math.atan2(bt.z-Be.z,bt.x-Be.x);for(let ee=0;ee<b;ee++){const se=O+d.range(-1.9,1.9),ie=d.range(7,15);R.set([bt.x+Math.cos(se)*ie,bt.z+Math.sin(se)*ie,se+d.range(-.4,.4),d()],ee*4)}const J=Pt({...De,uFlush:{value:0}},Ct.flush);m.add($e(Qt,b,{iA:R,iB:M},J)),Qe.userData.flush=J}const Dn=ht.add(Vo.makeMist({rng:c.fork("boilmist"),time:It,count:26,area:[170,4,150],center:[Be.x,4.5,Be.z],size:[24,50],color:new t.Color(i.foam).multiplyScalar(.7),opacity:.17,drift:[re.x*4,0,re.z*4],follow:!1}));await r.yield();const rt=new t.Mesh(new t.PlaneGeometry(2,2),Ys());rt.frustumCulled=!1,rt.renderOrder=60,rt.scale.setScalar(1e-5),m.add(rt),await r.yield(),await we.prewarm(r.renderer,null,m);const Le=new t.Vector3,Qa=new t.Vector3,Ln=new t.Quaternion,ao=new t.Vector3,Ha=new t.Vector3,Vn=new t.Vector3,ks=new t.Color(i.fog),zs=new t.Color("#C9D2D0").multiplyScalar(L==="night"?.4:.82);let no=!1,Xa=0,qn=0;const Nn=new t.Vector2(17,41),As=Dn.uniforms.uOpacity.value,ra=new t.Vector3,So=new t.Vector3,ia=new t.Vector3,Ss=new t.Matrix4;return{scene:m,path:Me,duration:rr,pace:wt,camera:ts,pois:ga,portal:{shape:"circle",radius:7,color:"#7FE6C8",glow:1,tilt:!0,revealDistance:140},post:{exposure:i.exposure,bloom:{strength:.32,radius:.6,threshold:.93},grade:{saturation:i.sat,contrast:1.07,tint:i.tint,shadowTint:i.shadowTint,vignette:0,grain:.03,aberration:0}},ride:"great-bird",seaClamp:ba,seaPlace:Ma,seaPools:cn,seaCalm:fn,seaMain:Go,anchors:Z,update(e,a,o,n){o.getWorldPosition(Le),o.getWorldDirection(Qa),o.getWorldQuaternion(Ln),It.value=a,De.uSeaC.value.copy(Le);const l=za[0],d=(Math.PI/2-(l.z*(l.x*Nn.x+l.y*Nn.y)-l.w*a+ho[0].z))/ce,v=(d-Math.floor(d))*ce/l.w;let w;n>Z.burst0&&n<Z.burst1?(w=(n-Z.burst0)/(Z.burst1-Z.burst0),no=!0):n>Z.burst0-.12&&n<=Z.burst0?((v>6.2||v<Xa)&&(no=!0),w=no?1:v/6.2):(no&&v<Xa&&(no=!1),w=no?1:v/6.2),Xa=v,oe.setBurst(Re(w,0,1)),oe.update(e,a,o);const b=be(Z.archIn-.012,Z.archIn+.004,n)*(1-be(Z.archIn+.008,Z.archIn+.03,n));xa.color.copy(ks).lerp(zs,b*.5),xa.density=$*(1+3*b),we.update(e,a,o),ya.update(e,a,o),ht.update(e,a,o),uo.position.copy(Le);for(let se=0;se<4;se++)Wo[se].w=ln[se]*(.7+.3*Math.sin(a*.55*(.35+ka[se]*.5)+ka[se]*20));_o.w=a;const R=Tt.update(e,a,o,m);De.uSeaC.value.copy(Le),Me.tangentAt(n,ao).normalize(),Ha.crossVectors(ao,rn).normalize(),Vn.crossVectors(Ha,ao),at.uCam.value.copy(Le),at.uPF.value.copy(ao),at.uPR.value.copy(Ha),at.uPU.value.copy(Vn),at.uHead.value.copy(ao),at.uEsc.value.set(be(Z.climb1+.03,Z.hang0-.005,n),be(Z.hang1+.02,Z.fall0,n)+be(Z.spear-.006,Z.spear+.004,n),be(Z.chase0,Z.chase0+.02,n)*(1-be(Z.chase1-.02,Z.chase1,n)),0);const M=Math.asin(Re(ao.y,-1,1))-Math.asin(Re(Qa.y,-1,1));qn=Re(Math.tan(Re(M,0,1.1))*.74,0,.85)*be(Z.hang0-.03,Z.hang0+.02,n),at.uEsc.value.w=qn,yo.visible=!R,Ho.uniforms.uSub.value=R?1:0,Uo.uniforms.uSub.value=R?1:0,Vt.uniforms.uEyeNear.value=be(7,30,Le.y),Dn.uniforms.uOpacity.value=As*(1-be(18,60,Le.y))*(1-be(300,430,Math.hypot(Le.x-Be.x,Le.z-Be.z))),Wt&&Wt.position.set(Le.x+2e3*Math.sin(sa),180,Le.z-2e3*Math.cos(sa)),Ho.uniforms.uGrow.value=be(45,170,Le.y),Sa.visible=n<Z.archIn+.03,pn.visible=vn.visible=!Sa.visible;const J=Le.y-Ro(Le.x,Le.z,a);xo.object.visible=eo.visible=J<6&&Le.distanceToSquared(Da)<25600,xo.update(e,a,o,n);for(const se of kn)se.update(e,a,o,n);nt.position.y=Ro(St.x,St.z,a)*.6+.25,nt.rotation.x=.21*Math.sin(a*.85),nt.rotation.z=.07*Math.sin(a*.6+1),nt.updateMatrixWorld(),La.getWorldPosition(ds.object.position);const ee=n>Z.fall0?(1-be(.4,J>0?3.9:2.9,Math.abs(J)))*.88:0;if(rt.material.uniforms.uA.value=ee,rt.material.uniforms.uTime.value=a,ee>.002?(rt.scale.set(3.2,2.2,1),rt.position.copy(Le).addScaledVector(Qa,.8),rt.quaternion.copy(Ln)):rt.scale.setScalar(1e-5),Gt&&(Gt.material.uniforms.uTime.value=a),Qe){const se=be(Z.whale0,Z.whale0+.022,n)*(1-be(Z.whale0+.07,Z.whale0+.092,n)),ie=Qe.userData.pose,de=Kt(1,ie.lean,se);at.uPart.value=se,Qe.position.y=-6.2+7.5*se,Qe.userData.splash.uniforms.uPlume.value=.5*se,Qe.userData.splash.uniforms.uSub.value=R?1:0,ra.copy(ie.head).multiplyScalar(Math.sin(de)).addScaledVector(rn,Math.cos(de)),So.copy(rn).multiplyScalar(Math.sin(de)).addScaledVector(ie.head,-Math.cos(de)),ia.crossVectors(So,ra),So.multiplyScalar(Math.cos(ie.roll)).addScaledVector(ia,Math.sin(ie.roll)),ia.crossVectors(So,ra).normalize(),Qe.quaternion.setFromRotationMatrix(Ss.makeBasis(ia,So,ra)),Vt.uniforms.uBack.value.w=se,Vt.uniforms.uHole.value.z=be(Z.whale0-.012,Z.whale0+.02,n)*(1-be(Z.whale0+.075,Z.whale0+.1,n)),Qe.userData.flush.uniforms.uFlush.value=Re((n-Z.whale0+.004)/.075,0,1)}},dispose(){we.dispose(),ut.dispose()}}}};export{hr as default};
