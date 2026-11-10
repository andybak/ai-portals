import*as s from"three";import{RW_GLSL as P,withShared as I,clamp as J}from"./the-red-weed-common.js";class j{constructor(){this.p=[],this.n=[],this.f=[],this.i=[],this.count=0}v(h,v,w,e,o){return this.p.push(h.x,h.y,h.z),this.n.push(v.x,v.y,v.z),this.f.push(w,0,e,o),this.count++}done(){let h=.001;for(let v=1;v<this.p.length;v+=3)h=Math.max(h,this.p[v]);for(let v=0;v<this.count;v++)this.f[v*4+1]=Math.pow(J(this.p[v*3+1]/h,0,1),1.4);return{p:new Float32Array(this.p),n:new Float32Array(this.n),f:new Float32Array(this.f),i:new Uint16Array(this.i),count:this.count,H:h}}}const N=new s.Vector3,U=new s.Vector3,tt=new s.Vector3,dt=new s.Quaternion;function et(r,h,v,w,e,o,g,d=7,c=.2){const a=new s.Vector3().crossVectors(w,e).normalize(),p=h(),b=h.range(.72,1.22),x=h.range(0,6.28),y=[],n=new s.Vector3().copy(v).addScaledVector(w,o*.56),t=g*(c>0?c:.2),_=r.v(N.copy(n).addScaledVector(e,t),e,0,p,b),u=r.count;for(let f=0;f<d;f++){const C=(f+.5)/d*Math.PI*2,W=(1-Math.cos(C))/2,O=1+.13*Math.sin(3*C+x),k=o*W*(.92+.08*O),V=g/2*Math.sin(C)*(.7+.42*W)*O,z=new s.Vector3().copy(v).addScaledVector(w,k).addScaledVector(a,V);N.copy(z).sub(n).normalize(),c>0||N.multiplyScalar(.9).addScaledVector(e,.45).normalize(),r.v(z,N,1,p,b),y.push(z)}for(let f=0;f<d;f++)r.i.push(_,u+f,u+(f+1)%d);if(c>0){U.copy(e).negate();const f=r.v(N.copy(n).addScaledVector(e,-t*.75),U,0,p,b*.8);for(let C=0;C<d;C++)r.i.push(f,u+(C+1)%d,u+C)}return{rim:y,side:a,cen:n}}function X(r,h,v,w,e=0){const o=h()+e,g=e?1.25:.8,d=r.count,c=h()*6.28;N.set(0,1,0),U.copy(v).addScaledVector(N,w*1.3),r.v(U,N,e?.7:.12,o,g),N.set(0,-1,0),U.copy(v).addScaledVector(N,w*1.3),r.v(U,N,e?.7:.12,o,g);for(let a=0;a<3;a++)N.set(Math.cos(c+a*2.094),0,Math.sin(c+a*2.094)),U.copy(v).addScaledVector(N,w),r.v(U,N,e?.7:.12,o,g);for(let a=0;a<3;a++){const p=d+2+a,b=d+2+(a+1)%3;r.i.push(d,b,p,d+1,p,b)}}function $(r,h,v,w,e,o,g,d,c){c.knot!==0&&X(r,h,v,g*(c.knot??.15));const a=et(r,h,v,w,e,o,g,c.N??7,c.thick??.2);if(d<=0){h()<(c.buds??.5)&&X(r,h,a.rim[Math.floor((c.N??7)/2)],g*.11,2);return}const p=h()<(c.fork??.55)?2:1;for(let b=0;b<p;b++){const x=p===2?b?1:-1:h()<.5?1:-1,y=c.N??7,n=a.rim[J(Math.floor(y/2)+x*(p===2?1:0),0,y-1)].clone().lerp(a.cen,.22),t=w.clone().applyAxisAngle(e,-x*h.range(.3,.85)).lerp(tt.set(0,1,0),c.up??.3).normalize(),_=e.clone().applyAxisAngle(t,x*h.range(.3,1.1));_.addScaledVector(t,-_.dot(t)).normalize(),$(r,h,n,t,_,o*h.range(.74,.95),g*h.range(.78,.96),d-1,c)}}function ot(r){const h=[],v=new s.Vector3(0,1,0),w=(e,o,g,d,c,a,p)=>{const b=new s.Vector3(Math.sin(g)*Math.cos(o),Math.cos(g),Math.sin(g)*Math.sin(o)),x=new s.Vector3(Math.cos(o+1.3),.15,Math.sin(o+1.3));x.addScaledVector(b,-x.dot(b)).normalize(),$(e,r,new s.Vector3(Math.cos(o)*.12,-.15,Math.sin(o)*.12),b,x,d,c,a,p)};{const e=new j;w(e,r.range(0,6.28),.1,1.5,1.08,3,{fork:.45,up:.42,N:6,buds:.4}),w(e,r.range(0,6.28),.55,1.1,.9,1,{fork:.2,N:6,buds:.3}),h.push(e.done())}{const e=new j;for(let o=0;o<3;o++)w(e,o*2.1+r.range(-.4,.4),r.range(.25,.65),r.range(.95,1.2),r.range(.85,1.05),o===0?2:1,{fork:.5,up:.3,N:6,buds:.35});h.push(e.done())}{const e=new j;for(let o=0;o<5;o++){const g=o*1.2566+r.range(-.3,.3),d=r.range(.14,.4),c=new s.Vector3(Math.cos(g)*Math.cos(d),Math.sin(d),Math.sin(g)*Math.cos(d)),a=v.clone().addScaledVector(c,-v.dot(c)).normalize().applyAxisAngle(c,r.range(-.35,.35));$(e,r,new s.Vector3(Math.cos(g)*.2,0,Math.sin(g)*.2),c,a,r.range(2,3),r.range(1.5,2),o%2,{fork:.15,up:.05,N:8,buds:.2,knot:o?0:.1,thick:.13})}w(e,1,.2,1.1,.9,1,{fork:.3,N:6}),h.push(e.done())}{const e=new j;for(let o=0;o<4;o++)w(e,o*1.5708+r.range(-.5,.5),r.range(.3,1),r.range(.6,1.1),r.range(.6,.85),0,{buds:0,N:6,knot:0,thick:0});h.push(e.done())}{const e=new j;for(let o=0;o<2;o++)w(e,o*3.1+r.range(-.4,.4),r.range(.15,.45),r.range(1.5,1.8),r.range(1.2,1.4),1,{fork:.5,up:.35,N:5,buds:0,knot:0});h.push(e.done())}return h}const at=`
uniform vec4 uRing[8];
vec3 rwRings(vec2 xz){
  float rh = 0.0; vec2 rg = vec2(0.0);
  for (int i = 0; i < 8; i++) {
    vec4 r = uRing[i]; vec2 dv = xz - r.xy; float d = length(dv) + 1e-3, age = max(r.z, 0.0);
    float r0 = 2.0 + 8.5*age, x = (d - r0)/3.2;
    float amp = step(0.0, r.z)*r.w*exp(-min(x*x, 40.0))*exp(-min(age*0.24, 40.0))*(1.0 - smoothstep(60.0, 110.0, d))*1.1/(1.0 + 0.03*max(d, 0.0));
    float ph = (d - r0)*1.15;
    rh += amp*cos(ph); rg += dv/d*(-amp*1.15*sin(ph));
  }
  return vec3(rh, rg);
}`,st=`
${P}
${at}
uniform float uCull;
attribute vec4 aF;            // thin 0..1, sway weight, seed (+2 = a bud), tone
attribute vec4 aB;            // the plant's foot (xyz) and its sickness
varying vec3 vW, vN; varying vec4 vF; varying float vSick, vUp, vOut;
void main(){
  vec3 base = aB.xyz, off = position - base;
  float seed = fract(aF.z), bud = step(1.5, aF.z);
  off += normal*bud*0.07*(0.5 + 0.5*sin(uTime*0.9 + seed*40.0));                       // buds swell and split
  float ph = seed*2.0 + base.x*0.19 + base.z*0.13;
  float gust = 0.6 + 0.4*sin(uTime*0.33 - base.x*0.045 - base.z*0.03);
  vec2 sw = vec2(sin(uTime*0.78 + ph), sin(uTime*0.61 + ph*1.7 + 1.3))*gust + 0.35*vec2(sin(uTime*1.9 + ph*3.1 + off.y), cos(uTime*1.6 + ph*2.3 + off.y));
  float amt = aF.y*(0.05 + 0.065*max(off.y, 0.0))*(1.0 + 0.7*aB.w);                      // the dead growth is dry and light: it rocks more
  off.xz += sw*amt; off.y -= 0.35*amt*dot(sw, sw)*0.5;
  float fade = 1.0 - smoothstep(uCull*0.72, uCull, length(base - cameraPosition));
  vec3 rr = rwRings(base.xz);
  vec3 wp = base + off*fade; wp.y += rr.x*0.85; wp.xz -= rr.yz*max(off.y, 0.0)*0.5*fade;
  vW = wp; vN = normal; vF = aF; vSick = aB.w; vUp = off.y; vOut = length(off.xz);
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,nt=`
${P}
varying vec3 vW, vN; varying vec4 vF; varying float vSick, vUp, vOut;
void main(){
  vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) n = -n;
  vec3 vv = cameraPosition - vW; float dist = length(vv); vec3 v = vv/max(dist, 1e-3);
  float seed = fract(vF.z);
  float sick = smoothstep(0.46, 0.6, vSick + (seed - 0.5)*0.3);
  // dark in the plant's heart and near its foot, open at its tips; an underside or an inner face is darker still
  float ao = (0.38 + 0.62*smoothstep(-0.1, 1.3, vUp))*(0.62 + 0.38*smoothstep(0.1, 1.1, clamp(vOut, 0.0, 4.0)))*(gl_FrontFacing ? 1.0 : 0.7);
  // a pad is a thick body: no light comes through its middle, a little at its rim (the rim of afterglow)
  float thin = clamp(vF.x, 0.0, 1.0);
  vec3 col = rwWeed(n, v, thin*thin*thin*0.5 + 0.02, sick, ao)*mix(1.0, vF.w, 0.55);
  // lit from low ahead, with no sun: looked down on, or seen away from the glow, the growth is a deep wine like the
  // mat it stands in; it is carmine where the eye skims it toward the afterglow
  float toward = clamp(dot(-v, uKeyDir), 0.0, 1.0);
  col *= mix(1.0, mix(0.66, 0.8, sick), smoothstep(0.06, 0.42, clamp(v.y, 0.0, 1.0)))*mix(mix(0.7, 0.84, sick), 1.0, toward*toward);
  float fr = 1.0 - abs(dot(n, v));
  col += rwSky(reflect(-v, n))*(0.015 + 0.1*fr*fr*fr)*ao;
  gl_FragColor = vec4(rwAir(col, vW, cameraPosition), 1.0);
}`;async function pt(r,h,v){const w=v.shapes||ot(v.rng);await r.yield();const e=v.chunkZ??90,o=new Map;for(const x of v.plants){const y=Math.floor(x.z/e);o.has(y)||o.set(y,[]),o.get(y).push(x)}const g=I(h,{uRing:v.ring||{value:[0,1,2,3,4,5,6,7].map(()=>new s.Vector4(0,0,-1,0))},uCull:{value:v.cull??280}}),d=new s.ShaderMaterial({uniforms:g,vertexShader:st,fragmentShader:nt,side:s.DoubleSide}),c=new s.Group,a=[];let p=0;for(const[,x]of o){let y=0,n=0;for(const i of x)y+=w[i.v].count,n+=w[i.v].i.length;const t=new Float32Array(y*3),_=new Float32Array(y*3),u=new Float32Array(y*4),f=new Float32Array(y*4),C=y>65535?new Uint32Array(n):new Uint16Array(n);let W=0,O=0,k=0,V=0,z=0;for(const i of x){const l=w[i.v],M=Math.cos(i.rot),S=Math.sin(i.rot),D=i.s*(1-.3*i.sick),R=D*(1-.3*i.sick),Q=(i.lean||0)*Math.cos(i.rot*3.1),T=(i.lean||0)*Math.sin(i.rot*3.1);for(let F=0;F<l.count;F++){const q=l.p[F*3],H=l.p[F*3+1],K=l.p[F*3+2],E=l.n[F*3],Y=l.n[F*3+1],Z=l.n[F*3+2],G=(W+F)*3,L=(W+F)*4;t[G]=i.x+(M*q+S*K)*D+Q*H*R,t[G+1]=i.y+H*R,t[G+2]=i.z+(-S*q+M*K)*D+T*H*R,_[G]=M*E+S*Z,_[G+1]=Y,_[G+2]=-S*E+M*Z,u[L]=l.f[F*4],u[L+1]=l.f[F*4+1],u[L+2]=Math.floor(l.f[F*4+2])+(l.f[F*4+2]+i.seed)%1,u[L+3]=l.f[F*4+3]*(.85+.3*i.seed),f[L]=i.x,f[L+1]=i.y,f[L+2]=i.z,f[L+3]=i.sick}for(let F=0;F<l.i.length;F++)C[O+F]=l.i[F]+W;W+=l.count,O+=l.i.length,k+=i.x,V+=i.z,++z%220===0&&await r.yield()}const m=new s.BufferGeometry;m.setAttribute("position",new s.BufferAttribute(t,3)),m.setAttribute("normal",new s.BufferAttribute(_,3)),m.setAttribute("aF",new s.BufferAttribute(u,4)),m.setAttribute("aB",new s.BufferAttribute(f,4)),m.setIndex(new s.BufferAttribute(C,1)),k/=x.length,V/=x.length;let B=0;for(const i of x)B=Math.max(B,Math.hypot(i.x-k,i.z-V));m.boundingSphere=new s.Sphere(new s.Vector3(k,2,V),B+8);const A=new s.Mesh(m,d);c.add(A),a.push(A),p+=n/3,await r.yield()}const b=v.cull??280;return{object:c,uniforms:g,triangles:p,meshes:a,shapes:w,update(x){const y=x.matrixWorld.elements;for(const n of a){const t=n.geometry.boundingSphere;n.visible=Math.hypot(t.center.x-y[12],t.center.z-y[14])<b+t.radius}}}}const rt=`
${P}
attribute vec4 aC;            // along 0..1, side -1..1, length, width
attribute vec4 aD;            // outward x, z, phase, sickness
varying vec3 vW, vN; varying vec4 vC; varying vec2 vD;
void main(){
  float s = aC.x, L = aC.z, ph = aD.z*40.0;
  vec3 o3 = vec3(aD.x, 0.0, aD.y), t3 = vec3(-aD.y, 0.0, aD.x);
  float lob = 0.42 + 0.58*abs(sin(s*L*1.45 + ph)) + 0.12*sin(s*L*4.1 + ph*3.0);
  float w = aC.w*lob*(1.0 - 0.85*s*s*s);
  float s2 = s*s;
  float swO = s2*L*(0.05*sin(uTime*0.72 + ph + s*2.2) + 0.022*sin(uTime*1.37 + ph*1.7 + s*5.0));
  float swT = s2*L*0.035*sin(uTime*0.53 + ph*0.6 + s*3.1);
  float tw = 0.9*sin(ph*2.3 + s*L*0.55) + 0.25*sin(uTime*0.4 + ph);                     // a frond turns a little down its length
  vec3 e3 = t3*cos(tw) + o3*sin(tw), f3 = o3*cos(tw) - t3*sin(tw);
  vec3 p = position + vec3(0.0, -1.0, 0.0)*s*L*(1.0 - 0.04*abs(swO)) + e3*(aC.y*w*0.5) + t3*(swT + 0.12*L*sin(ph*5.0)*s2) + o3*(swO + 0.05*L*s*(1.0 - s));
  vW = p; vN = normalize(f3 + e3*aC.y*0.55 + vec3(0.0, 0.25, 0.0)); vC = aC; vD = aD.zw;
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0);
}`,it=`
${P}
varying vec3 vW, vN; varying vec4 vC; varying vec2 vD;
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 vv = cameraPosition - vW; float dist = length(vv); vec3 v = vv/max(dist, 1e-3);
  float s = vC.x, L = vC.z, lobe = floor(s*L*1.45/3.14159 + vD.x*7.0);
  float tone = 0.8 + 0.4*rwH(vec2(lobe, vD.x*91.0));
  float mid = 1.0 - abs(vC.y);
  float sick = smoothstep(0.46, 0.6, vD.y + (rwH(vec2(lobe, 3.0)) - 0.5)*0.35);
  // thick down the middle rib and where fronds overlap, thin toward the lobes' edges
  float layers = 0.55 + 0.45*rwN(vec2(vC.y*2.2 + vD.x*40.0, s*L*1.3));
  float ed = clamp(abs(vC.y), 0.0, 1.0);
  float thin = clamp((0.06 + 0.94*ed*ed)*layers, 0.0, 1.0);
  float rib = 0.72 + 0.28*smoothstep(0.02, 0.16, ed);
  vec3 col = rwWeed(n, v, thin, sick, 0.4 + 0.6*s)*tone*rib;
  gl_FragColor = vec4(rwAir(col, vW, cameraPosition), 1.0);
}`;function wt(r,h,v={}){const w=v.seg??10,e=h.length,o=new Float32Array(e*(w+1)*2*3),g=new Float32Array(e*(w+1)*2*4),d=new Float32Array(e*(w+1)*2*4),c=[];let a=0;for(let y=0;y<e;y++){const n=h[y],t=(y*.6180339+(v.phase||0))%1,_=a;for(let u=0;u<=w;u++)for(const f of[-1,1])o[a*3]=n[0],o[a*3+1]=n[1],o[a*3+2]=n[2],g[a*4]=u/w,g[a*4+1]=f,g[a*4+2]=n[3],g[a*4+3]=n[6]??.8,d[a*4]=n[4],d[a*4+1]=n[5],d[a*4+2]=t,d[a*4+3]=v.sick??0,a++;for(let u=0;u<w;u++){const f=_+u*2;c.push(f,f+1,f+3,f,f+3,f+2)}}const p=new s.BufferGeometry;p.setAttribute("position",new s.BufferAttribute(o,3)),p.setAttribute("aC",new s.BufferAttribute(g,4)),p.setAttribute("aD",new s.BufferAttribute(d,4)),p.setIndex(c),p.computeBoundingSphere(),p.boundingSphere.radius+=10;const b=I(r,{});return{object:new s.Mesh(p,new s.ShaderMaterial({uniforms:b,vertexShader:rt,fragmentShader:it,side:s.DoubleSide})),uniforms:b,triangles:c.length/3}}const ct=`
${P}
uniform vec2 uWind;
attribute vec4 aO;            // where it leaves the plant (xyz), its own number
attribute vec4 aQ;            // corner x, y; lifetime (s); size (m)
varying vec2 vUv; varying vec3 vW; varying float vA;
void main(){
  float seed = aO.w, life = max(aQ.z, 1.0), tt = uTime/life + seed*7.31, cyc = floor(tt), a = fract(tt), t = a*life;
  float r1 = rwH(vec2(seed*91.7, cyc)), r2 = rwH(vec2(cyc, seed*53.1));
  vec3 p = aO.xyz + vec3((r1 - 0.5)*0.9, (r2 - 0.5)*0.7, (r1*r2 - 0.25)*1.2);
  float taken = t*t/(t + 0.8);                                             // it lets go slowly, then the wind has it
  p += vec3(uWind.x, 0.0, uWind.y)*taken*(0.7 + 0.6*r2) + vec3(sin(t*2.3 + seed*20.0)*0.16*t, 0.22*sin(t*1.7 + seed*40.0) - 0.2*t, cos(t*1.9 + seed*33.0)*0.16*t);
  vec4 mv = viewMatrix*vec4(p, 1.0);
  float size = max(aQ.w*(1.0 - 0.45*a), 1.1*uPx*max(-mv.z, 0.1));
  float rot = t*(2.0 + 3.0*r1) + seed*50.0;
  vec2 c = vec2(aQ.x*cos(rot) - aQ.y*sin(rot), aQ.x*sin(rot) + aQ.y*cos(rot));
  mv.xy += c*size*vec2(1.0, 0.4 + 0.6*abs(sin(t*3.1 + seed*9.0)));          // a flat flake turning: broad, then edge on
  vUv = aQ.xy; vW = p; vA = smoothstep(0.0, 0.06, a)*(1.0 - smoothstep(0.72, 1.0, a));
  gl_Position = projectionMatrix*mv;
}`,lt=`
${P}
varying vec2 vUv; varying vec3 vW; varying float vA;
void main(){
  float r = max(abs(vUv.x), abs(vUv.y)) + 0.35*abs(vUv.x*vUv.y);
  float a = vA*(1.0 - smoothstep(0.7, 1.0, r));
  vec3 col = mix(uWeedSD, uWeedS, 0.8) + 0.25*uSkyRose*clamp(dot(normalize(vW - cameraPosition), uKeyDir), 0.0, 1.0);
  gl_FragColor = vec4(rwAir(col, vW, cameraPosition), a);
}`;function mt(r,h,v={}){const w=v.per??6,e=h.length*w,o=new Float32Array(e*12),g=new Float32Array(e*16),d=new Float32Array(e*16),c=new Uint32Array(e*6),a=v.heights||[4,3,2,1.2,3.4],p=n=>{const t=Math.sin(n*127.1+311.7)*43758.5453;return t-Math.floor(t)};for(let n=0;n<e;n++){const t=h[Math.floor(n/w)],_=p(n+t.seed*17),u=a[t.v]*t.s*(1-.3*t.sick)*(1-.3*t.sick),f=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let C=0;C<4;C++){const W=n*4+C;o[W*3]=t.x,o[W*3+1]=t.y,o[W*3+2]=t.z,g.set([t.x,t.y+u*(.35+.6*p(n*3.7+1)),t.z,_],W*4),d.set([f[C][0],f[C][1],4.5+5*p(n*1.3+5),.035+.075*p(n*2.1+9)],W*4)}c.set([n*4,n*4+1,n*4+2,n*4,n*4+2,n*4+3],n*6)}const b=new s.BufferGeometry;b.setAttribute("position",new s.BufferAttribute(o,3)),b.setAttribute("aO",new s.BufferAttribute(g,4)),b.setAttribute("aQ",new s.BufferAttribute(d,4)),b.setIndex(new s.BufferAttribute(c,1)),e?(b.computeBoundingSphere(),b.boundingSphere.radius+=30):b.boundingSphere=new s.Sphere(new s.Vector3,1);const x=I(r,{uWind:{value:new s.Vector2(...v.wind||[1.5,.45])}}),y=new s.Mesh(b,new s.ShaderMaterial({uniforms:x,vertexShader:ct,fragmentShader:lt,transparent:!0,depthWrite:!1}));return y.renderOrder=5,{object:y,uniforms:x,triangles:e*2}}const ht=`
${P}
attribute vec3 aCol;
attribute vec4 aB;            // the thing's foot (xyz) and how far this corner rocks in the wind, m
varying vec3 vW, vN, vCol;
void main(){
  float ph = aB.x*0.19 + aB.z*0.13;
  float gust = 0.6 + 0.4*sin(uTime*0.33 - aB.x*0.045 - aB.z*0.03);
  vec2 sw = vec2(sin(uTime*0.78 + ph), sin(uTime*0.61 + ph*1.7 + 1.3))*gust;
  vec3 wp = position; wp.xz += sw*aB.w;
  vW = wp; vN = normal; vCol = aCol;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,vt=`
${P}
varying vec3 vW, vN, vCol;
void main(){
  vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0));
  float dist = length(cameraPosition - vW);
  float grain = 0.5 + (rwN3(vW*4.3) - 0.5)*0.6 + (rwN3(vW*17.0 + 7.0) - 0.5)*0.4*(1.0 - smoothstep(4.0, 14.0, dist));
  vec3 col = vCol*(0.75 + 0.5*grain)*(uKeyCol*clamp(dot(n, uKeyDir)*0.8 + 0.2, 0.0, 1.0) + rwAmb(n)*1.5);
  gl_FragColor = vec4(rwAir(col, vW, cameraPosition), 1.0);
}`;async function yt(r,h,v){const w=[],e=[],o=[],g=[],d=()=>new s.Vector3,c=d(),a=d(),p=d(),b=d(),x=d(),y=d(),n=d();let t=null,_=0;const u=k=>{const V=Math.sin((t.seed+1)*127.1+k*311.7)*43758.5453;return V-Math.floor(V)},f=(k,V,z,m)=>{w.push(t.x+k.x,t.y+k.y,t.z+k.z),e.push(x.x,x.y,x.z),o.push(V[0]*z,V[1]*z,V[2]*z),g.push(t.x,t.y,t.z,m)},C=(k,V,z,m,B,A,i,l,M)=>{M||(x.subVectors(V,k).cross(y.subVectors(z,k)).normalize(),x.dot(y.copy(k).add(V).add(z).multiplyScalar(1/3).sub(n))<0&&x.negate()),f(k,m,B,0),f(V,m,A,0),f(z,m,i,l)};for(t of v){const k=t.s,V=t.rot;if(t.k===0){const z=5+Math.floor(u(1)*3);for(let m=0;m<z;m++){const B=V+m*2.399+u(10+m)*.8,A=.2+.75*u(20+m),i=k*(.55+.6*u(30+m)),l=.11*k,M=Math.cos(B),S=Math.sin(B);c.set(M*.07*k-S*l,-.05,S*.07*k+M*l),a.set(M*.07*k+S*l,-.05,S*.07*k-M*l),p.set(M*Math.sin(A)*i,Math.cos(A)*i,S*Math.sin(A)*i),x.set(M*.45,.89,S*.45),C(c,a,p,t.col,.4,.4,.95+.25*u(40+m),.05*i,1)}}else if(t.k===1){const z=k*(.35+.4*u(1)),m=[],B=[];for(let A=0;A<4;A++){const i=V+A*1.5708+(u(10+A)-.5)*.7,l=k*.5*(.7+.6*u(20+A));m.push(d().set(Math.cos(i)*l,-.07*k,Math.sin(i)*l)),B.push(d().set(Math.cos(i+.3)*l*.55,z*(.7+.3*u(30+A)),Math.sin(i+.3)*l*.55))}n.set(0,z*.3,0);for(let A=0;A<4;A++){const i=(A+1)%4,l=.78+.4*u(40+A);C(m[A],m[i],B[i],t.col,l*.8,l*.8,l,0,0),C(m[A],B[i],B[A],t.col,l*.8,l,l,0,0)}C(B[0],B[1],B[2],t.col,1.1,1.1,1.1,0,0),C(B[0],B[2],B[3],t.col,1.1,1.1,1.1,0,0)}else if(t.k===2){const z=k*(.8+.7*u(1)),m=.1+.35*u(2),B=Math.cos(V)*Math.sin(m)*z,A=Math.cos(m)*z,i=Math.sin(V)*Math.sin(m)*z,l=.03+.025*k;for(let M=0;M<2;M++){const S=Math.cos(V+M*1.5708),D=Math.sin(V+M*1.5708);c.set(-S*l,-.05,-D*l),a.set(S*l,-.05,D*l),p.set(B,A,i),x.set(-D*.6,.8,S*.6),C(c,a,p,t.col,.5,.5,.8,.04*z,1)}for(let M=0;M<3;M++){const S=[.5,.78,1][M]-.08*u(10+M),D=V+1+M*2.2+u(20+M),R=k*(.1+.08*u(30+M)),Q=k*(.15+.1*u(40+M)),T=.85+.3*u(50+M),F=.04*z*S;n.set(B*S,A*S,i*S),y.set(Math.cos(D)*R,0,Math.sin(D)*R),b.set(-Math.sin(D)*.5*Q,.86*Q,Math.cos(D)*.5*Q),c.copy(n).sub(y),a.copy(n).add(b),p.copy(n).add(y),x.set(Math.sin(D)*.6,.5,-Math.cos(D)*.6).normalize(),f(c,t.col2,T,F),f(p,t.col2,T,F),f(a,t.col2,T*1.1,F),a.copy(n).sub(b),f(c,t.col2,T,F),f(a,t.col2,T*.8,F),f(p,t.col2,T,F)}}else for(let z=0;z<3;z++){const m=V+z*2.1+u(10+z),B=k*.2*(.3+u(20+z)),A=k*(.22+.2*u(30+z)),i=Math.cos(m)*B,l=Math.sin(m)*B,M=k*(.06+.03*u(40+z)),S=.05*A;x.set(0,1,0),c.set(i*.3-.015,-.04,l*.3),a.set(i*.3+.015,-.04,l*.3),p.set(i,A,l),C(c,a,p,t.col2,.6,.6,1,S,1),n.set(i,A,l),y.set(Math.cos(m+.8)*M,.2*M,Math.sin(m+.8)*M),b.set(-Math.sin(m+.8)*M,.2*M,Math.cos(m+.8)*M),c.copy(n).sub(y),a.copy(n).add(b),p.copy(n).add(y),f(c,t.col,1,S),f(a,t.col,1,S),f(p,t.col,1,S),a.copy(n).sub(b),f(c,t.col,1,S),f(p,t.col,1,S),f(a,t.col,1,S)}++_%300===0&&await r.yield()}const W=new s.BufferGeometry;return W.setAttribute("position",new s.BufferAttribute(new Float32Array(w),3)),W.setAttribute("normal",new s.BufferAttribute(new Float32Array(e),3)),W.setAttribute("aCol",new s.BufferAttribute(new Float32Array(o),3)),W.setAttribute("aB",new s.BufferAttribute(new Float32Array(g),4)),v.length?(W.computeBoundingSphere(),W.boundingSphere.radius+=1):W.boundingSphere=new s.Sphere(new s.Vector3,1),await r.yield(),{object:new s.Mesh(W,new s.ShaderMaterial({uniforms:I(h),vertexShader:ht,fragmentShader:vt,side:s.DoubleSide})),triangles:w.length/9}}export{at as RINGS_GLSL,mt as makeCrumble,wt as makeCurtains,pt as makeGrowth,yt as makeLitter};
