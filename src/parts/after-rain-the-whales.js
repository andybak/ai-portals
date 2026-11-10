import*as q from"three";import*as we from"../kit/flora.js";import*as Se from"../kit/fx.js";const _=t=>{const a=new q.Color(t);return[a.r,a.g,a.b]},eo=t=>new q.Vector3(t[0],t[1],t[2]),Ne=(t,a,l)=>Math.min(l,Math.max(a,t)),ae=(t,a,l)=>t+(a-t)*l,ue=(t,a,l)=>{const v=Ne((l-t)/(a-t),0,1);return v*v*(3-2*v)},Ce=24,Le=16,Ve=18;function dt(t){const a=t==="dawn"||t==="day"||t==="night"?t:"golden",l=Math.PI/180,v=(x,c)=>new q.Vector3(-Math.sin(c*l)*Math.cos(x*l),Math.sin(x*l),-Math.cos(c*l)*Math.cos(x*l)),s={golden:{sunDir:v(9,40),sun:"#ffbc74",sunK:2.6,zen:"#3a477a",mid:"#676c9e",hor:"#ffb672",cool:"#8581a8",lit:"#ffa878",dark:"#4a5180",sky:"#808cc8",ground:"#a08f96",fog:"#c79c8e",fogCool:"#7d83ae",glow:1.15},dawn:{sunDir:v(9,-40),sun:"#ffc9a0",sunK:2.3,zen:"#52648f",mid:"#8a90b8",hor:"#ffd0aa",cool:"#a9abc8",lit:"#ffc0a4",dark:"#5e678e",sky:"#8e9bcb",ground:"#a3949a",fog:"#d1bcb8",fogCool:"#adb0c8",glow:1},day:{sunDir:v(57,34),sun:"#fff1dc",sunK:2.2,zen:"#5f82b8",mid:"#9db4d6",hor:"#e2e6ea",cool:"#c3cfdf",lit:"#f6f1ea",dark:"#7a88a6",sky:"#a3b6da",ground:"#a8a39c",fog:"#cfd5dc",fogCool:"#bcc7d6",glow:.5},night:{sunDir:v(3,40),sun:"#ff9c6a",sunK:0,zen:"#2c3a72",mid:"#4d5a96",hor:"#f0a27c",cool:"#6f77a8",lit:"#c98e8c",dark:"#3b4474",sky:"#98a6de",ground:"#7a7896",fog:"#8f86a6",fogCool:"#6f78a6",glow:.8}}[a],i=x=>new q.Color(s[x]);return{hour:a,sunDir:s.sunDir.clone().normalize(),sunK:s.sunK,sunColor:i("sun").multiplyScalar(s.sunK>0?s.sunK:.45),skyColor:i("sky"),groundColor:i("ground"),fogColor:i("fog"),fogNear:70,fogFar:a==="night"?1300:1700,zen:i("zen"),mid:i("mid"),hor:i("hor"),cool:i("cool"),cloudLit:i("lit"),cloudDark:i("dark"),fogCool:i("fogCool"),glow:s.glow,lamps:a==="night"?1:a==="day"?.12:.55,lampShare:a==="night"?1:a==="day"?.05:a==="dawn"?.5:.8,wetCap:.33/(a==="night"?1.6:a==="day"?.94:1.2)}}async function ht(t,a){const v=new Uint8Array(262144),s=x=>{const c=new Float32Array(x*x);for(let n=0;n<c.length;n++)c[n]=t();return c},i=[[8,.5],[16,.25],[32,.15],[64,.1]];for(let x=0;x<2;x++){const c=new Float32Array(65536);for(const[n,p]of i){const m=s(n),b=n/256;for(let w=0;w<256;w++){const o=w*b,f=Math.floor(o),e=o-f,u=e*e*(3-2*e),z=f%n*n,W=(f+1)%n*n;for(let T=0;T<256;T++){const R=T*b,M=Math.floor(R),S=R-M,k=S*S*(3-2*S),r=M%n,d=(M+1)%n;c[w*256+T]+=p*ae(ae(m[z+r],m[z+d],k),ae(m[W+r],m[W+d],k),u)}}await a.yield()}for(let n=0;n<256*256;n++)v[n*4+x]=Ne(Math.round(c[n]*255),0,255)}for(let x=0;x<256*256;x++)v[x*4+2]=Math.floor(t()*256),v[x*4+3]=255;await a.yield();const h=new q.DataTexture(v,256,256,q.RGBAFormat,q.UnsignedByteType);return h.wrapS=h.wrapT=q.RepeatWrapping,h.magFilter=q.LinearFilter,h.minFilter=q.LinearMipmapLinearFilter,h.generateMipmaps=!0,h.needsUpdate=!0,h}const xe=`
uniform sampler2D tNoise; uniform float uTime; uniform vec3 uPortal, uPortalCol;
uniform vec3 uSunDir, uSunCol, uZen, uMid, uHor, uCool, uCloudLit, uCloudDark, uFogWarm, uFogCool, uSkyAmb, uGroundAmb;
uniform vec2 uSunAz; uniform float uSunK, uFogK, uGlow, uLamps, uLampShare; uniform float uLampDraw[38];
uniform vec4 uBox[${Ce}]; uniform float uBoxH[${Ce}];
float gNzLod = 0.;
float nz(vec2 p){ return textureLod(tNoise, p, gNzLod).r; }
float nz2(vec2 p){ return textureLod(tNoise, p, gNzLod).g; }
float hash21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float azWarm(vec3 d){ vec2 h = d.xz; float l = max(length(h), 1e-4); return clamp(dot(h / l, uSunAz) * .5 + .5, 0., 1.); }
// the clear sky: slate and blue-violet above, apricot and pale gold low on the sun's side
vec3 arwSkyBase(vec3 d, float sunShare){
  float up = clamp(d.y, 0., 1.), w = azWarm(d); float w2 = w * w * w;
  vec3 hor = mix(uCool, uHor, w2);
  vec3 c = mix(uMid, uZen, clamp(up * 1.6, 0., 1.));
  float hb = 1. - up; hb *= hb; hb *= hb;
  c = mix(c, hor, clamp(hb * (0.55 + 0.45 * w2) * 1.25, 0., 1.));
  float sd = clamp(dot(d, uSunDir), 0., 1.); float s4 = sd * sd; s4 *= s4; float s16 = s4 * s4; s16 *= s16; float s64 = s16 * s16; s64 *= s64;
  float s256 = s64 * s64; s256 *= s256; float s2k = s256 * s256; s2k *= s2k; s2k *= s2k;
  c += uSunCol * uGlow * (s4 * .045 + s16 * .09 + s64 * .13 * sunShare + s256 * .14 * sunShare + s2k * 5. * sunShare * step(0.001, uSunK));
  return c;
}
// the lifting cloud deck: rgb colour, a cover
vec4 arwCloud(vec3 d){
  float up = max(d.y, 0.); vec2 p = d.xz / (up + .12);
  float w = azWarm(d); float low = 1. - clamp(up * 2.2, 0., 1.);
  vec2 q = p * .055 + vec2(uTime * .0040, uTime * .0023);
  float n = nz(q) * .62 + nz2(q * 2.7 + .31) * .38 + (nz(q * 6.3 + .7) - .5) * .11;
  float edge = mix(.35, .72, w * w * low);
  float cover = smoothstep(edge, edge + .2, n) * smoothstep(.015, .10, d.y);
  float thick = smoothstep(edge, edge + .42, n);
  float under = w * w * (.16 + .84 * low);
  vec3 col = mix(uCloudDark * (1.05 - .35 * thick), uCloudLit * (1.03 - .3 * thick), clamp(under * 1.25, 0., 1.));
  col += uSunCol * .16 * w * w * w * (1. - thick) * uGlow;
  return vec4(col, cover * .93);
}
vec3 arwSky(vec3 d, float sunShare){
  vec3 dn = normalize(d + vec3(0., 1e-5, 0.));
  vec4 cl = arwCloud(dn);
  vec3 c = arwSkyBase(dn, sunShare * (1. - cl.a));
  c = mix(c, cl.rgb, cl.a);
  vec3 hz = mix(uFogCool, uFogWarm, azWarm(dn));
  // low over the land the sky is seen through the same haze as the far land is: where it would stand darker than the
  // haze the hills fade into (cloud shade on the side away from the sun), it runs to the haze's own colour, wholly up
  // to 4 degrees and less and less up to 14, so no pale band of hills stands hard against a darker sky at any hour
  float lc = dot(c, vec3(.3, .6, .1)), lh = dot(hz, vec3(.3, .6, .1));
  c = mix(c, hz, smoothstep(.24, .07, dn.y) * smoothstep(0., .35 * lh, lh - lc));
  float below = smoothstep(.02, -.12, dn.y);
  return mix(c, hz * (1. - .25 * below), max(below, smoothstep(.07, 0., dn.y) * .55));
}
vec3 arwHaze(vec3 col, vec3 wp){
  vec3 v = wp - cameraPosition; float dist = length(v);
  float dn = dist * uFogK * (1. + 1.2 * exp(-max(wp.y, 0.) * .03));
  float f = 1. - exp(-dn * dn * 1.9 - dn * .3);
  vec3 hz = mix(uFogCool, uFogWarm, azWarm(v / max(dist, 1e-3)));
  return mix(col, hz, clamp(f, 0., .96));
}
// a lamp standard of the kerb lattice (index k, side -1 or 1): lit, steady, where its own draw from the lamps' stream
// lies under the hour's share; none stands in a cross street's roadway
float lampOn(float k, float side){ int i = int(clamp(k + 9., 0., 18.)) * 2 + (side > 0. ? 1 : 0); return step(uLampDraw[i], uLampShare); }
float lampHere(float lz){ float a = step(-5.5, lz) * step(lz, 19.5), b = step(-127.5, lz) * step(lz, -98.5), c = step(-238.5, lz) * step(lz, -223.5); return (1. - max(a, max(b, c))) * step(-262., lz) * step(lz, 320.); }
// how much of a ray from p along d gets past the buildings' boxes (1 clear, 0 blocked), soft at the edges
float cityRay(vec3 p, vec3 d, float soft){
  vec3 sg = vec3(d.x < 0. ? -1. : 1., d.y < 0. ? -1. : 1., d.z < 0. ? -1. : 1.);
  vec3 inv = sg / max(abs(d), vec3(1e-4));
  float lit = 1.;
  for (int i = 0; i < ${Ce}; i++) {
    vec4 b = uBox[i]; float h = uBoxH[i];
    vec3 t0 = (vec3(b.x, -1., b.y) - p) * inv, t1 = (vec3(b.z, h, b.w) - p) * inv;
    vec3 a = min(t0, t1), c = max(t0, t1);
    float tn = max(max(a.x, a.y), a.z), tf = min(min(c.x, c.y), c.z);
    lit *= 1. - clamp((tf - max(tn, 0.)) / soft, 0., 1.);
  }
  return lit;
}
// THE WET'S CEILING, one law for every puddle and all wet paving: its colour never stands over uWetCap in its
// brightest channel (set against the hour's exposure so that the lens sees it under 0.85 and under the bloom's
// threshold); under three quarters of the ceiling nothing is changed, over it the light is rolled off softly and
// keeps its hue, so what lies in the light (joints, bands, a pool's rim) is kept.
uniform float uWetCap;
vec3 arwCeil(vec3 c){ float m = max(c.r, max(c.g, c.b)), k = uWetCap * .75, s = uWetCap - k; return m > k ? c * ((k + s * (1. - exp(-(m - k) / s))) / m) : c; }
// THE RAIN'S POOLS on the square's and the terrace's paving, each where the plan laid it ([x, z, 1 / half breadth,
// 1 / half length]): 1 inside a pool, 0 outside, the rim a little uneven by the stone's own noise (nse, 0 to 1) and
// soft over a hand's breadth. All of it by place.
uniform vec4 uPool[${Ve}];
float arwPools(vec2 xz, float nse){
  float m = 0.;
  for (int j = 0; j < ${Ve}; j++) { vec4 q = uPool[j]; float e = length((xz - q.xy) * q.zw) + (nse - .5) * .2; m = max(m, 1. - smoothstep(.94, 1., e)); }
  return m;
}
// the arch's own long shadow: a point looks along the sun to the arch's plane (z -292) and asks whether a leg stands there
float archShade(vec3 p){
  float t = (-292. - p.z) / min(uSunDir.z, -.05);
  float hx = abs(p.x + t * uSunDir.x), hy = p.y + t * uSunDir.y;
  float s = clamp((hy - 5.) / 27.5, 0., 1.);
  float hw = mix(2.3, .9, s), soft = .22 + max(t, 0.) * .014;
  float sh = smoothstep(hw - soft, hw + soft, abs(hx - 9.6 * sqrt(max(1. - s * s, 0.))));
  return mix(1., sh, step(.5, t) * step(4.6, hy) * step(hy, 32.8) * step(.001, uSunK));
}
`;async function ut(t,a,l){const v=w=>t.core.makeRng(t.core.hashSeed("arw-city-"+w+":"+t.seed)),s={towers:v("towers"),corners:v("corners"),trees:v("trees"),squareTrees:v("square-trees"),median:v("median")},i=Ze(s.towers,a),h=s.corners,c=[...i.east,...i.west].flatMap(w=>w.t).filter(w=>w.h>60&&!w.round&&!w.setbacks&&!w.fins&&!w.crown).map(w=>({t:w,key:h(),cut:h()<.5,c:h.range(2.6,4.2)})).sort((w,o)=>w.key-o.key);c.forEach((w,o)=>{o<Math.ceil(c.length*.6)&&(w.t.corner={seg:w.cut?1:4,c:w.cut?w.c:w.c+1.6})});const n=a.sunDir.x,p=a.sunDir.z,m=n<0,b=[];for(const w of m?i.west:i.east)for(const o of w.t){const f=p*(o.x1-o.x0)/Math.max(.05,Math.abs(n));b.push([o.z0-Math.max(0,f),o.z1-Math.min(0,f),m?o.x1:o.x0,o.h])}return a.sunBlocks=b.slice(0,8),a.sunAt=Ke(i.boxes,a),i.lamps=qt(),i.standards=i.lamps.map(([w,o,,,f])=>[w+(w>0?-1.4:1.4),f-.3,o]),i.trees=await Pt(t,s.trees,l,i,s.squareTrees,s.median),i.treesLaid=[...i.trees.list.map(w=>w.slice(0,5)),...Ee().filter(([w,,o])=>Ue(l,w,o)).map(([w,o,f])=>[w,o,f,4.6,1])],i.arch={z:J.z,foot:J.half,leg:J.broad/2,base:J.foot,rise:J.rise},i}function pt(){const t=[],a=[],l=[],v=[],s=[],i=[],h={tris:0,quad(x,c,n,p,m,b,w,o){const f=t.length/3;t.push(x[0],x[1],x[2],c[0],c[1],c[2],n[0],n[1],n[2],p[0],p[1],p[2]);for(let e=0;e<4;e++){const u=Array.isArray(m[0])?m[e]:m;a.push(u[0],u[1],u[2]),v.push(w[0],w[1],w[2]),s.push(o[0],o[1],o[2],o[3])}l.push(b[0],b[1],b[2],b[1],b[2],b[3],b[0],b[3]),i.push(f,f+1,f+2,f,f+2,f+3),h.tris+=2},box(x,c,n,p,m,b,w,o,f,e,u="wesnt"){u.includes("w")&&h.quad([x,n,m],[x,n,b],[x,p,b],[x,p,m],[-1,0,0],[m,n,b,p],w,o),u.includes("e")&&h.quad([c,n,b],[c,n,m],[c,p,m],[c,p,b],[1,0,0],[b,n,m,p],w,o),u.includes("s")&&h.quad([x,n,b],[c,n,b],[c,p,b],[x,p,b],[0,0,1],[x,n,c,p],w,o),u.includes("n")&&h.quad([c,n,m],[x,n,m],[x,p,m],[c,p,m],[0,0,-1],[c,n,x,p],w,o),u.includes("t")&&h.quad([x,p,b],[c,p,b],[c,p,m],[x,p,m],[0,1,0],[x,b,c,m],f||w,e||[0,o[1],3,3])},toGeometry(){const x=new q.BufferGeometry;return x.setAttribute("position",new q.Float32BufferAttribute(t,3)),x.setAttribute("normal",new q.Float32BufferAttribute(a,3)),x.setAttribute("uv",new q.Float32BufferAttribute(l,2)),x.setAttribute("color",new q.Float32BufferAttribute(v,3)),x.setAttribute("fa",new q.Float32BufferAttribute(s,4)),x.setIndex(i),x.computeBoundingSphere(),x}};return h}const vt=`
attribute vec4 fa; attribute vec3 color;
varying vec3 vW, vN, vC; varying vec2 vUv; varying vec4 vFa;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vC = color; vUv = uv; vFa = fa;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,mt=t=>`
varying vec3 vW, vN, vC; varying vec2 vUv; varying vec4 vFa;
${xe}
${t}
// EVERY EDGE OF A WALL'S PATTERN IS TAKEN OVER THE PIXEL'S OWN FOOTPRINT: bandAA is the share of a footprint w (in
// cells) about x that lies in the band a..b of every cell, so a band's edge holds clean however the wall is turned and a
// band too fine to tell runs to its own mean; holeAA is an opening about a cell's middle (half breadths h)
float bandI(float x, float a, float b){ return floor(x) * (b - a) + clamp(fract(x) - a, 0., b - a); }
float bandAA(float x, float a, float b, float w){ return (bandI(x + .5 * w, a, b) - bandI(x - .5 * w, a, b)) / w; }
vec2 holeAA(vec2 q, vec2 h, vec2 w){ return 1. - smoothstep(h - w, h + w, q); }
void main(){
  vec3 n = normalize(vN); vec3 Vd = vW - cameraPosition; float dist = length(Vd); vec3 V = Vd / max(dist, 1e-3);
  float style = floor(vFa.x + .5), seed = floor(vFa.y * 128. + .5) / 128.;
  vec2 cs = vec2(max(vFa.z, .4), max(vFa.w, .4));
  vec2 cell = vUv / cs; vec2 fw = fwidth(cell); float lod = clamp(1.3 - max(fw.x, fw.y) * 1.6, 0., 1.);
  vec2 aw = clamp(fw, vec2(.002), vec2(4.)), bfw = vec2(fwidth(vUv.x), fwidth(vW.y)); float lvw = clamp(fwidth(vUv.y) / .3, .002, 8.), shopK = 1.;
  vec2 id = floor(cell), f = fract(cell);
  float rnd = hash21(id + seed * 311.7), rnd2 = hash21(id * 1.7 + seed * 91.3 + 7.);
  // g: glass share, sp: spandrel or panel share (the rest is surround or stone); avg: the glass share seen from far
  float g = 0., sp = 0., avg = 0., rel = 0., jamb = 0., baseLit = 0.;
  float lant = step(11.5, style) * step(style, 12.5), roofK = step(10.5, style) * step(style, 11.5);
  // a window in stone sits back in its wall: the pane is found along the eye's own line through the opening, so the
  // jambs, the head and the sill show (the tangent along the wall is read from the wall's own metres)
  vec3 dpx = dFdx(vW), dpy = dFdy(vW); vec2 dux = dFdx(vUv), duy = dFdy(vUv);
  vec3 tu = normalize((dpx * duy.y - dpy * dux.y) * sign(dux.x * duy.y - duy.x * dux.y) + vec3(1e-6, 0., 1e-6));
  vec2 po = vec2(dot(V, tu), V.y) / max(-dot(V, n), .25) / cs;
  vec3 surCol = vC, spCol = vC * .55, tint = vec3(.78, .86, .95);
  if (style < .5) { g = 0.; rel = smoothstep(.035, .0, min(f.x, f.y)) * 1.1; }
  else if (style < 1.5) { vec2 q = abs(f - vec2(.5, .54)), q2 = abs(f + po * .42 - vec2(.5, .54)); vec2 o1 = holeAA(q, vec2(.26, .31), aw * .7), o2 = holeAA(q2, vec2(.26, .31), aw * .7), o3 = holeAA(q, vec2(.3, .35), aw * .7); float op = o1.x * o1.y; g = op * o2.x * o2.y; jamb = op - g; avg = .30; rel = o3.x * o3.y * (1. - op); }
  else if (style < 2.5) { float bx = bandAA(cell.x, .035, .965, aw.x); g = bx * bandAA(cell.y, .2, 1., aw.y); sp = bx * bandAA(cell.y, 0., .2, aw.y); avg = .74; spCol = vC * .42; tint = vec3(.72, .84, .98); }
  else if (style < 3.5) { float bx = bandAA(cell.x, .14, .86, aw.x); g = bx * bandAA(cell.y, .16, 1., aw.y); sp = bx * bandAA(cell.y, 0., .16, aw.y); avg = .6; spCol = vC * .5; rel = 1. - bx; tint = vec3(.70, .88, .90); }
  else if (style < 4.5) { vec2 q = abs(f - vec2(.5, .5)), q2 = abs(f + po * .32 - vec2(.5, .5)); vec2 o1 = holeAA(q, vec2(.2, .36), aw * .7), o2 = holeAA(q2, vec2(.2, .36), aw * .7), o3 = holeAA(q, vec2(.24, .4), aw * .7); float op = o1.x * o1.y; g = op * o2.x * o2.y; jamb = op - g; avg = .26; rel = o3.x * o3.y * (1. - op); }
  else if (style < 5.5) { g = bandAA(cell.x, .03, .97, aw.x) * bandAA(cell.y, .3, 1., aw.y); sp = bandAA(cell.y, 0., .3, aw.y); avg = .68; spCol = vC * .5; tint = vec3(1., .80, .56); }
  else if (style < 6.5) { float bx = bandAA(cell.x, .3, .97, aw.x); g = bx * bandAA(cell.y, .12, 1., aw.y); sp = bandAA(cell.y, 0., .12, aw.y) * bandAA(cell.x, .3, 1., aw.x); avg = .58; spCol = vC * .35; tint = vec3(.76, .85, .96); }
  else if (style < 7.5) { g = bandAA(cell.x, .2, .98, aw.x) * bandAA(cell.y, .1, .86, aw.y) * (1. - bandAA(cell.x, .448, .472, aw.x)) * (1. - bandAA(cell.x, .708, .732, aw.x)) * (1. - bandAA(cell.y, .488, .512, aw.y)); sp = bandAA(cell.y, .86, 1., aw.y) * bandAA(cell.x, .2, 1., aw.x); avg = .6; spCol = vC * .62; tint = vec3(.74, .84, .94); }
  else if (lant > .5) { g = bandAA(cell.x, .07, .93, aw.x) * bandAA(cell.y, .05, 1., aw.y); avg = .86; tint = vec3(1., .93, .82); }
  else { g = 0.; }
  // the base of every building that stands on the street: a glazed ground floor of double height (7.4 m), its bays
  // twice the wall's own, a transom at 4.2 m, warm light behind half of its panes
  if (style > .5 && style < 7.5 && abs(n.y) < .5 && vW.y < 7.4 && vW.y > 0. && vW.z > -262.5) {
    float bk = cs.x * (cs.x > 5. ? 1. : 2.); vec2 bc = vec2(vUv.x / bk, vW.y / 7.4), bw = clamp(bfw / vec2(bk, 7.4), vec2(.002), vec2(4.));
    g = bandAA(bc.x, .05, .95, bw.x) * bandAA(bc.y, .07, .93, bw.y) * (1. - bandAA(bc.y, .558, .582, bw.y));
    sp = 0.; rel = 0.; jamb = 0.; avg = .78; tint = vec3(.88, .91, .93); baseLit = 1.;
    rnd = hash21(vec2(floor(bc.x), 7.) + seed * 51.); rnd2 = hash21(vec2(floor(bc.x), 3.) + seed * 17.);
    // north of street B every base is a row of SHOPFRONTS: three panes to the bay between slim mullions, dark glass,
    // every bay lit warm behind (each to its own strength), brightest under its ceiling and dimmer down to the stall
    if (vW.z < ${(Fe+.1).toFixed(1)}) {
      g *= 1. - bandAA(bc.x * 3. + .5, .47, .53, bw.x * 3.);
      shopK = (.45 + .95 * smoothstep(.07, .57, bc.y)) * (.7 + .6 * rnd2); rnd *= .5; tint = vec3(.62, .68, .74);
    }
  }
  g = mix(avg, g, lod); sp *= lod;
  // by the deal of each wall's own number, a glass wall carries a plant floor every eighteen floors (its first by the
  // wall's number): a dark louvred band with no glass, so no tall wall is one grid from foot to top
  float mech = bandAA((cell.y + floor(seed * 18.)) / 18., 0., 1. / 18., aw.y / 18.) * step(1.5, style) * step(style, 6.5) * (1. - step(3.5, style) * step(style, 4.5)) * step(12., vW.y);
  g *= 1. - mech; sp = mix(sp, 1., mech); rel *= 1. - mech;
  // stone, panels and surrounds
  float grain = nz(vUv * .09 + seed) * .5 + nz2(vUv * .9) * .5;
  vec3 alb = mix(surCol, spCol, sp) * (.82 + .36 * grain) * (1. - .22 * rel * lod);
  if (style > 7.5 && style < 8.5) { float pl = nz(vUv * .035 + seed * 3.); alb = mix(vC, vec3(.10, .17, .07), smoothstep(.45, .6, pl)) * (.8 + .4 * grain); }
  float streak = nz(vec2(vUv.x * .21, vUv.y * .012) + seed * 5.);
  alb *= 1. - .2 * smoothstep(.5, .8, streak) * step(.5, style) ;
  alb *= 1. - .5 * jamb * lod;
  alb *= 1. - mech * (.3 + .25 * bandAA(vUv.y / .3, .5, 1., lvw));
  // every roof lower than the flight is a roof at work or a roof garden, dealt in cells of 7 m by the roof's own seed:
  // wet paving, planting beds, glowing skylights, gravel, timber decks; paths of paving run between the cells
  vec2 rc = vW.xz / 7.; vec2 rf = fract(rc), ri = floor(rc); float rl = clamp(1.3 - max(fwidth(rc.x), fwidth(rc.y)) * 1.6, 0., 1.);
  float rk = hash21(ri + seed * 77.), inset = step(.09, rf.x) * step(rf.x, .91) * step(.09, rf.y) * step(rf.y, .91);
  vec2 rs = vW.xz / vec2(.9, .6); vec2 rsf = abs(fract(rs) - .5);
  float rjt = smoothstep(.44, .5, max(rsf.x, rsf.y)) * clamp(1.4 - max(fwidth(rs.x), fwidth(rs.y)) * 3., 0., 1.);
  vec3 pav = vec3(.33, .31, .29) * (.85 + .3 * hash21(floor(rs))) * (1. - .4 * rjt);
  vec3 bed = mix(vec3(.045, .09, .03), vec3(.12, .19, .055), nz2(vW.xz * .8 + seed)) * (.75 + .5 * nz(vW.xz * 2.3));
  vec3 grav = vec3(.21, .205, .2) * (.7 + .6 * nz2(vW.xz * 3.1));
  vec3 deck = vec3(.22, .14, .085) * (.8 + .4 * hash21(vec2(floor(vW.x / .16), ri.y)));
  float isBed = step(rk, .30) * inset * rl * roofK, isSkyL = step(.30, rk) * step(rk, .39) * inset * rl * roofK;
  vec3 ralb = mix(pav, bed, isBed); ralb = mix(ralb, grav, step(.39, rk) * step(rk, .50) * rl); ralb = mix(ralb, deck, step(.50, rk) * step(rk, .60) * inset * rl);
  alb = mix(alb, ralb, roofK);
  // the animals' shadows are deepened (the world's turn must tell) and lie on glass too, as a dimmer mirror
  float ash = arwShade(vW); ash = ash * ash * ash; float lit0 = cityRay(vW + n * .08, uSunDir, 5.);
  float sunVis = lit0 * ash * archShade(vW + n * .3);
  float ndl = min(max(dot(n, uSunDir), 0.), .7) * uSunK;
  vec3 amb = uSkyAmb * (.62 + .38 * n.y) + uGroundAmb * .30 * (1. - n.y) * exp(-max(vW.y, 0.) * .02);
  float inSun = clamp(sunVis * ndl * 2.5, 0., 1.);
  amb *= mix(vec3(1.33, 1.40, 1.64), vec3(1.), inSun);
  if (style < .5) alb *= .88 + .24 * rnd * lod;
  vec3 matte = alb * (amb + uSunCol * ndl * sunVis * .80);
  // GLASS, one rule for every pane: it shows the sky's own colours in the mirrored direction (rose and gold toward the
  // low sun, blue-violet away from it, the cloud's lit edges), dark where a tower of the plan stands in the mirrored
  // ray, more of a mirror the more it is seen along itself. Each pane leans a hair its own way and no sheet is flat,
  // so the mirrored sky breaks from pane to pane and bends a little inside each.
  vec3 tx = normalize(vec3(n.z, 0., -n.x) + vec3(1e-4, 0., 0.));
  vec2 wv = vec2(nz(vUv * .37 + seed * 9.), nz2(vUv * .41 + 3.7)) - .5;
  vec3 gn = normalize(n + (tx * ((rnd - .5) * .05 + wv.x * .035) + vec3(0., 1., 0.) * ((rnd2 - .5) * .05 + wv.y * .035)) * lod);
  vec3 R = reflect(V, gn);
  float fres = .40 + .60 * pow(1. - clamp(dot(-V, gn), 0., 1.), 3.);
  float open = cityRay(vW + n * .6, R, 4.);
  // (the mirrored sky's cloud is read as finely as the wall's own pattern can be told: at its finest on a near wall,
  // so no pane shows it in coarse blots, and coarser, as before, where the panes run together)
  gNzLod = 2.2 * (1. - lod); vec3 sk = arwSky(R, sunVis * open); gNzLod = 0.;
  vec3 opp = (uSkyAmb * .22 + uSunCol * .03) * (.75 + .5 * nz(R.zy * 2.3 + R.x));
  vec3 refl = mix(opp, sk, open);
  vec3 glass = refl * mix(tint, vec3(1.), .45) * fres * (.6 + .4 * mix(1., ash, lit0)) + tint * uSkyAmb * .07 + uSunCol * mix(tint, vec3(1.), .6) * ndl * sunVis * .34;
  // glass turned to the sun carries the sun's own glow where its mirror looks toward it (a broad warm sheen about the
  // mirrored sun, broken from pane to pane by each pane's lean)
  float sg = max(dot(R, uSunDir), 0.); sg *= sg; sg *= sg; sg *= sg;
  glass += uSunCol * mix(tint, vec3(1.), .5) * sg * .16 * sunVis * open * step(.001, ndl) * uSunK;
  // lit rooms behind: warm, each blind at its own height; the glazed base is lit behind half of its panes, a lantern
  // behind all of them
  // (by the deal of each wall's own number: a tower's share of lit panes is its own, one in fourteen to one in five,
  // and on one floor in eight the lights are on along the floor, three panes in five; steady, no clock)
  float tShare = mix(.07, .20, hash21(vec2(seed * 57.3, 1.7))), flOn = step(hash21(vec2(id.y * 1.31, seed * 131.1)), .125);
  float onP = max(step(rnd, mix(tShare, .6, flOn) * (.6 + .8 * uLamps)) * (1. - .75 * inSun), max(baseLit * step(rnd, .5), lant)) * lod;
  float blind = max(smoothstep(-aw.y, .02 + aw.y, f.y - (.2 + .55 * rnd2)), max(baseLit, lant));
  vec3 pane = mix(vec3(1., .76, .46), vec3(1., .88, .70), step(.6, rnd2)) * (.5 + .55 * blind) * (.6 + .5 * hash21(id + 3.3)) * (.6 + .9 * lant) * (1. - .22 * baseLit) * shopK;
  glass = mix(glass, glass * .4 + pane, onP);
  glass = mix(glass, vec3(1., .84, .6) * 1.3, lant * (1. - lod) * .8);
  glass += vec3(1., .80, .55) * avg * .09 * uLamps * (1. - lod) * step(.5, style);
  // from afar, where the panes can no longer be told apart, a few lit rooms still show, in groups of floors: on the far
  // city only (beyond the avenue's own lots, x within 100 m and z from the steps to 345), so that no wall near the line
  // carries blocks coarser than its own panes
  glass += vec3(1., .78, .5) * step(.88, hash21(floor(vUv / vec2(9., 8.)) + seed * 13.)) * (1. - lod) * (.35 + .5 * uLamps) * step(.5, style) * step(style, 7.5) * max(step(100., abs(vW.x)), max(step(vW.z, -262.), step(345., vW.z)));
  vec3 col = mix(matte, glass, g);
  // stone that lies flat under the sky (the terrace, the treads, the plaza's levels, roofs) is wet: slabs of their own
  // tone, puddles, the sky in them, and before the arch the portal's light standing mirrored in the wet
  if ((style < .5 || roofK > .5) && n.y > .9) {
    float pn = nz(vW.xz * .023 + seed) * .6 + nz2(vW.xz * .075) * .4;
    float pud = smoothstep(.5, .63, pn) * (1. - isBed);
    // the terrace holds the rain in its paving's low places as the square does (uPool); no other puddle lies on it
    float onT = step(vW.z, -262.5) * step(4.9, vW.y) * step(vW.y, 5.1);
    float poolT = onT * arwPools(vW.xz, nz2(vW.xz * .06)); pud = mix(pud, poolT, onT);
    float fr = 1. - clamp(dot(-V, gn), 0., 1.); float fr2 = fr * fr; float f5 = .04 + .96 * fr2 * fr2 * fr;
    vec3 wetc = col * (.40 + .20 * rnd * lod) * (1. - .28 * pud) * mix(1., .74, step(vW.z, -262.5));
    // the terrace's paving in two stones, as the square's: bays of 12 m, every other one a shade deeper, between dark
    // bands 1.2 m broad on every bay line
    float bandT =step(abs(fract(vW.x / 12. + .5) - .5), .05) + step(abs(fract(vW.z / 12.) - .5), .05);
    wetc *= (1. - .6 * clamp(bandT, 0., 1.) * onT) * (1. - .16 * mod(floor(vW.x / 12. + .5) + floor(vW.z / 12.), 2.) * onT);
    float rz = min(R.z, -.02); float tz = (-292. - vW.z) / rz; vec3 hit = vW + R * tz;
    float sft = .5 + max(tz, 0.) * .07;
    float pm = smoothstep(6. + sft, 6. - sft, abs(hit.x)) * smoothstep(9. + sft * 2., 9. - sft * 2., abs(hit.y - 15.)) * step(-291.5, vW.z) * step(0., tz) * step(vW.z, -240.);
    wetc = mix(wetc, col, isBed);
    // THE RING IN A PUDDLE, one rule for every puddle: the ring's mirror image tops the mirror's own light up to the
    // four fifths of the wet's ceiling (uWetCap) and never past it,
    // in the ring's own hue, and it is seen through shallow water: the stone's joints and its dark bands stand darker
    // in it. So a puddle before the arch glows warm, shows its paving and its own rim, and never burns out.
    vec4 am = arwMirror(vW, R); vec3 mirB = mix(refl, am.rgb, clamp(am.a, 0., 1.));
    vec3 ringHue = uPortalCol / max(max(uPortalCol.r, uPortalCol.g), max(uPortalCol.b, 1e-3));
    float ringTop = max(uWetCap * .8 - max(mirB.r, max(mirB.g, mirB.b)), 0.);
    vec3 mir = mirB + ringHue * ringTop * pm * (1. - .5 * rel * lod) * (1. - .5 * clamp(bandT, 0., 1.) * onT);
    // (the terrace's dark bands are a rough stone: they mirror a third as much, so its grid tells in the wet too)
    col = mix(wetc, mir, clamp(f5 * mix(.5, 1., pud) + pud * .05 + poolT * .2, 0., 1.) * (1. - isBed) * (1. - .65 * clamp(bandT, 0., 1.) * onT * (1. - poolT)));
  }
  col = mix(col, vec3(1., .82, .58) * (.5 + .4 * uLamps) * (.7 + .3 * step(.04, abs(fract(rc.x * 3.) - .5))), isSkyL);
  vec3 pl = vW - uPortal; col += alb * (1. - g) * uPortalCol * 70. / (dot(pl, pl) + 60.) * max(dot(n, normalize(-pl)), 0.15) * step(vW.z, -255.);
  if ((style < .5 || roofK > .5) && n.y > .9) col = arwCeil(col);
  if (style > 8.5 && style < 9.5) { float on = step(vFa.y, uLampShare); col = mix(vC * .25, vec3(1., .80, .55) * 4.5, on); }
  if (style > 12.5) col = vec3(1., .80, .55) * 3.2;
  if (style > 9.5 && style < 10.5) { float ph = fract(uTime / 26. + vFa.z); float gr = step(ph, .42), am = step(.42, ph) * step(ph, .5), rd = step(.5, ph);
    float which = vFa.y < .25 ? rd : (vFa.y < .75 ? am : gr); vec3 lc = vFa.y < .25 ? vec3(1., .12, .08) : (vFa.y < .75 ? vec3(1., .62, .1) : vec3(.15, 1., .45));
    col = mix(vec3(.02), lc * 3.2, which); }
  gl_FragColor = vec4(arwHaze(col, vW), 1.);
}`;function bt(t,a){return new q.ShaderMaterial({uniforms:t,vertexShader:vt,fragmentShader:mt(a.glsl)})}const A={lime:_("#c6bca6"),granite:_("#958e88"),terra:_("#a9684e"),bronze:_("#5a4634"),steel:_("#8a9aac"),dark:_("#33373e"),conc:_("#a8a49c"),roof:_("#5d5f66"),pale:_("#a8a090"),blue:_("#6f8298"),green:_("#78958c")};function Ze(t,a){const l=c=>Math.round(c*t.range(.93,1.07)),v=()=>t.range(.05,.95),s=(c,n)=>c+(n-c)*.75,i=[{n:"E1",z0:150,z1:300,pod:16,px:72,podCol:A.lime,t:[{x0:32,x1:66,z0:160,z1:290,h:l(120),style:1,col:A.lime,bay:3.4,fl:3.9,crown:3}]},{n:"E2",z0:60,z1:150,pod:14,px:66,podCol:A.granite,t:[{x0:33,x1:57,z0:68,z1:142,h:l(180),style:3,col:A.steel,bay:3,fl:4,fins:1}]},{n:"E3",z0:22,z1:60,pod:0,px:60,podCol:A.terra,t:[{x0:26,x1:60,z0:22,z1:60,h:l(45),style:4,col:A.terra,bay:3.2,fl:3.75,garden:1}]},{n:"E4",z0:-50,z1:-8,pod:0,px:44,podCol:A.pale,plaza:1,t:[{x0:44,x1:82,z0:-48,z1:-12,h:l(150),style:2,col:A.green,bay:1.6,fl:3.9,round:1}]},{n:"E5",z0:-96,z1:-50,pod:18,px:72,podCol:A.bronze,t:[{x0:31,x1:66,z0:-93,z1:-53,h:l(200),style:5,col:A.bronze,bay:1.8,fl:3.85,setbacks:1}]},{n:"E6",z0:-222,z1:-130,pod:20,px:92,podCol:A.lime,roofGarden:1,t:[{x0:64,x1:84,z0:-162,z1:-138,h:l(110),style:2,col:A.blue,bay:1.5,fl:3.8},{x0:66,x1:86,z0:-216,z1:-192,h:l(140),style:6,col:A.pale,bay:2.4,fl:3.8}]},{n:"E7",z0:-262,z1:-240,pod:0,px:56,podCol:A.granite,t:[{x0:26,x1:56,z0:-262,z1:-240,h:l(24),style:1,col:A.granite,bay:3.6,fl:4}]}],h=[{n:"W0",z0:262,z1:330,pod:10,px:-64,podCol:A.granite,t:[{x0:-58,x1:-40,z0:262,z1:s(262,330),h:l(140),style:5,col:A.bronze,bay:1.8,fl:3.9}]},{n:"W1",z0:150,z1:240,pod:10,px:-64,podCol:A.conc,t:[{x0:-58,x1:-40,z0:150,z1:s(150,240),h:l(160),style:2,col:A.steel,bay:1.5,fl:3.9}]},{n:"W2",z0:35,z1:115,pod:10,px:-64,podCol:A.pale,t:[{x0:-58,x1:-40,z0:35,z1:s(35,115),h:l(130),style:6,col:A.pale,bay:2.6,fl:3.8}]},{n:"W3",z0:-96,z1:-8,pod:8,px:-64,podCol:A.granite,t:[{x0:-58,x1:-40,z0:-96,z1:s(-96,-8),h:l(170),style:2,col:A.blue,bay:3,fl:4}]},{n:"W5",z0:-262,z1:-240,pod:0,px:-44,podCol:A.lime,t:[{x0:-44,x1:-26,z0:-262,z1:-240,h:l(22),style:4,col:A.lime,bay:3.4,fl:3.7}]},{n:"WS1",z0:-178,z1:-130,pod:0,px:-160,podCol:A.conc,t:[{x0:-160,x1:-124,z0:-178,z1:-130,h:l(26),style:1,col:A.conc,bay:3.2,fl:3.6}]},{n:"WS2",z0:-222,z1:-184,pod:0,px:-160,podCol:A.terra,t:[{x0:-164,x1:-124,z0:-222,z1:-184,h:l(31),style:4,col:A.terra,bay:3.2,fl:3.6}]}];for(const c of[...i,...h]){c.seed=v();for(const n of c.t)n.seed=v()}const x=[];for(const c of i){c.pod>0&&x.push([26,c.z0,c.px,c.z1,c.pod]);for(const n of c.t)x.push([n.x0,n.z0,n.x1,n.z1,n.h])}for(const c of h){c.pod>0&&x.push([c.px,c.z0,-26,c.z1,c.pod]);for(const n of c.t)x.push([n.x0,n.z0,n.x1,n.z1,n.h])}return{east:i,west:h,boxes:x}}function Ke(t,a){const l=a.sunDir;return(v,s,i,h=5)=>{if(a.sunK<=0)return 0;let x=1;for(const c of t){let n=-1e9,p=1e9;const m=[c[0],-1,c[1]],b=[c[2],c[4],c[3]],w=[v,s,i],o=[l.x,l.y,l.z];for(let f=0;f<3;f++){const e=1/(Math.abs(o[f])<1e-4?o[f]<0?-1e-4:1e-4:o[f]),u=(m[f]-w[f])*e,z=(b[f]-w[f])*e;n=Math.max(n,Math.min(u,z)),p=Math.min(p,Math.max(u,z))}x*=1-Ne((p-Math.max(n,0))/h,0,1)}return x}}function xt(t,a){for(const l of[...a.east,...a.west]){const v=l.n[0]==="E";if(l.pod>0){const s=v?26:l.px,i=v?l.px:-26;t.box(s,i,0,l.pod,l.z0,l.z1,l.podCol,l.z1<=Fe?[1,l.seed,3.2,3.7]:[7,l.seed,6.4,l.pod/2],A.roof,[11,l.seed,3,3])}for(const s of l.t){const i=l.pod>0?l.pod:0;s.round||s.setbacks||s.corner||t.box(s.x0,s.x1,i,s.h,s.z0,s.z1,s.col,[s.style,s.seed,s.bay,s.fl],s.garden?A.terra:A.roof,[s.h<34?11:0,s.seed,3,3])}}}const wt=`
varying vec3 vW;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,gt=t=>`
varying vec3 vW;
${xe}
${t}
float band(float x, float a, float b){ return step(a, x) * step(x, b); }
uniform vec3 uSqLamp[${Le}];
void main(){
  vec3 p = vW; vec3 Vd = p - cameraPosition; float dist = length(Vd); vec3 V = Vd / max(dist, 1e-3);
  float ax = abs(p.x), z = p.z;
  float fwp = max(fwidth(p.x), fwidth(p.z));
  // where we are: the avenue between the faces, a cross street, the square, or the far city's ground
  float inAve = step(ax, 26.) * step(-262., z);
  float cA = band(z, -8., 22.), cB = band(z, -130., -96.), cC = band(z, -240., -222.);
  float cross = max(cA, max(cB, cC));
  float crossRoad = max(band(z, -4., 18.), max(band(z, -126., -100.), band(z, -237., -225.)));
  float sq = band(p.x, -120., -26.) * band(z, -215., -135.);
  float road = max(inAve * band(ax, 4., 15.) * step(-237., z), crossRoad * step(-262., z)) * (1. - sq);
  float median = inAve * step(ax, 4.) * (1. - crossRoad) * step(${We.toFixed(1)}, z);
  float far = (1. - inAve) * (1. - cross) * (1. - sq);
  // far streets: a plain grid of dark streets between pale blocks
  vec2 gq = abs(fract(vec2(p.x + 13., z + 4.) / vec2(92., 118.)) - .5) * vec2(92., 118.);
  float farRoad = far * step(min(gq.x, gq.y), 7.) * step(26.5, ax);
  road = max(road, farRoad);
  // materials
  float n1 = nz(p.xz * .013), n2 = nz2(p.xz * .06), n3 = nz(p.xz * .31 + .37);
  vec3 asph = vec3(.028, .031, .04) * (.8 + .5 * n3);
  vec2 sl = p.xz / vec2(1.2, .6); sl.x += .5 * floor(sl.y); vec2 sf = abs(fract(sl) - .5);
  float joint = smoothstep(.46, .5, max(sf.x, sf.y)) * clamp(1.4 - fwp * 3., 0., 1.);
  vec3 slab = vec3(.36, .335, .30) * (.86 + .28 * hash21(floor(sl))) * (1. - .45 * joint);
  vec2 bq = p.xz / 3.; vec2 bf = abs(fract(bq) - .5);
  float bj = smoothstep(.47, .5, max(bf.x, bf.y)) * clamp(1.4 - fwp, 0., 1.);
  // the square's paving in two stones: bays of 12 by 10 m of a pale honed stone in slabs of 3 m, every other bay a
  // shade deeper, between bands 1.2 m broad of a dark flamed stone on every bay line (x = 12 k, z = 10 k); the benches,
  // planters, standards and vents stand by this grid
  vec2 by = vec2(p.x / ${ve[0].toFixed(1)}, z / ${ve[1].toFixed(1)}); vec2 bd = abs(fract(by + .5) - .5) * vec2(${ve[0].toFixed(1)}, ${ve[1].toFixed(1)});
  float be = clamp(fwp, .02, .55);
  float bandS = mix(.21, 1. - smoothstep(.6 - be, .6 + be, min(bd.x, bd.y)), clamp(2.2 - fwp * 1.2, 0., 1.));
  float chk = mod(floor(by.x) + floor(by.y), 2.);
  vec3 sqc = mix(vec3(.30, .28, .25), vec3(.235, .222, .21), chk) * (.9 + .2 * hash21(floor(bq))) * (1. - .4 * bj);
  sqc = mix(sqc, vec3(.075, .08, .095) * (.85 + .3 * n3), bandS);
  vec3 soil = mix(vec3(.09, .075, .05), vec3(.07, .12, .045), smoothstep(.35, .6, n2)) * (.8 + .5 * n3);
  vec3 alb = mix(slab, sqc, sq);
  alb = mix(alb, asph, road);
  // plain lane lines: two dashed lines and two edge lines to each carriageway
  float lane = inAve * (1. - cross) * step(-222., z);
  float dash = step(fract(z / 9.), .34);
  float ln = (smoothstep(.16, .08, abs(ax - 7.7)) + smoothstep(.16, .08, abs(ax - 11.3))) * dash + smoothstep(.14, .07, abs(ax - 4.35)) + smoothstep(.14, .07, abs(ax - 14.65));
  alb = mix(alb, vec3(.62, .62, .58), clamp(ln, 0., 1.) * lane * .85 * clamp(1.5 - fwp * 2., 0., 1.));
  float kerb = inAve * (1. - crossRoad) * step(-237., z) * (smoothstep(.22, .12, abs(ax - 15.2)) + smoothstep(.22, .12, abs(ax - 3.8)) * step(-222., z));
  alb = mix(alb, soil, median * step(ax, 3.6));
  alb = mix(alb, vec3(.55, .53, .5), clamp(kerb, 0., 1.));
  // wet: a film nearly everywhere, puddles along the kerbs, in dips and in the joints; dry under the trees;
  // on the square's honed paving the water stands broad and shallow with a clean edge
  float underTree = inAve * (1. - cross) * (smoothstep(5.5, 3., abs(ax - 17.5)) * .7 + smoothstep(7., 4., ax)) * smoothstep(.3, .6, n2 + n1 * .5);
  float gutter = road * smoothstep(1.6, .2, abs(ax - 14.4)) * inAve;
  float pud = smoothstep(.52 + .03 * sq, .62 - .04 * sq, n1 * .55 + n2 * .45 + gutter * .34 + joint * .1 * (1. - road) + sq * .06) * (1. - median);
  // THE SQUARE HOLDS THE RAIN in its paving's low places: broad shallow pools laid by the seed (uPool), clear of every
  // bench, planter, tree pit and vent; no other puddle lies on the square, and the paving between the pools is wet and
  // darker. A pool is the stone's own wet at its smoothest: it mirrors the sky and whatever stands over it.
  float rain = sq * arwPools(p.xz, n2);
  pud = mix(pud, rain, sq);
  float film = clamp(.55 + .6 * (n2 - .4) + road * .2 - underTree * .7, 0.05, 1.) * (1. - .8 * median);
  float wet = clamp(max(pud, film * .62), 0., 1.);
  alb *= (1. - .45 * wet) * (1. - .2 * sq * (1. - rain));
  // light by place: the sun through the buildings, the animals' shadows, the sky, the portal's light
  float ash = arwShade(p); ash = ash * ash * ash;
  float sunVis = cityRay(p + vec3(0., .1, 0.), uSunDir, 7.) * ash * archShade(p);
  vec3 amb = uSkyAmb * (.80 - .25 * inAve * smoothstep(8., 3., abs(ax - 17.5)) * (1. - cross)) * mix(vec3(1.31, 1.36, 1.56), vec3(1.), sunVis);
  vec3 pl = p - uPortal; float pd2 = dot(pl, pl);
  vec3 portalL = uPortalCol * 60. / (pd2 + 80.) * step(-340., z);
  vec3 dif = alb * (amb + uSunCol * uSunK * (min(uSunDir.y, .25) * 1.7 + .08) * sunVis + portalL);
  // the mirror: broken and soft, strongest at grazing angles; puddles lie flat, the film is rough
  vec2 rip = (vec2(nz(p.xz * .9 + uTime * .02), nz2(p.xz * .9 - uTime * .017)) - .5) * mix(.16, .012, pud);
  vec3 nn = normalize(vec3(rip.x, 1., rip.y));
  vec3 R = reflect(V, nn); R.y = abs(R.y) + .002;
  float cosv = clamp(dot(-V, nn), 0., 1.); float fr = 1. - cosv; float fr2 = fr * fr; float fres = .03 + .97 * fr2 * fr2 * fr;
  float open = cityRay(p + vec3(0., .2, 0.), R, 5.);
  gNzLod = mix(4.2, 2., pud); vec3 sk = arwSky(R, sunVis * open); gNzLod = 0.;
  vec3 opp = (uSkyAmb * .26 + uSunCol * .04) * (.8 + .4 * nz(R.xz * 2.1));
  vec3 refl = mix(opp, sk, open);
  vec4 am = arwMirror(p, R); refl = mix(refl, am.rgb, clamp(am.a, 0., 1.));
  // the lamp standards of both kerbs: a warm pool under each lit head and its long smear in the wet
  float lk0 = floor((z - 24.) / 30. + .5); float sideL = p.x < 0. ? -1. : 1.; vec3 lampC = vec3(1., .78, .50);
  float smear = 0., pool = 0.;
  for (int j = -3; j <= 3; j++) {
    float lk = lk0 + float(j), lz = 24. + lk * 30.;
    for (int q = 0; q < 2; q++) {
      float sd = q == 0 ? -1. : 1.; float on = lampOn(lk, sd) * lampHere(lz);
      vec3 Lp = vec3(sd * 16.1, 8.7, lz); vec3 toL = Lp - p; float al = dot(toL, R);
      vec3 off = toL - R * al; float along = max(al, .5);
      float dv = off.y / (along * .30 + .4), dh = length(off.xz) / (along * .035 + .28);
      smear += on * step(0., al) * exp(-(dv * dv + dh * dh)) * 26. / (along + 12.);
      vec2 dl = toL.xz; pool += on * exp(-dot(dl, dl) / 46.);
    }
  }
  dif += alb * lampC * pool * 1.5 * inAve;
  refl += lampC * smear * 5. * inAve;
  // the square's standards (heads 7.7 m up): the same pool under each lit head and its smear in the wet stone
  if (sq > .5) {
    float poolS = 0., smearS = 0.;
    for (int j = 0; j < ${Le}; j++) {
      vec3 Lq = uSqLamp[j]; float on = step(Lq.z, uLampShare);
      vec3 toL = vec3(Lq.x, 7.7, Lq.y) - p; float al = dot(toL, R);
      vec3 off = toL - R * al; float along = max(al, .5);
      float dv = off.y / (along * .30 + .4), dh = length(off.xz) / (along * .035 + .28);
      smearS += on * step(0., al) * exp(-(dv * dv + dh * dh)) * 26. / (along + 12.);
      vec2 dl = toL.xz; poolS += on * exp(-dot(dl, dl) / 40.);
    }
    dif += alb * lampC * poolS * 1.5; refl += lampC * smearS * 5.;
  }
  float drain = road * inAve * step(abs(ax - 14.55), .28) * step(abs(fract(z / 15.) - .5), .03) * (1. - cross);
  dif *= 1. - .8 * drain;
  float nearWet = max(max(inAve, cross * step(ax, 240.)), sq);
  // (the flamed bands are rough: they mirror a third as much as the honed bays, so the grid tells in the wet too)
  float gloss = mix(wet * (.72 + .5 * sq), 1., pud) * mix(.12, 1., nearWet) * (1. - .65 * sq * bandS * (1. - rain));
  vec3 col = mix(dif, refl * 1.2, clamp(fres * gloss + pud * .09 * nearWet + rain * .2, 0., 1.));
  col += uPortalCol * pud * 14. / (pd2 + 120.) * step(-340., z) * nearWet;
  col = arwCeil(col);
  gl_FragColor = vec4(arwHaze(col, p), 1.);
}`,yt=`
varying vec3 vDir;
void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(position * 3000. + cameraPosition, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,zt=`
varying vec3 vDir;
${xe}
void main(){ vec3 d = normalize(vDir); gl_FragColor = vec4(arwSky(d, 1.), 1.); }`,ee=-262,he=-330,me=1400,ge=1400,te=-26,ye=60,Qe=4400,Mt=380,qe=560,Ye=[[16,520,900,150,260,30,52],[22,900,1500,200,340,36,66],[28,1500,2600,260,460,48,96]],ze=.14,kt=1.75;function At(t){const a=[0,1,2].map(()=>Array.from({length:64},()=>t())),l=Array.from({length:1024},()=>t()),v=[t(),t(),t(),t()],s=(e,u)=>{const z=e.length,W=(u%z+z)%z,T=Math.floor(W),R=W-T,M=R*R*(3-2*R);return e[T]+(e[(T+1)%z]-e[T])*M},i=(e,u)=>s(e,u)*.6+s(e,u*2.3+17)*.28+s(e,u*5.1+41)*.12,h=(e,u)=>{const z=(e%32+32)%32,W=(u%32+32)%32,T=Math.floor(z),R=Math.floor(W),M=z-T,S=W-R,k=M*M*(3-2*M),r=S*S*(3-2*S),d=l[R*32+T],y=l[R*32+(T+1)%32],g=l[(R+1)%32*32+T],C=l[(R+1)%32*32+(T+1)%32];return ae(ae(d,y,k),ae(g,C,k),r)},x=(e,u)=>u>=ee&&e>=he&&e<=me||Math.abs(e)<=ye&&u>=-330&&u<=ee,c=(e,u)=>Math.min(Math.hypot(Math.max(he-e,e-me,0),Math.max(ee-u,0)),Math.hypot(Math.max(Math.abs(e)-ye,0),Math.max(-330-u,u-ee,0))),n=(e,u)=>Math.atan2(e,-(u+292)),p=(e,u)=>Math.max(c(e,u),Math.hypot(e,u+292)-ye),m=Ye[2][2]+100,b=e=>ae(Mt,m,ue(ze-.75,ze,e)),w=e=>ae(qe,m,ue(ze-.35,ze,e)),o=(e,u)=>{const z=n(e,u),W=p(e,u)-b(z),T=(h(e/180,u/180)-.5)*14+(h(e/57+9.1,u/57+3.7)-.5)*5;if(W<=0)return te+T*.12;const R=50+85*i(a[0],z*2.9+7),M=90+100*i(a[1],z*4.5+3),S=90+90*i(a[2],z*6+11),k=ue(0,450,W);return te+60*k+40*ue(450,2600,W)+R*ue(350,800,W)*(1-.6*ue(800,1350,W))+M*ue(1250,2e3,W)*(1-.5*ue(2e3,2600,W))+S*ue(2500,3300,W)+T*(.12+.88*k)};return{height:(e,u)=>Math.min(o(e,u),c(e,u)*.5-3),dist:p,bearing:n,valleyW:b,townEdge:w,inside:x,bluffDist:c,seedUV:v,sheds:[]}}const St=`
attribute vec4 aLaw; attribute float aKind; attribute vec3 color;
varying vec3 vW, vN, vCol; varying vec4 vLaw; varying float vKind;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vN = normal; vCol = color; vLaw = aLaw; vKind = aKind; gl_Position = projectionMatrix * viewMatrix * wp; }`,Ct=`
varying vec3 vW, vN, vCol; varying vec4 vLaw; varying float vKind;
${xe}
uniform vec4 uLand;
void main(){
  vec3 p = vW, N = normalize(vN);
  float fw = max(fwidth(p.x), fwidth(p.z));
  vec2 wq = vec2(abs(N.x) > .5 ? p.z : p.x, p.y) / vec2(2.8, 2.9);
  float wlod = clamp(1.5 - max(fwidth(wq.x), fwidth(wq.y)) * 2.2, 0., 1.);
  float sun = vLaw.z, ndl = clamp(dot(N, uSunDir), 0., 1.);
  vec3 amb = uSkyAmb * (.55 + .30 * N.y) * mix(vec3(1.31, 1.36, 1.56), vec3(1.), sun);
  vec3 alb, glow = vec3(0.);
  if (vKind > .5) {
    // a house or a shed of the town: plain walls with a few lit windows, a tiled or a flat roof
    alb = vCol;
    if (vKind < 1.5) {
      vec2 wi = floor(wq), wf = fract(wq);
      float win = step(.24, wf.x) * step(wf.x, .76) * step(.30, wf.y) * step(wf.y, .78);
      float share = .14 * (.6 + .8 * uLamps), lit = step(hash21(wi + vLaw.x * 91.), share);
      alb = mix(alb, vec3(.03, .035, .05), win * wlod * (1. - lit));
      glow = vec3(1., .78, .5) * mix(.27 * share, win * lit, wlod) * 1.5;
    }
  } else {
    float s = vLaw.x, d = vLaw.y;
    float nA = nz(p.xz * .0019 + uLand.xy), nB = nz2(p.xz * .0083 + uLand.zw), nC = nz(p.xz * .037 + uLand.yx), nD = nz2(p.xz * .19 + uLand.wz);
    // the law's belts, their edges uneven: the town on the valley floor near the bluff, woods from the upper slope on
    float town = (1. - smoothstep(vLaw.w - 130., vLaw.w, s + (nA - .5) * 190.)) * (1. - smoothstep(-70., -20., d));
    float wood = smoothstep(280., 400., d + (nB - .5) * 150.);
    // FIELDS: a patchwork of plots, each with a crop of its own; a hedge round every plot, a tree line round some, small woods
    vec2 fq = p.xz / vec2(88., 124.) + vec2(nA, nB) * .35; vec2 fi = floor(fq), ff = abs(fract(fq) - .5);
    float fk = hash21(fi + uLand.xy * 61.), fk2 = hash21(fi + uLand.zw * 47. + 3.1);
    vec3 field = mix(vec3(.075, .105, .04), vec3(.20, .165, .085), step(.42, fk));
    field = mix(field, vec3(.085, .066, .05), step(.68, fk));
    field = mix(field, vec3(.10, .14, .05), step(.86, fk));
    field *= .86 + .28 * nC;
    float lodF = clamp(1.6 - fw / 9., 0., 1.);
    float hedge = smoothstep(.455, .48, max(ff.x, ff.y)) * lodF;
    float line = smoothstep(.43, .47, max(ff.x, ff.y)) * step(.55, fk2) * lodF;
    float copse = smoothstep(.62, .7, nB + nC * .3) * step(.3, fk2);
    vec3 green = vec3(.022, .042, .020) * (.7 + .8 * nD);
    alb = mix(field, green, clamp(max(max(hedge, line), copse), 0., 1.));
    // WOODS on the hills: crowns in dark greens, the first yellow of the season, a few clearings low down
    vec3 woodc = mix(vec3(.020, .040, .020), vec3(.045, .062, .026), nC) * (.6 + .9 * nD);
    woodc = mix(woodc, vec3(.11, .085, .03), smoothstep(.66, .8, nD) * .5);
    float clearing = smoothstep(.7, .78, nB) * (1. - smoothstep(900., 1400., d));
    alb = mix(alb, mix(woodc, field, clearing), wood);
    // THE TOWN: streets in two directions, plots with gardens and yards between them
    vec2 tq = p.xz / vec2(56., 44.); vec2 tf = fract(tq);
    float lodT = clamp(1.6 - fw / 5., 0., 1.);
    float street = max(step(tf.x, .125), step(tf.y, .136));
    float pk = hash21(floor(p.xz / 14.) + uLand.zw * 29.);
    vec3 plot = mix(vec3(.060, .095, .038), vec3(.17, .16, .14), step(.62, pk)) * (.8 + .4 * nD);
    plot = mix(plot, green, step(.86, pk));
    vec3 townc = mix(plot, vec3(.038, .040, .048), street * mix(.35, 1., lodT));
    alb = mix(alb, townc, town);
    // the town's street lamps: a lamp stands at a share of the corners, and of those the hour's share is lit; each lays
    // a warm pool on its street (drawn no finer than the screen can hold it)
    vec2 cq = floor(tq + .5); vec2 dl = p.xz - (cq * vec2(56., 44.) + vec2(3.5, 3.));
    float has = step(hash21(cq + uLand.xy * 83.), .6) * step(hash21(cq + uLand.zw * 71. + 9.7), uLampShare);
    float sg = 55. + fw * fw * .5;
    glow = vec3(1., .78, .5) * has * town * exp(-dot(dl, dl) / sg) * (55. / sg) * 1.6 * (alb * 2.5 + .25);
  }
  vec3 col = alb * (amb + uSunCol * uSunK * ndl * sun * 1.15) + glow;
  gl_FragColor = vec4(arwHaze(col, p), 1.);
}`;async function Lt(t,a,l,v,s,i){const h=[],x=[],c=[],n=[],p=[],m=[],b=Math.hypot(l.sunDir.x,l.sunDir.z)||1,w=l.sunDir.x/b,o=l.sunDir.z/b,f=l.sunDir.y/b,e=(B,L,V)=>{if(!(l.sunK>0))return 0;let P=1;for(let K=1,E=0;K<=16&&P>0;K++){E+=40*K;const Z=B+w*E,U=V+o*E,F=L+2+f*E;if(F>470)break;P=Math.min(P,ue(-4,14,F-(a.inside(Z,U)?0:a.height(Z,U))))}return P},u=196,z=Math.atan2(he,-(ge+292)),W=Math.atan2(me,-(ee+292)),T=[0,.12,.3,.52,.76,1],R=[70,150,240,340,450,560,680,800,930,1080,1220,1350,1500,1700,1850,2e3,2200,2400,2600,2850,3100,3300,3550],M=T.length+R.length;for(let B=0;B<=u;B++){const L=ae(z,W,B/u),V=Math.sin(L),P=-Math.cos(L);let K=0;for(let D=Qe;D>0;D-=4)if(a.inside(V*D,-292+P*D)){K=D;break}const E=D=>a.dist(V*D,-292+P*D),Z=D=>{let H=K,Q=Qe;if(E(Q)<=D)return Q;for(let O=0;O<28;O++){const ie=(H+Q)/2;E(ie)<D?H=ie:Q=ie}return(H+Q)/2},U=E(K),F=a.valleyW(L);for(let D=0;D<M;D++){const H=D<T.length?ae(Math.min(U,F),F,T[D]):F+R[D-T.length],Q=D===0?Math.max(0,K-.5):Z(H),O=V*Q,ie=-292+P*Q,Me=a.height(O,ie),$=6,Y=(a.height(O+$,ie)-a.height(O-$,ie))/(2*$),ke=(a.height(O,ie+$)-a.height(O,ie-$))/(2*$),oe=Math.hypot(Y,1,ke);h.push(O,Me,ie),x.push(-Y/oe,1/oe,-ke/oe),c.push(0,0,0),p.push(0);const ne=a.dist(O,ie);n.push(ne,ne-F,e(O,Me,ie),a.townEdge(L))}B%12===11&&await t.yield()}for(let B=0;B<u;B++)for(let L=0;L<M-1;L++){const V=B*M+L,P=V+M;m.push(V,P+1,V+1,V,P,P+1)}const S=(B,L,V,P,K,E,Z,U)=>{const F=h.length/3;for(const D of[B,L,V,P])h.push(D[0],D[1],D[2]),x.push(K[0],K[1],K[2]),c.push(E[0],E[1],E[2]),p.push(Z),n.push(U[0],0,U[1],0);m.push(F,F+1,F+2,F,F+2,F+3)},k=(B,L,V,P,K,E,Z,U)=>{S([B,V,K],[B,V,E],[B,P,E],[B,P,K],[-1,0,0],Z,1,U),S([L,V,E],[L,V,K],[L,P,K],[L,P,E],[1,0,0],Z,1,U),S([B,V,E],[L,V,E],[L,P,E],[B,P,E],[0,0,1],Z,1,U),S([L,V,K],[B,V,K],[B,P,K],[L,P,K],[0,0,-1],Z,1,U)},r=[A.lime,A.pale,A.conc,A.terra,A.granite],d=[_("#5a3a2e"),_("#4a4a52"),_("#6b4a3a"),_("#3c4044")],y=[_("#22381a"),_("#2c4620"),_("#384a1e"),_("#56501e")],g=(B,L,V,P,K,E,Z)=>{const U=h.length/3,F=L+(V-L)*.45;for(const D of[[B,V,P,0,1,0],[B,L,P,0,-1,0],[B+K,F,P,1,0,0],[B,F,P+K,0,0,1],[B-K,F,P,-1,0,0],[B,F,P-K,0,0,-1]])h.push(D[0],D[1],D[2]),x.push(D[3],D[4],D[5]),c.push(E[0],E[1],E[2]),p.push(2),n.push(Z[0],0,Z[1],0);for(let D=0;D<4;D++){const H=U+2+D,Q=U+2+(D+3)%4;m.push(U,H,Q,U+1,Q,H)}},C=.72*Math.min(1,i),N=Math.ceil((qe+ye+56)/56),G=Math.floor((-292-qe-ye-44)/44),j=Math.ceil(ee/44);for(let B=-N;B<N;B++){for(let L=G;L<j;L++)for(let V=0;V<4;V++){const P=s(),K=s.range(9,15),E=s.range(7,10.5),Z=s.range(5.5,9.5),U=s.range(-2.5,2.5),F=s.range(-2,2),D=r[Math.floor(s()*r.length)],H=d[Math.floor(s()*d.length)],Q=s(),O=s.range(2.2,3.4),ie=s()<.4,Me=[0,1].map(()=>[s()<.5?-1:1,s.range(-3.5,3.5),s.range(6,11.5),s.range(.36,.5),y[Math.floor(s()*y.length)],s()]),$=B*56+20+V%2*24+U,Y=L*44+16.25+(V>1?18.5:0)+F,ke=a.bearing($,Y);if(a.bluffDist($,Y)<18||a.dist($,Y)>Math.min(qe,a.valleyW(ke))-50)continue;for(let re=0;re<2;re++){const[He,$e,Ae,it,ct,ft]=Me[re],Te=Ae*it,Re=re===0?$+He*(K/2+Te+1):$+$e,Be=re===0?Y+$e:Y+He*(E/2+Te+1),Pe=a.height(Re,Be);g(Re,Pe+Ae*.2,Pe+Ae,Be,Te,ct,[ft,e(Re,Pe+Ae,Be)])}if(P>C)continue;const oe=$-K/2,ne=$+K/2,fe=Y-E/2,de=Y+E/2,rt=te-1.5,X=te+Z,le=X+O,pe=[Q,e($,X,Y)];if(k(oe,ne,rt,X,fe,de,D,pe),ie){const re=Math.hypot(O,K/2);S([oe,X,fe],[oe,X,de],[$,le,de],[$,le,fe],[-O/re,K/2/re,0],H,2,pe),S([ne,X,de],[ne,X,fe],[$,le,fe],[$,le,de],[O/re,K/2/re,0],H,2,pe),S([oe,X,de],[ne,X,de],[$,le,de],[$,le,de],[0,0,1],D,1,pe),S([ne,X,fe],[oe,X,fe],[$,le,fe],[$,le,fe],[0,0,-1],D,1,pe)}else{const re=Math.hypot(O,E/2);S([oe,X,de],[ne,X,de],[ne,le,Y],[oe,le,Y],[0,E/2/re,O/re],H,2,pe),S([oe,le,Y],[ne,le,Y],[ne,X,fe],[oe,X,fe],[0,E/2/re,-O/re],H,2,pe),S([oe,X,fe],[oe,X,de],[oe,le,Y],[oe,le,Y],[-1,0,0],D,1,pe),S([ne,X,de],[ne,X,fe],[ne,le,Y],[ne,le,Y],[1,0,0],D,1,pe)}}(B+N)%6===5&&await t.yield()}for(const[B,L,V,P,K,E,Z]of a.sheds){const U=[Z,e(B,te+K,L)],F=B-V/2,D=B+V/2,H=L-P/2,Q=L+P/2,O=te+K;k(F,D,te-1.5,O,H,Q,E,U),S([F,O,Q],[D,O,Q],[D,O,H],[F,O,H],[0,1,0],[E[0]*.5,E[1]*.5,E[2]*.52],2,U)}await t.yield();const I=new q.BufferGeometry;I.setAttribute("position",new q.Float32BufferAttribute(h,3)),I.setAttribute("normal",new q.Float32BufferAttribute(x,3)),I.setAttribute("color",new q.Float32BufferAttribute(c,3)),I.setAttribute("aLaw",new q.Float32BufferAttribute(n,4)),I.setAttribute("aKind",new q.Float32BufferAttribute(p,1)),I.setIndex(m),I.computeBoundingSphere(),v.uLand={value:new q.Vector4(a.seedUV[0],a.seedUV[1],a.seedUV[2],a.seedUV[3])};const se=new q.Mesh(I,new q.ShaderMaterial({uniforms:v,vertexShader:St,fragmentShader:Ct}));return se.frustumCulled=!1,{mesh:se,triangles:m.length/3}}async function to(t,a={}){const l=t.core,v=F=>l.makeRng(l.hashSeed("arw-city-"+F+":"+t.seed)),s={noise:v("noise"),far:v("far"),lamps:v("lamps"),traffic:v("traffic"),square:v("square"),leaves:v("leaves"),sky:v("sky"),garden:v("garden"),birds:v("birds"),farEast:v("far-east"),roofs:v("roofs"),parked:v("parked"),tubs:v("tubs"),lowland:v("lowland"),squareLamps:v("square-lamps"),tops:v("tops"),pools:v("pools")},i=a.env||dt(t.vary&&t.vary.hour),h=a.animals||{glsl:"float arwShade(vec3 p){ return 1.; } vec4 arwMirror(vec3 p, vec3 r){ return vec4(0.); } float arwStir(vec3 p){ return 0.; }",uniforms:{}},x=a.path,c=t.quality&&t.quality.detail?t.quality.detail:1,n=t.vary&&t.vary.density||1,p=new q.Group;p.name="arw-city";const m=[];let b=0,w=0;const o=(F,D)=>(p.add(F),b+=D,w+=1,F),f=a.plan||await ut(t,i,x),e=Ke(f.boxes,i);i.sunAt=e;const u=At(s.lowland),z=await ht(s.noise,t);await t.yield();const W=[],T=[];for(let F=0;F<Ce;F++){const D=f.boxes[F];W.push(D?new q.Vector4(D[0],D[1],D[2],D[3]):new q.Vector4(9e4,9e4,9e4,9e4)),T.push(D?D[4]:-2)}const R=new q.Vector2(i.sunDir.x,i.sunDir.z).normalize(),M={tNoise:{value:z},uTime:{value:0},uSunDir:{value:i.sunDir.clone()},uSunCol:{value:i.sunColor.clone()},uSunAz:{value:R},uSunK:{value:i.sunK>0?1:0},uZen:{value:i.zen},uMid:{value:i.mid},uHor:{value:i.hor},uCool:{value:i.cool},uCloudLit:{value:i.cloudLit},uCloudDark:{value:i.cloudDark},uFogWarm:{value:i.fogColor},uFogCool:{value:i.fogCool},uSkyAmb:{value:i.skyColor.clone().multiplyScalar(1.25)},uGroundAmb:{value:i.groundColor.clone()},uFogK:{value:52e-5},uGlow:{value:i.glow},uLamps:{value:i.lamps},uLampShare:{value:i.lampShare},uLampDraw:{value:new Array(38).fill(2)},uSqLamp:{value:Array.from({length:Le},()=>new q.Vector3(0,0,2))},uBox:{value:W},uBoxH:{value:T},uWetCap:{value:i.wetCap||.275},uPool:{value:Ft(s.pools).slice(0,Ve).map(F=>new q.Vector4(F[0],F[1],1/F[2],1/F[3]))},uPortal:{value:new q.Vector3(0,15,-292)},uPortalCol:{value:new q.Color("#ffe6c4")}};for(const F of Object.keys(h.uniforms||{}))M[F]=h.uniforms[F];const S=bt(M,h),k=new q.ShaderMaterial({uniforms:M,vertexShader:wt,fragmentShader:gt(h.glsl)}),r=new q.Mesh(new q.SphereGeometry(1,32,16),new q.ShaderMaterial({uniforms:M,vertexShader:yt,fragmentShader:zt,side:q.BackSide,depthWrite:!1}));r.renderOrder=-1,r.frustumCulled=!1,o(r,960);const d=new q.BufferGeometry,y=[he,0,ge,me,0,ge,me,0,ee,he,0,ee];d.setAttribute("position",new q.Float32BufferAttribute(y,3)),d.setIndex([0,1,2,0,2,3]),d.computeBoundingSphere(),o(new q.Mesh(d,k),2);const g=pt();xt(g,f),await t.yield();for(let F=0;F<20;F++)g.box(-26,26,0,(F+1)*.25,-262-(F+1)*.7,-262-F*.7,A.pale,[0,.3,1.2,.25],A.pale,[0,.3,1.2,.6],"st");g.box(-60,60,te-2,5,-330,-276,A.pale,[0,.4,2.4,1.2],A.pale,[0,.4,2.4,1.2]),g.box(-60,-26,te-2,5,-276,-262,A.pale,[0,.4,2.4,1.2],A.pale,[0,.4,2.4,1.2]),g.box(26,60,te-2,5,-276,-262,A.pale,[0,.4,2.4,1.2],A.pale,[0,.4,2.4,1.2]),g.box(he-.5,-60,te-2,0,ee-.5,ee,A.granite,[0,.5,3,1.5],A.granite,null,"n"),g.box(60,me,te-2,0,ee-.5,ee,A.granite,[0,.5,3,1.5],A.granite,null,"n"),g.box(he-.5,he,te-2,0,ee-.5,ge,A.granite,[0,.5,3,1.5],A.granite,null,"w"),g.box(he,-60.5,0,1.1,ee-.5,ee-.1,A.granite,[0,.4,2.4,1.1]),g.box(60.5,me,0,1.1,ee-.5,ee-.1,A.granite,[0,.4,2.4,1.1]),g.box(he-.5,he-.1,0,1.1,ee-.5,ge,A.granite,[0,.4,2.4,1.1]);const C=Jt(g,f,s.garden,s.roofs,x,s.tops);await t.yield();const N=Tt(g,s.lamps,f.lamps,s.squareLamps);N.filter(F=>F[0]>-121&&F[0]<-26&&F[2]>-216&&F[2]<-134).slice(0,Le).forEach((F,D)=>M.uSqLamp.value[D].set(F[0],F[2],F[5]));for(const F of N)F[3]>=-9&&F[3]<=9&&(M.uLampDraw.value[(F[3]+9)*2+(F[4]>0?1:0)]=F[5]);Dt(g),Rt(g),await t.yield(),Bt(g,s.far,i,n*(.6+.4*c),s.farEast,u),await t.yield();const G=o(new q.Mesh(g.toGeometry(),S),g.tris);G.frustumCulled=!1,await t.yield();const j=await Lt(t,u,i,M,s.lowland,n);o(j.mesh,j.triangles),await t.yield();const I=await Kt(t,f.trees,i,e,x,c,C,s.tubs);p.add(I.object),b+=I.triangles,w+=I.drawCalls,m.push((F,D)=>I.update(D)),await t.yield();const se=Gt(s.traffic,M,h,n,c,s.parked);for(const F of se.meshes)o(F,0);b+=se.triangles,o(Ht(N,M),N.length*2);const B=Math.round(72*(.5+.5*c));o(Qt(s.birds,M,B),B*2),await t.yield();const L={value:0},V=Se.fxGroup();p.add(V.object),V.add(Se.makeParticles({rng:s.leaves,preset:"leaves",time:L,count:Math.round(1150*n*c),box:[60,30,70],size:[.11,.24],colors:["#8d9a3a","#c9b24a","#5d7a30"],velocity:[.5,-1.1,.7],lightDir:[i.sunDir.x,i.sunDir.y,i.sunDir.z]})),await t.yield();for(const[F,D]of Ie)V.add(Se.makeSmokeColumn({rng:s.square,time:L,position:[F,ce.stack-.3,D],height:17-ce.stack,radius:[ce.mouth*.7,4.5],size:[ce.mouth*2.6,9],count:46,color:"#e6e1e2",colorTop:"#f3eeee",shadowColor:"#9a98b4",ambient:"#8e8ca8",opacity:.42,rate:.09,wind:[.5,0,.35],sunDir:[i.sunDir.x,i.sunDir.y,i.sunDir.z],sunColor:i.sunColor}));const P=[];for(const F of[7,-113,-231])for(let D=0;D<16;D++){const H=D%2?1:-1;P.push([H*(34+s.square.range(0,190)),s.square.range(1.5,4.5),F+s.square.range(-7,7)])}for(let F=0;F<10;F++)P.push([s.square.range(-116,-32),s.square.range(1.5,3.5),s.square.range(-212,-138)]);V.add(Se.makeMist({rng:s.square,time:L,positions:P,count:P.length,size:[16,32],color:"#d8ccd2",opacity:.17,drift:[.5,0,.12]})),b+=520*2+184+P.length*2,w+=4,m.push((F,D,H)=>{L.value=D,V.update(F,D,H)}),await t.yield();const K=new q.HemisphereLight(i.skyColor.clone(),i.groundColor.clone().multiplyScalar(.6),3.2),E=new q.DirectionalLight(i.sunColor.clone(),i.sunK>0?1.6:0);E.position.copy(i.sunDir).multiplyScalar(400),p.add(K,E,E.target);const Z=[K,E],U={hemi:K.intensity,sun:E.intensity};return{object:p,env:i,lights:Z,lightBase:U,uniforms:M,plan:f,anchors:{arch:[0,15,-292],square:[-70,0,-175],plaza:[36,3,-30]},update(F,D,H){M.uTime.value=D;for(const Q of m)Q(F,D,H)},dispose(){z.dispose()},get triangles(){return b},get drawCalls(){return w}}}function Ee(){const t=[];for(const a of[-23.2,-11.6,11.6,23.2])for(let l=0;l<4;l++){const v=-264.5-l*3.4;t.push([a,Math.ceil((-262-v)/.7)*.25+.8,v])}return t}const Xe=24,Je=30,We=-222,be=t=>t>-5.5&&t<19.5||t>-127.5&&t<-98.5||t>-238.5&&t<-223.5;function qt(){const t=[];for(let l=-9;l<=9;l++){const v=Xe+l*Je;be(v)||t.push([17.5,v,l,1,9],[-17.5,v,l,-1,9])}let a=60;for(let l=-39;l>=-117;l-=26)t.push([l,-137,a++,-1,8],[l,-213,a++,-1,8]);for(let l=-163;l>=-189;l-=26)t.push([-118,l,a++,-1,8]);for(const[l,v]of[[-9,-256],[9,-256],[-21,-258],[21,-258],[-30,-284],[30,-284],[-30,-318],[30,-318],[-52,-300],[52,-300]])t.push([l,v,a++,l<0?-1:1,v<-270?12:8]);for(const l of[-36,-60,-84])for(const v of[_e-ve[1],_e-3*ve[1]])t.push([l,v,a++,-1,8,1]);return t}const ve=[12,10],Wt=[-48,-72,-96],_e=-165,Ie=[[-66,-185],[-90,-165]],ce={across:2.4,stack:3,mouth:.42};function Ft(t){const a=[],l=(i,h,x,c,n,p)=>a.push([i+t.range(-1,1)*(n-x),h+t.range(-1,1)*(p-c),x,c]),v=[];for(let i=1;i<=6;i++)for(const h of[-172,-198]){const x=-114+i*ve[0];Ie.some(([c,n])=>Math.abs(c-x)<6&&Math.abs(n-h)<12)||v.push([x,h])}const s=v.map(i=>({s:i,key:t()})).sort((i,h)=>i.key-h.key).slice(0,9);for(const{s:i}of s)l(i[0],i[1],t.range(3.4,3.8),t.range(8.5,10),3.8,10);l(0,-282,t.range(7.8,8.5),t.range(4,4.5),8.5,4.5);for(const i of[-304,-320])l(0,i,t.range(9.5,10.5),t.range(5.8,6.5),10.5,6.5);for(const i of[-25,25])for(const h of[-294,-317])l(i,h,t.range(3,3.3),t.range(9,10),3.3,10);for(const i of[-43,43])l(i,-303,t.range(2.5,2.7),t.range(10,12),2.7,12);return a}function Dt(t){const a=A.granite,l=_("#2c4a24"),v=_("#27451f"),s=_("#6b5a48"),i=_("#2b2e33"),h=_("#1a1c20"),x=(m,b,w)=>{t.box(m-.8,m+.8,b,b+.55,w-3,w+3,a,[0,.6,2,.55],l,[8,.52,3,3]);for(const o of[-2,0,2])t.box(m-.62,m+.62,b+.55,b+1.05,w+o-.85,w+o+.85,v,[8,.31+o*.07,3,3]),t.box(m-.42,m+.42,b+1.05,b+1.3,w+o-.6,w+o+.6,v,[8,.36+o*.07,3,3])};for(const m of[-14,14])for(let b=-288;b>-328;b-=12)x(m,5,b);for(const m of Wt)for(let b=0;b<5;b++){const w=_e-b*ve[1];if(b%2===0)x(m,0,w);else for(const o of[-1,1]){const f=m+o*1.15;t.box(f-.3,f+.3,0,.45,w-1.2,w+1.2,a,[0,.3,2,1]),t.box(f-.34,f+.34,.45,.52,w-1.3,w+1.3,s,[0,.3,2,1])}}const c=_("#7d838a"),n=ce.across/2,p=.22;for(const[m,b]of Ie){t.box(m-n,m+n,0,.2,b-n,b-n+p,a,[0,.5,1.2,.2]),t.box(m-n,m+n,0,.2,b+n-p,b+n,a,[0,.5,1.2,.2]),t.box(m-n,m-n+p,0,.2,b-n+p,b+n-p,a,[0,.5,1.2,.2]),t.box(m+n-p,m+n,0,.2,b-n+p,b+n-p,a,[0,.5,1.2,.2]),t.box(m-n+p,m+n-p,0,.05,b-n+p,b+n-p,h,[9,2,0,0],h,[9,2,0,0],"t");for(let f=-5;f<=5;f++)t.box(m-n+p,m+n-p,.05,.16,b+f*.17-.035,b+f*.17+.035,i,[0,.2,9,9]);const w=(f,e,u,z)=>{for(let W=0;W<8;W++){const T=W/8*Math.PI*2,R=(W+1)/8*Math.PI*2,M=(T+R)/2,S=[m+f*Math.cos(T),b+f*Math.sin(T)],k=[m+f*Math.cos(R),b+f*Math.sin(R)];t.quad([k[0],e,k[1]],[S[0],e,S[1]],[S[0],u,S[1]],[k[0],u,k[1]],[Math.cos(M),0,Math.sin(M)],[4.6,e+3,4.4,u+3],z,[0,.2,9,9])}};w(ce.mouth+.14,.16,.5,i),w(ce.mouth,.5,ce.stack-.14,c),w(ce.mouth+.05,ce.stack-.14,ce.stack+.08,i);const o=ce.mouth*.72;t.box(m-o,m+o,ce.stack-.12,ce.stack-.04,b-o,b+o,h,[9,2,0,0],h,[9,2,0,0],"t")}}function Tt(t,a,l,v=a){const s=_("#2b2e33"),i=A.pale;for(let c=292;c>-250;c-=15)if(!(be(c)||be(c-4)||be(c+4)))for(const n of[-1,1]){const p=n*(20.6+a.range(-.4,.4)),m=a();if(m<.4)t.box(p-.3,p+.3,0,.45,c-1.1,c+1.1,i,[0,.3,2,1]),t.box(p-.34,p+.34,.45,.52,c-1.2,c+1.2,_("#6b5a48"),[0,.3,2,1]);else if(m<.75)t.box(p-.9,p+.9,0,.7,c-.9,c+.9,i,[0,.6,2,1],_("#2f4a26"),[8,.6,3,3]);else for(let b=-2;b<=2;b++)t.box(n*15.8-.09,n*15.8+.09,0,.9,c+b*1.6-.09,c+b*1.6+.09,s,[0,.2,9,9])}const h=[];for(const[c,n,p,m,b,w]of l){const o=w?v():a(),f=c>0?-1:1;t.box(c-.11,c+.11,0,b,n-.11,n+.11,s,[0,.2,9,9]),t.box(Math.min(c,c+f*1.5),Math.max(c,c+f*1.5),b-.12,b+.06,n-.07,n+.07,s,[0,.2,9,9]),t.box(Math.min(c+f*.9,c+f*1.9),Math.max(c+f*.9,c+f*1.9),b-.3,b-.12,n-.22,n+.22,s,[9,o,p,m],s,[9,o,p,m]),h.push([c+f*1.4,b-.3,n,p,m,o])}const x=(c,n,p,m)=>{t.box(c-.09,c+.09,0,4.6,n-.09,n+.09,s,[0,.2,9,9]);const b=p==="s"?.16:p==="n"?-.16:0,w=p==="e"?.16:p==="w"?-.16:0;t.box(c-.2+w,c+.2+w,3.4,4.6,n-.2+b,n+.2+b,s,[0,.2,9,9]);for(let o=0;o<3;o++){const f=3.55+o*.36;t.box(c-.13+w*1.3,c+.13+w*1.3,f,f+.26,n-.13+b*1.3,n+.13+b*1.3,s,[10,o*.5,m,0],s,[10,o*.5,m,0],p)}};for(const[c,n]of[[-4,18],[-126,-100],[-237,-225]]){const p=a();x(15.6,n+1.2,"s",p),x(-15.6,c-1.2,"n",p),x(3.2,n+1.2,"s",p),x(-3.2,c-1.2,"n",p),x(16.6,c-.6,"e",p+.5),x(-16.6,n+.6,"w",p+.5)}return h}const J={z:-292,foot:5,half:9.6,rise:27.5,n:48,broad:4.6},je=t=>{const a=Math.PI/2*t;return[J.half*Math.cos(a),J.foot+J.rise*Math.sin(a)]};function Rt(t){const a=_("#d0c6b2"),l=J.n,v=(s,i)=>{const[h,x]=je(s),c=.001,[n,p]=je(Math.min(1,s+c)),[m,b]=je(Math.max(0,s-c));let w=n-m,o=p-b;const f=Math.hypot(w,o)||1;w/=f,o/=f;const e=o,u=-w,z=(J.broad-2*s)/2,W=(1.5-.4*s)/2,T=Math.PI/2*s,R=Math.cos(T),M=Math.sin(T),S=[];for(const[k,r]of[[1,1],[-1,1],[-1,-1],[1,-1]]){const d=k*z*R-r*W*M,y=k*z*M+r*W*R;S.push([i*(h+e*d),x+u*d,J.z+y])}return S};for(const s of[1,-1]){let i=v(0,s),h=0;for(let x=1;x<=l;x++){const c=x/l,n=v(c,s),p=Math.hypot(n[0][0]-i[0][0],n[0][1]-i[0][1]);for(let m=0;m<4;m++){const b=(m+1)%4;let w=i[m],o=i[b],f=n[b],e=n[m];if(s>0){const r=w;w=o,o=r;const d=f;f=e,e=d}const u=o[0]-w[0],z=o[1]-w[1],W=o[2]-w[2],T=e[0]-w[0],R=e[1]-w[1],M=e[2]-w[2];let S=[z*M-W*R,W*T-u*M,u*R-z*T];const k=Math.hypot(S[0],S[1],S[2])||1;S=[S[0]/k,S[1]/k,S[2]/k],t.quad(w,o,f,e,S,[m*3,h,m*3+2.4,h+p],a,[0,.77,2.4,1.1])}i=n,h+=p}}t.box(-6.9,6.9,5,6,J.z-2.2,J.z+2.2,a,[0,.7,2.4,.5],a,[0,.7,2.4,1.2]),t.box(-8.6,8.6,5,5.5,J.z-3.4,J.z+3.4,a,[0,.7,2.4,.5],a,[0,.7,2.4,1.2]);for(const s of[-1,1])t.box(s*J.half-3.2,s*J.half+3.2,5,5.35,J.z-2.4,J.z+2.4,a,[0,.7,2.4,.35],a,[0,.7,2.4,1.2])}function et(t,a,l,v,s,i,h,x,c){const n=[x[0]*.72,x[1]*.72,x[2]*.72],p=[0,h,3,3];h<.35?(t.box(a-v/3,a+v/3,i,i+7.8,l-s/3,l+s/3,x,c,A.roof,p),h<.18&&t.box(a-v/5,a+v/5,i+7.8,i+15.6,l-s/5,l+s/5,x,c,A.roof,p)):h<.65?t.box(a-v/2+2.5,a+v/2-2.5,i,i+3.6,l-s/2+2.5,l+s/2-2.5,n,[0,h,1.2,3.6],A.roof,p):(t.box(a-v/6,a+v/6,i,i+5,l-s/6,l+s/6,n,[0,h,3,5],A.roof,p),t.box(a-.45,a+.45,i+5,i+5+12+(h-.65)*60,l-.45,l+.45,_("#3a3e46"),[0,.2,9,9]))}function Bt(t,a,l,v,s,i){const h=A.pale;t.box(-60,60,5,6.1,-330.5,-330,h,[0,.4,2.4,1.1]),t.box(-60.5,-60,5,6.1,-330,-262,h,[0,.4,2.4,1.1]),t.box(60,60.5,5,6.1,-330,-262,h,[0,.4,2.4,1.1]),t.box(-60,-26.4,5,6.1,-262.5,-262,h,[0,.4,2.4,1.1]),t.box(26.4,60,5,6.1,-262.5,-262,h,[0,.4,2.4,1.1]),t.box(-26.4,-26,0,6.1,-276,-262,h,[0,.4,2.4,1.1]),t.box(26,26.4,0,6.1,-276,-262,h,[0,.4,2.4,1.1]);const x=l.sunDir.x<0,c=l.sunDir.y/Math.max(.05,Math.hypot(l.sunDir.x,l.sunDir.z)),n=Math.max(.2,Math.abs(l.sunDir.x)/Math.hypot(l.sunDir.x,l.sunDir.z)),p=[1,2,2,5,6,3,4],m=[A.lime,A.steel,A.blue,A.bronze,A.pale,A.green,A.terra,A.conc,A.granite];let b=0;for(let e=-9;e<=9;e++)for(let u=-3;u<=12;u++){const z=e*78+a.range(-12,12),W=u*92+a.range(-14,14)+40,T=a(),R=a(),M=a.range(26,44),S=a.range(26,46),k=p[Math.floor(a()*p.length)],r=m[Math.floor(a()*m.length)],d=a();if(Math.abs(z)<100&&W<345||z>-175&&z<0&&W<345||Math.abs(z)<46||z-M/2<he+14||W-S/2<-258||T>.9*Math.min(1,v))continue;const y=Math.hypot(z,W-20);let g=34+R*R*190*(.6+.4*Math.min(1,y/500));const C=l.sunK>0&&c<.5&&(x&&z<0||!x&&z>0);C&&(g=Math.min(g,18+c*(Math.abs(z)-30)/n)),z<-100&&W<-110&&(g=Math.min(g,25+R*15)),t.box(z-M/2,z+M/2,0,g,W-S/2,W+S/2,r,[k,d,k===2||k===5?2:3.3,3.9],A.roof,[0,d,3,3]),g>90&&R>.5?t.box(z-M/4,z+M/4,g,g+9+R*14,W-S/4,W+S/4,r,[k,d,3.3,3.9],A.roof,[0,d,3,3]):g>50&&!C&&et(t,z,W,M,S,g,d,r,[k,d,k===2||k===5?2:3.3,3.9]),b++}for(let e=0;e<5;e++)for(let u=0;u<9;u++){const z=-90-e*46+a.range(-6,6),W=318-u*50,T=a(),R=a.range(26,38),M=a.range(30,42),S=p[Math.floor(a()*p.length)],k=m[Math.floor(a()*m.length)],r=a();let d=W+a.range(-4,4);if(d-M/2<26&&d+M/2>-12&&(d=d>7?26+M/2+2:-12-M/2-2),d-M/2<-92)continue;const y=l.sunK>0&&x&&c<.5?14+c*(Math.abs(z)+R/2-30)/n:60,g=Math.min(y,16+T*40);t.box(z-R/2,z+R/2,0,g,d-M/2,d+M/2,k,[S,r,S===2||S===5?2:3.3,3.8],A.roof,[11,r,3,3])}for(let e=0;e<90;e++){const u=a.range(-1100,700),z=a.range(-1500,-360),W=a.range(18,60),T=a.range(18,60),R=a.range(6,24),M=m[Math.floor(a()*m.length)],S=a();i.dist(u,z)<i.valleyW(i.bearing(u,z))-40&&i.sheds.push([u,z,W,T,R,M,S])}for(const[e,u,z,W,T,R,M]of Ye)for(let S=0;S<Math.round(e*Math.min(1.2,v));S++){const k=s.range(ze,kt),r=s.range(u,z),d=Math.sin(k)*r,y=-292-Math.cos(k)*r,g=s.range(R,M),C=s.range(R,M),N=s.range(W,T),G=p[Math.floor(s()*p.length)],j=m[Math.floor(s()*m.length)],I=s();y>-300||d<60||(t.box(d-g/2,d+g/2,te-2,te+N,y-C/2,y+C/2,j,[G,I,4.2,4.4],A.roof,[0,I,3,3]),N>(W+T)/2?t.box(d-g/4,d+g/4,te+N,te+N+14,y-C/4,y+C/4,j,[G,I,4.2,4.4],A.roof,[0,I,3,3]):et(t,d,y,g,C,te+N,I,j,[G,I,4.2,4.4]))}const w=A.granite,o=_("#2c4a24"),f=_("#2b2e33");for(const[e,u,z]of Ee())t.box(e-1.1,e+1.1,u-1.9,u,z-1.1,z+1.1,w,[0,.6,1.1,.95],o,[8,.47,3,3]);for(let e=0;e<2;e++)for(let u=0;u<6;u++)t.box(-40-u*11.5-5.75-1.6,-40-u*11.5-5.75+1.6,0,.48,-141-e*13-.4,-141-e*13+.4,w,[0,.6,1.6,.48]);for(const e of[-16,16])for(let u=-282;u>-328;u-=5.5)t.box(e-.08,e+.08,5,5.72,u-.08,u+.08,f,[0,.2,9,9]),t.box(e-.11,e+.11,5.72,5.9,u-.11,u+.11,f,[13,.5,9,9],f,[13,.5,9,9]);for(const e of[-31,-19,19,31])for(const u of[-286,-299,-312])t.box(e-1.7,e+1.7,5,5.5,u-.45,u+.45,w,[0,.6,1.7,.5]);for(const e of[-23,-13,13,23])t.box(e-2.3,e+2.3,5,5.75,-280.2,-277.8,w,[0,.6,2.3,.75],o,[8,.4+e*.01,3,3]);return b}async function Pt(t,a,l,v,s=a,i=a){const h={leaf:"#3a6e30",leafLight:"#93a244",leafDark:"#1d4426",bark:"#a9a08a",barkDark:"#5c5648"},x=[],c=[];for(let o=0;o<4;o++)x.push(we.oakGeometry({rng:a,height:16,detail:o===0?2:1,fullness:.74,...h})),await t.yield();for(let o=0;o<2;o++)c.push(we.oakGeometry({rng:a,height:9,detail:0,fullness:.8,leaf:"#3a6e30",leafLight:"#93a244",leafDark:"#1d4426",bark:"#8f8674",barkDark:"#4c463c"})),await t.yield();const n=[],p=Nt(l),m=Vt(p);for(let o=0;;o+=2){const f=tt-o*ot;if(f<We+1.5)break;if(m.some(([W,T])=>f>W&&f<T))continue;const e=i.range(-.35,.35),u=i.range(15,17),z=f+i.range(-.8,.8);n.push([(o/2%2?2.3:-2.3)+e,0,z,p*u/17,0,i,1])}for(let o=-9;o<=9;o++){const f=Xe+o*Je+15;if(!(be(f)||be(f+5)||be(f-5)||f<-252))for(const e of[-1,1]){const u=a.range(7.2,9.4),z=f+a.range(-1,1);n.push([e*17.5,0,z,u,1])}}for(let o=0;o<14;o++)n.push([-40-o%7*11.5+a.range(-2,2)*.15,0,-141-Math.floor(o/7)*13+a.range(-2,2)*.15,a.range(10,12),0]);const b=v.east[5],w=v.east[2];for(let o=0;o<10;o++)n.push([31+o%2*13+a.range(-2,2),b.pod,-140-Math.floor(o/2)*17+a.range(-3,3),a.range(6,8.5),1]);for(let o=0;o<5;o++)n.push([32+a.range(0,22),w.t[0].h,28+o*6.5,a.range(4,5.5),1]);for(let o=0;o<5;o++)for(const f of[-48,-38,38,48])n.push([f,5,-284-o*9.5,7.4,1]);for(const[o,f]of[[-36,126],[-36,139],[-50,132],[-34,250],[-48,252],[-36,30],[-48,28],[-112,-205],[-100,-210]])n.push([o,0,f,a.range(8,10.5),1]);for(const[o,f]of[[30,-40],[34,-22],[39,-44]])n.push([o,o>36?4:2,f,5.5,1]);for(let o=1;o<=3;o++)n.push([-108+s.range(-.3,.3),0,-154-o*11.5+s.range(-.3,.3),s.range(10,12),0,s]);return at(n,l),{rng:a,big:x,small:c,list:n}}const tt=297,ot=6.6;function Nt(t){const a=new q.Vector3;let l=1e9;for(let v=0;v<=t.length;v+=1)t.posAtDist(v,a),a.z>=We&&a.y<l&&(l=a.y);return l-9.5}function Vt(t){const a=2*ot,l=Math.ceil((20+2*.55*t)/a-1),v=[],s=[tt];for(const[i,h]of[[-5.5,19.5],[-127.5,-98.5]])v.push([i-.8,h+.8]),s.push(h,i);s.push(We);for(let i=0;i+1<s.length;i+=2){const h=(s[i]+s[i+1])/2;v.push([h-l*a/2,h+l*a/2])}return v}const at=(t,a)=>{for(const l of t){const v=a.nearestXZ(l[0],l[2]);v.dist<11&&(l[3]=Math.min(l[3],v.y-l[1]-5.8))}};async function Kt(t,a,l,v,s,i,h=[],x=a.rng){const c=we.makeWind({direction:[.5,.86],strength:1.75,speed:1.2}),n=l.sunColor.clone();n.multiplyScalar(1/Math.max(n.r,n.g,n.b,.001));const p={wind:c,backlight:1,backlightTint:new q.Color("#e6d27a").lerp(n,.5),wrap:1,ambient:1.5,leafAmbient:1.45,sheen:.5};await we.prepareLeafTexture(p,t.yield);const m=we.windMaterial(p),b=a.rng,w=a.big,o=a.small,f=a.list.slice(),e=[...Ee().filter(([r,,d])=>Ue(s,r,d)).map(([r,d,y])=>[r,d,y,4.6,1,x]),...h.map(r=>[r[0],r[1],r[2],r[3],1,x])];at(e,s),f.push(...e);const u=new q.Group;let z=0,W=0;const T=new q.Quaternion,R=new q.Euler,M=new q.Vector3,S=new q.Vector3,k=[...w.map((r,d)=>({g:r,kind:0,items:[],fine:d===0})),...o.map(r=>({g:r,kind:1,items:[]}))];for(const r of f){const d=k.filter(g=>g.kind===r[4]&&!(r[6]&&g.fine)),y=r[5]||b;d[Math.floor(y()*d.length)].items.push(r)}for(const r of k){const d=r.g.userData.height||(r.kind?9:16),y=[];for(const C of r.items){const N=C[5]||b,G=C[3]/d,j=G*N.range(.95,1.15);R.set(N.range(-.03,.03),N.range(0,Math.PI*2),N.range(-.03,.03)),T.setFromEuler(R);const I=v(C[0],C[1]+C[3]*.8,C[2],8),se=N.range(0,1),B=N.range(.85,1.1);M.set(C[0],C[1]-.05,C[2]),S.set(j,G,j),y.push([new q.Matrix4().compose(M,T,S),new q.Color().setRGB(B*ae(.74,1.22,I)*(1+.1*se),B*ae(.86,1.1,I)*(1+.03*se),B*ae(1,.66,I)*(1-.12*se))])}if(!y.length)continue;const g=new q.InstancedMesh(r.g,m,y.length);y.forEach(([C,N],G)=>{g.setMatrixAt(G,C),g.setColorAt(G,N)}),g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0),g.computeBoundingSphere(),g.frustumCulled=!1,u.add(g),z+=(r.g.userData.triangles||r.g.index.count/3)*y.length,W++}return{object:u,triangles:z,drawCalls:W,wind:c,list:f,update(r){c.update(r)}}}const st=640,nt=-224,Et=4.4,_t=10,lt=`
attribute vec4 aCar; attribute float kind;
varying vec3 vW, vN; varying float vKind, vSeed, vMove; varying vec2 vUv;
uniform float uTime;
void main(){
  float r = aCar.y, ZS = ${st.toFixed(1)}, ZN = ${nt.toFixed(1)}, L1 = ZS - ZN, arc = 3.14159265 * r, tot = 2. * L1 + 2. * arc;
  vec2 c, fwd; float mv = step(.01, aCar.z);
  if (mv > .5) {
    float s = mod(aCar.x + aCar.z * uTime, tot);
    if (s < L1) { c = vec2(r, ZS - s); fwd = vec2(0., -1.); }
    else if (s < L1 + arc) { float a = (s - L1) / r; c = vec2(r * cos(a), ZN - r * sin(a)); fwd = vec2(-sin(a), -cos(a)); }
    else if (s < 2. * L1 + arc) { c = vec2(-r, ZN + (s - L1 - arc)); fwd = vec2(0., 1.); }
    else { float a = (s - 2. * L1 - arc) / r; c = vec2(-r * cos(a), ZS + r * sin(a)); fwd = vec2(sin(a), cos(a)); }
  } else { c = aCar.xy; fwd = aCar.w > 0. ? vec2(1., 0.) : vec2(-1., 0.); }
  vec2 right = vec2(-fwd.y, fwd.x);
  vec2 xz = c + right * position.x - fwd * position.z;
  vec2 nxz = right * normal.x - fwd * normal.z;
  vW = vec3(xz.x, position.y, xz.y); vN = vec3(nxz.x, normal.y, nxz.y); vKind = kind; vSeed = fract(abs(aCar.w) * 7.31 + aCar.x * .013); vMove = mv; vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,It=t=>`
varying vec3 vW, vN; varying float vKind, vSeed, vMove; varying vec2 vUv;
${xe}
${t}
void main(){
  vec3 n = normalize(vN), V = normalize(vW - cameraPosition);
  float sunVis = cityRay(vW + vec3(0., .3, 0.), uSunDir, 6.) * arwShade(vW);
  vec3 R = reflect(V, n); R.y = abs(R.y);
  float fres = .08 + .92 * pow(1. - clamp(dot(-V, n), 0., 1.), 4.);
  gNzLod = 3.; vec3 sk = arwSky(R, sunVis); gNzLod = 0.;
  float s = floor(vSeed * 64.) / 64. + .004;
  vec3 body = s < .2 ? vec3(.55, .56, .58) : s < .38 ? vec3(.06, .065, .08) : s < .55 ? vec3(.72, .72, .70) : s < .68 ? vec3(.10, .15, .30) : s < .8 ? vec3(.32, .07, .06) : s < .9 ? vec3(.30, .28, .25) : vec3(.12, .2, .18);
  vec3 col = body * (uSkyAmb * (.6 + .4 * n.y) + uSunCol * uSunK * max(dot(n, uSunDir), 0.) * sunVis) + sk * fres * .6;
  if (vKind > .5 && vKind < 1.5) col = sk * (fres * .9 + .06) * vec3(.8, .9, 1.);
  if (vKind > 1.5 && vKind < 2.5) col = mix(vec3(.5), vec3(1., .93, .78) * 6., vMove);
  if (vKind > 2.5) col = mix(vec3(.12, .01, .01), vec3(1., .07, .04) * 3.2, vMove);
  if (vKind < -.5) col = vec3(.015, .015, .018);
  gl_FragColor = vec4(arwHaze(col, vW), 1.);
}`,jt=`
varying vec3 vW, vN; varying float vKind, vSeed, vMove; varying vec2 vUv;
${xe}
void main(){
  float a = (1. - vUv.y); a *= a; float e = 1. - clamp(abs(vUv.x - .5) * 2., 0., 1.); a *= e * e;
  vec3 c = vKind < 4.5 ? vec3(1., .88, .66) * .55 : vec3(1., .10, .06) * .32;
  float wetK = .55 + .9 * nz(vW.xz * .06);
  gl_FragColor = vec4(c * a * vMove * wetK * (1. - clamp(length(vW - cameraPosition) * uFogK * 1.5, 0., .9)), 1.);
}`;function Gt(t,a,l,v,s,i=t){const h=[],x=[],c=[],n=[],p=[],m=[],b=[],w=[],o=[],f=(k,r,d,y,g,C,N)=>{const G=N?m:h,j=N?b:c,I=N?w:n,se=N?o:p,B=G.length/3;if(G.push(...k,...r,...d,...y),j.push(C,C,C,C),I.push(0,0,1,0,1,1,0,1),se.push(B,B+1,B+2,B,B+2,B+3),!N)for(let L=0;L<4;L++)x.push(g[0],g[1],g[2])},e=(k,r,d,y,g,C,N)=>{f([k,d,g],[k,d,C],[k,y,C],[k,y,g],[-1,0,0],N),f([r,d,C],[r,d,g],[r,y,g],[r,y,C],[1,0,0],N),f([k,d,C],[r,d,C],[r,y,C],[k,y,C],[0,0,1],N),f([r,d,g],[k,d,g],[k,y,g],[r,y,g],[0,0,-1],N),f([k,y,C],[r,y,C],[r,y,g],[k,y,g],[0,1,0],N)};e(-.9,.9,.32,.98,-2.2,2.2,0),e(-.8,.8,.98,1.5,-.7,1.5,1),e(-.82,.82,1.5,1.54,-.75,1.55,0);for(const[k,r]of[[-.92,-1.4],[.92,-1.4],[-.92,1.4],[.92,1.4]])e(k-.12,k+.12,0,.66,r-.34,r+.34,-1);for(const k of[-.62,.62])f([k+.2,.62,-2.21],[k-.2,.62,-2.21],[k-.2,.84,-2.21],[k+.2,.84,-2.21],[0,0,-1],2),f([k-.22,.66,2.21],[k+.22,.66,2.21],[k+.22,.86,2.21],[k-.22,.86,2.21],[0,0,1],3);f([1.7,.06,-2],[-1.7,.06,-2],[-3.2,.06,-17],[3.2,.06,-17],[0,1,0],4,!0),f([-1.4,.06,2],[1.4,.06,2],[2.2,.06,8.5],[-2.2,.06,8.5],[0,1,0],5,!0);const u=[],z=Math.max(6,Math.round(52*v*(.5+.5*s))),W=[[],[]];for(let k=0;k<z;k++){const r=t()<.6?0:1,d=t.range(.1,.9),y=t.range(.05,.95);W[r].push([d,y])}W.forEach((k,r)=>{const d=r?9.6:6,y=2*(st-nt)+2*Math.PI*d,g=Et+_t,C=Math.min(k.length,Math.floor(y/g)),N=y/Math.max(1,C),G=Math.min(.5,g/(2*N));for(let j=0;j<C;j++)u.push([(j+ae(G,1-G,(k[j][0]-.1)/.8))*N,d,r?9.5:11.5,k[j][1]])});for(const k of[-2.7,16.7,-124.7,-101.3])for(let r=34;r<190;r+=6.4)for(const d of[-1,1]){const y=i(),g=i.range(-.6,.6),C=i.range(.05,.95);y>.5*Math.min(1.2,v)||u.push([d*r+g,k,0,C*(k===-2.7||k===-124.7?1:-1)])}const T=new q.InstancedBufferAttribute(new Float32Array(u.flat()),4),R=(k,r,d,y,g)=>{const C=new q.InstancedBufferGeometry;return C.setAttribute("position",new q.Float32BufferAttribute(k,3)),C.setAttribute("kind",new q.Float32BufferAttribute(r,1)),C.setAttribute("uv",new q.Float32BufferAttribute(d,2)),C.setAttribute("normal",new q.Float32BufferAttribute(g||new Array(k.length).fill(0).map((N,G)=>G%3===1?1:0),3)),C.setIndex(y),C.setAttribute("aCar",T),C.instanceCount=u.length,C},M=new q.Mesh(R(h,c,n,p,x),new q.ShaderMaterial({uniforms:a,vertexShader:lt,fragmentShader:It(l.glsl)})),S=new q.Mesh(R(m,b,w,o),new q.ShaderMaterial({uniforms:a,vertexShader:lt,fragmentShader:jt,transparent:!0,depthWrite:!1,blending:q.AdditiveBlending}));return M.frustumCulled=!1,S.frustumCulled=!1,S.renderOrder=1,{meshes:[M,S],triangles:(p.length/3+o.length/3)*u.length,count:u.length}}const Ot=`
attribute vec4 aLamp;
varying vec2 vQ; varying float vOn;
uniform float uLampShare;
void main(){
  vQ = position.xy; vOn = step(aLamp.w, uLampShare);
  vec4 mv = viewMatrix * vec4(aLamp.xyz, 1.); mv.xy += position.xy * 1.25;
  gl_Position = projectionMatrix * mv;
}`,Ut=`
varying vec2 vQ; varying float vOn;
void main(){ float d = clamp(dot(vQ, vQ), 0., 1.); float a = (1. - d); a *= a; gl_FragColor = vec4(vec3(1., .78, .5) * (a * a * 1.2 + a * .1) * vOn, 1.); }`;function Ht(t,a){const l=new q.InstancedBufferGeometry;l.setAttribute("position",new q.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]),l.setAttribute("aLamp",new q.InstancedBufferAttribute(new Float32Array(t.flatMap(s=>[s[0],s[1],s[2],s[5]])),4)),l.instanceCount=t.length;const v=new q.Mesh(l,new q.ShaderMaterial({uniforms:a,vertexShader:Ot,fragmentShader:Ut,transparent:!0,depthWrite:!1,blending:q.AdditiveBlending}));return v.frustumCulled=!1,v.renderOrder=2,v}const $t=`
attribute vec4 aBird;
uniform float uTime; uniform vec2 uFlock; varying float vShade;
void main(){
  float ph = aBird.w * 6.2832, nearF = step(.5, aBird.w);
  float t = uTime * mix(.16, .23, nearF) + aBird.x * .02 + mix(uFlock.x, uFlock.y, nearF);
  // two flocks: one far over the west, one nearer on a round above the square (never lower than 30 m: far above the line)
  vec3 c = mix(vec3(-150. + cos(t) * 70., 78. + sin(t * 1.7) * 9., -215. + sin(t) * 55.), vec3(-66. + cos(t) * 40., 58. + sin(t * 1.3) * 5., -176. + sin(t) * 44.), nearF);
  vec3 off = vec3(aBird.x, max(aBird.y, -8.), aBird.z) + vec3(sin(uTime * .5 + ph), sin(uTime * .37 + ph * 2.), cos(uTime * .43 + ph)) * 3.;
  vec2 fwd = normalize(vec2(-sin(t), cos(t))); vec2 right = vec2(-fwd.y, fwd.x);
  float flap = sin(uTime * 7. + ph * 3.) * .9;
  vec3 lp = position; lp.y += abs(lp.x) * flap * .55;
  vec3 wp = c + off + vec3(right * lp.x + fwd * lp.z, lp.y).xzy;
  vShade = .5 + .5 * flap;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`,Zt=`
varying float vShade;
uniform vec3 uFogCool;
void main(){ gl_FragColor = vec4(mix(vec3(.05, .055, .075), uFogCool, .35 + .1 * vShade), 1.); }`;function Qt(t,a,l){const v=new q.InstancedBufferGeometry;v.setAttribute("position",new q.Float32BufferAttribute([-.9,0,.1,0,0,-.28,0,0,.3,.9,0,.1],3)),v.setIndex([0,2,1,1,2,3]);const s=[];for(let h=0;h<l;h++)s.push(t.gauss()*16,t.gauss()*6,t.gauss()*16,t());v.setAttribute("aBird",new q.InstancedBufferAttribute(new Float32Array(s),4)),v.instanceCount=l,a.uFlock={value:new q.Vector2(t()*Math.PI*2,t()*Math.PI*2)};const i=new q.Mesh(v,new q.ShaderMaterial({uniforms:a,vertexShader:$t,fragmentShader:Zt,side:q.DoubleSide}));return i.frustumCulled=!1,i}function Ge(t,a,l,v,s,i,h=!1){let x=0;for(let c=0;c<a.length;c++){const n=a[c],p=a[(c+1)%a.length],m=Math.hypot(p[0]-n[0],p[1]-n[1])||1;let b=x,w=x+m;h&&Math.abs(p[0]-n[0])<1e-6?(b=n[1],w=p[1]):h&&Math.abs(p[1]-n[1])<1e-6&&(b=n[0],w=p[0]);const o=[(p[1]-n[1])/m,0,-(p[0]-n[0])/m],f=n.length>3?[n[2],0,n[3]]:o,e=p.length>3?[p[2],0,p[3]]:o;t.quad([p[0],l,p[1]],[n[0],l,n[1]],[n[0],v,n[1]],[p[0],v,p[1]],[e,f,f,e],[w,l,b,v],s,i),x+=m}}function Oe(t,a,l,v,s,i=12){const h=[],x=[[a-s,l+s,-90],[a-s,v-s,0],[t+s,v-s,90],[t+s,l+s,180]];for(const[c,n,p]of x)for(let m=0;m<=i;m++){const b=(p+90*m/i)*Math.PI/180,w=Math.cos(b),o=Math.sin(b);h.push(i>1?[c+s*w,n+s*o,w,o]:[c+s*w,n+s*o])}return h}const Fe=-130,Yt=["#8c3b2e","#3f5f4a","#b98a3a","#34465e"].map(t=>_(t));function De(t,a,l,v,s,i,h){const x=Yt[(h%4+4)%4],c=l+v*1.9,n=[0,.3,9,9],p=[3,3,5,5],m=(f,e,u)=>a?[e,u,f]:[f,u,e],b=(f,e,u)=>a?[e,u,f]:[f,u,e],w=(f,e,u,z,W)=>{const T=[e[0]-f[0],e[1]-f[1],e[2]-f[2]],R=[u[0]-f[0],u[1]-f[1],u[2]-f[2]],M=[T[1]*R[2]-T[2]*R[1],T[2]*R[0]-T[0]*R[2],T[0]*R[1]-T[1]*R[0]];M[0]*W[0]+M[1]*W[1]+M[2]*W[2]<0?t.quad(z,u,e,f,W,p,x,n):t.quad(f,e,u,z,W,p,x,n)},o=Math.hypot(1.1,1.9);w(m(s,l,4.6),m(i,l,4.6),m(i,c,3.5),m(s,c,3.5),b(0,v*1.1/o,1.9/o)),w(m(s,c,3.2),m(i,c,3.2),m(i,c,3.5),m(s,c,3.5),b(0,v,0));for(const[f,e]of[[s,-1],[i,1]])w(m(f,l,4.6),m(f,c,3.5),m(f,c,3.2),m(f,l,4.3),b(e,0,0))}const Xt=14,Ue=(t,a,l)=>!t||t.nearestXZ(a,l).dist>=Xt;function Jt(t,a,l,v,s,i=v){const h=(o,f=.86)=>[o[0]*f,o[1]*f,o[2]*f],x=_("#2c4a24"),c=_("#5a4030");for(const o of[...a.east,...a.west]){const f=o.n[0]==="E";if(o.pod>0){const e=f?26:-26,u=f?-1:1,z=f?"wsn":"esn",W=o.z1<=Fe,T=W?-.54:.1;for(let k=Math.ceil(W?(o.z0+.54)/6.4:o.z0/6.4);k*6.4+(W?.54:1.2)<o.z1;k++)t.box(Math.min(e,e+u*.5),Math.max(e,e+u*.5),0,o.pod,k*6.4+T,k*6.4+T+1.08,h(o.podCol,.95),[0,o.seed,1.2,.6],o.podCol,null,z);if(t.box(Math.min(e,e+u*.75),Math.max(e,e+u*.75),o.pod-.7,o.pod+.5,o.z0,o.z1,h(o.podCol,.9),[0,o.seed,2.4,1.2],A.roof,null,z+"t"),t.box(Math.min(e,e+u*.2),Math.max(e,e+u*.2),0,.8,o.z0,o.z1,h(o.podCol,.7),[0,o.seed,2.4,.8],null,null,z+"t"),W){for(let d=Math.ceil(o.z0/6.4);(d+1)*6.4<=o.z1;d++)De(t,!0,e,u,d*6.4+.75,(d+1)*6.4-.75,d),t.box(Math.min(e,e+u*.3),Math.max(e,e+u*.3),7.4,o.pod-.7,d*6.4+2.98,d*6.4+3.42,h(o.podCol,.95),[0,o.seed,1.2,.6],null,null,z);t.box(Math.min(e,e+u*.62),Math.max(e,e+u*.62),6.85,7.5,o.z0,o.z1,h(o.podCol,.8),[0,o.seed,2.4,.65],null,null,z+"t");for(let d=7.4+3.7;d<o.pod-1.5;d+=3.7)t.box(Math.min(e,e+u*.6),Math.max(e,e+u*.6),d-.22,d,o.z0,o.z1,h(o.podCol,.88),[0,o.seed,9,9],null,null,z+"t");const k=Math.min(e,o.px),r=Math.max(e,o.px);for(const[d,y]of[[o.z0,-1],[o.z1,1]]){t.box(k,r,o.pod-.7,o.pod+.5,Math.min(d,d+y*.5),Math.max(d,d+y*.5),h(o.podCol,.9),[0,o.seed,2.4,1.2],A.roof,null,"wesnt");for(let g=Math.ceil((k+.5)/6.4);(g+1)*6.4<=r&&Math.abs((g+.5)*6.4)<60;g++)De(t,!1,d,y,g*6.4+.75,(g+1)*6.4-.75,g)}}else t.box(Math.min(e,e+u*2.8),Math.max(e,e+u*2.8),4.7,5,o.z0+2,o.z1-2,h(o.podCol,.6),[0,o.seed,2.4,.3],h(o.podCol,.5),[0,o.seed,3,3],z+"t"),o.pod>=14&&t.box(Math.min(e,e+u*.45),Math.max(e,e+u*.45),o.pod*.5-.3,o.pod*.5+.3,o.z0,o.z1,h(o.podCol,.9),[0,o.seed,2.4,.6],null,null,z+"t");const R=o.px,M=Math.min(e,R),S=Math.max(e,R);t.box(M,S,o.pod,o.pod+1,o.z0,o.z0+.4,h(o.podCol),[0,o.seed,2.4,1]),t.box(M,S,o.pod,o.pod+1,o.z1-.4,o.z1,h(o.podCol),[0,o.seed,2.4,1])}for(const e of o.t){const u=o.pod>0?o.pod:0,z=e.x1-e.x0,W=e.z1-e.z0,T=!e.round&&!e.fins&&!e.setbacks&&e.h>60,R=e.h>100?i():1,M=ae(14,26,Math.min(1,R*2)),S=T?i():1,k=ae(.25,.75,Math.min(1,S*2));if(!(o.pod>0)){const r=f?e.x0:e.x1,d=f?-1:1,y=e.round?7:e.corner?e.corner.c+.5:2;if(o.z1<=Fe&&Math.abs(r)<34){const g=e.bay*(e.bay>5?1:2);for(let C=Math.ceil((e.z0+.5)/g);(C+1)*g<=e.z1;C++)De(t,!0,r,d,C*g+.75,(C+1)*g-.75,C);for(let C=Math.ceil((e.x0+.5)/g);(C+1)*g<=e.x1;C++)De(t,!1,e.z1+.45,1,C*g+.75,(C+1)*g-.75,C)}else Math.abs(r)<34&&e.z1-e.z0>2*y+4&&t.box(Math.min(r,r+d*2.8),Math.max(r,r+d*2.8),4.7,5,e.z0+y,e.z1-y,h(e.col,.6),[0,e.seed,2.4,.3],h(e.col,.5),[0,e.seed,3,3],(f?"wsn":"esn")+"t")}if(e.round&&(Ge(t,Oe(e.x0,e.x1,e.z0,e.z1,7),u,e.h,e.col,[e.style,e.seed,e.bay,e.fl]),Ge(t,Oe(e.x0+2,e.x1-2,e.z0+2,e.z1-2,6),e.h,e.h+6,h(e.col),[3,e.seed,1.6,6]),t.box(e.x0+1,e.x1-1,e.h-.2,e.h,e.z0+1,e.z1-1,A.roof,[0,e.seed,3,3])),e.corner){const r=Oe(e.x0,e.x1,e.z0,e.z1,e.corner.c,e.corner.seg>1?10:1),d=r.slice().reverse();Ge(t,r,u,e.h,e.col,[e.style,e.seed,e.bay,e.fl],!0);for(let y=1;y+2<d.length;y+=2)t.quad([d[0][0],e.h,d[0][1]],[d[y][0],e.h,d[y][1]],[d[y+1][0],e.h,d[y+1][1]],[d[y+2][0],e.h,d[y+2][1]],[0,1,0],[d[0][0],d[0][1],d[y+1][0],d[y+1][1]],A.roof,[0,e.seed,3,3])}if(e.setbacks)for(let r=0;r*46<e.h-u;r++){const d=u+r*46,y=Math.min(e.h,d+46),g=e.x0+r*2.8,C=e.z0+r*1.8,N=e.z1-r*1.8;t.box(g,e.x1,d,y,C,N,e.col,[e.style,e.seed,e.bay,e.fl],x,[8,e.seed,3,3]),r>0&&t.box(g-2.6,g-.3,d,d+.9,C-1.4,N+1.4,h(e.col,.7),[0,e.seed,2,.9],x,[8,e.seed+.2,3,3])}if(e.crown)for(let r=1;r<=e.crown;r++)t.box(e.x0+r*3.2,e.x1-r*3.2,e.h+(r-1)*7,e.h+r*7,e.z0+r*9,e.z1-r*9,e.col,[e.style,e.seed,e.bay,e.fl],A.roof,[0,e.seed,3,3]);if(e.fins){const r=f?e.x0:e.x1,d=f?-1:1;for(let y=Math.ceil(e.z0/e.bay);y*e.bay<e.z1;y++)t.box(Math.min(r,r+d*.85),Math.max(r,r+d*.85),u,e.h+2.5,y*e.bay-.13,y*e.bay+.13,_("#b9c2cc"),[0,e.seed,9,9],null,null,f?"wsn":"esn");t.box(e.x0+3,e.x1-3,e.h,e.h+8,e.z0+5,e.z1-5,h(e.col,.8),[3,e.seed,3,8])}if(e.garden){t.box(e.x0,e.x1,e.h,e.h+1.1,e.z0,e.z0+.4,h(e.col),[0,e.seed,2,1]),t.box(e.x0,e.x1,e.h,e.h+1.1,e.z1-.4,e.z1,h(e.col),[0,e.seed,2,1]),t.box(e.x0,e.x0+.4,e.h,e.h+1.1,e.z0,e.z1,h(e.col),[0,e.seed,2,1]),t.box(e.x0+1.5,e.x1-8,e.h,e.h+.5,e.z0+1.5,e.z1-1.5,h(e.col,.6),[0,e.seed,2,.5],x,[8,e.seed,3,3]);for(let r=u+e.fl*2;r<e.h-2;r+=e.fl*2)t.box(e.x0-.9,e.x0,r-.18,r,e.z0+1,e.z1-1,h(e.col,.8),[0,e.seed,2,.2],null,null,"wsnt")}if(!e.round&&!e.fins){const r=f?e.x0:e.x1,d=f?-1:1,y=f?"wsn":"esn",g=Math.min(e.h,u+(e.setbacks?46:84)),C=e.style,N=e.corner?e.corner.c:0,G=e.z0+N,j=e.z1-N,I=(L,V,P,K)=>{L-P/2>G&&L+P/2<j&&t.box(Math.min(r,r+d*V),Math.max(r,r+d*V),u,g,L-P/2,L+P/2,K,[0,e.seed,9,9],null,null,y)},se=(L,V,P,K)=>t.box(Math.min(r,r+d*V),Math.max(r,r+d*V),L-P,L,G,j,K,[0,e.seed,9,9],null,null,y+"t"),B=Math.ceil((u+1.5)/e.fl)*e.fl;if(C===1||C===4){for(let L=Math.ceil(e.z0/e.bay);L*e.bay<=e.z1;L++)I(L*e.bay,.45,e.bay*.36,h(e.col,1.05));for(let L=B;L<g;L+=e.fl)se(L+e.fl*.17,.55,.22,h(e.col,.9))}else if(C===5){for(let L=B;L<g;L+=e.fl)se(L+e.fl*.3,.6,.16,h(e.col,1.35));for(let L=Math.ceil(e.z0/(e.bay*4));L*e.bay*4<=e.z1;L++)I(L*e.bay*4,.34,.3,h(e.col,1.15))}else if(C===6){for(let L=Math.ceil(e.z0/e.bay);L*e.bay<=e.z1;L++)I(L*e.bay+e.bay*.15,.6,e.bay*.28,h(e.col,1.04));for(let L=B+e.fl*3;L<g;L+=e.fl*4)se(L,.75,.3,h(e.col,.9))}else if(C===2){for(let L=Math.ceil(e.z0/(e.bay*2));L*e.bay*2<=e.z1;L++)I(L*e.bay*2,.3,.14,_("#aab4c0"));for(let L=B+e.fl*5;L<g;L+=e.fl*6)se(L+e.fl*.2,.42,.25,h(e.col,.8))}}if(o.n==="E7"||o.n==="W5"){for(let r=Math.ceil(e.x0/e.bay);r*e.bay<=e.x1;r++)t.box(r*e.bay-e.bay*.18,r*e.bay+e.bay*.18,0,e.h,e.z1,e.z1+.45,h(e.col,1.05),[0,e.seed,9,9],null,null,"swe");for(let r=e.fl;r<e.h-1;r+=e.fl)t.box(e.x0,e.x1,r+e.fl*.17-.22,r+e.fl*.17,e.z1,e.z1+.55,h(e.col,.9),[0,e.seed,9,9],null,null,"swet");t.box(e.x0-.5,e.x1+.5,e.h-.6,e.h+.6,e.z0-.5,e.z1+.6,h(e.col,.85),[0,e.seed,2.4,1.2],A.roof,[11,e.seed,3,3]),t.box(e.x0+4,e.x1-4,e.h+.6,e.h+4.4,e.z0+4,e.z1-4,h(e.col,.9),[1,e.seed,3,3.8],A.roof,[11,e.seed,3,3])}if(!e.garden&&!e.round&&!e.crown&&!e.fins&&e.h>40){const r=e.h,d=5+l()*4,y=(e.corner?e.corner.c:0)+2.5;if(e.style===2)t.box(e.x0+y,e.x1-y,r,r+d+4,e.z0+y,e.z1-y,h(e.col,1.1),[12,e.seed,e.bay*2,d+4],A.roof,[0,e.seed,3,3]),t.box(e.x0+y-.5,e.x1-y+.5,r+d+4,r+d+4.5,e.z0+y-.5,e.z1-y+.5,h(e.col,.6),[0,e.seed,3,.5]);else if(e.style===6){for(let g=Math.ceil((e.z0+y)/e.bay);g*e.bay<e.z1-y;g++)for(const C of[e.x0,e.x1])t.box(C-.3,C+.3,r-1,r+6.5,g*e.bay+e.bay*.15-.2,g*e.bay+e.bay*.15+.2,h(e.col,1.04),[0,e.seed,9,9]);t.box(e.x0+y,e.x1-y,r,r+d,e.z0+y,e.z1-y,h(A.conc,.75),[0,e.seed,3,3])}else if(e.style===5&&!e.setbacks)for(let g=1;g<=2;g++)t.box(e.x0+y*g,e.x1-y*g,r+(g-1)*8,r+g*8,e.z0+y*g,e.z1-y*g,e.col,[e.style,e.seed,e.bay,e.fl],x,[8,e.seed,3,3]);else t.box(e.x0+z*.25,e.x1-z*.25,r,r+d,e.z0+W*.3,e.z1-W*.3,h(A.conc,.75),[0,e.seed,3,3]),t.box(e.x0+.3,e.x1-.3,r,r+1.6,e.z0+.3,e.z0+.7,h(e.col,.7),[0,e.seed,3,1.6]),t.box(e.x0+.3,e.x1-.3,r,r+1.6,e.z1-.7,e.z1-.3,h(e.col,.7),[0,e.seed,3,1.6])}if(e.h>100&&R<.5){const r=(e.x0+e.x1)/2,d=(e.z0+e.z1)/2,y=e.h+22,g=_("#3a3e46");t.box(r-.6,r+.6,e.h,y+M*.35,d-.6,d+.6,g,[0,.2,9,9]),t.box(r-.22,r+.22,y+M*.35,y+M,d-.22,d+.22,g,[0,.2,9,9])}if(T&&S<.5){const r=f?e.x0:e.x1,d=f?-1:1,y=(e.corner?e.corner.c:0)+1.5,g=e.bay*(e.bay<2.2?4:2),C=Math.round(ae(e.z0+y,e.z1-y-g,k)/e.bay)*e.bay,N=f?"wsn":"esn",G=_("#2b2e33");for(let j=Math.ceil((u+8)/e.fl)*e.fl;j<e.h-e.fl;j+=e.fl)t.box(Math.min(r,r+d*1.3),Math.max(r,r+d*1.3),j-.2,j,C,C+g,h(e.col,.8),[0,e.seed,9,9],null,null,N+"t"),t.box(Math.min(r+d*1.22,r+d*1.3),Math.max(r+d*1.22,r+d*1.3),j,j+1.05,C,C+g,G,[0,e.seed,9,9],null,null,"wesn")}}}const n=a.east[5];t.box(27.2,60,n.pod,n.pod+.35,n.z0+1.5,n.z1-1.5,h(A.lime,.6),[0,.5,2,.35],x,[8,.33,3,3]);const p=[29.5,34.3,39.1,44],m=[0,2,4,6],b=A.pale;for(let o=0;o<3;o++){t.box(p[o],44,m[o],m[o+1],-50,-8,b,[0,.45,1.2,.5],b,[0,.45,1.2,.6],"wsnt");for(let f=0;f<4;f++)t.box(p[o]-(4-f)*.56,p[o],m[o],m[o]+(f+1)*.5,-37,-21,b,[0,.45,1.2,.5],b,[0,.45,1.2,.6],"wsnt");for(const[f,e]of[[-49,-38.5],[-19.5,-9]])t.box(p[o]+.8,p[o+1]-.5,m[o+1],m[o+1]+.55,f,e,h(b,.75),[0,.5,2,.55],x,[8,.61+o*.1,3,3])}const w=[];for(const o of[...a.east,...a.west]){if(!(o.pod>0))continue;const f=o.n[0]==="E",e=f?26:o.px,u=f?o.px:-26,z=o.pod;for(let W=e+4.5;W<u-3;W+=13)for(let T=o.z0+4.5;T<o.z1-3;T+=13){const R=v(),M=W+v.range(-2,2),S=T+v.range(-2,2),k=v();if(o.t.some(d=>M>d.x0-3.5&&M<d.x1+3.5&&S>d.z0-3.5&&S<d.z1+3.5)||o.roofGarden&&M<62)continue;const r=!Ue(s,M,S);if(R<.3&&!r)t.box(M-.9,M+.9,z,z+.7,S-.9,S+.9,h(A.conc,.8),[0,.4,2,.7],x,[8,.4,3,3]),w.push([M,z+.7,S,4.2+k*1.6]);else if(R<.5){for(const[d,y]of[[-1.8,-1.3],[1.8,-1.3],[-1.8,1.3],[1.8,1.3]])t.box(M+d-.08,M+d+.08,z,z+2.5,S+y-.08,S+y+.08,c,[0,.3,9,9]);for(const d of[-1.3,1.3])t.box(M-2.1,M+2.1,z+2.5,z+2.66,S+d-.07,S+d+.07,c,[0,.3,9,9]);for(let d=-3;d<=3;d++)t.box(M+d*.6-.05,M+d*.6+.05,z+2.66,z+2.76,S-1.6,S+1.6,c,[0,.3,9,9])}else R<.64?(t.box(M-.9,M+.9,z,z+1.3,S-.9,S+.9,h(A.dark,.9),[0,.3,9,9]),t.box(M-1.25,M+1.25,z+1.3,z+3.5+k,S-1.25,S+1.25,c,[0,.6,.35,9],h(A.dark,1.2),[0,.6,3,3])):R<.78&&t.box(M-2.4,M+2.4,z,z+3+k,S-1.7,S+1.7,h(A.conc,.8),[0,.5,1.2,.4],A.roof,[0,.5,3,3])}}return w}export{to as buildCity,dt as cityEnv,ut as cityPlan,Ze as layPlan,Ke as makeSunAt};
