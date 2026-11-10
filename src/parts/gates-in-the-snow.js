import*as y from"three";import{clamp as pe,lerp as Ee,smoothstep as _e}from"../kit/core.js";const ot=["#1A1B1E","#3A4048","#F4F6F8","#C9D6E6","#E6EAEC","#F08A2A","#FFE08A"],X=y.Vector3,te=`
uniform vec3 uIron, uSheen, uScale, uSnow, uBlue, uPearl, uOrange, uStraw, uCherry;
uniform float uFog, uTime, uNear;
uniform vec3 uEdge;                     // xy: the edge-on sheen's band (1 - |n.V|), z: how strongly hammer flats show
uniform vec2 uPx;                       // x: drawing-buffer height in px, y: least bar width in px
uniform float uUnder;                   // 1 on work the lens passes close beneath (the overthrow): see ironCol. Not supplied (0) everywhere else
float h13(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
vec3 toPearl(vec3 c, float d){ vec3 m = mix(sqrt(max(uPearl, 0.)), sqrt(max(c, 0.)), exp(-max(d - uNear, 0.) / max(uFog, 1.))); return m * m; }   // mixed as the eye sees it, so black holds;   // work within uNear of the lens keeps its full black
// far iron pales and sheds its small work, the heavy members and their caps stay: a bar of half-thickness r fades as if nearer
float fadeD(float d, float r){ return d * mix(1., .45, smoothstep(.45, 1.3, r)); }
// heat 0..1 -> black, cherry, orange, straw
vec3 heatCol(vec3 cold, float h){
  vec3 c = mix(cold, uCherry, smoothstep(0., .3, h));
  c = mix(c, uOrange, smoothstep(.25, .6, h));
  return mix(c, uStraw, smoothstep(.6, .95, h));
}
// the whole iron rule: n = facet normal (world), V = to the lens, o = position on the bar (object space, metres)
vec3 ironCol(vec3 n, vec3 V, vec3 o, float s, float taper, float d){
  float up = step(.55, n.y);
  float edge = smoothstep(uEdge.x, uEdge.y, 1. - abs(dot(n, V)));
  vec3 c = uIron;
  // one black. Close to, a few long narrow hammer flats run ALONG the bar on its upper facets, a hair lighter (never a grid:
  // each flat is 3 to 6 m long, every facet starts its run somewhere else, and only one cell in four carries one)
  float fid = dot(floor(n * 2.5 + .5), vec3(1., 5., 11.)), run = s / (3.2 + 2.6 * h11(fid * 3.7 + 2.)) + h11(fid * 1.3 + 5.) * 9.;
  float flat_ = step(.74, h11(floor(run) * 7.13 + fid)) * step(.1, n.y) * step(.12, fract(run)) * step(fract(run), .9);
  c = mix(c, uSheen, uEdge.z * (.45 + .25 * taper) * flat_ * (1. - smoothstep(22., 60., d)));
  // ROUND NINE, uUnder: seen from below no upper facet faces the lens, and where two bars overlap they were one black mass. On such work the
  // facet turned toward the top of the picture carries the sheen (a rule of the facet still, hard-edged), so every scroll can be followed
  vec3 cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  float rim = uUnder * smoothstep(.16, .4, -V.y) * step(.45, dot(n, cu)) * step(.45, 1. - abs(dot(n, V)));   // a sliver: only a facet turned well away from the lens, on the bar's upper side
  return mix(c, uSheen, max(max(up, edge), rim));
}
`,He=`
float widen(float r, float w, float d, float light){
  float mPerPx = 2. * max(w, .05) / max(uPx.x * projectionMatrix[1][1], 1.);
  float k = clamp(.5 * uPx.y * mPerPx / max(r, .02), 1., 8.);
  return k * (1. - light * smoothstep(140., 200., d));
}
`,Oe=`
attribute vec3 aC; attribute vec3 aS;      // aC: centre line; aS: arc length m, flags (1 light, 2 taper, 3 both), half-thickness
varying vec3 vN, vW, vO; varying vec3 vA; varying float vF;
${te}${He}
void main(){
  mat4 M = modelMatrix;
  #ifdef USE_INSTANCING
  M = modelMatrix * instanceMatrix;
  #endif
  vec4 wc = M * vec4(aC, 1.);
  vec3 off = (M * vec4(position, 1.)).xyz - wc.xyz;
  vec4 cc = projectionMatrix * viewMatrix * wc;
  float d = distance(cameraPosition, wc.xyz);
  float light = step(.5, mod(aS.y, 2.));
  vec3 w = wc.xyz + off * widen(aS.z, cc.w, d, light);
  vN = mat3(M) * normal; vW = w; vO = position; vA = vec3(aS.x, step(1.5, aS.y), d); vF = fadeD(d, aS.z);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,De=`
varying vec3 vN, vW, vO; varying vec3 vA; varying float vF;
${te}
void main(){
  vec3 n = vN / max(length(vN), 1e-4);
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  #ifdef FACET
  // beaten leaves: the rule is decided once per facet (its true normal, turned to the lens), so a leaf is flat black with at
  // most a hard-edged sheen facet and never a gradient, however close it passes
  vec3 fn = cross(dFdx(vW), dFdy(vW)); float fl = length(fn);
  if (fl > 1e-10) { n = fn / fl; if (dot(n, V) < 0.) n = -n; }
  gl_FragColor = vec4(toPearl(mix(uIron, uSheen, step(.5, n.y)), vF), 1.);
  #else
  gl_FragColor = vec4(toPearl(ironCol(n, V, vO, vA.x, vA.y, vA.z), vF), 1.);
  #endif
}`,nt=`
attribute vec3 aC; attribute vec3 aS; attribute float aShed;   // aS: arc length / scallop period, v (0 top .. 1 lip hem), bar half-thickness
uniform float uShed, uShiver; uniform vec2 uCap;   // uCap: the caps' own pixel floor (x times the bars') and how slowly they pale with range (y)
varying vec3 vN; varying vec3 vA;
${te}${He}
void main(){
  mat4 M = modelMatrix;
  #ifdef USE_INSTANCING
  M = modelMatrix * instanceMatrix;
  #endif
  vec4 wc = M * vec4(aC, 1.);
  vec3 off = (M * vec4(position, 1.)).xyz - wc.xyz;
  vec4 cc = projectionMatrix * viewMatrix * wc;
  float d = distance(cameraPosition, wc.xyz);
  // a cap that lets go: staggered along the bar, it slumps and is gone (the falling clumps are separate instances)
  float shedL = aShed > .5 ? clamp(uShed - (aShed - 1.), 0., 1.) : 0.;   // aShed: 0 never sheds, 1 + order otherwise
  float gone = clamp(max(uShiver, shedL) * 1.6 - .6 * (.5 + .5 * sin(aS.x * 1.9 + aC.x * .37 + aC.z * .23)), 0., 1.);   // a wave along the bar, so the cap slumps in lumps, not shards
  gone = gone * gone * (3. - 2. * gone);
  off *= 1. - gone;
  vec3 w = wc.xyz + off * widen(aS.z / max(uCap.x, .2), cc.w, d, 0.);
  vN = mat3(M) * normal; vA = vec3(aS.x, aS.y, fadeD(d, aS.z) * uCap.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,st=`
varying vec3 vN; varying vec3 vA;
${te}
void main(){
  vec3 n = vN / max(length(vN), 1e-4);
  if (vA.y > .01) {                       // the lip: a hanging hem with a scalloped edge
    float hem = .30 + .70 * abs(sin(vA.x * 3.14159)) * (.75 + .25 * sin(vA.x * 1.7 + 1.3));
    if (vA.y > hem) discard;
  }
  vec3 c = mix(uBlue, uSnow, step(.22, n.y) * step(vA.y, .01));
  gl_FragColor = vec4(toPearl(c, vA.z), 1.);
}`;class ye{constructor(){this.nv=0,this.ni=0,this.cv=8192,this.ci=16384,this.shed=0,this.P=new Float32Array(this.cv*3),this.N=new Float32Array(this.cv*3),this.C=new Float32Array(this.cv*3),this.A=new Float32Array(this.cv*3),this.S=new Float32Array(this.cv),this.I=new Uint32Array(this.ci)}need(t,e){if(this.nv+t>this.cv){for(;this.nv+t>this.cv;)this.cv*=2;for(const s of["P","N","C","A"]){const d=new Float32Array(this.cv*3);d.set(this[s]),this[s]=d}const n=new Float32Array(this.cv);n.set(this.S),this.S=n}if(this.ni+e>this.ci){for(;this.ni+e>this.ci;)this.ci*=2;const n=new Uint32Array(this.ci);n.set(this.I),this.I=n}}v(t,e,n,s,d,C,L,P,R,u,F,x){const T=this.nv++,I=T*3;return this.P[I]=t,this.P[I+1]=e,this.P[I+2]=n,this.N[I]=s,this.N[I+1]=d,this.N[I+2]=C,this.C[I]=L,this.C[I+1]=P,this.C[I+2]=R,this.A[I]=u,this.A[I+1]=F,this.A[I+2]=x,this.S[T]=this.shed,T}tri(t,e,n){const s=this.I;s[this.ni++]=t,s[this.ni++]=e,s[this.ni++]=n}get triangles(){return this.ni/3}geometry(){const t=new y.BufferGeometry,e=(n,s)=>new y.BufferAttribute(n.slice(0,this.nv*s),s);return t.setAttribute("position",e(this.P,3)),t.setAttribute("normal",e(this.N,3)),t.setAttribute("aC",e(this.C,3)),t.setAttribute("aS",e(this.A,3)),t.setAttribute("aShed",e(this.S,1)),t.setIndex(new y.BufferAttribute(this.I.slice(0,this.ni),1)),t.computeBoundingSphere(),t}}const B=new X,re=new X,ge=new X,be=new X,xe=new X,Pe=new X,b=new X,Ne=(c,t,e)=>{const n=c[Math.max(0,t-1)],s=c[Math.min(c.length-1,t+1)];e.subVectors(s,n);const d=e.length();return d>1e-6?e.multiplyScalar(1/d):e.set(1,0,0)};function rt(c,t,e,n,s,d,C,L,P,R,u,F,x,T,I){xe.set(t[s]-t[e],t[s+1]-t[e+1],t[s+2]-t[e+2]),Pe.set(t[d]-t[n],t[d+1]-t[n+1],t[d+2]-t[n+2]),b.crossVectors(xe,Pe);const N=b.length();if(N<1e-9)return;b.multiplyScalar(1/N);const f=b.x*((t[e]+t[s])*.5-I.x)+b.y*((t[e+1]+t[s+1])*.5-I.y)+b.z*((t[e+2]+t[s+2])*.5-I.z)<0;f&&b.negate(),c.need(4,6);const i=c.v(t[e],t[e+1],t[e+2],b.x,b.y,b.z,C[L],C[L+1],C[L+2],R,F,x),l=c.v(t[n],t[n+1],t[n+2],b.x,b.y,b.z,C[L],C[L+1],C[L+2],R,F,x),w=c.v(t[s],t[s+1],t[s+2],b.x,b.y,b.z,C[P],C[P+1],C[P+2],u,F,T),V=c.v(t[d],t[d+1],t[d+2],b.x,b.y,b.z,C[P],C[P+1],C[P+2],u,F,T);f?(c.tri(i,w,l),c.tri(i,V,w)):(c.tri(i,l,w),c.tri(i,w,V))}function W(c,t,e={}){const n=t.length,s=e.sides||4,d=e.star??1,C=e.twist||0,L=e.rot??Math.PI/s,P=typeof e.r=="function"?e.r:()=>e.r??.5,R=(e.light?1:0)+(e.taper?2:0),u=new Float32Array(n*s*3),F=new Float32Array(n*3),x=new Float32Array(n),T=new Float32Array(n),I=e.up||be.set(0,0,1);let N=0;for(let i=0;i<n;i++){const l=t[i];Ne(t,i,B),i===0?(re.copy(I).addScaledVector(B,-I.dot(B)),re.lengthSq()<1e-4&&re.set(1,0,0).addScaledVector(B,-B.x),re.normalize()):(re.addScaledVector(B,-re.dot(B)),re.lengthSq()<1e-8&&re.set(0,1,0).addScaledVector(B,-B.y),re.normalize(),N+=l.distanceTo(t[i-1])),ge.crossVectors(B,re);const w=n>1?i/(n-1):0,V=Math.max(0,P(w,i)),p=V/Math.cos(Math.PI/s);F[i*3]=l.x,F[i*3+1]=l.y,F[i*3+2]=l.z,x[i]=V,T[i]=N;for(let _=0;_<s;_++){const H=L+C*w+_/s*Math.PI*2,O=p*(_&1?d:1),$=Math.cos(H)*O,ae=Math.sin(H)*O,se=(i*s+_)*3;u[se]=l.x+re.x*$+ge.x*ae,u[se+1]=l.y+re.y*$+ge.y*ae,u[se+2]=l.z+re.z*$+ge.z*ae}}const f=e.s0||0;for(let i=0;i<n-1;i++){xe.copy(t[i]).add(t[i+1]).multiplyScalar(.5);const l=ge.copy(xe);for(let w=0;w<s;w++){const V=(w+1)%s;rt(c,u,(i*s+w)*3,(i*s+V)*3,((i+1)*s+V)*3,((i+1)*s+w)*3,F,i*3,(i+1)*3,f+T[i],f+T[i+1],R,x[i],x[i+1],l)}}for(const i of[0,n-1]){if((i===0?e.capA:e.capB)===!1||x[i]<.02)continue;Ne(t,i,B),i===0&&B.negate();const l=t[i];c.need(s+1,s*3);const w=c.v(l.x,l.y,l.z,B.x,B.y,B.z,l.x,l.y,l.z,f+T[i],R,x[i]),V=[];for(let O=0;O<s;O++){const $=(i*s+O)*3;V.push(c.v(u[$],u[$+1],u[$+2],B.x,B.y,B.z,l.x,l.y,l.z,f+T[i],R,x[i]))}const p=i*s*3,_=p+3;xe.set(u[p]-l.x,u[p+1]-l.y,u[p+2]-l.z),Pe.set(u[_]-l.x,u[_+1]-l.y,u[_+2]-l.z);const H=b.crossVectors(xe,Pe).dot(B)>0;for(let O=0;O<s;O++){const $=V[O],ae=V[(O+1)%s];H?c.tri(w,$,ae):c.tri(w,ae,$)}}return N}function we(c,t,e={}){const n=typeof e.r=="function"?e.r:()=>e.r??.5,s=e.maxSlope??.8,d=e.wide??1.3,C=e.high??.6,L=e.minH??.25,P=e.seed??0,R=e.pinch!==!1,u=[],F=[];for(let f=0;f<t.length;f++){const i=n(t.length>1?f/(t.length-1):0,f);if(u.push(t[f]),F.push(i),f<t.length-1){const l=n((f+1)/(t.length-1),f+1),w=t[f].distanceTo(t[f+1]),V=Math.ceil(w/Math.max(e.step??1.2,4*i));for(let p=1;p<V;p++)u.push(t[f].clone().lerp(t[f+1],p/V)),F.push(Ee(i,l,p/V))}}const x=[[-1,-.68,1],[-1,.12,.02],[-.62,.78,0],[0,1,0],[.62,.78,0],[1,.12,.02],[1,-.68,1]],T=[[0,1,1],[1,2,0],[2,3,0],[3,4,0],[4,5,0],[5,6,1],[5,1,2]],I=f=>{const i=f.length,l=new Float32Array(i*21),w=new Float32Array(i);let V=0;for(let p=1;p<i;p++)V+=u[f[p]].distanceTo(u[f[p-1]]),w[p]=V;for(let p=0;p<i;p++){const _=f[p],H=u[_],O=F[_];Ne(u,_,B),be.set(0,1,0).addScaledVector(B,-B.y).normalize(),ge.crossVectors(B,be);const $=R?_e(0,2*O+.3,Math.min(w[p],V-w[p])):1,ae=.82+.36*(.5+.5*Math.sin(w[p]*1.31/Math.max(O,.2)+P*9.1+_*.7)),se=d*O*(.7+.3*$),le=Math.max(2*O*C,L)*(.25+.75*$)*ae;for(let j=0;j<7;j++){const Z=x[j][0]*se,oe=O+x[j][1]*le,a=(p*7+j)*3;l[a]=H.x+ge.x*Z+be.x*oe,l[a+1]=H.y+ge.y*Z+be.y*oe,l[a+2]=H.z+ge.z*Z+be.z*oe}}for(let p=0;p<i-1;p++){const _=u[f[p]],H=u[f[p+1]],O=F[f[p]],$=F[f[p+1]],ae=e.period??Math.max(1.2,3.2*O),se=w[p]/ae+P,le=w[p+1]/ae+P;for(const[j,Z,oe]of T){const a=(p*7+j)*3,v=(p*7+Z)*3,M=((p+1)*7+Z)*3,z=((p+1)*7+j)*3;xe.set(l[M]-l[a],l[M+1]-l[a+1],l[M+2]-l[a+2]),Pe.set(l[z]-l[v],l[z+1]-l[v+1],l[z+2]-l[v+2]),b.crossVectors(xe,Pe);const A=b.length();if(A<1e-9)continue;b.multiplyScalar(1/A),oe===2?b.y>0&&b.negate():b.x*((l[a]+l[M])*.5-(_.x+H.x)*.5)+b.y*((l[a+1]+l[M+1])*.5-(_.y+H.y)*.5)+b.z*((l[a+2]+l[M+2])*.5-(_.z+H.z)*.5)<0&&b.negate();const E=oe===1?x[j][2]:0,J=oe===1?x[Z][2]:0;c.need(4,6);const me=c.v(l[a],l[a+1],l[a+2],b.x,b.y,b.z,_.x,_.y,_.z,se,E,O),he=c.v(l[v],l[v+1],l[v+2],b.x,b.y,b.z,_.x,_.y,_.z,se,J,O),ke=c.v(l[M],l[M+1],l[M+2],b.x,b.y,b.z,H.x,H.y,H.z,le,J,$),Ce=c.v(l[z],l[z+1],l[z+2],b.x,b.y,b.z,H.x,H.y,H.z,le,E,$);c.tri(me,he,ke),c.tri(me,ke,Ce)}}};let N=[];for(let f=0;f<u.length;f++)Ne(u,f,B),Math.abs(B.y)<s?N.push(f):(N.length>1&&I(N),N=[]);N.length>1&&I(N)}function de(c,t,e,n,s={}){const d=s.band??Math.max(.1,n*.2),C=s.turns??3,L=s.seg??8,P=C*L,R=s.rng,u=e.clone().normalize();R&&(u.x+=R.range(-.07,.07),u.y+=R.range(-.07,.07),u.z+=R.range(-.07,.07),u.normalize());const F=new X(0,0,1);Math.abs(u.z)>.9&&F.set(1,0,0),F.addScaledVector(u,-F.dot(u)).normalize();const x=new X().crossVectors(u,F),T=R?R()*6.28:0,I=[];for(let N=0;N<=P;N++){const f=T+N/L*Math.PI*2,i=(N/P-.5)*C*d*2.04,l=n+d*.75;I.push(new X(t.x+u.x*i+(F.x*Math.cos(f)+x.x*Math.sin(f))*l,t.y+u.y*i+(F.y*Math.cos(f)+x.y*Math.sin(f))*l,t.z+u.z*i+(F.z*Math.cos(f)+x.z*Math.sin(f))*l))}W(c,I,{r:d,sides:4,up:u,light:s.light})}function ze(c,t,e=.2,n=0,s=0,d=1){const C=e/Math.sqrt(1+e*e),L=1.15*t/C,P=Math.max(1,c*.5/C-L);return{L:P+n,Lw:P,b:e,s0:L,k:s,hand:d,R:t}}const We=(c,t)=>c.R*(.5+.5*_e(0,.4*c.Lw,t));function $e(c,t,e){const n=c.L-c.Lw,s=Math.abs(c.k)<1e-4?1e-4:c.k,d=f=>{const i=Math.min(f,n),l=f-i,w=s*i;return[Math.sin(w)/s+Math.cos(w)*l,(1-Math.cos(w))/s+Math.sin(w)*l]};if(t>=c.Lw){const f=d(c.L-t);return e[0]=f[0],e[1]=f[1]*c.hand,e}const C=c.b/Math.sqrt(1+c.b*c.b),L=Math.atan(1/c.b),P=c.s0+t,R=c.s0+c.Lw,u=Math.log(P)/c.b,F=Math.log(R)/c.b,x=d(n),T=s*n-(F+L+Math.PI),I=C*(P*Math.cos(u)-R*Math.cos(F)),N=C*(P*Math.sin(u)-R*Math.sin(F));return e[0]=x[0]+Math.cos(T)*I-Math.sin(T)*N,e[1]=(x[1]+Math.sin(T)*I+Math.cos(T)*N)*c.hand,e}function Te(c,t,e,n,s=40){const d=[],C=[],L=[0,0];for(let P=0;P<=s;P++){const R=n.L*Math.pow(1-P/s,1.6);$e(n,R,L),C.push(We(n,R)),d.push(new X(c.x+t.x*L[0]+e.x*L[1],c.y+t.y*L[0]+e.y*L[1],c.z+t.z*L[0]+e.z*L[1]))}return{pts:d,r:(P,R)=>C[R]}}const Ue=`
attribute vec4 aSc, aSd; attribute vec2 aSe;
uniform float uRun, uHeat;
vec2 sBase(float sg, float Ls, float k){ float a = min(sg, Ls), ex = sg - a, ph = k * a; return vec2(sin(ph) / k + cos(ph) * ex, (1. - cos(ph)) / k + sin(ph) * ex); }
// centre (xy) and heading angle (z) of the bar at arc length s from the tip, with e pushed out and w wound
vec3 scrollPose(float s, float e, float w){
  float L = aSc.x, Lw = aSc.y, b = max(aSc.z, .02), s0 = max(aSc.w, .01), Ls = L - Lw;
  float k = abs(aSd.x) < 1e-4 ? 1e-4 : aSd.x;
  if (s >= w) { float sg = max(e - s, 0.); return vec3(sBase(sg, Ls, k), k * min(sg, Ls)); }
  float sgw = max(e - w, 0.), phw = k * min(sgw, Ls);
  float c = b / sqrt(1. + b * b), al = atan(1. / b), q = s0 + s, qw = s0 + w, th = log(q) / b, thw = log(qw) / b;
  float rho = phw - (thw + al + 3.14159265);
  vec2 d = c * (q * vec2(cos(th), sin(th)) - qw * vec2(cos(thw), sin(thw)));
  float cr = cos(rho), sr = sin(rho);
  return vec3(sBase(sgw, Ls, k) + vec2(cr * d.x - sr * d.y, sr * d.x + cr * d.y), rho + th + al + 3.14159265);
}
float scrollG(){ return clamp((uRun - aSd.w) / max(aSe.x, 1e-3), 0., 1.); }
`,it=`
varying vec3 vN, vW, vO, vR; varying vec3 vA; varying vec4 vH; varying float vF;
uniform vec2 uEmber;                    // x: how hot finished work stays (0 none, .3 cherry), y: for how much of the run
uniform float uHeatMin;                 // the least share of the hot length kept beside the lens (.35; a run whose scrolls are the picture keeps more)
${te}${He}${Ue}
void main(){
  float g = scrollG(), L = aSc.x, Lw = aSc.y;
  float e = L * clamp(g / .45, 0., 1.), w = Lw * clamp((g - .12) / .78, 0., 1.);
  float s = L * pow(clamp(1. - position.x, 0., 1.), 1.6);
  vec3 ps = scrollPose(s, e, w);
  float r = aSd.z * (.5 + .5 * smoothstep(0., max(.4 * Lw, 1e-3), s)) * step(s, e + .01) * step(.0005, g);
  vec2 T = vec2(cos(ps.z), sin(ps.z)), Nn = vec2(-T.y, T.x);
  vec3 c = vec3(ps.x, ps.y * aSd.y, 0.);
  vec3 nrm = vec3(Nn.x * normal.y, Nn.y * normal.y * aSd.y, normal.z);
  vec3 off = vec3(Nn.x * position.y, Nn.y * position.y * aSd.y, position.z);
  float isCollar = step(position.x, -.01);                 // the three-turn collar it springs from: template verts with x < 0
  if (isCollar > .5) { c = vec3((-position.x - .2) * 11. * aSd.z, 0., 0.); off = vec3(0., position.y * aSd.y, position.z);
    nrm = vec3(normal.x, normal.y * aSd.y, normal.z); r = aSd.z * step(.0005, g); s = L; }
  mat4 M = modelMatrix * instanceMatrix;
  vec4 wc = M * vec4(c, 1.);
  vec4 cc = projectionMatrix * viewMatrix * wc;
  float d = distance(cameraPosition, wc.xyz);
  vec3 wp = wc.xyz + mat3(M) * off * (r * widen(max(r, .02), cc.w, d, 0.));
  float hl = max(uHeat, .1) * clamp(d / (20. + 20. * aSd.z + 70. * max(aSd.z - .35, 0.)), uHeatMin, 1.);       // heat stays small: beside the lens the hot length shortens, sooner on heavy bar
  // heat is drawn per pixel from the arc length (vA.x): vH = bend, hot length, how hot the bend is, how hot the cooled bend stays.
  // the last bend cools slowly where the hour is dark: a thin cherry arc that goes out over uEmber.y of the run
  float age = uRun - aSd.w - aSe.x, hold = 1. - smoothstep(.5 * uEmber.y, max(uEmber.y, 1e-3), age);
  vH = vec4(w, hl, (1. - smoothstep(.88, 1., g)) * step(.0005, g) * (1. - isCollar), uEmber.x * hold * step(.9, g) * (1. - isCollar));
  vR = mat3(M) * off;
  vN = mat3(M) * nrm; vW = wp; vO = c + off * r + aSe.y * 31.; vA = vec3(s, 1., d); vF = fadeD(d, aSd.z);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`,lt=`
varying vec3 vN, vW, vO, vR; varying vec3 vA; varying vec4 vH; varying float vF;
${te}
void main(){
  vec3 n = vN / max(length(vN), 1e-4);
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  float s = vA.x, hl = max(vH.y, .02);
  float h = s < vH.x ? 1. - (vH.x - s) / hl : 1. - (s - vH.x) / (1.4 * hl);
  float heat = clamp(h, 0., 1.) * vH.z;
  // the ember is a thin arc down the middle of the bar as the lens sees it, never the whole bar
  vec3 rr = vR / max(length(vR), 1e-4);
  float emb = vH.w * step(.9, dot(rr, V)) * clamp(1.3 - abs(s - vH.x) / max(.45 * hl, .05), 0., 1.);
  gl_FragColor = vec4(heatCol(toPearl(ironCol(n, V, vO, vA.x, vA.y, vA.z), vF), max(heat, emb)), 1.);
}`,ct=`
uniform float uHalo; uniform vec2 uHaloPx; varying vec2 vUv; varying float vI, vSeed;
${te}${Ue}
void main(){
  float g = scrollG(), L = aSc.x, Lw = aSc.y, e = L * clamp(g / .45, 0., 1.), w = Lw * clamp((g - .12) / .78, 0., 1.);
  vec3 ps = scrollPose(w, e, w);
  vec4 mv = modelViewMatrix * instanceMatrix * vec4(ps.x, ps.y * aSd.y, 0., 1.);
  vI = step(.0005, g) * (1. - smoothstep(.86, .98, g));
  float mPerPx = 2. * max(-mv.z, .05) / max(uPx.x * projectionMatrix[1][1], 1.);
  float size = clamp(uHalo * aSd.z, uHaloPx.x * mPerPx, uHaloPx.y * uPx.x * mPerPx) * vI;   // never under a few px, never over a share of the frame
  vec2 tv = (modelViewMatrix * instanceMatrix * vec4(cos(ps.z), sin(ps.z) * aSd.y, 0., 0.)).xy; float tl = length(tv);
  tv = tl > 1e-4 ? tv / tl : vec2(1., 0.);                // the bar's heading at the bend, on screen
  float lie = clamp(tl / max(length(instanceMatrix[0].xyz), 1e-4), 0., 1.);   // seen end-on the bead is round
  vec2 q = position.xy * vec2(mix(1.15, 1.75, lie), mix(1.15, .8, lie)) * size * 2.;
  mv.xy += tv * q.x + vec2(-tv.y, tv.x) * q.y; mv.z += aSd.z * 1.5;
  vUv = position.xy * 2.; vSeed = aSe.y;
  gl_Position = projectionMatrix * mv;
}`,ht=`
varying vec2 vUv; varying float vI, vSeed;
${te}
void main(){
  // flat inks: the hot bend itself, a straw almond with an orange rim, cut hard, its edge licked unevenly (never a round bulb)
  vec2 p = vec2(vUv.x, vUv.y * (1. + .9 * vUv.x * vUv.x));
  float r = length(p) * (1. + .05 * sin(atan(p.y, abs(p.x) + 1e-4) * 5. + vSeed * 40. + uTime * 2.3));
  if (r > .9 || vI < .02) discard;
  gl_FragColor = vec4(mix(uStraw, uOrange, step(.5, r)), 1.);
}`,ut=`
uniform float uSpill, uLinger; varying vec2 vUv; varying float vI;
${te}${Ue}
void main(){
  float g = scrollG(), L = aSc.x, Lw = aSc.y, e = L * clamp(g / .45, 0., 1.), w = Lw * clamp((g - .12) / .78, 0., 1.);
  vec3 ps = scrollPose(w, e, w);
  vec4 wp = modelMatrix * instanceMatrix * vec4(ps.x, ps.y * aSd.y, 0., 1.);
  float age = uRun - aSd.w - aSe.x, born = step(.0005, g);
  float held = .62 * (1. - smoothstep(.3 * uLinger, max(uLinger, 1e-3), age)) * step(.001, uLinger);        // the pool stays while the work cools
  vI = born * max(1. - smoothstep(.8, .98, g), held) * (1. - smoothstep(2.5, 7., wp.y));
  vUv = position.xy * 2.;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp.x + position.x * uSpill, .07, wp.z + position.y * uSpill, 1.);
}`,ft=`
varying vec2 vUv; varying float vI;
${te}
void main(){
  float an = atan(vUv.y, abs(vUv.x) + 1e-4), r = length(vUv) * (1. + .07 * sin(an * 7.));
  float a = (1. - smoothstep(.08, .96, r)) * vI;                    // soft: orange at the rim, gold where the bend hangs over it
  if (a < .015) discard;
  gl_FragColor = vec4(mix(uOrange, uStraw, smoothstep(.4, .85, a)), min(a * .95, .85));
}`,vt=`
attribute vec3 aPos; attribute vec4 aSt; uniform float uRun, uFat, uBack; varying vec4 vU;
${te}
void main(){
  float ph = (uRun - aSt.x) / max(aSt.y, 1e-3);
  float life = aSt.y <= 0. ? 1. : smoothstep(0., .12, ph) * (1. - smoothstep(1., 2.4, ph));
  vec4 wb = modelMatrix * vec4(aPos, 1.);
  vec2 tc = cameraPosition.xz - wb.xz; tc /= max(length(tc), 1e-3);
  life *= smoothstep(6., 15., distance(cameraPosition, wb.xyz));       // a plume the lens brushes thins away instead of filling the frame
  // ROUND EIGHT: a near (thin) plume that is dying, or that the lens brushes, shrinks toward its foot as ONE column; its puffs no
  // longer shrink apart into beads that float with no source. Tall far plumes (uFat above 1.2) are as they were.
  float thin = 1. - step(1.2, uFat);
  float y = position.y, hgt = aSt.w * mix(.6 + .4 * life, .3 + .7 * life, thin);
  float lean = y * y * hgt * .3 + sin(uTime * .6 + aSt.z * 40. + y * 3.) * y * hgt * .04;
  // a fat (far, tall) plume turns its height toward the lens as well, so that seen from below on the climb it still stands as a column
  vec3 sd = vec3(-tc.y, 0., tc.x), tcam = cameraPosition - wb.xyz; tcam /= max(length(tcam), 1e-3);
  vec3 upv = mix(vec3(0., 1., 0.), cross(sd, tcam), clamp(uFat - 1., 0., 1.) * .85); upv /= max(length(upv), 1e-3);
  vec3 w = wb.xyz + sd * (position.x * hgt * .5 * uFat) + upv * (y * hgt) + vec3(lean, 0., lean * .35);
  vU = vec4(position.x * .5 * uFat, y, mix(life, 1., thin), aSt.z); gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  // ROUND ELEVEN, uBack (the plumes behind the Gates' crown): drawn where it stands but with the depth of a point uBack metres further from the
  // lens, so a plume that leans toward the lens never comes in front of the lace it stands behind
  if (uBack > 0.) { vec3 tb = w - cameraPosition; vec4 fb = projectionMatrix * viewMatrix * vec4(w + tb / max(length(tb), 1e-3) * uBack, 1.); gl_Position.z = fb.z / max(fb.w, 1e-4) * gl_Position.w; }
  if (life < .02) gl_Position = vec4(2., 2., 2., 1.);
}`,dt=`
varying vec4 vU; uniform float uFat;   // uFat: how fat the puffs are for the plume's height (1 near work, about 2 for tall far plumes, so they stand as columns, not stacks of beads)
${te}
void main(){
  vec2 p = vU.xy; float inside = -1., lit = -1.;
  for (int i = 0; i < 7; i++) {
    float fi = float(i), ph = fract(fi / 7. + uTime * .1 + vU.w * 3.7);
    float r = (.042 + .105 * ph) * uFat * smoothstep(0., .08, ph) * (1. - smoothstep(.66, 1., ph)) * (.4 + .6 * vU.z);
    vec2 c = vec2(.05 * uFat * ph * sin(ph * 7. + vU.w * 30. + fi * 2.1), .05 + .8 * ph - .1 * (uFat - 1.) * ph);
    inside = max(inside, r - length(p - c));
    lit = max(lit, .8 * r - length(p - c - vec2(-.16, .3) * r));
  }
  if (inside < 0.) discard;
  float low = 1. - smoothstep(.1, mix(.34, .17, clamp(uFat - 1., 0., 1.)) + .05 * sin(p.x * 31. + vU.w * 9.), p.y);          // lit from below by the iron it stands over
  low *= 1. - .8 * clamp(uFat - 1., 0., 1.);                                               // a tall far plume is white over blue: the fire is a long way under it
  // ROUND NINE: the palette's own colours only, never a blend of them (snow into straw gave a cream, blue into orange a dusty pink): the plume is
  // white over the snow's blue, and only the very foot of a plume standing on hot work is orange, cut hard
  vec3 c = low > .7 ? uOrange : (lit > 0. ? uSnow : uBlue);
  gl_FragColor = vec4(c, 1.);
}`,mt=`
varying vec3 vN, vW, vO; varying vec3 vA; varying float vF;
uniform vec4 uHot;
${te}
void main(){
  vec3 n = vN / max(length(vN), 1e-4);
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  float h;
  if (uHot.w <= 0.) h = (1. - vA.x / max(-uHot.w, .05)) * (.84 + .16 * sin(uTime * 1.1 + vW.x * .7 + vW.z * .9));
  else { float b = uHot.x - (uHot.y + vA.x * uHot.z), x = b < 0. ? 1. + b / (.06 * uHot.w) : 1. - b / uHot.w; if (x < .03) discard;
    h = b < 0. ? x : x * sqrt(max(x, 0.));                            // a front: straw at its head, orange a third of the way back, a long cherry tail going to black
    h *= .93 + .07 * sin(uTime * 1.7 + vA.x * 1.1); }                 // the hot stretch shimmers slowly as it cools
  gl_FragColor = vec4(heatCol(toPearl(ironCol(n, V, vO, vA.x, vA.y, vA.z), vF), clamp(h, 0., 1.)), 1.);
}`,pt=`
attribute vec3 aPos; attribute vec4 aCl; attribute float aSp;
uniform float uClock, uOpenA, uOpenT, uFall, uFloor, uStretch, uStreak, uLead, uBurst, uMinPx, uFollow, uFront, uPuffSel; varying vec3 vP; varying float vD, vK;
${te}
void main(){
  // uLead: the curtain's clock runs that many seconds ahead of the swing (the snow starts to go as the crown closes on the ring)
  // ROUND NINE, uFollow (the Gates' veils): the snow hangs from its rail, so the veil rides the leaf as it swings (half a second behind
  // it, in its wake) and stands uFront metres clear of the bars on the side the lens comes from: one veil per leaf, nothing in the gap
  float f = uClock - aCl.x, x0 = clamp((mix(aCl.x, uClock - .5, uFollow) - uLead) / max(uOpenT, 1e-3), 0., 1.), ang = uOpenA * x0 * x0 * (3. - 2. * x0);
  float sgn = sign(aCl.w);
  vec3 p = aPos + vec3(aCl.w * cos(ang), 0., -abs(aCl.w) * sin(ang)) + vec3(sgn * sin(ang), 0., abs(sgn) * cos(ang)) * uFront;
  float ff = max(f, 0.), vt = uFall * aSp, drop = vt * (ff - (1. - exp(-ff * .7)) / .7);          // aSp: a heavy lump falls faster than the powder torn off it
  // uBurst (the Gates' curtains): a clump that reaches the snow does not fade on the way down, it lands and bursts into a fat
  // puff of powder that swells, lifts a little and is gone; small ones just go out
  float h0 = max(aPos.y - uFloor - .5, .1), over = max(drop - h0, 0.) * uBurst, tl = over / max(vt, .1);
  // uPuffSel: only one landing in six swells into a fat puff (and those swell further): a few big puffs at the foot of the leaf, not a bank
  float big = mix(smoothstep(.9, 2.2, aCl.y), step(.83, fract(aCl.z * 91.7)) * step(.95, aCl.y), uPuffSel);
  drop = mix(drop, min(drop, h0), uBurst);
  p.y -= drop - over * .06 * big; p.x += sin(aCl.z * 50. + ff * 1.1) * .5 * min(ff, 2.); p.z += cos(aCl.z * 31. + ff * .9) * .5 * min(ff, 2.);
  float puff = (1. + (1.7 + 1.5 * uPuffSel) * big * smoothstep(0., .5, tl)) * (1. - smoothstep(.3 + 1.5 * big, .7 + 2.3 * big, tl));
  float alive = step(0., f) * smoothstep(0., .3, ff) * mix(smoothstep(uFloor, uFloor + 3., p.y), puff, uBurst);
  vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.);
  float mPerPx = 2. * max(-mv.z, .05) / max(uPx.x * projectionMatrix[1][1], 1.);
  float sz = max(aCl.y, uMinPx * mPerPx) * alive;
  // a clump is a piece of cap: a rounded white dome with a blue scalloped underside, a card turned to the lens, tumbling a little
  float tl2 = ((fract(aCl.z * 13.7) - .5) * 1.1 + sin(ff * 1.3 + aCl.z * 20.) * .25) / (1. + 4. * uStreak), ct = cos(tl2), sn = sin(tl2);
  vec2 q = position.xy * 2. * vec2(1.05 + .12 * uStretch, (.8 + .25 * uStretch * smoothstep(0., 2.5, ff)) * (1. + uStreak * smoothstep(.2, 1.6, ff) * (.5 + fract(aCl.z * 7.3))));   // uStreak: falling strokes; uStretch: a long fall draws taller lumps
  mv.xy += vec2(ct * q.x - sn * q.y, sn * q.x + ct * q.y) * sz;
  vP = vec3(position.xy * 2., aCl.z); vD = length(mv.xyz); vK = step(1e-4, over);
  gl_Position = projectionMatrix * mv;
}`,gt=`
varying vec3 vP; varying float vD, vK;
${te}
void main(){
  float x = vP.x, y = vP.y, yt = max(y, 0.), ph = vP.z * 40.;
  if (vK > .5) {                                                               // landed: a puff of powder, drawn like the steam: white over blue, cut hard
    float r = length(vP.xy) * (1. + .07 * sin(atan(y, abs(x) + 1e-4) * 5. + ph));
    if (r > .94) discard;
    float lit = .66 - length(vP.xy - vec2(-.1, .2));
    gl_FragColor = vec4(toPearl(mix(uBlue, uSnow, step(0., lit)), vD), 1.); return;
  }
  float under = -(.34 + .16 * cos(x * 7. + ph)) * (1. - .55 * x * x);         // the scalloped hem it tore off with
  if (x * x + yt * yt * 1.15 > .92 || y < under) discard;
  float blue = step(y, under + .36 + .1 * sin(x * 4. + ph * 1.7));   // a broad blue underside: it is what shows the piece on white snow and against the leaves
  gl_FragColor = vec4(toPearl(mix(uSnow, uBlue, blue), vD), 1.);
}`,xt=`
attribute vec3 aSeed; uniform float uBox; varying vec2 vUv; varying float vNear;
${te}
void main(){
  vec3 b = aSeed * uBox; b.y -= uTime * (1.2 + .6 * fract(aSeed.x * 7.3)); b.x += sin(uTime * .45 + aSeed.z * 40.) * 1.3; b.z += cos(uTime * .37 + aSeed.x * 40.) * 1.3;
  vec3 p = mod(b - cameraPosition, uBox) - .5 * uBox + cameraPosition;
  vec4 mv = viewMatrix * vec4(p, 1.);
  float d = length(mv.xyz), mPerPx = 2. * max(-mv.z, .05) / max(uPx.x * projectionMatrix[1][1], 1.);
  // snowfall, not snowballs: a flake is 14-28 cm across (the garden is three times life size), never under 2 px and never over 1.4% of the frame's height
  float size = clamp(.07 + .07 * fract(aSeed.y * 5.1), 1. * mPerPx, .007 * uPx.x * mPerPx) * (1. - smoothstep(.38 * uBox, .5 * uBox, d)) * smoothstep(.8, 2.5, d);
  mv.xy += position.xy * size * 2.; vUv = position.xy * 2.; vNear = 1. - smoothstep(26., 34., d);
  gl_Position = projectionMatrix * mv;
}`,wt=`
varying vec2 vUv; varying float vNear;
${te}
void main(){ if (dot(vUv, vUv) > 1.) discard; gl_FragColor = vec4(mix(uBlue, uSnow, vNear), 1.); }`;function yt(c,t={}){const e=t.palette||ot,n=a=>new y.Color(a),s={iron:n(e[0]),sheen:n(e[1]),snow:n(e[2]),snowBlue:n(e[3]),pearl:n(t.pearl||e[4]),orange:n(e[5]),straw:n(e[6]),cherry:n("#A8281E"),scale:n("#24262A"),veil:n("#DDE2E6")},d={uIron:{value:s.iron},uSheen:{value:s.sheen},uScale:{value:s.scale},uSnow:{value:s.snow},uBlue:{value:s.snowBlue},uPearl:{value:s.pearl},uOrange:{value:s.orange},uStraw:{value:s.straw},uCherry:{value:s.cherry},uFog:{value:t.fog??380},uNear:{value:t.near??0},uTime:{value:0},uEdge:{value:new y.Vector3(t.edge?.[0]??.8,t.edge?.[1]??.92,t.edge?.[2]??.32)},uPx:{value:new y.Vector2(720,t.minPx??2)},uShiver:{value:0},uCap:{value:new y.Vector2(t.cap?.[0]??1,t.cap?.[1]??1)}},C=new y.ShaderMaterial({uniforms:{...d},vertexShader:Oe,fragmentShader:De}),L=new y.ShaderMaterial({uniforms:{...d},defines:{FACET:1},vertexShader:Oe,fragmentShader:De}),P=()=>new y.ShaderMaterial({uniforms:{...d,uShed:{value:0}},vertexShader:nt,fragmentShader:st,side:y.DoubleSide}),R=P(),u=(a={})=>new y.ShaderMaterial({uniforms:{...d,uRun:{value:a.run??0},uHeat:{value:a.heat??2},uHeatMin:{value:a.heatMin??.35},uHalo:{value:a.halo??3},uEmber:{value:new y.Vector2(a.ember??0,a.cool??1)},uHaloPx:{value:new y.Vector2(a.haloMin??3.5,a.haloMax??.03)}},vertexShader:it,fragmentShader:lt,side:y.DoubleSide}),F=a=>new y.ShaderMaterial({uniforms:{...d,uRun:a.uniforms.uRun,uHeat:a.uniforms.uHeat,uHalo:a.uniforms.uHalo,uHaloPx:a.uniforms.uHaloPx},vertexShader:ct,fragmentShader:ht,transparent:!0,depthWrite:!1}),x=(a,v=4)=>new y.ShaderMaterial({uniforms:{...d,uRun:a.uniforms.uRun,uHeat:a.uniforms.uHeat,uSpill:{value:v},uLinger:{value:a.uniforms.uEmber.value.y}},vertexShader:ut,fragmentShader:ft,transparent:!0,depthWrite:!1,side:y.DoubleSide}),T=(a={})=>new y.ShaderMaterial({uniforms:{...d,uHot:{value:new y.Vector4(0,a.at??0,a.rate??1,a.len??-1.6)}},vertexShader:Oe,fragmentShader:mt}),I=(a,v=1)=>new y.ShaderMaterial({uniforms:{...d,uRun:a?a.uniforms.uRun:{value:0},uFat:{value:v},uBack:{value:0}},vertexShader:vt,fragmentShader:dt,side:y.DoubleSide}),N=(a={})=>new y.ShaderMaterial({uniforms:{...d,uClock:{value:-1},uOpenA:{value:a.openA??0},uOpenT:{value:a.openT??8},uFall:{value:a.fall??15},uFloor:{value:a.floor??0},uStretch:{value:a.stretch??3.6},uStreak:{value:a.streak??0},uLead:{value:a.lead??0},uBurst:{value:a.burst??0},uMinPx:{value:a.minPx??1.5},uFollow:{value:a.follow??0},uFront:{value:a.front??0},uPuffSel:{value:a.puffSel??0}},vertexShader:pt,fragmentShader:gt}),f=new ye;{const a=[];for(let v=0;v<=30;v++)a.push(new X(v/30,0,0));W(f,a,{r:1,sides:6,capA:!1});for(const v of[-.3,-.22,-.14])W(f,[new X(v,0,0),new X(v+.045,0,0)],{r:1.7,sides:6,rot:v*9})}const i=new ye;{const a=[];for(let v=0;v<=14;v++)a.push(new X(v/14,0,0));W(i,a,{r:1,sides:6,capA:!1});for(const v of[-.3,-.18])W(i,[new X(v,0,0),new X(v+.045,0,0)],{r:1.7,sides:4,rot:v*9})}const l=i.geometry(),w=f.geometry(),V=new y.PlaneGeometry(1,1),p=new y.PlaneGeometry(1,1,1,5).translate(0,.5,0),_=V,H=(a,v,M)=>{const z=new y.InstancedBufferGeometry;z.index=a.index;for(const A of["position","normal","uv"])a.attributes[A]&&z.setAttribute(A,a.attributes[A]);for(const[A,E]of M)z.setAttribute(A,new y.InstancedBufferAttribute(new Float32Array(v*E),E));return z.instanceCount=v,z},O=(a,v,M=!1)=>{const z=H(M?l:w,a.length,[["aSc",4],["aSd",4],["aSe",2]]),A=new y.InstancedMesh(z,v,a.length);return a.forEach((E,J)=>{A.setMatrixAt(J,E.m),z.attributes.aSc.setXYZW(J,E.S.L,E.S.Lw,E.S.b,E.S.s0),z.attributes.aSd.setXYZW(J,E.S.k,E.S.hand,E.S.R,E.order),z.attributes.aSe.setXY(J,E.dur,E.seed??0)}),A.frustumCulled=!1,A},$=(a,v)=>{const M=new y.InstancedBufferGeometry;M.index=V.index,M.setAttribute("position",V.attributes.position);for(const A of["aSc","aSd","aSe"])M.setAttribute(A,a.geometry.attributes[A]);M.instanceCount=a.count;const z=new y.InstancedMesh(M,v,a.count);return z.instanceMatrix=a.instanceMatrix,z.frustumCulled=!1,z.renderOrder=5,z},ae=(a,v)=>{const M=$(a,v);return M.renderOrder=1,M},se=(a,v)=>{const M=H(p,a.length,[["aPos",3],["aSt",4]]);a.forEach((A,E)=>{M.attributes.aPos.setXYZ(E,A.p.x,A.p.y,A.p.z),M.attributes.aSt.setXYZW(E,A.order,A.dur,A.seed??0,A.h)});const z=new y.Mesh(M,v);return z.frustumCulled=!1,z.renderOrder=4,z},le=(a,v)=>{const M=H(_,a.length,[["aPos",3],["aCl",4],["aSp",1]]);a.forEach((A,E)=>{M.attributes.aPos.setXYZ(E,A.p.x,A.p.y,A.p.z),M.attributes.aCl.setXYZW(E,A.t,A.size,A.seed??0,A.rho??0),M.attributes.aSp.setX(E,A.sp??1)});const z=new y.Mesh(M,v);return z.frustumCulled=!1,z},j=(a=6e3,v=120)=>{const M=H(V,a,[["aSeed",3]]),z=M.attributes.aSeed.array,A=c.rng.fork("flakes");for(let J=0;J<z.length;J++)z[J]=A();const E=new y.Mesh(M,new y.ShaderMaterial({uniforms:{...d,uBox:{value:v}},vertexShader:xt,fragmentShader:wt}));return E.frustumCulled=!1,E},Z=(a,v)=>{const M=new y.Mesh(a.geometry(),v);return M.frustumCulled=!1,M},oe=new y.Vector2;return{pal:s,uniforms:d,iron:C,ironFacet:L,snow:R,snowMaterial:P,hotMaterial:T,scrollMaterial:u,haloMaterial:F,spillMaterial:x,spillMesh:ae,steamMaterial:I,clumpMaterial:N,scrollMesh:O,haloMesh:$,steamMesh:se,clumpMesh:le,mesh:Z,flakes:j,Batch:ye,bar:W,cap:we,collar:de,scrollSpec:ze,scrollPts:Te,scrollAt:$e,scrollTaper:We,update(a,v,M){d.uTime.value=v,c.renderer&&(c.renderer.getDrawingBufferSize(oe),d.uPx.value.x=oe.y)}}}const o=(c,t,e)=>new X(c,t,e),ie=(c,t,e=1)=>{const n=[];for(let s=0;s<=e;s++)n.push(c.clone().lerp(t,s/e));return n};async function St(c,t={}){const e=c.rng,n=t.style||yt(c,{palette:t.palette}),s=pe(t.detail??c.quality?.detail??1,.6,1),d=y.MathUtils.degToRad(t.tilt??33),C=t.ringY??104,L=y.MathUtils.degToRad(t.openAngle??80),P=45,R=49,u=90,F=new y.Group;F.name="great-gates";const x=async()=>{await c.yield()};await x(0);const T=t.overthrow||e.pick(["C","C","S","lyre"]),I=e.sign(),N=e.range(.185,.235),f=o(1,0,0),i=o(0,1,0),l=o(0,0,1),w=new ye,V=new ye;for(const h of[-1,1]){const r=h*R,S=I*h;W(w,ie(o(r,0,0),o(r,6.2,0),1),{r:3.75,sides:4,capA:!1}),W(w,ie(o(r,6,0),o(r,92.2,0),120),{r:3,sides:8,star:.6,twist:S*Math.PI*2*5.5,capA:!1,capB:!1}),de(w,o(r,8.2,0),i,3.2,{band:.8,seg:10,rng:e}),de(w,o(r,90,0),i,3.2,{band:.8,seg:10,rng:e}),W(w,ie(o(r,92,0),o(r,100,0),1),{r:3.55,sides:4}),W(w,ie(o(r,100,0),o(r,114+e.range(-1,1.5),0),8),{r:g=>1.5*(1-g)**.8,sides:4,taper:!0,rot:e.range(0,1.5),capA:!1}),de(w,o(r,101.4,0),i,1.45,{band:.42,rng:e}),we(V,[o(r-3.5,96.45,0),o(r+3.5,96.45,0)],{r:3.55,wide:1.06,high:.3,seed:e()}),we(V,[o(r-3.7,2.5,0),o(r+3.7,2.5,0)],{r:3.75,wide:1.05,high:.12,seed:e()});for(let g=0;g<4;g++){const U=g*Math.PI/2+Math.PI/4,G=o(Math.cos(U),0,Math.sin(U)),Y=ze(e.range(4.2,5.4),.42,N+e.range(-.02,.02),e.range(3.5,5),-.05,1),ne=Te(o(r+G.x*1.3,100.2,G.z*1.3),i,G.clone().negate(),Y,30);ne.pts.forEach(ee=>{ee.x=r+(ee.x-r)*-1,ee.z*=-1}),W(w,ne.pts,{r:ne.r,sides:6,taper:!0,capA:!1}),we(V,ne.pts,{r:ne.r,seed:e(),maxSlope:.7})}await x(2)}const p=o(0,C,0),_=o(0,Math.cos(d),Math.sin(d)),H=o(0,Math.sin(d),-Math.cos(d)),O=(h,r=8)=>o(Math.sin(h)*r,0,0).addScaledVector(_,-Math.cos(h)*r).add(p);{const h=[];for(let g=0;g<=64;g++)h.push(O(g/64*Math.PI*2));const r=[e.range(.94,1.06),e.range(0,6.28)];W(w,h,{r:g=>1*(1+.04*Math.sin(g*12.56+r[1]))*r[0],sides:8,up:H,capA:!1,capB:!1});const S=[];for(let g=0;g<=28;g++)S.push(O(Math.PI*(.56+.88*g/28)));we(V,S,{r:1,seed:e(),maxSlope:.97,high:.55});for(const g of[0,Math.PI/2,Math.PI,-Math.PI/2]){const U=O(g),G=O(g+.01).sub(U).normalize();de(w,U,G,1.05,{band:.36,turns:3,seg:8,rng:e})}}await x(3);const $=n.mesh(w,n.iron);await x(31);const ae=n.mesh(V,n.snow);await x(32),F.add($,ae);const se=n.snowMaterial(),le=[],j=1.6,Z=P-1.55,oe=3.2,a=27,v=33.5,M=75.5,z=u-1.25,A=16,E=(Z-j)/(A+1);for(const h of[-1,1]){const r=new ye,S=new ye;for(const m of[j,Z])W(r,ie(o(m,.9,0),o(m,u+1.5,0)),{r:1.25}),W(r,ie(o(m,u+1.5,0),o(m,u+e.range(8.5,10.5),0),6),{r:k=>1.1*(1-k)**.85,taper:!0,rot:e.range(.6,1),capA:!1}),de(r,o(m,u+2.3,0),i,1.3,{band:.38,rng:e});await x(10);for(const m of[22,58,84])de(r,o(j,m+e.range(-1,1),0),i,1.85,{band:.6,seg:8,rng:e});for(const[m,k]of[[oe,1.25],[a,.9],[v,.9],[M,.9],[z,1.25]])W(r,ie(o(j,m,0),o(Z,m,0)),{r:k}),S.shed=m===z?1:0,we(S,m===z?[o(j-1.25,m,0),o(Z+1.25,m,0)]:[o(j+1.25,m,0),o(Z-1.25,m,0)],{r:k,seed:e(),pinch:m===z});S.shed=0,await x(9);const g=e.pick([m=>m%2===1,m=>m%3===1,m=>(m>>1)%2===0]);for(let m=0;m<A;m++){const k=j+(m+1)*E,q=e.range(-.12,.12);W(r,ie(o(k,oe,0),o(k+q*.3,a,0)),{r:.5,capA:!1,capB:!1}),g(m)?W(r,ie(o(k+q*.3,v,0),o(k,M,0),34),{r:.5,sides:8,star:.6,twist:e.sign()*Math.PI*2*e.range(7.5,9.5),capA:!1,capB:!1}):W(r,ie(o(k+q*.3,v,0),o(k,M,0)),{r:.5,rot:Math.PI/4+e.range(-.08,.08),capA:!1,capB:!1}),W(r,ie(o(k,z,0),o(k+q,u+e.range(4.6,5.6),0),5),{r:K=>.55*(1-K)**.8,taper:!0,rot:e.range(.5,1.1),capA:!1});for(const K of[oe+1.9,a-1.5,v+1.5,M-1.5,u+.75])de(r,o(k,K,0),i,.62,{band:.2,seg:5,rng:e});await x(4)}for(let m=0;m<=A;m++){const k=j+(m+.5)*E,q=13+5*Math.sin(m/A*Math.PI)+e.range(-.6,.6);W(r,ie(o(k,oe,0),o(k,q,0),4),{r:K=>.34*(K<.6?1:(1-(K-.6)/.4)**.8),light:!0,taper:!0,capA:!1})}const U=8,G=(Z-j-2.5)/U;await x(51);for(let m=0;m<U;m++){m%4===3&&await x(52);const k=o(j+1.25+(m+.5)*G,(a+v)/2,0),q=1.98*e.range(.96,1.03),K=e()*6.28,ue=e.range(.95,1.05),fe=[];for(let ce=0;ce<=20;ce++){const ve=K+ce/20*Math.PI*2;fe.push(o(k.x+Math.cos(ve)*q*ue,k.y+Math.sin(ve)*q/ue,0))}W(r,fe,{r:.36,sides:6,capA:!1,capB:!1});const Se=[];for(let ce=0;ce<=8;ce++){const ve=Math.PI*(.14+.72*ce/8);Se.push(o(k.x+Math.cos(ve)*q*ue,k.y+Math.sin(ve)*q/ue,0))}we(S,Se,{r:.36,seed:e(),maxSlope:.95}),m&&de(r,o(k.x-G/2,k.y,0),i,.75,{band:.2,seg:6,rng:e})}await x(5);const Y=4,ne=(Z-j-2.5)/Y;for(let m=0;m<Y;m++){m%3===2&&await x(53);const k=o(j+1.25+(m+.5)*ne,(M+z)/2-.2,e.range(-.1,.1)),q=m&1?-1:1,K=y.MathUtils.degToRad(40+e.range(-4,4));for(const ue of[1,-1]){const fe=o(Math.cos(K)*ue,Math.sin(K)*ue*q,0),Se=o(-fe.y,fe.x,0).multiplyScalar(q),ce=ze(e.range(4.7,5.2),.42,N+e.range(-.025,.025),1.5,-.12,1),ve=Te(k,fe,Se,ce,36);W(r,ve.pts,{r:ve.r,sides:6,taper:!0,capA:!1}),we(S,ve.pts,{r:ve.r,seed:e(),maxSlope:.75})}de(r,k,o(Math.cos(K),Math.sin(K)*q,0),.6,{band:.22,seg:6,rng:e})}const ee=new y.Group;ee.position.set(h*P,0,0),await x(61),ee.add(n.mesh(r,n.iron)),await x(62),ee.add(n.mesh(S,se)),F.add(ee),le.push({g:ee,sg:h,tris:r.triangles+S.triangles}),await x(6)}const J=[],me=[],he=98.5,ke=12.2,Ce=14,Ye=(h,r,S,g=0)=>{const U=new X().crossVectors(r,S).normalize(),G=S.clone().applyAxisAngle(r,g),Y=U.applyAxisAngle(r,g);return new y.Matrix4().makeBasis(r,G,Y).setPosition(h)},Re=(h,r,S,g,U,G,Y)=>{J.push({m:Ye(h,r,S,e.range(-.09,.09)),S:g,order:U,dur:G,seed:e()}),Y&&me.push({p:h.clone().addScaledVector(r,g.L-g.Lw+Y*.3),order:U+G*.2,dur:G*.9,seed:e(),h:e.range(15,24)})},Xe=T==="S"?.07:-.08;for(const h of[-1,1]){const r=o(-h,0,0);for(let S=0;S<6;S++){S%2===1&&await x(71);const g=S===0?-100:(S-1)*1.7,U=45.6-S*6,G=e.range(-.1,.1);{const k=e.range(4.2,4.9),q=S%2===1;Re(o(h*U,he,G),r,i,ze(q?1.5:2.5+(k-4.2)*.6,.5,N+e.range(-.02,.02),q?6.1:5.7,0,-1),g,3,0)}const Y=Ee(9,33,Math.pow(S/5,1.15))+e.range(-.8,.8),ne=h*(U-3+e.range(-.2,.2)),ee=e.range(4.4,5.2),m=ze(ee,.6,N+e.range(-.02,.02),Y-ee*.5,T==="lyre"?.012:0,1);Re(o(ne,he+.8,G),i,o(h,0,0),m,g+.6,3,0),(S===2||S===4)&&me.push({p:o(ne,he+1+Y,G),order:4.4+S*.3+e.range(0,.4),dur:8,seed:e(),h:e.range(30,36)*(t.plume??1)});for(let k=0,q=3.2;q<Y-5.6;k++,q+=5.7){const K=h*(k%2?-1:1);if(S===5&&K===-h)continue;const ue=y.MathUtils.degToRad(e.range(50,60)),fe=o(K*Math.sin(ue),Math.cos(ue),0),Se=o(-fe.y,fe.x,0),ce=ze(e.range(4.9,5.4),.52,N+e.range(-.03,.03),e.range(.8,1.2),Xe*e.range(.7,1.3),K);Re(o(ne+K*.5,he+.8+5.3+(q-3.2)*.82+e.range(-.3,.3),G),fe,Se,ce,g+1.2+k*.55+e.range(0,.15),2.6,0)}}}for(const h of[-1,1])for(let r=0;r<6;r++){const S=45.6-r*6,g=Ee(9,33,Math.pow(r/5,1.15)),U=(r===0?0:(r-1)*1.7)+.9,G=Y=>Y-Math.floor(Y);me.push({p:o(h*(S-3),he+.6,-1.6),order:U,dur:18.8-U,seed:G(r*.371+(h>0?.13:.57)),h:(g+8)/.78+4*G(r*.61+.2)}),me.push({p:o(h*(S-6.2),he+.4,-2.4),order:U+.5,dur:18.8-U-.5,seed:G(r*.713+(h>0?.41:.87)),h:(g+3)/.9+5*G(r*.37+.6)})}for(const h of[-1,1])for(const r of[1,-1]){const S={L:30,Lw:r>0?16.5:18,b:N+.01,s0:.9774999999999999/(N/Math.sqrt(1+N*N)),k:.09259259259259259,hand:1,R:.85},g=_.clone().multiplyScalar(r),U=o(-h,0,0);J.push({m:new y.Matrix4().makeBasis(g,U,new X().crossVectors(g,U)).setPosition(p.clone().addScaledVector(f,h*10.8).addScaledVector(g,.6)),S,order:Ce+(r>0?0:.35)+e.range(0,.2),dur:3,seed:e()})}await x(7);const Ae=n.scrollMaterial({heat:t.heat??3.5,halo:t.halo??3.4,ember:t.ember??0,cool:t.cool??10,haloMin:t.haloMin??4,haloMax:t.haloMax??.03});Ae.uniforms.uUnder={value:1};const Ie=n.scrollMesh(J,Ae),Ke=n.haloMesh(Ie,n.haloMaterial(Ae));await x(72);const Ge=n.steamMaterial(Ae,t.plumeFat??1.4);Ge.uniforms.uBack.value=16;const Ze=n.steamMesh(me,Ge);F.add(Ie,Ze,Ke);const Fe=[],Be=Math.round(96*s),Le=t.lead??1.6,Ve=[];for(let h=Math.round(800*s)*8;h>0;h--)Ve.push(e());let Je=0;const Q=()=>Ve[Je++%Ve.length];Q.range=(h,r)=>h+(r-h)*Q();for(const h of[-1,1])for(let r=0;r<Be;r++){const S=Q()<.1,g=1.6+(r+Q())/Be*(P-5),U=S?Q.range(3.3,4.1):2.5+.32*Math.pow(Q(),1.6),G=o(h*P,u+.6,0),Y=(ee,m,k,q)=>Fe.push({p:G,t:U+m,size:k,seed:Q(),rho:-h*pe(g+ee,1.2,P-2.6),sp:q});Y(0,0,Q.range(1.45,2.05),Q.range(1.24,1.34));const ne=Fe[Fe.length-1].sp;Y(Q.range(-.9,.9),Q.range(.1,.45),Q.range(.9,1.3),ne*Q.range(.92,.98));for(let ee=0;ee<2;ee++)Y(Q.range(-.8,.8),Q.range(.2,.9),Q.range(.5,.8),ne*Q.range(.86,.96))}const je=n.clumpMaterial({openA:L,openT:8,fall:t.fall??16,floor:0,stretch:.7,streak:0,lead:Le,burst:1,minPx:1,follow:1,front:2.4,puffSel:1}),Qe=n.clumpMesh(Fe,je);F.add(Qe),await x(8);const D={forge:0,open:-1,ring:0,driven:!1},Me=()=>{Ae.uniforms.uRun.value=D.ring>0?Ce-.5+D.ring*4.6:D.forge*ke;const h=pe(D.open,0,1),r=L*h*h*(3-2*h);for(const S of le)S.g.rotation.y=S.sg<0?r:Math.PI-r;je.uniforms.uClock.value=D.open*8+Le>0?D.open*8+Le:-1,se.uniforms.uShed.value=_e(-Le/8+.02,.5,D.open)},et={setForge(h){D.forge=pe(h,0,1),D.driven=!0,Me()},setOpen(h){D.open=Math.max(-1,h),D.driven=!0,Me()},setRing(h){D.ring=pe(h,0,1),D.driven=!0,Me()},setProgress(h){D.forge=pe(h,0,1),D.open=Math.max(-1,h-1),D.ring=pe(h-2,0,1),D.driven=!0,Me()}};Me();const qe=h=>p.clone().addScaledVector(H,-h),tt={ringCentre:p.clone(),portalSeat:{position:p.clone(),normal:H.clone().negate(),radius:7,tilt:d},pathDir:H.clone(),flyThrough:[150,110,70,40,15,0,-20].map(qe),approach:[o(0,2.5,300),o(0,2.5,190)],hoopLine:[o(0,1.5,140),o(0,1.5,-140)],pierFeet:[o(-R,0,4.5),o(R,0,4.5)],crownRoots:[o(-45.6,he,0),o(45.6,he,0)],hinges:[o(-P,0,0),o(P,0,0)],viewpoints:{reveal:o(0,2.5,300),axis:o(0,2.5,150),climb:qe(60),beyond:o(0,40,-90)}};let at=w.triangles+V.triangles+le[0].tris+le[1].tris+J.length*(Ie.geometry.index.count/3)+me.length*10+J.length*2+Fe.length*2;return{object:F,radius:62,height:124,center:o(0,62,0),anchors:tt,ground:!0,groundY:0,style:n,kind:T,triangles:Math.round(at),...et,update(h,r,S){if(n.update(h,r,S),!D.driven||D.demo){const g=r%44;D.demo=!0,D.forge=pe(g/15,0,1),D.open=g<40?Math.max(-1,(g-16)/8):-1,D.ring=g<40?pe((g-27)/5,0,1):0,Me()}},dispose(){}}}export{ye as Batch,te as COMMON_GLSL,ot as PALETTE,W as bar,St as buildHero,we as cap,de as collar,yt as makeStyle,$e as scrollAt,Te as scrollPts,ze as scrollSpec,We as scrollTaper};
