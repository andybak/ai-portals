import*as t from"three";const Ft=["#FFF1CF","#F6B85A","#D9772B","#9E4420","#4A2212","#150A07","#A9C3CC"],de=235,ce=150,Ue=50,oe=40,St=4.8,Mt=.22,at=.82,Pt=.48,Tt=.54,Bt=[[.13,-.5],[-.13,-.5],[.14,.36],[-.14,.36]],$t=[0,.1,.4,.5],fe=20,ae=`
uniform vec3 uGlass, uGold, uOrange, uSienna, uUmber, uBlack, uCool, uSun;
uniform float uTime, uXf, uSeed, uSheen;
float h11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float h31(vec3 p3){ p3 = fract(p3 * 0.1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float a = mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), f.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), f.x), f.y);
  float b = mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), f.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1., 1., 1.)), f.x), f.y);
  return mix(a, b, f.z); }
float fbm2(vec2 p){ return 0.5 * vn2(p) + 0.3 * vn2(p * 2.03 + 7.1) + 0.2 * vn2(p * 4.01 + 13.7); }
// tone is thickness: depth of sand in metres over the lit glass
vec3 sandRamp(float d, vec3 glass){
  vec3 c = mix(glass, uGold, smoothstep(0.0, 0.03, d));
  c = mix(c, uOrange, smoothstep(0.03, 0.14, d));
  c = mix(c, uSienna, smoothstep(0.14, 1.0, d));
  c = mix(c, uUmber, smoothstep(1.0, 3.2, d));
  return mix(c, uBlack, smoothstep(3.2, 14.0, d)); }
// the palm: everything with x beyond the front is gone; the fingers make the front wavy
float fingers(float z){ return 16. * sin(z * 0.041 + uSeed) + 9. * sin(z * 0.113 + 2.3 * uSeed) + 4. * sin(z * 0.29 + 1.7); }
float wipeGone(vec2 xz){ return smoothstep(0., ${Ue.toFixed(1)}, xz.x + fingers(xz.y) - uXf); }
// between the fingers the palm leaves windrows: long low streaks of sand that wander, taper and break
float windrow(vec2 xz){
  float zc = xz.y / 37. + 0.35 * sin(xz.x * 0.013 + uSeed) + 0.5 * (vn2(vec2(xz.x * 0.021, 3.)) - 0.5);
  float zk = floor(zc), zf = abs(fract(zc) - 0.5);
  float sw = (0.05 + 0.12 * h11(zk + 5.)) * (0.4 + 0.9 * vn2(vec2(xz.x * 0.017 + zk * 7., 1.)));
  float brk = smoothstep(0.25, 0.5, vn2(vec2(xz.x * 0.011 + zk * 3.3, 7.)));
  float inR = (1. - smoothstep(118., 136., abs(xz.y))) * (1. - smoothstep(204., 224., abs(xz.x)));      // (clear of the footprint's own edge)
  return (1. - smoothstep(sw * 0.3, sw * 1.6 + 0.08, zf)) * brk * (0.45 + 0.55 * h11(zk + 2.)) * inR;
}
`,nt=`
// bare glass: cream lamp with dust, hairline scratches, old smudges and the sliding cool sheen
vec3 glassLook(vec2 xz, vec3 V, float fw){
  vec3 g = uGlass * (0.89 + 0.13 * fbm2(xz * 0.03 + 3.1));
  float fine = vn2(xz * 1.9) - 0.5; g *= 1. - 0.07 * fine * (1. - clamp(fw * 1.9, 0., 1.));
  float c1 = dot(xz, vec2(0.83, 0.56)) * 0.21 + 2.5 * vn2(xz * 0.004), c2 = dot(xz, vec2(-0.31, 0.95)) * 0.13 + 1.5 * vn2(xz * 0.006 + 9.);
  float w1 = abs(fract(c1) - 0.5), w2 = abs(fract(c2) - 0.5);
  float s1 = (1. - smoothstep(0., 0.012 + fw * 0.35, w1)) * step(0.86, h11(floor(c1))) * smoothstep(0.55, 0.7, vn2(xz * 0.02 + floor(c1) * 3.7));
  float s2 = (1. - smoothstep(0., 0.012 + fw * 0.22, w2)) * step(0.88, h11(floor(c2) + 31.)) * smoothstep(0.55, 0.7, vn2(xz * 0.015 + floor(c2) * 5.3));
  g *= 1. - 0.13 * max(s1, s2) * (1. - clamp(fw * 0.25, 0., 1.));
  vec2 cell = floor(xz / 70.), cf = fract(xz / 70.) - 0.5;   // an old palm smudge here and there
  float sm = (1. - smoothstep(0.1, 0.42, length(cf + 0.3 * (vec2(h21(cell), h21(cell + 7.)) - 0.5)))) * step(0.6, h21(cell + 3.));
  g *= 1. - 0.035 * sm * (0.6 + 0.4 * sin(length(cf) * 90.));
  float fres = 1. - clamp(V.y, 0., 1.); fres *= fres; fres *= fres;
  float band = 0.5 + 0.5 * sin(dot(xz, vec2(0.011, 0.019)) - uTime * 0.22 + 5. * vn2(xz * 0.005));
  return mix(g, uCool * 1.25, clamp(fres * (0.12 + 0.5 * band) * uSheen, 0., 0.6));
}
`,st=`
uniform vec4 uComb[6];
float combStreaks(vec2 xz, float fz){
  float acc = 0.;
  for (int i = 0; i < 6; i++) {
    vec4 c = uComb[i]; float fi = float(i);
    float t = (xz.x - c.x) / max(c.z, 1.), tp = max(1. - t * t, 0.);
    float lat = xz.y - c.y - 5. * sin(xz.x * 0.012 + fi * 2.1) - 1.6 * sin(xz.x * 0.041 + fi * 4.7);
    float W = c.w * sqrt(tp), q = lat / 0.38, k = floor(q + 0.5), f = abs(q - k) * 0.38;
    float tw = 0.04 + 0.05 * h11(k + fi * 7.);
    float on = smoothstep(0.24, 0.44, vn2(vec2(xz.x * 0.03 + k * 5.3, fi + 0.5)));
    float line = (1. - smoothstep(tw, tw + 0.03 + fz * 0.8, f)) * on;
    float v = mix(line, 0.33 * on, clamp(fz * 2.4, 0., 1.)) * (1. - smoothstep(W - 0.25, W + 0.05, abs(lat))) * step(0.0001, tp);
    acc = max(acc, v * (0.55 + 0.45 * vn2(vec2(xz.x * 0.021 + fi * 3.3, k))));
  }
  return acc;
}
`,Ht=ae,Wt=nt,qt=st,ge=`
uniform vec3 uTrk[${oe}]; uniform float uTrkDs;
uniform float uSLead, uClock, uT0, uSpeed, uPx;
void trackAt(float s, out vec3 p, out vec3 t){
  float f = s / uTrkDs; float fi = clamp(floor(f), 0., ${(oe-2).toFixed(1)}); float k = f - fi; float kc = clamp(k, 0., 1.);
  int i = int(fi);
  vec3 p1 = uTrk[i], p2 = uTrk[i + 1];
  // (the end points are mirrored, so the line runs on straight at full pace beyond both ends)
  vec3 p0 = i > 0 ? uTrk[max(i - 1, 0)] : 2. * p1 - p2, p3 = i < ${oe-2} ? uTrk[min(i + 2, ${oe-1})] : 2. * p2 - p1;
  vec3 a = 2. * p1, b = p2 - p0, c = 2. * p0 - 5. * p1 + 4. * p2 - p3, d = -p0 + 3. * p1 - 3. * p2 + p3;
  vec3 tg = 0.5 * (b + 2. * c * kc + 3. * d * kc * kc);
  p = 0.5 * (a + b * kc + c * kc * kc + d * kc * kc * kc) + tg * (k - kc);
  t = tg / max(length(tg), 1e-4);
}
float herdLat(float lat, float s, float seed){
#ifdef FILES
  return lat + 0.3 * sin(s * 0.05 + seed * 6.283);
#endif
  return lat + 1.1 * sin(s * 0.021 + seed * 6.283); }
#ifdef FILES
// the files that run on up the arm beside our furrow: uFile = (metres along their line where they are sifted in, metres that takes,
// metres where the line ends, lift of marks over the sand); uFK = how the ground rises per metre out from the line, node by node.
// An animal's metres along its line are FILE_PACE (metres a second: a define of the files' materials, see addFiles) times the
// seconds of the flight's clock (uClock) since its own second (iB.x), the moment it left the herd's stream; nothing else moves it.
uniform vec4 uFile; uniform float uFK[${oe}];
float fileRise(float s, float lat){ float f = clamp(s / uTrkDs, 0., ${(oe-1).toFixed(1)}), fi = min(floor(f), ${(oe-2).toFixed(1)}); int i = int(fi); return lat * mix(uFK[i], uFK[i + 1], f - fi); }
#endif
`,Ne=(n,a,r)=>{const y=Math.min(1,Math.max(0,(r-n)/(a-n)));return y*y*(3-2*y)},_t=(n,a)=>16*Math.sin(n*.041+a)+9*Math.sin(n*.113+2.3*a)+4*Math.sin(n*.29+1.7);function it(n,a){const r=n.length;return(y,x,A)=>{const U=y/a,N=Math.min(r-2,Math.max(0,Math.floor(U))),T=U-N,S=Math.min(1,Math.max(0,T)),O=n[N],B=n[N+1],p=N>0?n[N-1]:null,v=N<r-2?n[N+2]:null,g=["x","y","z"],u=[0,0,0],s=[0,0,0];for(let k=0;k<3;k++){const z=O[g[k]],d=B[g[k]],m=p?p[g[k]]:2*z-d,_=v?v[g[k]]:2*d-z,L=2*z,o=d-m,c=2*m-5*z+4*d-_,h=-m+3*z-3*d+_;u[k]=.5*(o+2*c*S+3*h*S*S),s[k]=.5*(L+o*S+c*S*S+h*S*S*S)+u[k]*(T-S)}return x.set(s[0],s[1],s[2]),A&&A.set(u[0],u[1],u[2]).normalize(),x}}function Lt(n){const a=n.range(18,26)*n.sign(),r=n.range(-.5,.5),y=n.range(3,6),x=n.range(0,6.28),A=n.range(15,70),U=-115-20*n(),N=.7+.12*n(),T=n.range(.5,.6),S=n.range(0,6.28),O=n.range(0,6.28),B=u=>a*Math.sin(u/420*Math.PI*2+r)+y*Math.sin(u*.047+x),p=u=>{const s=Math.max(0,1-Math.pow(Math.abs(u+15)/212,4)),k=N*Math.exp(-Math.pow((u-A)/85,2)),z=Math.exp(-Math.pow((u-U)/68,2)),d=Math.max(k,z)+T*(1-Math.max(k/N,z))*.9;return 95*Math.pow(s,.8)*Math.min(1,d)*(1+.03*Math.sin(u*.11+S))},v=u=>1-Math.abs(Math.sin(u));return{crestZ:B,crestH:p,height:(u,s)=>{const k=p(u);if(k<=.01)return 0;const z=s-B(u),d=1-Ne(ce-14,ce-1,Math.abs(s));if(z>=0){const L=(36+.85*k)*(.78+.18*v(u*.045+S)+.06*v(u*.13+O)),o=Math.min(1,z/L);return d*k*Math.pow(1-Math.pow(o,1.12),1.7)}const m=(26+.95*k)*(.9+.16*v(u*.06+O)),_=Math.min(1,-z/m);return d*k*Math.pow(1-_,1.4)},x1:A}}async function Ut(n,a){const U=new Float32Array(67221),N=new Float32Array(22407*3),T=new Float32Array(22407*2),S=(v,g)=>{const u=n.crestZ(v);return g<=44?u-(ce+u)*Math.pow((44-g)/44,1.9):u+(ce-u)*Math.pow((g-44)/52,1.9)};for(let v=0,g=0;v<=96;v++){for(let u=0;u<=230;u++,g++){const s=-de+2*de*u/230,k=S(s,v);U[g*3]=s,U[g*3+1]=n.height(s,k),U[g*3+2]=k,T[g*2]=k-n.crestZ(s),T[g*2+1]=n.crestH(s)}a&&v%12===11&&await a()}const O=.35;for(let v=0,g=0;v<=96;v++){for(let u=0;u<=230;u++,g++){const s=U[g*3],k=U[g*3+2],z=v<44?-1:1,d=v===44?k+.5:k,m=(n.height(s+O,d)-n.height(s-O,d))/(2*O),_=(n.height(s,d+O*z)-n.height(s,d))/(O*z),L=Math.hypot(m,1,_);N[g*3]=-m/L,N[g*3+1]=1/L,N[g*3+2]=-_/L}a&&v%6===5&&await a()}const B=new Uint32Array(22080*6);for(let v=0,g=0;v<96;v++)for(let u=0;u<230;u++){const s=v*231+u,k=s+1,z=s+230+1,d=z+1;B[g++]=s,B[g++]=z,B[g++]=k,B[g++]=k,B[g++]=z,B[g++]=d}const p=new t.BufferGeometry;return p.setAttribute("position",new t.BufferAttribute(U,3)),p.setAttribute("normal",new t.BufferAttribute(N,3)),p.setAttribute("aD",new t.BufferAttribute(T,2)),p.setIndex(new t.BufferAttribute(B,1)),p.boundingSphere=new t.Sphere(new t.Vector3(0,30,0),300),p}const rt=`
#ifdef DUNE
attribute vec2 aD;
#endif
uniform float uLift;
varying vec3 vW; varying vec3 vN; varying float vH; varying float vY; varying vec2 vD;
${ae}
#include <fog_pars_vertex>
void main(){
  vec3 p = position; vec3 n = vec3(0., 1., 0.); vH = 0.; vY = 0.; vD = vec2(1000., 0.);
#ifdef DUNE
  float g = wipeGone(p.xz);
  float lf = (p.x + fingers(p.z) - uXf + 14.) / 18.;
  float lip = exp(-lf * lf) * smoothstep(0.5, 8., p.y);   // sand heaped ahead of the palm
  vH = p.y; vY = p.y * (1. - g) + 9. * lip * (1. - g) + g * 2.8 * windrow(p.xz); vD = aD;      // (the windrows stand a couple of metres high, so they read at a grazing angle)
  n = normalize(mix(normal, vec3(0., 1., 0.), g));
  p.y = vY + uLift;
#endif
  vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vN = normalize(mat3(modelMatrix) * n);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,lt=`
uniform vec4 uRect; uniform mat4 uInv;
varying vec3 vW; varying vec3 vN; varying float vH; varying float vY; varying vec2 vD;
${ae}
#include <fog_pars_fragment>
${nt}
${st}
void main(){
  vec3 lw = (uInv * vec4(vW, 1.)).xyz;           // hero-local position: the sand is anchored to the piece
  vec3 V = normalize(cameraPosition - vW);
  float fw = fwidth(lw.x) + fwidth(lw.z);
  vec3 glass = glassLook(lw.xz, V, fw);
  vec3 col;
#ifdef DUNE
  float g = wipeGone(lw.xz);
  float n1 = fbm2(lw.xz * 0.08), n2 = vn2(lw.xz * 0.9);
  float d = max(vY, 0.) * (0.5 + 1.0 * n1);
  float inside = smoothstep(0.3, 5., vH);
  float st = vn2(vec2(lw.x * 0.008 + 5., lw.z * 0.21)), st2 = vn2(vec2(lw.x * 0.017, lw.z * 1.7 + 9.)), st3 = vn2(vec2(lw.x * 0.03 + 2., lw.z * 0.45));
  float stF = 1. - smoothstep(0.6, 4., fw);   // fingers fade out before they can alias into dashes
  d += g * 0.25 * windrow(lw.xz) * (0.45 + 0.55 * st3) + g * inside * (stF * (0.12 * smoothstep(0.68, 0.92, st) * (0.45 + 0.55 * st3) + 0.03 * smoothstep(0.62, 0.9, st2) * (1. - clamp(fw * 1.2, 0., 1.))));
  d += g * 0.05 * combStreaks(lw.xz, fwidth(lw.z));
  d *= 1. + 0.5 * (n2 - 0.5) * (1. - clamp(fw * 0.9, 0., 1.));
  // the crest is a thin blade: it burns
  float standing = (1. - g) * smoothstep(2., 10., vH);
  // (a wedge: its thickness grows with distance below the crest line; kept >= ~2 px wide on screen)
  float below = max(abs(vD.x) - fw * 1.3, 0.) * mix(1., 0.8, step(0., vD.x));
  float blade = 0.025 + 0.04 * n2 + below * (0.22 + 0.2 * n1) + below * below * 0.02;
  float dEff = mix(d, min(d, blade), standing);
  col = sandRamp(dEff, glass);
  // form inside the darks: windward sienna, slip umber, heart umber-black, 12 % rake from the sun-print
  vec3 N = normalize(vN + vec3(1e-5));
  float rpF = 1. - clamp(fw * 0.35, 0., 1.);
  float rp = sin(dot(lw.xz, vec2(0.25, 1.9)) + 7. * n1 + 2. * vn2(lw.xz * 0.21)) * rpF;
  float facing = smoothstep(-0.2, 0.6, N.z * 0.9 + N.y * 0.2);
  float hgt = smoothstep(3., 85., vY);
  vec3 form = mix(uUmber * 0.8, mix(uSienna, uUmber, 0.5), facing) * mix(1.05, 0.3, sqrt(hgt)) * (1. + 0.22 * rp * facing);
  form = mix(form, uBlack, smoothstep(0.3, 1., hgt) * mix(0.9, 0.45, facing));
  form += uOrange * 0.12 * max(dot(normalize(N + vec3(0.25 * rp, 0., 0.)), uSun), 0.) * mix(1., 0.5, hgt);
  // avalanche tongues slide down the slip face
  float lee = step(vD.x, 0.);
  float cx = lw.x / 11. + 0.6 * vn2(vec2(lw.x * 0.03, 2.)); float ci = floor(cx);
  float hd = fract(uTime * (0.035 + 0.03 * h11(ci)) + h11(ci + 9.)) * 110.;
  float tongue = (1. - smoothstep(hd - 3., hd, -vD.x)) * smoothstep(hd - 46., hd - 6., -vD.x) * (1. - smoothstep(0.1, 0.45, abs(fract(cx) - 0.5))) * step(0.45, h11(ci + 3.));
  form = mix(form, uSienna * 0.9, lee * tongue * 0.6 * rpF);
  col = mix(col, form, smoothstep(1.6, 5., dEff));
#else
  if (lw.x > uRect.x && lw.x < uRect.z && lw.z > uRect.y && lw.z < uRect.w) discard;
  // far washes of thin sand so distance is drawn with thinner and thinner films
  float far = smoothstep(330., 700., length(lw.xz - vec2(0., 40.)));
  float wash = smoothstep(0.42, 0.72, fbm2(lw.xz * 0.0035 + uSeed)) * far;
  float comb = 0.6 + 0.4 * sin(dot(lw.xz, vec2(0.12, 0.9)) + 3. * vn2(lw.xz * 0.02)) * (1. - clamp(fw * 0.4, 0., 1.));
  col = sandRamp(wash * 0.16 * comb, glass);
#endif
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`;function Re(n=!1){const a=n?6:12,r=n?4:8,y=n?3:6,x=[],A=[],U=[],N=[],T=[],S=(o,c,h,b)=>(x.push(o[0],o[1],o[2]),A.push(c[0],c[1],c[2],c[3]),U.push(h[0],h[1],h[2]),N.push(b[0],b[1],b[2]??0),x.length/3-1),O=o=>{const c=new t.Vector3(o[0],o[1],o[2]).normalize(),h=new t.Vector3(0,1,0).cross(c);return h.lengthSq()<1e-6&&h.set(1,0,0),h.normalize(),{a:h,b:new t.Vector3().crossVectors(c,h),D:c}},B=(o,c,h,b,w,M)=>{const{a:D,b:R}=O(c),G=x.length/3;for(let I=0;I<w;I++){const E=I/w*Math.PI*2,K=Math.cos(E),V=Math.sin(E),X=M(I,K,V),ee=h*K*(X.sx??1),te=b*V*(X.sy??1),W=[D.x*ee+R.x*te,D.y*ee+R.y*te,D.z*ee+R.z*te];S([o[0]+W[0],o[1]+W[1],o[2]+W[2]],X.part,X.rad?W:[0,0,0],X.paint)}return G},p=(o,c,h)=>{for(let b=0;b<h;b++){const w=(b+1)%h;T.push(o+b,o+w,c+b,o+w,c+w,c+b)}},v=(o,c,h,b,w,M)=>{const D=S(h,b,[0,0,0],w);for(let R=0;R<c;R++){const G=(R+1)%c;M?T.push(D,o+G,o+R):T.push(D,o+R,o+G)}},g=[0,0,0,0],u=[[-.8,1.08,.06,.05],[-.72,1.04,.21,.16],[-.52,1.02,.3,.225],[-.22,.975,.315,.245],[.1,.975,.34,.255],[.36,1,.345,.235],[.56,1.03,.27,.175],[.67,1.05,.14,.1]];let s=-1;u.forEach((o,c)=>{const h=B([0,o[1],o[0]],[0,0,1],o[3],o[2],a,(b,w,M)=>({part:g,sx:1-.3*Math.max(M,0)+.06*Math.max(-M,0),sy:M<0?.92:1,paint:[M<-.8&&c>=1&&c<=6?1:M<-.4&&c>=1&&c<=2&&w*w<.9?.75:0,0]}));s>=0?p(s,h,a):v(h,a,[0,o[1],o[0]-.02],g,[0,0],!0),s=h}),v(s,a,[0,1.05,.7],g,[0,0],!1);const k=[[.44,1.06,.23,.15,.1],[.62,1.2,.185,.125,.45],[.8,1.34,.15,.105,.8],[.95,1.46,.125,.09,1]];s=-1,k.forEach(o=>{const c=B([0,o[1],o[0]],[0,.37,.48],o[3],o[2],r,(h,b,w)=>({part:[5,o[4],0,0],paint:[w<-.9&&o[4]>.3?.8:0,0]}));s>=0&&p(s,c,r),s=c});const z=[0,-.27,.43],d=Math.hypot(z[1],z[2]),m=[[-.04,.07,.065,0],[.07,.105,.085,1],[.2,.1,.08,0],[.34,.075,.062,1],[.44,.058,.052,.15],[.5,.04,.042,0]],_=o=>[0,1.5+z[1]/d*o,.95+z[2]/d*o];s=-1,m.forEach((o,c)=>{const h=B(_(o[0]),z,o[2],o[1],r,(b,w,M)=>({part:[5,1,0,0],paint:[c===1?M>-.3?1:.2:o[3],.05]}));s>=0?p(s,h,r):v(h,r,_(-.07),[5,1,0,0],[0,0],!0),s=h}),v(s,r,_(.53),[5,1,0,0],[0,.1],!1);for(const o of[-1,1]){const c=[.045*o,1.565,.955],h=[.09*o,.6,-.8],b=.96,w=Math.hypot(...h);s=-1,[[0,.03],[.33,.024],[.66,.017],[.97,.008]].forEach(I=>{const E=[c[0]+h[0]/w*b*I[0],c[1]+h[1]/w*b*I[0],c[2]+h[2]/w*b*I[0]],K=B(E,h,I[1],I[1],4,()=>({part:[5,1,0,0],rad:!0,paint:[0,.12]}));s>=0&&p(s,K,4),s=K}),v(s,4,[c[0]+h[0]/w*b,c[1]+h[1]/w*b,c[2]+h[2]/w*b],[5,1,0,0],[0,.3],!1);const M=S([.07*o,1.5,.92],[5,1,0,0],[0,0,0],[0,.2]),D=S([.16*o,1.57,.9],[5,1,0,0],[0,0,0],[.9,.5]),R=S([.25*o,1.56,.84],[5,1,0,0],[0,0,0],[0,.7]),G=S([.15*o,1.49,.87],[5,1,0,0],[0,0,0],[.9,.5]);T.push(M,D,G,D,R,G)}s=-1,[[0,.024],[.3,.018],[.55,.05],[.8,.055],[1,.012]].forEach(o=>{const c=B([0,1.12-.7*o[0],-.77-.09*o[0]],[0,-.99,-.13],o[1],o[1],4,()=>({part:[6,o[0],0,0],rad:!0,paint:[0,.15+.5*o[0]]}));s>=0&&p(s,c,4),s=c}),Bt.forEach((o,c)=>{const b=c<2?[[0,.085,.17],[.2,.07,.125],[.47,.042,.06],[.55,.033,.042],[.88,.027,.032],[.93,.04,.05],[1,.046,.058]]:[[0,.08,.12],[.2,.062,.088],[.47,.04,.048],[.55,.031,.037],[.88,.026,.03],[.93,.04,.048],[1,.045,.056]];s=-1,b.forEach(w=>{const M=at*(1-w[0]),D=x.length/3;for(let R=0;R<y;R++){const G=R/y*Math.PI*2,I=w[1]*Math.cos(G),E=w[2]*Math.sin(G),K=w[0]>.5&&w[0]<.9?1:0;S([o[0]+I,M,o[1]+E],[c+1,w[0],I,E],[0,0,0],[K,w[0]>.4?.3:.05,1])}s>=0&&p(s,D,y),s=D}),v(s,y,[o[0],0,o[1]],[c+1,1,0,0],[0,.3],!1)});const L=new t.BufferGeometry;return L.setAttribute("position",new t.Float32BufferAttribute(x,3)),L.setAttribute("aPart",new t.Float32BufferAttribute(A,4)),L.setAttribute("aRad",new t.Float32BufferAttribute(U,3)),L.setAttribute("aPaint",new t.Float32BufferAttribute(N,3)),L.setIndex(T),L.computeVertexNormals(),L}const ze=`
#define STRIDE ${St.toFixed(2)}
#define DUTY ${Mt.toFixed(3)}
#define HIP_Y ${at.toFixed(3)}
#define L1 ${Pt.toFixed(3)}
#define L2 ${Tt.toFixed(3)}
// per leg: hip (x, z), phase offset. Leg ids 0 hind L, 1 hind R, 2 front L, 3 front R
vec3 legInfo(float li){ float hind = step(li, 1.5), left = step(mod(li, 2.), 0.5);
  return vec3(mix(-1., 1., left) * mix(0.14, 0.13, hind), mix(0.36, -0.50, hind), mix(0.4, 0., hind) + mix(0.1, 0., left)); }
`,Ce=`
attribute vec4 aPart; attribute vec3 aRad; attribute vec3 aPaint;
attribute vec4 iA; attribute vec4 iB; attribute vec4 iC;
uniform float uDrawDur; uniform vec3 uShadow;
varying vec3 vRest; varying vec3 vN; varying vec3 vW; varying vec3 vPaint; varying vec4 vI;
${ae}${ge}${ze}
#include <fog_pars_vertex>
vec3 pitchBob(vec3 p, float sz, float cp, float sp, float bob){
  float y0 = p.y - 0.9 * sz; return vec3(p.x, y0 * cp + p.z * sp + 0.9 * sz + bob, p.z * cp - y0 * sp); }
void main(){
  float sz = iA.z, seed = iA.w, stand = iB.z, run = 1. - iB.z;
  float stride = STRIDE * sz;
  float s = uSLead + iA.x;
#ifdef FILES
  s = FILE_PACE * (uClock - iB.x);
#endif
  float q = (s / stride + iB.y) * run;
  vec3 O, T; trackAt(s, O, T);
  vec3 Nn = vec3(T.z, 0., -T.x); Nn /= max(length(Nn), 1e-4);
  O += Nn * herdLat(iA.y, s, seed);
#ifdef FILES
  O.y += fileRise(s, herdLat(iA.y, s, seed));
#endif
  if (stand > 0.5) { O = iC.xyz; T = vec3(sin(iC.w), 0., cos(iC.w)); Nn = vec3(T.z, 0., -T.x); }
  vec3 U = cross(T, Nn);
  float draw = mix(clamp((uClock - iB.x) / uDrawDur, 0., 1.), 1., stand);
#ifdef FILES
  draw = clamp((s - uFile.x) / uFile.y, 0., 1.) * step(s, uFile.z);
#endif
  float bob = 0.05 * sz * sin(6.2832 * (q + 0.62)) * run;
  float pitch = 0.06 * cos(6.2832 * (q - 0.15)) * run;
  float cp = cos(pitch), sp = sin(pitch);
  vec3 Ow = (modelMatrix * vec4(O, 1.)).xyz;
  float rMin = 0.8 * length(cameraPosition - Ow) / max(uPx, 1.);
  float kind = aPart.x;
  vec3 lp = position * sz; vec3 ln = normal;
  if (kind > 0.5 && kind < 4.5) {
    vec3 info = legInfo(kind - 1.); float hind = step(kind - 1., 1.5);
    float ql = q - info.z, ph = fract(ql), n = floor(ql);
    float x = clamp((ph - DUTY) / (1. - DUTY), 0., 1.);
    float e = 0.5 * (x + x * x * (3. - 2. * x));
    float sTd = (n + info.z - iB.y) * stride;                       // where the body was at touchdown
    float sF = sTd + info.y * sz + 0.5 * DUTY * stride + stride * e;  // the print: fixed for the whole stance
    vec3 PF, TF; trackAt(sF, PF, TF);
    vec3 NF = vec3(TF.z, 0., -TF.x); NF /= max(length(NF), 1e-4);
    PF += NF * herdLat(iA.y, sF, seed);
#ifdef FILES
    PF.y += fileRise(sF, herdLat(iA.y, sF, seed));
#endif
    float sx = sin(3.14159 * x);
    vec3 rel = PF - O;
    vec2 Ff = vec2(dot(rel, T), dot(rel, U) + sz * mix(0.44, 0.34, hind) * sx * (0.55 + 0.45 * sx));
    Ff = mix(Ff, vec2((info.y + mix(0.03, -0.05, hind)) * sz, 0.), stand);
    vec3 H3 = pitchBob(vec3(info.x, HIP_Y, info.y) * sz, sz, cp, sp, bob);
    vec2 Hh = vec2(H3.z, H3.y);
    vec2 dv = Ff - Hh; float dl0 = max(length(dv), 1e-3); vec2 dir = dv / dl0;
    float Lt = (L1 + L2) * sz; float dl = min(dl0, Lt * 0.995);
    float Le = max(clamp(dl * mix(1.02, 1.07, hind), 0.8 * Lt, Lt), dl * 1.002);
    float l1 = Le * L1 / (L1 + L2), l2 = Le - l1;
    float a1 = (l1 * l1 - l2 * l2 + dl * dl) / (2. * dl);
    float hk = sqrt(max(l1 * l1 - a1 * a1, 0.));
    vec2 K = Hh + dir * a1 + vec2(-dir.y, dir.x) * hk * mix(1., -1., hind);
    vec2 Fe = Hh + dir * dl;
    float t = aPart.y;
    vec2 d1 = K - Hh; d1 /= max(length(d1), 1e-4); vec2 d2 = Fe - K; d2 /= max(length(d2), 1e-4);
    vec2 c = t < 0.5 ? mix(Hh, K, t * 2.) : mix(K, Fe, (t - 0.5) * 2.);
    vec2 bd = mix(d1, d2, smoothstep(0.4, 0.6, t)); bd /= max(length(bd), 1e-4);
    vec2 bp = vec2(-bd.y, bd.x);
    vec2 o = aPart.zw * sz; o *= clamp(rMin / max(length(o), 1e-4), 1., 3.);
    lp = vec3(info.x * sz + o.x, c.y + bp.y * o.y, c.x + bp.x * o.y);
    ln = vec3(aPart.z, bp.y * aPart.w, bp.x * aPart.w) + vec3(1e-5, 0., 0.);
  } else {
    float rl = length(aRad) * sz;
    if (rl > 1e-5) lp += aRad * sz * (clamp(rMin / rl, 1., 5.) - 1.);
    if (kind > 5.5) {          // tail: streams back at the gallop, flicks when standing
      vec3 pv = vec3(0., 1.12, -0.77) * sz; float w = aPart.y;
      float ang = -w * (1.0 + 0.3 * sin(6.2832 * q + seed * 9.)) * run - w * 0.1 * stand;
      float ca = cos(ang), sa = sin(ang); vec3 r = lp - pv;
      lp = pv + vec3(r.x, r.y * ca + r.z * sa, r.z * ca - r.y * sa);
      float flick = smoothstep(0.2, 1., sin(uTime * 0.7 + seed * 50.));
      lp.x += w * w * sz * (run * 0.1 * sin(12.566 * q + seed * 20.) + stand * 0.25 * sin(uTime * 5. + seed * 30.) * flick);
    } else if (kind > 4.5) {   // neck and head: rock at the gallop; sentinels lift and turn their heads
      vec3 pv = vec3(0., 1.1, 0.46) * sz; float w = aPart.y;
      // a standing gemsbok carries its head high with the face tipped down, so the horns stand up-and-back
      float ha = -0.95 * stand * step(0.999, w); float chh = cos(ha), shh = sin(ha);
      vec3 hpv = vec3(0., 1.47, 0.94) * sz; vec3 rh = lp - hpv;
      lp = hpv + vec3(rh.x, rh.y * chh + rh.z * shh, rh.z * chh - rh.y * shh);
      ln = vec3(ln.x, ln.y * chh + ln.z * shh, ln.z * chh - ln.y * shh);
      float ang = w * (stand * 0.5 + run * (0.07 * sin(6.2832 * (q + 0.35)) - 0.03));
      float ca = cos(ang), sa = sin(ang); vec3 r = lp - pv;
      r = vec3(r.x, r.y * ca + r.z * sa, r.z * ca - r.y * sa);
      ln = vec3(ln.x, ln.y * ca + ln.z * sa, ln.z * ca - ln.y * sa);
      float yw = w * stand * 0.7 * sin(uTime * 0.45 + seed * 40.);
      float cy = cos(yw), sy = sin(yw);
      r = vec3(r.x * cy + r.z * sy, r.y, r.z * cy - r.x * sy);
      ln = vec3(ln.x * cy + ln.z * sy, ln.y, ln.z * cy - ln.x * sy);
      lp = pv + r;
    }
    lp = pitchBob(lp, sz, cp, sp, bob);
    ln = vec3(ln.x, ln.y * cp + ln.z * sp, ln.z * cp - ln.y * sp);
  }
  vec3 P = O + Nn * lp.x + U * lp.y + T * lp.z;
  vec3 Nl = Nn * ln.x + U * ln.y + T * ln.z;
  float hide = step(draw, 0.);
#ifdef SHADOW
  // the shadow is drawn in sand: the animal itself laid flat on the glass, away from the sun-print (level ground only)
  float hgt = max(P.y - O.y, 0.);
  P = vec3(P.x + uShadow.x * hgt, O.y + 0.045, P.z + uShadow.y * hgt);
  hide = max(hide, max(step(0.35, O.y), stand));
#endif
  vec4 wp = modelMatrix * vec4(P, 1.); vW = wp.xyz; vN = mat3(modelMatrix) * Nl;
  vRest = position; vPaint = aPaint; vI = vec4(draw, seed, sz, stand);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  if (hide > 0.5) gl_Position = vec4(2., 2., 2., 1.);
  #include <fog_vertex>
}`,De=`
uniform vec3 uShadow;
varying vec3 vRest; varying vec3 vN; varying vec3 vW; varying vec3 vPaint; varying vec4 vI;
${ae}
#include <fog_pars_fragment>
void main(){
  float fw = fwidth(vRest.x) + fwidth(vRest.y) + fwidth(vRest.z);
  float gA = mix(vn3(vRest * 46. + vI.y * 17.), 0.5, clamp(fw * 30. - 0.3, 0., 1.));
  float gB = vn3(vRest * 8. + vI.y * 5.);
  // sifted in from the hooves up: a noisy rising edge with a thin burning fringe
  float edge = vI.x * 3.2 - 0.4 - vRest.y + (gB - 0.5) * 0.55 + (gA - 0.5) * 0.2;
  float drawing = 1. - step(0.999, vI.x);
  if (drawing > 0.5 && edge < 0.) discard;
  float fringe = (1. - smoothstep(0., 0.28, edge)) * drawing;
#ifdef SHADOW
  {   // a film of sifted sand, orange at its heart, with single grains missing: it is sifted in with the animal
    float fs = fwidth(vW.x) + fwidth(vW.z);
    float sn = vn2(vW.xz * 2.3), sg = vn2(vW.xz * 19.);
    if (sg < 0.3 * (1. - clamp(fs * 12., 0., 1.))) discard;
    vec3 sc = sandRamp((0.42 + 0.5 * sn) * (0.75 + 0.5 * sg) * uShadow.z + 0.02, uGlass);
    gl_FragColor = vec4(max(sc, 0.), 1.);
    #include <fog_fragment>
    return;
  }
#endif
  vec3 N = normalize(vN + vec3(1e-5)) * (gl_FrontFacing ? 1. : -1.);
  vec3 V = normalize(cameraPosition - vW);
  float rim = 1. - abs(dot(N, V)); rim = rim * rim * (0.35 + 0.65 * rim);
  float k = clamp(rim * 1.05 + vPaint.y * 0.2 * (0.4 + rim) + fringe * 0.9, 0., 1.);
  float dEq = 10. * exp(-7. * k) * (0.65 + 0.7 * gA);
  vec3 col = sandRamp(dEq, uGlass * 0.9);
  float wiped = smoothstep(0.4, 0.62, vPaint.x + (gB - 0.5) * 0.4 + (gA - 0.5) * 0.2);
  // wiped back to (nearly) bare glass; stockings keep a gold film so the legs still read on cream
  col = mix(col, mix(uGlass * (0.72 + 0.14 * gA), mix(uGold, uOrange, 0.25 + 0.5 * rim) * (0.6 + 0.3 * gA), vPaint.z), wiped);
  col += uSienna * 0.12 * max(dot(N, uSun), 0.) * (1. - wiped);
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`,ct=`
attribute vec4 iA; attribute vec4 iB;
varying vec2 vUv; varying float vA; varying float vSeed;
${ae}${ge}${ze}
#include <fog_pars_vertex>
void main(){
  float sz = iA.z, seed = iA.w, stride = STRIDE * sz;
  float s = uSLead + iA.x;
#ifdef FILES
  s = FILE_PACE * (uClock - iB.x);
#endif
  vec3 info = legInfo(iB.z);
  float ql = s / stride + iB.y - info.z, n = floor(ql), ph = fract(ql);
  float nr = n - mod(n - iB.w, ${fe.toFixed(1)});
  float sTd = (nr + info.z - iB.y) * stride;
  float sP = sTd + info.y * sz + 0.5 * DUTY * stride;
  float sBirth = uSpeed * (iB.x - uT0) + iA.x;
  float age = n - nr + ph;
  vA = step(sBirth, sTd) * step(iB.x, uClock) * (1. - smoothstep(${(fe*.6).toFixed(1)}, ${(fe-.6).toFixed(1)}, age)) * smoothstep(0., 0.04, age);
  vec3 O, T; trackAt(sP, O, T);
  vec3 Nn = vec3(T.z, 0., -T.x); Nn /= max(length(Nn), 1e-4);
  O += Nn * (herdLat(iA.y, sP, seed) + info.x * sz);
#ifdef FILES
  vA = step(uFile.x + 5., sTd) * step(sTd, uFile.z) * (1. - smoothstep(${(fe*.6).toFixed(1)}, ${(fe-.6).toFixed(1)}, age)) * smoothstep(0., 0.04, age);
  O.y += fileRise(sP, herdLat(iA.y, sP, seed) + info.x * sz) + uFile.w;
#endif
  vec3 P = O + (Nn * position.x * 0.13 + T * position.y * 0.19) * sz * 1.2 + vec3(0., 0.035, 0.);
  vUv = position.xy; vSeed = seed + nr * 0.37;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.); gl_Position = projectionMatrix * mvPosition;
  if (vA <= 0.) gl_Position = vec4(2., 2., 2., 1.);
  #include <fog_vertex>
}`,ft=`
varying vec2 vUv; varying float vA; varying float vSeed;
${ae}
#include <fog_pars_fragment>
void main(){
  // cloven hoof: two teardrops, pointed forward, with a feathered gold lip of displaced grains
  vec2 p = vUv; p.x = abs(p.x) - 0.3; p.y -= 0.1;
  float w = mix(0.3, 0.17, smoothstep(-0.6, 0.7, p.y));
  float dd = length(vec2(p.x / max(w, 0.05), p.y / 0.72));
  float n = vn2(vUv * 5. + vSeed * 13.);
  float body = 1. - smoothstep(0.55, 1.15, dd + (n - 0.5) * 0.5);
  float spray = (1. - smoothstep(0.3, 1., length(vUv * vec2(1., 0.8) + vec2(0., 0.25)))) * smoothstep(0.45, 0.8, n) * 0.5;
  float a = max(body, spray) * vA;
  if (a < 0.02) discard;
  vec3 col = sandRamp(mix(0.03, 5., body * body), uGold);
  gl_FragColor = vec4(max(col, 0.), clamp(a, 0., 1.));
  #include <fog_fragment>
}`,Nt=40,dt=`
attribute vec4 iA; attribute vec4 iB;
varying vec2 vUv; varying float vA; varying float vSeed;
${ae}${ge}
#include <fog_pars_vertex>
void main(){
  float sz = iA.z, seed = iA.w;
  float s = uSLead + iA.x;
#ifdef FILES
  s = FILE_PACE * (uClock - iB.x);
#endif
  float sv = s - 0.5 * sz - position.y * ${Nt.toFixed(1)};
  float sBirth = uSpeed * (iB.x - uT0) + iA.x;
  vA = smoothstep(0., 4., sv - sBirth) * step(iB.x, uClock) * (1. - position.y) * smoothstep(0., 0.03, position.y);
  vec3 O, T; trackAt(sv, O, T);
  vec3 Nn = vec3(T.z, 0., -T.x); Nn /= max(length(Nn), 1e-4);
  vec3 P = O + Nn * (herdLat(iA.y, sv, seed) + position.x * 0.5 * sz) + vec3(0., 0.02, 0.);
#ifdef FILES
  vA = smoothstep(0., 4., sv - uFile.x - 5.) * step(s, uFile.z) * (1. - position.y) * smoothstep(0., 0.03, position.y);
  P.y += fileRise(sv, herdLat(iA.y, sv, seed) + position.x * 0.5 * sz) + uFile.w;
#endif
  vUv = vec2(position.x, sv); vSeed = seed;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,vt=`
varying vec2 vUv; varying float vA; varying float vSeed;
${ae}
#include <fog_pars_fragment>
void main(){
  float fw = fwidth(vUv.y);
  float st = vn2(vec2(vUv.x * 5. + vSeed * 31., vUv.y * 0.22)), st2 = vn2(vec2(vUv.x * 14. + vSeed * 7., vUv.y * 0.9));
  float edge = 1. - vUv.x * vUv.x; edge = 0.4 * edge * edge + 0.75 * (1. - smoothstep(0.1, 0.34, abs(vUv.x + 0.25 * (st2 - 0.5))));
  float a = edge * (0.25 + 0.75 * smoothstep(0.35, 0.75, st)) * mix(0.55 + 0.45 * st2, 0.8, clamp(fw * 1.5, 0., 1.)) * vA;
  vec3 col = sandRamp(0.015 + 0.13 * a * a, uGold);
  gl_FragColor = vec4(max(col, 0.), clamp(a * 0.62, 0., 1.));
  #include <fog_fragment>
}`,Rt=`
attribute vec4 iP; attribute vec4 iQ;
uniform float uDrawDur;
varying vec2 vUv; varying vec3 vK; varying vec2 vF; varying vec2 vB;
${ae}${ge}${ze}
#include <fog_pars_vertex>
void main(){
  float kind = iQ.x, seed = iP.w; vec3 C = vec3(0.); float S = 1., A = 0., stretch = 1., hem = 0., nearB = 26.;
  float r1 = h11(seed * 7.13 + 1.), r2 = h11(seed * 3.71 + 2.), r3 = h11(seed * 11.3 + 3.);
  if (kind < 0.5) {            // the veil: thrown ahead by the palm, billowing across the path, settling
    float k = clamp(uClock - iQ.y, 0., 40.), life = iQ.z;
    float e1 = 1. - exp(-1.1 * k), e2 = 1. - exp(-1.4 * k);
    C = iP.xyz + vec3(-30. - 26. * r1, 0., 4. + 12. * r2) * e1 / 1.1 + vec3(-2.5, 0., 1.5 + 2. * r3) * k;   // it hangs behind the herd's line: the animals are drawn in front of it
    C.y = max(iP.y * (0.45 + 0.55 * exp(-0.3 * k)) + (12. + 26. * r3) * e2 - (0.7 + 0.9 * r1) * k - 0.05 * k * k, 0.3);
    hem = 22. * smoothstep(0.1, 0.9, k) * (0.7 + 0.6 * r2);      // behind the front the swept glass shows under it
    A = smoothstep(0., 0.35, k) * (1. - smoothstep(life * 0.4, life, k)) * smoothstep(0.3, 2.5, C.y) * (0.14 + 0.2 * r2) * (1. + 1.6 * exp(-0.7 * k));
    S = iQ.w * (0.45 + 0.95 * e2); stretch = 1.1;
  } else if (kind < 1.5) {     // crest smoke: every standing ridge streams grains to leeward
    float life = iQ.z, age = fract(uTime * iQ.y + seed) * life, f = age / life;
    C = iP.xyz + vec3(-0.5, 0., -0.86) * age * (9. + 8. * r1) + vec3(0., 1.2 * age - 0.2 * age * age + 0.8 * sin(age * 1.7 + seed * 6.), 0.);
    A = smoothstep(0., 0.1, f) * (1. - f) * (1. - smoothstep(0.02, 0.3, wipeGone(iP.xz))) * 0.8;
    S = iQ.w * (0.5 + 2.2 * f); stretch = 0.5;
  } else if (kind < 2.5 || kind > 3.5) {     // sand kicked up at each touchdown (kind 4: the dust of the stride before, still hanging low)
    float lag = step(3.5, kind);
    float sz = iP.z, stride = STRIDE * sz, s = uSLead + iP.x; vec3 info = legInfo(iQ.y);
    float ql = s / stride + iQ.z - info.z, n = floor(ql) - lag, ph = fract(ql) + lag;
    float sTd = (n + info.z - iQ.z) * stride, sP = sTd + info.y * sz + 0.5 * DUTY * stride;
    vec3 O, T; trackAt(sP, O, T);
    vec3 Nn = vec3(T.z, 0., -T.x); Nn /= max(length(Nn), 1e-4);
    float a = clamp(ph / mix(0.8, 2., lag), 0., 1.);
    C = O + Nn * (herdLat(iP.y, sP, seed) + info.x * sz + (r1 - 0.5) * 0.5 * lag) + vec3(0., 0.1 + mix(0.5, 0.75, lag) * a, 0.) - T * mix(1.0, 0.5, lag) * a;
    A = step(uSpeed * (iQ.w - uT0) + iP.x, sTd) * step(iQ.w, uClock) * (1. - a) * (1. - a) * smoothstep(0., 0.07, a) * mix(0.7, 0.42, lag);
    S = sz * mix(0.2 + 0.7 * a, 0.45 + 1.1 * a, lag);   // a kick of grains at the hoof, never a veil over the body
    nearB = 9.;
  } else {                     // the drawing: threads of grains falling onto the rising edge of each animal
    float sz = iP.z, s = uSLead + iP.x; vec3 O, T; trackAt(s, O, T);
    vec3 Nn = vec3(T.z, 0., -T.x); Nn /= max(length(Nn), 1e-4);
    float d = (uClock - iQ.w) / uDrawDur, fall = fract(iQ.y * 7.31 + uClock * 1.6);
    C = O + Nn * (herdLat(iP.y, s, seed) + (h11(iQ.y * 5.3) - 0.5) * 0.8 * sz) + T * (h11(iQ.y * 3.1) - 0.5) * 2.3 * sz;
    C.y += clamp(d, 0., 1.) * 2.5 * sz + (1. - fall) * sz * (1.2 + 2.2 * (1. - clamp(d, 0., 1.)));
    A = smoothstep(0., 0.12, d) * (1. - smoothstep(0.9, 1.2, d)) * (0.3 + 0.7 * fall) * 0.9;
    S = sz * (0.35 + 0.4 * h11(iQ.y * 9.7)); stretch = 2.6;
  }
  vec4 mvPosition = modelViewMatrix * vec4(C, 1.);
  A *= smoothstep(3., nearB, -mvPosition.z);
  mvPosition.xy += position.xy * S * vec2(1., stretch);
  vUv = position.xy; vK = vec3(A, kind, seed);
  vF = vec2(kind < 0.5 ? C.y + position.y * S * stretch : 100., r3); vB = vec2(hem, S);
  gl_Position = projectionMatrix * mvPosition;
  if (A <= 0.003) gl_Position = vec4(2., 2., 2., 1.);
  #include <fog_vertex>
}`,Ct=`
varying vec2 vUv; varying vec3 vK; varying vec2 vF; varying vec2 vB;
${ae}
#include <fog_pars_fragment>
void main(){
  float r2 = dot(vUv, vUv); if (r2 > 1.) discard;
  float soft = (1. - r2); soft *= soft;
  // falling curtains: streaks run down the sprite, broken into grains
  // billows of loose grains with faint falling streaks; they sink into the glass without an edge
  float n = fbm2(vUv * 1.6 + vK.z * 37.), n1 = vn2(vec2(vUv.x * 4. + vK.z * 3., vUv.y * 0.7)), n2 = vn2(vUv * vec2(15., 9.) + vK.z * 11.);
  float a = soft * smoothstep(0.15, 0.8, n) * (0.55 + 0.45 * n1) * (0.6 + 0.8 * n2) * 1.7 * vK.x * smoothstep(0., 3.5, vF.x);
  // the veil's hem: below it only falling threads of grains, each of its own length
  float tx = vUv.x * vB.y, low = (1. - smoothstep(vB.x - 3., vB.x + 5., vF.x)) * smoothstep(0., 6., vB.x);
  float thr = smoothstep(0.64, 0.86, vn2(vec2(tx * 0.5 + vK.z * 13., vF.x * 0.04 + uTime * 0.3)));
  float tl = 2. + 9. * vn2(vec2(tx * 0.27 + vK.z * 5., 2.));
  a *= mix(1., 1.2 * thr * smoothstep(vB.x - tl - 3., vB.x - tl + 2., vF.x), low);
  if ((vK.y > 0.5 && vK.y < 2.5) || vK.y > 3.5) a = soft * (0.35 + 0.65 * n) * (0.55 + 0.6 * n2) * vK.x;   // smoke and puffs: finer, softer
  vec3 col = mix(uGold * 0.85, uOrange * 0.8, clamp(smoothstep(0.02, 0.22, a) * 0.7 + vF.y * 0.45, 0., 1.));
  col = mix(col, uSienna * 0.9, smoothstep(0.18, 0.55, a) * (0.4 + 0.5 * vF.y));
  gl_FragColor = vec4(max(col, 0.), clamp(a, 0., 0.92));
  #include <fog_fragment>
}`;function ve(n,a,r){const y=new t.InstancedBufferGeometry;y.index=n.index;for(const x in n.attributes)y.setAttribute(x,n.attributes[x]);for(const x in a)y.setAttribute(x,new t.InstancedBufferAttribute(a[x],4));return y.instanceCount=r,y}const ht=()=>{const n=new t.BufferGeometry;return n.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]),n};function Dt(n,a){const r=n.core;if(r&&r.makeRng&&r.hashSeed)return r.makeRng(r.hashSeed(a+":"+n.seed));let y=2654435769^a.length*2654435761;const x=()=>{y=y+1831565813|0;let A=Math.imul(y^y>>>15,1|y);return A=A+Math.imul(A^A>>>7,61|A)^A,((A^A>>>14)>>>0)/4294967296};return x.range=(A,U)=>A+(U-A)*x(),x}function Et(n){const a=Dt(n,"namib-comb"),r=[];for(let y=0;y<6;y++)r.push(new t.Vector4(a.range(-150,40),44+148*(y+a.range(.15,.85))/6,a.range(80,170),a.range(1,2.2)));return r}async function Kt(n,a={}){const r=n.rng.fork?n.rng.fork("namib-hero"):n.rng,y=n.quality?.detail??1,x=(a.palette&&a.palette.length>=7?a.palette:Ft).map(e=>new t.Color(e)),A=a.hour||"morning",U=a.weather||"wind",N=a.cast||"gemsbok",T=a.duration??40,S=a.speed??16,[O,B]=a.wipeU||[.27,.37],[p,v]=a.drawU||[.37,.42],g=p*T,u=Math.max(.5,(v-p)*T*.45),s=Math.max(.1,(v-p)*T-u-.05),k=r.range(0,6.28),z=de+20,d=-de-20-Ue,m=Array.isArray(a.wipeKeys)&&a.wipeKeys.length>=2?a.wipeKeys.map(e=>[e[0],(z-e[1])/(z-d)]):null,_=e=>{if(!m)return(e-O)/(B-O);if(e<=m[0][0])return m[0][1];for(let i=1;i<m.length;i++)if(e<=m[i][0]){const l=m[i-1],P=m[i];return l[1]+(P[1]-l[1])*(e-l[0])/Math.max(1e-6,P[0]-l[0])}return m[m.length-1][1]},L=e=>t.MathUtils.clamp(m?.25*(_(e-.004)+2*_(e)+_(e+.004)):_(e),0,1),o=m?m[0][0]-.004:O,c=m?m[m.length-1][0]+.004:B,h=e=>{let i=o,l=c;for(let P=0;P<26;P++){const H=.5*(i+l);L(H)<e?i=H:l=H}return .5*(i+l)},b=r.range(-.04,.04),w=a.glassEmit??1,M=x[0].clone().multiplyScalar(w);M.g*=.96,M.b*=.72,A==="golden"&&M.copy(x[0]).lerp(x[1],.65).multiplyScalar(w*.93),A==="night"&&M.set("#E6E2D6").lerp(x[6],.25).multiplyScalar(w*.68),M.g*=1-b,M.b*=1-2*b;const D=(A==="golden"?9:25)*Math.PI/180,R=75*Math.PI/180,G=a.sunDir?new t.Vector3(...a.sunDir).normalize():new t.Vector3(-Math.cos(R)*Math.cos(D),Math.sin(D),Math.sin(R)*Math.cos(D)),I=A==="night"?.55:0,E=(e,i)=>{const l=e.clone().multiplyScalar(i);if(I){const P=(l.r+l.g+l.b)/3;l.lerp(new t.Color(P,P,P*1.1),I)}return l},K=(a.track&&a.track.length>=2?a.track:[[0,0,190],[-150,0,190],[-280,0,190],[-345,0,177],[-440,0,139],[-560,0,90]]).map(e=>new t.Vector3(e[0],e[1],e[2])),V=new t.CatmullRomCurve3(K,!1,"centripetal"),X=V.getSpacedPoints(oe-1),ee=V.getLength()/(oe-1),te=it(X,ee),W={uGlass:{value:M},uGold:{value:E(x[1],1)},uOrange:{value:E(x[2],.95)},uSienna:{value:E(x[3],.62)},uUmber:{value:E(x[4],.9)},uBlack:{value:E(x[5],1)},uCool:{value:x[6].clone()},uSun:{value:G},uTime:{value:0},uXf:{value:z},uSeed:{value:k},uSheen:{value:U==="fog"?1.6:1},uTrk:{value:X},uTrkDs:{value:ee},uSLead:{value:0},uClock:{value:0},uT0:{value:g},uSpeed:{value:S},uPx:{value:500},uDrawDur:{value:u},uLift:{value:a.lift??0},uShadow:{value:new t.Vector3(a.shadow?a.shadow[0]:0,a.shadow?a.shadow[1]:0,a.shadow?a.shadow[2]??1:0)},uRect:{value:new t.Vector4(-de+.2,-ce+.2,de-.2,ce-.2)},uInv:{value:new t.Matrix4}};W.uComb={value:Et(n)};const J=(e,i,l={})=>new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...W},vertexShader:e,fragmentShader:i,fog:!0,...l}),j=new t.Group;j.name="wind-draws-the-namib-hero";const ie=Lt(r),Q=n.yield?()=>n.yield():null,me=new t.Mesh(await Ut(ie,Q),J(rt,lt,{defines:{DUNE:1},side:t.DoubleSide}));if(me.frustumCulled=!1,j.add(me),await n.yield?.(),a.glass!==!1){const e=new t.PlaneGeometry(6400,6400,1,1);e.rotateX(-Math.PI/2);const i=new t.Mesh(e,J(rt,lt));i.frustumCulled=!1,j.add(i)}const we=Math.round(t.MathUtils.clamp(a.count??r.int(56,64),45,70)),$=[],f=a.bullA??3,F=a.bullLat??12;$.push({a:f,lat:F,sz:1.14,seed:r(),gait:r(),birth:g+.25*s,stand:0});const Z=Array.isArray(a.flank)?a.flank:[];for(const e of Z)$.push({a:e.a,lat:e.lat,sz:e.sz??1.04,seed:e.seed??.37,gait:e.gait??.3,birth:g+(e.birth??.5)*s,stand:0});for(let e=0;$.length<we+1+Z.length&&e<6e3;e++){const i=r(),l=-70*Math.pow(i,.85),P=r.range(-6,6)*(.55+.45*Math.sin(Math.PI*Math.min(1,i+.15)));if($.some(se=>Math.abs(se.a-l)<2.9&&Math.abs(se.lat-P)<1.7)||P>.5&&l>f-22&&l<f+12||Z.some(se=>P>se.lat-1.2&&Math.abs(l-se.a)<6))continue;const H=N==="calves"&&$.length>6&&r.chance(.33);$.push({a:l,lat:P,sz:H?r.range(.58,.7):r.range(.92,1.07),seed:r(),gait:r(),birth:g+r.range(0,s),stand:0})}const C=$.length,q=(a.sentinels||[]).slice();for(const e of q)$.push({a:0,lat:0,sz:e.size??r.range(1,1.1),seed:e.seed??r(),gait:0,birth:-1e3,stand:1,pos:e.pos,yaw:e.yaw??0});const re=$.length,ke=new Float32Array(re*4),Ae=new Float32Array(re*4),Fe=new Float32Array(re*4);$.forEach((e,i)=>{ke.set([e.a,e.lat,e.sz,e.seed],i*4),Ae.set([e.birth,e.gait,e.stand,0],i*4),e.pos&&Fe.set([e.pos[0],e.pos[1],e.pos[2],e.yaw],i*4)}),Q&&await Q();const mt=Re();Q&&await Q();const Ie=new t.Mesh(ve(mt,{iA:ke,iB:Ae,iC:Fe},re),J(Ce,De,{side:t.DoubleSide}));if(Ie.frustumCulled=!1,j.add(Ie),await n.yield?.(),a.shadow){const e=new t.Mesh(ve(Re(!0),{iA:ke,iB:Ae,iC:Fe},C),J(Ce,De,{side:t.DoubleSide,defines:{SHADOW:1},polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:-2}));e.frustumCulled=!1,j.add(e),await n.yield?.()}Q&&await Q();const Oe=ht(),Se=C*4*fe,Ge=new Float32Array(Se*4),Ve=new Float32Array(Se*4);for(let e=0,i=0;e<C;e++)for(let l=0;l<4;l++)for(let P=0;P<fe;P++,i++){const H=$[e];Ge.set([H.a,H.lat,H.sz,H.seed],i*4),Ve.set([H.birth,H.gait,l,P],i*4)}const $e={transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:-2},Me=new t.Mesh(ve(Oe,{iA:Ge,iB:Ve},Se),J(ct,ft,{...$e,side:t.DoubleSide}));Me.frustumCulled=!1,Me.renderOrder=2,j.add(Me);const ye=24,He=[],We=[];for(let e=0;e<=ye;e++)if(He.push(-1,e/ye,0,1,e/ye,0),e<ye){const i=e*2;We.push(i,i+1,i+2,i+1,i+3,i+2)}const Pe=new t.BufferGeometry;Pe.setAttribute("position",new t.Float32BufferAttribute(He,3)),Pe.setIndex(We);const qe=new Float32Array(C*4),Ke=new Float32Array(C*4);for(let e=0;e<C;e++){const i=$[e];qe.set([i.a,i.lat,i.sz,i.seed],e*4),Ke.set([i.birth,i.gait,0,0],e*4)}const Te=new t.Mesh(ve(Pe,{iA:qe,iB:Ke},C),J(dt,vt,{...$e,side:t.DoubleSide}));Te.frustumCulled=!1,Te.renderOrder=1,j.add(Te),Q&&await Q();const Be=Math.round(2400*y),Qe=Math.round((U==="still"?160:720)*y),pt=C*4,gt=C*10,Ye=Be+Qe+2*pt+gt,he=new Float32Array(Ye*4),ue=new Float32Array(Ye*4);let Y=0;for(let e=0,i=0;e<Be&&i<Be*30;i++){Q&&(i&511)===511&&await Q();const l=r.range(-212,212),P=r.range(-ce,ce),H=ie.height(l,P);if(H<2.5||r()>.25+H/60)continue;const se=(z-(l+_t(P,k)-.4*Ue))/(z-d);he.set([l,H*(.25+.75*r()),P,r()*100],Y*4),ue.set([0,h(t.MathUtils.clamp(se,0,1))*T+r.range(0,.3),r.range(5,9.5),r.range(8,20)],Y*4),Y++,e++}const xt=Y;for(let e=0;e<Qe;e++){let i=r.range(-205,205);for(let P=0;P<6&&ie.crestH(i)<8;P++)i=r.range(-205,205);const l=r.range(3,6.5);he.set([i,ie.crestH(i)-.2,ie.crestZ(i),r()*100],Y*4),ue.set([1,1/l,l,r.range(4,11)],Y*4),Y++}for(let e=0;e<C;e++)for(let i=0;i<4;i++){const l=$[e];he.set([l.a,l.lat,l.sz,l.seed],Y*4),ue.set([2,i,l.gait,l.birth],Y*4),Y++}for(let e=0;e<C;e++)for(let i=0;i<10;i++){const l=$[e];he.set([l.a,l.lat,l.sz,l.seed],Y*4),ue.set([3,r()*50+1,0,l.birth],Y*4),Y++}for(let e=0;e<C;e++)for(let i=0;i<4;i++){const l=$[e];he.set([l.a,l.lat,l.sz,l.seed],Y*4),ue.set([4,i,l.gait,l.birth],Y*4),Y++}const _e=new t.Mesh(ve(Oe,{iP:he,iQ:ue},Y),J(Rt,Ct,{transparent:!0,depthWrite:!1}));_e.frustumCulled=!1,_e.renderOrder=5,j.add(_e),await n.yield?.();const wt=e=>Ne(o+.35*(c-o),c,e)*(1-Ne(Math.max(p,c)+.02,Math.max(v,c)+.05,e)),ne=new t.Vector3,le=new t.Vector3,Le=typeof a.lead=="function"?a.lead:e=>S*(e*T-g),Xe={bull:[f,F,$[0].seed],lead:[0,0,0],mid:[-32,0,0],tail:[-70,0,0]},pe=(e,i=new t.Vector3,l="mid")=>{const[P,H,se]=typeof l=="number"?[l,0,0]:Xe[l]||Xe.mid,tt=Le(e)+P;te(tt,ne,le);const ot=l==="bull"?H+1.1*Math.sin(tt*.021+se*6.283):H;return i.set(ne.x+le.z*ot,ne.y+1,ne.z-le.x*ot)},yt=170,zt=90,bt=new t.Vector3(-10,22,50);let je=0,Ze=!1;const kt=new t.Vector2,Je=(e,i,l)=>{let P=je;Ze||(P=.22+.5*(((i-7)/26%1+1)%1));const H=P*T;if(W.uTime.value=i,W.uClock.value=H,W.uSLead.value=Le(P),W.uXf.value=z+(d-z)*L(P),l){const se=n.renderer?n.renderer.getDrawingBufferSize(kt).y:1080;W.uPx.value=.5*se*l.projectionMatrix.elements[5]}j.updateMatrixWorld(),W.uInv.value.copy(j.matrixWorld).invert()};Je(0,0,null);const et=[];for(let e=-330;e<=500;e+=83)te(e,ne,le),et.push(new t.Vector3(ne.x+le.z*20,ne.y+(e<-120?5:4),ne.z-le.x*20));te(560,ne,le);const At={flyThrough:et,herdTrack:X.map(e=>e.clone()),herdBirth:X[0].clone(),footprint:{min:[-de,-ce],max:[de,ce]},wipeFrom:new t.Vector3(z,0,0),wipeTo:new t.Vector3(-de,0,0),viewpoints:{wipe:{pos:new t.Vector3(60,5,210),look:new t.Vector3(-60,30,0)},gallop:{pos:pe(.5,new t.Vector3,"tail").add(new t.Vector3(18,3,20)),look:pe(.5,new t.Vector3,"mid")},bull:{pos:pe(.61,new t.Vector3,"bull").add(new t.Vector3(2,3,8)),look:pe(.61,new t.Vector3,"bull")}},portalSeat:{position:new t.Vector3(ne.x+le.z*20,ne.y+7.5,ne.z-le.x*20),facing:le.clone().negate()},sunDir:G.clone()};return{object:j,radius:yt,height:zt,center:bt,anchors:At,ground:!1,groundY:0,uniforms:W,wipeAmount:L,veilAmount:wt,herdPoint:pe,herdRows:$,trackAt:te,leadS:Le,setProgress(e){je=e,Ze=!0},update:Je,dispose(){},info:{gemsbok:C,sentinels:re-C,veilSprites:xt,duneHeight:90,trackLength:V.getLength()}}}const xe=24,It=360,ut=.42,Ot=`
attribute vec4 iA; attribute vec4 iB;
varying vec2 vUv; varying vec4 vI; varying float vA;
${ae}${ge}
#include <fog_pars_vertex>
void main(){
  float sz = iA.z, seed = iA.w;
  float sNow = uSLead + iA.x, sBirth = uSpeed * (iB.x - uT0) + iA.x;
  float sv = min(sBirth + position.y * ${It.toFixed(1)}, sNow - 6.);
  vec3 O, T; trackAt(sv, O, T);
  vec3 Nn = vec3(T.z, 0., -T.x); Nn /= max(length(Nn), 1e-4);
  vA = step(iB.x, uClock) * step(sBirth + 1., sNow - 6.) * smoothstep(0., 4., sv - sBirth) * (1. - smoothstep(0.03, 0.4, O.y));
  vec3 P = O + Nn * (herdLat(iA.y, sv, seed) + position.x * ${ut.toFixed(2)} * sz) + vec3(0., 0.018, 0.);
  vUv = vec2(position.x * ${ut.toFixed(2)} * sz, sv); vI = vec4(sz, iB.y, seed, sNow - sv);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Gt=`
varying vec2 vUv; varying vec4 vI; varying float vA;
${ae}${ze}
#include <fog_pars_fragment>
void main(){
  float sz = max(vI.x, 0.3), stride = STRIDE * sz, back = max(vI.w, 0.);
  float fwS = fwidth(vUv.y), fwL = fwidth(vUv.x);
  float st = vn2(vec2(vUv.x * 5. + vI.z * 31., vUv.y * 0.22)), st2 = vn2(vec2(vUv.x * 14. + vI.z * 7., vUv.y * 0.9));
  float core = 1. - smoothstep(0.07 * sz, 0.3 * sz + fwL, abs(vUv.x + 0.1 * (st2 - 0.5)));
  float smear = core * (0.25 + 0.75 * smoothstep(0.35, 0.75, st)) * mix(0.55 + 0.45 * st2, 0.8, clamp(fwS * 1.5, 0., 1.)) * smoothstep(8., 38., back);
  float pr = 0.;
  for (int l = 0; l < 4; l++) {
    vec3 info = legInfo(float(l));
    float off = (info.z - vI.y) * stride + info.y * sz + 0.5 * DUTY * stride;
    float fy = (fract((vUv.y - off) / stride + 0.5) - 0.5) * stride;
    vec2 p = vec2((vUv.x - info.x * sz) / (0.156 * sz), fy / (0.228 * sz));
    p.x = abs(p.x) - 0.3; p.y -= 0.1;
    float w = mix(0.3, 0.17, smoothstep(-0.6, 0.7, p.y));
    pr = max(pr, 1. - smoothstep(0.55, 1.15, length(vec2(p.x / w, p.y / 0.72))));
  }
  pr = mix(pr, 0.07, clamp(fwS * 1.4 - 0.25, 0., 1.)) * (1. - clamp(fwL * 3. - 0.4, 0., 1.)) * smoothstep(56., 90., back / sz);
  float a = max(smear * 0.5, pr * 0.92) * vA;
  if (a < 0.015) discard;
  vec3 col = mix(sandRamp(0.02 + 0.11 * smear * smear, uGold), sandRamp(2.6, uGold), pr);
  gl_FragColor = vec4(max(col, 0.), clamp(a, 0., 1.));
  #include <fog_fragment>
}`;async function Qt(n,a){const r=a.uniforms,y=a.herdRows.filter(p=>!p.stand),x=y.length,A=[],U=[];for(let p=0;p<=xe;p++)if(A.push(-1,p/xe,0,1,p/xe,0),p<xe){const v=p*2;U.push(v,v+1,v+2,v+1,v+3,v+2)}const N=new t.BufferGeometry;N.setAttribute("position",new t.Float32BufferAttribute(A,3)),N.setIndex(U);const T=new Float32Array(x*4),S=new Float32Array(x*4);y.forEach((p,v)=>{T.set([p.a,p.lat,p.sz,p.seed],v*4),S.set([p.birth,p.gait,0,0],v*4)}),await n.yield?.();const O=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...r},vertexShader:Ot,fragmentShader:Gt,fog:!0,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:-2,side:t.DoubleSide}),B=new t.Mesh(ve(N,{iA:T,iB:S},x),O);return B.frustumCulled=!1,B.renderOrder=1,a.object.add(B),await n.yield?.(),{mesh:B,triangles:x*xe*2}}const Ee=16,Vt=6,be=4e3;async function Yt(n,a,r){const y=a.uniforms,x=r.duration,A={lines:[],triangles:0},U=Re();await n.yield?.();const N=ht(),T=24,S=[],O=[];for(let d=0;d<=T;d++)if(S.push(-1,d/T,0,1,d/T,0),d<T){const m=d*2;O.push(m,m+1,m+2,m+1,m+3,m+2)}const B=new t.BufferGeometry;B.setAttribute("position",new t.Float32BufferAttribute(S,3)),B.setIndex(O);const p={transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:-2},v=new t.Box3().setFromBufferAttribute(U.attributes.position),g=[],u=new t.Vector3,s=new t.Vector3,k=d=>g[d]||(g[d]=r.eye(d/be,new t.Vector3)),z=(d,m,_,L,o,c)=>{let h=1/0;for(let b=Math.ceil(m/x*be);b<=be;b++){const w=Ee*(b/be*x-m);if(w>c)break;_(w,u,s);const M=Math.max(Math.hypot(s.x,s.z),1e-4),D=s.z/M,R=-s.x/M,G=d.lat+.3*Math.sin(w*.05+d.seed*6.283),I=Math.min(oe-1,Math.max(0,w/L)),E=Math.min(Math.floor(I),oe-2),K=k(b),V=K.x-u.x-D*G,X=K.y-u.y-G*(o[E]+(o[E+1]-o[E])*(I-E)),ee=K.z-u.z-R*G,te=V*D+ee*R,W=V*s.y*R+X*(s.z*D-s.x*R)-ee*s.y*D,J=V*s.x+X*s.y+ee*s.z,j=Math.max(v.min.x*d.sz-te,0,te-v.max.x*d.sz),ie=Math.max(v.min.y*d.sz-W,0,W-v.max.y*d.sz),Q=Math.max(v.min.z*d.sz-J,0,J-v.max.z*d.sz);h=Math.min(h,Math.hypot(j,ie,Q))}return h};for(const d of r.lines){const m=d.pts,_=[0];for(let f=1;f<m.length;f++)_.push(_[f-1]+Math.hypot(m[f][0]-m[f-1][0],m[f][1]-m[f-1][1],m[f][2]-m[f-1][2]));const L=_[_.length-1],o=L/(oe-1),c=[],h=[];for(let f=0,F=0;f<oe;f++){const Z=Math.min(L,f*o);for(;F<m.length-2&&_[F+1]<Z;)F++;const C=Math.min(1,Math.max(0,(Z-_[F])/Math.max(1e-6,_[F+1]-_[F]))),q=m[F],re=m[F+1];c.push(new t.Vector3(q[0]+(re[0]-q[0])*C,q[1]+(re[1]-q[1])*C,q[2]+(re[2]-q[2])*C)),h.push(q[3]+(re[3]-q[3])*C)}const b={...t.UniformsUtils.clone(t.UniformsLib.fog),...y,uTrk:{value:c},uTrkDs:{value:o},uFile:{value:new t.Vector4(1,r.siftLen??12,L-1,r.lift??.05)},uFK:{value:h}},w=(f,F,Z={})=>new t.ShaderMaterial({uniforms:b,vertexShader:f,fragmentShader:F,fog:!0,defines:{FILES:1,FILE_PACE:Ee.toFixed(1)},...Z}),M=d.rows,D=it(c,o),R=M.map(f=>{let F=0,Z=x;for(let C=0;C<40;C++){const q=.5*(F+Z);a.leadS(q/x)+f.a<d.sAt?F=q:Z=q}return .5*(F+Z)}),G=[];for(let f=0;f<M.length;f++)G.push(z(M[f],R[f],D,o,h,L-1)),await n.yield?.();const I=M.map((f,F)=>F).filter(f=>G[f]>=Vt),E=I.map(f=>M[f]),K=I.map(f=>R[f]),V=E.length,X=new Float32Array(V*4),ee=new Float32Array(V*4),te=new Float32Array(V*4);E.forEach((f,F)=>{X.set([f.a-d.sAt,f.lat,f.sz,f.seed],F*4),ee.set([K[F],f.gait,0,0],F*4)});const W=new t.Mesh(ve(U,{iA:X,iB:ee,iC:te},V),w(Ce,De,{side:t.DoubleSide}));W.frustumCulled=!1,a.object.add(W),await n.yield?.();const J=V*4*fe,j=new Float32Array(J*4),ie=new Float32Array(J*4);for(let f=0,F=0;f<V;f++)for(let Z=0;Z<4;Z++)for(let C=0;C<fe;C++,F++){const q=E[f];j.set([q.a-d.sAt,q.lat,q.sz,q.seed],F*4),ie.set([K[f],q.gait,Z,C],F*4)}const Q=new t.Mesh(ve(N,{iA:j,iB:ie},J),w(ct,ft,{...p,side:t.DoubleSide}));Q.frustumCulled=!1,Q.renderOrder=2,a.object.add(Q);const me=new Float32Array(V*4),we=new Float32Array(V*4);E.forEach((f,F)=>{me.set([f.a-d.sAt,f.lat,f.sz,f.seed],F*4),we.set([K[F],f.gait,0,0],F*4)});const $=new t.Mesh(ve(B,{iA:me,iB:we},V),w(dt,vt,{...p,side:t.DoubleSide}));$.frustumCulled=!1,$.renderOrder=1,a.object.add($),await n.yield?.(),A.triangles+=V*(U.index.count/3+4*fe*2+T*2),A.lines.push({at:D,born:K,metres:(f,F)=>Ee*(F-K[f]),length:L,sAt:d.sAt,rows:E,clear:G})}return A}export{qt as COMB_GLSL,Wt as GLASS_GLSL,Ht as SAND_GLSL,Yt as addFiles,Qt as addGlassMarks,Kt as buildHero};
