import*as o from"three";import{mergeGeometries as ce,mergeVertices as fe}from"three/addons/utils/BufferGeometryUtils.js";const ve=["#F2D95C","#7DB34A","#BFE3F5","#0B1033","#E9ECFF","#F08A4B","#2C4A2E"],ue=75,me=52,re=2,Y=Math.PI*2,_=a=>new o.Color(a),G=(a,e,M=0)=>new o.Vector3(Math.sin(a)*e,M,Math.cos(a)*e),O=new o.Vector3(-.3277,0,.9448),ae=new o.Vector3(-.516,0,-.86),ne=`
uniform float uTime;
uniform vec4 uDome;      // R, H, band half width, breath amplitude
uniform vec3 uMoon;      // moon centre, hero-local
uniform vec3 uSunDir;    // hero-local, normalised
uniform vec3 uSunCol;
uniform vec3 uSkyCol;
uniform vec3 uStarAmb;
uniform vec3 uMoonCol;
uniform vec3 uRampA;     // orange
uniform vec3 uRampB;     // rose
uniform vec3 uRampC;     // violet
uniform vec3 uCamL;      // camera position, hero-local
uniform vec4 uExit;      // exit arch: compass angle, half width m, height m
uniform vec2 uHem;       // dusk horizon: height m, power
float hemT(float h){ return pow(clamp(h / max(uHem.x, .1), 1e-4, 1.), uHem.y); }
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float h31(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float a = mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), f.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), f.x), f.y);
  float b = mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), f.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1., 1., 1.)), f.x), f.y);
  return mix(a, b, f.z); }
float fbm2(vec2 p){ return vn2(p) * .5 + vn2(p * 2.03 + 7.1) * .3 + vn2(p * 4.1 + 3.7) * .2; }
float safeAng(vec2 v){ return atan(v.y, abs(v.x) < 1e-4 ? 1e-4 : v.x); }
float domeLobes(float a){ return sin(a * 3. + .7) * .5 + sin(a * 5. + 2.1) * .3 + sin(a * 8. + 4.) * .2; }
float domeBreath(float a){ return uDome.w * (sin(a * 2. + uTime * .79) * .55 + sin(a * 5. - uTime * .52 + 1.3) * .45); }
float domeScale(float a){ return 1. + .06 * domeLobes(a); }
float nightD(vec3 p){
  float a = safeAng(p.zx);
  vec3 q = vec3(p.x, p.y * uDome.x / uDome.y, p.z);
  return length(q) - uDome.x * domeScale(a) - domeBreath(a);
}
float nightN(vec3 p){ return 1. - smoothstep(-uDome.z, uDome.z, nightD(p)); }
vec3 duskRamp(float n){
  vec3 c = mix(uRampA, uRampB, smoothstep(.25, .5, n));
  return mix(c, uRampC, smoothstep(.5, .75, n));
}
// THE MIDNIGHT IS LIT FROM ITS REAL SOURCES. oakN = how far p is inside the Oak's own night (small trees'
// nights pass 0 and keep the older, even starlight). Sources: (1) a low blue starlight, (2) the moon in its
// fork: a key that falls with distance, an ivory pool near it and an ivory rim on whatever faces it,
// (3) the horizon of dusk: orange-rose on undersides and outward faces low down near the hem,
// (4) the arch of day: a fan of warm gold spilling in along the exit axis.
float exitFan(vec3 p, out vec3 Le){
  vec2 ea = vec2(sin(uExit.x), cos(uExit.x)), fa = vec2(sin(uExit.w), cos(uExit.w));   // arch axis; the flight's own line out
  vec2 E = ea * uDome.x, q = p.xz - E;
  float depth = max(-dot(q, fa), 0.), lat = abs(q.x * fa.y - q.y * fa.x);
  vec3 toE = vec3(E.x, uExit.z * .35, E.y) - p; Le = toE / max(length(toE), 1e-3);
  float w = uExit.y * .85 + depth * .42, low = smoothstep(2.6, .3, p.y);
  float wide = smoothstep(w, w * .25, lat) * exp(-depth / 34.) * smoothstep(uExit.z * 1.2 + depth * .45, uExit.z * .3, p.y);
  // on the sward the day lies as one fan of gold along the line of flight, from the ring's foot 50 m into the night,
  // and the grass either side of it stays moonlit blue
  float wp = max(uExit.y * .44 - depth * .1, 3.4);
  float path = smoothstep(wp, wp * .25, lat) * exp(-depth / 46.) * low;
  return wide * (1. - .72 * low) + path * 3.4;
}
vec3 nightLit(vec3 alb, vec3 p, vec3 N, vec3 V, float ao, float oakN){
  vec3 toM = uMoon - p; float dm = length(toM); vec3 Lm = toM / max(dm, 1e-3);
  float ndl = dot(N, Lm);
  vec3 albN = mix(alb, vec3(dot(alb, vec3(.3, .5, .2))) * 1.25, .5);
  float rim = 1. - max(dot(N, V), 0.); rim = rim * rim * rim;
  // the older even night (lesser trees): starlight ambient + a floored moon
  float fall0 = max(.35, 1. / (1. + dm * dm / 900.));
  vec3 flat0 = albN * (uStarAmb * (.7 + .3 * N.y) + uMoonCol * max(ndl * .7 + .3, 0.) * fall0) * (.45 + .55 * ao) + uStarAmb * rim * .3 * ao;
  // the Oak's midnight
  float fall = max(.045, 1. / (1. + dm * dm / 620.));
  float pool = smoothstep(17., 3., dm);
  float ml = max(ndl * .86 + .14, 0.);
  vec3 c = albN * uStarAmb * (.3 + .26 * N.y) * (.5 + .5 * ao);
  c += albN * uMoonCol * vec3(1.06, 1., .86) * ml * (fall * 1.5 + pool * 1.45) * (.4 + .6 * ao);
  c += uMoonCol * vec3(1.05, 1., .88) * rim * smoothstep(-.25, .45, ndl) * (.1 + 1.1 * fall + pool) * .55 * ao;
  c += uStarAmb * rim * .16;
  // dusk horizon: a low warm light arriving from outward and below
  float r = length(p.xz); vec2 rad = p.xz / max(r, 1e-3);
  float wd = smoothstep(.22, .92, r / uDome.x) * exp(-max(p.y, 0.) / 13.);
  wd *= .28 + .72 * smoothstep(.3, 1., uHem.y);          // a thin line of fire throws far less light than a full dusk
  float dl = max(dot(N, vec3(rad.x * .9, -.42, rad.y * .9)), 0.);
  c += mix(mix(uRampA, uRampB, .45), vec3(dot(uRampA, vec3(.3, .5, .2))), .3) * wd * (albN * (dl * 1.5 + .1) + rim * .22 * (.4 + dl)) * .4;
  // the arch of day
  vec3 Le; float fan = exitFan(p, Le);
  float el = .34 + .66 * max(dot(N, Le), 0.);
  c += uSunCol * vec3(1., .66, .27) * fan * (mix(albN, alb, .6) * el * .8 + rim * .5 * smoothstep(-.3, .3, dot(N, Le)) + .026);
  return mix(flat0, c, oakN);
}
// returns linear HDR colour. alb under ~0.8.
vec3 lawMix(vec3 alb, vec3 p, vec3 N, vec3 V, float ao, float n, vec3 night){
  float nl = max(dot(N, uSunDir), 0.);
  vec3 noon = alb * (uSunCol * nl * ao + uSkyCol * (.55 + .45 * N.y) * ao);
  float rim = 1. - max(dot(N, V), 0.); rim = rim * rim * rim;
  // band: a level warm light pointing outward from the trunk, so it rims whatever stands in it
  float band = 4. * n * (1. - n);
  vec2 rad = p.xz / max(length(p.xz), 1e-3);
  float bl = .55 + .45 * abs(dot(N.xz, rad));
  return mix(noon, night, n) + duskRamp(n) * band * bl * (.25 + alb * .9 + .35 * rim);
}
vec3 oakLaw(vec3 alb, vec3 p, vec3 N, vec3 V, float ao){
  float n = nightN(p);
  return lawMix(alb, p, N, V, ao, n, nightLit(alb, p, N, V, ao, 1.));
}
`,Q=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vP; varying vec3 vN;
`,se=`
#include <common>
#include <fog_pars_fragment>
varying vec3 vP; varying vec3 vN;
`+ne;function pe(a){return{uTime:{value:0},uDome:{value:new o.Vector4(ue,me,re,1)},uMoon:{value:new o.Vector3(0,16,-22)},uSunDir:{value:new o.Vector3(.28,.927,.25).normalize()},uSunCol:{value:_("#FFF6E0").multiplyScalar(1.05)},uSkyCol:{value:_(a[2]).multiplyScalar(.38)},uStarAmb:{value:_("#24347E").multiplyScalar(1.5)},uMoonCol:{value:_(a[4]).multiplyScalar(.4)},uRampA:{value:_(a[5]).multiplyScalar(1.5)},uRampB:{value:_("#E8668A").multiplyScalar(1.35)},uRampC:{value:_("#6A4BC0").multiplyScalar(1.5)},uCamL:{value:new o.Vector3(0,10,200)},uCamN:{value:0},uPhase:{value:0},uProgress:{value:0},uExit:{value:new o.Vector4(Math.PI-.038,23,11.5,Math.atan2(-O.x,-O.z))},uIsle:{value:new o.Vector4(0,0,9.5,4.5)},uIsleDir:{value:new o.Vector2(O.x,O.z)},uPond:{value:new o.Vector4(0,0,15,0)},uWind:{value:new o.Vector2(.94,.34)},uHem:{value:new o.Vector2(9.5,1)}}}function J(a,{vert:e,frag:M,uniforms:l={},...c}){return new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),...a,...l},vertexShader:Q+e,fragmentShader:se+M,fog:!0,...c})}function ge(){const a=[],e=[],M=[],l=[],c=[],f=new o.Vector3,u=new o.Vector3,b=new o.Vector3,A=new o.Vector3;function h(N,w,m,s){const p=a.length/3,d=N.length;u.set(0,0,0);let v=0;for(let x=0;x<d;x++){const C=N[Math.max(0,x-1)],t=N[Math.min(d-1,x+1)];f.subVectors(t,C).normalize(),x===0&&(u.set(1,0,0),Math.abs(f.x)>.8&&u.set(0,0,1)),u.addScaledVector(f,-u.dot(f)).normalize(),b.crossVectors(f,u),x>0&&(v+=N[x].distanceTo(N[x-1]));for(let n=0;n<=m;n++){const z=n/m*Y,P=Math.cos(z),g=Math.sin(z),L=w[x]*(s?s(z,x,N[x]):1);A.set(0,0,0).addScaledVector(u,P).addScaledVector(b,g),a.push(N[x].x+A.x*L,N[x].y+A.y*L,N[x].z+A.z*L),e.push(A.x,A.y,A.z),M.push(n/m,v),c.push(f.x,f.y,f.z,L)}}const k=m+1;for(let x=0;x<d-1;x++)for(let C=0;C<m;C++){const t=p+x*k+C,n=t+1,z=t+k,P=z+1;l.push(t,z,n,n,z,P)}const S=a.length/3,T=N[d-1];a.push(T.x+f.x*w[d-1]*.8,T.y+f.y*w[d-1]*.8,T.z+f.z*w[d-1]*.8),e.push(f.x,f.y,f.z),M.push(.5,v+w[d-1]),c.push(f.x,f.y,f.z,w[d-1]*.3);for(let x=0;x<m;x++)l.push(p+(d-1)*k+x,S,p+(d-1)*k+x+1)}function B(){const N=new o.BufferGeometry;return N.setAttribute("position",new o.Float32BufferAttribute(a,3)),N.setAttribute("normal",new o.Float32BufferAttribute(e,3)),N.setAttribute("uv",new o.Float32BufferAttribute(M,2)),N.setAttribute("aT",new o.Float32BufferAttribute(c,4)),N.setIndex(l),N}return{tube:h,geometry:B,tris:()=>l.length/3}}function ee(a,e,M,l=.18){const c=new o.CatmullRomCurve3(a,!1,"catmullrom",l);let f=0;for(let h=1;h<a.length;h++)f+=a[h].distanceTo(a[h-1]);const u=Math.max(3,Math.round(f/M)),b=[],A=[];for(let h=0;h<=u;h++){const B=h/u;b.push(c.getPoint(B));const N=B*(e.length-1),w=Math.min(e.length-2,Math.floor(N));A.push(e[w]+(e[w+1]-e[w])*(N-w))}return{pts:b,rad:A}}function xe(a){const e=l=>a.range(-l,l);return[{a:-152,kind:"ground",L:76},{a:152,kind:"ground",L:76},{a:-120,kind:"moon",L:a.range(62,70)},{a:-80+e(5),kind:"free",L:a.range(62,74)},{a:-30+e(6),kind:"free",L:a.range(60,72)},{a:26+e(5),kind:"free",L:a.range(62,74)},{a:100+e(5),kind:"free",L:a.range(60,72)}]}async function ye(a,e,M,l){const c=[],f=(m,s,p=2)=>{for(let d=1;d<m.length;d+=p)c.push({p:m[d],r:s[d]})},b=e.range(0,Y),A=[];for(let m=0;m<7;m++)A.push(e.range(.6,1.25));const h=[],B=[],N=G(e.range(0,Y),1);for(let m=0;m<=15;m++){const s=-1.2+m*.85;h.push(new o.Vector3(N.x*s*.035+Math.sin(s*.5)*.25,s,N.z*s*.035+Math.cos(s*.37)*.2)),B.push(2.45+.5*Math.max(0,(s-7)/4)+.25*Math.sin(s*1.3))}M.tube(h,B,36,(m,s,p)=>{const d=p.y,v=Math.exp(-Math.max(0,d+.3)/2.1),k=(m+b)/Y*7,S=k-Math.floor(k),T=(Math.floor(k)%7+7)%7,x=Math.pow(Math.abs(Math.cos(S*Math.PI)),2.4)*A[T];return 1+v*(.38+1.25*x)+.045*Math.sin(m*5+d*.9)+.03*Math.sin(m*11-d*1.7)});const w=h[h.length-3].clone();l.fork=w,l.boughs=[];for(const m of xe(e)){await a.yield();const s=m.a*Math.PI/180,p=G(s+Math.PI/2,1),d=[],v=[],k=w.y+e.range(.8,1.5);d.push(new o.Vector3(w.x,k-1.5,w.z)),v.push(1.25),d.push(G(s,5.5,k+.8)),v.push(1.15);let S=e.chance(.5)?1:-1,T=5.5;const x=e.range(.82,1.18);if(m.kind==="ground"){const n=Math.sign(Math.sin(s));d.push(G(s,20+e.range(-2,2),k+.6)),v.push(1.1*x),d.push(G(s+n*.03,39+e.range(-2,2),k-.6+e.range(-.4,.4))),v.push(1.02*x),d.push(new o.Vector3(n*(18.5+e.range(-1,1)),5.2,-52)),v.push(.98*x);const z=new o.Vector3(n*15,.35,-62);d.push(z),v.push(.98*x),d.push(new o.Vector3(n*(18.2+e.range(-1,1.5)),4.4,-64.6)),v.push(.74*x);const P=new o.Vector3(n*(23+e.range(-1,2)),11.5+e.range(0,2),-60.5);d.push(P),v.push(.2),(l.tips=l.tips||[]).push(P),(l.gate=l.gate||[]).push(z.clone())}else if(m.kind==="moon"){const n=k+e.range(.2,.7),z=new o.Vector3(-ae.z,0,ae.x);d.push(G(s,14,n+.7)),v.push(1.05*x),d.push(G(s,21.6,n+.2).addScaledVector(z,2.6)),v.push(.98*x),d.push(G(s,26.4,8.7).addScaledVector(z,4.1)),v.push(.9*x),d.push(G(s,29.3,5.3).addScaledVector(z,2.9)),v.push(.86*x),d.push(G(s,30.9,4.5)),v.push(.84*x),d.push(G(s,34.6,5.4).addScaledVector(z,-1.2)),v.push(.8*x),d.push(G(s,41.5,9.2).addScaledVector(p,S*2.4)),v.push(.66*x),d.push(G(s,51,15).addScaledVector(p,-S*2.2)),v.push(.5*x),d.push(G(s,m.L,22.5).addScaledVector(p,S*1.6)),v.push(.3*x)}else for(;T<m.L-6;){T+=e.range(9,14),T>m.L-4&&(T=m.L);const n=T/m.L;let z,P=S*e.range(1.8,4.6)*(.4+n);z=k+.2+e.range(-.4,.4)+.5*Math.sin(n*5+s)+11*Math.pow(Math.max(0,n-.62)/.38,1.5),d.push(G(s,T,z).addScaledVector(p,P)),v.push(x*o.MathUtils.lerp(1.02,.34,Math.pow(n,1.25))),S=-S}const C=m.kind!=="free",t=ee(d,v,C?.9:1.25,C?.5:.45);if(C)for(let n=0;n<t.rad.length;n++)t.rad[n]*=1+.09*Math.sin(n*.83+s)+.06*Math.sin(n*2.1+s*3);if(M.tube(t.pts,t.rad,C?16:12),m.kind==="ground"){const n=l.gate[l.gate.length-1];for(let z=0;z<3;z++){const P=s+2.2+z*2,g=G(P,1),L=ee([n.clone().setY(.9),n.clone().addScaledVector(g,1.3).setY(.45),n.clone().addScaledVector(g,2.7).setY(.05),n.clone().addScaledVector(g,3.8).setY(-.5)],[.5,.36,.22,.08],.6,.5);M.tube(L.pts,L.rad,8)}}f(t.pts,t.rad,3),l.boughs.push({...m,a:s,pts:t.pts,rad:t.rad})}return c}async function we(a,e,M,l,c){const f=c.fork,u=[],b=4+(e.chance(.5)?1:0),A=e.range(0,Y);for(let t=0;t<b;t++){const n=A+t/b*Y+e.range(-.3,.3),z=e.range(44,58),P=e.range(7,17),g=[new o.Vector3(f.x,f.y-2,f.z)],L=[1.25],F=4;for(let r=1;r<=F;r++){const y=r/F,V=G(n+1.57,(r%2?1:-1)*e.range(1,3.2)*y);g.push(G(n,P*Math.pow(y,.8)+(r===1?2.2:0),f.y+(z-f.y)*Math.pow(y,.9)).add(V)),L.push(o.MathUtils.lerp(1.05,.22,Math.pow(y,.8)))}const i=ee(g,L,2.2);M.tube(i.pts,i.rad,9);for(let r=2;r<i.pts.length;r+=2)l.push({p:i.pts[r],r:i.rad[r]})}const h=c.boughs.find(t=>t.kind==="moon");let B=0,N=1e9;for(let t=4;t<h.pts.length-2;t++){const n=Math.hypot(h.pts[t].x,h.pts[t].z);n>27&&n<36&&h.pts[t].y<N&&(N=h.pts[t].y,B=t)}const w=h.pts[B],m=3,s=new o.Vector3(w.x,w.y+h.rad[B]*.75+m,w.z);c.moon=s,c.moonR=m,c.moonSeat=w.clone();const p=G(h.a,1),d=new o.Vector3(.98,0,-.2);c.moonView=ae.clone();for(const t of[-1,1]){const n=(g,L,F,i)=>s.clone().addScaledVector(d,t*g).addScaledVector(ae,L).addScaledVector(p,F).setY(s.y+i),z=[w.clone().addScaledVector(ae,.3).setY(w.y-.25),n(m*.66,.25,0,-m*.8),n(m+.12,.15,0,-.5),n(m+.24,0,.4,1.7),n(m+2.2,0,2.5,6.5),n(m+6.5,0,4+e.range(0,3),11.5)],P=ee(z,[.3,.56,.5,.42,.3,.14],.7,.4);for(let g=0;g<P.rad.length;g++)P.rad[g]*=1+.2*Math.sin(g*1.3+t)+.1*Math.sin(g*2.9+1.7*t),P.pts[g].y+=.1*Math.sin(g*1.9+t);M.tube(P.pts,P.rad,10),l.push({p:P.pts[P.pts.length-2],r:.25})}let v=B;for(;v<h.pts.length-2&&Math.hypot(h.pts[v].x,h.pts[v].z)<40;)v++;c.swingTop=h.pts[v].clone(),c.swingAxis=p.clone(),c.swingR=h.rad[v];const k=c.boughs[3],S=Math.min(k.pts.length-2,12);c.perch=k.pts[S].clone().setY(k.pts[S].y+k.rad[S]),c.perchDir=G(k.a+1.57,1);const T=[[27,34,58],[35,15,46],[42,0,27],[50.5,0,38],[58,0,29],[65.5,0,16]],x=[];for(let t=0;t<T.length;t++){const[n,z,P]=T[t],g=t>=3?11.5:16.5,L=e.range(0,Y);for(let F=P-5;F>=z-2;F-=g){const i=Math.max(F,.01),r=Math.max(1,Math.round(Y*i/(t>=3?12.5:17))),y=e.range(0,Y);for(let V=0;V<r;V++){if(t<3&&e.chance(t===0?.06:.14))continue;const R=y+L+V/r*Y+e.range(-.12,.12),q=i+e.range(-3.5,3.5),D=t===0?-5.5*o.MathUtils.smoothstep(q,52,66):0;if(!(t<3&&n+6.5>me*Math.sqrt(Math.max(0,1-Math.pow(q/(ue*.93),2))))&&(x.push({c:G(R,Math.max(0,q),n+e.range(-1.6,1.6)*(t>=3?1.9:1)+D),ti:t}),i<1))break}}}for(const t of c.tips||[])u.push({p:t.clone().setY(t.y+.5),s:7.6,f:.72,seed:e()},{p:t.clone().add(new o.Vector3(Math.sign(t.x)*4.6,.6,3.2)),s:6,f:.75,seed:e()},{p:t.clone().add(new o.Vector3(-Math.sign(t.x)*3.2,3.4,-1.5)),s:5.4,f:.8,seed:e()});await a.yield();let C=0;for(const t of x){C++%16===15&&await a.yield();const n=t.c,z=Math.hypot(n.x,n.z);let P=null,g=1e9;for(const K of l){if(K.p.y>n.y-3.5)continue;const X=Math.hypot(K.p.x,K.p.z);if(K.p.y<21&&X>25&&X<48)continue;const te=Math.hypot(K.p.x-n.x,K.p.z-n.z),oe=te*1.15+(n.y-K.p.y)*.45-K.r*6;oe<g&&(g=oe,P=K)}if(!P)continue;const L=P.p,F=L.y<21&&z>24&&z<50,i=new o.Vector3().lerpVectors(L,n,F?.3:.55);i.y=L.y+(n.y-L.y)*(F?.8:.3)+e.range(-.6,.6),i.add(G(e.range(0,Y),e.range(.5,2.2)));const r=n.clone();r.y-=1.2;const y=Math.min(P.r*.62,.58),V=L.distanceTo(n),R=K=>{const X=Math.sin(n.x*12.9898+n.z*78.233+n.y*37.719+K*4.137)*43758.5453;return X-Math.floor(X)},q=new o.Vector3().subVectors(r,L),D=new o.Vector3(-q.z,0,q.x);D.lengthSq()<1e-4&&D.set(1,0,0),D.normalize();const E=(K,X)=>new o.Vector3().lerpVectors(i,r,K).addScaledVector(D,(R(X)-.5)*Math.min(4.2,V*.16)).setY(i.y+(r.y-i.y)*Math.pow(K,.8)+(R(X+7)-.5)*.9),U=new o.Vector3().lerpVectors(L,i,.5).addScaledVector(D,(R(1)-.5)*Math.min(2.4,V*.1));U.y+=.25*(i.y-L.y)*(F?.5:-.3);const I=E(.4,2),W=E(.74,3),H=ee([L.clone(),U,i,I,W,r],[y*1.2,y*.95,y*.74,y*.52,y*.32,.09],Math.max(1.5,V/11),.5);M.tube(H.pts,H.rad,6);{const K=ee([I.clone(),I.clone().lerp(n,.4).addScaledVector(D,(R(4)<.5?-1:1)*(1.6+2*R(5))).setY(I.y+1.2+1.5*R(6)),n.clone().addScaledVector(D,(R(4)<.5?-1:1)*(3+2.5*R(8))).setY(n.y-.6)],[y*.36,y*.22,.06],2.2,.5);M.tube(K.pts,K.rad,4)}for(let K=3;K<H.pts.length;K+=3)l.push({p:H.pts[K],r:H.rad[K]});const j=e.int(2,3)+(e.chance(.4)?1:0),$=e.range(5.2,7.4),Z=t.ti>=3;u.push({p:n.clone(),s:$,f:Z?e.range(.7,.88):e.range(.52,.66),seed:e()}),Z&&u.push({p:n.clone().add(G(e.range(0,Y),$*.3,$*e.range(.45,.65))),s:$*e.range(.6,.75),f:e.range(.75,.95),seed:e()});for(let K=0;K<j;K++){const X=e.range(3,5.2),te=e.range(0,Y);u.push({p:n.clone().add(G(te,$*e.range(.55,.95),e.range(-.4,2.6)+(Z?e.range(-1.5,2.5):0))),s:X*(Z?1.15:1),f:e.range(.6,.82)+(Z?.1:0),seed:e()})}}return u}function be(a,e,M){const l=J(a,{uniforms:{uBarkA:{value:_("#3d3228")},uBarkB:{value:_("#75695a")},uLichen:{value:_("#9aa98a")},uMoss:{value:_(M[1]).lerp(_(M[6]),.45)}},vert:`
      attribute vec4 aT; varying vec3 vT; varying vec3 vB;   // vB: place round the limb (0..1), metres along it, radius
      void main(){ vP = position; vN = normal; vT = aT.xyz; vB = vec3(uv, aT.w);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:`
      uniform vec3 uBarkA, uBarkB, uLichen, uMoss; varying vec3 vT; varying vec3 vB;
      // OAK BARK. Long plates running along the limb, parted by deep fissures that join and split, with fine
      // cracks across them. The pattern lives in (round the limb, along the limb): the first is a circle in metres,
      // so it closes on itself, and the second is arc length, so nothing swirls where a limb bends.
      // plates: 3D cells stretched along the limb and cut by the limb's surface (edge = F2 - F1), so they close round
      // the limb with no seam and do not swirl where it bends. Eight neighbours are enough for jittered points.
      vec3 h33(vec3 p){ return fract(sin(vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)))) * 43758.5453); }
      vec2 plates(vec3 q){
        vec3 b = floor(q - .5); float f1 = 9., f2 = 9., id = 0.;
        for (int i = 0; i < 8; i++){
          float fi = float(i); vec3 c = b + vec3(mod(fi, 2.), mod(floor(fi * .5), 2.), floor(fi * .25));
          vec3 hh = h33(c), d = c + .15 + .7 * hh - q; float dd = dot(d, d);
          if (dd < f1) { f2 = f1; f1 = dd; id = hh.x; } else if (dd < f2) f2 = dd;
        }
        return vec2(sqrt(f2) - sqrt(f1), id);
      }
      // height of the bark at (round the limb 0..1, metres along it): x = relief 0..1, y = plate id, z = the long furrows
      vec3 barkH(vec2 ua, float rr){
        float th = ua.x * 6.2832;
        vec3 q = vec3(cos(th) * rr, sin(th) * rr, ua.y);
        vec3 w = q + (vec3(vn3(q * vec3(1.3, 1.3, .5) + 7.), vn3(q * vec3(1.3, 1.3, .5) + 19.), vn3(q * vec3(1.1, 1.1, .6) + 3.)) - .5) * .32;
        // long ridges a hand wide run along the limb between deep furrows; the plates cut them across here and there
        float fur = smoothstep(.1, .62, abs(2. * vn3(w * vec3(4.4, 4.4, .55)) - 1.) + .35 * (vn3(w * vec3(9., 9., 1.7) + 5.) - .5));
        vec2 pl = plates(w * vec3(4.6, 4.6, 1.15) + vec3(0., 0., .6 * vn3(w * vec3(3., 3., .4))));
        float plate = smoothstep(.02, .22, pl.x);
        float crk = smoothstep(.1, .34, abs(2. * vn3(w * vec3(3., 3., 7.) + 31.) - 1.) + .6 * pl.y);   // fine cracks across
        float hgt = fur * (.35 + .65 * plate) * (.72 + .28 * crk);
        return vec3(hgt * (.7 + .3 * pl.y) , pl.y, fur);
      }
      void main(){
        vec3 N = normalize(vN), T = vT / max(length(vT), 1e-4);
        float rr = max(vB.z, .08);
        vec3 q = vec3(cos(vB.x * 6.2832) * rr, sin(vB.x * 6.2832) * rr, vB.y * .3);   // for the broad tones below
        vec3 bh = barkH(vB.xy, rr); float h = bh.x;
        // relief from the height's own screen derivatives (taken here, outside any loop), faded with distance
        vec3 V = normalize(uCamL - vP); float dist = length(uCamL - vP);
        vec3 dpx = dFdx(vP), dpy = dFdy(vP); float hx = dFdx(h), hy = dFdy(h);
        vec3 gr = (dpx * hx + dpy * hy) / max(dot(dpx, dpx) + dot(dpy, dpy), 1e-7);
        gr -= N * dot(gr, N);
        N = normalize(N - clamp(gr * .07, -1.8, 1.8) * smoothstep(110., 22., dist));
        float big = fbm2(q.xz * .35 + q.y * .21);
        vec3 alb = mix(uBarkA * .1, mix(uBarkA, uBarkB, .1 + .45 * big + .3 * bh.y) * (.75 + .5 * h), smoothstep(.06, .5, h));
        float lich = smoothstep(.5, .7, vn3(vP * .55 + 11.) + .25 * bh.y - .1) * h;
        alb = mix(alb, uLichen * (.6 + .4 * vn3(vP * 6.)), lich * .7);
        float up = smoothstep(.12, .7, vN.y / max(length(vN), 1e-4) + (fbm2(vP.xz * .6) - .5) * .7);
        float foot = smoothstep(2.6, .2, vP.y) * smoothstep(.3, .75, vn3(vP * .8 + 3.));
        float mossK = clamp(up * 1.05 + foot * .7, 0., 1.) * (.45 + .55 * smoothstep(.0, .5, h + vn3(vP * 9.) * .5));
        alb = mix(alb, uMoss * (.5 + .6 * vn3(vP * 4.)) * (.75 + .5 * vn3(vP * 23.)), mossK);
        float ao = (.12 + .88 * smoothstep(.0, .6, h)) * smoothstep(-1.5, 2.5, vP.y);
        vec3 c = oakLaw(alb, vP, N, V, mix(.4, 1., ao));
        c *= mix(vec3(.2, .28, .56), vec3(1.), smoothstep(.02, .5, h));           // the cracks hold blue shadow
        { float nB = nightN(vP), dB = length(uMoon - vP);   // close under the moon the plates must still read: hold the cracks dark, knee the flood
          c *= mix(1., (.2 + .8 * smoothstep(.05, .6, h)) / (1. + 2.6 * dot(c, vec3(.3, .5, .2))), nB * smoothstep(21., 8., dB)); }
        // the moss keeps its green by moonlight; the plates' tops take a dry, broad sheen from the moon (no wet glint)
        float n = nightN(vP); vec3 Lm = normalize(uMoon - vP); float dm = length(uMoon - vP);
        float fallm = max(.08, 1. / (1. + dm * dm / 620.));
        c += n * mossK * uMoss * vec3(.7, 1.25, .8) * uMoonCol * (.1 + .5 * fallm) * (.4 + .6 * max(dot(N, Lm), 0.));
        float sh = max(dot(N, normalize(Lm + V + vec3(0., 1e-3, 0.))), 0.); sh *= sh;
        c += uMoonCol * vec3(1.05, 1., .86) * sh * n * (.5 * fallm) * smoothstep(.45, .9, h) * (1. - mossK) * .22 * smoothstep(7., 18., dm);
        c += n * uStarAmb * (alb * 1.4 + .05) * smoothstep(.3, .95, vN.y / max(length(vN), 1e-4)) * smoothstep(14., 60., dist) * 1.1;   // limbs far off keep a starlit upper side: round wood, not black wire
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),c=new o.Mesh(e,l);return c.frustumCulled=!1,c}function Me(a){const M=document.createElement("canvas");M.width=M.height=256;const l=M.getContext("2d");l.clearRect(0,0,256,256);const c=(u,b,A,h,B)=>{l.save(),l.translate(u,b),l.rotate(A),l.beginPath(),l.moveTo(0,0);const N=26,w=[];for(let s=0;s<=N;s++){const p=s/N,d=Math.pow(Math.sin(Math.PI*Math.pow(p,.8)),.7)*(.55+.45*p);w.push([p*h,h*.3*d*(.62+.38*Math.abs(Math.sin(p*Math.PI*4.5)))])}for(const s of w)l.lineTo(s[0],s[1]);for(let s=N;s>=0;s--)l.lineTo(w[s][0],-w[s][1]);l.closePath();const m=Math.round(255*B);l.fillStyle=`rgb(${m},${m},${m})`,l.fill(),l.strokeStyle=`rgba(${Math.round(m*.6)},${Math.round(m*.6)},${Math.round(m*.6)},0.9)`,l.lineWidth=1.2,l.beginPath(),l.moveTo(0,0),l.lineTo(h*.95,0),l.stroke(),l.restore()};for(let u=0;u<40;u++){const b=a.range(0,Y),A=Math.sqrt(a())*256*.36,h=a.range(40,58),B=256/2+Math.cos(b)*A,N=256/2+Math.sin(b)*A;c(B-Math.cos(b)*h*.3,N-Math.sin(b)*h*.3,b+a.range(-.9,.9),h,a.range(.45,1))}const f=new o.CanvasTexture(M);return f.wrapS=f.wrapT=o.RepeatWrapping,f.generateMipmaps=!0,f.minFilter=o.LinearMipmapLinearFilter,f.anisotropy=4,f.needsUpdate=!0,f}async function ze(a,e,M,l,c,f){const u=[0,1,2].map(t=>{const n=fe(new o.IcosahedronGeometry(1,t).deleteAttribute("normal").deleteAttribute("uv"));return{p:n.getAttribute("position"),i:n.index.array}}),b=[],A=[],h=[],B=[],N=[],w=new o.Vector3,m=new o.Vector3,s=new o.Vector3,p=new o.Vector3,d=new o.Vector3(0,1,0),v=(t,n,z)=>{let P=.66,g=t.x,L=t.y,F=t.z;for(const i of n){const r=t.x*i[0]+t.y*i[1]+t.z*i[2],y=i[3]*i[3]-(i[4]-r*r);if(y<=0||r<=0)continue;const V=r+Math.sqrt(y);V>P&&(P=V,g=t.x*V-i[0],L=t.y*V-i[1],F=t.z*V-i[2])}return z&&z.set(g,L,F).normalize(),P};let k=0,S=0;for(const t of l){S++%10===9&&await a.yield();const n=t.p.y<40,z=t.s>5.2,P=u[n?z?2:1:z?1:0],g=t.s*.8,L=[],F=n?z?11:7:6;for(let r=0;r<F;r++){w.set(e.gauss(),e.gauss()*.8+.2,e.gauss()).normalize();const y=e.range(.5,.74),V=e.range(.4,.56);L.push([w.x*y,w.y*y,w.z*y,V,y*y])}for(let r=0;r<P.p.count;r++){w.fromBufferAttribute(P.p,r);const y=g*v(w,L,m);b.push(t.p.x+w.x*y,t.p.y+w.y*y*t.f,t.p.z+w.z*y),m.y/=t.f,m.normalize(),A.push(m.x,m.y,m.z),h.push(-1,.5+.5*w.y),B.push(t.p.x,t.p.y,t.p.z,t.seed)}for(let r=0;r<P.i.length;r++)N.push(k+P.i[r]);k+=P.p.count;const i=Math.round((n?22+t.s*t.s*1.5:10+t.s*t.s*.7)*f);for(let r=0;r<i;r++){w.set(e.gauss(),e.gauss()*(n?1:.85)+(n?0:.12),e.gauss()).normalize();const y=e.chance(n?.55:.4),V=e.range(1.25,1.95)*(.8+t.s*.045)*(n?1.12:1),R=g*v(w,L,null)*e.range(.92,1.06)+(y?V*.42:.1),q=t.p.x+w.x*R,D=t.p.y+w.y*R*t.f,E=t.p.z+w.z*R;y?(s.set(e.gauss(),e.gauss(),e.gauss()),m.crossVectors(w,s),m.lengthSq()<1e-4&&m.set(w.z,0,-w.x+.001),m.normalize()):m.set(w.x+e.range(-.5,.5),w.y/t.f+e.range(-.3,.6),w.z+e.range(-.5,.5)).normalize(),s.crossVectors(Math.abs(m.y)>.9?p.set(1,0,0):d,m).normalize(),p.crossVectors(m,s);const U=e.range(0,Y),I=Math.cos(U)*V,W=Math.sin(U)*V,H=s.x*I+p.x*W,j=s.y*I+p.y*W,$=s.z*I+p.z*W,Z=-s.x*W+p.x*I,K=-s.y*W+p.y*I,X=-s.z*W+p.z*I;b.push(q-H-Z,D-j-K,E-$-X,q+H-Z,D+j-K,E+$-X,q+H+Z,D+j+K,E+$+X,q-H+Z,D-j+K,E-$+X),y?s.set(w.x,w.y/t.f+.2,w.z).normalize():(s.copy(m).lerp(w,.5),s.y+=.25,s.normalize());const te=t.seed+r*.013;for(let oe=0;oe<4;oe++)A.push(s.x,s.y,s.z),B.push(t.p.x,t.p.y,t.p.z,te);h.push(0,0,1,0,1,1,0,1),N.push(k,k+1,k+2,k,k+2,k+3),k+=4}}await a.yield();const T=new o.BufferGeometry;T.setAttribute("position",new o.Float32BufferAttribute(b,3)),T.setAttribute("normal",new o.Float32BufferAttribute(A,3)),await a.yield(),T.setAttribute("uv",new o.Float32BufferAttribute(h,2)),T.setAttribute("aC",new o.Float32BufferAttribute(B,4)),T.setIndex(N),await a.yield();const x=J(M,{side:o.DoubleSide,uniforms:{uMap:{value:Me(e)},uLeafA:{value:_(c[6]).multiplyScalar(.55)},uLeafB:{value:_(c[1])},uLeafC:{value:_(c[1]).lerp(_(c[0]),.38)}},vert:`
      uniform float uTime; attribute vec4 aC; varying vec2 vUv; varying vec4 vC;
      void main(){ vUv = uv; vC = aC; vN = normal;
        float sd = aC.w * 61.7, card = step(0., uv.x);
        vec3 p = position;
        // the whole mass stirs; sprays flutter on top of that
        vec3 sway = vec3(sin(uTime * .8 + sd), .45 * sin(uTime * 1.15 + sd * 1.7), cos(uTime * .66 + sd * 2.3));
        p += sway * (.16 + .1 * card) + normal * card * .1 * sin(uTime * 2.4 + sd * 9. + position.x * .9 + position.z * .7);
        vP = p;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:`
      uniform sampler2D uMap; uniform vec3 uLeafA, uLeafB, uLeafC; varying vec2 vUv; varying vec4 vC;
      void main(){
        float tone = .6, core = step(vUv.x, -.5);
        vec3 N = normalize(vN), V = normalize(uCamL - vP);
        if (core < .5) { vec4 t = texture2D(uMap, vUv); if (t.a < .42) discard; tone = t.r; }
        else {
          // the core of a mass is leaves too: the same sprays laid over it by its dominant axis, cut away
          // toward the outline so no smooth edge is left, and dark between the sprays (depth inside the mass)
          vec3 rel0 = vP - vC.xyz, an = abs(N);
          vec2 tuv = an.y > max(an.x, an.z) ? rel0.xz : (an.x > an.z ? rel0.zy : rel0.xy);
          float lod = clamp(log2(max(length(uCamL - vP), 1.) / 14.), 0., 4.);
          vec4 t = textureLod(uMap, tuv * .23 + vC.w * 7.3, lod);
          vec4 t2 = textureLod(uMap, tuv.yx * .31 + vC.w * 3.1 + .37, lod);
          float a = max(t.a, t2.a * .9); tone = mix(.16, max(t.r * t.a, t2.r * t2.a * .8), smoothstep(.3, .6, a));
          if (a < .42 && abs(dot(N, V)) < .62) discard;
        }
        if (!gl_FrontFacing) N = -N;
        float hgt = clamp((vP.y - vC.y) / 5. + .5, 0., 1.);            // underside of a mass is darker
        float var = h11(vC.w * 7.3);
        vec3 alb = mix(uLeafA, mix(uLeafB, uLeafC, var * .6 + .25 * tone), tone * (.45 + .55 * hgt));
        alb *= 1. - .3 * core;
        float ao = .35 + .65 * smoothstep(.1, .85, hgt);
        float n = nightN(vP);
        // sprays are thin: light them from whichever side the light is on
        vec3 Nl = N; if (core < .5 && dot(Nl, mix(uSunDir, normalize(uMoon - vP), n)) < 0.) Nl = -Nl;
        vec3 c = oakLaw(alb, vP, Nl, V, ao);
        // leaves let a little noon through
        c += alb * uSunCol * .22 * (1. - n) * max(dot(-N, uSunDir), 0.) * (1. - core);
        // the low moon lights each mass from beneath: the side of a mass that faces it is ivory-green, and the
        // rest keeps a luminous blue floor, so tiers read as lobed shapes with lit edges, never as black cores
        vec3 toM = uMoon - vC.xyz; float dM = max(length(toM), 1e-3);
        vec3 rel = vP - vC.xyz;
        float face = dot(rel / max(length(rel), 1e-3), toM / dM);
        float mfall = 1. / (1. + dM * dM / 2600.);
        c += n * (alb * 2.6 + .015) * uMoonCol * vec3(1.05, 1., .85) * smoothstep(-.15, .9, face) * (.22 + .78 * mfall) * (.5 + .5 * tone);
        // each billow is rimmed by the moon where it turns away from the eye, and holds blue starlight in its hollows
        float rimL = 1. - abs(dot(N, V)); rimL *= rimL;
        c += n * uMoonCol * vec3(.9, 1.05, .9) * rimL * smoothstep(-.5, .5, dot(N, toM / dM)) * (.1 + .5 * mfall) * (.4 + .6 * tone);
        c += n * uStarAmb * (.07 + .11 * tone);
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),C=new o.Mesh(T,x);return C.frustumCulled=!1,C}const ie=`
uniform vec3 uSkyLo;  // base night, zenith
uniform vec3 uSkyHi;  // luminous blue toward the hem
uniform vec3 uMilky;
uniform float uMeteorP;   // seconds between meteors
uniform float uStarPx;    // drawing buffer height / 450: star sizes are set in pixels of a 450-line picture
vec3 wheel(vec3 d){ float a = uTime * .02618; float c = cos(a), s = sin(a); return vec3(c * d.x - s * d.z, d.y, s * d.x + c * d.z); }
// Stars are measured ON SCREEN: the offset from the fragment to its cell's star is taken through the screen
// derivatives of the sky direction (set by starPix), so every star is a round point of a set pixel size
// however obliquely the wall is seen and however the dome is squashed. Five magnitudes; the brightest of the
// coarse grid carry a four-point glint and a soft round glow. pix > 0 = no derivatives (the pond's mirror):
// the disc is then round in angle instead.
vec3 gSdx = vec3(0.), gSdy = vec3(0.);
vec3 starGrid(vec3 dir, float N, float sd, float pix){
  float l1 = abs(dir.x) + abs(dir.y) + abs(dir.z);
  vec2 e = dir.xz / max(l1, 1e-4); vec2 g = vec2(e.x + e.y, e.x - e.y) * N * .5;
  vec2 id = floor(g);
  float h = h21(id + sd), h2 = h21(id * 1.7 + sd + 3.1), h3 = h21(id + 9.7 + sd);
  vec2 u = (id + .24 + .52 * vec2(h2, h3)) / (N * .5);
  vec2 es = vec2(u.x + u.y, u.x - u.y) * .5;
  vec3 sdir = normalize(vec3(es.x, max(1. - abs(es.x) - abs(es.y), 0.) + 1e-4, es.y));
  vec3 dl = dir - sdir;
  float mag = floor(h * h * h * 5.) / 4.;                  // five magnitudes, the faint ones the most
  mag = mag * mag * .85 + .15 * h * h;
  float tw = .72 + .28 * sin(uTime * (1.2 + 3.5 * h3) + h2 * 60.);
  vec3 tint = mix(vec3(.72, .82, 1.), vec3(1., .9, .74), smoothstep(.55, .95, h2));
  if (pix > 0.) {
    float ra = (.0035 + .006 * mag) * pix / .05;
    return tint * smoothstep(ra, ra * .3, length(dl)) * (.22 + 5.5 * mag) * tw;
  }
  float a = dot(gSdx, gSdx), b = dot(gSdx, gSdy), c = dot(gSdy, gSdy), det = a * c - b * b;
  float p = dot(gSdx, dl), q = dot(gSdy, dl);
  vec2 s = vec2(c * p - b * q, a * q - b * p) / max(det, 1e-14);
  float px = max(uStarPx, .5), big = step(N, 25.);
  float r = px * (.8 + (.75 + .75 * big) * mag), d = length(s);
  float disc = smoothstep(r, r * .3, d);
  float I = .3 + 5.2 * mag;
  vec2 sa = abs(s) / px;
  float gl = big * step(.5, mag) * ((exp(-sa.x * .3) * exp(-sa.y * sa.y * 1.6) + exp(-sa.y * .3) * exp(-sa.x * sa.x * 1.6)) * .9 + exp(-d * d / (px * px * 22.)) * .3);
  return tint * (disc * I + gl) * tw * step(1e-14, det);
}
float starPix(vec3 dir, float N){ gSdx = dFdx(dir); gSdy = dFdy(dir); return 0.; }
vec3 milkyWay(vec3 d){
  vec3 m = normalize(vec3(.83, .24, .5));
  float x = dot(d, m), band = exp(-x * x * 9.), core = exp(-x * x * 70.);
  float n1 = vn3(d * 4.5 + 2.), n2 = vn3(d * 11. + 9.), n3 = vn3(d * 27. + 4.);
  float cloud = band * (.22 + 1.25 * n1 * n1) * (.5 + .5 * n2) + core * (.3 + .7 * n2) * .55;
  float lane = smoothstep(.13, .0, abs(x + (n1 - .5) * .26)) * smoothstep(.3, .65, vn3(d * 7. + 4.));
  vec3 c = uMilky * cloud * (.78 + .44 * n3) + vec3(1., .82, .62) * uMilky.g * core * n1 * .3;
  return c * (1. - .6 * lane);
}
vec3 meteor(vec3 dir){
  float T = uTime / max(uMeteorP, .5), k = floor(T), ph = fract(T) * max(uMeteorP, .5);
  float life = clamp(ph / .9, 0., 1.);
  vec3 a = normalize(vec3(h11(k) * 2. - 1., .35 + .55 * h11(k + .3), h11(k + .7) * 2. - 1.));
  vec3 v = normalize(vec3(h11(k + 1.3) - .5, -.35 - .3 * h11(k + 2.1), h11(k + 3.7) - .5));
  vec3 head = a + v * life * .5, pa = dir - head;
  float t = clamp(dot(pa, -v), 0., .22);
  float dd = length(pa + v * t);
  float w = .0035 + .0005 * 0.;
  return vec3(.85, .92, 1.) * 3.2 * exp(-dd * dd / (w * w)) * (1. - t / .22) * sin(life * 3.1416) * step(ph, .9);
}
// full sky colour for a direction (before the dusk hem)
vec3 nightSky(vec3 dir, float pixA, float pixB){
  vec3 w = wheel(dir);
  vec3 c = mix(uSkyHi, uSkyLo, smoothstep(.0, .75, dir.y));
  c += milkyWay(w);
  c += starGrid(w, 46., 0., pixA) + starGrid(w, 19., 17., pixB) * 1.6;
  c += meteor(dir);
  return c;
}
`;function Se(a,e){const M=new o.SphereGeometry(1,96,28,0,Y,0,Math.PI*.53),l={uSkyLo:{value:_(e[3]).multiplyScalar(1.15)},uSkyHi:{value:_("#1A2A6E").multiplyScalar(1)},uMilky:{value:_("#AEB8F0").multiplyScalar(.8)},uMeteorP:{value:6.3},uStarPx:{value:1}},c=`
    varying vec3 vU;
    void main(){ vU = normalize(position);
      float a = safeAng(vU.zx), rad = uDome.x * domeScale(a) + domeBreath(a);
      vec3 p = vec3(vU.x * rad, vU.y * rad * uDome.y / uDome.x, vU.z * rad);
      vP = p; vN = vU;
      vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
    }`,f=`
    // height of the lifted hem (the exit arch) above the grass at this point of the wall
    float archTop(vec3 p){
      float a = safeAng(p.zx) - uExit.x; a = atan(sin(a), cos(a));
      float s = a * uDome.x / uExit.y;
      return uExit.z * sqrt(max(1. - s * s, 0.));
    }`,u=new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),...a,...l},fog:!0,side:o.BackSide,vertexShader:Q+ne+c,fragmentShader:se+ie+f+`
      uniform float uCamN; varying vec3 vU;
      void main(){
        vec3 dir = normalize(vP * vec3(1., uDome.x / uDome.y, 1.));
        dir.y = abs(dir.y);
        float top = archTop(vP);
        float shim = (vn2(vec2(safeAng(vP.zx) * 60., uTime * .6)) - .5) * .9;
        float hy = vP.y - top + shim;
        if (hy < 0. && top > .05) discard;
        vec3 c = nightSky(dir, starPix(wheel(dir), 46.), starPix(wheel(dir), 19.));
        // from far across the meadow the thousands of stars would run together into pale glitter: there the wall is
        // deep blue with a few dozen separate stars, so the Oak stands as a piece of night on the bright field
        float farK = smoothstep(150., 460., length(vP - uCamL)) * (1. - uCamN);
        vec3 cFar = mix(uSkyHi * .6, uSkyLo, smoothstep(.0, .5, dir.y)) * .8 + starGrid(wheel(dir), 7., 41., 0.) * 1.3;
        c = mix(c, cFar, farK);
        // round the arch of day the sky is kept deep (no Milky Way behind the ring: it would wash to milk in its glow)
        float ea = safeAng(vP.zx) - uExit.x; ea = atan(sin(ea), cos(ea));
        float deep = (1. - smoothstep(.4, 1.05, abs(ea))) * (1. - smoothstep(20., 46., vP.y));
        vec3 cDeep = mix(uSkyHi * .5, uSkyLo * .8, smoothstep(.0, .5, dir.y)) + starGrid(wheel(dir), 19., 17., starPix(wheel(dir), 19.)) * 1.3 + starGrid(wheel(dir), 46., 0., starPix(wheel(dir), 46.)) * .8;
        c = mix(c, cDeep, deep * .9 * (1. - farK));
        // the horizon of dusk: orange at the grass, rose, violet, then night
        float t = hemT(max(hy, 0.));
        vec3 dusk = mix(mix(uRampA, uRampB, smoothstep(.0, .38, t)), uRampC, smoothstep(.3, .72, t));
        float dk = (1. - smoothstep(.45, 1., t));
        c = mix(c, dusk * (1.15 - .55 * t), dk);
        c += uRampA * 1.6 * smoothstep(1.4, 0., hy) * step(.05, top);    // the arch is edged with fire
        vec3 pre = c; gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
        gl_FragColor.rgb = mix(gl_FragColor.rgb, pre, max(uCamN, .55 + .3 * farK));     // night keeps its depth through the noon haze
      }`});return{geo:M,wall:u,vert:c,archGL:f,skyU:l}}const he=`
float fogAmt(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      return smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 0.;
  #endif
}`;function ke(a,e,M){return new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),...a,...e.skyU,uVeil:{value:_(M[3]).lerp(_("#1A2A6E"),.45).multiplyScalar(1.5)},uCamD:{value:100}},fog:!0,side:o.FrontSide,transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,vertexShader:Q+ne+e.vert,fragmentShader:se+ie+e.archGL+he+`
      uniform vec3 uVeil; uniform float uCamD; varying vec3 vU;
      void main(){
        float top = archTop(vP);
        if (vP.y < top && top > .05) discard;
        vec3 sc = vec3(1., uDome.x / uDome.y, 1.);
        vec3 o = uCamL * sc, dv = (vP - uCamL) * sc; float dl = max(length(dv), 1e-3); vec3 d = dv / dl;
        float R = length(vP * sc);
        float b = dot(o, d), cc = dot(o, o) - R * R, sq = sqrt(max(b * b - cc, 0.));
        float t0 = max(-b - sq, 0.), t1 = -b + sq;
        if (d.y < -1e-4) t1 = min(t1, -o.y / d.y);
        float chord = max(t1 - t0, 0.);
        float vis = smoothstep(0., 10., uCamD);
        float a = .62 * smoothstep(0., 1., chord / (1.5 * uDome.x)) * vis;
        vec3 dir = normalize(vP * sc); dir.y = abs(dir.y);
        vec3 w = wheel(dir);
        vec3 st = starGrid(w, 30., 31., starPix(w, 30.)) * 1.2 + starGrid(w, 15., 5., starPix(w, 15.)) * 1.5;
        float farK = smoothstep(150., 460., length(vP - uCamL));
        st = st * (1. - .97 * farK) + starGrid(w, 5., 23., 0.) * 1.4 * farK;
        a = mix(a, min(a * 1.35, .86), farK);
        st *= smoothstep(.12, .45, abs(dot(normalize(vU * vec3(1., uDome.x / uDome.y, 1.)), -d)));
        // the skirt of dusk seen from outside
        float t = hemT(max(vP.y, 0.) * 1.19);
        vec3 dusk = mix(mix(uRampA, uRampB, smoothstep(.0, .4, t)), uRampC, smoothstep(.3, .8, t)) * (1. - t) * (1. - t) * .42;
        vec3 c = uVeil * a + (st * smoothstep(.02, .25, chord / uDome.x) + dusk) * vis;
        c = mix(c, fogColor * a, fogAmt() * (.45 - .25 * farK));
        gl_FragColor = vec4(c, a);
      }`})}function Pe(a,e,M,l){const c=a.uIsle.value,f=[],u=[],b=[],A=7,h=28;if(l){const s=new o.CircleGeometry(M,96);s.rotateX(-Math.PI/2),s.translate(0,.02,0),f.push(s.deleteAttribute("normal").deleteAttribute("uv"))}u.push(c.x,le(a,c.x,c.y),c.y);for(let s=1;s<=A;s++)for(let p=0;p<h;p++){const d=p/h*Y,v=s/A*Math.cos(d)*c.z,k=s/A*Math.sin(d)*c.w,S=c.x+O.x*v+O.z*k,T=c.y+O.z*v-O.x*k;u.push(S,le(a,S,T),T);const x=1+(s-1)*h+p,C=1+(s-1)*h+(p+1)%h;s===1?b.push(0,C,x):b.push(x-h,C,x,x-h,C-h,C)}const B=new o.BufferGeometry;B.setAttribute("position",new o.Float32BufferAttribute(u,3)),B.setIndex(b),f.push(B);const N=f.length>1?ce(f):B,w=J(a,{side:o.DoubleSide,uniforms:{uGrassA:{value:_(e[6]).lerp(_(e[1]),.35)},uGrassB:{value:_(e[1])},uFlower:{value:_(e[0]).multiplyScalar(.92)},uPale:{value:_(e[4])},uEdge:{value:M}},vert:`
      void main(){ vP = position; vN = vec3(0., 1., 0.);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:`
      uniform vec3 uGrassA, uGrassB, uFlower, uPale; uniform float uEdge; uniform vec4 uPond, uIsle; uniform vec2 uIsleDir;
      void main(){
        float r = length(vP.xz);
        if (h21(floor(gl_FragCoord.xy)) < smoothstep(uEdge - 16., uEdge - 1., r)) discard;
        float n = nightN(vP);
        vec2 p = vP.xz;
        // gusts cross the meadow as visible waves
        float gust = vn2(p * .045 + vec2(uTime * .22, uTime * .09)) * .6 + vn2(p * .17 + vec2(uTime * .5, 0.)) * .4;
        float blades = vn2(p * vec2(9., 3.1) + gust * 1.5) * .4 + vn2(p * 23.) * .35 + vn2(p * 61.) * .25;
        float patchy = fbm2(p * .08 + 3.);
        vec3 alb = mix(uGrassA, uGrassB, .2 + .35 * patchy + .45 * blades);
        // seed heads and buttercup drifts outside; under the oak the sward is short and the flowers are pale
        float meadow = smoothstep(uDome.x - 22., uDome.x - 4., r + (patchy - .5) * 18.);
        float drift = smoothstep(.42, .62, fbm2(p * .06 + 9.));
        vec2 cell = floor(p * 3.2), cf = fract(p * 3.2) - .5;
        float fh = h21(cell), dot1 = smoothstep(.2, .09, length(cf + (vec2(h21(cell + 3.), h21(cell + 7.)) - .5) * .5));
        float butter = step(1. - (.1 + .5 * drift) * meadow, fh) * dot1;
        alb = mix(alb, uFlower, butter * (1. - .65 * n));
        // under the oak: white campion in loose drifts and scattered daisies, heads 17 cm so they read from the air
        float driftN = smoothstep(.36, .68, fbm2(p * .085 + 21.));
        vec2 cell2 = floor(p * 2.3), cf2 = fract(p * 2.3) - .5;
        float dC = length(cf2 + (vec2(h21(cell2 + 3.), h21(cell2 + 7.)) - .5) * .5);
        float petals = .78 + .22 * cos(safeAng(cf2.yx + 1e-3) * 5. + h21(cell2) * 6.);
        float head = smoothstep(.2, .12, dC / petals) * step(1. - (.02 + .3 * driftN), h21(cell2 + 21.)) * (1. - meadow);
        float pale = max(step(.9, h21(cell + 21.)) * dot1 * (1. - meadow * .6), head);
        // fine blades, and the dapple of boughs and leaf tiers across the moonlight
        float fine = vn2(p * vec2(34., 10.) + gust * 2.) * .6 + vn2(p * vec2(11., 37.) + 5.) * .4;
        float tips = smoothstep(.5, .85, fine * .65 + blades * .35);
        vec3 toM = uMoon - vP; float dmn = length(toM), mpool = smoothstep(27., 6., dmn);
        float inN = n * (1. - meadow);
        float dap = smoothstep(.3, .7, fbm2(p * .17 + vec2(sin(uTime * .31), cos(uTime * .23)) * .12 + 40.));
        alb = mix(alb, alb * vec3(.7, 1.3, 1.12) * (.58 + .42 * dap) * (.82 + .5 * tips), inN);
        alb = mix(alb, uPale * .82, pale);
        alb *= mix(.8 + .4 * blades, .72 + .36 * gust, meadow);
        alb = mix(alb, vec3(.62, .58, .3), meadow * .35 * vn2(p * .9 + 4.) * (1. - n));        // straw only in the sun
        alb = mix(alb, uFlower, meadow * (.25 + .5 * drift) * (1. - .7 * n) * (.6 + .4 * blades));
        // roots and pond bank
        float ao = smoothstep(3., 11., r) * .45 + .55;
        float dp = length(p - uPond.xy) - uPond.z;
        vec2 qi = p - uIsle.xy;
        float de = length(vec2(dot(qi, uIsleDir) / uIsle.z, (qi.x * uIsleDir.y - qi.y * uIsleDir.x) / uIsle.w)) + (vn2(p * 1.3) - .5) * .1;
        float onIsle = 1. - smoothstep(.55, .76, de);
        // the night sward is blue-green in every season (no straw, no grey)
        float lum = dot(alb, vec3(.3, .5, .2));
        alb = mix(alb, mix(alb, lum * vec3(.5, 1.12, .92) * 1.3, .72), inN * (1. - pale));
        alb = mix(alb, vec3(.05, .07, .09), smoothstep(1.6, -.2, dp + (vn2(p * 1.3) - .5) * 1.2) * .8 * (1. - onIsle));
        vec3 N = normalize(vec3((blades - .5) * .5, 1., (gust - .5) * .5));
        vec3 V = normalize(uCamL - vP);
        vec3 c = oakLaw(alb, vP, N, V, ao);
        // blade tips rimmed ivory-blue toward the moon, strongest in its pool on the lawn
        c += inN * uMoonCol * vec3(.8, .93, 1.12) * tips * (.035 + .1 * mpool + .06 / (1. + dmn * dmn / 900.)) * (.5 + .5 * dap);
        c += uPale * pale * n * .2 * (.6 + .4 * sin(uTime * 1.7 + fh * 40.));   // campion and daisies glimmer
        // THE ARCH OF DAY spills a fan of gold over the first 20-30 m of sward, bright at the mouth, blades lit from behind
        vec3 Le; float fan = exitFan(vP, Le);
        float depth = max(uDome.x - dot(p, vec2(sin(uExit.x), cos(uExit.x))), 0.);
        float spill = fan * .55 * n;
        c = mix(c, c * vec3(.72, 1.06, 1.0), inN * (1. - clamp(spill, 0., 1.)));       // moonlit grass stays cool
        vec3 sunGrass = mix(mix(uGrassA, uGrassB, .35 + .4 * blades) * vec3(1., 1.05, .7), vec3(.5, .4, .15), .45);
        c = mix(c, c * .45, clamp(spill, 0., 1.));
        c += uSunCol * vec3(1.12, .7, .25) * clamp(spill, 0., 1.6) * (sunGrass * 1.25 + tips * .22 + pale * .25);
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),m=new o.Mesh(N,w);return m.frustumCulled=!1,m}function le(a,e,M){const l=a.uIsle.value,c=e-l.x,f=M-l.y,u=(c*O.x+f*O.z)/l.z,b=(c*O.z-f*O.x)/l.w;return-.3+.82*Math.pow(Math.max(0,1-u*u-b*b),.8)}function de(a,e,M){const l=Math.atan2(a.x,Math.abs(a.z)<1e-4?1e-4:a.z),c=Math.sin(l*3+.7)*.5+Math.sin(l*5+2.1)*.3+Math.sin(l*8+4)*.2,f=M.w*(Math.sin(l*2+e*.79)*.55+Math.sin(l*5-e*.52+1.3)*.45);return Math.hypot(a.x,a.y*M.x/M.y,a.z)-M.x*(1+.06*c)-f}async function _e(a,e={}){const M=(e.palette&&e.palette.length>=7?e.palette:ve).slice(),l=o.MathUtils.clamp(e.detail??a.quality?.detail??1,.6,1),c=a.rng.fork?a.rng.fork("night-oak"):a.rng,f=new o.Group;f.name="night-oak";const u=pe(M),b={},A=ge(),h=await ye(a,c,A,b);await a.yield();const B=await we(a,c,A,h,b);u.uMoon.value.copy(b.moon),await a.yield();const N=A.geometry();await a.yield(),f.add(be(u,N,M)),await a.yield();const w=await ze(a,c,u,B,M,l);f.add(w),await a.yield();const m=G(-62*Math.PI/180,30),s=15;u.uPond.value.set(m.x,m.z,s,0),u.uIsle.value.set(m.x-O.x*5.5-O.z*7.8,m.z-O.z*5.5+O.x*7.8,9.5,4.6),f.add(Pe(u,M,118,e.ground!==!1)),await a.yield();const p=Se(u,M),d=new o.Mesh(p.geo,p.wall);d.frustumCulled=!1,d.renderOrder=-.5,f.add(d);const v=ke(u,p,M),k=new o.Mesh(p.geo,v);k.frustumCulled=!1,k.renderOrder=20,f.add(k),await a.yield(),b.moonTilt=c.range(-.5,.35);const S=await De(a,c,f,u,b,M,l,{pondC:m,pondR:s,dome:p}),T=new o.Vector3;let x=0;const C={object:f,radius:78,height:70,center:new o.Vector3(0,24,0),ground:!0,groundY:0,uniforms:u,lawGLSL:ne,skyGLSL:ie,anchors:{},nightD(t,n=u.uTime.value){return de(f.worldToLocal(T.copy(t)),n,u.uDome.value)},setProgress(t){x=o.MathUtils.clamp(t,0,1)},setMoon(t){u.uPhase.value=t==="full"?1:t==="none"?-1:0,p.skyU.uMilky.value.copy(_("#AEB8F0")).multiplyScalar(t==="none"?1.25:t==="full"?.5:.8),p.skyU.uMeteorP.value=t==="none"?2.1:6.3},setSun(t){u.uSunDir.value.copy(t).transformDirection(f.matrixWorld.clone().invert()).normalize()},update(t,n,z){u.uTime.value=n,f.updateWorldMatrix(!0,!1),z.getWorldPosition(T),f.worldToLocal(T),u.uCamL.value.copy(T);const P=de(T,n,u.uDome.value);u.uCamN.value=1-o.MathUtils.smoothstep(P,-re,re),v.uniforms.uCamD.value=P;const g=1-o.MathUtils.smoothstep(T.distanceTo(b.stag.piv),14,30),L=Math.max(x,g),F=u.uProgress;F.value+=(L-F.value)*Math.min(1,t*1.6),S.update(t,n,z,T)},dispose(){w.material.uniforms.uMap.value.dispose()}};return Object.assign(C.anchors,S.anchors),C}function Ve(a,e,M){const l=e.moonR,c=new o.SphereGeometry(l,48,32);c.translate(e.moon.x,e.moon.y,e.moon.z);const f=new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),...a,uIvory:{value:_(M[4]).lerp(_("#fff2cf"),.45)},uEarth:{value:_("#2A3566")},uTilt:{value:e.moonTilt}},fog:!0,vertexShader:Q+`
      uniform vec3 uMoon;
      void main(){ vP = position; vN = normalize(position - uMoon);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:se+`
      uniform vec3 uIvory, uEarth; uniform float uTilt, uPhase;
      float crater(vec3 q, float k){
        vec3 g = q * k, id = floor(g), f = fract(g) - .5;
        float h = h31(id), r = .16 + .2 * h31(id + 5.);
        float d = length(f - (vec3(h31(id + 1.), h31(id + 2.), h31(id + 3.)) - .5) * .3);
        float bowl = smoothstep(r, r * .35, d), rim = smoothstep(r * 1.5, r, d) * smoothstep(r * .6, r, d);
        return (rim * .35 - bowl) * step(.45, h);
      }
      float relief(vec3 q){ return crater(q, 1.1) * .5 + crater(q + 7.3, 2.3) * .3 + crater(q + 3.1, 5.2) * .16 + (vn3(q * 3.) - .5) * .12; }
      void main(){
        vec3 q = (vP - uMoon) * 1.25, N = normalize(vN);
        float h = relief(q), e = .05;
        vec3 g = vec3(relief(q + vec3(e, 0., 0.)) - h, relief(q + vec3(0., e, 0.)) - h, relief(q + vec3(0., 0., e)) - h) / e;
        g -= N * dot(g, N); vec3 Nb = normalize(N - g * .16);
        // crescent light: from behind and to one side of the moon as seen by this viewer
        vec3 view = normalize(uMoon - uCamL);
        vec3 right = cross(view, vec3(0., 1., 0.)); right = right / max(length(right), 1e-3);
        vec3 upv = cross(right, view);
        float ph = max(uPhase, 0.), nw = step(uPhase, -.5);
        // the lit face is turned toward the viewer (a fat waxing moon; full on some visits; new = earthshine and a hair of rim)
        vec3 L = normalize(view * mix(mix(-.8, -1., ph), -.62, nw) + (right * cos(uTilt) + upv * sin(uTilt)) * mix(mix(.6, .3, ph), .78, nw));   // no-moon visits: a slim bright crescent holding the old moon in its arms
        // craters are shadowed bowls on the lit face only: the dark limb stays smooth earthshine, nothing glints there
        float geo = smoothstep(-.1, .16, dot(N, L));
        // soft relief: a bowl's far wall catches the light and its near wall falls into shadow; no hard ring outlines
        float nl = max(dot(N, L), 0.), rel = dot(Nb, L) - dot(N, L);
        // seen from far off the moon is a lamp; as the eye comes near it becomes a place: the lit face eases down below
        // the bloom threshold, the seas deepen and the bowls fill with shadow, so at ten metres it is ivory, never white
        float nearK = 1. - smoothstep(13., 52., length(uCamL - uMoon));
        float lit = geo * (.62 + .38 * nl) * clamp(1. + mix(1.5, 2.6, nearK) * rel, mix(.5, .3, nearK), 1.22);
        float maria = smoothstep(.36, .7, fbm2(q.xy * .7 + q.z * .4));
        vec3 alb = uIvory * (.86 - mix(mix(.34, .56, nearK), .48, ph) * maria + h * mix(.2, .34, nearK)) * mix(1., .5 + .5 * max(dot(N, -view), 0.), ph);   // a full moon gets limb darkening and deeper seas
        vec3 c = alb * vec3(1., .94, .82) * lit * mix(1.5, 1.35, ph) * mix(1., .68, nearK) * (1. + .3 * nw) + uEarth * (.6 + .35 * max(dot(N, -view), 0.)) * (1. - geo) * (1. - .25 * maria) * (1. + 1.2 * nw);
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),u=new o.Mesh(c,f);u.frustumCulled=!1,u.name="moon";const b=new o.PlaneGeometry(19,19),A=new o.ShaderMaterial({uniforms:{uMoon:a.uMoon,uCamL:a.uCamL,uCol:{value:_(M[4])}},transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,vertexShader:`uniform vec3 uMoon, uCamL; varying vec2 vUv; varying float vK;
      void main(){ vUv = uv * 2. - 1.; vK = mix(1., .4, 1. - smoothstep(13., 52., length(uCamL - uMoon))); vec4 mv = modelViewMatrix * vec4(uMoon, 1.); mv.xy += position.xy; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform vec3 uCol; varying vec2 vUv; varying float vK;
      void main(){ float d = length(vUv); float a = smoothstep(1., .0, d); a = a * a * a; gl_FragColor = vec4(uCol * vec3(.92, .96, 1.08) * a * .5 * vK, 1.); }`}),h=new o.Mesh(b,A);return h.frustumCulled=!1,h.renderOrder=21,h.name="moon",[u,h]}function Ae(a,e,M,l){const c=Math.round(500*l),f=Math.round(700*l),u=Math.round(90*l),b=Math.round(c*.5),A=c+f+u+b,h=[],B=new Float32Array(A*12),N=new Float32Array(A*8),w=new Float32Array(A*16),m=new Uint16Array(A*6),s=(S,T,x,C,t,n,z,P)=>{for(let g=0;g<4;g++)B.set([T,x,C],S*12+g*3),N.set([g===1||g===2?1:0,g>=2?1:0],S*8+g*2),w.set([t,n,z,P],S*16+g*4);m.set([S*4,S*4+1,S*4+2,S*4,S*4+2,S*4+3],S*6)};let p=0;for(let S=0;S<c;S++){const T=a.range(0,Y),x=6+Math.pow(a(),.7)*64,C=G(T,x,.4+Math.pow(a(),2.2)*9),t=a();s(p++,C.x,C.y,C.z,t,0,a.range(.1,.17),0),C.y<3.2&&h.length<b&&h.push([C.x,C.y,C.z,t])}for(let S=0;S<f;S++)s(p++,a.range(-2,2),a.range(.05,1.2),0,a(),1,a.range(.06,.13),a.range(0,Y));for(let S=0;S<u;S++){const T=a.range(0,Y),x=a.range(.08,1.2);s(p++,Math.sin(T)*Math.cos(x),Math.sin(x),Math.cos(T)*Math.cos(x),a(),2,a.range(.16,.3),0)}for(const S of h)s(p++,S[0],S[1],S[2],S[3],3,1.5,0);const d=new o.BufferGeometry;d.setAttribute("position",new o.BufferAttribute(B,3)),d.setAttribute("uv",new o.BufferAttribute(N,2)),d.setAttribute("aS",new o.BufferAttribute(w,4)),d.setIndex(new o.BufferAttribute(m,1)),d.setDrawRange(0,p*6);const v=new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),...e,uFly:{value:_("#D8F07A")},uPx:{value:400}},fog:!0,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,vertexShader:Q+ne+`
      attribute vec4 aS; uniform vec3 uFly; uniform float uPx; uniform vec2 uWind; varying vec2 vUv; varying vec3 vCol;
      void main(){
        float sd = aS.x, type = aS.y; vec3 p = position, c; float flat1 = 0.;
        if (type < .5 || type > 2.5) {
          p += vec3(sin(uTime * .31 + sd * 40.) + .5 * sin(uTime * .83 + sd * 13.), .45 * sin(uTime * .47 + sd * 71.), cos(uTime * .27 + sd * 29.) + .5 * cos(uTime * .71 + sd * 53.)) * 1.7;
          p.y = max(p.y, .25);
          float ph = fract(uTime * (.14 + .1 * h11(sd)) + sd * 7.);
          c = uFly * 4.2 * smoothstep(0., .22, ph) * smoothstep(.8, .35, ph) * nightN(p);
          if (type > 2.5) {                       // its pool of light on the grass, fading as the firefly climbs
            c *= .034 * smoothstep(4.2, .4, p.y); flat1 = 1.;
            p.y = .17; p.xz += (uv - .5) * 2. * aS.z * (1. + .25 * position.y);
          }
        } else if (type < 1.5) {
          float a = aS.w + .02 * sin(uTime * .2 + sd * 30.), life = fract(uTime * .07 * (.6 + h11(sd)) + sd);
          float rad = uDome.x * domeScale(a) + domeBreath(a) + position.x + sin(uTime * .6 + sd * 50.) * .4;
          p = vec3(sin(a) * rad, position.y + life * 3.2, cos(a) * rad);
          c = duskRamp(nightN(p)) * 2.6 * sin(life * 3.1416);
        } else {
          float per = 5. + 4. * h11(sd), t = fract(uTime / per + sd) * per;
          float a = safeAng(position.zx), rad = uDome.x * domeScale(a) + domeBreath(a);
          vec3 s0 = vec3(position.x * rad, position.y * rad * uDome.y / uDome.x, position.z * rad);
          float out1 = max(dot(normalize(position.xz + 1e-4), uWind), 0.);
          p = s0 + vec3(uWind.x, -.06, uWind.y) * t * 2.9 + vec3(0., sin(t * 2. + sd * 9.) * .3, 0.);
          c = vec3(.8, .88, 1.) * 4. * smoothstep(3., .6, t) * smoothstep(0., .25, t) * step(.2, out1);
        }
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        float px = aS.z * uPx / max(-mvPosition.z, .1), k = mix(max(1., 1.7 / max(px, 1e-3)), 1., flat1);
        mvPosition.xy += (uv - .5) * 2. * aS.z * k * (1. - flat1);
        float farS = smoothstep(130., 420., -mvPosition.z);
        vCol = c / (k * k) * min(k, 3. - 2. * farS) * (1. - .8 * farS); vUv = uv * 2. - 1.;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      `+he+`
      varying vec2 vUv; varying vec3 vCol;
      void main(){ float a = smoothstep(1., 0., length(vUv)); gl_FragColor = vec4(vCol * a * a * (1. - fogAmt()), 1.); }`}),k=new o.Mesh(d,v);return k.frustumCulled=!1,k.renderOrder=22,k}function Ce(a,e,M,l){const c=[],f=[],u=[],b=[];for(let N=0;N<l;N++){const w=a(),m=a.range(3.8,7.6),s=a.range(-.9,.9),p=a.range(.3,.8)*(a.chance(.5)?1:-1),d=a.range(.2,.31);for(const S of[-1,1]){const T=c.length/3;c.push(0,0,d*.62,S*d,0,d*.62,S*d,0,-d*.5,0,0,-d*.5),u.push(0,1,1,1,1,0,0,0),b.push(T,T+1,T+2,T,T+2,T+3)}const v=c.length/3,k=d*.13;c.push(-k,1,d*.5,k,1,d*.5,k,1,-d*.62,-k,1,-d*.62),u.push(0,1,1,1,1,0,0,0),b.push(v,v+1,v+2,v,v+2,v+3);for(let S=0;S<12;S++)f.push(w,m,s,p)}const A=new o.BufferGeometry;A.setAttribute("position",new o.Float32BufferAttribute(c,3)),A.setAttribute("aM",new o.Float32BufferAttribute(f,4)),A.setAttribute("uv",new o.Float32BufferAttribute(u,2)),A.setIndex(b);const h=new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uTime:e.uTime,uMoon:e.uMoon,uCamL:e.uCamL,uCol:{value:_(M[4]).lerp(_("#f5e6c0"),.5)}},fog:!0,side:o.DoubleSide,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      uniform float uTime; uniform vec3 uMoon, uCamL; attribute vec4 aM; varying float vSh; varying vec2 vL; varying float vBody;
      vec3 orbit(float th, vec4 m){
        float r = m.y * (1. + .22 * sin(th * 3. + m.x * 20.));
        float cy = cos(m.x * 6.283), sy = sin(m.x * 6.283), ct = cos(m.z), st = sin(m.z);
        vec3 q = vec3(cos(th) * r, sin(th * 2. + m.x * 9.) * .8, sin(th) * r);
        q = vec3(q.x, q.y * ct - q.z * st, q.y * st + q.z * ct);
        return uMoon + vec3(q.x * cy - q.z * sy, q.y, q.x * sy + q.z * cy);
      }
      void main(){
        float th = uTime * aM.w + aM.x * 6.283;
        vec3 c = orbit(th, aM), f = orbit(th + .05 * sign(aM.w), aM) - c; f = f / max(length(f), 1e-4);
        // wings spread across the line of sight, so the eye always sees both of them
        vec3 toC = uCamL - c; toC = toC / max(length(toC), 1e-3);
        vec3 rt = cross(f, toC); rt = rt / max(length(rt), 1e-3); vec3 up = cross(rt, f);
        float fl = .25 + .8 * sin(uTime * 17. + aM.x * 50.);
        vBody = position.y;
        vec3 p = c + f * position.z + (rt * cos(fl) * sign(position.x) + up * sin(fl)) * abs(position.x) * (1. - vBody) + rt * position.x * vBody;
        vSh = .7 + .3 * cos(fl); vL = uv;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uCol; varying float vSh; varying vec2 vL; varying float vBody;
      float lobe(float a, float c, float w){ float t = clamp((a - c) / w, -1., 1.); return sqrt(max(cos(t * 1.5708), 0.)); }
      void main(){
        vec3 c;
        if (vBody > .5) {
          // the body: a tapered spindle, dark with pale bands
          vec2 q = vL * 2. - 1.;
          float wd = (1. - q.y * q.y) * (.75 + .25 * q.y);
          if (abs(q.x) > wd) discard;
          c = mix(vec3(.16, .12, .11), uCol * .6, step(.6, fract(vL.y * 7.)) * step(vL.y, .6));
        } else {
          // wing outline in polar form from the root: a long swept forewing, a short round hindwing
          vec2 q = vec2(max(vL.x, 1e-4), vL.y - .45);
          float a = atan(q.y, q.x), r = length(q);
          float fore = 1.02 * lobe(a, .36, .62), hind = .6 * lobe(a, -.62, .75);
          float edge = max(fore, hind);
          if (r > edge) discard;
          float bars = .5 + .5 * sin(r * 26. - a * 3.);
          c = mix(uCol * .5, uCol * 1.05, smoothstep(.2, .8, bars));          // ivory wings barred with grey
          c = mix(c, vec3(.78, .3, .38), step(fore, hind) * smoothstep(.1, .35, r) * .75);   // the rosy hindwing
          c = mix(c, uCol * .3, smoothstep(.82, 1., r / max(edge, 1e-3)));     // dark margin
        }
        gl_FragColor = vec4(c * vSh * 1.15, 1.);
        #include <fog_fragment>
      }`}),B=new o.Mesh(A,h);return B.frustumCulled=!1,B}function Ne(a,e,M,l,c,f){const u=new o.CircleGeometry(f*1.14,64);u.rotateX(-Math.PI/2),u.translate(c.x,.07,c.z);const b=new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),...a,...e.skyU,uWater:{value:_("#070c26")},uIvory:{value:_(l[4]).lerp(_("#fff2cf"),.45)},uTilt:{value:M.moonTilt},uMoonR:{value:M.moonR}},fog:!0,vertexShader:Q+`
      void main(){ vP = position; vN = vec3(0., 1., 0.);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:se+ie+`
      uniform vec4 uPond; uniform vec3 uWater, uIvory; uniform float uTilt, uMoonR, uPhase;
      float wav(vec2 p){ return vn2(p * .8 + uTime * vec2(.13, .07)) * .6 + vn2(p * 2.1 - uTime * vec2(.1, .17)) * .4; }
      vec2 touch(vec2 p, float i){
        float per = 5.5 + i * 1.7, T = uTime / per + i * .37, k = floor(T), tau = fract(T) * per;
        vec2 c = uPond.xy + (vec2(h11(k + i * 3.1), h11(k * 1.3 + i * 7.7)) - .5) * uPond.z * 1.1;
        vec2 dv = p - c; float d = max(length(dv), 1e-3), front = tau * 1.5;
        float w = cos((d - front) * 4.5) * smoothstep(front + .4, front - .3, d) * smoothstep(front - 3.5, front - .5, d) * smoothstep(per, per * .3, tau);
        return dv / d * w;
      }
      void main(){
        vec2 p = vP.xz, pc = p - uPond.xy; float r = length(pc), ang = safeAng(pc);
        float shore = uPond.z * (1. + .07 * sin(ang * 3. + 1.) + .045 * sin(ang * 7. + 2.) + .012 * sin(ang * 31.));
        if (r > shore) discard;
        float e = .2, h0 = wav(p);
        vec2 gr = vec2(wav(p + vec2(e, 0.)) - h0, wav(p + vec2(0., e)) - h0) / e * .022;
        gr += (touch(p, 0.) + touch(p, 1.) + touch(p, 2.)) * .05;
        vec2 fine = (vec2(vn2(p * 7. + uTime * .5), vn2(p * 7. + 13. - uTime * .4)) - .5) * .028;
        vec3 N = normalize(vec3(-gr.x, 1., -gr.y));
        vec3 V = normalize(uCamL - vP);
        // the sky is mirrored by a calmer surface than the moon's path, so each star stays a point and the water is not a field of streaks
        vec3 Ns = normalize(vec3(-gr.x * .3, 1., -gr.y * .3));
        vec3 Rf = reflect(-V, Ns); Rf.y = abs(Rf.y) + .002; Rf = normalize(Rf);
        vec3 sc = vec3(1., uDome.x / uDome.y, 1.);
        vec3 o = vP * sc, d = normalize(Rf * sc); float b = dot(o, d), cc = dot(o, o) - uDome.x * uDome.x;
        vec3 hit = o + d * (-b + sqrt(max(b * b - cc, 0.)));
        vec3 dir = normalize(hit); dir.y = abs(dir.y);
        vec3 c = nightSky(dir, .07, .06) * 1.2 + starGrid(wheel(dir), 46., 0., .05) * 1.1 + starGrid(wheel(dir), 19., 17., .04) * 1.5;
        float t = hemT(max(hit.y / sc.y, 0.));
        vec3 dusk = mix(mix(uRampA, uRampB, smoothstep(.0, .38, t)), uRampC, smoothstep(.3, .72, t));
        c = mix(c, dusk * (1.1 - .5 * t), 1. - smoothstep(.45, 1., t));
        // the moon, lodged in its fork, as a traced sphere
        float md = 0.; vec3 oc = vP - uMoon; float bm = dot(oc, Rf), hm = bm * bm - (dot(oc, oc) - uMoonR * uMoonR);
        if (hm > 0. && bm < 0.) {
          vec3 nm = normalize(oc + Rf * (-bm - sqrt(hm)));
          vec3 right = cross(Rf, vec3(0., 1., 0.)); right = right / max(length(right), 1e-3); vec3 upv = cross(right, Rf);
          float ph = max(uPhase, 0.), nw = step(uPhase, -.5);
          vec3 L = normalize(Rf * mix(mix(-.8, -1., ph), -.62, nw) + (right * cos(uTilt) + upv * sin(uTilt)) * mix(mix(.6, .3, ph), .78, nw));
          float lit = smoothstep(-.1, .16, dot(nm, L));
          float mar = smoothstep(.36, .7, fbm2(vec2(dot(nm, right), dot(nm, upv)) * 2.2 + 5.));
          c = uIvory * vec3(1., .94, .82) * lit * (.9 - .4 * mar) + vec3(.027, .036, .13) * (1. - lit); md = lit;   // ivory with its seas, never white
        }
        // the moon's broken path
        vec3 Lm = normalize(uMoon - vP);
        vec3 N2 = normalize(vec3(-gr.x - fine.x, 1., -gr.y - fine.y));
        float s = max(dot(reflect(-V, N2), Lm), 0.);
        float s8 = s * s; s8 *= s8; s8 *= s8; float s64 = s8 * s8; s64 *= s64; s64 *= s64; float s512 = s64 * s64; s512 *= s512; s512 *= s512;
        c += uIvory * vec3(1., .93, .8) * (s512 * 2.6 + s64 * .32 + s8 * .04) * (1. - .85 * md);
        float nv = 1. - max(dot(V, N), 0.), fres = .3 + .7 * nv * nv * nv;
        c = mix(uWater, c, fres);
        c = mix(c, vec3(.012, .016, .04), smoothstep(shore - 1.1, shore, r) * .7);   // shallow margin
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),A=new o.Mesh(u,b);A.frustumCulled=!1;const h=[];for(let m=0;m<3;m++){const s=new o.CircleGeometry(f+10,40);s.rotateX(-Math.PI/2),s.translate(c.x,.2+m*.16,c.z),h.push(s)}const B=ce(h),N=J(a,{transparent:!0,depthWrite:!1,uniforms:{uR:{value:f+10}},vert:`
      void main(){ vP = position; vN = vec3(0., 1., 0.);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:`
      uniform vec4 uPond; uniform float uR;
      void main(){
        vec2 p = vP.xz; float r = length(p - uPond.xy);
        float m = fbm2(p * .16 + vec2(uTime * .05, -uTime * .03) + vP.y * 3.) * fbm2(p * .43 - vec2(uTime * .08, uTime * .02) + 5.);
        // wisps, thickest along the bank and thin over the open water, so the pond keeps its stars
        float a = smoothstep(.16, .46, m) * smoothstep(uR, uR * .55, r) * smoothstep(.6, 4., length(uCamL - vP)) * .36 * (.3 + .7 * smoothstep(uPond.z * .55, uPond.z * 1.05, r));
        float dm = length(uMoon - vP);
        vec3 c = uStarAmb * .9 + uMoonCol * (.18 + .36 / (1. + dm * dm / 600.));
        gl_FragColor = vec4(c * .55, a * nightN(vP));
        #include <fog_fragment>
      }`}),w=new o.Mesh(B,N);return w.frustumCulled=!1,w.renderOrder=5,[A,w]}function Le(){const a=[],e=[],M=[],l=[],c=[],f=new o.Vector3,u=new o.Vector3,b=new o.Vector3,A=new o.Vector3(0,0,1),h=new o.Vector3;function B(s,p,d,v,k,S,T,x=A){const C=s.map(i=>new o.Vector3(i[0],i[1],i[2])),t=s.length>=4&&v>=6?2:1;let n=C;if(t>1){const i=new o.CatmullRomCurve3(C,!1,"centripetal"),r=(C.length-1)*t,y=[],V=[];n=[];for(let D=0;D<=r;D++){const E=D/t,U=Math.min(C.length-2,Math.floor(E)),I=E-U,W=I*I*(3-2*I);n.push(D%t===0?C[D/t]:i.getPoint(D/r)),y.push(p[U]+(p[U+1]-p[U])*W),V.push(d[U]+(d[U+1]-d[U])*W)}p=y,d=V;const R=k,q=S;k=(D,E)=>R(Math.round(D/t),E),q&&(S=D=>{const E=q(Math.floor(D/t)),U=q(Math.ceil(D/t));return[(E[0]+U[0])/2,(E[1]+U[1])/2,(E[2]+U[2])/2]})}const z=a.length/3,P=n.length;for(let i=0;i<P;i++){f.subVectors(n[Math.min(P-1,i+1)],n[Math.max(0,i-1)]).normalize(),u.crossVectors(x,f),u.lengthSq()<1e-6&&u.set(0,1,0),u.normalize(),b.crossVectors(f,u);const r=k(i,0),y=S?S(i):[0,0,0];for(let V=0;V<v;V++){const R=V/v*Y,q=Math.cos(R),D=Math.sin(R);h.copy(n[i]).addScaledVector(u,q*p[i]).addScaledVector(b,D*d[i]),a.push(h.x,h.y,h.z),h.set(0,0,0).addScaledVector(u,q/Math.max(p[i],.001)).addScaledVector(b,D/Math.max(d[i],.001)).normalize(),e.push(h.x,h.y,h.z);const E=k(i,q);M.push(E[0],E[1],E[2]),l.push(y[0],y[1],y[2],T)}if(i===0||i===P-1){const V=i===0?-1:1;h.copy(n[i]).addScaledVector(f,V*Math.min(p[i],d[i])*.7),a.push(h.x,h.y,h.z),e.push(f.x*V,f.y*V,f.z*V),M.push(r[0],r[1],r[2]),l.push(y[0],y[1],y[2],T)}}const g=i=>z+i*v+(i>0?1:0);for(let i=0;i<P-1;i++)for(let r=0;r<v;r++){const y=g(i)+r,V=g(i)+(r+1)%v,R=g(i+1)+r,q=g(i+1)+(r+1)%v;c.push(y,R,V,V,R,q)}const L=z+v,F=g(P-1)+v;for(let i=0;i<v;i++)c.push(L,z+i,z+(i+1)%v),c.push(F,g(P-1)+(i+1)%v,g(P-1)+i)}function N(s,p,d,v,k,S,T){const x=a.length/3,C=new o.Vector3(...s),t=new o.Vector3(...p),n=new o.Vector3(...d).normalize(),z=C.clone().lerp(t,.45),P=new o.Vector3().subVectors(t,C).cross(n).normalize();for(const g of[C.clone().addScaledVector(n,-v*.5),C.clone().addScaledVector(n,v*.5),z.clone().addScaledVector(n,-v),z.clone().addScaledVector(n,v),t]){a.push(g.x,g.y,g.z),e.push(P.x,P.y,P.z),M.push(k[0],k[1],k[2]);const L=g===t?1:g.distanceTo(C)/Math.max(t.distanceTo(C),.001);l.push(S[0]*L,S[1]*L,S[2],T)}c.push(x,x+1,x+2,x+1,x+3,x+2,x+2,x+3,x+4)}function w(s,p){const d=new o.Matrix3().getNormalMatrix(p);for(let v=s;v<a.length/3;v++)h.set(a[v*3],a[v*3+1],a[v*3+2]).applyMatrix4(p),a[v*3]=h.x,a[v*3+1]=h.y,a[v*3+2]=h.z,h.set(e[v*3],e[v*3+1],e[v*3+2]).applyMatrix3(d).normalize(),e[v*3]=h.x,e[v*3+1]=h.y,e[v*3+2]=h.z}function m(){const s=new o.BufferGeometry;return s.setAttribute("position",new o.Float32BufferAttribute(a,3)),s.setAttribute("normal",new o.Float32BufferAttribute(e,3)),s.setAttribute("color",new o.Float32BufferAttribute(M,3)),s.setAttribute("aAnim",new o.Float32BufferAttribute(l,4)),s.setIndex(c),s}return{loft:B,blade:N,place:w,geometry:m,count:()=>a.length/3}}async function Te(a,e,M,l,c){const f=l==="calf",u=l==="stag",b=e()*.999+(f?2:0),A=f?[.4,.21,.1]:u?[.3,.16,.085]:[.37,.17,.075],h=[.5,.4,.27],B=[.09,.06,.045],N=[.62,.55,.42],w=(t,n,z)=>[t[0]+(n[0]-t[0])*z,t[1]+(n[1]-t[1])*z,t[2]+(n[2]-t[2])*z],m=t=>(n,z)=>w(w(A,h,o.MathUtils.clamp(.25-z*.75,0,1)),B,t*.5+(z>.8?.18:0)),s=[[-.78,.27,0],[-.62,.3,0],[-.4,.32,.02],[-.05,.31,.03],[.3,.32,.02],[.52,.35,0],[.68,.4,0]];a.loft(s,[.13,.25,.3,.31,.3,.26,.17],[.12,.25,.31,.34,.31,.25,.15],10,(t,n)=>t<=1&&n>-.2?N:m(0)(t,n),t=>[t>=2&&t<=4?1:t===1||t===5?.4:0,0,0],b),a.loft([[-.86,.36,0],[-.98,.26,.02],[-1.03,.14,.03]],[.035,.03,.012],[.04,.035,.012],5,()=>w(N,B,.35),()=>[0,.6,0],b);for(const t of[-1,1])a.loft([[.5,.2,t*.2],[.72,.13,t*.22],[.9,.075,t*.2],[.72,.05,t*.27],[.5,.045,t*.3],[.4,.04,t*.31]],[.09,.065,.05,.04,.034,.04],[.08,.06,.05,.036,.03,.036],6,(n,z)=>n===5?B:m(.15)(n,z),null,b),a.loft([[-.62,.22,t*.2],[-.42,.2,t*.29],[-.16,.12,t*.33],[-.02,.065,t*.35],[-.22,.045,t*.41],[-.46,.04,t*.43],[-.56,.04,t*.43]],[.17,.19,.11,.055,.04,.034,.04],[.09,.11,.075,.05,.036,.03,.036],6,(n,z)=>n===6?B:m(.1)(n,z),n=>[n<2?.5:0,0,0],b);await c.yield();const p=u?[[.6,.42,0],[.84,.6,0],[1,.86,0],[1.06,1.08,0]]:M===0?[[.6,.42,0],[.76,.62,0],[.84,.84,.02],[.86,1,.03]]:M===1?[[.6,.42,0],[.74,.56,.12],[.62,.62,.3],[.38,.56,.38]]:[[.6,.4,0],[.82,.36,.03],[1.02,.26,.06],[1.16,.17,.08]],d=t=>u?[0,0,t]:[0,0,0];a.loft(p,u?[.2,.17,.13,.115]:[.17,.125,.095,.085],u?[.16,.14,.11,.1]:[.14,.1,.08,.075],8,m(u?.3:.05),t=>d(t/3),b);const v=p[3],k=p[2],S=M===1&&!u?[-.9,-.25,.2]:M===2&&!u?[.95,-.25,.1]:[.93,-.36,0],T=Math.hypot(...S),x=S.map(t=>t/T),C=(t,n=0,z=0)=>[v[0]+x[0]*t-x[1]*n*0+0,v[1]+x[1]*t+n,v[2]+x[2]*t+z];a.loft([C(-.07,.02),C(.03,.03),C(.14,.01),C(.25,-.01),C(.33,-.015)],[.085,.1,.075,.052,.042],[.075,.088,.06,.042,.036],8,(t,n)=>t>=4?B:t===3?w(m(0)(t,n),B,.35):m(.05)(t,n),()=>d(1),b);for(const t of[-1,1])a.blade(C(-.03,.07,t*.06),C(-.13,.2,t*.2),[x[0],x[1]+.25,x[2]],.062,w(A,B,.3),[0,1,u?1:0],b+t*.13);if(u&&await c.yield(),u)for(const t of[-1,1]){const n=[.5,.4,.27],z=[.72,.68,.58],P=(F,i,r)=>[v[0]+F,v[1]+i,v[2]+t*r],g=[P(0,.08,.06),P(-.08,.26,.15),P(-.2,.5,.3),P(-.22,.74,.42),P(-.1,.95,.46),P(.04,1.08,.4)];a.loft(g,[.03,.028,.026,.023,.02,.012],[.03,.028,.026,.023,.02,.012],5,F=>w(n,z,F/5),()=>d(1),b);const L=(F,i,r)=>a.loft([g[F],[g[F][0]+i[0]*r*.5,g[F][1]+i[1]*r*.4,g[F][2]+t*i[2]*r*.5],[g[F][0]+i[0]*r,g[F][1]+i[1]*r,g[F][2]+t*i[2]*r]],[.02,.016,.006],[.02,.016,.006],4,y=>w(n,z,y/2),()=>d(1),b);L(0,[.8,.5,.1],.34),L(1,[.75,.6,.15],.3),L(2,[.7,.65,.1],.36),L(4,[-.5,.8,.2],.3),L(4,[.2,.9,-.3],.26)}return b}async function Be(a,e,M,l,c,f,u){const b=Le(),A=new o.Matrix4,h=new o.Quaternion,B=new o.Vector3(0,1,0),N=Math.atan2(O.x,O.z),w=N-1.17,m=[],s=async(g,L,F,i,r)=>{const y=b.count();return await Te(b,e,L,g,a),await a.yield(),h.setFromAxisAngle(B,i-Math.PI/2),A.compose(F,h,new o.Vector3(r,r,r*(e.chance(.5)?1:-1))),b.place(y,A),m.push({kind:g,at:F.clone(),yaw:i,sc:r}),A.clone()},p=N+Math.PI,d=M.uIsle.value,v=(g,L)=>{const F=d.x+O.x*g+O.z*L,i=d.y+O.z*g-O.x*L;return new o.Vector3(F,le(M,F,i)-.03,i)},k=[[5.6,1.5,0],[3.3,-.9,2],[1,1.3,0],[-1.6,-.7,1],[-4.2,.9,0]];for(let g=0;g<k.length;g++){await a.yield();const[L,F,i]=k[g],r=v(L+e.range(-.3,.3),F+e.range(-.25,.25)),y=p+e.range(-.5,.5)+(g===3?2.6:0);await s("hind",i,r,y,e.range(1.26,1.38)),g===1&&await s("calf",1,v(L-1.3,F+1.5),y+.4,.74)}const S=6;for(let g=0;g<S;g++){await a.yield();const L=p+.72+g/(S-1)*.82+e.range(-.04,.04),F=u+3.6+e.range(0,1)+g%2*e.range(2,4.5),i=f.clone().add(G(L,F)),r=L+Math.PI/2+e.range(-.8,.8)+(e.chance(.3)?Math.PI:0);await s("hind",g%3===1?1:0,i,r,e.range(1.2,1.36)),(g===1||g===4)&&await s("calf",e.chance(.6)?1:2,i.clone().add(G(r+1.3+e.range(-.3,.3),1.3)),r+e.range(-.5,.5),e.range(.66,.76))}const T=N-2.74,x=f.clone().add(G(T,u+4)),C=T+Math.PI*.72,t=1.52;await a.yield();const n=await s("stag",0,x,C,t);l.stag={at:x,yaw:C,head:new o.Vector3(1.06,1.1,0).applyMatrix4(n),piv:new o.Vector3(.6,.42,0).applyMatrix4(n),axis:new o.Vector3(0,0,1).transformDirection(n)},l.herd=m,await a.yield();{const g=b.count(),L=e(),F=[.74,.7,.58],i=[.6,.47,.28],r=new o.Vector3(1,0,0);b.loft([[0,.02,0],[0,.14,-.01],[0,.3,-.02],[0,.4,0]],[.07,.115,.11,.08],[.07,.12,.115,.08],8,(y,V)=>V>.1?F:i,()=>[1,0,0],L,r),b.loft([[0,.38,0],[0,.47,.02],[0,.55,.02],[0,.6,0]],[.085,.115,.105,.05],[.09,.125,.115,.05],8,(y,V)=>V>.25?[.8,.78,.7]:i,null,L,r);for(const y of[-1,1])b.blade([y*.1,.36,-.03],[y*.07,-.06,-.1],[0,.2,1],.1,i,[0,.25,0],L),b.blade([y*.035,.5,.118],[y*.035,.47,.125],[1,0,0],.022,[.03,.02,.02],[0,0,0],L);b.blade([0,.08,-.08],[0,-.14,-.14],[1,0,0],.07,i,[0,.2,0],L),h.setFromAxisAngle(B,Math.atan2(l.perchDir.x,l.perchDir.z)),b.place(g,A.compose(l.perch,h,new o.Vector3(1.5,1.5,1.5)))}const z=J(M,{side:o.DoubleSide,uniforms:{uStagPiv:{value:l.stag.piv},uStagAxis:{value:l.stag.axis},uStagYaw:{value:0}},vert:`
      uniform float uTime, uProgress, uStagYaw; uniform vec3 uStagPiv, uStagAxis;
      attribute vec4 aAnim; attribute vec3 color; varying vec3 vCol; varying float vSpot;
      vec3 rot(vec3 v, vec3 k, float a){ float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1. - c); }
      void main(){
        vec3 p = position, n = normal; float ph = fract(aAnim.w);
        p += n * aAnim.x * .05 * sin(uTime * 1.5708 + ph * 6.283);           // flanks rise and fall every 4 s
        float fk = smoothstep(.86, 1., sin(uTime * .7 + ph * 40.)) * sin(uTime * 17. + ph * 9.);
        p += n * aAnim.y * .075 * fk;                                           // an ear, a tail
        if (aAnim.z > 0.) {
          float lift = uProgress * uProgress * (3. - 2. * uProgress), w = aAnim.z;
          float a = -(1. - lift) * .95 * w + .03 * w * sin(uTime * .9) * lift;
          vec3 q = rot(p - uStagPiv, uStagAxis, a); n = rot(n, uStagAxis, a);
          float yw = uStagYaw * w * w * lift;
          q = rot(q, vec3(0., 1., 0.), yw); n = rot(n, vec3(0., 1., 0.), yw); p = q + uStagPiv;
        }
        vP = p; vN = n; vCol = color; vSpot = step(1.5, aAnim.w);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:`
      varying vec3 vCol; varying float vSpot;
      void main(){
        vec3 N = normalize(vN), V = normalize(uCamL - vP);
        if (dot(N, V) < 0.) N = -N;
        vec3 alb = vCol * (.82 + .36 * vn3(vP * vec3(26., 60., 26.)));
        alb = mix(alb, vec3(.62, .56, .44), vSpot * smoothstep(.7, .78, vn3(vP * 13.)) * smoothstep(.0, .5, N.y));
        vec3 c = oakLaw(alb * 1.25, vP, N, V, smoothstep(-.05, .4, vP.y) * .45 + .55);
        // no deer is a black cut-out: the pale moonlit sward throws light up into the coat, and the moon draws an
        // ivory line along backs, ears, muzzles and antlers (strongest on what faces the sky or the moon)
        float n = nightN(vP); vec3 toM = uMoon - vP; float dm = length(toM); vec3 Lm = toM / max(dm, 1e-3);
        float mf = max(.4, 1. / (1. + dm * dm / 900.));
        c += n * alb * uMoonCol * (.62 - .3 * N.y) * (.55 + .45 * mf);
        float Lc = dot(c, vec3(.3, .5, .2)); c = mix(c, alb / max(dot(alb, vec3(.3, .5, .2)), .02) * Lc / (1. + 2.4 * Lc), n);
        float rim = 1. - max(dot(N, V), 0.); rim *= rim;
        c += n * uMoonCol * vec3(1.05, 1., .88) * rim * (.3 + .7 * max(N.y, 0.) + .6 * smoothstep(-.4, .5, dot(N, Lm))) * (.5 + .9 * mf) * .4;
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),P=new o.Mesh(b.geometry(),z);return P.frustumCulled=!1,{mesh:P,mat:z}}async function Fe(a,e,M,l,c,f){const u=[],b=[],A=[],h=[],B=[],N=[],w=new o.Vector3,m=new o.Vector3(0,1,0),s=new o.Vector3,p=new o.Vector3,d=(i,r,y,V,R,q,D,E)=>{const U=u.length/3;s.crossVectors(m,r).normalize();for(let I=0;I<=3;I++){const W=I/3,H=Math.sin(W*2.3)*R*y;w.copy(i).addScaledVector(r,y*W*(1-.15*W)).addScaledVector(m,H),p.copy(m).addScaledVector(r,-Math.cos(W*2.3)*R*1.5).normalize();for(const j of[-1,1])u.push(w.x+s.x*j*V,w.y+s.y*j*V,w.z+s.z*j*V),b.push(p.x,p.y,p.z),A.push(W,j*.5+.5),h.push(D.r,D.g,D.b),B.push(q,W*W,E);I<3&&N.push(U+I*2,U+I*2+1,U+I*2+2,U+I*2+1,U+I*2+3,U+I*2+2)}},v=_(c[1]).lerp(_(c[6]),.3),k=_(c[1]).lerp(_(c[0]),.25),S=(i,r,y,V,R,q)=>{const D=e();for(let E=0;E<r;E++){const U=E/r*Y+e.range(-.4,.4);d(i,G(U,1),y*e.range(.7,1.15),V,q*e.range(.7,1.2),R,v.clone().lerp(k,e()),D)}};for(const i of l.boughs){await a.yield();for(let r=4;r<i.pts.length-2;r++){const y=i.pts[r];Math.hypot(y.x,y.z)>56||!e.chance(.62*f)||y.distanceTo(l.moon)<l.moonR+2.4||S(new o.Vector3(y.x+e.range(-.3,.3),y.y+i.rad[r]*.88,y.z+e.range(-.3,.3)),e.int(4,6),e.range(.55,.95),.13,.42,0,0)}}await a.yield();for(let i=0;i<Math.round(46*f);i++){const r=e.range(0,Y),y=e.range(4.6,8.2);S(G(r,y,.02+Math.max(0,6.2-y)*.22),e.int(5,7),e.range(.45,.7),.075,.75,1,0)}await a.yield();const T=new o.Vector3(-2.5+e.range(-.5,.5),0,-41+e.range(-2,2)),x=_(c[4]).lerp(_("#e8dcc0"),.5);l.fairyRing=T;for(let i=0;i<30;i++){const r=i/30*Y+e.range(-.08,.08),y=T.clone().add(G(r,3+e.range(-.18,.18))),V=e.range(.3,.52),R=e.range(.2,.34),q=e(),D=[[.028,0],[.022,V*.8],[R,V*.78],[R*.86,V*.95],[R*.45,V*1.1],[.001,V*1.13]],E=u.length/3,U=7;for(let I=0;I<D.length;I++)for(let W=0;W<U;W++){const H=W/U*Y;u.push(y.x+Math.cos(H)*D[I][0],D[I][1],y.z+Math.sin(H)*D[I][0]),p.set(Math.cos(H),I>=3?1.2:I===2?-.8:0,Math.sin(H)).normalize(),b.push(p.x,p.y,p.z),A.push(0,0);const j=I>=2?1:.8;if(h.push(x.r*j,x.g*j,x.b*j),B.push(2,0,q),I<D.length-1){const $=E+I*U+W,Z=E+I*U+(W+1)%U;N.push($,$+U,Z,Z,$+U,Z+U)}}}const C=l.swingTop.clone();C.y-=l.swingR*.9;const t=l.swingAxis,n=.95,z=_("#8a744e"),P=_("#6b5136");for(const i of[-1,1]){const r=u.length/3,y=C.clone().addScaledVector(t,i*.45);for(let V=0;V<=6;V++)for(let R=0;R<4;R++){const q=R/4*Y+V*.9,D=o.MathUtils.lerp(C.y,n,V/6);if(p.set(Math.cos(q),0,Math.sin(q)),u.push(y.x+p.x*.028,D,y.z+p.z*.028),b.push(p.x,0,p.z),A.push(0,0),h.push(z.r,z.g,z.b),B.push(3,1,0),V<6){const E=r+V*4+R,U=r+V*4+(R+1)%4;N.push(E,E+4,U,U,E+4,U+4)}}}{const i=new o.BoxGeometry(1.25,.06,.3,3,1,1).toNonIndexed(),r=i.getAttribute("position"),y=i.getAttribute("normal"),V=new o.Vector3().crossVectors(m,t),R=u.length/3;for(let q=0;q<r.count;q++){const D=-.035*(1-Math.pow(r.getX(q)/.625,2));w.copy(C).setY(n+r.getY(q)+D).addScaledVector(t,r.getX(q)).addScaledVector(V,r.getZ(q)),u.push(w.x,w.y,w.z),p.set(0,0,0).addScaledVector(t,y.getX(q)).addScaledVector(V,y.getZ(q)).setY(y.getY(q)),b.push(p.x,p.y,p.z),A.push(0,0);const E=y.getY(q)>.5?1.15:.8;h.push(P.r*E,P.g*E,P.b*E),B.push(3,0,0),N.push(R+q)}}l.swingSeat=C.clone().setY(n),await a.yield();const g=new o.BufferGeometry;g.setAttribute("position",new o.Float32BufferAttribute(u,3)),g.setAttribute("normal",new o.Float32BufferAttribute(b,3)),g.setAttribute("uv",new o.Float32BufferAttribute(A,2)),g.setAttribute("color",new o.Float32BufferAttribute(h,3)),g.setAttribute("aK",new o.Float32BufferAttribute(B,3)),g.setIndex(N);const L=J(M,{side:o.DoubleSide,uniforms:{uSwingP:{value:C},uSwingA:{value:t}},vert:`
      uniform float uTime; uniform vec3 uCamL, uSwingP, uSwingA; uniform vec2 uWind;
      attribute vec3 color, aK; varying vec3 vCol; varying vec2 vUv; varying float vKind;
      vec3 rot(vec3 v, vec3 k, float a){ float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1. - c); }
      void main(){
        vec3 p = position, n = normal;
        if (aK.x < 1.5) {                      // fronds nod in the breeze
          float s = sin(uTime * 1.3 + aK.z * 40. + position.x * .7) * .6 + sin(uTime * 2.9 + aK.z * 17.) * .4;
          p += (vec3(uWind.x, 0., uWind.y) * .07 + vec3(0., .035, 0.)) * s * aK.y;
        } else if (aK.x > 2.5) {               // the swing sways; ropes never go thinner than ~1.5 px
          p += n * aK.y * max(0., length(uCamL - p) * .0011 - .028);
          float a = .2 * sin(uTime * 1.02) + .03 * sin(uTime * 2.3);
          p = rot(p - uSwingP, uSwingA, a) + uSwingP; n = rot(n, uSwingA, a);
        }
        vP = p; vN = n; vCol = color; vUv = uv; vKind = aK.x;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:`
      varying vec3 vCol; varying vec2 vUv; varying float vKind;
      void main(){
        vec3 alb = vCol;
        if (vKind < 1.5) {
          float u = vUv.x, env = sqrt(max(sin(3.1416 * pow(clamp(u, 0., 1.), .7)), 0.));
          float teeth = vKind < .5 ? mix(.1, 1., smoothstep(.2, .7, abs(sin(u * 34.)))) : .86 + .14 * sin(u * 24.);
          float e = abs(vUv.y - .5) * 2.;
          if (e > env * teeth + .06) discard;
          alb *= .7 + .5 * (1. - e) ;
        }
        vec3 N = normalize(vN), V = normalize(uCamL - vP);
        if (dot(N, V) < 0. && vKind > 1.5) N = -N;
        vec3 c = oakLaw(alb, vP, N, V, 1.);
        if (vKind < 1.5) { float nf = nightN(vP); c += alb * uMoonCol * vec3(.7, 1.1, .8) * .55 * nf; c /= 1. + 1.6 * nf * dot(c, vec3(.3, .5, .2)); }
        if (vKind > 1.5 && vKind < 2.5) c += vCol * .5 * nightN(vP);       // the fungi glimmer
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),F=new o.Mesh(g,L);return F.frustumCulled=!1,F}async function De(a,e,M,l,c,f,u,{pondC:b,pondR:A,dome:h}){for(const r of Ve(l,c,f))M.add(r);await a.yield(),M.add(Ce(e,l,f,Math.round(60*u))),await a.yield();for(const r of Ne(l,h,c,f,b,A))M.add(r);await a.yield();const B=await Be(a,e,l,c,f,b,A);M.add(B.mesh),await a.yield(),M.add(await Fe(a,e,l,c,f,u)),await a.yield();const N=Ae(e,l,f,u);M.add(N),await a.yield();const w=l.uDome.value,m=r=>w.x*(1+.06*(Math.sin(r*3+.7)*.5+Math.sin(r*5+2.1)*.3+Math.sin(r*8+4)*.2)),s=Math.PI/180,p=(r,y,V)=>G(r*s,y,V),d=(r,y,V)=>new o.Vector3(r,y,V),v=d(0,7,-(m(Math.PI)-re-6)),k=(r,y)=>v.clone().addScaledVector(O,r).setY(y),S=k(100,2.7),T=O.clone(),x=[38,28,18,8].map(r=>p(r,m(r*s),4)),C=c.moon,t=b,n=S.clone().add(d(O.z,0,-O.x).multiplyScalar(24)),z=(r,y)=>n.clone().add(p(r,24,0)).setY(y),P=[p(52,m(52*s)+16,5),...x,d(-3,4,72.5),d(-14,3.8,66.5),z(-30,3.5),z(-60,3.2),z(-88,3),S,k(85,2.6),k(70,2.6),k(55,3.4),k(40,4.6),k(22,6),v.clone()],g={portalSeat:{position:v,facing:T},exitArch:{center:p(180,m(Math.PI),0),halfWidth:20,height:11},gateposts:c.gate,runStart:S,crossing:x,flyThrough:P,approach:p(8,520,3),moon:{position:C.clone(),radius:c.moonR,passAt:k(54.5,3.5),view:k(62,3.2)},pond:{center:d(b.x,.07,b.z),radius:A},stag:{position:c.stag.at.clone(),head:c.stag.head.clone()},herd:c.herd.map(r=>r.at.clone()),swingSeat:c.swingSeat,fairyRing:c.fairyRing,owl:c.perch,trunk:d(0,0,0),fork:c.fork.clone(),viewpoints:{split:{from:x[1].clone(),lookAt:x[3].clone()},moon:{from:k(62,3.2),lookAt:C.clone()},pond:{from:k(92,2.6),lookAt:c.stag.head.clone()},exit:{from:S.clone(),lookAt:v.clone()}}},L=c.stag.yaw,F=new o.Vector3,i=new o.Vector2;return{anchors:g,update(r,y,V,R){F.subVectors(R,c.stag.piv);let q=Math.atan2(F.x,F.z)-L;q=Math.atan2(Math.sin(q),Math.cos(q));const D=B.mat.uniforms.uStagYaw;D.value+=(o.MathUtils.clamp(q,-1.25,1.25)-D.value)*Math.min(1,r*2.5),a.renderer.getDrawingBufferSize(i),h.skyU.uStarPx.value=Math.max(1,i.y/450),N.material.uniforms.uPx.value=V.projectionMatrix.elements[5]*i.y*.5}}}export{ne as NIGHT_LAW_GLSL,ie as NIGHT_SKY_GLSL,_e as buildHero,Le as makeBodySink};
