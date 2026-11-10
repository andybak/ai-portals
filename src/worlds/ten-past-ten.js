import*as F from"three";import{makePath as p0,makeRng as Pt}from"../kit/core.js";import{FACE_GLSL as m0,DIAL_LIGHT_GLSL as x0,GREAT as wt,GLASS_PASS as qt,IRON_PAINT as w0,makeDialKit as Qt,buildHero as g0,handAngles as v0}from"../parts/ten-past-ten.js";const y0=[[-16,12,116],[-16.03,12,103.95],[-16.73,12.03,91.93],[-18.88,12.36,80.08],[-22.46,13.01,68.58],[-26.81,13.84,57.28],[-31.17,14.76,46.04],[-35.54,15.64,34.81],[-39.89,16.39,23.57],[-43.55,17.12,12.1],[-45.11,17.84,.13],[-43.55,18.69,-11.78],[-38.9,19.75,-22.86],[-31.48,20.92,-32.31],[-21.8,22.14,-39.5],[-10.6,23.34,-43.85],[1.35,24.45,-45.09],[13.22,25.42,-43.2],[24.58,26.49,-39.08],[35.61,27.58,-34.21],[46.61,28.55,-29.31],[57.66,29.62,-24.39],[68.67,30.71,-19.49],[79.67,31.75,-14.59],[90.68,32.62,-9.69],[101.73,33.24,-4.77],[112.74,33.5,.13],[123.77,33.77,4.96],[135.07,34.39,9.14],[146.83,35.29,11.98],[158.81,36.4,13.25],[170.85,37.65,12.95],[182.75,38.97,11.11],[194.43,40.27,8.13],[206.07,41.48,4.84],[217.8,42.53,2.08],[229.74,43.35,.49],[241.77,43.86,.02],[253.87,44,0],[265.91,44,0],[278,44,0]],Tt=[.7002,.7071,.0984],zt=["#F3F0E6","#15191C","#2F6B62","#C8A545","#8FC3EA","#D8432B","#D9D2C0","#1E2F5C"],ct={x0:-40,x1:4,zS:124,zN:60,wallY:30,cx:-18,cy:19.7143,r:24.2857,bay:8},j={R:64,galIn:57,decks:[14,28,42],solidY:51,drumY:58,domeCy:23.5789,domeR:72.668,lanternR:6,lanternY:96,archHalf:34,archSpring:32},pt={x0:58,x1:282,z:56,r:56,cy:40,bay:16,gableX:280},xt={pivotY:98,len:86,bobR:5,bobT:1,amp:10.5*Math.PI/180,period:12},tt=Math.PI/180,st=Math.PI*2,et=t=>{const e=Number(t).toFixed(5);return e.indexOf(".")<0?e+".0":e},Dt=(t,e,z)=>{const s=Math.min(1,Math.max(0,(z-t)/(e-t)));return s*s*(3-2*s)},Jt=t=>11.5-1.5*Dt(50,120,t)+.5*Dt(225,262,t)-1.5*Dt(318,372,t)-1.5*Dt(392,430,t)+2.5*Dt(452,478,t),Bt=(t,e)=>(t>-18?2:0)+(e>90?1:0);function ft(t=!1){const e=[],z=[],s=[],r=[],a={P:e,N:z,C:s,X:r,M:null,aux:[0,0,0,0,0,0,0]},l=new F.Vector3,x=p=>a.M?(l.set(p[0],p[1],p[2]).applyMatrix4(a.M),[l.x,l.y,l.z]):p,S=(p,f,M)=>{e.push(p[0],p[1],p[2]),z.push(f[0],f[1],f[2]),s.push(M[0],M[1],M[2],M[3]??0)};return a.tri=(p,f,M,n)=>{const u=x(p),y=x(f),R=x(M),k=y[0]-u[0],o=y[1]-u[1],d=y[2]-u[2],c=R[0]-u[0],C=R[1]-u[1],g=R[2]-u[2];let h=[o*g-d*C,d*c-k*g,k*C-o*c];const i=Math.hypot(h[0],h[1],h[2])||1;h=[h[0]/i,h[1]/i,h[2]/i],S(u,h,n),S(y,h,n),S(R,h,n)},a.quad=(p,f,M,n,u)=>{a.tri(p,f,M,u),a.tri(p,M,n,u)},a.quadC=(p,f,M,n,u,y,R,k)=>{const o=x(p),d=x(f),c=x(M),C=x(n),g=d[0]-o[0],h=d[1]-o[1],i=d[2]-o[2],b=c[0]-o[0],q=c[1]-o[1],P=c[2]-o[2];let w=[h*P-i*q,i*b-g*P,g*q-h*b];const v=Math.hypot(w[0],w[1],w[2])||1;w=[w[0]/v,w[1]/v,w[2]/v],S(o,w,u),S(d,w,y),S(c,w,R),S(o,w,u),S(c,w,R),S(C,w,k)},a.pane=(p,f,M,n,u,y,R,k,o,d,c)=>{a.quad(p,f,M,n,c);for(const C of[u,y,R,u,R,k])r.push(C[0],C[1],o[0],o[1],o[2],o[3],d)},a.box=(p,f,M,n,u,y,R,k="")=>{const o=typeof R=="function"?R:()=>R;k.includes("x-")||a.quad([p,f,M],[p,f,y],[p,u,y],[p,u,M],o("x-")),k.includes("x+")||a.quad([n,f,M],[n,u,M],[n,u,y],[n,f,y],o("x+")),k.includes("y-")||a.quad([p,f,M],[n,f,M],[n,f,y],[p,f,y],o("y-")),k.includes("y+")||a.quad([p,u,M],[p,u,y],[n,u,y],[n,u,M],o("y+")),k.includes("z-")||a.quad([p,f,M],[p,u,M],[n,u,M],[n,f,M],o("z-")),k.includes("z+")||a.quad([p,f,y],[n,f,y],[n,u,y],[p,u,y],o("z+"))},a.lathe=(p,f,M,n=0,u=0,y=0,R=st)=>{for(let k=0;k<p.length-1;k++){const[o,d]=p[k],[c,C]=p[k+1],g=c-o,h=C-d,i=Math.hypot(g,h)||1,b=h/i,q=-g/i,P=typeof M=="function"?M(k):M;for(let w=0;w<f;w++){const v=y+(R-y)*w/f,m=y+(R-y)*(w+1)/f,T=Math.cos(v),A=Math.sin(v),I=Math.cos(m),N=Math.sin(m),Z=x([n+o*T,d,u+o*A]),L=x([n+o*I,d,u+o*N]),W=x([n+c*T,C,u+c*A]),_=x([n+c*I,C,u+c*N]);let Y=[b*T,q,b*A],$=[b*I,q,b*N];a.M&&(l.set(...Y).transformDirection(a.M),Y=[l.x,l.y,l.z],l.set(...$).transformDirection(a.M),$=[l.x,l.y,l.z]),o>1e-6&&(S(Z,Y,P),S(W,Y,P),S(L,$,P)),c>1e-6&&(S(L,$,P),S(W,Y,P),S(_,$,P))}}},a.bar=(p,f,M,n,u,y=!1)=>{const R=o=>{const d=p[o],c=p[Math.min(p.length-1,o+1)],C=p[Math.max(0,o-1)],g=new F.Vector3(c[0]-C[0],c[1]-C[1],c[2]-C[2]).normalize(),h=new F.Vector3(...f[o]).normalize(),i=new F.Vector3().crossVectors(g,h).normalize(),b=(q,P)=>[d[0]+h.x*q*M/2+i.x*P*n/2,d[1]+h.y*q*M/2+i.y*P*n/2,d[2]+h.z*q*M/2+i.z*P*n/2];return[b(-1,-1),b(1,-1),b(1,1),b(-1,1)]};let k=R(0);y&&a.quad(k[0],k[1],k[2],k[3],u);for(let o=1;o<p.length;o++){const d=R(o);for(let c=0;c<4;c++){const C=(c+1)%4;a.quad(k[c],k[C],d[C],d[c],u)}k=d}y&&a.quad(k[0],k[1],k[2],k[3],u)},Object.defineProperty(a,"triangles",{get:()=>e.length/9}),a.geometry=p=>p?(async()=>{const f=new F.BufferGeometry;for(const M of a.fill(f))M(),await p();return f})():(()=>{const f=new F.BufferGeometry;for(const M of a.fill(f))M();return f})(),a.fill=p=>[()=>p.setAttribute("position",new F.Float32BufferAttribute(e,3)),()=>p.setAttribute("normal",new F.Float32BufferAttribute(z,3)),()=>p.setAttribute("aCol",new F.Float32BufferAttribute(s,4)),()=>{t&&(p.setAttribute("aPane",new F.InterleavedBufferAttribute(new F.InterleavedBuffer(new Float32Array(r),7),2,0)),p.setAttribute("aPar",new F.InterleavedBufferAttribute(p.attributes.aPane.data,4,2)),p.setAttribute("aPk",new F.InterleavedBufferAttribute(p.attributes.aPane.data,1,6)))}],a}const t0=1-(1-.14/1.2)*(1-.14/1.2),Ft=Math.PI*pt.r/24,M0=qt*(1-(2*.8+t0*1.1)/16)*(1-.5/Ft)*(1-.07/1),Nt=`
float wHash3(vec3 p){ return fract(sin(dot(p, vec3(99.7, 287.9, 73.1))) * 46210.1010); }
float wHash1(float x){ return fract(sin(x * 97.0113) * 45210.3581); }
// value noise: a blend, with weights that sum to one, of values spread evenly over 0..1, so its mean is one half by
// its form. Counted in single precision: the three-number hash's mean over every whole-number point to 40 either way
// is 0.4987, the one-number hash's over the whole numbers -700 to 699 is 0.4989, and the noise's over 8,000,000 places
// at random (x, y in -30..30, z in 0..20) is 0.4983.
float wNoise3(vec3 p){
  vec3 i = floor(p), u = fract(p); u = u * u * (3.0 - 2.0 * u);
  return mix(mix(mix(wHash3(i), wHash3(i + vec3(1.0, 0.0, 0.0)), u.x), mix(wHash3(i + vec3(0.0, 1.0, 0.0)), wHash3(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
             mix(mix(wHash3(i + vec3(0.0, 0.0, 1.0)), wHash3(i + vec3(1.0, 0.0, 1.0)), u.x), mix(wHash3(i + vec3(0.0, 1.0, 1.0)), wHash3(i + vec3(1.0, 1.0, 1.0)), u.x), u.y), u.z);
}`,b0=(t,e,z)=>{const s=(t*.9+e*.44)*.024-z*.72,r=.5+.5*Math.sin(s+.8*Math.sin(s*.37+1.7));return Dt(.22,.62,r)},At=x0+`
uniform vec3 uBob; uniform vec2 uLook;       // uLook: (wind and cloud, rain), each 0 or 1
#ifndef TPT_UTIME
#define TPT_UTIME
uniform float uTime;
#endif

float tptOr(float a, float b){ return 1.0 - (1.0 - a) * (1.0 - b); }
float sunBandShape(vec3 p){
  float ph = (p.x * 0.9 + p.z * 0.44) * 0.024 - uTime * 0.72;
  return smoothstep(0.22, 0.62, 0.5 + 0.5 * sin(ph + 0.8 * sin(ph * 0.37 + 1.7)));
}
// the sky light: it rises as the sun fades (cloud look); under rain the water on the glass lays a soft moving shade,
// 13 per cent either way: a product of two sines, whose mean is 0, so the factor's mean is 1. In the passage (south
// of z 74, west of x 7.5; rising from z 62) it stands half as high again in the sun and cloud looks (1.50 x 0.253 =
// 0.380 in luminance; not under rain): a lift by rule, not by reckoning, because the route begins there and the
// brief asks that its first metres be the least dark.
float skyLift(vec3 p){
  float pass = 1.0 + 0.50 * uSun * smoothstep(62.0, 74.0, p.z) * step(p.x, 7.5);
  return (1.0 + 0.34 * uLook.x * (1.0 - sunBandShape(p))) * pass * (1.0 + 0.13 * uLook.y * sin(p.x * 0.8 + uTime * 1.9) * sin(p.z * 0.7 - p.y * 0.9 - uTime * 2.3));
}
// THE PASSAGE: the east wall (x 4, solid to y 30), then the vault: a cylinder of radius ${et(ct.r)} about (x -18, y ${et(ct.cy)}),
// ribs 0.8 m wide every 8 m from z 60, purlins 0.28 m wide every 4 m of arc from the crown, glazing bars 0.06 m every metre.
// Ribs and glazing bars run the same way and never overlap, so their covers are added; the purlins cross both.
float sunPassage(vec3 p, vec3 S, float fp){
  float t = (4.0 - p.x) / S.x;
  float lit = 1.0 - tptEdge(p.y + t * S.y - 30.0, fp + uTptPen * max(t, 0.0));
  vec2 o = vec2(p.x + 18.0, p.y - ${et(ct.cy)}), d = vec2(S.x, S.y);
  float a = dot(d, d), b = dot(o, d), c = dot(o, o) - ${et(ct.r*ct.r)};
  float tv = (-b + sqrt(max(b * b - a * c, 0.0))) / a;
  vec3 H = p + S * tv; float w = fp + uTptPen * max(tv, 0.0);
  float arc = atan(H.x + 18.0, max(H.y - ${et(ct.cy)}, 1e-3)) * ${et(ct.r)};
  float ribs = tptLines(H.z + 340.0, 8.0, 0.40, w);                        // 340 = 400 - 60: ribs on z = 60 + 8 k
  float purl = tptLines(arc + 400.0, 4.0, 0.14, w);
  float bars = tptLines(H.z + 400.5, 1.0, 0.03, w);
  return lit * ${et(qt)} * (1.0 - ribs - bars) * (1.0 - purl);
}
// where a gallery deck is: they stop at the piers of the four arches. In degrees round the court from east toward
// south: the east arch's piers at 50 either side of 0, the passage mouth's at 82 and 138, the west blind arch's at
// 180 -+ 11.5, the north blind arch's at 255.53 -+ 11.5 (GALLERY_ZONES in the plan)
float deckAt(vec2 q){
  float a = degrees(atan(q.y, q.x + step(abs(q.x) + abs(q.y), 1e-6) * 1e-4)); a += a < 0.0 ? 360.0 : 0.0;
  float on = step(50.0, a) * step(a, 82.0) + step(138.0, a) * step(a, 168.5) + step(191.5, a) * step(a, 244.03) + step(267.03, a) * step(a, 310.0);
  return min(on, 1.0);
}
float deckShade(vec3 p, vec3 S, float fp, float y){
  float t = (y - p.y) / S.y; if (t <= 0.0) return 0.0;
  vec2 q = p.xz + S.xz * t;
  return tptBox(length(q) - 60.5, 3.5, fp + uTptPen * t) * deckAt(q);
}
// THE COURT: the wall (radius 64, solid to y 51 but for the east arch), the glazed drum (y 51..58, a mullion 0.44 m wide
// every 1/96 of the round), the dome (a sphere of radius ${et(j.domeR)} about y ${et(j.domeCy)}: 24 ribs 0.7 m wide, rings 0.3 m wide
// every 6 m of meridian, the lantern's floor of radius 6 solid), the three gallery decks (radius 57..64), and the
// great bob, an ellipsoid of half axes 5, 5, 1, read in the measure that makes it a ball. The lantern's floor and the
// bob are rounds filtered by tptDisc, which keeps their area under any footprint.
float shedRoof(vec3 p, vec3 D, float fp, float pen);
float sunCourt(vec3 p, vec3 S, float fp){
  vec2 o = p.xz, d = S.xz; float a = dot(d, d), b = dot(o, d), c = dot(o, o) - 4096.0;
  float t = (-b + sqrt(max(b * b - a * c, 0.0))) / a;
  vec3 Q = p + S * t; float w = fp + uTptPen * max(t, 0.0);
  vec3 o3 = vec3(p.x, p.y - ${et(j.domeCy)}, p.z); float b3 = dot(o3, S), c3 = dot(o3, o3) - ${et(j.domeR*j.domeR)};
  float ts = -b3 + sqrt(max(b3 * b3 - c3, 0.0)); vec3 H = p + S * ts; float rh = max(length(H.xz), 1e-3), ws = fp + uTptPen * max(ts, 0.0);
  float ribs = tptLines((atan(H.z, H.x + step(abs(H.x) + abs(H.z), 1e-6) * 1e-4) + 3.14159265) * rh, rh * 0.2617994, 0.35, ws);
  float mer = ${et(j.domeR)} * acos(clamp((H.y - ${et(j.domeCy)}) / ${et(j.domeR)}, -1.0, 1.0));
  float rings = tptLines(mer, 6.0, 0.15, ws);
  float dome = ${et(qt)} * (1.0 - ribs) * (1.0 - rings) * (1.0 - tptDisc(rh, 6.0, ws));
  float drum = ${et(qt)} * (1.0 - tptLines((atan(Q.z, Q.x) + 3.14159265) * 64.0, 4.1887902, 0.22, w));
  float dA = Q.y < 32.0 ? abs(Q.z) - 34.0 : length(vec2(Q.z, Q.y - 32.0)) - 34.0;
  // through the east arch, then out by the shed's roof: its own ribs, purlins and glazing bars as the place's ray
  // meets them (it leaves above the springing, between the arch and the gable); under a wide pixel those sets of
  // bars tend by themselves to the typed mean above, ${et(M0)}
  float low = tptEdge(dA, w) * step(0.0, Q.x) * shedRoof(p, S, fp, uTptPen);
  float light = mix(low, mix(drum, dome, 1.0 - tptEdge(Q.y - 58.0, w)), 1.0 - tptEdge(Q.y - 51.0, w));
  light *= (1.0 - deckShade(p, S, fp, 14.0)) * (1.0 - deckShade(p, S, fp, 28.0)) * (1.0 - deckShade(p, S, fp, 42.0));
  vec3 ob = (uBob - p) * vec3(1.0, 1.0, 5.0), sb = S * vec3(1.0, 1.0, 5.0);
  float along = dot(ob, sb) / dot(sb, sb);
  float bob = step(0.0, along) * tptDisc(length(ob - sb * along), 5.0, 2.0 * (fp + uTptPen * max(along, 0.0)) + 1e-3);
  return light * (1.0 - bob);
}
// THE SHED: the ray is carried to the gable's plane (x 280). Inside the gable's outline (the half round of radius 56
// about y 40) it meets the great dial: the part's dial of light, which gives uTptGable outside the dial's circle;
// below y 6 the gable is a solid iron dado. Otherwise it leaves by the roof: ribs (see the head of this section),
// purlins, glazing bars up the slope; below the springing (y 40) the side wall stops it.
// the shed roof's passing share along any ray (D unit, pen metres of blur for each metre of ray)
float shedRoof(vec3 p, vec3 D, float fp, float pen){
  vec2 o = vec2(p.y - 40.0, p.z), d = vec2(D.y, D.z); float a = max(dot(d, d), 1e-5), b = dot(o, d), c = dot(o, o) - 3136.0;
  float tr = (-b + sqrt(max(b * b - a * c, 0.0))) / a; vec3 H = p + D * tr; float w = fp + pen * max(tr, 0.0);
  float X = H.x + 1542.0;                                                  // 1542 = 1600 - 58: ribs on x = 58 + 16 k
  float ribs = min(tptLines(X, 16.0, 0.40, w) + tptLines(X - 1.9, 16.0, 0.40, w) + ${et(t0)} * tptLines(X - 0.95, 16.0, 0.55, w), 1.0);
  float arc = atan(H.z, max(H.y - 40.0, 1e-3)) * 56.0 + ${et(100*Ft)};
  float purl = tptLines(arc, ${et(Ft)}, 0.25, w);
  float bars = tptLines(H.x + 1601.0, 1.0, 0.035, w);
  return ${et(qt)} * (1.0 - ribs) * (1.0 - purl) * (1.0 - bars) * (1.0 - tptEdge(H.y - 40.0, w));
}
float sunShed(vec3 p, vec3 S, float fp){
  float tg = (280.0 - p.x) / S.x; vec3 G = p + S * tg; float wg = fp + uTptPen * max(tg, 0.0);
  float inside = tptEdge(length(vec2(G.z, G.y - 40.0)) - 56.0, wg) * step(0.0, tg);
  float dado = tptEdge(G.y - 6.0, wg) * (1.0 - tptEdge(length(vec2(G.z, G.y - 44.0)) - 38.0, wg));
  float dial = tptDialLight(p, fp) * (1.0 - dado);
  return mix(shedRoof(p, S, fp, uTptPen), dial, inside);
}
float worldSun(vec3 wp, vec3 n, float fp){
  vec3 S = uTptSun; float f = max(fp, 1e-4), s;
  if (wp.x > 61.0) s = sunShed(wp, S, f);
  else if (wp.z > 61.5 && wp.x < 6.0) s = sunPassage(wp, S, f);
  else s = sunCourt(wp, S, f);
  return s * mix(1.0, 0.06 + 0.94 * sunBandShape(wp), uLook.x);
}
`,z0="mat4 tptMove(mat4 mm){ return mm; }",S0=`
attribute vec3 aSw;
#ifndef TPT_UTIME
#define TPT_UTIME
uniform float uTime;
#endif

mat4 tptMove(mat4 mm){
  float th = aSw.z * sin(6.2831853 * uTime / aSw.y + aSw.x), c = cos(th), s = sin(th);
  return mm * mat4(c, s, 0.0, 0.0, -s, c, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
}`,e0=`
attribute vec4 aSw; attribute vec3 aSw2;
#ifndef TPT_UTIME
#define TPT_UTIME
uniform float uTime;
#endif

// the swing about the chain's top: a turn by th about the level axis a = (cos az, 0, sin az), written out as the
// matrix  c I + s [a]x + (1 - c) a a^T
mat3 tptSwingRot(){
  float th = aSw2.y * sin(6.2831853 * uTime / aSw.w + aSw.z), c = cos(th), s = sin(th), k = 1.0 - c;
  vec3 a = vec3(cos(aSw2.z), 0.0, sin(aSw2.z));
  return mat3(c + a.x * a.x * k, a.z * s, a.x * a.z * k,   -a.z * s, c, a.x * s,   a.x * a.z * k, -a.x * s, c + a.z * a.z * k);
}`,o0=e0+`
mat4 tptMove(mat4 mm){
  float tw = 0.7853982 * sin(6.2831853 * uTime / aSw.y + aSw.x), c = cos(tw), s = sin(tw);
  mat3 R = tptSwingRot() * mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  mat3 m3 = R * mat3(mm);
  vec3 top = mm[3].xyz + vec3(0.0, aSw2.x, 0.0);
  // the bow stands 0.14 of the radius behind the dial's plane (watchGeometry): the dial and its case are set that
  // far before the chain's line, so the chain's foot ends in the bow (inside the ring of a near watch's bow; on
  // the top side of the flat bow of the middle and far weights, edge to edge) and the watch turns about its
  // chain
  return mat4(vec4(m3[0], 0.0), vec4(m3[1], 0.0), vec4(m3[2], 0.0), vec4(top + tptSwingRot() * vec3(0.0, -aSw2.x, 0.0) + m3[2] * 0.14, 1.0));
}`,k0=t=>`
attribute vec4 aCol;
varying vec4 vCol; varying vec3 vN; varying vec3 vW; varying vec3 vO;
#include <common>
#include <fog_pars_vertex>
${t}
void main(){
  #ifdef USE_INSTANCING
    mat4 mm = modelMatrix * instanceMatrix;
  #else
    mat4 mm = modelMatrix;
  #endif
  mm = tptMove(mm);
  vCol = aCol;
  #ifdef USE_INSTANCING_COLOR
    vCol.rgb *= instanceColor;
  #endif
  vN = mat3(mm) * normal;
  vec4 wp = mm * vec4(position, 1.0);
  vW = wp.xyz; vO = position * length(mm[0].xyz) + mm[3].xyz * 0.37;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ot=`
uniform vec3 uSkyCol; uniform vec3 uGroundCol; uniform vec3 uSunCol; uniform vec3 uSunDir; uniform float uSun;
`,$t=`
#define TPT_FILL
// where a place stands: x in the court's drum, y in the shed (which takes over where the drum's share ends), z in
// the passage (no two at once)
vec3 fillZone(vec3 p){
  float inC = 1.0 - smoothstep(64.5, 66.5, length(p.xz));
  float inS = step(54.0, p.x) * (1.0 - smoothstep(56.5, 58.0, abs(p.z))) * (1.0 - smoothstep(280.0, 282.0, p.x));
  float inP = step(61.5, p.z) * step(p.x, 7.5);
  return vec3(inC, (1.0 - inC) * inS, (1.0 - inC) * inP);
}
// the sunlit floor's bounce on an upright face there, as a share of the sun's colour
float fillBounce(vec3 p, vec3 zone){
  float low = 1.0 - 0.6 * clamp(p.y / 40.0, 0.0, 1.0);
  return dot(zone, vec3(0.10 * low, 0.115, 0.05)) * mix(1.0, 0.06 + 0.94 * sunBandShape(p), uLook.x);
}
vec3 tptFill(vec3 p, vec3 N){
  vec3 zone = fillZone(p);
  float turn = 1.0 - smoothstep(0.05, 0.55, dot(N, uSunDir));
  return (turn * uSun) * (uSkyCol * dot(zone, vec3(0.5, 0.5, 0.5)) + uSunCol * fillBounce(p, zone));
}
// the same floor as a gloss mirrors it: the floor's own brightness, twice its half on an upright face
vec3 fillFloor(vec3 p){ return uSunCol * (2.0 * uSun * fillBounce(p, fillZone(p))); }
`,P0=`
${Ot}
varying vec4 vCol; varying vec3 vN; varying vec3 vW; varying vec3 vO;
#include <common>
#include <fog_pars_fragment>
${Nt}
${At}
${$t}
void main(){
  vec3 N = vN / max(length(vN), 1e-6);
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  if (dot(N, V) < 0.0) N = -N;
  float fp = max(length(dFdx(vW)), length(dFdy(vW)));                  // the pixel's width on the surface, metres
  float toMean = 1.0 - smoothstep(0.4, 1.6, fp);
  vec3 alb = vCol.rgb * (1.0 + 0.16 * (wNoise3(vO / 1.6) - 0.5) * toMean);
  vec3 hemi = mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5) * skyLift(vW) + tptFill(vW, N);
  float sh = uSun * worldSun(vW, N, fp);
  vec3 col = alb * (hemi + uSunCol * (sh * max(dot(N, uSunDir), 0.0)));
  // gloss (brass in full, polished wood at 0.35, painted iron at 0.15): the surface mirrors the sky and, below, the ground
  // light with the sunlit floor of its place (fillFloor), and takes the sun's soft glint
  vec3 R = reflect(-V, N), Hs = uSunDir + V; Hs /= max(length(Hs), 1e-4);
  vec3 env = mix(uGroundCol + fillFloor(vW), uSkyCol, clamp(R.y * 0.7 + 0.5, 0.0, 1.0));
  float g = 1.0 - clamp(dot(N, V), 0.0, 1.0);
  col = mix(col, alb * env * 1.5, 0.55 * vCol.a) + vCol.a * (alb * uSunCol * (sh * 1.1 * pow(max(dot(N, Hs), 0.0), 28.0)) + uSkyCol * (0.10 * g * g * g));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Q={bars:24,barH:.15,ringT:6,ringH:.15,bars2:96,ringT2:2,h2:.035,bandR:40,bandH:2,latN:144,latRows:5,latH:.07};Q.latU=st*Q.bandR/Q.latN,Q.latK=Q.latRows*Q.latU/(4*Q.bandH),Q.latT=Q.latU*Math.SQRT1_2,Q.latHm=Q.latH*Math.hypot(1,Q.latK)*Math.SQRT1_2,Q.latCover=1-(1-2*Q.latHm/Q.latT)**2;const L0=`
attribute vec4 aCol; attribute vec2 aPane; attribute vec4 aPar; attribute float aPk;
varying vec4 vCol; varying vec3 vN; varying vec3 vW; varying vec2 vUV; varying vec4 vPar; varying float vPk;
#include <common>
#include <fog_pars_vertex>
void main(){
  vCol = aCol; vUV = aPane; vPar = aPar; vPk = aPk;
  vN = mat3(modelMatrix) * normal;
  vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,C0=`
${Ot}
uniform vec3 uGlassCol;        // the sheen of a pane: the sky it mirrors
varying vec4 vCol; varying vec3 vN; varying vec3 vW; varying vec2 vUV; varying vec4 vPar; varying float vPk;
#include <common>
#include <fog_pars_fragment>
${Nt}
${At}
${$t}
void main(){
  vec3 N = vN / max(length(vN), 1e-6);
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  if (dot(N, V) < 0.0) N = -N;
  // the east arch is cut out of the court's drum and dome where they cross it (the arch's own outline, exactly)
  if (vW.x > 30.0 && vW.x < 65.9 && abs(vW.z) < 34.0 && vW.y < 32.0 + sqrt(max(1156.0 - vW.z * vW.z, 0.0))) discard;
  float w = max(max(length(dFdx(vUV)), length(dFdy(vUV))), 1e-4);      // the pixel's width on the member, metres
  float fp = max(length(dFdx(vW)), length(dFdy(vW)));
  float cover, glass = 1.0;
  if (vPk < 0.5) {
    // glazing bars (0.12 m wide or less) are filtered over three pixels instead of one at every distance: the same
    // box mean over a wider footprint, so that a roof's bars go to the pane's faint tint a third as far off as
    // they would, and the ribs and purlins are its lines. Heavier members (the drum's mullions) keep the one-pixel footprint.
    float wb = w * (1.0 + 2.0 * step(vPar.y, 0.061));
    cover = tptOr(tptLines(vUV.x, vPar.x, vPar.y, wb), tptLines(vUV.y, vPar.z, vPar.w, wb));
  } else if (vPk < 1.5) {
    float off = 400.0 * vPar.x;
    cover = tptOr(tptLines((vUV.x + vUV.y) * 0.7071068 + off, vPar.x, vPar.y, w), tptLines((vUV.x - vUV.y) * 0.7071068 + off, vPar.x, vPar.y, w));
    glass = 0.0;
  } else if (vPk < 2.5) {
    cover = tptOr(tptLines(vUV.x, vPar.x, vPar.y, w), tptLines(vUV.y, vPar.z + vPar.w, 2.0 * vPar.w, w));
    glass = 0.0;
  } else {
    // radial members: the first order, and the second order's bars that no bar of the first hides (parallel sets
    // that never meet: their covers add). Rings the same. The second order is filtered over three pixels.
    float r = max(length(vUV), 1e-3), th = atan(vUV.x, vUV.y) + 3.14159265, arc = th * r, rr = r + 400.0 * vPar.z, w3 = 3.0 * w;
    float rad = min(tptLines(arc, r * 6.2831853 / vPar.x, vPar.y, w) + max(tptLines(arc, r * 6.2831853 / ${et(Q.bars2)}, ${et(Q.h2)}, w3) - tptLines(arc, r * 6.2831853 / vPar.x, ${et(Q.h2)}, w3), 0.0), 1.0);
    float rng = min(tptLines(rr, vPar.z, vPar.w, w) + max(tptLines(rr, ${et(Q.ringT2)}, ${et(Q.h2)}, w3) - tptLines(rr, vPar.z, ${et(Q.h2)}, w3), 0.0), 1.0);
    // the lattice band: two sets of diagonals in the band's own measure (the bearing times the mid radius, and the
    // height above the band's foot times latK); the pixel's width is carried into that measure across the bars
    float lu = th * ${et(Q.bandR)}, lv = (r - ${et(Q.bandR-Q.bandH)}) * ${et(Q.latK)} + ${et(400*Q.latU)};
    float wl = w * sqrt(${et(Q.bandR*Q.bandR/2)} / (r * r) + ${et(Q.latK*Q.latK/2)});
    float lat = tptOr(tptLines((lu + lv) * 0.7071068, ${et(Q.latT)}, ${et(Q.latHm)}, wl), tptLines((lv - lu) * 0.7071068, ${et(Q.latT)}, ${et(Q.latHm)}, wl));
    cover = tptOr(tptOr(rad, rng), tptBox(r - ${et(Q.bandR)}, ${et(Q.bandH)}, w) * lat);
  }
  float g = 1.0 - clamp(dot(N, V), 0.0, 1.0);
  float aG = 0.02 + 0.22 * g * g * g;
  vec3 glassCol = uGlassCol;
  if (uLook.y > 0.5) {
    float sheet = mix(0.5, wNoise3(vec3(vUV.x * 0.22, vUV.y * 0.10 + uTime * 0.55, 3.7)), 1.0 - smoothstep(1.125, 4.5, w));
    float ci = floor(vUV.x / 0.8), h1 = wHash1(ci), h2 = wHash1(ci + 17.3), h3 = wHash1(ci + 51.9);
    float xl = vUV.x - (ci + 0.5) * 0.8 - (h1 - 0.5) * 0.4 - 0.04 * sin(vUV.y * 1.7 + h2 * 40.0);
    float dash = 0.5 + 0.5 * sin(vUV.y * (0.9 + 0.6 * h2) + uTime * (2.2 + 1.5 * h3) + h1 * 6.2831853);
    float thread = mix(0.075, tptBox(xl, 0.06, w) * dash, 1.0 - smoothstep(0.2, 0.8, w));     // typed mean 0.075 (above)
    // (the sheet's shape is sharpened about its mean: smoothstep(0.3, 0.7, n) is odd about 0.5, as the noise is, so its mean stays 0.5)
    float sh = smoothstep(0.30, 0.70, sheet), aS = 0.55 * sh, aT = 0.9 * thread;
    vec3 pre = glassCol * aG + uGlassCol * (0.5 * aS);                 // sheen and sheet, colour times cover
    aG += aS;
    pre = pre * (1.0 - aT) + uGlassCol * (1.75 * aT);                  // the thread over both
    aG += (1.0 - aG) * aT;
    glassCol = pre / max(aG, 1e-4);
  }
  aG = clamp(aG, 0.0, 1.0) * glass;
  vec3 hemi = mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5) * skyLift(vW) + tptFill(vW, N);
  vec3 iron = vCol.rgb * (hemi + uSunCol * (uSun * worldSun(vW, N, fp) * max(dot(N, uSunDir), 0.0)));
  float alpha = cover + (1.0 - cover) * aG;
  gl_FragColor = vec4((iron * cover + glassCol * ((1.0 - cover) * aG)) / max(alpha, 1e-4), alpha);
  #include <fog_fragment>
}`,ce=[{brass:.144375,slate:.259844,black:.120313,cream:.475468},{brass:.144375,slate:.166602,black:.073877,cream:.615146}],q0=`
varying vec3 vW;
#include <common>
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,T0=(t,e)=>`
${Ot}
uniform vec3 uTile[4];          // cream, black, slate blue, brass
uniform vec3 uStone;            // the shed's limestone
uniform vec3 uOpalRef;          // the opal ring as the wet floor mirrors it
uniform vec3 uRedRef;           // the great hands' vermilion
uniform vec4 uPosts[16];        // the post clocks: foot x, foot z, the head's centre height, the head's half width
varying vec3 vW;
#include <common>
#include <fog_pars_fragment>
${Nt}
${m0}
${At}
void main(){
  vec3 V = cameraPosition - vW; float dist = max(length(V), 1e-3); V /= dist;
  vec3 N = vec3(0.0, 1.0, 0.0);
  float fp = max(max(length(dFdx(vW.xz)), length(dFdy(vW.xz))), 1e-4);     // the pixel's width on the floor, metres
  vec3 alb; float gloss = 0.0;
#if ${t} == 0
  vec2 c = mod(vW.xz, 4.0) - 2.0, ac = abs(c);
  // a dark cell's panel (cells counted from x, z = -400: dark where one count is even and the other odd), and that
  // turn at the pixel's own centre for the middle figure
  float panel = tptLines(vW.x + 398.0, 8.0, 1.6, fp) * tptLines(vW.z + 394.0, 8.0, 1.6, fp) + tptLines(vW.x + 394.0, 8.0, 1.6, fp) * tptLines(vW.z + 398.0, 8.0, 1.6, fp);
  float turn = mod(floor(vW.x * 0.25) + floor(vW.z * 0.25), 2.0);
  float mid, black;
  #if ${e} == 0
    float wd = min(fp, 1.1), wb = min(fp, 0.6);
    mid = tptEdge((ac.x + ac.y - 1.2) * 0.7071068, wd) * (2.88 / (2.88 + wd * wd / 3.0));
    black = tptBox((ac.x + ac.y - 1.375) * 0.7071068, 0.1237437, wb);
    vec3 mean = uTile[0] * 0.475468 + uTile[2] * 0.259844 + uTile[1] * 0.120313 + uTile[3] * 0.144375;      // typed means above
    float toMean = 1.0 - smoothstep(0.6, 3.0, fp);
  #else
    float r = length(c), wd = min(fp, 1.5);
    mid = tptDisc(r, 0.9, wd);
    black = tptBox(r - 1.075, 0.175, wd);
    mid *= turn; black *= turn;          // the roundel and its ring lie in the dark cells alone
    vec3 mean = uTile[0] * 0.615146 + uTile[2] * 0.166602 + uTile[1] * 0.073877 + uTile[3] * 0.144375;      // typed means above
    float toMean = 1.0 - smoothstep(1.0, 3.0, fp);
  #endif
  // slate: the panel less the middle figure and its band in a dark cell; in a light one the middle figure alone
  // (figure 0: figure 1 has none there)
  float slate = max(panel + mid * (1.0 - 2.0 * turn) - black * turn, 0.0);
  float strip = tptOr(tptLines(vW.x + 400.0, 4.0, 0.15, fp), tptLines(vW.z + 400.0, 4.0, 0.15, fp));
  vec3 pat = uTile[0] * max(1.0 - slate - black - strip, 0.0) + uTile[1] * black + uTile[2] * slate + uTile[3] * strip;
  alb = mix(mean, pat, toMean);
  float joint = tptOr(tptLines(vW.x + 400.5, 1.0, 0.007, fp), tptLines(vW.z + 400.5, 1.0, 0.007, fp));
  alb *= 1.0 - 0.5 * joint;
  // the gloss follows the strips' own filtered cover, so under any footprint its mean over a cell is its own (0.572187)
  gloss = 0.5 + 0.5 * strip;
#elif ${t} == 1
  // the inlaid dial: the part's face law, kind 3, the face disc 50 m in radius (the law's face radius is 0.88), twelve to the north
  float k = 50.0 / 0.88; vec2 q = vec2(vW.x, -vW.z) / k; float r = length(vW.xz);
  vec3 cov = tptFaceCov(q, fp / k, 1.0);
  float ang = atan(vW.z, vW.x + step(r, 1e-6) * 1e-4) + 3.14159265, rs = max(r, 1e-3);
  // THE DIAL'S OWN FIGURE in the strokes' colour, laid between the dial's parts so that every cover adds:
  //   a chequer course between the minute track and the face's edge, radius 48.19..50: dark blocks 3 degrees wide
  //   on the sixty minute lines, as much marble between them: half of pi (50^2 - 48.19^2) = 279.17 m2, 0.035545 of
  //   the face disc (7853.98 m2)
  //   a dark ring, radius 28..29.6, between the hour hand's point (23.9) and the quarter strokes (from 30.7):
  //   pi (29.6^2 - 28^2) = 289.53 m2, 0.036864 of the face disc; the minute hand lies over it
  // Both are box means for any pixel (a band across the radius, a set of bars round it), so they need no typed figure.
  float chq = tptBox(r - 49.095, 0.905, fp) * tptLines(ang * r, rs * 0.10471976, r * 0.02617994, fp);
  float ring = tptBox(r - 28.8, 0.8, fp) * (1.0 - tptHandMinute(q, fp / k));
  // round it: a brass ring 50..50.6, then to the brass strip at 57 a border of slabs 7.5 degrees wide, slate (the
  // passage's own, uTile[2]) on the gallery columns' lines and grey marble between them, a joint at every slab's edge
  float brass = min(tptBox(r - 50.3, 0.3, fp) + tptBox(r - 57.0, 0.06, fp), 1.0);
  float slab = tptBox(r - 53.77, 3.17, fp) * tptLines(ang * r, rs * 0.2617994, r * 0.0654498, fp);
  float jn = tptLines(ang * r + r * 0.0654498, rs * 0.1308997, 0.02, fp);
  vec3 border = mix(mix(uTptFaceCol[3] * vec3(0.80, 0.84, 0.90), uTile[2], slab) * (1.0 - 0.5 * jn), uTptHandCol[3], brass);
  float inside = tptEdge(r - 50.0, fp);
  alb = mix(border, uTptFaceCol[3], inside) + (uTptStrokeCol[3] - uTptFaceCol[3]) * ((cov.x + cov.y) * inside + chq + ring)
    + (uTptHandCol[3] - uTptFaceCol[3]) * (cov.z * inside);
  // veining: period 3 m, 7 per cent either way, mean 1
  alb *= 1.0 + 0.14 * (wNoise3(vec3(vW.xz / 3.0, 2.3)) - 0.5) * (1.0 - smoothstep(0.75, 3.0, fp));
  gloss = 0.45 + 0.5 * mix(brass, cov.z, inside);
#else
  // limestone flags 4 m by 2.667 m in running bond; a flag's tone is 5 per cent either way about 1 (a hash spread
  // evenly over 0..1, mean 0.5); joints 0.024 m; brass strips 0.10 m wide on the pier lines and every 16 m across
  float row = floor(vW.z / 2.6667), fx = vW.x + 2.0 * mod(row, 2.0), id = floor(fx / 4.0);
  float tone = 1.0 + 0.10 * (wHash3(vec3(id, row, 1.0)) - 0.5) * (1.0 - smoothstep(1.0, 4.0, fp));
  float joint = tptOr(tptLines(fx + 400.0, 4.0, 0.012, fp), tptLines(vW.z + 266.67, 2.6667, 0.012, fp));
  float strip = tptOr(tptLines(vW.x + 1542.0, 16.0, 0.05, fp), tptLines(vW.z + 400.0, 16.0, 0.05, fp));
  // a course of darker stone 1.33 m wide (the black tile's tone brought 0.45 of the way to the flag's) under every
  // rib line (x = 58 + 16 k) and along z = -16 and z = 16, the brass strips of those lines down its middle: bands and
  // a set of bars, each its box mean for any pixel
  float course = tptOr(tptLines(vW.x + 1542.0, 16.0, 0.665, fp), min(tptBox(vW.z - 16.0, 0.665, fp) + tptBox(vW.z + 16.0, 0.665, fp), 1.0));
  alb = mix(mix(uStone * tone, mix(uTile[1], uStone, 0.45), course) * (1.0 - 0.45 * joint), uTile[3], strip);
  gloss = 0.25 + 0.6 * strip;
#endif
  // CONTACT DARKENING, closed forms of the plan: what stands on a floor hides part of the sky from it at its foot.
  // ao is the share of sky light left; each term fades to nothing within a few metres.
  float ao = 1.0;
#if ${t} == 0
  // the shop fronts' risers along both walls (x -40 and x 4, standing 0.5 m proud)
  ao = 1.0 - 0.45 * (1.0 - smoothstep(0.5, 3.6, min(vW.x + 40.0, 4.0 - vW.x)));
#elif ${t} == 1
  // the ranks' plinths (from radius 62.2) and the gallery columns (radius 57.75, on every 15 degrees), where galleries stand
  float rr = length(vW.xz), onDeck = deckAt(vW.xz);
  float aDeg = degrees(atan(vW.z, vW.x + step(rr, 1e-6) * 1e-4)), dCol = length(vec2((aDeg - 15.0 * floor(aDeg / 15.0 + 0.5)) * 0.0174533 * rr, rr - 57.75));
  ao = 1.0 - onDeck * max(0.5 * smoothstep(58.2, 62.0, rr), 0.5 * (1.0 - smoothstep(0.5, 2.6, dCol)));
#else
  // the side walls' dado and what stands along it (benches, crates, regulators: one to a bay, about its middle)
  float wd = 56.0 - abs(vW.z), bx = mod(vW.x - 58.0, 16.0) - 8.5;
  ao = 1.0 - max(0.4 * (1.0 - smoothstep(0.3, 3.0, wd)), 0.5 * (1.0 - smoothstep(0.6, 1.0, length(vec2(bx / 6.5, (wd - 5.5) / 3.4)))));
  ao *= 1.0 - 0.4 * (1.0 - smoothstep(0.3, 3.0, 280.0 - vW.x));        // the east gable's dado
#endif
  vec3 hemi = uSkyCol * skyLift(vW);
  float sh = uSun * worldSun(vW, N, fp);
#if ${t} == 2
  // the post clocks' own shadows, a closed form too: the floor's ray toward the sun passes each post's axis at a
  // level distance dAx and a height hAt; the post is a column of radius 0.6 up to its head and a head of half width
  // uPosts.w and half height 2.6 (its roof and finial are left out). A band's box integral, softened by the sun's width.
  vec2 sdir = uTptSun.xz / max(length(uTptSun.xz), 1e-4); float rise = uTptSun.y / max(length(uTptSun.xz), 1e-4), postShade = 0.0;
  for (int i = 0; i < 16; i++) {
    vec2 rel = uPosts[i].xy - vW.xz; float along = dot(rel, sdir);
    if (along > 0.0) {
      float dAx = abs(rel.x * sdir.y - rel.y * sdir.x), hAt = along * rise, wAt = fp + uTptPen * along * 1.42;
      float rad = hAt < uPosts[i].z - 2.6 ? 0.6 : uPosts[i].w;
      postShade = max(postShade, tptBox(dAx, rad, wAt) * tptEdge(hAt - (uPosts[i].z + 2.6), wAt));
    }
    ao *= 1.0 - 0.55 * (1.0 - smoothstep(1.7, 4.4, length(rel)));       // the post's foot (radius 1.95)
  }
  sh *= 1.0 - postShade;
#endif
  // the foot's own shadow goes with it where the sun falls: six tenths of the darkening
  vec3 col = alb * (hemi * ao + uSunCol * (sh * uSunDir.y * mix(1.0, ao, 0.6)));
  // a polished floor mirrors the sky faintly toward the grazing eye, and the sun where it is lit
  float g = 1.0 - clamp(V.y, 0.0, 1.0), fres = 0.03 + 0.5 * g * g * g * g * g;
  vec3 Hs = uSunDir + V; Hs /= max(length(Hs), 1e-4);
  col += gloss * (uSkyCol * fres * 0.6 + uSunCol * sh * 0.25 * pow(max(Hs.y, 0.0), 60.0));
#if ${t} == 2
  if (uLook.y > 0.5) {
    // THE WET FLOOR mirrors the roof and the great dial: the eye's ray, turned in the floor and stirred a little by
    // the falling water, is carried to the gable's plane and reads the same dial law as the dial of light (the two
    // hands at their present angles); elsewhere it reads the roof.
    vec3 Rr = vec3(-V.x, V.y, -V.z);
    Rr.xz += 0.035 * (vec2(wNoise3(vec3(vW.xz * 0.7, uTime * 0.8)), wNoise3(vec3(vW.zx * 0.7 + 9.0, uTime * 0.8))) - 0.5) * (1.0 - smoothstep(0.35, 1.4, fp));
    Rr /= max(length(Rr), 1e-4);
    float tg = (280.0 - vW.x) / max(Rr.x, 1e-3), wq = fp * (1.0 + tg / dist) + 0.012 * tg;
    vec3 Gp = vW + Rr * tg; vec2 qd = vec2(Gp.z, Gp.y - 44.0);
    // gable, dial and hands are mirrored only where the turned ray heads east toward the gable's plane; as the ray
    // turns along that plane its meeting place runs off beyond the gable's round, so the mirror reads the roof there
    // before the step falls
    float inG = tptEdge(length(vec2(Gp.z, Gp.y - 40.0)) - 56.0, wq) * step(0.0, Rr.x);
    // (the turned ray drifts -qh across the dial for each metre before the glass and begins depF before it: the
    // boss is read through its depth, and each hand with its collar where the ray meets the hand's own plane, 2.4
    // and 1.3 m before the glass, if the ray begins beyond that plane and less what the boss, between its mouth and
    // that plane, hides of it from the turned eye)
    vec2 qh = Rr.zy / max(Rr.x, 1e-3); float depF = 280.0 - vW.x;
    float pass = tptDialGlass(qd, -qh, depF, wq);
    float hands = tptOr(tptGreatMinute(qd - qh * ${et(wt.minute.z)}, uTptHands.x, wq) * tptEdge(${et(wt.minute.z)} - depF, wq) * (1.0 - tptBossBefore(qd, -qh, ${et(wt.minute.z)}, depF, wq)),
      tptGreatHour(qd - qh * ${et(wt.hour.z)}, uTptHands.y, wq) * tptEdge(${et(wt.hour.z)} - depF, wq) * (1.0 - tptBossBefore(qd, -qh, ${et(wt.hour.z)}, depF, wq)));
    vec3 skyRef = vec3(0.40, 0.44, 0.51);                                 // the rain sky's own mean tone (silver and blue-grey in equal parts, lightened a little toward the rim)
    // the sky is read through the glass's passing share less the opal ring's; the opal's own tone lies on the
    // opal's cover, twice its passing share, under the same footprint
    float ol = tptOpalLight(qd, wq);
    vec3 seen = skyRef * max(pass - ol, 0.0) + uOpalRef * (2.0 * ol);
    seen = mix(seen, uRedRef, hands);
    // the roof's passing share; where the turned ray leaves under the springing it meets the glazed side walls, whose
    // iron and clocks let about a third of the sky through
    vec3 roof = skyRef * (0.34 + 0.66 * shedRoof(vW, Rr, fp, 0.012 + fp / dist));
    vec3 refl = mix(roof, seen, inG);
    float fw = 0.5 + 0.5 * g * g;                                         // a wet polished floor: a strong mirror at every angle of the flight
    col = col * 0.6 * (1.0 - fw) + refl * fw;
  }
#endif
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,D0=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,A0={sun:[.1431,.262,[0,0,.001,.0022,.0032,.0043,.0045,.0055,.0083,.0113,.0133,.0141,.0142,.0147,.0182,.0247,.0334,.0438,.055,.0663,.0769,.0854,.0909,.0933,.0938,.0938]],cloud:[.3662,.547,[0,0,3e-4,5e-4,8e-4,.0011,.0011,.0014,.0021,.003,.0035,.0037,.0037,.0038,.0049,.0068,.0093,.0123,.0153,.018,.02,.0212,.0217,.0219,.022,.022]]},R0=t=>`#define SKY_MEAN ${t[0].toFixed(4)}
#define SKY_TONE ${t[1].toFixed(3)}
const float SKY_SHIFT[26] = float[26](${t[2].map(e=>e.toFixed(4)).join(", ")});
`,I0=`
uniform float uTime; uniform vec3 uZen; uniform vec3 uHor; uniform vec3 uMist; uniform vec3 uMistSh; uniform vec3 uBand;
uniform vec4 uCl; uniform float uClEdge; uniform vec3 uSunDir;   // uCl: cloud scale, threshold, speed, rain (0 or 1); uClEdge: the softness of a cloud's edge
varying vec3 vDir;
${Nt}
// four octaves of value noise (each of mean 0.5) with weights that sum to one: mean 0.5. w is the pixel's width in the
// noise's own units: an octave whose period falls from four pixels to two goes to its mean, so the sum keeps its mean
// under any pixel and nothing finer than the pixel is drawn.
float skyFbm(vec3 p, float w){
  return 0.5 * mix(0.5, wNoise3(p), 1.0 - smoothstep(0.25, 0.5, w))
    + 0.25 * mix(0.5, wNoise3(p * 2.03 + 7.1), 1.0 - smoothstep(0.25, 0.5, w * 2.03))
    + 0.125 * mix(0.5, wNoise3(p * 4.1 + 3.3), 1.0 - smoothstep(0.25, 0.5, w * 4.1))
    + 0.125 * mix(0.5, wNoise3(p * 8.3 + 1.7), 1.0 - smoothstep(0.25, 0.5, w * 8.3));
}
// THE COVER KEEPS ITS MEAN under any pixel: its threshold is lowered by the typed shift at the pixel's width
// (skyShift: the table of CLOUDS, straight between its knots), so the clouds do not thin away toward the horizon;
// from a width of 0.36 to 0.44, where the noise is all but flat and the least error of a shift would tell, the cover
// goes over to its typed mean itself.
// THE TONE within a cloud is taken from the same lowered threshold, and from a width of 0.09 to 0.42 it goes to its
// typed mean (the cover's own weighting), so that the light of the clouds is kept as well.
float skyShift(float w){
  float t = min(w / 0.02, 24.999); int i = int(floor(t));
  return mix(SKY_SHIFT[i], SKY_SHIFT[i + 1], t - floor(t));
}
float skyCover(float cl, float w){
  float a = uCl.y - skyShift(w);
  return mix(SKY_MEAN, smoothstep(a, a + uClEdge, cl), 1.0 - smoothstep(0.36, 0.44, w));
}
float skyTone(float cl, float w){
  float a = uCl.y - skyShift(w);
  return mix(SKY_TONE, smoothstep(a, a + 0.30, cl), 1.0 - smoothstep(0.09, 0.42, w));
}
void main(){
  vec3 d = vDir / max(length(vDir), 1e-4); float h = d.y;
  // the clear sky: a full light blue overhead, a little lighter low down; its pale lies in the band along the
  // horizon (below), so that white enamel and the cloud tops stand lighter than the sky behind them
  vec3 col = mix(uHor, uZen, pow(clamp(h, 0.0, 1.0), 0.60));
  // clouds on a level sheet far above, drifting by the clock
  vec2 q = d.xz / max(h + 0.10, 0.03) * uCl.x + vec2(uTime * 0.030, uTime * 0.010) * uCl.z;
  float wq = max(length(dFdx(q)), length(dFdy(q)));
  float cl = skyFbm(vec3(q, uTime * 0.006 * uCl.z), wq);
  float m = skyCover(cl, wq) * smoothstep(-0.01, 0.10, h);
  vec3 cc = mix(vec3(0.74, 0.82, 0.96), vec3(1.25, 1.22, 1.15), skyTone(cl, wq));
  col = mix(col, cc, m * 0.94);
  // the rain's lower sheet: its place and its pixel's width are taken here, before the branch on the look
  vec2 q2 = d.xz / max(h + 0.16, 0.05) * 2.7 + vec2(uTime * 0.085, -uTime * 0.034);
  float wq2 = max(length(dFdx(q2)), length(dFdy(q2)));
  if (uCl.w > 0.5) {
    // RAIN: low cloud from rim to rim. Two sheets drift across each other by the clock, the lower one finer and
    // quicker; where they swell the cloud is silver, in their hollows blue-grey, and toward the horizon the whole
    // lightens. In luminance its brightest silver is 0.54 and the band along the horizon 0.69; a standing white
    // dial in this light is 0.63 (0.54 to 0.71 as the rain's ripple passes over it), an ivory one 0.51.
    float c2 = skyFbm(vec3(q2, 5.0 + uTime * 0.02), wq2);
    float low = smoothstep(0.36, 0.64, 0.6 * cl + 0.4 * c2);
    vec3 rc = mix(vec3(0.20, 0.25, 0.33), vec3(0.50, 0.54, 0.60), low);
    col = mix(rc, uBand, 0.9 * pow(1.0 - clamp(h, 0.0, 1.0), 5.0));
  }
  // below the horizon a level floor of mist far under the eye: soft billows, each white on its side toward the sun
  // and blue in the shadow on its side away (the difference of the billows' height one step toward the sun), deeper
  // in the hollows; toward the horizon it thins into one bright band of light that lies along the horizon itself,
  // narrow under the sun and broad under rain
  vec2 P = d.xz / max(0.08 - h, 0.03) * 1.5 + vec2(uTime * 0.011, uTime * 0.006);
  float wP = max(length(dFdx(P)), length(dFdy(P)));
  vec2 sd = uSunDir.xz / max(length(uSunDir.xz), 1e-4);
  float b0 = skyFbm(vec3(P, 1.0 + uTime * 0.005), wP), b1 = skyFbm(vec3(P + sd * 0.24, 1.0 + uTime * 0.005), wP);
  float tone = clamp(0.5 + 6.0 * (b0 - b1) + 1.8 * (b0 - 0.5), 0.0, 1.0);          // 0.5 where the billows go to their mean
  vec3 mcol = mix(uMistSh, uMist, tone);
  col = mix(col, mcol, 1.0 - smoothstep(-0.05, 0.035, h));
  col = mix(col, uBand, mix(0.55, 0.88, uCl.w) * exp(-abs(h + 0.01) / mix(0.018, 0.045, uCl.w)));
  gl_FragColor = vec4(col, 1.0);
}`,E0=`
attribute vec4 aSeed;                              // three phases and the speck's size in metres
uniform float uPxH; uniform float uSun; uniform vec3 uSunCol;
varying vec3 vCol;
${At}
void main(){
  vec3 p = position;
  p.x += 0.9 * sin(uTime * 0.11 + aSeed.x * 6.2831853);
  p.y += 0.7 * sin(uTime * 0.07 + aSeed.y * 6.2831853);
  p.z += 0.9 * cos(uTime * 0.09 + aSeed.z * 6.2831853);
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = max(-mv.z, 0.1);
  float px = aSeed.w * projectionMatrix[1][1] * uPxH * 0.5 / d;        // the speck's true width in pixels
  // THE LAW: a speck has one true width in metres, as dealt, and one true brightness. Its drawn width is the greater
  // of one pixel and its true width in pixels; its light is its brightness times its true area over its drawn area.
  // No cap, no floor and no other term in the distance stands here. The speck is taken as a square of its own width.
  float drawn = max(px, 1.0);
  gl_PointSize = drawn;
  // lit by the sun alone, through the same closed forms as every surface: a speck in shade is not drawn
  vCol = uSunCol * (uSun * worldSun(p, vec3(0.0, 1.0, 0.0), 0.5) * 0.6 * px * px / (drawn * drawn));
}`,H0=`
varying vec3 vCol;
void main(){
  gl_FragColor = vec4(vCol, 1.0);
}`,W0=`
attribute vec3 aTop; attribute float aLen;
uniform float uPxH; uniform float uSun; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uGroundCol; uniform vec3 uBrass;
varying vec4 vCol; varying vec3 vS;
#include <common>
#include <fog_pars_vertex>
${e0}
${At}
void main(){
  vec3 down = tptSwingRot() * vec3(0.0, -1.0, 0.0);
  vec3 c = aTop + down * (position.y * aLen);
  vec3 toEye = cameraPosition - c; float d = max(length(toEye), 0.1);
  vec3 side = cross(down, toEye); side /= max(length(side), 1e-4);
  float pix = d * 2.0 / (projectionMatrix[1][1] * uPxH);             // one pixel's width at that distance, metres
  float halfW = max(0.03, 0.5 * pix);
  vec3 lit = mix(uGroundCol, uSkyCol, 0.5) + uSunCol * (uSun * worldSun(c, vec3(-1.0, 0.0, 0.0), 0.3) * 0.5);
  c += side * (position.x * halfW);
  vCol = vec4(uBrass * lit, 0.03 / halfW);
  vS = vec3(position.y * aLen, pix, position.x);
  vec4 mvPosition = viewMatrix * vec4(c, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,F0=`
varying vec4 vCol; varying vec3 vS;
#include <common>
#include <fog_pars_fragment>
void main(){
  float t = vS.x / 0.16, flat_ = step(fract(t), 0.5), q = fract(t * 2.0) * 2.0 - 1.0, r = length(vec2(vS.z, q));
  float links = mix(step(abs(vS.z), 0.4), step(0.3, r) * step(r, 1.0), flat_);
  float toMean = smoothstep(0.02, 0.08, vS.y);
  float cover = mix(links, 0.5574, toMean);                             // typed mean (above)
  // a flat link is the lighter. TYPED MEAN of the shade, weighted by cover (the halves of the period cover 0.4 and
  // 0.7147): (0.4 x 0.8 + 0.7147 x 1.15) / (0.4 + 0.7147) = 1.0244
  float shade = mix(mix(0.8, 1.15, flat_), 1.0244, toMean);
  gl_FragColor = vec4(vCol.rgb * shade, vCol.a * cover);
  #include <fog_fragment>
}`,St=[],It=[],dt=(t,e=1,z=0)=>{const s=new F.Color(t);return[s.r*e,s.g*e,s.b*e,z]},nt=(t,e,z=t[3])=>[t[0]*e,t[1]*e,t[2]*e,z],H=(t,e,z)=>new F.Vector3(t,e,z);async function N0(t){const e=t.rng,z=t.quality?.detail??1,s=t.vary?.mood??.6,a=(t.vary?.hour??"any")==="day"?"sun":s<.3?"rain":s<.52?"cloud":"sun",l=e.pick(["green","prussian","graphite"]),x=e()<.5?0:1,S=e()<.5?0:1,p=e.pick([["#553623","#7A5236"],["#75583A","#94754E"],["#3E2C22","#5F4433"]]),f=!!t.vary?.rare,M=Math.min(1,Math.max(.7,t.vary?.density??1)),n=new F.Scene,u=p0(y0),y=u.length;let R=0;for(let E=0;E<480;E++)R+=y/480/Jt((E+.5)/480*y);const k=y/R;await t.yield();const o=await g0(t,{palette:zt,look:a,iron:l,sunDir:Tt});o.object.position.set(pt.gableX,6,0),o.object.rotation.y=-Math.PI/2,n.add(o.object),o.syncLight(),await t.yield();const d=a==="rain",c={uSkyCol:{value:d?H(1,1.05,1.13):H(.19,.255,.42)},uGroundCol:{value:d?H(.6,.63,.69):H(.19,.21,.25)},uSunCol:{value:H(1.65,1.4,.89)},uSunDir:{value:H(...Tt).normalize()},uSun:{value:d?0:1},uGlassCol:{value:d?H(.62,.66,.73):H(.62,.76,.98)},uTime:{value:0},uBob:{value:H(0,xt.pivotY-xt.len,0)},uLook:{value:new F.Vector2(a==="cloud"?1:0,d?1:0)},uPxH:{value:450},...o.lightUniforms},C=d?new F.Color(.5,.54,.6):new F.Color(.4,.58,.92);n.fog=new F.FogExp2(C,.0023);const g=()=>F.UniformsUtils.merge([F.UniformsLib.fog]),h={palette:zt,sunGLSL:At+$t+`
#define TPT_SKY_LIFT
float tptSkyLift(vec3 p){ return skyLift(p); }
`,sunUniforms:{...o.lightUniforms,uTime:c.uTime,uBob:c.uBob,uLook:c.uLook}},i=Qt(t,h),b=Qt(t,{...h,moveGLSL:o0});for(const E of[i,b])E.uniforms.uSkyCol.value.copy(c.uSkyCol.value),E.uniforms.uGroundCol.value.copy(c.uGroundCol.value),E.uniforms.uSunCol.value.copy(c.uSunCol.value),E.uniforms.uSunDir.value.copy(c.uSunDir.value),E.uniforms.uSun.value=c.uSun.value,E.uniforms.uTptFaceCol.value[3].set(.7,.69,.65);o.uniforms.uSkyCol.value.set(...d?[.66,.69,.74]:[.6,.72,.96]),o.uniforms.uGroundCol.value.set(...d?[.38,.4,.43]:[.4,.42,.47]),o.uniforms.uSunCol.value.copy(c.uSunCol.value),o.uniforms.uOpalGlow.value=d?1.7:1.5;const q=dt(w0[l]||zt[2],d?.65:1.15),P=.2126*q[0]+.7152*q[1]+.0722*q[2],w=q.map((E,G)=>G<3?E+(P-E)*.25:.15),v=E=>.2126*E[0]+.7152*E[1]+.0722*E[2],m=(E,G)=>nt(E,G/v(E)),T=E=>{const G=Math.max(E[1],.63*E[0]),X=[E[0],G,Math.min(E[2],.45*G),E[3]];return nt(X,v(E)/v(X))},A=T(dt(p[1],1,.35)),I=T(dt(p[0],1,.35)),N=(E,G)=>nt(E,Math.max(1,G/v(E))),Z=dt("#C9913F"),L=N(A.map((E,G)=>G<3?E+(Z[G]-E)*.6:E),.3),W=dt("#C4A97A",1,.35),_={iron:nt(w,1),ironL:nt(w,1.45),ironD:nt(w,.8),black:dt(zt[1],1.2),brass:dt(zt[3],.95,1),brassD:dt(zt[3],.62,1),white:dt("#EFEBDD",.76),wall:dt("#F0E4C8",.8),cream:dt("#E4DCC6",.76),stone:dt("#D9D2C0",.72),shade:dt("#9AA3AE",.55),woodD:I,woodL:A,woodB:N(A,.15),woodF:N(nt(A,1.25),.19),steel:dt(zt[7]),dark:dt("#566370"),caseD:N(I,.15),caseL:N(A,.19),caseWoods:[m(I,.105),m(A,.125),L,W],longWoods:[m(I,.11),m(A,.15),L,nt(W,.85)]},Y=E=>new F.ShaderMaterial({uniforms:{...g(),...c},vertexShader:k0(E),fragmentShader:P0,fog:!0,side:F.DoubleSide}),$={ctx:t,rng:e,detail:z,look:a,rain:d,rare:f,density:M,iron:l,enamel:x,tileFig:S,scene:n,path:u,L:y,meanSpeed:k,hero:o,ENV:c,fogU:g,kit:i,kitW:b,col:_,mat:{solid:Y(z0),pend:Y(S0),watch:Y(o0),pane:new F.ShaderMaterial({uniforms:{...g(),...c},vertexShader:L0,fragmentShader:C0,fog:!0,side:F.DoubleSide,transparent:!0,depthWrite:!1})},w:{pas:ft(),crt:ft(),crt2:ft(),shd:ft(),shdE:ft(),wm:ft(),wa:ft(),ws:ft(),panePas:ft(!0),paneCrt:ft(!0),paneShd:ft(!0)},dials:{near:{},middle:{},far:{}},wdials:{near:[],middle:[],far:[]},count:{},moving:{},air:{},sight:{},updaters:[],late:[],trash:new Set,tris:0,calls:0};$.planDist=(E,G)=>u.nearestXZ(E,G).dist;const V=new F.Matrix4,O=new F.Vector3,U=new F.Vector3,K=new F.Vector3;return $.dialMatrix=(E,G,X,J)=>(K.copy(G).normalize(),U.copy(J||H(0,1,0)),O.crossVectors(U,K).normalize(),U.crossVectors(K,O),new F.Matrix4().makeBasis(O,U,K).scale(H(X,X,X)).setPosition(E)),$.addDial=(E,G,X,J,rt,B,ot)=>{var at;E==="pas"&&G==="middle"&&(E="pas"+Bt(X.x,X.z)),((at=$.dials[G])[E]||(at[E]=[])).push([$.dialMatrix(X,J,rt),B]),$.count[ot]=($.count[ot]||0)+1},$.instanced=(E,G,X,J={},rt=0)=>{const B=Object.keys(J).length?E.clone():E;B!==E&&$.trash.add(E);for(const at in J)B.setAttribute(at,new F.InstancedBufferAttribute(new Float32Array(J[at].data),J[at].size));const ot=new F.InstancedMesh(B,G,X.length);for(let at=0;at<X.length;at++)ot.setMatrixAt(at,X[at]);return ot.instanceMatrix.needsUpdate=!0,ot.renderOrder=rt,n.add(ot),$.calls++,$.tris+=(E.index?E.index.count:E.attributes.position.count)/3*X.length,ot},$.mesh=(E,G,X=0)=>{const J=new F.Mesh(E,G);return J.renderOrder=X,n.add(J),$.calls++,$.tris+=E.attributes.position.count/3,J},$}var he={id:"ten-past-ten",name:"Ten Past Ten",category:"interior",weirdness:.2,media:["interior","air"],async build(t){const e=await N0(t);for(const u of St)await u(e),await t.yield();for(const u of[...It,...e.late])await u(e),await t.yield();const{scene:z,path:s,L:r,hero:a,ENV:l}=e,x=new F.Vector2,S=H(pt.gableX,44,0),p=H(S.x-S.y*Tt[0]/Tt[1],0,S.z-S.y*Tt[2]/Tt[1]);let f=0,M=0;const n=u=>{if(u.visible){if(u.isMesh){const y=u.geometry;f+=(y.index?y.index.count:y.attributes.position.count)/3*(u.isInstancedMesh?u.count:y.isInstancedBufferGeometry?y.instanceCount:1),M++}else u.isPoints&&M++;for(const y of u.children)n(y)}};return n(z),{scene:z,path:s,duration:50,pace:u=>Jt(Math.min(1,Math.max(0,u))*r)/e.meanSpeed,camera:{fov:60,near:.3,far:3e3,lookAhead:18,sway:.35,bank:.3},pois:[{at:H(0,22,0),from:60/r,to:215/r,weight:.55},{at:S,from:215/r,to:440/r,weight:.5},{at:p,from:300/r,to:436/r,weight:.3,fade:.45}],portal:{shape:"circle",radius:6,color:"#ffe9c4",glow:.75,style:"ring",revealDistance:200},post:{exposure:1,bloom:{strength:.22,radius:.55,threshold:1},grade:{saturation:1.06,contrast:1.03,tint:e.rain?"#f4f7ff":"#fffaf2",shadowTint:"#0b1730",vignette:.22,grain:.015,aberration:0}},ride:"none",style:"none",info:{look:e.look,iron:e.iron,rare:e.rare,dials:e.count,moving:e.moving,clearAir:e.air,sightCone:e.sight,watchToPost:e.watchToPost,watchToWatch:e.watchToWatch,watchesGathered:e.gathered,trianglesBuilt:f,meshes:M},update(u,y,R,k){l.uTime.value=y,a.setMetres(k*r),a.update(u,y,R),e.look==="cloud"&&a.setSun(.06+.94*b0(S.x,S.z,y)),t.renderer.getDrawingBufferSize(x),l.uPxH.value=x.y;for(let o=0;o<e.updaters.length;o++)e.updaters[o](u,y,R,k)},dispose(){for(const u of e.trash)u.dispose()}}}};function ht(t,e,z,s,r,a){const l=z.clone().normalize(),x=Math.abs(l.y)>.9?H(1,0,0):H(0,1,0),S=new F.Vector3().crossVectors(x,l).normalize();x.crossVectors(l,S),t.M=new F.Matrix4().makeBasis(x,l,S).setPosition(e),t.lathe(s,r,a),t.M=null}function Gt(t,e,z,s,r,a,l=[],x=1,S=!1,p=!1){t.M=z;const f=[],M=(o,d,c,C,g)=>{const h=Math.max(1,Math.round(Math.hypot(c-o,C-d)/1.4)),i=.16;for(let b=0;b<h;b++){const q=o+(c-o)*(b+.5)/h,P=d+(C-d)*(b+.5)/h,w=[q,P,g+.08];t.tri([q-i,P-i*.58,g],[q+i,P-i*.58,g],w,e.ironD),t.tri([q+i,P-i*.58,g],[q,P+i*1.15,g],w,e.ironL),t.tri([q,P+i*1.15,g],[q-i,P-i*.58,g],w,e.iron)}};t.quad([0,0,0],[s,0,0],[s,r,0],[0,r,0],e.ironD),t.box(-.1,0,0,s+.1,1.3,.45*x,e.ironD,"y-z-"),t.box(-.05,1.3,0,s+.05,1.6,.36*x,e.ironL,"y-z-"),t.box(0,1.6,0,s,1.85,.26*x,e.iron,"y-z-");const n=r-3;t.box(0,n,0,s,n+.3,.26,e.iron,"z-"),t.box(-.05,n+.3,0,s+.05,n+.75,.38,e.ironL,"z-"),t.box(-.1,n+.75,0,s+.1,n+1.1,.5,e.iron,"z-"),t.box(0,n+1.1,0,s,r,.2,e.iron,"z-y-");for(const o of[0,s-.55])t.box(o,1.85,0,o+.55,n,.3,e.ironL,"y-y+z-"),M(o+.275,2.1,o+.275,n-.25,.3);const u=.55,y=s-.55,R=[1.85,...a.flatMap(o=>[o-.5,o+.5]),n];for(const o of a)t.box(u,o-.5,0,y,o+.5,.22,e.iron,S?"x-x+z-y+":"x-x+z-"),M(u+.2,o,y-.2,o,.22);const k=nt(e.iron,.7);for(let o=0;o*2<R.length;o++){const d=u+.4,c=y-.4,C=R[o*2]+.6,g=R[o*2+1]-.6,h=c-d>1.5;if(l.includes(o))continue;const i=R[o*2],b=R[o*2+1],q=o%2?k:e.ironD,P=nt(q,.7),w=o%2?1.2:.6;if(o%2&&t.quad([u,i,.03],[y,i,.03],[y,b-w,.03],[u,b-w,.03],q),t.quadC([u,b-w,.03],[y,b-w,.03],[y,b,.03],[u,b,.03],q,q,P,P),o%2===0){const v=h?.35:.22,m=h?Math.max(v+.15,Math.min(.6,(c-d)*.2)):(c-d)*.2;for(const[T,A,I,N]of[[d,C,c,C+v],[d,g-v,c,g],[d,C+v,d+v,g-v],[c-v,C+v,c,g-v]])t.box(T,A,0,I,N,.12,e.ironL,"z-");if(t.quad([d+m,C+m,.05],[c-m,C+m,.05],[c-m,g-m,.05],[d+m,g-m,.05],e.iron),p&&h){const T=Math.min((c-d)/2,1.1),A=(d+c)/2,I=o?C+v+.15+T:g-v-.15-T;t.box(A-T,I-T,0,A+T,I+T,.16,e.ironL,"z-"),f.push([A,I,T])}}else{const v=h?.4:.28,m=Math.max(1,Math.round((g-C)/(c-d)));for(let T=0;T<m;T++){const A=C+(g-C)*T/m,I=C+(g-C)*(T+1)/m;for(const[N,Z,L]of[[d,c,.11],[c,d,.15]])t.bar([[N,A,L],[Z,I,L]],[[0,0,1],[0,0,1]],.2,v,e.ironL);T&&t.box(d,A-v/2,0,c,A+v/2,.1,e.iron,"x-x+z-")}}}return t.M=null,f}function jt(t,e,z,s,r,a,l,x=.55,S=12){const p=nt(l,x);for(let f=0;f<S;f++){const M=f/S*st,n=(f+1)/S*st,u=a*(1.25-.45*Math.sin(M)),y=a*(1.25-.45*Math.sin(n));t.quadC(e(z+(r-.06)*Math.cos(M),s+(r-.06)*Math.sin(M)),e(z+(r-.06)*Math.cos(n),s+(r-.06)*Math.sin(n)),e(z+(r+y)*Math.cos(n),s+(r+y)*Math.sin(n)),e(z+(r+u)*Math.cos(M),s+(r+u)*Math.sin(M)),p,p,l,l)}}function G0(t,e,z,s,r,a,l,x,S=.55){const p=nt(x,S),f=l*1.7,M=[[z,s],[r,s],[r,a],[z,a]],n=[[z-l,s-f],[r+l,s-f],[r+l,a+l*.8],[z-l,a+l*.8]];for(let u=0;u<4;u++){const y=(u+1)%4;t.quadC(e(...M[u]),e(...M[y]),e(...n[y]),e(...n[u]),p,p,x,x)}}function Et(t,e,z,s,r,a,l=.11,x=1/0){const S=a(),p=a(),f=a(),M=t.rare?xt.period:Math.min(3.2,Math.max(1.6,1.6+(r-1)*(1.6/2.2)))*(.97+.06*S);e.push({m:t.dialMatrix(z,s,r),sw:[t.rare?0:p*st,M,Math.min(x,l*(.85+.3*f))]})}St.push(async t=>{const e=t.w.pas,z=t.w.panePas,s=t.col,r=t.rng.fork("passage"),a=ct;t.pends=[],t.balances=[],t.pendsW={wm:[],wa:[],ws:[]};const l=Math.asin(22/a.r),x=(f,M,n)=>[a.cx+M*Math.sin(f),a.cy+M*Math.cos(f),n];for(const f of[1,-1]){const M=f>0?a.x0:a.x1,n=k=>M+f*k,u=H(f,0,0),y=(k,o,d,c,C,g,h,i)=>e.box(Math.min(n(k),n(c)),o,d,Math.max(n(k),n(c)),C,g,h,i);for(let k=0;k<8;k++){const o=a.zN+8*k,d=o+8,c=o+4,C=k===2||k===5,g=f<0&&k===0;if(C)for(const P of[-1,1])y(0,0,c+(P<0?-3.4:1.6),.5,1.6,c+(P<0?-1.6:3.4),s.ironD,P<0?"y-z+":"y-z-"),y(.5,.25,c+(P<0?-3.1:1.9),.6,1.35,c+(P<0?-1.9:3.1),s.iron,"y-");else{y(0,0,o+.6,.5,1.6,d-.6,s.ironD,"y-");for(let P=0;P<3;P++)y(.5,.25,o+.9+P*2.27,.6,1.35,o+2.83+P*2.27,s.iron,"y-")}const h=s.woodF,i=s.woodB;if(g){y(0,1.6,o+.6,.15,9.2,d-.6,s.ironD,"y-");for(let P=0;P<3;P++)y(.15,2,o+.9+P*2.27,.25,8.8,o+2.83+P*2.27,s.iron)}else e.quad([n(-3),1.6,o+.6],[n(-3),9.2,o+.6],[n(-3),9.2,d-.6],[n(-3),1.6,d-.6],h),e.quad([n(0),1.6,o+.6],[n(-3),1.6,o+.6],[n(-3),1.6,d-.6],[n(0),1.6,d-.6],s.caseL),e.quad([n(0),9.2,o+.6],[n(-3),9.2,o+.6],[n(-3),9.2,d-.6],[n(0),9.2,d-.6],i),e.quad([n(0),1.6,o+.6],[n(-3),1.6,o+.6],[n(-3),9.2,o+.6],[n(0),9.2,o+.6],i),e.quad([n(0),1.6,d-.6],[n(-3),1.6,d-.6],[n(-3),9.2,d-.6],[n(0),9.2,d-.6],i);C?(e.quad([n(-2.95),1.6,c-1.5],[n(-2.95),8.2,c-1.5],[n(-2.95),8.2,c+1.5],[n(-2.95),1.6,c+1.5],s.dark),e.quad([n(.1),1.6,c-1.6],[n(2.2),1.6,c-2.5],[n(2.2),8.6,c-2.5],[n(.1),8.6,c-1.6],s.iron),e.quad([n(.5),3,c-1.75],[n(1.9),3,c-2.35],[n(1.9),7.9,c-2.35],[n(.5),7.9,c-1.75],s.ironL),y(0,0,c-1.6,1.2,1.6,c+1.6,s.stone,"y-")):g||z.pane([n(.15),1.6,o+.6],[n(.15),1.6,d-.6],[n(.15),9.2,d-.6],[n(.15),9.2,o+.6],[0,0],[6.8,0],[6.8,7.6],[0,7.6],[2.2667,.06,5.2,.06],0,s.iron),g||y(-2.9,5.05,o+.7,-1.3,5.2,d-.7,s.caseL);for(let P=0;P<2;P++)for(let w=0;w<3;w++){const v=c+(w-1)*2.1+(P?.5:-.4),m=P?5.2:1.6,T=.4+.14*r(),A=T*2.5+.3,I=s.caseWoods[r()<.5?0:1];if(C&&w===1){r();continue}if(g){!P&&w!==1&&(r(),r());continue}y(-2.3,m,v-T*1.25,-1.7,m+A,v+T*1.25,I,"y-"),e.quad([n(-1.7),m+A,v-T*1.25],[n(-1.7),m+A+T*.7,v],[n(-1.7),m+A,v+T*1.25],[n(-1.7),m+A,v+T*1.25],I),e.tri([n(-2.3),m+A,v-T*1.25],[n(-2),m+A+T*.7,v],[n(-1.7),m+A,v-T*1.25],nt(I,.8)),e.tri([n(-2.3),m+A,v+T*1.25],[n(-2),m+A+T*.7,v],[n(-1.7),m+A,v+T*1.25],nt(I,.8)),t.addDial("pas","middle",H(n(-1.66),m+A-T*1.12,v),u,T,t.enamel,"shop clocks"),!P&&w!==1&&(t.balances.push({m:t.dialMatrix(H(n(-1.2),m+.5,v),H(0,1,0),.34,H(f,0,0)),sw:[r()*st,1.6+.5*r(),1.4]}),ht(e,H(n(-1.2),m,v),H(0,1,0),[[.42,0],[.42,.1],[.06,.14],[.05,.5]],8,s.brassD))}y(0,9.2,o,.6,11,d,s.iron,"y-"),y(.6,9.55,o+.8,.7,10.65,d-.8,s.ironL),ht(e,H(n(.7),10.1,o+1.6),u,[[.34,0],[.26,.12],[0,.16]],8,s.brass),ht(e,H(n(.7),10.1,d-1.6),u,[[.34,0],[.26,.12],[0,.16]],8,s.brass),y(0,11,o,1.1,11.45,d,s.ironL),y(0,11.45,o,.7,12,d,s.iron);for(let P=0;P<4;P++)y(.6,10.3,o+1+P*2-.12,1,11,o+1+P*2+.12,s.ironD);e.quad([n(0),12,o],[n(0),29,o],[n(0),29,d],[n(0),12,d],nt(s.white,f>0?1:.93)),y(0,29,o,.5,30,d,s.iron),y(0,17.95,o,.18,18.2,d,s.cream);const b=nt(s.white,f>0?1:.93),q=(P,w)=>[n(.03),w,P];G0(e,q,c-3.19,12.31,c+3.19,17.66,.18,b);for(let P=-1;P<=1;P++){const w=c+P*2.3,v=r()<.5?s.caseD:s.caseL;y(0,12.4,w-.8,.12,15.5,w+.8,nt(v,.75),"z-z+"),y(0,12.4,w-.95,.75,15.5,w-.8,v),y(0,12.4,w+.8,.75,15.5,w+.95,v),y(0,12.25,w-1.05,.85,12.45,w+1.05,v),y(0,15.5,w-1,.8,17.5,w+1,v),y(0,17.5,w-1.12,.92,17.72,w+1.12,nt(v,1.2)),t.addDial("pas","middle",H(n(.82),16.5,w),u,.8,t.enamel,"wall clocks"),Et(t,t.pends,H(n(.42),15.52,w),u,2.35,r,.15)}for(const P of[-1,1]){const w=c+P*1.8;jt(e,q,w,20.05,1.62,.12,b),ht(e,H(n(0),20.05,w),u,[[1.62,0],[1.62,.2],[1.45,.36],[1.27,.3]],16,v=>[s.caseD,s.caseL,s.caseD][v]),ht(e,H(n(.05),20.05,w),u,[[0,0],[1.62,0]],16,nt(s.caseD,.75)),t.addDial("pas","middle",H(n(.3),20.05,w),u,1.27,t.enamel,"wall clocks")}for(let P=-1;P<=1;P++){const w=c+P*2.36,v=r()<.5?s.caseL:s.caseD;jt(e,q,w,24.4,1.085,.06,b,.55,8),ht(e,H(n(0),24.4,w),u,[[1.085,0],[1.085,.26],[.85,.34]],8,m=>[v,nt(v,1.25)][m]),ht(e,H(n(.05),24.4,w),u,[[0,0],[1.085,0]],8,nt(v,.75)),y(0,22,w-.55,.1,23.5,w+.55,nt(v,.75)),y(0,22,w-.62,.3,23.5,w-.5,v),y(0,22,w+.5,.3,23.5,w+.62,v),y(0,21.85,w-.62,.3,22,w+.62,v),t.addDial("pas","middle",H(n(.33),24.4,w),u,.83,t.enamel,"wall clocks"),Et(t,t.pends,H(n(.2),23.36,w),u,1,r,.28)}for(let P=-1;P<=1;P++){const w=c+P*2.4;jt(e,q,w,27.3,1,.14,b),ht(e,H(n(0),27.3,w),u,[[1,0],[1,.16],[.86,.2]],12,s.black),ht(e,H(n(.05),27.3,w),u,[[0,0],[1,0]],12,s.black),t.addDial("pas","middle",H(n(.19),27.3,w),u,.86,t.enamel,"wall clocks")}await t.ctx.yield()}await t.ctx.yield();for(let k=0;k<=8;k++){const o=a.zN+8*k;y(0,0,o-.6,.8,11,o+.6,s.iron,"y-"),y(0,0,o-.75,.95,1.2,o+.75,s.ironD,"y-"),y(0,10.2,o-.72,.92,11,o+.72,s.ironL),y(0,12,o-.5,.45,29,o+.5,s.iron),y(.45,12.6,o-.28,.55,28.4,o+.28,s.ironL)}const R=Math.sqrt(j.R*j.R-M*M);if(R<a.zN){const k=new F.Matrix4().makeBasis(H(0,0,1),H(0,1,0),H(f,0,0)).setPosition(M,0,R),o=a.zN-R;Gt(e,s,k,o,30,[10.6,19.4],[0,1,2]),(t.clockBays||(t.clockBays=[])).push({M:k,n:H(f,0,0),x0:.55,x1:o-.55,end:d=>d<11?o-.6:o-.55,group:"wm",boards:[[1.85,10.1],[11.1,18.9],[19.9,27]],storeys:[[3,9.9,[["d",3,.95],["r",4,.8]]],[11.3,18.7,[["R",3,1.1],["d",3,.95]]],[20.1,26.8,[["r",4,.8],["d",3,.95]]]]})}}await t.ctx.yield();const S=f=>Math.min(a.zN,Math.sqrt((j.R-.12)*(j.R-.12)-f*f)),p=16;for(let f=0;f<=8;f++){const M=a.zN+8*f;for(const[n,u,y,R]of[[a.r-.08,.16,.8,s.ironL],[a.r-.66,1,.36,s.iron],[a.r-1.24,.16,.8,s.ironL]]){const k=[],o=[];for(let d=0;d<=p;d++){const c=-l+2*l*d/p;k.push(x(c,n,M)),o.push([Math.sin(c),Math.cos(c),0])}e.bar(k,o,u,y,R)}f%3===2&&await t.ctx.yield()}for(let f=-6;f<=6;f++){const M=f*4/a.r,n=x(M,a.r-.2,S(a.cx+(a.r-.2)*Math.sin(M))),u=x(M,a.r-.2,a.zS);e.bar([n,u],[[Math.sin(M),Math.cos(M),0],[Math.sin(M),Math.cos(M),0]],.32,.28,s.iron)}for(let f=0;f<8;f++)for(let M=0;M<p;M++){const n=-l+2*l*M/p,u=-l+2*l*(M+1)/p,y=a.zN+8*f,R=y+8;z.pane(x(n,a.r,y),x(n,a.r,R),x(u,a.r,R),x(u,a.r,y),[y+400.5,n*a.r],[R+400.5,n*a.r],[R+400.5,u*a.r],[y+400.5,u*a.r],[1,.03,1e3,0],0,s.iron)}for(let f=0;f<p;f++){const M=-l+2*l*f/p,n=-l+2*l*(f+1)/p,u=S(a.cx+a.r*Math.sin(M)),y=S(a.cx+a.r*Math.sin(n));u>a.zN-1e-6&&y>a.zN-1e-6||z.pane(x(M,a.r,u),x(M,a.r,a.zN),x(n,a.r,a.zN),x(n,a.r,y),[u+400.5,M*a.r],[a.zN+400.5,M*a.r],[a.zN+400.5,n*a.r],[y+400.5,n*a.r],[1,.03,1e3,0],0,s.iron)}z.pane([a.x0,0,a.zS],[a.x1,0,a.zS],[a.x1,30,a.zS],[a.x0,30,a.zS],[0,0],[44,0],[44,30],[0,30],[1,.05,6,.05],0,s.iron);for(let f=0;f<p;f++){const M=-l+2*l*f/p,n=-l+2*l*(f+1)/p,u=x(M,a.r,a.zS),y=x(n,a.r,a.zS);z.pane([u[0],30,a.zS],[y[0],30,a.zS],y,u,[u[0]+40,30],[y[0]+40,30],[y[0]+40,y[1]],[u[0]+40,u[1]],[1,.05,6,.05],0,s.iron)}for(const[f,M]of[[1,[108,92,76]],[-1,[100,84,68]]])for(const n of M){const u=f>0?a.x0:a.x1,y=u+f*5.5,R=H(y,20,n);e.box(Math.min(u,y-f*1.9),20.9,n-.22,Math.max(u,y-f*1.9),21.35,n+.22,s.iron),e.bar([[u,24.5,n],[u+f*1.6,23.2,n],[u+f*3.2,22,n],[y-f*1.2,21.5,n]],[[0,1,0],[0,1,0],[0,1,0],[0,1,0]],.3,.3,s.ironL),e.bar([[u,17.2,n],[u+f*1.8,18.6,n],[y-f*1.75,19.6,n]],[[0,1,0],[0,1,0],[0,1,0]],.26,.26,s.iron),ht(e,H(y,20,n-.55),H(0,0,1),[[1.56,0],[1.72,0],[1.9,.12],[1.9,.98],[1.72,1.1],[1.56,1.1]],24,k=>[s.ironD,s.ironL,s.iron,s.ironL,s.ironD][k]),ht(e,H(y,21.9,n),H(0,1,0),[[.5,0],[.34,.3],[.12,.42],[.2,.7],[0,1.05]],8,s.brass);for(const k of[1,-1])t.addDial("pas","near",H(y,20,n+k*.56),H(0,0,k),1.6,t.enamel,"bracket clocks");(t.airItems||(t.airItems=[])).push({cls:"bracket clocks",p:[y,20,n],r:1.95})}await t.ctx.yield()});const Ht=[[50,82],[138,168.5],[191.5,244.03],[267.03,310]],a0=[{a:180,name:"west"},{a:255.53,name:"north"}],D=(t,e,z)=>[t*Math.cos(e*tt),z,t*Math.sin(e*tt)],_t=t=>j.archSpring+Math.sqrt(Math.max(0,j.archHalf*j.archHalf-t*t)),Vt=(t,e,z)=>t>30&&Math.abs(z)<j.archHalf&&e<_t(z),fe=t=>ct.cy+Math.sqrt(Math.max(0,ct.r*ct.r-(t-ct.cx)*(t-ct.cx))),kt=[j.domeR*Math.acos((j.drumY-j.domeCy)/j.domeR),j.domeR*Math.acos((j.lanternY-j.domeCy)/j.domeR)],yt=(t,e,z=0)=>{const s=t/j.domeR,r=(j.domeR+z)*Math.sin(s);return[r*Math.cos(e*tt),j.domeCy+(j.domeR+z)*Math.cos(s),r*Math.sin(e*tt)]};function _0(){const t=[];for(let e=0;e<24;e++)for(let z=0;z<12;z++){const s=-180+e*15,r=s+15,a=kt[0]+(kt[1]-kt[0])*z/12,l=kt[0]+(kt[1]-kt[0])*(z+1)/12,x=[yt(a,s),yt(a,r),yt(l,r),yt(l,s)];for(const[S,p]of[[0,1],[1,2],[2,0],[2,3],[3,0]]){const f=x[S],M=x[p];if((f[0]-58)*(M[0]-58)>=0)continue;const n=(58-f[0])/(M[0]-f[0]);t.push([f[2]+n*(M[2]-f[2]),f[1]+n*(M[1]-f[1])])}}return t.sort((e,z)=>e[0]-z[0]),t.filter((e,z)=>z===0||e[0]-t[z-1][0]>1e-6)}St.push(async t=>{const e=t.w.crt,z=t.w.paneCrt,s=t.col,r=j.R,a=o=>nt(s.wall,o<42?.94:1),l=(o,d,c,C,g)=>{for(const[h,i,b]of c){const q=H(h,i,.19).applyMatrix4(o),P=t.planDist(q.x,q.z);t.addDial(C,P<14?"near":P<30?"middle":"far",q,d,b-.17,t.enamel,"pier roundels"),(t.airItems||(t.airItems=[])).push({cls:g,cyl:[H(h,i,0).applyMatrix4(o),d,b*Math.SQRT2,.2+.19*(b-.17)],r:0})}},x=(o,d)=>{const c=Math.max(1,Math.round((d-o)/3.75));for(let C=0;C<c;C++){const g=o+(d-o)*C/c,h=o+(d-o)*(C+1)/c;for(const[i,b]of[[0,14],[14,28],[28,42],[42,51]]){const q=a(i),P=nt(q,.6);e.quadC(D(r,g,i),D(r,h,i),D(r,h,i+1.8),D(r,g,i+1.8),P,P,q,q),e.quad(D(r,g,i+1.8),D(r,h,i+1.8),D(r,h,b),D(r,g,b),q)}}},S=Math.acos(ct.x1/r)/tt,p=Math.acos(ct.x0/r)/tt;for(const[o,d]of[[32.09,S],[p,171],[189,246.53],[264.53,327.91]])x(o,d);const f=Math.asin((ct.x1-ct.cx)/ct.r),M=(o,d)=>{const c=-f+2*f*(16-o)/16,C=ct.cx+ct.r*Math.sin(c);return[C,d??ct.cy+ct.r*Math.cos(c),Math.sqrt(r*r-C*C)]};for(let o=0;o<16;o++)e.quad(M(o),M(o+1),M(o+1,51),M(o,51),a(44));for(let o=0;o<20;o++){const d=-32.09+64.18*o/20,c=-32.09+64.18*(o+1)/20,C=Math.min(51,_t(r*Math.sin(d*tt))),g=Math.min(51,_t(r*Math.sin(c*tt)));(C<51||g<51)&&e.quad(D(r,d,C),D(r,c,g),D(r,c,51),D(r,d,51),a(44))}const n=(o,d)=>o>j.drumY?Math.sqrt(Math.max(0,j.domeR*j.domeR-(o-j.domeCy)*(o-j.domeCy)-d*d)):Math.sqrt(r*r-d*d),u=[],y=[],R=1/Math.cos(Math.PI/72);for(let o=0;o<=36;o++){const d=Math.PI*o/36,c=j.archHalf*Math.cos(d),C=j.archSpring+j.archHalf*Math.sin(d);if(u.push([n(C,c)-.2,C,c]),y.push([0,Math.sin(d),Math.cos(d)]),o<36){const g=Math.PI*(o+1)/36,h=j.archHalf*Math.cos(g),i=j.archSpring+j.archHalf*Math.sin(g),b=Math.max(58,Math.sqrt(r*r-c*c)),q=Math.max(58,Math.sqrt(r*r-h*h));(b-n(C,c)>.02||q-n(i,h)>.02)&&e.quad([n(C,c),C,c],[b,j.archSpring+(C-j.archSpring)*R,c*R],[q,j.archSpring+(i-j.archSpring)*R,h*R],[n(i,h),i,h],o%2?s.iron:s.ironD)}}e.bar(u,y,1.3,.9,s.ironL);for(const o of[-1,1]){const d=o*j.archHalf,c=Math.sqrt(r*r-d*d),C=new F.Matrix4().makeBasis(H(1,0,0),H(0,1,0),H(0,0,-o)).setPosition(c,0,d);l(C,H(0,0,-o),Gt(e,s,C,58-c,j.archSpring,[11,21.5],[],1,!1,!0),o<0?"wa":"ws","east arch jambs"),e.bar([[c-.2,0,d],[c-.2,j.archSpring,d]],[[0,0,o],[0,0,o]],1.3,.9,s.ironL),(t.airItems||(t.airItems=[])).push({cls:"east arch jambs",seg:[[c-.2,0,d-o*.2],[c-.2,j.archSpring,d-o*.2]],r:.64})}const k=(o,d,c,C)=>{const g=[D(57,o,0),D(57,d,0),D(r,d,0),D(r,o,0)];for(let m=1;m<4;m++){const T=(m+1)%4;e.quad(g[m],g[T],[g[T][0],c,g[T][2]],[g[m][0],c,g[m][2]],s.iron)}e.quad(...g.map(m=>[m[0],c,m[2]]),s.ironL);const h=(o+d)/2,i=(d-o)/2-.45,b=h*tt,q=H(-Math.cos(b),0,-Math.sin(b)),P=H(g[1][0]-g[0][0],0,g[1][2]-g[0][2]),w=P.length();P.normalize();const v=new F.Matrix4().makeBasis(P,H(0,1,0),q).setPosition(g[0][0],0,g[0][2]);l(v,q,Gt(e,s,v,w,c,[13.5,27.5],[],1,!1,!0),o===310?"wa":o===134?"wm":o===46?"ws":"crt","arch piers");for(const[m,T]of[[o,-1],[d,1]]){const A=m*tt,I=H(Math.cos(A),0,Math.sin(A)),N=H(-Math.sin(A)*T,0,Math.cos(A)*T),Z=T*.09/(60*tt);if(C===2||C===1&&T<0){const L=D(57.35,m,0),W=new F.Matrix4().makeBasis(I,H(0,1,0),N).setPosition(L[0]+N.x*.02,0,L[2]+N.z*.02),_=Ht.some(([Y,$])=>Y===m||$===m);Gt(e,s,W,6.6,c,[13.5,27.5],o===310?[0,1,2]:[0,1],m===310||m===244.03?.65:1,_),(t.clockBays||(t.clockBays=[])).push({M:W,n:N.clone(),x0:.55,x1:_?4.4:6.05,prog:_?"bay":"wide",high:o===310,under:_,group:o===134||o===168.5?"wm":"wa",y0:1.85,late:C===1});continue}for(const[L,W]of[[2.6,12.4],[15.2,26.4],[29.2,40.4]]){const _=[D(58.2,m,L),D(62.8,m,L),D(62.8,m,W),D(58.2,m,W)],Y=[D(59,m+Z*1.3,L+.7),D(62,m+Z*1.3,L+.7),D(62,m+Z*1.3,W-.7),D(59,m+Z*1.3,W-.7)];for(let $=0;$<4;$++)e.quad(_[$],_[($+1)%4],Y[($+1)%4],Y[$],s.ironD);e.quad(Y[0],Y[1],Y[2],Y[3],s.iron)}}for(const m of[o,d])(t.airItems||(t.airItems=[])).push({cls:"arch piers",seg:[D(57,m,0),D(57,m,c)],r:.6})};await t.ctx.yield();for(const[o,d]of[[46,50],[82,86],[134,138],[168.5,171],[189,191.5],[244.03,246.53],[264.53,267.03],[310,314]])k(o,d,46,o===134||o===310?2:o===168.5||o===244.03?1:0),(o===134||o===244.03)&&await t.ctx.yield();await t.ctx.yield();for(const o of a0){const d=o.a*tt,c=H(-Math.cos(d),0,-Math.sin(d)),C=H(-Math.sin(d),0,Math.cos(d)),g=(w,v,m)=>[Math.cos(d)*m+C.x*w,v,Math.sin(d)*m+C.z*w],h=w=>Math.sqrt(r*r-w*w),i=w=>34+Math.sqrt(Math.max(0,100-w*w));e.quad(g(-10,0,65.5),g(10,0,65.5),g(10,44,65.5),g(-10,44,65.5),nt(s.cream,.8));{const w=nt(s.cream,.8),v=(m,T,A,I,N,Z=N)=>e.quadC(g(-10,m,T),g(10,m,T),g(10,A,I),g(-10,A,I),N,N,Z,Z);v(0,65.05,2.2,65.05,s.ironD,s.iron),v(2.2,65.05,2.6,65.5,s.ironL),v(19.3,65.5,19.6,65.1,s.ironD),v(19.6,65.1,20.4,65.1,s.iron),v(20.4,65.1,20.8,65.5,s.ironL),v(17.9,65.49,19.3,65.49,w,nt(w,.62));for(const m of[-9,.6]){const T=[[m,3.8],[m+8.4,3.8],[m+8.4,17.8],[m,17.8]].map(([I,N])=>g(I,N,65.5)),A=[[m+.8,4.6],[m+7.6,4.6],[m+7.6,17],[m+.8,17]].map(([I,N])=>g(I,N,65.38));for(let I=0;I<4;I++)e.quad(T[I],T[(I+1)%4],A[(I+1)%4],A[I],nt(s.cream,I===2?.5:I===0?.74:.6));e.quad(A[0],A[1],A[2],A[3],nt(s.cream,.94))}}const b=[],q=[];for(let w=0;w<=16;w++){const v=-10+20*w/16,m=v+20/16;w<16&&(e.quad(g(v,i(v),h(v)),g(m,i(m),h(m)),g(m,51,h(m)),g(v,51,h(v)),a(44)),e.quad(g(v,i(v),h(v)),g(m,i(m),h(m)),g(m,i(m),65.5),g(v,i(v),65.5),s.ironD));const T=Math.PI*w/16;b.push(g(-10*Math.cos(T),34+10*Math.sin(T),h(10*Math.cos(T))-.3)),q.push([-C.x*Math.cos(T),Math.sin(T),-C.z*Math.cos(T)])}e.bar(b,q,.9,.8,s.ironL);for(const w of[-1,1]){{const v=o.a+w*Math.asin(10/r)/tt,m=o.a+w*9;for(const[T,A]of[[0,42],[42,51]])e.quad(D(r,v,T),D(r,m,T),D(r,m,A),D(r,v,A),a(T))}e.quad(g(w*10,0,h(10)),g(w*10,0,65.5),g(w*10,34,65.5),g(w*10,34,h(10)),s.ironD),e.bar([g(w*10,0,h(10)-.3),g(w*10,34,h(10)-.3)],[[C.x*w,0,C.z*w],[C.x*w,0,C.z*w]],.9,.8,s.ironL)}const P=H(Math.cos(d)*65.5,30,Math.sin(d)*65.5);ht(e,P,c,[[8.3,0],[8.3,.7],[7.7,1],[7.25,.9],[7,.62]],48,w=>[s.iron,s.ironL,s.iron,s.brass][w]),ht(e,P.clone().addScaledVector(c,.05),c,[[0,0],[8.3,0]],48,s.ironD),t.addDial("crt","middle",P.clone().addScaledVector(c,.6),c,7,t.enamel,"tower dials")}await t.ctx.yield(),t.columns=[],t.balusters=[];for(const[o,d]of Ht){const c=Math.max(1,Math.round((d-o)/3.75)),C=[];for(let g=Math.ceil((o+1.5)/15)*15;g<=d-1.5;g+=15)C.push(D(57.75,g,0));for(const g of j.decks)for(let h=0;h<c;h++){const i=o+(d-o)*h/c,b=o+(d-o)*(h+1)/c,q=(i+b)/2;{const v=nt(s.stone,.9),m=nt(v,.55);e.quad(D(57,i,g),D(57,b,g),D(61.4,b,g),D(61.4,i,g),v),e.quadC(D(61.4,i,g),D(61.4,b,g),D(r,b,g),D(r,i,g),v,v,m,m)}e.quad(D(57.3,i,g-.7),D(57.3,b,g-.7),D(r,b,g-.7),D(r,i,g-.7),nt(s.white,.62)),e.quad(D(57,i,g-1.1),D(57,b,g-1.1),D(57,b,g+.12),D(57,i,g+.12),s.iron),e.quad(D(56.9,i,g-.3),D(56.9,b,g-.3),D(56.9,b,g-.02),D(56.9,i,g-.02),s.ironL),e.quad(D(57,i,g-1.1),D(57,b,g-1.1),D(57.3,b,g-1.1),D(57.3,i,g-1.1),s.ironD);const P=D(57,q,g),w=57*(b-i)*tt;if(t.planDist(P[0],P[2])<20){const v=Math.max(1,Math.round(w/.95));for(let m=0;m<v;m++){const T=D(57.12,i+(b-i)*(m+.5)/v,g+.12);g<42&&C.some(A=>Math.hypot(T[0]-A[0],T[2]-A[2])<.82)||t.balusters.push(new F.Matrix4().makeTranslation(T[0],T[1],T[2]))}e.bar([D(57.12,i,g+1.62),D(57.12,b,g+1.62)],[[0,1,0],[0,1,0]],.16,.26,s.ironL),e.quad(D(56.93,i+.35,g-.95),D(56.93,b-.35,g-.95),D(56.93,b-.35,g-.42),D(56.93,i+.35,g-.42),s.ironD);for(const m of[i,q]){const T=D(57,m,g-.68),A=m*tt;ht(e,H(T[0],T[1],T[2]),H(-Math.cos(A),0,-Math.sin(A)),[[.2,0],[.14,.12],[0,.16]],6,s.brassD)}e.bar([D(57.12,i,g+.2),D(57.12,b,g+.2)],[[0,1,0],[0,1,0]],.14,.2,s.iron)}else z.pane(D(57.12,i,g+.12),D(57.12,b,g+.12),D(57.12,b,g+1.7),D(57.12,i,g+1.7),[57.12*i*tt,0],[57.12*b*tt,0],[57.12*b*tt,1.58],[57.12*i*tt,1.58],[.95,.1,1.5,.08],2,s.iron)}await t.ctx.yield();for(let g=Math.ceil((o+1.5)/15)*15;g<=d-1.5;g+=15)for(const h of j.decks){const i=D(57.75,g,h-14);t.columns.push(new F.Matrix4().makeRotationY(-g*tt).setPosition(i[0],i[1],i[2])),(t.airItems||(t.airItems=[])).push({cls:"gallery fronts and columns",seg:[i,[i[0],h,i[2]]],r:.6})}for(const g of j.decks)for(let h=0;h<=8;h++)(t.airItems||(t.airItems=[])).push({cls:"gallery fronts and columns",p:D(57,o+(d-o)*h/8,g+.4),r:1.4,ring:[o,d,g]})}await t.ctx.yield()});function V0(t){const e=ft(),z=[1,1,1,.35],s=[.6,.6,.6,.1],r=[1.25,1.25,1.25,.35],a=[.16,.16,.18,.95],l=(S,p,f)=>[S*Math.cos(p),6.85+S*Math.sin(p),f],x=6;e.box(-1.14,0,-.7,1.14,.2,.76,r,"y-");for(let S=0;S<x;S++){const p=S/x*Math.PI,f=(S+1)/x*Math.PI,M=Math.sin((p+f)/2)>.7;e.tri([0,6.85,.62],l(1,p,.62),l(1,f,.62),z),e.quad(l(1,p,.62),l(1,p,-.6),l(1,f,-.6),l(1,f,.62),M?r:z)}if(e.box(-1,5.72,-.6,1,6.85,.62,z,t?"y+y-z-":"y+z-"),t){e.box(-1.07,.2,-.66,1.07,.42,.7,z,"y-"),e.box(-1,.42,-.6,1,1.55,.62,z,"y-"),e.quad([-.7,.62,.64],[.7,.62,.64],[.7,1.35,.64],[-.7,1.35,.64],r),e.box(-.95,1.55,-.55,.95,1.7,.57,r,"y-"),e.quad([-.7,1.7,-.3],[.7,1.7,-.3],[.7,5.5,-.3],[-.7,5.5,-.3],a),e.box(-.85,1.7,-.45,-.7,5.5,.48,z,"y-y+"),e.box(.7,1.7,-.45,.85,5.5,.48,z,"y-y+"),e.box(-.7,1.7,.36,.7,1.95,.48,z,"y-x-x+"),e.box(-.7,5.25,.36,.7,5.5,.48,z,"y+x-x+"),e.box(-1.02,5.5,-.6,1.02,5.72,.66,r,"z-"),e.quad([-.83,5.95,.63],[.83,5.95,.63],[.83,6.85,.63],[-.83,6.85,.63],a),e.quad([-.95,5.83,.66],[.95,5.83,.66],[.95,5.95,.66],[-.95,5.95,.66],r);for(const f of[-1,1])e.quad([f*.83,5.95,.66],[f*.95,5.95,.66],[f*.95,6.85,.66],[f*.83,6.85,.66],r);for(let f=0;f<6;f++){const M=f/6*Math.PI,n=(f+1)/6*Math.PI;e.tri([0,6.85,.63],l(.83,M,.63),l(.83,n,.63),a),e.quad(l(.83,M,.66),l(.95,M,.66),l(.95,n,.66),l(.83,n,.66),r)}for(const f of[-.93,.93])e.lathe([[.12,5.74],[.08,5.9],[.08,6.72],[.12,6.88]],4,r,f,.72);const S=[],p=[];for(let f=0;f<=5;f++){const M=f/5*Math.PI;S.push(l(1.04,M,.64)),p.push([Math.cos(M),Math.sin(M),0])}e.bar(S,p,.14,.2,r),e.lathe([[.15,7.78],[.15,8.02],[.08,8.14],[0,8.4]],4,r)}else{e.box(-1,.2,-.6,1,1.55,.62,z,"y-"),e.box(-.85,1.55,-.45,.85,5.72,.48,z,"y-y+z+");for(const[S,p,f,M]of[[-.85,1.55,-.7,5.72],[.7,1.55,.85,5.72],[-.7,1.55,.7,1.95],[-.7,5.25,.7,5.72]])e.quad([S,p,.48],[f,p,.48],[f,M,.48],[S,M,.48],z);e.quad([-.85,1.55,-.3],[.85,1.55,-.3],[.85,5.72,-.3],[-.85,5.72,-.3],a),e.tri([-.12,7.85,0],[.12,7.85,0],[0,8.4,0],r)}return e.geometry()}function O0(t){const e=ft(),z=nt(t,1.2,.8);return e.quad([-.012,-.95,0],[.012,-.95,0],[.012,.075,0],[-.012,.075,0],t),e.M=new F.Matrix4().makeRotationX(Math.PI/2).setPosition(0,-1,0),e.lathe([[.0758,0],[.052,.014],[0,.02]],10,s=>s?z:t),e.M=null,e.geometry()}function $0(t,e){const z=ft();return z.quad([-.014,-.9,0],[.014,-.9,0],[.014,0,0],[-.014,0,0],e),z.M=new F.Matrix4().makeRotationX(Math.PI/2).setPosition(0,-1,0),z.lathe([[.13,0],[.095,.022],[0,.032]],8,t),z.M=null,z.geometry()}function j0(t){const e=ft();return e.M=new F.Matrix4().makeRotationX(Math.PI/2),e.lathe([[1,0],[.82,0],[.82,.16],[1,.16],[1,0]],10,t),e.lathe([[.22,.2],[0,.2]],6,t),e.M=null,e.box(-.85,-.07,.02,.85,.07,.14,t),e.box(-.07,-.85,.02,.07,.85,.14,t),e.geometry()}const U0={wide:{low:[["d",2,.95],["r",3,.68],["d",2,.9]],up:[["R",2,1.05],["d",2,.95],["r",3,.68],["d",2,.95]]},bay:{low:[["r",1,1.1],["d",2,.68],["d",1,1]],up:[["R",1,1.1],["d",2,.68],["r",2,.68],["d",1,1.05]]},narrow:{low:[["d",1,.9],["r",1,.95],["d",1,.9]],up:[["R",1,.96],["d",1,.9],["r",1,.8],["d",1,.95]]}},n0=(t,e)=>(t==="d"?3.668:2.44)*e;function s0(t,e,z,s,r){const a=t.col,l=t.w[e.group],x=e.M,S=e.n,p=e.x1-e.x0,f=[.16,.16,.18,.95],M=(h,i,b)=>H(h,i,b).applyMatrix4(x),n=a.woodB,u=a.woodF,y=nt(a.woodB,.8),R=a.caseWoods,k=h=>{const i=[...h],b=i.map((q,P)=>P).filter(q=>i[q][0]!=="R");for(let q=b.length-1;q>0;q--){const P=Math.floor(r()*(q+1));[i[b[q]],i[b[P]]]=[i[b[P]],i[b[q]]]}return i},o=U0[e.prog],d=(e.storeys||(e.high?[[3,12.8,o.low],[14.3,26.7,[...o.up].reverse()],[28.3,40.5,o.up]]:[[3,12.8,o.low],[14.3,26.7,o.up]])).map(([h,i,b])=>[h,i,k(b)]),c=e.boards||(e.high?[[e.y0,13],[14,27],[28,e.frame||e.under?41:43]]:[[e.y0,13],[14,27]]);if(l.M=x,e.frame){const h=e.frame,i=c[c.length-1][1];for(const[b,q]of[[0,.15],[h-.15,h]])l.box(b,2,0,q,i+.5,.2,a.iron,"y-z-");l.box(.15,2,0,h-.15,2.5,.18,a.ironD,"x-x+y-z-"),l.box(.15,i,0,h-.15,i+.5,.2,a.ironL,"x-x+z-");for(let b=0;b+1<c.length;b++)l.box(.15,c[b][1],0,h-.15,c[b+1][0],.22,a.iron,"x-x+z-")}const C=e.frame?e.x0-.08:e.x0,g=h=>e.end?e.end(h):e.frame||e.under?e.x1+.08:e.x1;for(const[h,i]of c)l.quad([C,h,.06],[g(h),h,.06],[g(h),i,.06],[C,i,.06],n);l.M=null;for(const[h,i,b]of d){const q=b.map(([T,A,I])=>Math.min(I,((p+.25)/A-.25)/2.44)*(1-.18*z())),P=q.reduce((T,A,I)=>T+n0(b[I][0],A),0),w=Math.min(1,(i-h-.2*b.length)/P),v=(i-h-P*w)/b.length;let m=h+v/2;for(let T=0;T<b.length;T++){const[A,I]=b[T],N=q[T]*w,Z=1.22*N,L=n0(A,N),W=m+L-Z,_=p/I,Y=Math.min(e.x1,g(m-v/2));l.M=x,l.quad([e.x0,m-v/2-.06,.1],[Y,m-v/2-.06,.1],[Y,m-v/2+.06,.1],[e.x0,m-v/2+.06,.1],y),l.M=null;for(let $=0;$<I;$++){const V=e.x0+($+.5)*_,O=s(),U=A==="d"?R[O<.25?0:O<.45?1:O<.7?2:3]:O<.3?a.brass:R[O<.5?0:O<.65?1:O<.85?2:3],K=A!=="d"&&O<.3?a.brassD:nt(U,1.25),E=.1+.1*N/1.1,G=M(V,W,.04+E),X=t.planDist(G.x,G.z),J=X<14?"near":X<30?"middle":"far";if(l.M=x,l.quad([V-_/2+.1,m-.04,.08],[V+_/2-.1,m-.04,.08],[V+_/2-.1,m+L+.04,.08],[V-_/2+.1,m+L+.04,.08],u),A==="d"){const rt=.56*N,B=.66*N,ot=W-.9*Z,at=ot-1.35*N,it=.3;l.quad([V-rt,at,.09],[V+rt,at,.09],[V+rt,ot,.09],[V-rt,ot,.09],f),l.box(V-B,at+.1*N,.06,V-rt,ot,it,U,J==="far"?"y+y-z-x+":"y+y-z-"),l.box(V+rt,at+.1*N,.06,V+B,ot,it,U,J==="far"?"y+y-z-x-":"y+y-z-"),l.box(V-B,at,.06,V+B,at+.1*N,it,K,J==="far"?"z-x-x+":"z-"),l.M=null,Et(t,t.pendsW[e.group],M(V,W-.84*Z,.19),S,.95*N,s,.28),(t.airItems||(t.airItems=[])).push({cls:"walls of clocks",cyl:[M(V,(ot+at)/2,0),S,.945*N,it]})}l.M=null,ht(l,M(V,W,.06),S,J==="far"?[[Z,0],[N,E]]:[[Z,0],[Z,.6*E],[N,E]],A==="d"?8:J==="near"?10:8,rt=>rt?K:U),A!=="d"&&J==="near"&&ht(l,M(V,W,.11),S,[[0,0],[Z,0]],10,nt(U,.6)),t.addDial(e.late&&J!=="near"?"crt":e.group,J,M(V,W,(J==="far"?.07:.065)+E),S,N,t.enamel,"court wall clocks"),(t.airItems||(t.airItems=[])).push({cls:"walls of clocks",cyl:[M(V,W,0),S,Z,.065+E+.19*N]})}m+=L+v}}}St.push(async t=>{const e=t.w.crt2,z=t.w.paneCrt,s=t.col,r=j.R,a=t.rng.fork("court");t.longNear=[],t.longFar=[],t.longTone={near:[],far:[]},t.pendsLong=[];const l=2.6/62.9/tt,x=s.longWoods.map(o=>new F.Color().setRGB(o[0],o[1],o[2])),S=Pt(4207),p=nt(s.wall,.9),f=nt(s.wall,1.06),M=nt(s.wall,.74);for(const[o,d]of Ht){const c=Math.floor((d-o-2.2)/l),C=(o+d)/2-c*l/2,g=[0,...j.decks];for(let b=0;b<4;b++)for(let q=0;q<=c;q++){const P=g[b],w=C+q*l,v=w*tt,m=D(62.9,w,P),T=H(-Math.cos(v),0,-Math.sin(v)),A=t.planDist(m[0],m[2])<30,I=t.dialMatrix(H(m[0],m[1],m[2]),T,1);(A?t.longNear:t.longFar).push(I),t.longTone[A?"near":"far"].push(x[Math.floor(S()*4)].clone().multiplyScalar(.92+.16*a())),t.addDial("crt",A?"middle":"far",H(m[0],P+6.85,m[2]).addScaledVector(T,A?.66:.64),T,.8,t.enamel,"longcase clocks"),Et(t,t.pendsLong,H(m[0],P+5.49,m[2]).addScaledVector(T,.02),T,3.3,a,.12,.13)}const h=[];for(let b=0;b<=c+1;b++)(b===0||b===c+1||b%4===0)&&h.push(C+(b-.5)*l);const i=.35/64/tt;for(let b=0;b<4;b++){const q=g[b],P=b<3?q+13.3:51;for(let w=0;w<h.length;w++){const v=h[w];e.quad(D(63.62,v-i,q),D(63.62,v+i,q),D(63.62,v+i,P),D(63.62,v-i,P),f);for(const m of[-1,1])e.quad(D(63.62,v+m*i,q),D(64,v+m*i,q),D(64,v+m*i,P),D(63.62,v+m*i,P),p);for(const[m,T,A]of[[P-1,P-.25,63.46]]){e.quad(D(A,v-i*1.35,m),D(A,v+i*1.35,m),D(A,v+i*1.35,T),D(A,v-i*1.35,T),f);for(const I of[-1,1])e.quad(D(A,v+I*i*1.35,m),D(64,v+I*i*1.35,m),D(64,v+I*i*1.35,T),D(A,v+I*i*1.35,T),p);e.quad(D(A,v-i*1.35,m>q?m:T),D(A,v+i*1.35,m>q?m:T),D(64,v+i*1.35,m>q?m:T),D(64,v-i*1.35,m>q?m:T),M)}if(w+1<h.length){const m=v+i*2.6,T=h[w+1]-i*2.6,A=q+9,I=P-1.5;e.quad(D(63.97,m,A),D(63.97,T,A),D(63.97,T,I),D(63.97,m,I),M),e.quad(D(63.9,m+i,A+.4),D(63.9,T-i,A+.4),D(63.9,T-i,I-.4),D(63.9,m+i,I-.4),f)}}}await t.ctx.yield()}{const o=.00546875/tt,d=[0,...j.decks];for(const[c,C]of[[33.3,45.4],[314.6,326.7],[129.4,133.4]])for(let g=0;g<4;g++){const h=d[g],i=g<3?h+14:51;for(const v of[c,C]){e.quad(D(63.62,v-o,h),D(63.62,v+o,h),D(63.62,v+o,i),D(63.62,v-o,i),f);for(const m of[-1,1])e.quad(D(63.62,v+m*o,h),D(64,v+m*o,h),D(64,v+m*o,i),D(63.62,v+m*o,i),p);e.quad(D(63.46,v-o*1.35,i-1),D(63.46,v+o*1.35,i-1),D(63.46,v+o*1.35,i-.25),D(63.46,v-o*1.35,i-.25),f),e.quad(D(63.46,v-o*1.35,i-1),D(63.46,v+o*1.35,i-1),D(64,v+o*1.35,i-1),D(64,v-o*1.35,i-1),M)}const b=c+o*2.6,q=C-o*2.6,P=h+2.2,w=i-1.8;g<(c===129.4?2:3)||(e.quad(D(63.97,b,P),D(63.97,q,P),D(63.97,q,w),D(63.97,b,w),M),e.quad(D(63.9,b+o,P+.4),D(63.9,q-o,P+.4),D(63.9,q-o,w-.4),D(63.9,b+o,w-.4),f))}for(const[c,C,g,h]of[[33.3,45.4,3,"ws"],[314.6,326.7,3,"wa"],[129.4,133.4,1,"wm"]]){const i=c+o*2.6,b=C-o*2.6;for(let q=0;q<g;q++){const P=i+(b-i)*q/g,w=i+(b-i)*(q+1)/g,v=(P+w)/2*tt;let m=H(...D(63.99,P,0)),T=H(...D(63.99,w,0));const A=H(-Math.cos(v),0,-Math.sin(v));new F.Vector3().subVectors(T,m).cross(H(0,1,0)).dot(A)<0&&([m,T]=[T,m]);const I=new F.Vector3().subVectors(T,m),N=I.length();I.normalize();const Z=new F.Vector3().crossVectors(I,H(0,1,0)).normalize();(t.clockBays||(t.clockBays=[])).push({M:new F.Matrix4().makeBasis(I,H(0,1,0),Z).setPosition(m),n:Z,x0:.23,x1:N-.23,frame:N,prog:g===1?"narrow":"bay",high:g>1,group:h,y0:2.5})}}{const c=Pt(4203),C=a.fork("clockwalls"),g=Pt(4206);for(const b of t.clockBays||[])b.late||(s0(t,b,c,C,g),await t.ctx.yield());const h=Pt(4205),i=C.fork("cheeks");for(const b of t.clockBays||[])b.late&&(s0(t,b,h,i,g),await t.ctx.yield())}}const n=o=>{const d=Math.floor(Math.asin((o-j.archSpring)/j.archHalf)/(Math.PI/36)),c=j.archSpring+j.archHalf*Math.sin(Math.PI*d/36),C=j.archSpring+j.archHalf*Math.sin(Math.PI*(d+1)/36);return j.archHalf*(Math.cos(Math.PI*d/36)+(Math.cos(Math.PI*(d+1)/36)-Math.cos(Math.PI*d/36))*(o-c)/(C-c))};for(let o=0;o<96;o++){const d=-180+o*3.75,c=d+3.75,C=o*4.1887902,g=C+4.1887902;z.pane(D(r,d,51),D(r,c,51),D(r,c,58),D(r,d,58),[C,0],[g,0],[g,7],[C,7],[4.1887902,.22,1e3,0],0,s.iron);for(const[h,i]of[[51,.7],[58,1]]){const b=D(r-.3,d+1.875,h);if(!Vt(b[0],b[1]-.6,b[2])){e.bar([D(r-.3,d,h),D(r-.3,c,h)],[[0,1,0],[0,1,0]],i,.7,s.ironL);continue}if(h===58)for(const[q,P]of[[d,c],[c,d]]){const w=D(r-.3,q,h);if(Vt(w[0],h-i/2,w[2]))continue;const v=D(r-.3,P,h),m=Math.hypot(v[0]-w[0],v[2]-w[2]),T=(v[0]-w[0])/m,A=(v[2]-w[2])/m,I=Math.sign(w[2]),N=(W,_,Y)=>{const $=w[0]-A*W*.35,V=w[2]+T*W*.35,O=Y?(I*n(_)-V)/A:0;return[$+T*O,_,V+A*O]},Z=[h-i/2];for(let W=1;W<18;W++){const _=j.archSpring+j.archHalf*Math.sin(Math.PI*W/36);_>h-i/2+1e-6&&_<h+i/2-1e-6&&Z.push(_)}Z.push(h+i/2);const L=(W,_,Y,$)=>{for(let V=1;V+1<W.length;V++){const O=W[0],U=W[V],K=W[V+1],E=((U[1]-O[1])*(K[2]-O[2])-(U[2]-O[2])*(K[1]-O[1]))*_+((U[2]-O[2])*(K[0]-O[0])-(U[0]-O[0])*(K[2]-O[2]))*Y+((U[0]-O[0])*(K[1]-O[1])-(U[1]-O[1])*(K[0]-O[0]))*$<0;e.tri(O,E?K:U,E?U:K,s.ironL)}};for(const W of[Z[0],Z[Z.length-1]])L([N(-1,W,0),N(1,W,0),N(1,W,1),N(-1,W,1)],0,W-h,0);for(const W of[-1,1])L([N(W,Z[0],0),N(W,Z[Z.length-1],0),...Z.slice().reverse().map(_=>N(W,_,1))],-A*W,0,T*W)}}}const u=j.domeR,y=kt[1],R=kt[0],k=(o,d)=>{const c=o/u;return[Math.sin(c)*Math.cos(d*tt),Math.cos(c),Math.sin(c)*Math.sin(d*tt)]};for(let o=0;o<24;o++){const d=-180+o*15;for(const[c,C,g,h]of[[-.75,1.5,.34,s.iron],[-1.5,.16,.7,s.ironL]]){const i=[],b=[];for(let q=0;q<=14;q++){const P=R+(y-R)*q/14,w=yt(P,d,c);Vt(w[0],w[1]-1.5,w[2])||(i.push(w),b.push(k(P,d)))}i.length>1&&e.bar(i,b,C,g,h)}(o&3)===3&&await t.ctx.yield()}for(let o=1;o<=13;o++){const d=6*o;for(let c=0;c<48;c++){const C=yt(d,c*7.5,-.2),g=yt(d,(c+1)*7.5,-.2),h=k(d,c*7.5+3.75);Vt((C[0]+g[0])/2,C[1]-.6,(C[2]+g[2])/2)||e.bar([C,g],[h,h],.4,.3,o===1?s.ironL:s.iron)}(o&3)===3&&await t.ctx.yield()}await t.ctx.yield();for(let o=0;o<24;o++)for(let d=0;d<12;d++){const c=-180+o*15,C=c+15,g=R+(y-R)*d/12,h=R+(y-R)*(d+1)/12;z.pane(yt(g,c),yt(g,C),yt(h,C),yt(h,c),[0,g],[1,g],[1,h],[0,h],[1e3,0,1e3,0],0,s.iron)}for(let o=0;o<24;o++){const d=o*15,c=d+15;z.pane(D(6,d,96),D(6,c,96),D(6,c,101),D(6,d,101),[o*1.5708,0],[o*1.5708+1.5708,0],[o*1.5708+1.5708,5],[o*1.5708,5],[1.5708,.07,1e3,0],0,s.iron)}e.lathe([[6.3,95.6],[6.3,96.3],[5.7,96.3],[5.7,95.6],[6.3,95.6]],24,s.ironL),e.lathe([[6.4,101],[6.4,101.5],[3.2,103.4],[.5,104.2],[0,106]],24,o=>[s.ironL,s.iron,s.iron,s.brass][o]),e.box(-6,97.6,-.5,6,98.4,.5,s.iron),e.box(-.9,97.3,-.9,.9,98.7,.9,s.ironL),await t.ctx.yield()}),It.push(async t=>{const e=t.col;let z=ft();z.lathe([[.66,0],[.66,.5],[.5,.62],[.42,.95],[.34,1.15],[.3,11.8],[.37,11.95],[.33,12.15],[.56,12.85],[.64,12.95],[.64,13.3]],10,a=>[e.ironD,e.iron,e.ironL,e.iron,e.iron,e.ironL,e.iron,e.ironL,e.iron,e.ironD][a]);for(const a of[-1,1]){const l=[],x=[];for(let S=0;S<=4;S++){const p=S/4*Math.PI/2;l.push([-.1,13.1-2.3*Math.cos(p),a*(.3+2.3*Math.sin(p))]),x.push([0,Math.sin(p),-a*Math.cos(p)])}z.bar(l,x,.22,.2,e.ironL)}t.instanced(z.geometry(),t.mat.solid,t.columns),z=ft(),z.lathe([[.12,0],[.12,.1],[.06,.2],[.17,.56],[.065,1.08],[.11,1.42]],5,a=>[e.ironL,e.iron,e.iron,e.ironL,e.iron][a]),t.instanced(z.geometry(),t.mat.solid,t.balusters),await t.ctx.yield();for(const[a,l,x]of[[t.longNear,!0,"near"],[t.longFar,!1,"far"]]){if(!a.length)continue;const S=t.instanced(V0(l),t.mat.solid,a);t.longTone[x].forEach((p,f)=>S.setColorAt(f,p)),S.instanceColor.needsUpdate=!0}const s=a=>({aSw:{data:a.flatMap(l=>l.sw),size:3}}),r=$0(e.brass,e.steel);for(const a of[t.pends,t.pendsW.wm,t.pendsW.wa,t.pendsW.ws])a.length&&t.instanced(r,t.mat.pend,a.map(l=>l.m),s(a));t.instanced(O0(e.brass),t.mat.pend,t.pendsLong.map(a=>a.m),s(t.pendsLong)),t.balances.length&&t.instanced(j0(e.brass),t.mat.pend,t.balances.map(a=>a.m),s(t.balances)),t.moving["small pendulums"]=t.pends.length+t.pendsLong.length+t.pendsW.wm.length+t.pendsW.wa.length+t.pendsW.ws.length,t.moving.balances=t.balances.length,await t.ctx.yield()});function X0(){const t=(r,a,l)=>{const x=Math.floor(r/a);return x*2*l+Math.min(r-x*a,2*l)},e=(r,a,l,x)=>(t(r+.5*x+l,a,l)-t(r-.5*x+l,a,l))/x;let z=0,s=0;for(let r=.125;r<56;r+=.25)for(let a=6.125;a<96;a+=.25){if(r*r+(a-pt.cy)*(a-pt.cy)>pt.r*pt.r)continue;const l=Math.hypot(r,a-44);if(l<wt.R)continue;const x=Math.min(1,(Q.bars*2*Q.barH+(Q.bars2-Q.bars)*2*Q.h2)/(st*l)),S=Math.min(1,e(l,Q.ringT,Q.ringH,.25)+e(l,Q.ringT2,Q.h2,.25)-e(l,Q.ringT,Q.h2,.25)),p=Math.max(0,Math.min(l+.125,Q.bandR+Q.bandH)-Math.max(l-.125,Q.bandR-Q.bandH))/.25;z+=(1-x)*(1-S)*(1-p*Q.latCover),s++}return qt*z/s}St.push(async t=>{const e=t.w.shd,z=t.w.shdE,s=t.w.paneShd,r=t.col,a=pt,l=Ft;t.hero.lightUniforms.uTptGable.value=X0(),await t.ctx.yield();const x=(h,i,b)=>[b,a.cy+i*Math.cos(h*tt),i*Math.sin(h*tt)],S=h=>[0,Math.cos(h*tt),Math.sin(h*tt)];for(const h of[-1,1]){const i=h*a.z,b=w=>i-h*w,q=H(0,0,-h),P=(w,v,m,T,A,I,N,Z,L)=>w.box(v,m,Math.min(b(T),b(N)),A,I,Math.max(b(T),b(N)),Z,L);for(let w=0;w<14;w++){const v=a.x0+16*w,m=v+16,T=v+8,A=w<7?e:z;P(A,v,0,0,v+1.6,40,1.3,r.iron,"y-"),P(A,v-.15,0,0,v+1.75,2.2,1.5,r.ironD,"y-"),P(A,v+.5,2.6,1.3,v+1.1,37,1.42,r.ironL),P(A,v-.2,36.6,0,v+1.8,38,1.7,r.ironL),A.quad([v+1.6,0,b(.2)],[m,0,b(.2)],[m,7,b(.2)],[v+1.6,7,b(.2)],r.ironD);for(let N=0;N<4;N++)P(A,v+2.2+N*3.45,1,.2,v+5+N*3.45,6,.36,r.iron,"y-");P(A,v+1.6,6.6,0,m,7.2,.7,r.ironL),s.pane([v+1.6,7.2,i],[m,7.2,i],[m,38,i],[v+1.6,38,i],[1.6,0],[16,0],[16,30.8],[1.6,30.8],[1.2,.05,7.7,.05],0,r.iron),P(A,v,38,0,m,40,1,r.iron),P(A,v,38.4,1,m,39.6,1.1,r.ironL);const I=H(T,23,b(.3));ht(A,I,q,[[0,.05],[5.5,.05],[5.5,.6],[4.95,.85],[4.5,.62]],32,N=>[r.ironD,r.iron,r.ironL,r.brass][N]),A.bar([[T-5.4,23,b(.25)],[v+1.6,23,b(.25)]],[[0,1,0],[0,1,0]],.5,.3,r.iron),A.bar([[T+5.4,23,b(.25)],[Math.min(m,a.gableX-.4),23,b(.25)]],[[0,1,0],[0,1,0]],.5,.3,r.iron),A.bar([[T,28.4,b(.25)],[T,38,b(.25)]],[[1,0,0],[1,0,0]],.5,.3,r.iron),A.bar([[T,7.2,b(.25)],[T,17.6,b(.25)]],[[1,0,0],[1,0,0]],.5,.3,r.iron),t.addDial(w<7?"shd":"shdE","middle",I.clone().addScaledVector(q,.62),q,4.5,t.enamel,"tower dials"),w%5===4&&await t.ctx.yield()}P(z,a.gableX-1.2,0,0,a.gableX+.4,40,1.3,r.iron,"y-"),await t.ctx.yield()}const p=a.gableX+.05,f=[];for(let h=0;h<=14;h++){const i=Math.min(a.x0+16*h,a.gableX-.6),b=h<7?e:z;for(const q of[a.r-.15,a.r-2.05]){const P=[],w=[];for(let v=0;v<=24;v++){const m=-90+7.5*v;P.push(x(m,q,i)),w.push(S(m))}b.bar(P,w,.3,.5,r.ironL)}h%3===2&&await t.ctx.yield();for(let q=0;q<24;q++){const P=-90+7.5*q,w=P+7.5,v=a.r-1.9,m=a.r-.3,T=P*tt*(a.r-1.1),A=w*tt*(a.r-1.1);f.push([x(P,v,i),x(w,v,i),x(w,m,i),x(P,m,i),[T,0],[A,0],[A,1.6],[T,1.6],[1.2,.07,0,0],1,r.iron])}}for(let h=-12;h<=12;h++){const i=h*7.5,b=S(i);e.bar([x(i,a.r-.3,a.x0),x(i,a.r-.3,170)],[b,b],.5,.5,r.iron),z.bar([x(i,a.r-.3,170),x(i,a.r-.3,p)],[b,b],.5,.5,r.iron)}await t.ctx.yield();for(let h=0;h<14;h++)for(let i=0;i<24;i++){const b=a.x0+16*h,q=Math.min(b+16,p),P=-90+7.5*i,w=P+7.5,v=P*tt*a.r+100.125*l,m=w*tt*a.r+100.125*l;s.pane(x(P,a.r,b),x(P,a.r,q),x(w,a.r,q),x(w,a.r,b),[b+1601,v],[q+1601,v],[q+1601,m],[b+1601,m],[1,.035,1e3,0],0,r.iron)}const M=Math.sqrt(j.R*j.R-3364),n=a.z-1.3,u=_0(),y=u[u.length-1][0],R=h=>{if(h<=u[0][0]||h>=y)return j.drumY;let i=0;for(;u[i+1][0]<h;)i++;return u[i][1]+(u[i+1][1]-u[i][1])*(h-u[i][0])/(u[i+1][0]-u[i][0])};let k=[];for(let h=0;h<=28;h++)k.push(-56+4*h);k.push(-n,-j.archHalf,-M,M,j.archHalf,n,...u.map(h=>h[0])),k.sort((h,i)=>h-i),k=k.filter((h,i)=>i===0||h-k[i-1]>1e-6);for(let h=0;h<k.length-1;h++){const i=k[h],b=k[h+1],q=Math.abs(i+b)/2,P=v=>q<M?R(v):q<j.archHalf?_t(v):q<n?0:a.cy,w=v=>a.cy+Math.sqrt(Math.max(0,a.r*a.r-v*v));s.pane([58,P(i),i],[58,P(b),b],[58,w(b),b],[58,w(i),i],[i+56,P(i)],[b+56,P(b)],[b+56,w(b)],[i+56,w(i)],[1,.05,8,.05],0,r.iron)}z.box(a.gableX-.1,0,-a.z,a.gableX+.5,6,a.z,r.ironD,"y-");for(let h=0;h<14;h++)z.box(a.gableX-.3,.9,-55+h*8,a.gableX-.1,5.2,-49+h*8,r.iron,"x+");z.box(a.gableX-.5,5.6,-a.z,a.gableX,6.2,a.z,r.ironL);const o=37.2,d=h=>{const i=Math.cos(h),b=Math.sin(h),q=i*4,P=16-a.r*a.r,w=-q+Math.sqrt(q*q-P);let v=1/0;for(let m=0;m<24;m++){const T=(-86.25+7.5*m)*tt,A=i*Math.cos(T)+b*Math.sin(T);A>1e-9&&(v=Math.min(v,(a.r*Math.cos(3.75*tt)-4*Math.cos(T))/A))}return 44+v*i>=a.cy?v:i<0?Math.min(w,-38/i):w},c=[];for(let h=-12;h<=12;h++){const i=x(h*7.5,a.r,p);c.push([(Math.atan2(i[2],i[1]-44)+st)%st,Math.hypot(i[2],i[1]-44)])}const C=(h,i)=>[p,44+i*Math.cos(h),i*Math.sin(h)],g=(h,i)=>[i*Math.sin(h),i*Math.cos(h)];for(let h=0;h<96;h++){const i=h/96*st,b=(h+1)/96*st,q=d(i),P=d(b);if(q<=o&&P<=o)continue;const w=[[i,q],...c.filter(([v])=>v>i+1e-9&&v<b-1e-9),[b,P]];for(let v=0;v+1<w.length;v++){const[m,T]=w[v],[A,I]=w[v+1];s.pane(C(m,o),C(A,o),C(A,Math.max(o,I)),C(m,Math.max(o,T)),g(m,o),g(A,o),g(A,Math.max(o,I)),g(m,Math.max(o,T)),[Q.bars,Q.barH,Q.ringT,Q.ringH],3,r.iron)}}for(let h=0;h<96;h++){let i=C(h/96*st,Math.max(o,d(h/96*st))),b=C((h+1)/96*st,Math.max(o,d((h+1)/96*st)));const q=i[2]+b[2]<0?-1:1,P=a.z-1.3,w=m=>P-q*m[2];if(Math.max(i[1],b[1])<6.001||Math.min(i[1],b[1])>a.cy||w(i)<=1e-6&&w(b)<=1e-6)continue;const v=(m,T)=>{const A=w(m)/(w(m)-w(T));return[p,m[1]+A*(T[1]-m[1]),q*P]};w(i)<0?i=v(i,b):w(b)<0&&(b=v(b,i)),s.pane(i,b,[p,b[1],q*P],[p,i[1],q*P],[w(i),i[1]],[w(b),b[1]],[0,b[1]],[0,i[1]],[2.2,.15,1e3,0],0,r.iron)}await t.ctx.yield();for(const h of f)s.pane(...h);await t.ctx.yield()}),St.push(async t=>{const{scene:e,ENV:z,col:s}=t,r=(k,o=1)=>H(k[0]*o,k[1]*o,k[2]*o),a={...t.fogU(),...z,uTptFaceCol:t.kit.uniforms.uTptFaceCol,uTptStrokeCol:t.kit.uniforms.uTptStrokeCol,uTptHandCol:t.kit.uniforms.uTptHandCol,uTile:{value:[r(dt("#E6DDC3",.8)),r(dt("#1B1F22",1.1)),r(dt("#46627F",1.5)),r(s.brass,.9)]},uPosts:{value:Array.from({length:16},()=>new F.Vector4(0,0,-100,0))},uStone:{value:r(dt("#DAD3C1",.72))},uOpalRef:{value:t.hero.uniforms.uOpalCol.value.clone().multiplyScalar(t.hero.uniforms.uOpalGlow.value*.66)},uRedRef:{value:r(dt(zt[5]))}};t.floorU=a;const l=k=>{const o=k*st/96,d=j.R/Math.cos(Math.PI/96);return[d*Math.cos(o),d*Math.sin(o)]},x=k=>{const o=[],d=[];for(const C of k){const g=o.length/3;let h=0;for(let i=0;i<C.length;i++){const b=C[i],q=C[(i+1)%C.length];h+=q[0]*b[1]-b[0]*q[1],o.push(b[0],-b[1],0)}for(let i=1;i+1<C.length;i++)h>0?d.push(g,g+i,g+i+1):d.push(g,g+i+1,g+i)}const c=new F.BufferGeometry;return c.setAttribute("position",new F.Float32BufferAttribute(o,3)),c.setIndex(d),c},S=(k,o)=>{const d=x(o),c=new F.Mesh(d,new F.ShaderMaterial({uniforms:{...t.fogU(),...a},vertexShader:q0,fragmentShader:T0(k,t.tileFig),fog:!0}));return c.rotation.x=-Math.PI/2,e.add(c),t.calls++,t.tris+=d.index.count/3,c};{const k=[],o=[],d=[];for(let c=23;c<35;c++)k.push([l(c),l(c+1),[l(c+1)[0],128],[l(c)[0],128]]);for(let c=0;c<96;c++)o.push([[0,0],l(c),l(c+1)]);for(const c of a0){const C=c.a*tt,g=Math.cos(C),h=Math.sin(C),i=(b,q)=>[g*q-h*b,h*q+g*b];for(let b=0;b<96;b++){const q=l(b),P=l(b+1),w=-h*q[0]+g*q[1],v=g*q[0]+h*q[1],m=-h*P[0]+g*P[1],T=g*P[0]+h*P[1];if(v<0||T<0||Math.min(w,m)>=10||Math.max(w,m)<=-10)continue;const A=Y=>(Y-w)/(m-w),I=Math.max(0,Math.min(1,m>w?A(-10):A(10))),N=Math.max(0,Math.min(1,m>w?A(10):A(-10))),Z=w+(m-w)*I,L=v+(T-v)*I,W=w+(m-w)*N,_=v+(T-v)*N;o.push([i(Z,L),i(W,_),i(W,65.5),i(Z,65.5)])}}for(let c=-9;c<9;c++)d.push([l(c),l(c+1),[284,l(c+1)[1]],[284,l(c)[1]]]);for(const c of[-1,1])d.push([l(9*c),[l(9)[0],56*c],[284,56*c],[284,l(9*c)[1]]]);S(0,k),S(1,o),S(2,d)}const p=new F.Mesh(new F.SphereGeometry(1,24,16),new F.ShaderMaterial({uniforms:{uTime:z.uTime,uSunDir:z.uSunDir,uZen:{value:H(.1,.3,.78)},uHor:{value:H(.19,.41,.87)},uMist:{value:t.rain?H(.52,.56,.62):H(.95,.96,.96)},uMistSh:{value:t.rain?H(.23,.28,.37):H(.18,.31,.66)},uBand:{value:t.rain?H(.66,.69,.74):H(1,1.03,1.06)},uCl:{value:t.look==="cloud"?new F.Vector4(.9,.44,3.2,0):t.rain?new F.Vector4(1.4,.5,2.6,1):new F.Vector4(1.7,.57,2.4,0)},uClEdge:{value:t.look==="sun"?.1:.2}},vertexShader:D0,fragmentShader:R0(A0[t.look==="cloud"?"cloud":"sun"])+I0,side:F.BackSide,depthWrite:!1,fog:!1}));p.frustumCulled=!1,p.renderOrder=-1,e.add(p),t.calls++,t.tris+=384*2,await t.ctx.yield();const f=ft(),M=dt("#2A3A55",1,.6),n=xt.len;f.box(-.7,-2.2,-.45,.7,0,.45,s.brass),f.box(-.25,-4.2,-.12,.25,-2.2,.12,M);const u=[[.34,-4]];for(let k=-12;k>-78;k-=11)u.push([.3,k+.9],[.5,k+.6],[.5,k-.6],[.3,k-.9]);u.push([.3,-n+6.2],[.6,-n+5.8],[.6,-n+5.2]),f.lathe(u,10,k=>k%4===2?s.brass:M);const y=[[0,1],[1.4,.97],[1.5,1.08],[1.8,1.05],[1.9,.93],[3.2,.78],[4.2,.52],[4.45,.55],[4.7,.36],[4.9,.2],[5,0],[4.9,-.2],[4.7,-.36],[4.45,-.55],[4.2,-.52],[3.2,-.78],[1.9,-.93],[1.8,-1.05],[1.5,-1.08],[1.4,-.97],[0,-1]];f.M=new F.Matrix4().makeRotationX(Math.PI/2).setPosition(0,-n,0),f.lathe(y,48,k=>k>=1&&k<=3||k>=16&&k<=18||k===7||k===12?s.brassD:s.brass),f.M=null;for(const k of[1,-1])for(let o=0;o<24;o++){const d=o/24*st;ht(f,H(3.75*Math.cos(d),-n+3.75*Math.sin(d),k*.62),H(0,0,k),[[.2,0],[.14,.12],[0,.16]],6,s.brassD)}for(const k of[1,-1])f.box(-.42,-n-5.3,k*1,.42,-n+5.3,k*1.14,M);f.lathe([[.42,-n-5.2],[.8,-n-5.5],[.8,-n-6.3],[.3,-n-6.6],[0,-n-7.2]],10,s.brassD);const R=new F.Mesh(f.geometry(),t.mat.solid);R.position.set(0,xt.pivotY,0),R.frustumCulled=!1,e.add(R),t.calls++,t.tris+=f.triangles,t.updaters.push((k,o)=>{const d=xt.amp*Math.sin(st*o/xt.period);R.rotation.z=d,z.uBob.value.set(n*Math.sin(d),xt.pivotY-n*Math.cos(d),0)}),await t.ctx.yield()}),It.push(async t=>{const e=()=>t.ctx.yield();{const s=t.w.pas.P,r=t.w.pas.N,a=t.w.pas.C,l=s.length/9,x=new Uint8Array(l),S=[0,0,0,0];for(let p=0,f=0;f<l;p+=9,f++){const M=s[p],n=s[p+3],u=s[p+6],y=s[p+2],R=s[p+5],k=s[p+8],o=Math.max(M,n,u)-Math.min(M,n,u)>25||Math.max(y,R,k)-Math.min(y,R,k)>30;S[x[f]=o?2:Bt((M+n+u)/3,(y+R+k)/3)]++}await e();for(let p=0;p<4;p++){if(!S[p])continue;const f=new Float32Array(S[p]*9),M=new Float32Array(S[p]*9),n=new Float32Array(S[p]*12);for(let y=0,R=0;y<l;y++)if(x[y]===p){for(let k=0;k<9;k++)f[R*9+k]=s[y*9+k],M[R*9+k]=r[y*9+k];for(let k=0;k<12;k++)n[R*12+k]=a[y*12+k];R++}const u=new F.BufferGeometry;u.setAttribute("position",new F.BufferAttribute(f,3)),u.setAttribute("normal",new F.BufferAttribute(M,3)),u.setAttribute("aCol",new F.BufferAttribute(n,4)),t.mesh(u,t.mat.solid),await e()}}for(const s of["crt","crt2","shd","shdE","wm","wa","ws"])t.w[s].triangles&&t.mesh(await t.w[s].geometry(e),t.mat.solid),await e();for(const s of["panePas","paneCrt","paneShd"])t.w[s].triangles&&t.mesh(await t.w[s].geometry(e),t.mat.pane,1),await e();const z=s=>({aKind:{data:s.map(r=>r[1]),size:1}});for(const s of["near","middle","far"])for(const r in t.dials[s]){const a=t.dials[s][r],l=a.map(x=>x[0]);t.instanced(t.kit[s].geometry,t.kit[s].material,l,z(a)),s==="near"&&t.instanced(t.kit.near.glassGeometry,t.kit.near.glassMaterial,l,z(a),2),await t.ctx.yield()}});const Ut=34,Y0=.3,Z0=12,Lt=.5;function r0(t){if(!t.eyes){const e=new F.Vector3;t.eyes=new Float32Array(333*3);for(let z=0;z<333;z++)t.path.posAtDist(254+z*.5,e),t.eyes[z*3]=e.x,t.eyes[z*3+1]=e.y,t.eyes[z*3+2]=e.z}return t.eyes}function K0(t,e,z,s,r){let a=1/0;for(let l=0;l<t.length;l+=3){const x=t[l];if(e<=x+.5)continue;const S=(e-x)/(pt.gableX-x),p=t[l+1]+S*(44-t[l+1]),f=s-t[l+2]*(1-S);a=Math.min(a,Math.hypot(Math.max(z,p)-p,f)-S*Ut-r)}return a}let i0=0;function Q0(t,e,z,s,r){const a=t[e];if(z<=a+.5)return-1/0;const l=(z-a)/(pt.gableX-a),x=t[e+1]+l*(44-t[e+1]),S=s-t[e+2]*(1-l),p=l*Ut+r;return S<p&&-S<p?x+Math.sqrt(p*p-S*S):-1/0}function Xt(t,e,z,s,r=1){let a=-1/0;for(let l=0;l<t.length;l+=3*r){const x=t[l];if(e<=x+.5)continue;const S=(e-x)/(pt.gableX-x),p=t[l+1]+S*(44-t[l+1]),f=z-t[l+2]*(1-S),M=S*Ut+s;if(Math.abs(f)<M){const n=p+Math.sqrt(M*M-f*f);n>a&&(a=n,i0=l)}}return a}const Wt=[[0,0,4.4],[-4.6,-2.5,3],[4.2,5,1.15],[5,7.7,.65]],vt=[-2.5,1.95];function Yt(t,e,z,s){let r=1/0;for(let a=0;a<t.length;a+=3){const l=t[a],x=t[a+1],S=t[a+2];if(e<=l+.5)continue;const p=(e-l)/(pt.gableX-l),f=x+p*(44-x),M=S*(1-p),n=p*Z0;for(const[u,y,R]of Wt)r=Math.min(r,Math.hypot(Math.max(s+u,Math.min(s+y,f))-f,z-M)-n-R);r=Math.min(r,Math.hypot(Math.max(0,Math.min(s+vt[0],f))-f,z-M)-n-vt[1])}return r}function J0(t){if(!t.handBars){const e=t.handBars=new Float32Array(7992);for(let z=0,s=0;z<333;z++){const r=v0(254+z*.5);for(const[a,l]of[[wt.minute,r.minuteDeg],[wt.hour,r.hourDeg]]){const x=Math.cos(l*Math.PI/180),S=Math.sin(l*Math.PI/180),p=pt.gableX-a.z;e.set([p,44+a.u0*x,a.u0*S,44+(a.tip-a.Re)*x,(a.tip-a.Re)*S,a.Re,p,44-wt.bossOut*x,-wt.bossOut*S,44-a.cu*x,-a.cu*S,a.cr],s),s+=12}}}return t.handBars}function l0(t,e,z,s,r,a,l){const x=a-s,S=l-r,p=x*x+S*S;if(x!==0&&(s-t)*(a-t)<=0){const d=r+(t-s)/x*S;if(d>=e&&d<=z)return 0}const f=p>0?Math.max(0,Math.min(1,((t-s)*x+(e-r)*S)/p)):0,M=p>0?Math.max(0,Math.min(1,((t-s)*x+(z-r)*S)/p)):0,n=t-s-x*f,u=e-r-S*f,y=t-s-x*M,R=z-r-S*M,k=r-Math.max(e,Math.min(z,r)),o=l-Math.max(e,Math.min(z,l));return Math.sqrt(Math.min(n*n+u*u,y*y+R*R,(s-t)*(s-t)+k*k,(a-t)*(a-t)+o*o))}function Zt(t,e,z,s,r,a=1/0){for(let l=0,x=0;l<t.length;l+=3,x+=24){const S=t[l],p=t[l+1],f=t[l+2];if(!(z<=S+.5))for(let M=x;M<x+24;M+=6){const n=(z-S)/(e[M]-S),u=p+n*(e[M+1]-p),y=f+n*(e[M+2]-f),R=p+n*(e[M+3]-p),k=f+n*(e[M+4]-f),o=n*e[M+5],d=Math.max(Math.min(y,k)-s,s-Math.max(y,k),0),c=Math.max(Math.min(u,R)-r-7.7,0),C=a+o+4.4;if(!(C<1e9&&d*d+c*c>=C*C)){for(const[g,h,i]of Wt)a=Math.min(a,l0(s,r+g,r+h,y,u,k,R)-i-o);a=Math.min(a,l0(s,0,r+vt[0],y,u,k,R)-vt[1]-o)}}}return a}function c0(t,e,z,s,r){if(Yt(t,z,s,r)>=Lt)return r;let a=7;for(let x=0;x<18;x++){const S=(a+r)/2;Yt(t,z,s,S)>=Lt?a=S:r=S}const l=x=>Zt(t,e,z,s,x,Lt)>=Lt;if(l(a))return a;for(r=a,a=Math.max(7,r-.5);a>7&&!l(a);)r=a,a=Math.max(7,r-.5);for(let x=0;x<12;x++){const S=(a+r)/2;l(S)?a=S:r=S}return a}function h0(t,e){const z=r0(t),s=J0(t),r=[];for(const[a,l,x,S]of[[300+14*e,(e%2?1:-1)*10,"near",0],[307+14*e,(e%2?-1:1)*21,"middle",(e>>1)%2?-4:4]]){const p=t.path.posAtDist(a),f=t.path.tangentAtDist(a),M=Math.hypot(f.x,f.z),n=-f.z/M,u=f.x/M;let y=l,R=p.x+n*y,k=p.z+u*y,o=c0(z,s,R,k,p.y+S);for(;o>=p.y+S&&Math.abs(y)<20&&Zt(z,s,R,k,o,Lt)<Lt;)y+=Math.sign(y)*2,R=p.x+n*y,k=p.z+u*y,o=c0(z,s,R,k,p.y+S);r.push({x:R,y:o,z:k,off:Math.abs(y),yaw:Math.atan2(-f.x,-f.z),weight:x,held:o<p.y+S,cone:Yt(z,R,k,o),hands:Zt(z,s,R,k,o)})}return r}function f0(t){if(!t.postPlan){t.postPlan=[];for(let e=0;e<8;e++)t.postPlan.push(...h0(t,e))}return t.postPlan}function d0(t,e,z,s){let r=-1/0;for(const a of t){const l=e-a.x,x=z-a.z,S=4.4+s;if(l>S||l<-S||x>S||x<-S)continue;const p=Math.sqrt(l*l+x*x);for(const[,f,M]of Wt)p<M+s&&(r=Math.max(r,a.y+f+Math.sqrt((M+s)*(M+s)-p*p)));p<vt[1]+s&&(r=Math.max(r,a.y+vt[0]+Math.sqrt((vt[1]+s)*(vt[1]+s)-p*p)))}return r}function B0(t,e,z,s,r,a){let l=1/0;for(const x of t){const S=Math.hypot(e-x.x,r-x.z);for(const[p,f,M]of Wt)l=Math.min(l,Math.hypot(S,Math.max(0,z-(x.y+f),x.y+p-s))-M-a);l=Math.min(l,Math.hypot(S,Math.max(0,z-(x.y+vt[0])))-vt[1]-a)}return l}const te=(t,e)=>1.26*t+1.3*e,u0=.3,ee=(t,e)=>Math.max(t.size+.22*e.R+e.swing,e.size+.22*t.R+t.swing)+u0,oe=(t,e)=>t.size+e.size+u0;function ae(t,e){const z=t.x-e.x,s=t.z-e.z,r=t.y-e.y,a=Math.sqrt(z*z+s*s),l=r>=0?t:e,x=r>=0?e:t;return Math.min(Math.sqrt(a*a+r*r)-t.size-e.size,a-l.size-.22*x.R-x.swing)}function Kt(t,e,z,s){const r=ft(),a=nt(z,1.18);if(r.M=new F.Matrix4().makeRotationX(-Math.PI/2),e>=4){r.lathe([[1,0],[1.09,.05],[1.1,.2],[1.02,.3]],t,x=>[a,z,s][x]);const l=[[1.02,.3],[.62,.39],[.3,.42],[0,.42]];for(let x=0;x<3;x++)for(let S=x<2?0:1;S<t;S+=x<2?1:2){const p=S/t*st,f=(S+1)/t*st,[M,n]=l[x],[u,y]=l[x+1],R=(S+x)%2?s:a,k=(o,d,c)=>[o*Math.cos(c),d,o*Math.sin(c)];u>0?r.quad(k(M,n,p),k(u,y,p),k(u,y,f),k(M,n,f),R):r.tri(k(M,n,p-st/t),[0,y,0],k(M,n,f),z)}}else r.lathe(e===3?[[1,0],[1.08,.12],[.8,.32],[0,.42]]:[[1,0],[1.07,.14],[0,.42]],t,l=>l%2?s:z);if(r.M=new F.Matrix4().makeTranslation(0,0,-.14),e>=4){r.lathe([[.12,1.02],[.12,1.12]],6,s);for(let x=0;x<6;x++){const S=x/6*st,p=(x+1)/6*st,f=x%2?s:a,M=(n,u,y)=>[n*Math.cos(y),u,n*Math.sin(y)];r.quad(M(.2,1.12,S),M(.2,1.12,p),M(.2,1.27,p),M(.2,1.27,S),f),r.tri(M(.2,1.27,S),M(.2,1.27,p),[0,1.31,0],z)}const l=8;for(let x=0;x<l;x++){const S=x/l*st,p=(x+1)/l*st,f=(M,n,u)=>[n*Math.cos(M),1.49+n*Math.sin(M),u];r.quad(f(S,.16,0),f(p,.16,0),f(p,.215,.045),f(S,.215,.045),a),r.quad(f(S,.215,.045),f(p,.215,.045),f(p,.215,-.045),f(S,.215,-.045),z),r.quad(f(S,.215,-.045),f(p,.215,-.045),f(p,.16,0),f(S,.16,0),s)}}else{const x=1.68-.215*Math.sin(st/6),S=x-.215*Math.sin(st/6);e>=3?r.lathe([[.12,1.02],[.17,1.08],[.17,1.27],[.1,S+.016]],4,z):r.quad([-.07,1.03,0],[.07,1.03,0],[.07,S,0],[-.07,S,0],z);for(let p=0;p<6;p++){const f=p/6*st,M=(p+1)/6*st,n=(u,y)=>[y*Math.cos(u),x+y*Math.sin(u),0];r.quad(n(f,.15),n(M,.15),n(M,.215),n(f,.215),z)}}return r.M=null,r.geometry()}St.push(async t=>{const e=t.rng.fork("watches"),z=Pt(4201),s=Pt(4202),r=Pt(4204),a=pt,l=5.6,x=l*.8660254,S=Math.min(1,t.density),p=[];if(!t.postPlan){const L=[];for(let W=0;W<8;W++)L.push(...h0(t,W)),await t.ctx.yield();t.postPlan=L}const f=L=>{e(),e();const W=e()*st,_=e()*st,Y=7+5*e(),$=(e()-.5)*1.2,V=e()*st;e();const O=r()<.25,U=L||O,K=r(),E=.2+.3*r();return(G,X,J,rt,B=!0)=>{const ot=U?.56+.14*K:.35+.15*K;p.push({x:G,y:J,z:X,R:ot,swing:E,size:te(ot,E),gathered:L,yEye:rt,kept:B,facing:H(-Math.cos($),0,Math.sin($)),ph1:W,t1:Y,ph2:_,az:V})}},M=new F.Vector3,n=new F.Vector3;for(let L=0;L<28;L++){for(let W=0;W<12;W++){const _=s(),Y=s(),$=s();s();const V=258.6+2.74*L+(_-.5)*2.4,O=W<6?-1:1,U=O*(4.9+3.5*(W%6)+(.15+.7*Y)*3.5);t.path.posAtDist(V,M),t.path.tangentAtDist(V,n);const K=Math.hypot(n.x,n.z)||1,E=M.x-n.z/K*U,G=M.z+n.x/K*U,X=M.y+(2*$-1)*11.5,J=f(!0);E*E+G*G<4624||Math.abs(G)>53||E<60||t.path.nearestXZ(E,G).dist<4.7||J(E,G,X,M.y)}(L&3)===3&&await t.ctx.yield()}let u=0;for(let L=-52;L<=52;L+=x,u++){for(let W=62+u%2*l/2;W<=190;W+=l){const _=(z()-.5)*3,Y=(z()-.5)*3,$=16+38*z(),V=z(),O=z(),U=4.9+1.6*z();let K=W+_,E=Math.max(-53,Math.min(53,L+Y));const G=f(!1);if(K*K+E*E<4489||V>(K<=135?1:1-.7*(K-135)/55))continue;const X=t.path.nearestXZ(K,E),J=X.u*t.L;if(!(X.dist<=26.5&&J>=257&&J<=336)){if(X.dist<4.7){const rt=t.path.pointAt(X.u),B=t.path.tangentAt(X.u),ot=Math.hypot(B.x,B.z)||1,at=-B.z/ot,it=B.x/ot,lt=(K-rt.x)*at+(E-rt.z)*it<0?-1:1;K=rt.x+at*lt*U,E=rt.z+it*lt*U}G(K,E,$,void 0,O<=S)}}u&1&&await t.ctx.yield()}const y=r0(t),R=f0(t),k=[],o=L=>a.cy+Math.sqrt(a.r*a.r-L*L)-.3;for(let L=230;L<=t.L;L+=.5)t.path.posAtDist(L,M),k.push(M.x,M.z);const d=(L,W)=>{let _=1/0;for(let Y=0;Y<k.length;Y+=2){const $=L-k[Y],V=W-k[Y+1],O=$*$+V*V;O<_&&(_=O)}return Math.sqrt(_)},c=3.2,C=new Map,g=(L,W)=>Math.floor(L/c)*1e3+Math.floor(W/c),h=new Map,i=(L,W)=>{const _=g(L,W);let Y=h.get(_);if(!Y){Y=[];for(let $=-1;$<=1;$++)for(let V=-1;V<=1;V++){const O=C.get(_+$*1e3+V);if(O)for(let U=0;U<O.length;U++)Y.push(O[U])}h.set(_,Y)}return Y};let b=0,q=0,P=0,w=0,v=0;for(const L of p){const W=L.size+Y0+.01,_=L.size+Lt+.01,Y=(G,X,J=0,rt=1/0)=>{const B=rt*rt-J*J,ot=Q0(y,v,G,X,W)-L.y;if(ot>0&&ot*ot>=B)return 1/0;const at=Xt(y,G,X,W,8);if(at>L.y&&(at-L.y)*(at-L.y)>=B)return v=i0,1/0;const it=i(G,X);for(let ut=0;ut<it.length;ut++){const mt=it[ut],Mt=G-mt.x,gt=X-mt.z,bt=ee(L,mt)+.005;if(Mt*Mt+gt*gt<bt*bt)return 1/0}let lt=Math.max(L.y,d0(R,G,X,_));if(lt>120||Math.hypot(J,lt-L.y)>=rt||(lt=Math.max(lt,at),Math.hypot(J,lt-L.y)>=rt))return 1/0;lt=Math.max(lt,Xt(y,G,X,W));for(let ut=0,mt=!0;mt&&ut<40;ut++){mt=!1;for(let Mt=0;Mt<it.length;Mt++){const gt=it[Mt],bt=Math.hypot(G-gt.x,X-gt.z),Ct=oe(L,gt)+.005;if(bt<Ct){const Rt=Math.sqrt(Ct*Ct-bt*bt);Math.abs(lt-gt.y)<Rt&&(lt=gt.y+Rt,mt=!0)}}}return lt<=o(X)-1.68*L.R-2&&!(L.gathered&&lt>L.yEye+11.5)?lt:1/0},$=L.x,V=L.z,O=L.y,U=Y($,V);let K=U-O;if(K>0){Xt(y,$,V,W)>O?b++:d0(R,$,V,_)>O?q++:P++;let G=$,X=V,J=U;const rt=(B,ot)=>{const at=$+.5*B,it=V+.5*ot,lt=.5*Math.sqrt(B*B+ot*ot);if(lt>=K||Math.abs(it)>53||at>192||at*at+it*it<4489)return;const ut=Y(at,it,lt,K),mt=Math.hypot(lt,ut-O);mt<K&&d(at,it)>=4.7&&(K=mt,G=at,X=it,J=ut)};for(let B=1;B<=400&&.5*B<K;B++){for(let ot=-B;ot<=B;ot++)rt(ot,-B),rt(ot,B),ot!==-B&&ot!==B&&(rt(-B,ot),rt(B,ot));(B&7)===7&&await t.ctx.yield()}L.x=G,L.z=X,L.y=J,K<1/0||(L.kept=!1),await t.ctx.yield()}const E=g(L.x,L.z);C.has(E)||C.set(E,[]),C.get(E).push(L);for(let G=-1;G<=1;G++)for(let X=-1;X<=1;X++)h.delete(E+G*1e3+X);(++w&7)===7&&await t.ctx.yield()}t.watches=p.filter(L=>L.kept);const m=(L,W)=>{const _=Math.floor(Math.asin(L/W)/tt/7.5)*7.5*tt,Y=_+7.5*tt,$=W*Math.sin(_),V=W*Math.sin(Y);return a.cy+W*(Math.cos(_)+(Math.cos(Y)-Math.cos(_))*(L-$)/(V-$))},T=L=>{const W=Math.abs(L.z)+.03,_=m(W,a.r)-.02,Y=U=>.28+L.swing*Math.max(0,_-U)/(_-L.y),$=U=>Math.max(-.17,Math.min(.17,U));let V=_;L.arm=null;for(let U=-11;U<=11;U++){const K=U*7.5*tt,E=Math.cos(K),G=Math.sin(K),X=(a.r-.3)*G,J=a.cy+(a.r-.3)*E,rt=Y(J-.4),B=(lt,ut)=>{const mt=(lt-X)*G,Mt=(lt-X)*E;let gt=(-ut-mt)/E,bt=(ut-mt)/E;if(Math.abs(G)>1e-9){const Ct=(Mt-ut)/G,Rt=(Mt+ut)/G;gt=Math.max(gt,Math.min(Ct,Rt)),bt=Math.min(bt,Math.max(Ct,Rt))}else if(Math.abs(Mt)>ut)return null;return gt<=bt?gt:null},ot=B(L.z,rt);if(ot===null)continue;const at=B(L.z,.25);let it=ot;if(at!==null){it=at;for(const ut of[-.03,.03]){const mt=B(L.z+ut,.25);mt!==null&&mt<it&&(it=mt)}const lt=X-.25*G+.25*Math.sign(G)*E;Math.abs(lt-L.z)<=.03&&(it=Math.min(it,-.25*(E+Math.abs(G))))}if(!(J+it-.02>=V)&&(V=J+it-.02,L.arm=null,at===null||at-it>.04)){const lt=$((L.z-X)*G+(V-J)*E),ut=$((L.z-X)*E-(V-J)*G);L.arm=[L.x,J+lt*E-ut*G,X+lt*G+ut*E]}}const O=m(W,a.r-2.2)-.02;for(let U=0;U<=14;U++){const K=Math.min(a.x0+16*U,a.gableX-.6),E=L.x-K;Math.abs(E)>Y(O)||O>=V||(V=O,L.arm=null,(Math.abs(E)>.25||m(Math.abs(L.z),a.r-2.2)-O>.06)&&(L.arm=[K+$(E),m(Math.abs(L.z),a.r-2.05),L.z]))}return V};let A=0,I=1/0,N=1/0,Z=1/0;w=0;for(const L of t.watches){if(L.top=T(L),L.Lc=L.top-L.y,L.d=t.planDist(L.x,L.z),L.arm){const W=L.arm,_=[L.x-W[0],L.top-W[1],L.z-W[2]],Y=Math.hypot(_[0],_[1],_[2]),$=1+.04/Y,V=Math.abs(_[0])>1e-6?[0,0,1]:[1,0,0];(L.x<170?t.w.shd:t.w.shdE).bar([[W[0]+_[0]*$,W[1]+_[1]*$,W[2]+_[2]*$],W],[V,V],.08,.08,t.col.iron,!0)}L.sw=[L.ph1,L.t1,L.ph2,6+.1*L.Lc],L.sw2=[L.Lc,L.swing/L.Lc,L.az],I=Math.min(I,K0(y,L.x,L.y,L.z,L.size)),N=Math.min(N,B0(R,L.x,L.y,L.top,L.z,L.size));for(const W of i(L.x,L.z))W!==L&&W.kept&&(Z=Math.min(Z,ae(L,W)));if(L.gathered){const W=t.path.nearestXZ(L.x,L.z),_=W.u*t.L;W.dist<=26&&_>=258&&_<=335&&Math.abs(L.y-t.path.posAtDist(_,n).y)<=12&&A++}(++w&31)===31&&await t.ctx.yield()}t.gathered=A,t.sight.watches=Math.round(I*100)/100,t.sight.watchesMoved=b,t.watchToPost={margin:Math.round(N*100)/100,moved:q},t.watchToWatch={margin:Math.round(Z*100)/100,moved:P}}),It.push(async t=>{const e=t.col,z={near:[],middle:[],far:[]};for(const x of t.watches)z[x.d<10?"near":x.d<30?"middle":"far"].push(x);const s={near:Kt(16,4,e.brass,e.brassD),middle:Kt(10,3,e.brass,e.brassD),far:Kt(8,2,e.brass,e.brassD)};for(const x of["near","middle","far"]){const S=z[x];if(!S.length)continue;const p=S.map(n=>t.dialMatrix(H(n.x,n.y,n.z),n.facing,n.R)),f=()=>({aSw:{data:S.flatMap(n=>n.sw),size:4},aSw2:{data:S.flatMap(n=>n.sw2),size:3}}),M={aKind:{data:S.map(()=>t.enamel),size:1}};for(const n of[t.instanced(t.kitW[x].geometry,t.kitW[x].material,p,{...f(),...M}),t.instanced(s[x],t.mat.watch,p,f()),x==="near"?t.instanced(t.kitW.near.glassGeometry,t.kitW.near.glassMaterial,p,{...f(),...M},2):null])n&&(n.frustumCulled=!1);t.count.watches=(t.count.watches||0)+S.length,await t.ctx.yield()}const r=new F.InstancedBufferGeometry;r.setAttribute("position",new F.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,0,0,1,1,0,-1,1,0],3));const a=t.watches;r.setAttribute("aTop",new F.InstancedBufferAttribute(new Float32Array(a.flatMap(x=>[x.x,x.top,x.z])),3)),r.setAttribute("aLen",new F.InstancedBufferAttribute(new Float32Array(a.map(x=>x.Lc-1.68*x.R)),1)),r.setAttribute("aSw",new F.InstancedBufferAttribute(new Float32Array(a.flatMap(x=>x.sw)),4)),r.setAttribute("aSw2",new F.InstancedBufferAttribute(new Float32Array(a.flatMap(x=>x.sw2)),3)),r.instanceCount=a.length;const l=new F.Mesh(r,new F.ShaderMaterial({uniforms:{...t.fogU(),...t.ENV,uBrass:{value:H(e.brass[0],e.brass[1],e.brass[2])}},vertexShader:W0,fragmentShader:F0,fog:!0,side:F.DoubleSide,transparent:!0,depthWrite:!1}));l.frustumCulled=!1,l.renderOrder=1,t.scene.add(l),t.calls++,t.tris+=2*a.length});function ne(t){const e=ft();e.box(-2.15,-2.15,-2.15,2.15,2.15,2.15,t.iron);for(let s=0;s<4;s++){const r=H(Math.sin(s*Math.PI/2),0,Math.cos(s*Math.PI/2));ht(e,r.clone().multiplyScalar(2.15),r,[[2.08,0],[2.08,.2],[1.9,.32],[1.72,.22]],20,n=>[t.ironD,t.ironL,t.iron][n]);const a=2.22*(Math.sin(s*Math.PI/2)+Math.cos(s*Math.PI/2)),l=2.22*(Math.cos(s*Math.PI/2)-Math.sin(s*Math.PI/2));e.lathe([[.2,-2.35],[.32,-2.1],[.19,-1.9],[.19,1.9],[.32,2.1],[.2,2.35]],6,n=>n===2?t.ironL:t.brassD,a,l);const x=H(r.z,0,-r.x),S=(n,u,y)=>[r.x*y+x.x*n,u,r.z*y+x.z*n];for(const[n,u]of[[-1.78,-1.78],[1.78,-1.78],[-1.78,1.78],[1.78,1.78]])ht(e,H(...S(n,u,2.15)),r,[[.24,0],[.17,.1],[0,.14]],6,t.brassD);for(let n=0;n<8;n++){const u=-1.75+n*.5,y=S(u-.14,1.93,2.15),R=S(u+.14,2.15,2.3);e.box(Math.min(y[0],R[0]),1.93,Math.min(y[2],R[2]),Math.max(y[0],R[0]),2.15,Math.max(y[2],R[2]),t.ironL,"y+")}e.tri(S(-1.9,2.5,2.56),S(1.9,2.5,2.56),S(0,3.45,2.56),t.ironL),e.quad(S(-1.9,2.5,2.56),S(0,3.45,2.56),S(0,3.45,1.2),S(-1.9,2.5,1.9),t.iron),e.quad(S(1.9,2.5,2.56),S(0,3.45,2.56),S(0,3.45,1.2),S(1.9,2.5,1.9),t.ironD),ht(e,H(...S(0,2.82,2.56)),r,[[.2,0],[.14,.08],[0,.12]],6,t.brass);const p=[],f=[],M=H(r.x+x.x,0,r.z+x.z).normalize();for(let n=0;n<=5;n++){const u=n/5*Math.PI/2,y=.75+2.1*Math.sin(u),R=-2.5-2*Math.cos(u);p.push([M.x*y,R,M.z*y]),f.push([M.x*Math.cos(u),Math.sin(u),M.z*Math.cos(u)])}e.bar(p,f,.24,.2,t.ironL)}e.box(-2.55,2.15,-2.55,2.55,2.5,2.55,t.ironL),e.box(-2.4,-2.45,-2.4,2.4,-2.15,2.4,t.ironL);const z=Math.SQRT2;return e.lathe([[2.45*z,2.5],[2.2*z,2.95],[1.25*z,3.7],[.5*z,4.6],[.3*z,5]],4,s=>s%2?t.iron:t.ironD,0,0,Math.PI/4,Math.PI/4+st),e.lathe([[.38,5],[.62,5.3],[.26,5.6],[.52,6],[.13,6.4],[.1,7.3],[0,7.7]],8,t.brass),e.lathe([[.55,-5],[.72,-4.6],[.6,-4.2],[1.2,-3.25],[2.25,-2.6],[2.4,-2.45]],12,s=>[t.ironL,t.iron,t.ironD,t.iron,t.ironL][s]),e.geometry()}function se(t){const e=ft();e.lathe([[1.95,0],[1.95,.8],[1.62,1],[1.5,2.7],[1.72,2.95],[1.72,3.2],[1.1,3.8],[.92,5.3],[1.2,5.55],[1.2,5.75],[.75,6.3],[.62,6.6]],8,z=>[t.ironD,t.iron,t.iron,t.ironL,t.ironD,t.iron,t.iron,t.ironL,t.ironD,t.iron,t.ironL][z],0,0,Math.PI/8,Math.PI/8+st);for(let z=0;z<4;z++)ht(e,H(1.5*Math.sin(z*Math.PI/2),1.85,1.5*Math.cos(z*Math.PI/2)),H(Math.sin(z*Math.PI/2),0,Math.cos(z*Math.PI/2)),[[.5,0],[.4,.14],[0,.2]],8,t.brassD);return e.geometry()}function re(t){const e=ft(),z=[[.62,0],[.57,.02],[.545,.33],[.5,1]];for(let s=0;s<z.length-1;s++)for(let r=0;r<12;r++){const a=r/12*st,l=(r+1)/12*st,[x,S]=z[s],[p,f]=z[s+1];e.quad([x*Math.cos(a),S,x*Math.sin(a)],[x*Math.cos(l),S,x*Math.sin(l)],[p*Math.cos(l),f,p*Math.sin(l)],[p*Math.cos(a),f,p*Math.sin(a)],r%2?t.iron:t.ironD)}return e.lathe([[.68,.33],[.68,.345],[.56,.35]],12,t.ironL),e.lathe([[.64,.66],[.64,.675],[.54,.68]],12,t.ironL),e.geometry()}St.push(async t=>{const e=t.col,z=[],s=[],r=[];t.posts=[];let a=1/0,l=1/0,x=0;const S=({x:I,y:N,z:Z,yaw:L,weight:W,cone:_,off:Y,held:$,hands:V})=>{a=Math.min(a,_),$?l=Math.min(l,V):V<0&&x++;const O=Math.min(6.6,N-5);z.push(new F.Matrix4().makeRotationY(L).setPosition(I,N,Z)),s.push(new F.Matrix4().makeScale(1,O/6.6,1).setPosition(I,0,Z)),N-5-O>.05&&r.push(new F.Matrix4().makeScale(1,N-5-O,1).setPosition(I,O,Z));for(let U=0;U<4;U++){const K=H(Math.sin(U*Math.PI/2),0,Math.cos(U*Math.PI/2)).applyAxisAngle(H(0,1,0),L);t.addDial(I<170?"shd":"shdE",W,H(I,N,Z).addScaledVector(K,2.4),K,1.7,t.enamel,"post clock faces")}t.floorU.uPosts.value[t.posts.length].set(I,Z,N,2.3),t.posts.push({x:I,y:N,z:Z,off:Y})};await t.ctx.yield();for(const I of f0(t))S(I);await t.ctx.yield(),t.sight.posts=Math.round(a*100)/100,t.sight.postsToHands=Math.round(l*100)/100,t.sight.postsBeforeHands=x,t.late.push(async()=>{t.instanced(ne(e),t.mat.solid,z),t.instanced(se(e),t.mat.solid,s),t.instanced(re(e),t.mat.solid,r),t.moving["post clocks (standing)"]=z.length}),await t.ctx.yield();const p=t.w.shd,f=t.w.shdE,M=t.rng.fork("benches"),n=Math.min(1,t.density);for(const I of[-1,1])for(let N=0;N<14;N++){const Z=pt.x0+16*N,L=N<7?p:f,W=I*50.5,_=I*48.9,Y=I*52.1,$=(N+(I>0?1:0))%3,V=[M(),M(),M(),M(),M(),M(),M(),M()];if($===0){const O=Z+4,U=Z+13,K=nt(e.woodL,1.1),E=e.woodD;L.box(O,3.3,Math.min(_,Y),U,3.6,Math.max(_,Y),K),L.box(O+.2,2.6,Math.min(_,Y)+.15,U-.2,3.3,Math.max(_,Y)-.15,E,"y+");for(let G=0;G<3;G++)L.box(O+.6+G*2.75,2.72,_-I*.03-.03,O+2.9+G*2.75,3.2,_-I*.03+.03,e.woodL),ht(L,H(O+1.75+G*2.75,2.96,_-I*.06),H(0,0,-I),[[.1,0],[.07,.1],[0,.12]],6,e.brass);for(const G of[O+.3,U-.6])for(const X of[_+I*.2,Y-I*.5])L.box(G,0,Math.min(X,X+I*.3),G+.3,2.6,Math.max(X,X+I*.3),E,"y-y+");L.box(O+.3,.7,Math.min(_,Y)+.2,U-.3,.85,Math.max(_,Y)-.2,E);for(let G=0;G<4;G++){if(V[G]>n*.85)continue;const X=O+1.2+G*2.2,J=W+(V[G+4]-.5)*1.2;G%2?(t.balances.push({m:t.dialMatrix(H(X,3.95,J),H(0,1,0),.5,H(1,0,0)),sw:[V[G]*40,1.7+V[G+4],1.3]}),ht(L,H(X,3.6,J),H(0,1,0),[[.55,0],[.55,.1],[.07,.14],[.06,.36]],8,e.brassD)):L.box(X-.7,3.6,J-.4,X+.7,4.3+.5*V[G+4],J+.4,G?e.ironD:e.woodD,"y-")}}else if($===1){const O=1+Math.round(2*n*V[0]);for(let U=0;U<O;U++){const K=Z+3.6+U*3.8,E=1.3+.5*V[1+U],G=0,X=nt(e.woodL,.9+.3*V[4+U]);L.box(K-E,G,W-E,K+E,G+2*E,W+E,X,"y-");for(const J of[.4,2*E-.6])L.box(K-E-.05,J,W-E-.05,K+E+.05,J+.22,W+E+.05,e.woodD,"y-y+")}}else{const O=H(0,0,-I),U=H(Z+8,0,I*51.5),K=t.planDist(U.x,U.z)<30?"middle":"far";(K==="middle"?t.longNear:t.longFar).push(t.dialMatrix(U,O,1.2)),t.longTone[K==="middle"?"near":"far"].push(new F.Color().setRGB(e.longWoods[0][0],e.longWoods[0][1],e.longWoods[0][2]).lerp(new F.Color().setRGB(e.longWoods[1][0],e.longWoods[1][1],e.longWoods[1][2]),V[0])),t.addDial(N<7?"shd":"shdE",K,H(U.x,6.85*1.2,U.z).addScaledVector(O,.8),O,.96,t.enamel,"standing regulators"),Et(t,t.pendsLong,H(U.x,5.49*1.2,U.z).addScaledVector(O,.03),O,3.3*1.2,M,.12,.13)}}await t.ctx.yield();const u=Math.round(24e4*t.detail),y=new Float32Array(u*3),R=new Float32Array(u*4),k=t.rng.fork("dust"),o=new F.Vector3,d=Math.ceil(t.L),c=new Float32Array((d+1)*3);for(let I=0;I<=d;I++)t.path.posAtDist(Math.min(t.L,I),o),c[I*3]=o.x,c[I*3+1]=o.y,c[I*3+2]=o.z;const C=-80,g=-80,h=8,i=48,b=28,q=Array.from({length:i*b},()=>[]),P=Math.ceil(t.L/.5),w=new Float32Array((P+1)*3);for(let I=0;I<=P;I++)if(t.path.posAtDist(Math.min(t.L,.5*I),o),w[I*3]=o.x,w[I*3+1]=o.y,w[I*3+2]=o.z,!(I%4&&I!==P))for(let N=Math.floor((o.x-7-C)/h);N<=Math.floor((o.x+7-C)/h);N++)for(let Z=Math.floor((o.z-7-g)/h);Z<=Math.floor((o.z+7-g)/h);Z++)q[Z*i+N].push(I);const v=q.map(I=>new Int32Array(I));await t.ctx.yield();let m=0;for(let I=0;I<u;I++){const N=Math.min(d,Math.floor(k()*(d+1)))*3,Z=c[N]+(k()-.5)*36,L=Math.max(.5,c[N+1]-12+k()*24),W=c[N+2]+(k()-.5)*36,_=k(),Y=k(),$=k(),V=.0024+.0024*k();let O=!1;const U=v[Math.floor((W-g)/h)*i+Math.floor((Z-C)/h)];for(let K=0;K<U.length&&!O;K++){const E=U[K],G=E*3,X=Z-w[G],J=L-w[G+1],rt=W-w[G+2];if(!(X*X+J*J+rt*rt>=49))for(let B=Math.max(0,E-2),ot=Math.min(P,E+2);B<=ot;B++){const at=Z-w[B*3],it=L-w[B*3+1],lt=W-w[B*3+2];if(at*at+it*it+lt*lt<36){O=!0;break}}}O||(y[m*3]=Z,y[m*3+1]=L,y[m*3+2]=W,R[m*4]=_,R[m*4+1]=Y,R[m*4+2]=$,R[m*4+3]=V,m++),I%4e3===3999&&await t.ctx.yield()}const T=new F.BufferGeometry;T.setAttribute("position",new F.BufferAttribute(y.subarray(0,m*3),3)),T.setAttribute("aSeed",new F.BufferAttribute(R.subarray(0,m*4),4)),t.dustCount=m;const A=new F.Points(T,new F.ShaderMaterial({uniforms:{...t.ENV},vertexShader:E0,fragmentShader:H0,transparent:!0,depthWrite:!1,blending:F.AdditiveBlending}));A.frustumCulled=!1,A.renderOrder=3,t.scene.add(A),t.calls++,await t.ctx.yield()}),It.push(async t=>{const e=t.L,z=Math.ceil(e/.25),s=new Float32Array((z+1)*3),r=new F.Vector3,a=t.air;for(let n=0;n<=z;n++)t.path.posAtDist(Math.min(e,n*.25),r),s[n*3]=r.x,s[n*3+1]=r.y,s[n*3+2]=r.z;const l=n=>Math.max(0,Math.min(z,Math.round(n/.25))),x=(n,u)=>{(a[n]===void 0||u<a[n])&&(a[n]=u)},S=(n,u,y=0,R=z)=>{const k=u[0]-n[0],o=u[1]-n[1],d=u[2]-n[2],c=k*k+o*o+d*d;let C=1/0;for(let g=y;g<=R;g++){const h=s[g*3]-n[0],i=s[g*3+1]-n[1],b=s[g*3+2]-n[2],q=c>0?Math.max(0,Math.min(1,(h*k+i*o+b*d)/c)):0,P=h-k*q,w=i-o*q,v=b-d*q,m=P*P+w*w+v*v;m<C&&(C=m)}return Math.sqrt(C)};for(let n=0;n<=80;n++){const u=xt.amp*(n/40-1),y=Math.sin(u),R=Math.cos(u),k=[xt.len*y,xt.pivotY-xt.len*R,0];x("pendulum bob",S(k,k,0,l(300))-xt.bobR),x("pendulum rod",S([0,xt.pivotY,0],k,0,l(300))-.6),x("pendulum bob",S(k,[(xt.len+7.2)*y,xt.pivotY-(xt.len+7.2)*R,0],0,l(300))-.8)}await t.ctx.yield();let p=1/0,f=0;for(const n of t.watches)x("watches with their chains",S([n.x,n.top,n.z],[n.x,n.y,n.z],l(235),z)-n.size),p=Math.min(p,n.d),(++f&63)===0&&await t.ctx.yield();a["watch chains, in plan"]=p;for(const n of t.posts){for(const[u,y,R]of Wt)x("post clocks",S([n.x,n.y+u,n.z],[n.x,n.y+y,n.z],l(250),z)-R);x("post clocks",S([n.x,0,n.z],[n.x,n.y+vt[0],n.z],l(250),z)-vt[1])}const M=([n,u,y,R])=>{let k=1/0;for(let o=0;o<=l(300);o++){const d=s[o*3]-n.x,c=s[o*3+1]-n.y,C=s[o*3+2]-n.z,g=d*u.x+c*u.y+C*u.z,h=Math.sqrt(Math.max(0,d*d+c*c+C*C-g*g)),i=Math.hypot(Math.max(0,h-y),Math.max(0,Math.abs(g)-R));i<k&&(k=i)}return k};{let n=0;for(const u of t.airItems||[])u.ring||x(u.cls,u.cyl?M(u.cyl):(u.seg?S(u.seg[0],u.seg[1],0,l(300)):S(u.p,u.p,0,l(300)))-u.r),(++n&63)===0&&await t.ctx.yield()}await t.ctx.yield();for(const[n,u]of Ht){for(const y of j.decks)for(let R=n;R<=u;R+=.5){const k=D(57,R,0);x("gallery fronts and columns",S([k[0],y-1.1,k[2]],[k[0],y+1.7,k[2]],l(40),l(270))-.2)}await t.ctx.yield()}for(const[n,u]of[["minute",pt.gableX-wt.minute.z],["hour",pt.gableX-wt.hour.z]])for(let y=0;y<360;y+=5){const R=Math.sin(y*tt),k=Math.cos(y*tt),o=wt[n];x("great hands, every angle",S([u,44+9.56*k,9.56*R],[u,44+o.tip*k,o.tip*R],l(400),z)-.3)}for(let n=0;n<=z;n++){const u=s[n*3],y=s[n*3+1],R=s[n*3+2],k=Math.hypot(u,R);let o=y;const d=(Math.atan2(R,u)/tt+360)%360,c=Ht.some(([C,g])=>d>=C&&d<=g);u>62?o=Math.min(o,pt.z-1.5-Math.abs(R),u>pt.gableX-2.7?wt.bossIn-Math.hypot(y-44,R):1/0):k<64.5&&c?o=Math.min(o,62.2-k):R>0&&d>82&&d<138?o=R>58?Math.min(o,u-(ct.x0+1.1),ct.x1-1.1-u):o:u>0&&(d<50||d>310)?o=Math.min(o,u>53.5?j.archHalf-(y>j.archSpring?Math.hypot(R,y-j.archSpring):Math.abs(R))-.65:1/0):o=Math.min(o,64-k),x("everything else",o)}for(const n in a)a[n]=Math.round(a[n]*100)/100});export{he as default};
