import*as l from"three";const Ct=["#EADBB8","#CDB98C","#1F3F9A","#2F7D5B","#C7361F","#3B2A1A","#E8B33A"],v=45,R=Math.PI*2;function gt(){return{p:[],n:[],u:[],a:[],tris:0}}const vt=new l.Vector3,st=new l.Vector3,tt=new l.Vector3;function ot(t,o,n,w,c,S,y,M,P,b){vt.set(n[0]-o[0],n[1]-o[1],n[2]-o[2]),st.set(c[0]-o[0],c[1]-o[1],c[2]-o[2]),tt.crossVectors(vt,st),tt.lengthSq()<1e-10&&(st.set(w[0]-o[0],w[1]-o[1],w[2]-o[2]),tt.crossVectors(vt,st)),tt.normalize();const f=[o,n,w,o,w,c],a=[S,y,M,S,M,P];for(let e=0;e<6;e++)t.p.push(f[e][0],f[e][1],f[e][2]),t.n.push(tt.x,tt.y,tt.z),t.u.push(a[e][0],a[e][1]),t.a.push(b);t.tris+=2}function ht(t,o,n,w,c,S){const y=[];let M=0,P=null;for(let f=0;f<=o;f++){const a=n(f%o),e=Math.hypot(a.o[0]-a.i[0],a.o[1]-a.i[1]),i=(a.i[0]+a.o[0])/2,u=(a.i[1]+a.o[1])/2;P&&(M+=Math.hypot(i-P[0],u-P[1])),P=[i,u];const d=w.map(([C,W,K])=>{const I=C==="i"?W/e:1-W/e,X=a.i[0]+(a.o[0]-a.i[0])*I,E=a.i[1]+(a.o[1]-a.i[1])*I;return{p:[X,E,K],uv:S==="arc"?[M,I*e]:[X,E]}});y.push(d)}const b=w.length;for(let f=0;f<o;f++)for(let a=0;a<b;a++){const e=(a+1)%b,i=y[f][a],u=y[f+1][a],d=y[f+1][e],C=y[f][e];ot(t,i.p,u.p,d.p,C.p,i.uv,u.uv,d.uv,C.uv,c)}}function at(t,o,n,w,c,S,y=1){const b=(a,e)=>{const i=e/14*R,u=a/5*Math.PI*.5;return[o+Math.cos(i)*Math.cos(u)*c,n+Math.sin(i)*Math.cos(u)*c,w+y*Math.sin(u)*S]},f=t.p.length/3;for(let a=0;a<5;a++)for(let e=0;e<14;e++){const i=b(a,e),u=b(a,e+1),d=b(a+1,e+1),C=b(a+1,e);ot(t,i,u,d,C,[i[0],i[1]],[u[0],u[1]],[d[0],d[1]],[C[0],C[1]],0)}for(let a=f;a<t.p.length/3;a++){const e=(t.p[a*3]-o)/(c*c),i=(t.p[a*3+1]-n)/(c*c),u=(t.p[a*3+2]-w)/(S*S),d=Math.hypot(e,i,u)||1;t.n[a*3]=e/d,t.n[a*3+1]=i/d,t.n[a*3+2]=u/d}}function xt(t){const o=new l.BufferGeometry;return o.setAttribute("position",new l.Float32BufferAttribute(t.p,3)),o.setAttribute("normal",new l.Float32BufferAttribute(t.n,3)),o.setAttribute("uv",new l.Float32BufferAttribute(t.u,2)),o.setAttribute("aFlag",new l.Float32BufferAttribute(t.a,1)),o}const wt=[35,40],nt=[23,32];function yt(t,o){const n=Math.cos(t),w=Math.sin(t),c=Math.sign(n)*Math.pow(Math.abs(n),o);return{i:[nt[0]*c,v+nt[1]*w],o:[wt[0]*n,v+wt[1]*w]}}function Tt(t,o){const n=gt(),w=2.2+o.bandInset,c=[["i",0,-1.5],["i",0,1.5],["i",.5,2],["i",w,2],["i",w+.5,2.45],["o",w+.5,2.45],["o",w,2],["o",.5,2],["o",0,1.5],["o",0,-1.5],["o",.5,-2],["i",.5,-2]],S=220;ht(n,S,e=>yt(e/S*R,o.pinch),c,1,"arc");const y=[["i",0,-1.4],["i",0,1.7],["i",.35,2.25],["i",.75,2.25],["i",.95,2],["o",.55,2],["o",.35,2.25],["o",0,1.7],["o",0,-1.4]],M=96;ht(n,M,e=>{const i=e/M*R,u=Math.cos(i),d=Math.sin(i);return{i:[7.4*u,v+7.4*d],o:[9.3*u,v+9.3*d]}},y,1,"arc");const P=e=>[[e,v-e],[e,v+e],[-e,v+e],[-e,v-e]],b=[["i",0,-1.25],["i",0,1.25],["i",.25,1.6],["o",.25,1.6],["o",0,1.25],["o",0,-1.25]];for(const[e,i]of[[38.2,39.1],[44,45.2]]){const u=P(e),d=P(i);ht(n,4,C=>({i:u[C],o:d[C]}),b,1,"xy")}for(const e of[-1,1])for(const i of[-1,1])at(n,e*41.55,v+i*41.55,1,1.7,1.5),at(n,e*41.55,v+i*41.55,-1,1.7,1.2,-1);const f=o.studs;for(let e=1;e<f;e++){const i=-39+78*e/f;for(const u of[-1,1])at(n,i,v+u*44.6,1.25,.55,.6),at(n,u*44.6,v+i,1.25,.55,.6)}const a=28;for(let e=0;e<a;e++){const i=(e+.5)/a*R;at(n,Math.cos(i)*8.72,v+Math.sin(i)*8.72,2,.34,.42)}return n}function At(){const t=gt(),o=96,n=45,w=7.6,c=[0,0],S=y=>n/Math.max(Math.abs(Math.cos(y)),Math.abs(Math.sin(y)));for(let y=0;y<o;y++){const M=y/o*R,P=(y+1)/o*R,b=Math.cos(M),f=Math.sin(M),a=Math.cos(P),e=Math.sin(P),i=S(M),u=S(P);for(const d of[1,-1]){const C=[w*b,v+w*f,d],W=[i*b,v+i*f,d],K=[u*a,v+u*e,d],I=[w*a,v+w*e,d];d>0?ot(t,C,W,K,I,c,c,c,c,0):ot(t,I,K,W,C,c,c,c,c,0)}ot(t,[i*b,v+i*f,1],[i*b,v+i*f,-1],[u*a,v+u*e,-1],[u*a,v+u*e,1],c,c,c,c,0)}return t}const Mt=`
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
`,bt=`
attribute float aFlag;
varying vec3 vL, vNl, vNw, vW, vTw, vBw; varying vec2 vUv; varying float vFlag;
#include <fog_pars_vertex>
void main(){
  vL = position; vNl = normal; vUv = uv; vFlag = aFlag;
  vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz;
  mat3 m = mat3(modelMatrix); vNw = normalize(m * normal); vTw = normalize(m[0]); vBw = normalize(m[1]);
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Gt=`
uniform float uTime, uP, uCandleI, uPat;
uniform vec3 uCandleDir, uCandleCol, uGold, uPaint;
varying vec3 vL, vNl, vNw, vW, vTw, vBw; varying vec2 vUv; varying float vFlag;
#include <fog_pars_fragment>
${Mt}
void main(){
  vec3 V = normalize(cameraPosition - vW);
  vec3 Nw = normalize(vNw), Nl = normalize(vNl);
  float fl = dot(Nw, V) < 0.0 ? -1.0 : 1.0; Nw *= fl; Nl *= fl;
  float flatF = step(0.9, abs(Nl.z)) * vFlag;
  // punch-dots on a staggered lattice, kept along a lozenge trellis
  vec2 q = vUv / 1.05; float row = floor(q.y); q.x += 0.5 * mod(row, 2.0);
  vec2 id = floor(q), f = fract(q) - 0.5; float r = length(f);
  float keepA = max(step(mod(id.x + id.y + 400.0, 4.0), 0.5), step(mod(id.x - id.y + 400.0, 4.0), 0.5));
  float keepB = step(0.5, mod(id.y + 300.0, 3.0));
  float keep = mix(keepA, keepB, uPat);
  float dimple = smoothstep(0.36, 0.31, r) * keep * flatF;
  vec2 g = dimple * (f / max(r, 1e-3)) * smoothstep(0.03, 0.3, r) * 1.4;
  vec2 wob = 0.045 * vec2(sin(vL.x * 0.9 + vL.y * 0.33) + sin(vL.y * 1.7), sin(vL.y * 0.8 - vL.x * 0.41) + sin(vL.x * 1.3)) * flatF;
  vec2 pert = g + wob;
  vec3 Nl2 = normalize(Nl + vec3(pert, 0.0));
  vec3 Nw2 = normalize(Nw + vTw * pert.x + vBw * pert.y);
  vec3 R = reflect(-V, Nw2);
  // dull state: ochre-brown, a little lighter where the leaf mirrors the cream page below
  vec3 col = uGold * vec3(1.0, 0.86, 0.9) * (0.25 + 0.20 * smoothstep(0.25, -0.6, R.y) + 0.09 * Nl2.y);
  col *= 1.0 - 0.4 * dimple * smoothstep(0.08, 0.3, r);
  // the candle, mirrored
  float c = max(dot(R, uCandleDir), 0.0);
  float fres = pow(1.0 - max(dot(Nw2, V), 0.0), 4.0);
  vec3 F = mix(vec3(1.0, 0.74, 0.32), vec3(1.0, 0.95, 0.85), fres * 0.6);
  col += F * uCandleCol * uCandleI * (smoothstep(0.955, 0.997, c) * 4.0 + pow(c, 6.0) * 0.35);
  // the ignition
  float m = pow(max(Nl2.z, 0.0), 6.0);
  float xs = vL.x + 0.32 * (vL.y - 45.0);
  float bx = mix(64.0, -64.0, smoothstep(0.03, 0.6, uP));
  float blade = exp(-(xs - bx) * (xs - bx) / 30.25) * smoothstep(0.0, 0.05, uP) * (1.0 - smoothstep(0.58, 0.66, uP));
  float lit = smoothstep(bx - 1.0, bx + 10.0, xs) * smoothstep(0.02, 0.1, uP);
  float flick = 0.9 + 0.1 * sin(uTime * 9.0) * sin(uTime * 5.3 + 1.0);
  vec3 hot = vec3(1.0, 0.50, 0.07);
  float shx = (xs - 58.0 * sin(uTime * 0.45)) / 10.0; float shim = exp(-shx * shx) * 0.7;
  float fm = step(-0.5, vL.z) * smoothstep(-0.2, 0.1, Nl.z);
  col += hot * (blade * 5.5 * (0.15 + m) + lit * flick * (0.12 + (0.52 + shim) * m)) * fm;
  float h = hash(id + 3.0);
  float tw = pow(max(0.0, sin(uTime * (2.5 + 5.0 * h) + h * 50.0)), 16.0);
  // before the ignition the leaf is not dead: a slow glint travels across it and its punch-dots wink in the glint,
  // so that from far off it reads as gold, not brown
  float pre = (1.0 - lit) * fm * exp(-shx * shx * 0.35);
  col += hot * pre * (0.05 + 0.26 * m) + uGold * 0.05 * (1.0 - lit) * fm * m;
  col += vec3(1.0, 0.9, 0.6) * smoothstep(0.24, 0.05, r) * keep * flatF * pre * tw * 1.8;
  float recent = exp(-max(xs - bx, 0.0) / 25.0);
  col += vec3(1.0, 0.9, 0.6) * smoothstep(0.24, 0.05, r) * keep * flatF * lit * tw * (2.5 + 5.0 * recent) * fm;
  gl_FragColor = vec4(col * uPaint, 1.0);
  #include <fog_fragment>
}`,_t=`
uniform float uTime, uKnotK, uSwap;
uniform vec3 uLapis, uVerm, uWhite, uSepia, uVellum, uPaint;
varying vec3 vL;
#include <fog_pars_fragment>
${Mt}
float ink(float edge, float d, float px){ return 1.0 - smoothstep(edge - px, edge + px, d); }
void main(){
  vec2 p = vec2(vL.x, vL.y - 45.0);
  float px = max(length(vec2(dFdx(p.x), dFdy(p.x))), length(vec2(dFdx(p.y), dFdy(p.y))));
  float lw = max(0.10, px * 0.6), la = clamp(0.16 / max(px, 1e-4), 0.4, 1.0);
  vec3 col;
  if (vL.z < -0.98) {
    vec2 g = abs(fract(p / 7.0) - 0.5);
    col = uVellum * (0.78 - 0.08 * ink(0.012, min(g.x, g.y), px / 7.0));
  } else if (vL.z < 0.98) {
    col = uSepia;
  } else {
    float mx = max(abs(p.x), abs(p.y));
    if (mx > 39.0) {
      bool vert = abs(p.x) > abs(p.y);
      float s = vert ? p.y * sign(p.x) : -p.x * sign(p.y);
      float t = mx - 41.55;
      if (abs(s) > 39.0) {
        // corner plaque: quatrefoil
        vec2 c = abs(p) - 41.55, ca = abs(c);
        float dq = min(length(ca - vec2(1.15, 0.0)), length(ca - vec2(0.0, 1.15))) - 1.2;
        col = mix(uVerm, uVerm * 0.72, step(0.0, c.x * c.y));
        col = mix(col, uLapis, ink(0.0, dq, px));
        col = mix(col, uWhite, ink(lw, abs(dq), px));
        col = mix(col, uWhite, ink(0.26, length(ca - 2.45), px));
      } else {
        // three-strand interlace; height sin(2 phase) decides over and under
        float th = s * uKnotK + uTime * 0.3;
        col = uSepia * 0.5;
        col = mix(col, uSepia * 1.3, ink(0.11, length(fract(vec2(s, t) / 0.9) - 0.5) * 0.9, px));
        float best = -9.0;
        for (int i = 0; i < 3; i++) {
          float ph = th + float(i) * 2.0944;
          float yc = 1.5 * sin(ph), sl = 1.5 * uKnotK * cos(ph);
          float d = abs(t - yc) / sqrt(1.0 + sl * sl), hgt = sin(2.0 * ph);
          if (d < 0.80 + px && hgt > best) {
            best = hgt;
            vec3 rc = i == 0 ? uLapis : (i == 1 ? uVerm : mix(uLapis, uWhite, 0.5));
            rc *= mix(0.70, 1.0, step(0.0, t - yc));
            float dir = i == 1 ? -1.0 : 1.0;
            float u = fract(s * 0.4 - dir * uTime * 0.55 + float(i) * 0.33);
            float dd = length(vec2((u - 0.5) / 0.4, d * 1.0));
            rc = mix(rc, uWhite, ink(0.17, dd, px));
            col = mix(rc, uSepia * 0.45, smoothstep(0.60 - px, 0.60 + px, d));
          }
        }
      }
    } else if (length(p / vec2(29.0, 36.0)) > 1.0) {
      // field: diaper of lozenges, hairline trellis, rows of three dots
      vec2 q = vec2(p.x + p.y, p.x - p.y) * 0.7071 / 4.6; vec2 id = floor(q), f = fract(q) - 0.5;
      vec3 a = uSwap > 0.5 ? uLapis : uVerm;
      col = a * mix(1.0, 0.72, mod(id.x + id.y, 2.0));
      float edge = (0.5 - max(abs(f.x), abs(f.y))) * 4.6;
      col = mix(col, uWhite, 0.8 * la * ink(lw, edge, px));
      vec2 o = vec2(f.x + f.y, f.x - f.y) * 0.7071 * 4.6;
      float d3 = min(length(o), min(length(o - vec2(0.8, 0.0)), length(o + vec2(0.8, 0.0))));
      col = mix(col, uWhite, la * ink(0.24, d3, px));
    } else {
      // counter: winding filigree spirals
      vec3 b = uSwap > 0.5 ? uVerm : uLapis;
      vec2 c = p / 7.6; float row = floor(c.y); c.x += 0.5 * mod(row, 2.0);
      vec2 id = floor(c), f = fract(c) - 0.5;
      float r = length(f), a = atan(f.y, f.x), dir = mod(id.x + row, 2.0) * 2.0 - 1.0, h = hash(id);
      float dr = 0.46 / 1.75;
      float sp = fract(a * dir / 6.2832 + r / dr - uTime * 0.05 * dir + h);
      float inDisc = ink(0.46, r, px / 7.6);
      col = mix(b * 0.62, b, inDisc);
      col = mix(col, uWhite, la * inDisc * ink(lw, abs(sp - 0.5) * dr * 7.6, px) * smoothstep(0.03, 0.07, r));
      col = mix(col, uWhite, la * ink(lw, abs(r - 0.46) * 7.6, px));
      col = mix(col, uWhite, ink(0.26, r * 7.6, px));
      col = mix(col, uWhite, la * ink(0.3, length(abs(f) - 0.5) * 7.6, px));
    }
    col *= 0.97 + 0.05 * hash(floor(p * 3.0));
  }
  gl_FragColor = vec4(col * uPaint, 1.0);
  #include <fog_fragment>
}`,Lt=`
attribute vec3 aCtr; attribute vec4 aData; attribute vec2 aLoc;
uniform float uGrow, uTime, uHull;
varying vec2 vLoc; varying vec4 vData; varying vec3 vN; varying float vVis;
#include <fog_pars_vertex>
void main(){
  float age = aData.x, kind = aData.y;
  float vis = smoothstep(age, age + 0.07, uGrow);
  vec3 d = position - aCtr, c = aCtr;
  if (kind > 0.5) {
    // leaves, fruit, blossom: unfurl by turning out of the stem, then flutter
    float ang = (1.0 - vis) * 1.6 + sin(uTime * 1.7 + aData.w * 6.2832) * 0.07 * vis;
    float cs = cos(ang), sn = sin(ang);
    d = vec3(d.x * cs - d.y * sn, d.x * sn + d.y * cs, d.z) * vis * (1.0 + 0.25 * sin(vis * 3.1416));
    if (uHull > 0.5) d *= 0.0;
  } else {
    d *= vis;
    if (uHull > 0.5) d += normal * 0.17 * vis;
  }
  // a draught: tips sway more than the trunk
  c.x += sin(uTime * 0.8 + aCtr.y * 0.21) * 0.22 * age * age;
  c.y += sin(uTime * 0.63 + aCtr.x * 0.17) * 0.12 * age * age;
  vec3 pos = c + d; if (uHull > 0.5) pos.z -= 0.04;
  vLoc = aLoc; vData = aData; vN = normal; vVis = vis;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,kt=`
uniform vec3 uGreen, uWhite, uSepia, uVerm, uOchre, uPaint; uniform float uHull;
varying vec2 vLoc; varying vec4 vData; varying vec3 vN; varying float vVis;
#include <fog_pars_fragment>
float ink(float edge, float d, float px){ return 1.0 - smoothstep(edge - px, edge + px, d); }
void main(){
  if (vVis < 0.01) discard;
  vec3 col; float kind = vData.y, edge = vData.z, h = vData.w;
  float px = max(length(vec2(dFdx(vLoc.x), dFdy(vLoc.x))), length(vec2(dFdx(vLoc.y), dFdy(vLoc.y))));
  float pe = fwidth(edge);
  if (uHull > 0.5) col = uSepia * 0.85;
  else if (kind < 0.5) {
    float tone = step(0.0, dot(normalize(vN), vec3(-0.45, 0.62, 0.64)));
    col = uGreen * mix(0.58, 1.12, tone) * (0.9 + 0.2 * h);
    float dash = step(0.35, fract(vLoc.y * 0.3 + h));
    col = mix(col, uWhite, dash * ink(0.03, abs(vLoc.x - 0.36), fwidth(vLoc.x)));
  } else if (kind < 1.5) {
    col = uGreen * mix(0.58, 1.15, step(0.0, vLoc.y)) * (0.88 + 0.24 * h);
    vec2 q = vec2(vLoc.x, vLoc.y);
    float d3 = min(length(q - vec2(0.30, 0.0)), min(length(q - vec2(0.58, 0.0)), length(q - vec2(0.86, 0.0))));
    col = mix(col, uWhite, ink(0.075, d3, px));
    col = mix(col, uSepia, smoothstep(0.80 - pe, 0.80 + pe, edge));
  } else if (kind < 2.5) {
    col = uVerm * mix(0.66, 1.0, step(length(vLoc - vec2(0.3, -0.3)), 0.95));
    float d3 = min(length(vLoc - vec2(-0.1, 0.25)), min(length(vLoc - vec2(-0.42, 0.25)), length(vLoc - vec2(0.22, 0.25))));
    col = mix(col, uWhite, ink(0.11, d3, px));
    col = mix(col, uSepia, smoothstep(0.84 - pe, 0.84 + pe, edge));
  } else {
    float r = length(vLoc);
    col = mix(uWhite, uWhite * vec3(0.80, 0.84, 0.95), smoothstep(0.55, 0.6, r));
    col = mix(col, uOchre, ink(0.27, r, px));
    col = mix(col, uSepia, max(ink(0.035, abs(r - 0.27), px), smoothstep(0.84 - pe, 0.84 + pe, edge)));
  }
  gl_FragColor = vec4(col * uPaint, 1.0);
  #include <fog_fragment>
}`;function Bt(t,o){const n=[],w=[],c=[],S=[],y=[],M=[],P=(s,r,m,q,V,A,G,D,_,g,L,p,x,h,N)=>(n.push(s,r,m),w.push(q,V,A),c.push(G,D,_),S.push(g,L,p,x),y.push(h,N),n.length/3-1),b=(s,r)=>Math.hypot(s/nt[0],(r-v)/nt[1]),f=(s,r,m)=>m+1.3*dt((b(s,r)-.78)/.16);function a(s,r,m,q,V,A,G){const D=t(),_=s===1?24:s===2?14:20,g=Math.cos(V),L=Math.sin(V),p=z=>s===1?.42+.58*Math.pow(Math.abs(Math.cos(1.5*z)),.95):s===2?1:.72+.28*Math.abs(Math.cos(2.5*z)),x=s===1?.42:0,h=(z,U,k)=>P(r+(z*g-U*L)*A,m+(z*L+U*g)*A,q,0,0,1,r,m,q,G,s,k,D,z,U),N=h(x,0,0);let T=-1,F=-1;for(let z=0;z<_;z++){const U=z/_*R,k=p(U),B=h(x+Math.cos(U)*k,Math.sin(U)*k,1);F>=0?M.push(N,F,B):T=B,F=B}M.push(N,F,T)}function e(s,r,m,q,V,A=0,G=2){const _=t(),g=s.length,L=[];let p=0,x=A*t.range(.4,1),h=t.sign(),N=-1;for(let T=0;T<g;T++){const F=s[T],z=s[Math.max(0,T-1)],U=s[Math.min(g-1,T+1)];T&&(p+=Math.hypot(F[0]-s[T-1][0],F[1]-s[T-1][1],F[2]-s[T-1][2]));let k=U[0]-z[0],B=U[1]-z[1],j=U[2]-z[2];const J=Math.hypot(k,B,j)||1;k/=J,B/=J,j/=J;let Q=-B,Z=k;const pt=Math.hypot(Q,Z)||1;Q/=pt,Z/=pt;const Ft=B*0-j*Z,St=j*Q-k*0,Pt=k*Z-B*Q,it=T/(g-1),et=(r+(m-r)*it)*(T===g-1?.25:1),lt=q+(V-q)*it,mt=n.length/3;for(let H=0;H<7;H++){const Y=H/7*R,O=Math.cos(Y),$=Math.sin(Y)*.7,rt=Q*O+Ft*$,ct=Z*O+St*$,ut=Pt*$,ft=Math.hypot(rt,ct,ut);P(F[0]+rt*et,F[1]+ct*et,F[2]+ut*et,rt/ft,ct/ft,ut/ft,F[0],F[1],F[2],lt,0,0,_,H/7,p)}if(T){const H=N,Y=mt;for(let O=0;O<7;O++){const $=(O+1)%7;M.push(H+O,H+$,Y+$,H+O,Y+$,Y+O)}}if(N=mt,L.push({p:F,t:[k,B],n:[Q,Z],r:et,age:lt}),A&&p>x&&T<g-2&&(G>2.75||it<.72)){x+=A*t.range(.8,1.25),h=-h;const H=Math.atan2(B,k)+h*t.range(.8,1.25),Y=G*t.range(.8,1.2)*(1-.35*it),O=F[0]+Q*h*et*.6,$=F[1]+Z*h*et*.6;Math.hypot(O+Math.cos(H)*Y,$+Math.sin(H)*Y-v)>10.3&&a(1,O,$,F[2]+.25,H,Y,lt+.05)}}return L}function i(s,r,m,q,V,A,G,D){const _=[[s,r,f(s,r,m)]],g=.55;let L=0,p=0;const x=A*G*2.6;for(;L<G*R&&_.length<220;){const h=Math.max(.55,A*Math.exp(-p/x)*(1-.6*L/(G*R)));if(q+=V*g/h,L+=g/h,p+=g,s+=Math.cos(q)*g,r+=Math.sin(q)*g,D&&(b(s,r)>o.spill||Math.hypot(s,r-v)<10.4))return null;_.push([s,r,f(s,r,m)])}return _}function u(s,r,m,q,V,A,G,D,_,g){let L=null;for(let h=0;h<6&&!L;h++)L=i(s,r,m,q,V,A,G,!0),A*=.78;if(!L||L.length<8)return;const p=Math.min(1,_+.12+L.length*.0022);e(L,D,D*.38,_,p,3.4,2.7);const x=L[L.length-1];a(g,x[0],x[1],x[2]+.35,t.range(0,R),g===2?t.range(1,1.4):t.range(1.3,1.8),p+.02)}const d=(s,r)=>new l.CatmullRomCurve3(s.map(m=>new l.Vector3(m[0],m[1],m[2])),!1,"centripetal").getSpacedPoints(r).map(m=>[m.x,m.y,m.z]),C=v-nt[1]+1.6,W=v-15.5+o.fork,K=o.wiggle,I=d([[K*.4,C,2.4],[-K,C+(W-C)*.35,2.3],[K,C+(W-C)*.7,2.4],[0,W,2.7]],26),X=e(I,1.55,1.15,0,.2);for(const s of[-1,1])for(let r=0;r<2;r++){const m=i(K*.4+s*.6,C+.6+r*1,2.2,s>0?-.35-r*.5:Math.PI+.35+r*.5,s,4.2-r*1.2,.8+t()*.3,!1);e(m,.7,.3,.02,.16,r?0:3.4,1.5)}for(let s=0;s<o.lowTwigs;s++){const r=s%2?1:-1,m=X[Math.floor(X.length*(.3+.5*(s>>1)/Math.max(1,o.lowTwigs>>1)))];u(m.p[0]+r*m.r*.6,m.p[1],2,Math.PI/2-r*t.range(.9,1.25),-r*(t.chance(.75)?1:-1),t.range(5.5,7.5),t.range(1.2,1.7),.5,m.age+.03,s%3===0?3:2)}for(const s of[1,-1]){const r=[[0,W-1.2,2.6],[0,W,2.7]],m=-Math.PI/2+.33,q=Math.PI/2+o.cross;for(let x=0;x<=9;x++){const h=m+(q-m)*(x/9),N=11.7+.9*Math.sin(x*.9+s)+t.range(-.25,.25);r.push([s*N*Math.cos(h),v+N*Math.sin(h)*1.03,3.2+1*Math.sin(x/9*Math.PI)+(s>0?.55:0)])}const V=d(r,70).slice(2),A=V.length,G=e(V,1.05,.62,.2,.6,4.4,3),D=G[A-1],_=Math.atan2(D.t[1],D.t[0]);let g=null,L=6.5;for(let x=0;x<6&&!g;x++)g=i(D.p[0],D.p[1],2.2,_,-s,L,1.6+o.turns,!0),L*=.82;if(g){for(let h=0;h<Math.min(6,g.length);h++)g[h][2]=D.p[2]+(g[h][2]-D.p[2])*(h/6);e(g,.62,.26,.6,.97,3.4,2.8);const x=g[g.length-1];a(3,x[0],x[1],x[2]+.35,t()*R,2,.99)}const p=o.twigs;for(let x=0;x<p;x++){const h=G[Math.floor(A*(.1+.78*(x+t.range(.2,.8))/p))],N=Math.atan2(h.p[1]-v,h.p[0]),T=Math.atan2(h.t[1],h.t[0]),F=N+Math.sin(T-N)*t.range(.5,.9),z=(x%2?1:-1)*s;u(h.p[0]+Math.cos(N)*h.r*.5,h.p[1]+Math.sin(N)*h.r*.5,2,F,z,t.range(4.2,6.2),t.range(1.3,1.9),.48,h.age+.04,t.chance(.4)?3:2)}}const E=new l.BufferGeometry;return E.setAttribute("position",new l.Float32BufferAttribute(n,3)),E.setAttribute("normal",new l.Float32BufferAttribute(w,3)),E.setAttribute("aCtr",new l.Float32BufferAttribute(c,3)),E.setAttribute("aData",new l.Float32BufferAttribute(S,4)),E.setAttribute("aLoc",new l.Float32BufferAttribute(y,2)),E.setIndex(M),{geometry:E,tris:M.length/3}}const dt=t=>{const o=Math.min(1,Math.max(0,t));return o*o*(3-2*o)},Dt=`
attribute vec3 iPos; attribute vec3 iData;
uniform float uTime, uP;
varying vec2 vUv; varying float vB;
void main(){
  float xs = iPos.x + 0.32 * (iPos.y - 45.0);
  float bx = mix(64.0, -64.0, smoothstep(0.03, 0.6, uP));
  float blade = exp(-(xs - bx) * (xs - bx) / 49.0) * smoothstep(0.0, 0.05, uP) * (1.0 - smoothstep(0.58, 0.66, uP));
  float lit = smoothstep(bx - 1.0, bx + 10.0, xs) * smoothstep(0.02, 0.1, uP);
  float tw = pow(max(0.0, sin(uTime * iData.z + iData.y)), 10.0);
  vec4 mv = modelViewMatrix * vec4(iPos, 1.0);
  vec3 nv = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
  float facing = smoothstep(0.05, 0.35, dot(nv, normalize(-mv.xyz)));
  vB = (lit * tw * 0.9 + blade * 1.6) * facing;
  vUv = position.xy;
  mv.xy += position.xy * iData.x * (0.35 + 0.65 * min(vB, 1.5)) * step(0.004, vB);
  gl_Position = projectionMatrix * mv;
}`,Nt=`
varying vec2 vUv; varying float vB;
void main(){
  vec2 a = abs(vUv);
  float core = exp(-dot(vUv, vUv) * 22.0);
  float rays = exp(-a.x * 26.0) * max(0.0, 1.0 - a.y) + exp(-a.y * 26.0) * max(0.0, 1.0 - a.x);
  gl_FragColor = vec4(vec3(1.0, 0.82, 0.48) * (core * 5.0 + rays * rays * 2.4) * vB, 1.0);
}`,zt=`
uniform float uFlare, uTime; varying vec2 vUv;
void main(){
  vec2 q = (vUv - vec2(0.5, 0.0)) * vec2(2.0, 1.0);
  float r = length(q);
  float g = pow(max(0.0, 1.0 - r), 2.2) * smoothstep(0.0, 0.03, vUv.y);
  g *= 0.92 + 0.08 * sin(uTime * 9.0) * sin(uTime * 5.3 + 1.0);
  gl_FragColor = vec4(vec3(1.0, 0.62, 0.24) * g * uFlare * 0.4, 1.0);
}`;function qt(t,o,n){const w=new l.PlaneGeometry(2,2),c=new l.InstancedBufferGeometry;c.index=w.index,c.setAttribute("position",w.getAttribute("position"));const S=new Float32Array(o*3),y=new Float32Array(o*3);for(let M=0;M<o;M++){const P=t();let b,f,a=2.6;if(P<.72){const e=yt(t()*R,n.pinch),i=t.range(.12,.88);b=e.i[0]+(e.o[0]-e.i[0])*i,f=e.i[1]+(e.o[1]-e.i[1])*i}else if(P<.84){const e=t()*R;b=Math.cos(e)*8.4,f=v+Math.sin(e)*8.4,a=2.5}else{const e=t.range(-44,44),i=t.pick([38.65,44.6]),u=t.sign();t.chance(.5)?(b=e,f=v+u*i):(b=u*i,f=v+e),a=1.9}S.set([b,f,a],M*3),y.set([t.range(1.6,4)*(t.chance(.12)?1.8:1),t()*R,t.range(1.2,3.4)],M*3)}return c.setAttribute("iPos",new l.InstancedBufferAttribute(S,3)),c.setAttribute("iData",new l.InstancedBufferAttribute(y,3)),c.instanceCount=o,c}async function Vt(t,o={}){const n=t.rng.fork?t.rng.fork("great-initial"):t.rng,w=(o.palette&&o.palette.length>=7?o.palette:Ct).map(k=>new l.Color(k)),[c,,S,y,M,P,b]=w,f={pinch:n.range(1.05,1.32),bandInset:n.range(0,.6),studs:n.int(5,8),knotPeriods:n.int(5,8),pat:n.chance(.4)?1:0,swap:n.chance(.25)?1:0,fork:n.range(-1.5,1.2),wiggle:n.range(.5,1.2)*n.sign(),lowTwigs:n.pick([2,4,4]),cross:n.range(.3,.6),turns:n.range(0,.5),twigs:n.int(4,6),spill:n.range(1,1.1)};S.offsetHSL(n.range(-.02,.02),0,n.range(-.02,.03)),M.offsetHSL(n.range(-.008,.008),0,0),y.offsetHSL(n.range(-.04,.03),0,n.range(-.02,.03));const a=new l.Color("#F6F0E0").multiplyScalar(.86),e=new l.Vector3().fromArray(o.candleDir||[.5,.34,.8]).normalize(),i={uTime:{value:0},uP:{value:0},uPaint:{value:new l.Color(1,1,1)}},u=()=>l.UniformsUtils.clone(l.UniformsLib.fog),d=new l.Group;d.name="great-initial";const C=new l.ShaderMaterial({vertexShader:bt,fragmentShader:_t,fog:!0,side:l.DoubleSide,uniforms:{...u(),...i,uKnotK:{value:R*f.knotPeriods/78},uSwap:{value:f.swap},uLapis:{value:S},uVerm:{value:M},uWhite:{value:a},uSepia:{value:P},uVellum:{value:c}}}),W=At();await t.yield?.();const K=new l.Mesh(xt(W),C);d.add(K),await t.yield?.();const I=new l.ShaderMaterial({vertexShader:bt,fragmentShader:Gt,fog:!0,side:l.DoubleSide,uniforms:{...u(),...i,uPat:{value:f.pat},uGold:{value:b},uCandleDir:{value:e},uCandleCol:{value:new l.Color("#FFC98A")},uCandleI:{value:1}}}),X=Tt(n,f);await t.yield?.();const E=new l.Mesh(xt(X),I);d.add(E),await t.yield?.();const s=Bt(n,f);await t.yield?.();const r={...i,uGrow:{value:.8},uGreen:{value:y},uWhite:{value:a},uSepia:{value:P},uVerm:{value:M},uOchre:{value:b.clone().multiplyScalar(.85)}},m=new l.ShaderMaterial({vertexShader:Lt,fragmentShader:kt,fog:!0,side:l.DoubleSide,uniforms:{...u(),...r,uHull:{value:0}}}),q=new l.ShaderMaterial({vertexShader:Lt,fragmentShader:kt,fog:!0,side:l.BackSide,uniforms:{...u(),...r,uHull:{value:1}}}),V=new l.Mesh(s.geometry,m),A=new l.Mesh(s.geometry,q);V.frustumCulled=A.frustumCulled=!1,d.add(A,V),await t.yield?.();const G=o.glints??150,D=new l.ShaderMaterial({vertexShader:Dt,fragmentShader:Nt,uniforms:{...i},transparent:!0,depthWrite:!1,blending:l.AdditiveBlending}),_=new l.Mesh(qt(n,G,f),D);_.frustumCulled=!1,_.renderOrder=3,G>0&&d.add(_);const g={uFlare:{value:0},uTime:i.uTime};let L=null;if(o.glow!==!1){const k=new l.PlaneGeometry(190,120);k.rotateX(-Math.PI/2),k.translate(0,.08,60),L=new l.Mesh(k,new l.ShaderMaterial({uniforms:g,transparent:!0,depthWrite:!1,blending:l.AdditiveBlending,vertexShader:"varying vec2 vUv; void main(){ vUv = vec2(uv.x, 1.0 - uv.y); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:zt})),L.renderOrder=2,d.add(L)}const p=(k,B,j)=>new l.Vector3(k,B,j),x={portalSeat:{position:p(0,v,0),normal:p(0,0,1),radius:7.4},flyThrough:[p(0,v,220),p(0,v,150),p(0,v,90),p(0,v,45),p(0,v,16),p(0,v,0),p(0,v,-24)],viewpoints:{reveal:p(120,30,190),ignition:p(12,40,150),close:p(0,v,40)},candleMirror:p(0,0,1),shadowBase:[p(-45,0,0),p(45,0,0)],glowCentre:p(0,0,60)};let h=0,N=!1,T=null,F=0;const z=o.demo!==!1,U={object:d,radius:64,height:90,center:p(0,v,0),anchors:x,ground:!0,groundY:0,uniforms:{...i,uGrow:r.uGrow,uCandleDir:I.uniforms.uCandleDir,uCandleCol:I.uniforms.uCandleCol,uCandleI:I.uniforms.uCandleI,uFlare:g.uFlare},variant:f,stats:{triangles:W.tris+X.tris+s.tris*2+G*2+2,drawCalls:6},get flare(){return F},setProgress(k){N=!0,h=Math.min(1,Math.max(0,k))},setGrowth(k){T=k},setCandle(k,B=1){e.copy(k).normalize(),I.uniforms.uCandleI.value=B},update(k,B){i.uTime.value=B;let j=h;if(!N&&z){const J=B%14;j=J<12.5?dt((J-2.5)/3.2):1-(J-12.5)/1.5}i.uP.value=j,F=dt((j-.1)/.6),g.uFlare.value=F,r.uGrow.value=T??1.07-.37*Math.exp(-B/9)},dispose(){}};return U.update(0,0),U}export{Vt as buildHero};
