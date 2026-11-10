import*as o from"three";import{makePath as so}from"../kit/core.js";const pt={X0:-34,X1:34,Z0:0,Z1:-164,CELLAR:-22,G:0,F1:24,F2:48,TOP:74,SLAB:3,WELL:{x0:-24,x1:24,z0:-116,z1:-164},BOILER:[-8,-22,-82],BYAW:-.3,CYL:[2,-22,-62],LANE:-19,WIN:{x:-14,w:22,sill:55,head:72}},ro=[[-7,-11,-10],[-7,-11,-30],[-8.5,-11,-43],[-12.5,-11.1,-55],[-18.8,-11.5,-66.5],[-23.3,-12,-78],[-23.5,-12,-89],[-22,-11.6,-99],[-19.5,-11,-108],[-18,-10.5,-116],[-17,-9,-126],[-17,-6.5,-137],[-12,-2.4,-149],[0,1.8,-154],[12,5,-149],[17,6.6,-137],[16.5,7,-122],[14.5,7,-106],[13,7,-90],[13.5,8.5,-76],[15.5,12,-64],[17,19.5,-55],[17.5,28.5,-47],[16,37.5,-39.5],[11,46.5,-31],[2,54,-25.5],[-8,59,-25],[-14.5,60.5,-33],[-15,60.5,-44],[-14.5,60.5,-56],[-14,58.5,-72],[-14,58,-90],[-14,59.5,-108],[-14,62,-128],[-14,62,-163.5]],at=["#070708","#26282B","#575B60","#9C9D9B","#EEE9DD","#F0B43A","#FFE9B2"],$={GLASS:0,COLD:.1,CHAR:.18,DIM:.27,SLATE:.36,WOOD:.45,ASH:.54,PALE:.63,BONE:.72,GOLD:.88,FLAME:1},y={PLAIN:0,BRICK:1,BOARD:2,TILE:3,CLOTH:4,IRON:5,PAPER:6,METAL:7,BEAM:8,UNDER:9,RUG:10},nt=l=>{const c=new o.Color(l);return`vec3(${c.r.toFixed(5)},${c.g.toFixed(5)},${c.b.toFixed(5)})`},Vt=`
uniform float uTime, uFront, uShift, uSun;
vec3 thRamp(float t) {
  t = clamp(t, 0., 1.);
  vec3 c = mix(${nt(at[0])}, ${nt(at[1])}, clamp(t / .18, 0., 1.));
  c = mix(c, ${nt(at[2])}, clamp((t - .18) / .18, 0., 1.));
  c = mix(c, ${nt(at[3])}, clamp((t - .36) / .18, 0., 1.));
  c = mix(c, ${nt(at[4])}, clamp((t - .54) / .18, 0., 1.));
  c = mix(c, ${nt(at[5])}, clamp((t - .75) / .13, 0., 1.));
  c = mix(c, ${nt(at[6])}, clamp((t - .88) / .12, 0., 1.));
  return c;
}
float thHash(vec2 p) { p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float thNoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(thHash(i), thHash(i + vec2(1., 0.)), f.x), mix(thHash(i + vec2(0., 1.)), thHash(i + vec2(1., 1.)), f.x), f.y); }
float thGrain() {            // sensor noise: fine grain stepped eight times a second, and the slow crawl of a bolometer's drift
  return (thHash(floor(gl_FragCoord.xy) + floor(uTime * 8.) * vec2(17.13, 31.71)) - .5) * .046
    + (thNoise(gl_FragCoord.xy * .024 + uTime * vec2(.5, .21)) - .5) * .034;
}
`,rt=26,_t=5,io=20,lo=[[-22,-2.9,-164,0],[-2.9,22.5,-164,-60.3],[-2.9,24,-60.3,0],[24,74,-60.3,0],[22.5,74,-164,-60.3]];function ho(){const l=new o.DataTexture(new Uint16Array(rt*_t*3*4),rt,_t*3,o.RGBAFormat,o.HalfFloatType);return l.minFilter=l.magFilter=o.NearestFilter,l.generateMipmaps=!1,l.needsUpdate=!0,{uTime:{value:0},uFront:{value:0},uShift:{value:0},uSun:{value:0},uPx:{value:.0025},uDoor:{value:0},uStir:{value:0},uEm:{value:l},uGlow:{value:1},uTop:{value:0},uDark:{value:1},uToe:{value:0},emit:[]}}function co(l,c,w,M={}){l.emit.push({a:c,b:w||c,R:M.R??5,I:M.I??1,arr0:M.arr??-1,arr1:M.arr1??M.arr??-1,I0:M.I0??0,w:M.w??.015,flick:!!M.flick,down:!!M.down,run:!!M.run,prio:!!M.prio,span:!!M.span})}function fo(l,c=1,w=1){const M=l.uEm.value,d=new Float32Array(rt*_t*3*4),R=M.image.data,L=Math.max(8,Math.round(io*Math.min(1,c+.15)));d.fill(0);for(let f=0;f<_t;f++){const[r,e,k,b]=lo[f],z=[];for(const i of l.emit){const h=Math.max(i.a[1],i.b[1])<-2.9;if(f===0!==h&&!i.down||f===4&&(Math.max(i.a[1],i.b[1])<44||Math.min(i.a[2],i.b[2])>-60.2&&!i.span))continue;const E=i.R*(i.run?w:1),W=E*1.9,v=Math.min(i.a[1],i.b[1])-W,g=Math.max(i.a[1],i.b[1])+W,G=Math.min(i.a[2],i.b[2])-W,F=Math.max(i.a[2],i.b[2])+W;if(g<r||v>e||F<k||G>b)continue;const _=Math.min(g,e)-Math.max(v,r),x=Math.min(F,b)-Math.max(G,k);z.push([i,i.I*E*Math.min(1,_/(2*W))*Math.min(1,x/(2*W))])}z.sort((i,h)=>h[1]-i[1]);const A=z.filter(i=>!i[0].prio).slice(0,L).concat(z.filter(i=>i[0].prio)).slice(0,rt);for(let i=0;i<A.length;i++){const h=A[i][0],E=(f*3*rt+i)*4,W=E+rt*4,v=W+rt*4;d[E]=h.a[0],d[E+1]=h.a[1],d[E+2]=h.a[2],d[E+3]=h.R*(h.run?w:1),d[W]=h.b[0],d[W+1]=h.b[1],d[W+2]=h.b[2],d[W+3]=h.I;const g=Math.max(h.w,.002);d[v]=h.arr0,d[v+1]=h.arr1,d[v+2]=h.I0,d[v+3]=h.flick?-g:g}}for(let f=0;f<d.length;f++)R[f]=o.DataUtils.toHalfFloat(d[f]);M.needsUpdate=!0}const We=nt(at[5]),po=nt(at[6]),mo=`
uniform highp sampler2D uEm; uniform float uGlow;
float thEdgeCut = 0.;            // set by the shader that includes this: 1 = the pipe in the floor's cut edge lights nothing above the boards
// x: gold light falling on a surface at p with normal N; y: the same emitters mirrored in a polished floor (gloss > 0)
vec2 thGlow(vec3 p, vec3 N, float gloss) {
  int row = 3 * (p.y < -2.9 ? 0 : (p.z > -60.3 ? (p.y < 24. ? 2 : 3) : (p.y < 22.5 ? 1 : 4)));
  vec3 cp = cameraPosition; vec2 vd = p.xz - cp.xz; float vl = max(length(vd), 1e-3); vd /= vl;
  float sP = max(cp.y - p.y, 0.) / vl, sinE = sP / sqrt(1. + sP * sP), fres = (1. - sinE) * (1. - sinE);
  float g = 0., sp = 0.;
  for (int i = 0; i < ${rt}; i++) {
    vec4 B = texelFetch(uEm, ivec2(i, row + 1), 0);
    if (B.w <= 0.) break;
    vec4 A = texelFetch(uEm, ivec2(i, row), 0);
    vec3 ba = B.xyz - A.xyz, pa = p - A.xyz;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0., 1.);
    vec3 d = A.xyz + ba * h - p; float d2 = dot(d, d), r2 = A.w * A.w;
    float cut = max(0., 1. - d2 / (r2 * 9.)), hgt = .5 * (A.y + B.y) - p.y;
    bool mir = gloss > 0. && hgt > .6 && d2 < 3600.;                                     // (most pixels are out of reach of most emitters)
    if (cut <= 0. && !mir) continue;
    vec4 C = texelFetch(uEm, ivec2(i, row + 2), 0);
    float on = C.z + (1. - C.z) * smoothstep(0., abs(C.w), uFront - mix(C.x, C.y, h));
    on *= 1. + step(C.w, 0.) * (.09 * sin(uTime * 9.7 + float(i)) + .06 * sin(uTime * 23.3)) + .035 * sin(uTime * 1.9 + float(i) * 2.1 + h * 5.);
    on *= 1. - step(A.y + B.y, -2.5) * smoothstep(.12, .8, p.y) * thEdgeCut;
    float lam = clamp(dot(N, d) * inversesqrt(max(d2, 1e-3)) * .62 + .38, 0., 1.);
    g += B.w * on * cut * cut * lam / (1. + 3. * d2 / r2);
    if (mir) {
      vec2 ea = A.xz - cp.xz, eb = B.xz - cp.xz;
      float la = ea.x * vd.y - ea.y * vd.x, lb = eb.x * vd.y - eb.y * vd.x;           // how far to the side of the line of sight
      float dl = la * lb < 0. ? 0. : min(abs(la), abs(lb));
      float da = max(dot(ea, vd), .05), db = max(dot(eb, vd), .05), dm = .5 * (da + db);
      float sa = (cp.y + A.y - 2. * p.y) / da, sb = (cp.y + B.y - 2. * p.y) / db;
      float ds = sP - clamp(sP, min(sa, sb), max(sa, sb)), k = ds > 0. ? .85 : .28;   // long toward the eye, short beyond
      float wl = .45 + .03 * dm;
      sp += B.w * on * smoothstep(.6, 3., hgt) * smoothstep(0., 4., dm - vl) * exp(-dl * dl / (wl * wl)) * exp(-ds * ds / (k * k * sP * sP + 4e-4)) * exp(-max(dm - vl, 0.) / 34.) * (1. - smoothstep(2500., 3600., d2));
    }
  }
  return vec2(g, sp * fres * gloss) * uGlow;
}
vec3 thLit(vec3 col, vec2 gl, float keep, float pool, float toe) {
  float s = 1. - exp(-gl.x * 1.5); s *= s * (3. - 2. * s);
  s *= mix(1., smoothstep(.05, .3, s), toe);                             // (toe: weak light leaves a grey wall grey instead of turning it khaki)
  float lum = dot(col, vec3(.33, .5, .17));
  col = mix(col, ${We} * min(.36 + 1.0 * lum + .4 * s * s, 1.), s * .86 * keep);      // deep gold at the edge of a pool, full gold beside what throws it
  col = mix(col, ${po}, pool * smoothstep(.74, 1., s) * .38 * keep);                     // and, in a composed pool, white-gold where the light lands
  return col + (1. - col) * ${We} * min(gl.y, 1.) * .62;
}
`,uo=`
attribute vec4 aH; attribute float aS;
uniform float uTime, uFront, uStir;
varying vec4 vH; varying vec3 vW, vN, vL;
void main() {
  vH = aH; vL = position;
  vec3 p = position;
  #ifdef USE_INSTANCING
    vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.);
    vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  #else
    vec4 wp = modelMatrix * vec4(p, 1.);
    vN = normalize(mat3(modelMatrix) * normal);
  #endif
  float heat = aH.y < -.5 ? 0. : smoothstep(aH.y, aH.y + .03, uFront);
  float amp = aS * (.35 + .65 * heat + uStir * aS);
  wp.x += amp * (sin(uTime * 1.3 + wp.y * .33 + wp.z * .21) * .32 + sin(uTime * 2.9 + wp.y * .9) * .08);
  wp.z += amp * (sin(uTime * 1.1 + wp.y * .27 + wp.x * .19 + 1.7) * .3 + sin(uTime * 3.3 + wp.x * .8) * .07);
  vW = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,wo=`
varying vec4 vH; varying vec3 vW, vN, vL;
uniform float uLimb, uDoor, uTop, uDark, uToe;
${Vt}
${mo}
// light through one window of the street wall (centre cx, half-width hw, sill y0, head y1), with its mullion and transom
float sunWin(float xs, float hy, float cx, float hw, float y0, float y1) {
  float ax = abs(xs - cx), ym = .5 * (y0 + y1);
  float m = (1. - smoothstep(hw - .5, hw, ax)) * smoothstep(y0, y0 + .9, hy) * (1. - smoothstep(y1 - .9, y1, hy));
  return m * (.35 + .65 * smoothstep(.2, .55, ax)) * (.35 + .65 * smoothstep(.25, .7, abs(hy - ym)));
}
void main() {
  vec3 N = normalize(vN);
  vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
  float ndv = abs(dot(N, V));
  float t = vH.x, k = floor(vH.w + .5);
  t -= .015 * smoothstep(.33, .41, t) * (1. - smoothstep(.5, .58, t));   // woodwork and cloth sit a clear tone above the walls
  float cool = 1. - smoothstep(.56, .68, t);                         // what is at body heat or hotter keeps its temperature
  // which plane the surface lies in, for patterns laid in world space
  vec3 an = abs(N); vec2 q = an.y > .6 ? vW.xz : (an.x > an.z ? vW.zy : vW.xy);
  float px = max(fwidth(q.x) + fwidth(q.y), 1e-4);
  float fade = 1. - smoothstep(.12, .7, px);
  float pat = 0.;
  if (k < .5) { pat = (thNoise(q * .22) - .5) * .05 + (thNoise(q * 1.7) - .5) * .018 * fade; }
  else if (k < 1.5) {                                                // brick: 1.8 x 0.6 m, mortar a touch warmer
    vec2 b = q / vec2(1.8, .62); b.x += .5 * floor(b.y); vec2 id = floor(b), f = fract(b);
    float m = smoothstep(.0, .07, f.x) * (1. - smoothstep(.93, 1., f.x)) * smoothstep(0., .16, f.y) * (1. - smoothstep(.84, 1., f.y));
    pat = ((thHash(id) - .5) * .085 * m + (1. - m) * .05) * fade + (thNoise(q * .13) - .5) * .07;
  } else if (k < 2.5 || (k > 8.5 && k < 9.5)) {                      // boards 1.05 m wide, butt joints, a knot now and then
    float amp = k > 8.5 ? .3 : 1.;                                   // (kind 9: the same boards seen from below, in the cold and nearly even)
    vec2 b = an.y > .6 ? vW.xz : q; float w = b.x / 1.05; float id = floor(w), f = fract(w);
    float len = (b.y + thHash(vec2(id, 3.)) * 17.) / 17.; float jid = floor(len), jf = fract(len);
    float gap = smoothstep(0., .05, f) * (1. - smoothstep(.95, 1., f)) * smoothstep(0., .006, jf) * (1. - smoothstep(.994, 1., jf));
    pat = ((thHash(vec2(id, jid)) - .5) * .07 * gap * amp - (1. - gap) * mix(.06, .035, step(8.5, k))) * fade + (thNoise(vec2(b.x * 2.3, b.y * .21)) - .5) * .03 * fade * amp + (thNoise(q * .11) - .5) * .04 * mix(1., .6, step(8.5, k));
  } else if (k < 3.5) {                                              // tiles 1.6 m, cold grout
    vec2 b = q / 1.6; vec2 id = floor(b), f = fract(b);
    float m = smoothstep(0., .05, f.x) * (1. - smoothstep(.95, 1., f.x)) * smoothstep(0., .05, f.y) * (1. - smoothstep(.95, 1., f.y));
    pat = ((mod(id.x + id.y, 2.) - .5) * .05 * m - (1. - m) * .05) * fade + (thNoise(q * .15) - .5) * .04;
  } else if (k < 4.5 || k > 9.5) {                                   // cloth: weave and soft folds (kind 10: a runner worn to a sheen)
    pat = (sin(q.x * 9.) * sin(q.y * 9.)) * .012 * fade + (thNoise(q * .9) - .5) * .05 + (thNoise(q * 3.7) - .5) * .02 * fade;
  } else if (k < 5.5) {                                              // cast iron: pitted, a little warmer on the flats
    pat = (thNoise(q * 2.6) - .5) * .045 * fade + (thNoise(q * .5) - .5) * .04;
  } else if (k < 6.5) {                                              // papered wall: stripes, a dado line
    float s = abs(fract(q.x / 2.4) - .5); pat = (smoothstep(.2, .24, s) - .5) * .026 * fade + (thNoise(q * .2) - .5) * .05;
    // below the dado rail the wall is panelled wood, a tone warmer than the paper: stiles, a sunk field with its bevel, a cap
    float hl = vW.y - (vW.y < 22.5 ? 0. : (vW.y < 46.5 ? 24. : 48.));
    if (vW.y > -1. && hl < 8.2 && an.y < .5) {
      float su = abs(fract(q.x / 4.4) - .5) * 4.4;
      float field = (1. - smoothstep(1.74, 1.8, su)) * smoothstep(1.9, 1.96, hl) * (1. - smoothstep(6.54, 6.6, hl));
      float ex = min(1.78 - su, min(hl - 1.92, 6.58 - hl));
      float bev = field * (1. - smoothstep(0., .24, ex));
      float wd = .085 - field * .035 - bev * .05 * fade + .03 * smoothstep(7.15, 7.25, hl) + .02 * (1. - smoothstep(1.2, 1.3, hl))
        + (thNoise(vec2(q.x * .35, hl * 3.3)) - .5) * .03 * fade;
      pat = mix(wd, pat, smoothstep(7.7 - px, 7.7 + px, hl));
    }
  } else if (k < 7.5) { pat = (thNoise(q * 1.1) - .5) * .03; }
  else {                                                             // a sawn beam: one piece of timber, its grain running the long way
    pat = (thNoise(vec2(q.x * .21, q.y * 3.1)) - .5) * .028 * fade + (thNoise(q * .07) - .5) * .03;
  }
  t += pat;
  // the house's own cold: outside walls, the floor edge of every wall, a paler band under each ceiling
  float lvl = vW.y < -1.5 ? -22. : (vW.y < 22.5 ? 0. : (vW.y < 46.5 ? 24. : 48.));
  float top = vW.y < -1.5 ? -3. : (vW.y < 22.5 ? 21. : (vW.y < 46.5 ? 45. : 74.));
  float wall = 1. - smoothstep(.3, .6, an.y);
  float cold = .12 * exp(vW.z / 13.) + .12 * exp(-(vW.z + 164.) / 13.) + .03 * exp(-(34. - abs(vW.x)) / 9.);
  cold += wall * (.055 * exp(-max(vW.y - lvl, 0.) / 1.6) - .012 * smoothstep(top - 9., top, vW.y));
  cold += step(N.y, -.6) * .035 * exp(-(34. - abs(vW.x)) / 6.);                    // ceilings fall off toward the walls
  t -= cold * cool;
  t += (.026 * N.y + .02 * (an.x - an.z)) * cool * step(-1.5, vW.y);         // each face of a solid sits at its own tone, so edges read
  // the visit's own chill or warmth; the cellar takes a cold night harder and an afternoon's sun hardly at all
  // (the top storey is the coldest lived-in part of the house on every visit: its walls and ceiling sit between slate and
  // charcoal, its woodwork and furniture a tone above them, so that the cat, the hollows, the prints and the gold carry it)
  float sh = vW.y < -1.5 ? uShift * (uShift < 0. ? 1.5 : .4) : mix(uShift, uTop * (1. - .5 * smoothstep(.465, .52, vH.x)), smoothstep(43., 47.5, vW.y));
  t += sh * cool;
  // the afternoon variant: fading parallelograms where the sun lay on the ground floor
  // (a low sun through the street wall: each window's light lands as a parallelogram crossed by its glazing bars; the
  // first-floor window's reaches under the lintel and far down the hall, the fanlight's lies at the foot of the stair)
  if (uSun > 0. && an.y > .6 && abs(vW.y) < .6 && vW.z > -112.) {
    float d = -vW.z, xs = vW.x + .14 * d, hy = d * .42;
    float sp = sunWin(xs, hy, -24., 4., 7., 19.) + sunWin(xs, hy, -8., 4., 7., 19.) + sunWin(xs, hy, 28., 3.5, 31., 43.) * step(0.7, vW.x);
    float fr = length(vec2(xs - 17., hy - 17.7));
    sp += (1. - smoothstep(4.2, 5., fr)) * smoothstep(17.7, 18.5, hy) * (.45 + .55 * smoothstep(.1, .3, abs(fract(atan(hy - 17.7, xs - 17. + 1e-4) * 1.91) - .5)));
    t += uSun * .37 * min(sp, 1.) * cool;
  }
  // and one upstairs: the laylight's sixteen panes lie on the landing rug, paler than anything else on that floor
  if (uSun > 0. && an.y > .6 && abs(vW.y - 48.) < .6 && vW.z < -92. && vW.z > -118.) {
    float dz = -105. - vW.z; vec2 pq = vec2((vW.x + 15.2 - .17 * dz) / 5.6, dz / 8.2);
    float m = (1. - smoothstep(.94, 1., abs(pq.x))) * (1. - smoothstep(.95, 1., abs(pq.y)));
    vec2 bar = abs(fract(pq * 2. + .5) - .5);
    m *= (.3 + .7 * smoothstep(.035, .1, bar.x)) * (.3 + .7 * smoothstep(.025, .07, bar.y));
    t += uSun * .27 * m * cool;
  }
  // rare event: a hard-edged wedge of outside air sliding down the hall floor from the open front door
  float wdg = 0.;
  if (uDoor > 0. && vW.y < 16. && vW.y > -.5 && vW.x > -6.) {
    float reach = uDoor * 124.; float d = -vW.z;
    float lat = abs(vW.x - 17.) - (5.5 + d * .13 + .7 * sin(d * .31 + uTime * .7));
    wdg = (1. - smoothstep(reach - 1.2, reach + .3, d + 1.6 * sin(vW.x * .6 + uTime * .9))) * (1. - smoothstep(-.5, .5, lat)) * smoothstep(.3, .7, an.y) * (1. - smoothstep(7., 11., vW.y));
    wdg *= min(uDoor * 9., 1.);
    t = mix(t, .035 + .05 * thNoise(vec2(vW.x * .35, d * .12 - uTime * .9)), wdg * cool);
  }
  // the front arriving at this vertex
  if (vH.y > -.5) {
    float age = uFront - vH.y;
    float on = smoothstep(0., .03, age);
    t += vH.z * on + .1 * sign(vH.z) * exp(-age * age / .00012) * step(.3, vH.z);
    t += .014 * sin(uTime * 5.3 + vW.y * 2.4 + vW.x * 1.1) * on * step(.4, vH.z);
    t -= sh * cool * on * smoothstep(.15, .4, vH.z);                     // what the water heats does not share the house's chill
    if (k > 6.5 && k < 7.5) t += .03 * sin(vH.y * 1400. - uTime * 6.) * smoothstep(0., .03, age);
  }
  // warm light from whatever is hot nearby, and its long reflection in boards and tiles
  float gloss = N.y > .6 ? (k > 1.5 && k < 3.5 ? 1. : (k > .5 && k < 1.5 ? .42 : (k > 3.5 && k < 4.5 ? 0. : (k > 9.5 ? 3. : .3)))) : 0.;
  gloss *= .6 + .8 * thNoise(q * .8);
  // three rooms are composed round one hot thing each (the radiator by the settle and the kitchen range on the ground
  // floor behind z -93, the tank cupboard at the head of the top landing). As it comes on, an imager's range closes down
  // round it: what its light does not reach falls toward charcoal, what it lands on warms through and the gold on it
  // rises to white-gold. Each is switched by the front, so nothing changes before its hot thing is lit.
  float rg0 = smoothstep(.268, .33, uFront);
  float rg = rg0 * (1. - smoothstep(-93., -86., vW.z)) * step(-3.2, vW.y) * (1. - smoothstep(21.5, 23., vW.y));
  float rt = smoothstep(.652, .692, uFront) * smoothstep(22.5, 25., vW.y) * smoothstep(-80., -63., vW.z);
  float pool = max(rg, rt);
  thEdgeCut = rg0;
  vec2 gl = thGlow(vW, gl_FrontFacing ? N : -N, gloss);
  // the cut edge of the floor round the well takes the gold of its own pipe as a band that falls off above and below the line
  float cutY = (vW.y + 1.5) / 1.05;
  float edge = max(step(abs(vW.z + 116.), 1.3) * step(abs(vW.x), 25.3), step(abs(abs(vW.x) - 24.), 1.3) * step(vW.z, -115.));   // the well's rim and the trimmer under it
  float em = step(-5.5, vW.y) * step(vW.y, .02) * wall * edge;
  gl *= 1. - .9 * wdg;
  gl.x *= mix(1., .03 + 1.5 * exp(-cutY * cutY * 2.2), em * rg0);       // (once the well is lit: a hot line with a shoulder, not a flat strip)
  float gsat = 1. - exp(-gl.x * 1.5); gsat *= gsat * (3. - 2. * gsat);
  t += (pool * .085 * gsat - uDark * (.115 * rg + .085 * rt) * (1. - gsat) * (1. + 1.2 * smoothstep(.4, .52, t))) * cool;   // (pale woodwork falls furthest: rails and table legs become dark shapes)
  float hotT = smoothstep(.8, .86, t);                                  // (taken before the limb)
  t -= uLimb * (1. - ndv) * (1. - ndv) * (.6 + .4 * cool);              // the soft dark limb
  t = mix(t, max(t, .862) + .045 * ndv * ndv, hotT);                     // what is gold turns away into deeper gold, never into white
  t = mix(t, .3 + sh, (1. - exp(-dist / 520.)) * .4 * cool);           // far surfaces soften toward slate
  vec3 col = thRamp(t + thGrain());
  // (what is pale by its own heat stays pale, and cast iron and cold fittings take little of the gold: the boiler is grey and white)
  // cast iron takes little, except where it faces up at a main: the boiler's crown carries the pipe's reflection
  float keep = (1. - .82 * smoothstep(.52, .68, t)) * (1. - hotT) * (k > 4.5 && k < 5.5 ? mix(.3, 1., smoothstep(.35, .85, N.y)) : (k > 6.5 && k < 7.5 ? .45 : 1.));
  keep *= mix(1., mix(.08 + .92 * exp(-cutY * cutY), 1., rg0), em);
  // the window end of the top landing (by day): gold on the radiator, round the arch and in the floor, the walls beside it slate
  float toe = uToe * smoothstep(45., 47., vW.y) * (1. - smoothstep(-128., -114., vW.z));
  gl_FragColor = vec4(thLit(col, gl, keep, pool, toe), 1.);
}`;function yo(l,c={}){return new o.ShaderMaterial({uniforms:{uTime:l.uTime,uFront:l.uFront,uShift:l.uShift,uSun:l.uSun,uDoor:l.uDoor,uStir:l.uStir,uEm:l.uEm,uGlow:l.uGlow,uTop:l.uTop,uDark:l.uDark,uToe:l.uToe,uLimb:{value:c.limb??.13}},vertexShader:uo,fragmentShader:wo,side:c.side??o.FrontSide})}const Tt=new o.Matrix4,Pe=new o.Matrix3,j=new o.Vector3,Ne=new o.Quaternion,xo=new o.Euler,Fe=new o.Vector3,vo=new o.Vector3;function qt(){const l=[],c=[],w=[],M=[],d=[];let R=null;const L={setBase(f){return R=f?f.clone():null,L},get triangles(){return d.length/3},add(f,r={}){if(r.m)Tt.copy(r.m);else{const g=r.p||[0,0,0],G=r.r||[0,0,0],F=r.s??1;Ne.setFromEuler(xo.set(G[0],G[1],G[2],"YXZ")),Tt.compose(vo.set(g[0],g[1],g[2]),Ne,typeof F=="number"?Fe.set(F,F,F):Fe.set(F[0],F[1],F[2]))}R&&Tt.premultiply(R),Pe.getNormalMatrix(Tt);const e=f.attributes.position,k=f.attributes.normal,b=f.index,z=l.length/3,A=r.t??$.SLATE,i=r.k??0,h=r.arr??-1,E=r.gain??0,W=r.sway??0,v=[0,0,0,0];for(let g=0;g<e.count;g++){j.fromBufferAttribute(e,g).applyMatrix4(Tt),l.push(j.x,j.y,j.z);const G=j.x,F=j.y,_=j.z;j.fromBufferAttribute(k,g).applyMatrix3(Pe).normalize(),c.push(j.x,j.y,j.z),r.fn?(v[0]=A,v[1]=h,v[2]=E,v[3]=W,r.fn(G,F,_,v,j),w.push(v[0],v[1],v[2],i),M.push(v[3])):(w.push(A,h,E,i),M.push(W))}if(b)for(let g=0;g<b.count;g++)d.push(z+b.getX(g));else for(let g=0;g<e.count;g++)d.push(z+g);return r.dispose!==!1&&f.dispose(),L},box(f,r,e,k){return L.add(new o.BoxGeometry(f,r,e),k)},cyl(f,r,e,k,b,z=!1){return L.add(new o.CylinderGeometry(f,r,e,k,1,z),b)},sph(f,r,e=10,k=7){return L.add(new o.SphereGeometry(f,e,k),r)},tube(f,r,e={},k=7){const b=new o.CatmullRomCurve3(f.map(z=>new o.Vector3(z[0],z[1],z[2])),!1,"catmullrom",e.tension??.05);return L.add(new o.TubeGeometry(b,e.steps??Math.max(4,f.length*4),r,k,!1),e)},build(){const f=new o.BufferGeometry;return f.setAttribute("position",new o.Float32BufferAttribute(l,3)),f.setAttribute("normal",new o.Float32BufferAttribute(c,3)),f.setAttribute("aH",new o.Float32BufferAttribute(w,4)),f.setAttribute("aS",new o.Float32BufferAttribute(M,1)),f.setIndex(l.length/3>65535?new o.Uint32BufferAttribute(d,1):new o.Uint16BufferAttribute(d,1)),f.computeBoundingSphere(),f.computeBoundingBox(),f}};return L}const go=`
attribute vec3 aDir; attribute vec4 aP; attribute float aSoft;
uniform float uPx, uDoor, uTime;
varying vec4 vP; varying float vCore, vTop, vSoft, vWdg;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.);
  // rare: the cold wedge from the open front door lies over the lines in the hall floor
  float dW = -wp.z, latW = abs(wp.x - 17.) - (5.5 + dW * .13);
  vWdg = (1. - smoothstep(uDoor * 124. - 1.2, uDoor * 124. + .3, dW)) * (1. - smoothstep(-.5, .5, latW)) * step(wp.y, 1.) * step(-.5, wp.y) * min(uDoor * 9., 1.);
  vTop = smoothstep(43., 47.5, wp.y);
  float dist = length(wp.xyz - cameraPosition);
  float core = max(.45, 2.5 * dist * uPx);
  float hw = max(aP.w, core * 1.6);
  wp.xyz += aDir * aP.x * hw;
  vP = vec4(aP.x * hw, aP.y, aP.z, hw); vCore = core; vSoft = aSoft;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,bo=`
varying vec4 vP; varying float vCore, vTop, vSoft, vWdg; uniform float uTop;
${Vt}
void main() {
  float s = abs(vP.x), age = uFront - vP.y;
  float on = smoothstep(0., .008, age);
  float hal = min(mix(.8, 2.7, smoothstep(0., .2, age)), vP.w * .46);
  float core = 1. - smoothstep(.65, 1.3, s / max(vCore, 1e-3));      // a flat gold core: the pale shoulder stays narrow
  float halo = exp(-s * s / max(hal * hal, 1e-3)) * (1. - smoothstep(vP.w * .62, vP.w, s));
  float head = exp(-age * age / .00016);
  float flow = .036 * sin(vP.y * 1500. - uTime * 6.5) + .032 * sin(vP.y * 370. - uTime * 2.3);
  float tw = vP.z + mix(uShift, uTop, vTop);
  float t = mix(tw + on * (.19 + .12 * head) * halo, .87 + flow + .12 * head, core * on);
  float a = on * clamp(core + halo * .9, 0., 1.);
  // the line in the cut edge of the floor, once the well is lit: no flat core and no grey halo, a white-gold thread
  // with a gaussian shoulder that hands over to the gold glow of the edge itself
  float soft = vSoft * smoothstep(.268, .33, uFront), x = s / max(vCore * 1.25, 1e-3), gsh = exp(-x * x * 1.6);
  t = mix(t, .845 + .15 * exp(-x * x * 7.) + flow * .6 + .1 * head, soft);
  a = mix(a, on * gsh, soft);
  t = mix(t, min(t, .2 + .1 * core), vWdg); a *= 1. - .55 * vWdg * (1. - core);
  if (a < .004) discard;
  gl_FragColor = vec4(thRamp(t + thGrain()), a);
}`,yt=6.4,Ot=.7,Mo=`
attribute vec4 iA;
varying vec4 vA; varying vec3 vL, vN, vW;
void main() {
  vA = iA; vL = position;
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.);
  vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal); vW = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,ko=`
varying vec4 vA; varying vec3 vL, vN, vW; uniform float uTop;
${Vt}
void main() {
  vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
  float ndv = abs(dot(normalize(vN), V));
  float h = clamp(vL.y / ${yt.toFixed(1)}, 0., 1.);
  float f = (uFront - vA.x) / max(vA.y, 1e-4), started = step(0., f);
  float lvl = clamp(f, 0., 1.04) + .004 * sin(uTime * 2.3 + vA.w) * step(f, 1.);
  float e = h - lvl;                                                  // above the waterline when positive
  float aa = max(fwidth(h) * 1.2, .006);
  float heat = (1. - smoothstep(-aa, aa, e)) * started;
  float line = exp(-e * e / .0005) * started * step(f, 1.03);
  float lead = exp(-max(e, 0.) / .07) * (1. - heat) * started * step(f, 1.03);   // iron just above the water is already warming
  // the cast scroll: on the web between the columns and, fainter, down the face of each column
  float col = step(.3, abs(vL.z));
  vec2 sp = vec2(mix(vL.z * 2.4, vL.x * 3.1, col), fract(vL.y / 1.42 + .25) * 2. - 1.);
  float ang = atan(sp.y, sp.x + 1e-4), rr = length(sp);
  float scroll = (1. - smoothstep(0., .3, abs(sin(ang * 1.5 + rr * 7.)))) * (1. - smoothstep(.7, 1.05, rr));
  float near = 1. - smoothstep(26., 70., dist);
  float inner = 1. - smoothstep(-.1, .45, vL.z);                      // the web and the back column, seen between the ribs
  float lim = (1. - ndv) * (1. - ndv);
  float rest = vA.z + mix(uShift, uTop * .6, smoothstep(43., 47.5, vW.y)) - .06 * exp(-vL.y / 1.1) - .05 * inner + (scroll - .35) * near * .045 - .24 * lim;
  // a full rib: each column a pale gold face turning away into deep gold, the gaps between the ribs deep gold throughout
  float hot = .874 + .095 * ndv * ndv * (1. - .85 * inner) + .012 * h + .007 * sin(uTime * 3.1 + vL.y * 3. + vA.w) + (scroll - .35) * near * .028;
  float t = mix(rest, hot, heat) + lead * .2 + line * .08;
  gl_FragColor = vec4(thRamp(t + thGrain() * mix(1., .3, heat)), 1.);
}`;function zo(){const l=qt(),c=yt,w=[[.23,.42],[.335,.66],[.275,1.35],[.255,c*.5],[.275,c-1.5],[.335,c-.85],[.23,c-.55]].map(d=>new o.Vector2(d[0],d[1]));for(const d of[-.5,.5])l.add(new o.LatheGeometry(w,8),{p:[0,0,d]});for(const d of[-.5,.5])for(const R of[1.6,c-1.75])l.cyl(.325,.325,.16,8,{p:[0,R,d]},!0);l.box(.16,c-2.3,.62,{p:[0,c*.5,0]});for(const d of[c-.42,.5]){const R=new o.SphereGeometry(.36,7,4);l.add(R,{p:[0,d,0],s:[.92,d>1?1:.8,2.25]})}for(const d of[c-.5,.56]){const R=new o.CylinderGeometry(.2,.2,Ot,5,1,!0);R.rotateZ(Math.PI/2),l.add(R,{p:[0,d,0]})}const M=l.build();return M.deleteAttribute("aH"),M.deleteAttribute("aS"),M}function Ge(l,c,w,M){return M-.12*Math.exp(w/13)-.12*Math.exp(-(w+164)/13)-.03*Math.exp(-(34-Math.abs(l))/9)}function Ao(l){const w=new Float32Array(641),M=new Float32Array(641),d=new Float32Array(641),R=new o.Vector3;for(let b=0;b<=640;b++)l.pointAt(b/640,R),w[b]=R.x,M[b]=R.y,d[b]=R.z;const L=(b,z,A)=>{let i=1e9,h=0;for(let E=0;E<=640;E++){const W=w[E]-b,v=M[E]-z,g=d[E]-A,G=W*W+v*v*1.6+g*g;G<i&&(i=G,h=E)}return h/640},f=30/l.length,r=1/1144,e=[];function k(b,z={}){const A=[],i=[];let h=z.start??0,E=0;for(let v=0;v<b.length-1;v++){const g=b[v],G=b[v+1],F=Math.hypot(G[0]-g[0],G[1]-g[1],G[2]-g[2]),_=Math.max(1,Math.ceil(F/2.5));for(let x=v===0?0:1;x<=_;x++){const U=x/_,Lt=g[0]+(G[0]-g[0])*U,it=g[1]+(G[1]-g[1])*U,xt=g[2]+(G[2]-g[2])*U;A.length&&(h+=F/_*r),z.sched?h=z.sched[v]+(z.sched[v+1]-z.sched[v])*U:z.follow!==void 0&&(h=Math.max(h,L(Lt,it,xt)-z.follow)),E+=A.length?F/_:0,A.push([Lt,it,xt,h,v]),x===0&&i.push(h)}i.push(h)}const W={pts:b,samples:A,nodeArr:i,end:h,o:z,at(v,g,G){let F=1e9,_=0;for(const x of A){const U=(x[0]-v)**2+(x[1]-g)**2+(x[2]-G)**2;U<F&&(F=U,_=x[3])}return _}};return e.push(W),W}return{run:k,runs:e,uNear:L,LEAD:f,SP:r}}function To(l){const c=[],w=[],M=[],d=[],R=[],L=new o.Vector3,f=new o.Vector3,r=new o.Vector3;for(const k of l){if(!k.o.n)continue;const b=k.o.hw??3,z=k.o.base??$.SLATE,A=k.samples,i=k.pts;L.set(k.o.n[0],k.o.n[1],k.o.n[2]);for(let h=0;h<i.length-1;h++){if(f.set(i[h+1][0]-i[h][0],i[h+1][1]-i[h][1],i[h+1][2]-i[h][2]),f.lengthSq()<1e-8)continue;r.crossVectors(L,f.normalize()).normalize();let E=-1;for(let W=0;W<A.length;W++){const v=A[W],g=v[4]===h,G=W+1<A.length&&A[W+1][4]===h&&v[4]===h-1;if(!g&&!G)continue;const F=c.length/3,_=Ge(v[0],v[1],v[2],z);for(const x of[-1,1])c.push(v[0]+L.x*.11,v[1]+L.y*.11,v[2]+L.z*.11),w.push(r.x,r.y,r.z),M.push(x,v[3],_,b),d.push(k.o.soft?1:0);E>=0&&R.push(E,E+1,F,E+1,F+1,F),E=F}}}const e=new o.BufferGeometry;return e.setAttribute("position",new o.Float32BufferAttribute(c,3)),e.setAttribute("aDir",new o.Float32BufferAttribute(w,3)),e.setAttribute("aP",new o.Float32BufferAttribute(M,4)),e.setAttribute("aSoft",new o.Float32BufferAttribute(d,1)),e.setIndex(R),e.computeBoundingSphere(),e}function Wo(l,c){const w=c.r??6,M=c.gain??.15;if(c.wall){const d=c.w??8,R=c.h??10,L=new o.PlaneGeometry(d,R,6,8),f=c.p;l.add(L,{p:[f[0]+c.wall[0]*.07,f[1],f[2]+c.wall[1]*.07],r:[0,Math.atan2(c.wall[0],c.wall[1]),0],t:c.t,k:c.k??0,arr:c.arr??-.1,fn:(r,e,k,b)=>{const z=((r-f[0])*c.wall[1]-(k-f[2])*c.wall[0])/(d/2),A=(e-f[1])/(R/2),i=Math.max(0,1-z*z)*Math.max(0,1-A)*Math.max(0,1+A)*.5*(1.2-.5*A);b[2]=M*Math.min(1,i*1.6)}})}else{const d=new o.RingGeometry(.01,w,22,4);d.rotateX(-Math.PI/2);const R=c.p,L=c.sx??1,f=c.sz??1;l.add(d,{p:[R[0],R[1]+.06,R[2]],s:[L,1,f],t:c.t,k:c.k??0,arr:c.arr??-.1,fn:(r,e,k,b)=>{const z=Math.min(1,Math.hypot((r-R[0])/L,(k-R[2])/f)/w);b[2]=M*(1-z)*(1-z)*(1+2*z)}})}}const Lo=`
varying vec2 vUv; uniform float uOn;
${Vt}
void main() {
  vec2 p = vUv * 2. - 1.; float r = length(p);
  float pilot = exp(-dot(p - vec2(0., -.38), p - vec2(0., -.38)) / .2) * (.88 + .12 * sin(uTime * 13.) * sin(uTime * 3.1));
  float n = thNoise(vec2(p.x * 3.2, p.y * 2.4 - uTime * 3.4)) + .5 * thNoise(vec2(p.x * 7. + 3., p.y * 5. - uTime * 6.1));
  float fl = 1. - smoothstep(.1, 1.05, (p.y + .95) * .62 + abs(p.x) * .5 - n * .55);
  float flick = .05 * sin(uTime * 23.) + .04 * sin(uTime * 37. + 2.);
  float t = .2 + .3 * uOn + uOn * fl * (.6 + flick);
  t = max(t, .3 + pilot * .62);
  t -= .25 * smoothstep(.8, 1., r);
  gl_FragColor = vec4(thRamp(t + thGrain()), 1.);
}`;async function Po(l,c={}){const w=c.shared||ho(),M=c.path||so(ro),d=new o.Group;d.name="still-warm-heating";const R=c.material||yo(w),L={burner:-.006,leave:.082};await l.yield();const f=Ao(M),r=f.run;await l.yield();const e=qt(),k=pt.BOILER,b=pt.BYAW,z=new o.Matrix4().compose(new o.Vector3(k[0],k[1],k[2]),new o.Quaternion().setFromEuler(new o.Euler(0,b,0)),new o.Vector3(1,1,1)),A=(t,a,u)=>new o.Vector3(t,a,u).applyMatrix4(z);e.setBase(z);const i=y.IRON,h=L.burner;e.box(13,1.2,10.8,{p:[0,.6,0],t:$.CHAR,k:y.BRICK});const E=o.MathUtils.smoothstep,W=Math.cos(b),v=Math.sin(b),g=t=>.872-.3*Math.min(1,Math.max(0,t)),G=t=>.03*Math.exp(-(((t-5.5)/3.5)**2))-.2*E(t,11.8,15.3)-.05*(1-E(t,1.2,3.2)),F=(t,a)=>(t-k[0])*v+(a-k[2])*W,_=(t,a,u,n)=>{const s=(4.2-F(t,u))/8.4;n[1]=h+.004+Math.max(0,s)*.084,n[2]=.6-.09*Math.max(0,s)-.05*E(a-k[1],11,15)};e.add(new o.BoxGeometry(11.46,11.4,9,1,1,9),{p:[0,7,0],t:.3,k:i,fn:_});{const t=new o.CylinderGeometry(5.73,5.73,9,14,9,!1,0,Math.PI);t.rotateX(Math.PI/2),t.rotateZ(Math.PI/2),e.add(t,{p:[0,13.2,0],s:[1,.35,1],t:.3,k:i,fn:_})}for(let t=0;t<9;t++){const a=4.2-t*1.05,u=h+.008+t*.0105,n=t*3%4*.008-.012,s=g(t/8)+n-.3,m=s,p=(S,B,C,T,H)=>{const q=t===0?E(H.x*v+H.z*W,.3,.7):0;T[2]=(s+G(B-k[1]))*(1-q)+.31*q};e.add(new o.BoxGeometry(11.6,12,.86,1,6,1),{p:[0,7.2,a],t:.3,k:i,arr:u,fn:p});const I=new o.CylinderGeometry(5.8,5.8,.86,18,1,!1,0,Math.PI);I.rotateX(Math.PI/2),I.rotateZ(Math.PI/2),e.add(I,{p:[0,13.2,a],s:[1,.36,1],t:.3,k:i,arr:u,fn:p}),e.box(11.9,.3,.9,{p:[0,1.5,a],t:.27,k:i,arr:u,gain:m*.5});for(const S of[-1,1]){const B=new o.CylinderGeometry(.43,.43,11.3,7,6,!0,S>0?0:Math.PI,Math.PI);e.add(B,{p:[S*5.8,7.35,a],s:[.5,1,1],t:.3,k:i,arr:u,fn:p});for(const[C,T]of[[7.4,1.8],[12.3,.8],[3,.72]]){const H={t:.3,k:i,arr:u+.003,fn:(q,K,dt,Dt)=>{Dt[2]=s+G(K-k[1])-.06}};for(const q of[-.25,.25])e.box(.16,T*2,.1,{p:[S*6,C,a+q],...H});for(const q of[-T,T])e.box(.16,.1,.6,{p:[S*6,C+q,a],...H})}for(const C of[4.6,10.2]){e.box(.7,.95,.5,{p:[S*6.12,C,a],t:.28,k:i,arr:u+.004,gain:m*.82});for(const T of[-.33,.33]){const H=new o.CylinderGeometry(.33,.33,.16,6);H.rotateX(Math.PI/2),e.add(H,{p:[S*6.42,C,a+T],t:.22,k:i,arr:u+.006,gain:m*.55})}}if(t%3===1){const C=new o.CylinderGeometry(.62,.7,.2,12);C.rotateZ(Math.PI/2),e.add(C,{p:[S*6.1,2.9,a],s:[1,1,.6],t:.3,k:i,arr:u+.004,gain:m*.9});for(let T=0;T<4;T++){const H=T*1.5708+.785;e.sph(.1,{p:[S*6.22,2.9+Math.sin(H)*.5,a+Math.cos(H)*.3],t:.2,k:i,arr:u+.006,gain:m*.5},5,3)}}}await l.yield()}for(const t of[-1,1])for(const a of[4.6,10.2]){const u=new o.CylinderGeometry(.13,.13,10.6,6,8);u.rotateX(Math.PI/2),e.add(u,{p:[t*6.42,a,0],t:.24,k:y.METAL,fn:(n,s,m,p)=>{const I=(4.2-F(n,m))/8.4;p[1]=h+.02+Math.max(0,I)*.09,p[2]=.34-.2*Math.max(0,I)}});for(const n of[5.2,-5.2]){const s=new o.CylinderGeometry(.36,.36,.5,6);s.rotateX(Math.PI/2),e.add(s,{p:[t*6.42,a,n],t:.22,k:i,arr:h+.02,gain:n>0?.3:.12})}}await l.yield();const x=4.63,U={t:.32,k:i,arr:h+.003,gain:.57};e.box(5.6,4.6,.3,{p:[0,5.3,x+.15],...U,gain:.5}),e.box(4.6,3.6,.3,{p:[0,5.3,x+.4],...U});const Lt=new o.TorusGeometry(1.16,.16,6,22);e.add(Lt,{p:[0,5.5,x+.6],...U,gain:.4});for(const t of[4.2,6.5])e.cyl(.24,.24,.95,7,{p:[-2.45,t,x+.5],t:.24,k:i,arr:h+.01,gain:.4}),e.box(1,.3,.14,{p:[-1.95,t,x+.58],...U,gain:.45});e.box(1.5,.3,.3,{p:[1.8,5.3,x+.7],t:.2,k:y.METAL,arr:h+.012,gain:.3}),e.sph(.3,{p:[2.6,5.3,x+.75],t:.2,k:y.METAL,arr:h+.014,gain:.25},8,6),e.box(4,1.9,.26,{p:[0,2.35,x+.2],...U,gain:.3});for(let t=0;t<4;t++)e.box(.5,1.2,.12,{p:[-1.2+t*.8,2.35,x+.36],t:.3,k:i,arr:h+.002,gain:.62});{const t=new o.CylinderGeometry(1.5,1.5,.14,20);t.rotateX(Math.PI/2),e.add(t,{p:[0,9.6,x+.1],s:[1.25,.6,1],t:.34,k:i,arr:h+.02,gain:.3})}for(let t=0;t<12;t++){const a=t/12*Math.PI*2;e.sph(.13,{p:[Math.cos(a)*2.1,9.6+Math.sin(a)*1.05,x+.12],t:.26,k:i,arr:h+.02,gain:.3},6,4)}for(const t of[-1,1])for(let a=0;a<7;a++)e.sph(.16,{p:[t*5.3,2.2+a*1.7,x+.06],t:.26,k:i,arr:h+.012,gain:.34},6,4);{const t={t:.25,k:i,arr:h+.01,gain:.3};for(const u of[-1,1])e.box(.5,12.2,.22,{p:[u*5.55,7.3,x+.06],...t}),e.box(.3,4.6,.2,{p:[u*3.3,11.9,x+.05],r:[0,0,u*.12],...t});e.box(11.4,.45,.22,{p:[0,7.95,x+.06],...t}),e.box(11.4,.5,.24,{p:[0,1.75,x+.06],...t});const a=new o.TorusGeometry(5.6,.2,5,18,Math.PI);e.add(a,{p:[0,13.2,x+.02],s:[1,.36,1],...t})}await l.yield(),e.cyl(.15,.15,3.2,7,{p:[4.3,10.4,x+.5],t:.3,k:y.METAL,arr:h+.03,gain:.42});for(const t of[8.8,12]){const a=new o.CylinderGeometry(.22,.22,.6,7);a.rotateX(Math.PI/2),e.add(a,{p:[4.3,t,x+.26],t:.13,k:y.METAL}),e.sph(.27,{p:[4.3,t,x+.52],t:.13,k:y.METAL},7,5)}{const t=new o.CylinderGeometry(.8,.8,.22,16);t.rotateX(Math.PI/2),e.add(t,{p:[-4,10.6,x+.12],t:.14,k:y.METAL}),e.box(.08,.6,.06,{p:[-4,10.8,x+.26],r:[0,0,.6],t:.4,k:y.METAL})}{const t=new o.CylinderGeometry(.22,.22,1,7);t.rotateX(Math.PI/2),e.add(t,{p:[-4.6,2,x+.5],t:.2,k:y.METAL,arr:h+.03,gain:.3}),e.sph(.34,{p:[-4.6,2,x+1],t:.18,k:y.METAL,arr:h+.03,gain:.3},8,6),e.box(1,.12,.14,{p:[-4.6,2.45,x+1],t:.16,k:y.METAL}),e.cyl(.12,.1,.45,6,{p:[-4.6,1.65,x+1.05],t:.2,k:y.METAL,arr:h+.03,gain:.35})}e.cyl(.3,.4,1.3,7,{p:[3.4,14.6,2.6],t:.16,k:y.METAL}),e.box(1.6,.14,.14,{p:[3.9,15.1,2.6],r:[0,0,-.25],t:.16,k:y.METAL}),e.cyl(1.25,1.25,5.6,14,{p:[2.6,16.4,-2.4],t:.3,k:i,arr:h+.02,gain:.44}),e.cyl(1.5,1.5,.5,14,{p:[2.6,14.4,-2.4],t:.26,k:i,arr:h+.02,gain:.4}),e.cyl(.62,.62,2.2,10,{p:[-1.6,15,-3],t:.3,k:y.METAL,arr:L.leave-.012,gain:.56}),e.setBase(null),await l.yield();const it=[Math.sin(b),Math.cos(b)];{const t=A(0,5.3,x+.5),a=new o.PlaneGeometry(4.5,3.5,8,6);e.add(a,{p:[t.x+it[0]*.07,t.y,t.z+it[1]*.07],r:[0,b,0],k:i,arr:h+.003,fn:(u,n,s,m)=>{const p=((u-t.x)*it[1]-(s-t.z)*it[0])/2.25,I=(n-t.y-.2)/1.75,S=Math.exp(-(p*p+I*I)*2.2);m[0]=.32+.33*S,m[2]=.57-.3*S}})}const xt=new o.ShaderMaterial({uniforms:{uTime:w.uTime,uFront:w.uFront,uShift:w.uShift,uSun:w.uSun,uOn:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Lo}),Xt=new o.Mesh(new o.CircleGeometry(1.08,24),xt);Xt.position.copy(A(0,5.5,x+.74)),Xt.rotation.y=b,d.add(Xt),await l.yield();const P=pt.CYL,lt=P[1]+1,ee=c.look===2,Ut=(t,a,u,n)=>{const s=(a-lt)/15;n[0]=ee?.4+.3*o.MathUtils.smoothstep(s,.66,.97):.4+.3*o.MathUtils.smoothstep(s,.3,.92),n[1]=h+.03+(1-s)*.55,n[2]=ee?.06:.035};e.add(new o.CylinderGeometry(3.5,3.5,11.6,22,8),{p:[P[0],lt+7.4,P[2]],k:y.CLOTH,fn:Ut}),e.add(new o.SphereGeometry(3.5,22,6,0,Math.PI*2,0,Math.PI/2),{p:[P[0],lt+13.2,P[2]],s:[1,.52,1],k:y.CLOTH,fn:Ut}),e.add(new o.SphereGeometry(3.5,22,5,0,Math.PI*2,Math.PI/2,Math.PI/2),{p:[P[0],lt+1.6,P[2]],s:[1,.45,1],k:y.CLOTH,fn:Ut});for(const t of[3.6,7.4,11.2]){const a=new o.TorusGeometry(3.56,.12,5,28);a.rotateX(Math.PI/2),e.add(a,{p:[P[0],lt+t,P[2]],t:.2,k:y.METAL})}for(let t=0;t<3;t++){const a=t*2.094+.5;e.box(.7,1.4,.7,{p:[P[0]+Math.cos(a)*2.4,P[1]+.7,P[2]+Math.sin(a)*2.4],t:$.CHAR,k:y.BRICK})}e.cyl(.4,.4,3.2,8,{p:[P[0],lt+16,P[2]],t:.5,k:y.METAL,arr:h+.05,gain:.25}),await l.yield();{const t=(u,n,s,m)=>{m[1]=-.3+s*6e-4};e.tube([[P[0],lt+15.2,P[2]],[P[0]-.7,-5.6,P[2]+.5],[-3.2,-5.6,P[2]+5],[-3.2,-5.6,-44],[-3.2,-5.6,-22],[-3.2-.4,-3.2,-19.5]],.34,{t:.3,k:y.METAL,gain:.53,steps:44,tension:.12,fn:t});for(let u=-24;u>P[2]+6;u-=5.5){e.box(.1,.75,.1,{p:[-3.2-.46,-5.3,u],t:.14,k:y.METAL}),e.box(.1,.75,.1,{p:[-3.2+.46,-5.3,u],t:.14,k:y.METAL});const n=new o.CylinderGeometry(.47,.47,.22,10);n.rotateX(Math.PI/2),e.add(n,{p:[-3.2,-5.6,u-2.7],t:.3,k:y.METAL,arr:-.3,gain:.53})}}for(const[t,a,u]of[[9.5,h+.035,.5],[4,h+.06,.3]]){const n=A(6.2,t,1.6),s=A(8.4,t,1.9),m=P[0]-s.x,p=P[2]-s.z,I=Math.hypot(m,p),S=P[0]-m/I*3.4,B=P[2]-p/I*3.4;e.tube([[n.x,n.y,n.z],[s.x,s.y,s.z],[(s.x+S)/2,n.y,(s.z+B)/2],[S,n.y,B]],.34,{t:.34,k:y.METAL,arr:a,gain:u});const C=new o.CylinderGeometry(.55,.55,.3,10);C.rotateZ(Math.PI/2),e.add(C,{p:[s.x,s.y,s.z],r:[0,b,0],t:.22,k:i})}await l.yield();const $t=f.LEAD,O=[0,1,0],oe=.14,Q=pt.LANE,It=pt.WELL,ae=new o.Matrix4,Rt=new o.Quaternion,vt=new o.Vector3,Ce=new o.Vector3(0,1,0),mt=new o.Vector3,ne=new o.Vector3(1,1,1),jt=(t,a,u={})=>{e.tube(t.pts,a,{t:.3,k:y.METAL,gain:.56,steps:Math.max(6,Math.round(t.samples.length*1.2)),...u,fn:(n,s,m,p)=>{p[1]=t.at(n,s,m)}});for(let n=0;n<t.pts.length-1;n++){const s=t.pts[n],m=t.pts[n+1],p=Math.hypot(m[0]-s[0],m[1]-s[1],m[2]-s[2]);if(p<5)continue;vt.set(m[0]-s[0],m[1]-s[1],m[2]-s[2]).multiplyScalar(1/p),Rt.setFromUnitVectors(Ce,vt);const I=Math.max(1,Math.round(p/4.6)),S=Math.abs(vt.y)<.2,B=vt.x,C=vt.z;for(let T=0;T<I;T++){const H=(T+.5)/I,q=s[0]+(m[0]-s[0])*H,K=s[1]+(m[1]-s[1])*H,dt=s[2]+(m[2]-s[2])*H,Dt=t.at(q,K,dt);e.add(new o.CylinderGeometry(a*1.55,a*1.55,.34,10),{m:ae.compose(mt.set(q,K,dt),Rt,ne),t:.3,k:y.METAL,arr:Dt,gain:u.gain??.56});for(let Ht=0;Ht<4;Ht++){const At=Ht*1.5708+.785;mt.set(Math.cos(At)*a*1.25,0,Math.sin(At)*a*1.25).applyQuaternion(Rt),mt.x+=q,mt.y+=K,mt.z+=dt,e.add(new o.CylinderGeometry(.11,.11,.52,5),{m:ae.compose(mt,Rt,ne),t:.18,k:y.METAL,arr:Dt,gain:.3})}if(S&&(T&1)===0){const At=-5-(K-a),Re=q+B*1.1,Ee=dt+C*1.1;for(const Se of[-1,1])e.box(.1,At,.1,{p:[Re-C*Se*(a+.08),-5-At/2,Ee+B*Se*(a+.08)],t:.13,k:y.METAL});e.box(Math.abs(C)*(a*2+.3)+.1,.1,Math.abs(B)*(a*2+.3)+.1,{p:[Re,K-a-.05,Ee],t:.13,k:y.METAL})}}}},gt=A(-1.6,16,-3),ut=r([[gt.x,gt.y,gt.z],[gt.x-.6,-5.9,gt.z-.6],[Q,-5.9,-95],[Q,-5.9,-104.5],[Q,-5.9,-116]],{start:L.leave,follow:$t*1.6});await l.yield(),jt(ut,.5),await l.yield();const se=r([[Q,-5.6,-109],[-30,-5.6,-109],[-33.8,-6.3,-111]],{start:ut.at(Q,-5.9,-109)});jt(se,.4,{gain:.5}),await l.yield();const re=r([[Q,-5.6,-100],[-2,-5.6,-100],[-1.4,-3.6,-100.6]],{start:ut.at(Q,-5.9,-100)});jt(re,.36,{gain:.46}),await l.yield();const bt=-6.3,Yt=-32.5;e.tube([[Yt,bt,-10],[Yt,bt,-40],[Yt,bt,-67],[-33.4,bt-.8,-68.6]],.42,{t:.25,k:y.METAL,steps:20});for(let t=-14;t>-67;t-=8)e.box(1.3,.14,.5,{p:[-33.3,bt-.5,t],t:.2,k:y.METAL});const wt=A(-6.55,1.6,2.2),ht=[[-33.4,-20.4,-68.6],[-30,-20.4,-71.5],[-17.4,-20.4,-81],[wt.x,wt.y,wt.z]];e.cyl(.42,.42,13.6,9,{p:[-33.4,-13.7,-68.6],t:.25,k:y.METAL}),e.tube(ht,.42,{t:.25,k:y.METAL,steps:16,tension:.02});for(const t of[-9.5,-16])e.box(.9,.16,1.3,{p:[-33.55,t,-68.6],t:.18,k:y.METAL});for(let t=0;t<4;t++){const a=.08+t*.28,u=ht[1][0]+(ht[2][0]-ht[1][0])*a,n=ht[1][2]+(ht[2][2]-ht[1][2])*a;e.box(1.5,1.2,.9,{p:[u,-21.4,n],r:[0,.65,0],t:$.CHAR,k:y.BRICK})}{const t=new o.CylinderGeometry(.66,.66,.3,10);t.rotateZ(Math.PI/2),e.add(t,{p:[wt.x-.25,wt.y,wt.z-.08],r:[0,b,0],t:.22,k:i})}await l.yield();const Et=r([[Q,-1.5,-116.1],[24,-1.5,-116.1]],{n:[0,0,-1],hw:1.45,start:ut.end,base:$.DIM,soft:!0}),ie=r([[Q,-1.5,-116.1],[-23.9,-1.5,-116.1]],{n:[0,0,-1],hw:1.45,start:ut.end,base:$.DIM,soft:!0}),Zt=r([[-23.9,-1.5,-116],[-23.9,-1.5,-163.9]],{n:[1,0,0],hw:1.45,start:ie.end,base:$.DIM,soft:!0}),Be=r([[23.9,-1.5,-116],[23.9,-1.5,-163.9]],{n:[-1,0,0],hw:1.45,start:Et.end,base:$.DIM,soft:!0}),Kt=r([[-24.6,.2,-163.9],[-24.6,19,-163.9],[24.6,19,-163.9],[24.6,1.6,-163.9],[33.9,1.6,-163.9]],{n:[0,0,1],start:Zt.end,base:oe}),De=r([[-24.6,1.6,-163.9],[-26.2,1.6,-163.9]],{n:[0,0,1],start:Zt.end,base:oe,hw:2}),St=Math.max(Kt.end+.012,.275),He=r([[33.9,1.6,-163.9],[33.9,1.6,-125.2]],{n:[-1,0,0],sched:[Kt.end,St],hw:2.4}),Ve=r([[33.9,1.6,-126.9],[33.9,20.95,-126.9]],{n:[-1,0,0],sched:[St+.02,St+.072],hw:3.3}),X=$.SLATE-.07,J=.5,_e=Math.max(Et.at(8,-1.5,-116.1),.36),Wt=r([[8,.02,-116],[8,.02,-60],[8,.02,-12],[4,.02,-5],[4,.02,-.5]],{n:O,sched:[_e,.45,J-.008,J-.003,J],base:X}),le=r([[24,.02,-116],[33.9,.02,-116]],{n:O,start:Et.end,base:X,hw:2}),he=r([[33.9,1.7,-116],[33.9,1.7,-76]],{n:[-1,0,0],start:le.end,follow:$t*1.7,hw:2.4}),qe=r([[29.5,.02,-116],[29.5,.02,-157.5]],{n:O,start:le.at(29.5,.02,-116),base:X}),ce=r([[8,.02,-102],[-31.3,.02,-102]],{n:O,start:Wt.at(8,0,-102),base:X}),Io=r([[8,.02,-69],[2.9,.02,-69]],{n:O,start:Wt.at(8,0,-69),base:X}),fe=r([[8,.02,-81],[-31.3,.02,-81]],{n:O,start:Wt.at(8,0,-81),base:X});await l.yield();const tt=[0,0,-1],et=.14,V=4,ot=t=>t.map(a=>[a[0],a[1],-.1]),Y=r(ot([[V,.1],[V,33],[V,40],[V,64]]),{n:tt,sched:[J,J+.022,J+.027,J+.045],base:et,hw:3.4}),Pt=r(ot([[V,1.7],[-33.9,1.7]]),{n:tt,start:J+.002,hw:2.4,base:et}),Oe=r([[-33.9,1.7,-.1],[-33.9,1.7,-27]],{n:[1,0,0],start:Pt.end,hw:2.4}),de=r([[V,.02,-1.6],[23.6,.02,-1.6]],{n:O,start:J,hw:2,base:X}),Qt=r(ot([[V,33],[19.4,33],[22.9,29.5],[22.9,25]]),{n:tt,start:Y.nodeArr[1],base:et}),Jt=r(ot([[V,40],[11.5,47.5],[15,47.5]]),{n:tt,sched:[Y.nodeArr[2],.588,.596],base:et}),Xe=r(ot([[V,46],[1.1,48.9],[-1.9,48.9]]),{n:tt,sched:[Y.at(V,46,-.1),.604,.611],base:et}),Nt=Y.end,pe=r(ot([[V,64],[-2,70],[-22.6,70],[-33.9,70]]),{n:tt,sched:[Nt,Nt+.006,.6,.612],base:et}),me=r(ot([[-22.6,70],[-22.6,52.5],[-23.4,49.2]]),{n:tt,sched:[.6,.609,.611],base:et}),Ue=r(ot([[V,64],[10,70],[33.9,70]]),{n:tt,sched:[Nt,Nt+.006,.625],base:et}),$e=r([[33.9,70,-.1],[33.9,70,-59.9]],{n:[-1,0,0],sched:[.625,.655],base:$.SLATE-.08}),je=r([[-33.9,70,-.1],[-33.9,70,-58]],{n:[1,0,0],sched:[.612,.67],base:$.SLATE-.08}),Ye=r(ot([[V,14],[-.5,18.5],[-.5,24],[-16,39.5]]),{n:tt,start:Y.at(V,14,0),base:et}),Ze=r([[33.9,70,-59.88],[13.5,70,-59.88],[13.5,47.2,-59.88],[.6,47.2,-59.88]],{n:[0,0,1],sched:[.655,.676,.699,.712],base:$.DIM,hw:2.3});await l.yield();const ue=.657,ct=r([[-30,48.02,-2],[-30,48.02,-57.5],[-7.6,48.02,-64],[-7.6,48.02,-150],[-14,48.02,-160.2]],{n:O,sched:[.612,.648,ue,.736,.74],base:X}),Ke=r([[-30,48.02,-22],[-31.5,48.02,-22]],{n:O,start:ct.at(-30,48,-22),hw:2}),we=r([[-7.6,48.02,-66],[-31.3,48.02,-66]],{n:O,start:ct.at(-7.6,48,-66),base:X}),ye=r([[-7.6,48.02,-87],[-31.3,48.02,-87]],{n:O,start:ct.at(-7.6,48,-87),base:X}),xe=r([[-7.6,48.02,-114],[-31.3,48.02,-114]],{n:O,start:ct.at(-7.6,48,-114),base:X}),ve=r([[-7.6,48.02,-68],[-2.9,48.02,-68]],{n:O,start:ct.at(-7.6,48,-68),base:X}),Qe=r([[-7.6,48.02,-146],[-2.9,48.02,-146]],{n:O,start:ct.at(-7.6,48,-146),base:X}),Je=r([[-.32,49,-61],[-.32,49,-110.6]],{n:[-1,0,0],sched:[ve.end,.775],hw:2.6,base:.3}),Ro=r([[-1,48.02,-110.6],[-1,48.02,-123.4]],{n:O,sched:[.775,.781],hw:1.7,base:X}),to=r([[-.32,49,-123.4],[-.32,49,-163.6]],{n:[-1,0,0],sched:[.781,.815],hw:2.6,base:.3});L.tree=Y.nodeArr[0],L.treeTop=Y.end,L.landing=ue,L.window=.74,await l.yield();const ft=[],D=(t,a,u,n,s,m,p={})=>{const I=p.step??.0015,S=p.fill??.045,B=s*Ot;ft.push({eR:p.eR??(t==="window"?9.5:7.5),eI:p.eI??(t==="window"?1.15:1.25),plume:p.plume??null,id:t,pos:new o.Vector3(...a),axis:new o.Vector3(...u),normal:new o.Vector3(...n),n:s,width:B,height:yt,arrive:m,step:I,fill:S,hung:!!p.hung,full:m+(s-1)*I+S,top:new o.Vector3(a[0],a[1]+yt,a[2]),rest:p.rest??.24})};D("rearW",[-29.2,0,-162.8],[1,0,0],[0,0,1],9,De.end),D("rearE",[32.8,0,-122.6],[0,0,1],[-1,0,0],18,St+.002,{fill:.05,step:.0027,eR:11.5,eI:1.9,plume:{R:11.5,I:1.85,h0:11,h1:11,off:3,half:5.6}}),D("east",[32.8,0,-72],[0,0,-1],[-1,0,0],14,he.end),D("kitchen",[-32.8,0,-102],[0,0,1],[1,0,0],14,ce.end),D("hall",[1.25,0,-69],[0,0,1],[1,0,0],14,.452,{fill:.085}),D("parlour",[-32.8,0,-81],[0,0,1],[1,0,0],10,fe.end),D("street2",[-8,0,-1.25],[1,0,0],[0,0,-1],12,Pt.at(-4,1.7,0)),D("street1",[-24,0,-1.25],[1,0,0],[0,0,-1],12,Pt.at(-20,1.7,0)),D("doorE",[28.4,0,-1.25],[1,0,0],[0,0,-1],10,de.end),D("stairW",[-32.8,0,-31],[0,0,1],[1,0,0],14,Oe.end),D("first",[27.6,24,-1.25],[1,0,0],[0,0,-1],12,Qt.end,{fill:.026}),D("first2",[32.8,24,-5.2],[0,0,1],[-1,0,0],7,Qt.end+.012),D("stairA",[19,47.2,-1.25],[1,0,0],[0,0,-1],10,Jt.end,{hung:!0}),D("stairB",[-6,48.4,-1.25],[-1,0,0],[0,0,-1],10,Xe.end,{hung:!0}),D("top1",[-28,48,-1.25],[-1,0,0],[0,0,-1],12,me.end,{fill:.05}),D("top2",[-32.8,48,-22],[0,0,1],[1,0,0],12,Ke.end),D("bed2",[-32.8,48,-65.9],[0,0,1],[1,0,0],7,we.end),D("bed",[-32.8,48,-87],[0,0,1],[1,0,0],7,ye.end),D("bath",[-32.8,48,-114],[0,0,1],[1,0,0],9,xe.end),D("gallery",[-1.25,48,-68],[0,0,1],[-1,0,0],12,ve.end,{eR:9.5,eI:1.5,plume:{R:8.5,I:1.35,h0:6.5,h1:15,off:2.4,half:0}}),D("gallery2",[-1.25,48,-146],[0,0,1],[-1,0,0],12,Qe.end),D("window",[-14,48,-162.6],[-1,0,0],[0,0,1],22,.74,{step:.0088,fill:.045}),L.windowFull=ft[ft.length-1].full,await l.yield();{const t=(n,s,m)=>co(w,n,s,m),a=(n,s={},m=0,p=n.pts.length-1)=>{const I=n.o.n||[0,0,0],S=s.off??.7;for(let B=m;B<p;B++){const C=n.pts[B],T=n.pts[B+1];t([C[0]+I[0]*S,C[1]+I[1]*S,C[2]+I[2]*S],[T[0]+I[0]*S,T[1]+I[1]*S,T[2]+I[2]*S],{R:4.6,I:.95,w:.012,run:!0,...s,arr:n.nodeArr[B],arr1:n.nodeArr[B+1]})}},u=A(0,5.2,x+2.4);t([u.x,u.y,u.z],null,{R:11,I:1.5,arr:h+.004,w:.024,I0:.4,flick:!0});{const n=A(0,.9,x+3),s=new o.Vector3(-6.5,-21.1,-41),m=A(0,.9,x+18),p={arr:h+.004,w:.024,I0:.45,flick:!0};t([n.x,n.y,n.z],[s.x,s.y,s.z],{R:6.6,I:1.3,...p}),t([n.x,n.y,n.z],[m.x,m.y,m.z],{R:4.6,I:.85,...p}),t([-13.6,-20.5,-38.6],[-13.6,-7.5,-38.6],{R:3.2,I:1.6,...p}),t([4.1,-20.5,-38.6],[4.1,-7.5,-38.6],{R:3.2,I:1.6,...p})}t([-3.2,-6.3,P[2]+5],[-3.2,-6.3,-22],{R:8.5,I:1.05}),a(ut,{R:7,I:1.1,off:0},1),a(se,{R:5.5,I:.8,off:0},0,1),a(re,{R:5.5,I:.8,off:0},0,1),t([It.x0+.8,-1.5,It.z0-.8],[It.x1-.8,-1.5,It.z0-.8],{R:6.5,I:1.1,arr:ie.end,arr1:Et.end,w:.012,down:!0}),a(Zt,{R:6.5,I:1.1,down:!0}),a(Be,{R:6.5,I:1.1,down:!0}),a(Kt,{R:5},0,3),a(Wt,{R:5,I:1},0,2),a(he),a(qe,{R:3.8,I:.8,prio:!0}),a(He,{R:4.6}),a(Ve,{R:6,I:1.15}),a(ce,{R:4.2}),a(fe,{R:4.2}),a(Y,{R:5.5,I:1.05},0,1),t([V,33,-.8],[V,64,-.8],{R:5.5,I:1.05,arr:Y.nodeArr[1],arr1:Y.nodeArr[3],w:.012}),a(Pt,{R:4.2}),a(de,{R:4}),a(Qt,{},0,1),t([V,40,-.8],[15,47.5,-.8],{R:4.6,I:.95,arr:Jt.nodeArr[0],arr1:Jt.nodeArr[2],w:.012}),t([-2,70,-.8],[-33.9,70,-.8],{R:4.2,I:.95,arr:pe.nodeArr[1],arr1:pe.nodeArr[3],w:.012}),a(Ue,{R:4.2},1),a(me,{},0,1),a(Ye,{R:4},2,3),a($e,{R:4}),a(je,{R:4}),a(Ze,{R:5}),a(ct,{R:5,I:1},0,3),a(Je,{R:5.4,I:1.1,off:.6}),a(to,{R:5.4,I:1.1,off:.6}),a(we,{R:4}),a(ye,{R:4}),a(xe,{R:4});for(const n of ft){const s=n.pos,m=n.axis,p=n.normal,I=Math.max(0,n.width/2-1.2);if(t([s.x-m.x*I+p.x*1.1,s.y+3.3,s.z-m.z*I+p.z*1.1],[s.x+m.x*I+p.x*1.1,s.y+3.3,s.z+m.z*I+p.z*1.1],{R:n.eR,I:n.eI,arr:n.arrive+n.fill*(n.plume?.2:.35),arr1:n.arrive+(n.n-1)*n.step+n.fill*(n.plume?.2:.35),w:n.plume?.02:n.fill*.8,prio:!!n.plume}),n.plume){const T=n.plume,H=n.arrive+n.fill*.3,q=T.half?H+(n.n-1)*n.step:H+.012;t([s.x+p.x*T.off-m.x*T.half,s.y+T.h0,s.z+p.z*T.off-m.z*T.half],[s.x+p.x*T.off+m.x*T.half,s.y+T.h1,s.z+p.z*T.off+m.z*T.half],{R:T.R,I:T.I,arr:H,arr1:q,w:.025,prio:!0})}const S=Math.atan2(p.x,p.z),B=new o.PlaneGeometry(n.width-.1,yt-1.3,Math.max(2,n.n),1),C=.865-Ge(s.x,s.y,s.z,.3);e.add(B,{p:[s.x-p.x*.95,s.y+yt*.5,s.z-p.z*.95],r:[0,S,0],t:.3,k:y.IRON,fn:(T,H,q,K)=>{const dt=((T-s.x)*m.x+(q-s.z)*m.z)/Ot+(n.n-1)/2;K[1]=n.arrive+Math.max(0,dt)*n.step+n.fill*.45,K[2]=C}}),n.n>9&&await l.yield()}}await l.yield();let Ft=0;for(const t of ft)Ft+=t.n;const ge=zo(),eo=new o.ShaderMaterial({uniforms:{uTime:w.uTime,uFront:w.uFront,uShift:w.uShift,uSun:w.uSun,uTop:w.uTop},vertexShader:Mo,fragmentShader:ko}),Mt=new o.InstancedMesh(ge,eo,Ft),kt=new Float32Array(Ft*4),be=new o.Matrix4,Me=new o.Vector3,oo=new o.Vector3(0,1,0),ke=new o.Vector3,N=new o.Vector3;let st=0;for(const t of ft){Me.copy(t.axis),ke.copy(t.normal);for(let n=0;n<t.n;n++)N.copy(t.pos).addScaledVector(t.axis,(n-(t.n-1)/2)*Ot),be.makeBasis(Me,oo,ke).setPosition(N),Mt.setMatrixAt(st,be),kt[st*4]=t.arrive+n*t.step,kt[st*4+1]=t.fill,kt[st*4+2]=t.rest,kt[st*4+3]=st*2.39%6.28,st++;const a=Math.atan2(t.normal.x,t.normal.z),u=t.width/2+.1;for(const n of[-1,1])N.copy(t.pos).addScaledVector(t.axis,n*(u-.5)),t.hung?(e.box(2,.4,.4,{p:[N.x,N.y-.2,N.z+t.normal.z*.1],r:[0,a+Math.PI/2,0],t:.2,k:y.IRON}),e.box(.4,2.4,.4,{p:[N.x-t.normal.x*.9,N.y-1.3,N.z-t.normal.z*.9],t:.2,k:y.IRON}),e.box(1.9,.3,.3,{p:[N.x-t.normal.x*.2,N.y-1.2,N.z-t.normal.z*.2],r:[a===0?.8:-.8,a,0],t:.2,k:y.IRON})):e.box(1.7,.5,.34,{p:[N.x,N.y+.25,N.z],r:[0,a+Math.PI/2,0],t:.27,k:y.IRON,arr:t.arrive,gain:.3});N.copy(t.pos).addScaledVector(t.axis,-(u+.35)),e.sph(.36,{p:[N.x,N.y+.62,N.z],t:.2,k:y.METAL,arr:t.arrive-.002,gain:.5},8,6),e.cyl(.42,.42,.12,9,{p:[N.x,N.y+1.3,N.z],t:.16,k:y.METAL}),e.cyl(.08,.08,.6,5,{p:[N.x,N.y+1,N.z],t:.16,k:y.METAL}),e.cyl(.17,.17,.62,6,{p:[N.x,N.y+.31,N.z],t:.3,k:y.METAL,arr:t.arrive-.003,gain:.56}),((st&3)===0||t.n>12)&&await l.yield()}await l.yield(),Mt.geometry.setAttribute("iA",new o.InstancedBufferAttribute(kt,4)),Mt.instanceMatrix.needsUpdate=!0,Mt.frustumCulled=!1,d.add(Mt),await l.yield();const ao=new o.ShaderMaterial({uniforms:{uTime:w.uTime,uFront:w.uFront,uShift:w.uShift,uSun:w.uSun,uPx:w.uPx,uTop:w.uTop,uDoor:w.uDoor},vertexShader:go,fragmentShader:bo,transparent:!0,depthWrite:!1,side:o.DoubleSide});await l.yield();const te=new o.Mesh(To(f.runs),ao);te.frustumCulled=!1,te.renderOrder=2,d.add(te);const Z=A(-4.6,1.4,x+1.05),zt=pt.CELLAR,ze=qt();ze.sph(.2,{s:[1,1.5,1],t:.76},8,6);const Gt=new o.Mesh(ze.build(),R);Gt.position.copy(Z),d.add(Gt);const Ae=qt();{const t=new o.RingGeometry(.25,.42,16);t.rotateX(-Math.PI/2),Ae.add(t,{t:.7})}const Ct=new o.Mesh(Ae.build(),R);Ct.position.set(Z.x,zt+.09,Z.z),d.add(Ct),await l.yield();const no=e.build();await l.yield();const Te=new o.Mesh(no,R);Te.name="boiler-and-mains",d.add(Te),await l.yield(),c.bake!==!1&&fo(w,l.quality?.detail??1);const Le=new o.Vector2;let Ie=!1,Bt=0;return{object:d,shared:w,path:M,radius:95,height:96,center:new o.Vector3(0,26,-82),ground:!1,triangles:e.triangles+Ft*(ge.index.count/3),anchors:{boiler:A(0,6,4.7),boilerTop:A(0,15,0),micaWindow:A(0,5.5,x+.6),drainCock:Z,puddle:new o.Vector3(Z.x,zt,Z.z),cylinder:new o.Vector3(P[0],P[1]+9,P[2]),mousePipe:{from:[-30,-20,-71.5],to:[-17.4,-20,-81],hole:[-16,-21.5,-81.5]},radiators:ft,keys:L,lead:$t,treeCenter:new o.Vector3(8,35,0),portal:{position:new o.Vector3(pt.WIN.x,62,-163.5),width:14,height:14}},setProgress(t){Ie=!0,Bt=Math.max(Bt,t),t<.003&&(Bt=t),w.uFront.value=Bt},update(t,a,u,n){w.uTime.value=a,Ie||(w.uFront.value=a*.03%1.15),n&&u&&(n.getDrawingBufferSize(Le),w.uPx.value=2/(Math.max(.2,u.projectionMatrix.elements[5])*Math.max(1,Le.y)));const s=w.uFront.value;xt.uniforms.uOn.value=o.MathUtils.smoothstep(s,L.burner,L.burner+.02);const m=1.9,p=a%m/m,I=Math.max(0,p-.45)/.3,S=Z.y-zt-.2,B=I<1?Z.y-S*I*I:zt-2;Gt.position.set(Z.x,B,Z.z),Gt.scale.setScalar(p<.45?.4+p*1.3:1);const C=Math.max(0,p-.75)/.25;Ct.scale.setScalar(p>.75?.6+C*2.6:.001),Ct.position.y=zt+.09-(p>.75?0:3)},dispose(){c.material}}}export{mo as GLOW_GLSL,pt as HOUSE,y as KIND,rt as NE,io as NE0,_t as NZ,at as PALETTE,ro as PATH_POINTS,$ as T,Vt as THERMAL_GLSL,co as addEmitter,Wo as addHalo,fo as bakeEmitters,Po as buildHero,qt as makeTB,yo as thermalMaterial,ho as thermalShared,Ge as wallRest};
