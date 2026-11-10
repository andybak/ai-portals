import*as u from"three";const ee=(e,t,r)=>e+(t-e)*r,ve=e=>Math.min(1,Math.max(0,e)),ue=(e,t,r)=>{const a=ve((r-e)/(t-e));return a*a*(3-2*a)},Te=362,xe=288,Oe=Te-6.6,J={walk:0,run:1,paw:2,hind:3,fore:4,roost:5,pit:6,hollow:7,trough:8,crater:9,seam:10,blob:11,feather:12,dint:13,scuff:14,drag:15};function At(e,{variant:t=0,rare:r=!1,side:a=1}={}){const h=e.fork?e.fork("story"):e,i=t===1?0:h.range(.05,.085)*(h.chance(.5)?1:-1),l=h.range(205,250),d=n=>t===1?-1.08*a*ue(146,262,n):i*Math.sin(6.2832*n/l)*ue(0,40,n)*(1-ue(196,258,n)),H=160,S=(Te+160)*2,g=new Float32Array(S+1),_=new Float32Array(S+1),j=new Float32Array(S+1);{let n=0,v=80;for(let x=0;x<=S;x++){const y=(x-H)*.5,T=d(y+.25);j[x]=d(y),g[x]=n,_[x]=v,n+=-Math.sin(T)*.5,v+=-Math.cos(T)*.5}}{const n=g[H],v=_[H];for(let x=0;x<=S;x++)g[x]-=n,_[x]-=v}const s=(n,v=0)=>{const x=Math.min(S-.001,Math.max(0,n*2+H)),y=Math.floor(x),T=x-y,U=ee(j[y],j[y+1],T);return[ee(g[y],g[y+1],T)-Math.cos(U)*v,ee(_[y],_[y+1],T)+Math.sin(U)*v,U]},p=[];for(let n=0;n<=40;n++){const v=s(n*Te/40);p.push([v[0],3,v[1]])}const D=[],c=(n,v,x,y,T,U,B,O=0)=>{D.push(n,v,x,y,T,U,B,O)},z=(n,v,x,y,T,U,B,O=0)=>{const k=s(n,v);return c(k[0],k[1],k[2]+x,y,T,U,B,O),k},$=(n,v,x,y,T,U)=>{const B=Math.hypot(x-n,y-v),O=Math.max(1,Math.floor(B/T)),k=Math.atan2(-(x-n),-(y-v));for(let b=0;b<=O;b++)U(ee(n,x,b/O),ee(v,y,b/O),k,b,O)},M=99+h.range(-3,3),L=[[M,M+10]];t===2&&(L.push([190+h.range(-4,4),0]),L[1][1]=L[1][0]+9);const F=t===2?1e9:146,X=xe-1,f=n=>L.some(v=>n>v[0]&&n<v[1]);{const n=s(9);c(n[0],n[1],n[2]+.2,2.6,3.6,.5,J.roost,0)}let o=10.9,w=0,q=null;const V=X-2.8;for(;o<X+.01;){const n=o>=F,v=o,x=n?ve((o-V)/2.8+.001)*(o>=V-.01?1:0):0;if(f(o)){q=null,o+=1.4;continue}const y=w&1?1:-1,T=n?z(o,y*ee(.2,.13,x)+h.range(-.05,.05),-y*.05,1.5,1.5,o>=V-.01?ee(.36,.48,x):.3,J.run):z(o,y*.12,-y*.14,1.1,1.1,.16,J.walk);if(!n&&q){const U=T[0]-q[0],B=T[1]-q[1],O=Math.hypot(U,B)||1,k=.5+.1/O;c(q[0]+U*k,q[1]+B*k,Math.atan2(-U,-B),.26,Math.max(.3,O-.72),.045,J.seam,.35)}q=n?null:T,w++,o+=n?Math.min(3.4,1.6+(o-F)*.9):1.4,!n&&o>=F&&(o=F),n&&(v>=V-.01?o=v+1.4:o>V-1.7&&(o=V))}const C=[];for(const n of L){const v=(n[0]+n[1])/2,x=(n[1]-n[0])/2;for(let y=0;y<46;y++){const T=h.range(0,6.2832),U=Math.sqrt(h()),B=s(v+Math.cos(T)*U*x,Math.sin(T)*U*1.5);c(B[0],B[1],B[2]+h.range(-1.6,1.6),1.1,1.1,.18,J.walk,y%3?0:.2)}for(let y=0;y<16;y++){const T=s(v+h.range(-x,x),h.range(-1.4,1.4));c(T[0],T[1],h.range(0,6.28),.5,.5,.2,J.pit)}{const y=s(v,0);c(y[0],y[1],y[2],3.6,n[1]-n[0]+1.5,.05,J.scuff)}for(let y=0;y<3;y++){const T=s(v+(y-1)*x*.62+h.range(-.6,.6),(y===1?-1:1)*h.range(.5,1.1));C.push([T[0],T[1],h.range(.5,.8)])}}const I=(9+2.9-1.15)/2;{const n=s(66+h.range(-5,5)),v=n[2]+1.22*a,x=-Math.sin(v),y=-Math.cos(v),T=-Math.cos(v),U=Math.sin(v);for(let B=-12;B<18;B++){const O=n[0]+x*(B*9+I),k=n[1]+y*(B*9+I),b=h.range(-.15,.15);c(O+T*.5,k+U*.5,v-.1,.8,1.9,.15,J.hind),c(O-T*.5+x*.2,k-U*.5+y*.2,v+.1,.8,1.9,.15,J.hind),c(O-x*1.7+T*b,k-y*1.7+U*b,v,.6,.6,.12,J.fore),c(O-x*2.6-T*(b+.12),k-y*2.6-U*(b+.12),v,.6,.6,.12,J.fore)}}const G=(n,v,x,y,T,U)=>{const B=(U&1?1:-1)*.1;c(n-Math.cos(x)*B,v+Math.sin(x)*B,x,1,1,y,J.paw,T)},W=[],ae=[];let Y=null,Q=0,se=null,we=null,le=null,ye=0,Ae=0;const he=(L[0][0]+L[0][1])/2;if(t===2){const n=236+h.range(-8,8),v=s(n,-150*a),x=s(n+h.range(-14,14),170*a);$(v[0],v[1],x[0],x[1],3.2,(y,T,U,B)=>G(y,T,U,.15,.5,B)),we=[v[0],v[1],x[0],x[1]]}else{let n=147,v=8.4;if(t===0){const k=s(he-165,112*a),b=s(he+9,8.6*a);$(k[0],k[1],b[0],b[1],3.2,(P,N,E,Z,R)=>{Z<R&&G(P,N,E,.14,.5,Z)}),c(b[0],b[1],b[2]-.5*a,3.4,3.4,.3,J.hollow),we=[k[0],k[1],b[0],b[1]];for(let P=0;P<7;P++){const N=h.range(0,6.28),E=[b[0]+Math.cos(N)*h.range(1.5,2.2),b[1]+Math.sin(N)*h.range(1.5,2.2)];c(E[0],E[1],h.range(0,6.28),1,1,.2,J.paw)}for(let P=he+12,N=0;P<137.5;P+=1.2,N++){const E=s(P,ee(8.2,7,(P-he-12)/(137.5-he-12))*a);G(E[0],E[1],E[2]+.14*a*-1,.24,0,N)}{const P=s(140.5,7*a);c(P[0],P[1],P[2],3,6,.36,J.trough);for(const N of[-.42,.42]){const E=s(142.6,7*a+N);c(E[0],E[1],E[2],.95,.95,.26,J.paw)}}}else{const k=s(146,6*a),b=[k[0],k[1]-300],P=[k[0],k[1]-50],N=[k[0],k[1]-27];$(b[0],b[1],P[0],P[1],3.2,(E,Z,R,ie)=>G(E,Z,R,.14,.3,ie)),se={x:0,z:b[1]-2,rot:0},we=[b[0],b[1],k[0],k[1]-20],c(b[0],(b[1]+P[1])/2,0,1.3,P[1]-b[1],0,J.seam,4),$(P[0],P[1],N[0],N[1],1.2,(E,Z,R,ie)=>G(E,Z,R,.24,0,ie)),c(k[0],k[1]-24,3.1416,3,6,.36,J.trough);for(const E of[-.42,.42])c(k[0]+E,k[1]-21.9,3.1416,.95,.95,.26,J.paw);n=172,v=6.5}const x=r?2.6:4,y=k=>ee(v,x,ue(186,270,k)),T=t===0?12:10,U=(262-n)/T;for(let k=0;k<=T;k++){const b=n+k*U,P=k===T,N=-Math.atan2(y(b+2)-y(b-2),4)*a;for(let E=0;E<4;E++){const Z=s(b+[0,.9,2,3][E]*(P?.62:1),(y(b)+[-.26,.2,-.2,.26][E]*(P?1.5:1))*a);c(Z[0],Z[1],Z[2]+N,P?1.5:1.4,P?1.5:1.4,P?.42:.32,J.paw)}}le=t===0?k=>k<143?ee(8.2,7,ve((k-he-12)/(137.5-he-12))):k<147?ee(7,8.4,(k-143)/4):y(k):y,ye=t===0?he+9:172,Ae=266;const B=r?xe-.2:xe+5.2,O=s(B,r?0:2*a);Y=[O[0],O[1],O[2]],c(O[0],O[1],O[2],10.3,10.3,1,J.crater);for(let k=0;k<60;k++){const b=O[2]+h.range(-.9,.9)*(r?.55:1)+(r?.75:-.25)*a,P=3.6+7.5*Math.pow(h(),1.6);W.push([O[0]-Math.sin(b)*P,O[1]-Math.cos(b)*P,h.range(.2,.7)*(1.2-P/14),h.range(0,6.28)])}{const k=B+(r?2.6:3),b=r?0:2,P=r?.2:.7;let N=0;for(let E=k;E<Oe-2;N++){const Z=E-k,R=Math.exp(-Z*P/32),ie=P*R,te=s(E,(b-32*(1-R))*a),ne=te[2]-Math.atan(ie)*a;if(G(te[0],te[1],ne,N<7?.24:.14,Math.min(.6,Z*.03),N),r&&N<18)for(const pe of[.6,1.05]){const ce=(pe+h.range(-.16,.16))*a;h()<.3||c(te[0]-Math.cos(ne)*ce,te[1]+Math.sin(ne)*ce,ne+h.range(-.16,.16),1.1,h.range(1.6,2.7),.085,J.drag,.75)}E+=(r?2.5:3.2)/Math.sqrt(1+ie*ie)}}if(r){Q=1;for(let k=0;k<3;k++){const b=s(xe+[-.5,3,-2.3][k],[3.5,-1.9,-2.6][k]*a),P=h.range(0,6.28);ae.push([b[0],b[1],P]),c(b[0],b[1],P,.85,2.5,0,J.feather,5),c(b[0],b[1],P,.85,2.5,0,J.feather,2)}}}const m=Q?s(xe-.2,2.3*a):s(xe,0),A=s(Oe,0);if(!r){const n=s(xe-.25,0);c(n[0],n[1],n[2],3,3,.62,J.dint)}for(const n of W)c(n[0],n[1],0,n[2]*.9,n[2]*.42,0,J.blob,3);for(const n of C)c(n[0],n[1],0,.5,n[2]*.4,0,J.blob,3);return{variant:t,rare:r,side:a,at:s,pts:p,prints:new Float32Array(D),count:D.length/8,feeds:L,patches:L.map(n=>{const v=s((n[0]+n[1])/2,0);return[v[0],v[1],v[2],(n[1]-n[0])/2]}),runS:F,endS:X,sedge:C,clods:W,crater:Y,feathers:ae,wing:{x:m[0],z:m[1],rot:m[2],mode:Q},hedge:{x:A[0],z:A[1],rot:A[2]},hedge2:se,fc:he,fox:{thread:we,lat:le,s0:ye,s1:Ae}}}const Se=`
uniform vec3 uSun, uSunCol, uShade, uShadeDeep, uHaze, uCam, uCrest;
uniform vec2 uSunH, uWind;         // uWind: the way the wind blows over the page (unit x, z)
uniform vec4 uHedge;                 // the hedge frame in the page: x, z, cos, sin
uniform sampler2D uBirch;
uniform float uSinE, uTanE, uTime, uSparkle, uDrift, uMoon;
uniform vec4 uSeam; uniform float uSeamK, uSeamQ, uLevel;   // the trail under the lens (point, heading), how far it bends away ahead, and how level the page lies (1 at the entry)
uniform vec4 uFoxA, uFoxB; uniform vec2 uFoxK;              // the fox's line: its arriving thread and the stretch beside the trail (each x0, z0, x1, z1)
uniform vec3 uCalm;                   // the clean sheet of new powder that took the wing print: x, z, radius
uniform vec4 uPatch[2];                // the trodden pans at the feeding patches: x, z, half length, heading
uniform vec3 uDawn, uGap; uniform vec2 uDawnH;   // first light: its colour times how far it has come (keyed to u), where on the horizon it stands, and the light in the gap
float hash21(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float segD(vec2 p, vec4 s){ vec2 d = s.zw - s.xy; vec2 r = p - s.xy; return length(r - d * clamp(dot(r, d) / max(dot(d, d), 1e-3), 0., 1.)); }   // how far p lies from a stretch of line
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
// wind relief (wind along +x, crests square to it and four times longer than they are wide): 7 m swells and 2.2 m
// ripples that ride them; ripL is what casts shadow, ripF the fine sastrugi (0.8 m) that only models the light
vec2 wr(vec2 p){ return vec2(uWind.x * p.x + uWind.y * p.y, -uWind.y * p.x + uWind.x * p.y); }      // x along the wind, y along the crests
// one layer of sastrugi: cells cs metres in wind space (x downwind), rows offset like bricks, each holding at most one
// short crescent: a sharp lip, a steep face turned upwind (from the sun), a back that falls away in a curve, horns swept
// downwind, dying to nothing at both ends. Nothing here can stretch into a band: a crescent never leaves its cell.
// k: where the lip stands in its cell, how far the horns sweep back (base, and per crescent), how long the back runs on.
// A long cell, a deep sweep and a long back make a tongue: a V nose turned upwind and a tail that tapers away downwind.
float sasL(vec2 w, vec2 cs, float seed, float dens, vec4 k){
  vec2 q = w / cs; float row = floor(q.x);
  q.y += hash21(vec2(row, seed)) + .35 * vnoise(vec2(q.x * .7, q.y * .5 + seed));
  vec2 ci = vec2(row, floor(q.y)), f = q - ci;
  float h1 = hash21(ci + seed), h2 = hash21(ci * 1.7 + seed + 9.1);
  float h3 = hash21(ci * 2.3 - seed);
  float sz = .55 + .45 * hash21(ci * 3.1 + seed + 2.7);                 // no two are one size
  float y = clamp((f.y * 2. - 1.) / sz, -1., 1.), env = 1. - y * y; env *= env * (1. - smoothstep(dens - .06, dens + .06, h1));
  float ys = y + (h3 - .5) * .9;                                       // no two crescents bow alike
  float t = (f.x - (k.x + .3 * h2 * (1. - k.x) + (k.y + k.z * h3) * ys * ys * sz)) / sz;
  float prof = t < 0. ? smoothstep(-.1, 0., t) : .72 * exp(-t / .07) + .28 * exp(-t / k.w);   // a sharp lip, then a long low back
  return prof * (1. - smoothstep(.8, 1., f.x)) * env * (.45 + .55 * h2);
}
float ripL(vec2 p, vec3 amp){
  vec2 w = wr(p);
  w += (vec2(vnoise(w / 7.3 + 2.1), vnoise(w / 6.1 - 4.7)) - .5) * 1.1;   // the lanes are not ruled
  // the wind combs the snow in streaks that run downwind; between them it lies in wide clean sheets
  float m = .7 * vnoise(vec2(w.x / 31., w.y / 6.5) + 7.3) + .3 * vnoise(vec2(w.x / 9., w.y / 3.) - 1.9);
  float dens = smoothstep(.33, .57, m) * (.3 + .9 * smoothstep(.3, .62, vnoise(w / 58. + 1.7)));   // whole fields of them, then a clean sheet
  float s = max(1.2 * (1. - uMoon) * sasL(w + 5.1, vec2(5.6, 2.1), 5.3, dens * .62, vec4(.06, .22, .5, .5)), sasL(w, vec2(1.5, 2.7), 3.7, dens * .5, vec4(.3, .1, .22, .3)));   // tongues, and crescents between them
  s = max(s, .6 * sasL(w + 11.3, vec2(.8, 1.4), 17.1, dens * .55, vec4(.25, .1, .3, .3)));                      // and their small kin
  return amp.x * .03 * s;
}
// the swells the ripples ride: broad, crests square to the wind. They only lay soft shadow bands and turn the light
float swell(vec2 w){ return vnoise(vec2(w.x / 8.5, w.y / 21.) + 5.1) + .35 * vnoise(vec2(w.x / 3.9, w.y / 9.) - 8.3); }
// the drifts: a few long wind-laid ridges beside the trail (the story places them; never on the line, a patch or the
// wings). In wind space (x downwind, toward the light's side): a knife crest that wanders like a river, a short steep
// nose turned upwind (from the light) and a low back that fades away downwind; it tapers to nothing at both ends.
// x: height in metres, y: how near the crest on its lit back (0..1). uDr: x, z, half length, height.
uniform vec4 uDr[6];
vec2 driftHM(vec2 p){
  vec2 o = vec2(0.);
  for (int i = 0; i < 6; i++) {
    vec2 r = wr(p - uDr[i].xy); float W = uDr[i].z, y = r.y / W;
    if (abs(y) < 1. && abs(r.x) < W) {
      float ph = uDr[i].x * .37 + uDr[i].y * .23, env = 1. - y * y; env *= env;
      float t = (r.x - W * (.16 * sin(y * 3.1 + ph) + .07 * sin(y * 7.3 + ph * 2.1) + .22 * y * y - .1)) / W;
      float q = clamp(1. - t / .46, 0., 1.); q *= q;
      float h = uDr[i].w * env * (t < 0. ? smoothstep(-.09, 0., t) : q);
      if (h > o.x) o = vec2(h, env * q * smoothstep(-.05, .012, t));    // (eased across the crest: a step here drew a stair-stepped edge)
    }
  }
  return o;
}
float ripF(vec2 p, vec3 amp){
  vec2 w = wr(p);
  float m = vnoise(vec2(w.x / 3.1, w.y / 6.) - 2.2);
  float ph = w.x / .46 + 2.2 * vnoise(vec2(w.x / 2.6, w.y / 3.4) + 4.7) + .3 * vnoise(vec2(w.x / .5, w.y / 1.1)), ci = floor(ph), t = ph - ci;
  float b = vnoise(vec2(w.x / 9., w.y / 14.) - 3.1);
  float seg = smoothstep(.5, .78, vnoise(vec2(ci * 5.31, w.y / .8 + ci * 2.7)));     // each fine ridge runs a metre and dies
  return amp.z * (.0036 * min(t / .2, (1. - t) / .8) * smoothstep(.4, .8, m) * seg + .0024 * vnoise(vec2(w.x / .15, w.y / .6) - 8.1)) + amp.y * .009 * b * b;
}
float hedgeRaw(float X){ return 13. + 8. * vnoise(vec2(X * .05, 3.)) + 2.5 * vnoise(vec2(X * .4, 9.)) + 2. * vnoise(vec2(X * 1.9, 5.)); }
float hedgeTop(float X){ return hedgeRaw(X) * (1. - .8 * smoothstep(150., 256., abs(X))); }   // it dwindles into the field at both ends
// the long shadows of the only tall things on the page: the hedge (with the gap's shaft of light) and the two birches
// x: shadow, y: the pool of light that comes through the gap and lies on the snow in front of it
vec2 farShade(vec2 p){
  vec2 r = p - uHedge.xy, ex = vec2(uHedge.z, -uHedge.w), ez = vec2(uHedge.w, uHedge.z);
  float px = dot(r, ex), pz = dot(r, ez), sx = dot(uSunH, ex), sz = dot(uSunH, ez);
  float sze = sz < 0. ? min(sz, -.75) : max(sz, .75);                   // an artist's sun for the tall things: their shadows lie out across the field, never along the hedge foot
  float isz = 1. / sze;
  float t = -pz * isz, ok = step(0., t) * (1. - smoothstep(26., 60., t));        // it dies out before it can lie over the story
  float X = px + sx * t, Y = t * uTanE * 4.5, top = hedgeTop(X), pen = .5 + .09 * t;
  float lace = .62 + .38 * smoothstep(.25, .6, vnoise(vec2(X * .8, Y * .5)) + (.5 - Y / max(top, 1.)) * .9);   // the top of a bare hedge lets the sun through
  float s = (1. - smoothstep(top * .7 - pen, top + pen, Y)) * lace * smoothstep(6.6 - pen * .4, 9. + pen * .4, abs(X)) * (1. - smoothstep(240., 258., abs(X)));
  float tb = -(pz - .8) * isz, Xb = px + sx * tb, Yb = tb * uTanE * 4.5, lod = log2(1. + max(tb, 0.) * .12);
  float b1 = texture2D(uBirch, vec2((Xb + 14.) / -36. + .5, Yb / 72.), lod).a * step(Yb, 72.) * step(abs(Xb + 14.), 18.);
  float b2 = texture2D(uBirch, vec2((Xb - 14.) / 36. + .5, Yb / 66.2), lod).a * step(Yb, 66.2) * step(abs(Xb - 14.), 18.);
  s = max(s, min(max(b1, b2) * 2.2, 1.) * step(0., tb));
  float pool = exp(-px * px / 60.) * exp(-abs(pz - 5.) / 16.) * step(0., pz);
  return vec2(s * ok, pool);
}
// spindrift: short curling wisps that hug the snow, let through in gusts, scrolled by time
float drift(vec2 p){
  vec2 w = wr(p); float tm = uTime * 6.;
  float gust = .45 + .55 * smoothstep(.46, .76, vnoise(vec2((w.x - uTime * 4.2) / 17., w.y / 6.5)));   // it comes in gusts: a few threads, then clean snow
  vec2 c = vec2(vnoise(vec2((w.x - tm) / 4.5, w.y / 2.2) + 3.), vnoise(vec2((w.x - tm) / 3.7 + 11., w.y / 2.6)));   // the wisps curl
  vec2 q = vec2((w.x - tm) / 1.15 + c.y * 2.2, w.y / .5 + c.x * 6.);
  float body = smoothstep(.58, .8, .62 * vnoise(q) + .38 * vnoise(q * vec2(1.9, 2.3) + vec2(17.3, 4.1)));   // a wisp: a few metres long, half a metre wide, tapering at both ends
  float fib = .5 + .5 * vnoise(vec2(q.x * 1.6 + 5., q.y * 1.9));         // combed into fibres along the wind
  return body * fib * gust * 1.6 * uDrift;
}
// the wind crust: between the fields of ripples the sheet is glazed in plates some metres across (7 m along the wind,
// 3 m across it) with a broken edge. w: wind space. Above zero inside a plate.
float crustM(vec2 w){ return vnoise(w / vec2(7., 3.2) + 21.3) + .2 * (vnoise(w / vec2(1.6, .8) + 3.1) - .5) + .06 * (vnoise(w / .33) - .5) - .56; }
float crustP(vec2 p, float ew){ return smoothstep(0., ew, crustM(wr(p))); }
// how trodden the snow is at p (0..1): an oval pan round each feeding patch with a broken edge
float pan(vec2 p, float grow){
  float k = 0.;
  for (int i = 0; i < 2; i++) { vec2 r = p - uPatch[i].xy; float cr = cos(uPatch[i].w), sr = sin(uPatch[i].w);
    vec2 q = vec2(r.x * cr - r.y * sr, r.x * sr + r.y * cr) / (vec2(2.9, uPatch[i].z + 1.6) * grow);     // x across the trail, y along it
    k = max(k, 1. - smoothstep(.55, 1.05, length(q) + (vnoise(p * .9 + 3.3) - .5) * .5)); }
  return k;
}
// THE AIR OF THE PAGE: one law for everything that lies or stands in it (the snow, and the dead plants beside the trail).
// airVeil: ws = the place in wind space, V = the unit ray from the place to the lens, cup = 1 at the bottom of a print.
  // the far page lies under running snow: a ray that grazes the field goes a long way through the hand of spindrift
  // above it, so the snow near us is crisp and the far snow a band that holds the light (and, later, the dawn)
vec3 airVeil(vec3 col, vec2 ws, vec3 V, float cup){
  float gz = max(abs(V.y), .035), run = .25 + 1.1 * vnoise(vec2((ws.x - uTime * 6.) / 11., ws.y / 2.8)) * (.45 + vnoise(vec2((ws.x - uTime * 9.) / 5.2, ws.y / 2.1)));   // it runs in gusts, downwind
  float veil = (1. - exp(-.011 / (gz * gz) * run * uDrift)) * mix(.3, .8, uMoon) * (1. - .5 * cup);
  veil *= mix(.5, 1., smoothstep(.03, .16, gz));                       // the far field keeps its own light and shadow under it
  return mix(col, uSunCol * .4 + uShade * .62 + uDawn * .55, veil);
}
// airHaze: the haze of distance, and the far rim of the field going into it. p = the place, dist = metres from the lens.
vec3 airHaze(vec3 col, vec2 p, float dist){
  float hz = 1. - exp(-dist / 900.);
  hz = max(hz, smoothstep(380., 690., length(p - vec2(0., -180.))));
  return mix(col, uHaze, hz);
}
// p: local xz. fw: pixel footprint in metres (fwidth taken by the caller). bend: extra slope (dh/dx, dh/dz) from a print.
// cup: 0 on open snow, up to 1 at the bottom of a print (shadow there is deeper blue). shIn: shadow cast inside a print.
float gWindForm = 0.;   // set to 1 by a stamp that is the wind's work, not a print: its slopes are shaded as a ripple's are (no gold wall, no dark wall)
vec3 snowShade(vec2 p, vec2 fw, vec2 bend, float cup, float shIn, vec3 V, float dist){
  float wallK = min(dot(bend, bend) * 3., 1.) * (1. - gWindForm);                         // on the wall of a print the light is gold, not cream
  float foot = max(fw.x, fw.y * .25), fmax = max(fw.x, fw.y);
  vec3 amp = vec3(1. - smoothstep(.3, .65, foot), 1. - smoothstep(.9, 1.9, foot), 1. - smoothstep(.09, .26, foot));
  float ck = 1. - smoothstep(.55, 1., length(p - uCalm.xy) / uCalm.z + (vnoise(p * .4 - 6.1) - .5) * .3);
  float pk = pan(p, 1.), ax0 = amp.x; amp.x *= (1. - pk) * (1. - .85 * ck);                     // trodden snow carries no ripples
  float e = .05, hL = ripL(p, amp), h0 = hL + ripF(p, amp);
  vec2 g = vec2(ripL(p + vec2(e, 0.), amp) + ripF(p + vec2(e, 0.), amp) - h0, ripL(p + vec2(0., e), amp) + ripF(p + vec2(0., e), amp) - h0) / e;
  // grain: the crust is not glass. A sixth of a metre of tooth near the lens, gone where it would crawl
  float ga = 1. - smoothstep(.006, .022, fmax);
  vec2 gr = vec2(vnoise(p * 23.), vnoise(p * 23. + 31.7)) - .5;
  g += gr * .042 * ga * (1. - .6 * cup);
  // a plate of crust stands a finger (0.015 m) proud of the powder round it: its broken edge is a lip that takes the light
  // on the sun's side and lays a hair of shadow on the other. Gone where a pixel is wider than a third of a metre.
  float cfd = (1. - smoothstep(.08, .3, fmax)) * (1. - pk) * (1. - ck) * (1. - cup), cew = .036 + 1.5 * fmax;
  float plate = crustP(p, cew);
  g += vec2(crustP(p + vec2(e, 0.), cew) - plate, crustP(p + vec2(0., e), cew) - plate) * (.015 / e) * cfd * (1. - uMoon);
  plate *= cfd;
  // under the moon a plate is glitter only: the moon's shine on the snow is already 3.2 times the sun's, and a plate that
  // took it again stood out as a milky pane with a drawn edge. No lip, no tint, no shine of its own there.
  float glaze = plate * (1. - uMoon);
  // the pan: pressed a hand lower with a soft broken edge, and lumpy underfoot (no two steps pressed alike)
  float pl = 1. - smoothstep(.05, .4, fmax);
  g += vec2(pan(p + vec2(.3, 0.), 1.) - pk, pan(p + vec2(0., .3), 1.) - pk) * (-.05 / .3) * pl;
  g += (vec2(vnoise(p * 3.1 + 7.), vnoise(p * 3.1 - 5.3)) - .5) * min(.75 * uSinE, .12) * pk * pl * (1. - cup);
  vec2 dr0 = driftHM(p); float dk = (1. - smoothstep(1.5, 5., fmax)) * (1. - pan(p, 2.2)) * (1. - .9 * ck);
  g += bend;
  vec3 n = normalize(vec3(-g.x, 1., -g.y));
  float ndl = dot(n, uSun);
  // cast shadow of the crests: is the snow 0.6 m or 1.5 m toward the sun higher than the sun's ray?
  float s1 = ripL(p + uSunH * .26, amp) - hL - .26 * uTanE, s2 = ripL(p + uSunH * .5, amp) - hL - .5 * uTanE;
  float s0 = ripL(p + uSunH * .1, amp) - hL - .1 * uTanE;
  float sh = max(max(smoothstep(-.003, .009, s1), smoothstep(-.006, .016, s2)), smoothstep(-.002, .005, s0));   // feather-edged: the far end of a shadow is the softest
  sh = max(sh, 1. - smoothstep(-.02, .03, ndl));
  float mean = .13 * (1. - .43 * smoothstep(.07, .123, uTanE));      // what the unresolved far field averages to
  sh = mix(mean, sh, ax0) * mix(mix(.8, .85, uLevel), .34, uMoon);   // on the pitched page ripple shadow stays a tint (the prints are the darkest marks); in the level entry view it is the long blue shadow of first sun
  // the swells: is the swell 2.5 m or 6 m toward the moon or sun higher than its ray? Broad soft bands that shorten as it climbs
  vec2 ws = wr(p), wsu = wr(uSunH); float sw0 = swell(ws), swA = swell(ws + wsu * 2.5) - sw0, swB = swell(ws + wsu * 6.) - sw0;
  float swf = (1. - smoothstep(2.5, 7., fmax)) * (1. - pan(p, 2.6)) * (1. - ck);
  // ...nor over the trail ahead (uSeam: the trail's point and heading under the lens, uSeamQ: how it bends away; uSeamK: off once the trail has ended),
  // nor within 3 m of the fox's line: its arriving thread (uFoxA) and the stretch where it runs beside the trail (uFoxB)
  { vec2 sr = p - uSeam.xy; float sa = dot(sr, uSeam.zw), sb = clamp(sa, 0., 110.), sc = abs(sr.x * uSeam.w - sr.y * uSeam.z - uSeamQ * sb * sb);
    swf *= 1. - uSeamK * (1. - smoothstep(3.5 + .05 * sb, 8. + .1 * sb, sc)) * smoothstep(-8., 0., sa) * (1. - smoothstep(70., 110., sa));
    swf *= (1. - uFoxK.x * (1. - smoothstep(3., 6.5, segD(p, uFoxA)))) * (1. - uFoxK.y * (1. - smoothstep(3., 6.5, segD(p, uFoxB)))); }   // no swell lays its shadow or turns the light over a feeding patch or the wings
  float band = max(smoothstep(0., .25, swA * 1.5 - 2.5 * uTanE), smoothstep(0., .4, swB * 1.5 - 6. * uTanE)) * swf;
  float turn = clamp(-swA * .9 / 2.5 / max(uSinE, .05), -.4, .3) * swf;      // the side of a swell that faces the light is the brighter
  sh = max(sh, band * mix(mix(.5, .8, uLevel), .34, uMoon));           // a swell's shadow is a tint (a long blue band in the level entry view) and never lies over a feeding patch
  // and each lays one long shadow away from the light, soft at its far end, that shortens as the light climbs
  float dn = (vnoise(p * .55 + 4.4) - .5) * .12;                  // the shadow's edge follows the snow it lies on
  float dsw = .04 + fmax * .9;                                    // the edge is as soft as a pixel is wide on the snow: no stepped edge far off
  float dsh = max(max(smoothstep(-dsw, .12 + dsw, driftHM(p + uSunH * 1.2).x - dr0.x - 1.2 * uTanE + dn * .3), smoothstep(-dsw, .22 + dsw, driftHM(p + uSunH * 3.2).x - dr0.x - 3.2 * uTanE + dn * .6)),
    max(smoothstep(-dsw, .38 + dsw, driftHM(p + uSunH * 6.8).x - dr0.x - 6.8 * uTanE + dn), smoothstep(-dsw, .55 + dsw, driftHM(p + uSunH * 12.5).x - dr0.x - 12.5 * uTanE + dn))) * dk;
  sh = max(sh, dsh * mix(.62, .74, uMoon));
  sh = max(sh, pk * .03 * (1. - cup));                                 // trodden snow is a shade duller than the sheet round it
  float dfade = (1. - smoothstep(.5, 2.5, fmax)) * (1. - .55 * ck), dr = drift(p) * dfade;
  float drS = min(drift(p + uSunH * .8) * dfade, 1.);                  // a thread runs a hand above the snow: its thin shadow runs beside it
  sh *= 1. - .5 * min(dr * 1.3, 1.);
  vec2 fs = farShade(p); float far = fs.x;
  // under the moon, seen from far across the field, the hedge's shadow is a ruled dark line under the mist: there the
  // blown snow lies over it in places and it is a broken, paler band; it gathers its weight as we come near
  far *= mix(1., .18 + .6 * vnoise(vec2(p.x * .045 + uTime * .05, p.y * .045 - uTime * .02) + 7.7), uMoon * smoothstep(60., 200., dist));
  sh = min(max(sh, far * .8) + far * sh * .2, 1.);
  sh = max(sh, shIn);                                                 // a print keeps its shadow under the veil
  float lit = min(max(ndl, 0.) / max(uSinE, .05), mix(2.4, 1.7, wallK));
  lit = max(lit, .56 * (1. - max(wallK, cup)));                         // a ripple's steep face is never as dark as a print
  lit *= 1. + turn * (1. - cup);
  lit *= 1. + .8 * dr0.y * dk * (1. - cup);                             // a drift's back climbs toward the light: brightest at the knife crest
  lit = min(lit, mix(2.4, 1.3, max(pk, gWindForm)));                    // trodden snow has no clean face to flash, nor has the loose snow the wind laid behind a stem
  vec3 sunC = mix(mix(uSunCol, uCrest * 1.06, smoothstep(1.2, 2.3, lit)), uSunCol * vec3(1.12, .9, .6), wallK * .85);
  // sky fill is bluest straight down the page and warms toward the horizon; in a cup it deepens
  vec3 shade = mix(uShade, uShadeDeep, cup) * (1. - .1 * cup) * (.9 + .2 * n.y - .1 * far);
  shade *= 1. + clamp(dot(n.xz, uSunH) * 2.6, -.3, .45) * (.35 + .65 * far) * (1. - cup);    // the sky is brighter on the sun's side: relief still shows in shadow
  vec3 col = shade * (1. - .75 * (1. - sh) * min(lit, 1.) * (1. - cup)) + sunC * lit * .46 * (1. - sh) * (1. - .6 * cup);
  col += uSunCol * vec3(1., .5, .32) * sh * (1. - sh) * .34 * (1. - cup) * (1. - uMoon);              // light bleeds warm through the edge of every shadow
  col += (uDawn + vec3(.12, .1, .08) * dot(uDawn, vec3(.4))) * clamp(dot(n.xz, uDawnH) * 3., 0., 1.) * .55 * (1. - cup) * (1. - wallK);        // first light on every face turned to it: silver from one side, peach from the other
  // the glitter road: snow seen toward the sun shines (it puts the warm side of the frame on the sun's side)
  float tow = max(dot(reflect(-V, n), uSun), 0.); tow *= tow; tow *= tow;
  col *= 1. - .3 * uMoon * smoothstep(.3, .85, V.y) * (1. - cup);       // under the moon the snow straight below the lens is the deep end of the page
  col *= mix(vec3(1.), vec3(.94, .96, 1.01), glaze);                   // glazed crust is a shade cooler than powder: it shows the sky
  { vec3 shine = uSunCol * (tow * tow * .3 + tow * .12) * (1. - sh) * (1. + 2.2 * uMoon);
    col += shine;                                                       // the snow shines toward the light, as it did
    // ...and a plate of crust 1.6 times more, but its own shine never lifts a pixel over 0.92 (under a ripple crest in
    // full light and under the bloom): looking up the glitter road a plate that took the whole 2.6 stood out as a white pane
    vec3 wp = col + shine * 1.6 * glaze; float m0 = max(col.r, max(col.g, col.b)), m1 = max(wp.r, max(wp.g, wp.b));
    col = wp * min(1., max(m0, .92) / max(m1, 1e-3)); }
  // the moon's road: under the moon the far snow shines back in a long broken column that shimmers
  vec2 vh = -V.xz / max(length(V.xz), 1e-3); float rd = max(dot(vh, uSunH), 0.); rd *= rd; rd *= rd; rd *= rd; rd *= rd; rd *= rd;
  col += uSunCol * uMoon * rd * (1. - smoothstep(.04, .2, V.y)) * (1. - sh) * (.5 + 1.3 * smoothstep(.4, .8, vnoise(vec2(ws.y * 1.7 + uTime * .4, ws.x * .3 - uTime * .25))));
  col *= mix(vec3(1.), vec3(.76, .82, .96), drS * (1. - sh) * (1. - .6 * cup) * (1. - .6 * uMoon));
  col += (uSunCol * .5 + uShade * .7) * min(dr, 1.2) * mix(.26, .17, uMoon) * (1. - .7 * cup) * (1. - .8 * far);
  float plume = dr0.y * dk * (.35 + .65 * vnoise(vec2((ws.x - uTime * 7.) / 2.6, ws.y / .7))) * (.5 + .5 * vnoise(vec2((ws.x - uTime * 11.) / 6., ws.y / 2.3) + 3.1));
  col += (uSunCol * .55 + uShade * .5 + uDawn * .4) * plume * .5 * uDrift * (1. - .7 * cup);     // snow smokes off every crest and streams down its back
  col += uGap * fs.y * .42 * (1. - .6 * cup);                // the light that comes through the gap
  col = airVeil(col, ws, V, cup);                                     // the air of the page (above): the far snow lies under running snow
  // sparkle: hashed quarter-metre cells, each a facet that rocks; a glint is a small disc, never a square
  float maz = max(dot(vh, uSunH), 0.); maz *= maz; maz *= maz; maz *= maz; float mroad = uMoon * maz * maz * maz * (1. - .6 * smoothstep(.5, .95, V.y)) * (1. - ck);   // (never over the sheet that took the wings)
  col += uSunCol * mroad * .26 * (1. - sh) * (1. - cup);                  // and the snow itself shines a little along it
  float cs = .25, cfade = (1. - smoothstep(cs * .12, cs * .3, fmax)) * (1. - sh) * uSparkle;
  if (cfade > .01) {
    vec2 ci = floor(p / cs), cf = fract(p / cs) - .5;
    float h1 = hash21(ci), h2 = hash21(ci + 71.7), h3 = hash21(ci - 19.3);
    float ph = h1 * 6.2832 + uTime * (1.2 + 1.6 * h2) + dot(V.xz, vec2(h2, h3) - .5) * 60.;
    float road = smoothstep(.3, .85, dot(vec3(-V.x, V.y, -V.z), uSun));                // the glitter road: the glints crowd toward the light
    // under the moon the glints gather into one road that runs from under the moon to the lens, and are few elsewhere
    float gth = mix(mix(.93, .8, road), .45, mroad) - .1 * plate, gst = (mix(mix(.34, .3, road), .04, mroad) + .22 * uMoon * (1. - mroad)) * (1. - .7 * plate);   // (a plate of crust glitters: more of its facets catch the light, and for longer)
    float gl = smoothstep(gth, 1., sin(ph)) * step(gst, h3);
    vec2 o = (vec2(h2, h1) - .5) * .5;
    float rad = max(.07 * (.55 + 1.1 * h1 * h1), 1.2 * fmax / cs), dd = length(cf - o);          // no two glints one size
    col += mix(uSunCol, uCrest, h2) * (2.2 + 6.5 * h1 * h1 * h1) * gl * (1. - smoothstep(rad * .5, rad, dd)) * cfade;
  }
  // the road far off, where a quarter-metre facet is smaller than a pixel: the same glints gathered into cells three pixels
  // wide, so the road is a column of separate sparks at any distance, never a pale sheet
  if (mroad > .02) {
    float c2 = .25 * exp2(ceil(log2(max(fmax * 12.8, 1.))));
    vec2 ci2 = floor(p / c2), cf2 = fract(p / c2) - .5;
    float k1 = hash21(ci2 + 13.1), k2 = hash21(ci2 - 47.7), k3 = hash21(ci2 + 91.3);
    float on = smoothstep(.5, 1., sin(k1 * 6.2832 + uTime * (1.5 + 2.5 * k2))) * step(1. - .85 * mroad, k3) * smoothstep(1., 2., fmax * 12.8);
    float dd2 = length(cf2 - (vec2(k2, k1) - .5) * .5);
    col += mix(uSunCol, uCrest, k2) * (2. + 5. * k1 * k1) * on * (1. - smoothstep(.15, .3, dd2)) * (1. - sh) * (1. - cup) * uSparkle;
  }
  return airHaze(col, p, dist);
}
`;function Qe(e){const t=r=>new u.Color(r);return{uSun:{value:new u.Vector3(1,.07,0)},uSunH:{value:new u.Vector2(1,0)},uSinE:{value:.07},uTanE:{value:.07},uSunCol:{value:t(e.sun)},uShade:{value:t(e.shade).multiplyScalar(e.shadeK)},uShadeDeep:{value:t(e.deep).multiplyScalar(e.shadeK)},uCrest:{value:t(e.crest)},uHaze:{value:t(e.haze).multiplyScalar(e.hazeK)},uSkyTop:{value:t(e.sky).multiplyScalar(e.hazeK)},uCam:{value:new u.Vector3(0,3,0)},uTime:{value:0},uSparkle:{value:1},uDrift:{value:1},uRes:{value:new u.Vector2(800,450)},uHedge:{value:new u.Vector4(0,-350,1,0)},uWind:{value:new u.Vector2(.921,-.389)},uBirch:{value:null},uBelt:{value:t(e.belt||"#000000")},uNight:{value:e.night||0},uGlare:{value:e.glare??1},uDark:{value:t(e.dark)},uStreak:{value:1},uLift:{value:40},uRingDrop:{value:0},uMoon:{value:e.night?1:0},uDawn:{value:new u.Color(0,0,0)},uDawnH:{value:new u.Vector2(1,0)},uCalm:{value:new u.Vector3(1e5,1e5,9)},uPatch:{value:[new u.Vector4(1e5,1e5,5,0),new u.Vector4(1e5,1e5,5,0)]},uGap:{value:new u.Color(1,.84,.62)},uSeamK:{value:1},uSeam:{value:new u.Vector4(0,0,0,-1)},uSeamQ:{value:0},uLevel:{value:1},uFoxA:{value:new u.Vector4(1e5,1e5,1e5,1e5)},uFoxB:{value:new u.Vector4(1e5,1e5,1e5,1e5)},uFoxK:{value:new u.Vector2(0,0)},uDr:{value:[0,1,2,3,4,5].map(()=>new u.Vector4(1e5,1e5,8,0))}}}function We(e,t,r,a){const h=new Float32Array(t*r),i=new Float32Array(t*r),l=1/(2*a+1);for(let d=0;d<r;d++){let H=0;const S=d*t;for(let g=-a;g<=a;g++)H+=e[S+Math.min(t-1,Math.max(0,g))];for(let g=0;g<t;g++)h[S+g]=H*l,H+=e[S+Math.min(t-1,g+a+1)]-e[S+Math.max(0,g-a)]}for(let d=0;d<t;d++){let H=0;for(let S=-a;S<=a;S++)H+=h[Math.min(r-1,Math.max(0,S))*t+d];for(let S=0;S<r;S++)i[S*t+d]=H*l,H+=h[Math.min(r-1,S+a+1)*t+d]-h[Math.max(0,S-a)*t+d]}return i}const K=e=>`rgb(${Math.round(255*ve(e))},0,0)`,Ve=e=>`rgb(0,${Math.round(255*ve(e))},0)`;function re(e,t,r,a){e.strokeStyle=a,e.lineWidth=r,e.lineCap="round",e.lineJoin="round",e.beginPath(),e.moveTo(t[0],t[1]);for(let h=2;h<t.length;h+=2)e.lineTo(t[h],t[h+1]);e.stroke()}function de(e,t,r,a,h,i,l){e.fillStyle=l,e.beginPath(),e.ellipse(t,r,a,h,i,0,6.2832),e.fill()}function Ge(e,t,r,a,h,i,l=.3){e.save(),e.translate(t,r),e.scale(a,h);const d=e.createRadialGradient(0,0,l,0,0,1);d.addColorStop(0,K(i)),d.addColorStop(1,"rgb(0,0,0)"),e.fillStyle=d,e.beginPath(),e.arc(0,0,1,0,6.2832),e.fill(),e.restore()}function De(e,t,r,a,h,i,l,d){e.fillStyle=d,e.beginPath();for(let H=0;H<i;H++){const S=H/i*6.2832,g=a*(1+h*(l()-.5)*2);H?e.lineTo(t+Math.cos(S)*g,r+Math.sin(S)*g):e.moveTo(t+Math.cos(S)*g,r+Math.sin(S)*g)}e.closePath(),e.fill()}const fe=[];fe[J.walk]=[e=>{re(e,[128,178,128,60],25,K(1)),re(e,[128,172,68,94],23,K(1)),re(e,[128,172,188,94],23,K(1)),re(e,[128,180,128,208],14,K(.6)),de(e,128,174,19,18,0,K(1))},4,.2],fe[J.run]=[e=>{re(e,[128,160,128,66],27,K(1)),re(e,[128,158,60,106],25,K(1)),re(e,[128,158,196,106],25,K(1)),de(e,128,160,23,22,0,K(1)),Ge(e,128,198,28,30,.2,.1)},4,.2],fe[J.paw]=[e=>{de(e,128,156,40,32,0,K(.85)),de(e,84,110,17,23,-.35,K(.9)),de(e,172,110,17,23,.35,K(.9)),de(e,111,78,16,23,-.1,K(1)),de(e,145,78,16,23,.1,K(1))},4,.3],fe[J.hind]=[e=>{de(e,128,128,62,100,0,K(.8)),de(e,128,70,46,40,0,K(.9))},3,.45],fe[J.fore]=[e=>{de(e,128,128,50,62,0,K(.95))},3,.35],fe[J.roost]=[(e,t)=>{for(let r=0;r<28;r++){const a=r/28*6.2832+t()*.2;if(Math.abs(a-4.712)<.6)continue;const h=67+t()*9;Re(e,128+Math.cos(a)*h*.86,134+Math.sin(a)*h,5+t()*4.5,a+1.5708,t,Ve(.3+t()*.45))}e.save(),e.translate(128,134),e.scale(.86,1),De(e,0,0,64,.09,20,t,K(.5)),De(e,0,3,48,.1,16,t,K(.3)),De(e,0,6,30,.12,12,t,K(.2)),e.restore(),re(e,[128,86,128,36],24,K(.3));for(let r=0;r<12;r++){const a=108+t()*40,h=16+t()*52,i=-1.57+(t()-.5)*1.3;re(e,[a,h,a+Math.cos(i)*9,h+Math.sin(i)*9],5,K(.3+t()*.35))}},3],fe[J.pit]=[e=>{de(e,128,128,34,48,0,K(.9))},4],fe[J.hollow]=[(e,t)=>{De(e,128,128,78,.1,22,t,K(.55)),Ge(e,128,138,60,56,.4,.2),de(e,128,60,26,20,0,K(.3)),de(e,96,66,14,18,0,K(.35)),de(e,160,66,14,18,0,K(.35))},4],fe[J.seam]=[e=>{re(e,[128,-20,128,276],70,K(.55)),re(e,[128,-20,128,276],30,K(.3))},5],fe[J.blob]=[e=>{Ge(e,128,128,108,122,1,.45)},2,-1],fe[J.feather]=[e=>{de(e,128,122,46,102,0,K(.55)),re(e,[128,216,128,250],7,K(.8));for(let t=0;t<7;t++){const r=44+t*25;re(e,[86,r+15,128,r,170,r+15],10,K(.45))}e.globalCompositeOperation="source-atop",de(e,128,26,40,22,0,K(1)),e.globalCompositeOperation="lighter"},1,-1],fe[J.scuff]=[(e,t)=>{for(let r=0;r<90;r++){const a=40+t()*176,h=30+t()*196,i=t()*6.28;re(e,[a,h,a+Math.cos(i)*9,h+Math.sin(i)*9],5,K(.4+t()*.6))}},2],fe[J.drag]=[e=>{re(e,[124,40,120,100,134,170,128,216],46,K(.8))},7];function Re(e,t,r,a,h,i,l){const d=4+Math.floor(i()*3),H=Math.cos(h),S=Math.sin(h),g=i()*6.2832;e.fillStyle=l,e.beginPath();for(let _=0;_<d;_++){const j=g+(_+i()*.6)/d*6.2832,s=a*(.6+i()*.6),p=Math.cos(j)*s*1.5,D=Math.sin(j)*s*.8;_?e.lineTo(t+p*H-D*S,r+p*S+D*H):e.moveTo(t+p*H-D*S,r+p*S+D*H)}e.closePath(),e.fill()}fe[J.trough]=[e=>{re(e,[128,92,124,130,131,168,127,200],54,K(.3)),re(e,[128,96,125,130,130,166,127,192],40,K(.3)),re(e,[128,100,126,140,129,176],22,K(.25)),re(e,[128,204,133,238],9,K(.3))},6],fe[J.crater]=[(e,t)=>{for(let r=0;r<26;r++){const a=-1.5708+(t()-.5)*3.5,h=2+Math.floor(t()*4);let i=58+t()*8;for(let l=0;l<h;l++){const d=(5.4-l*.8)*(.6+t()*.7);Re(e,128+Math.cos(a)*i,132+Math.sin(a)*i*.95,d,a,t,Ve(.7-l*.1)),i+=d*2.6+t()*7}}for(let r=0;r<16;r++){const a=r/16*6.2832+t()*.25,h=52+t()*6;t()<.3||Re(e,128+Math.cos(a)*h,132+Math.sin(a)*h*.94,4.5+t()*3.5,a+1.5708+(t()-.5)*.8,t,Ve(.3+t()*.4))}De(e,128,132,46,.2,19,t,K(.55)),De(e,128,130,33,.24,13,t,K(.3)),De(e,130,124,15,.3,9,t,K(.2));for(let r=0;r<4;r++)de(e,106+r*15+t()*5,150+t()*14-(r===1||r===2?34:0),6,9,0,K(.3))},2],fe[J.dint]=[(e,t)=>{for(const r of[-1,1]){const a=128+r*19;de(e,a,112,14,27,r*.14,K(.7)),de(e,a,118,9,17,r*.14,K(.3)),re(e,[a,96,a+r*12,70],6,K(.8)),re(e,[a,96,a-r*1,66],6,K(.8)),re(e,[a,96,a-r*11,74],5,K(.7))}for(let r=0;r<18;r++){const a=1.5708+(t()-.5)*1.3,h=46+70*Math.pow(t(),1.4),i=3.6*(1-h/170)*(.5+t());Re(e,128+Math.cos(a)*h*.9,116+Math.sin(a)*h,i,a,t,Ve(.3+t()*.4))}},2];async function Je(e){const t=e.rng.fork("atlas"),r=1024,a=256,h=new Uint8Array(r*r*4),i=document.createElement("canvas");i.width=i.height=a;const l=i.getContext("2d",{willReadFrequently:!0});for(let H=0;H<16;H++){l.globalCompositeOperation="source-over",l.fillStyle="#000",l.fillRect(0,0,a,a),l.globalCompositeOperation="lighter",fe[H][0](l,t);const S=l.getImageData(0,0,a,a).data,g=new Float32Array(a*a),_=new Float32Array(a*a);for(let o=0;o<a*a;o++)g[o]=S[o*4]/255-.33*S[o*4+1]/255,_[o]=Math.min(1,Math.abs(g[o])*4);await e.yield();const j=fe[H][1],s=fe[H][2]||0;if(s>0)for(let o=0;o<a;o++){const w=1-s*ue(40,216,o);for(let q=0;q<a;q++)g[o*a+q]*=w}const p=new Float32Array(a*a);for(let o=0;o<a*a;o++)p[o]=Math.max(0,g[o]);const D=We(g,a,a,Math.max(1,j-2));await e.yield();const c=We(D,a,a,Math.max(1,j-2));await e.yield();const z=We(p,a,a,j+6);await e.yield();const $=We(z,a,a,j+6),M=new Float32Array(a*a);await e.yield();for(let o=0;o<a*a;o++)M[o]=c[o]>0&&s>=0?c[o]*(.36+.64*Math.min(1,$[o]*1.2)):c[o];const L=We(_,a,a,j+3);await e.yield();const F=We(L,a,a,j+3);await e.yield();const X=(H&3)*a,f=(H>>2)*a;for(let o=0;o<a;o++){o&&(o&63)===0&&await e.yield();for(let w=0;w<a;w++){const q=o*a+w,V=Math.max(0,w-1),C=Math.min(a-1,w+1),I=Math.max(0,o-1),G=Math.min(a-1,o+1),W=(M[o*a+C]-M[o*a+V])*256/(C-V),ae=-(M[G*a+w]-M[I*a+w])*256/(G-I),Y=Math.min(1,Math.min(w,a-1-w,o,a-1-o)/6),Q=((f+a-1-o)*r+X+w)*4,se=H===J.seam?Math.min(1,Math.min(w,a-1-w)/6):Y;h[Q]=Math.round(255*ve(.25+.75*M[q])),h[Q+1]=Math.round(255*ve(.5+W/96)),h[Q+2]=Math.round(255*ve(.5+ae/96)),h[Q+3]=Math.round(255*ue(.02,.3,F[q])*se)}}await e.yield()}const d=new u.DataTexture(h,r,r,u.RGBAFormat,u.UnsignedByteType);return d.generateMipmaps=!0,d.minFilter=u.LinearMipmapLinearFilter,d.magFilter=u.LinearFilter,d.anisotropy=4,d.needsUpdate=!0,d}const Ze=e=>`rgb(${Math.round(255*ve(e))},0,0)`,et=e=>`rgb(0,${Math.round(255*ve(e))},0)`;function Ne(e,t,r,a,h,i,l,d,H,S,g,_=0){const s=new Float32Array(13),p=new Float32Array(13),D=new Float32Array(13),c=new Float32Array(13),z=new Float32Array(13);let $=a,M=h;for(let f=0;f<=12;f++){const o=f/12,w=i+l*o;s[f]=$,p[f]=M,D[f]=-Math.sin(w),c[f]=Math.cos(w),z[f]=H*.5*Math.min(1,.3+2.4*o)*Math.pow(Math.max(0,1-o*o*o),.75)*ue(_-.02,_+.25,o+.001),$+=Math.cos(w)*d/12,M+=Math.sin(w)*d/12}const L=f=>{const o=e.createLinearGradient(s[0],p[0],s[12],p[12]);return _>0?(o.addColorStop(0,t(0)),o.addColorStop(_,t(0)),o.addColorStop(Math.min(.98,_+.3),t(g*f))):(o.addColorStop(0,t(S*f)),o.addColorStop(.5,t(g*f))),o.addColorStop(1,t(g*f*.95)),o};e.globalCompositeOperation="lighten";for(const f of[[1,.5],[.8,1]]){e.fillStyle=L(f[1]),e.beginPath(),e.moveTo(s[0]+D[0]*z[0]*f[0],p[0]+c[0]*z[0]*f[0]);for(let o=1;o<=12;o++)e.lineTo(s[o]+D[o]*z[o]*f[0],p[o]+c[o]*z[o]*f[0]);for(let o=12;o>=0;o--)e.lineTo(s[o]-D[o]*z[o]*f[0],p[o]-c[o]*z[o]*f[0]);e.closePath(),e.fill()}e.globalCompositeOperation="multiply",e.strokeStyle=r,e.lineWidth=5,e.beginPath();const F=Math.ceil(_*12);e.moveTo(s[F],p[F]);for(let f=F+1;f<=12;f++)e.lineTo(s[f],p[f]);e.stroke();const X=f=>{const o=Math.min(11.999,Math.max(0,f/(d/12))),w=Math.floor(o);return ee(z[w],z[w+1],o-w)};e.lineWidth=6,e.lineCap="butt",e.beginPath();for(let f=_*d+24;f<d*.96;f+=56){const o=f/(d/12),w=Math.min(11,Math.floor(o)),q=o-w,V=ee(s[w],s[w+1],q),C=ee(p[w],p[w+1],q),I=i+l*(f/d);let G=(X(f)-3)/.342;if(G=Math.min(G,(X(f+G*.94)-3)/.342),G=Math.min(G,(X(f+G*.94)-3)/.342),G>13)for(const W of[-1,1]){const ae=I+W*.349,Y=Math.cos(ae),Q=Math.sin(ae);e.moveTo(V+Y*9,C+Q*9),e.lineTo(V+Y*G,C+Q*G)}}e.stroke()}async function Ye(e,t,r,a,h,i){const l=i?.8:1,d=i?.07:.035,H=[230,640+(i?14:0)],S=[540,i?512:492],g=[830-(i?30:0),600],_=s=>[(1-s)*(1-s)*H[0]+2*s*(1-s)*S[0]+s*s*g[0],(1-s)*(1-s)*H[1]+2*s*(1-s)*S[1]+s*s*g[1]];t.globalCompositeOperation="lighten",t.lineCap="round";for(let s=0;s<16;s++){const p=_(.12+s/16*.88),D=_(.12+(s+1)/16*.88);t.strokeStyle=a(l*ee(.03,.3,s/15)),t.lineWidth=ee(30,64,s/15),t.beginPath(),t.moveTo(p[0],p[1]),t.lineTo(D[0],D[1]),t.stroke()}await e.yield();for(let s=0;s<12;s++){const p=(s+.5)/12,D=_(.06+p*.9),c=Math.pow(p,1.5);Ne(t,a,h,D[0],D[1]+14,ee(1.78,1.2,p)+r.range(-d,d),-.1,ee(210,330,p)*r.range(.93,1.07),100,l*ee(.02,.22,c),l*ee(.07,.62,c)*(i?r.range(.6,1.1):r.range(.9,1.05))),s%4===3&&await e.yield()}const j=i?[2+Math.floor(r()*2),5+Math.floor(r()*2),8]:[];for(let s=0;s<10;s++){const p=s/9,D=ee(.9,-.5,Math.pow(p,.9))+r.range(-d,d),c=ee(430,960,ue(0,.8,p))*(1-.07*ue(.8,1,p))*r.range(.96,1.04),z=j.includes(s)?r.range(.2,.25):0;Ne(t,a,h,g[0]+p*90,g[1]-p*40,D,-.2+r.range(-.05,.05),c,ee(112,96,p),l*.3,l*ee(.8,1,p)*(z?.7:1)*(i?r.range(.75,1.1):1),z),s%3===2&&await e.yield()}}async function tt(e){const a=document.createElement("canvas");a.width=2048,a.height=1024;const h=a.getContext("2d");h.fillStyle="#000",h.fillRect(0,0,2048,1024);const i=e.rng.fork("wing");await e.yield(),await Ye(e,h,i,Ze,"rgb(205,255,255)",!1),await e.yield(),await Ye(e,h,i,et,"rgb(255,205,255)",!0),await e.yield(),h.globalCompositeOperation="source-over";const l=new u.CanvasTexture(a);return l.generateMipmaps=!0,l.minFilter=u.LinearMipmapLinearFilter,l.magFilter=u.LinearFilter,l.anisotropy=4,l}const ke=`
uniform mat4 uPage; uniform vec4 uCurl; uniform vec3 uCurlK; uniform vec3 uEye;
float gTh;
vec3 curl(vec3 l){
  vec2 T = uCurl.zw; float al = dot(l.xz - uCurl.xy, T), a = al - uCurlK.x; gTh = 0.;
  if (a <= 0. || uCurlK.z < 1e-4) return l;
  float R = uCurlK.y, th = min(a / R, uCurlK.z), s = sin(th), c = cos(th), rest = a - R * th;
  gTh = th;
  float al2 = uCurlK.x + R * s + rest * c + l.y * s, y2 = -R * (1. - c) - rest * s + l.y * c;
  return vec3(l.x + T.x * (al2 - al), y2, l.z + T.y * (al2 - al));
}
// the lens as the snow at the turned point lb sees it, in the page's own unturned axes: light, glitter and veil then know
// how low the gaze lies there (call curl first: it leaves the turn in gTh)
vec3 curlView(vec3 lb){
  vec3 v = (uEye - (uPage * vec4(lb, 1.)).xyz) * mat3(uPage);
  vec2 T = uCurl.zw; float al = dot(v.xz, T), s = sin(gTh), c = cos(gTh), al2 = al * c - v.y * s;
  return vec3(v.x + T.x * (al2 - al), al * s + v.y * c, v.z + T.y * (al2 - al));
}`,at=`${ke} varying vec3 vL, vV; void main(){ vec2 T = uCurl.zw;
  vec3 l = vec3(uCurl.x + T.x * position.z - T.y * position.x, 0., uCurl.y + T.y * position.z + T.x * position.x);
  vL = l; vec3 lb = curl(l); vV = curlView(lb); gl_Position = projectionMatrix * viewMatrix * uPage * vec4(lb, 1.); }`,ot=`precision highp float; varying vec3 vL, vV;
${Se}
void main(){
  vec2 p = vL.xz; vec2 fw = fwidth(p);
  vec3 d = vV; float dist = length(d) + 1e-4;
  gl_FragColor = vec4(snowShade(p, fw, vec2(0.), 0., 0., d / dist, dist), 1.);
}`,nt=`${ke}
attribute vec4 aA, aB;
uniform vec2 uRes, uSunH; uniform vec3 uCam; uniform float uTanE;
varying vec2 vUv, vP; varying vec4 vI, vAx; varying vec3 vS, vV;
void main(){
  float rot = aA.z, age = aA.w; vec2 size = aB.xy, c = aA.xy;
  vec2 fwd = vec2(-sin(rot), -cos(rot));
  if (age > 4.5) c -= uSunH * .17;                                       // a thin thing's shadow lies beside it
  if (age > 2.5 && age < 3.5) { fwd = -uSunH; size.y = aB.y / max(uTanE, .03); c += fwd * size.y * .42; }
  vec2 rt = vec2(-fwd.y, fwd.x);
  float dist = length(vec3(c.x, 0., c.y) - uCam);
  float pm = dist * 2. / (projectionMatrix[1][1] * uRes.y);                 // metres per pixel at that distance
  float graze = clamp(abs(uCam.y) / max(dist, .1), .02, 1.);
  float kx = max(1., 2.5 * pm / size.x), ky = min(max(1., 1.5 * pm / (size.y * graze)), 30.);
  vec2 q = position.xy * size * vec2(kx, ky);
  vec2 p = c + rt * q.x + fwd * q.y;
  vUv = uv; vP = p; vAx = vec4(rt, fwd); vS = vec3(size, 1. / (kx * ky));
  vI = vec4(aB.z, aB.w, age, smoothstep(1.15, 2.2, max(kx, ky)));
  // where the page turns a flat stamp would cut under the round of the snow: it rides a hand higher there
  float lift = .13 * smoothstep(0., 1.5, dot(p - uCurl.xy, uCurl.zw) - uCurlK.x) * step(1e-4, uCurlK.z);
  vec3 lb = curl(vec3(p.x, .02 + lift, p.y)); vV = curlView(lb);
  gl_Position = projectionMatrix * viewMatrix * uPage * vec4(lb, 1.);
}`,st=`precision highp float;
uniform sampler2D uTex; uniform vec2 uSlopeK; uniform vec3 uDark; uniform vec4 uWing; uniform float uPlant;   // uPlant 1: the wind's work round a plant (not a print: it is not kept as a blue dash from far off)
varying vec2 vUv, vP; varying vec4 vI, vAx; varying vec3 vS, vV;
${Se}
#ifdef WING
// depth of the wing print at quad uv: the deep wing (red) on the seed's side, the lighter one (green) on the other
float gD(vec2 uv, float bias){
  float side = step(.5, uv.x); vec2 w = vec2(abs(uv.x - .5) * 2., uv.y);
  // smeared (the fox did not miss): the print dragged a hand's width and blurred, never redrawn
  vec4 t = texture2D(uTex, clamp(w + vec2(.02, -.05) * uWing.y * (.4 + .6 * w.x), .002, .998), bias + 1.3 * uWing.y);
  // ...and its feathers pulled into streaks toward the body, where the crater is
  t = max(t, max(texture2D(uTex, clamp(w + vec2(.06, -.03) * uWing.y, .002, .998), bias + 1.3) * .8, texture2D(uTex, clamp(w + vec2(.13, -.05) * uWing.y, .002, .998), bias + 2.) * .55) * uWing.y);
  float d = mix(t.r, t.g, abs(side - uWing.z));
  d *= 1. - uWing.y * .45 * (1. - smoothstep(.05, .5, w.x));
  return d * mix(1., step(.5, mix(1. - uv.x, uv.x, uWing.z)), uWing.x);
}
#else
vec4 atl(vec2 uv){ float g = floor(vI.y + .5); vec2 cell = vec2(mod(g, 4.), floor(g / 4.)); return texture2D(uTex, (cell + clamp(uv, .012, .988)) * .25); }
float gD(vec2 uv, float bias){ return (atl(uv).r - .25) / .75; }
#endif
void main(){
  vec2 fw = fwidth(vP);
  float age = vI.z, soften = age < 1.5 ? 1. - .7 * age : 1.;
  float isFlat = step(4.5, age), isThread = step(3.5, age) * (1. - isFlat), isShadow = step(2.5, age) * (1. - step(3.5, age)) + isFlat, isDark = step(1.5, age) * (1. - step(2.5, age)), mark = 1. - step(1.5, age);
  vec2 rt = vAx.xy, fwd = vAx.zw;
  // crumble: the edge of a mark in wind-packed snow is never a clean curve (gone where it would crawl)
  float cr = (1. - smoothstep(.012, .05, max(fw.x, fw.y))) * mark;
  vec2 jit = (vec2(vnoise(vP * 13.), vnoise(vP * 13. + 23.1)) - .5) * .05 + (vec2(vnoise(vP * 41.), vnoise(vP * 41. - 9.3)) - .5) * .02;
  vec2 uv = vUv + vec2(dot(jit, rt), dot(jit, fwd)) * cr / vS.xy;
#ifdef WING
  float press = .62 + .7 * vnoise(vP * .75 + 4.1);                     // the powder did not take the wing evenly
  float D = gD(uv, 0.) * press;
  vec2 e = vec2(2.5 / 2048., 5. / 1024.);                              // five texels either way, from the next mip: eight bits of depth are not enough at one texel
  vec2 sl = vec2(gD(uv + vec2(e.x, 0.), 1.) - gD(uv - vec2(e.x, 0.), 1.), gD(uv + vec2(0., e.y), 1.) - gD(uv - vec2(0., e.y), 1.)) * press / (2. * e);
  float cover = smoothstep(.004, .045, gD(uv, 2.6));
#else
  float press = 1.;
  vec4 t = atl(uv);
  float D = (t.r - .25) / .75, cover = t.a;
  vec2 sl = (t.gb - .5) * 2. * uSlopeK;                                // dD/du, dD/dv
#endif
  float depthM = vI.x * soften, msz = min(vS.x, vS.y);
  sl *= smoothstep(.0, .06, abs(D));                                   // the skirt of a mark takes no light: no halo round a print
  vec2 bend = -(rt * sl.x / vS.x + fwd * sl.y / vS.y) * depthM;        // dh/dx, dh/dz of the print in field space
  vec2 sq = vec2(dot(uSunH, rt), dot(uSunH, fwd)) / vS.xy;             // one metre toward the sun, in uv
#ifdef WING
  // the grooves' own cast shadow: three taps toward the sun; in shadow if the snow there is higher than the sun's ray
  float reach = uTanE * 2.5;     // an artist's sun inside a print: its shadow reaches two fifths as far, so the far wall is lit
  float Ds = gD(uv + sq * .07, 0.) * press;                            // the snow 7 cm toward the sun
  float shIn = smoothstep(0., .03, (D - Ds) * depthM - .07 * reach);
  shIn = max(shIn, smoothstep(0., .04, (D - gD(uv + sq * .2, 0.) * press) * depthM - .2 * reach));
  shIn = max(shIn, smoothstep(0., .05, (D - gD(uv + sq * .6, 0.) * press) * depthM - .6 * reach));
  shIn = max(shIn, smoothstep(.16, .5, D * min(depthM * 4., 1.)) * (1. - smoothstep(.02, .2, Ds - D)));
  float small = 0.;
#else
  // a print is a hollow under raking light. An artist's sun: the wall that hides the sun lays a shadow whose length is a
  // share of the print (longer in a deeper mark), graded out across the floor; the far slope stands in the light
  float L = .44 * clamp(depthM / .2, .8, 2.) * (.07 / max(uTanE, .03));   // ...and it shortens as the light climbs (as now at 4 degrees)
  float Ds = gD(uv + sq * .06 * msz, 0.), D2 = gD(uv + sq * .15 * msz, 0.), D3 = gD(uv + sq * .32 * msz, 0.);
  float shIn = smoothstep(-.04, .22, D - Ds - .06 / L);
  shIn = max(shIn, smoothstep(-.06, .3, D - D2 - .15 / L));
  shIn = max(shIn, smoothstep(-.08, .36, D - D3 - .32 / L));
  shIn = max(shIn, smoothstep(.72, 1., D) * (1. - smoothstep(.02, .2, Ds - D)));
  // a print too small on screen to model is one dark hollow (the far threads keep their weight)
  float small = smoothstep(.04, .11, min(fw.x, fw.y) / msz) * (1. - uPlant);   // (a print's rule: the wind's work round a plant never gains weight with distance)
  shIn = max(shIn, small * smoothstep(.1, .4, D));
#endif
  float cup = clamp(D * 1.15, 0., 1.) * soften, mask = clamp(D, 0., 1.);
  shIn = mix(shIn * (1. - .45 * age * mark), mask, isShadow); bend *= mark; cup *= mark;
  float ripW = mix(mix(.8, .85, uLevel), .34, uMoon);                 // the weight of a ripple's shadow (as in snowShade)
  shIn = mix(shIn, mix(shIn * ripW, ripW, isShadow), uPlant);   // a plant's shadow lies across the ripples and is as deep as theirs at most (the ripple shadow's own weight in snowShade), never a print's (its shape is its cover alone), and so is the shadow inside the wind's work round it: a scour and a drift tail are ripple-sized forms
  vec3 d = vV; float dist = length(d) + 1e-4; vec3 V = d / dist;
  float far0 = vI.w * (1. - isShadow);
  // the sun-side wall falls into the deepest blue: the dark of a print gathers under the wall that hides the sun
  float wallS = clamp((D - Ds) * 2.2, 0., 1.) * mark * (1. - uPlant);   // (a print's rule: beside a drift tail it drew a navy line)
  gWindForm = uPlant;
  vec3 col = snowShade(vP, fw, bend, min(cup * mix(.12, 1., max(shIn, small)) + wallS * .5, 1.), shIn, V, dist);
  col *= 1. - .2 * wallS * cup;
  col *= mix(vec3(1.), vec3(.95, .8, .58), cup * (1. - shIn) * mark * (1. - uPlant));   // what light reaches the floor of a hollow is the gold of the far slope, never white (a print's rule: the wind's scour round a plant is lit as the snow is)
  cover *= mix(1., smoothstep(.015, .07, abs(D)), mark);               // the flat skirt of a stamp is not drawn: prints that overlap join, they do not cut each other
  float a = mix(cover, mix(mask, smoothstep(.1, .4, D), isDark) * .92, max(isShadow, isDark));
  // the far wall and its lip catch the sun: a gold crescent on the down-sun side of every cup, and nowhere else
  float faces = smoothstep(.0, .06, -dot(bend, uSunH));               // only a wall that rises away from the sun
  float rim = smoothstep(.04, .28, Ds - D) * smoothstep(.02, .1, D) * (1. - smoothstep(.25, .6, D)) * faces * mark * soften * (1. - far0) * (1. - small) * (1. - uPlant);   // (a print's crescent: the wind's scour round a plant has none)
  col = mix(col, (uSunCol * vec3(1.1, .8, .42) + uDawn * vec3(.9, .8, .6)) * .95, rim * .8 * exp(-dist / 900.));   // gold, not white: the colour stays in the highlight
  // spindrift pours into a cup over its windward lip in gusts
  vec2 wq = vec2(dot(uWind, rt), dot(uWind, fwd)) / vS.xy;
  float lee = clamp(D - gD(uv - wq * .25, 0.) * press, 0., 1.) * (1. - smoothstep(.1, .6, D)) * mark * (1. - far0);
  vec2 ww = wr(vP);
  col += (uSunCol * .5 + uShade * .7) * lee * smoothstep(.55, .9, vnoise(vec2(ww.x * .9 - uTime * 5., ww.y * 3.))) * .35 * uDrift;
  col = mix(col, mix(mix(uDark * 1.6 + uSunCol * .2 + uShade * .1, uDark, smoothstep(.6, .82, D)), uHaze, 1. - exp(-dist / 900.)), isDark * .94);
  // far: a print too small to draw becomes a flat blue dash of the right average tone
  vec3 flatC = mix(col, mix(uShade, uHaze, 1. - exp(-dist / 900.)), .7);
  col = mix(col, flatC, far0); a = mix(a, .55 * sqrt(vS.z) * (1. - uPlant * (1. - isShadow)), far0);
  col = mix(col, flatC, isThread); a = mix(a, cover * .55 * smoothstep(.12, .5, max(fw.x, fw.y)), isThread);   // a far line of prints: one blue thread, gone when the prints themselves can be seen
  // the wind's work round a plant and the plant's shadow fade with the plant: by true area over drawn area where the
  // quad was widened to stay a pixel, and out where a pixel is wider than a quarter to a half of the stamp
  a *= mix(1., vS.z * (1. - smoothstep(.25, .5, max(fw.x, fw.y) / vS.x)), uPlant);
  gl_FragColor = vec4(col, a);
}`;function it(e,t,r){return new u.ShaderMaterial({uniforms:{...e,uTex:{value:t},uSlopeK:{value:r?new u.Vector2(205,51.2):new u.Vector2(96,96)},uWing:{value:new u.Vector4(0,0,0,0)},uPlant:{value:0}},defines:r?{WING:1}:{},vertexShader:nt,fragmentShader:st,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}function Ie(e,t,r,a,h){const i=new u.PlaneGeometry(1,1),l=new u.InstancedBufferGeometry;l.index=i.index,l.setAttribute("position",i.attributes.position),l.setAttribute("uv",i.attributes.uv);const d=new Float32Array(a*4),H=new Float32Array(a*4);for(let g=0;g<a;g++)d[g*4]=r[g*8],d[g*4+1]=r[g*8+1],d[g*4+2]=r[g*8+2],d[g*4+3]=r[g*8+7],H[g*4]=r[g*8+3],H[g*4+1]=r[g*8+4],H[g*4+2]=r[g*8+5],H[g*4+3]=r[g*8+6];l.setAttribute("aA",new u.InstancedBufferAttribute(d,4)),l.setAttribute("aB",new u.InstancedBufferAttribute(H,4)),l.instanceCount=a;const S=new u.Mesh(l,it(e,t,h));return S.frustumCulled=!1,S}const Be="vec3 hazed(vec3 c, float dist){ return mix(c, uHaze, 1. - exp(-dist / 900.)); }",Ee=`${ke} uniform mat4 uLocal; varying vec2 vUv; varying vec3 vL; void main(){ vUv = uv; vL = (uPage * vec4(curl((uLocal * vec4(position, 1.)).xyz), 1.)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vL, 1.); }`,Ue=`precision highp float; varying vec2 vUv; varying vec3 vL; uniform vec3 uDark; uniform vec3 uEye; uniform sampler2D uTex; uniform vec4 uOpt, uFrame;
${Se}${Be}
void main(){
  float X = (vUv.x - .5) * 520., Y = vUv.y * 26., Xn = X + uOpt.y;
  float top = hedgeRaw(Xn) * (1. - .8 * smoothstep(150., 256., abs(X)) * uOpt.z);
  float v1 = Y / (24. * clamp(top / 19., .7, 1.2)), v2 = Y / (26. * clamp(top / 19., .7, 1.2));
  vec2 uv1 = vec2(Xn / 96., min(v1, 1.) * .985 + .006);
  vec4 t = texture2D(uTex, uv1);
  vec4 t2 = texture2D(uTex, vec2(Xn / 112. + .37, min(v2, 1.) * .985 + .006));
  vec2 ex = vec2(uFrame.x, -uFrame.y), ez = vec2(uFrame.y, uFrame.x);
  float sx = dot(uSunH, ex), front = max(dot(uSunH, ez), 0.);
  float aS = texture2D(uTex, uv1 + vec2(sx > 0. ? .0011 : -.0011, .003)).a;
  float edge = clamp((t.a - aS) * 2.2, 0., 1.);                        // the side of each stem that faces the sun
  // the skyline: each stem ends at its own height
  float cut1 = top * (.8 + .34 * vnoise(vec2(Xn * .45, 2.))), cut2 = top * (1.04 + .16 * vnoise(vec2(Xn * .21, 8.)));
  float th1 = smoothstep(cut1 - 3., cut1, Y), th2 = smoothstep(cut2 - 3., cut2, Y);                          // only the stoutest stems reach the top: a ragged hedge top, not spires
  float a1 = t.a * smoothstep(th1 * .9, th1 * .9 + .3, t.a + .001) * (1. - th1 * th1 * th1), a2 = t2.a * smoothstep(th2 * .9, th2 * .9 + .3, t2.a + .001) * (1. - th2 * th2 * th2) * .7;
  float body = (1. - smoothstep(.2, .62, v1 + (vnoise(vec2(Xn * .3, Y * .5)) - .5) * .4)) * .96;          // the dark heart of the thicket
  // the gap: the thicket stops, its loose twigs go on and arch over the opening
  float e = abs(X) - 8.3 + (vnoise(vec2(Y * .5, X * .3)) - .5) * 3.2 + 3.4 * smoothstep(6., 15., Y) * vnoise(vec2(Y * .35 + 7., X > 0. ? 3. : 11.));
  float gB = mix(1., smoothstep(.6, 3., e), uOpt.x), gT = mix(1., smoothstep(-1.8, .5, e + (t.a - .5) * 2.4), uOpt.x);
  float ends = 1. - smoothstep(240., 258., abs(X));
  float af = max(a1 * gT, body * gB) * ends, ab = a2 * gB * ends;
  float a = af + ab * (1. - af);
  // the foot: snow lies banked against the stems in hummocks (no ruled line where the dark meets the field)...
  float bank = .5 + 1.9 * vnoise(vec2(Xn * .09, 1.3)) + 1.1 * vnoise(vec2(Xn * .37, 6.1)) + .5 * vnoise(vec2(Xn * 1.3, 2.2));
  a *= smoothstep(bank - .25, bank + .9, Y + .5 * t.a);
  if (a < .01) discard;
  vec3 wood = uDark * (.8 + .5 * v1 + .4 * front) + uShade * .05 + uSunCol * (.03 + .16 * front) * v1;
  vec3 frost = uSunCol * (.3 * abs(sx) + .6 * front) + uShade * .34;
  vec3 c1 = mix(wood, frost, t.r * (.08 + .7 * v1 * v1));
  c1 += uSunCol * vec3(1.05, .86, .58) * edge * (.25 + .75 * smoothstep(.1, .8, v1)) * .8 * (1. - body * .8);
  vec3 c2 = mix(mix(uDark * 1.3, uShade, .22), uHaze, .5);            // the row behind stands in haze
  vec3 col = mix(c2, c1, af / max(a, 1e-3));
  // ...and cold ground mist stands in front of it, two metres deep, thicker in places, drifting: the foot melts into the field, the hedge above it is the dark of the picture
  // (under the moon the mist stands deeper, three to six metres: it is what lifts the wood, which no key reaches there, off black)
  float mistN = vnoise(vec2(Xn * .045 + uTime * .05, 4.4));
  float mist = exp(-max(Y - bank, 0.) / mix(1.5 + 1.0 * mistN, 3.2 + 2.6 * mistN, uMoon)) * (.5 + .5 * vnoise(vec2(Xn * .13 - uTime * .09, Y * .3 + 2.)));
  col = mix(col, uSunCol * .4 + uShade * .62 + uDawn * .55, min(mist * .95, .9));
  gl_FragColor = vec4(hazed(col, distance(vL, uEye) * .55), a);        // the only dark in the picture keeps its weight from across the field
}`,rt=`precision highp float; varying vec2 vUv; varying vec3 vL; uniform vec3 uDark; uniform vec3 uEye; uniform sampler2D uTex; uniform float uFlip;
${Se}${Be}
void main(){
  vec4 t = texture2D(uTex, vUv, -.6); float a = min(t.a * 1.5, 1.);
  a *= smoothstep(0., .14, vUv.x) * (1. - smoothstep(.86, 1., vUv.x)) * (1. - smoothstep(.9, 1., vUv.y));   // the crown is a card: its haze of fine twigs dies away toward the card's sides and top, so no edge of it stands in the sky
  if (a < .03) discard;
  float sx = dot(uSunH, vec2(uHedge.z, -uHedge.w)), front = max(dot(uSunH, vec2(uHedge.w, uHedge.z)), 0.);
  float rnd = (t.g * 2. - 1.) * uFlip;                                 // -1 at the stem's left edge, +1 at its right
  float sxe = sx < 0. ? min(sx, -.6) : max(sx, .6);                     // an artist's sun: the stem is round whatever the hour
  float lit = clamp(.4 + .9 * rnd * sxe + .25 * front, 0., 1.); lit = lit * lit * (3. - 2. * lit);   // a round stem: a lit edge, a core shadow, a shaded edge
  float bark = smoothstep(.25, .8, t.r);
  vec3 alb = mix(uDark * 1.15 + vec3(.01), vec3(.74, .72, .7), bark);
  vec3 col = alb * (uShade * (.55 + .3 * bark) * (1. - .45 * (1. - lit) * (1. - rnd * rnd)) + uSunCol * vec3(1.05, .9, .7) * lit * (.6 * bark + .3));
  col += mix(uSunCol, uCrest, .6) * .17 * (1. - bark) * (.3 + .7 * vUv.y) * (abs(sx) * .6 + front);          // rime on the fine twigs
  col = mix(col, uHaze, .5 * exp(-vUv.y * 72. / 2.4));
  gl_FragColor = vec4(hazed(col, distance(vL, uEye)), a);
}`,lt="varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",Ke=`uniform vec3 uSkyTop, uBelt; uniform float uNight, uGlare;
vec3 skyCol(vec3 d){
  float y = max(d.y, 0.), hl = length(d.xz);
  vec2 hd = d.xz / max(hl, 1e-3);
  float toSun = dot(hd, uSunH), away = 1. - smoothstep(-.85, .1, toSun);
  vec3 col = mix(uHaze, uSkyTop, smoothstep(0., .64, y));
  col += uSunCol * (.06 + .13 * toSun) * exp(-y * 6.);                 // the sun's side of the horizon is the gold side
  float by = (y - .12) / .075;
  col += uBelt * exp(-by * by) * away;                                 // the far side carries the rose belt...
  col *= 1. - .16 * exp(-y * 20.) * away;                              // ...over the blue-grey shadow of the earth
  float ci = smoothstep(.45, .85, vnoise(vec2(d.x * 4. + d.z * 2.3, y * 36.))) * exp(-y * 8.) * smoothstep(.012, .07, y);
  col += uSunCol * ci * (.035 + .03 * toSun);                          // a breath of ice haze low down, nothing more
  col = mix(col, uSunCol * .4 + uShade * .62 + uDawn * .55, .75 * exp(-y * 34.));   // blown snow stands a hand high along the whole horizon: the field has no ruled edge
  float s = max(dot(d, uSun), 0.), s2 = s * s, s8 = s2 * s2 * s2 * s2;
  // first light: a peach line on the horizon under a rose breath, widest toward where the sun will come up
  float dw = smoothstep(-.6, .9, dot(hd, uDawnH)), dl = dot(uDawn, vec3(.3, .5, .2));
  col += uDawn * dw * exp(-y * 9.) + uDawn * vec3(.75, .42, 1.25) * dw * .34 * exp(-y * 3.2);
  col += uDawn * ci * dw * .5;                                        // the ice haze low down takes it first
  // the disc: a sun is plain; the moon (uMoon) carries its seas and a soft limb
  vec3 mr = (d - uSun) * 26.; float seas = .58 + .5 * vnoise(mr.xy * 2.1 + mr.z + 3.7) * vnoise(mr.yx * .9 - 1.3) * 2.;
  col += uSunCol * ((.1 * (1. - uMoon) * s2 * s2 + mix(.22, .06, uMoon) * s8 + .5 * s8 * s8 * s8 * s8) * uGlare + 5. * smoothstep(.9994, .9998, s) * mix(1., seas * .8, uMoon));
  float hq = (s - .927) / .012;
  col += uSunCol * vec3(1., .8, .62) * exp(-hq * hq) * .09 * (1. - uMoon);            // diamond dust: the 22 degree halo and a sun pillar
  col += uSunCol * exp(-(1. - toSun) * 900.) * exp(-y * 5.) * .3 * step(0., toSun);
  if (uNight > .01) {
    vec2 c = d.xz / (1. + y) * 70.; vec2 ci2 = floor(c), cf = fract(c) - .5;
    float h = hash21(ci2), h2 = hash21(ci2 + 13.1);
    float star = step(.93, h) * (1. - smoothstep(.04, .1 + .12 * h2 * h2, length(cf - (vec2(h2, fract(h * 37.)) - .5) * .5)));
    col += vec3(.75, .84, 1.) * star * uNight * (1. - min(dl * dw * 2.4 * exp(-y * 2.), .9)) * (.5 + 1.6 * h2) * smoothstep(.04, .3, d.y) * (.75 + .25 * sin(uTime * (1. + 3. * h2) + h * 40.));
  }
  return col;
}`,ht=`precision highp float; varying vec3 vD;
${Se}${Ke}
void main(){ gl_FragColor = vec4(skyCol(vD / max(length(vD), 1e-4)), 1.); }`,ct=`${ke} uniform mat4 uLocal; varying vec3 vG, vL0; varying vec2 vUv; void main(){ vUv = uv; vL0 = (uLocal * vec4(position, 1.)).xyz; vec3 lb = curl(vL0); vG = -curlView(lb); gl_Position = projectionMatrix * viewMatrix * uPage * vec4(lb, 1.); }`,ut=`precision highp float; varying vec3 vG, vL0; varying vec2 vUv; uniform float uLift, uRingDrop; uniform vec3 uDark;
${Se}${Ke}
void main(){
  float Y = vUv.y * 26., X = (vUv.x - .5) * 18.;
  // where the ray through this point of the gap comes down on the snow beyond the hedge (the lens stands at vL0 - vG in the page's own axes)
  float eh = max(vL0.y - vG.y, .2), sg = eh / max(-vG.y, eh * .03); vec2 pg = vL0.xz + vG.xz * (sg - 1.), fwg = fwidth(pg);
  if (Y + (vnoise(vec2(X * .35, uTime * .25)) - .5) * 5. + 2.6 < uLift) discard;
  vec3 d = vG / max(length(vG), 1e-4);
  float gl = exp(-(X * X / 30. + (Y - 4.5) * (Y - 4.5) / 70.));
  float wisp = mix(1., .5 + .9 * vnoise(vec2(X * .22 - uTime * .12, Y * .55 + uTime * .05)) * vnoise(vec2(X * .6 + uTime * .2, Y * .2 - 3.)) * 2., uMoon);   // under the moon the mist is banded and drifts
  // through the gap: the sky beyond down to its horizon and the far snow under it, with the mist standing in front
  vec3 mistC = uSunCol * .4 + uShade * .62 + uDawn * .55;
  vec3 beyond = mix(skyCol(vec3(d.x, max(d.y, 0.), d.z)), mistC, 1. - smoothstep(-.012, .004, d.y));
  // under the moon the gap is an opening, not a pane: below the horizon it shows the very snow that lies beyond the hedge, shaded as the field is,
  // so the card has no foot and no sides to see
  beyond = mix(beyond, mix(snowShade(pg, fwg, vec2(0.), 0., 0., -d, length(vG) * sg), skyCol(vec3(d.x, max(d.y, 0.), d.z)), smoothstep(-.003, -.001, d.y)), uMoon);
  // (under the moon) a far line of trees on that horizon: there is country beyond the hedge, and the gap is a gate to it
  float tl = .006 + .016 * vnoise(vec2(d.x * 46. + d.z * 9., 4.)) + .008 * vnoise(vec2(d.x * 190., 7.));
  beyond = mix(beyond, mix(uDark, uHaze, .55), uMoon * (1. - smoothstep(tl - .004, tl + .002, d.y)) * smoothstep(-.006, .001, d.y) * .8 * (1. - smoothstep(4.5, 8.5, abs(X))));          // (no copy of it below the horizon: this is snow, not water)
  // the curtain is a card: at its sides and its foot it takes the tone of the hedge-foot mist beside it, so no edge of it shows
  float sf = 1. - smoothstep(4.4, 8.8, abs(X) + (vnoise(vec2(Y * .4, X * .2 + uTime * .06)) - .5) * 2.4), ft = smoothstep(-.5, 4.5, Y + (vnoise(vec2(X * .5 - uTime * .1, 3.3)) - .5) * 3.);
  float mh = exp(-max(Y - 2.5, 0.) / 6.) * (.8 + .2 * vnoise(vec2(X * .13 - uTime * .09, Y * .3 + 2.))) * 1.06;                        // the hedge beside it: dark stems in haze, mist at the foot
  vec3 side = mix(mix(mix(uDark * 1.3, uShade, .22), uHaze, .5), mistC, min(mh, .97));
  float kb = mix(mix(sf * mix(.45, 1., ft), 1., smoothstep(11., 19., Y)), 1., uMoon);   // above the hedge it is sky again (under the moon nothing stands at its sides: the opening shows what lies beyond, to its edge)
  vec3 col = mix(side, beyond, kb) + uGap * mix(.62 * gl + .2 * exp(-Y / 5.), .62 * gl * (.5 + .5 * wisp) + .24 * exp(-Y / 4.) * wisp, uMoon) * sf * mix(mix(.3, 1., ft), (1. - smoothstep(7., 9., abs(X))) * smoothstep(0., 5., Y), uMoon);   // (under the moon the light in the gap dies away to nothing at the card's sides and at its foot)
  // the ring's own glow reaches past the card on either side (the engine draws it round the ring; the card hides the part behind
  // itself, which left the card as a darker pane in a sheet of faint light): toward its sides the card carries the same breath
  // of light, so no edge of it shows. Under the moon. The copy is centred on the ring where it really stands behind the card:
  // at the gaze's height when the page is level, and uRingDrop metres lower while the page is pitched: far under the snow for
  // nearly all the flight, rising through the snow line with the ring's own glow over the last five metres before level
  float rr = max(length(vec2(X, Y - eh + uRingDrop)) - 6., 0.) / 6.;
  col += vec3(.62, .75, 1.) * (.4 * exp(-rr * 7.) + .048 * exp(-rr * 2.2)) * smoothstep(4.5, 9., abs(X)) * uMoon;
  gl_FragColor = vec4(col, 1.);      // the mist in the gap holds the light: the eye goes there
}`,dt=`${ke} varying vec3 vN, vL; void main(){ vN = normal; vL = position; gl_Position = projectionMatrix * viewMatrix * uPage * vec4(curl(position), 1.); }`,ft=`precision highp float; varying vec3 vN, vL;
${Se}${Be}
void main(){
  vec3 fx = dFdx(vL), fy = dFdy(vL), c = cross(fx, fy); float cl = length(c);
  vec3 n = cl > 1e-9 ? c / cl : vN / max(length(vN), 1e-4);            // a broken lump of crust: facets, not a pebble
  if (dot(n, uCam - vL) < 0.) n = -n;
  float lit = clamp(dot(n, uSun) * 2.6 + .1, 0., 2.3);
  gl_FragColor = vec4(hazed(mix(uShade, uShadeDeep, .5 - .5 * n.y) * (.7 + .3 * n.y) + mix(uSunCol, uCrest, .4) * lit * .5, distance(vL, uCam)), 1.);
}`,pt=`${ke} attribute vec3 aLean; attribute vec2 aT; uniform float uTime; varying float vT; varying vec3 vL;
void main(){ float t = aT.x; vec3 p = position + aLean * t * t + vec3(1., 0., .3) * t * t * (.05 * sin(uTime * 11. + aT.y) + .03 * sin(uTime * 4.3 + aT.y * 1.7) + .04);
  vT = t; vL = p; gl_Position = projectionMatrix * viewMatrix * uPage * vec4(curl(p), 1.); }`,$e="vec3 strawLight(float t){ return uShade * 1.2 + uSunCol * (.35 + .75 * t) + uDawn * .5 + uSunCol * vec3(.55, .42, .2) * uMoon * (.4 + .6 * t); }",vt=`precision highp float; varying float vT; varying vec3 vL; uniform vec3 uStraw;
${Se}${Be}${$e}
void main(){ gl_FragColor = vec4(hazed(uStraw * strawLight(vT), distance(vL, uCam)), 1.); }   // under the moon dry straw is pale in the moon's own light (no light of its own): still the one warm note on the page`,mt=`${ke} attribute vec3 aSeed; uniform vec3 uCam; uniform vec2 uRes; uniform float uTime; varying float vTw;
void main(){
  vec3 p = position + vec3(1.5, -.12, .2) * uTime;
  p.xz = mod(p.xz - uCam.xz + 40., 80.) - 40. + uCam.xz; p.y = mod(p.y, 16.) + .1;
  vec4 mv = viewMatrix * uPage * vec4(curl(p), 1.);
  float tw = sin(uTime * (2. + 5. * aSeed.x) + aSeed.y * 40. + dot(p, vec3(.7, 1.3, .5)) * 2.);
  vTw = smoothstep(.55, 1., tw) * smoothstep(1.5, 5., -mv.z) * (1. - smoothstep(30., 40., -mv.z));
  gl_PointSize = clamp(uRes.y * (.006 + .008 * aSeed.z) * (6. / max(-mv.z, 2.)), 1.5, 9.);
  gl_Position = projectionMatrix * mv;
}`,wt=`${ke} attribute vec3 aPos, aSeed; uniform vec3 uCam; uniform vec2 uWind; uniform float uTime; varying vec2 vQ; varying float vA, vC;
void main(){
  vec3 p = aPos + vec3(uWind.x, 0., uWind.y) * 6. * uTime * (.75 + .5 * aSeed.x);
  p.xz = mod(p.xz - uCam.xz + 40., 80.) - 40. + uCam.xz;
  p.y = .1 + aSeed.y * aSeed.y * .8 + .06 * sin(uTime * 2. + aSeed.z * 20.);
  vec4 mv = viewMatrix * uPage * vec4(curl(p), 1.);
  vec2 w = (viewMatrix * modelMatrix * vec4(uWind.x, 0., uWind.y, 0.)).xy; float wl = length(w); w = wl > 1e-3 ? w / wl : vec2(1., 0.);
  float len = (1.1 + 1.5 * aSeed.z) * max(wl, .3), wid = .5 + .6 * aSeed.x;
  mv.xy += w * position.x * len + vec2(-w.y, w.x) * position.y * wid;
  vQ = position.xy * 2.; vC = aSeed.x * 2. - 1.;
  vA = smoothstep(1.5, 4.5, -mv.z) * (1. - smoothstep(28., 40., -mv.z)) * (.55 + .45 * sin(uTime * 1.3 + aSeed.y * 30.));
  gl_Position = projectionMatrix * mv;
}`,gt=`precision highp float; varying vec2 vQ; varying float vA, vC; uniform vec3 uSunCol, uShade; uniform float uDrift, uStreak;
void main(){ float y = vQ.y * 1.4 - vC * (vQ.x * vQ.x - .35) * 1.3 - .25 * sin(vQ.x * 5. + vC * 9.);      // a wisp curls: no straight threads
  float a = (1. - vQ.x * vQ.x) * max(1. - y * y, 0.) * (1. - vQ.y * vQ.y); a *= a;
  gl_FragColor = vec4(uSunCol * 1.05 + uShade * .5, a * vA * .3 * uDrift * uStreak); }`,xt=`precision highp float; varying float vTw; uniform vec3 uSunCol;
void main(){ vec2 c = gl_PointCoord - .5; float r = length(c) * 2.; float star = max(1. - r, 0.) ; star = star * star + .6 * max(1. - 9. * abs(c.x * c.y) - r * .6, 0.);
  gl_FragColor = vec4(uSunCol * 3.5 * star * vTw, 1.); }`;async function yt(e,t){const h=document.createElement("canvas");h.width=2048,h.height=512;const i=h.getContext("2d");i.lineCap="round",i.lineJoin="round";for(let s=0;s<150;s++){const p=t()*2048,D=512-t()*t()*512*.62,c=30+t()*50,z=16+t()*34;for(const $ of[-2048,0,2048]){const M=i.createRadialGradient(p+$,D,0,p+$,D,c);M.addColorStop(0,"rgba(0,0,0,0.6)"),M.addColorStop(1,"rgba(0,0,0,0)"),i.save(),i.translate(0,D),i.scale(1,z/c),i.translate(0,-D),i.fillStyle=M,i.fillRect(p+$-c,D-c,c*2,c*2),i.restore()}s%25===24&&await e.yield()}await e.yield();const l=[8.5,5.4,3.2,2,1.3];let d=[[],[],[],[],[]];const H=(s,p,D,c,z)=>{const $=d[s];$.push(p,D,c,z),p<150?$.push(p+2048,D,c+2048,z):p>1898&&$.push(p-2048,D,c-2048,z)},S=(s,p,D,c,z)=>{const $=z===0?4:z===1?3:2;for(let M=0;M<$;M++){const L=c/$*t.range(.7,1.3),F=s+Math.sin(D)*L,X=p-Math.cos(D)*L;if(H(z===0?M<2?0:1:z+1,s,p,F,X),z>=1){const o=1+Math.floor(t()*2.4);for(let w=0;w<o;w++){const q=t(),V=ee(s,F,q),C=ee(p,X,q),I=D+(t()<.5?1:-1)*t.range(1.25,1.6),G=t.range(5,12);H(4,V,C,V+Math.sin(I)*G,C-Math.cos(I)*G)}}const f=t()<.5?1:-1;z<3&&(M>0||z>0)&&t()<(z===0?.97:.86)&&S(F,X,D+t.range(.65,1.2)*f,c*t.range(.45,.66),z+1),z<2&&t()<.7&&S(F,X,D-t.range(.5,1.05)*f,c*t.range(.3,.5),z+1),D+=t.range(-.34,.34)*(z===0?.7:1)-D*(z<2?.12:0),s=F,p=X}},g=()=>{for(let s=0;s<5;s++){const p=d[s];if(p.length){i.strokeStyle="rgba(0,0,0,0.97)",i.lineWidth=l[s],i.beginPath();for(let D=0;D<p.length;D+=4)i.moveTo(p[D],p[D+1]),i.lineTo(p[D+2],p[D+3]);i.stroke()}}for(let s=0;s<4;s++){const p=d[s];if(!p.length)continue;i.strokeStyle=s<2?"rgba(255,0,0,0.55)":"rgba(255,0,0,0.9)",i.lineWidth=Math.max(1,l[s]*.4);const D=l[s]*.3;i.beginPath();for(let c=0;c<p.length;c+=4)i.moveTo(p[c],p[c+1]-D),i.lineTo(p[c+2],p[c+3]-D);i.stroke()}d=[[],[],[],[],[]]},_=150;for(let s=0;s<_;s++){const p=.4+.6*Math.pow(t(),.8);S((s+t())/_*2048,516,t.range(-.8,.8),512*p*t.range(.92,1.12),0),s%5===4&&(g(),await e.yield())}g(),await e.yield();const j=new u.CanvasTexture(h);return j.wrapS=u.RepeatWrapping,j.generateMipmaps=!0,j.minFilter=u.LinearMipmapLinearFilter,j.anisotropy=4,j}async function bt(e,t){const h=document.createElement("canvas");h.width=1024,h.height=2048;const i=h.getContext("2d");i.lineCap="round",i.lineJoin="round";let l=[[],[],[]];const d=[3.4,2.2,1.6],H=()=>{for(let M=0;M<3;M++){const L=l[M];if(L.length){i.strokeStyle="rgba(0,128,0,0.95)",i.lineWidth=d[M],i.beginPath();for(let F=0;F<L.length;F+=4)i.moveTo(L[F],L[F+1]),i.lineTo(L[F+2],L[F+3]);i.stroke()}}l=[[],[],[]]},S=(M,L,F,X,f,o)=>{const w=F-M,q=X-L,V=Math.hypot(w,q)||1,C=-q/V,I=w/V,G=C<0?-1:1;for(let W=0;W<6;W++){const ae=1-W/6,Y=W/6*.5*G;i.strokeStyle=`rgb(${f>5?235:150},${Math.round(40+215*W/5)},0)`,i.lineWidth=Math.max(1.2,(f+o)*.5*ae),i.beginPath(),i.moveTo(M+C*Y*f,L+I*Y*f),i.lineTo(F+C*Y*o,X+I*Y*o),i.stroke()}},g=(M,L,F,X,f)=>{for(let w=0;w<5;w++){F+=t.range(-.18,.18),F+=(Math.PI-Math.abs(F))*.13*Math.sign(F||1)*(f>0?1:.55);const q=M+Math.sin(F)*X/5,V=L-Math.cos(F)*X/5;l[Math.min(2,f)].push(M,L,q,V),f<2&&t()<.8&&g(q,V,F+t.range(.25,.7)*(t()<.5?1:-1),X*t.range(.45,.75),f+1),M=q,L=V}},_=(M,L,F,X,f)=>{for(let w=0;w<7;w++){F*=.86,F+=t.range(-.1,.1);const q=M+Math.sin(F)*X/7,V=L-Math.cos(F)*X/7,C=f*(1-(w+1)/7*.8);S(M,L,q,V,f*(1-w/7*.8),C),w>1&&t()<.75&&g(q,V,(t()<.5?1:-1)*t.range(2.5,2.95),t.range(150,300),1),w>0&&(g(q,V,F+t.range(.35,.9)*(t()<.5?1:-1),X*t.range(.42,.75),0),t()<.7&&g(q,V,F+t.range(.35,.9)*Math.sign(F||1),X*t.range(.3,.5),0)),M=q,L=V}g(M,L,F,X*.4,0)};let j=512,s=2054,p=t.range(-.05,.05);const D=30,c=1898/D,z=[];for(let M=0;M<D;M++){p+=t.range(-.035,.035)-p*.1;const L=j+Math.sin(p)*c,F=s-c,X=ee(44,4,Math.pow(M/(D-1),.8));if(z.push([j,s,L,F,X,ee(44,4,Math.pow((M+1)/(D-1),.8))]),M>3){const f=(M&1?1:-1)*(t()<.85?1:-1);_(L,F,f*t.range(.42,.85)*(M<7?1.5:1),ee(470,130,(M-4)/(D-5))*t.range(.75,1.1),X*.5),M%3===0&&H(),await e.yield()}j=L,s=F}g(j,s,.1,150,0),H(),await e.yield();for(const M of z)S(M[0],M[1],M[2],M[3],M[4],M[5]);await e.yield(),i.globalCompositeOperation="source-atop";for(let M=0;M<150;M++){const L=Math.floor(t()*t()*D*.9),F=z[L],X=ee(F[1],F[3],t()),f=ee(F[0],F[2],t())+t.range(-.5,.5)*F[4],o=F[4]*t.range(.06,.3);i.strokeStyle="rgba(30,128,0,0.75)",i.lineWidth=L<3?t.range(2.5,6):t.range(1.2,2.6),i.beginPath(),i.moveTo(f-o,X),i.lineTo(f+o,X+t.range(-2,2)),i.stroke()}i.globalCompositeOperation="source-over",await e.yield();const $=new u.CanvasTexture(h);return $.generateMipmaps=!0,$.minFilter=u.LinearMipmapLinearFilter,$.anisotropy=4,$}const je=.55,_e=.3,Xe=2,qe=.26,Mt=(e,t,r,a,h,i)=>{const l=h-r,d=i-a,H=ve(((e-r)*l+(t-a)*d)/(l*l+d*d||1));return Math.hypot(e-r-l*H,t-a-d*H)};async function St(e){const a=new Uint8Array(36864),h=new Float32Array(576),i=(S,g,_)=>(j,s)=>{const p=(s-_e)*Xe,D=j-.5-S*p*p,c=Math.hypot(D,p)+1e-4,z=(c-.31)/.06,$=Math.exp(-z*z)*ve(.55-.75*p/c),M=qe*.9*(1-.8*ve(p/g))+.012,L=Math.max(0,1-Math.abs(D)/M),F=ue(0,1,L)*ue(qe*.6,qe*1.3,p)*(1-ue(g*.55,g,p));return .6*_*$-.2*F},l=(S,g)=>{const _=.45*(1-.4*ue(.3,1,g)),j=.84+.09*Math.sin(S*40);return .9*ue(0,.4,1-Math.abs(S-.5)/_)*(1-ue(j-.14,j,g))*ue(.02,.1,g)*(1-.5*ue(.3,1,g))};for(let S=0;S<a.length;S+=4)a[S]=64,a[S+1]=128,a[S+2]=128;const d=[[0,i(.03,1.3,1)],[1,i(-.04,1.05,.8)],[4,l]];for(const[S,g]of d){const _=(S&3)*24,j=(S>>2)*24;for(let s=0;s<24;s++)for(let p=0;p<24;p++)h[s*24+p]=g((p+.5)/24,(s+.5)/24);for(let s=0;s<24;s++)for(let p=0;p<24;p++){const D=Math.max(0,p-1),c=Math.min(23,p+1),z=Math.max(0,s-1),$=Math.min(23,s+1),M=h[s*24+p],L=(h[s*24+c]-h[s*24+D])*24/(c-D),F=(h[$*24+p]-h[z*24+p])*24/($-z),X=Math.min(1,Math.min(p,23-p,s,23-s)/2),f=((j+s)*96+_+p)*4;a[f]=Math.round(255*ve(.25+.75*M)),a[f+1]=Math.round(255*ve(.5+L/96)),a[f+2]=Math.round(255*ve(.5+F/96)),a[f+3]=Math.round(255*ue(.02,.3,Math.min(1,Math.abs(M)*4))*X)}}const H=new u.DataTexture(a,96,96,u.RGBAFormat,u.UnsignedByteType);return H.generateMipmaps=!0,H.minFilter=u.LinearMipmapLinearFilter,H.magFilter=u.LinearFilter,H.needsUpdate=!0,H}const kt=`${ke} attribute vec4 aRoot, aAx, aT, aCol, iA, iB; uniform float uTime; uniform vec2 uWind; varying float vT, vR; varying vec3 vL, vC, vV; varying vec2 vN;
void main(){ float ca = cos(iB.x), sa = sin(iB.x), h = iA.w, t = aT.x, ph = aT.y + iB.w;
  vec2 n = vec2(aRoot.x * ca - aRoot.y * sa, aRoot.x * sa + aRoot.y * ca), ax = vec2(aAx.x * ca - aAx.y * sa, aAx.x * sa + aAx.y * ca);
  vec2 lo = (vec2(aAx.z * ca - aAx.w * sa, aAx.z * sa + aAx.w * ca) + uWind * aT.z) * h;
  vec3 p = vec3(iA.x + n.x * iA.z + ax.x * aRoot.w, aRoot.z * h, iA.y + n.y * iA.z + ax.y * aRoot.w);
  p += vec3(lo.x, -.2 * length(lo), lo.y) * t * t + vec3(1., 0., .3) * t * t * (h / .65 * aCol.w) * (.05 * sin(uTime * 11. + ph) + .03 * sin(uTime * 4.3 + ph * 1.7) + .04);   // (it quivers in proportion to its height: the patch's tufts stand 0.65 m on average)
  vT = t; vR = smoothstep(.35, .8, -dot(n, uWind)); vC = aCol.rgb * iB.y; vN = n; vL = p; vec3 lb = curl(p); vV = curlView(lb); gl_Position = projectionMatrix * viewMatrix * uPage * vec4(lb, 1.);
  if (aT.w >= iB.z) gl_Position = vec4(2., 2., 2., 1.); }`,zt=`precision highp float; varying float vT, vR; varying vec3 vL, vC, vV; varying vec2 vN;
${Se}${$e}
void main(){
  float side = smoothstep(-.2, .6, dot(normalize(vec3(vN.x, .5, vN.y)), uSun));
  float g = dot(vC, vec3(.3, .5, .2));
  vec3 alb = mix(vC, vec3(g), max(.65 * uMoon, .5 * vR));
  float t = clamp(vT, 0., 1.);                                          // (a varying carried past a thin ribbon's edge stays in range)
  vec3 col = max(alb, 0.) * strawLight(t) * mix(.3, 1., side) * mix(.4, 1., smoothstep(0., .55, t));
  float dist = length(vV) + 1e-4;
  col = airVeil(col, wr(vL.xz), vV / dist, 0.);
  gl_FragColor = vec4(max(airHaze(col, vL.xz, dist), 0.), 1.); }`;function Ct(e){const t=e.prints,r=e.count,a=e.fox||{},h=10,i=c=>{const z=c.length/3;let $=1e9,M=1e9,L=-1e9,F=-1e9;for(let q=0;q<z;q++){const V=Math.floor(c[q*3]/h),C=Math.floor(c[q*3+1]/h);V<$&&($=V),V>L&&(L=V),C<M&&(M=C),C>F&&(F=C)}if(!z)return{n:0};const X=L-$+1,f=F-M+1,o=new Int32Array(X*f).fill(-1),w=new Int32Array(z);for(let q=0;q<z;q++){const V=Math.floor(c[q*3]/h)-$+(Math.floor(c[q*3+1]/h)-M)*X;w[q]=o[V],o[V]=q}return{n:z,pts:c,x0:$,z0:M,nx:X,nz:f,head:o,next:w}},l=(c,z,$)=>{let M=h;if(!c.n)return M;const L=Math.floor(z/h)-c.x0,F=Math.floor($/h)-c.z0,X=c.pts;for(let f=F-1;f<=F+1;f++)if(!(f<0||f>=c.nz)){for(let o=L-1;o<=L+1;o++)if(!(o<0||o>=c.nx))for(let w=c.head[o+f*c.nx];w>=0;w=c.next[w]){const q=X[w*3]-z,V=X[w*3+1]-$,C=Math.sqrt(q*q+V*V)-X[w*3+2];C<M&&(M=C)}}return M},d=[],H=[],S=[];for(let c=-20;c<=Te+20;c+=1){const z=e.at(c);d.push(z[0],z[1],0)}for(let c=0;c<r;c++){const z=c*8;t[z+7]<=2.5&&H.push(t[z],t[z+1],.5*Math.max(t[z+3],t[z+4]))}if(a.lat)for(let c=a.s0;c<=a.s1+30;c+=1){const z=e.at(c,a.lat(Math.min(c,a.s1))*e.side);S.push(z[0],z[1],0)}const g=i(new Float32Array(d)),_=i(new Float32Array(H)),j=i(new Float32Array(S));return{trailD:(c,z)=>l(g,c,z),markD:(c,z)=>l(_,c,z),foxD:(c,z)=>Math.min(a.thread?Mt(c,z,a.thread[0],a.thread[1],a.thread[2],a.thread[3]):h,l(j,c,z))}}async function Tt(e,t,r,a,h,i,l){const d=e.core.makeRng(e.core.hashSeed("whh-plants:"+e.seed)),H=a[0],S=a[1],{trailD:g,markD:_,foxD:j}=l,s=(f,o)=>{for(const w of h){const q=w[3],V=(f-w[1])*H+(o-w[2])*S,C=(-(f-w[1])*S+(o-w[2])*H)/q;if(Math.abs(C)>=1||Math.abs(V)>=q)continue;const I=w[1]*.37+w[2]*.23,G=(1-C*C)*(1-C*C),W=(V-q*(.16*Math.sin(C*3.1+I)+.07*Math.sin(C*7.3+I*2.1)+.22*C*C-.1))/q,ae=ve(1-W/.46);if(w[4]*G*(W<0?ue(-.09,0,W):ae*ae)>.05)return!0}return!1},p=Math.max(Math.tan(Math.min(r.e0,r.e1)*Math.PI/180),.03),D=-r.az[0],c=-r.az[1],z=t.feeds[0][1]+6,$=xe-24,M=[],L=(f,o,w,q)=>{if(g(f,o)<2.6+w||_(f,o)<1.6+w||j(f,o)<2+w||s(f,o)||s(f+w,o)||s(f-w,o)||s(f,o+w)||s(f,o-w))return!1;const V=w/qe*Xe*(1-_e),C=je*q/p;for(let I=.5;I<=1;I+=.5){let G=f+H*V*I,W=o+S*V*I;if(g(G,W)<1.4+w||_(G,W)<1.6||j(G,W)<2||(G=f+D*C*I,W=o+c*C*I,g(G,W)<1.4+w||_(G,W)<1.6||j(G,W)<2))return!1}return!0},F=(f,o)=>{for(let w=1;w<t.feeds.length;w++)if(f>t.feeds[w][0]-9&&f<t.feeds[w][1]+7&&o<16)return!0;return!1},X=(f,o,w,q,V,C,I)=>{if(F(f,w))return null;const G=t.at(f,o*w);if(!L(G[0],G[1],q,V))return null;const W={x:G[0],z:G[1],R:q,h:V,kind:C,glyph:I,s:f,off:o*w};return M.push(W),W};for(const f of[1,-1]){for(let o=z+d.range(2,10);o<$;o+=d.range(8,16)){const w=d(),q=3.6+26*w*w,V=d.range(.25,.7),C=d.range(.36,.48),I=Math.floor(d()*3),G=Math.floor(d()*2),W=Math.floor(d()*4),ae=[];for(let Q=0;Q<3;Q++)ae.push([d.range(0,6.2832),d.range(.5,3),d.range(.1,.18),d.range(.7,.95)]);let Y=null;for(const Q of[0,3,-3,6,-6])if(!(Y||o+Q<z||o+Q>$)){for(let se=q;se<=30&&!Y;se+=1.5)Y=X(o+Q,f,se,V,C,I,G);for(let se=q-1.5;se>=2.6+V&&!Y;se-=1.5)Y=X(o+Q,f,se,V,C,I,G)}if(Y)for(let Q=0;Q<W;Q++){const se=ae[Q],we=Y.R+se[1],le=Y.x+Math.cos(se[0])*we,ye=Y.z+Math.sin(se[0])*we;L(le,ye,se[2],Y.h*se[3])&&M.push({x:le,z:ye,R:se[2],h:Y.h*se[3],kind:Y.kind,glyph:Y.glyph,s:Y.s,off:Y.off,single:!0})}}for(let o=z+d.range(0,40);o<$;o+=d.range(30,60)){const w=d.range(30,75),q=d.range(.45,.7),V=d.range(.36,.48),C=Math.floor(d()*3),I=Math.floor(d()*2);d()<i&&X(o,f,w,q,V,C,I)}}return M}async function Dt(e,t,r,a,h,i,l,d,H,S){const g=await Tt(e,h,i,l,d,H,S),_=e.core.makeRng(e.core.hashSeed("whh-plantform:"+e.seed));await e.yield();const j=l[0],s=l[1],p=205,D=new u.Color(i.straw),c=Math.max(D.r,D.g,D.b),z=1-Math.min(D.r,D.g,D.b)/c,$=C=>{const I=new u.Color(C),G=Math.max(I.r,I.g,I.b),W=1-Math.min(I.r,I.g,I.b)/G,ae=Math.min(1,z/Math.max(W,.001)),Y=Math.min(1,c/G);return[(G-(G-I.r)*ae)*Y,(G-(G-I.g)*ae)*Y,(G-(G-I.b)*ae)*Y]},M=[D.r,D.g,D.b],L=$("#A35A28"),F=$("#8E6236"),X=a(kt,zt,{},{side:u.DoubleSide}),f=[];for(let C=0;C<3;C++){const I=C===2?Math.round(p*.55):p,G=I*(C===2?4:2),W=new Float32Array(G*64),ae=new Uint16Array(G*6),Y=new Uint16Array(I+1);let Q=0;const se=C===0?.05:C===1?.03:.04,we=C===0?.016:.02,le=C===0?.4:C===1?.25:.12,ye=C===1?.3:.1,Ae=C===0?.15:.66,he=C===2?.6:1,m=C===2?L:M,A=C===0?L:F,n=(b,P,N,E,Z,R,ie,te,ne,pe,ce,me,ge,Pe,He,be,ze,Ce,Me)=>{const oe=Q*64;W[oe]=b,W[oe+1]=P,W[oe+2]=N,W[oe+3]=-ie,W[oe+4]=Z,W[oe+5]=R,W[oe+6]=ne,W[oe+7]=pe,W[oe+8]=me,W[oe+9]=Pe,W[oe+10]=ce,W[oe+11]=He,W[oe+12]=(be[0]+(ze[0]-be[0])*Ce)*Me,W[oe+13]=(be[1]+(ze[1]-be[1])*Ce)*Me,W[oe+14]=(be[2]+(ze[2]-be[2])*Ce)*Me,W[oe+15]=he,W.copyWithin(oe+16,oe,oe+16),W.copyWithin(oe+32,oe,oe+32),W[oe+19]=ie,W[oe+34]=N+E,W[oe+35]=-te,W[oe+40]=ge,W[oe+50]=N+E,W[oe+51]=te,W[oe+56]=ge;const Fe=Q*4,Le=Q*6;ae[Le]=Fe,ae[Le+1]=Fe+1,ae[Le+2]=Fe+2,ae[Le+3]=Fe+1,ae[Le+4]=Fe+3,ae[Le+5]=Fe+2,Q++};for(let b=0;b<I;b++){const P=_.range(0,6.2832),N=Math.sqrt(_()),E=Math.cos(P)*N,Z=Math.sin(P)*N,R=(1-.4*N*N)*_.range(.7,1),ie=_.range(0,6.2832),te=_.range(0,6.28),ne=_.range(.5,.8),pe=_(),ce=_(),me=(.08+le*N)*R,ge=Math.cos(P)*me,Pe=Math.sin(P)*me,He=Math.cos(ie),be=Math.sin(ie),ze=ye*R,Ce=(b+.5)/I;if(n(E,Z,0,R,He,be,se,we,ge,Pe,ze,0,1,te,Ce,m,A,C===2?pe*.5:.2+.5*pe,ne),C===2)for(let Me=0;Me<3;Me++){const oe=.5+.18*Me;n(E,Z,R*oe,R*.12,He,be,.09-.015*Me,.075-.015*Me,ge,Pe,ze,oe,oe+.12,te,Ce,L,F,ce,ne*.9)}else ce<Ae&&n(E,Z,R*.8,R*.2,He,be,C===0?.03:.05,C===0?.03:.04,ge,Pe,ze,.8,1,te,Ce,F,L,pe,ne*.8);Y[b+1]=Q}const v=(b,P)=>Math.min(I,Math.max(6,Math.round((55+150*(b/.7)*(b/.7))*(C===2?.55:1)*(P?.3:1)))),x=new u.InterleavedBuffer(W.subarray(0,Q*64),16),y=new u.InterleavedBufferAttribute(x,4,0),T=new u.InterleavedBufferAttribute(x,4,4),U=new u.InterleavedBufferAttribute(x,4,8),B=new u.InterleavedBufferAttribute(x,4,12),O=new u.InterleavedBufferAttribute(x,3,0),k=new u.BufferAttribute(ae.subarray(0,Q*6),1);for(const b of[!1,!0]){let P=0;for(const te of g)te.kind===C&&!!te.single===b&&P++;const N=new Float32Array(Math.max(P,1)*4),E=new Float32Array(Math.max(P,1)*4);let Z=0;N[0]=1e5,N[1]=1e5,N[2]=1,N[3]=.4;for(const te of g)if(te.kind===C&&!!te.single===b){const ne=Z++*4;N[ne]=te.x,N[ne+1]=te.z,N[ne+2]=te.R,N[ne+3]=te.h,E[ne]=_.range(0,6.2832),E[ne+1]=_.range(.85,1.06),E[ne+2]=v(te.R,b)/I,E[ne+3]=te.x*1.7+te.z*2.3}const R=new u.InstancedBufferGeometry;R.instanceCount=Math.max(P,1),R.setAttribute("position",O),R.setAttribute("aRoot",y),R.setAttribute("aAx",T),R.setAttribute("aT",U),R.setAttribute("aCol",B),R.setAttribute("iA",new u.InstancedBufferAttribute(N,4)),R.setAttribute("iB",new u.InstancedBufferAttribute(E,4)),R.setIndex(k),b&&R.setDrawRange(0,Y[v(.18,!0)]*6);const ie=new u.Mesh(R,X);ie.frustumCulled=!1,t.add(ie),f.push(ie)}}const o=new Float32Array(Math.max(1,g.length)*16),w=Math.atan2(-j,-s);g.length||o.set([1e5,1e5,0,1,1,0,0,0,1e5,1e5,0,1,1,0,0,0]);for(let C=0;C<g.length;C++){const I=g[C],G=I.R/qe,W=G*Xe,ae=W*(.5-_e),Y=C*16;o[Y]=I.x+j*ae,o[Y+1]=I.z+s*ae,o[Y+2]=w,o[Y+3]=G,o[Y+4]=W,o[Y+5]=.3*I.h/.4,o[Y+6]=I.glyph,o[Y+7]=.25,o[Y+8]=I.x,o[Y+9]=I.z,o[Y+11]=Math.max(2.3*I.R,.3),o[Y+12]=I.h*je,o[Y+14]=4,o[Y+15]=3}const q=await St(e),V=Ie(r,q,o,o.length/8,!1);return V.material.uniforms.uPlant.value=1,V.renderOrder=1.9,t.add(V),{list:g,meshes:f,marks:V}}async function Ft(e,t,r,a={}){const h=a.detail??e.quality?.detail??1,i=e.rng.fork("field"),l=Qe(r),d=new u.Group;d.matrixAutoUpdate=!1;const H={value:new u.Vector3};l.uEye=H,l.uPage={value:d.matrix},l.uCurl={value:new u.Vector4(0,0,0,-1)},l.uCurlK={value:new u.Vector3(1e4,11,0)};const S=(m,A,n={},v={})=>new u.ShaderMaterial({uniforms:{...l,uEye:H,...n},vertexShader:m,fragmentShader:A,...v}),g=[-900,-400,-150,-40,-8];for(let m=0;m<70;m+=.7)g.push(m);for(let m=70;m<1500;m*=1.22)g.push(m);const _=new Float32Array(g.length*9),j=[];g.forEach((m,A)=>{for(let n=0;n<3;n++)_[(A*3+n)*3]=(n-1)*1500,_[(A*3+n)*3+2]=m;if(A)for(let n=0;n<2;n++){const v=(A-1)*3+n,x=A*3+n;j.push(v,v+1,x,v+1,x+1,x)}});const s=new u.BufferGeometry;s.setAttribute("position",new u.BufferAttribute(_,3)),s.setIndex(j);const p=new u.Mesh(s,S(at,ot,{},{side:u.DoubleSide}));p.frustumCulled=!1,d.add(p),await e.yield();const D=await Je(e),c=Ie(l,D,t.prints,t.count,!1);c.renderOrder=2,d.add(c),await e.yield();const z=await tt(e);l.uCalm.value.set(t.wing.x,t.wing.z,10);const $=new Float32Array([t.wing.x,t.wing.z,t.wing.rot,9.6,2.4,r.wingDepth??.26,0,0]),M=Ie(l,z,$,1,!0);if(M.renderOrder=t.wing.mode?1.5:3,d.add(M),M.material.uniforms.uWing.value.set(t.wing.mode?1:0,t.wing.mode?1:0,t.side>0?0:1,0),await e.yield(),t.clods.length){const m=new u.IcosahedronGeometry(1,0),A=m.attributes.position,n=t.clods.length,v=new Float32Array(n*A.count*3),x=new Float32Array(n*A.count*3);for(let U=0;U<n;U++){const B=t.clods[U],O=Math.cos(B[3]),k=Math.sin(B[3]);for(let b=0;b<A.count;b++){const P=1+.42*Math.sin((A.getX(b)*3.1+A.getY(b)*5.3+A.getZ(b)*7.7)*2.9+U*7.1),N=A.getX(b)*B[2]*.42*P,E=A.getY(b)*B[2]*.3*P,Z=A.getZ(b)*B[2]*.36*P,R=(U*A.count+b)*3;v[R]=B[0]+N*O-Z*k,v[R+1]=B[2]*.2+E,v[R+2]=B[1]+N*k+Z*O,x[R]=N*O-Z*k,x[R+1]=E*1.6,x[R+2]=N*k+Z*O}}const y=new u.BufferGeometry;y.setAttribute("position",new u.BufferAttribute(v,3)),y.setAttribute("normal",new u.BufferAttribute(x,3));const T=new u.Mesh(y,S(dt,ft));T.frustumCulled=!1,d.add(T)}{const m=t.sedge.length*40,A=new Float32Array(m*12),n=new Float32Array(m*12),v=new Float32Array(m*8),x=[];let y=0;for(const B of t.sedge)for(let O=0;O<40;O++,y++){const k=i.range(0,6.2832),b=i.range(0,.22),P=B[0]+Math.cos(k)*b,N=B[1]+Math.sin(k)*b,E=B[2]*i.range(.55,1.1),Z=i.range(0,6.2832),R=i.range(.1,.45)*E,ie=i.range(0,6.28),te=.04,ne=Math.cos(Z+1.57)*te,pe=Math.sin(Z+1.57)*te,ce=[[P-ne,0,N-pe,0],[P+ne,0,N+pe,0],[P-ne*.3,E,N-pe*.3,1],[P+ne*.3,E,N+pe*.3,1]];for(let me=0;me<4;me++){const ge=(y*4+me)*3;A[ge]=ce[me][0],A[ge+1]=ce[me][1],A[ge+2]=ce[me][2],n[ge]=Math.cos(Z)*R,n[ge+1]=-R*.2,n[ge+2]=Math.sin(Z)*R,v[(y*4+me)*2]=ce[me][3],v[(y*4+me)*2+1]=ie}x.push(y*4,y*4+1,y*4+2,y*4+1,y*4+3,y*4+2)}const T=new u.BufferGeometry;T.setAttribute("position",new u.BufferAttribute(A,3)),T.setAttribute("aLean",new u.BufferAttribute(n,3)),T.setAttribute("aT",new u.BufferAttribute(v,2)),T.setIndex(x);const U=new u.Mesh(T,S(pt,vt,{uStraw:{value:new u.Color(r.straw)}},{side:u.DoubleSide}));U.frustumCulled=!1,d.add(U)}await e.yield();const L=new u.Group;L.position.set(t.hedge.x,0,t.hedge.z),L.rotation.y=t.hedge.rot,d.add(L);const F=await yt(e,i.fork("hedge")),X=new u.Mesh(new u.PlaneGeometry(520,26).translate(0,13,0),S(Ee,Ue,{uTex:{value:F},uOpt:{value:new u.Vector4(1,0,1,0)},uFrame:{value:new u.Vector4(Math.cos(t.hedge.rot),Math.sin(t.hedge.rot),0,0)},uLocal:{value:new u.Matrix4}},{side:u.DoubleSide,transparent:!0,depthWrite:!1}));if(X.frustumCulled=!1,X.renderOrder=3.5,L.add(X),L.updateMatrix(),X.material.uniforms.uLocal.value.copy(L.matrix),t.hedge2){const m=new u.Mesh(X.geometry,S(Ee,Ue,{uTex:{value:F},uOpt:{value:new u.Vector4(0,311,0,0)},uFrame:{value:new u.Vector4(Math.cos(t.hedge2.rot),Math.sin(t.hedge2.rot),0,0)},uLocal:{value:new u.Matrix4}},{side:u.DoubleSide,transparent:!0,depthWrite:!1}));m.position.set(t.hedge2.x,0,t.hedge2.z),m.rotation.y=t.hedge2.rot,m.scale.x=1.7,m.frustumCulled=!1,m.renderOrder=3.4,d.add(m),m.updateMatrix(),m.material.uniforms.uLocal.value.copy(m.matrix)}await e.yield();const f=await bt(e,i.fork("birch"));await e.yield(),t.patches.forEach((m,A)=>{A<2&&l.uPatch.value[A].set(m[0],m[1],m[3],m[2])}),l.uBirch.value=f,l.uHedge.value.set(t.hedge.x,t.hedge.z,Math.cos(t.hedge.rot),Math.sin(t.hedge.rot));for(const m of[-1,1]){const A=S(Ee,rt,{uTex:{value:f},uFlip:{value:m},uLocal:{value:new u.Matrix4}},{side:u.DoubleSide,transparent:!0,depthWrite:!1}),n=new u.Mesh(new u.PlaneGeometry(36*m,72).translate(0,36,0),A);n.position.set(m*14,0,.8),n.scale.y=m>0?.92:1,n.renderOrder=4,n.frustumCulled=!1,L.add(n),n.updateMatrix(),A.uniforms.uLocal.value.multiplyMatrices(L.matrix,n.matrix)}const o=new u.Mesh(new u.PlaneGeometry(18,26).translate(0,13,0),S(ct,ut,{uLocal:{value:new u.Matrix4}},{side:u.DoubleSide}));o.position.set(0,0,-.25),o.frustumCulled=!1,L.add(o),L.updateMatrix(),o.updateMatrix(),o.material.uniforms.uLocal.value.multiplyMatrices(L.matrix,o.matrix),await e.yield();const w=new u.Mesh(new u.SphereGeometry(1800,24,12),S(lt,ht,{},{side:u.BackSide,depthWrite:!1}));w.renderOrder=-1,w.frustumCulled=!1,d.add(w),await e.yield();const q=Math.round(2500*h),V=new Float32Array(q*3),C=new Float32Array(q*3);for(let m=0;m<q;m++)V[m*3]=i()*80,V[m*3+1]=i()*16,V[m*3+2]=i()*80,C[m*3]=i(),C[m*3+1]=i(),C[m*3+2]=i();const I=new u.BufferGeometry;I.setAttribute("position",new u.BufferAttribute(V,3)),I.setAttribute("aSeed",new u.BufferAttribute(C,3));const G=new u.Points(I,S(mt,xt,{},{transparent:!0,depthWrite:!1,blending:u.AdditiveBlending}));G.frustumCulled=!1,G.renderOrder=6,d.add(G),await e.yield();{const m=Math.round(520*h),A=new u.PlaneGeometry(1,1),n=new u.InstancedBufferGeometry,v=new Float32Array(m*3),x=new Float32Array(m*3);for(let T=0;T<m;T++)v[T*3]=i()*80,v[T*3+1]=0,v[T*3+2]=i()*80,x[T*3]=i(),x[T*3+1]=i(),x[T*3+2]=i();n.index=A.index,n.setAttribute("position",A.attributes.position),n.setAttribute("aPos",new u.InstancedBufferAttribute(v,3)),n.setAttribute("aSeed",new u.InstancedBufferAttribute(x,3)),n.instanceCount=m;const y=new u.Mesh(n,S(wt,gt,{},{transparent:!0,depthWrite:!1}));y.frustumCulled=!1,y.renderOrder=5,d.add(y)}await e.yield();const W=[];a.wind&&l.uWind.value.set(a.wind[0],a.wind[1]);{const m=i.fork("drift"),A=t.variant,n=l.uWind.value.x,v=l.uWind.value.y,x=[];for(let B=-30;B<=Te+30;B+=3)x.push(t.at(B));const y=(B,O)=>{let k=1e9;for(const b of x){const P=(b[0]-B)*(b[0]-B)+(b[1]-O)*(b[1]-O);P<k&&(k=P)}return Math.sqrt(k)};let T=22+m.range(0,8),U=m.chance(.5)?1:-1;for(;T<Te-24&&W.length<18;){let B=!1;for(let O=0;O<5&&!B;O++){const k=m.range(10,19),b=m.range(1,1.5)*Math.sqrt(k/14),P=m.range(7,26),N=A===0?-t.side:A===1&&T>138?t.side:U,E=t.at(T,N*P);let Z=!(T>xe-20&&T<xe+22)&&!(A===1&&T>138&&T<268);for(const R of t.feeds)T>R[0]-9&&T<R[1]+7&&P<16&&(Z=!1);for(let R=-1;R<=1.01&&Z;R+=.2){const ie=(1-R*R)*(1-R*R),te=3.2+5*ie;(y(E[0]-v*k*R,E[1]+n*k*R)<te||y(E[0]-v*k*R+n*k*.3,E[1]+n*k*R+v*k*.3)<te)&&(Z=!1)}Z&&(W.push([T,E[0],E[1],k,b]),B=!0,U=-U)}T+=B?m.range(11,18):6}W.sort((B,O)=>B[0]-O[0]),A!==2&&(W.length=0)}await e.yield();const ae=Ct(t);if(t.variant!==2){const m=e.core.makeRng(e.core.hashSeed("whh-daydrifts:"+e.seed)),{trailD:A,markD:n,foxD:v}=ae,x=l.uWind.value.x,y=l.uWind.value.y,T=r.az[0],U=r.az[1];for(let B=t.feeds[0][1]+6+m.range(0,10);B<xe-24;B+=m.range(16,26)){const O=m.range(10,19),k=m.range(1,1.5)*Math.sqrt(O/14),b=m.range(12,30),P=t.at(B)[2],N=T*-Math.cos(P)+U*Math.sin(P)>0?-1:1,E=t.at(B,N*b);let Z=!0;for(let R=-1;R<=1.01&&Z;R+=.2){const ie=(1-R*R)*(1-R*R),te=3.2+5*ie,ne=E[0]-y*O*R,pe=E[1]+x*O*R;for(const ce of[[ne,pe,te],[ne+x*O*.3,pe+y*O*.3,te],[ne-T*6,pe-U*6,3],[ne-T*12,pe-U*12,3]])(A(ce[0],ce[1])<ce[2]||n(ce[0],ce[1])<3||v(ce[0],ce[1])<3)&&(Z=!1)}Z&&W.push([B,E[0],E[1],O,k])}await e.yield()}const Y=await Dt(e,d,l,S,t,r,[l.uWind.value.x,l.uWind.value.y],W,h,ae);await e.yield();const Q=t.fox||{},se=Math.ceil(Te/2)+2,we=new Float32Array(se),le=new Float32Array(se*4);Q.thread&&(l.uFoxA.value.set(Q.thread[0],Q.thread[1],Q.thread[2],Q.thread[3]),l.uFoxK.value.x=1),Q.lat&&(l.uFoxK.value.y=1);for(let m=0;m<se;m++){const A=m*2,n=t.at(A),v=t.at(A+40),x=-Math.sin(n[2]),y=-Math.cos(n[2]),T=v[0]-n[0],U=v[1]-n[1],B=T*x+U*y;if(we[m]=(T*y-U*x)/Math.max(B*B,100),Q.lat){const O=Math.min(Q.s1,Math.max(Q.s0,A-6)),k=Math.min(Q.s1,Math.max(Q.s0,A+36)),b=t.at(O,Q.lat(O)*t.side),P=t.at(k,Q.lat(k)*t.side);le[m*4]=b[0],le[m*4+1]=b[1],le[m*4+2]=P[0],le[m*4+3]=P[1]}}const ye=new u.Vector2,Ae=new u.Vector3;let he=null;return{group:d,U:l,stamps:c,wing:M,dome:w,drifts:W,plants:Y,setDrifts(m){let A=0;for(let n=0;n<W.length&&A<6;n++){const v=W[n];v[0]>m-22&&l.uDr.value[A++].set(v[1],v[2],v[3],v[4])}for(;A<6;A++)l.uDr.value[A].set(1e5,1e5,8,0)},setCorridor(m){const A=Math.min(se-1.001,Math.max(0,m/2)),n=Math.floor(A),v=A-n,x=n*4;l.uSeamQ.value=ee(we[n],we[n+1],v),Q.lat&&l.uFoxB.value.set(ee(le[x],le[x+4],v),ee(le[x+1],le[x+5],v),ee(le[x+2],le[x+6],v),ee(le[x+3],le[x+7],v))},setSun(m,A,n){const v=Math.cos(m);l.uSun.value.set(A*v,Math.sin(m),n*v),l.uSunH.value.set(A,n),l.uSinE.value=Math.sin(m),l.uTanE.value=Math.tan(m)},setDawn(m,A){he||(he={shade:l.uShade.value.clone(),deep:l.uShadeDeep.value.clone(),haze:l.uHaze.value.clone(),top:l.uSkyTop.value.clone(),sun:l.uSunCol.value.clone(),night:l.uNight.value}),l.uShade.value.copy(he.shade).lerp(A.shade,m),l.uShadeDeep.value.copy(he.deep).lerp(A.deep,m),l.uHaze.value.copy(he.haze).lerp(A.haze,m),l.uSkyTop.value.copy(he.top).lerp(A.top,m),l.uSunCol.value.copy(he.sun).lerp(A.sun,m),l.uDawn.value.copy(A.col).multiplyScalar(m),l.uDawnH.value.set(A.dir[0],A.dir[1]),l.uGap.value.copy(A.gap0).lerp(A.gap1,m),l.uNight.value=he.night*(1-.6*m)},setCurl(m,A,n,v,x,y,T){l.uCurl.value.set(m,A,n,v),l.uSeam.value.set(m,A,n,v),l.uCurlK.value.set(x,y,T),w.quaternion.setFromAxisAngle(Ae.set(-v,0,n),-T)},update(m,A,n,v){l.uTime.value=m,l.uCam.value.copy(A),H.value.copy(n),w.position.copy(A),v.getDrawingBufferSize(ye),l.uRes.value.copy(ye)}}}export{J as G,Oe as HEDGE_S,Te as LEN,Se as SNOW_GLSL,xe as WING_S,Je as bakeAtlas,tt as bakeWing,Ft as buildField,Tt as dealPlants,At as makeStory,Qe as makeUniforms};
