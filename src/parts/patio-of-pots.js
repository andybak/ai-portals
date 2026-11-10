import*as e from"three";import{mergeGeometries as Dt}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as Q,lerp as O,smoothstep as J}from"../kit/core.js";const Ut=["#F3EFE4","#A9BCD8","#1F47A6","#D4221E","#3E7A38","#B5653A","#2E62C4"],ht=140,at=140,he=70,gt=100,K=35,st=30,Ht=4,Ct=4.5,Ft=5,qt=-68,lt=3,jt=.174/.985,Nt=[[0,30],[.25,32],[.43,37.2],[.5,41.7],[.56,44.7],[.62,47],[.65,47.9],[.87,51.7],[1,53]];function Rt(t){const d=t.length,w=[],C=new Array(d);for(let p=0;p<d-1;p++)w.push((t[p+1][1]-t[p][1])/(t[p+1][0]-t[p][0]));C[0]=w[0],C[d-1]=w[d-2];for(let p=1;p<d-1;p++)C[p]=w[p-1]*w[p]<=0?0:2*w[p-1]*w[p]/(w[p-1]+w[p]);return p=>{const v=Q(p,0,1);let f=0;for(;f<d-2&&v>t[f+1][0];)f++;const u=t[f+1][0]-t[f][0],r=(v-t[f][0])/u,c=r*r,m=c*r;return(2*m-3*c+1)*t[f][1]+(m-2*c+r)*u*C[f]+(-2*m+3*c)*t[f+1][1]+(m-c)*u*C[f+1]}}const zt={may:{sunLo:"#FFF4DC",sunHi:"#FFF4DC",sunI:1.3,skyI:.44,bloom:[.72,.14,.09,.05],paint:[.78,.14,.08],a0:30,a1:53,wet:1,glow:0},dawn:{sunLo:"#FF9E58",sunHi:"#FFDCC4",sunI:1.32,skyI:.4,bloom:[.12,.52,.3,.06],paint:[.58,.34,.08],a0:9,a1:53,wet:1,glow:0,whiten:.62},moon:{sunLo:"#CBD8FF",sunHi:"#D6E0FF",sunI:.95,skyI:.2,bloom:[.1,.08,.76,.06],paint:[.78,.14,.08],a0:30,a1:53,wet:1,glow:.05},shower:{sunLo:"#FFF4DC",sunHi:"#FFF4DC",sunI:1.3,skyI:.48,bloom:[.72,.14,.09,.05],paint:[.78,.14,.08],a0:30,a1:53,wet:1.8,glow:0}},ft=`
uniform mat4 uHeroInv;
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce;
uniform float uSunTan, uSunSide, uEaveH, uPatioD, uChimX, uChimH, uTime, uEdgeY, uWet, uGlow;
uniform vec4 uHLamp; uniform vec3 uHLampCol;                 // the brass lantern on the wall (hero-local; w = how bright)
float h11(float n){ return fract(sin(n * 12.9898 + 4.1414) * 43758.5453); }
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm3(vec2 p){ return 0.5 * vnoise(p) + 0.3 * vnoise(p * 2.13 + 7.1) + 0.2 * vnoise(p * 4.37 + 3.7); }
// height of the east roof's shadow-casting line where a sun ray through eave position xe leaves the patio
float eaveLine(float xe){
  float sc = abs(sin(xe * 1.5707963));                       // tile ends, 2 m pitch
  float ch = smoothstep(5.0, 4.2, abs(xe - uChimX));          // one chimney, 8.4 m wide
  float cap = smoothstep(6.2, 5.6, abs(xe - uChimX)) * 0.12;
  return uEaveH + (sc - 0.55) * 1.3 + ch * uChimH + cap * uChimH;
}
// 1 in the sun, 0 in the roof's shadow
float patioSun(vec3 p){
  float dz = max(uPatioD - p.z, 0.);
  float xe = p.x - dz * uSunSide;
  float pen = 0.2 + dz * 0.006;
  float e = smoothstep(-pen, pen, p.y + dz * uSunTan - eaveLine(xe));
  // the south wing (local x = -70): the ray reaches it after ds metres of z
  float ds = max(p.x + 70., 0.) / max(uSunSide, 1e-3);
  float pen2 = 0.3 + ds * 0.01;
  float s = smoothstep(-pen2, pen2, p.y + ds * uSunTan - uEaveH - 1.5 * sin(p.x * 0.9 + 1.3));
  s = mix(s, 1., step(dz, ds));
  return e * s;
}
// a soft shoulder so no ordinary surface clips or washes in the bloom (drops and glints are added after it)
vec3 patioTone(vec3 c, float top){ return min(c, top - 0.2 + 0.2 * (1. - exp(-max(c - (top - 0.2), 0.) * 4.))); }
// diffuse light: sun (wrapped), blue sky from above, warm bounce from the patio (+z)
vec3 patioLamp(vec3 p, vec3 n){
  vec3 dl = uHLamp.xyz - p; float d2 = dot(dl, dl);
  return uHLampCol * (uHLamp.w * max(dot(n, dl) / sqrt(d2 + 1e-3) + 0.35, 0.) / (1. + d2 * 0.007));
}
vec3 patioLight(vec3 p, vec3 n, float sun, float wrap){
  float ndl = max((dot(n, uSunDir) + wrap) / (1. + wrap), 0.);
  vec3 amb = uSkyCol * (0.66 + 0.34 * n.y) + uBounce * (0.55 + 0.45 * n.z);
  return uSunCol * (ndl * sun) + amb + patioLamp(p, n);
}
`,Mt=[[27,20],[11,26],[-13,32],[-38,42],[-52,50],[-58,55]];function dt(t,d){let w=1e9;for(let C=0;C<Mt.length-1;C++){const p=Mt[C],v=Mt[C+1],f=v[0]-p[0],u=v[1]-p[1],r=Q(((t-p[0])*f+(d-p[1])*u)/(f*f+u*u),0,1);w=Math.min(w,Math.hypot(t-p[0]-f*r,d-p[1]-u*r))}return w}function Yt(t,d){const w=zt[d],C=new Uint8Array(K*st),p=(n,g)=>{n>=0&&n<K&&g>=0&&g<st&&(C[g*K+n]=1)},v=(n,g)=>n>=0&&n<K&&g>=0&&g<st&&!C[g*K+n],f=n=>qt+n*Ht,u=n=>Ft+n*Ct,r={x:-24,y:34,z:3.6};p(11,6),p(11,7),p(12,6),p(12,5);const c={x:8,y:26.6,z:4.2};p(19,4),p(19,5),p(19,6);const m=t.int(15,29),y=t.int(8,20),k={x:f(m)+Ht*1.5,y:u(y)-1.6,c:m,r:y};for(let n=0;n<4;n++)for(let g=0;g<5;g++)p(m+n,y+g);const z=[],o=[[2,4],[6,9],[11,14],[15,18],[20,23],[25,27]];for(let n=0;n<6;n++)for(let g=0;g<40;g++){const a=t.int(2,K-3),S=t.int(o[n][0],o[n][1]);let q=!0;for(let L=-1;L<=1;L++)for(let I=0;I<=1;I++)v(a+L,S+I)||(q=!1);if(!(!q||z.some(L=>Math.abs(L.c-a)<6))){for(let L=-1;L<=1;L++)for(let I=0;I<=1;I++)p(a+L,S+I);z.push({c:a,r:S,x:f(a),y:u(S)+Ct*.5,w:t.range(4.6,5.2),h:t.range(6.4,7.2),swing:n===1||n===4,open:t.range(.3,1),seed:t()});break}}let s=t.int(21,32);const h=n=>{for(let g=0;g<6;g++)if(!v(n,g))return!1;return!0};for(let n=0;n<12&&!h(s);n++)s=21+(s-21+5)%12;for(let n=0;n<6;n++)p(s,n);const x={x:f(s),top:29};for(let n=0;n<6;n++)p(0,n);const l={x:-68,len:28},P=[];for(let n=0;n<6;n++)for(let g=0;g<20;g++){const a=t.int(1,K-2),S=t.int(2,st-2);if(v(a,S)){p(a,S),P.push({x:f(a)+t.range(-.4,.4),y:u(S)+t.range(-.3,.3),r:t.range(1,1.45),seed:t()});break}}const i=t.range(-24,-6),b=t.range(8,11),A=t.fork("thin"),V=[];for(let n=0;n<10;n++)V.push([A.range(1,K-2),A.range(2,st-2),A.range(1.3,2.7),A.range(.8,1.7)]);const H=(n,g)=>{let a=0;for(const[S,q,L,I]of V)a=Math.max(a,1-Math.hypot((n-S)/L,(g-q)/I));return a},G=new Map;for(let n=0;n<9;n++)for(let g=0;g<40;g++){const a=A.int(2,K-3),S=A.int(6,18),q=f(a),L=u(S),I=Math.min(A.range(12,22),L-11),N=Math.ceil((I+1.5)/Ct);if(I<9||dt(q,L)<25||dt(q,L-I*.5)<25||dt(q,L-I)<23)continue;let _=v(a,S);for(let T=1;T<=N;T++)v(a,S-T)||(_=!1);for(const T of G.values())Math.abs(T.c-a)<4&&Math.abs(T.r-S)<8&&(_=!1);if(_){for(let T=1;T<=N;T++)p(a,S-T);G.set(S*K+a,{c:a,r:S,len:I,seed:A()});break}}const F=[],M=new Uint8Array(K*st*4),B=(n,g)=>g<n[0]?0:g<n[0]+n[1]?1:g<n[0]+n[1]+n[2]?2:3;for(let n=0;n<st;n++)for(let g=0;g<K;g++){const a=[t(),t(),t(),t(),t(),t(),t(),t(),t(),t(),t(),t()];if(C[n*K+g])continue;const S=G.get(n*K+g),q=1-J(10,24,dt(f(g),u(n)));if(!S&&q<.5&&n>0&&(H(g,n)>.1||a[9]*57.31%1<.07))continue;const L=S?0:(a[0]-.5)*2.2,I=S?0:(a[1]-.5)*1.5,N=S?3+.4*a[2]:1.4+2*Math.pow(a[2],O(1.7,.8,q));let _=a[3]<.7?0:a[3]<.9?1:a[3]<.93?2:a[3]<.96?3:a[3]<.985?4:5;n===0&&_===1&&(_=0),S&&(_=1);const T=a[4],Y=T<w.paint[0]?0:T<w.paint[0]+w.paint[1]?1:2,rt=B(w.bloom,a[5]),ot=_===0?.15+.85*a[6]:_===1?.35+.65*a[6]:0,W=(_===0?O(.78,1.15,a[7]):_===2?.95:_===3?.55:_===4?.3:0)*O(.78,1,q),et=S?9:_===1?O(4,9,a[8]):0,X=f(g)+L,$=u(n)+I,ut={c:g,r:n,x:X,y:$,size:N,kind:_,paint:Y,colour:rt,bloom:ot,spread:W,trail:et,seed:a[9],leanX:(a[10]-.5)*.28,leanZ:(a[11]-.5)*.28,near:!S&&dt(X,$)<15&&$<64,cascade:S?S.len:0};F.push(ut);const nt=(n*K+g)*4;M[nt]=Math.round(Q(L/2.4+.5,0,1)*255),M[nt+1]=Math.round(Q(I/1.6+.5,0,1)*255),M[nt+2]=Math.round(Q((N-1.4)/2,0,1)*255);const j=_===1?.55+.45*(et-4)/5:_===5?.03:.08+.36*Q(W/1.15,0,1);M[nt+3]=Math.max(4,Math.round(j*255))}const E=new Map;F.forEach(n=>E.set(n.r*K+n.c,n));const U=[];for(let n=0;n<600&&U.length<120;n++){const g=t.int(0,K-1),a=n%3===2?t.int(4,st-1):t.int(8,17),S=t.int(3,9),q=[];for(let L=a;L>=Math.max(0,a-S);L--){const I=E.get(L*K+g);if(!I)break;q.push(I)}q.length>=3&&U.push({run:q,seed:t(),side:t.chance(.5)?1:-1})}return{pots:F,tex:M,windows:z,balcony:k,ladder:x,cane:l,plates:P,cage:r,lamp:c,chimX:i,chimH:b,chains:U}}const Ot=`
uniform mat4 uHeroInv;
varying vec3 vHp, vV;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  vHp = (uHeroInv * wp).xyz;
  vV = mat3(uHeroInv) * (cameraPosition - wp.xyz);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Kt=`
${ft}
uniform sampler2D uPots;
uniform vec3 uLime, uCobalt;
varying vec3 vHp, vV;
#include <fog_pars_fragment>
float brush(vec2 p){
  float a = vnoise(vec2(p.x * 0.33 + p.y * 0.07, p.y * 2.7));
  float b = vnoise(vec2(p.x * 2.3 + 3.1, p.y * 0.38 - p.x * 0.06));
  return mix(a, b, smoothstep(0.35, 0.65, vnoise(p * 0.11 + 9.3)));
}
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0., 1.); return length(pa - ba * t); }
void main(){
  vec2 p = vHp.xy;
  float fw = max(fwidth(p.x) + fwidth(p.y), 1e-4);
  float dist = length(vV);
  float lod = smoothstep(150., 30., dist);
  // brush relief and uneven coats
  float h0 = brush(p), hx = brush(p + vec2(0.14, 0.)), hy = brush(p + vec2(0., 0.14));
  float lod2 = smoothstep(70., 12., dist);
  vec3 n = normalize(vec3((h0 - hx) * 2.4 * lod, (h0 - hy) * 2.4 * lod, 1.));
  float coat = fbm3(p * 0.045 + 3.3);
  float stain = fbm3(vec2(p.x * 0.55, p.y * 0.045));
  vec3 alb = uLime * (0.79 + 0.08 * coat + 0.06 * (h0 - 0.5) * lod + 0.05 * (vnoise(p * 8.) - 0.5) * lod2);
  // old coats flaked away in places: a crisp-edged shallower, greyer layer
  float fl = fbm3(p * 0.33 + 41.);
  float flake = smoothstep(0.615, 0.635, fl) * lod;
  alb *= 1. - 0.07 * flake + 0.05 * (smoothstep(0.60, 0.615, fl) - smoothstep(0.615, 0.63, fl)) * lod;
  alb *= 1. - 0.13 * smoothstep(0.5, 0.85, stain) * smoothstep(92., 139., p.y);        // weather under the eave
  alb = mix(alb, alb * vec3(0.93, 0.97, 0.90), 0.5 * smoothstep(0.55, 0.9, coat) * smoothstep(40., 0., p.y));   // damp green low down
  // hairline cracks: sparse voronoi borders
  vec2 cp = p / 7.5, ic = floor(cp), fc = fract(cp);
  float f1 = 9., f2 = 9.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    float d = length(g + h22(ic + g) - fc);
    if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) { f2 = d; }
  }
  float crack = (1. - smoothstep(0., 0.035 + fw * 1.3, (f2 - f1) * 3.75)) * smoothstep(0.42, 0.6, vnoise(p * 0.06 + 20.)) * clamp(0.07 / fw, 0., 1.);
  alb *= 1. - 0.6 * crack;
  // cobalt dado
  float yb = 8.3 + 0.3 * (vnoise(vec2(p.x * 0.35, 1.7)) - 0.5);
  float band = 1. - smoothstep(yb - 0.05 - fw, yb + 0.05 + fw, p.y);
  vec3 dado = uCobalt * (0.8 + 0.5 * coat + 0.25 * (h0 - 0.5));
  dado = mix(dado, uCobalt * 0.55, smoothstep(0.5, 0.2, abs(p.y - (yb - 0.55))) * 0.7);                 // darker stripe under the top
  dado = mix(dado, uLime * 0.7, smoothstep(0.72, 0.9, vnoise(p * vec2(1.3, 0.9) + 5.)) * smoothstep(4., 0., p.y) * 0.8);   // scuffed at the foot
  alb = mix(alb, dado, band);
  // the pots in front of this point
  vec2 shift = ${lt.toFixed(1)} * vec2(uSunSide, -uSunTan);
  float ci = floor((p.x + 70.) / 4.), cj = floor((p.y - 2.75) / 4.5);
  float shade = 0., ao = 0., wet = 0., rose = 0., rust = 0., drip = 0.;
  float farK = smoothstep(45., 95., dist);
  for (int dj = 0; dj <= 2; dj++) for (int di = -1; di <= 1; di++) {
    vec2 cell = vec2(ci + float(di), cj + float(dj));
    if (cell.x < 0. || cell.x > 34.5 || cell.y < 0. || cell.y > 29.5) continue;
    vec4 t = textureLod(uPots, (cell + 0.5) / vec2(35., 30.), 0.);
    if (t.a < 0.008) continue;
    vec2 c = vec2(-68. + cell.x * 4. + (t.r - 0.5) * 2.4, 5. + cell.y * 4.5 + (t.g - 0.5) * 1.6);
    float s = 1.4 + 2. * t.b;
    float trail = step(0.5, t.a);
    float spread = (1. - trail) * clamp((t.a - 0.08) / 0.36, 0., 1.) * 1.15;
    float tl = trail * (4. + 5. * (t.a - 0.55) / 0.45);
    float pr = s * (0.25 + 0.5 * spread);
    vec2 q = p - c;
    float rr = s * 0.5 + 1.0 + spread * 1.5;
    vec2 qa = (q - vec2(0., s * 0.2)) * vec2(1., 0.85);
    ao = max(ao, exp(-dot(qa, qa) / (rr * rr)));
    vec2 qs = q - shift;
    float wob = (vnoise(qs * 1.6 + cell * 7.3) - 0.5);
    float sh = 1. - smoothstep(0.86, 1.1, length(qs / vec2(s * 0.52, s * 0.5)));
    float dM = length((qs - vec2(0., s * 0.45 + pr * 0.3)) / vec2(pr, pr * 0.8)) + wob * 0.4;
    sh = max(sh, (1. - smoothstep(0.78, 1.08, dM)) * step(0.02, spread));
    float along = clamp((s * 0.4 - qs.y) / max(tl + s * 0.4, 0.1), 0., 1.);
    float dT = sdSeg(qs, vec2(0., s * 0.4), vec2(0., -tl)) / (s * 0.62 * (1. - 0.45 * along)) + wob * 0.5;
    sh = max(sh, (1. - smoothstep(0.78, 1.08, dT)) * trail);
    sh = max(sh, (1. - smoothstep(0.09, 0.15 + fw, sdSeg(p, c, c + shift))) * 0.8);
    shade = max(shade, sh);
    float wetK = uWet * (1. - 0.88 * smoothstep(2., 36., c.y - uEdgeY));
    float wlen = (1.5 + 5.5 * h21(cell + 3.)) * wetK;
    float wx = abs(q.x + (vnoise(vec2(p.y * 0.55, cell.x * 3.1 + cell.y)) - 0.5) * 0.8) / (s * (0.16 + 0.12 * vnoise(vec2(p.y * 1.3, cell.x))));
    float wy = (-s * 0.25 - q.y) / max(wlen + s * 0.25, 0.05);
    wet = max(wet, (1. - smoothstep(0.6, 1.05, wx + wy * 0.55)) * step(0., wy) * (1. - smoothstep(0.7, 1., wy)) * min(wetK, 1.));
    rust = max(rust, exp(-abs(q.x + 0.05 * sin(p.y * 3.)) / 0.1) * smoothstep(-2.6 - 2. * h21(cell), 0.1, q.y - 0.2 * s) * step(q.y, 0.3 * s));
    drip = max(drip, (1. - smoothstep(0.5, 1., abs(q.x) / max(0.5, fw * 1.6))) * step(q.y, -0.2 * s));          // the line the overflow runs down
    vec2 qr = q - vec2(0., s * 0.6);
    rose = max(rose, exp(-dot(qr, qr) / (pr * pr * 3.5 + 0.5)) * spread);
  }
  float sun = patioSun(vHp);
  float lit = sun * (1. - shade * mix(0.93, 0.74, farK));
  alb *= mix(vec3(1.), vec3(0.50, 0.55, 0.63), wet * (1. - band * 0.5) * (1. - 0.4 * farK));
  alb = mix(alb, alb * vec3(0.78, 0.55, 0.38), rust * 0.5 * lod);
  vec3 light = patioLight(vHp, n, lit, 0.9);
  light *= 1. + dot(n.xy, uSunDir.xy) * 0.22 * lit + n.y * 0.2 * (1. - lit);     // brush relief raked by the sun, lit from the sky in shade
  light *= 1. - 0.36 * ao * (1. - 0.55 * lit) * (1. - 0.3 * farK);
  vec3 col = alb * light;
  col += alb * uSunCol * vec3(0.95, 0.22, 0.16) * (rose * sun * 0.1);
  col += alb * uSunCol * (sun * (1. - sun) * 0.25);                               // a warm breath in the penumbra
  vec3 v = normalize(vV + vec3(0., 0., 1e-4));
  vec3 hv = normalize(uSunDir + v + vec3(0., 1e-4, 0.));
  float sp = pow(max(dot(n, hv), 0.), 36.);
  float glint = step(0.93, vnoise(p * 9. + floor(uTime * 3.) * 1.7)) * lod;
  col = patioTone(col, 0.99);                                                    // sunlit lime sits just under clipping
  col += uSunCol * (wet * lit * (sp * 1.4 + glint * 0.5)) + uSkyCol * (wet * 0.25 * (1. - abs(v.z)));
  // the glitter that runs ahead of the red: under the line the running water catches the first light, a band of
  // sparks on every wet streak and drip line. Each spark is a cell at least two pixels across, so it holds at 90 m.
  float under = smoothstep(uEdgeY - 11.5, uEdgeY - 6., p.y) * (1. - smoothstep(uEdgeY - 1.2, uEdgeY + 0.6, p.y));
  float gs = exp2(floor(log2(max(fw * 2.4, 0.2))));
  vec2 gc = floor(p / gs), gf = fract(p / gs) - 0.5;
  float gh = h21(gc + floor(uTime * 5. + h21(gc + 11.) * 5.) * 7.13);
  float spark = step(0.74, gh) * (1. - smoothstep(0.2, 0.5, length(gf))) * (0.5 + 0.5 * h21(gc + 5.));
  col += uSunCol * (spark * under * max(wet, drip) * (1. - band) * 2.2);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function Wt(t,d,w){const C=new e.DataTexture(d.tex,K,st,e.RGBAFormat,e.UnsignedByteType);C.minFilter=C.magFilter=e.NearestFilter,C.generateMipmaps=!1,C.needsUpdate=!0;const p=new e.PlaneGeometry(ht,at,10,10);p.translate(0,at/2,0);const v=new e.ShaderMaterial({uniforms:{...e.UniformsLib.fog,...t,uPots:{value:C},uLime:{value:w.lime},uCobalt:{value:w.cobalt}},vertexShader:Ot,fragmentShader:Kt,fog:!0}),f=new e.Mesh(p,v);return f.name="lime",f}function Xt(t,d){const w=[],C=[],p=[],v=[],f=[],u=(i,b,A,V,H,G,F,M=0)=>(w.push(i,b,A),C.push(V,H,G),p.push(F,b),v.push(M),w.length/3-1),r=d?[[.29,-.45],[.315,-.415],[.455,.315],[.505,.335],[.532,.375],[.528,.435],[.495,.462],[.44,.4]]:[[.3,-.45],[.455,.32],[.53,.39],[.47,.46]],c=(i,b,A,V,H)=>{const G=w.length/3;for(let F=0;F<t;F++){const M=F/t*Math.PI*2,B=Math.cos(M),E=Math.sin(M);u(B*i,b,E*i,B*A,V,E*A,H)}return G},m=(i,b)=>{for(let A=0;A<t;A++){const V=(A+1)%t;f.push(i+A,b+A,i+V,i+V,b+A,b+V)}},y=[];for(let i=0;i<r.length;i++){const b=r[Math.max(0,i-1)],A=r[Math.min(r.length-1,i+1)];let V=A[0]-b[0],H=A[1]-b[1];const G=Math.hypot(V,H)||1;V/=G,H/=G,y.push(c(r[i][0],r[i][1],H,-V,0))}for(let i=0;i<y.length-1;i++)m(y[i],y[i+1]);const k=c(r[0][0],r[0][1],0,-1,0);for(let i=1;i<t-1;i++)f.push(k,k+i,k+i+1);const z=r[r.length-1],o=c(z[0],z[1],0,1,1);for(let i=1;i<t-1;i++)f.push(o,o+i+1,o+i);if(d){const i=c(.475,.262,1,0,2),b=c(.475,.318,1,0,2);m(i,b)}const s=d?.035:.05,h=.29,x=d?4:3,l=w.length/3;for(let i=0;i<2;i++)for(let b=0;b<x;b++){const A=b/x*Math.PI*2+Math.PI/4,V=Math.cos(A),H=Math.sin(A);u(V*s,h+H*s,-.46,V,H,0,2,i)}for(let i=0;i<x;i++){const b=(i+1)%x;f.push(l+i,l+b,l+x+i,l+b,l+x+b,l+x+i)}if(d){const i=w.length/3,b=.11;u(-b,h-b*1.6,-.46,0,0,1,2,.985),u(b,h-b*1.6,-.46,0,0,1,2,.985),u(b,h+b*1.6,-.46,0,0,1,2,.985),u(-b,h+b*1.6,-.46,0,0,1,2,.985),f.push(i,i+1,i+2,i,i+2,i+3)}const P=new e.InstancedBufferGeometry;return P.setAttribute("position",new e.Float32BufferAttribute(w,3)),P.setAttribute("normal",new e.Float32BufferAttribute(C,3)),P.setAttribute("aPart",new e.Float32BufferAttribute(p,2)),P.setAttribute("aArm",new e.Float32BufferAttribute(v,1)),P.setIndex(f),P}const $t=`
uniform mat4 uHeroInv;
attribute vec2 aPart; attribute float aArm; attribute vec3 aPos; attribute vec4 aSL; attribute vec4 aPaint;
varying vec3 vHp, vV, vN, vL; varying vec2 vPart; varying vec4 vPaint; varying float vSeed;
#include <fog_pars_vertex>
void main(){
  float s = aSL.x;
  vec3 lp = position, ln = normal;
  if (aPart.x < 1.5) {
    float cx = cos(aSL.y), sx = sin(aSL.y), cz = cos(aSL.z), sz = sin(aSL.z);
    lp.y += 0.45; ln = vec3(ln.x, ln.y * cx - ln.z * sx, ln.y * sx + ln.z * cx); lp = vec3(lp.x, lp.y * cx - lp.z * sx, lp.y * sx + lp.z * cx);
    ln = vec3(ln.x * cz - ln.y * sz, ln.x * sz + ln.y * cz, ln.z); lp = vec3(lp.x * cz - lp.y * sz, lp.x * sz + lp.y * cz, lp.z);
    lp.y -= 0.45; lp *= s;
  } else {
    lp.xy *= s; lp.z = mix(lp.z * s, -aPos.z, aArm);
  }
  vL = position; vPart = aPart; vPaint = aPaint; vSeed = aSL.w;
  vec4 wp = modelMatrix * vec4(aPos + lp, 1.);
  vHp = (uHeroInv * wp).xyz;
  vN = ln;
  vV = mat3(uHeroInv) * (cameraPosition - wp.xyz);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Zt=`
${ft}
uniform vec3 uTerra, uCobalt;
varying vec3 vHp, vV, vN, vL; varying vec2 vPart; varying vec4 vPaint; varying float vSeed;
#include <fog_pars_fragment>
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(vV + vec3(0., 0., 1e-4));
  float sun = patioSun(vHp);
  float y = vL.y, ang = atan(vL.z, vL.x + 1e-5);
  vec2 sp = vec2(ang * 2.2, y * 5.) + vSeed * 37.;
  float n1 = vnoise(sp * 1.7), n2 = vnoise(sp * 5.3 + 11.), n3 = vnoise(sp * 13. + 5.);
  vec3 alb; float gloss = vPaint.a;
  if (vPart.x < 0.5) {
    vec3 terra = uTerra * (0.8 + 0.35 * n1);
    alb = vPaint.rgb * (0.86 + 0.2 * n1 + 0.08 * n2);
    // a hand-painted line on the white pots, a paler brush ring on some blue ones
    float line = smoothstep(0.035, 0.02, abs(y - 0.12 - 0.02 * sin(ang * 6. + vSeed * 20.)));
    line = max(line, smoothstep(0.03, 0.018, abs(y + 0.2)));
    line = max(line, smoothstep(0.075, 0.06, length(vec2(fract(ang * 1.9099 + vSeed) - 0.5, (y + 0.04) * 3.2))) * step(0.5, fract(vSeed * 3.3)));
    alb = mix(alb, uCobalt * 0.9, line * step(1.5, gloss) * 0.9);
    // chipped rim and knocks: raw clay shows through
    float chip = smoothstep(0.68, 0.74, n2 * 0.8 + 0.34 * smoothstep(0.31, 0.46, y) + 0.12 * n3 - 0.1);
    chip = max(chip, smoothstep(0.84, 0.87, n3 * 0.5 + n2 * 0.5 + 0.06));
    float raw = max(chip, step(0.5, 1. - min(gloss, 1.)));      // raw terracotta pots have no paint at all
    alb = mix(alb, terra, raw);
    alb = mix(alb, terra * 0.85, smoothstep(0.445, 0.46, y) * step(length(vL.xz), 0.497));   // unpainted inside the rim
    // lime bloom creeping up from the foot, wet foot under it
    float bloom = smoothstep(0.6, 0.95, n1 * 0.5 + n2 * 0.2 + smoothstep(0.05, -0.45, y) * 0.62);
    alb = mix(alb, vec3(0.80, 0.79, 0.75), bloom * 0.6);
    float wetF = smoothstep(-0.2 + 0.2 * n1, -0.4, y) * min(uWet, 1.) * (1. - 0.7 * smoothstep(5., 40., vHp.y - uEdgeY));
    alb *= mix(1., 0.55, wetF);
    gloss = min(gloss, 1.) * (1. - raw) * (1. - bloom * 0.7) + wetF * 0.8;
    alb *= 0.82 + 0.18 * smoothstep(-0.45, 0.3, y);                // grounded: darker toward the foot
  } else if (vPart.x < 1.5) {
    alb = vec3(0.10, 0.065, 0.045) * (0.6 + 0.8 * n3); gloss = 0.15 * min(uWet, 1.);
  } else {
    alb = vec3(0.035, 0.038, 0.046) * (0.7 + 0.6 * n2); gloss = 0.3;
  }
  vec3 light = patioLight(vHp, n, sun, 0.12);
  light *= 0.72 + 0.28 * smoothstep(-1., 0.3, n.z);                // the side toward the wall sits in its own shade
  vec3 col = patioTone(alb * light, 1.0);
  vec3 hv = normalize(uSunDir + v + vec3(0., 1e-4, 0.));
  float ndh = max(dot(n, hv), 0.);
  float fr = 1. - max(dot(n, v), 0.); fr = fr * fr * fr;
  col += uSunCol * (gloss * sun * (pow(ndh, 48.) * 1.1 + pow(ndh, 8.) * 0.08));
  col += uSkyCol * (gloss * (0.10 + 0.9 * fr) * 0.55 * (0.5 + 0.5 * n.y));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function Tt(t,d,w,C,p){const v=Xt(p?10:6,p),f=d.length,u=new Float32Array(f*3),r=new Float32Array(f*4),c=new Float32Array(f*4),m=new e.Color;for(let z=0;z<f;z++){const o=d[z];u.set([o.x,o.y,lt],z*3),r.set([o.size,o.leanX,o.leanZ,o.seed],z*4);const s=o.seed*7.31%1;o.paint===0?m.copy(w.cobalt).offsetHSL((s-.5)*.035,0,(s-.5)*.07):o.paint===1?m.copy(w.terra).offsetHSL((s-.5)*.02,0,(s-.5)*.08):m.setRGB(.8,.8,.76),c.set([m.r,m.g,m.b,o.paint===0?1:o.paint===1?0:2],z*4)}v.setAttribute("aPos",new e.InstancedBufferAttribute(u,3)),v.setAttribute("aSL",new e.InstancedBufferAttribute(r,4)),v.setAttribute("aPaint",new e.InstancedBufferAttribute(c,4)),v.instanceCount=f,v.boundingSphere=new e.Sphere(new e.Vector3(0,70,3),105);const y=new e.ShaderMaterial({uniforms:{...e.UniformsLib.fog,...t,uTerra:{value:w.terra},uCobalt:{value:w.cobalt}},vertexShader:$t,fragmentShader:Zt,fog:!0,side:e.DoubleSide}),k=new e.Mesh(v,y);return k.name=p?"pots-near":"pots-far",k}function _t(t,d){const w=[],C=[],p=[],v=[],f=[],u=[],r=[],c=[],m=new e.Vector3,y=new e.Vector3,k=new e.Vector3,z=new e.Vector3,o=new e.Vector3(0,1,0),s=(a,S,q,L)=>{z.crossVectors(Math.abs(a.y)>.95?new e.Vector3(1,0,0):o,a).normalize(),y.crossVectors(a,z);const I=Math.cos(S)*q*.5,N=Math.sin(S)*q*.5;L[0].copy(z).multiplyScalar(I).addScaledVector(y,N),L[1].copy(y).multiplyScalar(I).addScaledVector(z,-N)},h=[new e.Vector3,new e.Vector3],x=[new e.Vector3,new e.Vector3],l=new e.Vector3,P=(a,S,q,L,I,N,_,T,Y,rt)=>{const ot=t.range(-.5,.5);s(I,ot,N,h),s(T,ot*2,Y,x);const W=w.length/3;for(let et=0;et<4;et++){const X=et===0||et===3?-1:1,$=et<2?-1:1;w.push(L.x+h[0].x*X+h[1].x*$,L.y+h[0].y*X+h[1].y*$,L.z+h[0].z*X+h[1].z*$),C.push(L.x,L.y,L.z),p.push(_.x,_.y,_.z),v.push(x[0].x*X+x[1].x*$,x[0].y*X+x[1].y*$,x[0].z*X+x[1].z*$),f.push(I.x,I.y,I.z),u.push(X*.5+.5,$*.5+.5),r.push(a,S,q,rt)}c.push(W,W+1,W+2,W,W+2,W+3)},i=d?6:3,b=[];for(let a=0;a<i;a++){const S=O(.25,Math.PI-.25,(a+t.range(.2,.8))/i);b.push({x:Math.cos(S)*.5,z:Math.sin(S)*.42,drift:t.range(-.25,.25),len:t.range(.55,1),ph:t()})}const A=(a,S,q)=>q.set(a.x*(1+.25*S)+a.drift*S,.02-S*a.len,a.z+.12+.22*Math.sin(S*5+a.ph*6)),V=a=>{for(let S=0;S<8;S++){const q=t()*Math.PI*2,L=t.range(.1,1.85);if(a.set(Math.sin(L)*Math.cos(q),Math.cos(L),Math.sin(L)*Math.sin(q)),a.z>-.55)break}return a},H=new e.Vector3,G=new e.Vector3,F=new e.Vector3,M=d?44:7;for(let a=0;a<M;a++){V(H);const S=d?t.range(.58,.9):t.range(.4,.62);G.set(H.x*S,H.y*S*.8+.12,H.z*S),k.set(H.x,H.y+.35,H.z+.25).normalize();const q=b[a%i],L=(Math.floor(a/i)+t.range(.1,.9))/Math.ceil(M/i);A(q,L,F),F.x+=t.range(-.12,.12),l.set(t.range(-.4,.4),t.range(-.1,.5),1).normalize(),P(0,a/M,t(),G,k,d?t.range(.72,.98):t.range(1.05,1.3),F,l,d?t.range(.62,.85):t.range(.95,1.25),Q(G.y+.4,0,1.4))}const B=d?14:6,E=[];for(let a=0;a<B;a++)E.push((a+.5)/B);for(let a=0;a<B;a++){for(let I=0;I<8;I++){const N=t()*Math.PI*2,_=t.range(.05,1.35);if(H.set(Math.sin(_)*Math.cos(N),Math.cos(_),Math.sin(_)*Math.sin(N)),H.z>-.2)break}const S=d?t.range(1,1.2):t.range(.85,1.05);G.set(H.x*S,H.y*S*.85+.14,H.z*S),k.set(H.x,H.y+.15,H.z+.7).normalize();const q=b[a%i];A(q,t.range(.08,.98),F),F.z+=.16,F.x+=t.range(-.15,.15),l.set(t.range(-.25,.25),t.range(0,.35),1).normalize();const L=t();if(P(1,E[a],L,G,k,d?t.range(.6,.76):t.range(.78,.98),F,l,d?t.range(.56,.7):t.range(.8,1),Q(G.y+.5,0,1.6)),d){const I=w.length/3,N=.022;m.copy(G).multiplyScalar(.45),z.set(-H.z,0,H.x).normalize().multiplyScalar(N);const _=[[m.x-z.x,m.y,m.z-z.z],[m.x+z.x,m.y,m.z+z.z],[G.x+z.x,G.y,G.z+z.z],[G.x-z.x,G.y,G.z-z.z]];for(let T=0;T<4;T++)w.push(..._[T]),C.push(..._[T]),p.push(F.x,F.y,F.z),v.push(0,0,0),f.push(H.x,H.y,H.z),u.push(T===0||T===3?0:1,T<2?0:1),r.push(2,E[a],L,T<2?.3:1);c.push(I,I+1,I+2,I,I+2,I+3)}}const U=d?7:5,n=w.length/3;w.push(0,.62,.05),C.push(0,.62,.05),p.push(0,0,0),v.push(0,.3,.05),f.push(0,1,.3),u.push(.5,.5),r.push(3,0,.5,.6);for(let a=0;a<U;a++){const S=a/U*Math.PI*2,q=Math.cos(S),L=Math.sin(S);w.push(q*.66,-.02,L*.66),C.push(q*.66,-.02,L*.66),p.push(0,0,0),v.push(q*.45,-.02,L*.45),f.push(q,.3,L),u.push(.5,.5),r.push(3,0,.5,.1),c.push(n,n+1+(a+1)%U,n+1+a)}const g=new e.InstancedBufferGeometry;return g.setAttribute("position",new e.Float32BufferAttribute(w,3)),g.setAttribute("aCtrA",new e.Float32BufferAttribute(C,3)),g.setAttribute("aCtrB",new e.Float32BufferAttribute(p,3)),g.setAttribute("aOffB",new e.Float32BufferAttribute(v,3)),g.setAttribute("normal",new e.Float32BufferAttribute(f,3)),g.setAttribute("uv",new e.Float32BufferAttribute(u,2)),g.setAttribute("aCard",new e.Float32BufferAttribute(r,4)),g.setIndex(c),g}function Qt(t){const d=[],w=[],C=[],p=[],v=[],f=[],u=[],r=[],c=s=>O(.22,-.74,J(0,.3,s)),m=s=>.12+1.02*Math.sin(Math.min(1,s*3.2+.25)*Math.PI/2)*(1-.62*s*s),y=(s,h,x,l,P,i,b,A,V)=>{const H=d.length/3,G=Math.cos(A)*b*.5,F=Math.sin(A)*b*.5;for(let M=0;M<4;M++){const B=M===0||M===3?-1:1,E=M<2?-1:1,U=G*B-F*E,n=F*B+G*E;d.push(l+U,P+n,i),w.push(l,P,i),C.push(l,P,i),p.push(U,n,.1*B*E),v.push(0,.25,.97),f.push(B*.5+.5,E*.5+.5),u.push(s,h,x,V)}r.push(H,H+1,H+2,H,H+2,H+3)},z=d.length/3;for(let s=0;s<=8;s++){const h=s/8,x=m(h)*.62;for(const l of[-1,1])d.push(l*x,-h,c(h)-.05),w.push(l*x,-h,0),C.push(l*x,.02-h,c(h)-.06),p.push(0,0,0),v.push(0,.25,.97),f.push(.5,.5),u.push(3,0,.5,.5);if(s<8){const l=z+s*2;r.push(l,l+2,l+1,l+1,l+2,l+3)}}for(let s=0;s<44;s++){const h=(s+t.range(.1,.9))/44,x=m(h);y(0,s/44,t(),t.range(-1,1)*x,.03-h,c(h)+t.range(0,.14),t.range(.85,1.2)*(1-.25*h),t.range(-.6,.6),.6)}for(let s=0;s<14;s++){const h=t.range(.03,.97),x=m(h);y(1,(s+.5)/14,t(),t.range(-1,1)*x*.9,.03-h,c(h)+.2,t.range(.4,.52),0,.8)}const o=new e.InstancedBufferGeometry;return o.setAttribute("position",new e.Float32BufferAttribute(d,3)),o.setAttribute("aCtrA",new e.Float32BufferAttribute(w,3)),o.setAttribute("aCtrB",new e.Float32BufferAttribute(C,3)),o.setAttribute("aOffB",new e.Float32BufferAttribute(p,3)),o.setAttribute("normal",new e.Float32BufferAttribute(v,3)),o.setAttribute("uv",new e.Float32BufferAttribute(f,2)),o.setAttribute("aCard",new e.Float32BufferAttribute(u,4)),o.setIndex(r),o}const Jt=`
uniform mat4 uHeroInv; uniform float uTime;
attribute vec3 aCtrA, aCtrB, aOffB; attribute vec4 aCard; attribute vec3 aPos; attribute vec4 aPl, aCol, aLeaf;
varying vec3 vHp, vN, vV; varying vec2 vUv; varying vec4 vCard, vCol, vLeaf;
#include <fog_pars_vertex>
void main(){
  float s = aPl.x, kind = aPl.y, RL = aPl.z, seed = aPl.w, type = aCard.x;
  float show = (type > 0.5 && type < 2.5) ? step(aCard.y, aCol.a) : 1.;
  // every mound is turned and mirrored its own way
  float ang = (fract(seed * 13.7) - 0.5) * 1.3, ca = cos(ang), sa = sin(ang), mir = seed > 0.5 ? 1. : -1.;
  vec3 pm = vec3(position.x * mir, position.y, position.z), nm = vec3(normal.x * mir, normal.y, normal.z);
  float sq = 0.8 + 0.4 * fract(seed * 5.3);
  pm = vec3(pm.x * ca + pm.z * sa, pm.y * sq, -pm.x * sa + pm.z * ca) * RL;
  vec3 cm = vec3(aCtrA.x * mir, aCtrA.y, aCtrA.z);
  cm = vec3(cm.x * ca + cm.z * sa, cm.y * sq, -cm.x * sa + cm.z * ca) * RL;
  cm.z = max(cm.z, -${(lt-.8).toFixed(1)});
  nm = vec3(nm.x * ca + nm.z * sa, nm.y, -nm.x * sa + nm.z * ca);
  pm.z = max(pm.z, -${(lt-.4).toFixed(1)});                                  // never through the wall
  vec3 pt = vec3(aCtrB.x * mir, aCtrB.y, aCtrB.z) * vec3(s, RL, s) + vec3(aOffB.x * mir, aOffB.y, aOffB.z) * s;
  pt.z = max(pt.z, -${(lt-.35).toFixed(2)});
  vec3 lp = mix(pm, pt, kind);
  vec3 nrm = mix(nm, vec3(0., 0.25, 0.97), kind);
  if (type > 0.5 && type < 1.5) {
    // umbels are domes: turn the card to the camera about its centre
    vec3 ctr = mix(cm, vec3(aCtrB.x * mir, aCtrB.y, aCtrB.z) * vec3(s, RL, s), kind);
    float size = mix(length(position - aCtrA) * RL, length(aOffB) * s, kind) * 1.414;
    vec3 camL = (uHeroInv * vec4(cameraPosition, 1.)).xyz;
    vec3 toCam = camL - (aPos + vec3(0., s * 0.4, 0.) + ctr);
    vec3 rt = normalize(cross(vec3(0., 1., 0.), toCam) + vec3(1e-4, 0., 0.));
    vec3 upv = normalize(cross(toCam, rt) + vec3(0., 1e-4, 0.));
    lp = ctr + (rt * (uv.x - 0.5) + upv * (uv.y - 0.5)) * size;
    nrm = normalize(toCam + vec3(0., 1e-3, 0.)) * 0.5 + vec3(0., 0.5, 0.4);
  }
  float t = uTime;
  vec3 sw = vec3(sin(t * 1.1 + seed * 40. + position.y * 2.), 0.3 * sin(t * 1.7 + seed * 9. + position.x * 3.), cos(t * 0.9 + seed * 23.)) * (0.03 * RL * aCard.w * (1. - kind));
  float hang = clamp(-aCtrB.y, 0., 1.);
  sw += vec3(sin(t * 0.8 + seed * 31. + aCtrB.x * 5.), 0., 0.4 * cos(t * 0.7 + seed * 11.)) * (0.2 * s * hang * hang * kind);
  vec3 local = aPos + vec3(0., s * 0.4, 0.) + (lp + sw) * show;
  vec4 wp = modelMatrix * vec4(local, 1.);
  vHp = (uHeroInv * wp).xyz;
  vN = nrm;
  vV = mat3(uHeroInv) * (cameraPosition - wp.xyz);
  vUv = uv;
  float ao = mix(mix(0.45, 1., smoothstep(0.3, 1.0, length(position))), 0.9, kind);
  vCard = vec4(type, aCard.z + seed, ao, kind); vCol = aCol; vLeaf = aLeaf;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,te=`
${ft}
varying vec3 vHp, vN, vV; varying vec2 vUv; varying vec4 vCard, vCol, vLeaf;
#include <fog_pars_fragment>
void main(){
  float type = vCard.x, seed = vCard.y;
  vec2 uv = vUv;
  float fwS = fwidth(uv.x) + fwidth(uv.y);
  float lodf = smoothstep(0.03, 0.15, fwS);
  float sun = patioSun(vHp);
  float farK = smoothstep(45., 95., length(vV));               // across the patio the planting is simplified
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 nl = normalize(n + vec3(0., 0.55, 0.45));
  vec3 lampL = patioLamp(vHp, nl);
  vec3 base = (patioLight(vHp, nl, sun, 0.6) + uSkyCol * 0.45) * vCard.z;
  vec3 col;
  if (type < 0.5) {
    float hit = 0., bd = 0., bm = 0., bh = 0., bt = 0.; vec2 bq = vec2(0.);
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      vec2 hc = h22(vec2(fi * 7.3 + seed * 91., seed * 37. + fi * 3.1));
      float a = fi * 1.5708 + seed * 6.283 + (hc.x - 0.5) * 0.7;
      vec2 c = vec2(0.5) + vec2(cos(a), sin(a)) * (i < 4 ? 0.215 : 0.0);
      float ri = 0.2 + 0.075 * hc.y;
      vec2 q = uv - c;
      float d = length(q) / ri, th = atan(q.y, q.x + 1e-5) + hc.x * 6.283;
      float edge = 1. - 0.085 * (1. - lodf) * cos(th * 9.) - 0.5 * (1. - 0.6 * lodf) * smoothstep(0.5, 0., abs(sin(th * 0.5)));
      float m = d / max(edge, 0.05);
      if (m < 1.) { hit = 1.; bd = d; bm = m; bh = hc.y; bt = th; bq = q / ri; }
    }
    if (hit < 0.5) discard;
    float near = 1. - lodf;
    vec3 g = vLeaf.rgb * (0.9 + 0.7 * bh) * (0.78 + 0.22 * bd);
    // seven veins from the stalk, a crisp horseshoe band, a cupped blade: only where the leaf is large on screen
    float vein = smoothstep(0.16, 0.03, abs(sin(bt * 3.5))) * smoothstep(0.08, 0.4, bd) * (1. - 0.6 * smoothstep(0.7, 1., bd));
    g *= 1. + 0.42 * vein * near;
    g = mix(g, g * vec3(0.55, 0.36, 0.30), smoothstep(0.15, 0.06, abs(bd - 0.52)) * vLeaf.a * 0.8 * near);   // the horseshoe
    g *= 1. - 0.3 * near * smoothstep(0.25, 0.0, bd);                                   // the dimple where the stalk joins
    g *= 1. + 0.22 * near * (bq.y - bq.x) * 0.7;
    float rim = smoothstep(0.7, 1.0, bm);
    g *= 1. - 0.3 * near * smoothstep(0.9, 1.0, bm) * (1. - sun);                        // a dark lip in shade, a lit one in sun
    col = g * base + g * uSunCol * (sun * (0.08 + 0.75 * rim * (1. - 0.7 * lodf))) * vec3(1.1, 1.1, 0.5) + uSkyCol * (0.07 * (1. - 0.6 * sun)) * (0.6 + 0.4 * bd);
  } else if (type < 1.5) {
    vec2 q = uv - 0.5;
    float mask = 0., sh = 1., tone = 0.5;
    for (int i = 0; i < 9; i++) {
      float fi = float(i);
      float hh = h11(fi * 3.7 + seed * 53.);
      float a = fi * 0.7854 + seed * 6.;
      vec2 e = q - vec2(cos(a), sin(a)) * (i == 0 ? 0. : 0.25 * (0.8 + 0.35 * hh));
      float d = length(e) / 0.165, th = atan(e.y, e.x + 1e-5) + fi * 1.3;
      float pet = 0.7 + 0.3 * abs(cos(th * 2.5));
      // five petals round a dark throat, each creased down its middle and paler at its lip
      if (d < pet) { mask = 1.; sh = (0.42 + 0.58 * smoothstep(0.04, 0.5, d)) * (0.88 + 0.12 * cos(th * 5.)) * (1. + 0.16 * smoothstep(0.72, 1., d / pet)); tone = hh; }
    }
    float rr = length(q) / 0.42;
    mask = mix(mask, step(rr, 1.), lodf);
    if (mask < 0.5) discard;
    // far away a head is a shaded dome, never a flat disc: lit from above, darker at its rim and heart, mottled
    float dome = (0.6 + 0.5 * smoothstep(-0.3, 0.3, q.y)) * (1. - 0.32 * rr * rr) * (0.82 + 0.36 * vnoise(q * 11. + seed * 17.));
    float white = smoothstep(0.35, 0.6, vCol.g);
    // far away coral and scarlet are one red (a coral head in the sun reads as an orange dot), and a head only a few
    // pixels across fades toward the plant's mean so the wall does not speckle
    vec3 hue = mix(vCol.rgb, vec3(vCol.r * 0.92, vCol.g * 0.4, vCol.b * 0.6), farK * (1. - white));
    vec3 pc = hue * mix(sh * (0.8 + 0.4 * tone), mix(dome, 0.82, 0.5 * farK), lodf);
    // petals are kept under the tone map's shoulder, so in the sun they are scarlet, not orange
    vec3 pl = uSunCol * (sun * mix(0.62, 0.9, white) * mix(1., 0.62 + 0.3 * white, farK)) + uSkyCol * 0.95 + uBounce + lampL;
    col = pc * pl * vCard.z + uSkyCol * (0.07 * (1. - sun)) * (0.5 + pc) + pc * (uGlow * (0.3 + 3. * white) * (0.15 + 0.85 * sun));
    col = mix(col, vLeaf.rgb * base * 1.1 + col * 0.35, 0.45 * smoothstep(0.25, 0.7, fwS) * (1. - white));
  } else if (type < 2.5) {
    col = vec3(0.16, 0.24, 0.08) * base;
  } else {
    col = vLeaf.rgb * 0.45 * base;
  }
  // in the shade, seen from across the patio, leaf and bloom sink toward the blue of the wall: the lower half goes quiet
  float quiet = mix(0.35, 1., farK) * (1. - sun) * (1. - min(uGlow * 12., 0.7));
  float lum = dot(col, vec3(0.3, 0.5, 0.2));
  col = mix(col, lum * vec3(0.62, 0.84, 1.3), 0.58 * quiet) * (1. - 0.22 * quiet);
  gl_FragColor = vec4(patioTone(col, 1.08), 1.);
  #include <fog_fragment>
}`;function St(t,d,w,C,p){const v=d.length,f=new Float32Array(v*3),u=new Float32Array(v*4),r=new Float32Array(v*4),c=new Float32Array(v*4),m=[w.scarlet,new e.Color("#EE6A4C"),new e.Color("#D4D0C6"),new e.Color("#D0307C")],y=new e.Color;for(let o=0;o<v;o++){const s=d[o],h=s.seed*3.77%1,x=s.seed*9.13%1;f.set([s.x,s.y,lt],o*3);const l=s.kind===1;u.set([s.size,l?1:0,s.cascade?s.cascade:l?s.trail:s.size*(.25+.5*s.spread),s.seed],o*4),y.copy(m[s.colour]).offsetHSL((h-.5)*.03,0,(x-.5)*.06),r.set([y.r,y.g,y.b,s.bloom],o*4),y.copy(w.leaf),s.kind===2?y.offsetHSL(-.02,.1,.07):s.kind===3?y.offsetHSL(-.04,.15,.1):y.offsetHSL((x-.5)*.05,0,(h-.5)*.08),c.set([y.r,y.g,y.b,s.kind===0?.5+.5*h:l?.15:0],o*4)}C.setAttribute("aPos",new e.InstancedBufferAttribute(f,3)),C.setAttribute("aPl",new e.InstancedBufferAttribute(u,4)),C.setAttribute("aCol",new e.InstancedBufferAttribute(r,4)),C.setAttribute("aLeaf",new e.InstancedBufferAttribute(c,4)),C.instanceCount=v,C.boundingSphere=new e.Sphere(new e.Vector3(0,70,3),110);const k=new e.ShaderMaterial({uniforms:{...e.UniformsLib.fog,...t},vertexShader:Jt,fragmentShader:te,fog:!0,side:e.DoubleSide}),z=new e.Mesh(C,k);return z.name=p,z}const ee=`
uniform mat4 uHeroInv; uniform float uTime, uEdgeY, uSunTan;
attribute vec3 aA; attribute vec4 aB; attribute float aKind;
varying vec2 vUv; varying vec3 vHp; varying vec4 vInfo; varying float vBand;
#include <fog_pars_vertex>
void main(){
  float h = max(aB.y, 0.3), T = sqrt(2. * h / 9.8) * 1.15;
  float ph = uTime / T + aB.z;
  float f = fract(ph);
  vec3 c; vec2 size; float life = 1.;
  if (aKind < 0.5) {
    float ff = min(f * 1.15, 1.);
    c = aA + vec3(aB.x * ff, -h * ff * ff, 0.);
    size = vec2(0.15, 0.2 + 0.34 * ff);
    life = smoothstep(0., 0.06, f) * (1. - smoothstep(0.84, 0.87, f));
  } else {
    float k = fract(ph * aB.w);                       // one crown for each drop that lands
    c = aA + vec3(0., 0.18 + 0.5 * k, 0.);
    size = vec2(0.4 + 1.1 * k, 0.25 + 0.5 * k);
    life = (1. - k) * (1. - k);
    f = k;
  }
  vec4 wc = modelMatrix * vec4(c, 1.);
  vec3 toCam = cameraPosition - wc.xyz;
  float dist = length(toCam);
  vec3 right = normalize(cross(vec3(0., 1., 0.), toCam) + vec3(1e-4, 0., 0.));
  // the band just under the line on the lime, where each chain flashes link by link as the edge passes down it
  float ride = smoothstep(uEdgeY - 10.5, uEdgeY - 5., c.y) * (1. - smoothstep(uEdgeY + 0.5, uEdgeY + 3.5, c.y));
  vBand = ride;
  float wide = max(size.x, dist * (0.0062 + 0.0045 * ride));
  float tall = max(size.y, dist * (0.0075 + 0.005 * ride));
  vec3 wpos = wc.xyz + right * (position.x * wide) + vec3(0., position.y * tall, 0.);
  vHp = (uHeroInv * wc).xyz;
  vUv = position.xy * 2.;
  vInfo = vec4(aKind, life * min(1., size.x / wide * 1.6 + ride), f, fract(aB.z * 17.3 + floor(ph) * 0.37));
  vec4 mvPosition = viewMatrix * vec4(wpos, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oe=`
${ft}
varying vec2 vUv; varying vec3 vHp; varying vec4 vInfo; varying float vBand;
#include <fog_pars_fragment>
void main(){
  float r = length(vUv), a;
  if (vInfo.x < 0.5) {
    // a teardrop: round below, drawn out above
    float w = mix(1., 0.35, smoothstep(-0.3, 1., vUv.y));
    a = 1. - smoothstep(0.55, 1., length(vec2(vUv.x / w, vUv.y)));
  } else {
    // a crown: the upper arc of a widening ring
    float ring = 1. - smoothstep(0.0, 0.22, abs(length(vec2(vUv.x, vUv.y * 1.3 + 0.35)) - 0.72));
    a = ring * smoothstep(-0.5, 0.1, vUv.y) * (0.6 + 0.4 * step(0.5, fract(atan(vUv.y + 0.4, vUv.x + 1e-5) * 3.5)));
  }
  a *= vInfo.y;
  if (a < 0.01) discard;
  float sun = patioSun(vHp);
  float ride = exp(-max(vHp.y - (uEdgeY - 3.5 * uSunTan), 0.) / 7.);      // brightest just above the line
  float tw = 0.55 + 0.45 * step(0.45, fract(vInfo.w * 7. + uTime * 1.7));
  vec3 col = uSkyCol * 1.5 + vec3(0.10, 0.11, 0.13) + uBounce;
  col += uSunCol * (sun * tw * (1.8 + 5.5 * ride));
  float flash = vBand * step(0.42, fract(vInfo.w * 13. + uTime * 2.3));       // silver sparks under the line
  col += uSunCol * (flash * 3.2);
  gl_FragColor = vec4(col, a * max(0.55 + 0.45 * sun, flash));
  #include <fog_fragment>
}`;function ae(t,d,w,C){const p=[],v=[],f=[];for(const m of d.chains){const y=Math.max(2,Math.round((3+m.seed*3%2)*C));for(let k=0;k<m.run.length-1;k++){const z=m.run[k],o=m.run[k+1],s=(k%2?-1:1)*m.side,h=z.x+s*z.size*.16,x=z.y-z.size*.45,l=lt+z.size*.3,P=o.y+o.size*.42+(o.kind===5?0:.5),i=Math.max(.6,x-P),b=(o.x-h)*.35+w.range(-.15,.15),A=w();for(let V=0;V<y;V++)p.push(h,x,l),v.push(b,i,A+V/y,w()),f.push(0);p.push(h+b,x-i,l+.1),v.push(0,i,A-.87,y),f.push(1)}}const u=new e.InstancedBufferGeometry;u.setAttribute("position",new e.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),u.setIndex([0,1,2,0,2,3]),u.setAttribute("aA",new e.InstancedBufferAttribute(new Float32Array(p),3)),u.setAttribute("aB",new e.InstancedBufferAttribute(new Float32Array(v),4)),u.setAttribute("aKind",new e.InstancedBufferAttribute(new Float32Array(f),1)),u.instanceCount=f.length,u.boundingSphere=new e.Sphere(new e.Vector3(0,70,3),110);const r=new e.ShaderMaterial({uniforms:{...e.UniformsLib.fog,...t},vertexShader:ee,fragmentShader:oe,fog:!0,transparent:!0,depthWrite:!1,side:e.DoubleSide}),c=new e.Mesh(u,r);return c.name="drops",c.renderOrder=3,c}const ne=`
uniform mat4 uHeroInv; uniform float uTime;
attribute vec3 color; attribute float aMat; attribute vec3 aPivot, aSw;
varying vec3 vHp, vN, vV, vL, vCol; varying vec2 vUv; varying float vMat;
#include <fog_pars_vertex>
void main(){
  vec3 lp = position, ln = normal;
  if (aSw.x > 0.5) {
    float ang = aSw.y * sin(uTime * (0.7 + 0.5 * fract(aSw.z * 3.7)) + aSw.z * 6.283);
    ang += 0.35 * aSw.y * sin(uTime * 2.3 + aSw.z * 11.);
    float c = cos(ang), s = sin(ang);
    vec3 q = lp - aPivot;
    if (aSw.x < 1.5) { q = vec3(q.x * c + q.z * s, q.y, -q.x * s + q.z * c); ln = vec3(ln.x * c + ln.z * s, ln.y, -ln.x * s + ln.z * c); }
    else { q = vec3(q.x * c - q.y * s, q.x * s + q.y * c, q.z); ln = vec3(ln.x * c - ln.y * s, ln.x * s + ln.y * c, ln.z); }
    lp = aPivot + q;
  }
  #ifdef USE_INSTANCING
    vec4 wp = modelMatrix * (instanceMatrix * vec4(lp, 1.));
    ln = mat3(instanceMatrix) * ln;
  #else
    vec4 wp = modelMatrix * vec4(lp, 1.);
  #endif
  vHp = (uHeroInv * wp).xyz;
  vN = mat3(uHeroInv) * (mat3(modelMatrix) * ln);
  vV = mat3(uHeroInv) * (cameraPosition - wp.xyz);
  vL = position; vCol = color; vUv = uv; vMat = aMat;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,se=`
${ft}
uniform vec3 uCobalt;
varying vec3 vHp, vN, vV, vL, vCol; varying vec2 vUv; varying float vMat;
#include <fog_pars_fragment>
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(vV + vec3(0., 0., 1e-4));
  float sun = patioSun(vHp);
  vec3 alb = vCol; float gloss = 0., wrap = 0.2;
  float n1 = vnoise(vL.xy * 1.3 + vL.z * 0.7), n2 = vnoise(vL.xy * 5.1 + vL.zx * 3.3 + 4.), n3 = vnoise(vec2(vL.x + vL.z, vL.y) * 17.);
  if (vMat < 0.5) { alb *= 0.9 + 0.12 * n1 + 0.06 * n2; wrap = 0.7; }
  else if (vMat < 1.5) { alb *= 0.8 + 0.3 * n2 + 0.1 * n3; alb = mix(alb, alb * 0.6 + 0.08, smoothstep(0.7, 0.85, n3 * 0.6 + n1 * 0.4)); gloss = 0.28; }
  else if (vMat < 2.5) { alb *= 0.7 + 0.6 * n2; alb = mix(alb, vec3(0.16, 0.07, 0.03), smoothstep(0.72, 0.9, n1) * 0.5); gloss = 0.35; }
  else if (vMat < 3.5) {
    float lich = smoothstep(0.55, 0.8, vnoise(vL.xz * 0.9 + 2.) * 0.6 + n2 * 0.4);
    alb *= 0.75 + 0.4 * n1 + 0.15 * n3; alb = mix(alb, vec3(0.42, 0.40, 0.30), lich * 0.45);
    alb *= 0.75 + 0.25 * smoothstep(0.0, 0.25, abs(fract(vUv.y * 9.) - 0.5));                  // the lap of each tile
    wrap = 0.35;
  }
  else if (vMat < 4.5) { float gr = vnoise(vec2(vUv.x * 40., vUv.y * 3.) + vL.x); alb *= 0.72 + 0.4 * gr + 0.15 * n3; alb *= 0.8 + 0.2 * smoothstep(0.02, 0.06, abs(fract(vUv.y * 6. + 0.5) - 0.5)); gloss = 0.12; }
  else if (vMat < 5.5) {
    float r = length(vUv), th = atan(vUv.y, vUv.x + 1e-5);
    float k = fract(vCol.r * 5.);                                                           // each plate its own pattern
    float pet = cos(th * floor(5. + k * 6.)) * 0.5 + 0.5;
    float blue = smoothstep(0.03, 0.0, abs(r - 0.9) - 0.035) + smoothstep(0.02, 0., abs(r - 0.6) - 0.012)
      + step(r, 0.56) * step(0.28, r) * smoothstep(0.55, 0.75, pet + 0.25 * sin(r * 30.)) + step(r, 0.2) * step(0.5, fract(th * 1.2732 + k));
    alb = mix(vec3(0.80, 0.80, 0.77), uCobalt * 1.15, clamp(blue, 0., 1.)) * (0.9 + 0.15 * n2);
    gloss = 1.;
  }
  else if (vMat < 6.5) { alb *= 0.85 + 0.3 * n3; wrap = 0.6; }
  else if (vMat < 7.5) { alb *= 0.35 + 0.65 * smoothstep(0.2, 1., vUv.y); wrap = 1.; sun *= 0.15; }
  else { float sp = smoothstep(0.55, 0.75, vnoise(vL.xy * 9.)); alb *= 0.8 + 0.3 * n3; alb = mix(alb, alb * 0.55, sp); wrap = 0.4; }
  vec3 col = patioTone(alb * patioLight(vHp, n, sun, wrap), 1.0);
  vec3 hv = normalize(uSunDir + v + vec3(0., 1e-4, 0.));
  float ndh = max(dot(n, hv), 0.), fr = 1. - max(dot(n, v), 0.);
  col += uSunCol * (gloss * sun * (pow(ndh, 40.) * 0.9 + pow(ndh, 6.) * 0.06)) + uSkyCol * (gloss * fr * fr * 0.4);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function wt(){const t=[],d=new e.Euler,w=new e.Matrix4,C=(r,c,m,y={})=>{y.rot&&(w.makeRotationFromEuler(d.set(y.rot[0],y.rot[1],y.rot[2])),r.applyMatrix4(w)),y.at&&r.translate(y.at[0],y.at[1],y.at[2]);const k=r.attributes.position.count,z=new Float32Array(k*3),o=new Float32Array(k).fill(m),s=new Float32Array(k*3),h=new Float32Array(k*3),x=c.isColor?[c.r,c.g,c.b]:c;for(let l=0;l<k;l++)z.set(x,l*3),y.sw&&(s.set(y.pivot,l*3),h.set(y.sw,l*3));if(y.shade){const l=r.attributes.position;for(let P=0;P<k;P++){const i=y.shade(l.getX(P),l.getY(P),l.getZ(P));z[P*3]*=i,z[P*3+1]*=i,z[P*3+2]*=i}}return r.setAttribute("color",new e.BufferAttribute(z,3)),r.setAttribute("aMat",new e.BufferAttribute(o,1)),r.setAttribute("aPivot",new e.BufferAttribute(s,3)),r.setAttribute("aSw",new e.BufferAttribute(h,3)),t.push(r),r};return{add:C,box:(r,c,m,y,k,z,o={})=>C(new e.BoxGeometry(r,c,m),k,z,{...o,at:y}),cyl:(r,c,m,y,k,z,o,s={})=>C(new e.CylinderGeometry(c,r,m,y,s.hs||1,!!s.open),z,o,{...s,at:k}),rod:(r,c,m,y,k,z={})=>{const o=new e.Vector3(c[0]-r[0],c[1]-r[1],c[2]-r[2]),s=o.length(),h=new e.CylinderGeometry(z.r1??m,m,s,z.segs||4,1,!1);return h.applyQuaternion(new e.Quaternion().setFromUnitVectors(new e.Vector3(0,1,0),o.normalize())),C(h,y,k,{...z,rot:null,at:[(r[0]+c[0])/2,(r[1]+c[1])/2,(r[2]+c[2])/2]})},build:()=>{const r=Dt(t,!1);for(const c of t)c.dispose();return r}}}function re(t,d,w,C){const p=w.lime.clone().multiplyScalar(.8),v=w.lime.clone().multiplyScalar(.86),f=new e.Color("#2C6A3C"),u=new e.Color("#215231"),r=new e.Color(.04,.045,.055),c=new e.Color("#4A3524"),m=new e.Color("#7A5A38"),y=w.terra.clone().multiplyScalar(.72);t.box(ht,at,6,[0,at/2,-3.06],p,0);const k=Math.atan2(5.6,10.6),z=12.2;t.box(ht+.8,.45,11,[0,139.72,-.9],c,4);for(let M=0;M<35;M++)t.box(.55,.7,4.3,[qt+M*4+2,139.25,2.25],c,4,{shade:(B,E,U)=>.7+.3*(U/4.4)});t.box(ht+1.2,.3,z,[0,143.25,-.7],y.clone().multiplyScalar(.4),3,{rot:[k,0,0]});for(let M=0;M<70;M++){const B=C.range(.72,1.12),E=C.chance(.12)?.25:0,U=y.clone().multiplyScalar(B).lerp(new e.Color(.55,.5,.42),E),n=new e.CylinderGeometry(.6,.8,z+C.range(0,.5),6,1,!0,-Math.PI/2,Math.PI);t.add(n,U,3,{rot:[k-Math.PI/2,0,0],at:[-69+M*2+C.range(-.08,.08),143.55,-.75]})}t.add(new e.CylinderGeometry(.95,.95,ht+1.2,7,1,!0,0,Math.PI),y.clone().multiplyScalar(.9),3,{rot:[0,0,Math.PI/2],at:[0,146.2,-6.2]});const o=C.range(-50,50);t.box(4.6,6.4,4.6,[o,147.6,-2.6],v,0,{shade:(M,B)=>.8+.2*J(144.5,148,B)}),t.box(5.6,.5,5.6,[o,151,-2.6],p,0),t.box(3.9,.25,5.2,[o-1.3,152.1,-2.6],y,3,{rot:[0,0,.62]}),t.box(3.9,.25,5.2,[o+1.3,152.1,-2.6],y.clone().multiplyScalar(.85),3,{rot:[0,0,-.62]});for(const M of d.windows){const{x:B,y:E,w:U,h:n}=M;t.box(U,n,.1,[B,E,.06],new e.Color(.07,.08,.12),7);const g=.55,a=.5;t.box(U+2*g,g,a,[B,E+n/2+g/2,a/2],v,0),t.box(U+2*g,g*.5,a*1.5,[B,E+n/2+g*1.2,a*.75],v,0),t.box(g,n,a,[B-U/2-g/2,E,a/2],v,0),t.box(g,n,a,[B+U/2+g/2,E,a/2],v,0),t.box(U+2.6,.5,1.3,[B,E-n/2-.25,.65],v,0),t.box(U+1.8,.35,.9,[B,E-n/2-.65,.45],p,0);const S=1.05,q=B-U/2-.1,L=B+U/2+.1,I=E-n/2+.1,N=E+n/2-.1;for(let T=0;T<=5;T++){const Y=O(q,L,T/5);t.rod([Y,I-.2,S],[Y,N+.5,S],.085,r,2,{r1:.05})}for(let T=0;T<4;T++){const Y=O(I,N,T/3);t.rod([q-.15,Y,S],[L+.15,Y,S],.075,r,2)}for(const T of[q,L])for(const Y of[I,N])t.rod([T,Y,.05],[T,Y,S],.075,r,2);const _=U/2+.2;for(const T of[-1,1]){const Y=B+T*(U/2+g+.1),rt=.75,ot=M.swing&&T>0,W=T*Math.PI*(ot?.66:.52+.4*M.open+(T>0?.03:0)),et=ot?{sw:[1,.2,M.seed],pivot:[Y,E,rt]}:{},X=($,ut,nt,j,yt,At)=>{const it=new e.BoxGeometry($,ut,nt);it.translate(-T*(_/2+j),yt,0),it.rotateY(W),it.translate(Y,E,rt),t.add(it,At,1,et)};X(_,n+.5,.16,0,0,f),X(_*.7,n*.38,.24,0,n*.225,u),X(_*.7,n*.38,.24,0,-n*.225,u)}}const s=d.balcony,h=s.x,x=s.y,l=14.5,P=5.2;t.box(l,.8,P,[h,x-.4,P/2],v,0,{shade:(M,B)=>B<x-.5?.75:1}),t.box(l+.5,.35,P+.25,[h,x+.05,P/2+.1],p,0);for(const M of[-.42,-.14,.14,.42])t.box(.9,2.6,3.4,[h+M*l,x-1.9,1.5],p,0,{rot:[.5,0,0],shade:(B,E)=>.7+.3*J(x-3.5,x-.8,E)});const i=8.4,b=18.5;t.box(i,b,.1,[h,x+b/2,.06],new e.Color(.06,.07,.1),7),t.box(i+1.6,.8,.6,[h,x+b+.4,.3],v,0),t.box(.8,b,.6,[h-i/2-.4,x+b/2,.3],v,0),t.box(.8,b,.6,[h+i/2+.4,x+b/2,.3],v,0);for(const M of[-1,1]){const B=h+M*(i/2+.9),E=.8,U=M*2.75,n=i/2;for(const[g,a,S,q,L]of[[n,b,.2,0,f],[n*.68,b*.26,.3,b*.3,u],[n*.68,b*.26,.3,0,u],[n*.68,b*.26,.3,-b*.3,u]]){const I=new e.BoxGeometry(g,a,S);I.translate(-M*n/2,q,0),I.rotateY(U),I.translate(B,x+b/2,E),t.add(I,L,1)}}const A=P-.25,V=h-l/2+.3,H=h+l/2-.3,G=x+9.6,F=(M,B)=>{t.rod([M,x+.2,B],[M,G,B],.11,r,2,{r1:.08}),t.box(.42,.42,.42,[M,x+5.2,B],r,2,{rot:[0,.785,.785]})};for(let M=0;M<=12;M++)F(O(V,H,M/12),A);for(let M=1;M<=3;M++)F(V,O(A,.3,M/3.4)),F(H,O(A,.3,M/3.4));for(const M of[x+.9,G-.9,G]){const B=M===G?.2:.1;t.rod([V,M,A],[H,M,A],B,r,2),t.rod([V,M,A],[V,M,.1],B,r,2),t.rod([H,M,A],[H,M,.1],B,r,2)}{const M=new e.Color("#C7A45C"),B=new e.Color("#B9995A"),E=h-l*.26,U=2.4,n=.35,g=(a,S,q,L,I,N,_,T)=>{const Y=new e.BoxGeometry(a,S,q);Y.translate(L,I,N),Y.rotateY(n),Y.translate(E,x+.25,U),t.add(Y,_,T)};g(4.3,.35,4,0,4.5,0,B,4);for(const a of[-1,1])g(.36,4.5,.36,a*1.95,2.25,1.8,M,4),g(.36,9.4,.36,a*1.95,4.7,-1.8,M,4),g(.24,.24,3.6,a*1.95,1.6,0,M,4);g(3.9,.24,.24,0,1.9,1.8,M,4);for(const a of[6.2,7.5,8.9])g(3.9,.7,.2,0,a,-1.8,M,4)}}function le(t,d,w,C,p){const v=new e.Color(.04,.045,.055),f=new e.Color("#8A6A44"),u=new e.Color("#C9A65E");for(const o of d.plates){const s=new e.CylinderGeometry(o.r,o.r*.55,.3,16,1,!1),h=s.attributes.position,x=s.attributes.uv;for(let l=0;l<h.count;l++)x.setXY(l,h.getX(l)/o.r,h.getZ(l)/o.r);t.add(s,[o.seed,.8,.8],5,{rot:[Math.PI/2,0,o.seed*6],at:[o.x,o.y,.2]}),t.rod([o.x,o.y+o.r*.95,.08],[o.x,o.y+o.r*1.25,.08],.07,v,2)}{const o=d.ladder.x,s=d.ladder.top,h=6.6,x=.45,l=1.9;for(const P of[-1,1])t.rod([o+P*l,0,h],[o+P*l*.92,s,x],.3,f,4,{r1:.26,shade:(i,b)=>.75+.25*J(0,6,b)});for(let P=1;P<=9;P++){const i=P/10,b=s*i,A=O(h,x,i),V=l*O(1,.92,i);t.rod([o-V,b,A],[o+V,b,A],.17,f.clone().multiplyScalar(.9),4,{segs:5})}}const r=d.cane.x;if(p==="cane"){const o=[r,0,7.6],s=[r+1.6,27.2,.9],h={sw:[2,.012,.37],pivot:o},x=(A,V)=>[O(o[0],s[0],A)+V,O(o[1],s[1],A),O(o[2],s[2],A)+V*.5],l=[x(0,0),x(.34,.25),x(.67,.3),x(1,0)];for(let A=0;A<3;A++)t.rod(l[A],l[A+1],.2-A*.03,u,4,{segs:6,r1:.17-A*.03,...h});for(let A=1;A<=9;A++){const V=x(A/10,.3*Math.sin(A/10*Math.PI));t.cyl(.24,.24,.14,6,V,u.clone().multiplyScalar(.7),4,{rot:[-.24,0,-.06],...h})}const P=new e.Color(.42,.44,.46),i=s[1]-1.2,b={sw:[2,.012,.37],pivot:o};t.cyl(.62,.72,1.7,10,[s[0]+.75,i,s[2]+.2],P,1,{open:!0,...b}),t.cyl(.62,.62,.08,10,[s[0]+.75,i-.8,s[2]+.2],P.clone().multiplyScalar(.7),1,b);for(const A of[-.5,.2])t.cyl(.78,.78,.16,8,[s[0]+.4,i+A,s[2]+.2],new e.Color("#8C7448"),4,{open:!0,...b})}else{const o=new e.Color(.4,.43,.46),s=r+1.5,h=4.2;t.cyl(2,1.7,5,12,[s,2.5,h],o,1,{shade:(P,i)=>.7+.3*J(0,2.5,i)}),t.cyl(1.72,1.72,.2,12,[s,5.05,h],o.clone().multiplyScalar(.6),1),t.rod([s+1.4,1.2,h],[s+7.2,6.4,h+.6],.45,o,1,{segs:7,r1:.2}),t.cyl(.25,.75,.9,8,[s+7.5,6.7,h+.63],o,1,{rot:[0,0,-.84]}),t.rod([s+1.2,3.6,h],[s+3.6,4.2,h+.25],.12,o,1);const x=new e.TorusGeometry(1.7,.16,5,10,Math.PI);t.add(x,o,1,{rot:[0,0,0],at:[s,5,h]});const l=new e.TorusGeometry(1.5,.16,5,8,Math.PI);t.add(l,o,1,{rot:[0,0,Math.PI/2],at:[s-1.7,2.8,h]})}const c=d.cage,m=c.y+4.6;t.box(.9,1.6,.12,[c.x,m-.2,.08],v,2),t.rod([c.x,m,.1],[c.x,m,c.z+.7],.13,v,2),t.rod([c.x,m-1.9,.1],[c.x,m-.15,c.z-.9],.1,v,2);const y=new e.TorusGeometry(.42,.07,4,10,Math.PI*1.6);t.add(y,v,2,{rot:[0,Math.PI/2,.4],at:[c.x,m-.5,c.z+.4]}),t.rod([c.x,m,c.z],[c.x,m-.95,c.z],.07,v,2);const k=d.lamp,z=k.y+6.6;t.box(1,2.2,.14,[k.x,z-.5,.09],v,2),t.rod([k.x,z,.1],[k.x,z,k.z+.5],.15,v,2),t.rod([k.x,z-2.6,.1],[k.x,z-.2,k.z-.8],.11,v,2),t.add(new e.TorusGeometry(.55,.08,4,10,Math.PI*1.6),v,2,{rot:[0,Math.PI/2,.4],at:[k.x,z-.7,k.z*.5]})}function ie(){const t=wt(),d=new e.Color(.05,.055,.065),w=new e.Color(.55,.4,.14),C=1.7,p=5,v=14,f=u=>{const r=u<.42?Math.sin(u/.42*Math.PI/2):1;return[C*r,-.55-(p-1)*u]};for(let u=0;u<v;u++){const r=u/v*Math.PI*2,c=Math.cos(r),m=Math.sin(r),y=7,k=[],z=[],o=[],s=[],h=.065;for(let l=0;l<=y;l++){const[P,i]=f(l/y);if(k.push(c*P-m*h,i,m*P+c*h,c*P+m*h,i,m*P-c*h),z.push(c,.2,m,c,.2,m),s.push(0,l/y,1,l/y),l<y){const b=l*2;o.push(b,b+1,b+2,b+1,b+3,b+2)}}const x=new e.BufferGeometry;x.setAttribute("position",new e.Float32BufferAttribute(k,3)),x.setAttribute("normal",new e.Float32BufferAttribute(z,3)),x.setAttribute("uv",new e.Float32BufferAttribute(s,2)),x.setIndex(o),t.add(x,d,2)}for(const[u,r]of[[.42,.16],[.7,.12],[1,.22]]){const[c,m]=f(u);t.cyl(c+.02,c+.02,r,16,[0,m,0],d,2,{open:!0})}return t.cyl(C*.98,C*.98,.14,16,[0,-p+.38,0],new e.Color(.3,.25,.16),4),t.cyl(C+.12,C*.9,.3,16,[0,-p+.2,0],d,2),t.cyl(.16,.05,.6,6,[0,-.3,0],w,1),t.add(new e.TorusGeometry(.24,.05,4,10),w,1,{at:[0,.05,0]}),t.rod([-C*.92,-2.6,.25],[C*.92,-2.6,.25],.07,new e.Color("#9A7A4A"),4,{segs:5}),t.rod([.2,-3.7,-C*.9],[.2,-3.7,C*.9],.07,new e.Color("#9A7A4A"),4,{segs:5}),t.cyl(.3,.36,.4,8,[C*.78,-3.4,-.7],new e.Color(.75,.76,.72),1),t.build()}function ce(t){const d=wt(),w=t==="goldfinch",C=new e.Color(w?"#C6A070":"#F0B018"),p=new e.Color(w?"#17171A":"#D99A10"),v=new e.Color("#F2C21E"),f=new e.Color(w?"#C4241A":"#F4BC24"),u=new e.Color("#E8C9A0"),r=new e.Color(.02,.02,.02),c=(m,y,k,z,o,s,h={})=>{const x=new e.SphereGeometry(m,h.ws||8,h.hs||6);return x.scale(y,k,z),d.add(x,s,6,{...h,at:o})};c(.34,1.45,1,.95,[-.02,.47,0],C,{rot:[0,0,.32],shade:(m,y)=>.8+.2*J(-.3,.2,y)}),c(.215,1.05,1,.95,[.4,.78,0],f,{ws:7,hs:5}),w&&c(.2,.7,.6,1,[.3,.9,0],r,{ws:6,hs:4}),d.cyl(.075,0,.24,5,[.68,.76,0],u,6,{rot:[0,0,-Math.PI/2]});for(const m of[-1,1])d.box(.05,.05,.03,[.5,.83,m*.185],r,2),c(.3,1.35,.72,.22,[-.14,.52,m*.3],p,{rot:[0,m*.1,.42],ws:7,hs:4}),d.box(.3,.07,.03,[-.2,.5,m*.375],v,6,{rot:[0,0,.42]}),d.rod([.02,.24,m*.1],[.06,0,m*.12],.025,u,6,{segs:4}),d.box(.2,.035,.09,[.1,0,m*.12],u,6);return d.box(.62,.05,.22,[-.66,.3,0],p,6,{rot:[0,0,.36]}),d.box(.2,.04,.26,[-.92,.2,0],w?r:v,6,{rot:[0,0,.36]}),d.build()}function fe(){const t=wt(),d=new e.Color(.34,.35,.27),w=new e.Color(.42,.42,.34),C=new e.Color(.03,.03,.02),p=(f,u,r,c,m,y,k={})=>{const z=new e.SphereGeometry(f,k.ws||8,k.hs||5);return z.scale(u,r,c),t.add(z,y,8,{...k,at:m})};p(.2,2.1,.72,.5,[0,0,.09],d),p(.15,1.25,.95,.55,[.5,0,.1],w,{ws:7}),p(.1,1.3,.75,.6,[.66,0,.09],w,{ws:6,hs:4});for(const f of[-1,1]){t.box(.06,.06,.05,[.56,f*.115,.16],C,2);for(const[u,r]of[[.27,1],[-.3,-1]]){const c=[u+r*.06,f*.3,.1],m=[u+r*.25,f*.44,.03];t.rod([u,f*.1,.09],c,.05,d,8,{segs:5,r1:.04}),t.rod(c,m,.04,d,8,{segs:5,r1:.03});for(let y=-2;y<=2;y++){const k=Math.atan2(f*.14,r*.19)+y*.42;t.rod(m,[m[0]+Math.cos(k)*.12,m[1]+Math.sin(k)*.12,.02],.022,w,8,{segs:3,r1:.03})}}}const v=[-.38,0,.07];for(let f=0;f<7;f++){const u=-.36-f*.115,r=.1*(1-f/7.6),c=.1*(1-(f+1)/7.6);t.rod([u,0,.07],[u-.125,0,.065],r,f%2?d:w,8,{segs:6,r1:c,sw:[2,.09+f*.14,.2],pivot:v})}return t.build()}async function de(t,d={}){const w=t.rng.fork("patio-of-pots-hero"),C=t.quality?.detail??1,p=zt[d.look]?d.look:"may",v=zt[p],f=(d.palette&&d.palette.length>=7?d.palette:Ut).map(D=>new e.Color(D)),u={lime:f[0],shade:f[1],cobalt:f[2],scarlet:f[3],leaf:f[4],terra:f[5],sky:f[6]},r=d.birds||(w.chance(.5)?"canary":"goldfinch"),c=d.tool||(w.chance(.6)?"cane":"can"),m=Rt(Nt),y=Array.isArray(d.altitude)?d.altitude:[v.a0,v.a1],k=D=>m(D)+(y[0]-30)*(1-J(0,.44,D))+(y[1]-53)*J(.66,1,D),z=D=>at-gt*Math.tan(k(D)*Math.PI/180),o=Yt(w,p),s=new e.Color(v.sunLo),h=new e.Color(v.sunHi),x=p==="moon"?new e.Color(.3,.38,1):new e.Color(u.shade.r/.92,u.shade.g/.84,u.shade.b/.66),l={uHeroInv:{value:new e.Matrix4},uSunDir:{value:new e.Vector3(0,.5,.85)},uSunCol:{value:new e.Color(1,1,1)},uSkyCol:{value:x.clone().multiplyScalar(v.skyI)},uBounce:{value:new e.Color(0,0,0)},uSunTan:{value:.3},uSunSide:{value:jt},uEaveH:{value:at},uPatioD:{value:gt},uChimX:{value:o.chimX},uChimH:{value:o.chimH},uTime:{value:0},uEdgeY:{value:100},uWet:{value:v.wet},uGlow:{value:v.glow},uHLamp:{value:new e.Vector4(o.lamp.x,o.lamp.y,o.lamp.z,0)},uHLampCol:{value:new e.Color(1,.56,.2)}},P=new e.Group;P.name="patio-of-pots-hero",await t.yield(),P.add(Wt(l,o,u)),await t.yield();const i=o.pots.filter(D=>D.near),b=o.pots.filter(D=>!D.near);P.add(Tt(l,i,u,p,!0)),await t.yield(),P.add(Tt(l,b,u,p,!1)),await t.yield();const A=w.fork("plants");P.add(St(l,i.filter(D=>D.kind!==5),u,_t(A,!0),"plants-near")),await t.yield(),P.add(St(l,b.filter(D=>D.kind!==5&&!D.cascade),u,_t(A,!1),"plants-far")),await t.yield();const V=b.filter(D=>D.cascade);V.length&&P.add(St(l,V,u,Qt(w.fork("cascade")),"cascades")),await t.yield(),P.add(ae(l,o,w.fork("drops"),C)),await t.yield();const H=new e.ShaderMaterial({uniforms:{...e.UniformsLib.fog,...l,uCobalt:{value:u.cobalt}},vertexShader:ne,fragmentShader:se,fog:!0,side:e.DoubleSide}),G=wt(),F=w.fork("fittings");re(G,o,u,F),await t.yield(),le(G,o,u,F,c);const M=new e.Mesh(G.build(),H);M.name="fittings",M.frustumCulled=!1,P.add(M),await t.yield();const B=new e.Mesh(ie(),H);B.name="cage",B.position.set(o.cage.x,o.cage.y+3.6,o.cage.z),P.add(B);const E=ce(r),U=[0,1].map(D=>{const R=new e.Mesh(E,H);return R.name="bird"+D,B.add(R),R}),n=[[[-.75,-2.6,.25],[.2,-3.7,.7],[.85,-2.6,.25]],[[.2,-3.7,-.75],[.6,-2.6,.25],[-.5,-4.5,-.3]]],g=[w(),w()],a=new e.Mesh(fe(),H);a.name="gecko";const S=Q(z(.63),12,120),q=new e.Vector3(-19.4,S-1.3,.02),L=new e.Vector3(-21.6,S+2.1,.02),I=Math.atan2(L.y-q.y,L.x-q.x);a.position.copy(q),a.rotation.z=I,P.add(a),await t.yield();const N={altitude:14,edgeY:115,dir:l.uSunDir.value,color:l.uSunCol.value,sky:l.uSkyCol.value,bounce:l.uBounce.value};let _=-1,T=1,Y=!1;const rt=new e.Color(1,.92,.8),ot=new e.Color;function W(D){const R=k(D),Z=R*Math.PI/180,vt=Math.cos(Z);l.uSunDir.value.set(-.174*vt,Math.sin(Z),.985*vt).normalize(),l.uSunTan.value=Math.tan(Z);const pt=at-gt*Math.tan(Z);l.uEdgeY.value=pt,ot.copy(s).lerp(h,J(6,30,R)*(v.whiten??1)),l.uSunCol.value.copy(ot).multiplyScalar(v.sunI*T*J(.5,6,R));const tt=Q((at-pt)/at,0,1);l.uBounce.value.copy(rt).multiply(ot).multiplyScalar(.085*tt*v.sunI*T),N.altitude=R,N.edgeY=pt}function et(D){Y=!0,_=Q(D,0,1),W(_)}function X(D){T=Q(D,0,1),_>=0&&W(_)}const $=d.demo!==!1;W(.5),_=.5;const ut=new e.Matrix4;function nt(D,R){if(P.updateWorldMatrix(!0,!1),l.uHeroInv.value.copy(ut.copy(P.matrixWorld).invert()),l.uTime.value=R,!Y){const tt=$?.42+.26*(R/24%1):.5;_=tt,W(tt)}B.rotation.y=.9*Math.sin(R*.31)+.25*Math.sin(R*.83+1),B.rotation.z=.035*Math.sin(R*1.3),B.rotation.x=.03*Math.sin(R*1.1+2);for(let tt=0;tt<2;tt++){const Vt=2.3+tt*.9,kt=R/Vt+g[tt],mt=Math.floor(kt),Pt=kt-mt,Lt=n[tt],xt=Lt[(mt%3+3)%3],bt=Lt[((mt+1)%3+3)%3],ct=J(.82,1,Pt),Bt=U[tt];Bt.position.set(O(xt[0],bt[0],ct),O(xt[1],bt[1],ct)+Math.sin(ct*Math.PI)*.55+.03*Math.abs(Math.sin(R*9+tt)),O(xt[2],bt[2],ct));const It=Math.sin(mt*12.9898+tt*4.1)*43758.5453,Et=(It-Math.floor(It))*6.283,Gt=Math.floor(Pt*4)*.5;Bt.rotation.set(0,Et+Gt+ct*1.2,.12*Math.sin(R*5+tt*2)-.25*Math.sin(ct*Math.PI))}const Z=Q((_-.615)/.045,0,1),vt=(J(0,.22,Z)+J(.38,.6,Z)+J(.78,1,Z))/3,pt=Math.sin(Q(Z,0,1)*Math.PI*3)**2*(Z>0&&Z<1?1:0);a.position.lerpVectors(q,L,vt),a.rotation.z=I+.2*Math.sin(R*17)*pt+.05*Math.sin(R*.7)}nt(0,0);const j=(D,R,Z)=>new e.Vector3(D,R,Z),yt=j(0,0,0),it={flyThrough:[j(30,14,90),j(27,20,58),j(11,26,29),j(-13,32,14),j(-38,42,14),j(-52,50,30),j(-50,55,50),j(-36,58,64),j(-15.5,63,67.5),j(4,73,64),j(19.5,86,53),j(34.7,117,37.8),j(49.9,147.5,22.6)],closePass:[j(-13,32,14),j(-38,42,14)],cage:B.position.clone().add(j(0,-2.6,0)),gecko:q.clone(),lamp:j(o.lamp.x,o.lamp.y,o.lamp.z),lampHook:j(o.lamp.x,o.lamp.y+6.6,o.lamp.z),edgeAt:(D,R=0,Z=yt)=>Z.set(R,Q(z(D),0,at),0),portalSeat:{position:j(49.9,147.5,22.6),facing:j(-15.2,-30.5,15.2).normalize()},viewpoints:{reveal:j(30,15,86),turn:j(11,26,29),close:j(-24,36,14),exit:j(19.5,86,53)},toWorld:D=>D.clone().applyMatrix4(P.matrixWorld)};return{object:P,radius:76,height:152,center:j(0,70,0),anchors:it,parts:{cageGeometry:B.geometry,birdGeometry:E,material:H,birdSpots:n},update:nt,dispose(){},ground:!0,groundY:0,setProgress:et,setCloud:X,altitude:k,sun:N,uniforms:l,glsl:ft,info:{look:p,birds:r,tool:c,pots:o.pots.length,near:i.length,chains:o.chains.length}}}export{de as buildHero};
