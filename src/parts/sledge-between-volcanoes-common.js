import*as e from"three";const g=Math.PI,b=1/Math.PI;function G(){return{uTime:{value:0},uSkyCol:{value:new e.Color("#35508A").multiplyScalar(4.2*b)},uGndCol:{value:new e.Color("#1B2640").multiplyScalar(4.2*b)},uGlowDir:{value:new e.Vector3(-.34,.14,-.93).normalize()},uGlowCol:{value:new e.Color("#E8C8A8").multiplyScalar(3*b)},uFirePos:{value:new e.Vector3(190,110,-400)},uFireCol:{value:new e.Color("#FF5A1E")},uFire:{value:new e.Vector4(90,1,.1,0)},uWashDir:{value:new e.Vector3(.62,.62,-.48).normalize()},uFireZ:{value:new e.Vector2(-705,-585)},uFogCol:{value:new e.Color("#2A3B5E")},uFogDen:{value:45e-5},uFire2:{value:new e.Vector4(0,0,0,0)},uRing:{value:new e.Vector4(0,0,0,0)},uRingCol:{value:new e.Color("#9fc4ff")},uBelly:{value:new e.Vector4(0,0,0,0)}}}const H=(h,t)=>{const o={};for(const f of t)o[f]=h.fork(f);return o},D=h=>({uTime:h.uTime,uSkyCol:h.uSkyCol,uGndCol:h.uGndCol,uGlowDir:h.uGlowDir,uGlowCol:h.uGlowCol,uFirePos:h.uFirePos,uFireCol:h.uFireCol,uFire:h.uFire,uWashDir:h.uWashDir,uFireZ:h.uFireZ,uFogCol:h.uFogCol,uFogDen:h.uFogDen,uFire2:h.uFire2,uRing:h.uRing,uRingCol:h.uRingCol,uBelly:h.uBelly}),k=`
float sH1(float p){ p = fract(p*.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float sH2(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
float sH3(vec3 p3){ p3 = fract(p3*.1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y)*p3.z); }
float sN2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(sH2(i), sH2(i + vec2(1., 0.)), f.x), mix(sH2(i + vec2(0., 1.)), sH2(i + vec2(1., 1.)), f.x), f.y); }
float sN3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(mix(sH3(i), sH3(i + vec3(1., 0., 0.)), f.x), mix(sH3(i + vec3(0., 1., 0.)), sH3(i + vec3(1., 1., 0.)), f.x), f.y),
             mix(mix(sH3(i + vec3(0., 0., 1.)), sH3(i + vec3(1., 0., 1.)), f.x), mix(sH3(i + vec3(0., 1., 1.)), sH3(i + vec3(1., 1., 1.)), f.x), f.y), f.z); }
float sF2(vec2 p){ return .5*sN2(p) + .27*sN2(p*2.03 + 17.3) + .15*sN2(p*4.1 + 31.7) + .08*sN2(p*8.3 + 5.1); }
float sF3(vec3 p){ return .52*sN3(p) + .27*sN3(p*2.03 + vec3(7.1, 3.3, 5.7)) + .14*sN3(p*4.07 + vec3(1.7, 9.2, 4.4)) + .07*sN3(p*8.1 + vec3(3.3, 1.1, 8.8)); }
`,M=`
uniform vec3 uSkyCol, uGndCol, uGlowDir, uGlowCol, uFirePos, uFireCol, uWashDir, uFogCol;
uniform vec4 uFire, uFire2, uRing, uBelly; uniform vec3 uRingCol; uniform vec2 uFireZ; uniform float uFogDen;
// the fire: the lava front as an area light and the broad wash from the plume's underside; both stop at the lip
vec3 sbvFire(vec3 wp, vec3 n){
  vec3 d = uFirePos - wp; float l = length(d); vec3 L = d/max(l, 1e-3);
  float r = uFire.x, att = r*r/(l*l + r*r);
  float nl = clamp(dot(n, L)*.96 + .04, 0., 1.);
  float wash = smoothstep(.66, 1., dot(n, uWashDir));
  float lip = smoothstep(uFireZ.x, uFireZ.y, wp.z);
  return uFireCol*((uFire.y*att*nl + uFire.z*wash)*lip*(1. + uFire.w));
}
vec3 sbvSky(vec3 n){ return mix(uGndCol, uSkyCol, clamp(n.y*.5 + .5, 0., 1.)) + uGlowCol*max(dot(n, uGlowDir), 0.); }
// the tongue beside the icefall: an orange light on what is turned to it, nothing on what is turned away; it beats with the bursts
vec3 sbvFire2(vec3 wp, vec3 n){
  vec3 d = uFire2.xyz - wp; float l = length(d), r = uFire2.w, att = r*r/(l*l + r*r + 1e-3);
  float nl = clamp(dot(n, d/max(l, 1e-3)), 0., 1.);
  return uFireCol*(uFire.y*att*nl*nl*(1. + 3.*uFire.w));
}
// the way out's own cold light on what stands near it
vec3 sbvRing(vec3 wp, vec3 n){ vec3 d = uRing.xyz - wp; float l2 = dot(d, d); return uRingCol*(uRing.w*clamp(dot(n, d*inversesqrt(l2 + 1e-3))*.6 + .4, 0., 1.)*81./(l2 + 81.)); }
// (polish 1) the eruption's burning belly, far up over the crater: a dull red light on what is turned to it, dying
// with distance from the mountain (a light of the place: by metres over the ground from the crater's column, 1,100 m
// its measure). It comes in low, from the lit underside of the smoke, so it catches the faces turned to the mountain
// (the windward faces) far more than flat snow.
vec3 sbvBelly(vec3 wp, vec3 n){ vec3 d = uBelly.xyz - wp; float l2 = dot(d.xz, d.xz); d.y *= .4;
  return uFireCol*(uBelly.w*clamp(dot(n, d*inversesqrt(dot(d, d) + 1.))*1.45 - .45, 0., 1.)*1.21e6/(l2 + 1.21e6)); }
// the way out's light on the ridges that stand nearest it (30 m its measure)
vec3 sbvRingFar(vec3 wp, vec3 n){ vec3 d = uRing.xyz - wp; float l2 = dot(d, d); return uRingCol*(.3*uRing.w*clamp(dot(n, d*inversesqrt(l2 + 1e-3))*.6 + .4, 0., 1.)*900./(l2 + 900.)); }
vec3 sbvLight(vec3 wp, vec3 n){ return sbvSky(n) + sbvFire(wp, n) + sbvFire2(wp, n) + sbvRing(wp, n); }
vec3 sbvFog(vec3 c, float dist, float k){ float q = uFogDen*dist*k; return mix(c, uFogCol, 1. - exp(-q*q)); }
`;class N{constructor(){this.p=[],this.n=[],this.c=[],this.part=[],this.k=[],this.col=new e.Color(1,1,1),this.pid=0,this.kv=0,this.m=null}color(t){return this.col.set(t),this}rgb(t,o,f){return this.col.setRGB(t,o,f),this}id(t){return this.pid=t,this}_v(t,o,f){this.m&&(t=t.clone().applyMatrix4(this.m),o=o.clone().transformDirection(this.m)),this.p.push(t.x,t.y,t.z),this.n.push(o.x,o.y,o.z),this.c.push(this.col.r,this.col.g,this.col.b),this.part.push(this.pid),this.k.push(f??this.kv)}tri(t,o,f,d,l,m,w,p,F){d||(d=l=m=new e.Vector3().subVectors(o,t).cross(new e.Vector3().subVectors(f,t)).normalize()),this._v(t,d,w),this._v(o,l,p),this._v(f,m,F)}quad(t,o,f,d,l){this.tri(t,o,f,l,l,l),this.tri(t,f,d,l,l,l)}box(t,o,f,d,l,m,w=null,p=1){const F=new e.Quaternion;w&&F.setFromEuler(new e.Euler(w[0],w[1],w[2],"YXZ"));const i=(s,r,u)=>new e.Vector3(s*d*(r>0?p:1),r*l,u*m*(r>0?p:1)).applyQuaternion(F).add(new e.Vector3(t,o,f)),n=[[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],[[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]],[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]];for(const s of n){const r=s.map(u=>i(u[0],u[1],u[2]));this.quad(r[0],r[1],r[2],r[3],null)}return this}tube(t,o=8,f=!0,d=!0){const l=[],m=new e.Vector3(0,1,0),w=new e.Vector3;for(let i=0;i<t.length;i++){const n=t[Math.max(0,i-1)],s=t[Math.min(t.length-1,i+1)],r=new e.Vector3(s[0]-n[0],s[1]-n[1],s[2]-n[2]).normalize(),u=Math.abs(r.y)>.95?w.set(0,0,1):m,c=new e.Vector3().crossVectors(u,r).normalize(),v=new e.Vector3().crossVectors(r,c).normalize(),a=t[i][3],x=Array.isArray(a)?a[0]:a,C=Array.isArray(a)?a[1]:a,V=[];for(let y=0;y<o;y++){const z=y/o*g*2,A=Math.cos(z),R=Math.sin(z),B=new e.Vector3().addScaledVector(c,A*C).addScaledVector(v,R*x).normalize();V.push({v:new e.Vector3(t[i][0],t[i][1],t[i][2]).addScaledVector(c,A*x).addScaledVector(v,R*C),n:B})}l.push(V)}const p=l.length;for(let i=0;i<p-1;i++){const n=i/(p-1),s=(i+1)/(p-1);for(let r=0;r<o;r++){const u=l[i][r],c=l[i][(r+1)%o],v=l[i+1][(r+1)%o],a=l[i+1][r];this.tri(u.v,c.v,v.v,u.n,c.n,v.n,n,n,s),this.tri(u.v,v.v,a.v,u.n,v.n,a.n,n,s,s)}}const F=(i,n,s,r)=>{const u=new e.Vector3(n[0],n[1],n[2]);for(let c=0;c<o;c++){const v=i[c],a=i[(c+1)%o],x=new e.Vector3().subVectors(v.v,u).cross(new e.Vector3().subVectors(a.v,u)).normalize().multiplyScalar(s);s>0?this.tri(u,v.v,a.v,x,x,x,r,r,r):this.tri(u,a.v,v.v,x,x,x,r,r,r)}};return f&&F(l[0],t[0],-1,0),d&&F(l[p-1],t[p-1],1,1),this}ball(t,o,f,d,l,m,w=8,p=6,F=-1){const i=(n,s)=>{const r=s/p*g,u=n/w*g*2,c=Math.max(F,Math.cos(r)),v=Math.sqrt(Math.max(0,1-c*c)),a=new e.Vector3(Math.cos(u)*v,c,Math.sin(u)*v);return{v:new e.Vector3(t+a.x*d,o+a.y*l,f+a.z*m),n:new e.Vector3(a.x/d,a.y/l,a.z/m).normalize()}};for(let n=0;n<p;n++)for(let s=0;s<w;s++){const r=i(s,n),u=i(s+1,n),c=i(s+1,n+1),v=i(s,n+1);n>0&&this.tri(r.v,u.v,c.v,r.n,u.n,c.n),n<p-1&&this.tri(r.v,c.v,v.v,r.n,c.n,v.n)}return this}geometry(){const t=new e.BufferGeometry;return t.setAttribute("position",new e.Float32BufferAttribute(this.p,3)),t.setAttribute("normal",new e.Float32BufferAttribute(this.n,3)),t.setAttribute("color",new e.Float32BufferAttribute(this.c,3)),t.setAttribute("aPart",new e.Float32BufferAttribute(this.part,1)),t.setAttribute("aK",new e.Float32BufferAttribute(this.k,1)),t}get triangles(){return this.p.length/9}}export{N as Acc,g as PI,M as SBV_LIGHT,k as SBV_NOISE,H as forksOf,G as makeShared,D as sharedUniforms};
