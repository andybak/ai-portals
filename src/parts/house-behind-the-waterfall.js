import*as C from"three";import{clamp as j,lerp as E,smoothstep as V}from"../kit/core.js";import*as X from"../kit/fx.js";import*as Kt from"../kit/terrain.js";const O=Math.PI*2,D=e=>{const t=new C.Color(e);return[t.r,t.g,t.b]},q=(e,t,r)=>[E(e[0],t[0],r),E(e[1],t[1],r),E(e[2],t[2],r)],Bt={H:76,W:50,sheetZ:11.5,lipZ:3,galY:8,galTop:28,galHalf:22,galFront:7,galBack:-9,mouthX:-5,bridgeX:-10,bridgeZ0:-22,bridgeZ1:-66,deckY:8.6,bridgeW:5,underY:-5.4,headRamp:3.1,hallX:-10,hallZ0:-70,hallZ1:-242,hallHalf:32,hallHigh:34,stepH:1.5,seatH:6.35,seatBack:9,ringR:8.5,rimR:11},P=`
float hHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float hHash3(vec3 p) { p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float hNoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hHash(i), hHash(i + vec2(1., 0.)), f.x), mix(hHash(i + vec2(0., 1.)), hHash(i + vec2(1., 1.)), f.x), f.y); }
float hNoise3(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float a = mix(mix(hHash3(i), hHash3(i + vec3(1., 0., 0.)), f.x), mix(hHash3(i + vec3(0., 1., 0.)), hHash3(i + vec3(1., 1., 0.)), f.x), f.y);
  float b = mix(mix(hHash3(i + vec3(0., 0., 1.)), hHash3(i + vec3(1., 0., 1.)), f.x), mix(hHash3(i + vec3(0., 1., 1.)), hHash3(i + vec3(1., 1., 1.)), f.x), f.y);
  return mix(a, b, f.z); }
float hFbm(vec2 p) { return hNoise(p) * .5 + hNoise(p * 2.03 + 7.1) * .3 + hNoise(p * 4.1 + 3.7) * .2; }
`,tt=`
uniform vec4 uCaveAir;
float airBehind(float z, float sheetZ) { return 1. - smoothstep(sheetZ - 16., sheetZ - 1., z); }
float airAmt(float k) {
#if defined(USE_FOG) && defined(FOG_EXP2)
  float d = mix(fogDensity, uCaveAir.w, k);
  return 1. - exp(-d * d * vFogDepth * vFogDepth);
#else
  return fxFog();
#endif
}
vec3 airFog(vec3 c, float k) {
#if defined(USE_FOG) && defined(FOG_EXP2)
  return mix(c, mix(fogColor, uCaveAir.rgb, k), airAmt(k));
#else
  return fxApplyFog(c);
#endif
}
`,wt=()=>({value:new C.Vector4(0,0,0,0)});function yt(e=!1){const t=[],r=[],c=[],b=[],y=[],p=new C.Matrix4,w=new C.Vector3,z=new C.Matrix3;let M=!1;const x={get triangles(){return y.length/3},at(h,o,s,d=0,a=1){return p.makeRotationY(d),p.scale(w.set(a,a,a)),p.setPosition(h,o,s),z.getNormalMatrix(p),M=!0,x},home(){return M=!1,x},vert(h,o,s,d,a,n,l,g=0){return M&&(w.set(h,o,s).applyMatrix4(p),h=w.x,o=w.y,s=w.z,w.set(d,a,n).applyMatrix3(z).normalize(),d=w.x,a=w.y,n=w.z),e&&(h=-h,d=-d),t.push(h,o,s),r.push(d,a,n),c.push(l[0],l[1],l[2]),b.push(g),t.length/3-1},grid(h,o,s,d,{flip:a=!1,kind:n=0,keep:l=null}={}){const g=[],u=t.length/3;for(let i=0;i<=o;i++)for(let f=0;f<=h;f++)g.push(s(f/h,i/o));const v=(i,f)=>g[j(f,0,o)*(h+1)+j(i,0,h)];for(let i=0;i<=o;i++)for(let f=0;f<=h;f++){const m=v(f-1,i),A=v(f+1,i),S=v(f,i-1),F=v(f,i+1),Z=v(f,i),_=A[0]-m[0],G=A[1]-m[1],Y=A[2]-m[2],N=F[0]-S[0],W=F[1]-S[1],I=F[2]-S[2];let k=G*I-Y*W,B=Y*N-_*I,T=_*W-G*N;const R=Math.hypot(k,B,T)||1;k/=R,B/=R,T/=R,a&&(k=-k,B=-B,T=-T);const L=[k,B,T];x.vert(Z[0],Z[1],Z[2],k,B,T,d(Z,L,f/h,i/o),n)}for(let i=0;i<o;i++)for(let f=0;f<h;f++){if(l&&!l((f+.5)/h,(i+.5)/o))continue;const m=u+i*(h+1)+f,A=m+1,S=m+h+1,F=S+1;a?y.push(m,S,A,A,S,F):y.push(m,A,S,A,F,S)}return x},box(h,o,s,d,a,n,l,g=0){const u=[h,o,s],v=[d/2,a/2,n/2];for(let i=0;i<3;i++)for(const f of[1,-1]){const m=(i+1)%3,A=(i+2)%3,S=[0,0,0];S[i]=f;const F=i===1?f>0?1.08:.7:.94,Z=[l[0]*F,l[1]*F,l[2]*F],_=[];for(const[G,Y]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const N=[u[0],u[1],u[2]];N[i]+=f*v[i],N[m]+=G*v[m],N[A]+=Y*v[A],_.push(x.vert(N[0],N[1],N[2],S[0],S[1],S[2],Z,g))}f>0?y.push(_[0],_[1],_[2],_[1],_[3],_[2]):y.push(_[0],_[2],_[1],_[1],_[2],_[3])}return x},lathe(h,o,s,d,a,n,l=0,g=null){const u=d.length-1;return x.grid(a,u,(v,i)=>{const f=Math.min(u,Math.round(i*u)),m=v*O;return[h+Math.cos(m)*d[f][0],o+d[f][1],s-Math.sin(m)*d[f][0]]},(v,i,f,m)=>g?g(n,m):n,{kind:l})},tube(h,o,s,d,a=0){const n=h.length-1,l=typeof o=="function"?o:()=>o,g=h.map((u,v)=>{const i=h[Math.max(0,v-1)],f=h[Math.min(n,v+1)],m=new C.Vector3(f[0]-i[0],f[1]-i[1],f[2]-i[2]).normalize(),A=new C.Vector3().crossVectors(m,Math.abs(m.y)>.9?new C.Vector3(1,0,0):new C.Vector3(0,1,0)).normalize();return{s:A,w:new C.Vector3().crossVectors(A,m)}});return x.grid(s,n,(u,v)=>{const i=Math.min(n,Math.round(v*n)),f=u*O,m=l(i/n),A=g[i],S=Math.cos(f)*m,F=-Math.sin(f)*m;return[h[i][0]+A.s.x*S+A.w.x*F,h[i][1]+A.s.y*S+A.w.y*F,h[i][2]+A.s.z*S+A.w.z*F]},()=>d,{kind:a})},build(h=!0){if(e)for(let s=0;s<y.length;s+=3){const d=y[s+1];y[s+1]=y[s+2],y[s+2]=d}const o=new C.BufferGeometry;return o.setAttribute("position",new C.Float32BufferAttribute(t,3)),o.setAttribute("normal",new C.Float32BufferAttribute(r,3)),o.setAttribute("color",new C.Float32BufferAttribute(c,3)),h&&o.setAttribute("aKind",new C.Float32BufferAttribute(b,1)),o.setIndex(t.length/3>65535?new C.Uint32BufferAttribute(y,1):new C.Uint16BufferAttribute(y,1)),o.computeBoundingSphere(),o}};return x}const Lt=D("#1a120c"),et=D("#b5793f"),ct=D("#8a5a30"),Vt=D("#d6a868"),ot=D("#e8c08a"),Ct=D("#f08a4b"),Ft=D("#f4a7b9"),ht=D("#8f9c94"),at={hipY:.4,hipZ:-.19,shoulderZ:.19,limb:.4,neck:[0,.47,.25],tail:[0,.44,-.25]};function ft(e=!1){const t=[],r=[],c=[],b=[],y=[],p=[],w=(n,l,g,u,v,i)=>(t.push(n[0],n[1],n[2]),r.push(l[0],l[1],l[2]),c.push(g[0],g[1],g[2]),b.push(u,v),y.push(i[0],i[1],i[2]),t.length/3-1),z=(n,l,g,u)=>{const v=u?l:l+1;for(let i=0;i<g;i++)for(let f=0;f<l;f++){const m=n+i*v+f,A=n+i*v+(f+1)%v,S=m+v,F=A+v;p.push(m,A,S,A,F,S)}},M=(n,l,g,u,v,i,f,m=0)=>{const A=t.length/3;for(let S=0;S<=u;S++){const F=S/u,Z=Math.PI*F,_=Math.sin(Z),G=-Math.cos(Z);for(let Y=0;Y<g;Y++){const N=O*Y/g,W=[Math.cos(N)*_,Math.sin(N)*_,G],I=[W[0]/l[0],W[1]/l[1],W[2]/l[2]],k=Math.hypot(I[0],I[1],I[2]);w([n[0]+W[0]*l[0],n[1]+W[1]*l[1],n[2]+W[2]*l[2]],[I[0]/k,I[1]/k,I[2]/k],v(W),i,m,f)}}z(A,g,u,!0)},x=(n,l,g,u,v,i,f,m)=>{const A=t.length/3;for(let Z=0;Z<=i;Z++){const _=Z/i,G=Z===i,Y=E(g,u,_),N=n[1]-l*_;for(let W=0;W<v;W++){const I=O*W/v,k=[Math.cos(I),0,Math.sin(I)];w([n[0]+k[0]*Y*(G?1.7:1),N,n[2]+k[2]*Y*(G?2.3:1)+(G?.045:0)],k,_>.8?ot:q(et,ct,.3*_),f,_,n)}}z(A,v,i,!0);const S=w([n[0],n[1]-l-.012,n[2]+.045],[0,-1,0],ot,f,1,n),F=A+i*v;for(let Z=0;Z<v;Z++)p.push(F+Z,S,F+(Z+1)%v)},h=at,o=[0,h.hipY,h.hipZ];M([0,.41,0],[.105,.115,.29],e?5:7,e?3:5,n=>n[1]>.3?q(et,ct,.45):n[1]<-.4?Vt:et,0,o);const s=h.neck;if(M([0,.55,.34],[.1,.1,.105],e?5:7,e?3:5,n=>n[2]>.45&&n[1]<.55?ot:n[1]>.5?ct:et,1,s),!e){M([0,.522,.43],[.052,.045,.05],5,2,()=>q(ot,Ft,.25),1,s);for(const n of[-1,1])M([n*.1,.585,.325],[.022,.04,.035],3,2,()=>ot,1,s);for(const n of[-1,1])M([n*.04,.572,.428],[.017,.019,.012],3,2,()=>Lt,1,s)}for(const n of[-1,1])x([n*.075,h.hipY,h.shoulderZ],h.limb,.042,.027,e?3:4,e?2:3,n<0?2:3,n);for(const n of[-1,1])x([n*.08,h.hipY,h.hipZ],h.limb,.05,.03,e?3:4,e?2:3,n<0?4:5,n);{const n=t.length/3,l=h.tail,g=e?4:8,u=3;for(let v=0;v<=g;v++){const i=v/g,f=E(.034,.017,i);for(let m=0;m<u;m++){const A=O*m/u,S=[Math.cos(A),Math.sin(A),0];w([l[0]+S[0]*f,l[1]+S[1]*f,l[2]-.56*i],S,q(et,ct,.5),6,i,l)}}z(n,u,g,!0)}M([0,.5,.5],[.062,.062,.062],4,2,n=>n[0]>.2?q(Ct,Ft,.6):Ct,7,s);{const n=t.length/3,l=[0,.5,.52],g=6;for(const[i,f]of e?[[.035,-.045],[.105,.03]]:[[.035,-.045],[.1,0],[.105,.03]])for(let m=0;m<g;m++){const A=O*m/g,S=[Math.cos(A),.3,Math.sin(A)];w([l[0]+S[0]*i,l[1]+f,l[2]+S[2]*i],S,ht,8,0,s)}z(n,g,e?1:2,!0);const u=w([l[0],l[1]-.02,l[2]],[0,1,0],[ht[0]*.55,ht[1]*.55,ht[2]*.55],8,0,s),v=n+(e?1:2)*g;for(let i=0;i<g;i++)p.push(v+i,v+(i+1)%g,u)}const a=new C.BufferGeometry;return a.setAttribute("position",new C.Float32BufferAttribute(t,3)),a.setAttribute("normal",new C.Float32BufferAttribute(r,3)),a.setAttribute("color",new C.Float32BufferAttribute(c,3)),a.setAttribute("aBone",new C.Float32BufferAttribute(b,2)),a.setAttribute("aPivot",new C.Float32BufferAttribute(y,3)),a.setIndex(new C.Uint16BufferAttribute(p,1)),a}const Tt=`
attribute vec4 iA, iB, iC, iD, iE;
uniform float uTime, uSheetZ; uniform sampler2D tGround, tCourse; uniform vec4 uGBox, uWayA, uWayB, uArc; uniform vec2 uCBox;
const float STRIDE = 2.0;
vec2 groundAt(vec2 xz) { return textureLod(tGround, (xz - uGBox.xy) * uGBox.zw, 0.).rg; }
vec4 courseAt(float z) { return textureLod(tCourse, vec2((z - uCBox.x) * uCBox.y, .25), 0.); }
// the z at which the stream's course has run s metres of its own length from its lower end (the course picture's second row)
float arcZ(float s) { return uArc.z + s * uArc.w + textureLod(tCourse, vec2(s * uArc.x + uArc.y, .75), 0.).x; }
// a trail's x at z: so many metres beyond the water's edge, on the bank the lane's sign names
float laneX(float z, float lane) { vec4 c = courseAt(z); return c.x + sign(lane) * (c.z + abs(lane)) * c.y; }
vec3 rotX(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(v.x, v.y * c - v.z * s, v.y * s + v.z * c); }
vec3 rotY(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c); }
struct Mk { vec3 pos; float yaw, sit, air, gait, pitch, lift, show, sun, cave; };
Mk monkeyPlace() {
  Mk m; float mode = iC.x, ph = iC.y;
  m.pos = iA.xyz; m.yaw = iA.w; m.sit = 1.; m.air = 0.; m.gait = 0.; m.pitch = 0.; m.lift = 0.; m.show = 1.; m.sun = iE.z;
  if (mode < .5) {
    float b = iB.w;
    if (b > 0.) { float t = fract(uTime * iB.z + ph); m.lift = b * 4. * t * (1. - t); m.sit = 1. - .75 * smoothstep(0., .3, t) * (1. - smoothstep(.7, 1., t)); m.air = .6 * (1. - m.sit); }
  } else if (mode < 1.5) {
    float r = max(iB.x, .3), dwell = clamp(iB.z, 0., .9), period = 3.883 * r / max(abs(iB.y), .2) / (1. - dwell);
    float turns = uTime / period + ph, k = floor(turns), f = fract(turns), e = clamp((f - dwell) / (1. - dwell), 0., 1.);
    e = e * e * (3. - 2. * e);
    float a = (k + e) * 3.883 * sign(iB.y) + ph * 40.;
    m.pos.xz = iA.xz + r * vec2(cos(a), sin(a));
    vec2 vel = vec2(-sin(a), cos(a)) * sign(iB.y);
    m.yaw = atan(vel.x, vel.y);
    if (iA.y < -500.) { vec2 g = groundAt(m.pos.xz); m.pos.y = g.x; m.sun = g.y; vec2 g2 = groundAt(m.pos.xz + vel * .7); m.pitch = -atan((g2.x - g.x) / .7); }
    m.sit = 1. - smoothstep(.02, .1, e) * (1. - smoothstep(.9, .98, e));
    m.gait = (k + e) * 3.883 * r / STRIDE;
    m.lift = iB.w * abs(sin(m.gait * 3.1416)) * (1. - m.sit);
  } else if (mode < 2.5) {
    // a trail (a habit on the clock): the runner goes to and fro along its own lane, between the stream's own metres iA.x (the lane's lower
    // end) and iA.y (its upper end), at its own ground speed (iB.x, metres a second), resting a share iB.y of each crossing at the end it
    // has reached, where it sits and turns about; every phase reads, and nothing of it knows where the eye is
    float len = max(iA.x - iA.y, 1.), rest = clamp(iB.y, 0., .8), period = 2. * len / max(iB.x, .5) / (1. - rest);
    float t = fract(uTime / period + ph) * 2., back = step(1., t), e = clamp((t - back - rest) / (1. - rest), 0., 1.), hd = 1. - 2. * back;
    float arc = iA.x - (back > .5 ? 1. - e : e) * len, z = arcZ(arc), arrive = 1. - smoothstep(iA.y, iA.y + 14., arc);
    float x = laneX(z, mix(iA.z, iA.w, arrive)), arc2 = arc - .8, z2 = arcZ(arc2), a2 = 1. - smoothstep(iA.y, iA.y + 14., arc2), x2 = laneX(z2, mix(iA.z, iA.w, a2));
    vec2 g = groundAt(vec2(x, z)), g2 = groundAt(vec2(x2, z2));
    // (its heading up the stream, turned about while it rests: half a turn at each end, so it sets off the way it has come)
    m.pos = vec3(x, g.x, z); m.sun = g.y; m.yaw = atan(x2 - x, z2 - z) + 3.1416 * ((1. - back) + smoothstep(0., rest, t - back));
    float go = smoothstep(.4, 4., arc - iA.y) * smoothstep(.4, 4., iA.x - arc);
    m.pitch = -atan((g2.x - g.x) / .8) * hd * go;
    m.sit = 1. - go; m.gait = (iA.x - arc) / STRIDE + ph;
    m.lift = .1 * abs(sin(m.gait * 3.1416)) * go;
  } else if (mode < 3.5) {
    // a leaper's round (a habit on the clock), one body: it sits at its place on the rock (iA.xyz), leaps in through the sheet to its landing
    // on the gallery's floor (iB.xy = x, z; uWayB.w the floor's height) at iD.w metres a second, runs on to its own place (iB.zw) at iE.w
    // metres a second, rests there, runs back, leaps out again to its seat and rests; the whole round takes iA.w seconds and what is left
    // of them after the going is rested, a share on the rock and the remainder in the gallery; every phase reads
    vec3 a = iA.xyz, b = vec3(iB.x, uWayB.w, iB.y), c = vec3(iB.z, uWayB.w, iB.w);
    float lenL = max(distance(a.xz, b.xz), .5), lenR = max(distance(b.xz, c.xz), .01), arc = iE.x, tL = lenL / max(iD.w, 1.), tR = lenR / max(iE.w, .5);
    float idle = max(iA.w - 2. * (tL + tR), .2), r1 = idle * (.35 + .3 * fract(ph * 5.7)), r2 = idle - r1, t = fract(uTime / iA.w + ph) * iA.w;
    // q: the share of the leap done (0 on the rock, 1 on the floor); dr: metres run from the landing; turn: half turns made (0 going in, 1 coming out)
    float q = 1., dr = 0., turn = 0., run = 1.;
    if (t < r1) { q = 0.; run = 0.; turn = 1. + smoothstep(0., r1, t); }
    else if (t < r1 + tL) { q = (t - r1) / tL; run = 0.; }
    else if (t < r1 + tL + tR) dr = (t - r1 - tL) * iE.w;
    else if (t < r1 + tL + tR + r2) { dr = lenR; turn = smoothstep(0., r2, t - r1 - tL - tR); }
    else if (t < r1 + tL + 2. * tR + r2) { dr = lenR - (t - r1 - tL - tR - r2) * iE.w; turn = 1.; }
    else { q = clamp(1. - (t - r1 - tL - 2. * tR - r2) / tL, 0., 1.); run = 0.; turn = 1.; }
    float hd = 1. - 2. * step(.5, turn) * (1. - step(1.5, turn));
    if (run < .5) { float moving = smoothstep(0., .04, q) * (1. - smoothstep(.96, 1., q));
      m.pos = mix(a, b, q); m.yaw = atan(b.x - a.x, b.z - a.z) + 3.1416 * turn; m.lift = arc * 4. * q * (1. - q); m.air = moving; m.sit = 1. - moving;
      m.pitch = -atan(arc * 4. * (1. - 2. * q) / lenL) * hd * moving;
    } else { float moving = smoothstep(0., .8, dr) * (1. - smoothstep(lenR - .6, lenR, dr));
      vec2 dir = normalize(c.xz - b.xz + vec2(1e-4));
      m.pos = mix(b, c, dr / lenR); m.yaw = atan(dir.x, dir.y) + 3.1416 * turn; m.sit = 1. - moving; m.gait = dr / STRIDE + ph;
      m.lift = (.1 + .16 * fract(ph * 7.3)) * abs(sin(m.gait * 3.1416)) * moving; }
  } else if (mode > 5.5) {
    // a swing (mode 6, on the clock): it hangs by its hands from a vine fixed at iA.xyz, iB.z m long, and swings in the upright plane along
    // iB.xy as a pendulum of that length does (period 2 pi sqrt(length / g)), iB.w radians to either hand; every phase reads
    float len = max(iB.z, 1.), th = iB.w * sin(uTime * sqrt(9.81 / len) + ph * 6.2832), reach = len + .85 * iC.z;
    vec3 at = iA.xyz + reach * vec3(iB.x * sin(th), -cos(th), iB.y * sin(th)); vec2 g = groundAt(at.xz);
    m.pos = vec3(at.x, g.x, at.z); m.lift = at.y - g.x; m.sun = g.y; m.yaw = atan(iB.x, iB.y); m.sit = 0.; m.air = 1.; m.pitch = -1.25 - th;
  } else if (mode > 4.5) {
    // to and fro along a line (mode 5, on the clock): from iA.xyz to (iB.x, iE.x, iB.y) and back at iB.z metres a second, resting a share
    // iB.w of each crossing at the end it has reached; the line sags iE.w m in its middle (a log's bow); every phase reads
    vec3 a = iA.xyz, b = vec3(iB.x, iE.x, iB.y); float len = max(distance(a.xz, b.xz), .5), rest = clamp(iB.w, 0., .8), period = 2. * len / max(iB.z, .2) / (1. - rest);
    float t = fract(uTime / period + ph) * 2., back = step(1., t), e = clamp((t - back - rest) / (1. - rest), 0., 1.), go = smoothstep(0., .08, e) * (1. - smoothstep(.92, 1., e));
    vec2 dir = normalize(b.xz - a.xz + vec2(1e-4)) * (1. - 2. * back);
    float along = back > .5 ? 1. - e : e;
    m.pos = mix(a, b, along); m.pos.y -= iE.w * sin(3.1416 * along); m.yaw = atan(dir.x, dir.y); m.sit = 1. - go; m.gait = e * len / STRIDE + ph; m.lift = .08 * abs(sin(m.gait * 3.1416)) * go;
  } else {
    // one runner's round (a habit on the clock): from its place in the gallery to the bridge's head, over the bridge, to the gate, to its own
    // place in the hall, a rest there, and back out the same way to a rest in the gallery (uWayA: the bridge's x, the z of its head and
    // foot, the deck's height; uWayB: the gate's x and z, the floor's height, the gallery's height; the head is the foot of the ramp
    // before the deck). iB.z is its ground speed in metres a
    // second, iB.w the share of each crossing it rests at the end it has reached. Going in it keeps iA.z metres to one hand of the
    // bridge's and the gate's middle, coming out the same to the other hand, so none meets another head on; every phase reads.
    float rest = clamp(iB.w, .02, .8), lane = iA.z;
    vec3 w0 = vec3(iA.x, uWayB.w, iA.y), w4 = vec3(iB.x, uWayB.z, iB.y), c1 = vec3(uWayA.x, uWayA.w, uWayA.y), c2 = vec3(uWayA.x, uWayA.w, uWayA.z), c3 = vec3(uWayB.x, uWayB.z, uWayB.y);
    // (the round's time is taken on the middle line, the same for both hands)
    float period = 2. * (distance(w0, c1) + distance(c1, c2) + distance(c2, c3) + max(distance(c3, w4), .01)) / max(iB.z, .5) / (1. - rest);
    float t = fract(uTime / period + ph) * 2., back = step(1., t), e = clamp((t - back - rest) / (1. - rest), 0., 1.), hd = 1. - 2. * back;
    vec3 w1 = c1 + vec3(lane * hd, 0., 0.), w2 = c2 + vec3(lane * hd, 0., 0.), w3 = c3 + vec3(lane * hd, 0., 0.);
    float l1 = distance(w0, w1), l2 = distance(w1, w2), l3 = distance(w2, w3), l4 = max(distance(w3, w4), .01), tot = l1 + l2 + l3 + l4;
    float d = (back > .5 ? 1. - e : e) * tot, sg = d, lg = l1; vec3 a = w0, b = w1;
    if (d > l1 + l2 + l3) { a = w3; b = w4; sg = d - l1 - l2 - l3; lg = l4; } else if (d > l1 + l2) { a = w2; b = w3; sg = d - l1 - l2; lg = l3; } else if (d > l1) { a = w1; b = w2; sg = d - l1; lg = l2; }
    vec2 dir = normalize(b.xz - a.xz + vec2(1e-4)), prp = vec2(dir.y, -dir.x);
    float moving = smoothstep(0., .6, d) * (1. - smoothstep(tot - .6, tot, d));
    float wv = d * .45 + ph * 40., wd = .42 * moving * smoothstep(0., 2., sg) * (1. - smoothstep(lg - 2., lg, sg)); vec2 vel = (dir + prp * (.45 * wd * cos(wv))) * hd;
    // (while it rests it turns about: half a turn at each end, so it sets off the way it has come)
    m.pos = mix(a, b, clamp(sg / max(lg, .01), 0., 1.)); m.pos.xz += prp * (wd * sin(wv)); m.yaw = atan(vel.x, vel.y) + 3.1416 * (1. - smoothstep(0., rest, t - back));
    // (round 3, A5) its feet are on the floor as built: the house's troop is given the picture of the house's own floors (the gallery's
    // and the passage's floor, the ramp, the deck, the gate's threshold, the hall's floor) in the place of the land's
    m.pos.y = groundAt(m.pos.xz).x;
    m.sit = 1. - moving; m.gait = d / STRIDE + ph; m.lift = (.1 + .16 * fract(ph * 7.3)) * abs(sin(m.gait * 3.1416)) * moving;
  }
  // behind the fall's sheet it is lit by the cave's light (the two lights meet across 2 m at the sheet)
  m.cave = 1. - smoothstep(uSheetZ - 1., uSheetZ + 1., m.pos.z);
  // (round 3, A13) no monkey sinks away by the eye's distance: a band is drawn or is not by the world's sight test
  return m;
}
`,jt=`
attribute vec2 aBone; attribute vec3 aPivot;
void monkeyPose(inout vec3 p, inout vec3 n, Mk m) {
  float part = aBone.x, w = aBone.y, ph = iC.y, c = m.gait * 6.2832, right = step(2.5, part) * step(part, 3.5) + step(4.5, part) * step(part, 5.5);
  c += right * .45;
  float fid = sin(uTime * .9 + ph * 40.), scratch = smoothstep(.72, .95, sin(uTime * .55 + ph * 17.)) * m.sit * step(2.5, part) * step(part, 3.5);
  float tau = mix(mix(.16 * sin(c + .9), -1.05 + .04 * fid, m.sit), -.05, m.air), seated = m.sit * (1. - m.air), hunch = (.42 + .04 * fid) * seated;
  vec3 hip = vec3(0., ${at.hipY}, ${at.hipZ});
  if (part > 1.5 && part < 5.5) {
    bool arm = part < 3.5;
    float up = arm ? mix(mix(.75 * sin(c), .85 - 2.3 * scratch, m.sit), -1.0, m.air) : mix(mix(.85 * sin(c + 2.2), -1.9, m.sit), -.5, m.air);
    float bend = arm ? mix(mix(-.9 * max(0., sin(c + 1.2)), -.25 - 1.5 * scratch, m.sit), -.45, m.air) : mix(mix(max(0., sin(c + 4.1)), 2.1, m.sit), 1.7, m.air);
    vec3 q = p - aPivot, kn = vec3(0., -${(at.limb/2).toFixed(3)}, 0.);
    float lw = smoothstep(.4, .6, w);
    q = mix(q, rotX(q - kn, bend) + kn, lw); n = mix(n, rotX(n, bend), lw);
    p = aPivot + rotX(q, up); n = rotX(n, up);
    if (!arm) { float splay = sign(aPivot.x) * .75 * seated; p = aPivot + rotY(p - aPivot, splay); n = rotY(n, splay); p.x += sign(aPivot.x) * .03 * seated; }
  } else if (part > .5 && part < 1.5 || part > 6.5) {
    float nod = -tau * .85 - hunch * .75 + (iE.y + .08 * fid) * m.sit - .25 * m.air, turn = (.45 * sin(uTime * .7 + ph * 23.) + .55 * sin(ph * 57.)) * m.sit;
    vec3 q = rotY(p - aPivot, turn); n = rotY(n, turn);
    p = aPivot + rotX(q, nod); n = rotX(n, nod);
    if ((part > 6.5 && part < 7.5 && abs(iC.w - 1.) > .5) || (part > 7.5 && abs(iC.w - 2.) > .5)) p = aPivot;
  } else if (part > 5.5) {
    float sway = sin(uTime * 1.3 + ph * 31.), curl = mix(mix(1.1 + .3 * sin(c * .5), 2.3 + .9 * sway, m.sit), 1.3 + .8 * sin(uTime * 6. + ph * 9. - w * 3.), m.air);
    float lift = mix(mix(.6 + .2 * sin(c), .12 - tau, m.sit), .3, m.air) + w * w * curl, side2 = w * .7 * sin(uTime * .8 + ph * 29.) * m.sit;
    vec3 q = rotY(rotX(p - aPivot, lift), side2); p = aPivot + q; n = rotY(rotX(n, lift), side2);
  } else {
    // the trunk: broad haunches where it sits
    p.x *= 1. + .4 * seated * (1. - smoothstep(-.22, .04, p.z));
  }
  // the bent back: the fore half of the trunk, the head, the arms and what is carried curl forward about the middle of the spine
  if (part < 3.5 || part > 6.5) { vec3 sp = vec3(0., .41, 0.); float hw = part < .5 ? smoothstep(-.06, .2, p.z) : 1.; p = sp + rotX(p - sp, hunch * hw); n = rotX(n, hunch * hw); }
  if (part < 3.5 || part > 5.5) { p = hip + rotX(p - hip, tau); n = rotX(n, tau); }
  p.y -= .24 * m.sit * (1. - m.air);
  p *= iC.z * m.show;
  p = rotX(p, m.pitch); n = rotX(n, m.pitch);
  p = rotY(p, m.yaw); n = rotY(n, m.yaw);
  p += m.pos + vec3(0., m.lift, 0.);
}
`,Ut=(e,t,r)=>e+(t-e)*r,$t=(e,t,r)=>{const c=j((r-e)/(t-e),0,1);return c*c*(3-2*c)};function Jt(e,t,r,c,b,y,p,w,z,M,x,h){const o=at,s=Ut,d=$t,a=b===3||b===5?1:0,n=h.c+a*.45,l=h.fid,g=h.scratch*M*(b===3?1:0),u=s(s(.16*Math.sin(n+.9),-1.05+.04*l,M),-.05,x),v=M*(1-x),i=(.42+.04*l)*v;let f,m,A;if(b>1.5&&b<5.5){const S=b<3.5,F=S?s(s(.75*Math.sin(n),.85-2.3*g,M),-1,x):s(s(.85*Math.sin(n+2.2),-1.9,M),-.5,x),Z=S?s(s(-.9*Math.max(0,Math.sin(n+1.2)),-.25-1.5*g,M),-.45,x):s(s(Math.max(0,Math.sin(n+4.1)),2.1,M),1.7,x);let _=r-w,G=c-z;const Y=-o.limb/2,N=d(.4,.6,y);f=Math.cos(Z),m=Math.sin(Z),A=_-Y;const W=A*f-G*m+Y,I=A*m+G*f;if(_=s(_,W,N),G=s(G,I,N),f=Math.cos(F),m=Math.sin(F),r=w+_*f-G*m,c=z+_*m+G*f,!S){const k=Math.sign(p),B=k*.75*v;f=Math.cos(B),m=Math.sin(B);const T=t-p,R=c-z;t=p+T*f+R*m+k*.03*v,c=z-T*m+R*f}}else if(b===1||b>6.5){const S=-u*.85-i*.75+(h.look+.08*l)*M-.25*x,F=h.turn*M;f=Math.cos(F),m=Math.sin(F);const Z=t-p,_=c-z,G=Z*f+_*m,Y=-Z*m+_*f,N=r-w;f=Math.cos(S),m=Math.sin(S),t=p+G,r=w+N*f-Y*m,c=z+N*m+Y*f}else if(b===6){const S=s(s(1.1+.3*Math.sin(n*.5),2.3+.9*h.sway,M),1.3+.8*Math.sin(h.theta-y*3),x),F=s(s(.6+.2*Math.sin(n),.12-u,M),.3,x)+y*y*S,Z=y*.7*h.side*M;f=Math.cos(F),m=Math.sin(F);const _=r-w,G=c-z,Y=_*f-G*m,N=_*m+G*f,W=t-p;f=Math.cos(Z),m=Math.sin(Z),t=p+W*f+N*m,r=w+Y,c=z-W*m+N*f}else t*=1+.4*v*(1-d(-.22,.04,c));if(b<3.5||b>6.5){const S=i*(b<.5?d(-.06,.2,c):1);f=Math.cos(S),m=Math.sin(S),A=r-.41,r=.41+A*f-c*m,c=A*m+c*f}if(b<3.5||b>5.5){f=Math.cos(u),m=Math.sin(u);const S=r-o.hipY,F=c-o.hipZ;r=o.hipY+S*f-F*m,c=o.hipZ+S*m+F*f}return e[0]=t,e[1]=r-.24*M*(1-x),e[2]=c,e}let bt=null;function Qt(){if(bt)return bt;U||(U=ft(),ut=ft(!0));const e=U.getAttribute("position").array,t=U.getAttribute("aBone").array,r=U.getAttribute("aPivot").array,c=e.length/3,b=[0,0,0],y=o=>{const s=o.length,d={at:o,n:s,foot:new Float32Array(s).fill(1e9),top:new Float32Array(s).fill(-1e9),rho:new Float32Array(s).fill(0),cs:new Float32Array(s),sn:new Float32Array(s)};for(let a=0;a<s;a++)d.cs[a]=Math.cos(o[a]),d.sn[a]=Math.sin(o[a]);return d},p=(o,s,d,a)=>{const n=o.foot,l=o.top,g=o.rho,u=o.cs,v=o.sn,i=o.n;for(let f=0;f<c;f++){const m=Math.round(t[f*2]),A=m===3?a.scr:m===1||m>6.5?a.head:m===6?a.tail:a.one;for(let S=0;S<A.length;S++){Jt(b,e[f*3],e[f*3+1],e[f*3+2],m,t[f*2+1],r[f*3],r[f*3+1],r[f*3+2],s,d,A[S]);const F=b[0]*b[0],Z=b[1],_=b[2];for(let G=0;G<i;G++){const Y=Z*u[G]-_*v[G],N=Z*v[G]+_*u[G],W=F+N*N;Y>l[G]&&(l[G]=Y),Y<n[G]&&(n[G]=Y),W>g[G]&&(g[G]=W)}}}},w=(o,s,d,a)=>{const n={c:o,fid:0,scratch:0,look:0,turn:0,sway:0,side:0,theta:0},l=[],g=[],u=[],v=[],i=a?[-1,1]:[-1,0,1],f=d>0?8:1;if(!(s>0)){for(let m=0;m<f;m++)v.push({...n,theta:m/f*O});return{one:[n],scr:[n],head:[n],tail:v}}for(const m of a?[0]:[-1,1]){l.push({...n,fid:m});for(const A of[0,1])g.push({...n,fid:m,scratch:A});for(const A of[0,-.55])for(const S of i)u.push({...n,fid:m,look:A,turn:S});for(const A of i)for(const S of i)for(let F=0;F<(d>0?4:1);F++)v.push({...n,fid:m,sway:A,side:S,theta:F/4*O})}return{one:l,scr:g,head:u,tail:v}},z=[-.8,-.6,-.4,-.3,-.2,-.1,0,.1,.2,.3,.4,.6,.8],M=[-2.2,-2,-1.8,-1.6,-1.4,-1.2,-1,-.8,-.6,-.4,-.2],x={sit:y([0]),hop:y([0]),run:y(z),leap:y(z),swing:y(M)},h=w(0,1,0,!1);p(x.sit,1,0,h),p(x.run,1,0,h),x.hop.foot[0]=x.sit.foot[0],x.hop.top[0]=x.sit.top[0],x.hop.rho[0]=x.sit.rho[0],x.leap.foot.set(x.run.foot),x.leap.top.set(x.run.top),x.leap.rho.set(x.run.rho);for(const o of[.25,.5,.75,1])p(x.hop,1-.75*o,.45*o,w(0,1-.75*o,.45*o,!0)),p(x.leap,1-o,o,w(0,1-o,o,!0));p(x.swing,0,1,w(0,0,1,!0));for(let o=0;o<16;o++){const s=o/16*2*O;if(p(x.run,0,0,w(s,0,0,!0)),o%4===0)for(const d of[.33,.67])p(x.run,d,0,w(s,d,0,!0))}for(const o in x)for(let s=0;s<x[o].n;s++)x[o].rho[s]=Math.sqrt(x[o].rho[s]);return bt=x}function Ce(e,t,r=0,c=r){const b=Qt()[e],y=b.at,p=Math.min(r,c),w=Math.max(r,c);if(p<y[0]-1e-6||w>y[b.n-1]+1e-6)return null;let z=0,M=b.n-1;for(;z<b.n-1&&y[z+1]<=p+1e-6;)z++;for(;M>0&&y[M-1]>=w-1e-6;)M--;let x=1e9,h=-1e9,o=0,s=0;for(let a=z;a<=M;a++)x=Math.min(x,b.foot[a]),h=Math.max(h,b.top[a]),o=Math.max(o,b.rho[a]),a>z&&(s=Math.max(s,y[a]-y[a-1]));const d=1/Math.cos(s/2);return[x*(x<0?d:1/d)*t,h*d*t,o*d*t]}let U=null,ut=null;function Fe(e,t,{shadows:r=!0}={}){U||(U=ft(),ut=ft(!0));const c=e.length,b=new Float32Array(c*4),y=new Float32Array(c*4),p=new Float32Array(c*4),w=new Float32Array(c*4),z=new Float32Array(c*4);e.forEach((g,u)=>{b.set(g.a,u*4),y.set(g.b,u*4),p.set([g.mode,g.ph,g.size,g.carry||0],u*4),w.set([g.tint[0],g.tint[1],g.tint[2],g.kLeap||0],u*4),z.set([g.arc||0,g.look||0,g.sun??1,g.kRun||0],u*4)});const M={iA:new C.InstancedBufferAttribute(b,4),iB:new C.InstancedBufferAttribute(y,4),iC:new C.InstancedBufferAttribute(p,4),iD:new C.InstancedBufferAttribute(w,4),iE:new C.InstancedBufferAttribute(z,4)},x=g=>{const u=new C.InstancedBufferGeometry;u.index=g.index;for(const v of["position","normal","color","aBone","aPivot"])u.setAttribute(v,g.getAttribute(v));for(const v in M)u.setAttribute(v,M[v]);return u.instanceCount=c,u},h=x(U),o=x(ut),s={...X.fogUniforms(),uTime:t.uTime,tGround:t.tGround,uGBox:t.uGBox,tCourse:t.tCourse,uCBox:t.uCBox,uKeyDir:t.uKeyDir,uKeyCol:t.uKeyCol,uSky:t.uSky,uGround:t.uGround,uRipple:t.uRipple,uWayA:t.uWayA||{value:new C.Vector4},uWayB:t.uWayB||{value:new C.Vector4},uArc:t.uArc||{value:new C.Vector4},uCaveAir:t.uCaveAir||wt(),uAirZ:t.uAirZ||{value:-1e6},uSheetZ:t.uSheetZ||{value:-1e6},uKeyDir2:t.uKeyDir2||t.uKeyDir,uKeyCol2:t.uKeyCol2||t.uKeyCol,uSky2:t.uSky2||t.uSky,uGround2:t.uGround2||t.uGround},d=new C.ShaderMaterial({uniforms:s,fog:!0,vertexColors:!0,side:C.DoubleSide,vertexShader:X.GLSL_FOG_PARS_VERT+Tt+jt+`
      varying vec3 vN, vCol, vW; varying float vSun, vIn;
      void main() { Mk m = monkeyPlace(); vec3 p = position, n = normal; monkeyPose(p, n, m);
        vN = n; vCol = color * iD.rgb; vW = p; vSun = m.sun; vIn = m.cave;
        vec4 mvPosition = viewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition; ${X.GLSL_FOG_VERT} }`,fragmentShader:X.GLSL_FOG_PARS_FRAG+tt+P+`
      uniform vec3 uKeyDir, uKeyCol, uSky, uGround, uKeyDir2, uKeyCol2, uSky2, uGround2; uniform float uRipple, uTime, uAirZ; varying vec3 vN, vCol, vW; varying float vSun, vIn;
      void main() {
        vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.), v = normalize(cameraPosition - vW);
        vec3 kd = normalize(mix(uKeyDir, uKeyDir2, vIn)), kc = mix(uKeyCol, uKeyCol2, vIn), sk = mix(uSky, uSky2, vIn), gr = mix(uGround, uGround2, vIn);
        float key = max(dot(n, kd) * .7 + .3, 0.); key *= key;
        float rip = mix(1., .65 + .7 * hNoise(vW.xy * .5 + vec2(vW.z * .3, uTime * 1.3)), max(uRipple, vIn));
        vec3 amb = mix(gr, sk, n.y * .5 + .5);
        float rim = clamp(1. - dot(n, v), 0., 1.); rim = rim * rim * rim;
        vec3 col = vCol * (amb + kc * key * mix(vSun, 1., vIn) * rip) + rim * .1 * (sk + kc * mix(vSun, 1., vIn) * .5);
        gl_FragColor = vec4(airFog(col, airBehind(vW.z, uAirZ)), 1.); }`}),a=new C.Mesh(h,d);a.frustumCulled=!1;const n=new C.Group;n.add(a);let l=null;if(r){const g=new C.InstancedBufferGeometry,u=[0,0,0],v=[];for(let f=0;f<8;f++){const m=O*f/8;u.push(Math.cos(m),0,Math.sin(m)),v.push(0,1+(f+1)%8,1+f)}g.setAttribute("position",new C.Float32BufferAttribute(u,3)),g.setIndex(v);for(const f in M)g.setAttribute(f,M[f]);g.instanceCount=c;const i=new C.ShaderMaterial({uniforms:s,fog:!0,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:X.GLSL_FOG_PARS_VERT+Tt+`
        varying float vA, vZ;
        void main() { Mk m = monkeyPlace(); float r = length(position.xz); vZ = m.pos.z;
          vec3 p = position * vec3(.36, 0., .5) * iC.z * m.show; p = rotY(rotX(p, m.pitch), m.yaw) + m.pos + vec3(0., .05, 0.);
          vA = (1. - r) * .62 * (1. - smoothstep(.15, 1.6, m.lift)) * m.show;
          vec4 mvPosition = viewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition; ${X.GLSL_FOG_VERT} }`,fragmentShader:X.GLSL_FOG_PARS_FRAG+tt+`
        uniform float uAirZ; varying float vA, vZ; void main() { float a = clamp(vA, 0., 1.); gl_FragColor = vec4(vec3(.02, .03, .05), a * (1. - airAmt(airBehind(vZ, uAirZ)))); }`});l=new C.Mesh(g,i),l.frustumCulled=!1,l.renderOrder=1,n.add(l)}return{object:n,body:a,shadow:l,uniforms:s,count:c,geometries:[h,o],setFar(g){const u=g?o:h;a.geometry!==u&&(a.geometry=u)},triangles:c*(U.index.count/3+(r?8:0)),trianglesFar:c*(ut.index.count/3+(r?8:0))}}const _t=9.81;function Zt(e,t){return Math.sqrt(Math.max(0,2*(e.H-t)/_t))}function Pt(e){return(e.sheetZ-e.lipZ)/Zt(e,(e.galY+e.galTop)/2)}async function te(e,t,r,c=1,b){const y=Zt(e,-.6),p=Pt(e),w=44,z=46,M=-1.1,x=[],h=[],o=[];for(let l=0;l<2;l++){const g=x.length/3;for(let u=0;u<=z;u++)for(let v=0;v<=w;v++){const i=v/w,f=(i-.5)*(e.W+l*3),m=M+(y-M)*u/z,A=Math.max(m,0),S=r.n2(f*.09+l*5.1,3.7)*.5+r.n2(f*.31,9.2+l)*.22,F=e.lipZ+.8*r.n2(f*.06,1.1)+(p+.32*S+l*.42)*m+l*.25;x.push(c*f,e.H-.5*_t*A*A+(m<0?.25*m:0)+.15,F),h.push(f,m,i,l)}for(let u=0;u<z;u++)for(let v=0;v<w;v++){const i=g+u*(w+1)+v,f=i+1,m=i+w+1,A=m+1;c>0?o.push(i,m,f,f,m,A):o.push(i,f,m,f,A,m)}b&&await b()}const s=new C.BufferGeometry;s.setAttribute("position",new C.Float32BufferAttribute(x,3)),s.setAttribute("aXT",new C.Float32BufferAttribute(h,4)),s.setIndex(o),s.computeBoundingSphere();const d={...X.fogUniforms(),uTime:t.uTime,uLit:t.uFallLit,uShade:t.uFallShade,uDeep:t.uFallDeep,uInner:t.uFallInner,uSunDir:t.uSunDir,uTMax:{value:y}},a=new C.ShaderMaterial({uniforms:d,fog:!0,transparent:!0,depthWrite:!1,side:C.DoubleSide,vertexShader:X.GLSL_FOG_PARS_VERT+`attribute vec4 aXT; varying vec4 vXT; varying vec3 vW; varying float vEye;
      void main() { vXT = aXT; vW = position; vec4 mvPosition = viewMatrix * vec4(position, 1.); vEye = length(mvPosition.xyz); gl_Position = projectionMatrix * mvPosition; ${X.GLSL_FOG_VERT} }`,fragmentShader:X.GLSL_FOG_PARS_FRAG+P+`
      uniform float uTime, uTMax; uniform vec3 uLit, uShade, uDeep, uInner, uSunDir; varying vec4 vXT; varying vec3 vW; varying float vEye;
      float dens(vec2 q) { return hNoise(vec2(q.x * .2, q.y * .5)) * .46 + hNoise(vec2(q.x * .75 + 3., q.y * 1.6 + 1.3)) * .34 + hNoise(vec2(q.x * 2.4, q.y * 4.8)) * .2; }
      void main() {
        float t = max(vXT.y, 0.), L = vXT.w, uu = clamp(vXT.z, 0., 1.);
        vec2 q = vec2(vXT.x + L * 17., t - uTime * (1. + .08 * L) + L * 2.3);
        float d = dens(q), dx = dens(q + vec2(.4, 0.)) - d, dt = dens(q + vec2(0., .07)) - d;
        // thinner at the two edges, at the foot (spray), and on the outer sheet; whole at the lip
        float edge = smoothstep(0., .1, uu) * (1. - smoothstep(.9, 1., uu));
        float bias = mix(-.34, .1, edge) - .1 * smoothstep(.62, 1., t / uTMax) - L * .2 + .5 * (1. - smoothstep(0., .5, t));
        float body = smoothstep(.34, .6, d + bias);
        // the threads (they ride down with the water as the clumps do), how far they are parted, and the thread at the eye itself
        float th = hNoise(vec2(vXT.x * 2.6 + L * 9., q.y * .3)) * .6 + hNoise(vec2(vXT.x * 7.1 + 5., q.y * .8 + 2.)) * .4;
        float threads = smoothstep(.36, .6, th + (d - .5) * .4), parted = 1. - smoothstep(7., 36., vEye), touch = smoothstep(.4, 2.2, vEye);
        float open = mix(1., threads, parted) * touch;
        if (gl_FrontFacing) {
          vec3 n = normalize(vec3(-dx * 7., dt * 5., 1.));
          float sun = clamp(dot(n, normalize(vec3(uSunDir.x, uSunDir.y, abs(uSunDir.z) + .35))), 0., 1.);
          float fold = smoothstep(.36, .72, d + bias * .5);
          vec3 col = mix(uDeep, mix(uShade, uLit, sun * sun * (.35 + .65 * fold)), fold);
          // the smooth water bending over the lip: glassy, the colour of the pools
          col = mix(col, mix(uDeep * 1.6, uLit, .35 + .4 * d), 1. - smoothstep(-.6, .35, vXT.y));
          gl_FragColor = vec4(fxApplyFog(col), body * (.82 + .18 * fold) * open);
        } else {
          float sh = hNoise(vec2(q.x * .55, q.y * 3.2 + uTime * .7));
          vec3 col = uInner * (.5 + .95 * d + .35 * sh) * (.6 + .4 * edge);
          gl_FragColor = vec4(fxApplyFog(col), mix(.4, .72, body) * mix(1., .3 + .7 * threads, parted) * touch);
        }
      }`}),n=new C.Mesh(s,a);return n.renderOrder=2,{object:n,uniforms:d,tMax:y,v0:p,triangles:o.length/3}}function ee(e,t){const r=e.length,c=new Float32Array(r*4),b=new Float32Array(r*4),y=new Float32Array(r*4);e.forEach((x,h)=>{c.set([x.p[0],x.p[1],x.p[2],x.size],h*4),b.set([x.drift[0],x.rise,x.drift[1],x.life],h*4),y.set([x.ph,x.op,x.grow??1.6,0],h*4)});const p=new C.InstancedBufferGeometry;p.setAttribute("position",new C.Float32BufferAttribute([-1,-1,0,1,-1,0,-1,1,0,1,1,0],3)),p.setIndex([0,1,2,2,1,3]),p.setAttribute("iA",new C.InstancedBufferAttribute(c,4)),p.setAttribute("iB",new C.InstancedBufferAttribute(b,4)),p.setAttribute("iC",new C.InstancedBufferAttribute(y,4)),p.instanceCount=r;const w={...X.fogUniforms(),uTime:t.uTime,uLit:t.uMistLit,uShade:t.uMistShade,uSunDir:t.uSunDir,uBow:t.uBow,uMistAmt:t.uMistAmt,uCaveAir:t.uCaveAir||wt(),uAirZ:t.uAirZ||{value:-1e6}},z=new C.ShaderMaterial({uniforms:w,fog:!0,transparent:!0,depthWrite:!1,vertexShader:X.GLSL_FOG_PARS_VERT+`attribute vec4 iA, iB, iC; uniform float uTime, uMistAmt; varying vec2 vC; varying vec4 vI; varying vec3 vW;
      void main() {
        float age = fract(uTime / iB.w + iC.x), size = iA.w * mix(.55, iC.z, age);
        vec3 c = iA.xyz + vec3(iB.x, iB.y, iB.z) * age * iB.w;
        vec4 mvPosition = viewMatrix * vec4(c, 1.);
        float near = smoothstep(.25, 1.1, -mvPosition.z / max(size, .01));
        mvPosition.xy += position.xy * size;
        vC = position.xy; vI = vec4(age, iC.y * smoothstep(0., .18, age) * (1. - smoothstep(.55, 1., age)) * near * uMistAmt, iC.x * 37., size);
        vW = (cameraPosition + (inverse(viewMatrix) * vec4(mvPosition.xyz, 0.)).xyz);
        gl_Position = projectionMatrix * mvPosition; ${X.GLSL_FOG_VERT} }`,fragmentShader:X.GLSL_FOG_PARS_FRAG+tt+P+`
      uniform vec3 uLit, uShade, uSunDir; uniform float uBow, uTime, uAirZ; varying vec2 vC; varying vec4 vI; varying vec3 vW;
      void main() {
        float r = length(vC); if (r > 1.) discard;
        float er = hFbm(vC * 1.7 + vI.z + vec2(0., -vI.x * .8));
        float a = (1. - smoothstep(.25, 1., r + (er - .5) * .7)) * vI.y;
        if (a < .004) discard;
        vec3 col = mix(uShade, uLit, clamp(.55 + .45 * vC.y + (er - .5) * .5, 0., 1.));
        // the bow: 42 degrees round the point opposite the sun; red outside, violet inside; only where the mist is. (Round 3, A14) It
        // stands by the sun's place, the puff's place and the angle of the sight line between them alone, as a bow does: it is no longer
        // dimmed by how near the eye is. A puff at the lens thins by the puff's own rule for a medium at the lens (near, above: its
        // whole strength, the bow in it too, goes from a quarter of its own size to 1.1 of it from the lens).
        float cs = dot(normalize(vW - cameraPosition), -uSunDir), x = (cs - .743) / .05;
        vec3 bow = vec3(smoothstep(-1., -.35, x) * (1. - smoothstep(-.1, .45, x)), smoothstep(-.55, 0., x) * (1. - smoothstep(.2, .75, x)), smoothstep(-.1, .45, x) * (1. - smoothstep(.6, 1., x)));
        col += bow * uBow * .55;
        gl_FragColor = vec4(airFog(col, airBehind(vW.z, uAirZ)), a); }`}),M=new C.Mesh(p,z);return M.frustumCulled=!1,M.renderOrder=3,{object:M,uniforms:w,count:r,triangles:r*2}}const Gt=(e,t)=>e+2.6*Math.sin(t*.11)+1.2*Math.sin(t*.29+1.7),Wt=(e,t)=>e.half*j(.5+.5*Math.sin(t*.19+.6)+.32*Math.sin(t*.47+2),0,1.25)*V(e.zN,e.zN+6,t)*(1-V(e.zS-6,e.zS,t)),oe=`
const mat3 ROCK_M = mat3(0., .8, .6, -.8, .36, -.48, -.6, -.48, .64);
float rockH(vec3 p, float fw) {
  vec3 q = ROCK_M * p; float h = hNoise3(q * .38) * .5;
  q = ROCK_M * q; h += hNoise3(q * 1.05 + 7.3) * .3 * (1. - smoothstep(.2, .8, fw * 1.05));
  q = ROCK_M * q; h += hNoise3(q * 3.1 + 3.1) * .2 * (1. - smoothstep(.2, .8, fw * 3.1));
  return h; }
// the surface's normal tipped by the slope of a height h (in metres) over the surface
vec3 rockBump(vec3 p, vec3 n, float h) {
  vec3 dpx = dFdx(p), dpy = dFdy(p); float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, n), r2 = cross(n, dpx); float det = dot(dpx, r1);
  return normalize(abs(det) * n - sign(det) * (hx * r1 + hy * r2)); }
`,qt=`
uniform float uTime; uniform vec3 uAmb, uWater, uCurtain, uShaftDir, uShaftCol, uRing, uRingCol, uFireCol; uniform vec4 uCrack, uReach, uGal, uFire[3];
float crackX(float z) { return uCrack.x + 2.6 * sin(z * .11) + 1.2 * sin(z * .29 + 1.7); }
float crackW(float z) { return uCrack.w * clamp(.5 + .5 * sin(z * .19 + .6) + .32 * sin(z * .47 + 2.), 0., 1.25) * smoothstep(uCrack.z, uCrack.z + 6., z) * (1. - smoothstep(uCrack.y - 6., uCrack.y, z)); }
// how much of a shaft's light reaches p (0..1)
float shaftAt(vec3 p) {
  float k = max(uReach.z - p.y, 0.) / max(uShaftDir.y, .2); vec2 q = p.xz + uShaftDir.xz * k;
  float w = crackW(q.y), d = abs(q.x - crackX(q.y));
  return (1. - smoothstep(w * .2, w + 1.5, d)) * smoothstep(.05, .6, w); }
// how near the crack's light a place is (1 under its line, a half some 22 m from it): what grows in the hall grows by it
float crackNear(vec3 p) { float cz = clamp(p.z, uCrack.z, uCrack.y), cdx = p.x - crackX(cz) + uShaftDir.x * (uReach.z - p.y) / max(uShaftDir.y, .2), cdz = p.z - cz; return 1. / (1. + (cdx * cdx + cdz * cdz) / 500.); }
// the ripples of light thrown by the water: bright thin ridges on a soft ground, sliding down
float waterRipple(vec3 p) {
  vec3 c = p * .8; float fwp = length(fwidth(p));
  float a = hNoise3(c + vec3(.13, .9, .21) * uTime), b = hNoise3(c * 1.9 + vec3(-.2, 1.5, .3) * uTime + a * 1.4);
  float k = 1. - abs(2. * b - 1.);
  // it comes and goes in drifting patches, so that no wall wears it like a pattern
  float drift = smoothstep(.34, .68, hNoise3(p * .09 + vec3(.05, .11, .03) * uTime + 9.));
  // (the ridges stand about 0.7 m apart: where a pixel covers more than a third of that, as on a wall running away from us, the net goes to its mean)
  return mix(k * k * k, .25, smoothstep(.12, .5, fwp)) * drift; }
vec3 caveLight(vec3 p, vec3 n, float ao) {
  vec3 dc = uCurtain - p; float lc = length(dc); dc /= max(lc, .01);
  float att = 1. / (1. + (lc * lc) / (uReach.x * uReach.x));
  float rp = waterRipple(p) * smoothstep(.03, .45, att);
  vec3 l = uWater * att * clamp(dot(n, dc) * .55 + .45, 0., 1.) * (.7 + .9 * rp) * mix(vec3(.84, .96, 1.), vec3(1.1, 1., .8), rp);
  l += uShaftCol * shaftAt(p) * clamp(dot(n, uShaftDir) * .8 + .2, 0., 1.);
  // the crack's light thrown about the hall under it: soft, warm, from above, strongest under its line
  float cz = clamp(p.z, uCrack.z, uCrack.y), cdx = p.x - crackX(cz), cdy = uReach.z - p.y, cdz = p.z - cz;
  l += uShaftCol * vec3(1.02, .94, .8) * uReach.w * (.35 + .65 * clamp(n.y * .6 + .4, 0., 1.)) / (1. + (cdx * cdx + cdz * cdz + .3 * cdy * cdy) / 500.);
  vec3 dr = uRing - p; float lr = length(dr); dr /= max(lr, .01);
  l += uRingCol * clamp(dot(n, dr) * .6 + .4, 0., 1.) / (1. + (lr * lr) / (uReach.y * uReach.y));
  // the stoves' fires: each lights the stone and the floor about it (half at 6 m), flickering on the clock
  for (int i = 0; i < 3; i++) { vec3 df = uFire[i].xyz - p; float lf = length(df); df /= max(lf, .01);
    float fl = .75 + .5 * hNoise(vec2(uTime * 6. + float(i) * 17.3, float(i) * 3.1));
    l += uFireCol * uFire[i].w * fl * clamp(dot(n, df) * .6 + .4, 0., 1.) / (1. + lf * lf / 36.); }
  return l + uAmb * (.62 + .38 * n.y) * ao; }
`;function Rt(e){return{...X.fogUniforms(),uTime:e.uTime,uAmb:e.uCaveAmb,uWater:e.uWaterLight,uCurtain:e.uCurtain,uShaftDir:e.uShaftDir,uShaftCol:e.uShaftCol,uRing:e.uRing,uRingCol:e.uRingCol,uCrack:e.uCrack,uReach:e.uReach,uGal:e.uGal,uFire:e.uFire,uFireCol:e.uFireCol,uPlum:e.uPlum,uPetal:e.uPetal,uCaveAir:e.uCaveAir||wt()}}function ae(e){return new C.ShaderMaterial({uniforms:Rt(e),fog:!0,vertexColors:!0,side:C.DoubleSide,vertexShader:X.GLSL_FOG_PARS_VERT+`attribute float aKind; varying vec3 vW, vN, vCol; varying float vKind;
      void main() { vW = (modelMatrix * vec4(position, 1.)).xyz; vN = normalize(mat3(modelMatrix) * normal); vCol = color; vKind = aKind;
        vec4 mvPosition = viewMatrix * vec4(vW, 1.); gl_Position = projectionMatrix * mvPosition; ${X.GLSL_FOG_VERT} }`,fragmentShader:X.GLSL_FOG_PARS_FRAG+tt+P+oe+qt+`
      uniform vec4 uPlum; uniform vec3 uPetal; varying vec3 vW, vN, vCol; varying float vKind;
      void main() {
        vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.), p = vW, alb = vCol, v = normalize(cameraPosition - p);
        float fw = max(length(dFdx(p)), length(dFdy(p))), h = rockH(p, fw), ao = .72 + .56 * (h - .5);
        float wet = 1. / (1. + dot(uCurtain - p, uCurtain - p) / 1600.), grown = max(smoothstep(uGal.y + 1., uGal.y + 11., p.z), crackNear(p));
        float gloss = 0., pud = 0.;
        // the roof's crack is an opening: the roof's own skin (what faces down, up there) is not drawn inside its ragged outline
        if (vKind < .5 && p.y > uReach.z - 4. && n.y < .2) { float w = crackW(p.z); if (w > .35 && abs(p.x - crackX(p.z)) < w - .15 + (hNoise(p.zx * .7) - .5) * .9) discard; }
        vec3 mossC = vec3(.055, .11, .035) * (.7 + .6 * h);
        if (vKind > 6.5) { float fl = .65 + .7 * hNoise(vec2(p.x * 5. + p.z * 5. + uTime * 2.3, p.y * 6. - uTime * 3.1)); gl_FragColor = vec4(airFog(alb * (.6 + 1.6 * fl), 1.), 1.); return; }
        if (vKind > 5.5) {
          // the crack's own walls: rock in the day's light, brighter toward the sky
          alb *= .7 + .6 * h; n = rockBump(p, n, h * .5); alb = mix(alb, mossC * 1.6, .35 * smoothstep(.45, .7, h));
          vec3 sky = uShaftCol * (.16 + .5 * smoothstep(uReach.z, uReach.z + 9., p.y)) * (.35 + .65 * clamp(dot(n, uShaftDir), 0., 1.)) + uAmb * .5;
          gl_FragColor = vec4(airFog(alb * mix(caveLight(p, n, ao) + uShaftCol * .16, sky, smoothstep(uReach.z - 2.5, uReach.z + 1.5, p.y)), 1.), 1.); return; }
        if (vKind > 4.5) {
          gloss = .25;
        } else if (vKind > 1.5) {
          // iron: plates 2.4 m long with seams and rivets, rust where the damp sits
          float seam = abs(fract(p.z / 2.4) - .5) * 2.4, rust = smoothstep(.45, .75, h + .25 * (1. - smoothstep(0., .25, seam)));
          vec2 rv = fract(vec2(p.x, p.z) * 2.5) - .5; float nearK = 1. - smoothstep(.02, .08, fw);
          alb = mix(alb, vec3(.17, .062, .03), rust) * (.8 + .4 * h);
          alb *= 1. - .45 * (1. - smoothstep(.02, .07, seam)) * nearK;
          alb += .1 * (1. - smoothstep(.1, .16, length(rv))) * (1. - smoothstep(.18, .3, seam)) * nearK;
          gloss = .5;
        } else if (vKind > .5) {
          // the flagged floor: slabs about 2.2 m, each a little its own tone, worn pale along the hall's middle
          vec2 g = p.xz / 2.2 + .22 * vec2(hNoise(p.zx * .07), hNoise(p.xz * .07 + 9.));
          g.x += .5 * floor(g.y); vec2 f = fract(g), cell = floor(g);
          float je = min(min(f.x, 1. - f.x), min(f.y, 1. - f.y)), joint = smoothstep(.0, .03 + fw * .3, je), jk = 1. - smoothstep(.1, .6, fw);
          alb *= (.84 + .3 * hHash(cell)) * (1. - .42 * (1. - joint) * jk) * (.82 + .36 * h);
          // moss in the joints where the roof's light or the water's damp reaches
          float jm = (1. - smoothstep(.015, .075, je + (hNoise(p.xz * 2.7) - .5) * .05)) * smoothstep(.25, .6, grown) * jk;
          alb = mix(alb, mossC, jm * .9);
          // puddles in the low flags (about one flag in four, in drifts): still water that holds the light above it
          // (pools of their own shape, a metre or two across, lying over the joints, in drifts down the hall)
          float low = smoothstep(.58, .68, hNoise(p.xz * .42 + 21.) * .8 + hNoise(p.xz * 1.3 + 3.) * .2) * smoothstep(.4, .55, hNoise(p.xz * .05 + 21.));
          pud = low * (1. - smoothstep(.15, .8, fw));
          // fallen petals: thick under the plum and before the moon-door, thinning away from them
          float pk = .5 * max(exp(-dot(p.xz - uPlum.xy, p.xz - uPlum.xy) / (uPlum.z * uPlum.z)), exp(-dot(p.xz - uRing.xz, p.xz - uRing.xz) / 240.));
          vec2 pc = floor(p.xz / .24), pf = fract(p.xz / .24) - .5; float pr = hHash(pc);
          if (pr < pk && fw < .12) { float a = pr * 97., c = cos(a), sn = sin(a); vec2 e = vec2(pf.x * c + pf.y * sn, -pf.x * sn + pf.y * c) + (vec2(hHash(pc + 3.), hHash(pc + 5.)) - .5) * .4;
            float pet = 1. - smoothstep(.8, 1., length(e / vec2(.3, .17))); alb = mix(alb, uPetal * (.75 + .5 * hHash(pc + 9.)), pet * (1. - smoothstep(.06, .12, fw))); pud *= 1. - pet; }
          n = rockBump(p, n, h * .06 * (1. - pud));
        } else {
          // living rock: its beds (2.3 m, wandering), a dark crack where two beds meet, every bed its own tone
          float bc = (p.y + 1.6 * hNoise3(p * .09) + .9 * hNoise3(p * vec3(.33, .5, .33) + 4.) + .5 * h) / 2.3, bf = fract(bc);
          // (a crack does not run on like a ruled line: it opens and closes along the bed)
          float crack = (1. - smoothstep(0., .04 + fw * .4, min(bf, 1. - bf))) * (1. - smoothstep(.3, 1.4, fw)) * smoothstep(.38, .62, hNoise3(p * vec3(.23, .7, .23) + 17.));
          alb *= (.62 + .76 * h) * (.9 + .2 * hHash(vec2(floor(bc), 3.))) * (1. - .32 * crack);
          // dark wet streaks down what is steep, where the water's damp reaches; moss on what faces up, where light or damp reaches
          float steep = 1. - smoothstep(.3, .7, abs(n.y)), st = hNoise(vec2(dot(p.xz, vec2(.83, .56)) * 1.6, p.y * .09)) * .7 + .3 * h;
          alb *= 1. - .45 * smoothstep(.5, .72, st) * steep * smoothstep(.15, .6, wet);
          float mo = smoothstep(.15, .6, n.y + .3 * (h - .5)) * smoothstep(.48, .66, hNoise3(p * .6 + 31.) * .55 + h * .45) * smoothstep(.2, .55, grown);
          alb = mix(alb, mossC, mo * .9);
          n = rockBump(p, n, h * .3 + crack * .06);
          gloss = .35 * wet;
        }
        vec3 col = alb * caveLight(p, n, ao);
        // the roof about the crack takes the sky's light at its rim
        if (p.y > uReach.z - 4. && vKind < .5) { float w = crackW(p.z), d = abs(p.x - crackX(p.z)); col += alb * uShaftCol * .16 * (1. - smoothstep(w, w + 4., d)) * smoothstep(.05, .6, w); }
        // wet stone and iron answer the curtain's light with a glint
        vec3 dc = normalize(uCurtain - p); float gl = clamp(dot(reflect(-dc, n), v), 0., 1.); gl *= gl; gl *= gl; gl *= gl;
        col += uWater * gl * (wet * .5 + .12) * gloss * 2.;
        if (pud > 0.) {
          // a puddle: dark, and in it what stands over it: the roof's crack and its shafts, the ring, the bright curtain
          vec3 r = reflect(-v, vec3(0., 1., 0.)); float kr = (uReach.z - p.y) / max(r.y, .05); vec2 q = p.xz + r.xz * kr;
          float w = crackW(q.y), d = abs(q.x - crackX(q.y)), sky = (1. - smoothstep(w * .5, w + 1.2, d)) * smoothstep(.05, .6, w);
          vec3 dr = normalize(uRing - p); float rg = pow(clamp(dot(r, dr), 0., 1.), 90.);
          // (the sky in the crack and the lit dust of the shafts, held to a mirror's share so that a pool is gold and not a white patch)
          vec3 refl = uAmb * .45 + uShaftCol * (.2 * sky + .12 * shaftAt(p + r * 6.)) + uRingCol * rg * 1.4 + uWater * pow(clamp(dot(r, dc), 0., 1.), 40.) * wet * 2.;
          float fr = .12 + .88 * pow(1. - clamp(v.y, 0., 1.), 4.);
          col = mix(col, col * .4 + refl * fr, pud); }
        gl_FragColor = vec4(airFog(col, 1.), 1.); }`})}function re(e,t){const r=e.hallX,c=e.hallZ0,b=e.hallZ1,y=e.deckY,p={};p.floorY=y,p.ringY=y+e.stepH+.4+e.ringR,p.ring=[r,p.ringY,b],p.tables=[];let w=t.sign();for(let d=0;d<3;d++)p.tables.push({x:r+w*t.range(4,7),z:c-17-d*19-t.range(0,3),len:t.range(13,16),w:2.6,top:y+1.1,rot:w*t.range(.05,.22)}),w=-w;const z=-Math.sign(p.tables[0].x-r);p.stove={x:r+z*19,z:c-15,rot:-z*Math.PI/2,w:7,h:3.2,d:3},p.jars=[];for(let d=0;d<9;d++)p.jars.push({x:p.stove.x-z*t.range(3.6,7.5),z:p.stove.z+t.range(-8,9),r:t.range(.5,1),h:t.range(1.1,2.2)});p.beds=[];for(const d of[-1,1])for(let a=0;a<9;a++)d===z&&a<2||p.beds.push({x:r+d*t.range(22,26.5),z:c-12-a*9.5-t.range(0,3),rot:t.range(-.25,.25)+(t.chance(.3)?Math.PI/2:0),top:y+t.range(.7,1.1)});p.shaftDir=new C.Vector3(.42,.85,.3).normalize(),p.roofY=y+e.hallHigh-3,p.crack={x:r+13,zS:c-62,zN:b+8,half:2.6};const M=(p.roofY-y)/p.shaftDir.y;p.pool={dx:-p.shaftDir.x*M,dz:-p.shaftDir.z*M};const x=p.crack.zS+p.pool.dz-4,h=b+44,o=p.crack.x+p.pool.dx;p.garden={x:r,z0:x,z1:h,lightX:o},p.plum={x:r+t.sign()*t.range(11.5,13.5),z:E(x,h,t.range(.5,.65)),h:t.range(11,13.5)},p.bamboo=[];const s=Math.sign(p.plum.x-r);for(let d=0;d<14;d++){const a=(d+t.range(.15,.85))/14,n=E(x,h,a),l=d%2?1:-1,g=t.range(9,15),u=t.range(13,20),v=t.range(.9,1.3);l===s&&Math.abs(n-p.plum.z)<9||p.bamboo.push({x:r+l*g,z:n,h:u,s:v})}p.pine={x:r-s*t.range(9,12),z:h-t.range(0,4),h:t.range(7,9)},p.stones=[];for(let d=0;d<7;d++)p.stones.push({x:r+t.sign()*t.range(4.5,13),z:t.range(h,x),r:t.range(.7,1.6),h:t.range(1.2,3.4)});p.step={z:b+20,y:y+e.stepH},p.seat={x:r,z:b+e.seatBack,y:p.step.y,h:e.seatH},p.posts=[];for(const d of[28,40])for(const a of[-1,1])p.posts.push({x:r+a*7,z:b+d,h:t.range(8.5,10),r:.7});p.columns=[];for(const d of[-1,1])for(let a=c-t.range(30,44);a>b+24;a-=t.range(32,46))p.columns.push({x:r+d*t.range(15.5,20),z:a,r:t.range(1.2,2.1),lean:t.range(-.06,.06),seed:t.range(0,99)});return p}function ne(e,t,r,c=()=>!0){const b=e.hallX,y=e.hallZ0,p=e.hallZ1,w=t.floorY,z={stoves:[t.stove],jars:[],heaps:[],garlands:[],vines:[],strands:[]},M=r.stoves,x=Math.sign(t.stove.x-b)||1;for(const[a,n]of[[-x,y-46],[x,t.garden.z0+5]]){const l=M.range(17.5,18.5),g=M.range(-3,3),u=[];for(let m=0;m<4;m++)u.push([M.range(3.6,6.5),M.range(-6,6),M.range(.5,.9),M.range(1.1,2)]);const v=b+a*l;let i=n+g,f=0;for(;f<8&&t.columns.some(m=>Math.hypot(m.x-v,m.z-i)<5.5+m.r);)i-=2,f++;if(c("stoves",v,w,w+9.2,i,3.8)){z.stoves.push({x:v,z:i,rot:-a*Math.PI/2,w:6,h:3,d:2.8});for(const m of u){const A=v-a*m[0],S=i+m[1];c("stove jars",A,w,w+m[3],S,m[2])&&z.jars.push({x:A,z:S,r:m[2],h:m[3]})}}}for(const a of z.stoves){const n=Math.sign(a.x-b)||1;a.fire=[a.x-n*(a.d/2-.2),w+.75,a.z],a.top=w+a.h+6}const h=r.heaps,o=(a,n)=>{const l=h.range(.8,1.3),g=h.chance(.4),u=h.range(0,O);c("fruit heaps",a,w,w+.95*l,n,l)&&z.heaps.push({x:a,z:n,r:l,melon:g,turn:u})};for(const a of t.tables){const n=Math.sign(a.x-b)||1;for(const l of[-1,1]){const g=l*(a.len/2+h.range(1.6,2.6)),u=n*h.range(.8,2.4);o(a.x+u+Math.sin(a.rot)*g,a.z+Math.cos(a.rot)*g)}}for(const a of z.stoves){const n=Math.sign(a.x-b)||1;o(a.x-n*h.range(2.6,4.2),a.z+h.sign()*h.range(4.6,6.2))}for(const a of[-1,1])o(b+a*h.range(10,16),t.step.z+h.range(3,6));const s=r.hangs,d=(a,n)=>{const l=s.range(1.1,2),g=s.range(0,O);let u=!0;for(let v=0;v<=6;v++){const i=v/6,f=E(a[1],n[1],i)-l*Math.sin(Math.PI*i);c("garlands",E(a[0],n[0],i),f-1.3,f+.5,E(a[2],n[2],i),.9)||(u=!1)}u&&z.garlands.push({a,b:n,sag:l,turn:g})};d([b-7.2,w+11.7,y-.3],[b+7.2,w+11.7,y-.3]);for(let a=0;a+2<t.posts.length;a++){const n=t.posts[a],l=t.posts[a+2];d([n.x,w+.8+n.h,n.z],[l.x,w+.8+l.h,l.z])}for(const a of t.columns){const n=s.range(1.5,3),l=s.range(2.5,4),g=s.range(0,O),u=s.sign();c("vines",a.x,w,w+e.hallHigh,a.z,2.3*a.r+1.1)&&z.vines.push({c:a,turns:n,end:l,ph:g,dir:u})}for(let a=0;a<16;a++){const n=(a+s.range(.1,.9))/16,l=E(t.crack.zS-3,t.crack.zN+3,n),g=a%2?1:-1,u=s.range(3,9),v=s.range(0,O),i=s.range(-.3,.5),f=Wt(t.crack,l);if(f<.5)continue;const m=Gt(t.crack.x,l)+g*(f-i);c("crack vines",m,t.roofY-u-4.5,t.roofY+2,l,1.1)&&z.strands.push({x:m,z:l,len:u,sway:v,sd:g})}return z}const K=D("#6f7f78"),H=D("#9fb7a8"),dt=D("#4f6460"),$=D("#3a3d42"),rt=D("#8a4a2a"),zt=D("#1c1a18");function Yt(e,t,r,c,b,y=28){const p=t.length-1;e.grid(y,p,(w,z)=>{const M=t[Math.min(p,Math.round(z*p))],x=r(M),h=Math.PI*w,o=Math.pow(Math.sin(h),.6),s=x.cx-Math.cos(h)*x.hw,d=x.bot+o*(x.top-x.bot),a=x.bot+(x.top-x.bot)*.35,n=s-x.cx,l=d-a,g=Math.hypot(n,l)||1,u=(1.9*c.fbm3(s*.05,d*.05,M*.05,2)+.3*c.n3(s*.17,d*.17,M*.17)+.5*c.n3(s*.45,d*.45,M*.45+17))*Math.min(1,x.hw/12);return[s+n/g*u,d+l/g*u*(w>.04&&w<.96?1:0),M+.6*c.n3(s*.1,d*.1,M*.1+50)]},(w,z)=>{const M=.5+.5*c.n3(w[0]*.09+20,w[1]*.09,w[2]*.09);return q(q(K,H,M),b,.35)})}function Nt(e,t,r,c,b,y,p=.25){const w=t.length-1;e.grid(8,w,(z,M)=>{const x=t[Math.min(w,Math.round(M*w))],h=r(x),o=h.cx+(2*z-1)*h.hw*1.04;return[o,h.bot+p*c.n2(o*.3,x*.3),x]},()=>b,{kind:y})}const J=(e,t)=>Math.pow(Math.max(0,1-(t/(e.galHalf+4))**4),.5),kt=(e,t,r,c)=>.9*e.fbm3(t*.08,r*.08,c*.08+9,3)+.3*e.n3(t*.3,r*.3,c*.3),pt=e=>1+.0042*e*e,Te=(e,t,r,c)=>e.galY+.3*kt(t,r,e.galY,c),Et=(e,t,r)=>pt(t)+(r-pt(t))*(.35+.65*J(e,t)),nt=(e,t)=>.42+.1*e.n2(t*3.3,1.1),It=e=>nt(e,0)+nt(e,1)+nt(e,2)+nt(e,3),se=(e,t)=>{const r=J(e,t);return[e.galY-(e.galY+3.2)*r,e.galY+(e.galTop+2.6-e.galY)*r]},_e=(e,t,r)=>Et(e,r,e.galBack+It(t)),Ze=(e,t)=>Et(e,t,e.galFront),Ge=(e,t,r,c)=>{const b=J(e,r),y=pt(r),p=y+(c-y)/(.35+.65*b),w=j((p-e.galBack+.4)/(e.lipZ+2.9-e.galBack),0,1),z=e.galY+(e.galTop+2.6*w-e.galY)*b;return z+kt(t,r,z,c)*(w>.75?.4:1)},ie=(e,t,r)=>{const c=[];for(let b=e;b>t+r*.5;b-=r)c.push(b);return c.push(t),c};async function le(e,t,r,c,b=async()=>{}){const y=V,p=[[t.galFront+1.6,-3.2],[t.galFront,t.galY],[t.galBack,t.galY],[t.galBack-.4,t.galTop],[t.lipZ+2.5,t.galTop+2.6]],w=[0,8,16,46,60],z=60,M=84,x=k=>{const B=k*z;let T=1;for(;T<4&&w[T]<B;)T++;const R=(B-w[T-1])/(w[T]-w[T-1]);return[E(p[T-1][0],p[T][0],R),E(p[T-1][1],p[T][1],R),T,R]},h=t.galHalf+4,o=10.5,s=14.8,d=It(c),a=(k,B)=>{let T=0;for(let R=0;R<4;R++){const L=t.galY+3.2+R*4.3+.5*c.n2(k*.1,R*7.7);T+=nt(c,R)*y(-.3,.3,B-L)}return T},n=k=>{const B=Math.max(0,1-3.2*Math.abs(c.n2(k*.22+3,5.5)));return B*B},l=(k,B)=>{const T=B[1];return B[2]===3?d-a(k,T)+.75*n(k)*(1.1-.6*B[3])*y(0,.12,B[3])*y(.5,.85,J(t,k)):B[2]===2?d*B[3]:B[2]===1?.5*a(k+40,T+13.5)*(1-B[3]):0},g=(k,B)=>B[2]===4?-.55*Math.max(0,c.n3(k*.55,9.9,B[0]*.55))*y(0,.15,B[3])*(1-y(.8,1,B[3])):0,u=(k,B,T,R=1.6)=>T<t.galBack+d+2.2&&Math.abs(k-t.mouthX)<o+R&&B<t.galY+(s+.9*R)*Math.pow(Math.max(0,1-((k-t.mouthX)/(o+R))**2),.3),v=(k,B)=>{const T=x(B),R=J(t,k),L=pt(k),Q=t.galY,st=T[2]===2?.3:1,it=T[1]+g(k,T),xt=T[0]+l(k,T),lt=Q+(it-Q)*R,At=L+(xt-L)*(.35+.65*R),St=kt(c,k,lt,At);return[k,lt+St*st*(B>.9?.4:1),At+St*.6*st]},i=(k,B)=>v(h*(.12*(2*k-1)+.88*Math.sin((k-.5)*Math.PI)),B),f=(k,B)=>{if(Math.abs(h*(.12*(2*k-1)+.88*Math.sin((k-.5)*Math.PI))-t.mouthX)>=o+1.6)return!0;const T=i(k,B);return!(u(T[0],T[1],T[2])&&(x(B)[2]===3||T[2]<t.galBack+1.2))},m=new Array((M+1)*(z+1)),A=new Uint8Array(M*z);for(let k=0;k<=z;k++){for(let B=0;B<=M;B++)m[k*(M+1)+B]=i(B/M,k/z);if(k<z)for(let B=0;B<M;B++)A[k*M+B]=f((B+.5)/M,(k+.5)/z)?1:0;k%8===7&&await b()}await b(),e.grid(M,z,(k,B)=>m[Math.round(B*z)*(M+1)+Math.round(k*M)],k=>{const B=.5+.5*c.n3(k[0]*.1,k[1]*.1+30,k[2]*.1);return q(dt,K,B*.8)},{keep:(k,B)=>A[Math.floor(B*z)*M+Math.floor(k*M)]===1}),await b(),e.grid(36,10,(k,B)=>{const T=Math.PI*k,R=E(-1.4,4.2,B)+.6*c.n2(T*3+11,2.2)*y(0,.3,B),L=t.mouthX-Math.cos(T)*(o+R),Q=t.galY-.4+Math.pow(Math.sin(T),.6)*(s+.9*R+.4),st=J(t,L),it=t.galY,xt=v(L,(w[2]+(w[3]-w[2])*j((Q-t.galY)/(t.galTop-t.galY),.02,1))/z),lt=-4+5*y(-1.5,-.2,R)-1.3*y(1,4.2,R);return[L,it+(Q-it)*st,xt[2]+lt]},k=>{const B=.5+.5*c.n3(k[0]*.1,k[1]*.1+30,k[2]*.1);return q(dt,K,B*.8)}),await b();const S=[];for(let k=t.galBack+1.5;k>t.hallZ0-.5;){S.push(k);const B=Math.min(Math.abs(k-t.bridgeZ0),Math.abs(k-t.bridgeZ1));k-=B<2.6?.9:1.5}S.push(t.hallZ0-1);const F=k=>{const B=y(0,8,t.bridgeZ0-k)*y(0,8,k-t.bridgeZ1),T=j((t.galBack-k)/(t.galBack-t.bridgeZ0),0,1),R=y(0,1.4,t.bridgeZ0-.4-k)*y(0,1.4,k-t.bridgeZ1-.4),L=5*y(t.galBack-7.5,t.galBack-1.5,k);return{cx:E(t.mouthX,t.bridgeX,T*T*(3-2*T)),hw:E(10.5,25,B)-1.2*y(t.hallZ0+5,t.hallZ0,k)+L,top:t.deckY+E(14.2,27,B)+L,bot:E(t.galY,t.underY-3.6,R)}},Z=[t.galBack-1.6,...S.filter(k=>k<t.galBack-2.5)];Yt(e,Z,F,c,dt,34),await b(),Nt(e,[t.galBack+3.6,t.galBack+1.5,...S.slice(1)],F,c,q(dt,K,.5),0),await b();const _=ie(t.hallZ0,t.hallZ1-1.5,2.9),G=k=>{const B=t.hallZ0-k,T=y(0,16,B),R=E(.72,1,y(0,40,k-t.hallZ1));return{cx:t.hallX+2.5*Math.sin(B*.035)*y(0,30,B)*y(0,60,k-t.hallZ1),hw:E(9.5,t.hallHalf,T)*R,top:t.deckY+E(13.6,t.hallHigh,T)*E(.84,1,y(0,40,k-t.hallZ1)),bot:t.deckY-.03}};Yt(e,_,G,c,H,44),await b(),Nt(e,_,G,c,q(K,H,.55),1,.03),await b();const Y=r.ring,N=t.hallZ1-.9,W=(k,B)=>{const T=t.hallX+(2*k-1)*27,R=t.deckY-.5+B*36;return[T,R,N+.5*c.n2(T*.15,R*.15)]};e.grid(27,18,W,k=>q(K,H,.4+.3*c.n2(k[0]*.1,k[1]*.1)),{keep:(k,B)=>{const T=W(k,B);return Math.hypot(T[0]-Y[0],T[1]-Y[1])>t.rimR-1.4}});const I=[[t.ringR+.25,-1.6],[t.ringR+.25,.9],[t.ringR+.7,1.15],[t.rimR-.35,1.15],[t.rimR,.8],[t.rimR+.15,-.6]];return e.grid(56,I.length-1,(k,B)=>{const T=Math.round(B*(I.length-1)),R=k*O;return[Y[0]+Math.cos(R)*I[T][0],Y[1]+Math.sin(R)*I[T][0],N+I[T][1]]},(k,B,T,R)=>{const L=Math.round(R*(I.length-1));return q(H,[.8,.84,.8],L===2||L===3?.5:.1)}),{secA:F,secH:G,zsH:_}}function Ht(e,t,r,c){e.at(t.x,0,t.z,t.rot),e.box(0,r+t.h/2,-.2,t.w,t.h,t.d-.4,K),e.grid(21,8,(b,y)=>[(b-.5)*t.w,r+y*t.h,t.d/2-.38],b=>{let y=0;for(const p of[-.3,0,.3]){const w=(b[0]-p*t.w)/.7,z=b[1]-r-.5;y=Math.max(y,Math.exp(-w*w*(1+Math.max(0,z)*.8))*(z<.75&&Math.abs(w)<.75?1:Math.exp(-Math.max(0,z-.75)*.8)))}return q(H,zt,j(y*1.15,0,.96))});for(const b of[-.3,0,.3])e.grid(6,2,(y,p)=>{const w=Math.PI*y,z=.5*p;return[b*t.w-Math.cos(w)*z,r+.42+Math.sin(w)*z*1.3,t.d/2-.34+.03*p]},(y,p,w,z)=>q(he,ce,z),{kind:7});e.box(0,r+.2,t.d/2+.5,t.w+.8,.4,1.8,H);for(const b of[-.3,.02,.31])e.lathe(b*t.w,r+t.h,-.2,mt(.85,1),9,c);e.box(0,r+t.h+3,-t.d/2+.3,2.2,6,1.4,K),e.home()}const ce=D("#e2441a"),he=D("#ffd060"),fe=D("#5fa44c"),Dt=D("#2a6a38"),Xt=D("#f08a4b"),ue=D("#f6b0a0"),Ot=D("#f2c46a"),de=e=>[[.3*e,0],[.72*e,.16*e],[e,.52*e],[1.03*e,.6*e],[.9*e,.56*e]],mt=(e,t)=>[[.55*e,0],[e,.28*t],[.97*e,.6*t],[.6*e,.88*t],[.72*e,t],[.62*e,t*.97]];async function pe(e,t,r,c,b,y,p=async()=>{},w=e){const z=r.floorY,M=q(K,[0,0,0],.25),x=q(H,[.8,.85,.8],.3);{const o=t.bridgeX,s=t.bridgeZ0+1.5,d=t.bridgeZ1-1.5,a=s-d,n=(s+d)/2,l=t.bridgeW/2;e.box(o,t.deckY-.14,n,t.bridgeW,.28,a,$,2);{const g=s+t.headRamp,u=t.galY-.3;e.grid(1,1,(v,i)=>[o+(2*v-1)*l,E(t.deckY,u,i),E(s-.05,g,i)],()=>$,{flip:!0,kind:2});for(const v of[-1,1])e.grid(1,1,(i,f)=>[o+v*l,E(u,E(t.deckY,u,i),f),E(s-.05,g,i)],()=>q($,rt,.25),{flip:v>0,kind:2})}for(const g of[-1,1]){e.box(o+g*(l-.2),t.deckY-.6,n,.4,.75,a,q($,rt,.25),2);const u=[];for(let i=s-1.2;i>d+1;i-=4)u.push(i);for(const i of u)e.box(o+g*(l-.14),t.deckY+.7,i,.24,1.4,.24,q($,rt,.35),2);for(let i=0;i+1<u.length;i++)for(const f of[1.3,.72]){const m=[];for(let A=0;A<=5;A++){const S=A/5;m.push([o+g*(l-.14),t.deckY+f-.34*Math.sin(Math.PI*S),E(u[i],u[i+1],S)])}e.tube(m,.065,4,q($,rt,.5),2)}const v=[];for(let i=0;i<=14;i++){const f=i/14;v.push([o+g*(l-.5),t.deckY-1-7.5*(1-Math.sin(Math.PI*f))*.9,E(s+2,d-2,f)])}e.tube(v,.34,5,q($,rt,.4),2);for(let i=2;i<=12;i+=2)e.box(o+g*(l-.5),(v[i][1]+t.deckY-.9)/2,v[i][2],.22,Math.max(.2,t.deckY-.9-v[i][1]),.22,$,2);await p()}}{const o=t.hallX,s=t.hallZ0+1.4,d=7.4,a=12;for(const n of[-1,1])e.box(o+n*(d+1.2),z+a/2,s,2.4,a,2.6,x),e.box(o+n*(d+1.2),z+.5,s,3.2,1,3.4,H);e.box(o,z+a+1.1,s,2*d+6.4,2.2,3,x),e.box(o,z+a+2.7,s,2*d+4,1,2.4,H),e.box(o,z+.06,s,2*d,.3,3.2,H,1)}await p(),e=w,r.bowls=[],r.benchSeats=[],r.tableThings=[];for(const o of r.tables){const s=Math.sign(o.x-t.hallX)||1,d=Math.cos(o.rot),a=Math.sin(o.rot);e.at(o.x,0,o.z,o.rot),e.box(0,o.top-.2,0,o.w,.4,o.len,x);for(const u of[-.36,0,.36])e.box(0,(z+o.top-.4)/2,u*o.len,o.w*.7,o.top-.4-z,.6,K);for(const u of[-1,1]){e.box(u*(o.w/2+1),z+.5,0,.7,.26,o.len*.92,H);for(const v of[-.38,0,.38])e.box(u*(o.w/2+1),z+.19,v*o.len,.5,.38,.5,K)}const n=Math.round(o.len*.8);for(let u=0;u<n;u++){const v=c.range(-.95,.95),i=(u+c.range(.2,.8))/n*o.len-o.len/2,f=c.range(.2,.36),m=c.chance(.25)&&v*s>.1;r.tableThings.push({x:o.x+v*d+i*a,z:o.z-v*a+i*d,y0:o.top,y1:o.top+(m?2.2:.6)*f,r:(m?.6:1.03)*f}),e.lathe(v,o.top,i,m?mt(f*.6,f*2.2):de(f),7,q(H,[.85,.88,.84],c.range(0,.6)),0,(A,S)=>S>.9?q(A,M,.6):A)}e.home();const l=Math.cos(o.rot),g=Math.sin(o.rot);for(const u of[-1,1])for(let v=-.42;v<=.43;v+=.12){const i=u*(o.w/2+1),f=v*o.len;r.benchSeats.push({x:o.x+i*l+f*g,y:z+.63,z:o.z-i*g+f*l,yaw:o.rot+(u>0?-Math.PI/2:Math.PI/2)})}for(let u=-.4;u<=.41;u+=.2)r.bowls.push({x:o.x+u*o.len*g,y:o.top,z:o.z+u*o.len*l});await p()}Ht(e,r.stove,z,M);for(const o of r.jars)e.lathe(o.x,z,o.z,mt(o.r,o.h),9,q(K,H,c.range(.2,.9)),0,(s,d)=>d>.92?q(s,zt,.7):s);await p(),r.bedTops=[];for(const o of r.beds){e.at(o.x,0,o.z,o.rot),e.box(0,o.top-.16,0,3.2,.32,1.7,x);for(const s of[-1.1,1.1])e.box(s,(z+o.top-.32)/2,0,.6,o.top-.32-z,1.5,K);e.box(-1.25,o.top+.1,0,.5,.2,1.2,H),e.home(),r.bedTops.push({x:o.x,y:o.top,z:o.z,rot:o.rot})}await p();const h=(o,s)=>{const d=y(s),a=j((o-d.cx)/d.hw,-.98,.98);return d.bot+Math.pow(Math.sqrt(1-a*a),.6)*(d.top-d.bot)};for(const o of r.columns){const s=h(o.x,o.z)+2.5,d=s-z+.5;e.grid(11,10,(a,n)=>{const l=a*O,g=z-.5+n*d,u=2*n-1,v=o.r*(.75+.9*u*u*u*u+.3*u*u+.3*b.n3(Math.cos(l)*1.3+o.seed,n*4,Math.sin(l)*1.3));return[o.x+o.lean*d*n+Math.cos(l)*v,g,o.z-Math.sin(l)*v]},(a,n,l,g)=>q(K,H,.35+.4*b.n3(a[0]*.2,a[1]*.12,a[2]*.2))),await p()}await p(),r.drips=[],r.teeth=[];for(let o=0;o<70;o++){const s=c.range(t.hallZ1+6,t.hallZ0-8),d=y(s),a=d.cx+c.sign()*d.hw*c.range(.12,.8),n=h(a,s)+.8,l=c.range(1.5,6.5),g=l*c.range(.1,.17);Math.abs(a-r.crack.x)<7&&s<r.crack.zS+4||(e.grid(6,2,(u,v)=>{const i=u*O,f=g*(1-v)*(1-.5*v);return[a+Math.cos(i)*f,n-l*v,s-Math.sin(i)*f]},()=>q(K,H,.5)),r.teeth.push({x:a,z:s,y0:n-l,y1:n,r:g}),o%3===0&&r.drips.push([a,n-l,s]))}for(const o of r.stones)e.grid(8,6,(s,d)=>{const a=s*O,n=o.r*(.55+.6*Math.sin(Math.PI*Math.min(1,d*1.15))+.35*b.n3(Math.cos(a)+o.x,d*3,Math.sin(a)+o.z))*(d>.97?.05:1);return[o.x+Math.cos(a)*n,z-.2+d*o.h,o.z-Math.sin(a)*n]},s=>q(K,x,.5+.4*b.n3(s[0]*.5,s[1]*.5,s[2]*.5)));await p();{const o=r.step,s=t.hallZ1-1;for(let d=0;d<3;d++){const a=o.z+(2-d)*1.3;e.box(t.hallX,z+(d+.5)*t.stepH/3,(a+s)/2,58-d*2,t.stepH/3,a-s,d===2?x:H,1)}}for(const o of r.posts)e.box(o.x,z+.4,o.z,2.1,.8,2.1,H),e.box(o.x,z+.8+o.h/2,o.z,1.3,o.h,1.3,x),e.box(o.x,z+.8+o.h+.25,o.z,1.9,.5,1.9,H),e.box(o.x,z+1.3+o.h+.35,o.z,1.1,.7,1.1,x);{const o=r.seat,s=4.6;e.at(o.x,o.y,o.z,0),e.box(0,.3,.3,s+1.6,.6,4.6,H),e.box(0,1.1,0,s,1,3.2,x),e.box(0,.8,2.3,2.6,.45,1.1,H);for(const d of[-1,1])e.box(d*(s/2-.35),2.4,.1,.7,1.6,2.9,x),e.box(d*(s/2-.35),3.3,.3,.9,.25,3.2,H);e.box(0,1.6+(o.h-2.6)/2,-1.25,s,o.h-2.6,.7,x),e.box(0,o.h-.75,-1.25,s-1,.5,.7,x),e.box(0,o.h-.25,-1.25,s-2.2,.5,.7,H),e.box(0,1.6+(o.h-3.4)/2,-.86,s-1.2,o.h-4.2,.1,H),e.home()}}const gt=(e,t)=>{let r=Math.imul(e+1,374761393)+Math.imul(t+1,668265263)|0;return r=Math.imul(r^r>>>13,1274126177),((r^r>>>16)>>>0)/4294967296};async function me(e,t,r,c,b,y,p=async()=>{}){const w=r.floorY,z=q(K,[0,0,0],.25);for(const h of c.stoves)h!==r.stove&&Ht(e,h,w,z);c.jars.forEach((h,o)=>e.lathe(h.x,w,h.z,mt(h.r,h.h),9,q(K,H,.2+.7*gt(o,3)),0,(s,d)=>d>.92?q(s,zt,.7):s)),await p(),c.heaps.forEach((h,o)=>{const s=h.melon?10:24,d=h.melon?.3:.17,a=h.melon?Dt:q(Xt,[.2,.1,.05],.5);e.lathe(h.x,w,h.z,[[h.r,0],[.8*h.r,.28*h.r],[.42*h.r,.6*h.r],[.02,.72*h.r]],7,a,5);for(let n=0;n<s;n++){const l=(n+.5)/s,g=h.turn+n*2.39996,u=.88*h.r*Math.sqrt(l),v=w+.72*h.r*(1-Math.pow(l,.8))*.96+d*.25,i=d*(.85+.3*gt(n,o)),f=h.x+Math.cos(g)*u,m=h.z+Math.sin(g)*u;if(h.melon)e.grid(6,3,(A,S)=>{const F=A*O,Z=(S-.5)*Math.PI;return[f+Math.cos(F)*Math.cos(Z)*i*1.15,v+Math.sin(Z)*i,m-Math.sin(F)*Math.cos(Z)*i*1.15]},(A,S,F)=>Math.round(F*6)%2?fe:Dt,{kind:5});else{const A=q(q(Xt,ue,gt(n,o+7)),Ot,.5*gt(n,o+11));e.lathe(f,v,m,[[.9*i,-.25*i],[.82*i,.5*i],[.03*i,i]],5,A,5,(S,F)=>F>.7?q(S,Ot,.4):S)}}}),await p();const M=(h,o)=>{const s=y(o),d=j((h-s.cx)/s.hw,-.98,.98);return s.bot+Math.pow(Math.sqrt(1-d*d),.6)*(s.top-s.bot)};c.vines.forEach((h,o)=>{const s=h.c,d=M(s.x,s.z)+2.5,a=d-w+.5,n=Math.round(h.turns*6),l=[];for(let g=0;g<=n;g++){const u=g/n,v=E(d-3,w+h.end,u),i=(v-w+.5)/a,f=2*i-1,m=h.ph+h.dir*h.turns*O*u,A=s.r*(.75+.9*f*f*f*f+.3*f*f+.3*b.n3(Math.cos(m)*1.3+s.seed,i*4,Math.sin(m)*1.3))+.25;l.push([s.x+s.lean*a*i+Math.cos(m)*A,v,s.z-Math.sin(m)*A])}h.pts=l}),await p();const x=[];for(let h=r.crack.zN;h<r.crack.zS+1.2;h+=2.4)x.push(Math.min(h,r.crack.zS));for(const h of[-1,1])e.grid(x.length-1,3,(o,s)=>{const d=x[Math.round(o*(x.length-1))],a=Wt(r.crack,d),n=[-3.5,.5,5,11][Math.round(s*3)];return[Gt(r.crack.x,d)+h*(a+.5+.1*Math.max(n,0)+.45*b.n3(d*.3,n*.3,h*9)),r.roofY+n,d]},o=>q(K,H,.5+.4*b.n3(o[0]*.3,o[1]*.3,o[2]*.3)),{kind:6})}const ge=(e,t)=>e.lipZ+.0042*t*t,Mt=(e,t,r)=>{const c=Math.min(Math.abs(t),vt),b=Math.sign(t)*c,y=c+9*r.n2(b*.013+7.7,1.3)*(1-V(68,84,c)),p=5*r.n2(b*.03,4.4)+2.6*r.n2(b*.12,8.1);return e.H+(.002*c*c+9+p)*V(e.W/2-2,e.W/2+13,c)-(e.H-2)*(.4*V(38,50,y)+.6*V(60,83,y))},vt=84,ve=D("#8b8a76"),xe=D("#a39c84"),we=D("#4a544c"),ye=D("#3a443e"),be=D("#46663a");async function ze(e,t,r,c,b){const y=[];for(let a=c.range(10,16);a<t.H+30;a+=c.range(9,15))y.push({y:a,d:c.range(.8,2.6)});const p=t.galHalf+4,w=(a,n)=>{if(Math.abs(a)>=p)return null;const l=se(t,a),g=l[0]+.5,u=l[1]-.5;return u>g&&n>g&&n<u?[g,u]:null},z=a=>{const n=Math.max(0,1-2.6*Math.abs(r.n2(a*.085+1.7,9.3)));return n*n},M=(a,n)=>{const l=(2*a-1)*vt,g=Mt(t,l,r);let u=-5+n*(g+5);const v=w(l,u);v&&(u=u-v[0]<v[1]-u?v[0]:v[1]);const i=V(t.galHalf+2,t.galHalf+16,Math.abs(l));let f=.05*Math.max(0,u)*i-2.4*z(l)*i*(1-.5*j(u/Math.max(g,1),0,1));for(const A of y)f+=A.d*i*V(-.7,.7,u-A.y-2.5*r.n2(l*.04,A.y));const m=2.6*r.fbm3(l*.035,u*.035,7.7,3)+.7*r.n3(l*.16,u*.16,2.2);return[l,u,ge(t,l)-f+m*(.35+.65*i)*(n>.97?.3:1)]},x=(a,n)=>{const l=.5+.5*r.n3(a[0]*.05,a[1]*.05,3),g=1-V(t.W/2-4,t.W/2+10,Math.abs(a[0])),u=1-V(t.W/2,t.W/2+30,Math.abs(a[0])),v=V(.05,.5,r.n2(a[0]*.21,5.5+a[1]*.012)),i=V(.1,.55,r.n2(a[0]*.13+40,a[1]*.13));return q(q(q(q(ve,xe,l),we,.6*g),ye,.45*v*u),be,.4*i*u)},h=72,o=44,s=new Array((h+1)*(o+1)),d=new Array((h+1)*(o+1));for(let a=0;a<=o;a++){for(let n=0;n<=h;n++){const l=a*(h+1)+n;s[l]=M(n/h,a/o),d[l]=x(s[l])}b&&a%6===5&&await b()}return e.grid(h,o,(a,n)=>s[Math.round(n*o)*(h+1)+Math.round(a*h)],(a,n,l,g)=>d[Math.round(g*o)*(h+1)+Math.round(l*h)],{keep:(a,n)=>{const l=(2*a-1)*vt;return!w(l,-5+n*(Mt(t,l,r)+5))}}),b&&await b(),e.grid(72,4,(a,n)=>{const l=s[o*(h+1)+Math.round(a*h)];return[l[0],l[1]+5*n+1.2*r.n2(l[0]*.08,n*3),l[2]-18*n]},x),{ledges:y,faceAt:(a,n)=>{const l=Mt(t,a,r);return M((a/vt+1)/2,j((n+5)/(l+5),0,1))},buttress:z}}function ke(e,t){return new C.ShaderMaterial({uniforms:{...Rt(e),uFlow:{value:t}},fog:!0,vertexShader:X.GLSL_FOG_PARS_VERT+`varying vec3 vW;
      void main() { vW = (modelMatrix * vec4(position, 1.)).xyz; vec4 mvPosition = viewMatrix * vec4(vW, 1.); gl_Position = projectionMatrix * mvPosition; ${X.GLSL_FOG_VERT} }`,fragmentShader:X.GLSL_FOG_PARS_FRAG+tt+P+qt+`
      uniform float uFlow; varying vec3 vW;
      float wh(vec2 q) { vec2 f = vec2(uTime * 1.1 * uFlow, 0.); return hNoise(q * .5 - f) * .6 + hNoise(q * 1.3 - f * 1.5 + 5.) * .4; }
      void main() {
        vec2 q = vW.xz; float h = wh(q), hx = wh(q + vec2(.35, 0.)) - h, hz = wh(q + vec2(0., .35)) - h;
        vec3 n = normalize(vec3(-hx * 2.2, 1., -hz * 2.2)), v = normalize(cameraPosition - vW);
        float fres = 1. - clamp(dot(n, v), 0., 1.); fres = fres * fres;
        vec3 body = mix(vec3(.02, .12, .13), vec3(.07, .34, .36), h) * caveLight(vW, n, 1.);
        vec3 dc = normalize(uCurtain - vW); float gl = clamp(dot(reflect(-dc, n), v), 0., 1.); gl *= gl; gl *= gl; gl *= gl; gl *= gl;
        // the white where it quickens is soft and little: three sizes of noise laid at three headings (no edge follows a square of the
        // noise), cut with an edge as broad as the noise's own swing
        vec2 qa = mat2(.8, .6, -.6, .8) * q, qb = mat2(.6, -.8, .8, .6) * q;
        float fn = hNoise(qa * vec2(.3, .7) - vec2(uTime * 1.6 * uFlow, 0.)) * .5 + hNoise(qb * 1.9 - vec2(uTime * 2.2 * uFlow, 0.)) * .3 + hNoise(q * 4.3 - vec2(uTime * 1.3 * uFlow, 7.)) * .2;
        float foam = smoothstep(.52, .86, fn);
        vec3 col = body + uWater * (gl * 1.2 + fres * .08) + foam * .35 * caveLight(vW, vec3(0., 1., 0.), 1.);
        gl_FragColor = vec4(airFog(col, 1.), 1.); }`})}function Me(e=Bt,t=null){const r=(b,y,p)=>({value:new C.Vector3(b,y,p)}),c=b=>({value:new C.Color(b)});return{uTime:{value:0},uSunDir:r(.5,.6,.62),uFallLit:c("#ffffff"),uFallShade:c("#8fa6c4"),uFallDeep:c("#3d5a70"),uFallInner:c("#fff4cf"),uMistLit:c("#ffffff"),uMistShade:c("#a9bfd6"),uBow:{value:1},uMistAmt:{value:1},uCaveAir:{value:new C.Vector4(.05,.102,.098,.0038)},uAirZ:{value:e.sheetZ},uCaveAmb:c("#5f7f7c"),uWaterLight:c("#ffe9a8"),uCurtain:r(0,e.galY+10,e.sheetZ),uShaftDir:r(.42,.85,.3),uShaftCol:c("#fff0c8"),uRing:r(e.hallX,e.deckY+10,e.hallZ1+1),uRingCol:c("#ffe9a8"),uCrack:{value:new C.Vector4(t?t.crack.x:e.hallX+13,t?t.crack.zS:-132,t?t.crack.zN:-234,t?t.crack.half:2.6)},uReach:{value:new C.Vector4(54,24,t?t.roofY:39.6,.15)},uGal:{value:new C.Vector4(e.galFront,e.galBack,e.galY,e.galTop)},uFire:{value:[new C.Vector4(0,-99,0,0),new C.Vector4(0,-99,0,0),new C.Vector4(0,-99,0,0)]},uFireCol:c("#ff8a3a"),uPlum:{value:new C.Vector4(0,0,8,0)},uPetal:c("#f8d4e0")}}function Ae(e,t,r,c){e.uCurtain.value.set(0,t.galY+10,t.sheetZ),e.uRing.value.set(c*r.ring[0],r.ring[1],r.ring[2]+1.5),e.uShaftDir.value.set(c*r.shaftDir.x,r.shaftDir.y,r.shaftDir.z),e.uCrack.value.set(c*r.crack.x,r.crack.zS,r.crack.zN,r.crack.half),e.uReach.value.z=r.roofY}function Se(e,t,r,c,b=t.plum.x){r.stoves.slice(0,3).forEach((y,p)=>e.uFire.value[p].set(c*y.fire[0],y.fire[1],y.fire[2],2.4)),e.uPlum.value.set(c*b,t.plum.z,.75*t.plum.h,0)}async function We(e,t={}){const r=t.P||Bt,c=t.side||1,b=e.noise,y=W=>e.core.makeRng(e.core.hashSeed(W+":"+e.seed)),p={plan:y("house plan"),ledges:y("cliff ledges"),rock:y("cliff rock"),things:y("house things"),foot:y("fall mist"),veil:y("fall veil"),spray:y("sheet spray"),rays:y("roof shafts")},w=t.L||re(r,p.plan),z=t.U||Me(r,w),M=t.home||ne(r,w,{stoves:y("house stoves"),heaps:y("fruit heaps"),hangs:y("hangings")});t.U||(Ae(z,r,w,c),Se(z,w,M,c));const x=new C.Group,h=yt(c<0),o=await ze(h,r,b,p.ledges,e.yield),s=t.rockMaterial||Kt.makeRockMaterial({rng:p.rock,top:"#4f7a3a",topAmount:.75,contact:[8,.3,0]});await e.yield();const d=new C.Mesh(h.build(!1),s);x.add(d),await e.yield();const a=await te(r,z,b,c,e.yield);x.add(a.object),await e.yield();const n=yt(c<0),l=await le(n,r,w,b,e.yield);await e.yield();const g=yt(c<0);await pe(n,r,w,p.things,b,l.secH,e.yield,g),await e.yield(),await me(g,r,w,M,b,l.secH,e.yield),await e.yield();const u=new C.Group,v=n.build(!0);await e.yield();const i=new C.Mesh(v,ae(z));u.add(i);const f=new C.Mesh(g.build(!0),i.material);u.add(f),await e.yield();const m=new C.Mesh(new C.PlaneGeometry(58,r.bridgeZ0-r.bridgeZ1+6).rotateX(-Math.PI/2),ke(z,c));m.position.set(c*r.bridgeX,r.underY,(r.bridgeZ0+r.bridgeZ1)/2),u.add(m);const A=[],S=w.shaftDir;for(let W=0;W<4;W++){const I=E(w.crack.zS-9,w.crack.zN+6,W/3),k=X.makeGodRays({rng:p.rays,time:z.uTime,position:[c*(w.crack.x+2.6*Math.sin(I*.11)),w.roofY+1,I],direction:[-c*S.x,-S.y,-S.z],radius:9,count:7,length:40,width:[.9,3.4],color:z.uShaftCol.value,intensity:.22,fogAmount:.3});A.push(k),u.add(k.object),await e.yield()}x.add(u),await e.yield();const F=p.foot,Z=p.veil,_=p.spray,G=[],Y=r.lipZ+a.v0*a.tMax;for(let W=0;W<46;W++)G.push({p:[c*F.range(-.5,.5)*(r.W+6),F.range(.5,5),Y+F.range(-2,9)],size:F.range(7,15),rise:F.range(.8,2.6),drift:[F.range(-.6,.6),F.range(.4,2.2)],life:F.range(5,10),ph:F(),op:F.range(.34,.6),grow:1.9});for(let W=0;W<16;W++)G.push({p:[c*Z.range(-.55,.55)*r.W,Z.range(8,46),Y+Z.range(-1,6)],size:Z.range(12,22),rise:Z.range(1,3),drift:[Z.range(-.5,.5),Z.range(.3,1.5)],life:Z.range(8,14),ph:Z(),op:Z.range(.1,.2),grow:1.7});for(let W=0;W<30;W++)G.push({p:[c*(W+_())/30*r.W-c*r.W/2,_.range(r.galY-3,r.galTop),r.sheetZ+_.range(-2,2)],size:_.range(2.6,5),rise:_.range(-2.2,-.6),drift:[_.range(-.3,.3),_.range(-.2,.5)],life:_.range(2.2,4),ph:_(),op:_.range(.09,.19),grow:1.5});const N=ee(G,z);return x.add(N.object),{object:x,radius:90,height:r.H+14,center:new C.Vector3(0,r.H*.45,8),ground:!0,groundY:-.5,anchors:{P:r,L:w,H:M},U:z,face:o,wall:d,fall:a,cave:u,shell:i,things:f,water:m,mist:N,rays:A,footZ:Y,triangles:h.triangles+a.triangles+n.triangles+g.triangles+N.triangles,update(W,I,k){t.U||(z.uTime.value=I);for(const B of A)B.update(W,I,k)}}}export{tt as AIR_GLSL,qt as CAVE_LIGHT_GLSL,at as MONKEY,P as NOISE_GLSL,Bt as PLACE,oe as ROCK_GLSL,vt as WALL_HALF,We as buildHero,me as buildHome,pe as buildHouse,le as buildShell,ze as buildWall,ae as caveMaterial,Rt as caveUniforms,ke as caveWaterMaterial,Wt as crackHalf,Gt as crackMid,Pt as fallThrow,Zt as fallTime,Te as galFloorAt,_e as galFootZ,se as galOpening,Ze as galRimZ,Ge as galRoofAt,J as galSqueeze,Se as homeUniforms,ne as layoutHome,re as layoutHouse,D as lin,yt as makeBuilder,te as makeFall,ee as makeMist,Fe as makeMonkeys,Me as makeUniforms,Ce as monkeyBody,Qt as monkeyReach,Ae as placeUniforms,Jt as posePoint,Mt as wallTop,ge as wallZ};
