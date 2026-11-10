import*as m from"three";import{mergeVertices as Vt}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as $e,lerp as J,smoothstep as X,makeNoise as Bt}from"../kit/core.js";const pt=["#03060C","#B8862F","#7A3418","#E9E2CF","#C4D3DA","#D21F2B","#BFE6FF"],S=(s,a,t)=>new m.Vector3(s,a,t),Fe=Math.PI/180,xe=(s,a,t=0)=>S(-Math.cos(s*Fe)*a,t,Math.sin(s*Fe)*a),be=`
float mcH(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float mcH1(float n){ return fract(sin(n * 127.1) * 43758.5453); }
vec3 mcH3(vec3 p){ return vec3(mcH(p), mcH(p + 19.7), mcH(p + 41.3)); }
float mcN(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(mcH(i), mcH(i + vec3(1,0,0)), f.x), mix(mcH(i + vec3(0,1,0)), mcH(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(mcH(i + vec3(0,0,1)), mcH(i + vec3(1,0,1)), f.x), mix(mcH(i + vec3(0,1,1)), mcH(i + vec3(1,1,1)), f.x), f.y), f.z); }
float mcF(vec3 p){ return 0.5 * mcN(p) + 0.25 * mcN(p * 2.03 + 7.1) + 0.125 * mcN(p * 4.1 + 3.3) + 0.0625 * mcN(p * 8.2 + 1.7); }
float mcF2(vec3 p){ return 0.6 * mcN(p) + 0.4 * mcN(p * 2.1 + 5.3); }
// distance to the nearest feature point, 0..~1 (botryoidal knobs)
float mcCell(vec3 p){ vec3 i = floor(p), f = fract(p); float d = 1.0;
  for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec3 g = vec3(float(x), float(y), float(z)); vec3 o = mcH3(i + g) * 0.8 + 0.1; vec3 r = g + o - f; d = min(d, dot(r, r)); }
  return sqrt(d); }
// the same, with the way to that feature point: xyz = vector from p to it (in cell units), w = its distance. The slope of a
// knob then comes from the knob itself, not from screen-space differences (which shade in 2 x 2 pixel blocks close to)
vec4 mcCellV(vec3 p){ vec3 i = floor(p), f = fract(p); float d = 8.0; vec3 rv = vec3(0.0);
  for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec3 g = vec3(float(x), float(y), float(z)); vec3 o = mcH3(i + g) * 0.8 + 0.1; vec3 r = g + o - f; float dq = dot(r, r); if (dq < d) { d = dq; rv = r; } }
  return vec4(rv, sqrt(d)); }
`,Ce=`
uniform vec3 uLampPos[2]; uniform vec3 uLampDir; uniform vec3 uLampCol; uniform float uLampI; uniform float uLampFall;
uniform vec3 uLandPos[2]; uniform vec3 uLandDir[2]; uniform vec3 uLandCol; uniform float uLandI; uniform float uLandFall;
uniform vec3 uAbsorb; uniform vec3 uScatter; uniform float uSurvey;
vec3 mcSpot(vec3 P, vec3 N, vec3 lp, vec3 ld, float c0, float c1, float fall, float dE, float sv){
  vec3 L = lp - P; float d = length(L); L /= max(d, 1e-3);
  float cone = smoothstep(c0, c1, dot(-L, ld)) * 0.94 + 0.06;
  float ndl = max(dot(N, L), 0.0);
  float k = mix(1.0, 0.3, uSurvey);
  return cone * ndl / (1.0 + d / (fall * mix(1.0, 5.0, sv))) * exp(-uAbsorb * (d + dE) * k);
}
// irradiance at P (world space) for a surface with normal N seen from dE metres away
vec3 mcLight(vec3 P, vec3 N, float dE){
  vec3 c = uLampCol * uLampI * (mcSpot(P, N, uLampPos[0], uLampDir, 0.50, 0.90, uLampFall, dE, uSurvey) + mcSpot(P, N, uLampPos[1], uLampDir, 0.50, 0.90, uLampFall, dE, uSurvey));
  c += uLandCol * uLandI * (mcSpot(P, N, uLandPos[0], uLandDir[0], 0.80, 0.97, uLandFall, dE, 0.0) + mcSpot(P, N, uLandPos[1], uLandDir[1], 0.62, 0.95, uLandFall, dE, 0.0));
  float k = mix(1.0, 0.3, uSurvey);
  c += (uScatter * 0.5 + vec3(0.09, 0.10, 0.11) * uSurvey) * (0.35 + 0.65 * (N.y * 0.5 + 0.5)) * exp(-uAbsorb * dE * k);
  return c;
}
// direction and strength of the brighter headlamp glint: Blinn lobe of both lamps on normal N
float mcGlint(vec3 P, vec3 N, vec3 V, float power){
  vec3 L0 = normalize(uLampPos[0] - P), L1 = normalize(uLampPos[1] - P);
  float a = pow(max(dot(N, normalize(L0 + V)), 0.0), power), b = pow(max(dot(N, normalize(L1 + V)), 0.0), power);
  return a + b;
}
`;function It(s=pt,a="#EAF2FF"){const t=S(-46,11.5,-3);return{uLampPos:{value:[S(-.9,20,40),S(.9,20,40)]},uLampDir:{value:S(0,0,-1)},uLampCol:{value:new m.Color(a)},uLampI:{value:2.4},uLampFall:{value:4.5},uLandPos:{value:[t.clone(),t.clone()]},uLandDir:{value:[S(1,-.06,.07).normalize(),S(-8.3,47,8.6).sub(t).normalize()]},uLandCol:{value:new m.Color(s[6])},uLandI:{value:4},uLandFall:{value:14},uAbsorb:{value:S(.036,.019,.014)},uScatter:{value:new m.Color("#0B1826").multiplyScalar(.5)},uSurvey:{value:0}}}const We=`#include <common>
#include <fog_pars_vertex>
`,Ve=`#include <common>
#include <fog_pars_fragment>
`;function wt(){const s=[],a=[],t=[],x=[];return{pos:s,nrm:a,mat:t,idx:x,get count(){return s.length/3},vert(g,P,p,A,W,C,E,I,f){return s.push(g,P,p),a.push(A,W,C),t.push(E,I,f),s.length/3-1},tri(g,P,p){x.push(g,P,p)},grid(g,P,p,A){for(let W=0;W<p;W++)for(let C=0;C<P;C++){const E=g+W*(P+1)+C,I=E+1,f=E+P+1,L=f+1;A?x.push(E,I,f,I,L,f):x.push(E,f,I,I,f,L)}}}}function Be(s,a,t){const{pos:x,nrm:g,idx:P}=s;for(let p=a*3;p<g.length;p++)g[p]=0;for(let p=t;p<P.length;p+=3){const A=P[p]*3,W=P[p+1]*3,C=P[p+2]*3,E=x[W]-x[A],I=x[W+1]-x[A+1],f=x[W+2]-x[A+2],L=x[C]-x[A],V=x[C+1]-x[A+1],K=x[C+2]-x[A+2],Q=I*K-f*V,D=f*L-E*K,N=E*V-I*L;g[A]+=Q,g[A+1]+=D,g[A+2]+=N,g[W]+=Q,g[W+1]+=D,g[W+2]+=N,g[C]+=Q,g[C+1]+=D,g[C+2]+=N}for(let p=a*3;p<g.length;p+=3){const A=Math.hypot(g[p],g[p+1],g[p+2])||1;g[p]/=A,g[p+1]/=A,g[p+2]/=A}}function Qe(s,a,t,x){const g=s.nrm;for(let P=0;P<=x;P++){const p=(a+P*(t+1))*3,A=(a+P*(t+1)+t)*3;let W=g[p]+g[A],C=g[p+1]+g[A+1],E=g[p+2]+g[A+2];const I=Math.hypot(W,C,E)||1;W/=I,C/=I,E/=I,g[p]=g[A]=W,g[p+1]=g[A+1]=C,g[p+2]=g[A+2]=E}}const Oe=[[-1,11.2],[0,10.4],[3,9],[8,8],[18,7],[27,6],[36,4.7],[45,3],[50,2.2],[60,2]];function Ge(s){for(let a=1;a<Oe.length;a++)if(s<=Oe[a][0]){const t=Oe[a-1],x=Oe[a];return J(t[1],x[1],$e((s-t[0])/(x[0]-t[0]),0,1))}return 2}function _t(s,a){const t=s.int(6,8),x=[],g=[],P=s.shuffle([...Array(t).keys()]).slice(0,5).sort((f,L)=>f-L),p=s.shuffle([13,19,25,31,37,41]);let A=0;for(let f=0;f<t;f++){const L=P.includes(f),V={a0:(f+s.range(-.28,.28))/t*Math.PI*2,wob:s.range(.1,.3),ph:s.range(0,6.28),fr:s.range(.06,.12),dk:s.range(.58,.68),rk:s.range(.33,.46),top:L?99:p[A++%p.length]+s.range(-2,2),crown:L};x.push(V),L&&g.push(V)}const W=3,C=s.range(0,50),E=s.range(0,50);return{R:(f,L)=>{const V=Ge(L);let K=Math.exp(W*V*.55);for(let T=0;T<t;T++){const _=x[T];let U=1;if(L>_.top-2.4&&(U=1-(L-(_.top-2.4))/2.4,U<=0))continue;const ie=_.a0+_.wob*Math.sin(L*_.fr+_.ph),Z=V*_.dk,le=V*_.rk*Math.sqrt(U),oe=Math.sin(f-ie),q=le*le-Z*Z*oe*oe;q<=0||(K+=Math.exp(W*(Z*Math.cos(f-ie)+Math.sqrt(q))))}let Q=Math.log(K)/W+2.4*Math.exp(-Math.max(L,0)/1.5);const D=Math.cos(f)*V,N=Math.sin(f)*V;return Q+=.5*a.fbm3(D*.28+C,L*.3,N*.28+E,3)+.16*a.n3(D*1+E,L*1.1,N*1+C),Math.max(Q,.3)},pipes:x,crown:g}}function gt(s,a,t,x,g,P,p,A,W){const C=s.count,E=s.idx.length,I=[0,0,0],f=[0,0,1];for(let L=0;L<=t;L++){const V=L/t;x(V,I);for(let K=0;K<=a;K++){const Q=K%a/a*Math.PI*2,D=W&&L===t?.02:g(V,Q),N=Math.cos(Q)*D,T=Math.sin(Q)*D;A(V,Q,f),s.vert(I[0]+P[0]*N+p[0]*T,I[1]+P[1]*N+p[1]*T,I[2]+P[2]*N+p[2]*T,0,1,0,f[0],f[1],f[2])}}return s.grid(C,a,t,!1),Be(s,C,E),Qe(s,C,a,t),C}function xt(s){const a=S(s[0],s[1],s[2]).normalize(),t=S(1,0,0).cross(a).normalize(),x=a.clone().cross(t).normalize();return[[x.x,x.y,x.z],[t.x,t.y,t.z],[a.x,a.y,a.z]]}function bt(s){const a=new m.IcosahedronGeometry(1,s);a.deleteAttribute("uv"),a.deleteAttribute("normal");const t=Vt(a,.001),x={p:Array.from(t.getAttribute("position").array),i:Array.from(t.index.array)};return a.dispose(),t.dispose(),x}function yt(s,a,t,x,g,P,p,A,W,C,E,I,f,L,V,K){const Q=s.count,D=a.p;for(let T=0;T<D.length;T+=3){const _=D[T],U=D[T+1],ie=D[T+2],Z=1+C*t.n3(x+_*1.7,g+U*1.7,P+ie*1.7),le=$e(K+(1-K)*(.55+.6*(_*f+U*L+ie*V)),K,1),oe=_/p,q=U/A,me=ie/W,ue=Math.hypot(oe,q,me)||1;s.vert(x+_*p*Z,g+U*A*Z,P+ie*W*Z,oe/ue,q/ue,me/ue,E,I,le)}const N=a.i;for(let T=0;T<N.length;T+=3)s.tri(Q+N[T],Q+N[T+1],Q+N[T+2])}function Kt(s,a,t,x){const g=t.bearing*Fe,P=[-Math.cos(g),Math.sin(g)],p=[Math.sin(g),Math.cos(g)],A=t.y,W=t.r0??Math.max(x(Math.atan2(P[1],P[0]),A)-1.3,.8),C=t.jut+(t.reach??1.3),E=t.width/2,I=Math.min(2.6,E*.5),f=.28,L=s.range(0,6.28),V=s.range(0,6.28),K=s.int(5,9),Q=s.range(0,3),D=s.range(0,90),N=s.range(-.18,.18),T=Math.max(t.spill??s.range(.6,.85),t.spillMin??0),_=Math.min(1.2+.25*C,4.2),U=$e(.1*C,.45,1.35),ie=Math.min(.3*C,5),Z=t.n??2,le=B=>{const G=Math.abs(Math.cos(B)),ee=Math.abs(Math.sin(B)),j=Math.cos(B)>0?C:I;return Math.pow(Math.pow(Math.max(G/j,1e-5),Z)+Math.pow(Math.max(ee/E,1e-5),Z),-1/Z)*(1+.06*Math.sin(B*5+L)+.035*Math.sin(B*11+V))},oe=B=>1-X(T*.72,T,Math.abs(B-N)),q=B=>J(.32,-.06,oe(B))+.08*Math.sin(B*9+V),me=(B,G,ee,j)=>{const ce=B*Math.cos(G)+W,ve=B*Math.sin(G);return j[0]=P[0]*ce+p[0]*ve,j[1]=ee,j[2]=P[1]*ce+p[1]*ve,j},ue=(B,G)=>{const ee=le(G),j=2*f-q(G),ce=B*ee*Math.cos(G),ve=B*ee*Math.sin(G);return J(_,j,Math.pow(B,1.1))+(.3*a.fbm3(ce*.5+D,3.3,ve*.5,3)+.2*Math.abs(Math.sin(G*K+Q))*Math.sin(B*Math.PI))*(1-.7*B*B)},Ue=(B,G)=>{const ee=X(0,.3,Math.cos(G)),j=oe(G),ce=X(.3,.5,B)*(1-X(.55,.955,B)*(1-.85*j))*ee,ve=.5+.5*Math.pow(Math.abs(Math.sin(G*K*.5+Q)),.6);let ze=-.12+(U+.12)*ce*(.85+.3*a.n3(B*4+D,G*3,1.5))-ie*(1-X(0,.32,B))*ve;ze=Math.min(ze,ue(B,G)-.3);const ye=le(G),Le=1-f/ye;return J(ze,-q(G),X(.93,Le,B))},Ye=(B,G,ee=S())=>{const j=[0,0,0];return me(B*le(G),G,A+ue(B,G),j),ee.set(j[0],j[1],j[2])},_e=S();{const B=[0,0,0];me(.62*C,0,A,B),_e.set(B[0],B[1],B[2])}return{...t,yc:A,r0:W,Lr:C,Lw:E,Lb:I,rl:f,o:P,t:p,E:le,nE:Z,sc1:L,sc2:V,spill:oe,skirt:q,at:me,hTop:ue,under:Ue,top:Ye,center:_e,phi0:N,phis:T,depth:U}}function qt(s,a,t){const x=a.width>12?60:40,g=a.pass?12:9,P=4,p=a.pass?12:10,A=g+P+p-1,W=s.count,C=s.idx.length,E=[0,0,0];for(let f=0;f<=x;f++){const L=-Math.PI+f%x/x*Math.PI*2,V=a.E(L),K=1-a.rl/V,Q=a.skirt(L),D=a.spill(L);for(let N=0;N<g;N++){const T=N/(g-1)*K;a.at(T*V,L,a.yc+a.hTop(T,L),E),s.vert(E[0],E[1],E[2],0,1,0,.12+.3*T*T,t,.75+.25*T)}for(let N=0;N<P;N++){const T=(.5-(N+.5)/P)*Math.PI;a.at(V-a.rl+a.rl*Math.cos(T),L,a.yc+a.rl-Q+a.rl*Math.sin(T),E),s.vert(E[0],E[1],E[2],0,1,0,.38+.24*D,t*.5,1)}for(let N=0;N<p;N++){const T=(1-N/(p-1))*K,_=a.under(T,L);a.at(T*V,L,a.yc+_,E),s.vert(E[0],E[1],E[2],0,-1,0,_>.02?.36:.16+.2*T,t*.6,T<.3?.45+T:_>.02?.8:.95)}}s.grid(W,A,x,!0),Be(s,W,C);const I=s.nrm;for(let f=0;f<=A;f++){const L=(W+f)*3,V=(W+x*(A+1)+f)*3;for(let K=0;K<3;K++){const Q=(I[L+K]+I[V+K])*.5;I[L+K]=I[V+K]=Q}}}const Ie=`
float mcSw(vec2 x, float t){ return 0.14 * mcN(vec3(x * 1.3 + vec2(t * 0.11, 0.0), t * 0.22)) + 0.05 * mcN(vec3(x * 3.1 - vec2(0.0, t * 0.17), t * 0.35 + 7.0)); }
vec2 mcSwGrad(vec2 x, float t){ vec2 ee = vec2(0.06, 0.0); return vec2(mcSw(x + ee.xy, t) - mcSw(x - ee.xy, t), mcSw(x + ee.yx, t) - mcSw(x - ee.yx, t)) / 0.12; }
`,De=`
uniform vec4 uMirA; uniform vec4 uMirB; uniform vec4 uMirC; uniform float uMirN;
vec2 mcPoolRT(vec2 xz){
  float u = dot(xz, uMirB.xy) - uMirA.y, v = dot(xz, uMirB.zw);
  float m = length(vec2(u, v)); if (m < 0.05) return vec2(0.0);
  float phi = atan(v, u);
  float c = abs(cos(phi)), sn = abs(sin(phi)), A = u > 0.0 ? uMirA.z : uMirC.x;
  float e = pow(pow(max(c / A, 1e-5), uMirN) + pow(max(sn / uMirA.w, 1e-5), uMirN), -1.0 / uMirN) * (1.0 + 0.06 * sin(phi * 5.0 + uMirC.y) + 0.035 * sin(phi * 11.0 + uMirC.z));
  float rho = m / e, edge = 1.0 - uMirC.w / e;
  return vec2(step(0.28, rho) * step(rho, edge - 0.012) * step(abs(phi), 1.5), clamp((rho - 0.27) / max(edge - 0.27, 0.05), 0.0, 1.0));
}
`,it=`
uniform float uMirDesat;
// what a mirror of hot water does to colour: everything in it drifts to blue-silver (more under sodium lamps)
vec3 mcSilver(vec3 c){ float l = dot(c, vec3(0.30, 0.55, 0.15)); return mix(c, vec3(l) * vec3(0.78, 0.92, 1.08), uMirDesat) * vec3(0.90, 0.96, 1.0); }
// the meniscus: toward its rim (t 1) and where it meets the trunk (t 0) the sheet curls up to the stone and shows only dark
// water, so a pool sits in its shelf with a soft dark margin, not a ruled bright line
vec3 mcMeniscus(vec3 c, float t){ float m = clamp(smoothstep(0.76, 1.0, t) + 0.6 * smoothstep(0.10, 0.0, t), 0.0, 1.0); return mix(c, c * 0.35 + uScatter * 0.10, m * 0.8); }
// refl: what the mirror shows at P (already lit). P on the sheet, V unit vector to the eye (below), dE eye distance,
// gr the swell gradient there, hot the depth of hot water above the sheet, passK 1 on the three pass shelves (the camera
// goes under those: silver at every angle, a dim window) and 0 on the others (seen from afar: a clear window when steep)
vec3 mcSheet(vec3 refl, vec3 P, vec3 V, float dE, vec2 gr, float hot, float passK){
  vec3 Np = normalize(vec3(gr.x, -1.0, gr.y));
  float cs = max(dot(Np, V), 0.0);
  float mirror = mix(smoothstep(0.93, 0.78, cs), max(smoothstep(0.985, 0.90, cs), 0.55), passK);   // pass shelves: the upside-down scene shows at every angle
  float kP = mix(0.35, 1.0, passK);
  // the window: looked at steeply the sheet half clears onto the bone-white stone above, dim and wobbling with the swell
  vec2 sx = P.xz + gr * (hot * 2.4 + 0.5);
  float stn = mcF(vec3(sx.x * 1.3, 1.0, sx.y * 1.3)); float crk = mcCell(vec3(sx.x * 1.1, 2.0, sx.y * 1.1));
  vec3 stone = uBone * (0.35 + 0.5 * stn) * (0.55 + 0.45 * smoothstep(0.05, 0.3, crk));
  vec3 Lw = normalize(vec3(V.x * 0.3, -1.0, V.z * 0.3));
  vec3 win = stone * mcLight(P + vec3(0.0, hot, 0.0), Lw, dE + hot);
  // under warm (sodium) lamps the window would go khaki: there it is pulled nearly all the way to cold silver
  vec3 winS = mix(win, vec3(dot(win, vec3(0.30, 0.55, 0.15))) * vec3(0.74, 0.92, 1.12), 0.88);
  win = mix(mix(win, winS, step(0.5, uMirDesat)) * 0.3, mcSilver(win) * 0.10, passK);
  // a pass sheet seen whole and from the side (8 m and more off) is liquid silver: what hangs in it is given back brighter,
  // and the sheet has a pale slate of its own that rides the swells, about twice the water behind it. (Without them the
  // hero pool was a mid-blue lens no brighter than the rock round it.)
  float sideK = passK * smoothstep(7.0, 15.0, dE);
  vec2 vhS = V.xz / max(length(V.xz), 1e-3);
  vec3 col = mix(win, mcSilver(refl) * (1.0 + 0.7 * sideK) + uScatter * 0.06, mirror);
  col += vec3(0.052, 0.062, 0.080) * sideK * (0.62 + 0.76 * clamp(0.5 + 1.9 * dot(gr, vhS), 0.0, 1.0)) * exp(-uAbsorb * dE * 0.25);
  col += uScatter * 0.35 * pow(max(1.0 - cs, 0.0), 3.0) * exp(-uAbsorb * dE);
  // the sheet itself: lamp-lit haze and floc below it, caught on the faces of the swells that lean toward us
  vec3 beam = uLampI * (mcSpot(P, normalize(uLampPos[0] - P), uLampPos[0], uLampDir, 0.40, 0.92, uLampFall, dE, uSurvey)
                      + mcSpot(P, normalize(uLampPos[1] - P), uLampPos[1], uLampDir, 0.40, 0.92, uLampFall, dE, uSurvey));
  vec2 vh = V.xz / max(length(V.xz), 1e-3);
  float face = clamp(0.5 + 1.9 * dot(gr, vh), 0.0, 1.4);
  // (on a pass shelf the sheen on the swell faces is laid over dark water only: over the lit trunk and worms hanging in the
  // mirror it broke the reflection into flakes)
  float dk = 1.0 - passK * 0.88 * smoothstep(0.015, 0.16, dot(refl, vec3(0.30, 0.55, 0.15)));
  float farS = 1.0 - 0.45 * passK * smoothstep(10.0, 22.0, dE);      // (a pass pool seen whole from the side: less of the lit haze, so what hangs in the mirror reads)
  col += vec3(0.50, 0.68, 0.90) * beam * (mix(0.030, 0.060, passK) * mix(0.5, 1.0, dk) + 0.105 * face * face * dk) * kP * farS;
  // two glitter roads: under each headlamp's beam the swell crests flash, in a band that runs away along the gaze
  vec2 fwd = uLampDir.xz / max(length(uLampDir.xz), 1e-3);
  vec2 d0 = P.xz - uLampPos[0].xz, d1 = P.xz - uLampPos[1].xz;
  float a0 = dot(d0, fwd), a1 = dot(d1, fwd), l0 = d0.x * fwd.y - d0.y * fwd.x, l1 = d1.x * fwd.y - d1.y * fwd.x;
  float w0 = 0.20 + 0.050 * max(a0, 0.0), w1 = 0.20 + 0.050 * max(a1, 0.0);
  float road = exp(-l0 * l0 / (w0 * w0)) * smoothstep(0.3, 2.2, a0) / (1.0 + max(a0, 0.0) / 11.0)
             + exp(-l1 * l1 / (w1 * w1)) * smoothstep(0.3, 2.2, a1) / (1.0 + max(a1, 0.0) / 11.0);
  float fwp = length(fwidth(P.xz));
  float g1 = mcN(vec3(P.xz * 8.0 + vec2(uTime * 0.9, 0.0), uTime * 1.7)), g2 = mcN(vec3(P.xz * 15.0 - vec2(0.0, uTime * 1.3), uTime * 2.3 + 5.0));
  float spk = mix(0.28, smoothstep(0.50, 0.82, g1 * 0.6 + g2 * 0.4 + 0.22 * face), 1.0 - smoothstep(0.02, 0.10, fwp));
  vec3 lampS = mcSilver(uLampCol);                      // the lamps as the mirror gives them back: silver, whatever their colour
  col += lampS * vec3(0.92, 0.96, 1.0) * min(road * (0.22 + 3.4 * spk * spk) * uLampI * 0.6, 2.5) * (1.0 - 0.7 * smoothstep(18.0, 45.0, dE)) * kP * mix(0.45, 1.0, dk);
  // and the broad dazzle straight overhead, where the level sheet really does show us our own lamps
  col += lampS * vec3(0.82, 0.92, 1.0) * min(mcGlint(P, normalize(vec3(gr.x * 2.6, -1.0, gr.y * 2.6)), V, 320.0) * 1.5 * uLampI / (1.0 + dE / 7.0), 2.0) * mix(0.35, 1.0, dk);
  return col;
}
`,Mt=`
uniform float uTime;
vec3 mcMirrored(vec3 w){
  vec3 eyeM = vec3(cameraPosition.x, 2.0 * uMirA.x - cameraPosition.y, cameraPosition.z);
  vec3 dv = w - eyeM; float kk = clamp((uMirA.x - eyeM.y) / min(dv.y, -1e-3), 0.0, 1.0);
  vec2 gr = mcSwGrad((eyeM + dv * kk).xz, uTime);
  vec2 wob = clamp(gr * (1.0 - kk) * length(dv) * 0.05, vec2(-0.10), vec2(0.10));      // a gentle sway: the reflected thicket stays a thicket
  return vec3(w.x + wob.x, 2.0 * uMirA.x - w.y, w.z + wob.y);
}
`,zt=`
    vec3 dvM = vW - MC_EYE; float kM = (uMirA.x - MC_EYE.y) / min(dvM.y, -1e-3);
    vec3 Pp = MC_EYE + dvM * kM;
    vec2 rtM = mcPoolRT(Pp.xz);
    if (cameraPosition.y > uMirA.x - 0.05 || vW.y > uMirA.x - 0.03 || rtM.x < 0.5) discard;
    vec3 Vp = cameraPosition - Pp; float dP = length(Vp); Vp /= max(dP, 1e-3);
    col = mcMeniscus(mcSheet(col, Pp, Vp, dP, mcSwGrad(Pp.xz, uTime) * (1.0 - smoothstep(25.0, 70.0, dP) * 0.7), 0.6, 1.0), rtM.y);
    vec4 cpM = projectionMatrix * viewMatrix * vec4(Pp, 1.0);
    gl_FragDepth = clamp(cpM.z / max(cpM.w, 1e-4) * 0.5 + 0.5 - 0.00002 - 0.00010 * (1.0 - clamp(dE / 60.0, 0.0, 1.0)), 0.0, 1.0);
`,kt=`
#ifdef MIRROR
  uniform mat4 projectionMatrix;
  #define MC_EYE vec3(cameraPosition.x, 2.0 * uMirA.x - cameraPosition.y, cameraPosition.z)
#else
  #define MC_EYE cameraPosition
#endif
`,Lt=`
${We}
#ifdef MIRROR
${be}
${Ie}
${De}
${Mt}
#endif
attribute vec3 aMat; varying vec3 vW; varying vec3 vN; varying vec3 vM;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vM = aMat;
  #ifdef MIRROR
    w.xyz = mcMirrored(w.xyz);
  #endif
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Pt=`
${Ve}
${be}
${Ce}
uniform float uTime, uKindAdd, uWhite, uFieldRim, uTower; uniform vec3 uOchre, uRust, uBone, uMat, uEmber; uniform vec4 uPool[6];
#ifdef MIRROR
${Ie}
${De}
${it}
#endif
${kt}
varying vec3 vW; varying vec3 vN; varying vec3 vM;
void main(){
  vec3 N = normalize(vN); vec3 V = MC_EYE - vW; float dE = length(V); V /= max(dE, 1e-3);
  // the limb: lit from where we sit, a round thing falls away toward its edge, so the trunk never ends in a ruled bright
  // line against black water (the smooth normal, before the knobs)
  float limb = clamp(dot(N, V), 0.0, 1.0), limbK = smoothstep(0.0, 0.42, limb);
  float heat = vM.x, kind = clamp(vM.y + uKindAdd, 0.0, 1.0), ao = vM.z;
  // procedural form: botryoidal knobs, pores, vertical flow lines
  float near = 1.0 - smoothstep(22.0, 55.0, dE);
  float fw = length(fwidth(vW)); float k1 = 1.0 - smoothstep(0.10, 0.32, fw), k2 = 1.0 - smoothstep(0.03, 0.10, fw);
  vec4 cv = mcCellV(vW * 1.6); float cell = cv.w, dm = sqrt(max(1.0 - cell * cell * 1.6, 0.0)); float dome = mix(0.6, dm, k1);
  vec4 cv2 = mcCellV(vW * 5.3 + 3.1); float cell2 = cv2.w, dm2 = sqrt(max(1.0 - cell2 * cell2 * 1.8, 0.0)); float dome2 = mix(0.6, dm2, k2);
  float streak = mcF(vec3(vW.x * 1.6, vW.y * 0.11, vW.z * 1.6));
  float big = mcF(vW * 0.42 + 5.0);
  float fine = mcF(vW * 7.0);
  // the knobs' slopes are worked out from the knobs (smooth at any size on screen); only the faint flow lines and grain
  // still use screen differences, and the grain only where a pixel is smaller than it
  float hk = 0.35 + 0.65 * near, k3 = 1.0 - smoothstep(0.010, 0.026, fw);
  float h = (streak * 0.07 + fine * 0.03 * near * k3) * hk;
  vec3 dpx = dFdx(vW), dpy = dFdy(vW); float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 sg = sign(det) * (hx * r1 + hy * r2);
  vec3 G = (cv.xyz * (2.56 * 0.16 * k1 / max(dm, 0.4)) * smoothstep(0.0, 0.25, dm) + cv2.xyz * (9.54 * 0.05 * near * k2 / max(dm2, 0.4)) * smoothstep(0.0, 0.25, dm2)) * hk;
  G -= N * dot(G, N);
  N = normalize(abs(det) * (N - G * 1.3) - sg * 1.3 + N * 1e-5);
  // minerals
  float old = smoothstep(0.22, 0.70, big * 0.55 + streak * 0.75 - 0.12);
  vec3 alb = mix(uRust, uOchre * 0.8, old) * (0.55 + 0.6 * fine);
  alb = mix(alb, uRust * 0.35, smoothstep(0.55, 0.8, streak) * 0.6);
  vec3 sulph = vec3(0.085, 0.078, 0.066) * (0.55 + 0.9 * dome);
  float fresh = smoothstep(0.35, 0.75, kind + (big - 0.5) * 0.5);
  alb = mix(uRust * 0.45, alb, smoothstep(0.05, 0.6, dome));
  alb = mix(alb, sulph, fresh);
  float collar = smoothstep(0.42, 0.72, heat + (mcF(vW * 1.1 + 9.0) - 0.5) * 0.7 + (dome - 0.5) * 0.15);
  alb = mix(alb, uBone * (0.72 + 0.3 * fine), max(collar * 0.9, uWhite * (0.45 + 0.4 * streak)));
  float pock = smoothstep(0.76, 0.84, mcN(vW * 1.3 + 21.0)) * smoothstep(0.55, 0.2, cell);
  alb *= 1.0 - 0.6 * pock;
  float up = smoothstep(0.45, 0.9, N.y) * smoothstep(0.42, 0.62, mcF(vW * 0.9 + 31.0)) * (1.0 - collar);
  alb = mix(alb, uMat * 0.8, up * 0.75);
  alb *= mix(0.25, 1.0, ao) * (0.6 + 0.4 * smoothstep(0.0, 0.5, dome + streak * 0.5)) * smoothstep(-0.4, 1.6, vW.y + big);
  vec3 alb0 = alb;
  alb = mix(alb, vec3(dot(alb, vec3(0.35, 0.5, 0.15))) * vec3(0.66, 0.88, 1.16), smoothstep(18.0, 70.0, dE) * 0.85);   // beyond the lamps' reach colour drifts to blue-grey, never green
  vec3 E = mcLight(vW, N, dE) * mix(0.30, 1.0, limbK);
  vec3 col = alb * E;
  // the tower and its shelves (within 21 m of the axis): the edge of every round form takes a thread of the water's slate,
  // and in the long views (uTower: the reveal at the notch, the north vantage) the whole tower stands lit from foot to
  // crown: a warm face from our lamps, which the survey reach alone leaves dim at 40 m, and cold light from the lander
  // down the side that faces it
  float tw = 1.0 - smoothstep(17.0, 23.0, length(vW.xz));
  col += uScatter * tw * (1.0 - limbK) * (1.0 - limbK) * 1.3 * exp(-uAbsorb * dE * 0.5);
  float farT = smoothstep(16.0, 30.0, dE) * tw * uTower;
  vec3 LlT = normalize(uLandPos[1] - vW); float wrapT = clamp((dot(N, LlT) + 0.25) / 1.25, 0.0, 1.0), sameT = max(dot(LlT, V), 0.0);
  vec3 coldA = mix(alb, vec3(dot(alb, vec3(0.35, 0.5, 0.15))), 0.65) * 1.5 + 0.012;
  col += alb0 * mix(uLampCol, vec3(1.0, 0.84, 0.60), 0.5) * farT * 0.85 * (0.25 + 0.75 * max(dot(N, V), 0.0)) * mix(0.35, 1.0, limbK)      // (the stone's own colour, not the blue-grey of distance: a gold face)
       + coldA * uLandCol * farT * (1.0 * wrapT * wrapT * (1.0 - 0.8 * sameT * sameT) + 0.6 * pow(1.0 - limb, 2.5))
       + uLandCol * vec3(0.72, 0.92, 1.2) * farT * 0.65 * pow(1.0 - limb, 1.6) * smoothstep(-0.1, 0.5, dot(N, LlT)) * (1.0 - 0.8 * sameT * sameT);      // and a blue-white edge down the limb on the lander's side
  col += vec3(1.0, 0.80, 0.42) * fresh * mcGlint(vW, N, V, 22.0) * 0.07 * uLampI * exp(-uAbsorb * 2.0 * dE * mix(1.0, 0.3, uSurvey)) / (1.0 + dE / (uLampFall * mix(1.0, 5.0, uSurvey)));
  // mica / brassy glitter turning with the lamps (only near, where a grain is bigger than a pixel)
  vec3 gp = vW * 70.0; vec3 g = floor(gp); vec3 hn = normalize(mcH3(g) - 0.5 + N * 0.35);
  float gl = mcGlint(vW, hn, V, 40.0) * step(0.92, mcH(g + 7.0)) * smoothstep(0.5, 0.15, length(fract(gp) - 0.5)) * (1.0 - smoothstep(4.0, 10.0, dE));
  col += mix(vec3(1.0, 0.78, 0.35), vec3(0.9, 0.95, 1.0), 1.0 - fresh) * gl * (0.4 + 1.4 * fresh) * dot(E, vec3(0.33)) * 2.0;
  // wobbling net of light thrown down by each mirror on the wall beneath it
  float net = 0.0;
  for (int i = 0; i < 6; i++) { vec3 d = vW - uPool[i].xyz;
    net += smoothstep(-8.0, -1.0, d.y) * (1.0 - smoothstep(-0.4, 0.2, d.y)) * (1.0 - smoothstep(uPool[i].w * 0.5, uPool[i].w * 1.25, length(d.xz))); }
  vec3 q = vW * 1.1 + vec3(0.0, uTime * 0.22, 0.0);
  float c1 = 1.0 - abs(2.0 * mcN(q) - 1.0), c2 = 1.0 - abs(2.0 * mcN(q * 1.7 + vec3(4.0, -uTime * 0.3, 2.0)) - 1.0);
  col += alb * E * min(net, 1.0) * pow(max(c1 * c2, 0.0), 3.0) * 2.2;
  // the field (rock more than 15 m from the axis, below the great flange): beyond the lamps every chimney is drawn by the
  // slate of the lit water behind it, a cold rim on each silhouette and a breath of it on the upward faces, so ochre and
  // black sulphide chimneys stand as readably as white ones, in or out of the headlamps' cone
  float fieldK = smoothstep(15.0, 21.0, length(vW.xz)) * (1.0 - smoothstep(34.0, 42.0, vW.y)) * smoothstep(12.0, 34.0, dE);
  float rim1 = 1.0 - max(dot(N, V), 0.0), rimF = rim1 * rim1 * sqrt(rim1);
  col += uScatter * uFieldRim * fieldK * (rimF + 0.20 * rim1 + 0.10 * (0.5 + 0.5 * N.y)) * exp(-uAbsorb * dE * 0.5);
  // ember in the throats
  float em = smoothstep(0.93, 0.99, heat);
  col += uEmber * em * (0.9 + 0.5 * mcN(vec3(vW.xz * 3.0, uTime * 2.3)) * mcN(vec3(uTime * 0.9, vW.y * 2.0, 3.0)) * 1.4);
  #ifdef MIRROR
${zt}
  #endif
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Ht=`
${We}
attribute vec4 aK; attribute vec2 aTl; varying vec3 vW; varying vec3 vN; varying vec4 vK; varying vec2 vTl;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vK = aK; vTl = aTl;      // aTl: on the roll the way the lip runs (xz); on the sheet x = 0 at the trunk side .. 1 at the rim
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,$t=`
${Ve}
${be}
${Ce}
uniform float uTime, uKindAdd, uWhite; uniform vec3 uOchre, uRust, uBone, uMat, uCrimson, uBrass;
uniform vec3 uRingPos, uRingN, uRingCol; uniform float uRingR;
${Ie}
${it}
varying vec3 vW; varying vec3 vN; varying vec4 vK; varying vec2 vTl;
// what a ray leaving the mirror downward sees: the tower wall, or a lamp-lit tubeworm thicket, upside down
vec3 mcBelow(vec3 P, vec3 R, float dE, float floorY, float rT, float stripeFade){
  vec3 water = uScatter * 0.22 * exp(-uAbsorb * dE);
  if (R.y > -0.03) return water;
  float tF = (floorY - P.y) / R.y;
  vec2 d2 = R.xz; float a = dot(d2, d2), b = dot(P.xz, d2), c = dot(P.xz, P.xz) - rT * rT, disc = b * b - a * c;
  float tC = 1e9; if (disc > 0.0 && a > 1e-5) { float t = (-b - sqrt(disc)) / a; if (t > 0.0) tC = t; }
  if (tC < tF) {
    vec3 Q = P + R * tC; vec3 Nw = normalize(vec3(Q.x, 0.0001, Q.z));
    float st = mcF(vec3(Q.x * 1.6, Q.y * 0.11, Q.z * 1.6)), bg = mcF(Q * 0.42 + 5.0);
    vec3 alb = mix(uRust, uOchre, smoothstep(0.3, 0.62, bg + (st - 0.5) * 0.7)) * (0.6 + 0.5 * mcF(Q * 2.0));
    alb = mix(alb, uRust * 0.35, smoothstep(0.55, 0.8, st) * 0.6);
    alb = mix(alb, vec3(0.03, 0.031, 0.036), smoothstep(0.35, 0.75, uKindAdd + (bg - 0.5) * 0.5));
    alb = mix(alb, uBone * 0.85, max(uWhite * (0.45 + 0.4 * st), smoothstep(0.5, 0.75, mcF(Q * 1.1 + 9.0) + smoothstep(-4.0, 0.0, Q.y - P.y) * 0.5)));
    alb *= 1.0 - 0.6 * smoothstep(0.76, 0.84, mcN(Q * 1.3 + 21.0));
    // tubeworms standing on the wall: white strokes with crimson tips, upside down in the mirror
    float wa = atan(Q.z, Q.x) * rT / 0.21, wid = floor(wa), wf = fract(wa);
    float wl = 0.9 + 1.2 * mcH1(wid * 1.7), wc = wl + 0.8 + 3.0 * mcH1(wid + 3.1);
    float wk = fract((Q.y + mcH1(wid * 5.3) * wc) / wc) * wc, wu = wk / wl;
    float wth = smoothstep(0.46, 0.54, mcF2(vec3(Q.xz * 0.5, Q.y * 0.35))) * stripeFade * step(wu, 1.0);
    alb = mix(alb, uBone * 0.8, smoothstep(0.36, 0.2, abs(wf - 0.5)) * wth);
    alb = mix(alb, uCrimson, smoothstep(0.80, 0.86, wu) * smoothstep(0.5, 0.25, abs(wf - 0.5)) * wth);
    return alb * mcLight(Q, normalize(Nw - R * 0.6), dE + tC);
  }
  if (floorY < -30.0) {
    // a pass shelf: beyond the trunk its mirror shows the lamp-lit sea bed far below, upside down (pale mat on dark pillows),
    // so the sheet is a ceiling of silver over a lit floor and never a pane of black glass
    float tB = (0.6 - P.y) / R.y; vec3 Qb = P + R * tB;
    float mt = smoothstep(0.40, 0.64, mcF(vec3(Qb.x * 0.45, 3.0, Qb.z * 0.45))), pil = mcCell(vec3(Qb.x * 0.37, 1.0, Qb.z * 0.37));
    vec3 gbd = mix(vec3(0.10, 0.10, 0.115) * (0.5 + 0.9 * pil), uMat * 0.66, mt);
    return mix(water, gbd * mcLight(Qb, normalize(vec3(-R.x * 0.5, 1.0, -R.z * 0.5)), dE + tB), smoothstep(0.05, 0.30, -R.y));
  }
  vec3 Q = P + R * tF;
  vec2 dir = normalize(R.xz + vec2(1e-4, 0.0)); vec2 prp = vec2(-dir.y, dir.x);
  float s = dot(Q.xz, prp) / 0.21, id = floor(s), fs = fract(s), al = dot(Q.xz, dir);
  float stretch = clamp(length(R.xz) / max(-R.y, 0.05), 0.25, 1.9);
  float len = (0.9 + 1.3 * mcH1(id * 1.7)) * stretch, cellL = len + 0.8 + 3.0 * mcH1(id + 3.1);
  float k = fract((al + mcH1(id * 5.3) * cellL) / cellL) * cellL, u = k / max(len, 1e-3);
  float thk = smoothstep(0.40, 0.50, mcF2(vec3(Q.xz * 0.32, floorY)));
  stripeFade *= 1.0 - smoothstep(18.0, 36.0, dE + tF);
  float tube = step(u, 1.0) * smoothstep(0.36, 0.2, abs(fs - 0.5)) * thk * stripeFade;
  float plume = step(u, 1.0) * smoothstep(0.76, 0.84, u) * smoothstep(0.5, 0.25, abs(fs - 0.5)) * thk * mix(0.5, 1.0, stripeFade);
  vec3 ground = mix(vec3(0.02, 0.022, 0.028), uMat * 0.45, smoothstep(0.52, 0.72, mcF(vec3(Q.xz * 0.8, 3.0))));
  ground = mix(ground, uBone * 0.45, thk * (1.0 - stripeFade) * 0.6);
  vec3 alb = mix(ground, uBone * (0.75 + 0.25 * mcH1(id)), tube);
  alb = mix(alb, uCrimson, plume);
  vec3 Nq = normalize(vec3(-R.x * 0.6, 1.0, -R.z * 0.6));
  float ledge = (1.0 - smoothstep(rT + 6.0, rT + 10.0, length(Q.xz))) * smoothstep(0.06, 0.28, -R.y);
  return mix(water, alb * mcLight(Q, Nq, dE + tF), ledge);
}
void main(){
  vec3 V = cameraPosition - vW; float dE = length(V); V /= max(dE, 1e-3);
  float bead = step(0.5, vK.x);
  // slow swells 0.3-1 m long, slopes to ~20 degrees, seen from underneath
  float t = uTime;
  vec2 gr = mcSwGrad(vW.xz, t) * (1.0 - smoothstep(25.0, 70.0, dE) * 0.7);
  vec3 Ng = normalize(vN); if (dot(Ng, V) < 0.0) Ng = -Ng;
  vec3 Np = normalize(vec3(gr.x, -1.0, gr.y)); if (V.y > 0.0) Np.y = -Np.y;
  float tr = 0.25 * (mcN(vec3(vW * 5.0 + vec3(0.0, t * 1.4, 0.0))) - 0.5);
  vec3 N = normalize(mix(Np, Ng + vec3(tr, tr * 0.5, -tr), bead));
  // (the roll is the pool's own water, and the swells that cross the sheet run on into it: its normal leans ALONG the lip by
  // the slope the swell has there, a ripple 0.3 to 1 m long in the world's own metres from any eye. As a ruled extrusion it
  // drew out along the whole lip whatever it showed, each lamp's image into a bright streak metres long, and from 6 m beside
  // a shelf it read as a stretched band; now a lamp is a short glint on each swell, and the roll's bands waver with the pool)
  N = normalize(N + vec3(vTl.x, 0.0, vTl.y) * (dot(gr, vTl) * bead));
  float cs = max(dot(N, V), 0.0);
  float swK = mix(0.6, 0.14, step(vK.z, -30.0));                // a pass sheet's scene sways, it does not shatter
  vec3 Nm = normalize(mix(vec3(gr.x * swK, Np.y, gr.y * swK), N, bead));
  vec3 R = reflect(-V, Nm);
  vec3 Rp = dFdx(vW), Rq = dFdy(vW);
  float sf = 1.0 - smoothstep(0.25, 0.9, (abs(dFdx(R.x)) + abs(dFdy(R.x)) + abs(dFdx(R.z)) + abs(dFdy(R.z))) * 30.0 + (length(Rp) + length(Rq)) * 2.0);
  vec3 refl = mcBelow(vW, R, dE, vK.z, vK.w, sf);
  vec3 col;
  float att = 1.0 / (1.0 + dE / 7.0);
  float spark = 1.0 - 0.6 * smoothstep(14.0, 40.0, dE);
  if (bead > 0.5) {
    // the rolled lip: a chrome bead with the tiny images of the two lamps and the brass collar of the dome in it
    col = mcSilver(refl) + uScatter * 0.06;
    col += uScatter * 0.35 * pow(max(1.0 - cs, 0.0), 3.0) * exp(-uAbsorb * dE);
    // the two lamp images: pinpoints close to, widening with distance so each stays about a pixel across at 10 m
    float farK = smoothstep(2.5, 9.0, dE), att2 = 1.0 / (1.0 + dE / 14.0);
    float farK2 = smoothstep(9.0, 22.0, dE);
    float dots = mcGlint(vW, N, V, mix(mix(1400.0, 100.0, farK), 34.0, farK2)) * mix(mix(3.0, 7.0, farK), 5.0, farK2);
    float ringB = smoothstep(0.9915, 0.9935, cs) * (1.0 - smoothstep(0.9960, 0.9975, cs));
    col += uLampCol * vec3(0.82, 0.92, 1.0) * min(dots * mix(att, att2, farK) * uLampI * 0.5, 2.5) * (1.0 - smoothstep(18.0, 32.0, dE)) + uBrass * ringB * att * uLampI * 0.6 * (1.0 - smoothstep(3.5, 7.0, dE));
    // and the lamps drawn out along the roll, as any bright thing is along a chrome rod: the thin bright line of the lip
    vec3 Tl = normalize(vec3(vTl.x, 0.0, vTl.y) + vec3(1e-4, 0.0, 2e-4));
    vec3 Hl = normalize(normalize(0.5 * (uLampPos[0] + uLampPos[1]) - vW) + V); Hl = normalize(Hl - Tl * dot(Hl, Tl) + N * 1e-4);
    col += uLampCol * vec3(0.72, 0.86, 1.0) * min(pow(max(dot(N, Hl), 0.0), 12.0) * uLampI * mix(att2, 0.55, farK2) * 0.30, 0.50) * (1.0 - 0.7 * smoothstep(20.0, 36.0, dE));   // seen from the side at 10 to 25 m it is the pool's bright rounded rim; beyond that the roll is quiet silver
  } else {
    col = mcMeniscus(mcSheet(refl, vW, V, dE, gr, vK.y, step(vK.z, -30.0)), vTl.x);
  }
  // the lander's cold lamps glint too
  vec3 Ll = normalize(uLandPos[1] - vW);
  col += uLandCol * pow(max(dot(N, normalize(Ll + V)), 0.0), 90.0) * 0.6 * spark * step(0.5, uLandI);
  // image of the exit ring
  float dn = dot(R, uRingN); float tt = dot(uRingPos - vW, uRingN) / (abs(dn) > 1e-3 ? dn : 1e-3);
  if (tt > 0.0) { float dr = length(vW + R * tt - uRingPos); float e = (dr - uRingR) / 0.28;
    col += uRingCol * (exp(-e * e) + 0.10 * (1.0 - smoothstep(0.0, uRingR, dr))) * max(smoothstep(0.985, 0.90, cs), bead); }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Qt=`
${We}
attribute vec4 aT; uniform float uTime, uLeanT; varying vec3 vW; varying vec3 vT;
void main(){
  float t = aT.x, len = aT.z, sd = aT.w;
  vec3 p = (modelMatrix * vec4(position, 1.0)).xyz;
  float h = t * len;
  p.y += h;
  float fdv = step(2.0, sd);
  p.x += sin(h * 2.3 - uTime * 1.9 + sd * 40.0) * 0.22 * t + sin(h * 0.8 - uTime * 0.7 + sd * 13.0) * 0.6 * t * t + uLeanT * h * t * 0.6 * (1.0 - 0.75 * fdv);      // (a feeder leans a quarter as far: it has to reach its pool)
  p.z += cos(h * 1.9 - uTime * 1.6 + sd * 23.0) * 0.22 * t + sin(h * 0.7 - uTime * 0.6 + sd * 7.0) * 0.5 * t * t;
  vec3 toC = cameraPosition - p; float d = length(toC);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), toC / max(d, 1e-3)) + vec3(1e-4, 0.0, 0.0));
  float bo = min(floor(sd), 1.0);
  float w = (0.035 + 0.0028 * d + bo * (0.025 + 0.0032 * d) * (1.0 - 0.6 * fdv)) * (0.6 + 0.8 * t);
  p += right * aT.y * w;
  vW = p; vT = vec3(t, aT.y, sd + h * 0.0);
  vec4 mvPosition = viewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ot=`
${Ve}
${be}
${Ce}
uniform float uTime; varying vec3 vW; varying vec3 vT;
void main(){
  vec3 V = cameraPosition - vW; float dE = length(V); V /= max(dE, 1e-3);
  float t = vT.x, s = vT.y;
  float fd = step(2.0, vT.z);                                       // a feeder: hot water climbing into a pool from below
  float fade = smoothstep(0.0, mix(0.06, 0.55, fd), t) * (1.0 - smoothstep(mix(0.25, 0.86, fd), 1.0, t));      // (a feeder gathers as it climbs)
  float bead = 0.45 + 0.55 * mcN(vec3(vT.z * 31.0, vW.y * 1.6 - uTime * 1.5, 1.0)); bead = mix(bead, bead * bead * 1.5, fd);
  float e1 = (s - 0.42) / 0.30, e2 = (s + 0.42) / 0.30;
  float bright = exp(-e1 * e1), dark = exp(-e2 * e2);
  vec3 E = mcLight(vW, V, dE);
  float bo = min(floor(vT.z), 1.0);                                 // 1 on the world's broad threads
  // (broad threads also carry the slate of the lit water and are brighter beyond 8 m: off F3's lip they stand as wavering
  // glass ribbons against black water from across the shelf; close to, they are held under white)
  vec3 col = (min(E, vec3(mix(1.6, 0.8, bo))) * vec3(0.55, 0.62, 0.70) * (0.50 + 0.45 * bo) * (1.0 + 0.6 * bo * smoothstep(8.0, 16.0, dE)) * (1.0 - 0.5 * fd) + uScatter * 1.5 * bo) * bright * fade * bead;
  float a = dark * fade * bead * 0.5;
  // a thread of hot water is seen against dark water. Where the lit tower stands behind it, it only bends what is there:
  // no bright edge (three feeders crossing the gold trunk read as white wires hung on it). The sight line is followed
  // past the thread to where it comes nearest the tower's axis
  vec2 hx = -V.xz; float hl2 = max(dot(hx, hx), 1e-4), tcA = -dot(cameraPosition.xz, hx) / hl2;
  float dAx = length(cameraPosition.xz + hx * tcA), yAx = cameraPosition.y - V.y * tcA;
  float Rt = max(11.2 - 0.17 * clamp(yAx, 0.0, 46.0), 4.2);
  float onT = smoothstep(dE - 0.5, dE + 1.5, tcA) * (1.0 - smoothstep(Rt, Rt + 2.2, dAx)) * (1.0 - smoothstep(50.0, 58.0, yAx));
  col *= 1.0 - 0.94 * onT; a *= 1.0 - 0.55 * onT;
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,Rt=`
float mcBillow(vec3 q){ return 0.62 * abs(2.0 * mcN(q) - 1.0) + 0.38 * abs(2.0 * mcN(q * 2.3 + vec3(3.1, 7.7, 1.3)) - 1.0); }
`,Gt=`
${We}
${be}
${Rt}
attribute vec3 aQ; attribute vec2 aS; uniform float uTime, uLeanT; varying vec3 vW; varying vec3 vN; varying vec3 vQ; varying float vR;
void main(){
  vec3 p = (modelMatrix * vec4(position, 1.0)).xyz; vec3 n = normalize(mat3(modelMatrix) * normal);
  float r = aS.x, rise = aS.y;
  vec3 q = aQ + vec3(0.0, -uTime * rise, 0.0);
  float b = mcBillow(q);
  p += n * r * (0.55 * b - 0.12);
  float s = max(p.y - 50.0, 0.0); p.x += uLeanT * s * s / (s + 6.0);
  vW = p; vN = n; vQ = q; vR = r;
  vec4 mvPosition = viewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Dt=`
${Ve}
${be}
${Rt}
${Ce}
uniform vec3 uSoot; uniform float uTime, uSmokeRim, uSmokeLit; varying vec3 vW; varying vec3 vN; varying vec3 vQ; varying float vR;
void main(){
  vec3 V = cameraPosition - vW; float dE = length(V); V /= max(dE, 1e-3);
  float e = 0.12; float b0 = mcBillow(vQ);
  vec3 gb = vec3(mcBillow(vQ + vec3(e, 0.0, 0.0)), mcBillow(vQ + vec3(0.0, e, 0.0)), mcBillow(vQ + vec3(0.0, 0.0, e))) - b0;
  float fineB = mcBillow(vQ * 3.7 + 11.0);
  vec3 N = normalize(vN); vec3 gt = gb - N * dot(gb, N);
  N = normalize(N - gt * (0.55 / e) * 0.55 + vec3(0.0, 1e-5, 0.0));
  if (dot(N, V) < 0.0) N = normalize(N - 2.0 * dot(N, V) * V);
  float crease = smoothstep(0.0, 0.35, b0) * (0.6 + 0.4 * fineB);
  float rim = pow(max(1.0 - max(dot(N, V), 0.0), 0.0), 2.2);
  vec3 E = mcLight(vW, N, dE);
  vec3 Eb = mcLight(vW, normalize(N - V * 1.2), dE);
  vec3 col = uSoot * (E * (0.5 + 0.5 * crease) + Eb * rim * 3.0 * crease) + uScatter * (0.10 + 0.5 * rim) * crease * exp(-uAbsorb * dE * mix(1.0, 0.3, uSurvey)) * (0.4 + 0.6 * uSurvey);
  // the lander's cold lamps on the column: a wrapped diffuse from where the lander stands, so every billow is modelled
  // (lit cheek, black crease) from the west and from below, plus a little on the rim (the world turns this up for the long views)
  vec3 Ll = normalize(uLandPos[1] - vW);
  float wrap = clamp((dot(N, Ll) + 0.45) / 1.45, 0.0, 1.0);
  float hgt = 1.0 - 0.5 * smoothstep(75.0, 150.0, vW.y);
  col += uLandCol * uSmokeRim * uSmokeLit * hgt * ((0.25 + 0.75 * crease) * (0.25 + 0.75 * wrap * wrap) * (0.65 + 0.35 * fineB) + rim * rim * 0.35 * crease);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,je=40,Et=`
${We}
#ifdef MIRROR
${be}
${Ie}
${De}
${Mt}
#else
uniform float uTime;
#endif
attribute vec3 aBase; attribute vec3 aAxis; attribute vec3 aInfo;
uniform vec4 uThA[${je}]; uniform float uThB[${je}];
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec2 vWp;
void main(){
  float H = length(aAxis); vec3 A = aAxis / max(H, 1e-3);
  vec3 ex = normalize(cross(A, vec3(0.31, 0.12, 0.94))); vec3 ez = cross(A, ex);
  int ti = int(aInfo.y + 0.5);
  vec4 th = uThA[ti]; float rel = uThB[ti];
  float delay = distance(aBase, th.xyz) / 3.0 + aInfo.x * 0.08;
  float shut = smoothstep(0.0, 0.25, uTime - (th.w + delay));
  float open = smoothstep(0.0, 4.0, uTime - (rel + delay + 0.8));
  float r = rel > th.w ? shut * (1.0 - open) : shut;
  float isPl = uv.x; float hgt = isPl > 0.5 ? 1.0 : position.y;
  float sway = sin(uTime * 0.7 + aInfo.x * 37.0) * 0.05 + sin(uTime * 1.9 + aInfo.x * 11.0) * 0.015;
  vec3 lp = position;
  if (isPl > 0.5) { float k = 1.0 - 0.93 * r; lp.xz *= k * (0.85 + 0.15 * sin(uTime * 2.1 + aInfo.x * 50.0)); lp.y = (position.y - 1.0) * (1.0 - 0.9 * r) - 0.05 * r; }
  else lp.y = position.y * H;
  #ifdef MIRROR
    // (hanging in a sheet they are seen from 15 to 30 m: nearly twice as thick, more with distance, or they are white flecks)
    lp.xz *= mix(max(1.9, 0.075 * distance(cameraPosition, aBase)), 1.5, isPl);
  #endif
  float along = isPl > 0.5 ? H + lp.y : lp.y;
  // every tube has its own slight bow (4 to 9 degrees at the tip); the plume carries on along the bowed tip
  float bw = aInfo.x * 91.0, bend = 0.035 + 0.045 * fract(aInfo.x * 13.7);
  vec3 bd = ex * cos(bw) + ez * sin(bw);
  vec3 p = aBase + A * along + ex * lp.x + ez * lp.z + ex * sway * hgt * hgt * H + bd * bend * (hgt * hgt * H + (isPl > 0.5 ? 2.0 * lp.y : 0.0));
  vWp = vec2(uv.y, (position.y - 1.0) / 0.32);
  vec3 w = (modelMatrix * vec4(p, 1.0)).xyz;
  vec3 n = normalize(ex * normal.x + ez * normal.z + A * normal.y);
  vW = w; vN = normalize(mat3(modelMatrix) * n);
  vC = vec3(isPl, aInfo.x, hgt * (1.0 - isPl) + isPl * (1.0 - r));
  #ifdef MIRROR
    w = mcMirrored(w);
  #endif
  vec4 mvPosition = viewMatrix * vec4(w, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,At=`
${Ve}
${be}
${Ce}
uniform vec3 uBone, uCrimson; uniform float uWhite; varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec2 vWp;
#ifdef MIRROR
uniform float uTime;
${Ie}
${De}
${it}
#endif
${kt}
void main(){
  vec3 V = MC_EYE - vW; float dE = length(V); V /= max(dE, 1e-3);
  vec3 N = normalize(vN); if (dot(N, V) < 0.0) N = -N;
  float pl = step(0.5, vC.x);
  // the plume: a feather, two crossed blades (quads) cut to a serrated spindle here. vWp = (across -1..1, along 0..1)
  float pt = clamp(vWp.y, 0.0, 1.0), pa = abs(vWp.x);
  float tooth = abs(fract(pt * 9.0) - 0.5) * 2.0, tf = 1.0 - smoothstep(0.25, 0.9, fwidth(vWp.y * 9.0));
  float ph = pt * 64.0 - pa * 20.0, lf = 1.0 - smoothstep(0.5, 1.7, fwidth(vWp.y * 64.0) + fwidth(vWp.x) * 20.0);      // lamellae: gone before they can alias
  float prof = 0.8 * pow(max(sin(3.14159 * pow(pt + 1e-4, 0.72)), 0.0) + 1e-5, 0.75) * (1.0 - 0.26 * tooth * tf);
  if (pl > 0.5 && pa > prof) discard;
  float pe = pa / max(prof, 1e-3);
  // the tube: growth rings (drawn as grooves, faded by their own footprint), a pale flared collar, soot and stain toward the foot
  float rp = vC.z * (9.0 + 7.0 * mcH1(vC.y * 5.0)) + vC.y * 3.0, rw = fwidth(rp);
  float groove = smoothstep(0.62 - rw, 0.92, abs(fract(rp) - 0.5) * 2.0) * (1.0 - smoothstep(0.3, 0.8, rw));
  float foot = smoothstep(0.0, 0.5, vC.z);
  vec3 tube = mix(uBone * vec3(0.50, 0.44, 0.36), uBone * (0.74 + 0.22 * mcH1(vC.y * 7.0)), foot) * mix(0.5, 1.0, smoothstep(0.0, 0.3, vC.z));
  tube *= (1.0 - mix(0.42, 0.62, uWhite) * groove) * (1.0 + 0.16 * smoothstep(0.955, 0.985, vC.z));
  tube *= mix(vec3(1.0), vec3(0.66, 0.74, 0.84), uWhite);           // on white stone a tube is a shade darker and cooler than the rock, so each worm is a tube with a plume
  // the feather: a dark heart along the quill, barbs running out and up from it, darker toward the foot; of its two crossed
  // blades the one that faces the lamps is lit and the one turned away is in shadow, with only its thin fringe glowing through
  float nl = max(dot(N, V), 0.0);
  vec3 crim = uCrimson * (0.70 + 0.42 * mcH1(vC.y * 3.0));
  float heart = mix(0.30, 1.0, smoothstep(0.0, 0.55, pe)) * mix(0.60, 1.06, pt);
  vec3 plume = crim * heart * mix(1.0, 0.60 + 0.40 * sin(ph), lf) * (0.36 + 0.64 * nl);
  plume += crim * vec3(1.0, 0.42, 0.36) * 0.50 * smoothstep(0.66, 1.0, pe) * (1.0 - 0.55 * nl);
  // red dies first: beyond a dozen metres a plume is a dull maroon, further still slate
  plume = mix(plume, vec3(dot(plume, vec3(0.5, 0.35, 0.15))) * vec3(0.72, 0.62, 0.74), smoothstep(11.0, 34.0, dE) * 0.72);
  tube = mix(tube, vec3(dot(tube, vec3(0.4, 0.45, 0.15))) * vec3(0.8, 0.9, 1.1), smoothstep(16.0, 55.0, dE) * 0.7);
  vec3 alb = mix(tube, plume, pl);
  vec3 E = mix(mcLight(vW, normalize(N + V * 0.35), dE), mcLight(vW, V, dE), pl);     // the plume's own blade shading is above: here it takes only the lamps' falloff
  E /= 1.0 + mix(0.3, 0.55, pl) * max(E.r, max(E.g, E.b));           // bone-white a metre from the lamps must keep its rings, not burn out; nor the crimson go poster-flat
  vec3 col = alb * E;
  #ifdef MIRROR
${zt}
  #endif
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function Nt(s,a,t,x,g,P,p,A,W,C){const[E,I,f]=xt(t);return gt(s,g,P,(L,V)=>{const K=L<=.9?L/.9*x:x-(L-.9)/.1*W;V[0]=a[0]+f[0]*K,V[1]=a[1]+f[1]*K,V[2]=a[2]+f[2]*K},(L,V)=>L<=.9?p(L/.9,V):A*(1-.3*(L-.9)/.1),E,I,C,!0)}const jt=[{name:"F1",bearing:75,y:12.5,jut:11.5,width:13,n:3.2,pass:!0},{name:"F2",bearing:125,y:17.5,jut:12.5,width:15,n:3.2,pass:!0},{name:"F3",bearing:203,y:23.5,jut:14,width:22,n:3.2,pass:!0,spillMin:.95},{name:"F4",bearing:290,y:30,jut:5.5,width:8},{name:"F5",bearing:150,y:37,jut:5.5,width:8},{name:"F6",bearing:46,y:47,jut:16,width:16,r0:1.4,reach:1.6,spill:.8}];async function Xt(s,a={}){const t=s.rng.fork?s.rng.fork("mirror-chimneys-hero"):s.rng,x=s.noise??Bt(7741),g=s.quality?.detail??1,P=a.palette&&a.palette.length>=7?a.palette:pt,p=e=>new m.Color(e),A=Object.keys(a).length===0;let W=null;try{const e=new URLSearchParams(globalThis.location?.search||"");e.get("world")==="_part"&&(W=e.get("hm"))}catch{}const C=t.pick(["ochre","ochre","ochre","sulphide","white"]),E=a.mineral??W??C,I=a.lean??t.range(.17,.26),f=It(P,a.lampColor??"#EAF2FF");f.uSurvey.value=a.survey??(A?1:0);const L={value:0},V={value:Math.tan(I)},K={value:0},Q={value:0},D={value:0},N=new m.Group;N.name="mirror-chimneys-hero";const T=_t(t,x),_=T.R,U=jt.map(e=>Kt(t,x,e,_)),ie=(e,c,l)=>{const n=c,h=l,i=n*e.o[0]+h*e.o[1]-e.r0,u=n*e.t[0]+h*e.t[1];return[Math.hypot(i,u),Math.atan2(u,i)]},Z=(e,c,l,n=.3)=>{for(const h of U){if(c<h.yc-6||c>h.yc+5)continue;const[i,u]=ie(h,e,l),v=i/h.E(u);if(!(v>=1)&&c>h.yc+h.under(Math.min(v,.99),u)-n&&c<h.yc+h.hTop(v,u)+n)return!0}return!1},le=(e,c,l)=>{let n=0;for(const h of U){const i=c-h.yc;if(i<-3||i>1)continue;const[u,v]=ie(h,e,l);n=Math.max(n,.8*(1-X(h.Lw*.5,h.Lw*1.1,u))*X(-3,-.8,i)*(Math.cos(v)>-.2?1:.4))}return n+.22*Math.max(0,x.n3(e*.15,c*.5,l*.15))},oe=e=>.85*X(33,45,e),q=wt();{const l=q.count,n=q.idx.length;for(let h=0;h<=118;h++){const i=-.6+h/118*47.2,u=Math.max(Math.sqrt(1-X(44.2,46.6,i)),.02),v=Ge(i);for(let z=0;z<=128;z++){const d=z%128/128*Math.PI*2,b=_(d,i)*u,M=Math.cos(d)*b,k=Math.sin(d)*b,w=J(.18,1,X(.8,1.04,b/(v*u*1.02)));q.vert(M,i,k,0,1,0,le(M,i,k),oe(i),w)}h%3===2&&await s.yield()}q.grid(l,128,118,!1),await s.yield(),Be(q,l,n),await s.yield(),Qe(q,l,128,118)}await s.yield();const me=[],ue=t.shuffle([55,53.6,52.4,51.2,50]);T.crown.forEach((e,c)=>{const l=e.a0+e.wob*Math.sin(40*e.fr+e.ph),n=Ge(40)*e.dk*.85,h=ue[c],i=h-39,u=[Math.cos(l)*n,39,Math.sin(l)*n],v=t.range(.04,.14),z=t.range(-.06,.06),d=[Math.cos(l)*v-Math.sin(l)*z,1,Math.sin(l)*v+Math.cos(l)*z],b=t.range(.32,.6),M=t.range(0,6.28),k=t.int(2,4),w=t.range(1.5,2.4),y=i*Math.hypot(d[0],1,d[2]);Nt(q,u,d,y,14,26,(o,R)=>J(1.35,b*1.55,Math.pow(o,.8))*(1+.17*Math.sin(o*i*w+M))*(1+.07*Math.cos(k*R+M))*(1+.1*x.n3(Math.cos(R)*1.3+c*9,o*i*.7,Math.sin(R)*1.3)),b,1.3,(o,R,H)=>{const $=o<=.9,O=o/.9;H[0]=$?.62*Math.pow(Math.max(0,Math.sin(O*i*w+M+1.2)),3)*X(.15,.5,O)+.5*X(.93,1,O)*0:1,H[1]=1,H[2]=$?J(.5,1,X(0,.25,O)):1});const r=Math.hypot(d[0],d[1],d[2]);me.push({position:S(u[0]+d[0]/r*y,u[1]+d[1]/r*y,u[2]+d[2]/r*y),radius:b})}),await s.yield();const Ue=bt(1),Ye=bt(0);for(let e=0;e<46;e++){const c=t.range(0,6.283),l=1+Math.pow(t(),1.3)*42,n=t.range(.28,.5);for(let h=0;h<4;h++){const i=l+(h?t.range(-1.1,1.1):0),u=_(c,i),v=c+(h?t.range(-1,1)/u:0),z=_(v,i),d=h?n*t.range(.35,.8):n,b=Math.cos(v)*(z-.25*d),M=Math.sin(v)*(z-.25*d),k=d*t.range(.75,1.1);Z(b,i,M,.6)||yt(q,Ue,x,b,i,M,d,k,d,.2,le(b,i,M)+.1,oe(i),Math.cos(v),.15,Math.sin(v),.4)}e%12===11&&await s.yield()}for(let e=0;e<12;e++){const c=t.range(0,6.283),l=t.range(3,38),n=_(c,l),h=t.range(1.2,2.6),i=t.range(.45,.85),u=t.range(0,6),v=t.range(.15,.38),z=[Math.cos(c)*(n-.3),l-.2,Math.sin(c)*(n-.3)],d=[Math.cos(c)*v,1,Math.sin(c)*v];if(Z(z[0],l+h*.5,z[2],1))continue;const[b,M,k]=xt(d);gt(q,10,9,(w,y)=>{y[0]=z[0]+k[0]*w*h,y[1]=z[1]+k[1]*w*h,y[2]=z[2]+k[2]*w*h},(w,y)=>i*Math.pow(Math.sin(Math.PI*(.18+.82*w)),.6)*(1-.45*w)*(1+.15*Math.sin(w*h*9+u))+.03,b,M,(w,y,r)=>{r[0]=.5+.3*Math.sin(w*h*9+u),r[1]=.15,r[2]=J(.45,1,X(0,.3,w))},!0)}for(let e=0;e<26;e++){const c=t.range(0,6.283),l=1+Math.pow(t(),.8)*37,n=_(c,l),h=t.range(2,l<26?4.5:7),i=t.range(.3,.62),u=t.range(0,6),v=t.range(.08,l<26?.2:.4),z=t.range(-.15,.15),d=[Math.cos(c)*(n-.45),l-.3,Math.sin(c)*(n-.45)],b=[Math.cos(c)*v-Math.sin(c)*z,1,Math.sin(c)*v+Math.cos(c)*z];if(Z(d[0],l+h*.5,d[2],1.2)||Z(d[0]+b[0]*h,l+h,d[2]+b[2]*h,1.2))continue;const M=oe(l+h),k=t.chance(.35)?.6:.05,w=Math.min(h,4.2);Nt(q,d,b,w,9,10,(y,r)=>J(i*1.3,i*.5,Math.pow(y,.7))*(1+.24*Math.sin(y*w*2.6+u))*(1+.1*Math.cos(2*r+u))*(1+.18*x.n3(Math.cos(r)*1.4+u,y*w*.9,Math.sin(r)*1.4+e*3.1)),i*.3,.5,(y,r,o)=>{o[0]=y<=.9?k*X(.6,.9,y):.1,o[1]=M,o[2]=y<=.9?J(.45,1,X(0,.3,y)):.08}),e%9===8&&await s.yield()}for(let e=0;e<150;e++){const c=t.range(0,6.283),l=7.5+Math.pow(t(),1.6)*8.5,n=t.range(.3,1.25)*(1-(l-7.5)/14),h=t.range(.7,1.9),i=Math.max(_(c,.5)-.8,l),u=Math.cos(c)*i,v=Math.sin(c)*i,z=t.chance(.5);yt(q,Ye,x,u,n*.25+Math.max(0,1.6-(i-9)*.5)*t(),v,n*(z?h:1),n*.5,n*(z?1:h),.7,.05,t.chance(.2)?.8:.1,0,1,0,.35)}await s.yield();for(const e of U)e.v0=q.count,qt(q,e,e.name==="F6"?.18:oe(e.yc)*.8),e.v1=q.count,await s.yield();const _e={uOchre:{value:p(P[1])},uRust:{value:p(P[2])},uBone:{value:p(P[3]).multiplyScalar(.9)},uMat:{value:p(P[4])},uCrimson:{value:p(P[5]).multiplyScalar(1.25)},uBrass:{value:p(P[1]).multiplyScalar(1.6)},uEmber:{value:p("#FF7A2E").multiplyScalar(1.1)}},B={value:U.map(e=>new m.Vector4(e.center.x,e.yc,e.center.z,e.Lw))},G=m.UniformsUtils.clone(m.UniformsLib.fog),ee=(e,c,l,n={})=>new m.ShaderMaterial({vertexShader:e,fragmentShader:c,fog:!0,uniforms:{...m.UniformsUtils.clone(m.UniformsLib.fog),...f,..._e,uTime:L,uLeanT:V,...l},...n}),j=new m.BufferGeometry;j.setAttribute("position",new m.Float32BufferAttribute(q.pos,3)),j.setAttribute("normal",new m.Float32BufferAttribute(q.nrm,3)),j.setAttribute("aMat",new m.Float32BufferAttribute(q.mat,3)),j.setIndex(q.idx),j.boundingSphere=new m.Sphere(S(0,28,0),36);const ce={uKindAdd:{value:E==="sulphide"?.42:0},uWhite:{value:E==="white"?1:0}},ve=ee(Lt,Pt,{uPool:B,uFieldRim:Q,uTower:D,...ce}),ze=new m.Mesh(j,ve);ze.name="spire",N.add(ze),await s.yield();const ye=[],Le=[],Je=[],Xe=[],Ze=[],Ke=[],he=[0,0,0];for(const e of U){const c=e.pass?-60:Math.max(e.yc-5.5,.6),l=Ge(e.yc-3)*(e.pass?.8:1.05),n=e.pass?10:8,h=e.pass?56:34,i=ye.length/3;for(let b=0;b<=h;b++){const M=-1.5+3*b/h,k=e.E(M),w=1-e.rl/k;for(let y=0;y<=n;y++){const r=J(.27,w,y/n);e.at(r*k,M,e.yc,he),ye.push(he[0],he[1],he[2]),Le.push(0,-1,0),Je.push(0,e.depth*(.4+.6*Math.sin(Math.PI*y/n)),c,l),Ze.push(y/n,0)}}for(let b=0;b<h;b++)for(let M=0;M<n;M++){const k=i+b*(n+1)+M,w=k+1,y=k+n+1,r=y+1;Xe.push(k,w,y,w,r,y)}const u=e.width>12?56:40,v=ye.length/3,z=[[-.5,0],[-.4,-.02],[-.345,-.09],[-.3,-.2],[-.2,-.3],[-.05,-.345],[.1,-.32],[.23,-.23],[.32,-.08],[.345,.1],[.31,.28],[.22,.44],[.1,.54]],d=z.length-1;for(let b=0;b<=u;b++){const M=b/u,k=e.phi0+(M*2-1)*e.phis,w=e.E(k),y=e.yc+e.rl-e.skirt(k),r=Math.cos(k),o=Math.sin(k),R=e.o[0]*r+e.t[0]*o,H=e.o[1]*r+e.t[1]*o,$=J(.45,1,X(0,.14,M)*X(1,.86,M)),O=y-e.yc-.34;for(let F=0;F<=d;F++){const Ne=z[F],He=z[Math.max(F-1,0)],ae=z[Math.min(F+1,d)],se=ae[0]-He[0],ne=ae[1]-He[1],fe=Math.hypot(se,ne)||1,Se=ne/fe,ge=-se/fe;e.at(w-e.rl+Ne[0]*$,k,e.yc+Ne[1]*$+O*X(-.1,.3,Ne[1]),he),ye.push(he[0],he[1],he[2]),Le.push(R*Se,ge,H*Se),Je.push(1,e.depth,c,l),Ze.push(-H,R)}if(b%2===0&&M>.12&&M<.88){e.at(w-e.rl+(e.rl+.05)*.64,k,y+(e.rl+.05)*.77,he);const F={p:[he[0],he[1],he[2]],w:e.width,F:e};Ke.push(F),e.spillMin&&Ke.push(F,F)}}for(let b=0;b<u;b++)for(let M=0;M<d;M++){const k=v+b*(d+1)+M,w=k+1,y=k+d+1,r=y+1;Xe.push(k,w,y,w,r,y)}}const qe=S(-8.3,45,8.6),lt=S(-25.2,6,-7.7).sub(qe).normalize(),Pe={uRingPos:{value:qe.clone()},uRingN:{value:lt.clone()},uRingR:{value:3.75},uRingCol:{value:p(P[6]).multiplyScalar(a.ring===!1?0:1.6)}},Me=new m.BufferGeometry;Me.setAttribute("position",new m.Float32BufferAttribute(ye,3)),Me.setAttribute("normal",new m.Float32BufferAttribute(Le,3)),Me.setAttribute("aK",new m.Float32BufferAttribute(Je,4)),Me.setAttribute("aTl",new m.Float32BufferAttribute(Ze,2)),Me.setIndex(Xe),Me.boundingSphere=new m.Sphere(S(0,30,0),34);const ct=new m.Color(a.lampColor??"#EAF2FF"),ht={value:ct.r-ct.b>.2?.62:.3},mt=new m.Mesh(Me,ee(Ht,$t,{...Pe,...ce,uMirDesat:ht},{side:m.DoubleSide}));mt.name="mirrors",N.add(mt);const St=U.filter(e=>e.pass),Re=[],ut=(e,c,l,n,h=11.5,i=5)=>{if(l>e.yc-.03||l<e.yc-h)return!1;const u=c*e.o[0]+n*e.o[1]-e.r0,v=c*e.t[0]+n*e.t[1];return u>-7&&u<e.Lr+i&&Math.abs(v)<e.Lw+i+1};for(const e of St){const c={uMirA:{value:new m.Vector4(e.yc,e.r0,e.Lr,e.Lw)},uMirB:{value:new m.Vector4(e.o[0],e.o[1],e.t[0],e.t[1])},uMirC:{value:new m.Vector4(e.Lb,e.sc1,e.sc2,e.rl)},uMirN:{value:e.nE},uMirDesat:ht},l=ee(Lt,Pt,{uPool:B,uFieldRim:Q,uTower:D,...ce,...c},{side:m.BackSide,defines:{MIRROR:1}}),n={F:e,U:c,rockM:l,meshes:[]},h=[],i=q.pos,u=q.idx;for(let d=0;d<u.length;d+=3){const b=u[d],M=u[d+1],k=u[d+2];b>=e.v0&&b<e.v1||(ut(e,(i[b*3]+i[M*3]+i[k*3])/3,(i[b*3+1]+i[M*3+1]+i[k*3+1])/3,(i[b*3+2]+i[M*3+2]+i[k*3+2])/3)&&h.push(b,M,k),d%6e4===59997&&await s.yield())}const v=new m.BufferGeometry;for(const d of["position","normal","aMat"])v.setAttribute(d,j.getAttribute(d));v.setIndex(h);const z=new m.Mesh(v,l);z.name="mirror-rock-"+e.name,z.frustumCulled=!1,N.add(z),n.meshes.push(z),Re.push(n),await s.yield()}await s.yield();{const e=Math.round(84*g),c=12,l=[],n=[],h=[];for(let z=0;z<e;z++){const d=Ke[Math.floor(t()*Ke.length)],b=t.range(2,6),M=t(),k=t.range(-.12,.12),w=t.range(-.12,.12),y=l.length/3;for(let r=0;r<=c;r++)for(let o=-1;o<=1;o+=2)l.push(d.p[0]+k,d.p[1],d.p[2]+w),n.push(r/c,o,b,M);for(let r=0;r<c;r++){const o=y+r*2;h.push(o,o+1,o+2,o+1,o+3,o+2)}}const i=new m.BufferGeometry;i.setAttribute("position",new m.Float32BufferAttribute(l,3)),i.setAttribute("aT",new m.Float32BufferAttribute(n,4)),i.setIndex(h),i.boundingSphere=new m.Sphere(S(0,32,0),40);const u=ee(Qt,Ot,{},{transparent:!0,depthWrite:!1,side:m.DoubleSide,blending:m.CustomBlending,blendEquation:m.AddEquation,blendSrc:m.OneFactor,blendDst:m.OneMinusSrcAlphaFactor}),v=new m.Mesh(i,u);v.name="threads",v.renderOrder=3,N.add(v)}const dt=152;let et=null;if(a.smoke!==!1){const e=wt(),c=[],l=(i,u,v,z,d,b,M,k,w)=>{const y=.85*Math.min(z,12)+.4;for(let r=0;r<=d;r++){const o=r%d/d*Math.PI*2,R=Math.cos(o),H=Math.sin(o);e.vert(i+R*z,u,v+H*z,R,w,H,R*z/y+M,b,H*z/y),c.push(Math.min(z,12),k/y)}};me.forEach((i,u)=>{const v=e.count,z=e.idx.length,d=12,b=12;let M=0;for(let k=0;k<=d;k++){const w=k/d,y=k===0?i.radius*.5:J(i.radius*.95,2.7,Math.pow(w,1.3)),r=J(i.position.y-.5,67,w);M+=k?(67-i.position.y+.5)/d/(.85*y+.4):0,l(J(i.position.x,0,w*w),r,J(i.position.z,0,w*w),y,b,M,10+u*7.3,2.4,0)}e.grid(v,b,d,!1),Be(e,v,z),Qe(e,v,b,d)});{const i=e.count,u=e.idx.length,v=104,z=48;let d=0,b=60,M=3;for(let k=0;k<=v;k++){const w=k/v;let y,r;if(w<.78){const o=w/.78;y=J(60,144,o),r=J(3,11.5,Math.pow(o,.85))}else if(w<.92){const o=(w-.78)/.14;y=144+5*Math.sin(o*Math.PI*.5),r=11.5+36*Math.pow(o,.8)}else{const o=(w-.92)/.08;y=149+4.5*Math.sin(o*Math.PI*.5),r=Math.max(47.5*Math.cos(o*Math.PI*.5),.05)}d+=Math.hypot(y-b,r-M)/(.85*Math.min(r,12)+.4),b=y,M=r,l(0,y,0,r,z,d,0,J(2,.9,w),0),k%26===25&&await s.yield()}e.grid(i,z,v,!1),Be(e,i,u),Qe(e,i,z,v)}const n=new m.BufferGeometry;n.setAttribute("position",new m.Float32BufferAttribute(e.pos,3)),n.setAttribute("normal",new m.Float32BufferAttribute(e.nrm,3)),n.setAttribute("aQ",new m.Float32BufferAttribute(e.mat,3)),n.setAttribute("aS",new m.Float32BufferAttribute(c,2)),n.setIndex(e.idx),n.boundingSphere=new m.Sphere(S(20,100,0),130);const h=E==="white"?p(P[4]).multiplyScalar(.55):new m.Color(.05,.052,.058);et=new m.Mesh(n,ee(Gt,Dt,{uSoot:{value:h},uSmokeRim:K,uSmokeLit:{value:E==="white"?.4:.24}})),et.name="smoke",N.add(et),await s.yield()}const Ee=[],tt=[],ot=[];for(let e=0;e<je;e++)tt.push(new m.Vector4(0,0,0,-1e3)),ot.push(-990);const ft={uThA:{value:tt},uThB:{value:ot}};if(a.worms!==!1){const e=Math.round((a.wormCount??1100)*g),c=Math.ceil(e/24),l=[],n=[],h=[],i=[[0,2],[1,3],[2,4],[3,1],[4,1],[5,4]],u=[];for(const[r,o]of i)for(let R=0;R<o;R++)u.push({F:U[r],rho:t.range(.4,.78),phi:o===1?t.range(-.5,.5):J(-1,1,(R+t.range(.2,.8))/o)});for(let r=0;r<5;r++)u.push({wall:!0,th:t.range(0,6.283),y:t.range(3,21)});for(let r=0;r<4;r++)u.push({foot:!0,th:(r+t.range(0,.8))/4*6.283,r:t.range(10.5,12.5)});for(const r of a.passThickets||[])if(r.b!==void 0){const o=Math.atan2(Math.sin(r.b*Fe),-Math.cos(r.b*Fe)),R=Math.min(_(o,r.y)+(r.off??.9),9.6);u.push({at:!0,pass:!0,p:[Math.cos(o)*R,r.y,Math.sin(o)*R],o:[Math.cos(o),Math.sin(o)],r:r.r??1.3})}else u.push({at:!0,pass:!0,p:r.p,o:r.o||[0,0],r:r.r??1.3});u.length=Math.min(u.length,je);for(let r=0;r<u.length;r++){const o=u[r],R=S();let H=0;if(o.F)o.F.top(o.rho,o.phi,R);else if(o.at)R.set(o.p[0],o.p[1],o.p[2]);else if(o.wall){const $=_(o.th,o.y);R.set(Math.cos(o.th)*$,o.y,Math.sin(o.th)*$)}else R.set(Math.cos(o.th)*o.r,.3,Math.sin(o.th)*o.r);for(let $=0;$<c*3&&H<c;$++){const O=2.3*Math.sqrt(t()),F=t.range(0,6.283),Ne=t.range(.8,2.2)*(1-.25*O/2.3),He=t();let ae,se,ne,fe=t.range(-.18,.18),Se=1,ge=t.range(-.18,.18);if(o.at){const re=O/2.3*o.r;ae=R.x+Math.cos(F)*re,ne=R.z+Math.sin(F)*re,se=R.y-.25*re*re/(o.r*o.r)-.05,fe+=o.o[0]*.3+Math.cos(F)*.12*re,ge+=o.o[1]*.3+Math.sin(F)*.12*re}else if(o.F){ae=R.x+Math.cos(F)*O,ne=R.z+Math.sin(F)*O;const[re,te]=ie(o.F,ae,ne),Te=re/o.F.E(te);if(Te>.9||Math.cos(te)<-.3||(se=o.F.yc+o.F.hTop(Te,te)-.06,(Math.hypot(ae,ne)||1)<_(Math.atan2(ne,ae),Math.min(se,46))+.2&&se<46))continue;fe+=o.F.o[0]*Math.cos(te)*.2,ge+=o.F.o[1]*Math.cos(te)*.2}else if(o.wall){se=o.y+Math.sin(F)*O*.8;const re=_(o.th,se),te=o.th+Math.cos(F)*O/re,Te=_(te,se);if(ae=Math.cos(te)*(Te-.08),ne=Math.sin(te)*(Te-.08),se<.5||Z(ae,se+.5,ne,2.4))continue;fe+=Math.cos(te)*.6,ge+=Math.sin(te)*.6}else{ae=R.x+Math.cos(F)*O,ne=R.z+Math.sin(F)*O;const re=Math.hypot(ae,ne),te=Math.atan2(ne,ae);if(re>13.4||re<_(te,.6)-.3)continue;se=.15+Math.max(0,1.2-(re-9)*.4),fe+=Math.cos(te)*.15,ge+=Math.sin(te)*.15}const rt=Ne/Math.hypot(fe,Se,ge);l.push(ae,se,ne),n.push(fe*rt,Se*rt,ge*rt),h.push(He,r,0),H++}Ee.push({center:R.clone(),radius:2.6,count:H,inside:!1,pass:!!o.pass}),r%6===5&&await s.yield()}const v=[],z=[],d=[],b=[],M=6,k=[[0,.066],[.34,.06],[.67,.054],[1,.049]];k.forEach(([r,o],R)=>{for(let H=0;H<M;H++){const $=H/M*6.283+R*.2,O=Math.cos($),F=Math.sin($);v.push(O*o,r,F*o),z.push(O,0,F),d.push(0,0)}});for(let r=0;r<k.length-1;r++)for(let o=0;o<M;o++){const R=r*M+o,H=r*M+(o+1)%M,$=R+M,O=H+M;b.push(R,$,H,H,$,O)}for(const[r,o]of[[1,0],[0,1]]){const R=v.length/3;for(const[H,$]of[[-1,1],[1,1],[-1,1.32],[1,1.32]])v.push(r*H*.125,$,o*H*.125),z.push(o,0,r),d.push(1,H);b.push(R,R+2,R+1,R+1,R+2,R+3)}const w=new m.InstancedBufferGeometry;w.setAttribute("position",new m.Float32BufferAttribute(v,3)),w.setAttribute("normal",new m.Float32BufferAttribute(z,3)),w.setAttribute("uv",new m.Float32BufferAttribute(d,2)),w.setIndex(b),w.setAttribute("aBase",new m.InstancedBufferAttribute(new Float32Array(l),3)),w.setAttribute("aAxis",new m.InstancedBufferAttribute(new Float32Array(n),3)),w.setAttribute("aInfo",new m.InstancedBufferAttribute(new Float32Array(h),3)),w.instanceCount=l.length/3,w.boundingSphere=new m.Sphere(S(0,26,0),36);const y=new m.Mesh(w,ee(Et,At,{...ft,uWhite:ce.uWhite},{side:m.DoubleSide}));y.name="tubeworms",y.frustumCulled=!1,N.add(y);for(const r of Re){const o=[],R=[],H=[];for(let F=0;F<l.length;F+=3)ut(r.F,l[F],l[F+1],l[F+2],9.5,2.5)&&(o.push(l[F],l[F+1],l[F+2]),R.push(n[F],n[F+1],n[F+2]),H.push(h[F],h[F+1],h[F+2]));if(!o.length)continue;const $=new m.InstancedBufferGeometry;for(const F of["position","normal","uv"])$.setAttribute(F,w.getAttribute(F));$.setIndex(w.index),$.setAttribute("aBase",new m.InstancedBufferAttribute(new Float32Array(o),3)),$.setAttribute("aAxis",new m.InstancedBufferAttribute(new Float32Array(R),3)),$.setAttribute("aInfo",new m.InstancedBufferAttribute(new Float32Array(H),3)),$.instanceCount=o.length/3;const O=new m.Mesh($,ee(Et,At,{...ft,uWhite:ce.uWhite,...r.U},{side:m.DoubleSide,defines:{MIRROR:1}}));O.name="mirror-worms-"+r.F.name,O.frustumCulled=!1,N.add(O),r.meshes.push(O)}await s.yield()}const de=U[2],ke=U[5],Tt=[S(-88,15,4),S(-44,13.5,2),S(-28,9.5,6),xe(30,15,7.5),xe(75,13,8.5),xe(125,13,12.5),xe(195,12.5,18.2),xe(235,13,19.5),xe(290,20,12),xe(343,26.4,6),qe.clone()],Ft={portalSeat:{position:qe.clone(),normal:lt.clone(),radius:3.75},flyThrough:Tt,heroPool:S(de.center.x,de.yc,de.center.z),heroView:xe(205,12.6,18.6),heroGaze:S(de.center.x*.9,de.yc-.4,de.center.z*.9),greatPool:S(ke.center.x,ke.yc,ke.center.z),throats:me.map(e=>e.position.clone()),smokeBase:S(0,67,0),smokeTop:S(Math.tan(I)*96,dt,0),lander:S(-46,11.5,-3)},pe=S(),at=S(),st=S(),nt=S(),Ae=S(),Ct=new m.Matrix4,Wt=a.wormReach??5;let vt=f.uLandI.value;const Y={object:N,radius:19,height:55,center:S(0,27,0),anchors:Ft,ground:!0,groundY:0,lamps:f,flanges:U,wormThickets:Ee,mineral:E,lean:I,smokeTop:dt,passThickets:Ee.filter(e=>e.pass).map(e=>e.center.clone()),mirrorRock(e,c){const l=Re[c];if(!l)return null;const n=new m.Mesh(e,l.rockM);return n.name="mirror-rock-extra-"+l.F.name,n.frustumCulled=!1,N.add(n),l.meshes.push(n),n},trunkRadius:(e,c)=>_(e,$e(c,0,46)),setLander(e,c,l,n){e&&(f.uLandPos.value[0].copy(e),f.uLandPos.value[1].copy(e)),c&&f.uLandDir.value[0].copy(c).normalize(),l&&f.uLandDir.value[1].copy(l).normalize(),n!==void 0&&(vt=n)},setSurvey(e){f.uSurvey.value=e},setLampIntensity(e){f.uLampI.value=e},setRing(e,c,l,n,h=1.6){e&&Pe.uRingPos.value.copy(e),c&&Pe.uRingN.value.copy(c).normalize(),l&&(Pe.uRingR.value=l),Pe.uRingCol.value.set(n??P[6]).multiplyScalar(h)},setCurrent(e){V.value=Math.tan(e)},setSmokeRim(e){K.value=e},setFieldRim(e){Q.value=e},setTowerLight(e){D.value=e},update(e,c,l){L.value=c;const n=l.matrixWorld.elements;pe.set(n[12],n[13],n[14]),at.set(n[0],n[1],n[2]).normalize(),st.set(n[4],n[5],n[6]).normalize(),nt.set(-n[8],-n[9],-n[10]).normalize(),f.uLampPos.value[0].copy(pe).addScaledVector(at,-.9).addScaledVector(st,-.25),f.uLampPos.value[1].copy(pe).addScaledVector(at,.9).addScaledVector(st,-.25),f.uLampDir.value.copy(nt),f.uLandI.value=vt*(1+.08*Math.sin(c*.7)*Math.sin(c*.23+1));let h=0;for(let i=Re.length-1;i>=0;i--){const u=Re[i],v=u.F,z=h<2&&pe.y<v.yc-.1&&pe.y>v.yc-12.5&&Math.hypot(pe.x-v.center.x,pe.z-v.center.z)<v.Lr+v.Lw+9;z&&h++;for(const d of u.meshes)d.visible=z}Ae.copy(pe).addScaledVector(nt,.5).applyMatrix4(Ct.copy(N.matrixWorld).invert());for(let i=0;i<Ee.length;i++){const u=Ee[i],v=u.center.distanceTo(Ae)<u.radius+Wt;v&&!u.inside?tt[i].set(Ae.x,Ae.y,Ae.z,c):!v&&u.inside&&(ot[i]=c),u.inside=v}},dispose(){}};let we=a.view;try{const e=new URLSearchParams(globalThis.location?.search||"");e.get("world")==="_part"&&(we=we||e.get("hv")||"out")}catch{}return we==="f3"?(Y.radius=.4,Y.height=-15,Y.center=S(de.center.x*1.1,de.yc-.5,de.center.z*1.1),Y.ground=!1,f.uSurvey.value=a.survey??0):we==="great"?(Y.radius=2.5,Y.height=-22,Y.center=S(ke.center.x,ke.yc-1,ke.center.z),Y.ground=!1,f.uSurvey.value=a.survey??0):we==="trunk"?(Y.radius=1,Y.height=6,Y.center=S(0,11,0),f.uSurvey.value=a.survey??0):we==="foot"?(Y.radius=3.5,Y.height=14,Y.center=S(0,5,0),f.uSurvey.value=a.survey??0):we==="crown"?(Y.radius=8,Y.height=20,Y.center=S(0,50,0),Y.ground=!1):we==="smoke"&&(Y.radius=40,Y.height=150,Y.center=S(10,85,0)),Y}export{Ce as LAMP_GLSL,be as NOISE_GLSL,xe as bearing,Xt as buildHero,It as lampUniforms};
