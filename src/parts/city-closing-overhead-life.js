import*as a from"three";import{PLAN as _,bendAt as ot,BEND_GLSL as at}from"./city-closing-overhead.js";const H=6.283185307179586,R=new a.Vector3,nt=(f,d,v,m,l=new a.Vector3)=>ot(f,Math.max(d,0),Math.min(d,0),v,m,l),O=at+`
uniform float uLifeT;
vec3 lifeNormal;
vec3 lifeAt(float a, float h, float z) {
  bendFrameAt(max(a, 0.0));
  lifeNormal = vec3(-bendF.y, bendF.x, 0.0);
  return vec3(bendC + min(a, 0.0) * bendF + h * vec2(-bendF.y, bendF.x), z);
}
`,K=`#include <fog_pars_vertex>
`,X=`#include <fog_pars_fragment>
`,it=`
${O}${K}
attribute float aWing; attribute vec4 aB0; attribute vec3 aB1;
uniform vec4 uFlA[8]; uniform vec4 uFlB[8];
vec3 courseAt(vec4 A, vec4 B, float ph, vec3 off) {
  return vec3(A.x + B.x * cos(ph) + off.x, A.y + B.y * sin(ph + 1.3) + off.y, A.z + B.z * sin(ph) + off.z);
}
void main() {
  int f = int(aB0.x + 0.5);
  vec4 A = uFlA[f], B = uFlB[f];
  float ph = ${H.toFixed(6)} * fract(uLifeT * A.w + B.w + aB0.y);
  vec3 off = aB1 * (1.0 + 0.3 * sin(uLifeT * 0.37 + aB0.z * 40.0));        // the cloud breathes (a loop of the clock)
  vec3 c1 = courseAt(A, B, ph + 0.02, off), c0 = courseAt(A, B, ph, off);
  vec3 p1 = lifeAt(c1.x, c1.y, c1.z), p0 = lifeAt(c0.x, c0.y, c0.z);       // (the frame left standing is p0's)
  vec3 d = p1 - p0; vec3 fwd = d * inversesqrt(max(dot(d, d), 1e-8));
  vec3 r = cross(fwd, lifeNormal); vec3 right = r * inversesqrt(max(dot(r, r), 1e-4)); vec3 up = cross(right, fwd);
  float glide = smoothstep(0.3, 0.8, sin(uLifeT * 0.8 + aB0.z * 23.0));
  float ang = 0.95 * (1.0 - 0.5 * glide) * sin(uLifeT * 26.0 + aB0.z * ${H.toFixed(6)});
  float lx = position.x * mix(1.0, cos(ang), aWing), ly = abs(position.x) * aWing * sin(ang);
  vec3 wp = p0 + aB0.w * (right * lx + up * ly + fwd * position.z);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,rt=`
${X}uniform vec3 uBirdC;
void main() {
  gl_FragColor = vec4(uBirdC, 1.0);                                  // every bird a dark body on both its sides: only the air's tone with distance
  #include <fog_fragment>
}`;function st(){const f=[0,0,.26,-.05,0,0,.05,0,0,0,0,-.3,-.04,0,.12,-.04,0,-.1,-.5,0,-.08,.04,0,.12,.04,0,-.1,.5,0,-.08],d=[0,0,0,0,0,0,1,0,0,1],v=[0,1,2,1,3,2,4,6,5,7,8,9],m=new a.InstancedBufferGeometry;return m.setAttribute("position",new a.BufferAttribute(new Float32Array(f),3)),m.setAttribute("aWing",new a.BufferAttribute(new Float32Array(d),1)),m.setIndex(v),m}function $e(f,d,v,m=144){let l=1/0;for(let C=0;C<m;C++){const k=H*C/m;l=Math.min(l,f(d[0]+v[0]*Math.cos(k),d[1]+v[1]*Math.sin(k+1.3),d[2]+v[2]*Math.sin(k),80))}return l}const me=[7,3,7],we=1.3*Math.hypot(7,3,7)+1.2,je=15,lt=12,De=`
attribute vec4 aV0; attribute vec4 aV1;                 // (a, z of the course's start, its length, 0 along z or 1 along a); (turns a second, phase, lane, pool)
vec3 carP; vec2 carF;
void carAt() {
  float s = fract(uLifeT * aV1.x + aV1.y), len = aV0.z;
  float go = s < 0.5 ? 1.0 : -1.0, p = s < 0.5 ? 2.0 * s : 2.0 - 2.0 * s;
  vec2 f = aV0.w < 0.5 ? vec2(0.0, 1.0) : vec2(1.0, 0.0);
  float lat = go * aV1.z * clamp(min(p, 1.0 - p) * len / 6.0, 0.0, 1.0);    // keeps to its side; crosses over at the course's two ends
  carF = f * go;
  carP = vec3(aV0.x + f.x * p * len + f.y * lat, 0.0, aV0.y + f.y * p * len - f.x * lat);
}
`;function xt(f,d,v,m,l=[0,0,0,0]){const C=((m*d[4*v]+d[4*v+1])%1+1)%1,k=C<.5?1:-1,B=C<.5?2*C:2-2*C,S=f[4*v+2],x=f[4*v+3]>.5?1:0,z=1-x,I=k*d[4*v+2]*Math.min(1,Math.max(0,Math.min(B,1-B)*S/6));return l[0]=f[4*v]+x*B*S+z*I,l[1]=f[4*v+1]+z*B*S-x*I,l[2]=x*k,l[3]=z*k,l}const ft=`
${O}${De}${K}
attribute vec2 aPart; uniform vec3 uCarBody; uniform vec3 uCarFront; uniform vec3 uCarRear;
varying vec3 vCol;
void main() {
  carAt();
  vec2 r = vec2(carF.y, -carF.x);
  vec4 mvPosition = viewMatrix * vec4(lifeAt(carP.x + carF.x * position.z + r.x * position.x, position.y, carP.z + carF.y * position.z + r.y * position.x), 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vCol = aPart.x > 1.5 ? uCarRear : aPart.x > 0.5 ? uCarFront : uCarBody * aPart.y * (0.6 + 0.9 * fract(aV1.y * 57.0));
  #include <fog_vertex>
}`,ct=`
${O}${De}${K}
attribute float aKind; uniform float uViewH; uniform vec3 uPoolC; uniform vec3 uCarFront; uniform vec3 uCarRear;
varying vec2 vUv; varying vec3 vCol; varying float vKind;
void main() {
  carAt();
  vec2 r = vec2(carF.y, -carF.x);
  vec4 mvPosition;
  if (aKind < 0.5) {                                                        // the pool: a quad on the street's own ground before it
    float fz = 2.2 + (0.5 * position.y + 0.5) * aV1.w, fx = 3.0 * position.x;
    mvPosition = viewMatrix * vec4(lifeAt(carP.x + carF.x * fz + r.x * fx, 0.12, carP.z + carF.y * fz + r.y * fx), 1.0);
    vCol = uPoolC;
  } else {                                                                  // RULE 3: a lamp's glow faces the eye, never under 1.5 pixels, its light kept
    float e = aKind < 1.5 ? 1.0 : -1.0, rw = aKind < 1.5 ? 1.3 : 0.9;
    mvPosition = viewMatrix * vec4(lifeAt(carP.x + carF.x * 2.05 * e, 0.8, carP.z + carF.y * 2.05 * e), 1.0);
    float pxm = uViewH * 0.5 * projectionMatrix[1][1] / max(-mvPosition.z, 0.5), rr = max(rw, 1.5 / pxm);
    mvPosition.xy += position.xy * rr;
    vCol = (aKind < 1.5 ? uCarFront : uCarRear) * (rw * rw) / (rr * rr);
  }
  vKind = aKind; vUv = position.xy;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ut=`
${X}varying vec2 vUv; varying vec3 vCol; varying float vKind;
void main() {
  float v = 0.5 * vUv.y + 0.5, d2 = dot(vUv, vUv);
  float g = vKind < 0.5 ? (1.0 - smoothstep(0.15, 1.0, abs(vUv.x))) * smoothstep(0.0, 0.08, v) * (1.0 - v) : exp(-3.5 * d2) * (1.0 - smoothstep(0.6, 1.0, d2));
  vec3 col = vCol * g;
  #ifdef USE_FOG
    col *= exp(-0.16 * fogDensity * fogDensity * vFogDepth * vFogDepth);
  #endif
  gl_FragColor = vec4(col, 1.0);
}`;function vt(){const f=[],d=[],v=[],B=(x,z,I,Z,g,$)=>{const V=f.length/3;f.push(...x,...z,...I,...Z);for(let G=0;G<4;G++)d.push(g,$);v.push(V,V+1,V+2,V,V+2,V+3)};B([-.85,1.35,-2],[-.85,1.35,2],[.85,1.35,2],[.85,1.35,-2],0,1.7),B([-.85,.25,2],[.85,.25,2],[.85,1.35,2],[-.85,1.35,2],0,1),B([-.85,.25,-2],[.85,.25,-2],[.85,1.35,-2],[-.85,1.35,-2],0,1),B([-.85,.25,-2],[-.85,.25,2],[-.85,1.35,2],[-.85,1.35,-2],0,.8),B([.85,.25,-2],[.85,.25,2],[.85,1.35,2],[.85,1.35,-2],0,.8);for(const x of[-.55,.55])for(const z of[1,-1])B([x-.16,.62,z*(2+.02)],[x+.16,.62,z*(2+.02)],[x+.16,.86,z*(2+.02)],[x-.16,.86,z*(2+.02)],z>0?1:2,1);const S=new a.InstancedBufferGeometry;return S.setAttribute("position",new a.BufferAttribute(new Float32Array(f),3)),S.setAttribute("aPart",new a.BufferAttribute(new Float32Array(d),2)),S.setIndex(v),S}function gt(){const f=[],d=[],v=[];for(let l=0;l<3;l++)f.push(-1,-1,0,1,-1,0,1,1,0,-1,1,0),d.push(l,l,l,l),v.push(4*l,4*l+1,4*l+2,4*l,4*l+2,4*l+3);const m=new a.InstancedBufferGeometry;return m.setAttribute("position",new a.BufferAttribute(new Float32Array(f),3)),m.setAttribute("aKind",new a.BufferAttribute(new Float32Array(d),1)),m.setIndex(v),m}const dt=`
${O}${K}
attribute vec4 aS0; attribute vec4 aS1;
uniform vec3 uSmWarm; uniform vec3 uSmGrey;
varying vec2 vUv; varying vec4 vCol;
void main() {
  float age = fract(uLifeT / aS1.x + aS1.y), L = aS0.w;
  float rise = 0.66 * L * (1.0 - exp(-2.4 * age));                          // off its own roof, along its own ground's normal
  float drift = 0.8 * L * age * (0.3 + 0.7 * age);                           // the kept wind: along the street toward +z
  float wz = 0.9 * age * sin(uLifeT * 0.5 + aS1.w * 6.2832 + age * 5.0), wa = 0.9 * age * cos(uLifeT * 0.4 + aS1.w * 11.0 + age * 4.0);
  vec3 c = lifeAt(aS0.x + wa - 0.15 * L * age * age, aS0.y + rise, aS0.z + drift + wz);
  vec4 mvPosition = viewMatrix * vec4(c, 1.0);
  mvPosition.xy += position.xy * aS1.z * (0.45 + 2.3 * age);                 // RULE 1: the puff faces the eye
  gl_Position = projectionMatrix * mvPosition;
  vUv = position.xy;
  vCol = vec4(mix(uSmWarm, uSmGrey, smoothstep(0.0, 0.3, age)), 1.0 * smoothstep(0.0, 0.04, age) * (1.0 - age) * (1.0 - 0.45 * age));
  #include <fog_vertex>
}`,ht=`
${X}varying vec2 vUv; varying vec4 vCol;
void main() {
  gl_FragColor = vec4(vCol.rgb, vCol.a * (1.0 - smoothstep(0.08, 1.0, dot(vUv, vUv))));
  #include <fog_fragment>
}`,pt=`
${O}${K}
attribute vec4 aL0; uniform float uViewH;
varying vec2 vUv; varying float vGain;
void main() {
  vec3 c = lifeAt(aL0.x, aL0.y, aL0.z);
  vec4 mvPosition = viewMatrix * vec4(c, 1.0);
  float pxm = uViewH * 0.5 * projectionMatrix[1][1] / max(-mvPosition.z, 0.5);
  float r = max(2.4, 1.5 / pxm);                                            // RULE 2: never under 1.5 pixels, its light kept
  vGain = (5.76 / (r * r)) * (0.5 + 0.3 * sin(uLifeT * 2.3 + aL0.w) + 0.2 * sin(uLifeT * 5.9 + 1.7 * aL0.w));
  mvPosition.xy += position.xy * r;                                         // RULE 2: the halo faces the eye
  gl_Position = projectionMatrix * mvPosition;
  vUv = position.xy;
  #include <fog_vertex>
}`,mt=`
${X}uniform vec3 uHalo; varying vec2 vUv; varying float vGain;
void main() {
  float d2 = dot(vUv, vUv);
  vec3 col = uHalo * vGain * exp(-3.0 * d2) * (1.0 - smoothstep(0.6, 1.0, d2));
  #ifdef USE_FOG
    col *= exp(-0.16 * fogDensity * fogDensity * vFogDepth * vFogDepth);    // the air on a source: the lamps' own share (0.4 of the density)
  #endif
  gl_FragColor = vec4(col, 1.0);
}`,wt=`
${O}${K}
attribute vec3 aCl; attribute vec3 aCol; uniform vec3 uClothL;
varying vec3 vCol;
void main() {
  float s = aCl.x * (sin(uLifeT * 1.6 + aCl.y) + 0.4 * sin(uLifeT * 3.3 + 1.9 * aCl.y));
  vec3 p = position + s * mix(vec3(0.22, 0.03, 0.04), vec3(0.05, 0.035, 0.0), aCl.z);   // washing swings across its line; an awning's edge lifts
  vec4 mvPosition = viewMatrix * vec4(lifeAt(p.x, p.y, p.z), 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vCol = aCol * uClothL * (1.0 - 0.18 * aCl.x);
  #include <fog_vertex>
}`,Oe=`
${X}varying vec3 vCol;
void main() {
  gl_FragColor = vec4(vCol, 1.0);
  #include <fog_fragment>
}`;function Ke(){const f=new a.InstancedBufferGeometry;return f.setAttribute("position",new a.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),f.setIndex([0,1,2,0,2,3]),f}const Y=(f,d,v,m)=>f.setAttribute(d,new a.InstancedBufferAttribute(new Float32Array(v),m));async function zt(f,d={}){const v=e=>f.core.makeRng(f.core.hashSeed(e+":"+f.seed)),m=new a.Group;m.name="closing-life";const l=d.plan||{},C=l.flat||{},k=d.bend.knots,B=d.path,S={value:0},x=d.bend.uniforms.uBendK,z=()=>a.UniformsUtils.clone(a.UniformsLib.fog),I=[],Z=[],g={birds:[],birdCount:0,vehicles:0,courses:0,smoking:0,lamps:0,washing:0,awnings:0,tris:0,draws:0},$=new Map,V=16;for(let e=-60;e<=B.length;e+=3){B.posAtDist(e,R);const t=Math.floor(R.z/V);$.has(t)||$.set(t,[]),$.get(t).push(R.x,R.y,R.z)}const G=(e,t,o,s=100)=>{nt(k,e,t,o,R);let i=s*s;for(let n=Math.floor((R.z-s)/V);n<=Math.floor((R.z+s)/V);n++){const c=$.get(n);if(c)for(let u=0;u<c.length;u+=3){const r=c[u]-R.x,p=c[u+1]-R.y,w=c[u+2]-R.z,h=r*r+p*p+w*w;h<i&&(i=h)}}return Math.sqrt(i)},j=(e,t,o,s,i)=>{const n=new a.Mesh(e,t);return n.name=o,n.frustumCulled=!1,n.renderOrder=s,n.castShadow=!1,n.receiveShadow=!1,I.push(e),Z.push(t),m.add(n),g.tris+=i,g.draws++,n},ye=C.towerA||{x:62.25,z:330,h:62},xe=l.sites&&l.sites.towerB||{a:422,z:528,h:70},ze=8,Ne=[-50,60,ye.x-_.HX,150,20,xe.a,110,-30],be=[0,6,-6,12,-12,18,-18,24,-24,30,36,42,48],Ae=[],Ce=[],Se=[],Fe=[];for(let e=0;e<ze;e++){const t=v("closing-life-flock-"+e),o=t(),s=t.range(-20,20),i=t.range(26,60),n=t.range(30,55),c=t.range(60,100),u=t.range(6,12),r=80+Math.floor(t()*41),p=t(),w=t()<.5?-1:1,h=[];for(let L=0;L<r;L++){const q=()=>(t()+t()+t()-1.5)/1.5;h.push([e,.03*(t()-.5),t(),t.range(1.4,1.6),me[0]*q(),me[1]*q(),me[2]*q()])}const F=[Ne[e]+(e===2||e===5?0:s),i,e===2?ye.z:e===5?xe.z:60+1100*(e+o)/ze,w*13/(H*Math.sqrt((n*n+c*c)/2))],P=[n,u,c,p];let y=0,T=0,A=!1,M=null,re=i;if(e!==2&&e!==5)for(const L of[-60,0,60,120,180])for(const q of[30,50,70,90,110]){const he=[L+s,q+(i-43)/3,F[2]],pe=$e(G,he,P,36);pe>=je+we+4&&(!M||pe<M.c)&&(M={c:pe,a:he[0],h:he[1]})}for(M&&(F[0]=M.a,re=M.h);T<be.length&&!A;T++)F[1]=re+be[T],!(F[1]<16)&&(y=$e(G,F,P),A=y>=je+we+1);if(g.birds.push({made:A,count:A?r:0,lifts:T,course:+y.toFixed(1),least:+(y-we).toFixed(1)}),Ae.push(new a.Vector4(...F)),Ce.push(new a.Vector4(...P)),A){g.birdCount+=r;for(const L of h)Se.push(L[0],L[1],L[2],L[3]),Fe.push(L[4],L[5],L[6])}await f.yield()}if(g.birdCount){const e=st();Y(e,"aB0",Se,4),Y(e,"aB1",Fe,3),e.instanceCount=g.birdCount;const t=new a.ShaderMaterial({uniforms:Object.assign(z(),{uBendK:x,uLifeT:S,uFlA:{value:Ae},uFlB:{value:Ce},uBirdC:{value:new a.Color("#141a33")}}),vertexShader:it,fragmentShader:rt,fog:!0,side:a.DoubleSide});j(e,t,"closing-life-birds",4,4*g.birdCount)}const Q=v("closing-life-vehicles"),J=l.sites||{},ee=l.squares||{},We=[J.towerB,J.church,...J.towerHouses||[],...J.fountains||[]].filter(Boolean),qe=[ee.hinge&&ee.hinge.paved,ee.hanging&&ee.hanging.paved].filter(Boolean),Xe=(e,t)=>We.some(o=>Math.abs(e-o.a)<o.w/2+4&&Math.abs(t-o.z)<o.d/2+4)||qe.some(o=>e>o.a0-3&&e<o.a1+3&&t>o.z0-3&&t<o.z1+3),D=[],U=[];for(const e of l.longs||[])e.zone!=="brink"&&D.push({a:(e.a0+e.a1)/2,z:e.z0,len:e.z1-e.z0,along:0,hw:(e.a1-e.a0)/2,wide:!!e.wide});for(const e of l.cross||[])D.push({a:Math.max(8,e.aStart),z:(e.z0+e.z1)/2,len:e.aEnd-Math.max(8,e.aStart),along:1,hw:(e.z1-e.z0)/2,wide:!!e.wide});for(const e of C.longs||[])D.push({a:-34-(e.f0+e.f1)/2,z:e.z0,len:e.z1-e.z0,along:0,hw:(e.f1-e.f0)/2,wide:!1});for(const e of C.cross||[])D.push({a:-220,z:(e.z0+e.z1)/2,len:182,along:1,hw:(e.z1-e.z0)/2,wide:!!e.wide});for(let e=0;e<D.length;e++){const t=D[e],o=Math.floor(t.len/4);let s=-1;for(let i=0;i<=o+1;i++){const n=t.a+(t.along?4*i:0),c=t.z+(t.along?0:4*i),u=i<=o&&c>-50&&c<1480&&(n<0||!l.onLand||l.onLand(n,c,4))&&!Xe(n,c)&&G(n,1,c,40)>=lt+9;if(u&&s<0&&(s=i),!u&&s>=0){const r=4*(i-1-s)-30,p=Math.ceil(r/140),w=4*s+15;if(r>=48)for(let h=0;h<p;h++)U.push({a:t.a+(t.along?w+h*r/p:0),z:t.z+(t.along?0:w+h*r/p),len:r/p,along:t.along,lane:.42*t.hw,w:r/p*(t.wide?2.2:1)});s=-1}}e%40===39&&await f.yield()}await f.yield();const Ye=440,se=[],Le=[],le=U.map(()=>[]);let Me=0;for(const e of U)e.v=Q.range(8,14),Me+=e.w;for(let e=0;e<Ye&&U.length;e++){const t=Q()*Me,o=Q(),s=Q.range(8,12);let i=0,n=U[0].w;for(;i<U.length-1&&n<t;)n+=U[++i].w;le[i].push([o,s])}if(U.forEach((e,t)=>le[t].forEach((o,s)=>{se.push(e.a,e.z,e.len,e.along),Le.push(e.v/(2*e.len),(s+.7*o[0])/le[t].length,e.lane,o[1])})),g.vehicles=se.length/4,g.courses=U.length,g.vehicles){const e=new a.InstancedBufferAttribute(new Float32Array(se),4),t=new a.InstancedBufferAttribute(new Float32Array(Le),4),o={value:new a.Color("#ffe2b0").multiplyScalar(4)},s={value:new a.Color("#ff2a12").multiplyScalar(2.5)},i={value:450},n=new a.Vector2,c=vt();c.setAttribute("aV0",e),c.setAttribute("aV1",t),c.instanceCount=g.vehicles,j(c,new a.ShaderMaterial({uniforms:Object.assign(z(),{uBendK:x,uLifeT:S,uCarBody:{value:new a.Color(.035,.035,.05)},uCarFront:o,uCarRear:s}),vertexShader:ft,fragmentShader:Oe,fog:!0,side:a.DoubleSide}),"closing-life-vehicles",3,18*g.vehicles);const u=gt();u.setAttribute("aV0",e),u.setAttribute("aV1",t),u.instanceCount=g.vehicles,j(u,new a.ShaderMaterial({uniforms:Object.assign(z(),{uBendK:x,uLifeT:S,uViewH:i,uPoolC:{value:new a.Color("#ffd9a0").multiplyScalar(1.4)},uCarFront:o,uCarRear:s}),vertexShader:ct,fragmentShader:ut,fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending}),"closing-life-carlights",9,6*g.vehicles).onBeforeRender=r=>{const p=r.getRenderTarget();i.value=p?p.height:r.getDrawingBufferSize(n).y}}await f.yield();const N=v("closing-life-smoke"),Be=[],Pe=[],fe=6,te=20,ce=1240,_e=(d.chimneys||[]).map(e=>e.a<0?{a:e.x-_.HX,h:e.y-_.Y0,z:e.z,flat:!0}:{a:e.a,h:e.top,z:e.z}).filter(e=>e.z>=te&&e.z<ce&&(e.flat?e.a<=0&&e.a>-110:e.a>=60&&e.a<=596.5));await f.yield();const Ze=e=>{for(const t of[12,20])for(let o=0;o<=1.001;o+=.25)if(G(e.a-.15*t*o*o,e.h+.66*t*(1-Math.exp(-2.4*o)),e.z+.8*t*o*(.3+.7*o),24)<14+6*o)return!1;return!0},Re=[];for(let e=0;e<_e.length;e++){const t=_e[e];t.d=G(t.a,t.h,t.z),t.d>=24&&Ze(t)&&Re.push(t),e%250===249&&await f.yield()}await f.yield();for(let e=0;e<fe;e++)for(let t=0;t<3;t++){const o=te+(ce-te)*e/fe,s=o+(ce-te)/fe,i=Re.filter(u=>u.z>=o&&u.z<s&&(t===0?u.flat:t===1?!u.flat&&u.a<266:!u.flat&&u.a>=266)),n=i.filter(u=>u.d<90),c=n.length>=4?n:i;for(let u=0;u<2;u++){const r=N(),p=N.range(12,20),w=N(),h=N.range(1.45,2)*(t?1.3:1),F=[];for(let y=0;y<36;y++)F.push(N());if(t||!c.length)continue;const P=c.splice(Math.floor(r*c.length),1)[0];g.smoking++;for(let y=0;y<12;y++)Be.push(P.a,P.h,P.z,p),Pe.push(p/1.1,w+(y+.7*F[3*y])/12,h*(.8+.4*F[3*y+1]),F[3*y+2])}}if(g.smoking){const e=Ke();Y(e,"aS0",Be,4),Y(e,"aS1",Pe,4),e.instanceCount=12*g.smoking;const t=new a.ShaderMaterial({uniforms:Object.assign(z(),{uBendK:x,uLifeT:S,uSmWarm:{value:new a.Color("#c88a6a").multiplyScalar(.9)},uSmGrey:{value:new a.Color("#9a96b4").multiplyScalar(.9)}}),vertexShader:dt,fragmentShader:ht,fog:!0,transparent:!0,depthWrite:!1});j(e,t,"closing-life-smoke",7,24*g.smoking)}await f.yield();const Qe=v("closing-life-lamps"),oe=[],Je=2600,ae=(e,t,o)=>{const s=H*Qe();oe.length<4*Je&&oe.push(e,t,o,s)};let ue=0;for(const e of l.lamps||[])e.kind==="bracket"&&ue++,e.kind!=="bulb"&&ae(Math.min(596.5,Math.max(0,e.a)),e.h,e.z);for(const e of C.lamps||[])e.kind==="bracket"&&ue++,e.kind!=="bulb"&&e.x<=_.HX&&ae(e.x-_.HX,e.y-_.Y0,e.z);const b=C.lattice;if(b&&!ue)for(let e=b.z0-b.step*Math.floor((b.z0+60)/b.step);e<=(_.TOWN_Z1||_.RING_Z-10);e+=b.step)b.gapL&&e>b.gapL[0]&&e<b.gapL[1]||ae(Math.max(0,b.xL-_.HX),b.y-_.Y0,e),ae(b.xR-_.HX,b.y-_.Y0,e);if(g.lamps=oe.length/4,g.lamps){const e=Ke();Y(e,"aL0",oe,4),e.instanceCount=g.lamps;const t={value:450},o=new a.Vector2,s=new a.ShaderMaterial({uniforms:Object.assign(z(),{uBendK:x,uLifeT:S,uViewH:t,uHalo:{value:new a.Color("#ff8a3a").multiplyScalar(.36*.12)}}),vertexShader:pt,fragmentShader:mt,fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending});j(e,s,"closing-life-lamps",8,2*g.lamps).onBeforeRender=i=>{const n=i.getRenderTarget();t.value=n?n.height:i.getDrawingBufferSize(o).y}}await f.yield();const ke=[],Ve=[],Ge=[],ve=[];let Te=0;const E=(e,t,o,s,i,n,c)=>(ke.push(e,t,o),Ge.push(s,i,n),Ve.push(c.r,c.g,c.b),Te++),ne=(e,t,o,s)=>ve.push(e,t,o,e,o,s),Ue=["#d9d2c0","#c9c2b2","#b8c0c8","#c4a58a","#a9b39a","#d8cfae"].map(e=>new a.Color(e)),Ee=["#8c4a3a","#b08a4a","#5f7362","#4f5d75","#9a8f7a"].map(e=>new a.Color(e)),et=0,ie=v("closing-life-washing"),ge=(l.cross||[]).filter(e=>!e.wide&&e.aStart===0&&e.z0>20&&e.z1<1150),de=l.blocks||[];for(let e=0;e<12&&g.washing<et&&ge.length;e++){const t=ie(),o=ie.range(2.5,6.5),s=ie.range(4.6,5.6),i=[];for(let r=0;r<96;r++)i.push(ie());const n=ge.splice(Math.floor(t*ge.length),1)[0],c=de.filter(r=>Math.abs(r.z1-n.z0)<1.5&&r.a0>=5&&r.a0<120).map(r=>[r,de.find(p=>Math.abs(p.z0-n.z1)<1.5&&Math.abs(p.a0-r.a0)<1.5)]).find(r=>r[1]);if(!c)continue;const u=Math.max(c[0].a0,c[1].a0)+o;if(!(G(u,s,(n.z0+n.z1)/2)<12)){g.washing++;for(let r=0;r<2;r++){const p=u+2.4*r;let w=n.z0+.25;for(let h=48*r;h<48*r+48&&w<n.z1-.9;h+=4){const F=Math.min(.55+.6*i[h],n.z1-.25-w),P=.7+.7*i[h+1],y=Ue[Math.floor(i[h+2]*Ue.length)],T=H*i[h+3],A=[];for(let M=0;M<3;M++)A.push(E(p,s-M*P/2,w,M/2,T,0,y),E(p,s-M*P/2,w+F,M/2,T+.5,0,y));ne(A[0],A[1],A[3],A[2]),ne(A[2],A[3],A[5],A[4]),w+=F+.06+.2*i[h+3]}}}}const tt=0,W=v("closing-life-awnings"),Ie=new Set,He=b?Math.floor((1150-b.z0)/b.step):0;for(let e=0;e<40&&g.awnings<tt&&He>0;e++){const t=Math.floor(W()*He),o=W()<.5,s=W.range(3.2,4.6),i=Ee[Math.floor(W()*Ee.length)],n=H*W(),c=b.z0+(t+.5)*b.step,u=c-s/2,r=c+s/2,p=(o?"L":"R")+t,w=o?5.95:-33.95,h=o?-1.6:1.6,F=(o?de:C.blocks||[]).some(L=>L.zone==="promenade"&&L.z0+.8<=u&&L.z1-.8>=r);if(Ie.has(p)||!F||G(w+h,2.9,c)<6)continue;Ie.add(p),g.awnings++;const P=E(w,3.5,u,0,n,1,i),y=E(w,3.5,r,0,n,1,i),T=E(w+h,2.9,u,.5,n,1,i),A=E(w+h,2.9,r,.5,n+.6,1,i),M=E(w+h,2.55,u,1,n,1,i),re=E(w+h,2.55,r,1,n+.6,1,i);ne(P,y,A,T),ne(T,A,re,M)}if(Te){const e=new a.BufferGeometry;e.setAttribute("position",new a.BufferAttribute(new Float32Array(ke),3)),e.setAttribute("aCl",new a.BufferAttribute(new Float32Array(Ge),3)),e.setAttribute("aCol",new a.BufferAttribute(new Float32Array(Ve),3)),e.setIndex(ve);const t=new a.ShaderMaterial({uniforms:Object.assign(z(),{uBendK:x,uLifeT:S,uClothL:{value:new a.Vector3(.34,.31,.33)}}),vertexShader:wt,fragmentShader:Oe,fog:!0,side:a.DoubleSide});j(e,t,"closing-life-cloth",3,ve.length/3)}return await f.yield(),{group:m,stats:g,update(e,t){S.value=t},dispose(){for(const e of I)e.dispose();for(const e of Z)e.dispose()}}}export{je as BIRD_CLEAR,lt as CAR_CLEAR,zt as buildLife,xt as carAt,$e as courseClear,nt as lifeAt};
