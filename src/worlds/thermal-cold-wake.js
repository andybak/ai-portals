import*as e from"three";import{makePath as at}from"../kit/core.js";import{buildHero as nt,makeThermalUniforms as rt,THERMAL_GLSL as Ke,R_EARTH as Z,XP as Ee,DW as s0,WAKE_BACK as De,NECK_X as ne,ycBase as st,sampleT as it,rampColors as lt}from"../parts/thermal-cold-wake.js";const We=.27,Ne=.16,qe=.062,ct=1.15,ut=-.428,ht=.62,Oe=-1.05,Ue=.52,w0=-3.4,v0=-1.38,i0=-4.75,l0=2.95,dt=-6.7,pt=270,c=-.62,re=.42,mt=-1.33,je=re-.264,K0=c+.072,ft=`
attribute vec3 color; attribute float aKind;
uniform float uTime; uniform float uLouvre;
varying vec3 vView; varying vec3 vCol; varying float vKind; varying vec3 vLoc;
void main() {
  vec3 p = position;
  float deck = step(3.5, aKind) * step(aKind, 4.5);
  p.y += deck * 0.004 * sin(uTime * 1.3 + position.x * 9. + position.z * 13.) * sin(uTime * 0.7 + position.x * 4.);
  if (aKind > 4.5 && aKind < 5.5) {
    // the radiator louvre's slats (aKind 5) turn on their own pivots, one every 0.066 m: shut over cold water, open over the stream
    float px = ${je.toFixed(3)} + floor((position.x - ${je.toFixed(3)}) / 0.066 + 0.5) * 0.066;
    vec2 q = position.xy - vec2(px, ${K0.toFixed(3)});
    float a = uLouvre * 0.95; float ca = cos(a); float sa = sin(a);
    p.xy = vec2(px, ${K0.toFixed(3)}) + vec2(ca * q.x - sa * q.y, sa * q.x + ca * q.y);
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  vView = mv.xyz; vCol = color; vKind = aKind; vLoc = position;
  gl_Position = projectionMatrix * mv;
}
`,yt=`
uniform vec3 uKey; uniform vec3 uKeyCol; uniform vec3 uEarth; uniform vec3 uFill; uniform float uGlint; uniform float uTime; uniform float uLimb;
uniform float uDay; uniform float uLouvre; uniform mat3 uRigRot;
varying vec3 vView; varying vec3 vCol; varying float vKind; varying vec3 vLoc;
const float PW = ${We.toFixed(3)}; const float PD = ${Ne.toFixed(3)}; const float PH = ${qe.toFixed(3)};
float fh(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float h1(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float sq3(float x) { return x * x; }
float hemOf(float z) { float t = clamp((-1.46 - z) / 0.05, 0., 1.); return t * t * (3. - 2. * t); }
// quilted pillow height over the deck (x, z in rig metres), with the slow ripple the vertex shader also applies
float pillow(vec2 p) {
  float fx = abs(sin(3.14159 * p.x / PW)), fz = abs(sin(3.14159 * (p.y + 0.06) / PD));
  return PH * pow(min(fx, fz) * 0.45 + fx * fz * 0.55 + 1e-5, 0.72) * (1. - hemOf(p.y))
    + 0.004 * sin(uTime * 1.3 + p.x * 9. + p.y * 13.) * sin(uTime * 0.7 + p.x * 4.);
}
// nearest crinkle facet: xy = its cell, z = distance to the crease round it (in cells)
vec3 facet(vec2 p, vec2 cs) {
  vec2 g = p / cs; vec2 ip = floor(g); vec2 fp = g - ip; float d1 = 9.; float d2 = 9.; vec2 id = ip;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)); vec2 c = ip + o;
    vec2 r = o + vec2(h1(c), h1(c + vec2(31.7, 11.3))) - fp; float dd = dot(r, r);
    if (dd < d1) { d2 = d1; d1 = dd; id = c; } else if (dd < d2) { d2 = dd; }
  }
  return vec3(id, sqrt(d2) - sqrt(d1));
}
void main() {
  vec3 dx = dFdx(vView), dy = dFdy(vView);
  vec3 n = cross(dx, dy); float nl = length(n);
  vec3 N = nl > 1e-12 ? n / nl : vec3(0., 0., 1.);
  vec3 V = normalize(-vView + vec3(0., 0., 1e-5));
  if (dot(N, V) < 0.) N = -N;
  float deck = step(3.5, vKind) * step(vKind, 4.5);
  float foil = max(1. - step(0.5, vKind), deck);
  float occ = 1.; float stitch = 0.; float gl = 0.; float fr = 1.; float flushW = 1.;
  if (deck > 0.5) {
    // the deck is a level plane of the rig, so its normal is built analytically (pillow slope + facet tilt) and then
    // turned into view space by the rig's own roll (uRigRot)
    vec2 p = vLoc.xz; float e = 0.004; float hem = hemOf(p.y);
    float hx = clamp((pillow(p + vec2(e, 0.)) - pillow(p - vec2(e, 0.))) / (2. * e), -1.3, 1.3);
    float hz = clamp((pillow(p + vec2(0., e)) - pillow(p - vec2(0., e))) / (2. * e), -1.3, 1.3);
    float fxs = abs(sin(3.14159 * p.x / PW)), fzs = abs(sin(3.14159 * (p.y + 0.06) / PD));
    float valley = mix(smoothstep(0., 0.3, min(fxs, fzs)), 1., hem);
    vec3 f1 = facet(p, vec2(0.045, 0.06)); vec3 f2 = facet(p + vec2(3.1, 1.7), vec2(0.117, 0.138));
    float ph = h1(f1.xy + vec2(5.3, 9.1)) * 6.283;
    vec2 tl = (vec2(h1(f1.xy + vec2(17., 3.)), h1(f1.xy + vec2(41., 23.))) - 0.5) * 0.84
      + 0.07 * vec2(sin(uTime * 0.9 + ph), cos(uTime * 0.7 + ph))
      + (vec2(h1(f2.xy + vec2(1.5, 0.)), h1(f2.xy + vec2(0., 7.7))) - 0.5) * 0.32;
    N = uRigRot * normalize(vec3(-hx - tl.x, 1., -hz - tl.y));
    // stitched seams: a dark pinched groove with pale thread dashes; one more row where the hem starts
    float ax = abs(fract(p.x / PW + 0.5) - 0.5) * PW, az = abs(fract((p.y + 0.06) / PD + 0.5) - 0.5) * PD;
    float am = mix(min(ax, az), 1., hem); float along = ax < az ? p.y : p.x;
    am = min(am, abs(p.y + 1.455));
    if (abs(p.y + 1.455) < 0.006) along = p.x;
    stitch = (1. - smoothstep(0.002, 0.005, am)) * step(fract(along / 0.03), 0.55);
    occ = mix(0.35, 1., valley) * (1. - 0.5 * (1. - smoothstep(0.003, 0.012, abs(p.y + 1.455))));
    // glints: hard points that slide along the creases between facets
    float crease = 1. - smoothstep(0.04, 0.26, f1.z);
    gl = crease * step(0.9, h1(f1.xy + vec2(71., 13.))) * pow(max(0., sin((p.x * 0.8 + p.y * 0.6) * 46. - uTime * 1.4 + ph)), 9.) * 7. * valley;
    fr = mix(0.45, 1., h1(f1.xy + vec2(3.3, 57.)));
    // where the field's colour may flush the quilt: each pillow's far, Earth-facing slope and the creases
    flushW = max(smoothstep(0.08, 0.6, hz + 0.5 * tl.y), 0.8 * crease);
  } else if (foil > 0.5) {
    vec3 cell = floor(vLoc * 14. + 0.37);
    vec3 jit = vec3(fh(cell), fh(cell + 7.3), fh(cell + 13.1)) - 0.5;
    N = normalize(N + jit * 0.55 + vec3(0., 0., 1e-4));
    fr = 0.5 + 0.5 * fh(cell + 3.1);
  }
  vec3 R = reflect(-V, N);
  float ndl = max(dot(N, uKey), 0.);
  float rk = max(dot(R, uKey), 0.);
  float lobe = rk * rk * rk; lobe *= lobe;                 // rk^6
  float sp = lobe * lobe * lobe; sp *= sp;                 // rk^36
  float E = dot(R, uEarth);
  vec3 col;
  if (foil > 0.5) {
    // gold foil is a tinted mirror: dark where it reflects space, flushed with the field's colour where a facet
    // looks down past the limb at the Earth, bright only in the moon's lobes
    // (the flush is held to the pillows' far slopes and the creases, and at night to 0.6 of its strength, so the
    // quilt stays mostly dark gold with the moon's cool glints and never turns to pink satin over the stream)
    float ea = smoothstep(uLimb + 0.03, uLimb + 0.17, E) * 1.25 * fr * mix(0.7, 1., smoothstep(0., 0.5, E - uLimb))
      * mix(0.6, 1., uDay) * mix(0.15, 1., flushW);
    // (by day, uDay 1, the sun lights it fully: plain sunlit gold with hard white glints)
    col = vCol * occ * (0.075 + mix(0.22, 0.72, uDay) * ndl * uKeyCol) * (1. - 0.6 * min(ea, 1.)) + vec3(1., 0.88, 0.72) * uFill * ea * occ
      + vCol * uKeyCol * (mix(0.6, 1.25, uDay) * lobe + 3. * sp) * occ + uKeyCol * gl * (1. + 1.6 * uDay);
    col = mix(col, 0.5 * uKeyCol * (0.4 + 0.6 * ndl), stitch * 0.6);
  } else {
    float earth = 0.5 + 0.5 * dot(N, uEarth);
    // metal (aKind 1, and the louvre slats, 5): the albedo sets the value (slats and frames near black, steel dark,
    // rims and lips pale), lit hard by the key with almost no flat ambient; a cool rim on grazing faces that scales
    // with the albedo, and a thin sheen of the field's colour on faces that mirror the Earth
    float slat = step(4.5, vKind) * step(vKind, 5.5);
    float metal = step(0.5, vKind) * step(vKind, 1.5) + slat;
    float rim = 1. - max(dot(N, V), 0.); rim = rim * rim * rim;
    float er = smoothstep(uLimb - 0.02, uLimb + 0.2, E);
    float lum = min(0.2 + 2.4 * dot(vCol, vec3(0.333)), 1.2);
    float panel = step(1.5, vKind) * step(vKind, 2.5);
    col = vCol * (uKeyCol * ndl * (0.6 + 0.9 * metal) * (1. - 0.2 * uDay) + uFill * (0.03 + 0.12 * earth) + vec3(0.005, 0.006, 0.01))
      + uKeyCol * sp * (0.25 + 0.95 * metal) * (0.4 + 0.6 * lum) * (1. - panel)
      + metal * (uKeyCol * (0.26 * rim + 0.12 * lobe) * lum + uFill * er * (0.03 + 0.3 * rim));
    // one highlight that wanders along the louvre, slat by slat
    col += slat * uKeyCol * 0.8 * exp(-sq3((vLoc.x - (${re.toFixed(3)} + 0.27 * sin(uTime * 0.45))) / 0.04)) * (0.25 + 0.75 * ndl);
    // the radiator plate under the slats (aKind 6): finned, glowing dull ember when the louvre opens to dump heat
    float radp = step(5.5, vKind);
    col = mix(col, vec3(0.9, 0.27, 0.05) * (0.06 + 0.8 * uLouvre) * (0.5 + 0.5 * step(0.5, fract(vLoc.z * 64.))), radp);
    // the sister's solar panels: blue-black cells with a pale grid, and their one glint
    vec2 g = fract(vLoc.xz * vec2(4.2, 5.)); float grid = min(step(g.x, 0.1) + step(g.y, 0.12), 1.);
    // (a flat panel near the mirror angle would be lit from end to end for the whole pass, so the key's own
    // highlight is all but left off them: dark cells flushed with the sea's colour until the one scripted flash)
    col += panel * (vec3(0.012, 0.035, 0.15) * (0.5 + 0.7 * earth) + 0.12 * uFill * earth + vec3(0.08, 0.105, 0.17) * grid + uKeyCol * (0.05 * sp + uGlint * 5.));
  }
  gl_FragColor = vec4(min(col, vec3(3.)), 1.);
}
`,Xe=`
varying vec3 vLoc;
uniform float uNod;
uniform vec4 uMir;   // x: km ahead of the nadir shown at the centre, y: km per metre of glass, z: cell size km, w: 0 = the scan mirror, 1 = the telescope's objective
${Ke}
void main() {
  // the false-colour sea sliding across the beryllium flat as it nods; in the objective, the water just ahead of us
  vec2 m = uCam + vec2(uMir.x + uNod * 900. - vLoc.y * uMir.y, vLoc.x * uMir.y);
  vec2 q = floor(m / uMir.z) * uMir.z + 0.5 * uMir.z;
  tFw = uMir.z;
  vec3 col = thermalRamp(thermalField(q, uT, uWake.x));
  float r = length(vLoc.xy * vec2(1., 1.5));
  vec3 mir = col * 0.85 + vec3(0.05, 0.06, 0.08) * smoothstep(0.1, 0.17, r);
  // the objective: a deep vignette, two faint coating rings and a pale crescent of the key along its upper left rim
  float rl = length(vLoc.xy) / 0.148;
  vec2 dn = vLoc.xy / max(length(vLoc.xy), 1e-4);
  float cres = smoothstep(0.7, 0.93, rl) * (1. - smoothstep(0.95, 1., rl)) * smoothstep(0.35, 0.95, dot(dn, vec2(-0.64, 0.77)));
  vec3 lens = col * (0.95 - 0.6 * smoothstep(0.55, 1., rl)) * (1. - 0.25 * step(0.5, fract(rl * 2.5 + 0.25)) * step(0.62, rl))
    + vec3(0.42, 0.5, 0.66) * cres;
  gl_FragColor = vec4(mix(mir, lens, uMir.w), 1.);
}
`,wt=`
varying vec3 vLoc;
uniform vec4 uWing;   // xy: our heading on the map, z: km of ground per cell, w: brightness
${Ke}
void main() {
  vec2 g = vLoc.xz * 8.; vec2 id = floor(g); vec2 f = g - id;
  vec2 hd = uWing.xy;
  vec2 m = uCam + hd * ((id.x + 3.) * uWing.z) + vec2(-hd.y, hd.x) * (id.y * uWing.z * 1.6);
  tFw = uWing.z;
  vec3 fire = thermalRamp(thermalField(m, uT, uWake.x));
  float hs = fract(sin(dot(id, vec2(127.1, 311.7))) * 43758.5453);
  vec3 col = vec3(0.006, 0.012, 0.05) + fire * uWing.w * (0.55 + 0.45 * hs) * (0.35 + 0.65 * smoothstep(0.02, 0.5, f.y));
  float bar = max(1. - step(0.07, f.x), 1. - step(0.09, f.y));
  col = mix(col, vec3(0.085, 0.1, 0.14) + 0.12 * fire * uWing.w, bar);
  // every fourth busbar is a wider collector
  col = mix(col, vec3(0.17, 0.19, 0.24), (1. - step(0.16, f.y)) * step(3.5, mod(id.y + 4., 4.)));
  gl_FragColor = vec4(col, 1.);
}
`,se=`
varying vec3 vLoc;
void main() { vLoc = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`,vt=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`,Mt=`
varying vec2 vUv; uniform float uPuff; uniform vec3 uKeyCol;
float ph(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float pn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(ph(i), ph(i + vec2(1., 0.)), f.x), mix(ph(i + vec2(0., 1.)), ph(i + vec2(1., 1.)), f.x), f.y); }
void main() {
  // a cold-gas thruster puff: a soft cone that leaves the nozzle (bottom centre), spreads and thins
  float p = uPuff; vec2 q = vUv - vec2(0.5, 0.06);
  float reach = 0.1 + 0.78 * p; float wd = 0.03 + (0.1 + 0.26 * p) * clamp(q.y / max(reach, 1e-3), 0., 1.);
  float body = (1. - smoothstep(wd * 0.3, wd, abs(q.x))) * smoothstep(0., 0.04, q.y) * (1. - smoothstep(reach * 0.55, reach, q.y));
  float wisp = 0.45 + 0.55 * pn(vec2(q.x * 14., q.y * 9. - p * 6.));
  float a = body * wisp * (1. - p) * (1. - p) * step(0.001, p);
  gl_FragColor = vec4(mix(vec3(0.7, 0.8, 1.), uKeyCol, 0.4) * a * 0.9, 1.);
}
`,gt=`
attribute float aMag; uniform float uPx; varying float vMag;
void main() {
  vMag = aMag;
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPx * (1.6 + 1.5 * aMag);
}
`,xt=`
uniform float uAmp; varying float vMag;
void main() {
  vec2 d = gl_PointCoord - 0.5; float a = 1. - smoothstep(0.15, 0.5, length(d));
  gl_FragColor = vec4(vec3(0.62, 0.68, 0.85) * (0.25 + 0.6 * vMag) * a * uAmp, 1.);
}
`,z0=[0,.1,.31,.52,.68],Gt=[0,254,667,818,978],bt=[2540,2400,720,720,505],Ct=[800,800,70,70,430],zt=[0,0,0,0,-424],E0=.68;function Qe(t,m,h){const f=Math.max(0,Math.min(E0,h));let u=0;for(;u<z0.length-2&&f>z0[u+1];)u++;const P=z0[u+1]-z0[u],F=(f-z0[u])/P,G=F*F,v=G*F;return(2*v-3*G+1)*t[u]+(v-2*G+F)*P*m[u]+(-2*v+3*G)*t[u+1]+(v-G)*P*m[u+1]}const E=(t,m,h)=>{const f=Math.max(0,Math.min(1,(h-t)/(m-t)));return f*f*(3-2*f)};function Q(t,m){if(m<=t[0])return t[1];for(let h=2;h<t.length;h+=2)if(m<t[h]){const f=(m-t[h-2])/(t[h]-t[h-2]);return t[h-1]+(t[h+1]-t[h-1])*f*f*(3-2*f)}return t[t.length-1]}const Pt=[0,38,.03,38,.09,47,.13,54,.16,61,.21,58,.25,56,.3,43,.34,29,.385,25,.44,26,.472,41,.52,46,.575,46,.61,43.5,.68,40],Ft=[0,0,.03,0,.085,.21,.13,-.22,.16,-.38,.2,-.05,.27,0,.3,0,.34,.14,.385,0,.54,0,.575,0,.61,.27,.67,.1,.72,.03,.79,0,.83,.2,.87,.09,.935,0],St=[0,-.5,.016,.12,.03,.12,.052,-.08,.078,-1.2,.405,-1.2,.43,-.12,.4525,-.6,.477,-.12,.507,-1.2,.534,-1.2,.562,-.1,.578,-.1,.606,-1.2,.888,-1.2,.922,0],Vt=[0,.2,.026,.2,.06,1.15,.1,1.15,.3,-2.5,.435,-2.5,.47,-1.95,.508,-1.95,.534,-5.55,.61,-5.55,.85,2.25],kt=[0,0,.028,0,.055,.24,.075,.42,.1,.42,.39,-.5,.405,-.5,.43,-.35,.475,.41,.503,.55,.538,.5,.562,.3,.578,.3,.602,.45,.88,.1,.93,0],Bt=[.356,0,.382,1,.4,1,.426,0,.582,0,.606,1,.63,1,.654,0],At=[2.5,1.6,-1.7,1.7,1.2,-4.3,1.5,3.6,-3,-.9],It=[-1.9,1.9,-1.2,-1.5,1.2,-3.5,-1.6,3.6,-3,.7],Lt=[.205,.045,-78,-20,-60,-23,-13,-38,-13,-1,-32,-16.3,11.3,-31.9,-14,36,-36],_t=[.7,.045,66,15,-50,22,17,-52,-4,44,-54],Rt=.6,Tt=[.59,0,.705,.58,.785,-.75,.797,-.75,.864,.1,.877,.1,.935,0],Kt=[.59,0,.645,-.12,.705,.15,.745,.27,.785,.06,.82,-.03,.864,-.58,.877,-.58,.935,0],Et=[0,0,.03,0,.09,.38,.15,.38,.21,0,.28,0,.34,-.12,.4,0],Dt=[.1,0,.3,1,.447,1,.474,0,.484,0,.506,1],Wt=[0,-.6,.6,-.6,.8,.6];function Nt(t,m,h){const f=(t.length-2)/3,u=Math.max(0,Math.min(f-1-1e-6,(m-t[0])/t[1])),P=Math.floor(u),F=u-P,G=F*F,v=G*F,b=2+3*Math.max(P-1,0),H=2+3*P,M=2+3*(P+1),j=2+3*Math.min(P+2,f-1),N=-.5*v+G-.5*F,J=1.5*v-2.5*G+1,S=-1.5*v+2*G+.5*F,V=.5*v-.5*G;return h.set(N*t[b]+J*t[H]+S*t[M]+V*t[j],N*t[b+1]+J*t[H+1]+S*t[M+1]+V*t[j+1],N*t[b+2]+J*t[H+2]+S*t[M+2]+V*t[j+2])}const qt=24,Ot=520,Ut=250,He=640,jt=.64,Xt=430;function Qt(t,m){return m.b=-Ot*(1-E(Ut,He,t)),m.psi=jt*(1-E(Xt,He,t)),m}async function M0(t,m){let h=0;for(const b of m)h+=b.attributes.position.count;const f=new Float32Array(h*3),u=new Float32Array(h*3),P=new Float32Array(h);let F=0,G=0;for(const b of m)f.set(b.attributes.position.array,F*3),u.set(b.attributes.color.array,F*3),P.set(b.attributes.aKind.array,F),F+=b.attributes.position.count,b.dispose(),++G%12===0&&await t.yield();const v=new e.BufferGeometry;return v.setAttribute("position",new e.BufferAttribute(f,3)),v.setAttribute("color",new e.BufferAttribute(u,3)),v.setAttribute("aKind",new e.BufferAttribute(P,1)),await t.yield(),v}async function Ye(t,m,h,f,u){const P=new Float32Array((h+1)*u*3),F=new e.Vector3,G=new e.Vector3,v=new e.Vector3,b=new e.Vector3,H=new e.Vector3;for(let S=0;S<=h;S++){m(S/h,F),m(Math.min(1,S/h+.001),G),m(Math.max(0,S/h-.001),v),v.subVectors(G,v).normalize(),b.set(0,1,0).cross(v).normalize(),H.crossVectors(v,b);for(let V=0;V<u;V++){const e0=V/u*Math.PI*2,O=Math.cos(e0)*f,c0=Math.sin(e0)*f,g0=(S*u+V)*3;P[g0]=F.x+O*b.x+c0*H.x,P[g0+1]=F.y+O*b.y+c0*H.y,P[g0+2]=F.z+O*b.z+c0*H.z}S%24===23&&await t.yield()}const M=new Float32Array(h*u*18);let j=0;const N=(S,V)=>{const e0=(S*u+V%u)*3;M[j++]=P[e0],M[j++]=P[e0+1],M[j++]=P[e0+2]};for(let S=0;S<h;S++){for(let V=0;V<u;V++)N(S,V),N(S,V+1),N(S+1,V),N(S,V+1),N(S+1,V+1),N(S+1,V);S%24===23&&await t.yield()}const J=new e.BufferGeometry;return J.setAttribute("position",new e.BufferAttribute(M,3)),J}function o(t,m,h,f){const u=t.index?t.toNonIndexed():t;for(const b of Object.keys(u.attributes))b!=="position"&&u.deleteAttribute(b);f&&u.applyMatrix4(f);const P=u.attributes.position.count,F=new e.Color(m),G=new Float32Array(P*3),v=new Float32Array(P);for(let b=0;b<P;b++)G[b*3]=F.r,G[b*3+1]=F.g,G[b*3+2]=F.b,v[b]=h;return u.setAttribute("color",new e.BufferAttribute(G,3)),u.setAttribute("aKind",new e.BufferAttribute(v,1)),t!==u&&t.dispose(),u}const n=(t,m,h,f=0,u=0,P=0,F=1,G=1,v=1)=>new e.Matrix4().compose(new e.Vector3(t,m,h),new e.Quaternion().setFromEuler(new e.Euler(f,u,P)),new e.Vector3(F,G,v)),Ht=t=>E(-1.46,-1.51,t);function ie(t,m){const h=Math.abs(Math.sin(Math.PI*t/We)),f=Math.abs(Math.sin(Math.PI*(m+.06)/Ne)),u=E(-1.56,-1.66,m);return c+.35*qe*Math.pow(Math.min(h,f)*.45+h*f*.55+1e-5,.72)*(1-Ht(m))-.075*u*u}var Zt={id:"thermal-cold-wake",name:"The Cold Wake",category:"sky",weirdness:.5,media:["space"],async build(t){const m=t.rng,h=new e.Scene;h.background=new e.Color("#030308");const f=m.int(0,2),u=m.int(0,2),P=m.int(0,2),F=m(),G=t.vary||{},v=G.hour==="dawn"||G.hour==="golden"?"dawn":G.hour==="day"?"day":G.hour==="night"||F<.62?"night":F<.86?"dawn":"day",b=!!G.rare,H=G.density??1,M=rt(),j=70,N=100,J=42,S=f===0?[380,230,100]:f===1?[110,0,0]:[380,0,0];M.uShape.value.set(S[0],S[1],S[2],0),M.uVar.value.set(f===1?.25:f===0?1.3:1,f===1?1.25:1,j,u===2?1:0);const V=i=>st(i,j,S),e0=V(ne),O=M.uRing.value,c0=M.uNeck.value;O[0].set(ne,e0-N,J,0),O[1].set(330,V(330)-250,62,.07),O[2].set(760,V(760)-260,62,.07),O[3].set(-230,V(-230)+185,62,0),f===1?(O[1].set(290,V(290)-380,140,.05),O[3].set(640,V(640)+230,55,0)):f===2&&O[3].set(-1150,V(-1150)+135,90,26),c0.set(14,N+30,220,0);const g0=[1.2,1.25,1.3][u];M.uWake.value.set(630,0,[.8,1.15,1.15][u],[1,.85,.7][u]),M.uInst.value.set(P===1?6e-4*H:0,0,P===2?1:P===1?.5:0,0),M.uStorm.value.set(0,0,g0,u),M.uStorm2.value.set(0,0,b?.9:0,0);const $e=lt();await t.yield();const P0=await nt(t,{uniforms:M});h.add(P0.object),await t.yield();const Ze=new e.Color(v==="night"?"#BFD0FF":v==="dawn"?"#FFC46A":"#FFF6E8").multiplyScalar(v==="day"?1.15:1),t0={uTime:{value:0},uKey:{value:new e.Vector3(-.55,.57,.6).normalize()},uKeyCol:{value:Ze},uEarth:{value:new e.Vector3(0,-.77,-.64)},uFill:{value:new e.Color(.02,.02,.2)},uGlint:{value:0},uLimb:{value:.46},uDay:{value:v==="day"?1:v==="dawn"?.4:0},uLouvre:{value:0},uRigRot:{value:new e.Matrix3}},m0=new e.ShaderMaterial({uniforms:t0,vertexShader:ft,fragmentShader:yt});v==="dawn"&&P0.uDawn.value.set(-.98,.1,.17).normalize().multiplyScalar(1);const u0=new e.Group,o0=new e.Group;o0.position.y=-.08,u0.add(o0);const D0="#FFCE76",le="#D9A23A",F0="#0B0C10",k="#666C78",x="#262A32",p="#B4BCCA",r=[],X=[],x0=new e.Vector3(.34,.5,.8).normalize(),ce=new e.Vector3(w0,c+.27,v0),Je=new e.Vector3(x0.z,0,-x0.x).normalize();{const i=pt,d=28,y=t.noise,s=new Float32Array((i+1)*(d+1)),I=a=>Math.fround(a*.04+dt),_=a=>Math.fround(a*(1.1/d)-.55)-1.11;for(let a=0;a<=d;a++){for(let l=0;l<=i;l++){const g=I(l),z=_(a);s[a*(i+1)+l]=ie(g,z)+.004*y.n2(g*21,z*21)}a%2===1&&await t.yield()}await t.yield();const q=new Float32Array(i*d*18);let R=0;const L=(a,l)=>{q[R++]=I(a),q[R++]=s[l*(i+1)+a],q[R++]=_(l)};for(let a=0;a<d;a++){for(let l=0;l<i;l++)L(l,a),L(l,a+1),L(l+1,a),L(l,a+1),L(l+1,a+1),L(l+1,a);a%4===3&&await t.yield()}const K=new e.BufferGeometry;K.setAttribute("position",new e.BufferAttribute(q,3)),await t.yield(),r.push(o(K,D0,4,null)),await t.yield();for(let a=0;a<85;a++){const l=-6.55+a*.1256;r.push(o(new e.CylinderGeometry(.011,.013,.014,6),k,1,n(l,ie(l,-1.618)+.006,-1.618))),a%2===0&&r.push(o(new e.CylinderGeometry(.012,.014,.012,6),p,1,n(l+.03,ie(l,-1.528)+.005,-1.528))),a%4===3&&await t.yield()}r.push(o(new e.CylinderGeometry(.014,.014,10.8,8),x,1,n(-1.3,c-.075,-1.66,0,0,Math.PI/2))),await t.yield();for(let a=0;a<3;a++){const l=[];for(let w=0;w<=55;w++){const B=-6.67+w*.196;l.push(new e.Vector3(B,c+.009+.004*Math.sin(w*1.7+a),-1.572+a*.016+.012*Math.sin(w*.63+a*.4)))}await t.yield();const g=new e.CatmullRomCurve3(l),z=await Ye(t,(w,B)=>g.getPoint(w,B),128,.0075,6);await t.yield(),r.push(o(z,a===1?"#5B6068":k,3,null)),await t.yield()}for(let a=0;a<18;a++)r.push(o(new e.BoxGeometry(.03,.024,.07),x,1,n(-6.5+a*.62,c+.012,-1.556)));await t.yield();const T=re,C=mt;r.push(o(new e.BoxGeometry(.64,.05,.22),F0,1,n(T,c+.012,C))),r.push(o(new e.BoxGeometry(.6,.004,.19),"#2A0E05",6,n(T,c+.041,C)));for(const a of[-1,1]){r.push(o(new e.BoxGeometry(.66,.022,.016),k,1,n(T,c+.05,C+a*.108,a*.5,0,0)));for(let l=0;l<9;l++)r.push(o(new e.CylinderGeometry(.006,.006,.012,6),p,1,n(T-.264+l*.066,c+.066,C+a*.1,Math.PI/2)));await t.yield()}for(let a=0;a<9;a++){const l=T-.264+a*.066;r.push(o(new e.BoxGeometry(.054,.004,.18),"#090A0F",5,n(l,K0,C,0,0,.22))),r.push(o(new e.BoxGeometry(.008,.007,.184),p,5,n(l+.0263,K0+.0059,C,0,0,.22))),a%3===2&&await t.yield()}for(const a of[-1,1])r.push(o(new e.BoxGeometry(.016,.05,.236),x,1,n(T+a*.322,c+.045,C))),r.push(o(new e.BoxGeometry(.022,.008,.24),p,1,n(T+a*.322,c+.073,C)));await t.yield();for(let a=0;a<5;a++){const l=-.42+a*.105,g=-1.29-a%2*.09;r.push(o(new e.CylinderGeometry(.046,.05,.008,14),k,1,n(l,c+.012,g))),r.push(o(new e.CylinderGeometry(.027,.034,.07,14,1,!0),x,1,n(l,c+.045,g))),r.push(o(new e.TorusGeometry(.036,.004,5,14),k,1,n(l,c+.03,g,Math.PI/2))),r.push(o(new e.TorusGeometry(.0275,.0075,6,16),p,1,n(l,c+.08,g,Math.PI/2))),r.push(o(new e.CylinderGeometry(.023,.023,.004,12),"#020203",1,n(l,c+.072,g)));for(let z=0;z<3;z++){const w=z*2.094+a;r.push(o(new e.CylinderGeometry(.005,.005,.008,5),p,1,n(l+Math.cos(w)*.041,c+.019,g+Math.sin(w)*.041)))}await t.yield()}await t.yield();const A=n;X.push(o(new e.CylinderGeometry(.1,.12,.03,18),x,1,A(0,-.262,0))),X.push(o(new e.CylinderGeometry(.075,.09,.03,18),k,1,A(0,-.236,0))),X.push(o(new e.TorusGeometry(.1,.006,5,20),p,1,A(0,-.247,0,Math.PI/2))),X.push(o(new e.BoxGeometry(.58,.026,.06),x,1,A(0,-.212,0))),X.push(o(new e.BoxGeometry(.5,.008,.066),p,1,A(0,-.197,0)));for(const a of[-1,1])X.push(o(new e.BoxGeometry(.026,.2,.05),x,1,A(a*.277,-.11,0))),X.push(o(new e.BoxGeometry(.008,.2,.056),p,1,A(a*.293,-.11,0))),X.push(o(new e.BoxGeometry(.07,.022,.04),x,1,A(a*.25,-.185,0,0,0,a*.75))),X.push(o(new e.CylinderGeometry(.034,.034,.036,12),x,1,A(a*.277,0,0,0,0,Math.PI/2))),X.push(o(new e.CylinderGeometry(.02,.02,.05,10),p,1,A(a*.283,0,0,0,0,Math.PI/2))),await t.yield();await t.yield();const D=Oe,W=-1.4;r.push(o(new e.CylinderGeometry(.085,.092,.012,16),k,1,n(D,c+.016,W))),r.push(o(new e.CylinderGeometry(.036,.05,.05,12),x,1,n(D,c+.045,W))),r.push(o(new e.TorusGeometry(.037,.006,5,14),p,1,n(D,c+.07,W,Math.PI/2))),await t.yield();for(let a=0;a<4;a++){const l=a*Math.PI/2+.6;r.push(o(new e.BoxGeometry(.05,.034,.006),k,1,n(D+Math.cos(l)*.055,c+.036,W-Math.sin(l)*.055,0,l,-.6)))}for(let a=0;a<6;a++){const l=a*1.047;r.push(o(new e.CylinderGeometry(.007,.007,.01,6),p,1,n(D+Math.cos(l)*.072,c+.026,W+Math.sin(l)*.072)))}await t.yield();for(const a of[-1,1])r.push(o(new e.BoxGeometry(.008,.05,.04),k,1,n(D+a*.03,c+.062,W)));r.push(o(new e.CylinderGeometry(.009,.009,.086,8),p,1,n(D,c+.062,W,0,0,Math.PI/2)));{const a=i0-.36,l=-1.3;r.push(o(new e.SphereGeometry(.17,20,12),le,0,n(a,c+.05,l))),r.push(o(new e.TorusGeometry(.174,.009,6,28),x,1,n(a,c+.05,l,0,.5,0))),r.push(o(new e.TorusGeometry(.174,.009,6,28),x,1,n(a,c+.05,l,0,-1.07,0))),r.push(o(new e.CylinderGeometry(.03,.036,.03,10),p,1,n(a,c+.232,l))),r.push(o(new e.CylinderGeometry(.014,.014,.05,8),k,1,n(a,c+.27,l))),r.push(o(new e.TorusGeometry(.2,.012,6,28),k,1,n(a,c+.012,l,Math.PI/2))),await t.yield(),r.push(o(new e.CylinderGeometry(.011,.011,.24,6),k,1,n(i0-.16,c+.06,-1.36,0,-.35,Math.PI/2))),r.push(o(new e.BoxGeometry(.22,.09,.17),x,1,n(i0,c+.05,-1.4))),r.push(o(new e.BoxGeometry(.24,.01,.19),p,1,n(i0,c+.099,-1.4))),r.push(o(new e.BoxGeometry(.26,.012,.21),k,1,n(i0,c+.008,-1.4)));for(let z=0;z<4;z++)r.push(o(new e.CylinderGeometry(.008,.008,.012,6),p,1,n(i0+(z%2?.115:-.115),c+.02,-1.4+(z<2?.09:-.09))));const g=[[-.055,-1.38,-.25,.4],[.06,-1.37,-.25,-.45],[0,-1.46,-.8,0]];for(const[z,w,B,U]of g){const Y=new e.Matrix4().makeRotationFromEuler(new e.Euler(B,0,U)).setPosition(i0+z,c+.105,w);r.push(o(new e.CylinderGeometry(.016,.02,.03,10),x,1,Y.clone().multiply(n(0,.012,0)))),r.push(o(new e.CylinderGeometry(.04,.014,.075,14,1,!0),p,1,Y.clone().multiply(n(0,.062,0)))),r.push(o(new e.CylinderGeometry(.036,.012,.07,14,1,!0),"#17110C",1,Y.clone().multiply(n(0,.063,0,0,0,0,-1,1,1)))),r.push(o(new e.TorusGeometry(.04,.004,5,16),p,1,Y.clone().multiply(n(0,.1,0,Math.PI/2))))}await t.yield()}{const a=new e.Matrix4().makeRotationFromEuler(new e.Euler(-.95,-.35,0)).setPosition(l0,c+.21,-1.36),l=(...g)=>a.clone().multiply(n(...g));r.push(o(new e.CylinderGeometry(.06,.07,.012,14),k,1,n(l0,c+.016,-1.36))),r.push(o(new e.CylinderGeometry(.016,.022,.19,8),x,1,n(l0,c+.11,-1.36))),r.push(o(new e.SphereGeometry(.03,10,6),k,1,n(l0,c+.2,-1.36)));for(let g=0;g<4;g++){const z=g*Math.PI/2+.4;r.push(o(new e.CylinderGeometry(.006,.006,.01,6),p,1,n(l0+Math.cos(z)*.047,c+.025,-1.36+Math.sin(z)*.047)))}await t.yield(),r.push(o(new e.ConeGeometry(.17,.06,24,2,!0),"#C9CED6",1,l(0,.04,0,Math.PI))),r.push(o(new e.TorusGeometry(.17,.006,5,24),p,1,l(0,.07,0,Math.PI/2))),r.push(o(new e.CylinderGeometry(.022,.03,.02,10),x,1,l(0,.016,0))),await t.yield();for(let g=0;g<3;g++){const z=g*2.094+.5,w=Math.cos(z),B=Math.sin(z);r.push(o(new e.CylinderGeometry(.004,.004,.206,5),k,1,l(w*.08,.135,B*.08,0,-z,.888)))}r.push(o(new e.CylinderGeometry(.014,.02,.035,8),F0,1,l(0,.2,0))),r.push(o(new e.CylinderGeometry(.021,.021,.006,8),p,1,l(0,.182,0))),await t.yield(),r.push(o(new e.BoxGeometry(.16,.05,.1),x,1,n(l0+.34,c+.03,-1.3,0,.2,0))),r.push(o(new e.BoxGeometry(.17,.006,.11),p,1,n(l0+.34,c+.058,-1.3,0,.2,0))),r.push(o(new e.CylinderGeometry(.008,.008,.26,6),k,1,n(l0+.34,c+.014,-1.45,Math.PI/2,0,0))),await t.yield()}{const a=ce,l=Je,g=Math.atan2(-l.z,l.x),z=new e.Matrix4().compose(a,new e.Quaternion().setFromUnitVectors(new e.Vector3(0,1,0),x0),new e.Vector3(1,1,1)),w=(...B)=>z.clone().multiply(n(...B));r.push(o(new e.CylinderGeometry(.2,.22,.016,22),k,1,n(w0,c+.014,v0)));for(let B=0;B<8;B++){const U=B*.785+.3;r.push(o(new e.CylinderGeometry(.007,.007,.012,6),p,1,n(w0+Math.cos(U)*.195,c+.026,v0+Math.sin(U)*.195)))}r.push(o(new e.CylinderGeometry(.07,.1,.05,16),x,1,n(w0,c+.045,v0))),r.push(o(new e.BoxGeometry(.44,.03,.09),x,1,n(w0,c+.075,v0,0,g,0))),r.push(o(new e.BoxGeometry(.4,.008,.096),p,1,n(w0,c+.093,v0,0,g,0))),await t.yield();for(const B of[-1,1]){const U=a.x+l.x*.2*B,Y=a.z+l.z*.2*B;r.push(o(new e.BoxGeometry(.024,.22,.08),x,1,n(U,a.y-.085,Y,0,g,0))),r.push(o(new e.BoxGeometry(.008,.22,.088),p,1,n(U+l.x*.015*B,a.y-.085,Y+l.z*.015*B,0,g,0))),r.push(o(new e.CylinderGeometry(.045,.045,.04,14),x,1,n(U,a.y,Y,0,g,Math.PI/2))),r.push(o(new e.CylinderGeometry(.024,.024,.06,10),p,1,n(U,a.y,Y,0,g,Math.PI/2)))}await t.yield(),r.push(o(new e.CylinderGeometry(.15,.15,.36,30,4),D0,0,w(0,0,0))),r.push(o(new e.CylinderGeometry(.15,.1,.06,24),x,1,w(0,-.21,0))),r.push(o(new e.BoxGeometry(.15,.09,.15),F0,1,w(0,-.27,0))),r.push(o(new e.BoxGeometry(.16,.008,.16),p,1,w(0,-.318,0)));for(const B of[-.1,.08])r.push(o(new e.TorusGeometry(.153,.007,5,30),x,1,w(0,B,0,Math.PI/2)));await t.yield(),r.push(o(new e.CylinderGeometry(.172,.158,.13,30,1,!0),"#0C0D11",1,w(0,.235,0))),r.push(o(new e.CylinderGeometry(.166,.15,.13,30,1,!0),"#050507",1,w(0,.235,0,0,0,0,-1,1,1))),r.push(o(new e.TorusGeometry(.17,.008,6,34),p,1,w(0,.3,0,Math.PI/2))),r.push(o(new e.TorusGeometry(.142,.007,5,30),"#30343C",1,w(0,.2,0,Math.PI/2))),await t.yield(),r.push(o(new e.CylinderGeometry(.026,.026,.24,10),k,1,w(0,.04,-.19))),r.push(o(new e.TorusGeometry(.027,.005,5,12),p,1,w(0,.16,-.19,Math.PI/2))),r.push(o(new e.CylinderGeometry(.02,.02,.004,10),"#020203",1,w(0,.161,-.19)));for(const B of[-.05,.12])r.push(o(new e.BoxGeometry(.02,.014,.05),x,1,w(0,B,-.165)));await t.yield()}}const ue=new e.Mesh(await M0(t,r),m0);ue.frustumCulled=!1,o0.add(ue),await t.yield();const h0=new e.Group;h0.position.set(ct,ut,-1.47),h0.scale.setScalar(ht),h0.rotation.y=-.6;const he=new e.Mesh(await M0(t,X),m0);he.frustumCulled=!1,h0.add(he),await t.yield();const G0=new e.Group;{const i=[];for(let I=0;I<3;I++)i.push(o(new e.TorusGeometry(.175+I*.022,.011,6,28),I===1?"#22252C":"#0C0D11",1,n(0,0,.012+I*.022,0,0,0,1,.67,1))),await t.yield();i.push(o(new e.CylinderGeometry(.2,.2,.02,28),"#0A0B0E",1,n(0,0,-.016,Math.PI/2,0,0,1,1,.67)));for(const I of[-1,1])i.push(o(new e.CylinderGeometry(.013,.013,.08,8),k,1,n(I*.235,0,0,0,0,Math.PI/2)));await t.yield();const d=new e.Mesh(await M0(t,i),m0),y=new e.CircleGeometry(.168,40);y.scale(1,.67,1);const s=new e.Mesh(y,new e.ShaderMaterial({uniforms:{...M,uNod:{value:0},uMir:{value:new e.Vector4(260,1500,6,0)}},vertexShader:se,fragmentShader:Xe}));G0.add(d,s),G0.userData.face=s}h0.add(G0),o0.add(h0),await t.yield();const W0=new e.Mesh(new e.CircleGeometry(.148,40),new e.ShaderMaterial({uniforms:{...M,uNod:{value:0},uMir:{value:new e.Vector4(105,900,3,1)}},vertexShader:se,fragmentShader:Xe}));W0.position.copy(ce).addScaledVector(x0,.186),W0.quaternion.setFromUnitVectors(new e.Vector3(0,0,1),x0),o0.add(W0),await t.yield();const d0=new e.Group;d0.position.set(Oe,-.56,-1.4);{const i=[];i.push(o(new e.CylinderGeometry(.02,.03,.62,8),k,1,n(0,.31,0)));for(let s=0;s<4;s++)i.push(o(new e.TorusGeometry(.034,.009,5,10),s%2?p:x,1,n(0,.1+s*.15,0,Math.PI/2)));await t.yield(),await t.yield();const d=await Ye(t,(s,I)=>{const _=s*Math.PI*14;return I.set(Math.cos(_)*.075,.63+s*.36,Math.sin(_)*.075)},196,.0095,5);await t.yield(),i.push(o(d,"#C9CED6",3,null)),await t.yield(),i.push(o(new e.CylinderGeometry(.1,.1,.012,16),le,0,n(0,.615,0))),i.push(o(new e.TorusGeometry(.1,.007,5,18),p,1,n(0,.615,0,Math.PI/2))),i.push(o(new e.CylinderGeometry(.008,.008,.4,5),k,1,n(0,.8,0)));const y=new e.Mesh(await M0(t,i),m0);y.frustumCulled=!1,d0.add(y)}d0.rotation.set(-.3,0,.1),d0.scale.setScalar(Ue),o0.add(d0),await t.yield();const de={uPuff:{value:0},uKeyCol:t0.uKeyCol},pe=new e.PlaneGeometry(.5,.56);pe.translate(0,.25,0);const b0=new e.Mesh(pe,new e.ShaderMaterial({uniforms:de,vertexShader:vt,fragmentShader:Mt,depthTest:!1,depthWrite:!1,transparent:!0,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneFactor}));b0.position.set(i0-.094,c+.19,-1.4),b0.rotation.z=.4,b0.frustumCulled=!1,b0.renderOrder=5,o0.add(b0),await t.yield();const n0=new e.Group;{const i=[];i.push(o(new e.BoxGeometry(.9,.9,1.1,3,3,3),D0,0,null)),i.push(o(new e.BoxGeometry(.5,.2,.6),F0,1,n(0,.55,.1))),i.push(o(new e.BoxGeometry(.92,.5,.04),p,1,n(0,0,.57))),await t.yield();for(const y of[-1,1]){i.push(o(new e.BoxGeometry(2.4,.03,.8),"#0B1230",2,n(y*1.85,0,0)));for(let s=0;s<5;s++)i.push(o(new e.BoxGeometry(.03,.06,.84),p,1,n(y*(.65+s*.6),0,0)));for(const s of[-1,1])i.push(o(new e.BoxGeometry(2.4,.045,.03),p,1,n(y*1.85,0,s*.41)));i.push(o(new e.CylinderGeometry(.035,.035,.22,6),k,1,n(y*.55,0,0,0,0,Math.PI/2))),await t.yield()}i.push(o(new e.ConeGeometry(.36,.17,16,1,!0),"#C9CED6",1,n(0,-.56,.1,Math.PI))),i.push(o(new e.CylinderGeometry(.012,.012,.3,5),k,1,n(0,-.75,.1))),i.push(o(new e.CylinderGeometry(.012,.012,.8,5),k,1,n(.3,.85,-.3))),await t.yield();const d=new e.Mesh(await M0(t,i),m0);n0.add(d)}n0.position.set(-24,7,-30),n0.scale.setScalar(2.6),u0.add(n0),await t.yield();const S0=new e.Group,me={...M,uWing:{value:new e.Vector4(1,0,12,.5)}};{const i=[],d=new Float32Array(54),y=(R,L,K,T,C,A,D,W)=>{const a=new e.Vector3(T-R,C-L,A-K),l=a.length();return o(new e.CylinderGeometry(D,D,l,6),W,1,new e.Matrix4().compose(new e.Vector3((R+T)/2,(L+C)/2,(K+A)/2),new e.Quaternion().setFromUnitVectors(new e.Vector3(0,1,0),a.normalize()),new e.Vector3(1,1,1)))};let s=0;for(let R=0;R<3;R++){const L=.25+R*.96,K=L+.9,T=(L+K)/2;for(const[C,A]of[[L,-.47],[K,-.47],[K,.47],[L,-.47],[K,.47],[L,.47]])d[s++]=C,d[s++]=0,d[s++]=A;for(const C of[-1,1])i.push(o(new e.BoxGeometry(.94,.036,.03),p,1,n(T,0,C*.485))),i.push(o(new e.BoxGeometry(.94,.012,.012),x,1,n(T,0,C*.506)));for(const C of[L-.008,K+.008])i.push(o(new e.BoxGeometry(.024,.036,1),k,1,n(C,0,0)));for(const C of[L+.03,K-.03])for(const A of[-1,1])i.push(o(new e.BoxGeometry(.07,.04,.05),x,1,n(C,0,A*.47,0,A*.78,0)));if(R<2)for(const C of[-.36,0,.36])i.push(o(new e.CylinderGeometry(.017,.017,.1,8),x,1,n(K+.03,0,C,Math.PI/2)));await t.yield()}for(const R of[-1,1])i.push(y(0,0,0,.25,0,R*.34,.016,k));i.push(y(.16,0,-.22,.16,0,.22,.01,x)),i.push(o(new e.CylinderGeometry(.04,.04,.09,10),x,1,n(0,0,0))),i.push(o(new e.BoxGeometry(.05,.045,.34),x,1,n(3.16,0,0))),i.push(o(new e.SphereGeometry(.022,8,6),p,1,n(3.2,0,0))),await t.yield();const I=new e.BufferGeometry;I.setAttribute("position",new e.BufferAttribute(d,3));const _=new e.Mesh(I,new e.ShaderMaterial({uniforms:me,vertexShader:se,fragmentShader:wt,side:e.DoubleSide}));_.frustumCulled=!1;const q=new e.Mesh(await M0(t,i),m0);q.frustumCulled=!1,S0.add(_,q)}u0.add(S0),h.add(u0),await t.yield();const N0=Math.round(2500*(t.quality?.detail??1)),V0=new Float32Array(N0*3),fe=new Float32Array(N0),q0=m.fork("stars");for(let i=0;i<N0;i++){const d=q0.range(-1,1),y=q0.range(0,Math.PI*2),s=Math.sqrt(1-d*d);V0[i*3]=s*Math.cos(y)*5e3,V0[i*3+1]=d*5e3,V0[i*3+2]=s*Math.sin(y)*5e3,fe[i]=Math.pow(q0(),2.2),i%400===399&&await t.yield()}await t.yield();const O0=new e.BufferGeometry;O0.setAttribute("position",new e.BufferAttribute(V0,3)),O0.setAttribute("aMag",new e.BufferAttribute(fe,1));const ye={uPx:{value:1},uAmp:{value:v==="day"?.3:v==="dawn"?.7:1}},r0=new e.Points(O0,new e.ShaderMaterial({uniforms:ye,vertexShader:gt,fragmentShader:xt,depthTest:!1,depthWrite:!1,blending:e.AdditiveBlending,transparent:!1}));r0.material.blending=e.CustomBlending,r0.material.blendSrc=e.OneFactor,r0.material.blendDst=e.OneFactor,r0.frustumCulled=!1,r0.renderOrder=-20,h.add(r0),await t.yield();const f0=new e.Mesh(new e.CircleGeometry(27,40),new e.ShaderMaterial({vertexShader:"void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"void main() { gl_FragColor = vec4(0.); }",colorWrite:!1,depthWrite:!0,depthTest:!0}));f0.position.set(0,0,-658),f0.renderOrder=-5,f0.frustumCulled=!1,h.add(f0);const et=new e.Vector3,k0=new e.Vector3,y0=new e.Vector3,U0=new e.Vector3,B0=new e.Vector3,C0=new e.Vector3,we=new e.Matrix4,tt=new e.Vector3(0,1,0);await t.yield();const ve=at([[0,0,0],[0,0,-220],[0,0,-440],[0,0,-660]]);await t.yield();const p0=P0.object,A0=new e.Vector3,j0=new e.Vector3,Me=new e.Vector3,ge=new e.Vector3,X0=new e.Vector3,Q0=new e.Vector3,H0=new e.Vector3,xe=new e.Vector3,Ge=new e.Vector3,Y0=new e.Matrix4,I0=new e.Vector3,$0=new e.Quaternion,Z0={h:800,p:.66,s:0},a0={b:0,psi:0},be=new e.Vector3(0,0,1),J0=new e.Quaternion,Ce=new e.Quaternion,L0=new e.Vector3;function ze(i,d){const y=Math.min(Math.max(i,0),E0),s=y>.31&&y<.45?Math.sin(Math.PI*(y-.31)/.14):0,I=Qe(Ct,zt,y)-qt*s*s,_=Q(Pt,y)*Math.PI/180,q=Qe(Gt,bt,y),R=q/Z;Qt(q,a0),a0.psi+=Q(Et,y);const L=a0.b/Z,K=Math.cos(R),T=Math.sin(R),C=Math.cos(L),A=Math.sin(L),D=Math.cos(a0.psi),W=Math.sin(a0.psi);Z0.h=I,Z0.p=_,Z0.s=q,A0.set(A,C*K,-C*T),Q0.set(0,-T,-K),H0.set(C,-A*K,A*T),j0.copy(Q0).multiplyScalar(D).addScaledVector(H0,W),xe.copy(H0).multiplyScalar(D).addScaledVector(Q0,-W),X0.copy(A0).multiplyScalar(Z+I),X0.y-=Z,Me.copy(j0).multiplyScalar(Math.cos(_)).addScaledVector(A0,-Math.sin(_)),ge.copy(A0).multiplyScalar(Math.cos(_)).addScaledVector(j0,Math.sin(_)),Y0.makeBasis(xe,ge,Me.negate()).transpose(),p0.quaternion.setFromRotationMatrix(Y0),ve.pointAt(y,Ge),p0.position.copy(Ge).sub(X0.applyMatrix4(Y0)),J0.setFromAxisAngle(be,Q(Ft,i)+Math.asin(Math.max(-.8,Math.min(.8,Math.tan(_)*Math.tan(d))))*E(.56,.6,i)),p0.quaternion.premultiply(J0),p0.position.applyQuaternion(J0)}ze(0,0),await t.yield();const Pe=new e.Color;let Fe=-1,ee=0;const Se=[0,0,.6,0,1.2,0,.4,.8,.4,-.6],_0=[Ee[0]-s0[0]*De,Ee[1]-s0[1]*De],Ve=new e.Vector2,te=(i,d,y,s,I)=>i<d?-1e5:i>y?1e5:s+(i-d)/(y-d)*I,ke=i=>14-11*E(.3,.42,i)-9.5*E(.44,.494,i)-26*E(.494,.52,i);return{scene:h,path:ve,duration:44,camera:{fov:60,near:.3,far:9e3,lookAhead:20,sway:0,bank:0},pois:[{at:(i,d)=>et.set(100*Math.tan(Q(Tt,d)),100*Math.tan(Q(Kt,d)),-660*d-100),from:.5,to:.95,weight:Rt,fade:.06}],portal:{shape:"circle",radius:7,color:"#BFF3EE",glow:1,revealDistance:260,tilt:!1,blendDistance:30},post:{exposure:1,flat:1,bloom:{strength:.2,radius:.5,threshold:1},grade:{saturation:1,contrast:1,vignette:0,grain:0}},ride:"none",style:"none",update(i,d,y,s){y.getWorldDirection(L0),ze(s,Math.atan2(L0.x,-L0.z));const I=E(.5,.68,s);M.uVar.value.z=j-25*E(.495,.56,s),O[0].set(ne+446*I,e0-N-30*Math.sin(Math.PI*I)+21*I,J,.06*E(.5,.56,s)),c0.w=ke(s),c0.x=ke(s-.07),M.uFront.value.set(te(s,.39,.47,492,620),te(s,.765,.815,450,1600),te(s,.84,.95,781,1719));const _=760+300*Math.min(s,E0)+1720*Math.max(0,s-E0)+1e3*Math.max(0,s-.795);M.uStorm.value.x=_0[0]+s0[0]*_,M.uStorm.value.y=_0[1]+s0[1]*_,b&&(M.uStorm2.value.x=_0[0]+s0[0]*(_-250)-s0[1]*110,M.uStorm2.value.y=_0[1]+s0[1]*(_-250)+s0[0]*110,M.uWake.value.y=_-270),P0.update(i,d,y);const q=1-E(.625,.64,s);f0.scale.setScalar(Math.max(q,.001)),f0.visible=q>.004,y.getWorldPosition(I0),y.getWorldQuaternion($0),u0.visible=!t.through,u0.position.copy(I0),u0.quaternion.copy($0);const R=Q(kt,s),L=Math.cos(R),K=Math.sin(R);o0.position.set(-Q(Vt,s),-.08+Q(St,s),0).applyAxisAngle(be,R),o0.rotation.set(0,0,R),t0.uRigRot.value.set(L,-K,0,K,L,0,0,0,1),r0.position.copy(I0),r0.quaternion.copy(p0.quaternion),t.renderer.getDrawingBufferSize(Ve),ye.uPx.value=Math.max(1,Ve.y/450),t0.uTime.value=d,Ce.copy($0).invert(),t0.uEarth.value.copy(L0.set(0,-Z,0).applyQuaternion(p0.quaternion).add(p0.position).sub(I0).normalize().applyQuaternion(Ce));const T=M.uCamL.value,C=Math.max(Z+1,Math.hypot(T.x,T.y+Z,T.z)),A=Z/C;t0.uLimb.value=Math.sqrt(Math.max(0,1-A*A));const D=Math.max(60,Math.min(200,C-Z)),W=Math.cos(a0.psi),a=Math.sin(a0.psi),l=M.uCam.value.x,g=M.uCam.value.y;let z=0;for(let T0=0;T0<5;T0++){const Re=Se[T0*2]*D,Te=Se[T0*2+1]*D;z=Math.max(z,it(l+Re*W-Te*a,g+Re*a+Te*W,M))}const w=$e[z>.72?23:Math.max(0,Math.min(23,Math.floor(z*24)))],B=.5/Math.max(w.x,w.y,w.z,.05);Pe.setRGB(w.x*(.4+.6*B),w.y*(.4+.6*B),w.z*(.4+.6*B));const U=Math.abs(s-Fe)<.02;Fe=s,t0.uFill.value.lerp(Pe,U?Math.min(1,i*3):1),ee+=(E(.5,.76,z)-ee)*(U?Math.min(1,i*1.6):1),t0.uLouvre.value=ee;const Be=.0785*(1+(E(.38,.4,s)*(1-E(.46,.48,s))+E(.755,.775,s)*(1-E(.805,.825,s))+E(.83,.85,s)*(1-E(.91,.93,s))))*Math.sin(d*Math.PI);G0.rotation.set(-.25+Be,0,0),h0.rotation.y=Q(Wt,s),G0.userData.face.material.uniforms.uNod.value=Be;const Ae=Q(Dt,s);d0.rotation.set(-.3+.015*Math.sin(d*.83+1),0,((s<.2?.1:-.1)+.025*Math.sin(d*.6))*(1-Ae)-1.5*Ae),d0.scale.setScalar(s<.2?Ue:.78);const R0=s>.6;n0.visible=R0?s>.7&&s<.79:s>.205&&s<.385,Nt(R0?_t:Lt,s,n0.position);const ot=(s-.25)/.14;R0?n0.rotation.set(.5+d*.03,-.9+(s-.7)*6,-.35):n0.rotation.set(.95+d*.03,.25+ot*.4,.2);const Ie=R0?.75:.315,Le=(s-Ie)/(s<Ie?.004:.008);t0.uGlint.value=.6*Math.exp(-Le*Le);const oe=Q(Bt,s),$=s<.5?At:It,_e=$[9]+.02*Math.sin(d*.7);k0.set($[0],$[1],$[2]),y0.set($[3],$[4],$[5]).sub(k0).normalize(),U0.set($[6],$[7],$[8]).sub(k0).normalize(),y0.sub(U0).multiplyScalar(oe*oe*(3-2*oe)).add(U0).normalize(),C0.crossVectors(y0,tt).normalize(),B0.crossVectors(C0,y0),C0.multiplyScalar(Math.cos(_e)).addScaledVector(B0,Math.sin(_e)),B0.crossVectors(C0,y0),we.makeBasis(y0,B0,C0),S0.quaternion.setFromRotationMatrix(we),S0.position.copy(k0),me.uWing.value.set(Math.cos(a0.psi),Math.sin(a0.psi),Math.max(10,Math.min(60,(C-Z)*.2)),.5);const ae=(s-.556)/.04;de.uPuff.value=ae>0&&ae<1?ae:0},dispose(){}}}};export{Zt as default};
