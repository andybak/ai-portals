import*as g from"three";import{mergeGeometries as ze}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as ye,lerp as te,smoothstep as Re}from"../kit/core.js";const $e={hero:null},Je=["#58AEE0","#2E9E4F","#14603A","#F09DBE","#F6C52E","#A8542F","#F4ECD6"];function it(e=Je){const c=e.map(x=>new g.Color(x)),o=(x,A,d)=>{const y=x.clone().convertLinearToSRGB(),q=A.clone().convertLinearToSRGB();return new g.Color().setRGB(te(y.r,q.r,d),te(y.g,q.g,d),te(y.b,q.b,d),g.SRGBColorSpace)},[r,t,h,s,n,i,m]=c,l=(x,A,d,y=.4)=>({mid:o(x,m,y),rim:o(x,A,d),base:x.clone()});return{blue:l(r,h,.2),green:l(t,h,.7,.3),greenDark:{mid:o(t,m,.2),base:o(t,h,.34),rim:o(t,h,.85)},greenPale:{mid:o(t,m,.4),base:o(t,m,.14),rim:o(t,h,.5)},deep:{mid:o(h,t,.5),rim:h.clone(),base:o(h,t,.2)},pink:l(s,i,.35),yellow:l(n,i,.35),earth:l(i,h,.25,.28),cream:{mid:m.clone(),rim:o(m,s,.4),base:o(m,s,.08)},flat:x=>({mid:x.clone(),rim:x.clone(),base:x.clone()}),mix:o,raw:{blue:r,green:t,deep:h,pink:s,yellow:n,earth:i,cream:m}}}const Le={uTime:{value:0},uBand:{value:.7},uOff:{value:new g.Vector2(.24,.14)}},ct=`
uniform float uTime; uniform float uBand; uniform vec2 uOff;
// PAINT, NOT PLASTIC (lead's note 6a). pale middle 0 .. dark rim 1 in FIVE SEEN STEPS: the pale band is broad and
// chalky (half of the form's width), then four narrower steps to the rim; the edges between steps are soft (uBand is
// the share of each step given to its soft edge) and a slight slope inside each step keeps it from reading as print.
float sgRamp(float t) {
  t = clamp(t, 0., 1.);
  float w = 0.5 * uBand;
  float q = 0.25 * (smoothstep(0.5 - 0.11 * w, 0.5 + 0.11 * w, t) + smoothstep(0.66 - 0.09 * w, 0.66 + 0.09 * w, t)
    + smoothstep(0.79 - 0.08 * w, 0.79 + 0.08 * w, t) + smoothstep(0.9 - 0.07 * w, 0.9 + 0.07 * w, t));
  return mix(q, t * t, 0.14);
}
// the grade itself: pale middle -> the pigment -> its dark rim
vec3 sgGrade(vec3 mid, vec3 base, vec3 rim, float t) {
  float q = sgRamp(t);
  vec3 c = mix(mid, base, clamp(q * 2., 0., 1.));
  return mix(c, rim, clamp(q * 2. - 1., 0., 1.));
}
// distance across a tube or ball as the eye at 'eye' sees the point 'wp' (0 middle, 1 silhouette).
// ax = the form's axis times its weight (0 on a ball). Reads the eye's place only.
float sgTube(vec3 wp, vec3 n, vec3 ax, vec3 eye) {
  vec3 v = eye - wp; v = v / max(length(v), 1e-4);
  vec3 v0 = v;
  // the pale middle sits a little off centre, and the offset walks slowly round (the medium's own motion)
  float ph = uTime * 0.6 + wp.x * 0.045 + wp.z * 0.045;      // each form in its own time, like a hand, not a lamp
  vec3 side = cross(vec3(0., 1., 0.), v);
  v = v + side * (uOff.x * cos(ph)) + vec3(0., uOff.y * (0.6 + 0.4 * sin(ph * 0.7)), 0.);
  v = v / max(length(v), 1e-4);
  float wa = length(ax); vec3 a = ax / max(wa, 1e-4); wa = min(wa, 1.);
  vec3 vp = v - a * dot(v, a);
  wa *= smoothstep(0.05, 0.4, length(vp));          // looking down the axis: fall back to the ball rule
  vec3 ne = n - a * (dot(n, a) * wa), ve = v - a * (dot(v, a) * wa);
  float c = dot(ne, ve) / max(length(ne) * length(ve), 1e-4);
  c = clamp(c, 0., 1.);
  // (the edge of the form as the eye's place truly sees it keeps its two darkest steps on BOTH sides, however far the
  // pale middle has walked: a near form turns dark toward each of its own edges)
  vec3 v0e = v0 - a * (dot(v0, a) * wa);
  float c0 = clamp(dot(ne, v0e) / max(length(ne) * length(v0e), 1e-4), 0., 1.);
  return max(sqrt(max(1. - c * c, 0.)), 1. - 1.15 * (1. - sqrt(max(1. - c0 * c0, 0.))));
}
// brush ridges along the form's length, up to 7 percent deep, near and far: their spacing is chosen from the pixel's
// footprint (fw = fwidth of the across coordinate, taken by the caller OUTSIDE any branch) so that they lie 5 to 10
// pixels apart near and far; two octaves cross-fade as the form recedes, the way a hatch thins, so nothing pops.
float sgRidge(float across, float fw) {
  float L = log2(max(fw, 1e-7) * 5.), f = fract(L), p = exp2(floor(L));
  float x = across / p;
  float a = sin(x * 6.2832) + 0.45 * sin(x * 2.4166 + 1.7);
  float b = sin(x * 3.1416) + 0.45 * sin(x * 1.2083 + 1.7);
  return 1. + 0.05 * mix(a, b, f);
}
`,lt=`
// PAINTED SHADOWS (lead's note 7a). The ground is given the shadows as a law of the place: one sun direction, read from
// a map of the valley laid at build (uShadow: every standing thing's shadow shape, soft-edged), plus the shapes that
// move: cloud shadows drifting on the clock and the wagons' shadows, which go with the cars. A shadow is a deeper tint of the
// ground's OWN pigment (toward its rim), never grey or black. It reads the place only (world x, z), never the eye.
uniform sampler2D uShadow; uniform vec4 uShRect; uniform vec4 uCloudSh[4]; uniform vec4 uCarSh[8]; uniform vec2 uCarSweep; uniform float uShAmt; uniform vec3 uShTint;
float sgShadow(vec2 p) {
  float s = textureLod(uShadow, (p - uShRect.xy) * uShRect.zw, 0.).r;
  for (int i = 0; i < 4; i++) {
    vec2 q = (p - uCloudSh[i].xy) / max(uCloudSh[i].zw, vec2(1.));
    s = max(s, 0.8 * (1. - smoothstep(0.7, 1., length(q))));
  }
  for (int i = 0; i < 8; i++) {
    vec2 a = uCarSh[i].zw, q = p - uCarSh[i].xy;
    vec2 l = vec2(dot(q, a), a.x * q.y - a.y * q.x), sw = vec2(dot(uCarSweep, a), a.x * uCarSweep.y - a.y * uCarSweep.x);
    l -= sw * clamp(dot(l, sw) / max(dot(sw, sw), 1e-4), 0., 1.);
    vec2 d = abs(l) - vec2((i == 0 || i == 4) ? 4.6 : 3.3, 1.45);
    float sd = length(max(d, 0.)) + min(max(d.x, d.y), 0.);
    s = max(s, 1. - smoothstep(-0.15, 0.5, sd));
  }
  return s;
}
`,dt=`
attribute vec3 aMid; attribute vec3 aBase; attribute vec3 aRim; attribute vec3 aG;
uniform float uTime;
uniform float uMode;
varying vec3 vMid; varying vec3 vBase; varying vec3 vRim; varying vec3 vN; varying vec3 vAx; varying vec3 vW; varying vec3 vF; varying vec2 vUv;
#ifdef SG_QUILT
varying vec4 vQ;
#endif
/*DECL*/
void main() {
  vec3 pos = position; vec3 nrm = normal; vec3 g = aG; vec3 mid = aMid; vec3 rim = aRim; vec3 bas = aBase;
  mat4 m = modelMatrix;
  #ifdef USE_INSTANCING
  m = modelMatrix * instanceMatrix;
  #endif
  /*PRE*/
  vec4 w = m * vec4(pos, 1.);
  mat3 m3 = mat3(m);
  vec3 s2 = max(vec3(dot(m3[0], m3[0]), dot(m3[1], m3[1]), dot(m3[2], m3[2])), vec3(1e-8));
  vN = m3 * (nrm / s2);
  vW = w.xyz; vUv = uv; vMid = mid; vRim = rim; vBase = bas; vAx = vec3(0.); vF = vec3(0.);
  #ifdef SG_QUILT
  vQ = vec4(0.);
  #endif
  if (uMode < 0.5) {
    float wa = length(g); vec3 a = m3 * g;
    vAx = a / max(length(a), 1e-4) * wa;
  } else if (uMode < 1.5) {
    // dome: the eye's bearing on the map, from the dome's own centre, in units of its radius
    vec3 d = cameraPosition - m[3].xyz;
    vec2 dl = vec2(dot(d, m3[0]), dot(d, m3[2])) / vec2(s2.x, s2.z);
    vec2 sh = dl / max(length(dl), 1.) * 0.25;
    float dph = uTime * 0.4 + m[3].x * 0.031 + m[3].z * 0.017;
    sh += 0.075 * vec2(cos(dph), sin(dph * 0.8));
    vF = vec3(g.x - sh.x, g.z - sh.y, g.y);
    #ifdef SG_QUILT
    vQ = vec4(g.x, g.z, floor(fract(m[3].x * 0.137 + m[3].z * 0.071) * 128.) / 128., 0.5 * (sqrt(s2.x) + sqrt(s2.z)));   // the dome's own map (unit radius), its own number, its radius in metres
    #endif
  } else if (uMode > 2.5) {
    vF = g;                                            // mode 3: aG.y = height in the form, -1 foot .. 1 top
  } else {
    // flat face: a tenth toward the eye, in the face's own plane
    vec3 d = cameraPosition - w.xyz; d = d / max(length(d), 1e-4);
    vec3 dl = vec3(dot(d, m3[0]), dot(d, m3[1]), dot(d, m3[2])) / sqrt(s2);
    dl -= nrm * dot(nrm, dl);
    vF = g - 0.1 * dl;
    // the pale middle also wanders a little in the face's own plane, on the clock (the medium's own motion)
    float fph = uTime * 0.45 + w.x * 0.05 + w.z * 0.04;
    vec3 fw3 = vec3(cos(fph), sin(fph * 0.8), cos(fph * 1.3 + 1.)); fw3 -= nrm * dot(nrm, fw3);
    vF += 0.09 * fw3;
  }
  gl_Position = projectionMatrix * viewMatrix * w;
}`,ht=`
uniform float uMode;
varying vec3 vMid; varying vec3 vBase; varying vec3 vRim; varying vec3 vN; varying vec3 vAx; varying vec3 vW; varying vec3 vF; varying vec2 vUv;
${ct}
#ifdef SG_GROUND
${lt}#endif
#ifdef SG_QUILT
// THE HILLS ARE HER SCALLOPS (lead's notes 7b and 8c). A tall dome is first of all ONE smooth form: its own grade by
// height (a pale crown over the upper half, stepping in five bands to a deep rim at the foot) and a deep far edge where
// it turns away from the eye's place, which lies against the pale middle of the hill behind. On it lie a few big
// rounded plots LAPPED LIKE FISH SCALES in the dome's own map: a crown plot, a ring of six under it, a ring of six
// under those, turned half a plot. Each plot is pale at its upper middle and darkens toward its own lower edge, which lies over the pale
// upper part of the plot below: there is no line round a plot and no straight side. Most plots are the hill's own
// green, some deeper, some paler, a few pink earth, yellow or cream. Rows of plants are thin lines of small dots
// along the dome's contours; their spacing is taken from the pixel's footprint (two octaves cross-faded), so that a
// dot is 2 to 5 pixels near and far and none is ever a large flat spot. Past the distance where a plot is a few
// pixels the hill is its plain grade. Derivatives are taken once, by the caller, outside any branch.
uniform vec3 uQMid[3]; uniform vec3 uQRim[3];
varying vec4 vQ;
float sgHash1(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
// one ring of n scales: x = how far the point lies inside the scale's lower edge (unit radius), y = the scale's number
vec2 sgScale(float r, float th, float n, float ph, float ro, float dp) {
  float a = th * n / 6.2832 + ph, f = fract(a) * 2. - 1.;
  float f2 = f * f; return vec2(ro - dp * f2 * (0.3 + 0.7 * f2) - r, mod(floor(a), n));
}
// rows of round plants on the contours, sp apart (unit radius); fr = the pixel's footprint
float sgRows(float r, float th, float sp, float fr) {
  float k = r / sp, i = floor(k), rowR = (i + 0.5) * sp;
  float nd = max(1., floor(6.2832 * rowR / (0.62 * sp)));
  vec2 c = vec2(fract(k) - 0.5, (fract(th / 6.2832 * nd + 0.37 * i) - 0.5) * 6.2832 * rowR / (nd * sp));
  float fa = fr / sp;
  return (1. - smoothstep(0.09 - fa, 0.09 + fa, length(c))) * (1. - smoothstep(0.045, 0.07, fa));
}
// a plot's pigment from its number h (0..1); h under 0.34 is the hill's own
void sgPlot(float h, out vec3 cm, out vec3 cb, out vec3 cr) {
  cm = vMid; cb = vBase; cr = vRim;
  if (h < 0.34) { }
  else if (h < 0.56) { cm = mix(vMid, vBase, 0.7); cb = mix(vBase, vRim, 0.45); }
  else if (h < 0.72) { cm = mix(vMid, uQMid[2], 0.4); cb = mix(vMid, vBase, 0.5); cr = mix(vBase, vRim, 0.75); }
  else if (h < 0.85) { cm = uQMid[0]; cb = mix(uQMid[0], uQRim[0], 0.45); cr = uQRim[0]; }
  else if (h < 0.94) { cm = uQMid[1]; cb = mix(uQMid[1], uQRim[1], 0.45); cr = uQRim[1]; }
  else { cm = mix(vMid, uQMid[2], 0.62); cb = mix(vMid, vBase, 0.4); cr = mix(vBase, vRim, 0.6); }
}
vec3 sgQuilt(vec3 plain, float t, vec2 fq, inout vec3 cBase, inout vec3 cRim) {
  // (the hill's own number is one of 128 exact steps, rounded again here: a varying carried across a triangle wobbles in
  // its last bits, and a hash of it would then pick two plots' pigments pixel by pixel)
  vec2 g = vQ.xy; float r = length(g), hh = floor(vQ.z * 128. + 0.5) / 128.;
  float th = (abs(g.x) + abs(g.y) > 1e-5) ? atan(g.y, g.x) : 0.;
  float fr = max(fq.x, fq.y) + 1e-6;
  // (the two rings have six plots each and the lower ring is turned half a plot, so every seam between two plots of a
  // ring lies under the middle of a plot of the ring above: no straight side is ever seen)
  vec2 s0 = vec2(0.47 - r, 0.);
  vec2 s1 = sgScale(r, th, 6., hh * 7., 0.75, 0.3);
  vec2 s2 = sgScale(r, th, 6., hh * 7. + 0.5, 0.96, 0.24);
  // which plot the point lies on: the innermost ring whose lower edge it is inside (soft over a pixel)
  float w0 = smoothstep(-fr, fr, s0.x), w1 = smoothstep(-fr, fr, s1.x) * (1. - w0), w2 = smoothstep(-fr, fr, s2.x) * (1. - w0) * (1. - smoothstep(-fr, fr, s1.x));
  float wf = max(1. - w0 - w1 - w2, 0.);
  float inside = w0 * s0.x / 0.13 + w1 * s1.x / 0.15 + w2 * s2.x / 0.17 + wf;
  float h = (s1.x > 0. && s0.x <= 0.) ? sgHash1(vec2(s1.y + 3., hh * 91.)) : sgHash1(vec2(s2.y + 31., hh * 57.));
  if (s0.x > 0. || (s1.x <= 0. && s2.x <= 0.)) h = 0.;
  vec3 cm, cb, cr; sgPlot(h, cm, cb, cr);
  // pale at its upper middle, darkening toward its own lower edge; the dome's own grade (five steps by height) over it
  float le = 1. - smoothstep(0., 1., inside);
  float ql = 0.5 * le * le, qd = sgRamp(t);
  float tt = 1. - (1. - ql) * (1. - 0.86 * qd);
  vec3 col = mix(mix(cm, cb, clamp(tt * 2., 0., 1.)), cr, clamp(tt * 2. - 1., 0., 1.));
  // thin contour rows of small round plants on about half of the plots
  float L = max(log2(fr * 48.), log2(5. / max(vQ.w, 1.))), sp = exp2(floor(L));     // (a plant is never under two pixels across)
  float mark = mix(sgRows(r, th, sp, fr), sgRows(r, th, sp * 2., fr), fract(L));
  mark *= step(0.42, fract(h * 7.31 + hh * 3.7)) * (1. - w0) * (1. - wf) * (1. - le);
  col = mix(col, mix(cb, cr, 0.7), 0.8 * mark);
  // too far to draw a plot: the hill's plain grade
  float far = smoothstep(0.04, 0.085, fr);
  col = mix(col, plain, far);
  cBase = mix(cb, cBase, far); cRim = mix(cr, cRim, far);
  // the deep far edge, where the dome turns away from the eye's place
  vec3 n = vN / max(length(vN), 1e-6), v = cameraPosition - vW; v = v / max(length(v), 1e-4);
  col = mix(col, vRim, 0.9 * (1. - smoothstep(0.03, 0.2, dot(n, v))));
  return col;
}
#endif
void main() {
  float fw = fwidth(vUv.x);
  #ifdef SG_QUILT
  vec2 fq = fwidth(vQ.xy);
  #endif
  float t;
  if (uMode < 0.5) {
    vec3 n = vN / max(length(vN), 1e-6);
    if (!gl_FrontFacing) n = -n;
    t = sgTube(vW, n, vAx, cameraPosition);
  } else if (uMode < 1.5) {
    float r = length(vF.xy);                           // a tall dome (vF.z = 1) steps down by HEIGHT, a flat disc by radius
    t = mix(r, 1. - pow(max(1. - r * r, 0.), 0.62), clamp(vF.z, 0., 1.));
  } else if (uMode < 2.5) {
    vec3 q = vF * vF;                                  // a rounded square: the rim runs along all the edges
    t = sqrt(sqrt(dot(q, q)));
  } else {
    // mode 3, a cut-out oval or heap (puffs, clouds): flat pale above, ONE darker under-band along its foot, the same from every side
    t = 1. - 0.52 * smoothstep(-0.56, -0.48, vF.y) - 0.28 * smoothstep(-0.82, -0.74, vF.y);
  }
  vec3 cMid = vMid, cBase = vBase, cRim = vRim;
  vec3 col = sgGrade(cMid, cBase, cRim, t);
  #ifdef SG_QUILT
  if (vF.z > 0.5) col = sgQuilt(col, t, fq, cBase, cRim);
  #endif
  col *= sgRidge(vUv.x, fw);
  #ifdef SG_GROUND
  // the shadow's colour: the ground's own pigment half way to its rim, cooled a little with the sky's blue so that
  // a shadow is never mistaken for the dark end of a plot's grade
  col = mix(col, mix(mix(cBase, cRim, 0.5), uShTint, 0.24), sgShadow(vW.xz) * uShAmt);
  #endif
  gl_FragColor = vec4(col, 1.);
}`;function be(e={}){return new g.ShaderMaterial({uniforms:{...Le,uMode:{value:e.mode??0},...e.uniforms||{}},defines:{...e.ground?{SG_GROUND:1}:{},...e.quilt?{SG_QUILT:1}:{}},vertexShader:dt.replace("/*DECL*/",e.vertexDecl||"").replace("/*PRE*/",e.vertexPre||""),fragmentShader:ht,side:e.side??g.FrontSide})}function ne(e,c){const o=e.attributes.position.count,r=new Float32Array(o*3),t=new Float32Array(o*3),h=new Float32Array(o*3);for(let s=0;s<o;s++)c.mid.toArray(r,s*3),c.rim.toArray(t,s*3),c.base.toArray(h,s*3);return e.setAttribute("aMid",new g.BufferAttribute(r,3)),e.setAttribute("aRim",new g.BufferAttribute(t,3)),e.setAttribute("aBase",new g.BufferAttribute(h,3)),e}function Pe(e,c,o){const r=new Float32Array(c*3),t=new Float32Array(c*3),h=new Float32Array(c*3);for(let s=0;s<c;s++){const n=Array.isArray(o)?o[s]:o;n.mid.toArray(r,s*3),n.rim.toArray(t,s*3),n.base.toArray(h,s*3)}return e.setAttribute("aMid",new g.InstancedBufferAttribute(r,3)),e.setAttribute("aRim",new g.InstancedBufferAttribute(t,3)),e.setAttribute("aBase",new g.InstancedBufferAttribute(h,3)),e}const p=(e=0,c=0,o=0)=>new g.Vector3(e,c,o);function me(e,c,o=18){const r=e.length,t=o+1,h=new Float32Array(r*t*3),s=new Float32Array(r*t*3),n=new Float32Array(r*t*3),i=new Float32Array(r*t*2),m=p(),l=p(),x=p(),A=p(),d=p(),y=p();let q=0;for(const u of c)q=Math.max(q,u);let N=0;for(let u=0;u<r;u++){const T=e[Math.max(0,u-1)],O=e[Math.min(r-1,u+1)];m.subVectors(O,T);const D=Math.max(m.length(),1e-6);m.multiplyScalar(1/D),u===0?(l.set(Math.abs(m.y)>.9?1:0,Math.abs(m.y)>.9?0:1,0),l.addScaledVector(m,-l.dot(m)).normalize()):(l.addScaledVector(m,-l.dot(m)),l.lengthSq()<1e-8&&l.copy(A),l.normalize(),N+=e[u].distanceTo(e[u-1])),A.copy(l),x.crossVectors(m,l);const ie=(c[Math.min(r-1,u+1)]-c[Math.max(0,u-1)])/D,j=1/Math.sqrt(1+ie*ie*2.5);for(let le=0;le<t;le++){const f=le/o*Math.PI*2,H=Math.cos(f),se=Math.sin(f),W=(u*t+le)*3;y.copy(l).multiplyScalar(H).addScaledVector(x,se),d.copy(e[u]).addScaledVector(y,c[u]),h[W]=d.x,h[W+1]=d.y,h[W+2]=d.z,y.addScaledVector(m,-ie).normalize(),s[W]=y.x,s[W+1]=y.y,s[W+2]=y.z,n[W]=m.x*j,n[W+1]=m.y*j,n[W+2]=m.z*j,i[(u*t+le)*2]=f*q,i[(u*t+le)*2+1]=N}}const F=[];for(let u=0;u<r-1;u++)for(let T=0;T<o;T++){const O=u*t+T,D=O+t;c[u]>.001&&F.push(O,O+1,D),c[u+1]>.001&&F.push(O+1,D+1,D)}const L=new g.BufferGeometry;return L.setAttribute("position",new g.BufferAttribute(h,3)),L.setAttribute("normal",new g.BufferAttribute(s,3)),L.setAttribute("aG",new g.BufferAttribute(n,3)),L.setAttribute("uv",new g.BufferAttribute(i,2)),L.setIndex(F),L}function he(e,c=e,o=e,r=10,t=7,h=0,s=!1){const n=new g.SphereGeometry(1,r,t),i=n.attributes.position,m=n.attributes.normal,l=n.attributes.uv;for(let x=0;x<i.count;x++){const A=i.getX(x),d=i.getY(x),y=i.getZ(x),q=1-h*d;i.setXYZ(x,A*e*q,d*c,y*o*q);const N=Math.hypot(A/e,d/c,y/o)||1;s?m.setXYZ(x,A,d,y):m.setXYZ(x,A/e/N,d/c/N,y/o/N),l.setXY(x,l.getX(x)*6.283*Math.max(e,o),l.getY(x)*3.14*c)}return n.setAttribute("aG",new g.BufferAttribute(new Float32Array(i.count*3),3)),n}function ft(e,c,o=6,r=10,t=.07,h=.62){const s=[],n=[],i=[],m=[],l=[],x=d=>{const y=d<h?d/h:(1-d)/(1-h);return c*.5*Math.sqrt(Math.max(0,1-(1-y)*(1-y)))*(.25+.75*Math.min(1,d*6))+(d<.12?c*.09:0)*(1-d/.12)};for(let d=0;d<2;d++){const y=d?-1:1,q=s.length/3;for(let N=0;N<=r;N++)for(let F=0;F<=o;F++){const L=N/r,u=F/o*2-1,T=x(L),O=t*c*(1-u*u)*Math.sin(Math.PI*Math.min(1,L*1.1+.03));s.push(u*T,L*e,y*O),n.push(0,0,y),i.push(u,(L*2-1)*.94,0),m.push(u*T,L*e)}for(let N=0;N<r;N++)for(let F=0;F<o;F++){const L=q+N*(o+1)+F,u=L+o+1;d?l.push(L,u,L+1,L+1,u,u+1):l.push(L,L+1,u,L+1,u+1,u)}}const A=new g.BufferGeometry;return A.setAttribute("position",new g.Float32BufferAttribute(s,3)),A.setAttribute("normal",new g.Float32BufferAttribute(n,3)),A.setAttribute("aG",new g.Float32BufferAttribute(i,3)),A.setAttribute("uv",new g.Float32BufferAttribute(m,2)),A.setIndex(l),A}function Ve(e){const c=[],o=[],r=[],t=[],h=[],s=p(),n=p(),i=p(),m=p(),l=p();for(const A of e){const d=c.length/3,y=A.length;s.subVectors(A[1],A[0]),n.subVectors(A[y-1],A[0]),i.crossVectors(s,n).normalize(),m.set(0,0,0);for(const F of A)m.add(F);m.multiplyScalar(1/y);const q=s.length()*.5,N=n.length()*.5;s.normalize(),n.addScaledVector(s,-n.dot(s)).normalize();for(const F of A){l.subVectors(F,m),c.push(F.x,F.y,F.z),o.push(i.x,i.y,i.z);let L=l.dot(s)/Math.max(q,1e-6),u=l.dot(n)/Math.max(N,1e-6);if(y===3){const T=Math.hypot(L,u)||1;L/=T,u/=T}r.push(s.x*L+n.x*u,s.y*L+n.y*u,s.z*L+n.z*u),t.push(l.dot(s),l.dot(n))}for(let F=1;F<y-1;F++)h.push(d,d+F,d+F+1)}const x=new g.BufferGeometry;return x.setAttribute("position",new g.Float32BufferAttribute(c,3)),x.setAttribute("normal",new g.Float32BufferAttribute(o,3)),x.setAttribute("aG",new g.Float32BufferAttribute(r,3)),x.setAttribute("uv",new g.Float32BufferAttribute(t,2)),x.setIndex(h),x}const pt=70,ut=30,mt=72,et=13,oe=[[50,14,72],[50,14,52],[50,14.4,20],[50,15.5,12],[49.9,18.5,1],[48.7,22.8,-9.9],[45.3,27.1,-20.4],[39.7,31.5,-29.8],[32.2,35.9,-37.8],[23.2,40.3,-44],[13,44.7,-48.1],[2.1,49.1,-49.8],[-8.8,53.4,-49.1],[-19.4,57.8,-46.2],[-29.4,62.2,-41.6],[-38.9,66.6,-36.1],[-48.1,71.1,-29.5],[-56.4,75.4,-22.3],[-64,79.8,-14.4],[-70.8,84.2,-5.8],[-75.7,88.6,4],[-76.2,93,14.9],[-71.5,97.4,24.7],[-62.7,102.3,31],[-51.8,108.3,32.4],[-41.5,114.6,28.8],[-31.9,121,23.4],[-22.4,127.3,17.9],[-12.8,133.7,12.4],[-3.3,140,6.9]];function wt(e){const c=new g.CatmullRomCurve3(oe.map(t=>p(t[0]*e,t[1],t[2])),!1,"centripetal"),o=c.getSpacedPoints(360),r=c.getLength();return{pts:o,len:r,at:t=>c.getPointAt(ye(t,0,1)),tan:t=>c.getTangentAt(ye(t,0,1))}}function ce(e,c,o=0,r=1e9){let t=1e9;const h=e.pts;for(let s=Math.max(0,o);s<Math.min(h.length,r);s++){const n=h[s].distanceToSquared(c);n<t&&(t=n)}return Math.sqrt(t)}function tt(e){const{bearing:c,reach:o,h:r,top:t,r:h}=e,s=h*1.2+1.5,n=Math.sin(c),i=Math.cos(c),m=[],l=[],x=[],A=(T,O,D,ie)=>{m.push(p(n*T,O,i*T)),l.push(D),x.push(ie)},d=o-s,y=Math.max(2,Math.round((d-6)/4.5));for(let T=0;T<=y;T++)A(te(6,d,T/y),r,h*(.94+.06*Math.sin(T/y*Math.PI)),0);for(let T=1;T<=7;T++){const O=T/7*Math.PI*.5;A(d+Math.sin(O)*s,r+s-Math.cos(O)*s,h,1)}const q=r+s,N=h*2.4,F=t-N,L=Math.max(1,Math.round((F-q)/4.5));for(let T=1;T<=L;T++){const O=T/L;A(o,te(q,F,O),h*(1+.07*Math.sin(O*Math.PI*.9)),2)}const u=l[l.length-1];for(let T=1;T<=8;T++){const O=T/8*Math.PI*.5,D=Math.sin(O);A(o,F+N*D,T===8?0:u*Math.pow(Math.cos(O),.8),3)}return e.pts=m,e.radii=l,e.kind=x,e.bendR=s,e.elbow=p(n*o,r+s,i*o),e.tip=p(n*o,t,i*o),e.dir=p(n,0,i),e}const vt=(e,c)=>{let o=1e9;for(let r=0;r<c.pts.length;r++)o=Math.min(o,ce(e,c.pts[r])-c.radii[r]);return o};function gt(e,c){let o=1e9;for(let r=0;r<e.pts.length;r++){const t=e.pts[r];if(!(t.x*t.x+t.z*t.z<361))for(let h=0;h<c.pts.length;h++){const s=c.pts[h];s.x*s.x+s.z*s.z<361||(o=Math.min(o,t.distanceTo(s)-e.radii[r]-c.radii[h]))}}return o}async function xt(e,c={},o=async()=>{}){const r=c.turn===-1?-1:1,t=wt(r),h=[];let s=0;for(;s<t.pts.length-1&&t.pts[s].y<mt;)s++;const n=t.pts[s].clone(),i=t.pts[s+1].clone().sub(t.pts[s-1]).normalize(),m=p(i.z,0,-i.x).normalize();m.dot(p(n.x,0,n.z))<0&&m.negate();const l=(d,y,q,N)=>{const F=n.clone().addScaledVector(m,d*(7.3+y*1.07));return tt({bearing:Math.atan2(F.x,F.z),reach:Math.hypot(F.x,F.z),h:q,top:N,r:y,fork:d})};h.push(l(-1,6.2,44+e()*3,104+e()*5),l(1,5.6,25+e()*3,92+e()*5));const x=(d,y,q)=>{const N=d.top;for(let F=0;F<4;F++){for(let L=0;L<9&&(tt(d),!(d.top-d.h<q+d.r*2));L++){let u=vt(t,d)>=y;if(u){for(const T of h)if(gt(d,T)<.8){u=!1;break}}if(u)return!0;d.top-=5}d.reach-=3.5,d.top=N}return!1},A=[{n:6,reach:[19.5,23],h:[66,88],top:[119,127],r:[5,5.8],rise:14},{n:7,reach:[27,32],h:[42,54],top:[82,104],r:[5.2,6.2],rise:12},{n:7,reach:[34,40],h:[15,29],top:[46,74],r:[5.2,6.4],rise:12}];for(const d of A){const y=e()*6.283;for(let q=0;q<d.n;q++){const N=e()-.5,F=e(),L=e(),u=e(),T=e();for(let O=0;O<5;O++){const D={bearing:y+(q+N*.5+O*.37)*6.283/d.n,reach:te(d.reach[0],d.reach[1],F),h:te(d.h[0],d.h[1],L),top:te(d.top[0],d.top[1],u),r:te(d.r[0],d.r[1],T),tier:A.indexOf(d)};if(x(D,et,d.rise)){h.push(D);break}}await o()}}for(let d=0;d<90&&h.length<20;d++){const y=A[1+d%2],q={bearing:e()*6.283,reach:te(y.reach[0],y.reach[1],e()),h:te(y.h[0],y.h[1]+8,e()),top:te(y.top[0],y.top[1],e()),r:te(y.r[0],y.r[1],e())*.94,tier:1+d%2};x(q,et,y.rise)&&h.push(q),d%6===5&&await o()}return{turn:r,line:t,arms:h,fork:{point:n,tangent:i,out:m,index:s,p:s/(t.pts.length-1)}}}const yt=[.55,.6,.82,1.08,1.22,1.25,1.2,1.06,.82,.47,0],ot=[0,.1,.22,.36,.5,.62,.74,.84,.92,.975,1];function Ge(e){const c=[],o=[];for(let r=0;r<ot.length;r++){const t=ot[r];c.push(e.base.clone().addScaledVector(e.n,(.3+3.5*Math.sin(t*1.5708))*e.s).add(p(0,3.3*Math.pow(t,1.7)*e.s,0))),o.push(yt[r]*e.s)}return{pts:c,radii:o}}const at=(e,c)=>{const o=Ge(c);let r=1e9;for(let t=0;t<o.pts.length;t++)r=Math.min(r,ce(e,o.pts[t])-o.radii[t]);return r};function Ie(e,c,o){const r=Math.min(e.pts.length-2,Math.floor(c)),t=c-r,h=e.pts[r],s=e.pts[r+1];return o.c.lerpVectors(h,s,t),o.t.subVectors(s,h).normalize(),o.e.set(e.dir.z,0,-e.dir.x),o.f.crossVectors(o.t,o.e).normalize(),o.r=te(e.radii[r],e.radii[r+1],t),o}function bt(e,c,o={}){const{line:r,arms:t,turn:h}=c,s=ye(o.detail??1,.6,1),n={c:p(),t:p(),e:p(),f:p(),r:0},i=p(),m=p(),l=[],x=[],A=[],d=[],y={pts:[],radii:[],dir:p(0,0,1),trunk:!0};for(let f=-3;f<=102;f+=5.25)y.pts.push(p(0,f,0)),y.radii.push(11*(1+.035*Math.sin(f/102*Math.PI)));for(let f=1;f<=9;f++){const H=f/9*Math.PI*.5;y.pts.push(p(0,102+22*Math.sin(H),0)),y.radii.push(f===9?0:11*Math.pow(Math.cos(H),.75))}const q=[y,...t];for(const f of q){const H=f.trunk?22:6,se=e()*6.283;let W=1.5;for(let U=0;U<f.pts.length-2;U++){const X=f.pts[U].distanceTo(f.pts[U+1]);for(;W<X;W+=3)if(Ie(f,U+W/X,n),!(n.r<1.2||ce(r,n.c)>34+n.r))for(let ee=0;ee<H;ee++){const Z=se+ee/H*6.283;m.copy(n.e).multiplyScalar(Math.cos(Z)).addScaledVector(n.f,Math.sin(Z)),i.copy(n.c).addScaledVector(m,n.r-.02),!(i.x*i.x+i.z*i.z<10.5*10.5&&!f.trunk)&&(ce(r,i)>30||l.push({p:i.clone(),n:m.clone()}))}W-=X}if(f.trunk)continue;if(f.fork){const U=c.fork,X=p(-U.tangent.x,0,-U.tangent.z).normalize(),ee=U.out.clone().multiplyScalar(-f.fork);for(const[Z,re,ae,J]of[[-9,.8,.45,1.3],[5,.35,-.75,1.1]]){let fe=0;for(;fe<f.pts.length-3&&f.pts[fe].y<U.point.y+Z;)fe++;for(const Be of[0,.25,.5,.8]){m.copy(X).multiplyScalar(re).addScaledVector(ee,ae-Be).normalize();const $={base:f.pts[fe].clone().addScaledVector(m,f.radii[fe]-.6),n:m.clone(),s:J,arm:f};if(at(r,$)>=5.6){x.push($);break}}}}const Me=Math.round((f.fork?3:1+e()*2.4)*s);for(let U=0,X=0;U<Me&&X<30;X++){const ee=3+e()*(f.pts.length-9),Z=e()*6.283;if(Ie(f,ee,n),m.copy(n.e).multiplyScalar(Math.cos(Z)).addScaledVector(n.f,Math.sin(Z)),m.y<-.3||(i.copy(n.c).addScaledVector(m,n.r+1.6),i.y+=2.4,i.x*i.x+i.z*i.z<256||ce(r,i)<6.5))continue;let re=!1;for(const ae of t)if(ae!==f){for(const J of ae.pts)if(J.distanceTo(i)<8.5){re=!0;break}}if(!re){{const ae={base:n.c.clone().addScaledVector(m,n.r-.6),n:m.clone(),s:.8+e()*.5,arm:f};at(r,ae)>=6&&x.push(ae)}U++}}if(f.fork){const U=c.fork,X=p(-U.tangent.x,0,-U.tangent.z).normalize(),ee=U.out.clone().multiplyScalar(-f.fork);for(const[Z,re,ae]of f.fork>0?[[4,.4,.92],[5.5,.55,.84],[7,.75,.66]]:[[2.5,.75,.66]]){let J=0;for(;J<f.pts.length-3&&f.pts[J].y<U.point.y-Z;)J++;if(m.copy(ee).multiplyScalar(re).addScaledVector(X,ae).normalize(),i.copy(f.pts[J]).addScaledVector(m,f.radii[J]*.92+.8),ce(r,i)>7){A.push({p:i.clone(),n:m.clone().add(p(0,.45,0)).normalize(),s:1.25,arm:f});break}}}const Se=f.fork?2:e()<.75?1:2;for(let U=0,X=0;U<Se&&X<40;X++){const ee=f.pts.length-2-(1.2+e()*3.2),Z=e()*6.283;if(Ie(f,ee,n),m.copy(n.e).multiplyScalar(Math.cos(Z)).addScaledVector(n.f,Math.sin(Z)).addScaledVector(n.t,.5).normalize(),i.copy(n.c).addScaledVector(m,n.r*.92+.7),ce(r,i)<6.5)continue;let re=!1;for(const ae of A)ae.p.distanceTo(i)<2.6&&(re=!0);re||(A.push({p:i.clone(),n:m.clone(),s:.9+e()*.25,arm:f}),U++)}f.shoulder=f.elbow.clone().addScaledVector(f.dir,-f.bendR*.9),f.shoulder.y=f.h+f.r*.98}const N=t.filter(f=>!f.inner).sort((f,H)=>f.h-H.h),F=Math.max(3,Math.round(6*s));let L=0;for(const f of N){const H=!!f.fork;if(!(!H&&L>=48))for(let se=0;se<F+(H?2:0);se++){const W=f.reach-f.bendR-1.2-se*(H?2.8:1.75);if(W<19)break;i.set(f.dir.x*W,f.h+f.r*(.94+.06*.9)+.36,f.dir.z*W),!(ce(r,i)<5)&&(H||L++,d.push({p:i.clone(),yaw:Math.atan2(f.dir.x,f.dir.z)+(e()<.5?1.57:-1.57)+(e()-.5)*.5,burst:H,ph:e()*6.283}))}}const u=p(oe[oe.length-1][0]*h,oe[oe.length-1][1],oe[oe.length-1][2]),T=p(oe[oe.length-3][0]*h,oe[oe.length-3][1],oe[oe.length-3][2]),O=u.clone().sub(T).normalize(),D=O.clone().negate(),ie=p().crossVectors(p(0,1,0),D).normalize(),j=p().crossVectors(D,ie).normalize();return{trunk:y,buttons:l,buds:x,fruits:A,roosts:d,flower:{centre:u,face:D,right:ie,up:j,back:O,discR:10,hingeR:8.7,petalLen:16,petalW:9.4},detail:s}}function Mt(e,c=e.blue,o=e.yellow){const r=c!==e.blue?c:{mid:e.mix(e.raw.blue,e.raw.cream,.2),base:e.raw.blue.clone(),rim:e.mix(e.raw.blue,e.raw.deep,.45)},t=(n,i,m,l,x,A=0)=>(n.translate(m,l,x),ne(n,i),n.setAttribute("aPart",new g.BufferAttribute(new Float32Array(n.attributes.position.count).fill(A),1)),n),h=[t(he(.33,.34,.6,9,6),c,0,0,0),t(he(.25,.25,.26,8,5),c,0,.27,.47),t(he(.27,.2,.46,7,4),o,0,-.17,.08),t(he(.14,.05,.8,5,4,0,!0),r,0,.02,-1.15),t(he(.09,.13,.15,5,3),o,0,.17,.72)];for(const n of[1,-1]){const i=he(.06,.62,.36,7,6,.5,!0);i.rotateZ(-n*Math.PI/2),h.push(t(he(.035,.12,.13,5,3,0,!0),e.yellow,n*.232,.24,.5),t(he(.05,.05,.05,4,2),e.flat(e.raw.deep),n*.225,.35,.6),t(i,r,n*.74,.16,-.06,n))}const s=ze(h,!1);return h.forEach(n=>n.dispose()),s}function St(){return be({mode:0,vertexDecl:"attribute float aPart; attribute vec2 aBird;",vertexPre:`float wa = aPart * mix(-1.35, 0.14 + 0.5 * sin(uTime * 7. + aBird.x), aBird.y);
      if (abs(aPart) > 0.5) { vec2 wh = vec2(aPart * 0.22, 0.16);
        pos.x = wh.x + (pos.x - wh.x) * mix(0.3, 1., aBird.y);                      // folded short on the roost
        vec2 wq = pos.xy - wh; float wc = cos(wa), ws = sin(wa);
        pos.xy = wh + vec2(wc * wq.x - ws * wq.y, ws * wq.x + wc * wq.y); nrm.xy = vec2(wc * nrm.x - ws * nrm.y, ws * nrm.x + wc * nrm.y); }
      float rk = (1. - aBird.y) * 0.07 * sin(uTime * 1.3 + aBird.x);                 // roosting: rock as one piece
      pos.xy = vec2(pos.x - rk * pos.y, pos.y + rk * pos.x);`})}const At=(e,c,o,r)=>e.setAttribute(c,new g.InstancedBufferAttribute(o,r));async function Rt(e,c={}){const o=e.rng,r=e.yield?()=>e.yield():async()=>{},t=c.pigments||it(c.palette||Je),h=await xt(o,c,r);await r();const s=bt(o,h,c);await r();const{arms:n,line:i,turn:m}=h,l=s.flower,x=new g.Group,A=be({mode:0}),d=be({mode:1}),y=be({mode:2,side:g.DoubleSide}),q=[],N=[],F=[t.green,t.greenDark,t.greenPale];q.push(ne(me(s.trunk.pts,s.trunk.radii,36),t.green));for(let a=0;a<n.length;a++){const w=n[a],k=w.fork||w.inner||w.tier===0?0:Math.floor(o()*3);w.green=k,q.push(ne(me(w.pts,w.radii,w.fork?30:20),F[k])),a%6===5&&await r()}for(const a of s.buds){const w=Ge(a);q.push(ne(me(w.pts,w.radii,16),a.arm&&a.arm.green===2?t.green:t.greenPale))}await r();{const a=l.centre,w=l.back,k=p(0,116,0),M=a.clone().addScaledVector(w,5.5),P=p(0,M.y+7,0),v=M.clone().addScaledVector(w,9),b=new g.CubicBezierCurve3(k,P,v,M),z=b.getSpacedPoints(14);N.push(...z),q.push(ne(me(z,z.map((_,S)=>3.6-.5*Math.sin(S/14*Math.PI)),18),t.green));const C=[3.6,5.4,7.6,9.2,9.95,9.9],G=[5.6,4.6,3.2,1.8,.7,.1];q.push(ne(me(G.map(_=>a.clone().addScaledVector(w,_)),C,32),t.greenPale));const Q=[],R=[];for(let _=0;_<=40;_++){const S=_/40*6.2832;Q.push(a.clone().addScaledVector(l.right,Math.cos(S)*7.5).addScaledVector(l.up,Math.sin(S)*7.5).addScaledVector(l.face,.35)),R.push(.5)}q.push(ne(me(Q,R,8),t.yellow))}const L=new g.Mesh(ze(q,!1),A);for(const a of q)a.dispose();x.add(L),await r();const u=new g.Object3D,T=p(0,1,0),O=new g.Quaternion;{const a=s.buttons.filter((k,M)=>s.detail>=1||M%5<5*s.detail),w={mid:t.cream.mid,base:t.cream.base,rim:t.mix(t.raw.cream,t.raw.pink,.7)};for(const k of[!0,!1]){const M=a.filter(b=>ce(i,b.p)<14===k),P=new g.SphereGeometry(k?.29:.22,k?12:7,k?4:2,0,6.2832,0,1.35);P.scale(1,.8,1),P.translate(0,-.05,0),P.setAttribute("aG",new g.BufferAttribute(new Float32Array(P.attributes.position.count*3),3)),Pe(P,Math.max(1,M.length),w);const v=new g.InstancedMesh(P,A,Math.max(1,M.length));u.position.set(0,60,0),u.scale.setScalar(.001),u.updateMatrix(),v.setMatrixAt(0,u.matrix),M.forEach((b,z)=>{u.position.copy(b.p),u.quaternion.setFromUnitVectors(T,b.n),u.scale.setScalar(1),u.updateMatrix(),v.setMatrixAt(z,u.matrix)}),v.frustumCulled=!1,x.add(v)}}await r();{const a=he(.62,1,.62,12,8,.16);Pe(a,s.fruits.length,t.pink);const w=new g.InstancedMesh(a,A,s.fruits.length);s.fruits.forEach((k,M)=>{u.position.copy(k.p),u.quaternion.setFromUnitVectors(T,k.n),u.scale.setScalar(k.s),u.updateMatrix(),w.setMatrixAt(M,u.matrix)}),w.frustumCulled=!1,x.add(w)}await r();const D=[{c:l.centre,face:l.face,right:l.right,up:l.up,s:1,openAt:-1,turn:.31}],ie=c.flowers===void 0?12:c.flowers|0;if(ie>1){const a=n.filter(v=>!v.fork).map(v=>{let b=0,z=1e9;return i.pts.forEach((C,G)=>{const Q=C.distanceToSquared(v.tip);Q<z&&(z=Q,b=G)}),{a:v,d:Math.sqrt(z),p:b/(i.pts.length-1)}}).filter(v=>v.d>14.5&&v.a.tip.distanceTo(l.centre)>17).sort((v,b)=>v.a.tip.distanceTo(l.centre)-b.a.tip.distanceTo(l.centre)).slice(0,ie-1),w=p(l.face.x,0,l.face.z).normalize(),k=p(),M=i.at(1-60/i.len),P=(v,b)=>{let z=1e9;for(const C of[.1,.5])for(const G of[.45,.75,1])for(let Q=0;Q<6.283;Q+=.35)k.copy(v.c).addScaledVector(v.right,Math.cos(Q)*(l.hingeR+l.petalLen*G*Math.cos(C))*b).addScaledVector(v.up,Math.sin(Q)*(l.hingeR+l.petalLen*G*Math.cos(C))*b).addScaledVector(v.face,l.petalLen*G*Math.sin(C)*b),z=Math.min(z,ce(i,k));return z};for(const v of a){const b=M.clone().sub(v.a.tip).normalize();b.y=Math.max(b.y,.3),b.addScaledVector(v.a.dir,.12).normalize(),b.dot(w)<.15&&b.addScaledVector(w,.4).normalize();const z=p().crossVectors(p(0,1,0),b).normalize(),C={c:p(),face:b,right:z,up:p().crossVectors(b,z).normalize(),s:.62,openAt:0,tip:v.a.tip};for(;C.s>.3&&(C.c.copy(v.a.tip).addScaledVector(b,3.4*C.s),!(P(C,C.s)>=6.5));C.s-=.04);if(C.c.copy(v.a.tip).addScaledVector(b,3.4*C.s),P(C,C.s)<6.5)continue;let G=0;for(;G<i.pts.length-1&&i.pts[G].distanceTo(C.c)>pt;)G++;C.openAt=G/(i.pts.length-1),D.push(C)}}const j={straight:0,eyes:[]};{const a=Math.PI/180,w=i.tan(1);for(;j.straight<i.len-1&&i.tan(1-(j.straight+1)/i.len).angleTo(w)<2*a;)j.straight++;for(let R=j.straight;R>=0;R-=2)j.eyes.push(i.at(1-R/i.len));const k=(R,_,S,V)=>{const B=(I,Y)=>{const ve=Math.max(1,Math.ceil(6.2832*I/S));for(let ue=0;ue<ve;ue++){const K=ue/ve*6.2832;V.push({c:R.c.clone().addScaledVector(R.right,Math.cos(K)*I).addScaledVector(R.up,Math.sin(K)*I).addScaledVector(R.face,Y),r:S*.7})}},E=l.discR*R.s;for(let I=0;I<=E;I+=S)B(I,_?.3:3.4*R.s*Math.pow(Math.max(0,1-(I/E)**2),.7));for(const I of[.1,.5])for(let Y=0;Y<=l.petalLen*R.s+1e-6;Y+=S)B(l.hingeR*R.s+Y*Math.cos(I),Y*Math.sin(I)-.35*R.s);return V},M=k(D[0],!0,2,[]);for(const R of[s.trunk,...n])for(let _=0;_<R.pts.length;_++)M.push({c:R.pts[_],r:R.radii[_]+.5});for(const R of N)M.push({c:R,r:3.6});const P=D.map((R,_)=>_?k(R,!1,1.5,[]):[]),v=p();let b=null,z=-1;const C=R=>{z=R,b=j.eyes.map(_=>{const S=new Float32Array(M.length*4);return M.forEach((V,B)=>{v.subVectors(V.c,_);const E=v.length(),I=E>V.r?Math.asin(V.r/E):Math.PI;S[B*4]=v.x/(E||1),S[B*4+1]=v.y/(E||1),S[B*4+2]=v.z/(E||1),S[B*4+3]=Math.cos(Math.min(Math.PI,I+R))}),S})},G=(R,_)=>{_!==z&&C(_);let S=0;for(const V of b){let B=!0;for(let E=0;E<V.length&&B;E+=4)V[E]*R.x+V[E+1]*R.y+V[E+2]*R.z>V[E+3]&&(B=!1);B&&S++}return{whole:S,eyes:j.eyes.length}};G.hits=(R,_)=>{const S=[];for(let V=1;V<D.length;V++){let B=!1;for(const E of j.eyes){for(const I of P[V]){v.subVectors(I.c,E);const Y=v.length();if(Y<=I.r||v.angleTo(R)-Math.asin(I.r/Y)<_){B=!0;break}}if(B)break}B&&S.push(V)}return S},j.test=G,$e.sunTest=G,await r();const Q=c.pickSun?await c.pickSun(G):c.sunDir?{dir:c.sunDir,drop:[]}:null;if(await r(),Q){j.candidates=D.length,j.dropped=Q.drop.length;for(const S of Q.drop.slice().sort((V,B)=>B-V))D.splice(S,1);const R=Math.atan2(Q.dir.dot(l.up),Q.dir.dot(l.right)),_=6.2832/10;D[0].turn=R-Math.round((R-.31)/_)*_}}s.flowers=D,s.budLines=s.buds.map(a=>Ge(a)),s.neck={pts:N,radii:N.map(()=>3.6)};{const a=[],w=[3,4.6,7.2,9.2,10.05,10],k=[6.4,4.8,3.2,1.8,.7,.1];for(const M of D.slice(1))a.push(ne(me(k.map(P=>M.c.clone().addScaledVector(M.face,-P*M.s)),w.map(P=>P*M.s),16),t.greenPale));if(a.length){const M=new g.Mesh(ze(a,!1),A);a.forEach(P=>P.dispose()),M.frustumCulled=!1,x.add(M)}}const le={value:1},f={value:.6},H=new g.Matrix4,se=p(),W=p(),Me=p();{const w=be({mode:2,uniforms:{uOpen:le,uClimb:f,uOpenRun:{value:ut/i.len}},vertexDecl:"attribute vec2 aPetal; uniform float uOpen; uniform float uClimb; uniform float uOpenRun;",vertexPre:`float po = aPetal.y < 0. ? uOpen : smoothstep(aPetal.y, aPetal.y + uOpenRun, uClimb);
        float pw = step(1.5, aPetal.x), px = aPetal.x - 2. * pw;      // pw: 1 on the inner whorl (every second petal), which stands up as a cup over the outer one
        po = smoothstep(px * 0.3, 0.7 + px * 0.3, po);
        // an open petal is cupped across its width and its tip curls back: modelled, never a flat cut-out
        pos.z += po * (0.05 * pos.x * pos.x - 2.6 * pos.y * pos.y * pos.y / 4096.);
        float pa = mix(2.06, mix(0.1, 0.5, pw), po) + 0.05 * po * sin(uTime * 1.2 + px * 6.2832), pc = cos(pa), ps = sin(pa);     // open petals rock, rigid
        pos.yz = vec2(pos.y * pc - pos.z * ps, pos.y * ps + pos.z * pc);
        nrm.yz = vec2(nrm.y * pc - nrm.z * ps, nrm.y * ps + nrm.z * pc);
        g.yz = vec2(g.y * pc - g.z * ps, g.y * ps + g.z * pc);`}),k=(S,V,B,E)=>{const I=S.length*10,Y=ft(l.petalLen,l.petalW+1.4,V,B,.06,.6),ve=new Float32Array(I*2);Pe(Y,I,E?Array.from({length:I},(K,xe)=>E[Math.floor(xe/10)]):t.cream);const ue=new g.InstancedMesh(Y,w,I);S.forEach((K,xe)=>{for(let pe=0;pe<10;pe++){const Ke=pe/10*6.2832+(K.turn??.31);se.copy(K.right).multiplyScalar(Math.cos(Ke)).addScaledVector(K.up,Math.sin(Ke)),W.crossVectors(se,K.face),H.makeBasis(W,se,K.face).scale(p(K.s,K.s,K.s)),Me.copy(K.c).addScaledVector(se,l.hingeR*K.s).addScaledVector(K.face,-.35*K.s),H.setPosition(Me),ue.setMatrixAt(xe*10+pe,H),ve[(xe*10+pe)*2]=pe*7%10/10*.98+2*(pe%2),ve[(xe*10+pe)*2+1]=K.openAt}}),At(Y,"aPetal",ve,2),ue.frustumCulled=!1,x.add(ue)};k(D.slice(0,1),8,18),D.length>1&&k(D.slice(1),4,8,D.slice(1).map((S,V)=>[t.pink,t.yellow,t.pink,t.yellow,t.cream][V%5]));const M=[0,3.5,7,8.7,9.6,10,9.7],P=[.3,.3,.3,.26,.05,-.5,-1.1],v=44,b=[],z=[],C=[],G=[],Q=[];for(let S=0;S<M.length;S++)for(let V=0;V<=v;V++){const B=V/v*6.2832,E=Math.cos(B),I=Math.sin(B),Y=S<4?0:S===4?.5:1;b.push(E*M[S],P[S],I*M[S]),z.push(E*Y,1-Y*.9,I*Y),C.push(E*M[S]/10,0,I*M[S]/10),G.push(B*10,M[S])}for(let S=0;S<M.length-1;S++)for(let V=0;V<v;V++){const B=S*(v+1)+V,E=B+v+1;Q.push(B,B+1,E,B+1,E+1,E)}const R=new g.BufferGeometry;R.setAttribute("position",new g.Float32BufferAttribute(b,3)),R.setAttribute("normal",new g.Float32BufferAttribute(z,3)),R.setAttribute("aG",new g.Float32BufferAttribute(C,3)),R.setAttribute("uv",new g.Float32BufferAttribute(G,2)),R.setIndex(Q);const _=(S,V,B)=>{Pe(S,V.length,B);const E=new g.InstancedMesh(S,d,V.length);V.forEach((I,Y)=>{H.makeBasis(I.right,I.face,W.crossVectors(I.right,I.face)).scale(p(I.s,I.s,I.s)),H.setPosition(I.c),E.setMatrixAt(Y,H)}),E.frustumCulled=!1,x.add(E)};if(_(R,D.slice(0,1),t.yellow),D.length>1){const S=R.clone(),V=S.attributes.position;for(let B=0;B<V.count;B++){const E=Math.min(1,Math.hypot(V.getX(B),V.getZ(B))/10);V.setY(B,V.getY(B)+3.4*Math.pow(Math.max(0,1-E*E),.7))}_(S,D.slice(1),D.slice(1).map((B,E)=>E%5===1||E%5===3?t.pink:t.yellow))}}await r();const Se=p(m*(13+o()*5),0,18+o()*5),U=m*(.25+o()*.3);{const b=o()<.75?t.pink:t.yellow,z=(...E)=>E.map(I=>p(I[0],I[1],I[2])),C=Ve([z([-2.7,0,2.3],[2.7,0,2.3],[2.7,4.1,2.3],[-2.7,4.1,2.3]),z([2.7,0,2.3],[2.7,0,-2.3],[2.7,4.1,-2.3],[2.7,4.1,2.3]),z([2.7,0,-2.3],[-2.7,0,-2.3],[-2.7,4.1,-2.3],[2.7,4.1,-2.3]),z([-2.7,0,-2.3],[-2.7,0,2.3],[-2.7,4.1,2.3],[-2.7,4.1,-2.3])]),G=2.7+.3,Q=2.3+.3,R=Ve([z([-G,4.1,Q],[G,4.1,Q],[G,6,0],[-G,6,0]),z([G,4.1,-Q],[-G,4.1,-Q],[-G,6,0],[G,6,0]),z([G,4.1,Q],[G,4.1,-Q],[G,6,0]),z([-G,4.1,-Q],[-G,4.1,Q],[-G,6,0])]),_=Ve([z([-.65,0,2.3+.08],[.65,0,2.3+.08],[.65,2.5,2.3+.08],[-.65,2.5,2.3+.08]),z([2.7+.08,0,.5],[2.7+.08,0,-.7],[2.7+.08,2.4,-.7],[2.7+.08,2.4,.5])]),S=Ve([z([-2.1,1.5,2.3+.08],[-1.2,1.5,2.3+.08],[-1.2,2.9,2.3+.08],[-2.1,2.9,2.3+.08]),z([1.2,1.5,2.3+.08],[2.1,1.5,2.3+.08],[2.1,2.9,2.3+.08],[1.2,2.9,2.3+.08]),z([-2.7-.08,1.5,.6],[-2.7-.08,2.9,.6],[-2.7-.08,2.9,-.6],[-2.7-.08,1.5,-.6])]),V=ze([ne(C,b),ne(R,t.earth),ne(_,t.flat(t.raw.deep)),ne(S,t.flat(t.raw.blue))],!1),B=new g.Mesh(V,y);B.position.copy(Se),B.rotation.y=U,x.add(B)}await r();const X=s.roosts,ee=X.length,Z=new Float32Array(ee*2),re=Mt(t,c.birdBody,c.birdBill),ae=St(),J=new g.InstancedMesh(re,ae,ee),fe=new g.InstancedBufferAttribute(Z,2);re.setAttribute("aBird",fe),J.frustumCulled=!1,x.add(J);let Be=0;const $=a=>a/i.len,Fe=[],we=[],st=n.filter(a=>a.inner||a.tier===0).map(a=>a.tip),Ce=new g.Euler,Te=p(),De=p(),Ae=p(),Ee=p(),rt=new g.Quaternion,ke=new g.Matrix4,nt=p(1,1,1),Ne=p(1.7,1.7,1.7),Qe=p(0,0,1);X.forEach((a,w)=>{if(Fe.push(new g.Quaternion().setFromEuler(Ce.set(0,a.yaw,0))),a.burst&&(a.p.y+=.28),ke.compose(a.p,Fe[w],a.burst?Ne:nt),J.setMatrixAt(w,ke),Z[w*2]=a.ph,Z[w*2+1]=0,a.burst&&Be++%2===0){const k=we.length,M=h.fork.p,P=k*5%16,v=(k%2?1:-1)*[4.6,3.1,1.5][P%3],b=Math.max(4.8+P%4*.8,Math.sqrt(6.8*6.8-v*v)),z=Math.hypot(v,b),C=Math.atan2(-b,v);we.push({i:w,p0:M-$(56)+k%8*$(4.5)+(k>>3&1)*$(2.25)+o()*$(1.5),ang:C,rho:z,lat:v,drop:b,lead:12+P*1.7+o()*.4,run:30+o()*30,pL:1,perch:null,away:!1,yaw:k*1.9})}});const qe=1-$(37.5),_e=(a,w)=>(a.lead+a.run*Re(a.p0+$(26),a.p0+$(112),w))/i.len;function Oe(a,w,k){const M=Math.min(w+_e(a,w),qe),P=Re(h.fork.p+$(9),h.fork.p+$(34),M),v=a.lat*(1+1.05*P),b=a.drop*(1+.55*P),z=Math.min(Math.hypot(v,b),11.2),C=Math.atan2(-b,v);return Ae.copy(i.tan(M)),Te.crossVectors(Ae,Qe.set(0,1,0)).normalize(),De.crossVectors(Te,Ae),k.copy(i.at(M)).addScaledVector(Te,Math.cos(C)*z).addScaledVector(De,Math.sin(C)*z)}function Ue(a,w,k,M){const P=X[a.i].p,v=Re(a.p0,a.p0+$(11),w),b=Re(a.pL-$(3.5),a.pL+$(26),w);return Oe(a,w,Ee),k.lerpVectors(P,Ee,v),b>0&&k.lerp(a.perch,b),M&&(M.setFromUnitVectors(Qe.set(0,0,1),Ae),M.slerp(Fe[a.i],1-v),b>0&&!a.away&&M.slerp(rt.setFromEuler(Ce.set(0,a.yaw,0)),b)),a.away?v:v*(1-b)}{const a=new Map,w=p(),k=p(),M=n.filter(P=>P.tip.y>96).map(P=>P.tip);for(const P of we){P.pL=1;for(let b=P.p0;b<1;b+=$(.75))if(b+_e(P,b)>=qe){P.pL=b;break}Oe(P,1,w);let v=null;for(let b=0;b<M.length&&!v;b++){const z=M[(b+P.i)%M.length];if((a.get(z)||0)>=3)continue;const C=a.get(z)||0;k.copy(z).add(p(Math.cos(C*2.1+.4)*1.5,.3-.2*C*.3,Math.sin(C*2.1+.4)*1.5));let G=!0;for(let Q=0;Q<=16&&G;Q++)ce(i,Ee.lerpVectors(w,k,Q/16))<5.2&&(G=!1);G&&(v=k.clone(),a.set(z,C+1))}v?P.perch=v:(P.away=!0,P.perch=w.clone().add(k.subVectors(w,i.at(qe)).normalize().multiplyScalar(70)).add(p(0,35,0)))}}await r();const He=oe.map(a=>p(a[0]*m,a[1],a[2])),de={flyThrough:He,fork:{position:h.fork.point.clone(),p:h.fork.p},portalSeat:{position:l.centre.clone().addScaledVector(l.face,.5),normal:l.face.clone(),radius:7},flowerCentre:l.centre.clone(),crown:p(0,130,0),houseAt:Se.clone(),shoulders:n.filter(a=>!a.inner).map(a=>a.shoulder.clone()),tips:st.map(a=>a.clone())};let ge=.6,We=-1;const Ye=p(),je=new g.Quaternion;function Xe(){if(ge!==We){We=ge;for(const a of we){const w=Ue(a,ge,Ye,je);ke.compose(Ye,je,Ne),J.setMatrixAt(a.i,ke),Z[a.i*2+1]=w}J.instanceMatrix.needsUpdate=!0,fe.needsUpdate=!0}}Xe();const Ze={object:x,radius:80,height:150,center:p(0,72,0),anchors:de,ground:!0,groundY:0,plan:h,details:s,sun:j,style:{STYLE:Le,matTube:A,matDome:d,matFace:y,pigments:t},setClimb(a){ge=ye(a,0,1),f.value=ge},setFlower(a){le.value=ye(a,0,1)},birdAt(a,w,k=p()){return Ue(we[a],w,k,null),k},burstCount:we.length,worldAnchors(){x.updateMatrixWorld(!0);const a=x.matrixWorld,w=M=>M.clone().applyMatrix4(a),k=M=>M.clone().transformDirection(a);return{flyThrough:He.map(w),fork:{position:w(de.fork.position),p:de.fork.p},portalSeat:{position:w(de.portalSeat.position),normal:k(de.portalSeat.normal),radius:7},flowerCentre:w(de.flowerCentre),crown:w(de.crown),houseAt:w(de.houseAt),shoulders:de.shoulders.map(w),tips:de.tips.map(w)}},update(a,w){Le.uTime.value=w,Xe()},dispose(){}};return $e.hero=Ze,Ze}export{ct as GRADE_GLSL,Je as PALETTE,lt as SHADOW_GLSL,Le as STYLE,$e as _debug,he as ballGeometry,Rt as buildHero,Ve as faceGeometry,be as gradeMaterial,ft as lensGeometry,Mt as macawGeometry,St as macawMaterial,it as makePigments,ne as paint,Pe as paintInstances,xt as planCactus,bt as planDetails,me as tubeGeometry};
