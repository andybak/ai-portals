import*as e from"three";import"three/addons/utils/BufferGeometryUtils.js";import{clamp as ae,lerp as E,smoothstep as G,makeRng as He,hashSeed as Ue}from"../kit/core.js";const Ye=["#B4492C","#EFE3C8","#7CCBB8","#1F6F74","#22262C","#9CC3DA","#E9A66B"],ne=25,K=11,se=`
float h12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h12(i), h12(i+vec2(1.,0.)), f.x), mix(h12(i+vec2(0.,1.)), h12(i+vec2(1.,1.)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for(int i=0;i<4;i++){ s += a*vn(p); p = p*2.03 + 17.1; a *= .5; } return s; }
`,ge=`
uniform float uTime, uTintK;
uniform vec3 uTintA, uTintB, uTintFar, uAbsorb;
float gSeaAdd = .11;                                  // how much of the water's own colour is laid over a surface (her black back takes less)
// c: lit colour of a surface under water; depth: metres below the surface; wp: world position
vec3 seaTint(vec3 c, float depth, vec3 wp){
  depth = max(depth, 0.);
  vec3 v = cameraPosition - wp; float vl = max(length(v), 1e-3);
  float cosv = clamp(abs(v.y) / vl, .16, 1.);
  float under = cameraPosition.y > 0. ? depth / cosv : vl;          // sight line through water, metres
  under = min(under, 400.);
  // light goes down, then comes back up: each colour dies at its own rate (red within a few metres, green and blue slowly), so
  // the 1-3 m banks stay pale aqua over cream sand and the 12 m channel is a deep clear turquoise
  float pl = (depth * .55 + min(under, 60.) * .45) * (uTintK / .072);
  vec3 tr = exp(-pl * vec3(.26, .050, .034) * (vec3(1.) + (vec3(1.) - uAbsorb) * .6));
  float k = 1. - tr.g;
  vec3 tint = mix(uTintA, uTintB, smoothstep(1.5, 11., depth));
  float far = smoothstep(60., 300., under);
  vec3 body = c * tr + tint * (gSeaAdd * 2.6 * k);
  return mix(body, uTintFar * 1.1, far * .85);
}
// a moving net of bright lines, 0..1 (two scrolling layers of folded noise)
float caustic(vec2 p, float t){
  vec2 q = p * .42 + vec2(t * .11, -t * .07);
  float a = abs(vn(q + vn(q * 1.7 + 3.) * .9) - .5);
  vec2 r = p * .63 + vec2(-t * .09, t * .12) + 11.;
  float b = abs(vn(r + vn(r * 1.5 - 5.) * .9) - .5);
  float n = (1. - smoothstep(0., .09, a)) * .7 + (1. - smoothstep(0., .07, b)) * .6;
  return clamp(n, 0., 1.);
}
`,Be=`
uniform float uPhase, uAmp, uTilt, uLift, uRise, uDepth, uTrim;
float bendAt(float s){
  float a = smoothstep(.30, 1., s); a = a * sqrt(a) * uAmp;
  float head = (1. - smoothstep(0., .34, s)) * uAmp * -.10;
  return (a + head) * sin(uPhase - s * 5.2);
}
vec3 titanDeform(vec3 p, vec4 d, vec3 root, inout vec3 n){
  // flippers trim: a slow feathering about the root, the near front one raised with the tilt
  if (d.z > .5) {
    float side = sign(root.x), fore = step(d.z, 2.5);
    float ang = sin(uTrim + d.z * 1.7) * .07 + uTilt * (side > 0. ? mix(.10, .20, fore) : -.12);
    float c = cos(ang * side), s = sin(ang * side);
    vec3 q = p - root; q.xy = vec2(c * q.x - s * q.y, s * q.x + c * q.y); p = root + q;
    n.xy = vec2(c * n.x - s * n.y, s * n.x + c * n.y);
  }
  float sz = d.y, s = clamp((${K.toFixed(1)} - sz) / ${ne.toFixed(1)}, 0., 1.);
  // the head and shoulders lift for the breath
  float lf = 1. - smoothstep(.06, .34, s);
  p.y += uLift * lf;
  // sideways wave growing toward the tail; sections turn with the slope so nothing shears
  float x0 = bendAt(s), e = .012;
  float slope = (bendAt(s + e) - bendAt(s - e)) / (2. * e) / -${ne.toFixed(1)};
  float inv = inversesqrt(1. + slope * slope), ca = inv, sa = slope * inv;
  vec3 q = p - vec3(0., 0., sz);
  p = vec3(x0 + ca * q.x + sa * q.z, q.y, sz - sa * q.x + ca * q.z);
  n = vec3(ca * n.x + sa * n.z, n.y, -sa * n.x + ca * n.z);
  // roll about her long axis: +X (the camera's side) rises
  float ct = cos(uTilt * .56), st = sin(uTilt * .56);
  p.xy = vec2(ct * p.x - st * p.y, st * p.x + ct * p.y);
  n.xy = vec2(ct * n.x - st * n.y, st * n.x + ct * n.y);
  p.y += uDepth + uRise;
  // never through the surface: everything above -0.9 m is pressed under an asymptote at -0.6 m
  float over = p.y + .9;
  if (over > 0.) p.y = -.9 + .3 * (1. - exp(-over / .3));
  return p;
}
`;function Pe(){const S=[],h=[],n=[],w=[],B=[],x={count:0,v(u,y,v,d,k,a=0,s=0,r=null,c=null){return S.push(u,y,v),h.push(d,k,a,s),r?n.push(r[0],r[1],r[2]):n.push(0,0,k),c?w.push(c.r,c.g,c.b):w.push(0,0,0),x.count++},tri(u,y,v){B.push(u,y,v)},skin(u,y=!0){for(let v=0;v<u.length-1;v++){const d=u[v],k=u[v+1],a=d.length;for(let s=0;s<a;s++){const r=(s+1)%a;y?B.push(d[s],d[r],k[s],d[r],k[r],k[s]):B.push(d[s],k[s],d[r],d[r],k[s],k[r])}}},build(){const u=new e.BufferGeometry;return u.setAttribute("position",new e.Float32BufferAttribute(S,3)),u.setAttribute("aData",new e.Float32BufferAttribute(h,4)),u.setAttribute("aRoot",new e.Float32BufferAttribute(n,3)),u.setAttribute("aCol",new e.Float32BufferAttribute(w,3)),u.setIndex(B),u.computeVertexNormals(),u}};return x}function ee(S){const h=S.length,n=S[0].length-1,w=S.map((B,x)=>{const u=S[Math.max(0,x-1)],y=S[Math.min(h-1,x+1)],v=[];for(let d=1;d<=n;d++)v.push((y[d]-u[d])/Math.max(1e-6,y[0]-u[0]));return v});return(B,x=[])=>{let u=0;for(;u<h-2&&B>S[u+1][0];)u++;const y=S[u],v=S[u+1],d=v[0]-y[0],k=ae((B-y[0])/d,0,1),a=k*k,s=a*k,r=2*s-3*a+1,c=s-2*a+k,b=-2*s+3*a,M=s-a;for(let i=0;i<n;i++)x[i]=r*y[i+1]+c*d*w[u][i]+b*v[i+1]+M*d*w[u+1][i];return x}}const Ze=[[0,.045,.05,.05],[.12,.085,.075,.08],[1,.165,.125,.14],[2,.25,.2,.215],[2.35,.37,.4,.3],[2.75,.52,.56,.42],[3.6,.84,.82,.74],[5,1.2,1.14,1.16],[6.6,1.42,1.37,1.45],[8.3,1.5,1.45,1.55],[10.5,1.43,1.38,1.48],[12.5,1.26,1.22,1.31],[15,.98,.99,1.05],[17.5,.66,.74,.77],[20,.38,.52,.52],[22,.21,.36,.36],[23.6,.12,.25,.25],[24.6,.07,.16,.16],[25,.02,.05,.05]],fe=ee(Ze),Xe=S=>{const h=S-19.6;return h>0?-.47*h*h/(h+1.1):0},Je=ee([[19,.6],[20,.62],[20.6,.86],[21,.97],[21.35,.72],[21.75,.14],[22.3,-.42],[23,-.8],[24,-1.33],[24.8,-1.86],[25.3,-2.25]]),Qe=ee([[19,-.58],[20,-.62],[21,-1.01],[22.2,-1.62],[23.2,-2.08],[24.2,-2.45],[24.9,-2.5],[25.3,-2.31]]);async function et(S,h){const n=Pe(),w=[],B=132,x=32,u=[];for(let a=0;a<=B;a++){const s=a/B,r=ne*(s+.035*Math.sin(s*Math.PI*2)*-1),[c,b,M]=fe(ae(r,0,ne),w),i=Xe(r),t=K-r,l=[],f=1-G(2,3.8,r),m=(1-G(3,3.7,r))*G(.1,.5,r);for(let g=0;g<x;g++){const A=g/x*Math.PI*2,z=Math.sin(A),C=Math.cos(A);let q=c*Math.sign(z)*Math.pow(Math.abs(z),.86),P=C>=0?b*Math.pow(C,.92):-M*Math.pow(-C,.88);const j=Math.exp(-Math.pow((C+.18)/.11,2))*m;q*=1-.1*j,q*=1-.06*f*(1-Math.abs(C));const T=Math.exp(-Math.pow((r-2.7)/.35,2))*Math.exp(-Math.pow((C-.62)/.22,2));q*=1+.1*T,P+=.03*T,l.push(n.v(q,P+i,t,(1-C)*.5,t,0,0))}u.push(l)}n.skin(u),await h.yield();{const a=[];for(let c=0;c<=30;c++){const b=E(19,25.3,c/30),M=Je(b,w)[0],i=Qe(b,w)[0],t=K-b,l=.012+.06*Math.sin(Math.PI*Math.min(1,c/30*1.02))*(1-.5*c/30),f=[];for(let m=0;m<10;m++){const g=m/10*Math.PI*2,A=Math.cos(g),z=A*.5+.5;f.push(n.v(l*Math.sin(g),E(i,M,z),t-.1*Math.abs(A),.16,t,0,0))}a.push(f)}n.skin(a)}{const a=[];for(let c=0;c<=16;c++){const b=c/16,M=E(11.4,14,b),i=fe(M,w)[1]-.06,t=K-M,l=.62*Math.pow(Math.sin(Math.PI*Math.pow(b,.75)),.8)*(1-.25*b)+.02,f=.02+.09*Math.sin(Math.PI*b),m=[];for(let g=0;g<8;g++){const A=g/8*Math.PI*2,z=Math.cos(A)*.5+.5;m.push(n.v(f*Math.sin(A)*(1-.8*z),i+l*z,t-.55*z*z,.02,t,0,0))}a.push(m)}n.skin(a)}const y=(a,s,r,c)=>{const[b,,M]=fe(r,w),i=[s*b*.8,-M*.42,K-r],t=40*Math.PI/180,l=(a<3?9:12)*Math.PI/180,f=new e.Vector3(s*Math.cos(t)*Math.cos(l),-Math.sin(l),-Math.sin(t)*Math.cos(l)),m=new e.Vector3(s*Math.sin(t),0,Math.cos(t)),g=new e.Vector3().crossVectors(m,f);g.y<0&&g.negate(),g.normalize();const A=22,z=12,C=[],q=.235*c,P=new e.Vector3;for(let j=0;j<=A;j++){const T=Math.pow(j/A,.9),N=T*T,$=q*(.62+.38*G(0,.2,T))*(1-.3*T)*Math.sqrt(Math.max(4e-4,1-Math.pow(T,6))),I=.19*(1-.68*T)*(.35+.65*Math.sqrt(Math.max(4e-4,1-Math.pow(T,8)))),X=[];for(let D=0;D<z;D++){const L=D/z*Math.PI*2,F=Math.cos(L),O=Math.sin(L);P.set(i[0],i[1],i[2]).addScaledVector(f,c*T).addScaledVector(m,F*$*.5-.085*c*N-.1*$).addScaledVector(g,O*I*(.72+.42*F)-.05*c*N),X.push(n.v(P.x,P.y,P.z,.5-.4*O,i[2],a,0,i))}C.push(X)}n.skin(C,s<0)};y(1,1,5,3.6),y(2,-1,5,3.6),y(3,1,15,2.8),y(4,-1,15,2.8);const v=(a,s,r,c,b,M)=>{for(const i of[1,-1]){const[t,l,f]=fe(a,w),m=s*Math.PI/180,g=Math.sin(m),A=Math.cos(m),z=i*t*Math.pow(g,.86)*1.05,C=A>=0?l*Math.pow(A,.92):-f*Math.pow(-A,.88),q=K-a,P=new e.Vector3(i*g/t,A/(A>=0?l:f),.3).normalize(),j=new e.Vector3(0,0,1).addScaledVector(P,-P.z).normalize(),T=new e.Vector3().crossVectors(P,j),N=18,$=new e.Vector3,I=(L,F,O,R)=>{const W=F/N*Math.PI*2;return $.set(z,C,q).addScaledVector(P,O).addScaledVector(j,Math.cos(W)*L*b).addScaledVector(T,Math.sin(W)*L),n.v($.x,$.y,$.z,0,q,0,1,null,R)},X=I(0,0,M,c[0]);let D=null;for(let L=0;L<r.length;L++){const F=[],O=M*(1-Math.pow(r[L]/r[r.length-1],2))+(L===r.length-1?-.012:.012);for(let R=0;R<N;R++)F.push(I(r[L],R,O,c[L+1]));for(let R=0;R<N;R++){const W=(R+1)%N;D?(n.tri(D[R],F[R],F[W]),n.tri(D[R],F[W],D[W])):n.tri(X,F[R],F[W])}D=F}}},d=(a,s=1)=>new e.Color(a).multiplyScalar(s);v(2.66,64,[.07,.1,.15,.185],[d("#040608"),d("#07090c"),d("#3a2f1c"),d("#a39c88"),d("#1b1e22")],1.08,.045),v(2.16,34,[.03,.055],[d("#030405"),d("#050608"),d("#2b2e33")],1.9,-.01),await h.yield();const k=n.build();return k.boundingSphere=new e.Sphere(new e.Vector3(0,-3,-1.5),22),k}const re=ee([[0,.03,.03,.03],[.05,.1,.075,.07],[.22,.165,.13,.12],[.55,.19,.175,.16],[.9,.17,.17,.15],[1.3,.11,.12,.105],[1.6,.06,.075,.065],[1.85,.03,.05,.04],[2.05,.008,.02,.02]]),tt=ee([[1.55,.07],[1.72,.13],[1.88,.25],[2.04,.37],[2.09,.36]]),ot=ee([[1.55,-.065],[1.68,-.17],[1.76,-.14],[1.86,.02],[2.02,.27],[2.09,.33]]);function at(S){const h=Pe(),n=[],w=.9,B=S?S.range(.94,1.06):1,x=[],u=30,y=14;for(let a=0;a<=u;a++){const s=2.05*Math.pow(a/u,1.15),[r,c,b]=re(s,n),M=[];for(let i=0;i<y;i++){const t=i/y*Math.PI*2,l=Math.sin(t),f=Math.cos(t);M.push(h.v(r*B*Math.sign(l)*Math.pow(Math.abs(l),.9),f>=0?c*f:b*f*.95-.02*(1-f*f)*0,w-s,(1-f)*.5,w-s))}x.push(M)}h.skin(x);const v=(a,s,r,c)=>{const b=[];for(let M=0;M<=a;M++){const i=[],t=s(M/a);for(let l=0;l<6;l++){const f=l/6*Math.PI*2,m=Math.cos(f)*.5+.5,g=Math.sin(f)*t[7],A=E(t[0],t[3],m)+(t[6]===0?g:0),z=E(t[1],t[4],m)+(t[6]===1?g:0),C=E(t[2],t[5],m);i.push(h.v(A,z,C,typeof r=="function"?r(Math.sin(f)):r,C))}b.push(i)}h.skin(b,c)};v(14,a=>{const s=E(1.55,2.09,a);return[0,ot(s,n)[0],w-s,0,tt(s,n)[0],w-s-.02,0,.004+.014*Math.sin(Math.PI*a)]},.3,!0);const d=new e.Color("#d8d2c2");for(const[a,s,r]of[[.62,.17,.3],[1.22,.14,.25]]){v(8,t=>{const l=a+r*t,f=re(l,n)[1]-.02,m=s*Math.pow(Math.sin(Math.PI*Math.pow(t,.6)),.9)*(1-.35*t);return[0,f,w-l,0,f+m+.004,w-l-.1*m/s,0,.003+.012*Math.sin(Math.PI*t)]},.05,!0);const c=re(a,n)[1]-.03,b=[0,c,w-a+.015],M=[0,c+s*1.12,w-a-.075],i=[];for(let t=0;t<2;t++)for(let l=0;l<4;l++){const f=l/4*Math.PI*2,m=t?.003:.014,g=t?M:b;i.push(h.v(g[0]+Math.cos(f)*m,g[1],g[2]+Math.sin(f)*m,0,w-a,0,1,null,d))}for(let t=0;t<4;t++){const l=(t+1)%4;h.tri(i[t],i[4+t],i[l]),h.tri(i[l],i[4+t],i[4+l])}}for(const a of[1,-1])for(const[s,r,c,b]of[[.42,.36,.26,.1],[1.12,.17,.13,.06]]){const M=re(s,n)[0]*.8,i=re(s,n)[2];v(8,t=>{const l=c*(1-.72*t),f=a*(M+r*t),m=-i*.55-b*t,g=w-s-.2*r*t-.3*c*t;return[f,m,g-l,f,m+.004,g,1,.003+.012*(1-t)]},t=>.5-.4*t,a>0)}const k=h.build();return k.boundingSphere=new e.Sphere(new e.Vector3(0,0,-.1),1.3),k}const Ve=`
uniform vec3 uSand, uTurf;
vec3 sandCol(vec2 p, float dist, out float rip){
  // ripples 0.4 m apart, sharp-crested; they fade only where a pixel can no longer hold them
  float warp = fbm(p * .09) * 14. + vn(p * .5) * 1.7;
  float phs = (p.x * .82 + p.y * .57) * 15.7 + warp;
  float fade = (1. - smoothstep(.45, 1.4, fwidth(phs))) * (.45 + .55 * vn(p * .21 + 5.));
  float r1 = sin(phs) + .35 * sin(2. * phs + 1.2);
  // their big sisters, sand waves 1.7 m apart that fork and die out: these hold to a hundred metres, down on the channel floor too
  float ph2 = (p.x * .86 + p.y * .51) * 3.7 + fbm(p * .06 + 3.) * 9. + vn(p * .33) * 1.3;
  float fade2 = (1. - smoothstep(.45, 1.4, fwidth(ph2))) * (.35 + .65 * vn(p * .11 + 9.));
  float r2 = sin(ph2) + .4 * sin(2. * ph2 + 1.1);
  float bars = sin((p.x * .6 - p.y * .8) * .55 + fbm(p * .03 + 7.) * 6.);
  rip = r1 * fade * .55 + r2 * fade2 * .85;
  vec3 c = uSand * (.86 + .05 * bars + .08 * (fbm(p * .35 + 3.) - .5)) * (1. + .05 * rip);
  // shell gravel: pale streaks drawn out along the tide, flecked with whole shells
  float gr = smoothstep(.56, .66, fbm(vec2(p.x * .05 + p.y * .03, p.y * .22 - p.x * .12) + 21.) + (vn(p * 2.7) - .5) * .07);
  float fleck = smoothstep(.62, .8, vn(p * 6.5)) * (1. - smoothstep(25., 70., dist));
  c = mix(c, uSand * vec3(1.13, 1.12, 1.10) * (.9 + .16 * fleck), gr * .75);
  c *= 1. - .30 * gr * (1. - smoothstep(.25, .45, vn(p * 11.))) * (1. - smoothstep(20., 60., dist));
  // algal turf: dark olive patches 2-6 m across, their edges ragged and defined, tufted inside
  float tf = fbm(p * .30 + 40.) + (vn(p * 1.3) - .5) * .17 + (vn(p * 4.7) - .5) * .10 + (vn(p * 13.) - .5) * .05;
  float mead = smoothstep(.40, .66, fbm(p * .037 + 12.));               // turf gathers in a few meadows; between them open sand
  tf -= (1. - mead) * .10;
  float turf = smoothstep(.668, .700, tf);
  float rim = smoothstep(.64, .668, tf) * (1. - turf);                   // a thin fringe of single tufts round each patch
  vec3 tc = uTurf * (.85 + .75 * vn(p * 3.1)) * (.75 + .6 * vn(p * 15.)) + uSand * .10;      // polish2: olive and tufted; from the air it was ink blots
  tc = mix(tc, uTurf * vec3(1.9, 1.5, 1.0), smoothstep(.55, .8, vn(p * 2.3 + 7.)) * .5);      // rusty and olive, never one ink
  c = mix(c, tc, turf * .66 + rim * .40 * step(.5, vn(p * 9.)));
  return c;
}
`,Le=`
  vRest = position; vData = aData; vCol = aCol;
  vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vN = mat3(modelMatrix) * n;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
`,Re=`
uniform vec3 uSunRefr, uSunCol, uSkyCol, uBounce, uBack, uBelly, uScarCol;
uniform float uSeed, uTitan, uEdge, uSaddle;
uniform vec4 uScar[6];
varying vec3 vRest, vN, vW, vCol; varying vec4 vData;
#include <fog_pars_fragment>
${se}
${ge}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  vec3 V = cameraPosition - vW; float dist = max(length(V), 1e-3); V /= dist;
  float ring = vData.x, zr = vRest.z, d = ${K.toFixed(1)} - zr;
  float near = 1. - smoothstep(14., 48., dist);
  // counter-shading: slate above, pale below, meeting in a ragged, mottled line on the flank
  float k = mix(6., 1., uTitan);                       // pattern scale: sharks are small
  float edge = uEdge + (fbm(vec2(zr * .45 * k + uSeed, ring * 2.5)) - .5) * .11;
  float rag = (vn(vec2(zr * 2.1 * k + uSeed * 3., ring * 10.)) - .5) * .16 + (vn(vec2(zr * 6.5 * k, ring * 26.) + uSeed) - .5) * .09;
  float m = ring - edge + rag * exp(-abs(ring - edge) * 5.);
  float bel = smoothstep(-.012, .012, m);
  vec3 back = uBack * mix(1., 1.7, uTitan) * (.70 + .7 * fbm(vec2(zr * .7 * k, ring * 2.4) + uSeed));      // slate, never a black cut-out
  // a faint paler saddle behind the head, fine speckle close to
  float sad = smoothstep(3.5, 4.4, d) * (1. - smoothstep(5.4, 7.4, d)) * (1. - smoothstep(.10, .40, ring)) * uTitan;
  back = mix(back, back * 2.2 + vec3(.016, .017, .018), sad * uSaddle * (.55 + .45 * vn(vec2(zr * 1.3, ring * 8.))));
  back *= 1. + (vn(vec2(zr, ring * 3.) * 26. * k) - .5) * .5 * near;
  vec3 belly = uBelly * (.86 + .2 * fbm(vec2(zr * 1.1 * k, ring * 6.) + 9.));
  belly = mix(belly, uBack * 1.6, smoothstep(.62, .8, vn(vec2(zr * 2.3 * k + uSeed, ring * 11.))) * (1. - smoothstep(.0, .22, m)) * .7);
  vec3 alb = mix(back, belly, bel);
  // old scars: pale scratches, a few long ones along the flank and back
  float sc = 0.;
  for (int i = 0; i < 6; i++) {
    vec4 q = uScar[i];
    float u = (q.x - zr) / max(q.z, .05), v = (ring - q.y) * 3. - q.w * (u - .5) - .012 * sin(u * 7. + float(i));
    float tw = .004 + .010 * sin(u * 3.1416) ;
    float two = min(abs(v), abs(v - .05 - .02 * u));                 // raked in pairs
    sc = max(sc, (1. - smoothstep(tw, tw + .012, two)) * step(0., u) * step(u, 1.) * smoothstep(.2, .5, vn(vec2(u * 9. + float(i) * 5., v * 30.))));
  }
  alb = mix(alb, uScarCol, sc * .36 * uTitan * step(vData.z, .5));
  // the mouth: a dark line along the scissor jaws
  float mouth = (1. - smoothstep(.007, .026, abs(ring - .592))) * (1. - smoothstep(3.05, 3.5, d)) * smoothstep(.04, .3, d) * uTitan * step(vData.z, .5);
  alb = mix(alb, vec3(.004, .005, .006), mouth * .9);
  alb = mix(alb, vCol, vData.w);
  // light: hard sun refracted down through the surface with a caustic net on her back, sky fill, sand bounce on the belly
  float ndl = dot(N, uSunRefr), lit = smoothstep(-.05, .25, ndl) * max(ndl, 0.);
  float ca = caustic(vW.xz * 1.5 + vW.y * .7, uTime * 1.3) * smoothstep(.05, .55, N.y);   // the net of light the surface throws on her back
  float netK = mix(.45, 1.5, uTitan) * mix(1., .35, smoothstep(60., 160., dist));
  vec3 L = uSunCol * lit * (.78 + netK * ca) + uSkyCol * (.42 + .58 * N.y) * .62 + uBounce * (max(-N.y, 0.) * .55 + .08);
  vec3 col = alb * L;
  // wet skin: a broad soft sheen along the back so the round of her body reads
  vec3 H = normalize(uSunRefr + V + vec3(0., 1e-3, 0.));
  float nh = max(dot(N, H), 0.), sp = nh * nh; sp *= sp; sp *= sp; sp *= sp;
  float fr = 1. - max(dot(N, V), 0.); fr = fr * fr * fr;
  col += uSunCol * sp * .03 * smoothstep(0., .2, ndl) + uSkyCol * fr * .05 * mix(1., near, uTitan) + uSunCol * ca * .02 * smoothstep(0., .3, ndl);
  gSeaAdd = mix(.11, .12, uTitan);      // a veil of the water's own colour over her: she is IN the sea
  col = seaTint(col, -vW.y, vW);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,nt=`
uniform vec3 uSkyCol, uSunCol, uShadowK; uniform float uShade;
vec3 shadeLight(float depth, float rip){
  vec3 deep = uSkyCol * uShadowK, bank = (uSunCol * .8 + uSkyCol) * vec3(.565, .61, .585);
  return mix(bank, deep, smoothstep(1.5, 8., depth)) * uShade * (1. + .2 * rip);
}
`,qe=`
varying vec3 vW;
#include <fog_pars_fragment>
${se}
${ge}
${Ve}
${nt}
void main(){
  float rip; float dist = length(cameraPosition - vW);
  vec3 a = sandCol(vW.xz, dist, rip);
  vec3 col = a * shadeLight(-vW.y, rip);       // the same sand, lit by the sky alone: ripples and turf run on through it, no caustics
  col = seaTint(col, -vW.y, vW);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Fe=`
  vec4 wp = modelMatrix * vec4(p, 1.);
  float t = (wp.y - uFloorY) / max(uSunRefr.y, .2);
  wp.xyz -= uSunRefr * t; wp.y = uFloorY + .05;
  vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
`;async function lt(S,h={}){const n=S.rng,w=h.palette&&h.palette.length>=7?h.palette:Ye,B=ae(h.detail??S.quality?.detail??1,.6,1),x=(o,p=1)=>new e.Color(o).multiplyScalar(p),u=h.floorY??-12,y=h.depth??-2.9,v=new e.Group;v.name="titan-strait-hero";const d=(h.sunElev??38)*Math.PI/180,k=130*Math.PI/180,a=h.sunDir?h.sunDir.clone().normalize():new e.Vector3(Math.sin(k)*Math.cos(d),Math.sin(d),Math.cos(k)*Math.cos(d)),s=new e.Vector3,r=o=>{a.copy(o).normalize(),a.y<.15&&(a.y=.15,a.normalize());const p=a.x/1.333,V=a.z/1.333;s.set(p,Math.sqrt(Math.max(.05,1-p*p-V*V)),V).normalize()};r(a);const c=n.range(0,50),b=n.range(.85,1.2),M=n.range(.545,.6),i=[];for(let o=0;o<6;o++)i.push(new e.Vector4(n.range(-9,7.5),n.range(.06,.5),n.range(.6,2.4),n.range(-1.3,1.3)));const t={uTime:{value:0},uTintK:{value:.072},uAbsorb:{value:new e.Color(.07,.85,.96)},uTintA:{value:x(w[2])},uTintB:{value:x("#55B5A8")},uTintFar:{value:x(w[3])},uSunRefr:{value:s},uSun:{value:a},uFloorY:{value:u},uSunCol:{value:new e.Color(.8,.69,.55)},uSkyCol:{value:new e.Color(.44,.54,.66)},uBounce:{value:new e.Color(.5,.52,.42)},uSand:{value:x(w[1],.72)},uTurf:{value:x("#434A2A")},uShade:{value:1},uShadowK:{value:new e.Color(.72,.84,.82)},uPhase:{value:0},uAmp:{value:2.5},uTilt:{value:0},uLift:{value:0},uRise:{value:0},uDepth:{value:y},uTrim:{value:0},uBreath:{value:0},uDrift:{value:0},uHead:{value:new e.Vector3(0,0,8.6)}},l=()=>e.UniformsUtils.clone(e.UniformsLib.fog),f="varying vec3 vRest, vN, vW, vCol; varying vec4 vData;",m="attribute vec4 aData; attribute vec3 aRoot, aCol;",g=await et(n,S);await S.yield();const A=n.range(.45,1),z=o=>({...l(),...t,uSeed:{value:c},uSaddle:{value:A},uScar:{value:i},uScarCol:{value:x("#8E9290")},...o}),C=new e.ShaderMaterial({fog:!0,uniforms:z({uBack:{value:x(w[4],b)},uBelly:{value:x("#D9D2C0",.8)},uTitan:{value:1},uEdge:{value:M}}),vertexShader:`${m}
${f}
#include <fog_pars_vertex>
${Be}
void main(){ vec3 n = normal; vec3 p = titanDeform(position, aData, aRoot, n);
${Le}}`,fragmentShader:Re}),q=new e.Mesh(g,C);q.frustumCulled=!1,q.renderOrder=2,v.add(q);const P=()=>({...l(),...t}),j=new e.ShaderMaterial({fog:!0,uniforms:P(),side:e.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`${m}
uniform vec3 uSunRefr; uniform float uFloorY; varying vec3 vW;
#include <fog_pars_vertex>
${Be}
void main(){ vec3 n = normal; vec3 p = titanDeform(position, aData, aRoot, n);
${Fe}}`,fragmentShader:qe}),T=new e.Mesh(g,j);T.frustumCulled=!1,T.renderOrder=1,v.add(T);const N=h.sharks??5,$=at(n),I=new e.InstancedBufferGeometry;I.index=$.index;for(const o of Object.keys($.attributes))I.setAttribute(o,$.attributes[o]);const X=new Float32Array(N*4),D=new Float32Array(N*4);for(let o=0;o<N;o++){const p=(o+n.range(.2,.8))/N;X.set([-n.range(2.9,5.4),-n.range(2.4,4.2),E(7.5,-6.5,p)+n.range(-1,1),n()],o*4),D.set([n.range(.5,1.1),n.range(.25,.6),n.range(1.2,2.6),n.range(.88,1.12)],o*4)}I.setAttribute("iA",new e.InstancedBufferAttribute(X,4)),I.setAttribute("iB",new e.InstancedBufferAttribute(D,4)),I.instanceCount=N;const L=`
attribute vec4 iA, iB; uniform float uTime;
vec3 sharkDeform(vec3 p, inout vec3 n){
  float s = clamp((.9 - aData.y) / 2.05, 0., 1.), ph = iA.w * 6.2832, t = uTime;
  p.x += sin(t * 6.2832 + ph - s * 4.6) * (.015 + .17 * s * s);          // one tail-wave a second
  p *= iB.w;
  float wx = sin(t * .23 + ph) * iB.x + sin(t * .41 + ph * 2.3) * iB.x * .4;
  float dwx = cos(t * .23 + ph) * iB.x * .23 + cos(t * .41 + ph * 2.3) * iB.x * .164;
  float wz = sin(t * .15 + ph * 1.7) * iB.z, wy = sin(t * .19 + ph * 3.1) * iB.y;
  float yaw = dwx * .9, inv = inversesqrt(1. + yaw * yaw), c = inv, sn = yaw * inv;   // nose follows the weave
  p.xz = vec2(c * p.x + sn * p.z, -sn * p.x + c * p.z); n.xz = vec2(c * n.x + sn * n.z, -sn * n.x + c * n.z);
  return p + vec3(iA.x + wx, iA.y + wy, iA.z + wz);
}`,F=new e.ShaderMaterial({fog:!0,side:e.DoubleSide,uniforms:z({uBack:{value:x("#6B6456",.8)},uBelly:{value:x("#CFC6B2",.9)},uTitan:{value:0},uEdge:{value:.56}}),vertexShader:`${m}
${f}
#include <fog_pars_vertex>
${L}
void main(){ vec3 n = normal; vec3 p = sharkDeform(position, n);
${Le}}`,fragmentShader:Re}),O=new e.Mesh(I,F);O.frustumCulled=!1,O.renderOrder=2,v.add(O);const R=new e.ShaderMaterial({fog:!0,uniforms:P(),side:e.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`${m}
uniform vec3 uSunRefr; uniform float uFloorY; varying vec3 vW;
#include <fog_pars_vertex>
${L}
void main(){ vec3 n = normal; vec3 p = sharkDeform(position, n);
${Fe}}`,fragmentShader:qe}),W=new e.Mesh(I,R);W.frustumCulled=!1,W.renderOrder=1,v.add(W),await S.yield();const Ne=h.stage!==!1,ve=260;if(Ne){const o=new e.CircleGeometry(ve,72);o.rotateX(-Math.PI/2),o.translate(0,u,0);const p=new e.ShaderMaterial({fog:!0,uniforms:P(),vertexShader:`varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSkyCol, uSunCol, uSunRefr; uniform float uShade;
varying vec3 vW;
#include <fog_pars_fragment>
${se}
${ge}
${Ve}
void main(){
  float rip; float dist = length(cameraPosition - vW);
  vec3 a = sandCol(vW.xz, dist, rip);
  float ca = caustic(vW.xz, uTime);
  vec3 L = uSunCol * uSunRefr.y * (1. + .12 * rip) * (.94 + .34 * ca) + uSkyCol * uShade;
  vec3 col = seaTint(a * L, -vW.y, vW);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`}),V=new e.Mesh(o,p);V.renderOrder=0,v.add(V);const U=40,_=72,te=[],ue=[];for(let H=0;H<=U;H++)for(let Z=0;Z<_;Z++){const oe=ve*Math.pow(H/U,2.3),Q=Z/_*Math.PI*2;te.push(Math.sin(Q)*oe,0,Math.cos(Q)*oe+8*(1-H/U))}for(let H=0;H<U;H++)for(let Z=0;Z<_;Z++){const oe=H*_+Z,Q=H*_+(Z+1)%_,_e=oe+_,Ge=Q+_;ue.push(oe,_e,Q,Q,_e,Ge)}const Y=new e.BufferGeometry;Y.setAttribute("position",new e.Float32BufferAttribute(te,3)),Y.setIndex(ue),Y.boundingSphere=new e.Sphere(new e.Vector3,ve+10);const he=`
uniform float uTime, uLift; uniform vec3 uHead;
float swell(vec2 p){ float t = uTime;
  float h = sin(p.x * .21 + p.y * .13 + t * .55) * .06 + sin(p.x * -.11 + p.y * .29 + t * .43 + 1.7) * .05 + sin(p.x * .53 - p.y * .47 + t * .9) * .015;
  vec2 q = p - uHead.xz; h += (.10 + .16 * uLift) * exp(-dot(q, q) / 9.);
  return h; }`,me=new e.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...l(),...t,uZen:{value:x("#5E93C4")},uPale:{value:x(w[5])},uHor:{value:x("#EAD9BC")}},vertexShader:`varying vec3 vW; varying vec2 vL;
#include <fog_pars_vertex>
${he}
void main(){ vec3 p = position; vL = p.xz; p.y += swell(p.xz); vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uZen, uPale, uHor;
varying vec3 vW; varying vec2 vL;
#include <fog_pars_fragment>
${he}
void main(){
  float e = .35;
  float hx = swell(vL + vec2(e, 0.)) - swell(vL - vec2(e, 0.)), hz = swell(vL + vec2(0., e)) - swell(vL - vec2(0., e));
  vec3 N = normalize(vec3(-hx / (2. * e), 1., -hz / (2. * e)));      // (local frame; the piece only ever turns about Y)
  vec3 V = cameraPosition - vW; float dist = max(length(V), 1e-3); V /= dist;
  float nv = clamp(dot(N, V), 0., 1.), f = 1. - nv, f5 = f * f; f5 = f5 * f5 * f;
  float F = .02 + .98 * f5;
  vec3 Rr = reflect(-V, N); float up = clamp(Rr.y, 0., 1.);
  vec3 sky = mix(mix(uHor, uPale, smoothstep(0., .16, up)), uZen, smoothstep(.12, .85, up));
  // sun behind us: no glare path; the skin shows only as pale sky far off and as a breath of sheen near
  float a = clamp(F * 1.05 + .012, 0., .96);
  // the smooth hump that travels over her head shows as a lens of pale sky; slow slicks give the glass a skin
  vec2 q = vL - uHead.xz; float hump = exp(-dot(q, q) / 7.);
  float slick = sin(vL.x * .29 + vL.y * .17 + uTime * .11) * sin(vL.y * .23 - vL.x * .09 - uTime * .08);
  slick = slick * slick * (.5 + .5 * sin(vL.x * .05 - vL.y * .07 + uTime * .03));
  a = clamp(a + hump * (.05 + .16 * uLift / 1.55) + .05 * slick, 0., .96);
  gl_FragColor = vec4(sky * .92, a);
  #include <fog_fragment>
}`}),Ce=new e.Mesh(Y,me);Ce.renderOrder=6,v.add(Ce)}await S.yield();const pe=new e.Vector3(0,-.15,K-2.16),we=5,xe=.12,ie=Math.round(560*B),J=new e.InstancedBufferGeometry;J.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),J.setIndex([0,1,2,0,2,3]);const ye=new Float32Array(ie*4),be=new Float32Array(ie*4);for(let o=0,p=Math.round(160*B);o<p;o++)n(),n(),n.range(0,1),n(),n.gauss(),n.gauss(),n.gauss();for(let o=0,p=He(Ue("plume:"+Math.floor(c*1e6)));o<ie;o++){const V=o%5<3?1:-1,U=p(),_=o%20<6?0:o%20<11?1:2,te=Math.pow(p(),1.5)*(_===2?.24:.17),ue=(_===0?p.range(.55,1.35):_===1?p.range(.22,.55):p.range(.03,.075))*(V>0||_===2?1:.88),Y=_===0?.2:_===1?.34:.38,he=1-.45*te/.17,me=(_===0?E(1.6,9.6,Math.pow(U,.8)):_===1?E(5.5,12.5,U):E(5,15,U))*Math.max(.4,he)*(V>0?1.08:.94);ye.set([V,te,ue,p()],o*4),be.set([(V>0?-.05:-1.05)+p.gauss()*Y,(V>0?.8:.98)+p.gauss()*Y*.5,(V>0?1.12:.62)+p.gauss()*Y,me],o*4)}J.setAttribute("pA",new e.InstancedBufferAttribute(ye,4)),J.setAttribute("pV",new e.InstancedBufferAttribute(be,4)),J.instanceCount=ie;const Ie=new e.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...l(),uBreath:t.uBreath,uSun:t.uSun,uNostril:{value:pe},uLit:{value:new e.Color(.97,.94,.87)},uShadeC:{value:new e.Color(.4,.5,.64)}},vertexShader:`
attribute vec4 pA, pV; uniform float uBreath; uniform vec3 uNostril, uSun;
varying vec2 vUv; varying vec4 vK; varying vec4 vSun;
#include <fog_pars_vertex>
void main(){
  float age = (uBreath - ${xe} - pA.y) * ${we.toFixed(1)};
  float live = step(0., age) * step(uBreath, .999);
  float spray = step(pA.z, .11);
  vec3 dir = normalize(pV.xyz + vec3(0., 1e-3, 0.));
  float reach = pV.w * (1. - exp(-age * 2.4)) / 2.4;
  vec3 c = uNostril + vec3(pA.x * .20 - .15, 0., .1) + dir * reach;
  c.y += .25 - mix(.10, 1.5, spray) * age * age * (.5 + pA.w);    // the cloud sinks slowly; the spray falls out of it as fine rain
  c.x -= age * (.55 + .4 * pA.w) + sin(age * 2. + pA.w * 40.) * .12;   // it leans and drifts off to her right, clear of her head and of our line
  c.z -= (age - (1. - exp(-age * 1.4)) / 1.4) * 1.3 * (1. - .12 * pA.w) * (1. + .8 * spray);   // blown at her speed, it stops in the air while she swims on
  c.y = max(c.y, .05);
  float size = pA.z * (.30 + .95 * (1. - exp(-age * 1.3))) * live;
  float al = smoothstep(0., .10, age) * (1. - smoothstep(mix(1.1, .7, spray), mix(3.4, 2.0, spray), age));
  vUv = position.xy; vK = vec4(al * live, pA.w, age, spray);
  vSun = vec4(normalize((viewMatrix * vec4(uSun, 0.)).xyz + vec3(0., 1e-4, 0.)), mix(.5, 1., smoothstep(.3, 2.3, c.y)) * mix(.82, 1., pA.w));   // w: the foot of the cloud lies in its own shade
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(c, 1.);
  mvPosition.xy += position.xy * size;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uLit, uShadeC;
varying vec2 vUv; varying vec4 vK; varying vec4 vSun;
#include <fog_pars_fragment>
${se}
void main(){
  float r2 = dot(vUv, vUv);
  if (r2 > 1.) discard;
  // a ragged, cauliflower edge: the disc is eaten back by three sizes of noise, more as it ages and thins
  float n = vn(vUv * 2.3 + vK.y * 57.) * .5 + vn(vUv * 5.6 - vK.y * 31.) * .3 + vn(vUv * 12. + vK.y * 11.) * .2;
  float dens = (1. - r2) * (1. - r2) - n * (.50 + .14 * vK.z) + .08;      // thin, soft-edged mist: many veils laid over one another, never a ball
  // polish2: each veil is faint and fades to nothing at its rim (the puff was a hard white shape); only the fine spray is solid
  float a = smoothstep(0., mix(1.1, .12, vK.w), dens) * vK.x * mix(.105, .6, vK.w);
  if (a < .004) discard;
  // each billow is a little ball: lit where it faces the sun, blue-grey on its far side and in the folds between billows
  vec3 nb = vec3(vUv, sqrt(max(1. - r2, 0.)));
  float l = clamp((.5 + .5 * dot(nb, vSun.xyz) + .35 * (dens - .45) + (n - .45) * .5) * vSun.w, 0., 1.);
  gl_FragColor = vec4(mix(mix(uShadeC, uLit, .30), uLit, max(max(smoothstep(.34, .86, l), vK.w), .7 * smoothstep(1.4, 2.8, vK.z))), a);      // as it thins it is all lit mist
  #include <fog_fragment>
}`}),le=new e.Mesh(J,Ie);le.frustumCulled=!1,le.renderOrder=8,v.add(le);const Me=new e.PlaneGeometry(14,14);Me.rotateX(-Math.PI/2);const De=new e.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...l(),uBreath:t.uBreath,uNostril:{value:pe}},vertexShader:`
uniform float uBreath; uniform vec3 uNostril; varying vec2 vP; varying float vAge;
#include <fog_pars_vertex>
void main(){
  vAge = (uBreath - ${xe-.07}) * ${we.toFixed(1)};
  vP = position.xz;
  float ag = max(vAge - .364, 0.);
  vec3 p = position + vec3(uNostril.x - 2.5, .04, uNostril.z - (ag - (1. - exp(-ag * 1.4)) / 1.4) * 1.3);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
uniform float uBreath; varying vec2 vP; varying float vAge;
#include <fog_pars_fragment>
${se}
void main(){
  float age = vAge, live = step(0., age) * step(uBreath, .999);
  vec2 q = vP - vec2(2.5, 0.); float r = length(q);
  float n = fbm(q * 2.3 + 3.) , n2 = vn(q * 7.);
  float rad = .35 + 1.05 * (1. - exp(-age * 1.1)) + age * .12;
  float ring = (1. - smoothstep(.0, .46 + .2 * n, abs(r - rad + (n - .5) * .9))) * smoothstep(.38, .62, fbm(q * 3.1 + 9.)) * (.4 + .6 * n2);
  float core = (1. - smoothstep(.2, rad, r)) * (1. - smoothstep(.0, 1.1, age)) * (.5 + .5 * n2);
  float a = (ring * (1. - smoothstep(1.2, 3.6, age)) + core) * smoothstep(0., .25, age);
  // where the plume comes down to her right the glass is pricked into a soft pale patch (no drawn rings)
  vec2 dq = vP - vec2(-.8, 1.2); float rr = (1. - smoothstep(.6, 2.6, length(dq))) * smoothstep(1.4, 2.4, age) * smoothstep(.45, .8, vn(vP * 9. + age * 1.5)) * n2;
  a = clamp(a * .8 + rr * .22 * (1. - smoothstep(3.2, 4.0, age)), 0., 1.) * live;
  if (a < .004) discard;
  gl_FragColor = vec4(vec3(1.25, 1.24, 1.2) * (.8 + .2 * n2), a);
  #include <fog_fragment>
}`}),ce=new e.Mesh(Me,De);ce.frustumCulled=!1,ce.renderOrder=7,v.add(ce),await S.yield();let Se=!1,We=0;const de=o=>{We=o,t.uPhase.value=o/25*Math.PI*2},ke=o=>{t.uTilt.value=ae(o,0,1)},Ae=o=>{t.uBreath.value=ae(o,0,1)},$e=h.momentShift??0,ze=o=>{const p=o-$e;ke(G(.553,.598,p)*(1-G(.618,.668,p)));const V=G(.578,.597,p)*(1-G(.606,.64,p));t.uLift.value=1.55*V,t.uRise.value=.5*G(.56,.597,p)*(1-G(.61,.66,p)),Ae((p-.58)/.08)},Te=o=>o<=.4?165*o:66+290*(o-.4),Oe=o=>{Se=!0,de(Te(o)),ze(o)},Ee=(o=new e.Vector3)=>(v.updateWorldMatrix(!0,!1),o.copy(t.uHead.value).applyMatrix4(v.matrixWorld)),Ke=()=>{const o=(y-u)/s.y;return new e.Vector3(-s.x*o,u,-s.z*o)},je={spine:new e.Vector3(0,y,0),head:new e.Vector3(0,y+.3,8.3),snoutTip:new e.Vector3(0,y,K),nostrils:pe.clone(),eyeL:new e.Vector3(.55,y+.25,K-2.66),tailTip:new e.Vector3(0,y-2.4,K-ne),shadowCentre:Ke(),passLine:[[.6,6.4,-23],[-2.3,8,-22.5],[-3.3,8.7,-21],[-2.5,8.4,-17],[.9,8,-10.4],[5.5,7.4,-4.2],[9.7,6.9,-2.6]].map(o=>new e.Vector3(...o)),flyThrough:[[-3.3,8.7,-21],[.9,8,-10.4],[5.5,7.4,-4.2],[9.7,6.9,-2.6]].map(o=>new e.Vector3(...o)),viewpoints:{entry:{from:new e.Vector3(22,31,-112),lookAt:new e.Vector3(-2.5,-6,2)},pass:{from:new e.Vector3(6,8.5,-6),lookAt:new e.Vector3(-2,-5,4)},breath:{from:new e.Vector3(6,6.3,1),lookAt:new e.Vector3(0,.6,9)}},portalSeat:{position:new e.Vector3(45,9,150),facing:new e.Vector3(0,0,-1),note:"hint only: the ring belongs in the cleft"}};return{object:v,radius:13,height:24,center:new e.Vector3(-2,6,1.5),anchors:je,ground:!1,groundY:u,uniforms:t,setProgress:Oe,setSwim:de,setTilt:ke,setBreath:Ae,setSun:r,headWorld:Ee,parts:{titan:q,titanShadow:T,sharks:O,sharkShadows:W,plume:le,foam:ce},setFloorY(o){t.uFloorY.value=o},swimAt:Te,update(o,p,V){t.uTime.value=p,t.uTrim.value=p*.55,Se||(de(p*5),ze(.535+p%11/11*.145))},dispose(){}}}export{Ve as SAND_GLSL,ge as SEA_GLSL,nt as SHADE_GLSL,lt as buildHero,at as buildHybodont};
