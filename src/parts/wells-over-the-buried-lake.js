import*as B from"three";const wt=Math.PI*2,pe=(e,t,o)=>Math.min(o,Math.max(t,e)),Yt=e=>{const t=new B.Color(e);return[t.r,t.g,t.b]},we=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],ke=(e,t,o)=>[e[0]+(t[0]-e[0])*o,e[1]+(t[1]-e[1])*o,e[2]+(t[2]-e[2])*o],ie={plain:Yt("#d9b77a"),rock:Yt("#b98a4e"),garden:Yt("#3f8f4a"),palm:Yt("#7fbf5a"),white:Yt("#f3ead8"),ochre:Yt("#c98c4a"),timber:Yt("#8a5a34"),timberDark:Yt("#5e3b21"),cloth:Yt("#cdb89a"),water:Yt("#7fd6e8"),lake:Yt("#0f2a2e"),shallows:Yt("#1f5a5a"),lime:Yt("#e9e2cf"),day:Yt("#fff6d8"),red:Yt("#d9483a"),stone:Yt("#b9ad98"),stoneDark:Yt("#7d7466"),clay:Yt("#b5633a"),iron:Yt("#3a3632"),rope:Yt("#a58a5c")},Q={solid:0,cloth:1,water:2,glow:3,wall:4,daylit:5,shaft:6,rock:7,wet:8,stone:9,fine:10,timber:11},je=(e,t)=>{const o=t[0]-e[0],a=t[1]-e[1],n=t[2]-e[2];let s=Math.atan2(n,o),i=Math.atan2(a,Math.hypot(o,n));s<0&&(s+=Math.PI,i=-i),s>=Math.PI&&(s-=Math.PI,i=-i);const h=Math.min(15,Math.floor(s/Math.PI*16)),f=Math.min(8,Math.max(0,Math.round((i/Math.PI+.5)*8)));return 11+((h*16+f+.5)/256-.5)*.8};class mt{constructor(){this.p=[],this.n=[],this.c=[]}get triangles(){return this.p.length/9}vert(t,o,a,n,s,i,h,f){this.p.push(t,o,a),this.n.push(n,s,i),this.c.push(h[0],h[1],h[2],f)}tri(t,o,a,n,s=0){const i=o[0]-t[0],h=o[1]-t[1],f=o[2]-t[2],l=a[0]-t[0],d=a[1]-t[1],r=a[2]-t[2];let m=h*r-f*d,u=f*l-i*r,w=i*d-h*l;const M=Math.hypot(m,u,w)||1;m/=M,u/=M,w/=M,this.vert(t[0],t[1],t[2],m,u,w,n,s),this.vert(o[0],o[1],o[2],m,u,w,n,s),this.vert(a[0],a[1],a[2],m,u,w,n,s)}quad(t,o,a,n,s,i=0){this.tri(t,o,a,s,i),this.tri(t,a,n,s,i)}box(t,o,a,n,s,i,h,f=0,l=0,d=!0,r=!0){const m=n/2,u=s/2,w=i/2,M=Math.cos(l),L=Math.sin(l),y=(z,k,E)=>[t+z*M+E*L,o+k,a-z*L+E*M],v=[y(-m,-u,-w),y(m,-u,-w),y(m,-u,w),y(-m,-u,w),y(-m,u,-w),y(m,u,-w),y(m,u,w),y(-m,u,w)];this.quad(v[3],v[2],v[6],v[7],h,f),this.quad(v[1],v[0],v[4],v[5],h,f),this.quad(v[2],v[1],v[5],v[6],h,f),this.quad(v[0],v[3],v[7],v[4],h,f),r&&this.quad(v[7],v[6],v[5],v[4],h,f),d&&this.quad(v[0],v[1],v[2],v[3],h,f)}beam(t,o,a,n,s=0,i=4,h=a,f=!1){const l=o[0]-t[0],d=o[1]-t[1],r=o[2]-t[2],m=Math.hypot(l,d,r)||1,u=l/m,w=d/m,M=r/m;let L=-M,y=0,v=u;Math.abs(w)>.99&&(L=1,v=0);const z=Math.hypot(L,y,v);L/=z,y/=z,v/=z;const k=w*v-M*y,E=M*L-u*v,U=u*y-w*L,tt=$=>{const Z=($+.5)/i*wt,ht=Math.cos(Z),it=Math.sin(Z);return[L*ht+k*it,y*ht+E*it,v*ht+U*it]};for(let $=0;$<i;$++){const Z=tt($),ht=tt($+1),it=(Ct,Tt,q)=>[Tt[0]+Ct[0]*q,Tt[1]+Ct[1]*q,Tt[2]+Ct[2]*q],vt=it(Z,t,a),g=it(ht,t,a),st=it(ht,o,h),It=it(Z,o,h);if(f&&this.tri(o,It,st,n,s),i<=4){this.quad(vt,g,st,It,n,s);continue}for(const[Ct,Tt]of[[vt,Z],[g,ht],[st,ht],[vt,Z],[st,ht],[It,Z]])this.vert(Ct[0],Ct[1],Ct[2],Tt[0],Tt[1],Tt[2],n,s)}}strip(t,o,a,n,s=0){const i=o[0]-t[0],h=o[1]-t[1],f=o[2]-t[2],l=Math.hypot(i,h,f)||1,d=Math.hypot(i,f);let r=-i*h,m=d*d,u=-f*h;d<1e-4*l&&(r=1,m=0,u=0);const w=Math.hypot(r,m,u)||1;r*=a/w,m*=a/w,u*=a/w,this.quad([t[0]-r,t[1]-m,t[2]-u],[t[0]+r,t[1]+m,t[2]+u],[o[0]+r,o[1]+m,o[2]+u],[o[0]-r,o[1]-m,o[2]-u],n,s)}cyl(t,o,a,n,s,i,h,f,l=0,d=!1,r=f){const m=(s-i)/Math.max(a-o,1e-6),u=Math.hypot(1,m),w=d?-1:1;for(let M=0;M<h;M++){const L=M/h*wt,y=(M+1)/h*wt,v=Math.cos(L),z=Math.sin(L),k=Math.cos(y),E=Math.sin(y),U=[t+v*s,o,n+z*s],tt=[t+k*s,o,n+E*s],$=[t+k*i,a,n+E*i],Z=[t+v*i,a,n+z*i],ht=d?[[U,v,z,f],[$,k,E,r],[tt,k,E,f],[U,v,z,f],[Z,v,z,r],[$,k,E,r]]:[[U,v,z,f],[tt,k,E,f],[$,k,E,r],[U,v,z,f],[$,k,E,r],[Z,v,z,r]];for(const[it,vt,g,st]of ht)this.vert(it[0],it[1],it[2],w*vt/u,w*m/u,w*g/u,st,l)}}disc(t,o,a,n,s,i,h=0,f=!0,l=0){for(let d=0;d<s;d++){const r=d/s*wt,m=(d+1)/s*wt,u=Math.cos(r),w=Math.sin(r),M=Math.cos(m),L=Math.sin(m),y=[t+u*n,o,a+w*n],v=[t+M*n,o,a+L*n];if(l<=0){f?this.tri([t,o,a],v,y,i,h):this.tri([t,o,a],y,v,i,h);continue}const z=[t+M*l,o,a+L*l],k=[t+u*l,o,a+w*l];f?this.quad(v,y,k,z,i,h):this.quad(y,v,z,k,i,h)}}rim(t,o,a,n,s,i=0,h=a){for(let f=0;f<o;f++){const l=f/o*wt,d=(f+1)/o*wt;this.beamZ([Math.cos(l)*t,Math.sin(l)*t,n],[Math.cos(d)*t,Math.sin(d)*t,n],a,h,s,i)}}beamZ(t,o,a,n,s,i=0){const h=o[0]-t[0],f=o[1]-t[1],l=Math.hypot(h,f)||1,d=-f/l*a,r=h/l*a,m=[[t[0]+d,t[1]+r],[o[0]+d,o[1]+r],[o[0]-d,o[1]-r],[t[0]-d,t[1]-r]],u=(w,M)=>[m[w][0],m[w][1],M];this.quad(u(0,t[2]+n),u(3,t[2]+n),u(2,o[2]+n),u(1,o[2]+n),s,i),this.quad(u(0,t[2]-n),u(1,o[2]-n),u(2,o[2]-n),u(3,t[2]-n),s,i),this.quad(u(0,t[2]-n),u(0,t[2]+n),u(1,o[2]+n),u(1,o[2]-n),s,i),this.quad(u(3,t[2]+n),u(3,t[2]-n),u(2,o[2]-n),u(2,o[2]+n),s,i)}add(t,o){const a=o?o.elements:null;for(let n=0;n<t.p.length;n+=3){const s=t.p[n],i=t.p[n+1],h=t.p[n+2],f=t.n[n],l=t.n[n+1],d=t.n[n+2];if(!a){this.p.push(s,i,h),this.n.push(f,l,d);continue}this.p.push(a[0]*s+a[4]*i+a[8]*h+a[12],a[1]*s+a[5]*i+a[9]*h+a[13],a[2]*s+a[6]*i+a[10]*h+a[14]);const r=a[0]*f+a[4]*l+a[8]*d,m=a[1]*f+a[5]*l+a[9]*d,u=a[2]*f+a[6]*l+a[10]*d,w=Math.hypot(r,m,u)||1;this.n.push(r/w,m/w,u/w)}for(let n=0;n<t.c.length;n++)this.c.push(t.c[n]);return this}build(){const t=new B.BufferGeometry;return t.setAttribute("position",new B.Float32BufferAttribute(this.p,3)),t.setAttribute("normal",new B.Float32BufferAttribute(this.n,3)),t.setAttribute("aCol",new B.Float32BufferAttribute(this.c,4)),t.userData.triangles=this.triangles,t}}function ze(e){const t=e.range(125,140),o=e.range(244,268),a=[];for(const g of[2,3,4,5])a.push([g,e.range(.02,.065)*(g===2?1:.8),e.range(0,wt)]);const[[n,s,i],[h,f,l],[d,r,m],[u,w,M]]=a,L=g=>1+s*Math.cos(n*g+i)+f*Math.cos(h*g+l)+r*Math.cos(d*g+m)+w*Math.cos(u*g+M),y=(g,st)=>Math.hypot(g/t,st/o)/L(Math.atan2(st/o,g/t)),v=(g,st)=>{const It=y(g,st),Ct=(y(g+1,st)-y(g-1,st))/2,Tt=(y(g,st+1)-y(g,st-1))/2;return(It-1)/Math.max(Math.hypot(Ct,Tt),1e-5)},z=1-(Math.abs(s)+Math.abs(f)+Math.abs(r)+Math.abs(w)),k=n*Math.abs(s)+h*Math.abs(f)+d*Math.abs(r)+u*Math.abs(w),E=Math.SQRT2*1.001/z*Math.hypot(1,k/z)/Math.min(t,o),U=(g,st,It)=>{const Ct=y(g,st);return Ct>=1&&It>0?!1:1-Ct>=It*E?!0:-v(g,st)>=It},tt=g=>{const st=L(g);return[t*st*Math.cos(g),o*st*Math.sin(g)]};let $=0,Z=0,ht=0,it=0;for(let g=0;g<360;g++){const st=tt(g/360*wt);$=Math.min($,st[0]),Z=Math.max(Z,st[0]),ht=Math.min(ht,st[1]),it=Math.max(it,st[1])}const vt={uLakeA:{value:new B.Vector2(t,o)},uLakeH:{value:a.map(g=>new B.Vector3(g[0],g[1],g[2]))}};return{ax:t,az:o,harm:a,swell:L,rho:y,dist:v,inside:U,lip:E,edgeAt:tt,bounds:[$,ht,Z,it],uniforms:vt}}const Le=`
uniform vec2 uLakeA; uniform vec3 uLakeH[4];
float lakeRho(vec2 xz){ vec2 q = xz / uLakeA; float l = length(q); float th = l > 1e-5 ? atan(q.y, q.x) : 0.; float s = 1.;
  for (int i = 0; i < 4; i++) s += uLakeH[i].y * cos(uLakeH[i].x * th + uLakeH[i].z); return l / s; }
`;function Te(){const e=(t,o,a)=>({value:new B.Vector3(t,o,a)});return{uT:{value:0},uWind:{value:1},uVane:{value:0},uLamp:{value:0},uPx:{value:450},uSun:e(.4,.8,.4),uSunCol:e(1.2,1.1,.95),uSkyCol:e(.3,.4,.55),uGroundCol:e(.3,.24,.16),uFogCol:e(.8,.75,.65),uFogDen:{value:8e-4},uCaveFog:e(.03,.09,.13),uCaveDen:{value:.0042},uCaveAmb:e(.1,.14,.15),uCaveKey:e(.9,.86,.72),uWaterCol:e(.2,.66,.8),uShaft:{value:[new B.Vector4(0,0,15,-46),new B.Vector4(0,0,9,-46)]},uPoolCol:e(.3,.36,.14),uRun:e(1,0,0),uQLamp:{value:[new B.Vector4(0,-900,0,0),new B.Vector4(0,-900,0,0),new B.Vector4(0,-900,0,0)]},uQLampCol:e(1.5,.82,.3),uRingL:{value:new B.Vector4(0,-900,0,0)},uRingCol:e(1,.9,.66),tLake:{value:null},uLakeBox:{value:new B.Vector4(0,0,1,1)}}}const he=`
float h21(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
`,fe=`
uniform vec3 uSun, uSunCol, uSkyCol, uGroundCol, uFogCol, uCaveFog, uCaveAmb, uCaveKey; uniform float uFogDen, uCaveDen;
float dayAt(float y){ return smoothstep(-22., -3., y); }
vec3 placeFog(vec3 col, vec3 w){ float day = dayAt(w.y), d = distance(cameraPosition, w), den = mix(uCaveDen, uFogDen, day);
  return mix(col, mix(uCaveFog, uFogCol, day), 1. - exp(-den * den * d * d)); }
`,de=`
uniform vec4 uQLamp[3], uRingL; uniform vec3 uQLampCol, uRingCol;
vec3 qLamp(vec3 p, vec3 n){ vec3 s = vec3(0.);
  for (int i = 0; i < 3; i++) { vec3 lv = uQLamp[i].xyz - p; float d2 = dot(lv, lv); s += uQLampCol * uQLamp[i].w * (.4 + .6 * max(dot(n, lv) * inversesqrt(max(d2, 1e-4)), 0.)) / (1. + d2 / 10.); }
  { vec3 lv = uRingL.xyz - p; float d2 = dot(lv, lv); s += uRingCol * uRingL.w * (.35 + .65 * max(dot(n, lv) * inversesqrt(max(d2, 1e-4)), 0.)) / (1. + d2 / 260.); }
  return s; }
`,Ae=`
attribute vec4 aCol;
#ifdef USE_INSTANCING
attribute vec4 aMove;
#endif
uniform float uT, uWind, uVane, uPx;
varying vec3 vCol; varying float vMat; varying vec3 vN; varying vec3 vW; varying vec3 vL; varying vec3 vLN; varying float vSeed; varying float vA;
mat2 rot2(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
void main(){
  vec3 p = position, n = normal;
  #ifdef USE_INSTANCING
  mat4 im = instanceMatrix; vec4 mv = aMove;
  #else
  mat4 im = mat4(1.); vec4 mv = vec4(0.);
  #endif
  #if MODE == 1
  float a = mv.y + mv.x * uT * mix(1., uWind, mv.z); p.xy = rot2(a) * p.xy; n.xy = rot2(a) * n.xy;
  #elif MODE == 2
  float a = mv.z * sin(mv.y + mv.x * uT); p.xy = rot2(a) * p.xy; n.xy = rot2(a) * n.xy;
  #elif MODE == 3
  float a = mv.y + mv.x * uT; p.xz = rot2(a) * p.xz; n.xz = rot2(a) * n.xz;
  #elif MODE == 4
  float a = uVane + mv.z * sin(mv.y + mv.x * uT); p.xz = rot2(a) * p.xz; n.xz = rot2(a) * n.xz;
  #elif MODE == 5
  float u = fract(uT / mv.x + mv.y), s = smoothstep(.16, .42, u) - smoothstep(.6, .86, u);
  if (aCol.a > 1.5 && aCol.a < 2.5) {
    // the thread of water a rising bucket sheds: no longer than the bucket's height over the water, none going down
    float S = length(im[1].xyz); bool up = u > .6 && u < .9;
    p.y = -.62 - (up ? min(-(p.y + .62), max(mv.z * (1. - s) - .25, 0.) / S) : 0.); if (!up) p.xz = vec2(0.);
  }
  float a = mv.w * (1. - smoothstep(0., .012, s)); p.xy = rot2(a) * p.xy; n.xy = rot2(a) * n.xy; p.y -= mv.z * s / length(im[1].xyz);
  #elif MODE == 6
  float u = fract(uT / mv.x + mv.y), s = smoothstep(.16, .42, u) - smoothstep(.6, .86, u); p.y *= mv.z * s + mv.w;
  #elif MODE == 7
  p.y *= mv.z;
  #elif MODE == 8
  float H = mv.z, r = mv.w, loop = 2. * H + 6.2831853 * r, s = mod(mv.y + mv.x * uT, loop), a = 0.; vec2 c = vec2(-r, -H + s);
  // a pot comes up full and goes down empty: its water is folded away from the top wheel's crown to the foot
  if (aCol.a > 1.5 && aCol.a < 2.5 && s > H + 1.5707963 * r) p = vec3(0.);
  // (the thread it spills: from its lip down, by the pot's own length, while it rises clear of the water and under the top wheel)
  if (aCol.a > 1.5 && aCol.a < 2.5 && position.y < .19) { if (s < 1.5 || s > H - .5) p = vec3(0.); else p.y = .18 - min(.18 - p.y, min(s - 1.1, 1.1 + 1.3 * fract(mv.y * .731))); }
  if (s >= H && s < H + 3.14159265 * r) { float th = (s - H) / r; c = vec2(-r * cos(th), r * sin(th)); a = -th; }
  else if (s >= H + 3.14159265 * r && s < 2. * H + 3.14159265 * r) { c = vec2(r, -(s - H - 3.14159265 * r)); a = -3.14159265; }
  else if (s >= 2. * H + 3.14159265 * r) { float th = (s - 2. * H - 3.14159265 * r) / r; c = vec2(r * cos(th), -H - r * sin(th)); a = -3.14159265 - th; }
  p.xy = rot2(a) * p.xy + c; n.xy = rot2(a) * n.xy;
  #elif MODE == 9
  // a walker on its road (its instance's z): out and back on the world's clock (mv.x turns of the road a second from
  // the phase mv.y; mv.z the road's half length), slowing to turn about at either end; a small bob in its step (mv.w)
  float q = fract(uT * mv.x + mv.y) * 2., c9 = clamp(sin(3.14159265 * q) * 14., -1., 1.), a = (1. - c9) * 1.5707963;
  p.xz = rot2(a) * p.xz; n.xz = rot2(a) * n.xz; p.y += abs(sin(uT * 3.3 + mv.y * 40.)) * mv.w * abs(c9); p.z -= mv.z * cos(3.14159265 * q);
  #endif
  // A ROPE IS SEEN (the bucket's rope and a chain's strand): where its breadth (0.09 m) would be under ONE PICTURE
  // ELEMENT at its distance it is drawn one element broad and PAID BACK IN STRENGTH (vA: its true breadth over its
  // drawn one, the share of itself it is drawn with; laid ONCE, from one side: liftMaterial): the allowed floor for
  // a thin thing, and the one thing in this shader's vertices that reads the eye (uPx: the picture's height in
  // elements, set each frame; the fragments' pxg below is the other reader of the picture's grain)
  #if MODE == 6 || MODE == 7
  { vec4 axc = projectionMatrix * viewMatrix * modelMatrix * im * vec4(0., p.y, 0., 1.);
    float broad = max(1., max(axc.w, .3) / (projectionMatrix[1][1] * max(uPx, 1.)) / .045); p.xz *= broad; vA = 1. / broad; }
  #else
  vA = 1.;
  #endif
  vec3 sc = vec3(length(im[0].xyz), length(im[1].xyz), length(im[2].xyz));
  vL = position * sc; vLN = normal; vSeed = fract(dot(im[3].xz, vec2(.1371, .7313)));
  vec4 w = modelMatrix * im * vec4(p, 1.);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * mat3(im) * (n / max(sc * sc, vec3(1e-6))));
  vCol = aCol.rgb; vMat = aCol.a;
  #ifdef USE_INSTANCING_COLOR
  vCol *= instanceColor;
  #endif
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Ee=`
uniform float uT, uLamp; uniform vec3 uWaterCol, uPoolCol, uRun; uniform vec4 uShaft[2], uLakeBox; uniform sampler2D tLake;
varying vec3 vCol; varying float vMat; varying vec3 vN; varying vec3 vW; varying vec3 vL; varying vec3 vLN; varying float vSeed; varying float vA;
${he}
${fe}
${de}
void main(){
  vec3 n = normalize(vN); if (dot(n, cameraPosition - vW) < 0.) n = -n;
  vec3 alb = vCol; float mat = floor(vMat + .5);
  // (pxg: the picture's own grain at the lit point: the metres of the rock one picture element spans there, the
  //  larger of its two spans, across the picture and down it, each by itself: it does not turn with the frame. IT
  //  READS THE EYE, and these ask it, each in its own way: THE JOINTS OF DRESSED STONE (mat 9, the piers' and the
  //  gate's; mat 10, the fine stone at the great well's mouth) do not fade to a mean: they are a plain dark line
  //  read from near (0.38 of the tone at 6 cm an element or less; 0.3 at 5 cm) and weaken to a faint line (0.2
  //  from 25 cm an element; 0.1 from 20 cm) that stays at any distance beyond; OLD TIMBER (mat 11) loses its
  //  marks to the plain timber, not to their mean: the fine grain by 10 cm an element, the coarse grain, checks
  //  and bolts by 50 cm, the far tone, the straps and their stain by 1.4 m; A SEAM OF THE GREAT WELL'S WALL fades
  //  to its field's own mean (below). One more mark in this shader is filtered, by its own change to an element
  //  and not by pxg: A WINDOW'S BARS (mat 4, below))
  float pxg = max(max(length(dFdx(vW)), length(dFdy(vW))), 1e-4);
  if (mat == 4.) {
    // a house wall in its own metres (bays of 2.6 m, storeys of 3.1 m): in a bay a window with its two shutter leaves
    // folded back and a sill, or on the ground floor a deep arched doorway with its door standing half open; plaster
    // stained under the sills and down from the roof, darker and damp at its foot; on some bays a vine
    vec3 ln = abs(vLN);
    if (ln.y < .5) {
      float u = (ln.x > .5 ? vL.z : vL.x) + 40., v = vL.y;
      vec2 cell = vec2(floor(u / 2.6), floor(v / 3.1)), f = vec2(u - cell.x * 2.6, v - cell.y * 3.1);
      // (the bay's own number: whole numbers only go into the hash, so every pixel of a bay reads the same draw)
      float fx = step(.5, ln.x), r = h21(cell + floor(vSeed * 91.) + fx * 7.), ax = abs(f.x - 1.3);
      vec3 paint = vSeed < .33 ? vec3(.07, .23, .42) : (vSeed < .66 ? vec3(.42, .17, .07) : vec3(.1, .3, .22));
      float isDoor = step(cell.y, .5) * step(.2, r) * step(r, .45), isWin = step(.45, r) * step(r, .93);
      float inY = step(1.2, f.y) * step(f.y, 2.3);
      float hole = isWin * step(ax, .36) * inY, leaf = isWin * step(.36, ax) * step(ax, .7) * inY, sill = isWin * step(ax, .52) * step(1.07, f.y) * step(f.y, 1.2);
      float streak = isWin * step(ax, .44) * step(f.y, 1.07) * smoothstep(.1, 1.07, f.y) * (.4 + .6 * vn(vec2(u * 9., v)));
      float head = 1.65 + sqrt(max(.3025 - ax * ax, 0.)), door = isDoor * step(ax, .55) * step(f.y, head), jamb = isDoor * step(ax, .68) * step(f.y, head + .13) * (1. - door);
      alb *= 1. - .22 * smoothstep(.5, .85, vn(vec2(u * 2.1, v * .15 + vSeed * 7.)));
      alb *= 1. - .2 * streak;
      alb *= mix(.6, 1., smoothstep(.1, 1., v + .25 * vn(vec2(u * 1.5, 2.))));
      float vine = step(.8, h21(vec2(cell.x, floor(vSeed * 37.) + fx * 3.))) * smoothstep(0., .8, 1.6 + 3.2 * h21(vec2(cell.x, 5.)) - v + .7 * vn(vec2(u * 2.5, v * 2.5))) * smoothstep(.36, .5, vn(vec2(u * 1.7, v * 1.7)));
      alb = mix(alb, vec3(.09, .24, .07) * (.7 + .6 * vn(vec2(u * 11., v * 11.))), vine * .9);
      // (the leaves are plain painted boards; the opening is dark, with three plain upright bars, 4.4 cm broad, that
      //  sink into the dark as a pixel grows wider than 3 cm of the wall: their strength is 3 cm over the pixel's span)
      alb = mix(alb, paint * (.82 + .18 * smoothstep(.36, .7, ax)), leaf * .92);
      float bar = max(step(abs(ax - .16), .022), step(ax, .022)) * clamp(.03 / max(fwidth(u), 1e-4), 0., 1.);
      alb = mix(alb, vCol * 1.08, sill); alb = mix(alb, mix(vec3(.025, .03, .04), vec3(.13, .12, .11), bar), hole);
      alb = mix(alb, vCol * .7, jamb * .8);
      alb = mix(alb, f.x < 1.42 ? paint * .42 : vec3(.02, .022, .03) + .05 * smoothstep(.5, 0., f.y), door);
    }
    alb *= .93 + .14 * vn(vW.xz * .9 + vW.y * .7);
  }
  if (mat == 9.) {
    // dressed stone under old whitewash: courses of half a metre breaking joint, rain's streaks, a darker foot
    if (abs(vLN.y) < .7) {
      float u = vW.x + vW.z, y = vW.y, c = floor(y / .5), uu = u / 1.05 + .5 * mod(c, 2.);
      float joint = max(smoothstep(.43, .5, abs(fract(y / .5) - .5)), smoothstep(.46, .5, abs(fract(uu) - .5)));
      // (read from near, each stone is of its own tone and its joints are a plain dark line: the joints at their old strength where the picture cannot hold more)
      alb *= (.86 + .22 * h21(vec2(floor(uu), c))) * (1. - mix(.2, .38, smoothstep(.25, .06, pxg)) * joint) * (1. - .25 * smoothstep(.5, .85, vn(vec2(u * 1.7, y * .12 + 3.))));
      alb *= mix(.7, 1., smoothstep(0., 1.6, y));
    }
  }
  if (mat == 10.) {
    // dressed stone under old whitewash, FINE AND UNEVEN (the piers about the great well's mouth): courses of 0.18 to
    // 0.5 m, no two alike, each of stones of its own length, the joints faint: a smooth pale face, nothing banded
    if (abs(vLN.y) < .7) {
      float u = vW.x + vW.z, y = vW.y, yy = y / .27 + .9 * vn(vec2(y * 1.3, 4.)), c = floor(yy), uu = u / (.7 + .5 * h21(vec2(c, 9.))) + h21(vec2(c, 2.));
      float joint = max(smoothstep(.45, .5, abs(fract(yy) - .5)), smoothstep(.47, .5, abs(fract(uu) - .5)));
      // (READ FROM NEAR: each stone its own tone (0.86 to 1.04), the joints a soft dark line, a third as strong
      //  where the picture cannot hold them; rain's streaks down from the cap; the foot darker and damp)
      alb *= (.86 + .18 * h21(vec2(floor(uu), c))) * (1. - mix(.1, .3, smoothstep(.2, .05, pxg)) * joint) * (1. - .26 * smoothstep(.5, .85, vn(vec2(u * 1.7, y * .12 + 3.))));
      alb *= mix(.66, 1., smoothstep(0., 1.9, y + .5 * vn(vec2(u * .8, 1.))));
    }
  }
  if (mat == 11.) {
    // OLD TIMBER READ FROM NEAR (the head tower's baulks): its grain and its long checks run along the baulk, an iron
    // strap with its bolts binds it every 5.2 m, its foot and its weather side are stained. All in the baulk's own
    // metres (along it: al; across it: ac), the same from anywhere; each mark fades out to the plain timber (not
    // to its own mean) where the picture cannot hold it (pxg): the fine grain between 2.5 and 10 cm an element,
    // the coarse grain, the checks and the bolts between 12 and 50 cm, the far tone, the straps and their stain
    // between 0.45 and 1.4 m
    float tk = floor(((vMat - 11.) / .8 + .5) * 256.), tb = floor(tk / 16.), be = (tb + .5) / 16. * 3.14159265, el = ((tk - tb * 16.) / 8. - .5) * 3.14159265;
    vec3 ax = vec3(cos(be) * cos(el), sin(el), sin(be) * cos(el)), u1 = vec3(-sin(be), 0., cos(be)), u2 = cross(ax, u1);
    float al = dot(vW, ax); vec2 ac = vec2(dot(vW, u1), dot(vW, u2));
    float fine = smoothstep(.1, .025, pxg), mid = smoothstep(.5, .12, pxg), farK = smoothstep(1.4, .45, pxg);
    float g1 = vn(vec2(ac.x * 8. + ac.y * 6.3, al * .3)), g2 = vn(vec2(ac.x * 29. + ac.y * 21., al * .9));
    alb *= mix(1., .74 + .38 * g1, mid) * mix(1., .9 + .2 * g2, fine);
    alb *= 1. - .5 * mid * smoothstep(.07, 0., abs(vn(vec2(ac.x * 2.7 + ac.y * 3.3, al * .11) + 7.) - .5));
    alb *= mix(1., .8 + .4 * vn(vec2(al * .16, ac.x + ac.y)), farK);
    float sa = abs(fract(al / 5.2 + .31) - .5) * 5.2, strap = smoothstep(.16, .13, sa) * farK;
    float bolt = smoothstep(.06, .035, length(vec2(sa - .0, fract((ac.x + ac.y) * 2.2) - .5) * vec2(1., .45))) * mid;
    alb = mix(alb, vec3(.07, .064, .058) * (.8 + .5 * g1), strap * .9); alb = mix(alb, vec3(.2, .19, .17), bolt * strap);
    alb *= 1. - .16 * smoothstep(.16, .5, sa) * smoothstep(.9, .16, sa) * farK;
  }
  if (mat == 7. && vW.y < uShaft[0].w + 8.) {
    // the living rock of the landing (low over the water): mottled, cracked, bedded on what stands steep, dark and damp toward the water
    float m1 = vn(vW.xz * .55 + 3.), m2 = vn(vW.xz * 2.3 + vW.y * 1.7), cr = smoothstep(.06, 0., abs(vn(vW.xz * .8 + 11.) - .5));
    float bd = (1. - abs(n.y)) * smoothstep(.12, 0., abs(fract(vW.y * 1.7 + .5 * m1) - .5));
    alb *= (.62 + .5 * m1) * (.8 + .4 * m2) * (1. - .28 * cr) * (1. - .4 * bd);
    alb *= mix(.4, 1., smoothstep(.1, .9, vW.y - uShaft[0].w + .25 * m2));
  }
  float day = dayAt(vW.y), wet = mat == 8. ? 1. : 0.;
  // the nearer great shaft: its axis, its radius, the water's level under it. A great shaft's wall, and whatever hangs
  // or grows inside one above the roof, takes the shaft's own light (below).
  vec4 sh = distance(vW.xz, uShaft[0].xy) < distance(vW.xz, uShaft[1].xy) ? uShaft[0] : uShaft[1];
  vec2 so = vW.xz - sh.xy; float sr = length(so);
  float inShaft = mat == 6. ? 1. : step(sr, sh.z + 1.2) * step(vW.y, .5) * step(sh.w + 16., vW.y);
  if (mat == 6.) {
    // a great shaft's wall, in its own metres round (ua) and down (y): dressed courses for the first 5 m, then the
    // living rock: beds of uneven thickness, cracks, pits; pale lime runs, dark wet streaks, moss where damp meets light
    float ua = atan(so.y, so.x) * sh.z, y = vW.y;
    float rockK = smoothstep(-4.6, -5.4, y + .5 * vn(vec2(ua * .3, 1.)));
    float c = floor(y / .5), u = ua / 1.1 + .5 * mod(c, 2.);
    float joint = max(smoothstep(.42, .5, abs(fract(y / .5) - .5)), smoothstep(.45, .5, abs(fract(u) - .5)));
    float stone = .86 + .22 * h21(vec2(floor(u), c));
    float bed = smoothstep(.12, 0., abs(fract(y * .31 + .6 * vn(vec2(ua * .12, y * .1))) - .5));
    // (THE GREAT WELL'S WALL HAS NO THIN DARK LINE ON IT: its cracks are BROAD SOFT SEAMS of the rock, by the same
    //  field: three times as broad (0.66 m across at the middle of their run, where the lines were 0.21 m), a third
    //  as dark, soft from their middle to their edge, DRAWN WHEREVER THE FIELD LAYS THEM, by the lit point's place
    //  alone: the same from anywhere and at any size of picture. ONE FILTER READS THE EYE, and only this: where a
    //  seam's WHOLE breadth (0.66 m) would span under one and a half picture elements it fades to the field's own
    //  mean (0.082), and is at the mean from half an element (pxg): it takes away only what the picture cannot
    //  hold. The widest shaft's wall keeps its lines, as it was)
    float cf = abs(vn(vec2(ua * .45, y * .2) + 11.) - .5);
    float crack = sh.z >= 12. ? mix(.082, smoothstep(.05, 0., cf), smoothstep(.5, 1.5, .66 / pxg)) / 3. : 1. - smoothstep(0., .016, cf);
    float pit = .2 * vn(vec2(ua * 1.9, y * 1.9)) + .2 * vn(vec2(ua * .5, y * .7) + 5.);
    // (the widest shaft over the landing is seen from below: its beds and cracks are a little fainter marks)
    float soft = sh.z < 12. ? .55 : 1.;
    // (fl: THE GREAT WELL'S BELL, the flare that faces down over the water, by the wall's own face. On it the wall's
    //  dark bed lines and its seams are not drawn at all: seen from under it, across the whole vault, a line a hand
    //  broad is a thread over the picture; the bell is bedded in broad soft bands instead, below)
    float fl = sh.z >= 12. ? smoothstep(.2, .45, -n.y) : 0., mark = soft * (1. - fl);
    alb *= mix(stone * (1. - .3 * joint * soft), (.66 + 1.3 * pit) * (1. - .42 * bed * mark) * (1. - .34 * crack * mark), rockK);
    float lime = smoothstep(.55, .85, vn(vec2(ua * 1.6, y * .22))) * smoothstep(-1., -9., y);
    alb = mix(alb, vec3(.68, .66, .58), lime * .35);
    wet = .7 * smoothstep(.66, .84, vn(vec2(ua * 1.1 + 40., y * .07))) * smoothstep(-2., -14., y) * smoothstep(sh.w + 16., sh.w + 26., y);
    // where a runnel of the court spills over the rim the wall is wet all the way down
    if (distance(vW.xz, uShaft[0].xy) < uShaft[0].z + 3.) wet = max(wet, smoothstep(.986, .9985, dot(so / max(sr, 1e-3), uRun.xy)) * smoothstep(-.3, -2., y));
    float moss = smoothstep(.5, .75, vn(vec2(ua * .7 + 9., y * .45))) * smoothstep(-34., -6., y) * smoothstep(1., -3., y) * (.4 + .6 * wet + .3 * bed);
    alb = mix(alb, vec3(.16, .26, .08), clamp(moss, 0., .8) * soft * (1. - smoothstep(.2, .45, -n.y)));
    alb *= 1. - .5 * wet;
    // (THE GREAT WELL'S BELL is the hall's own rock seen from under it, bedded as the hall's piers are: BROAD SOFT
    //  BANDS, beds of 2 m each of its own tone (0.82 to 1.16), one bed's tone going over into the next across 1.2 m,
    //  the beds' level wandering by the rock's place (1.8 m over some 8 m) and by a finer grain (0.3 m): rings of
    //  strata round the bell with no line between them and no ledge's shade, nothing narrower than a metre)
    if (fl > 0.) { float sy = y * .5 + .9 * vn(vW.xz * .13 + 2.) + .15 * vn(vW.xz * .6 + 7.), b0 = floor(sy);
      alb *= mix(1., (.7 + .5 * mix(h21(vec2(b0, 3.7)), h21(vec2(b0 + 1., 3.7)), smoothstep(.2, .8, sy - b0))) * (.74 + .5 * vn(vW.xz * .11 + 5.)), fl); wet = max(wet, .5 * fl * smoothstep(.4, .7, vn(vW.xz * .23 + 9.))); }
  }
  if (mat == 8.) alb *= .7;
  vec3 hemi = mix(uGroundCol, uSkyCol, n.y * .5 + .5), lit = hemi + uSunCol * max(dot(n, uSun), 0.);
  if (mat == 1.) lit = hemi + uSunCol * (.5 * abs(dot(n, uSun)) + .3);
  // under the rock a thing takes the daylight that falls WHERE IT STANDS (the lake's table: full under a shaft, a
  // twentieth of it in the dark between) and the light of the quay's lamps
  vec4 lkT = texture2D(tLake, (vW.xz - uLakeBox.xy) * uLakeBox.zw); float fell = min(.05 + 1.6 * lkT.g, 1.);
  // (and the warm light of a mooring's lantern, where one hangs near, at every hour: the table's fourth channel; on
  //  what stands or floats by it up to its pile's head (3.5 m over the water), none from 6 m up: what hangs higher
  //  by it, a rope, a chain, is in the hall's dark)
  vec3 cave = uCaveAmb * (.65 + .35 * n.y) + uCaveKey * (.3 + .7 * max(n.y, 0.)) * fell + qLamp(vW, n) * (1. - day) + vec3(1.5, .82, .3) * lkT.a * .55 * (1. - smoothstep(3.5, 6., vW.y - uShaft[0].w));
  // (WHAT HANGS DOWN A WELL HANGS IN THAT WELL'S OWN SHAFT OF LIGHT: a bucket takes the shaft's day on it under the
  //  rock, whatever the table gives the place, and at night its own lamp's warm light. A ROPE hangs plumb in light
  //  that falls plumb: the day grazes it, so it takes a little of it only and stands as a line of tan hemp, darker
  //  than the lit air of its shaft's core and paler than the dark rock behind: read either way)
  #if MODE == 5
  cave += uCaveKey * (.6 + .5 * max(n.y, 0.)) + vec3(1.5, .82, .3) * uLamp * .12;
  #endif
  // (by night the moon's shaft is too faint to light it pale: the rope is A THIN DIM LINE, hemp in the hall's floor
  //  of light and a sixth of the moon's: darker than the moonlit air of its shaft's core, a little paler than the
  //  dark rock, never black. uLamp is the lamps' strength (4.5 by night), so the night is asked as min(uLamp, 1):
  //  the mix must not run past its end)
  #if MODE == 6 || MODE == 7
  cave = mix(cave + uCaveKey * .05, uCaveAmb * 1.1 + uCaveKey * .17, min(uLamp, 1.));
  #endif
  vec3 light = mix(cave, lit, day), glintCol = mix(uCaveKey * .6, uSkyCol, day);
  if (inShaft > .5) {
    // in a great shaft (by the lit point's own place): near the rim the blue of the round of sky; deeper, the same
    // daylight as the cavern's eye takes it (pale, never dark: a shaft's bore is brighter than the rock round its foot);
    // the lit water below throws its green-blue up the lower walls; and the sun reaches down the side away from it as
    // far as the rim's shadow lets it; and what faces DOWN over the water (a shaft's bell, flaring to the roof) takes
    // the day the bright pool under it gives back, by its height over the water (a half of it at 28 m).
    // THE GREAT WELL'S BELL (fl: its flare, the wall's own faces that look down) takes that day BY ITS HEIGHT OVER
    // ITS POOL, steeply, and on its lip only (below); its own shade is the hall's cool floor of light, not the
    // shaft's gold: a dark vault with a depth (by the lit point's height)
    float y = vW.y, sky = exp(min(y, 0.) / 15.), pool = .75 * exp(-max(y - sh.w, 0.) / 18.), hw = max(y - sh.w, 0.);
    float fl = (mat == 6. && sh.z >= 12.) ? smoothstep(.2, .45, -n.y) : 0.;
    vec2 inw = -so / max(sr, 1e-3); float sl = max(length(uSun.xz), 1e-3), reach = 2. * sh.z * max(dot(inw, uSun.xz / sl), 0.) * uSun.y / sl;
    float sunK = smoothstep(-1.5, .5, y + reach) * max(dot(n, uSun), 0.);
    // (THE BELL IS DARK WET ROCK WITH FORM: its shade the hall's cool floor of light and no more; the day its pool
    //  gives back is on its lip only (a third of it at the water, a half of that 3 m up); what gives it form is the
    //  pool's own green-blue from below, more on what leans to the pool's middle, and the wet's glint)
    light = mix(mix(uCaveKey * .6, uSkyCol * 1.25, sky) * (.62 + .38 * n.y), uCaveAmb * (.5 + .5 * max(dot(n.xz, -so / max(sr, 1e-3)), 0.)), fl) + uPoolCol * pool * (.6 - .4 * n.y) * (1. - .8 * fl) + uSunCol * sunK * .9 + uCaveAmb * .1
      + uCaveKey * max(-n.y, 0.) * mix(.9 * exp(-hw / 40.), .34 * exp(-hw / 4.5), fl);
    // (and THE WATER'S NET on it: the same two slow ridged fields as on the hall's rock, on the clock, green-blue, by
    //  the same height law: the bell hangs over the hall's brightest pool)
    { vec2 pw = vW.xz + y * vec2(.7, .5); float dn = max(-n.y, 0.) * exp(-max(y - sh.w, 0.) / 40.);
      float net = pow(clamp((1. - abs(2. * vn(pw * .42 + vec2(uT * .05, 0.)) - 1.)) * (1. - abs(2. * vn(mat2(.8, -.6, .6, .8) * pw * .71 - vec2(0., uT * .04)) - 1.)), 0., 1.), 3.);
      light += uPoolCol * dn * mix(.3 + 3. * net, .1 + 1.0 * net, fl); }
    // (the widest shaft, seen from under it: THE DAY IS SEEN IN IT: its wall is brighter the nearer the sky, by the
    //  lit point's own height: from 1.6 of its light 12 m over the water to 2.2 of it from 3 m under the ground up:
    //  seen from the dim hall the bore is the brightest stone in the picture)
    if (sh.z < 12.) light *= 1.6 + .6 * smoothstep(sh.w + 12., -3., y);
    glintCol = uSkyCol * sky + uPoolCol * pool;
  }
  // (A ROPE IN THE DAY, over the ground or in a great shaft's lit bore, stands against lit stone and lit dust: there it
  //  is the darker thing, the weathered hemp it was; under the rock it is the pale line against the dark)
  #if MODE == 6 || MODE == 7
  light *= mix(1., .55, max(day, inShaft * (1. - uLamp)));
  #endif
  vec3 col = alb * light;
  if (wet > 0.) {
    // wet stone and wet timber glint: more at a grazing look (the angle of the look, as on any wet thing)
    float ndv = max(dot(n, normalize(cameraPosition - vW)), 0.);
    col += glintCol * wet * (.06 + .5 * pow(clamp(1. - ndv, 0., 1.), 3.)) * (.6 + .8 * vn(vW.xz * 3. + vec2(vW.y * 2.5 + uT * .6, 0.)));
  }
  if (mat == 2.) {
    float sp = vn(vW.xz * 2.3 + vec2(0., uT * 1.7)) * vn(vW.xz * 5.1 - vec2(uT * 1.1, vW.y * 3. + uT * 2.));
    col = uWaterCol * light * .8 + mix(uCaveKey, uSunCol, day) * smoothstep(.3, .62, sp) * 1.3;
    // water that FALLS in the daylight (a wheel's sheet, a tank's lip: a steep face, over 1.5 m above the ground) is
    // white with air: bright streaks running down it, and the drops thrown beside it flash the same way
    float steep = 1. - smoothstep(.45, .8, abs(n.y)), fall = steep * step(1.5, vW.y) * day;
    float run = vn(vec2((vW.x + vW.z) * 5., vW.y * 1.4 + uT * 4.5)) * .6 + vn(vec2((vW.x - vW.z) * 11., vW.y * 3. + uT * 7.)) * .4;
    col = mix(col, (uSunCol * .45 + hemi * .35) * (.55 + .7 * run), fall * .8);
    // and the thread that falls down the great well, under the ground: pale with air too, by the light the shaft has there
    col = mix(col, vec3(.8, .86, .84) * light * (.4 + .8 * run), steep * step(vW.y, -1.) * .85);
  }
  if (mat == 3.) col = alb * (.3 * light + uLamp);
  if (mat == 5.) {
    // a well's throat: the stone lining in courses, lit by the round of sky over it
    float jt = step(abs(vLN.y), .5) * smoothstep(.4, .5, abs(fract(vL.y / .45) - .5));
    col = alb * (1. - .3 * jt) * mix(uCaveKey, vec3(dot(uCaveKey, vec3(.3, .6, .1))), .3) * 3.2;
  }
  gl_FragColor = vec4(placeFog(col, vW), clamp(vA, 0., 1.));
}`;function ue(e,t=0){const o=t===6||t===7,a=new B.ShaderMaterial({name:"WellsLift"+t,uniforms:e,defines:{MODE:t},vertexShader:Ae,fragmentShader:Ee,side:o?B.FrontSide:B.DoubleSide,transparent:o,depthWrite:!o});return o&&(a.userData.order=4.5),a}const Ue={bucketDrop:(e,t,o,a)=>{const n=((e/t+o)%1+1)%1,s=(i,h,f)=>{const l=Math.min(1,Math.max(0,(f-i)/(h-i)));return l*l*(3-2*l)};return a*(s(.16,.42,n)-s(.6,.86,n))},pot:(e,t,o,a,n)=>{const s=2*a+wt*n;let i=(o+t*e)%s;if(i<0&&(i+=s),i<a)return[-n,-a+i];if(i<a+Math.PI*n){const f=(i-a)/n;return[-n*Math.cos(f),n*Math.sin(f)]}if(i<2*a+Math.PI*n)return[n,-(i-a-Math.PI*n)];const h=(i-2*a-Math.PI*n)/n;return[n*Math.cos(h),-a-n*Math.sin(h)]}};function re(e,t,o,a){const n=new B.InstancedMesh(e,t,Math.max(1,o.length));n.count=o.length,n.name=a||"wells";const s=new Float32Array(Math.max(1,o.length)*4);let i=!1;for(let h=0;h<o.length;h++){const f=o[h];if(n.setMatrixAt(h,f.m),f.move&&s.set(f.move,h*4),f.tint){if(!i){i=!0;for(let l=0;l<h;l++)n.setColorAt(l,ve)}n.setColorAt(h,Se.setRGB(f.tint[0],f.tint[1],f.tint[2]))}else i&&n.setColorAt(h,ve)}return e.setAttribute("aMove",new B.InstancedBufferAttribute(s,4)),n.instanceMatrix.needsUpdate=!0,n.instanceColor&&(n.instanceColor.needsUpdate=!0),n.frustumCulled=!1,t.userData&&t.userData.order&&(n.renderOrder=t.userData.order),n}const Se=new B.Color,ve=new B.Color(1,1,1),p=ie,N=(e,t)=>we(e,t),We=ie.lime;function _e({r:e=1.1}={}){const t=new mt,o=8,a=e+.3,n=.9,s=3.1,i=e+.5;t.cyl(0,0,n,0,a+.06,a,o,N(p.stone,.8),0,!1,p.white),t.disc(0,n,0,a,o,p.white,0,!0,e),t.cyl(0,.3,n,0,e,e,o,[.03,.035,.04],0,!0,N(p.stone,.6)),t.disc(0,.3,0,e,o,[.012,.016,.02],0,!0),t.beam([-i,0,0],[-i,s,0],.13,p.timber,0,3),t.beam([i,0,0],[i,s,0],.13,p.timber,0,3),t.beam([-i-.3,s,0],[i+.3,s,0],.13,p.timberDark,0,3),t.box(0,.3,a+.4,1.7,.6,.7,p.stone,0,0,!1),t.quad([-.72,.62,a+.17],[-.72,.62,a+.63],[.72,.62,a+.63],[.72,.62,a+.17],p.water,Q.water);const h=new mt,f=.26,l=.37;for(let d=0;d<6;d++){const r=d/6*wt,m=(d+1)/6*wt;h.quad([Math.cos(r)*f,Math.sin(r)*f,0],[Math.cos(r)*l,Math.sin(r)*l,0],[Math.cos(m)*l,Math.sin(m)*l,0],[Math.cos(m)*f,Math.sin(m)*f,0],p.timberDark)}return h.quad([-f,-.035,0],[f,-.035,0],[f,.035,0],[-f,.035,0],p.timber),h.quad([-.035,-f,0],[.035,-f,0],[.035,f,0],[-.035,f,0],p.timber),{g:t,movers:[{g:h,mode:1,at:[0,s-.56,0],sweep:.4}],pulleyY:s-.56,topY:n,r:e,reach:i+.45,height:s+.15}}function Ce(){const e=new mt;return e.cyl(0,-.62,-.1,0,.21,.3,6,[.2,.115,.055],Q.wet,!1,[.36,.23,.12]),e.disc(0,-.62,0,.21,6,[.17,.1,.05],Q.wet,!1),e.cyl(0,-.2,-.14,0,.29,.3,6,p.iron,Q.wet),e.tri([-.29,-.1,0],[.29,-.1,0],[0,0,0],p.iron),e.beam([0,-.62,0],[0,-3.4,0],.05,p.water,Q.water,3,.024),e}function Oe(){const e=new mt;return e.beam([0,0,0],[0,-1,0],.055,[.66,.56,.36],0,4),e}function Qe(){const e=new mt;return e.cyl(0,-.3,.3,0,.2,.33,6,N(p.clay,.5),0,!1,N(p.clay,.72)),e.disc(0,-.3,0,.2,6,N(p.clay,.45),0,!1),e.disc(0,.2,0,.3,6,p.water,Q.water,!0),e.beam([.27,.18,0],[.27,-2.4,0],.05,p.water,Q.water,3,.02),e}function $e({H:e=16,R:t=5.2,stone:o=!1,red:a=0}={}){const n=new mt,s=[],i=o?1.5:1.2;if(o)n.cyl(0,0,e-1.2,0,1.4,.9,8,N(p.white,.9),Q.solid,!1,p.white),n.cyl(0,e-1.2,e+.5,0,1.15,.2,8,p.timber,0,!1,p.timberDark),n.box(0,1.1,1.5,.9,2.2,.12,p.timberDark);else{const l=Math.max(1,e*.072),d=.3;for(const[w,M]of[[1,1],[1,-1],[-1,-1],[-1,1]])n.beam([w*l,0,M*l],[w*d,e-.6,M*d],.11,p.timber,0,3,.08);const r=3,m=(w,M,L)=>{const y=w/r,v=l+(d-l)*y;return[M*v,(e-.6)*y,L*v]},u=[[1,1],[1,-1],[-1,-1],[-1,1]];for(let w=0;w<r;w++)for(let M=0;M<4;M++){const L=u[M],y=u[(M+1)%4];n.strip(m(w,L[0],L[1]),m(w+1,y[0],y[1]),.07,p.timberDark),w>0&&n.strip(m(w,L[0],L[1]),m(w,y[0],y[1]),.07,p.timberDark)}n.box(0,e-.45,0,1.1,.3,1.1,p.timberDark),n.strip([0,0,0],[0,e-.6,0],.05,p.iron)}n.beam([0,e,i],[0,e+.25,-t*.75],.09,p.timberDark,0,3),n.tri([0,e+.2,-t*.4],[0,e+.3+t*.3,-t*.82],[0,e+.1-t*.14,-t*.82],p.red);const h=new mt,f=8;for(let l=0;l<f;l++){const d=l/f*wt,r=(l+.64)/f*wt,m=Math.cos(d),u=Math.sin(d);h.beam([m*.2,u*.2,0],[m*t,u*t,0],.06,p.timber,0,3,.035);const w=a>0&&l%a===0?p.red:N(p.cloth,.92+.12*(l*7%3)/2),M=[m*t*.24,u*t*.24,.03],L=[m*t*.98,u*t*.98,.03],y=[Math.cos(r)*t*.74,Math.sin(r)*t*.74,t*.1],v=[(M[0]+L[0]+y[0])/3,(M[1]+L[1]+y[1])/3,t*.1];h.tri(M,L,v,w,Q.cloth),h.tri(L,y,v,N(w,.84),Q.cloth),h.tri(y,M,v,N(w,.93),Q.cloth)}h.beam([0,0,0],[0,0,t*.3],.06,p.timberDark,0,3);{const l=h.p.length;h.cyl(0,-.3,.3,0,.26,.2,5,p.timberDark);for(let d=l;d<h.p.length;d+=3){const r=h.p[d+1],m=h.p[d+2];h.p[d+1]=-m,h.p[d+2]=r;const u=h.n[d+1],w=h.n[d+2];h.n[d+1]=-w,h.n[d+2]=u}}return s.push({g:h,mode:1,at:[0,e,i],sweep:t+.1}),{g:n,movers:s,H:e,R:t,hubZ:i,reach:Math.max(t,o?1.6:Math.max(1,e*.072)*1.5),height:e+t}}function Ze({R:e=9,scoops:t=20}={}){const o=new mt,a=e+.1,n=Math.max(.9,e*.12),s=[],i=N(p.timberDark,.75),h=N(p.timber,.62);for(const z of[-1,1]){const k=z*(n+.6),E=e*.5;o.beam([-E,.5,k],[0,a+.3,k],.24,p.timber,0,4,.16),o.beam([E,.5,k],[0,a+.3,k],.24,p.timber,0,4,.16),o.beam([-E*.55,a*.45,k],[E*.55,a*.45,k],.13,p.timberDark,0,4),o.box(-E,-.35,k+z*.1,1.2,1.7,.8,p.stone,Q.stone,0,!1),o.box(E,-.35,k+z*.1,1.2,1.7,.8,p.stone,Q.stone,0,!1)}o.beam([0,a,-n-1],[0,a,n+1],.26,p.timberDark,0,6);const f=e*1.25,l=n+1.5;for(const z of[-1,1])o.box(0,-.6,z*(l+.2),f*2+.8,2,.4,N(p.stone,.85),Q.stone,0,!1);for(const z of[-1,1])o.box(z*(f+.2),-.6,0,.4,2,l*2+.8,N(p.stone,.85),Q.stone,0,!1);o.quad([-f,.12,-l],[-f,.12,l],[f,.12,l],[f,.12,-l],p.water,Q.water);const d=a+e*.5,r=Math.sqrt((e+1.25)**2-(e*.5)**2)+.4,m=n*.85,u=[(e+.55)*Math.cos(1.082),a+(e+.55)*Math.sin(1.082)],w=[(e+.75)*.7071,a+(e+.75)*.7071],M=[r-.2,d+.27];o.box(r+.9,d,0,2.6,.5,n*2+.3,h,Q.wet),o.quad([r-.4,d+.27,-n],[r-.4,d+.27,n],[r+2.2,d+.27,n],[r+2.2,d+.27,-n],p.water,Q.water),o.quad([u[0],u[1],-m],[u[0],u[1],m],[w[0],w[1],m],[w[0],w[1],-m],p.water,Q.water),o.quad([w[0],w[1],-m],[w[0],w[1],m],[M[0],M[1],m],[M[0],M[1],-m],p.water,Q.water);for(const z of[-m,m])o.quad([u[0],u[1],z],[w[0],w[1],z],[w[0]-.3,w[1]-.45,z],[u[0]-.12,u[1]-.3,z],N(p.water,1.25),Q.water),o.quad([w[0],w[1],z],[M[0],M[1],z],[M[0]-.1,M[1]-.5,z],[w[0]-.3,w[1]-.45,z],N(p.water,1.25),Q.water);o.beam([r+1.9,0,-n],[r+1.9,d-.2,-n],.15,p.timber,0,4),o.beam([r+1.9,0,n],[r+1.9,d-.2,n],.15,p.timber,0,4);for(let z=0;z<18;z++){const k=Math.sin(z*12.9898+1.3)*43758.5453,E=k-Math.floor(k),U=Math.sin(z*78.233+.7)*12543.21,tt=U-Math.floor(U),$=z/17*2,Z=$<1?[u[0]+(w[0]-u[0])*$,u[1]+(w[1]-u[1])*$]:[w[0]+(M[0]-w[0])*($-1),w[1]+(M[1]-w[1])*($-1)],ht=Z[0]+(E-.25)*.9,it=Z[1]+(tt-.15)*.9,vt=(E*7.3%1-.5)*2*(m+.3),g=.06+.07*tt;o.quad([ht-g,it-g,vt],[ht+g,it-g,vt],[ht+g,it+g,vt],[ht-g,it+g,vt],p.water,Q.water),o.quad([ht,it-g,vt-g],[ht,it-g,vt+g],[ht,it+g,vt+g],[ht,it+g,vt-g],p.water,Q.water)}const L=new mt,y=16,v=(z,k,E)=>[Math.cos(z)*k,Math.sin(z)*k,E];for(const z of[-1,1]){L.rim(e,y,.2,z*n,i,Q.wet,.1),L.rim(e*.6,y,.1,z*n,i,Q.wet,.07);for(let k=0;k<8;k++){const E=k/8*wt;L.beamZ([Math.cos(E)*.3,Math.sin(E)*.3,z*n],[Math.cos(E)*e,Math.sin(E)*e,z*n],.1,.08,h,Q.wet)}}for(let z=0;z<t;z++){const k=z/t*wt,E=k+.62*wt/t,U=e-.25,tt=e+.5;L.quad(v(k,tt,-n),v(E,tt,-n),v(E,tt,n),v(k,tt,n),i,Q.wet),L.quad(v(E,U,-n),v(E,tt,-n),v(E,tt,n),v(E,U,n),h,Q.wet);for(const $ of[-1,1])L.quad(v(k,U,$*n),v(E,U,$*n),v(E,tt,$*n),v(k,tt,$*n),i,Q.wet);L.quad(v(k,e-.9,-n),v(k,U,-n),v(k,U,n),v(k,e-.9,n),h,Q.wet)}return s.push({g:L,mode:1,at:[0,a,0],sweep:e+.6}),{g:o,movers:s,R:e,hubY:a,hw:n,cw:l,reach:Math.max(f+.6,r+2.4),height:a+e+.8,trough:[r+2.2,d+.27]}}function Xe(){const e=new mt,t=4.2,o=[];e.beam([-.7,0,.35],[0,t,.2],.14,p.timber,0,4),e.beam([.7,0,.35],[0,t,.2],.14,p.timber,0,4),e.beam([-.7,0,-.35],[0,t,-.2],.14,p.timber,0,4),e.beam([.7,0,-.35],[0,t,-.2],.14,p.timber,0,4),e.cyl(3.5,0,.7,0,.85,.8,8,N(p.stone,.8),0,!1,p.white),e.disc(3.5,.7,0,.8,8,[.03,.035,.04],0,!0);const a=new mt;return a.box(.5,0,0,6.6,.26,.26,p.timberDark),a.box(-2.5,-.1,0,.9,.8,.8,p.stoneDark),a.beam([3.5,0,0],[3.5,-3.3,0],.045,p.iron,0,3),o.push({g:a,mode:2,at:[0,t,0],sweep:4.9}),{g:e,movers:o,H:t,reach:4.6,height:t+1.7}}function Je({H:e=10}={}){const t=new mt,o=e*.27,a=[],n=[],s=h=>n.map(f=>[f[0]*(1-h),e*h,f[2]*(1-h)]);for(let h=0;h<3;h++){const f=h/3*wt+.5;n.push([Math.cos(f)*o,0,Math.sin(f)*o])}for(const h of n)t.beam(h,[h[0]*.04,e,h[2]*.04],.13,p.timber,0,4,.09);for(const h of[.3,.62]){const f=s(h);for(let l=0;l<3;l++)t.beam(f[l],f[(l+1)%3],.06,p.timberDark,0,3)}t.box(0,e+.1,0,.6,.5,.6,p.timberDark),t.cyl(0,0,.35,0,.6,.5,6,p.stone);const i=new mt;return i.beam([0,.3,0],[0,e-.2,0],.07,p.iron,0,5),i.box(0,1.5,0,3.6,.14,.14,p.timber),i.cyl(0,e*.55,e*.55+.5,0,.3,.3,6,p.rope),a.push({g:i,mode:3,at:[0,0,0],sweep:1.9,tall:e}),{g:t,movers:a,H:e,reach:o+.2,height:e+.4}}function ta({H:e=8,r:t=1.5}={}){const o=new mt,a=t+.15,n=t*.72,s=[[1,1],[1,-1],[-1,-1],[-1,1]],i=8;for(const[h,f]of s)o.beam([h*a,0,f*a],[h*n,e,f*n],.1,p.timber,0,3,.08);for(let h=0;h<4;h++){const f=s[h],l=s[(h+1)%4],d=(r,m)=>{const u=a+(n-a)*r;return[m[0]*u,e*r,m[1]*u]};o.strip(d(.08,f),d(.52,l),.06,p.timberDark),o.strip(d(.52,f),d(.96,l),.06,p.timberDark)}o.box(0,e+.08,0,t*2.1,.16,t*2.1,p.timberDark),o.cyl(0,e+.16,e+2.5,0,t*.94,t,i,N(p.timber,.9),0,!1,p.timber);for(const h of[.6,1.9])o.cyl(0,e+h,e+h+.12,0,t*.97+.03,t*.98+.03,i,p.iron);return o.disc(0,e+2.38,0,t*.97,i,p.water,Q.water,!0),o.disc(0,e+2.5,0,t,i,p.timber,0,!0,t*.86),o.quad([a*.86,e+2.45,a*.78],[a*.78,e+2.45,a*.86],[a+.08,.1,a+.14],[a+.14,.1,a+.08],N(p.water,.8),Q.water),{g:o,movers:[],H:e,r:t,rimR:t*.9055,reach:a*1.42+.2,height:e+2.5}}function ea(){const e=new mt,t=.5,o=4.9,a=-6.4,n=10,s=N(p.white,.86),i=N(p.stone,1.05),h=N(p.stone,.62),f=5.5;for(const l of[-1,1])e.box(0,-.16,l*.5,2*f,.32,.14,N(p.white,.92),Q.stone,0,!1);e.quad([-f,-.13,-.43],[-f,-.13,.43],[f,-.13,.43],[f,-.13,-.43],p.water,Q.water),e.box(0,-.42,0,2*f,.2,t*2+.2,N(p.stone,.95),Q.stone,0,!0,!1);for(let l=0;l<n;l++){const d=Math.PI*(1-l/n),r=Math.PI*(1-(l+1)/n),m=Math.cos(d)*o,u=a+Math.sin(d)*o,w=Math.cos(r)*o,M=a+Math.sin(r)*o,L=o+.36,y=Math.cos(d)*L,v=a+Math.sin(d)*L,z=Math.cos(r)*L,k=a+Math.sin(r)*L;for(const E of[-1,1]){const U=E*t,tt=E*(t+.06),$=Z=>{E>0?e.quad(Z[0],Z[1],Z[2],Z[3],Z[4],Q.stone):e.quad(Z[3],Z[2],Z[1],Z[0],Z[4],Q.stone)};$([[m,u,U],[w,M,U],[w,-.52,U],[m,-.52,U],s]),$([[m,u,tt],[w,M,tt],[z,k,tt],[y,v,tt],i])}e.quad([m,u,-t],[m,u,t],[w,M,t],[w,M,-t],h,Q.stone)}for(const l of[-1,1]){const d=l*o,r=l*f;e.quad([Math.min(d,r),a,t],[Math.max(d,r),a,t],[Math.max(d,r),-.52,t],[Math.min(d,r),-.52,t],s,Q.stone),e.quad([Math.max(d,r),a,-t],[Math.min(d,r),a,-t],[Math.min(d,r),-.52,-t],[Math.max(d,r),-.52,-t],s,Q.stone),e.box(l*5.2,a-.13,0,.66,.26,t*2+.24,N(p.stone,.98),Q.stone,0,!0,!1)}return{g:e,movers:[],span:2*f,spring:a-.26,width:t*2,ra:o,crown:a+o}}function aa(){const e=new mt;return e.box(0,.5,0,1.2,1,1.1,N(p.white,.84),Q.stone,0,!1,!1),e}function oa(){const e=new mt,t=new mt;return e.beam([0,0,0],[0,1.9,0],.045,p.iron,0,3),t.beamZ([-.75,0,0],[.75,0,0],.03,.02,p.iron),t.tri([.75,0,0],[.5,.14,0],[.5,-.14,0],p.red),t.tri([-.75,0,0],[-.35,.34,0],[-.3,0,0],p.red),t.quad([-.2,.05,0],[.2,.05,0],[.26,.42,0],[-.16,.36,0],p.red),t.tri([.2,.3,0],[.42,.52,0],[.12,.58,0],p.red),{g:e,movers:[{g:t,mode:4,at:[0,1.85,0],sweep:.8}],height:2.5,reach:.8}}function na(){const e=new mt,t=p.white,o=N(p.white,.78),a=.44,n=.9,s=(h,f,l)=>[h,f,l];e.quad(s(-.5,0,.5),s(.5,0,.5),s(.5,1,.5),s(-.5,1,.5),t,Q.wall),e.quad(s(.5,0,-.5),s(-.5,0,-.5),s(-.5,1,-.5),s(.5,1,-.5),t,Q.wall),e.quad(s(.5,0,.5),s(.5,0,-.5),s(.5,1,-.5),s(.5,1,.5),t,Q.wall),e.quad(s(-.5,0,-.5),s(-.5,0,.5),s(-.5,1,.5),s(-.5,1,-.5),t,Q.wall),e.quad(s(-.5,1,.5),s(.5,1,.5),s(a,1,a),s(-a,1,a),t),e.quad(s(.5,1,-.5),s(-.5,1,-.5),s(-a,1,-a),s(a,1,-a),t),e.quad(s(.5,1,.5),s(.5,1,-.5),s(a,1,-a),s(a,1,a),t),e.quad(s(-.5,1,-.5),s(-.5,1,.5),s(-a,1,a),s(-a,1,-a),t);const i=N(p.white,.6);return e.quad(s(-a,n,a),s(a,n,a),s(a,1,a),s(-a,1,a),i),e.quad(s(a,n,-a),s(-a,n,-a),s(-a,1,-a),s(a,1,-a),i),e.quad(s(a,n,a),s(a,n,-a),s(a,1,-a),s(a,1,a),i),e.quad(s(-a,n,-a),s(-a,n,a),s(-a,1,a),s(-a,1,-a),i),e.quad(s(-a,n,a),s(a,n,a),s(a,n,-a),s(-a,n,-a),o),e}function sa(){const e=new mt,t=10,o=3,a=.45;e.cyl(0,0,a,0,1,1,t,N(p.white,.9),0,!1,p.white),e.cyl(0,a,a+.06,0,1.06,1.06,t,N(p.stone,1));for(let n=0;n<o;n++){const s=n/o*Math.PI/2,i=(n+1)/o*Math.PI/2;e.cyl(0,a+.06+Math.sin(s)*.8,a+.06+Math.sin(i)*.8,0,Math.cos(s),Math.max(Math.cos(i),.02),t,p.white)}return e.beam([0,a+.84,0],[0,a+1.1,0],.05,p.stone,0,3,.02),e}function ra(){const e=new mt,t=new mt,o=1.5,a=1.6,n=2.9,s=2.3,i=[1,1,1];e.beam([.04,n,-o],[.04,n,o],.05,p.timberDark,0,3);for(const h of[-o+.1,o-.1])e.beam([a-.06,0,h],[a-.06,s+.05,h],.05,p.timber,0,3);for(let h=0;h<4;h++){const f=-o+h*o/2,l=f+o/2,d=N(i,h%2?.74:1);t.quad([0,0,f],[0,0,l],[a,s-n,l],[a,s-n,f],d,Q.cloth),t.quad([a,s-n,f],[a,s-n,l],[a+.03,s-n-.32,l],[a+.03,s-n-.32,f],d,Q.cloth)}return{g:e,movers:[{g:t,mode:2,at:[0,n,0],sweep:1.9}]}}function ia(){const e=new mt,t=8;for(let o=0;o<t;o++)e.box(0,(o+1)/t/2,-.5+(o+.5)/t,1,(o+1)/t,1/t,N(p.white,o%2?.86:.94),0,0,!1);return e}function la({walk:e=!1}={}){const t=new mt;return t.cyl(0,0,1.28,0,.27,.17,5,p.white),t.cyl(0,1.3,1.56,0,.115,.1,5,N(p.clay,.75)),t.disc(0,1.56,0,.1,5,N(p.cloth,.9),0,!0),e?(t.beam([.16,1.2,0],[.22,.7,.06],.05,p.white,0,3),t.beam([-.16,1.2,0],[-.17,1.66,.02],.05,p.white,0,3),t.cyl(0,1.57,1.95,0,.1,.2,5,N(p.clay,.62),0,!1,N(p.clay,.8)),t.disc(0,1.95,0,.12,5,N(p.clay,.3),0,!0),t.disc(0,.03,0,.55,6,[.16,.13,.1],0,!0),t):(t.beam([.14,1.18,0],[.2,1,.5],.05,p.white,0,3),t.beam([-.14,1.18,0],[-.2,1,.5],.05,p.white,0,3),t)}function ha(){const e=new mt,t=[.27,.24,.21],o=N(t,.7),a=.7,n=1.05,s=.27;e.box(0,n,0,s*2,.52,a*2,t);for(const[h,f]of[[1,1],[1,-1],[-1,-1],[-1,1]])e.beam([h*s*.7,n-.2,f*a*.82],[h*s*.7,0,f*a*.86],.07,o,0,3,.05);const i=[0,n+.42,a+.3];e.beam([0,n+.1,a-.1],i,.13,t,0,4,.1),e.beam(i,[0,i[1]-.22,i[2]+.36],.11,t,0,4,.06),e.beam([0,n+.1,-a],[0,n-.5,-a-.12],.03,o,0,3);for(const h of[-1,1])for(const f of[-.3,.26])e.cyl(h*(s+.24),n-.3,n+.34,f,.13,.22,5,N(p.clay,.62),0,!1,N(p.clay,.8));return e.box(0,n+.36,-.05,.9,.2,.9,N(p.cloth,.8),Q.cloth),e.disc(0,.03,0,a+.5,7,[.16,.13,.1],0,!0),e}function ca(){const e=new mt,t=new mt,o=1.9;for(const s of[-1.7,1.7])e.beam([0,0,s],[0,o+.1,s],.045,p.timberDark,0,3);e.beam([0,o,-1.7],[0,o,1.7],.012,p.rope,0,3);const a=[p.white,N(p.red,.9),[.16,.32,.5],p.cloth,N(p.ochre,1.1)];let n=-1.45;for(let s=0;s<5;s++){const i=.42+.16*(s*7%3),h=.7+.25*(s*5%3);t.quad([0,0,n],[0,0,n+i],[.02,-h,n+i],[.02,-h,n],a[s],Q.cloth),n+=i+.12}return{g:e,movers:[{g:t,mode:2,at:[0,o,0],sweep:1.4}]}}function fa(){const e=new mt,t=[.9,.9,.86],o=[.05,.05,.06],a=N(p.red,.95);for(const n of[-.07,.07])e.beam([n,0,0],[n,.62,.02],.018,a,0,3);return e.beam([0,.72,-.34],[0,.82,.2],.17,t,0,5,.13),e.beam([0,.66,-.52],[0,.74,-.3],.1,o,0,4,.15),e.beam([0,.84,.16],[0,1.22,.3],.055,t,0,4,.05),e.beam([0,1.2,.28],[0,1.24,.4],.07,t,0,4,.05),e.beam([0,1.22,.38],[0,1.12,.72],.03,a,0,3,.008),e}function da(e){const t=new mt;for(let o=0;o<7;o++){const a=(o-3)*.36+e.range(-.12,.12),n=e.range(.5,.9),s=.065,i=Math.sin(a),h=Math.cos(a),f=N([.2,.42,.1],e.range(.8,1.3)),l=[0,0,0],d=[i*n*.5,.26*n,h*n*.5],r=[i*n*.85,.08*n,h*n*.85],m=[i*n,-.34*n,h*n],u=h*s,w=-i*s;t.quad([l[0]-u*.3,l[1],l[2]-w*.3],[l[0]+u*.3,l[1],l[2]+w*.3],[d[0]+u,d[1],d[2]+w],[d[0]-u,d[1],d[2]-w],f),t.quad([d[0]-u,d[1],d[2]-w],[d[0]+u,d[1],d[2]+w],[r[0]+u*.8,r[1],r[2]+w*.8],[r[0]-u*.8,r[1],r[2]-w*.8],f),t.tri([r[0]-u*.8,r[1],r[2]-w*.8],[r[0]+u*.8,r[1],r[2]+w*.8],m,f)}return t}function ua(e){const t=new mt,o=new B.IcosahedronGeometry(1,1),a=o.getAttribute("position"),n=new Map,s=i=>{const h=a.getX(i),f=a.getY(i),l=a.getZ(i),d=Math.round(h*50)+","+Math.round(f*50)+","+Math.round(l*50);n.has(d)||n.set(d,e.range(.72,1.18));const r=n.get(d);return[h*r,f*r*.62+.3,l*r]};for(let i=0;i<a.count;i+=3){const h=s(i),f=s(i+1),l=s(i+2),d=.82+.3*((h[1]+f[1]+l[1])/3);t.tri(h,f,l,N(ke(p.lime,p.rock,.35),Math.min(1.1,Math.max(.6,d))))}return o.dispose(),t}function ma(e=.6){const t=new mt;return t.rim(e,10,.07,0,p.timberDark,0,.1),t.beamZ([-e,0,0],[e,0,0],.05,.05,p.timber),t.beamZ([0,-e,0],[0,e,0],.05,.05,p.timber),t}function ce(e,t,o,a,n=.12,s=1,i=0){const h=(1+Math.sqrt(5))/2,f=[[-1,h,0],[1,h,0],[-1,-h,0],[1,-h,0],[0,-1,h],[0,1,h],[0,-1,-h],[0,1,-h],[h,0,-1],[h,0,1],[-h,0,-1],[-h,0,1]],l=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],d=f.map((r,m)=>{const u=Math.hypot(r[0],r[1],r[2]),w=o*(1+n*(m*7%5/2-1))/u;return[t[0]+r[0]*w,t[1]+r[1]*w*s,t[2]+r[2]*w]});l.forEach((r,m)=>e.tri(d[r[0]],d[r[1]],d[r[2]],N(a,.82+.09*(m%5)),i))}function pa(e=5,t=5){const o=new mt,a=[.2,.125,.07],n=.38/e;for(let s=0;s<e;s++){const i=(s+.5)/e-.5;o.quad([i-n,0,.48],[i,.2,.46],[i,.2,-.46],[i-n,0,-.48],a),o.quad([i,.2,.46],[i+n,0,.48],[i+n,0,-.48],[i,.2,-.46],N(a,.8));for(let h=0;h<t;h++){const f=(h+.5)/t*.9-.45+.012*((s*7+h*3)%5-2),l=.34/e,d=.07,r=.16,m=[i,.37+.05*((s+h*2)%3),f],u=[.5+.09*((s+h)%3),.8+.07*((s*3+h)%3),.4],w=[i-l*1.15,r,f-d*1.2],M=[i+l*1.15,r,f-d*1.2],L=[i,r,f+d*1.5];o.tri(w,m,M,u),o.tri(M,m,L,N(u,.85)),o.tri(L,m,w,N(u,.7))}}return o}function wa(e,t=[.9,.42,.08]){const o=new mt,a=[.2,.15,.1],n=e.range(-.3,.3),s=e.range(-.3,.3),i=[n,1.9,s];o.beam([0,0,0],i,.13,a,0,5,.08),ce(o,[n,2.7,s],1.2,[.1,.25,.07],.2,.85),ce(o,[n+e.range(-.6,.6),3.2,s+e.range(-.6,.6)],.85,[.14,.32,.09],.2,.8);for(let h=0;h<7;h++){const f=e.range(0,wt),l=e.range(-.35,.6),d=1.2,r=[n+Math.cos(f)*Math.cos(l)*d,2.7+Math.sin(l)*d*.85,s+Math.sin(f)*Math.cos(l)*d],m=.16,u=[[r[0]+m,r[1],r[2]],[r[0]-m*.5,r[1],r[2]+m*.87],[r[0]-m*.5,r[1],r[2]-m*.87]],w=[r[0],r[1]+m*1.2,r[2]],M=[r[0],r[1]-m*1.2,r[2]];for(let L=0;L<3;L++)o.tri(u[L],w,u[(L+1)%3],t),o.tri(u[(L+1)%3],M,u[L],N(t,.7))}return o}function va(){const e=new mt,t=N(p.timberDark,.9),o=2.3;for(const[a,n]of[[-.46,-.46],[.46,-.46],[.46,.46],[-.46,.46]])e.beam([a,0,n],[a,o,n],.05,t);for(let a=0;a<3;a++)for(let n=0;n<2;n++){const s=-.5+a/3,i=s+1/3,h=-.5+n/2,f=h+.5,l=o+.05+.1*((a+n)%2),d=[.16+.06*((a*2+n)%3),.4+.07*((a+n*2)%3),.1];e.quad([s+.02,l,f-.02],[i-.02,l+.06,f-.02],[i-.02,l,h+.02],[s+.02,l+.06,h+.02],d,Q.cloth),e.tri([s+.1,l-.05,h+.2],[s+.2,l-.05,h+.25],[s+.15,l-.5,h+.22],[.3,.1,.34],Q.cloth)}return e}function ga(){const e=new mt,t=[.45,.72,.78],o=N(p.white,.95);return e.box(0,.16,0,1,.32,1,o,0,0,!1,!1),e.quad([-.5,.32,.5],[.5,.32,.5],[.42,.32,.42],[-.42,.32,.42],t),e.quad([.5,.32,.5],[.5,.32,-.5],[.42,.32,-.42],[.42,.32,.42],N(t,.85)),e.quad([.5,.32,-.5],[-.5,.32,-.5],[-.42,.32,-.42],[.42,.32,-.42],t),e.quad([-.5,.32,-.5],[-.5,.32,.5],[-.42,.32,.42],[-.42,.32,-.42],N(t,.85)),e.quad([-.42,.24,.42],[.42,.24,.42],[.42,.24,-.42],[-.42,.24,-.42],N(p.water,1.1),Q.water),e}function xa(){const e=new mt;return e.box(0,.65,0,1,1.3,.42,N(p.ochre,.8),0,0,!1),e.box(0,1.34,0,1,.1,.5,N(p.white,.8),0,0,!1),e}function ba(){const e=new mt,t=(o,a,n,s)=>{e.cyl(o,0,.55*n,a,.2*n,.42*n,6,s),e.cyl(o,.55*n,1*n,a,.42*n,.17*n,6,N(s,.9))};return t(0,0,1.1,p.clay),t(.8,.25,.85,N(p.clay,.8)),t(.3,.8,.95,N(p.clay,1.15)),e.cyl(-.7,0,.42,.45,.3,.42,6,[.5,.4,.2]),e.disc(-.7,.36,.45,.4,6,[.72,.5,.14]),e}function ya(){const e=new mt,t=N(p.white,.95);e.cyl(0,0,3.2,0,1,.85,8,N(t,.85),0,!1,t),e.cyl(0,3.2,3.35,0,1,1,8,t),e.cyl(0,3.35,4.2,0,.9,.08,8,N(t,.9));for(let o=0;o<4;o++){const n=(2*o+.5)/8*wt,s=.862,i=.824,h=Math.cos(n),f=Math.sin(n),l=-f*.17,d=h*.17;e.quad([h*s-l,1.75,f*s-d],[h*s+l,1.75,f*s+d],[h*i+l,1.75+.85,f*i+d],[h*i-l,1.75+.85,f*i-d],[.03,.03,.035])}return e}function Ma(){const e=new mt,t=N(p.timberDark,.9);for(const[o,a,n]of[[-1.3,-.9,2.5],[1.3,-.9,2.5],[1.3,.9,2],[-1.3,.9,2]])e.beam([o,0,a],[o,n,a],.05,t);return e.quad([-1.5,2.55,-1.05],[-1.5,1.95,1.2],[1.5,1.95,1.2],[1.5,2.55,-1.05],[1,1,1],Q.cloth),e.box(0,.85,.1,2.4,.08,1.1,t,0,0,!1),e.box(-.6,.45,.1,.1,.8,.9,t,0,0,!1,!1),e.box(.6,.45,.1,.1,.8,.9,t,0,0,!1,!1),ce(e,[-.7,1.05,.1],.3,[.8,.35,.1],.2,.6),ce(e,[.1,1.02,.2],.27,[.35,.5,.12],.2,.6),ce(e,[.8,1.04,0],.28,[.75,.6,.2],.2,.6),e}function ka(){const e=new mt,t=N(p.white,.9),o=N(p.timberDark,.9);return e.cyl(0,0,.6,0,.66,.58,6,N(t,.8),0,!1,t),e.disc(0,.6,0,.58,6,t,0,!0,.3),e.quad([-.4,.45,-.4],[-.4,.45,.4],[.4,.45,.4],[.4,.45,-.4],[.02,.025,.03]),e.beam([.52,0,0],[.52,2.3,0],.07,o,0,3),e.beam([.6,2.15,0],[-.1,2.4,0],.05,o,0,3),e.strip([0,2.35,0],[0,.95,0],.025,p.rope),e.cyl(0,.62,.95,0,.13,.17,4,N(p.timber,.8)),e}function za(){const e=new mt;return e.disc(0,0,0,1,5,N(p.day,1),Q.daylit,!1),e}const ae={cell:9,jitter:2.8,rMax:3.6,periodOf:e=>30+16*(e*37%255)/255,bore:[[.3,.5],[.62,1],[1.5,2.1],[2.6,3.3]],share:[.86,.62,.34,.2]};async function qe(e,t,o={}){const a=ae.cell,[n,s,i,h]=e.bounds,f=Math.floor(n/a-1)*a,l=Math.floor(s/a-1)*a,d=Math.ceil((i-f)/a)+1,r=Math.ceil((h-l)/a)+1,m=new Uint8Array(d*r*4),u=[],w=(L,y,v,z,k)=>{const E=(L.j*d+L.i)*4;m[E]=y,m[E+1]=v,m[E+2]=z,m[E+3]=k,u.push(L)},M=new Map;for(const L of o.plant||[]){const y=Math.floor((L.x-f)/a),v=Math.floor((L.z-l)/a);if(y<0||v<0||y>=d||v>=r)continue;const z=(k,E)=>Math.min(255,Math.max(0,Math.round(((k-E)/(2*ae.jitter)+.5)*255)));M.set(v*d+y,{qx:z(L.x,f+(y+.5)*a),qz:z(L.z,l+(v+.5)*a),kind:L.kind})}for(let L=0;L<r;L++){o.yield&&await o.yield();for(let y=0;y<d;y++){let v=Math.round(t()*255),z=Math.round(t()*255);const k=t(),E=Math.round(t()*254),U=t(),tt=M.get(L*d+y);tt&&(v=tt.qx,z=tt.qz);const $=f+(y+.5)*a+(v/255-.5)*2*ae.jitter,Z=l+(L+.5)*a+(z/255-.5)*2*ae.jitter,ht=-e.dist($,Z);if(ht<9)continue;let it=o.kindAt?o.kindAt($,Z):1;if(it<0)continue;tt&&(it=tt.kind);const vt=ae.bore[it],g=Math.round((vt[0]+(vt[1]-vt[0])*k)/ae.rMax*255),st=g/255*ae.rMax,It=!!tt||o.sure&&o.sure($,Z),Ct=o.boost?o.boost($,Z):1;if(!It&&U>ae.share[it]*Ct*(.45+.55*Math.min(1,(ht-9)/40))*(o.thin??1))continue;const Tt={x:$,z:Z,r:st,i:y,j:L,d:ht,kind:it,phase:E/255,period:ae.periodOf(E),topY:2.6,planted:tt?1:0};o.keep&&!o.keep(Tt)||w(Tt,v,z,g,Tt.bare?255:E)}}return{wells:u,grid:{x0:f,z0:l,cell:a,nx:d,nz:r,data:m}}}const De=(e,t)=>t?t[0]+t[1]*Math.sin(5*e+1.3)+t[2]*Math.sin(11*e+4.1):0;function ge(e,t={x:[1,0],z:[1,0]}){const[o,a,n,s]=e.bounds,i=(h,f,l,d,r)=>{const m=[];for(let u=h;u<f+l;u+=l)if(m.push(u),u+l>d[0]&&u<d[1])for(let w=1;w<r;w++)m.push(u+l*w/r);return m};return{xs:i(o-12,n+12,4,t.x,3),zs:i(a-12,s+12,3.2,t.z,2)}}function Be(e,t,o){const{xs:a,zs:n}=ge(e,o),s=new Map,i=(l,d)=>{let r=0,m=l.length-2;for(;r<m;){const u=r+m+1>>1;l[u]<=d?r=u:m=u-1}return r},h=(l,d)=>{const r=l*65536+d;let m=s.get(r);return m===void 0&&s.set(r,m=Math.fround(Math.max(t(a[l],n[d]),-2.5))),m},f=(l,d)=>{const r=i(a,l),m=i(n,d),u=(l-a[r])/(a[r+1]-a[r]),w=(d-n[m])/(n[m+1]-n[m]),M=h(r,m),L=h(r+1,m+1);return w<=u?M+u*(h(r+1,m)-M)+w*(L-h(r+1,m)):M+u*(L-h(r,m+1))+w*(h(r,m+1)-M)};return f.kinks=(l,d,r,m)=>{const u=[0,1],w=(M,L,y)=>{if(L===y)return;const v=Math.min(L,y),z=Math.max(L,y);for(let k=i(M,v);k<M.length&&M[k]<=z;k++)M[k]>=v&&u.push((M[k]-L)/(y-L))};w(a,l,r),w(n,d,m),u.sort((M,L)=>M-L);for(let M=u.length-1;M>0;M--){const L=(u[M-1]+u[M])/2,y=i(a,l+(r-l)*L),v=i(n,d+(m-d)*L),z=U=>(l+(r-l)*U-a[y])/(a[y+1]-a[y])-(d+(m-d)*U-n[v])/(n[v+1]-n[v]),k=z(u[M-1]),E=z(u[M]);k*E<0&&u.splice(M,0,u[M-1]+(u[M]-u[M-1])*k/(k-E))}return u},f.low=(l,d,r,m=0,u=1)=>{let w=[1e9,l,d];const M=(k,E,U)=>{k<w[0]&&(w=[k,E,U])},L=r*r,y=(k,E,U)=>{const tt=[k,E,U];for(const A of tt)(A[0]-l)**2+(A[1]-d)**2<=L&&M(A[2],A[0],A[1]);for(let A=0;A<3;A++){const O=tt[A],K=tt[(A+1)%3],W=K[0]-O[0],R=K[1]-O[1],T=O[0]-l,D=O[1]-d,P=W*W+R*R,J=2*(T*W+D*R),et=J*J-4*P*(T*T+D*D-L);if(et<0)continue;const at=Math.sqrt(et);for(const j of[(-J-at)/(2*P),(-J+at)/(2*P)])j>=0&&j<=1&&M(O[2]+(K[2]-O[2])*j,O[0]+W*j,O[1]+R*j)}const $=E[0]-k[0],Z=E[1]-k[1],ht=E[2]-k[2],it=U[0]-k[0],vt=U[1]-k[1],g=U[2]-k[2],st=$*vt-Z*it,It=(ht*vt-g*Z)/st,Ct=($*g-it*ht)/st,Tt=Math.hypot(It,Ct);if(Tt<1e-12)return;const q=l-r*It/Tt,G=d-r*Ct/Tt,dt=((q-k[0])*vt-(G-k[1])*it)/st,lt=($*(G-k[1])-Z*(q-k[0]))/st;dt>=0&&lt>=0&&dt+lt<=1&&M(k[2]+dt*ht+lt*g,q,G)},v=i(n,d-r),z=i(n,d+r)-v+1;for(let k=v+Math.floor(z*m);k<v+Math.floor(z*u);k++)for(let E=i(a,l-r);E<=i(a,l+r);E++){const U=Math.min(Math.max(l,a[E]),a[E+1]),tt=Math.min(Math.max(d,n[k]),n[k+1]);if((U-l)**2+(tt-d)**2>L)continue;const $=[a[E],n[k],h(E,k)],Z=[a[E+1],n[k+1],h(E+1,k+1)];y($,[a[E+1],n[k],h(E+1,k)],Z),y($,Z,[a[E],n[k+1],h(E,k+1)])}return w},f}const xe=28;async function La(e){const t=Math.PI*2,o=e.n,a=e.L,n=1,s=4,i=.05,h=.47,f=Math.sqrt(1-h*h),l=(q,G)=>e.YW+e.roof(q,G),d=e.rest||(async()=>{}),r=[];let m=[1e9,e.cx,e.cz];for(let q=0;q<8;q++){const G=e.roof.low(e.cx,e.cz,xe,q/8,(q+1)/8);G[0]<m[0]&&(m=G),await d()}const u=e.YW+m[0];for(let q=0;q<o;q++){const G=q/o*t,dt=Math.cos(G),lt=Math.sin(G),A=e.r-De(G,a);r.push([e.cx+dt*A,e.cz+lt*A,dt,lt,A])}const w=q=>.3*(1+(a[1]*Math.sin(3*q+.7)+a[2]*Math.sin(7*q+2.9))/(a[1]+a[2])),M=r.map((q,G)=>Math.min(u-w(G/o*t),e.footY[G]-n)),L=M.slice(),y=6,v=o*y,z=1.9,k=a[1]+a[2],E=[],U=[.2,.45,.7,.88],tt=2*o,$=y/2,Z=[1/3,2/3,1],ht=Z.map(()=>new Float64Array(v)),it=new Float64Array(tt),vt=(q,G)=>Math.min(l(q,G),l(q+.9,G),l(q-.9,G),l(q,G+.9),l(q,G-.9)),g=(q,G,dt,lt,A,O,K)=>.5+.5*(lt*Math.sin(G*q+dt)+K*Math.sin(A*q+O))/k;for(let q=0;q<v;q++){const G=Math.floor(q/y),dt=q%y/y,lt=r[G],A=r[(G+1)%o],O=(G+dt)/o*t,K=lt[2]+(A[2]-lt[2])*dt,W=lt[3]+(A[3]-lt[3])*dt,R=Math.hypot(K,W),T=K/R,D=W/R,P=lt[0]+(A[0]-lt[0])*dt,J=lt[1]+(A[1]-lt[1])*dt,et=.02+.06*g(O,17,4.3,a[1],41,2.2,a[2]),at=.8*Math.sin(Math.PI*dt)**2*g(O,13,1.9,a[2],61,.4,a[1]);E.push({k:G,t:dt,x0:P,z0:J,cr:T,sr:D,w:et,dn:at,x:P+T*et,z:J+D*et,yT:l(P+K*s,J+W*s)+i,low:1e9});for(let j=0;j<Z.length;j++){const rt=et+(z-et)*Z[j];ht[j][q]=vt(P+T*rt,J+D*rt)-.42}if(q%$===0){let j=1e9;for(const rt of U){const At=z+(s-z)*rt;j=Math.min(j,vt(P+K*At,J+W*At)-.17-.3*(1-rt))}it[q/$]=j}q%y===y-1&&await d()}for(let q=0;q<v;q++){const G=Math.floor(q/$);E[q].low=Math.min(ht[0][q],ht[1][q],ht[2][q],it[G],q%$?it[(G+1)%tt]:1e9)}const st=q=>{const G=E[q%v];return Math.min(L[G.k]+(L[(G.k+1)%o]-L[G.k])*G.t,G.low)-G.dn},It=q=>{const G=E[q%v];return[G.x,st(q),G.z]};return Ie(e,{C:r,F0:M,F:L,H0:u,low:m,FACE:n,STOP:.65,OUT:s,BR:z,M:y,PL:E,footAt:st,bell:()=>{const q=[],G=(dt,lt,A,O)=>{const K=A[0]-lt[0],W=A[1]-lt[1],R=A[2]-lt[2],T=O[0]-lt[0],D=O[1]-lt[1],P=O[2]-lt[2];let J=W*P-R*D,et=K*D-W*T;J*(r[dt][2]+r[(dt+1)%o][2])+et*(r[dt][3]+r[(dt+1)%o][3])>0&&(J=-J,et=-et);const at=(Math.hypot(J,et)||1)/f;for(const j of[lt,A,O])q.push([j[0],j[1],j[2],J/at,-h,et/at])};for(let dt=0;dt<o;dt++){const lt=(dt+1)%o,A=[r[dt][0],e.footY[dt],r[dt][1]],O=[r[lt][0],e.footY[lt],r[lt][1]],K=[];for(let W=0;W<=y;W++)K.push(It(dt*y+W));for(let W=0;W<y;W++)G(dt,W<y/2?A:O,K[W],K[W+1]);G(dt,A,K[y/2],O)}return q},outer:()=>{const q=[],G=[],dt=[],lt=[[]],A=U.map(()=>[]),O=[],K=new Float64Array(v),W=(T,D,P)=>(q.push(T,D,P),q.length/3-1),R=(T,D,P,J)=>{G.push(D,P,J),dt.push(T)};for(let T=0;T<v;T++){const D=E[T];lt[0].push(W(D.x,st(T),D.z))}for(let T=0;T<Z.length;T++){const D=Z[T],P=[];lt.push(P);for(let J=0;J<v;J++){const et=E[J],at=st(J),j=et.w+(z-et.w)*D,rt=et.x0+et.cr*j,At=et.z0+et.sr*j,St=(z-et.w)*Math.max(et.yT-at,0)/(s-et.w),b=Math.min(at+St*D*D,ht[T][J]);D===1&&(K[J]=b),P.push(W(rt,b,At))}}for(let T=0;T<U.length;T++)for(let D=0;D<tt;D++){const P=D>>1,J=(P+1)%o,et=(D&1)/2,at=r[P],j=r[J],rt=U[T],At=z+(s-z)*rt,St=(Ot,Gt)=>Ot+(Gt-Ot)*et;let b=St(at[0]+at[2]*At,j[0]+j[2]*At),ot=St(at[1]+at[3]*At,j[1]+j[3]*At),c=St(at[2],j[2]),x=St(at[3],j[3]);const S=Math.hypot(c,x),I=K[D*$],H=Math.max(E[D*$].yT-I,0),X=Math.sin(Math.PI*rt)*Math.min(1,H/3),bt=.42*X*e.noise.n2(b*.21+5,ot*.21+9),Ht=.3*X*e.noise.n2(b*.47+31,ot*.47+17);b+=c/S*bt,ot+=x/S*bt,A[T].push(W(b,Math.min(I+H*(1-(1-rt)*(1-rt))+Ht,vt(b,ot)-.12-.3*(1-rt)),ot))}for(let T=0;T<o;T++){const D=r[T],P=D[0]+D[2]*s,J=D[1]+D[3]*s;O.push(W(P,l(P,J)+i,J))}for(let T=0;T<o;T++){const D=(T+1)%o,P=lt[Z.length];for(let x=0;x<Z.length;x++)for(let S=T*y;S<T*y+y;S++){const I=(S+1)%v,H=lt[x],X=lt[x+1];R(T,H[S],X[S],X[I]),R(T,H[S],X[I],H[I])}for(const x of[2*T,2*T+1]){const S=[0,1,2,3].map(X=>P[(x*$+X)%v]),I=A[0][x],H=A[0][(x+1)%tt];R(T,S[0],I,S[1]),R(T,S[1],I,H),R(T,S[1],H,S[2]),R(T,S[2],H,S[3])}for(let x=0;x+1<U.length;x++)for(const S of[2*T,2*T+1]){const I=(S+1)%tt,H=A[x],X=A[x+1];R(T,H[S],X[S],X[I]),R(T,H[S],X[I],H[I])}const J=r[T],et=r[D],at=J[0]+J[2]*s,j=J[1]+J[3]*s,rt=et[0]+et[2]*s,At=et[1]+et[3]*s,St=[0],b=[O[T]];for(const x of e.roof.kinks(at,j,rt,At))if(x>St[St.length-1]+.002&&x<1-.002){const S=at+(rt-at)*x,I=j+(At-j)*x;St.push(x),b.push(W(S,l(S,I)+i,I))}St.push(1),b.push(O[D]);const ot=[A[3][2*T],A[3][2*T+1],A[3][(2*T+2)%tt]];let c=0;for(let x=0;x+1<b.length;x++){const S=(St[x]+St[x+1])/2,I=S<1/3?0:S<2/3?1:2;for(;c<I;)R(T,ot[c],b[x],ot[c+1]),c++;R(T,ot[c],b[x],b[x+1])}for(;c<2;)R(T,ot[c],b[b.length-1],ot[c+1]),c++}return{pos:q,tris:G,span:dt}},rest:d})}async function Ie(e,t){const{C:o,F0:a,F:n,OUT:s}=t,i=e.n,h=Math.PI*2,f=2,l=(A,O,K,W)=>{const R=W[3]-W[0],T=W[4]-W[1],D=W[5]-W[2],P=W[6]-W[0],J=W[7]-W[1],et=W[8]-W[2];let at=A-W[0],j=O-W[1],rt=K-W[2];const At=R*at+T*j+D*rt,St=P*at+J*j+et*rt;if(At<=0&&St<=0)return Math.sqrt(at*at+j*j+rt*rt);at=A-W[3],j=O-W[4],rt=K-W[5];const b=R*at+T*j+D*rt,ot=P*at+J*j+et*rt;if(b>=0&&ot<=b)return Math.sqrt(at*at+j*j+rt*rt);at=A-W[6],j=O-W[7],rt=K-W[8];const c=R*at+T*j+D*rt,x=P*at+J*j+et*rt;if(x>=0&&c<=x)return Math.sqrt(at*at+j*j+rt*rt);const S=At*ot-b*St,I=c*St-At*x,H=b*x-c*ot;let X,bt;if(S<=0&&At>=0&&b<=0)X=At/(At-b),bt=0;else if(I<=0&&St>=0&&x<=0)X=0,bt=St/(St-x);else if(H<=0&&ot-b>=0&&c-x>=0)bt=(ot-b)/(ot-b+c-x),X=1-bt;else{const Ht=1/(H+I+S);X=I*Ht,bt=S*Ht}return at=A-W[0]-R*X-P*bt,j=O-W[1]-T*X-J*bt,rt=K-W[2]-D*X-et*bt,Math.sqrt(at*at+j*j+rt*rt)};let d=null,r=0,m=-1,u=-1,w=null,M=null;const L=()=>(m!==r&&(d={B:t.bell(),O:M||t.outer()},M=null,m=r),d),y=()=>{if(u===r)return w;const A=Array.from({length:i},()=>[]),{B:O,O:K}=L();u=r,w=A;for(let W=0;W<O.length;W+=3)A[Math.floor(W/(3*t.M+3))].push([O[W][0],O[W][1],O[W][2],O[W+1][0],O[W+1][1],O[W+1][2],O[W+2][0],O[W+2][1],O[W+2][2]]);for(let W=0;W<K.span.length;W++){const R=K.tris[3*W]*3,T=K.tris[3*W+1]*3,D=K.tris[3*W+2]*3,P=K.pos;A[K.span[W]].push([P[R],P[R+1],P[R+2],P[T],P[T+1],P[T+2],P[D],P[D+1],P[D+2]])}for(const W of A){const R=W.box=[1e9,1e9,1e9,-1e9,-1e9,-1e9];for(const T of W)for(let D=0;D<9;D++){const P=D%3;T[D]<R[P]&&(R[P]=T[D]),T[D]>R[P+3]&&(R[P+3]=T[D])}}return A},v=2.6,z=A=>{const O=new Array(i).fill(1e9),K=new Array(i).fill(0);if(!A.length)return{a:O,at:K};const W=y();for(const R of A){const T=Math.floor((Math.atan2(R[2]-e.cz,R[0]-e.cx)/h+1)%1*i);for(let D=-2;D<=2;D++){const P=(T+D+i)%i,J=W[P],et=J.box,at=Math.max(et[0]-R[0],0,R[0]-et[3]),j=Math.max(et[1]-R[1],0,R[1]-et[4]),rt=Math.max(et[2]-R[2],0,R[2]-et[5]);if(!(at*at+j*j+rt*rt>v*v))for(let At=0;At<J.length;At++){const St=l(R[0],R[1],R[2],J[At]);St<O[P]&&(O[P]=St,K[P]=R[3])}}}return{a:O,at:K}};M=t.outer(),await t.rest();let k=1e9;{const A=L().O.pos;for(let O=1;O<A.length;O+=3)A[O]<k&&(k=A[O])}const E=3.2,U=[],tt=k-E,$=Math.max(...e.footY)+6+E,Z=Math.min(...o.map(A=>A[4]))*Math.cos(Math.PI/i)-E,ht=e.r+s+E,it=new Array(i).fill(0),vt=(A,O,K)=>{for(let W=A;W<=O+1e-9;W+=K){const R=e.lineAt(W),T=Math.hypot(R[0]-e.cx,R[2]-e.cz);T>Z&&T<ht&&R[1]>tt&&R[1]<$&&U.push([R[0],R[1],R[2],W])}},g=()=>{let A=z(U);for(let O=0;O<80;O++){const K=new Array(i).fill(0);let W=!1;for(let T=0;T<i;T++)if(A.a[T]<f){const D=f-A.a[T]+.002,P=(T+1)%i;K[T]=Math.max(K[T],D),K[P]=Math.max(K[P],D),W=!0}if(!W)break;let R=!1;for(let T=0;T<i;T++){const D=Math.max(n[T],Math.min(n[T]+K[T],e.footY[T]-t.STOP));D>n[T]&&(R=!0),it[T]+=D-n[T],n[T]=D}if(!R)break;r++,A=z(U)}return A},st=A=>{let O=[1e9,0,-1];for(let K=0;K<i;K++)A.a[K]<O[0]&&(O=[A.a[K],A.at[K],K]);return O};for(const[A,O]of e.ms||[])vt(A,O,.2);await t.rest();let It=g();const Ct=st(It);if(await t.rest(),Ct[0]<f+.15)for(const A of[.02,.005]){const O=st(It);vt(O[1]-.5,O[1]+.5,A),It=g(),await t.rest()}const Tt=L().O,q=new Array(Tt.pos.length).fill(0),G=Tt.pos;for(let A=0;A<Tt.span.length;A++){const O=Tt.span[A],K=(O+1)%i,W=Tt.tris[3*A]*3,R=Tt.tris[3*A+1]*3,T=Tt.tris[3*A+2]*3,D=G[R]-G[W],P=G[R+1]-G[W+1],J=G[R+2]-G[W+2],et=G[T]-G[W],at=G[T+1]-G[W+1],j=G[T+2]-G[W+2];let rt=P*j-J*at,At=J*et-D*j,St=D*at-P*et;rt*(o[O][2]+o[K][2])-At+St*(o[O][3]+o[K][3])<0&&(rt=-rt,At=-At,St=-St);for(const b of[W,R,T])q[b]+=rt,q[b+1]+=At,q[b+2]+=St}for(let A=0;A<q.length;A+=3){const O=Math.hypot(q[A],q[A+1],q[A+2])||1;let K=q[A]/O,W=q[A+1]/O,R=q[A+2]/O;if(-W<.5){const T=Math.hypot(K,R)||1,D=Math.sqrt(.75)/T;K*=D,R*=D,W=-.5}q[A]=K,q[A+1]=W,q[A+2]=R}const dt=(A,O,K=0)=>{const W=A-e.cx,R=O-e.cz,T=Math.atan2(R,W),D=h/i,P=Math.floor((T/h+1)%1*i)%i,J=P*D,et=J+D,at=o[P][4]+s,j=o[(P+1)%i][4]+s,rt=(T+h)%h;return Math.hypot(W,R)<at*j*Math.sin(D)/(at*Math.sin(rt-J)+j*Math.sin(et-rt))+K};await t.rest();const lt=st(It);return{n:i,reach:xe,H0:t.H0,low:t.low,F0:a,F:n.slice(),up:it,air:lt[0],airAt:lt[1],airSpan:lt[2],air0:Ct[0],places:U.length,face:t.FACE,stop:t.STOP,OUT:s,BR:t.BR,M:t.M,corners:o,foot:t.PL.map((A,O)=>[A.x,t.footAt(O),A.z]),footLaw:t.PL.map(A=>[A.dn,A.w,A.low]),bell:L().B,outer:{pos:Tt.pos,nor:q,tris:Tt.tris},ground:dt,body:y}}function Ne(e,t,o){const a=(f,l,d)=>{const r=Math.min(1,Math.max(0,(d-f)/(l-f)));return r*r*(3-2*r)},n=o.o||o.W,s=o.nave,i=(f,l)=>{const d=f-n.x,r=l-n.z;return[d*o.n[0]+r*o.n[1],d*o.p[0]+r*o.p[1]]},h=(f,l,d)=>{const[r,m]=i(f,l),u=f-o.W.x,w=l-o.W.z;let M=12.5+2.8*t.n2(f*.021+3.1,l*.021)+1.2*t.n2(f*.07,l*.07+5.5);{const v=o.chamber||{r:64,h:7},z=(u*u+w*w)/(v.r*v.r);z<1&&(M+=v.h*(1-z)*(1-z))}const L=r-o.dome.a;if(M+=o.dome.h*Math.exp(-1.5*(L*L+m*m)/(o.dome.r*o.dome.r)),o.cave){const v=f-o.cave.x,z=l-o.cave.z,k=(v*v+z*z)/(o.cave.r*o.cave.r);k<1&&(M+=o.cave.h*(1-k)*(1-k))}if(s){const v=Math.abs(m)/(s.half+3);if(v<1&&r>s.a0-14&&r<s.a1+14){const z=a(s.a0-14,s.a0+4,r)*(1-a(s.a1-4,s.a1+14,r)),k=(1-v*v)*(1-v*v);M+=z*k*(2+1.1*t.n2(r/16+7.3,4.4))}}for(const v of o.piers){const z=f-v.x,k=l-v.z,E=z*z+k*k,U=v.r*v.r*5;E<U*9&&(M-=2.6*Math.exp(-E/U))}if(d===void 0){const v=e.rho(f,l);if(v<1&&2.2+1.25*(1-v)/e.lip>=M)return M}const y=d===void 0?-e.dist(f,l):d;return y<=0?Math.min(M,2.2+y*.5):Math.min(M,2.2+y*1.25)};return h.zone=i,h.G=o,h.at=(f,l)=>[n.x+f*o.n[0]+l*o.p[0],n.z+f*o.n[1]+l*o.p[1]],h}function be(e,t=14){const o=new mt,a=[e.range(0,wt),e.range(0,wt),e.range(0,wt)],n=[-.12,.08,.28,.5,.7,.86,1,1.1,1.2,1.3,1.8],s=n.length-1,i=f=>Math.min(3.2,1+.5*Math.pow(1-Math.min(1,Math.max(0,f)),3)+1.1*Math.pow(Math.max(0,f),3.4)-.14*Math.sin(f*7+a[0])),h=(f,l)=>{const d=f/t*wt,r=n[l],m=i(r)*(1+.16*Math.sin(3*d+a[1]+r*2)+.09*Math.sin(5*d+a[2]-r*5));return[Math.cos(d)*m,r,Math.sin(d)*m]};for(let f=0;f<s;f++)for(let l=0;l<t;l++){const d=h(l,f),r=h(l+1,f),m=h(l+1,f+1),u=h(l,f+1);for(const w of[d,m,r,d,u,m]){const M=Math.hypot(w[0],w[2])||1;o.vert(w[0],w[1],w[2],w[0]/M,0,w[2]/M,We,Q.rock)}}return o}const Ta=e=>1.25*Math.min(3.2,1.14+.5*Math.pow(1-Math.min(1,Math.max(0,e)),3)+1.1*Math.pow(Math.max(0,e),3.4)),Re=e=>e*.22,ye=`
attribute vec3 aLight;
varying vec3 vW; varying vec3 vN; varying vec3 vLight;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vLight = aLight; gl_Position = projectionMatrix * viewMatrix * w; }`,Me=`
uniform sampler2D tWell, tLake; uniform vec4 uGrid, uLakeBox, uRing; uniform vec2 uGridN; uniform vec4 uBig[2]; uniform vec2 uBigCut; uniform vec3 uLime, uDay, uBounce, uPool, uLampCol; uniform vec4 uLip; uniform float uT, uYW, uLampK;
uniform vec3 uPoolCol; uniform float uCham;
varying vec3 vW; varying vec3 vN; varying vec3 vLight;
${he}
${fe}
${de}
float ridge(vec2 p){ return 1. - abs(2. * vn(p) - 1.); }
void main(){
  vec2 xz = vW.xz; float kind = vLight.y, wy = vW.y; vec3 n = normalize(vN);
  // (pxg: the picture's own grain at the lit point: the metres of the rock one picture element spans there, the
  //  larger of its two spans, across the picture and down it, each by itself: it does not turn with the frame; taken
  //  before anything is cut away. IT READS THE EYE, and in this shader one thing asks it: a roof seam too narrow
  //  for the picture to hold, below)
  float pxg = max(max(length(dFdx(vW)), length(dFdy(vW))), 1e-4);
  #ifdef MIRROR
  if (wy > uYW) discard;
  wy = 2. * uYW - wy; n.y = -n.y;
  #else
  if (abs(kind - 1.) > .5 && wy < uYW - .02) discard;
  #endif
  float mouth = 0., rim = 0., sky = 0., ringM = 0., rr = 1., gw = 0.; vec2 rq = vec2(1., 0.);
  if (kind < .5) {
    // (THE GREAT WELL'S LIP IS ROUGH ROCK: the roof's edge round the bell's foot is no circle and carries no dressed
    //  stone. The bell's foot itself is uneven (uLip: the world's three measures and, fourth, the bell's own round;
    //  lipIn above is the same law in the build: each of the foot's 48 corners stands 0 to 1.7 m inside that round,
    //  on two slow waves of the bearing), and THE ROOF'S CUT FOLLOWS THE FOOT'S OWN 48 STRAIGHT SPANS: the same
    //  corners, written here; at every bearing the roof ends 0.05 m short of the span the bearing's ray meets, with no
    //  raggedness of its own. The world hangs the foot 0.2 m and more under the roof as drawn all along every span
    //  and joins it to the roof by a face of the bell's own rock standing up through the roof's sheet, so the roof's
    //  edge lies over the bell's sheet: no strip of the roof shows under the bell and no way through opens between
    //  them; the unevenness is the foot's. The roof's face there is its own rock with the day on its lip.
    //  With no lip given (uLip.w 0) the cut is the plain round uBigCut.x)
    vec2 q0 = xz - uBig[0].xy; float l0 = length(q0), d0 = l0 - uBigCut.x;
    if (uLip.w > 0.) { float th0 = atan(q0.y, q0.x + 1e-6), da = 6.2831853 / 48., ta = floor(th0 / da) * da, tb = ta + da;
      float ra = uLip.w - uLip.x - uLip.y * sin(5. * ta + 1.3) - uLip.z * sin(11. * ta + 4.1), rb = uLip.w - uLip.x - uLip.y * sin(5. * tb + 1.3) - uLip.z * sin(11. * tb + 4.1);
      d0 = l0 - ra * rb * sin(da) / (ra * sin(th0 - ta) + rb * sin(tb - th0)) + .05; }
    float d1 = distance(xz, uBig[1].xy) - uBigCut.y, cut = min(d0, d1);
    #ifdef MIRROR
    sky = max(sky, .5 * (1. - smoothstep(-5., 0., cut)));
    #else
    if (cut < 0.) discard;
    #endif
    // (gw: THE GREAT WELL'S REACH ON THE ROOF, cure 1 part B, below: by the face's own direction and its metres from
    //  the great well's axis; nought from 56 m out. Within it the great well's own lip takes no day of its mouth's.)
    gw = (1. - smoothstep(40., 56., l0)) * smoothstep(.2, .45, -n.y);
    rim = max(rim, .8 * (1. - smoothstep(0., 3.5, cut)) * (d0 < d1 ? 1. - gw : 1.));
    if (d1 >= 0. && d1 < 1.5 && d1 < d0) { ringM = 1.; rq = xz - uBig[1].xy; rr = uBigCut.y * .5; }
    vec2 g = (xz - uGrid.xy) / uGrid.z - .5, c0 = floor(g);
    for (int k = 0; k < 4; k++) {
      vec2 cell = c0 + vec2(float(k - (k / 2) * 2), float(k / 2));
      vec4 t = textureLod(tWell, (cell + .5) / uGridN, 0.); float r = t.b * 3.6;
      if (r > .01) { vec2 c = uGrid.xy + (cell + .5) * uGrid.z + (t.rg - .5) * 2. * uGrid.w; float d = distance(xz, c);
        mouth = max(mouth, step(d, r)); rim = max(rim, smoothstep(r * 2.2 + 2.4, r, d)); sky = max(sky, .5 * exp(-d * d / max(r * r * .6, .05)));
        if (d >= r && d < r + .4 + .22 * r) { ringM = 1.; rq = xz - c; rr = r; } }
    }
    #ifndef MIRROR
    if (mouth > .5) discard;
    #endif
  }
  // THE ROCK GIVES WAY TO THE WELL (a law of the place, by the lit point's own place): a well is a bore through the
  // rock, so nothing of the hall's standing, hanging or fallen rock (a pier, a bridge, a needle, a block) is drawn
  // inside any bore's round, from the water up, as it stands or mirrored: the cut the roof takes above, by the same
  // table of wells and the same four cells (a well of another cell lies 6.2 m and more off on one axis; no round here
  // is over 4.8 m). And none of it is drawn under a mouth's ring of dressed stones: what hangs from the roof gives way
  // to the ring's outer round too (a bridge; a needle is hung clear of every ring at the build, so none is cut), and so
  // does a pier from 0.86 of its height up (aLight.z, a pier's share of the roof's height at its axis: the shoulder
  // that spreads into the roof; easing in from 0.7; a fallen block has 0), so a pier's foot in the water is whole and
  // its shoulder is notched round the ring.
  // (kf: how far the kind stands from a whole number: 0 on the rock's skin, a quarter on a cut's face. Not fract(): a
  //  kind carried across a triangle may come out a hair under its whole number)
  float kf = abs(kind - floor(kind + .5));
  if (kind > 1.5 && kf < .1) {
    float wide = kind > 2.5 ? 1. : smoothstep(.7, .86, vLight.z);
    vec2 g = (xz - uGrid.xy) / uGrid.z - .5, c0 = floor(g);
    for (int k = 0; k < 4; k++) {
      vec2 cell = c0 + vec2(float(k - (k / 2) * 2), float(k / 2));
      vec4 t = textureLod(tWell, (cell + .5) / uGridN, 0.); float r = t.b * 3.6;
      if (r > .01 && distance(xz, uGrid.xy + (cell + .5) * uGrid.z + (t.rg - .5) * 2. * uGrid.w) < r + wide * (.4 + .22 * r)) discard;
    }
  }
  vec4 lk = texture2D(tLake, (xz - uLakeBox.xy) * uLakeBox.zw);
  // (a pier takes the daylight its own skin was given at build, bearing by bearing (aLight.x: the table's light 1.3
  //  radii out at sixteen bearings, and in the great well's chamber the shaft's own light on the side that faces
  //  it): a pier has a lit side and a shaded side; the roof, the beach and what hangs take the table's light)
  float light = (kind > 1.5 && kind < 2.5) ? max(vLight.x, 0.) : lk.g * 1.5, glow = lk.r;
  // (the rock about the ring's own place, at the far end beyond the last wells, takes less of the wells' daylight: the
  //  ring stands against a dark wall; by the lit point's metres from the ring, never the eye's)
  light *= 1. - .6 * (1. - smoothstep(8., 30., distance(xz, uRing.xy)));
  float hgt = wy - uYW, steep = 1. - abs(n.y), upr = smoothstep(.2, .55, steep);
  float isBeach = (kind > .5 && kind < 1.5) ? 1. : 0.;
  // the stone: on what stands steep, beds of uneven thickness and tone; on the ceiling, mottling and broad soft seams
  vec2 pw = kind > 1.5 ? vec2(xz.x + xz.y * .7, wy * 1.3) : xz + wy * vec2(.7, .5);
  float g1 = vn(pw * .31 + 2.), g2 = vn(pw * 1.7 + 7.), g3 = vn(pw * 6.1);
  float sy = wy * .5 + g1 * .9, bed = floor(sy), bf = fract(sy);
  float bedTone = .86 + .26 * h21(vec2(bed, 3.7)), bedLine = smoothstep(.07, 0., min(bf, 1. - bf)) * upr;
  // (THE HALL'S ROOF HAS NO THIN DARK LINE ON IT. What stands or hangs (a pier, a bridge, a needle) and the beach keep
  //  their cracks; on the roof the same two fields are BROAD SOFT SEAMS of the rock: three times as broad (1.26 m and
  //  0.39 m across at the middle of their run, where the lines were 0.42 m and 0.13 m), a third as dark (under five
  //  and three in a hundred at their middle), soft from their middle to their edge, DRAWN WHEREVER THE FIELD LAYS
  //  THEM, by the lit point's place alone: the same from anywhere and at any size of picture. ONE FILTER READS THE
  //  EYE, and only this: where a seam's WHOLE breadth (1.26 m; 0.39 m) would span under one and a half picture
  //  elements it fades to its field's own mean (0.246; 0.197), and is at the mean from half an element (pxg): it
  //  takes away only what the picture cannot hold)
  float c1 = abs(vn(pw * .5 + 11.) - .5), c2 = abs(vn(pw * 1.3 + 3.) - .5);
  float crack = kind < .5 ? (mix(.246, smoothstep(.15, 0., c1), smoothstep(.5, 1.5, 1.26 / pxg)) * .5 + mix(.197, smoothstep(.12, 0., c2), smoothstep(.5, 1.5, .39 / pxg)) * .3) / 3.
    : smoothstep(.05, 0., c1) * .5 + smoothstep(.04, 0., c2) * .3;
  vec3 alb = uLime * (.68 + .12 * g1 + .12 * g2 + .08 * g3) * mix(1., bedTone, upr) * (1. - .22 * bedLine) * (1. - .28 * crack);
  // a ledge under each bed's line: the rock just under a bedding line is darker (its own shade)
  alb *= 1. - .15 * upr * smoothstep(.75, 1., bf);
  // flowstone (pale, down the steep rock) and drip stains (dark)
  float ua = dot(xz, vec2(.83, .55));
  float flow = smoothstep(.56, .8, vn(vec2(ua * .9, wy * .07 + 3.))) * upr;
  alb = mix(alb, uLime * vec3(.82, .76, .62), flow * .5);
  alb *= 1. - .24 * smoothstep(.6, .85, vn(vec2(ua * .62 + 20., wy * .05))) * (.35 + .65 * vn(vec2(ua * .13 + 5., wy * .11))) * upr;
  // damp green low down; the water line: a dark wet band, a pale crust just over it
  alb = mix(alb, alb * vec3(.5, .68, .52), smoothstep(.5, .8, g1) * .45 * exp(-max(hgt, 0.) / 5.));
  // (dark and wet for its first metre and a half over the water; over that a ring of pale lime, the old waterline)
  // (only where the rock stands in the water: a pier, the shore's wall. A needle or an arch hangs over the water and has neither)
  if (isBeach < .5 && kind < 2.5) { alb *= 1. - .5 * smoothstep(1.5, .5, hgt + .25 * g2); alb = mix(alb, uLime * 1.05, .7 * smoothstep(.22, 0., abs(hgt - 1.7 - .25 * g2)) * upr); }
  // (how much of the light about a place a face takes: what faces down takes the water's giving back, what faces up
  //  (a pier's spreading foot, a fallen block's top) the day from above, what stands plumb the least)
  float lam = isBeach > .5 ? .7 + .3 * clamp(n.y, 0., 1.) : clamp(.55 + .5 * abs(n.y), 0., 1.) * (kind < .5 ? .5 : 1.);
  // (A CUT'S FACE IS THE ROCK IT CUTS: the same stone, beds and shade by the same fields of its place, and the light
  //  of its place by the rock's own law (a plumb face's share of it, less with height as on any standing rock): what
  //  it does not take is the gain of a face that leans to the light (below): it is no brighter than the rock beside it)
  float face = (kind > 1.5 && kf > .1) ? 1. : 0.;
  // the net of ripples the lit water throws up: two slow ridged fields crossing; only near a lit pool, strongest low down
  float net = pow(clamp(ridge(pw * .42 + vec2(uT * .05, 0.)) * ridge(mat2(.8, -.6, .6, .8) * pw * .71 - vec2(0., uT * .04)), 0., 1.), 3.);
  float low = exp(-max(hgt, 0.) / 7.), fall = mix(1., .5, smoothstep(2., 12., hgt));
  // (the three tones: the floor, cool; the day, pale gold, by the table's daylight through the curve dl; the water's
  //  net, green-blue: on what stands in the water by its height, on the roof over a pool fainter)
  // (THE HALL IS DARK ROCK: the day is on the rock only WHERE A SHAFT FALLS (ls: the table's daylight less the low
  //  light that lies everywhere between the wells: a patch about a shaft's foot and on what stands in it), and what
  //  gives the rock its form between the shafts is the hall's cool floor and THE LIGHT THE POOLS THROW UP: a steady
  //  green-blue from below on what stands near a lit pool and the moving net in it; at night THE LAMPS' WARM LIGHT
  //  about every bucket's lamp, by the same nearness (uLampK: nought by day). A MOORING'S LANTERN LIGHTS A POOL, NOT
  //  THE HALL (the table's fourth channel, lk.a): on the rock its warm light lies at the foot only, strongest at the
  //  water, a half of it 1 m up and none from 2 m up: over that, and on the roof, the rock is the hall's dark again)
  float ls = max(light - .16, 0.) * 1.2, dl = ls * ls / (ls + .15) / (1. + .75 * ls);
  // (THE ROCK'S FORM BY THE LIGHT ABOUT IT: the table's two lights (the wells' day, the pools' glow) are read again
  //  3 m off along each axis: the way they grow is the way the light comes from, and a face that leans toward it (the
  //  roof's sags, a pier's flank, a bridge's haunch) takes more of it, one that leans away less: by the lit point's
  //  place and its own face, never the eye's. And the roof's rock is of broad darker and paler reaches (20 m))
  vec2 uvL = (xz - uLakeBox.xy) * uLakeBox.zw; vec4 lx = texture2D(tLake, uvL + vec2(3. * uLakeBox.z, 0.)), lz = texture2D(tLake, uvL + vec2(0., 3. * uLakeBox.w));
  vec2 grad = vec2(lx.g * 1.5 + lx.r - lk.g * 1.5 - lk.r, lz.g * 1.5 + lz.r - lk.g * 1.5 - lk.r);
  float form = clamp(1. + 1.5 * dot(n.xz, grad / (length(grad) + .04)) * (isBeach > .5 ? 0. : 1.), .45, 1.9 - .9 * face);
  if (kind < .5) alb *= .78 + .44 * vn(xz * .05 + 3.);
  vec3 lit = uCaveAmb * (.62 + .45 * lam) * (1. + .3 * low) * mix(1., form, .35) + uBounce * dl * lam * fall * 2.8 * form
    + uPool * glow * form * (kind < .5 ? .1 + 1.0 * net : .05 + .5 * net + low * (.34 + 2.1 * net))
    + uLampCol * (uLampK * glow * (kind < .5 ? .34 : .26 + 1.1 * low) + lk.a * (kind < .5 ? 0. : 2.4 * (1. - smoothstep(0., 2., hgt))));
  lit += qLamp(vec3(vW.x, wy, vW.z), n);
  // CURE 1, PART B: ONE LAW OF LIGHT AT THE GREAT WELL'S FOOT. The bell is dark wet rock that takes what its pool
  // gives back by its height over the pool (LIFT_FRAG, fl); the roof one step beyond its foot took the lake table's
  // full daylight and the day on its lip besides: two faces that look down over the same pool were lit by two laws
  // that met on a line. So A FACE OF THE ROOF THAT LOOKS DOWN WITHIN THE GREAT WELL'S REACH TAKES THE DAY AS THE
  // BELL DOES. gw (above) is the reach: by the face's own direction (the bell's own measure of a face that looks
  // down) and its metres from the great well's axis: whole to 40 m, ending softly over the 16 m to 56 m, NOUGHT
  // from 56 m out (these are the table's own: the great shaft's direct daylight is laid within 56 m and ends over
  // the same 16 m, and its chamber's share at 56 m, 0.155, lies under the table's floor of light, so beyond the
  // reach the roof had no day of the great shaft's to lose WHERE NO SMALL WELL'S LIGHT LIES; under a small well's
  // patch out to about 81 m the chamber's share still adds to the table's day, and is rightly left). The reach
  // reads no eye, seed or clock.
  // SAID IN THE OPEN, TWO THINGS:
  // THE FLOOR CARRIES THE WATER'S MOVING NET: the floor the roof may not go under is the bell's law with the bell's
  // own net on the world's running clock (the same uniform, fields, scales and speeds as the bell's), so within the
  // reach the roof carries the net as the bell does and the net's lines run on from the bell to the roof.
  // HANGING ROCK WITHIN THE REACH (needles, arches) is not the roof's sheet, keeps the table's day and stands 1.07
  // to 1.64 times the roof at its root (live 0.75 to 1.11).
  // Within the reach:
  // - THE GREAT SHAFT'S OWN SHARE OF THE TABLE'S DAY IS EASED AWAY (g0: the two laws the table was laid by, the
  //   shaft's direct light and its chamber's, written again; its day by the same curve dl): a small well's OWN
  //   share (the table's day over the great shaft's) stays; its patch's light falls with the great shaft's share
  //   under it (seed 7's brightest patch in the reach: 0.3045 to 0.2637) and it stands out more (1.24 times the
  //   roof about it in live, 1.41 now); the great well's lip takes no day of its mouth's;
  // - in its place THE DAY ITS POOL GIVES BACK, BY THE FACE'S HEIGHT OVER THE POOL, on the bell's own law (a third
  //   of the shaft's light at the water, a half of that 3 m up);
  // - NOTHING IS MADE DARKER THAN THE BELL'S OWN LAW GIVES AT THAT HEIGHT (bell: its shade, its pool's green-blue,
  //   its lip's day and the water's net, for this face): the roof's light is never under the lesser of what it
  //   was and the bell's law.
  // Beyond the reach gw is nought and nothing here is done. The widest shaft, the piers, the beach and the water
  // are not touched (the roof's sheet alone: kind 0); a small well's own share is not taken away, but its patch
  // within the reach is dimmer and stands out more, as said above.
  if (gw > 0.) {
    float qg = distance(xz, uBig[0].xy), dg = max(qg - uBig[0].z, 0.), hw = max(hgt, 0.), dn = max(-n.y, 0.);
    float g0 = uBig[0].w * (1.3 / (1. + dg * dg / 81.) * (1. - smoothstep(40., 56., qg)) + (uCham > 0. ? .54 / (1. + dg * dg / 676.) * (1. - smoothstep(uCham, uCham + 16., qg)) : 0.));
    float lg = max(g0 * (1. - .6 * (1. - smoothstep(8., 30., distance(xz, uRing.xy)))) - .16, 0.) * 1.2, dg0 = lg * lg / (lg + .15) / (1. + .75 * lg);
    vec3 lipDay = uCaveKey * dn * .34 * exp(-hw / 4.5);
    vec3 bell = uCaveAmb * (.6 + .5 * max(dot(n.xz, (uBig[0].xy - xz) / max(qg, 1e-3)), 0.)) + uPoolCol * (.75 * exp(-hw / 18.) * (.6 - .4 * n.y) * .2 + dn * exp(-hw / 40.) * (.1 + net)) + lipDay;
    // (the floor: colour by colour the lesser of what the roof had and the bell's law; and, read as one light (LW:
    //  the eye's weights of the three colours), never under the lesser of the two, where the two colours cross)
    const vec3 LW = vec3(.2126, .7152, .0722);
    vec3 eased = max(lit - uBounce * (min(gw * dg0, dl) * lam * fall * 2.8 * form) + gw * lipDay, min(lit, bell));
    lit = eased * max(1., min(dot(lit, LW), dot(bell, LW)) / max(dot(eased, LW), 1e-5));
  }
  vec3 col = alb * lit;
  // a mouth's lip catches the daylight that falls through it
  if (kind < .5) col += (uLime * .35 + alb * .9) * uDay * rim * rim * .13;
  // THE RIM OF A WELL'S MOUTH: a ring of dressed stones round the opening (the well's own lining, where it comes
  // through the roof), lit by the daylight the lake's table gives at its place (the same table that lights the rock
  // about it: a broad well's ring is bright, a narrow one's dim, and the ring by the quay's ring stands in that
  // wall's dark); the widest shaft over the landing has one too (1.5 m broad, of greater stones, under its built
  // collar); THE GREAT WELL'S LIP HAS NONE: it is the roof's own rough rock (above)
  if (ringM > .5) { float ang = atan(rq.y, rq.x) / 6.2832, nSt = floor(6.2832 * (rr + .3) / .6 + .5), fa = fract(ang * nSt), jt = smoothstep(.09, 0., min(fa, 1. - fa));
    col = uLime * (.72 + .22 * h21(vec2(floor(ang * nSt), rr * 7.))) * (1. - .5 * jt) * (uCaveAmb * .5 + uDay * (.12 + .3 * light)); }
  if (isBeach > .5) {
    // the beach: pebbles, darker and wet toward the water, a slow lap at the waterline
    float peb = vn(xz * 3.1) * vn(xz * 7.7 + 3.), lap = .5 + .5 * sin(uT * .7 + xz.x * .05 + xz.y * .04);
    float wet = 1. - smoothstep(-.2 + .5 * lap, 1.2 + .5 * lap, vLight.z);
    col *= (.75 + .6 * peb) * mix(1., .5, wet);
  }
  #ifdef MIRROR
  col = mix(col, uDay * .8, sky); col *= vec3(.4, .5, .52);
  #endif
  gl_FragColor = vec4(placeFog(col, vW), 1.);
}`,He=`
uniform sampler2D tWell, tLake; uniform vec4 uGrid, uLakeBox, uRing; uniform vec2 uGridN; uniform vec4 uBig[2]; uniform vec3 uLakeCol, uShallow, uSand, uDay, uLampCol, uBounce, uPool; uniform float uT, uLampK; uniform vec2 uSlant;
varying vec3 vW;
${Le}
${he}
${fe}
${de}
float periodOf(float b){ return 30. + 16. * mod(b * 37., 255.) / 255.; }
float ridge(vec2 p){ return 1. - abs(2. * vn(p) - 1.); }
void main(){
  vec2 xz = vW.xz;
  float inD = (1. - lakeRho(xz)) * 190.;
  if (inD < -16.) discard;
  vec3 V = normalize(cameraPosition - vW);
  float fres = .2 + .8 * pow(1. - clamp(V.y, 0., 1.), 2.5);
  vec4 lk = texture2D(tLake, (xz - uLakeBox.xy) * uLakeBox.zw);
  // (ls: the day lies on the water only about a shaft's foot: the table's daylight less the low light between the wells)
  float glow = lk.r, light = lk.g * 1.5, pier = lk.b, ls = max(light - .16, 0.) * 1.2;
  float rip = vn(xz * .9 + uT * .12) - .5 + .5 * (vn(xz * 2.7 - uT * .2) - .5);
  float shal = max(smoothstep(26., 0., inD), pier);
  vec3 col = mix(uLakeCol, uShallow, shal * .8) * (.75 + .5 * vn(xz * .035 + 3.));
  // the bottom's stones in the shallows
  // (each stone at its own place in its cell, of its own size: no lattice shows)
  vec2 sp = xz * .8 + 1.7 * vec2(vn(xz * .33), vn(xz * .33 + 5.)), si = floor(sp);
  float st = smoothstep(.34, .1, length(fract(sp) - .5 - .3 * (vec2(h21(si + 1.3), h21(si + 4.7)) - .5)) / (.5 + .5 * h21(si + 7.1))) * h21(si);
  col += uShallow * st * .8 * max(smoothstep(9., 1., inD), pier * .9);
  vec2 g = (xz - uGrid.xy) / uGrid.z - .5, c0 = floor(g);
  float ring = 0., pool = 0., lamp = 0., contact = 0.;
  for (int k = 0; k < 4; k++) {
    vec2 cell = c0 + vec2(float(k - (k / 2) * 2), float(k / 2));
    vec4 t = textureLod(tWell, (cell + .5) / uGridN, 0.);
    float r = t.b * 3.6;
    if (r > .01) {
      vec2 c = uGrid.xy + (cell + .5) * uGrid.z + (t.rg - .5) * 2. * uGrid.w;
      vec2 q = xz - c - uSlant, q2 = xz - c; float d = length(q), d2 = length(q2);
      // the rings spread from where that well's bucket last touched the water (the bucket's law: it touches at .42 of its period)
      float pb = floor(t.a * 255. + .5), has = step(pb, 254.5), P = periodOf(pb), age = fract(uT / P + pb / 255. - .42) * P;
      float wave = sin((d2 - age * .8) * 6.) * exp(-age * .2) * smoothstep(age * .8 + .4, age * .8 - .6, d2) * smoothstep(5.6, 2.6, d2) * has;
      ring += wave;
      // where the bucket stands in the water (.42 to .6 of its period, by its own law) a dark line of contact lies round it
      float ub = fract(uT / P + pb / 255.), rb = .26 * clamp(r * 2.83, .85, 1.9);
      contact = max(contact, has * smoothstep(.36, .42, ub) * (1. - smoothstep(.6, .66, ub)) * smoothstep(rb + .3, rb, d2));
      float rp = r * 1.25 + .4;
      pool += exp(-d * d / (rp * rp)) * (1. + .12 * wave);
      lamp += has * exp(-d2 * d2 / 4.5);
    }
  }
  float big = 0.;
  for (int i = 0; i < 2; i++) { float db = distance(xz, uBig[i].xy), R = uBig[i].z; big += (smoothstep(R + 2.5, R - 3.5, db * (1. + .01 * rip)) + .22 * exp(-max(db - R, 0.) / 5.)) * uBig[i].w; }
  pool += big;
  // (the great well's pool: rings spreading both ways from the round where its chains of pots dip)
  { float db = distance(xz, uBig[0].xy), ph = abs(db - 12.5); ring += .55 * sin(ph * 2.6 - uT * 1.5 + 1.3 * vn(xz * .12)) * exp(-ph * .13) * smoothstep(34., 20., db) * uBig[0].w; }
  // drips from the roof ring the dark water: one cell in six, each on its own clock
  vec2 dc = floor(xz / 7.); float dh = h21(dc + 3.7);
  if (dh > .84) { vec2 dp = (dc + .2 + .6 * vec2(h21(dc + 1.1), h21(dc + 2.3))) * 7.; float P2 = 5. + 6. * h21(dc + 9.), age2 = fract(uT / P2 + dh * 13.) * P2, dd = distance(xz, dp);
    ring += .8 * sin((dd - age2 * .7) * 9.) * exp(-age2 * .5) * smoothstep(age2 * .7 + .3, age2 * .7 - .5, dd) * smoothstep(3.3, 1.2, dd); }
  vec2 nq = xz + 1.6 * (vec2(vn(xz * .19 + 4.), vn(xz * .19 + 9.)) - .5);
  float net = pow(clamp(ridge(nq * .55 + vec2(uT * .08, 0.)) * ridge(mat2(.8, -.6, .6, .8) * nq * .9 - vec2(0., uT * .07)), 0., 1.), 2.);
  float pl = clamp(pool, 0., 1.4);
  // (the pool: the lit water's own green-blue; the bed's pale sand in soft patches and its stones seen through it; the
  //  daylight's glint at its middle; the rings)
  float sand = .35 + .65 * smoothstep(.3, .7, vn(xz * .45 + 9.));
  // (BY NIGHT THE GREAT SHAFTS' FEET ARE HELD AT THE OLD LEVEL (mending 2): nb is the night (the hour's standing
  //  state, the lamps lit) at the foot of a great shaft, by the place (big: the great pools' own share of the pool
  //  here): there the pool's water and its glint keep the measures they had before the round, so the moonlit disc
  //  under the great well and under its chains of pots is rippled water and never a flat white)
  float nb = min(uLampK, 1.) * clamp(big, 0., 1.);
  col += uPool * pl * (mix(.7, .55, nb) + mix(1.4, 1.15, nb) * net + .3 * rip) + uSand * pl * (.5 * sand + .7 * st) + uDay * mix(pl * pl * pl * .55, pl * pl * pl * pl * .2, nb) + uDay * ring * (.02 + .16 * pl) + uLampCol * (lamp * uLampK + .8 * lk.a) * (.9 + 1.6 * net);
  // the lake lights itself: a faint cool light on all of it, more where lit pools lie near
  col += uCaveAmb * .04 + uPool * glow * glow * .14 + uLampCol * uLampK * glow * glow * .05;
  // the slow swell: long ripples that catch whatever light is about
  float sw1 = ridge(xz * vec2(.11, .31) + vec2(uT * .035, uT * .02) + .8 * vn(xz * .07)), sw2 = ridge(xz * vec2(.27, .09) - vec2(uT * .02, uT * .03) + 3.);
  float swell = pow(clamp(sw1 * sw2, 0., 1.), 3.) * fres;
  col += swell * (uCaveAmb * .22 + uBounce * ls * .25 + uPool * glow * .9 + uLampCol * uLampK * glow * .4);
  // the wells' daylight lying on the water about them: pale, between the day's gold and the pool's green-blue, on
  // the dark; brightest in the net's moving lines
  col += mix(uBounce, uPool, .5) * ls * (.03 + .3 * net + .5 * swell) * fres;
  col += (uCaveAmb * .55 + uBounce * .25) * fres * max(ring, 0.) * 1.2;
  // THE RING'S LIGHT ON THE WATER: a path from the quay back along the nave's middle, by the metres from the ring
  { vec2 q = xz - uRing.xy; float al = dot(q, uRing.zw), ac = abs(q.x * uRing.w - q.y * uRing.z);
    col += uRingCol * uRingL.w * 1.2 * smoothstep(3., 12., al) * exp(-max(al, 0.) / 120.) * exp(-ac * ac / (12. + max(al, 0.) * .4)) * (.4 + 1.05 * net + .7 * swell); }
  // each lamp of the quay: a round of light at its foot, and a streak lying long on the water toward the eye
  for (int i = 0; i < 3; i++) {
    vec2 q = xz - uQLamp[i].xz, s = cameraPosition.xz - uQLamp[i].xz; s /= max(length(s), 1e-3);
    float al = dot(q, s), ac = abs(q.x * s.y - q.y * s.x), d2 = dot(q, q);
    col += uQLampCol * uQLamp[i].w * ((.1 + .3 * net) / (1. + d2 / 14.) + (.3 + .7 * net + .5 * swell) * step(0., al) * exp(-max(al, 0.) / 24.) * exp(-ac * ac / (1.2 + max(al, 0.) * .2)) * fres);
  }
  col += vec3(.5, .6, .6) * uCaveAmb * 1.3 * smoothstep(1.2, 0., abs(inD - .4 - .5 * sin(uT * .7 + xz.x * .05 + xz.y * .04)));
  float alpha = mix(1. - .8 * fres, .85, clamp(pl, 0., 1.));
  alpha = max(alpha, clamp(abs(ring) * .6 + swell * .8, 0., .8));
  col *= 1. - .6 * contact;
  gl_FragColor = vec4(placeFog(col, vW), alpha);
}`,Fe=`
attribute vec4 aMove;
varying vec3 vW; varying vec4 vK; varying vec4 vA; varying vec3 vB;
void main(){ vK = aMove;
  vA = vec4(instanceMatrix[3].x, instanceMatrix[3].z, instanceMatrix[0].x, instanceMatrix[3].y); vB = vec3(instanceMatrix[1].x, instanceMatrix[1].z, instanceMatrix[1].y);
  vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Ge=`
uniform vec3 uDay; uniform float uT, uBeam, uBeamG, uCaveDen, uFogDen;
varying vec3 vW; varying vec4 vK; varying vec4 vA; varying vec3 vB;
${he}
float erfa(float x){ float a = abs(x), d = 1. + a * (.278393 + a * (.230389 + a * (.000972 + a * .078108))); d *= d; d *= d; return sign(x) * (1. - 1. / d); }
void main(){
  vec3 O = cameraPosition, D = vW - O; float dist = length(D); D /= max(dist, 1e-4);
  #ifdef MIRROR
  // (what the water shows of a shaft wavers with the surface)
  D.xz += .03 * (vec2(vn(vW.xz * .6 + uT * .25), vn(vW.xz * .6 + 7. - uT * .2)) - .5); D = normalize(D);
  #endif
  // the ray in the shaft's own measure: ly its height from the water (0) to the roof (1); q its offset from the leaning axis
  float ly0 = (O.y - vA.w) / vB.z, lyd = D.y / vB.z;
  vec2 q0 = O.xz - vA.xy - vB.xy * ly0, qd = D.xz - vB.xy * lyd;
  float A = max(dot(qd, qd), 1e-6), B = dot(q0, qd), tc = -B / A, t0 = 0., t1 = 4000.;
  if (abs(lyd) > 1e-6) { float ta = -ly0 / lyd, tb = (1. - ly0) / lyd; t0 = max(t0, min(ta, tb)); t1 = min(t1, max(ta, tb)); }
  else if (ly0 < 0. || ly0 > 1.) discard;
  if (t1 <= t0) discard;
  float tn = clamp(tc, t0, t1), lyc = clamp(ly0 + lyd * tn, 0., 1.), wide = vK.w > .5 ? 1.25 - .45 * lyc : .85 + min(.9, 2.4 / vA.z) * (1. - lyc), sg = vA.z * .5 * wide;
  float b2 = max(dot(q0, q0) - B * B / A, 0.), sA = sqrt(A) / sg;
  // (the bell curve less its own value at the prism's wall, so the drawn prism has no edge at all)
  float len = max(exp(-b2 / (sg * sg)) - .018, 0.) * (.8862269 / sA) * (erfa(sA * (t1 - tc)) - erfa(sA * (t0 - tc)));
  // A BEAM, NOT A PANE: its MIDDLE is the same curve at four tenths of the breadth (a great shaft) or a half (a well), summed along the ray the same way,
  // and the beam glows by its two thicknesses, each as a share of a level look through the axis (1 there; no more
  // than 1.3 however long the ray runs in the lit air, so the eye inside a shaft is not blinded by it): a soft
  // skirt and a bright core, with no flat face. It THINS DOWN ITS LENGTH: brightest under the mouth, four tenths of
  // that at the water (a well); the great well's column is brightest under its bell's lip, thinner at the water,
  // and thin up in the open bore (the damp air under the rock holds the light; the bore's air is clear)
  // (A WELL'S BEAM IS LIGHT IN AIR, NEVER A LINE (mending 2; one law for every well's beam). ITS BREADTH IS ITS
  //  WELL'S OWN: the bell curve of the shaft's own half breadth (sg), and within it a brighter middle, the same
  //  curve at a half of that breadth (never narrowed to a line), so its brightness falls from its middle to its
  //  edge with no hard edge anywhere: at a level look through the axis the skirt gives 0.32 and the middle 0.42 of
  //  the beam's strength. ITS STRENGTH IS ITS WELL'S OWN, BY THE PLAN (vK.x, set once where the beams are made:
  //  the mouth's breadth as a share of the broadest mouth the deal makes), the same from wherever it is seen:
  //  NOTHING HERE DIMS A BEAM BY WHERE THE EYE STANDS (mending 3 struck the fade by the eye's distance that
  //  mending 2 had made). A frame holds few strong beams because few wells are broad. WHAT WAS SEEN in the
  //  builder's frames: soft pale shafts under the broad wells, veils under the rest; no beam read as a bright
  //  shaft across the hall, save one beside the lens.
  //  The pools on the water are the water's own and keep their brightness. The two great shafts keep
  //  their own law.)
  float sc = sg * (vK.w > .5 ? .4 : .5), sC = sqrt(A) / sc;
  float lenC = exp(-min(b2 / (sc * sc), 40.)) * (.8862269 / sC) * (erfa(sC * (t1 - tc)) - erfa(sC * (t0 - tc)));
  float th = min(max(len, 0.) / (sg * 1.7725), 1.3), thC = min(max(lenC, 0.) / (sc * 1.7725), 1.3);
  float glow = vK.w > .5 ? (.2 * th + .42 * thC) * (vK.x / .12) * mix(.5, 1., smoothstep(0., .42, lyc)) * mix(1., .3, smoothstep(.5, .8, lyc))
    : vK.x * (.32 * th + .42 * thC) * mix(.44, 1., pow(lyc, 1.2)) * pow(.85 / wide, .7);
  vec3 Pm = vK.w > .5 ? vW : O + D * tn; vec2 qc = q0 + qd * tn;
  // soft upright rays across the shaft, and dust sinking slowly through it
  float ray = .78 + .44 * vn(vec2(dot(qc, vec2(.8, .6)) / sg * 2.4 + vK.y * 50., uT * .03));
  float dust = .85 + .3 * vn(vec2(Pm.y * .5 - uT * .05 + vK.y * 31., (Pm.x + Pm.z) * .4 + vK.y * 17.));
  // motes: a round spark in one cell in five of a 0.4 m lattice, sinking and drifting slowly aside; and down some wells a fine rain, one drop
  // to a lane of 14 cm. Both are filtered like any fine texture: a mote fades out as its cell comes down from 6.7
  // pixels to 2, a drop as its lane comes down from 5 pixels to 1.7.
  vec2 mp = vec2((Pm.x + Pm.z) * 2.6 + vK.y * 40. + uT * .05, Pm.y * 2.6 + uT * .1), mc = floor(mp), mf = fract(mp) - .5 - .6 * (vec2(h21(mc), h21(mc + 7.3)) - .5);
  float mote = step(.78, h21(mc + 3.1)) * (1. - smoothstep(.02, .1, length(mf))) * (1. - smoothstep(.15, .5, max(fwidth(mp.x), fwidth(mp.y))));
  vec2 rp = vec2((Pm.x - Pm.z) * 7., Pm.y * .22); float hh = h21(vec2(floor(rp.x), floor(vK.y * 255.)));
  float drop = step(.5, vK.z) * step(.7, hh) * exp(-fract(rp.y + hh * 7. + uT * (.5 + .3 * hh)) * 24.) * (1. - smoothstep(.25, .5, abs(fract(rp.x) - .5))) * (1. - smoothstep(.2, .6, fwidth(rp.x)));
  // THE PLACE'S OWN FOG BETWEEN, AND NOTHING ELSE OF THE EYE'S: placeFog's own share, as every pier and rock face
  // under the roof takes it. A well's beam takes it AT ITS LIT POINT (Pm, on the ray where it passes nearest the
  // axis: tn metres from the eye), by the place's density at that point's height (the cave's under the rock); a
  // great shaft at its drawn wall, by the cave's density (its own law, as it stood).
  float fd = vK.w > .5 ? dist : tn, den = vK.w > .5 ? uCaveDen : mix(uCaveDen, uFogDen, smoothstep(-22., -3., Pm.y));
  float f = exp(-den * den * fd * fd);
  // (THE STRENGTH: a well's beam takes the hour's strength of the wells' beams, uBeam; a great shaft takes ITS OWN,
  //  uBeamG, the hour's strength the two great shafts had before mendings 2 and 3 raised the night's for the wells)
  vec3 col = uDay * (vK.w > .5 ? uBeamG : uBeam) * glow * (ray * dust + mote * (vK.w > .5 ? .5 : 1.5) + drop * .9);
  col *= f;
  #ifdef MIRROR
  col *= .5 * (.2 + .8 * pow(1. - clamp(abs(D.y), 0., 1.), 2.5));
  #endif
  gl_FragColor = vec4(col, 1.);
}`;function me(e=6,t=!1,o=1.25){const a=[],n=[],s=1/Math.cos(Math.PI/e),i=(f,l,d)=>{for(const r of[f,l,d])a.push(r[0],r[1],r[2]),n.push(0,1,0)};for(let f=0;f<e;f++){const l=f/e*wt,d=(f+1)/e*wt,r=Math.cos(l)*s,m=Math.sin(l)*s,u=Math.cos(d)*s,w=Math.sin(d)*s,M=[r*o,0,m*o],L=[u*o,0,w*o],y=[r,1,m],v=[u,1,w];i(M,y,v),i(M,v,L),t&&(i([0,0,0],M,L),i([0,1,0],v,y))}const h=new B.BufferGeometry;return h.setAttribute("position",new B.Float32BufferAttribute(a,3)),h.setAttribute("normal",new B.Float32BufferAttribute(n,3)),h}function Pe(){const e=new mt;return e.cyl(0,0,1,0,1,1,10,N(p.lime,.16),Q.daylit,!0,N(p.lime,.46)),e.quad([-1.1,1,-1.1],[1.1,1,-1.1],[1.1,1,1.1],[-1.1,1,1.1],N(p.day,.8),Q.daylit),e.box(0,.975,0,2.1,.03,.2,N(p.timberDark,.5)),e.cyl(0,.93,.975,0,.16,.16,6,N(p.timberDark,.4)),e}function Ke(){const e=new mt,t=[.46,.72,.6];e.cyl(0,0,1,0,1,1,8,N(t,1),Q.wet,!1,N(t,1.45));for(const o of[.14,.38,.62,.86])e.cyl(0,o,o+.007,0,1.7,1.7,8,N(t,1.6),Q.wet,!0);return e}const Aa=e=>(e+.12)*2*2.2/Math.cos(Math.PI/6),Ye=e=>Math.min(1,e/ae.bore[3][1]);async function Ea(e,t={}){const o=t.rng||e.rng.fork("wells-hero"),a=t.noise||e.noise,n=t.lake||ze(o),s=t.YW??0,i=t.shared||Te(),h=n.edgeAt(-Math.PI/2),f=t.quay||{x:h[0]*.84,z:h[1]*.84},l=t.big||[[0,0,15,1,s+40,20,o()],[f.x,f.z,9,1,s+40,12,o()]],d=t.piers||[];let r=t.roofH;if(!r){const c={x:l[0][0],z:l[0][1]},x=f.x-c.x,S=f.z-c.z,I=Math.hypot(x,S)||1,H=[x/I,S/I];r=Ne(n,a,{W:c,quay:f,n:H,p:[-H[1],H[0]],D:I,dome:{a:I-44,r:52,h:12},piers:d})}const m=(c,x)=>s+r(c,x),u=c=>c[5]??c[2],w=(c,x)=>Math.hypot(c.x-l[0][0],c.z-l[0][1])>u(l[0])+x&&Math.hypot(c.x-l[1][0],c.z-l[1][1])>u(l[1])+x,M=t.deal||await qe(n,o,{keep:c=>w(c,c.r+3)&&r(c.x,c.z)>5}),{wells:L,grid:y}=M,v=t.slant||[0,0],z=new B.Group;z.name="buried-lake";const k=new B.DataTexture(y.data,y.nx,y.nz,B.RGBAFormat,B.UnsignedByteType);k.magFilter=k.minFilter=B.NearestFilter,k.generateMipmaps=!1,k.needsUpdate=!0;const E=c=>({value:new B.Vector3(c[0],c[1],c[2])}),U={...i,...n.uniforms,tWell:{value:k},uGrid:{value:new B.Vector4(y.x0,y.z0,y.cell,ae.jitter)},uGridN:{value:new B.Vector2(y.nx,y.nz)},uBig:{value:l.map(c=>new B.Vector4(c[0],c[1],c[2],c[3]))},uBigCut:{value:new B.Vector2(u(l[0]),u(l[1]))},uLip:{value:new B.Vector4(...t.lip||[0,0,0,0])},uYW:{value:s},uCham:{value:t.chamber?t.chamber.r:0},uLime:E(ie.lime),uDay:E(t.day||ie.day),uBounce:E(t.bounce||[.5,.42,.27]),uPool:E(t.pool||[.6,.66,.2]),uLakeCol:E(t.lakeCol||we(ie.lake,.8)),uShallow:E(t.shallow||we(ie.shallows,.42)),uSand:E(t.sand||[.3,.27,.19]),uRing:{value:new B.Vector4(f.x,f.z,t.back?t.back[0]:0,t.back?t.back[1]:1)},uLampCol:{value:new B.Vector3(1,.62,.25)},uLampK:{value:t.lamp??0},uSlant:{value:new B.Vector2(v[0],v[1])},uBeam:{value:t.beam??.3},uBeamG:{value:t.beamGreat??t.beam??.3}},tt=new Map;for(const c of L)tt.set(c.j*y.nx+c.i,c);const[$,Z,ht,it]=n.bounds,vt=(c,x,S)=>{const I=Math.min(1,Math.max(0,(S-c)/(x-c)));return I*I*(3-2*I)},g={m:2.5,x0:$-15,z0:Z-15};g.nx=Math.ceil((ht+15-g.x0)/g.m)+1,g.nz=Math.ceil((it+15-g.z0)/g.m)+1,g.d=new Float32Array(g.nx*g.nz*3);const st=(c,x,S,I,H,X)=>{const bt=Math.max(0,Math.ceil((c-S-g.x0)/g.m)),Ht=Math.min(g.nx-1,Math.floor((c+S-g.x0)/g.m)),Ot=Math.max(0,Math.ceil((x-S-g.z0)/g.m)),Gt=Math.min(g.nz-1,Math.floor((x+S-g.z0)/g.m)),Vt=S*S;for(let $t=Ot;$t<=Gt;$t++){const C=g.z0+$t*g.m-x;for(let zt=bt;zt<=Ht;zt++){const Lt=g.x0+zt*g.m-c,Ft=Lt*Lt+C*C;if(Ft<Vt){const Y=($t*g.nx+zt)*3+I,nt=H(Ft);g.d[Y]=X?Math.max(g.d[Y],nt):g.d[Y]+nt}}}},It=c=>pe(c.r/1.4,.34,1);{let c=0;for(const x of L){const S=x.r*x.r,I=Math.min(24,7+9*x.r),H=I*I;st(x.x,x.z,I,1,X=>1.6*(S+.8*x.r)/(X*.35+6+S)*(1-X/H));{const X=1.6*x.r+3,bt=It(x);st(x.x+v[0],x.z+v[1],3*X,0,Ht=>bt*Math.exp(-Ht/(X*X)))}++c%120===0&&await e.yield()}}for(const c of l)st(c[0],c[1],56,1,x=>{const S=Math.sqrt(x),I=Math.max(0,S-c[2]);return 1.3*c[3]/(1+(I/9)**2)*(1-vt(40,56,S))}),st(c[0],c[1],c[2]+28,0,x=>Math.exp(-(Math.max(0,Math.sqrt(x)-c[2])**2)/120));const Ct=t.chamber,Tt=c=>Ct?.9*l[0][3]/(1+(Math.max(0,c-l[0][2])/26)**2)*(1-vt(Ct.r,Ct.r+16,c)):0;Ct&&st(l[0][0],l[0][1],Ct.r+16,1,c=>.6*Tt(Math.sqrt(c)));for(const c of d)st(c.x,c.z,c.r*1.25+8,2,x=>1-vt(c.r*1.25,c.r*1.25+8,Math.sqrt(x)),!0);for(const c of t.shoals||[])st(c.x,c.z,c.r+7,2,x=>1-vt(c.r,c.r+7,Math.sqrt(x)),!0);await e.yield();const q=(c,x)=>{const S=pe((c-g.x0)/g.m,0,g.nx-1.001),I=pe((x-g.z0)/g.m,0,g.nz-1.001),H=Math.floor(S),X=Math.floor(I),bt=S-H,Ht=I-X,Ot=(X*g.nx+H)*3+1,Gt=g.nx*3;return Math.min(1.5,(g.d[Ot]*(1-bt)+g.d[Ot+3]*bt)*(1-Ht)+(g.d[Ot+Gt]*(1-bt)+g.d[Ot+Gt+3]*bt)*Ht)};{const c=new Uint8Array(g.nx*g.nz*4);(()=>{for(let H=0;H<g.nx*g.nz;H++)c[H*4]=Math.min(255,g.d[H*3]*255),c[H*4+1]=Math.min(255,g.d[H*3+1]/1.5*255),c[H*4+2]=Math.min(255,g.d[H*3+2]*255),c[H*4+3]=0})();const S=t.lant==null?1:t.lant;for(const H of t.moor||[]){const X=Math.max(0,Math.ceil((H.x-11-g.x0)/g.m)),bt=Math.min(g.nx-1,Math.floor((H.x+11-g.x0)/g.m)),Ht=Math.max(0,Math.ceil((H.z-11-g.z0)/g.m)),Ot=Math.min(g.nz-1,Math.floor((H.z+11-g.z0)/g.m));for(let Gt=Ht;Gt<=Ot;Gt++)for(let Vt=X;Vt<=bt;Vt++){const $t=(g.x0+Vt*g.m-H.x)**2+(g.z0+Gt*g.m-H.z)**2,C=(Gt*g.nx+Vt)*4+3;c[C]=Math.min(255,c[C]+255*S*Math.exp(-$t/16))}}const I=new B.DataTexture(c,g.nx,g.nz,B.RGBAFormat,B.UnsignedByteType);I.magFilter=I.minFilter=B.LinearFilter,I.generateMipmaps=!1,I.needsUpdate=!0,U.tLake.value=I,U.uLakeBox.value.set(g.x0-g.m/2,g.z0-g.m/2,1/(g.nx*g.m),1/(g.nz*g.m))}const{xs:G,zs:dt}=ge(n,t.fine||void 0),lt=G.length-1,A=dt.length-1,O=lt+1,K=new Float32Array(O*(A+1)),W=new Float32Array(O*(A+1)).fill(99),R=c=>{for(let x=0;x<=lt;x++){const S=G[x],I=dt[c],H=c*O+x,X=n.rho(S,I);if(X<1){W[H]=-1,K[H]=Math.max(r(S,I),-2.5);continue}if(X-1>17*n.lip)continue;const bt=n.dist(S,I);W[H]=bt,bt<=17&&(K[H]=Math.max(r(S,I,-bt),-2.5))}};for(let c=0;c<=A;c++)R(c),c%8===7&&await e.yield();const T=(c,x,S)=>c<0||x<0||c>lt||x>A||W[x*O+c]>17?S:K[x*O+c],D=new Int32Array(O*(A+1)).fill(-1),P=[],J=[],et=[],at=[],j=c=>{for(let x=0;x<=lt;x++){const S=c*O+x;if(W[S]>11)continue;const I=G[x],H=dt[c],X=K[S],bt=(T(x+1,c,X)-T(x-1,c,X))/(G[Math.min(lt,x+1)]-G[Math.max(0,x-1)]),Ht=(T(x,c+1,X)-T(x,c-1,X))/(dt[Math.min(A,c+1)]-dt[Math.max(0,c-1)]),Ot=Math.hypot(bt,1,Ht);D[S]=P.length/3,P.push(I,s+X,H),J.push(bt/Ot,-1/Ot,Ht/Ot),et.push(q(I,H),0,0)}};for(let c=0;c<=A;c++)j(c),c%12===11&&await e.yield();const rt=c=>{for(let x=0;x<lt;x++){const S=D[c*O+x],I=D[c*O+x+1],H=D[(c+1)*O+x+1],X=D[(c+1)*O+x];S<0||I<0||H<0||X<0||at.push(S,I,H,S,H,X)}};for(let c=0;c<A;c++)rt(c);if(await e.yield(),t.lipBody){const c=t.lipBody.outer,x=P.length/3;for(let S=0;S<c.pos.length;S+=3)P.push(c.pos[S],c.pos[S+1],c.pos[S+2]),J.push(c.nor[S],c.nor[S+1],c.nor[S+2]),et.push(q(c.pos[S],c.pos[S+2]),0,0);for(const S of c.tris)at.push(x+S);await e.yield()}const At=new B.ShaderMaterial({name:"WellsCave",uniforms:U,vertexShader:ye,fragmentShader:Me,side:B.DoubleSide}),St=new B.ShaderMaterial({name:"WellsCaveMirror",uniforms:U,defines:{MIRROR:1},vertexShader:ye,fragmentShader:Me,side:B.DoubleSide}),b=(c,x,S,I)=>{const H=new B.BufferGeometry;return H.setAttribute("position",new B.Float32BufferAttribute(c,3)),H.setAttribute("normal",new B.Float32BufferAttribute(x,3)),H.setAttribute("aLight",new B.Float32BufferAttribute(S,3)),I&&H.setIndex(I),H},ot=(c,x)=>{const S=new B.Mesh(c,At);S.name=x,S.frustumCulled=!1,z.add(S);const I=new B.Mesh(c,St);I.name=x+"Mirror",I.frustumCulled=!1,I.scale.y=-1,I.position.y=2*s,z.add(I)};ot(b(P,J,et,at),"roof"),await e.yield();{let Ht=function(C){const Ft=C.B.x-C.A.x,Y=C.B.z-C.A.z,nt=Math.hypot(Ft,Y)||1,gt=-Y/nt,pt=Ft/nt,ct=C.lean??.5,_=C.wide??3,yt=[];for(let Wt=0;Wt<=20;Wt++){const xt=Wt/20,Bt=xt<ct?(xt-ct)/ct:(xt-ct)/(1-ct),jt=Bt*Bt,V=1.6*Math.sin(C.ph+3.1*xt)*(1-jt),ft=C.A.x+Ft*xt+gt*V,Mt=C.A.z+Y*xt+pt*V,Nt=C.notch?Math.min(1,2.5*Math.max(0,1-Math.abs(xt-C.notch.s)/C.notch.len)):0,Ut=C.spring+(C.crown-C.spring)*Math.pow(Math.max(0,1-Math.pow(Math.abs(Bt),2.4)),.8)+(C.notch?C.notch.up*Nt:0),_t=Math.max(r(ft,Mt)+1.2,Ut+C.deep),Zt=(Ut+_t)/2,Pt=(_t-Ut)/2,Kt=_*(1+.7*jt)*(1-.3*Nt),kt=q(ft,Mt),Xt=[];for(let Qt=0;Qt<8;Qt++){const oe=(Qt+.5)/8*wt,F=Math.cos(oe),ut=Math.sin(oe),qt=.6*a.n2(ft*.27+F*1.9+5,Mt*.27+ut*1.9)+.35*a.n2(ft*.8+F*4.3+9,Mt*.8+ut*4.3),Dt=Kt*(1+.28*qt)*(ut<0?.8:1),Rt=Zt+ut*Pt+(ut<0?.55*qt*-ut:0),Et=Math.hypot(F*Pt,ut*Dt)||1;Xt.push([ft+gt*F*Dt,s+Rt,Mt+pt*F*Dt,gt*F*Pt/Et,ut*Dt/Et,pt*F*Pt/Et,kt])}yt.push(Xt)}for(let Wt=0;Wt<20;Wt++)for(let xt=0;xt<8;xt++){const Bt=yt[Wt][xt],jt=yt[Wt][(xt+1)%8],V=yt[Wt+1][(xt+1)%8],ft=yt[Wt+1][xt];for(const Mt of[Bt,jt,V,Bt,V,ft])c.push(Mt[0],Mt[1],Mt[2]),x.push(Mt[3],Mt[4],Mt[5]),S.push(Mt[6],3,Mt[1]-s)}},Ot=function(C,zt,Lt,Ft,Y,nt){const gt=C.gx||1,pt=C.gz||1;for(let ct=0;ct<zt.p.length;ct+=3){const _=zt.p[ct]*gt,yt=zt.p[ct+2]*pt,Wt=_*Y+yt*nt,xt=-_*nt+yt*Y,Bt=C.x+Wt*C.r,jt=zt.p[ct+1]*Lt,V=C.z+xt*C.r,ft=zt.n[ct]/gt,Mt=zt.n[ct+2]/pt,Nt=Math.hypot(ft,Mt)||1;c.push(Bt,s+jt,V),x.push((ft*Y+Mt*nt)/Nt,0,(-ft*nt+Mt*Y)/Nt),S.push(Ft[Math.round(Math.atan2(xt,Wt)/wt*16+16)%16],2,zt.p[ct+1])}};const c=[],x=[],S=[],I=[],H=[],X=[];let bt=0;for(let C=0;C<Math.min(5,d.length);C++)I.push(be(o)),C%2&&await e.yield();for(let C=0;C<Math.min(3,d.length);C++)H.push(be(o,10));await e.yield();for(const C of d){bt++%6===5&&await e.yield();const zt=C.nave===0?H[bt%H.length]:I[bt%I.length],Lt=r(C.x,C.z),Ft=[];for(let ct=0;ct<16;ct++){const _=Math.cos(ct/16*wt),yt=Math.sin(ct/16*wt),Wt=C.x+_*C.r*1.3,xt=C.z+yt*C.r*1.3,Bt=l[0][0]-Wt,jt=l[0][1]-xt,V=Math.hypot(Bt,jt);Ft.push(Math.min(1.5,q(Wt,xt)+Tt(V)*(1.5*Math.max(0,(_*Bt+yt*jt)/Math.max(V,.001))-.35)))}const Y=(C.x*.37+C.z*.61)%wt,nt=Math.cos(Y),gt=Math.sin(Y),pt=c.length;Ot(C,zt,Lt,Ft,nt,gt),X.push({i0:pt,i1:c.length,kind:2,hh:Lt,pier:1,la:Ft,x:C.x,z:C.z})}for(const C of t.arches||[]){const zt=c.length;Ht(C),X.push({i0:zt,i1:c.length,kind:3,hh:0})}for(const C of t.blocks||[]){const zt=c.length;for(let Lt=0;Lt<C.p.length;Lt+=3)c.push(C.p[Lt],C.p[Lt+1],C.p[Lt+2]),x.push(C.n[Lt],C.n[Lt+1],C.n[Lt+2]),S.push(q(C.p[Lt],C.p[Lt+2]),2,0);X.push({i0:zt,i1:c.length,kind:2,hh:0})}async function Gt(){const C=ae.jitter,zt=[],Lt=(Y,nt,gt)=>{const pt=Math.min(1,Math.max(0,(gt-Y)/(nt-Y)));return pt*pt*(3-2*pt)};for(const Y of X){let nt=1e9,gt=-1e9,pt=1e9,ct=-1e9,_=-1e9;for(let yt=Y.i0;yt<Y.i1;yt+=3)nt=Math.min(nt,c[yt]),gt=Math.max(gt,c[yt]),pt=Math.min(pt,c[yt+2]),ct=Math.max(ct,c[yt+2]),_=Math.max(_,c[yt+1]);Y.b=[nt,gt,pt,ct,_]}await e.yield();let Ft=0;for(const Y of L){++Ft%300===0&&await e.yield();const nt=(Y.j*y.nx+Y.i)*4,gt=y.x0+(Y.i+.5)*y.cell+(y.data[nt]/255-.5)*2*C,pt=y.z0+(Y.j+.5)*y.cell+(y.data[nt+1]/255-.5)*2*C,ct=y.data[nt+2]/255*3.6,_=.4+.22*ct,yt=ct+_;if(!(ct<.01))for(const Wt of X){const xt=Wt.b;gt+yt<xt[0]||gt-yt>xt[1]||pt+yt<xt[2]||pt-yt>xt[3]||(await e.yield(),await Vt(Wt,gt,pt,ct,_,yt,zt,Lt),await e.yield())}}z.userData.cuts=zt}async function Vt(C,zt,Lt,Ft,Y,nt,gt,pt){const ct=C.kind===2,_=[];for(let V=C.i0;V<C.i1;V+=9){const ft=Math.min(c[V],c[V+3],c[V+6]),Mt=Math.max(c[V],c[V+3],c[V+6]),Nt=Math.min(c[V+2],c[V+5],c[V+8]);Math.max(c[V+2],c[V+5],c[V+8])<Lt-nt||Nt>Lt+nt||Mt<zt-nt||!ct&&ft>zt+nt||(ct?_.push(c[V+1],c[V+2],c[V],c[V+4],c[V+5],c[V+3],c[V+7],c[V+8],c[V+6]):_.push(c[V],c[V+2],c[V+1],c[V+3],c[V+5],c[V+4],c[V+6],c[V+8],c[V+7]))}if(!_.length)return;const yt=V=>C.kind===3?nt:Ft+(C.pier?pt(.7,.86,(V-s)/C.hh):0)*Y,Wt=(V,ft)=>{const Mt=yt(ft),Nt=zt+Mt*Math.cos(V),Ut=Lt+Mt*Math.sin(V),_t=ct?ft:Nt,Zt=Ut,Pt=ct?Nt:ft;let Kt=0;for(let kt=0;kt<_.length;kt+=9){const Xt=(_[kt+3]-_[kt])*(Zt-_[kt+1])-(_[kt+4]-_[kt+1])*(_t-_[kt]),Qt=(_[kt+6]-_[kt+3])*(Zt-_[kt+4])-(_[kt+7]-_[kt+4])*(_t-_[kt+3]),oe=(_[kt]-_[kt+6])*(Zt-_[kt+7])-(_[kt+1]-_[kt+7])*(_t-_[kt+6]);if((Xt<0||Qt<0||oe<0)&&(Xt>0||Qt>0||oe>0))continue;const F=Xt+Qt+oe;F!==0&&(Qt*_[kt+2]+oe*_[kt+5]+Xt*_[kt+8])/F>Pt&&Kt++}return(Kt&1)===1},xt=s-.3,Bt=V=>Math.min(C.b[4],s+r(zt+nt*Math.cos(V),Lt+nt*Math.sin(V))+.3);await $t(C,zt,Lt,Ft,nt,yt,Wt,V=>{const ft=Bt(V),Mt=[];let Nt=!1,Ut=0,_t=xt;const Zt=(Pt,Kt,kt)=>{for(let Xt=0;Xt<10;Xt++){const Qt=(Pt+Kt)/2;Wt(V,Qt)===kt?Pt=Qt:Kt=Qt}return(Pt+Kt)/2};for(let Pt=xt;;Pt+=.45){const Kt=Math.min(Pt,ft),kt=Wt(V,Kt);if(kt&&!Nt?Ut=Kt===xt?xt:Zt(_t,Kt,!1):!kt&&Nt&&Mt.push([Ut,Zt(_t,Kt,!0)]),Nt=kt,_t=Kt,Kt>=ft){Nt&&Mt.push([Ut,ft]);break}}return Mt},gt)}async function $t(C,zt,Lt,Ft,Y,nt,gt,pt,ct){const _=Math.min(72,Math.max(24,Math.round(20*Y)+8)),yt=C.b,Wt=C.kind+.25,xt=C.pier?[.7,.75,.8,.86].map(F=>s+F*C.hh):[],Bt=F=>{const ut=[];for(const qt of F){let Dt=qt[0],Rt=0;for(const Et of xt)Et>Dt&&Et<qt[1]&&(ut.push([Dt,Et,Rt]),Dt=Et),Et<=Dt&&Rt++;ut.push([Dt,qt[1],Rt])}return ut},jt=F=>{const ut=zt+Y*Math.cos(F),qt=Lt+Y*Math.sin(F);return ut>yt[0]-Y&&ut<yt[1]+Y&&qt>yt[2]-Y&&qt<yt[3]+Y};let V=[],ft=[];for(let F=0;F<_;F++)ft.push(F/_*wt),V.push(jt(ft[F])?Bt(pt(ft[F])):[]),F%12===11&&await e.yield();if(!V.some(F=>F.length))return;for(let F=0;F<3;F++){const ut=[],qt=[];let Dt=0;await e.yield();for(let Rt=0;Rt<ft.length;Rt++){const Et=V[Rt],Jt=V[(Rt+1)%ft.length],se=ft[Rt],te=Rt+1<ft.length?ft[Rt+1]:wt;ut.push(se),qt.push(Et);let ne=!1;for(const ee of Et)for(const le of Jt)le[2]===ee[2]&&le[0]<ee[1]&&ee[0]<le[1]&&(Math.abs(le[0]-ee[0])>.2||Math.abs(le[1]-ee[1])>.2)&&(ne=!0);if(ne){const ee=(se+te)/2;ut.push(ee),qt.push(Bt(pt(ee))),Dt++}}if(ft=ut,V=qt,!Dt)break}const Mt=ft.length;await e.yield();const Nt=[],Ut=xt.length+1,_t=new Array(Ut).fill(0),Zt=new Array(Ut).fill(0),Pt=(F,ut,qt,Dt)=>Nt.push([F,ut[0],ut[1],qt,Dt[0],Dt[1],ut[2]]),Kt=(F,ut,qt,Dt=0)=>{const Rt=(ut[0]+ut[1])/2;if(Dt||Zt[ut[2]]++,Dt<3){const te=(F+qt)/2,ne=Bt(pt(te)).find(ee=>ee[2]===ut[2]&&ee[0]<ut[1]&&ut[0]<ee[1]);ne?(Pt(F,ut,te,ne),Kt(te,ne,qt,Dt+1)):Kt(F,ut,te,Dt+1);return}let Et=F,Jt=qt;for(let te=0;te<7;te++){const ne=(Et+Jt)/2;gt(ne,Rt)?Et=ne:Jt=ne}if(Math.abs(Et-F)<1e-4)return;const se=Bt(pt(Et)).find(te=>te[2]===ut[2]&&te[0]<Rt&&te[1]>Rt);Pt(F,ut,Et,se||[Rt,Rt,ut[2]])};for(let F=0;F<Mt;F++){const ut=V[F],qt=V[(F+1)%Mt],Dt=ft[F],Rt=F+1<Mt?ft[F+1]:wt;for(const Et of ut){let Jt=!1;for(const se of qt)se[2]===Et[2]&&se[0]<Et[1]&&Et[0]<se[1]&&(Pt(Dt,Et,Rt,se),Jt=!0);Jt||Kt(Dt,Et,Rt)}for(const Et of qt)ut.some(Jt=>Et[2]===Jt[2]&&Jt[0]<Et[1]&&Et[0]<Jt[1])||Kt(Rt,Et,Dt)}for(const F of V){const ut=new Set(F.map(qt=>qt[2]));for(const qt of ut)_t[qt]++}const kt=(F,ut)=>{const qt=nt(ut),Dt=Math.cos(F),Rt=Math.sin(F),Et=zt+qt*Dt,Jt=Lt+qt*Rt;c.push(Et,ut,Jt),x.push(-Dt,0,-Rt),S.push(C.pier?C.la[Math.round(Math.atan2(Jt-C.z,Et-C.x)/wt*16+16)%16]:q(Et,Jt),Wt,C.pier?(ut-s)/C.hh:ut-s)};let Xt=0,Qt=1e9,oe=-1e9;for(const F of Nt)C.pier&&_t[F[6]]===Mt&&Zt[F[6]]===0||(kt(F[0],F[1]),kt(F[3],F[4]),kt(F[3],F[5]),Xt++,F[2]-F[1]>.001&&(kt(F[0],F[1]),kt(F[3],F[5]),kt(F[0],F[2]),Xt++),Qt=Math.min(Qt,F[1],F[4]),oe=Math.max(oe,F[2],F[5]));Xt&&ct.push({x:zt,z:Lt,r:Ft,rm:Y,kind:C.kind,pier:C.pier?1:0,hh:C.hh,i0:C.i0/3,i1:C.i1/3,f1:c.length/3,tris:Xt,y0:Qt,y1:oe})}if(await e.yield(),r.at&&r.G){const C=r.G,zt=t.clear??2.6,Lt=(Y,nt,gt,pt,ct)=>{const _=r(Y,nt);if(_<3.4||_-gt<1.2||!n.inside(Y,nt,6))return;const yt=Math.floor((Y-y.x0)/y.cell),Wt=Math.floor((nt-y.z0)/y.cell),xt=.9+1.2*pt,Bt=pt*(gt+xt)/(gt+.4);for(let ft=-1;ft<=1;ft++)for(let Mt=-1;Mt<=1;Mt++){const Nt=tt.get((Wt+ft)*y.nx+yt+Mt);if(Nt&&(Nt.x-Y)**2+(Nt.z-nt)**2<(Nt.r*1.22+.4+Bt+.05)**2){z.userData.needlesWell=(z.userData.needlesWell||0)+1;return}}for(const ft of l)if(Math.hypot(Y-ft[0],nt-ft[1])<u(ft)+pt+.5)return;if(t.gap&&t.gap(Y,nt,s+_-gt,s+_)-pt<zt){z.userData.needlesOut=(z.userData.needlesOut||0)+1;return}if(t.lipBody&&t.lipBody.ground(Y,nt,Bt)){z.userData.needlesLip=(z.userData.needlesLip||0)+1;return}const jt=q(Y,nt),V=5;z.userData.needles=(z.userData.needles||0)+1;for(let ft=0;ft<V;ft++){const Mt=ct+ft/V*wt,Nt=ct+(ft+1)/V*wt,Ut=Math.cos(Mt),_t=Math.sin(Mt),Zt=Math.cos(Nt),Pt=Math.sin(Nt);c.push(Y+Ut*Bt,s+_+xt,nt+_t*Bt,Y+Zt*Bt,s+_+xt,nt+Pt*Bt,Y,s+_-gt,nt),x.push(Ut,0,_t,Zt,0,Pt,(Ut+Zt)/2,0,(_t+Pt)/2),S.push(jt,3,_+xt,jt,3,_+xt,jt,3,_-gt)}};await e.yield();{const Y=C.nave||{half:11,bay:21,a0:0,a1:C.D},nt=Math.max(1,Math.floor((Y.a1-Y.a0)/Y.bay)),gt=d.filter(pt=>pt.nave);for(let pt=0;pt<260;pt++){const ct=o(),_=(gt.length?gt[Math.floor(ct*gt.length)].a:Y.a0+Math.floor(ct*(nt+1))*Y.bay)+o.range(-2.6,2.6),yt=o.range(-Y.half,Y.half),Wt=.6+2.4*o()**2,xt=.06+Wt*o.range(.1,.17),Bt=o.range(0,wt),jt=r.at(_,yt);Lt(jt[0],jt[1],Wt,xt,Bt)}}await e.yield();const Ft=(Y,nt)=>{for(let gt=Y;gt<nt;gt++){const pt=o.range($,ht),ct=o.range(Z,it),_=.8+3.2*o()**2,yt=.07+_*o.range(.09,.15),Wt=o.range(0,wt);a.n2(pt*.045+7.7,ct*.045-2.2)>.12&&Lt(pt,ct,_,yt,Wt)}};for(let Y=0;Y<3400;Y+=200)Ft(Y,Y+200),await e.yield()}await Gt(),c.length&&ot(b(c,x,S,null),"piers")}await e.yield();{const c=[],x=[],S=[],I=[],X=[-6,-1.5,1.5,6,13];for(let Ot=0;Ot<=300;Ot++){const Gt=Ot/300*wt,Vt=n.edgeAt(Gt),$t=n.edgeAt(Gt+.01),C=$t[0]-Vt[0],zt=$t[1]-Vt[1],Lt=Math.hypot(C,zt)||1,Ft=zt/Lt,Y=-C/Lt,nt=Vt[0]*Ft+Vt[1]*Y>0?1:-1;for(const gt of X){const pt=Vt[0]+nt*Ft*gt,ct=Vt[1]+nt*Y*gt,_=.22;c.push(pt,s+Re(gt),ct),x.push(-nt*Ft*_,1,-nt*Y*_),S.push(q(pt,ct)*.8+.25,1,gt)}}const bt=X.length;for(let Ot=0;Ot<300;Ot++)for(let Gt=0;Gt<bt-1;Gt++){const Vt=Ot*bt+Gt,$t=(Ot+1)*bt+Gt;I.push(Vt,$t,$t+1,Vt,$t+1,Vt+1)}const Ht=new B.Mesh(b(c,x,S,I),At);Ht.name="beach",Ht.frustumCulled=!1,z.add(Ht)}return await e.yield(),Ve(e,{opts:t,group:z,U,lake:n,YW:s,wells:L,grid:y,big:l,quay:f,slant:v,roofY:m,roofH:r,shared:i,tWell:k})}async function Ve(e,t){const{opts:o,group:a,U:n,lake:s,YW:i,wells:h,big:f,quay:l,slant:d,roofY:r,roofH:m,shared:u,tWell:w}=t,[M,L,y,v]=s.bounds,z=new B.BufferGeometry,k=i-64,E=M-20,U=y+20,tt=L-20,$=v+20,Z=i-.03;z.setAttribute("position",new B.Float32BufferAttribute([E,k,tt,E,k,$,U,k,$,U,k,tt,E,Z,tt,E,Z,$,U,Z,$,U,Z,tt],3)),z.setIndex([0,1,2,0,2,3,0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0]);const ht=new B.Mesh(z,new B.MeshBasicMaterial({color:66308,fog:!1,side:B.DoubleSide}));ht.name="bed",ht.frustumCulled=!1,a.add(ht);const it=new B.BufferGeometry;it.setAttribute("position",new B.Float32BufferAttribute([M-20,i,L-20,M-20,i,v+20,y+20,i,v+20,y+20,i,L-20],3)),it.setIndex([0,1,2,0,2,3]);const vt=new B.Mesh(it,new B.ShaderMaterial({name:"WellsWater",uniforms:n,transparent:!0,depthWrite:!1,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:He}));vt.name="water",vt.frustumCulled=!1,vt.renderOrder=2,a.add(vt);const g=b=>{let ot=1e9,c=-1e9;for(let x=0;x<8;x++){const S=x/8*wt,I=m(b.x+Math.cos(S)*(b.r+.1),b.z+Math.sin(S)*(b.r+.1));ot=Math.min(ot,I),c=Math.max(c,I)}return[ot,c]};await e.yield();const st=[],It=Be(s,m),Ct=Math.cos(Math.PI/10);let Tt=0;for(const b of h){if(b.lo===void 0){const x=g(b);b.lo=x[0],b.hi=x[1]}const ot=Math.max(b.r+.06,(b.r+.01)/Ct);let c=1e9;for(let x=0;x<10;x++){const S=x/10*wt,I=(x+1)/10*wt,H=b.x+Math.cos(S)*ot,X=b.z+Math.sin(S)*ot,bt=b.x+Math.cos(I)*ot,Ht=b.z+Math.sin(I)*ot;for(const Ot of It.kinks(H,X,bt,Ht))c=Math.min(c,It(H+(bt-H)*Ot,X+(Ht-X)*Ot))}b.yLo=i+Math.min(b.lo-.3,c-.201),b.yHi=i+Math.max(b.hi,m(b.x,b.z))+2.6+.5*b.r,st.push({m:new B.Matrix4().makeScale(ot,b.yHi-b.yLo,ot).setPosition(b.x,b.yLo,b.z)}),++Tt%120===0&&await e.yield()}await e.yield();const q=re(Pe().build(),ue(u,0),st,"throats");a.add(q);const G=(b,ot,c,x,S)=>new B.Matrix4().set(b,-d[0],0,x+d[0],0,ot,0,c,0,-d[1],b,S+d[1],0,0,0,1),dt=[],lt=[],A=[],O=[];for(const b of h){const ot=b.r+.12,c=[Ye(b.r),b.phase,Math.round(b.phase*255)*7%10<3?1:0,0],x=Math.max(b.lo,b.hi)+.25;dt.push({m:G(ot*2,x,i,b.x,b.z),move:c}),lt.push({m:G(ot*2,-x,i,b.x,b.z),move:c})}f.forEach((b,ot)=>{const c=b[4]??r(b[0],b[1]),x=[(ot?.04:.12)*b[3],b[6]??.5,0,1],S=c-i;A.push({m:G(b[2]*.8,S,i,b[0],b[1]),move:x}),O.push({m:G(b[2]*.8,-S,i,b[0],b[1]),move:x})});const K=(b,ot,c)=>new B.ShaderMaterial({name:b,uniforms:n,defines:c?{MIRROR:1}:{},vertexShader:Fe,fragmentShader:Ge,transparent:!0,depthWrite:!1,blending:B.AdditiveBlending,side:ot}),W=re(me(6,!0,2.2),K("WellsBeam",B.BackSide,!1),dt,"beams");W.renderOrder=4;const R=re(me(6,!0,2.2),K("WellsBeamMirror",B.FrontSide,!0),lt,"beamsMirror");R.renderOrder=3;const T=re(me(12,!0),K("WellsGreat",B.BackSide,!1),A,"great");T.renderOrder=4;const D=re(me(12,!0),K("WellsGreatMirror",B.FrontSide,!0),O,"greatMirror");D.renderOrder=3,a.add(W,R,T,D);const P=[],J=[],et=.9;for(const b of h){if(b.bare)continue;const ot=Math.min(1.9,Math.max(.85,b.r*.85/.3)),c=b.topY-.9-.62*ot-(i-.25);P.push({m:new B.Matrix4().makeRotationY(b.phase*40).scale(new B.Vector3(ot,ot,ot)).setPosition(b.x,b.topY-.9,b.z),move:[b.period,b.phase,c,et]}),J.push({m:new B.Matrix4().makeTranslation(b.x,b.topY,b.z),move:[b.period,b.phase,c,.9]}),b.travel=c,b.bucket=ot}for(const b of o.hauls||[]){const ot=b.topY-.9-.62*b.S-(i-.25);P.push({m:new B.Matrix4().makeRotationY(b.phase*40).scale(new B.Vector3(b.S,b.S,b.S)).setPosition(b.x,b.topY-.9,b.z),move:[b.period,b.phase,ot,et]}),J.push({m:new B.Matrix4().makeTranslation(b.x,b.topY,b.z),move:[b.period,b.phase,ot,.9]})}const at=re(Ce().build(),ue(u,5),P,"buckets"),j=re(Oe().build(),ue(u,6),J,"ropes");a.add(at,j);const rt=(o.pipes||[]).map(b=>{const ot=r(b[0],b[1])+.6;return{m:new B.Matrix4().makeScale(b[2],ot-(i-2),b[2]).setPosition(b[0],i-2,b[1])}});rt.length&&a.add(re(Ke().build(),ue(u,0),rt,"pipes"));const At=(M+y)/2,St=(L+v)/2;return{object:a,radius:Math.max(y-M,v-L)/2,height:30,center:new B.Vector3(At,i+10,St),anchors:{quay:new B.Vector3(l.x,i,l.z),shaft:new B.Vector3(f[0][0],i,f[0][1])},uniforms:n,shared:u,lake:s,wells:h,roofY:r,roofH:m,YW:i,triangles:{roof:0},update(b,ot){o.shared||(u.uT.value=ot)},dispose(){w.dispose(),n.tLake.value.dispose()},ground:!1,groundY:i}}export{ie as COL,he as GLSL_NOISE,fe as GLSL_PLACE,de as GLSL_QLAMP,mt as Geo,Le as LAKE_GLSL,Q as MAT,Ue as MOVE_LAW,xe as REACH,ae as WELL,ea as arcadeBay,aa as arcadePier,ra as awningGeo,Re as beachY,Ye as beamK,Aa as beamReach,ha as beastGeo,pa as bedGeo,za as boreSpot,Ce as bucketGeo,Ea as buildHero,ma as chainWheel,qe as dealWells,sa as domeGeo,ya as dovecoteGeo,Je as drillTrestle,da as fernGeo,wa as fruitTree,na as houseGeo,re as instanced,ba as jarsGeo,ue as liftMaterial,Yt as lin,La as lipForm,De as lipIn,ze as makeLake,Ne as makeRoof,Te as makeShared,la as personGeo,be as pierGeo,Ta as pierGirth,Ke as pipeGeo,ga as poolGeo,Qe as potGeo,Xe as pumpBeam,ua as rockGeo,Be as roofDrawn,ge as roofLines,Oe as ropeGeo,ka as smallWell,ia as stairGeo,Ma as stallGeo,fa as storkGeo,ta as tankOnLegs,Pe as throatGeo,je as timberMat,va as trellisGeo,xa as wallGeo,ca as washGeo,Ze as waterWheel,oa as weathercock,_e as wellHead,$e as windmill};
