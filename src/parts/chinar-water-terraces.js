import*as w from"three";import{clamp as oe,smoothstep as Fe}from"../kit/core.js";const O=w.Vector3,Ye=["#C4381C","#F5A21E","#1D4FA8","#2B4F5E","#15161B","#DCE3EA","#9A8C80"],P=84,b=100,D=16,j=30,J=100,we=-156,M=-80,Y=24,G=2,re=14,Ne=-91,Te=70,ae=14,pe=17,ce=`
uniform float uHcTime, uHcSnow, uHcLamp, uHcWet, uHcMist;
uniform vec4 uHcGard;
uniform vec3 uHcSun, uHcSunCol, uHcSkyTop, uHcSkyHor, uHcBand, uHcTree, uHcCam, uHcWater, uHcCaus, uHcAccent, uHcLeaf;
float hcHash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float hcN2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hcHash(i), hcHash(i + vec2(1., 0.)), f.x), mix(hcHash(i + vec2(0., 1.)), hcHash(i + vec2(1., 1.)), f.x), f.y); }
float hcFbm(vec2 p){ return hcN2(p) * .55 + hcN2(p * 2.13 + 7.1) * .3 + hcN2(p * 4.31 + 3.7) * .15; }
// a drifting web of light, ~0..1.6
float hcCaus(vec2 p, float t){
  vec2 q = p + vec2(sin(p.y * 1.3 + t * .9), cos(p.x * 1.1 - t * .7)) * .55;
  float a = sin(q.x * 2.1 + t) + sin(q.y * 2.3 - t * 1.1) + sin((q.x + q.y) * 1.4 + t * .6);
  vec2 r = p * 1.7 + vec2(cos(p.y * .9 - t * .6), sin(p.x * 1.2 + t * .8)) * .6 + 4.;
  float b = sin(r.x * 2.3 - t * .8) + sin(r.y * 1.9 + t) + sin((r.x - r.y) * 1.3 - t * .5);
  float l1 = 1. - abs(a) / 3., l2 = 1. - abs(b) / 3.;
  l1 *= l1; l1 *= l1; l2 *= l2; l2 *= l2;
  return (l1 + l2) * .45 + l1 * l2 * .9;
}
// analytic surroundings for reflections: cobalt sky, pale horizon, a wall and tree band, the sun, dark water below
vec3 hcEnv(vec3 r){
  float h = r.y;
  vec3 c = mix(uHcSkyHor, uHcSkyTop, smoothstep(0., .55, h));
  float az = atan(r.z, r.x + 1e-4);
  float crown = .5 + .5 * sin(az * 23.) * sin(az * 7. + 1.3);
  float tb = smoothstep(.03, .07, h) * (1. - smoothstep(.1 + .1 * crown, .16 + .12 * crown, h));
  c = mix(c, uHcTree * (.55 + .9 * crown), tb * .85);
  c = mix(c, uHcBand, (1. - smoothstep(.02, .06, h)) * step(-.02, h));
  c = mix(c, uHcWater * (.5 + .5 * smoothstep(-.6, 0., h)), 1. - smoothstep(-.03, 0., h));
  float s = max(dot(r, uHcSun), 0.); float s2 = s * s; s2 *= s2; s2 *= s2; s2 *= s2;
  return c + uHcSunCol * (s2 * s2 * 1.1 + s2 * .03);
}
// the garden's baked light. uHcGard: x = shadow strength, y = fallen leaves on the lawns, z = spring (0 autumn, 1 april), w = spare
float hcGround(float z){ return z > 330. ? 32. : (z > 205. ? 24. : (z > 100.6 ? 16. : 0.)); }
float hcJali(vec2 q){ vec2 a = abs(fract(vec2(q.x + q.y, q.x - q.y) * .78) - .5); float d = min(a.x, a.y) - .2; float st = .16 - length(fract(vec2(q.x + q.y, q.x - q.y) * .78 + .5) - .5); return max(d, -1.) * step(st, 0.) - step(0., st) * .05; }
// the shadow of one row of chinars d metres down-sun of it, hy metres above the ground: 1 lit .. 0 dark
float hcRow(float d, float hy, float pz, float ky, float kz, float ph){
  float hr = hy + ky * d, zr = pz + kz * d;
  float has = 1. - step(abs(zr - 326.), 14.) - step(zr, 89.6);          // no tree stands on the chute or past the last one (z 103.6, at the terrace edge)
  float m = abs(mod(zr - 1.6 * step(zr, 116.) - 18. + 14., 28.) - 14.);
  float trunk = (1. - smoothstep(1.5, 2.7 + d * .025, m)) * (1. - smoothstep(13., 19., hr));
  float crown = smoothstep(12., 20., hr) * (1. - smoothstep(40., 48., hr));
  float dap = smoothstep(.38, .7, hcN2(vec2(zr * .13 + uHcTime * .02 + ph, hr * .17)) * .6 + hcN2(vec2(zr * .45 + ph, hr * .5 - uHcTime * .05)) * .4);
  return mix(1., (1. - trunk * .9) * mix(1., dap * .85, crown), clamp(has, 0., 1.));
}
float hcGarden(vec3 p){
  if (p.z < 101.4) return 1.;
  float ax = max(abs(uHcSun.x), .05); float sx = uHcSun.x < 0. ? 1. : -1.;
  float xr = p.x * sx, ky = uHcSun.y / ax, kz = uHcSun.z / ax;
  if (p.z > 480.3 && abs(p.x) < 15.6 && p.y < 64.) {            // the gatehouse hall: sun only through the screen and the arch
    float d = xr + 15.; float ys = p.y + ky * d, zs = p.z + kz * d;
    float top = 47.6 - 4.4 * min(abs(zs - 504.) / 8., 1.);
    float soft = smoothstep(14., 70., d);
    float scr = step(496., zs) * step(zs, 512.) * step(36., ys) * step(ys, top) * mix(step(0., hcJali(vec2(zs, ys))), .3, soft) * mix(.8, .5, soft) * step(p.y, 32.75);   // the lattice lies on the floor, the kerbs and the channel only
    float tz = (p.z - 480.) / max(-uHcSun.z, .05); float xa = p.x + uHcSun.x * tz, ya = p.y + uHcSun.y * tz;
    float arc = step(abs(xa), 8.8) * step(ya, 55.5 - abs(xa) * .9) * step(.001, -uHcSun.z);
    return max(scr, arc);
  }
  float g = hcGround(p.z);
  float lit = smoothstep(g + 20.5, g + 23.5, p.y + ky * (xr + 100.));
  // both rows of chinars (34 m either side of the axis) throw trunk stripes and a shifting crown dapple down-sun
  float d = xr + 34.;
  if (d > 1.) lit *= hcRow(d, p.y - g, p.z, ky, kz, 0.);
  d = xr - 34.;
  if (d > 1.) lit *= hcRow(d, p.y - g, p.z, ky, kz, 5.3);
  // the long shadows of the smaller trees (orchards, cypress pairs, the poplars beyond the wall), drawn out along the sun's
  // azimuth across lawn, paving and water, their edges a moving dapple
  vec2 sd = normalize(vec2(uHcSun.x, uHcSun.z) + vec2(1e-4, 0.)); float al = dot(p.xz, sd), ac = dot(p.xz, vec2(-sd.y, sd.x));
  float st = hcN2(vec2(ac * .09, al * .016 + 3.)) * .62 + hcN2(vec2(ac * .21 + 7., al * .045)) * .38;
  float dp = hcN2(vec2(ac * .9 + uHcTime * .06, al * .7 - uHcTime * .04));
  lit *= 1. - .78 * smoothstep(.55, .64, st + (dp - .5) * .13) * (1. - smoothstep(3., 14., p.y - g));
  return mix(1., lit, uHcGard.x);
}
// the water-light inside the gallery: broad soft bands thrown by the sun through the falling sheet (xl, yl = where
// the ray crossed it), crawling sideways and sliding down with the water, ~0..1.6
float hcBand(float xl, float yl){
  float t = uHcTime;
  float a = hcN2(vec2(xl * .19 + yl * .07 + t * .15, yl * .1 - t * .17));
  float b = hcN2(vec2(xl * .4 - yl * .1 - t * .1 + 9., yl * .21 + t * .32));
  float broad = smoothstep(.3, .7, a * .68 + b * .32);                 // bands several metres wide with edges metres soft
  float web = hcCaus(vec2(xl * .3, yl * .26 + t * .36), t * .7);
  return broad * (.48 + .5 * web) + .015 + .035 * web;
}
// inside the gallery: x = how much direct sun arrives (0 in the shelf's shadow, streaked where it has come
// through the sheet), y = how much bounced water-light there is
// (z = the band of water-light itself, for surfaces that glow in it)
vec3 hcGal(vec3 p){
  float inside = step(abs(p.x), 34.5) * step(${(P+.5).toFixed(1)}, p.z) * step(p.z, ${(b+1.2).toFixed(1)}) * step(p.y, 15.6);
  float lz = max(-uHcSun.z, .05);
  float t = (p.z - ${P.toFixed(1)}) / lz;
  float yl = p.y + t * uHcSun.y, xl = p.x + t * uHcSun.x;
  float reach = mix(.6, 1., 1. - smoothstep(13., 23., yl)) * step(.001, -uHcSun.z);
  float open = smoothstep(29., 31.5, abs(p.x + t * uHcSun.x * .3));     // only the last metres by the mouths take the sun unfiltered
  float band = hcBand(xl, yl) * reach;
  float sun = reach * open;                                             // everywhere else the sun arrives only as water-light (z)
  float deep = smoothstep(35., 25., abs(p.x));
  vec3 gr = mix(vec3(1., 0., 0.), vec3(sun, deep, band), inside); gr.x *= hcGarden(p); return gr;
}
`;function Ze(H,l,y){const e=o=>new w.Color(o),t=l==="night",r=l==="snow"||t,S=e(H[2]),T=e(H[2]).lerp(e(H[5]),.62);r&&(S.lerp(e(H[5]),.55),T.lerp(e(H[5]),.6)),t&&(S.set("#0a1430"),T.set("#1c2c52"));const d=l==="april"?e("#7fae3c"):e(H[0]).lerp(e(H[1]),.25);t&&d.multiplyScalar(.08);const f=e(H[6]).lerp(e(H[2]),.3).multiplyScalar(t?.12:.7);return{uHcTime:{value:0},uHcSnow:{value:r?1:0},uHcLamp:{value:t?1:0},uHcWet:{value:1},uHcSun:{value:y.clone().normalize()},uHcSunCol:{value:t?e("#9fb4e8").multiplyScalar(.5):r?e("#fff2e2").multiplyScalar(.8):e("#fff0d8").multiplyScalar(1.6)},uHcSkyTop:{value:S},uHcSkyHor:{value:T},uHcBand:{value:f},uHcTree:{value:d},uHcCam:{value:new O(0,10,200)},uHcWater:{value:e(H[3]).multiplyScalar(t?.25:.55)},uHcCaus:{value:t?e("#8fa6d8").multiplyScalar(.35):e("#d8f2e0")},uHcAccent:{value:e(H[1]).multiplyScalar(.8)},uHcLeaf:{value:e(l==="april"?"#4f8a2c":"#2f5a22")},uHcGard:{value:new w.Vector4(l==="october"||l==="april"?1:l==="snow"?.3:.75,l==="april"?.06:1,l==="april"?1:0,l==="april"?1:t?.22:.3)},uHcBurst:{value:0},uHcHole:{value:new w.Vector4(0,-100,0,0)},uHcVeil:{value:new w.Vector4(0,0,0,0)},uHcMist:{value:1},uHcBend:{value:new w.Vector2(1,0)},uHcPortal:{value:e("#ffb650")}}}function de(H,l,y,e){return H.onBeforeCompile=t=>{Object.assign(t.uniforms,l),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 aux; attribute vec2 huv; varying vec4 vAux; varying vec2 vHcUv; varying vec3 vHcP; varying vec3 vHcN;
uniform float uHcTime;
`+(e.vpars||"")).replace("#include <begin_vertex>",`#include <begin_vertex>
        ${e.vert||""}
        vec4 hcP4 = vec4(transformed, 1.); vec3 hcN3 = normal;
        #ifdef USE_INSTANCING
          hcP4 = instanceMatrix * hcP4; hcN3 = mat3(instanceMatrix) * hcN3;
        #endif
        vHcP = hcP4.xyz; vHcN = hcN3; vAux = aux; vHcUv = huv;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
varying vec4 vAux; varying vec2 vHcUv; varying vec3 vHcP; varying vec3 vHcN;
`+ce+(e.pars||"")).replace("#include <color_fragment>",`#include <color_fragment>
        vec3 hp = vHcP; vec3 hn = normalize(vHcN + vec3(0., 1e-5, 0.)); vec3 hcAdd = vec3(0.); float hcWet = 0.; float hcGloss = 0.;
        vec3 hv = normalize(uHcCam - hp + vec3(0., 1e-4, 0.));
        ${e.color||""}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        ${e.rough||""}`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
        ${e.light||""}`).replace("#include <opaque_fragment>",`outgoingLight += hcAdd;
        #include <opaque_fragment>`)},H.customProgramCacheKey=()=>"hc-cwt-"+y,H}function ne(){const H=[],l=[],y=[],e=[],t=[],r={col:[1,1,1],ao:1,kind:0,az:0,aw:0,n:0},S=(d,f,o,p,c,m)=>{H.push(d[0],d[1],d[2]),l.push(f,o,p),y.push(r.col[0],r.col[1],r.col[2]),e.push(r.ao*(d[3]===void 0?1:d[3]),r.kind,r.az,r.aw),t.push(c,m),r.n++};r.setCol=(d,f=1)=>(r.col=[d.r*f,d.g*f,d.b*f],r),r.tri=(d,f,o,p,c,m,s)=>{const h=f[0]-d[0],g=f[1]-d[1],u=f[2]-d[2],v=o[0]-d[0],k=o[1]-d[1],C=o[2]-d[2];let A=g*C-u*k,q=u*v-h*C,F=h*k-g*v;const a=Math.hypot(A,q,F);if(a<1e-9)return;A/=a,q/=a,F/=a;const n=s||[[0,0],[0,0],[0,0]];A*p+q*c+F*m<0?(S(d,-A,-q,-F,n[0][0],n[0][1]),S(o,-A,-q,-F,n[2][0],n[2][1]),S(f,-A,-q,-F,n[1][0],n[1][1])):(S(d,A,q,F,n[0][0],n[0][1]),S(f,A,q,F,n[1][0],n[1][1]),S(o,A,q,F,n[2][0],n[2][1]))},r.quad=(d,f,o,p,c,m,s,h=0,g=0)=>{const u=h*.5,v=r.az,k=r.aw;h>0&&(r.az=u,r.aw=g);const C=[[-u,0],[u,0],[u,g],[-u,g]];r.tri(d,f,o,c,m,s,[C[0],C[1],C[2]]),r.tri(d,o,p,c,m,s,[C[0],C[2],C[3]]),r.az=v,r.aw=k},r.box=(d,f,o,p,c,m,s="")=>{const h=p-d,g=c-f,u=m-o;s.includes("x")||r.quad([d,f,m],[d,f,o],[d,c,o],[d,c,m],-1,0,0,u,g),s.includes("X")||r.quad([p,f,o],[p,f,m],[p,c,m],[p,c,o],1,0,0,u,g),s.includes("z")||r.quad([d,f,o],[p,f,o],[p,c,o],[d,c,o],0,0,-1,h,g),s.includes("Z")||r.quad([p,f,m],[d,f,m],[d,c,m],[p,c,m],0,0,1,h,g),s.includes("y")||r.quad([d,f,o],[p,f,o],[p,f,m],[d,f,m],0,-1,0),s.includes("Y")||r.quad([d,c,o],[p,c,o],[p,c,m],[d,c,m],0,1,0)},r.prism=(d,f,o,p=!0,c=1)=>{let m=0,s=0;for(const h of d)m+=h[0],s+=h[1];m/=d.length,s/=d.length;for(let h=0;h<d.length;h++){const g=d[h],u=d[(h+1)%d.length],v=Math.hypot(u[0]-g[0],u[1]-g[1]),k=(g[0]+u[0])/2-m,C=(g[1]+u[1])/2-s;r.quad([g[0],f,g[1],c],[u[0],f,u[1],c],[u[0],o,u[1]],[g[0],o,g[1]],k,0,C,v,o-f),p&&r.tri([m,o,s],[g[0],o,g[1]],[u[0],o,u[1]],0,1,0)}},r.ring=(d,f,o,p,c)=>{const m=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let s=0;s+1<d.length;s++){const h=d[s],g=d[s+1],u=g[0]-h[0],v=g[1]-h[1],k=Math.hypot(u,v)||1,C=v/k,A=-u/k;for(let q=0;q<4;q++){const F=m[q],a=m[(q+1)%4],n=(F[0]+a[0])/2,i=(F[1]+a[1])/2,x=(K,$)=>[f+$[0]*(p+K[0]),K[1],o+$[1]*(c+K[0]),K[2]],N=q%2===0?2*(p+h[0]):2*(c+h[0]);r.quad(x(h,F),x(h,a),x(g,a),x(g,F),n*C,A,i*C,Math.abs(u)<.02?N:0,k)}}},r.lathe=(d,f,o,p,c,m=0)=>{const s=d.map((u,v)=>{const k=d[Math.max(0,v-1)],C=d[Math.min(d.length-1,v+1)],A=C[0]-k[0],q=C[1]-k[1],F=Math.hypot(A,q)||1;return[q/F,-A/F]}),h=(u,v)=>{const k=m+v/c*Math.PI*2,C=d[u];return[[f+Math.cos(k)*C[0],o+C[1],p+Math.sin(k)*C[0],C[2]],[Math.cos(k)*s[u][0],s[u][1],Math.sin(k)*s[u][0]]]},g=(u,v,k)=>{for(const C of[u,v,k])S(C[0],C[1][0],C[1][1],C[1][2],0,0)};for(let u=0;u+1<d.length;u++)for(let v=0;v<c;v++){const k=h(u,v),C=h(u,v+1),A=h(u+1,v+1),q=h(u+1,v);d[u][0]>1e-4&&g(k,A,C),d[u+1][0]>1e-4&&g(k,q,A)}};const T=[["position",H,3],["normal",l,3],["color",y,3],["aux",e,4],["huv",t,2]];return r.geometry=()=>{const d=new w.BufferGeometry;for(const[f,o,p]of T)d.setAttribute(f,new w.Float32BufferAttribute(o,p));return d.computeBoundingSphere(),d},r.geometryAsync=async d=>{const f=new w.BufferGeometry;for(const[o,p,c]of T)f.setAttribute(o,new w.Float32BufferAttribute(p,c)),await d();return f.computeBoundingSphere(),f},r}function Ee(H,l,y,e,t=3,r=.09){const S=[],T=y-l,d=Math.max(1,e)*t;for(let f=0;f<=d;f++){const o=f/d,p=Math.PI*o;let c=-Math.cos(p)*H*.5,m=Math.pow(Math.sin(p),.8)*T*.86;const s=Math.max(0,1-Math.abs(c)/(.3*H));if(m+=T*.14*s*s,e>1){const h=1-r*(1-Math.abs(Math.sin(Math.PI*e*o)))*Math.sin(p);c*=h,m*=h}S.push([c,l+m])}return S}function te(H,l,y,e){const t=Ee(e.w,e.ySpring,e.yApex,e.foils??1,e.per??3,e.cusp??.09).map(c=>[c[0]+e.cx,c[1]]),r=[[e.cx-e.w/2,e.yBase],...t,[e.cx+e.w/2,e.yBase]],S=e.yBase>e.y0+.001,T=r.map((c,m)=>{if(m===0)return S?[e.s0,e.y0]:[e.s0,c[1]];if(m===r.length-1)return S?[e.s1,e.y0]:[e.s1,c[1]];const s=c[0]-e.cx,h=Math.max(c[1]-e.ySpring,0);if(h<.001)return[s<0?e.s0:e.s1,c[1]];const g=s<0?e.s0-e.cx:e.s1-e.cx,u=Math.abs(s)>1e-6?g/s:1e9,v=(e.y1-e.ySpring)/h;return u<v?[s<0?e.s0:e.s1,e.ySpring+h*u]:[e.cx+s*v,e.y1]}),d=(c,m,s,h,g)=>{const u=v=>{const k=l(v[0],v[1],c);return k[3]=g,k};for(let v=0;v+1<r.length;v++){const k=T[v],C=T[v+1];H.quad(u(r[v]),u(r[v+1]),u(C),u(k),m,s,h);const A=Math.abs(k[1]-e.y1)<1e-6,q=Math.abs(C[1]-e.y1)<1e-6;if(A!==q){const F=[A?C[0]:k[0],e.y1];H.tri(u(k),u(C),u(F),m,s,h)}else!A&&k[0]!==C[0]&&H.quad(u(k),u(C),u([C[0],e.y1]),u([k[0],e.y1]),m,s,h)}S&&H.quad(u([e.s0,e.y0]),u([e.s1,e.y0]),u(r[r.length-1]),u(r[0]),m,s,h)};d(0,y[0],y[1],y[2],1),e.through&&d(e.depth,-y[0],-y[1],-y[2],1);const f=e.through?1:e.aoIn??.45,o=[e.cx,(e.yBase+e.yApex)*.5],p=S?[...r,r[0]]:r;for(let c=0;c+1<p.length;c++){const m=p[c],s=p[c+1],h=l(m[0],m[1],0),g=l(s[0],s[1],0),u=l(s[0],s[1],e.depth),v=l(m[0],m[1],e.depth);u[3]=f,v[3]=f;const k=l(o[0],o[1],e.depth*.5),C=k[0]-(h[0]+g[0])/2,A=k[1]-(h[1]+g[1])/2,q=k[2]-(h[2]+g[2])/2;H.quad(h,g,u,v,C,A,q,Math.hypot(s[0]-m[0],s[1]-m[1]),e.depth)}if(e.back){const c=(g,u,v)=>{const k=l(g,u,e.depth);return k[3]=v,k},m=e.cx-e.w/2,s=e.cx+e.w/2,h=(e.yBase+e.yApex)/2;H.quad(c(m,e.yBase,f*1.25),c(s,e.yBase,f*1.25),c(s,h,f),c(m,h,f),y[0],y[1],y[2]),H.quad(c(m,h,f),c(s,h,f),c(s,e.yApex,f*.55),c(m,e.yApex,f*.55),y[0],y[1],y[2])}}function je(H,l,y,e){const t=e.ao||(()=>1),r=e.aoIn??.5,S=e.ch??.12,T=e.chy??S,d=e.chd??.08,f=(i,x,N,K)=>{const $=l(i,x,N);return $[3]=K,$},o=(i,x)=>f(i,x,0,t(i,x)),p=(i,x,N,K)=>H.quad(i,x,N,K,y[0],y[1],y[2]),c=i=>{e.cols&&H.setCol(e.cols[i][0],e.cols[i][1])};c(0);for(const[i,x]of[[e.s0,e.ps0],[e.ps1,e.s1]])for(const[N,K]of[[e.y0,e.py0],[e.py0,e.py1],[e.py1,e.y1]])p(o(i,N),o(x,N),o(x,K),o(i,K));p(o(e.ps0,e.y0),o(e.ps1,e.y0),o(e.ps1,e.py0),o(e.ps0,e.py0)),p(o(e.ps0,e.py1),o(e.ps1,e.py1),o(e.ps1,e.y1),o(e.ps0,e.y1));const m=[[e.ps0,e.py0],[e.ps1,e.py0],[e.ps1,e.py1],[e.ps0,e.py1]],s=[[e.ps0+S,e.py0+T],[e.ps1-S,e.py0+T],[e.ps1-S,e.py1-T],[e.ps0+S,e.py1-T]],h=(e.ps0+e.ps1)/2,g=(e.py0+e.py1)/2,u=l(h,g,e.depth*.5);c(1);for(let i=0;i<4;i++){const x=m[i],N=m[(i+1)%4],K=s[i],$=s[(i+1)%4];p(f(x[0],x[1],0,t(x[0],x[1])),f(N[0],N[1],0,t(N[0],N[1])),f($[0],$[1],d,.8),f(K[0],K[1],d,.8));const I=f(K[0],K[1],d,.8),Z=f($[0],$[1],d,.8),le=f($[0],$[1],e.depth,r),he=f(K[0],K[1],e.depth,r);H.quad(I,Z,le,he,u[0]-(I[0]+Z[0])/2,u[1]-(I[1]+Z[1])/2,u[2]-(I[2]+Z[2])/2)}const v=s.map(i=>f(i[0],i[1],e.depth,r));if(c(2),!e.boss){p(v[0],v[1],v[2],v[3]);return}const[k,C,A]=e.boss,q=Math.min(1,r*1.5),F=[f(h,g-C,e.depth,r),f(h+k,g,e.depth,r),f(h,g+C,e.depth,r),f(h-k,g,e.depth,r)],a=f(h,g,e.depth-A,q),n=(i,x,N)=>H.tri(i,x,N,y[0],y[1],y[2]);for(let i=0;i<4;i++)n(v[i],v[(i+1)%4],F[i]),n(v[i],F[i],F[(i+3)%4]);c(1);for(let i=0;i<4;i++)n(F[i],F[(i+1)%4],a)}async function Xe(H,l,y,e){const t=ne(),r=new w.Color(H[6]).multiplyScalar(1.22),S=new w.Color(H[6]).lerp(new w.Color(H[5]),.5),T=new w.Color("#4f7a34"),d=(a,n,i)=>[a,n,b+i],f=[0,0,-1];t.kind=1;const o=y.foils;for(let a=0;a<5;a++)for(let n=0;n<60;n++){n%10===0&&await e();const i=-j+n,x=.9+a*2.6;t.setCol(S,.9+.14*l()),te(t,d,f,{s0:i,s1:i+1,y0:x,y1:x+2.6,cx:i+.5,w:.8,yBase:x+.3,ySpring:x+1.6,yApex:x+2.3,foils:o,per:4,depth:.55,back:!0,aoIn:.5,cusp:.12})}t.setCol(S,.86),t.quad([-34,.5,b],[34,.5,b],[34,.9,b],[-34,.9,b],0,0,-1),t.quad([-34,13.9,b,.7],[34,13.9,b,.7],[34,14.2,b,.5],[-34,14.2,b,.5],0,0,-1);const p=y.carve;for(const a of[-1,1]){const n=a>0?j:-34,i=n+2;t.kind=1,t.setCol(S,.86*(.96+.08*p())),te(t,d,f,{s0:n,s1:n+4,y0:.9,y1:11.45,cx:i,w:3.1,yBase:1.5,ySpring:8.3,yApex:11.1,foils:1,per:10,depth:.16,aoIn:.8}),t.setCol(S,.9*(.96+.08*p())),t.ao=.86,te(t,(x,N,K)=>[x,N,b+.16+K],f,{s0:i-1.55,s1:i+1.55,y0:1.5,y1:11.1,cx:i,w:2.4,yBase:1.5,ySpring:7.9,yApex:10.4,foils:o,per:3,depth:.4,aoIn:.5,cusp:.1}),t.ao=1,t.quad([i-1.2,1.5,b+.16,.8],[i+1.2,1.5,b+.16,.8],[i+1.2,1.5,b+.56,.5],[i-1.2,1.5,b+.56,.5],0,1,0),t.kind=5,t.setCol(S,.92*(.96+.08*p())),t.quad([i-1.2,1.5,b+.56],[i+1.2,1.5,b+.56],[i+1.2,6,b+.56],[i-1.2,6,b+.56],0,0,-1),t.quad([i-1.2,6,b+.56],[i+1.2,6,b+.56],[i+1.2,10.4,b+.56],[i-1.2,10.4,b+.56],0,0,-1),t.kind=1,t.setCol(S,.86*(.96+.08*p())),je(t,d,f,{s0:n,s1:n+4,y0:11.45,y1:13.9,ps0:i-1.3,ps1:i+1.3,py0:11.75,py1:13.25,ch:.12,chd:.08,depth:.22,aoIn:.55,boss:[.8,.42,.09]})}t.setCol(S,1.04);for(let a=0;a<=5;a++){const n=.9+a*2.6+(a===5?-.1:.13);t.box(-j-.4,n-.06,b-.1,j+.4,n+.06,b,"Z")}for(let a=0;a<=6;a++){const n=-j+a*10;t.box(n-.09,.5,b-.07,n+.09,14,b,"yYZ")}await e(),t.kind=0;for(const a of[-1,1])for(let n=0;n<6;n++){const i=34+n*11,x=a>0?i:-i-11;t.setCol(r,.92+.1*l()),te(t,d,f,{s0:x,s1:x+11,y0:.5,y1:D,cx:x+5.5,w:7.6,yBase:.5,ySpring:8.6,yApex:13,foils:1,per:12,depth:.9,back:!0,aoIn:.62}),t.setCol(r,1.02),t.prism([[x-.6,b-.3],[x+.6,b-.3],[x+.6,b+.1],[x-.6,b+.1]],.5,D,!1,.7),t.box(x+5.5-4.4,8.45,b-.12,x+5.5-3.8,8.75,b+.9,"Z"),t.box(x+5.5+3.8,8.45,b-.12,x+5.5+4.4,8.75,b+.9,"Z")}t.setCol(r,1.06);for(const a of[-1,1]){const n=a>0?31.2:-J,i=a>0?J:-31.2;t.box(n,D,b-.35,i,D+.25,b+1.3,"y"),t.box(n,D+.25,b-.2,i,D+.6,b+1.15,"y")}await e();const c=P+1,m=y.terrace?150:b+1.3;t.setCol(r,.9);const s=(a,n,i)=>[a,14.2+(b-n)/(b-c)*.8+i,n],h=[0,-1,0],g=(a,n)=>.55+.4*((b-n)/(b-c)),u=[[c,c+1,c+4.9,c+5.225],[c+5.225,c+5.55,c+9.45,c+9.775],[c+9.775,c+10.1,c+14,b]],v=(a,n)=>{const i=s(a,n,0);return i[3]=g(a,n),i},k=[...new Set(u.flat())];for(const a of[-1,1]){for(let n=0;n+1<k.length;n++)t.tri(v(a*31.2,c),v(a*j,k[n]),v(a*j,k[n+1]),0,-1,0);t.tri(v(a*31.2,c),v(a*j,b),v(a*31.2,b),0,-1,0)}for(let a=0;a<20;a++){const n=-j+a*3;for(const[i,x,N,K]of u){const $=.95+.1*p();je(t,s,h,{s0:n,s1:n+3,y0:i,y1:K,ps0:n+.6,ps1:n+2.4,py0:x,py1:N,ch:.14,chd:.12,depth:.42,aoIn:.42,ao:g,boss:[.45,1.15,.12],cols:[[r,.9],[r,1.12*$],[r,.9*.62*$]]})}a%5===4&&await e()}t.setCol(r,.9);for(let a=0;a<=20;a++){const n=-j+a*3,i=.28;t.setCol(r,.95+.1*l());for(const x of[-1,1])t.quad([n+x*i,11.8,b,.6],[n+x*i,14.86,P+1.6],[n+x*i,15,P+1.6],[n+x*i,14.25,b,.6],x,0,0);t.quad([n-i,11.8,b,.6],[n+i,11.8,b,.6],[n+i,14.86,P+1.6],[n-i,14.86,P+1.6],0,-1,-.2),t.box(n-.42,10.9,b-.55,n+.42,11.8,b,"YZ"),t.box(n-.34,10.45,b-.3,n+.34,10.9,b,"YZ")}for(const a of[-1,1]){const n=a*31.2;t.setCol(r,1),t.quad([n,14.2,b],[n,15,c],[n,15.05,c],[n,15.05,b],a,0,0),t.setCol(r,1.08),t.box(Math.min(n,n+a*.07),14.98,c,Math.max(n,n+a*.07),15.08,b,a>0?"x":"X");const i=(N,K,$)=>[a*(31.2-$),K,N],x=(b-c)/13;for(let N=0;N<13;N++)t.setCol(r,.95+.1*p()),te(t,i,[a,0,0],{s0:c+N*x,s1:c+(N+1)*x,y0:15.05,y1:16.5,cx:c+(N+.5)*x,w:.78,yBase:15.22,ySpring:15.8,yApex:16.24,foils:3,per:3,depth:.22,back:!0,aoIn:.45,cusp:.14});t.setCol(r,1),t.quad([n,15,c],[n,15.25,P-.3],[n,16.5,P-.3],[n,16.5,c],a,0,0),t.box(Math.min(n,a*j),15.3,P-.3,Math.max(n,a*j),16.5,m,a>0?"Xy":"xy")}const C=y.scallops*4,A=a=>P+.05-.42*Math.abs(Math.sin(Math.PI*(a+j)*y.scallops/(2*j)));t.setCol(r,1.08);for(let a=0;a<C;a++){const n=-j+a/C*2*j,i=-j+(a+1)/C*2*j,x=A(n),N=A(i);t.quad([n,15.22,x,.8],[i,15.22,N,.8],[i,15.9,N],[n,15.9,x],0,0,-1),t.quad([n,15,c,.8],[i,15,c,.8],[i,15.22,N,.8],[n,15.22,x,.8],0,-1,0),t.quad([n,15.9,x],[i,15.9,N],[i,15.9,c+.4],[n,15.9,c+.4],0,1,0)}await e(),t.setCol(r,.96),t.box(-34,-.4,P+2.6,34,.5,b,"yZ"),t.box(-34.6,-.4,P+1.7,34.6,.22,P+2.6,"yZ");for(const a of[-1,1])t.box(a>0?34:-J,-.4,b-3.6,a>0?J:-34,.5,b,"yZ");const q=(a,n,i,x)=>{const N=x-n>i-a;t.kind=3,t.setCol(r,.95),t.box(a,-.4,n,i,1.2,x,"yY"),t.kind=0,t.setCol(r,1),t.quad([a,1.2,n],[i,1.2,n],[i,1.2,x],[a,1.2,x],0,1,0),t.setCol(r,1.08),N?(t.box(a-.12,1.02,n,a+.4,1.4,x,"y"),t.box(i-.4,1.02,n,i+.12,1.4,x,"y")):(t.box(a,1.02,n-.12,i,1.4,n+.4,"y"),t.box(a,1.02,x-.4,i,1.4,x+.12,"y"))};q(-3,M+29.2,3,-4),q(-3,we,3,M-29.2),q(-J,M-3,-29.2,M+3),q(29.2,M-3,J,M+3);const F=(a,n)=>Array.from({length:8},(i,x)=>{const N=(x+.5)*Math.PI/4;return[Math.cos(N)*a,n+Math.sin(N)*a]});if(t.setCol(r,.98),t.prism(F(8.8,2.5),-.4,.5,!0,.75),t.setCol(r,1.04),t.prism(F(7.6,2.5),.5,1.2,!0),t.setCol(r,1.1),t.prism(F(1.5,2.5),1.2,1.75,!0,.7),t.prism(F(1.1,2.5),1.75,2,!0),t.setCol(r,1),t.ring([[1.4,-.4,.7],[1.4,.55],[.7,.55,.8],[.7,1.25],[0,1.25,.8],[0,G],[-4.3,G]],0,M,28,28),y.terrace){t.kind=4,t.setCol(T,1);for(const a of[-1,1])t.quad([a*31.2,D+.25,b+1.3],[a*J,D+.25,b+1.3],[a*J,D+.25,150],[a*31.2,D+.25,150],0,1,0);t.kind=0,t.setCol(r,.9),t.quad([-J,0,150],[J,0,150],[J,D+.25,150],[-J,D+.25,150],0,0,1);for(const a of[-1,1])t.quad([a*J,0,b],[a*J,0,150],[a*J,D+.25,150],[a*J,D+.25,b],a,0,0)}return t}const Je=`
vec2 hcNet(vec2 p, float t){
  vec2 q = p + vec2(sin(p.y * 1.3 + t * .9), cos(p.x * 1.1 - t * .7)) * .55;
  float a = sin(q.x * 2.1 + t) + sin(q.y * 2.3 - t * 1.1) + sin((q.x + q.y) * 1.4 + t * .6);
  vec2 r = p * 1.7 + vec2(cos(p.y * .9 - t * .6), sin(p.x * 1.2 + t * .8)) * .6 + 4.;
  float b = sin(r.x * 2.3 - t * .8) + sin(r.y * 1.9 + t) + sin((r.x - r.y) * 1.3 - t * .5);
  float l1 = clamp(1. - abs(a) / 3., 0., 1.), l2 = clamp(1. - abs(b) / 3., 0., 1.);
  float c1 = l1 * l1 * l1, c2 = l2 * l2 * l2;
  float s1 = c1 * c1, s2 = c2 * c2; s1 *= s1; s2 *= s2;
  return vec2(s1 + s2 * .6 + s1 * s2 * 1.5, c1 * .7 + c2 * .45);
}
`,Qe=`
  float hKind = vAux.y; float hao = vAux.x;
  float up = abs(hn.y);
  vec2 suv = up > .6 ? hp.xz : vec2(hp.x * abs(hn.z) + hp.z * abs(hn.x), hp.y);
  // coursed ashlar on walls, slabs on floors
  vec2 bs = up > .6 ? vec2(2.4, 1.6) : vec2(2.2, 1.1);
  float hallW = step(480.3, hp.z) * step(abs(hp.x), 15.95) * step(up, .6) * step(hKind, .5);
  bs = mix(bs, vec2(3.3, 1.65), hallW * step(hp.y, 43.3));       // the gatehouse stands on bigger, older blocks below its string course
  vec2 g = suv / bs; g.x += step(1., mod(floor(g.y), 2.)) * .5;
  vec2 gi = floor(g), gf = fract(g);
  float joint = min(min(gf.x, 1. - gf.x) * bs.x, min(gf.y, 1. - gf.y) * bs.y);
  float polished = step(.5, hKind) * step(hKind, 1.5);
  float jl = smoothstep(.0, .045, joint); jl = mix(jl, 1., polished);
  float tint = hcHash(gi + 3.7);
  float mott = hcFbm(suv * .55 + hn.xz * 5.) * .6 + hcFbm(suv * 4.3) * .4;
  vec3 sc = diffuseColor.rgb * mix(.82, 1.12, mix(tint, .5, polished * .8)) * (.72 + .5 * mott);
  sc = mix(sc, sc * vec3(1.1, .96, .93), .35 + tint * .5);         // rose in the grey, warmer blocks
  sc *= mix(.5, 1., jl);
  // weather: moss creeping out of the joints wherever the stone lies open to the sky, ochre lichen in patches, rain-dark under copings
  float hOpen = step(101.4, hp.z) * step(hp.z, 480.) + step(hp.z, 83.) ;
  float mossN = hcFbm(suv * .31 + 9.);
  float moss = (1. - smoothstep(.0, .26, joint)) * smoothstep(.34, .62, mossN) * (1. - polished) * hOpen * (.55 + .45 * up);
  sc = mix(sc, vec3(.12, .2, .045) * (.7 + .7 * mott), moss * .85);
  float lich = smoothstep(.63, .72, hcFbm(suv * 1.7 + 20.)) * smoothstep(.3, .7, hcN2(suv * 9.)) * (1. - polished) * hOpen;
  sc = mix(sc, sc * vec3(1.3, 1.12, .62) + vec3(.035, .028, 0.), lich * .55);
  sc *= 1. - .22 * (1. - up) * hOpen * smoothstep(.45, .8, hcN2(vec2(suv.x * 2.3, 1.))) * smoothstep(.2, .9, hcN2(vec2(suv.x * .7, suv.y * .12)));
  if (hallW > .5) {
    // a carved string course round the hall (linked rosettes between two fillets), worn arrises on the old blocks below it,
    // a dado of upright flutes above the plinth moulding
    float by = hp.y - 44.05, bandM = 1. - smoothstep(.62, .68, abs(by));
    float ro = length(vec2((fract(suv.x / 1.3) - .5) * 1.3, by));
    float carve = smoothstep(.0, .07, abs(ro - .36)) * smoothstep(.0, .06, abs(ro - .14));
    float fil = smoothstep(.0, .05, abs(abs(by) - .55));
    sc = mix(sc, diffuseColor.rgb * 1.1 * (.45 + .55 * carve) * (.6 + .4 * fil) * (.8 + .3 * mott), bandM);
    sc *= mix(1., .8 + .2 * smoothstep(.0, .18, joint) + .16 * (tint - .5), (1. - bandM) * step(hp.y, 43.3));
    float fl = abs(fract(suv.x / .55) - .5);
    sc *= mix(1., .7 + .5 * smoothstep(.05, .3, fl), step(34.3, hp.y) * step(hp.y, 36.4) * .8);
  }
  // polished niche stone: faint veining
  float vein = smoothstep(.47, .5, hcFbm(suv * vec2(1.3, 2.9) + 11.)) * (1. - smoothstep(.5, .53, hcFbm(suv * vec2(1.3, 2.9) + 11.)));
  sc = mix(sc, sc * .78, vein * polished);
  // damp: near the water, on the gallery ledge, streaks down from the shelf
  float inG = step(abs(hp.x), 34.5) * step(${(P-.5).toFixed(1)}, hp.z) * step(hp.z, ${(b+.7).toFixed(1)});
  float streak = hcN2(vec2(suv.x * 1.7, 3.)) * hcN2(vec2(suv.x * .31, suv.y * .12 + 5.));
  hcWet = max((1. - smoothstep(.2, 1.5 + 2.5 * streak, hp.y)) * step(hp.z, ${(b+.7).toFixed(1)}), inG * (up > .6 ? .85 : .25 + .5 * streak)) * uHcWet;
  sc *= mix(1., .55, hcWet); sc = mix(sc, sc * vec3(.8, .98, .86), hcWet * .5 * hcFbm(suv * .9 + 2.));
  // a film of water sliding down the ledge
  float film = inG * step(.6, up) * step(hp.y, 1.);
  hcGloss = film * (.5 + .5 * sin(hp.z * 3.1 + hcN2(hp.xz * .8) * 6. + uHcTime * 2.2));
  // culvert arches on causeway sides
  if (hKind > 2.5 && hKind < 3.5) { float al = mod((abs(hn.x) > .5 ? hp.z : hp.x) + 300., 5.) - 2.5; float ar = length(vec2(al, hp.y + .25)); sc *= mix(.12, 1., smoothstep(1.15, 1.3, ar)); sc *= mix(1.25, 1., smoothstep(1.3, 1.36, ar) + (1. - smoothstep(1.2, 1.3, ar))); }
  // ---- terrace kinds
  if (hKind > 3.5 && hKind < 4.5) {                             // clipped lawn, mown in stripes
    float mowS = smoothstep(-.3, .3, sin(hp.x * .7));
    sc = diffuseColor.rgb * (.74 + .4 * hcFbm(hp.xz * .3)) * (.86 + .24 * mowS) * (.8 + .4 * hcN2(hp.xz * vec2(13., 2.5)));
    sc = mix(sc, sc * vec3(1.5, 1.12, .6), smoothstep(.5, .78, hcFbm(hp.xz * .07 + 11.)) * .5);      // tired autumn patches
    sc = mix(sc, vec3(dot(sc, vec3(.3, .5, .2))) * vec3(.96, 1., .9), .3) * .9;
    if (uHcGard.z > 0.) {                                       // April: new grass mown in broad light and dark bands, blades, sun-yellowed patches, daisies
      float fine = 1. - smoothstep(18., 80., length(uHcCam - hp));
      float band = smoothstep(-.3, .3, sin(hp.x * 1.05 + .5 * hcN2(vec2(hp.z * .05, 2.))));
      float blade = hcN2(hp.xz * vec2(11., 1.3)) * .55 + hcN2(hp.xz * vec2(27., 3.1) + 5.) * .45;
      vec3 grs = mix(vec3(.095, .215, .055), vec3(.19, .31, .07), band) * (1. + (blade - .5) * .7 * fine) * (.8 + .4 * hcFbm(hp.xz * .1 + 3.));
      grs = mix(grs, grs * vec3(1.3, 1.12, .55), smoothstep(.52, .8, hcFbm(hp.xz * .045 + 21.)) * .45);
      float dz = step(.972, hcHash(floor(hp.xz * 4.) + 3.)) * smoothstep(.4, .62, hcFbm(hp.xz * .12 + 4.)) * fine;
      sc = mix(sc, mix(grs, vec3(.78, .78, .66), dz * .85), uHcGard.z * .9);
    }
    sc = mix(sc, vec3(.92, .8, .84), smoothstep(.8, .86, hcN2(hp.xz * 7.3)) * smoothstep(.42, .7, hcFbm(hp.xz * .09 + 7.)) * uHcGard.z * .6);   // April: drifts of fallen blossom
  } else if (hKind > 4.5 && hKind < 5.5) {                      // carved: fish-scale relief
    vec2 q = suv / vec2(.9, .62); q.x += .5 * mod(floor(q.y), 2.);
    vec2 f = fract(q) - vec2(.5, 1.); float r = length(f * vec2(1., .9));
    sc *= mix(.55, 1., smoothstep(.0, .09, abs(r - .56))) * (.86 + .32 * smoothstep(.0, .56, r));
  } else if (hKind > 5.5 && hKind < 6.5) {                      // pierced screen
    float jl2 = hcJali(suv);
    if (jl2 > 0.) discard;
    sc *= .8 + .35 * smoothstep(-.12, 0., jl2);
  } else if (hKind > 6.5 && hKind < 7.5) {                      // plain plaster, domes
    sc = diffuseColor.rgb * (.82 + .3 * hcFbm(suv * 1.3));
    float rib = abs(fract(atan(hn.z, hn.x + 1e-4) * 1.9099) - .5);                 // the kiosk domes: ribs of turquoise and cobalt glaze
    vec3 glaze = mix(vec3(.03, .36, .4), vec3(.02, .11, .38), smoothstep(.3, .34, rib)) * (.75 + .5 * mott);
    sc = mix(sc, glaze, uHcGard.w * .9);
  } else if (hKind > 7.5 && hKind < 8.5) {                      // garden wall with creeper spilling over its top
    float topY = (hp.z > 100.6 ? hcGround(hp.z) : 0.) + 22.;
    float dn = topY - hp.y;
    if (uHcGard.z > 0.) {                                       // April: red sandstone banded with white marble, a row of red diamonds in the upper course
      vec3 rose = vec3(.5, .13, .085) * (.66 + .6 * mott) * mix(.8, 1.14, tint);
      float b1 = smoothstep(1.0, 1.08, dn) - smoothstep(2.3, 2.38, dn), b2 = smoothstep(20.3, 20.36, dn) - smoothstep(20.85, 20.9, dn);
      float dia = abs(fract(suv.x / 1.3) - .5) * 2. + abs((dn - 1.69) / .5);
      vec3 marble = vec3(.74, .7, .62) * (.84 + .3 * mott);
      vec3 rs = mix(rose, mix(marble, rose * 1.1, (1. - smoothstep(.72, .8, dia)) * b1), clamp(b1 + b2, 0., 1.));
      sc = mix(sc, rs * mix(.55, 1., jl) * (1. - .5 * moss), uHcGard.z);
    }
    float hn3 = hcN2(vec2(suv.x * 1.3, 7.));
    float hang = .5 + 4.6 * hcFbm(vec2(suv.x * .16, 2.)) * hcFbm(vec2(suv.x * .05, 9.)) * 1.6 + 4. * hn3 * hn3 * hn3;
    float cm = smoothstep(hang + .5, hang - .5, dn + (hcN2(suv * 2.3) - .5) * 1.6);
    float lf = hcN2(suv * 5.1 + vec2(sin(uHcTime * 1.3 + suv.x) * .08, 0.));
    cm *= smoothstep(.22, .4, hcN2(suv * 2.9 + 4.) + (1. - smoothstep(0., hang * .6, dn)) * .5);
    vec3 cc = mix(mix(vec3(.2, .012, .02), vec3(.56, .06, .035), lf), mix(vec3(.1, .26, .07), vec3(.3, .5, .12), lf), uHcGard.z);
    sc = mix(sc, cc * (.6 + .8 * lf), cm * .95);
  } else if (hKind > 8.5 && hKind < 9.5) {                      // flower bed: soil and massed heads in the block's colour
    // dark earth, a ground of leaves, and the heads of the plants that stand lower than the tall ones: round dots of the
    // block's colour, each its own shade
    float hd = hcN2(hp.xz * 2.6) * .6 + hcN2(hp.xz * 6.1 + 4.) * .4;
    vec3 earth = vec3(.07, .052, .038) * (.7 + .7 * hd);
    vec3 fol = mix(vec3(.05, .13, .04), vec3(.13, .27, .07), hcN2(hp.xz * 4.7 + 9.)) * (1. + .25 * uHcGard.z);
    vec2 hq = hp.xz * 2.3; vec2 hi2 = floor(hq); vec2 hf = fract(hq) - .5 - (vec2(hcHash(hi2 + 1.), hcHash(hi2 + 7.)) - .5) * .5;
    float head = (1. - smoothstep(.15, .27, length(hf))) * step(.42 - .12 * uHcGard.z, hcHash(hi2 + 3.));
    sc = mix(earth, fol, smoothstep(.26, .5, hd + .12));
    sc = mix(sc, diffuseColor.rgb * (.7 + .5 * hcHash(hi2 + 5.)), head * .9);
  } else if (hKind > 9.5 && hKind < 10.5) {                     // honeycomb vault
    vec2 q = vec2(hp.z, hp.x * 1.25) / 1.7; q.x += .5 * mod(floor(q.y), 2.); vec2 f = fract(q) - .5;
    float r = max(abs(f.x), abs(f.y) * .9 + abs(f.x) * .5);
    sc = diffuseColor.rgb * (.5 + .75 * smoothstep(.5, .1, r) * (.6 + .4 * smoothstep(-.5, .5, f.y))) * (.85 + .3 * hcHash(floor(q)));
  } else if (hKind > 10.5 && hKind < 11.5) {                    // props: the vertex colour as painted
    sc = diffuseColor.rgb * (.86 + .26 * hcFbm(hp.xz * 3. + hp.y * 2.));
  } else if (hKind > 12.5) {                                    // a raked heap of leaves: small overlapping blades, dark gaps between them
    vec3 lq = hp * vec3(5.2, 2.2, 5.2);
    float l1 = hcN2(lq.xz + lq.y * .7), l2 = hcN2(lq.xz * 2.3 + lq.y * 1.9 + 5.), l3 = hcN2(hp.xz * 1.7 + hp.y * 2.3 + 9.);
    vec3 lc2 = mix(uHcTree * .75, uHcAccent * .95, smoothstep(.38, .72, l3 * .6 + l2 * .4));
    lc2 = mix(lc2, uHcTree * vec3(.45, .3, .3), smoothstep(.62, .8, l1 * .5 + l3 * .5));
    sc = lc2 * (.5 + .85 * l1) * mix(.22, 1., smoothstep(.2, .42, l2));
  } else if (hKind > 11.5) {                                    // the carpet
    vec2 hf = vec2(vAux.z, vAux.w * .5); vec2 c = vec2(abs(vHcUv.x), abs(vHcUv.y - hf.y)); vec2 e = hf - c; float de = min(e.x, e.y);
    vec3 red = vec3(.42, .05, .04), blue = vec3(.04, .09, .3), cream = vec3(.62, .52, .36), gold = vec3(.6, .33, .06);
    float med = length(c / hf * vec2(1., .8));
    vec3 cp = mix(red, blue, 1. - smoothstep(.36, .38, med + .05 * sin(atan(c.y, c.x + 1e-3) * 16.)));
    cp = mix(cp, cream, 1. - smoothstep(.12, .14, med));
    vec2 gq = fract(vHcUv / 1.1) - .5; float gul = abs(gq.x) + abs(gq.y);
    cp = mix(cp, gold, (1. - smoothstep(.16, .2, gul)) * smoothstep(.4, .42, med) * step(1.6, de));
    cp = mix(cp, blue, step(de, 1.5)); cp = mix(cp, cream, step(de, 1.25) * step(.95, de) + step(de, .35) * step(.2, de));
    float zz = abs(fract((vHcUv.x + vHcUv.y) / .5) - .5); cp = mix(cp, gold, step(de, .95) * step(.45, de) * step(zz, .2));
    sc = cp * (.8 + .3 * hcN2(vHcUv * 30.));
  }
  if (hKind > 10.5) { hcWet = 0.; hcGloss = 0.; }
  // snow on what faces up
  float snow = uHcSnow * smoothstep(.45, .8, hn.y + .25 * hcFbm(suv * 1.3)) * (1. - film) * step(.2, hp.y) * (1. - step(10.5, hKind)) * (1. - step(480.3, hp.z) * step(abs(hp.x), 15.6));
  sc = mix(sc, vec3(.82, .86, .92), snow);
  if (hp.z > 101.4 && hp.z < 480. && hn.y > .7 && (hKind < .5 || (hKind > 3.5 && hKind < 4.5))) {   // fallen leaves: a carpet under each tree, drifts, thick along the kerbs
    vec2 tq = vec2(abs(hp.x) - 34., mod(hp.z - 18. + 14., 28.) - 14.);
    float amt = clamp((1. - smoothstep(5., 19., length(tq))) * .85 + smoothstep(.33, .68, hcFbm(hp.xz * .11 + 3.)) * .66 + (1. - smoothstep(13.3, 16.5, abs(hp.x))) * .55, 0., 1.) * uHcGard.y;
    float fl = hcN2(hp.xz * 3.6) * .5 + hcN2(hp.xz * 8.3 + 5.) * .5;
    float lm = smoothstep(1. - amt * .8, 1.04 - amt * .7, fl + amt * .25);
    vec3 lc = mix(uHcTree * .8, uHcAccent, smoothstep(.3, .8, hcN2(hp.xz * 1.9 + 9.)));
    sc = mix(sc, lc * (.7 + .5 * hcN2(hp.xz * 11.)), lm * .92);
  }
  diffuseColor.rgb = sc * mix(.3, 1., hao);
`,et="roughnessFactor = mix(roughnessFactor, .22, clamp(hcWet * .8 + hcGloss * .4, 0., 1.)); roughnessFactor = mix(roughnessFactor, .45, step(.5, vAux.y) * step(vAux.y, 1.5));",tt=`
  vec3 gal = hcGal(hp);
  // the low sun rakes the open ground of the terraces: warm pools between slate-blue shadows of trunks and crowns
  float gdn = step(101.4, hp.z) * step(hp.z, 480.) * smoothstep(.4, .8, hn.y);
  reflectedLight.directDiffuse *= gal.x * (1. + 1.5 * gdn * uHcGard.x); reflectedLight.directSpecular *= gal.x;
  float hao2 = mix(.25, 1., vAux.x);
  if (hKind > 10.5 && (hKind < 11.5 || hKind > 12.5)) reflectedLight.indirectDiffuse *= 1. + 1.5 * step(101.4, hp.z);
  // behind the water the shelf's shadow is slate-blue, never black: the same cool fill on ledge, wall and soffit
  // whichever way they face (the night's lamps keep their own soft fill)
  float dk = gal.y * (1. - .6 * uHcLamp);
  vec3 slate = (uHcSkyHor * vec3(.2, .28, .37) + uHcSkyTop * .17) * (1.06 + 1.05 * max(-hn.y, 0.) + .55 * max(hn.y, 0.)) * mix(vec3(1.), vec3(.42, .47, .58), polished);   // the pale niche stone sits deeper, so the bands and the pots carry the wall
  reflectedLight.indirectDiffuse = mix(reflectedLight.indirectDiffuse, mix(diffuseColor.rgb, vec3(dot(diffuseColor.rgb, vec3(.3, .5, .2))), .45) * slate, dk) * mix(hao2, mix(.7, 1., vAux.x), dk);
  reflectedLight.indirectDiffuse *= mix(vec3(1.), vec3(.82, .98, 1.36) * (1. + .3 * uHcGard.z), gdn * (1. - gal.x) * uHcGard.x);
  if (hp.z > 480.3 && abs(hp.x) < 15.6) {
    // the gatehouse hall: no black anywhere. Sky from both screens and the arch fills it, the sunlit floor throws warm light up
    // the walls and into the vault, and the screen on the shaded side lays a second, cooler lattice the other way across the floor
    float toArch = smoothstep(546., 484., hp.z);
    reflectedLight.indirectDiffuse *= (.95 + .55 * toArch) * (1. - .2 * step(.6, hn.y));
    reflectedLight.directDiffuse *= 1.8 + 1.5 * step(.6, hn.y); // the lattice the sun lays over the pale floor: warm, and clear of the cool fill
    float sxs = uHcSun.x < 0. ? 1. : -1.; float d2 = 15. - hp.x * sxs;
    float ys2 = hp.y + .62 * d2, zs2 = hp.z + .22 * d2;
    float top2 = 47.6 - 4.4 * min(abs(zs2 - 504.) / 8., 1.);
    float soft2 = smoothstep(8., 42., d2);
    float scr2 = step(496., zs2) * step(zs2, 512.) * step(36., ys2) * step(ys2, top2) * mix(step(0., hcJali(vec2(zs2, ys2))), .35, soft2);
    hcAdd += diffuseColor.rgb * (uHcSkyHor * .5 + uHcSkyTop * .25) * scr2 * .9 * step(.6, hn.y) * step(hp.y, 32.75);
    float bounce = (1. - smoothstep(32., 60., hp.y)) * (.35 + .65 * toArch) * (1. - step(.6, hn.y));
    hcAdd += diffuseColor.rgb * uHcSunCol * vec3(.5, .4, .28) * (.1 + .22 * bounce);
  }
  // water-light: the bands the sun throws through the sheet, and a slow bounced web on walls and soffit
  float cz = hcCaus(vec2(hp.x * .4 + hp.z * .2, hp.y * .3 + hp.z * .4 + uHcTime * .45), uHcTime * .7);
  hcAdd += diffuseColor.rgb * uHcCaus * vec3(.9, 1.18, 1.14) * (cz * .07 + gal.z * 1.3) * gal.y * mix(.5, 1., vAux.x);   // green-white, on every face alike
  float cs = hcCaus(vec2(hp.x * 1.05 + hp.z * .45, hp.y * 1.1 + hp.z * 1.15 + uHcTime * .5), uHcTime * .9);          // the same web drawn finer, thrown up off the moving water
  hcAdd += diffuseColor.rgb * uHcCaus * vec3(.9, 1.18, 1.14) * cs * (.24 * max(step(hn.y, -.5), smoothstep(10.5, 12., hp.y)) + .1 * step(hn.z, -.5)) * gal.y * mix(.5, 1., vAux.x);   // its bright lines crawl on the soffit and the niche wall
  // and the same web as a net of thin bright lines, lying on the soft one and moving with it: square on to the faces
  // that look at the sheet, glancing on soffit, ledge and ribs, lost in the depth of a recess, gone toward the open ends
  vec2 nt = hcNet(vec2(hp.x * 1.05 + hp.z * .45, hp.y * 1.1 + hp.z * 1.15 + uHcTime * .5), uHcTime * .9);
  hcAdd += diffuseColor.rgb * uHcCaus * vec3(.9, 1.18, 1.14) * nt.x * .85 * (.45 + .55 * max(-hn.z, 0.) + .15 * abs(hn.y)) * vAux.x * vAux.x * (.7 + .6 * gal.z) * gal.y;
  if (hp.z > 480.3 && abs(hp.x) < 15.6) hcAdd += diffuseColor.rgb * uHcSkyHor * (cz * .16 + .015) * smoothstep(32.5, 44., hp.y) * hao2;   // the channel's light wavering on the hall's walls and vault
  // wet stone mirrors what is bright: the sky outside; in the gallery the sheet and the open mouths
  float fr = 1. - max(dot(hn, hv), 0.); fr *= fr;
  vec3 wr = reflect(-hv, hn);
  vec3 wenv = hcEnv(wr);
  vec3 genv = (uHcSkyHor * .5 + uHcSunCol * .2) * (smoothstep(.8, .985, abs(wr.x)) * (1. - smoothstep(.06, .3, wr.y)) + .55 * smoothstep(.2, .75, -wr.z) * (.5 + .5 * hcN2(vec2(hp.x * 1.7, wr.y * 9. + uHcTime * 2.))));
  hcAdd += mix(wenv, genv, step(.001, gal.y)) * (hcWet * .1 + hcGloss * .12) * (.15 + .85 * fr) * mix(1., 1.6, gal.y);
  // night: an oil lamp in every niche
  if (uHcLamp > 0. && vAux.y > .5 && vAux.y < 1.5) {
    vec2 cell = vec2(floor(hp.x) + .5, floor((hp.y - .9) / 2.6));
    vec3 lp = vec3(cell.x, .9 + cell.y * 2.6 + .62, ${(b+.26).toFixed(2)});
    float d2 = dot(hp - lp, hp - lp);
    float fl = .75 + .25 * sin(uHcTime * 9. + cell.x * 7.3 + cell.y * 3.1) * sin(uHcTime * 5.3 + cell.x * 1.7);
    hcAdd += diffuseColor.rgb * vec3(1., .55, .2) * uHcLamp * fl * 1.5 / (1. + d2 * 7.);
  }
`,B=21.6;async function st(H,l,y,e){const t=ne(),r=ne(),S=new w.Color(H[4]),T=new w.Color(H[1]).lerp(new w.Color("#8a5a12"),.35),d=[[0,1,1,0],[1,0,0,1],[0,-1,1,0],[-1,0,0,1]],f=(s,h,g,u,v)=>[[s+v,h],[g-v,h],[g,h+v],[g,u-v],[g-v,u],[s+v,u],[s,u-v],[s,h+v]],o=(s,h,g,u,v)=>{const k=(s+g)/2,C=(h+u)/2,A=(g-s)/2,q=(u-h)/2;t.setCol(S,1),t.prism(f(s,h,g,u,.32),G,B,!1,.8),t.setCol(S,1.15),t.ring([[.4,G,.7],[.4,G+.85],[.18,G+1.15],[0,G+1.15]],k,C,A,q),t.ring([[0,v-.75],[.22,v-.6],[.22,v-.15],[.34,v],[.34,v+.22],[0,v+.4]],k,C,A,q)};for(let s=0;s<4;s++){const[h,g,u,v]=d[s],k=(F,a,n)=>[h*(Y-.5-n)+u*F,a,M+g*(Y-.5-n)+v*F],C=[h,0,g],A=(F,a,n,i,x,N,K)=>{const $=k(F,a,n),I=k(i,x,N);t.box(Math.min($[0],I[0]),a,Math.min($[2],I[2]),Math.max($[0],I[0]),x,Math.max($[2],I[2]),K)};t.kind=0,t.setCol(S,1),te(t,k,C,{s0:-8,s1:8,y0:G,y1:B,cx:0,w:15.6,yBase:G,ySpring:G+11.5,yApex:G+19,foils:y.pavFoils,per:4,depth:3,through:!0,cusp:.07});for(const F of[-1,1]){const a=F>0?11:-20;te(t,k,C,{s0:a,s1:a+9,y0:G,y1:B,cx:F*15.5,w:7.4,yBase:G,ySpring:G+9.5,yApex:G+14.5,foils:y.pavFoils-2,per:4,depth:3,through:!0,cusp:.08}),t.setCol(S,1.2);for(const[x,N]of[[-.14,0],[3,3.14]])A(a+1,17.6,x,a+8,17.85,N,""),A(a+1,20.35,x,a+8,20.6,N,""),A(a+1,17.85,x,a+1.25,20.35,N,"yY"),A(a+7.75,17.85,x,a+8,20.35,N,"yY");t.setCol(S,1);const n=k(F>0?8:-11,0,-.5),i=k(F>0?11:-8,0,3.5);o(Math.min(n[0],i[0]),Math.min(n[2],i[2]),Math.max(n[0],i[0]),Math.max(n[2],i[2]),G+11.5)}const q=[[1,1],[1,-1],[-1,-1],[-1,1]][s];o(q[0]*22-2,M+q[1]*22-2,q[0]*22+2,M+q[1]*22+2,G+11.5),t.setCol(S,1.1);for(let F=0;F<20;F++){const a=-22.8+F*2.4;A(a-.28,21.25,-2.6,a+.28,21.95,-.5,"Y"),A(a-.22,20.6,-1.7,a+.22,21.25,-.5,"Y"),A(a-.16,20.1,-1,a+.16,20.6,-.5,"Y")}await e()}t.kind=0,t.setCol(S,1.1),t.ring([[0,B-.1],[.4,B+.2],[.4,B+.75,.7],[3.9,B+.35,.8],[3.9,B+.6]],0,M,Y,Y),t.kind=5,t.setCol(S,1),t.ring([[3.9,B+.6],[.2,B+1.35]],0,M,Y,Y),t.kind=0,t.setCol(S,1.1),t.ring([[.2,B+1.35],[.2,B+2],[-.6,B+2],[-.6,B+1.6]],0,M,Y,Y),t.kind=5,t.setCol(S,.95),t.ring([[-.6,B+1.6],[-10,B+3],[-18,B+4.4],[-23.1,B+5.5],[-24,B+5.5]],0,M,Y,Y);for(const[s,h]of[[1,1],[1,-1],[-1,-1],[-1,1]]){const g=[[23.4,B+1.6],[14,B+3],[6,B+4.4],[.9,B+5.5]];for(let u=0;u<3;u++){const v=g[u],k=g[u+1],C=.32,A=[s*v[0],v[1]+.3,M+h*v[0]],q=[s*k[0],k[1]+.3,M+h*k[0]];t.quad([A[0]-s*C,v[1],A[2]+h*C],[q[0]-s*C,k[1],q[2]+h*C],q,A,-s,1,h),t.quad([A[0]+s*C,v[1],A[2]-h*C],[q[0]+s*C,k[1],q[2]-h*C],q,A,s,1,-h)}}await e();const p=41/6;t.kind=2,t.setCol(S,1.25),t.quad([-20.5,B+.3,M-20.5],[20.5,B+.3,M-20.5],[20.5,B+.3,M+20.5],[-20.5,B+.3,M+20.5],0,-1,0),t.kind=0,t.setCol(S,1.1);for(let s=0;s<=6;s++){const h=-20.5+s*p,g=s===0||s===6?.9:.45;t.box(h-g,B-.6,M-20.5,h+g,B+.3,M+20.5,"YzZ"),t.box(-20.5,B-.45,M+h-g,20.5,B+.3,M+h+g,"YxX")}t.setCol(S,1.05);for(const[s,h]of[[1,1],[1,-1],[-1,-1],[-1,1]]){const g=s*p*2,u=M+h*p*2;t.lathe([[1.55,G,.7],[1.55,G+.5],[1.25,G+.95],[1.05,G+1.5],[.92,G+12],[.98,G+16.6],[1.3,G+17.2],[1.2,G+17.6],[1.75,G+18.5],[1.75,B-.6]],g,0,u,8,Math.PI/8)}t.kind=1,t.setCol(S,1),t.quad([-23.8,G+.02,M-23.8],[23.8,G+.02,M-23.8],[23.8,G+.02,M+23.8],[-23.8,G+.02,M+23.8],0,1,0),await e(),r.kind=1,r.setCol(T,1);const c=[[.95,0],[1.15,.25],[.6,.5],[.38,.75],[.7,1],[1,1.3],[.95,1.6],[.5,1.9],[.25,2.1],[.55,2.4],[.5,2.6],[.14,2.9],[.07,3.6],[0,3.9]],m=y.finial;r.lathe(c.map(s=>[s[0]*m,s[1]*m]),0,B+5.5,M,10);for(const[s,h]of[[1,1],[1,-1],[-1,-1],[-1,1]])r.lathe(c.map(g=>[g[0]*.42,g[1]*.42]),s*23.8,B+2,M+h*23.8,6);return{b:t,g:r}}const ot=`
  float hKind = vAux.y; vec3 mc = diffuseColor.rgb; float inlay = 0.; float acc = 0.;
  vec2 pq = hp.xz - vec2(0., ${M.toFixed(1)});
  float vn = hcFbm(pq * .35 + hp.y * .3 + hcFbm(pq * 1.1 + hp.y) * 1.6);
  float vein = smoothstep(.485, .5, vn) * (1. - smoothstep(.5, .515, vn));
  mc += vec3(.2, .22, .25) * vein * .5;
  mc += vec3(.011, .016, .027) * smoothstep(.3, .75, hcFbm(pq * .16 + hp.y * .21 + 9.));     // clouds of slate in the black
  if (hKind > .5 && hKind < 1.5) {                              // floor: black and white checker inside a border
    vec2 q = pq / 2.4; vec2 qf = fract(q);
    float chk = mod(floor(q.x) + floor(q.y), 2.);
    float m = max(abs(pq.x), abs(pq.y));
    float field = 1. - step(19.2, m);
    float gr = min(min(qf.x, 1. - qf.x), min(qf.y, 1. - qf.y));
    vec3 white = vec3(.55, .56, .55) * (.8 + .3 * hcFbm(pq * .8)) - vein * .2;
    mc = mix(mc, white, chk * field);
    mc *= mix(1., .6, (1. - smoothstep(.0, .015, gr)) * field);
    inlay = (smoothstep(19.2, 19.3, m) - smoothstep(19.6, 19.7, m)) + (smoothstep(22.6, 22.7, m) - smoothstep(22.85, 22.95, m));
    acc = smoothstep(20.5, 20.6, m) - smoothstep(20.9, 21., m);
  } else if (hKind > 1.5 && hKind < 2.5) {                      // coffer panel: border and medallion
    vec2 c = fract((pq + 20.5) / ${(41/6).toFixed(4)}) - .5; float m = max(abs(c.x), abs(c.y)); float r = length(c);
    inlay = (smoothstep(.33, .34, m) - smoothstep(.36, .37, m)) + (smoothstep(.19, .2, r) - smoothstep(.215, .225, r));
    acc = (1. - smoothstep(.05, .06, r)) + (smoothstep(.28, .285, m) - smoothstep(.295, .3, m));
  } else if (hKind > 4.5) {                                    // roof: standing seams, weathered
    float sc = abs(hn.x) > abs(hn.z) ? hp.z : hp.x; float sf = abs(fract(sc / 1.6) - .5);
    mc *= (.75 + .5 * hcFbm(vec2(sc * .7, hp.y * 2.))) * mix(1.6, 1., smoothstep(.0, .06, sf));
    mc = mix(mc, vec3(.82, .86, .92), uHcSnow * smoothstep(.2, .6, hn.y + .3 * hcFbm(hp.xz * .6)));
  } else if (vAux.z > .9 && vAux.w > 2.5) {                    // pier and wall faces: inlay border
    float dE = min(vAux.z - abs(vHcUv.x), min(vHcUv.y, vAux.w - vHcUv.y));
    inlay = smoothstep(.36, .38, dE) - smoothstep(.43, .45, dE);
    acc = (smoothstep(.56, .57, dE) - smoothstep(.6, .61, dE)) * step(1.3, vAux.z);
    float dot1 = 1. - smoothstep(.1, .13, length(vec2(abs(vHcUv.x) - (vAux.z - .9), mod(vHcUv.y, 1.5) - .75)));
    acc += dot1 * step(1.3, vAux.z) * step(.9, vHcUv.y) * step(vHcUv.y, vAux.w - .9);
  }
  mc = mix(mc, vec3(.56, .57, .56), clamp(inlay, 0., 1.));
  mc = mix(mc, uHcAccent, clamp(acc, 0., 1.));
  diffuseColor.rgb = mc * mix(.35, 1., vAux.x);
`,at="roughnessFactor = vAux.y > 4.5 ? .55 : (vAux.y > .5 && vAux.y < 1.5 ? .1 : .2);",ct=`
  vec2 pq2 = hp.xz - vec2(0., ${M.toFixed(1)}); float pm = max(abs(pq2.x), abs(pq2.y));
  float indoor = (1. - smoothstep(20.4, 23.6, pm)) * step(hp.y, ${(B+.4).toFixed(1)});
  float fr = 1. - max(dot(hn, hv), 0.); float fr2 = fr * fr; float fres = .13 + .87 * fr2 * fr2 * fr;
  float gloss = vAux.y > 4.5 ? .25 : 1.;
  vec3 rr = reflect(-hv, hn);
  // indoors the mirror shows the bright arches round a dark hall, outdoors the sky and the trees
  vec3 env = hcEnv(rr) * mix(1., .42 + .75 * smoothstep(.55, .95, max(abs(rr.x), abs(rr.z))) * step(rr.y, .45), indoor);
  env = mix(env, vec3(dot(env, vec3(.3, .5, .2))) * vec3(.55, .78, 1.3), .8);
  hcAdd += env * fres * gloss * mix(.4, 1., vAux.x);
  reflectedLight.directSpecular *= .3;
  // water-light crawling over the ceiling and the upper piers
  float up2 = smoothstep(9., 20., hp.y) * indoor + step(1.5, vAux.y) * step(vAux.y, 2.5);
  float cz = hcCaus(vec2(hp.x, hp.z) * .3 + hp.y * .12, uHcTime * .7);
  hcAdd += uHcCaus * (diffuseColor.rgb + .05) * cz * up2 * (.5 + .8 * smoothstep(4., 21., pm)) * .9;
  reflectedLight.indirectDiffuse *= mix(.3, 1., vAux.x) * mix(1., 1.5, indoor);
  hcAdd += (uHcSkyHor * .014 + uHcSkyTop * .03) * mix(.75, 1., indoor) * mix(.4, 1., vAux.x);       // black marble holding a cobalt sheen, never a hole in the picture
  hcAdd += uHcCaus * (diffuseColor.rgb + .035) * cz * (1. - indoor) * (1. - smoothstep(3., 16., hp.y)) * step(hn.y, .5) * .4;   // the tank's light crawling up the outer faces
  reflectedLight.directDiffuse *= mix(1., .55, indoor * smoothstep(21., 12., pm));
`;function nt(H){const l=ne(),y=new w.Color(H[1]).lerp(new w.Color("#7a5216"),.42);return l.kind=0,l.setCol(y,1),l.lathe([[.17,0,.5],[.23,.04,.7],[.3,.2],[.31,.34],[.21,.53,.85],[.28,.64],[.24,.66,.5]],0,0,0,8),l.geometry()}function it(){const H=ne();return H.kind=2,H.setCol(new w.Color("#a8824a"),1),H.lathe([[.13,-.4],[.13,.12],[.3,.22],[.44,.45],[.38,.72],[.17,.98],[.08,1.05]],0,0,0,6),H.geometry()}function rt(H){const l=ne();if(H==="night")return l.kind=3,l.setCol(new w.Color("#8a4a2a"),1),l.lathe([[.1,0],[.2,.05],[.24,.12],[.2,.13],[0,.1]],0,0,0,7),l.kind=2,l.setCol(new w.Color("#ffffff"),1),l.lathe([[0,.1],[.07,.18],[.085,.27],[.05,.4],[0,.55]],.12,0,0,6),l.geometry();l.kind=1,l.setCol(new w.Color("#2f5a22"),1),l.lathe([[.2,.56,.5],[.4,.63,.8],[.42,.74],[.27,.86],[0,.9]],0,0,0,6),l.kind=0,l.setCol(new w.Color("#ffffff"),1);for(const[y,e,t,r]of[[.25,.76,.13,1],[-.22,.78,.17,.95],[.02,.8,.3,.9],[.06,.85,-.2,.95],[0,.93,.03,1.12]])l.lathe([[.06*r,0,.55],[.16*r,.08*r,.9],[.09*r,.2*r],[0,.215*r]],y,e,t,5,y*9+t*5);return l.geometry()}const lt=`
  float pat = hcFbm(hp.xy * 9. + hp.z * 5.);
  diffuseColor.rgb *= (.7 + .5 * pat) * mix(.45, 1., vAux.x);
  if (vAux.y > 1.5) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.1, .22, .17), smoothstep(.45, .7, pat) * .6);   // verdigris on bronze
`,ht=`
  vec3 gal = hcGal(hp);
  reflectedLight.directDiffuse *= gal.x; reflectedLight.directSpecular *= gal.x;
  reflectedLight.indirectDiffuse *= mix(vec3(1.), vec3(.5, .62, .9), gal.y * (1. - .6 * uHcLamp));
  vec3 rr = reflect(-hv, hn);
  float inG = step(.001, gal.y);
  // in the gallery brass mirrors the bright sheet as a hard stripe that flares when a band of water-light crosses it; outside, the sky and the trees
  float stripe = smoothstep(.12, .7, -rr.z) * (1. - smoothstep(.25, .8, abs(rr.y))) * (.4 + .6 * hcCaus(vec2(hp.x * .9 + rr.x * 3., hp.y * .4 + rr.y * 4. + uHcTime * 1.3), uHcTime));
  vec3 warm = mix(uHcCaus, vec3(1., .88, .62) * dot(uHcCaus, vec3(.34)), .6);
  vec3 env = mix(hcEnv(rr), (uHcCaus * .07 + warm * (stripe * (.3 + 2.5 * gal.z) + gal.z * .28)) * (uHcSunCol.g * .5 + .2), inG);
  hcAdd += env * mix(diffuseColor.rgb, mix(diffuseColor.rgb, vec3(1., .74, .34) * (.7 + .5 * pat), .55), inG) * 1.3 * mix(.5, 1., vAux.x);
  if (vAux.y > 1.5) hcAdd += diffuseColor.rgb * (uHcSunCol * (.12 + .3 * max(dot(hn, uHcSun), 0.)) + uHcSkyHor * .1) * (1. - inG);   // wet bronze in the open tank: never a black dot under its plume
`,ft="float hcVH(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }",ut=`
  #ifdef USE_INSTANCING
    float fph = instanceMatrix[3].x * 2.7 + instanceMatrix[3].y * 1.3;
  #else
    float fph = 0.;
  #endif
  if (aux.y < 1.5) {
    float lump = hcVH(floor(position * 40.) + 3.) - .5;
    transformed += normal * lump * .03 * step(.7, position.y);
    float k = smoothstep(.55, 1.2, position.y);
    transformed.x += sin(uHcTime * 1.9 + fph) * .035 * k; transformed.z += sin(uHcTime * 1.3 + fph * 1.7) * .03 * k;
  } else if (aux.y < 2.5) {
    float k = smoothstep(.12, .55, position.y);
    transformed.x += (sin(uHcTime * 11. + fph * 5.) * .02 + sin(uHcTime * 3.1 + fph) * .035) * k;
    transformed.y *= 1. + .12 * sin(uHcTime * 7.3 + fph * 3.) * k;
  }`,pt=`
  vec3 fc = diffuseColor.rgb; float fk = vAux.y;
  vec3 leaf = uHcLeaf * (.6 + .7 * hcN2(hp.xy * 23.));
  if (fk < .5) {
    float ruff = hcN2(hp.xy * 31. + hp.z * 19.) * .6 + hcN2(hp.xz * 57. + hp.y * 23. + 3.) * .4;
    fc *= (.66 + .58 * ruff) * (.82 + .3 * smoothstep(-.3, .9, hn.y));
    fc = mix(fc, fc * vec3(1.1, .72, .45), smoothstep(.3, .1, ruff) * .6);
    fc = mix(fc, vec3(.85, .88, .93), uHcSnow * .5 * smoothstep(.4, .9, hn.y) * step(hp.z, ${(b+.12).toFixed(2)}));
  } else if (fk < 1.5) fc = leaf;
  else if (fk < 2.5) fc = vec3(0.);
  diffuseColor.rgb = fc * mix(.45, 1., vAux.x);
`,dt=`
  vec3 gal = hcGal(hp);
  reflectedLight.directDiffuse *= gal.x * 1.15; reflectedLight.directSpecular *= gal.x * .3;
  float fdk = gal.y * (1. - .6 * uHcLamp);
  reflectedLight.indirectDiffuse = mix(reflectedLight.indirectDiffuse, diffuseColor.rgb * (uHcSkyHor * vec3(.3, .34, .4) + uHcSkyTop * .12), fdk);
  float cz = hcCaus(vec2(hp.x * .4 + hp.z * .2, hp.y * .3 + hp.z * .4 + uHcTime * .45), uHcTime * .7);
  hcAdd += diffuseColor.rgb * mix(uHcCaus, vec3(1., .9, .7) * dot(uHcCaus, vec3(.34)), .55) * (cz * .1 + .05 + gal.z * 2.9) * gal.y;     // the heads glow where a band of water-light crosses them
  // what stands in a niche catches the gallery's web of water-light where it stands: a steady floor, and a glow as each line crosses it
  vec2 fnt = hcNet(vec2(hp.x * 1.05 + hp.z * .45, hp.y * 1.1 + hp.z * 1.15 + uHcTime * .5), uHcTime * .9);
  hcAdd += diffuseColor.rgb * mix(uHcCaus, vec3(1., .9, .7) * dot(uHcCaus, vec3(.34)), .55) * (.16 + 1.5 * fnt.y) * (.7 + .6 * gal.z) * gal.y;
  if (vAux.y > 1.5 && vAux.y < 2.5) {
    float fl = .75 + .25 * sin(uHcTime * 9. + floor(hp.x) * 7.3 + floor((hp.y - .9) / 2.6) * 3.1) * sin(uHcTime * 5.3 + floor(hp.x) * 1.7);
    hcAdd += vec3(1., .6, .2) * 4.5 * fl;
  }
`,He="#include <fog_pars_vertex>",ze="#include <fog_pars_fragment>";function ke(){return w.UniformsUtils.clone(w.UniformsLib.fog)}function mt(H,l){return new w.ShaderMaterial({fog:!0,uniforms:{...ke(),...H,uJet:{value:l},uLeafAmt:{value:1},uLeafMore:{value:0}},vertexShader:`
      varying vec3 vP; attribute vec2 wk; varying vec2 vWk;
      ${He}
      void main(){ vP = position; vWk = wk; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vP; varying vec2 vWk; uniform sampler2D uJet; uniform float uLeafAmt, uLeafMore;
      ${ze}
      ${ce}
      // what the water mirrors: cold slate-teal overhead paling to the horizon with no plateau (so no contour ever
      // shows round the eye), the red crowns and the walls as soft bands, the sun
      vec3 hcEnvW(vec3 r, float gl){
        float h = clamp(r.y, 0., 1.), k = 1. - h;
        vec3 top = mix(mix(uHcSkyTop, vec3(dot(uHcSkyTop, vec3(.3, .5, .2))), .45), uHcWater * vec3(2.9, 3.4, 3.1), .86);
        vec3 c = mix(top, uHcSkyHor * vec3(.78, .96, .94), k * k * k);
        float az = atan(r.z, r.x + 1e-4);
        float crown = .5 + .5 * sin(az * 23.) * sin(az * 7. + 1.3);
        float tb = smoothstep(.015, .09, h) * (1. - smoothstep(.1 + .1 * crown, .3 + .16 * crown, h));
        c = mix(c, uHcTree * (.55 + .9 * crown), tb * .8);
        c = mix(c, uHcBand, 1. - smoothstep(.015, .09, h));
        float s = max(dot(r, uHcSun), 0.); float s2 = s * s; s2 *= s2; s2 *= s2; s2 *= s2;
        return c + uHcSunCol * vec3(1., .92, .76) * (s2 * s2 * 1.1 + s2 * .03) * gl;
      }
      void main(){
        vec3 p = vP; float t = uHcTime; float basin = step(8., p.y);
        vec3 toCam = uHcCam - p; float dist = length(toCam) + 1e-3; vec3 V = toCam / dist;
        float near = 1. / (1. + dist * .012);
        // ripples: three crossing swells and a fine chop, quieter far away
        vec2 q = p.xz; float flow = basin * t * 2.2;
        q.y += flow;
        vec2 g = vec2(0.);
        g += vec2(.8, .6) * cos(dot(q, vec2(.8, .6)) * .9 + t * 1.1) * .05;
        g += vec2(-.5, .86) * cos(dot(q, vec2(-.5, .86)) * 1.7 - t * 1.6) * .04;
        g += vec2(.2, -.98) * cos(dot(q, vec2(.2, -.98)) * 3.1 + t * 2.3) * .03;
        float ch = hcN2(q * 2.2 + vec2(t * .5, -t * .4)), ch2 = hcN2(q * 2.2 + vec2(.35, 0.) + vec2(t * .5, -t * .4)), ch3 = hcN2(q * 2.2 + vec2(0., .35) + vec2(t * .5, -t * .4));
        g += vec2(ch2 - ch, ch3 - ch) * (.05 + .3 * near);
        float foam = 0.;
        if (basin < .5) {
          // ring stamps under the jets
          vec2 gi = vec2(floor((p.x - ${Ne.toFixed(1)}) / ${re.toFixed(1)} + .5), floor((${Te.toFixed(1)} - p.z) / ${re.toFixed(1)} + .5));
          float inb = step(-.5, gi.x) * step(gi.x, ${(ae-.5).toFixed(1)}) * step(-.5, gi.y) * step(gi.y, ${(pe-.5).toFixed(1)});
          float jet = texture2D(uJet, (gi + .5) / vec2(${ae.toFixed(1)}, ${pe.toFixed(1)})).r * inb;
          vec2 d = p.xz - vec2(${Ne.toFixed(1)} + gi.x * ${re.toFixed(1)}, ${Te.toFixed(1)} - gi.y * ${re.toFixed(1)}); float r = length(d);
          float ring = sin(r * 4.2 - t * 5.) * exp(-r * .32) * (1. - smoothstep(5.5, 7., r)) * jet;
          g += d / (r + .05) * ring * .22;
          foam += jet * (1. - smoothstep(.5, 2.6, r)) * (.45 + .55 * hcN2(p.xz * 3. + t * 2.));
          // churn and rollers at the cascade foot
          float ft = smoothstep(${(P-16).toFixed(1)}, ${(P-1).toFixed(1)}, p.z) * (1. - smoothstep(30., 34., abs(p.x)));
          g.y += sin((${P.toFixed(1)} - p.z) * 1.1 - t * 3.2 + hcN2(p.xz * .3) * 4.) * .2 * ft;
          float fn = hcFbm(p.xz * .45 + vec2(0., t * 1.2));
          float fn2 = hcFbm(p.xz * 1.5 + vec2(t * .6, t * 2.1) + 7.);
          float churn = smoothstep(.76 - ft * .3, 1. - ft * .14, fn * .58 + fn2 * .42 + ft * ft * .15);
          foam += churn * ft * (.5 + .45 * fn2);                 // broken white with teal gaps, thinning away from the fall
        } else {
          // the basin slides to the lip and goes glassy
          float lipk = smoothstep(vWk.x + 5., vWk.x + .4, p.z);
          g *= 1. - lipk * .7; g.y += lipk * .15;
          if (vWk.y > .5) {                                       // the canal's own jets, 8 m either side of the axis every 10 m
            float zc = floor((p.z - 5.) / 10. + .5) * 10. + 5.;
            vec2 d = vec2(p.x - 8. * (p.x < 0. ? -1. : 1.), p.z - zc); float r = length(d);
            float ring = sin(r * 4.2 - t * 5.) * exp(-r * .32) * (1. - smoothstep(5.5, 7., r));
            g += d / (r + .05) * ring * .22;
            foam += (1. - smoothstep(.5, 2.6, r)) * (.45 + .55 * hcN2(p.xz * 3. + t * 2.));
          }
        }
        vec3 n = normalize(vec3(-g.x, 1., -g.y));
        vec3 R = reflect(-V, n); R.y = abs(R.y) + .015; R = normalize(R);
        // the sun's path is glitter: each ripple facet flashes, the water between stays its own colour
        float spk = hcN2(q * 1.7 + vec2(t * .8, -t * .6)) * .55 + hcN2(q * 4.9 + vec2(-t * 1.1, t * .9)) * .45;
        vec3 refl = hcEnvW(R, .16 + 1.5 * smoothstep(.5, .76, spk));
        if (basin < .5) {
          // analytic mirror: the cascade and its wall
          float tz = (${P.toFixed(1)} - p.z) / max(R.z, 1e-3); float hy = tz * R.y, hx = p.x + tz * R.x;
          float fz = step(.001, R.z);
          float wallM = fz * (1. - smoothstep(16., 17.2, hy)) * step(abs(hx), 100.);
          float sheetM = fz * (1. - smoothstep(15., 16.2, hy)) * (1. - smoothstep(29.5, 30.5, abs(hx)));
          vec3 wallC = uHcBand * 1.1;
          vec3 sheetC = (uHcSkyHor * .5 + uHcSunCol * .4) * (.45 + .55 * hcN2(vec2(hx * 2.5, hy * .5 + t * 2.)));
          refl = mix(refl, wallC, wallM * .9); refl = mix(refl, sheetC, sheetM * .8);
          // the black pavilion: slab test against its box
          vec3 bmin = vec3(-24., 0., ${(M-24).toFixed(1)}), bmax = vec3(24., 23.6, ${(M+24).toFixed(1)});
          vec3 inv = 1. / (R + vec3(1e-4) * (step(0., R) * 2. - 1.));
          vec3 t0 = (bmin - p) * inv, t1 = (bmax - p) * inv; vec3 tmn = min(t0, t1), tmx = max(t0, t1);
          float tn = max(max(tmn.x, tmn.y), tmn.z), tf = min(min(tmx.x, tmx.y), tmx.z);
          float hit = smoothstep(0., 8., tf - max(tn, 0.)) * step(0., tf);      // soft where the ray only clips a corner: a trembling dark, not a cut-out
          vec3 hp2 = p + R * max(tn, 0.); vec2 hq = abs(hp2.xz - vec2(0., ${M.toFixed(1)}));
          float along = min(hq.x, hq.y);
          float archM = max((1. - smoothstep(6.8, 7.6, along)) * (1. - smoothstep(16., 20.5, hp2.y)), (smoothstep(11.6, 12.2, along) - smoothstep(18.6, 19.2, along)) * (1. - smoothstep(12.5, 16., hp2.y)));
          refl = mix(refl, mix(uHcSkyTop * .08 + vec3(.012, .017, .026), refl * .5, archM * .7), hit * .86);
        }
        float fr = 1. - max(dot(n, V), 0.); float fr2 = fr * fr; float F = .04 + .96 * fr2 * fr2 * fr;
        F = max(F, .22);
        vec3 col = mix(uHcWater * 1.3, refl, F);
        float lipB = basin * smoothstep(vWk.x + 4., vWk.x + .5, p.z);
        if (basin > .5) {                                         // the garden's light on the canals; the gatehouse channel mirrors a lit vault
          float gl2 = hcGarden(p + vec3(0., .3, 0.));
          refl *= mix(1., .5, step(480.3, p.z));
          // the canal bed: glazed tiles seen through a hand of moving water (uHcGard.w: how strongly), eight-pointed
          // stars of turquoise in a cobalt ground, pale grout, each tile its own shade
          vec2 tq = (p.xz + g * 1.3) / 2.2; vec2 ti = floor(tq), tf = abs(fract(tq) - .5);
          float star = min(max(tf.x, tf.y), (tf.x + tf.y) * .7071);
          float far2 = smoothstep(30., 110., dist);                                   // the pattern melts into its mean colour with distance
          vec3 tile = mix(vec3(.035, .4, .42), vec3(.02, .13, .36), smoothstep(.3, .34, star) * (1. - far2 * .7));
          tile = mix(tile, vec3(.34, .52, .52), smoothstep(.46, .49, max(tf.x, tf.y)) * (1. - far2));
          tile = mix(tile, vec3(.5, .42, .12), (1. - smoothstep(.06, .09, star)) * (1. - far2));
          tile *= mix(.8 + .34 * hcHash(ti + 2.), .97, far2) * (uHcSunCol * (.25 + .75 * gl2) * .62 + mix(uHcSkyHor, uHcSkyTop, .5) * .5);
          float cz2 = hcCaus(p.xz * .45 + vec2(0., flow * .2), t * .9);
          tile *= 1. + cz2 * .45 * gl2 * (1. - far2);
          vec3 body = mix(uHcWater * 1.3, tile, uHcGard.w * (1. - .55 * lipB) * (1. - smoothstep(40., 150., dist) * .6));
          col = mix(body, refl, F * mix(1., .72, uHcGard.w));
          col = mix(col * vec3(.5, .62, .88), col, gl2);
          col += uHcSunCol * vec3(.5, .46, .36) * .2 * gl2 * step(480.3, p.z);
        }
        float lst = hcN2(vec2(p.x * 2.6, p.z * .42 + t * 2.6)) * .6 + hcN2(vec2(p.x * 7.1 + 3., p.z * .8 + t * 4.1)) * .4;      // the water draws out into threads as it nears a lip
        col = mix(col, uHcWater * vec3(1.1, 1.75, 1.8) * (.7 + .6 * lst), lipB * .62);
        col += (uHcSkyHor * vec3(.3, .42, .46) + uHcSunCol * .05) * lipB * smoothstep(.52, .8, lst) * .8;
        // red leaves turning on the surface (near the eye only), rafting thicker toward a lip
        vec2 lc = p.xz * .7 + vec2(t * .05, flow * .7 - t * .03); vec2 li = floor(lc), lf = fract(lc) - .5;
        float lh = hcHash(li + 17.); float la = lh * 40. + t * (.2 + lh * .3);
        lf += (vec2(hcHash(li + 3.), hcHash(li + 9.)) - .5) * .5;
        vec2 lr = vec2(lf.x * cos(la) - lf.y * sin(la), lf.x * sin(la) + lf.y * cos(la));
        float leafM = (1. - smoothstep(.1, .14, length(lr * vec2(1., 1.7)))) * step(.87 - uLeafMore - .3 * lipB, lh) * uLeafAmt * (1. - smoothstep(60., 110., dist));
        col = mix(col, mix(uHcTree * (.25 + .4 * hcHash(li + 5.)), vec3(.86, .62, .7) * (.6 + .4 * hcHash(li + 5.)), uHcGard.z) * (.4 + uHcSunCol.g * .3), leafM);          // red leaves, or in April fallen blossom
        col = mix(col, (uHcSkyHor * .45 + uHcSunCol * .35), clamp(foam, 0., 1.) * .9);
        // behind the fall the water lies in the gallery's shade
        col *= mix(vec3(1.), vec3(.4, .56, .78), (1. - basin) * smoothstep(${(P-1.9).toFixed(1)}, ${(P-.7).toFixed(1)}, p.z) * (1. - smoothstep(30., 34., abs(p.x))));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function vt(H,l,y){const r=[],S=[],T=[];for(let p=0;p<=14;p++)for(let c=0;c<=60;c++){const m=p/14,s=-j+c/60*2*j;r.push(s,D+.02-m*(D+.1),m===0?P+.6:P-.15-1.25*Math.sqrt(m)),S.push(c/60,m)}for(let p=0;p<14;p++)for(let c=0;c<60;c++){const m=p*61+c,s=m+60+1;T.push(m,s,m+1,m+1,s,s+1)}const d=new w.BufferGeometry;d.setAttribute("position",new w.Float32BufferAttribute(r,3)),d.setAttribute("uv",new w.Float32BufferAttribute(S,2)),d.setIndex(T);const f=new w.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:w.DoubleSide,uniforms:{...ke(),...H,uSeed:{value:l.sheetSeed},uScal:{value:l.scallops}},vertexShader:`
      varying vec3 vP; varying vec2 vUv; uniform float uHcTime;
      ${He}
      void main(){ vec3 p = position; vUv = uv;
        p.z += sin(p.x * .31 + uHcTime * .8 + uv.y * 3.) * .14 * uv.y + sin(p.x * 1.3 - uHcTime * 1.7) * .04 * uv.y;
        vP = p; vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vP; varying vec2 vUv; uniform float uSeed, uScal; uniform vec4 uHcHole; uniform vec2 uHcBend; uniform vec3 uHcPortal;
      ${ze}
      ${ce}
      // What lies beyond the sheet, painted from where things are known to stand (no render target): the tank and its
      // rows of jets, the walls and the red crowns over them, the black pavilion with the portal burning in its arch.
      // o = a point on the sheet, v = the view ray after the water has bent and smeared it.
      vec3 hcBeyond(vec3 o, vec3 v, float t, float jk){
        v.x *= .62; v.y = v.y * .55 - .012; v.z = min(v.z, -.05); v = normalize(v);          // the water is a lens: the far garden stands tall in it
        float h = v.y;
        vec3 sky = mix(uHcSkyHor * .9, uHcSkyTop * .8, smoothstep(0., .2, h));
        // the walls round the tank (x = +-100, z = -156), 22 m high, creeper over their tops, chinars behind them
        float sx = v.x < 0. ? -1. : 1.;
        float tx = (sx * 100. - o.x) / (sx * max(abs(v.x), 1e-3));
        float tz = (-156. - o.z) / v.z;
        float side = step(tx, tz), tw = min(tx, tz);
        float wy = o.y + v.y * tw, wa = mix(o.x + v.x * tw, o.z + v.z * tw, side);
        float tc = tw * 1.12, cy = o.y + v.y * tc, ca = mix(o.x + v.x * tc, o.z + v.z * tc, side);
        float lump = .5 + .5 * cos(ca * .12566 - mix(3.1416, 2.513, side));
        lump = lump * .7 + .3 * hcN2(vec2(ca * .11, 3. + side));
        float top = 26. + 24. * lump;
        float crown = (1. - smoothstep(top - 8., top, cy + 6. * hcN2(vec2(ca * .3, cy * .25)))) * step(21.5, wy);
        float sunSide = side * step(0., sx * uHcSun.x);
        vec3 treeC = uHcTree * vec3(1.25, .95, .8) * (.5 + .9 * hcN2(vec2(ca * .21, cy * .2 + 5.))) * (1. + 1.1 * sunSide);
        treeC = mix(treeC, uHcAccent * (1.1 + .9 * sunSide), smoothstep(top - 12., top - 2., cy) * .6);
        float bay = abs(fract(wa / 11.1) - .5);
        vec3 wallC = uHcBand * mix(.5, 1., smoothstep(.3, .34, bay) + step(14., wy)) * mix(1.5, .8, max(sunSide, 1. - side));
        wallC = mix(wallC, mix(uHcTree * .5, wallC, .25), smoothstep(15., 20., wy + 3. * hcN2(vec2(wa * .4, 1.))));
        vec3 c = mix(sky, treeC, crown);
        c = mix(c, wallC, 1. - step(22., wy));
        c = mix(c, uHcSkyHor, (1. - exp(-tw * .002)) * .7);
        // the black pavilion: slab test against its box, bright arches cut through it, the portal in the middle one
        vec3 bmin = vec3(-24., 0., ${(M-24).toFixed(1)}), bmax = vec3(24., 24.4, ${(M+24).toFixed(1)});
        vec3 inv = 1. / (v + vec3(1e-4) * (step(0., v) * 2. - 1.));
        vec3 t0 = (bmin - o) * inv, t1 = (bmax - o) * inv; vec3 tmn = min(t0, t1), tmx = max(t0, t1);
        float tn = max(max(tmn.x, tmn.y), tmn.z), tf = min(min(tmx.x, tmx.y), tmx.z);
        float hit = step(tn, tf) * step(0., tf);
        vec3 hp2 = o + v * max(tn, 0.); vec2 hq = abs(hp2.xz - vec2(0., ${M.toFixed(1)}));
        float along = min(hq.x, hq.y);
        float archM = max((1. - smoothstep(6.6, 7.8, along + max(hp2.y - 13., 0.) * .9)) * (1. - smoothstep(19., 21., hp2.y)),
          (smoothstep(11.6, 12.4, along) - smoothstep(18.4, 19.2, along)) * (1. - smoothstep(13., 16.5, hp2.y + abs(along - 15.4) * .8)));
        vec3 pavC = mix(vec3(.008, .009, .013) + uHcSkyHor * .012, uHcSkyHor * .09, archM * step(2., hp2.y));
        float pr = length(vec2(hp2.x, (hp2.y - 9.) * .9));
        pavC += uHcPortal * (2.6 * exp(-pr * pr / 34.) + .6 * exp(-pr * pr / 260.)) * step(hq.x, hq.y);
        c = mix(c, pavC, hit);
        vec3 pd = normalize(vec3(0., 9., ${(M-22).toFixed(1)}) - o);
        c += uHcPortal * .4 * exp(-(1. - max(dot(v, pd), 0.)) * 260.);
        // the tank: slate-teal mirroring the pale horizon and the red crowns, churned white under the fall
        if (h < -.004) {
          float tq = -o.y / h;
          if (tq < tw && (hit < .5 || tq < tn)) {
            vec2 q = o.xz + v.xz * tq;
            float gl = exp(h * 11.);
            vec3 wc = mix(uHcWater * 1.5 + sky * .1, mix(uHcSkyHor * .62, uHcTree * .75, .42 + .3 * hcN2(q * vec2(.05, .3))), gl);
            wc = mix(wc, uHcSkyHor * .5 + uHcSunCol * .3, (1. - smoothstep(1., 15., ${P.toFixed(1)} - q.y)) * (.45 + .4 * hcN2(q * .5 + vec2(0., t * 1.5))));
            c = mix(wc, uHcSkyHor, (1. - exp(-tq * .0032)) * .6);
          }
        }
        // the jets: seven rows of them, then the rest as a pale band under the horizon
        float jets = 0.;
        for (int k = 0; k < 7; k++) {
          float fk = float(k), tk = (70. - 14. * fk - o.z) / v.z;
          vec3 pk = o + v * tk;
          // no two alike: each stands off its mark, some are missing, tall thin plumes among low wide bells, all drawn out by the water
          float ji = floor((pk.x + 98.) / 14.), jh = hcHash(vec2(ji, fk) + 5.), jo = hcHash(vec2(ji, fk) + 9.);
          float dx = abs(pk.x + 98. - (ji + .5 + (jo - .5) * .56) * 14.);
          float H = 7.6 * (.28 + 1.9 * jh * jh) * (.72 + .28 * sin(t * .45 + ji * 2.0944 + fk * 4.19));
          dx *= .5 + 1.5 * (1. - jh);
          float inT = step(abs(pk.x), 96.) * step(0., pk.y) * step(.26, fract(jo * 7.31));
          float m = (1. - smoothstep(.3, 1.3 + tk * .012, dx)) * (1. - smoothstep(H - 3.5, H + 1.6, pk.y));
          m += .5 * jh * (1. - smoothstep(.8, 3.2, dx)) * smoothstep(H - 4., H - .5, pk.y) * (1. - smoothstep(H, H + 1.2, pk.y));
          jets += m * inT * exp(-tk * .005);
        }
        jets += .45 * (1. - smoothstep(0., .04, abs(h + .008))) * (.5 + .5 * hcN2(vec2(v.x / max(-v.z, .05) * 40., 2.)));
        c = mix(c, uHcSkyHor * .55 + uHcSunCol * .36, clamp(jets, 0., 1.) * .9 * jk);
        return c;
      }
      void main(){
        float t = uHcTime; float x = vP.x + uSeed; float v = vUv.y; float s = sqrt(max(v, 0.)) * 16.;   // fall accelerates
        float n1 = hcN2(vec2(x * 6.5, s * .55 - t * 2.9));
        float n2 = hcN2(vec2(x * 2.1 + 5., s * .3 - t * 1.9));
        float n3 = hcN2(vec2(x * 17., s * 1.1 - t * 4.3));
        float comb = .5 + .5 * cos(6.2831853 * (vP.x + 30.) * uScal / 60.);
        float thick = smoothstep(.4, .85, hcN2(vec2(x * .13, s * .16 - t * .55)));           // slow thickenings
        float n4 = hcN2(vec2(x * 3.3 + 2., s * .4 - t * 2.3));
        float dens = clamp(.02 + .3 * n1 + .22 * n2 + .22 * n4 + .2 * n3 * n1 + .3 * thick + comb * (1. - v) * .2, 0., 1.);
        dens = smoothstep(.2, .85, dens);
        float lip = 1. - smoothstep(.0, .06, v);
        dens = mix(dens, .35, lip);
        float spray = smoothstep(.8, 1., v) * (.5 + .5 * hcN2(vec2(x * 1.2, t * 1.5)));
        vec3 D = normalize(vP - uHcCam + vec3(0., 1e-4, 0.));
        float fs = max(dot(D, uHcSun), 0.); float fs2 = fs * fs; float fs6 = fs2 * fs2 * fs2;
        float inner = smoothstep(-.02, .08, -D.z);                                         // 1 seen from the gallery, 0 from the tank
        vec3 amb = mix(uHcSkyHor, uHcSkyTop, .35);
        // seen from the tank: the lit face of the fall
        float front = max(dot(-D, vec3(0., 0., -1.)), 0.) * max(-uHcSun.z, 0.);
        vec3 glass = mix(uHcWater * 1.5 + amb * .3, amb * .74 + uHcSunCol * .1, dens);
        glass = mix(glass, amb * .8 + uHcSunCol * .22, smoothstep(.55, .9, n3 * .6 + n1 * .4) * .6);          // threads of white in it
        vec3 colT = glass + uHcSunCol * (front * .5 * dens + fs6 * (.06 + .7 * dens * dens) + fs2 * .03);
        colT += uHcSunCol * vec3(1., .8, .45) * fs6 * fs6 * n3 * dens * .8;
        float alphaT = mix(.42, .92, dens);
        // seen from behind: streaked glass. Each thread of water bends the view its own way, so the garden beyond
        // arrives as trembling smears of its colours, and the sun burns through where the view runs toward it
        vec3 vb = vec3(D.x * uHcBend.x - D.z * uHcBend.y, D.y, D.z * uHcBend.x + D.x * uHcBend.y);
        vb.y += (n1 - .5) * .05 + (n2 - .5) * .04 + (n3 - .5) * .015;
        vb.x += (n4 - .5) * .05;
        float outG = smoothstep(31., 38., abs(uHcCam.x)) * inner;                                // the eye stands beyond the end of the shelf: the fall seen along its back
        vec3 beyond = hcBeyond(vP, vb, t, 1. - .6 * outG) * vec3(.8, .94, .92);
        float fs12 = fs6 * fs6, fs48 = fs12 * fs12; fs48 *= fs48;
        float core = fs48 * fs48; core *= core; core *= core;
        float thru = .25 + .75 * smoothstep(.02, .3, dot(beyond, vec3(.3, .5, .2)));
        vec3 milk = amb * .36 + uHcSunCol * (.02 + .14 * fs12);
        vec3 colG = mix(beyond, milk, dens * dens * .3 * thru);
        float thread = smoothstep(.62, .9, n3) * smoothstep(.3, .8, n1);
        colG += (amb * .15 + uHcSunCol * (.025 + .22 * fs12)) * thread * thru;
        colG += uHcSunCol * ((fs48 * (.04 + .22 * dens) + fs12 * .02) * thru + core * 1.4);
        colG += uHcSunCol * vec3(1., .8, .45) * fs48 * n3 * dens * .5 * thru;                       // gold in the brightest streaks
        float alphaG = mix(.9, .98, dens);
        // from there it is plainly falling water: white streaks and thickenings over teal glass, the sun gold in its top
        vec3 fallC = mix(uHcWater * 1.7 + amb * .26, amb * .82 + uHcSunCol * .14, dens) + (amb * .3 + uHcSunCol * .16) * thread;
        fallC += uHcSunCol * vec3(1., .8, .45) * (1. - smoothstep(0., .55, v)) * (.06 + .5 * fs2) * (.35 + .65 * dens);
        colG = mix(colG, mix(colG * .5, fallC, .35 + .65 * dens), outG * .85);
        alphaG = mix(alphaG, mix(.55, .96, dens), outG);
        vec3 col = mix(colT, colG, inner); float alpha = mix(alphaT, alphaG, inner);
        alpha = mix(alpha, max(alpha, .8), spray * .7);
        col += amb * lip * mix(.4, .15, inner) + (amb * .3 + uHcSunCol * .15) * spray;
        // leaves coming over the lip as dark flecks
        vec2 lc = vec2(x * .55, s * .22 - t * .62); vec2 li = floor(lc), lf = fract(lc) - .5;
        float lh = hcHash(li + 4.);
        lf += (vec2(hcHash(li + 1.), hcHash(li + 2.)) - .5) * .6;
        float fleck = (1. - smoothstep(.03, .05, length(lf * vec2(1., .5)))) * step(.84, lh);
        col = mix(col, uHcTree * .22, fleck * .9); alpha = mix(alpha, .95, fleck);
        // the tear round the camera
        float hd = length(vec2(vP.x - uHcHole.x, (vP.y - uHcHole.y) * .85)) + (n1 - .5) * 2.5 * step(.01, uHcHole.z);
        float open = smoothstep(uHcHole.z * .75, uHcHole.z + .01, hd);
        float rim = (1. - smoothstep(0., 3., abs(hd - uHcHole.z))) * step(.01, uHcHole.z);
        col += (amb + uHcSunCol * .6) * rim * mix(.8, .45, inner); alpha = mix(alpha, .95, rim * .6) * mix(1., open, step(.01, uHcHole.z));
        // the ends fray: over the last metres the sheet thins to separate falling threads, the strongest lasting longest
        float endk = smoothstep(23.4, 29.9, abs(vP.x));
        float fray = hcN2(vec2(x * 3.3, s * .12 - t * .9)) * .6 + n1 * .4;
        alpha *= mix(1., smoothstep(.22 + .5 * endk, .34 + .56 * endk, fray), endk) * (1. - smoothstep(29.6, 30.05, abs(vP.x)));
        gl_FragColor = vec4(col, alpha);
        #include <fog_fragment>
      }`}),o=new w.Mesh(d,f);return o.renderOrder=3,o.frustumCulled=!1,o}function xt(H,l,y){const e=[],t=(o,p)=>{for(let c=0;c<p;c++){const m=c/p,s=(c+1)/p;e.push(-1,m,o,1,m,o,1,s,o,-1,m,o,1,s,o,-1,s,o)}};t(-1,9);for(let o=0;o<6;o++)t(o,6);const r=new w.InstancedBufferGeometry;r.setAttribute("position",new w.Float32BufferAttribute(e,3));const S=new Float32Array(l.length*4);l.forEach((o,p)=>{S[p*4]=o.x,S[p*4+1]=o.z,S[p*4+2]=o.group,S[p*4+3]=o.seed}),r.setAttribute("iJet",new w.InstancedBufferAttribute(S,4)),r.instanceCount=l.length,r.setAttribute("iJetY",new w.InstancedBufferAttribute(new Float32Array(l.map(o=>o.y||0)),1));const T=new Float32Array(l.length*3);l.forEach((o,p)=>{const c=o.k||[1,1,0];T[p*3]=c[0],T[p*3+1]=c[1],T[p*3+2]=c[2]}),r.setAttribute("iJetK",new w.InstancedBufferAttribute(T,3));const d=new w.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:w.DoubleSide,uniforms:{...ke(),...H,uJetH:{value:y}},vertexShader:`
      attribute vec4 iJet; attribute float iJetY; attribute vec3 iJetK; uniform float uHcTime, uJetH; uniform vec3 uHcCam;
      varying vec4 vJ; varying vec3 vP; varying float vArch;
      ${He}
      void main(){
        float s = position.y, id = position.z, seed = iJet.w, t = uHcTime;
        float H = uJetH * iJetK.x * (.9 + .25 * seed) * (.72 + .28 * sin(t * .45 + iJet.z * 2.0944 + seed * .6));
        vec3 base = vec3(iJet.x, iJetY, iJet.y), c, tg; float w;
        vArch = iJetK.z;
        if (iJetK.z > .5) {
          // an arch of water thrown across the canal: seven strands of slightly different reach, combed apart as they fall
          float k2 = id + 1., sgn = base.x < 0. ? 1. : -1., al = step(1.5, iJetK.z);
          float reach = mix(12.4, 8.5, al) + mix(1.5, .8, al) * sin(k2 * 2.4 + seed * 9.) + mix(.5, .25, al) * sin(t * .9 + k2);
          float apex = (uJetH * iJetK.x * (1.16 + .1 * sin(k2 * 1.7 + seed * 5.))) * (.93 + .07 * sin(t * .45 + iJet.z * 2.0944));
          float zo = ((k2 - 3.) * .34 + sin(t * 1.3 + k2 * 2. + seed * 20.) * .12) * mix(1., .5, al);
          // thrown across (toward the axis) or along (down the canal, combed a little outward, away from the axis)
          vec3 thr = mix(vec3(sgn, 0., 0.), vec3(0., 0., -1.), al), cmb = mix(vec3(0., 0., 1.), vec3(-sgn, 0., 0.), al);
          c = base + thr * (reach * s) + vec3(0., .5 + apex * 4. * s * (1. - s) - .3 * s, 0.) + cmb * (zo * s * (.4 + s) + al * .7 * s);
          tg = normalize(thr * reach + vec3(0., apex * 4. * (1. - 2. * s), 0.) + cmb * zo);
          w = mix(.07, .17, s);
        } else if (id < -.5) {
          c = base + vec3(sin(t * 3.1 + s * 5. + seed * 40.) * .07 * s, .5 + s * H, cos(t * 2.3 + s * 4. + seed * 17.) * .07 * s);
          tg = vec3(0., 1., 0.); w = mix(.34, .2, s) * mix(1., .78, step(1.35, iJetK.x));
        } else {
          float ang = id * 1.0472 + seed * 6.283 + sin(t * .7 + id) * .15;
          vec3 dir = vec3(cos(ang), 0., sin(ang)); float rr = 2.1 * iJetK.y * (.75 + .5 * fract(seed * 7.3 + id * .37));
          float top = .5 + H;
          c = base + dir * rr * s + vec3(s * s * (.7 + .5 * sin(t * .31 + seed * 9.)), top * (1. - s * s) + .7 * sin(3.14159 * s), 0.);   // spray drifts left to right
          tg = normalize(dir * rr + vec3(0., -2. * top * s + 2.2 * cos(3.14159 * s), 0.)); w = mix(.2, .5, s);
        }
        vec3 toCam = uHcCam - c; vec3 side = cross(tg, toCam); side /= max(length(side), 1e-4);
        float dC = length(toCam);
        w *= 1. + dC / 90.;
        // slim near the eye: over the last 15 m a ribbon narrows, and none is ever wider on screen than about a fiftieth of its distance
        w = min(w * mix(.45, 1., smoothstep(2., 15., dC)), .014 * dC);
        vec3 p = c + side * position.x * w;
        vJ = vec4(position.x, s, id, seed); vP = p;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec4 vJ; varying vec3 vP; varying float vArch;
      ${ze}
      ${ce}
      void main(){
        // across and along a ribbon both stay in their own range: on a ribbon thinner than a pixel antialiasing reads them far outside it
        float ac = clamp(vJ.x, -1., 1.), s = clamp(vJ.y, 0., 1.), id = vJ.z, seed = vJ.w, t = uHcTime; float a;
        float edge = 1. - ac * ac;
        if (vArch > .5) a = edge * (.4 + .6 * hcN2(vec2(ac * 3. + id * 5. + seed * 9., s * 22. - t * 9.))) * smoothstep(0., .04, s) * (1. - .55 * smoothstep(.7, 1., s)) * .8;
        else if (id < -.5) a = edge * (.55 + .45 * hcN2(vec2(ac * 3. + seed * 9., s * 13. - t * 7.))) * (1. - .4 * smoothstep(.85, 1., s));
        else a = edge * edge * (.2 + .8 * hcN2(vec2(ac * 2.5 + id * 3., s * 8. - t * 5. + seed * 7.))) * (1. - smoothstep(.8, 1., s)) * smoothstep(0., .1, s) * .75;
        vec3 D = normalize(vP - uHcCam + vec3(0., 1e-4, 0.));
        float fs = max(dot(D, uHcSun), 0.); fs *= fs; fs *= fs;
        vec3 amb = mix(uHcSkyHor, uHcSkyTop, .3);
        vec3 col = amb * .55 + uHcSunCol * (.2 + .5 * fs);
        col = mix(col, col * vec3(1.15, .86, .5), smoothstep(.45, 1., abs(ac)) * (.3 + .7 * fs));     // gold rim
        col *= mix(vec3(.5, .6, .82), vec3(1.), hcGarden(vP));
        float dE = length(vP - uHcCam);
        // toward its top (an arch toward its fall) the water breaks into beads; too fine to draw far off, so it eases out with distance
        float bead = smoothstep(.3, .62, hcN2(vec2(ac * 1.6 + id * 3.7 + seed * 31., s * 34. - t * 8.)));
        a *= mix(1., .12 + 1.05 * bead, smoothstep(.45, .95, s) * (1. - smoothstep(22., 55., dE)));
        // and it thins as it nears the eye: translucent over the last 14 m, gone before it could cross the lens
        a *= (.55 + .45 * smoothstep(6., 22., dE)) * mix(.5, 1., smoothstep(2., 14., dE)) * smoothstep(.5, 3., dE);
        gl_FragColor = vec4(col, a * .82);
        #include <fog_fragment>
      }`}),f=new w.Mesh(r,d);return f.frustumCulled=!1,f.renderOrder=4,f}function yt(H,l,y,e){const t=[],r=Math.round(44*y),S=Math.round(9*y),T=Math.round(110*y);for(let s=0;s<r;s++)t.push([l.range(-31,31),.2,P-l.range(.5,9),l(),0,l.range(5,9)]);for(const s of[-1,1])for(let h=0;h<S;h++)t.push([s*l.range(26,36),.6,l.range(P+2,b-2),l(),0,l.range(4,7)]);for(let s=0;s<T;s++)t.push([l.range(-j,j),0,l.range(P+1.4,b-.8),l(),1,l.range(.5,1.1)]);const d=Math.round(84*y);for(let s=0;s<d;s++)t.push([-j+1+58*(s+l())/d,.25,P-1.4+l.range(-.5,2.6),l(),3,l.range(1.9,3.5)]);for(const s of[-1,1])for(let h=0;h<Math.round(13*y);h++)t.push([s*l.range(21,36),.3,P-l.range(-1.2,7),l(),0,l.range(6.5,10.5)]);for(const s of e||[])t.push(s);const f=new w.InstancedBufferGeometry;f.setAttribute("position",new w.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0],3));const o=new Float32Array(t.length*4),p=new Float32Array(t.length*2);t.forEach((s,h)=>{o.set(s.slice(0,4),h*4),p[h*2]=s[4],p[h*2+1]=s[5]}),f.setAttribute("iM",new w.InstancedBufferAttribute(o,4)),f.setAttribute("iK",new w.InstancedBufferAttribute(p,2)),f.instanceCount=t.length;const c=new w.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...ke(),...H},vertexShader:`
      attribute vec4 iM; attribute vec2 iK; uniform float uHcTime; uniform vec3 uHcCam;
      varying vec4 vM; varying vec3 vP; varying float vNear;
      ${He}
      void main(){
        float t = uHcTime, seed = iM.w; vec3 c = iM.xyz; vec3 p; float life; vNear = 1.;
        vec3 toCam = uHcCam - c; vec3 side = normalize(vec3(toCam.z, 0., -toCam.x) + vec3(1e-4, 0., 0.));
        if (iK.x > 2.5) {
          life = fract(t * (.16 + .14 * seed) + seed * 7.31);
          c += vec3(sin(t * .4 + seed * 40.) * .5 + life * .5, life * (1.1 + 2.6 * seed), (seed - .5) * life * 1.2);
          float sz = iK.y * (.45 + .95 * life);
          vec3 up = normalize(cross(side, normalize(uHcCam - c + vec3(0., 1e-4, 0.))));
          p = c + (side * position.x + up * position.y) * sz;
        } else if (iK.x < .5) {
          life = fract(t * (.07 + .05 * seed) + seed * 7.31);
          c += vec3(sin(t * .23 + seed * 40.) * 1.5 + life * 2., life * (3. + 5. * seed), -life * 3. * step(c.z, ${P.toFixed(1)}));
          float sz = iK.y * (.6 + .8 * life);
          vec3 up = normalize(cross(side, normalize(uHcCam - c + vec3(0., 1e-4, 0.))));
          p = c + (side * position.x + up * position.y) * sz;
        } else if (iK.x > 1.5) {
          life = fract(t * (.045 + .03 * seed) + seed * 7.31);
          c += vec3(sin(t * .21 + seed * 40.) * 1.4, life * .6 + iK.y * .05, 8. - life * 16.);
          float sz = iK.y * (.75 + .5 * life);
          p = c + side * position.x * sz + vec3(0., position.y * min(sz * .19, 1.7), 0.);        // it lies on the water, 1 to 3 m deep
        } else {
          life = fract(t * (.33 + .2 * seed) + seed * 13.7);
          float y = 14.6 - (14.6 - .55) * life * life + (c.z - ${P.toFixed(1)}) * -.05;
          c.y = y; p = c + side * position.x * .022 + vec3(0., position.y * iK.y * (.15 + .5 * life), 0.);
          vNear = smoothstep(.6, 2.5, length((modelViewMatrix * vec4(c, 1.)).xyz)) * 1.002;        // the kit's near law for small falling things (its own two numbers, and like the kit's by the true distance of the drip's centre from the eye): a drip thins to nothing as it nears the eye. Carried a hair over 1 and cut at 1 below, so that a drip further off than 2.5 m is drawn to the bit as it was, whatever a graphics card's interpolation makes of a constant
        }
        vM = vec4(position.xy, iK.x, life); vP = p;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec4 vM; varying vec3 vP; varying float vNear;
      ${ze}
      ${ce}
      void main(){
        vec3 D = normalize(vP - uHcCam + vec3(0., 1e-4, 0.)); float fs = max(dot(D, uHcSun), 0.); fs *= fs;
        vec3 amb = mix(uHcSkyHor, uHcSkyTop, .3); vec3 col; float a;
        if (vM.z < .5 || vM.z > 1.5) {
          float r = length(vM.xy); float n = hcN2(vM.xy * 2.3 + vP.xz * .15 + uHcTime * .2);
          a = (1. - smoothstep(.15, 1., r + (n - .5) * .5)) * (1. - smoothstep(.72, 1., r)) * sin(3.14159 * vM.w) * (vM.z < .5 ? .25 : .17);
          col = amb * .7 + uHcSunCol * (.08 + .3 * fs * fs);
          float nearFade = smoothstep(2., 9., length(vP - uHcCam)); a *= nearFade;
          if (vM.z > 2.5) {                                   // spray at the foot of the fall: denser, torn, cool in the gallery's shade
            a = min(a * 2.6 * (.45 + .9 * hcN2(vM.xy * 3.1 + vP.xy * .7 - vec2(0., uHcTime * 1.3))), .46);
            col = mix(amb * .62 + uHcCaus * .2 + uHcSunCol * (.05 + .25 * fs * fs), col, smoothstep(${(P-.4).toFixed(1)}, ${(P-2.4).toFixed(1)}, vP.z));
          } else if (vM.z > 1.5) {                                   // the canal mist: blue in shadow, white where the sun crosses it
            float lit = hcGarden(vP);
            a = min(a * 1.5 * uHcMist * (.45 + 1.1 * hcN2(vP.xz * .3 + vec2(uHcTime * .12, 0.))), .5);     // wisps, never a slab
            a *= .35 + .65 * smoothstep(8., 30., length(vP - uHcCam));
            a *= smoothstep(-.15, 1.1, vP.y - hcGround(vP.z));
            col = mix(amb * vec3(.5, .62, .86), amb * .55 + uHcSunCol * (.26 + .42 * fs * fs), lit);
          }
        } else {
          // a drip is thinner than a pixel far off: both of its coordinates stay in their own range (see the jets)
          a = (1. - min(abs(vM.x), 1.)) * (1. - min(vM.y * vM.y, 1.)) * .55 * min(vNear, 1.);
          col = uHcCaus * .9 + amb * .4 + uHcSunCol * fs * fs * 1.2;
        }
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}),m=new w.Mesh(f,c);return m.frustumCulled=!1,m.renderOrder=5,m}function gt(H){const l=new w.BufferGeometry;l.setAttribute("position",new w.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));const y=new w.ShaderMaterial({transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...H},vertexShader:"varying vec2 vS; void main(){ vS = position.xy; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
      varying vec2 vS; uniform float uHcBurst; uniform vec4 uHcVeil;
      ${ce}
      void main(){
        float k = uHcBurst, t = uHcTime; float env = smoothstep(0., .32, k) * (1. - smoothstep(.42, 1., k));
        float x = vS.x, y = vS.y;
        float sway = sin(y * 1.7 + t * 2.1) * .012;
        float a1 = hcN2(vec2((x + sway) * 47., y * .8 + t * 5.2));                  // threads a hundredth of the frame wide, falling
        float a2 = hcN2(vec2((x + sway) * 118. + 3., y * 1.7 + t * 9.));            // hair-fine ones, faster
        float a3 = hcN2(vec2(x * 3.1 + 7., y * .35 + t * 1.9));                     // where they gather (their number, never their width)
        float brk = hcN2(vec2(x * 47. + 11., y * 6.5 + t * 13.));                   // each thread breaks into drops as it falls
        float th = smoothstep(.6, .82, a1) * (.4 + .6 * a3) * (.1 + .9 * smoothstep(.3, .62, brk)) + smoothstep(.68, .86, a2) * .45;
        float st = .3 + .6 * th;
        float beads = smoothstep(.83, .9, hcN2(vec2(x * 85., y * 5. + t * 15.))) * smoothstep(.3, .7, a3);
        // the curtain stands on the sheet's side of the frame and opens from the other as the eye clears it
        float edge = mix(.3, 1.3, smoothstep(.42, 1., k)) + (a3 - .5) * .4;
        float side = mix(1., smoothstep(edge - .3, edge + .3, x * uHcVeil.x), abs(uHcVeil.x));
        vec2 sd = vS - uHcVeil.yz; float sun = uHcVeil.w * exp(-dot(sd, sd) * 1.6);
        // fine spray: a breath of haze, thin threads and drops, brightest toward the sun; what lies beyond shows between them
        float a = env * side * (.035 + .06 * a3 + .36 * th * (.75 + .5 * sun) + beads * .38);
        vec3 teal = uHcWater * vec3(2.2, 3.1, 3.) + uHcSkyHor * .22;
        vec3 white = uHcSkyHor * .62 + uHcSunCol * .3;
        vec3 col = mix(teal, white, smoothstep(.42, .8, st)) * (.8 + .4 * a2);
        col += uHcSunCol * vec3(1., .82, .5) * sun * (.35 + .9 * smoothstep(.5, .85, st)) + uHcSunCol * beads * .5;
        gl_FragColor = vec4(col, clamp(a, 0., .6));
      }`}),e=new w.Mesh(l,y);return e.frustumCulled=!1,e.renderOrder=999,e.visible=!1,e}const De=[[-41,24,130],[-41,23,104],[-42,15,91],[-33,7.6,92],[-12,7.3,92],[7,7.3,92],[17,7.2,90],[25,6.5,84],[33,5.2,75],[40,4.5,50],[38,4.5,20],[22,5.5,-8],[8,7.5,-30],[0,9,-46],[0,9,-76],[0,9,-102]],Ht=[[[-33,7.3,92],[30,6.5,92.5]],[[26,7.3,92],[-30,6.5,92]],[[0,7.3,92],[5,7,100]],[[6,7.3,92.5],[-8,6,84]],[[30,5,66],[2,9,-80]],[[4,9,-34],[0,10,-104]],[[1,9,-66],[0,9.5,-104]],[[-22,22,132],[0,6,-80]],[[38,10,22],[0,7.3,92]],[[13,7,-46],[-4,13,-60]]];async function zt(H,l={}){const y=H.rng.fork?H.rng.fork("cwt-hero"):H.rng,e=H.quality?.detail??1,t=(l.palette&&l.palette.length>=7?l.palette:Ye).slice(),r=l.look||"october",S=(l.sunDir?new O().copy(l.sunDir):new O(-Math.sin(Math.PI/3)*Math.cos(.244),Math.sin(.244),-Math.cos(Math.PI/3)*Math.cos(.244))).normalize(),T={foils:y.pick([5,5,7]),pavFoils:y.pick([7,9,11]),scallops:y.pick([30,40,48]),finial:y.range(.9,1.25),sheetSeed:y.range(0,100),arrange:y.pick(["scatter","rows","chevron","bands"]),jetH:y.range(6.4,8.2),warm:y.range(-1,1)},d=new w.Color(t[6]);d.lerp(new w.Color(T.warm>0?"#b08a78":"#8f9099"),Math.abs(T.warm)*.3);const f=t.slice();f[6]="#"+d.getHexString();const o=Ze(t,r,S),p=new w.Group;p.name="chinar-water-terraces-hero";const c={foils:T.foils,pavFoils:T.pavFoils,scallops:T.scallops,finial:T.finial,terrace:l.terrace!==!1};c.carve=H.core.makeRng(H.core.hashSeed("cwt-gallery-carve:"+H.seed));const m=()=>H.yield?.(),s=await Xe(f,y.fork?y.fork("stone"):y,c,m);await m();const h=de(new w.MeshStandardMaterial({vertexColors:!0,roughness:.92,metalness:0}),o,"stone",{pars:Je,color:Qe,rough:et,light:tt}),g=new w.Mesh(await s.geometryAsync(m),h);g.frustumCulled=!1,p.add(g);let u=s.n/3;await m();const v=await st(t,y,c,m);await m();const k=de(new w.MeshStandardMaterial({vertexColors:!0,roughness:.2,metalness:0}),o,"marble",{color:ot,rough:at,light:ct}),C=new w.Mesh(await v.b.geometryAsync(m),k);p.add(C);const A=de(new w.MeshStandardMaterial({vertexColors:!0,roughness:.3,metalness:.85}),o,"metal",{color:lt,light:ht});p.add(new w.Mesh(v.g.geometry(),A)),u+=(v.b.n+v.g.n)/3,await m();const q=nt(t),F=rt(r),a=de(new w.MeshStandardMaterial({vertexColors:!0,roughness:.85,metalness:0}),o,"flower",{vpars:ft,vert:ut,pars:Je,color:pt,light:dt}),n=r==="night",i=n?null:new w.InstancedMesh(q,A,300),x=new w.InstancedMesh(F,a,300),N=r==="april"?["#efe9d2","#f2d43a","#f6f1e4","#f0b92e"]:[t[1],"#e8701a","#f6c12a",t[0]],K=new w.Matrix4,$=new w.Quaternion,I=new O,Z=new O,le=new O(0,1,0),he=new w.Color;for(let z=0;z<5;z++)for(let L=0;L<60;L++){const W=z*60+L,_=y.range(.9,1.08);Z.set(-j+L+.5+y.range(-.03,.03),.9+z*2.6+.3,b+.27),$.setFromAxisAngle(le,y.range(0,6.283)),I.set(_,_*y.range(.94,1.1),_),i&&(K.compose(Z,$,I),i.setMatrixAt(W,K)),n?($.setFromAxisAngle(le,Math.PI/2+y.range(-.4,.4)),I.setScalar(y.range(1,1.25))):I.multiplyScalar(y.range(.92,1.12)),K.compose(Z,$,I),x.setMatrixAt(W,K);let E;T.arrange==="rows"?E=z%3:T.arrange==="chevron"?E=(Math.abs(L%12-6)+z)%3:T.arrange==="bands"?E=Math.floor(L/5)%3:E=y.int(0,2),y.chance(.06)?E=3:y.chance(.12)&&(E=y.int(0,2)),he.set(N[E]).multiplyScalar(y.range(.82,1)),x.setColorAt(W,n?he.set("#ffffff"):he)}i&&(i.frustumCulled=!1,p.add(i),u+=300*q.attributes.position.count/3),x.frustumCulled=!1,x.instanceColor.needsUpdate=!0,p.add(x),u+=300*F.attributes.position.count/3,await m();const Ce=(l.route||De).map(z=>z.isVector3?[z.x,z.y,z.z]:z),Ie=(z,L,W,_)=>{const E=_[0]-W[0],R=_[2]-W[2],ee=E*E+R*R||1,U=oe(((z-W[0])*E+(L-W[2])*R)/ee,0,1);return Math.hypot(z-W[0]-E*U,L-W[2]-R*U)},Se=[],Ge=new Uint8Array(ae*pe*4);for(let z=0;z<pe;z++)for(let L=0;L<ae;L++){const W=Ne+L*re,_=Te-z*re;if(Math.abs(W)<49&&Math.abs(_-M)<49||Math.abs(W)<9&&(_<12||_<M)||Math.abs(_-M)<9||_<we+5)continue;let E=1e9;for(let be=0;be+1<Ce.length;be++)E=Math.min(E,Ie(W,_,Ce[be],Ce[be+1]));if(E<9)continue;const R=y(),ee=Math.max(Math.abs(W),Math.abs(_-M)),U=Math.min(Math.abs(W),Math.abs(_-M))<16,X=oe((ee-64)/56,0,1),Q=(L===0||L===ae-1)&&z%2===0,ie=Math.sin(Math.floor((L+1)/2)*12.9898+Math.floor(z/2)*78.233)*43758.5453,ue=ie-Math.floor(ie);if(ee>=64&&!U&&!Q&&ue<.3)continue;const ge=ee<64?[1.85+.7*R,.36,0]:U?[.27+.14*R,2.1,0]:Q?[.85+.35*R,1,1]:ue>.72?[1.55+.6*R,.07,0]:[(1.5-.95*X)*(.75+.5*R),oe(.5+1.2*X,.45,1.7),0];ge[2]<.5&&(ge[1]=Math.min(ge[1],Math.max(.07,(E-8.8)/2.625))),Se.push({x:W,z:_,group:(L+z*2)%3,seed:R,k:ge}),Ge[(z*ae+L)*4]=255}const fe=new w.DataTexture(Ge,ae,pe,w.RGBAFormat);fe.magFilter=fe.minFilter=w.NearestFilter,fe.needsUpdate=!0;const Me=new w.BufferGeometry,Pe=[],Be=[],Re=c.terrace?150:b+1.3,Ae=(z,L,W,_,E,R,ee)=>{const U=Math.min(z,L),X=Math.max(z,L),Q=Math.min(W,_),ie=Math.max(W,_);Pe.push(U,E,Q,X,E,ie,X,E,Q,U,E,Q,U,E,ie,X,E,ie);for(let ue=0;ue<6;ue++)Be.push(R,ee)};Ae(-J,J,we,P+2.2,0,P,0),Ae(-j,j,P+.5,Re,D,P,0);for(const z of l.canals||[])Ae(z.x0,z.x1,z.z0,z.z1,z.y,z.lip??-1e4,z.jets?1:0);Me.setAttribute("position",new w.Float32BufferAttribute(Pe,3)),Me.setAttribute("wk",new w.Float32BufferAttribute(Be,2));const me=new w.Mesh(Me,mt(o,fe));me.frustumCulled=!1,p.add(me);const Ue=vt(o,{sheetSeed:T.sheetSeed,scallops:T.scallops},e);p.add(Ue);const ve=Se.concat(l.extraJets||[]),Ve=xt(o,ve,T.jetH);p.add(Ve);const Le=it(),qe=new w.InstancedMesh(Le,A,ve.length);ve.forEach((z,L)=>{Z.set(z.x,z.y||0,z.z),$.setFromAxisAngle(le,z.seed*6.283),I.setScalar(1.1),K.compose(Z,$,I),qe.setMatrixAt(L,K)}),qe.frustumCulled=!1,p.add(qe);const Ke=yt(o,y,e,l.mist);p.add(Ke);const xe=l.veil===!1?null:gt(o);xe&&p.add(xe),u+=4+840*2+ve.length*(90+Le.attributes.position.count/3)+Ke.geometry.instanceCount*2,await m();const Oe=new O(0,8,-10),V=new O,se=new O,ye=new O,$e=new O;let _e=0,We=0;return{object:p,radius:70,height:29,center:Oe,ground:!0,groundY:-.6,footprint:{x:[-J,J],z:[we,c.terrace?150:b+1.3]},triangles:Math.round(u),jets:Se,uniforms:o,stoneColor:f[6],materials:{stone:h,metal:A,marble:k},anchors:{flyThrough:De.map(z=>z.slice()),galleryLine:{from:[-33,7.3,92],to:[20,7.3,92]},burst:[25,6.5,84],portalSeat:{position:[0,9,M-22],facing:[0,0,1],width:14,height:14},viewpoints:{above:{position:[-22,22,132],look:[0,6,-80]},galleryIn:{position:[-33,7.3,92],look:[30,6.5,92.5]},galleryBack:{position:[26,7.3,92],look:[-30,6.5,92]},niches:{position:[0,7.3,92],look:[5,7,100]},sheet:{position:[6,7.3,92.5],look:[-8,6,84]},tank:{position:[30,5,66],look:[2,9,-80]},approach:{position:[4,9,-34],look:[0,10,-104]},inside:{position:[1,9,-66],look:[0,9.5,-104]}},nicheWall:{center:[0,7.4,b],size:[60,13]},sheet:{center:[0,8,P],size:[60,16]},pavilion:{center:[0,G,M],half:Y,floorY:G,roofY:B+5.5},tubs:[[-26,G,M+26],[26,G,M+26],[-26,G,M-26],[26,G,M-26],[-9.5,G,M+26],[9.5,G,M+26],[-9.5,G,M-26],[9.5,G,M-26]],carpet:[0,G+.03,M],waterY:0,basinY:D,sunDir:S.toArray()},setProgress(z,L=0){_e=oe(z,0,1),We=L},setLight(z={}){z.sunDir&&o.uHcSun.value.copy(z.sunDir).normalize();const L=(W,_)=>{_!==void 0&&W.value.set(_)};z.sunColor!==void 0&&o.uHcSunCol.value.copy(new w.Color(z.sunColor)).multiplyScalar(z.sunIntensity??1.6),L(o.uHcSkyTop,z.skyTop),L(o.uHcSkyHor,z.skyHorizon),L(o.uHcBand,z.band),L(o.uHcTree,z.tree),L(o.uHcWater,z.water),L(o.uHcCaus,z.caustic),z.snow!==void 0&&(o.uHcSnow.value=z.snow),z.lamp!==void 0&&(o.uHcLamp.value=z.lamp),z.leaves!==void 0&&(me.material.uniforms.uLeafAmt.value=z.leaves),z.leafMore!==void 0&&(me.material.uniforms.uLeafMore.value=z.leafMore),z.gard&&o.uHcGard.value.fromArray(z.gard),z.mist!==void 0&&(o.uHcMist.value=z.mist),L(o.uHcPortal,z.portal)},update(z,L,W){if(o.uHcTime.value=L,!W)return;p.updateMatrixWorld(),V.setFromMatrixPosition(W.matrixWorld),p.worldToLocal(V),o.uHcCam.value.copy(V),W.getWorldDirection(se);const _=V.z-P;let E=0;l.hole!==!1&&Math.abs(V.x)<36&&V.y<15.5&&_<7.5&&_>-18&&(E=9.5*(_>0?1-Fe(1,7.5,_):1-Fe(5,18,-_)));const R=oe(_/Math.max(-se.z,.35),-14,14);o.uHcHole.value.set(V.x+se.x*R,V.y+se.y*R,E,0);const U=.95*(V.z>P-1.5&&V.y<16&&Math.abs(V.x)<62?1:0)*Fe(.42,.85,Math.abs(se.x))*(se.x<0?1:-1);o.uHcBend.value.set(Math.cos(U),Math.sin(U));const X=_e;o.uHcBurst.value=X,xe&&(xe.visible=X>.001&&X<.999),$e.setFromMatrixPosition(W.matrixWorld),ye.copy(o.uHcSun.value).transformDirection(p.matrixWorld).multiplyScalar(1e3).add($e);const Q=se.dot(o.uHcSun.value)>.05;ye.project(W),o.uHcVeil.value.set(We,Q?oe(ye.x,-2,2):0,Q?oe(ye.y,-2,2):0,Q?1:0)},dispose(){fe.dispose()}}}export{ce as HC_PARS,te as archPanel,Ee as archPts,zt as buildHero,ne as makeB,de as patch};
