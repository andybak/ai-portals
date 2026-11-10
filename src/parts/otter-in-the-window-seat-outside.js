import*as v from"three";import*as p from"./otter-in-the-window-seat-plan.js";const ue=Math.PI,K=ue*2,Q=ue/180,j=p.CABIN.HULL_AXIS[0],ee=p.CABIN.HULL_AXIS[1],H=p.CABIN.HULL_R,N=p.D,Ae=(e,o,t)=>Math.min(t,Math.max(o,e)),q=(e,o,t)=>{const n=Ae((t-e)/(o-e),0,1);return n*n*(3-2*n)},Le=(e,o)=>Math.sign(e)*Math.pow(Math.abs(e),o),pe=e=>new v.Vector3(e.r,e.g,e.b),R={SKIN:0,FRAME:1,PANE:2,TUNNEL:3,WING:4,POD:5,INLET:6,DOME:7,AERIAL:8,TAIL:9,EDGE:10};function Ne(){const e=[],o=[],t=[],n=(l,f,s,h)=>(e.push(l,f,s),o.push(h),e.length/3-1),a=(l,f,s,h)=>{h?t.push(l,s,f):t.push(l,f,s)};return{add:n,tri:a,grid:(l,f,s=!1,h=!1)=>{const x=l.length,i=l[0].length,r=e.length/3,w=s?i:i-1;for(const m of l)for(const b of m)n(b[0],b[1],b[2],f);for(let m=0;m<x-1;m++)for(let b=0;b<w;b++){const S=r+m*i+b,I=r+m*i+(b+1)%i,L=S+i,E=I+i;a(S,I,L,h),a(I,E,L,h)}return r},fan:(l,f,s,h=!1)=>{const x=n(l[0],l[1],l[2],s),i=e.length/3;for(const r of f)n(r[0],r[1],r[2],s);for(let r=0;r<f.length;r++)a(x,i+r,i+(r+1)%f.length,h)},done:l=>{const f=e.length/3,s=new Float32Array(f*3),h=e;for(let i=0;i<t.length;i+=3){const r=t[i]*3,w=t[i+1]*3,m=t[i+2]*3,b=h[w]-h[r],S=h[w+1]-h[r+1],I=h[w+2]-h[r+2],L=h[m]-h[r],E=h[m+1]-h[r+1],O=h[m+2]-h[r+2],T=S*O-I*E,M=I*L-b*O,y=b*E-S*L;for(const D of[r,w,m])s[D]+=T,s[D+1]+=M,s[D+2]+=y}for(let i=0;i<f;i++){const r=Math.hypot(s[i*3],s[i*3+1],s[i*3+2])||1;s[i*3]/=r,s[i*3+1]/=r,s[i*3+2]/=r}const x=new v.BufferGeometry;return x.setAttribute("position",new v.Float32BufferAttribute(e,3)),x.setAttribute("normal",new v.BufferAttribute(s,3)),x.setAttribute("aKind",new v.Float32BufferAttribute(o,1)),x.setIndex(f>65535?new v.Uint32BufferAttribute(t,1):new v.Uint16BufferAttribute(t,1)),x.userData.triangles=t.length/3,x.name=l,x},count:()=>e.length/3,triangles:()=>t.length/3}}const A={NA:64,SHOULDER:1.5,NOSE:98,TAIL:170,FAIR:2.6,FAIR_A:[98,114],FAIR_Z:[-100,-70,135,165],WIN_K:[-14,16],BAND:[13,16],NW:32};function ce(e){const o=p.CABIN.HULL_Z[0],t=p.CABIN.HULL_Z[1];if(e<o+A.NOSE){const n=Ae((e-o)/A.NOSE,0,1),a=Math.max(.02,Math.pow(1-Math.pow(1-n,2),.62));return[H*a,ee-H*(1-a)*.3]}if(e>t-A.TAIL){const n=Ae((e-(t-A.TAIL))/A.TAIL,0,1),a=1-.88*Math.pow(n,1.35);return[H*a,ee+H*(1-a)*.78]}return[H,ee]}const Me=(e,o)=>{const t=e>ue?K-e:e,n=A.FAIR_Z;return A.FAIR*q(A.FAIR_A[0]*Q,A.FAIR_A[1]*Q,t)*q(n[0],n[1],o)*(1-q(n[2],n[3],o))},De=e=>{const o=(e>ue?K-e:e)/Q;return A.SHOULDER*q(36,46,o)*(1-q(60,69,o))};function Se(e,o){const[t,n]=ce(o),a=t+Me(e,o)+De(e)*(t/H);return[j-a*Math.sin(e),n+a*Math.cos(e),o]}const he=e=>j-Math.sqrt(Math.max(0,H*H-(e-ee)*(e-ee)));function He(e,o,t){if(t<p.CABIN.HULL_Z[0]||t>p.CABIN.HULL_Z[1])return 1e3;const[n,a]=ce(t),u=e-j,c=o-a,d=Math.max(Math.hypot(u,c),1e-4),l=Math.acos(Ae(c/d,-1,1));return d-(n+Me(l,t)+De(l)*(n/H))}const g=e=>{const o=String(Math.round(e*1e4)/1e4);return/[.e]/.test(o)?o:o+"."},Fe=`
float hullOut(vec3 p){                                   // metres outside the hull's skin (under 0: inside): hullOutside() above
  float f = 1., cy = ${g(ee)};
  if (p.z < ${g(p.CABIN.HULL_Z[0]+A.NOSE)}){ float q = 1. - clamp((p.z - ${g(p.CABIN.HULL_Z[0])})/${g(A.NOSE)}, 0., 1.);
    f = max(.02, pow(max(1. - q*q, 1e-6), .62)); cy = ${g(ee)} - ${g(H)}*(1. - f)*.3; }
  else if (p.z > ${g(p.CABIN.HULL_Z[1]-A.TAIL)}){ float t = clamp((p.z - ${g(p.CABIN.HULL_Z[1]-A.TAIL)})/${g(A.TAIL)}, 0., 1.);
    f = 1. - .88*pow(max(t, 1e-6), 1.35); cy = ${g(ee)} + ${g(H)}*(1. - f)*.78; }
  vec2 d = vec2(p.x - ${g(j)}, p.y - cy); float l = max(length(d), 1e-4), a = degrees(acos(clamp(d.y/l, -1., 1.)));
  float r = ${g(H)}*f + ${g(A.SHOULDER)}*f*smoothstep(${g(36)}, ${g(46)}, a)*(1. - smoothstep(${g(60)}, ${g(69)}, a))
    + ${g(A.FAIR)}*smoothstep(${g(A.FAIR_A[0])}, ${g(A.FAIR_A[1])}, a)*smoothstep(${g(A.FAIR_Z[0])}, ${g(A.FAIR_Z[1])}, p.z)*(1. - smoothstep(${g(A.FAIR_Z[2])}, ${g(A.FAIR_Z[3])}, p.z));
  return (p.z < ${g(p.CABIN.HULL_Z[0])} || p.z > ${g(p.CABIN.HULL_Z[1])}) ? 1e3 : l - r;
}`,Re=(e,o)=>{const t=.7407407407407407;return[N.WIN_W/2*o*Le(Math.cos(e),t),N.WIN_H/2*o*Le(Math.sin(e),t)]},re=e=>e*N.PITCH+N.WIN_Z,Ze=e=>e>=p.CABIN.BAY[0]&&e<=p.CABIN.ROW1;function $e(e,o,t,n){const a=f=>{const s=f.length;let h=0;for(let r=1;r<s;r++)(f[r].v<f[h].v-1e-9||Math.abs(f[r].v-f[h].v)<=1e-9&&f[r].u<f[h].u)&&(h=r);const x=[],i=[];for(let r=0;r<=s;r++)x.push(f[(h+r)%s]);for(let r=0;r<s;r++){let w=Math.atan2(x[r+1].v-x[r].v,x[r+1].u-x[r].u);w<-1e-7&&(w+=K),i.push(Math.max(w,0))}return{n:s,pts:x,dir:i}},u=a(o),c=a(t);let d=0,l=0;for(;d<u.n||l<c.n;){const f=d<u.n?u.dir[d]:1/0,s=l<c.n?c.dir[l]:1/0;f<=s?(e.tri(u.pts[d].i,c.pts[l].i,u.pts[d+1].i,n),d++):(e.tri(u.pts[d].i,c.pts[l].i,c.pts[l+1].i,n),l++)}}function Pe(e,o,t,n){const a=A.NW,u=re(o),c=N.CABIN_W,d=t===1,l=i=>t?c-i:i,f=i=>p.wallX(i)-N.WIN_DEPTH,s=i=>Math.min(he(i),n?f(i):1e9)-.32,h=(i,r)=>{const w=[];for(let m=0;m<a;m++){const b=Re(m/a*K,i),S=N.WIN_Y+b[1];w.push([l(r(S)),S,u+b[0]])}return w},x=i=>r=>he(r)+(s(r)-he(r))*i;e.grid([h(1.3,i=>he(i)+(n?0:.06)),h(1.25,x(.7)),h(1.17,s),h(1.03,s)],R.FRAME,!0,d),n?e.grid([h(1.03,s),h(.995,i=>s(i)+.1),h(.985,f)],R.TUNNEL,!0,d):(e.grid([h(1.03,s),h(.99,i=>s(i)+.16)],R.FRAME,!0,d),e.fan([l(s(N.WIN_Y)+.22),N.WIN_Y,u],h(.99,i=>s(i)+.16),R.PANE,d))}function Ge(){const e=p.CABIN.HULL_Z[0],o=p.CABIN.HULL_Z[1],t=[];for(const u of[0,.015,.05,.11,.2,.32,.46,.62,.8,1])t.push(e+A.NOSE*u);t.push(-190,-145,-100,-92.5,-85,-77.5,-70);const n=p.CABIN.BAY[0],a=p.CABIN.ROW1;for(let u=n;u<=a+1;u++)t.push(u*N.PITCH+3.6-N.PITCH);t.push(135,142.5,150,157.5,165,205);for(const u of[0,.1,.22,.36,.5,.64,.78,.9,1])t.push(o-A.TAIL+A.TAIL*u);return t}function*Ee(){const e=Ne(),o=A.NA,t=Ge(),n=t.length,a=0;for(let r=0;r<n;r++)for(let w=0;w<o;w++){const m=Se(w/o*K,t[r]);e.add(m[0],m[1],m[2],R.SKIN)}const u=(r,w)=>a+r*o+(w+o)%o,c=p.CABIN.BAY[0]*N.PITCH+3.6-N.PITCH,d=p.CABIN.ROW1*N.PITCH+3.6,l=A.BAND[0],f=A.BAND[1],s=r=>r>=l&&r<f||r>=o-f&&r<o-l,h=[];for(let r=0;r<n-1;r++){const w=t[r]>c-.01&&t[r+1]<d+.01;w&&h.push([r,Math.round((t[r]+N.PITCH-3.6)/N.PITCH)]);for(let m=0;m<o;m++){if(w&&s(m))continue;const b=u(r,m),S=u(r,m+1),I=u(r+1,m),L=u(r+1,m+1);e.tri(b,S,I),e.tri(S,L,I)}}{const r=Se(0,t[0]),[,w]=ce(t[0]),m=e.add(j,w,t[0]-.4,R.SKIN);for(let I=0;I<o;I++)e.tri(m,u(0,I+1),u(0,I));const[,b]=ce(t[n-1]),S=e.add(j,b,t[n-1]+1.5,R.SKIN);for(let I=0;I<o;I++)e.tri(S,u(n-1,I),u(n-1,I+1))}yield;const x=A.NW,i=N.CABIN_W;for(const[r,w]of h){const m=re(w);for(const b of[0,1]){const S=b?o-f:l,I=b?o-l:f,L=[],E=[],O=(T,M)=>{const y=Se(M/o*K,t[T]);L.push({i:u(T,M),a:Math.atan2(y[1]-N.WIN_Y,y[2]-m),u:y[2]-m,v:y[1]-N.WIN_Y})};for(let T=S;T<=I;T++)O(r,T),O(r+1,T);L.sort((T,M)=>T.a-M.a);for(let T=0;T<x;T++){const M=Re(T/x*K,1.3),y=N.WIN_Y+M[1],D=he(y);E.push({i:e.add(b?i-D:D,y,m+M[0],R.SKIN),a:Math.atan2(M[1],M[0]),u:M[0],v:M[1]})}E.sort((T,M)=>T.a-M.a),$e(e,E,L,b===1),Pe(e,w,b,!0)}(w&3)===0&&(yield)}yield;for(let r=A.WIN_K[0];r<=A.WIN_K[1];r++)Ze(r)||Pe(e,r,0,!1);return yield,e.done("otter-hull")}const fe=8,Ve=`
attribute float aKind;
varying vec3 vP, vN; varying float vKind, vDist;
void main(){
  vec4 w = modelMatrix*vec4(position, 1.);
  vP = w.xyz; vN = mat3(modelMatrix)*normal; vKind = aKind;
  vec4 mv = viewMatrix*w; vDist = length(mv.xyz);
  gl_Position = projectionMatrix*mv;
}`,qe=`
precision highp float;
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uFogCol, uAxis; uniform vec4 uCapA[${fe}], uCapB[${fe}], uDomeC, uDomeR, uLight, uWinK, uPod, uWarm; uniform float uTime, uFogDen;
varying vec3 vP, vN; varying float vKind, vDist;
float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float noise2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(hash2(i), hash2(i + vec2(1., 0.)), f.x), mix(hash2(i + vec2(0., 1.)), hash2(i + vec2(1., 1.)), f.x), f.y); }
// the shade of the wisps that stream aft over the roof and down the flank: long soft streaks sliding along the skin
// at the wisps' own speed, by the world's clock (0 in the open sun, 1 under a wisp's middle)
float wispShade(vec3 Pw){
  float arc = atan(-(Pw.x - uAxis.x), Pw.y - uAxis.y + 1e-5)*uAxis.z;
  vec2 q = vec2((Pw.z - uTime*21.)/45., arc/14.);
  return smoothstep(.48, .7, noise2(q)*.7 + noise2(q*2.7 + 3.7)*.3);
}
// a ruled line: x metres from it, w its half width, px metres a pixel; under a pixel it fades by its share of one
float ruled(float x, float w, float px){ return (1. - smoothstep(w, w + px, abs(x)))*clamp(2.*w/max(px, 1e-4), 0., 1.); }
// the soft drawn shadows: capsules (an otter's trunk, head and tail, an aerial's blade) and the dome, toward the sun
float bodyShade(vec3 Pw, vec3 L){
  float sh = 1.;
  for (int i = 0; i < ${fe}; i++){
    vec3 A = uCapA[i].xyz, d = uCapB[i].xyz - A, w0 = Pw - A;
    float a = max(dot(d, d), 1e-4), b = dot(d, L), c = dot(w0, d), e = dot(w0, L);
    float s = clamp((c - b*e)/max(a - b*b, 1e-4), 0., 1.), t = max(b*s - e, 0.);
    s = clamp((c + b*t)/a, 0., 1.);
    float dist = length(w0 + L*t - d*s), r = uCapA[i].w, pen = .22 + .03*t;
    sh *= mix(1., smoothstep(r - pen, r + pen, dist), uCapB[i].w);
  }
  vec3 q = (Pw - uDomeC.xyz)/uDomeR.xyz, l = L/uDomeR.xyz;
  float t = max(-dot(q, l)/max(dot(l, l), 1e-6), 0.), dd = length(q + l*t);
  sh *= mix(1., smoothstep(.93, 1.07 + .006*t, dd), uDomeC.w);
  return sh;
}
// the oval of a cabin window about its middle: 1 on the outline
float oval(vec2 p){ vec2 q = abs(p)/vec2(${(N.WIN_W/2).toFixed(3)}, ${(N.WIN_H/2).toFixed(3)}); return pow(pow(q.x, 2.7) + pow(q.y, 2.7) + 1e-6, 1./2.7); }
// a rounded rectangle's outline: metres from it (under 0 inside)
float rrect(vec2 p, vec2 h, float r){ vec2 q = abs(p) - h + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
`,xe=[re(-5),re(-2),re(10)],Ke=A.FAIR_A[0]*Q*H,je=`
float dress(vec3 Pw, float px, float arc, float dz, float door, inout vec3 alb, inout vec2 g, inout float gloss){
  float shine = 0., far1 = 1. - smoothstep(.5, 2.2, px), open = smoothstep(-.1, .1, door);
  // the belt seams
  float sa = arc - 48., sb = arc - 60.8, s = abs(sa) < abs(sb) ? sa : sb;
  float nearR = 1. - smoothstep(.12, .3, px), rd = length(vec2((fract(Pw.z/.6) - .5)*.6, abs(s) - .45));
  float riv = (1. - smoothstep(.08, .08 + px, rd))*nearR + ruled(abs(s) - .45, .05, px)*.35*(1. - nearR);
  alb *= 1. - (.3*ruled(s - .07, .05, px) + .22*riv)*open; shine += .8*ruled(s + .11, .09, px)*open;
  g.y -= s*exp(-s*s*40.)*3.*far1*open;
  alb *= mix(vec3(1.), vec3(.975, .968, .955), smoothstep(48., 48.2, arc)*(1. - smoothstep(60.6, 60.8, arc))*open);
  // the fairing
  float zin = smoothstep(${g(A.FAIR_Z[0])}, ${g(A.FAIR_Z[1])}, Pw.z)*(1. - smoothstep(${g(A.FAIR_Z[2])}, ${g(A.FAIR_Z[3])}, Pw.z));
  float fa = arc - ${g(Ke)}, on = smoothstep(.45, .55, zin), fw = smoothstep(0., .25, fa)*on;
  alb *= mix(vec3(1.), vec3(.925, .932, .955), fw); gloss *= mix(1., .5, fw);
  float fz = abs(Pw.z - ${g((A.FAIR_Z[0]+A.FAIR_Z[1])/2)}) < abs(Pw.z - ${g((A.FAIR_Z[2]+A.FAIR_Z[3])/2)}) ? Pw.z - ${g((A.FAIR_Z[0]+A.FAIR_Z[1])/2)} : Pw.z - ${g((A.FAIR_Z[2]+A.FAIR_Z[3])/2)};
  float fl = max(ruled(fa, .07, px)*on, ruled(fz, .07, px)*step(0., fa));
  float fd = length(vec2((fract(Pw.z/1.3) - .5)*1.3, fa - .55));
  alb *= 1. - (.5*fl + .3*((1. - smoothstep(.11, .11 + px, fd))*nearR + ruled(fa - .55, .06, px)*.3*(1. - nearR))*on)*open;
  shine += .5*ruled(fa + .13, .07, px)*on*open;
  // a door: gap, lit edge, doubler, grip, sill, gutter
  float grip = rrect(vec2(dz - 6.1, arc - 55.), vec2(.9, .42), .3);
  alb *= 1. - .55*clamp(ruled(door, .085, px) + ruled(grip, .05, px), 0., 1.) - .16*ruled(door - 1.1, .045, px);
  alb *= 1. - .25*(1. - smoothstep(-.06, .06, grip));
  shine += .55*ruled(door + .22, .07, px);
  float sill = 1. - smoothstep(-.05, .05 + px*.5, rrect(vec2(dz, arc - 73.95), vec2(9.7, .5), .2));
  alb = mix(alb, vec3(.6, .61, .65), sill); gloss = mix(gloss, 2.2, sill); shine += .9*ruled(arc - 73.42, .07, px)*step(abs(dz), 9.6);
  float gut = rrect(vec2(dz, arc - 36.9), vec2(9.7, 4.3), 3.4), cap = 1. - smoothstep(34.2, 35., arc);
  alb *= 1. - .35*ruled(gut - .1, .05, px)*cap; shine += .7*ruled(gut + .04, .07, px)*cap;
  return shine;
}`,Ye=`
void relief(vec3 Pw, float px, out vec3 alb, out vec2 g, out float gloss, out float glass, out float shine){
  float ang = atan(-(Pw.x - uAxis.x), Pw.y - uAxis.y + 1e-5), arc = abs(ang)*uAxis.z;   // metres round from the crown, either flank
  float zf = (Pw.z + ${(-N.WIN_Z-N.PITCH/4).toFixed(2)})/${(N.PITCH/2).toFixed(2)}, sf = arc/3.2;            // frames 7.8 m apart (a window sits between two), stringers 3.2 m
  vec2 cell = floor(vec2(zf, sf)), uv = fract(vec2(zf, sf));
  float far1 = 1. - smoothstep(.5, 2.2, px);
  alb = vec3(.88, .885, .89); gloss = 1.; glass = 0.;
  // pillowing: each panel bay a shallow cushion, and tilted a hair of its own
  g = (vec2(.5) - uv)*vec2(.05, .034)*(4.*uv.yx*(1. - uv.yx)) + (vec2(hash2(cell), hash2(cell + 7.3)) - .5)*.018;
  g *= far1;
  // joints: along the hull every fourth stringer (one over the windows, one under them), and round it every fourth
  // frame, staggered band by band
  float band = floor((sf + 1.)/4.), stag = .5*mod(band, 2.);
  float jz = (fract(zf/4. + stag) - .5)*31.2, js = (fract((sf - 1.)/4.) - .5)*12.8;
  // a door is one slab: no joint of the panels crosses it (dz: metres along the hull from the nearest door's middle)
  float dz = Pw.z - ${g(xe[0])}; if (abs(Pw.z - ${g(xe[1])}) < abs(dz)) dz = Pw.z - ${g(xe[1])}; if (abs(Pw.z - ${g(xe[2])}) < abs(dz)) dz = Pw.z - ${g(xe[2])};
  float door = rrect(vec2(dz, arc - 53.4), vec2(8.5, 19.6), 2.6), open = smoothstep(-.1, .1, door);
  float jl = max(ruled(jz, .055, px), ruled(js, .055, px))*open;
  alb *= 1. - .5*jl; g += vec2(jz, js)*exp(-vec2(jz*jz, js*js)*30.)*2.2*far1*open;
  alb *= 1. + .022*(hash2(vec2(floor(zf/4. + stag), band)) - .5);
  // rivets: a row along every frame and every stringer, a dimple each 0.8 m
  float rv = 1. - smoothstep(.05, .22, px);
  if (rv > 0.){
    vec2 m = (uv - .5)*vec2(7.8, 3.2);                          // metres from the bay's middle
    vec2 e = vec2(3.9, 1.6) - abs(m);                           // metres to the frame line, to the stringer line
    vec2 rz = vec2(-sign(m.x)*e.x, (fract(m.y/.8) - .5)*.8), rs = vec2((fract(m.x/.8) - .5)*.8, -sign(m.y)*e.y);
    vec2 rr = dot(rz, rz) < dot(rs, rs) ? rz : rs; float d = length(rr);
    float dot_ = (1. - smoothstep(.07, .07 + px, d))*rv;
    alb *= 1. - .2*dot_; g += rr*dot_*3.;
  }
  // the flank's dress: doors with sill and gutter, the two belt seams, the wing root's fairing
  shine = dress(Pw, px, arc, dz, door, alb, g, gloss);
  // the far flank's windows of the straight run, where the cabin has none: a frame and a dark pane, as paint
  float kz = floor((Pw.z + ${(-N.WIN_Z+N.PITCH/2).toFixed(2)})/${N.PITCH.toFixed(2)});
  if (Pw.x > uAxis.x && kz >= uWinK.x && kz <= uWinK.y && (kz < uWinK.z || kz > uWinK.w)){
    vec2 wq = vec2(Pw.z - (kz*${N.PITCH.toFixed(2)} + ${N.WIN_Z.toFixed(2)}), Pw.y - ${N.WIN_Y.toFixed(1)});
    float o = oval(wq), e = px/2.3 + .004, fr = 1. - smoothstep(1.3 - e, 1.3 + e, o);
    alb = mix(alb, vec3(.76, .77, .79), fr); g *= 1. - fr;
    g += wq/(length(wq) + 1e-3)*((1. - smoothstep(1.2, 1.3, o)) - (1. - smoothstep(1., 1.08, o)))*.35*fr*vec2(1., -1.);
    glass = 1. - smoothstep(1. - e, 1. + e, o);
  }
}`,Xe=qe+je+Ye+`
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-6, 0.)), V = normalize(cameraPosition - vP + vec3(0., 1e-6, 0.)), L = uSunDir;
  if (!gl_FrontFacing) N = -N;
  float px = length(fwidth(vP))*.7 + 1e-4, kind = vKind;
  vec3 alb = vec3(.86); vec2 g = vec2(0.); float gloss = 1., glass = 0., metal = 0., shine = 0.;
  // the window this place belongs to (its number along the hull), the place in that window's own plane, its oval
  float kw = floor((vP.z + ${(-N.WIN_Z+N.PITCH/2).toFixed(2)})/${N.PITCH.toFixed(2)});
  vec2 wq = vec2(vP.z - (kw*${N.PITCH.toFixed(2)} + ${N.WIN_Z.toFixed(2)}), vP.y - ${N.WIN_Y.toFixed(1)}); float ov = oval(wq);
  if (kind < .5){
    relief(vP, px, alb, g, gloss, glass, shine);
    vec3 Tz = vec3(0., 0., 1.), Ts = cross(N, Tz); N = normalize(N + Tz*g.x + Ts*g.y + vec3(0., 1e-6, 0.));
  } else if (kind < 1.5){ alb = vec3(.75, .76, .78); gloss = 1.4; }                                  // a window's frame
  else if (kind < 2.5){ glass = 1.; }                                                                // a painted pane
  else if (kind < 3.5){ alb = vec3(.74, .68, .58); gloss = .15; }                                    // the passage through the skin
  else if (kind < 4.5){                                                                              // wing: ribs and spar lines
    float span = vP.x < uAxis.x ? -vP.x : vP.x - 2.*uAxis.x, zc = vP.z - max(span, 0.)*.4663;
    float ln = max(ruled((fract(span/19.2) - .5)*19.2, .07, px), ruled((fract(zc/30.) - .5)*30., .07, px));
    alb = vec3(.83, .84, .86)*(1. - .34*ln)*(1. + .04*(hash2(floor(vec2(span/19.2, zc/30.))) - .5)); gloss = 1.1;
  } else if (kind < 5.5){ alb = vec3(.86, .865, .87)*(1. - .45*ruled((fract(vP.z/11.) - .5)*11., .06, px)); } // pod
  else if (kind < 6.5){                                                                              // the fan in the pod's mouth, turning
    float cx = abs(vP.x - uPod.x) < abs(vP.x - uPod.w) ? uPod.x : uPod.w; vec2 q = vec2(vP.x - cx, vP.y - uPod.y);
    float rad = length(q), a = atan(q.y, q.x + 1e-5), bl = .5 + .5*sin(a*20. + rad*.3 + uTime*1.1);
    alb = mix(vec3(.015, .016, .02), vec3(.1, .105, .12), smoothstep(.3, .7, bl))*smoothstep(0., 3., rad); gloss = .4;
    alb = mix(vec3(.42, .43, .45), alb, smoothstep(4.6, 5.2, rad));
  } else if (kind < 7.5){ alb = vec3(.8, .79, .77); gloss = .3; }                                    // the dome: a matt blister
  else if (kind < 8.5){ alb = vec3(.8, .81, .83); gloss = .8; }                                      // an aerial's blade
  else if (kind < 9.5){ alb = vec3(.86, .865, .87)*(1. - .4*ruled((fract(vP.y/9.) - .5)*9., .06, px)); } // fin and tailplane
  else { alb = vec3(.6, .61, .64); metal = 1.; }                                                     // bare metal: a leading edge, a pod's lip
  float nl = dot(N, L), nv = clamp(dot(N, V), 0., 1.), sh = bodyShade(vP, L);
  float ws = wispShade(vP), sunD = clamp((nl + .06)/1.06, 0., 1.)*sh*(1. - .6*ws);
  vec2 lh = L.xz/max(length(L.xz), 1e-3), nh = N.xz;
  vec3 amb = mix(uGndCol*uLight.z, mix(uSkyCol, uFogCol, .3)*uLight.y, clamp(N.y*.5 + .5, 0., 1.));   // the sky's own light, warmed by its bright horizon
  amb += uFogCol*uLight.w*(1. - N.y*N.y)*(.3 + .7*clamp(dot(nh, lh), 0., 1.));
  amb *= .6 + .4*sh;
  // what the gloss mirrors: the sky from horizon to overhead, the cloud below, and the sun as three lobes
  vec3 R = reflect(-V, N); float up = R.y;
  vec3 skyR = mix(uFogCol*1.05, uSkyCol*.9, pow(clamp(up, 0., 1.), .55));
  skyR = mix(uGndCol*.7, skyR, smoothstep(-.14, .06, up));
  float sl = clamp(dot(R, L), 0., 1.), rh = clamp(dot(R.xz/max(length(R.xz), 1e-3), lh), 0., 1.);
  skyR += uSunCol*(rh*rh*rh*(1. - abs(up))*(1. - abs(up))*.55);                       // the horizon burns gold on the sun's side
  vec3 sunR = uSunCol*(pow(sl, 6.)*.9 + (pow(sl, 60.)*2.4 + pow(sl, 900.)*20.)*sh);
  // the lacquer's haze: a wide gold lobe as of a flatter roof, seen at a grazing angle toward the sun (the crown burns)
  vec3 Nb = normalize(N + vec3(0., 1.2*clamp(N.y, 0., 1.), 0.) + vec3(0., 1e-6, 0.)); float gb = 1. - clamp(dot(Nb, V), 0., 1.);
  vec3 hazeR = uSunCol*vec3(1., .8, .58)*(pow(clamp(dot(reflect(-V, Nb), L), 0., 1.), 4.)*gb*1.25*(.45 + .55*sh));     // a broad gold lobe; a tight one and the sun's glint, which a body's shadow cuts
  float fr = pow(1. - nv, 4.), F = mix(.05, 1., fr)*gloss;
  vec3 col = alb*(uSunCol*uLight.x*sunD + amb) + (skyR*.5 + sunR)*F + hazeR*min(gloss, 1.);
  col += (uSunCol*uLight.x*sunD*1.5 + amb*.6)*shine;             // a raised edge of the dress throws the low sun back
  // THE WINDOWS' WARM LIT REVEALS: the cabin's light on the inner rim of each of the cabin's own windows (the
  // passage through the skin glows, the frame's inner half takes its colour, a faint halo lies on the skin round
  // it); dimmer where the blinds are down (the dusk rows). By place: the same at every metre.
  if (kind < 3.5 && kw >= uWinK.z && kw <= uWinK.w && abs(wq.y) < 9.){
    float rim = kind > 2.5 ? 1. : kind > .5 ? 1. - smoothstep(1., 1.24, ov) : .22*(1. - smoothstep(1.28, 1.75, ov));
    rim *= mix(1., .55, step(uWarm.w, kw));
    col = mix(col, uWarm.rgb*(.85 + .4*smoothstep(-3.3, 3.3, -wq.y)), rim*.85);
  }
  if (metal > .5) col = alb*(skyR*1.1 + sunR*1.4 + uSunCol*uLight.x*sunD*.25);
  if (glass > 0.){
    // a dark pane: the sky mirrored, and a warm glint low in it as of a lit cabin behind
    // a painted pane (the windows beyond the cabin's own): a lit cabin behind glass, each window its own strength,
    // a pale blind drawn down some way in some (a fixed hash of the window's number and flank), the sky mirrored on it
    float h1 = hash2(vec2(kw, step(uAxis.x, vP.x)*7. + 3.)), h2 = hash2(vec2(kw + 31., step(uAxis.x, vP.x)*5. + 1.));
    float blind = smoothstep(-.12, .12, wq.y - (3.4 - 5.2*h2*step(.45, h2)));
    vec3 lit = uWarm.rgb*(.5 + .7*h1)*(.55 + .45*smoothstep(-3.3, 3.3, wq.y));
    lit = mix(lit, uWarm.rgb*vec3(1.05, 1.2, 1.45)*(.5 + .3*h1), blind);
    vec3 pane = lit + (skyR + sunR)*mix(.1, 1., fr);
    col = mix(col, pane, glass);
  }
  col *= mix(vec3(1.), vec3(.72, .77, .9), ws);                 // under a wisp the skin stands in the sky's cooler light
  // the air between: the far ends of the hull and the wings stand in the haze of the horizon
  float hz = max(1. - exp(-vDist*uFogDen*5.), 1. - exp(-uFogDen*uFogDen*vDist*vDist));
  col = mix(col, uFogCol, hz);
  gl_FragColor = vec4(col, 1.);
}`,Je=[[0,.7,-10.2,0,.9,-3.5,.75],[0,1.9,-3.5,0,2,8.6,2],[0,2,8.6,0,1.9,12.2,1.75]];function Qe(e={}){const o=[],t=p.OUTSIDE,n=(a,u,c,d)=>o.push({a:p.ownToCabin(a,u,1),b:p.ownToCabin(a,c,1),r:d});for(const a of(e.crownShade||Je).slice(0,3))n(e.crown||t.CROWN,[a[0],a[1],a[2]],[a[3],a[4],a[5]],a[6]);for(const[a,u]of t.AERIALS)o.push({a:[a,p.skinY(a)-.2,u-.5],b:[a,p.skinY(a)+t.AERIAL_H-.4,u+.7],r:.5});for(const a of t.WING_OTTER.SHADE.slice(0,3))n(t.WING_OTTER,[a[0],a[1],a[2]],[a[3],a[4],a[5]],a[6]);return o}const J={OUT:p.OUTSIDE.WING.POD_OUT,Y:-30,Z:[-58,14],R:21};function et(e,o){const t=new v.Color(e.windowGlow||"#ffa55a"),n=Qe(e),a=[],u=[],c=p.OUTSIDE.DOME.centre,d=p.OUTSIDE.DOME.size,l=e.look==="AFTERGLOW";for(let s=0;s<fe;s++){const h=n[s];a.push(h?new v.Vector4(h.a[0],h.a[1],h.a[2],h.r):new v.Vector4(0,-1e4,0,1)),u.push(h?new v.Vector4(h.b[0],h.b[1],h.b[2],1):new v.Vector4(0,-1e4,1,0))}const f={uSunDir:{value:e.sunDir},uSunCol:{value:pe(e.sunColor)},uSkyCol:{value:pe(e.skyColor)},uGndCol:{value:pe(e.groundColor)},uFogCol:{value:pe(e.fogColor)},uFogDen:{value:e.fogDensity},uTime:{value:0},uAxis:{value:new v.Vector3(j,ee,H)},uPod:{value:new v.Vector4(-J.OUT,J.Y,J.Z[0],N.CABIN_W+J.OUT)},uCapA:{value:a},uCapB:{value:u},uDomeC:{value:new v.Vector4(c[0],c[1]-.4,c[2],1)},uDomeR:{value:new v.Vector4(d[0]/2,d[1]+.4,d[2]/2,0)},uWarm:{value:new v.Vector4(t.r,t.g,t.b,p.CABIN.DUSK_ROW)},uLight:{value:new v.Vector4(l?1.05:1.2,.5,.36,.2)},uWinK:{value:new v.Vector4(A.WIN_K[0],A.WIN_K[1],p.CABIN.BAY[0],p.CABIN.ROW1)}};return new v.ShaderMaterial({uniforms:f,vertexShader:Ve,fragmentShader:Xe,side:o})}const be=(e,o,t,n)=>{const a=et(o,t),u=new v.Mesh(e,a);u.frustumCulled=!1,u.name=n;const c=a.uniforms.uCapA.value,d=a.uniforms.uCapB.value;return{object:u,material:a,triangles:e.userData.triangles,update(l,f){a.uniforms.uTime.value=f},setShade(l,f,s,h){c[fe-3+l].set(f.x,f.y,f.z,h),d[fe-3+l].set(s.x,s.y,s.z,1)}}};function mt(){const e=Ee();let o=e.next();for(;!o.done;)o=e.next();return o.value}async function pt(e){const o=Ee();let t=o.next();for(;!t.done;)await e.pause(),t=o.next();return be(t.value,e,v.FrontSide,"otter-hull")}const oe={TH:.11,FLAT:.62,NOSE:.16,IN:14};function tt(e){const o=oe.TH*e,t=oe.NOSE*o,n=[],a=[],u=[];for(const c of[1,.9,.78,oe.FLAT,.3,0])n.push([c*e,c>oe.FLAT?-.55*o*Math.pow((c-oe.FLAT)/(1-oe.FLAT),1.6):0]);for(let c=0;c<=6;c++){const d=c/6*ue;a.push([-1.4*t*Math.sin(d),-t*(1-Math.cos(d))])}for(const c of[0,.08,.2,.35,.55,.78,1]){const d=c<=.35?-(2*t+(o-2*t)*Math.sin(ue/2*(c/.35))):-o+(o-.55*o-.25)*Math.pow((c-.35)/.65,1.3);u.push([c*e,d])}return{up:n,nose:a,low:u,th:o}}function ze(e){const o=p.OUTSIDE.WING,t=Math.max(e,0),n=o.ROOT_Z[1]-o.ROOT_Z[0];return{z:o.ROOT_Z[0]+t*Math.tan(o.SWEEP*Q),y:o.ROOT_Y+t*Math.tan(o.RISE*Q),chord:n+(o.TIP_CHORD-n)*(t/o.SPAN)}}function*Oe(){const e=Ne(),o=N.CABIN_W,t=p.OUTSIDE.WING;for(const u of[0,1]){const c=m=>u?o-m:m,d=u?[-oe.IN,0,60,115,200,280,t.SPAN]:[-oe.IN,0,20,40,60,90,115,140,180,230,290,t.SPAN],l=[],f=[],s=[];for(const m of d){const b=ze(m),S=tt(b.chord),I=L=>[c(-m),b.y+L[1],b.z+L[0]];l.push(S.up.map(I)),f.push(S.nose.map(I)),s.push(S.low.map(I))}e.grid(l,R.WING),e.grid(f,R.EDGE),e.grid(s,R.WING);{const m=d.length-1,b=[...l[m],...f[m].slice(1,-1),...s[m]],S=ze(t.SPAN);e.fan([c(-t.SPAN-.6),S.y-1.5,S.z+S.chord*.45],b,R.WING)}yield;const h=c(-J.OUT),x=(m,b)=>{const S=[];for(let I=0;I<24;I++){const L=I/24*K;S.push([h+b*Math.cos(L),J.Y+b*Math.sin(L),m])}return S},i=J.Z[0],r=J.Z[1],w=J.R;e.grid([x(i+5,w-4.2),x(i+1.2,w-3.6),x(i,w-2.4),x(i+1.4,w-1.2),x(i+5,w-.5)],R.EDGE,!0),e.grid([x(i+5,w-.5),x(i+18,w),x(i+38,w),x(i+56,w-2.5),x(r,w-6.5),x(r-3,w-9)],R.POD,!0),e.grid([x(r-3,w-9),x(r+6,w-12),x(r+20,.3)],R.EDGE,!0),e.fan([h,J.Y,i+2.5],x(i+5,w-4.2),R.INLET);{const m=ze(J.OUT),b=m.y-2.5,S=m.z-26,I=m.z+30,L=1.6,E=[];for(const[O,T,M]of[[J.Y+w-2,S+6,I],[b,S+22,I+8]])E.push([[h-L,O,T],[h,O,T-3],[h+L,O,T],[h+L,O,M],[h,O,M+2],[h-L,O,M]]);e.grid(E,R.POD,!0)}yield}const n=p.CABIN.HULL_Z[1],a=u=>{const[c,d]=ce(u);return d+c};Ce(e,{p:[j,a(n-100)-4,n-100],chord:92,t:3.6,n:[1,0,0]},{p:[j,a(n-100)+112,n-100+94],chord:36,t:1.5,n:[1,0,0]},R.TAIL);for(const u of[-1,1]){const[c,d]=ce(n-62);Ce(e,{p:[j+u*(c-6),d+2,n-84],chord:62,t:2.6,n:[0,1,0]},{p:[j+u*(c+128),d+16,n-84+76],chord:24,t:1.1,n:[0,1,0]},R.TAIL)}return yield,e.done("otter-wings")}function xt(){const e=Oe();let o=e.next();for(;!o.done;)o=e.next();return o.value}async function wt(e){const o=Oe();let t=o.next();for(;!t.done;)await e.pause(),t=o.next();return be(t.value,e,v.DoubleSide,"otter-wings")}function Ce(e,o,t,n){const a=c=>[0,.06,.3,.7,1,.7,.3,.06].map((d,l)=>{const f=(l===0||l===4?0:l===1||l===7?.6:1)*c.t*(l>4?-1:1);return[c.p[0]+c.n[0]*f,c.p[1]+c.n[1]*f,c.p[2]+d*c.chord+c.n[2]*f]}),u=a(t);e.grid([a(o),u],n,!0),e.fan([t.p[0],t.p[1],t.p[2]+t.chord*.5],u,n)}function ot(){const e=Ne(),o=p.OUTSIDE.DOME,t=o.centre[0],n=o.centre[2],a=o.size[0]/2-.35,u=o.size[2]/2-.75,c=o.size[1]+.4,d=[],l=28,f=(s,h)=>{const x=[];for(let i=0;i<l;i++){const r=i/l*K,w=t+a*h*Math.cos(s)*Math.cos(r);x.push([w,p.skinY(w)-.4+c*Math.sin(s),n+u*h*Math.cos(s)*Math.sin(r)])}return x};d.push(f(0,1.05).map(s=>[s[0],s[1]+.3,s[2]]),f(.05,1.02));for(const s of[.16,.34,.55,.78,1.02,1.26,1.45])d.push(f(s,1));return e.grid(d,R.DOME,!0),e.fan([t,p.skinY(t)-.4+c,n],f(1.45,1),R.DOME),e.done("otter-dome")}function gt(e){return be(ot(),e,v.DoubleSide,"otter-dome")}function nt(){const e=Ne(),o=p.OUTSIDE;for(const[t,n]of o.AERIALS){const a=p.skinY(t);Ce(e,{p:[t,a-.3,n-1.15],chord:2.3,t:.36,n:[1,0,0]},{p:[t,a+o.AERIAL_H-.05,n-.1],chord:1.25,t:.14,n:[1,0,0]},R.AERIAL);const u=(c,d)=>{const l=[];for(let f=0;f<12;f++){const s=f/12*K,h=t+c*.62*Math.cos(s);l.push([h,p.skinY(h)+d,n+c*1.9*Math.sin(s)])}return l};e.grid([u(1,.02),u(.9,.14)],R.FRAME,!0),e.fan([t,a+.14,n],u(.9,.14),R.FRAME)}return e.done("otter-aerials")}function At(e){return be(nt(),e,v.DoubleSide,"otter-aerials")}const ye=40,st=2.2,Te=e=>.1+.03*e,P={NEAR:[6,16],FIT:[2.1,2.9],SKIN:[.25,1.5],TAPER:.24,TIP:.1,CUT:.06,SWEEP:.7,MIN:.3,EDGE:.88,OPACITY:.95,ZONE:{X:[-46,-32],UNITS:1.5,SOFT:6,OVER:1.2,RISE:.4}},Nt=e=>P.MIN+(1-P.MIN)*q(P.CUT,P.SWEEP,e),_e=()=>{const e=N.WIN_Y+1.3*N.WIN_H/2+P.ZONE.OVER;return[e,P.ZONE.RISE,he(e)]};function bt(e,o,t,n,a=p.ARCS.FAN*Q/2){const u=P.ZONE,[c,d,l]=_e(),f=re(p.WINDOW.UNIT),s=q(u.X[0],u.X[1],e)*(1-q(l,l+4,e))*(1-q(u.UNITS*N.PITCH,u.UNITS*N.PITCH+u.SOFT,Math.abs(t-f)));return Math.max(c+d*Math.max(l-e,0)-(o+Math.cos(a)*n),0)*s}const at=e=>`
attribute vec3 aArc;                                     // x: along the fan -1..1, y: -1 | 1 across, z: which arc
uniform vec4 uA[${e}], uB[${e}], uG[${e}], uU[${e}];     // (place, radius) (unit direction, strength) (half fan, half width, step, 1 for an indoor sign) (up, 0)
uniform float uPix; uniform vec4 uZone; uniform vec3 uLine; uniform vec2 uFit, uThin, uNear, uSkin;   // (x where the zone begins, x where it is whole, the entered window's z, its half length) (the line at the skin, its rise a metre out, the skin's x)
varying vec3 vArc, vP; varying vec2 vIn;                 // (1 for an indoor sign, the arc's step in its set)
${Fe}
void main(){
  int id = int(aArc.z + .5);
  vec4 A = uA[id], B = uB[id], G = uG[id];
  vec3 t = B.xyz, up = uU[id].xyz, C = A.xyz;
  // the zone before the entered window (outdoor arcs): the whole arc is lifted, by its middle's place, over the line
  float zone = smoothstep(uZone.x, uZone.y, C.x)*(1. - smoothstep(uLine.z, uLine.z + 4., C.x))*(1. - smoothstep(uZone.w, uZone.w + ${g(P.ZONE.SOFT)}, abs(C.z - uZone.z)));
  C.y += max(uLine.x + uLine.y*max(uLine.z - C.x, 0.) - (C.y + cos(G.x)*A.w), 0.)*zone*(1. - G.w);
  vec3 m = up - t*dot(up, t); float ml = length(m); m = ml > 1e-3 ? m/ml : vec3(1., 0., 0.);
  vec3 s = cross(m, t);
  // HOW MUCH OF THE WHOLE ARC STANDS (0..1): its pulse's strength and, out of doors, its fit in the picture (the lens
  // to its middle, in its own radii). Its sweep opens from MIN of its fan by that share; nothing of it is ever made pale.
  float dc = length((viewMatrix*vec4(C, 1.)).xyz);
  float whole = pow(clamp(B.w, 1e-5, 1.), .6)*mix(smoothstep(uFit.x*A.w, uFit.y*A.w, dc), 1., G.w);
  float phi = aArc.x*G.x*mix(${g(P.MIN)}, 1., smoothstep(${g(P.CUT)}, ${g(P.SWEEP)}, whole));
  vec3 radial = m*cos(phi) + s*sin(phi), tang = s*cos(phi) - m*sin(phi), wc = C + radial*A.w;
  vec4 mv = viewMatrix*vec4(wc, 1.);
  vec3 tv = (viewMatrix*vec4(tang, 0.)).xyz;
  float dist = max(length(mv.xyz), 1e-3);
  vec3 side = cross(tv, mv.xyz/dist); float sl = length(side); side = sl > 1e-3 ? side/sl : vec3(0., 1., 0.);
  // how much of the ribbon stands AT THIS PLACE: the whole arc's share, the lens's nearness (an indoor sign: the
  // plan's THIN) and, out of doors, the skin's law. It is the share of the ribbon's full WIDTH here.
  float here = whole*mix(smoothstep(uNear.x, uNear.y, dist)*smoothstep(uSkin.x, uSkin.y, hullOut(wc)), smoothstep(uThin.x, uThin.y, dist), G.w);
  // the ribbon narrows over the last quarter of each half of its fan and runs to a point over the last tenth; it is
  // never under the floor of pixels while its share is over CUT, and nought at or under it
  float e = 1. - abs(aArc.x);
  float hw = here > ${g(P.CUT)} ? max(G.y*mix(.1, 1., smoothstep(0., ${g(P.TAPER)}, e))*here, uPix*dist*${st.toFixed(1)}) : 0.;
  hw *= aArc.y*${g(P.EDGE)}*min(e*${g(1/P.TIP)}, 1.);
  mv.xyz += side*hw;
  vP = wc + (side*mat3(viewMatrix))*hw;                  // the fragment's own place (the view's turn taken off the offset)
  vArc = aArc; vIn = vec2(G.w, G.z);
  gl_Position = B.w > .002 ? projectionMatrix*mv : vec4(2., 2., 2., 1.);
}`,rt=`
precision highp float;
uniform float uTime; uniform vec3 uCore, uEdge, uTip; uniform vec2 uSkin;
varying vec3 vArc, vP; varying vec2 vIn;
${Fe}
void main(){
  float a = abs(vArc.y)*${g(P.EDGE)}, core = 1. - smoothstep(.36, .56, a);  // across the ribbon, in shares of its laid half width
  float e = 1. - abs(vArc.x), point = smoothstep(0., ${g(P.TAPER)}, e);      // 0 at an end, 1 over the fan's middle
  float run = .66 + .34*sin(uTime*1.5 - vIn.y*1.25);     // the brightening that runs up the three
  vec3 col = mix(uTip, mix(uEdge, uCore*run, core), point);                       // toward its point: the core's own blue alone
  // NOT DRAWN INSIDE THE HULL (out of doors): a cut by the fragment's own place, not a fade
  float keep = mix(step(uSkin.x, hullOut(vP)), 1., step(.5, vIn.x));
  if (keep < .5) discard;
  // THE ONE OPACITY: no strength, no nearness, no edge and no tip multiplies it; the ribbon's shape is its triangles
  gl_FragColor = vec4(col, ${g(P.OPACITY)});
}`;function yt(e,o={}){const t=o.standing||[],n=o.frames??6,a=t.length*3,u=a+n,c=[],d=[],l=[],f=[],s=v.Vector4,h=y=>{const D=Math.hypot(y[0],y[1],y[2])||1;return[y[0]/D,y[1]/D,y[2]/D]};for(const y of t)for(let D=0;D<3;D++){const U=h(y.normal),te=h(y.up||[0,1,0]),X=y.radii[D];c.push(new s(y.centre[0],y.centre[1],y.centre[2],X)),d.push(new s(U[0],U[1],U[2],1));const ve=y.indoor??He(y.centre[0],y.centre[1],y.centre[2])<0;l.push(new s((y.fan??100)*Q/2,Te(X),D,ve?1:0)),f.push(new s(te[0],te[1],te[2],0))}for(let y=0;y<n;y++)c.push(new s(0,-1e4,0,1)),d.push(new s(1,0,0,0)),l.push(new s(p.ARCS.FAN*Q/2,Te(1),y%3,0)),f.push(new s(0,1,0,0));const x=new Float32Array(u*(ye+1)*2*3),i=[];let r=0;for(let y=0;y<u;y++)for(let D=0;D<=ye;D++){for(const U of[-1,1])x[r*3]=D/ye*2-1,x[r*3+1]=U,x[r*3+2]=y,r++;if(D<ye){const U=r-2;i.push(U,U+1,U+2,U+1,U+3,U+2)}}const w=new v.BufferGeometry;w.setAttribute("position",new v.BufferAttribute(new Float32Array(r*3),3)),w.setAttribute("aArc",new v.BufferAttribute(x,3)),w.setIndex(i);const m=new v.Color(p.ARCS.COLOUR),b=(p.ARCS.EMISSIVE[0]+p.ARCS.EMISSIVE[1])/2,S=P.ZONE,I=_e(),L=o.near||P.NEAR,E=o.indoors?[-2e4,-1e4]:P.SKIN,O=o.fit===!1?[-2,-1]:o.fit||P.FIT,T=new v.ShaderMaterial({uniforms:{uA:{value:c},uB:{value:d},uG:{value:l},uU:{value:f},uTime:{value:0},uPix:e.L.uniforms.uPix,uCore:{value:new v.Vector3(m.r,m.g,m.b).multiplyScalar(b)},uEdge:{value:new v.Vector3(.012,.07,.42)},uTip:{value:new v.Vector3(m.r,m.g,m.b).multiplyScalar(1.15)},uThin:{value:new v.Vector2(p.ARCS.THIN[0],p.ARCS.THIN[1])},uNear:{value:new v.Vector2(L[0],L[1])},uSkin:{value:new v.Vector2(E[0],E[1])},uZone:{value:new v.Vector4(o.zone===!1?1e5:S.X[0],o.zone===!1?2e5:S.X[1],re(p.WINDOW.UNIT),S.UNITS*N.PITCH)},uLine:{value:new v.Vector3(I[0],I[1],I[2])},uFit:{value:new v.Vector2(O[0],O[1])}},vertexShader:at(u),fragmentShader:rt,transparent:!0,depthWrite:!1,side:v.DoubleSide}),M=new v.Mesh(w,T);return M.frustumCulled=!1,M.name="otter-arcs",M.renderOrder=6,{object:M,material:T,triangles:i.length/3,setFrame(y,D,U,te,X,ve,ne,ie,C){const z=a+y;y<0||z>=u||(c[z].set(D,U,te,ie),d[z].set(X,ve,ne,C),l[z].y=Te(ie))},update(y,D){T.uniforms.uTime.value=D}}}const We=2,it={FROM:.6,EDGE:[.8,.95],MELT:.05,LOBES:2.3,RINGS:[4,5],APART:.62,IN:5,OUT:2.6},we={DEPTH:7.7,RIM:2.4,LUMP:1.6,RINGS:5},W=(e,o)=>{const t=Math.sin(e*127.1+o*311.7)*43758.5453;return t-Math.floor(t)};function ge(e,o){const t=Math.floor(e),n=Math.floor(o),a=e-t,u=o-n,c=a*a*(3-2*a),d=u*u*(3-2*u);return(W(t,n)*(1-c)+W(t+1,n)*c)*(1-d)+(W(t,n+1)*(1-c)+W(t+1,n+1)*c)*d}function de(e,o,t){const n=Math.hypot(o-e.centre[0],t-e.centre[2])/e.radius;let a=0;for(const l of e.hollows||[])a=Math.max(a,1-q(l[2]*.9,l[2]*1.6,Math.hypot(o-l[0],t-l[1])));const u=.55*ge(o/9.3,t/9.3)+.3*ge(o/4.1+7.7,t/4.1+3.1)+.15*ge(o/1.9,t/1.9),c=Math.max(.4,e.top-.2-(e.centre[1]+We));return[(1-a)*(.22+(c-.22)*q(.28,.78,u)*q(0,.22,1-n))-2.4*q(.7,1,n),a,n]}const ke=`
float cloudTone(vec3 n, float back, vec3 S){            // the kit's own large-scale light on a cloud (copied, so that both agree)
  float top = clamp(n.y, 0., 1.), ndl = dot(n, S);
  ndl *= ndl > 0. ? 1. : .55;
  return .56 + .62*ndl*(1. - .6*back) + .12*n.y - .12*back*(1. - .8*top) + .07*back*top;
}`,lt=`
attribute vec2 aData;                                    // how much of a hollow, how far out to the rim (0..1)
uniform float uTime;
varying vec3 vP, vN; varying vec2 vData; varying float vDist;
void main(){
  vec3 p = position; p.y += .12*sin(uTime*.5 + p.x*.11 + p.z*.07)*(1. - aData.x);       // the mounds breathe; where a body lies the level is still
  vec4 w = modelMatrix*vec4(p, 1.); vP = w.xyz; vN = normal; vData = aData;
  vec4 mv = viewMatrix*w; vDist = length(mv.xyz);
  gl_Position = projectionMatrix*mv;
}`,ut=`
precision highp float;
uniform sampler2D uNoise; uniform vec3 uSunDir, uSunColor, uLit, uShade, uBottom, uFogCol; uniform vec2 uLight; uniform float uTime, uSilver, uFogDen;
varying vec3 vP, vN; varying vec2 vData; varying float vDist;
${ke}
void main(){
  vec2 q = vP.xz*.021 + uTime*vec2(.0016, .0011);
  float t0 = texture2D(uNoise, q).r, tx = texture2D(uNoise, q + vec2(.012, 0.)).r, tz = texture2D(uNoise, q + vec2(0., .012)).r;
  float fine = texture2D(uNoise, q*3.1 + 4.7).g, lump = mix(t0, fine, .3);
  vec3 N = normalize(vN + vec3(t0 - tx, 0., t0 - tz)*3.4*(1. - .6*vData.x) + vec3(0., 1e-5, 0.));
  vec3 V = normalize(vP - cameraPosition + vec3(0., 1e-6, 0.)); float mup = max(dot(V, uSunDir), 0.), back = mup*mup;
  float tone = max(cloudTone(N, back, uSunDir) - (.5 - lump)*.42 - .1*vData.x, uLight.x);   // troughs and hollows in their own shade
  vec3 col = mix(mix(uBottom, uShade, smoothstep(.2, .65, lump)), uLit, smoothstep(.08, .98, tone));
  col += uSunColor*uSilver*pow(mup, 10.)*.1*(.4 + .9*lump);
  float a = smoothstep(0., .26, (1. - vData.y) - (1. - lump)*.36*smoothstep(.35, 1., vData.y));  // the rim frays and melts away
  col = mix(col, uFogCol, 1. - exp(-uFogDen*uFogDen*vDist*vDist));
  gl_FragColor = vec4(col, a*.97);
}`;function Be(e,o){const t=o.uniforms;return{uSunDir:t.uSunDir,uSunColor:t.uSunColor,uLit:t.uLit,uShade:t.uShade,uBottom:t.uBottom,uLight:t.uLight,uSilver:t.uSilver,uNoise:{value:e.noise},uFogCol:{value:pe(e.fogColor)},uFogDen:{value:e.fogDensity}}}const ct=`
attribute vec4 iPos, iNrm;                               // (middle, radius) (the mound's own large normal, seed)
attribute vec2 iMix;                                     // (its share of the way out across the rim's band, spare)
uniform float uTime; uniform vec3 uSunDir; uniform vec2 uLight;
varying vec2 vUv, vOut, vMix; varying vec4 vLit, vMisc; varying vec3 vNrm; varying float vDist;
${ke}
void main(){
  vec3 c = iPos.xyz; float seed = iNrm.w, size = iPos.w*(1. + .045*sin(uTime*.23 + seed*37.));
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec2 uv = position.xy*1.5; vUv = uv;
  vec4 mv = viewMatrix*vec4(c + (right*uv.x + up*uv.y)*size, 1.);
  gl_Position = projectionMatrix*mv; vDist = length(mv.xyz);
  float dist = distance(c, cameraPosition);
  vec3 V = (c - cameraPosition)/max(dist, 1e-3);
  float mu = dot(V, uSunDir), mup = max(mu, 0.), back = mup*mup;
  float sil = smoothstep(.4, .95, length(iNrm.xyz - V*dot(iNrm.xyz, V)));
  float mu6 = back*back*back, mu36 = mu6*mu6*mu6; mu36 *= mu36;
  float ang = size*projectionMatrix[1][1]/max(dist, 1.);
  vLit = vec4(size, (mu6*.24 + mu36*mu6*1.3)*(.12 + .88*sil), .215/pow(1.16 - .8*mu, 1.5)*(.1 + .9*sil), mix(1., .66, smoothstep(.08, .45, ang)));
  vMisc = vec4(seed, max(cloudTone(iNrm.xyz, back, uSunDir), uLight.x), smoothstep(size*.35, size*1.5, dist), 1. - .7*back);
  vNrm = iNrm.xyz; vOut = vec2(dot(iNrm.xyz, right), dot(iNrm.xyz, up)); vOut /= length(vOut) + .15; vMix = iMix;
}`,ht=`
precision highp float;
uniform sampler2D uNoise; uniform vec3 uSunDir, uSunColor, uLit, uShade, uBottom, uFogCol; uniform vec2 uLight; uniform float uTime, uSilver, uFogDen;
varying vec2 vUv, vOut, vMix; varying vec4 vLit, vMisc; varying vec3 vNrm; varying float vDist;
void main(){
  float r2 = dot(vUv, vUv), r = sqrt(r2), seed = vMisc.x, rim = vMix.x;
  vec4 t = texture2D(uNoise, vUv*.231 + seed*vec2(3.71, 9.17) + uTime*vec2(.0014, .0009));
  float lump = mix(t.r, t.g, .46), ero = lump*.95*(.25 + .75*r)*1.1, e = (1. - r) - ero;
  // A PUFF IS A SOFT LUMP OF THE CLOUD, NOT A DISC (D3): its edge runs out over half of its own radius and more
  // (nine tenths at the outline), so that no outline of a disc is left standing
  float a = smoothstep(0., mix(.5, .9, rim)*vLit.w, e)*(1. - smoothstep(.63, .75, max(abs(vUv.x), abs(vUv.y))))*vMisc.z;
  vec2 gn = vec2(dFdx(ero), dFdy(ero))/max(vec2(abs(dFdx(vUv.x)), abs(dFdy(vUv.y))), vec2(1e-5));
  gn = clamp(gn, -4., 4.);
  vec3 Nv = normalize(vec3(vUv*.5 + gn*.24, sqrt(max(1. - r2, 0.)) + .4)), N = (vec4(Nv, 0.)*viewMatrix).xyz;
  // a flat top lies open to the sky: a little lighter than a tower's flank between the hollows; at the rim its tone is the cloud's own
  float light = max(vMisc.y + .1*(1. - rim) + dot(N, uSunDir)*.2*vMisc.w - (lump - .5)*(.16 + .2*vMisc.w), uLight.x*.55);
  vec3 col = mix(mix(uBottom, uShade, smoothstep(-.5, .7, vNrm.y + N.y*.5)), uLit, smoothstep(.08, .98, light));
  float thin = 1. - smoothstep(0., .5, e);
  // (the light through a puff's thin edge drew every small puff's outline as a bright ring: a third of it between the hollows, a tenth at the rim)
  col += uSunColor*(uSilver*mix(.34, .1, rim)*((vLit.z*.56 + vLit.y)*thin*smoothstep(-.1, .75, dot(vUv, vOut)/(r + .05)) + vLit.y*.08));
  col = mix(col, uFogCol, 1. - exp(-uFogDen*uFogDen*vDist*vDist));
  if (a < .012) discard;
  gl_FragColor = vec4(col, a*mix(.82, .6, rim));           // thinner toward the outline: its colour runs into the cloud's behind it
}`;function It(e,o={}){const t=o.centre||[0,0,0],n=o.radius??35,a={centre:t,radius:n,top:o.top??t[1]+3,hollows:o.hollows||[]},u=t[1]+We,c=n>20,d=c?16:9,l=c?56:32,f=[],s=[],h=[],x=[],i=it,r=C=>i.EDGE[0]+(i.EDGE[1]-i.EDGE[0])*ge(3.1+.37*n+i.LOBES*Math.cos(C),7.7+i.LOBES*Math.sin(C)),w=(C,z)=>Math.min(1,z/(r(C)+i.MELT));if(o.body){const C=we.RINGS,z=(F,_)=>{const B=Math.min(1,Math.hypot(F-t[0],_-t[2])/n),k=1-B*B*B;return u-we.RIM-(we.DEPTH-we.RIM-we.LUMP*ge(F/6.1+2.7,_/6.1+9.1))*k};for(let F=0;F<=C;F++)for(let _=0;_<l;_++){const B=_/l*K,k=F/C*n*.998,$=t[0]+k*Math.cos(B),Y=t[2]+k*Math.sin(B),G=.7,V=z($+G,Y)-z($-G,Y),me=z($,Y+G)-z($,Y-G),le=Math.hypot(V,2*G,me);if(f.push($,z($,Y),Y),s.push(V/le,-2*G/le,me/le),h.push(0,w(B,k/n)),F<C){const se=F*l+_,ae=F*l+(_+1)%l;x.push(se,ae,se+l,ae,ae+l,se+l)}}}const m=f.length/3;for(let C=0;C<=d;C++)for(let z=0;z<l;z++){const F=z/l*K,_=C/d*n*.998,B=t[0]+_*Math.cos(F),k=t[2]+_*Math.sin(F),[$,Y,G]=de(a,B,k),V=.7,me=de(a,B-V,k)[0]-de(a,B+V,k)[0],le=de(a,B,k-V)[0]-de(a,B,k+V)[0],se=Math.hypot(me,2*V,le);if(f.push(B,u+$,k),s.push(me/se,2*V/se,le/se),h.push(Y,w(F,G)),C<d){const ae=m+C*l+z,Ie=m+C*l+(z+1)%l;x.push(ae,ae+l,Ie,Ie,ae+l,Ie+l)}}const b=new v.BufferGeometry;b.setAttribute("position",new v.Float32BufferAttribute(f,3)),b.setAttribute("normal",new v.Float32BufferAttribute(s,3)),b.setAttribute("aData",new v.Float32BufferAttribute(h,2)),b.setIndex(x);const S=Be(e,o.field),I={value:0},L=new v.ShaderMaterial({uniforms:{...S,uTime:I},vertexShader:lt,fragmentShader:ut,transparent:!0,depthWrite:!1,side:v.DoubleSide}),E=new v.Mesh(b,L);E.frustumCulled=!1,E.name="otter-billow-floor",E.renderOrder=3;const O=[],T=[],M=[],y=c?1:.62,D=(C,z,F,_,B)=>{const k=t[0]+F*Math.cos(z),$=t[2]+F*Math.sin(z);for(const V of a.hollows)if(Math.hypot(k-V[0],$-V[1])<V[2]*1.3+_*.5)return;const Y=Math.min(a.top-.05-.83*_,u+de(a,k,$)[0]+.5-.3*_),G=Math.hypot(F/n,.9);O.push(k,Y,$,_),T.push(Math.cos(z)*F/n/G,.9/G,Math.sin(z)*F/n/G,W(C,3.7)),M.push(B,0)},U=Math.round(n*.7),te=c?i.RINGS[1]:i.RINGS[0];for(let C=0;C<U;C++){const z=(3+2.2*W(C,8.3))*y,F=n*.76*Math.sqrt((C+.5)/U);D(100+C,C*2.39996,F,z,q(i.FROM,i.EDGE[0],F/n))}for(let C=0,z=0;C<te;C++){const F=C/(te-1),_=(i.IN+(i.OUT-i.IN)*F)*y,B=n*(i.FROM+((i.EDGE[0]+i.EDGE[1])/2-i.FROM)*F),k=Math.ceil(K*B/(i.APART*_));for(let $=0;$<k;$++,z++){const Y=($+.6*W(z,2.1)+.5*(C&1))/k*K,G=_*(.7+.6*W(z,1.3)),V=n*(i.FROM+(r(Y)-i.FROM)*F)+(W(z,5.9)-.5)*.5*_;D(400+z,Y,Math.min(V,n-.85*G),G,F)}}const X=new v.InstancedBufferGeometry;X.setAttribute("position",new v.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),X.setIndex([0,1,2,0,2,3]),X.setAttribute("iPos",new v.InstancedBufferAttribute(new Float32Array(O),4)),X.setAttribute("iNrm",new v.InstancedBufferAttribute(new Float32Array(T),4)),X.setAttribute("iMix",new v.InstancedBufferAttribute(new Float32Array(M),2)),X.instanceCount=O.length/4;const ve=new v.ShaderMaterial({uniforms:{...S,uTime:I},vertexShader:ct,fragmentShader:ht,transparent:!0,depthWrite:!1}),ne=new v.Mesh(X,ve);ne.frustumCulled=!1,ne.name="otter-billow-puffs",ne.renderOrder=4;const ie=new v.Group;return ie.name="otter-billows",ie.add(E,ne),{object:ie,floor:E,puffs:ne,triangles:x.length/3+O.length/4*2,update(C,z){I.value=z}}}const Z={N:40,Z:[-300,330],FADE:70,NEAR:[10,46],SOFT:16,FLANK:[9,31],LANE:{OUT:50,FWD:4.4,AFT:9,SOFT:8}};function St(e,o,t=Ue(),n=Z.SOFT){return q(0,n,Math.max(t[0]-e,e-t[2],t[1]-o,o-t[3]))}const Ue=()=>{const e=p.OUTSIDE,o=e.DOME,t=e.CROWN.position;return[Math.min(t[0],o.centre[0])-16,o.centre[2]-o.size[2]/2-20,p.ROUTE[0][0]+12,t[2]+28]},ft=()=>{const e=Z.LANE,o=j-H,t=p.HERO.SEAT[0]*p.D.PITCH+p.D.WIN_Z;return[o-e.OUT,t-e.FWD,o,t+e.AFT]},zt=Z.LANE.SOFT,Ct=j-(H+A.SHOULDER+Z.FLANK[1]),dt=`
attribute vec4 iA, iB;                                   // (x, y, z at time 0, metres a second aft) (length, width, seed, strength)
uniform float uTime; uniform vec3 uSpan, uSunDir;
varying vec2 vUv, vXZ; varying vec4 vW;
void main(){
  float zz = mod(iA.z - uSpan.x + uTime*iA.w, uSpan.y);
  vec3 c = vec3(iA.x, iA.y + 1.2*sin(uTime*.31 + iB.z*40.), uSpan.x + zz);
  vec3 toC = c - cameraPosition; float dist = max(length(toC), 1e-3);
  vec3 side = cross(vec3(0., 0., 1.), toC/dist); float sl = length(side); side = sl > 1e-3 ? side/sl : vec3(0., 1., 0.);
  vec3 p = c + vec3(0., 0., position.x*iB.x) + side*(position.y*iB.y);
  vec4 mv = viewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mv; vUv = position.xy*2.;
  float ends = smoothstep(0., uSpan.z, zz)*(1. - smoothstep(uSpan.y - uSpan.z, uSpan.y, zz));
  float mup = max(dot(toC/dist, uSunDir), 0.);
  vW = vec4(length(mv.xyz), ends*iB.w, iB.z, mup*mup);
  vXZ = p.xz;                                             // the fragment's own place in plan (a streak is one long card)
}`,vt=`
precision highp float;
uniform sampler2D uNoise; uniform vec3 uLit, uShade, uSunColor, uFogCol; uniform vec2 uNear; uniform float uTime, uFogDen, uSoft, uLaneSoft; uniform vec4 uClear, uLane;
varying vec2 vUv, vXZ; varying vec4 vW;
void main(){
  float n = texture2D(uNoise, vec2(vUv.x*.07 + vW.z*7.3, vUv.y*.33 + vW.z*3.1)).r, m = texture2D(uNoise, vec2(vUv.x*.31 + vW.z*1.7, vUv.y*.9 + .37)).g;
  float along = 1. - vUv.x*vUv.x; along *= along;
  float across = exp(-vUv.y*vUv.y*3.2);
  float a = along*across*smoothstep(.3, .72, n*.75 + m*.25 + .22*across)*vW.y*smoothstep(uNear.x, uNear.y, vW.x);   // filaments drawn out along the stream
  vec2 q = max(uClear.xy - vXZ, vXZ - uClear.zw);          // metres outside the roof's clear box, in plan: none inside it
  a *= smoothstep(0., uSoft, max(q.x, q.y));
  vec2 ql = max(uLane.xy - vXZ, vXZ - uLane.zw);           // and outside the hero's window's lane
  a *= smoothstep(0., uLaneSoft, max(ql.x, ql.y));
  vec3 col = uLit*(.95 + .2*n) + uSunColor*(vW.w*vW.w*.6);                  // in the sun: lighter than the roof's own shade
  col = mix(col, uFogCol, 1. - exp(-uFogDen*uFogDen*vW.x*vW.x));
  if (a < .004) discard;
  gl_FragColor = vec4(col, a);
}`;function Tt(e,o={}){const t=o.count??Z.N,n=new Float32Array(t*4),a=new Float32Array(t*4),u=Z.Z[1]-Z.Z[0];for(let s=0;s<t;s++){const h=s%3!==0,x=h?(-58+116*W(s,11.3))*Q:(62+46*W(s,11.3))*Q,i=h?5+13*W(s,4.9)*W(s,6.1):Z.FLANK[0]+(Z.FLANK[1]-Z.FLANK[0])*W(s,4.9),r=H+A.SHOULDER+i;n[s*4]=j-r*Math.sin(x),n[s*4+1]=ee+r*Math.cos(x),n[s*4+2]=Z.Z[0]+u*W(s,17.7),n[s*4+3]=15+12*W(s,23.1),a[s*4]=70+80*W(s,29.9),a[s*4+1]=(h?7:9)+7*W(s,31.3),a[s*4+2]=W(s,37.7),a[s*4+3]=.45+.35*W(s,41.1)}const c=new v.InstancedBufferGeometry;c.setAttribute("position",new v.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),c.setIndex([0,1,2,0,2,3]),c.setAttribute("iA",new v.InstancedBufferAttribute(n,4)),c.setAttribute("iB",new v.InstancedBufferAttribute(a,4)),c.instanceCount=t;const d=Be(e,o.field),l=new v.ShaderMaterial({uniforms:{uNoise:d.uNoise,uLit:d.uLit,uShade:d.uShade,uSunColor:d.uSunColor,uSunDir:d.uSunDir,uFogCol:d.uFogCol,uFogDen:d.uFogDen,uTime:{value:0},uSpan:{value:new v.Vector3(Z.Z[0],u,Z.FADE)},uNear:{value:new v.Vector2(Z.NEAR[0],Z.NEAR[1])},uClear:{value:new v.Vector4(...o.clear===!1?[1e5,1e5,1e5,1e5]:o.clear||Ue())},uSoft:{value:Z.SOFT},uLane:{value:new v.Vector4(...o.lane===!1?[1e5,1e5,1e5,1e5]:o.lane||ft())},uLaneSoft:{value:Z.LANE.SOFT}},vertexShader:dt,fragmentShader:vt,transparent:!0,depthWrite:!1,side:v.DoubleSide}),f=new v.Mesh(c,l);return f.frustumCulled=!1,f.name="otter-wisps",f.renderOrder=5,{object:f,material:l,triangles:t*2,update(s,h){l.uniforms.uTime.value=h}}}export{P as ARCLAW,Ct as WISP_FLANK_X,zt as WISP_LANE_SOFT,nt as aerialGeometry,Te as arcHalf,bt as arcLift,Nt as arcSweep,ot as domeGeometry,mt as hullGeometry,He as hullOutside,Se as hullPoint,At as makeAerials,yt as makeArcs,It as makeBillows,gt as makeDome,pt as makeHull,wt as makeWings,Tt as makeWisps,xt as wingGeometry,Ue as wispClear,ft as wispLane,St as wispShare};
