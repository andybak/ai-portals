import*as l from"three";const _=Math.PI*2,be=75,Pe=30,tt=26,ee=(e,s,g)=>Math.min(g,Math.max(s,e)),te=(e,s,g)=>{const m=ee((g-e)/(s-e),0,1);return m*m*(3-2*m)},ke=`
#ifndef SL_HERD
#define SL_HERD
uniform float uTime;
uniform vec4 uLake;
uniform vec4 uShape;
uniform vec4 uBoat;
uniform vec4 uLane;
uniform vec4 uRanks;
#ifndef SL_PHASE
#define SL_PHASE
uniform vec4 uPhase;
#endif
float lakeShape(float th){ return 1. + uShape.x*cos(2.*th + uShape.y) + uShape.z*cos(3.*th + uShape.w); }
float lakeShapeD(float th){ return -2.*uShape.x*sin(2.*th + uShape.y) - 3.*uShape.z*sin(3.*th + uShape.w); }
// distance from the lake's centre in lake radii (1 on its edge)
float lakeRho(vec2 p){ vec2 d = p - uLake.xy + vec2(1e-3, 0.); return length(d)/(uLake.z*lakeShape(atan(d.y, d.x))); }
// 1 on the lane of smooth water that leaves the lake toward the gate, 0 elsewhere
float laneAt(vec2 p, float pad){
  vec2 d = p - uLake.xy; float al = dot(d, uLane.xy), la = abs(d.x*uLane.y - d.y*uLane.x);
  return uLane.w*smoothstep(0., uLake.z*0.6, al)*(1. - smoothstep(uLane.z + pad, uLane.z + pad + 8., la));
}
// HOW ROUGH THE SEA IS at a place: 0 on the lake, 1 in the open. It grows rank by rank over the four innermost
// ranks (uRanks.x = the innermost rank's distance from the heart in lake radii, uRanks.y = the ranks' spacing). The
// lane between its two ranks of bulls is somewhat smoother than the sea beside it where it leaves the lake, and as
// rough as the open sea by the fourth rank: the way out roughens rank by rank. rho may come warped (the edge is no line).
float roughOf(float rho, float lane){ float r0 = smoothstep(-0.9, 3.6, (rho - uRanks.x)/max(uRanks.y, 1e-3)); return r0*(1. - 0.3*lane*(1. - r0)); }
float roughAt(vec2 p){ return roughOf(lakeRho(p), laneAt(p, 0.)); }
// how clear the water is to look into: 1 on the lake, less at the innermost rank, gone by the second
float calmOf(float rough){ return 1. - smoothstep(0., 0.42, rough); }
float calmAt(vec2 p){ return calmOf(roughAt(p)); }
struct Whale { vec3 pos; vec2 fwd; float pitch; float roll; float phi; float speed; float flukeUp; float arch; };
// THE ROLL THROUGH THE SURFACE, one round of it per period: the whale comes up head first and blows (it surges as it
// breaks the surface), lies awash, then rolls forward and goes under; one that sounds goes deep. x = the height of
// its axis at phase phi, y = the slope of its way there (so a body can be laid along the way it swims).
vec2 rollAt(float phi, vec4 B, float sound, float speed){
  float s = sin(phi), c = cos(phi);
  // (under for the third of its round in which sin(phi) is below -0.35; at the surface for the rest)
  float dv = clamp((-s - 0.35)/0.6, 0., 1.), k = 1.6 + 2.6*sound;
  float su = exp(-(1. - cos(phi - 0.45))*5.);
  float y = B.z + B.w*(1. - k*dv*dv*(3. - 2.*dv) + 0.4*su);
  float ddv = (dv > 0. && dv < 1.) ? -c/0.6 : 0.;
  float dy = B.w*(-k*6.*dv*(1. - dv)*ddv - 0.4*su*5.*sin(phi - 0.45))*6.2831853/max(B.y, 1.);
  return vec2(y, atan(dy, max(speed, 1.3)));
}
// A = ring radius (lake radii are folded in by the shape), start angle, angular speed, length
// B = phase 0..1, period s, height of the body axis, depth of the dive (axis at B.z + B.w lying at the surface)
// C = roll amplitude, swim strength, how far it sounds 0..1 (those throw their flukes), seed
// D = yaw offset, yaw wander, pitch offset, roll offset
// G = arc centre, arc half width (rad): a whale with an arc swims it over and over, going under at its far end
//     and coming up again at its near end (half width over 3.1: the whole round, no arc)
Whale whaleAt(vec4 A, vec4 B, vec4 C, vec4 D, vec4 G, vec4 KR, vec4 KQ, float t){
  Whale w;
  float th = A.y + A.z*t, ends = 0.;
  if (G.y < 3.1){ float x = mod(th + G.y, 2.*G.y) - G.y; th = G.x + x; ends = smoothstep(0.84, 0.96, abs(x)/G.y); }
  float sh = lakeShape(th), shd = lakeShapeD(th);
  vec2 e = vec2(cos(th), sin(th)), q = vec2(-e.y, e.x);
  float R = A.x*sh;
  vec2 tn = normalize(shd*e + sh*q)*(A.z < 0. ? -1. : 1.);
  float yo = D.x + D.y*sin(t*0.07 + C.w*6.2831853);
  float cy = cos(yo), sy = sin(yo);
  w.fwd = vec2(tn.x*cy - tn.y*sy, tn.x*sy + tn.y*cy);
  w.speed = abs(A.z)*R;
  w.phi = 6.2831853*(t/max(B.y, 1.) + B.x);
  float s = sin(w.phi), c = cos(w.phi);
  vec2 p = uLake.xy + R*e;
  // the body lies along its own way: its head is ahead of its middle in the round and its tail behind
  float lag = 0.5*min(A.w/max(w.speed, 1.3)*6.2831853/max(B.y, 1.), 1.8);
  vec2 rm = rollAt(w.phi, B, C.z, w.speed), rh = rollAt(w.phi + lag, B, C.z, w.speed), rt = rollAt(w.phi - lag, B, C.z, w.speed);
  float y = rm.x, lo = -0.3 - 0.5*C.z, live = min(1., 0.2 + w.speed*0.5);
  float pm = clamp(rm.y, lo, 0.32)*live, am = (clamp(rt.y, lo, 0.32) - clamp(rh.y, lo, 0.32))*live;
  float dv = clamp((-s - 0.35)/0.6, 0., 1.);
  float fl = C.z*smoothstep(0.02, 0.3, dv)*(1. - smoothstep(0.5, 0.95, dv))*step(c, 0.);
  // A WHALE THE WORLD KEEPS (KR.x = 1: a whale of the rounds whose place lies in the lane of deep water along the
  // route's line or in its easing; see the part's WAY block and the world's header) takes the height of its axis,
  // its pitch, the arch of its back and the lift of its flukes out of what the world has written for this frame
  // (KR.y, KR.z, KR.w, KQ.x): a function of the whale's own place and its own clock. Its place on its round, its
  // heading and its roll stay its own. At the edge of the lane's reach what the world writes is what the whale's
  // own clock gives.
  float kept = step(0.5, KR.x);
  y = mix(y, KR.y, kept); pm = mix(pm, KR.z, kept); am = mix(am, KR.w, kept); fl = mix(fl, KQ.x, kept);
  // (NOTHING HERE READS THE BOAT. The lane of deep water along the route's line is the world's, by the whale's own
  // place: the whales of the rounds through KR above, and a whale that keeps a place whose body reaches into that
  // lane was put under it once, at the build.)
  // UNDER THE LANE OF SMOOTH WATER a whale of the rounds goes deep: a length and a half of its own under the eye of a man standing
  // in a boat there, beginning its dive 2.2 of its lengths outside the
  // lane's smooth water and coming up as far beyond it; head down going under, head up coming out
  vec2 dl = p - uLake.xy; float lal = dot(dl, uLane.xy), lla = dl.x*uLane.y - dl.y*uLane.x;
  float lk = uLane.w*smoothstep(0., uLake.z*0.6, lal)*(1. - smoothstep(uLane.z + 2., uLane.z + 2. + 2.2*A.w, abs(lla)))*smoothstep(1., 1.05, R/uLake.z/sh)*step(1e-7, abs(A.z));
  float toLane = -sign(lla)*(w.fwd.x*uLane.y - w.fwd.y*uLane.x);
  // (G.z: one that keeps its place lying along the lane's edge does neither)
  float dk = max(ends, lk)*(1. - G.z); lk *= 1. - G.z;
  y = mix(y, min(y, -1.3 - 0.11*A.w - 3.5*ends), dk) - max(1.5*A.w - 3., 0.)*lk*lk*(3. - 2.*lk);
  w.pos = vec3(p.x, y, p.y);
  w.pitch = pm*(1. - dk) - 0.25*dk*(1. - dk)*4.*mix(1., 2.*toLane, step(0.001, lk)) + D.z;
  // (G.w: the set of its back as it lies: head and tail a little down, the hump the highest of it)
  w.arch = am*(1. - dk) + G.w;
  w.roll = C.x*sin(w.phi*0.31 + C.w*40.) + D.w;
  // the flukes come clear only as the body tips down into its dive
  w.flukeUp = fl*(1. - dk);
  return w;
}
// the same for a whale placed by hand: A = x, z, yaw, length; B = y, pitch, roll, tail phase;
// C = fluke lift, swim strength, speed (for its wash), arch of the back (radians between head and tail)
Whale whaleDirect(vec4 A, vec4 B, vec4 C){
  Whale w; w.pos = vec3(A.x, B.x, A.y); w.fwd = vec2(sin(A.z), cos(A.z)); w.pitch = B.y; w.roll = B.z; w.phi = B.w; w.speed = C.z; w.flukeUp = C.x; w.arch = C.w;
  return w;
}
// unit-length local point p of a whale -> world. THE SPINE BENDS: the back arches by w.arch (head and tail down, the
// middle up), a slow wave runs down it as it swims (the stock pumps, the head nods the other way), the stock lifts
// for a dive, and the flukes' tips trail the stock. Each section of the body is turned to stand square on the spine.
// flex.x = tail weight, flex.y = its slope along z
vec3 whalePlace(Whale w, float len, vec3 p, vec2 flex, float tailPh, float swim, inout vec3 n){
  float z = p.z, hz = max(z - 0.12, 0.);
  float wave = sin(tailPh + z*5.5), wavd = 5.5*cos(tailPh + z*5.5), nod = sin(tailPh - 2.75);
  float yb = swim*(flex.x*wave - 2.1*hz*hz*nod) + w.flukeUp*0.16*flex.x - 0.5*w.arch*(z*z - 0.0833);
  float slope = swim*(flex.y*wave + flex.x*wavd - 4.2*hz*nod) + w.flukeUp*0.16*flex.y - w.arch*z;
  float tip = clamp((abs(p.x) - 0.03)/0.14, 0., 1.)*step(z, -0.36);
  yb -= tip*tip*(1.3*swim*cos(tailPh + z*5.5) + 0.03*w.flukeUp);
  float ic = inversesqrt(1. + slope*slope), ys = p.y;
  p.y = yb + ys*ic; p.z = z - ys*slope*ic;
  n = normalize(vec3(n.x, n.y*ic + n.z*slope*ic, n.z*ic - n.y*slope*ic) + vec3(0., 1e-5, 0.));
  float cp = cos(w.pitch), sp = sin(w.pitch);
  vec3 fwd = vec3(w.fwd.x*cp, sp, w.fwd.y*cp), up = vec3(-w.fwd.x*sp, cp, -w.fwd.y*sp), side = cross(up, fwd);
  float cr = cos(w.roll), sr = sin(w.roll);
  vec3 s2 = side*cr + up*sr, u2 = up*cr - side*sr;
  n = s2*n.x + u2*n.y + fwd*n.z;
  return w.pos + (s2*p.x + u2*p.y + fwd*p.z)*len;
}
#endif
`,De=`
#ifndef SL_REFRACT
#define SL_REFRACT
vec4 seenThroughWater(vec3 wp, vec3 eye){
  float d = -wp.y;
  if (d <= 0.) return vec4(wp, 0.);
  float h = max(eye.y, 0.25), D = length(wp.xz - eye.xz), D2 = D*D;
  float q = 1.33*h/(d + 1.33*h);
  for (int i = 0; i < 5; i++){
    float a2 = D2*q*q + h*h, b = 1. - q, b2 = D2*b*b + d*d;
    float f = q*inversesqrt(a2) - 1.33*b*inversesqrt(b2);
    float fp = h*h*inversesqrt(a2)/a2 + 1.33*d*d*inversesqrt(b2)/b2;
    q = clamp(q - f/max(fp, 1e-7), 0.02, 1.);
  }
  float b = 1. - q;
  return vec4(wp.x, -h*b/q, wp.z, sqrt(D2*b*b + d*d));
}
#endif
`,Ne=`
#ifndef SL_WATER
#define SL_WATER
uniform vec3 uTurq, uCobalt, uSeaDeep, uSeaFire;
uniform vec2 uClear;
#ifndef SL_PHASE
#define SL_PHASE
uniform vec4 uPhase;
#endif
// the colour the water itself adds: on the lake turquoise going to cobalt with the length looked through; in the
// open sea a clear green-blue under the surface going to deep blue over some ten metres
vec3 waterBody(float depth, float path, float calm){
  vec3 open = mix(mix(uSeaDeep, uTurq, 0.3), mix(uSeaDeep, uCobalt, 0.6)*0.9, 1. - exp(-max(depth, 0.)*0.12));
  return mix(open, mix(uTurq*0.8, uCobalt*0.9, 1. - exp(-max(path, 0.)*0.07)), calm);
}
vec3 throughWater(vec3 col, float depth, float path, float calm){
  float k = mix(uClear.y, uClear.x, calm);
  vec3 T = exp(-k*(max(path, 0.) + 0.4*max(depth, 0.))*vec3(2.2, 0.9, 0.55));
  return col*T + waterBody(depth, path, calm)*(1. - T.g)*mix(0.9, mix(0.5, 0.95, smoothstep(3., 20., depth)), calm);
}
float caustic(vec2 p, float t0){
  float t = t0 + uPhase.x;
  vec2 q = p*0.42;
  q += 0.55*vec2(sin(q.y*1.7 + t*0.62), sin(q.x*1.5 - t*0.53));
  q += 0.28*vec2(sin(q.y*3.1 - t*0.81), sin(q.x*2.7 + t*0.74));
  float a = abs(sin(q.x*1.9 + 1.3*sin(q.y*1.3 + t*0.37)));
  float b = abs(sin(q.y*2.1 + 1.3*sin(q.x*1.1 - t*0.29)));
  float l = 1. - min(a, b);
  return l*l*l*l*(0.55 + 0.45*l*l);
}
#endif
`,Oe=`
#ifndef SL_DEEP
#define SL_DEEP
uniform sampler2D tShoal; uniform vec2 uShoal;
float bedDepth(vec2 p){ float s = texture2D(tShoal, clamp((p - uLake.xy)*uShoal.x + 0.5, 0., 1.)).r; return 2. + 58.*s*sqrt(max(s, 0.)); }
vec3 bedLight(float D){ return vec3(0.86, 0.82, 0.66)*exp(-uClear.y*1.8*D*vec3(2.2, 0.9, 0.55)); }
vec3 deepColor(float steep, float calm){
  vec3 outC = mix(mix(uSeaDeep, uTurq, 0.5), mix(uSeaDeep, uTurq, 0.2), smoothstep(0.15, 0.7, steep));
  return mix(outC, mix(uTurq*0.9, uCobalt*0.8, smoothstep(0.1, 0.6, steep)), calm);
}
// what lies behind a point of the water seen along the sight V (pointing from the eye): the floor of blue's colour
vec3 deepSeen(vec3 eye, vec3 V, float calm, float t, float lit){
  float steep = clamp(-V.y, 0.02, 1.);
  vec2 s = eye.xz + V.xz*(max(eye.y, 0.)/steep);
  float D = bedDepth(s); vec3 bl = bedLight(D)*(0.75 + 0.7*caustic(s*0.6, t));
  return (deepColor(steep, calm)*(1. - exp(-uClear.y*1.6*D)) + bl)*lit;
}
#endif
`;function he(e,s){const g=e.length,m=new Array(g);for(let t=0;t<g;t++){const u=Math.max(0,t-1),c=Math.min(g-1,t+1);m[t]=(s[c]-s[u])/(e[c]-e[u])}return t=>{if(t<=e[0])return s[0];if(t>=e[g-1])return s[g-1];let u=0;for(;t>e[u+1];)u++;const c=e[u+1]-e[u],f=(t-e[u])/c,i=f*f,x=i*f;return(2*x-3*i+1)*s[u]+(x-2*i+f)*c*m[u]+(-2*x+3*i)*s[u+1]+(x-i)*c*m[u+1]}}const ce=[0,.03,.08,.15,.22,.28,.33,.37,.44,.52,.6,.66,.72,.8,.87,.93,.965,1],qe=he(ce,[.094,.099,.101,.102,.102,.101,.093,.089,.092,.09,.082,.073,.061,.043,.03,.021,.014,.008]),Se=he(ce,[.078,.088,.094,.097,.098,.097,.094,.091,.09,.086,.079,.07,.058,.041,.029,.02,.013,.007]),Ge=he(ce,[.06,.065,.069,.072,.075,.077,.078,.08,.083,.078,.066,.055,.043,.026,.015,.009,.006,.004]),Ie=he(ce,[2.9,3,3.1,3.1,3,2.9,2.7,2.5,2.3,2.2,2.2,2.2,2.1,2,2,2,2,2]),Ue=he(ce,[.46,.5,.54,.55,.5,.42,.32,.24,.14,.1,.08,.08,.1,.12,.1,.05,0,0]),Ke=[.735,.772,.806,.838,.868],Le=(e,s)=>Math.sign(e)*Math.pow(Math.abs(e),s),fe=e=>{const s=ee((e-.4)/.6,0,1);return s*s},Ae=e=>e>.4&&e<1?-2*(e-.4)/.36:0,je=e=>{const s=e-.665;return .032*Math.exp(-((s/(s<0?.06:.03))**2))};function de(e,s,g,m){const t=Math.pow(1-Math.pow(1-Math.min(e/.06,1),2.5),.4),u=e>.965?Math.sqrt(Math.max(0,1-((e-.965)/.03)**2)):1,c=t*u,f=Ie(e),i=2/f,x=qe(e)*c,a=Se(e)*c,o=Ge(e)*c*g,n=-Math.cos(s),h=Math.sin(s);let w=(n>=0?x:a)*Le(n,i),b=o*Le(h,i);w<0&&a>1e-6&&(b*=1-Ue(e)*Math.pow(-w/a,1.3));const z=Math.pow(Math.max(n,0),4);let y=je(e);for(const T of Ke)y+=.009*Math.exp(-(((e-T)/.011)**2));w+=y*z*u;const C=s-(Math.PI-.5);w+=.007*Math.exp(-(((e-.04)/.016)**2))*Math.exp(-((C/.3)**2))*t;let A=.5-e;return w<0&&(A-=.3*-w*(1-te(0,.14,e))),A+=.01*Math.max(n,0)*(1-te(0,.06,e))*t,m[0]=b,m[1]=w,m[2]=A,m}function _e(){const e=[],s=[],g=[],m=[],t=[],u=[];return{P:e,I:t,v(c,f,i,x,a,o,n,h){return e.push(c,f,i),s.push(x,a),g.push(o[0],o[1],o[2]),m.push(n,h),u.push(0,0,0,0),e.length/3-1},tri(c,f,i){t.push(c,f,i)},quad(c,f,i,x){t.push(c,f,i,c,i,x)},fixNormal(c,f,i,x){u[c*4]=f,u[c*4+1]=i,u[c*4+2]=x,u[c*4+3]=1},build(c){const f=e.length/3,i=new Float32Array(f*3);for(let a=0;a<t.length;a+=3){const o=t[a]*3,n=t[a+1]*3,h=t[a+2]*3,w=e[n]-e[o],b=e[n+1]-e[o+1],z=e[n+2]-e[o+2],y=e[h]-e[o],C=e[h+1]-e[o+1],A=e[h+2]-e[o+2],T=b*A-z*C,D=z*y-w*A,H=w*C-b*y;for(const L of[o,n,h])i[L]+=T,i[L+1]+=D,i[L+2]+=H}for(const[a,o]of c||[])for(let n=0;n<3;n++){const h=i[a*3+n]+i[o*3+n];i[a*3+n]=h,i[o*3+n]=h}for(let a=0;a<f;a++){if(u[a*4+3]){i[a*3]=u[a*4],i[a*3+1]=u[a*4+1],i[a*3+2]=u[a*4+2];continue}const o=Math.hypot(i[a*3],i[a*3+1],i[a*3+2]);o>1e-12?(i[a*3]/=o,i[a*3+1]/=o,i[a*3+2]/=o):(i[a*3]=0,i[a*3+1]=1,i[a*3+2]=0)}const x=new l.BufferGeometry;return x.setAttribute("position",new l.Float32BufferAttribute(e,3)),x.setAttribute("normal",new l.BufferAttribute(i,3)),x.setAttribute("uv",new l.Float32BufferAttribute(s,2)),x.setAttribute("aCol",new l.Float32BufferAttribute(g,3)),x.setAttribute("aFlex",new l.Float32BufferAttribute(m,2)),x.setIndex(t),x}}}const Be={hi:[0,.004,.012,.028,.06,.1,.15,.2,.25,.3,.34,.38,.44,.5,.56,.61,.645,.665,.685,.71,.735,.754,.772,.789,.806,.822,.838,.853,.868,.9,.94,.975,.995],near:[0,.004,.012,.028,.06,.1,.15,.2,.25,.3,.34,.38,.44,.5,.56,.61,.645,.665,.685,.72,.772,.806,.838,.868,.9,.94,.975,.995],mid:[0,.005,.03,.12,.26,.345,.45,.58,.668,.72,.82,.92,.985],low:[0,.006,.035,.18,.33,.45,.6,.668,.72,.82,.92,.985],rank:[0,.006,.04,.2,.34,.52,.668,.8,.92,.985],full:[0,.005,.015,.032,.06,.11,.18,.26,.34,.42,.52,.61,.665,.7,.735,.772,.806,.838,.868,.92,.975],plain:[0,.012,.05,.2,.34,.52,.668,.8,.985],far:[.003,.05,.4,.668,.88]},ze=[1,1,1],Ce=[1.9,1.86,1.78],He=[3.1,3.05,2.9],ne=[.92,.92,.94],Fe=[.1,.09,.09],Ve=[1.5,1.45,1.4];function Ye(e={}){const s=e.lod||"hi",g=!!e.calf,m=g?1.1:1,t=_e(),u=[0,0,0],c=[];if(s==="far"){const a=Be.far,o=[Math.PI*.3,Math.PI*.65,Math.PI,Math.PI*1.35,Math.PI*1.7],n=[];for(const y of a){const C=[];for(const A of o)de(y,A,1,u),C.push(t.v(u[0],u[1],u[2],y,A/_,ze,fe(y),Ae(y)));n.push(C)}for(let y=0;y<a.length-1;y++)for(let C=0;C<o.length-1;C++)t.quad(n[y][C],n[y+1][C],n[y+1][C+1],n[y][C+1]);const h=t.v(0,.004,-.415,.95,.5,ne,1,Ae(.95)),w=t.v(.17,.004,-.505,1,.6,ne,1,0),b=t.v(-.17,.004,-.505,1,.4,ne,1,0),z=t.v(0,.004,-.488,1,.5,ne,1,0);return t.tri(h,w,z),t.tri(h,z,b),t.build()}const f=Be[s],i=s==="hi"?16:s==="near"?12:s==="plain"?6:8,x=[];for(let a=0;a<f.length;a++){const o=f[a],n=[];for(let h=0;h<=i;h++){const w=h/i*_;de(o,w,m,u);const b=-Math.cos(w),z=1-te(-.8,.3,b);let y=[ze[0]+(Ce[0]-1)*z,ze[1]+(Ce[1]-1)*z,ze[2]+(Ce[2]-1)*z];const C=(1-te(.22,.29,o))*(1-te(-.72,-.4,b))*te(.004,.03,o);y=y.map((T,D)=>T+(He[D]*.85-T)*C);const A=t.v(u[0],u[1],u[2],o,h/i,y,fe(o),Ae(o));a===0&&t.fixNormal(A,0,.25,.97),a===f.length-1&&t.fixNormal(A,0,0,-1),n.push(A)}c.push([n[0],n[i]]),x.push(n)}for(let a=0;a<f.length-1;a++)for(let o=0;o<i;o++)t.quad(x[a][o],x[a+1][o],x[a+1][o+1],x[a][o+1]);{const a=s==="hi"?5:s==="near"?4:s==="full"?3:2,o=s==="hi"?3:s==="rank"||s==="plain"?1:2,n=.17;for(const h of[1,-1])for(const w of[1,-1]){const b=[];for(let z=0;z<=a;z++){const y=z/a,C=[],A=-.4-.105*Math.pow(y,.9),T=-.488-.018*Math.sin(Math.PI*Math.min(y*1.15,1))-.015*y;for(let D=0;D<=o;D++){const H=D/o,L=A+(Math.min(T,A)-A)*H,I=.012*Math.pow(1-y,1.1)*Math.pow(Math.sin(Math.PI*ee(H*.92+.04,0,1)),.7);C.push(t.v(h*(.004+n*y),.003+w*I-.004*y*y,L,.95+.05*H,.5+h*.2*y,ne,1,Ae(.97)))}b.push(C)}for(let z=0;z<a;z++)for(let y=0;y<o;y++)h*w>0?t.quad(b[z][y],b[z+1][y],b[z+1][y+1],b[z][y+1]):t.quad(b[z][y],b[z][y+1],b[z+1][y+1],b[z+1][y])}}if(s!=="rank"&&s!=="plain"){const a=s==="hi"?4:s==="near"||s==="full"?2:1,o=.105*(g?1.1:1);for(const n of[1,-1]){de(.335,Math.PI*.5-.62,m,u);const h=[n*u[0]*.92,u[1],u[2]],w=[n*.7,-.5,-.51],b=[0,.32,.95],z=[n*.58,.8,-.16];for(const y of[1,-1]){const C=[];for(let A=0;A<=a;A++){const T=A/a,D=.031*Math.pow(Math.sin(Math.PI*ee(.18+.8*Math.pow(T,.8),0,1)),.8),H=[];for(let L=0;L<=2;L++){const I=L-1,B=(L===1?.006:0)*(1-T*.7)*y;H.push(t.v(h[0]+w[0]*o*T+b[0]*D*I+z[0]*B,h[1]+w[1]*o*T+b[1]*D*I+z[1]*B,h[2]+w[2]*o*T+b[2]*D*I+z[2]*B-.01*T*T,.34,.25,ne,fe(.34),0))}C.push(H)}for(let A=0;A<a;A++)for(let T=0;T<2;T++)n*y>0?t.quad(C[A][T],C[A][T+1],C[A+1][T+1],C[A+1][T]):t.quad(C[A][T],C[A+1][T],C[A+1][T+1],C[A][T+1])}}}if(s==="hi"||s==="near"||s==="full"||s==="mid"){const a=[.275,.21,.15,.095,.06],o=[];for(let h=0;h<a.length;h++){const w=a[h],b=h/(a.length-1),z=.0235-.0125*b,y=.0125-.005*b,C=-(Se(w)*.95)-.003-.024*b,A=.5-w-.3*Se(w)*(1-te(0,.14,w)),T=[];for(const[D,H]of[[0,-1],[1,0],[0,.6],[-1,0]])T.push(t.v(D*z,C+H*y,A,w,.02,He,0,0));o.push(T)}for(let h=0;h<a.length-1;h++)for(let w=0;w<4;w++){const b=(w+1)%4;t.quad(o[h][w],o[h][b],o[h+1][b],o[h+1][w])}const n=o[a.length-1];t.quad(n[0],n[1],n[2],n[3])}if(s==="hi"||s==="near"||s==="full"){const a=g?.0135:.0068,o=g?[2.9,2.8,2.65]:Ve,n=g?2.5:1.9;for(const h of[1,-1]){const w=Math.PI*.5-.3;de(.285,w,m,u);const b=[h*u[0],u[1],u[2]],z=[0,0,0];de(.285,w+.05,m,z);const y=[h*(z[0]-u[0]),z[1]-u[1],0],C=Math.hypot(y[0],y[1])||1;y[0]/=C,y[1]/=C;const A=[y[1]*h,-y[0]*h,0];A[0]*h<0&&(A[0]=-A[0],A[1]=-A[1]);const T=[0,0,1],D=s==="full"?6:8,H=t.v(b[0]+A[0]*a*.75,b[1]+A[1]*a*.75,b[2],.262,.3,Fe,0,0),L=[],I=[];for(let B=0;B<D;B++){const G=B/D*_,Q=Math.cos(G),$=Math.sin(G);L.push(t.v(b[0]+y[0]*Q*a+A[0]*a*.35,b[1]+y[1]*Q*a+A[1]*a*.35,b[2]+T[2]*$*a*1.25,.262,.3,Fe,0,0)),I.push(t.v(b[0]+y[0]*Q*a*n-A[0]*a*.2,b[1]+y[1]*Q*a*n-A[1]*a*.2,b[2]+T[2]*$*a*(n+.5),.262,.3,o,0,0))}for(let B=0;B<D;B++){const G=(B+1)%D;h>0?(t.tri(H,L[B],L[G]),t.quad(L[B],I[B],I[G],L[G])):(t.tri(H,L[G],L[B]),t.quad(L[B],L[G],I[G],I[B]))}}}if(e.cord){const o=[];for(let n=0;n<=9;n++){const h=n/9,w=.6+.5*h,b=.006*(1-.6*h),z=-Se(Math.min(w,.62))*(1-.3*h)-.05*h-.03*Math.sin(h*5);o.push([t.v(-b,z,.5-w,.9,.02,[3.4,2.7,2.6],fe(Math.min(w,1))*(.4+h),0),t.v(b,z,.5-w,.9,.02,[3.4,2.7,2.6],fe(Math.min(w,1))*(.4+h),0)])}for(let n=0;n<9;n++)t.quad(o[n][0],o[n+1][0],o[n+1][1],o[n][1]),t.quad(o[n][0],o[n][1],o[n+1][1],o[n+1][0]);for(const n of o)t.fixNormal(n[0],0,1,0),t.fixNormal(n[1],0,1,0)}return t.build(c)}function Qe(e){const m=document.createElement("canvas");m.width=512,m.height=256;const t=m.getContext("2d");t.fillStyle="#000",t.fillRect(0,0,512,256),t.globalCompositeOperation="lighter",t.lineCap="round";for(let f=0;f<260;f++){const i=e()*512,x=e()*256,a=6+e()*26,o=t.createRadialGradient(i,x,0,i,x,a);o.addColorStop(0,"rgba(0,0,255,"+(.1+e()*.22).toFixed(3)+")"),o.addColorStop(1,"rgba(0,0,255,0)"),t.fillStyle=o,t.fillRect(i-a,x-a,a*2,a*2),x<a&&t.fillRect(i-a,x-a+256,a*2,a*2)}const u=(f,i,x,a,o,n)=>{t.beginPath(),t.lineWidth=o,t.strokeStyle="rgba(255,0,0,"+n.toFixed(3)+")",t.moveTo(f,i),t.quadraticCurveTo(f+Math.cos(a)*x*.5+(e()-.5)*x*.3,i+Math.sin(a)*x*.5+(e()-.5)*x*.3,f+Math.cos(a)*x,i+Math.sin(a)*x),t.stroke()};for(let f=0;f<150;f++){const i=e()<.85,x=i?Math.pow(e(),1.7)*512*.3:512*(.3+e()*.68),a=e()*256,o=3+e()*(i?16:26),n=e()*6.28,h=e()<.3?2+Math.floor(e()*3):1;for(let w=0;w<h;w++)u(x+Math.sin(n)*w*2.2,a-Math.cos(n)*w*2.2,o,n,.45+e()*.5,(i?.3:.16)+e()*.4)}for(let f=0;f<60;f++){const i=e()*512*.26,x=(e()<.5?.02+e()*.2:.78+e()*.2)*256,a=1.5+e()*3.5;t.beginPath(),t.lineWidth=.9,t.strokeStyle="rgba(255,0,0,"+(.4+e()*.4).toFixed(3)+")",t.arc(i,x,a,0,6.3),t.stroke()}const c=new l.CanvasTexture(m);return c.wrapS=l.ClampToEdgeWrapping,c.wrapT=l.RepeatWrapping,c.colorSpace=l.NoColorSpace,c.generateMipmaps=!0,c.minFilter=l.LinearMipmapLinearFilter,c.magFilter=l.LinearFilter,c.anisotropy=4,c}async function Xe(e,s){const m=document.createElement("canvas");m.width=256,m.height=256;const t=m.getContext("2d"),u=t.createImageData(256,256),c=new Float32Array(256*256),f=[0,1,2,3,4,5].map(()=>e()*_),i=o=>Math.sqrt(Math.abs(Math.sin(Math.PI*o)));for(let o=0;o<256;o++)for(let n=0;n<256;n++){const h=n/256,w=o/256,b=.5*Math.sin(_*(h+.25*Math.sin(_*w*3+f[0]))+f[1])+.3*Math.sin(_*(h*3+w*2)+f[2])+.3*Math.sin(_*(h*7+w*5)+f[5]),z=.6*Math.sin(_*(h*2+w)+f[3])+.3*Math.sin(_*(h*5-w*3)+f[4]),y=.55+.45*Math.sin(_*(h*5+.5*Math.sin(_*w*5+f[2]))+f[0])*Math.sin(_*(w*7+h*2)+f[5]);c[o*256+n]=(.62*i(w*17+b)+.38*i(w*37+z))*(.45+.55*y),n===255&&o%16===15&&await s()}const x=(o,n)=>c[(n+256)%256*256+(o+256)%256];for(let o=0;o<256;o++)for(let n=0;n<256;n++){const h=(o*256+n)*4;n===0&&o%64===63&&await s(),u.data[h]=128+127*ee((x(n,o+1)-x(n,o-1))*2.5,-1,1),u.data[h+1]=128+127*ee((x(n+1,o)-x(n-1,o))*2.5,-1,1),u.data[h+2]=255*ee(c[o*256+n],0,1),u.data[h+3]=255}t.putImageData(u,0,0);const a=new l.CanvasTexture(m);return a.wrapS=l.RepeatWrapping,a.wrapT=l.RepeatWrapping,a.colorSpace=l.NoColorSpace,a.generateMipmaps=!0,a.minFilter=l.LinearMipmapLinearFilter,a.magFilter=l.LinearFilter,a.anisotropy=4,a}const Me=`
#ifndef SL_SEA
#define SL_SEA
uniform vec4 uWave[6];
uniform float uWavePh[6];
uniform vec4 uSwell[2];
float seaState(vec2 p){ return mix(0.05, 1., roughAt(p)); }
// THE OILY SWELL of the calm: two slow low trains, a few decimetres from crest to trough and tens of metres long (60 m
// and 37 m), that lift and bend the mirror; it dies away where the chop takes over. xy = its slope, z = its height
vec3 oilGH(vec2 p, float t){
  float k = 1. - smoothstep(0.05, 0.6, roughAt(p));
  vec2 d0 = uWave[0].xy, d1 = vec2(-uWave[1].y, uWave[1].x);
  float a0 = dot(d0, p)*0.105 - 0.42*t + uWavePh[4], a1 = dot(d1, p)*0.171 - 0.55*t + uWavePh[5];
  return k*vec3(d0*(0.0168*cos(a0)) + d1*(0.0154*cos(a1)), 0.16*sin(a0) + 0.09*sin(a1));
}
// the wind sea alone (what runs over the long swell)
float chopH(vec2 p, float t){
  float h = 0.;
  for (int i = 0; i < 6; i++){ vec4 w = uWave[i]; h += w.w*sin(dot(w.xy, p)*w.z - sqrt(9.81*w.z)*t + uWavePh[i]); }
  // close round the boat the wind sea is broken down by her hull and her oars: to 0.3 of its height within three
  // metres of her middle, whole at twenty
  vec2 rb = p - uBoat.xy;
  return h*seaState(p)*mix(0.3, 1., smoothstep(9., 400., dot(rb, rb))) + oilGH(p, t).z;
}
// THE LONG SWELL of the straits: two crossed trains of low hills of water travelling on the world clock, each at the
// speed of a deep-water wave of its length (uSwell: height, wave vector x and z, phase). It dies away rank by rank and
// is not in the lane. xy = its slope, z = its height
vec3 swellGH(vec2 p){
  float k = roughOf(lakeRho(p), 0.)*(1. - laneAt(p, 6.));
  float a0 = dot(uSwell[0].yz, p) - sqrt(9.81*length(uSwell[0].yz))*uTime + uSwell[0].w, a1 = dot(uSwell[1].yz, p) - sqrt(9.81*length(uSwell[1].yz))*uTime + uSwell[1].w;
  return k*vec3(uSwell[0].yz*(uSwell[0].x*cos(a0)) + uSwell[1].yz*(uSwell[1].x*cos(a1)), uSwell[0].x*sin(a0) + uSwell[1].x*sin(a1));
}
float swellAt(vec2 p){ return swellGH(p).z; }
float waveH(vec2 p, float t){ return chopH(p, t) + swellAt(p); }
#endif
`,ue=`
float slHash(float n){ return fract(sin(n*12.9898)*43758.5453); }
float slHash2(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
float slNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(slHash2(i), slHash2(i + vec2(1., 0.)), f.x), mix(slHash2(i + vec2(0., 1.)), slHash2(i + vec2(1., 1.)), f.x), f.y); }
`,Ze=`
attribute vec2 aFlex; attribute vec3 aCol;
attribute vec4 iA, iB, iC, iE;
#ifndef DIRECT
attribute vec4 iD, iG, iR, iQ;
#else
attribute float iH;
#endif
#ifdef HIDEABLE
attribute float iN;
#endif
uniform float uFogDen;
varying vec3 vN, vWp, vAp, vCol, vT; varying vec2 vUv, vSk; varying vec4 vW, vTint; varying vec2 vLH;
${ke}
${De}
${Me}
void main(){
  // (its length, for the marks by nearness; its out-of-sight depth)
  vLH = vec2(iA.w, ${be.toFixed(1)});
#ifdef DIRECT
  vLH.y = iH;
  Whale w = whaleDirect(iA, iB, iC);
  float tailPh = iB.w, swim = iC.y;
#else
  Whale w = whaleAt(iA, iB, iC, iD, iG, iR, iQ, uTime);
  float tailPh = uTime*(1.3 + 0.5*min(w.speed, 5.)) + iC.w*30., swim = iC.y;
#endif
  vec3 n = normal;
  vec3 wp = whalePlace(w, iA.w, position, aFlex, tailPh, swim, n);
  // the long swell lifts the whale with the water it lies in; what is seen through the water is worked out as on
  // still water, with the eye's height taken over the water as it stands under the eye (the eye itself keeps its
  // height: the swell is not in the route)
  float sw = swellAt(wp.xz), hS = chopH(wp.xz, uTime);
  vec4 ap = seenThroughWater(wp, vec3(cameraPosition.x, cameraPosition.y - swellAt(cameraPosition.xz), cameraPosition.z));
  float d = max(-wp.y, 0.), wv = min(d, 6.)*0.014;
  ap.y += hS*step(1e-4, d) + sw;
  ap.xz += wv*vec2(sin(wp.z*0.9 + uTime*1.3 + uPhase.w) + 0.5*sin(wp.x*2.1 - uTime*1.9 + uPhase.z), sin(wp.x*0.8 - uTime*1.1 + uPhase.y) + 0.5*sin(wp.z*2.3 + uTime*1.7 + uPhase.w));
  // vWp.y: height above the water as it stands there (the swell lifts and drops the waterline on the body)
  vN = n; vWp = vec3(wp.x, wp.y - hS, wp.z); vAp = ap.xyz; vUv = uv; vCol = aCol; vTint = iE;
  // the body's own line (for the lie of its folds) and the skin's measure in metres: a fold tile is 2.6 m long, two to a girth
  float cpT = cos(w.pitch); vT = vec3(w.fwd.x*cpT, sin(w.pitch), w.fwd.y*cpT); vSk = vec2(uv.x*iA.w/2.6, uv.y*max(1., floor(0.19*iA.w + 0.5)));
  vec4 mv = viewMatrix*vec4(ap.xyz, 1.);
  float fd = uFogDen*length(mv.xyz);
  vW = vec4(d, ap.w, calmAt(wp.xz), 1. - exp(-fd*fd));
  gl_Position = projectionMatrix*mv;
#ifdef DIRECT
  if (iB.x < -${(be+Pe).toFixed(1)}) gl_Position = vec4(0., 0., 2., 1.);
#endif
#ifdef HIDEABLE
  // (this whale is drawn by the other make just now: see kit.herd's show and kit.pool)
  if (iN < 0.5) gl_Position = vec4(0., 0., 2., 1.);
#endif
}`,$e=`
uniform sampler2D tSkin, tWrinkle;
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce, uFogCol, uSkin, uScar, uSkyRefl, uFoam, uGateCol;
uniform float uTime, uWet, uSeaLit;
uniform vec4 uBoat, uGateL, uLake;
varying vec3 vN, vWp, vAp, vCol, vT; varying vec2 vUv, vSk; varying vec4 vW, vTint; varying vec2 vLH;
${Ne}
${Oe}
${ue}
void main(){
  // what the vertex stage hands over is held to its range (antialiasing samples run outside the triangle)
  float dep = clamp(vW.x, 0., 400.), pathW = clamp(vW.y, 0., 4000.), calmK = clamp(vW.z, 0., 1.);
  // NOTHING AT OR UNDER ITS OUT-OF-SIGHT DEPTH IS SEEN (the rule at the head of this file): from two thirds of that
  // depth a body thins away point by point, and at the depth none of it is left. So a whale that comes up from
  // under it, or sounds to there, neither comes into being nor goes at any one moment.
  { float hideD = clamp(vLH.y, 6., 400.), gone = smoothstep(hideD*0.667, hideD, dep); if (gone > 0. && slHash2(gl_FragCoord.xy) < gone) discard; }
  // NOTHING UNDER WATER IS SEEN THROUGH HER: a sight that meets the water inside the boat's own outline (where the
  // sea leaves its surface out: her beam at the height the water stands against her) has met her first, so what
  // swims under the water along that sight is not drawn. No whale under her keel shows on her planks.
  { float tS = clamp(cameraPosition.y/max(cameraPosition.y - vAp.y, 1e-3), 0., 1.);
    vec2 sB = cameraPosition.xz + (vAp.xz - cameraPosition.xz)*tS - uBoat.xy;
    float alS = dot(sB, uBoat.zw), laS = abs(sB.x*uBoat.w - sB.y*uBoat.z), sS = clamp((5.8 + alS)/8.5, 0., 1.);
    float bmS = 0.665*pow(max(1. - pow(abs(2.*sS - 1.), 2.3), 0.), 0.72);
    if (vWp.y < 0. && alS > -5.8 && alS < 2.7 && laS < bmS) discard; }
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  float calf = clamp(vTint.w, 0., 1.), s = clamp(vUv.x, 0., 1.);
  // THE HIDE'S MARKS BY NEARNESS (declared in the world's header): within three of the whale's own lengths of the eye
  // its marks are drawn at their strongest (the folds' shadows, the pale scuffs and scars, the head's long
  // scratches, the blowhole's dark slit, the sheen broken into patches by the water sliding on it), and they go
  // back to the plain hide by six lengths, where they are finer than the picture's grain
  float nearK = 1. - smoothstep(3., 6., length(cameraPosition - vAp)/max(vLH.x, 1.));
#ifdef FAR
  vec3 sk = vec3(0.1, 0., 0.5); float crease = 0.;
#else
  vec3 sk = texture2D(tSkin, vUv).rgb;
  // THE HIDE: smooth on the head; from behind the head to the hump wrinkled like a prune, in lengthwise folds whose
  // size is told in metres of skin (the same on a long whale and a short one)
  float wr = smoothstep(0.31, 0.4, s)*(1. - smoothstep(0.7, 0.88, s))*(1. - 0.85*calf);
  vec4 wk = texture2D(tWrinkle, vSk);
  vec3 T = normalize(vT + vec3(0., 1e-5, 0.)), Bd = normalize(cross(N, T) + vec3(1e-5, 0., 0.));
  N = normalize(N - wr*0.95*((wk.r - 0.5)*Bd + (wk.g - 0.5)*T));
  float crease = wr*(1. - wk.b);
#endif
  vec3 toEye = cameraPosition - vAp; float dist = length(toEye); vec3 V = toEye/max(dist, 1e-3);
  // slate grey-brown, darkest and smoothest on the head, mottled; pale scars and scratches, most of them on the head
  vec3 alb = uSkin*vCol*vTint.rgb*(0.62 + 0.62*sk.b)*mix(0.78, 1., smoothstep(0.26, 0.42, s));
  // pale patches (old skin sloughing, a metre or three across, told in metres of hide) and the scars over them
  float patchy = smoothstep(0.6, 0.8, slNoise(vSk*vec2(1.1, 1.7) + vTint.rg*37.))*(1. - 0.7*calf);
  alb = mix(alb, uScar*vTint.rgb*0.85, mix(0.4, 0.5, nearK)*patchy);
  alb = mix(alb, uScar*vTint.rgb*1.15, clamp(sk.r*mix(0.8, 1.15, nearK), 0., 1.)*(1. - 0.8*calf));
  // (the head's long pale scratches, lengthwise; the blowhole, a dark slit at the front of the head left of the ridge)
  float scr = smoothstep(0.8, 0.92, slNoise(vec2(vSk.x*1.7 + vTint.g*13., vUv.y*110.)))*(1. - smoothstep(0.3, 0.44, s))*nearK*(1. - 0.8*calf);
  alb = mix(alb, uScar*vTint.rgb*1.2, 0.55*scr);
  float bhs = (s - 0.04)/0.012, bhv = (vUv.y - 0.42)/0.008;
  alb *= 1. - 0.85*nearK*exp(-bhs*bhs - bhv*bhv);
  alb *= 1. - mix(0.25, 0.5, nearK)*crease;
  alb = max(alb, vec3(0.));
  // (near, by the same nearness as the marks: the back, which the sun strikes square, is the darkest of the hide and
  // the flank under it a shade paler, so a bull beside the boat is a dark wet back over a paler flank with its
  // scars on it, not one pale face)
  alb *= mix(1., 0.66 + 0.34*(1. - smoothstep(0.1, 0.75, N.y)), nearK);
  float under = 1. - smoothstep(-0.09, 0.03, vWp.y);
  float ndl = clamp(dot(N, uSunDir), 0., 1.);
  vec3 amb = mix(uBounce, uSkyCol, N.y*0.5 + 0.5);
  vec3 H = normalize(V + uSunDir + vec3(0., 1e-4, 0.));
  float nh = clamp(dot(N, H), 0., 1.), nv = clamp(dot(N, V), 0., 1.);
  // out of the water it is wet: a soft sheen over the lit side, a hard glint that the folds break into threads, the
  // sky in its grazing edges
  // (wet hide is dark: it shows by what it gives back of the sun and the sky, not by its own grey)
  // (near, the wet hide takes little of the sun and the sky by its own grey: it is a dark body whose light is the
  // gleam and the sheen on it, and its scars are pale marks on the dark, not a pale wash over the whole of it)
  vec3 above = alb*(uSunCol*ndl*mix(0.8, 0.36, nearK) + amb*vec3(1.2, 1.18, 1.3)*mix(1., 0.62, nearK));
  // the wet on it moves: a film of water slides over the hide (the gleam wanders with it), and where the back has
  // just come up the water runs off it in threads down the flanks, from the ridge to the waterline
  float film = 0.55 + 0.9*slNoise(vWp.xz*1.3 + vec2(uTime*0.7, uTime*0.4));
  float runs = smoothstep(0.55, 0.85, slNoise(vec2(vSk.x*11., abs(vUv.y - 0.5)*16. - uTime*0.9)))*(1. - smoothstep(0.25, 1.6, vWp.y));
  float gleam = (pow(nh, 24.)*0.12 + pow(nh, 180.)*0.6*(0.5 + 0.8*sk.b)*(1. - 0.6*crease))*film + pow(nh, 40.)*0.5*runs;
  float fr = 1. - nv; fr = fr*fr*fr*fr;
  // (near, the sky's sheen does not lie over the whole back as one pale wash: it stands in patches where the film
  // of water is thick, and the hide between them is dark)
  above += uWet*(uSunCol*gleam*smoothstep(0., 0.15, ndl) + uSkyRefl*(fr*0.45 + (mix(0.13, 0.025 + 0.19*smoothstep(0.85, 1.35, film), nearK) + 0.22*runs)*clamp(N.y*0.7 + 0.3, 0., 1.)));
  // THE RING'S LIGHT on a wet hide: from where the ring stands, falling off with the square of the distance (half
  // of it at uGateL.w metres), on the side turned to it. The hide stays dark under it (it takes the light by its
  // own dark colour) and the wet on it gives the ring back only along its grazing edges: a back near the ring is a
  // dark body with a warm rim, not a pale stone
  { vec3 Lg = uGateL.xyz - vWp; float dg2 = dot(Lg, Lg), w2 = uGateL.w*uGateL.w, kg = w2/(w2 + dg2);
    above += (alb*0.3 + 0.45*uWet*fr)*uGateCol*kg*clamp(dot(N, Lg*inversesqrt(max(dg2, 1e-4)))*0.75 + 0.25, 0., 1.); }
#ifdef FAR
  // far off: the wet back gives the sky back along its top, so a row of them never reads as rocks
  above += uSkyRefl*0.13*clamp(N.y, 0., 1.) + uSunCol*0.04*pow(nh, 12.);
#endif
  // under it: lit from above (the back takes the light, flank and belly are in shade but paler of skin), the sun
  // broken into a moving net on back and head, the colour going to blue and fainter with the depth of water looked
  // through; and our own boat's shadow sliding over
  float up = clamp(N.y*0.6 + 0.5, 0., 1.);
  float ca = caustic(vWp.xz + N.xz*1.2, uTime);
  float sweep = 0.72 + 0.38*sin(vWp.x*0.21 + vWp.z*0.13 + uTime*0.5 + uPhase.z)*sin(vWp.z*0.17 - uTime*0.33 + uPhase.w);
  float deepK = smoothstep(0.5, 8., dep);
  vec2 sp = vWp.xz + uSunDir.xz*(dep*0.62/max(uSunDir.y, 0.3)) - uBoat.xy;
  float sAl = dot(sp, uBoat.zw), sLa = abs(sp.x*uBoat.w - sp.y*uBoat.z), soft = 0.5 + 0.09*dep;
  float shade = (1. - smoothstep(0.75 - 0.3*soft, 0.75 + soft, sLa))*smoothstep(-6.2 - soft, -5.4, sAl)*(1. - smoothstep(2.3, 2.9 + soft, sAl))*step(0.01, dep);
  // (the belly takes the water's own light from below: its pale skin shows paler than the flank over it)
  float dn = clamp(0.3 - 0.7*N.y, 0., 1.);
  vec3 below = alb*(uSunCol*(ndl*0.6 + ca*up*mix(2., 3.8, deepK)*exp(-dep*0.03))*sweep*exp(-dep*0.024)*(1. - 0.75*shade) + amb*(0.07 + 0.62*up*up*up)
    + (uTurq + uCobalt)*(uSeaLit*0.5*dn*dn));
  // A WHALE UNDER WATER IS IN THE WATER: every point of it goes into the very blue that lies behind it (what the
  // water shows where nothing swims: deepSeen, the floor's own colour along this sight) by the water looked through
  // to that point, red first, then green, then blue. So a body near the surface is lit and shaded, one further
  // down is bluer and fainter, and one deep in thick water is gone: none stands on the water as a flat shape.
  // AT A GLANCE THE SURFACE HIDES IT: under the ruffled open sea a body shows whole where the sight goes down at
  // eleven degrees or more and not at all under three and a half; under the calm (the lake, the lane) from four
  // degrees, and not under one. So from a bow's height in the open no dark shape lies on the water far ahead.
  { float kW = mix(uClear.y, uClear.x, calmK); vec3 Tw = exp(-kW*(pathW + 0.4*dep)*vec3(2.2, 0.9, 0.55));
    Tw *= smoothstep(mix(0.06, 0.02, calmK), mix(0.2, 0.07, calmK), V.y);
    below = below*Tw + deepSeen(cameraPosition, -V, calmK, uTime, uSeaLit)*(1. - Tw); }
  below += uSeaFire*(0.25 + 0.75*fr + 0.6*ca)*exp(-dep*0.08);
  vec3 col = mix(above, below, under);
  // WHERE THE BODY BREAKS THE SURFACE: in the open sea froth climbs the hide to an uneven line (4 to 18 cm
  // of it) and boils there; on the sleek only a bright thread lies at the waterline. Its size is told in
  // metres only; skin that lies flat in the surface (a back awash, flukes) carries none; the far model has none.
#ifndef FAR
  float fn = slNoise(vWp.xz*2.6 + vec2(uTime*0.6, -uTime*0.4)), fn2 = slNoise(vWp.xz*7.3 - vec2(uTime*0.9, uTime*0.5));
  float reach = mix(0.1 + 0.3*fn*fn, 0.03, calmK);
  float wl = (1. - smoothstep(0.35*reach, reach, abs(vWp.y - 0.3*reach)))*(1. - smoothstep(0.7, 0.93, abs(N.y)));
  float froth = wl*mix(0.55 + 0.45*smoothstep(0.25, 0.7, fn2), 0.3*smoothstep(0.2, 0.7, fn), calmK);
  col = mix(col, mix(uFoam*(0.72 + 0.28*fn2)*(0.55 + 0.45*clamp(ndl + 0.4, 0., 1.)), uSkyRefl*1.25, calmK), froth);
#endif
  col = mix(col, uFogCol, clamp(vW.w, 0., 1.));
  gl_FragColor = vec4(col, 1.);
}`,Re=[0,0,0,0,0,0,-1e4];function pe(e,s){const g=new l.InstancedBufferAttribute(new Float32Array(Math.max(s,1)*4),4),m=new l.InstancedBufferAttribute(new Float32Array(Math.max(s,1)*4),4);g.setUsage(l.DynamicDrawUsage),m.setUsage(l.DynamicDrawUsage);for(let t=0;t<s;t++)m.array[t*4+2]=-1e4;return e.setAttribute("iR",g),e.setAttribute("iQ",m),(t,u,c)=>{const f=g.array,i=m.array,x=t*4;if(!(f[x]===c[0]&&f[x+1]===c[1]&&f[x+2]===c[2]&&f[x+3]===c[3]&&i[x]===c[4]&&i[x+1]===c[5]&&i[x+2]===c[6])){for(let a=0;a<u;a++){const o=(t+a)*4;f[o]=c[0],f[o+1]=c[1],f[o+2]=c[2],f[o+3]=c[3],i[o]=c[4],i[o+1]=c[5],i[o+2]=c[6]}g.needsUpdate=m.needsUpdate=!0}}}function ae(e,s,g,m){const t=new l.InstancedBufferGeometry;t.index=e.index;for(const c of Object.keys(e.attributes))t.setAttribute(c,e.attributes[c]);const u={};for(const[c,f]of g){const i=new l.InstancedBufferAttribute(new Float32Array(Math.max(s,1)*f),f);m&&i.setUsage(l.DynamicDrawUsage),t.setAttribute(c,i),u[c]=i}return t.instanceCount=s,t.boundingSphere=new l.Sphere(new l.Vector3,1e9),{geometry:t,attr:u}}const Je={WAY:6.2,SOFT:18,DEPTH:6.2,TOP:.11,BLOW:.4,AIR:5.2,REST:8},We=(e,s,g)=>{const m=Math.min(1,Math.max(0,(g-e)/(s-e)));return m*m*(3-2*m)},Z=(e,s,g)=>Math.min(g,Math.max(s,e));function Te(e,s,g,m,t,u){const c=Math.sin(e),f=Math.cos(e),i=Z((-c-.35)/.6,0,1),x=1.6+2.6*t,a=Math.exp(-(1-Math.cos(e-.45))*5),o=g+m*(1-x*i*i*(3-2*i)+.4*a),n=i>0&&i<1?-f/.6:0,h=m*(-x*6*i*(1-i)*n-.4*a*5*Math.sin(e-.45))*6.2831853/Math.max(s,1);return[o,Math.atan2(h,Math.max(u,1.3))]}function Ee(e,s,g,m,t){const u=g.fluke||0,c=g.y??-.9,f=g.amp??0,i=.5*Math.min(g.len/Math.max(m,1.3)*6.2831853/Math.max(s,1),1.8),x=Te(e,s,c,f,u,m),a=Te(e+i,s,c,f,u,m),o=Te(e-i,s,c,f,u,m),n=-.3-.5*u,h=Math.min(1,.2+m*.5),w=Z((-Math.sin(e)-.35)/.6,0,1);return t[0]=x[0],t[1]=Z(x[1],n,.32)*h,t[2]=(Z(o[1],n,.32)-Z(a[1],n,.32))*h,t[3]=u*We(.02,.3,w)*(1-We(.5,.95,w))*(Math.cos(e)<=0?1:0),t}function at(e){const s=Je,g=e.whales,m=g.length,t=e.line,u=e.step,c=t.length>>1,f=6.2831853,i=e.shape,x=r=>1+i[0]*Math.cos(2*r+i[1])+i[2]*Math.cos(3*r+i[3]),a=r=>-2*i[0]*Math.sin(2*r+i[1])-3*i[2]*Math.sin(3*r+i[3]),o=new Uint8Array(m),n=new Uint8Array(m),h=new Float64Array(m),w=new Uint8Array(m),b=new Float64Array(m).fill(-1e30),z=new Uint8Array(m),y={n:m,y:new Float64Array(m),x:new Float64Array(m),z:new Float64Array(m),la:new Float64Array(m),d:new Float64Array(m),wd:new Float64Array(m),own:n,none:o,seen:w};for(const r of g)r.keep=[0,0,0,0,0,0,-1e4];let C=!1,A=0;const T=[0,0,0,0,0],D=[0,0,0,0],H=[0,0,0,0],L=[0,0,0],I=[-.5,-.25,.25,.5],B=(r,k)=>{const d=r.th+(r.w||0)*k,S=x(d),v=a(d),p=Math.cos(d),W=Math.sin(d),F=r.r*S;let U=v*p-S*W,q=v*W+S*p;const j=Math.hypot(U,q)||1,V=(r.w||0)<0?-1:1;U=U/j*V,q=q/j*V;const R=(r.yaw||0)+(r.yawW||0)*Math.sin(k*.07+(r.seed??.5)*f),K=Math.cos(R),O=Math.sin(R);return T[0]=e.cx+F*p,T[1]=e.cz+F*W,T[2]=U*K-q*O,T[3]=U*O+q*K,T[4]=Math.abs(r.w||0)*F,T},G=Math.max(0,c-1),Q=new Float64Array(G),$=new Float64Array(G),me=new Float64Array(G),ve=new Float64Array(G),ye=new Float64Array(G);for(let r=0;r<G;r++){const k=t[r*2],d=t[r*2+1],S=t[r*2+2]-k,v=t[r*2+3]-d,p=Math.hypot(S,v)||1;Q[r]=S,$[r]=v,me[r]=p,ve[r]=S/p,ye[r]=v/p}const se=(r,k,d,S)=>{let v=0,p=1e30;for(let R=0;R<c;R+=8){const K=r-t[R*2],O=k-t[R*2+1],P=K*K+O*O;P<p&&(p=P,v=R)}if(p>28900)return D[0]=v*u,D[1]=Math.sqrt(p),D[2]=0,D[3]=0,D;const W=Math.max(0,v-9),F=Math.min(c-2,v+9);let U=0,q=1e30,j=0,V=0;for(let R=W;R<=F;R++){const K=t[R*2],O=t[R*2+1],P=Q[R],xe=$[R],ie=me[R],le=ve[R],J=ye[R];let X=((r-K)*le+(k-O)*J)/ie;(R>0||X>0)&&(X=Z(X,0,1));const re=K+P*X,ge=O+xe*X,Y=Math.hypot(r-re,k-ge);Y<q&&(q=Y,U=(R+X)*u,j=Math.abs(d*J-S*le),V=Y>.001?(d*(r-re)+S*(k-ge))/Y:0)}return D[0]=U,D[1]=q,D[2]=j,D[3]=V,D},oe=(r,k,d,S,v)=>{let p=se(r,k,d,S);const W=p[1];let F=W,U=p[3];if(W<.59*v+s.WAY+s.SOFT)for(let q=0;q<4;q++){const j=I[q]*v;p=se(r+d*j,k+S*j,d,S),p[1]<F&&(F=p[1],U=p[3])}return L[0]=F-.09*v,L[1]=U,L[2]=W,L},M=r=>1-We(s.WAY,s.WAY+s.SOFT,r),E=(r,k)=>{const d=B(r,k),S=d[4],v=M(oe(d[0],d[1],d[2],d[3],r.len)[0]);if(v<=0)return 0;const p=Math.max(r.per??10,1);return Ee(f*(k/p+(r.ph??0)),p,r,S,H),v*Math.max(0,H[0]+s.DEPTH+s.TOP*r.len)};return{step:r=>{(!C||r<A||r-A>1)&&h.fill(-1e30);for(let d=0;d<m;d++){if(r<h[d]){w[d]=0;continue}const S=g[d],v=S.len,p=Math.max(S.per??10,1),W=B(S,r),F=W[0],U=W[1],q=W[4],j=oe(F,U,W[2],W[3],v),V=j[0],R=j[1],K=j[2],O=M(V),P=S.keep,xe=r/p+(S.ph??0)-.06,ie=Math.floor(xe),le=(xe-ie)*p;let J=0;if(le<s.AIR&&K<.59*v+s.WAY+s.SOFT+(q+1)*(s.AIR+1)){if(b[d]!==ie){const Y=r-le;b[d]=ie,z[d]=E(S,Y)>s.BLOW||E(S,Y+1)>s.BLOW?1:0}J=z[d]}if(y.x[d]=F,y.z[d]=U,y.la[d]=K,y.d[d]=V,y.wd[d]=O,o[d]=J,O<=0&&!J){(P[0]!==0||P[6]!==-1e4)&&(P[0]=0,P[1]=0,P[2]=0,P[3]=0,P[4]=0,P[5]=0,P[6]=-1e4);const Y=K-(.59*v+s.WAY+s.SOFT)-s.REST;Y>0&&(h[d]=r+Y/(1.6*q+1)),n[d]=0,w[d]=1;continue}w[d]=2,n[d]=1,Ee(f*(r/p+(S.ph??0)),p,S,q,H);const X=Math.max(0,H[0]+s.DEPTH+s.TOP*v),re=Z((V-s.WAY)/s.SOFT,0,1),ge=X*6*re*(1-re)/s.SOFT*R;P[0]=1,P[1]=H[0]-O*X,P[2]=H[1]*(1-O)+Math.atan(Z(ge,-.6,.6)),P[3]=H[2]*(1-O),P[4]=H[3]*(1-O),P[5]=0,P[6]=J?-2e4:-1e4,y.y[d]=P[1]}return C=!0,A=r,y},state:y,lay:se,place:B,roll:Te,pose:Ee,under:E,dist:oe,at:M,lane:(r,k)=>{const d=B(r,k);return M(oe(d[0],d[1],d[2],d[3],r.len)[0])}}}function we(e,s,g){const m=e.seed??.5,t=e.tint||[1,1,1];g.iA.setXYZW(s,e.r,e.th,e.w||0,e.len),g.iB.setXYZW(s,e.ph??0,e.per??10,e.y??-.9,e.amp??0),g.iC.setXYZW(s,e.roll||0,e.swim??.02,e.fluke||0,m),g.iD&&g.iD.setXYZW(s,e.yaw||0,e.yawW||0,e.pitch||0,e.rollO||0),g.iE&&g.iE.setXYZW(s,t[0],t[1],t[2],e.calf||0),g.iG&&g.iG.setXYZW(s,e.arcC||0,e.arcH??4,e.hold?1:0,e.arch||0)}async function et(e,s={}){const g=(s.rng||e.rng).fork("whale-kit"),m=Qe(g);await e.yield();const t=await Xe(g,()=>e.yield());await e.yield();const u={uTime:{value:0},uLake:{value:new l.Vector4(0,0,150,0)},uShape:{value:new l.Vector4(0,0,0,0)},uBoat:{value:new l.Vector4(1e6,1e6,0,-1)},uLane:{value:new l.Vector4(0,-1,16,0)},uTurq:{value:new l.Color("#1fa7c9")},uCobalt:{value:new l.Color("#0d3b8f")},uSeaDeep:{value:new l.Color("#0b2f7a")},uSeaFire:{value:new l.Color(0,0,0)},uClear:{value:new l.Vector2(.03,.3)},uSunDir:{value:new l.Vector3(.3,.75,.55).normalize()},uSunCol:{value:new l.Color(3,2.85,2.5)},uSkyCol:{value:new l.Color(.55,.75,1.05)},uBounce:{value:new l.Color(.12,.3,.45)},uFogCol:{value:new l.Color(.6,.75,.95)},uFogDen:{value:4e-4},uSkin:{value:new l.Color("#3d4044")},uScar:{value:new l.Color("#756e68")},uSkyRefl:{value:new l.Color(.7,.9,1.2)},uWet:{value:1},tSkin:{value:m},tWrinkle:{value:t},uWave:{value:[0,1,2,3,4,5].map(()=>new l.Vector4(1,0,.2,0))},uSwell:{value:[0,1].map(()=>new l.Vector4(0,.07,0,0))},uWind:{value:new l.Vector3(.9,.25,.3)},uSpoutLit:{value:new l.Color(1.5,1.52,1.55)},uSpoutShade:{value:new l.Color(.5,.62,.85)},uRanks:{value:new l.Vector4(1.08,.12,0,0)},uPhase:{value:new l.Vector4(0,0,0,0)},uWavePh:{value:[0,1.7,3.4,5.1,6.8,8.5]},uBow:{value:1},uFoam:{value:new l.Color(1.1,1.14,1.18)},uGateL:{value:new l.Vector4(0,0,0,0)},uGateCol:{value:new l.Color(0,0,0)},tShoal:{value:new l.DataTexture(new Uint8Array([255,255,255,255]),1,1)},uShoal:{value:new l.Vector2(0,60)},uSeaLit:{value:1}};u.tShoal.value.needsUpdate=!0;const c={};for(const[M,E]of[["hi",{lod:"hi"}],["calf",{lod:"hi",calf:!0}],["newborn",{lod:"hi",calf:!0,cord:!0}],["full",{lod:"full"}],["plain",{lod:"plain"}],["mid",{lod:"mid"}],["far",{lod:"far"}]])c[M]=Ye(E),await e.yield();const f=(M,E)=>new l.ShaderMaterial({uniforms:u,defines:M,vertexShader:Ze,fragmentShader:$e,side:E||l.FrontSide}),i={herd:f({}),far:f({FAR:1},l.DoubleSide),actor:f({DIRECT:1}),hideable:f({HIDEABLE:1})};function x(M,E="mid",N=!1){const{geometry:r,attr:k}=ae(c[E],M.length,[["iA",4],["iB",4],["iC",4],["iD",4],["iE",4],["iG",4]]);M.forEach((p,W)=>we(p,W,k));const d=pe(r,M.length);let S=null;N&&(S=new l.InstancedBufferAttribute(new Float32Array(Math.max(M.length,1)).fill(1),1),S.setUsage(l.DynamicDrawUsage),r.setAttribute("iN",S));const v=new l.Mesh(r,E==="far"?i.far:N?i.hideable:i.herd);return v.frustumCulled=!1,{object:v,count:M.length,triangles:M.length*c[E].index.count/3,keep(p,W){d(p,1,W)},show(p,W){const F=W?1:0;S.array[p]!==F&&(S.array[p]=F,S.needsUpdate=!0)}}}function a(M,E="full"){const{geometry:N,attr:r}=ae(c[E],M,[["iA",4],["iB",4],["iC",4],["iD",4],["iE",4],["iG",4]],!0);for(let v=0;v<M;v++)r.iA.setXYZW(v,1,0,0,0),r.iB.setXYZW(v,0,10,-900,0),r.iE.setXYZW(v,1,1,1,0),r.iG.setXYZW(v,0,4,0,0);const k=new l.Mesh(N,i.herd);k.frustumCulled=!1;const d=new Array(M).fill(null),S=pe(N,M);return{object:k,count:M,put(v,p){if(S(v,1,p.keep||Re),d[v]!==p){d[v]=p,we(p,v,r);for(const W in r)r[W].needsUpdate=!0}},done(v){for(let p=v;p<M;p++)d[p]!==null&&(d[p]=null,S(p,1,Re),r.iA.setW(p,0),r.iB.setZ(p,-900),r.iA.needsUpdate=r.iB.needsUpdate=!0)}}}function o(M,E="hi",N=!1){const{geometry:r,attr:k}=ae(c[E],M,[["iA",4],["iB",4],["iC",4],["iE",4],["iH",1]],!0);for(let v=0;v<M;v++)k.iA.setXYZW(v,0,0,0,0),k.iB.setXYZW(v,-500,0,0,0),k.iE.setXYZW(v,1,1,1,0),k.iH.setX(v,be);const d=new l.Mesh(r,i.actor);d.frustumCulled=!1;let S=null;if(N){const v=new l.InstancedBufferGeometry;v.index=B.index;for(const p of Object.keys(B.attributes))v.setAttribute(p,B.attributes[p]);v.setAttribute("iA",k.iA),v.setAttribute("iB",k.iB),v.setAttribute("iC",k.iC),v.instanceCount=M,v.boundingSphere=new l.Sphere(new l.Vector3,1e9),S=new l.Mesh(v,$),S.frustumCulled=!1,S.renderOrder=2}return{object:d,wash:S,count:M,set(v,p){k.iA.setXYZW(v,p.x,p.z,p.yaw||0,p.len),k.iB.setXYZW(v,p.y,p.pitch||0,p.roll||0,p.tail||0),k.iC.setXYZW(v,p.fluke||0,p.swim??.02,p.speed||0,p.arch||0),p.tint&&k.iE.setXYZW(v,p.tint[0],p.tint[1],p.tint[2],p.calf||0);const W=p.hide||be;k.iH.getX(v)!==W&&(k.iH.setX(v,W),k.iH.needsUpdate=!0),k.iA.needsUpdate=k.iB.needsUpdate=k.iC.needsUpdate=!0,p.tint&&(k.iE.needsUpdate=!0)}}}const n=new l.BufferGeometry;n.setAttribute("position",new l.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]);const h=`
uniform vec3 uSunDir, uSunCol, uFogCol, uSpoutLit, uSpoutShade; uniform float uBow;
varying vec2 vQ; varying vec4 vP; varying vec3 vDir;
${ue}
void main(){
  float r = length(vQ);
  float n = slNoise(vQ*2.3 + vP.z*31. + vec2(0., -vP.y*1.6)), n2 = slNoise(vQ*5.5 - vP.z*17.);
  // spray, not a ball: the drop's edge is ragged and its body thin enough to see through
  float a = 1. - smoothstep(0.05, 1., r);
  a = smoothstep(0.18, 0.9, a*(0.3 + 1.0*n + 0.5*n2))*vP.x;
  if (a < 0.004) discard;
  vec3 dir = normalize(vDir + vec3(0., 1e-5, 0.));
  float sunward = clamp(dot(dir, uSunDir), 0., 1.);
  vec3 col = mix(uSpoutShade, uSpoutLit, clamp(0.55 + 0.5*vQ.y + 0.35*(n - 0.5), 0., 1.));
  // against the light the spray's rim burns
  col += uSunCol*(0.35*sunward*sunward*sunward*sunward + 0.5*pow(sunward, 24.))*(1. - 0.6*a);
  // a piece of rainbow where the mist stands 42 degrees from the point opposite the sun
  float ang = acos(clamp(dot(dir, -uSunDir), -1., 1.));
  float band = (ang - 0.69)/0.07;
  float inBow = smoothstep(0., 0.2, band)*(1. - smoothstep(0.8, 1., band));
  vec3 hue = clamp(vec3(1.5 - abs(band*4. - 3.2), 1.5 - abs(band*4. - 2.1), 1.5 - abs(band*4. - 1.0)), 0., 1.);
  col = mix(col, hue*uSunCol*0.62, inBow*uBow*(0.45 + 0.3*n));
  col = mix(col, uFogCol, clamp(vP.w, 0., 1.));
  gl_FragColor = vec4(col*a, a);
}`,w=(M,E)=>new l.ShaderMaterial({uniforms:u,defines:E||{},vertexShader:M,fragmentShader:h,transparent:!0,depthWrite:!1,blending:l.CustomBlending,blendSrc:l.OneFactor,blendDst:l.OneMinusSrcAlphaFactor,blendSrcAlpha:l.OneFactor,blendDstAlpha:l.OneMinusSrcAlphaFactor}),b=`
attribute vec4 iA, iB, iC, iD, iG, iS, iR, iQ;
uniform float uFogDen; uniform vec3 uWind;
varying vec2 vQ; varying vec4 vP; varying vec3 vDir;
${ke}
${Me}
${ue}
vec3 dropAt(vec3 hole, vec3 jet, vec3 fwd3, float v0, float sp, float age, float h3){
  return hole + jet*v0*(1. - exp(-age*2.2))/2.2 + fwd3*sp*0.3*(1. - exp(-age*1.2))/1.2 + uWind*age*(0.35 + 0.5*h3) + vec3(0., -0.22*age*age, 0.);
}
void main(){
  float per = max(iB.y, 1.);
  float since = fract(uTime/per + iB.x - iS.y)*per;
  float age = since - iS.x;
  if (age < 0.) age += per;
  // A KEPT WHALE'S BLOWS (Q.z, written by the world): -1e4 = its own clock's, as every other whale's; -2e4 = this
  // blow is not given (the lane of deep water had the whale under at the second its own clock's blow began: see
  // the WAY block). A blow is whole or not at all. Every blow is its whale's own clock's: its drops age on the
  // world clock and the jet's height is drawn out of the whale's seed and the number of its round.
  float shown = 1., round0 = floor(uTime/per + iB.x - iS.y);
  if (iR.x > 0.5 && iQ.z < -15000.) shown = 0.;
  float h1 = slHash(iS.w), h2 = slHash(iS.w + 7.31), h3 = slHash(iS.w + 3.17);
  float life = min(3. + h1, per*0.95);
  float k = clamp(age/life, 0., 1.);
  // (a blow stands where its whale's own round had its head when the drop left, kept or not)
  Whale w = whaleAt(iA, iB, iC, iD, iG, vec4(0.), iQ, uTime - age);
  vec3 n = vec3(0., 1., 0.);
  vec3 hole = whalePlace(w, iA.w, vec3(0.034, 0.103, 0.462), vec2(0.), 0., 0., n);
  float headOut = smoothstep(-0.3, 0.1, hole.y);
  hole = max(hole, vec3(-1e6, 0.1, -1e6)) + vec3(0., swellAt(hole.xz), 0.);
  vec3 fwd3 = vec3(w.fwd.x, 0., w.fwd.y), left = vec3(w.fwd.y, 0., -w.fwd.x);
  float H = iS.z*(0.75 + 0.5*slHash(iC.w*91. + round0));
  vec3 jet = normalize(fwd3*0.6 + left*0.37 + vec3(0., 0.71, 0.) + 0.3*vec3(h1 - 0.5, h2 - 0.5, h3 - 0.5));
  float v0 = 3.1*H*(0.7 + 0.6*h2);
  vec3 p = dropAt(hole, jet, fwd3, v0, w.speed, age, h3), p0 = dropAt(hole, jet, fwd3, v0, w.speed, max(age - 0.15, 0.), h3);
#ifdef FARPLUME
  float size = H*0.3*(1. + k), stretch = 2.6;
  float alpha = smoothstep(0., 0.05, k)*(1. - k)*headOut*step(age, life);
#else
  float size = min(H*(0.1 + 0.2*sqrt(k)), 0.34 + 0.85*sqrt(k))*(0.75 + 0.5*h3), stretch = 1. + (h3 < 0.4 ? 2.4 : 1.1)*(1. - smoothstep(0.05, 0.6, k));
  float alpha = smoothstep(0., 0.04, k)*(1. - k)*headOut*step(age, life)*(0.55 + 0.3*h2);
#endif
  alpha *= shown;
  vec4 mv = viewMatrix*vec4(p, 1.), mv0 = viewMatrix*vec4(p0, 1.);
  vec2 ax = mv.xy - mv0.xy; float al = length(ax); ax = al > 1e-4 ? ax/al : vec2(0., 1.);
  float dist = length(mv.xyz);
  // A BLOW IS A MEDIUM, passed through: close to the lens it thins, its opacity falling with the true distance to
  // the lens (whole at seven metres, nothing at a metre and a half; no step). Nothing of a blow reads the boat.
  alpha *= smoothstep(1.5, 7., dist);
  // SEEN NEAR (within seventy metres of the eye, whole within thirty: a rule of nearness in metres) a blow is a
  // mist: each drop is drawn larger, thinner and less drawn out, so that the drops run into one another and the
  // jet stands as one soft plume; far off they are the small bright strokes they were.
  float nearB = 1. - smoothstep(30., 70., dist);
  size *= 1. + 1.5*nearB; alpha *= 1. - 0.45*nearB; stretch = mix(stretch, 1. + 0.45*(stretch - 1.), nearB);
  mv.xy += (vec2(ax.y, -ax.x)*position.x*(1.5/(0.5 + stretch)) + ax*position.y*stretch)*size;
  vQ = position.xy; vDir = p - cameraPosition;
  float fd = uFogDen*dist;
  vP = vec4(alpha, k, iS.w, (1. - exp(-fd*fd))*0.8);
  gl_Position = projectionMatrix*mv;
}`,z=w(b),y=w(b,{FARPLUME:1});function C(M,E){let N=0;for(const W of M)N+=W.n;const{geometry:r,attr:k}=ae(n,N,[["iA",4],["iB",4],["iC",4],["iD",4],["iG",4],["iS",4]]);let d=0;const S=[],v=pe(r,N);for(const W of M){S.push(d);for(let F=0;F<W.n;F++,d++)we(W.whale,d,k),k.iS.setXYZW(d,E?.5*F:(F+.5*(d*7%3)/3)/W.n,W.ph,W.size,d*.6180339%1*97+1)}const p=new l.Mesh(r,E?y:z);return p.frustumCulled=!1,p.renderOrder=3,{object:p,count:N,triangles:N*2,keep(W,F){v(S[W],M[W].n,F)}}}const A=`
attribute vec4 iO, iV, iS;
uniform float uFogDen, uTime; uniform vec3 uWind;
varying vec2 vQ; varying vec4 vP; varying vec3 vDir;
${ue}
vec3 dropAt(vec3 jet, float v0, float ag, float h3){
  float dr = mix(2.2, 1.5, iS.z);
  vec3 p = iO.xyz + jet*v0*(1. - exp(-ag*dr))/dr + uWind*ag*mix(0.35 + 0.5*h3, 0.4, iS.z) + vec3(0., -mix(0.22, 2.2, iS.z)*ag*ag, 0.);
  p.y = max(p.y, iO.y - 0.12);
  return p;
}
void main(){
  float age = uTime - iO.w - iS.x*mix(1., 0.25, iS.z);
  float h1 = slHash(iS.w), h2 = slHash(iS.w + 7.31), h3 = slHash(iS.w + 3.17);
  float life = mix(3. + h1, 2.2 + 1.2*h1, iS.z);
  float k = clamp(age/life, 0., 1.);
  vec3 jet = normalize(iV.xyz + mix(0.3, 1.5, iS.z)*vec3(h1 - 0.5, h2 - 0.3, h3 - 0.5));
  float v0 = iV.w*mix(3.1*(0.7 + 0.6*h2), 2.6 + 3.2*h2, iS.z), ag = max(age, 0.);
  vec3 p = dropAt(jet, v0, ag, h3), p0 = dropAt(jet, v0, max(ag - 0.15, 0.), h3);
  float size = mix(min(iV.w*(0.1 + 0.2*sqrt(k)), 0.34 + 0.85*sqrt(k)), iV.w*(0.07 + 0.2*sqrt(k)), iS.z)*(0.75 + 0.5*h3)*(1. + 0.5*iS.y);
  float stretch = 1. + (h3 < 0.4 ? 2.4 : 1.1)*(1. - smoothstep(0.05, 0.6, k));
  float alpha = smoothstep(0., 0.05, k)*(1. - k)*step(0., age)*step(age, life)*mix(0.55 + 0.3*h2, 0.6 + 0.3*h2, iS.z)*(1. - 0.4*iS.y);
  vec4 mv = viewMatrix*vec4(p, 1.), mv0 = viewMatrix*vec4(p0, 1.);
  vec2 ax = mv.xy - mv0.xy; float al = length(ax); ax = al > 1e-4 ? ax/al : vec2(0., 1.);
  float dist = length(mv.xyz);
  // (spray is a medium: close to the lens it thins by the true distance to the lens, as a blow does; it reads no boat)
  alpha *= smoothstep(1.5, 7., dist);
  // A SPLASH SEEN FROM FAR OFF is one body of white water, not a handful of strokes (against a dark shore a far
  // leap's crown stood as white flecks on the rock): beyond fifty metres each drop of a splash is drawn larger,
  // softer and less drawn out, so the drops run together; by a hundred and ten metres wholly so. Near, the crown
  // is the separate drops it was.
  float farS = iS.z*smoothstep(50., 110., dist);
  size *= 1. + 1.8*farS; alpha *= 1. - 0.3*farS; stretch = mix(stretch, 1. + 0.25*(stretch - 1.), farS);
  mv.xy += (vec2(ax.y, -ax.x)*position.x*(1.5/(0.5 + stretch)) + ax*position.y*stretch)*size;
  vQ = position.xy; vDir = p - cameraPosition;
  float fd = uFogDen*dist;
  vP = vec4(alpha, k, iS.w, (1. - exp(-fd*fd))*0.8);
  gl_Position = projectionMatrix*mv;
}`,T=w(A);function D(M,E=10){const{geometry:N,attr:r}=ae(n,M*E,[["iO",4],["iV",4],["iS",4]],!0);for(let d=0;d<M*E;d++)r.iO.setXYZW(d,0,-50,0,-1e4),r.iV.setXYZW(d,0,1,0,1),r.iS.setXYZW(d,d%E/E,0,0,d*.6180339%1*97+1);const k=new l.Mesh(N,T);return k.frustumCulled=!1,k.renderOrder=3,{object:k,count:M*E,fire(d,S,v,p,W,F,U,q,j,V=0,R=0){for(let K=0;K<E;K++){const O=d*E+K;r.iO.setXYZW(O,S,v,p,j),r.iV.setXYZW(O,W,F,U,q),r.iS.setY(O,R),r.iS.setZ(O,V)}r.iO.needsUpdate=r.iV.needsUpdate=r.iS.needsUpdate=!0}}}const H=`
attribute vec4 iA, iB, iC;
#ifndef DIRECT
attribute vec4 iD, iG, iR, iQ;
#endif
uniform float uFogDen;
varying vec2 vL; varying vec3 vWp; varying vec3 vK; varying vec4 vM; varying vec2 vC; varying vec2 vO;
${ke}
${Me}
// the body's back and beam along its length (s = 0 the snout, 1 the flukes), in shares of its length
float topP(float s){ return mix(0.1, 0.012, smoothstep(0.42, 0.97, s)); }
float widP(float s){ return 0.004 + 0.074*(1. - smoothstep(0.48, 0.95, s)); }
// metres by which the back at station s stands out of the water in the whale's pose
float outAt(Whale w, float len, float s){
  float z = 0.5 - s;
  return w.pos.y + len*(sin(w.pitch)*z + cos(w.pitch)*topP(s) - 0.5*w.arch*(z*z - 0.0833));
}
void main(){
#ifdef DIRECT
  Whale w = whaleDirect(iA, iB, iC);
#else
  Whale w = whaleAt(iA, iB, iC, iD, iG, iR, iQ, uTime);
#endif
  float len = iA.w;
  // a sheet from a little ahead of the snout to a length and a half astern, its rows thick about the head
  float t = 0.5 - 0.5*position.y, tp = t*sqrt(sqrt(t)*sqrt(sqrt(t)));
  float along = 0.62 - 2.5*t*sqrt(tp);
  float s = 0.5 - along, sc = clamp(s, 0., 1.);
  float outH = outAt(w, len, sc);
  float emerge = smoothstep(-0.22, 0.2, outH);
  float wakeK = max(max(smoothstep(-0.1, 0.3, outAt(w, len, 0.08)), smoothstep(-0.1, 0.3, outAt(w, len, 0.36))), smoothstep(-0.1, 0.3, outAt(w, len, 0.66)));
  // the half breadth of the body where the water cuts it
  float hw = len*widP(sc)*clamp(sqrt(max(outH, 0.)/(0.09*len)), 0.25, 1.);
  float ax = abs(position.x), lx = sign(position.x)*ax*sqrt(ax)*len*(0.2 + 0.18*clamp(s, 0., 2.));
  vec2 side = vec2(w.fwd.y, -w.fwd.x);
  vec2 xz = w.pos.xz + side*lx + w.fwd*(along*len);
  float calm = calmAt(xz);
  // white water comes of the whale's own way and of the sea breaking on one that lies still
  float spd = max(0.22 + 0.78*clamp(w.speed/3., 0., 1.), 0.7*roughAt(xz));
  // form: the water pushed up before the head, and standing against the flanks
  float d = length(vec2(max(abs(lx) - hw, 0.), max(-s, 0.)*len));
  float lift = len*(0.034*spd*(1. - smoothstep(0.05, 0.45, s))*exp(-d/(0.055*len)) + 0.01*exp(-d/(0.035*len)))*emerge*(1. - 0.7*calm);
  // (the water piled against a body never stands higher than the back it is piled against)
  lift = min(lift, 0.02 + 0.7*max(outH, 0.));
  vec3 wp = vec3(xz.x, waveH(xz, uTime) + 0.05 + lift, xz.y);
  vL = vec2(lx, s); vWp = wp;
  vC = vec2(calm, (1. - smoothstep(0.72, 1., ax))*(1. - smoothstep(0.86, 1., position.y)));
  vM = vec4(hw, wakeK, len*widP(sc), len);
  // how high the back stands out of the water here, and on which side of the body the eye is
  vO = vec2(max(outH, 0.), dot(cameraPosition.xz - w.pos.xz, side));
  vec4 mv = viewMatrix*vec4(wp, 1.);
  float fd = uFogDen*length(mv.xyz);
  vK = vec3(emerge, spd, 1. - exp(-fd*fd));
  gl_Position = projectionMatrix*mv;
}`,L=`
uniform vec3 uFoam, uTurq, uFogCol, uSkin, uSkyCol; uniform float uTime;
varying vec2 vL; varying vec3 vWp; varying vec3 vK; varying vec4 vM; varying vec2 vC; varying vec2 vO;
${ue}
void main(){
  float ax = abs(vL.x), s = vL.y, len = max(vM.w, 1.), hw = vM.x, calm = clamp(vC.x, 0., 1.), spd = clamp(vK.y, 0., 1.);
  // metres out from the body's side, or from its snout ahead of it
  float d = length(vec2(max(ax - hw, 0.), max(-s, 0.)*len));
  float n = 0.55*slNoise(vWp.xz*1.1 + vec2(uTime*0.3, 0.)) + 0.45*slNoise(vWp.xz*3.1 - vec2(0., uTime*0.5));
  float n2 = slNoise(vWp.xz*8. + vec2(uTime*0.2, uTime*0.4));
  float onBody = 1. - smoothstep(1., 1.06, s);
  // white water against the body: a collar that boils at the head and widens down the flank
  float reach = (0.3 + 1.7*max(vM.z, 0.)*(0.4 + 0.6*spd))*(1. - 0.6*calm);
  // (only where the back truly stands out of the water: one that lies awash or has just gone under carries no
  // white sheet in its own shape;
  // and none over the back itself: the white lies along the waterline and outside it, and before the snout)
  // (AND ONLY WHERE THE BODY IS IN THE SURFACE: where its back stands higher over the water than the whole body is
  // deep, a fifth of its length, that part of it is in the air (a leap, a head thrown up) and the water under it
  // carries neither a collar nor a waterline nor the body's image; they lie round where it goes through the surface)
  float inW = 1. - smoothstep(0.2*len, 0.2*len + 0.6, vO.x);
  float collar = (1. - smoothstep(0., reach, d))*clamp(vK.x, 0., 1.)*onBody*smoothstep(0.03, 0.3, vO.x)*mix(1., smoothstep(0.45*hw, 0.95*hw, ax), step(0., s))*inW;
  float foam = smoothstep(0.45, 0.8, collar*(0.35 + 1.1*n))*(0.4 + 0.6*smoothstep(0.25, 0.6, n2))*(0.3 + 0.7*spd)*mix(1., 0.45, calm);
  // astern: bubbles and green-white water, widening and fading over a length and a half
  float tt = clamp((s - 0.55)/1.75, 0., 1.), wT = len*(0.07 + 0.11*tt);
  float bub = smoothstep(0.42, 0.8, 0.6*n + 0.5*n2);
  float trail = (1. - smoothstep(0.35*wT, wT, ax))*smoothstep(0., 0.12, tt)*(1. - tt)*(1. - tt)*clamp(vM.y, 0., 1.)*spd*mix(1., 0.5, calm);
  float tA = trail*(0.3 + 0.7*bub);
  float halo = collar*collar*0.3*spd;
  // on the sleek: rings going out from where the body lies in the surface
  // (round the whole body, as round an egg: its half length and its half beam)
  float eb = max(vM.z, 0.03*len) + 0.4, dR = (length(vec2(vL.x/eb, (s - 0.5)*len/(0.52*len))) - 1.)*eb;
  float rings = (0.5 + 0.5*sin(dR*2.4 - uTime*1.5))*smoothstep(0.2, 1.2, dR)*(1. - smoothstep(0.08*len, 0.2*len, dR))*clamp(vK.x, 0., 1.)*calm;
  // (on the calm a back that breaks the surface lies in a pale ring: a thread of white close along its waterline)
  float thread = (1. - smoothstep(0.04, 0.3 + 0.25*n, d))*smoothstep(0.03, 0.2, vO.x)*clamp(vK.x, 0., 1.)*onBody*calm*inW*(0.35 + 0.45*n2);
  float a = clamp(foam*0.95 + max(tA*0.85, halo) + rings*0.26 + thread, 0., 1.)*clamp(vC.y, 0., 1.);
  // THE BACK DOUBLED IN THE CALM. Seen low, the water on our side of a body gives back the body and not the sky: its
  // dark image lies out from the waterline as far as the back stands high, drawn out by the lowness of the look
  // (a mirror only at a glance: looked down on, the water is clear). And all round the body a dark line where the
  // water meets it.
  vec3 Vw = cameraPosition - vWp; float hv = max(length(Vw.xz), 1e-3), ve = max(Vw.y, 0.)/hv, sinE = ve*inversesqrt(1. + ve*ve);
  float fm = 1. - sinE; fm = 0.02 + 0.98*fm*fm*fm*fm*fm;
  float dW = max(ax - hw, 0.), reachM = vO.x/max(ve, 0.06);
  // (the image is there only at a glance, under about fifteen degrees: looked down on, the water is clear)
  float img = (1. - smoothstep(0.55*reachM, reachM + 0.05, dW))*step(0., vL.x*vO.y)*step(0.04, vO.x)*onBody*step(0., s)*fm*calm*clamp(vC.y, 0., 1.)*(1. - smoothstep(0.12, 0.28, sinE));
  float line = (1. - smoothstep(0.02, 0.22, d))*clamp(vK.x, 0., 1.)*onBody*calm*0.55*clamp(vC.y, 0., 1.)*inW;
  img *= inW;
  float dark = clamp(max(img*0.9, line)*(1. - a), 0., 1.);
  if (a + dark < 0.004) discard;
  vec3 aer = uTurq*0.75 + 0.35*uFoam;
  vec3 col = mix(aer, uFoam*(0.84 + 0.22*n2), clamp((foam*0.92 + 0.5*tA*bub + rings*0.1)/max(a, 1e-3), 0., 1.));
  col = (col*a + uSkin*uSkyCol*0.55*dark)/max(a + dark, 1e-3); a = a + dark;
  col = mix(col, uFogCol, clamp(vK.z, 0., 1.));
  gl_FragColor = vec4(col*a, a);
}`,I=M=>new l.ShaderMaterial({uniforms:u,defines:M,vertexShader:H,fragmentShader:L,transparent:!0,depthWrite:!1,side:l.DoubleSide,blending:l.CustomBlending,blendSrc:l.OneFactor,blendDst:l.OneMinusSrcAlphaFactor,blendSrcAlpha:l.OneFactor,blendDstAlpha:l.OneMinusSrcAlphaFactor}),B=new l.PlaneGeometry(2,2,4,8),G=new l.PlaneGeometry(2,2,2,6),Q=I({}),$=I({DIRECT:1});function me(M,E){const{geometry:N,attr:r}=ae(E?G:B,M.length,[["iA",4],["iB",4],["iC",4],["iD",4],["iG",4]]);M.forEach((S,v)=>we(S,v,r));const k=new l.Mesh(N,Q);k.frustumCulled=!1,k.renderOrder=2;const d=pe(N,M.length);return{object:k,count:M.length,triangles:M.length*(E?24:64),keep(S,v){d(S,1,v)}}}const ve=`
attribute vec4 iA, iB, iC, iD, iG, iR, iQ;
uniform vec3 uSunDir; uniform float uFogDen; uniform vec2 uClear;
varying vec2 vQ; varying vec3 vK;
${ke}
${De}
${Me}
void main(){
  Whale w = whaleAt(iA, iB, iC, iD, iG, iR, iQ, uTime);
  float len = iA.w, dS = 0.4*len;
  vec2 side = vec2(w.fwd.y, -w.fwd.x);
  vec2 c = w.pos.xz - uSunDir.xz*(dS*0.75/max(uSunDir.y, 0.35));
  vec2 xz = c + w.fwd*(position.y*0.56*len) + side*(position.x*0.15*len);
  vec3 wp = vec3(xz.x, min(w.pos.y, 0.) - dS, xz.y);
  vec4 ap = seenThroughWater(wp, vec3(cameraPosition.x, cameraPosition.y - swellAt(cameraPosition.xz), cameraPosition.z));
  ap.y += swellAt(wp.xz);
  vQ = position.xy;
  vec4 mv = viewMatrix*vec4(ap.xyz, 1.);
  float fd = uFogDen*length(mv.xyz);
  // (it is in the water: seen where one looks down into it, not at a glance, where the surface gives back the sky)
  vec3 Vw = cameraPosition - wp; float glance = smoothstep(0.17, 0.42, Vw.y*inversesqrt(max(dot(Vw, Vw), 1e-4)));
  // (and no plainer than the water over it lets it be: it goes with the light that reaches its depth and comes back,
  // by the water's own clearness there, so outside the calm it is faint and under a whale gone down it is gone)
  float calmS = calmAt(w.pos.xz);
  vK = vec3(smoothstep(-0.45*len, -0.12*len, w.pos.y)*glance*exp(-mix(uClear.y, uClear.x, calmS)*2.*max(-wp.y, 0.)), calmS, 1. - exp(-fd*fd));
  gl_Position = projectionMatrix*mv;
}`,ye=`
uniform vec3 uSeaDeep, uCobalt;
varying vec2 vQ; varying vec3 vK;
void main(){
  float r2 = clamp(dot(vQ, vQ), 0., 1.), e = (1. - r2)*(1. - r2);
  float a = e*clamp(vK.x, 0., 1.)*mix(0.34, 0.5, clamp(vK.y, 0., 1.))*(1. - clamp(vK.z, 0., 1.));
  if (a < 0.004) discard;
  gl_FragColor = vec4(mix(uSeaDeep, uCobalt, 0.4)*0.3*a, a);
}`,se=new l.ShaderMaterial({uniforms:u,vertexShader:ve,fragmentShader:ye,transparent:!0,depthWrite:!1,side:l.DoubleSide,blending:l.CustomBlending,blendSrc:l.OneFactor,blendDst:l.OneMinusSrcAlphaFactor,blendSrcAlpha:l.OneFactor,blendDstAlpha:l.OneMinusSrcAlphaFactor});function oe(M){const{geometry:E,attr:N}=ae(n,M.length,[["iA",4],["iB",4],["iC",4],["iD",4],["iG",4]]);M.forEach((d,S)=>we(d,S,N));const r=new l.Mesh(E,se);r.frustumCulled=!1,r.renderOrder=.3;const k=pe(E,M.length);return{object:r,count:M.length,triangles:M.length*2,keep(d,S){k(d,1,S)}}}return{uniforms:u,geo:c,mats:i,herd:x,pool:a,actors:o,spouts:C,puffs:D,wash:me,shade:oe}}async function ot(e,s={}){const g=s.kit||await et(e,s);await e.yield();const m=new l.Group,t=g.actors(3,"hi"),u=g.actors(1,"calf"),c=g.puffs(2,12);m.add(t.object,u.object,c.object);const f={x:0,y:4.6,z:0,yaw:0,pitch:.04,roll:0,len:11,tail:0,swim:.03,arch:0,tint:[1,1,1],calf:0},i={x:.5,y:9.4,z:-.5,yaw:0,pitch:0,roll:1.35,len:11,tail:0,swim:.03,arch:0,tint:[1,1,1],calf:0},x={x:.4,y:-.6,z:1.5,yaw:.1,pitch:-.5,roll:0,len:11,tail:0,swim:.015,arch:.75,fluke:1,tint:[1,1,1],calf:0},a={x:-3.3,y:2.9,z:-1.2,yaw:.25,pitch:.12,roll:.5,len:4.4,tail:0,swim:.04,arch:.1,tint:[1.45,1.45,1.5],calf:1};return{object:m,kit:g,radius:5.2,height:9,center:new l.Vector3(0,4.4,.4),anchors:{blowhole:new l.Vector3(.37,1.13,5.08)},ground:!1,update(o,n){g.uniforms.uTime.value=n,f.tail=n*1.5,f.y=4.6+.25*Math.sin(n*.5),a.tail=n*2.2+1,a.y=2.9+.25*Math.sin(n*.5+.6),i.tail=n*1.5+2,x.tail=n*1.2+4,t.set(0,f),t.set(1,i),t.set(2,x),u.set(0,a);const h=Math.floor(n/5),w=Math.cos(f.yaw),b=Math.sin(f.yaw);for(let z=0;z<2;z++)c.fire(((h-z)%2+2)%2,f.x+.37*w+5.08*b,5.75,f.z-.37*b+5.08*w,b*.6+w*.37,.71,w*.6-b*.37,2.5,(h-z)*5,0)},dispose(){}}}export{be as FLOOR,Oe as GLSL_DEEP,ke as GLSL_HERD,De as GLSL_REFRACT,Me as GLSL_SEA,Ne as GLSL_WATER,Pe as GONE,tt as OPEN_HIDE,Je as WAY,ot as buildHero,at as makeWay,et as makeWhaleKit,Ye as whaleGeometry};
