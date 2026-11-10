import*as e from"three";import{makePath as vo}from"../kit/core.js";import*as bt from"../kit/fx.js";import*as Ae from"../kit/fauna.js";import{buildHero as wo,MM_GLASS as yo}from"../parts/million-mirrors.js";const kt=["#070D14","#1C3556","#0E3B33","#8FE3C0","#C9D6E2","#F2F8FF","#4A4640"],ee=-.4,dt=46.5,re=Math.PI*2,Ct=-146.75,le=9.3,Ve=26,_e=-232,ae=-150,H=13,ce=17,xo=[-120,-60,0,60,120],V=(t,u,h)=>t+(u-t)*h,Pe=(t,u,h)=>Math.min(h,Math.max(u,t)),_=(t,u,h)=>{const M=Pe((t-u)/(h-u),0,1);return M*M*(3-2*M)},ze=(t,u=1)=>{const h=new e.Color(t);return[h.r*u,h.g*u,h.b*u]},ge=[1,1,1],Mt=[0,0],ft=[0,0,0];function oe(){const t=[],u=[],h=[],M=[],g=[],l=[],w=new e.Vector3,k=new e.Vector3,b=new e.Matrix3,a=new e.Matrix4,n=new e.Quaternion,r=new e.Euler,s=new e.Vector3,p=new e.Vector3,i=[["position",t,3],["normal",u,3],["aUv",h,2],["aEdge",M,3],["aMat",g,4],["aCol",l,3]],c={add(d,m={}){const P=d.index?d.toNonIndexed():d;if(m.m)a.copy(m.m);else{const O=m.p||[0,0,0],se=m.r||[0,0,0],U=m.s===void 0?[1,1,1]:typeof m.s=="number"?[m.s,m.s,m.s]:m.s;a.compose(p.set(O[0],O[1],O[2]),n.setFromEuler(r.set(se[0],se[1],se[2],m.order||"XYZ")),s.set(U[0],U[1],U[2]))}b.getNormalMatrix(a);const G=P.attributes.position,A=P.attributes.normal,T=P.attributes.uv,L=m.kind||0,R=m.size||.6,te=m.w||0,N=m.col||ge,ke=m.us===void 0?1:m.us,Fe=m.vs===void 0?1:m.vs,me=m.phase||0,Ce=m.bob||99;for(let O=0;O<G.count;O++){w.fromBufferAttribute(G,O);const se=w.x,U=w.y,ne=w.z;w.applyMatrix4(a),A?k.fromBufferAttribute(A,O).applyMatrix3(b):k.set(0,1,0);const Ne=k.length();Ne>1e-9?k.multiplyScalar(1/Ne):k.set(0,1,0),t.push(w.x,w.y,w.z),u.push(k.x,k.y,k.z),m.uvFn?(m.uvFn(w,Mt,se,U,ne),h.push(Mt[0],Mt[1])):h.push(T?T.getX(O)*ke:0,T?T.getY(O)*Fe:0),M.push(m.sway?m.sway(se,U,ne):0,me,Ce),g.push(L,R,m.ao===void 0?1:typeof m.ao=="function"?m.ao(se,U,ne,w):m.ao,te),m.colFn?(m.colFn(se,U,ne,ft,w),l.push(ft[0],ft[1],ft[2])):l.push(N[0],N[1],N[2])}return P!==d&&P.dispose(),d.dispose(),c},get triangles(){return t.length/9},build(){const d=new e.BufferGeometry;for(const[m,P,G]of i)d.setAttribute(m,new e.Float32BufferAttribute(P,G));return d},async buildInSteps(d){const m=new e.BufferGeometry;for(const[P,G,A]of i)m.setAttribute(P,new e.Float32BufferAttribute(G,A)),await d();return m}};return c}function de(t,u,h){const M=t+1,g=u+1,l=new Float32Array(M*g*3),w=new Float32Array(M*g*2),k=[],b=[0,0,0,0,0];for(let n=0;n<g;n++)for(let r=0;r<M;r++){h(r/t,n/u,b);const s=n*M+r;l[s*3]=b[0],l[s*3+1]=b[1],l[s*3+2]=b[2],w[s*2]=b[3],w[s*2+1]=b[4]}for(let n=0;n<u;n++)for(let r=0;r<t;r++){const s=n*M+r,p=s+1,i=s+M,c=i+1;k.push(s,p,c,s,c,i)}const a=new e.BufferGeometry;return a.setAttribute("position",new e.BufferAttribute(l,3)),a.setAttribute("uv",new e.BufferAttribute(w,2)),a.setIndex(k),a.computeVertexNormals(),a}const D=(t,u)=>new e.LatheGeometry(t.map(h=>new e.Vector2(h[0],h[1])),u),Ke=`
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 h23(vec2 p){ return fract(sin(vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
`,jt=`
float mmFog(){
#ifdef USE_FOG
  #ifdef FOG_EXP2
    return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    return smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  return 0.;
#endif
}
`,Pt=`
uniform vec3 uAmb, uWinFill; uniform vec4 uFlame, uLit; uniform vec3 uGain; uniform vec2 uWinGain;
vec3 softLight(vec3 P, vec3 N){
  vec3 L = uAmb * (.75 + .25 * N.y);
  vec3 d = vec3(0., 6.7, 0.) - P; float d2 = dot(d, d);
  float lg = max(uLit.x, max(uLit.y, uLit.z));
  L += uFlame.rgb * (uGain.x * lg * (max(dot(N, d) * inversesqrt(d2 + 1e-3), 0.) * .75 + .25) / (1. + d2 / 900.));
  d = vec3(0., 35., -120.) - P; d2 = dot(d, d);
  L += uFlame.rgb * (uGain.x * .5 * uLit.w * (max(dot(N, d) * inversesqrt(d2 + 1e-3), 0.) * .75 + .25) / (1. + d2 / 420.));
  d = vec3(0., 35., 120.) - P; d2 = dot(d, d);
  L += uFlame.rgb * (uGain.x * .5 * uLit.w * (max(dot(N, d) * inversesqrt(d2 + 1e-3), 0.) * .75 + .25) / (1. + d2 / 420.));
  float bay = .6 + .4 * cos(P.z * .10472);
  L += uWinFill * (bay * (uWinGain.y * max((N.x + .3 * N.y) * .958, 0.) / (1. + (35. - P.x) * .03) + uWinGain.x * max((-N.x + .3 * N.y) * .958, 0.) / (1. + (35. + P.x) * .03)));
  return L; }
`,go=`
attribute vec2 aUv; attribute vec4 aMat; attribute vec3 aCol;
varying vec3 vW, vN, vCol; varying vec2 vUv; varying vec4 vMat;
#include <fog_pars_vertex>
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz; vN = mat3(modelMatrix) * normal; vCol = aCol; vUv = aUv; vMat = aMat;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,bo=`
uniform float uTime, uLampPhase; uniform vec3 uCamL; uniform vec4 uLamps[4]; uniform vec3 uLampCol;
uniform vec4 uBlade;        // half gap between the leaves (m), gain, z of the doors, glow on the hall side
uniform vec3 uBladeCol, uAmbV;
uniform vec4 uEntry;        // rgb of the cool light that follows the viewer in through the entry, w = its z
varying vec3 vW, vN, vCol; varying vec2 vUv; varying vec4 vMat;
#include <fog_pars_fragment>
${Ke}
// 2:1 herringbone: x = distance to the brick's edge (cells), yz = brick id
vec3 herring(vec2 q){ vec2 c = floor(q), f = fract(q); float d = mod(c.x - c.y, 4.); vec2 lp, id;
  if (d < .5) { lp = f; id = c; } else if (d < 1.5) { lp = vec2(f.x + 1., f.y); id = c - vec2(1., 0.); }
  else if (d < 2.5) { lp = vec2(f.y + 1., f.x); id = c - vec2(0., 1.) + .5; } else { lp = vec2(f.y, f.x); id = c + .5; }
  return vec3(min(min(lp.x, 2. - lp.x), min(lp.y, 1. - lp.y)), id); }
// distance to the centre lines of the cedar strapwork (squares, diamonds and their diagonals on a 2.9 m repeat)
float strapD(vec2 u){
  vec2 p = (fract(u / 2.9) - .5) * 2.9; vec2 a = abs(p);
  float d = min(abs(max(a.x, a.y) - .95), abs((a.x + a.y) * .7071 - .95));
  return min(d, min(min(a.x, a.y) + step(max(a.x, a.y), .95) * 9., abs(a.x - a.y) * .7071 + step(max(a.x, a.y), .95) * 9.)); }
// The antechamber's mirror work: triangles of mirror, each a little out of true, near black until one lines the eye
// up with a lantern (a warm point) or with the hall beyond the doors (a cold one); a share of them carries the room's
// second reflections and blazes as the reflected ray sweeps by, so the sparks run along the walls with the eye.
// rgb = the facet's colour, a = 0 on the grout between facets.
vec4 mosaic(vec2 uv, vec3 P, vec3 N, vec3 V, float px, float hallK){
  float s = .5 * exp2(ceil(log2(max(2.4 * px / .5, 1.))));
  vec2 p = uv / s; vec2 q = vec2(p.x - p.y * .57735, p.y * 1.1547);
  vec2 ic = floor(q), f = fract(q); float up = step(1., f.x + f.y);
  vec2 id = ic + up * vec2(.37, .61); vec3 hs = h23(id + 11.1);
  float e = mix(min(min(f.x, f.y), 1. - f.x - f.y), min(min(1. - f.x, 1. - f.y), f.x + f.y - 1.), up) * s * .866;
  vec2 lq = f - mix(vec2(1. / 3.), vec2(2. / 3.), up); vec2 l = vec2(lq.x + lq.y * .5, lq.y * .866);
  float near = smoothstep(3.5, 8., s / px);
  vec3 hv = hs * 2. - 1.;
  vec3 n = N + (.32 * (.25 + 1.5 * hs.z * hs.z)) * (hv - N * dot(hv, N)); n /= max(length(n), 1e-3);
  vec3 r = reflect(V, n);
  vec2 sq = l - (hs.xy - .5) * .2;
  float spot = mix(.5, 2.6 * exp(-dot(sq, sq) * 24.), near);       // a wide plate holds its glint as a point
  vec3 c = vec3(.012, .024, .024) * (.4 + hs.y) * (.6 + .4 * r.y);
  float lampK = 0.;
  for (int i = 0; i < 4; i++) {
    vec3 Lv = uLamps[i].xyz - P; float d2 = dot(Lv, Lv);
    float g = max(dot(r, Lv) * inversesqrt(d2 + 1e-3), 0.); g *= g; g *= g; g *= g; g *= g; g *= g; g *= g; g *= g; g *= g;
    float k = uLamps[i].w / (1. + d2 / 520.);
    c += uLampCol * (g * (.4 + k) * 2.2 * spot); lampK += k;
  }
  float pw = fract(hs.y * 31.7 + hs.x * 3.1);
  float ph = fract(hs.x * 9.73 + dot(r, vec3(1.31, .87, 1.13)) * 1.15 + uTime * (.012 + .03 * hs.z));
  float dph = abs(ph - .5) * 2.;
  float wH = .03 + .06 * min(lampK, 1.3);
  float hot = 1. - smoothstep(wH * .55, wH, dph);
  c += uLampCol * (hot * (.3 + 2.2 * pw * pw * pw) * spot * (.25 + .6 * min(lampK, 1.3)) + .006 * min(lampK, 1.5) * (.3 + hs.z));
  // the hall: cold silver and emerald points, more of them as the leaves swing
  float ph2 = fract(hs.z * 7.31 + dot(r, vec3(.9, 1.3, .7)) * 1.3 + uTime * .017);
  float wC = .012 + .14 * min(hallK, 1.);
  float cold = 1. - smoothstep(wC * .55, wC, abs(ph2 - .5) * 2.);
  vec3 cc = uBladeCol * mix(vec3(1.), vec3(.4, 1.25, .9), step(.66, fract(hs.x * 91.7)));
  c += cc * (cold * (.5 + 3. * fract(pw * 7.3)) * spot * (.3 + hallK));
  // a facet that throws the eye into the doorway holds a point of the hall's glitter, one in four of them
  float tz = (uBlade.z - P.z) / max(r.z, 1e-3); vec3 H = P + r * tz;
  float inD = step(1e-3, r.z) * (1. - smoothstep(8.3, 9.6, abs(H.x))) * smoothstep(0., 1.5, H.y) * (1. - smoothstep(24., 27., H.y)) * step(P.z, uBlade.z - 1.);
  c += cc * (inD * (step(.76, fract(hs.y * 17.3 + hs.z * 5.)) * (.4 + 2.4 * fract(pw * 3.7)) * spot * mix(.55, 1., near) + .014) * (.45 + .35 * clamp(uBlade.x / 9., 0., 1.)));
  float gw = max(.03 * sqrt(s), px * .6);
  return vec4(c, smoothstep(gw * .5, gw * 1.5, e)); }
void main(){
  vec3 N = vN / max(length(vN), 1e-4); vec3 Vd = vW - uCamL; vec3 V = Vd / max(length(Vd), 1e-3);
  if (dot(N, V) > 0.) N = -N;
  float kind = vMat.x; vec2 u = vUv; vec2 fw = fwidth(u); float px = max(max(fw.x, fw.y), 1e-4);
  vec3 alb = vCol, emis = vec3(0.); float gloss = 0., tilt = 0., flank = 0., mir = 0., rib = 0., polish = 0., mao = 1.;
  vec3 STUCCO = vec3(.5, .52, .53);
  if (kind < .5) {
    float cs = .62; vec3 hb = herring(u / cs); float aa = px / cs;
    float hsh = h21(hb.yz); float mort = smoothstep(.05 - aa, .05 + aa, hb.x);
    alb *= mix(.42, .7 + .55 * hsh, mort) * (.85 + .3 * vnoise(u * 2.3));
    alb = mix(alb, alb * vec3(.8, .95, 1.15), step(.8, fract(hsh * 7.3)));
    tilt = (hsh - .5) * mort;
    // three bays a side hold a tall pointed panel of mirror work in a stucco frame
    float bz = vW.z + 220.; float bay = floor(bz / 20.); float zb = bz - bay * 20. - 10.; float az = abs(zb);
    float dA = min(min(8. - az, vW.y - 3.4), 16.1 - 4.6 * az * az / 64. - vW.y);
    dA = mix(-9., dA, step(-.5, bay) * step(bay, 2.5));
    if (dA > -.5) { alb = STUCCO * (.72 + .28 * sin(clamp((dA + .5) / .5, 0., 1.) * 3.1416)) * (.9 + .1 * vnoise(u * .9)); tilt = 0.; }
    if (dA > 0.) { mir = 1.; mao = .45 + .55 * smoothstep(0., 1.2, dA);
      vec2 dg = abs(fract(vec2(u.x + u.y, u.x - u.y) / 4.2) - .5) * 2.97;
      rib = 1. - smoothstep(.1 - px, .1 + px, min(dg.x, dg.y)); }
  } else if (kind < 1.5) {
    float row = floor(u.y / .5); vec2 bq = vec2(u.x / 1.3 + .5 * mod(row, 2.), u.y / .5); vec2 bf = fract(bq);
    float e = min(min(bf.x, 1. - bf.x) * 1.3, min(bf.y, 1. - bf.y) * .5); float hsh = h21(floor(bq));
    float mort = smoothstep(.03 - px, .03 + px, e);
    alb *= mix(.42, .68 + .5 * hsh, mort) * (.85 + .3 * vnoise(u * 2.3));
    tilt = (hsh - .5) * mort;
    // the vault: diamonds of mirror work let into the brick, each in a stucco fillet
    vec2 fc = abs(fract(vec2(u.x + u.y, u.x - u.y) / 6.8) - .5); float dc = (.5 - max(fc.x, fc.y)) * 4.8;
    if (dc > .5) { alb = STUCCO * (.72 + .28 * sin(clamp((dc - .5) / .34, 0., 1.) * 3.1416)); tilt = 0.; }
    if (dc > .84) { mir = 1.; mao = .5 + .5 * smoothstep(.84, 1.8, dc); }
  } else if (kind < 2.5) {
    float row = floor(u.y / 3.4); vec2 bq = vec2(u.x / 4.4 + .5 * mod(row, 2.) + .25, u.y / 3.4); vec2 bf = fract(bq);
    float e = min(min(bf.x, 1. - bf.x) * 4.4, min(bf.y, 1. - bf.y) * 3.4); float hsh = h21(floor(bq) + 3.);
    float joint = smoothstep(.05 - px, .08 + px, e);
    alb *= (.5 + .34 * hsh) * (.7 + .5 * vnoise(u * .9 + 7.)) * mix(.45, 1., joint);
    alb *= 1. - .35 * smoothstep(5.5, 1.5, abs(u.x)) * vnoise(u * .35);        // worn down the middle
    polish = joint * (.45 + .55 * hsh) * (.6 + .4 * vnoise(u * .6 + 3.)); tilt = (hsh - .5) * .12;
    float hw = 3.1; float bd = hw - abs(u.x);
    if (bd > 0.) {      // the runner
      float st = .4; vec2 c = vec2(u.x, mod(u.y, 6.4) - 3.2); vec2 cs = (floor(c / st) + .5) * st;
      float ring = fract((abs(cs.x) * .9 + abs(cs.y)) / 2.4);
      vec3 kc = ring < .25 ? vec3(.55, .5, .38) : (ring < .55 ? vec3(.36, .03, .05) : (ring < .78 ? vec3(.5, .34, .1) : vec3(.03, .05, .2)));
      kc = bd < .9 ? (bd < .22 ? vec3(.55, .5, .38) : (bd < .5 ? vec3(.03, .05, .2) : vec3(.42, .27, .08))) : kc;
      alb = kc * (.66 + .16 * mix(.5, vnoise(u * vec2(9., 26.)), clamp(.06 / px, 0., 1.))) * smoothstep(0., .05 + px, bd);
      alb = mix(vCol * .25, alb, smoothstep(0., .12 + px, bd));
      polish = 0.; tilt = 0.;
    }
  } else if (kind < 3.5) {
    float grain = vnoise(vec2(u.x * 7., u.y * .55)) * .6 + vnoise(vec2(u.x * 19., u.y * 1.3)) * .4;
    alb *= .6 + .6 * grain;
    float d = strapD(u);
    float aa = px * 1.2; float hwS = max(.13, px * .8); float strap = 1. - smoothstep(hwS - aa, hwS + aa, d);
    // the panels between stiles and rails are pierced: the hall shows through the strapwork before the leaves move
    if (vMat.y > 1.5 && strap < .5) discard;
    float edge = (1. - smoothstep(.13, .2 + aa, d)) - strap;
    alb *= mix(.55, 1.25, strap) * (1. - .5 * edge);
    alb *= .8 + .2 * smoothstep(0., 2.5, u.y);
    // the flank of each strap that is turned to the hall (aMat.w = which way that is along the leaf)
    float sh = max(.07, px * 1.5);
    flank = max(strap - (1. - smoothstep(.13 - aa, .13 + aa, strapD(u + vec2(vMat.w * sh, 0.)))), 0.) * abs(vMat.w);
  } else if (kind < 4.5) {
    gloss = 1.; alb *= .55 + .45 * vnoise(u * 5.);
  } else if (kind < 5.5) {
    alb *= .8 + .2 * mix(.5, vnoise(u * vec2(30., 9.)), clamp(.05 / px, 0., 1.));
    alb *= .75 + .25 * sin(u.y * 9. + sin(u.x * 3.) * 1.5);
  } else if (kind < 6.5) {
    float row = floor(u.y / 2.1); vec2 bq = vec2(u.x / 3.3 + .5 * mod(row, 2.), u.y / 2.1); vec2 bf = fract(bq);
    float e = min(min(bf.x, 1. - bf.x) * 3.3, min(bf.y, 1. - bf.y) * 2.1);
    alb *= (.72 + .3 * h21(floor(bq) + 11.)) * (.75 + .35 * vnoise(u * 1.4)) * mix(.5, 1., smoothstep(.03 - px, .06 + px, e));
  } else if (kind < 7.5) {
    vec2 c = vec2(fract(u.x) - .5, fract(u.y * 3.) - .5); vec2 a = abs(c);
    float star = min(max(a.x, a.y) - .23, (a.x + a.y) * .7071 - .23);
    float dots = length(vec2(fract(u.x + .5) - .5, fract(u.y * 3. + .5) - .5)) - .1;
    float aw = px * 1.5 + .015;
    float hole = 1. - smoothstep(-aw, aw, min(star, dots));
    float fk = .82 + .18 * sin(uTime * 13.) * sin(uTime * 7.3 + 1.);
    emis = uLampCol * (hole * 1.5 * fk);
    alb *= (1. - hole) * .7; gloss = 1.;
  } else {
    // the wall round the doors: mirror work from floor to vault, held in a net of stucco ribs
    mir = 1.; alb = STUCCO;
    vec2 dg = abs(fract(vec2(u.x + u.y, u.x - u.y) / 4.2) - .5) * 2.97;
    rib = 1. - smoothstep(.1 - px, .1 + px, min(dg.x, dg.y));
    rib = max(rib, 1. - smoothstep(.35 - px, .35 + px, min(abs(abs(u.x) - 9.9), abs(u.y - 26.6) + step(9.9, abs(u.x)) * 9.)));
  }
  N = normalize(N + tilt * .35 * vec3(.6, .3, .6));
  vec3 R = reflect(V, N);
  // the lanterns: a warm flame behind pierced brass, so each throws a soft lattice that fades with distance
  float fl = .9 + .1 * sin(uTime * 13.) * sin(uTime * 7.3 + 1.);
  float lampD = 0., lampS = 0.;
  for (int i = 0; i < 4; i++) {
    vec3 Lv = uLamps[i].xyz - vW; float d2 = dot(Lv, Lv); vec3 Ld = Lv * inversesqrt(d2 + 1e-3);
    float az = atan(-Ld.z, -Ld.x + 1e-5) + uLampPhase + float(i) * 1.7; float el = asin(clamp(-Ld.y, -1., 1.));
    float dap = 1. - (.6 / (1. + d2 / 70.)) * (.5 - .5 * sin(az * 11.) * sin(el * 11. + 1.));
    float k = uLamps[i].w * fl / (1. + d2 / 440.);
    lampD += max(dot(N, Ld), 0.) * dap * k;
    float sp = max(dot(R, Ld), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; lampS += sp * k;
  }
  float brick = (1. - step(1.5, kind)) * (1. - mir);          // dark brick needs more light than stone to read at all
  vec3 L = uAmbV * (.7 + .3 * N.y) * (.5 + .5 * vMat.z) + uLampCol * (lampD * .2 * (1. + .6 * brick));
  // cool light from the entry behind the viewer: the near walls and vault read, the far end stays dark
  vec3 Ev = vec3(0., 10., uEntry.w) - vW; float e2 = dot(Ev, Ev);
  L += uEntry.rgb * ((.3 + .7 * max(dot(N, Ev) * inversesqrt(e2 + 1e-3), 0.)) * (1. + 1.3 * brick) / (1. + e2 / 900.)) * step(vW.z, uBlade.z + .5);
  // the hall's light: through the pierced leaves and the gap between them, a tall slit on the axis that widens as they swing
  vec3 Bv = vec3(0., 13. + (clamp(vW.y, 0., 26.) - 13.) * .35, uBlade.z) - vW; float b2 = dot(Bv, Bv); vec3 Bd = Bv * inversesqrt(b2 + 1e-3);
  float D = max(uBlade.z - vW.z, 0.); float wdt = uBlade.x * 1.15 + D * .045 + .35;
  float inb = exp(-vW.x * vW.x / (wdt * wdt)); float open = clamp(uBlade.x / 9., 0., 1.);
  float glit = .6 + 1.1 * vnoise(vW.xz * 1.9 + vec2(0., uTime * .7)) * vnoise(vW.xz * .6 + vW.y * .5 - uTime * .2);
  float ndb = max(dot(N, Bd), 0.); float geo = mix(ndb, .35 + .65 * ndb, max(N.y, 0.));      // floors take the slit's light from its whole height
  float bl = uBlade.y * (inb * (.5 + .5 * open) * 1.5 + open * .25 + .1) * (1. - .55 * open) * geo / (1. + b2 / 3500.) * smoothstep(0., 7., D);
  L += uBladeCol * (bl * glit);
  // past the threshold the hall lights things from within: what is turned to it takes the light (the proud edges of
  // stiles and rails, the flanks of the strapwork, the bosses), the broad faces of the leaves stay dark silhouettes
  vec3 Hv = vec3(0., 16., uBlade.z + 62.) - vW; vec3 Hd = Hv * inversesqrt(dot(Hv, Hv) + 1e-3);
  float hn = max(dot(N, Hd), 0.); float inHall = step(uBlade.z + .5, vW.z) * uBlade.w;
  L += uBladeCol * (inHall * (.05 + 1.6 * hn * hn * hn * hn + 2.6 * flank));
  vec3 col = alb * L + emis;
  if (mir > .5) {
    float hallK = kind > 7.5 ? .75 + .25 * open : (.3 + .7 * open) * smoothstep(0., 6., D) / (1. + b2 / 2600.);
    vec4 m = mosaic(u, vW, N, V, px, hallK);
    col = mix(mix(STUCCO * L * .22, m.rgb * mao, m.a), STUCCO * L * (.7 + .3 * mao), rib);
  }
  if (polish > .001) {
    // worn stone polished by slippers: it gives back the doorway and the lanterns as long soft streaks
    vec3 nf = normalize(vec3((vnoise(u * 1.3) - .5) * .05, 1., (vnoise(u * 1.3 + 9.) - .5) * .05) + (N - vec3(0., 1., 0.)));
    vec3 Rf = reflect(V, nf); float fr = 1. - max(dot(-V, nf), 0.); float Fz = .2 + .8 * fr * fr * fr;
    float tz = (uBlade.z - vW.z) / max(Rf.z, 1e-3); vec3 H = vW + Rf * tz;
    float inD = (1. - smoothstep(8.3, 9.6, abs(H.x))) * smoothstep(0., 1.5, H.y) * (1. - smoothstep(23.5, 27., H.y)) * step(1e-3, Rf.z) * step(vW.z, uBlade.z);
    float gap = 1. - smoothstep(uBlade.x * .8, uBlade.x + .9, abs(H.x));
    float gl = .5 + 1.1 * vnoise(H.xy * 1.6 + vec2(0., uTime * .5)) * vnoise(H.xy * .5 - uTime * .15);
    vec3 rc = uBladeCol * (inD * (gap * 2.8 + (1. - gap) * 1.5) * gl);
    for (int i = 0; i < 4; i++) {
      vec3 Lv = uLamps[i].xyz - vW; float t = max(dot(Lv, Rf), 0.); vec3 mm = Lv - Rf * t; float rad = .8 + .07 * t;
      rc += uLampCol * (uLamps[i].w * 2.4 * exp(-dot(mm, mm) / (rad * rad)) * step(1e-3, t));
    }
    col += rc * (Fz * min(polish * 1.5, 1.));
  }
  col += gloss * vCol * (uLampCol * (lampS * 1.6) + uBladeCol * (bl * pow(max(dot(R, Bd), 0.), 10.) * 2. + inHall * pow(max(dot(R, Hd), 0.), 8.) * 5.));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,ko=`
varying vec3 vQ;
void main(){
  vQ = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`,Co=`
uniform float uTime; uniform vec3 uCamL, uBladeCol; uniform vec4 uBlade; varying vec3 vQ;
${Ke}
void main(){
  float open = clamp(uBlade.x / 9., 0., 1.); float fade = 1. - smoothstep(.1, .5, open);
  vec2 g = vQ.xy * 2.3; vec2 c = floor(g), f = fract(g) - .5; float h = h21(c);
  float ph = fract(h * 13.7 + (uCamL.z * .05 + uCamL.x * .09) * (1. + h) + uTime * .11);
  float on = (1. - smoothstep(0., .2, abs(ph - .5))) * (1. - smoothstep(.1, .44, max(abs(f.x), abs(f.y))));
  float vy = smoothstep(0., 1.5, vQ.y) * (1. - smoothstep(26., 28., vQ.y)) * (1. - smoothstep(11., 13., abs(vQ.x)));
  float mid = exp(-vQ.x * vQ.x / 9.);
  vec3 col = uBladeCol * ((on * (1.6 + 6. * fract(h * 57.3)) + .3 + .2 * vnoise(vQ.xy * .35 + uTime * .1)) * (.8 + .9 * mid) * (vy * fade));
  col = mix(col, col * vec3(.45, 1.2, .9), step(.7, fract(h * 91.7)));
  gl_FragColor = vec4(col, 1.);
}`,Mo=`
attribute vec3 aWin;        // side (+1 = the wall at x > 0), z of the window's centre, id
varying vec3 vP, vWin;
#include <fog_pars_vertex>
void main(){
  vP = position; vWin = aWin;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Po=`
uniform float uTime, uStain, uSnow, uStar; uniform vec3 uCamL;
uniform vec3 uSkyTop, uSkyBot, uTree, uLattice, uOrbCol; uniform vec4 uOrb;
uniform vec3 uFwPos[2]; uniform vec3 uFwCol[2]; uniform vec2 uFwAge, uFwRad;
varying vec3 vP, vWin;
#include <fog_pars_fragment>
${Ke}
float cypress(vec2 q, float sp, float seed){
  float id = floor(q.x / sp); float fx = (fract(q.x / sp) - .5) * sp;
  float ha = h21(vec2(id, seed)), hb = h21(vec2(id + 31., seed));
  float h = mix(19., 37., ha), w = mix(1.5, 2.7, hb) * step(.14, hb);
  float yy = clamp(q.y / h, 0., 1.);
  float sway = sin(uTime * .7 + id * 1.7 + seed) * 1.1 * yy * yy;
  float hwd = w * pow(max(1. - yy, 0.), .6) * (.55 + .45 * smoothstep(0., .25, yy)) + .22 * sin(q.y * 1.9 + id * 5.) * (1. - yy);
  return (1. - smoothstep(hwd - .2, hwd + .25, abs(fx - sway))) * step(q.y, h); }
${yo}
float flakes(vec2 q, float sc, float sp, float seed){
  q.y += uTime * sp; q.x += sin(q.y * .3 + seed) * .6;
  vec2 c = floor(q / sc), f = fract(q / sc) - .5; vec3 h = h23(c + seed * 17.);
  float r = .1 + .13 * h.z;
  return (1. - smoothstep(r * .5, r, length(f - (h.xy - .5) * .6))) * step(.2, h.z); }
// one shell of a chrysanthemum: n thin streaks from the middle out to a ring of bright heads (pu = one pixel, burst units)
float petals(vec2 pp, float n, float R, float seed, float age, float pu){
  float r = length(pp); float ang = atan(pp.y, pp.x + 1e-5) / 6.2832 + seed * .37;
  float si = floor(ang * n + .5); float sp = abs(ang * n - si); float hs = h21(vec2(si, seed));
  float Rs = R * (.72 + .28 * hs);
  float arc = sp * r * 6.2832 / n;                             // distance from the streak's axis
  float w = .2 + pu * .6;
  float streak = (1. - smoothstep(w * .5, w * 1.5, arc)) * clamp(.3 / w, .35, 1.);
  float along = smoothstep(Rs * .12, Rs * .8, r) * (1. - smoothstep(Rs, Rs * 1.03 + .3, r));
  float dr = r - Rs; float hw = .5 + pu * pu;
  float head = exp(-(dr * dr + arc * arc) / hw);
  float glit = .5 + .5 * sin(r * 4. - age * 20. + si * 2.4);
  return streak * along * (.6 + glit) * 2.2 + head * 6. * (.65 + .35 * sin(uTime * 30. + si * 7.)); }
vec4 burst(vec3 V, vec3 C, vec3 col, float age, float rad, float pu){
  if (age < 0. || age > 1.6) return vec4(0.);
  float sc = max(rad, 1.) / 17.;
  vec3 L = C - uCamL; float t = max(dot(L, V), 0.); vec3 m = V * t - L;
  vec3 ux = cross(V, vec3(0., 1., 0.)); ux /= max(length(ux), 1e-3); vec3 uy = cross(ux, V);
  vec2 pp = vec2(dot(m, ux), dot(m, uy)) / sc + vec2(0., age * age * 2.);
  float r = length(pp); float R = 17. * (1. - exp(-age * 5.)) + .5;
  float env = smoothstep(0., .2, age) * (1. - smoothstep(.35, 1.5, age));
  float core = exp(-r * r / 22.) * (1. - smoothstep(0., .4, age)) * 1.6;
  float f = petals(pp, 22., R, C.z * .13 + 1., age, pu) + .7 * petals(pp, 13., R * .56, C.z * .13 + 5., age, pu);
  // alpha: the dusk behind the shell goes dark for as long as it burns, so the streaks read against it
  return vec4(col * ((f + .1 * exp(-r * r / 150.)) * env + core) + vec3(1.) * (max(f - 3., 0.) * .5 * env), .62 * env * exp(-r * r / 260.)); }
void main(){
  vec3 Vd = vP - uCamL; vec3 V = Vd / max(length(Vd), 1e-3);
  float s = vWin.x, zb = vP.z - vWin.y; float ax = max(abs(V.x), .04);
  vec2 q = vec2(zb / 2.4 + .5, (vP.y - 9.) / 2.4); vec2 fwq = fwidth(q); float aa = max(max(fwq.x, fwq.y), 1e-4);
  vec3 sky = mix(uSkyBot, uSkyTop, smoothstep(-.06, .34, V.y));
  float ts = 400. / ax;
  vec2 qs = vec2(vP.z + V.z * ts, vP.y + V.y * ts) - vec2(vWin.y + (h21(vec2(vWin.z, 3.)) - .5) * 70., 150. + 70. * h21(vec2(vWin.z, 9.)));
  float ds = dot(qs, qs);
  sky += uStar * vec3(.9, 1., 1.1) * (exp(-ds / 12.) * 3. + exp(-ds / 220.) * .3) * (.8 + .2 * sin(uTime * 3. + vWin.z * 2.));
  float co = max(dot(V, uOrb.xyz), 0.); float c2 = co * co; c2 *= c2; c2 *= c2; c2 *= c2;
  sky += uOrbCol * (smoothstep(1. - uOrb.w, 1. - uOrb.w * .6, co) * 2.5 + c2 * c2 * .6 + c2 * .08);
  float t1 = 58. / ax; vec2 q1 = vec2(vP.z + V.z * t1, vP.y + V.y * t1 + 4.);
  vec3 col = mix(sky, mix(uTree, sky, .45), max(cypress(q1, 13., 5.), 1. - smoothstep(2., 5., q1.y)));
  float t2 = 26. / ax; vec2 q2 = vec2(vP.z + V.z * t2, vP.y + V.y * t2 + 2.);
  col = mix(col, uTree, max(cypress(q2, 9., 1.), 1. - smoothstep(3., 6., q2.y)));
  float pu = min(fwq.y * 7.8, 3.);
  vec4 b0 = burst(V, uFwPos[0], uFwCol[0], uFwAge.x, uFwRad.x, pu), b1 = burst(V, uFwPos[1], uFwCol[1], uFwAge.y, uFwRad.y, pu);
  col = col * ((1. - b0.a) * (1. - b1.a)) + b0.rgb + b1.rgb;
  if (uSnow > .001) {
    float ta = 7. / ax, tb = 15. / ax, tc = 30. / ax;
    float f = flakes(vec2(vP.z + V.z * ta, vP.y + V.y * ta), 1.1, 3.4, 1.) + .7 * flakes(vec2(vP.z + V.z * tb, vP.y + V.y * tb), 1.4, 2.6, 2.)
      + .5 * flakes(vec2(vP.z + V.z * tc, vP.y + V.y * tc), 1.9, 2., 3.);
    col = mix(col, uSkyBot * 1.2 + vec3(.02), .25 * uSnow) + uSnow * vec3(.5, .58, .7) * f;
  }
  // the sash: stars, crosses and diamonds of stained glass in leads (the hero's own pattern, so floor, water and
  // mirrors carry the same colours), two mullions, a transom and a frame
  vec4 gl = mmGlass(q, s, aa, uStain);
  float glass = gl.a * smoothstep(.06 - aa, .06 + aa, min(abs(q.x + 1.), abs(q.x - 2.))) * smoothstep(.06 - aa, .06 + aa, abs(q.y - 4.));
  glass *= smoothstep(.07 - aa, .07 + aa, (6. - abs(zb)) / 2.4) * smoothstep(.06 - aa, .06 + aa, q.y);
  vec3 tint = gl.rgb * (.9 + .1 * vnoise(q * 9.));
  col = mix(uLattice, col * tint, glass);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,zo=`
attribute vec4 aC;          // side, phase, 0 at the rod .. 1 at the hem, 0..1 across the panel
uniform float uTime;
varying vec3 vP; varying vec4 vC;
#include <fog_pars_vertex>
void main(){
  vec3 p = position; float v = aC.z;
  float folds = sin(aC.w * 22. + aC.y * 5.) * .22 + sin(aC.w * 9. + 1.3) * .12;
  float breath = .5 + .5 * sin(uTime * .55 + aC.y * 6.283);
  float wave = sin(uTime * 1.3 + aC.y * 9. - v * 5. + aC.w * 3.);
  float push = v * v * (1.3 * breath + .4 * wave) + folds * (.4 + .6 * v);
  p.x -= aC.x * (push + .15);
  p.z += v * v * .3 * sin(uTime * .8 + aC.y * 4.);
  vP = p; vC = aC;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Fo=`
uniform vec3 uWinTop, uWinBot, uGauze; uniform float uBack;
uniform vec3 uBurstPos[2]; uniform vec3 uBurstCol[2];
varying vec3 vP; varying vec4 vC;
#include <fog_pars_fragment>
${Pt}
void main(){
  vec3 N = cross(dFdx(vP), dFdy(vP)); N /= max(length(N), 1e-6);
  if (N.x * vC.x > 0.) N = -N;
  vec3 L = softLight(vP, N);
  float zb = mod(vP.z + 30., 60.) - 30.; float hd = 27.5 - 5.5 * (zb * zb / 36.);
  float inwin = (1. - smoothstep(5.2, 6.4, abs(zb))) * smoothstep(8.5, 10., vP.y) * (1. - smoothstep(hd - 1.5, hd + .5, vP.y));
  vec3 back = mix(uWinBot, uWinTop, clamp((vP.y - 9.) / 18., 0., 1.)) * ((vC.x > 0. ? uWinGain.y : uWinGain.x) * uBack);
  float fold = .6 + .4 * abs(N.x);
  vec3 b0 = uBurstPos[0] - vP, b1 = uBurstPos[1] - vP;
  vec3 fwg = uBurstCol[0] * (.2 / (1. + dot(b0, b0) / 700.)) + uBurstCol[1] * (.2 / (1. + dot(b1, b1) / 700.));
  vec3 col = uGauze * (L * 1.4 * fold + (back * inwin + fwg * mix(.3, 1., inwin)) * (.45 + .55 * fold));
  float a = mix(.82, .5, abs(N.x)) * smoothstep(0., .02, vC.z);
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,So=`
attribute vec4 iP, iQ;      // x, z, phase, size;  kind (0 afloat, 1 falling), drift, spin, tint
uniform float uTime; uniform vec3 uCamL;
varying vec2 vQ; varying vec3 vP, vN; varying float vT;
#include <fog_pars_vertex>
void main(){
  float ph = iP.z, size = iP.w; vec3 c, ax, ay;
  float ang = ph * 6.283 + uTime * iQ.z;
  if (iQ.x < .5) {
    c = vec3(iP.x, ${ee.toFixed(2)} + .04, iP.y);
    c.xz += iQ.y * vec2(sin(uTime * .09 + ph * 6.283), cos(uTime * .07 + ph * 4.1));
    vec2 d = c.xz - uCamL.xz; float dl = max(length(d), 1e-3);
    float push = (1. - smoothstep(2.5, 10., dl)) * (1. - smoothstep(5., 14., uCamL.y));
    c.xz += d / dl * (push * 3.5); ang += push * 2.5;
    float lim = clamp(35.355 - abs(c.z), 11., 25.) - .7;
    c.x = clamp(c.x, -lim, lim);
    c.y += .015 * sin(uTime * 1.3 + c.x * .8 + c.z * .5) + .1 * size * dot(position.xy, position.xy);
    ax = vec3(cos(ang), 0., sin(ang)); ay = vec3(-sin(ang), 0., cos(ang));
  } else {
    float f = fract(uTime * .03 * (.6 + .8 * fract(ph * 7.1)) + ph);
    c = vec3(iP.x + 1.6 * sin(uTime * .5 + ph * 30.), mix(46., ${ee.toFixed(2)} + .1, f), iP.y + 1.6 * cos(uTime * .43 + ph * 17.));
    // the kit's near law for petals (nothing at 0.6 m, whole from 2.5 m): a falling petal dwindles before the lens, never a flat shape across it
    size *= smoothstep(.6, 2.5, length(cameraPosition - (modelMatrix * vec4(c, 1.)).xyz));
    float tb = uTime * 1.7 + ph * 40.;
    ax = vec3(cos(ang), 0., sin(ang)); ay = vec3(-sin(ang) * cos(tb), sin(tb), cos(ang) * cos(tb));
  }
  vec3 wp = c + (ax * position.x + ay * position.y) * size;
  vN = cross(ay, ax); vQ = position.xy * 2.; vP = wp; vT = iQ.w;
  vec4 mvPosition = modelViewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,To=`
uniform vec3 uCamL;
varying vec2 vQ; varying vec3 vP, vN; varying float vT;
#include <fog_pars_fragment>
${Pt}
void main(){
  float d = length(vec2(vQ.x, vQ.y * .85 + .14 * abs(vQ.x)));
  if (d > .95) discard;
  vec3 N = vN / max(length(vN), 1e-4); if (dot(N, vP - uCamL) > 0.) N = -N;
  vec3 alb = (vT < .42 ? vec3(.62, .045, .09) : (vT < .76 ? vec3(.86, .34, .44) : vec3(.86, .84, .78))) * (.7 + .3 * (1. - d)) * (.85 + .15 * smoothstep(-.9, .6, vQ.y));
  gl_FragColor = vec4(alb * (softLight(vP, N) * 1.7 + uAmb * .6), 1.);
  #include <fog_fragment>
}`,Lo=`
attribute vec4 iW, iK;      // x, y, z, phase;  kind (0 jet, 1 ring on the water, 2 steam), size, rate, rise
uniform float uTime; uniform vec3 uCamL;
varying vec2 vQ; varying vec3 vP; varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  float k = iK.x, ph = iW.w, size = iK.y; vec3 c = iW.xyz, wp; float t = fract(uTime * iK.z + ph);
  vec3 tc = uCamL - c; vec3 rt = cross(vec3(0., 1., 0.), tc); rt /= max(length(rt), 1e-3);
  if (k > .5 && k < 1.5) { wp = c + vec3(position.x, 0., position.y) * (size * (.6 + 4.4 * t)); }
  else if (k < .5) { wp = c + rt * (position.x * size) + vec3(0., (position.y + .5) * size * 1.25, 0.); }
  else {
    c += vec3(.35 * sin(ph * 40. + uTime * .7) * t, t * iK.w, .35 * cos(ph * 23. + uTime * .6) * t);
    vec3 up = cross(tc, rt); up /= max(length(up), 1e-3);
    wp = c + (rt * position.x + up * position.y) * (size * (.4 + 1.5 * t));
  }
  vQ = position.xy * 2.; vP = wp; vK = vec3(k, t, ph);
  vec4 mvPosition = modelViewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Bo=`
uniform float uTime;
varying vec2 vQ; varying vec3 vP; varying vec3 vK;
#include <fog_pars_fragment>
${Ke}
${jt}
${Pt}
void main(){
  float k = vK.x, t = vK.y, a; vec3 L = softLight(vP, vec3(0., 1., 0.)) + uAmb * .5;
  if (k < .5) {
    float y = vQ.y * .5 + .5; float pulse = .8 + .2 * sin(uTime * 7. + vK.z * 20.);
    float top = .62 * pulse; float w = .78 * sqrt(max(1. - (y / top) * (y / top), 0.)) * (.55 + .45 * smoothstep(.0, .5, y / top));
    float n = vnoise(vec2(vQ.x * 6., y * 7. - uTime * 4. + vK.z * 10.));
    a = (1. - smoothstep(w - .3, w, abs(vQ.x))) * (.45 + .55 * n) * smoothstep(0., .05, y) * (.35 + .5 * (1. - smoothstep(0., .5, abs(vQ.x)))) ;
    L = L * 2.4 + vec3(.012, .02, .022);
  } else if (k < 1.5) {
    float r = length(vQ); a = (1. - smoothstep(0., .07, abs(r - .86))) * (1. - t) * (1. - t) * .4; L *= 1.6;
  } else {
    float r = length(vQ); a = exp(-r * r * 3.2) * (1. - t) * smoothstep(0., .18, t) * .34; L *= 1.5;
    a *= .6 + .4 * vnoise(vQ * 2. + vK.z * 9. + uTime * .3);
  }
  a *= 1. - mmFog();
  gl_FragColor = vec4(L * vec3(.9, .97, 1.) * a, a);
}`,Go=`
attribute vec3 aS; varying vec3 vS, vP;
#include <fog_pars_vertex>
void main(){
  vS = aS; vP = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ao=`
uniform float uTime, uStain; uniform vec3 uCamL, uShaftCol;
varying vec3 vS, vP;
#include <fog_pars_fragment>
${Ke}
${jt}
void main(){
  float edge = smoothstep(0., .1, vS.x) * smoothstep(0., .1, 1. - vS.x);
  float rays = .5 + .5 * sin(vS.x * 37. + vS.z * 5.) * sin(vS.x * 11. - vS.z * 3.);
  float dust = .55 + .45 * vnoise(vP.zy * .3 + vP.x * .2 + vec2(uTime * .09, -uTime * .06) + vS.z * 7.);
  float along = smoothstep(0., .05, vS.y) * (1. - .6 * vS.y) * (1. - smoothstep(.93, 1., vS.y));
  vec3 hs = h23(vec2(floor(vS.x * 8.), vS.z));
  vec3 st = hs.x < .34 ? vec3(1.5, .25, .32) : (hs.x < .67 ? vec3(.3, .5, 1.6) : vec3(.35, 1.3, .6));
  vec3 tint = mix(vec3(1.), st, uStain * .75 * step(.35, hs.y));
  float a = edge * (.35 + .65 * rays) * dust * along * smoothstep(1.5, 9., length(vP - uCamL)) * (1. - mmFog());
  gl_FragColor = vec4(uShaftCol * tint * a, 1.);
}`,Vo={dusk:{hero:"dusk",over:{amb:[.05,.07,.12],deep:ze("#0E3B33",.55)},skyTop:ze("#1C3556",2.6),skyBot:[.36,.56,.5],tree:[.004,.008,.012],lattice:[.05,.045,.035],orb:[0,1,0,1e-4],orbCol:[0,0,0],star:1,snow:0,stain:.85,fog:"#070D14",fogD:.0017,gauze:[.76,.74,.7],back:.55,exposure:1.14,bloom:.3,sat:1.1,tint:"#f6f5f0",shadow:"#04101a",bird:1,title:"Hall of a Million Mirrors"},noon:{hero:"noon",over:{deep:ze("#0E3B33",.7)},skyTop:[.3,.55,1.15],skyBot:[1.1,1.25,1.3],tree:[.012,.035,.03],lattice:[.1,.085,.05],orb:[-1,.8,.22,.004],orbCol:[3,2.9,2.6],star:0,snow:0,stain:1,fog:"#0b1216",fogD:.0015,gauze:[.82,.8,.74],back:.5,exposure:1,bloom:.28,sat:1.12,tint:"#fbf8f0",shadow:"#081018",shaft:[.085,.082,.07],bird:1.5,title:"Hall of a Million Mirrors, Noon"},moon:{hero:"moon",over:{amb:[.068,.092,.145],winFill:[.11,.16,.27],spark:[1.3,1.7,2.5],beamCol:[[.5,.66,1],[0,0,0]],caus:[.16,.27,.4],deep:[.004,.013,.032]},skyTop:[.035,.07,.17],skyBot:[.14,.22,.36],tree:[.002,.004,.008],lattice:[.03,.04,.06],orb:[-1,.42,.3,.0012],orbCol:[1.3,1.5,1.9],star:1.3,snow:0,stain:.6,fog:"#060b16",fogD:.0016,gauze:[.62,.7,.85],back:.9,exposure:1.3,bloom:.34,sat:1.04,tint:"#e6eeff",shadow:"#050a1c",shaft:[.016,.024,.042],bird:.6,title:"Hall of a Million Mirrors, Moonlight"},snow:{hero:"snow",over:{amb:[.064,.08,.105],winFill:[.11,.14,.19],deep:[.005,.016,.018]},skyTop:[.1,.13,.19],skyBot:[.3,.34,.4],tree:[.01,.014,.02],lattice:[.05,.05,.05],orb:[0,1,0,1e-4],orbCol:[0,0,0],star:0,snow:1,stain:.85,fog:"#090d13",fogD:.0018,gauze:[.76,.76,.76],back:.75,exposure:1.26,bloom:.32,sat:1.04,tint:"#f4f4f6",shadow:"#070c14",bird:.8,title:"Hall of a Million Mirrors, First Snow"}},Kt=[[0,9,-212],[0,9,-190],[0,9,-168],[0,8.6,-150],[-.3,6.6,-136],[-1.8,5.6,-124],[-3.8,5.3,-113],[-5.3,7.2,-102],[-8.2,10.6,-92.5],[-11,14.5,-84],[-13,19,-76.5],[-14.6,22.8,-69],[-15.4,24.6,-61],[-14.6,24.8,-52],[-11.5,23.6,-42.5],[-7.5,21.4,-33.5],[-6,20.5,-25],[-12,23,-17],[-19,27,-8],[-20.6,30,3],[-15.6,32,14.6],[0,33,20.2],[14,30.5,15.6],[21,25.5,8],[25,19.5,.5],[27,13.6,-7],[26,10.2,-13.5],[20.5,8.2,-24],[11,6,-38.5],[0,3.6,-45],[-13.5,3.7,-39.5],[-22.5,5,-24],[-25.5,6.5,-4],[-22,5.6,16],[-14,5,36],[-5,4.6,54],[0,4.8,72],[0,7.5,94],[0,10.6,112],[0,12,130],[0,12,180]];async function _o(t,u,h){const M=ze("#4A4640",1.25),g=[.2,.21,.22],l=[.04,.045,.05],w=ae-_e,k=(_e+ae)/2;t.add(de(2,10,(s,p,i)=>{i[0]=V(-H,H,s),i[1]=0,i[2]=V(_e,ae,p),i[3]=i[0],i[4]=i[2]}),{kind:2,col:[.22,.23,.25]});for(const s of[-1,1])t.add(de(10,2,(p,i,c)=>{c[0]=s*H,c[1]=i*ce,c[2]=V(_e,ae,p),c[3]=c[2]+s*3.1,c[4]=c[1]}),{kind:0,col:M,ao:(p,i)=>.55+.45*_(i,0,5)});t.add(de(20,10,(s,p,i)=>{const c=s*Math.PI;i[0]=H*Math.cos(c),i[1]=ce+H*Math.sin(c),i[2]=V(_e,ae,p),i[3]=i[2],i[4]=c*H}),{kind:1,col:M}),await h();const b=new e.Shape;b.moveTo(-H,0),b.lineTo(H,0),b.lineTo(H,ce),b.absarc(0,ce,H,0,Math.PI,!1),b.lineTo(-H,0);const a=new e.Path;a.moveTo(-9,0),a.lineTo(-9,26),a.lineTo(9,26),a.lineTo(9,0),a.lineTo(-9,0),b.holes.push(a),t.add(new e.ShapeGeometry(b,20),{p:[0,0,ae-.02],kind:8,col:M,uvFn:(s,p)=>{p[0]=s.x,p[1]=s.y}}),await h();for(const s of[-1,1])t.add(new e.BoxGeometry(1.3,26.2,1.1),{p:[s*9.65,13.1,ae-.55],kind:6,col:g,uvFn:(p,i)=>{i[0]=p.x+p.z,i[1]=p.y}}),t.add(new e.BoxGeometry(1.9,1.1,1.5),{p:[s*9.75,.55,ae-.75],kind:6,col:g,uvFn:(p,i)=>{i[0]=p.x+p.z,i[1]=p.y}}),t.add(new e.BoxGeometry(1.7,.8,1.35),{p:[s*9.7,22.4,ae-.68],kind:6,col:g,uvFn:(p,i)=>{i[0]=p.x+p.z,i[1]=p.y}});for(let s=_e+12;s<ae-8;s+=20){await h();const p=[[13.02,-.9],[12.25,-.9],[12.05,-.55],[12.05,.55],[12.25,.9],[13.02,.9]];t.add(de(22,p.length-1,(i,c,d)=>{const m=i*Math.PI,P=p[Math.round(c*(p.length-1))];d[0]=P[0]*Math.cos(m),d[1]=ce+P[0]*Math.sin(m),d[2]=s+P[1],d[3]=m*13,d[4]=P[1]+c*2}),{kind:6,col:g});for(const i of[-1,1])t.add(new e.BoxGeometry(.95,ce,1.8),{p:[i*12.53,ce/2,s],kind:6,col:g,ao:(c,d)=>.5+.5*_(d,-8.5,-3),uvFn:(c,d)=>{d[0]=c.z+c.x,d[1]=c.y}}),t.add(new e.BoxGeometry(1.25,.8,2.3),{p:[i*12.45,ce-.2,s],kind:6,col:g,uvFn:(c,d)=>{d[0]=c.z+c.x,d[1]=c.y}}),t.add(new e.BoxGeometry(1.3,1.1,2.4),{p:[i*12.4,.55,s],kind:6,col:g,uvFn:(c,d)=>{d[0]=c.z+c.x,d[1]=c.y}})}for(const s of[-1,1])t.add(new e.BoxGeometry(.35,.5,w),{p:[s*12.85,ce,k],kind:6,col:g,uvFn:(p,i)=>{i[0]=p.z,i[1]=p.y+p.x}});await h();const n=async(s,p,i)=>{const c=s*(H-.06),d=s>0?-Math.PI/2:Math.PI/2,m=new e.Shape;m.moveTo(-2.4,0),m.lineTo(2.4,0),m.lineTo(2.4,5.2),m.quadraticCurveTo(2.2,7.6,0,9),m.quadraticCurveTo(-2.2,7.6,-2.4,5.2),m.lineTo(-2.4,0),t.add(new e.ShapeGeometry(m,8),{p:[c,3.2,p],r:[0,d,0],kind:6,col:l,ao:(T,L)=>.35+.65*_(L,9,0),uvFn:(T,L)=>{L[0]=T.z,L[1]=T.y}});const P=m.getPoints(8).map(T=>new e.Vector3(T.x,T.y,0));t.add(new e.TubeGeometry(new e.CatmullRomCurve3(P,!1,"catmullrom",.1),40,.28,5,!1),{p:[c-s*.1,3.2,p],r:[0,d,0],kind:6,col:g,us:30,vs:1}),await h(),t.add(new e.BoxGeometry(1.5,.45,6),{p:[c-s*.7,3,p],kind:6,col:g,uvFn:(T,L)=>{L[0]=T.z,L[1]=T.y+T.x}}),t.add(new e.BoxGeometry(.9,.9,.7),{p:[c-s*.5,2.4,p-2.2],kind:6,col:g,uvFn:(T,L)=>{L[0]=T.z,L[1]=T.y+T.x}}),t.add(new e.BoxGeometry(.9,.9,.7),{p:[c-s*.5,2.4,p+2.2],kind:6,col:g,uvFn:(T,L)=>{L[0]=T.z,L[1]=T.y+T.x}});const G=c-s*.85,A=3.22;if(await h(),i==="ewer"){const T=[.34,.33,.2];t.add(D([[0,0],[.55,0],[.6,.12],[.3,.3],[.42,.55],[.85,1.1],[.95,1.6],[.78,2.1],[.36,2.55],[.24,3],[.3,3.35],[.5,3.6],[.44,3.7],[.2,3.62]],12),{p:[G,A,p],kind:4,col:T,us:4,vs:4});const L=new e.CatmullRomCurve3([new e.Vector3(.3,3.3,0),new e.Vector3(1.15,3.2,0),new e.Vector3(1.4,2.3,0),new e.Vector3(.95,1.5,0)]);t.add(new e.TubeGeometry(L,10,.09,5,!1),{p:[G,A,p],r:[0,Math.PI/2,0],kind:4,col:T});const R=new e.CatmullRomCurve3([new e.Vector3(-.8,1.4,0),new e.Vector3(-1.35,2.2,0),new e.Vector3(-1.45,3,0),new e.Vector3(-1.8,3.45,0)]);t.add(new e.TubeGeometry(R,10,.1,5,!1),{p:[G,A,p],r:[0,Math.PI/2,0],kind:4,col:T}),t.add(D([[0,0],[.9,0],[1.25,.25],[1.3,.34],[1.2,.34],[.85,.1],[0,.1]],12),{p:[G,A,p+1.9],kind:4,col:T,us:4,vs:2})}else{const T=ze("#0E3B33",1.6),L=ze("#C9D6E2",.5);for(let R=0;R<4;R++){const te=new e.SphereGeometry(1,10,6),N=1.9-R*.12;t.add(te,{p:[G,A+.28+R*.42,p+(u()-.5)*.25],s:[.62,.3,N],kind:5,col:R===3?L:T,us:3,vs:3})}t.add(new e.SphereGeometry(1,8,5),{p:[G-s*.1,A+2.1,p+.5],s:[.5,.34,.6],kind:5,col:L,us:3,vs:3})}await h()};await n(1,-190,"ewer"),await n(-1,-190,"cloak"),await n(-1,-170,"ewer"),await n(1,-170,"cloak");const r=[.5,.52,.53];for(const s of[-210,-190,-170])for(const p of[-1,1]){await h();const i=[];for(let c=0;c<=4;c++)i.push(new e.Vector3(-8.25,V(3.4,11.3,c/4),0));for(let c=1;c<12;c++){const d=-8.25+16.5*c/12;i.push(new e.Vector3(d,16.35-4.85*d*d/68,0))}for(let c=0;c<=4;c++)i.push(new e.Vector3(8.25,V(11.3,3.4,c/4),0));t.add(new e.TubeGeometry(new e.CatmullRomCurve3(i,!1,"catmullrom",.2),44,.3,5,!1),{p:[p*(H-.08),0,s],r:[0,p>0?-Math.PI/2:Math.PI/2,0],kind:6,col:r,us:40,vs:1}),t.add(new e.BoxGeometry(.75,.5,17.6),{p:[p*(H-.37),3.15,s],kind:6,col:g,uvFn:(c,d)=>{d[0]=c.z,d[1]=c.y+c.x}}),t.add(new e.BoxGeometry(.45,.3,16.9),{p:[p*(H-.22),2.78,s],kind:6,col:g,uvFn:(c,d)=>{d[0]=c.z,d[1]=c.y+c.x}})}}async function Yt(t,u,h){const M=[.135,.108,.088],g=[.1,.11,.13],l=(w,k,b,a)=>{k[0]=b,k[1]=a+13};for(const w of[.2,.5])t.add(new e.PlaneGeometry(le,Ve),{p:[u*le/2,Ve/2,w],kind:3,size:2,col:M,uvFn:l,w:u});for(const w of[.05,.65]){await h();const k=(a,n)=>t.add(new e.BoxGeometry(n,Ve,.22),{p:[u*a,Ve/2,w],kind:3,col:[.115,.092,.075],uvFn:(r,s,p,i)=>{s[0]=p*.37+50,s[1]=i}}),b=(a,n)=>t.add(new e.BoxGeometry(le,n,.22),{p:[u*le/2,a,w],kind:3,col:[.115,.092,.075],uvFn:(r,s,p,i)=>{s[0]=i*.37+80,s[1]=p}});k(.45,.9),k(le-.45,.9),b(.6,1.2),b(Ve-.5,1),b(8.9,.8),b(17.6,.8);for(const a of[.6,8.9,17.6,Ve-.5])for(let n=0;n<7;n++)t.add(new e.SphereGeometry(.2,6,4,0,re,0,Math.PI/2),{p:[u*(.9+n*1.25),a,w+(w<.3?-.1:.1)],r:[w<.3?-Math.PI/2:Math.PI/2,0,0],kind:4,col:g});await h();for(const a of[.45,le-.45])for(let n=0;n<9;n++)t.add(new e.SphereGeometry(.2,6,4,0,re,0,Math.PI/2),{p:[u*a,2.2+n*2.75,w+(w<.3?-.1:.1)],r:[w<.3?-Math.PI/2:Math.PI/2,0,0],kind:4,col:g})}for(const w of[3.2,13,22.8])t.add(new e.BoxGeometry(4.2,.5,.12),{p:[u*2.1,w,-.1],kind:4,col:g,uvFn:l});t.add(new e.TorusGeometry(.55,.09,5,14),{p:[u*(le-1.4),6.2,-.22],kind:4,col:g})}function Io(t,u){const h=[.2,.2,.15],M=12;for(let l=0,w=Math.floor((u-2.2)/.36);l<w;l++)t.add(new e.TorusGeometry(.16,.045,4,8),{p:[0,-.2-l*.36,0],r:[0,(l&1)*Math.PI/2,0],s:[1,1.35,1],kind:4,col:h});const g=-u;t.add(D([[.1,2.2],[.24,2.08],[.16,1.9],[.3,1.78],[.2,1.64],[.62,1.46],[.98,1.2],[1.04,1.06],[.96,1.02]],M),{p:[0,g,0],kind:4,col:h,us:8,vs:3}),t.add(D([[.94,-1.02],[1.12,-.62],[1.2,-.2],[1.2,.2],[1.12,.62],[.94,1.02]],M),{p:[0,g,0],kind:7,col:h,us:12,vs:2}),t.add(D([[.96,-1.02],[1.04,-1.06],[.98,-1.2],[.66,-1.44],[.28,-1.58],[.34,-1.74],[.16,-1.9],[.2,-2.04],[0,-2.3]],M),{p:[0,g,0],kind:4,col:h,us:8,vs:3});for(const[l,w]of[[1.04,1],[0,1.23],[-1.04,1]])t.add(new e.TorusGeometry(w,.045,5,24),{p:[0,g+l,0],r:[Math.PI/2,0,0],kind:4,col:h});for(let l=0;l<6;l++){const w=(l+.5)/6*re;t.add(D([[0,0],[.07,-.08],[.09,-.2],[0,-.38]],5),{p:[Math.cos(w)*1,g-1.1,Math.sin(w)*1],kind:4,col:h})}t.add(new e.TorusGeometry(.26,.05,4,10),{p:[0,g+2.42,0],kind:4,col:h})}const X=[.68,.6,.42],Eo=[.66,.63,.56],$t=[.66,.6,.46],Ro=[.03,.2,.12],ue=[.06,.2,.09],No=[.42,.03,.06],Wo=[.62,.44,.14],qo=[.04,.08,.3],Xt=[[0,0],[1,0],[1.1,.14],[.62,.42],[.5,.85],[.8,1.5],[1.4,2.4],[1.62,3.2],[1.45,4],[.9,4.75],[.52,5.3],[.5,5.7],[.78,6.05],[.86,6.12],[.7,6]],j=new e.Matrix4,Z=new e.Matrix4,pe=new e.Vector3,ut=new e.Quaternion,be=new e.Vector3,Ie=new e.Vector3,Zt=new e.Vector3(1,1,1);function Ee(t,u,h,M,g){be.set(u[0],u[1],u[2]),Ie.set(h[0],h[1],h[2]);const l=be.distanceTo(Ie);pe.subVectors(Ie,be).normalize(),ut.setFromUnitVectors(new e.Vector3(0,1,0),pe),j.compose(be.clone().add(Ie).multiplyScalar(.5),ut,Zt),t.add(new e.CylinderGeometry(M,M,l,g.sides||5,1),{...g,m:j})}async function Do(t,u,h,M,g){const l=u()*6.283,w=6.45,k=u()<.5?[.82,.8,.72]:[.8,.36,.44];t.add(new e.CylinderGeometry(1.9,2.15,.5,8),{p:[h,.25,M],kind:0,col:Eo,ao:(a,n)=>n>0?.8:.45,us:8,vs:1}),t.add(D(Xt,14),{p:[h,.5,M],kind:4,col:X,us:9,vs:7,ao:(a,n)=>.6+.4*_(n,0,2)}),await g(),t.add(new e.TorusGeometry(1.6,.11,5,14),{p:[h,3.72,M],r:[Math.PI/2,0,0],kind:4,col:X});const b=9;for(let a=0;a<b;a++){a%3===0&&await g();const n=(a+u()*.6)/b*re,r=.1+.3*u(),s=3+2.3*u(),p=a%2===0;pe.set(Math.cos(n+Math.PI/2),0,Math.sin(n+Math.PI/2)),j.makeRotationAxis(pe,-r).setPosition(h+Math.cos(n)*.25,w,M+Math.sin(n)*.25);const i=c=>.03+.26*(c/s)*(c/s);if(t.add(new e.CylinderGeometry(.05,.085,s,4,3).translate(0,s/2,0),{m:j,kind:0,col:ue,phase:l+a,sway:(c,d)=>i(d)}),p)for(let c=0;c<7;c++){const d=s*(.52+.5*c/6),m=c*2.4,P=i(d),G=.31-c*.016;Z.makeTranslation(Math.cos(m)*.17,d,Math.sin(m)*.17).premultiply(j),t.add(new e.OctahedronGeometry(1).scale(G,G*1.7,G),{m:Z,kind:0,col:k,phase:l+a,sway:()=>P})}else{const c=i(s);Z.makeTranslation(0,s+.3,0).premultiply(j),Ft(t,Z.clone(),.56,Re[(a+Math.floor(l*3))%4],l+a,c)}}await g();for(let a=0;a<5;a++){const n=(a+.5+u()*.5)/5*re,r=.45+.3*u(),s=2.6+u();pe.set(Math.cos(n+Math.PI/2),0,Math.sin(n+Math.PI/2)),Z.makeRotationY(-n+Math.PI/2),j.makeRotationAxis(pe,-r).multiply(Z).setPosition(h+Math.cos(n)*.3,w-.1,M+Math.sin(n)*.3),t.add(new e.PlaneGeometry(.42,s,1,3).translate(0,s/2,0),{m:j,kind:0,col:ue,phase:l+a*2,sway:(p,i)=>.2*(i/s)*(i/s),colFn:(p,i,c,d)=>{const m=.7+.6*i/s;d[0]=ue[0]*m,d[1]=ue[1]*m,d[2]=ue[2]*m}})}}async function Oo(t,u,h){const M=(n,r,s,p)=>{t.add(de(1,10,(i,c,d)=>{d[0]=n+(i-.5)*2*r,d[1]=.05,d[2]=V(s,p,c),d[3]=d[0]-n,d[4]=d[2]}),{kind:8,size:r,col:ge});for(const[i,c]of[[s-.7,s],[p,p+.7]])t.add(de(1,1,(d,m,P)=>{P[0]=n+(d-.5)*2*r,P[1]=.04,P[2]=V(i,c,m),P[3]=P[0]*9,P[4]=P[2]}),{kind:0,col:$t})};for(const n of[-1,1])M(n*19.6,4.3,-123,-33),M(n*19.6,4.3,33,123);M(0,6.2,131.5,145.5),await h();const g=[];for(const n of xo)for(const r of[-1,1]){for(const s of[-1,1]){const p=n+s*9.6,i=n+s*25.4,c=(p+i)/2,d=r*33.45;t.add(new e.BoxGeometry(2.7,.6,Math.abs(i-p),1,1,6),{p:[d,.3,c],kind:8,size:1.35,col:[.9,.9,.9],ao:(m,P)=>P>0?1:.4,uvFn:(m,P)=>{P[0]=m.x-d,P[1]=m.z}});for(let m=0;m<3;m++){await h();const P=c+(m-1)*5.1,G=u(),A=[No,qo,Ro][(m+(s>0?1:0)+(r>0?1:0))%3],T=(L,R)=>{const te=Math.abs(L),N=te>1.75?A:te>1.35?Wo:te>1.15?$t:A,ke=.85+.3*G;R[0]=N[0]*ke,R[1]=N[1]*ke,R[2]=N[2]*ke};t.add(new e.CylinderGeometry(.78,.78,4.2,8,6,!0),{p:[r*33.95,1.36,P],r:[Math.PI/2,0,0],kind:0,us:6,vs:6,colFn:(L,R,te,N)=>T(R,N),ao:(L,R,te,N)=>.45+.55*_(N.y,.6,1.7)}),await h();for(const L of[-1,1])t.add(new e.SphereGeometry(.78,8,3,0,re,0,Math.PI/2),{p:[r*33.95,1.36,P+L*2.1],r:[L*Math.PI/2,0,0],s:[1,.45,1],kind:0,col:A,us:3,vs:3}),t.add(new e.SphereGeometry(.17,6,4),{p:[r*33.95,1.36,P+L*2.5],kind:4,col:X})}g.push([r*31.3,n+s*10.4])}t.add(new e.CylinderGeometry(.13,.13,17,6,1),{p:[r*34.3,28.35,n],r:[Math.PI/2,0,0],kind:4,col:X});for(const s of[-1,1])t.add(new e.SphereGeometry(.3,6,5),{p:[r*34.3,28.35,n+s*8.5],kind:4,col:X})}await h();const l=14.8,w=-93,k=[];t.add(new e.CylinderGeometry(1.25,1.5,.95,8,1),{p:[l,.475,w],kind:0,col:[.07,.055,.045],ao:(n,r)=>.5+.5*_(r,-.5,.4),us:8,vs:1}),t.add(D([[0,.02],[2.2,.02],[2.5,.3],[2.58,.3],[2.25,.1],[0,.1]],20),{p:[l,.95,w],kind:4,col:X,us:12,vs:3});for(let n=0;n<7;n++){const r=n/7*re+.3,s=l+Math.cos(r)*1.5,p=w+Math.sin(r)*1.5;t.add(D([[.3,0],[.34,.03],[.1,.05],[.15,.08],[.12,.3],[.13,.4],[.2,.62],[.21,.68]],8),{p:[s,1.05,p],kind:4,col:[.55,.7,.66],us:3,vs:3}),k.push([s,1.75,p])}t.add(D([[0,0],[.42,0],[.5,.1],[.74,.55],[.72,.95],[.5,1.25],[.22,1.36],[.28,1.5],[.12,1.66],[0,1.7]],12),{p:[l,1.05,w],kind:4,col:X,us:6,vs:4}),t.add(new e.TorusGeometry(.42,.06,5,10,Math.PI),{p:[l-.72,1.8,w],r:[0,0,Math.PI/2],kind:4,col:X}),Ee(t,[l+.6,1.6,w],[l+1.2,2.25,w],.07,{kind:4,col:X}),k.push([l+1.25,2.35,w]),await h();const b=[31.3,0,-68.5],a=[34.5,13.4,-67];Ee(t,b,a,.085,{kind:0,col:[.1,.075,.055]}),Ee(t,a,[34.1,14.1,-67],.045,{kind:4,col:X}),t.add(new e.ConeGeometry(.3,.5,8,1,!0),{p:[33.75,14.15,-67],r:[0,0,Math.PI],kind:4,col:X});for(let n=0;n<2;n++){const r=4.1+n*.95,s=-141.6-n*.5,p=ze("#8FE3C0",.55);t.add(new e.SphereGeometry(1,10,6),{p:[r,.15,s],r:[0,.35,0],s:[.3,.16,.62],kind:0,col:p,us:3,vs:3}),t.add(new e.ConeGeometry(.13,.42,6),{p:[r+.2,.34,s+.56],r:[.9,.35,0],kind:0,col:p}),t.add(new e.TorusGeometry(.2,.05,4,10),{p:[r-.06,.24,s-.14],r:[Math.PI/2,0,0],s:[1,1.5,1],kind:4,col:X})}return{steam:k,vases:g,taper:[34.05,14.15,-67]}}function Jt(t,u,h,M,g,l){const w=[.82,.85,.86],k=[.66,.7,.74],b=new e.Matrix4().makeRotationY(g).setPosition(u,h,M),a=(n,r,s,p,i,c,d,m,P,G)=>{Z.makeRotationX(m).scale(be.set(i,c,d)).setPosition(r,s,p).premultiply(b),t.add(n,{m:Z,kind:0,col:P,phase:l,bob:G,us:2,vs:2})};a(new e.SphereGeometry(1,9,6),0,.42,0,.36,.34,.58,-.25,w,.03),a(new e.SphereGeometry(1,8,5),0,.86,.38,.19,.2,.21,0,w,.07),a(new e.ConeGeometry(1,1,5),0,.84,.62,.05,.16,.05,Math.PI/2,[.5,.45,.45],.07),a(new e.ConeGeometry(1,1,6),0,.3,-.72,.26,.75,.06,-Math.PI/2-.2,k,.03);for(const n of[-1,1])a(new e.SphereGeometry(1,7,4),n*.27,.46,-.1,.1,.24,.5,-.3,k,.03)}function Uo(t,u){const h=[.84,.87,.88],M=[.7,.75,.8],g=[.42,.4,.38],l=(k,b)=>t.add(k,{kind:0,col:h,us:2,vs:2,...b});l(new e.SphereGeometry(1,14,9),{p:[0,2.55,0],s:[.72,.68,1.3],r:[-.18,0,0],bob:.05,ao:(k,b)=>.55+.45*_(b,-.9,.2)});for(const k of[-1,1])l(new e.SphereGeometry(1,10,6),{p:[k*.6,2.7,-.15],s:[.2,.46,1.05],r:[-.2,0,0],col:M,bob:.05});const w=new e.CatmullRomCurve3([new e.Vector3(0,2.75,.95),new e.Vector3(0,3.5,1.5),new e.Vector3(0,4.35,1.5),new e.Vector3(0,4.85,1.72)]);l(new e.TubeGeometry(w,10,.2,7,!1),{bob:.09,sway:(k,b)=>.03*_(b,2.8,4.8)}),l(new e.SphereGeometry(.27,9,7),{p:[0,4.95,1.82],s:[.9,.95,1.2],bob:.09,sway:()=>.03}),l(new e.ConeGeometry(.09,.4,5),{p:[0,4.9,2.25],r:[Math.PI/2,0,0],col:g,bob:.09,sway:()=>.03});for(let k=0;k<6;k++){const b=(k-2.5)*.2;Ee(t,[0,5.15,1.75],[Math.sin(b)*.5,5.75+.08*Math.cos(b*3),1.62],.016,{kind:0,col:M,bob:.09,sides:3}),l(new e.SphereGeometry(.07,5,4),{p:[Math.sin(b)*.5,5.78+.08*Math.cos(b*3),1.62],bob:.09})}for(const k of[-1,1])Ee(t,[k*.3,2.05,.1],[k*.32,1,-.05],.085,{kind:0,col:g,sides:5,phase:k>0?0:Math.PI,sway:()=>.04}),Ee(t,[k*.32,1,-.05],[k*.34,.06,.15],.06,{kind:0,col:g,sides:5,phase:k>0?0:Math.PI,sway:(b,a)=>.04+.14*_(a,-.5,.5)}),l(new e.SphereGeometry(1,6,4),{p:[k*.34,.06,.32],s:[.2,.05,.34],col:g,phase:k>0?0:Math.PI,sway:()=>.18});for(let k=0;k<17;k++){const b=(k+.5)/17-.5,a=6.2+1.8*u()-2.2*Math.abs(b),n=b*3.4,r=.5+.5*u(),s=u()*6,p=de(1,7,(i,c,d)=>{const m=(.1+.34*Math.pow(Math.sin(Math.PI*Math.min(c*1.05,1)),.6))*(c>.82?1.5:1);d[0]=n*c*(.4+.6*c)+(i-.5)*m,d[1]=2.9+r*Math.sin(Math.PI*c)*.6-(2.9-.12)*Math.pow(c,1.6),d[2]=-.9-a*c,d[3]=i,d[4]=c*6});t.add(p,{kind:0,us:1,vs:1,phase:s,sway:(i,c,d)=>.05*_(-d,1,6),colFn:(i,c,d,m)=>{const P=Pe((-d-.9)/a,0,1),G=P>.84?1:0,A=.8+.2*Math.sin(P*40);m[0]=(G?.4:.8)*A,m[1]=(G?.78:.84)*A,m[2]=(G?.62:.86)*A}})}}const zt=[.72,.52,.2],Ye=[.6,.46,.2],Re=[[.55,.03,.06],[.42,.02,.05],[.62,.05,.1],[.8,.22,.32],[.84,.42,.5],[.84,.8,.72]],$e=t=>{const u=Math.min(Math.abs(t)/2.25,1);return 9.3+3.3*(.55*Math.sqrt(1-u*u)+.45*(1-u))};function Ft(t,u,h,M,g,l){t.add(new e.SphereGeometry(h,8,5).scale(1,.8,1),{m:u,kind:0,phase:g,sway:()=>l,colFn:(w,k,b,a)=>{const n=k/(h*.8),r=(.6+.45*n)*(.8+.2*Math.sin(Math.atan2(b,w)*5+n*5))*(1-.5*_(n,.55,.95));a[0]=M[0]*r,a[1]=M[1]*r,a[2]=M[2]*r}}),Z.makeTranslation(0,-h*.85,0).premultiply(u),t.add(new e.ConeGeometry(h*.55,h*.6,5),{m:Z,kind:0,col:ue,phase:g,sway:()=>l})}const eo=t=>(u,h,M,g)=>{const l=.7+.7*h/t;g[0]=ue[0]*l,g[1]=ue[1]*l,g[2]=ue[2]*l};async function Ho(t,u,h){const M=[.7,.67,.6],g=[.8,.66,.42],l=(a,n)=>{n[0]=a.x,n[1]=a.y};t.add(new e.BoxGeometry(5.9,3.25,1.7),{p:[0,1.625,.85],kind:0,col:M,ao:(a,n)=>.5+.5*_(n,-1.6,.5),uvFn:l}),t.add(new e.BoxGeometry(6.2,.4,1.95),{p:[0,.2,.97],kind:0,col:M,uvFn:l}),t.add(new e.BoxGeometry(6.25,.35,2),{p:[0,3.42,1],kind:0,col:g,uvFn:l}),t.add(de(1,6,(a,n,r)=>{const s=n*3.6,p=Math.max(s-1.2,0);r[0]=(a-.5)*3.6,r[1]=3.62-p,r[2]=p>0?2.04:.84+s,r[3]=r[0],r[4]=s}),{kind:8,size:1.8,col:ge}),await h();for(const a of[-1,1])t.add(new e.BoxGeometry(.7,5.8,1.45),{p:[a*2.62,6.5,.725],kind:0,col:g,ao:(n,r)=>.6+.4*_(r,-2.9,0),uvFn:l}),t.add(D([[.3,0],[.34,.12],[.22,.3],[.17,.5],[.17,4.6],[.22,4.8],[.3,4.95],[.2,5.1],[.34,5.35],[.36,5.7],[.3,5.8]],8),{p:[a*2.2,3.6,1.42],kind:4,col:zt,us:4,vs:8});await h(),t.add(de(8,8,(a,n,r)=>{const s=(a-.5)*4.5;r[0]=s,r[1]=V(3.6,$e(s)-.05,n),r[2]=.12+.6*(s/2.25)*(s/2.25),r[3]=s+20,r[4]=r[1]}),{kind:1,size:.34,col:ge,ao:.9}),t.add(de(12,1,(a,n,r)=>{const s=(a-.5)*4.5;r[0]=s,r[1]=$e(s),r[2]=V(.1,1.45,n),r[3]=a*9+40,r[4]=r[2]}),{kind:1,size:.3,col:ge,ao:.8}),await h();const w=new e.Shape;w.moveTo(-2.97,9.2),w.lineTo(-2.25,9.2);for(let a=0;a<=16;a++){const n=-2.25+4.5*a/16;w.lineTo(n,$e(n))}w.lineTo(2.25,9.2),w.lineTo(2.97,9.2),w.lineTo(2.97,13.3),w.lineTo(-2.97,13.3),w.lineTo(-2.97,9.2),t.add(new e.ShapeGeometry(w,1),{p:[0,0,1.45],kind:1,size:.3,col:ge,uvFn:(a,n)=>{n[0]=a.x+60,n[1]=a.y}});const k=[];for(let a=0;a<=16;a++){const n=-2.25+4.5*a/16;k.push(new e.Vector3(n,$e(n),1.5))}t.add(new e.TubeGeometry(new e.CatmullRomCurve3(k,!1,"catmullrom",.1),32,.13,5,!1),{kind:4,col:zt,us:20,vs:1}),t.add(new e.BoxGeometry(6.3,.4,1.75),{p:[0,13.5,.87],kind:0,col:g,uvFn:l}),t.add(new e.BoxGeometry(6,.25,1.6),{p:[0,13.82,.8],kind:0,col:g,uvFn:l});for(const a of[-2.6,0,2.6])t.add(D([[.22,0],[.3,.15],[.12,.35],[.26,.62],[.2,.85],[0,1.15]],7),{p:[a,13.94,.9],kind:4,col:zt});await h(),t.add(new e.CylinderGeometry(.04,.04,1.4,4),{p:[0,11.7,.85],kind:4,col:Ye}),t.add(D([[.05,.62],[.3,.5],[.4,.42]],8),{p:[0,10.4,.85],kind:4,col:Ye}),t.add(D([[.4,-.42],[.5,-.15],[.5,.15],[.4,.42]],8),{p:[0,10.4,.85],kind:9,col:ge}),t.add(D([[.4,-.42],[.3,-.5],[.08,-.62],[.02,-.8]],8),{p:[0,10.4,.85],kind:4,col:Ye});const b=[0,7.35,.98];t.add(D(Xt,12),{p:[b[0],3.6,b[2]],s:.5,kind:4,col:Ye,us:9,vs:7}),await h();for(let a=0;a<26;a++){const n=Math.acos(1-1.25*(a+.5)/26),r=a*2.39996+.4,s=.3+.11*u(),p=Math.sin(n)*Math.cos(r),i=Math.cos(n),c=Math.sin(n)*Math.sin(r);be.set(p*1.2,i+.25,c*.5+.35).normalize(),ut.setFromUnitVectors(Ie.set(0,1,0),be),j.compose(pe.set(b[0]+p*1.75,b[1]+i*1.55,b[2]+c*(c>0?.55:.3)),ut,Zt),Ft(t,j,s,Re[(a*7+(u()<.3?1:0))%Re.length],u()*6.283,.02+.03*Math.max(i,0)),a%6===5&&await h()}for(let a=0;a<14;a++){const n=(a+u())/14*re,r=.9+.5*u(),s=.9+.5*u();pe.set(Math.cos(n+Math.PI/2),0,Math.sin(n+Math.PI/2)),Z.makeRotationY(-n+Math.PI/2),j.makeRotationAxis(pe,-r).multiply(Z).setPosition(b[0]+Math.cos(n)*.5,6.7,b[2]+Math.sin(n)*.3),t.add(new e.PlaneGeometry(.5,s,1,2).translate(0,s/2,0),{m:j,kind:0,phase:a,sway:(p,i)=>.05*i/s,colFn:eo(s)})}await h();for(let a=0;a<13;a++){const n=-2.25+4.5*(a+.5)/13,r=$e(n)+.1;for(const s of[-1,1])j.makeRotationZ(s*(1.1+.5*u())+(n<0?.5:-.5)).setPosition(n,r,1.57),t.add(new e.PlaneGeometry(.3,.75,1,1).translate(0,.5,0),{m:j,kind:0,phase:a,sway:(p,i)=>.02*i,colFn:eo(.9)});j.makeRotationX(Math.PI/2).setPosition(n,r,1.62),Ft(t,j,.25+.05*(a&1),Re[(a*5+2)%Re.length],a*1.3,.012)}for(let a=0;a<8;a++){const n=Re[a*3%5];t.add(new e.CircleGeometry(.17,5),{p:[(u()-.5)*4.6,3.65,1.15+u()*.8],r:[-Math.PI/2,0,u()*6],kind:0,col:n})}}function St(t,u,h,M,g,l,w){const k=[.5,.33,.16],b=[.84,.74,.54],a=[.62,.24,.08],n=[.7,.5,.16],r=new e.Matrix4().makeRotationY(g).scale(Ie.set(1.5,1.5,1.5)).setPosition(u,h,M),s=(i,c,d,m,P,G,A,T,L)=>{Z.makeRotationX(T).scale(be.set(P,G,A)).setPosition(c,d,m).premultiply(r),t.add(i,{m:Z,kind:0,phase:l,us:2,vs:2,...L})},p=(i,c,d,m)=>{const P=_(c,.3,-.45);m[0]=V(k[0],b[0],P),m[1]=V(k[1],b[1],P),m[2]=V(k[2],b[2],P)};s(new e.SphereGeometry(1,10,7),0,.56,0,.31,.31,.47,-.5,{colFn:p,bob:.03}),s(new e.SphereGeometry(1,8,6),0,.97,.31,.2,.2,.22,w?-.5:0,{colFn:p,bob:.05,sway:()=>.012}),s(new e.ConeGeometry(1,1,5),0,w?1.13:.98,w?.52:.6,.045,.22,.045,w?.7:Math.PI/2,{col:n,bob:.05,sway:()=>.012}),w&&s(new e.ConeGeometry(1,1,5),0,.99,.58,.04,.18,.04,Math.PI/2+.2,{col:n,bob:.05,sway:()=>.012}),s(new e.ConeGeometry(1,1,6),0,.44,-.64,.2,.72,.05,-Math.PI/2-.35,{col:a,bob:.03,sway:()=>.03});for(const i of[-1,1])s(new e.SphereGeometry(1,7,4),i*.25,.6,-.08,.08,.21,.43,-.5,{col:[.38,.24,.12],bob:.03}),s(new e.CylinderGeometry(1,1,1,4),i*.1,.14,.03,.028,.28,.028,0,{col:n})}var Ko={id:"million-mirrors",name:"Hall of a Million Mirrors",category:"interior",weirdness:.15,media:["interior"],async build(t){const u=t.rng,h=t.vary||{},M=t.quality&&t.quality.detail||1,g=Pe(h.density||1,.7,1.3),l=()=>t.yield?t.yield():Promise.resolve(),w=u.fork("look")(),k=u.fork("cast")(),b=u.fork("koi")();let a=w<.2?"moon":w<.42?"noon":w<.6?"snow":"dusk";h.hour==="day"?a="noon":h.hour==="night"?a="moon":h.hour==="golden"?a="dusk":h.hour==="dawn"&&(a="snow");const n=!!h.rare;n&&a==="noon"&&(a="dusk");const r=Vo[a],s=k<.35,p=o=>new e.Vector3(o[0],o[1],o[2]),i=new e.Scene;i.background=new e.Color(r.fog),i.fog=new e.FogExp2(r.fog,r.fogD);const c=await wo(t,{palette:kt,look:r.hero});r.over&&c.setLook(r.over),c.setPortalColor(kt[3],2.5),i.add(c.object);const d=c.uniforms,m=c.anchors;await l();const P=vo(Kt),G=new e.Vector3,A=new Float32Array(601*3);for(let o=0;o<=600;o++)P.pointAt(o/600,G),A[o*3]=G.x,A[o*3+1]=G.y,A[o*3+2]=G.z;const T=(o,f,v)=>{let y=1e9,x=0;for(let S=0;S<=600;S++){const F=(A[S*3]-o)**2+(A[S*3+1]-f)**2+(A[S*3+2]-v)**2;F<y&&(y=F,x=S/600)}return x},L=T(0,8.6,-150),R=.012,te=L-.03,N=T(-14.6,22.8,-69),ke=T(-12,23,-17),Fe=T(0,33,20.2),me=T(26,10.2,-13.5),Ce=T(0,3.6,-45);await l();const O=()=>e.UniformsUtils.clone(e.UniformsLib.fog),se={dusk:[.72,.95,.9],noon:[1,1,.94],moon:[.4,.56,.95],snow:[.62,.72,.84]}[a],U=[[-8.2,-204],[8.2,-190],[-8.2,-172],[8.2,-156]],ne=13.4,Ne=[.8,1,1,.9],to={dusk:[2.7,1.6,.7],noon:[2.3,2.05,1.5],moon:[1,1.5,2.4],snow:[2.8,1.15,.5]}[a],Xe={dusk:"#FFC070",noon:"#FFE6B4",moon:"#9CC4FF",snow:"#FF9A50"}[a],pt={dusk:[.3,.3,.42],noon:[.8,.74,.58],moon:[.16,.26,.6],snow:[.5,.56,.66]}[a],oo={dusk:[.04,.036,.04],noon:[.075,.07,.06],moon:[.018,.028,.056],snow:[.045,.05,.062]}[a],Se={uTime:d.uTime,uCamL:d.uCamL,uLampPhase:{value:0},uLamps:{value:U.map((o,f)=>new e.Vector4(o[0],ne,o[1],Ne[f]))},uLampCol:{value:p(to)},uBlade:{value:new e.Vector4(1,5.4,ae,.5)},uBladeCol:{value:p(se)},uAmbV:{value:p(oo)},uEntry:{value:new e.Vector4(pt[0],pt[1],pt[2],Kt[0][2]-4)}},Ze=new e.ShaderMaterial({uniforms:{...O(),...Se},vertexShader:go,fragmentShader:bo,fog:!0,side:e.DoubleSide}),K=(o,f,v)=>{const y=new e.Mesh(o.build?o.build():o,f);return y.frustumCulled=!1,y.renderOrder=v||0,y};{const o=oe();await _o(o,u.fork("vestibule"),l),await l(),i.add(K(o,Ze))}await l();const Je=new e.Group,et=new e.Group;Je.position.set(-le,0,Ct),et.position.set(le,0,Ct);{const o=oe();await Yt(o,1,l),Je.add(K(o,Ze)),await l();const f=oe();await Yt(f,-1,l),et.add(K(f,Ze))}i.add(Je,et),await l();{const o=new e.PlaneGeometry(26,28,1,1);o.translate(0,14,0);const f=new e.ShaderMaterial({uniforms:{uTime:d.uTime,uCamL:d.uCamL,uBlade:Se.uBlade,uBladeCol:Se.uBladeCol},vertexShader:ko,fragmentShader:Co,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide}),v=K(o,f,6);v.position.set(0,0,Ct+10.2),i.add(v)}const Tt=ce+Math.sqrt(H*H-8.2*8.2)-.1,Lt=Tt-ne;await l();const tt=[];{const o=oe();Io(o,Lt);const f=o.build();for(const v of U){const y=new e.Group;y.position.set(v[0],Tt,v[1]);const x=new e.Mesh(f,Ze);x.frustumCulled=!1,y.add(x),i.add(y),tt.push(y)}}await l();const Te={uTime:d.uTime,uCamL:d.uCamL,uStain:{value:r.stain},uSnow:{value:r.snow},uStar:{value:r.star},uSkyTop:{value:p(r.skyTop)},uSkyBot:{value:p(r.skyBot)},uTree:{value:p(r.tree)},uLattice:{value:p(r.lattice)},uOrb:{value:new e.Vector4(...new e.Vector3(r.orb[0],r.orb[1],r.orb[2]).normalize().toArray(),r.orb[3])},uOrbCol:{value:p(r.orbCol)},uFwPos:{value:[new e.Vector3(80,30,0),new e.Vector3(-80,30,0)]},uFwCol:{value:[new e.Vector3,new e.Vector3]},uFwAge:{value:new e.Vector2(-1,-1)},uFwRad:{value:new e.Vector2(17,17)}};{const o=[],f=[],v=[];m.windows.forEach((x,S)=>{const F=x.position.x>0?1:-1,C=F*(35+1.55),B=x.position.z,z=o.length/3;o.push(C,8.9,B-6.1,C,8.9,B+6.1,C,27.7,B+6.1,C,27.7,B-6.1);for(let E=0;E<4;E++)f.push(F,B,S);v.push(z,z+1,z+2,z,z+2,z+3)});const y=new e.BufferGeometry;y.setAttribute("position",new e.Float32BufferAttribute(o,3)),y.setAttribute("aWin",new e.Float32BufferAttribute(f,3)),y.setIndex(v),i.add(K(y,new e.ShaderMaterial({uniforms:{...O(),...Te},vertexShader:Mo,fragmentShader:Po,fog:!0,side:e.DoubleSide})))}const mt={uAmb:d.uAmb,uWinFill:d.uWinFill,uFlame:d.uFlame,uLit:d.uLit,uGain:d.uGain,uWinGain:d.uWinGain};{const o=[],f=[],v=[],S=u.fork("gauze");m.windows.forEach(B=>{const z=B.position.x>0?1:-1,E=B.position.z;for(const Q of[-1,1]){const q=S(),Y=o.length/3;for(let I=0;I<=12;I++)for(let J=0;J<=8;J++){const ie=J/8,$=I/12;o.push(z*34.3,V(28.2,.2,$),E+Q*V(7.6,4.3,ie)),f.push(z,q,$,ie)}for(let I=0;I<12;I++)for(let J=0;J<8;J++){const ie=Y+I*9+J,$=ie+8+1;v.push(ie,ie+1,$+1,ie,$+1,$)}}});const F=new e.BufferGeometry;F.setAttribute("position",new e.Float32BufferAttribute(o,3)),F.setAttribute("aC",new e.Float32BufferAttribute(f,4)),F.setIndex(v);const C=new e.ShaderMaterial({uniforms:{...O(),...mt,uTime:d.uTime,uWinTop:d.uWinTop,uWinBot:d.uWinBot,uGauze:{value:p(r.gauze)},uBack:{value:r.back},uBurstPos:d.uBurstPos,uBurstCol:d.uBurstCol},vertexShader:zo,fragmentShader:Fo,fog:!0,side:e.DoubleSide,transparent:!0,depthWrite:!1});i.add(K(F,C,.6))}{const o=d.uBeamDir.value[0],f=[],v=[],y=[],x=z=>27.5-5.5*(z*z/36),S=(z,E,Q)=>{const q=f.length/3;for(const[Y,I]of[[0,z],[1,E]]){const J=(I[1]-.06)/o.y;f.push(I[0],I[1],I[2],I[0]-o.x*J,.06,I[2]-o.z*J),v.push(Y,0,Q,Y,1,Q)}y.push(q,q+1,q+3,q,q+3,q+2)};m.windows.forEach((z,E)=>{if(z.position.x>0)return;const Q=z.position.z,q=-34.9;[-4.6,-2.3,0,2.3,4.6].forEach((Y,I)=>S([q,9.3,Q+Y],[q,x(Y)-.4,Q+Y],E*9+I)),[12.5,17.5,22].forEach((Y,I)=>S([q,Y,Q-5.4],[q,Y,Q+5.4],E*9+5+I))});const F=new e.BufferGeometry;F.setAttribute("position",new e.Float32BufferAttribute(f,3)),F.setAttribute("aS",new e.Float32BufferAttribute(v,3)),F.setIndex(y);const C=new e.ShaderMaterial({uniforms:{...O(),uTime:d.uTime,uCamL:d.uCamL,uStain:{value:r.stain},uShaftCol:{value:p(r.shaft||[0,0,0])}},vertexShader:Go,fragmentShader:Ao,fog:!0,side:e.DoubleSide,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending}),B=K(F,C,5.5);B.visible=!!r.shaft,i.add(B)}await l();const he=c.makeMaterial({MM_PROP:1}),We=oe(),ve=await Oo(We,u.fork("furnish"),l);await l();const Bt=[];for(const o of[-1,1])for(const f of[-112,-94,-76,-58,-40,40,58,76,94,112])Bt.push([o*8.6,f]),We.add(D([[0,.12],[.2,.12],[.34,.02],[.62,-.02],[.7,-.1]],10),{p:[o*8.6,ee,f],kind:4,col:X,us:4,vs:2});await l();const Gt=[];{const o=u.fork("floats");for(let f=0;f<14;f++){const v=f<5?-1:1,y=v<0?f/5:(f-5)/9,x=v<0?V(-118,-52,y+.1*o()):V(40,121,y+.06*o()),S=(o()-.5)*13;Gt.push([S,x]),We.add(D([[0,.02],[.34,.04],[.56,.2],[.6,.34],[.5,.3],[.3,.14],[0,.12]],9),{p:[S,ee-.05,x],kind:4,col:Ye,us:4,vs:2,bob:.03,phase:f*1.7}),We.add(new e.CylinderGeometry(.1,.13,.4,5),{p:[S,ee+.25,x],kind:9,col:ge,bob:.03,phase:f*1.7})}}await l(),i.add(K(await We.buildInSteps(l),he)),await l();{const o=[];for(let f=0;f<2;f++){const v=oe();await Do(v,u.fork("vase"+f),0,0,l),await l(),o.push(v.build()),await l()}ve.vases.forEach(([f,v],y)=>{const x=new e.Mesh(o[y+(y>>2)&1],he);x.frustumCulled=!1,x.position.set(f,0,v),x.rotation.y=y*2.1,i.add(x)})}await l();const ht=[];for(const o of[-90,-30,30,90])for(const f of[-1,1])for(const v of[-1,1])ht.push([f*32,o+v*3,v]);{const o=oe();await Ho(o,u.fork("alcove"),l),await l();const f=await o.buildInSteps(l),v=oe();St(v,-2,3.62,1.75,.8,.5,!0),St(v,1.9,3.62,1.7,-1.1,2.1,!1),St(v,-1.3,13.95,1,.3,4.2,!1),await l();const y=v.build();for(const[x,S,F]of ht){const C=new e.Mesh(f,he);if(C.frustumCulled=!1,C.position.set(x,0,S),C.rotation.y=F>0?0:Math.PI,i.add(C),x>0&&S===-27||x<0&&S===27||x<0&&S===-87||x>0&&S===87){const z=new e.Mesh(y,he);z.frustumCulled=!1,z.position.copy(C.position),z.rotation.y=C.rotation.y,i.add(z)}}}await l();const qe=new e.Group,ot=new e.Group;{const o=oe(),f=oe(),v=u.fork("perch");for(let y=0;y<8;y++){await l();const x=y/8*re+.2;Jt(y<4?f:o,Math.cos(x)*1.25,m.perchY,Math.sin(x)*1.25,-x+Math.PI/2+(v()-.5),v()*6)}for(const[y,x]of[[28.4,-29],[28.4,-31.2],[-28.4,29.4],[-28.4,31],[28.4,30.2],[-28.4,-30.4]])await l(),Jt(o,y,16.6,x,y>0?-Math.PI/2:Math.PI/2,v()*6);await l(),qe.add(K(o,he)),ot.add(K(f,he)),qe.visible=ot.visible=!1,i.add(qe,ot)}await l();const De=Math.round(430*M*g),at=Math.round(70*M);{const o=u.fork("petals"),f=new Float32Array((De+at)*4),v=new Float32Array((De+at)*4);for(let F=0;F<De+at;F++){const C=F>=De;let B=0,z=0;for(let E=0;E<8;E++){z=o.range(-124,124);const Q=Pe(35.355-Math.abs(z),11,25)-1;if(B=o.range(-Q,Q),C||Math.hypot(B,z)>16||o()<.1)break}if(!C&&o()<.5){const E=o.range(0,1);B*=.6+.4*E}f.set([B,z,o(),o.range(.42,.78)*(C?.8:1)],F*4),v.set([C?1:0,o.range(.2,.9),o.range(-.25,.25)*(C?6:1),o()],F*4)}const y=new e.PlaneGeometry(1,1),x=new e.InstancedBufferGeometry;x.index=y.index,x.setAttribute("position",y.getAttribute("position")),x.setAttribute("iP",new e.InstancedBufferAttribute(f,4)),x.setAttribute("iQ",new e.InstancedBufferAttribute(v,4)),x.instanceCount=De+at;const S=new e.ShaderMaterial({uniforms:{...O(),...mt,uTime:d.uTime,uCamL:d.uCamL},vertexShader:So,fragmentShader:To,fog:!0,side:e.DoubleSide});i.add(K(x,S))}await l();{const o=u.fork("wisps"),f=[],v=[];for(const[F,C]of Bt){const B=o();f.push(F,ee+.05,C,B),v.push(0,1.5,0,0);for(let z=0;z<2;z++)f.push(F,ee+.03,C,B+z*.5),v.push(1,.9,.22,0)}for(const F of ve.steam)for(let C=0;C<5;C++)f.push(F[0],F[1],F[2],o()),v.push(2,.75,.16+.06*o(),3.4);for(let F=0;F<9;F++)f.push(ve.taper[0],ve.taper[1]+.15,ve.taper[2],F/9+.03*o()),v.push(2,.55,.11,8.5);const y=new e.PlaneGeometry(1,1),x=new e.InstancedBufferGeometry;x.index=y.index,x.setAttribute("position",y.getAttribute("position")),x.setAttribute("iW",new e.InstancedBufferAttribute(new Float32Array(f),4)),x.setAttribute("iK",new e.InstancedBufferAttribute(new Float32Array(v),4)),x.instanceCount=f.length/4;const S=new e.ShaderMaterial({uniforms:{...O(),...mt,uTime:d.uTime,uCamL:d.uCamL},vertexShader:Lo,fragmentShader:Bo,fog:!0,side:e.DoubleSide,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor});i.add(K(x,S,5))}await l();const st={value:0},At={sunDir:[.1,.9,-.2],sunColor:"#F2F8FF",sunIntensity:1.5*r.bird,sky:"#9fb6d6",skyIntensity:.8*r.bird,ground:"#8FE3C0",groundIntensity:.5*r.bird},Vt=s?{species:"swifts",size:4,body:"#7f9ab8",belly:"#f2f6f8",wingC:"#58728f",trail:"#7d97b3",tip:"#33465c",head:"#5d7896",glide:.35,flap:5.5}:{species:"gulls",size:2.3,body:"#f1f3f4",belly:"#ffffff",wingC:"#e9edf0",trail:"#f4f6f8",tip:"#cfd6dc",beak:"#c9a9a0",head:"#f8fafb",glide:.14,flap:4.2},_t=15,ao=L+.008,Le=Ae.makeFlock({rng:u.fork("doves"),...Vt,count:s?12:16,speed:_t,form:"loose",spread:[2.6,1.5,9],wander:[1,.6,1,.5],amp:.78,route:[[-21,1.7,-109],[-12,2.1,-101],[-1,2.6,-95.5],[10,4.5,-89],[20,10,-78],[24.5,16,-62],[22,19,-45],[14,21,-30],[8,26,-16],[-6,28.5,-10],[-13,28.5,3],[-6,27,13],[6,25,10],[8,22.5,2],[3,m.perchY+1.2,-1]],closed:!1,start:0,light:At});Le.object.visible=!1,i.add(Le.object),await l();const vt=(Le.route?Le.route.length:205)/_t,so=Fe-.125,Be=Ae.makeFlock({rng:u.fork("doves-b"),...Vt,count:4,speed:11.5,form:"loose",spread:[1.6,1,5],wander:[.8,.5,.8,.5],amp:.8,route:[[1,m.perchY+.9,1],[-2.5,24,5],[-7,29,7],[-10,34,1],[-8,37,-7],[-1,39,-10],[7,40,-6],[9,41,2],[4,42,8],[-4,42.5,8],[-8,43,1],[-5,43.5,-6],[2,44,-8]],closed:!1,start:0,light:At});Be.object.visible=!1,i.add(Be.object),await l();const It=(Be.route?Be.route.length:150)/11.5,Et=Ae.makeFlock({rng:u.fork("flit"),species:"gulls",size:1.5,body:"#8a6c44",belly:"#e0cca4",wingC:"#70583a",trail:"#84683e",tip:"#3c2c1a",beak:"#b08a40",head:"#806240",glide:.05,flap:7.5,count:3,speed:6.5,form:"loose",spread:[.8,.6,5],wander:[.5,.5,.5,.9],amp:.95,route:[[28.6,8.2,-24.2],[30,10.8,-21.2],[32.6,11.6,-21.8],[33.3,9,-24.4],[31,6.4,-23.4],[29.2,6.6,-21.6],[28.2,8.6,-20.8],[27.8,9.6,-22.6]],closed:!0,start:0,light:{sunDir:[-.5,.6,.6],sunColor:"#FFD9A0",sunIntensity:2.2,sky:"#E8D0A0",skyIntensity:1,ground:"#A06030",groundIntensity:.7}});i.add(Et.object),await l();const no=b<.3?[["#f4f7f9","#eef2f4"]]:b<.65?[["#b4bfca","#e4eaf0"]]:[["#f2f4f4","#14171c"],["#f4f6f6","#eef0f0"]],io=Math.floor(u.fork("koi-school")()*1e9)+1,Rt=-.7,Nt=o=>({rng:t.core.makeRng(io),species:"koi",count:14,size:4.1,center:[0,Rt,0],spread:[17,.1],speed:.9,varieties:o?[["#000000","#000000"]]:no,caustics:o?0:.15,light:o?{sunDir:[0,1,0],sunColor:"#000000",sunIntensity:0,sky:"#000000",skyIntensity:0,ground:"#000000",groundIntensity:0}:{sunDir:[0,1,0],sunColor:"#F2F8FF",sunIntensity:3.2*r.bird,sky:"#8FE3C0",skyIntensity:1.3*r.bird,ground:"#1C3556",groundIntensity:.7}}),nt=Ae.makeFishSchool(Nt(!1));await l();const Ge=Ae.makeFishSchool(Nt(!0));Ge.object.scale.set(1.08,.03,1.08),Ge.object.position.set(.5,m.pool.floorY+.08-Rt*.03,.35),i.add(Ge.object),nt.material.transparent=!0,nt.object.renderOrder=1.5;{const o=Ge.material;o.transparent=!0,o.depthWrite=!1,o.blending=e.CustomBlending,o.blendSrc=e.ConstantAlphaFactor,o.blendDst=e.OneMinusConstantAlphaFactor,o.blendAlpha=.5,Ge.object.renderOrder=1.2}const we=new e.Group,ye=new e.Group;we.visible=ye.visible=a==="noon"||a==="snow";const wt=c.makeMaterial({MM_PROP:1});wt.uniforms.uAmb={value:p(a==="noon"?[.5,.56,.6]:[.4,.48,.6])};{const o=oe();Uo(o,u.fork("peacock"));const f=K(o,wt);we.add(f);const v=new e.Mesh(f.geometry,wt);v.frustumCulled=!1,ye.add(v)}we.position.set(-11.7,.38,-91),we.scale.setScalar(1.15),ye.position.set(-11.7,.38,85),ye.rotation.y=Math.PI,ye.scale.setScalar(.9),i.add(we,ye),await l(),i.add(nt.object),await l();const Wt=Ae.makeMoths({rng:u.fork("moths"),count:10,size:3.6,positions:[[U[1][0],ne,U[1][1]],[U[2][0],ne,U[2][1]]],jitter:1.5,roam:[2.3,1.5,1.3,.07],selfLit:.9,light:{sunDir:[0,1,0],sunColor:"#FFE2B8",sunIntensity:1.3,sky:"#C9D6E2",skyIntensity:.8,ground:"#4A4640",groundIntensity:.4}});i.add(Wt.object),await l();const qt=bt.makeParticles({rng:u.fork("dust"),preset:"dust",time:st,count:Math.round(1500*M),box:[46,28,46],colors:["#C9D6E2","#8FE3C0","#F2F8FF"]});i.add(qt.object),await l();const Oe=a==="moon",Me=new e.Vector3,ro=[0,6,7,8],it=o=>[U[o][0],ne,U[o][1]],Ue=bt.makeGlows({rng:u.fork("glows"),time:st,positions:[it(0),[ve.taper[0],ve.taper[1]+.05,ve.taper[2]],[3.6,.4,-100],[3.6,-1.5,-100],[-3.6,.4,60],[-3.6,-1.5,60],it(1),it(2),it(3)],colors:[Xe,"#dff4ff","#F2F8FF","#cfe4ff","#F2F8FF","#cfe4ff",Xe,Xe,Xe],sizes:[5.5,.9,Oe?5:.001,Oe?3.4:.001,Oe?5:.001,Oe?3.4:.001,5.5,5.5,5.5],size:1,intensity:1.5,flicker:.25});i.add(Ue.object),await l();{const o=[],f=[],v=[];for(const[x,S,F]of ht)o.push([x,10.4,S+F*.85]),f.push(3.4),v.push("#FFB45E");for(const[x,S]of Gt)o.push([x,ee+.62,S],[x,ee-.7,S]),f.push(1.7,1.15),v.push("#FFC878","#E89A48");const y=bt.makeGlows({rng:u.fork("glows2"),time:st,positions:o,colors:v,sizes:f,size:1,intensity:1.25,flicker:.18});i.add(y.object)}await l();const rt=[];if(Oe){const o=oe();o.add(D([[0,.02],[.95,.02],[1.15,.24],[1.2,.24],[1,.08],[0,.08]],14),{p:[0,0,0],kind:4,col:X,us:6,vs:2}),o.add(new e.CylinderGeometry(.11,.13,.55,6),{p:[0,.36,0],kind:6,col:[.8,.82,.8]});for(let y=0;y<6;y++){const x=y/6*re;o.add(new e.SphereGeometry(1,6,4),{p:[Math.cos(x)*.6,.14,Math.sin(x)*.6],s:[.22,.07,.3],r:[0,-x,0],kind:0,col:[.8,.84,.82]})}const f=K(o,he),v=new e.Mesh(f.geometry,he);v.frustumCulled=!1,rt.push(f,v),i.add(f,v)}const Dt=.8,yt=["#FFC45C","#FF4E62","#5CE8A0","#6C9CFF","#FFE9C4"].map(o=>new e.Color(o)),Ot=[{idx:-1e9,win:-1},{idx:-1e9,win:-1}],lo=u.fork("fireworks")()*100,lt=(o,f)=>{const v=Math.sin((o+lo)*(127.1+f*31.7)+f*11.3)*43758.5453;return v-Math.floor(v)},fe=new e.Vector3,Ut=new e.Vector3,xe=new e.Vector3,ct=new e.Vector3,Ht=new e.Vector3,He=m.windows.map(o=>[o.position.x>0?1:-1,o.position.z]),co=(o,f,v)=>{const y=o+.35,x=Math.floor(y/Dt),S=n&&f>L-.03;v.getWorldDirection(Ut);for(let F=0;F<2;F++){const C=x-F,B=(C%2+2)%2,z=Ot[B],E=y-C*Dt;if(z.idx!==C||z.cx===void 0||Math.abs(fe.z-z.cz)+Math.abs(fe.x-z.cx)+Math.abs(fe.y-z.cy)>32){z.idx=C,z.cx=fe.x,z.cy=fe.y,z.cz=fe.z;let Y=-1e9,I=0;for(let $=0;$<He.length;$++){xe.set(He[$][0]*36.5,18,He[$][1]).sub(fe);const gt=xe.length();xe.multiplyScalar(1/Math.max(gt,.001));const Qt=xe.dot(Ut);let je=Qt*2.2+Math.abs(xe.x)*1.3-gt*.004+.3*lt(C,$+5);Qt<.6&&(je-=3),gt<16&&(je-=3),$===Ot[1-B].win&&(je-=.7),je>Y&&(Y=je,I=$)}z.win=I,P.pointAt(Math.min(1,f+.35/dt),ct),P.pointAt(f,Ht),ct.sub(Ht).add(fe),xe.set(He[I][0]*36.6,16+4*lt(C,2),He[I][1]+(lt(C,3)-.5)*2).sub(ct);const J=Math.max(xe.length(),1),ie=(J+26)/J;Te.uFwPos.value[B].copy(ct).addScaledVector(xe,ie),Te.uFwRad.value.setComponent(B,5.3*ie),d.uBurstPos.value[B].copy(Te.uFwPos.value[B]),z.col=yt[Math.floor(lt(C,4)*yt.length)%yt.length]}const Q=S?_(E,0,.2)*(1-_(E,.3,1.5)):0,q=z.col;Te.uFwAge.value.setComponent(B,S?E:-1),Te.uFwCol.value[B].set(q.r*3,q.g*3,q.b*3),d.uBurstCol.value[B].set(q.r*Q*2.5,q.g*Q*2.5,q.b*Q*2.5)}},W=new e.Vector3(0,5,0),fo=new e.Vector3(0,.5,0),uo=m.portalSeat.position.clone(),po=new e.Vector3(-36.3,18.2,-60),mo=new e.Vector3(0,35,120),ho=(o,f)=>{const v=_(f,ke+.02,Fe-.022),y=_(f,Fe+.02,me-.03),x=_(f,me+.006,me+.04),S=_(f,me+.034,Ce-.004);return W.set(0,V(5,44,v),0),W.x=V(W.x,32,y),W.y=V(W.y,8,y),W.z=V(W.z,-25.6,y),W.x=V(W.x,36,x),W.y=V(W.y,16,x),W.z=V(W.z,-1,x),W.x=V(W.x,0,S),W.y=V(W.y,ee+1,S),W.z=V(W.z,0,S),W},xt=new e.Euler,Qe=(o,f,v,y)=>{const x=(v-f)*y;return _(o,f,f+x)*(1-_(o,v-x,v))};return{scene:i,path:P,duration:dt,title:r.title,pace:o=>(.8+.2*_(o,.02,L))*(1-.16*Qe(o,L-.01,L+.06,.3))*(1-.2*Qe(o,N-.04,N+.045,.35))*(1+.14*Qe(o,N+.04,Fe-.03,.35))*(1-.22*Qe(o,me-.04,me+.035,.35))*(1-.2*Qe(o,Ce-.04,Ce+.04,.3)),camera:{fov:56,near:.3,far:900,lookAhead:20,sway:.6,bank:.25},pois:[{at:fo,from:L-.05,to:L+.085,weight:.85},{at:po,from:N-.07,to:N+.062,weight:.8},{at:ho,from:N+.032,to:Ce+.07,weight:.92,fade:.1},{at:uo,from:Ce+.045,to:.92,weight:.6,fade:.12},{at:mo,from:.73,to:.86,weight:.42}],portal:{shape:"circle",radius:m.portalSeat.radius,color:kt[3],glow:.55,revealDistance:210},post:{exposure:r.exposure,bloom:{strength:r.bloom,radius:.6,threshold:1.1},grade:{saturation:r.sat,contrast:1.05,tint:r.tint,shadowTint:r.shadow,vignette:.38,grain:.02,aberration:0}},ride:"none",style:"none",update(o,f,v,y){st.value=f,fe.setFromMatrixPosition(v.matrixWorld);const x=V(.44,1.75,_(y,R,te));Je.rotation.y=-x,et.rotation.y=x,Se.uBlade.value.x=Math.min(9,le*(1-Math.cos(x))),c.setProgress(.055+(y-R)*.065/(te-R)),co(f,y,v),c.update(o,f,v);for(let C=0;C<tt.length;C++)xt.set(.04*Math.sin(f*.61+1+C*1.9),0,.055*Math.sin(f*.83+C*2.3)),tt[C].rotation.copy(xt),Me.set(0,-Lt,0).applyEuler(xt).add(tt[C].position),Se.uLamps.value[C].set(Me.x,Me.y,Me.z,Ne[C]),Ue.setPosition(ro[C],Me.x,Me.y,Me.z);Se.uLampPhase.value=.22*Math.sin(f*.83)+f*.04;for(let C=0;C<rt.length;C++){const B=(C?-3.6:3.6)+1.2*Math.sin(f*.21+C*2),z=(C?44:-112)+66*Pe(y*1.05+.04*Math.sin(f*.13+C),0,1),E=.02*Math.sin(f*1.3+C);rt[C].position.set(B,ee-.04+E,z),rt[C].rotation.y=f*.12+C,Ue.setPosition(2+C*2,B,ee+.85+E,z),Ue.setPosition(3+C*2,B+.1*Math.sin(f*1.7),ee-.95,z)}const S=(y-ao)*dt,F=(y-so)*dt;Le.object.visible=S>0&&S<vt*1.1,Le.update(o,Pe(S,0,vt*1.1),v),Be.object.visible=F>0&&F<It*1.1,Be.update(o,Pe(F,0,It*1.1),v),qe.visible=!s&&S>vt-.5,ot.visible=qe.visible&&F<.25,nt.update(o,f,v,y),Ge.update(o,f,v,y),Wt.update(o,f,v,y),Et.update(o,f,v,y),we.position.z=-91+40*(y-.16),we.position.x=-11.7+.1*Math.sin(y*30),we.rotation.y=.05*Math.cos(y*30),ye.position.z=86-22*(y-.79),ye.position.x=-11.7+.1*Math.sin(y*30+2),qt.update(o,f,v),Ue.update(o,f,v)},dispose(){}}}};export{Ko as default};
