import*as x from"three";const Y=20,ae=1e3,I=[0,100,200,400,600,800,1e3],X=[0,8,12,18,22,22,14],re=I.map((o,e)=>{if(e===0)return(X[1]-X[0])/(I[1]-I[0]);if(e===I.length-1)return(X[e]-X[e-1])/(I[e]-I[e-1]);const t=(X[e]-X[e-1])/(I[e]-I[e-1]),s=(X[e+1]-X[e])/(I[e+1]-I[e]);return t*s<=0?0:(t+s)/2});function he(o){if(o<=0)return 0;if(o>=1e3)return 14;let e=0;for(;o>I[e+1];)e++;const t=I[e+1]-I[e],s=(o-I[e])/t,c=s*s,r=c*s;return(2*r-3*c+1)*X[e]+(r-2*c+s)*t*re[e]+(-2*r+3*c)*X[e+1]+(r-c)*t*re[e+1]}const ce={calm:{A:[.12,.06,.03],L:[38,17,7],K:[.17,.05,.035],g:["#C6F4EA","#34BFB6","#0B5A7A"],horses:0,lip:1.6},breeze:{A:[.28,.16,.08],L:[26,11,5],K:[.19,.06,.07],g:["#BFF2DC","#2FB79A","#0B5A6A"],horses:1,lip:1},swell:{A:[.5,.14,.05],L:[64,21,8],K:[.2,.08,.04],g:["#B4E6F2","#2A9CC0","#083F78"],horses:.35,lip:.8}},fe=[35,50,20].map(o=>o*Math.PI/180),Z=`
uniform float uT;          // the world's clock (s)
uniform vec3 uSun;         // unit vector toward the sun
uniform vec3 uSunC, uFill, uBounce, uHaze;
uniform vec3 uK;           // absorption of the water per metre
uniform vec3 uG0, uG1, uG2; // the water's own glow at the surface, at 6 m and at 22 m
uniform vec4 uWv[3];       // each wave: xy = k * direction, z = omega, w = amplitude
uniform float uSS;         // the three amplitudes summed
uniform float uHorses;     // white horses on top: 0 calm .. 1 breeze
uniform float uLip;        // how much higher the swell stands where it meets the cut (a wave against a sheer edge heaps up)
const float HALF = 20.;
const float HEEL = 0.10;   // the greatest slope a floating thing takes from the swell (rise over run)
// small tools: a hash and a smooth noise of place (no texture), used for the grain of sand, stone, rock and weed
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm2(vec2 p){ return 0.5 * vnoise(p) + 0.25 * vnoise(p * 2.03 + 7.1) + 0.125 * vnoise(p * 4.1 + 3.3) + 0.0625 * vnoise(p * 8.3 + 1.7); }
// the seabed's depth under the level sea, by straight reaches between the surveyed depths (for small things and far shapes)
float bedLin(float x){ return x < 100. ? max(x, 0.) * 0.08 : x < 200. ? 8. + (x - 100.) * 0.04 : x < 400. ? 12. + (x - 200.) * 0.03 : x < 600. ? 18. + (x - 400.) * 0.02 : x < 800. ? 22. : 22. - (min(x, 1000.) - 800.) * 0.04; }
// the heaping of the swell toward a lip: 1 far out at sea, 1 + uLip on the face's own plane
float lipGain(vec2 q){ return 1. + uLip * exp(-max(abs(q.y) - HALF, 0.) / 7.); }
// the foam that lies along a lip (s = -1 the north lip, +1 the south): 0 where its line is broken, 1 where it stands thick; it creeps along the lip
float lipFoam(float x, float s){
  float a = vnoise(vec2(x * 0.42 + uT * 0.21, s * 3.7 + uT * 0.06));
  float b = vnoise(vec2(x * 1.9 - uT * 0.55, s * 9.1 + 4.));
  return smoothstep(0.36, 0.7, 0.62 * a + 0.38 * b);
}
// where along a lip the swell is slopping over at this moment: in bursts some metres long, never the whole lip at once
float slopGust(float x, float s){
  return smoothstep(0.48, 0.7, vnoise(vec2(x * 0.31 + s * 17., uT * 0.45 + s * 5.)));
}

// (2) THE SWELL: one function of place and time
float eta(vec2 q){
  float e = 0.;
  for (int i = 0; i < 3; i++) e += uWv[i].w * sin(dot(uWv[i].xy, q) - uWv[i].z * uT);
  return e * lipGain(q);
}
vec2 etaSlope(vec2 q){
  vec2 g = vec2(0.);
  for (int i = 0; i < 3; i++) g += uWv[i].xy * (uWv[i].w * cos(dot(uWv[i].xy, q) - uWv[i].z * uT));
  return g * lipGain(q);
}
// the swell's own curvature, -1..1 (crests bright: they gather the light)
float etaCurve(vec2 q){
  float c = 0., n = 1e-4;
  for (int i = 0; i < 3; i++) { float kk = dot(uWv[i].xy, uWv[i].xy) * uWv[i].w; c += kk * sin(dot(uWv[i].xy, q) - uWv[i].z * uT); n += kk; }
  return c / n;
}
// (1) WHERE WATER IS: outside the two planes and under the swell (the bed and the rock are solid things)
float inWater(vec3 p){
  return step(HALF, abs(p.z)) * step(p.y, eta(p.xz));
}
// (3) LENGTH OF WATER LOOKED THROUGH from the eye E to a point P in water
float waterLen(vec3 P, vec3 E){
  float s = P.z < 0. ? -1. : 1.;
  float fFace = s * E.z < HALF ? (abs(P.z) - HALF) / max(abs(P.z) - s * E.z, 0.01) : 1.;
  float fTop = E.y > 0. ? -P.y / max(E.y - P.y, 0.01) : 1.;
  return length(P - E) * clamp(min(fFace, fTop), 0., 1.);
}
// the water's own colour at depth d; the south water is lit from behind and carries leaning shafts (k: how much of the shafts
// shows, 1 whole, 0 their mean: far off through the water they run together into one glow, and the level's underside carries none)
vec3 seaGlowK(float d, vec3 P, float k){
  vec3 g = d < 6. ? mix(mix(uG0, uG1, 0.5), uG1, clamp(d / 6., 0., 1.)) : mix(uG1, uG2, clamp((d - 6.) / 16., 0., 1.));
  float south = step(0., P.z);
  if (k <= 0.) return g * 0.66 * mix(1., 1.26, south);               // (their mean alone)
  float sx = P.x + P.y * 0.40;                                       // along a shaft: they lean 68 degrees
  sx += 7. * (vnoise(vec2(sx * 0.045, 2.)) - 0.5);                   // unevenly spaced: no two gaps alike
  float sh = 0.9 + 0.13 * sin(sx * 0.35 + P.z * 0.21 + uT * 0.21) + 0.09 * sin(sx * 1.3 - P.z * 0.6 - uT * 0.33) + 0.07 * sin(sx * 2.9 + P.z * 1.1 + uT * 0.5) * sin(sx * 0.21 - uT * 0.13);
  sh *= 1. + 0.22 * exp(-d * 0.12) * (vnoise(vec2(sx * 0.9 + uT * 0.25, P.z * 0.4)) - 0.5);          // finer and livelier near the top, where the light comes in
  return g * 0.66 * mix(1., mix(1.26, 1.4 * sh, k), south);
}
vec3 seaGlow(float d, vec3 P){ return seaGlowK(d, P, 1.); }
// how much of the shafts is left after W metres of water looked through
float shaftK(float W){ return exp(-W / 90.); }
// the deep water far behind a face, where sight ends: its own colour at depth, lighter and darker reaches of it drifting west on the stream
// (the reaches gather with depth: under the level itself the deep water is one colour)
vec3 deepSeaK(vec3 P, float k){
  float reachW = fbm2(vec2((P.x + 1.2 * uT) * 0.035, P.y * 0.09 + 3.));
  return seaGlowK(max(-P.y, 0.) + 9., P, k) * 0.9 * mix(1., 0.8 + 0.42 * reachW, smoothstep(0.5, 9., -P.y));
}
// (8) THE LIGHT NET at the place q of the surface where a ray of sun came in: bright running lines
float seaNet(vec2 q){
  float c = etaCurve(q);
  vec2 w = q + 0.9 * vec2(sin(q.y * 0.83 + uT * 0.7), sin(q.x * 0.71 - uT * 0.6)) + c * 0.8;
  float a = 1. - abs(sin(w.x * 1.07 + w.y * 0.61 + uT * 0.9));
  float b = 1. - abs(sin(w.x * -0.66 + w.y * 1.21 - uT * 0.75));
  float e = 1. - abs(sin(w.x * 0.37 - w.y * 0.45 + uT * 0.4));
  float l = a * a * a + b * b * b + 0.6 * e * e * e;
  return clamp(l * (0.75 + 0.6 * c), 0., 2.2);
}
// the sun on a dry point of the slot: plain, or come down through the southern water as the net
vec3 slotSun(vec3 P){
  float run = (HALF - P.z) / max(uSun.z, 0.05);          // along the ray toward the sun to the plane z +20
  vec3 H = P + uSun * run;
  float under = step(P.y, 2.) * step(abs(P.z), HALF) * (1. - smoothstep(-0.35, 0.15, H.y - eta(H.xz)));
  float wl = clamp(-H.y, 0., 40.) / max(uSun.y, 0.2);    // the length of water the ray crossed
  vec2 q = H.xz + uSun.xz * wl;
  vec3 through = exp(-uK * wl * 0.6) * (0.45 + 0.8 * seaNet(q));
  return mix(vec3(1.), through, under);
}
// (4) COLOUR OF A THING: dry in the air, or in water by the length of water looked through
vec3 seaShade(vec3 alb, vec3 P, vec3 N, vec3 E){
  float ndl = dot(N, uSun);
  float up = 0.5 + 0.5 * N.y;
  vec3 amb = uFill * (0.6 + 0.4 * N.y) + uBounce * (1. - up);
  vec3 dry = alb * (uSunC * max(ndl, 0.) * slotSun(P) + amb);
  float d = max(-P.y, 0.);
  vec2 q = P.xz + uSun.xz * (d / max(uSun.y, 0.2));
  // the sky's light, too, is taken by the water on its way down: what stands deep stands in a dimmer, bluer light
  vec3 lit = alb * (uSunC * (0.3 + 0.7 * max(ndl, 0.)) * exp(-d * uK / 0.93) * (0.88 + 0.26 * seaNet(q)) + amb * 0.9 * exp(-d * uK * 1.5));
  float W = waterLen(P, E);
  // the north water is lit from the front and keeps a thing's colours deep into it; the south water, lit from behind, takes them sooner
  vec3 T = exp(-W * mix(uK, vec3(uK.g), 0.5) * mix(0.42, 1., step(0., P.z)));
  // a long sight through water gathers the deeper colour: the glow is read some way below the thing's own depth
  vec3 wet = lit * T + seaGlowK(d + 0.3 * W, P, shaftK(W)) * (1. - T);
  wet = mix(wet, deepSeaK(P, shaftK(W)), smoothstep(HALF + 15., HALF + 29., abs(P.z)));          // far behind a face sight ends in the deep water's own colour
  vec3 col = mix(dry, wet, inWater(P));
  float air = length(P - E);
  return mix(col, uHaze, 1. - exp(-air * 0.00058));
}
`,ne=new x.Color;function L(o,e=1){return ne.set(o),[ne.r*e,ne.g*e,ne.b*e]}const Q={long:1.8,wide:.85,bar:.42,deep:.2,step:2.3,rust:L("#7A4326",1),far:30,pixel:553e-6,dot:.25};class se{constructor(){this.p=[],this.n=[],this.c=[],this.m=[],this.M=new x.Matrix4,this.mv=[0,0,0,0],this.wfn=null,this._v=new x.Vector3,this._nm=new x.Matrix3,this.line=null}at(e=0,t=0,s=0,c=0,r=0,f=0){return this.M.makeRotationFromEuler(new x.Euler(f,c,r,"YXZ")).setPosition(e,t,s),this._nm.getNormalMatrix(this.M),this}move(e=0,t=0,s=0,c=0,r=null){return this.mv=[e,t,s,c],this.wfn=r,this}_vert(e,t,s,c,r,f,u){const i=this._v.set(e,t,s),n=this.wfn?this.wfn(e,t,s):this.mv[3];i.applyMatrix4(this.M),this.p.push(i.x,i.y,i.z),i.set(c,r,f).applyMatrix3(this._nm).normalize(),this.n.push(i.x,i.y,i.z),this.c.push(u[0],u[1],u[2]),this.m.push(this.mv[0],this.mv[1],this.mv[2],n)}tri(e,t,s,c,r,f,u){if(!r){const i=t[0]-e[0],n=t[1]-e[1],p=t[2]-e[2],l=s[0]-e[0],m=s[1]-e[1],h=s[2]-e[2];let d=n*h-p*m,b=p*l-i*h,M=i*m-n*l;const a=Math.hypot(d,b,M)||1;r=f=u=[d/a,b/a,M/a]}this._vert(e[0],e[1],e[2],r[0],r[1],r[2],c),this._vert(t[0],t[1],t[2],f[0],f[1],f[2],c),this._vert(s[0],s[1],s[2],u[0],u[1],u[2],c)}quad(e,t,s,c,r){this.tri(e,t,s,r),this.tri(e,s,c,r)}box(e,t,s,c,r,f,u,i=null){const n=e-c/2,p=e+c/2,l=t-r/2,m=t+r/2,h=s-f/2,d=s+f/2;return this.quad([n,l,d],[p,l,d],[p,m,d],[n,m,d],u),this.quad([p,l,h],[n,l,h],[n,m,h],[p,m,h],u),this.quad([p,l,d],[p,l,h],[p,m,h],[p,m,d],u),this.quad([n,l,h],[n,l,d],[n,m,d],[n,m,h],u),this.quad([n,m,d],[p,m,d],[p,m,h],[n,m,h],i||u),this.quad([n,l,h],[p,l,h],[p,l,d],[n,l,d],u),this}skin(e,t,s=!1,c=!1){const r=e.length,f=e[0].length,u=[];for(let n=0;n<r;n++){u.push([]);for(let p=0;p<f;p++){const l=e[Math.max(n-1,0)][p],m=e[Math.min(n+1,r-1)][p],h=e[n][s?(p+f-1)%f:Math.max(p-1,0)],d=e[n][s?(p+1)%f:Math.min(p+1,f-1)],b=m[0]-l[0],M=m[1]-l[1],a=m[2]-l[2],w=d[0]-h[0],y=d[1]-h[1],g=d[2]-h[2];let P=M*g-a*y,S=a*w-b*g,v=b*y-M*w;const k=(Math.hypot(P,S,v)||1)*(c?-1:1);u[n].push([P/k,S/k,v/k])}}const i=s?f:f-1;for(let n=0;n<r-1;n++)for(let p=0;p<i;p++){const l=(p+1)%f,m=typeof t=="function"?t(n,p):t,h=e[n][p],d=e[n+1][p],b=e[n+1][l],M=e[n][l];c?(this.tri(h,b,d,m,u[n][p],u[n+1][l],u[n+1][p]),this.tri(h,M,b,m,u[n][p],u[n][l],u[n+1][l])):(this.tri(h,d,b,m,u[n][p],u[n+1][p],u[n+1][l]),this.tri(h,b,M,m,u[n][p],u[n+1][l],u[n][l]))}return this}bar(e,t,s,c,r,f=6){const u=new x.Vector3(t[0]-e[0],t[1]-e[1],t[2]-e[2]).normalize(),i=new x.Vector3(0,1,0);Math.abs(u.y)>.9&&i.set(1,0,0);const n=new x.Vector3().crossVectors(u,i).normalize(),p=new x.Vector3().crossVectors(n,u),l=(m,h)=>{const d=[];for(let b=0;b<f;b++){const M=b/f*6.2832,a=Math.cos(M)*h,w=Math.sin(M)*h;d.push([m[0]+n.x*a+p.x*w,m[1]+n.y*a+p.y*w,m[2]+n.z*a+p.z*w])}return d};return this.skin([l(e,s),l(t,c)],r,!0,!1)}turn(e,t,s,c,r,f=10,u=1,i=1){const n=c.map(([p,l])=>{const m=[];for(let h=0;h<f;h++){const d=h/f*6.2832;m.push([e+Math.cos(d)*p*u,t+l,s+Math.sin(d)*p*i])}return m});return this.skin(n,r,!0,!1)}ball(e,t,s,c,r,f,u,i=8,n=5){const p=[];for(let l=0;l<=n;l++){const m=-1.5708+3.1416*l/n;p.push([Math.max(Math.cos(m),.02),Math.sin(m)*r])}return this.turn(e,t,s,p,u,i,c,f)}chain(e,t,s,c=.25,r=0){const f=Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2]),u=z=>[e[0]+(t[0]-e[0])*z,e[1]+(t[1]-e[1])*z-r*4*z*(1-z),e[2]+(t[2]-e[2])*z],i=96,n=[0];for(let z=1,A=u(0);z<=i;z++){const T=u(z/i);n.push(n[z-1]+Math.hypot(T[0]-A[0],T[1]-A[1],T[2]-A[2])),A=T}const p=Math.max(2,Math.ceil(n[i]/(c*Q.step))),l=z=>{const A=z*n[i];let T=1;for(;T<i&&n[T]<A;)T++;return u((T-1+(A-n[T-1])/Math.max(n[T]-n[T-1],1e-9))/i)},m=c*Q.long,h=c*Q.wide,d=c*Q.bar,b=c*Q.deep,M=(z,A)=>[[-z,0],[-z*.5,A],[z*.5,A],[z,0],[z*.5,-A],[-z*.5,-A]],a=M(m,h),w=M(m-d*1.25,h-d),y=this.line,g=z=>{const A=this._v.set(z[0],z[1],z[2]).applyMatrix4(this.M);return[A.x,A.y,A.z]};let P=!!y;for(let z=0,A=(Q.far+m)*(Q.far+m);P&&z<=i;z++){const T=g(u(z/i));for(let q=0;q<y.length;q+=3){const C=y[q]-T[0],H=y[q+1]-T[1],G=y[q+2]-T[2];if(C*C+H*H+G*G<=A){P=!1;break}}}const S=(z,A,T,q,C)=>{const H=g(z),G=this._v.set(A,T,q).applyMatrix3(this._nm).normalize(),D=Q.dot*Q.pixel/C;for(let O=0;O<y.length;O+=3){const K=y[O]-H[0],J=y[O+1]-H[1],U=y[O+2]-H[2];if(K*G.x+J*G.y+U*G.z>D*(K*K+J*J+U*U))return!0}return!1},v=new x.Vector3,k=new x.Vector3,F=new x.Vector3,E=new x.Vector3;for(let z=0;z<p;z++){const A=l(z/p),T=l((z+1)/p),q=[(A[0]+T[0])/2,(A[1]+T[1])/2,(A[2]+T[2])/2];v.set(T[0]-A[0],T[1]-A[1],T[2]-A[2]).normalize(),E.set(0,1,0),Math.abs(v.y)>.9&&E.set(1,0,0),k.crossVectors(v,E).normalize(),F.crossVectors(v,k);const C=z%2?k:F,H=z%2?F:k,G=([B,R],W)=>[q[0]+v.x*B+C.x*R+H.x*W,q[1]+v.y*B+C.y*R+H.y*W,q[2]+v.z*B+C.z*R+H.z*W],D=Math.abs(Math.sin(z*12.9898+f*3.7)*43758.5453)%1,O=D>.62?(D-.62)*1.6:0,K=.95+.5*(D*7.3%1),J=[(s[0]*(1-O)+Q.rust[0]*O)*K,(s[1]*(1-O)+Q.rust[1]*O)*K,(s[2]*(1-O)+Q.rust[2]*O)*K],U=(B,R,W,_,V)=>{const ee=(R[1]-B[1])*(W[2]-B[2])-(R[2]-B[2])*(W[1]-B[1]),j=(R[2]-B[2])*(W[0]-B[0])-(R[0]-B[0])*(W[2]-B[2]),$=(R[0]-B[0])*(W[1]-B[1])-(R[1]-B[1])*(W[0]-B[0]),te=ee*V[0]+j*V[1]+$*V[2]>=0?1:-1;P&&!S(B,ee*te,j*te,$*te,Math.max(Math.hypot(R[0]-B[0],R[1]-B[1],R[2]-B[2]),Math.hypot(_[0]-B[0],_[1]-B[1],_[2]-B[2])))||(te>0?this.quad(B,R,W,_,J):this.quad(_,W,R,B,J))};for(let B=0;B<6;B++){const R=(B+1)%6,W=a[B],_=a[R],V=w[B],ee=w[R];U(G(W,b),G(_,b),G(ee,b),G(V,b),[H.x,H.y,H.z]),U(G(W,-b),G(_,-b),G(ee,-b),G(V,-b),[-H.x,-H.y,-H.z]);const j=(W[0]+_[0])/2,$=(W[1]+_[1])/2,te=[v.x*j+C.x*$,v.y*j+C.y*$,v.z*j+C.z*$];U(G(W,b),G(_,b),G(_,-b),G(W,-b),te)}}return this}rope(e,t,s,c=.05,r=1.2,f=7){const u=i=>[e[0]+(t[0]-e[0])*i-r*4*i*(1-i),e[1]+(t[1]-e[1])*i,e[2]+(t[2]-e[2])*i];for(let i=0;i<f;i++)this.bar(u(i/f),u((i+1)/f),c,c,s,4);return this}async geometrySlow(e){const t=new x.BufferGeometry;for(const[s,c,r]of[["position",this.p,3],["normal",this.n,3],["color",this.c,3],["aMove",this.m,4]])t.setAttribute(s,new x.BufferAttribute(new Float32Array(c),r)),await e.yield();return t.boundingSphere=new x.Sphere(new x.Vector3(500,0,0),6e3),t}geometry(){const e=new x.BufferGeometry;return e.setAttribute("position",new x.BufferAttribute(new Float32Array(this.p),3)),e.setAttribute("normal",new x.BufferAttribute(new Float32Array(this.n),3)),e.setAttribute("color",new x.BufferAttribute(new Float32Array(this.c),3)),e.setAttribute("aMove",new x.BufferAttribute(new Float32Array(this.m),4)),e.boundingSphere=new x.Sphere(new x.Vector3(500,0,0),6e3),e}}const N={bell:1.5,high:1.25,mane:11,beat:5.2,rise:.35,drift:[1.5,71,.3,97]},ue=o=>{const e=Math.min(1,Math.max(0,o/.26)),t=Math.min(1,Math.max(0,(o-.26)/.69));return e*e*(3-2*e)*(1-t*t*(3-2*t))};function ge(o){const e=(o/N.beat%1+1)%1,t=Math.min(1,Math.max(0,(e-.1)/.35)),s=Math.min(1,Math.max(0,(e-.45)/.55));return[N.drift[0]*Math.sin(6.2832*o/N.drift[1]+1.3),N.rise*(t*t*(3-2*t)*(1-s*s*(3-2*s))-.4),N.drift[2]*Math.sin(6.2832*o/N.drift[3]),ue(e)]}const pe=`
attribute vec4 aMove;
varying vec3 vP, vN, vC, vQ;
vec3 moved(vec3 wp, inout vec3 wn, vec4 mv, mat4 mm){
  float kind = mv.z;
  vec3 piv = (mm * vec4(mv.x, 0., mv.y, 1.)).xyz;
  if (kind > 0.5 && kind < 1.5) {                       // rides the swell at its mooring, tilting with the slope
    vec2 g = etaSlope(piv.xz) * mv.w; vec3 r = wp - piv;
    g *= min(1., HEEL / max(length(g), 1e-4));          // a moored thing heels with the slope, never past HEEL (its keel and its mooring hold it)
    wp.y += eta(piv.xz) * mv.w + dot(g, r.xz); wp.xz -= g * r.y;
    wn = normalize(wn + vec3(-g.x * wn.y, dot(g, wn.xz), -g.y * wn.y));
  } else if (kind > 1.5 && kind < 2.5) {                // weed: leans west with the stream and sways
    float ph = piv.x * 0.37 + piv.z * 0.53, per = 5. + 4. * fract(ph * 0.61);
    float h = mv.w;
    wp.x -= h * (0.16 + 0.012 * h) + 0.07 * h * sin(uT * 6.2832 / per + ph + h * 0.25);
    wp.z += 0.035 * h * sin(uT * 6.2832 / (per * 1.3) + ph * 1.7 + h * 0.2);
    wp.y -= 0.01 * h * h;
  } else if (kind > 2.5 && kind < 3.5) {                // cloth in the breeze
    wp.y += mv.w * 0.11 * sin(uT * 5.2 + wp.x * 1.7 + wp.z * 1.3);
    wp.x += mv.w * 0.05 * sin(uT * 3.9 + wp.z * 2.1);
  } else if (kind > 3.5 && kind < 4.5) {                // a bather: bobs on the swell, legs treading
    wp.y += eta(piv.xz) * 0.8;
    float sw = sin(uT * 6.2832 / 1.1 + piv.x * 1.9);
    wp.x += mv.w * 0.5 * sw; wp.y += abs(mv.w) * 0.18 * (0.5 + 0.5 * sw * sign(mv.w));
  } else if (kind > 4.5 && kind < 5.5) {                // an oar: rides with its boat, the blade dipping and sweeping
    wp.y += eta(piv.xz) + mv.w * 0.55 * sin(uT * 2.1 + piv.x);
    wp.x += mv.w * 0.8 * cos(uT * 2.1 + piv.x);
  } else if (kind > 6.5 && kind < 7.5) {                // a swimmer going round and round a fixed place at the sea's top: w = the seconds of one round (its sign the way round)
    float a = 6.2832 * uT / mv.w + piv.x * 0.7 + piv.z * 0.4, c = cos(a), s = sin(a);
    vec3 r = wp - piv;
    wp.xz = piv.xz + vec2(c * r.x + s * r.z, c * r.z - s * r.x);
    wn = vec3(c * wn.x + s * wn.z, wn.y, c * wn.z - s * wn.x);
    wp.y += eta(wp.xz) * 0.9;
  } else if (kind > 8.5 && kind < 9.5) {                // a far sail making way round a long closed loop about its pivot: w = half the loop's length east and west (m; its sign the way round); the loop is 12 m wide north and south
    float A = abs(mv.w), ph = piv.x * 0.7 + piv.z * 0.4;
    float a = sign(mv.w) * 1.5 * (1.6 + fract(ph * 0.37)) / A * uT + ph;      // 2.4 to 3.9 m/s along the long sides, slow round the ends where she goes about
    vec2 c = piv.xz + vec2(A * cos(a), 6. * sin(a));
    vec2 f = normalize(vec2(-A * sin(a), 6. * cos(a))) * sign(mv.w);     // her head lies along her course
    vec3 r = wp - piv;
    wp.xz = c + f * r.x + vec2(-f.y, f.x) * r.z;
    wn = vec3(f.x * wn.x - f.y * wn.z, wn.y, f.y * wn.x + f.x * wn.z);
    wp.y += eta(c) * 0.9;
  } else if (kind > 11.5) {                             // a seal hauled out on dry rock: w = how far toward its nose a corner lies from its shoulders (the pivot), 0 to 1: for something under half of every 13 to 22 seconds it lifts its head and looks slowly round, each seal at its own moment; w under 0 = how far out along a fore flipper that waves
    float ph = piv.x * 0.7 + piv.z * 0.4, per = 13. + 9. * fract(ph * 0.61);
    float lift = smoothstep(0.25, 0.85, sin(uT * 6.2832 / per + ph * 3.));
    if (mv.w > 0.) {
      float k = mv.w, a = 0.45 * k * lift * sin(uT * 6.2832 / (per * 0.31) + ph), c = cos(a), s = sin(a);
      vec3 r = wp - piv;
      wp.xz = piv.xz + vec2(c * r.x + s * r.z, c * r.z - s * r.x);
      wn = vec3(c * wn.x + s * wn.z, wn.y, c * wn.z - s * wn.x);
      wp.y += 0.3 * k * k * lift;
    } else if (mv.w < 0.) {
      float burst = smoothstep(0.3, 0.8, sin(uT * 6.2832 / (per * 0.7) + ph * 5.));
      wp.y += -mv.w * burst * (0.22 + 0.14 * sin(uT * 4.4 + ph));
    }
  } else if (kind > 9.5) {                              // the great jellyfish (JELLY): its bell beats, drawing in at the rim; what hangs from it takes the beat a moment later and streams west, rippling; the whole of it rides its beat and wanders about its station. w = minus the metres a corner hangs below the bell's rim (0 on the bell)
    float h = max(-mv.w, 0.);
    vec2 rr = wp.xz - piv.xz; float s = min(length(rr) / ${N.bell.toFixed(2)}, 1.);
    float bt = fract((uT - 0.22 * h) / ${N.beat.toFixed(2)});
    float p = smoothstep(0., 0.26, bt) * (1. - smoothstep(0.26, 0.95, bt)) * exp(-h / 3.5);
    wp.xz = piv.xz + rr * (1. - 0.26 * pow(s, 1.5) * p);
    wp.y += p * (0.2 * (1. - s) - 0.24 * s);
    float ph = (kind - 10.) * 16., hh = pow(h, 0.7);         // (each hair and each arm ripples as one: its own phase rides in the kind's fraction)
    wp.x -= 0.10 * h + 0.004 * h * h - 0.15 * hh * sin(uT * 0.9 - 0.42 * h + ph);
    wp.z += 0.11 * hh * sin(uT * 0.7 - 0.37 * h + ph * 1.7);
    float b0 = fract(uT / ${N.beat.toFixed(2)});
    wp.y += ${N.rise.toFixed(2)} * (smoothstep(0.1, 0.45, b0) * (1. - smoothstep(0.45, 1., b0)) - 0.4);
    wp.x += ${N.drift[0].toFixed(2)} * sin(6.2832 * uT / ${N.drift[1].toFixed(1)} + 1.3); wp.z += ${N.drift[2].toFixed(2)} * sin(6.2832 * uT / ${N.drift[3].toFixed(1)});
  } else if (kind > 7.5) {                              // a ball tossed to and fro along a lip: w = half the throw (m); it rises 1.2 m on the way
    float sn = sin(uT * 1.7 + piv.x * 1.3);
    wp.x += mv.w * sn; wp.y += 1.2 * (1. - sn * sn);
  } else if (kind > 5.5) {                              // a kite on its string: it weaves about its station, more the higher up the string; its tail streams and ripples
    float ph = piv.x * 0.9 + piv.z * 1.3, f = min(mv.w, 1.), tail = max(mv.w - 1., 0.);
    f *= f;
    wp.x += f * (1.5 * sin(uT * 0.52 + ph) + 0.6 * sin(uT * 1.31 + ph * 2.));
    wp.z += f * 1.3 * sin(uT * 0.41 + ph * 1.7);
    wp.y += f * 0.9 * sin(uT * 0.67 + ph * 0.6) + tail * 0.15 * sin(uT * 4.6 - tail * 2.4 + ph);
    wp.z += tail * 0.11 * sin(uT * 3.7 - tail * 2.1 + ph);
  }
  return wp;
}
`,me=`
varying vec3 vP, vN, vC, vQ;
`,de=`
        // THE SECOND PAINTING's law, first of all (what it does not paint costs no more than this)
        float overA;
        { vec3 E = cameraPosition; float sg = P.z < 0. ? -1. : 1.;
          // F: where the sight from the eye to this point meets the plane of the face before it
          float tF = clamp((HALF - sg * E.z) / max(abs(P.z) - sg * E.z, 1e-3), 0., 1.); vec3 F = E + (P - E) * tF;
          // Only a sight that meets the face under its lip; only a point out of the water. (0.3 m is allowed at the lip, and under the
          // swell's own height at the point for a sight that rises to it: the top's skin is laid in panels some metres long and does
          // not follow the swell to the centimetre, and a seam of ceiling would show along every waterline. A sight that falls to
          // the point has no such allowance: what it finds under the swell's height lies under the top, seen from above.)
          if (abs(P.z) <= HALF || F.y >= eta(F.xz) + 0.3 || P.y <= eta(P.xz) - (P.y > E.y ? 0.3 : 0.)) discard;
          // X: where the sight leaves the water by the underside, reckoned at the level (y 0) and never before the face's plane (for an
          // eye in the swell's own height the lip's crest may stand in the sight: there X is F)
          vec3 X = E + (P - E) * (P.y > E.y ? clamp(-E.y / (P.y - E.y), tF, 1.) : tF);
          float behind = max(abs(X.z) - HALF, 0.); if (X.x < -8. || X.x > ${ae.toFixed(1)}) discard;   // (the see-through strip of the top)
          vec3 T = exp(-waterLen(X, E) * uK);
          float v = 0.94 * (1. - smoothstep(4., 15., behind)) * T.g;                 // what was let through before the window
          float win = smoothstep(0.20, 0.50, abs(P.y - E.y) / length(P - E));       // the window's own figures, for the same sight
          overA = v * (1. - win) / max(1. - v * win, 1e-3);                         // (the window's share and this one together make v)
          if (overA < 0.004) discard; }`,ve=`
        gl_FragColor.a = overA;`;function we(o,e,t=s=>s){const s=o.attributes.position.array,c=o.attributes.aMove.array,r=[],f=i=>{const n=t(s[i*3+2]),p=t(c[i*4+1]);return s[i*3+1]>-.05-e(Math.round(c[i*4+2]),c[i*4+3],Math.hypot(s[i*3]-c[i*4],s[i*3+2]-c[i*4+1]),Math.abs(n)<Math.abs(p)?n:p)};for(let i=0;i<s.length/3;i+=3)(f(i)||f(i+1)||f(i+2))&&r.push(i,i+1,i+2);const u=new x.BufferGeometry;for(const i in o.attributes)u.setAttribute(i,o.attributes[i]);return u.setIndex(r),u.boundingSphere=o.boundingSphere,u}function ze(o,e={}){const t=ce[e.state||"calm"],s=e.sun||new x.Vector3(0,.866,.5),c=(l,m=1)=>new x.Color(l).multiplyScalar(m),r=t.A.map((l,m)=>{const h=6.2832/t.L[m],d=fe[m];return new x.Vector4(h*Math.cos(d),-h*Math.sin(d),Math.sqrt(9.81*h),l)}),f=t.A[0]+t.A[1]+t.A[2],u={uT:{value:0},uSun:{value:s.clone().normalize()},uSunC:{value:c("#FFF6E4",1.3)},uFill:{value:c("#8CC8EE",.52)},uBounce:{value:c("#D9C29A",.34)},uHaze:{value:c("#CFE6F2")},uK:{value:new x.Vector3(t.K[0]*.45,t.K[1]*.65,t.K[2]*.75)},uG0:{value:c(t.g[0])},uG1:{value:c(t.g[1])},uG2:{value:c(t.g[2])},uWv:{value:r},uSS:{value:f},uHorses:{value:t.horses},uLip:{value:t.lip},uSkyZ:{value:c("#3F8FD8")},uSkyH:{value:c("#A9D2EE")},uMole:{value:new x.Vector3(e.mole?e.mole[0]:-9e3,e.mole?e.mole[1]:1,e.mole?e.mole[2]:1)}},i=t.A.reduce((l,m,h)=>l+m*6.2832/t.L[h],0);return{uniforms:u,solid:(l={})=>new x.ShaderMaterial({uniforms:Object.assign({},u),side:x.DoubleSide,vertexColors:!0,...l.over?{transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:-1}:{},vertexShader:Z+pe+(l.head||"")+`
      void main(){
        vec3 wp = (modelMatrix * vec4(position, 1.)).xyz; vec3 wn = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.)); vec3 col = color;
        ${l.place||"wp = moved(wp, wn, aMove, modelMatrix);"}
        vP = wp; vN = wn; vC = col; vQ = position;
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`,fragmentShader:Z+me+`
      void main(){
        vec3 N = vN / max(length(vN), 1e-4); vec3 alb = vC; vec3 P = vP; vec3 Q = vQ;
        ${l.over?de:""}
        // every skin has a grain of its own, read at the thing's resting place so it rides with what moves
        vec2 gq = abs(N.y) > 0.6 ? Q.xz : (abs(N.x) > abs(N.z) ? Q.zy : Q.xy);
        float grain = vnoise(gq * 5.) * 0.6 + vnoise(gq * 19.) * 0.4;
        float nearG = 1. / (1. + length(P - cameraPosition) * 0.03);
        ${l.albedo||"alb *= 1. + (grain - 0.5) * 0.22 * nearG;"}
        vec3 c = seaShade(alb, P, N, cameraPosition);
        ${l.after||""}
        // where the sea's top meets a thing the water clings to it: a broken line of foam that comes and goes with the swell
        float etaP = eta(P.xz);
        float lap = 0.35 + 0.65 * smoothstep(0.3, 0.7, vnoise(vec2(P.x + P.z, P.x - P.z) * 1.7 + vec2(uT * 0.6, -uT * 0.45)));
        float line = step(HALF, abs(P.z)) * (1. - smoothstep(0.02, 0.10 + 0.1 * lap, abs(P.y - etaP))) * lap * ${l.noLine?"0.":"1."};
        gl_FragColor = vec4(mix(c, vec3(1.25), line * 0.8), 1.);
        ${l.over?ve:""}
      }`}),bare:(l,m,h,d)=>{const b=1+t.lip*Math.exp(-Math.max(Math.abs(d)-Y,0)/7),M=f*b,a=i*b;return l===1?m>.99?Math.min(1.1*a*h,2*M+.1*h):m*Math.min(a*h,2*M)+Math.min(m*a,.1)*h+(1-m)*M:l===4?.2*M+.18*Math.abs(m)+.1:l===5?Math.min(1.1*a*h,2*M+.1*h)+.55*Math.abs(m):l===7?M:l===9?-1e9:0},sun:u.uSun.value}}async function Me(o,e,t){const s=[],c=[];for(let g=-8;g<=ae+.01;g+=2)s.push(g);for(let g=ae+3,P=3;g<4200;P*=1.45,g+=P)s.push(g);for(let g=Y;g<=60.01;g+=2.5)c.push(g);for(let g=64,P=4;g<4200;P*=1.5,g+=P)c.push(g);const r=s.length,f=c.length,u=[],i=[],n=[],p=[],l=c.filter(g=>g<Y+30-.01).length;for(const g of[-1,1]){const P=u.length/3;for(let S=0;S<f;S++)for(let v=0;v<r;v++)u.push(s[v],0,g*c[S]),i.push(t(s[v],g*c[S]));for(let S=0;S<f-1;S++)for(let v=0;v<r-1;v++){const k=P+S*r+v,F=k+1,E=k+r,z=E+1,A=S<l&&s[v]>=-8&&s[v]<ae?p:n;g>0?A.push(k,E,F,F,E,z):A.push(k,F,E,F,z,E)}await o.yield()}const m=s.findIndex(g=>g>ae+60),h=u.length/3;for(let g=m;g<r;g++)u.push(s[g],0,-Y,s[g],0,Y),i.push(20,20);for(let g=0;g<r-m-1;g++){const P=h+g*2;n.push(P,P+1,P+2,P+1,P+3,P+2)}const d=new x.BufferGeometry;d.setAttribute("position",new x.BufferAttribute(new Float32Array(u),3)),d.setAttribute("aDepth",new x.BufferAttribute(new Float32Array(i),1)),d.setIndex(new x.BufferAttribute(new Uint32Array(n),1)),d.boundingSphere=new x.Sphere(new x.Vector3(500,0,0),6e3);const b=new x.BufferGeometry;b.setAttribute("position",d.getAttribute("position")),b.setAttribute("aDepth",d.getAttribute("aDepth")),b.setIndex(new x.BufferAttribute(new Uint32Array(p),1)),b.boundingSphere=d.boundingSphere;const M=g=>new x.ShaderMaterial({uniforms:Object.assign({},e.uniforms,{uSee:{value:g}}),side:x.DoubleSide,transparent:g>0,depthWrite:g===0,vertexShader:Z+`
      attribute float aDepth; varying vec3 vP; varying float vD;
      void main(){ vec3 wp = position; wp.y = eta(wp.xz); vP = wp; vD = aDepth; gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.); }`,fragmentShader:Z+`
      uniform vec3 uSkyZ, uSkyH; uniform vec3 uMole; uniform float uSee; varying vec3 vP; varying float vD;
      float rip(vec2 q, float t){ return sin(q.x * 1.9 + q.y * 0.7 + t * 1.3) + sin(q.x * -0.8 + q.y * 2.3 - t * 1.1) + 0.6 * sin(q.x * 3.7 - q.y * 2.9 + t * 1.9); }
      void main(){
        vec3 E = cameraPosition; vec3 P = vP; vec3 V = (E - P) / max(length(E - P), 1e-3);
        float dist = length(E - P);
        vec2 g = etaSlope(P.xz);
        float fade = 1. / (1. + dist * 0.05);
        vec2 rg = vec2(rip(P.xz + vec2(0.3, 0.), uT) - rip(P.xz - vec2(0.3, 0.), uT), rip(P.xz + vec2(0., 0.3), uT) - rip(P.xz - vec2(0., 0.3), uT)) * 0.055 * fade;
        vec3 N = normalize(vec3(-g.x - rg.x, 1., -g.y - rg.y));
        float e = eta(P.xz);
        float horse = uHorses * smoothstep(0.45 * uSS, 0.95 * uSS, e + 0.25 * uSS * rip(P.xz * 0.6, uT * 0.5) * 0.4) * (0.55 + 0.45 * sin(P.x * 2.3 + P.z * 3.1 + rip(P.xz, uT)));
        horse *= smoothstep(0.3, 0.72, vnoise(P.xz * vec2(0.5, 0.85) + vec2(uT * 0.35, -uT * 0.2)));          // the white breaks in patches, not in bands
        // seen near, a patch of white is small flecks and short curls of foam sliding on the ripples; further off it is broken water; far off one soft patch
        vec2 fpx = fwidth(P.xz); float span = max(fpx.x, fpx.y);                  // how much sea one dot of the picture covers here
        vec2 fq = P.xz + 0.22 * vec2(rip(P.zx * 1.3 + 2., uT * 0.8), rip(P.xz * 1.1, uT * 0.7));
        float env = clamp(horse, 0., 1.);
        float fl = 0.6 * vnoise(fq * vec2(3.4, 4.6) + vec2(uT * 0.3, 0.)) + 0.4 * vnoise(fq * 10.5 - vec2(0., uT * 0.45)) * (1. - smoothstep(0.03, 0.14, span));
        float thr = mix(0.74, 0.57, env);
        float lace = 1. - smoothstep(0.012, 0.05, abs(fl - 0.47));                       // thin curls of foam along the ripples
        float fleck = max(smoothstep(thr, thr + 0.1, fl), 0.75 * lace * smoothstep(0.2, 0.6, env)) * smoothstep(0.04, 0.3, env);
        float broke = smoothstep(0.36, 0.5, vnoise(fq * vec2(1.1, 1.7) + vec2(uT * 0.3, -uT * 0.15))) * sqrt(env);
        horse = mix(env, mix(broke, fleck, 1. - smoothstep(0.07, 0.4, span)), 1. - smoothstep(0.25, 1.4, span));
        vec3 col; float alpha = 1.;
        if (gl_FrontFacing) {
          // (a ruffled sea seen low and far shows the sky from well up, not the pale rim of it: its small faces lean toward the eye)
          float cosv = clamp(dot(N, V), 0., 1.); float f = 1. - cosv; float fres = min(0.03 + 0.97 * f * f * f * f * f, 0.62);
          vec3 R = reflect(-V, N); float up = clamp(R.y + 0.2, 0., 1.);
          vec3 sky = mix(uSkyH, uSkyZ, sqrt(up));
          float dd = clamp(vD, 0., 30.);
          vec3 body = mix(uG1 * 0.74, uG2 * 0.92, smoothstep(0.6, 10., dd)) * (0.5 + 0.25 * cosv);          // deep water's own colour, from a metre of depth on
          body = mix(body, vec3(0.62, 0.55, 0.36) * exp(-uK * dd * 2.) + uG1 * 0.5, (1. - smoothstep(0.1, 1.4, dd)) * 0.7);
          float sp = clamp(dot(R, uSun), 0., 1.); float sp2 = sp * sp; sp2 *= sp2; sp2 *= sp2; sp2 *= sp2; sp2 *= sp2; sp2 *= sp2;
          col = mix(body, sky, fres) + uSunC * sp2 * sp2 * 2.2;
          col = mix(col, vec3(1.15), clamp(horse, 0., 1.) * 0.85);
          // along each lip a shoulder of lit water 1.4 m broad: the light comes in through the face there as well, so the top is paler and
          // greener; where the lip's foam is broken the dark top and the face then do not meet in a ruled seam
          float shl = (1. - smoothstep(0.05, 1.4, abs(P.z) - HALF)) * step(-1., P.x) * step(P.x, 1001.);
          col = mix(col, uG1 * 0.9 + 0.3 * sky, 0.6 * shl);
          // the white along each lip: foam, not a ruled line: its breadth and its strength change along the lip and it is broken in places
          float sgn = P.z < 0. ? -1. : 1., lf = lipFoam(P.x, sgn);
          float lw = 0.05 + 0.5 * lf * (0.35 + 0.65 * vnoise(vec2(P.x * 3.3 - uT * 0.7, sgn * 2. + uT * 0.3)));
          float lip = step(-1., P.x) * step(P.x, 1001.) * (1. - smoothstep(lw * 0.4, lw, abs(P.z) - HALF));
          col = mix(col, vec3(1.2), lip * (0.25 + 0.6 * lf) * (0.6 + 0.4 * smoothstep(0.3 * uSS, 0.9 * uSS, e)));
          col = mix(col, uHaze, 1. - exp(-dist * 0.00058));
          // close to a lip the water is seen into from above, a little: a keel, a chain's first links
          // where the sea washes the breakwater's stone: broken foam along both its sides and round its ends, broader toward a lip (within
          // 10 m of it), where the swell that runs along the stone piles into the corner and breaks
          vec2 md = abs(P.xz - vec2(uMole.x, 0.)) - uMole.yz;
          float mdist = length(max(md, 0.)) + min(max(md.x, md.y), 0.);
          float nearLip = 1. - smoothstep(1., 10., abs(P.z) - HALF);
          float wash = (1. - smoothstep(0.1, 1.7 + 4.2 * nearLip + 1.3 * rip(P.xz * 0.45, uT * 0.8) * 0.3, mdist)) * step(0., mdist) * step(HALF, abs(P.z));
          wash *= smoothstep(-1.4, 1.2, rip(P.xz * 1.9, uT * 1.4) + 1.5 * (1. - mdist));
          // the same white round the seal reef's rock, by the rock's plan (it thins away inward over the low rim the crests wash)
          float rkr = length(vec2((P.x - 875.) / 30., (P.z + 35.) / 12.)), rkd = (rkr - 0.56) * 14.;
          float rwash = (1. - smoothstep(0.1, 1.5 + 1.3 * rip(P.xz * 0.45, uT * 0.8) * 0.3, rkd)) * smoothstep(-3.5, -1.5, rkd);
          rwash *= smoothstep(-1.4, 1.2, rip(P.xz * 1.9, uT * 1.4) + 1.5 * (1. - rkd));
          wash = max(wash, rwash);
          col = mix(col, vec3(1.15), clamp(wash, 0., 1.) * 0.8);
          float seeIn = (1. - fres) * (1. - smoothstep(HALF + 4., HALF + 13., abs(P.z))) * (1. - clamp(horse, 0., 1.)) * (1. - lip) * (1. - clamp(wash, 0., 1.));
          // ONE LAW FOR THE WHOLE TOP, wherever a lip stands: seen from above, a level is clear only where the sight meets it steeply; met
          // low it is the sea's own face. V.y is the sine of the sight's angle to the level: at 0.14 (8 degrees) and under, the top is
          // closed; from 0.38 (22 degrees) up it is as clear as it was; between, it eases. Reckoned from the eye's place and this point
          // alone: never from where the lens looks, the flight or the clock. The window from below is the other branch and is untouched.
          seeIn *= smoothstep(0.14, 0.38, V.y);
          alpha = 1. - 0.5 * seeIn * (1. - clamp(sp2 * sp2 * 2., 0., 1.));
        } else {
          // from under: the water's own colour, gathered along the sight, with the swell's slopes running through it as soft light.
          // Near a face the sight through the water is short, so where the sight is steep (the window, below) the sky and a hull's
          // topsides show through it, tinted; further in the water closes over them.
          float W = waterLen(P, E);
          vec3 T = exp(-W * uK);
          // the underside is level water in small facets: each tips a little light or a little dark toward the eye as the ripples run,
          // finer and closer together toward the far lip, so it lies flat and level
          float facet = rip(P.xz * 1.45 + 3., uT * 1.1) * 0.075 + rip(P.xz * 3.7, uT * 1.6) * 0.04 * fade * 4.;
          float dap = clamp(0.88 + 0.26 * seaNet(P.xz * 0.8) + 1.6 * dot(g, uSun.xz) + facet, 0.55, 1.6);
          col = seaGlowK(0.5 + 0.3 * W, P, 0.) * dap;
          // further behind the face the underside is lost in the deep water's own colour, as everything there is
          col = mix(col, deepSeaK(vec3(P.x, 0., P.z), 0.), smoothstep(HALF + 7., HALF + 28., abs(P.z)));
          col = mix(col, uHaze, 1. - exp(-dist * 0.00058));                          // (the air between, as on the backdrop it meets and on every thing)
          float clear = 1. - smoothstep(4., 15., abs(P.z) - HALF);
          // THE WINDOW: from below a level is clear only where the sight meets it steeply, and a mirror where it meets it low. The
          // underside is as clear as it was where the sight from the eye to this point rises more than 30 degrees (its sine 0.50), closed to
          // the silver ceiling (but for its darker facets, up to 13.5 parts in 100 clear, as they were) where it rises less than about
          // 12 (sine 0.20), and even between: so far down the street no sky stands in the walls, and what stands steeply over the
          // eye is seen through. It is reckoned from the eye's place and this point alone, as light is: never from where the lens looks,
          // the flight's progress or the clock; the same on every seed and at every pace. (What floats is painted again through the
          // closed ceiling: THE SECOND PAINTING, above.)
          float win = smoothstep(0.20, 0.50, abs(V.y));
          alpha = clamp(1. - 0.94 * clear * T.g * win + 0.3 * (dap - 1.), 0.05, 1.);
        }
        gl_FragColor = vec4(col, mix(1., alpha, uSee));
      }`}),a=new x.Group;a.name="sea-top";const w=new x.Mesh(d,M(0));w.frustumCulled=!1,a.add(w);const y=new x.Mesh(b,M(1));return y.frustumCulled=!1,y.renderOrder=4,a.add(y),a}async function Pe(o,e){const t=new x.Group,s=(u,i,n,p)=>{const l=[],m=[],h=[];for(let b=0;b<=n;b++)for(let M=0;M<=i;M++){const a=(p?-8:0)+(ae+(p?68:0))*M/i,w=b/n;l.push(a,-he(a)*(1-w)-(p?.5*(1-w):0),u),m.push(w)}for(let b=0;b<n;b++)for(let M=0;M<i;M++){const a=b*(i+1)+M,w=a+1,y=a+i+1,g=y+1;h.push(a,w,y,w,g,y)}const d=new x.BufferGeometry;return d.setAttribute("position",new x.BufferAttribute(new Float32Array(l),3)),d.setAttribute("aTop",new x.BufferAttribute(new Float32Array(m),1)),d.setIndex(h),d.boundingSphere=new x.Sphere(new x.Vector3(500,-10,u),600),d},c=Z+`
    attribute float aTop; varying vec3 vP;
    void main(){ vec3 wp = position; float e = eta(wp.xz); wp.y += e * aTop * aTop; vP = wp; gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.); }`,r=new x.ShaderMaterial({uniforms:e.uniforms,side:x.DoubleSide,vertexShader:c,fragmentShader:Z+`
      varying vec3 vP;
      float weed(vec2 p, float sc, float hmax, float sd){
        float xs = (p.x + 0.15 * p.y + 0.03 * p.y * sin(uT * 0.45 + p.x * 0.21 + sd)) * sc;
        float i = floor(xs), r = h21(vec2(i, sd)), f = abs(fract(xs) - 0.5 + (r - 0.5) * 0.5);
        float hgt = hmax * (0.3 + 0.7 * r) * step(0.3, h21(vec2(i, sd + 3.)));
        float w = 0.09 + 0.13 * (0.5 + 0.5 * sin(p.y * 2.1 + i * 5.));
        return (1. - smoothstep(w * 0.45, w, f)) * (1. - smoothstep(hgt * 0.75, hgt + 0.01, p.y));
      }
      void main(){
        float D = bedLin(vP.x); float hb = max(vP.y + D, 0.);
        vec3 c = deepSeaK(vP, smoothstep(0.3, 4., -vP.y) * shaftK(waterLen(vP, cameraPosition)));   // the shafts begin under the level and run together far off through the water
        float rise = 1. - smoothstep(0., 1., hb - 1.2 - 3.2 * fbm2(vec2(vP.x * 0.045, 4.)));
        float grove = smoothstep(0.36, 0.62, fbm2(vec2(vP.x * 0.045, 9.)));                    // it stands in groves, open water between
        float far = (weed(vec2(vP.x, hb), 0.55, 0.62 * D, 1.) * 0.26 + weed(vec2(vP.x + 40., hb), 0.9, 0.42 * D, 7.) * 0.16) * grove;
        c *= (1. - min(far, 0.45)) * (1. - 0.14 * rise);
        gl_FragColor = vec4(mix(c, uHaze, 1. - exp(-length(vP - cameraPosition) * 0.00058)), 1.);
      }`}),f=new x.ShaderMaterial({uniforms:e.uniforms,side:x.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:c,fragmentShader:Z+`
      uniform vec3 uMole; varying vec3 vP;
      void main(){
        vec3 P = vP; float e = eta(P.xz); float d = max(e - P.y, 0.);
        float sgn = P.z < 0. ? -1. : 1., lf = lipFoam(P.x, sgn);
        float nick = 0.5 + 0.5 * smoothstep(0.3, 0.6, vnoise(vec2(P.x * 1.3 - uT * 0.5, sgn * 5.)));
        float men = (1. - smoothstep(0.02, 0.05 + 0.22 * lf * nick, d)) * (0.4 + 0.6 * lf * nick);   // the bright edge at the lip: a thread here, a hand's breadth there, broken in places
        float SL = uSS * (1. + uLip);                                           // the swell's reach on the face's own plane
        float high = smoothstep(0.45 * SL, 0.9 * SL, e);
        // the foam a crest carries under the lip: a short ragged fringe that slides down and breaks up
        float rag = vnoise(vec2(P.x * 4.3 + uT * 0.4, d * 7. - uT * 1.3));
        float foam = high * (1. - smoothstep(0.08, 0.2 + (0.2 + 0.35 * uHorses) * lf, d)) * smoothstep(0.34, 0.62, rag);
        // the wet roots of the showers: fine threads of white water running a little way down the face, only where the lip is slopping
        float thread = smoothstep(0.66, 0.86, vnoise(vec2(P.x * 8.5, d * 1.3 - uT * 2.4))) * smoothstep(0.35, 0.6, vnoise(vec2(P.x * 1.7 + 9., d * 2.2 - uT * 1.3)));
        float slop = smoothstep(0.5 * SL, 0.85 * SL, e) * slopGust(P.x, sgn) * (1. - smoothstep(0.2, 1.5, d)) * thread * 0.45;
        float veil = mix(0.04, 0.10, clamp(-P.y / 22., 0., 1.));
        // where a face ends against the breakwater's stone the swell breaks on it: white water runs back down the face's upper part in
        // falling threads, for 7 to 9.5 m along from the stone, deepest next the stone (as far as 7 m down) and 2.2 m at its far end,
        // so each of the four corners of the cut sea at the stone stands in broken water
        float mx = abs(P.x - uMole.x) - uMole.y;
        float run = 0.5 + 0.5 * sin(P.y * 2.3 + uT * 2.1 + 3. * sin(P.x * 1.9 + uT * 0.7));
        float fallT = 0.6 * vnoise(vec2(P.x * 4.5, d * 0.8 - uT * 2.6)) + 0.4 * vnoise(vec2(P.x * 11., d * 2.4 - uT * 4.));
        float nearC = 1. - smoothstep(0.5, 7. + 2.5 * run, mx);
        float broke = step(0., mx) * nearC * (1. - smoothstep(0.6, 2.2 + 4.8 * nearC * (0.6 + 0.4 * run), d)) * (0.3 + 0.7 * smoothstep(0.3, 0.7, fallT));
        float white = clamp(max(max(men * 0.8, broke * 0.8), max(foam * 0.75, slop)), 0., 0.85);
        vec3 col = mix(seaGlow(max(-P.y, 0.), P), vec3(1.15, 1.2, 1.18), white / max(white + veil, 1e-3));
        gl_FragColor = vec4(col, max(white, veil));
      }`});for(const u of[-1,1]){const i=new x.Mesh(s(u*Y,500,6,!1),f);i.renderOrder=5,i.name="face",t.add(i);const n=new x.Mesh(s(u*(Y+30),120,4,!0),r);n.name="backdrop",t.add(n),await o.yield()}return t}function oe(o,e){const t=e.L,s=e.B,c=e.n||12,r=e.m||8,f=[];for(let n=0;n<=c;n++){const p=-1+2*n/c,l=Math.abs(p),m=s/2*Math.pow(Math.max(1-Math.pow(l,p>0?1.7:2.6+3*(e.full||0)),0),.75)+.02,h=e.free*(1+.35*p*p+(p>0?.25*p:0)),d=e.draft*Math.pow(Math.max(1-Math.pow(l,3),0),.6)+.02,b=e.full||0,M=1.1-.75*b,a=.9-.4*b,w=v=>Math.asin(Math.pow(Math.min(1,Math.max(0,(h-v)/(h+d))),1/a)),y=w(.16),g=w(0),P=[0,y*.5,y,g];for(let v=1;v<r;v++)P.push(g+(Math.PI-2*g)*v/r);P.push(Math.PI-g,Math.PI-y,Math.PI-y*.5,Math.PI);const S=P.map(v=>{const k=Math.sin(v),F=Math.cos(v);return[p*t/2,h-(h+d)*Math.pow(k,a),-m*Math.sign(F)*Math.pow(Math.abs(F),M)]});f.push(S)}const u=r+6;o.skin(f,(n,p)=>p<2||p>=u-2?e.hull:p===2||p===u-3?e.boot||e.hull:e.bottom,!1,!1);const i=f.map(n=>[[n[0][0],n[0][1]-.05,n[0][2]],[n[u][0],n[u][1]-.05,n[u][2]]]);if(o.skin(i,e.deck||L("#C9B28A",.8),!1,!0),e.keel){const n=-e.draft*.9,p=-e.draft-e.keel,l=e.bottom;o.skin([[[-t*.16,n,0],[-t*.08,p,0]],[[-t*.02,n,.16],[-t*0,p,.22]],[[t*.14,n,0],[t*.08,p,0]]],l),o.skin([[[-t*.16,n,0],[-t*.08,p,0]],[[-t*.02,n,-.16],[-t*0,p,-.22]],[[t*.14,n,0],[t*.08,p,0]]],l,!1,!0),o.box(-t*.42,-e.draft*.55,0,t*.07,e.draft*1.5+e.keel*.5,.08,l)}return o}function Ae(o,e,t,s,c,r={}){const f=L("#F4FBF7",.82),u=L("#C8432B",.75),i=L("#8A5A32",.8),n=L("#D8B880",.8),p=r.hull||L("#EFE6CC",.8),l=r.bottom||u;if(o.at(t,0,s,c).move(r.pivot?r.pivot[0]:t,r.pivot?r.pivot[1]:s,1,r.ride??1),e==="sloop"||e==="yawl"){const m=e==="yawl"?11:9.5,h=e==="yawl"?11.5:11;oe(o,{L:m,B:2.9,free:.85,draft:.75,keel:e==="yawl"?2:1.9,hull:p,bottom:l,boot:f,full:.2}),o.box(-.4,1.05,0,m*.34,.5,1.5,f,L("#E2D8C0",.8)),o.bar([m*.12,.8,0],[m*.12,h,0],.09,.06,n,6),o.bar([m*.12,1.9,0],[-m*.36,1.9,0],.07,.06,n,5),r.sails?(o.move(t,s,1,r.ride??1),o.quad([m*.12-.1,2.1,.02],[-m*.34,2.1,.35],[-m*.1,h*.6,.3],[m*.12-.1,h-.3,.02],f),o.tri([m*.16,h-1.5,0],[m*.5,1,0],[m*.2,1.3,-.5],f)):o.bar([m*.1,2.05,0],[-m*.34,2.05,0],.16,.13,f,6),e==="yawl"&&(o.bar([-m*.43,.8,0],[-m*.43,5.6,0],.06,.04,n,5),o.bar([-m*.43,1.7,0],[-m*.62,1.7,0],.05,.04,n,5))}else e==="fisher"?(oe(o,{L:10.5,B:3.6,free:1.2,draft:1.5,hull:p,bottom:l,boot:f,full:.7}),o.box(-1.6,2.15,0,2.6,2.1,2.2,f,L("#C8432B",.7)),o.bar([2.2,1.2,0],[2.2,6.2,0],.09,.06,n,6),o.bar([2.2,4.2,0],[5.6,6,0],.06,.05,n,5),o.box(-4.9,-1.25,0,.7,1.1,.07,l),o.at(t,0,s,c)):e==="launch"?(oe(o,{L:7,B:2.3,free:.75,draft:.6,hull:p,bottom:l,boot:f,full:.5}),o.box(.8,1,0,2,.7,1.5,f)):(oe(o,{L:e==="row"?4.6:3.6,B:1.5,free:.45,draft:.28,hull:p,bottom:l,deck:i,full:.5}),o.box(0,.42,0,.3,.06,1.3,i),o.box(-1,.42,0,.3,.06,1.1,i),o.ball(-.1,.95,0,.26,.5,.2,r.shirt||L("#C8432B",.75),6,4),o.ball(-.1,1.6,0,.14,.16,.14,L("#E0B090",.8),6,4));return o.at().move(),o}function ie(o,e,t,s={}){const c=s.col||L("#3A3F44",.9);return o.at().move(),o.chain(e,t,s.col||L("#4A5055",1),s.thick||.25,s.sag??.8),s.block?o.box(t[0],t[1]+.45,t[2],1.3,.9,1.3,L("#8D8A80",.8)):(o.bar([t[0],t[1]+.1,t[2]],[t[0]+1.5,t[1]+.35,t[2]],.09,.09,c,5),o.bar([t[0]+1.5,t[1]+.3,t[2]-.8],[t[0]+1.5,t[1]+.3,t[2]+.8],.07,.07,c,5),o.tri([t[0],t[1]+.1,t[2]],[t[0]+.5,t[1]+.9,t[2]-.5],[t[0]+.5,t[1]+.1,t[2]-.6],c),o.tri([t[0],t[1]+.1,t[2]],[t[0]+.5,t[1]+.9,t[2]+.5],[t[0]+.5,t[1]+.1,t[2]+.6],c)),o}const le=`
  float sideS = step(abs(N.y), 0.75);
  vec2 pl = vec2(Q.x / 5.2 + floor(Q.y / 1.05) * 0.37, Q.y / 1.05);
  vec2 pf = abs(fract(pl) - 0.5);
  float seam = max(0.45 * smoothstep(0.485, 0.5, pf.x), smoothstep(0.43, 0.5, pf.y)) * sideS * min(nearG * 2.2, 1.);
  float isRed = step(alb.g * 2.5, alb.r) * step(Q.y, 0.6);
  float isWhite = step(0.45, alb.b) * step(0.45, alb.r) * step(Q.y, 3.1);
  alb *= 1. - 0.3 * clamp(seam, 0., 1.) * max(isRed, isWhite);
  alb *= 1. - 0.09 * mod(floor(Q.y / 1.05), 2.) * sideS * max(isRed, isWhite);
  alb *= 1. + (grain - 0.5) * 0.14 * nearG;
  float port = (1. - smoothstep(0.17, 0.22, length(vec2((fract(Q.x / 2.3) - 0.5) * 2.3, Q.y - 1.45)))) * step(abs(Q.x - 1.), 17.5);
  float ring = (1. - smoothstep(0.24, 0.28, length(vec2((fract(Q.x / 2.3) - 0.5) * 2.3, Q.y - 1.45)))) * step(abs(Q.x - 1.), 17.5);
  float weep = smoothstep(0.6, 0.9, vnoise(vec2(Q.x * 1.3, 1.))) * (1. - smoothstep(0.3, 2.3, Q.y)) * step(0., Q.y);
  float pxr = (fract(Q.x / 2.3) - 0.5) * 2.3;
  float run = (1. - smoothstep(0.05, 0.2 + 0.1 * vnoise(vec2(Q.x * 0.7, 3.)), abs(pxr))) * smoothstep(0.35, 0.8, Q.y) * (1. - smoothstep(0.9, 1.3, Q.y)) * step(abs(Q.x - 1.), 17.5) * (0.4 + 0.6 * vnoise(vec2(floor(Q.x / 2.3) * 3.7, 5.)));
  alb = mix(alb, vec3(0.52, 0.27, 0.12), isWhite * sideS * clamp(weep * 0.5 + run * 0.75, 0., 0.85));
  alb = mix(alb, vec3(0.72, 0.5, 0.2), isWhite * sideS * ring);
  alb = mix(alb, vec3(0.03, 0.07, 0.1), isWhite * sideS * port);
  alb = mix(alb, vec3(0.03, 0.04, 0.05), isWhite * sideS * (1. - smoothstep(0.5, 0.56, Q.y)));
  float slime = smoothstep(-1.7, -0.15, Q.y) * (0.45 + 0.55 * vnoise(vec2(Q.x * 0.9, Q.y * 2.2)));
  alb = mix(alb, vec3(0.15, 0.28, 0.11), isRed * clamp(slime * 0.5 + 0.55 * smoothstep(-0.75, -0.05, Q.y) * (0.55 + 0.45 * vnoise(vec2(Q.x * 2.1, 7.))), 0., 0.9));
  alb *= mix(1., 0.62, isRed * (1. - smoothstep(-4.3, -2.4, Q.y)));
  alb *= mix(1., 0.8 + 0.36 * fbm2(vec2(Q.x * 0.33, Q.y * 0.8)), isRed);
`;function Te(o){const e=new se,t=L("#F4FBF7",.84),s=[.72,.07,.035],c=L("#D9A85A",.85),r=L("#1E2226",1),f=L("#B89868",.8);e.move(0,0,1,.12),e.at(1,0,0),oe(e,{L:44,B:8,free:2.9,draft:4.6,hull:t,bottom:s,boot:r,full:.85,n:26,m:12,deck:f}),e.at();for(const a of[-1,1])e.box(1,-3.7,a*3.3,20,.12,.7,s);e.box(-21.2,-2.4,0,1.4,3.8,.18,s),e.bar([-19.2,-3.1,0],[-15,-3.1,0],.22,.34,s,6);const u=L("#27506A",1),i=L("#E8E2D2",.8),n=L("#27404E",1);e.box(-1,4.3,0,24,2.4,6,t,i),e.box(3.5,6.6,0,10,2.2,4.8,t,i),e.box(7.6,8.5,0,3.4,1.6,5.6,t,c),e.box(9.32,8.75,0,.04,.7,5.2,u);for(const a of[-1,1])e.box(7.6,8.75,a*2.82,2.6,.7,.04,u);for(let a=-6;a<=5;a++)for(const w of[-1,1])e.box(-1+a*1.9,4.55,w*3.02,.9,.8,.04,u);for(let a=-2;a<=2;a++)for(const w of[-1,1])e.box(3.5+a*1.8,6.8,w*2.42,.8,.7,.04,u);for(const a of[-1,1]){for(const[w,y,g,P]of[[-13,11,5.5,3],[-1.5,8.5,7.7,2.4]]){for(const S of[.5,1])e.bar([w,g+S,a*P],[y,g+S,a*P],.035,.035,t,4);for(let S=w;S<=y+.01;S+=2)e.bar([S,g,a*P],[S,g+1,a*P],.035,.035,t,4)}for(const w of[-7.5,-3.6]){e.at(w,7,a*2.75),oe(e,{L:3.4,B:1.1,free:.35,draft:.3,hull:t,bottom:f,n:6,m:5}),e.at();for(const y of[-1.3,1.3])e.bar([w+y,5.5,a*2.9],[w+y,7.9,a*2.9],.05,.05,c,4),e.bar([w+y,7.9,a*2.9],[w+y,7.9,a*2.5],.05,.05,c,4)}e.box(21.2,1.9,a*.75,.9,.9,.12,r)}for(let a=0;a<8;a++){const w=-20+a*.95;e.quad([w,5.3,-3],[w,5.3,3],[w+.95,5.3,3],[w+.95,5.3,-3],a%2?s:t)}for(const a of[-1,1])for(const w of[-20,-16.2,-12.4])e.bar([w,3,a*2.9],[w,5.3,a*2.9],.05,.05,t,4);const p=["#C8432B","#F4FBF7","#0B5A7A","#D9A85A","#2F6B4A","#E8B8A0"].map(a=>L(a,.8));for(let a=0;a<26;a++){const w=a<12,y=w?-19.5+a%6*1.25:-10+(a-12)*1.45,g=(a%2?1:-1)*(w?1+a%3*.75:3.25),P=w?3:3.05;e.ball(y,P+1.15,g,.2,.36,.15,p[a%6],5,3),e.ball(y,P+1.65,g,.12,.13,.12,L("#D9A07A",.85),5,3),e.bar([y,P+.85,g],[y,P,g],.13,.1,p[(a+3)%6],4)}e.turn(-1.5,7.7,0,[[1.25,0],[1.2,2.5],[1.2,2.55],[1.2,3.3],[1.22,3.31],[1.22,3.9]],a=>a>=4?r:a===2?t:c,14),e.bar([-.2,7.7,0],[-.2,11.2,0],.07,.07,c,5);for(const[a,w]of[[2.2,1.5],[2.2,-1.5],[-4.4,1.4],[-4.4,-1.4]])e.bar([a,7.7,w],[a,9,w],.2,.2,t,6),e.ball(a+.2,9.1,w,.36,.36,.36,t,6,4),e.box(a+.5,9.1,w,.05,.5,.5,s);for(const[a,w]of[[14,12],[-13,10.5]])e.bar([a,3.3,0],[a,w,0],.14,.08,c,6),e.bar([a,w-2.6,-1.3],[a,w-2.6,1.3],.05,.05,c,4),e.bar([a,w-.4,0],[a+(a>0?-5.5:5.5),5.6+(a>0?2.2:0),0],.035,.035,n,4);e.box(15.5,3.4,0,2.2,.7,2.4,f),e.box(18.6,3.5,0,1,.8,1.6,n),e.at(),e.move();const l=new x.Mesh(e.geometry(),o.solid({albedo:le}));l.frustumCulled=!1,l.name="steamer";const m=new se,h=[1.25,.62,.13];m.ball(0,0,0,.45,.4,.4,h,8,4);for(let a=0;a<4;a++){const w=a*1.5708,y=Math.cos(w),g=Math.sin(w),P=.42,S=(k,F,E)=>[E+F*P,y*k-g*F,g*k+y*F],v=[[S(.3,-.18,0),S(.3,.18,0)],[S(.9,-.55,0),S(.9,.5,0)],[S(1.3,-.5,0),S(1.3,.55,0)],[S(1.5,-.12,0),S(1.5,.2,0)]];m.skin(v,h)}const d=new x.Mesh(m.geometry(),o.solid({noLine:!0}));d.position.set(-19.6,-3.1,0),d.name="screw",d.frustumCulled=!1;const b=new x.Mesh(we(l.geometry,o.bare,a=>a-Y-10),o.solid({albedo:le,over:!0}));b.frustumCulled=!1,b.renderOrder=4.5,b.name="steamer-over";const M=new x.Group;return M.add(l,d,b),{group:M,screw:d}}function ke(o,e,t,s,c,r=L("#D9A07A",.85)){o.at(e,0,t,s).move(e,t,4,0),o.ball(0,.28,0,.13,.15,.13,r,6,4),o.ball(0,-.32,0,.21,.42,.15,c,6,4);for(const f of[-1,1]){o.bar([0,-.05,f*.2],[.25,-.12,f*.62],.055,.045,r,5);const u=i=>f*Math.min(1,Math.max(0,(-.65-i)/.9));o.move(e,t,4,0,(i,n)=>u(n)),o.bar([0,-.65,f*.1],[.05,-1.1,f*.12],.085,.07,r,5),o.bar([.05,-1.1,f*.12],[0,-1.55,f*.12],.07,.05,r,5),o.move(e,t,4,0)}return o.at().move(),o}function Se(o,e,t,s){const c=N.bell,r=N.high,f=32,u=6.2832,i=v=>Math.abs(Math.sin(v*12.9898)*43758.5453)%1,n=(v,k,F)=>[v[0]+(k[0]-v[0])*F,v[1]+(k[1]-v[1])*F,v[2]+(k[2]-v[2])*F],p=[1.15,.26,.07],l=[1.6,.8,.36],m=[.6,.11,.05],h=[1.25,.2,.06],d=[1.55,.55,.2],b=[1.3,.52,.17],M=[.95,.27,.09],a=(v,k)=>Math.min(k,0);o.at(e,t,s).move(e,s,10,0,a);const w=6,y=(v,k)=>1+.08*Math.cos(8*v)*k*k*k,g=(v,k,F)=>{const E=[];for(let z=0;z<f;z++){const A=z/f*u;E.push([Math.cos(A)*v*y(A,F),k,Math.sin(A)*v*y(A,F)])}return E},P=[];for(let v=0;v<=w;v++){const k=(1-v/w)*1.5708;P.push(g(Math.max(c*Math.sin(k),.02),r*Math.cos(k),1-v/w))}o.skin(P,(v,k)=>{const F=n(l,p,Math.min(1,(v+.5)/w*1.25)),E=k%4===2?.72:1;return[F[0]*E,F[1]*E,F[2]*E]},!0,!1);const S=[];for(let v=0;v<=3;v++)S.push(g(c*(1-v/3.2),.5*r*(v/3),1-v/3));o.skin(S,v=>n(l,m,Math.min(1,(v+1)/2.2)),!0,!0);for(let v=0;v<10;v++){const k=v/10*u+.3,F=c*(.14+.26*(v%2)+.08*i(v+3)),E=3.4+2.2*i(v+11),z=16;o.move(e,s,10+.39*i(v+60.5),0,a);const A=(T,q)=>{const C=.3-T*(E+.3),H=k+1.57+3.3*T+.5*Math.sin(T*9+v),G=(.34-.24*T)*(1+.35*Math.sin(T*17+v*2.1)),D=F*(1-.35*T)+.1*Math.sin(T*7+v);return[Math.cos(k)*D+Math.cos(H)*G*q,C,Math.sin(k)*D+Math.sin(H)*G*q]};for(let T=0;T<z;T++){const q=T/z,C=(T+1)/z;o.quad(A(q,-1),A(q,1),A(C,1),A(C,-1),n(d,h,Math.min(1,.25+1.1*q)*(.85+.15*i(v*7+T))))}}for(let v=0;v<8;v++)for(let k=0;k<8;k++){const F=v*8+k,E=(v+.5)/8*u+(k-3.5)*.075,z=c*(.6+.32*i(F+.5)),A=N.mane*(.5+.5*i(F+40.5)*(1-Math.abs(k-3.5)/9)),T=12,q=Math.cos(E)*z,C=Math.sin(E)*z,H=E+i(F+80.5)*1.5,G=D=>1-.45*D*(2-D)*(A/N.mane);o.move(e,s,10+.33*i(v+120.5)+.05*i(F+140.5),0,a);for(let D=0;D<T;D++){const O=D/T,K=(D+1)/T,J=-.03-O*A,U=-.03-K*A,B=.04-.026*O,R=.04-.026*K,W=n(b,M,O),_=G(O),V=G(K);for(const ee of[H,H+1.5708]){const j=Math.cos(ee),$=Math.sin(ee);o.quad([q*_-j*B,J,C*_-$*B],[q*_+j*B,J,C*_+$*B],[q*V+j*R,U,C*V+$*R],[q*V-j*R,U,C*V-$*R],W)}}}return o.at().move(),o}function Fe(o,e,t,s){const c=L("#C9A46A",.8),r=L("#C8432B",.75);o.at(e,0,t).move(e,t,1,1),o.box(0,.42,0,4.2,.14,3.2,c);for(const f of[-1.5,1.5])for(const u of[-1.1,1.1])o.bar([f-.6,.05,u],[f+.6,.05,u],.38,.38,r,7);return o.bar([1.9,.5,1.4],[1.9,2.3,1.4],.05,.05,c,5),o.move(e,t,3,.6),o.tri([1.9,2.3,1.4],[1.9,1.75,1.4],[1,2,1.4],L("#C8432B",.8)),ie(o,[e,-.2,t],[e+.6,s,t+.4],{block:!0,sag:.3})}function Ee(o,e,t,s,c=L("#C8432B",.85)){return o.at(e,0,t).move(e,t,1,1),o.turn(0,0,0,[[.05,-.75],[.7,-.35],[.85,.15],[.55,.7],[.14,.95],[.1,1.9]],c,9),o.ball(0,2.05,0,.2,.2,.2,L("#F4FBF7",.85),6,4),ie(o,[e,-.7,t],[e-.8,s,t+.3],{block:!0,sag:.6})}function Le(o,e){const t=new se,s=L("#C9D6D8",.95),c=L("#5E7A86",.9);t.tri([.24,0,0],[-.08,.09,0],[-.08,-.09,0],s,[0,.3,1],[0,1,.5],[0,-1,.5]),t.tri([-.08,.09,0],[.24,0,0],[-.08,0,.035],c,[0,1,0],[0,1,0],[0,1,0]),t.tri([-.08,.02,0],[-.22,.09,0],[-.22,-.09,0],s,[0,0,1],[0,0,1],[0,0,1]);const r=t.geometry(),f=new x.InstancedBufferGeometry;f.setAttribute("position",r.getAttribute("position")),f.setAttribute("normal",r.getAttribute("normal")),f.setAttribute("color",r.getAttribute("color"));let u=0;for(const d of e)u+=d.n;const i=new Float32Array(u*4),n=new Float32Array(u*4),p=new Float32Array(u*3);let l=0;for(const d of e)for(let b=0,M=d.rng;b<d.n;b++,l++){const a=.35+.65*Math.sqrt(M());i.set([d.c[0],d.c[1],d.c[2],d.period],l*4),n.set([a,M()*6.2832,(M()*2-1)*(1-.5*a),M()],l*4),p.set(d.r,l*3)}f.setAttribute("aCen",new x.InstancedBufferAttribute(i,4)),f.setAttribute("aOrb",new x.InstancedBufferAttribute(n,4)),f.setAttribute("aReach",new x.InstancedBufferAttribute(p,3)),f.instanceCount=u;const m=o.solid({noLine:!0,head:"attribute vec4 aCen, aOrb; attribute vec3 aReach;",place:`
    float an = aOrb.y + 6.2832 * uT / aCen.w + 0.25 * sin(uT * 0.9 + aOrb.w * 40.);
    float sn = sin(an), cs = cos(an), dirn = sign(aCen.w);
    vec3 off = vec3(cs * aOrb.x * aReach.x, aOrb.z * aReach.y + 0.3 * sin(uT * 0.7 + aOrb.w * 30.), sn * aOrb.x * aReach.z);
    vec3 fw = normalize(vec3(-sn * aReach.x, 0., cs * aReach.z)) * dirn; vec3 sd = vec3(-fw.z, 0., fw.x);
    vec3 lp = position; lp.z += 0.05 * sin(uT * 9. + aOrb.w * 50. + lp.x * 9.) * step(lp.x, 0.);
    wp = aCen.xyz + off + fw * lp.x + vec3(0., lp.y, 0.) + sd * lp.z;
    wn = normalize(fw * normal.x + vec3(0., normal.y, 0.) + sd * normal.z + vec3(0., 1e-4, 0.));
    float flash = smoothstep(0.2, 0.9, sin(an * 2. + aOrb.w * 2.5 + uT * 0.6));
    col = mix(color * 0.32, color * 1.7, flash);`}),h=new x.Mesh(f,m);return h.frustumCulled=!1,h.name="fish",h}function Ce(o){for(let e=0;e<122;e++)o()}const xe=[["#34400F","#8C9A2C"],["#5C3C0E","#C8922C"],["#2E210C","#80602A"]].map(([o,e])=>[L(o,.95),L(e,1)]),be=["#6E6A5E","#5A574E","#7C7566"].map(o=>L(o,.85)),ye=L("#3A2C12",.95);function Be(o,e,t,s,c,r,f=0){const u=r(),i=xe[f===0?u<.7?1:0:f===1?u<.6?0:2:u<.6?2:0],n=i[0],p=i[1],l=h=>[n[0]+(p[0]-n[0])*h,n[1]+(p[1]-n[1])*h,n[2]+(p[2]-n[2])*h],m=r()*6.28;if(f===0){o.at(e,s,t,m).move(e,t,2,0,(b,M)=>M);const h=3+Math.floor(r()*3),d=8;for(let b=0;b<h;b++){const M=b*6.2832/h+r.range(-.4,.4),a=c*r.range(.5,1),w=r.range(.16,.27),y=r.range(.3,.85),g=r.range(-1.6,1.6),P=r()*6.28,S=Math.cos(M),v=Math.sin(M);let k=null,F=null;for(let E=0;E<=d;E++){const z=E/d,A=y*Math.sin(z*1.5708)+.14*Math.sin(z*9+P)*z,T=a*z,q=w*Math.pow(Math.max(0,Math.sin(Math.PI*Math.min(1,.06+z*.94))),.55)*(E%2?1.12:.9)+.012,C=M+1.5708+g*z,H=S*A,G=v*A,D=[H-Math.cos(C)*q,T,G-Math.sin(C)*q],O=[H+Math.cos(C)*q,T,G+Math.sin(C)*q];E&&o.quad(k,F,O,D,l(Math.min(1,.15+.85*(E-.5)/d))),k=D,F=O}}}else if(f===1){const h=c*r.range(.55,1),d=r()*6.28,b=r.range(.25,.6),M=r.range(.07,.1),a=4,w=P=>[.11*(Math.sin(P*b+d)-Math.sin(d)),P,.11*(Math.cos(P*b*.8+d)-Math.cos(d))];o.at(e,s,t,m).move(e,t,2,0,(P,S)=>S);for(let P=0;P<a;P++)o.bar(w(h*P/a),w(h*(P+1)/a),M*(1-.1*P),M*(1-.1*(P+1)),ye,3);const y=w(h);o.ball(y[0],y[1],y[2],.17,.2,.17,l(.35),4,2);const g=6+Math.floor(r()*3);for(let P=0;P<g;P++){const S=P*6.2832/g+r.range(-.3,.3),v=r.range(1.2,1.85),k=r.range(.13,.2),F=r.range(.1,.43),E=Math.cos(S),z=Math.sin(S),A=-z*k,T=E*k,q=l(r.range(.45,1)),C=[y[0]+E*v*.5,y[1]+F*v,y[2]+z*v*.5],H=[y[0]+E*v,y[1]+F*v*.4-.3*v,y[2]+z*v];o.tri(y,[C[0]+A,C[1],C[2]+T],[C[0]-A,C[1],C[2]-T],q),o.quad([C[0]-A,C[1],C[2]-T],[C[0]+A,C[1],C[2]+T],[H[0]+A*.5,H[1],H[2]+T*.5],[H[0]-A*.5,H[1],H[2]-T*.5],q)}}else{const h=r.range(.45,.8),d=r.pick(be);o.at(e,s,t,m).move(),o.turn(0,-.1,0,[[h*1.15,0],[h,h*.45],[h*.5,h*.75],[.02,h*.8]],d,5,1.2,.9),o.move(e,t,2,0,(M,a)=>Math.max(0,a-h*.5)*.55);const b=10+Math.floor(r()*5);for(let M=0;M<b;M++){const a=r()*6.28,w=h*r.range(.1,.8),y=Math.min(r.range(.7,1.5),Math.max(c,.7)),g=r.range(.15,.6),P=r.range(.1,.18),S=Math.cos(a),v=Math.sin(a),k=l(r.range(.1,.9)),F=-v,E=S,z=[S*w,h*.55,v*w],A=[z[0]+S*g*y*.6,z[1]+y*.6,z[2]+v*g*y*.6];o.tri([z[0]-F*P*.5,z[1],z[2]-E*P*.5],[z[0]+F*P*.5,z[1],z[2]+E*P*.5],A,k);for(const T of[-1,1])o.tri([A[0]-F*P*.6,A[1]-.1,A[2]-E*P*.6],[A[0]+F*P*.6,A[1]-.1,A[2]+E*P*.6],[A[0]+S*g*y*.4+T*F*.22*y,A[1]+y*.4,A[2]+v*g*y*.4+T*E*.22*y],k)}}o.at().move()}function He(o,e){const t=new se,s=L("#5E6468",.9),c=L("#868A86",.9),r=L("#CFCBBB",.92),f=L("#3A3D40",.9),u=[[1.19,.035],[1.15,.1],[1.05,.165],[.9,.195],[.74,.19],[.6,.215],[.35,.3],[0,.37],[-.4,.34],[-.75,.24],[-1,.14],[-1.15,.085]],i=8,n=u.slice().reverse().map(([a,w])=>{const y=[];for(let g=0;g<i;g++){const P=(g+.5)/i*6.2832;y.push([a,Math.sin(P)*w*.92-.04*(1-a*a/1.44),Math.cos(P)*w*1.06])}return y});t.skin(n,(a,w)=>{const y=Math.sin((w+1)/i*6.2832);return y>.5?s:y<-.5?r:c},!0,!1);const p=[[-1.12,.075,.07],[-1.3,.13,.05],[-1.48,.18,.04],[-1.62,.14,.03],[-1.72,.03,.012]];t.skin(p.map(([a,w,y])=>[[a,w,0],[a,0,y],[a,-w,0],[a,0,-y]]),f,!0,!1);for(const a of[-1,1])t.quad([.5,-.1,a*.27],[.3,-.21,a*.3],[0,-.3,a*.37],[.12,-.17,a*.38],f);const l=t.geometry(),m=new x.InstancedBufferGeometry;for(const a of["position","normal","color"])m.setAttribute(a,l.getAttribute(a));const h=new Float32Array(e.length*4),d=new Float32Array(e.length*4);e.forEach((a,w)=>{h.set([a.c[0],a.c[1],a.c[2],a.period],w*4),d.set([a.r[0],a.r[1],a.r[2],a.phase],w*4)}),m.setAttribute("aCen",new x.InstancedBufferAttribute(h,4)),m.setAttribute("aRad",new x.InstancedBufferAttribute(d,4)),m.instanceCount=e.length;const b=o.solid({noLine:!0,head:"attribute vec4 aCen, aRad;",place:`
    float an = aRad.w + 6.2832 * uT / aCen.w;
    vec3 c = aCen.xyz + vec3(cos(an) * aRad.x, sin(2. * an) * aRad.y, sin(an) * aRad.z);
    vec3 fw = normalize(vec3(-sin(an) * aRad.x, 2. * cos(2. * an) * aRad.y, cos(an) * aRad.z) * sign(aCen.w) + vec3(1e-4, 0., 0.));
    vec3 sd = normalize(vec3(-fw.z, 0., fw.x) + vec3(0., 0., 1e-4)); vec3 upv = cross(sd, fw);
    vec3 lp = position; lp.z += 0.11 * sin(uT * 3.1 + aRad.w * 9. + lp.x * 2.) * clamp(0.15 - lp.x * 0.75, 0., 1.4);   // the hind end sweeps from side to side, as a seal swims
    wp = c + fw * lp.x + upv * lp.y + sd * lp.z;
    wn = normalize(fw * normal.x + upv * normal.y + sd * normal.z + vec3(0., 1e-4, 0.));
    col = mix(color, color * vec3(1.12, 0.9, 0.7), step(0.5, fract(aRad.w * 1.7)));`,albedo:"alb *= (0.8 + 0.4 * smoothstep(0.4, 0.62, vnoise(Q.xy * 7. + Q.z * 5.))) * (1. + (grain - 0.5) * 0.2 * nearG);"}),M=new x.Mesh(m,b);return M.frustumCulled=!1,M.name="seals",M}function qe(o,e){const t=new se,s=L("#F4FBF7",.9),c=L("#3A3F44",1);t.tri([.28,0,0],[-.3,.03,.07],[-.3,.03,-.07],s),t.tri([.28,0,0],[-.3,-.05,0],[-.3,.03,.07],s),t.tri([.28,0,0],[-.3,.03,-.07],[-.3,-.05,0],s);for(const l of[-1,1])t.quad([.12,.02,l*.05],[-.12,.02,l*.05],[-.16,.02,l*.4],[.1,.02,l*.4],s),t.tri([.1,.02,l*.4],[-.16,.02,l*.4],[-.1,.02,l*.72],c);const r=t.geometry(),f=new x.InstancedBufferGeometry;for(const l of["position","normal","color"])f.setAttribute(l,r.getAttribute(l));const u=new Float32Array(e.length*4),i=new Float32Array(e.length*4);e.forEach((l,m)=>{u.set([l.c[0],l.c[1],l.c[2],l.period],m*4),i.set([l.r[0],l.r[1],l.r[2],l.phase],m*4)}),f.setAttribute("aCen",new x.InstancedBufferAttribute(u,4)),f.setAttribute("aRad",new x.InstancedBufferAttribute(i,4)),f.instanceCount=e.length;const n=o.solid({noLine:!0,head:"attribute vec4 aCen, aRad;",place:`
    float an = aRad.w + 6.2832 * uT / aCen.w;
    vec3 c = aCen.xyz + vec3(cos(an) * aRad.x, sin(an * 2. + aRad.w) * aRad.y, sin(an) * aRad.z);
    vec3 fw = normalize(vec3(-sin(an) * aRad.x, 0., cos(an) * aRad.z) * sign(aCen.w) + vec3(1e-4, 0., 0.));
    vec3 sd = vec3(-fw.z, 0., fw.x);
    vec3 lp = position * 1.5; float reach = abs(lp.z);
    lp.y += reach * 0.55 * sin(uT * 5.5 + aRad.w * 7.) * step(0.5, fract(uT * 0.11 + aRad.w)) + reach * 0.12;
    wp = c + fw * lp.x + vec3(0., lp.y, 0.) + sd * lp.z;
    wn = vec3(0., 1., 0.);`}),p=new x.Mesh(f,n);return p.frustumCulled=!1,p.name="gulls",p}function Ge(o,e,t){const s=t.rng,c=t.motes,r=[],f=[],u=Math.round(4200*t.detail);for(let h=0;h<u;h++)r.push(c()*1e3,.04+.92*c(),(c()<.5?-1:1)*(Y+.3+11.7*c()*c()),c()),f.push(.6+c(),0,0,0);for(let h=0;h<250;h++)for(const d of[-1,1])for(let b=0;b<10;b++)r.push(h*4+2+(s()-.5)*1.6,d,s(),(b+s())/10),f.push(.7+.6*s(),0,0,1);for(let h=0;h<420;h++)r.push(s(),s()*6.2832,.15+1.25*s(),s()),f.push(.6+s(),0,0,2);for(const h of t.risers||[])for(let d=0;d<26;d++)r.push(h[0],h[1],h[2],s()),f.push((.6+s())*(h[4]||1),h[3],s()*6.28,4);for(let h=0;h<46;h++)r.push(h/46,s(),s(),s()),f.push(.7+.6*s(),0,0,3);const i=new x.BufferGeometry,n=r.length/4;i.setAttribute("position",new x.BufferAttribute(new Float32Array(n*3),3)),i.setAttribute("aA",new x.BufferAttribute(new Float32Array(r),4)),i.setAttribute("aB",new x.BufferAttribute(new Float32Array(f),4)),i.boundingSphere=new x.Sphere(new x.Vector3(500,0,0),1200);const p=Object.assign({},e.uniforms,{uPx:{value:450},uShip:{value:t.ship},uShipT:{value:t.shipT||0}}),l=new x.ShaderMaterial({uniforms:p,transparent:!0,depthWrite:!1,vertexShader:Z+`
      attribute vec4 aA, aB; uniform float uPx; uniform vec4 uShip; uniform float uShipT; varying vec4 vCol;
      float shipX(float t){ return uShip.x + uShip.y * sin(6.2832 * (t + uShipT) / uShip.z); }
      void main(){
        vec3 p; float size = 0.06; vec4 col = vec4(1.);
        float kind = aB.w;
        if (kind < 0.5) {                                   // a mote, drifting west with all the water
          float x = mod(aA.x - 1.2 * uT, 1000.);
          p = vec3(x, -aA.y * max(bedLin(x) - 0.6, 0.) - 0.15, aA.z);
          p.y += 0.15 * sin(uT * 0.5 + aA.w * 30.);
          vec3 T = exp(-waterLen(p, cameraPosition) * uK * 1.4);
          float edge = smoothstep(0., 12., x) * (1. - smoothstep(988., 1000., x));
          col = vec4(vec3(0.85, 1., 0.95) * (0.6 + 1.1 * step(0., p.z)), 0.95 * T.g * edge); size = 0.065 * aB.x;
        } else if (kind < 1.5) {                            // a drop of slop thrown off a lip into the slot's air: fine spray with a short fall, each time from a new place of the lip
          float cyc = uT / 1.3 + aA.w + aA.z, tau = fract(cyc) * 1.3, turn = floor(cyc);
          float jx = h21(vec2(aA.w * 91.7 + 0.37, turn * 0.173 + aA.z));
          vec2 foot = vec2(aA.x + (jx - 0.5) * 4.2, aA.y * HALF);
          float e = eta(foot); float SL = uSS * (1. + uLip);
          float str = smoothstep(0.5 * SL, 0.85 * SL, e) * slopGust(foot.x, aA.y);
          float thrown = 0.12 + (0.25 + 0.5 * aA.z) * tau;
          p = vec3(foot.x - 0.5 * tau * (aB.x - 1.), e - 0.1 - 0.5 * tau - 4.9 * tau * tau, aA.y * (HALF - thrown));
          float live = step(2., bedLin(aA.x)) * step(0.2 - bedLin(foot.x), p.y);
          float spent = 1. - tau / 1.3;
          col = vec4(vec3(1.05, 1.12, 1.1), 0.85 * str * live * spent * spent); size = 0.06 * aB.x * (1. + 0.6 * tau);
        } else if (kind < 2.5) {                            // a bubble in the screw's wake, left astern on the stream
          float age = fract(uT / 9. + aA.x) * 9.;
          float born = uT - age;
          float sp = aA.z * (0.4 + 0.25 * age);
          p = vec3(shipX(born) - 19.6 - (1.2 + 2.2 * exp(-age * 0.6)) * age, -3.1 + sin(aA.y + born * 8.8) * sp + 0.22 * age, uShip.w + cos(aA.y + born * 8.8) * sp);
          p.y = min(p.y, -0.15);
          vec3 T = exp(-waterLen(p, cameraPosition) * uK);
          col = vec4(vec3(0.95, 1.05, 1.0) * (0.6 + 0.7 * T.g), 0.85 * (1. - age / 9.)); size = 0.17 * aB.x;
        } else if (kind < 3.5) {                            // funnel smoke: thin, lying to the north-east
          float age = fract(uT / 12. + aA.x) * 12.;
          float born = uT - age;
          p = vec3(shipX(born) - 1.5 + 2.6 * age, 11.8 + 1.1 * sqrt(age) + (aA.y - 0.5) * 0.25 * age, uShip.w - 1.5 * age + (aA.z - 0.5) * 0.3 * age);
          col = vec4(vec3(0.62, 0.62, 0.64), 0.22 * (1. - age / 12.) * smoothstep(0., 0.6, age)); size = (0.9 + 0.55 * age) * aB.x;
        } else {                                            // bubbles rising from a fixed place under water
          float age = fract(uT / 7. + aA.w) * 7.;
          p = vec3(aA.x + 0.25 * sin(aB.z + age * 2.), aA.y + aB.y * age / 7., aA.z + 0.25 * cos(aB.z + age * 1.7));
          vec3 T = exp(-waterLen(p, cameraPosition) * uK);
          col = vec4(vec3(0.95, 1.05, 1.0) * (0.5 + 0.7 * T.g), 0.75); size = 0.07 * aB.x * (1. + age * 0.15);
        }
        vec4 mv = viewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        // a speck too far off to be seen at its own size thins away with it, so a far reach of them never packs into a veil
        float px = size * projectionMatrix[1][1] * uPx * 0.5 / max(-mv.z, 0.3);
        float thin = clamp(px / 1.5, 0., 1.);
        vCol = vec4(col.rgb, col.a * thin * thin);
        gl_PointSize = clamp(px, 1.5, 90.);
      }`,fragmentShader:`
      varying vec4 vCol;
      void main(){ vec2 d = gl_PointCoord - 0.5; float a = 1. - smoothstep(0.2, 0.5, length(d)); gl_FragColor = vec4(vCol.rgb, vCol.a * a); }`}),m=new x.Points(i,l);return m.frustumCulled=!1,m.renderOrder=6,m.name="specks",{object:m,uniforms:p}}function Re(o,e,t,s,c,r){const f=new x.BufferGeometry,u=48,i=10,n=[],p=[],l=[];for(let d=0;d<=i;d++)for(let b=0;b<=u;b++){const M=e+(t-e)*b/u,a=d/i,w=-.15-.9*Math.abs(Math.sin((M-e)/r*Math.PI)),y=w-c+.7*Math.abs(Math.sin((M-e)/r*Math.PI*1.5+.8));n.push(M,w+(y-w)*a,s),p.push(M-e,a)}for(let d=0;d<i;d++)for(let b=0;b<u;b++){const M=d*(u+1)+b,a=M+1,w=M+u+1,y=w+1;l.push(M,w,a,a,w,y)}f.setAttribute("position",new x.BufferAttribute(new Float32Array(n),3)),f.setAttribute("uv",new x.BufferAttribute(new Float32Array(p),2)),f.setIndex(l),f.boundingSphere=new x.Sphere(new x.Vector3((e+t)/2,-c/2,s),t-e);const m=new x.ShaderMaterial({uniforms:o.uniforms,transparent:!0,depthWrite:!1,side:x.DoubleSide,vertexShader:Z+`varying vec3 vP; varying vec2 vUv; varying float vFold;
      void main(){ vec3 p = position; float v = uv.y;
        float fold = sin(p.x * 0.62 + 2.4 * v + 0.35 * sin(uT * 0.43 + p.x * 0.2)) + 0.45 * sin(p.x * 1.7 - 1.1 * v + uT * 0.31);
        p.z -= (0.2 + 0.8 * v) * 0.8 * fold + 1.2 * v;               // its folds, and its foot trailing away from the face
        p.x -= 0.5 * v * (1. - v) * 4. * (0.6 + 0.15 * sin(uT * 0.37 + p.x * 0.4));   // its middle bellies down the stream
        vP = p; vUv = uv; vFold = fold; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.); }`,fragmentShader:Z+`
      varying vec3 vP; varying vec2 vUv; varying float vFold;
      void main(){
        vec2 m = vec2(vUv.x, vUv.y * ${c.toFixed(1)});
        vec2 q = vec2(m.x + m.y, m.x - m.y) * 2.6;
        vec2 fw = fwidth(q);
        vec2 f = abs(fract(q) - 0.5); vec2 w = fw * 1.1 + 0.05;
        float line = max(1. - smoothstep(0., w.x, f.x), 1. - smoothstep(0., w.y, f.y));
        float far = clamp(length(fw) * 1.5, 0., 1.);
        float ropes = max(1. - smoothstep(0.004, 0.012, vUv.y), 1. - smoothstep(0.004, 0.012, 1. - vUv.y));
        float leads = (1. - smoothstep(0.012, 0.03, 1. - vUv.y)) * step(0.72, fract(m.x * 1.1));
        float a = max(mix(line * 0.75, 0.16, far), max(ropes, leads) * 0.95);
        // twine: tarred brown, paler where a fold turns to the light
        vec3 twine = mix(vec3(0.13, 0.10, 0.06), vec3(0.62, 0.50, 0.30), clamp(0.5 + 0.34 * vFold, 0., 1.));
        twine = mix(twine, vec3(0.62, 0.55, 0.40), ropes); twine = mix(twine, vec3(0.30, 0.31, 0.33), leads);
        vec3 c = seaShade(twine, vP, vec3(0., 0.3, 0.95), cameraPosition);
        gl_FragColor = vec4(c, a);
      }`}),h=new x.Mesh(f,m);return h.renderOrder=3,h.name="net",h.frustumCulled=!1,h}export{L as C,Q as CHAIN,se as Geo,Y as HALF,N as JELLY,Z as SEA_GLSL,ce as SEA_STATES,ae as SLOT_END,pe as SOLID_VERT,ke as addBather,Ae as addBoat,Ee as addBuoy,ie as addChain,oe as addHull,Se as addJelly,Be as addKelp,Fe as addRaft,he as bedD,Pe as buildFaces,Le as buildFish,qe as buildGulls,Re as buildNet,Me as buildSeaTop,He as buildSeals,Ge as buildSpecks,Te as buildSteamer,ge as jellyAt,Ce as kelpDealt,ze as makeSea,we as overGeometry};
