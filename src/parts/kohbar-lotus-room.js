import*as A from"three";const Zt=["#F3EBD9","#1B1714","#E9A91C","#D8432B","#27407F","#3F8E3C","#E27A9A"],U=42,Jt=9,te=8,St=21,ee=35.3,z=Math.PI*2,kt=(t,e,o)=>{const P=Math.min(1,Math.max(0,(o-t)/(e-t)));return P*P*(3-2*P)},q=t=>Math.min(1,Math.max(0,t)),dt=`
#include <fog_pars_vertex>
`,pt=`
#include <fog_vertex>
`,mt=`
#include <fog_pars_fragment>
`,vt=`
#include <fog_fragment>
`,oe=`
uniform vec4 uWall; uniform float uGable;
float wallZ(vec2 p) {
  float r = length(p - vec2(0., ${U}.));
  float m = smoothstep(33.5, 39., r);
  float e = smoothstep(0., 8., min(p.x - (uGable - 45.), (uGable + 45.) - p.x));
  float b = 0.55 * sin(p.x * 0.105 + p.y * 0.045 + uWall.x) + 0.45 * sin(p.x * 0.062 - p.y * 0.083 + uWall.y)
          + 0.30 * sin(p.y * 0.19 + p.x * 0.12 + uWall.z) + 0.20 * sin(p.y * 0.031 + uWall.w);
  return b * m * e;
}`;function ut(){const t=[],e=[],o=[],P=[],g=[],c=[];let i=0,r=0,s=null,v=null;const l=(a,u,d,m,f,h,p,b,T)=>{const B=typeof r=="function"?r(a,u):r;return t.push(a,u,i),e.push(d.r,d.g,d.b),o.push(m,f,h,p),P.push(b,T,B),v&&g.push(v[0],v[1],v[2],v[3]),t.length/3-1},y=a=>s?a.map(u=>s(u[0],u[1])):a,w={z(a){return i=a,w},wave(a){return r=a,w},xf(a){return s=a,w},ext(a){return v=a,w},fill(a,u){const d=y(a),m=d.map(b=>new A.Vector2(b[0],b[1])),f=A.ShapeUtils.isClockWise(m),h=A.ShapeUtils.triangulateShape(m,[]),p=t.length/3;for(const b of d)l(b[0],b[1],u,0,0,0,0,0,0);for(const b of h)f?c.push(p+b[0],p+b[2],p+b[1]):c.push(p+b[0],p+b[1],p+b[2]);return w},stroke(a,u,d,m=!1,f=1){const h=y(a),p=h.length,b=u*.5;let T=0,B=-1;const x=m?p+1:p;for(let j=0;j<x;j++){const K=j%p,Q=h[m?(K-1+p)%p:Math.max(0,K-1)],Z=h[m?(K+1)%p:Math.min(p-1,K+1)];let at=Z[0]-Q[0],nt=Z[1]-Q[1];const wt=Math.hypot(at,nt)||1;if(at/=wt,nt/=wt,j>0){const X=h[(j-1)%p];T+=Math.hypot(h[K][0]-X[0],h[K][1]-X[1])}const st=-nt,it=at,E=l(h[K][0]+st*b,h[K][1]+it*b,d,1,T,f,b,st,it);l(h[K][0]-st*b,h[K][1]-it*b,d,-1,T,f,b,-st,-it),B>=0&&c.push(B,B+1,E,B+1,E+1,E),B=E}return w},disc(a,u,d,m,f=12,h=d,p=0){const b=[],T=Math.cos(p),B=Math.sin(p);for(let x=0;x<f;x++){const j=x/f*z,K=Math.cos(j)*d,Q=Math.sin(j)*h;b.push([a+K*T-Q*B,u+K*B+Q*T])}return w.fill(b,m)},shape(a,u,d,m=.14,f=1){w.fill(a,u);const h=i;return i=h+.012,w.stroke(a,m,d,!0,f),i=h,w},count(){return c.length/3},build(){const a=new A.BufferGeometry;return a.setAttribute("position",new A.Float32BufferAttribute(t,3)),a.setAttribute("color",new A.Float32BufferAttribute(e,3)),a.setAttribute("aS",new A.Float32BufferAttribute(o,4)),a.setAttribute("aN",new A.Float32BufferAttribute(P,3)),g.length&&a.setAttribute("aR",new A.Float32BufferAttribute(g,4)),a.setIndex(c),a}};return w}function et(t,e=5){const o=t.length,P=[];for(let g=0;g<o;g++){const c=t[(g-1+o)%o],i=t[g],r=t[(g+1)%o],s=t[(g+2)%o];for(let v=0;v<e;v++){const l=v/e,y=l*l,w=y*l;P.push([.5*(2*i[0]+(r[0]-c[0])*l+(2*c[0]-5*i[0]+4*r[0]-s[0])*y+(3*i[0]-c[0]-3*r[0]+s[0])*w),.5*(2*i[1]+(r[1]-c[1])*l+(2*c[1]-5*i[1]+4*r[1]-s[1])*y+(3*i[1]-c[1]-3*r[1]+s[1])*w)])}}return P}const ot=(t,e,o,P,g,c=8)=>{const i=[];for(let r=0;r<=c;r++){const s=P+(g-P)*(r/c);i.push([t+Math.cos(s)*o,e+Math.sin(s)*o])}return i},Pt=`
attribute vec4 aS; attribute vec3 aN;
uniform float uTime, uViewH, uRing, uFace, uFlipP;
varying vec3 vCol; varying vec4 vS;
#ifdef RING
attribute vec4 aR;
#endif
${oe}
${dt}
void main() {
  vec3 p = position; vCol = color; vS = aS;
  float sc = 1.;
#ifdef USE_INSTANCING_COLOR
  if (color.r < 0.) vCol = instanceColor;
#endif
#ifdef RING
  p.y += aN.z * sin(uTime * 3.4 + aR.z + p.x * 0.6);
  // the wave starts low on the door side and runs once round the wall; where it is, a figure leaps out of the
  // ring as far as the gable has room (most over the top and down the far side) and turns a somersault
  float th0 = aR.x + uRing, c0 = cos(th0), s0 = sin(th0);
  float fw = smoothstep(0., 0.4, uFlipP * 1.4 - fract((th0 - 0.35) / 6.2831853));
  float face = uFace * (1. - 2. * fw), leap = sin(3.14159265 * fw);
  if (abs(face) < 0.06) face = face < 0. ? -0.06 : 0.06;
  float room = min(min(36. / max(c0, 0.02), 48. / max(-c0, 0.02)), 36. / max(-s0, 0.02));
  room = min(room, min(45.2 / max(s0 + 0.8 * c0, 0.02), 54.8 / max(s0 - 0.8 * c0, 0.02)));
  // (where the gable leaves no room it leaps inward instead, over the buds; at the crest it is half as big again)
  float amp = room - 37.3 > 3. ? min(room - 37.3, 9.5) : -5.;
  float tip = 6.2831853 * fw * sign(uFace), ct = cos(tip), st = sin(tip);
  vec2 pf = vec2(p.x * face, p.y) * (1. + 0.75 * leap), nf = vec2(aN.x * sign(face), aN.y);
  pf = vec2(pf.x * ct - pf.y * st, pf.x * st + pf.y * ct); nf = vec2(nf.x * ct - nf.y * st, nf.x * st + nf.y * ct);
  float rho = aR.y + pf.y + amp * leap;
  float th = th0 + pf.x / aR.y;
  vec2 rad = vec2(cos(th), sin(th)), tng = vec2(-rad.y, rad.x);
  vec2 q = vec2(0., ${U}.) + rad * rho;
  vec3 lp = vec3(q, wallZ(q) + p.z + (amp < 0. ? 2.7 : 0.3) * leap);
  vec3 nrm = vec3(tng * nf.x + rad * nf.y, 0.);
#else
  float ph = 0.;
  #ifdef USE_INSTANCING
  ph = instanceMatrix[3].x * 0.37 + instanceMatrix[3].y * 0.53;
  #endif
  p.x += aN.z * sin(uTime * 1.7 + ph + p.y * 0.7);
  vec3 lp = p; vec3 nrm = vec3(aN.xy, 0.);
  #ifdef USE_INSTANCING
  lp = (instanceMatrix * vec4(lp, 1.)).xyz;
  sc = length(instanceMatrix[0].xyz);
  nrm = mat3(instanceMatrix) * nrm / max(sc, 1e-4);
  #endif
#endif
  vec4 wp = modelMatrix * vec4(lp, 1.);
  float px = 2. * length(cameraPosition - wp.xyz) / (projectionMatrix[1][1] * uViewH);
  float add = step(0.5, aS.z) * clamp(0.8 * px - aS.w * sc, 0., aS.w * sc * 2.2 + 0.02);
  wp.xyz += mat3(modelMatrix) * nrm * add;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  ${pt}
}`,At=`
uniform vec3 uGround; uniform float uTime, uHatch;
varying vec3 vCol; varying vec4 vS;
${mt}
void main() {
  vec3 col = vCol;
  if (vS.z > 1.5) {
    float a = abs(vS.x), aw = fwidth(vS.x) + 1e-4;
    float lf = clamp(0.12 / max(vS.w, 0.05), 0.14, 0.5);
    float edge = smoothstep(1. - lf - aw, 1. - lf + aw, a);
    float arg = vS.y * uHatch + vS.x * 1.1 - uTime * 1.3;
    float fw = max(fwidth(arg), 1e-3);
    float st = smoothstep(0.3 - fw, 0.3 + fw, sin(arg)) * (1. - smoothstep(0.7, 1.7, fw));
    col = mix(uGround, vCol, max(edge, st * 0.92));
  }
  gl_FragColor = vec4(col, 1.);
  ${vt}
}`;function _t(t,e,o,P){t.xf((r,s)=>[r*o,s*o]).wave(r=>.06+.6*q((1.2*o-r)/(6*o))**2);const g=.15;t.z(.05).shape([[-2.5,.32],[-4.1,1.65],[-3.55,0],[-4.1,-1.65],[-2.5,-.32]],e.second,e.K,g);for(let r=-1;r<=1;r++)t.z(.07).stroke([[-2.8,r*.14],[-3.75,r*.85]],.09,e.K);t.z(.05).shape([[1,1.15],[-.1,2.05],[-1.4,.9]],e.third,e.K,g),t.z(.05).shape([[.7,-1.15],[0,-1.95],[-1,-1]],e.third,e.K,g);const c=et([[3.7,0],[2.5,1],[.6,1.32],[-1.4,.92],[-2.65,.36],[-2.65,-.36],[-1.4,-.92],[.6,-1.32],[2.5,-1]],4);t.z(.09).fill(c,e.body),t.z(.105).stroke(c,.36,e.K,!0,2),t.z(.11).stroke(ot(.4,0,1.75,-.62,.62,6),.13,e.K),t.z(.11).stroke(ot(.75,0,1.75,-.55,.55,6),.09,e.K);const i=P.int(2,3);for(let r=0;r<4;r++)for(let s=0;s<i;s++){const v=1.25-r*.78-(s&1)*.3,l=(s-(i-1)/2)*.58*(1-r*.12);t.z(.11).disc(v,l,.17,r&1?e.second:e.W,6)}t.z(.12).disc(2.75,.3,.33,e.W,10).z(.13).disc(2.8,.3,.15,e.acc,7),t.z(.12).stroke(ot(2.75,.3,.33,0,z,10),.07,e.K)}function Wt(t,e,o){t.xf((s,v)=>[s*o,v*o]).wave(0);const P=.15,g=(s,v,l)=>{const y=[],w=Math.cos(l),a=Math.sin(l);for(let u=0;u<10;u++){const d=u/10*z,m=Math.cos(d)*.95,f=Math.sin(d)*.48;y.push([s+m*w-f*a,v+m*a+f*w])}t.z(.05).shape(y,e.second,e.K,P)};t.wave((s,v)=>.22*Math.sign(s)*(Math.abs(v)>1.2*o?1:0)),g(1.5,1.75,.9),g(1.5,-1.75,-.9),g(-1.45,1.7,2.2),g(-1.45,-1.7,-2.2),t.wave(.04),t.z(.05).shape([[-2,.3],[-3,0],[-2,-.3]],e.second,e.K,P);const c=et([[3.45,0],[2.9,.6],[2.1,.45],[2.1,-.45],[2.9,-.6]],4);t.z(.06).shape(c,e.third,e.K,P),t.z(.08).disc(3,.3,.13,e.acc,6).disc(3,-.3,.13,e.acc,6);const i=[];for(let s=0;s<28;s++){const v=s/28*z;i.push([Math.cos(v)*2.3,Math.sin(v)*1.72])}t.z(.09).fill(i,e.body).z(.105).stroke(i,.38,e.K,!0,2);const r=i.map(s=>[s[0]*.6,s[1]*.58]);t.z(.11).fill(r,e.second).z(.12).stroke(r,.11,e.K,!0);for(let s=0;s<6;s++){const v=s/6*z;t.z(.12).stroke([[Math.cos(v)*1.4,Math.sin(v)*1],[Math.cos(v)*1.95,Math.sin(v)*1.45]],.09,e.K)}t.z(.13).disc(0,0,.3,e.W,8);for(let s=0;s<6;s++){const v=(s+.5)/6*z;t.disc(Math.cos(v)*.8,Math.sin(v)*.58,.15,e.W,6)}}function Ht(t,e,o){t.xf((i,r)=>[i*o,r*o]).wave(i=>.07+.28*q((-i-.8*o)/(3.5*o)));const P=.15;t.z(.05).shape([[-.9,.25],[-4.4,-.85],[-4.2,-1.5],[-2.6,-1.05],[-1.1,-.75]],e.second,e.K,P),t.z(.07).stroke([[-1.5,-.35],[-3.9,-1.1]],.09,e.K),t.stroke([[.45,-1.15],[.5,-1.85],[.95,-1.9]],.13,e.K).stroke([[-.25,-1.1],[-.2,-1.8],[.25,-1.85]],.13,e.K),t.z(.06).shape(et([[2.25,1],[3.2,.72],[3.05,0],[2.6,-.1],[2.35,.4]],3),e.acc,e.K,P);const g=et([[1.8,1.4],[2.5,.85],[1.9,-.55],[.3,-1.25],[-1.5,-.7],[-1.1,.45],[.5,1.25]],5);t.z(.09).fill(g,e.body).z(.105).stroke(g,.3,e.K,!0,2);const c=et([[1,.45],[-.3,.3],[-2.3,-.55],[-.5,-.8],[.8,-.35]],4);t.z(.11).shape(c,e.third,e.K,.12);for(let i=0;i<3;i++)t.z(.125).stroke([[.4-i*.65,.2-i*.12],[.1-i*.65,-.12-i*.1],[.4-i*.65,-.45-i*.06]],.09,e.K);t.z(.115).stroke(ot(2,.45,1.05,2.4,4,6),.16,e.acc),t.z(.12).disc(1.85,.8,.31,e.W,10).z(.13).disc(1.9,.8,.14,e.K,7),t.z(.12).stroke(ot(1.85,.8,.31,0,z,10),.07,e.K)}function Vt(t,e,o){const P=new A.Color(-1,0,0);t.xf(null).wave(0);for(let g=0;g<o;g++){const c=g/o*z,i=[];for(let r=0;r<8;r++){const s=r/8*z,v=.62+Math.cos(s)*.36,l=Math.sin(s)*.2;i.push([v*Math.cos(c)-l*Math.sin(c),v*Math.sin(c)+l*Math.cos(c)])}t.z(.05).shape(i,P,e.K,.07)}t.z(.07).disc(0,0,.3,e.W,10).z(.08).stroke(ot(0,0,.3,0,z,10),.07,e.K).disc(0,0,.13,e.acc,6)}function Dt(t,e){const o=new A.Color(-1,0,0);t.xf(null).wave((P,g)=>.09*q((g+1)/2)**2),t.z(.05).stroke([[0,-1],[.06,-.3],[-.04,.4],[.02,.95]],.09,e.K);for(let P=0;P<5;P++){const g=-.7+P*.38,c=P&1?-1:1,i=.62-P*.05,r=c*.9,s=[[0,0],[i*.5,.17],[i,0],[i*.5,-.17]].map(v=>[v[0]*Math.cos(r)*c-v[1]*Math.sin(r),g+Math.abs(v[0]*Math.sin(r))+v[1]*Math.cos(r)*c]);t.z(.06).shape(s,o,e.K,.06)}t.z(.07).disc(.02,1.02,.14,e.acc,6)}const ae=`
attribute vec4 aP; attribute vec4 aQ; varying vec4 vP; varying vec4 vQ;
${dt}
void main() { vP = aP; vQ = aQ; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition; ${pt} }`,ne=`
uniform vec3 uCA, uCB, uCC, uRim, uGround, uInk, uDot; uniform float uTime, uHatch;
varying vec4 vP; varying vec4 vQ;
${mt}
float ln(float d, float w) { float aw = max(fwidth(d), 1e-4); w = max(w, 0.75 * aw); return 1. - smoothstep(w - aw, w + aw, abs(d)); }
float dotAt(vec2 d, float r) { float l = length(d); float aw = max(fwidth(l), 1e-4); return (1. - smoothstep(r - aw, r + aw, l)) * (1. - smoothstep(0.25, 0.6, aw)); }
void main() {
  float R = vQ.x, m = vP.x * R, e = R - m, th = vP.y, kind = vP.w;
  vec3 col;
  if (vP.z > 1.5) col = uInk;
  else if (vP.z > 0.5) col = uRim;
  else {
    vec3 cA = mix(uCA, uCC, kind), cC = mix(uCC, uCA, kind);
    float sc = vQ.w, wob = (0.16 + 0.34 * kind) * (0.5 - abs(sin(th * sc * 0.5)));
    float b1 = min(1.2, 0.2 * R), b2 = b1 + (0.36 - 0.1 * kind) * R + wob, b3 = b2 + 0.2 * R + wob * 0.6;
    col = e < b1 ? uGround : e < b2 ? cA : e < b3 ? uCB : cC;
    // the hatched double outline
    float arg = th * R * uHatch * 0.5 + e * 2.6 - uTime * 1.3 + vQ.y;
    float fw = max(fwidth(arg), 1e-3);
    float hatch = smoothstep(0.3 - fw, 0.3 + fw, sin(arg)) * (1. - smoothstep(0.7, 1.7, fw)) * step(e, b1);
    float k = max(hatch * 0.92, 1. - smoothstep(0.17, 0.17 + max(fwidth(e), 1e-4) * 1.5, e));
    k = max(k, max(ln(e - b1, 0.085), max(ln(e - b2, 0.07), ln(e - b3, 0.07))));
    // dotted veins fanning through the outer ring
    float nv = vQ.z, f = th * nv / 6.2831853;
    float dx = (fract(f) - 0.5) * 6.2831853 / nv * m;
    float mm = e - b1 - 0.45;
    float dy = (fract(mm / 0.8) - 0.5) * 0.8;
    float inA = step(b1 + 0.3, e) * step(e, b2 - 0.3);
    float vd = dotAt(vec2(dx, dy), 0.19) * inA;
    // ticks across the middle ring
    float f2 = th * nv * 2. / 6.2831853 + 0.5;
    float dx2 = (fract(f2) - 0.5) * 3.14159265 / nv * m;
    float tick = ln(dx2, 0.05) * step(b2 + 0.12, e) * step(e, b3 - 0.12);
    // the heart: a ring of dots and a centre boss
    float rc = max(R - b3, 0.5), nd = 8.;
    float f3 = th * nd / 6.2831853;
    float dx3 = (fract(f3) - 0.5) * 6.2831853 / nd * m;
    float hd = dotAt(vec2(dx3, m - rc * 0.58), 0.24) * step(b3 + 0.2, e);
    float boss = 1. - smoothstep(rc * 0.26, rc * 0.26 + max(fwidth(m), 1e-4), m);
    float dxm = (fract(f + 0.5) - 0.5) * 6.2831853 / nv * m;
    float hair = ln(dxm, 0.03) * inA * step(fract(mm / 1.6), 0.66);
    k = max(k, max(hair, ln(m - rc * 0.84, 0.045) * step(b3 + 0.3, e)));
    col = mix(col, uDot, vd);
    col = mix(col, uDot, hd);
    col = mix(col, uCB, boss);
    k = max(k, max(tick, ln(m - rc * 0.26, 0.07)));
    col = mix(col, uInk, k);
  }
  gl_FragColor = vec4(col, 1.);
  ${vt}
}`;function $t(t){const e=[],o=[],P=[],g=[];for(const i of t){const r=i.h??1.5,s=i.z0??0,v=i.R>5?120:44,l=[];for(let f=0;f<v;f++)l.push(f/v*z);const y=.17;if(i.notch!=null){const f=(i.notch%z+z)%z;for(const h of[-y,0,y])l.push(((f+h)%z+z)%z)}l.sort((f,h)=>f-h),l.push(l[0]+z);const w=f=>{let h=i.R*(1+.022*Math.sin(3*f+i.seed)+.016*Math.sin(5*f+i.seed*2.3));if(i.notch!=null){let p=Math.abs(((f-i.notch)%z+z+Math.PI)%z-Math.PI);h*=1-.46*Math.max(0,1-p/y)}return h},a=[[0,r,0,0],[.25,r-.02,0,0],[.5,r-.07,0,0],[.7,r-.14,0,0],[.85,r-.23,0,0],[.93,r-.32,0,0],[.975,r-.45,0,0],[1,r-.68,0,0],[1,r-.68,1,0],[1,.03,1,.05],[1,.03,2,.05],[1,.03,2,.4]],u=e.length/3,d=l.length,m=a.length;for(let f=0;f<d;f++){const h=l[f],p=w(h),b=Math.cos(h),T=Math.sin(h);for(let B=0;B<m;B++){const x=a[B],j=p*x[0]+x[3];e.push(i.x+b*j,i.y+T*j,s+x[1]),o.push(x[0],h,x[2],i.kind),P.push(i.R,i.seed,i.veins,i.scal)}}for(let f=0;f<d-1;f++)for(let h=0;h<m-1;h++){if(h===7||h===9)continue;const p=u+f*m+h,b=p+m;h>0&&g.push(p,p+1,b),g.push(b,p+1,b+1)}}const c=new A.BufferGeometry;return c.setAttribute("position",new A.Float32BufferAttribute(e,3)),c.setAttribute("aP",new A.Float32BufferAttribute(o,4)),c.setAttribute("aQ",new A.Float32BufferAttribute(P,4)),c.setIndex(g),c}const se=`
attribute vec4 aP; varying vec4 vP;
${dt}
void main() { vP = aP; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition; ${pt} }`,ie=`
uniform vec3 uStem, uGround, uInk, uDot; uniform float uTime, uHatch;
varying vec4 vP;
${mt}
float ln(float d, float w) { float aw = max(fwidth(d), 1e-4); w = max(w, 0.75 * aw); return 1. - smoothstep(w - aw, w + aw, abs(d)); }
void main() {
  float v = vP.x, ph = abs(vP.y), nd = vP.z;
  vec3 col = uStem;
  // the double line down each side, hatched, and black beyond it
  float side = smoothstep(1.02, 1.02 + max(fwidth(ph), 1e-4), ph);
  float arg = v * uHatch * 0.9 + ph * 5. - uTime * 1.3;
  float fw = max(fwidth(arg), 1e-3);
  float hatch = smoothstep(0.3 - fw, 0.3 + fw, sin(arg)) * (1. - smoothstep(0.7, 1.7, fw));
  col = mix(col, uGround, side);
  float k = side * hatch * 0.92;
  k = max(k, max(ln(ph - 1.02, 0.035), smoothstep(1.38, 1.38 + max(fwidth(ph), 1e-4), ph)));
  // node rings: a black band, a white gap, a thin second line; a row of dots under each
  float an = abs(nd);
  float ring = 1. - smoothstep(0.2, 0.2 + max(fwidth(nd), 1e-4), an);
  float gap = (1. - smoothstep(0.46, 0.46 + max(fwidth(nd), 1e-4), an)) * (1. - side);
  col = mix(col, uGround, gap);
  k = max(k, max(ring, ln(an - 0.46, 0.05) * (1. - side)));
  float dx = (fract(vP.y / 0.42 + 0.5) - 0.5) * 0.42 * 1.9;
  float l = length(vec2(dx, nd + 0.95)); float aw = max(fwidth(l), 1e-4);
  float dots = (1. - smoothstep(0.17 - aw, 0.17 + aw, l)) * (1. - smoothstep(0.25, 0.6, aw)) * (1. - side);
  col = mix(col, uDot, dots);
  // two dashed fibres
  float dash = step(fract(v * 0.31), 0.62) * step(0.75, an);
  k = max(k, ln(ph - 0.5, 0.022) * dash * step(0.5, fract(v * 0.31 + 0.2) + 0.2));
  col = mix(col, uInk, k);
  gl_FragColor = vec4(col, 1.);
  ${vt}
}`;function le(t,e,o,P,g){const c=[],i=[],r=[],l=Math.ceil((o-e)/.75);for(let w=0;w<=l;w++){const a=e+(o-e)*(w/l);let u=1e9;for(const h of P)Math.abs(a-h)<Math.abs(u)&&(u=a-h);const d=(2-.55*(a/90))*(1+.1*Math.exp(-(u*u)/.3)+.4*Math.exp(-(a-e)/1.3)),m=t(a),f=g(m,a);for(let h=0;h<=14;h++){const p=-1.85+3.7*(h/14);c.push(m+Math.sin(p)*d,a,f+Math.cos(p)*d),i.push(a,p,u,0)}}for(let w=0;w<l;w++)for(let a=0;a<14;a++){const u=w*15+a,d=u+14+1;r.push(u,u+1,d,u+1,d+1,d)}const y=new A.BufferGeometry;return y.setAttribute("position",new A.Float32BufferAttribute(c,3)),y.setAttribute("aP",new A.Float32BufferAttribute(i,4)),y.setIndex(r),y}const ce=`
attribute vec4 aB; attribute vec4 aK; uniform float uOpen[24];
varying vec4 vK; varying float vO;
${dt}
void main() {
  float o = uOpen[int(aB.w + 0.5)]; vK = aK; vO = o;
  vec3 p = position; float ang = 0., tilt = 0., zo = 0.;
  if (aK.y < 0.5) {
    ang = aK.x * mix(0.17, 0.7854, o);
    p.y *= mix(0.78, 1., o);
    tilt = mix(0.3, 0.1, o) + 0.5 * sin(3.14159265 * o);
    zo = 0.5 + (3.5 - abs(aK.x)) * mix(0.07, 0.012, o) + step(0., aK.x) * 0.012;
  } else if (aK.y < 1.5) { ang = aK.x * 0.52; tilt = 0.1; zo = 0.26; }
  else { float s = smoothstep(0.2, 1., o); p *= s; zo = 0.9 * s; }
  float ct = cos(tilt), st = sin(tilt);
  p = vec3(p.x * ct - p.z * st, p.y, p.x * st + p.z * ct);
  float a = aB.z + ang, ca = cos(a), sa = sin(a);
  vec3 lp = vec3(aB.x + p.x * ca - p.y * sa, aB.y + p.x * sa + p.y * ca, zo + p.z);
  vec4 mvPosition = modelViewMatrix * vec4(lp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  ${pt}
}`,re=`
uniform vec3 uPetal, uPetal2, uCalyx, uHeart, uRim, uInk, uDot;
varying vec4 vK; varying float vO;
${mt}
void main() {
  float type = vK.y, t = vK.z, c = vK.w, ac = abs(c);
  vec3 col;
  if (ac > 1.5) col = type < 0.5 ? uRim : uInk;
  else if (type < 1.5) {
    col = type < 0.5 ? uPetal : uCalyx;
    float aw = max(fwidth(c), 1e-4), at = max(fwidth(t), 1e-4);
    if (type < 0.5) col = mix(col, uPetal2, 1. - smoothstep(0.3 - at, 0.3 + at, t + 0.1 * c * c));
    float k = smoothstep(0.78 - aw, 0.78 + aw, ac);
    k = max(k, smoothstep(0.95 - at, 0.95 + at, t));
    k = max(k, (1. - smoothstep(0.07, 0.07 + aw, ac)) * step(0.36, t) * step(t, 0.82));
    float dl = length(vec2((t - 0.62) * 6., (ac - 0.42) * 2.2));
    col = mix(col, uDot, (1. - smoothstep(0.42, 0.5, dl)) * step(type, 0.5));
    col = mix(col, uInk, k);
  } else {
    col = uHeart;
    float at = max(fwidth(t), 1e-4);
    float f = c * 7., dx = (fract(f) - 0.5) * 1.1, dl = length(vec2(dx, (t - 0.56) * 2.6));
    col = mix(col, uDot, 1. - smoothstep(0.2, 0.28, dl));
    col = mix(col, uDot, 1. - smoothstep(0.16, 0.16 + at, t));
    col = mix(col, uInk, smoothstep(0.84 - at, 0.84 + at, t));
  }
  gl_FragColor = vec4(col, 1.);
  ${vt}
}`;async function ue(t,e){const o=[],P=[],g=[],c=[],r=[-2,-1,-.5,0,.5,1,2],s=(l,y,w,a,u,d)=>{const m=o.length/3;for(let h=0;h<=8;h++){const p=h/8,b=Math.pow(Math.sin(Math.PI*Math.pow(p,.72)),.75),T=d*(.1*(1-p)+b);for(const B of r){const x=Math.max(-1,Math.min(1,B)),j=Math.abs(B)>1.5;o.push(p*u,x*T,j?-.14:.2*u*(1-x*x)*(.25+.75*b)*.5),P.push(y.x,y.y,y.phi,l),g.push(w,a,p,B)}}const f=r.length;for(let h=0;h<8;h++)for(let p=0;p<f-1;p++){const b=m+h*f+p,T=b+f;c.push(b,T,b+1,T,T+1,b+1)}};for(let l=0;l<t.length;l++){const y=t[l],w=y.size;l%6===5&&await e();for(let f=-1;f<=1;f++)s(l,y,f,1,w*.62,w*.27);for(let f=0;f<8;f++)s(l,y,f-3.5,0,w,w*.3);const a=o.length/3,u=w*.4,d=14,m=[0,.5,.86,1,1];for(let f=0;f<=d;f++){const h=f/d*z;for(let p=0;p<m.length;p++){const b=m[p]*u,T=p===m.length-1;o.push(Math.cos(h)*b,Math.sin(h)*b,T?-.3:.3*(1-m[p]*m[p])),P.push(y.x,y.y,y.phi,l),g.push(0,2,m[p],f/d)}}for(let f=0;f<d;f++)for(let h=0;h<m.length-1;h++){const p=a+f*m.length+h,b=p+m.length;h>0&&c.push(p,p+1,b),c.push(b,p+1,b+1)}}const v=new A.BufferGeometry;return v.setAttribute("position",new A.Float32BufferAttribute(o,3)),v.setAttribute("aB",new A.Float32BufferAttribute(P,4)),v.setAttribute("aK",new A.Float32BufferAttribute(g,4)),v.setIndex(c),v}const fe=`
attribute float aT; varying vec3 vW; varying float vT;
${dt}
void main() { vW = position; vT = aT; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition; ${pt} }`,he=`
uniform vec3 uGround, uInk, uSun, uAcc, uB;
uniform vec4 uPatch; uniform float uPatchOn, uGable, uWheel, uTime;
varying vec3 vW; varying float vT;
${mt}
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float ln(float d, float w) { float aw = max(fwidth(d), 1e-4); w = max(w, 0.75 * aw); return 1. - smoothstep(w - aw, w + aw, abs(d)); }
void main() {
  vec2 p = vW.xy;
  vec3 col = uGround;
  if (gl_FrontFacing) {
    float pxm = max(fwidth(p.x) + fwidth(p.y), 1e-4);
    // the painted sun patch: north edge leaning, top edge slanting
    float dN = p.x - (uPatch.x + uPatch.w * (p.y - uPatch.y));
    float dT = (uPatch.y + uPatch.z * (p.x - uPatch.x)) - p.y;
    float ed = min(dN, dT * 0.94);
    float inside = smoothstep(-pxm, pxm, ed) * uPatchOn;
    if (vT < 0.5) {
      // stipple: jittered rows of turmeric dots, crowding toward the edge
      vec2 g = p / 1.12; g.x += 0.5 * floor(g.y);
      vec2 id = floor(g), f = fract(g) - 0.5 + (vec2(hash(id), hash(id + 7.3)) - 0.5) * 0.3;
      float rad = mix(0.5, 0.34, smoothstep(0., 8., ed)), l = length(f), aw = pxm / 1.12;
      float dotc = 1. - smoothstep(rad - aw, rad + aw, l);
      dotc = mix(dotc, 0.55, smoothstep(0.25, 0.7, aw));
      col = mix(col, uSun, max(dotc, ln(ed - 0.2, 0.2)) * inside);
      float k = 0.;
      // dotted ring round the wheel between two lines; it turns with the wheel
      vec2 d = p - vec2(0., ${U}.);
      float rr = length(d), ang = atan(d.y, d.x + (abs(d.x) + abs(d.y) < 1e-4 ? 1e-4 : 0.));
      float fr = (ang - uWheel) * 138. / 6.2831853;
      float dl = length(vec2((fract(fr) - 0.5) * 6.2831853 / 138. * rr, rr - 33.05));
      col = mix(col, uAcc, (1. - smoothstep(0.26 - pxm, 0.26 + pxm, dl)) * (1. - smoothstep(0.25, 0.6, pxm)));
      // border under the rakes and down the sides: two lines, a row of triangles between
      float dr = (60. + 36. * (1. - abs(p.x - uGable) / 45.) - p.y) * 0.781;
      float ds = min(p.x - (uGable - 45.), (uGable + 45.) - p.x);
      float db = min(dr, ds), al = dr < ds ? p.x * 1.28 : p.y;
      float h = (db - 0.5) / 1.5, s = fract(al / 1.9), tri = 1. - abs(2. * s - 1.);
      float inB = step(0., h) * step(h, 1.);
      col = mix(col, h < tri ? uAcc : uB, inB);
      k = max(k, max(max(ln(db - 0.5, 0.08), ln(db - 2.0, 0.08)), ln((h - tri) * 1.5, 0.08) * inB));
      // sown marks in the corners: triads of dots and little chevrons
      vec2 g2 = p / 2.7; vec2 id2 = floor(g2); float hs = hash(id2 + 3.1);
      vec2 f2 = (fract(g2) - 0.5) * 2.7 - (vec2(hash(id2 + 1.7), hash(id2 + 5.9)) - 0.5) * 1.1;
      float sow = step(38.4, rr) * step(3.0, db) * step(4.6, p.y);
      float tri3 = min(length(f2 - vec2(0., 0.3)), min(length(f2 - vec2(0.27, -0.16)), length(f2 - vec2(-0.27, -0.16))));
      float chev = max(abs(abs(f2.x) * 0.9 + f2.y) - 0.07, abs(f2.x) - 0.42);
      float mk = hs < 0.55 ? 1. - smoothstep(0.13 - pxm, 0.13 + pxm, tri3) : 1. - smoothstep(-pxm, pxm, chev);
      mk *= sow * (1. - smoothstep(0.2, 0.5, pxm));
      col = mix(col, hs > 0.3 && hs < 0.55 ? uAcc : uInk, mk);
      col = mix(col, uInk, k);
    } else {
      // plinth: a band of triangles between lines; inside the patch the vermilion turns turmeric
      float h = (p.y - 0.25) / 2.1, s = fract(p.x / 3.2), tri = 1. - abs(2. * s - 1.);
      float inB = step(0., h) * step(h, 1.);
      col = mix(col, h < tri ? mix(uAcc, uSun, inside) : uB, inB);
      float k = max(max(ln(p.y - 0.25, 0.09), ln(p.y - 2.35, 0.09)), ln((h - tri) * 1.5, 0.09) * inB);
      k = max(k, ln(p.y - 2.72, 0.05));
      col = mix(col, uInk, k);
    }
  }
  gl_FragColor = vec4(col, 1.);
  ${vt}
}`;function de(t,e){const o=[],P=[],g=[],r=t-45,s=a=>60+36*(1-Math.abs(a-t)/45);for(let a=0;a<=76;a++){const u=r+90*(a/76);for(let d=0;d<=52;d++){const m=3.1+(s(u)-3.1)*(d/52);o.push(u,m,e(u,m)),P.push(0)}}for(let a=0;a<76;a++)for(let u=0;u<52;u++){const d=a*53+u,m=d+52+1;g.push(d,m,d+1,m,m+1,d+1)}const v=[[1.3,0],[1.3,2.3],[1.2,2.72],[.9,3],[.35,3.1],[0,3.1]],l=o.length/3,y=v.length;for(let a=0;a<=76;a++){const u=r+90*(a/76),d=e(u,3.1);for(const m of v)o.push(u,m[1],d+m[0]),P.push(1)}for(let a=0;a<76;a++)for(let u=0;u<y-1;u++){const d=l+a*y+u,m=d+y;g.push(d,m,d+1,m,m+1,d+1)}const w=new A.BufferGeometry;return w.setAttribute("position",new A.Float32BufferAttribute(o,3)),w.setAttribute("aT",new A.Float32BufferAttribute(P,1)),w.setIndex(g),w}async function me(t,e={}){const o=t.rng,P=t.quality?.detail??1,g=t.vary?.density??1,c=(e.palette&&e.palette.length>=7?e.palette:Zt).map(n=>new A.Color(n)),i=t.vary?.hour,r=o(),s=e.look||(i==="dawn"?"line":i==="night"?"dusk":i==="golden"||i==="day"||r<.52?"sun":r<.7?"line":"dusk"),v=s==="line"?[0,1,0,0,0,0,0]:s==="dusk"?[0,1,6,6,4,4,6]:[0,1,2,3,4,5,6],l=n=>c[v[n]],y=c[0],w=c[1],a=s==="dusk"?c[6]:c[3],u=e.gableX??-6,d=[o.range(0,z),o.range(0,z),o.range(0,z),o.range(0,z)],m=(n,M)=>{const F=Math.hypot(n,M-U),C=kt(33.5,39,F),I=kt(0,8,Math.min(n-(u-45),u+45-n));return(.55*Math.sin(n*.105+M*.045+d[0])+.45*Math.sin(n*.062-M*.083+d[1])+.3*Math.sin(M*.19+n*.12+d[2])+.2*Math.sin(M*.031+d[3]))*C*I},f=o.sign(),h=o.range(0,z),p=o.range(8,11),b=o.range(2.2,5.2),T=89.5,B=n=>{const F=U,C=T,I=b,G=u;return I*((n-F)*(n-C))/((2.4-F)*(2.4-C))+G*((n-2.4)*(n-F))/((C-2.4)*(C-F))},x={uTime:{value:0},uViewH:{value:1080},uRing:{value:0},uFace:{value:-f},uFlipP:{value:0},uHatch:{value:p},uGround:{value:y},uInk:{value:w},uWall:{value:new A.Vector4(d[0],d[1],d[2],d[3])},uGable:{value:u},uWheel:{value:h},uPatch:{value:new A.Vector4(33,2,.3,.25)},uPatchOn:{value:s==="sun"?1:0},uOpen:{value:new Float32Array(24)}},j=()=>A.UniformsUtils.clone(A.UniformsLib.fog),K=(n,M,F,C)=>new A.ShaderMaterial({vertexShader:n,fragmentShader:M,fog:!0,side:A.DoubleSide,defines:C||{},uniforms:{...j(),...F}}),Q={uTime:x.uTime,uViewH:x.uViewH,uRing:x.uRing,uFace:x.uFace,uFlipP:x.uFlipP,uHatch:x.uHatch,uGround:x.uGround,uWall:x.uWall,uGable:x.uGable},Z=K(Pt,At,Q);Z.vertexColors=!0;const at=K(Pt,At,Q,{RING:1});at.vertexColors=!0;const nt=K(ae,ne,{uTime:x.uTime,uHatch:x.uHatch,uGround:x.uGround,uInk:x.uInk,uCA:{value:l(5)},uCB:{value:l(2)},uCC:{value:s==="dusk"?c[4]:l(6)},uRim:{value:s==="line"?y:l(3)},uDot:{value:s==="line"?a:y}}),wt=K(se,ie,{uTime:x.uTime,uHatch:x.uHatch,uGround:x.uGround,uInk:x.uInk,uStem:{value:l(2)},uDot:{value:s==="line"?a:y}}),st=K(ce,re,{uOpen:x.uOpen,uInk:x.uInk,uPetal:{value:l(6)},uPetal2:{value:s==="dusk"?c[4]:l(2)},uCalyx:{value:l(5)},uHeart:{value:s==="dusk"?c[4]:c[3]},uRim:{value:s==="line"?y:l(3)},uDot:{value:y}}),it=K(fe,he,{uTime:x.uTime,uGround:x.uGround,uInk:x.uInk,uGable:x.uGable,uWheel:x.uWheel,uPatch:x.uPatch,uPatchOn:x.uPatchOn,uSun:{value:c[2]},uAcc:{value:a},uB:{value:l(4)}});await t.yield();const E=new A.Group;E.name="kohbar";const X=(n,M,F,C=0)=>{const I=new A.Mesh(M,F);return I.frustumCulled=!1,I.renderOrder=C,n.add(I),I};e.wall!==!1&&X(E,de(u,m),it),await t.yield();const lt=new A.Group;lt.position.set(0,U,0),E.add(lt);const Ot=o.chance(.6),jt=o.int(7,10)*2,Et=o.int(5,8)*2,zt=[];for(let n=0;n<6;n++){const M=(n+.5)*z/6;zt.push({x:Math.cos(M)*St,y:Math.sin(M)*St,R:Jt,notch:M+(Ot?Math.PI:0)+o.range(-.25,.25),kind:0,seed:o.range(0,6),veins:jt,scal:Et})}X(lt,$t(zt),nt),await t.yield();const ft=[];for(let n=0;n<6;n++){const M=n*z/6,F=(C,I,G)=>ft.push({x:Math.cos(M+I)*C,y:Math.sin(M+I)*C,phi:M+I,size:G});F(13.2,0,2.8),F(26.6,0,3.5),F(30,.2,2.3),F(30,-.2,2.3)}ft.sort((n,M)=>n.phi-M.phi),X(lt,await ue(ft,t.yield),st),await t.yield();{const n=ut();for(let M=0;M<6;M++){const F=M*z/6,C=o.range(-.035,.035),I=[];for(let G=0;G<=10;G++){const N=8.7+15.900000000000002*(G/10),k=F+C*Math.sin(G/10*Math.PI);I.push([Math.cos(k)*N,Math.sin(k)*N])}n.z(.05).stroke(I,.62,w,!1,2);for(const G of[-1,1]){const N=[];for(let $=0;$<=8;$++){const W=$/8,O=19.5+9*W,tt=F+G*.2*W*W;N.push([Math.cos(tt)*O,Math.sin(tt)*O])}n.z(.06).stroke(N,.2,w);const k=22.6,D=F+G*.2*.118,R=Math.cos(D)*k,L=Math.sin(D)*k,_=F+G*1,S=[[0,0],[.6,.32],[1.4,0],[.6,-.32]].map($=>[R+$[0]*Math.cos(_)-$[1]*Math.sin(_),L+$[0]*Math.sin(_)+$[1]*Math.cos(_)]);n.z(.07).shape(S,l(5),w,.11)}for(let G=0;G<3;G++)for(const N of[-1,1]){const k=15.9+G*1.3,D=F+N*.042;n.z(.07).disc(Math.cos(D)*k,Math.sin(D)*k,.2,a,7)}}X(lt,n.build(),Z)}await t.yield();const Ut=[{x:0,y:U,R:te,notch:null,kind:1,seed:o.range(0,6),veins:24,scal:12},{x:u,y:T,R:3.1,notch:null,kind:1,seed:o.range(0,6),veins:12,scal:8,h:2.7,z0:m(u,T)}];X(E,$t(Ut),nt);const gt=[];for(let n=o.range(6.5,8.5);n<T-5;n+=o.range(6.2,8.4))gt.push(n);X(E,le(B,2.4,T,gt,(n,M)=>m(n,M)+1),wt),await t.yield();{const n=ut();for(const M of gt){if(M<80)continue;const F=B(M),C=m(F,M)+.12;for(const I of[-1,1])for(let G=0;G<2;G++){const N=o.range(3.6,5.2),k=I*(.75+G*.55+o.range(-.1,.1)),D=Math.sin(k),R=Math.cos(k),L=et([[0,0],[N*.35,.5],[N,0],[N*.35,-.5]],4).map(_=>[F+I*1.4+_[0]*D-_[1]*R,M+_[0]*R+_[1]*D]);n.wave((_,S)=>.11*q(Math.hypot(_-F,S-M)/5)**2),n.z(C+G*.03).shape(L,l(5),w,.13),n.z(C+G*.03+.02).stroke([[F+I*1.4+N*.1*D,M+N*.1*R],[F+I*1.4+N*.85*D,M+N*.85*R]],.07,w)}}n.count()&&X(E,n.build(),Z)}await t.yield();{const n=ut(),M=["f","p","f","t","p"],F=o.int(0,4),C=s==="dusk"?[c[4],c[6]]:[l(2),l(6),l(4)];let I=0;for(let G=0;G<20;G++){const N=M[(G+F)%5],k=G/20*z+o.range(-.02,.02);if(n.ext([k,ee+o.range(-.15,.15),o.range(0,z),0]),N==="f"){const D=C[I++%C.length];_t(n,{W:y,K:w,acc:a,body:D,second:D===l(2)?l(3):l(2),third:l(5)},o.range(.72,.82),o)}else N==="t"?Wt(n,{W:y,K:w,acc:a,body:l(5),second:l(2),third:s==="dusk"?c[6]:l(5)},.72):Ht(n,{W:y,K:w,acc:a,body:l(5),second:s==="dusk"?c[6]:l(5),third:l(2)},o.range(.74,.8));G%5===4&&await t.yield()}X(E,n.build(),at,1)}await t.yield();{const n=S=>60+36*(1-Math.abs(S-u)/45),M=[[],[]],F=Math.min(1,.9*P*g);for(let S=u-45+3.4;S<u+45-3;S+=3.1)for(let $=6.2;$<92;$+=3.1){const W=S+o.range(-.9,.9),O=$+o.range(-.9,.9),tt=o(),Lt=o(),Mt=o.range(.95,1.7),Qt=o.range(0,z),qt=o();Math.min((n(W)-O)*.781,W-(u-45),u+45-W)<3.6+Mt||Math.hypot(W,O-U)<38.6+Mt||O>70&&Math.abs(W-B(O))<6.5||qt>F||M[tt<.55?0:1].push({x:W,y:O,s:Mt,rot:Qt,pick:Lt})}const C=ut();Vt(C,{W:y,K:w,acc:a},o.int(6,8));const I=ut();Dt(I,{W:y,K:w,acc:a});const G=[C.build(),I.build()],N=new A.Matrix4,k=new A.Quaternion,D=new A.Vector3(0,0,1),R=new A.Vector3,L=new A.Vector3,_=s==="line"?[y]:s==="dusk"?[c[6],c[4]]:[c[2],c[3],c[6],c[4]];for(let S=0;S<2;S++){const $=M[S].length;if(!$)continue;const W=new A.InstancedMesh(G[S],Z,$);W.frustumCulled=!1,W.renderOrder=1,M[S].forEach((O,tt)=>{k.setFromAxisAngle(D,S===0?O.rot:(O.rot/z-.5)*.9),N.compose(R.set(O.x,O.y,m(O.x,O.y)+.02),k,L.set(O.s,O.s,1)),W.setMatrixAt(tt,N),W.setColorAt(tt,S===0?_[Math.floor(O.pick*_.length)]:l(5))}),W.instanceMatrix.needsUpdate=!0,W.instanceColor&&(W.instanceColor.needsUpdate=!0),E.add(W)}}await t.yield();const ht=ft.length,xt=new Float32Array(ht),J=new Float32Array(ht);let Y=0,Ft=!1,ct=!0,bt=1,Gt=0,rt=-f,yt=-1,It=!1;const Xt=e.demo!==!1,Rt=new A.Vector2,H={cornerX:33,cornerY:2,footX:32.5,slope:.3,lean:.25},Ct=n=>q((n-.26)/.46),Tt=()=>{Y=0,xt.fill(0),J.fill(0),ct=!0},Nt=n=>{Ft=!0,n=q(n),n-Y>.06&&(ct=!0),n>Y&&(Y=n)},Bt=()=>{H.cornerX=33-85*Y,H.cornerY=2+98*Y,H.footX=H.cornerX-H.lean*H.cornerY,x.uPatch.value.set(H.cornerX,H.cornerY,H.slope,H.lean)};Bt();function Yt(n,M,F){if(n=Math.min(Math.max(n||0,0),.1),x.uTime.value=M,t.renderer&&(t.renderer.getDrawingBufferSize(Rt),x.uViewH.value=Math.max(64,Rt.y)),Xt&&!Ft){const R=q(((M+8)%60+60)%60/36);R<yt-.02&&Tt(),Math.abs(R-yt)>.06&&(ct=!0),yt=R,Y=Math.max(Y,R)}Gt+=(bt-1)*n;const C=M+Gt,I=h+f*C*z/90;lt.rotation.z=I,x.uWheel.value=I,x.uRing.value=-f*C*z/75;const G=It||bt>=0?-f:f;rt+=(G-rt)*Math.min(1,n*2.5),ct&&(rt=G),x.uFace.value=Math.abs(rt)<.04?rt<0?-.04:.04:rt,Bt();const N=Math.cos(I),k=Math.sin(I);let D=0;for(let R=0;R<ht;R++){if(s==="sun"){const _=ft[R],S=_.x*N-_.y*k,$=U+_.x*k+_.y*N;S>H.cornerX+H.lean*($-H.cornerY)+1&&$<H.cornerY+H.slope*(S-H.cornerX)-1&&(J[R]=1)}else s==="line"?Y>(R+.5)/ht&&(J[R]=1):Y>(Math.floor(R*9/ht)+.5)/9&&(J[R]=1);xt[R]=ct?J[R]:Math.min(J[R],xt[R]+n/1.5);const L=xt[R];x.uOpen.value[R]=L*L*(3-2*L),J[R]>0&&D++}Kt.opened=D,ct=!1}const V=(n,M,F)=>new A.Vector3(n,M,F),Kt={object:E,radius:33,height:96,center:V(0,U,0),ground:!0,groundY:0,look:s,uniforms:x,patch:H,opened:0,wallZ:m,stemX:B,anchors:{hub:V(0,U,1.5),squareOn:V(0,U,60),lowPass:V(9,26,14.5),hubPass:V(0,44,14.5),flyThrough:[V(34,26,30),V(22,26,16),V(9,26,14.5),V(-8,28,15),V(-24,32,24),V(0,U,60),V(20,44,22),V(0,44,14.5),V(-20,44,20)],portalSeat:{position:V(-34,34,190),facing:V(0,0,-1)},placement:{position:[80,0,6],rotationY:-Math.PI/2},patchFoot:V(H.footX,0,0),crown:V(u,T,2.8),maxProud:3.3},update:Yt,dispose(){},setProgress:Nt,setU:n=>Nt(Ct(n)),progressFromU:Ct,resetProgress:Tt,setSpin:n=>{bt=Math.max(-2,Math.min(2,n))},setFlip:n=>{It=!0,x.uFlipP.value=q(n)}};return Kt}export{At as PAINT_FRAG,Pt as PAINT_VERT,me as buildHero,_t as drawFish,Vt as drawFlower,Ht as drawParrot,Dt as drawSprig,Wt as drawTurtle,ot as inkArc,et as inkLoop,ut as makeInk};
