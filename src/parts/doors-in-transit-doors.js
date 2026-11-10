import{DOOR as re,MARKED as V}from"./doors-in-transit-plan.js";import{SHED_SUN_GLSL as ie,shedSunUniform as W,shedBarsUniform as se}from"./doors-in-transit-shed-sun.js";const T=re.depth/2,G=.22,v=.085;function D(){const e=[],a=[],f=[],i=[],r=[],t=[],d=[],h=[],u={col:[1,1,1],paint:1,spill:0,emit:0,rough:.55,metal:0,hx:0,hy:0,ox:0,oy:0,gx:1,gy:0,pitch:0,grain:1,mk:0},c={st:u,set(n){return Object.assign(u,n),c},vert(n,o,s){return e.push(n[0],n[1],Math.max(-T,Math.min(T,n[2]))),a.push(o[0],o[1],o[2]),f.push(u.col[0],u.col[1],u.col[2]),i.push(u.paint,s===void 0?u.spill:s,u.emit,Math.min(.95,Math.max(.05,u.rough))+(u.metal?1:0)),r.push(n[0]-u.ox,n[1]-u.oy,u.hx,u.hy),t.push(u.gx,u.gy,u.pitch,u.grain+(c.strong&&u.paint>.5?4:0)),d.push(u.mk),e.length/3-1},poly(n,o){const s=n[0],l=n[1],g=n[2];let m=(l[1]-s[1])*(g[2]-s[2])-(l[2]-s[2])*(g[1]-s[1]),x=(l[2]-s[2])*(g[0]-s[0])-(l[0]-s[0])*(g[2]-s[2]),p=(l[0]-s[0])*(g[1]-s[1])-(l[1]-s[1])*(g[0]-s[0]);const k=Math.hypot(m,x,p)||1;m/=k,x/=k,p/=k;const w=e.length/3;for(let y=0;y<n.length;y++)c.vert(n[y],[m,x,p],o?o[y]:void 0);for(let y=1;y<n.length-1;y++)h.push(w,w+y,w+y+1);return c},quad(n,o,s,l,g){return c.poly([n,o,s,l],g)},face(n,o,s,l,g,m,x){return m>0?c.quad([n,s,g],[o,s,g],[o,l,g],[n,l,g],x):c.quad([o,s,g],[n,s,g],[n,l,g],[o,l,g],x?[x[1],x[0],x[3],x[2]]:void 0)},box(n,o,s,l,g,m,x=""){return x.includes("f")||c.quad([n,s,m],[o,s,m],[o,l,m],[n,l,m]),x.includes("k")||c.quad([o,s,g],[n,s,g],[n,l,g],[o,l,g]),x.includes("r")||c.quad([o,s,m],[o,s,g],[o,l,g],[o,l,m]),x.includes("l")||c.quad([n,s,g],[n,s,m],[n,l,m],[n,l,g]),x.includes("u")||c.quad([n,l,m],[o,l,m],[o,l,g],[n,l,g]),x.includes("d")||c.quad([n,s,g],[o,s,g],[o,s,m],[n,s,m]),c},triangles(){return h.length/3},classBox(n,o){const s=[1e9,-1e9,1e9,-1e9];for(let l=0;l<d.length;l++)d[l]>o&&e[l*3+2]*n>0&&(s[0]=Math.min(s[0],e[l*3]),s[1]=Math.max(s[1],e[l*3]),s[2]=Math.min(s[2],e[l*3+1]),s[3]=Math.max(s[3],e[l*3+1]));return s},geometry(n){const o=new n.BufferGeometry;return o.setAttribute("position",new n.Float32BufferAttribute(e,3)),o.setAttribute("normal",new n.Float32BufferAttribute(a,3)),o.setAttribute("color",new n.Float32BufferAttribute(f,3)),o.setAttribute("aDoor",new n.Float32BufferAttribute(i,4)),o.setAttribute("aEdge",new n.Float32BufferAttribute(r,4)),o.setAttribute("aTex",new n.Float32BufferAttribute(t,4)),c.marks&&o.setAttribute("aMark",new n.Float32BufferAttribute(d,1)),o.setIndex(e.length/3>65535?new n.Uint32BufferAttribute(h,1):new n.Uint16BufferAttribute(h,1)),o.computeBoundingBox(),o.computeBoundingSphere(),o}};return c}function Te(e,a){const f=new e.Color(a);return[f.r,f.g,f.b]}function R(e,a,f,i,r,t,d){return a>0?e.quad(f,i,r,t,d):e.quad(t,r,i,f,d?[d[3],d[2],d[1],d[0]]:void 0)}function N(e,a,f,i,r,t,d,h,u){const c=Math.min(r,t),n=Math.max(r,t),o=r<t?h:u,s=r<t?u:h;return d<0?e.quad([a,f,c],[a,f,n],[a,i,n],[a,i,c],[o,s,s,o]):e.quad([a,f,n],[a,f,c],[a,i,c],[a,i,n],[s,o,o,s])}function _(e,a,f,i,r,t,d,h,u){const c=Math.min(r,t),n=Math.max(r,t),o=r<t?h:u,s=r<t?u:h;return d>0?e.quad([f,a,n],[i,a,n],[i,a,c],[f,a,c],[s,s,o,o]):e.quad([f,a,c],[i,a,c],[i,a,n],[f,a,n],[o,o,s,s])}function L(e,a,f,i,r){return e.set({ox:(a+f)/2,oy:(i+r)/2,hx:(f-a)/2,hy:(r-i)/2})}function fe(e,a,f,i,r){return e.set({ox:a,oy:i,hx:-r,hy:i-f})}function S(e){return e.set({hx:0,hy:0,ox:0,oy:0})}function $(e,a,f,i,r,t,d,h,u,c=.1){const n=t-d*h,o=e.st.col,s=(l,g,m,x,p,k,w,y,P,b)=>{R(e,d,[l,m,p],[g,m,p],[w,y,b],[k,y,b]),R(e,d,[g,m,p],[g,x,p],[w,P,b],[w,y,b]),R(e,d,[g,x,p],[l,x,p],[k,P,b],[w,P,b]),R(e,d,[l,x,p],[l,m,p],[k,y,b],[k,P,b])};if(s(a,f,i,r,t,a+c,f-c,i+c,r-c,n),u==="field"&&f-a>5*c&&r-i>5*c){const l=c*2.3,g=n+d*h*.7;e.set({col:[o[0]*.9,o[1]*.9,o[2]*.9]}),s(a+c,f-c,i+c,r-c,n,a+l,f-l,i+l,r-l,g),e.set({col:o}),e.face(a+l,f-l,i+l,r-l,g,d)}else e.set({col:[o[0]*.88,o[1]*.88,o[2]*.88]}),e.face(a+c,f-c,i+c,r-c,n,d),e.set({col:o})}function Z(e,a,f,i,r,t,d,h){const u=a.length,c=f.length;e.set({gx:1,gy:0});for(let n=0;n<u-1;n+=2)e.face(a[n],a[n+1],f[0],f[c-1],i,r);e.set({gx:0,gy:1});for(let n=1;n<u-1;n+=2)for(let o=0;o<c-1;o+=2)e.face(a[n],a[n+1],f[o],f[o+1],i,r);e.set({gx:1,gy:0});for(let n=1;n<u-1;n+=2)for(let o=1;o<c-1;o+=2)$(e,a[n],a[n+1],f[o],f[o+1],i,r,t,d,h)}function F(e,a,f,i,r,t,d,h){const u=a/2,c=u-i,n=u-i*.5,o=f-r,s=f-r*.5,l=.165;S(e),e.set({paint:e.fp===void 0?2:e.fp,col:d,rough:.62,metal:0,pitch:0,grain:.8,emit:0,spill:0,gx:1,gy:0}),e.noHalo||e.set({ox:0,oy:(t+o)/2,hx:c,hy:(o-t)/2,spill:2});for(const g of[-1,1]){const m=Math.min(g*u,g*n),x=Math.max(g*u,g*n);e.box(m,x,0,f,-G,G,"d"),e.box(Math.min(g*n,g*c),Math.max(g*n,g*c),t,s,-l,l,"lrud"),N(e,g*c,t,o,v,l,-g,1,.12),N(e,g*c,t,o,-v,-l,-g,1,.12)}return e.set({gx:0,gy:1}),e.box(-n,n,s,f,-G,G,"lr"),e.box(-c,c,o,s,-l,l,"lrud"),_(e,o,-c,c,v,l,-1,1,.12),_(e,o,-c,c,-v,-l,-1,1,.12),e.set({paint:0,col:h||d,rough:.7}),e.box(-n,n,0,t,-T,T,"u"),_(e,t,-n,n,v,T,1,1,.1),_(e,t,-n,n,-v,-T,1,1,.1),S(e),e.set({spill:0}),{x0:-c,x1:c,y0:t,y1:o}}function I(e,a,f,i,r=0,t=Math.PI){const d=[];for(let h=0;h<=i;h++){const u=r+(t-r)*h/i;d.push([e+f*Math.cos(u),a+f*Math.sin(u)])}return d}function J(e,a,f,i,r,t,d,h=10,u=0){const c=a/2,n=c-i,o=f-c,s=G,l=v;S(e),e.set({paint:e.fp===void 0?2:e.fp,col:t,rough:.62,metal:0,pitch:0,grain:.8,emit:0,spill:0,gx:1,gy:0}),e.set({ox:0,oy:o,hx:-n,hy:o-r,spill:2});for(const x of[-1,1])e.box(Math.min(x*c,x*n),Math.max(x*c,x*n),u,o,-s,s,"u"+(x>0?"l":"r")),N(e,x*n,r,o,l,s,-x,1,.12),N(e,x*n,r,o,-l,-s,-x,1,.12);const g=I(0,o,c,h),m=I(0,o,n,h);e.set({gx:0,gy:1});for(let x=0;x<h;x++){const p=g[x],k=g[x+1],w=m[x],y=m[x+1];e.quad([w[0],w[1],s],[p[0],p[1],s],[k[0],k[1],s],[y[0],y[1],s]),e.quad([y[0],y[1],-s],[k[0],k[1],-s],[p[0],p[1],-s],[w[0],w[1],-s]),e.quad([p[0],p[1],s],[p[0],p[1],-s],[k[0],k[1],-s],[k[0],k[1],s]),e.quad([w[0],w[1],l],[w[0],w[1],s],[y[0],y[1],s],[y[0],y[1],l],[1,.12,.12,1]),e.quad([w[0],w[1],-s],[w[0],w[1],-l],[y[0],y[1],-l],[y[0],y[1],-s],[.12,1,1,.12])}return e.set({paint:0,col:d||t,rough:.7,gx:0,gy:1}),e.box(-n,n,u,r,-T,T,"u"),_(e,r,-n,n,l,T,1,1,.1),_(e,r,-n,n,-l,-T,1,1,.1),S(e),e.set({spill:0}),{r:n,y0:r,ys:o}}function U(e,a,f,i,r,t,d=10){const h=[[-a,f,r],[a,f,r]];for(const u of I(0,i,a,d))h.push([u[0],u[1],r]);return t<0&&h.reverse(),e.poly(h)}const ce=[.07,.07,.075],B=[1,1,1],K=[.72,.5,.16],C=[.42,.4,.35],Q=[.2,.13,.07],X=[.55,.6,.62];function q(e,a){return S(e),e.set({paint:0,col:a||ce,rough:a?.42:.8,metal:a?1:0,pitch:0,grain:0,emit:0,spill:0})}function le(e,a,f,i,r){return a?e.poly([r,i,f]):e.poly([f,i,r])}function O(e,a,f,i,r,t,d,h){const u=[a,f,i+r*d],c=h?[[a,f-t,i],[a+t,f,i],[a,f+t,i],[a-t,f,i]]:[[a-t,f-t,i],[a+t,f-t,i],[a+t,f+t,i],[a-t,f+t,i]];for(let n=0;n<4;n++)le(e,r<0,c[n],c[(n+1)%4],u)}function A(e,a,f,i,r,t,d=.22){const h=Math.sign(i),u=Math.abs(i),c=r+t*.035,n=h*t<0,o=g=>a+h*g,s=[[o(0),f-d,c],[o(u*.86),f-d*.42,c],[o(u),f,c],[o(u*.86),f+d*.42,c],[o(0),f+d,c]];e.poly(n?s.slice().reverse():s);const l=(g,m)=>{const x=[g[0],g[1],r],p=[m[0],m[1],r];return n?e.quad(g,x,p,m):e.quad(x,g,m,p)};l(s[1],s[0]),l(s[2],s[1]),l(s[3],s[2]),l(s[4],s[3]),e.box(Math.min(o(-.16),o(.02)),Math.max(o(-.16),o(.02)),f-d*1.25,f+d*1.25,t>0?r:r+t*.1,t>0?r+t*.1:r,t>0?"k":"f"),O(e,o(u*.2),f,c,t,.055,.04),O(e,o(u*.55),f,c,t,.05,.04)}function Y(e,a,f,i,r,t,d=6){e.box(a-t*1.25,a+t*1.25,f-t*1.25,f+t*1.25,r>0?i:i-.03,r>0?i+.03:i,r>0?"k":"f");const h=i+r*.03,u=i+r*.14,c=[];for(let o=0;o<d;o++){const s=o/d*Math.PI*2;c.push([a+t*Math.cos(s),f+t*Math.sin(s)])}const n=c.map(o=>[o[0],o[1],u]);e.poly(r>0?n:n.slice().reverse());for(let o=0;o<d;o++){const s=c[o],l=c[(o+1)%d];R(e,r,[s[0],s[1],h],[l[0],l[1],h],[l[0],l[1],u],[s[0],s[1],u])}}function H(e,a,f,i,r,t){O(e,a,f+t,i,r,t*.34,.09,!0);const d=i+r*.06,h=8;for(let u=0;u<h;u++){const c=u/h*Math.PI*2,n=(u+1)/h*Math.PI*2,o=t*.72;R(e,r,[a+o*Math.cos(c),f+o*Math.sin(c),d],[a+t*Math.cos(c),f+t*Math.sin(c),d],[a+t*Math.cos(n),f+t*Math.sin(n),d],[a+o*Math.cos(n),f+o*Math.sin(n),d])}}function E(e,a,f,i,r){q(e),e.box(a-.1,a+.1,f-.2,f+.2,r>0?i:i-.025,r>0?i+.025:i,r>0?"k":"f"),e.set({col:[.03,.03,.032],metal:0,emit:0,mk:0}),e.face(a-.035,a+.035,f-.09,f+.06,i+r*.03,r)}const de=`
attribute vec4 aDoor; attribute vec4 aEdge; attribute vec4 aTex;
#ifdef DOOR_MARKED
attribute float aMark; uniform vec3 uMarkPaint; uniform vec3 uMarkLeak; uniform vec2 uMarkGeo; varying vec2 vMk;
#else
attribute vec3 aLeak; attribute vec2 aLife;
#endif
uniform float uTime; uniform vec3 uDoorSun;
varying vec3 vDWp; varying vec3 vSunL; varying float vRelief;
varying vec4 vDoor; varying vec4 vEdge; varying vec4 vTex; varying vec3 vLeak; varying float vSeed; varying float vStrong;
// dh11: hash11 of "Hash without Sine" (David Hoskins, MIT), brought in
float dh11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float dn1(float x){ float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(dh11(i), dh11(i + 1.), f); }
// the life of a leak: 0 steady, 1 a lamp's flicker, 2 a fire's flicker, 3 far lightning, 4 a slow turning beam, 5 drifting cloud
float doorLife(float kind, float ph, float t){
  float k = floor(kind + .5);
  if (k < .5) return 1.;
  if (k < 1.5) return .86 + .14 * dn1(t * 6. + ph * 31.);
  // (a fire: two slow terms, 1.9 and 3.5 knots a second, 5.4 together: a rim that breathes, never a shimmer)
  if (k < 2.5) { float a = dn1(t * 1.9 + ph * 17.), c = dn1(t * 3.5 + ph * 53.); return .48 + .5 * a * (.6 + .4 * c) + .12 * c; }
  if (k < 3.5) {                         // a dim glow and eased flashes: one double stroke at most in 1.6 s
    float tt = t / 1.6 + ph * 7.31, c = floor(tt), f = (tt - c) * 1.6;
    float on = step(.5, dh11(c * 1.37 + ph * 3.1)), d = f - (.1 + .4 * dh11(c * 2.71 + 1.3));
    float fl = smoothstep(0., .1, d) * exp(-max(d - .1, 0.) / .24);
    float d2 = d - .36; fl += .6 * smoothstep(0., .1, d2) * exp(-max(d2 - .1, 0.) / .2);
    return .3 + .95 * on * fl;
  }
  if (k < 4.5) { float s = .5 + .5 * sin(t * .8 + ph * 6.2832); s *= s; s *= s; return .25 + s * s; }
  return .5 + .55 * dn1(t * .22 + ph * 11.);
}
`,he=`
vDoor = aDoor; vEdge = aEdge; vTex = aTex;
float dStud = step(3.5, aTex.w); vTex.w -= 4. * dStud;      // (a studded kind's painted face carries grain + 4)
mat4 dM = modelMatrix;
#ifdef USE_INSTANCING
  dM = modelMatrix * instanceMatrix;
#endif
vDWp = (dM * vec4(position, 1.)).xyz;
// the sun in the door's own frame; what tilts toward it in the door's plane is lit, what tilts away is shaded
vSunL = vec3(dot(uDoorSun, normalize((dM * vec4(1., 0., 0., 0.)).xyz)), dot(uDoorSun, normalize((dM * vec4(0., 1., 0., 0.)).xyz)), dot(uDoorSun, normalize((dM * vec4(0., 0., 1., 0.)).xyz)));
vRelief = dot(normal.xy, vSunL.xy);
#ifdef DOOR_MARKED
  vec3 dPaint = uMarkPaint; vLeak = uMarkLeak; vSeed = .37; vStrong = 1.;
#else
  vec3 dPaint = vec3(1.);
  #ifdef USE_INSTANCING_COLOR
    dPaint = instanceColor.xyz;
  #endif
  vSeed = dh11(aLife.y * 91.7 + aLife.x * 13.1 + 1.7);
  float dS2 = dh11(aLife.y * 57.3 + aLife.x * 7.9 + 4.1), dS3 = dh11(aLife.y * 23.7 + 9.3);
  // every leak breathes slowly by the world's clock at its own pace; one door in eight (phase under 1/8) leaks strongly
  vStrong = step(aLife.y, .125);
  vLeak = aLeak * doorLife(aLife.x, aLife.y, uTime) * (.8 + .2 * sin(uTime * (.22 + .3 * dS3) + aLife.y * 37.)) * (1. + .9 * vStrong);
  float dMx = max(dPaint.r, max(dPaint.g, dPaint.b)), dMn = min(dPaint.r, min(dPaint.g, dPaint.b));
  // no black doors, and no door red or orange (the marked one is white). A paint darker than the darkest allowed, or a dark grey,
  // is dealt again as a deep green, a deep blue, a dark brown or a slate; a red, crimson, orange or orange-brown paint of
  // any depth is dealt again as a green, a blue, a teal or a slate of its own depth; then none is darker than a deep navy
  if (dMx < .085 || (dMx < .15 && dMx - dMn < .03)) dPaint = dS2 < .34 ? vec3(.035, .17, .085) : dS2 < .62 ? vec3(.05, .1, .3) : dS2 < .8 ? vec3(.15, .115, .08) : vec3(.15, .18, .21);
  else {
    if (dPaint.r > dPaint.g * 2.2 && dPaint.r > dPaint.b * 1.5)
      dPaint = (dS2 < .3 ? vec3(.07, .42, .2) : dS2 < .58 ? vec3(.1, .25, .68) : dS2 < .8 ? vec3(.06, .44, .42) : vec3(.36, .44, .52)) * clamp(dMx * 1.5, .34, 1.);
    dMx = max(dPaint.r, max(dPaint.g, dPaint.b));
    if (dMx < .26) dPaint = dPaint * (.26 / max(dMx, .03)) + .012;
  }
  // nothing violet or purple: a paint whose red and blue both stand over its green is dealt as a blue, and a blue keeps
  // its red well under its green (so that no shade and no fill can turn it violet)
  if (dPaint.r > dPaint.g * 1.1 && dPaint.b > dPaint.g * 1.1) dPaint = vec3(dPaint.g * .7, dPaint.g, max(dPaint.b, dPaint.r));
  if (dPaint.b > dPaint.g * 1.15 && dPaint.r > dPaint.g * .7) dPaint.r = dPaint.g * .7;
  else if (dPaint.b > dPaint.g * 1.02 && dPaint.r > dPaint.g * .9) dPaint.r = dPaint.g * .9;       // (a pale blue: never lilac)
  // a studded leaf (the courtyard, coast and wicket kinds) is never white, cream or pale: a paint that is light, pastel
  // or grey (in the hall's bright light such a paint washes out to white) becomes a strong paint or bare wood, and no
  // paint of such a leaf is lighter than a deep one
  dMx = max(dPaint.r, max(dPaint.g, dPaint.b)); dMn = min(dPaint.r, min(dPaint.g, dPaint.b));
  if (dStud > .5) {
    if (dMn > .1 || dMx - dMn < .75 * dMx)
      dPaint = dS2 < .22 ? vec3(.03, .17, .07) : dS2 < .44 ? vec3(.035, .11, .34) : dS2 < .62 ? vec3(.03, .2, .19) : dS2 < .82 ? vec3(.16, .085, .038) : vec3(.11, .062, .03);
    dPaint *= min(1., .32 / max(max(dPaint.r, max(dPaint.g, dPaint.b)), .03));
  }
#endif
// what is not painted: its own colour; the frame (aDoor.x = 2): white, cream, stone or wood, dealt door by door
vec3 dFrame = vSeed < .34 ? vec3(.60, .59, .55) : vSeed < .6 ? vec3(.56, .49, .33) : vSeed < .8 ? vec3(.36, .35, .32) : vec3(.22, .135, .07);
#ifdef DOOR_MARKED
  dFrame = uMarkPaint;                   // the marked door's frame: the leaf's own white, plain
#endif
vColor = color * (aDoor.x > 1.5 ? dFrame : mix(vec3(1.), dPaint, clamp(aDoor.x, 0., 1.)));
#ifdef DOOR_MARKED
  // the marked door's leaf is painted white all over, its studs, straps, ledges and braces with it (aMark 1: they
  // take the leaf's own coordinates, x from its middle and y from the springing, so that the flowers lie over them
  // too); what the hand takes is brass (aMark 3) on duller brass plates (aMark 2). vMk: the class, and 1 for the inner face
  vMk = vec2(aMark, step(position.z, 0.));
  if (aMark > 1.5) { vColor = vec3(${K.join(", ")}) * (aMark > 2.5 ? 1. : .6); vDoor.w = 1.42; }
  else if (aMark > .5) {                 // (gloss on the flat wood; the painted iron keeps its dull face, so that no stud glints)
    vColor = uMarkPaint * (aDoor.x > .5 ? color : vec3(1.)); vDoor.w = aDoor.x > .5 ? .45 : .8; vDoor.x = 1.;
    vEdge.xy = vec2(position.x, position.y - uMarkGeo.y);
  }
#endif
`,ue=`
  if (aMark > .5 && aMark < 1.5 && aDoor.x < .5) objectNormal = vec3(0., 0., position.z > 0. ? 1. : -1.);
`,ge=`
varying vec4 vDoor; varying vec4 vEdge; varying vec4 vTex; varying vec3 vLeak; varying float vSeed; varying float vStrong;
uniform float uLeakGain; uniform vec3 uShade; uniform vec3 uDoorSun; uniform float uBars;
varying vec3 vDWp; varying vec3 vSunL; varying float vRelief;
#ifdef DOOR_MARKED
varying vec2 vMk; uniform vec2 uMarkGeo; uniform vec4 uMarkHand; uniform vec4 uFlowers[32];
#endif
`+ie+`
// fh12: hash12 of "Hash without Sine" (David Hoskins, MIT), brought in
float fh12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float fvn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(fh12(i), fh12(i + vec2(1., 0.)), f.x), mix(fh12(i + vec2(0., 1.)), fh12(i + vec2(1., 1.)), f.x), f.y); }
`,me=`
{
  vec2 sc = vEdge.xy, gd = vTex.xy;
  float across = dot(sc, gd), along = dot(sc, vec2(-gd.y, gd.x)), fwA = fwidth(across) + 1e-5, tone = 1.;
  if (vTex.z > .001) {
    float c = across / vTex.z, id = floor(c + .5), e = abs(c - id), g = .016 / vTex.z, w = fwA / vTex.z;
    float groove = (1. - smoothstep(g, g + w + 1e-4, .5 - e)) * clamp(g / (w * .7 + 1e-4), 0., 1.);
#ifdef DOOR_MARKED
    tone *= (1. - .5 * groove) * (.95 + .1 * fh12(vec2(id, floor(vSeed * 64.))));      // (planks under one coat of white)
#else
    tone *= (1. - .6 * groove) * (.88 + .24 * fh12(vec2(id, floor(vSeed * 64.))));
#endif
  }
  float dGr = vTex.w > 1.5 ? vTex.w - 2. : vTex.w;
  if (dGr > .001) {
    vec2 q = vec2(across * 22., along * 1.3) + vSeed * 40.;
    float fade = clamp(.5 / (fwA * 22.) - .2, 0., 1.);
    float n = fvn(q) * .6 + fvn(q * vec2(2.7, 1.9) + 7.) * .4;
    tone *= 1. + dGr * (fade * (n - .5) * .36 + (fvn(sc * .9 + vSeed * 90.) - .5) * .18);
  }
  // joinery in the shading: a lit edge and a shaded edge by the sun's direction
#ifdef DOOR_MARKED
  // (white paint: a soft lit edge and a soft shaded one, so that no stud or moulding of it flares in the sun)
  tone *= vDoor.x > .5 ? clamp(1. + .6 * vRelief, .7, 1.1) : clamp(1. + 1.1 * vRelief, .5, 1.8);
#else
  tone *= clamp(1. + 1.1 * vRelief, .5, 1.8);
#endif
  // a flat leaf (the flush kind): stiles, rails and sunk panels drawn, each with its lit and shaded edge
  if (vTex.w > 1.5 && abs(vEdge.z) > .001 && vDoor.y < 1.5 && vDoor.x > .5 && vDoor.x < 1.5 && vTex.z < .001) {
    float hw = abs(vEdge.z), H = vEdge.z > 0. ? 2. * vEdge.w : vEdge.w;
    vec2 q = vec2(vEdge.x, vEdge.y + vEdge.w);
    float st = min(.38, hw * .34), px = max(fwidth(q.x), fwidth(q.y)) + 1e-5, xa = -hw + st, xb = hw - st, dx, sx, dy, sy;
    if (hw > 1.2) {
      if (q.x < 0.) { dx = min(q.x - xa, -.15 - q.x); sx = (q.x - xa) < (-.15 - q.x) ? 1. : -1.; }
      else { dx = min(q.x - .15, xb - q.x); sx = (q.x - .15) < (xb - q.x) ? 1. : -1.; }
    } else { dx = min(q.x - xa, xb - q.x); sx = (q.x - xa) < (xb - q.x) ? 1. : -1.; }
    float r0 = .55, r1 = .38 * H, r2 = r1 + .34, r3 = .76 * H, r4 = r3 + .3, r5 = H - st;
    float d1 = min(q.y - r0, r1 - q.y), d2 = min(q.y - r2, r3 - q.y), d3 = min(q.y - r4, r5 - q.y);
    if (d1 >= d2 && d1 >= d3) { dy = d1; sy = (q.y - r0) < (r1 - q.y) ? 1. : -1.; }
    else if (d2 >= d3) { dy = d2; sy = (q.y - r2) < (r3 - q.y) ? 1. : -1.; }
    else { dy = d3; sy = (q.y - r4) < (r5 - q.y) ? 1. : -1.; }
    float dp = min(dx, dy), bw = max(.11, 1.3 * px), inP = smoothstep(0., px, dp), bev = inP * (1. - smoothstep(bw, bw + px, dp));
    tone *= mix(1., .9, inP) * (1. + bev * clamp((dx < dy ? sx * vSunL.x : sy * vSunL.y) * 1.5, -.5, .7));
  }
#ifdef DOOR_MARKED
  // THE MARKED DOOR'S PAINT: white gloss over planks, ledges and iron alike, and on it hand-painted flowers: a round
  // heart with five or six fat petals, flat colour, a brush-soft edge, no outline. They are dealt once at build in
  // the leaf's own coordinates (uFlowers: centre x, y from the springing, radius; w: 1 for six petals + 2 for the
  // stronger of the two pinks + the turn as a share of one petal). The first sixteen lie on the outer face, the
  // others on the inner. Nothing here reads the lens or the clock: only the edge's softness is widened to a pixel.
  if (vMk.x > .5 && vMk.x < 1.5) {
    vec2 fq = vEdge.xy; vec3 pc = diffuseColor.rgb;
    float fpx = max(fwidth(fq.x), fwidth(fq.y)) + 1e-5, soft = max(.016, fpx);
    float wob = (fvn(fq * 6. + 31.) - .5) * .05;                              // the hand's wobble, in metres
    int f0 = vMk.y > .5 ? 16 : 0;
    for (int i = 0; i < 16; i++) {
      vec4 f = uFlowers[f0 + i];
      vec2 p = fq - f.xy; float rr = dot(p, p), R = f.z;
      if (rr < R * R * 1.3) {
        float code = floor(f.w), six = mod(code, 2.), seg = 6.2832 / (5. + six), rho = sqrt(rr + 1e-8);
        float th = atan(p.y, p.x + step(abs(p.x) + abs(p.y), 1e-6) * 1e-5) + fract(f.w) * seg + 6.2832;
        float a = mod(th, seg) - .5 * seg, a0 = (.59 + .05 * six) * R;      // one petal: a round dab, its middle a0 out
        vec2 pl = rho * vec2(cos(a), sin(a)) - vec2(a0, 0.);
        float sd = min(sqrt(dot(pl, pl) + 1e-8) - (R - a0), rho - a0) + wob;
        float m = 1. - smoothstep(-soft, soft, sd), md = 1. - smoothstep(-soft, soft, rho - .25 * R + .5 * wob);
        // a soft rose or a stronger pink, the heart a deep pink; each keeps its blue well under its red, so that the
        // hall's cool shade never turns it toward violet
        vec3 petal = mix(vec3(1., .5, .53), vec3(.98, .22, .34), step(1.5, code));
        pc = mix(pc, diffuseColor.rgb * mix(petal, vec3(.74, .07, .16), md), m);
      }
    }
    // a little wear: the paint rubbed thin to the wood along the leaf's foot and edges and round what the hand takes
    float mr = uMarkGeo.x, mh = uMarkGeo.y;
    float dq = fq.y > 0. ? mr - sqrt(dot(fq, fq) + 1e-8) : min(mr - abs(fq.x), fq.y + mh);
    vec2 hq = fq - (vMk.y > .5 ? uMarkHand.zw : uMarkHand.xy);
    float nz = fvn(fq * vec2(11., 2.5) + 3.) * .6 + fvn(fq * vec2(37., 6.) + 11.) * .4;       // streaks along the planks
    float edge = (1. - smoothstep(.04, .5, dq)) * (.55 + .45 * (1. - smoothstep(0., 2.2, fq.y + mh)));
    float hand = 1. - smoothstep(.3, .85, sqrt(dot(hq, hq) + 1e-8));
    float rub = max(edge, .8 * hand), worn = smoothstep(.8, .94, nz + .47 * rub);
    pc = mix(pc * (1. - .08 * rub), vec3(.3, .25, .19) * (.8 + .4 * nz), worn * .65);
    diffuseColor.rgb = pc;
  }
#endif
  // the low sun's bars: the roof's ribs lay their long shadows over the doors as over the floor
  float dLit = smoothstep(.5, .95, shedSunShade(vDWp, uDoorSun));
  diffuseColor.rgb *= tone * mix(vec3(1.), mix(vec3(.5, .56, .6), vec3(1.16, 1.08, .93), dLit), uBars);
}
`,xe=`
{
  float hx = vEdge.z, hy = vEdge.w, line = 0., halo = 0.;
  if (abs(hx) > .001) {
    vec2 q = vEdge.xy; float r = abs(hx), db = q.y + hy;
    float d = hx > 0. ? min(r - abs(q.x), hy - abs(q.y)) : (q.y > 0. ? r - length(q) : min(r - abs(q.x), db));
    float aa = fwidth(d) + 1e-5, low = 1. - smoothstep(0., .6, db), sill = .75 + 1.05 * (1. - smoothstep(0., 1.6, db));
    if (vDoor.y > 1.5) {                                   // the frame and the sill: a soft halo round the opening
      halo = exp(-max(-d, 0.) * mix(9., 3.4, vStrong)) * mix(.1, .3, vStrong) * sill;
    } else {                                               // the leaf: the line just inside its outline, widest at the sill
      float di = max(d, 0.), wl = mix(.07, .2, low), w = max(wl, 1.5 * aa), k = wl / w;
      line = (1. - smoothstep(w - aa, w + aa, di)) * max(k * (2. - k), .55) * sill * step(-.03, d);
      halo = exp(-di * 12.) * .07 * sill * step(-.03, d);
    }
  }
  float spill = vDoor.y > 1.5 ? 0. : vDoor.y;
  totalEmissiveRadiance += vLeak * uLeakGain * (line + halo + vDoor.z + spill * spill * (.4 + .5 * vStrong));
  // the hall's own soft light where the sun does not fall: the warm floor's bounce from below, the bright roof above
  vec3 dWn = inverseTransformDirection(normal, viewMatrix);
  // (a blue's fill is even in all three, so that no blue leaf turns violet in shade)
  vec3 dFill = mix(uShade, vec3((uShade.r + uShade.g + uShade.b) / 3.), step(diffuseColor.g * 1.1, diffuseColor.b));
#ifdef DOOR_MARKED
  dFill = uShade;                        // (the marked door has no blue: its pinks take the hall's warm fill like its white)
#endif
  totalEmissiveRadiance += diffuseColor.rgb * dFill * (.7 - .3 * dWn.y);
}
`;function z(e,a,f){const i=new e.MeshStandardMaterial({vertexColors:!0,roughness:.6,metalness:0});return f&&(i.defines={DOOR_MARKED:1}),i.onBeforeCompile=r=>{r.uniforms.uTime=a.uTime,r.uniforms.uLeakGain=a.uLeakGain,r.uniforms.uShade=f?a.uMarkShade:a.uShade,r.uniforms.uDoorSun=a.uDoorSun,r.uniforms.uBars=a.uBars,f&&(r.uniforms.uMarkPaint=a.uMarkPaint,r.uniforms.uMarkLeak=a.uMarkLeak,r.uniforms.uMarkGeo=a.uMarkGeo,r.uniforms.uMarkHand=a.uMarkHand,r.uniforms.uFlowers=a.uFlowers),r.vertexShader=r.vertexShader.replace("#include <common>",de+`
#include <common>`).replace("#include <color_vertex>",he),f&&(r.vertexShader=r.vertexShader.replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
`+ue)),r.fragmentShader=r.fragmentShader.replace("#include <common>",ge+`
#include <common>`).replace("#include <color_fragment>",`#include <color_fragment>
`+me).replace("#include <roughnessmap_fragment>","float roughnessFactor = fract(vDoor.w);").replace("#include <metalnessmap_fragment>","float metalnessFactor = step(1., vDoor.w) * .7;").replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
`+xe)},i.customProgramCacheKey=()=>"doors-in-transit-door"+(f?"-marked":""),i}function M(e,a){return e.set(Object.assign({paint:1,col:B,rough:.5,metal:0,emit:0,spill:0,pitch:0,grain:1,gx:1,gy:0},a||{}))}function j(e,a){return S(e),e.set(Object.assign({paint:2,col:B,rough:.62,metal:0,emit:0,spill:0,pitch:0,grain:.8,gx:1,gy:0},a||{}))}function ve(){const e=D(),a=4.3,f=8.5,i=6,r=J(e,a,f,.36,.14,B,C),t=r.r,d=r.y0,h=r.ys;ee(e,a,f+.1,a/2,f-a/2),j(e,{gx:0,gy:1}),e.box(-t,t,i,h,-.165,.165,"lrd"),_(e,i,-t,t,v,.165,-1,1,.12),_(e,i,-t,t,-v,-.165,-1,1,.12);const u=[-t,-t+.42,-.19,.19,t-.42,t],c=[d,d+.62,2,2.5,4.55,4.91,5.6,i];M(e),L(e,-t,t,d,i),Z(e,u,c,v,1,.06,"field"),Z(e,u,c,-v,-1,.045,"flat");for(const o of[1,-1])q(e,K),e.set({rough:.3}),Y(e,t-.21,2.25,o*v,o,.13),E(e,t-.21,1.72,o*v,o);q(e,K);for(const o of[.95,3.3,5.35])e.box(-t-.02,-t+.07,o-.18,o+.18,v,v+.07,"k");S(e),e.set({paint:0,col:X,rough:.3,metal:0,emit:0,grain:0,pitch:0});const n=I(0,h,t,10);e.poly(n.map(o=>[o[0],o[1],.04])),e.poly(n.slice().reverse().map(o=>[o[0],o[1],-.04])),j(e);for(const o of[1,-1]){for(let l=1;l<6;l++){const g=l/6*Math.PI,m=Math.cos(g),x=Math.sin(g),p=.045,k=o*.07;R(e,o,[.5*m+p*x,h+.5*x-p*m,k],[t*m+p*x,h+t*x-p*m,k],[t*m-p*x,h+t*x+p*m,k],[.5*m-p*x,h+.5*x+p*m,k])}const s=I(0,h,.52,5).map(l=>[l[0],l[1],o*.07]);e.poly(o>0?s:s.reverse())}return{name:"town six-panel",b:e,width:a,height:f+.1,arched:!0}}function pe(){const e=D(),a=4.6,f=7.6,i=3.62,r=.49,t=F(e,a,f,.34,.36,.14,B,Q),d=[[t.y0,i],[i,t.y1]];for(const[h,u]of d){M(e,{pitch:r}),L(e,t.x0,t.x1,h,u),e.face(t.x0,t.x1,h,u,v,1),e.face(t.x0,t.x1,h,u,-v,-1),M(e,{gx:0,gy:1,col:[.9,.9,.9]}),S(e);for(const l of[h+.5,u-.5])e.box(t.x0+.12,t.x1-.12,l-.2,l+.2,-v-.07,-v,"f");const c=-v-.06,n=t.x0+.2,o=t.x1-.2,s=.3;e.set({gx:.6,gy:-.8}),e.quad([o,u-.7,c],[o,u-.7-s,c],[n,h+.7,c],[n,h+.7+s,c]),q(e),A(e,t.x0,h+.5,2.7,v,1),A(e,t.x0,u-.5,2.7,v,1)}return M(e,{gx:0,gy:1,col:[.92,.92,.92]}),S(e),e.box(t.x0+.04,t.x1-.04,i-.24,i-.04,v,v+.13,"k"),q(e),e.box(t.x1-.75,t.x1-.3,i+.5,i+.66,v,v+.07,"k"),H(e,t.x1-.55,i+1.25,v,1,.2),e.box(t.x1-1.1,t.x1-.1,i-.9,i-.76,-v-.08,-v,"f"),E(e,t.x1-.5,i-1.3,v,1),{name:"stable two-leaf",b:e,width:a,height:f,arched:!1}}function ee(e,a,f,i,r){q(e);const t=a*.37,d=r+Math.sqrt(Math.max(0,i*i-t*t))-.05;e.box(-t-.08,t+.08,f-.1,f,-.09,.09);for(const h of[-1,1])e.box(h*t-.07,h*t+.07,d,f-.1,-.07,.07,"ud")}function te(e,a,f){const{r:i,y0:r,ys:t,pitch:d,n:h}=f,u=[.7,2.15,3.6,5.05],c=f.fine?1:0,n=f.fine?2:0,o=f.fine?3:0;a.strong=1,M(a,{pitch:d,mk:c}),fe(a,0,r,t,i),U(a,i,r,t,v,1,h),U(a,i,r,t,-v,-1,h),q(a);for(const p of u.concat([t-r+i*.42])){const k=r+p,w=k>t?Math.sqrt(Math.max(0,i*i-(k-t)*(k-t))):i,y=Math.floor((w-.24)/d);for(let P=-y;P<=y;P++)O(a,P*d,k,v,1,.085,.075,!0)}A(a,-i,r+1.42,i*1.5,v,1,.24),A(a,-i,r+4.32,i*1.5,v,1,.24),a.set({mk:n}),a.box(i-1.02,i-.48,r+2.6,r+3.3,v,v+.03,"k"),a.set({mk:o}),H(a,i-.75,r+2.9,v+.03,1,.27),a.set({mk:n}),E(a,i-.75,r+1.42,v,1),M(a,{gx:0,gy:1,col:[.9,.9,.9],mk:c}),S(a);const s=f.fine?[1.42,2.87,4.32,5.77]:u;for(const p of s)a.box(-i+.14,i-.14,r+p-.2,r+p+.2,-v-.075,-v,"f");const l=-v-.06,g=-i+.2,m=i-.2,x=.3;a.set({gx:.5,gy:-.86});for(const[p,k]of[[s[0],s[1]],[s[2],s[3]]])a.quad([m,r+k-.2,l],[m,r+k-.2-x,l],[g,r+p+.2,l],[g,r+p+.2+x,l]);if(q(a),f.fine){const p=-v-.075,k=r+s[1];A(a,-i,r+s[0],i*1.5,p,-1,.2),A(a,-i,r+s[2],i*1.5,p,-1,.2);for(let w=-4;w<=4;w++)w<2&&O(a,w*.5,k,p,-1,.07,.06,!0),O(a,w*.5,r+s[3],p,-1,.07,.06,!0);a.set({mk:o}),a.box(i-1.75,i-.06,k-.075,k+.075,p-.035,p,"f"),a.set({mk:n}),a.box(i-.5,i-.36,k-.2,k+.2,p-.07,p,"f"),a.box(i-1.95,i-1.65,k-.17,k+.17,p-.05,p,"f")}else a.box(i-1.5,i-.1,r+2.8,r+2.96,-v-.09,-v,"f"),E(a,i-.75,r+1.42,-v,-1);J(e,f.w,f.top,f.fw,r,B,C,h,f.yb),ee(e,f.w,f.top+.1,f.w/2,f.top-f.w/2)}function we(){const e=D(),a=4.7,f=8.6,i=.36,r=a/2-i,t=f-.1;return te(e,e,{w:a,top:t,fw:i,r,y0:.14,ys:t-a/2,pitch:.44,n:10,yb:0}),{name:"courtyard arched plank",b:e,width:a,height:f,arched:!0}}const oe={paint:0,col:X,rough:.3,emit:0,grain:0};function ae(e,a,f,i,r,t,d,h=.07){const u=t-d*.05,c=Object.assign({},e.st);R(e,d,[a,i,t],[f,i,t],[f-h,i+h,u],[a+h,i+h,u]),R(e,d,[f,i,t],[f,r,t],[f-h,r-h,u],[f-h,i+h,u]),R(e,d,[f,r,t],[a,r,t],[a+h,r-h,u],[f-h,r-h,u]),R(e,d,[a,r,t],[a,i,t],[a+h,i+h,u],[a+h,r-h,u]),e.set(oe),e.set({pitch:0}),e.face(a+h,f-h,i+h,r-h,u,d),e.set(c)}function ne(e,a,f,i,r,t){e.box(a-.08,a+.08,f-.3,f+.3,r>0?i:i-.025,r>0?i+.025:i,r>0?"k":"f");const d=i+r*.06,h=i+r*.12;e.box(Math.min(a,a+t*.5),Math.max(a,a+t*.5),f+.06,f+.14,Math.min(d,h),Math.max(d,h))}function ke(){const e=D(),a=4.7,f=8.6,i=[.2,.115,.055],r=[.29,.175,.085];e.fp=0,e.strong=1;const t=F(e,a,f,.5,1,.16,i,i),d=t.y0,h=t.y1,u=(d+h)/2;S(e),e.set({paint:0,col:r,rough:.6,metal:0,grain:.6,pitch:0});for(const n of[1,-1])for(let o=-3;o<=3;o++)O(e,o*.6,f-.25,n*G,n,.2,.05,!0);for(const n of[-1,1])for(let o=0;o<9;o++)O(e,n*(a/2-.125),.62+o*.8,G,1,.1,.04,!0);const c={pitch:1.36,gx:0,gy:1};for(const n of[-1,1]){const o=n<0?t.x0:0,s=n<0?0:t.x1;M(e,c),L(e,o,s,d,h),e.face(o,s,d,h,v,1),M(e,{pitch:.46}),L(e,o,s,d,h),e.face(o,s,d,h,-v,-1),q(e,[.2,.13,.055]),e.set({metal:0,rough:.7});for(let l=-2;l<=2;l++)for(let g=0;g<3;g++)O(e,n*(.44+g*.5),u+l*1.36,v,1,.12,.15)}S(e),e.set({paint:0,col:i,rough:.6,metal:0,grain:.7,pitch:0,gx:1,gy:0,emit:0,spill:0}),e.box(-.15,.15,d,h,v,v+.1,"kud"),e.set({col:r});for(let n=0;n<7;n++)O(e,0,d+.6+n*1.04,v+.1,1,.11,.045,!0);M(e,{gx:0,gy:1,col:[.9,.9,.9]}),S(e);for(const n of[d+1.3,h-1.3])e.box(t.x0+.1,t.x1-.1,n-.2,n+.2,-v-.07,-v,"f");return q(e),e.box(-.9,.9,u-.08,u+.08,-v-.09,-v,"f"),H(e,.69,u-.42,v,1,.19),E(e,.69,u-2.04,v,1),{name:"coast carved",b:e,width:a,height:f,arched:!1}}function ye(){const e=D(),a=4.6,f=7.4,i=[.03,.027,.024],r=[.62,.56,.42],t=1.35,d=.17;e.fp=0;const h=F(e,a,f,.26,.3,.12,i,i),u=h.y0,c=h.y1,n={paint:0,col:r,rough:.85,emit:0,grain:.3};for(const[o,s]of[[h.x0,0],[0,h.x1]])for(const l of[1,-1]){const g=l*v,m=o+d,x=s-d,p=u+t,k=c-d;M(e,n),L(e,o,s,u,c),e.face(o,s,u,c,l*.05,l),e.set({col:i,emit:0,rough:.55,grain:.7,gx:1,gy:0}),e.face(o,m,u,c,g,l),e.face(x,s,u,c,g,l),e.set({gx:0,gy:1}),e.face(m,x,k,c,g,l),e.face(m,x,u,u+d,g,l),e.face(m,x,p-.12,p,g,l),M(e,{pitch:.34}),L(e,o,s,u,c),e.face(m,x,u+d,p-.12,g-l*.02,l),S(e),e.set({paint:0,col:i,rough:.55,grain:0,pitch:0});for(let w=1;w<3;w++){const y=m+(x-m)*w/3;e.face(y-.045,y+.045,p,k,l*.07,l)}for(let w=1;w<7;w++){const y=p+(k-p)*w/7;e.face(m,x,y-.045,y+.045,l*.07,l)}}return{name:"paper screen",b:e,width:a,height:f,arched:!1}}function Me(){const e=D(),a=4.4,f=8.2,i=[.022,.13,.42],r=[.6,.6,.57];e.fp=0;const t=F(e,a,f,.34,.5,.14,r,C),d=t.y0,h=t.y1,u={paint:0,col:i,pitch:.465};for(const c of[-1,1]){const n=c<0?t.x0:0,o=c<0?0:t.x1,s=(n+o)/2;M(e,u),L(e,n,o,d,h),e.face(n,o,d,h,v,1),e.face(n,o,d,h,-v,-1),q(e);const l=(g,m,x=.075)=>O(e,s+g,d+m,v,1,x,.07,!0);for(let g=0;g<5;g++)l(-.6,1+g*1),l(.6,1+g*1);for(let g=1;g<6;g++){const m=g/6*Math.PI;l(-.6*Math.cos(m),5+1.5*Math.sin(m))}for(const g of[2,3.3])for(let m=-2;m<=2;m++)l(m*.2,g-Math.abs(m)*.16,.06);for(let g=-2;g<=2;g++)l(g*.32,.4,.06);e.box(s-c*.52-.07,s-c*.52+.07,d+3.75,d+4.75,v,v+.03,"k"),e.box(s-c*.52-.045,s-c*.52+.045,d+3.9,d+4.6,v+.08,v+.13),M(e,{paint:0,col:[i[0]*.85,i[1]*.85,i[2]*.85],gx:0,gy:1}),S(e);for(const g of[d+.9,d+3.8,h-.9])e.box(n+.1,o-.1,g-.2,g+.2,-v-.07,-v,"f")}return E(e,.13,d+4.3,v,1),{name:"island studded",b:e,width:a,height:f,arched:!1}}function Se(){const e=D(),a=4.7,f=7.9,i=.4,r=.34,t=F(e,a,f,.34,.36,.14,B,Q),d=t.y0,h=t.y1,u=(d+h)/2;for(const c of[-1,1]){const n=c<0?t.x0:0,o=c<0?0:t.x1;for(const s of[1,-1]){const l=s*v;M(e),L(e,n,o,d,h),e.face(n,n+r,d,h,l,s),e.face(o-r,o,d,h,l,s),e.set({gx:0,gy:1});for(const[m,x]of[[d,d+r],[u-r/2,u+r/2],[h-r,h]])e.face(n+r,o-r,m,x,l,s);let g=0;for(const[m,x]of[[d+r,u-r/2],[u+r/2,h-r]])M(e,{pitch:i,gx:.7071,gy:.7071*(g++===0?1:-1)*c,col:[.92,.92,.92]}),L(e,n,o,d,h),$(e,n+r,o-r,m,x,l,s,.045,"flat",.05)}q(e),A(e,c<0?t.x0:t.x1,d+r/2,-c*1.5,v,1,.14),A(e,c<0?t.x0:t.x1,h-r/2,-c*1.5,v,1,.14)}q(e),e.box(-1.45,1.45,u-.08,u+.08,v+.05,v+.12);for(const c of[-1.1,1.1])e.box(c-.09,c+.09,u-.17,u+.17,v,v+.15,"k");return{name:"farm slanted boards",b:e,width:a,height:f,arched:!1}}function qe(){const e=D(),a=4.1,f=8,i=F(e,a,f,.32,.34,.14,B,C),r=i.x0,t=i.x1,d=i.y0,h=i.y1,u=[r,r+.46,-.13,.13,t-.46,t],c=d+.66,n=d+2.3,o=d+2.86,s=h-.5;for(const l of[1,-1]){const g=l*v;M(e),L(e,r,t,d,h),Z(e,u,[d,c,n,o],g,l,.05,l>0?"field":"flat");for(let m=0;m<6;m+=2)e.face(u[m],u[m+1],o,h,g,l);e.set({gx:0,gy:1});for(let m=1;m<5;m+=2)e.face(u[m],u[m+1],s,h,g,l);e.set({gx:1,gy:0});for(let m=1;m<5;m+=2)ae(e,u[m],u[m+1],o,s,g,l);q(e,K),e.set({rough:.3}),ne(e,t-.23,o-.3,g,l,-1),E(e,t-.23,n-.5,g,l)}q(e);for(const l of[d+.8,d+3.6,h-.8])e.box(r-.02,r+.07,l-.18,l+.18,v,v+.07,"k");return{name:"two frosted panes",b:e,width:a,height:f,arched:!1}}function Pe(){const e=D(),a=4.4,f=8.3,i=.3,r=.25,t=F(e,a,f,.32,.34,.14,B,C),d=t.y0,h=t.y1,u=d+3,c=[[d+.5,u-.18],[u+.18,h-.36]];for(const n of[-1,1]){const o=n<0?t.x0:0,s=n<0?0:t.x1,l=o+i,g=s-i;for(const m of[1,-1]){const x=m*v;M(e),L(e,o,s,d,h),e.face(o,l,d,h,x,m),e.face(g,s,d,h,x,m),e.set({gx:0,gy:1}),e.face(l,g,d,c[0][0],x,m),e.face(l,g,c[0][1],c[1][0],x,m),e.face(l,g,c[1][1],h,x,m)}for(const[m,x]of c){S(e),e.set({paint:1,col:[.5,.5,.5],rough:.9,metal:0,emit:0,grain:0,pitch:0}),e.face(l,g,m,x,0,1),e.face(l,g,m,x,0,-1),M(e,{gx:0,gy:1,grain:.6}),S(e);const p=Math.floor((x-m)/r);for(let k=0;k<p;k++){const w=m+(x-m)*k/p,y=w+(x-m)/p+.03,P=v-.015,b=-v+.015;e.quad([l,w,P],[g,w,P],[g,y,b],[l,y,b]),e.quad([g,w,P],[l,w,P],[l,y,b],[g,y,b])}}q(e,K),e.set({rough:.3}),Y(e,n*.15,u,v,1,.085),q(e);for(const m of[d+.8,u,h-.8])e.box(n<0?o-.02:s-.07,n<0?o+.07:s+.02,m-.18,m+.18,v,v+.07,"k")}return{name:"louvred",b:e,width:a,height:f,arched:!1}}function be(){const e=D(),a=3.9,f=7.2,i=.41,r=F(e,a,f,.3,.32,.14,B,Q),t=r.x0,d=r.x1,h=r.y0,u=r.y1,c=(h+u)/2;M(e,{pitch:i}),L(e,t,d,h,u),e.face(t,d,h,u,v,1),e.face(t,d,h,u,-v,-1);const n=[h+.75,c,u-.75],o=v+.075,s=v;M(e,{gx:0,gy:1,col:[.92,.92,.92]}),S(e);for(const l of n)e.box(t+.1,d-.1,l-.22,l+.22,s,o,"k");for(let l=0;l<2;l++){const g=n[l]+.22,m=n[l+1]-.22,x=t+.2,p=d-.2,k=.34,w=s+.06;e.set({gx:.55,gy:-.83}),e.quad([x,g,w],[x+k,g,w],[p,m,w],[p-k,m,w]),e.quad([x+k,g,s],[p,m,s],[p,m,w],[x+k,g,w]),e.quad([p-k,m,s],[x,g,s],[x,g,w],[p-k,m,w])}return q(e),A(e,t,n[0],1.5,o,1,.13),A(e,t,n[2],1.5,o,1,.13),e.box(d-.42,d-.28,c+.5,c+1.2,s,s+.03,"k"),e.box(d-.39,d-.31,c+.62,c+1.08,s+.08,s+.13),e.box(d-.9,d-.05,c+.8,c+.92,-s-.06,-s,"f"),H(e,d-.48,c+.1,-s,-1,.2),E(e,d-.48,c-.7,-s,-1),E(e,d-.35,c-.7,s,1),{name:"cottage ledged",b:e,width:a,height:f,arched:!1}}function De(){const e=D(),a=3.9,f=7.9,i=[.36,.37,.38],r={grain:2.35,rough:.42},t=F(e,a,f,.22,.24,.1,B,C),d=t.x0,h=t.x1,u=t.y0,c=t.y1,n=c-1.25;j(e,{gx:0,gy:1}),e.box(d,h,n,n+.2,-.165,.165,"lrd"),_(e,n,d,h,v,.165,-1,1,.12),_(e,n,d,h,-v,-.165,-1,1,.12),S(e),e.set(oe),e.set({pitch:0,spill:0,metal:0}),e.face(d,h,n+.2,c,.04,1),e.face(d,h,n+.2,c,-.04,-1),j(e);for(const m of[1,-1])e.face(-.04,.04,n+.2,c,m*.07,m);const o=h-.95,s=h-.62,l=u+3.3,g=u+5.5;for(const m of[1,-1]){const x=m*v,p=(k,w,y,P,b)=>e.box(k,w,y,P,m>0?x:x-b,m>0?x+b:x,m>0?"k":"f");M(e,r),L(e,d,h,u,n),e.face(d,o,u,n,x,m),e.face(s,h,u,n,x,m),e.face(o,s,u,l,x,m),e.face(o,s,g,n,x,m),ae(e,o,s,l,g,x,m,.045),q(e,i),e.set({rough:.35}),p(d+.06,h-.06,u+.05,u+.85,.015),p(h-.46,h-.12,u+3.6,u+4.6,.015),ne(e,h-.29,u+3.05,x,m,-1)}q(e,i);for(const m of[u+.9,u+3.3,n-.9])e.box(d-.02,d+.07,m-.2,m+.2,v,v+.07,"k");return{name:"flush plain",b:e,width:a,height:f,arched:!1}}function Le(){const e=D(),a=4.7,f=7.7,i=.47,r=[.15,.095,.05],t=v;e.fp=0,e.strong=1,e.noHalo=!0;const d=F(e,a,f,.36,.4,.12,r,r),h=d.x0,u=d.x1,c=d.y0,n=d.y1,o=.12,s=1.74,l=c+4.1,g={pitch:i,col:[.94,.94,.94]};for(const x of[1,-1]){const p=x*t;M(e,{pitch:i}),S(e),e.face(h,o,c,n,p,x),e.face(s,u,c,n,p,x),e.face(o,s,l,n,p,x),M(e,g),L(e,o,s,c,l),e.face(o,s,c,l,p,x)}M(e,{col:[.86,.86,.86]}),S(e),e.box(o-.15,o-.03,c,l+.15,t,t+.05,"k"),e.box(s+.03,s+.15,c,l+.15,t,t+.05,"k"),e.set({gx:0,gy:1}),e.box(o-.03,s+.03,l+.03,l+.15,t,t+.05,"k");const m=[[h+.1,u-.1,c+5],[h+.1,u-.1,c+6.55],[h+.1,o-.25,c+1.5],[s+.25,u-.1,c+1.5]];for(const[x,p,k]of m){M(e,{gx:0,gy:1,col:[.9,.9,.9]}),S(e),e.box(x,p,k-.22,k+.22,t,t+.08,"k"),e.box(x,p,k-.2,k+.2,-t-.07,-t,"f"),q(e);const w=Math.max(1,Math.round((p-x)/.47));for(let y=0;y<w;y++)O(e,x+(p-x)*(y+.5)/w,k,t+.08,1,.07,.06,!0)}return q(e),A(e,h,c+5,2,t+.08,1,.13),A(e,h,c+1.5,1.2,t+.08,1,.13),A(e,s,c+.75,-1,t,1,.12),A(e,s,c+3.35,-1,t,1,.12),H(e,o+.36,c+2.15,t,1,.17),E(e,o+.36,c+1.35,t,1),E(e,o+.36,c+1.9,-t,-1),{name:"wicket in a gate",b:e,width:a,height:f,arched:!1}}const Ae=[ve,pe,we,ke,ye,Me,Se,qe,Pe,be,De,Le];function Oe(e,a,f,i){const r=[];for(let t=0;t<2;t++){const d=12+Math.floor(e()*5),h=i[t],u=[];for(let c=0;c<d;c++){const n=.25+.2*e(),o=(e()<.5?1:0)+(e()<.45?2:0)+.98*e();let s=null,l=.1;for(let g=0;g<60&&(g<8||!s);g++){const m=(2*e()-1)*a,x=-f+e()*(f+a),p=x>0?a-Math.hypot(m,x):Math.min(a-Math.abs(m),x+f);let k=Math.min(p-.15,Math.hypot(Math.max(h[0]-m,0,m-h[1]),Math.max(h[2]-f-x,0,x-h[3]+f))-.1)-n;for(const w of u)k=Math.min(k,Math.hypot(m-w[0],x-w[1])-w[2]-n);k>l&&(l=k,s=[m,x,n,o])}s&&u.push(s)}for(let c=0;c<16;c++)r.push(u[c]||[0,0,0,0])}return r}async function _e(e,a){const f=a.THREE,i={uTime:{value:0},uLeakGain:{value:2.5},uMarkPaint:{value:new f.Color(.55,.545,.52)},uMarkLeak:{value:new f.Vector3(1.3,1.2,1.02)},uMarkGeo:{value:new f.Vector2},uMarkHand:{value:new f.Vector4},uFlowers:{value:[]},uShade:{value:new f.Vector3(.16,.14,.11)},uMarkShade:{value:new f.Vector3(.34,.3,.24)},uDoorSun:W,uBars:se};W.value||(W.value=new f.Vector3(.15,.5,-.85).normalize());const r=z(f,i,!1),t=z(f,i,!0),d=[],h=[];for(const w of Ae){const y=w(),P=y.b.geometry(f);h.push(P),d.push({name:y.name,geometry:P,material:r,width:y.width,height:y.height,arched:y.arched,triangles:y.b.triangles()}),await e.yield()}const u=D(),c=D(),n=V.w/2,o=.36,s=V.w+2*o,l=V.h-n;te(u,c,{w:s,top:l+s/2,fw:o,r:n,y0:0,ys:l,pitch:.5,n:14,yb:-.22,fine:!0}),u.marks=c.marks=1;const g=u.geometry(f),m=c.geometry(f);h.push(g,m);const x=[c.classBox(1,2.5),c.classBox(-1,2.5)],p=w=>[(w[0]+w[1])/2,(w[2]+w[3])/2-l];i.uMarkGeo.value.set(n,l),i.uMarkHand.value.set(...p(x[0]),...p(x[1]));const k=a.rngFor?a.rngFor("marked-flowers"):(w=>()=>(w=w*16807%2147483647)/2147483647)(20231);return i.uFlowers.value=Oe(k,n,l,[c.classBox(1,1.5),c.classBox(-1,1.5)]).map(w=>new f.Vector4(w[0],w[1],w[2],w[3])),await e.yield(),{kinds:d,marked:{frame:{geometry:g,material:t},leaf:{geometry:m,material:t},hingeX:-n,width:s,height:l+s/2+.1,arched:!0,triangles:u.triangles()+c.triangles()},leakUniforms:i,update(w,y){i.uTime.value=y},dispose(){for(const w of h)w.dispose();r.dispose(),t.dispose()}}}export{_e as makeDoorKinds};
