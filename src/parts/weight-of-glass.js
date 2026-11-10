import*as t from"three";const ft=["#CBC7C0","#E9D58A","#C2386A","#2B2F86","#2D9CC9","#5DBF8F","#15161B"],I=130,Re=104,O=95,Qe=77,R=13,We=.4,Xe=1.03,Ne=e=>[I*e,O*(1-e*e)],ke=e=>[Re*e,Qe*(1-e*e)],_e={cx:152,hx:30,hz:35,top:50,bot:-3,a:1.4},N={x:152,y:24,rFace:15,rMid:8},U=e=>new t.Color(e);function ht(e){const s=[[0,"#FFFFFF"],[.18,"#C4C7CC"],[.4,"#FAF8F0"],[.58,e[1]],[.78,"#DB8A3C"],[.94,e[2]],[1.03,e[3]],[1.2,e[4]],[1.4,e[5]],[1.62,"#E2D667"],[1.84,"#E58CA8"],[2.02,"#7B58A8"],[2.25,"#62C3A0"],[2.6,"#E6DC9C"],[2.9,"#EBB3C4"],[3.3,"#B9E0CB"],[3.9,"#EFD0D8"],[4.5,"#D4E8DC"],[5.2,"#DCD6D2"]].map(([v,u])=>{const w=new t.Color().setStyle(u,t.NoColorSpace);return[v,w.r,w.g,w.b]}),h=new Uint8Array(256*4);for(let v=0,u=0;v<256;v++){const w=v/255*5.2;for(;u<s.length-2&&w>s[u+1][0];)u++;const p=s[u],c=s[u+1];let x=Math.min(1,Math.max(0,(w-p[0])/(c[0]-p[0])));x=x*x*(3-2*x)*.6+x*.4;for(let y=0;y<3;y++)h[v*4+y]=Math.round(255*(p[1+y]+(c[1+y]-p[1+y])*x));h[v*4+3]=255}const b=new t.DataTexture(h,256,1,t.RGBAFormat,t.UnsignedByteType);return b.colorSpace=t.SRGBColorSpace,b.magFilter=b.minFilter=t.LinearFilter,b.wrapS=b.wrapT=t.ClampToEdgeWrapping,b.generateMipmaps=!1,b.needsUpdate=!0,b}function dt(){const e=[],s=[],h=[],b=[],v=[];return{V:(c,x,y,S,g,l,n=0)=>(e.push(c[0],c[1],c[2]),s.push(x[0],x[1],x[2]),h.push(y[0]??999,y[1]??999,y[2]??999,y[3]??999),b.push(S,g,l,n),e.length/3-1),Q:(c,x,y,S)=>{const g=e[c*3],l=e[c*3+1],n=e[c*3+2],a=e[x*3]-g,i=e[x*3+1]-l,z=e[x*3+2]-n,P=e[S*3]-g+e[y*3]-e[x*3],o=e[S*3+1]-l+e[y*3+1]-e[x*3+1],m=e[S*3+2]-n+e[y*3+2]-e[x*3+2],d=i*m-z*o,f=z*P-a*m,M=a*o-i*P,C=s[c*3]+s[y*3],_=s[c*3+1]+s[y*3+1],V=s[c*3+2]+s[y*3+2];d*C+f*_+M*V>=0?v.push(c,x,y,c,y,S):v.push(c,y,x,c,S,y)},build:()=>{const c=new t.BufferGeometry;return c.setAttribute("position",new t.Float32BufferAttribute(e,3)),c.setAttribute("normal",new t.Float32BufferAttribute(s,3)),c.setAttribute("aE",new t.Float32BufferAttribute(h,4)),c.setAttribute("aM",new t.Float32BufferAttribute(b,4)),c.setIndex(v),c},P:e}}const Y=(e,s,h)=>{const b=Math.hypot(e,s,h)||1;return[e/b,s/b,h/b]};function vt(e,s){const h=[];for(let b=0;b<=s;b++){const v=-Xe+2*Xe*b/s,u=.001,w=Ne(v),p=ke(v),c=Ne(v+u),x=ke(v+u),y=Y(-(c[1]-w[1]),c[0]-w[0],0),S=Y(x[1]-p[1],-(x[0]-p[0]),0),g=w[0]-p[0],l=w[1]-p[1],n=Math.hypot(g,l),a=[g/n,l/n],i=(f,M)=>[p[0]+a[0]*f,p[1]+a[1]*f,M],z=2*R-2*We,P=n-2*We,o=We,m=[],d=(f,M,C,_,V,B)=>m.push([e.V(f,C,[0,_],B,V,0),e.V(M,C,[_,0],B,V,0)]);d(i(n,-R+o),i(n,R-o),y,z,0,n),d(i(n,R-o),i(n-o,R),Y(y[0],y[1],1),.57,1,n),d(i(n-o,R),i(o,R),[0,0,1],P,0,2*R),d(i(o,R),i(0,R-o),Y(S[0],S[1],1),.57,1,n),d(i(0,R-o),i(0,-R+o),S,z,0,n),d(i(0,-R+o),i(o,-R),Y(S[0],S[1],-1),.57,1,n),d(i(o,-R),i(n-o,-R),[0,0,-1],P,0,2*R),d(i(n-o,-R),i(n,-R+o),Y(y[0],y[1],-1),.57,1,n),h.push(m)}for(let b=0;b<s;b++)for(let v=0;v<8;v++){const u=h[b][v],w=h[b+1][v];e.Q(u[0],u[1],w[1],w[0])}}function Je(e,s,h,b){const v=_e,u=v.a,w=[s*v.cx,(v.top+v.bot)/2,0],p=[v.hx,(v.top-v.bot)/2,v.hz],c=e.P.length/3,x=(g,l)=>{const n=[-g,-(g-u)];for(let a=1;a<l;a++)n.push(-(g-u)+2*(g-u)*a/l);return n.push(g-u,g),n},y=(g,l)=>{const n=(g+1)%3,a=(g+2)%3,i=x(p[n],6),z=x(p[a],6),P=[];for(const o of i){const m=[];for(const d of z){const f=[0,0,0],M=[0,0,0];let C=0,_=0;f[n]=o,f[a]=d,M[g]=l,Math.abs(o)>=p[n]-1e-6&&(f[n]=Math.sign(o)*(p[n]-u/2),M[n]=Math.sign(o),C=u/2,_=1),Math.abs(d)>=p[a]-1e-6&&(f[a]=Math.sign(d)*(p[a]-u/2),M[a]=Math.sign(d),C=u/2,_=1),f[g]=l*(p[g]-C);const V=[Math.max(0,p[n]-u-Math.abs(o)),Math.max(0,p[a]-u-Math.abs(d))];m.push(e.V([w[0]+f[0],w[1]+f[1],w[2]+f[2]],Y(M[0],M[1],M[2]),V,2*p[g],_,h))}P.push(m)}for(let o=0;o+1<P.length;o++)for(let m=0;m+1<P[o].length;m++)e.Q(P[o][m],P[o][m+1],P[o+1][m+1],P[o+1][m])};if(y(0,1),y(0,-1),y(1,1),!b)y(2,1),y(2,-1);else{const g=N.y-w[1],l=p[0]-u,n=p[1]-u,a=[];for(let o=0;o<72;o++)a.push(o/72*Math.PI*2-Math.PI);for(const o of[-1,1])for(const m of[-1,1])a.push(Math.atan2(m*n-g,o*l));a.sort((o,m)=>o-m);const i=a.length;for(const o of[1,-1]){const m=[];for(let d=0;d<i;d++){const f=Math.cos(a[d]),M=Math.sin(a[d]),C=f>1e-9?l/f:f<-1e-9?-l/f:1e9,_=M>1e-9?(n-g)/M:M<-1e-9?(-n-g)/M:1e9,V=Math.min(C,_),B=f*V,$=g+M*V,Q=[];for(let te=0;te<=4;te++){const ae=te/4,j=N.rFace+(V-N.rFace)*ae,ce=te<4?f*j:B,fe=te<4?g+M*j:$;Q.push(e.V([w[0]+ce,w[1]+fe,o*p[2]],[0,0,o],[Math.max(0,l-Math.abs(ce)),Math.max(0,n-Math.abs(fe)),j-N.rFace],2*p[2],0,h))}const pe=Math.abs(B)>=l-1e-4,me=Math.abs($)>=n-1e-4;Q.push(e.V([w[0]+B+(pe?Math.sign(B)*u/2:0),w[1]+$+(me?Math.sign($)*u/2:0),o*(p[2]-u/2)],Y(pe?Math.sign(B):0,me?Math.sign($):0,o),[0,0,50],2*p[2],1,h)),m.push(Q)}for(let d=0;d<i;d++)for(let f=0;f<5;f++){const M=m[d],C=m[(d+1)%i];e.Q(M[f],M[f+1],C[f+1],C[f])}}const z=14,P=[];for(let o=0;o<i;o++){const m=Math.cos(a[o]),d=Math.sin(a[o]),f=[];for(let M=0;M<=z;M++){const C=p[2]*(1-2*M/z),_=C/p[2],V=N.rMid+(N.rFace-N.rMid)*_*_,B=2*(N.rFace-N.rMid)*_/p[2];f.push(e.V([w[0]+m*V,N.y+d*V,C],Y(-m,-d,B),[(p[2]-Math.abs(C))*1.1],22,0,h,1))}P.push(f)}for(let o=0;o<i;o++)for(let m=0;m<z;m++){const d=P[o],f=P[(o+1)%i];e.Q(d[m],d[m+1],f[m+1],f[m])}}const S=e.P;for(let g=c*3;g<S.length;g+=3){const l=Math.min(1,Math.max(0,S[g+1]/v.top));let n=1;if(b){const a=Math.hypot(S[g]-N.x,S[g+1]-N.y),i=Math.min(1,Math.max(0,(a-16)/13));n=i*i*(3-2*i)}S[g]=w[0]+(S[g]-w[0])*(1-.09*l*n),S[g+2]*=1-.07*l}}const et=`
float mistSeg(vec3 eye, vec3 P) {
  vec3 d = P - eye; float len = length(d), py = abs(P.y);
  float T = 9.0 + 0.034 * length(d.xz);                    // the top of the layer as seen from here: it stands taller with distance
  float y0 = min(eye.y, py), y1 = max(eye.y, py), dy = y1 - y0;
  float inside = max(min(y1, T) - min(y0, T), 0.0);
  float frac = dy > 0.01 ? clamp(inside / max(dy, 0.01), 0.0, 1.0) : 1.0 - step(T, y0);
  float band = 1.0 - smoothstep(0.55 * T, 1.05 * T, py);  // a clean top: what stands above the band is clear
  return (1.0 - exp(-max(len * frac - 35.0, 0.0) / 120.0)) * band;
}
`,ut=`
attribute vec4 aE; attribute vec4 aM;
varying vec3 vP; varying vec3 vN; varying vec3 vCam; varying vec3 vWP; varying vec3 vWN; varying vec4 vE; varying vec4 vM;
#include <fog_pars_vertex>
void main() {
  vP = position; vN = normal; vE = aE; vM = aM;
  vCam = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWP = wp.xyz; vWN = mat3(modelMatrix) * normal;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,pt=`
uniform vec4 uLoads[NL];      // xyz contact point, w weight
uniform vec4 uLoadDir[NL];    // xyz unit push direction, w = how much Z counts: 1 point load (pads), 0 line load along Z (the supports, last four)
uniform sampler2D uRamp;
uniform float uOcu;           // how hard the far haunch is leaning on the pierced abutment (0.5..1.5)
uniform vec2 uReach;         // metres a pad's nest / a support's eye reaches
uniform float uBendW, uBendK; // half-width (m) and gain of each walker's bending swell
// section coordinates of the Span at q: x = t (-1..1 along the arch), y = c (-1 underside .. 1 back)
vec2 spanTC(vec3 q) {
  float t0 = clamp(q.x / 117.0, -1.03, 1.03);
  float yb = 95.0 * (1.0 - t0 * t0), yu = 77.0 * (1.0 - t0 * t0);
  float f = clamp((q.y - yu) / max(yb - yu, 2.0), 0.0, 1.0);
  float t = clamp(q.x / mix(104.0, 130.0, f), -1.03, 1.03);
  yb = 95.0 * (1.0 - t * t); yu = 77.0 * (1.0 - t * t);
  f = clamp((q.y - yu) / max(yb - yu, 2.0), 0.0, 1.0);
  return vec2(t, f * 2.0 - 1.0);
}
float arcOf(float t) {         // metres along the arch midline from the crown
  float k = 1.4615, a = abs(t) * k;
  return sign(t) * 65.0 * (abs(t) * sqrt(1.0 + a * a) + log(a + sqrt(a * a + 1.0)) / k);
}
// sup: 1 where the body is seen through a face square to Z (or the bore wall), where the supports' and the bore's
// plane patterns read as eyes and lobes; 0 on faces that would only show them edge-on as stripes
float fringeOrder(vec3 q, float kind, float c, float sup) {
  float pt = 0.0, bend = 0.0, isSpan = 1.0 - step(0.5, kind);
  for (int i = 0; i < NL; i++) {
    vec4 L = uLoads[i]; vec4 D = uLoadDir[i];
    float pad = step(0.5, D.w), gate = 1.0;
    if (i >= NL - 4) gate = sup * ((i < NL - 2) ? isSpan : 1.0 - isSpan);     // foot reactions live in the Span, block reactions in the blocks
    vec3 v = q - L.xyz; v.z *= D.w;
    float r = max(length(v), 0.8);
    float reach = mix(uReach.y, uReach.x, pad);            // each load's bands end: most of the glass stays clear
    pt += gate * 13.0 * L.w * max(dot(v, D.xyz), 0.0) / (r * r) * (1.0 - smoothstep(0.45 * reach, reach, r));
    bend += pad * L.w * max(0.0, 1.0 - abs(q.x - L.x) / uBendW);
  }
  float n = pt + uBendK * abs(c + 0.25) * bend * isSpan;
  if (kind > 1.5) {            // the oculus: bands pinch into lobes round the bore
    vec2 d = q.xy - vec2(152.0, 24.0);
    float a = 15.0, d2 = max(dot(d, d), 1.0), rho2 = max(d2, 64.0);
    float c2 = (d.x * d.x - d.y * d.y) / d2;             // cos 2 phi: the bands pinch on the sides in line with the thrust
    n += sup * 1.7 * uOcu * (a * a / rho2) * (1.0 + 0.6 * c2) * (1.0 - smoothstep(1.1 * a, 1.9 * a, sqrt(rho2))) * mix(1.0, 0.44, clamp(vM.w, 0.0, 1.0));   // on the bore wall the lobes tighten toward the throat, like grain round a knot
    { vec2 wv = vP.xy - vec2(152.0, 24.0); float w2 = max(dot(wv, wv), 64.0), wr = sqrt(w2), s0 = min(0.6 + 0.1 * max(12.0 - wr, 0.0), 0.95); n += clamp(vM.w, 0.0, 1.0) * 0.52 * clamp((wr - 8.5) / 2.5, 0.0, 1.0) * smoothstep(s0, min(s0 + 0.25, 1.0), wv.y * wv.y / w2); }   // the block's own dead weight on the hole, read from the wall's own shape alone. It shows where the herd's load never reaches, at the crown and the invert: a still order of 0.52 (straw) within about 23 degrees of the plumb line through the axis, falling to nothing 39 degrees from it and at the hole's two sides; full from the mouth in to wall radius 11, then narrowing toward the plumb line and fading to nothing at radius 8.5, short of the throat. Under it the order above reaches 0.17 at the mouth and 0.38 at the lobe's edge, so the sum stays in straw and orange (0.89 at most) and never enters the indigo and blue
  }
  return n;
}
vec3 rampColor(float n, float fw) {
  vec3 col = texture2D(uRamp, vec2(clamp(n, 0.0, 5.2) / 5.2, 0.5)).rgb;
  return mix(col, vec3(0.716, 0.672, 0.638), smoothstep(0.25, 0.6, fw));   // #DCD6D2, linear
}
float hash21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}
`,mt=`
float sbH(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float sbN(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(sbH(i), sbH(i + vec2(1.0, 0.0)), f.x), mix(sbH(i + vec2(0.0, 1.0)), sbH(i + vec2(1.0, 1.0)), f.x), f.y);
}
float seaBars(vec2 p) {
  vec2 a = vec2(0.80 * p.x + 0.60 * p.y, -0.60 * p.x + 0.80 * p.y);
  float c = a.y + 30.0 * sin(a.x * 0.0105 + 1.3) + 22.0 * sin(a.x * 0.0041 + a.y * 0.0031) + 56.0 * (sbN(a * 0.0037 + 5.0) - 0.5);
  float big = sbN(vec2(a.x * 0.0052, c * 0.017) + 3.0), mid = sbN(vec2(a.x * 0.014, c * 0.045) + 9.0);
  float tri = abs(fract((c + 108.0) / 78.0) - 0.5) * 2.0;        // 1 down the middle of a channel, 0 on a crest; a bar every 78 m
  return clamp(0.5 + 0.62 * (tri - 0.5) + 0.62 * (big - 0.5) + 0.30 * (mid - 0.5), 0.0, 1.0);   // the noises pinch bars out and braid the channels
}
`,xt=`
float rbH(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float rbN(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(rbH(i), rbH(i + vec2(1.0, 0.0)), f.x), mix(rbH(i + vec2(0.0, 1.0)), rbH(i + vec2(1.0, 1.0)), f.x), f.y);
}
vec2 rainBand(vec3 d, float time) {
  float y = abs(d.y);
  vec2 h = d.xz / max(length(d.xz), 1e-3);
  float ba = 0.5 + 0.5 * smoothstep(-0.25, 0.75, h.y);
  float n1 = rbN(h * 2.6 + 11.7), n2 = rbN(h * 6.0 + 4.0);
  float base = (0.050 + 0.036 * n1) * ba, top = (0.160 + 0.070 * n2 + 0.025 * n1) * ba;
  float under = 1.0 - smoothstep(base - 0.003, base + 0.009, y);
  float deck = (1.0 - under) * (1.0 - smoothstep(top * 0.74, top, y));
  float sl = (base - y) * 2.4, cs = cos(sl), sn = sin(sl);
  vec2 hr = vec2(h.x * cs - h.y * sn, h.x * sn + h.y * cs);
  float cur = smoothstep(0.39, 0.47, 0.62 * rbN(hr * 5.0 + vec2(time * 0.006, 2.0)) + 0.38 * rbN(hr * 13.0 + 7.0));     // rain along most of the band, gaps of light between
  float fib = 0.84 + 0.16 * rbN(hr * 44.0 + vec2(3.0, y * 22.0 + time * 0.55));      // fibres of rain sliding down the curtain
  float shaft = cur * under * (0.84 + 0.16 * smoothstep(0.0, max(base, 1e-3), y)) * fib;   // a curtain thins toward the sea
  return vec2(max(deck, shaft), deck);
}
`,gt=`
uniform vec3 uVeilC, uPatch, uMistC, uSand, uDeep; uniform float uVeilAmt, uRefr;
uniform mat4 modelMatrix;
${mt}
${xt}
vec3 envSky(vec3 d) {
  float y = abs(d.y);
  vec3 c = mix(uHor, uZen, smoothstep(0.0, 0.6, y));
  float s = max(dot(vec3(d.x, y, d.z), uSunDir), 0.0); c += uPatch * s * s * s;
  vec2 rb = rainBand(d, uTime);
  c = mix(c, uVeilC * mix(0.98, 0.88, rb.y), 0.94 * rb.x * uVeilAmt);
  c = mix(c, uMistC, 0.4 * (1.0 - uMist) * (1.0 - smoothstep(0.002, 0.013, y)));       // the thin pale line of haze on the horizon
  return mix(c, uMistC, uMist * (1.0 - smoothstep(0.034, 0.078, y)));
}
vec3 envAt(vec3 o, vec3 d) {
  if (d.y > -1e-3 || o.y < 0.05) return envSky(d);
  float up = clamp(-d.y, 0.0, 1.0), t = min(o.y / max(up, 1e-3), 4000.0);
  vec2 p = o.xz + d.xz * t;
  float fwE = t * uPix / max(up, 0.02);
  float dnE = seaBars(p), lodE = 1.0 - smoothstep(10.0, 36.0, fwE);
  float deep = mix(0.5, smoothstep(0.465, 0.515, dnE), lodE);
  vec3 col = mix(mix(uSand, uDeep * 1.45 + vec3(0.0, 0.012, 0.010), 0.06 + 0.80 * deep), uDeep * 0.92, 0.75 * mix(0.3, smoothstep(0.53, 0.82, dnE), lodE));
  float farS = 1.0 - exp(-t / 1300.0);
  col = mix(col, mix(uDeep, uHor, 0.2) * 0.62, farS);
  float a = mix(mix(0.36, 0.60, deep), 0.94, smoothstep(0.03, 0.45, up)); a = mix(a, 0.86, farS);
  float mi = 0.92 * uMist * (1.0 - exp(-max(min(t, 9.0 / max(up, 0.002)) - 35.0, 0.0) / 120.0));
  col = mix(col, uMistC, mi); a = mix(a, 1.0, mi);
  return mix(envSky(vec3(d.x, -d.y, d.z)), col, a);
}
// the sag of a cast face: a vector that grows from the middle of the body toward its arrises
vec3 sagAt(vec3 p, float kind) {
  if (kind < 0.5) { vec2 tc = spanTC(p); return tc.y * normalize(vec3(0.0112 * p.x, 1.0, 0.0)) + vec3(0.0, 0.0, p.z / 13.0); }
  return (p - vec3(kind < 1.5 ? -152.0 : 152.0, 23.5, 0.0)) / vec3(30.0, 26.5, 35.0);
}
vec3 sagNormal(vec3 n, vec3 p, float kind) {
  vec3 g = sagAt(p, kind); g -= n * dot(g, n);
  return normalize(n + 0.11 * g + 0.012 * sin(p.yzx * vec3(0.23, 0.31, 0.19) + p.zxy * 0.13));
}
// where the bent ray leaves the body, the outward normal there and the metres to the nearest far arris
float gConf = 1.0;      // how well the exit point is known (the Span's section walk may not close at glancing rays)
void glassExit(vec3 p0, vec3 rd, float kind, out vec3 pe, out vec3 ne, out float e2) {
  if (kind < 0.5) {                                   // the Span: walk its section from the inside
    float L = 0.0, th = 20.0; vec2 tc = vec2(0.0);
    for (int i = 0; i < 7; i++) {
      vec3 q = p0 + rd * L; tc = spanTC(q); th = 18.0 + 8.0 * tc.x * tc.x;
      L += max(min((1.0 - abs(tc.y)) * 0.4 * th, 13.0 - abs(q.z)), 0.3);
    }
    pe = p0 + rd * L; tc = spanTC(pe); th = 18.0 + 8.0 * tc.x * tc.x;
    float dz = 13.0 - abs(pe.z), dc = (1.0 - abs(tc.y)) * 0.5 * th;
    gConf = 1.0 - smoothstep(0.6, 3.0, min(dz, dc));
    if (dz < dc) { ne = vec3(0.0, 0.0, pe.z < 0.0 ? -1.0 : 1.0); e2 = dc; }
    else { ne = normalize(vec3((tc.y > 0.0 ? 0.01124 : 0.01424) * pe.x, 1.0, 0.0)) * (tc.y > 0.0 ? 1.0 : -1.0); e2 = dz; }
  } else {                                            // a block: a battered box (the bore of the far one is ignored: its wall keeps its own quiet look)
    vec3 C = vec3(kind < 1.5 ? -152.0 : 152.0, 23.5, 0.0), o = p0 - C;
    float yn = clamp(p0.y / 50.0, 0.0, 1.0);
    vec3 H = vec3(30.0 * (1.0 - 0.09 * yn), 26.5, 35.0 * (1.0 - 0.07 * yn));
    vec3 sg = vec3(rd.x < 0.0 ? -1.0 : 1.0, rd.y < 0.0 ? -1.0 : 1.0, rd.z < 0.0 ? -1.0 : 1.0);
    vec3 tf = max((H - o * sg) / max(abs(rd), vec3(1e-4)), vec3(0.0));
    float tE = min(tf.x, min(tf.y, tf.z));
    ne = tf.x <= tE ? vec3(sg.x, 0.0, 0.0) : (tf.y <= tE ? vec3(0.0, sg.y, 0.0) : vec3(0.0, 0.0, sg.z));
    pe = p0 + rd * tE;
    vec3 m = H - abs(pe - C) + abs(ne) * 999.0; e2 = min(m.x, min(m.y, m.z));
  }
}
// e0: the scene along the straight sight line; e1: along the bent one; e2: metres to a far arris; len: metres of glass crossed
void refractEnv(vec3 P, vec3 V, vec3 n, float kind, out vec3 e0, out vec3 e1, out float e2, out float len) {
  vec3 rd = refract(-V, sagNormal(n, P, kind), 0.6667);
  rd = normalize(rd + vec3(0.0, 1e-5, 0.0));
  vec3 pe, ne; glassExit(P, rd, kind, pe, ne, e2);
  ne = sagNormal(ne, pe, kind);
  vec3 ro = refract(rd, -ne, 1.5);
  if (dot(ro, ro) < 0.25) ro = reflect(rd, ne);       // total internal reflection: the far face is a mirror
  mat3 M = mat3(modelMatrix);
  len = distance(P, pe);
  e0 = envAt((modelMatrix * vec4(P, 1.0)).xyz, normalize(M * (-V)));
  e1 = envAt((modelMatrix * vec4(pe, 1.0)).xyz, normalize(M * ro + vec3(0.0, 1e-5, 0.0)));
}
`,yt=`
uniform float uTime, uPix, uVeil, uGlint, uMist, uGraze, uArr; uniform vec3 uAbs;
uniform vec3 uSunDir, uZen, uHor, uLine;
varying vec3 vP; varying vec3 vN; varying vec3 vCam; varying vec3 vWP; varying vec3 vWN; varying vec4 vE; varying vec4 vM;
#include <fog_pars_fragment>
${pt}
${et}
#ifdef REFR
${gt}
#else
uniform vec3 uSand;
#endif
void main() {
  vec3 Vv = vCam - vP; float dist = max(length(Vv), 1e-3); vec3 V = Vv / dist;
  vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0));
  #if PASS == 0
    n = -n;
  #endif
  float ndv = abs(dot(n, V)), px = dist * uPix;
  float e = min(min(vE.x, vE.y), min(vE.z, vE.w));
  float lw = max(0.16, 1.7 * px);
  float arris = (1.0 - smoothstep(lw * 0.4, lw, e)) * (1.0 - clamp(vM.y, 0.0, 1.0)) * clamp(0.16 / (1.7 * px), 0.3, 1.0);
  float sil = smoothstep(0.06, 0.22, ndv);
  vec2 ts = spanTC(vP);
  float isSpan = 1.0 - step(0.5, vM.z);
  // frost: the tide band at the waterline and two lanes worn along the Span's back
  float nz = vnoise(vP.xz * 0.9 + vP.y * 0.7) * 0.6 + vnoise(vP.xz * 3.7 + vP.y * 2.9) * 0.4;
  float tide = (1.0 - smoothstep(0.9, 2.6, vP.y + nz * 1.5)) * (0.75 + 0.25 * nz);
  float lane = (1.0 - smoothstep(0.9, 1.7, abs(abs(vP.z) - 3.6))) * isSpan * step(0.985, ts.y) * step(0.2, vN.y);
  lane *= 0.45 + 0.55 * vnoise(vec2(arcOf(ts.x) * 0.55, vP.z * 1.3));
  float fogF = 0.0;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  float veil = 1.0 - (1.0 - fogF) * exp(-dist / uVeil) * (1.0 - 0.92 * uMist * mistSeg(cameraPosition, vWP));
  #if PASS == 0
    // back faces, multiply: bottle green by thickness, and the far-side arrises seen through the body
    vec3 col = exp(-min(vM.x, 34.0) * uAbs);
    float inBore = (1.0 - smoothstep(31.0, 41.0, abs(vCam.z))) * (1.0 - step(16.0, abs(vCam.x - 152.0))) * step(1.5, vM.z);
    col *= mix(vec3(1.0), uLine, arris * 0.5 * (1.0 - 0.7 * inBore));
    col *= mix(uLine, vec3(1.0), mix(mix(0.85, 0.955, inBore), 0.45, vM.w) + mix(mix(0.15, 0.045, inBore), 0.55, vM.w) * sil);
        gl_FragColor = vec4(mix(col, vec3(1.0), veil), 1.0);
  #elif PASS == 1
    // front faces, multiply: fringe colour inside the glass, refraction line, joints, cords
    vec3 rd = refract(-V, n, 0.66);
    vec3 q = vP + rd * min(vM.x * 0.5, 8.0) * smoothstep(0.0, uArr, e);
    // the supports' plane patterns show only through faces square to Z, and die away toward that face's arrises and
    // at glancing angles, so no band ever stops at a straight edge
    float eF = smoothstep(0.3, 3.5, min(vE.x, vE.y));
    float wall = clamp(vM.w, 0.0, 1.0) * (1.0 - smoothstep(45.0, 110.0, dist)) * (0.34 + 0.66 * (1.0 - smoothstep(3.0, 24.0, abs(q.z))));   // the bore wall carries its bands for a lens near or inside the bore; they gather toward the throat
    float sup = max(smoothstep(0.3, 0.8, abs(n.z)) * eF * smoothstep(0.15, 0.5, ndv), wall);
    float N = fringeOrder(q, vM.z, spanTC(q).y, sup);
    // looked along at a glancing angle the worn back mirrors the sky: the nests close up round the pads
    float graze = uGraze * isSpan * step(0.2, vN.y) * step(0.9, ts.y);
    N *= 1.0 - graze * (1.0 - smoothstep(0.12, 0.55, ndv));
    vec3 col = rampColor(N, fwidth(N));
    col = mix(col, vec3(1.0), graze * (1.0 - smoothstep(0.3, 0.9, ndv)));     // and what colour is left pales: never an oil slick over the whole back
    #ifdef REFR
      vec3 e0, e1; float e2, glen; refractEnv(vP, V, n, vM.z, e0, e1, e2, glen);
      // toward the Span's feet the section walk no longer closes (it stepped into hard chevrons there): the bend eases off
      float footK = 1.0 - isSpan * smoothstep(0.58, 0.8, abs(ts.x));
      float exitK = gConf * smoothstep(0.0, 4.5, e2) * mix(1.0, smoothstep(0.08, 0.4, ndv), isSpan);     // no hard step where the exit face changes or the walk has not closed
      col *= mix(vec3(1.0), clamp(e1 / max(e0, vec3(0.02)), 0.42, 1.6), uRefr * footK * exitK * (1.0 - clamp(vM.w, 0.0, 1.0)));   // a factor, above 1 where the bent ray finds a brighter scene (the target is HDR): a walker behind the glass stays black
      float l2 = max(0.2, 1.7 * px);                                       // the far arrises again, where the bent ray meets them
      col *= mix(vec3(1.0), uLine, (1.0 - smoothstep(l2 * 0.4, l2, e2)) * 0.45 * footK * clamp(0.2 / (1.7 * px), 0.3, 1.0));
      col *= 1.0 - 0.10 * smoothstep(8.0, 70.0, glen);                     // a little darker through the thick middle
    #endif
    float jd = abs(fract(arcOf(ts.x) / 20.0) - 0.5) * 20.0, jw = max(0.05, 1.2 * px);
    col *= mix(vec3(1.0), uLine, (1.0 - smoothstep(jw * 0.4, jw, jd)) * isSpan * 0.4 * clamp(0.05 / (1.2 * px), 0.2, 1.0));
    vec3 q2 = vP + rd * min(vM.x * 0.5, 13.0);
    float g2 = q2.x * 0.19 + q2.z * 0.13 + 1.7 * sin(q2.y * 0.045 + q2.z * 0.11);
    float cord = (1.0 - smoothstep(0.0, 0.03 + px * 0.35, abs(fract(g2) - 0.5))) * step(0.5, hash21(vec2(floor(g2), 3.0)));
    col *= 1.0 - 0.09 * cord;
    col *= mix(uLine, vec3(1.0), mix(0.78 + 0.22 * sil, sil, vM.w));   // the full dark refraction line only where the surface curves away
    // the bore wall is turned in rings 3.5 m apart, each a thick lens seen at a glancing angle: a dark refraction line
    // on its outer side, shading away from it, and the throat a darker ring round the portal
    float wl = clamp(vM.w, 0.0, 1.0) * (1.0 - smoothstep(70.0, 150.0, dist));
    float fzr = fract(abs(vP.z) / 3.5), dzr = min(fzr, 1.0 - fzr) * 3.5, rw = max(0.09, 1.5 * px);
    col *= mix(vec3(1.0), uLine, wl * (1.0 - smoothstep(rw * 0.4, rw, dzr)) * 0.85 * clamp(0.09 / (1.5 * px), 0.4, 1.0));
    col *= 1.0 - wl * (0.20 * (1.0 - smoothstep(0.0, 0.55, fzr)) + 0.26 * (1.0 - smoothstep(1.0, 17.0, abs(vP.z))));
    col *= mix(vec3(1.0), uLine, arris * 0.85);
    col = mix(col, vec3(0.80, 0.81, 0.80), 0.5 * lane + 0.4 * tide);   // frost greys whatever shows through it
    gl_FragColor = vec4(mix(col, vec3(1.0), veil), 1.0);
  #else
    // front faces, additive: sky sheen, the glint of the bright patch, chamfer glints, frost
    vec3 wn = normalize(vWN + 0.02 * sin(vWP.yzx * vec3(0.37, 0.53, 0.29) + vWP.zxy * 0.21) + vec3(0.0, 1e-5, 0.0));
    vec3 wV = normalize(cameraPosition - vWP + vec3(0.0, 1e-4, 0.0));
    vec3 R = reflect(-wV, wn);
    float fz = 1.0 - clamp(abs(dot(wn, wV)), 0.0, 1.0), f2 = fz * fz;
    float F = min(0.04 + 0.96 * f2 * f2 * fz, 0.45) * smoothstep(0.0, 0.2, 1.0 - fz);
    float wlC = clamp(vM.w, 0.0, 1.0) * (1.0 - smoothstep(70.0, 150.0, dist)), fzC = fract(abs(vP.z) / 3.5), shC = smoothstep(0.45, 1.0, fzC);
    F = mix(F, 0.04 + 0.30 * f2 * fz + 0.15 * shC * shC, wlC);        // the bore wall: a grazing mirror, brightest on the inner side of each ring
    vec3 sky = mix(uHor, uZen, smoothstep(0.0, 0.6, abs(R.y)));
    sky = mix(sky, uSand * 0.9, 0.85 * (1.0 - smoothstep(-0.2, 0.02, R.y)));    // a face that mirrors downward mirrors the sea, which is darker: undersides seen from below keep their depth
    float sd = max(dot(vec3(R.x, abs(R.y), R.z), uSunDir), 0.0);
    float s2 = sd * sd, s4 = s2 * s2, s8 = s4 * s4;
    vec3 col = F * sky * (0.8 + 0.5 * s4);
    float ch = clamp(vM.y, 0.0, 1.0);
    // ARRIS GLINTS: a rounded arris always holds one normal that mirrors the bright patch, so every arris that turns
    // toward the patch carries a fine white line (never under ~1.7 px, the only pixels that bloom), brightest where the
    // half vector lies in the arris's own section plane: it slides along the arch as the lens moves.
    float isBlk = step(0.5, vM.z), onCh = step(0.01, ch);
    float dA = mix(e + mix(0.28, 0.7, isBlk), mix(max(0.285 - e, 0.0), (1.0 - ch) * 0.7, isBlk), onCh);       // metres to the middle of the nearest arris
    float gw = 1.25 * px;                                                             // 2-3 px wide however close or far the arris is
    float fineK = clamp(7.0 * px, 0.0, 1.0);                                           // 0 close to (a chamfer many pixels wide), 1 far off
    float lineM = 1.0 - smoothstep(gw * 0.45, gw, dA), lineK = mix(lineM, 1.0, fineK);
    vec3 wn0 = normalize(vWN + vec3(0.0, 1e-5, 0.0));
    vec3 dpx = dFdx(vWP), dpy = dFdy(vWP); float ex = dFdx(e), ey = dFdy(e);
    vec3 cb = cross(dpy, wn0), ca = cross(wn0, dpx); float det = dot(dpx, cb);
    vec3 ge = (ex * cb + ey * ca) / (abs(det) > 1e-9 ? det : 1e-9);                  // which way the arris lies, in the face
    float gl2 = dot(ge, ge);
    vec3 tOut = (gl2 > 0.04 && gl2 < 25.0) ? -ge * inversesqrt(max(gl2, 1e-4)) * (1.0 - onCh) : vec3(0.0);
    vec3 aN = normalize(wn0 + tOut);
    vec3 Hh = normalize(uSunDir + wV + vec3(0.0, 1e-4, 0.0));
    float hn = dot(Hh, wn0), ht = dot(Hh, tOut);
    float inPl = clamp(mix(sqrt(hn * hn + ht * ht) * smoothstep(-0.1, 0.15, hn) * smoothstep(-0.1, 0.15, ht), max(dot(Hh, aN), 0.0), onCh), 0.0, 1.0);
    float sp2 = inPl * inPl, sp8 = sp2 * sp2 * sp2 * sp2, sp32 = sp8 * sp8 * sp8 * sp8;
    float lit = smoothstep(0.20, 0.75, dot(aN, uSunDir));
    col += uGlint * 0.5 * pow(sd, 420.0) * vec3(1.0, 0.98, 0.94) * clamp(ch * lineK + 1.5 * lane, 0.0, 1.0);   // the bright patch glints only as thin lines: on chamfers and along the worn lanes, never as a disc on a flat face
    col += ch * ch * (0.05 + 0.55 * s8 * lineK) * vec3(1.0, 0.99, 0.96);
    float farH = 1.0 - 0.7 * (1.0 - isBlk) * smoothstep(80.0, 112.0, vWP.x);      // the far haunch beside the oculus keeps its dark arris line; its white glint is quieter, so it reads as glass, not as a bar across the approach
    col += lineM * (0.95 * lit + 1.3 * sp32) * farH * (uGlint / 1.6) * (1.0 - clamp(vM.w, 0.0, 1.0)) * vec3(1.0, 0.99, 0.96);
    col += (0.06 * tide + lane * (0.05 + 0.22 * s8)) * uHor;
    gl_FragColor = vec4(col * (1.0 - veil), 1.0);
  #endif
}`;function wt(e,s){const h=(b,v)=>{const u=new t.ShaderMaterial({uniforms:e,vertexShader:ut,fragmentShader:yt,fog:!0,defines:v?{NL:s,PASS:b,REFR:1}:{NL:s,PASS:b},side:b===0?t.BackSide:t.FrontSide,transparent:!0,depthWrite:!1,depthTest:!0});return b<2?(u.blending=t.CustomBlending,u.blendEquation=t.AddEquation,u.blendSrc=t.DstColorFactor,u.blendDst=t.ZeroFactor):u.blending=t.AdditiveBlending,u};return[h(0),h(1,!0),h(2,!1),h(1,!1)]}const H=9,we=[[4.6,3.3,0],[4.6,-3.3,.5],[-4.6,3.3,.58],[-4.6,-3.3,.08]];function bt(e){const s=[],h=[],b=[],v=(l,n,a,i,z,P,o)=>(s.push(l,n,a),h.push(i,z,P,o),s.length/3-1),u=(l,n,a)=>{const i=[];for(let z=0;z<=l;z++){const P=[];for(let o=0;o<=n;o++)P.push(a(z/l,o/n,z,o));i.push(P)}for(let z=0;z<l;z++)for(let P=0;P<n;P++)b.push(i[z][P],i[z+1][P],i[z+1][P+1],i[z][P],i[z+1][P+1],i[z][P+1])},w=l=>Math.sqrt(Math.max(0,1-l/8.3*(l/8.3))),p=l=>5*Math.pow(w(l),.55),c=l=>3.4+5.6*Math.pow(w(l),.7),y=[0,1,2,3,4,5,6].map(()=>e.range(-.12,.12)),S=[0,.3,.62,.9,1];for(let l=0;l<7;l++)u(4,14,(n,a,i)=>{const z=S[i],P=Math.max(-8.25,Math.min(8.25,8.25-16.5/7*(l+z*1.22))),o=.97+.075*z+y[l]*.25,m=(a*2-1)*Math.PI*.5,d=p(P)*o,f=3.4+(c(P)-3.4)*o,M=.42*Math.exp(-(m/.13)*(m/.13))*w(P),C=3.4-.25*z+(f-3.4)*Math.pow(Math.max(0,Math.cos(m)),.72)+M;return v(P,C,d*Math.sin(m)*(1+.05*Math.cos(2*m)),l*.9,1,0,i===4?1:i===3?.55:0)});u(10,4,(l,n)=>{const a=-8.2+16.4*l,i=(n*2-1)*p(a)*.97;return v(a,3.4-.9*w(a)*(1-(n*2-1)*(n*2-1)),i,0,1,0,0)});for(let l=0;l<46;l++){const n=l%2?1:-1,a=-7.7+15.4*((l>>1)+e.range(.1,.9))/23,i=e.range(.9,1.7),z=e.range(.07,.11),P=n*p(a)*.985,o=e.range(0,6.28),m=[],d=[];for(let f=0;f<3;f++){const M=f/3*Math.PI*2;m.push(v(a+Math.cos(M)*z,3.4+.05,P+Math.sin(M)*z,o,0,2,.15)),d.push(v(a+Math.cos(M)*z*.45,3.4-i,P+Math.sin(M)*z*.45,o,1,2,.5))}for(let f=0;f<3;f++){const M=(f+1)%3;b.push(m[f],d[f],d[M],m[f],d[M],m[M])}b.push(d[0],d[2],d[1])}for(const[l,n,a]of we){const i=e.range(-.15,.15);u(9,10,(o,m)=>{const d=m*Math.PI*2,f=.5+o*4.3,M=(.72+.38*o*o+.07*Math.sin(o*22+i*9))*(o>.999?.6:1);return v(l+Math.cos(d)*M,f,n+Math.sin(d)*M*1.08,a,Math.pow(o,.8),1,.08*Math.max(0,Math.sin(o*22+i*9)))});const z=[0,.85,1.12,1.16,.8],P=[0,0,.14,.42,.62];u(4,10,(o,m,d)=>{const f=m*Math.PI*2,M=z[d]*(1+.05*Math.cos(f*3+i*20));return v(l+Math.cos(f)*M,P[d],n+Math.sin(f)*M,a,0,1,d===2?.75:d===3?.3:0)})}const g=new t.BufferGeometry;return g.setAttribute("position",new t.Float32BufferAttribute(s,3)),g.setAttribute("aA",new t.Float32BufferAttribute(h,4)),g.setIndex(b),g.computeVertexNormals(),g}function Lt(e){const s=(b,v,u)=>{const w=Math.min(1,Math.max(0,(u-b)/(v-b)));return w*w*(3-2*w)};if(e<.62)return[(.31-e)*H,0,s(0,.12,e)*(1-s(.5,.62,e))];const h=(e-.62)/.38;return[H*.31*(-1+2*s(0,1,h)),Math.sin(Math.PI*h)*1.5,0]}const Mt=`
attribute vec4 aA;            // x: phase (leg phase / plate index / rod phase), y: flex, z: 0 body 1 leg 2 skirt rod, w: wear
attribute vec2 aI;            // per walker: gait phase offset, spare
uniform float uTravel, uTime;
varying vec3 vWN; varying vec3 vWP; varying float vWear; varying float vTop; varying vec3 vL; varying float vSc;
#include <fog_pars_vertex>
void main() {
  vec3 p = position; vL = vec3(position.x, aA.z, position.z);
  float cyc = uTravel / ${H.toFixed(1)} + aI.x;
  float bob = 0.11 * sin(12.5664 * cyc);
  if (aA.z < 0.5) {                       // plates slide on one another with the stride
    p.y += bob + 0.04 * sin(6.2832 * cyc + aA.x * 1.7);
    p.x += 0.09 * sin(12.5664 * cyc + aA.x * 2.0);
  } else if (aA.z < 1.5) {                // legs: planted while p < 0.62, then lift and swing forward
    float pp = fract(cyc + aA.x), k = 1.0 - aA.y, off = 0.0, lift = 0.0;
    if (pp < 0.62) off = (0.31 - pp) * ${H.toFixed(1)};
    else { float q = (pp - 0.62) / 0.38; float s = q * q * (3.0 - 2.0 * q); off = ${(H*.31).toFixed(3)} * (2.0 * s - 1.0); lift = sin(3.14159 * q) * 1.5; }
    p.x += off * k * sqrt(max(k, 0.0)); p.y += lift * k + bob * aA.y;
  } else {                                // skirt rods sway
    p.y += bob;
    p.x += aA.y * (0.2 * sin(uTime * 1.9 + aA.x) - 0.22 * sin(12.5664 * cyc + aA.x * 0.3));
    p.z += aA.y * 0.14 * sin(uTime * 1.3 + aA.x * 2.0);
  }
  mat4 m = modelMatrix * instanceMatrix;
  vec4 wp = m * vec4(p, 1.0);
  vWP = wp.xyz; vWN = mat3(m) * normal; vWear = aA.w; vTop = normal.y; vSc = length(m[0].xyz);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,zt=`
uniform vec3 uDark, uHor; uniform float uVeil, uMist, uPix;
varying vec3 vWN; varying vec3 vWP; varying float vWear; varying float vTop; varying vec3 vL; varying float vSc;
#include <fog_pars_fragment>
${et}
void main() {
  vec3 n = normalize(vWN + vec3(0.0, 1e-5, 0.0));
  vec3 Vv = cameraPosition - vWP; float dist = max(length(Vv), 1e-3);
  float top = max(vTop, 0.0), under = max(-vTop, 0.0);
  float ndv = clamp(abs(dot(n, Vv / dist)), 0.0, 1.0), rim = (1.0 - ndv) * (1.0 - 0.9 * under);   // no rim light on the belly: from below a walker stays black
  // far off a walker is a pure black silhouette; within about 60 m it becomes armour: sheen, wear lines, seams
  float near = 1.0 - smoothstep(55.0, 200.0, dist);
  float body = 1.0 - step(0.5, vL.y), leg = step(0.5, vL.y) * (1.0 - step(1.5, vL.y)), rod = step(1.5, vL.y);
  vec3 col = uDark + uHor * (0.07 * rim * rim * rim + 0.03 * top * top * (0.6 + 0.4 * rim));   // satin black, pearl sheen on the back
  float keel = exp(-vL.z * vL.z * 1.6) * top * body;                         // the ridge along the spine
  float sheen = 0.050 * top * top * top * (0.5 + 0.5 * rim) + 0.050 * keel + 0.035 * rim * rim * (0.4 + 0.6 * top);
  sheen += leg * 0.045 * rim * rim + rod * 0.05 * (0.3 + 0.7 * rim);          // trunk legs and skirt rods part from the body
  sheen += body * under * 0.006;                                             // the belly takes a little light back from the glass under it
  col += uHor * near * sheen;
  // pale wear along every plate edge (thin: the cube of the baked ramp), and the plate seams across the belly
  float w3 = clamp(vWear, 0.0, 1.0); w3 = w3 * w3 * mix(1.0, w3, body);
  float pl = fract((8.25 - vL.x) / 2.357), sd = min(pl, 1.0 - pl) * 2.357, sw = max(0.045, 0.6 * uPix * dist);
  float seam = (1.0 - smoothstep(sw * 0.4, sw, sd)) * 0.2;
  // the giant: its seven plates part along a pearl sheen line at each plate edge, and the keel is a fine bright ridge
  float big = smoothstep(1.5, 2.2, vSc), swG = max(0.07, 0.9 * uPix * dist / max(vSc, 0.5));
  float edgeG = (1.0 - smoothstep(swG * 0.4, swG, sd)) + 0.3 * (1.0 - smoothstep(0.0, 0.35, pl));     // the line, and the lit lap of the plate behind it
  float keelG = 1.0 - smoothstep(swG * 0.5, swG * 1.6, abs(vL.z));
  col += uHor * big * body * (1.0 - under) * (0.5 + 0.5 * near) * (0.13 * edgeG * (0.35 + 0.65 * rim + 0.4 * top) + 0.14 * keelG * smoothstep(0.1, 0.5, top));
  w3 *= 1.0 - 0.9 * under;                                                   // the belly is plain satin black: no wear lines, only the faint transverse plate seams
  w3 = max(w3, body * step(0.6, under) * seam * near);
  col = mix(col, uHor * (0.17 + 0.16 * near), w3 * 0.85);
  col = mix(col, uHor, 1.0 - exp(-dist / (uVeil * 1.8)) * (1.0 - 0.92 * uMist * mistSeg(cameraPosition, vWP)));   // the only darks hold their black longer than the glass holds its lines
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,kt=`
attribute vec3 aD;            // x: t along the stalk (0 root .. 1 drop), y: 0 stalk 1 drop, z: c across (-1..1)
attribute vec4 aI0;           // anchor xyz, stalk length
attribute vec4 aI1;           // omega, phase, amplitude (rad), swing-plane angle
uniform float uTime, uPix;
varying vec3 vWN; varying vec3 vWP; varying vec3 vK;   // vK: fringe order, part, t
#include <fog_pars_vertex>
void main() {
  float len = aI0.w, sw = sin(uTime * aI1.x + aI1.y), tS = min(aD.x, 1.0), th = aI1.z * sw * mix(0.55, 1.0, tS);
  vec3 anchorW = (modelMatrix * vec4(aI0.xyz, 1.0)).xyz;
  float widen = max(1.0, 1.6 * uPix * distance(cameraPosition, anchorW) / 0.06);       // stalks never thinner than ~1.5 px
  vec3 p = aD.y < 0.5 ? vec3(position.x * widen, position.y * len, position.z * widen) : position - vec3(0.0, len, 0.0);
  vec3 nn = normal;
  float ca = cos(aI1.w), sa = sin(aI1.w), c = cos(th), s = sin(th);
  vec2 h = vec2(dot(p.xz, vec2(ca, sa)), dot(p.xz, vec2(-sa, ca)));                    // swing in the vertical plane at angle aI1.w
  vec2 r = vec2(h.x * c - p.y * s, h.x * s + p.y * c);
  p = vec3(r.x * ca - h.y * sa, r.y, r.x * sa + h.y * ca);
  vec2 hn = vec2(dot(nn.xz, vec2(ca, sa)), dot(nn.xz, vec2(-sa, ca)));
  vec2 rn = vec2(hn.x * c - nn.y * s, hn.x * s + nn.y * c);
  nn = vec3(rn.x * ca - hn.y * sa, rn.y, rn.x * sa + hn.y * ca);
  vec4 wp = modelMatrix * vec4(aI0.xyz + p, 1.0);
  vWP = wp.xyz; vWN = mat3(modelMatrix) * nn;
  float t = tS, root = (1.0 - t) * (1.0 - t), tip = t * t * t * t;
  root *= root;
  float blush = min((root + 0.9 * tip) * (0.25 + 0.75 * abs(sw)) * (0.6 + 0.4 * abs(aD.z)) * clamp(aI1.z / 0.16, 0.6, 1.2), 0.95);   // never past first-order pink
  vK = vec3(blush * (1.0 - aD.y), aD.y, aD.x);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Pt=`
uniform sampler2D uRamp; uniform vec3 uSunDir, uZen, uHor, uLine; uniform float uVeil, uGlint;
varying vec3 vWN; varying vec3 vWP; varying vec3 vK;
#include <fog_pars_fragment>
void main() {
  vec3 n = normalize(vWN + vec3(0.0, 1e-5, 0.0));
  vec3 Vv = cameraPosition - vWP; float dist = max(length(Vv), 1e-3); vec3 V = Vv / dist;
  float ndv = abs(dot(n, V)), fogF = 0.0;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  float veil = 1.0 - (1.0 - fogF) * exp(-dist / uVeil);
  #if PASS == 1
    vec3 col = texture2D(uRamp, vec2(clamp(vK.x, 0.0, 5.2) / 5.2, 0.5)).rgb;
    col *= mix(uLine, vec3(1.0), smoothstep(0.06, 0.42, ndv) * 0.8 + 0.2 * (1.0 - vK.y));
    // a teardrop is a lens: the sea, darker, stands in its upper half and the sky in its lower, round a bright core
    float sD = clamp(vK.z - 1.0, 0.0, 1.0);
    col *= mix(vec3(1.0), vec3(0.86, 0.95, 0.90) * mix(0.80, 1.10, smoothstep(0.30, 0.62, sD)) * (0.92 + 0.14 * ndv * ndv), vK.y);
    gl_FragColor = vec4(mix(col, vec3(1.0), veil), 1.0);
  #else
    vec3 R = reflect(-V, n);
    float fz = 1.0 - ndv, F = min(0.04 + 0.96 * fz * fz * fz, 0.5);
    float sd = max(dot(vec3(R.x, abs(R.y), R.z), uSunDir), 0.0);
    vec3 col = F * mix(uHor, uZen, smoothstep(0.0, 0.6, abs(R.y))) * 0.7;
    col += uGlint * pow(sd, 90.0) * vec3(1.0, 0.98, 0.94) * (0.25 + 0.75 * vK.y);
    gl_FragColor = vec4(col * (1.0 - veil), 1.0);
  #endif
}`;function St(){const e=[],s=[],h=[],b=(c,x,y,S,g)=>{const l=e.length/3;for(let n=0;n<g;n++){const a=n/g*Math.PI*2;e.push(Math.cos(a)*x,c,Math.sin(a)*x),s.push(y,S,Math.cos(a))}return l},v=(c,x,y)=>{for(let S=0;S<y;S++){const g=(S+1)%y;h.push(c+S,c+g,x+g,c+S,x+g,x+S)}},u=[[0,.11],[.012,.095],[.035,.085],[.08,.075],[.2,.062],[.45,.056],[.7,.05],[.9,.046],[1,.05]];let w=-1;for(const[c,x]of u){const y=b(-c,x,c,0,8);w>=0&&v(w,y,8),w=y}w=-1;for(let c=0;c<=13;c++){const x=c/13,y=Math.max(.03,.47*Math.pow(Math.sin(Math.PI*Math.pow(x,1.75)),.85))*(c===13?.02:1),S=b(-1.6*x,y,1+x,1,14);w>=0&&v(w,S,14),w=S}const p=new t.BufferGeometry;return p.setAttribute("position",new t.Float32BufferAttribute(e,3)),p.setAttribute("aD",new t.Float32BufferAttribute(s,3)),p.setIndex(h),p.computeVertexNormals(),p}const At=`
attribute vec4 aB;            // centre xyz, radius
uniform float uPix;
varying vec2 vUv; varying float vFade; varying float vDist;
#include <fog_pars_vertex>
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(aB.xyz, 1.0);
  float d = max(-mvPosition.z, 0.1), minR = 1.1 * uPix * d, r = max(aB.w, minR);
  vFade = clamp(aB.w / max(minR, 1e-4), 0.0, 1.0); vFade *= vFade; vUv = position.xy; vDist = d;
  mvPosition.xy += position.xy * r;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ft=`
uniform float uVeil; uniform vec3 uHor;
varying vec2 vUv; varying float vFade; varying float vDist;
#include <fog_pars_fragment>
void main() {
  float r = length(vUv);
  if (r > 1.0) discard;
  float fogF = 0.0;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  float k = vFade * (1.0 - fogF) * exp(-vDist / uVeil);
  float rim = smoothstep(0.5, 0.92, r) * (1.0 - smoothstep(0.92, 1.0, r));
  vec2 a = vUv - vec2(-0.36, 0.42), b = vUv - vec2(0.3, -0.38);
  float hi = exp(-dot(a, a) * 28.0) * 1.3 + exp(-dot(b, b) * 16.0) * 0.22;
  gl_FragColor = vec4(uHor * hi * k, 1.0 - 0.6 * rim * k);     // out = rgb + dst * a
}`;function Dt(e,s,h){const b=new Float32Array(s*4);let v=0;for(;v<s;){let c;const x=e.chance(.28);if(x){const n=e.sign(),a=n*_e.cx+e.range(-25,25),i=e.range(3,43),z=e.range(-29,29);if(n>0&&Math.hypot(a-N.x,i-N.y)<18)continue;c=[a,i,z]}else{const n=e.range(-.96,.96),a=e.range(.12,.85),i=Ne(n),z=ke(n);if(c=[z[0]+(i[0]-z[0])*a,z[1]+(i[1]-z[1])*a,e.range(-11,11)],c[1]<1)continue}const y=e.int(3,11),S=e.range(-.25,.25),g=e.range(-.25,.25);let l=e.range(.1,.34);for(let n=0;n<y&&v<s;n++,v++){const a=x?_e.top-3:O*(1-c[0]/I*(c[0]/I))-1.5;if(c[1]>a-l){n===0&&v--;break}b.set([c[0],c[1],c[2],l],v*4),c=[c[0]+S*l*5+e.range(-.1,.1),c[1]+l*e.range(2.6,4.2),c[2]+g*l*5+e.range(-.1,.1)],l=Math.max(.045,l*e.range(.7,.95))}}const u=new t.InstancedBufferGeometry;u.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),u.setIndex([0,1,2,0,2,3]),u.setAttribute("aB",new t.InstancedBufferAttribute(b,4)),u.instanceCount=s;const w=new t.ShaderMaterial({uniforms:h,vertexShader:At,fragmentShader:Ft,fog:!0,transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.OneFactor,blendDst:t.SrcAlphaFactor}),p=new t.Mesh(u,w);return p.frustumCulled=!1,p}const Pe=2*O/I,tt=e=>{const s=Math.abs(e)*Pe;return Math.sign(e)*(I/2)*(Math.abs(e)*Math.sqrt(1+s*s)+Math.asinh(s)/Pe)},Ge=tt(1);function Ct(e){let s=Math.max(-1.1,Math.min(1.1,e/Ge));for(let h=0;h<6;h++)s-=(tt(s)-e)/(I*Math.sqrt(1+Pe*Pe*s*s));return s}const Vt=e=>{const s=Math.hypot(I,2*O*e);return{x:I*e,y:O*(1-e*e),tx:I/s,ty:-2*O*e/s}},Ie=e=>(e.blendSrcAlpha=t.ZeroFactor,e.blendDstAlpha=t.OneFactor,e);async function Et(e,s={}){const h=e.rng.fork("weight-of-glass-hero"),b=s.palette&&s.palette.length>=7?s.palette:ft,v=!!s.preview,u=Math.max(.6,Math.min(1,s.detail??e.quality?.detail??1)),w=u>=.8,p=9,c=w?p*4+4:p+4,x=new t.Group;x.name="weight-of-glass:span";const y=s.glass??h.pick(["clear","clear","clear","smoke","deep"]),S=y==="deep"?.85:h.range(.42,.58),g=y==="smoke"?new t.Vector3(.0075,.007,.0065):new t.Vector3(.012,.004,.009).multiplyScalar(S),l=h.range(-.25,.25),n=s.lightDir?new t.Vector3().copy(s.lightDir).normalize():new t.Vector3(Math.sin(.62+l)*.766,.643,-Math.cos(.62+l)*.766).normalize(),a=t.UniformsUtils.merge([t.UniformsLib.fog,{uLoads:{value:Array.from({length:c},()=>new t.Vector4(0,-50,0,0))},uLoadDir:{value:Array.from({length:c},()=>new t.Vector4(0,-1,0,1))},uOcu:{value:1},uArr:{value:s.load==="giant"?6:2},uBendW:{value:22},uBendK:{value:.26},uReach:{value:new t.Vector2(22,32)},uTime:{value:0},uTravel:{value:0},uMist:{value:0},uGraze:{value:.35},uPix:{value:.0012},uVeil:{value:1600},uGlint:{value:1.6},uAbs:{value:g},uSunDir:{value:n},uZen:{value:U("#BDBCBD")},uHor:{value:U(b[0])},uVeilC:{value:U("#9E9EB0")},uPatch:{value:new t.Vector3(.02,.019,.016)},uMistC:{value:U("#D2D1CE")},uVeilAmt:{value:1},uSand:{value:U("#958F86")},uDeep:{value:U("#6C7F84")},uRefr:{value:s.refraction===!1?0:1},uLine:{value:U(y==="smoke"?"#34383C":"#3C4A48")},uDark:{value:U(b[6])}}]);a.uRamp={value:ht(b)};const i=dt();vt(i,256),await e.yield?.(),Je(i,-1,1,!1),Je(i,1,2,!0);const z=i.build();z.boundingSphere=new t.Sphere(new t.Vector3(0,45,0),200);const P=wt(a,c).map(Ie),o=P.slice(0,3).map((r,k)=>{const F=new t.Mesh(z,r);return F.renderOrder=[10,11,20][k],x.add(F),F});await e.yield?.();const m=bt(h.fork("walker")),d=new Float32Array(p*2);m.setAttribute("aI",new t.InstancedBufferAttribute(d,2));const f=new t.ShaderMaterial({uniforms:a,vertexShader:Mt,fragmentShader:zt,fog:!0,side:t.DoubleSide}),M=new t.InstancedMesh(m,f,p);M.frustumCulled=!1,M.instanceMatrix.setUsage(t.DynamicDrawUsage),x.add(M);const C=s.load??"nine",_=40,V=p*_,B=[],$=s.herd==="even"?0:h.range(0,5);for(let r=0;r<p;r++){B.push({off:r*_+(r?h.range(-$,$):0),sc:r?h.range(.9,1.1):1,ph:h.range(0,1),s:0,w:0,pos:new t.Vector3,pads:[]}),d[r*2]=B[r].ph,C==="clump"&&(B[r].off=r*24.5+(r?h.range(-1,1):0),B[r].gone=r>4),C==="giant"&&(B[r].gone=r!==1,B[r].sc=2.5,r===1&&(B[r].off=37.3,B[r].gain=2.5));for(let k=0;k<4;k++)B[r].pads.push([0,0,0,0])}const Q=125,pe=-87.3,me=pe-.4*Q+V;B[0].ph=d[0]=.035-(me+(s.padBeat??.4)*Q)/H%1+1;const te=St(),ae=s.drops??h.int(36,44),j=new t.InstancedBufferGeometry().copy(te);j.instanceCount=ae;const ce=new Float32Array(ae*4),fe=new Float32Array(ae*4),He=[];for(let r=0,k=0;r<ae&&k<2e3;k++){const F=h.range(-.74,.74),D=ke(F),T=h.range(-10.5,10.5),G=h.range(6,14),ve=-73+.23*T;Math.abs(D[0]-ve)<9.5||D[1]-G<5||He.some(se=>Math.hypot(se[0]-D[0],se[1]-T)<5)||(He.push([D[0],T]),ce.set([D[0],D[1]+.15,T,G],r*4),fe.set([Math.sqrt(9.8/G)*h.range(.9,1.1),h.range(0,6.28),h.range(.12,.26),h.range(0,6.28)],r*4),r++)}[[-62,-2,13,.15,.4],[-60,7.5,12,.13,2.1],[-58,2.5,13,.14,4]].forEach(([r,k,F,D,T],G)=>{G>=ae||(ce.set([r,Qe*(1-r/Re*(r/Re))+.15,k,F],G*4),fe.set([Math.sqrt(9.8/F),T,D,1.2+G],G*4))}),j.setAttribute("aI0",new t.InstancedBufferAttribute(ce,4)),j.setAttribute("aI1",new t.InstancedBufferAttribute(fe,4));const Te=[1,2].map(r=>{const k=new t.ShaderMaterial({uniforms:a,vertexShader:kt,fragmentShader:Pt,fog:!0,defines:{PASS:r},transparent:!0,depthWrite:!1});return r===1?(k.blending=t.CustomBlending,k.blendSrc=t.DstColorFactor,k.blendDst=t.ZeroFactor,Ie(k)):k.blending=t.AdditiveBlending,k}),Bt=Te.map((r,k)=>{const F=new t.Mesh(j,r);return F.frustumCulled=!1,F.renderOrder=k?21:12,x.add(F),F}),Se=Dt(h.fork("bubbles"),Math.round(600*u),a);Ie(Se.material),Se.renderOrder=15,x.add(Se),await e.yield?.();const qe=()=>{const r=new t.Group;r.scale.y=-1,r.name="weight-of-glass:reflection";const k=new t.Mesh(z,P[3]);k.renderOrder=2;const F=new t.InstancedMesh(m,f,p);F.instanceMatrix=M.instanceMatrix,F.frustumCulled=!1;const D=new t.Mesh(j,Te[0]);return D.frustumCulled=!1,D.renderOrder=3,r.add(k,F,D),r};let Ae=null;(s.reflection??v)&&(Ae=qe(),x.add(Ae));let Fe=-1,oe=0,De=-1,Oe=0,Ke=-1,Ce=-1,Ue=0;const Be=new t.Vector4,je=new t.Matrix4,Le=new t.Vector3,Ze=new t.Vector3,at=new t.Vector3(0,0,1),ot=new t.Vector2,xe=(r,k,F)=>{const D=Math.min(1,Math.max(0,(F-r)/(k-r)));return D*D*(3-2*D)},he=(r,k,F,D,T,G,ve,se,be)=>{a.uLoads.value[r].set(k,F,D,T),a.uLoadDir.value[r].set(G,ve,se,be)},ge={x:0,y:0,tx:1,ty:0},X=[0,0,0],Ye=r=>{const k=Ct(r),F=Math.hypot(I,2*O*k);return ge.x=I*k,ge.y=O*(1-k*k),ge.tx=I/F,ge.ty=-2*O*k/F,ge},nt=r=>{if(r<.62)X[0]=(.31-r)*H,X[1]=0,X[2]=xe(0,.12,r)*(1-xe(.5,.62,r));else{const k=(r-.62)/.38;X[0]=H*.31*(-1+2*xe(0,1,k)),X[1]=Math.sin(Math.PI*k)*1.5,X[2]=0}};function $e(r){const k=Fe>=0?Fe*Q:r*3,F=(me+k)%V;a.uTravel.value=F;let D=0,T=0,G=0,ve=0;for(let E=0;E<p;E++){const L=B[E],re=E===Ce?Ue:0;let K=(pe+(L.gain??1)*(k-.4*Q)+L.off-re)%V;K<-V/2&&(K+=V),K>=V/2&&(K-=V);const W=L.gone?0:1-xe(Ge-11*L.sc,Ge-1,Math.abs(K)),J=L.sc*Math.max(W,.001),q=Ye(K),Z=q.x,ie=q.y,le=q.tx,Me=q.ty,it=E===De?oe:0;Le.set(le,Me,0),Ze.set(-Me,le,0),je.makeBasis(Le,Ze,at).scale(Le.set(J,J*(1-.16*it),J)).setPosition(Z,ie,0),M.setMatrixAt(E,je),L.s=K,L.pos.set(Z,ie,0),L.w=W;const lt=F/H+L.ph-re/H;let ye=0;E===Ce&&d[E*2]!==L.ph-re/H&&(d[E*2]=L.ph-re/H,m.attributes.aI.needsUpdate=!0);for(let ee=0;ee<4;ee++){nt(((lt+we[ee][2])%1+1)%1);const ue=Ye(K+J*(we[ee][0]+X[0])),ct=1+.2*Math.sin(r*1.6+E*2.4+ee*1.7),Ee=.62*X[2]*W*Math.min(L.sc*L.sc,C==="giant"?2.5:3.7)*ct;ye+=Ee;const ze=L.pads[ee];ze[0]=ue.x,ze[1]=ue.y,ze[2]=J*we[ee][1],ze[3]=Ee,w&&he(D++,ue.x,ue.y,J*we[ee][1],Ee,ue.ty,-ue.tx,0,1)}w||he(D++,Z,ie,0,ye*.6,Me,-le,0,1),E===De&&(Be.set(Z,ie,0,0),Oe=Me,Ke=-le),Z<0?T+=ye:G+=ye,ve+=ye*xe(20,90,Z)}if(M.instanceMatrix.needsUpdate=!0,oe>0){const E=oe*oe*(3-2*oe),L=a.uLoads.value;let re=0;for(let W=0;W<D;W++){const J=w?(W%4-1.5)*1.6:0;L[W].x+=(Be.x+J-L[W].x)*E,L[W].y+=(Be.y-L[W].y)*E,L[W].z*=1-.7*E,re+=L[W].w;const q=a.uLoadDir.value[W],Z=q.x+(Oe-q.x)*E,ie=q.y+(Ke-q.y)*E,le=Math.hypot(Z,ie)||1;q.x=Z/le,q.y=ie/le}const K=1+(1.3*(1+.13*Math.sin(r*2.1)+.05*Math.sin(r*3.4+1))/Math.max(re,.5)-1)*E;for(let W=0;W<D;W++)L[W].w*=K;a.uReach.value.x=22+34*E,a.uGraze.value=.35*(1-E)}else a.uGraze.value=.35,a.uReach.value.x=C==="giant"?50:C==="clump"?25:22;const se=.75+.045*T,be=.75+.045*G;he(D++,-118,-3,0,se,.5625,.8268,0,0),he(D++,118,-3,0,be,-.5625,.8268,0,0),he(D++,-123,4,0,se*1.25,-.94,.34,0,0),he(D++,123,4,0,be*1.25,.94,.34,0,0),a.uOcu.value=.7+.22*ve}const A=(r,k,F)=>new t.Vector3(r,k,F),st=[A(-104,9,-186),A(-91,11,-136),A(-85.5,15.5,-88),A(-82.5,21,-40),A(-76,24,-13),A(-70,30,13),A(-64,44,22),A(-51,62,24),A(-34,78,24),A(-17,98,22),A(-4.2,104,9),A(4.2,104,-9),A(22.9,80,-50.5),A(41.5,56,-92),A(60.2,36,-133.4),A(82.2,26,-148.9),A(109,22,-151.2),A(133.4,21.5,-139.8),A(148.9,23,-117.8),A(152,24,-100),A(152,24,-66),A(152,24,-33),A(152,24,0)],rt={portalSeat:{position:A(N.x,N.y,0),facing:A(0,0,-1),radius:7},flyThrough:st,entry:A(-104,9,-186),crown:A(0,O,0),oculus:A(N.x,N.y,0),underPass:A(-73,26,0),springings:[A(-118,0,0),A(118,0,0)],viewpoints:{entry:A(-104,9,-186),underHaunch:A(-73,26,0),flank:A(-40,72,24),crown:A(0,104,0),eyeAndOculus:A(137,30,-106),rim:A(152,24,-30)}};let de=null;if(v){de=new t.Mesh(new t.SphereGeometry(2600,32,16),new t.ShaderMaterial({side:t.BackSide,depthWrite:!1,depthTest:!1,fog:!1,uniforms:{uSunDir:a.uSunDir,uZen:a.uZen,uHor:a.uHor,uVeilC:{value:U("#A9A9B6")}},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform vec3 uSunDir, uZen, uHor, uVeilC; varying vec3 vD;
        void main(){ vec3 d = normalize(vD); float y = abs(d.y);
          vec3 c = mix(uHor, uZen, smoothstep(0.0, 0.6, y));
          float s = max(dot(vec3(d.x, y, d.z), uSunDir), 0.0); c += vec3(0.018, 0.017, 0.015) * s * s * s;
          float az = smoothstep(-0.25, 0.75, d.z / max(length(d.xz), 1e-3));
          c = mix(c, uVeilC, 0.92 * az * (1.0 - smoothstep(0.02, 0.21, y)));
          gl_FragColor = vec4(c, 1.0); }`})),de.renderOrder=-.5,de.frustumCulled=!1,x.add(de);const r=new t.Mesh(new t.CircleGeometry(2500,48),new t.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!1,uniforms:{uTime:a.uTime,uHor:a.uHor},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform float uTime; uniform vec3 uHor; varying vec3 vW;
        void main(){ vec3 V = cameraPosition - vW; float d = max(length(V), 1e-3); float up = clamp(abs(V.y) / d, 0.0, 1.0);
          float rip = sin(vW.x * 0.9 + 1.7 * sin(vW.z * 0.23) + uTime * 0.25) * sin(vW.z * 1.1 + 1.3 * sin(vW.x * 0.19)) * exp(-d / 160.0);
          vec3 sand = uHor * (0.60 + 0.045 * rip);
          float a = mix(0.16, 0.86, smoothstep(0.03, 0.55, up));
          gl_FragColor = vec4(sand, a); }`}));r.rotation.x=-Math.PI/2,r.renderOrder=5,x.add(r)}$e(0);const ne=Array.isArray(s.focus)?s.focus:[],Ve=ne.length===5&&ne.every(Number.isFinite);return{object:x,radius:Ve?ne[3]:185,height:Ve?ne[4]:O+9,center:Ve?new t.Vector3(ne[0],ne[1],ne[2]):new t.Vector3(0,46,0),anchors:rt,ground:!v,groundY:0,uniforms:a,herd:B,loads:a.uLoads.value,makeReflection:qe,reflection:Ae,setProgress(r){Fe=Math.min(1.2,Math.max(0,r))},setPool(r,k=1,F=0){oe=Math.min(1,Math.max(0,r)),De=oe>0?k:-1,Ce=k,Ue=F},walkerGeometry:m,walkerMaterial:f,loadKind:C,update(r,k,F){if(a.uTime.value=k,F&&F.isPerspectiveCamera){const D=e.renderer?.getDrawingBufferSize?e.renderer.getDrawingBufferSize(ot).y:1080;a.uPix.value=2*Math.tan(F.fov*Math.PI/360)/Math.max(D,200)}de&&F&&de.position.setFromMatrixPosition(F.matrixWorld).sub(x.position),$e(k)},dispose(){a.uRamp.value.dispose()}}}export{we as HIPS,mt as SEA_BARS_GLSL,H as STRIDE,xt as VEIL_GLSL,Et as buildHero,Lt as gait};
