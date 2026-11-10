import*as x from"three";import{Geo as O,col as k,rngOf as K,resolveRoute as ee,routeBounds as te,sphereOfPoints as ae,creatureMaterial as Y,instancedGeo as J,creatureMesh as N,triCount as Q,applyLight as U}from"./common.js";const X={sardines:{len:.2,depth:.2,width:.11,tailH:.23,tailL:.2,dorsal:.5,paint:0,lod:"low",count:2e3,form:"baitball",spread:[6,4.8],speed:3.2,size:2.1,swim:[3.2,.09,5.5],top:"#3c5f78",belly:"#e6f0f4",fin:"#8aa4b4",spec:2.6,shine:18},mackerel:{len:.4,depth:.2,width:.12,tailH:.3,tailL:.22,dorsal:.6,paint:0,count:220,form:"school",spread:[10,4,26],speed:4.5,size:1.5,swim:[2.6,.08,5.5],wander:[.8,.5,.6,.5],top:"#2e6a70",belly:"#e8eef0",fin:"#6f8c96",spec:2.2,shine:20},reef:{len:.24,depth:.42,width:.14,tailH:.34,tailL:.24,dorsal:1,paint:1,lod:"high",count:160,form:"school",spread:[12,5,16],speed:1.6,size:1.6,swim:[2.4,.07,4.5],wander:[2.2,1.2,2,.45],top:"#ffffff",belly:"#ffffff",fin:"#ffffff",spec:.5,shine:16,varieties:[["#ff7a1a","#ffffff"],["#1f6fe0","#ffd21f"],["#ffd91f","#fff3a0"],["#f4f4f0","#16161a"],["#18b8a8","#ff6fa8"],["#ff5f7a","#8a3fd0"],["#2a4cff","#101018"]]},koi:{len:.6,depth:.27,width:.2,tailH:.36,tailL:.3,dorsal:.7,paint:2,lod:"high",count:14,form:"pond",spread:[9,.25],speed:.55,size:1.4,swim:[1.1,.085,4.2],top:"#ffffff",belly:"#ffffff",fin:"#ffffff",spec:.9,shine:30,varieties:[["#f8f4ec","#ff5a14"],["#f8f4ec","#e8281a"],["#ff8a1f","#f8f4ec"],["#f6f2ea","#18181c"],["#ffc21f","#ff6a14"]]},glowfish:{len:.22,depth:.3,width:.12,tailH:.3,tailL:.26,dorsal:.8,paint:0,count:300,form:"school",spread:[12,5,26],speed:3,size:1.6,swim:[2.8,.08,5],wander:[1.2,.8,1,.5],top:"#12303c",belly:"#1c5060",fin:"#2a7a88",spec:.6,shine:16,glow:"#38ffe0",glowK:2.2}};function ne(e,t="high"){const c=new O,n=e.len,r=e.depth*n*.5,m=e.width*n*.5,p=t==="high",P=t==="mid",C=e.paint>0,V=C?new x.Color(.8,0,0):k(e.top),R=C?new x.Color(1,0,0):k(e.belly),u=C?new x.Color(.9,1,0):k(e.fin),M=p?[[-.5,0],[-.44,.17],[-.3,.42],[-.12,.84],[.08,1],[.26,.9],[.4,.6],[.47,.32],[.5,0]]:P?[[-.5,0],[-.42,.2],[-.16,.78],[.12,1],[.38,.62],[.5,0]]:[[-.5,0],[-.4,.22],[.05,1],[.38,.62],[.5,0]],G=M.map(([b,o],l)=>({z:b*n,y:(l===M.length-1?-.12:0)*r,rx:m*(l===1?o*.55:o),ry:r*o})),L=c.loft(G,{sides:p?8:P?5:4,top:V,belly:R,shade:[-.35,.45]});C&&c.paint(L,(b,o,l,d)=>{const f=l/n;if(e.paint===1){const w=Math.max(0,1-Math.abs(f-.22)/.07)+Math.max(0,1-Math.abs(f+.12)/.08)+Math.max(0,1-Math.abs(f+.4)/.06);d.g=Math.min(1,w*1.6),d.b=(f>.38&&o>0,0)}else d.g=0,d.b=0}),!C&&(p||P)&&c.glow(L,(b,o,l)=>Math.abs(o)<r*.25?1:0);const v=-.45*n,A=e.tailH*n,z=e.tailL*n,h=[];if(h.push(c.fan([[0,0,v+.04*n],[0,A*.55,v-z],[0,A*.12,v-z*.55],[0,0,v-z*.45],[0,-A*.12,v-z*.55],[0,-A*.55,v-z]],u)),p){const b=e.dorsal;h.push(c.fan([[0,r*.9,.2*n],[0,r*(.95+.75*b),.02*n],[0,r*(.75+.5*b),-.2*n],[0,r*.5,-.3*n]],u)),h.push(c.fan([[0,-r*.85,-.02*n],[0,-r*(.9+.5*b),-.14*n],[0,-r*.5,-.3*n]],u));for(const o of[-1,1])h.push(c.fan([[o*m*.9,-r*.25,.22*n],[o*(m+.16*n),-r*.6,.06*n],[o*(m+.05*n),-r*.75,.1*n]],u))}else P&&h.push(c.fan([[0,r*.9,.2*n],[0,r*(.95+.7*e.dorsal),0],[0,r*.55,-.28*n]],u));for(const b of h)c.anim(b,()=>[1,0,0,0]);return c.build()}const ie=`
uniform float uTravel, uSpeed, uGlowK; uniform vec4 uWander, uSwim, uBall; uniform vec3 uCenter;
uniform vec3 uColA[8]; uniform vec3 uColB[8];
float nz3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); float n = i.x + i.y*57. + i.z*113.;
  return mix(mix(mix(h11(n), h11(n+1.), f.x), mix(h11(n+57.), h11(n+58.), f.x), f.y), mix(mix(h11(n+113.), h11(n+114.), f.x), mix(h11(n+170.), h11(n+171.), f.x), f.y), f.z); }
`,oe=`
vec3 traj(float q){
  float seed = iB.z; vec3 h = h31(seed);
#if FORM == 1
  // bait ball: every fish circles a shared axis, the ball breathes and leans
  float s = uTravel + (q - uTime) * uSpeed * .15;  // uTravel already runs at the slow centre speed
  vec3 c = routeAt(s); gFade = endFade(s);
  float r = iA.x, a = iA.z + q * uSpeed / max(r, 1.5) * uBall.x;
  float br = 1. + uBall.y * sin(q * .6 + iA.y * .35) + uBall.y * .6 * sin(q * .37 + a * 2.);
  vec3 o = vec3(cos(a) * r * br, iA.y * (1. + .5 * uBall.y * sin(q * .45 + 1.)) + sin(q * 1.3 * (.6 + h.x) + h.y * 30.) * uWander.y, sin(a) * r * br);
  o.xy = rot2(uBall.z * sin(q * .23)) * o.xy; o.zy = rot2(uBall.z * sin(q * .17 + 2.)) * o.zy;
  return c + o;
#elif FORM == 2
  // pond: each fish idles along its own slow Lissajous loop, nearly level
  float sp = uSpeed * (.6 + .8 * h.x) / max(uBall.x, 1.), t = q * sp;
  vec3 o = vec3(sin(t + h.y * 6.283) + .45 * sin(t * 2.3 + h.z * 9.), 0., cos(t * .83 + h.x * 6.283) + .45 * sin(t * 1.7 + h.y * 12.)) * uBall.x * .6;
  o.y = sin(t * 1.3 + h.z * 20.) * uBall.y;
  return uCenter + vec3(iA.x, iA.y, iB.w) * .35 + o;
#else
  float s = uTravel + (q - uTime) * uSpeed - iA.z;
  gFade = endFade(s);
  vec3 w = vec3(sin(q * uWander.w * (.6 + .8 * h.x) + h.y * 40.), sin(q * uWander.w * 1.3 * (.5 + .9 * h.z) + h.x * 50.), sin(q * uWander.w * .8 * (.7 + .6 * h.y) + h.z * 60.)) * uWander.xyz;
  return routeAt(s) + vec3(iA.x, iA.y, iB.w) + w;
#endif
}
`,re=`
void deform(inout vec3 p, inout vec3 n){
  float seed = iB.z, zn = p.z / uSwim.w, w = .5 - zn;
  float a = uSwim.y * uSwim.w * (.12 + w * w);
  float arg = zn * uSwim.z + (uPhase * uSwim.x * (.8 + .4 * h11(seed)) + iA.w) * 6.2832;
  p.x += a * sin(arg);
  float slope = a * uSwim.z / uSwim.w * cos(arg) + 2. * w * uSwim.y * sin(arg) * -1.;
  n = normalize(vec3(n.x - slope * n.z, n.y, n.z + slope * n.x));
  gThin = aAnim.x;
#if PAINT == 1
  int v = int(iB.y + .5); vec3 A = uColA[v], B = uColB[v];
  vColor = mix(A, B, color.g) * color.r * iTint;
#elif PAINT == 2
  int v = int(iB.y + .5); vec3 A = uColA[v], B = uColB[v];
  vec3 pp = position / uSwim.w * vec3(3., 2., 3.2) + seed * 7.;
  float m = smoothstep(.42, .58, nz3(pp) + .25 * (h11(seed + 9.) - .5));
  float k = smoothstep(.6, .72, nz3(pp * 1.7 + 31.)) * step(.6, h11(seed + 5.));
  vColor = mix(mix(A, B, max(m, color.g * .6)), vec3(.03, .03, .04), k) * color.r * iTint;
#endif
  gEmit = uGlowColor * aGlow * uGlowK * (.6 + .4 * sin(uTime * 2. + seed * 9.));
}
`;function de(e={}){const t=K(e),c=e.species||e.preset||"sardines",n=X[c]||X.sardines,r=i=>e[i]??n[i],m={...n};for(const i of["top","belly","fin"])e[i]!==void 0&&(m[i]=e[i]);const p=Math.max(1,Math.floor(r("count"))),P=r("form"),C=r("size"),V=e.lod||(p>900?"low":n.paint?"high":p>150||n.lod==="low"?"mid":"high"),R=ne(m,V),u=r("spread"),M=r("speed"),G=r("swim"),L=r("wander")||[.3,.3,.3,.5],v=P==="pond",A=P==="baitball",z=e.center?e.center.isVector3?e.center.clone():new x.Vector3(...e.center):new x.Vector3(0,-12,0),h=v?null:ee({...e,speed:A?e.drift??M*.15:M},t,{center:[z.x,z.y,z.z],radius:A?8:45,height:A?2:5,span:260}),b=(e.varieties||n.varieties||[["#ffffff","#ffffff"]]).slice(0,8),o=b.length,l=[],d=[];for(let i=0;i<8;i++){const s=b[i%o];l.push(k(s[0])),d.push(k(s[1]))}const f=new Float32Array(p*4),w=new Float32Array(p*4),E=new Float32Array(p*3);for(let i=0;i<p;i++){let s,F,I=0,_=0;if(A){const H=u[0]*(.3+.7*Math.pow(t(),.55)),j=t()*2-1,$=Math.sqrt(1-j*j);s=Math.max(.6,H*$),F=H*j*(u[1]/u[0]),_=t()*6.283}else if(v){const H=t()*6.283,j=Math.sqrt(t())*u[0];s=Math.cos(H)*j,I=Math.sin(H)*j,F=t.range(-1,1)*u[1]}else s=t.gauss()*u[0]*.45,F=t.gauss()*u[1]*.45,I=t.gauss()*u[0]*.45,_=t()*u[2];f.set([s,F,_,t()],i*4),w.set([C*t.range(.8,1.2),t.int(0,o-1),t()*100,I],i*4);const D=t.range(.85,1.12);E.set([D,D,D],i*3)}const W=Y({instanced:!0,route:h?h.route:null,light:e.light||"underwater",bank:e.bank??(v?0:.12),eps:v?.35:.15,pre:ie,traj:oe,deform:re,defines:{FORM:A?1:v?2:0,PAINT:n.paint},level:v?.3:1,near:[m.len*C*1.2,m.len*C*3.2],rim:e.rim??.5,vivid:e.vivid??(n.paint?.75:.2),spec:e.spec??n.spec,shine:n.shine,trans:.7,caustics:e.caustics??.6,glow:e.glow??n.glow??"#000000",uniforms:{uTravel:{value:0},uSpeed:{value:M},uGlowK:{value:e.glowIntensity??n.glowK??0},uCenter:{value:z},uWander:{value:new x.Vector4(L[0],A?e.jitter??.35:L[1],L[2],L[3])},uSwim:{value:new x.Vector4(G[0],G[1],G[2],m.len)},uBall:{value:v?new x.Vector4(u[0],u[1],0,0):new x.Vector4(e.spin??1,e.breathe??.14,e.lean??.25,0)},uColA:{value:l},uColB:{value:d}}});let B=0,q=0;for(let i=0;i<p;i++)B=Math.max(B,Math.hypot(f[i*4],f[i*4+1],w[i*4+3])),!A&&!v&&(q=Math.max(q,f[i*4+2]));const y=B*(A?1.45:1)+Math.hypot(L[0],L[1],L[2])+m.len*C*2+(v?u[0]*1.2:0),a=h?te(h,y,q):{sphere:new x.Sphere(z.clone(),y),follow(){}},g=J(R,p,f,w,E),S=N(g,W,0,a.sphere),T=W.uniforms;return{object:S,material:W,uniforms:T,geometry:g,count:p,route:h?h.route:null,bounds:a.sphere,species:c,lod:V,triangles:Q(R)*p,update(i,s,F,I){if(T.uTime.value=s,T.uQ.value=s,T.uPhase.value=s,h){const _=h.step(i,s,I);T.uPhase.value=s+h.state.extra,T.uVis.value=h.state.vis,T.uTravel.value=_,a.follow(_)}},setLight(i,s){U(T,i,s)},positionAt(i,s,F=new x.Vector3){return h?h.route.pointAt(h.travel(i,s),F):F.copy(z)}}}function le(e={}){const t=new O,c=e.radius??.5,n=e.height??c*.75,r=e.length??c*4.5,m=e.sides??14,p=e.rings??6,P=e.rnd||(()=>.5),C=k(e.bell??"#ffffff"),V=k(e.rim??"#ffffff"),R=k(e.arms??"#ffffff"),u=k(e.tentacles??"#ffffff"),M=[],G=new x.Color;for(let o=0;o<=p+1;o++){const l=Math.min(o,p)/p,d=l*Math.PI*.5,f=o>p?1:0,w=[];if(G.copy(C).lerp(V,l*l),o===0){w.push(t.v(0,n,0,G)),M.push(w);continue}for(let E=0;E<m;E++){const W=E/m*Math.PI*2,B=1+(o>=p?.05*Math.cos(W*m*.5):0),q=c*Math.pow(Math.sin(d),.85)*B*(f?.84:1);w.push(t.v(Math.cos(W)*q,n*Math.cos(d)-f*n*.18,Math.sin(W)*q,G))}M.push(w)}for(let o=0;o<M.length-1;o++)for(let l=0;l<m;l++){const d=(l+1)%m,f=M[o],w=M[o+1];f.length===1?t.tri(f[0],w[d],w[l]):t.quad(f[l],f[d],w[d],w[l])}const L=[0,t.n];t.anim(L,(o,l)=>[1-Math.max(0,Math.min(1,l/n)),0,0,0]),t.glow(L,(o,l)=>l/n<.14?1:.1);const v=e.armCount??4,A=r*(e.armLength??.55),z=9;for(let o=0;o<v;o++){const l=o/v*Math.PI*2+.4,d=Math.cos(l),f=Math.sin(l),w=d*c*.16,E=f*c*.16,W=P()*6.283,B=[[],[],[]];for(let a=0;a<=z;a++){const g=a/z,S=c*.24*Math.pow(1-g,.8)+c*.02,T=n*.4-g*A,i=c*.07*Math.sin(a*2.4+o)*(.3+g);for(let s=0;s<3;s++){const F=s-1;B[s].push([w-f*S*F+d*i*(s===1?-.6:1),T-(s===1?0:c*.03),E+d*S*F+f*i*(s===1?-.6:1)])}}const q=t.n;t.strip(B[0],B[1],R,R),t.strip(B[1],B[2],R,R);const y=[q,t.n];for(let a=q;a<t.n;a++){const g=Math.floor((a-q)/(2*(z+1))),S=(a-q)%2,T=g===0?S?0:-1:S?1:0;t.a[a*4]=T,t.a[a*4+1]=Math.max(0,(n*.4-t.p[a*3+1])/r),t.a[a*4+2]=W,t.a[a*4+3]=1,t.pv[a*3]=d,t.pv[a*3+1]=0,t.pv[a*3+2]=f}t.glow(y,.3)}const h=e.tentacleCount??12,b=7;for(let o=0;o<h;o++){const l=(o+.5)/h*Math.PI*2,d=Math.cos(l)*c*.86,f=Math.sin(l)*c*.86,w=[],E=[],W=P()*6.283,B=r*(.6+.4*P()),q=c*.02;for(let a=0;a<=b;a++){const g=a/b,S=-g*B,T=q*(1-g*.55);w.push([d-T,S,f]),E.push([d+T,S,f])}const y=t.strip(w,E,u,u);for(let a=y[0];a<y[1];a++){const g=t.p[a*3+1];t.a[a*4]=(a-y[0])%2?1:-1,t.a[a*4+1]=Math.max(0,-g/r),t.a[a*4+2]=W,t.a[a*4+3]=2,t.pv[a*3]=d,t.pv[a*3+1]=g,t.pv[a*3+2]=f}t.glow(y,(a,g)=>.35+.65*Math.max(0,-g/r))}return t.build()}const se=`
uniform vec4 uPulse; uniform vec3 uDrift; uniform float uLen, uMinPx, uR; varying float vFadeW;
float jellyYaw(float q){ vec3 h = h31(iB.z); return h.y * 6.283 + q * .05 * (h.z - .5); }
`,fe=`
vec3 traj(float q){
  vec3 h = h31(iB.z);
  float ph = (q * uPulse.x * (.75 + .5 * h.x) + iA.w) * 6.2832;
  vec3 p = iA.xyz;
  p.y += uPulse.z * (-.6 * cos(ph - .9) + .25 * sin(ph * 2. - .5)) * iB.x + uDrift.y * sin(q * .13 * (.6 + h.y) + h.z * 30.);
  p.xz += uDrift.xz * vec2(sin(q * .09 * (.5 + h.z) + h.x * 20.), cos(q * .07 * (.5 + h.x) + h.y * 20.));
  gYaw = jellyYaw(q);
  return p;
}
`,ce=`
void deform(inout vec3 p, inout vec3 n){
  vec3 h = h31(iB.z);
  float ph = (uTime * uPulse.x * (.75 + .5 * h.x) + iA.w) * 6.2832, part = aAnim.w, rimW = part < .5 ? aAnim.x : 0.;
  float s = .5 + .5 * sin(ph - rimW * 1.1); s = s * s * (3. - 2. * s);
  vFadeW = 1.;
  if(part < .5){
    float sq = 1. - uPulse.y * s * rimW * rimW;
    p.xz *= sq; p.y += rimW * s * uPulse.y * .5 * abs(p.y + .2) + (1. - rimW) * s * uPulse.y * .08;
    n.xz *= mix(1., .7, s * rimW); n = normalize(n);
  } else {
    float d = aAnim.y, r1 = aAnim.z, side = aAnim.x;
    vec3 ctr = part > 1.5 ? aPivot : p;
    float am = d * uLen * (part > 1.5 ? .16 : .09);
    vec3 sway = vec3(sin(ph * .5 - d * 5. + r1) * am + sin(uTime * .7 + d * 3. + r1 * 2.) * am * .6, d * uLen * .08 * sin(ph - 1.6 - d * 2.5), cos(ph * .5 - d * 4.2 + r1 * 1.7) * am + cos(uTime * .6 + d * 2.6 + r1) * am * .6);
    float pinch = 1. - uPulse.y * (.5 + .5 * sin(ph)) * (1. - d) * .8;
    if(part > 1.5){
      // billboard the ribbon around the vertical and keep it a pixel wide
      ctr.xz *= pinch; ctr += sway;
      float yaw = jellyYaw(uQ), cy = cos(yaw), sy = sin(yaw);
      vec3 toCam = cameraPosition - iA.xyz; vec2 vl = vec2(dot(toCam.xz, vec2(cy, -sy)), dot(toCam.xz, vec2(sy, cy)));
      vec2 wd = normalize(vec2(vl.y, -vl.x) + 1e-5);
      float w0 = abs(position.x - aPivot.x), sc = max(iB.x * uScale, 1e-3), hw = max(w0, length(toCam) * uMinPx / sc);
      vFadeW = w0 / hw;
      p = ctr + vec3(wd.x, 0., wd.y) * side * hw; n = normalize(vec3(vl.x, 0., vl.y) + 1e-5);
    } else {
      p.xz *= pinch; p += sway;
      p += aPivot * (uR * .09 * (.25 + d * 2.) * sin(d * 34. + side * 1.6 + r1 - uTime * 1.7) * (.4 + abs(side)));   // ruffles
    }
  }
  float tl = .12 * sin(uTime * .31 + h.z * 9.); p.xy = rot2(tl) * p.xy; n.xy = rot2(tl) * n.xy;
  gThin = part;
  gEmit = uGlowColor * aGlow * (uGlowAnim.x + uGlowAnim.y * s);
}
`,ue=`
#include <fog_pars_fragment>
uniform vec3 uSunDir, uSunColor, uSkyColor, uGroundColor, uInner; uniform float uRim, uOpacity, uBody, uR, uTime;
varying vec3 vColor, vN, vWorld, vEmit, vLocal; varying float vThin, vFadeW;
void main(){
  vec3 N = normalize(vN); if(!gl_FrontFacing) N = -N; vec3 V = normalize(cameraPosition - vWorld);
  float nv = abs(dot(N, V)), fr = pow(1. - nv, 2.2);
  vec3 hemi = mix(uGroundColor, uSkyColor, N.y * .5 + .5) + uSunColor * (.3 + .7 * max(dot(N, uSunDir), 0.) + .6 * pow(max(dot(-V, uSunDir), 0.), 4.));
  vec3 lit = vColor * hemi * .3183, emit; float a;
  if(vThin < .5){
    a = uOpacity * mix(.13, .8, fr);
    float r = length(vLocal.xz) / uR, th = atan(vLocal.z, vLocal.x);
    float t4 = mod(th + .7854, 1.5708) - .7854; vec2 p2 = r * vec2(cos(t4), sin(t4));
    float lobe = (1. - smoothstep(.03, .075, abs(length(p2 - vec2(.33, 0.)) - .13))) * smoothstep(.38, .3, abs(t4) * r + .12 * step(r, .2));   // four horseshoe gonads
    float cw = fwidth(th * 8.);
    float canal = (1. - smoothstep(.0, .2 + cw, abs(sin(th * 8.)))) * smoothstep(.5, .62, r) * (1. - smoothstep(.9, 1., r)) * (1. - smoothstep(.6, 1.6, cw));
    float margin = smoothstep(.8, .98, r);
    emit = vEmit * (.3 + 1.1 * fr) + uInner * (lobe * (.8 + .2 * sin(uTime * 1.3 + th * 2.)) + canal * .3);
    a = min(1., a + lobe * .3 + canal * .08 + margin * .12);
    lit *= uBody + uRim * fr;
  } else {
    float tent = step(1.5, vThin);
    a = uOpacity * mix(.34 + .3 * fr, .5, tent) * vFadeW;
    emit = vEmit * mix(.5, .55, tent) * vFadeW;
    lit *= uBody + .4;
  }
  vec3 c = lit * a + emit;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
    float ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
    float ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    c = mix(c, fogColor * a, ff);
  #endif
  gl_FragColor = vec4(c, a);
}
`,Z={moon:{bell:"#bfe0ff",rim:"#7fb4ff",arms:"#e8d8ff",tentacles:"#a8c8ff",glow:"#5a8cff",inner:"#ff9ad8",glowK:1.3,radius:.5,length:2,pulse:.42},ember:{bell:"#ffb070",rim:"#ff5a3c",arms:"#ffd0a0",tentacles:"#ff8a5a",glow:"#ff5a28",inner:"#ffd27a",glowK:1.5,radius:.55,length:3.2,pulse:.36},lagoon:{bell:"#8ff5e0",rim:"#28d0c0",arms:"#d8fff0",tentacles:"#6fe8d8",glow:"#20ffd0",inner:"#c8ff8a",glowK:1.4,radius:.45,length:2.4,pulse:.48},orchid:{bell:"#f0b0ff",rim:"#c060ff",arms:"#ffd8ff",tentacles:"#e090ff",glow:"#c050ff",inner:"#7ad8ff",glowK:1.5,radius:.5,length:2.8,pulse:.4}};function me(e={}){const t=K(e),c=e.preset||e.species||"moon",n=Z[c]||Z.moon,r=y=>e[y]??n[y],m=e.count??24,p=r("radius"),P=r("length"),C=e.size??1,V=le({radius:p,length:P,height:e.bellHeight,bell:r("bell"),rim:r("rim"),arms:r("arms"),tentacles:r("tentacles"),tentacleCount:e.tentacleCount??e.tentacles_n,armCount:e.armCount,rnd:t}),R=e.center?e.center.isVector3?e.center:new x.Vector3(...e.center):new x.Vector3(0,-10,0),u=e.spread||[22,9,22],M=new Float32Array(m*4),G=new Float32Array(m*4),L=new Float32Array(m*3),v=new x.Color,A=e.positions,z=e.clear??(e.path?5:12),h=(p+P*.25)*C*1.5;for(let y=0;y<m;y++){let a,g,S;const T=C*t.range(.55,1.5);if(A&&A[y]){const i=A[y];a=i.x??i[0],g=i.y??i[1],S=i.z??i[2]}else if(e.path){const i=t.range(e.uFrom??0,e.uTo??1),s=e.path.pointAt(i),F=t()*6.283,I=t.range(z+h,Math.max(u[0],z+h+1));a=s.x+Math.cos(F)*I,S=s.z+Math.sin(F)*I,g=s.y+t.range(-1,1)*u[1]}else for(let i=0;i<16;i++){const s=t()*6.283,F=Math.sqrt(t());if(a=R.x+Math.cos(s)*F*u[0],S=R.z+Math.sin(s)*F*u[2],g=R.y+t.range(-1,1)*u[1],!e.avoid||e.avoid.distanceTo(a,g,S)>z+h)break}M.set([a,g,S,t()],y*4),G.set([T,0,t()*100,0],y*4),v.setHSL(t(),.25*(e.hueVariety??.6),.86),L.set([v.r,v.g,v.b],y*3)}const b=e.drift||[2.5,1.2,2.5],o=e.glowIntensity??n.glowK,l=Y({instanced:!0,upright:!0,light:e.light||"underwater",pre:se,traj:fe,deform:ce,frag:ue,transparent:!0,depthWrite:!1,premultiplied:!0,side:x.BackSide,rim:e.rim??2.4,opacity:e.opacity??.9,glow:k(r("glow")).multiplyScalar(o),glowAnim:[.55,.6,1,0],uniforms:{uPulse:{value:new x.Vector4(e.pulse??n.pulse,e.squeeze??.3,e.thrust??.3,0)},uDrift:{value:new x.Vector3(...b)},uLen:{value:P},uR:{value:p},uBody:{value:e.body??.5},uMinPx:{value:e.minPixel??.0011},uInner:{value:k(r("inner")).multiplyScalar(o*(e.innerGlow??.9))}}}),d=new x.ShaderMaterial({uniforms:l.uniforms,defines:l.defines,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader,fog:!0,vertexColors:!0,side:x.FrontSide,transparent:!0,depthWrite:!1,premultipliedAlpha:!0}),f=ae(M,4,m,Math.hypot(b[0],b[1],b[2])+(P*1.3+p*2)*C*1.5+(e.thrust??.3)*C*1.5),w=J(V,m,M,G,L),E=N(w,l,2,f),W=N(w,d,3,f),B=l.uniforms,q=new x.Group;return q.add(E,W),{object:q,mesh:W,material:l,materials:[l,d],uniforms:B,geometry:w,count:m,bounds:f,triangles:Q(V)*m,update(y,a){B.uTime.value=a,B.uQ.value=a},setLight(y,a){U(B,y,a)},positionAt(y,a,g=new x.Vector3){return g.set(M[0],M[1],M[2])}}}export{X as FISH_PRESETS,ue as FRAG_GLASS,Z as JELLY_PRESETS,ne as fishGeometry,le as jellyGeometry,de as makeFishSchool,me as makeJellyfish};
