import*as e from"three";import{PLACES as Q,SEA as bt,CRAFT_STAGE as at,craft as X}from"./knee-deep-under-the-wave-law.js";const et=t=>(t=t<0?0:t>1?1:t,t*t*(3-2*t)),O=Q.craft.length/2,vt=2.2,kt=-1e3;function ft(){const t=[],B=[],k=[],W=[];let s=null;const r=n=>(t.push(n[0],n[1],n[2]),B.push(n[3]||0,n[4]||0,n[5]||0,n[6]===void 0?kt:n[6]),s&&W.push(...s),t.length/3-1);function i(n,l,b,v=!1,x=!1){const p=t.length/3,P=v?n:n+1;for(let V=0;V<=l;V++)for(let w=0;w<P;w++)r(b(w/n,V/l,w,V));for(let V=0;V<l;V++)for(let w=0;w<n;w++){const M=p+V*P+w,C=p+V*P+(w+1)%P,L=M+P,z=C+P;x?k.push(M,C,L,C,z,L):k.push(M,L,C,C,L,z)}}function g(n,l,b,v,x,p,P){const V=new e.Vector3().subVectors(l,n).normalize(),w=new e.Vector3(1,0,0);Math.abs(V.x)>.8&&w.set(0,0,1),w.cross(V).normalize();const M=new e.Vector3().crossVectors(V,w),C=(L,z,E)=>{const I=Math.cos(L*2*Math.PI)*E,j=Math.sin(L*2*Math.PI)*E,J=new e.Vector3().lerpVectors(n,l,z);return[J.x+w.x*I+M.x*j,J.y+w.y*I+M.y*j,J.z+w.z*I+M.z*j,p,L,z,P]};i(x,1,(L,z)=>C(L,z,z<.5?b:v),!0),i(x,1,(L,z)=>C(L,0,z<.5?0:b),!0),i(x,1,(L,z)=>C(L,1,z<.5?v:0),!0)}function c(){const n=new Float32Array(t.length),l=new e.Vector3,b=new e.Vector3,v=new e.Vector3;for(let p=0;p<k.length;p+=3){const P=k[p]*3,V=k[p+1]*3,w=k[p+2]*3;l.set(t[P],t[P+1],t[P+2]),b.set(t[V],t[V+1],t[V+2]).sub(l),v.set(t[w],t[w+1],t[w+2]).sub(l),b.cross(v);for(const M of[P,V,w])n[M]+=b.x,n[M+1]+=b.y,n[M+2]+=b.z}for(let p=0;p<n.length;p+=3){const P=Math.hypot(n[p],n[p+1],n[p+2])||1;n[p]/=P,n[p+1]/=P,n[p+2]/=P}const x=new e.BufferGeometry;if(x.setAttribute("position",new e.Float32BufferAttribute(t,3)),x.setAttribute("normal",new e.BufferAttribute(n,3)),x.setAttribute("aK",new e.Float32BufferAttribute(B,4)),W.length){const p=new e.InterleavedBuffer(new Float32Array(W),7);x.setAttribute("aC",new e.InterleavedBufferAttribute(p,3,0)),x.setAttribute("aR",new e.InterleavedBufferAttribute(p,4,3))}return x.setIndex(k),x.boundingSphere=new e.Sphere(new e.Vector3,1/0),x}function u(n,l){const b=new Set;for(let v=n;v<k.length;v++){const x=k[v];if(b.has(x))continue;b.add(x);const p=[0,0,0,0,0,0,0];l(p),B[x*4+1]=p[4],B[x*4+2]=p[5],B[x*4+3]=p[6]}}return{patch:i,tube:g,vert:r,idx:k,geometry:c,foldFrom:u,tagWith(n){s=n},count:()=>k.length/3}}const nt=t=>Math.sqrt(Math.max(1-(1-Math.min(t/.13,1))**2,0)),Mt=t=>4.5*(.4+.6*Math.pow(t,.8))*nt(t),zt=t=>3.5*(.3+.7*et(t/.72))*(1-.1*et((t-.8)/.2))*nt(t),Vt=t=>(.7+.3*t)*nt(t),At=t=>1.05*(1-et(t/.32))**2,dt=t=>At(t)+(.7+.3*t);function $(t,B){const k=B*2*Math.PI,W=Math.cos(k),s=Math.sin(k),r=s>=0,i=r?.8:.34,g=Mt(t)*Math.sign(W)*Math.pow(Math.abs(W),i),c=dt(t)+(r?zt(t):-Vt(t))*Math.pow(Math.abs(s),i);return[g,c,-O+2*O*t]}function Pt(t){const W=[];for(let s=0;s<=30;s++){const r=s/30,i=new Array(44).fill(0),g=44/4;for(let c=1;c<=44/2;c++)for(const u of[1,-1]){const n=(g+u*c+44)%44,l=(g+u*(c-1)+44)%44,b=$(r,n/44),v=$(r,l/44);i[n]=i[l]+u*Math.hypot(b[0]-v[0],b[1]-v[1])}W.push(i)}t.patch(44,30,(s,r,i,g)=>{const c=$(r,s),u=i>44/2&&i<44;return[c[0],c[1],c[2],u?1:0,2*O*r,W[g][i]]},!0,!0),t.patch(44,1,(s,r)=>{const i=$(1,s);return r<.5?[i[0],i[1],i[2],6]:[0,dt(1)+1,O,6]},!0,!0);for(const s of ht){const r=c=>.42+.63*(1-(1-c)*(1-c)),i=c=>O-.35+2.05*c,g=(c,u,n,l)=>[s[0]+Math.cos(c*2*Math.PI)*u,s[1]+Math.sin(c*2*Math.PI)*u,n,l,c,n];t.patch(16,5,(c,u)=>g(c,r(u),i(u),3),!0,!0),t.patch(16,5,(c,u)=>g(c,r(u)-.05,i(u),4),!0,!1),t.patch(16,1,(c,u)=>g(c,r(1)-.05*u,i(1),3),!0,!0),t.patch(16,1,(c,u)=>g(c,u<.5?0:r(0)-.05,i(0)+.02,4),!0,!0)}for(const[s,r]of[[.2,.035],[.2,.465],[.9,.04],[.9,.46]]){const i=$(s,r),g=Math.sign(i[0]);t.patch(10,6,(c,u)=>{const n=(u-.5)*Math.PI,l=Math.cos(n),b=c*2*Math.PI;return[i[0]+g*(.1+.34*l*Math.cos(b)),i[1]+.12+.3*l*Math.sin(b),i[2]+.75*Math.sin(n),6]},!0,g<0)}{const s=$(.965,.25);t.tube(new e.Vector3(0,s[1]-.05,s[2]),new e.Vector3(0,s[1]+.2,s[2]),.13,.1,8,6)}for(const s of ut){const r=new e.Vector3(s.hinge[0],s.hinge[1],s.hinge[2]),i=new e.Vector3(s.pad[0],ot,s.pad[2]),g=l=>(l[4]=r.x,l[5]=r.z,l[6]=r.y+.07,l),c=t.idx.length,u=new e.Vector3().lerpVectors(r,i,.52),n=new e.Vector3(i.x,ot+.42,i.z);t.tube(r,u,.3,.28,12,3),t.tube(u,n,.19,.19,10,3),t.tube(new e.Vector3(r.x*.55,r.y,r.z+(s.hinge[2]<0?1.5:-1.5)),u,.085,.085,6,3),t.tube(n,new e.Vector3(i.x,ot+.16,i.z),.3,it,20,3),t.tube(new e.Vector3(i.x,ot+.16,i.z),i,it,it*.96,20,3),t.foldFrom(c,g)}}const ht=[[-1.8,2.15],[1.8,2.15]],ot=-(vt+bt.depth),it=.82,ut=[{hinge:[-1.7,0,-3.7],pad:[-3,0,-4.4]},{hinge:[1.7,0,-3.7],pad:[3,0,-4.4]},{hinge:[-3,0,4.7],pad:[-4.5,0,5.4]},{hinge:[3,0,4.7],pad:[4.5,0,5.4]}],Rt=(()=>{const t=$(.965,.25);return[0,t[1]+.3,t[2]]})(),pt=`
vec3 kcTurn(vec3 d, vec4 r, float t) {
  float ax = r.z * sin(t * r.w + r.x), az = 0.8 * r.z * sin(t * r.w * 0.83 + r.y);
  float cx = cos(ax), sx = sin(ax), cz = cos(az), sz = sin(az);
  d = vec3(d.x, cx * d.y - sx * d.z, sx * d.y + cx * d.z);
  return vec3(cz * d.x - sz * d.y, sz * d.x + cz * d.y, d.z);
}
vec3 kcRock(vec3 p, vec3 c, vec4 r, float t) { return c + kcTurn(p - c, r, t) + vec3(0., 0.025 * sin(t * r.w * 1.3 + r.x + r.y), 0.); }
`,mt=`
attribute vec4 aK; uniform float uFold; uniform float uTime;
varying vec3 vW; varying vec3 vN; varying vec4 vK; varying vec3 vL;
#ifdef ROCK
attribute vec3 aC; attribute vec4 aR;
${pt}
#endif
void main() {
  vec3 p = position, n = normal;
  vL = p; vK = aK;
#ifdef ROCK
  p = kcRock(p, aC, aR, uTime); n = kcTurn(n, aR, uTime);
#else
  if (aK.w > -100.) { p = mix(p, vec3(aK.y, aK.w, aK.z), uFold); vK.yz = vec2(0.); }     // a leg, drawn in to its hinge
#endif
  vec4 w = modelMatrix * vec4(p, 1.);
  vW = w.xyz; vN = mat3(modelMatrix) * n;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,xt=`
//<LIGHT>
uniform float uFold;
varying vec3 vW; varying vec3 vN; varying vec4 vK; varying vec3 vL;
float kcHash(vec2 p) { p = fract(p * vec2(0.1031, 0.1130)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
// lines w metres wide at every p metres of x, as a pixel of this footprint sees them: fine lines fade to their mean
float kcLine(float x, float p, float w) {
  float f = fwidth(x) + 1e-5, d = abs(fract(x / p + 0.5) - 0.5) * p;
  return mix(clamp((0.5 * w + 0.5 * f - d) / f, 0., min(1., w / f)), w / p, smoothstep(0.5 * p, p, f));
}
void main() {
  vec3 N = vN / sqrt(max(dot(vN, vN), 1e-10)); if (!gl_FrontFacing) N = -N;
  vec3 toEye = cameraPosition - vW; float dist = sqrt(max(dot(toEye, toEye), 1e-4)); vec3 V = toEye / dist;
  float k = vK.x, u = vK.y, v = vK.z, f0 = 0.04, gloss = 0.5;
  vec3 alb = vec3(0.4, 0.41, 0.43), glow = vec3(0.);
  if (k < 1.5 || (k > 4.5 && k < 5.5 && gl_FrontFacing)) {
    // WHITE CERAMIC PANELS in courses 1.6 m long, each course half a panel out of step with the last, with fine
    // dark lines between them; every panel has a tone of its own (a few percent)
    float row = floor(u / 1.6), vv = v + 0.55 * mod(row, 2.), fw = fwidth(u) + fwidth(v);
    float lines = max(kcLine(u, 1.6, 0.024), kcLine(vv, 1.1, 0.024));
    float tone = mix(0.5, kcHash(vec2(row, floor(vv / 1.1))), 1. - smoothstep(0.3, 1.0, fw));
    alb = vec3(0.80, 0.795, 0.775) * (0.92 + 0.08 * tone);
    alb = mix(alb, vec3(0.2, 0.2, 0.21), 0.85 * lines);
    if (k < 1.5) {
      // soot of many descents, faint, low on the flanks, in streaks that run aft
      float st = mix(0.5, kcHash(vec2(floor(v * 9.), 7.)), 1. - smoothstep(0.03, 0.1, fwidth(v)));
      alb *= 1. - (0.1 + 0.16 * st) * (1. - smoothstep(0.9, 2.3, vL.y)) * smoothstep(0.5, 3., u);
      // THE WINDOW BAND across the nose: five dark panes in a row, wrapped over the top of the nose
      float pane = floor(v / 0.95 + 0.5), dv = v - 0.95 * pane;
      vec2 q = abs(vec2(u - 2.75 - 0.12 * abs(pane), dv)) - vec2(0.95 - 0.1 * abs(pane), 0.40) + 0.13;
      float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - 0.13, aa = 0.7 * fw + 1e-4;
      float inBand = step(abs(pane), 2.5);
      float frame = inBand * (1. - smoothstep(0.035 - aa, 0.035 + aa, d)), glass = inBand * (1. - smoothstep(-aa, aa, d));
      alb = mix(alb, vec3(0.13, 0.135, 0.14), frame);
      alb = mix(alb, vec3(0.010, 0.012, 0.016), glass); f0 = mix(f0, 0.09, glass); gloss = mix(gloss, 1., glass);
      // THE HEAT TILES of the belly and the chines: small dark tiles, each a shade of its own
      float tile = clamp((k - 0.5) / max(fwidth(k), 1e-4) + 0.5, 0., 1.);
      vec2 tq = vL.xz / 0.34; tq.x += 0.5 * mod(floor(tq.y), 2.);
      float tf = fwidth(vL.x) + fwidth(vL.z), tl = max(kcLine(vL.z, 0.34, 0.02), kcLine(tq.x * 0.34, 0.34, 0.02));
      vec3 dark = vec3(0.040, 0.041, 0.046) * (0.7 + 0.6 * mix(0.5, kcHash(floor(tq)), 1. - smoothstep(0.1, 0.34, tf)));
      alb = mix(alb, mix(dark, vec3(0.014), 0.7 * tl), tile); f0 = mix(f0, 0.03, tile); gloss = mix(gloss, 0.25, tile);
    }
  } else if (k < 3.5) {                       // strut metal; the bells' outside is darker, burnt
    alb = mix(vec3(0.30, 0.29, 0.28), vec3(0.075, 0.07, 0.068), step(${(O-.4).toFixed(2)}, vL.z)); f0 = 0.45; gloss = 0.3;
  } else if (k < 4.5) {                       // a bell's inside: dark; blue-white when it burns, brightest at the throat
    alb = vec3(0.03); f0 = 0.3; gloss = 0.2;
    glow = vec3(0.55, 0.75, 1.0) * uFold * (0.8 + 4.2 * (1. - smoothstep(${(O-.4).toFixed(2)}, ${(O+1.7).toFixed(2)}, vL.z)));
  } else if (k < 5.5) {
    // a panel's inside: grey, ribbed: stringers every 0.45 m along it, a frame every 1.3 m across them
    float rib = max(kcLine(v, 0.45, 0.07), kcLine(u, 1.3, 0.09)), sh = max(kcLine(v - 0.06, 0.45, 0.06), kcLine(u - 0.07, 1.3, 0.07));
    alb = vec3(0.27, 0.28, 0.30) * (1. - 0.45 * sh * (1. - rib)) + vec3(0.2) * rib; gloss = 0.2;
  }
  float wet = 1. - smoothstep(0.02, 0.2, vW.y);                       // wet where the water has lapped it
  alb *= 1. - 0.3 * wet; gloss = mix(gloss, 0.9, 0.6 * wet);
  // THE LIGHT: the hole's gold where the skin turns to it (cut by the wave's shade), the sky's cool fill, and a
  // sheen that mirrors the sky (the gold rim against the light)
  float lit = kdLit(vW), ndl = dot(N, KD_HOLE_DIR), ndv = clamp(dot(N, V), 0., 1.), g = 1. - ndv, g2 = g * g;
  vec3 fill = mix(vec3(0.078, 0.092, 0.10), vec3(0.115, 0.155, 0.22), 0.5 + 0.5 * N.y) * 1.35 * (0.7 + 0.3 * lit);
  vec3 col = alb * (fill + KD_GOLD * (1.02 * max(ndl, 0.) + 0.35 * g2 * g * smoothstep(-0.4, 0.4, ndl)) * lit);
  vec3 R = reflect(-V, N); R.y = abs(R.y) + 0.02; R /= sqrt(dot(R, R));
  vec3 env = mix(KD_DEEP, min(kdSky(R), vec3(3.)), kdOpen(vW, R));
  col = mix(col, env, (f0 + (1. - f0) * g2 * g2 * g) * gloss) + glow;
  if (vW.y < 0.) col = mix(col, vec3(0.045, 0.10, 0.11), clamp(-vW.y * 1.4, 0., 0.75));      // seen through the water
  gl_FragColor = vec4(kdHaze(col, vW), 1.);
}`,Nt=`
attribute vec3 aCen; attribute vec4 aPar;
uniform mat4 uShip; uniform vec4 uGlow;       // uGlow: x the engines' burn, y the clock, z metres a pixel covers at 1 m
uniform vec3 uBeacon; uniform vec4 uBeaconRock;
varying vec3 vUV; varying vec4 vCol; varying vec3 vW;
${pt}
void main() {
  float kind = aPar.z, T = uGlow.y, str = 1.;
  vec3 C = aPar.y > 0.5 ? (uShip * vec4(aCen, 1.)).xyz : kcRock(aCen, uBeacon, uBeaconRock, T);
  vec3 toEye = cameraPosition - C; float dist = sqrt(max(dot(toEye, toEye), 1e-4)), px = dist * uGlow.z;
  vec3 rt = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  float flick = 0.9 + 0.1 * sin(T * 31. + aPar.w) * sin(T * 17.3 + 2. * aPar.w);
  vec3 P = C; vec3 tint = vec3(1.);
  if (kind < 0.5) {                           // a flame: never under three pixels across its glow (a pixel and a half its core)
    P = C + (rt * position.x + up * position.y) * max(aPar.x, 3. * px);
    str = uGlow.x * flick; tint = vec3(0.62, 0.80, 1.0);
  } else if (kind < 1.5) {                    // its plume, turned to the eye; thin and long, it fades as it gets finer than a pixel
    vec3 ax = (uShip * vec4(0., 0., 1., 0.)).xyz; float t = 0.5 + 0.5 * position.x;
    vec3 Q = C + ax * t * aPar.x, te = cameraPosition - Q, sd = cross(ax, te);
    float sl = sqrt(max(dot(sd, sd), 1e-8)), w = mix(0.9, 0.3, t), wmin = 0.9 * px;
    P = Q + sd / sl * position.y * max(w, wmin);
    str = uGlow.x * flick * min(1., w / wmin) * smoothstep(0.1, 0.45, sl / sqrt(max(dot(te, te), 1e-8))); tint = vec3(0.45, 0.66, 1.0);
  } else if (kind < 3.5) {                    // a lamp: white at the craft's tail (a slow blink), amber on the float
    float R = max(aPar.x, 2.5 * px), ph = fract(T / (kind < 2.5 ? 2.7 : 1.9) + aPar.w);
    P = C + (rt * position.x + up * position.y) * R;
    str = smoothstep(0., 0.09, ph) * (1. - smoothstep(0.15, 0.36, ph)) * min(1., aPar.x / R);
    tint = kind < 2.5 ? vec3(1.0, 0.97, 0.90) : vec3(1.0, 0.50, 0.10);
  } else {                                    // the amber lamp's streak on the water: where the water mirrors it to this eye
    vec2 d = cameraPosition.xz - C.xz; float D = sqrt(max(dot(d, d), 1e-4)), H = max(cameraPosition.y, 0.5), ph = fract(T / 1.9 + aPar.w);
    float m = D * C.y / (C.y + H), t = 0.5 + 0.5 * position.x; d /= D;
    vec2 q = C.xz + d * m * mix(0.35, 2.2, t) + vec2(-d.y, d.x) * position.y * (0.16 + 0.5 * px + 0.25 * t);
    P = vec3(q.x, 0.03, q.y);
    str = 0.42 * smoothstep(0., 0.09, ph) * (1. - smoothstep(0.15, 0.36, ph)) * (1. - smoothstep(20., 60., m)); tint = vec3(1.0, 0.50, 0.10);
  }
  vUV = vec3(position.xy, kind); vCol = vec4(tint, str); vW = P;
  gl_Position = str > 0.002 ? projectionMatrix * viewMatrix * vec4(P, 1.) : vec4(2., 2., 2., 1.);       // a light that is out is not drawn
}`,Lt=`
//<LIGHT>
uniform vec4 uGlow;
varying vec3 vUV; varying vec4 vCol; varying vec3 vW;
void main() {
  float kind = vUV.z, r2 = dot(vUV.xy, vUV.xy), edge = 1. - smoothstep(0.55, 1., r2), b = 0.;
  vec3 col = vCol.rgb;
  if (kind < 0.5) { b = 5.2 * exp(-r2 * 20.) + 0.8 * exp(-r2 * 4.) * edge; col = mix(vec3(0.3, 0.55, 1.0), vec3(0.86, 0.93, 1.0), exp(-r2 * 12.)); }
  else if (kind < 1.5) { float t = 0.5 + 0.5 * vUV.x, it = 1. - t; b = (0.25 + 2.6 * it * it * it) * it * exp(-vUV.y * vUV.y * 4.5) * (1. - vUV.y * vUV.y) * (0.82 + 0.18 * cos(t * 30. - uGlow.y * 9.)); }
  else if (kind < 3.5) { b = 3.4 * exp(-r2 * 22.) + 0.4 * exp(-r2 * 4.) * edge; col = mix(col, vec3(1., 0.95, 0.85), 0.6 * exp(-r2 * 30.)); }
  else { float t = 0.5 + 0.5 * vUV.x, y = vUV.y; b = sin(3.14159 * t) * (1. - y * y) * (1. - y * y) * (0.7 + 0.3 * sin(t * 23. - uGlow.y * 2.3)); }
  col *= b * vCol.a;
  gl_FragColor = vec4(kdHaze(col, vW) - kdHaze(vec3(0.), vW), 1.);       // added light, thinned by the air between
}`,U=26,Tt=`
uniform vec3 uTrail[${U}]; uniform vec4 uGlow;
varying vec3 vT; varying vec3 vW;
void main() {
  int i = int(position.x + 0.5); float t = position.x / ${(U-1).toFixed(1)};
  vec3 C = uTrail[i], tang = uTrail[i < ${U-1} ? i + 1 : i] - uTrail[i > 0 ? i - 1 : i];
  vec3 te = cameraPosition - C, sd = cross(tang, te); float sl = sqrt(max(dot(sd, sd), 1e-8)), dist = sqrt(max(dot(te, te), 1e-4));
  float w = mix(0.7, 4.2, sqrt(t)), wmin = 0.8 * dist * uGlow.z;
  vec3 P = C + sd / sl * position.y * max(w, wmin);
  vT = vec3(t, position.y, uGlow.x * min(1., w / wmin)); vW = P;
  gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
}`,Ft=`
//<LIGHT>
varying vec3 vT; varying vec3 vW;
void main() {
  float q = 1. - vT.y * vT.y, t = vT.x;
  float a = q * q * smoothstep(0., 0.06, t) * (1. - t) * (1. - t) * 0.5 * vT.z;
  vec3 col = vec3(0.80, 0.82, 0.85) * (vec3(0.16, 0.2, 0.27) + KD_GOLD * 0.55 * kdLit(vW));
  gl_FragColor = vec4(kdHaze(col, vW), a);
}`,Gt=`
attribute vec3 aQ; varying vec3 vQ; varying vec3 vW;
void main() { vQ = aQ; vW = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }`,Ct=`
//<LIGHT>
uniform vec4 uRing;                           // x: 1 while the craft stands in the water, y: the clock
varying vec3 vQ; varying vec3 vW;
void main() {
  float r = sqrt(max(dot(vQ.xy, vQ.xy), 1e-6)); vec2 rd = vQ.xy / r;
  float ph = r * 6.4 - uRing.y * 2.0 + vQ.z;                                   // rings a metre apart, spreading at 0.3 m/s
  float env = smoothstep(0.3, 0.7, r) * (1. - smoothstep(1.0, 3.9, r)) * uRing.x * (1. - smoothstep(1.0, 2.6, fwidth(ph)));
  float tilt = cos(ph) * env * 0.085;
  vec3 V = cameraPosition - vW; V /= sqrt(max(dot(V, V), 1e-6));
  vec3 N = vec3(-rd.x * tilt, 1., -rd.y * tilt); N /= sqrt(dot(N, N));
  vec3 R = reflect(-V, N); R.y = abs(R.y) + 0.01; R /= sqrt(dot(R, R));
  vec3 sky = mix(KD_DEEP, min(kdSky(R), vec3(1.3)), kdOpen(vW, R));
  gl_FragColor = vec4(kdHaze(sky, vW), clamp(abs(tilt) * 9., 0., 0.6));
}`,Et=`
attribute vec4 aK; uniform float uFold;
varying vec3 vW; varying vec3 vN; varying vec4 vK; varying vec3 vP;
void main() {
  vec3 p = position;
  if (aK.w > -100.) p = mix(p, vec3(aK.y, aK.w, aK.z), uFold);
  vec4 w = modelMatrix * vec4(p, 1.);
  vW = w.xyz; vN = mat3(modelMatrix) * normal; vK = aK;
  vec3 m = vec3(w.x, -w.y, w.z), ray = m - cameraPosition;                     // the mirrored point and the line of sight to it
  float len = sqrt(max(dot(ray, ray), 1e-6)), t = clamp((cameraPosition.y - 0.02) / max(cameraPosition.y - m.y, 1e-3), 0., 1.);
  // nearer parts of the image lie a little nearer the eye on the same line of sight (so the nearest is the one seen):
  // by their distance against the distance of the craft's own middle
  vec3 mid = vec3(modelMatrix[3].x, -modelMatrix[3].y - 2., modelMatrix[3].z) - cameraPosition;
  float pull = 0.1 + 0.9 * clamp(0.5 + (sqrt(dot(mid, mid)) - len) / 28., 0., 1.);
  vP = cameraPosition + ray * max(t - pull / len, 0.);
  gl_Position = projectionMatrix * viewMatrix * vec4(vP, 1.);
  // what stands under the water has no image; nor has a bell's inside (its outside stands for it); none once it flies
  if (w.y < 0. || cameraPosition.y < 0.3 || uFold > 0.999 || (aK.x > 3.5 && aK.x < 4.5)) gl_Position = vec4(2., 2., 2., 1.);
}`,It=`
//<LIGHT>
uniform float uFold;
varying vec3 vW; varying vec3 vN; varying vec4 vK; varying vec3 vP;
void main() {
  vec3 N = vN / sqrt(max(dot(vN, vN), 1e-10)); if (gl_FrontFacing) N = -N;      // (the mirror turns the faces round)
  float k = vK.x;
  vec3 alb = k < 0.5 ? vec3(0.78) : k < 1.5 ? vec3(0.04) : k < 3.5 ? vec3(0.2) : k < 4.5 ? vec3(0.03) : vec3(0.4);
  vec3 col = alb * (mix(vec3(0.078, 0.092, 0.10), vec3(0.115, 0.155, 0.22), 0.5 + 0.5 * N.y) * 1.3 + KD_GOLD * 1.02 * max(dot(N, KD_HOLE_DIR), 0.) * kdLit(vW));
  vec3 V = cameraPosition - vP; float dist = sqrt(max(dot(V, V), 1e-6)), c = clamp(V.y / dist, 0., 1.), g = 1. - c;
  float mirror = 0.02 + 0.98 * g * g * g * g * g;
  col = mix(vec3(0.05, 0.085, 0.09), col, mirror);                             // the dark water under the craft, and its image in it
  gl_FragColor = vec4(kdHaze(col, vP), 0.9 * (1. - uFold) * (1. - smoothstep(260., 520., dist)));
}`;async function St(t,B){const k=new e.Group;k.name="craft";const W=B.light,s=[],r={...W.uniforms,uFold:{value:0},uTime:{value:0},uGlow:{value:new e.Vector4(0,0,.003,0)},uShip:{value:null},uBeacon:{value:new e.Vector3},uBeaconRock:{value:new e.Vector4},uTrail:{value:new Float32Array(3*U)},uRing:{value:new e.Vector4}},i=(a,f,o={})=>{const h=new e.ShaderMaterial({uniforms:r,vertexShader:a,fragmentShader:f.replace("//<LIGHT>",W.GLSL),...o});return s.push(h),h},g=new e.Group;g.matrixAutoUpdate=!1,k.add(g),r.uShip.value=g.matrixWorld;const c=ft();Pt(c);const u=c.geometry();s.push(u);const n=new e.Mesh(u,i(mt,xt,{side:e.DoubleSide}));n.frustumCulled=!1,g.add(n),await t.yield();const l={pos:[],cen:[],par:[],idx:[]},b=(a,f,o,h,y)=>{const R=l.pos.length/3;for(const[S,T]of[[-1,-1],[1,-1],[-1,1],[1,1]])l.pos.push(S,T,0),l.cen.push(a[0],a[1],a[2]),l.par.push(f,o,h,y);l.idx.push(R,R+1,R+2,R+2,R+1,R+3)};ht.forEach((a,f)=>{const o=[a[0],a[1],O+1.72];b(o,11,1,1,1.7+2.9*f),b(o,2.4,1,0,1.7+2.9*f)}),b(Rt,.42,1,2,0);const v=t.core.makeRng(t.core.hashSeed("knee-deep-under-the-wave:craft:"+t.seed)),x=Q.panels,p=5+Math.floor(v()*3),P=Math.floor(v()*8),V=v()<.5,w=[0,1,2,3,4,5,6,7];for(let a=7;a>0;a--){const f=Math.floor(v()*(a+1)),o=w[a];w[a]=w[f],w[f]=o}const M=ft();for(let a=0;a<=p;a++){const f=w[a],o={len:2+3*v(),wid:1.6+1.5*v(),bend:3.6+2.6*v(),sag:16+16*v(),up:v()<.62,yaw:v()*Math.PI*2,tx:(v()-.5)*.2,tz:(v()-.5)*.2,jx:v()-.5,jz:v()-.5,p1:v()*6.283,p2:v()*6.283,amp:.02+.025*v(),rate:.5+.4*v(),cut0:.35*v(),cut1:.35*v()};{const m=Math.min(1,2.5/(.5*Math.hypot(o.len,o.wid)));o.len*=m,o.wid*=m}let h=(P+3*f)%8;V&&(h=7-h);const y=a===p,R=y?.6:.5*Math.hypot(o.len,o.wid)+.15,S=-x.clear-R,T=x.x-x.across/2+R,F=Math.min(S,Math.max(T,T+(S-1.2-T)*(h+.5+.5*o.jx)/8)),G=x.z-x.along/2+x.along*(f+.5+.24*o.jz)/8;if(y){const m=(d,N=0)=>new e.Vector3(F+N,d,G);M.tagWith([F,0,G,o.p1,o.p2,.035,.9]),M.tube(m(-.3),m(.26),.5,.5,14,6),M.tube(m(.26),m(.44),.5,.12,14,6),M.tube(m(.4),m(1.86),.05,.045,6,3),M.tube(m(1.84),m(1.97),.1,.085,8,6),r.uBeacon.value.set(F,0,G),r.uBeaconRock.value.set(o.p1,o.p2,.035,.9),b([F,2,G],0,0,4,o.p1),b([F,2,G],.36,0,3,o.p1);continue}const H=o.up?.07+.5*o.wid*o.wid/(8*o.bend):.02,_=new e.Matrix4().makeRotationFromEuler(new e.Euler(o.tx,o.yaw,o.tz+(o.up?0:Math.PI),"YXZ")).setPosition(F,H,G),A=new e.Vector3,K=(m,d,N)=>{const D=.5-(d<.5?o.cut0*(1-2*d):o.cut1*(2*d-1))*(m<.5?.5:.15),q=(m-.5)*2*D*o.wid/o.bend,Y=(d-.5)*o.len;return A.set((o.bend-N)*Math.sin(q),(o.bend-N)*Math.cos(q)-o.bend-Y*Y/(2*o.sag),Y).applyMatrix4(_),[A.x,A.y,A.z,N?6:5,d*o.len,(m-.5)*o.wid]};M.tagWith([F,H,G,o.p1,o.p2,o.amp,o.rate]),M.patch(10,6,(m,d)=>K(m,d,0));const tt=(m,d)=>m<10?K(m/10,0,d):m<16?K(1,(m-10)/6,d):m<26?K(1-(m-16)/10,1,d):K(0,1-(m-26)/6,d);M.patch(32,1,(m,d,N,D)=>tt(N,D*.16),!0,!0)}await t.yield();{const a=M.geometry();s.push(a);const f=new e.Mesh(a,i(mt,xt,{side:e.DoubleSide,defines:{ROCK:1}}));f.frustumCulled=!1,k.add(f)}await t.yield();const C=(a,f,o,h=k)=>{const y=new e.Mesh(a,f);return y.frustumCulled=!1,y.renderOrder=o,a.boundingSphere=new e.Sphere(new e.Vector3,1/0),s.push(a),h.add(y),y},L={transparent:!0,depthWrite:!1,side:e.DoubleSide};{const a=new e.BufferGeometry;a.setAttribute("position",new e.Float32BufferAttribute(l.pos,3)),a.setAttribute("aCen",new e.Float32BufferAttribute(l.cen,3)),a.setAttribute("aPar",new e.Float32BufferAttribute(l.par,4)),a.setIndex(l.idx),C(a,i(Nt,Lt,{...L,blending:e.AdditiveBlending}),22)}{const a=[],f=[];for(let h=0;h<U;h++)if(a.push(h,-1,0,h,1,0),h){const y=2*h-2;f.push(y,y+1,y+2,y+2,y+1,y+3)}const o=new e.BufferGeometry;o.setAttribute("position",new e.Float32BufferAttribute(a,3)),o.setIndex(f),C(o,i(Tt,Ft,L),21)}await t.yield();{const a=new e.Mesh(u,i(Et,It,{transparent:!0,side:e.DoubleSide}));a.frustumCulled=!1,a.renderOrder=4,g.add(a)}{const a=new e.Vector3(Q.craft.nose[0],0,Q.craft.nose[1]).normalize(),f=new e.Vector3(-a.z,0,a.x),o=[],h=[],y=[],R=4.2;ut.forEach((T,F)=>{const G=Q.craft.x+f.x*T.pad[0]-a.x*T.pad[2],H=Q.craft.z+f.z*T.pad[0]-a.z*T.pad[2],_=o.length/3;for(const[A,K]of[[-1,-1],[1,-1],[-1,1],[1,1]])o.push(G+A*R,.025,H+K*R),h.push(A*R,K*R,1.9*F);y.push(_,_+2,_+1,_+1,_+2,_+3)});const S=new e.BufferGeometry;S.setAttribute("position",new e.Float32BufferAttribute(o,3)),S.setAttribute("aQ",new e.Float32BufferAttribute(h,3)),S.setIndex(y),C(S,i(Gt,Ct,L),6)}await t.yield();const z=new e.Vector3,E=new e.Vector3,I=new e.Vector3,j=new e.Vector3,J=new e.Vector3(0,1,0),wt=new e.Vector3(Q.craft.nose[0],0,Q.craft.nose[1]).normalize(),yt=()=>t.renderer&&t.renderer.domElement&&t.renderer.domElement.height||450,rt=(a,f)=>Math.atan2(f.x-a.x,a.z-f.z),Z=r.uTrail.value,st=9,gt=150;function ct(a,f,o){const h=X(f),y=h.flying;z.copy(wt);let R=0;if(y>0){const d=X(f-3),N=X(f+3);j.set(N.x-d.x,N.y-d.y,N.z-d.z),j.lengthSq()>1e-6&&z.lerp(j.normalize(),y).normalize();const D=X(f-9),q=X(f+9),Y=Math.hypot(q.x-D.x,q.z-D.z);if(Y>4){const lt=rt(h,q)-rt(D,h);R=Math.max(-.4,Math.min(.4,240*Math.atan2(Math.sin(lt),Math.cos(lt))/Y))*y}}if(E.crossVectors(z,J),E.lengthSq()<1e-6&&E.set(1,0,0),E.normalize(),I.crossVectors(E,z),R){const d=Math.cos(R),N=Math.sin(R);j.copy(I),I.multiplyScalar(d).addScaledVector(E,N),E.multiplyScalar(d).addScaledVector(j,-N)}const S=h.y+vt*(1-et((f-at.up)/60))+O*Math.abs(z.y)*y;g.matrix.set(E.x,I.x,-z.x,h.x,E.y,I.y,-z.y,S,E.z,I.z,-z.z,h.z,0,0,0,1),g.matrixWorldNeedsUpdate=!0,r.uFold.value=y,r.uTime.value=a,r.uRing.value.set(1-y,a,0,0),r.uGlow.value.set(y,a,2/((o&&o.projectionMatrix?o.projectionMatrix.elements[5]:1.54)*yt()),0);let T=0,F=h.x,G=h.y,H=h.z,_=0,A=0;const K=S-h.y+2.15*I.y,tt=2.15*I.x,m=2.15*I.z;for(;A<U&&T<320&&f-T>at.lift;){T+=2.5;const d=X(Math.max(f-T,at.lift)),N=Math.hypot(d.x-F,d.y-G,d.z-H);for(;A<U;){const D=st+(gt-st)*A/(U-1);if(D>_+N)break;const q=N>1e-6?(D-_)/N:0;Z[3*A]=F+(d.x-F)*q+tt,Z[3*A+1]=G+(d.y-G)*q+K,Z[3*A+2]=H+(d.z-H)*q+m,A++}_+=N,F=d.x,G=d.y,H=d.z}for(;A<U;A++)Z[3*A]=F+tt,Z[3*A+1]=G+K,Z[3*A+2]=H+m}return ct(0,0,null),{object:k,uniforms:r,update:ct,dispose(){for(const a of s)a.dispose()}}}export{St as buildCraft};
