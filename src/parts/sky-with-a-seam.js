import*as n from"three";import{clamp as Me,lerp as le,smoothstep as Fe}from"../kit/core.js";const V=Math.PI/180,L={R:430,gores:80,gore:2*Math.PI/80,joint:30,doorTop:90,doorBack:-.8},Be={foot:-1.1,top:L.doorTop},Y={top:600,plumb:30,rake:[13.5,4.5],ease:30,off:6,proud:[.4,.8],frame:1.6},Ye=(e,t)=>{const o=Math.max(t-Y.plumb,0);return Y.rake[e<0?0:1]*o*o/(o*o+Y.ease*Y.ease)},ko=(e,t,o)=>o/2*Math.cos(t/L.R)-Ye(e,t),Ae={R:404,railR:419,drum:13,looks:[{bearing:252.3,y:24},{bearing:254,y:21}],swing:.012,period:210},Je=[{color:[1,.87,.64],key:.62,fill:.44},{color:[1,.7,.38],key:.66,fill:.4}],se=(e,t=new n.Vector3)=>t.set(Math.sin(e*V),0,-Math.cos(e*V)),Ge=(e,t)=>(Math.atan2(e,-t)/V+360)%360,Wo=e=>L.R*Math.sin(e/L.R),Ho=e=>L.R*Math.cos(e/L.R);function re(e,t,o=0,s=new n.Vector3){const r=t/L.R,a=L.R-o;return s.set(Math.sin(e*V)*Math.cos(r)*a,Math.sin(r)*a,-Math.cos(e*V)*Math.cos(r)*a)}const Do=(e,t)=>t+e*(360/L.gores),$o=(e,t=new n.Vector3)=>re(e,0,0,t),ft=7,pt=4,Ce={ring:ft,room:pt,first:2*(ft+pt),last:60},ut=(e,t)=>le(Ce.first,Ce.last,Me(e/t,0,1)),mt=new n.Vector3,wt=new n.Vector3,Ze=new n.Vector3;function je(e,t){const o=Ae.looks[e],s=Math.asin(o.y/Ae.R);return se(o.bearing,t).multiplyScalar(Math.cos(s)),t.y=Math.sin(s),t}const Xe=(e=new n.Vector3)=>e.crossVectors(je(0,mt),je(1,wt)).normalize();function Pe(e,t=new n.Vector3){return Xe(Ze),je(0,t).applyAxisAngle(Ze,e)}const vt=[0,je(0,new n.Vector3).angleTo(je(1,new n.Vector3))],Ut=(e,t,o=0)=>vt[e]+Ae.swing*Math.sin(t*2*Math.PI/Ae.period+o);function gt(e,t,o=new n.Vector3,s=0){return Pe(Ut(e,t,s),o).multiplyScalar(Ae.R)}const N={eye:2.7,stem:2.95,stern:-4.61,mid:-.83,stemHead:1.76,sheer:.62,halfBeam:.98,mast:{f:-.83,foot:.25,top:6.3,r:.085,taper:.01},stay:.012,yard:{y:4.99,rise:25,swing:10,lo:.9,hi:3.05,r:.07,taper:.005,throat:-.8,peak:2.45},tackY:.8,tackAft:.12,clew:[-3.9,1.75,-.45],blade:.12,post:{s:.05,f:.065},hull:[-.83,.02,0,3.3,.6,.98],cast:[],sail:[],ends:[]},bt=e=>N.sheer+(N.stemHead-.12-N.sheer)*Math.pow(Math.abs(2*e-1),2.4),Qe=e=>-.3+.95*Math.pow(Math.abs(2*e-1),5);{const e=N,t=e.mast,o=e.yard,s=Math.cos(o.rise*V),r=e.stem-e.stern;t.rAt=u=>t.r+t.taper*(1-2*(u-t.foot)/(t.top-t.foot)),o.dir=[-s*Math.cos(o.swing*V),Math.sin(o.rise*V),-s*Math.sin(o.swing*V)],o.side=-(t.rAt(o.y)+o.r+o.taper),o.at=u=>[t.f+o.dir[0]*u,o.y+o.dir[1]*u,o.side+o.dir[2]*u],e.cast.push([t.f,t.foot,0,t.f,t.top,0,t.r]),e.cast.push([...o.at(-o.lo),...o.at(o.hi),o.r]),e.cast.push([.9,.45,0,2.5,1.1,0,.27],[-2.55,.45,0,-4.15,1.08,0,.27]);const a=2*(e.post.s+e.post.f)/Math.PI;e.cast.push([2.35,.95,0,e.stem,e.stemHead-.06,0,a],[-4,.95,0,e.stern,e.stemHead-.1,0,a]),e.cast.push([t.f,t.top-.1,0,-.4,.66,-.93,e.stay],[t.f,t.top-.1,0,-.75,.68,-.95,e.stay]),e.cast.push([t.f,t.top-.1,0,-.4,.66,.93,e.stay],[t.f,t.top-.1,0,-2.6,.72,.78,e.stay]);const d=o.at(e.tackAft);e.tack=[d[0],e.tackY,d[2]],e.sail.push(o.at(o.throat),o.at(o.peak),e.clew,e.tack);for(const[u,l]of[[1-e.blade,1],[e.blade,0]]){const i=e.stern+r*u,f=e.stern+r*l;e.ends.push([[i,Qe(u),0],[f,Qe(l),0],[f,e.stemHead,0],[i,bt(u),0]])}}const O={ribBack:3.4,ribHalf:1.3,trucks:{at:[[18,34],[8.5,25]],half:2.6,out:1,top:1.8},deck:{r0:10,r1:80,t0:16,t1:76,top:1.2,rail:2.3},gantry:{r:36,legT:27,top:38,half:3},drums:{r:21,t:24,y:4.3,rad:2.5},hung:[[-.62,7],[-.36,9.5],[.38,8.5],[.66,6.5]],hungLow:13.4,frames:{r:[84,132,186,246],legT:31,top:42,half:2.5},cat:{t:20.5,y:[13,27],r0:13,r1:300,half:.8,every:12},towers:[[52,46,34],[68,-60,52],[38,68,26],[118,-52,64],[150,58,46],[212,-44,78],[262,66,58]],fly:[[75,30,26],[135,55,30],[195,36,24],[255,70,30],[315,44,22],[375,80,26],[435,50,20],[495,66,18]],outer:210},Kt={least:40,within:200},Yt={x0:-150,z0:290,sight:30,skew:5,behind:5,clear:N.stem-N.stern,tailR:60,veer:90,along:230,off:27,aslant:45,wallTurn:85,bayTurn:150};function Jt(e=Yt){const t=L.R,o=t-e.off,s=e.skew*V,r=Kt.within+e.clear,a=e.along/o/V;let d=[],u={},l=0,i=-o,f=90,p=0;const x=()=>d.push([l,N.eye,i]),P=R=>{const I=Math.max(1,Math.ceil(R/(e.lineStep||12)));for(let F=0;F<I;F++)l+=Math.sin(f*V)*R/I,i-=Math.cos(f*V)*R/I,x();p+=R},b=(R,I,F)=>{const j=Math.max(1,Math.ceil(Math.abs(I)/(e.arcStep||4))),Z=l+F*Math.cos(f*V)*R,oe=i+F*Math.sin(f*V)*R;for(let he=0;he<j;he++)f+=F*I/j,l=Z-F*Math.cos(f*V)*R,i=oe-F*Math.sin(f*V)*R,x();p+=R*Math.abs(I)*V},v=()=>{const R=e.tailR;b(R,e.veer,1);const I=Math.sqrt(t*t+r*r-2*r*t*Math.cos(s)+R*R+2*R*t*Math.sin(s)),F=Math.sin(f*V),j=-Math.cos(f*V),Z=l-j*-R,oe=i-F*R,he=Z*F+oe*j,de=Z*Z+oe*oe-I*I,we=de>0?Math.max(-he-Math.sqrt(Math.max(he*he-de,0)),0):0;we>0&&P(we),u.swing=p;const te=l+j*R,G=i-F*R,B=Ge(te,G)+Math.asin(Me((R+t*Math.sin(s))/Math.hypot(te,G),-1,1))/V;b(R,((f-B)%360+360)%360,-1),u.straight=p;const ee=Math.sin(f*V),pe=-Math.cos(f*V),q=l*ee+i*pe,ve=-q+Math.sqrt(q*q+t*t-l*l-i*i),Se=Ge(l+ee*ve,i+pe*ve);return P(ve+e.behind/Math.cos(s)),Se};v();const T=(Ge(l,i)+540)%360-180,$=Math.hypot(e.x0,e.z0),A=Ge(e.x0,e.z0)-(180-e.sight-Math.asin(t*Math.sin(e.sight*V)/$)/V)-T-a,c=t*Math.sin(e.aslant*V),m=Math.acos((c-e.wallTurn)/(o-e.wallTurn))/V,E=A+90-m,g=Math.sin(E*V),y=Math.cos(E*V),k=-(c-e.bayTurn+y*(e.bayTurn+e.x0))/g;d=[],u={},l=e.x0,i=e.z0,f=0,p=0,x(),P(e.z0-k),u.bayTurn=p,b(e.bayTurn,E,1),u.bayLine=p;const W=se(A).multiplyScalar(o-e.wallTurn);P((W.x-l)*g-(W.z-i)*y),u.C=p,b(e.wallTurn,m,1),u.D=p,b(o,a,1),u.E=p;const H=v();return{pts:d,marks:u,beta:E,gapBearing:Ge(l,i),cross:H,skew:H-f,heading:f,length:p,wallStart:A,wallEnd:A+a}}const ke={limit:110,seam:{before:130,weight:.8},rain:{after:70,weight:.5,fade:.36},shadow:{open:90,hold:75,weight:.5}},Go=(e,t)=>.5+.8*Fe(t.B,t.bayTurn,e)-.4*Fe(t.C-60,t.C+60,e)-.1*Fe(t.E,t.swing,e),et={before:120,onWall:.05,wide:2.4,tall:3.6,dark:.5,gores:7,luff:.4,out:.4,head:1,cross:.4,heel:[.18,.3],fore:[.04,.2],sharp:1.5,spar:.45,behind:{turn:90,tilt:20,least:60},aim:[0,1,2].map(e=>(N.sail[0][e]+N.sail[1][e]+N.sail[2][e]+N.sail[3][e])/4)},xt=()=>{const e=N.cast[1];return[[N.mast.f,N.mast.top,0],[e[0],e[1],e[2]],[e[3],e[4],e[5]],N.sail[0],N.sail[1],[N.stem,N.stemHead-.06,0],[N.stern,N.stemHead-.1,0]]},yt=()=>[0,1].flatMap(e=>[0,Math.PI/2,-Math.PI/2].map(t=>gt(e,0,new n.Vector3,t)));function No(e,t,o,s){const r=new n.Vector3,a=new n.Vector3,d=new n.Vector3,u=xt(),l=yt();let i=Math.floor(s);for(let f=i;f>o-et.before;f--){e.pointAt(f/t,r),e.tangentAt(f/t,a),r.y=0;const p=Math.atan2(a.x,-a.z);for(const x of l)for(const P of u)if(Et(x,r,p,P[0],P[1],P[2],d).y<=et.onWall)return i;i=f}return i}function Oo(e,t,o,s){const r=new n.Vector3,a=new n.Vector3,d=new n.Vector3,u=[...xt(),N.sail[2],N.sail[3]],l=yt();let i=1/0,f=-1/0,p=0,x=null;for(let P=o;P<=s;P+=2){e.pointAt(P/t,r),e.tangentAt(P/t,a),r.y=0;const b=Math.atan2(a.x,-a.z);for(const v of l)for(const T of u){if(Et(v,r,b,T[0],T[1],T[2],d).y<=et.onWall)continue;const $=Ge(d.x,d.z);x===null&&(x=$);const z=x+($-x+540)%360-180;i=Math.min(i,z),f=Math.max(f,z),p=Math.max(p,d.y)}}return{lo:i,hi:f,top:p}}const Co=(e,t)=>{const o=ke.shadow,s=e-o.open,r=t+o.hold+o.open;return{from:s,to:r,weight:o.weight,fade:o.open/(r-s)}},Io=(e,t)=>({from:e-ke.seam.before,to:t,weight:ke.seam.weight,fade:ke.seam.before/(t-e+ke.seam.before),arc:!0,steady:!0}),Vo=(e,t)=>({from:e+ke.rain.after,to:t,weight:ke.rain.weight,fade:ke.rain.fade}),h=e=>{const t=String(Math.round(e*1e4)/1e4);return/[.e]/.test(t)?t:t+"."},Ne=(e,t,o)=>"vec3("+h(e)+","+h(t)+","+h(o)+")",_e={core:1.7,drum:12,slantFloor:.03},St=`
uniform vec3 uLamp; uniform vec4 uBoat;
vec3 toBoat(vec3 p){ vec2 h = vec2(sin(uBoat.w), -cos(uBoat.w)); vec2 q = p.xz - uBoat.xz; return vec3(dot(q, h), p.y - uBoat.y, dot(q, vec2(-h.y, h.x))); }
// E: xyz the unit way ALONG the surface and across the light, w the half-shade's rate that way (metres for a metre
// of throw); kv: its rate the other way across the light
float capShade(vec3 P, vec3 D, vec3 A, vec3 B, float r, vec4 E, float kv, float foot){
  vec3 v = B - A, w = P - A; float b = dot(D, v), c = dot(v, v), d = dot(D, w), e = dot(v, w);
  float tc = clamp((e - b * d) / max(c - b * b, 1e-5), 0., 1.), sc = max(b * tc - d, 0.);
  vec3 q = w + D * sc - v * tc; float dist = length(q), ca = dot(q, E.xyz) / max(dist, 1e-4);
  float pa = E.w * sc + .5 * foot + .004, pv = kv * sc + .5 * foot + .004, pen = sqrt(mix(pv * pv, pa * pa, clamp(ca * ca, 0., 1.)));
  return (1. - smoothstep(r - pen, r + pen, dist)) * min(1., 1.5 * r / pa); }
// A FLAT CLOTH OF FOUR CORNERS (the set sail, and each blade of the hull's two ends: A, B, C, G round it), as it stands ACROSS the light from P: the shade
// is how far inside every one of its four edges P lies there, each edge soft by the half-shade the way that edge
// faces (E, kv as above), the throw taken to the cloth's middle; a cloth seen edge on by the light, narrower
// than its half-shade, throws only a share of shade (its two edges' halves meet)
float clothEdge(vec2 p, vec2 q, vec2 e2, float pa, float pv, float turn){
  vec2 t = q - p; vec2 n = vec2(-t.y, t.x) / max(length(t), 1e-4); float ca = dot(n, e2);
  float pen = sqrt(mix(pv * pv, pa * pa, clamp(ca * ca, 0., 1.)));
  return smoothstep(-pen, pen, turn * dot(-p, n)); }
float clothShade(vec3 P, vec3 D, vec3 A, vec3 B, vec3 C, vec3 G, vec4 E, float kv, float foot){
  float sc = dot((A + B + C + G) * .25 - P, D), on = step(0., sc); sc = max(sc, 0.);
  vec3 u = normalize(vec3(D.z, 0., -D.x) + vec3(1e-5, 0., 0.)), w = cross(D, u);
  vec2 a = vec2(dot(A - P, u), dot(A - P, w)), b = vec2(dot(B - P, u), dot(B - P, w)), c = vec2(dot(C - P, u), dot(C - P, w)), g = vec2(dot(G - P, u), dot(G - P, w));
  vec2 e2 = vec2(dot(E.xyz, u), dot(E.xyz, w)); float pa = E.w * sc + .5 * foot + .004, pv = kv * sc + .5 * foot + .004;
  float turn = sign(a.x * b.y - a.y * b.x + b.x * c.y - b.y * c.x + c.x * g.y - c.y * g.x + g.x * a.y - g.y * a.x);
  return on * clothEdge(a, b, e2, pa, pv, turn) * clothEdge(b, c, e2, pa, pv, turn) * clothEdge(c, g, e2, pa, pv, turn) * clothEdge(g, a, e2, pa, pv, turn); }
float boatShadeOn(vec3 Pw, vec3 Nw, float foot){
  vec3 P = toBoat(Pw), L = toBoat(uLamp), D = L - P; float T = max(length(D), 1e-3); D /= T;
  vec3 c0 = P - vec3(${h(N.mid)}, 2.6, 0.); float s0 = max(-dot(c0, D), 0.);
  if (s0 >= T || length(c0 + D * s0) > 6.4 + foot) return 0.;
  vec2 hb = vec2(sin(uBoat.w), -cos(uBoat.w)); vec3 Nb = vec3(dot(Nw.xz, hb), Nw.y, dot(Nw.xz, vec2(-hb.y, hb.x)));
  float nd = abs(dot(Nb, D)), kv = mix(${h(_e.core)}, ${h(_e.drum)}, (1. - nd) * (1. - nd)) / T, ka = ${h(_e.core)} / T / max(nd, ${h(_e.slantFloor)});
  vec3 eA = cross(Nb, D); float la = length(eA); eA = la > 1e-3 ? eA / la : vec3(0.); vec3 eV = cross(D, eA); vec4 E = vec4(eA, ka);
  vec3 ax = ${Ne(N.hull[3],N.hull[4],N.hull[5])}, Pe = (P - ${Ne(N.hull[0],N.hull[1],N.hull[2])}) / ax, De = D / ax;
  float te = max(-dot(Pe, De) / max(dot(De, De), 1e-6), 0.);
  vec3 qe = Pe + De * te, qw = qe * ax; float len = length(qe), lw = max(length(qw), 1e-4), ca = dot(qw, eA) / lw;
  float pa = ka * te + .5 * foot + .004, pv = kv * te + .5 * foot + .004, pen = sqrt(mix(pv * pv, pa * pa, clamp(ca * ca, 0., 1.)));
  float pe = pen / clamp(lw / max(len, 1e-3), ${h(N.hull[4])}, ${h(N.hull[3])});          // the half-shade in the hull's own measure that way
  float sh = (1. - smoothstep(1. - pe, 1. + pe, len)) * min(1., max(length(eA * ax), ${h(N.hull[4])}) / pa) * min(1., max(length(eV * ax), ${h(N.hull[4])}) / pv);
${N.cast.map(e=>`  sh = max(sh, capShade(P, D, ${Ne(e[0],e[1],e[2])}, ${Ne(e[3],e[4],e[5])}, ${h(e[6])}, E, kv, foot));`).join(`
`)}
  sh = max(sh, clothShade(P, D, ${N.sail.map(e=>Ne(e[0],e[1],e[2])).join(", ")}, E, kv, foot));
${N.ends.map(e=>`  sh = max(sh, clothShade(P, D, ${e.map(t=>Ne(t[0],t[1],t[2])).join(", ")}, E, kv, foot));`).join(`
`)}
  return sh; }
float boatShade(vec3 Pw, float foot){ vec3 d = uLamp - Pw; return boatShadeOn(Pw, d / max(length(d), 1e-3), foot); }
`,Zt=()=>({uLamp:{value:new n.Vector3(0,100,0)},uBoat:{value:new n.Vector4(0,-1e4,0,0)}}),At=new n.Vector3,We=new n.Vector3;function Et(e,t,o,s,r,a,d=new n.Vector3){const u=Math.sin(o),l=-Math.cos(o);At.set(t.x+s*u-a*l,t.y+r,t.z+s*l+a*u),We.subVectors(At,e);const i=We.y<-1e-6?-e.y/We.y:1/0;if(i<1e5&&(d.copy(e).addScaledVector(We,i),d.x*d.x+d.z*d.z<=L.R*L.R))return d;const f=We.dot(We),p=e.dot(We),x=e.dot(e)-L.R*L.R,P=(-p+Math.sqrt(Math.max(p*p-f*x,0)))/f;return d.copy(e).addScaledVector(We,P)}const Ue=`
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fb3(vec2 p){ return vn(p) * .57 + vn(p * 2.13 + 7.1) * .29 + vn(p * 4.31 + 3.7) * .14; }
`,tt=`
vec3 beyondGlow(float y){ float g = exp(-max(y, 0.) / 80.), h = exp(-max(y, 0.) / 1800.);
  return vec3(1.2, .6, .17) * (.5 * g * g + .5 * h) + vec3(.42, .17, .05) * g * .6 + vec3(.02, .035, .08); }
`,Pt=`
float seamRake(float side, float arc){ float a = max(arc - ${h(Y.plumb)}, 0.); return (side < 0. ? ${h(Y.rake[0])} : ${h(Y.rake[1])}) * a * a / (a * a + ${h(Y.ease*Y.ease)}); }
float seamOpen(float az, float e, float hw, float soft){ float ce = cos(e), x = az * ${h(L.R)} * ce, arc = e * ${h(L.R)}, c = hw * ce;
  return smoothstep(-soft, soft, x + c - seamRake(-1., arc)) * smoothstep(-soft, soft, c - seamRake(1., arc) - x) * (1. - smoothstep(${h(Y.top-6)}, ${h(Y.top)}, arc)); }
`,Xt=3.7,Qt=[[-1.24,.085,.37,.43,1,3.1],[-.33,.06,.5,.25,.55,7.7],[-.79,.04,.17,.1,.8,12.4],[-1.78,.05,.13,.085,.3,19.9],[-2.52,.075,.46,.34,.9,23.3],[.57,.055,.26,.16,.7,31.8],[1.48,.1,.52,.37,1,37.2],[2.18,.045,.3,.1,.2,41.5],[-3.02,.05,.22,.13,.6,47.9],[-.97,.36,.13,.06,.1,53.6],[.95,.3,.2,.08,.15,59.3],[-1,.022,.105,.08,.55,61.3],[-.55,.03,.08,.06,.35,67.9],[-1.5,.026,.09,.075,.7,71.2],[.21,.024,.1,.07,.4,77.5],[1.05,.03,.085,.065,.6,83.1],[2.7,.02,.11,.08,.5,89.7],[-2.1,.028,.095,.07,.45,93.3]],Tt=`
uniform vec3 uZen, uMid, uHaze, uCloudLit, uCloudShade, uSeaLine, uSunGlow; uniform float uBlush, uPaintSeed, uSunAz;
// PAINT HAS EDGES WHERE A PIXEL HOLDS ITS STROKES (gHard: 1 where a pixel holds one brush stroke, 0 where it holds
// many; set by the wall, and by the sea's mirror, from the pixel's footprint on the wall alone): a cloud's
// outline is a cut edge, and its light is laid in a few flat tones with hard borders, as a scene painter lays
// them; where a pixel is larger than the strokes it has their mean: the same clouds soft, and they read as sky
float gHard = 0.;
// THE PAINTED EVENING (gEve: 0 .. 1 by the BEARING ALONE, a fixed painting, the same at every metre and from every
// place): round most of the dome the painters laid an afternoon; toward the opening, from some sixty degrees either
// side of it, they turned it by degrees to an evening: a band of gold at the painted sea-line going to rose above
// it, the blue over it gone to violet, the clouds' undersides rose and gold and their heads a pale peach
float gEve = 0.;
// DEEPER BY THE SEAM (gDusk: 0 .. 1, again by the bearing alone: 0 beyond some 35 degrees from the opening, 1 at it):
// there the evening is painted a full tone darker, the band at the sea-line thin and going to rose, violet over it
// and a dusk blue above, the clouds violet with rose heads: the lit seam stands bright against a dark painted sky
float gDusk = 0.;
// one cumulus in its own frame: q.x across (-1..1), q.y up from its flat base (0..1 to its top). sd: its seed; tw: how
// far it towers; nz: the sky's shared noises (fine, broad); ls: the lamp's side (-1..1). Returns x: how much cloud,
// y: its light (0 in shade .. 1 lit). Seven heaps: three along the base, two shoulders, the tower's head, a side puff.
vec2 cumulus(vec2 q, float sd, float tw, vec2 nz, float ls){
  if (abs(q.x) > 1.25 || q.y < -.12 || q.y > 1.25) return vec2(0.);
  q += (nz.yx - .5) * vec2(.2, .12);
  float f1 = -1., f2 = -1., ws = 1e-4; vec2 nb = vec2(0., 1e-4);
  for (int j = 0; j < 7; j++){ float fj = float(j), a = h11(sd + fj * 1.7), b = h11(sd * 1.3 + fj * 2.9 + 4.);
    vec2 c; float r;
    if (j < 3) { c = vec2((fj - 1.) * .5 + (a - .5) * .28, .2 + .08 * b); r = .42 + .14 * b; }
    else if (j < 5) { c = vec2((fj - 3.5) * .66 + (a - .5) * .3, .42 + .14 * b); r = (.28 + .12 * a) * (.55 + .45 * tw); }
    else if (j < 6) { c = vec2((h11(sd + 9.) - .5) * .7 + (a - .5) * .1, .68 + .12 * b); r = (.2 + .1 * b) * tw; }
    else { c = vec2((a < .5 ? -1. : 1.) * (.78 + .1 * b), .13 + .05 * b); r = .2 + .1 * b; }
    if (r < .09) continue;                                      // (a heap too small to paint)
    vec2 d = (q - c) / vec2(r * 1.18, r); float f = 1. - length(d), w = exp(min(f, 1.) * 7.);
    nb += d * w; ws += w;                                        // the heaps melt into one another: their faces blend
    if (f > f1) { f2 = f1; f1 = f; } else if (f > f2) f2 = f; }
  float m = smoothstep(mix(-.1, .042, gHard), mix(.22, .078, gHard), f1 + (nz.x - .5) * .55) * smoothstep(mix(-.05, .009, gHard), mix(.08, .021, gHard), q.y + (nz.y - .5) * .06);
  vec2 n = nb / ws; n = n / max(length(n), .35);                // (a heap's broad face is flat to the light)
  float lit = .56 + .44 * dot(n, normalize(vec2(ls * .8, .62)));
  lit -= .12 * (1. - smoothstep(0., .3, f1 - f2)) * smoothstep(.1, .5, f1);   // the soft creases between the heaps
  lit *= .38 + .62 * smoothstep(-.02, .5, q.y);                 // the shadowed base
  return vec2(m, clamp(lit + (nz.x - .5) * .3, 0., 1.)); }
// the far small ones: one to a cell of the round, dealt in crowds and empty stretches, each its own size, height and base
vec3 farCloud(float az, float e, float cells, float sd, vec2 nz, float ls){
  float x = (az / 6.2831853 + .5) * cells + sd * 7.31, ci = floor(x), id = mod(ci, cells) + sd * 31.7, cw = 6.2831853 / cells;
  float r0 = h11(id), r1 = h11(id + 5.3), r2 = h11(id + 9.1), r3 = h11(id + 2.2);
  float crowd = smoothstep(.3, .62, vn(vec2(mod(ci, cells) * .43 + sd * 3., sd)));
  if (r0 > .3 + .62 * crowd) return vec3(0.);
  float hf = .15 + .25 * r2, off = (r3 - .5) * (1. - 2.5 * hf), eb = .005 + .05 * r1 * r1, hw = hf * cw;
  vec2 cm = cumulus(vec2((fract(x) - .5 - off) / hf, (e - eb) / (hw * (.4 + .5 * r0 / .9))), id, r1, nz, ls);
  return vec3(cm, eb); }
// lays one cloud over the sky: its lit and shaded paint, the LOW SUN's blush, the haze it stands in by its base
float gRelief = 0.;
void lay(inout vec3 col, inout float cl, vec2 cm, float eb){
  cm.y = clamp(cm.y + clamp(gRelief, -.4, .5) * (.35 + .65 * cm.y), 0., 1.);
  float qy = cm.y * 5., ky = (floor(qy) + smoothstep(.4, .6, fract(qy))) / 5.; cm.y = mix(cm.y, ky, gHard * .85);   // flat tones, hard borders
  vec3 cc = mix(uCloudShade * vec3(.8, .84, .92), uCloudLit, smoothstep(.16, .86, cm.y));
  cc = mix(cc, cc * vec3(1.06, .9, .82), uBlush * (1. - cm.y) * .8) + uBlush * vec3(.1, .02, -.02) * cm.y;
  vec3 ev = mix(mix(vec3(.6, .25, .36), vec3(1., .5, .2), smoothstep(.1, .45, cm.y)), vec3(1., .78, .5), smoothstep(.55, .95, cm.y));
  ev = mix(ev, mix(vec3(.3, .19, .4), vec3(.92, .42, .38), smoothstep(.35, .9, cm.y)), gDusk * .8);   // (by the seam: violet, rose heads)
  cc = mix(cc, ev, gEve * .9);                                  // the evening's clouds: rose and gold below, gold-cream heads
  float hz = .4 * exp(-eb * 22.); cc = mix(cc, mix(uHaze, mix(vec3(1., .62, .3), vec3(.66, .32, .42), gDusk), gEve * .85), hz);
  col = mix(col, cc, cm.x * (1. - .3 * hz)); cl = max(cl, cm.x); }
// fine, relief: the brush's own grain and the small billows' modelling at the place (signed; the wall gives them
// where a pixel is fine enough to hold them, the sea's mirror gives 0): they break the clouds' edges and tones
// into strokes and puffs
vec4 paintSky(float az, float e, float fine, float relief){
  float t = clamp(e / 1.5708, 0., 1.);
  float dS = mod(az - uSunAz + 3.14159265, 6.2831853) - 3.14159265;          // round the dome from the lamp-sun's place
  // the gradient as paint: a light blue at the sea-line (the haze band is a tint of the sky's own blue, not a
  // white, and only some 8 m tall), the clear deep blue above it (so that the wall near is sky BLUE), deepening
  // to the zenith; the dome's own air pales the far wall's foot from across the bay
  vec3 col = mix(mix(uHaze, uMid, .5), mix(uMid, uZen, .5), smoothstep(-.02, .022, t)); col = mix(col, uZen, smoothstep(.035, .7, t));
  col = mix(col, uHaze * vec3(1.03, 1., .96), .5 * exp(-e * 110.));           // the pale band at the sea-line
  gEve = 1. - smoothstep(.3, 1.08, abs(az));                                  // the painted evening, by the bearing from the opening
  gDusk = 1. - smoothstep(.05, .62, abs(az));                                 // and deeper by the seam
  col = mix(col, col * vec3(.52, .44, .82) + vec3(.03, 0., .05), gEve * .8 * smoothstep(.06, .5, e));
  col = mix(col, col * vec3(.36, .4, .78) + vec3(.008, .008, .035), gDusk * .8 * smoothstep(.1, .6, e));   // a dusk blue above
  // (the band at the painted sea-line: rose, going to a violet rose by the seam; the gold in it is a thin band at
  // the water, some 30 m tall round the evening and some 12 m by the seam)
  col = mix(col, mix(vec3(.8, .3, .34), vec3(.5, .2, .36), gDusk), gEve * .92 * exp(-e * 6.));
  col = mix(col, vec3(1., .55, .18), gEve * (.92 - .3 * gDusk) * exp(-e * (14. + 22. * gDusk)));
  col += uSunGlow * (.5 * exp(-(dS * dS * 2.4 + e * e * 10.)) + .22 * exp(-(dS * dS * .5 + e * e * 3.)));   // the lamp's side glows
  col *= 1. - .12 * smoothstep(1.3, 3., abs(dS)) * (1. - t);                 // and the far side is a deeper blue
  vec2 q0 = vec2(az * 26., e * 34.) + uPaintSeed; float n0 = fb3(q0);
  vec2 nz = vec2(n0 + fine, fb3(vec2(az * 7.3 + 3., e * 9.) + uPaintSeed * 1.7));
  float ls = clamp(sin(uSunAz - az) * 2.5, -1., 1.), cl = 0.;
  // the billows a painter models inside a cloud: every puff has its lit side toward the lamp and a blue-grey
  // underside (the same grain read a step toward the light); the wall's small puffs and strokes ride on them
  gRelief = (n0 - fb3(q0 + vec2(ls * .42, .38))) * .8 + relief;
  // thin high streaks, brushed long and slanting
  float st = fb3(vec2(az * 2.1 + e * 1.3 + uPaintSeed, (e - az * .3) * 15.)) * .7 + .3 * fb3(vec2(az * 5. - 2., (e - az * .3) * 31.));
  float wisp = smoothstep(.5, .78, st) * smoothstep(.34, .6, e) * (1. - smoothstep(1.1, 1.5, e));
  col = mix(col, mix(mix(uCloudLit, vec3(1., .66, .45), gEve * .8), col, .3), wisp * .55);
  // the far small ones low in the haze, then the great masses
  vec3 fc;
${[[41,1.3],[26,2.9],[15,4.6]].map(([e,t])=>`  fc = farCloud(az, e, ${h(e)}, ${h(t)} + uPaintSeed, nz, ls); lay(col, cl, fc.xy, fc.z);`).join(`
`)}
${Qt.map(e=>`  lay(col, cl, cumulus(vec2((mod(az - ${h(e[0])} + 3.14159265, 6.2831853) - 3.14159265) / ${h(e[2])}, (e - ${h(e[1])}) / ${h(e[3])}), ${h(e[5])}, ${h(e[4])}, nz, ls), ${h(e[1])});`).join(`
`)}
  col *= 1. - .24 * gEve - .26 * gDusk;                          // (an evening is painted a tone deeper than an afternoon; two by the seam)
  return vec4(col, cl); }
`,qe=18,ze=64,Ie=8,ot=16,Rt=(e,t)=>{const o=[(1-e)*(1-t),e*(1-t),(1-e)*t,e*t].filter(u=>u>1e-12),s=o.length,r=new Float64Array(1<<s),a=new Float64Array(1<<s);let d=1;a[0]=1;for(let u=0;u<s;u++){d*=(u+1)*o[u];for(let l=0;l<1<<u;l++)r[l+(1<<u)]=r[l]+o[u],a[l+(1<<u)]=-a[l]}return{n:s,S:r,G:a,d}},zt=(e,t)=>{let o=0;for(let s=0;s<e.S.length;s++){const r=t-e.S[s];if(r>0){let a=r;for(let d=1;d<e.n;d++)a*=r;o+=e.G[s]*a}}return o/e.d},at=Array.from({length:Ie},(e,t)=>Fe(0,1,(t+.5)/(2*Ie))),st=(()=>{const e=new Float64Array(ze+1);e[ze]=1;for(let t=0;t<Ie;t++)for(let o=0;o<=t;o++){const s=Rt(at[t],at[o]),r=(t===o?1:2)/(Ie*Ie);for(let a=1;a<ze;a++)e[a]+=r*zt(s,a/ze)}return e})(),eo=e=>{if(e<=0)return 0;if(e>=1)return 1;const t=e*ze,o=Me(Math.floor(t),1,ze-2),s=t-o,r=st;return-s*(s-1)*(s-2)/6*r[o-1]+(s+1)*(s-1)*(s-2)/2*r[o]-(s+1)*s*(s-2)/2*r[o+1]+(s+1)*s*(s-1)/6*r[o+2]},to=(e,t,o)=>{const s=Me((o-e)/(t-e),0,1);return s*s*(3-2*s)},Lt=(e,t,o)=>{const s=Math.max(t,0),r=Math.min(o,1);if(r<=s)return t>=1?0:1;const a=(r-s)/ot;let d=0;for(let u=0;u<=ot;u++){const l=s+u*a,i=(l-t)/(o-t);d+=(u===0||u===ot?1:u%2?4:2)*6*i*(1-i)/(o-t)*e(l)}return to(t,o,r)-d*a/3},Ve=(e,t)=>Lt(eo,e,t),oo=(e,t,o)=>{const s=at.map(r=>Rt(r,Fe(0,1,o)));return Lt(r=>r<=0?0:r>=1?1:s.reduce((a,d)=>a+zt(d,r),0)/Ie,e,t)},Mt=(e,t,o,s)=>{let r=0;for(let a=0;a<ze;a++)r+=(st[a+1]-st[a])*Ve((e-s*(a+.5)/ze)/o,(t-s*(a+.5)/ze)/o);return r},kt=(e,t)=>[0,1,2,3,4,5].map(o=>oo(e,t,o/10)),Wt=(e,t)=>`(${ge(e[0])}${e.slice(1).map((o,s)=>` + ${ge(o-e[s])} * clamp(${t} - ${s}., 0., 1.)`).join("")})`,Ht=kt(.7,.95),Dt=kt(.62,.9),rt=Array.from({length:21},(e,t)=>Ve(1-.022*t,1.1-.022*t)),$t=(()=>{const e=.2857142857142857*Math.sqrt(1.2),t=Math.sqrt(3/7-e),o=Math.sqrt(3/7+e),s=(18+Math.sqrt(30))/36,r=(18-Math.sqrt(30))/36;return{x:[-o,-t,t,o],w:[r,s,s,r]}})(),nt=`
// A LINE of half width w at distance d, under a pixel fw metres wide: DRAWN A PIXEL WIDE AT THE LEAST AND CARRYING
// THE COVER IT TRULY HAS (its own width over the width drawn, whole: no floor, no share kept)
float ln(float d, float w, float fw){ float ww = max(w, .5 * fw); return clamp((ww - d) / fw + .5, 0., 1.) * (w / ww); }
// the same line where it comes again every P metres: ITS OWN MEAN, 2 w / P, once a pixel is a period wide
float lnP(float d, float w, float P, float fw){ return mix(2. * w / P, ln(d, w, fw), 1. - smoothstep(.5 * P, P, fw)); }
// A ROUND DOT of radius r likewise: drawn to the radius rr, half a pixel at the least, its edge a ramp one pixel
// wide. That drawing's sum over the wall is pi (rr rr + f f / 12), so it carries r r over that: THE DOT'S SUM IS
// ITS OWN AREA, pi r r, AT EVERY FOOTPRINT (no more while a pixel is still about the dot's size, no less after)
float dotc(float d, float r, float f){ float rr = max(r, .5 * f); return clamp((rr - d) / f + .5, 0., 1.) * (r * r) / (rr * rr + f * f / 12.); }
// HOW MUCH OF A MARK S METRES ACROSS A PIXEL f METRES WIDE STILL HOLDS (1: the mark stands; 0: the pixel has only
// its mean). res: a soft mark, whole while the pixel is under half of it, its mean where the pixel is twice it;
// resc: a cell with a cut edge, whole under a quarter of it, its mean where the pixel is as large as the cell
float res(float S, float f){ return 1. - smoothstep(.5 * S, 2. * S, f); }
float resc(float S, float f){ return 1. - smoothstep(.25 * S, S, f); }
float uni(float a, float b){ return a + b - a * b; }           // two covers laid over one another
`,me={strap:.24,proud:.025,bevel:.025,tilt:.03,head:.09,dome:.03,pitch:.25,row:.05},ie=(()=>{const e=me,t=Math.hypot(e.proud,e.bevel),o=e.head/2,s=(o*o+e.dome*e.dome)/(2*e.dome),r=(s-e.dome)/s,a=l=>{const i=-(o+e.dome*l+.01),f=48,p=32,x=(o-i)/f,P=2*o/p,b=1/Math.hypot(l,1);let v=0;for(let T=0;T<f;T++)for(let $=0;$<p;$++){const z=i+(T+.5)*x,A=-o+($+.5)*P,c=z*z+A*A;if(c<=o*o)v+=1-Math.max(Math.sqrt(1-c/(s*s))+z*l/s,0);else{const m=(z*l+(s-e.dome))*b;m*m-c-(s-e.dome)*(s-e.dome)+s*s>0&&m<0&&(v+=1)}}return v*x*P},d=Math.PI*o*o,u=2*s*s/(3*o*o)*(1-r*r*r);return{half:e.strap/2,cb:e.bevel/t,sb:e.proud/t,r:o,Rs:s,cr:r,area:d,nz:u,net:[0,1,2,3,4].map(a),fill:d*(1-u)/2}})(),ge=e=>e.toFixed(6),ae={mid:62,full:58,ease:30,low:35,high:85,rest:.1,edge:.035,edgeDark:.8,taken:.5,headDark:.9,headSteel:.3,stainDark:.55,weep:[.3,1.4],weepWide:.07,weepDark:.45,steel:[.03,.018,.014],rust:[.12,.045,.02]},ao=(()=>{const e=me.head,t=2*me.row,o=ae.taken,s=Math.PI*e*e,r=t<2*e?2*e*e*Math.acos(t/(2*e))-t/2*Math.sqrt(4*e*e-t*t):0;return{common:r,near:(2*o*s-o*o*r)/(4*me.pitch)}})(),Gt=`
const float SWH = ${h(ie.half)}, SCB = ${h(me.bevel)}, SPR = ${h(me.proud)}, SCO = ${h(ie.cb)}, SSI = ${h(ie.sb)};
const float HDR = ${h(ie.r)}, HDS = ${ge(ie.Rs)}, HDC = ${h(ie.cr)}, HDD = ${h(me.dome)}, HDP = ${h(me.pitch)}, HDO = ${h(me.row)};
// a head's own net under the lamp, square metres of full shade (PL.net: worked at t = 0, 1, 2, 3, 4, straight between)
float headNet(float tt){ return ${ge(ie.net[0])}${ie.net.slice(1).map((e,t)=>` + ${ge(e-ie.net[t])} * clamp(tt - ${t}., 0., 1.)`).join("")}; }
// ONE STRAP ACROSS ITS WIDTH: x metres (signed) from the joint's line, tl its face's own tilt, f the pixel across
// it, P metres to the next strap. Toward the lamp its bevel faces the light (cos b + t sin b of the plate's light),
// away from it the other bevel loses it (cos b - t sin b, none below nothing) and casts A SHORT SHADE on the plate,
// proud t less the bevel wide; the face is a touch lighter or darker by its tilt (as often one as the other).
// ITS OWN MEAN, where a pixel is a period wide: each band's width over P times what it holds, the tilt's nothing
vec2 strapRel(float x, float t, float tl, float f, float P){
  float xs = t < 0. ? -x : x, ta = min(abs(t), 4.), s = max(SPR * ta - SCB, 0.), on = 1. - smoothstep(.5 * P, P, f);
  float nb = ln(abs(xs - (SWH - .5 * SCB)), .5 * SCB, f), fb = ln(abs(xs + (SWH - .5 * SCB)), .5 * SCB, f);
  float kn = SCO + ta * SSI - 1., kf = max(SCO - ta * SSI, 0.) - 1.;
  return vec2(mix((SCB * (kn + kf) - s) / P, nb * kn + fb * kf - ln(abs(xs + SWH + .5 * s), .5 * s, f) + ln(abs(x), SWH - SCB, f) * tl * t, on),
              -.5 * (1. - SCO) * mix(2. * SCB / P, nb + fb, on)); }
// ONE DOMED HEAD, q metres from its middle (across the strap, along it), T the lamp's light likewise, dr the way to
// the lamp: its lit side and its shaded side by the cap's own facing, and ITS SHORT CAST SHADE where the way to the
// lamp from the plate meets the ball. Under a pixel larger than itself: its true cover by area and its own net
vec2 headAt(vec2 q, vec2 T, vec3 dr, float f, float hr, float net){
  float d = length(q), cov = dotc(d, HDR, f), nz = sqrt(max(1. - d * d / (HDS * HDS), HDC * HDC));
  vec3 w = vec3(q, HDS - HDD); float b = dot(w, dr), disc = b * b - dot(w, w) + HDS * HDS;
  float sh = clamp(disc / (2. * HDS * f) + .5, 0., 1.) * step(b, 0.) * clamp((d - HDR) / f + .5, 0., 1.) * hr;
  return vec2(cov * mix(-net / ${ge(ie.area)}, max(nz + dot(q, T) / HDS, 0.) - 1., hr) - sh, -.5 * cov * mix(${h(1-ie.nz)}, 1. - nz, hr)); }
// THE TWO ROWS OF HEADS ON ONE STRAP: x across it (signed), y along it, ho a row's place off the line, T the lamp's
// light (across, along), f the pixel, P metres to the next strap. Where a pixel holds the heads of a row (from
// half the pitch to the pitch) the row is A LINE AS WIDE AS ITS HEADS' NET OVER THEIR SPACING, which itself ends
// in its own mean: two such rows over P
vec2 headsRel(float x, float y, float ho, vec2 T, float f, float P){
  float tt = min(length(T), 4.), yy = (fract(y / HDP) - .5) * HDP, hr = res(HDR, f), net = headNet(tt);
  vec3 dr = vec3(T, 1.) * inversesqrt(1. + dot(T, T));
  vec2 one = headAt(vec2(x - ho, yy), T, dr, f, hr, net) + headAt(vec2(x + ho, yy), T, dr, f, hr, net);
  float wk = net / (2. * HDP), wa = ${ge(ie.fill/(2*me.pitch))}, on = 1. - smoothstep(.5 * P, P, f);
  vec2 rows = -vec2(mix(4. * wk / P, ln(abs(x - ho), wk, f) + ln(abs(x + ho), wk, f), on), mix(4. * wa / P, ln(abs(x - ho), wa, f) + ln(abs(x + ho), wa, f), on));
  return mix(rows, one, 1. - smoothstep(.5 * HDP, HDP, f)); }
// THE WEAR AT A PLACE (WEAR's one law): bearing the place's own bearing on the dome (radians), arc its metres up
const float WEDGE = ${h(ae.edge)}, WTAKE = ${h(ae.taken)}, WSR = ${h(2*ie.r)}, WL0 = ${h(ae.weep[0])}, WL1 = ${h(ae.weep[1])}, WWEEP = ${h(ae.weepWide)};
const vec3 WSTEEL = vec3(${ae.steel.map(h).join(", ")}), WRUST = vec3(${ae.rust.map(h).join(", ")});
float wearAt(float bearing, float arc){
  float d = abs(mod(bearing - ${h(ae.mid*V)} + 3.14159265, 6.2831853) - 3.14159265);
  return (1. - smoothstep(${h(ae.full*V)}, ${h((ae.full+ae.ease)*V)}, d)) * mix(1., ${h(ae.rest)}, smoothstep(${h(ae.low)}, ${h(ae.high)}, arc)); }
// THE TWO EDGES OF ONE STRAP (x across it, f the pixel, P to the next strap): the line of bare steel WEDGE wide
// along each edge, by its true cover. ITS OWN MEAN over a period: 2 WEDGE / P
float edgeWear(float x, float f, float P){
  return mix(2. * WEDGE / P, ln(abs(x - SWH), .5 * WEDGE, f) + ln(abs(x + SWH), .5 * WEDGE, f), 1. - smoothstep(.5 * P, P, f)); }
// THE HEADS OF ONE STRAP THAT RUST HAS TAKEN (x across the strap, y along it, ho its rows' offset, f the pixel, P
// to the next strap, id the strap's own number): WTAKE of the heads, dealt head by head by the plate's own hash
// (the kit's h21). x: a taken head's own disc; y: its stain, a disc twice as wide (two stains that meet across a
// strap lie over one another). Each by its true cover by area; where a pixel holds the heads of a row, lines as
// wide as the taken discs' areas over their spacing. THEIR OWN MEANS over a period: the heads' WTAKE 2 pi r r /
// (pitch P); the stains' four times that, less (where the two rows stand nearer than a stain's width) the share
// two taken stains hold in common: WTAKE WTAKE times their common area / (pitch P)
vec2 headsWear(float x, float y, float ho, float f, float P, float id){
  float c = floor(y / HDP), yy = (fract(y / HDP) - .5) * HDP, wk = ${ge(ae.taken*Math.PI*ie.r*ie.r/(2*me.pitch))};
  float ws = ho < WSR ? ${ge(ao.near)} : 4. * wk;
  float ta = step(h21(vec2(c + 3., id * 2. + 17.)), WTAKE), tb = step(h21(vec2(c + 3., id * 2. + 18.)), WTAKE);
  float da = length(vec2(x - ho, yy)), db = length(vec2(x + ho, yy));
  vec2 one = vec2(dotc(da, HDR, f) * ta + dotc(db, HDR, f) * tb, max(dotc(da, WSR, f) * ta, dotc(db, WSR, f) * tb));
  vec2 lines = vec2(ln(abs(x - ho), wk, f) + ln(abs(x + ho), wk, f), ln(abs(x - ho), ws, f) + ln(abs(x + ho), ws, f));
  vec2 rows = mix(vec2(4. * wk, 4. * ws) / P, lines, 1. - smoothstep(.5 * P, P, f));
  return mix(rows, one, 1. - smoothstep(.5 * HDP, HDP, f)); }
// (a strap's taken heads h.x and their stains h.y as wear both ways: a stain stainDark of the way to rust, a head
// headDark of the way where it stands in its stain, and headSteel of the way on to bare steel)
vec2 headTone(vec2 h){ return vec2(h.x * ${h(ae.headSteel)}, h.y * ${h(ae.stainDark)} + h.x * ${h(ae.headDark-ae.stainDark)}); }
// THE WEEPS UNDER ONE LEVEL STRAP: x metres along the joint, y metres above its line, row the joint's own number,
// fu and fv the pixel along and up, P to the next level joint. Under each taken head of the strap's lower row a
// streak WWEEP wide hangs from the strap's lower edge line, its length dealt by the plate's own hash between WL0
// and WL1, whole at its head and fading to nothing at its foot. Where a pixel holds the columns: the taken columns'
// cover (WTAKE WWEEP over the pitch) times what is left of a streak at that depth by the lengths' own law. Where a
// pixel is deeper than the streaks: a band of their own weight, one mean length deep, which ends in ITS OWN MEAN
// over a period: WTAKE WWEEP / pitch * (WL0 + WL1) / 4 / P
float weepWear(float x, float y, float row, float fu, float fv, float P){
  float c = floor(x / HDP), wx = (fract(x / HDP) - .5) * HDP, tk = step(h21(vec2(c + 3., row * 2. + 18.)), WTAKE);
  float wl = mix(WL0, WL1, h21(vec2(c + 5., row * 2. + 31.))), wy = -(y + SWH + .5 * WEDGE);
  float top = clamp(wy / fv + .5, 0., 1.), m = clamp(wy, WL0, WL1);
  float left = clamp(((WL1 - m) - max(wy, 0.) * log(WL1 / m)) / (WL1 - WL0), 0., 1.);
  float along = mix(WTAKE * WWEEP / HDP * left, tk * ln(abs(wx), .5 * WWEEP, fu) * clamp(1. - wy / wl, 0., 1.), 1. - smoothstep(.5 * HDP, HDP, fu)) * top;
  float band = lnP(abs(wy - ${h((ae.weep[0]+ae.weep[1])/4)}), ${h((ae.weep[0]+ae.weep[1])/4)}, P, fv) * (WTAKE * WWEEP / HDP) * .5;
  return mix(band, along, res(WL0, fv)); }
// THE WEAR OF ONE PLACE, both ways (x: the way to bare steel, y: the way to rust), from the upright strap's marks
// (xu across it, yu along it, fu, Pu, idu its own number) and the level strap's (xv, yv, fv, Pv, row its own
// number, and its weeps); mu, mv: how much of each shows there (1 where nothing lies over it); fh the pixel for
// the heads. Where the two straps cross, the two covers lie over one another
vec2 wearMarks(float xu, float yu, float fu, float Pu, float mu, float idu, float xv, float yv, float fv, float Pv, float mv, float row, float fh){
  vec2 wu = (vec2(edgeWear(xu, fu, Pu) * ${h(ae.edgeDark)}, 0.) + headTone(headsWear(xu, yu, HDO, fh, Pu, idu))) * mu;
  vec2 wv = (vec2(edgeWear(xv, fv, Pv) * ${h(ae.edgeDark)}, weepWear(yv, xv, row, fu, fv, Pv) * ${h(ae.weepDark)}) + headTone(headsWear(xv, yv, HDO, fh, Pv, row))) * mv;
  return wu + wv - wu * wv; }
`,so=`
attribute float aSide; uniform float uGapHalf; varying vec3 vWorld, vHome; varying float vSide;   // aSide: 0 the fixed shell, -1 and +1 the left and the right rolled panel
#include <fog_pars_vertex>
void main(){
  // (a rolled panel has come from its home by the gap's half width, its own way; the left one SEAM.off further)
  vHome = position; vSide = aSide; float roll = abs(aSide) > .5 ? (aSide * uGapHalf - ${h(Y.off)}) / ${h(L.R)} : 0., c = cos(roll), s = sin(roll);
  vec3 p = vec3(c * position.x - s * position.z, position.y, s * position.x + c * position.z);      // a rolled panel: about the dome's own axis
  vec4 wp = modelMatrix * vec4(p, 1.); vWorld = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ro=`
varying vec3 vWorld, vHome;
uniform float uTime, uKey, uFill, uGapAz, uGapHalf, uRare; uniform vec3 uLampCol, uFillCol, uBeamAim, uSpill; varying float vSide;
uniform vec4 uBoardA[${qe}], uBoardB[${qe}];
const float RS = ${h(L.R)}, GORE = ${h(L.gore)}, JOINT = ${h(L.joint)};
${Ue}
${Pt}
${Tt}
${St}
#include <fog_pars_fragment>
${nt}
${Gt}
// the shade of the flat boards that hang before the wall (their places are the world's: uBoardA, uBoardB)
float boardShade(vec3 P, vec3 D){ float sh = 0.;
  for (int i = 0; i < ${qe}; i++){ vec4 A = uBoardA[i], B = uBoardB[i]; if (B.w < .5) continue;
    vec3 n = vec3(sin(B.x), 0., -cos(B.x)); float dn = dot(D, n); dn = abs(dn) < 1e-3 ? 1e-3 : dn;
    float t = dot(A.xyz - P, n) / dn; if (t < 0.) continue;
    vec3 q = P + D * t - A.xyz; vec2 uv = vec2(dot(q, vec3(-n.z, 0., n.x)) / A.w, q.y / B.y);
    float r = length(uv * vec2(1., 1.15)) + .16 * sin(uv.x * 7. + B.z * 40.) * (.5 + .5 * uv.y);
    sh = max(sh, 1. - smoothstep(.82, 1.02, r)); }
  return sh; }
void main(){
  float fw = max(length(fwidth(vHome)), 1e-3), vEdge = step(.5, abs(vSide));   // metres of wall under one pixel; on a rolled panel or on the shell
  vec3 hd = normalize(vHome);
  // the pixel's footprint ALONG the wall (fu) and UP it (fv), each on its own: looked along, the wall's level lines
  // stay as crisp as their own direction allows, and only the uprights (edge on) thin away
  vec3 taz = normalize(vec3(-hd.z, 0., hd.x) + 1e-5), tup = normalize(vec3(-hd.x * hd.y, max(1. - hd.y * hd.y, 1e-4), -hd.z * hd.y));
  vec3 dxh = dFdx(vHome), dyh = dFdy(vHome);
  float fu = max(abs(dot(dxh, taz)) + abs(dot(dyh, taz)), 1e-3), fv = max(abs(dot(dxh, tup)) + abs(dot(dyh, tup)), 1e-3);
  float e = asin(clamp(hd.y, -1., 1.)), az = atan(hd.x, -hd.z + 1e-6) - uGapAz;
  az = mod(az + 3.14159265, 6.2831853) - 3.14159265;
  float arc = e * RS, rw = max(RS * cos(e), 1.), W = GORE * rw;
  float g = az / GORE, gi = floor(g), gf = fract(g) - .5, ja = arc / JOINT, ji = floor(ja);
  float sd = (gf - .5 * sign(gf)) * W, ds = abs(sd), dj = min(fract(ja), 1. - fract(ja)) * JOINT, db = (ji + 1.) * JOINT - arc;
  float pid = h21(vec2(gi + 40., ji + 3.));
  // each panel was painted flat and then hung: its painting sits a hand out of true with its neighbours'
  float slip = (pid - .5) * .0012;
  // (NO AIR OF ITS OWN: nothing here reads the metres from the eye. What takes the wall's marks away across the bay
  // is that a pixel there is larger than they are: each is filtered by the pixel's footprint ON THE WALL to ITS OWN
  // MEAN, by a ramp chosen from the mark's own size; the scene's fog is the air, and the only air)
  float su = az * rw;                                          // metres along the wall
  // BY THE OPENING THE WALL IS PLAINLY A WALL from across the bay too (BY PLACE): within some three panels of it
  // the uprights' cover straps are heavier (nearGap), and some five panels each way the level BELTS at the cross
  // joints stand deep as ring beams, with the two rails (girdP); wide marks, which a pixel across the bay holds
  float gor = abs(az) / GORE;
  float nearGap = (1. - smoothstep(2.2, 4.2, gor)) * (1. - smoothstep(120., 190., arc)), girdP = (1. - smoothstep(4., 6.5, gor)) * (1. - smoothstep(130., 200., arc));
  // THE PAINTING'S CUT EDGES AND FLAT TONES ARE LAID IN STROKES (below: a stroke some 0.3 m across), and stand
  // where a pixel holds a stroke; where it cannot, the pixel has their mean, which is the soft painting (gHard).
  // (SEEN ALONG ITS FACE the pixel's footprint is long one way: fl is its longest reach on the wall)
  float fl = max(fw, max(fu, fv));
  gHard = res(.32, fl);
  // THE BRUSH: strokes a forearm wide and a stride long laid slanting (1.2 by 0.32 m), smaller dabs among them
  // (0.45 by 0.14 m). THE PAINTING TAKES THEM AS ITS GRAIN: they break the clouds' edges and tones into strokes,
  // so that near the wall the sky is plainly PAINT at its full strength, cloud and blue, not a pale blank. Each
  // size is filtered along the wall and up it by its own length and width; as often light as dark: its mean is nothing
  float bc = .5 + (vn(vec2(su / 1.2 + arc + pid * 30., arc / .32 - su * .24)) - .5) * .6 * res(1.2, fu) * res(.32, fv)
                + (vn(vec2(su / .45 + 7., arc / .14 + pid * 11.)) - .5) * .4 * res(.45, fu) * res(.14, fv);
  // (a stroke is a dab with an edge: the same grain cut at its middle, the cut as wide as the pixel's reach across a stroke)
  float bwd = clamp(fl / .3, .03, .5), bs = smoothstep(.5 - bwd, .5 + bwd, bc);
  vec3 nrm = -normalize(vWorld), Lv = uLamp - vWorld; float Ld = max(length(Lv), 1.); vec3 Ln = Lv / Ld;
  float sl = dot(Ln, taz) >= 0. ? 1. : -1.;
  // the small billows, some 5 m across: modelled as the painter models them, light on the lamp's side and above
  // (a soft mark as often light as dark: filtered by its own 5.6 m to nothing)
  vec2 pq5 = vec2(su / 7.5, arc / 5.6); float puff = (vn(pq5) - vn(pq5 + vec2(sl * .42, .46))) * res(5.6, fl);
  vec4 pc = paintSky(az + slip * .6, max(e + slip, 0.), (bs - .5) * .3, puff * .55 + (bs - .5) * .7);
  vec3 col = pc.rgb * (1. + (pid - .5) * .016);               // (each panel a breath its own way: a panel is 30 m and more, held by every pixel in the dome)
  // THE PLATES: every panel is of bolted plates, eight across and eight between cross joints, each course set half a
  // plate along. pu, pj: the plate's place; sv, sh: metres (signed) from its nearest upright and level joint
  float PW = W / 8., PH = JOINT / 8., pj = ja * 8., pu = g * 8. + .5 * mod(floor(pj), 2.);
  float sv = (fract(pu + .5) - .5) * PW, sh = (fract(pj + .5) - .5) * PH, plate = h21(vec2(floor(pu) + 11., floor(pj) + 5.));
  // (a plate's own tone and tilt: cells with cut edges, as often light as dark; their mean is nothing)
  float plF = resc(PH, max(fu, fv));
  col *= 1. + (plate - .5) * .03 * plF;                        // each plate takes the paint a shade its own way
  // THE PLATES' RELIEF: each plate was hung a little out of true (a tilt of its own, half a degree at the most), so
  // the lamp's raking light takes each plate a shade its own way: a soft step of light at every joint, plainest where
  // the light rakes
  vec2 tiltP = (vec2(plate, h21(vec2(floor(pu) + 3., floor(pj) + 29.))) - .5) * .0175;
  col *= 1. - clamp(tiltP.x * dot(Ln, taz) + tiltP.y * dot(Ln, tup), -.0125, .0125) * 2.4 * plF;
  // the strokes' own tone on the clouds; on the blue long level sweeps (7 by 0.4 m), and THE ROLLER'S LAPS: bands
  // 0.45 m tall (a roller's width), each a shade its own way, a darker line 1.6 cm wide where one lap overlies the
  // next, the laps' edges wandering a little. (the sweeps and the laps' tones: as often light as dark, mean nothing;
  // a lap's cut edge is laid over the pixel that straddles it; the lap line ends in its own mean, 2 w over the lap)
  float bl = .5 + (vn(vec2(su / 7. + pid * 9., arc / .4 + gi * 3.)) - .5) * res(7., fu) * res(.4, fv);
  float lapI = arc / .45 + pid * 7. + (vn(vec2(su / 2.6 + pid * 5., floor(arc / .45) * 3.1)) - .5) * .3, lapF = fract(lapI), lapE = min(lapF, 1. - lapF) * .45;
  float lapT = mix(h11(floor(lapI) + gi * 13.7), h11(floor(lapI) + (lapF > .5 ? 1. : -1.) + gi * 13.7), clamp(.5 - lapE / fv, 0., .5)) - .5;
  float lapTone = lapT * .08 * resc(.45, fv) - .17 * lnP(lapE, .008, .45, fv);
  col *= 1. + (bs - .5) * .4 * pc.a + ((bl - .5) * .07 + lapTone) * (1. - pc.a);
  // (the bristles' own hairlines inside every stroke, a finger tall and a metre or two long, along the stroke:
  // filtered up the wall by their 5.5 cm and along it by their 1.6 m; as often light as dark, mean nothing)
  float hair = vn(vec2(su / 1.6 + pid * 17., (arc - su * .076) / .055));
  col *= 1. + (smoothstep(.3, .7, hair) - .5) * .13 * res(.055, fv) * res(1.6, fu);
  // PAINT RUNS: under every level joint thin drips of the paint itself (2.4 cm wide, one column of 21 cm in 0.45
  // carries one), each its own length (0.25 to 1.95 m), a bead at its end
  float dcol = su / .21 + floor(pj) * 5.3, dh = h11(floor(dcol) * 1.7 + floor(pj) * 9.1), dlen = .25 + 1.7 * dh * dh, dx = (fract(dcol) - .5) * .21;
  float dbelow = (1. - fract(pj)) * PH, dend = .5 * fv + .015;
  float drip = step(.55, h11(floor(dcol) * 3.3 + 1.)) * ln(abs(dx), .012 + .01 * smoothstep(dlen - .14, dlen, dbelow), fu) * (1. - smoothstep(dlen - dend, dlen + dend, dbelow));
  // (ITS MEAN ALONG THE WALL at a place under the joint, once a pixel is a column wide: the share of columns that
  // run, 0.45, times a run's width over the column's, 2 w / 0.21, summed over the runs that reach so far down: THE
  // PLAIN HALF WIDTH, 0.012, times their share (1 less the root of the depth past 0.25 m over 1.7: rn0), AND THE
  // BEAD, 0.01 more eased in over a run's last 0.14 m, by the runs whose bead stands at that depth. Taken by the
  // root of a run's own length past 0.25 m over 1.7, which is its die, evenly dealt, the bead's easing is a plain
  // polynomial of the sixth power between the roots rn0 and rn1: summed whole by Gauss's rule at four places.
  // The bead adds 7 to 17 in a hundred to the plain width's part from 0.3 to 1.6 m under the joint, and more than
  // half of it where the longest runs end)
  float rnq = (dbelow - .25) / 1.7, rn0 = sqrt(clamp(rnq, 0., 1.)), rn1 = sqrt(clamp(rnq + ${ge(.14/1.7)}, 0., 1.));
  vec4 rng = .5 * (rn0 + rn1) + .5 * (rn1 - rn0) * vec4(${$t.x.map(ge).join(", ")}), rnu = clamp((rnq + ${ge(.14/1.7)} - rng * rng) / ${ge(.14/1.7)}, 0., 1.);
  float rnBead = .5 * (rn1 - rn0) * dot(vec4(${$t.w.map(ge).join(", ")}), rnu * rnu * (3. - 2. * rnu));
  drip = mix(${h(.45*2/.21)} * (.012 * (1. - rn0) + .01 * rnBead), drip, 1. - smoothstep(.105, .21, fu));
  // (AND OVER A WHOLE PLATE, once a pixel is a plate tall: that share times the runs' mean length, 0.25 + 1.7 / 3 m,
  // with the bead's widening over its last 7 cm, over the plate's height)
  drip = mix(${h(.45*(2*.012*(.25+1.7/3)+2*.01*.07)/.21)} / PH, drip, 1. - smoothstep(.5 * PH, PH, fv));
  col = mix(col, col * vec3(.64, .72, .86), drip * .9);
  // REPAINTED PATCHES: one plate in five carries a patch of fresher sky a shade off (half of them lighter, half
  // darker by the same shade: their mean is nothing), rolled on in lanes 0.25 m wide, its edge a plain line 1.6 cm
  // wide; a patch is 1.2 m and more across
  vec2 pq = vec2(fract(pu), fract(pj)); float ph = h21(vec2(floor(pu) + 3., floor(pj) + 17.)), patF = res(1.2, fl);
  vec2 p0 = vec2(.1 + .3 * h11(ph * 7.1), .12 + .3 * h11(ph * 3.3)), p1 = p0 + vec2(.3 + .28 * h11(ph * 5.7), .3 + .26 * h11(ph * 9.9));
  float pe = min(min(pq.x - p0.x, p1.x - pq.x) * PW, min(pq.y - p0.y, p1.y - pq.y) * PH), mend = step(ph, .2) * clamp(pe / max(fw, .02) + .5, 0., 1.) * patF;
  float lane = step(.5, fract(su / .5 + ph * 3.));
  col = mix(col, col * (1. + (ph < .1 ? 1. : -1.) * vec3(.025, .03, .04)) * (1. + (lane - .5) * .012 * resc(.25, fu)), mend);
  // (the edge line's own mean: one plate in five, the patch's mean girth, 2 (0.44 PW + 0.43 PH), times the line's
  // width, over the plate's area)
  col *= 1. - .2 * mix(.2 * 2. * (.44 * PW + .43 * PH) * .016 / (PW * PH), step(ph, .2) * ln(abs(pe - .012), .008, fw), patF);
  // THE RARE PLATE (when dealt: uRare): one plate on the long wall, three courses up, was hung in its red-lead primer
  // and never painted; it stands there at every metre (under a pixel larger than itself it keeps its true cover)
  float rex = (.5 - abs(fract(pu) - .5)) * PW, rey = (.5 - abs(fract(pj) - .5)) * PH;
  float rareP = uRare * step(abs(floor(pu) + 77.), .5) * step(abs(floor(pj) - 2.), .5) * clamp(min(rex / fu, rey / fv) + .5, 0., 1.) * min(1., PW / fu) * min(1., PH / fv);
  col = mix(col, vec3(.5, .15, .07) * (.8 + .4 * bc + .25 * (bl - .5)), rareP * .94);
  // RUST AND WEATHER: here and there a streak runs down from a level joint (1.2 m: it thins by that length), longer
  // and browner under the cross joints (2.5 m). EACH PART ENDS IN ITS OWN MEAN: which columns run (0.34 m and
  // 0.55 m wide, a cut of the noise, where a pixel is a column wide); the fine grain in them in
  // its middle; the run down the wall in its mean over the joint's period, L / P (1 - exp(-P / L)).
  // THE COLUMNS' MEAN IS THE COURSE'S OWN: a course holds the noise's second place, so its columns are ONE LINE of
  // the noise, and their mean is that line's, by its share between two rows of the noise's dice (rowP, rowJ: in
  // tenths from the nearer row, 0 to 5, as the courses' numbers fall; vnMeanRow, the noise's own law along a
  // line). By the share the plates' streaks stand in ${Ht.map(e=>e.toFixed(3)).join(", ")} of their columns (the
  // whole wall's mean ${Ve(.7,.95).toFixed(3)}), the cross joints' in ${Dt.map(e=>e.toFixed(3)).join(", ")} (${Ve(.62,.9).toFixed(3)})
  float below = (1. - fract(pj)) * PH;                         // metres under the level joint above
  float rowP = abs(fract(floor(pj) * 7.3 + 2.5) - .5) * 10., rowJ = abs(fract(ji * 7.3 + 2.5) - .5) * 10.;
  float streak = mix(${Wt(Ht,"rowP")}, smoothstep(.7, .95, vn(vec2(su / .34, floor(pj) * 7.3 + 2.))), resc(.34, fu))
    * mix(1.2 / PH * (1. - exp(-PH / 1.2)), exp(-below / 1.2), res(PH, fv)) * (.75 + .5 * (vn(vec2(su / .12, arc / 2.)) - .5) * res(.12, fu) * res(2., fv));
  float st = mix(${Wt(Dt,"rowJ")}, smoothstep(.62, .9, vn(vec2(su / .55, ji * 7.3 + 2.))), resc(.55, fu))
    * mix(${h(2.5/L.joint*(1-Math.exp(-L.joint/2.5)))}, exp(-db / 2.5), res(JOINT, fv)) * (.775 + .45 * (vn(vec2(su / .16, arc / 3.)) - .5) * res(.16, fu) * res(3., fv));
  col = mix(col, col * vec3(.66, .47, .33), min(streak * .6 + st * .5, .85));
  // (the salt bloom low on the wall, patches 2.3 by 1.4 m: its mean the mean of its cut of the noise)
  float salt = (1. - smoothstep(1.6, 7.5, arc)) * mix(${h(Ve(.3,.8))}, smoothstep(.3, .8, vn(vec2(su / 2.3 + 5., arc / 1.4))), res(2.3, fu) * res(1.4, fv));
  col = mix(col, col * .9 + vec3(.09), salt * .3);
  // THE TIDE STAIN to 2 m: wet and dark at the water, thinning upward in runs (never a clean edge); the salt line.
  // (the foot's bands stand at every distance: each band's edge is spread over the pixel's reach up the wall, hv
  // either way, and so keeps its own cover; the salt line keeps the cover it truly has)
  float rag = mix(.5, vn(vec2(su / .33, 3.)), 1. - smoothstep(.08, .3, fw)) * .6 + mix(.5, vn(vec2(su / .09, 9.)), 1. - smoothstep(.02, .08, fw)) * .4, top = 1.25 + rag * 1.1;
  float hv = .5 * fv, tide = (1. - smoothstep(top - .9 - hv, top + hv, arc)) * mix(1., .55, smoothstep(.2, top, arc));
  col = mix(col, col * vec3(.5, .55, .47) + vec3(.01, .016, .012), tide * .62);
  col = mix(col, vec3(.8, .81, .78), ln(abs(arc - top + .05), .04, fv) * .45);
  col = mix(col, uSeaLine, (1. - smoothstep(.25 - hv, .55 + hv, arc)) * .85);          // the painted far sea-line, at the water
  float lap = .34 + .16 * sin(uTime * 1.1 + su * .21) + .09 * sin(uTime * 1.9 - su * .57);
  col *= mix(1., .74, 1. - smoothstep(lap - hv, lap + .1 + hv, arc));
  // THE JOINTS. Between plates: A BUTT STRAP over every joint and its two rows of domed heads (PLATE; drawn below
  // at THE RELIEF, by the lamp's own light: no dark line is drawn for a joint). Between panels and at the cross
  // joints: a cover strap of the same width, a shade darker than the paint, a lip of light and its far edge in
  // shade, the same two rows of heads inside its edges.
  // (EACH LINE IS FILTERED BY THE FOOTPRINT ACROSS IT, an upright by fu, a level one by fv; it carries its true
  // cover, and ends in its own mean over its period: 2 w over the panel's width or the joint's)
  // (by the opening the straps and belts are wider and darker, their lips and shades with them: BY PLACE)
  float sw = SWH + ${h(.6-ie.half)} * nearGap, swv = SWH + ${h(.9-ie.half)} * girdP;
  float jl = arc - ji * JOINT - JOINT * step(.5, fract(ja));   // metres (signed) from the nearest cross joint
  float strap = uni(lnP(ds, sw, W, fu), lnP(dj, swv, JOINT, fv));
  col = mix(col, col * mix(vec3(.93, .94, .96), vec3(.4, .44, .52), max(nearGap, girdP)), strap);
  float lpU = .01 + .03 * nearGap, lpV = .012 + .04 * girdP, shU = .015 + .045 * nearGap, shV = .018 + .2 * girdP;
  col *= 1. + .34 * uni(lnP(abs(sd * sl - sw + lpU), lpU, W, fu), min(lnP(abs(jl - swv + lpV), lpV, JOINT, fv) * (.6 + .6 * girdP), 1.));
  col *= 1. - .56 * uni(lnP(abs(sd * sl + sw + shU), shU, W, fu), lnP(abs(jl + swv + shV), shV, JOINT, fv));
  // THE TWO RAILS THE PANELS RIDE, PLAIN ON THE WALL either hand of the opening (BY PLACE: some five panels each
  // way, never on a rolled panel): a girder 2.2 m deep along the door-top line and a kerb rail at the water, each
  // dark steel with a bright upper flange and its shade under it; they run along the wall into the opening, where
  // the true rails carry on behind the panels. Wide marks: a pixel across the bay holds them (a wall's own lines);
  // each keeps its true cover. (they stand among the level belts, so that no line hangs alone across the painted sky)
  float railN = girdP * (1. - vEdge);
  float hiR = ln(abs(arc - ${h(L.doorTop)}), 1.1, fv), loR = ln(abs(arc - 1.3), .62, fv);
  col = mix(col, vec3(.07, .08, .1), max(hiR, loR) * railN);
  col = mix(col, vec3(.52, .54, .58), max(ln(abs(arc - ${h(L.doorTop+.96)}), .14, fv), ln(abs(arc - 1.84), .09, fv)) * railN * .85);
  col *= 1. - .42 * railN * max(ln(abs(arc - ${h(L.doorTop-1.55)}), .42, fv), 0.);
  // THE RELIEF (GLSL_PLATE): the plates' butt straps and all the heads, as the lamp shows them at this place. T: the
  // lamp's light along the wall and up it, its tangent over its normal part (taken to 4 at the most). Each upright
  // strap's face hangs out of true its own way (tlt). Under a panel's cover strap or a belt the plates' own straps
  // do not show (pmU, pmV: the share of the pixel beside those, by their true cover); the cover straps and belts
  // carry their own two rows of heads, 7 cm inside their edges. rel.x goes to the lamp's part of the light below,
  // rel.y to the fill's: where a shade lies (our sail's, a board's) the lamp's part of the relief goes with it
  vec2 T = vec2(dot(Ln, taz), dot(Ln, tup)) / max(dot(Ln, nrm), .08); T *= min(1., 4. / max(length(T), 1e-3));
  float bq = max(fu, fv), tlt = (h21(vec2(floor(pu + .5) + 5., floor(pj) + 41.)) - .5) * ${h(2*me.tilt)};
  float pmU = 1. - lnP(ds, sw + SWH, W, fu), pmV = 1. - lnP(dj, swv + SWH, JOINT, fv);
  vec2 rel = (strapRel(sv, T.x, tlt, fu, PW) + headsRel(sv, arc, HDO, T, bq, PW)) * pmU + (strapRel(sh, T.y, 0., fv, PH) + headsRel(sh, su, HDO, T.yx, bq, PH)) * pmV
           + headsRel(sd, arc, sw - ${h(ie.half-me.row)}, T, bq, W) + headsRel(jl, su, swv - ${h(ie.half-me.row)}, T.yx, bq, JOINT);
  // THE WEAR (WEAR, GLSL_PLATE): by this place's own bearing and height, nothing else. The plates' straps wear at
  // their edges, heads and weeps; the cover straps' and belts' heads wear likewise. Bare steel over rust over paint
  vec2 wm = wearMarks(sv, arc, fu, PW, pmU, floor(pu + .5), sh, su, fv, PH, pmV, floor(pj + .5), bq)
          + headTone(headsWear(sd, arc, sw - ${h(ie.half-me.row)}, bq, W, 3.) + headsWear(jl, su, swv - ${h(ie.half-me.row)}, bq, JOINT, 5.));
  wm = min(wm * wearAt(az + uGapAz, arc), 1.);
  col = mix(mix(col, WRUST, wm.y), WSTEEL, wm.x);
  // light: the dome's own fill, and the lamp-sun's key in a wide soft pool; the boat's and the boards' shade
  vec3 axis = normalize(uBeamAim - uLamp); float ca = dot(-Ln, axis), ndl = clamp(dot(nrm, Ln), 0., 1.);
  float key = uKey * mix(.74, 1., smoothstep(.8, .995, ca)) * smoothstep(0., .22, ndl);
  key *= (1. - boatShadeOn(vWorld, nrm, fw)) * (1. - .8 * boardShade(vWorld, Ln));
  vec3 lit = uFillCol * uFill * (1. + rel.y) + uLampCol * key * max(1. + rel.x, 0.) + uLampCol * .5 * exp(-Ld / 40.);
  // ROUND THE SEAM (by place; vEdge is 1 on the two rolled panels, 0 on the shell; vSide: -1 the left panel, +1 the
  // right). latW: metres along the wall from the gap's meridian to this place as it stands now. THE PANELS STAND
  // PROUD of the face: on the shell beside each panel's outer edge lies the shade it casts, wide on the side away
  // from the lamp, a narrow one on the lamp's side (outL, outR: metres out beyond those edges where they stand now).
  // THE BACKSTAGE'S GOLD spills out through the seam: on the panels' faces by their edges, and (off the water) on
  // the wall either side, fading with the metres from the seam's edge and up the wall; steady, at every metre.
  float azW = mod(atan(vWorld.x, -vWorld.z + 1e-6) - uGapAz + 3.14159265, 6.2831853) - 3.14159265, latW = abs(azW) * rw;
  float outL = (-azW - GORE - (uGapHalf + ${h(Y.off)}) / RS) * rw, outR = (azW - GORE - (uGapHalf - ${h(Y.off)}) / RS) * rw;
  float castP = max(.58 * (1. - smoothstep(0., 4.5, max(outL, 0.))) * step(azW, 0.), .34 * (1. - smoothstep(0., 1.8, max(outR, 0.))) * step(0., azW));
  lit *= 1. - castP * (1. - vEdge) * (1. - smoothstep(${h(Y.top)}, ${h(Y.top+6)}, arc));
  float seamHW = max(uGapHalf * cos(e) - seamRake(azW, arc), 0.);
  // (the gold HUGS THE SEAM'S EDGES: strong within some ten metres of them, a faint breath of it to some forty; beyond,
  // the painted dusk stands dark)
  float spD = max(latW - seamHW, 0.), spill = (.8 * exp(-spD / 9.) + .2 * exp(-spD / 40.)) * exp(-max(arc, 0.) / 220.) * (1. - smoothstep(4. * W, 6. * W, latW));
  lit += uSpill * spill * mix(.5, .8, vEdge);
  // the cut edges of a rolled panel (its outer edge, and its meeting edge: plumb, then raking): bare steel
  float dOuter = (GORE - vSide * az) * rw, dInner = vSide * (az - ${h(Y.off)} / RS) * rw + seamRake(vSide, arc);
  float cut = vEdge * (1. - smoothstep(.3, .55, min(dOuter, dInner)));
  col = mix(col, vec3(.3, .32, .36), cut);
  col *= lit;
  col += uSpill * spill * (.05 + .05 * vEdge);                  // (and the gold stands as a faint glow in the air before the wall there)
  // the paint's sheen: every panel is a flat plate hung a little out of true, and looked along it mirrors the pale
  // far side of the dome plate by plate (a sheen: it reads the eye, as a reflection must)
  vec3 nf = normalize(nrm + taz * (gf * GORE * cos(e) + (pid - .5) * .035) + tup * ((fract(ja) - .5) * JOINT / RS + (h11(pid * 91.) - .5) * .03));
  float cv = clamp(dot(nf, normalize(cameraPosition - vWorld)), 0., 1.), fr = pow(max(1. - cv, 1e-4), 5.);
  col = mix(col, uFillCol * (uFill + .5 * uKey), .3 * fr);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,lt=[{zen:"#2460b4",mid:"#69a4dd",haze:"#dfe2d6",cloudLit:"#ffe8b8",cloudShade:"#8fa3c8",seaLine:"#5c86a6",fill:"#dfeaff",glow:"#5a4420",blush:0},{zen:"#2c4d94",mid:"#8a9cc6",haze:"#f1cfae",cloudLit:"#ffe4bd",cloudShade:"#8d86aa",seaLine:"#566a8c",fill:"#d6d4f0",glow:"#70401a",blush:1}],no=[-5,0,10,20,30,45,60,75,90];function Nt(e,t,o,s,r,a,d){const u=[],l=[],i=new n.Vector3,f=s.length;for(let x=0;x<=o;x++)for(let P=0;P<f;P++)re(le(e,t,x/o),s[P],-r,i),u.push(i.x,i.y,i.z);for(let x=0;x<o;x++)for(let P=0;P<f-1;P++){if(a&&a(le(e,t,(x+.5)/o),s[P],s[P+1]))continue;const b=x*f+P,v=(x+1)*f+P;l.push(b,v,b+1,v,v+1,b+1)}if(d){const x=u.length/3;u.push(0,L.R+r,0);for(let P=0;P<o;P++)l.push(P*f+f-1,(P+1)*f+f-1,x)}const p=new n.BufferGeometry;return p.setAttribute("position",new n.Float32BufferAttribute(u,3)),p.setIndex(l),p.boundingSphere=new n.Sphere(new n.Vector3,L.R+20),p}const Ke=[-5,0,10,20,30,37.5,45,52.5,60,67.5,75,82.5,90,105,120,135,150];for(let e=180;e<=Y.top;e+=30)Ke.push(e);Ke.push(Y.top+6);function Ot(e,t){const o=[],s=[],r=new n.Vector3,a=Ke.length,d=6,u=Y.proud[t<0?0:1];for(let i=0;i<=d;i++)for(let f=0;f<a;f++){const p=Ke[f],x=L.R*Math.cos(Math.max(p,0)/L.R),P=e+t*(360/L.gores),b=e+(Y.off*x/L.R-t*Ye(t,p))/x/V;re(le(P,b,i/d),p,u,r),o.push(r.x,r.y,r.z)}for(let i=0;i<d;i++)for(let f=0;f<a-1;f++){const p=i*a+f,x=(i+1)*a+f;s.push(p,x,p+1,x,x+1,p+1)}const l=new n.BufferGeometry;return l.setAttribute("position",new n.Float32BufferAttribute(o,3)),l.setIndex(s),l.boundingSphere=new n.Sphere(new n.Vector3,L.R+20),l}function lo(e,t,o,s,r){const a=lt[e],d=Je[e],u=l=>({value:new n.Color(l)});return{...n.UniformsUtils.clone(n.UniformsLib.fog),uLamp:s.uLamp,uBoat:s.uBoat,uZen:u(a.zen),uMid:u(a.mid),uHaze:u(a.haze),uCloudLit:u(a.cloudLit),uCloudShade:u(a.cloudShade),uSeaLine:u(a.seaLine),uBlush:{value:a.blush},uPaintSeed:{value:Xt},uSunAz:{value:(Ae.looks[e].bearing-t)*V},uSunGlow:u(a.glow),uTime:{value:0},uKey:{value:d.key},uFill:{value:d.fill},uGapAz:{value:t*V},uGapHalf:{value:Ce.first/2},uSpill:u("#ffb052"),uRare:{value:r?1:0},uLampCol:{value:new n.Color().setRGB(le(1,d.color[0],.5),le(1,d.color[1],.5),le(1,d.color[2],.5))},uFillCol:u(a.fill),uBeamAim:{value:o.clone()},uBoardA:{value:Array.from({length:qe},()=>new n.Vector4(0,0,0,1))},uBoardB:{value:Array.from({length:qe},()=>new n.Vector4(0,1,0,0))}}}function io(e){const t=e.gapBearing,o=360/L.gores,s=lo(e.look,t,e.beamAim,e.shadow,e.rare),r=no.slice();for(let A=120;A<L.R*Math.PI/2-10;A+=30)r.push(A);const a=(A,c,m)=>Math.abs(A-t)<o&&m<=Y.top+.01,d=new n.Mesh(Nt(t,t+360,L.gores*2,r,0,(A,c,m)=>a(A,c,m)||a(A-360,c,m),!0));d.name="painted-shell";const u=[[d.geometry,0],[Ot(t,-1),-1],[Ot(t,1),1]];let l=0,i=0,f=0,p=0;for(const[A]of u)l+=A.attributes.position.count,i+=A.index.count;const x=new Float32Array(l*3),P=new Float32Array(l),b=new Uint32Array(i);for(const[A,c]of u){const m=A.attributes.position.array,E=A.index.array,g=m.length/3;x.set(m,f*3),P.fill(c,f,f+g);for(let y=0;y<E.length;y++)b[p+y]=E[y]+f;f+=g,p+=E.length}const v=new n.BufferGeometry;v.setAttribute("position",new n.BufferAttribute(x,3)),v.setAttribute("aSide",new n.BufferAttribute(P,1)),v.setIndex(new n.BufferAttribute(b,1)),v.boundingSphere=new n.Sphere(new n.Vector3,L.R+20);const T=new n.Mesh(v,new n.ShaderMaterial({uniforms:s,vertexShader:so,fragmentShader:ro,fog:!0,side:n.DoubleSide}));T.frustumCulled=!1,T.name="painted-sky";const $=[-1,1].map(A=>({mesh:T,side:A})),z=new n.Group;return z.add(T),{object:z,shell:d,wall:T,doors:$,uniforms:s}}async function Fo(e,t){const o=e.core.makeRng(e.core.hashSeed("sky-clock:"+e.seed)),s=()=>o()*2*Math.PI,r={lamp:s(),hung:O.hung.map(s),drums:s(),glow:s()},a=Zt();t={...t,shadow:a};const d=t.look,u=io(t),l=new n.Group;l.name="sky-with-a-seam";const i=Po(d,a,r.glow);l.add(u.object);const f=[],p={bearing:t.gapBearing,width:Ce.first,half:Ce.first/2},x=(v,T=new n.Vector3)=>gt(d,v,T,r.lamp),P=new n.Vector3;x(0,P),a.uLamp.value.copy(P);const b={object:l,shell:u,uniforms:u.uniforms,shadow:a,gap:p,lamp:P,lampAt:x,clock:r,look:d,parts:f,opts:t,steel:i,update(v,T,$,z){u.uniforms.uTime.value=T,p.width=ut(z,t.routeLength),p.half=p.width/2,u.uniforms.uGapHalf.value=p.half,x(T,P),a.uLamp.value.copy(P);for(const A of f)A.update(v,T,$,p.half)}};await e.yield();for(const v of Oe)await v(e,b),await e.yield();return b}const Oe=[],Ct=Jt(),it={from:(Ct.wallStart+Ct.wallEnd)/2,length:30,height:.4},Te=(()=>{const e=se(it.from+180),t=2*Math.PI/it.length;return{x:e.x,z:e.z,k:t,w:Math.sqrt(9.81*t),a:it.height/2}})(),co=(e,t,o)=>Te.a*Math.sin(Te.k*(e*Te.x+t*Te.z)-Te.w*o),ct=`
uniform float uTime; uniform vec2 uCentre;
const vec2 SWD = vec2(${h(Te.x)}, ${h(Te.z)}); const float SWK = ${h(Te.k)}, SWW = ${h(Te.w)}, SWA = ${h(Te.a)};
float swellEase(vec2 xz){ return 1. - smoothstep(150., 360., length(xz - uCentre)); }     // (the sheet's detail by where the eye is)
vec3 seaWave(vec2 xz){ return vec3(0., SWA * sin(SWK * dot(xz, SWD) - SWW * uTime) * swellEase(xz), 0.); }
`,ho=`
${ct}
varying vec3 vWorld;
#include <fog_pars_vertex>
void main(){
  vec2 xz = position.xz + uCentre; vec3 wp = vec3(xz.x, 0., xz.y) + seaWave(xz); vWorld = wp;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,He={straight:.09,key:.25,sky:.82},It={depth:8,at:[5,20,50],least:[.8,.95,.98],seen:.93},fo=`
varying vec3 vWorld;
uniform float uKey, uFill, uGapAz, uGapHalf, uSunGain; uniform vec3 uLampCol, uFillCol, uDeep, uGlintCol, uSpill; uniform vec4 uGantry;
const float RS = ${h(L.R)};
${St}
${ct}
${Ue}
${Tt}
${tt}
${Pt}
${nt}
${Gt}
#include <fog_pars_fragment>
void main(){
  vec3 P = vWorld; vec2 xz = P.xz; float fw = max(length(fwidth(xz)), 1e-3), r = length(xz);
  // the water's face: the swell's own slope, and a breath of ripple (nearly glass), filtered by the pixel's footprint
  float th = SWK * dot(xz, SWD) - SWW * uTime, sl = SWA * SWK * cos(th) * swellEase(xz) * (1. - smoothstep(.9, 2.6, fwidth(SWK * dot(xz, SWD))));
  vec2 q1 = xz / 2.6 + vec2(uTime * .11, -uTime * .07), q2 = xz / .7 - vec2(uTime * .13, uTime * .16);
  vec2 rp = (vec2(vn(q1 + vec2(.37, 0.)) - vn(q1 - vec2(.37, 0.)), vn(q1 + vec2(0., .37)) - vn(q1 - vec2(0., .37))) * .034 * (1. - smoothstep(1.2, 6., fw))
           + vec2(vn(q2 + vec2(.37, 0.)) - vn(q2 - vec2(.37, 0.)), vn(q2 + vec2(0., .37)) - vn(q2 - vec2(0., .37))) * .016 * (1. - smoothstep(.3, 1.6, fw)));
  vec3 N = normalize(vec3(-sl * SWD.x - rp.x, 1., -sl * SWD.y - rp.y));
  vec3 V = normalize(cameraPosition - P), Rr = reflect(-V, N); Rr.y = max(Rr.y, .004); Rr = normalize(Rr);
  // THE MIRROR: where the mirrored ray meets the painted shell, the painting as the wall shows it (lit by the dome's
  // fill and the lamp); in the opening between the panels and beyond the wall, the lit backstage (below)
  float b = dot(P, Rr), c = dot(P, P) - RS * RS, inside = 1. - smoothstep(-2., 6., r - RS);
  vec3 H = P + Rr * (-b + sqrt(max(b * b - c, 0.)));
  float e = asin(clamp(H.y / RS, 0., 1.)), az = mod(atan(H.x, -H.z + 1e-6) - uGapAz + 3.14159265, 6.2831853) - 3.14159265;
  float fH = max(length(fwidth(H)), 1e-3); gHard = res(.32, fH);   // (the wall's own law: by the mirrored pixel's footprint on the wall, nothing else)
  // (the two rolled panels carry their painting with them: where the mirrored ray meets one, its clouds stand
  // shifted in the mirror as they do on the wall; the left panel laps the right)
  float eR = e * RS, ceS = max(cos(e), .05), rollL = (uGapHalf + ${h(Y.off)}) / RS, rollR = (uGapHalf - ${h(Y.off)}) / RS;
  float inL = step(${h(-L.gore)} - rollL, az) * step(az * RS * ceS, seamRake(-1., eR) - uGapHalf * ceS), inR = step(az, ${h(L.gore)} + rollR) * step(uGapHalf * ceS - seamRake(1., eR), az * RS * ceS);
  float azP = az + (inL > .5 ? rollL : (inR > .5 ? -rollR : 0.)) * step(eR, ${h(Y.top)});
  // THE PLATES' STRAPS AND HEADS STAND IN THE IMAGE AS THE WALL SHOWS THEM (GLSL_PLATE: the same relief under the
  // same lamp, at the place of the wall the mirrored ray meets, by the mirrored pixel's own footprint there)
  float rwS = max(RS * ceS, 1.), pjS = eR / ${h(L.joint/8)}, puS = azP / ${h(L.gore)} * 8. + .5 * mod(floor(pjS), 2.), PWS = ${h(L.gore)} * rwS / 8.;
  vec3 hS = H / RS, tzS = normalize(vec3(-hS.z, 0., hS.x) + 1e-5), tuS = normalize(vec3(-hS.x * hS.y, max(1. - hS.y * hS.y, 1e-4), -hS.z * hS.y)), LS = normalize(uLamp - H);
  vec2 TS = vec2(dot(LS, tzS), dot(LS, tuS)) / max(dot(LS, -hS), .08); TS *= min(1., 4. / max(length(TS), 1e-3));
  float svS = (fract(puS + .5) - .5) * PWS, shS = (fract(pjS + .5) - .5) * ${h(L.joint/8)}, tlS = (h21(vec2(floor(puS + .5) + 5., floor(pjS) + 41.)) - .5) * ${h(2*me.tilt)};
  vec2 relS = strapRel(svS, TS.x, tlS, fH, PWS) + headsRel(svS, eR, HDO, TS, fH, PWS) + strapRel(shS, TS.y, 0., fH, ${h(L.joint/8)}) + headsRel(shS, azP * rwS, HDO, TS.yx, fH, ${h(L.joint/8)});
  // (and THE WEAR likewise: by the place's own bearing and height on the wall, by the mirrored pixel's footprint)
  vec2 wmS = min(wearMarks(svS, eR, fH, PWS, 1., floor(puS + .5), shS, azP * rwS, fH, ${h(L.joint/8)}, 1., floor(pjS + .5), fH) * wearAt(azP + uGapAz, eR), 1.);
  vec3 sky = mix(mix(paintSky(azP, e, 0., 0.).rgb, WRUST, wmS.y), WSTEEL, wmS.x) * (uFillCol * uFill * (1. + relS.y) + uLampCol * uKey * ${h(He.sky)} * max(1. + relS.x, 0.));
  float open = seamOpen(az, e, uGapHalf, 1.);                  // (the seam's own shape: SEAM)
  // through the opening, and from the water that lies beyond the wall, the mirrored ray meets THE BACKSTAGE: its
  // far wall's light (gold low down, deep blue above) and the catwalks' rows of work lamps, long broken streaks
  float c2 = dot(P, P) - ${h((L.R+O.outer)*(L.R+O.outer))}; vec3 H2 = P + Rr * (-b + sqrt(max(b * b - c2, 0.)));
  float seesBack = 1. - inside * (1. - open), rows = 0.;
  vec2 gth = vec2(-uGantry.w, uGantry.z); float rP = dot(xz, uGantry.zw) - RS, tP = dot(xz, gth);
  vec3 Rg = vec3(dot(Rr.xz, uGantry.zw), Rr.y, dot(Rr.xz, gth));                  // the mirrored ray in the gap's frame (r, y, t)
  for (int i = 0; i < 4; i++) { float t0 = i < 2 ? ${h(O.cat.t)} : ${h(-O.cat.t)}, y0 = (i == 0 || i == 2) ? ${h(O.cat.y[0])} : ${h(O.cat.y[1])};
    float st = abs(Rg.z) < 1e-3 ? 1e-3 : Rg.z, s = (t0 - tP) / st, yh = Rg.y * s - y0, rh2 = rP + Rg.x * s;
    float dr = (fract(rh2 / ${h(O.cat.every)} + .5) - .5) * ${h(O.cat.every)}, sy = 1.3 + .035 * abs(s), sr = .9 + .014 * abs(s);
    rows += step(0., s) * smoothstep(${h(O.cat.r0-4)}, ${h(O.cat.r0+2)}, rh2) * (1. - smoothstep(${h(O.cat.r1-20)}, ${h(O.cat.r1)}, rh2))
      * exp(-yh * yh / (sy * sy) - dr * dr / (sr * sr)) / (1. + abs(s) / 140.); }
  // (the ripples draw the low gold out long toward the eye, as they draw out any lamp's image: the image keeps its
  // gold over more of its length than the backstage keeps it in height)
  // THE SEAM'S OWN IMAGE (the galleries that cross it at every cross joint, and their lamps): each gallery a dark
  // bar across the gold, each lamp a LONG STREAK drawn out along the mirrored way and BROKEN by the ripples it
  // lies on (averaged where a pixel holds many ripples)
  float lt = az * RS * ceS, ka = clamp(floor((eR + 1.2) / 30. + .5), 1., ${h(Y.top/30-1)}), da = eR - (ka * 30. - 1.2);
  float dl = lt - (mod(ka, 2.) < .5 ? 4.2 : 0.); dl -= 8.5 * floor(dl / 8.5 + .5);
  // (the ripples' breaks, 0.6 m across: where a pixel outgrows them, their own mean, the mean of the cut of the noise)
  float brk = mix(${h(Ve(.34,.7))}, smoothstep(.34, .7, vn(vec2(tP / 1.5, rP / .6 + uTime * .22))), res(.6, fw));
  float seamLamp = exp(-dl * dl / 1.7 - da * da / 420.) * brk, seamBar = exp(-(da + 1.2) * (da + 1.2) / 3.) * step(eR, ${h(Y.top-15)});
  // (and THE FAR WALL'S OWN BAYS stand in it: its ribs and ring beams dark, each bay of sheeting its own tone, as
  // BACK_FRAG lays them; averaged where a pixel holds many)
  float a2 = mod(atan(H2.x, -H2.z + 1e-6) - uGapAz + 3.14159265, 6.2831853) - 3.14159265;
  vec2 bq = vec2(a2 * length(H2.xz) / 24., H2.y / 18.), bf = max(fwidth(bq), vec2(1e-4)), bg = abs(fract(bq + .5) - .5);
  // (in bays: a rib 0.075 of a bay wide, a ring beam 0.078; each keeps its true cover and ends in its own mean,
  // its width over the bay; a bay's own tone, 0.55 to 1.3, ends in its middle, 0.925)
  float steel2 = uni(lnP(bg.x, .0375, 1., bf.x), lnP(bg.y, .039, 1., bf.y));
  float bayTone = mix(.925, .55 + .75 * h21(floor(bq) + 7.3), resc(1., max(bf.x, bf.y)));
  vec3 back = beyondGlow(H2.y * .36) * .9 * bayTone * (1. - .85 * steel2) * (1. - .4 * seamBar * open) + uGlintCol * (rows * 1.6 + seamLamp * open * 1.5);
  sky = mix(back, sky, 1. - seesBack);
  // the lamp-sun in the mirror: the lamp's own round disc, and its road
  vec3 Ls = uLamp - P; float ld = max(length(Ls), 1.); Ls /= ld; float cs = clamp(dot(Rr, Ls), 0., 1.), ang = 13. / ld;
  float disc = smoothstep(1. - ang * ang * .62, 1. - ang * ang * .4, cs);      // (the drum's own round, its edge plain)
  // (ITS ROAD IS NARROW AND AS CALM AS THE SEA ROUND IT: the same glass draws the image out a little toward the eye
  // and away, no wider than the lamp's own disc; no sparks, no rougher water under the lamp than anywhere else)
  float dAz = (Rr.x * Ls.z - Rr.z * Ls.x) / max(length(Rr.xz) * length(Ls.xz), 1e-3), dEl = Rr.y - Ls.y;
  float lampRoad = exp(-dAz * dAz / max(ang * ang * .5, 1e-6) - dEl * dEl / .02);
  vec3 sun = uLampCol * (disc * 1.9 + lampRoad * .5) * inside * uSunGain;
  // how much the water mirrors (more toward the far water, less straight down, where the tank's own deep shows)
  float cv = clamp(dot(N, V), 0., 1.), fr = ${h(He.straight)} + ${h(1-He.straight)} * pow(max(1. - cv, 1e-4), 3.);
  // OUR BOAT'S SHADE (WATER_SHADE, above): the lamp's part goes off the water's own body, and off nothing else
  float boatSh = boatShadeOn(vec3(xz.x + rp.x * ${h(It.depth)}, 0., xz.y + rp.y * ${h(It.depth)}), vec3(0., 1., 0.), min(fw, 2.));
  vec3 body = uDeep * (uFillCol * uFill * (.55 + .45 * inside) + uLampCol * uKey * ${h(He.key)} * inside * (1. - boatSh));
  vec3 col = mix(body, sky, fr) + sun;
  // THE ROAD OF GOLD (by the place alone, steady at every metre): along the gap's own line the backstage's light
  // lies out over the bay as a ROAD OF GLITTER, never a sheet: at the seam's foot it reaches 3 m and three tenths
  // of the seam's half width either hand of the line, 3 m wider for every 100 m out, half its strength 300 m out. It is
  // LIGHT ON THE RIPPLES ONLY: sparks where a ripple's face stands to it, thinning out to either hand (fewer sparks,
  // not a paler wash), averaged where a pixel holds many; the water under and beside it keeps its mirror (the
  // painted dusk's blue and violet, the clouds, the panels, the seam's lamps)
  float din = max(-rP, 0.), rdw = 3. + uGapHalf * .3 + din * .03, road = exp(-tP * tP / (rdw * rdw)) * exp(-din / 430.) * inside;
  // (TWO MARKS SIDE BY SIDE, each half of the road's light: FINE SPARKS a hand deep (ripples 0.42 m by 0.13 m) and
  // BROADER GLINTS half a metre deep (1.5 m by 0.5 m). Each stands while a pixel holds it and goes to ITS OWN MEAN
  // by the pixel's footprint on the water, the fine by their 0.13 m, the broad by their 0.5 m: none is taken away)
  float g1 = vn(vec2(tP / .42 + uTime * .3, rP / .13 - uTime * .9)), g2 = vn(vec2(tP / 1.5 - uTime * .12, rP / .5 + uTime * .3) + 7.);
  float thr = mix(1., .56, road);
  // (EITHER MARK'S OWN MEAN, WORKED ACROSS THE ROAD: how often the noise stands over the sparks' threshold at a place
  // of the road, by the noise's own law: ROAD_MEAN, the cut's mean at every twentieth of the road, read between by
  // the straight line through its CUBE ROOT. (Toward the road's edge the law falls as a tail, which a straight line
  // between far knots overshoots many times over; its cube root runs all but straight: within half a part in a
  // hundred of the law from the road's middle down to a fifth of it, 1.2 parts down to a tenth, 6 to a twentieth,
  // where the fringe's own ramp has all but closed the road.)
  // THE MEAN ACROSS THE ROAD (road: mean): ${[20,18,16,14,12,10,8,6,4,3,2,1].map(e=>`${e/20}: ${rt[e].toFixed(5)}`).join(", ")}.
  // The fine sparks and the broad glints are that one noise cut at that one threshold, each at its own size, so
  // EACH HAS THIS MEAN, and THE ROAD'S MEAN IS THE SUM OF THE TWO HALVES: this very number under every pixel, near
  // and far alike)
  float rq = road * 20., glitR = ${rt.slice(1).map((e,t)=>`${ge(Math.cbrt(e)-Math.cbrt(rt[t]))} * clamp(rq - ${t}., 0., 1.)`).join(" + ")};
  float glitM = glitR * glitR * glitR;
  float sparks = mix(glitM, smoothstep(thr, thr + .1, g1), res(.13, fw));      // the fine sparks, by their 0.13 m: their own mean, glitM
  float glints = mix(glitM, smoothstep(thr, thr + .1, g2), res(.5, fw));       // the broad glints, by their 0.5 m: theirs, the same number
  float glit = (sparks + glints) * .75 * smoothstep(.03, .2, road);
  col += uSpill * glit;
  // beyond the wall: the floodlamps' light lies on the ripples in long broken streaks down the channel
  float rr = dot(xz, uGantry.zw), tt = dot(xz, vec2(-uGantry.w, uGantry.z)), dg = length(xz - uGantry.xy);
  float rip = vn(vec2(tt * 1.4, rr * .21 - uTime * .13)) * .6 + vn(vec2(tt * 3.9 + 5., rr * .62 + uTime * .22)) * .4;
  // (streaks 0.3 to 0.7 m across: where a pixel outgrows them, their own mean, the mean of the cut of the two noises' mix)
  col += uGlintCol * mix(${h(Mt(.56,.86,.6,.4))}, smoothstep(.56, .86, rip), res(.5, fw)) * exp(-dg / 42.) * .5 * (1. - inside);
  gl_FragColor = vec4(col, 1.);
  #ifdef USE_FOG
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, (1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth)) * inside);   // (no bright air beyond the wall)
  #endif
}`,Vt=[{deep:"#0a3550"},{deep:"#1c3048"}];function Bo(e,t,o){const s=Je[e],r=b=>.2126*b.r+.7152*b.g+.0722*b.b,a=new n.Color(Vt[e].deep),d=new n.Color(lt[e].fill).multiplyScalar(s.fill),u=new n.Color().setRGB(le(1,s.color[0],.5),le(1,s.color[1],.5),le(1,s.color[2],.5)).multiplyScalar(s.key),l=N.eye/Math.hypot(N.eye,t),i=He.straight+(1-He.straight)*(1-l)**3,f=r(new n.Color(o).multiply(d.clone().add(u.clone().multiplyScalar(He.sky)))),p=r(a.clone().multiply(d)),x=r(a.clone().multiply(u))*He.key,P=(1-i)*(p+x)+i*f;return(P-(1-i)*x)/P}function jo(e,t,o){const s=[],r=[],a=Math.max(48,Math.min(96,Math.round(72*(o.detail||1)/8)*8)),d=[0];let u=0,l=.6;for(;u<1500;)u+=l,l=Math.min(l*1.085,90),d.push(u);for(const z of d)for(let A=0;A<a;A++){const c=A/a*2*Math.PI;s.push(Math.cos(c)*z,0,Math.sin(c)*z)}for(let z=0;z<d.length-1;z++)for(let A=0;A<a;A++){const c=z*a+A,m=z*a+(A+1)%a,E=c+a,g=m+a;r.push(c,m,E,m,g,E)}const i=new n.BufferGeometry;i.setAttribute("position",new n.Float32BufferAttribute(s,3)),i.setIndex(r),i.boundingSphere=new n.Sphere(new n.Vector3,1600);const f=t.uniforms,p=re(o.gapBearing,0,-30),x=se(o.gapBearing),P=(...z)=>Object.fromEntries(z.map(A=>[A,f[A]])),b={...n.UniformsUtils.clone(n.UniformsLib.fog),...P("uZen","uMid","uHaze","uCloudLit","uCloudShade","uSeaLine","uSunGlow","uBlush","uPaintSeed","uSunAz","uGapAz","uKey","uFill","uLampCol","uFillCol","uSpill"),uLamp:t.shadow.uLamp,uBoat:t.shadow.uBoat,uTime:{value:0},uCentre:{value:new n.Vector2},uGapHalf:{value:Ce.first/2},uDeep:{value:new n.Color(Vt[o.look].deep)},uGlintCol:{value:new n.Color("#ffc98a")},uGantry:{value:new n.Vector4(p.x,p.z,x.x,x.z)},uSunGain:{value:qt[o.look].sea}},v=new n.Mesh(i,new n.ShaderMaterial({uniforms:b,vertexShader:ho,fragmentShader:fo,fog:!0}));v.frustumCulled=!1,v.name="the-sea";const T=new n.Group;T.name="sea",T.add(v);const $=new n.Vector3;return{object:T,mesh:v,uniforms:b,heightAt:co,update(z,A,c,m){c&&c.getWorldPosition($),b.uTime.value=A,b.uCentre.value.set($.x,$.z),b.uGapHalf.value=ut(m,o.routeLength)/2}}}const po=ct,uo=`
#include <fog_pars_fragment>
float layerFog(){
  #ifdef USE_FOG
    return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    return 0.;
  #endif
}`;function mo(e){return{...n.UniformsUtils.clone(n.UniformsLib.fog),uTime:e.uniforms.uTime,uCentre:e.uniforms.uCentre}}const wo=(e,t,o)=>new n.ShaderMaterial({uniforms:e,vertexShader:t,fragmentShader:o,fog:!0,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),vo=`
${po}
attribute vec2 aWake;                       // metres of route, metres to starboard of the line
uniform float uBoatS; varying vec3 vW; varying vec2 vXZ;
#include <fog_pars_vertex>
void main(){
  float back = uBoatS - aWake.x; vW = vec3(back, aWake.y, 0.); vXZ = position.xz;
  vec3 wp = vec3(position.x, .045, position.z) + seaWave(position.xz);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  if (back < -6. || back > 150.) gl_Position = vec4(2., 2., 2., 1.);      // out of the wake's stretch: not drawn
  #include <fog_vertex>
}`,go=`
${Ue}
uniform float uTime; uniform vec3 uFoam; varying vec3 vW; varying vec2 vXZ;
${uo}
void main(){
  float foot = max(length(fwidth(vXZ)), 1e-3), back = vW.x, y = abs(vW.y);
  float aft = back - ${h(-N.stern)};                                  // metres astern of the stern post
  // the churned lane: narrow at the stern, spreading and thinning astern
  float w = .5 + .035 * max(aft, 0.), lane = (1. - smoothstep(w * .5, w, y)) * smoothstep(-.6, 1.5, aft) * exp(-max(aft, 0.) / 46.);
  // the bow wave's arms: from the stem, opening at about 19 degrees a side, fading astern
  float fromStem = back + ${h(N.stem)}, ax = .45 + fromStem * .33;
  float arm = (1. - smoothstep(.0, .5 + .012 * fromStem, abs(y - ax))) * smoothstep(.3, 2.5, fromStem) * exp(-fromStem / 24.);
  float n = vn(vXZ * 1.7 + vec2(uTime * .35, 0.)) * .6 + vn(vXZ * 5.3 - vec2(0., uTime * .5)) * .4;
  // (the foam's lace, 0.2 to 0.6 m across: where a pixel outgrows it, its own mean, the mean of the cut of the two noises' mix)
  float lace = mix(${h(Mt(.34,.72,.6,.4))}, smoothstep(.34, .72, n), 1. - smoothstep(.3, 1.2, foot));
  float a = clamp(lane * (.25 + .75 * lace) * .85 + arm * (.35 + .65 * lace) * .7, 0., 1.) * (1. - layerFog());
  gl_FragColor = vec4(uFoam * a, a);
}`;function bo(e,t,o,s){const r=[],a=[],d=[],u=Math.ceil(o/2.5),l=[-9,-3.2,-.9,.9,3.2,9],i=new n.Vector3,f=new n.Vector3;for(let v=0;v<=u;v++){const T=v/u;t.pointAt(T,i),t.tangentAt(T,f);const $=Math.hypot(f.x,f.z)||1,z=-f.z/$,A=f.x/$;for(const c of l)r.push(i.x+z*c,0,i.z+A*c),a.push(T*o,c)}const p=l.length;for(let v=0;v<u;v++)for(let T=0;T<p-1;T++){const $=v*p+T;d.push($,$+1,$+p,$+1,$+p+1,$+p)}const x=new n.BufferGeometry;x.setAttribute("position",new n.Float32BufferAttribute(r,3)),x.setAttribute("aWake",new n.Float32BufferAttribute(a,2)),x.setIndex(d);const P={...mo(e),uBoatS:{value:0},uFoam:{value:new n.Color(s?"#f4dcc0":"#eef4f6").multiplyScalar(.82)}},b=new n.Mesh(x,wo(P,vo,go));return b.frustumCulled=!1,b.renderOrder=2,b.name="boat-wake",{mesh:b,uniforms:P}}async function qo(e,t,o){const s={mesh:new n.Group,uniforms:{}};s.mesh.name="boat-shadow-on-water",await e.yield();const r=bo(t,o.path,o.length,o.look),a=new n.Group;return a.name="sea-layers",a.add(s.mesh,r.mesh),{object:a,shade:s,wake:r,dark:{mesh:new n.Group,uniforms:{}},update(d,u,l,i){r.uniforms.uBoatS.value=i}}}const xo={r:N.stay,lay:.085,yarns:21,marline:.004,lanyard:.26,parts:5,every:.9,stray:.2,seize:[.05,.08],proud:1.2,sides:8},yo=`
  float ropeF = fwidth(vRope.x), yarnF = fwidth(vRope.y);
  float ropeS = abs(fract(vRope.x) * 2. - 1.), ropeY = abs(fract(vRope.y) * 2. - 1.);
  diffuseColor.rgb *= (1. + vRope.z * (.25 - ropeS * ropeS * ropeS) * (1. - smoothstep(.3, .9, ropeF)))
    * (1. + vRope.w * (ropeY - .5) * (1. - smoothstep(.3, .9, yarnF)));
`,be={cloths:7,rows:10,belly:.14,breath:.05,reef:.24,tie:.28,rope:.011,sheetTo:[-3.6,1.14,-.5]},Ft=(e,t)=>Math.hypot(N.sail[e][0]-N.sail[t][0],N.sail[e][1]-N.sail[t][1],N.sail[e][2]-N.sail[t][2]),De=(Ft(0,1)+Ft(3,2))/2/be.cloths,So=`
  float sailU = max(fwidth(vSail.x) * ${h(De)}, 1e-4), sailV = max(fwidth(vSail.y) * vSail.z, 1e-4), onSail = step(1e-3, vSail.z);
  float seamD = (.5 - abs(fract(vSail.x) - .5)) * ${h(De)}, tieD = abs(fract(vSail.x) - .5) * ${h(De)}, upM = (vSail.y - ${h(be.reef)}) * vSail.z;
  float sailP = 1. - smoothstep(${h(De*.5)}, ${h(De)}, sailU);
  float seam = mix(${h(2*.012/De)}, boatLine(seamD, .012, sailU), sailP), lap = mix(${h(2*.04/De)}, boatLine(seamD, .04, sailU), sailP), band = boatLine(abs(upM), .035, sailV);
  float tie = mix(${h(2*.012/De)}, boatLine(tieD, .012, sailU), sailP) * clamp((upM + ${h(be.tie)}) / sailV + .5, 0., 1.) * clamp((.02 - upM) / sailV + .5, 0., 1.);
  diffuseColor.rgb = mix(diffuseColor.rgb, mix(diffuseColor.rgb * (1. - .3 * seam) * (1. - .1 * lap) * (1. - .14 * band), ${(()=>{const e=new n.Color("#ad9a72");return Ne(e.r,e.g,e.b)})()}, tie), onSail);
`;function Ao(e){const t=[],o=[],s=new n.Color,r=N,a=(w,S,M,D)=>{t.push(w[0],w[1],-w[2],S[0],S[1],-S[2],M[0],M[1],-M[2]);for(let C=0;C<3;C++)o.push(D.r,D.g,D.b)},d=(w,S,M,D,C)=>{a(w,S,M,C),a(w,M,D,C)},u=(w,S)=>s.set(w).multiplyScalar(S).clone(),l=w=>u("#b4854c",w),i=w=>u("#6b4a2a",w),f=(w,S)=>u("#8a6238",(1.3-.09*w)*(w%2?.7:1)*S),p=22,x=5,P=r.stem-r.stern,b=w=>r.halfBeam*Math.pow(Math.sin(Math.PI*Me(w,0,1)),.72),v=bt,T=Qe,$=(w,S)=>{const M=r.stern+P*w,D=Math.max(b(w)-S,0),C=v(w),ne=T(w)+S*.6,U=[];for(let K=0;K<=x;K++){const Q=K/x*Math.PI/2,X=S?0:.022*(K%2);U.push([D*Math.pow(Math.cos(Q),.62)+X,le(C,ne,Math.pow(Math.sin(Q),1.25)),M])}return U};for(let w=0;w<p;w++){const S=w/p,M=(w+1)/p,D=.9+.2*e();for(const C of[-1,1]){const ne=J=>[J[0]*C,J[1],J[2]],U=$(S,0).map(ne),K=$(M,0).map(ne),Q=$(S,.035).map(ne),X=$(M,.035).map(ne);for(let J=0;J<x;J++){const xe=l((.82+.1*(J%2))*D);C>0?(d(U[J],K[J],K[J+1],U[J+1],xe),d(Q[J+1],X[J+1],X[J],Q[J],f(J,D))):(d(U[J+1],K[J+1],K[J],U[J],xe),d(Q[J],X[J],X[J+1],Q[J+1],f(J,D)))}const _=[U[0][0]+C*.03,U[0][1]+.035,U[0][2]],ce=[K[0][0]+C*.03,K[0][1]+.035,K[0][2]],fe=[Q[0][0]-C*.03,Q[0][1]+.035,Q[0][2]],ue=[X[0][0]-C*.03,X[0][1]+.035,X[0][2]];C>0?d(fe,ue,ce,_,l(1.12)):d(_,ce,ue,fe,l(1.12))}}const z=(w,S,M,D=0)=>{const C=Math.cos(D),ne=Math.sin(D),U=(ce,fe,ue)=>[w[0]+ce*C+ue*ne,w[1]+fe,w[2]-ce*ne+ue*C],[K,Q,X]=S,_=[U(-K,-Q,-X),U(K,-Q,-X),U(K,Q,-X),U(-K,Q,-X),U(-K,-Q,X),U(K,-Q,X),U(K,Q,X),U(-K,Q,X)];d(_[0],_[1],_[2],_[3],M),d(_[5],_[4],_[7],_[6],M),d(_[3],_[2],_[6],_[7],M),d(_[4],_[5],_[1],_[0],M),d(_[1],_[5],_[6],_[2],M),d(_[4],_[0],_[3],_[7],M)},A=(w,S,M,D,C,ne=7)=>{const U=new n.Vector3(...w),K=new n.Vector3(...S).sub(U),Q=new n.Vector3(1,0,0);Math.abs(K.clone().normalize().x)>.9&&Q.set(0,1,0);const X=Q.clone().cross(K).normalize(),_=K.clone().cross(X).normalize(),ce=(fe,ue,J)=>{const xe=fe/ne*2*Math.PI,ye=U.clone().addScaledVector(K,J).addScaledVector(X,Math.cos(xe)*ue).addScaledVector(_,Math.sin(xe)*ue);return[ye.x,ye.y,ye.z]};for(let fe=0;fe<ne;fe++)d(ce(fe,M,0),ce(fe+1,M,0),ce(fe+1,D,1),ce(fe,D,1),C)};for(const[w,S]of[[1,1],[0,-1]])for(let M=0;M<5;M++){const D=w-S*M*.022,C=w-S*(M+1)*.022;A([0,v(D)+.1-M*.02,r.stern+P*D+S*.03],[0,T(C)+.25*(v(C)-T(C))*(1-M/5),r.stern+P*C+S*.02],r.post.f-.005,r.post.f+.005,i(1.1),5)}for(const[w,S]of[[1,1],[0,-1]]){const M=r.stern+P*w,D=w-S*.036,C=r.stern+P*D,ne=b(D)-.03,U=v(D)+.012;z([0,r.stemHead-.13,M+S*.035],[r.post.s,.13,r.post.f],l(.92)),z([0,r.stemHead+.008,M+S*.035],[r.post.s+.006,.012,r.post.f+.006],l(1.3)),a([-ne,U,C],[ne,U,C],[0,v(w)+.012,M-S*.04],l(1)),z([0,U+.012,C],[ne,.014,.028],l(1.14))}for(const w of[-2.55,-.83,.75]){const S=(w-r.stern)/P;z([0,v(S)-.2,w],[b(S)-.03,.025,.13],l(1.05))}for(let w=0;w<6;w++){const S=-3+w*.86,M=(S+.4-r.stern)/P;z([0,.14,S+.4],[Math.min(b(M)*.78,.62),.015,.4],l(.7+.12*e()))}z([0,.2,r.mast.f],[.16,.06,.16],i(1));const c=r.mast,m=r.yard,E=w=>[w[2],w[1],w[0]];A([0,c.foot,c.f],[0,c.top,c.f],c.r+c.taper,c.r-c.taper,l(.95),8);for(const w of[-m.lo,m.hi])A(E(m.at(0)),E(m.at(w)),m.r+m.taper,m.r-m.taper,l(.85),7);const g=(w,S,M,D,C)=>{const U=K=>w.map((Q,X)=>Q+(S[X]-w[X])*K*M/Math.hypot(S[0]-w[0],S[1]-w[1],S[2]-w[2]));A(w,U(.7),M,M*Math.sqrt(1-.7*.7),D,C),A(U(.7),U(1),M*Math.sqrt(1-.7*.7),0,D,C)};g([0,c.top,c.f],[0,c.top+1,c.f],c.r-c.taper,l(.95),8);for(const w of[-m.lo,m.hi])g(E(m.at(w)),E(m.at(2*w)),m.r-m.taper,l(.85),7);const y=[],k=w=>new n.Vector3(w[2],w[1],-w[0]),[W,H,R,I]=r.sail.map(k),[F,j]=[2*be.cloths,be.rows],Z=new n.Vector3(1,0,1),oe=[],he=(w,S)=>I.clone().lerp(R,w).lerp(W.clone().lerp(H,w),S),de=R.clone().sub(I).cross(W.clone().sub(I)).normalize(),we=de.dot(Z)<0;we&&de.negate();for(let w=0;w<=j;w++)for(let S=0;S<=F;S++){const M=S/F,D=w/j,C=Math.sin(Math.PI*M)*Math.sin(Math.PI*D);oe.push({p:he(M,D).addScaledVector(de,be.belly*C),a:[M*be.cloths,D,W.clone().lerp(H,M).distanceTo(I.clone().lerp(R,M)),C]})}const te=(w,S)=>oe[Me(S,0,j)*(F+1)+Me(w,0,F)];for(const w of oe)w.N=null;for(let w=0;w<=j;w++)for(let S=0;S<=F;S++){const M=te(S+1,w).p.clone().sub(te(S-1,w).p).cross(te(S,w+1).p.clone().sub(te(S,w-1).p)).normalize();te(S,w).N=M.dot(Z)<0?M.negate():M}const G=Array.from({length:be.cloths},()=>u("#a2623e",.9+.2*e()));for(let w=0;w<j;w++)for(let S=0;S<F;S++)for(const M of we?[te(S,w),te(S+1,w+1),te(S+1,w),te(S,w),te(S,w+1),te(S+1,w+1)]:[te(S,w),te(S+1,w),te(S+1,w+1),te(S,w),te(S+1,w+1),te(S,w+1)]){const D=G[Math.floor(S/2)];y.push(t.length/3,M.N.x,M.N.y,M.N.z,...M.a),t.push(M.p.x,M.p.y,M.p.z),o.push(D.r,D.g,D.b)}const B=[],ee=u("#ad9a72",1),pe=u("#4a3524",1),q=xo,ve={laid:(w,S)=>[3*S-3*w/q.lay,q.yarns*S+w/(q.lay/2),.7,.22],seized:(w,S)=>[S+w/q.marline,0,.5,0],lanyard:(w,S)=>[q.parts*S,3*q.parts*S-w/(3*q.marline),.6,.2]},Se=(w,S,M)=>{const D=S.clone().sub(w),C=D.length();D.normalize();const ne=new n.Vector3(Math.abs(D.x)>.9?0:1,Math.abs(D.x)>.9?1:0,0).cross(D).normalize(),U=D.clone().cross(ne),K=q.sides,Q=(X,_,ce)=>{const fe=[];for(let ue=0;ue<=K;ue++){const J=ue/K*2*Math.PI,xe=ne.clone().multiplyScalar(Math.cos(J)).addScaledVector(U,Math.sin(J));fe.push({p:w.clone().addScaledVector(D,X).addScaledVector(xe,_),N:xe,a:ce(X,ue/K)})}return fe};M((X,_,ce,fe,ue)=>{const J=Q(X,ce,fe),xe=Q(_,ce,fe);for(let ye=0;ye<K;ye++)for(const $e of[J[ye],J[ye+1],xe[ye+1],J[ye],xe[ye+1],xe[ye]])B.push(t.length/3,$e.N.x,$e.N.y,$e.N.z,...$e.a),t.push($e.p.x,$e.p.y,$e.p.z),o.push(ue.r,ue.g,ue.b)},C)},Le=w=>(S,M)=>S(0,M,w,ve.laid,ee);Se(W,I,Le(be.rope)),Se(I,R,Le(be.rope)),Se(R,H,Le(be.rope)),Se(I,k([r.tack[0],v((c.f-r.stern)/P)-.175,r.tack[2]]),Le(q.r)),Se(R,k(be.sheetTo),Le(q.r));for(const w of r.cast.slice(6,10))Se(k([w[3],w[4],w[5]]),k([w[0],w[1],w[2]]),(S,M)=>{const D=q.lanyard,C=M-q.seize[1],ne=C-D-q.seize[1],U=Math.max(Math.round(ne/q.every),1),K=ne/U;S(0,D*.4,q.r*.8,ve.lanyard,ee),S(D*.4,D*.6,q.r*.95,ve.seized,ee),S(D*.6,D,q.r*.8,ve.lanyard,ee),S(D,D+q.seize[1],q.r*q.proud,ve.seized,pe);let Q=D+q.seize[1];for(let X=0;X<U;X++){const _=le(q.seize[0],q.seize[1],e()),ce=D+q.seize[1]+(X+.5)*K+(2*e()-1)*q.stray-_/2;S(Q,ce,q.r,ve.laid,ee),S(ce,ce+_,q.r*q.proud,ve.seized,pe),Q=ce+_}S(Q,C,q.r,ve.laid,ee),S(C,M,q.r*q.proud,ve.seized,pe)});const Re=new n.BufferGeometry;Re.setAttribute("position",new n.Float32BufferAttribute(t,3)),Re.setAttribute("color",new n.Float32BufferAttribute(o,3)),Re.computeVertexNormals(),Re.boundingSphere=new n.Sphere(new n.Vector3(0,2.5,.8),7);const _t=Re.attributes.normal,dt=(w,S)=>{const M=new Float32Array(t.length/3*4);for(let D=0;D<w.length;D+=8){_t.setXYZ(w[D],w[D+1],w[D+2],w[D+3]);for(let C=0;C<4;C++)M[w[D]*4+C]=w[D+4+C]}Re.setAttribute(S,new n.Float32BufferAttribute(M,4))};return dt(B,"aRope"),dt(y,"aSail"),Re}function _o(e){const t=e.core.makeRng(e.core.hashSeed("our-boat:"+e.seed)),o=new n.MeshStandardMaterial({vertexColors:!0,roughness:.62,metalness:0,side:n.DoubleSide}),s={value:0};o.onBeforeCompile=d=>{d.uniforms.uSailBreath=s,d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 aRope, aSail; varying vec4 vRope, vSail; uniform float uSailBreath;`).replace("#include <begin_vertex>",`#include <begin_vertex>
  vRope = aRope; vSail = aSail; transformed += normal * (aSail.w * uSailBreath);`),d.fragmentShader=d.fragmentShader.replace("#include <common>",`#include <common>
varying vec4 vRope, vSail;
float boatLine(float d, float w, float fw){ float ww = max(w, .5 * fw); return clamp((ww - d) / fw + .5, 0., 1.) * (w / ww); }`).replace("#include <color_fragment>",`#include <color_fragment>
`+yo+So)},o.customProgramCacheKey=()=>"our-boat-rope-sail";const r=new n.Mesh(Ao(t),o);r.frustumCulled=!1,r.name="our-boat";const a=new n.Group;return a.name="our-boat",a.rotation.order="YXZ",a.add(r),{object:a,mesh:r,place(d,u,l,i,f,p=0){a.position.set(d.x,l,d.z),a.rotation.set(i,Math.atan2(-u.x,-u.z),f),s.value=be.breath*(.6*Math.sin(p*.8)+.4*Math.sin(p*1.9+1.3))}}}const ht=7+2*(O.trucks.at[0].length+O.trucks.at[1].length)+O.hung.length,Bt=`
attribute vec3 color; attribute vec4 aAxis; attribute vec2 aGlow, aPart;   // aGlow: strength, phase of its slow breathing; aPart: its piece, whose light it gives (0 the work lamps', 1 the lamp-sun's)
uniform mat4 uPart[${ht}];
uniform float uPix, uTime, uGlowPhase; uniform vec3 uLamp;
varying vec3 vCol, vN, vW; varying float vGlow, vSun, vCover;
#include <fog_pars_vertex>
void main(){
  mat4 pm = uPart[int(aPart.x + .5)];
  vec3 p = position; vCover = 1.;
  #ifdef THIN
    vec4 cw = modelMatrix * (pm * vec4(aAxis.xyz, 1.)); float dist = length(cameraPosition - cw.xyz), have = max(aAxis.w, 1e-4);
    float want = max(have, .75 * uPix * dist / projectionMatrix[1][1]); p = aAxis.xyz + (position - aAxis.xyz) * (want / have); vCover = have / want;
  #endif
  vec4 wp = modelMatrix * (pm * vec4(p, 1.)); vW = wp.xyz; vN = normalize(mat3(modelMatrix) * (mat3(pm) * normal)); vCol = color;
  vGlow = aGlow.x * (.82 + .18 * sin(uTime * .9 + aGlow.y + uGlowPhase)); vSun = aPart.y;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,jt=`
uniform vec3 uLamp, uLampCol, uFillCol, uGlowCol, uSunCol; uniform float uKey, uFill; uniform vec4 uFlood[3], uGapFrame;   // floodlamps: place, strength; the gap's frame: its middle on the face (x, z), its bearing's unit (x, z)
varying vec3 vCol, vN, vW; varying float vGlow, vSun, vCover;
${tt}
#include <fog_pars_fragment>
void main(){
  vec3 n = normalize(vN + 1e-5); if (!gl_FrontFacing) n = -n;
  vec3 L = uLamp - vW; float ld = max(length(L), 1.); L /= ld;
  float inside = 1. - step(${h(L.R-.3)}, length(vW));
  vec3 lit = uFillCol * uFill * (.6 + .4 * n.y) + uLampCol * uKey * 1.25 * max(dot(n, L), 0.);
  // BEYOND THE WALL no light of the dome's: a deep blue dark, the gantry's floodlamps (three places along their
  // row) and THE CATWALKS' ROWS OF WORK LAMPS, four lines of warm light along the channel (all falling off by distance)
  float fl = 0.;
  for (int i = 0; i < 3; i++) { vec3 d = uFlood[i].xyz - vW; float dd = max(dot(d, d), 1e-2);
    fl += uFlood[i].w * (.22 + .78 * max(dot(n, d * inversesqrt(dd)), 0.)) / (1. + dd / 420.); }
  vec2 gq = vW.xz - uGapFrame.xy, gth = vec2(-uGapFrame.w, uGapFrame.z); float gr = dot(gq, uGapFrame.zw), gt = dot(gq, gth), rows = 0.;
  vec2 ng = vec2(dot(n.xz, gth), n.y);                                             // the normal across the channel: (t, y)
  for (int i = 0; i < 4; i++) { vec2 lp = vec2(i < 2 ? ${h(O.cat.t)} : ${h(-O.cat.t)}, (i == 0 || i == 2) ? ${h(O.cat.y[0])} : ${h(O.cat.y[1])}) - vec2(gt, vW.y);
    float dd = max(dot(lp, lp), .25); rows += (.3 + .7 * max(dot(ng, lp) * inversesqrt(dd), 0.)) / (1. + dd / 150.); }
  rows *= smoothstep(2., 16., gr) * (1. - smoothstep(${h(O.cat.r1)}, ${h(O.cat.r1+60)}, gr));
  // and THE GALLERIES' LAMPS, a row at every cross joint up the dome (every ${h(L.joint)} m of arc): their warm light on the
  // steel behind the seam at every height, strongest by each gallery
  float arcP = asin(clamp(vW.y / max(length(vW), 1.), 0., 1.)) * ${h(L.R)}, dA = (fract(arcP / ${h(L.joint)} + .5) - .5) * ${h(L.joint)};
  float gal = (.22 + .5 * exp(-dA * dA / 70.)) * smoothstep(12., 40., arcP);
  lit = mix(vec3(.03, .06, .15) * (.7 + .3 * n.y) + uGlowCol * (fl + rows * .9 + gal), lit, inside);
  vec3 col = vCol * lit + mix(uGlowCol, uSunCol, vSun) * vGlow;
  // the backstage's own lit air takes its far things by the metres they stand behind the painted face
  float rb = max(length(vW.xz) - ${h(L.R)}, 0.) * (1. - inside);
  col = mix(col, beyondGlow(vW.y) * .5, (1. - exp(-rb / 210.)) * (1. - min(vGlow, 1.) * .7));
  gl_FragColor = vec4(col, vCover);                             // (a thin member's true cover; a body's is whole)
  #ifdef USE_FOG
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, (1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth)) * inside);   // (the dome's bright air ends at the wall)
  #endif
}`;class Ee{constructor(){const t=()=>({P:[],N:[],C:[],G:[],A:[]});this.B=t(),this.T=t(),this.col=new n.Color("#2b2f36"),this.glow=[0,0]}color(t,o=1){return this.col.set(t).multiplyScalar(o),this}tri(t,o,s,r){const a=mt.subVectors(o,t),d=wt.subVectors(s,t),u=Ze.crossVectors(a,d).normalize(),l=r?this.T:this.B;for(const i of[t,o,s])if(l.P.push(i.x,i.y,i.z),l.N.push(u.x,u.y,u.z),l.C.push(this.col.r,this.col.g,this.col.b),l.G.push(this.glow[0],this.glow[1]),r){const f=r[i===t?0:i===o?1:2];l.A.push(f.x,f.y,f.z,r[3])}}quad(t,o,s,r,a){this.tri(t,o,s,a&&[a[0],a[1],a[2],a[4]]),this.tri(t,s,r,a&&[a[0],a[2],a[3],a[4]])}box(t,o,s,r,a,d,u){const l=(f,p,x)=>t.clone().addScaledVector(o,f*a).addScaledVector(s,p*d).addScaledVector(r,x*u),i=[l(-1,-1,-1),l(1,-1,-1),l(1,1,-1),l(-1,1,-1),l(-1,-1,1),l(1,-1,1),l(1,1,1),l(-1,1,1)];return this.quad(i[1],i[0],i[3],i[2]),this.quad(i[4],i[5],i[6],i[7]),this.quad(i[3],i[7],i[6],i[2]),this.quad(i[0],i[1],i[5],i[4]),this.quad(i[5],i[1],i[2],i[6]),this.quad(i[0],i[4],i[7],i[3]),this}tube(t,o,s,r=6,a=!1){const d=new n.Vector3().subVectors(o,t),u=Math.abs(d.y)>.9*d.length()?new n.Vector3(1,0,0):new n.Vector3(0,1,0),l=new n.Vector3().crossVectors(u,d).normalize(),i=new n.Vector3().crossVectors(d,l).normalize(),f=(p,x)=>{const P=p/r*2*Math.PI;return x.clone().addScaledVector(l,Math.cos(P)*s).addScaledVector(i,Math.sin(P)*s)};for(let p=0;p<r;p++)this.quad(f(p,t),f(p+1,t),f(p+1,o),f(p,o),a?[t,t,o,o,s]:null);return this}disc(t,o,s,r=20){const a=Math.abs(o.y)>.9?new n.Vector3(1,0,0):new n.Vector3(0,1,0),d=new n.Vector3().crossVectors(a,o).normalize(),u=new n.Vector3().crossVectors(o,d),l=i=>{const f=i/r*2*Math.PI;return t.clone().addScaledVector(d,Math.cos(f)*s).addScaledVector(u,Math.sin(f)*s)};for(let i=0;i<r;i++)this.tri(t,l(i),l(i+1));return this}get triangles(){return(this.B.P.length+this.T.P.length)/9}}function Eo(e,t,o=0){const s=lt[e],r=Je[e],a={...n.UniformsUtils.clone(n.UniformsLib.fog),uLamp:t.uLamp,uPix:{value:2/720},uTime:{value:0},uGlowPhase:{value:o},uPart:{value:Array.from({length:ht},()=>new n.Matrix4)},uLampCol:{value:new n.Color().setRGB(r.color[0],r.color[1],r.color[2])},uFillCol:{value:new n.Color(s.fill)},uGlowCol:{value:new n.Color("#ffd6a0")},uSunCol:{value:new n.Color(e?"#ffb060":"#ffe2ae")},uKey:{value:r.key},uFill:{value:r.fill},uFlood:{value:[0,1,2].map(()=>new n.Vector4(0,0,0,0))},uGapFrame:{value:new n.Vector4(0,0,0,-1)}},d=new n.ShaderMaterial({vertexShader:Bt,fragmentShader:jt,fog:!0,side:n.DoubleSide,uniforms:a});return d.userData.thin=new n.ShaderMaterial({vertexShader:Bt,fragmentShader:jt,fog:!0,side:n.FrontSide,uniforms:a,defines:{THIN:1},transparent:!0,depthWrite:!1}),d}function Po(e,t,o){const s=Eo(e,t,o),r=[],a=s.uniforms.uPart.value;let d=1;const u=l=>{let i=0;for(const c of r)i+=c.S[l].P.length/3;const f=new Float32Array(i*3),p=new Float32Array(i*3),x=new Float32Array(i*3),P=new Float32Array(i*2),b=new Float32Array(i*2),v=l==="T"?new Float32Array(i*4):null;let T=0;for(const c of r){const m=c.S[l],E=m.P.length/3;if(E){if(f.set(m.P,T*3),p.set(m.N,T*3),x.set(m.C,T*3),P.set(m.G,T*2),v&&v.set(m.A,T*4),c.part||c.sun)for(let g=T;g<T+E;g++)b[g*2]=c.part,b[g*2+1]=c.sun;T+=E}}const $=new n.BufferGeometry,z=(c,m,E)=>$.setAttribute(c,new n.BufferAttribute(m,E));z("position",f,3),z("normal",p,3),z("color",x,3),z("aGlow",P,2),z("aPart",b,2),v&&z("aAxis",v,4),$.boundingSphere=new n.Sphere(new n.Vector3,L.R+O.outer+400);const A=new n.Mesh($,l==="T"?s.userData.thin:s);return A.frustumCulled=!1,A};return{material:s,triangles:0,part(){if(d>=ht)throw new Error("sky-with-a-seam: more moving steel than STEEL_PARTS");return d++},matrix:l=>a[l],add(l,i=0,f=0){return r.push({S:l,part:i,sun:f}),this.triangles+=l.triangles,this},build(){const l=u("B"),i=u("T");return l.name="the-steel",i.name="the-steel-thin-members",i.renderOrder=2,{body:l,thin:i}}}}const To=`
uniform vec3 uAt, uAxis; uniform float uSize; varying vec2 vQ; varying float vFace;
void main(){
  vQ = position.xy; vec3 toEye = normalize(cameraPosition - uAt); vFace = dot(toEye, uAxis);
  // (the card stands on the sight line 45 hundredths of the way to the eye, drawn smaller by as much, so that the shell's curve never cuts it: said at the head)
  vec4 mv = viewMatrix * vec4(mix(uAt + uAxis * 2., cameraPosition, .45), 1.); mv.xy += position.xy * uSize * .55;
  gl_Position = projectionMatrix * mv;
}`,Ro=`
uniform vec3 uGlare; uniform float uTime, uFall; varying vec2 vQ; varying float vFace;
void main(){
  float r = length(vQ), f = clamp(vFace, 0., 1.);               // (the flat lit face's own facing to the eye: the cosine, as light does; none from behind)
  // A SOFT EVEN HALO, round, steady: a low bell over the drum (it never blows the lit face out) and a faint
  // wide breath beyond it; no ray, no patch, no flicker
  float halo = .42 * exp(-r * r * uFall * 2.2) + .15 * exp(-r * 5.);
  gl_FragColor = vec4(uGlare * halo * f * (1. - smoothstep(.7, 1., r)), 1.);
}`,qt=[{face:.17,hoop:.3,glare:.5,fall:13,sea:.3},{face:.32,hoop:.5,glare:.85,fall:10,sea:.36}];Oe.push(async(e,t)=>{const o=t.look,s=qt[o],r=t.steel,a=r.material,d=(G,B,ee)=>new n.Vector3(G,B,ee),u=d(1,0,0),l=d(0,1,0),i=d(0,0,1),f=new Ee,p=28,x=Ae.drum,P=(G,B,ee)=>d(Math.cos(ee/p*2*Math.PI)*G,Math.sin(ee/p*2*Math.PI)*G,B);f.color("#3a3f47");for(let G=0;G<p;G++)f.quad(P(x,-7,G),P(x,-7,G+1),P(x,.4,G+1),P(x,.4,G)),f.tri(d(0,0,-9),P(x,-7,G+1),P(x,-7,G));f.color("#111111"),f.glow=[9*s.face,0],f.disc(d(0,0,.1),i,x-.7,p);for(let G=0;G<12;G++){const B=P(16.4,-1.5,G*p/12);f.glow=[0,0],f.color("#30343b"),f.tube(B.clone().setZ(-3.2),B.clone().setZ(-.9),1.75,8),f.color("#111111"),f.glow=[5.5*s.hoop,G*1.7],f.disc(B.clone().setZ(-.85),i,1.5,10)}f.glow=[0,0],f.color("#30343b");for(let G=0;G<24;G++){const B=P(16.4,-2.4,G*p/24),ee=P(16.4,-2.4,(G+1)*p/24);f.tube(B,ee,.32,4),G%2===0&&f.tube(P(x,-2.4,G*p/24),B,.25,4)}const b=r.part();r.add(f,b,1),await e.yield();const v=new Ee,T=Ae.railR-Ae.R;v.color("#262a31");for(const G of[-1,1]){v.box(d(G*15.2,T/2,0),u,l,i,.7,T/2+.6,.9),v.box(d(G*12,T-.2,0),u,l,i,2.4,1.1,1.5);for(const B of[-1.6,1.6])v.tube(d(G*12+B,T+.5,-1.2),d(G*12+B,T+.5,1.2),.75,8)}v.box(d(0,T-1.6,0),u,l,i,15.9,.55,1.1),v.tube(d(-15.2,0,0),d(-13.2,0,0),.6,6),v.tube(d(13.2,0,0),d(15.2,0,0),.6,6);const $=r.part();r.add(v,$),await e.yield();const z=new Ee;let c=vt[1];for(;Pe(c+.01).y>0&&c<1.2;)c+=.01;const m={half:1.1,reach:9,every:6,step:.012,land:.12,up:.42},E=Xe(new n.Vector3),g=E.y>0?-1:1,y=-m.up,k=Math.ceil((c-y)/m.step),W=L.R-.4,H=G=>le(Ae.railR,W-.5,Math.pow(Me((y+m.land-G)/m.land,0,1),2)),R=(G,B,ee=new n.Vector3)=>Pe(G,ee).multiplyScalar(H(G)).addScaledVector(E,B*m.half),I=(G,B,ee=new n.Vector3)=>Pe(G,ee).multiplyScalar(W).addScaledVector(E,B*m.reach).setLength(W);for(let G=0;G<k;G++){const B=y+(c-y)*G/k,ee=y+(c-y)*(G+1)/k;G%30===29&&await e.yield(),z.color("#343941");for(const pe of[-1,1])z.tube(R(B,pe),R(ee,pe),.34,5,!0);if(z.color("#3d424b"),z.tube(R(B,1),R(ee,-1),.16,4,!0),z.tube(R(B,-1),R(ee,1),.16,4,!0),G%m.every===0&&H(B)<Ae.railR+4){z.color("#444a54");const pe=Pe(B).multiplyScalar(W),q=I(B,g),ve=Pe(B+.001).sub(Pe(B)).normalize();z.tube(pe,R(B,g),.3,4,!0),z.tube(pe,R(B,-g),.3,4,!0),z.tube(q,R(B,g),.26,4,!0),z.tube(pe,q,.24,4,!0);for(const Se of[pe,q]){const Le=Se.clone().normalize(),Re=new n.Vector3().crossVectors(Le,ve);z.box(Se.clone(),ve,Le,Re,.9,.3,.9)}}}{const G=Pe(y).multiplyScalar(W-.6),B=G.clone().normalize(),ee=Pe(y+.001).sub(Pe(y)).normalize(),pe=new n.Vector3().crossVectors(B,ee);z.color("#2c3038"),z.box(G.clone(),ee,B,pe,.5,.6,2.6),z.box(G.clone().addScaledVector(ee,-.9),ee,B,pe,.4,.5,3.4)}r.add(z),await e.yield();const F={uAt:{value:new n.Vector3},uAxis:{value:new n.Vector3(0,0,1)},uSize:{value:95},uTime:{value:0},uGlare:{value:new n.Color(o?"#ff9a48":"#ffe4b2").multiplyScalar(s.glare)},uFall:{value:s.fall}},j=new n.BufferGeometry;j.setAttribute("position",new n.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),j.setIndex([0,1,2,0,2,3]);const Z=new n.Mesh(j,new n.ShaderMaterial({uniforms:F,vertexShader:To,fragmentShader:Ro,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending}));Z.frustumCulled=!1,Z.renderOrder=4,Z.name="lamp-glare",t.object.add(Z);const oe=new n.Vector3,he=new n.Vector3,de=new n.Vector3,we=new n.Vector2,te=new n.Vector3(0,1,0);t.lampParts={drum:b,carriage:$,glare:Z,material:a,triangles:f.triangles+v.triangles+z.triangles},t.parts.push({update(G,B){r.matrix(b).identity().lookAt(t.opts.beamAim,t.lamp,te).setPosition(t.lamp),he.copy(t.lamp).normalize(),Xe(de),oe.crossVectors(de,he).normalize(),r.matrix($).makeBasis(oe,he,de).setPosition(t.lamp),F.uAt.value.copy(t.lamp),F.uAxis.value.copy(t.opts.beamAim).sub(t.lamp).normalize(),F.uTime.value=B,a.uniforms.uTime.value=B,e.renderer&&(e.renderer.getDrawingBufferSize(we),a.uniforms.uPix.value=2/Math.max(we.y,1))}})}),Oe.push(async(e,t)=>{const o=t.look,s=t.gap.bearing,r=t.steel.material,a=360/L.gores,d=re(s,0,0),u=se(s),l=se(s+90),i=new n.Vector3(0,1,0),f=(c,m,E)=>d.clone().addScaledVector(u,c).addScaledVector(l,E).setY(m);r.uniforms.uGapFrame.value.set(d.x,d.z,u.x,u.z);const p=new Ee,x=(c,m,E,g=new n.Vector3)=>re(c,m,E,g);for(const c of[Be.foot,Be.top])for(let m=-11;m<11;m++){const E=s+m*a*.25,g=E+a*.25;if(c>1&&m>=-4&&m<4)continue;const y=c>1?.17:Y.proud[1]+O.trucks.out/2;c<1&&(p.color("#15171b"),p.tube(x(E,c,y),x(g,c,y),.22,5,!1)),p.color(c>1?"#5b6068":"#2a2d33");const k=x((E+g)/2,c-(c>1?1.35:.55),y),W=se((E+g)/2+90),H=se((E+g)/2);p.box(k,W,i,H,L.R*a*.25*V/2,c>1?1.1:.3,c>1?.14:.9)}const P=Y.frame;for(let c=-4;c<=4;c++)if(c!==0)for(let m=0;m<(Math.abs(c)===1?450:150);m+=15){const E=s+c*a,g=.5+.9*Math.exp(-Math.abs(c)/2.2)*(.35+.65*Math.exp(-m/90));p.color("#70757e",g);const y=-(P+O.ribBack),k=re(E,m+7.5,y),W=re(E,m+15,y).sub(re(E,m,y)).normalize(),H=se(E),R=se(E+90);p.box(k,R,W,H,.35,7.6,O.ribHalf)}await e.yield();for(let c=30;c<=Y.top-30;c+=30){const m=c<=120?8:3,E=Math.cos(c/L.R);for(let g=-m;g<m;g++){const y=s+g*a*.5,k=y+a*.5,W=.5+.8*Math.exp(-Math.abs(g+.5)/4.5)*(.4+.6*Math.exp(-c/90));p.color("#666b74",W);const H=re((y+k)/2,c,-(P+3.2)),R=se((y+k)/2+90),I=se((y+k)/2);p.box(H,R,i,I,L.R*a*.5*V/2*E,.55,1)}for(let g=-3;g<=3;g++){const y=s+(g*8.5+(c%60?0:4.2))/L.R/V,k=1.1/L.R/V;p.color("#111111"),p.glow=[3.6,c*.37+g*1.9],p.tube(re(y-k,c-1.2,-(P+2.3)),re(y+k,c-1.2,-(P+2.3)),.22,5,!0),p.glow=[0,0]}}await e.yield();const b=O.deck;for(const c of[-1,1]){p.color("#7a7d80"),p.box(f((b.r0+b.r1)/2,b.top-.45,c*(b.t0+b.t1)/2),l,i,u,(b.t1-b.t0)/2,.45,(b.r1-b.r0)/2),p.color("#d0b256"),p.box(f((b.r0+b.r1)/2,b.top+.05,c*(b.t0+.4)),l,i,u,.25,.08,(b.r1-b.r0)/2);for(let m=0;m<12;m++)p.color("#3c3e42"),p.tube(f(b.r0+2+m*6,b.top,c*(b.t0+.2)),f(b.r0+2+m*6,b.rail,c*(b.t0+.2)),.05,4,!0);p.color("#b9a45c"),p.tube(f(b.r0+2,b.rail,c*(b.t0+.2)),f(b.r1-2,b.rail,c*(b.t0+.2)),.05,4,!0)}const v=O.gantry.r,T=O.gantry.legT,$=O.gantry.top;for(const c of[-1,1])for(const m of[-3,3])for(const E of[-3,3])p.color("#c09a3c"),p.tube(f(v+m,1.2,c*T+E),f(v+m*.5,$,c*T+E*.5),.28,5,!0);for(const c of[-1,1])for(let m=0;m<6;m++){const E=1-.5*m/6,g=1-.5*(m+1)/6,y=le(1.2,$,m/6),k=le(1.2,$,(m+1)/6),W=(R,I,F)=>f(v+R[0]*3*F,I,c*T+R[1]*3*F),H=[[-1,-1],[1,-1],[1,1],[-1,1]];p.color("#a8862f");for(let R=0;R<4;R++){const I=H[R],F=H[(R+1)%4];p.tube(W(I,y,E),W(F,k,g),.16,4,!0),p.tube(W(F,y,E),W(I,k,g),.16,4,!0)}}p.color("#c09a3c"),p.box(f(v,$+1.3,0),l,i,u,T+5,1.3,1.6);for(let c=0;c<9;c++){const m=(c-4)*5.6;p.glow=[0,0],p.color("#2c2c2c"),p.box(f(v-1.9,$-.7,m),l,i,u,1.4,.9,.5),p.color("#111111"),p.glow=[5.2,c*2.1];const E=f(v-2.45,$-.7,m),g=(y,k)=>E.clone().addScaledVector(l,y*1.2).addScaledVector(i,k*.72);p.quad(g(-1,-1),g(1,-1),g(1,1),g(-1,1))}p.glow=[0,0],[-18,0,18].forEach((c,m)=>{const E=f(v-5,$-2,c);r.uniforms.uFlood.value[m].set(E.x,E.y,E.z,6)});const z=e.core.makeRng(e.core.hashSeed("lamps-beyond:"+e.seed)),A=Math.max(6,Math.min(28,Math.round(16*(t.opts.density||1)*(t.opts.detail||1))));for(let c=0;c<A;c++){const m=120+260*z(),E=(z()*2-1)*(60+m*.5),g=6+30*z(),y=f(m,g,E),k=.9+m/260;p.color("#111111"),p.glow=[2.2+2*z(),z()*6.28];const W=(H,R)=>y.clone().addScaledVector(l,H*k).addScaledVector(i,R*k*.6);p.quad(W(-1,-1),W(1,-1),W(1,1),W(-1,1))}p.glow=[0,0],t.steel.add(p),t.beyond={material:r,at:f,triangles:p.triangles}}),Oe.push((e,t)=>{const o=t.gap.bearing,s=360/L.gores,r=t.beyond.at,a=Y.frame,d=O.trucks,u=new n.Vector3(0,1,0),l=(g,y,k)=>new n.Vector3(g,y,k),i=l(1,0,0),f=l(0,0,1),p=new Ee;p.color("#1b1d21"),p.tube(l(0,0,-.22),l(0,0,.22),.62,8),p.disc(l(0,0,.22),f,.62,8),p.disc(l(0,0,-.22),l(0,0,-1),.62,8),p.color("#8a8474",1.6),p.box(l(0,0,.25),i,u,f,.56,.1,.02),p.box(l(0,0,-.25),i,u,f,.56,.1,.02);const x=t.steel,P=[],b=[];for(const g of[-1,1]){const y=new Ee,k=Y.proud[g<0?0:1],W=x.part(),H=j=>o+(Y.off+g*j)/L.R/V;for(const j of d.at[g<0?0:1]){const Z=H(j),oe=d.out/2,he=re(Z,Be.foot+.68,k+oe),de=se(Z+90),we=se(Z);y.color("#2e3138",1.2),y.box(re(Z,d.top/2-.1,k+oe),de,u,we,d.half,d.top/2-.1,oe),y.color("#8a8474",1.3),y.box(re(Z,d.top-.1,k+oe),de,u,we,d.half+.15,.1,oe+.08);for(const te of[-1.5,1.5]){const G=x.part();x.add(p,G),P.push({part:G,sd:g,door:W,hub:new n.Matrix4().makeBasis(de,u,we).setPosition(he.clone().addScaledVector(de,te))})}}const R=j=>L.R*Math.cos(Math.max(j,0)/L.R),I=(j,Z)=>re(o+(Y.off*R(j)/L.R+g*(.32-Ye(g,j)))/R(j)/V,j,k/2+.05,Z),F=(j,Z)=>re(o+g*(s-.32/R(j)/V),j,k/2+.05,Z);for(const[j,Z,oe]of[[I,g<0?450:345,"#8b9099"],[F,300,"#7c818a"]]){y.color(oe);for(let he=0;he<Z;he+=15){const de=j(he,new n.Vector3),we=j(he+15,new n.Vector3),te=de.clone().lerp(we,.5),G=Ge(te.x,te.z);y.box(te,se(G+90),we.clone().sub(de).normalize(),se(G),.3,de.distanceTo(we)/2+.05,k/2-.05)}}x.add(y,W),b.push({part:W,sd:g})}const v=new Ee;v.color("#8d8672"),v.tube(l(0,0,-2.2),l(0,0,2.2),1.7,10);for(const g of[-2.3,2.3])v.color("#b3542c"),v.tube(l(0,0,g-.12),l(0,0,g+.12),2.5,10),v.disc(l(0,0,g+Math.sign(g)*.12),l(0,0,Math.sign(g)),2.5,10),v.color("#c9b98a",1.7),v.box(l(0,0,g+Math.sign(g)*.15),i,u,f,2.3,.22,.03),v.box(l(0,0,g+Math.sign(g)*.15),u,i,f,2.3,.22,.03);const T=[],$=new Ee,z=se(o+90),A=se(o);for(const g of[-1,1]){const y=O.drums,k=r(y.r,y.y,g*y.t),W=x.part();x.add(v,W),T.push({part:W,sd:g,hub:new n.Matrix4().makeBasis(A,u,z.clone().multiplyScalar(-1)).setPosition(k)}),$.color("#9a8f70");for(const H of[-2.9,2.9])for(const R of[-1.6,1.6])$.tube(r(y.r+R,1.2,g*y.t+H),r(y.r,y.y,g*y.t+H),.2,4,!0);$.color("#8d8672",1.5),$.tube(r(y.r,y.y+1.7,g*y.t),re(o+g*s*.72,Be.top-1.5,-(a+2.2)),.07,4,!0)}x.add($);const c=[];O.hung.forEach(([g,y],k)=>{const W=t.clock.hung[k],H=re(o+g*s,Be.top-2,-(a+y)),R=H.y-(15+4*(k%2)),I=new Ee;I.color("#9a927c",1.5),I.tube(l(0,0,0),l(0,-R,0),.06,4,!0),I.color("#5c5648",1.5),I.box(l(0,-R-.8,0),i,u,f,.55,.8,.55);const F=x.part();x.add(I,F),c.push({part:F,topP:H,ph:W,L:R})}),t.works={wheels:P,drums:T,hung:c,doorGroups:b};const m=new n.Matrix4,E=new n.Euler;t.parts.push({update(g,y,k,W){for(const H of b)x.matrix(H.part).makeRotationY(-(H.sd*W-Y.off)/L.R);for(const H of P)x.matrix(H.part).copy(x.matrix(H.door)).multiply(H.hub).multiply(m.makeRotationZ(-H.sd*W/.62));for(const H of T)x.matrix(H.part).copy(H.hub).multiply(m.makeRotationZ(H.sd*(y*.22+t.clock.drums)));for(const H of c)E.set(.016*Math.sin(y*2*Math.PI/(2*Math.sqrt(H.L))*1+H.ph),0,.011*Math.sin(y*2*Math.PI/(2*Math.sqrt(H.L))*.83+H.ph*1.7)),x.matrix(H.part).makeRotationFromEuler(E).setPosition(H.topP)}})}),Oe.push(async(e,t)=>{const o=t.beyond.at,s=new Ee,r=O.frames,a=O.cat,d=(b,v,T,$)=>{s.color("#111111"),s.glow=[T,$],s.tube(b,v,.22,5,!0),s.glow=[0,0]},u=[[-1,-1],[1,-1],[1,1],[-1,1]],l=(b,v,T,$,z,A,c,m)=>{const E=(g,y,k)=>o(b+g*z*le(1,A,k),le(T,$,k),v+y*z*le(1,A,k));s.color(m);for(const g of[-1,1])for(const y of[-1,1])s.tube(E(g,y,0),E(g,y,1),.2,4,!0);s.color(m,.8);for(let g=0;g<c;g++){const y=g/c,k=(g+1)/c;for(let W=0;W<4;W++){const H=u[W],R=u[(W+1)%4];s.tube(E(H[0],H[1],y),E(R[0],R[1],k),.12,4,!0),s.tube(E(R[0],R[1],y),E(H[0],H[1],k),.12,4,!0),s.tube(E(H[0],H[1],k),E(R[0],R[1],k),.1,4,!0)}}};for(let b=0;b<r.r.length;b++){const v=r.r[b];b&&await e.yield();for(const T of[-1,1])l(v,T*r.legT,-.6,r.top,r.half,.6,6,b%2?"#b08a36":"#a9853a");s.color("#b8923c"),s.box(o(v,r.top+1.2,0),se(t.gap.bearing+90),new n.Vector3(0,1,0),se(t.gap.bearing),r.legT+4,1.2,1.5);for(let T=-3;T<=3;T++)d(o(v-1.7,r.top-.4,T*8-1.1),o(v-1.7,r.top-.4,T*8+1.1),4.2,b*1.3+T*2.1)}await e.yield();const i=se(t.gap.bearing+90),f=se(t.gap.bearing),p=new n.Vector3(0,1,0),x=(a.r0+a.r1)/2,P=(a.r1-a.r0)/2;for(const b of[-1,1])for(const v of a.y){s.color("#6e6a60"),s.box(o(x,v,b*a.t),f,p,i,P,.12,a.half),s.color("#9a8c62");for(const T of[-1,1])s.tube(o(a.r0,v+1.1,b*a.t+T*a.half),o(a.r1,v+1.1,b*a.t+T*a.half),.05,4,!0);for(let T=a.r0;T<=a.r1+.1;T+=a.every)d(o(T-.9,v-.4,b*(a.t-a.half+.15)),o(T+.9,v-.4,b*(a.t-a.half+.15)),3.6,T*.37+v)}for(const b of[-1,1])for(let v=a.r0;v<=a.r1+.1;v+=a.every*2)s.color("#5f5a4e"),s.tube(o(v,v<O.deck.r1?O.deck.top:-.6,b*(a.t+a.half-.1)),o(v,a.y[1]+1.1,b*(a.t+a.half-.1)),.11,4,!0);t.steel.add(s),t.backstage={meshes:[],triangles:s.triangles}});const zo=`
varying vec3 vW;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,Lo=`
varying vec3 vW; uniform float uTime, uGapAz;
${Ue}
${tt}
${nt}
void main(){
  float y = vW.y, rw = length(vW.xz), az = mod(atan(vW.x, -vW.z + 1e-6) - uGapAz + 3.14159265, 6.2831853) - 3.14159265, su = az * rw;
  float fw = max(length(fwidth(vec2(su, y))), 1e-3), bx = su / 24., by = y / 18.; vec2 id = vec2(floor(bx), floor(by));
  vec3 glow = beyondGlow(y), col = glow * mix(.925, .55 + .75 * h21(id + 7.3), resc(18., fw));   // (a bay's own tone: its middle where a pixel is a bay tall)
  // a work lamp high in some of the lower bays, its pool of light on the sheeting under it
  float has = step(.56, h21(id + 31.7)), ph = h21(id + 3.1) * 6.2831853; vec2 q = vec2((fract(bx) - .5) * 24., (fract(by) - .8) * 18.);
  float pool = exp(-length(q * vec2(1., q.y > 0. ? 2.4 : .55)) / 4.6), rad = max(.75, 1.4 * fw), dot1 = 1. - smoothstep(rad * .55, rad, length(q));
  // (the lamp's dot is drawn 1.4 pixels across at the least and keeps its true cover by area: its own round over the round drawn)
  col += vec3(1., .62, .26) * has * (pool * .5 + dot1 * 2.6 * (.75 / rad) * (.75 / rad)) * (.86 + .14 * sin(uTime * .8 + ph));
  // the ribs and the ring beams: dark steel before the lit sheeting, a lit flange on each
  // (each keeps its true cover and ends in its own mean: its width over the 24 m between ribs, the 18 m between beams)
  float dx = abs(fract(bx + .5) - .5) * 24., dy = (fract(by + .5) - .5) * 18., steel = uni(lnP(dx, .9, 24., fw), lnP(abs(dy), .7, 18., fw));
  col = mix(col, glow * .1 + vec3(.003, .006, .016), steel * .9);
  col += vec3(1., .6, .24) * .3 * glow.r * (lnP(abs(dx - 1.1), .16, 12., fw) + lnP(abs(dy + .9), .14, 18., fw));
  gl_FragColor = vec4(col, 1.);
}`;Oe.push(async(e,t)=>{const o=t.beyond.at,s=t.gap.bearing,r=360/L.gores,a=new Ee,d=O.frames,u=se(s+90),l=se(s),i=new n.Vector3(0,1,0),f=(A,c,m,E)=>{a.color("#111111"),a.glow=[m,E],a.tube(A,c,.22,5,!0),a.glow=[0,0]},p=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let A=0;A<O.towers.length;A++){const[c,m,E]=O.towers[A];A%2===1&&await e.yield();const g=m<0?1:-1,y=c<O.deck.r1&&Math.abs(m)<O.deck.t1?O.deck.top:-.6,k=Math.round(E/8),W=2.6,H=(R,I,F)=>o(c+R*W,le(y,E,F),m+I*W);a.color("#8f8468");for(const R of[-1,1])for(const I of[-1,1])a.tube(H(R,I,0),H(R,I,1),.1,4,!0);for(let R=1;R<=k;R++){const I=(R-1)/k,F=R/k;a.color("#7d745c");for(let j=0;j<4;j++){const Z=p[j],oe=p[(j+1)%4];a.tube(H(Z[0],Z[1],F),H(oe[0],oe[1],F),.07,4,!0),a.tube(H(Z[0],Z[1],I),H(oe[0],oe[1],F),.06,4,!0),a.tube(H(oe[0],oe[1],I),H(Z[0],Z[1],F),.06,4,!0)}}a.color("#6b6048"),a.box(o(c,E+.1,m),l,i,u,W+.3,.1,W+.3),a.color("#9a8c62");for(const[R,I,F,j]of[[-1,-1,-1,1],[-1,1,1,1],[1,1,1,-1],[1,-1,-1,-1]])a.tube(o(c+R*W,E+1.2,m+I*W),o(c+F*W,E+1.2,m+j*W),.05,4,!0);f(o(c-W,E-.5,m-1),o(c-W,E-.5,m+1),4,A*1.9),f(o(c-1,E-.5,m+g*W),o(c+1,E-.5,m+g*W),4,A*2.7+1),k>3&&f(o(c-W,le(y,E,.5)-.5,m-1),o(c-W,le(y,E,.5)-.5,m+1),3.2,A*3.3+2)}await e.yield();const x=(A,c,m)=>{a.color("#8d8672",1.3);let E=A;for(let g=1;g<=12;g++){const y=g/12,k=A.clone().lerp(c,y);k.y-=m*4*y*(1-y),a.tube(E,k,.07,4,!0),E=k}},P=O.gantry,b=O.towers,v=d.top+.2;for(const A of[-1,1])x(o(P.r,P.top,A*14),o(d.r[0],v,A*14),10),x(o(d.r[0],v,A*23),o(d.r[1],v,A*23),13),x(o(d.r[1],v,A*7),o(d.r[2],v,A*7),9),x(o(d.r[2],v,A*17),o(d.r[3],v,A*17),12);for(const[A,c,m]of[[0,0,5],[1,1,9],[3,2,8],[4,2,4],[5,3,6]])x(o(b[A][0],b[A][2],b[A][1]),o(d.r[c],v,Math.sign(b[A][1])*(d.legT+2)),m);for(const[A,c,m]of O.fly){const E=re(s,A,-c),g=m/(L.R*Math.cos(A/L.R)+c)/V;a.color("#a08a4a"),a.box(E,u,i,l,m,.9,1.4),a.color("#c9b98a"),a.box(E.clone().addScaledVector(i,1),u,i,l,m,.1,1.5);for(const y of[-1,1])a.color("#8d8672",1.2),a.tube(re(s+y*g*.8,A+1,-c),re(s+y*g*.9,A+46,-(c+40)),.09,4,!0);for(let y=-3;y<=3;y++){const k=y*m/3.6,W=E.clone().addScaledVector(u,k).addScaledVector(l,-1.6).addScaledVector(i,-.7);f(W.clone().addScaledVector(u,-1.2),W.clone().addScaledVector(u,1.2),4.2,A*.11+y*2.3)}}for(const A of[-1,1]){const c=s+A*(r-.12/L.R/V),m=se(c+90),E=se(c);a.color("#8b9099");for(let g=0;g<300;g+=15){const y=re(c,g+15,-.6).sub(re(c,g,-.6)).normalize();a.box(re(c,g+7.5,-.6),m,y,E,.12,7.6,.6)}}t.steel.add(a),await e.yield();const T=[-8,0,15,30,50,75,105,140,180,230,290,360,440,520,590,650],$={uTime:{value:0},uGapAz:{value:s*V}},z=new n.Mesh(Nt(s-120,s+120,48,T,O.outer,null,!1),new n.ShaderMaterial({uniforms:$,vertexShader:zo,fragmentShader:Lo,side:n.DoubleSide}));z.frustumCulled=!1,z.name="backstage-far-wall",t.object.add(z),t.backstage.meshes.push(z),t.backstage.triangles+=a.triangles+720*2,t.backstage.wall=z,t.parts.push({update(A,c){$.uTime.value=c}})}),Oe.push(async(e,t)=>{const o=t.steel.build();await e.yield(),t.object.add(o.body,o.thin),t.steel.body=o.body,t.steel.thin=o.thin});export{Kt as ASLANT,O as BEYOND,N as BOAT,Ce as GAP,St as GLSL_SHADOW,Ae as LAMP,Je as LAMP_LIGHT,ke as LOOKS,Qt as MASSES,lt as PAINTS,Xt as PAINT_SEED,Be as RAILS,Yt as ROUTE,be as SAIL,Y as SEAM,He as SEA_BODY,et as SHADE,_e as SHADOW,L as SHELL,it as SWELL,It as WATER_SHADE,Ge as bearingOf,se as dirOf,$o as gapPlace,ut as gapWidth,Qe as hullKeel,bt as hullSheer,Ut as lampAngle,gt as lampPlace,Jt as layRoute,_o as makeBoat,qo as makeLayers,jo as makeSea,Fo as makeSky,Go as paceAt,Pe as railDir,Xe as railNormal,Vo as rainLook,Do as seamBearing,ko as seamHalf,Io as seamLook,Ye as seamRake,xt as shadowHeads,Co as shadowLook,Et as shadowPoint,Zt as shadowUniforms,Oo as shadowWall,No as shadowWholeFrom,co as swellAt,Wo as wallHeight,re as wallPoint,Ho as wallRadius,Bo as waterInShade};
