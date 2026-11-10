import*as i from"three";import{clamp as be,smoothstep as Y}from"../kit/core.js";const et=["#F4B8C4","#F0B254","#2FA7A0","#F7F1E6","#5A3F52","#C4472E","#12494E"],ke=Math.PI*2;function He(n,a,v,o,c){const d=c*c,r=d*c;return(2*r-3*d+1)*n+(r-2*d+c)*a+(-2*r+3*d)*v+(r-d)*o}const We=30*Math.PI/180;function qe(n,a,v,o){const c=n.turns*ke,d=.62*n.R,r=n.turnsFull*ke,f=3;let y=n.zc,s=1.55*n.R;v[o*2]=y,v[o*2+1]=s;for(let e=1;e<a;e++){for(let p=0;p<f;p++){const b=(e-1+(p+.5)/f)/(a-1)*c,R=b/3.3161,k=(.26+.1*n.lobe)*(1-.6*b/r)+(.74+.3*n.lobe)*Math.exp(-R*R*R),w=We-b,L=d*k*c/((a-1)*f);y+=Math.cos(w)*L*(1.3+n.lean),s+=Math.sin(w)*L}v[(o+e)*2]=y,v[(o+e)*2+1]=s}}function tt(n,a,v,o){qe(n,v,o,a);const c=o[a*2],d=o[a*2+1],r=Math.cos(We),f=Math.sin(We),y=-n.Zb,s=c-y,e=s*1.2;for(let p=0;p<a;p++){const b=p/a,R=Math.pow(b,.8);o[p*2]=He(y,e,c,r*e*.9,R),o[p*2+1]=He(0,0,d,f*e*.9,R)}}function at(n,a,v){const o=n.length/2-1,c=be(a,0,1)*o,d=Math.min(o-1,Math.floor(c)),r=c-d;for(let f=0;f<2;f++){const y=n[Math.max(0,d-1)*2+f],s=n[d*2+f],e=n[(d+1)*2+f],p=n[Math.min(o,d+2)*2+f];v[f]=.5*(2*s+(e-y)*r+(2*y-5*s+4*e-p)*r*r+(3*s-y-3*e+p)*r*r*r)}return v}function Ue(n,a,v){const o=n.R,c=n.zc,d=n.trough,r=[n.Zf,0,c+Math.max(3.9*o,n.Zf*.6),-.1*d,c+2.9*o,-.55*d,c+2.1*o,-.95*d,c+1.35*o,-.9*d,c+.72*o,-.12*o,c+.26*o,.42*o,c-.03*o,.84*o,c-.09*o,1.2*o,c-.04*o,1.46*o,c+.16*o,1.595*o],f=[0,0];for(let y=0;y<a;y++){const s=y/(a-1),e=s<.25?s*1.2:.3+(s-.25)*(.7/.75);at(r,e,f),v[y*2]=f[0],v[y*2+1]=f[1]}}function Oe(n,a){const v=n.noise,o=a.nOff;return function(d,r={}){const f=a.L*.5-Math.abs(d),y=Y(0,a.taper*(d<0?a.taperSkew:2-a.taperSkew),f),s=v.n2(d/150+o,3.1),e=v.n2(d/41+o,9.7),p=v.n2(d/290+o,17.3);r.tp=y,r.R=a.R0*(.05+.95*y)*(1+.2*s+.03*e)*(.9+.16*Math.sin(d/a.L*5.1+a.nOff))*a.scale,r.zc=(24*p+7*v.n2(d/70+o,23.9))*a.scale+a.skew*d,r.yc=.72*r.R,r.turnsFull=a.turns;const b=Y(0,a.taper*1.9,f);r.turns=(a.turns+.1*v.n2(d/210+o,31.3))*(.07+.93*b*b*(3-2*b)),r.tight=.72+.05*v.n2(d/120+o,41.9),r.lean=.22+.1*s;const R=1-Math.abs(v.n2(d/105+o,57.1)*.75+v.n2(d/37+o,77.7)*.25);return r.lobe=.1+.3*R*R,r.trough=.5*r.R,r.Zb=a.Zb,r.Zf=a.Zf,r}}async function Ze(n,a,v,o,c,d,r){const f=c+d,y=f+r,s=(o+1)*y,e=new Float32Array(s*3),p=new Float32Array(s*3),b=new Float32Array(s*4),R=new Float32Array(s*2),k=new Float32Array(f*2),w=new Float32Array(r*2),L={};for(let C=0;C<=o;C++){const U=-a.L/2+C/o*a.L;v(U,L),tt(L,c,d,k),Ue(L,r,w);const ue=Y(0,45,a.L/2-Math.abs(U));let F=0,N=0;for(let u=1;u<=c;u++)N+=Math.hypot(k[u*2]-k[u*2-2],k[u*2+1]-k[u*2-1]);for(let u=0;u<f;u++){const I=C*y+u;u>0&&(F+=Math.hypot(k[u*2]-k[u*2-2],k[u*2+1]-k[u*2-1])),e[I*3]=U,e[I*3+1]=k[u*2+1],e[I*3+2]=k[u*2];const Q=u<c?0:(u-c)/(d-1),P=Q*L.turns*360;b[I*4]=u<c?1-Y(.15,.7,u/c):0,b[I*4+1]=u<c?Y(0,.3,u/c)*(u<c*.72?ue:1):1,b[I*4+2]=Math.max(Math.exp(-Math.pow((P-205)/75,2))*Y(60,150,L.turns*360),u<c?0:.5*Math.exp(-Math.pow((P-48)/28,2)),Y(.9,1,Q)*(1-Y(190,330,L.turns*360))),b[I*4+3]=1-Y(2,12,Math.abs(u-c-2)),R[I*2]=F-N,R[I*2+1]=Y(290,470,P)}F=0;for(let u=0;u<r;u++){const I=C*y+f+u,Q=u/(r-1);u>0&&(F+=Math.hypot(w[u*2]-w[u*2-2],w[u*2+1]-w[u*2-1])),e[I*3]=U,e[I*3+1]=w[u*2+1],e[I*3+2]=w[u*2],b[I*4]=1-Y(.08,.27,Q),b[I*4+1]=Y(0,.07,Q)*(Q<.2?ue:1),b[I*4+2]=0,b[I*4+3]=2+Y(.7,.95,Q),R[I*2]=F,R[I*2+1]=Y(.62,.97,Q)*.4}C%10===9&&await n.yield()}const q=(C,U,ue)=>e[(C*y+U)*3+ue];for(let C=0;C<=o;C++){const U=Math.max(0,C-1),ue=Math.min(o,C+1);for(let F=0;F<y;F++){const N=F>=f,u=N?f:0,I=N?y-1:f-1,Q=Math.max(u,F-1),P=Math.min(I,F+1),se=q(C,P,0)-q(C,Q,0),xe=q(C,P,1)-q(C,Q,1),_e=q(C,P,2)-q(C,Q,2),ne=q(ue,F,0)-q(U,F,0),Ie=q(ue,F,1)-q(U,F,1),re=q(ue,F,2)-q(U,F,2);let me=xe*re-_e*Ie,X=_e*ne-se*re,Te=se*Ie-xe*ne;const Me=Math.hypot(me,X,Te),Le=(N?-1:1)/(Me>1e-9?Me:1),ze=(C*y+F)*3;Me>1e-9?(p[ze]=me*Le,p[ze+1]=X*Le,p[ze+2]=Te*Le):p[ze+1]=1}C%16===15&&await n.yield()}const _=[],Ce=[];for(let C=0;C<o;C++)for(let U=0;U<y-1;U++){if(U===f-1)continue;const ue=U>=f,F=C*y+U,N=F+1,u=F+y,I=u+1,Q=Math.max(b[F*4],b[N*4])>1e-4?Ce:_;ue?Q.push(F,u,N,N,u,I):Q.push(F,N,u,N,I,u)}const ce=new i.BufferGeometry;return ce.setAttribute("position",new i.BufferAttribute(e,3)),ce.setAttribute("normal",new i.BufferAttribute(p,3)),ce.setAttribute("aM",new i.BufferAttribute(b,4)),ce.setAttribute("aSD",new i.BufferAttribute(R,2)),ce.setIndex(_.concat(Ce)),ce.addGroup(0,_.length,0),ce.addGroup(_.length,Ce.length,1),ce.boundingSphere=new i.Sphere(new i.Vector3(0,30,0),Math.hypot(a.L/2,Math.max(a.Zb,a.Zf))+60),ce}const Ge=`
float c3aSwell(vec2 p, float t){
  return 2.2*sin(0.011*p.x+0.017*p.y+0.31*t)+1.4*sin(-0.023*p.x+0.009*p.y+0.43*t+1.3)+0.8*sin(0.017*p.x+0.041*p.y+0.6*t+4.1);
}`;function Qe(n,a,v){return 2.2*Math.sin(.011*n+.017*a+.31*v)+1.4*Math.sin(-.023*n+.009*a+.43*v+1.3)+.8*Math.sin(.017*n+.041*a+.6*v+4.1)}const Ye=`
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y); }
float fb(vec2 p){ return vn(p)*0.55+vn(p*2.13+7.7)*0.3+vn(p*4.31+3.1)*0.15; }
`,ht=`
vec2 c3aSwellG(vec2 p, float t){
  float a = cos(0.011*p.x+0.017*p.y+0.31*t), b = cos(-0.023*p.x+0.009*p.y+0.43*t+1.3), c = cos(0.017*p.x+0.041*p.y+0.6*t+4.1);
  return vec2(0.0242*a - 0.0322*b + 0.0136*c, 0.0374*a + 0.0126*b + 0.0328*c);
}
float c3aChop(vec2 p, float t, float fine){
  return 2.6*vn(p*0.021 + vec2(0.05*t, -0.03*t)) + 1.1*vn(p*0.058 + vec2(-0.07*t, 0.06*t) + 5.0) + 0.36*fine*vn(p*0.21 + vec2(0.13*t, 0.09*t) + 11.0);
}
// x = distance to the nearest cell wall (0 on the wall), y = hash of the cell, zw = offset to the cell's heart
vec4 c3aCells(vec2 p){
  vec2 ci = floor(p), cf = fract(p); float d1 = 8.0, d2 = 8.0, h1 = 0.0; vec2 o1 = vec2(0.0);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)); float h = h21(ci + g);
    vec2 o = g + 0.04 + 0.92*vec2(h, fract(h*7.13 + 0.31)) - cf; float d = dot(o, o);
    if (d < d1) { d2 = d1; d1 = d; o1 = o; h1 = h; } else if (d < d2) { d2 = d; }
  }
  return vec4(sqrt(d2 + 1e-6) - sqrt(d1 + 1e-6), h1, o1);
}`,ot=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aM; attribute vec2 aSD;
uniform float uTime; uniform float uRipple;
varying vec3 vW; varying vec3 vN; varying vec4 vM; varying vec3 vQ; varying float vH; varying float vCove;
${Ge}
void main(){
  vec3 p = position; vec3 n = normal;
  float ap = aM.x;
  float isFace = step(1.5, aM.w), pin = aM.w - 2.0*isFace;
  // aprons ride the swell; the roll breathes in long lobes that travel along it
  float sw = c3aSwell(p.xz, uTime);
  float lob = sin(p.x*0.021 + uTime*0.33 + aSD.x*0.012)*1.6 + sin(p.x*0.057 - uTime*0.47 + aSD.x*0.031)*0.7;
  p.y += sw * ap;
  p += n * lob * (1.0-ap) * uRipple * (1.0 - 0.6*aSD.y) * (1.0 - pin);
  vec4 wp = modelMatrix * vec4(p,1.0);
  vW = wp.xyz; vN = mat3(modelMatrix) * n; vM = aM; vQ = vec3(position.x, aSD.x, aSD.y); vH = position.y; vCove = isFace * pin;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,nt=`
#include <common>
#include <fog_pars_fragment>
uniform float uTime, uFlow, uSolid, uScale, uAlpha, uHideBack;
uniform vec3 uSunDir, uKey, uFill, uAmber, uRose, uCream, uPlum, uRust, uCeil;
varying vec3 vW; varying vec3 vN; varying vec4 vM; varying vec3 vQ; varying float vH; varying float vCove;
${Ye}
void main(){
  vec3 V = cameraPosition - vW; float vd = length(V); V /= max(vd, 1e-4);
  vec3 N = vN / max(length(vN), 1e-5);
  float front = gl_FrontFacing ? 1.0 : 0.0;
  if (front < 0.5) N = -N;
  float ap = clamp(vM.x, 0.0, 1.0), lip = clamp(vM.z, 0.0, 1.0), inner = clamp(vQ.z, 0.0, 1.0), edgeA = clamp(vM.y, 0.0, 1.0);   // held to their range: past a mesh edge a varying is extrapolated under multisampling
  // pattern space: x along the roll, s along the flow; everything slides toward and round the roll
  vec2 q = vec2(vQ.x, vQ.y - uFlow) / uScale;
  // soft satin wrinkles in the normal (cheap: slope of a stretched noise)
  float e = 1.5;
  float w0 = fb(q*vec2(0.045,0.016)), wx = fb((q+vec2(e,0.))*vec2(0.045,0.016)), wy = fb((q+vec2(0.,e*3.))*vec2(0.045,0.016));
  vec3 T = normalize(vec3(1.0,0.0,0.0) - N*N.x + vec3(1e-4,0.,0.));
  vec3 B = cross(N, T);
  N = N + (T*(w0-wx) + B*(w0-wy)*0.6) * 2.2; N /= max(length(N), 1e-4);
  vec3 L = uSunDir;
  float ndl = dot(N, L), ndv = max(dot(N, V), 0.0);
  float wrap = max(ndl*0.6+0.4, 0.0); wrap = wrap*wrap*(1.4 - 0.4*wrap);
  vec3 Hh = normalize(L + V + vec3(0.,1e-4,0.));
  float ndh = max(dot(N, Hh), 0.0), nh2 = ndh*ndh;
  float sheen = nh2*nh2*nh2 * 0.55 + pow(max(ndh, 1e-4), 60.0) * 0.5;      // a broad satin band, a small core
  float fr = 1.0 - ndv; fr = fr*fr*(0.35+0.65*fr);
  // body colour: honey gold, deeper and rosier in the troughs and inside the scroll
  float bands = fb(q*vec2(0.012,0.004) + 3.7);                   // long streaks of denser gas climbing the face
  float fine = fb(q*vec2(0.21,0.035));
  vec3 deep = mix(uAmber*vec3(0.62,0.42,0.34), uPlum, 0.22);
  float streak = fb(q*vec2(0.11,0.0065) + 1.3);
  float surge = fb(vec2(q.x*0.009, q.y*0.038) + 8.1);                 // pulses of denser gas carried up the face and over
  vec3 body = mix(deep, uAmber, clamp(0.12 + 0.6*smoothstep(-38.0, 70.0, vH) + (bands-0.5)*0.7 + (streak-0.5)*0.5 + (surge-0.5)*0.75 + (fine-0.5)*0.2, 0.0, 1.0));
  body = mix(body, body*body*vec3(1.9,1.7,1.5), ndv*ndv*0.45);          // glassy: looking straight in, the gas is deeper
  body = mix(body, uRust*0.9, smoothstep(0.62,0.9,bands)*0.22*(1.0-ap));
  // glitter: mineral scum gathered into wind-rows at three scales, cells twinkle; averaged before they alias
  float r1 = smoothstep(0.56,0.74, vn(vec2(q.x*0.021 + 0.5*vn(q*vec2(0.01,0.006)), q.y*0.011)));
  float r2 = smoothstep(0.55,0.78, vn(vec2(q.x*0.085 + 0.8*vn(q*vec2(0.02,0.011)), q.y*0.027 + 5.0)));
  float r3 = smoothstep(0.5,0.8, vn(vec2(q.x*0.36 + vn(q*vec2(0.05,0.03)), q.y*0.07 + 9.0)));
  float rows = clamp(r1*0.55 + r2*(0.35+0.45*r1) + r3*0.3*(0.4+r2), 0.0, 1.0);
  rows = clamp(rows + smoothstep(150.0, 250.0, vQ.x) * (0.28 + 0.45*r2 + 0.3*r3), 0.0, 1.0);   // toward the trough exit the rows crowd together: the slope there is a streaming skin
  vec2 gc = q*vec2(3.1,1.05); vec2 fwq = fwidth(gc);
  float aa = 1.0 - smoothstep(0.22, 0.55, max(fwq.x, fwq.y));
  vec2 ci = floor(gc), cf = fract(gc)-0.5; float hc = h21(ci);
  float tw = 0.5+0.5*sin(uTime*(1.5+hc*3.0) + hc*40.0 + dot(V.xz, vec2(23.0,13.0)));
  float dust = step(1.0 - 0.5*rows, hc) * (1.0 - smoothstep(0.1, 0.36, length(cf*vec2(1.0,0.7)))) * (0.25+0.75*tw*tw);
  // right under the lens the dust is drawn in a finer grain, so no fleck ever grows into a white oval
  float nearF = smoothstep(7.0, 26.0, vd);
  vec2 gcf = q*vec2(9.3,3.3), cff = fract(gcf)-0.5; float hf = h21(floor(gcf)+3.0);
  float dustF = step(1.0 - 0.5*rows, hf) * (1.0 - smoothstep(0.1, 0.36, length(cff*vec2(1.0,0.7)))) * (0.3+0.7*tw) * (1.0 - nearF) * smoothstep(2.0, 5.0, vd);
  dust = dust*nearF + dustF;
  vec2 gc2 = q*vec2(0.47,0.33); vec2 c2 = fract(gc2)-0.5; float h2 = h21(floor(gc2)+11.0);
  float aa2 = 1.0 - smoothstep(0.1, 0.3, max(fwq.x, fwq.y)*0.2);
  float coin = step(0.955 - 0.12*rows, h2) * (1.0 - smoothstep(0.05, 0.1, length(c2 + (vec2(h2, fract(h2*7.3))-0.5)*0.5)));
  float glit = mix(0.13*rows, dust*1.5, aa) * (0.3+0.7*rows) + coin*aa2*(0.7+0.9*tw);
  // light
  vec3 lit = body * (uKey*wrap + uFill*(0.5+0.5*N.y)*0.55 + uFill*0.18);
  lit += uKey * sheen * (0.35+0.65*front) * vec3(1.0,0.8,0.5) * 0.34;
  lit = mix(lit, uRose*(uFill*0.9+uKey*0.35), fr*0.27*front);       // the rose air mirrored at grazing angles
  lit += uCream*vec3(1.0,0.93,0.78) * glit * (uKey*(0.35+0.65*wrap) + uFill*0.3) * 0.9 * front;
  // thin places let the sun through: lip and crest glow hot gold against the light
  float thru = max(dot(-V, L), 0.0); thru = thru*thru;
  float thin = max(lip, 0.0); float thin4 = thin*thin; thin4 *= thin4;
  lit += uAmber*vec3(1.25,0.74,0.36) * uKey * (thin*0.3 + thin4*0.9) * (0.18 + 1.6*thru + 0.4*fr);
  float crest = smoothstep(0.991, 1.0, thin + (fine-0.5)*0.012);
  crest *= 1.0 - smoothstep(0.003, 0.009, fwidth(lip));               // the meniscus is a band of the last hundredth of the lip: where that is thinner than a pixel it is left out, never drawn as a dashed line
  lit += uCream * crest * (0.35 + 0.9*thru + 0.35*wrap);            // cream meniscus riding the lip
  // the amber side (back faces): from underneath the sheet is a luminous ceiling, the sun smeared through it
  float sOut = max(dot(-N, L)*0.7+0.3, 0.0);
  vec3 ceilc = mix(uAmber*vec3(1.45,0.98,0.6), uRose, 0.16) * (0.34 + 1.3*sOut) * uKey * 1.2;
  ceilc *= (0.6 + 0.5*bands + 0.4*surge) * (1.0 - 0.45*rows);
  float th8 = thru*thru; th8 *= th8; th8 *= th8;
  ceilc += uAmber*vec3(1.7,1.15,0.6) * uKey * (thru*0.55 + th8*th8*2.6);
  ceilc = mix(deep*(uKey*0.5+uFill*0.6), ceilc, 0.3+0.7*ndv);
  float bk0 = 1.0 - front;
  float rimg = (1.0-ndv)*(1.0-ndv);
  ceilc = mix(ceilc, ceilc + uAmber*vec3(1.5,1.0,0.55)*uKey*0.25*rimg, bk0);   // seen from inside the amber the billows are glowing vaults, never dark slabs
  ceilc += uCream * crest * 0.6;
  float bk = 1.0 - front;                                               // from below: streaming strands and drifting coin glitter
  ceilc *= mix(1.0, 0.52 + 0.55*streak + 0.5*(fine-0.5) + 0.25*r2 + 0.3*r3, bk);
  ceilc += uCream*vec3(1.0,0.93,0.78) * (glit*1.3 + coin*aa2*0.8) * uKey * 0.9 * bk;
  lit = mix(ceilc, lit, front * (1.0 - 0.9*clamp(vCove, 0.0, 1.0)));     // the top of the face turns over into the glowing roof
  // occlusion inside the scroll: warm umber-rose, never grey
  lit *= mix(vec3(1.0), vec3(0.5,0.34,0.36), inner);
  lit += uAmber*vec3(0.9,0.5,0.25)*inner*0.3*uKey;                          // the barrel is lit by its own glowing roof
  // camera inside the amber (uHideBack 1): the underside is drawn exactly as the world draws the calm skin from below, a
  // luminous streaked ceiling that depends on the view and the place, so vault, belly and calm skin are one unbroken ceiling
  float underC = uHideBack * (1.0 - front);
  float postMul = 1.0;                                                  // the broad wind-rows, laid on after the haze exactly as the world lays them on its ceiling
  if (uHideBack > 0.5) {
    float wr = vn(vec2(vW.x*0.0035 + 3.0 + uTime*0.012, vW.z*0.022)), wr2 = vn(vec2(vW.x*0.011 + uTime*0.03, vW.z*0.06) + 9.0);
    float rowsM = (1.0 - smoothstep(500.0, 1300.0, vd)) * (0.6*(wr - 0.5) + 0.35*(wr2 - 0.5) + 0.25*smoothstep(0.6, 0.85, wr));
    // far billows of the train hang below the skin lost in the haze: they carry the same rows, so they never cut a flat bar out of the ceiling
    postMul = 1.0 + rowsM * mix(smoothstep(250.0, 650.0, vd), 1.0, 1.0 - front);
  }
  if (underC > 0.5) {
    #ifdef USE_FOG
    vec3 fc = fogColor;
    #else
    vec3 fc = uAmber;
    #endif
    float winC = smoothstep(0.25, 0.75, abs(V.y));
    float rowsC = smoothstep(0.45, 0.8, vn(vec2(vW.x*0.012 + vW.z*0.004, vW.z*0.09 + 0.3*vn(vW.xz*0.02)) + vec2(uTime*0.02, uTime*0.22)));
    vec3 cc = mix(fc*0.7 + uCeil*0.3, uCeil*1.25, winC) + vec3(1.0,0.9,0.7) * th8 * 1.1 * (0.7 + 0.3*sin(uTime*1.7 + vW.x*0.05));
    cc += vec3(1.0,0.95,0.85) * rowsC * 0.22 * winC;
    cc *= 1.0 + 0.13*sin(uTime*1.4 + vW.x*0.08 + vW.z*0.05);
    cc *= 0.82 + 0.36*rowsC + 0.2*(vn(vW.xz*vec2(0.004,0.03) + 7.0) - 0.5);
    cc += vec3(1.0,0.95,0.85) * rowsC * 0.1;
    cc *= 1.0 + 0.11*sin(0.045*vW.x + 0.07*vW.z + uTime*0.9)*sin(0.02*vW.z - 0.03*vW.x + uTime*0.6);
    float det = 1.0 - smoothstep(50.0, 260.0, vd);                       // close to: strands, surges and coin glitter sliding past
    cc *= mix(1.0, 0.56 + 0.5*streak + 0.5*(surge - 0.5) + 0.5*(bands - 0.5) + 0.35*(fine - 0.5) + 0.2*r2, det);
    float stC = smoothstep(0.28, 0.72, 0.5*streak + 0.3*fine + 0.2*bands);
    cc *= mix(vec3(1.0), mix(vec3(0.5,0.4,0.37), vec3(1.02,1.0,0.96), stC), det * (0.4 + 0.6*winC));
    float nearC = 1.0 - smoothstep(8.0, 52.0, vd);
    float mic = vn(vec2(vW.x*0.45 + uTime*0.5, vW.z*3.6))*0.62 + vn(vec2(vW.x*1.2 + uTime*0.9, vW.z*9.0))*0.38;
    cc *= mix(vec3(1.0), mix(vec3(0.66,0.55,0.5), vec3(1.04,1.01,0.96), smoothstep(0.2, 0.8, mic)), nearC*0.85);
    cc += uCream*vec3(1.0,0.93,0.78) * (glit*1.1 + coin*aa2*0.9) * det * 0.7;
    // the same coin glitter the world's calm skin carries, cell for cell, so it drifts on across the vault
    vec2 qc = vW.xz*1.1 + vec2(uTime*0.3, 0.0), cfc = fract(qc) - 0.5; float hsc = h21(floor(qc));
    cc += vec3(1.0,0.95,0.85) * step(0.8, hsc) * (0.5 + 0.5*sin(uTime*(2.0 + 3.0*hsc) + hsc*40.0)) * (1.0 - smoothstep(40.0, 190.0, vd)) * (1.0 - smoothstep(0.02, 0.16, dot(cfc, cfc))) * 1.85;
    lit = mix(fc, cc, mix(0.8, 0.93, winC));
  }
  float alpha = 1.0;
  if (uSolid < 0.5) {
    float a0 = mix(0.5, 0.97, 1.0 - ndv*ndv);
    a0 = mix(a0, 0.38, 1.0-front);                                     // thin from below, so the apron never reads as a slab
    alpha = mix(1.0, a0, smoothstep(0.0, 0.6, ap)) * edgeA * uAlpha;
    alpha = mix(alpha, edgeA * uAlpha, underC);
    alpha = clamp(max(alpha, clamp(glit, 0.0, 1.0)*edgeA*uAlpha), 0.0, 1.0);
  }
  gl_FragColor = vec4(lit, alpha);
  #include <fog_fragment>
  gl_FragColor.rgb *= postMul;
}`,rt=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aC; attribute vec2 aR0; attribute vec4 aPar; attribute vec2 aUV; attribute vec3 aRnd;
uniform float uTime;
varying vec2 vUV; varying float vLife; varying float vSeed; varying vec3 vW; varying float vThin;
vec3 filPoint(float p, float tau){
  float rho = max(length(aR0), 1.0); vec2 rh = aR0 / rho;
  float grow = smoothstep(0.0, 0.5, tau), back = smoothstep(0.62, 1.0, tau);
  float len = aPar.x * grow * (1.0 - 0.55*back);
  float a = 1.25*tau + len*p/rho;                       // carried round with the flow, clockwise in (z, y)
  float flick = sin(p*5.0 - uTime*0.9 + aRnd.z*20.0) * (0.8 + 3.6*p);
  float lift = aRnd.x * aPar.x * sqrt(max(grow, 1e-6)) * (1.0-back) * (0.3*p + 0.7*sin(p*2.9)) + flick*grow*(1.0-back) + 0.8;
  float ca = cos(a), sa = sin(a);
  vec2 r = vec2(rh.x*ca + rh.y*sa, -rh.x*sa + rh.y*ca) * (rho + lift);
  float x = aC.x + aRnd.y * len * p * (0.5 + 0.7*p) + sin(p*3.1 + uTime*0.6 + aRnd.z*40.0) * 1.5 * p;
  return vec3(x, aC.y + r.y, aC.z + r.x);
}
void main(){
  float tau = fract(uTime / aPar.y + aPar.z);
  float p = aUV.x;
  vec3 a = filPoint(p, tau), b = filPoint(p + 0.04, tau);
  vec4 wa = modelMatrix * vec4(a, 1.0), wb = modelMatrix * vec4(b, 1.0);
  vec3 tg = wb.xyz - wa.xyz; tg /= max(length(tg), 1e-4);
  vec3 toCam = cameraPosition - wa.xyz; float dist = length(toCam); toCam /= max(dist, 1e-4);
  vec3 side = cross(tg, toCam); side /= max(length(side), 1e-4);
  float born = smoothstep(0.0, 0.1, tau), die = 1.0 - smoothstep(0.6, 0.98, tau);
  float w = aPar.w * (1.0 - 0.8*pow(max(p, 1e-4), 0.6)) * born * (0.25 + 0.75*die);
  w = min(w, dist * 0.016);                             // never a broad strip when one streams past the lens: a ribbon is at most 3 percent of the picture wide
  w = max(w, dist * 0.0011);
  wa.xyz += side * aUV.y * w;
  vUV = aUV; vLife = born * die; vThin = mix(1.0, 0.5, smoothstep(2.4, 6.0, aPar.w)); vSeed = aRnd.z; vW = wa.xyz;
  vec4 mvPosition = viewMatrix * wa;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,it=`
#include <common>
#include <fog_pars_fragment>
uniform float uTime; uniform vec3 uSunDir, uKey, uFill, uAmber, uCream;
varying vec2 vUV; varying float vLife; varying float vSeed; varying vec3 vW; varying float vThin;
${Ye}
void main(){
  // with multisampling a varying is extrapolated past the ribbon's edge (the pixel centre lies outside it): everything read from one is held to its range
  float ac = min(abs(vUV.y), 1.0), p = clamp(vUV.x, 0.0, 1.0);
  // a ribbon thinner than a couple of pixels has no profile left to resolve: it is drawn evenly, so it stays a line and never breaks into dots
  float hair = smoothstep(0.6, 1.6, fwidth(vUV.y));
  float core = mix(1.0 - ac*ac, 0.66, hair);
  float wisp = 0.55 + 0.45*vn(vec2(p*9.0 - uTime*0.35 + vSeed*31.0, clamp(vUV.y, -1.0, 1.0)*1.5 + vSeed*7.0));
  float alpha = clamp(core * wisp * clamp(vLife, 0.0, 1.0) * smoothstep(0.0, 0.08, p) * (1.0 - smoothstep(0.6, 1.0, p)) * 0.8 * clamp(vThin, 0.0, 1.0), 0.0, 1.0);
  vec3 V = normalize(cameraPosition - vW + vec3(0.,1e-4,0.));
  float thru = max(dot(-V, uSunDir), 0.0); thru *= thru;
  vec3 col = uAmber * (uKey*(0.7 + 1.5*thru) + uFill*0.5) * (0.75 + 0.5*core);
  col = mix(col, uCream * (uKey*(0.85 + 1.1*thru) + uFill*0.3), clamp(smoothstep(0.35, 0.9, ac) * 0.85 * (1.0 - hair) + 0.45*p + 0.15, 0.0, 1.0));   // cream skin on the edges, tips pale
  gl_FragColor = vec4(col, alpha);
  #include <fog_fragment>
}`,st=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aInfo;                 // part (0 bell, 1 frill, 2 streamer, 3 ring on the skin), v along the part, angle
attribute vec4 aI; attribute vec3 aIN;  // per instance: phase, flow coordinate s, apron factor, spare; surface normal
uniform float uTime, uRipple;
varying vec3 vW; varying vec3 vN; varying vec3 vInfo; varying float vPulse; varying vec2 vL;
${Ge}
void main(){
  vec3 p = position; float part = aInfo.x, v = aInfo.y;
  float ph = uTime*1.5708 + aI.x*6.2832;
  float sp = 0.5+0.5*sin(ph); float pulse = sp*sp*sp;                 // one stroke in 4 s
  if (part < 0.5) { p.xz *= 1.0 - 0.17*pulse*smoothstep(0.2,1.0,v); p.y *= 1.0 + 0.12*pulse; }
  else if (part < 1.5) { p.y += sin(aInfo.z*7.0 + uTime*2.1 + aI.x*9.0)*0.09*v - 0.1*pulse*v; p.xz *= 1.0 - 0.12*pulse*v; }
  else if (part < 2.5) { float sw = v*v; p.x += sin(uTime*0.8 + aInfo.z*3.0 + aI.x*5.0 + v*3.0)*0.4*sw; p.z += cos(uTime*0.7 + aInfo.z*5.0 + v*2.6)*0.4*sw; p.xz *= 1.0 - 0.3*pulse*v; p.y *= 1.0 - 0.08*pulse; }
  vec4 ip = instanceMatrix * vec4(p, 1.0);
  float ix = instanceMatrix[3].x;
  float lob = sin(ix*0.021 + uTime*0.33 + aI.y*0.012)*1.6 + sin(ix*0.057 - uTime*0.47 + aI.y*0.031)*0.7;
  ip.xyz += aIN * lob * (1.0 - aI.z) * uRipple;
  ip.y += c3aSwell(instanceMatrix[3].xz, uTime) * aI.z;
  if (part < 2.5) ip.y += sin(uTime*0.7 + aI.x*17.0)*0.35 + 0.25*pulse;
  vec4 wp = modelMatrix * ip;
  vW = wp.xyz; vN = mat3(modelMatrix) * mat3(instanceMatrix) * normal; vInfo = aInfo; vPulse = pulse; vL = position.xz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,lt=`
#include <common>
#include <fog_pars_fragment>
uniform float uTime; uniform vec3 uSunDir, uKey, uFill, uAmber, uRose, uCream, uPlum, uRust;
varying vec3 vW; varying vec3 vN; varying vec3 vInfo; varying float vPulse; varying vec2 vL;
void main(){
  float part = vInfo.x, v = clamp(vInfo.y, 0.0, 1.0);
  vec3 V = normalize(cameraPosition - vW + vec3(0.,1e-4,0.));
  vec3 N = vN / max(length(vN), 1e-5); if (!gl_FrontFacing) N = -N;
  float ndv = abs(dot(N, V)), fr = 1.0 - ndv;
  float wrap = max(dot(N, uSunDir)*0.55+0.45, 0.0);
  float thru = max(dot(-V, uSunDir), 0.0); thru *= thru;
  vec3 col; float alpha;
  if (part < 0.5) {
    float rib = abs(sin(vInfo.z*6.0)); rib = 1.0 - rib*rib*rib*rib;          // twelve dark ribs
    float ribl = smoothstep(0.75, 1.0, rib) * smoothstep(0.06, 0.3, v);
    vec3 base = mix(uCream, uRose, smoothstep(0.0, 0.5, v));
    base = mix(base, uPlum*1.1 + uRose*0.25, ribl*0.75);
    base = mix(base, uAmber*1.5, smoothstep(0.72, 1.0, v)*0.6);                // the amber shines up into the mouth
    col = base * (uKey*(wrap + 0.9*thru) + uFill*0.7) + uCream*uKey*fr*fr*0.55;
    col += uCream * uKey * (1.0 - smoothstep(0.0, 0.12, v)) * 0.5;
    alpha = clamp(0.42 + 0.5*fr + 0.35*ribl + 0.3*(1.0 - smoothstep(0.0,0.15,v)), 0.0, 0.96);
  } else if (part < 1.5) {
    col = uCream * (uKey*(0.6+0.7*wrap) + uFill*0.4) * (1.0 + 0.5*v); alpha = 0.92;
  } else if (part < 2.5) {
    col = mix(uAmber*1.2, uRust, v) * (uKey*(0.5+0.5*wrap) + uFill*0.3); alpha = 0.85 * (1.0 - v*0.5);
  } else {
    float r = length(vL);                                                     // bright ring on the skin, breathing out with each stroke
    float r0 = 1.25 + 0.5*vPulse, r1 = 1.9 + 1.0*fract(uTime*0.25);
    float ring = (1.0 - smoothstep(0.0, 0.14, abs(r - r0))) + 0.45*(1.0 - smoothstep(0.0, 0.2, abs(r - r1)))*(1.0 - smoothstep(2.2, 2.9, r));
    col = uCream * uKey * 1.1; alpha = clamp(ring, 0.0, 1.0) * 0.7;
    if (alpha < 0.03) discard;
  }
  gl_FragColor = vec4(col, alpha);
  #include <fog_fragment>
}`;function ct(){const n=[],a=[],v=[],o=[],c=(s,e,p,b,R,k,w,L,q)=>{n.push(s,e,p);const _=Math.hypot(b,R,k)||1;return a.push(b/_,R/_,k/_),v.push(w,L,q),n.length/3-1};for(let s=0;s<=7;s++){const e=s/7,p=e*Math.PI*.5,b=Math.pow(Math.sin(p),.75)*(.86+.14*Y(.75,1,e)),R=.05+1.05*Math.pow(Math.cos(p),.9);for(let k=0;k<=24;k++){const w=k/24*ke,L=b*(1-.06*Math.pow(Math.abs(Math.sin(w*6)),.5)*Y(.1,.5,e));c(Math.cos(w)*L,R,Math.sin(w)*L,Math.cos(w)*Math.sin(p),Math.cos(p)*.9+.1,Math.sin(w)*Math.sin(p),0,e,w)}}for(let s=0;s<7;s++)for(let e=0;e<24;e++){const p=s*25+e,b=p+24+1;o.push(p,b,p+1,p+1,b,b+1)}let f=n.length/3;for(let s=0;s<=48;s++){const e=s/48*ke,p=1.32+.1*Math.cos(e*12);c(Math.cos(e)*.92,.07,Math.sin(e)*.92,0,1,0,1,0,e),c(Math.cos(e)*p,0+.05*Math.cos(e*12),Math.sin(e)*p,0,1,0,1,1,e)}for(let s=0;s<48;s++){const e=f+s*2;o.push(e,e+2,e+1,e+1,e+2,e+3)}for(let s=0;s<12;s++){const e=s/12*ke+.13,p=Math.cos(e),b=Math.sin(e),R=1.7+.9*Math.abs(Math.sin(s*2.4));f=n.length/3;for(let k=0;k<=4;k++){const w=k/4,L=.09*(1-.7*w),q=.86-.2*w;c(p*q-b*L,-w*R,b*q+p*L,p,.2,b,2,w,e),c(p*q+b*L,-w*R,b*q-p*L,p,.2,b,2,w,e)}for(let k=0;k<4;k++){const w=f+k*2;o.push(w,w+1,w+2,w+1,w+3,w+2)}}f=n.length/3;for(let s=0;s<=16;s++){const e=s/16*ke;c(Math.cos(e)*1,.03,Math.sin(e)*1,0,1,0,3,0,e),c(Math.cos(e)*3,.03,Math.sin(e)*3,0,1,0,3,1,e)}for(let s=0;s<16;s++){const e=f+s*2;o.push(e,e+2,e+1,e+1,e+2,e+3)}const y=new i.BufferGeometry;return y.setAttribute("position",new i.Float32BufferAttribute(n,3)),y.setAttribute("normal",new i.Float32BufferAttribute(a,3)),y.setAttribute("aInfo",new i.Float32BufferAttribute(v,3)),y.setIndex(o),y}async function vt(n,a={}){const v=n.rng,o=(a.palette&&a.palette.length>=7?a.palette:et).map(t=>new i.Color(t)),c=be(a.detail??n.quality?.detail??1,.6,1),d=a.height??150,r=a.length??1200,f={L:r,R0:d*.47,scale:1,turns:a.turns??v.range(1.68,1.84),taper:v.range(190,300)*(r/1200),taperSkew:v.range(.7,1.3),skew:v.range(-.035,.035),nOff:v.range(0,400),Zb:200,Zf:330,wind:v.sign()},y=v.range(-.012,.012),s=a.flowSpeed??6,e=o[1].clone().offsetHSL(y,0,0),p=o[0].clone(),b=o[3].clone(),R=o[4].clone(),k=o[5].clone(),w=Oe(n,f),L=new i.Group;L.name="canyon-of-three-airs:billow-four";const q=new i.Vector3(-.6,.7,.4).normalize();a.sun?.direction&&q.copy(a.sun.direction).normalize();const _={uTime:{value:0},uFlow:{value:0},uRipple:{value:1},uScale:{value:1},uAlpha:{value:1},uHideBack:{value:0},uSunDir:{value:q},uKey:{value:a.sun?.color?a.sun.color.clone():new i.Color(.92,.77,.74)},uFill:{value:p.clone().multiplyScalar(.5)},uAmber:{value:new i.Color(e.r*.84,e.g*.74,e.b*.5)},uRose:{value:p},uCeil:{value:p.clone().lerp(o[1],.3).multiplyScalar(1.2)},uCream:{value:new i.Color("#FFF6E0")},uPlum:{value:R},uRust:{value:k}},Ce=t=>new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),..._,uSolid:{value:t?1:0}},vertexShader:ot,fragmentShader:nt,fog:!0,side:i.DoubleSide,transparent:!t,depthWrite:t}),ce=Ce(!0),C=Ce(!1);await n.yield();const U=160,ue=14,F=88,N=38,u=await Ze(n,f,w,U,ue,F,N);await n.yield();const I=new i.Mesh(u,[ce,C]);I.frustumCulled=!1,I.renderOrder=2,L.add(I);let Q=u.index.count/3;const P={},se=new Float32Array(F*2);function xe(t,m=150,l=new i.Vector3){w(t,P),qe(P,F,se,0);const S=be(Math.round(m/(P.turns*360)*(F-1)),0,F-1);return l.set(t,se[S*2+1],se[S*2])}await n.yield();{const t=Math.round(160*(.5+.5*c)),m=18,l=(m+1)*2,S=v.fork("filaments"),A=new Float32Array(t*l*3),h=new Float32Array(t*l*2),g=new Float32Array(t*l*4),V=new Float32Array(t*l*2),T=new Float32Array(t*l*3),E=[];for(let de=0;de<t;de++){let Se=0;for(let oe=0;oe<8&&(Se=S.range(-.5,.5)*r,w(Se,P),!(P.turns>f.turns*.55&&S()<.25+2.2*(P.lobe-.1)));oe++);w(Se,P),qe(P,F,se,0);const fe=S.range(72,150),te=be(Math.round(fe/(P.turns*360)*(F-1)),3,F-4),ge=se[te*2],le=se[te*2+1],Fe=se[te*2-6],Ae=se[te*2-5],Re=se[te*2+6],ve=se[te*2+7],Ve=Math.hypot(ge-Fe,le-Ae),x=Math.hypot(Re-ge,ve-le),j=Math.hypot(Re-Fe,ve-Ae),B=Math.abs((ge-Fe)*(ve-Ae)-(le-Ae)*(Re-Fe))*.5,G=be(Ve*x*j/Math.max(4*B,.001),6,60);let K=Re-Fe,O=ve-Ae;const $=Math.hypot(K,O)||1;K/=$,O/=$;const D=ge+O*G,M=le-K*G,z=S.range(24,64)*(.5+.5*P.tp),J=S.range(13,26),ie=S(),ae=S.chance(.28)?S.range(3.5,8):S.range(.8,2.4),we=S.range(.2,.7),he=f.wind*S.range(.25,1),ye=S();for(let oe=0;oe<l;oe++){const W=de*l+oe,Xe=Math.floor(oe/2)/m;A[W*3]=Se,A[W*3+1]=M,A[W*3+2]=D,h[W*2]=ge-D,h[W*2+1]=le-M,g[W*4]=z,g[W*4+1]=J,g[W*4+2]=ie,g[W*4+3]=ae,V[W*2]=Xe,V[W*2+1]=oe%2?1:-1,T[W*3]=we,T[W*3+1]=he,T[W*3+2]=ye}for(let oe=0;oe<m;oe++){const W=de*l+oe*2;E.push(W,W+1,W+2,W+1,W+3,W+2)}}const H=new i.BufferGeometry;H.setAttribute("position",new i.BufferAttribute(new Float32Array(t*l*3),3)),H.setAttribute("aC",new i.BufferAttribute(A,3)),H.setAttribute("aR0",new i.BufferAttribute(h,2)),H.setAttribute("aPar",new i.BufferAttribute(g,4)),H.setAttribute("aUV",new i.BufferAttribute(V,2)),H.setAttribute("aRnd",new i.BufferAttribute(T,3)),H.setIndex(E),H.boundingSphere=u.boundingSphere.clone();const Z=new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),uTime:_.uTime,uSunDir:_.uSunDir,uKey:_.uKey,uFill:_.uFill,uAmber:_.uAmber,uCream:_.uCream},vertexShader:rt,fragmentShader:it,fog:!0,side:i.DoubleSide,transparent:!0,depthWrite:!1}),pe=new i.Mesh(H,Z);pe.frustumCulled=!1,pe.renderOrder=4,L.add(pe),Q+=E.length/3}await n.yield();const _e=a.floaters??Math.round(40+14*(c-.6)/.4),ne=_e>0?_e+3:0,Ie=v.range(-130,130),re=new Float32Array(N*2);function me(t,m,l={}){w(t,P),Ue(P,N,re);const S=be(m,0,.999)*(N-1),A=Math.floor(S),h=S-A;let g=0;for(let H=1;H<=A;H++)g+=Math.hypot(re[H*2]-re[H*2-2],re[H*2+1]-re[H*2-1]);const V=re[A*2+2]-re[A*2],T=re[A*2+3]-re[A*2+1],E=Math.hypot(V,T)||1;return l.x=t,l.z=re[A*2]+V*h,l.y=re[A*2+1]+T*h,l.s=g+E*h,l.nz=T/E,l.ny=-V/E,l.apron=1-Y(.08,.27,m),l}const X=new Float32Array(N*2),Te=new Float32Array(N),Me=new Float32Array(N),Le=Math.round(N*.66);function ze(t,m,l,S){w(t,P),Ue(P,N,X);let A=0;for(let h=0;h<=Le;h++){const g=h/(N-1),V=Math.max(0,h-1),T=h+1;h>0&&(A+=Math.hypot(X[h*2]-X[h*2-2],X[h*2+1]-X[h*2-1]));const E=X[T*2]-X[V*2],H=X[T*2+1]-X[V*2+1],Z=Math.hypot(E,H)||1,pe=1-Y(.08,.27,g),de=Y(.7,.95,g),Se=Y(.62,.97,g)*.4,te=(Math.sin(t*.021+l*.33+A*.012)*1.6+Math.sin(t*.057-l*.47+A*.031)*.7)*(1-pe)*S*(1-.6*Se)*(1-de);Te[h]=X[h*2]+H/Z*te,Me[h]=X[h*2+1]+Qe(t,X[h*2],l)*pe+-E/Z*te}for(let h=0;h<Le;h++){const g=Te[h],V=Te[h+1];if((m-g)*(m-V)<=0&&g!==V)return Me[h]+(Me[h+1]-Me[h])*(m-g)/(V-g)}return NaN}function $e(t,m,l,S=_.uRipple.value){const A=(t+r/2)/r*U;if(!(A>=0&&A<=U))return NaN;const h=Math.min(U-1,Math.floor(A)),g=-r/2+h/U*r,V=-r/2+(h+1)/U*r,T=ze(g,m,l,S),E=ze(V,m,l,S);return T!==T?E:E!==E?T:T+(E-T)*(A-h)}let Be=null;if(ne>0){const t=v.fork("bells"),m=ct(),l=new Float32Array(ne*4),S=new Float32Array(ne*3),A=new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),..._},vertexShader:st,fragmentShader:lt,fog:!0,side:i.DoubleSide,transparent:!0,depthWrite:!0}),h=new i.InstancedMesh(m,A,ne),g=new i.Matrix4,V=new i.Quaternion,T=new i.Vector3,E=new i.Vector3,H=new i.Vector3,Z={},pe=new i.Vector3(0,1,0),de=new i.Quaternion,Se=Math.min(ne,40),fe=[],te=[],ge=(x,j)=>{const B=fe[x];me(B.x,j,Z),T.set(0,Z.ny,Z.nz).lerp(pe,.62).normalize(),V.setFromUnitVectors(pe,T),de.setFromAxisAngle(pe,B.turn),V.multiply(de),E.set(Z.x,Z.y,Z.z).addScaledVector(T,.12*B.r),H.setScalar(B.r),g.compose(E,V,H),h.setMatrixAt(x,g),l[x*4+1]=Z.s,l[x*4+2]=Z.apron,S[x*3]=0,S[x*3+1]=Z.ny,S[x*3+2]=Z.nz,te[x].copy(E)};for(let x=0;x<ne;x++){x%12===11&&await n.yield();const j=x<Se;let B=j?be(Ie+t.gauss()*120,-r*.36,r*.36):t.range(-.42,.42)*r,G=j?t.range(.37,.6):t.range(.1,.33),K=j?t.range(1.5,4):t.range(1.5,3.2);if(x>=ne-3){const O=x-(ne-3);B=256+25*O,K=[3.9,3.3,4.3][O];const $=xe(190,205).z-13+16*(B-190)/170+[-15,14,-13][O];let D=1e9;for(let M=0;M<=50;M++){const z=.12+.48*M/50;me(B,z,Z);const J=Math.abs(Z.z-$);J<D&&(D=J,G=z)}}fe.push({x:B,w:G,r:K,turn:t.range(0,ke),p:null}),te.push(new i.Vector3),ge(x,G),fe[x].p=E.clone(),l[x*4]=t(),l[x*4+3]=t()}const le=[0,-2.6,1.21,-2.6,1.23,-2.52,1.42,-.04,1.42,.14,.457,1.13,.28,1.21,0,1.235],Fe=(x,j)=>{let B=!0,G=1/0;for(let K=0;K<le.length-2;K+=2){const O=le[K+2]-le[K],$=le[K+3]-le[K+1],D=x-le[K],M=j-le[K+1];O*M-$*D<0&&(B=!1);const z=be((D*O+M*$)/(O*O+$*$),0,1);G=Math.min(G,Math.hypot(D-O*z,M-$*z))}return B?0:G},Ae=(x,j)=>Math.hypot(Math.max(x-2.9,0),j-.03),Re=.01,ve=(x,j,B,G,K,O,$,D,M,z)=>{const J=K-$*Z.ny-M,ie=O-$*Z.nz,ae=J*T.y+ie*T.z,we=j*x(Math.sqrt(Math.max(G*G+J*J+ie*ie-ae*ae,0))/j,ae/j);return we>=B+D+z?!0:we<B||D+z<=Re?!1:D>z?ve(x,j,B,G,K,O,$-D/2,D/2,M,z)&&ve(x,j,B,G,K,O,$+D/2,D/2,M,z):ve(x,j,B,G,K,O,$,D,M-z/2,z/2)&&ve(x,j,B,G,K,O,$,D,M+z/2,z/2)},Ve=.002;Be=async(x,j,B)=>{const G=B+j*j/(4*B),K=j/2,O=(M,z,J)=>{const ie=fe[M].r,ae=2.3*(1-Z.apron),we=4.4*Z.apron;for(const he of z){const ye=x[he]-E.x,oe=x[he+1]-E.y,W=x[he+2]-E.z;if(Math.abs(ye)<1.42*ie+G&&!ve(Fe,ie,G,ye,oe,W,0,ae,.125,we+.475)||J&&!ve(Ae,ie,K,ye,oe,W,0,ae,0,we))return!1}return!0},$=M=>{for(let z=0;z<ne;z++){const J=fe[M].r+fe[z].r;if(z!==M&&te[M].distanceTo(te[z])<J&&fe[M].p.distanceTo(fe[z].p)>=J)return!0}return!1};let D=0;for(let M=0;M<ne;M++){const z=fe[M],J=[];for(let ae=0;ae<x.length;ae+=3)Math.abs(x[ae]-z.x)<2.9*z.r+G&&J.push(ae);if(ge(M,z.w),O(M,J,!1)){M%12===11&&await n.yield();continue}let ie=!1;for(const[ae,we]of[[!0,!0],[!0,!1],[!1,!0],[!1,!1]])for(let he=1;!ie&&(z.w+Ve*he<=.6||z.w-Ve*he>=.1);he++){for(const ye of[z.w+Ve*he,z.w-Ve*he])!ie&&ye>=.1&&ye<=.6&&(ge(M,ye),ie=O(M,J,ae)&&!(we&&$(M)));he%32===0&&await n.yield()}ie||(h.setMatrixAt(M,g.makeScale(0,0,0)),te[M].setScalar(1/0)),D++,await n.yield()}return D&&(h.instanceMatrix.needsUpdate=!0,m.attributes.aI.needsUpdate=!0,m.attributes.aIN.needsUpdate=!0),D},m.setAttribute("aI",new i.InstancedBufferAttribute(l,4)),m.setAttribute("aIN",new i.InstancedBufferAttribute(S,3)),h.instanceMatrix.needsUpdate=!0,h.frustumCulled=!1,h.renderOrder=3,L.add(h),Q+=m.index.count/3*ne}const Je=be(a.train??2,0,3),Ne=[],Ee=[];{let t=0,m=1;for(let l=0;l<Je;l++){await n.yield();const S=m*v.range(.74,.82);t-=200*m+330*S+v.range(4,30),m=S;const A={...f,scale:m,L:r*(.96-.06*l),nOff:f.nOff+91.7*(l+1),Zb:200*m,Zf:330*m,taper:f.taper*v.range(.8,1.3),skew:f.skew+v.range(-.02,.02)},h=await Ze(n,A,Oe(n,A),Math.round(72*c),8,46,18),g=new i.Mesh(h,[ce,C]);g.position.set(v.range(-40,40),0,t),g.frustumCulled=!1,g.renderOrder=1-l*.1,L.add(g),Ne.push(t),Ee.push({x:g.position.x,z:t,scale:m,length:A.L}),Q+=h.index.count/3}}const ee={};{const t=(g,V,T)=>new i.Vector3(g,V,T),m=new i.Vector3,l={},S=[],A=[],h=[];for(let g=0;g<=10;g++){const V=-190+38*g;xe(V,205,m),A.push(m.clone());const T=m.z-13;S.push(t(V,Math.max(m.y-21,-20),T))}for(let g=0;g<=10;g++)me(Ie-200+40*g,.47,l),h.push(t(l.x,l.y,l.z));me(Ie,.48,l),ee.flyThrough=S,ee.rimLine=A,ee.faceLine=h,ee.herd=t(l.x,l.y,l.z),ee.approach=t(-260,150,620),ee.dropIn=t(-320,70,150),me(r*.36,.4,l),ee.troughExit=t(l.x,l.y,l.z),ee.crest=xe(0,20),ee.core=xe(0,420),ee.axis=t(1,0,0),ee.front=t(0,0,1),ee.train=Ne.map(g=>t(0,0,g)),ee.trainInfo=Ee,ee.extent={halfLength:r/2,back:-f.Zb,front:f.Zf,crestY:1.64*f.R0,troughY:-.5*f.R0}}let je=new i.Vector3(0,40,20),Ke=430,De=170;const Pe=a.view??null;if(Pe){const t=String(Pe).split(",").map(Number);t.length>=5&&t.every(Number.isFinite)&&(je=new i.Vector3(t[0],t[1],t[2]),Ke=t[3],De=t[4])}return{object:L,radius:Ke,height:De,center:je,anchors:ee,ground:!1,groundY:-d*.25,triangles:Q,swellAt:Qe,lipPoint:xe,setSun(t,m){t&&q.copy(t).normalize(),m&&_.uKey.value.copy(m)},setFill(t){_.uFill.value.copy(t)},setUnder(t){_.uHideBack.value=t?1:0},setCeil(t){_.uCeil.value.copy(t)},facePoint:me,faceHeight:$e,async keepBellsOff(t,m,l){return Be?Be(t,m,l):0},update(t,m){_.uTime.value=m,_.uFlow.value=m*s},dispose(){}}}export{ht as SKIN_GLSL,Ge as SWELL_GLSL,vt as buildHero,Qe as swellAt};
