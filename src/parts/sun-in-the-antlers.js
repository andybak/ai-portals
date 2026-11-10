import*as a from"three";import{clamp as Pe,lerp as ie,smoothstep as Ye}from"../kit/core.js";const Je=["#EAF2FB","#F7C9A3","#0B1033","#DCE8FF","#FFD277","#1F3B3A","#F29B4B"],we=Math.PI*2;class Ie{constructor(){this.pos=[],this.idx=[],this.seg=[],this.aux=[]}get count(){return this.pos.length/3}vert(c,t,s,v,i=0){return this.pos.push(c,t,s),this.seg.push(v),this.aux.push(i),this.count-1}quad(c,t,s,v){this.idx.push(c,t,s,c,s,v)}geometry(){const c=new a.BufferGeometry;return c.setAttribute("position",new a.Float32BufferAttribute(this.pos,3)),c.setAttribute("seg",new a.Float32BufferAttribute(this.seg,1)),c.setAttribute("aux",new a.Float32BufferAttribute(this.aux,1)),c.setIndex(this.idx),c.computeVertexNormals(),c}}function Be(e,c){const t=[],s=e.length;for(let v=0;v<s-1;v++){const i=e[Math.max(0,v-1)],f=e[v],h=e[v+1],g=e[Math.min(s-1,v+2)];for(let o=0;o<c;o++){const y=o/c,n=y*y,x=n*y;t.push(f.map((p,d)=>.5*(2*f[d]+(-i[d]+h[d])*y+(2*i[d]-5*f[d]+4*h[d]-g[d])*n+(-i[d]+3*f[d]-3*h[d]+g[d])*x)))}}return t.push(e[s-1].slice()),t}function Qe(e,c,t={}){const s=t.M||12,v=t.seg||0,i=t.sub||3,f=t.cap??.8,h=t.minY??-1e9,g=new a.Vector3().fromArray(t.side||[0,0,1]).normalize();let o=Be(c,i);const y=(l,w,k)=>{const m=new a.Vector3(l[0]-w[0],l[1]-w[1],l[2]-w[2]);m.lengthSq()<1e-8&&m.set(1,0,0),m.normalize();const M=(l[3]+l[4])*.5*f,u=[];for(const A of[.45,.78,.95,1]){const z=Math.sqrt(Math.max(0,1-A*A))+(A===1?.002:0);u.push([l[0]+m.x*M*A,l[1]+m.y*M*A,l[2]+m.z*M*A,l[3]*z,l[4]*z,l[5]*z])}return k<0?u.reverse():u};o=[...y(o[0],o[1],-1),...o,...y(o[o.length-1],o[o.length-2],1)];const n=new a.Vector3,x=new a.Vector3,p=new a.Vector3,d=e.count,r=o.length;for(let l=0;l<r;l++){const w=o[l],k=o[Math.max(0,l-1)],m=o[Math.min(r-1,l+1)];n.set(m[0]-k[0],m[1]-k[1],m[2]-k[2]),n.lengthSq()<1e-8&&n.set(1,0,0),n.normalize(),x.crossVectors(g,n),x.lengthSq()<1e-6&&x.set(0,1,0),x.normalize(),p.crossVectors(n,x).normalize();for(let M=0;M<s;M++){const u=M/s*we,A=Math.sin(u),z=Math.cos(u),F=A*(A>0?w[3]:w[4]),P=z*w[5];e.vert(w[0]+x.x*F+p.x*P,Math.max(h,w[1]+x.y*F+p.y*P),w[2]+x.z*F+p.z*P,v,l/(r-1))}}for(let l=0;l<r-1;l++)for(let w=0;w<s;w++){const k=d+l*s+w,m=d+l*s+(w+1)%s;e.quad(k,m,m+s,k+s)}}function Ge(e,c){const t=e.pos,s=e.idx;let v=0,i=0,f=0,h=0,g=0;for(let o=c;o<s.length;o+=3)i+=t[s[o]*3],f+=t[s[o]*3+1],h+=t[s[o]*3+2],g++;i/=Math.max(g,1),f/=Math.max(g,1),h/=Math.max(g,1);for(let o=c;o<s.length;o+=3){const y=s[o]*3,n=s[o+1]*3,x=s[o+2]*3,p=t[y]-i,d=t[y+1]-f,r=t[y+2]-h,l=t[n]-i,w=t[n+1]-f,k=t[n+2]-h,m=t[x]-i,M=t[x+1]-f,u=t[x+2]-h;v+=p*(w*u-k*M)-d*(l*u-k*m)+r*(l*M-w*m)}if(v<0)for(let o=c;o<s.length;o+=3){const y=s[o+1];s[o+1]=s[o+2],s[o+2]=y}}const J=(e,c,t)=>{const s=e.idx.length;Qe(e,c,t),Ge(e,s)},G=(e,c,t,s,v=0)=>[e,(c+t)/2,v,(c-t)/2,(c-t)/2,s],Ve=20,be=[{hind:!0,z:-110,ph:0},{hind:!1,z:-110,ph:.25},{hind:!0,z:110,ph:.5},{hind:!1,z:110,ph:.75}],Ce={P:[8,640],K:[26,296],F:[2,72]},pe={P:[-715,640],K:[-806,316],F:[-764,72]};function Ze(e,c){const t=new Ie,s=o=>1+(e()-.5)*o,v=940*c.hump,i=820,f=520;J(t,[G(-868,762,610,84),G(-820,i,556,134),G(-700,i+12,505,168),G(-520,812,548,158),G(-300,828,528,170),G(-120,872,f-2,172),G(0,912,f,160),G(80,892,545,128),G(128,846,610,84)],{M:36,sub:4,seg:0,cap:.5}),J(t,[G(-310,838,720,60),G(-170,892,700,92),G(-20,v+4,700,104),G(70,v-14,700,94),G(150,868,720,62)],{M:20,sub:4,seg:1,cap:.6}),J(t,[[50,742,0,150,176,112],[150,800,0,122,150,98],[255,862,0,98,122,84],[352,918,0,80,92,72]],{M:22,sub:4,seg:2,cap:.5});const h=c.muzzle;J(t,[G(316,1004,884,70),G(392,1010,876,74),G(470,990,880,58),G(545,978,878,54),G(600,980,858-6*h,60),G(628,966,846-10*h,52),G(642,940,852-8*h,36)],{M:22,sub:4,seg:3,cap:.55});for(const o of[-1,1])J(t,[[604,930,o*44,18,18,12],[628,918,o*36,20,22,14],[640,900,o*24,14,16,10]],{M:8,sub:2,seg:3}),J(t,[[372,990,o*62,14,12,14],[410,988,o*66,18,14,16],[446,972,o*54,12,10,12]],{M:8,sub:2,seg:3});J(t,[G(372,900,846,58),G(450,890,850,44),G(530,884,852,36),G(578,880,856,28)],{M:14,sub:3,seg:4,cap:.6});const g=c.dewlap;J(t,[[452,868,0,30,34,20],[455,826,0,24,26,15],[458,788-14*g,0,28,28,17],[460,752-34*g,0,20,20,13],[461,734-44*g,0,8,8,6]],{M:14,sub:4,seg:4,cap:.9});for(const o of[-1,1]){const y=[338,992,o*58],n=new a.Vector3(-.42,.62,o*.66).normalize(),x=[];for(const[p,d,r]of[[0,9,14],[.2,10,27],[.45,9,33],[.72,7,24],[.92,5,11],[1,3,4]])x.push([y[0]+n.x*p*112,y[1]+n.y*p*112,y[2]+n.z*p*112,d,d,r]);J(t,x,{M:10,sub:3,seg:o<0?5:6,side:[.75,.6,.1],cap:.6})}return J(t,[[-868,770,0,20,22,20],[-890,736,0,17,19,16],[-896,700,0,10,11,9]],{M:10,sub:3,seg:7,cap:.8}),be.forEach((o,y)=>{const n=o.z,x=8+y*3,p=n*.82;o.hind?(J(t,[[-735,720,p,120,118,66],[-712,630,n*.9,112,104,64],[-705,552,n,86,78,54],[-742,468,n,54,56,44],[-778,392,n,40,44,36],[-800,336,n,30,36,30]],{M:14,sub:3,seg:x,cap:.7}),J(t,[[-812,352,n,22,46,24],[-808,318,n,32,54,30],[-798,276,n,26,28,25],[-780,170,n,21,23,21],[-769,104,n,22,26,22],[-765,76,n,29,40,29]],{M:16,sub:3,seg:x+1,cap:.7})):(J(t,[[16,700,p,96,104,64],[10,610,n*.9,78,96,60],[2,540,n,56,84,50],[8,486,n,46,50,42],[18,400,n,37,38,34],[25,322,n,30,30,28]],{M:14,sub:3,seg:x,cap:.7}),J(t,[[26,310,n,36,30,33],[27,286,n,40,33,36],[22,250,n,25,25,24],[12,160,n,21,23,21],[5,104,n,22,26,22],[2,76,n,29,40,29]],{M:16,sub:3,seg:x+1,cap:.7}));const d=o.hind?pe.F[0]:Ce.F[0];J(t,[[d,74,n,24,26,24],[d+8,50,n,24,24,26],[d+16,30,n,22,22,28]],{M:10,sub:2,seg:x+2,cap:.6});for(const r of[-1,1])J(t,[[d+10,34,n+r*15,20,20,15],[d+30,22,n+r*17,22,26,17],[d+52,14,n+r*16,18,20,14],[d+70,8,n+r*12,9,10,7]],{M:10,sub:3,seg:x+2,cap:.7,minY:0}),J(t,[[d-22,62,n+r*13,9,9,8],[d-32,46,n+r*14,8,8,7],[d-36,34,n+r*14,4,4,4]],{M:6,sub:2,seg:x+2})}),t.geometry()}const Me=`
uniform vec3 fogColor; uniform float fogDensity; uniform float fogNear; uniform float fogFar; uniform float uFogK;
vec3 applyFog(vec3 c, float depth) {
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float f = 1. - exp(-fogDensity * fogDensity * depth * depth);
    #else
      float f = smoothstep(fogNear, fogFar, depth);
    #endif
    return mix(c, fogColor, clamp(f * uFogK, 0., 1.));
  #else
    return c;
  #endif
}`,Se=`
float h11(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec4 h24(vec2 p) { vec4 q = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099)); q += dot(q, q.wzxy + 33.33); return fract((q.xxyz + q.yzzw) * q.zywx); }
float vn3(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float n = i.x + i.y * 57. + i.z * 113.;
  return mix(mix(mix(h11(n), h11(n + 1.), f.x), mix(h11(n + 57.), h11(n + 58.), f.x), f.y),
             mix(mix(h11(n + 113.), h11(n + 114.), f.x), mix(h11(n + 170.), h11(n + 171.), f.x), f.y), f.z);
}
// dry-brush: streaky noise, stretched along one axis
float brush(vec3 p) { return vn3(p * vec3(1., 5., 1.)) * .6 + vn3(p * vec3(2.3, 13., 2.3) + 7.) * .4; }`,et=`
uniform float uTime; uniform vec3 uNightA; uniform vec3 uNightB; uniform vec3 uIce; uniform vec3 uGold; uniform vec3 uPeach;
uniform vec3 uMwN; uniform vec3 uBodyDir; uniform float uMode; uniform float uSeed;
vec3 cubeUV(vec3 d) {                       // xy = face uv (-1..1), z = face id
  vec3 a = abs(d);
  if (a.x >= a.y && a.x >= a.z) return vec3(d.yz / max(a.x, 1e-4), d.x > 0. ? 0. : 1.);
  if (a.y >= a.z) return vec3(d.xz / max(a.y, 1e-4), d.y > 0. ? 2. : 3.);
  return vec3(d.xy / max(a.z, 1e-4), d.z > 0. ? 4. : 5.);
}
// round spatter dots: returns brightness, tint selector in .y
vec2 dots(vec3 cu, float N, float rad, float keep, float salt) {
  vec2 g = cu.xy * N, id = floor(g), f = fract(g) - .5;
  vec4 h = h24(id + vec2(cu.z * 37. + salt, salt * 1.7 + uSeed));
  float r = rad * (.55 + .9 * h.z);
  float m = 1. - smoothstep(r * .7, r, length(f - (h.xy - .5) * .62));
  float tw = .72 + .28 * sin(uTime * (1.2 + 2.6 * h.w) + h.z * 40.);
  return vec2(m * step(h.w, keep) * tw, h.x);
}
float spark(vec3 cu, float N, float salt) {  // four-point sparks
  vec2 g = cu.xy * N, id = floor(g), f = fract(g) - .5;
  vec4 h = h24(id + vec2(cu.z * 19. + salt, salt + uSeed));
  vec2 q = abs(f - (h.xy - .5) * .5);
  float len = .12 + .1 * h.z, w = .012;
  float s = max((1. - smoothstep(0., w, q.y)) * (1. - smoothstep(0., len, q.x)), (1. - smoothstep(0., w, q.x)) * (1. - smoothstep(0., len, q.y)));
  s = max(s, 1. - smoothstep(.012, .03, length(q)));
  return s * step(h.w, .22) * (.75 + .25 * sin(uTime * 1.7 + h.z * 30.));
}
vec3 nightSky(vec3 d) {
  vec3 cu = cubeUV(d);
  // two flat indigo tones laid in broad dry-brushed patches
  float ptch = vn3(d * 3.1 + uSeed) + .35 * (brush(d * 9.) - .5);
  vec3 col = mix(uNightA, uNightB, step(.56, ptch) * .55);
  // milky way: a slanting band in two pale flat tones with torn edges
  float b = abs(dot(d, uMwN) + .10 * (vn3(d * 4.3 + 3.) - .5));
  float mw = 1. - smoothstep(0., .2, b);
  float tear = brush(d * 14. + 2.) - .5;
  float tone = step(.38, mw + tear * .35) + step(.74, mw + tear * .3);
  col = mix(col, mix(uNightB * 2.6, uIce * .34, .45), tone * .36);
  float rift = step(.66, vn3(d * 11. + 5.) + (brush(d * 23. + 1.) - .5) * .5) * step(.8, mw);            // dark lane
  col = mix(col, uNightA, rift * .6);
  // spatter stars in five sizes (denser inside the band) + sparks
  float dens = .30 + .35 * mw;
  vec2 s1 = dots(cu, 16., .085, dens * .55, 1.), s2 = dots(cu, 30., .10, dens * .8, 2.), s3 = dots(cu, 52., .12, dens, 3.),
       s4 = dots(cu, 84., .15, dens * 1.1, 4.), s5 = dots(cu, 130., .19, dens * 1.2, 5.);
  vec3 tA = mix(uIce, uGold, step(.72, s1.y)), tB = mix(uIce, uPeach, step(.8, s2.y));
  col = mix(col, tA * 1.45, s1.x); col = mix(col, tB * 1.25, s2.x);
  col = mix(col, uIce * 1.05, s3.x); col = mix(col, uIce * .8, s4.x * .9); col = mix(col, uIce * .6, s5.x * .8);
  col = mix(col, mix(uIce, uGold, .35) * 1.7, spark(cu, 5., 9.));
  // around the body centre: meteor strokes (every 6-10 s) and the seed's special (comet / moon / aurora)
  vec3 c = uBodyDir, t1 = normalize(cross(c, vec3(.13, 1., .07)) + vec3(1e-4, 0., 0.)), t2 = cross(t1, c);
  vec2 p = vec2(dot(d, t1), dot(d, t2)); float front = step(0., dot(d, c));
  float tt = uTime / 8., k = floor(tt), f = fract(tt) * (1.6 - .5 * h11(k + 3.));
  vec2 a0 = (vec2(h11(k), h11(k + 9.)) - .5) * vec2(.5, .24) + vec2(0., .06), dir = normalize(vec2(-.8 - .4 * h11(k + 5.), -.45));
  vec2 q = p - a0 - dir * f * .55; float al = dot(q, -dir), ac = dot(q, vec2(-dir.y, dir.x));
  float tail = .11 * smoothstep(0., .08, f);
  float stroke = step(0., al) * step(al, tail) * (1. - smoothstep(0., max(.0035 * (1. - al / max(tail, 1e-4)), 0.) + .0004, abs(ac)));
  col = mix(col, mix(uIce, uGold, .3) * 1.6, stroke * front * (1. - smoothstep(.3, .42, f)));
  if (uMode > .5 && uMode < 1.5) {           // comet: head + curved tapering tail
    vec2 cq = p - vec2(.12, .05); float ca = -cq.x * .9 + cq.y * .44, cc = cq.x * .44 + cq.y * .9 - ca * ca * .9;
    float tl = step(0., ca) * (1. - smoothstep(.0, .46, ca)) * (1. - smoothstep(0., .006 + max(ca, 0.) * .11, abs(cc)));
    col = mix(col, uIce * .95, tl * front * (.62 + .3 * step(.5, brush(vec3(cq * 40., 1.)))));
    col = mix(col, uGold * 1.7, (1. - smoothstep(.018, .024, length(cq))) * front);
  } else if (uMode > 1.5 && uMode < 2.5) {   // crescent moon riding in the chest
    vec2 mq = p - vec2(.02, .03); float moon = (1. - smoothstep(.058, .062, length(mq))) * smoothstep(.05, .054, length(mq - vec2(.03, .012)));
    col = mix(col, mix(uIce, uGold, .25) * 1.5, moon * front);
  } else if (uMode > 2.5) {                  // slow aurora curtains, flat bands
    float warp = vn3(vec3(p * 2.2, uTime * .03)) - .5;
    float y0 = .02 + .22 * warp + .05 * sin(p.x * 9. + uTime * .1);              // wavy hem of the curtain
    float hgt = .1 + .16 * vn3(vec3(p.x * 3., 4., uTime * .02));
    float stri = brush(vec3(p.x * 34. + warp * 6., p.y * .8, 2.));               // vertical dry-brush streaks
    float body = step(y0, p.y) * (1. - smoothstep(y0, y0 + hgt, p.y));
    float au = step(.42, body * (.55 + .7 * stri)) + step(.8, body * (.6 + .6 * stri));
    col = mix(col, vec3(.21, .74, .53) * .62, au * front * .26);
  }
  return col;
}`,tt=`
attribute float seg;
uniform mat4 uSeg[${Ve}]; uniform float uRim; uniform float uPxK; uniform vec3 uSunW; uniform float uGroundW; uniform float uPass;
varying vec3 vW; varying vec3 vN; varying vec3 vO; varying float vDepth;
void main() {
  mat4 sm = uSeg[int(seg + .5)];
  vec4 lp = sm * vec4(position, 1.);
  vec3 n = normalize(mat3(modelMatrix) * (mat3(sm) * normal) + vec3(0., 1e-5, 0.));
  vec4 w = modelMatrix * lp;
  if (uPass > .5 && uPass < 1.5) {            // rim: back faces pushed out, never thinner than ~3 px
    float dist = length(w.xyz - cameraPosition);
    w.xyz += n * max(uRim, dist * uPxK);
  } else if (uPass > 1.5) {                   // planar night shadow thrown from the antler sun
    w.xyz -= uSunW * ((w.y - uGroundW) / max(uSunW.y, .05));
  }
  vW = w.xyz; vN = n; vO = position;
  vec4 mv = viewMatrix * w; vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,ot=`
${Me}
${Se}
${et}
uniform float uPass; uniform vec3 uSunW; uniform vec3 uApricot; uniform vec3 uShadowSnow; uniform vec2 uScroll; uniform float uMask;
varying vec3 vW; varying vec3 vN; varying vec3 vO; varying float vDepth;
void main() {
  if (uMask > .5) { gl_FragColor = vec4(1., 0., 0., 1.); return; }   // world's shadow-mask pass
  vec3 col;
  float grain = .96 + .08 * h21(floor(gl_FragCoord.xy * .5));
  if (uPass < .5) {                           // the window: night by view direction + screen-space tooth
    vec3 d = vW - cameraPosition;
    col = nightSky(d / max(length(d), 1e-4)) * grain;
    gl_FragColor = vec4(applyFog(col, vDepth * .6), 1.); return;
  } else if (uPass < 1.5) {                   // gold outline, three flat tones, dry-brushed joins
    float s = dot(vN, uSunW) * .5 + .5 + (brush(vO * .012) - .5) * .32;
    col = mix(uApricot * .62, uGold * .95, step(.42, s));
    col = mix(col, uGold * 1.75, step(.66, s)) * grain;
  } else {                                    // night laid on the snow: starlight blue with glints
    vec2 g = vW.xz + uScroll; float fw = max(fwidth(g.x), fwidth(g.y));
    float ptch = step(.55, vn3(vec3(g * .004, 1.)) + .3 * (brush(vec3(g.x * .01, g.y * .01, 3.)) - .5));
    col = mix(uShadowSnow, uShadowSnow * 1.28, ptch);
    vec2 c = g / 46., id = floor(c), f = fract(c) - .5; vec4 h = h24(id + 3.);
    float r = max(.045, fw / 46. * 1.3);
    float glint = (1. - smoothstep(r * .6, r, length(f - (h.xy - .5) * .7))) * step(h.w, .5) * (.6 + .4 * sin(uTime * (1. + 2. * h.z) + h.x * 30.));
    col = mix(col, uIce * 1.25, glint) * (.97 + .06 * h21(floor(g * .25)));
  }
  gl_FragColor = vec4(applyFog(col, vDepth), 1.);
}`,oe=new a.Matrix4,yt=new a.Matrix4,wt=new a.Quaternion,bt=new a.Vector3,le={x:new a.Vector3(1,0,0),y:new a.Vector3(0,1,0),z:new a.Vector3(0,0,1)};function ce(e,c,t,s,v,i){return oe.makeTranslation(c,t,s),e.multiply(oe),oe.makeRotationAxis(v,i),e.multiply(oe),oe.makeTranslation(-c,-t,-s),e.multiply(oe),e}const De=e=>{const c=e-Math.floor(e);return c<.12?Math.sin(c/.12*Math.PI):0};function at(e,c,t,s,v){const i=t*we,f=-4*Math.cos(2*i),h=10*Math.sin(i),g=.012*Math.sin(i),o=e[0].identity();oe.makeTranslation(0,f,h),o.multiply(oe),ce(o,-380,700,0,le.x,g),ce(o,-380,700,0,le.z,.006*Math.sin(2*i+.6)),e[1].copy(o),oe.makeTranslation(0,3*Math.sin(2*i+1.2),-h*.3),e[1].multiply(oe);const y=.034*Math.sin(2*i+.9);ce(e[2].copy(o),60,760,0,le.z,y),ce(e[3].copy(e[2]),340,930,0,le.z,-y*.55+.012*Math.sin(i*.5)),ce(e[3],340,930,0,le.y,.03*Math.sin(i*.5+1)),ce(e[4].copy(e[3]),452,874,0,le.x,.2*Math.sin(2*i+2.2)),ce(e[4],452,874,0,le.z,.09*Math.sin(2*i+.4));const n=De(s*.23+.3)+.25*Math.sin(s*.7),x=Math.max(De(s*.19+.7),v);ce(e[5].copy(e[3]),338,992,-58,le.x,.5*n+.04*Math.sin(s*1.3)),ce(e[6].copy(e[3]),338,992,58,le.x,-.5*x-.04*Math.sin(s*1.1)),ce(e[7].copy(o),-866,786,0,le.x,.5*De(s*.37)*Math.sin(s*9)+.12*Math.sin(s*1.9)),ce(e[7],-866,786,0,le.z,-.12+.1*Math.sin(2*i));for(let p=0;p<4;p++){const d=be[p],r=d.hind?pe:Ce,l=d.hind?-1:1,w=d.hind?34:0,k=t-d.ph-Math.floor(t-d.ph);let m,M=0,u=0;if(k<.65)m=ie(117,-117,k/.65)+w,u=-.22*Ye(.5,.65,k);else{const L=(k-.65)/.35,H=L*L*(3-2*L);m=ie(-117,117,H)+w,M=70*Math.max(0,Math.sin(Math.PI*L))**1.3,u=-.22*(1-L)-.75*Math.sin(Math.PI*Math.min(1,L*1.5))*(1-L)}const A=Math.hypot(r.K[0]-r.P[0],r.K[1]-r.P[1]),z=Math.hypot(r.F[0]-r.K[0],r.F[1]-r.K[1]),F=r.P[0]+m*.42,P=r.P[1]+f*(d.hind?.5:1),N=r.F[0]+m,$=r.F[1]+M,I=N-F,q=$-P,C=Pe(Math.hypot(I,q),Math.abs(A-z)+1,(A+z)*.9995),B=Math.atan2(q,I),D=Math.acos(Pe((A*A+C*C-z*z)/(2*A*C),-1,1)),V=B+l*D,Q=F+A*Math.cos(V),se=P+A*Math.sin(V),O=Math.atan2($-se,N-Q),Y=Q+z*Math.cos(O),U=se+z*Math.sin(O),K=Math.atan2(r.K[1]-r.P[1],r.K[0]-r.P[0]),j=Math.atan2(r.F[1]-r.K[1],r.F[0]-r.K[0]),S=8+p*3,R=(L,H,Z,de,ue,xe)=>{L.makeTranslation(H,Z,0),oe.makeRotationZ(de),L.multiply(oe),oe.makeTranslation(-ue,-xe,0),L.multiply(oe)};R(e[S],F,P,V-K,r.P[0],r.P[1]),R(e[S+1],Q,se,O-j,r.K[0],r.K[1]),R(e[S+2],Y,U,u,r.F[0],r.F[1]);const E=c[p];E.x=Y+20,E.y=Math.max(0,U-r.F[1]),E.z=d.z,E.c=k,E.down=k<.65?1:0}}function Oe(e,c,t,s,v,i=!1){const f=c.length,h=new a.Vector3,g=new a.Vector3(0,1,0),o=new a.Vector3,y=new a.Vector3,n=e.count,x=e.idx.length;for(let r=0;r<f;r++){h.subVectors(c[Math.min(f-1,r+1)],c[Math.max(0,r-1)]),h.lengthSq()<1e-8&&h.set(0,1,0),h.normalize(),r===0&&g.set(.31,.2,.93),g.addScaledVector(h,-g.dot(h)),g.lengthSq()<1e-6&&g.set(h.y,h.z,h.x).addScaledVector(h,-(h.y*h.x+h.z*h.y+h.x*h.z)),g.normalize(),o.crossVectors(h,g);const l=t(r/(f-1));for(let w=0;w<s;w++){const k=w/s*we,m=Math.cos(k),M=Math.sin(k),u=l*(i?1:1+.07*Math.cos(k*v));y.copy(c[r]).addScaledVector(g,m*u).addScaledVector(o,M*u),e.vert(y.x,y.y,y.z,3,i?-1:w/s*v+.5)}}for(let r=0;r<f-1;r++)for(let l=0;l<s;l++){const w=n+r*s+l,k=n+r*s+(l+1)%s;e.quad(w,k,k+s,w+s)}const p=e.vert(c[0].x,c[0].y,c[0].z,3,i?-1:.5),d=e.vert(c[f-1].x,c[f-1].y,c[f-1].z,3,i?-1:.5);for(let r=0;r<s;r++)e.idx.push(p,n+(r+1)%s,n+r),e.idx.push(d,n+(f-1)*s+r,n+(f-1)*s+(r+1)%s);Ge(e,x)}function Ne(e,c,t,s){const v=e.pos,i=e.idx;let f=0;for(let h=c;h<i.length;h+=3){const g=i[h]*3,o=i[h+1]*3,y=i[h+2]*3,n=v[o]-v[g],x=v[o+1]-v[g+1],p=v[o+2]-v[g+2],d=v[y]-v[g],r=v[y+1]-v[g+1],l=v[y+2]-v[g+2];f+=(x*l-p*r)*t.x+(p*d-n*l)*t.y+(n*r-x*d)*t.z}if(f*s<0)for(let h=c;h<i.length;h+=3){const g=i[h+1];i[h+1]=i[h+2],i[h+2]=g}}function Ke(e,c,t,s){const v=(m,M,u)=>new a.Vector3(m,M,u*s),i=new a.Vector3(0,1,0),f={tines:[]},h=v(398,996,44),g=v(425,1052,176);Oe(e,[v(390,978,30),h,v(408,1026,100),v(418,1044,140),g,v(430,1060,200)],m=>24-5*m,12,9);for(let m=0;m<9;m++){const M=m/9*we,u=v(398+Math.cos(M)*26,1e3+Math.sin(M)*9,46+Math.sin(M)*24*s*s);J(e,[[u.x-6,u.y,u.z,8,8,8],[u.x+6,u.y,u.z,8,8,8]],{M:6,sub:1,seg:3,cap:1})}const o=(m,M,u,A,z,F,P)=>{const N=[m.clone()],$=M.clone().normalize(),I=m.clone(),q=11;for(let V=1;V<=q;V++){const Q=V/q;$.lerp(u,.13*F*(.6+Q)).normalize(),I.addScaledVector($,A/q),N.push(I.clone())}N.unshift(m.clone().addScaledVector(M,-z*1.6));const C=Be(N.map(V=>[V.x,V.y,V.z]),2).map(V=>new a.Vector3(V[0],V[1],V[2]));Oe(e,C,V=>ie(z,3.4,Math.pow(V,.8))*(1+.5*Math.max(0,1-V*7)),14,7);const B=N.slice(1,7).map((V,Q)=>V.clone().addScaledVector(i,ie(z,4,Q/9)*.75));Oe(e,B,V=>Math.max(.6,ie(z,5,V)*.86*Math.max(0,Math.sin(Math.PI*(.12+.88*V)))**.6),9,1,!0);const D={pts:N,len:A,tag:P};return f.tines.push(D),D},y=(m,M,u,A,z,F,P,N,$=0)=>{const I=new a.Vector3().crossVectors(i,M).normalize().multiplyScalar(s);I.addScaledVector(i,-$),I.addScaledVector(M,-I.dot(M)).normalize();const q=new a.Vector3().crossVectors(M,I).multiplyScalar(s).normalize(),C=(Y,U,K=0)=>new a.Vector3().copy(m).addScaledVector(M,u*Y).addScaledVector(I,A*z(Y)*U).addScaledVector(q,F*(U*U*1+Y*Y*.8)+K),B=26,D=12,V=e.idx.length,Q=Y=>{const U=e.count;for(let K=0;K<=B;K++)for(let j=0;j<=D;j++){const S=K/B,R=j/D*2-1,E=Math.max(Math.abs(R),S>.5?(S-.5)*2:(.5-S)*2),L=Math.sqrt(Math.max(0,1-E**4)),H=1+.035*Math.sin(S*34)*Math.abs(R),Z=C(S,R*H,Y>0?P*.35*L:-P*1.25*L);e.vert(Z.x,Z.y,Z.z,3,(R*.5+.5)*9*z(S)+(Y>0?0:.25))}for(let K=0;K<B;K++)for(let j=0;j<D;j++){const S=U+K*(D+1)+j;e.quad(S,S+1,S+D+2,S+D+1)}return U},se=e.idx.length;Q(1),Ne(e,se,q,1);const O=e.idx.length;if(Q(-1),Ne(e,O,q,-1),N){const Y=e.count,U=44,K=20,j=e.idx.length;for(let S=0;S<=U;S++)for(let R=0;R<=K;R++){const E=ie(.1,.95,S/U),L=R/K*2-1,H=.74+.07*Math.sin(E*23+L*2),Z=Math.max(Math.abs(L),Math.abs(S/U*2-1)),de=Math.sqrt(Math.max(0,1-Z*Z*Z)),ue=C(E,L*H,P*.3+de*(7+3*Math.sin(E*9+L*3)+1.3*Math.sin(E*61+L*4)*Math.sin(L*13+E*7)));e.vert(ue.x,ue.y,ue.z,3,-1)}for(let S=0;S<U;S++)for(let R=0;R<K;R++){const E=Y+S*(K+1)+R;e.quad(E,E+1,E+K+2,E+K+1)}Ne(e,j,q,1)}return{P:C,a:M,c:I,n:q}},n=new a.Vector3(-.2+t.sweep,.34,.95*s).normalize(),x=m=>.2+.8*Math.sin(Math.PI*.86*Math.pow(m,.75))**.8,p=y(v(425,1055,180),n,460,125,x,30,13,!0,.3);f.palm=p.P,f.palmN=p.n;const d=p.c.clone().multiplyScalar(-1),r=i.clone().addScaledVector(d,.25).addScaledVector(n,-.12).normalize();[[.3,-1,0],[.47,-1,0],[.64,-1,0],[.81,-1,0],[.98,-.72,1],[1,0,1],[.98,.72,1],[.84,1,2],[.6,1,2]].slice(0,t.tines).forEach(([m,M,u],A)=>{const z=p.P(m,M*.9),F=u===0?d.clone().addScaledVector(n,.25):u===1?n.clone().addScaledVector(p.c,M*.8):p.c.clone().addScaledVector(n,.45),P=u===0?c.range(130,172):u===1?c.range(100,150):c.range(120,168),N=u===0?r:u===1?i.clone().addScaledVector(n,-.2).normalize():i.clone().addScaledVector(p.c,.15).normalize();o(z,F.addScaledVector(i,.25),N,P,12,t.tineCurl,["rear","end","front"][u])});const w=new a.Vector3(.84,.1,.53*s).normalize(),k=y(v(428,1050,178),w,200,46,m=>.45+.55*Math.sin(Math.PI*Math.pow(m,.7)*.8),10,10,!1);return[[-.8,-.5,150],[0,0,185],[.8,.5,165]].forEach(([m,M,u],A)=>{const z=w.clone().addScaledVector(k.c,M).addScaledVector(i,.12),F=o(k.P(.96,m*.8),z,i.clone().addScaledVector(w,.3).normalize(),u*c.range(.92,1.08),11,t.tineCurl*.8,"brow");A===0&&(f.browOuter=F)}),f.frontTine=f.tines.find(m=>m.tag==="front"),f}const nt=`
attribute float seg; attribute float aux;
uniform mat4 uSeg[${Ve}]; uniform float uOut; uniform float uPxK;
varying vec3 vN; varying vec3 vO; varying vec3 vW; varying float vAux; varying float vDepth;
void main() {
  mat4 sm = uSeg[int(seg + .5)];
  vec4 w = modelMatrix * (sm * vec4(position, 1.));
  vN = normalize(mat3(modelMatrix) * (mat3(sm) * normal) + vec3(0., 1e-5, 0.));
  // outline pass: back faces pushed out, about two pixels wide at any distance
  if (uOut > .5) w.xyz += vN * clamp(length(w.xyz - cameraPosition) * uPxK * .8, .4, 10.);
  vO = position; vAux = aux; vW = w.xyz;
  vec4 mv = viewMatrix * w; vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,rt=`
${Me}
${Se}
uniform vec3 uSunP; uniform float uOut; uniform float uTime;
uniform vec3 uBoneLit; uniform vec3 uBoneMid; uniform vec3 uBoneShade; uniform vec3 uSnowLit; uniform vec3 uSnowShade; uniform vec3 uGold;
varying vec3 vN; varying vec3 vO; varying vec3 vW; varying float vAux; varying float vDepth;
void main() {
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 L = uSunP - vW; L /= max(length(L), 1e-3);
  float sunF = dot(n, L);
  float br = brush(vO.yxz * .05) - .5 + (brush(vO.yxz * .43) - .5) * .22, br2 = brush(vO.zyx * .021 + 4.) - .5;
  if (uOut > .5) {                                     // outline: a gold edge on the disc's side, deep shade elsewhere
    vec3 oc = mix(uBoneShade * .74, uGold * 1.18, step(.02, sunF + br * .25));
    gl_FragColor = vec4(applyFog(oc, vDepth), 1.); return;
  }
  float l = sunF * .5 + .5 + br * .3;
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-3);
  float rim = 1. - abs(dot(n, V));
  vec3 col;
  if (vAux < -.5) {                                    // snow: ice above, lilac under, drifted by the wind
    float s = sunF * .3 + .6 + max(n.y, 0.) * .14 + br * .16;
    float litK = step(.42, s);
    col = mix(uSnowShade, uSnowLit, litK);
    vec2 p = vec2(vO.x * .8 + vO.z * .6, -vO.x * .6 + vO.z * .8);
    float wv = vn3(vec3(p * .045, 2.));
    float q = p.x / 5.6 + wv * 2.6 + .3 * sin(p.y / 3.3 + wv * 9.) - uTime * .07;   // the crests creep downwind          // scalloped crest every few metres
    float fq = fract(q);
    float field = smoothstep(.34, .5, vn3(vec3(p * .034, 8.)) + .25 * wv);     // crests come in fields, smooth snow between
    float lens = step(fq, .17 + .13 * vn3(vec3(p * .21, 5.))) * field;       // lilac lens in the lee of each crest
    col = mix(col, mix(uSnowShade, uSnowLit, .22), lens * litK);
    col = mix(col, uSnowLit * 1.1, step(.84, fq) * litK * field);
    col = mix(col, mix(uSnowShade, uSnowLit, .5), (1. - field) * step(.62, vn3(vec3(p * .09, 12.))) * litK);   // broad soft hollows
    vec2 gc = p / .85, gid = floor(gc), gf = fract(gc) - .5; vec4 gh = h24(gid + 11.);
    float glint = (1. - smoothstep(.1, .2, length(gf - (gh.xy - .5) * .6))) * step(gh.w, .16)
      * step(.2, sin(uTime * (1.5 + 3. * gh.z) + gh.x * 40.)) * (1. - smoothstep(50., 240., vDepth));
    col = mix(col, mix(uSnowLit, uGold, .25) * 1.5, glint * litK);
  } else {
    float top = n.y + br * .4;
    col = mix(uBoneShade, uBoneMid, max(step(.2, top), step(.47, l)));
    col = mix(col, uBoneLit, step(.7, l + br2 * .15));
    float edge = step(.52, rim + br * .22) * step(.02, sunF);                 // gold edge where the form turns to the disc
    col = mix(col, uGold * 1.05, edge);
    float g = abs(fract(vAux) - .5);                   // ridge grooves, broken like a dry brush
    float groove = (1. - smoothstep(.08, .12, g)) * step(.26, brush(vO.xzy * .03 + 1.)) * (1. - edge);
    col = mix(col, uBoneShade * mix(.66, 1., step(.3, top)), groove * .8);
    float fleck = step(.86, vn3(vO * .9)) * step(.45, n.y);                  // fine frost stipple on the tops
    col = mix(col, uSnowLit, fleck * .5);
  }
  col *= .96 + .08 * h21(floor(vO.xy * 5.) + floor(vO.z * 5.) * 1.7);   // paper tooth fixed to the object
  gl_FragColor = vec4(applyFog(col, vDepth), 1.);
}`,st=`
uniform float uR; varying vec2 vP; varying float vDepth;
void main() {
  vec4 mv = modelViewMatrix * vec4(0., 0., 0., 1.);
  mv.xy += position.xy * uR * 7.;
  vP = position.xy * 7.; vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,it=`
${Me}
${Se}
uniform float uTime; uniform float uPart; uniform vec3 uSunA; uniform vec3 uSunB; uniform vec3 uSunC;
varying vec2 vP; varying float vDepth;
void main() {
  float r = length(vP), a = atan(vP.y, abs(vP.x) < 1e-5 ? 1e-5 : vP.x);
  float aa = max(fwidth(r), 1e-4);
  float a1 = a + uTime * .05, a2 = a - uTime * .035;
  float b1 = brush(vec3(cos(a1) * 3., r * 2.5, sin(a1) * 3.)), b2 = brush(vec3(cos(a2) * 3., r * 2.5 + 5., sin(a2) * 3.));
  vec3 col = uSunA;
  col = mix(col, uSunB, step(.6 + (b1 - .5) * .16, r));
  col = mix(col, uSunC, step(.83 + (b2 - .5) * .12, r));
  if (uPart > .5) { if (r > 1.) discard; gl_FragColor = vec4(col, 1.); return; }
  // halo: two flat bands with torn edges
  float hb = brush(vec3(cos(a) * 2., 1., sin(a) * 2.) + uTime * .01) - .5;
  float h1 = 1. - smoothstep(1.45 + hb * .25 - aa, 1.45 + hb * .25 + aa, r), h2 = 1. - smoothstep(2.3 + hb * .5 - aa, 2.3 + hb * .5 + aa, r);
  // god rays: 12 wedges turning slowly, each a flat stroke fading outward
  float w = sin(a * 6. + uTime * .06) * sin(a * 3. - uTime * .04 + 1.);
  float ray = step(.38, w + (brush(vec3(a * 4., r * .4, 2.)) - .5) * .5) * (1. - smoothstep(2., 6.6, r)) * step(1., r);
  float glow = h1 * .13 + h2 * .06 + ray * .085;
  gl_FragColor = vec4(mix(uSunB, uSunC, .5) * glow * step(.98, r), 1.);
}`,ze=5,lt=`
attribute vec4 aR; attribute float aE;
uniform vec3 uEm[${ze}]; uniform float uEmT[${ze}]; uniform float uTime; uniform vec3 uSunE;
varying vec2 vP; varying vec3 vR; varying float vDepth; varying float vWarm; varying vec3 vT; varying vec2 vSd;
void main() {
  int e = int(aE + .5);
  float t = clamp(uEmT[e], 0., 1.), breath = step(3.5, aE);
  float born = aR.w * .35, lt = clamp((t - born) / (1. - born), 0., 1.);
  float ease = 1. - (1. - lt) * (1. - lt);
  float env = sin(3.1416 * pow(lt, .55)) * step(1e-3, lt) * step(lt, .999);
  // hoof plume: billows in three sizes on a horseshoe round the hoof, open toward the rail (behind and to the
  // right of the elk) so the planted hoof is seen; big ones low, small ones as a ragged streaming top
  float cls = aR.z < .34 ? 0. : (aR.z < .72 ? 1. : 2.);
  float h1 = fract(aR.y * 7.31 + aR.x * 3.17), h2 = fract(aR.z * 13.7 + aR.w * 5.3);
  float ang = mix(3.14 + aR.x * 4.18, aR.x * 6.2832, breath);
  float radH = mix(40., mix(64., 150., aR.y), ease);
  float rad = mix(radH, 70. * (.25 + .75 * aR.y) * ease, breath);
  vec3 c = uEm[e] + vec3(cos(ang) * rad * mix(1., .9, breath), 0., sin(ang) * rad * mix(1., .7, breath));
  float hf = (cls < .5 ? .1 + .34 * h1 : (cls < 1.5 ? .3 + .45 * h1 : .62 + .5 * h1)) * (1. - .45 * aR.y);
  float yH = 10. + 205. * hf * ease + 30. * lt * hf;
  c.y += mix(yH, (aR.z - .3) * 70. * ease + 40. * lt, breath);
  c.x += breath * (60. * ease - 40. * lt) - (1. - breath) * 34. * lt * hf;          // the top leans back downwind
  // alive on the clock as well as on the stride: billows roll, and the smallest stream off the crown
  c += vec3(sin(uTime * .5 + aR.x * 40.), sin(uTime * .7 + aR.y * 40.), cos(uTime * .6 + aR.z * 40.)) * (3. + 2.5 * cls) * (1. - breath * .5);
  float st = fract(uTime * .2 + aR.x * 9.) * step(1.5, cls) * step(.4, h2) * (1. - breath);
  c.x -= st * 78.; c.y += st * 22. - st * st * 16.;
  float sizeH = (cls < .5 ? 78. : (cls < 1.5 ? 47. : 25.)) * (.8 + .45 * h2) * (1. - .75 * st) * (1. + .05 * sin(uTime * .9 + aR.w * 30.));
  float size = mix(sizeH, 36. * (.45 + .75 * aR.z), breath) * env;
  vec4 mv = viewMatrix * modelMatrix * vec4(c, 1.);
  mv.xy += position.xy * size;
  vec3 out3 = c - uEm[e];
  float sunSide = dot(out3.xz / max(length(out3.xz), 1e-3), uSunE.xz / max(length(uSunE.xz), 1e-3)) * .5 + .5;
  vec2 sd = (viewMatrix * modelMatrix * vec4(uSunE, 0.)).xy;
  sd += vec2(0., .7);                              // every billow is lit from above and from the sun's side
  vSd = sd / max(length(sd), 1e-3);
  vT = vec3(c.y / 170., sunSide, size / 170.);
  vP = position.xy; vR = aR.xyz; vDepth = -mv.z; vWarm = breath;
  gl_Position = projectionMatrix * mv;
}`,ct=`
${Me}
${Se}
uniform vec3 uSnowLit; uniform vec3 uSnowShade; uniform vec3 uGold; uniform vec3 uPeach; uniform vec3 uCobalt;
varying vec2 vP; varying vec3 vR; varying float vDepth; varying float vWarm; varying vec3 vT; varying vec2 vSd;
void main() {
  float r = length(vP), a = atan(vP.y, abs(vP.x) < 1e-5 ? 1e-5 : vP.x);
  float edge = .84 + .11 * sin(a * 7. + vR.x * 40.) + .05 * sin(a * 13. + vR.y * 30.);   // scalloped rim
  if (r > edge) discard;
  float br = brush(vec3(vP * 2.2 + vR.xy * 9., vR.z * 5.)) - .5;
  vec3 col;
  if (vWarm > .5) {                                // breath: gold where the sun is on it
    float l = dot(vP, vec2(-.6, .8)) * .5 + .5 + br * .5;
    vec3 lit = mix(uSnowLit, mix(uPeach, uGold, .55) * .95, .92);
    col = mix(uSnowShade, lit, step(.46, l));
    col = mix(col, lit * 1.1, step(.82, l));
  } else {                                         // snow plume in three tones: cobalt-lilac underside, pale body, warm white crown on the sun's side
    float hy = vT.x + vP.y * vT.z;
    float l = dot(vP, vSd) * .5 + .42 + hy * .34 + (vT.y - .5) * .22 + br * .3;
    vec3 under = mix(uCobalt * 1.15, uSnowShade * .95, step(.2, l + br * .2));
    vec3 body = mix(uSnowLit, uSnowShade, .34);
    vec3 crown = mix(uSnowLit, mix(uPeach, uGold, .4), .3) * 1.2;
    col = mix(under, body, step(.36, l));
    col = mix(col, crown, step(.76, l));
  }
  gl_FragColor = vec4(applyFog(col, vDepth), 1.);
}`;function ut(e,c,t){const{U:s,inner:v,hoofs:i}=e,f=ze*c,h=ze*t,g=e.rng;let o=1;const y=()=>{o=o+1831565813|0;let u=Math.imul(o^o>>>15,1|o);return u=u+Math.imul(u^u>>>7,61|u)^u,((u^u>>>14)>>>0)/4294967296},n=new Float32Array(f*12),x=new Float32Array(f*16),p=new Float32Array(f*4),d=[],r=[-1,-1,1,-1,1,1,-1,1];for(let u=0;u<f;u++){const A=u<h?g:y,z=[A(),A(),A(),A()];u===0&&(o=Math.floor(z[0]*4294967296)|0);for(let F=0;F<4;F++)n.set([r[F*2],r[F*2+1],0],(u*4+F)*3),x.set(z,(u*4+F)*4),p[u*4+F]=Math.floor(u/c);d.push(u*4,u*4+1,u*4+2,u*4,u*4+2,u*4+3)}const l=new a.BufferGeometry;l.setAttribute("position",new a.BufferAttribute(n,3)),l.setAttribute("aR",new a.BufferAttribute(x,4)),l.setAttribute("aE",new a.BufferAttribute(p,1)),l.setIndex(d);const w=Array.from({length:ze},()=>new a.Vector3),k=new Float32Array(ze),m=new a.ShaderMaterial({uniforms:{...s,uEm:{value:w},uEmT:{value:k},uSnowLit:{value:e.pal[0].clone().multiplyScalar(.78)},uSnowShade:{value:e.lilac.clone().multiplyScalar(.72)},uSunE:{value:e.sunElk},uCobalt:{value:new a.Color(e.cobalt||"#5F74C8").multiplyScalar(.62)}},vertexShader:lt,fragmentShader:ct,fog:!0}),M=new a.Mesh(l,m);return M.frustumCulled=!1,M.renderOrder=3,v.add(M),e.parts.push({update(){for(let z=0;z<4;z++){const F=i[z].c,P=be[z].hind?pe:Ce;w[z].set(P.F[0]+137+(be[z].hind?34:0)-360*F,0,be[z].z),k[z]=F/.34}const u=e.phase*2+.36,A=u-Math.floor(u);w[4].set(668,884,0).applyMatrix4(e.head),k[4]=A/.62}}),M}const ft=`
attribute vec2 aUv; attribute float aSeed; varying vec2 vUv; varying float vSeed; varying float vDepth;
uniform float uTime;
void main() {
  vec3 p = position; float hang = 1. - aUv.y;
  p.x -= hang * hang * 46.; p.z += sin(uTime * .4 + aSeed * 9. + hang * 3.) * 9. * hang;      // lean back with the walk
  vec4 mv = modelViewMatrix * vec4(p, 1.); vDepth = -mv.z; vUv = aUv; vSeed = aSeed;
  gl_Position = projectionMatrix * mv;
}`,ht=`
${Me}
${Se}
uniform float uTime; uniform vec3 uIce; uniform vec3 uGold;
varying vec2 vUv; varying float vSeed; varying float vDepth;
void main() {
  float fall = vUv.y + uTime * .11 + vSeed;
  vec2 g = vec2(vUv.x * 64., fall * 150.), id = floor(g), f = fract(g) - .5; vec4 h = h24(id + vSeed * 31.);
  float fwv = max(fwidth(g.x), fwidth(g.y));
  float rr = max(.2 + .14 * h.z, fwv * .75);
  float dotm = (1. - smoothstep(rr * .5, rr, length(f - (h.xy - .5) * .5))) * step(h.w, .3) * min(1., .5 / max(fwv, 1e-3));
  float streak = step(.57, brush(vec3(vUv.x * 26. + vSeed * 7., fall * .7, 1.)));
  float env = smoothstep(0., .12, vUv.y) * (1. - smoothstep(.75, 1., vUv.y)) * (1. - pow(abs(vUv.x * 2. - 1.), 3.));
  float tw = .6 + .4 * sin(uTime * (2. + 3. * h.z) + h.x * 40.);
  vec3 col = mix(uIce, uGold, step(.7, h.x)) * (dotm * tw * .85 + streak * .075);
  gl_FragColor = vec4(applyFog(col, vDepth) * env, 0.);
}`;function dt(e,c,t){const{rng:s,U:v}=e,i=[],f=[],h=[],g=[];for(let x=0;x<t;x++){const p=x%2?e.antL:e.antR,d=s.range(.25,.95),r=p.palm(d,-.95,-8),l=p.palm(Math.min(1,d+s.range(.12,.2)),-.9,-8),w=s.range(110,200),k=s(),m=i.length/3;i.push(r.x,r.y,r.z,l.x,l.y,l.z,l.x,l.y-w,l.z,r.x,r.y-w,r.z),f.push(0,1,1,1,1,0,0,0),h.push(k,k,k,k),g.push(m,m+1,m+2,m,m+2,m+3)}const o=new a.BufferGeometry;o.setAttribute("position",new a.Float32BufferAttribute(i,3)),o.setAttribute("aUv",new a.Float32BufferAttribute(f,2)),o.setAttribute("aSeed",new a.Float32BufferAttribute(h,1)),o.setIndex(g);const y=new a.ShaderMaterial({uniforms:{...v},vertexShader:ft,fragmentShader:ht,fog:!0,transparent:!0,depthWrite:!1,side:a.DoubleSide,premultipliedAlpha:!0}),n=new a.Mesh(o,y);return n.frustumCulled=!1,n.renderOrder=5,c.add(n),n}function We(e,c,t,s){const v=(f,h,g,o,y,n,x,p)=>{const d=e.count,r=e.idx.length;for(let l=0;l<3;l++){const w=l/3*we+f;e.vert(f+Math.cos(w)*p,h,g+Math.sin(w)*p,3,-1)}e.vert(f+o*x,h+y*x,g+n*x,3,-1),e.idx.push(d,d+1,d+3,d+1,d+2,d+3,d+2,d,d+3),Ge(e,r)},i=Math.round(s*.72/c.tines.length);for(const f of c.tines)for(let h=0;h<i;h++){const g=t.range(.12,.98)*(f.pts.length-2)+1,o=Math.floor(g),y=g-o,n=f.pts[o],x=f.pts[Math.min(f.pts.length-1,o+1)],p=ie(12,3.4,Math.pow(o/(f.pts.length-1),.8))*.8,d=t.range(-.5,.5);v(ie(n.x,x.x,y)+d*p,ie(n.y,x.y,y)+p*(1-d*d*.6),ie(n.z,x.z,y)+t.range(-.4,.4)*p,t.range(-.3,.3)-.2,1,t.range(-.3,.3),t.range(2.2,6.5),t.range(.5,1))}for(let f=0;f<s*.28;f++){const h=t.range(.08,1),g=(t.chance(.6)?-1:1)*t.range(.93,1),o=c.palm(h,g,3);v(o.x,o.y,o.z,t.range(-.3,.3)-.15,1,t.range(-.3,.3),t.range(2.5,7),t.range(.6,1.1))}}const mt=`
// aBird: lift (metres on the flock clock), rnd, scale, wheel radius. aFly: x = metres flown per clock metre (wheelers) or
// gap kept ahead of the camera (formation), y = kind (0 wheels off its tine, 1 formation down the fly-through, 2 dives into the ring).
// aLane: metres to the right, metres up, extra lead gained on the approach.
// aX: crossing birds only: metres drifted to the right per clock metre, and the clock at which they are on the axis.
attribute vec3 aPerch; attribute vec3 aDir; attribute vec4 aBird; attribute vec2 aWC; attribute vec2 aFly; attribute vec3 aOff; attribute vec3 aLane; attribute vec2 aX;
uniform float uTime; uniform float uM; uniform vec3 uGateC; uniform vec3 uRun; uniform float uRunLen; uniform mat4 uHeadInv; uniform float uFlap;
varying float vCol; varying float vDepth; varying vec3 vL;
// a formation bird at flock-clock um: off its tine, round in an arc, then holding a lane ahead of the camera
vec3 lanePos(float um) {
  float k = 1. - exp(-max(um - aBird.x, 0.) / 50.);
  k = mix(k, 1., step(1e-3, abs(aX.x)));           // crossing birds come in from outside the frame
  float s = um + aFly.x + aLane.z * smoothstep(90., 330., um);
  float conv = 1. - .8 * smoothstep(uRunLen - 150., uRunLen - 15., s);   // they close on the ring only at the end
  vec3 rv = normalize(vec3(-uRun.z, 0., uRun.x) + vec3(1e-4, 0., 0.));
  float lat = aLane.x * conv + aX.x * (um - aX.y);
  vec3 lane = uGateC + uRun * s + rv * lat + vec3(0., aLane.y * conv, 0.);
  lane = (uHeadInv * vec4(lane, 1.)).xyz;          // lanes are fixed to the fly-through (rest pose), perches nod with the head
  return mix(aPerch, lane, k) + vec3(0., 9. * k * (1. - k), 0.);
}
void main() {
  float lift = aBird.x, rnd = aBird.y, sc = aBird.z, R = aBird.w, kind = aFly.y;
  float cross = step(1e-3, abs(aX.x));
  float tm = uM - lift, f = max(smoothstep(0., 20., tm) * step(0., tm), cross);
  float air = step(.5, kind);
  // where it is and which way it heads
  vec3 fw = normalize(vec3(aDir.x, 0., aDir.z) + vec3(1e-4, 0., 0.)), rt = vec3(fw.z, 0., -fw.x);
  float d = max(tm, 0.) * aFly.x, psi = d / (abs(R) < 1. ? 1. : R);
  float climb = min(d, 70.) * .5 + d * .05 + aDir.y * d * .1;
  vec3 c = aPerch + (fw * sin(psi) + rt * (1. - cos(psi))) * R + vec3(0., climb, 0.);
  vec3 hf = fw * cos(psi) + rt * sin(psi);
  if (kind > .5 && kind < 1.5) {                  // formation: heading follows the bird's own track, so it wheels round to lead us
    c = lanePos(uM);
    vec3 dv = lanePos(uM + 3.) - c;
    hf = normalize(vec3(dv.x, 0., dv.z) + fw * .03);
    c.y += sin(uTime * 1.1 + rnd * 20.) * 1.1;
    float s = uM + aFly.x + aLane.z * smoothstep(90., 330., uM);
    sc *= 1. - step(uRunLen + 4., s);
    sc *= mix(1., 1. - smoothstep(aOff.x * .85, aOff.x, abs(uM - aX.y)), cross);
  } else if (kind > 1.5) {                        // the last birds: off the brow tine and into the ring
    float k2 = smoothstep(0., 200., tm);
    c = mix(aPerch, (uHeadInv * vec4(aPerch + aOff, 1.)).xyz, k2) + vec3(0., 16. * sin(3.1416 * k2) + sin(uTime * 1.3 + rnd * 20.), 0.);
    hf = fw; sc *= 1. - step(.995, k2);
  }
  vec3 hr = vec3(hf.z, 0., -hf.x);
  // a painted bird shows its plan to the viewer: it banks and pitches a little toward wherever the lens is
  vec3 toCam = cameraPosition - (modelMatrix * vec4(c, 1.)).xyz; float tl = max(length(toCam), 1e-3);
  float side = clamp(dot(mat3(modelMatrix) * hr, toCam) / tl * 3., -1., 1.);
  float above = clamp(toCam.y / tl * 5., -1., 1.);
  // wings: folded and drooped when perched; in the air two hinges, the hand lagging the arm, and some birds gliding
  float ph = uTime * (uFlap + rnd) + rnd * 20.;
  float glide = smoothstep(.45, .8, sin(uTime * .45 + rnd * 37.)) * f;
  float amp = mix(1., .1, glide);
  float th1 = mix(-1.15, (.1 + .52 * sin(ph)) * amp + .16 * glide, f);
  float th2 = mix(-.5, (-.55 * cos(ph) - .1) * amp, f);
  vec3 p = position; float w = abs(aWC.x), sg = sign(aWC.x);
  float fold = mix(.22, 1., f), ax = abs(p.x) * fold, xw = .7 * fold;
  float xi = min(ax, xw), xo = max(ax - xw, 0.);
  if (w > .004) {
    p.x = sg * (xi * cos(th1) + xo * cos(th1 + th2));
    p.y += xi * sin(th1) + xo * sin(th1 + th2);
    p.z -= xo * clamp(-th2, 0., 1.) * .4 * f;      // the hand sweeps back on the upstroke
  } else {
    p.y -= sin(ph) * .05 * amp * f;                // the body lifts against the downstroke
  }
  // perched birds stand upright and preen
  float pitFly = mix(.06 * sin(uTime * 2.6 + rnd * 9.), .1 + .3 * max(above, 0.) + .06 * sin(uTime * 1.3 + rnd * 9.), air);
  float pit = mix(1.15 + .12 * sin(uTime * .9 + rnd * 30.), pitFly, f);
  float neck = smoothstep(.5, 1.3, position.z) * (1. - f);
  p.x += neck * sin(uTime * .7 + rnd * 50.) * .28;
  p = vec3(p.x, p.y * cos(pit) + p.z * sin(pit), p.z * cos(pit) - p.y * sin(pit));
  p.y += (1. - f) * 1.05;
  float bankAir = -side * above * (.3 + .4 * rnd) + .12 * sin(uTime * .9 + rnd * 12.);
  float bank = mix(.85 * sign(R), bankAir, air) * f;
  vec3 wp = c + (hr * (p.x * cos(bank) - p.y * sin(bank)) + vec3(0., p.y * cos(bank) + p.x * sin(bank), 0.) + hf * p.z) * sc;
  vec4 mv = modelViewMatrix * vec4(wp, 1.);
  vCol = aWC.y; vDepth = -mv.z; vL = position;
  gl_Position = projectionMatrix * mv;
}`,vt=`
${Me}
${Se}
uniform vec3 uSlate; uniform vec3 uSnowLit; uniform vec3 uDark; uniform vec3 uCrown;
varying float vCol; varying float vDepth; varying vec3 vL;
void main() {
  float b = brush(vL * vec3(3., 1., 1.2)) - .5;
  vec3 col = vCol < .5 ? mix(uSlate * .8, uSlate, step(-.12, b)) : vCol < 1.5 ? uSnowLit : vCol < 2.5 ? uDark : uCrown;
  gl_FragColor = vec4(applyFog(col, vDepth), 1.);
}`;function pt(e){const c=[],t=(f,h,g,o)=>c.push([f,h,g,o||g]),s=(f,h,g,o,y,n,x,p)=>{for(const d of[-1,1])t([0,0,f,0,p],[d*y,0,h,0,p],[d*y*.85,0,g,0,p],[0,0,o,0,p]);t([0,0,f,0,p],[0,n,h,0,p],[0,n*.8,g,0,p],[0,0,o,0,p]),t([0,0,f,0,p],[0,-x,h,0,p],[0,-x*.9,g,0,p],[0,0,o,0,p])},v=(f,h,g,o,y,n,x=0,p=0)=>{t([-g,x,f,0,y],[g,x,f,0,y],[o,p,h,0,n],[-o,p,h,0,n]),t([0,x-g,f,0,y],[0,x+g,f,0,y],[0,p+o,h,0,n],[0,p-o,h,0,n])},i=(f,h,g,o,y,n,x,p,d)=>{const r=l=>Math.max(.01,(l-.1)/1.35);for(const l of[-1,1]){for(let u=0;u<f.length-1;u++){const[A,z,F]=f[u],[P,N,$]=f[u+1],I=r(A)*l,q=r(P)*l,C=g[u],B=u<2?1:C,D=F+(z-F)*h,V=$+(N-$)*h;t([l*A,0,z,I,C],[l*P,0,N,q,C],[l*P,0,V,q,C],[l*A,0,D,I,C]),t([l*A,0,D,I,B],[l*P,0,V,q,B],[l*P,0,$,q,B],[l*A,0,F,I,B])}const[w,k,m]=f[f.length-1],M=r(w)*l;for(let u=0;u<o;u++){const A=u/o,z=(u+y)/o,F=(u+.5)/o,P=n-.2*F*F;t([l*w,0,k+(m-k)*A,M,d],[l*w,0,k+(m-k)*z,M,d],[l*P,0,x+(p-x)*F,r(P)*l,d])}}};if(e==="ravens"){s(.42,.16,-.2,-.45,.2,.12,.15,0),v(.36,.66,.115,.09,0,0),v(.64,.92,.06,.012,2,2);for(const f of[-1,1])t([0,0,-.34,0,2],[f*.08,0,-.34,0,2],[f*.22,0,-.82,0,2],[0,0,-1,0,2]);i([[.1,.34,-.3],[.4,.43,-.31],[.7,.43,-.28],[1,.35,-.25],[1.16,.25,-.2]],.36,[0,0,0,0],5,.66,1.52,.26,-.36,2)}else e==="swans"?(s(.5,.18,-.24,-.62,.2,.11,.17,0),v(.44,1.26,.062,.046,0,0),v(1.24,1.37,.066,.05,0,0),v(1.37,1.5,.046,.03,3,3),v(1.5,1.57,.03,.012,2,2),i([[.1,.3,-.3],[.42,.36,-.27],[.7,.35,-.2],[1.02,.24,-.12],[1.22,.12,-.06]],.3,[0,0,1,1],4,.8,1.5,.06,-.24,1)):(s(.52,.2,-.2,-.5,.17,.1,.15,0),v(.46,1.2,.055,.04,0,1),v(1.18,1.3,.06,.05,3,3),v(1.3,1.56,.03,.007,2,2),v(-.42,-1.22,.036,.02,2,2,-.03,-.05),t([-.09,0,-.42,0,0],[.09,0,-.42,0,0],[.05,0,-.64,0,0],[-.05,0,-.64,0,0]),i([[.1,.32,-.26],[.42,.37,-.24],[.7,.36,-.2],[1,.27,-.16],[1.2,.17,-.12]],.3,[0,0,0,2],5,.8,1.5,.12,-.3,2));return c}async function xt(e,c,t,s=1,v){const{rng:i,U:f}=e,h=[],g=[],o=[],y=[],n=[],x=[],p=pt(e.birdKind),d=e.antR.tines,r=d.filter(S=>S.tag==="rear"),l=d.filter(S=>S.tag==="front"),w=r[0],k=r[1]||r[0],m=e.antR.browOuter||l[0]||r[0],M=w.pts[8],u=M.clone().lerp(k.pts.reduce((S,R)=>Math.abs(R.y-M.y)<Math.abs(S.y-M.y)?R:S,k.pts[0]),.5),A=m.pts[8],z=(l[l.length-1]||r[0]).pts[8],F=A.clone().lerp(z,.5);F.y=(A.y+z.y)/2-6;const P=F.clone().sub(u),N=Math.max(P.length(),1);P.multiplyScalar(1/N);const $=22,I=10,q=[[17,-6.5,3.2],[20,8.5,-3.4],[25,3,5.6],[30,-13,6.4],[36,15,-6.5],[42,-4,9],[48,21,-8.5],[56,9,11],[64,-21,12],[74,15,14]];if(e.birdKind==="swans")for(const S of q)S[2]=Math.abs(S[2])+.6;const C=[[22,5.2,.36,-34],[29,8,.32,-4],[24,6.2,.36,58],[32,9.5,-.3,104],[23,5.6,.36,148],[30,8.5,.34,198]],B=[],D=[],V=[],Q=[],se=[...e.antR.tines,...e.antL.tines];for(let S=0;S<t;S++){v&&S%16===15&&await v();const R=S<$?1:S<$+I?2:0,E=R===1?S%2?k:w:R===2?m:i.pick(se),L=Math.min(E.pts.length-1,Math.floor(R===1?i.range(6,10.99):i.range(R?5:3,E.pts.length-.01))),H=E.pts[L],Z=ie(12,3.4,Math.pow(L/(E.pts.length-1),.8)),de=i.range(0,we),ue=i(),xe=R===1?i.range(-250,-150):R===2?95+(S-$)*15+i.range(-6,6):i.chance(.6)?i.range(-1500,260):1e9,ae=R?[P.x,P.y,P.z]:[Math.cos(de),i.range(-.2,.5),Math.sin(de)],me=i.range(.9,1.15)*s*(R===1?1.36:1),W=(R?3e3:i.range(110,260))*(i.chance(.5)?1:-1),ee=[0,0,0],fe=[0,0,0],ve=[0,0];let ge=.33;if(R===1){const re=i.range(64,112),te=i.chance(.5)?1:-1,he=i.range(10,70),X=C[S-q.length],ne=q[S]||[re,te*i.range(6,30),re*i.range(.1,.24)];X?(ge=X[0],fe[1]=X[1],ve[0]=X[2],ve[1]=X[3],ee[0]=(X[0]*1.15+14)/Math.abs(X[2])):(ge=ne[0],fe[0]=ne[1],fe[1]=ne[2],fe[2]=q[S]?6+S*5:he)}else if(R===2){const re=F.x+P.x*6+i.range(-5,5),te=F.y+P.y*6+i.range(-5,4),he=F.z+P.z*6+i.range(-5,5);ee[0]=re-H.x,ee[1]=te-(H.y+Z*.9),ee[2]=he-H.z,ae[0]=ee[0],ae[1]=0,ae[2]=ee[2]}for(const re of p){const te=h.length/3;for(const[he,X,ne,Re,Fe]of re)h.push(he,X,ne),g.push(Re,Fe),o.push(H.x,H.y+Z*.9,H.z),y.push(ae[0],ae[1],ae[2]),n.push(xe,ue,me,W),B.push(ge,R),D.push(ee[0],ee[1],ee[2]),V.push(fe[0],fe[1],fe[2]),Q.push(ve[0],ve[1]);x.push(te,te+1,te+2,te,te+2,te+3)}}const O=new a.BufferGeometry;O.setAttribute("position",new a.Float32BufferAttribute(h,3)),O.setAttribute("aWC",new a.Float32BufferAttribute(g,2)),O.setAttribute("aPerch",new a.Float32BufferAttribute(o,3)),O.setAttribute("aDir",new a.Float32BufferAttribute(y,3)),O.setAttribute("aBird",new a.Float32BufferAttribute(n,4)),O.setAttribute("aFly",new a.Float32BufferAttribute(B,2)),O.setAttribute("aOff",new a.Float32BufferAttribute(D,3)),O.setAttribute("aLane",new a.Float32BufferAttribute(V,3)),O.setAttribute("aX",new a.Float32BufferAttribute(Q,2)),O.setIndex(x);const Y={value:-4e3},U=new a.Matrix4,K=new a.ShaderMaterial({uniforms:{...f,uM:Y,uHeadInv:{value:U},uGateC:{value:u},uRun:{value:P},uRunLen:{value:N},uFlap:{value:e.birdKind==="ravens"?7.2:e.birdKind==="swans"?5.6:5},uSlate:{value:new a.Color(e.craneCols?.[0]||"#5E7396").multiplyScalar(e.craneCols?.95:.8)},uSnowLit:{value:new a.Color(e.craneCols?.[1]||e.pal[0]).multiplyScalar(.78)},uDark:{value:new a.Color(e.craneCols?.[2]||"#1B2440")},uCrown:{value:new a.Color(e.craneCols?.[3]||"#C8442E")}},vertexShader:mt,fragmentShader:vt,fog:!0,side:a.DoubleSide}),j=new a.Mesh(O,K);return j.frustumCulled=!1,j.renderOrder=3,c.add(j),e.parts.push({update(){Y.value=e.craneM??(e.u-.9)*3750,U.copy(e.head).invert()}}),j}async function Mt(e,c={}){const t=e.rng.fork?e.rng.fork("elk-hero"):e.rng,s=(c.palette&&c.palette.length>=7?c.palette:Je).map(b=>new a.Color(b)),[v,i,f,h,g,o,y]=s,n=Pe(c.detail??e.quality?.detail??1,.6,1),x={hump:t.range(.985,1.03),muzzle:t.range(0,1.6),dewlap:t.range(.25,1.2),sweep:t.range(-.08,.1),tineCurl:t.range(.8,1.25),tines:9},p=["milkyway","comet","moon","aurora"],d=c.night||(t.chance(.5)?"milkyway":t.pick(p.slice(1))),r=new a.Group;r.name="elk-who-carries-the-sun";const l=new a.Group;l.rotation.y=-Math.PI/2,r.add(l);const w=c.sunDir?new a.Vector3().fromArray(c.sunDir).normalize():new a.Vector3(Math.cos(.384)*.7071,Math.sin(.384),-Math.cos(.384)*.7071),k=new a.Vector3(t.range(-.25,.25),.86,t.range(.35,.6)).normalize(),m={...a.UniformsUtils.clone(a.UniformsLib.fog),uFogK:{value:c.fogK??.12},uMask:{value:0},uTime:{value:0},uSeed:{value:t.range(0,50)},uSeg:{value:Array.from({length:Ve},()=>new a.Matrix4)},uRim:{value:7},uPxK:{value:.004},uSunP:{value:new a.Vector3(400,1224,-376)},uSunW:{value:new a.Vector3(0,1,0)},uGroundW:{value:.6},uNightA:{value:f.clone().multiplyScalar(1.5)},uNightB:{value:f.clone().lerp(new a.Color("#27306A"),.75)},uIce:{value:h.clone()},uGold:{value:g.clone()},uPeach:{value:i.clone()},uApricot:{value:y.clone()},uShadowSnow:{value:new a.Color("#2C3A78")},uScroll:{value:new a.Vector2},uMwN:{value:k},uBodyDir:{value:new a.Vector3(0,0,-1)},uMode:{value:p.indexOf(d)}},M=Ze(t,x);await e.yield?.();const u=(b,T,_={})=>new a.ShaderMaterial({uniforms:{...m,uPass:{value:b}},vertexShader:tt,fragmentShader:ot,side:T,fog:!0,..._}),A=new a.Mesh(M,u(0,a.FrontSide)),z=new a.Mesh(M,u(1,a.BackSide)),F=new a.Vector2;z.onBeforeRender=(b,T,_)=>{b.getDrawingBufferSize(F),m.uPxK.value=6/Math.max(.001,_.projectionMatrix.elements[5]*Math.max(F.y,1))};const P=new a.Group;P.name="night-shadow";const N=u(2,a.DoubleSide,{polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),$=new a.Mesh(M,N);P.add($);for(const b of[A,z,$])b.frustumCulled=!1;A.renderOrder=1,z.renderOrder=2,$.renderOrder=0,l.add(A,z),c.shadow!==!1&&l.add(P);const I=Array.from({length:4},()=>({x:0,y:0,z:0,down:1,c:0})),q=[],C={craneU:c.craneU,craneCols:c.craneColors,birdKind:c.birdKind||"cranes",U:m,rng:t,pal:s,detail:n,vary:x,inner:l,shadow:P,shadowMat:N,hoofs:I,sunElk:w,parts:q,u:0,phase:0,time:0,head:m.uSeg.value[3]},B=new Ie,D=Ke(B,t,x,1);await e.yield?.();const V=Ke(B,t,x,-1),Q=t.fork?t.fork("frost"):t,se=B.idx.length;We(B,D,Q,Math.round(1300*n)),We(B,V,Q,Math.round(1300*n));const O=B.geometry();await e.yield?.();const Y=new a.Color("#8FA3DC"),U=(b,T)=>new a.ShaderMaterial({uniforms:{...m,uOut:{value:b},uBoneLit:{value:v.clone().lerp(g,.62).multiplyScalar(.9)},uBoneMid:{value:v.clone().lerp(i,.06).multiplyScalar(.8)},uBoneShade:{value:c.boneShade?new a.Color(c.boneShade):new a.Color("#5E6FBE").multiplyScalar(.6)},uSnowLit:{value:v.clone().multiplyScalar(.8)},uSnowShade:{value:Y.clone().multiplyScalar(.68)}},vertexShader:nt,fragmentShader:rt,fog:!0,side:T}),K=U(0,a.FrontSide),j=new a.Mesh(O,K);j.frustumCulled=!1,j.renderOrder=1,l.add(j);const S=new a.BufferGeometry;for(const b of["position","normal","seg","aux"])S.setAttribute(b,O.getAttribute(b));S.setIndex(O.getIndex()),S.setDrawRange(0,se);const R=new a.Mesh(S,U(1,a.BackSide));R.frustumCulled=!1,R.renderOrder=2,l.add(R);const E=new a.BufferGeometry;for(const b of["position","normal","seg"])E.setAttribute(b,O.getAttribute(b));E.setIndex(O.getIndex()),E.setDrawRange(0,se);const L=new a.Mesh(E,N);L.frustumCulled=!1,P.add(L);const H=V.palm(.52,.05,0).addScaledVector(V.palmN,96),Z=(c.sunColors||["#FFCB2E","#F7A233","#EC7A2A"]).map((b,T)=>new a.Color(b).multiplyScalar([1.22,1,.92][T])),de=(b,T)=>new a.ShaderMaterial({uniforms:{...m,uR:{value:80},uPart:{value:b},uSunA:{value:Z[0]},uSunB:{value:Z[1]},uSunC:{value:Z[2]}},vertexShader:st,fragmentShader:it,fog:!0,...T}),ue=new a.PlaneGeometry(2,2),xe=new a.Mesh(ue,de(0,{blending:a.AdditiveBlending,depthTest:!1,depthWrite:!1}));xe.renderOrder=-.5;const ae=new a.Mesh(ue,de(1,{}));ae.renderOrder=1;for(const b of[xe,ae])b.frustumCulled=!1,l.add(b);q.push({update(){ae.position.copy(H).applyMatrix4(C.head),xe.position.copy(ae.position),m.uSunP.value.copy(ae.position).applyMatrix4(l.matrixWorld)}}),C.antR=D,C.antL=V,C.sunRest=H,C.sunMesh=ae,C.lilac=Y;const me=new a.Group;me.matrixAutoUpdate=!1,l.add(me),q.push({update(){me.matrix.copy(C.head),me.matrixWorldNeedsUpdate=!0}}),C.headGroup=me,C.cobalt=c.cobalt,ut(C,Math.round(40+32*n),Math.round(40*n)),await e.yield?.(),dt(C,me,Math.round(10*n)),await e.yield?.(),await xt(C,me,32+Math.round(56*n),c.craneScale??1,e.yield?()=>e.yield():null),await e.yield?.();const W=(b,T,_)=>new a.Vector3(b,T,_),ee=D.tines.filter(b=>b.tag==="rear"),fe=D.tines.filter(b=>b.tag==="front"),ve=(b,T)=>b.pts.reduce((_,Ae)=>Math.abs(Ae.y-T)<Math.abs(_.y-T)?Ae:_,b.pts[0]),ge=ee[0].pts[8].y,re=ee[0].pts[8].clone().lerp(ve(ee[1],ge),.5),te=D.browOuter.pts[8],he=fe[fe.length-1].pts[8],X=te.clone().lerp(he,.5);X.y=(te.y+he.y)/2-6;const ne=X.clone().sub(re),Re=ne.length();ne.normalize();const Fe={portalSeat:{position:X,facing:ne.clone(),radiusFree:Math.min(te.distanceTo(X),he.distanceTo(X))-12},flyThrough:[W(-420,1e3,330),W(-150,1030,262),W(70,1140,262),re.clone().addScaledVector(ne,-40),re,X,X.clone().addScaledVector(ne,80)],gate:re,straightLength:Re,threadTines:[ve(ee[0],ge).clone(),ve(ee[1],ge).clone(),te.clone(),he.clone()],sun:H.clone(),sunRadius:80,muzzle:W(668,884,0),rightEar:W(300,1060,120),withers:W(0,940*x.hump,0),rump:W(-820,820,0),hooves:be.map(b=>W(b.hind?pe.F[0]+54:Ce.F[0]+20,0,b.z)),hocks:[W(pe.K[0],pe.K[1],-110),W(pe.K[0],pe.K[1],110)],viewpoints:{entry:{position:W(-2450,55,620),lookAt:W(-380,420,0)},shadowEdge:{position:W(-1900,16,730),lookAt:W(-700,300,110)},hoofFall:{position:W(-900,120,300),lookAt:W(-764,40,110)},flank:{position:W(-380,760,430),lookAt:W(-380,700,0)},sunAbeam:{position:re.clone().addScaledVector(ne,120),lookAt:H.clone()},fork:{position:X.clone().addScaledVector(ne,-220),lookAt:X.clone()}},shadowTip:W(0,0,0).addScaledVector(w,-1340/w.y).setY(0)},Te=b=>b&&b.isVector3?new a.Vector3(-b.z,b.y,b.x):Array.isArray(b)?b.map(Te):b&&typeof b=="object"?Object.fromEntries(Object.entries(b).map(([T,_])=>[T,Te(_)])):b,_e=Te(Fe);let ke=-1;const ye=new a.Vector3,Ue=new a.Vector3,Ee=new a.Matrix3,je=(b,T,_)=>new a.Vector3(-_,T,b),$e=Array.from({length:4},()=>({pos:new a.Vector3,down:1,cycle:0})),qe={object:r,radius:820,height:1340,center:new a.Vector3(0,720,-60),anchors:_e,anchorsElk:Fe,uniforms:m,elkGeo:M,shadowMat:N,segCount:Ve,ground:!0,groundY:0,shadow:P,night:d,antlers:{right:D,left:V},triangles:{elk:M.getIndex().count/3,antlers:O.getIndex().count/3,antlerShadow:se/3},sunDir:je(w.x,w.y,w.z),setProgress(b){ke=Math.max(0,b)},hoof(b){const T=I[b],_=$e[b];return _.pos.set(-T.z,T.y,T.x),_.down=T.down,_.cycle=T.c,_},update(b,T,_){const Ae=ke>=0?ke:T/46%1,Le=ke>=0?ke*5+(c.phase0||0):T/9;C.u=Ae,C.phase=Le,C.time=T,C.camera=_,C.craneM=qe.craneClock,m.uTime.value=T;const He=Math.sin(Pe((Ae-(qe.earU??c.earU??.63)+.01)/.03,0,1)*Math.PI);at(m.uSeg.value,I,Le,T,He),r.updateMatrixWorld(!0),Ee.setFromMatrix4(l.matrixWorld),m.uSunW.value.copy(w).applyMatrix3(Ee).normalize(),m.uGroundW.value=ye.set(0,.6,0).applyMatrix4(l.matrixWorld).y,ye.set(1,0,0).applyMatrix3(Ee).normalize(),m.uScroll.value.set(ye.x,ye.z).multiplyScalar(Le*360),_&&(ye.set(-320,700,0).applyMatrix4(l.matrixWorld).sub(Ue.setFromMatrixPosition(_.matrixWorld)),ye.lengthSq()>1&&m.uBodyDir.value.copy(ye.normalize()));for(const Xe of q)Xe.update(C,b)},dispose(){}};return qe}export{tt as ELK_VERT,et as NIGHT,Mt as buildHero,at as poseElk};
