import*as g from"three";import{clamp as We,lerp as oe,smoothstep as ce}from"../kit/core.js";const fe=Math.PI*2,Re=240,ze=24,Te=.46,_e=11,ne=2,ct=110,Ee=8,Oe=.3,xe=fe/ze;function Le(){const t=[],C=[],m=[],L=[],r={P:t,C,R:m,U:L,count:0,tri(h,s,M,A,q,v,V,n,x,j,T){const P=s[0]-h[0],F=s[1]-h[1],o=s[2]-h[2],b=M[0]-h[0],f=M[1]-h[1],w=M[2]-h[2],z=F*w-o*f,_=o*b-P*w,p=P*f-F*b;if(n&&z*n[0]+_*n[1]+p*n[2]<0){const E=s;s=M,M=E;const k=v;v=V,V=k;const G=j;j=T,T=G}t.push(h[0],h[1],h[2],s[0],s[1],s[2],M[0],M[1],M[2]);for(let E=0;E<3;E++)C.push(A.r,A.g,A.b);m.push(...q,...v||q,...V||q);const u=[0,0];L.push(...x||u,...j||x||u,...T||x||u),r.count++},quad(h,s,M,A,q,v,V,n,x,j){r.tri(h,s,M,q,v,V,n,j),r.tri(h,M,A,q,v,n,x,j)},blade(h,s,M,A,q,v,V){r.tri(h,s,M,A,q,v,V,[0,1,0]),r.tri(h,s,M,A,q,v,V,[0,-1,0])},tube(h,s,M,A,q){const v=h[0].pts.length;for(let n=0;n<h.length-1;n++){const x=h[n],j=h[n+1],T=[(x.c[0]+j.c[0])/2,(x.c[1]+j.c[1])/2,(x.c[2]+j.c[2])/2];for(let P=0;P<v;P++){const F=(P+1)%v,o=x.pts[P],b=x.pts[F],f=j.pts[F],w=j.pts[P],z=[(o[0]+b[0]+f[0]+w[0])/4-T[0],(o[1]+b[1]+f[1]+w[1])/4-T[1],(o[2]+b[2]+f[2]+w[2])/4-T[2]],_=s(n,P,z),p=M(n),u=M(n+1);r.tri(o,b,f,_,p,p,u,z),r.tri(o,f,w,_,p,u,u,z)}}const V=(n,x,j,T)=>{const P=[n.c[0]-x.c[0],n.c[1]-x.c[1],n.c[2]-x.c[2]];for(let F=1;F<v-1;F++)r.tri(n.pts[0],n.pts[F],n.pts[F+1],j,T,T,T,P)};A&&V(h[0],h[1],A,M(0)),q&&V(h[h.length-1],h[h.length-2],q,M(h.length-1))},geometry(h){const s=new g.BufferGeometry,M=t.length/3,A=new Float32Array(t.length);for(let q=0;q<M;q+=3){const v=q*3,V=t[v+3]-t[v],n=t[v+4]-t[v+1],x=t[v+5]-t[v+2],j=t[v+6]-t[v],T=t[v+7]-t[v+1],P=t[v+8]-t[v+2];let F=n*P-x*T,o=x*j-V*P,b=V*T-n*j;const f=Math.hypot(F,o,b)||1;F/=f,o/=f,b/=f;for(let w=0;w<3;w++)A[v+w*3]=F,A[v+w*3+1]=o,A[v+w*3+2]=b}return s.setAttribute("position",new g.Float32BufferAttribute(t,3)),s.setAttribute("normal",new g.BufferAttribute(A,3)),s.setAttribute("color",new g.Float32BufferAttribute(C,3)),h?s.setAttribute("aRig",new g.Float32BufferAttribute(m,4)):(s.setAttribute("aKind",new g.Float32BufferAttribute(m.filter((q,v)=>v%4===0),1)),s.setAttribute("uv",new g.Float32BufferAttribute(L,2))),s}};return r}const Be=(t,C)=>{const m=[];for(let L=0;L<t;L++)m.push(C(L/t*fe));return m},ue=[.2,.12,.25],se=[.11,-.14,-.18],be=[0,.07,.5],Ne=.95,Fe=1.05,me=.9,je=.9;function lt(t,C=0){const m=Le(),L=t.blue,r=t.blue.clone().lerp(t.cream,.12),h=t.blue.clone().lerp(t.slate,.38),s=t.slate,M=t.blue.clone().lerp(t.cream,.22),q=[[-.8,.04,.07,.04],[-.48,.2,.2,.01],[-.08,.32,.28,-.03],[.3,.3,.25,0],[.54,.16,.14,.06]].map(([o,b,f,w])=>({c:[0,w,o],pts:Be(6,z=>[Math.sin(z)*f,w+Math.cos(z)*b,o])}));m.tube(q,(o,b,f)=>f[1]<-.02?M:o===0?h:L,()=>[0,0,0,2],s,null);for(const o of[-1,1])m.blade([0,.05,-.7],[o*.26,.02,-1.16],[0,.03,-1.26],s,[0,0,0,0]),m.blade([0,.05,-.7],[o*.2,.03,-.72],[o*.26,.02,-1.16],h,[0,0,0,0]);const v=[];for(let o=0;o<=5;o++){const b=o/5,f=oe(.135,.068,Math.pow(b,.7)),w=be[2]+b*Ne;v.push({c:[0,be[1],w],pts:Be(4,z=>[Math.sin(z)*f*.9,be[1]+Math.cos(z)*f,w])})}const V=C===1?o=>o>=3?t.coral:o>=2?t.cream:L:C===2?(o,b,f)=>o>=1?f[1]<0?s:t.cream:L:o=>o>=3?t.cream:o>=2?r:L;m.tube(v,V,o=>[1,o/5,0,2],null,null);const n=1.4,x=(o,b,f)=>{const w=o*n,z=b*n,_=f*n;return{c:[0,_,w],pts:Be(4,p=>[Math.sin(p)*z*.85,_+Math.cos(p)*z,w])}};m.tube([x(-.05,.05,0),x(.07,.085,.015),x(.2,.06,.01),x(.27,.035,0)],(o,b,f)=>f[1]>.01?t.coral:t.cream,()=>[2,1,0,2],t.cream,null),m.tube([x(.27,.035,0),x(.42,.022,-.005),x(.58,.004,-.02)],()=>t.ochre,()=>[2,1,0,0],null,null);for(const o of[-1,1])m.tri([o*.066*n,.045*n,.1*n],[o*.062*n,.015*n,.135*n],[o*.058*n,.05*n,.175*n],s,[2,1,0,0],null,null,[o,.3,0]);const j=[0,.55,Fe,1.6,2],T=[.25,.37,.43,.3,.1],P=[-.62,-.66,-.62,-.52,-.34],F=[.07,.06,.05,.035,.02];for(const o of[-1,1]){const b=(p,u,E)=>[ue[0]*o+o*j[p],ue[1]+E,ue[2]+u],f=p=>[3,p>2?1:0,o,o<0&&p>=3?1:0];for(let p=0;p<4;p++){const u=y=>{const te=T[y]-P[y];return{le:b(y,T[y],0),rd:b(y,T[y]-.28*te,F[y]),te:b(y,P[y],0),bt:b(y,T[y]-.34*te,-F[y]*.45)}},E=u(p),k=u(p+1),G=f(p),S=f(p+1),B=p===3;m.quad(E.le,k.le,k.rd,E.rd,B?h:r,G,S,S,G,[0,1,.3]),m.quad(E.rd,k.rd,k.te,E.te,B?s:p===2?h:L,G,S,S,G,[0,1,-.2]),m.quad(E.te,k.te,k.bt,E.bt,B?s:h,G,S,S,G,[0,-1,0]),m.quad(E.bt,k.bt,k.le,E.le,M,G,S,S,G,[0,-1,.3]);for(let y=0;y<2;y++){const te=y/2,pe=(y+1)/2,ve=(I,we)=>[oe(E[we][0],k[we][0],I),oe(E[we][1],k[we][1],I),oe(E[we][2],k[we][2],I)],a=ve(te,"te"),de=ve(pe,"te"),Ae=ve(pe-.08,"te");Ae[2]-=.15-p*.02,Ae[1]-=.012;const ie=[3,p+pe>2.2?1:0,o,o<0&&p>=3?1:0];m.blade(a,de,Ae,B?s:h,p===2&&y===0||y===0?G:ie,ie,ie)}}const w=[-.3,.02,.3,.58,.86],z=[.6,.74,.74,.66,.54],_=[3,1,o,o<0?1:0];for(let p=0;p<5;p++){const u=p/4,E=oe(T[4]-.02,P[4]+.04,u),k=.062,G=w[p],S=b(4,E+k,.008),B=b(4,E-k,.008),y=[S[0]+o*Math.cos(G)*z[p],S[1]-.01,ue[2]+E-Math.sin(G)*z[p]],te=[S[0]+o*Math.cos(G)*z[p]*.6-o*Math.sin(G)*0,S[1],ue[2]+E+k*.9-Math.sin(G)*z[p]*.6];m.blade(S,B,y,s,_,_,_),m.blade(S,te,y,s,_,_,_)}}for(const o of[-1,1]){const b=se[0]*o,f=(_,p)=>({c:[b,se[1]+_,se[2]],pts:Be(3,u=>[b+Math.sin(u)*p,se[1]+_,se[2]+Math.cos(u)*p])});m.tube([f(.06,.11),f(-.3,.075),f(-me,.045)],_=>_===0?M:s,()=>[4,0,o,0],null,null),m.tube([f(-me+.03,.062),f(-me-.06,.045),f(-me-je,.036)],()=>s,()=>[4,1,o,0],null,null);const w=[b,se[1]-me-je,se[2]],z=[4,2,o,0];for(const[_,p]of[[-.14,.27],[0,.34],[.14,.27],[0,-.12]])m.blade([w[0]-.035,w[1]+.03,w[2]],[w[0]+.035,w[1]+.03,w[2]],[w[0]+_,w[1],w[2]+p],s,z,z,z)}return m.geometry(!0)}const Ie=`
vec3 rX(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
vec3 rY(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 rZ(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z); }
`,Qe=`
uniform vec3 uHaze, uMean, uCream, uShade, uOval, uCoral, uSkyTop;
uniform float uSmear, uLift, uPx;
uniform vec2 uSunH;   // the painted sun's bearing (unit x, z): vertical faces take one of three flat tones by it
uniform vec3 uSunD;   // the same bearing with the sun's slope in y (x, tan elevation, z). y = 0: no painted cast shadows (the set piece alone)
uniform vec4 uWheel;  // x: the wall's drawn angle, y: 1 where there is a wheel to cast shadows and bounce light (the world), z: unused, w: unused
uniform vec4 uLongR;  // the world's long painted shadows (vAux.w == 11): the deck's inner and outer radius, its track band's inner and outer radius
uniform vec3 uLongG, uLongB, uLongL, uLongC;   // the deck's own paint under them (its ground, its track band, the band's two edge lines) and the stands' chalk (the vertex colour of live's lozenges)
uniform vec4 uDk, uDkR;   // the world's painted decks (kind 1): uDk = (0 none, 1 marsh, 2 meadow, 3 snow, 4 wet slate; the sector's angle; the ring's radius; the ring's direction), uDkR = (track band inner, outer; deck inner, outer)
uniform vec3 uDkA, uDkB, uDkC;   // their paints: the flowers' eyes (snow: pit and prints), the flowers' petals (snow: the pit's rim), (snow: x the bare pegs' pitch)
uniform vec3 uWedge;             // the yard's strobe disc: what the floor's paint is multiplied by on a pale wedge (0: no disc)
varying vec3 vCol, vN, vObj, vWorld;
varying vec4 vAux;   // x seam coordinate (m), y kind, zw uv
#include <common>
#include <fog_pars_fragment>
float h3(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float vnoise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h3(i), h3(i + vec3(1, 0, 0)), f.x), mix(h3(i + vec3(0, 1, 0)), h3(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(h3(i + vec3(0, 0, 1)), h3(i + vec3(1, 0, 1)), f.x), mix(h3(i + vec3(0, 1, 1)), h3(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
// PAINTED CAST SHADOWS (no lights, no shadow maps): the wheel is five drums and a mast, the wall forty blades on one circle, so
// what stands between a point and the painted sun is worked out exactly: one ray against six cylinders and the circle of blades.
float cylSh(vec3 p, float R, float top){
  float b = dot(p.xz, uSunD.xz), c = dot(p.xz, p.xz) - R * R, disc = b * b - c;
  if (c < R * .9 || disc <= 0. || b >= 0.) return 0.;
  float t = -b - sqrt(max(disc, 0.));
  return 1. - smoothstep(top - .25, top + .25, p.y + t * uSunD.y);
}
float bladeAt(vec3 p, float t){
  vec2 q = p.xz + uSunD.xz * t; float h = p.y + t * uSunD.y;
  float f = fract((atan(q.x, q.y) - uWheel.x) / .15707963);
  return step(1.5, t) * (1. - smoothstep(39.7, 40.3, h)) * step(1.6, h) * smoothstep(0., .012, f) * (1. - smoothstep(.488, .5, f));
}
float castSh(vec3 p){
  if (uSunD.y < .01 || uWheel.y < .5) return 0.;
  float sh = max(max(cylSh(p, 150., 8.), cylSh(p, 118., 22.)), max(cylSh(p, 88., 36.), max(cylSh(p, 56., 50.), max(cylSh(p, 34., 62.), cylSh(p, 2., 172.)))));
  float b = dot(p.xz, uSunD.xz), c = dot(p.xz, p.xz) - 44100., disc = b * b - c;
  if (disc > 0. && abs(c) > 600.) { float sq = sqrt(disc); sh = max(sh, max(bladeAt(p, -b - sq), bladeAt(p, -b + sq))); }
  return sh;
}
// the shade tone of a paint: darker and cooler, and the paler and greyer the paint the more it takes the blue-grey of the painted
// shadow ovals, so plaster in shade is a powder blue-grey while coral, ochre and blue keep their own colour
vec3 shadeOf(vec3 b){
  float mx = max(b.r, max(b.g, b.b)), mn = min(b.r, min(b.g, b.b)), sat = (mx - mn) / max(mx, 1e-3), lum = dot(b, vec3(.3, .5, .2));
  return mix(b * uShade * uShade, uOval * (.5 + .55 * lum), .8 * (1. - sat) * step(.02, lum));
}
// a paint (linear) as the screen's 0 to 1 and back (the sRGB curve above its toe): the long shadows' tone rule is kept in screen values
vec3 toScr(vec3 c) { return 1.055 * pow(max(c, vec3(.0031308)), vec3(1. / 2.4)) - .055; }
vec3 ofScr(vec3 s) { return pow((s + .055) / 1.055, vec3(2.4)); }
// the lawns' flower drifts (the world's decks, round p4): how far out of a drift a point of a lawn lies (under 1: inside it).
// q = (along the sector, across the lawn; each 0 to 1), am and wm the sector's length and the lawn's width in metres. Four loose
// ovals a sector on each lawn (the second mend: were two), each about 6.6 by 4.5 m, turned a little and wavy at the edge, so
// that they run into one another and into their own next copies: a lawn in flower with green left between.
float dOval(vec2 q, vec2 c, vec2 ab, vec2 cs, float am, float wm){
  vec2 d = vec2((fract(q.x - c.x + .5) - .5) * am, (q.y - c.y) * wm), u = vec2(d.x * cs.x + d.y * cs.y, d.y * cs.x - d.x * cs.y);
  return length(u / ab) / (1. + .15 * sin(2.1 * u.x + 1.3 * u.y));
}
float driftAt(vec2 q, float am, float wm){
  return min(min(dOval(q, vec2(.2, .26), vec2(3.4, 2.3), vec2(.94, .34), am, wm), dOval(q, vec2(.7, .2), vec2(3.1, 2.), vec2(.97, -.26), am, wm)),
             min(dOval(q, vec2(.45, .62), vec2(3.5, 2.4), vec2(.91, -.42), am, wm), dOval(q, vec2(.95, .74), vec2(3.2, 2.2), vec2(.89, .45), am, wm)));
}
// one lawn's flowers at a point p of the deck (its own space): rgb the flower's paint here, a how much of it; din (out) how far out of
// a drift the point lies. One rosette at most to a cell of 0.8 m, rows set half a cell on from one another, each flower moved in
// its cell as far as its size leaves room; five or six petals round an eye, 0.42 to 0.68 m across; thinner toward a drift's
// edge (20 to 25 in a drift); cream with an ochre eye mostly, some blue with a cream eye, few coral. Exactly periodic in the
// sector (uDk.y). pk: half the pixels a metre of ground takes here (the footprint rule).
vec4 lawnFlower(vec3 p, float pk, out float din){
  float r = length(p.xz), sg = fract(atan(p.x, p.z) / uDk.y), inn = step(r, uDkR.x);
  float ra = inn > .5 ? uDkR.z : uDkR.y, rb = inn > .5 ? uDkR.x : uDkR.w, wm = rb - ra, v = (r - ra) / wm;
  din = 9.;
  if ((r > uDkR.x && r < uDkR.y) || v < 0. || v > 1.) return vec4(0.);
  float am = uDk.y * (ra + rb) * .5, nS = floor(am / .8 + .5), nV = floor(wm / .8 + .5);
  din = driftAt(vec2(sg - .37 * inn, mix(v, 1. - v, inn)), am, wm);          // the inner lawn's set a third of a sector on and turned over
  float row = min(floor(v * nV), nV - 1.), odd = mod(row, 2.), gx = sg * nS + .5 * odd, cx = floor(gx);
  float h1 = h3(vec3(mod(cx, nS), row, 3.7 + inn)), h2 = h3(vec3(mod(cx, nS), row, 9.1 + inn));
  float rad = .21 + .13 * fract(h1 * 7.), np = 5. + step(.5, fract(h1 * 13.));
  vec2 cf = vec2(.5) + (vec2(h1, h2) - .5) * 2. * max(vec2(0.), .5 - 1.03 * rad / vec2(am / nS, wm / nV));   // the flower's centre in its cell
  vec2 dc = (vec2(gx - cx, v * nV - row) - cf) * vec2(uDk.y * r / nS, wm / nV);
  float cy = (row + cf.y) / nV, ein = driftAt(vec2((cx + cf.x - .5 * odd) / nS - .37 * inn, mix(cy, 1. - cy, inn)), am, wm);
  float rp = rad * (.5 + .5 * abs(cos(.5 * np * (atan(dc.y, dc.x + 1e-6) + 6.2831853 * h2)))), rho = length(dc);
  float pet = (1. - smoothstep(rp - .035, rp, rho)) * step(ein, 1.) * step(.12 + .5 * ein * ein, fract(h2 * 5.));
  vec3 pc = h1 < .64 ? uDkB : (h1 < .88 ? uSkyTop : uCoral), ec = h1 < .64 || h1 > .88 ? uDkA : uDkB;
  return vec4(mix(pc, ec, 1. - smoothstep(.3 * rad - .03, .3 * rad, rho)), pet * clamp(2. * rad * pk - .5, 0., 1.));
}
void main(){
  vec3 n = vN / max(length(vN), 1e-4);
  vec3 toCam = cameraPosition - vWorld;
  float dist = max(length(toCam), 1e-3);
  float kind = vAux.y, near = 1. - smoothstep(40., 60., dist);
  vec3 base = vCol;
  float pxm = uPx / dist;                                   // pixels per metre here
  if (kind > 1.5 && kind < 2.5) {                           // rim stripe, coral and cream, 1.5 m
    float c = clamp(1.5 * pxm / 2. - .5, 0., 1.) * (1. - uSmear);
    float f = fract(vAux.z), sq = smoothstep(.0, .04, f) * (1. - smoothstep(.5, .54, f));
    base = mix(mix(uCream, uCoral, .5), mix(uCream, uCoral, sq), c) * .93;
  }
  if (kind > 3.5 && kind < 4.5) {                           // painted shadow oval on a plinth top
    float r2 = dot(vAux.zw, vAux.zw);
    base = mix(uOval, base, smoothstep(.85, 1., r2));
  }
  if (kind > 4.5 && kind < 5.5) {                           // foil: flat paint plus the analytic sky colour, in three flat steps
    float g = 1. - clamp(abs(toCam.y) / dist, 0., 1.);
    float st = floor(g * 3.99) / 3.;
    float rp = fract(length(vAux.zw) * 2.2 - .5);           // painted rings (uv = ring coordinates, 0 at the centre)
    base = mix(base, uSkyTop, .25 + .45 * st);
    base = mix(base, uCream, .5 * step(.01, dot(vAux.zw, vAux.zw)) * smoothstep(.0, .08, rp) * (1. - smoothstep(.16, .24, rp)) * clamp(.45 * pxm / 2. - .5, 0., 1.));
  }
  if (kind > 5.5 && kind < 6.5 && vObj.y < .03) {
    // THE CASTING YARD'S SETTING OUT (the world's round p4), on the floor itself (y 0) and UNDER the floor's own raked chequer: all of
    // it is laid into the ground tone here, before the chequer's lines, bed edges and alternate beds are worked over it just below,
    // so those keep their whole contrast on every tone of it.
    // THE STROBE DISC: from the wheel's foot to the ring of blades the floor is 48 alternate wedges in two close tones of its own
    // tan: the paler is the floor's paint times uWedge (the world works it out from the floor's paint: about 38 of 255 apart in one
    // channel on screen), the entry line down the middle of a pale one; cut by two scribed rings at 171 and 195 m. Beyond the
    // blades: scribed rings every 12 m to 330 m (clear of the floor's own painted rings) and 80 chalk lines struck from the centre.
    float ry = length(vObj.xz), kf = abs(toCam.y) / dist, az = atan(vObj.x, vObj.z);
    float on = step(152., ry) * step(ry, 470.), disc = step(152., ry) * step(ry, 209.);
    float wd = (.25 - abs(fract(az / .2617994 + .5) - .5)) * .2617994 * ry;
    base *= mix(vec3(1.), uWedge, disc * step(.001, uWedge.x) * smoothstep(-.6, .6, wd * pxm));
    float dr = disc > .5 ? abs(fract(ry / 24. + .375) - .5) * 24. : abs(fract(ry / 12. + .125) - .5) * 12.;
    base *= mix(vec3(1.), vec3(.6, .65, .76), on * step(ry, 335.) * clamp(1.7 * pxm * kf / 2. - .5, 0., 1.) * (1. - smoothstep(.7, .85, dr)));   // rings 1.7 m wide
    float da = abs(fract(az / .0785398 + .25) - .5) * .0785398 * ry;
    base = mix(base, mix(base, uCream, .72), on * (1. - disc) * clamp(1.2 * pxm * kf / 2. - .5, 0., 1.) * (1. - smoothstep(.48, .6, da)));   // chalk lines 1.2 m wide
  }
  if (kind > 5.5 && kind < 6.5) {                           // raked gravel of the yard: 24 m beds raked along x or z, chequerwise
    vec2 cell = floor(vObj.xz / 24.), fc = fract(vObj.xz / 24.);
    float alt = mod(cell.x + cell.y, 2.);
    float along = alt > .5 ? vObj.x : vObj.z;
    float f = fract(along / .5);
    float c = clamp(.5 * pxm * abs(toCam.y) / dist / 2. - .5, 0., 1.);
    base *= 1. - .15 * c * (abs(f - .5) * 2. - .5);
    float edge = min(min(fc.x, 1. - fc.x), min(fc.y, 1. - fc.y)) * 24.;
    float ce = clamp(.6 * pxm * abs(toCam.y) / dist / 2. - .5, 0., 1.);
    base = mix(base, base * vec3(.80, .84, .88), ce * (1. - smoothstep(.25, .45, edge)));
    base *= 1. - .09 * alt;
  }
  if (kind > .5 && kind < 1.5 && uDk.x > .5) {
    // THE DECKS PAINTED LIKE A STUDIO MODEL'S GROUND (the world's round p4; uDk.x: 1 marsh, 2 meadow, 3 snow, 4 wet slate). All of
    // it is paint in the deck's own space and repeats exactly once a sector (uDk.y, the fixed-thing pitch), so in lock it stands
    // still under the animals; sp runs 0 to 1 along a sector the way the casts' pose runs, so what is painted for a pose's place
    // lies under every cast that comes to it. Each mark's contrast fades before it is finer than two pixels; in the smear it goes.
    float r = length(vObj.xz), pk = pxm * abs(toCam.y) / dist / 2., live = 1. - smoothstep(0., .3, uSmear);
    float sg = fract(atan(vObj.x, vObj.z) / uDk.y), sp = uDk.w > 0. ? sg : 1. - sg, arc = uDk.y * r, dy = r - uDk.z;
    bool onBand = r > uDkR.x && r < uDkR.y;
    if (uDk.x < 2.5 && !onBand) {                           // the lawns: loose drifts of painted flowers, each a rosette of petals round an eye, laid on the lawn's own green
      float din; vec4 fl = lawnFlower(vObj, pk, din);
      base = mix(base, uCream, .16 * (1. - smoothstep(.55, .7, din)) * live);   // the heart of each drift a lighter green of the lawn, nothing more
      base = mix(base, fl.rgb, fl.a * live);
    }
    // (the meadow's own track band is live's and is left as live paints it: the worn clay strip, its scuffs and hoof prints of the earlier rounds are gone)
    if (uDk.x > 2.5 && uDk.x < 3.5) {                       // the snow: the trampled apron where a fox comes out of the mound, its take-off pit, the prints of its run between them, and an older train of prints off to each side
      float ax = (sp - .115) * arc, bx = (sp - .665) * arc, ea = ax * ax / 2.6 + dy * dy / .8, eb = bx * bx / .75 + dy * dy / .3;
      base = mix(base, uDkA, max(1. - smoothstep(.72, .9, ea), 1. - smoothstep(.65, .9, eb)) * live);
      base = mix(base, uDkB, max(smoothstep(.9, 1., ea) * (1. - smoothstep(1.25, 1.4, ea)), smoothstep(.9, 1., eb) * (1. - smoothstep(1.4, 1.6, eb))) * live * clamp(.3 * pk - .5, 0., 1.));
      float gx = sp * 20., hx = (fract(gx) - .5) * arc / 20., hy = dy - (mod(floor(gx), 2.) * 2. - 1.) * .21;
      float pr = (1. - smoothstep(.012, .024, hx * hx * .55 + hy * hy)) * step(.2, sp) * step(sp, .62);
      float t = (abs(dy) - 2.2) / .95, tc = floor(t) + .5, off = (.45 + (dy < 0. ? .028 : -.024) * tc) - sg, ox = (off - floor(off + .5)) * arc + (mod(floor(t), 2.) - .5) * .34, oy = (fract(t) - .5) * .95;
      pr = max(pr, (1. - smoothstep(.014, .028, ox * ox + oy * oy * .6)) * step(0., t) * step(t, 11.));
      base = mix(base, uDkA, pr * live * clamp(.32 * pk - .5, 0., 1.));
      // a painted contact shadow at the foot of each bare peg (the second train stands half a cast pitch, uDkC.x, between the first's plinths): on the turntable, so it goes with its cast
      float qx = (fract(atan(vObj.x, vObj.z) / max(uDkC.x, 1e-3)) - .5) * uDkC.x * r;
      base = mix(base, uDkA, (1. - smoothstep(.7, 1., qx * qx / 1.2 + dy * dy / .17)) * live * step(1e-3, uDkC.x));
    }
    if (uDk.x > 3.5) {                                      // the wet slate: two larger painted rings round each puddle, and off the track slabs with joints and chisel strokes
      float cx = (sg - floor(sg + .5)) * arc, d2 = dy * dy + cx * cx / .64;
      float rg3 = max(1. - smoothstep(2.4, 2.8, abs(d2 - 9.6)), max(1. - smoothstep(3.6, 4.05, abs(d2 - 20.25)), .85 * (1. - smoothstep(4.8, 5.3, abs(d2 - 34.8))) * step(abs(cx), .47 * arc)));   // three bands 0.9 m wide, 3.1, 4.5 and 5.9 m out (the second mend: were 0.7 m and fainter)
      base = mix(base, uCream, .92 * rg3 * live * clamp(.9 * pk - .5, 0., 1.));
      if (!onBand) {
        float cr = (r - uDkR.z) / 2.4, ci = floor(cr), cf = fract(cr), ga = sg * 3. + mod(ci, 2.) * .5, af = fract(ga), sa = arc / 3.;
        float tone = h3(vec3(mod(floor(ga), 3.), ci, 5.3));
        base *= 1. + (tone - .5) * .64 * live;
        vec2 q = vec2((af - .5) * sa, (cf - .5) * 2.4);
        float u1 = q.x * .8 + q.y * .6, v1 = q.y * .8 - q.x * .6;
        base = mix(base, mix(base, uCream, .28), (1. - smoothstep(.03, .07, abs(fract(v1 / .5 + tone) - .5) * .5)) * (1. - smoothstep(.45, .65, abs(u1))) * step(abs(v1), .7) * live * clamp(.14 * pk - .5, 0., 1.));
        base = mix(base, base * vec3(.6, .64, .74), (1. - smoothstep(.05, .12, min(min(cf, 1. - cf) * 2.4, min(af, 1. - af) * sa))) * live * clamp(.24 * pk - .5, 0., 1.));
      }
    }
  }
  if (kind > 7.5) {                                         // a ring at speed (the world's rope): soft lengthwise streaks, and the curtain of pegs under it
    float sAlong = atan(vObj.x, vObj.z) * max(length(vObj.xz), 1.), v = vAux.z;
    if (kind < 8.5) {
      float pulse = vnoise(vec3(sAlong * .13, v * .9, 2.7)), fine = vnoise(vec3(sAlong * .5, v * 6., 9.1)), fine2 = vnoise(vec3(sAlong * .28, v * 11., 4.3));
      float edge = smoothstep(.95, 2., abs(v));              // the fringe: fewer and thinner streaks toward its tip
      if (edge > 0. && vnoise(vec3(sAlong * .33, v * 3., 6.2)) * (1.15 - edge) < .34) discard;
      base = mix(base, mix(base, uCream, .5), smoothstep(.38, .8, pulse) * .8);
      base = mix(base, base * vec3(.66, .64, .68), smoothstep(.5, .78, fine) * .75);
      base = mix(base, mix(base, uCream, .7), smoothstep(.6, .85, fine2) * .6);
      base = mix(base, base * vec3(.7, .68, .72), smoothstep(.45, .8, v) * .55);          // a darker spine
      base = mix(base, mix(base, uCream, .6), (1. - smoothstep(-.75, -.4, v)) * .7);      // a pale belly line
      base = mix(base, uMean * .92, edge * .5);
    } else {
      float fq = exp2(floor(log2(clamp(pxm / 14., .125, 4.))));      // thin upright streaks, never finer than about two pixels
      float w = vnoise(vec3(sAlong * 3.1 * fq, 1.3, 4.)), w2 = vnoise(vec3(sAlong * 7.3 * fq, 7.7, 1.));
      if (max(w, w2 * .96) < .64) discard;
      base = mix(base, uCream, .3 * w2);
    }
  }
  if (kind < .5 && abs(vAux.w - 5.) < .5) {                 // a riser at speed (the world's skin): fine lengthwise threads in each tone band, lighter and darker, with tapered ends
    float sA = atan(vObj.x, vObj.z) * max(length(vObj.xz), 1.);
    float f1 = vnoise(vec3(sA * .22, vObj.y * 4.6, 3.1)), f2 = vnoise(vec3(sA * .11, vObj.y * 8.3, 7.7)), f3 = vnoise(vec3(sA * .4, vObj.y * 13., 1.9));
    base = mix(base, base * vec3(.84, .85, .89), smoothstep(.52, .74, f1) * .8);
    base = mix(base, mix(base, uCream, .55), smoothstep(.58, .8, f2) * .7);
    base = mix(base, base * vec3(.78, .8, .86), smoothstep(.66, .8, f3) * .6);
  }
  float wt = smoothstep(.31, .39, n.y), wu = 1. - smoothstep(-.34, -.26, n.y);
  if (kind > 7.5) { wt = 0.; wu = 0.; }
  float amt = (kind > 2.5 && kind < 3.5) ? .55 : 1.;        // brass takes the tones at half strength
  float lum = dot(base, vec3(.3, .5, .2));
  vec3 col = mix(base, mix(base, uCream, .3), wt * amt * smoothstep(.02, .3, lum));
  col = mix(col, base * uShade, wu * amt);
  // the painted shade side: every upright face is lit, half-tone or shade by which way it faces the painted sun
  // (flat steps, no falloff: still unlit paint). Tops and undersides keep their own tones.
  float hl = length(n.xz);
  float sdot = hl > 1e-3 ? dot(n.xz, uSunH) / hl : 1.;
  float upr = (1. - wt) * (1. - wu) * amt * (1. - step(6.5, kind));   // kind 7: painted scenery, one tone whichever way it stands
  float s0 = smoothstep(.83, .90, sdot), s1 = 1. - smoothstep(.60, .68, sdot), s2 = 1. - smoothstep(.27, .35, sdot);
  col = mix(col, mix(col, uCream, .18), upr * s0 * smoothstep(.02, .3, lum));   // facing the sun: a warm lift
  col = mix(col, col * mix(vec3(1.), uShade, .6), upr * s1);                    // turning away: half tone
  // turned away, or in the painted shadow of a drum, the mast or a blade: the shade tone. Within a few metres above a deck (or
  // the yard) the shade takes the chalk's bounce: a warmer, paler band along the foot of every riser
  float dark = max(upr * s2, castSh(vWorld) * (1. - wu) * amt * (1. - step(6.5, kind)));
  float hd = vWorld.y < 8. ? vWorld.y : (vWorld.y < 62. ? mod(vWorld.y - 8., 14.) : 9.);
  vec3 shd = shadeOf(base);
  shd = mix(shd, mix(shd * 1.1, uCream, .22), uWheel.y * (1. - wt) * (1. - smoothstep(.3, 3.6, hd)));
  col = mix(col, shd, dark);
  if (kind < .5 && abs(vAux.w - 8.) < .5) col = shadeOf(mix(vCol, uCream, .3));   // a painted cast shadow lying on a deck (the world's shadowProxy)
  if (kind < .5 && abs(vAux.w - 11.) < .5) {                // a LONG painted shadow (the world's, round p4); never off its deck
    float rr = length(vObj.xz);
    if (rr < uLongR.x || rr > uLongR.y) discard;
    // ONE TONE RULE ON EVERY DECK, made from live's own tones (the fourth mend). The deck's paint as live draws it here (a top
    // face's lift toward cream; the deck's own shade inside the painted shadow of a drum, the mast or a blade) is taken toward the
    // tone of live's lozenge (live's own line above, with the stands' chalk for vCol) until the lozenge is still 21 of 255 darker
    // in Rec. 709 luma on screen: so a lozenge lying on a long shadow reads on every deck. The mix number comes of the deck's plain
    // paint (picked by the radius), so a lawn's flowers under the shadow keep their step from the lawn; a paint darker than the
    // plain one is taken less far, and one already within 21 of the lozenge is left as it is.
    vec3 b = (rr > uLongR.z + .3 && rr < uLongR.w - .3) ? uLongB : ((rr > uLongR.z && rr < uLongR.w) ? uLongL : uLongG), bf = b;
    if (uDk.x > .5 && uDk.x < 2.5 && !(rr > uDkR.x && rr < uDkR.y)) {   // a lawn's flowers, as the deck paints them
      float din, lv = 1. - smoothstep(0., .3, uSmear); vec4 fl = lawnFlower(vObj, pxm * abs(toCam.y) / dist / 2., din);
      bf = mix(b, uCream, .16 * (1. - smoothstep(.55, .7, din)) * lv); bf = mix(bf, fl.rgb, fl.a * lv);
    }
    float cs = castSh(vWorld);
    vec3 lz = toScr(shadeOf(mix(uLongC, uCream, .3))), Y7 = vec3(.2126, .7152, .0722);
    vec3 d0 = toScr(mix(mix(b, mix(b, uCream, .3), smoothstep(.02, .3, dot(b, vec3(.3, .5, .2)))), shadeOf(b), cs));
    vec3 d1 = toScr(mix(mix(bf, mix(bf, uCream, .3), smoothstep(.02, .3, dot(bf, vec3(.3, .5, .2)))), shadeOf(bf), cs));
    col = ofScr(mix(d1, lz, clamp(1. - .0824 / max(min(dot(d0, Y7), dot(d1, Y7)) - dot(lz, Y7), 1e-4), 0., 1.)));
    col *= 1. - .16 * clamp(.4 * pxm * abs(toCam.y) / dist / 2. - .5, 0., 1.) * (abs(fract(rr / .4) - .5) * 2. - .5);   // the deck's rake lines run on through it
  }
  if (kind > 2.5 && kind < 3.5) {                           // brass: one fixed pale stripe by object angle
    float f = fract(vAux.z);
    col = mix(col, mix(col, uCream, .55), smoothstep(.10, .13, f) * (1. - smoothstep(.22, .25, f)));
  }
  if (kind > .5 && kind < 1.5) {                            // raked chalk: concentric lines 0.4 m apart
    float r = length(vObj.xz), f = fract(r / .4);
    float c = clamp(.4 * pxm * abs(toCam.y) / dist / 2. - .5, 0., 1.);
    col *= 1. - .16 * c * (abs(f - .5) * 2. - .5);
    float f2 = fract(r / 4.8 + .1);                         // a broad band every twelfth line keeps the deck from going blank
    col *= 1. - .05 * clamp(4.8 * pxm * abs(toCam.y) / dist / 2. - .5, 0., 1.) * step(.9, f2);
    float f3 = fract(r / 2.9 + .37);                        // at speed the deck streaks: broad concentric tone bands
    col *= 1. - .1 * uSmear * (smoothstep(0., .12, f3) - smoothstep(.42, .6, f3));
  }
  col *= 1. + (vnoise(vObj * 3.) - .5) * .10 * near;
  col *= 1. - .12 * near * (1. - smoothstep(.012, .02, abs(vAux.x)));
  col = mix(col, uMean, (.8 - .45 * step(.5, vAux.z)) * min(1., uSmear * 2.6) * step(kind, .5) * step(-.5, -abs(vAux.w - 7.)));   // casts only (w == 7 marks them): the mean coat by a third of the smear
  col = mix(col, uHaze, .35 * (1. - exp(-dist / 900.)));
  gl_FragColor = vec4(col * uLift, 1.);
  #include <fog_fragment>
}`,dt=`
attribute vec3 color; attribute vec4 aRig, aP0, aP1, aP2, aP3;
uniform float uSmear, uDir; uniform vec3 uBare;
varying vec3 vCol, vN, vObj, vWorld; varying vec4 vAux;
#include <common>
#include <fog_pars_vertex>
${Ie}
const vec3 SH = vec3(${ue[0]}, ${ue[1]}, ${ue[2]}), HP = vec3(${se[0]}, ${se[1]}, ${se[2]}), NK = vec3(0., ${be[1]}, ${be[2]});
void main(){
  float part = aRig.x, t = aRig.y, sd = aRig.z;
  vec3 p = position, n = normal;
  float k = abs(aP1.y) < .1 ? .1 : aP1.y, a0 = aP1.x;
  if (part > .5 && part < 2.5) {
    float tt = part > 1.5 ? 1. : t, a = a0 + k * tt;
    vec3 c = NK + ${Ne.toFixed(3)} * vec3(0., (cos(a0) - cos(a)) / k, (sin(a) - sin(a0)) / k);
    if (part < 1.5) {
      vec3 up = vec3(0., cos(a), -sin(a)), tg = vec3(0., sin(a), cos(a));
      p = c + vec3(position.x, 0., 0.) + up * (position.y - NK.y);
      n = vec3(normal.x, 0., 0.) + up * normal.y + tg * normal.z;
    } else { p = c + rX(position, -aP0.w); n = rX(normal, -aP0.w); }
  } else if (part > 2.5 && part < 3.5) {
    vec3 S = vec3(SH.x * sd, SH.yz), q = position - S;
    if (t > .5) { q.x -= sd * ${Fe.toFixed(3)}; q = rZ(q, sd * aP0.y); n = rZ(n, sd * aP0.y); q.x += sd * ${Fe.toFixed(3)}; }
    q = rZ(q, sd * aP0.x); n = rZ(n, sd * aP0.x);
    q = rY(q, sd * aP0.z); n = rY(n, sd * aP0.z);
    p = S + q;
  } else if (part > 3.5) {
    vec3 H = vec3(HP.x * sd, HP.yz), q = position - H;
    float hip = sd < 0. ? aP2.x : aP2.z, knee = sd < 0. ? aP2.y : aP2.w, ank = sd < 0. ? aP3.x : aP3.y;
    if (t > 1.5) { q.y += ${(me+je).toFixed(3)}; q = rX(q, ank); n = rX(n, ank); q.y -= ${(me+je).toFixed(3)}; }
    if (t > .5) { q.y += ${me.toFixed(3)}; q = rX(q, knee); n = rX(n, knee); q.y -= ${me.toFixed(3)}; }
    q = rX(q, hip); n = rX(n, hip); p = H + q;
  }
  vObj = p + vec3(aP1.w * 37., aP1.w * 11., 0.);
  vAux = vec4(aRig.w > 1.5 ? position.x : 9., 0., 1., 7.);   // z = 1: the hero's casts keep more of their own paint in the smear
  vCol = (aRig.w > .5 && aRig.w < 1.5 && aP1.z > .5) ? uBare : color;
  // into rotor space, then the smear: stretch along the helix to one pitch, squash across it
  vec3 rp = (instanceMatrix * vec4(p, 1.)).xyz, c0 = instanceMatrix[3].xyz;
  vec3 rn = mat3(instanceMatrix) * n;
  float rr = max(length(c0.xz), 1.);
  vec3 T = vec3(c0.z, 0., -c0.x) / rr * uDir;
  vec3 rel = rp - c0; float d = dot(rel, T);
  vec3 perp = rel - T * d;
  float dd = d * mix(1., aP3.z, uSmear), ang = uDir * dd / rr * uSmear;
  vec3 sp = c0 + perp * mix(1., .6, uSmear) + vec3(0., dd * aP3.w * uSmear, 0.);
  rp = rY(sp, ang) + T * dd * (1. - uSmear);
  rn = mix(rn, vec3(rn.x, rn.y * 2., rn.z), uSmear);
  vec4 wp = modelMatrix * vec4(rp, 1.);
  vWorld = wp.xyz; vN = mat3(modelMatrix) * rn;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ue=`
attribute vec3 color; attribute float aKind;
uniform float uSmear, uDir, uUnroll; uniform vec3 uCream;
varying vec3 vCol, vN, vObj, vWorld; varying vec4 vAux;
#include <common>
#include <fog_pars_vertex>
${Ie}
void main(){
  vec3 p = position, n = normal;
  vObj = position; vCol = color; vAux = vec4(9., aKind, uv);
  #ifdef USE_INSTANCING
    p = (instanceMatrix * vec4(p, 1.)).xyz; n = mat3(instanceMatrix) * n;
    vObj = p * .5;
    float w = (uv.x - .5) * uSmear * uv.y * uUnroll;        // uUnroll: share of one pitch a peg's blur covers
    vCol = mix(color, uCream, .3 * uSmear);
    p = rY(p, uDir * w * ${xe.toFixed(5)}); p.y += w * ${Te.toFixed(3)};
    n = rY(n, uDir * w * ${xe.toFixed(5)});
  #endif
  vec4 wp = modelMatrix * vec4(p, 1.);
  vWorld = wp.xyz; vN = mat3(modelMatrix) * n;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;function ht(t,C){const m={uSmear:{value:0},uUnroll:{value:.13},uDir:{value:1},uLift:{value:C},uPx:{value:700},uHaze:{value:new g.Color("#EFE6D2")},uMean:{value:t.blue.clone().lerp(t.cream,.25)},uCream:{value:t.cream.clone()},uShade:{value:new g.Color(.7,.77,.86)},uBare:{value:new g.Color("#EDE8DC")},uOval:{value:new g.Color("#9FB0BC")},uCoral:{value:t.coral.clone()},uSkyTop:{value:t.blue.clone()},uSunH:{value:new g.Vector2(Math.sin(3.04),Math.cos(3.04))},uSunD:{value:new g.Vector3(Math.sin(3.04),0,Math.cos(3.04))},uWheel:{value:new g.Vector4(0,0,0,0)}},L=M=>new g.ShaderMaterial({uniforms:g.UniformsUtils.merge([g.UniformsLib.fog,{}]),vertexShader:M,fragmentShader:Qe,fog:!0,side:g.FrontSide}),r=L(dt),h=L(Ue),s=L(Ue);for(const M of[r,h,s])Object.assign(M.uniforms,m);return{cast:r,paint:h,brass:s,shared:m}}function ft(t,C,m){const L=ce(5.5,15,t),r=ce(190,239,t),h=t%ze/ze*fe,s=[1,.55,.2][t]||0,M=oe(.46,.64,L)*(1-.5*r);let A=.1+M*Math.sin(h)+.22*r,q=-.12+M*.9*Math.sin(h-1.1)-.08*r;A=oe(A,1.02,s),q=oe(q,-.95,s);const v=.09*Math.cos(h)*(1-s)+.12*s,V=ce(1,12,t),n=oe(1.3,.2,V)-.1*r,x=oe(-.45,-.24,V),j=oe(-.12,-.06,V)-.1*Math.sin(h)*(1-L),T=t*fe/6,P=1-s,F=S=>{const B=.52*Math.sin(S)*P,y=(-.15-.75*Math.max(0,-Math.cos(S)))*P,te=-(B+y)+.35*Math.max(0,Math.sin(S))*Math.max(0,-Math.cos(S))*P;return[oe(B,1.4,L),oe(y,.1,L),oe(te,1.3,L)]},o=F(T),b=F(T+Math.PI),f=oe(1,.24,r),w=_e+4.6*Math.pow(r,1.3),z=Oe+1.86+(t<Ee?0:Te*(t-Ee+1))+4.5*r*r,_=.32*ce(5,10,t)*(1-.55*ce(12,30,t))+.4*r,p=-.13*C*L*(1-r),u=.5*r,E=C*t*xe,k=3.05*f,G=xe*w;return{r:w,y:z,phi:E,scale:f,pitch:_,bank:p,heading:Math.atan2(C*Math.cos(E),-C*Math.sin(E))-C*u,P0:[A,q,v,j],P1:[n,x,m.has(t)?1:0,t*.61803%1],P2:[o[0],o[1],b[0],b[1]],P3:[o[2],b[2],Math.max(1,1.45*G/k),t<Ee?0:Te/G]}}function ut(t){const C=Le(),m=6,L=t.ochre,r=t.ochre.clone().lerp(t.slate,.3),h=[[0,1.9],[.012,1.9],[.014,1.25],[.03,1.15],[.032,.62],[.5,.5],[.965,.4],[.972,.9],[.99,1],[1,.35]];for(let s=0;s<h.length-1;s++)for(let M=0;M<m;M++){const A=M/m*fe,q=(M+1)/m*fe,[v,V]=h[s],[n,x]=h[s+1],j=[Math.sin(A)*V,v,Math.cos(A)*V],T=[Math.sin(q)*V,v,Math.cos(q)*V],P=[Math.sin(q)*x,n,Math.cos(q)*x],F=[Math.sin(A)*x,n,Math.cos(A)*x],o=[Math.sin((A+q)/2),(V-x)*3,Math.cos((A+q)/2)],b=[M/m,1],f=[(M+1)/m,1],w=s===1||s===6?r:L;C.tri(j,T,P,w,[3,0,0,0],null,null,o,b,f,f),C.tri(j,P,F,w,[3,0,0,0],null,null,o,b,f,b)}return C.geometry(!1)}function mt(){const t=Le(),C=new g.Color(0,0,0),m=[1,0,0],L=[0,1,0],r=[0,0,0,0],h=[[-.8,.07,.04],[-.48,.22,.01],[-.08,.34,-.03],[.3,.32,0],[.54,.18,.06]];for(let n=0;n<4;n++){const[x,j,T]=h[n],[P,F,o]=h[n+1];t.quad([0,T+j,x],[0,T-j,x],[0,o-F,P],[0,o+F,P],C,r,r,r,r,m)}for(const n of[-1,1])t.tri([0,.05,-.7],[n*.26,.02,-1.16],[0,.03,-1.26],C,r,r,r,L);for(let n=0;n<5;n++){const x=n/5,j=(n+1)/5,T=oe(.15,.085,Math.pow(x,.7)),P=oe(.15,.085,Math.pow(j,.7)),F=be[2]+x*Ne,o=be[2]+j*Ne,b=[1,x,0,0],f=[1,j,0,0];t.quad([0,be[1]+T,F],[0,be[1]-T,F],[0,be[1]-P,o],[0,be[1]+P,o],C,b,b,f,f,m)}const s=[2,1,0,0];t.quad([0,.11,-.07],[0,-.11,-.07],[0,-.08,.38],[0,.08,.38],C,s,s,s,s,m),t.tri([0,.06,.38],[0,-.06,.38],[0,-.03,.81],C,s,s,s,m);const M=[0,.55,Fe,1.6,2],A=[.25,.37,.43,.3,.1],q=[-.62,-.66,-.62,-.52,-.34],v=[-.3,.02,.3,.58,.86],V=[.6,.74,.74,.66,.54];for(const n of[-1,1]){const x=(u,E)=>[ue[0]*n+n*M[u],ue[1],ue[2]+E],j=u=>[3,u>2?1:0,n,0],T=[3,1,n,0];for(let u=0;u<4;u++)t.quad(x(u,A[u]),x(u+1,A[u+1]),x(u+1,q[u+1]),x(u,q[u]),C,j(u),j(u+1),j(u+1),j(u),L);for(let u=0;u<5;u++){const E=oe(A[4]-.02,q[4]+.04,u/4),k=x(4,E+.08),G=x(4,E-.08);t.tri(k,G,[k[0]+n*Math.cos(v[u])*V[u],k[1],ue[2]+E-Math.sin(v[u])*V[u]],C,T,T,T,L)}const P=se[0]*n,F=(u,E)=>[[P,se[1]+u,se[2]+E],[P,se[1]+u,se[2]-E]],o=[4,0,n,0],b=[4,1,n,0],f=[4,2,n,0],w=F(.06,.17),z=F(-me,.08),_=F(-me-je,.06),p=se[1]-me-je;t.quad(w[0],w[1],z[1],z[0],C,o,o,o,o,m),t.quad(z[0],z[1],_[1],_[0],C,b,b,b,b,m),t.tri([P,p+.06,se[2]-.12],[P,p-.02,se[2]-.12],[P,p,se[2]+.34],C,f,f,f,m)}return t.geometry(!0)}async function vt(t,C={}){const m=t.rng.fork?t.rng.fork("ascension"):t.rng,L=C.palette||["#F3EAD6","#7FA6B8","#E2725B","#D9A441","#9DB58A","#2E3A46"],r={cream:new g.Color(L[0]),blue:new g.Color(L[1]),coral:new g.Color(L[2]),ochre:new g.Color(L[3]),sage:new g.Color(L[4]),slate:new g.Color(L[5])};r.plaster=new g.Color("#D8CEB6");const h=We(C.detail??1,.6,1),s=C.dir===-1?-1:1,M=C.tick||12,A=ht(r,C.lift??1.15);A.shared.uDir.value=s;const q=new g.Group;q.name="ascension";const v=new g.Group;v.name="ascension-rotor",q.add(v);const V=new Set;for(let i=0;i<Re/ze;i++)V.add(i*ze+m.int(0,ze-1));const n=m.int(0,2),x=m.range(.15,.85),j=m.int(0,47),T=m.int(0,2),P=m.int(0,2),F=lt(r,P);await t.yield();const o=new g.InstancedMesh(F,A.cast,Re),b=ut(r),f=new g.InstancedMesh(b,A.brass,Re),w=[0,1,2,3].map(()=>new Float32Array(Re*4)),z=new g.Object3D;z.rotation.order="YXZ";const _=[],p=new g.Vector3,u=new g.Vector3,E=new g.Vector3(0,1,0);for(let i=0;i<Re;i++){const e=ft(i,s,V);_.push(e);const c=Math.sin(e.phi)*e.r,d=Math.cos(e.phi)*e.r;z.position.set(c,e.y,d),z.rotation.set(-e.pitch,e.heading,e.bank),z.scale.setScalar(e.scale),z.updateMatrix(),o.setMatrixAt(i,z.matrix),w[0].set(e.P0,i*4),w[1].set(e.P1,i*4),w[2].set(e.P2,i*4),w[3].set(e.P3,i*4),u.set(c,e.y-.2*e.scale,d),i<Ee?p.set(c,Oe,d):p.set(Math.sin(e.phi)*ne*.96,Math.max(1.3,u.y-3.3-1.2*(1-e.scale)),Math.cos(e.phi)*ne*.96);const H=p.distanceTo(u),l=.1*oe(.6,1,e.scale);z.position.copy(p),z.quaternion.setFromUnitVectors(E,u.clone().sub(p).normalize()),z.scale.set(l,H,l),z.updateMatrix(),f.setMatrixAt(i,z.matrix),i%80===79&&await t.yield()}z.rotation.order="XYZ",["aP0","aP1","aP2","aP3"].forEach((i,e)=>F.setAttribute(i,new g.InstancedBufferAttribute(w[e],4))),o.frustumCulled=!1,f.frustumCulled=!1,o.instanceMatrix.needsUpdate=!0,f.instanceMatrix.needsUpdate=!0,v.add(o,f),await t.yield();const k=Le(),G=(i,e,c=0,d=0)=>{for(let H=0;H<i.length-1;H++){const l=i[H],$=i[H+1],D=$.y-l.y,N=$.r-l.r,X=l.kind||0;for(let W=0;W<e;W++){const R=d+W/e*fe,U=d+(W+1)/e*fe,J=(R+U)/2,Q=[Math.sin(R)*l.r,l.y,Math.cos(R)*l.r],O=[Math.sin(U)*l.r,l.y,Math.cos(U)*l.r],ee=[Math.sin(U)*$.r,$.y,Math.cos(U)*$.r],Y=[Math.sin(R)*$.r,$.y,Math.cos(R)*$.r],ae=[Math.sin(J)*D,-N,Math.cos(J)*D],he=[X,0,0,0],re=l.u!==void 0?l.u:W/e*c,le=l.u!==void 0?l.u:(W+1)/e*c,ke=$.u!==void 0?$.u:re,qe=$.u!==void 0?$.u:le;l.r>1e-4&&k.tri(Q,O,ee,l.col,he,he,he,ae,[re,0],[le,0],[qe,0]),$.r>1e-4&&k.tri(Q,ee,Y,l.col,he,he,he,ae,[re,0],[qe,0],[ke,0])}}},S=r.plaster,B=r.plaster.clone().lerp(r.cream,.35),y=r.ochre,te=r.slate.clone().lerp(r.plaster,.35),pe=r.plaster.clone().lerp(r.sage,.55),ve=r.plaster.clone().lerp(r.blue,.5),a=(i,e,c,d,H)=>({r:i,y:e,col:c,kind:d,u:H}),de=[a(4.3,0,S),a(4.3,.8,B),a(4,1.05,te),a(3.9,1.1,S),a(3.9,1.9,ve),a(4.1,2.15,ve),a(4.1,2.45,B),a(3.4,2.9,S),a(2.75,3.3,S),a(2.45,4.1,B),a(2.45,4.5,S),a(ne+.06,4.9,S)],Ae=ct/10;for(let i=0;i<9;i++){const e=4.9+i*Ae*.985,c=e+Ae*.985,d=i%2?S:S.clone().lerp(r.cream,.3);de.push(a(ne,e+.25,d),a(ne+.05,(e+c)/2,d),a(ne,c-.2,te),a(ne-.07,c-.12,te),a(ne-.07,c-.04,S),a(ne+.06,c,S))}const ie=de[de.length-1].y;de.push(a(ne,ie+2.6,pe),a(2.35,ie+3,pe),a(2.35,ie+3.5,B),a(3,ie+4.4,B),a(3.2,ie+4.5,r.coral),a(3.2,ie+5,B),a(2.9,ie+5.2,S),a(2.2,ie+5.35,S));const I=ie+5.35;n===0?de.push(a(.9,I+.5,y,3,.4),a(.6,I+.9,y,3,.05),a(1.25,I+1.5,y,3,.17),a(1.5,I+2.3,y,3,.3),a(1.25,I+3.1,y,3,.6),a(.5,I+3.6,y,3,.7),a(.22,I+3.9,y,3,.8),a(0,I+5.6,y)):n===1?de.push(a(1.6,I+.5,S),a(1,I+1,ve),a(1.5,I+1.5,ve),a(.8,I+2.1,B),a(1.15,I+2.6,r.coral),a(.6,I+3.2,B),a(.8,I+3.6,y,3,.17),a(.4,I+4.1,y,3,.6),a(0,I+6,y)):de.push(a(1.2,I+.6,S),a(1,I+1.4,pe),a(1.9,I+2.6,pe),a(2.3,I+3.4,B),a(2.3,I+3.6,r.coral),a(1.9,I+3.6,S),a(1.2,I+2.9,S),a(.5,I+3,y,3,.17),a(.3,I+4.2,y,3,.6),a(0,I+5.4,y)),await t.yield(),G(de,24,0,xe/2);const we=de[de.length-1].y;await t.yield();const Ge=h<.8?12:24;for(let i=0;i<9;i++){const e=7+(i+x)*11,c=T===2?.34:.26,d=ne+.17;G([a(ne,e-c-.1,y,3,.9),a(d,e-c,y,3,.02),a(d,e-.06,y,3,.17),a(d,e+.06,y,3,.4),a(d,e+c,y,3,.9),a(ne,e+c+.1,y)],24,0,xe/2),T===1&&G([a(ne,e+c+.25,r.coral),a(ne+.09,e+c+.3,r.coral),a(ne+.09,e+c+.5,r.coral),a(ne,e+c+.55,r.coral)],24,0,xe/2);for(let H=0;H<Ge;H++){const l=H/Ge*fe,$=Math.sin(l),D=Math.cos(l),N=D,X=-$,W=d*Math.cos(xe/2)-.01,R=.075,U=.085,J=[$*(W+R),e,D*(W+R)],Q=[[-U,0],[0,U],[U,0],[0,-U]].map(([O,ee])=>[$*W+N*O,e+ee,D*W+X*O]);for(let O=0;O<4;O++)k.tri(Q[O],Q[(O+1)%4],J,te,[0,0,0,0],null,null,[$,(Q[O][1]+Q[(O+1)%4][1]-2*e)*4,D])}i%3===2&&await t.yield()}await t.yield();const He=.94+(j/47-.5)*3,$e=xe/4,Ye=ne-.08,Se=3.3,Ce=Te/2,et=Math.ceil((5.3-He)/Ce),tt=Math.floor((ie+2.3-He)/Ce),ot=h<.8?4:2,ye=(i,e,c)=>[Math.sin(e)*i,c,Math.cos(e)*i],K=[0,0,0,0];for(let i=et;i<=tt;i++){const e=s*i*(xe/2),c=e-s*$e,d=e+s*$e,H=He+i*Ce,l=Math.cos(e)*s,$=-Math.sin(e)*s,D=ye(Ye,c,H),N=ye(Se,c,H),X=ye(Se,d,H),W=ye(Ye,d,H),R=(Y,ae)=>[Y[0],Y[1]-ae,Y[2]],U=(Y,ae)=>[Y[0],Y[1]+ae,Y[2]];k.quad(D,N,X,W,B,K,K,K,K,[0,1,0]),k.quad(R(D,.1),R(N,.1),R(X,.1),R(W,.1),S,K,K,K,K,[0,-1,0]),k.quad(R(N,.14),R(X,.14),X,N,i%2?r.coral:B,K,K,K,K,[Math.sin(e),0,Math.cos(e)]),k.quad(R(D,Ce+.1),R(N,Ce+.1),N,D,ve,K,K,K,K,[-l,0,-$]);const J=U(ye(Se,c,H-Ce*.5),1.15),Q=U(ye(Se,d,H+Ce*.5),1.15),O=[3,0,0,0],ee=[Math.sin(e),.2,Math.cos(e)];if(k.tri(R(J,.13),R(Q,.13),Q,y,O,O,O,ee,[.5,0],[.5,0],[.17,0]),k.tri(R(J,.13),Q,J,y,O,O,O,ee,[.5,0],[.17,0],[.17,0]),k.quad(J,Q,ye(Se-.1,d,Q[1]),ye(Se-.1,c,J[1]),y,O,O,O,O,[0,1,0]),i%ot===0){const Y=ye(Se-.04,e,H),ae=.035,he=[[ae,0],[-ae*.5,ae*.87],[-ae*.5,-ae*.87]].map(([re,le])=>[Y[0]+Math.sin(e)*re+l*le,H,Y[2]+Math.cos(e)*re+$*le]);for(let re=0;re<3;re++){const le=he[re],ke=he[(re+1)%3];k.quad(le,ke,U(ke,1.04),U(le,1.04),te,K,K,K,K,[(le[0]+ke[0])/2-Y[0],0,(le[2]+ke[2])/2-Y[2]])}}i%32===0&&await t.yield()}for(let i=0;i<Ee;i++){const e=_[i],c=Math.sin(e.phi)*e.r,d=Math.cos(e.phi)*e.r,H=Math.sin(e.heading),l=Math.cos(e.heading),$=l,D=-H,N=(ee,Y,ae)=>[c+H*ee+$*Y,ae,d+l*ee+D*Y],X=1.25,W=.62,R=.08,U=[N(-X,-W,0),N(X,-W,0),N(X,W,0),N(-X,W,0)],J=[N(-X+R,-W+R,Oe),N(X-R,-W+R,Oe),N(X-R,W-R,Oe),N(-X+R,W-R,Oe)];for(let ee=0;ee<4;ee++){const Y=(ee+1)%4;k.quad(U[ee],U[Y],J[Y],J[ee],ee%2?S:B,K,K,K,K,[(U[ee][0]+U[Y][0])/2-c,.3,(U[ee][2]+U[Y][2])/2-d])}const Q=[4,0,0,0],O=[[-1.25,-1.45],[1.25,-1.45],[1.25,1.45],[-1.25,1.45]];k.tri(J[0],J[1],J[2],B,Q,Q,Q,[0,1,0],O[0],O[1],O[2]),k.tri(J[0],J[2],J[3],B,Q,Q,Q,[0,1,0],O[0],O[2],O[3])}const Ve=C.deck!==!1;if(Ve){const i=h<.8?72:96,e=(D,N,X)=>a(D,N,X,1);G([a(34.3,-12,te),a(34.3,-11.2,ve),a(34,-10.9,S),a(34,-6.2,te),a(33.9,-6.1,te),a(33.9,-5.9,S),a(34,-5.8,S),a(34,-1.7,te),a(34.12,-1.6,B,2),a(34.12,-.1,B),a(34,0,B),a(34,.32,B),a(33.45,.32,S),a(33.45,0,B,1),e(27,0,B),e(20,0,B),e(13.2,0,B),a(12.9,0,r.coral),e(12.6,0,pe),e(11,0,pe),e(9.4,0,pe),a(9.1,0,r.coral),e(8.8,0,B),e(6.4,0,B),a(4.3,0,B)],i,72);const c=[0,0,0,0],d=34.02,H=fe/24,l=(D,N,X)=>[Math.sin(N)*D,X,Math.cos(N)*D],$=ve.clone().lerp(r.slate,.12);for(let D=0;D<24;D++){const N=D*H,X=l(1,N,0),W=.4/d;k.quad(l(d+.3,N-W,-10.9),l(d+.3,N+W,-10.9),l(d+.3,N+W,-1.9),l(d+.3,N-W,-1.9),B,c,c,c,c,X),k.quad(l(d+.36,N-W*1.3,-2.3),l(d+.36,N+W*1.3,-2.3),l(d+.36,N+W*1.3,-1.8),l(d+.36,N-W*1.3,-1.8),r.coral,c,c,c,c,X);for(const Q of[.27,.73]){const O=N+H*Q,ee=l(1,O,0);for(const[ae,he,re,le,ke]of[[d+.03,1.3,-5.7,-3.15,r.cream],[d+.06,1.08,-5.55,-3.2,$]]){const qe=he/d,Pe=[l(ae,O-qe,re)];for(let Me=0;Me<=6;Me++){const Je=Math.PI*(Me/6);Pe.push(l(ae,O-qe*Math.cos(Je),le+he*Math.sin(Je)))}Pe.push(l(ae,O+qe,re));const it=l(ae,O,(le+re)/2);for(let Me=0;Me<Pe.length;Me++)k.tri(it,Pe[Me],Pe[(Me+1)%Pe.length],ke,c,c,c,ee)}const Y=.38/d;k.quad(l(d+.09,O-Y,-4.4),l(d+.09,O+Y,-4.4),l(d+.09,O+Y,-3.3),l(d+.09,O-Y,-3.3),te,c,c,c,c,ee)}const R=N+H*.5,U=.55/d,J=l(1,R,0);k.quad(l(d+.03,R-U*1.3,-10.9),l(d+.03,R+U*1.3,-10.9),l(d+.03,R+U*1.3,-8.7),l(d+.03,R-U*1.3,-8.7),r.cream,c,c,c,c,J),k.quad(l(d+.06,R-U,-10.9),l(d+.06,R+U,-10.9),l(d+.06,R+U,-8.9),l(d+.06,R-U,-8.9),te,c,c,c,c,J)}await t.yield()}await t.yield();const Ke=new g.Mesh(k.geometry(!1),A.paint);Ke.frustumCulled=!1,v.add(Ke),await t.yield();const Z={mode:"auto",u:0,angle:0,smear:0,locked:!1,offset:0,started:!1},ge=new g.Vector3;let Xe=0;const De={object:q,rotor:v,uniforms:A.shared,state:Z,follow:C.follow??1,drift:C.drift??.14,slowTurns:C.slowTurns??2.4,tick:M,slowRate:.3,setProgress(i){Z.mode="progress",Z.u=We(i,0,1)},setManual(i,e){if(i==null){Z.mode="progress";return}Z.mode="manual",Z.angle=i,Z.smear=We(e||0,0,1)}},at=i=>{const e=De.tick*i+.37,c=e-Math.floor(e);return Math.floor(e)+ce(.8,1,c)};function st(i,e,c){let d=0,H=!1,l=0;if(c){ge.setFromMatrixPosition(c.matrixWorld),q.worldToLocal(ge),ge.x*ge.x+ge.z*ge.z>1e-4&&(Xe=Math.atan2(ge.x,ge.z));const D=t.renderer?.domElement?.height||900;A.shared.uPx.value=.5*D*c.projectionMatrix.elements[5]}if(Z.mode==="manual"){v.rotation.y=Z.angle,A.shared.uSmear.value=Z.smear;return}if(Z.mode==="progress"){const D=Z.u;d=Math.max(ce(.3,.4,D)*(1-ce(.44,.47,D)),ce(.78,.805,D)*(1-ce(.815,.84,D))),H=D>=.42&&D<.81,l=s*De.slowTurns*fe*D}else{const D=e%36;d=Math.max(ce(7,9.5,D)*(1-ce(10,11.2,D)),ce(28.5,30.2,D)*(1-ce(30.6,32,D))),H=D>=9.75&&D<30.4,l=s*De.slowRate*e}const $=H?De.follow*Xe+s*De.drift*e-s*xe*at(e):l;Z.started&&H!==Z.locked&&(Z.offset=Z.angle-$),Z.started=!0,Z.locked=H,Z.smear=d,Z.angle=$+Z.offset,v.rotation.y=Z.angle,A.shared.uSmear.value=d}const nt=_[Re-1].y,Ze=[];for(let i=0;i<=12;i++){const e=Math.PI-i/12*fe;Ze.push(new g.Vector3(Math.sin(e)*24,oe(13,58,i/12),Math.cos(e)*24))}const rt={mastFoot:new g.Vector3(0,0,0),crown:new g.Vector3(0,we,0),garland:{radius:_e,reach:_e+2.7,yFirst:_[0].y,yLast:nt,flareRadius:18.5,pitch:Te*ze,perTurn:ze,dir:s},orbit:{radius:24,yFrom:13,yTo:58,clockwise:!0},flyThrough:Ze,viewpoints:[{name:"wide",position:new g.Vector3(0,34,78),target:new g.Vector3(0,52,0)},{name:"inside",position:new g.Vector3(-24,36,0),target:new g.Vector3(0,78,6)},{name:"foot",position:new g.Vector3(15,3.2,17),target:new g.Vector3(6,3.5,6)}],portalSeat:{position:new g.Vector3(0,-46,250),facing:new g.Vector3(0,0,-1),radius:7}};return Object.assign(De,{radius:Ve?34:19,height:we,center:new g.Vector3(0,we*.47,0),anchors:rt,update:st,dispose(){},ground:!0,groundY:Ve?-12:0})}export{Ie as GLSL_COMMON,Qe as PAINT_FRAG,Ue as PAINT_VERT,mt as buildCraneLong,vt as buildHero,Le as makeSoup,Be as ringPts};
