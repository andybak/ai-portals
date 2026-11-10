import*as a from"three";import{clamp as O,lerp as _,smoothstep as q,makePath as pe}from"../kit/core.js";const J=["#2FA35A","#A8432B","#14110D","#F0C060","#5B6478","#8DB25A","#F4EFE6"],I=Math.PI*2,K=o=>new a.Color(o),ie=.35,ee={o:[-4,0],n:14,first:7,step:6.6,gapAfter:4,gap:10},te=[0,7,11.4,21,26.2,30.4,36.4,47.5,52.2,61.5,67,71.4,79.5,85.5,90.6,100,106,112],ve=o=>-(te[Math.min(o,te.length-1)]+Math.max(0,o-te.length+1)*6),le=Math.hypot(1,ie),oe=1/le,ae=ie/le,X=(o,s)=>[ee.o[0]+oe*o+ae*s,ee.o[1]+ae*o-oe*s],j={DUR:46,HERD_SPEED:1.15,ESTEP:34,A_LEN:59,SHELF_AT:39.5,RB:31,RD:30,RL:50,DL:1,N2:[-.7071,.7071],E2:[-.7071,-.7071],A_PROFILE:[[0,4.8],[11,3.5],[22,2.05],[30,1.5],[36,1.8],[41,2.2],[46,2.2],[52,1.75],[58,1.7]],C:[[21,-2,1.8],[17,-1.5,1.6],[10,-1.6,1.2],[4.5,-3.4,1.1],[-1.5,-4.6,1.05],[-10,-3.9,1.9],[-20,-3.7,3.6],[-30,-3.6,6],[-40,-3.6,7.8],[-50,-3.7,7.6],[-60,-3.6,4.2],[-72,-3.7,1.6],[-84,-3.6,1.15],[-96,-3.8,1.3],[-108,-2.5,1.1],[-120,1,.75],[-135,4,1.1],[-150,6.5,2]]},we=o=>j.HERD_SPEED*j.DUR*o;async function qe(o=async()=>{}){const{N2:s,E2:i,A_LEN:c,A_PROFILE:v,ESTEP:t,RB:d,RD:h}=j,u=Math.PI*2,r=j.C.map(([w,e,n])=>{const x=X(w,e);return[x[0],n,x[1]]}),f=r.map((w,e)=>.25+.3*e/(r.length-1)),m=(w,e)=>{const n=Math.hypot(e[0]-w[0],e[2]-w[2]);return[(e[0]-w[0])/n,(e[2]-w[2])/n]};let g=null;for(let w=0;w<3;w++){await o();const e=r.map((l,S)=>[l[0],l[1],l[2]+we(f[S])]),n=m(e[0],e[1]),x=[e[0][0]-d*n[1],e[0][2]+d*n[0]],p=Math.atan2(s[1],s[0]);let z=Math.atan2(n[1],n[0]);z<p&&(z+=u);const A=[];for(let l=0;l<=3;l++){const S=_(p,z,l/4);A.push([x[0]+d*Math.sin(S),2.5,x[1]-d*Math.cos(S)])}const k=[];v.forEach(([l,S])=>{const P=3.6*(1-q(30,46,l)),B=c-l;k.push([A[0][0]-s[0]*B-i[0]*P,S,A[0][2]-s[1]*B-i[1]*P])}),A[0][1]=1.6,A[1][1]=1.45,A[2][1]=1.5,A[3][1]=1.7,k.push(...A,...e);const b=e.length,L=m(e[b-2],e[b-1]),C=e[b-1],D=Math.atan2(L[1],L[0]),E=247.5*Math.PI/180,V=(l,S,P,B,N,W,me)=>{const ne=[l[0]-B*P*Math.sin(S),l[2]+B*P*Math.cos(S)];for(let $=1;$<=W;$++){const re=S+P*N*$/W;k.push([ne[0]+B*P*Math.sin(re),me($/W),ne[1]-B*P*Math.cos(re)])}return S+P*N},R=V(C,D,-1,j.RL,j.DL,3,l=>_(2.2,1.7,l)),H=k[k.length-1];let M=R;for(;E-M>u;)M+=u;for(;E<M;)M-=u;V(H,M,1,h,E-M,7,l=>_(1.7,2.2,l*l)-.25*Math.sin(Math.PI*l));const T=k[k.length-1],F=[Math.cos(E),Math.sin(E)];for(let l=1;l<=3;l++)k.push([T[0]+F[0]*20*l,2.2+1.6*l,T[2]+F[1]*20*l]);const G=pe(k);await o(),g={points:k,path:G,exitDir:F,c0:e[0],c1:e[b-1],d1:T,dl:H,cBull:e[4],cGap:e[8],cEnd:e[14],ech:[oe,ae],shelfAlong:j.SHELF_AT},e.forEach((l,S)=>{f[S]=G.nearestXZ(l[0],l[2]).u})}return g}const xe=`
uniform vec4 uShad[10];
float castShade(vec2 p, vec2 sd){ float s = 0.;
  for (int i = 0; i < 10; i++) { vec4 c = uShad[i]; float hw = max(c.z, 1e-3), on = step(0.01, c.z); vec2 r = p - c.xy; float al = -dot(r, sd), ac = abs(r.x * sd.y - r.y * sd.x);
    float w = hw * (1. + 0.05 * max(al, 0.));
    float k = (1. - smoothstep(w * 0.45, w, ac)) * smoothstep(-hw * 1.5, hw * 0.5, al) * (1. - smoothstep(c.w * 0.35, max(c.w, 0.1), al));
    float ao = 1. - smoothstep(hw * 0.7, hw * 2.4, length(r));
    s = max(s, on * max(k * 0.8, ao * 0.6)); }
  return s; }
`,Q=`
uniform float uTime;
uniform vec4 uSw1;   // dir.x, dir.z, wavenumber, amplitude (main swell)
uniform vec4 uSw2;   // cross-chop
uniform vec2 uSwW;   // angular speeds
uniform vec4 uShelf; // centre x, z, radius, damping inside
uniform vec4 uChan;  // the river channel, where the shelf does not damp the swell: centre x, z, full within, none beyond
uniform float uChanG;
uniform vec3 uCamL;  // camera in local space
uniform float uSwPh; // phase added to the main swell's clock (the world keys the first crest to its journey with it)
float shelfK(vec2 p){ float d = length(p - uShelf.xy); return max(mix(uShelf.w, 1., smoothstep(uShelf.z, uShelf.z * 1.5 + 50., d)), uChanG * (1. - smoothstep(uChan.z, uChan.w, length(p - uChan.xy)))); }
// returns xyz = displacement of a floating point resting at p (y up); grad = d(height)/d(x,z); crest = -1..1 phase height
vec3 swellAt(vec2 p, out vec2 grad, out float crest){
  float far = 1. - smoothstep(380., 600., length(p - uCamL.xz));
  float nearK = 1. - smoothstep(110., 190., length(p - uCamL.xz));
  float a1 = uSw1.w * shelfK(p) * far, a2 = uSw2.w * nearK;
  float t1 = dot(uSw1.xy, p) * uSw1.z - uSwW.x * uTime - uSwPh;
  float t2 = dot(uSw2.xy, p) * uSw2.z - uSwW.y * uTime;
  float s1 = sin(t1), c1 = cos(t1), s2 = sin(t2), c2 = cos(t2);
  // a slightly peaked crest: add a touch of the second harmonic
  float h = a1 * (s1 - 0.12 * cos(2. * t1)) + a2 * s2;
  grad = uSw1.xy * (uSw1.z * a1 * (c1 + 0.24 * sin(2. * t1))) + uSw2.xy * (uSw2.z * a2 * c2);
  crest = s1;
  vec2 hz = -uSw1.xy * (a1 * 0.55 * c1) - uSw2.xy * (a2 * 0.4 * c2);
  return vec3(hz.x, h, hz.y);
}
`,ce=`
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash22(vec2 p){ float n = hash21(p); return vec2(n, hash21(p + n * 31.7 + 7.13)); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
float fbm3(vec2 p){ return 0.5 * vnoise(p) + 0.3 * vnoise(p * 2.13 + 17.1) + 0.2 * vnoise(p * 4.31 + 3.7); }
`;function ye(o={}){const s=o.palette||J,i=o.swell??1.6,c=o.shelf||{x:0,z:10,radius:120,damp:.3},v=new a.Vector3(...o.sunDir||[-.955,.122,-.27]).normalize(),t=new a.Vector2(.72,-.69).normalize(),d=new a.Vector2(-.83,-.55).normalize();return{uTime:{value:0},uSw1:{value:new a.Vector4(t.x,t.y,I/70,i*.5)},uSw2:{value:new a.Vector4(d.x,d.y,I/23,.1)},uSwW:{value:new a.Vector2(I/7,I/3.84)},uShelf:{value:new a.Vector4(c.x,c.z,c.radius,c.damp)},uChan:{value:new a.Vector4(0,-1e5,1,2)},uChanG:{value:1},uSwPh:{value:0},uCamL:{value:new a.Vector3(0,3,40)},uSunDir:{value:v},uSunCol:{value:K(o.sunColor||s[3]).multiplyScalar(2.6)},uSkyZen:{value:K("#8FC3CF")},uSkyHor:{value:K(s[6]).lerp(K(s[3]),.25)},uHerd:{value:new a.Vector2(0,0)},uSink:{value:0},uLift:{value:0},uWalk:{value:o.walk??5.5},uShad:{value:Array.from({length:10},()=>new a.Vector4(0,0,0,1))}}}function ge(o){return(s,i,c)=>{const v=o.uSw1.value,t=o.uSw2.value,d=o.uSwW.value,h=o.uShelf.value,u=o.uChan.value,r=Math.hypot(s-h.x,i-h.y),f=Math.max(_(h.w,1,q(h.z,h.z*1.5+50,r)),o.uChanG.value*(1-q(u.z,u.w,Math.hypot(s-u.x,i-u.y)))),m=(v.x*s+v.y*i)*v.z-d.x*c-o.uSwPh.value,g=(t.x*s+t.y*i)*t.z-d.y*c;return v.w*f*(Math.sin(m)-.12*Math.cos(2*m))+t.w*Math.sin(g)}}function be(o,s){const i=s.herd??21,c=[],v=(o.chance(.5)?1:-1)*o.range(.28,.42),t=v>0||o.chance(.3),d=Math.min(ee.n,i-1);for(let r=0;r<i;r++){const f=r-d,m=o.range(-1.3,1.3),g=o.range(-2.2,2.2);let w,e,n=!1,x=!1;if(f<0){const z=-f,A=.6+g*.45,k=X(ve(z)+m*.6,A);w=k[0],e=k[1]}else if(f>=1&&f<=4){const z=X(-[16.2,36,57,76.5][f-1]+m*.5,-(10.8+(g+2.2)*.6));w=z[0],e=z[1],n=!0}else if(f===5){const z=X(3.1,.7);w=z[0],e=z[1],n=!0,x=!0}else{const z=Math.max(1,f-4);w=2+7.5*z+m,e=17+z*7.5*(t?.5:.36)+g}let p=r===d||o.chance(.3);r===d&&(w=-4,e=0),(f===-1||f===-4||f===-7||f===5)&&(p=!1),(f===-3||f===-5||f===-9)&&(p=!0),c.push({x:w,z:e,s:p?o.range(1.04,1.12):o.range(.9,1),kind:p?1:0,ph:o(),tint:o.range(-1,1),lane:1,j:f,lead:n,front:x})}const h=s.calves??6,u=c.map((r,f)=>f).sort((r,f)=>Math.abs(c[r].x+4)-Math.abs(c[f].x+4));for(let r=0;r<h&&r<i;r++){const f=c[u[r===0?0:Math.min(i-1,r*3-1)]],m=r===0?-1:f.j<0||o.chance(.5)?1:-1;c.push({x:f.x+m*(r===0?o.range(.25,.4):o.range(1.12,1.3)),z:f.z-(r===0?o.range(2.3,2.45):o.range(.5,1.4)),s:o.range(.46,.52),kind:2,ph:o(),tint:o.range(-1,1),lane:.34})}return c}async function ke(o,s,i,c=512,v=256){let t=1e9,d=-1e9,h=1e9,u=-1e9;for(const p of s)t=Math.min(t,p.x),d=Math.max(d,p.x),h=Math.min(h,p.z),u=Math.max(u,p.z);t-=14,d+=14,h-=44,u+=8;const r=new Uint8Array(c*v*4),f=(d-t)/c,m=(u-h)/v,g=Math.hypot(i.x,i.z)||1,w=-i.x/g,e=-i.z/g,n=Math.min(11,.75/Math.max(.05,i.y));for(let p=0;p<v;p++){p%4===0&&await o.yield();const z=h+(p+.5)*m;for(let A=0;A<c;A++){const k=t+(A+.5)*f;let b=4,L=40,C=1,D=0;for(let V=0;V<s.length;V++){const R=s[V],H=k-R.x;if(H>13||H<-13)continue;const M=R.z+1.75*R.s,T=M-z;if(H<4&&H>-4){const B=(T<0?Math.hypot(H,T*2.2):Math.abs(H))/R.lane;B<b&&T<40*R.lane&&(b=B,L=Math.max(0,T)/R.lane,C=R.lane)}const F=k-R.x,G=z-(R.z+.4*R.s),l=F*w+G*e,S=Math.abs(F*e-G*w);if(l>-.6&&l<n*R.s){const P=1.25*R.s*(1-.35*l/(n*R.s));D=Math.max(D,O(1.3-S/P,0,1)*O(1-l/(n*R.s),0,1)**.6*O((l+.6)*2,0,1))}}const E=(p*c+A)*4;r[E]=Math.round(b/4*255),r[E+1]=Math.round(Math.min(1,L/40)*255),r[E+2]=Math.round(C*255),r[E+3]=Math.round(D*255)}}const x=new a.DataTexture(r,c,v,a.RGBAFormat,a.UnsignedByteType);return x.magFilter=x.minFilter=a.LinearFilter,x.wrapS=x.wrapT=a.ClampToEdgeWrapping,x.needsUpdate=!0,{tex:x,rect:new a.Vector4(t,h,1/(d-t),1/(u-h))}}function ze(o,s){const i=Math.round(100*s),c=Math.round(160*s),v=new Float32Array((i+1)*c*3+3),t=[];let d=3;for(let u=0;u<=i;u++){const r=(u+1)/(i+1),f=o*(.03*r+.97*r*r*r);for(let m=0;m<c;m++){const g=(m+u%2*.5)/c*I;v[d++]=Math.sin(g)*f,v[d++]=0,v[d++]=Math.cos(g)*f}}for(let u=0;u<c;u++)t.push(0,1+u,1+(u+1)%c);for(let u=0;u<i;u++)for(let r=0;r<c;r++){const f=1+u*c+r,m=1+u*c+(r+1)%c,g=f+c,w=m+c;u%2===0?t.push(f,g,m,m,g,w):t.push(f,g,w,f,w,m)}const h=new a.BufferGeometry;return h.setAttribute("position",new a.BufferAttribute(v,3)),h.setIndex(t),h.boundingSphere=new a.Sphere(new a.Vector3,o+5),h}const Se=`
${Q}
uniform vec2 uHerd;
varying vec2 vRest; varying vec3 vPosL; varying vec2 vGrad; varying vec2 vCrest;
#include <fog_pars_vertex>
void main(){
  vec2 ps = position.xz + uHerd;                      // sea space = local + the herd's travel (the piece rides with its herd)
  vec2 g; float c; vec3 d = swellAt(ps, g, c);
  vec3 p = position + d;
  vRest = ps; vPosL = vec3(ps.x, 0., ps.y) + d; vGrad = g; vCrest = vec2(c, shelfK(ps));
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Le=`
uniform float uTime; uniform vec3 uCamL, uSunDir, uSunCol, uSkyZen, uSkyHor;
uniform vec4 uSw1; uniform vec2 uHerd;
uniform vec3 uEmerald, uRust, uLime, uTea, uGold;
uniform sampler2D uLaneTex; uniform vec4 uLaneRect;
uniform sampler2D uShadowTex; uniform vec4 uShadowRect;
uniform vec4 uFan; uniform vec2 uFanAxis; uniform vec4 uTears[8]; uniform vec4 uRain, uRustAt; uniform vec2 uSeason, uSeed;
uniform vec4 uRefl[8];        // trunks that lay a reflection on open water: x, z, radius at the water, height
uniform vec4 uLeads, uPools[6], uRing; uniform vec3 uRingCol;   // uRing: the exit ring's x, z, radius, centre height: its glow lies on the water   // floes: x width gain (m), y share of the sea that stays closed lawn, z floe size (m), w crest opening; pools: x, z, radius, raggedness
uniform vec4 uLead, uLeadB, uLoose, uLogA, uGrove; uniform vec2 uLogB;   // (polish k1) uLogA: the drifting trunk's x, z and unit axis; uLogB: its half length and radius (radius < 0 = none); uGrove: x, z, radius, gain of the drowned forest, whose water mirrors trunks and crowns
   // uLoose: where the world wants the mat worked loose (x, z, radius, gain): wide glinting cracks between the rafts   // the rare lead: start x, z, unit dir x, z; half width, open from, open to (metres along)
varying vec2 vRest; varying vec3 vPosL; varying vec2 vGrad; varying vec2 vCrest;
#include <fog_pars_fragment>
${ce}
${xe}
// nearest feature point of a jittered grid: x = distance (0..~0.7 cells), y = that cell's hash
vec2 cellN(vec2 q){ vec2 i = floor(q), f = fract(q); float d = 9., h = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 o = vec2(float(x), float(y)); vec2 r = o + hash22(i + o) - f; float dd = dot(r, r); if (dd < d) { d = dd; h = hash21(i + o + 3.7); } }
  return vec2(sqrt(d), h); }
// distance to the nearest cell BORDER of a jittered grid (0 on the border, ~0.5 at a cell's heart), in cells
float cellE(vec2 q){ vec2 i = floor(q), f = fract(q); float d1 = 9., d2 = 9.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 o = vec2(float(x), float(y)); vec2 r = o + hash22(i + o) - f; float dd = dot(r, r);
    if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) d2 = dd; }
  return 0.5 * (sqrt(d2) - sqrt(d1)); }
// the cell a point lies in: x = its hash, yz = its feature point (in cells): one tone, one colour per floe
vec3 cellF(vec2 q){ vec2 i = floor(q), f = fract(q); float d = 9.; vec3 r3 = vec3(0.);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 o = vec2(float(x), float(y)); vec2 hp = o + hash22(i + o); vec2 r = hp - f; float dd = dot(r, r);
    if (dd < d) { d = dd; r3 = vec3(hash21(i + o + 3.7), i + hp); } }
  return r3; }
// the clump a point lies in: xy = vector to its heart (in cells, |xy| up to ~0.7), z = its hash
vec3 cellV(vec2 q){ vec2 i = floor(q), f = fract(q); float d = 9.; vec3 r3 = vec3(0.);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 o = vec2(float(x), float(y)); vec2 r = o + hash22(i + o) - f; float dd = dot(r, r);
    if (dd < d) { d = dd; r3 = vec3(r, hash21(i + o + 3.7)); } }
  return r3; }
float coins(vec2 p, float cell, float k, float seed){
  vec2 q = p / cell, id = floor(q), f = fract(q);
  vec2 h = hash22(id + seed);
  float life = fract(uTime / 2.2 + h.x * 7.);
  float on = step(h.y, k);
  vec2 c = 0.3 + 0.4 * hash22(id + seed + floor(uTime / 2.2 + h.x * 7.) * 3.1);
  float r = cell * (0.16 + 0.14 * h.y / max(k, 0.05)) * (1. - life * life) * smoothstep(0., 0.05, life);
  return (r - length(f - c) * cell) * on - (1. - on);
}
float sparkle(vec2 p, float cs, float px, float dens){
  vec2 q = p / cs, id = floor(q), f = fract(q) - 0.5;
  vec2 h = hash22(id);
  float on = step(1. - dens, h.x);
  float tw = 0.5 + 0.5 * sin(uTime * (2.5 + 3.5 * h.y) + h.x * 60.);
  tw = tw * tw; tw = tw * tw;
  vec2 c = (hash22(id + 3.3) - 0.5) * 0.5;
  float r = max(0.16, px / cs * 0.9);
  return on * tw * smoothstep(r, r * 0.35, length(f - c)) * min(1., 0.16 / r) * min(1., 0.16 / r) * 6.;
}
void main(){
  vec2 p = vRest;
  vec3 toCam = uCamL - vPosL; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
  vec2 ddx = dFdx(p), ddy = dFdy(p);
  float px = max(length(abs(ddx) + abs(ddy)), 1e-4);       // metres of sea per pixel (long axis)
  float pxA = sqrt(max(abs(ddx.x * ddy.y - ddx.y * ddy.x), 1e-8));   // and by footprint area
  float pg = pow(px, 0.45) * pow(pxA, 0.55);                 // what the grain fades on: between the long axis and the area, so the lawn keeps its grain at grazing angles
  // ---- open-water field f (metres, > 0 is water)
  float n1 = fbm3(p * 0.9), n2 = vnoise(p * 5.3), n3 = fbm3(p * 0.21 + 31.);
  float rag = (n1 - 0.5) * 1.5 + (n2 - 0.5) * 0.35;
  vec2 luv = (p - uHerd - uLaneRect.xy) * uLaneRect.zw;
  vec4 lt = texture2D(uLaneTex, clamp(luv, 0., 1.));
  float inside = step(0., luv.x) * step(luv.x, 1.) * step(0., luv.y) * step(luv.y, 1.);
  float lat = lt.r * 4., back = lt.g * 40., lw = max(lt.b, 0.2);
  float age = back / 30.;
  float wob = fbm3(p * vec2(0.9, 0.23) + 40.);                      // streaks along the lane: pinches and bellies
  // one lane about the animal's own width at its chest (2.5 m), tight where the mat is being pushed aside, raggeder and narrower as it heals
  float halfW = 1.2 * (1. - smoothstep(0.08, 1., age) * 0.85) * (0.72 + 0.56 * wob) + 0.3 * (n3 - 0.5);
  float fLane = (halfW - lat + rag * (0.3 + 1.2 * age) + (vnoise(p * vec2(1.9, 0.6) + 21.) - 0.5) * (0.4 + 0.6 * age) - smoothstep(0.7, 1.12, age) * 2.4) * lw;
  float bow = (1. - smoothstep(0.0, 0.1, age)) * inside * smoothstep(-0.75, -0.3, fLane) * step(0.6, lw);     // fern bunched up at the chest and shoulders
  fLane = min(fLane, (fbm3(p * 0.75 + 70.) - 0.02 - 0.62 * age * age) * 2.5 + 0.9 * (1. - smoothstep(0., 0.12, age)));   // rafts left in the lane, more as it heals
  fLane = max(fLane, (1.75 - lat * 0.95 - max(back - 3.0, 0.) * 0.9 + rag * 0.7) * step(0.6, lw));      // (polish 2) the wallow each wader stands in: open water all round its legs
  fLane = mix(-3., fLane, inside);
  float f = fLane;
  // the river's fan: ragged edge, torn rafts drifting in it
  float fanE = abs(dot(p - uFan.xy, vec2(-uFanAxis.y, uFanAxis.x)));                                  // metres off the fan's axis (the world's entry line), if it gives one
  float dF = uFan.z - length(p - uFan.xy) + (fbm3(p * 0.045 + 5.) - 0.5) * 10. * mix(1., smoothstep(5., 18., fanE), step(0.5, dot(uFanAxis, uFanAxis))) + rag * 1.1;
  float raft = min((0.5 - fbm3(p * 0.16 + 9.)) * 9. + dF * 0.2, (0.36 - fbm3(p * 0.53 + 3.)) * 3. + 0.5 + dF * 0.05);   // (polish 4) torn rafts adrift in the fan, large and small
  f = max(f, min(dF, raft));
  // (polish 1) THE MAT IS FLOES: the swell works the lawn into rafts ten to forty metres across with leads of open water between
  // them, wide where a low-frequency field says the mat is loose and shut where it is tight; every lead opens a little on the
  // crest and closes in the trough. Open water shows wherever we look, so the lawn reads as what it is: a floating skin on a sea.
  vec2 pw = p + (vec2(vnoise(p * 0.11 + 3.), vnoise(p * 0.11 + 17.)) - 0.5) * 4.5 + (vec2(n1, fbm3(p * 0.9 + 50.)) - 0.5) * 1.2;
  float loose = fbm3((p + uSeed) * 0.012 + 5.) - uLeads.y + 0.12 * (n3 - 0.5);
  float lwid = (0.42 + clamp(loose * 4.5, -0.62, 0.62)) * uLeads.x + uLeads.w * vCrest.x * clamp(vCrest.y, 0., 1.2);
  float e1 = cellE(pw / uLeads.z) * uLeads.z, e2 = cellE(pw / (uLeads.z * 0.31) + 9.) * uLeads.z * 0.31;
  float fFloe = max(lwid - e1, lwid * 0.26 - 0.1 - e2) + rag * 0.5;
  fFloe = min(fFloe, (fbm3(p * 0.6 + 23.) - 0.3) * 3. + 0.8);                       // crumbs of fern adrift in the leads
  f = max(f, fFloe);
  float dPool = -1000.;
  { float pn = (fbm3(p * 0.05 + 15.) - 0.5), dP = -1000.;                                                 // pools the world asks for (the drowned forest's floor, a wallow)
    float dS = -1000.;                                                                                      // (polish 4) a wallow (a pool under 8 m) is all open water: no raft closes it over the animal's legs
    for (int i = 0; i < 6; i++) { vec4 pl = uPools[i]; float dd = pl.z - length(p - pl.xy) + pn * pl.w + rag * 1.1; if (pl.z < 8.) dS = max(dS, dd); else dP = max(dP, dd); }
    float raft2 = (0.6 - fbm3(p * 0.19 + 29.)) * 8.;
    f = max(f, max(min(dP, raft2 + dP * 0.15), dS)); dPool = dP; }
  float crack = 0.;
  // analytic tears and rain coins
  for (int i = 0; i < 8; i++) { vec4 t = uTears[i]; f = max(f, t.z - length(p - t.xy) + (rag * 0.95 + (n2 - 0.5) * 0.5) * min(1., t.z)); }
  { vec2 lp = p - uLead.xy; float la = dot(lp, uLead.zw), lc = abs(lp.x * uLead.w - lp.y * uLead.z);
    float fl = min(uLeadB.x - lc + rag * 1.6 + (fbm3(p * 0.05 + 3.) - 0.5) * 7., min(la - uLeadB.y, uLeadB.z - la) * 0.4 + rag);
    f = max(f, fl); }
  // (polish 4) HAIR CRACKS: the lawn is a skin of rafts a few metres across lying edge to edge; between them the swell works open thin
  // cracks of tea-black water that glint, wider on each crest and where the mat is loose, shut where it is tight. A floating skin.
  // (polish k1) THE SWELL'S LIGHT AND SHADE AT A STRIDE'S SCALE. The cross-chop and a shorter wind sea ride the carpet in long low ridges that wander and
  // fork (shading only: the surface is not moved), travelling slowly; hair cracks open along each ridge's back and shut in its trough.
  vec2 wd1 = vec2(-0.834, -0.552), wd2 = vec2(-0.349, -0.937);
  float wph1 = dot(p, wd1) * 0.84 - uTime * 0.9 + 5. * vnoise(p * 0.045 + 3.) + 1.6 * n1, wph2 = dot(p, wd2) * 1.9 - uTime * 1.5 + 4. * vnoise(p * 0.09 + 21.);
  float wamp = 0.5 + 0.9 * vnoise(p * 0.03 + 9.), ridgeH = (sin(wph1) * 0.62 + sin(wph2) * 0.38) * wamp;
  float e3 = cellE(pw / 4.7 + 4.) * 4.7;
  float lk = uLoose.w * (1. - smoothstep(uLoose.z * 0.4, uLoose.z, length(p - uLoose.xy)));
  float cw = (0.03 + 0.09 * smoothstep(0.4, 0.75, fbm3(p * 0.06 + 12.)) + 0.05 * clamp(vCrest.x, 0., 1.) + 0.2 * lk) * max(smoothstep(0.36, 0.62, vnoise(p * 0.23 + 3.)), lk);
  cw += 0.07 * smoothstep(0.3, 0.9, ridgeH) * smoothstep(0.3, 0.6, vnoise(p * 0.5 + 8.));
  float fCrack = cw - e3 + (n2 - 0.5) * 0.05 + (n1 - 0.5) * 0.06 - max(px - 2.5 * cw, 0.);
  float fNoCrack = f; f = max(f, fCrack);
  float crackK = step(fNoCrack, fCrack) * step(fNoCrack, -0.02);                 // this open water is a hair crack
  float rk = uRain.w * (1. - smoothstep(uRain.z * 0.6, uRain.z, length(p - uRain.xy)));
  vec2 pr = vec2(0.8 * p.x - 0.6 * p.y, 0.6 * p.x + 0.8 * p.y);
  float rc = max(max(coins(p, 0.31, rk, 1.7), coins(pr + 0.37, 0.47, rk * 0.8, 9.2)), coins(pr.yx * 1.13 + 5.1, 0.23, rk * 0.6, 4.4));
  float fMain = f;
  f = max(f, rc);
  float water = max(smoothstep(-px, px, f), max(crack, step(px, 0.25) * 0. + smoothstep(-px, px, rc) * clamp(0.12 / px, 0., 1.)));
  // ---- shared light
  vec3 N = normalize(vec3(-vGrad.x, 1., -vGrad.y));
  float h = vPosL.y;
  vec2 suv = (p - normalize(uSunDir.xz + vec2(1e-4)) * (-8. * h) - uShadowRect.xy) * uShadowRect.zw;
  float bar = texture2D(uShadowTex, suv).r;
  { vec2 sdn = normalize(uSunDir.xz + vec2(1e-4)); vec2 sp = vec2(dot(p, sdn), p.x * sdn.y - p.y * sdn.x);      // (polish 4) crowns are not walls: the low sun comes through them in long slots of light
    bar = mix(bar, 1., 0.9 * smoothstep(0.46, 0.66, 0.6 * vnoise(sp * vec2(0.035, 0.42) + 3.) + 0.4 * vnoise(sp * vec2(0.09, 1.1) + 11.))); }
  float sun = (1. - lt.a * inside * 0.85 * (1. - 0.8 * water)) * bar * (1. - castShade(p, normalize(uSunDir.xz + vec2(1e-4))) * (1. - 0.6 * water));      // (polish 3) an animal's shadow lies on the mat, not as a hard band on open water
  // ---- the mat
  // (polish 4) A QUILT WITH FORM, locked to the sea at three scales (a clump of rosettes 5 cm across, a pad a hand and a half across, a
  // cushion as long as a stride). Each clump is a low dome with its own tone, a lit shoulder toward the low sun, a shaded one away
  // and a dark crease against its neighbours: crisp edges at every distance, where there was a soft mottle that read as blur.
  float dirK = clamp((uSunCol.r - 0.6) / 1.2, 0.3, 1.);            // under a pewter sky the light has little direction
  vec2 sd2 = normalize(uSunDir.xz + vec2(1e-4));
  float rake = clamp(0.3 / max(uSunDir.y, 0.08), 0.5, 2.6) * dirK;
  // THE NAP: clumps three to six pixels across at every distance (never smaller than a rosette), cross-faded octave to octave, so the
  // carpet is fine-grained from one metre and from two hundred; never a cobble, never a pad
  float nl = log2(max(pg, 0.0035) * 3.2 / 0.02), n0 = floor(nl), nf = nl - n0, s0 = 0.02 * exp2(n0);
  vec3 c1 = cellV(p / s0), c2 = cellV(p / (2. * s0) + 5.), c3 = cellV(p * 1.31 + 9.);
  float napK = 1. - smoothstep(0.5, 2.5, pg);                              // beyond a couple of hundred metres the nap is haze
  float w1 = (1. - nf) * napK, w2 = nf * napK, w3 = 1. - smoothstep(0.16, 0.5, pg * 1.31);
  float ln1 = length(c1.xy), ln2 = length(c2.xy), ln3 = length(c3.xy);
  // RUST IN DRIFTS AND WINDROWS: sun-reddened fern lies in broad drifts whose edges the wind has combed out into long streaks; every
  // boundary is frayed pad by pad (never a blur, never a ruled edge)
  vec2 wdir = vec2(0.8, 0.6), pwr = vec2(dot(p + uSeed, wdir), dot(p + uSeed, vec2(-wdir.y, wdir.x)));
  float drift = fbm3((p + uSeed) * 0.0062 + 11.), wrow = fbm3(pwr * vec2(0.011, 0.075) + 2.), wfine = fbm3(pwr * vec2(0.06, 0.52) + 7.);
  float rustN = 0.34 * drift + 0.44 * wrow + 0.22 * wfine - (0.16 + 0.2 * uSeason.y) * (1. - bar)      // fern reddens in strong light: in the trees' shade it stays green
    + uRustAt.w * (1. - smoothstep(uRustAt.z * 0.45, uRustAt.z, length(p - uRustAt.xy)));      // the world may ask for a rust patch somewhere
  float fray = (n1 - 0.5) * 0.06 + (c3.z - 0.5) * 0.1 * w3 + (vnoise(p * 6.1 + 2.) - 0.5) * 0.07 * (1. - smoothstep(0.1, 0.4, pg));
  float rustK = smoothstep(uSeason.x - 0.02, uSeason.x + 0.02, rustN + fray);
  float rustE = smoothstep(0.07, 0.0, abs(rustN + fray - uSeason.x));                         // the mixed fringe where red and green rosettes mingle
  vec3 green = mix(uEmerald * vec3(0.72, 0.8, 0.9), uLime * 0.74, smoothstep(0.5, 0.78, wfine) * 0.4 + smoothstep(0.52, 0.8, drift) * 0.25);   // older deep emerald, younger lime in streaks down the wind
  vec3 base = mix(green, mix(uRust, uEmerald * 0.6, 0.3) * vec3(0.66, 0.92, 1.0), rustK * (0.8 + 0.2 * n2));
  base = mix(base, mix(uLime, uRust, 0.55) * 0.72, rustE * 0.4);
  base *= (1. + (wrow - 0.5) * 0.5) * (0.94 + 0.12 * n1) * (0.86 + 0.28 * fbm3(p * 0.031 + 40.));
  // the 2 cm rosettes themselves, only where they resolve
  float qf = 1. - smoothstep(0.004, 0.014, px), cf = 1. - smoothstep(0.03, 0.09, px);
  vec2 q = p * 46., qi = floor(q), qfr = fract(q); float dq = 9.;
  if (qf > 0.001) {
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j)); vec2 c = o + hash22(qi + o) - qfr; dq = min(dq, dot(c, c)); }
  } else dq = 0.2;
  base *= mix(1., 1.25 - 1.1 * sqrt(dq), qf * 0.5);
  float grain = (vnoise(p * 9.1 + 4.) - 0.5) * (1. - w2) * (1. - smoothstep(0.1, 0.5, pg)) + (vnoise(p * 2.3 + 8.) - 0.5) * (1. - w3) * (1. - smoothstep(0.4, 1.6, pg));
  float tone = (1. + (c1.z - 0.5) * 0.5 * w1 + (c2.z - 0.5) * 0.5 * w2) * (1. + (c3.z - 0.5) * 0.14 * w3) * (1. + 0.3 * grain);
  float crease = smoothstep(0.36, 0.56, ln1) * w1 * 0.5 + smoothstep(0.36, 0.56, ln2) * w2 * 0.5;
  float padSeam = crease * 2.;
  float relief = -(dot(c1.xy, sd2) * w1 + dot(c2.xy, sd2) * w2) * 1.25 - dot(c3.xy, sd2) * w3 * 0.12;    // > 0 on the shoulder that faces the sun
  base *= tone * (1. - crease);
  float fleck = step(0.86, c1.z) * w1 + step(0.86, c2.z) * w2;
  base = mix(base, base * vec3(1.4, 1.14, 0.6), fleck * 0.4 * (1. - rustK));                                  // clumps of fresh yellow growth
  base = mix(base, uEmerald * 0.62, fleck * 0.6 * rustK);                                                      // green clumps surviving in the rust
  // the swell reads by light: slopes turned to the low sun are lit yellow-green, slopes turned away fall to deep emerald; and by
  // height: the low sun catches every crest's back and leaves the trough before it deep
  float swK = clamp(vCrest.y, 0., 1.5) * dirK, crH = clamp(vCrest.x, -1., 1.);
  float lit = clamp(0.5 + dot(vGrad, uSunDir.xz) * -15. * dirK / mix(1., max(vCrest.y, 0.2), 0.75) + swK * (0.4 * crH + 0.3 * smoothstep(0.8, 1., crH)), 0.14, 1.5);
  lit += dirK * 0.26 * crH * (1. - smoothstep(90., 320., dist));                                               // (polish 4) even on the damped shelf each crest's back is a band of light
  float troughK = swK * smoothstep(0.1, -0.9, crH);
  float ridgeK = 1. - smoothstep(70., 280., dist);
  float ridgeS = -(cos(wph1) * dot(wd1, sd2) * 0.62 + cos(wph2) * dot(wd2, sd2) * 0.38) * wamp;      // > 0 on the slope turned to the sun
  lit += (ridgeS * 0.34 * rake + 0.2 * ridgeH * dirK) * ridgeK;
  float seamK = (1. - smoothstep(0.0, 0.55, e3)) * (1. - smoothstep(0.25, 1.4, px));               // the mat is a skin of rafts lying edge to edge: each seam a low dark line
  float raftT = cellF(pw / 4.7 + 4.).x;
  base *= (1. + (raftT - 0.5) * 0.2 * (1. - smoothstep(0.3, 2., px))) * (1. - 0.3 * seamK);
  base = mix(base, base * vec3(1.22, 1.1, 0.72), clamp(ridgeS, 0., 1.) * 0.4 * ridgeK * dirK * (1. - rustK));      // the lit slope is yellow-green
  float det = ddx.x * ddy.y - ddx.y * ddy.x; det = (det < 0. ? -1. : 1.) * max(abs(det), 1e-9);
  float gfx = dFdx(fMain), gfy = dFdy(fMain);
  vec2 gf = vec2(gfx * ddy.y - gfy * ddx.y, gfy * ddx.x - gfx * ddy.x) / det;
  float lipSun = clamp(dot(gf, sd2) * 1.1, -1., 1.) * (1. - smoothstep(0.1, 0.4, px));   // > 0: open water lies on the sun side of this edge
  float lipK = smoothstep(-0.34, -0.05, fMain) * (1. - water);
  lit = clamp(lit + relief * 0.62 * rake + lipK * lipSun * 0.5 * rake, 0.1, 1.9);
  float rim = max(smoothstep(-0.13, -0.02, fMain) * (1. - 0.3 * step(fNoCrack, -0.4)), 0.5 * smoothstep(-0.05, -0.01, rc)) * (1. - water);
  base = mix(base, mix(uLime * 0.85, uRust * 0.85, step(0.6, vnoise(p * 0.8 + 13.))), rim * 0.55 * (1. - smoothstep(0.03, 0.2, px)));        // torn edges are lime, or rust where the sun has reddened them (polish k1: on hair cracks too)
  base = mix(base, mix(uEmerald, uLime, 0.75) * (0.62 + 0.75 * vnoise(p * 9. + 2.) * vnoise(p * 23.)), bow * 0.85);
  vec3 fill = mix(uSkyZen, vec3(1.), 0.25) * mix(0.5, 0.5, dirK) * (1. - 0.3 * troughK) * (1. - 0.35 * crease) * (1. + 0.24 * ridgeH * ridgeK);
  vec3 mat = base * (fill * mix(vec3(0.74, 1., 1.55), vec3(1.12, 1., 0.98), rustK * 0.85) + uSunCol * vec3(0.95, 1., 1.15) * (0.36 * lit * sun * mix(1., 0.76, rustK)));
  mat = mix(vec3(dot(mat, vec3(0.3, 0.6, 0.1))), mat, 0.9);
  { vec2 vxz = -V.xz / max(length(V.xz), 1e-3); float sAz = clamp(dot(vxz, sd2), 0., 1.), gz = 1. - clamp(V.y, 0., 1.);      // toward the low sun the nap is backlit: each clump's far shoulder glows through the frond
    mat += mix(uLime, vec3(1., 0.8, 0.36), 0.35) * uSunCol * (0.12 * sAz * sAz * sAz * gz * gz * gz * sun * dirK * (1. - 0.5 * padSeam) * (1. - 0.45 * rustK) * clamp(0.6 + relief * 1.6, 0., 1.6)); }
  mat *= 1. + 0.5 * rustK * (1. - dirK);                               // under a pewter sky the rust stays a warm red-brown, never a dark purple
  mat *= mix(vec3(0.66, 0.84, 0.9), vec3(1.), bar);                    // the redwoods' long bars: deep bottle green
  mat *= 1. - 0.4 * smoothstep(0.03, 0.0, abs(f + 0.02)) * (1. - smoothstep(0.02, 0.1, px));   // the dark seam under the lip
  float logD = 99., logD2 = 99.;
  { vec2 lr = p - uLogA.xy; float la2 = clamp(dot(lr, uLogA.zw), -uLogB.x, uLogB.x); logD = length(lr - uLogA.zw * la2);
    vec2 lr2 = lr + normalize(V.xz + vec2(1e-4)) * 0.9; float lb2 = clamp(dot(lr2, uLogA.zw), -uLogB.x, uLogB.x); logD2 = length(lr2 - uLogA.zw * lb2); }
  float logR = max(uLogB.y, 0.05), logOn = step(0., uLogB.y);
  mat = mix(mat, mat * 0.42, logOn * (1. - smoothstep(logR * 0.9, logR * 2.6, logD)));                                   // the trunk's contact shade on the carpet
  mat = mix(mat, mix(uEmerald, uLime, 0.7) * (0.3 + 0.5 * vnoise(p * 9. + 2.)) * (0.5 + 0.5 * sun), logOn * (1. - smoothstep(logR * 1.0, logR * 1.7, logD)) * 0.7);   // fern bunched up against its flank
  // ---- open water: tea-black, carrying the sky at grazing angles, packed with gold sparkle
  vec2 rp = p * 1.7 + uTime * vec2(0.21, -0.17);
  float rip = vnoise(rp), rip2 = vnoise(rp * 3.3 + 7.7 + uTime * vec2(-0.3, 0.2));
  vec3 Nw = normalize(N + vec3(rip - 0.5, 0., vnoise(rp + 7.7) - 0.5) * 0.07 + vec3(rip2 - 0.5, 0., vnoise(rp * 3.3 - 4.1) - 0.5) * 0.025 * (1. - smoothstep(0.05, 0.4, px)));
  float nv = clamp(dot(Nw, V), 0., 1.);
  float fres = 0.06 + 0.94 * (1. - nv) * (1. - nv) * (1. - nv) * mix(0.7, 1., 1. - nv);                // (polish 2) the water carries sky at every angle: never a black cutout
  vec3 R = reflect(-V, Nw); R.y = abs(R.y);
  float edge = mix(smoothstep(0., 0.16 + px, f), 0.08 + 0.6 * lk, crackK);                    // the mat's thickness shades its own rim
  // (polish 1) Open water is a MIRROR at grazing angles: it carries the sky (cream and gold toward the low sun, aqua away from it),
  // tea-black only where we look down into it; cat's-paws of wind and the nearest trunks' reflections break the mirror.
  float sunAz = max(dot(normalize(R.xz + vec2(1e-4)), normalize(uSunDir.xz + vec2(1e-4))), 0.); sunAz *= sunAz; sunAz *= sunAz;
  vec3 skyC = mix(mix(uSkyHor, uSkyZen, 0.72) * 0.46, uSkyZen * 0.36, smoothstep(0.02, 0.4, R.y)) + uSunCol * vec3(1., 0.8, 0.5) * (0.3 * sunAz * sunAz * (1. - smoothstep(0., 0.3, R.y)));   // (polish 3) tea-dark water carries a DEEP sky; only the sun's own path is bright
  float farK = smoothstep(12., 70., dist);
  float smear = 0., smearG = 0.;                              // reflections of the nearest trunks, laid toward the eye
  vec2 rw = vec2(vnoise(p * 2.3 + uTime * 0.5) - 0.5, vnoise(p * 2.3 + 9. - uTime * 0.4) - 0.5) * 0.5;      // ripples break the mirror
  for (int i = 0; i < 8; i++) { vec4 tr = uRefl[i]; vec2 tv = uCamL.xz - tr.xy; float D = max(length(tv), 1e-3); vec2 td = tv / D;
    vec2 rel = p - tr.xy + rw; float al = dot(rel, td), ac = abs(rel.x * td.y - rel.y * td.x);
    float hgt = al * uCamL.y / max(D - al, 0.5);               // the height on the tree that this point of water mirrors
    float crown = step(6., hgt) * 2.4 * max(1. - hgt / max(tr.w, 1.), 0.);
    float pr = max(1. - al / D, 0.05), w = (tr.z * (0.35 + 0.65 / (1. + hgt * 0.45)) + crown) * pr;
    // (polish k1) THE MIRROR IS RIPPLED: a bole's reflection is whole at its foot and, the higher up the trunk it mirrors, the more it slips sideways
    // ripple by ripple and breaks into dashes with sky between them (as the ring's own light does). Never a straight bar across the water.
    float hk = smoothstep(1.5, 11., hgt), sl = rel.x * td.y - rel.y * td.x;
    float q1 = vnoise(vec2(al * 1.25 - uTime * 0.7 + tr.x, sl * 0.3 + 3.)), q2 = vnoise(vec2(al * 3.6 + uTime * 0.9, sl * 0.7 + tr.y));
    ac = abs(sl + ((q1 - 0.5) * 2.2 + (q2 - 0.5) * 0.9) * pr * (0.12 + 0.88 * hk));
    float dashT = mix(1., smoothstep(0.3, 0.6, 0.6 * q1 + 0.4 * q2) * (0.5 + 0.5 * smoothstep(0.3, 0.7, vnoise(vec2(al * 7.1 - uTime * 1.7, sl * 1.1)))), 0.2 + 0.8 * hk);
    float sm = smoothstep(w, w * mix(0.6, 0.2, hk), ac) * step(0., al) * step(hgt, tr.w) * (1. - smoothstep(22., 34., D)) * dashT * (1. - 0.4 * smoothstep(0.3, 0.95, hgt / max(tr.w, 1.)));
    if (sm > smear) { smear = sm; smearG = step(7.5, hgt); } }
  float ringK = 0.;
  { vec2 tv = uCamL.xz - uRing.xy; float D = max(length(tv), 1e-3); vec2 td = tv / D; vec2 rel = p - uRing.xy + rw * 1.6;
    float al = dot(rel, td), ac = abs(rel.x * td.y - rel.y * td.x), hg = al * uCamL.y / max(D - al, 0.5), hh = clamp((hg - uRing.w) / max(uRing.z, 1e-3), -1., 1.);
    // (polish f3) THE RING'S LIGHT ON RIPPLED WATER: never a mirror image with edges. A soft column of glow under the ring, stretched
    // toward the eye well past the mirrored disc, broken into dashes that lie along the ripples and slip sideways with them.
    float persp = max(1. - al / D, 0.05), hn = clamp((hg - uRing.w) / max(uRing.z, 1e-3), -6., 6.);   // -1 foot of the ring .. 1 its top (mirrored), beyond: the stretch
    float rr1 = vnoise(vec2(al * 1.15 - uTime * 0.7, ac * 0.22 + 3.)), rr2 = vnoise(vec2(al * 3.4 + uTime * 0.9, ac * 0.5 + 11.));
    float slip = ((rr1 - 0.5) * 3.2 + (rr2 - 0.5) * 1.3) * persp * (0.35 + 0.65 * smoothstep(-1., 1.5, hn));
    float wr = uRing.z * (0.5 + 0.45 * sqrt(max(1. - hh * hh, 0.))) * persp, xr = (ac + abs(slip)) / max(wr, 1e-3);
    float colK = exp(-min(xr * xr * 1.7, 30.));                                                       // soft across: no side to it
    float lenK = smoothstep(-1.5, -0.45, hn) * (1. - smoothstep(0.5, 3.4, hn));                       // soft along: fades in at the foot, dies away toward the eye
    float dash = smoothstep(0.34, 0.66, 0.6 * rr1 + 0.4 * rr2) * (0.55 + 0.45 * smoothstep(0.3, 0.7, vnoise(vec2(al * 7.3 - uTime * 1.9, ac * 0.9))));
    ringK = colK * lenK * step(0., al) * (1. - smoothstep(110., 170., D)) * (0.16 + 0.84 * dash) * mix(1.15, 0.7, smoothstep(0.5, 3., hn)); }
  float paw = smoothstep(0.5, 0.6, fbm3(p * vec2(1.3, 0.22) + uTime * vec2(0.05, 0.02))) * (0.55 + 0.6 * vnoise(p * vec2(7.1, 2.3) + uTime * vec2(0.9, 0.4)));          // cat's-paws: ruffled water is darker, flat water brighter (polish k1: each has an edge and a ruffle inside; a soft blotch read as smear)
  vec2 sv = p - uCamL.xz; float su = length(sv); vec2 sn = sv / max(su, 1e-3);
  float streak = vnoise(vec2(su * 1.9 - uTime * 0.6, (sn.x * 37. + sn.y * 11.) * 0.9) + rw * 2.) * 0.6 + vnoise(vec2(su * 5.1 + uTime * 0.9, (sn.x * 11. - sn.y * 37.) * 1.7)) * 0.4;   // wavelets lie across the line of sight: bright sky and dark tea in thin bands
  float nearW = 1. - smoothstep(0.04, 0.2, px);                                                                              // (polish k1) close to, the water has wavelets a hand long: thin crisp dashes of sky on tea
  float wl1 = vnoise(vec2(su * 3.4 - uTime * 1.2, sn.x * 21. + sn.y * 8.) + rw * 2.), wl2 = vnoise(vec2(su * 8.3 + uTime * 1.9, sn.x * 9. - sn.y * 43.) + 5.);
  float wavelet = smoothstep(0.5, 0.62, 0.6 * wl1 + 0.4 * wl2) - 0.6 * smoothstep(0.42, 0.3, 0.6 * wl1 + 0.4 * wl2);
  float mir = clamp(fres * mix(0.84, 1.18, smoothstep(0.2, 0.8, streak)) * (1. + 0.55 * wavelet * nearW), 0., 0.62) * mix(1., 0.72, paw) * (0.86 + 0.28 * rip) * mix(0.35, 1., edge);
  // every wader stands IN the water: its dark reflection lies on it toward the eye, and rings run out from its chest and flanks
  vec2 Vn = normalize(V.xz + vec2(1e-4));
  vec4 l2 = texture2D(uLaneTex, clamp(luv - Vn * 0.8 * uLaneRect.zw, 0., 1.)), l3 = texture2D(uLaneTex, clamp(luv - Vn * 1.7 * uLaneRect.zw, 0., 1.));
  float body = inside * max(smoothstep(0.95, 0.4, l2.r * 4.) * step(l2.g * 40., 3.1), 0.7 * smoothstep(0.8, 0.3, l3.r * 4.) * step(l3.g * 40., 3.1));
  float wake = inside * smoothstep(5., 0.5, back) * smoothstep(2.0, 0.7, lat);
  float churn = inside * smoothstep(1.25, 0.3, lat) * step(back, 3.3) * step(0.25, back) * step(0.6, lw);
  mir *= (1. - 0.3 * body) * (1. + 0.45 * wake * sin(lat * 11. - uTime * 3.5 + back * 2.));
  float fringe = (1. - smoothstep(0.0, 0.11 + 0.12 * n2, f)) * (0.55 + 0.45 * n1) * (1. - 0.85 * crackK);      // (polish k1) a hand's width (it was a soft halo half a metre wide: "smeared water")              // fern hanging under the lip, fading into the deep
  vec3 deep = mix(uTea * 1.4 + vec3(0.012, 0.012, 0.011) * (0.4 + 0.6 * sun), mix(uEmerald, uLime, 0.45) * mix(vec3(1.), vec3(1.5, 0.62, 0.42), rustK) * (0.2 + 0.16 * sun), fringe * 0.8);
  vec3 wat = deep * (1. - 0.75 * mir) + skyC * mir;
  wat *= 1. - 0.5 * (1. - smoothstep(0.0, 0.38, f)) * max(-lipSun, 0.) * dirK;                   // the lip's own shadow on the water behind it
  vec3 reflC = mix(vec3(0.15, 0.085, 0.05), vec3(0.03, 0.075, 0.03), smearG) * (0.5 + 0.5 * sun);   // the trunk's own red-brown, its crown's green: mirrored where the water mirrors, sunk in tea where we look down
  wat = mix(wat, deep * (1. - 0.75 * mir) + reflC * (mir + 0.1), smear * mix(0.95, 0.8, smearG) * mix(0.4, 1., edge));
  wat = mix(wat, vec3(0.022, 0.025, 0.03) + skyC * 0.04, 0.7 * body);
  wat = mix(wat, vec3(0.05, 0.03, 0.02) * (0.5 + 0.5 * sun) + deep * 0.3, logOn * 0.8 * (1. - smoothstep(logR * 0.9, logR * 2.2, min(logD, logD2))));      // the trunk's own dark image and wet line on the water beside it
  wat += uRingCol * ringK * 0.5 * mix(0.4, 1., edge) * (1. - 0.7 * smear);
  // (polish 2) in the drowned forest the water mirrors the FOREST: dark wavering bars of trunk and crown with bright sky between them
  { vec2 vd = normalize(p - uCamL.xz + vec2(1e-4));
    float sa = vd.x * 9. + vd.y * 4.;                                                                           // (polish k1) the mirrored trunks slip sideways ripple by ripple and break into dashes: never straight bars across the ring's light
    float slipF = (vnoise(vec2(su * 1.1 - uTime * 0.6, sa)) - 0.5) * 2. + (vnoise(vec2(su * 3.3 + uTime * 0.8, sa * 2.3 + 7.)) - 0.5) * 0.9;
    float strk = smoothstep(0.4, 0.62, 0.62 * vnoise(vd * 27. + 3. + rw * 0.25 + slipF * 0.2) + 0.38 * vnoise(vd * 73. + rw * 0.7 + slipF * 0.5));
    strk *= 0.22 + 0.78 * smoothstep(0.34, 0.6, vnoise(vec2(su * 2.2 - uTime * 0.9, sa * 1.7 + 3.)));
    float forestK = max(smoothstep(-8., 6., dPool), uGrove.w * (1. - smoothstep(uGrove.z * 0.75, uGrove.z, length(p - uGrove.xy)))), canopy = smoothstep(0.1, 0.42, R.y) * 0.6;                    // overhead it is crowns the water carries, not sky
    wat = mix(wat, vec3(0.026, 0.04, 0.027) + deep * 0.55, max(strk * 0.6 * smoothstep(0.12, 0.45, mir), canopy * smoothstep(0.05, 0.3, mir)) * forestK * (1. - smear)); }
  wat += (skyC * 0.4 + uSunCol * 0.05 * sun) * churn * smoothstep(0.52, 0.8, vnoise(p * 9. + uTime * vec2(1.7, -1.3)) * 0.6 + vnoise(p * 23. - uTime * 2.1) * 0.4);   // water churned white round the legs
  float sp = pow(max(dot(R, uSunDir), 0.), 24.);
  float toSun = smoothstep(0.8, 0.995, dot(V.xz, -uSunDir.xz) / max(length(V.xz) * length(uSunDir.xz), 1e-3));   // the glitter path
  float pm = mix(pxA, px, 0.5);
  float lvl = log2(max(pm, 0.004) * 3.0 / 0.05), l0 = floor(lvl), lf = lvl - l0, cs = 0.05 * exp2(l0), dens = mix(0.01, 0.62, toSun * toSun) * (0.3 + 0.7 * smoothstep(0.3, 0.7, vnoise(p * vec2(0.5, 0.5) + uTime * vec2(0.07, -0.05)))); float laneG = inside * smoothstep(30., 2., back) * step(0.6, lw); dens = max(dens, mix(0.14, 0.55, toSun) * laneG);      // (polish 3) glitter is the sun's path, not an even speckle
  float glint = mix(sparkle(p, cs, pm, dens), sparkle(p + 13.1, cs * 2., pm, dens), lf);
  wat += uGold * vec3(1., 0.8, 0.5) * min(glint * (2.6 + 9. * sp), 6.) * sun * mix(0.15, 1., edge) * max(0.1 + 0.9 * toSun, 0.9 * laneG) * mix(1., 0.3, smoothstep(0.25, 1.6, px)) * (1. - 0.7 * smear) * (1. - 0.8 * body);
  wat += uSunCol * vec3(1., 0.74, 0.4) * (toSun * toSun * (1. - nv) * (1. - nv) * 0.13 * (0.3 + 2.2 * rip * rip2) * mix(0.3, 1., edge) * bar * (1. - 0.8 * smear) * (1. - 0.7 * body));   // the sun's road: molten toward the horizon
  vec3 col = mix(mat, wat, water);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function Ae(o,s,i,c){const v=c.fan||{x:0,z:-520,radius:150},t=new a.DataTexture(new Uint8Array([255,255,255,255]),1,1);t.needsUpdate=!0;const d=c.shadowRect||[0,0,1,1],h=[];for(let f=0;f<8;f++)h.push(new a.Vector4(0,0,-1e3,0));const u=c.lateSeason??0,r={...a.UniformsUtils.clone(a.UniformsLib.fog),...o,uEmerald:{value:K(s[0])},uRust:{value:K(s[1])},uLime:{value:K(s[5])},uTea:{value:K(s[2])},uGold:{value:K(s[3])},uLaneTex:{value:i.tex},uLaneRect:{value:i.rect},uShadowTex:{value:c.shadowTex||t},uShadowRect:{value:new a.Vector4(d[0],d[1],1/Math.max(.001,d[2]-d[0]),1/Math.max(.001,d[3]-d[1]))},uFan:{value:new a.Vector4(v.x,v.z,v.radius,0)},uFanAxis:{value:new a.Vector2(0,0)},uLead:{value:new a.Vector4(0,0,1,0)},uLoose:{value:new a.Vector4(0,0,1,0)},uLogA:{value:new a.Vector4(0,0,0,1)},uLogB:{value:new a.Vector2(1,-1)},uGrove:{value:new a.Vector4(0,0,1,0)},uLeadB:{value:new a.Vector4(-1e3,0,0,0)},uTears:{value:h},uRefl:{value:Array.from({length:8},()=>new a.Vector4(0,0,0,-1))},uRain:{value:new a.Vector4(60,120,90,0)},uRustAt:{value:new a.Vector4(0,0,1,0)},uLeads:{value:new a.Vector4(1.9,.43,24,.5)},uRing:{value:new a.Vector4(0,0,-1,0)},uRingCol:{value:new a.Color(.8,.95,.9)},uPools:{value:Array.from({length:6},()=>new a.Vector4(0,0,-1e3,1))},uSeason:{value:new a.Vector2(_(.54,.4,u),u)},uSeed:{value:c.seedShift||new a.Vector2}};return new a.ShaderMaterial({uniforms:r,vertexShader:Se,fragmentShader:Le,fog:!0,side:a.DoubleSide})}class he{constructor(){this.p=[],this.t=[],this.a=[],this.pv=[],this.idx=[]}get n(){return this.p.length/3}v(s,i,c,v,t,d){return this.p.push(s,i,c),this.t.push(v[0],v[1],v[2],v[3]),this.a.push(t[0],t[1],t[2],t[3]),this.pv.push(d[0],d[1],d[2]),this.n-1}loft(s,i,c,v,t,d){const h=[],u=this.n;for(const r of s){const f=[],m=2/(r.n||2);for(let g=0;g<i;g++){const w=g/i*I,e=Math.cos(w),n=Math.sin(w),x=(r.x||0)+r.rx*Math.sign(n)*Math.abs(n)**m,p=(e>0?r.t:r.b)*Math.sign(e)*Math.abs(e)**m,z=d?d(r,x,p):[x,r.y+p,r.z];f.push(this.v(z[0],z[1],z[2],typeof c=="function"?c(z,r):c,typeof v=="function"?v(z,r):v,t))}h.push(f)}for(let r=0;r<h.length-1;r++)for(let f=0;f<i;f++){const m=(f+1)%i;this.idx.push(h[r][f],h[r+1][f],h[r+1][m],h[r][f],h[r+1][m],h[r][m])}for(const[r,f]of[[h[0],1],[h[h.length-1],0]]){let m=0,g=0,w=0;for(const x of r)m+=this.p[x*3],g+=this.p[x*3+1],w+=this.p[x*3+2];const e=r[0],n=this.v(m/i,g/i,w/i,[this.t[e*4],this.t[e*4+1],this.t[e*4+2],this.t[e*4+3]],[this.a[e*4],this.a[e*4+1],this.a[e*4+2],this.a[e*4+3]],t);for(let x=0;x<i;x++){const p=(x+1)%i;f?this.idx.push(n,r[x],r[p]):this.idx.push(n,r[p],r[x])}}return[u,this.n]}build(){const s=new a.BufferGeometry;return s.setAttribute("position",new a.Float32BufferAttribute(this.p,3)),s.setAttribute("aTone",new a.Float32BufferAttribute(this.t,4)),s.setAttribute("aPart",new a.Float32BufferAttribute(this.a,4)),s.setAttribute("aPivot",new a.Float32BufferAttribute(this.pv,3)),s.setIndex(this.idx),s.computeVertexNormals(),s}}function U(o,s){if(s<=1)return o;const i=[],c=Object.keys(o[0]),v=o.length;for(let t=0;t<v-1;t++){const d=o[Math.max(0,t-1)],h=o[t],u=o[t+1],r=o[Math.min(v-1,t+2)];for(let f=0;f<s;f++){const m=f/s,g=m*m,w=g*m,e={};for(const n of c)e[n]=.5*(2*h[n]+(-d[n]+u[n])*m+(2*d[n]-5*h[n]+4*u[n]-r[n])*g+(-d[n]+3*h[n]-3*u[n]+r[n])*w);e.rx=Math.max(.004,e.rx),e.t=Math.max(.004,e.t),e.b=Math.max(.004,e.b),i.push(e)}}return i.push(o[v-1]),i}const y=(o,s,i,c,v,t=2.2,d=0)=>({z:o,y:s,rx:i,t:c,b:v,n:t,x:d}),Y=[1.22,1.26,1.34],Z=[1,1,1,0];function Me(o={}){const s=ue(o);let i=s.next();for(;!i.done;)i=s.next();return i.value}async function de(o={},s=async()=>{}){const i=ue(o);let c=i.next();for(;!c.done;)await s(),c=i.next();return c.value}function*ue(o={}){const s=(o.detail??1)>=.75,i=s?3:1,c=s?16:10,v=s?12:8,t=new he,d=[0,0,0],h=U([y(-1.16,.95,.08,.08,.09),y(-1.12,.92,.26,.27,.3,2.3),y(-.99,.885,.375,.352,.385,2.35),y(-.68,.86,.41,.395,.42,2.3),y(-.34,.84,.415,.372,.44,2.25),y(0,.85,.405,.4,.45,2.2),y(.28,.9,.375,.505,.47,2),y(.47,.93,.315,.455,.44,2),y(.65,.94,.24,.315,.33,2.1),y(.8,.95,.2,.235,.25,2.2),y(.95,.955,.19,.205,.215,2.2)],i),u=t.loft(h,c,Z,e=>[0,q(.45,.95,e[2]),0,0],[0,.95,.5]),r=[[.3,.86,.36,.3,.07],[.3,.6,.32,.22,.05],[.24,.92,-.7,.32,.06],[.26,.62,-.62,.24,.05]],f=[[.27,1.22,-.7,.15,.062],[.2,1.33,.36,.17,.04],[0,1.22,-1.07,.12,.035]];for(let e=u[0];e<u[1];e++){const n=t.p[e*3],x=t.p[e*3+1],p=t.p[e*3+2],z=n<0?-1:1;let A=0;for(const k of r){const b=(Math.abs(n)-k[0])**2+(x-k[1])**2+(p-k[2])**2;A+=k[4]*Math.exp(-b/(k[3]*k[3]))}if(t.p[e*3]=n+z*A*q(.02,.15,Math.abs(n)),x>.95){let k=0;for(const b of f){const L=(Math.abs(n)-b[0])**2+(x-b[1])**2+(p-b[2])**2;k+=b[4]*Math.exp(-L/(b[3]*b[3]))}k-=.022*Math.exp(-(n*n)/.0036)*q(.1,-.1,p)*q(-1,-.8,p),t.p[e*3+1]=x+k}if(p>.52&&p<.9){const k=1-.075*(.5+.5*Math.sin((p-.52)*46))*q(.52,.6,p)*(1-q(.82,.9,p));t.p[e*3]=t.p[e*3]*k,t.p[e*3+1]=.92+(t.p[e*3+1]-.92)*k}}yield;const m=[0,.97,.86],g=t.n,w=U([y(.86,.95,.17,.19,.2),y(.98,.965,.178,.185,.2,2.3),y(1.1,.955,.165,.15,.2,2.4),y(1.21,.935,.14,.118,.185,2.5),y(1.31,.915,.122,.105,.165,2.7),y(1.4,.905,.118,.108,.145,3),y(1.47,.895,.118,.105,.125,3.4),y(1.515,.885,.108,.09,.105,3.4),y(1.535,.875,.07,.055,.07,3)],i);t.loft(w,s?16:9,e=>Z,[1,1,0,0],m),t.loft(U([y(1.4,.86,.105,.05,.035,3),y(1.47,.845,.118,.06,.05,3),y(1.53,.835,.108,.06,.055,3),y(1.56,.83,.06,.035,.035,2.6)],s?2:1),s?12:7,[.86,.84,.86,0],[1,1,0,0],m);for(const e of[-1,1]){t.loft(U([y(.95,.86,.02,.05,.05,2,e*.13),y(1.03,.85,.05,.1,.1,2,e*.135),y(1.13,.84,.045,.085,.08,2,e*.125),y(1.2,.84,.015,.03,.03,2,e*.115)],s?2:1),s?8:5,Z,[1,1,0,0],m);const n=1.235,x=.985,p=e*.118;t.loft([y(n-.03,x,.004,.006,.006,2,p),y(n-.018,x,.014,.022,.022,2,p+e*.008),y(n,x,.018,.027,.027,2,p+e*.012),y(n+.018,x,.014,.022,.022,2,p+e*.008),y(n+.03,x,.004,.006,.006,2,p)],6,[.02,.017,.015,1],[1,1,0,0],m),t.loft([y(n+.002,x+.012,.004,.005,.005,2,p+e*.027),y(n+.01,x+.012,.004,.005,.005,2,p+e*.027)],4,[3.2,3,2.6,1],[1,1,0,0],m),t.loft(U([y(n-.07,x+.035,.01,.012,.012,2,e*.11),y(n-.01,x+.04,.022,.02,.016,2,e*.115),y(n+.06,x+.02,.01,.012,.012,2,e*.105)],2),6,[.8,.8,.8,0],[1,1,0,0],m),t.loft([y(1.5,.925,.004,.004,.004,2,e*.06),y(1.515,.92,.02,.014,.014,2,e*.062),y(1.535,.915,.012,.01,.01,2,e*.058)],6,[.03,.025,.025,1],[1,1,0,0],m);const z=[e*.135,1.09,.93],A=[];for(let b=0;b<=5;b++){const L=b/5,C=Math.sin(Math.PI*Math.min(1,L*1.15))**.7*.074+.012;A.push({z:0,y:0,rx:C,t:.016,b:.016,n:2,u:L})}t.loft(A,s?8:5,(b,L)=>L.u>.3?[.62,.6,.62,0]:Z,[e<0?2:3,1,0,0],z,(b,L,C)=>{const D=b.u*.185,E=C*1-Math.abs(L)*.35;return[z[0]+e*(D*.5+E*.6)+L*.25,z[1]+D*.86+C*.2,z[2]-D*.12+L*.95*e+E*.3]});const k=[e*.105,.845,1.4];t.loft([{u:0,rx:.017,t:.017,b:.017,n:2},{u:.5,rx:.015,t:.015,b:.015,n:2},{u:.85,rx:.01,t:.01,b:.01,n:2},{u:1,rx:.004,t:.004,b:.004,n:2}],6,[.82,.76,.6,1],[9,1,0,0],k,(b,L,C)=>[k[0]+e*(b.u*.035+C*.3)+L*.2,k[1]-b.u*.085+C*.2,k[2]+b.u*.03+L])}for(let e=g;e<t.n;e++)for(let n=0;n<3;n++)t.p[e*3+n]=m[n]+(t.p[e*3+n]-m[n])*Y[n],t.pv[e*3+n]=m[n]+(t.pv[e*3+n]-m[n])*Y[n];return yield,yield*Ce(t,s,v,d)}function*Ce(o,s,i,c){const v=s?2:1,t=(g,w,e,n,x,p,z=2)=>({y:g,z:w,x:e,rx:n,t:x,b:p,n:z}),d=[t(1.04,.33,.1,.09,.1,.1),t(.92,.34,.185,.145,.17,.165),t(.78,.345,.238,.152,.185,.18),t(.64,.315,.258,.122,.14,.175),t(.53,.33,.262,.108,.118,.13),t(.39,.355,.26,.09,.096,.098),t(.29,.37,.258,.093,.106,.09),t(.18,.368,.257,.077,.08,.08),t(.075,.38,.257,.094,.112,.092,2.5),t(0,.395,.257,.108,.135,.096,2.7)],h=[t(1.06,-.66,.1,.1,.12,.12),t(.94,-.67,.195,.155,.21,.2),t(.79,-.66,.243,.158,.22,.205),t(.63,-.6,.258,.125,.165,.15),t(.49,-.675,.26,.105,.115,.125),t(.35,-.79,.258,.086,.086,.108),t(.215,-.765,.257,.075,.078,.078),t(.075,-.725,.257,.092,.108,.092,2.5),t(0,-.705,.257,.104,.128,.094,2.7)],u=[[5,-1,d,.3,.37],[6,1,d,.3,.37],[7,-1,h,.35,-.79],[8,1,h,.35,-.79]];for(const[g,w,e,n,x]of u){const p=[w*.24,.9,e[1].z];o.loft(U(e,v),i,b=>b[1]<.035?[.16,.14,.13,1]:Z,b=>[g,q(n+.05,n-.05,b[1]),n,x],p,(b,L,C)=>[w*L,b.y,b.z+C]);const z=g<6.5?4:3,A=e[e.length-1].z,k=.1;for(let b=0;b<z;b++){const L=(b-(z-1)/2)*.62,C=w*.255+Math.sin(L)*k*.95,D=A+Math.cos(L)*k*1.12;o.loft([{y:.075,z:D-.012,x:C,rx:.02,t:.014,b:.014,n:2},{y:.04,z:D+.008,x:C,rx:.031,t:.026,b:.024,n:2.4},{y:0,z:D+.014,x:C,rx:.034,t:.03,b:.026,n:2.4}],s?6:4,[.11,.1,.09,1],[g,1,n,x],p,(E,V,R)=>[E.x+(V-E.x)*Math.cos(L)+R*Math.sin(L),E.y,E.z+R*Math.cos(L)-(V-E.x)*Math.sin(L)])}}yield;const r=[0,1.14,-1.165],f=[];for(let g=0;g<=6;g++){const w=g/6,e=q(.6,.85,w)*(1-q(.92,1,w));f.push({u:w,rx:_(.032,.012,w)+e*.02,t:_(.03,.012,w)+e*.014,b:_(.03,.012,w)+e*.014,n:2})}o.loft(f,s?7:5,(g,w)=>w.u>.6?[.35,.33,.33,0]:Z,(g,w)=>[4,w.u,0,0],r,(g,w,e)=>[w,r[1]-g.u*.3+e*.25,r[2]-.04*Math.sin(g.u*2.4)-e]),yield;const m=o.build();return m.boundingSphere=new a.Sphere(new a.Vector3(0,.7,.2),1.7),m}const Te=`
${Q}
uniform vec2 uHerd; uniform float uHerdDist, uSink, uWalk;
uniform vec4 uBankA; uniform vec2 uBankB;   // (polish k1) a bank animal that walks down its own mudbank: the bank's x, z, yaw, radius; its stretch and height (height 0 = off). uWalk is then the metres walked.
attribute vec4 aTone, aPart; attribute vec3 aPivot; attribute vec4 iA, iB;
varying vec3 vModel, vN, vPosL; varying vec4 vTone; varying vec4 vInst; varying float vWet, vHead;
#include <fog_pars_vertex>
vec3 rX(vec3 p, vec3 c, float a){ p -= c; float cs = cos(a), sn = sin(a); return vec3(p.x, cs * p.y - sn * p.z, sn * p.y + cs * p.z) + c; }
vec3 rXn(vec3 n, float a){ float cs = cos(a), sn = sin(a); return vec3(n.x, cs * n.y - sn * n.z, sn * n.y + cs * n.z); }
void main(){
  float id = aPart.x, sc = iB.x, kind = iB.z;
  float calf = step(1.5, kind) * step(kind, 2.5), shelf = step(2.5, kind), bull = step(0.5, kind) * step(kind, 1.5) + step(3.5, kind) * step(kind, 4.5);   // (polish k1) kind 4 is a bank bull: tusks
  float wk = uBankB.y > 0. ? uWalk : uSink * uSink * uWalk;
  vec3 p = position, n = normal;
  // (polish 1) LONGER LEGS: the body is carried 0.2 m higher and every leg stretched to match, so the belly clears the ground by
  // nearly half the shoulder height (a heavy tapir, not a hippo); done here so the hide is still painted in its authored coordinates
  float isLeg = step(4.5, id) * step(id, 8.5);
  p.y = mix(p.y + 0.2, p.y * 1.2, isLeg);
  vec3 piv = aPivot; piv.y = mix(piv.y + 0.2, piv.y * 1.2, isLeg);
  vec2 root = iA.xy + mix(uHerd, vec2(sin(iA.w), cos(iA.w)) * wk, shelf);   // bank animals wade off the way they face
  vec2 g; float cr; vec3 sw = swellAt(root + vec2(0., 0.9 * sc), g, cr);
  float swim = calf * step(0.9, iA.z); calf = swim;                  // (polish 2) only a calf out of its depth swims
  float rootY = mix(-iA.z * sc, sw.y - 0.84 * sc, swim);
  rootY = mix(rootY, mix(-iA.z, -0.84 * sc, smoothstep(0.42, 1.0, uSink)), shelf);
  if (uBankB.y > 0.) { vec2 bd = root - uBankA.xy; float bc = cos(uBankA.z), bs = sin(uBankA.z);      // her feet follow the mud's own profile down to the rim, then she sinks to the chest
    float blz = (bd.x * bs + bd.y * bc) / max(uBankA.w * uBankB.x, 1e-3), blx = (bd.x * bc - bd.y * bs) / max(uBankA.w, 1e-3), br = min(1., length(vec2(blx, blz)));
    float gy = uBankB.y * ((1. - br * br) * (1. - br * br) - 0.6 * br * br * br); gy *= gy < 0. ? 2.6 : 1.;
    rootY = mix(rootY, max(gy, -0.84 * sc), shelf); }
  float water = (sw.y - rootY) / sc;                                  // water line in model metres
  float dist = mix(uHerdDist, wk, shelf);
  float ph = (dist / (1.45 * sc) + iB.y) * 6.2832;
  float t = uTime + iB.y * 40.;
  // legs: four-beat walk, LH, LF, RH, RF; carpus folds back, hock folds forward on the swing
  if (id > 4.5 && id < 8.5) {
    float lp = ph + (id < 5.5 ? 0.25 : id < 6.5 ? 0.75 : id < 7.5 ? 0. : 0.5) * 6.2832;
    float a = -0.4 * sin(lp), lift = max(0., cos(lp)), dk = id < 6.5 ? 1. : -1.;
    vec3 knee = vec3(piv.x, aPart.z * 1.2, aPart.w);
    p = mix(p, rX(p, knee, dk * 0.75 * lift), aPart.y); n = mix(n, rXn(n, dk * 0.75 * lift), aPart.y);
    p = rX(p, piv, a); n = rXn(n, a);
  }
  // head and neck: chin rides the water, one nod a stride, a toss when it blows (every 6 s)
  float bl = fract(t / 6.), toss = smoothstep(0., 0.05, bl) * (1. - smoothstep(0.1, 0.3, bl));
  float hv = fract(iB.y * 7.31), graze = (0.5 + 0.5 * sin(t * 0.37 + hv * 40.)) * hv * hv;      // some carry the head level, some lower it to the fern and crop
  float ha = -clamp((water - 0.76) / 0.6, 0., 0.62) * (1. - calf) + mix(mix(-0.16, 0.5, graze), -0.22, max(shelf, calf)) + 0.05 * sin(2. * ph + 0.6) - 0.2 * toss - 0.3 * calf - 0.07 * bull;
  float hw = id < 0.5 ? aPart.y * 0.55 : (id < 3.5 || id > 8.5) ? 1. : 0.;
  vec3 HP = vec3(0., 1.17, 0.86);
  if (id > 1.5 && id < 3.5) {                                       // ears flick, each on its own clock
    float fk = sin(t * (id < 2.5 ? 1.7 : 2.3) + id * 2.); fk = fk * fk; fk = fk * fk; fk = fk * fk * fk;
    p = rX(p, piv, 0.9 * fk + 0.25 * toss);
  }
  if (id > 8.5) p = mix(piv, p, bull);
  p = mix(p, rX(p, HP, ha), hw); n = mix(n, rXn(n, ha), hw);
  if (id > 3.5 && id < 4.5) { float ta = 0.5 * sin(ph + 1.) * aPart.y + 0.3 * sin(t * 2.1) * aPart.y; p.x += (piv.y - p.y) * ta; }
  // trunk: sway over the planted feet, bob, breathe
  float breathe = 1. + 0.018 * sin(t * 1.5) * smoothstep(0.6, 0., abs(position.z + 0.1));
  p.x = p.x * breathe + 0.028 * sin(ph);
  p.y += 0.012 * sin(2. * ph);
  p = rX(p, vec3(0., 0.8, 0.), -0.12 * calf + 0.012 * sin(ph * 2. + 1.));
  { float tip = 0.2 * sin(3.1416 * clamp(uSink * 1.25, 0., 1.)) * shelf; p = rX(p, vec3(0., 0., -0.7), tip); n = rXn(n, tip); }   // forequarters go down first
  float cy = cos(iA.w), sy = sin(iA.w);
  vec3 q = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z) * sc;
  vec3 pl = vec3(root.x, rootY, root.y) + q;
  vN = vec3(cy * n.x + sy * n.z, n.y, -sy * n.x + cy * n.z);
  vModel = position; vPosL = pl; vTone = aTone; vInst = vec4(kind, iB.w, sc, shelf);
  vHead = (id > 0.5 && id < 3.5) || id > 8.5 ? 1. : 0.;
  vWet = mix(uSw1.w * shelfK(root) * 0.9 + uSw2.w * 0.7 + 0.04, mix(iA.z > 0. ? 0.06 : -1., 0.42, uSink), shelf);   // (a bank animal placed with a positive depth is a wader: wet to the splash line)   // local y the crests reach: wet below
  vec4 mvPosition = modelViewMatrix * vec4(pl - vec3(uHerd.x, 0., uHerd.y), 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Re=`
uniform vec3 uCamL, uSunDir, uSunCol, uSkyZen, uSkyHor;
uniform vec3 uSlate, uPale, uWetC, uEmerald, uLime;
varying vec3 vModel, vN, vPosL; varying vec4 vTone; varying vec4 vInst; varying float vWet, vHead;
#include <fog_pars_fragment>
${ce}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  vec3 toCam = uCamL - vPosL; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
  vec3 m = mix(vModel, vec3(0., 0.97, 0.86) + (vModel - vec3(0., 0.97, 0.86)) / vec3(${Y[0].toFixed(3)}, ${Y[1].toFixed(3)}, ${Y[2].toFixed(3)}), step(0.5, vHead));   // the head was enlarged about the occiput: paint it in its authored coordinates
  float kind = vInst.x, calf = step(1.5, kind) * step(kind, 2.5) + step(4.5, kind);   // (polish k1) kind 5: a calf on a bank or wading, paler with cream dashes like the swimmers
  float near = 1. - smoothstep(30., 90., dist);
  // ---- hide: slate above, pale throat and belly, one broad pattern, one fine breakup
  float under = smoothstep(0.1, -0.55, N.y) * smoothstep(0.95, 0.6, m.y);
  float throat = smoothstep(0.9, 0.78, m.y) * smoothstep(0.5, 0.8, m.z) * smoothstep(0.3, -0.3, N.y + 0.2);
  float jaw = smoothstep(0.86, 0.8, m.y) * step(1.0, m.z);
  float broad = fbm3(m.zy * vec2(2.2, 3.1) + vInst.y * 9.);
  float fine = vnoise(m.zy * 70. + m.x * 31.) * 0.6 + vnoise(m.zy * vec2(22., 90.)) * 0.4;      // short hair, combed down
  vec3 slate = mix(uSlate, vec3(dot(uSlate, vec3(0.3, 0.6, 0.1))), 0.72) * vec3(1.0, 0.97, 0.93);
  vec3 hide = slate * (0.54 + 0.66 * broad);
  hide = mix(hide, hide * vec3(1.12, 1.02, 0.86), smoothstep(0.45, 0.75, broad) * 0.5);        // warmer, dustier saddles
  hide *= 1. - 0.5 * smoothstep(0.98, 1.28, m.y + 0.12 * broad) * smoothstep(0.9, -0.9, m.z);   // dark saddle along the back
  hide *= 1. + 0.14 * smoothstep(0.42, 0.0, length((m.zy - vec2(-0.15, 0.82)) * vec2(0.6, 1.)));          // paler flank
  hide = mix(hide, uPale, clamp(max(under, max(throat, jaw * 0.8)) * 0.85, 0., 1.));
  hide *= 1. + (fine - 0.5) * 0.5 * near;
  { float wr = smoothstep(0.07, 0.0, abs(vnoise(m.zy * vec2(23., 31.) + m.x * 9.) - 0.5)) + 0.6 * smoothstep(0.06, 0.0, abs(vnoise(m.zy * vec2(9., 14.) + m.x * 5. + 3.) - 0.5));   // (polish 3) the hide is skin: a net of fine wrinkles, deeper folds
    hide *= 1. - 0.1 * min(wr, 1.) * (1. - smoothstep(10., 30., dist)); }
  hide *= 1. - 0.14 * smoothstep(1.0, 1.3, m.z) * smoothstep(0.84, 0.9, m.y) - 0.12 * smoothstep(1.08, 1.16, m.y) * step(0.85, m.z) * step(m.z, 1.05);   // a little darker on the face and ear backs
  // creases: skin rings at the neck, folds behind the elbow and at the stifle, the mouth line, the dished face
  float neck = smoothstep(0.52, 0.6, m.z) * (1. - smoothstep(0.82, 0.9, m.z));
  float crease = neck * smoothstep(0.35, 0.0, 0.5 + 0.5 * sin((m.z - 0.52) * 46. + 1.5708)) * 0.22;
  float flank = step(0.12, abs(m.x));
  crease += smoothstep(0.035, 0.0, abs(m.z - (0.47 - (m.y - 1.0) * 0.42))) * smoothstep(0.6, 0.75, m.y) * smoothstep(1.3, 1.15, m.y) * flank * 0.32;   // shoulder blade
  crease += smoothstep(0.04, 0.0, abs(m.z - (-0.42 - (m.y - 0.9) * 0.3))) * smoothstep(0.6, 0.72, m.y) * smoothstep(1.16, 1.0, m.y) * flank * 0.26;    // haunch
  crease += smoothstep(0.5, 1., sin(m.z * 52. + m.y * 9.)) * smoothstep(-0.36, -0.2, m.z) * smoothstep(0.24, 0.1, m.z) * smoothstep(0.62, 0.72, m.y) * smoothstep(1.02, 0.9, m.y) * flank * 0.05;   // ribs
  float mouthY = 0.838 - (m.z - 1.3) * 0.06;
  crease += smoothstep(0.012, 0.002, abs(m.y - mouthY)) * smoothstep(1.16, 1.24, m.z) * smoothstep(0.05, 0.09, abs(m.x)) * 0.8;
  crease += smoothstep(0.03, 0.0, abs(m.z - (0.2 + (m.y - 0.7) * 0.25))) * smoothstep(0.52, 0.6, m.y) * smoothstep(0.86, 0.74, m.y) * flank * 0.3;        // the fold behind the elbow
  crease += smoothstep(0.03, 0.0, abs(m.z - (-0.5 + (m.y - 0.7) * 0.5))) * smoothstep(0.5, 0.6, m.y) * smoothstep(0.84, 0.72, m.y) * flank * 0.26;      // and in front of the stifle
  crease += smoothstep(0.03, 0.0, abs(m.x)) * smoothstep(1.0, 1.15, m.y) * smoothstep(0.2, 0.0, m.z) * 0.3;                                              // the spine line along the loins
  crease += smoothstep(0.02, 0.0, abs(m.y - (0.9 + 0.5 * (m.z - 1.05) * (m.z - 1.05)))) * smoothstep(1.0, 1.08, m.z) * smoothstep(1.4, 1.3, m.z) * smoothstep(0.06, 0.1, abs(m.x)) * 0.22;   // cheek furrow under the eye
  hide *= 1. - clamp(crease * 1.25, 0., 0.5) * mix(0.6, 1., near);
  hide = mix(hide, hide * 1.25 + 0.03, smoothstep(1.3, 1.5, m.z) * smoothstep(0.9, 0.84, m.y) * 0.5);   // paler lips
  // calves: paler, with rows of cream dashes
  float dash = step(0.15, sin(m.z * 19. + floor(m.y * 7.) * 2.1)) * step(0.33, vnoise(vec2(m.z * 5., floor(m.y * 7.) * 3.7))) * smoothstep(0.03, 0.012, abs(fract(m.y * 7.) - 0.5) * 0.143) * smoothstep(0.62, 0.72, m.y) * smoothstep(1.2, 1.1, m.y) * step(m.z, 0.6);
  hide = mix(hide, mix(hide * 1.35 + 0.02, vec3(0.85, 0.78, 0.6), dash * 0.7 * (1. - smoothstep(5., 13., dist))), calf);   // (the dashes melt into the paler coat with distance: no speckle)
  hide *= 1. + vInst.y * 0.09; hide.r *= 1. + vInst.y * 0.05;
  // wet below the reach of the crests, with a tide-mark of fern stuck along the flank
  float wl = vWet + (0.24 + (fbm3(m.zy * 5.) - 0.5) * 0.3) * vInst.z;      // (polish 3) wet to the splash line: the legs and the belly's lower curve are dark and shining
  float wet = smoothstep(wl + 0.03, wl - 0.03, vPosL.y);
  hide = mix(hide, uWetC * 1.25 + min(hide, slate) * 0.3, wet);
  // the tide-mark: a thin broken line of fine fern specks at the reach of the crests, and a few stray specks below it
  float fleck = step(0.42, vnoise(m.zy * vec2(95., 70.) + 3.)) * smoothstep(0.026 * vInst.z, 0.0, abs(vPosL.y - wl + 0.012)) * smoothstep(0.3, 0.45, vnoise(m.zy * vec2(6.5, 2.) + 5.));
  fleck += step(0.9, vnoise(m.zy * vec2(120., 150.) + 8.)) * wet * 0.45 * near;
  vec3 fern = mix(uEmerald, uLime, vnoise(m.zy * 50.));
  vec3 alb = mix(hide, fern, clamp(fleck, 0., 1.) * step(m.z, 1.05) * (1. - vInst.w * 0.6));
  alb = mix(alb, vTone.rgb, vTone.a) * mix(vTone.rgb, vec3(1.), vTone.a);
  // ---- light: gold key on the sun side, aqua fill, green bounce from the lawn, a wet sheen
  float ndl = dot(N, uSunDir);
  float key = smoothstep(-0.1, 0.8, ndl);
  vec3 fill = mix(uEmerald * 0.16 + uSkyHor * 0.2 + uSkyZen * 0.1, mix(uSkyZen, vec3(0.62), 0.6), N.y * 0.5 + 0.5) * 1.2;
  fill *= 0.56 + 0.44 * smoothstep(0.35, 1.0, m.y + N.y * 0.25);                      // the body shades its own underside (never to black)
  fill *= mix(vec3(0.88, 1.0, 1.1), vec3(1.), key) * 1.12;                              // aqua-slate on the side turned from the sun
  // form on the shaded side: the open sky away from the sun models shoulder, haunch, barrel and face (review 3: no flat olive side)
  vec3 Fd = normalize(vec3(-uSunDir.x, 0.55, -uSunDir.z));
  float fd = max(dot(N, Fd), 0.);
  float against = clamp(0.5 - 0.5 * dot(V, uSunDir), 0., 1.);
  fill *= (0.7 + 0.62 * fd * fd) * mix(0.78, 1.25, against * against);
  float nv = clamp(dot(N, V), 0., 1.);
  float rimK = (1. - nv) * (1. - nv);
  float gold = max(uSunCol.r - uSunCol.b, 0.) / max(uSunCol.r, 1e-3);                 // 0 under a pewter sky: no warm rim in drizzle
  vec3 keyC = mix(uSunCol, vec3(dot(uSunCol, vec3(0.3, 0.6, 0.1))) * vec3(0.96, 1., 1.06), 0.78) * (1. - 0.4 * wet);   // (polish 2) slate stays slate in gold light
  vec3 col = alb * (fill + keyC * key * 0.62);
  // The low sun rims whatever edge is turned to it. When it stands BEHIND the animal the rim is a hard gold band two or three pixels
  // wide, confined to the silhouette (nv low), so a back seen from above is never bleached; when it is behind us, a soft warm edge.
  float band = smoothstep(0.6, 0.14, nv) * smoothstep(-0.6, 0.1, ndl);
  float soft = rimK * (0.35 + 0.65 * (1. - nv)) * smoothstep(-0.45, 0.25, ndl);
  float gk = 0.3 + 0.7 * gold;
  float topline = band * smoothstep(0.25, 0.75, N.y) * (1. - against);                    // sun behind us: a warm line along back, hump and the top of the face
  col += uSunCol * vec3(1., 0.84, 0.6) * (alb * 1.3 + 0.1) * (band * against * against * 2.0 + soft * 0.13 + topline * 0.3) * gk * (1. - 0.3 * wet);
  // ears are thin: the sun behind them glows through
  float ear = smoothstep(1.085, 1.12, m.y) * step(0.84, m.z) * step(m.z, 1.08) * vHead;
  col += uSunCol * vec3(1., 0.62, 0.42) * alb * ear * against * against * 1.1 * gold;
  col += uSkyZen * rimK * rimK * 0.10 * (1. - key) + mix(uSkyZen, uSkyHor, 0.5) * (0.05 + 0.1 * rimK) * wet * (N.y * 0.5 + 0.5);      // wet hide glistens with the sky: never black on black water
  // short-haired hide is matt: only a broad low sheen where it is wet (no white hot-spots)
  vec3 Hh = normalize(uSunDir + V + vec3(0., 1e-3, 0.));
  float sh = max(dot(N, Hh), 0.); sh *= sh; sh *= sh; sh *= sh;
  col += uSunCol * sh * 0.07 * wet * (1. - vTone.a * 0.5);
  col = mix(col, vTone.rgb, step(2.5, vTone.r) * vTone.a);                  // the eye's highlight stays bright
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function fe(o,s){const i={...a.UniformsUtils.clone(a.UniformsLib.fog),...o,uHerdDist:{value:0},uBankA:{value:new a.Vector4(0,0,0,1)},uBankB:{value:new a.Vector2(1,0)},uSlate:{value:K(s[4])},uPale:{value:K("#B9B2A3")},uWetC:{value:K("#2E3038")},uEmerald:{value:K(s[0])},uLime:{value:K(s[5])}};return new a.ShaderMaterial({uniforms:i,vertexShader:Te,fragmentShader:Re,fog:!0,side:a.DoubleSide})}function se(o,s,i){const c=new a.InstancedBufferGeometry;c.index=o.index;for(const h of Object.keys(o.attributes))c.setAttribute(h,o.attributes[h]);const v=new Float32Array(i.length*4),t=new Float32Array(i.length*4);i.forEach((h,u)=>{v.set([h.x,h.z,h.depth??.48,h.yaw??0],u*4),t.set([h.s,h.ph,h.kind,h.tint],u*4)}),c.setAttribute("iA",new a.InstancedBufferAttribute(v,4)),c.setAttribute("iB",new a.InstancedBufferAttribute(t,4)),c.instanceCount=i.length;const d=new a.Mesh(c,s);return d.frustumCulled=!1,d}async function Ke(o,s={}){const i=o.rng,c=s.palette||J,v=O(s.detail??o.quality?.detail??1,.6,1),t=new a.Group;t.name="fern-sea-midnight-hero";const d=ye({...s,palette:c}),h=ge(d),u=s.herdSpeed??1.2,r=s.herdStart??0,f=new a.Vector2(i.range(-400,400),i.range(-400,400)),m=be(i,s);for(const l of m){if(l.kind===2)continue;const S=i.range(0,1),P=i.range(-1,1),B=l.lead?3:l.j<=0?-l.j:99;l.depth=B<=5?_(.24,.34,S):B<=14?_(.26,.4,S):_(.5,.66,S),l.yaw=P*(B<=14?.22:.07)}for(const l of m){if(l.kind!==2)continue;let S=null,P=1e9;for(const N of m){if(N.kind===2)continue;const W=Math.hypot(N.x-l.x,N.z-l.z);W<P&&(P=W,S=N)}const B=S.depth*S.s/l.s;l.depth=B<.86?B:1,l.yaw=S.yaw}await o.yield();const g=await ke(o,m,d.uSunDir.value);await o.yield();const w=s.seaRadius??620,e=ze(w,v);await o.yield();const n=Ae(d,c,g,{...s,seedShift:f}),x=new a.Mesh(e,n);x.frustumCulled=!1,x.name="sea",t.add(x),await o.yield();const p=await de({detail:1},o.yield);await o.yield();const z=await de({detail:.5},o.yield);await o.yield();const A=fe(d,c),k=l=>l.front?.5:l.lead?l.j*2.6-1.1:l.j<=0?-l.j:l.j*4+9,b=m.filter(l=>l.kind<2).sort((l,S)=>k(l)-k(S)),L=m.filter(l=>l.kind===2),C=b.slice(0,10).concat(L.slice(0,1)),D=b.slice(10).concat(L.slice(1)),E=se(p,A,C),V=se(z,A,D.length?D:C.slice(0,1));V.visible=D.length>0,t.add(E,V),await o.yield();const R=await Fe(o,{U:d,P:c,herd:m,detail:v,object:t,opts:s,heightAt:h}),H=b[0],M={waterY:0,herdHeading:new a.Vector3(0,0,1),herdSpeed:u,laneLength:30,herdAt:(l,S=new a.Vector3)=>S.set(0,0,r+u*l),heroBull:new a.Vector3(H.x,.6,H.z),swellFrom:new a.Vector3(-d.uSw1.value.x,0,-d.uSw1.value.y),flyThrough:j.C.map(([l,S,P])=>{const B=X(l,S);return new a.Vector3(B[0],P,B[1])}),portalSeat:{position:new a.Vector3(-110,7,150),facing:new a.Vector3(.59,0,-.81)},viewpoints:[{name:"comb from behind",position:new a.Vector3(30,3,-55),target:new a.Vector3(-4,.5,0)},{name:"bull close",position:new a.Vector3(1.5,2.2,-6),target:new a.Vector3(-4,.7,1)},{name:"echelon broadside, sun side",position:new a.Vector3(-34,2.5,22),target:new a.Vector3(0,.5,0)}]},T=new a.Vector3;let F=-1;return{object:t,radius:2.5,height:4,center:new a.Vector3(-2.5,2.6,.5),anchors:M,ground:!1,groundY:0,uniforms:d,seaMaterial:n,heightAt:h,herd:m,seedShift:f,brontoGeometry:p,setLight(l={}){l.sunDir&&d.uSunDir.value.copy(l.sunDir).normalize(),l.sunColor&&d.uSunCol.value.copy(l.sunColor),l.skyZenith&&d.uSkyZen.value.copy(l.skyZenith),l.skyHorizon&&d.uSkyHor.value.copy(l.skyHorizon)},setTear(l,S,P,B){n.uniforms.uTears.value[O(l|0,0,7)].set(S,P,B>0?B:-1e3,0)},setProgress(l){F=l,R.setProgress(l,n)},update(l,S,P,B=S){d.uTime.value=S;const N=r+u*B;d.uHerd.value.set(0,N),A.uniforms.uHerdDist.value=N,t.updateWorldMatrix(!0,!1),T.setFromMatrixPosition(P.matrixWorld),t.worldToLocal(T),d.uCamL.value.set(T.x,T.y,T.z+N),F<0&&R.ambient(S,n),R.update(l,S,P)},dispose(){}}}function Be(){const o=new he,s=[.17,.2,.25,1],i=[.42,.38,.29,1],c=[.025,.025,.03,1],v=[.6,.6,.57,1],t=[.1,.12,.16,1];o.loft([y(-.31,.15,.012,.01,.01),y(-.2,.115,.07,.04,.05),y(-.05,.1,.105,.075,.085),y(.1,.1,.1,.075,.09),y(.21,.12,.05,.045,.05)],6,h=>h[1]<.075?i:h[2]<-.17?c:h[2]>-.13&&h[2]<-.06&&h[1]<.15?v:s,[0,0,0,0],[0,0,0]);const d=[0,.13,.17];return o.loft([{u:0,rx:.03,t:.03,b:.03,n:2},{u:.55,rx:.02,t:.02,b:.02,n:2},{u:1,rx:.02,t:.02,b:.02,n:2}],4,s,(h,u)=>[1,u.u,0,0],d,(h,u,r)=>[u,d[1]+h.u*.21,d[2]+.04*Math.sin(h.u*2.6)+r]),o.loft([y(.165,.355,.012,.012,.012),y(.2,.362,.036,.034,.032),y(.245,.355,.032,.028,.028),y(.268,.342,.028,.012,.012,3),y(.355,.33,.034,.007,.007,3)],5,h=>h[2]>.262?t:h[2]>.225&&Math.abs(h[0])>.02&&h[1]>.36?c:s,[1,1,0,0],d),o.build()}const Ee=`
${Q}
uniform vec2 uHerd; uniform float uLift;
attribute vec4 aTone, aPart; attribute vec3 aPivot; attribute vec4 iA, iB;
varying vec3 vN, vPosL, vCol;
#include <fog_pars_vertex>
void main(){
  vec3 p = position, n = normal; float t = uTime + iB.x * 30., w = aPart.y * step(0.5, aPart.x);
  float look = 0.8 * sin(t * 0.43 + iB.x * 20.) * w, dipS = sin(t * 0.31 + iB.x * 50.), dip = dipS * dipS; dip = dip * dip; dip = dip * dip * dip * step(0.5, iB.z) * w;
  vec3 q = p - aPivot; float c = cos(look), s = sin(look); q = vec3(c * q.x + s * q.z, q.y, -s * q.x + c * q.z);
  c = cos(dip * 1.9); s = sin(dip * 1.9); q = vec3(q.x, c * q.y - s * q.z, s * q.y + c * q.z);
  p = mix(p, q + aPivot, step(0.5, aPart.x));
  vec2 g; float cr; vec3 sw = swellAt(iA.xy, g, cr);
  float lift = clamp(uLift * 3. - iB.y * 2., 0., 1.);
  float cy = cos(iA.z), sy = sin(iA.z), sc = iA.w * (1. - lift) * smoothstep(4.5, 7., length(iA.xy - uCamL.xz));   // (polish 3) no bird sits under the lens, cut by the frame
  vec3 r = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z) * sc;
  r.y += dot(g, r.xz) + 0.012 * sin(t * 2.3);                                  // ride the slope, paddle-bob
  vec3 pl = vec3(iA.x, 0.01, iA.y) + sw + r + vec3(sy, 0.7, cy) * (lift * lift * 14.);
  vN = vec3(cy * n.x + sy * n.z, n.y, -sy * n.x + cy * n.z); vPosL = pl; vCol = aTone.rgb * (0.9 + 0.2 * iB.w);
  vec4 mvPosition = modelViewMatrix * vec4(pl - vec3(uHerd.x, 0., uHerd.y), 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Pe=`
uniform vec3 uCamL, uSunDir, uSunCol, uSkyZen, uEmerald;
varying vec3 vN, vPosL, vCol;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCamL - vPosL + vec3(0., 1e-4, 0.));
  float key = smoothstep(-0.1, 0.8, dot(N, uSunDir)), nv = clamp(dot(N, V), 0., 1.);
  vec3 fill = mix(uEmerald * 0.5, mix(uSkyZen, vec3(0.6), 0.4), N.y * 0.5 + 0.5) * 0.75;
  vec3 col = vCol * (fill + uSunCol * key * 0.42) + uSunCol * (1. - nv) * (1. - nv) * key * 0.05;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,De=`
${Q}
uniform vec2 uHerd;
attribute vec4 iA, iB;
varying vec2 vUv; varying float vA;
#include <fog_pars_vertex>
void main(){
  float sc = iA.z, t = uTime + iA.w * 40., bl = fract(t / 6.);
  float life = (bl - 0.03 - iB.x * 0.05) / 0.2, on = step(0., life) * step(life, 1.);
  life = clamp(life, 0., 1.);
  vec2 root = iA.xy + uHerd;
  vec3 dir = normalize(vec3((iB.z - 0.5) * 1.1, 0.5 + iB.w * 0.6, 0.9));
  vec3 pl = vec3(root.x + (iB.y - 0.5) * 0.12, 0.62 * sc, root.y + 1.6 * sc);
  pl += dir * (life * (0.5 + 0.8 * iB.w)) * sc; pl.y -= life * life * 0.35;
  vUv = position.xy; vA = on * (1. - life) * smoothstep(0., 0.12, life) * 0.42;
  vec4 mvPosition = modelViewMatrix * vec4(pl - vec3(uHerd.x, 0., uHerd.y), 1.);
  mvPosition.xy += position.xy * (0.05 + 0.17 * life) * sc * on;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ve=`
uniform vec3 uSunCol, uSkyZen;
varying vec2 vUv; varying float vA;
#include <fog_pars_fragment>
void main(){
  float d = dot(vUv, vUv); float a = (1. - smoothstep(0.15, 1., d)) * vA;
  gl_FragColor = vec4((uSunCol * 0.34 + uSkyZen * 0.3), a);
  #include <fog_fragment>
}`;function Ne(o,s,i,c={}){const v=c.geometry||Me({detail:c.detail??1}),t=c.material||fe(o,s||J);return{mesh:se(v,t,i),material:t,geometry:v}}async function Fe(o,s){const{U:i,P:c,herd:v,detail:t,object:d,opts:h}=s,u=o.rng,r=()=>a.UniformsUtils.clone(a.UniformsLib.fog),f=Math.round((h.ducks??180)*t),m=new Float32Array(f*4),g=new Float32Array(f*4),w=v.map(M=>M.x),e=M=>w.every(T=>Math.abs(M-T)>2.9);let n=0,x=0,p=null;for(;n<f&&x++<f*60;){(!p||p.left<=0)&&(p={x:u.range(-70,70),z:u.range(-60,85),r:u.range(2.5,7),left:u.int(6,22),yaw:u.range(0,I)});const M=u.range(0,I),T=Math.sqrt(u())*p.r,F=p.x+Math.sin(M)*T*.55,G=p.z+Math.cos(M)*T*1.5;p.left--,!(!e(F)||Math.hypot(F+4,G)<3)&&(m.set([F,G,p.yaw+u.range(-.7,.7),u.range(.92,1.12)],n*4),g.set([u(),O((G+60)/150+u.range(-.08,.08),0,1),u.chance(.4)?1:0,u.range(-1,1)],n*4),n++)}await o.yield();const z=Be(),A=new a.InstancedBufferGeometry;A.index=z.index;for(const M of Object.keys(z.attributes))A.setAttribute(M,z.attributes[M]);A.setAttribute("iA",new a.InstancedBufferAttribute(m,4)),A.setAttribute("iB",new a.InstancedBufferAttribute(g,4)),A.instanceCount=n;const k=new a.ShaderMaterial({uniforms:{...r(),...i,uEmerald:{value:K(c[0])}},vertexShader:Ee,fragmentShader:Pe,fog:!0,side:a.DoubleSide}),b=new a.Mesh(A,k);b.frustumCulled=!1,b.name="ducks",d.add(b),await o.yield();const L=v.filter(M=>M.kind<2),C=5,D=new Float32Array(L.length*C*4),E=new Float32Array(L.length*C*4);L.forEach((M,T)=>{for(let F=0;F<C;F++)D.set([M.x,M.z,M.s,M.ph],(T*C+F)*4),E.set([F/C,u(),u(),u()],(T*C+F)*4)});const V=new a.InstancedBufferGeometry;V.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),V.setIndex([0,1,2,0,2,3]),V.setAttribute("iA",new a.InstancedBufferAttribute(D,4)),V.setAttribute("iB",new a.InstancedBufferAttribute(E,4)),V.instanceCount=L.length*C;const R=new a.ShaderMaterial({uniforms:{...r(),...i},vertexShader:De,fragmentShader:Ve,fog:!0,transparent:!0,depthWrite:!1}),H=new a.Mesh(V,R);return H.frustumCulled=!1,H.renderOrder=3,H.name="breath",d.add(H),{ducks:b,spray:H,setProgress(M,T){i.uSink.value=q(.09,.14,M),i.uLift.value=q(.44,.52,M),T.uniforms.uRain.value.w=q(.6,.64,M)*(1-q(.76,.8,M))},ambient(M,T){T.uniforms.uRain.value.set(26,24+i.uHerd.value.y,20,.45)},update(){}}}export{ie as ECH_SLOPE,j as ROUTE,xe as SHADE_GLSL,Q as SWELL_GLSL,ee as WING,Me as buildBrontothere,de as buildBrontothereAsync,Ke as buildHero,we as herdD,qe as layoutRoute,Ne as makeBrontoHerd,ye as makeSeaUniforms,ve as wingS,X as wingXZ};
