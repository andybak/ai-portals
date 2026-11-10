import*as u from"three";const _=u.Vector3,kt=["#0E1E4A","#2456B8","#3FC9C4","#D6F6F2","#B4975A","#C21F2E","#F7FBFF"],Ne=Math.PI/180,te=Math.PI*2,Ge=2.6,vt=65*Ne,se=Math.sin(vt),be=Math.cos(vt),oe=new _(0,se,-be),I=11,de=58,ft=11,Oe=34,me=-I*be/se,Re=(C,e,a)=>Math.min(a,Math.max(e,C)),ae=(C,e,a)=>C+(e-C)*a,N=(C,e,a)=>{const o=Re((a-C)/(e-C),0,1);return o*o*(3-2*o)},Ct=(C,e,a)=>{const o=Re((C-e)/(a-e),0,1);return Math.sin(o*Math.PI)**2};class $e{constructor(){this.p=[],this.c=[],this.a=[],this.b=[],this.i=[],this.n=0}v(e,a,o,$,h,D){return this.p.push(e,a,o),this.c.push($[0],$[1],$[2]),this.a.push(h?h[0]:0,h?h[1]:0,h?h[2]:0,h?h[3]:0),this.b.push(D?D[0]:0,D?D[1]:0,D?D[2]:0,D?D[3]:0),this.n++}vv(e,a,o,$){return this.v(e.x,e.y,e.z,a,o,$)}tri(e,a,o){this.i.push(e,a,o)}quad(e,a,o,$){this.i.push(e,a,o,e,o,$)}loft(e,a=!0){for(let o=0;o+1<e.length;o++){const $=e[o],h=e[o+1],D=$.length,P=a?D:D-1;for(let L=0;L<P;L++){const M=(L+1)%D;this.quad($[L],$[M],h[M],h[L])}}}build(){const e=new u.BufferGeometry;return e.setAttribute("position",new u.Float32BufferAttribute(this.p,3)),e.setAttribute("color",new u.Float32BufferAttribute(this.c,3)),e.setAttribute("a",new u.Float32BufferAttribute(this.a,4)),e.setAttribute("b",new u.Float32BufferAttribute(this.b,4)),e.setIndex(this.i),e.computeVertexNormals(),e}}const ce=`
const vec3 AX = vec3(0.0, ${se.toFixed(5)}, ${(-be).toFixed(5)});
float h11(float n){ return fract(sin(n*127.1+1.7)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float h31(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7)))*43758.5453); }
float vn2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  float a=mix(mix(h31(i),h31(i+vec3(1.,0.,0.)),f.x), mix(h31(i+vec3(0.,1.,0.)),h31(i+vec3(1.,1.,0.)),f.x), f.y);
  float b=mix(mix(h31(i+vec3(0.,0.,1.)),h31(i+vec3(1.,0.,1.)),f.x), mix(h31(i+vec3(0.,1.,1.)),h31(i+vec3(1.,1.,1.)),f.x), f.y);
  return mix(a,b,f.z); }
float fbm2(vec2 p){ float s=0., a=.5; for(int i=0;i<4;i++){ s+=a*vn2(p); p=p*2.03+17.1; a*=.5; } return s/0.9375; }
float axisDist(vec3 p){ vec3 q = p - AX*dot(p, AX); return length(q); }
vec3 rotAx(vec3 p, vec3 ax, float an){ float c=cos(an), s=sin(an); return p*c + cross(ax,p)*s + ax*dot(ax,p)*(1.-c); }
`,Me=`
uniform vec3 uCamL, uDayCol, uAmb, uShadowCol, uSunL, uSunCol, uSkyCol, uTurq, uCobalt;
uniform float uDay, uTime, uT;
vec3 facetN(vec3 p, vec3 N, vec3 V){ vec3 c = cross(dFdx(p), dFdy(p)); float l = length(c); vec3 f = l > 1e-12 ? c/l : N; return dot(f, V) < 0. ? -f : f; }
float glitter(vec3 p, vec3 V, float sc){ vec3 q = p*sc, c = floor(q); float h = h31(c);
  vec3 f = fract(q) - 0.5; float m = 1. - smoothstep(0.06, 0.26, length(f));
  vec3 d = vec3(h31(c+3.1), h31(c+7.7), h31(c+11.3))*2.-1.;
  float s = max(0., sin(dot(d, V)*9. + h*40. + uTime*1.7)); s *= s; s *= s; s *= s; return s*s*step(0.72, h)*m; }
float worley(vec2 p){ vec2 i = floor(p), f = fract(p); float d = 1.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 g = vec2(float(x), float(y));
    vec2 r = g + vec2(h21(i+g), h21(i+g+17.3)) - f; d = min(d, dot(r, r)); }
  return sqrt(d); }
// nearest and second nearest cell point, and a hash of the nearest cell
vec3 wor3(vec2 p){ vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8., id = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 g = vec2(float(x), float(y)); vec2 c = i + g;
    vec2 r = g + vec2(h21(c), h21(c+17.3)) - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = h21(c + 5.1); } else if (d < d2) { d2 = d; } }
  return vec3(sqrt(d1), sqrt(d2), id); }
// snow lit by the daylight cone (below the roof), the sky down the shaft (above it) and the roof glow
vec3 snowLight(vec3 p, vec3 N, float skyVis){
  float below = 1. - smoothstep(${(I-1).toFixed(1)}, ${(I+6).toFixed(1)}, p.y);
  float ad = axisDist(p)/12.5; float cone = exp(-ad*ad);
  float dl = max(dot(N, AX)*0.6+0.4, 0.);
  vec3 L = uDayCol*uDay*1.5*dl*cone*below;
  L += uSkyCol*skyVis*(0.55+0.45*max(dot(N, AX), 0.));
  L += uDayCol*uDay*0.42*exp(-dot(p.xz, p.xz)/1300.)*below;
  L += mix(uShadowCol*0.5, uAmb*(1. + 1.6*below), N.y*0.5+0.5)*mix(0.35, 1., below);
  return L;
}
`,pe="#include <fog_pars_vertex>",we="#include <fog_vertex>",ye="#include <fog_pars_fragment>",ze="#include <fog_fragment>",ot=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogF = 1.0 - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    float fogF = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
  gl_FragColor.rgb *= 1.0 - fogF;
#endif`,xe=()=>u.UniformsUtils.clone(u.UniformsLib.fog),zt=`
uniform vec4 uCrA[7];
float crTri(float x){ return abs(fract(x) - 0.5)*4. - 1.; }
float crackX(vec4 c, float d){
  return c.x*(1. - exp(-d/11.)) + c.w*(sin(d*0.19 + c.z) + 0.45*sin(d*0.53 + c.z*2.7) + 0.5*crTri(d*0.115 + c.z*1.9) + 0.2*crTri(d*0.37 + c.z*4.3));
}
vec3 galleryCracks(vec2 q, float grow, float pw){
  vec3 acc = vec3(0.);
  float d = q.y;
  if (d < 1. || grow < 0.004) return acc;
  float wide = 0.5 + 0.8*grow;
  for (int i = 0; i < 7; i++) {
    vec4 c = uCrA[i];
    float len = grow*c.y;
    float x = crackX(c, d);
    float taper = clamp(1. - d/max(len, 0.01), 0., 1.), on = step(d, len)*smoothstep(1., 5., d);
    float un = vn2(vec2(d*0.33, c.z*9.));
    float w = (0.05 + 0.5*taper*sqrt(taper))*wide*(0.5 + 1.0*un), ww = max(w, pw*0.75);
    float dist = abs(q.x - x), sd = q.x < x ? 0. : 3.3;
    float l = (1. - smoothstep(ww, ww + pw + 0.01, dist))*min(1., sqrt(w/ww))*on;
    float lip = (1. - smoothstep(ww*1.5 + 0.04, ww*2.6 + 0.14 + pw, dist))*on*(0.35 + 0.65*taper)*smoothstep(0.25, 0.7, vn2(vec2(d*0.9 + sd, c.z*5. + sd)));
    float seam = (1. - smoothstep(w*2. + 0.05, w*5. + 0.3 + pw, dist))*on*(0.45 + 0.55*taper);
    // two spurs leave it, one to each side, and die out after a few metres
    float sg = fract(c.z*7.3) < 0.5 ? -1. : 1.;
    for (int k = 0; k < 2; k++) {
      float fk = float(k), db = c.y*(0.14 + 0.2*fract(c.z*3.7) + fk*(0.3 + 0.16*fract(c.z*5.3))), e = d - db, lb = 4. + 6.*fract(c.z*1.9 + fk*0.37);
      float xb = crackX(c, db) + (1. - 2.*fk)*sg*(e*0.55 + 0.25*crTri(e*0.4 + c.z)), tb = clamp(1. - e/lb, 0., 1.);
      float w2 = 0.02 + 0.06*tb*taper, ww2 = max(w2, pw*0.75), on2 = step(0., e)*step(e, lb)*step(db + e, len), d2 = abs(q.x - xb)*0.87;
      l = max(l, (1. - smoothstep(ww2, ww2 + pw + 0.01, d2))*min(1., w2/ww2)*on2*0.8);
      seam = max(seam, (1. - smoothstep(w2*2. + 0.04, w2*5. + 0.2 + pw, d2))*on2*0.5);
    }
    acc.x = max(acc.x, l);
    acc.y = max(acc.y, seam);
    acc.z = max(acc.z, lip*(1. - l));
  }
  return acc;
}
// the daylight that stands in a crack's gap until the roof goes through: its colour, from the daylight's colour (day) and the
// turquoise (turq). A gap is mixed toward LEAK_GAP times it by the callers, where their measure of the gap is over 0.5
const float LEAK_GAP = 1.9;
vec3 leakCol(vec3 day, vec3 turq){ return mix(day, turq*1.3 + day*0.35, 0.3); }
`,At=`
const float DOME_GAIN = 1.0;
float domeGain(float d2){ return DOME_GAIN*exp(-d2/900.); }
`,Ft=`
uniform vec4 uShadow; uniform vec4 uShadowN; uniform vec2 uShadowW;
float owlShade(vec2 p){
  if (uShadow.z <= 0.) return 0.;
  vec2 d = p - uShadow.xy; float S = max(uShadowN.z, 1.), a = dot(d, uShadowN.xy)/(S*max(uShadow.w, 0.2)), bs = (d.x*uShadowN.y - d.y*uShadowN.x)/S, ab = abs(bs);
  if (abs(a) > 0.9 || ab > 1.5) return 0.;
  float b = ab/((1. - 0.2*uShadowW.x)*(1. + 0.14*uShadowW.y*sign(bs))), aw = a + 0.1*uShadowW.x*b*b;
  float arm = min(min(0.13 + 0.2*b - 0.3*b*b - aw, aw + 0.22 - 0.1*b*b - 0.012*cos(b*40.)), 0.8 - b);
  vec2 h = vec2(b - 0.66, aw + 0.03); float r = length(h), th = r > 1e-4 ? atan(h.y, h.x) : 0., ph = (th + 1.2)/0.44, u = abs(fract(ph) - 0.5)*2.;
  float hand = min(min(0.38 - 0.07*(th - 0.1)*(th - 0.1) - 0.05*u*u - r, (1. - 0.36*smoothstep(0.2, 0.31, r) - u)*0.22*r + 0.004), min(ph, 5. - ph)*r);
  float body = max(0.105 - length(vec2((a - 0.02)/2.5, bs)), 0.125 - length(vec2(a - 0.175, bs)));
  float tail = min(min(a + 0.46 - 1.3*ab*ab + 0.01*cos(ab*90.), -0.15 - a), 0.085 + 0.3*(-a - 0.15) - ab);
  float w = 0.5*max(uShadowN.w, 0.05);
  return uShadow.z*smoothstep(-w, w, max(max(arm, hand), max(body, tail))*S);
}
float owlTone(float l, float ref){ return 0.484*ref*pow(max(l, 1e-4)/ref, 0.3); }
vec3 owlShadedK(vec3 c, float k, float tone){
  if (k <= 0.) return c;
  float l = max(dot(c, vec3(0.3, 0.5, 0.2)), 1e-4), s = mix(1., min(tone/l, 1.), min(2.*k, 1.)), g = min((1. - s)/0.3, 1.);
  return mix(c, vec3(l)*vec3(0.861, 1.001, 1.206), 0.45*g*g)*s;
}
vec3 owlShaded(vec3 c, vec2 p, float ref){ return owlShadedK(c, owlShade(p), owlTone(dot(c, vec3(0.3, 0.5, 0.2)), ref)); }
vec3 owlShadedFace(vec3 face, float k, float lSnow, float cell, float ref){
  return owlShadedK(face, k, owlTone(lSnow, ref)*(0.2 + 0.64/max(cell, 0.05))*dot(face, vec3(0.3, 0.5, 0.2))/max(lSnow, 1e-4));
}
`,Dt=C=>{const e=a=>{const o=Math.sin(a*127.1+C*3.7+1.7)*43758.5453;return o-Math.floor(o)};return Array.from({length:7},(a,o)=>new u.Vector4((o-3)*2.45+(e(o+.3)-.5)*1.5,54+20*e(o+7.1)+(o===3?6:0),e(o+13.7)*6.28318,.45+.4*e(o+21.3)))},at=10.4,dt=1.9,mt=.9,pt=.3,wt=.55,Nt=dt+mt*pt+wt/2,nt=`
uniform float uBulge, uHole, uSeed;
float holeRag(vec2 dir){ return ${at.toFixed(1)} + ${dt.toFixed(1)}*(vn2(dir*2.6+uSeed) - 0.5)*2. + ${mt.toFixed(1)}*(vn2(dir*9.+1.7) - ${pt.toFixed(1)}) + ${wt.toFixed(2)}*(vn2(dir*27.+4.1) - 0.5); }
float discDrop(vec2 q){
  float r = length(q);
  float sc = vn2(q*0.21+uSeed)*1.0 + vn2(q*0.62+3.3)*0.4;
  float edge = 1. - smoothstep(20., ${Oe.toFixed(1)}, r);
  return sc*edge + uBulge*6.8*exp(-r*r/300.)*(0.8+0.4*vn2(q*0.3+9.+uSeed)) + uHole*0.9*exp(-abs(r-11.5)/2.2);
}
`;async function $t(C,e,a){const o=new $e,$=36,h=96,D=[],P=[1,1,1];for(let t=0;t<=$;t++){const d=.4+(Oe-.4)*(t/$),z=[];for(let O=0;O<h;O++){const j=O/h*te;z.push(o.v(Math.cos(j)*d,0,Math.sin(j)*d,P))}D.push(z)}const L=o.v(0,0,0,P);for(let t=0;t<h;t++)o.tri(L,D[0][t],D[0][(t+1)%h]);for(let t=0;t<$;t++)for(let d=0;d<h;d++){const z=(d+1)%h;o.quad(D[t][d],D[t+1][d],D[t+1][z],D[t][z])}await a();const M=new u.ShaderMaterial({uniforms:{...xe(),...C,uBulge:{value:0},uCrack:{value:0},uHole:{value:0},uSeed:{value:e},uGlow:{value:3},uGreen:{value:0},uCrA:{value:Dt(e)},uCrGrow:{value:0},uDim:{value:0},uDomeK:{value:1},uShadow:{value:new u.Vector4(0,0,0,1)},uShadowN:{value:new u.Vector4(1,0,13,2.5)},uShadowW:{value:new u.Vector2(0,0)}},fog:!0,transparent:!0,depthWrite:!0,side:u.DoubleSide,vertexShader:`
varying vec3 vP; varying vec3 vL;
${pe}
${ce}
${nt}
void main(){
  vec3 p = position;
  p.y -= discDrop(p.xz);
  vP = position; vL = p + vec3(0., ${(I-.2).toFixed(2)}, ${me.toFixed(3)});
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  ${we}
}`,fragmentShader:`
uniform float uCrack, uGlow, uGreen, uCrGrow, uDim, uDomeK;
varying vec3 vP; varying vec3 vL;
${ye}
${ce}
${Me}
${nt}
${zt}
${At}
${Ft}
// distance (m) to the nearest of nc wiggling radial cracks; id comes back in 'cell'
float crackD(float r, float ang, float nc, float sd, out float cell){
  float k = (ang/6.28318 + 0.5)*nc; cell = floor(k);
  float f = fract(k) - 0.5;
  float wig = (vn2(vec2(r*0.2, cell*7.3+sd)) - 0.5)*0.34 + (vn2(vec2(r*1.4, cell*3.1+sd)) - 0.5)*0.11 + (h11(cell+sd) - 0.5)*0.4;
  return abs(f - wig)*r*(6.28318/nc);
}
void main(){
  float r = length(vP.xz);
  vec2 dir = vP.xz/max(r, 1e-3);
  float rr = length((vP.xz - vec2(0., 1.5))*vec2(1., 0.82));
  // the torn edge: big lobes, bites and small teeth
  float rag = holeRag(dir);
  float lipD = rr - rag*uHole;
  if (lipD < 0.) discard;
  float alpha = 1. - smoothstep(24., ${(Oe-.5).toFixed(1)}, r);
  if (alpha < 0.02) discard;
  vec3 V = normalize(uCamL - vL);
  // snow thickness sets colour and brightness
  // (the roof over the strike is the thin patch at the far end of the last straight: a place, thin the whole flight, whatever the
  // drift does on this seed; the bulge then whitens it once)
  float patchK = exp(-r*r/2116.);
  float thick = clamp(0.5 + 0.8*(1. - 0.85*patchK)*(fbm2(vP.xz*0.045+uSeed) - 0.5) - 0.3*patchK, 0.12, 1.);
  float thin = min(uBulge*1.25, 1.)*exp(-r*r/250.)*(1. - 0.6*uHole);
  thick = mix(thick, 0.03, thin);
  vec3 col = mix(uTurq, uCobalt, smoothstep(0.2, 0.8, thick))*uGlow*exp(-1.5*thick);
  col = mix(col, vec3(col.g*0.9, col.g*1.25, col.g*0.8), uGreen);
  // the paling dome brightens the snow round it: the disc's own colour is multiplied by 1 + domeGain (at r from the disc's
  // centre), the same gain as the gallery roof beyond the disc takes, times the same factor, the bulge times 1.25 (at most 1)
  // times one less the hole's opening. The disc applies it here, before the bands, the hoar's cut, the dim (uDim) and the flank's
  // shade below; the world applies it to its roof after its dim
  col *= 1. + domeGain(r*r)*min(uBulge*1.25, 1.)*(1. - uHole);
  col *= 0.8 + 0.2*sin(vP.x*0.2 + vP.z*0.08 + fbm2(vP.xz*0.04)*6. - uTime*0.4);
  float lSnow = dot(col, vec3(0.3, 0.5, 0.2));                           // the snow's light here without its hoar cups (for the owl's shade below)
  // hoar scallops at two sizes, the same cut as the gallery roof: thin bright cup centres, thick dark ribs
  vec2 wq = vL.xz + vec2(vL.y*0.35);
  float cup = worley(wq*0.3 + uSeed), cup2 = worley(wq*0.95 + 3.7);
  float cell = (1.28 - 0.95*smoothstep(0.08, 0.62, cup))*(1.1 - 0.46*smoothstep(0.1, 0.6, cup2));
  float nearK = 1. - smoothstep(10., 34., length(uCamL - vL));          // grain of the hoar where it is close enough to resolve
  col *= cell*(0.82 + 0.36*vn2(wq*1.1 + 5.))*(1. + nearK*(0.5*vn3(vL*2.9) + 0.35*vn3(vL*8.3) - 0.42));
  float fine = 1. - smoothstep(5., 16., length(uCamL - vL));           // close to, the hoar is separate crystals: small facets, each of its own brightness
  if (fine > 0.01) { vec3 w3 = wor3(wq*3.1 + 9.1); col *= mix(1., (0.8 + 0.42*w3.z)*(0.7 + 0.3*smoothstep(0., 0.42, w3.y - w3.x)), fine*0.85); }
  float wK = smoothstep(0.26, 0.66, thin);
  // as the owl's weight comes on, the pressed snow round the bulge darkens: by at most 0.07 of itself (uDim's greatest) at the
  // disc's centre, falling to 1/e of that 60 m out. The dome's gain, applied above, falls to 1/e 30 m out: at the centre, with
  // the dome fully paled and this dim at its greatest, the disc's own colour stands (1 + DOME_GAIN)*(1 - 0.07) times itself, so
  // that the roof there grows brighter while it is pressed when that product is over 1. The white dome, the daylight in the
  // gaps and the pale lip, mixed and added below, do not take the dim
  col *= 1. - uDim*exp(-r*r/3600.);                                       // the pressed snow round the bulge darkens
  col = owlShadedFace(col, owlShade(vL.xz), lSnow, cell, dot(mix(uTurq, uCobalt, 0.5), vec3(0.3, 0.5, 0.2))*uGlow*0.47);   // the bird's wings on the snow above, seen through it (0.47: what snow of middling depth lets through, exp(-1.5*0.5))
  col *= 1. - 0.4*uBulge*(1. - uHole)*smoothstep(8., 12.5, r)*(1. - smoothstep(15., 26., r));   // the flank of the sagging dome is in its own shade
  col = mix(col, mix(uDayCol, uTurq*1.5 + uDayCol*0.4, smoothstep(5., 13., r)*0.6)*uDomeK*(2.9 - 1.2*smoothstep(2.5, 12., r)), wK*0.92);   // whitest at the apex, turquoise and dimmer up the flank
  // cracks: gaps with a pale lip growing out from the bulge, dark on the white dome and, off it, daylight where the gap's measure
  // is over 0.5 (the two mixes below); they close to nothing once the roof has gone through
  float ang = r > 1e-3 ? atan(vP.z, vP.x) : 0.;
  float c1, c2; float d1 = crackD(r, ang, 11., uSeed, c1); float d2 = crackD(r, ang + 0.31, 19., uSeed+5., c2);
  float len1 = uCrack*(16. + 19.*h11(c1+uSeed)), len2 = uCrack*(10. + 16.*h11(c2+3.+uSeed))*step(0.3, h11(c2+9.));
  float dr = abs(r - (5. + 9.*h11(c2+1.7)));                 // short ring fractures tying the radials together
  float px1 = min(fwidth(d1), 1.6), px2 = min(fwidth(d2), 1.2), px3 = min(fwidth(dr), 0.4);   // widen toward a pixel far away and dim to match
  float t1 = clamp(1. - r/max(len1, 0.01), 0., 1.), w1 = 0.03 + 0.13*t1*t1, ww1 = max(w1, px1*0.75), ww2 = max(0.035, px2*0.75), ww3 = max(0.03, px3*0.7);
  float l1 = (1. - smoothstep(ww1, ww1+px1+0.01, d1))*min(1., 1.6*w1/ww1)*(1. - smoothstep(len1-2.5, len1, r));
  float l2 = (1. - smoothstep(ww2, ww2+px2+0.01, d2))*min(1., 0.07/ww2)*(1. - smoothstep(len2-2., len2, r))*smoothstep(4., 7., r)*0.8;
  float l3 = (1. - smoothstep(ww3, ww3+px3+0.01, dr))*min(1., 0.05/ww3)*0.7*step(0.5, h11(c2+4.4))*step(r, len1*0.8)*uCrack;
  float halo = exp(-d1/0.6)*(1. - smoothstep(len1-4., len1, r))*0.12;
  float crackK = (0.55 + 0.45*uBulge)*(1. - uHole);
  vec3 gc = galleryCracks(vP.xz, uCrGrow, min(fwidth(vP.x), 1.2));
  float lines = max(max(l1, gc.x), max(l2, l3));
  float seam = max(gc.y, (1. - smoothstep(w1*2. + 0.05, w1*5. + 0.35 + px1, d1))*(1. - smoothstep(len1-2.5, len1, r))*(0.4 + 0.6*t1));
  col *= 1. - 0.5*seam*(1. - wK)*crackK;                                                      // each gap lies in a dark seam of sheared snow
  col = mix(col, mix(col*0.12 + vec3(0.008, 0.02, 0.05), vec3(0.07, 0.17, 0.36), wK), min(lines*1.6 + seam*0.5*wK, 1.)*0.9*(1. - uHole));   // every crack is first drawn a dark, branching gap, on the white dome and out along the roof
  // off the white dome (1 - wK), until the roof goes through (1 - uHole), a gap is open to the day, as on the gallery roof beyond
  // the disc: where the gap's measure (lines: the greatest of the first radials l1, the second radials l2, 0.8 at most, the ring
  // fractures l3, 0.7 uCrack at most, and the gallery's fractures gc.x) is over 0.5 the colour is mixed toward LEAK_GAP times
  // the leak's colour, by a smoothstep of lines from 0.5 to 1; so a second radial takes at most 0.648 of it. The ring fractures
  // keep the dark: the part holds uCrack at 0.72 or less until the roof bursts, so l3 is 0.504 at most and takes 2 parts in
  // 10,000 of it at most; after the burst uCrack rises while 1 - uHole falls to nothing in 0.26 s, and a ring fracture's share
  // is then about 1 part in 100 at most. Where lines is under 0.5 (at a gap's soft edge, and where a gap is so thin in its
  // pixel that its measure is dimmed under 0.5), and on the white dome, the gap keeps the dark of the line above. Nothing is
  // added to the sheared snow either side
  col = mix(col, leakCol(uDayCol, uTurq)*LEAK_GAP, smoothstep(0.5, 1., lines)*(1. - wK)*(1. - uHole));
  col += mix(uDayCol, uTurq*1.3 + uDayCol*0.35, 0.4)*(0.6*gc.z*(1. - wK) + halo*uCrack)*crackK;   // its broken edge is a pale lip
  // the torn lip once it is open: a bright broken face at the edge, a ring of compressed dark snow behind it
  float face = (1. - smoothstep(0.15, 1.5, lipD))*uHole;
  float ring = smoothstep(0.8, 2.2, lipD)*(1. - smoothstep(2.6, 6.5, lipD))*uHole;
  col *= 1. - 0.5*ring;
  col = mix(col, (uDayCol*uDay*1.5 + uTurq*0.5)*(0.6 + 0.6*vn2(vP.xz*1.7 + 2.)), face*0.85);
  col += uDayCol*glitter(vec3(vL.x, 0.125, vL.z), V, 4.)*1.8*(0.4+thin);
  col = max(col, vec3(0.));
  gl_FragColor = vec4(col, alpha);
  ${ze}
}`});await a();const f=new u.Mesh(o.build(),M);return f.position.set(0,I-.2,me),f.renderOrder=-5,f.frustumCulled=!1,f.name="strike-roof",f}async function Pt(C,e,a,o){const $=new $e,h=56,D=12,P=96,L=[],M=[1,1,1],f=a.range(0,50),t=a.range(18.5,23),d=a.range(30,37),z=[],O=Array.from({length:40},()=>a.range(-.5,.5));for(let m=0;m<=h+D;m++){const n=[];for(let F=0;F<P;F++){const b=F/P*te,G=Math.cos(b),S=Math.sin(b);let x,q,p=-1;if(m<=h){x=ae(I-.9,de,m/h);const s=N(44,58,x);q=ft+.9+2.9*N(I-.9,I+3.5,x)*(1-N(I+3.5,I+12,x))+4.6*s*s+O[Math.floor(x/2.3)]*(1-s)+e.fbm3(G*1.6+f,S*1.6,x*.085,3)*1.7+e.n3(G*5+f,S*5,x*.42)*.38-.75*Math.exp(-(((x-t)/.5)**2))-.5*Math.exp(-(((x-d)/.4)**2))+.5*N(t-6,t-1,x)*(1-N(t-1,t-.4,x)),m===h&&(z[F]=q)}else{const s=(m-h)/D;p=s*2.5+s*s*19;const B=.65+.5*e.fbm2(G*3+f,S*3+s*2,3)+.25*e.n2(b*9,s*5+f);x=de+3.3*Math.exp(-(((p-3.2)/3)**2))*B*(1-.35*G)+.5*(1-s)*e.n2(G*7+s*6,S*7+f)*(1-s)+.06,q=z[F]+p}const r=-Math.min(x,de)*be/se;n.push($.v(G*q,x,r+S*q/se,M,[p,0,0,0]))}L.push(n),(m&7)===7&&await o()}await o(),$.loft(L,!0),await o();const j=new u.ShaderMaterial({uniforms:{...xe(),...C,uSeed:{value:f},uLay:{value:new u.Vector4(a.range(15,18),t,d,a.range(43,47))},uSlash:{value:16}},fog:!0,vertexShader:`
attribute vec4 a;
varying vec3 vL; varying vec3 vN; varying float vE;
${pe}
void main(){
  vL = position; vN = normal; vE = a.x;
  vec4 mvPosition = modelViewMatrix*vec4(position, 1.);
  gl_Position = projectionMatrix*mvPosition;
  ${we}
}`,fragmentShader:`
uniform float uSeed, uSlash; uniform vec4 uLay;
varying vec3 vL; varying vec3 vN; varying float vE;
${ye}
${ce}
${Me}
void main(){
  vec3 V = normalize(uCamL - vL);
  vec3 N = normalize(vN);
  vec3 F = facetN(vL, N, V);
  vec3 Nn = normalize(mix(N, F, 0.6));
  float y = vL.y, apron = step(0., vE);
  vec2 q = (vL.xz - vec2(0., -min(y, ${de.toFixed(1)})*${(be/se).toFixed(5)}))*vec2(1., ${se.toFixed(5)});
  vec2 cyl = q/max(length(q), 1e-3);
  // strata, warped and dipping a little
  float h = y + (fbm2(cyl*2.1 + y*0.03 + uSeed) - 0.5)*5. + cyl.x*1.6 - cyl.y*0.9;
  float hoar = 1. - smoothstep(uLay.x-1.5, uLay.x+1.5, h);
  float e1 = (h - uLay.y)/0.5, e2 = (h - uLay.z)/0.32;
  float lens = clamp(exp(-e1*e1) + 0.7*exp(-e2*e2), 0., 1.);
  float powder = max(smoothstep(uLay.w-2., uLay.w+2., h), apron);
  float slab = (1. - hoar)*(1. - powder);
  float grain = vn3(vL*1.5);
  float stri = 0.5 + 0.5*sin(h*5.2 + fbm2(cyl*3. + vec2(h*0.35, 0.))*5.);
  float band = fbm2(vec2(h*0.5, 3.7 + uSeed));
  vec3 alb = vec3(0.60, 0.70, 0.79);
  alb = mix(alb, vec3(0.46, 0.60, 0.74)*(0.7 + 0.5*grain), hoar);
  alb *= mix(1., 0.84 + 0.16*stri, slab)*(0.74 + 0.42*band);
  float li = h/2.3 + (vn2(cyl*1.5 + 7.) - 0.5)*0.7, lid = floor(li), lf = fract(li);
  float tone = 0.52 + 0.56*h11(lid + uSeed), seam = 1. - 0.5*(1. - smoothstep(0., 0.1, lf))*(0.4 + 0.6*h11(lid*3.1 + 1.));
  alb *= tone*seam;
  alb = mix(alb, vec3(0.76, 0.80, 0.84)*(0.9 + 0.14*grain)*mix(1., tone*seam, 0.45), powder);
  alb = mix(alb, vec3(0.42, 0.85, 0.9), lens*0.85);
  // light: sky down the hole, the sun slash on the wall that faces it, glow inside the pack
  float depth = clamp((${de.toFixed(1)} - y)/50., 0., 1.);
  float skyVis = mix(mix(1., 0.15, pow(depth, 0.65)), 1., apron);
  vec2 sxz = uSunL.xz/max(length(uSunL.xz), 1e-3);
  float facing = max(dot(-cyl, sxz), 0.);
  float litDepth = uSlash*pow(facing, 0.8)*(0.75 + 0.5*vn2(cyl*4. + 2.));
  float sunWall = smoothstep(-1.4, 1.4, y - (${de.toFixed(1)} - litDepth))*step(0.02, facing);
  float sunAp = max(dot(Nn, uSunL), 0.)*1.3 + 0.12;
  float sun = mix(sunWall*max(dot(F, uSunL)*0.7 + 0.3, 0.)*0.36, sunAp*0.6, apron);
  vec3 L = snowLight(vL, Nn, skyVis) + uSunCol*sun;
  vec3 col = alb*L;
  col += alb*mix(uCobalt, uTurq, 1. - depth)*(0.13 + 0.22*(1. - depth))*(1. - apron);       // light inside the snow
  float sp = max(dot(reflect(-V, Nn), AX), 0.); sp *= sp; sp *= sp;
  col += uSkyCol*lens*sp*sp*1.4*skyVis;
  col += (uSunCol*sun + uSkyCol*skyVis + uDayCol*uDay*0.4)*glitter(vL, V, 3.6)*(1.2 + 2.*hoar);
  gl_FragColor = vec4(col, 1.);
  ${ze}
}`}),V=new u.Mesh($.build(),j);return V.frustumCulled=!1,V.name="strike-shaft",V}function Vt(C){const e=new $e,a=28,o=14,$=[],h=[1,1,1],D=new _(1,0,0),P=new _().crossVectors(oe,D);for(let t=0;t<=o;t++){const d=-3+74*(t/o),z=ae(10.2,10.6,t/o),O=[];for(let j=0;j<a;j++){const V=j/a*te,m=Math.cos(V),n=Math.sin(V);O.push(e.v(oe.x*d+(D.x*m+P.x*n)*z,oe.y*d+(D.y*m+P.y*n)*z,oe.z*d+(D.z*m+P.z*n)*z,h,[d,V,0,0]))}$.push(O)}e.loft($,!0);const L=new u.Mesh(e.build(),new u.ShaderMaterial({uniforms:{...xe(),...C,uConeK:{value:1}},fog:!0,transparent:!0,depthWrite:!1,blending:u.AdditiveBlending,side:u.BackSide,vertexShader:`
attribute vec4 a;
varying vec3 vL; varying vec3 vN; varying vec2 vA;
${pe}
void main(){ vL = position; vN = normal; vA = a.xy;
  vec4 mvPosition = modelViewMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mvPosition;
  ${we}
}`,fragmentShader:`
uniform float uConeK;
varying vec3 vL; varying vec3 vN; varying vec2 vA;
${ye}
${ce}
${Me}
void main(){
  vec3 V = normalize(uCamL - vL);
  float nv = abs(dot(normalize(vN), V));
  // brightest through the middle with a soft edge; brightest of all under the hole and thinning toward the floor; in rays, with
  // dark lanes between them, that slant down the shaft's own lean: a column of light with air in it, never a flat white card
  float body = nv*nv*(0.4 + 0.6*nv);
  float inGal = 1. - smoothstep(${(I-1).toFixed(1)}, ${(I+9).toFixed(1)}, vL.y);
  float prof = mix(0.06, 1., inGal)*smoothstep(-1., 2.5, vL.y)*(1. - smoothstep(60., 70., vA.x))*mix(0.5, 1.2, smoothstep(0.5, ${I.toFixed(1)}, vL.y));
  vec2 sc = vec2(cos(vA.y), sin(vA.y));
  float rays = fbm2(vec2(sc.x*7.5 + sc.y*3.3, vA.x*0.05 + uTime*0.12) + sc.y*3.1);
  float streak = 0.55 + 1.1*smoothstep(0.3, 0.7, rays)*(0.75 + 0.5*fbm2(vec2(sc.x*3. + sc.y*1.7, vA.x*0.16 + uTime*0.9) + sc.y*2.3));
  gl_FragColor = vec4(uDayCol*uDay*2.1*uConeK*body*prof*streak, 1.);
  ${ot}
}`}));L.renderOrder=3,L.frustumCulled=!1,L.name="strike-daylight";const M=new u.CircleGeometry(19,40);M.rotateX(-Math.PI/2);const f=new u.Mesh(M,new u.ShaderMaterial({uniforms:{...xe(),...C},fog:!0,transparent:!0,depthWrite:!1,blending:u.AdditiveBlending,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`
varying vec3 vL;
${pe}
void main(){ vL = position; vec4 mvPosition = modelViewMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mvPosition;
  ${we}
}`,fragmentShader:`
varying vec3 vL;
${ye}
${ce}
${Me}
void main(){
  vec2 p = vL.xz*vec2(1., 0.9); float r = length(p);
  float rag = 0.8 + 0.4*vn2(vL.xz*0.35 + 4.);
  float I = exp(-r*r/(74.*rag)) + 0.2*exp(-r*r/260.);
  I *= (0.75 + 0.5*vn2(vL.xz*1.3 + vec2(0., uTime*0.6)))*(1. - smoothstep(11., 18.5, r));
  gl_FragColor = vec4(uDayCol*uDay*1.35*I, 1.);
  ${ot}
}`}));return f.position.set(0,.08,.6),f.renderOrder=1,f.frustumCulled=!1,f.name="strike-pool",{cone:L,pool:f}}const Ce=[1.7,1.45,1.25],Ke=9.5,je=at-Nt,qt=8.4,Te=qt/se+Ke;async function _t(C,e,a){const o=new $e,$=[],h=new _(1,0,0),D=new _,P=new _,L=new _,M=new _,f=new _,t=new _,d=new _,z=(p,r=0)=>[p*(1+r*.12),p,p*(1-r*.1)],O=(p,r,s,B,k,R,Z,J,l,v,y)=>{const E=e(),X=z(J,.1),i=[];for(let g=0;g<3;g++){const A=g*.5,w=.03+Z*A*A;for(let H=-1;H<=1;H++){const W=R*.5*H,ee=w-.14*R*H*H*(.4+.6*A);i.push(o.v(p.x+s.x*k*A+B.x*W+r.x*ee,p.y+s.y*k*A+B.y*W+r.y*ee,p.z+s.z*k*A+B.z*W+r.z*ee,X,[y,H,1,0],[A,E,l,v]))}}for(let g=0;g<2;g++)for(let A=0;A<2;A++)o.quad(i[g*3+A],i[g*3+A+1],i[(g+1)*3+A+1],i[(g+1)*3+A])};for(const p of[-1,1]){const r=p<0?0:1,s=new _(p*(5.3+e.range(-.4,.5)),0,p>0?e.range(-2.2,-1):e.range(.4,1.5));$.push(s);const B=new _(s.x,1.15,s.z-.3),k=new _(s.x+p*.6,10.5,s.z-1),R=new _(p*3.4,20.6,-9.4),Z=i=>{P.set(0,0,0).addScaledVector(B,(1-i)*(1-i)).addScaledVector(k,2*i*(1-i)).addScaledVector(R,i*i),D.set(0,0,0).addScaledVector(B,-2*(1-i)).addScaledVector(k,2-4*i).addScaledVector(R,2*i).normalize(),L.copy(h).addScaledVector(D,-D.dot(h)).normalize(),M.crossVectors(D,L)},J=i=>1.05+.85*N(.02,.3,i)+.9*N(.45,1,i),l=[],v=14,y=12;for(let i=0;i<=v;i++){const g=i/v,A=[];Z(g);const w=J(g)*.88;for(let H=0;H<y;H++){const W=H/y*te;d.copy(P).addScaledVector(L,Math.cos(W)*w).addScaledVector(M,Math.sin(W)*w),A.push(o.vv(d,z(.13,.2),[g,0,0,0],[0,.5,0,r]))}l.push(A)}o.loft(l,!0);for(let i=0;i<24;i++){const g=.012+i/24*.97;Z(g);const A=J(g),w=10;for(let H=0;H<w;H++){const W=(H+i%2*.5+e.range(-.18,.18))/w*te;f.set(0,0,0).addScaledVector(L,Math.cos(W)).addScaledVector(M,Math.sin(W)),d.copy(P).addScaledVector(f,A*.9),t.crossVectors(D,f);const ee=D.clone().multiplyScalar(-1);O(d,f,ee,t,e.range(2.5,3.5)*(.72+.55*g),e.range(1.45,1.85)*(.62+.3*A),e.range(.35,.8)*(.6+.5*g),e.range(.34,.46),0,r,g)}(i&3)===3&&await a()}await a();const E=[];for(let i=0;i<=6;i++){const g=-Math.PI/2+i/6*Math.PI,A=[];for(let w=0;w<10;w++){const H=w/10*te;A.push(o.v(s.x+Math.cos(H)*Math.cos(g)*1.45,.85+Math.sin(g)*.95,s.z+Math.sin(H)*Math.cos(g)*1.45,g<0?[.2,.17,.11]:z(.33,.2),[0,0,0,0],[0,.5,0,r]))}E.push(A)}o.loft(E,!0);const X=[-20,46,134,-150];for(let i=0;i<4;i++){const g=p*X[i]*Ne+e.range(-.12,.12),A=(i===3?.86:1)*e.range(.94,1.07),w=e(),H=[0,.45,.9,1.35,1.7,2.1,2.5,2.85,3.15,3.5,3.85,4.15,4.4],W=[],ee=Ce[0],le=Ce[0]+Ce[1],re=le+Ce[2],ve=T=>[g,N(-.25,.5,T),N(ee-.4,ee+.4,T),N(le-.35,le+.35,T)];for(const T of H){const he=(ae(.68,.45,T/re)+.1*Math.exp(-(((T-ee)/.28)**2))+.09*Math.exp(-(((T-le)/.26)**2))+.07*Math.exp(-(((T-re)/.25)**2)))*A,U=[];for(let ne=0;ne<8;ne++){const Le=ne/8*te,ke=Math.cos(Le),Y=ke>-.2?z(.36+.08*Math.sin(T*5+w*6),.2):[.21,.17,.1];U.push(o.v(T*A,ke*he*.88,Math.sin(Le)*he,Y,ve(T),[0,w,1,r]))}W.push(U)}for(let T=0;T<5;T++){const he=.2+T*.75,U=new _(he*A,.5*A,e.range(-.15,.15)),ne=e(),Le=e.range(.34,.46),ke=ve(he+.5),Y=(Ye,Fe,ue,Qe)=>o.v(U.x+Ye,U.y+Fe,U.z+ue,z(Le*(.7+.5*Qe),.2),ke,[0,ne,1,r]),ge=Y(0,0,-.45,0),Ae=Y(0,0,.45,0),Ee=Y(.6,.25,-.5,.5),He=Y(.6,.25,.5,.5),Ue=Y(1.25,.3,0,1);o.tri(ge,He,Ae),o.tri(ge,Ee,He),o.tri(Ee,Ue,He)}const Se=1.8*A,fe=8;for(let T=0;T<=fe;T++){const he=T/fe*1.75,U=.5*Math.pow(1-T/fe,.8)*A+.02,ne=[],Le=re*A+Se*Math.sin(he)-.05,ke=-Se*(1-Math.cos(he))+.05,Y=T===0?[.09,.085,.08]:[.012,.012,.016];for(let ge=0;ge<8;ge++){const Ae=ge/8*te;ne.push(o.v(Le+Math.sin(he)*Math.cos(Ae)*U,ke+Math.cos(he)*Math.cos(Ae)*U,Math.sin(Ae)*U*.78,Y,[g,1,1,1],[0,w,2,r]))}W.push(ne)}o.loft(W,!0)}await a()}const j=new _(1,0,0),V=new _().crossVectors(oe,j),m=36,n=11,F=[],b=p=>{if(p<=n){const s=p/n*Math.PI/2;return[Te-Ke*Math.cos(s),Math.max(je*Math.sin(s),.02)]}const r=(p-n)/5;return[Te+26*r,je*(1-.9*r*r*r)]};for(let p=0;p<=n+5;p++){const[r,s]=b(p),B=[];for(let k=0;k<m;k++){const R=k/m*te;d.copy(oe).multiplyScalar(r).addScaledVector(j,Math.cos(R)*s*.97).addScaledVector(V,Math.sin(R)*s*.97),B.push(o.vv(d,[1,1,1],[1,0,0,0],[0,.5,3,0]))}F.push(B)}o.loft(F,!0),await a();const G=new _,S=13;for(let p=1;p<S+3;p++){const r=Math.min(p/S,1)*Math.PI/2,s=p<=S?Te-Ke*Math.cos(r):Te+(p-S)*1.5,B=je*Math.sin(r),k=Math.max(5,Math.round(B*te/2.05));for(let R=0;R<k;R++){const Z=(R+p%2*.5+e.range(-.2,.2))/k*te;f.set(0,0,0).addScaledVector(j,Math.cos(Z)).addScaledVector(V,Math.sin(Z)),d.copy(oe).multiplyScalar(s).addScaledVector(f,B),L.copy(f).multiplyScalar(Math.sin(r)/je).addScaledVector(oe,-Math.cos(r)/Ke).normalize(),G.copy(f).multiplyScalar(-Math.cos(r)*je).addScaledVector(oe,-Math.sin(r)*Ke).normalize(),t.crossVectors(G,L),O(d.addScaledVector(L,.05),L,G,t,e.range(3.3,4.4),e.range(2.3,3),e.range(.3,.6),e.range(.3,.4),3,0,1)}(p&3)===3&&await a()}await a();const x=new u.ShaderMaterial({uniforms:{...xe(),...C,uHub:{value:$},uFoot:{value:[new u.Vector2,new u.Vector2]},uLegS:{value:0},uDrop:{value:0},uShake:{value:0}},fog:!0,side:u.DoubleSide,vertexShader:`
attribute vec4 a; attribute vec4 b; attribute vec3 color;
uniform vec3 uHub[2]; uniform vec2 uFoot[2]; uniform float uLegS, uDrop, uShake, uTime;
varying vec3 vL; varying vec3 vN; varying vec3 vC; varying vec4 vB; varying vec3 vR; varying vec2 vA;
${pe}
${ce}
void bend(inout vec3 p, inout vec3 n, float px, float an){
  float c = cos(an), s = sin(an); vec2 d = p.xy - vec2(px, 0.);
  p.xy = vec2(px, 0.) + vec2(d.x*c + d.y*s, -d.x*s + d.y*c);
  n.xy = vec2(n.x*c + n.y*s, -n.x*s + n.y*c);
}
void main(){
  vec3 p = position, n = normal; float part = b.z, side = b.w;
  vec2 foot = mix(uFoot[0], uFoot[1], side); vec3 hub = mix(uHub[0], uHub[1], side);
  float cl = foot.x, lift = 3.1*max(cl, 0.) + foot.y;
  vA = vec2(a.y, a.z);
  if (part > 0.5 && part < 2.5) {
    float tv = h11(b.y*9. + a.x);
    vec3 ang = mix(vec3(-0.06, 0.06, 0.12), vec3(0.50, 0.74, 0.66)*(0.9+0.2*tv), max(cl, 0.)) + min(cl, 0.)*vec3(0.55, 0.3, 0.15);
    bend(p, n, ${(Ce[0]+Ce[1]).toFixed(2)}, ang.z*a.w);
    bend(p, n, ${Ce[0].toFixed(2)}, ang.y*a.z);
    bend(p, n, 0., ang.x*a.y);
    float sa = sin(a.x), ca = cos(a.x);
    p = vec3(p.x*sa - p.z*ca, p.y, p.x*ca + p.z*sa);
    n = vec3(n.x*sa - n.z*ca, n.y, n.x*ca + n.z*sa);
    p += hub + vec3(0., 0.62 + lift, 0.);
    vA = vec2(0.);
  } else if (part < 0.5) {
    float t = a.x, k = (1. - t)*(1. - t);
    p.y += lift*k; p -= AX*uDrop*t;
    p.x += (side*2. - 1.)*sin(3.1416*t)*(0.22*lift + 0.5*uDrop);
    p.z += sin(3.1416*t)*(0.3*lift + 0.4*uDrop);
  } else {
    p -= AX*uDrop;
    p += normalize(p - AX*${Te.toFixed(2)})*0.14*sin(uTime*2.3 + p.y*0.2);
  }
  // feather tips lift and shiver
  float fl = b.x*b.x*(0.05 + 0.5*uShake);
  p += n*fl*sin(uTime*(7. + 5.*b.y) + b.y*40.);
  p += AX*uLegS;
  vL = p; vN = n; vC = color; vB = b; vR = position;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  ${we}
}`,fragmentShader:`
varying vec3 vL; varying vec3 vN; varying vec3 vC; varying vec4 vB; varying vec3 vR; varying vec2 vA;
${ye}
${ce}
${Me}
void main(){
  vec3 V = normalize(uCamL - vL);
  vec3 N = normalize(vN);
  float part = vB.z, talon = step(1.5, part)*step(part, 2.5), belly = step(2.5, part), legP = step(part, 0.5);
  float isF = step(0.5, vA.y)*max(legP, belly);
  // a feather: broad, round-tipped, barred grey and white across, a dark shaft down the middle, a pale loose fringe
  float v = vB.x, across = vA.x, ax = abs(across), h = vB.y;
  float nb = 2.5 + 1.5*fract(h*7.3);
  float w = sqrt(clamp(v/0.1, 0., 1.))*sqrt(max(1. - pow(max(v - 0.4, 0.)/0.6, 2.), 0.));
  float e = clamp(ax/max(w, 0.05), 0., 1.);
  float cb = v*nb + 0.3*e*e + h*5.;
  float fcb = fwidth(cb);
  float ragE = 0.14*vn2(vec2(v*13. + h*40., across*2. + h*9.))*smoothstep(0.3, 1., v);
  if (isF > 0.5 && ax > w*(1. - ragE)) discard;
  vec3 alb = vC;
  float edgeK = 0., occ = 1.;
  if (isF > 0.5) {
    float bar = smoothstep(0.34, 0.66, 0.5 + 0.5*sin(cb*6.2832));
    bar = mix(bar, 0.5, smoothstep(0.3, 0.7, fcb));
    // the legs are mid-grey with dark bars; the breast feathers that hang in the hole are darker than either
    vec3 dk = mix(vec3(0.085, 0.09, 0.10), vec3(0.045, 0.048, 0.056), belly), wh = mix(vec3(0.62, 0.62, 0.61), vec3(0.19, 0.195, 0.205), belly);
    alb = mix(dk, wh, bar)*(0.86 + 0.28*h);
    alb *= 1. - 0.5*(1. - smoothstep(0.03, 0.1, ax))*step(v, 0.88);
    alb = mix(alb, wh*1.1, 0.6*smoothstep(0.86, 1., v));
    occ = mix(0.3, 1., smoothstep(0., 0.42, v));
    edgeK = smoothstep(0.55, 1., e)*smoothstep(0.1, 0.3, v) + 0.7*smoothstep(0.8, 1., v);
  } else if (belly > 0.5) {
    alb = vec3(0.07, 0.072, 0.08);
  }
  if (dot(N, V) < 0.) N = -N;
  // from far off the single feathers merge: broad light and dark bands round the leg carry the pattern, and the foot is darker than the feathered leg
  float farK = smoothstep(34., 56., length(uCamL - vL)), legK = (1. - belly)*(1. - talon), legF = farK*legP*smoothstep(1.8, 2.6, vR.y);
  // broad dark bars round the leg, some 5 m apart, at every distance
  float band = smoothstep(0.34, 0.66, 0.5 + 0.5*sin(vR.y*1.25 + vR.x*0.5 + 1.1*sin(vR.z*0.9 + vR.y*0.3)));
  alb *= mix(1., 0.3, (1. - band)*legP*smoothstep(1.8, 2.6, vR.y));
  alb = mix(alb, mix(vec3(0.08), vec3(0.54), band), legF*0.8);
  alb = mix(alb, mix(vec3(0.05), vec3(0.19), step(0.5, fract(h*3.7)))*(0.75 + 0.5*smoothstep(0.6, 0.95, v)), farK*belly*isF*0.6);
  alb *= mix(1., 0.5, legK*(1. - smoothstep(1.7, 2.5, vR.y))*(0.5 + 0.5*farK));
  float ad = axisDist(vL)/12.5; float cone = exp(-ad*ad);
  float wide = exp(-dot(vL.xz, vL.xz)/1100.);
  float dl = max(dot(N, AX)*0.62 + 0.38, 0.);
  // daylight down the shaft (most on what stands in the hole itself), daylight thrown back by the lit snow and floor, roof glow
  float topK = smoothstep(${(I-3.4).toFixed(1)}, ${(I+1.2).toFixed(1)}, vL.y)*belly;
  vec3 key = uDayCol*uDay*(0.9*dl*dl*cone*(1. - 0.7*belly) + 0.3*topK*(0.4 + 0.6*dl));
  vec3 fill = uDayCol*uDay*(0.5 + 0.3*max(-N.y, 0.))*wide*(1. - 0.92*talon)*(1. - 0.6*belly);
  vec3 L = key*(1. - 0.7*talon) + fill + mix(uShadowCol*0.6, uAmb*1.1, N.y*0.5 + 0.5);
  vec3 col = alb*occ*L;
  col += (uDayCol*uDay*(0.5*cone + 0.28*wide + 0.3*topK) + uAmb*0.7)*edgeK*0.22*mix(alb, vec3(1.), 0.25);
  float fr = 1. - max(dot(N, V), 0.); fr *= fr*fr;
  col += (uDayCol*uDay*(0.6*cone + 0.2*wide) + uAmb*0.5)*fr*mix(1., 0.015, talon)*(1. - 0.75*isF)*(1. - 0.7*belly);
  // the daylight on the outline of the legs and toes (legK: not the belly, not the talons): nothing where the surface faces the eye
  // by 0.55 or more, rising to 0.8 of the daylight where it faces the eye by 0.05 or less, times cone (the fall-off from the shaft's axis)
  col += uDayCol*uDay*cone*legK*0.8*smoothstep(0.45, 0.95, 1. - max(dot(N, V), 0.));
  vec3 Hh = normalize(AX + V + vec3(0., 1e-3, 0.));
  float sp = max(dot(N, Hh), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  col += uDayCol*vec3(0.78, 0.9, 1.1)*uDay*sp*sp*3.4*talon*(0.3 + 0.7*cone);
  col = max(col, vec3(0.));
  gl_FragColor = vec4(col, 1.);
  ${ze}
}`}),q=new u.Mesh(o.build(),x);return q.frustumCulled=!1,q.name="strike-legs",{mesh:q,hubs:$}}function Gt(C,e){const $=[[0,0],[0,.34],[0,.67],[0,1],[.5,1],[1,1],[1,.55],[1,0]],h=[],D=[],P=$.length;for(let f=0;f<=176;f++)for(const[t,d]of $)h.push(f/176*te,d,t);for(let f=0;f<176;f++)for(let t=0;t+1<P;t++){const d=f*P+t,z=d+P;D.push(d,z,z+1,d,z+1,d+1)}const L=new u.BufferGeometry;L.setAttribute("position",new u.Float32BufferAttribute(h,3)),L.setIndex(D);const M=new u.Mesh(L,new u.ShaderMaterial({uniforms:{...xe(),...C,uBulge:e.uBulge,uHole:e.uHole,uSeed:e.uSeed},fog:!0,side:u.DoubleSide,vertexShader:`
varying vec3 vL; varying vec3 vQ;
${pe}
${ce}
${nt}
void main(){
  float th = position.x, v = position.y, wall = position.z;
  vec2 e = vec2(cos(th), sin(th)), c = vec2(0., 1.5);
  float cu = th/6.28318*${22 .toFixed(1)}, ci = mod(floor(cu), ${22 .toFixed(1)}), cf = fract(cu);
  float h1 = h11(ci*7.3 + uSeed), h2 = h11(ci*3.1 + 9. + uSeed);
  float notch = smoothstep(0., 0.14, cf)*(1. - smoothstep(0.86, 1., cf));
  float len = (mix(1.6, 0.85, smoothstep(0.1, 0.8, e.y))*(0.55 + 0.75*h1)*(0.3 + 0.7*notch) + 0.3)*uHole;
  float thick = (0.9 + 0.9*h2)*(0.45 + 0.55*notch);
  vec2 q = c + e*${at.toFixed(1)}/vec2(1., 0.82);
  for (int i = 0; i < 3; i++) { vec2 d = q/max(length(q), 1e-3); q = c + e*(holeRag(d)*uHole + 0.1 + wall*thick)/vec2(1., 0.82); }
  vec2 qc = q - c;
  q -= qc/max(length(qc), 1e-3)*(0.2 + 0.45*h2)*v*len*(1. - 0.5*wall);
  float d = v*len*(1. - 0.3*wall*(h1 - 0.3));
  vec3 p = vec3(q.x, 0.45*(1. - v) - discDrop(q) - d, q.y);
  vL = p + vec3(0., ${(I-.2).toFixed(2)}, ${me.toFixed(3)});
  vQ = vec3(d, wall, h1);
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  ${we}
}`,fragmentShader:`
varying vec3 vL; varying vec3 vQ;
${ye}
${ce}
${Me}
void main(){
  vec3 V = normalize(uCamL - vL);
  vec3 N = facetN(vL, vec3(0., -1., 0.), V);
  // strata: layers some 0.45 m thick, each of its own tone, with a dark seam under it; one glassy lens
  float d = vQ.x + 0.3*(vn2(vL.xz*0.5 + 3.) - 0.5);
  float li = d/0.45, lid = floor(li), lf = fract(li);
  float tone = 0.12 + 0.88*h11(lid*5.3 + 2.1), seam = 1. - 0.7*(1. - smoothstep(0., 0.2, lf));
  float gr = vn3(vL*2.1), gr2 = vn3(vL*6.3);
  vec3 alb = mix(vec3(0.20, 0.33, 0.60), vec3(0.42, 0.56, 0.82), tone)*seam*(0.8 + 0.25*gr + 0.15*gr2);
  float lens = exp(-(d - 0.72)*(d - 0.72)/0.012);
  alb = mix(alb, vec3(0.30, 0.78, 0.86), lens*0.8);
  float inner = 1. - vQ.y;
  float wide = exp(-dot(vL.xz, vL.xz)/1300.);
  vec3 L = uDayCol*uDay*((0.06 + 0.75*inner)*(0.7 + 0.3*N.y) + (0.2 + 0.3*inner)*wide*max(-N.y*0.6 + 0.4, 0.)) + uSkyCol*0.45*inner + uAmb*(0.75 + 0.5*inner) + uTurq*0.3*(1. - inner) + uShadowCol*0.5;
  vec3 col = alb*L;
  col += (uDayCol*uDay*1.6 + uAmb)*glitter(vL, V, 4.)*(0.5 + inner);
  gl_FragColor = vec4(max(col, vec3(0.)), 1.);
  ${ze}
}`}));return M.position.set(0,I-.2,me),M.frustumCulled=!1,M.name="strike-lip",M}function Bt(C,e,a,o){const $=new $e,h=new _,D=new _,P=new _;a.forEach((M,f)=>{for(let t=0;t<46;t++){const d=e.range(0,te),z=e.range(.4,5.2),O=d+e.range(-1.1,1.1),j=e.range(3.2,6.5),V=e.range(.26,.4),m=e.range(.15,1.3)*(e()<.3?2:1),n=e(),F=e.range(.7,1.15),b=[.56*F,.45*F,.23*F],G=6,S=[];D.set(Math.cos(O),0,Math.sin(O)),P.set(-D.z,0,D.x);for(let x=0;x<=G;x++){const q=x/G,p=V*.5*Math.pow(1-q,.6)*(.5+.5*Math.min(q*6,1))+.012;h.set(M.x+Math.cos(d)*z,.1+m*Math.sin(Math.PI*Math.min(q*1.15,1))+.5*m*q*q,M.z+Math.sin(d)*z).addScaledVector(D,j*q),S.push([$.v(h.x-P.x*p,h.y,h.z-P.z*p,b,[M.x,M.z,f,n],[-1,q,0,0]),$.v(h.x,h.y+p*.5,h.z,b,[M.x,M.z,f,n],[0,q,0,0]),$.v(h.x+P.x*p,h.y,h.z+P.z*p,b,[M.x,M.z,f,n],[1,q,0,0])])}for(let x=0;x<G;x++)$.quad(S[x][0],S[x][1],S[x+1][1],S[x+1][0]),$.quad(S[x][1],S[x][2],S[x+1][2],S[x+1][1])}});const L=new u.Mesh($.build(),new u.ShaderMaterial({uniforms:{...xe(),...C,uFoot:o},fog:!0,side:u.DoubleSide,vertexShader:`
attribute vec4 a; attribute vec4 b; attribute vec3 color;
uniform vec2 uFoot[2]; uniform float uTime;
varying vec3 vL; varying vec3 vN; varying vec3 vC; varying vec4 vB;
${pe}
void main(){
  vec3 p = position; vec2 foot = mix(uFoot[0], uFoot[1], a.z);
  vec2 dh = p.xz - a.xy; float near = exp(-dot(dh, dh)/9.), cl = max(foot.x, 0.)*near;
  p.xz -= dh*0.5*cl; p.y += 1.6*cl*b.y + 0.04*sin(uTime*2.1 + a.w*40.)*b.y;
  vL = p; vN = normal; vC = color; vB = vec4(b.xy, a.w, 0.);
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  ${we}
}`,fragmentShader:`
varying vec3 vL; varying vec3 vN; varying vec3 vC; varying vec4 vB;
${ye}
${ce}
${Me}
void main(){
  vec3 V = normalize(uCamL - vL);
  vec3 N = normalize(vN); if (dot(N, V) < 0.) N = -N;
  float ax = abs(vB.x), v = vB.y, h = vB.z;
  vec3 alb = vC*(0.7 + 0.4*vn2(vec2(vB.x*4. + h*30., v*9.)))*(1. - 0.45*(1. - smoothstep(0.03, 0.14, ax)));
  alb = mix(alb, vec3(0.62, 0.72, 0.8), smoothstep(0.7, 1., ax)*0.5 + 0.3*smoothstep(0.8, 1., v));
  float ad = axisDist(vL)/12.5, cone = exp(-ad*ad), wide = exp(-dot(vL.xz, vL.xz)/1100.);
  vec3 L = uDayCol*uDay*(1.0*cone + 0.45*wide)*(0.45 + 0.55*N.y) + uAmb*(1.3 + 0.8*N.y) + uShadowCol*0.8;
  gl_FragColor = vec4(alb*L, 1.);
  ${ze}
}`}));return L.frustumCulled=!1,L.name="strike-sedge",L}const xt=2,We=.05,Et=1,Ht=.36,yt=Ne,Ot=180,lt=20;async function Rt(C,e,a){const o=C.geometry,$=o.attributes.position,h=$.array,D=o.attributes.a.array,P=o.attributes.b.array;await a();const L=Math.ceil(e.length/We)+1,M=new Float64Array(L*3),f=new _;for(let n=0;n<L;n++)e.posAtDist(Math.min(n*We,e.length),f),M[n*3]=f.x,M[n*3+1]=f.y,M[n*3+2]=f.z;await a();const t=new Float32Array(63),d=new Float64Array(21),z=new Float64Array(7),O=(n,F,b)=>Math.sqrt(n*n+F*F+b*b);let j=[],V=0,m=!1;for(let n=0;n<$.count;n+=21){const F=h[n*3+3],b=h[n*3+1],G=h[n*3+5],S=D[n*4],x=D[n*4+1];V=0;const q=(r,s)=>{const B=Math.cos(r),k=Math.sin(r);let R=0,Z=0;for(let l=0;l<7;l++){const v=(n+l*3)*3,y=l*9,E=P[(n+l*3)*4+1],X=b+(h[v+1]-b)*s;for(let w=0;w<9;w+=3){const H=h[v+w]-F,W=h[v+w+2]-G;t[y+w]=F+H*B-W*k,t[y+w+1]=X+(h[v+w+1]-h[v+1]),t[y+w+2]=G+H*k+W*B}const i=(t[y]+t[y+6])/2,g=(t[y+1]+t[y+7])/2,A=(t[y+2]+t[y+8])/2;d[l*3]=i,d[l*3+1]=g,d[l*3+2]=A,z[l]=0;for(let w=0;w<9;w+=3){const H=t[y+w]-S,W=t[y+w+2]-x,ee=Ht*Math.exp(-(H*H+W*W)/9);z[l]=Math.max(z[l],O(t[y+w]-i,t[y+w+1]-g,t[y+w+2]-A)+O(H*.5*ee,1.6*ee*E,W*.5*ee)+.04*E)}R=Math.max(R,O(i-F,g-b,A-G)),Z=Math.max(Z,z[l])}const J=R+Z+xt+We;if(J>V){V=J+Et,j=[];for(let l=0;l<L*3;l+=3)O(M[l]-F,M[l+1]-b,M[l+2]-G)<=V&&j.push(l)}for(let l=0;l<6;l++){const v=d[l*3],y=d[l*3+1],E=d[l*3+2],X=d[l*3+3]-v,i=d[l*3+4]-y,g=d[l*3+5]-E,A=xt+We+Math.max(z[l],z[l+1]);for(const w of j){const H=M[w]-v,W=M[w+1]-y,ee=M[w+2]-E,le=Re((H*X+W*i+ee*g)/(X*X+i*i+g*g),0,1);if(O(H-X*le,W-i*le,ee-g*le)<A)return!1}}return!0};if(q(0,1))continue;let p=!1;for(let r=0;r<=lt&&!p;r++){for(let s=r?0:1;s<=Ot&&!p;s++)p=q(s*yt,1-r/lt)||s>0&&q(-s*yt,1-r/lt);await a()}p||q(0,0),h.set(t,n*3),m=!0}m&&($.needsUpdate=!0,o.computeVertexNormals())}function Kt(C,e,a,o,$,h,D,P){const L=(l,v)=>{const y=new u.BoxGeometry(1,1,1,l,l,l).toNonIndexed(),E=y.getAttribute("position");for(let X=0;X<E.count;X++){let i=E.getX(X),g=E.getY(X),A=E.getZ(X);const w=Math.abs(i),H=Math.abs(g),W=Math.abs(A),ee=w+H+W-Math.max(w,H,W)-Math.min(w,H,W),le=Math.hypot(i,g,A)||1,re=.62/le;i=ae(i,i*re,.45),g=ae(g,g*re,.45),A=ae(A,A*re,.45);let ve=1+.22*o.n3(i*2.3+7,g*2.3,A*2.3)+.1*o.n3(i*6,g*6+3,A*6);v&&(ve+=.045*o.n3(i*13+1,g*13,A*13+5)-.2*N(.3,.5,ee)*Math.max(0,.35+o.n3(i*4.5+11,g*4.5+5,A*4.5))),E.setXYZ(X,i*ve,g*ve,A*ve)}return E},M=Math.round(330*(.6+.4*D)),f=new Float32Array(M*4),t=new Float32Array(M*4),d=new Float32Array(M*4),z=new Float32Array(M*4),O=(l,v,y)=>y<.8?Math.abs(l)>2.4||v<-14:(Math.abs(l)>4.3+y*.5||v<-16)&&!(v>-2.5&&v<16&&Math.abs(l)<10)&&!(v>=16&&Math.abs(l)<8.2),j=27,V=Ce[0]+Ce[1]+Ce[2],m=10,n=[a.shuffle([0,1,2,3,4]),a.shuffle([0,1,2,3,4])];for(let l=0;l<M;l++){let v,y,E,X,i,g,A,w,H,W,ee,le,re=0;const ve=l<m;do{ee=$,le=0;const fe=l/M,T=e.range(0,te);if(w=fe<.1?e.range(2,3):fe<.36?e.range(1,2):fe<.82&&e()<.55?e.range(1.1,2.3):e.range(.5,1),ve){const U=l%2?1:-1;A=(l+a())/m*h,W=a.range(.3,.8),v=U*a.range(2.5,7),E=me+a.range(1,8),y=I+a.range(0,4.5),i=a.range(0,5),H=(i+Math.sqrt(i*i+2*$*Math.max(y-w*.36,0)))/$;const ne=P.find(ge=>ge.x*U>0).z+V+w*.5,Le=ne+(j-ne)*(n[l%2][l>>1]+a())/5,ke=U*(4.3+w*.5+a.range(0,1.3)),Y=H+W*.45;X=(ke-v)/Y,g=(Le-E)/Y}else if(fe<.42){const U=Math.sqrt(e())*9.5;v=Math.cos(T)*U,E=me+Math.sin(T)*U*1.1,y=I-1.5-e.range(0,2.5);const ne=e.range(2.5,13)*(.5+U/9.5)*(Math.sin(T)>0?1.5:1);X=Math.cos(T)*ne,g=Math.sin(T)*ne+2,i=-e.range(1,15)+e.range(0,5)*(U/9.5),A=e()*e()*.5}else if(fe<.82){const U=e.range(9,12.5);v=Math.cos(T)*U,E=me+Math.sin(T)*U*1.1,y=I-e.range(.5,2),X=-Math.cos(T)*e.range(0,2.5),g=-Math.sin(T)*e.range(0,2.5),i=-e.range(0,3),A=.3+Math.pow(e(),.95)*(h-.2)}else if(fe<.94){const U=e.range(5,12);v=Math.cos(T)*U,E=me+Math.sin(T)*U,y=I+e.range(-1,6),X=Math.cos(T)*e.range(-1,5),g=Math.sin(T)*e.range(-1,5),i=e.range(-2,9),A=h+.1+Math.pow(e(),1.3)*2.2}else{const U=e.range(30,56),ne=e.range(5.5,9);v=Math.cos(T)*ne,y=U*se,E=-U*be+Math.sin(T)*ne,X=0,g=e.range(.2,1.2),i=-e.range(0,4),A=h+2.2+e()*4.5,w=e.range(.5,1.3),ee=.8*$*se,le=.8*$*be}const he=w*.36;H=(i+Math.sqrt(i*i+2*ee*Math.max(y-he,0)))/ee,ve||(W=e.range(.25,.8))}while(!ve&&!O(v+X*H+X*W*.45,E+g*H+.5*le*H*H+g*W*.45,w)&&++re<80);re>=80&&(w=Math.min(w,.7));const Se=new _(e.range(-1,1),e.range(-1,1),e.range(-1,1)).normalize();f.set([v,y,E,w],l*4),t.set([X,i,g,A],l*4),d.set([Se.x,Se.y,Se.z,e.range(1.5,6)*e.sign()/Math.sqrt(w)],l*4),z.set([H,Math.min(.24*Math.abs(i-ee*H),5.5),W+(le>0?10:0),e()],l*4)}const F=[];for(let l=0;l<m;l++){const v=l*4,y=z[v];F.push([f[v]+t[v]*y,f[v+2]+t[v+2]*y,t[v+3]+y,t[v],t[v+2],z[v+2],f[v+3]])}const b=(l,v,y)=>{const E=new u.InstancedBufferGeometry;return E.setAttribute("position",l),E.instanceCount=y,[["iA",f],["iB",t],["iC",d],["iD",z]].forEach(([X,i])=>E.setAttribute(X,new u.InstancedBufferAttribute(i.slice(v*4,(v+y)*4),4))),E},G=`
uniform float uStr, uFacet;
varying vec3 vL; varying vec3 vN; varying float vH; varying vec3 vP;
${ye}
${ce}
${Me}
void main(){
  vec3 V = normalize(uCamL - vL);
  vec3 Ns = normalize(vN); if (dot(Ns, V) < 0.) Ns = -Ns;
  vec3 N = normalize(mix(Ns, facetN(vL, Ns, V), uFacet));
  float dep = clamp((${de.toFixed(1)} - vL.y)/50., 0., 1.);
  float skyVis = mix(1., 0.09, pow(dep, 0.65))*smoothstep(${(I-1).toFixed(1)}, ${(I+6).toFixed(1)}, vL.y);
  // snow: white, soft lumps of two sizes laid in the block's own space (they turn with it), no grain fine enough to stipple
  float gr = vn3(vP*1.3 + vH*20.), gr2 = vn3(vP*3.3 + vH*9.);
  vec3 alb = vec3(0.90, 0.93, 0.96)*(0.82 + 0.12*gr + 0.08*gr2);
  alb = mix(alb, vec3(0.60, 0.77, 0.90), smoothstep(0.55, 0.8, vn3(vP*0.7 + vH*31.))*0.3);       // bluer, denser lumps of old snow
  // a block is a piece of the layered roof (uStr): strata some 0.4 m thick across it (depth hoar, wind slab, powder, now and then a
  // glassy blue ice lens), each of its own tone with a soft seam
  float li = vP.y/0.42 + 0.35*(vn2(vP.xz*1.4 + vH*13.) - 0.5), lf = fract(li), lh = h11(floor(li)*5.3 + vH*31.);
  alb *= mix(1., (0.74 + 0.26*lh)*(1. - 0.4*(1. - smoothstep(0., 0.2, lf)))*(0.92 + 0.16*vn3(vP*1.1 + vH*7.)), uStr);
  alb = mix(alb, vec3(0.50, 0.74, 0.95), 0.55*uStr*step(0.86, h11(floor(li)*9.1 + vH*3.))*smoothstep(0., 0.2, lf));
  vec3 col = alb*snowLight(vL, N, skyVis);
  float frS = 1. - max(dot(N, V), 0.); col += alb*(uAmb*1.2 + uDayCol*uDay*0.25*exp(-dot(vL.xz, vL.xz)/900.))*frS*frS;
  float ad = axisDist(vL)/12.5;
  col += alb*(uTurq*0.07*(1. - N.y) + uCobalt*0.16*smoothstep(${I.toFixed(1)}, ${(I+8).toFixed(1)}, vL.y));   // a little light inside the lump
  // a block in the gallery stands in the daylight that pours from the hole: white on the side turned to it, blue in its own shade
  { vec3 toH = normalize(vec3(-vL.x, 9., ${me.toFixed(2)} - vL.z)); float dH = max(dot(N, toH)*0.6 + 0.4, 0.), blw = 1. - smoothstep(${(I-1).toFixed(1)}, ${(I+6).toFixed(1)}, vL.y);
    col += alb*(uDayCol*uDay*1.1*dH*dH*exp(-min(dot(vL.xz, vL.xz)/2600., 40.)) + (uDayCol*0.3 + uTurq*0.06)*(0.35 + 0.65*max(N.y, 0.)))*blw*uStr; }
  col += uDayCol*uDay*exp(-ad*ad)*3.*glitter(vL, V, 4.)*mix(1., 0.35, uStr);
  gl_FragColor = vec4(max(col, vec3(0.)), 1.);
  ${ze}
}`,S=`
attribute vec4 iA; attribute vec4 iB; attribute vec4 iC; attribute vec4 iD;
uniform float uT, uG;
varying vec3 vL; varying vec3 vN; varying float vH; varying vec3 vP;
${pe}
${ce}
void main(){
  float tau = uT - iB.w, vis = step(0., tau);
  float tA = clamp(tau, 0., iD.x), tB = max(tau - iD.x, 0.);
  float sh = step(5., iD.z), roll = iD.z - 10.*sh;                      // sh: slides down the leaning shaft
  vec3 c = iA.xyz + iB.xyz*tA + mix(vec3(0., -1., 0.), -AX*0.8, sh)*0.5*uG*tA*tA;
  float tb = min(tB, 2.*iD.y/uG);                                     // one bounce
  c.y += iD.y*tb - 0.5*uG*tb*tb;
  c.xz += iB.xz*roll*0.45*(1. - exp(-tB/0.45));                       // then it rolls to rest
  float an = iC.w*tA + iC.w*0.4*(1. - exp(-tB/0.4));
  vec3 sc = vec3(1., 0.62 + 0.5*iD.w, 0.72 + 0.5*fract(iD.w*7.3))*iA.w*vis*smoothstep(0., 0.12, tau);
  vec3 p = rotAx(position*sc, iC.xyz, an);
  vL = c + p; vN = rotAx(normalize(position), iC.xyz, an); vH = iD.w; vP = position*sc;
  vec4 mvPosition = modelViewMatrix*vec4(vL, 1.);
  gl_Position = projectionMatrix*mvPosition;
  ${we}
}`,x=l=>new u.ShaderMaterial({uniforms:{...xe(),...C,uG:{value:$},uStr:{value:1},uFacet:{value:l}},fog:!0,vertexShader:S,fragmentShader:G}),q=new u.Mesh(b(L(2,!1),m,M-m),x(.3));q.frustumCulled=!1,q.name="strike-blocks";const p=new u.Mesh(b(L(7,!0),0,m),x(.35));p.frustumCulled=!1,p.name="strike-blocks-near",q.add(p);const r=new $e,s=20,B=56,k=[],R=[1,1,1];for(let l=0;l<=s;l++){const v=.3+15.5*(l/s),y=[];for(let E=0;E<B;E++){const X=E/B*te,i=Math.cos(X)*v*(1+.12*o.n2(X*2+5,v*.1)),g=Math.sin(X)*v*1.15-1.5,A=(.45+.55*N(2.5,6.5,Math.abs(i)))*Math.max(1-N(-5,.5,g),.75*N(8.5,11.5,Math.abs(i))),w=(2.1*Math.exp(-v*v/80)*(.55+.6*(o.fbm2(i*.22+3,g*.22,3)+.5))+.35*Math.max(0,o.n2(i*.7,g*.7+9)))*A*(1-N(11,15.5,v));y.push(r.v(i,w>.05?w:w*12-.6,g,R,[w,0,0,0]))}k.push(y)}const Z=r.v(0,.5,-1.5,R,[.5,0,0,0]);for(let l=0;l<B;l++)r.tri(Z,k[0][(l+1)%B],k[0][l]);for(let l=0;l<s;l++)for(let v=0;v<B;v++){const y=(v+1)%B;r.quad(k[l][v],k[l][y],k[l+1][y],k[l+1][v])}const J=new u.Mesh(r.build(),new u.ShaderMaterial({uniforms:{...xe(),...C,uGrow:{value:0},uStr:{value:0},uFacet:{value:.3}},fog:!0,side:u.DoubleSide,vertexShader:`
uniform float uGrow;
varying vec3 vL; varying vec3 vN; varying float vH; varying vec3 vP;
${pe}
void main(){
  vec3 p = position; p.y = p.y > 0. ? p.y*uGrow : p.y;
  vL = p; vN = normalize(vec3(normal.x*uGrow, normal.y, normal.z*uGrow) + vec3(0., 1e-3, 0.)); vH = 0.3; vP = p;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  ${we}
}`,fragmentShader:G}));return J.frustumCulled=!1,J.name="strike-mound",{blocks:q,mound:J,lands:F}}function jt(C,e,a,o,$,h,D,P=[]){const L=[],M=[],f=[],t=(r,s,B,k,R,Z,J,l,v,y,E)=>{L.push(r,s,B,k),M.push(R,Z,J,l),f.push(v,y,E,e())},d=Math.round(170*h),z=Math.round(90*h),O=Math.round(150*h),j=Math.round(110*h),V=Math.round((D?200:80)*h);for(let r=0;r<d;r++){const s=e.range(0,te),B=Math.sqrt(e())*10,k=e.range(2,11);t(Math.cos(s)*B,I-e.range(.5,3),me+Math.sin(s)*B,e.range(1.6,3.4),Math.cos(s)*k,-e.range(4,20),Math.sin(s)*k+1.5,e()*.3,e.range(1,1.9),e.range(1.2,2.4),0)}for(let r=0;r<z;r++){const s=e.range(0,te),B=e.range(7,20),k=e.sign()*5.3;t(k+Math.cos(s)*2,e.range(.3,1.2),Math.sin(s)*2,e.range(1.8,3.6),Math.cos(s)*B,e.range(.5,5),Math.sin(s)*B,$+e()*.08,e.range(.9,1.7),e.range(2.5,4),0)}for(let r=0;r<O;r++){const s=e.range(0,26),B=e.range(0,te),k=e.range(1,8.5),R=e.range(14,46);t(oe.x*s+Math.cos(B)*k,oe.y*s+e.range(0,2),oe.z*s+Math.sin(B)*k,e.range(2.4,4.6),Math.cos(B)*2.5,R*se,-R*be+Math.sin(B)*2.5,o+e()*.25+s*.006,e.range(.8,1.25),e.range(.9,1.7),0)}for(let r=0;r<j;r++){const s=e.range(0,te),B=e.range(8.5,11.5);t(Math.cos(s)*B,I+e.range(-1.5,1),me+Math.sin(s)*B*1.1,e.range(1.2,2.6),e.range(-.6,.6),-e.range(2,5),e.range(-.6,.6),e()*3,e.range(2.2,3.2),.3,1)}for(let r=0;r<V;r++)t(-34+e.range(-6,6),de+e.range(.6,3.4),-38+e.range(-9,8),e.range(1.6,3.4),e.range(13,20),e.range(-.2,.5),e.range(-1.5,1.5),e()*4,e.range(3.4,4.2),.02,2);P.forEach(([r,s,B,k,R,Z,J],l)=>{const v=y=>{const E=Math.sin((l*13+y)*127.1+4.3)*43758.5453;return E-Math.floor(E)};for(let y=0;y<9;y++){const E=v(y)*te,X=2+5*v(y+20),i=y<5?0:(y-4)*.16,g=Z*.45*(1-Math.exp(-i/.45));L.push(r+k*g+Math.cos(E)*J*.4,.3+.8*v(y+40),s+R*g+Math.sin(E)*J*.4,(y<5?1:.7)*J*(.7+.5*v(y+60))),M.push(Math.cos(E)*X+k*.4,1+3*v(y+80),Math.sin(E)*X+R*.4,B+i),f.push(.9+.7*v(y+100),3,0,v(y+120))}});const m=new u.BufferGeometry,n=L.length/4;m.setAttribute("position",new u.Float32BufferAttribute(new Float32Array(n*3),3)),m.setAttribute("aP",new u.Float32BufferAttribute(L,4)),m.setAttribute("aV",new u.Float32BufferAttribute(M,4)),m.setAttribute("aM",new u.Float32BufferAttribute(f,4));const F=new u.Points(m,new u.ShaderMaterial({uniforms:{...xe(),...C,uG:{value:a},uPx:{value:400},uHole:{value:0}},fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
attribute vec4 aP; attribute vec4 aV; attribute vec4 aM;
uniform float uT, uTime, uG, uPx, uHole;
varying float vA; varying vec3 vL; varying float vMode;
${pe}
void main(){
  float mode = aM.z, loop = step(0.5, mode);
  float tau = mix(uT - aV.w, mod(uTime + aV.w, aM.x), loop);
  float f = tau/aM.x, k = aM.y;
  float e = (1. - exp(-k*max(tau, 0.)))/k;
  vec3 p = aP.xyz + aV.xyz*e;
  p.y -= 0.5*uG*0.16*tau*tau*step(mode, 0.5);
  p.y = max(p.y, 0.25 + 0.4*aM.w);
  if (mode > 1.5) { p.y += sin(p.x*0.22 + aM.w*20.)*0.7; }
  float on = step(0., tau)*step(f, 1.)*mix(1., uHole, loop*step(mode, 1.5));
  float fa = smoothstep(0., 0.08, f)*(1. - f); 
  vA = on*fa*fa*mix(0.15, mode > 1.5 ? 0.3 : 0.2, loop);
  vL = p; vMode = mode;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  vA *= smoothstep(2.5, 10., -mvPosition.z);                           // never a sheet across the lens
  gl_PointSize = clamp(aP.w*(1. + 1.7*f)*uPx/max(-mvPosition.z, 0.5), 0., uPx*0.3)*on;
  ${we}
}`,fragmentShader:`
varying float vA; varying vec3 vL; varying float vMode;
${ye}
${ce}
${Me}
void main(){
  vec2 q = gl_PointCoord*2. - 1.; float r2 = dot(q, q);
  if (r2 > 1. || vA < 0.004) discard;
  float soft = (1. - r2); soft *= soft;
  float ad = axisDist(vL)/13.; float cone = exp(-ad*ad)*(1. - smoothstep(${(I+2).toFixed(1)}, ${(I+14).toFixed(1)}, vL.y));
  float up = smoothstep(${(I+4).toFixed(1)}, ${de.toFixed(1)}, vL.y);
  vec3 col = uDayCol*uDay*0.95*cone + uAmb*1.2 + (uSkyCol*0.8 + uSunCol*0.35)*up + uTurq*0.45*smoothstep(4., 11., vL.y)*(1. - up);
  gl_FragColor = vec4(col*0.8, vA*soft);
  ${ze}
}`}));F.frustumCulled=!1,F.renderOrder=5,F.name="strike-powder";const b=Math.round(3e3*h),G=new Float32Array(b*3),S=new Float32Array(b*4),x=new Float32Array(b);for(let r=0;r<b;r++){const s=r<b*.15,B=!s&&r<b*.33,k=B?e.range(Math.PI-.25,te+.25):e.range(0,te);if(s){const R=Math.sqrt(e())*30;G[r*3]=Math.cos(k)*R,G[r*3+1]=e.range(0,I),G[r*3+2]=me+Math.sin(k)*R}else{const R=e.range(0,B?17.5:70),Z=Math.sqrt(e())*(B?10.5:9.5);G[r*3]=Math.cos(k)*Z,G[r*3+1]=R*se,G[r*3+2]=-R*be+Math.sin(k)*Z}S.set([e.range(1.2,4.5),e(),s?1:0,B?e.range(.16,.36):e.range(.08,.2)],r*4),x[r]=s?I:B?17.5*se:70*se}const q=new u.BufferGeometry;q.setAttribute("position",new u.Float32BufferAttribute(G,3)),q.setAttribute("aG",new u.Float32BufferAttribute(S,4)),q.setAttribute("aSp",new u.Float32BufferAttribute(x,1));const p=new u.Points(q,new u.ShaderMaterial({uniforms:{...xe(),...C,uPx:{value:400},uSift:{value:0}},fog:!0,transparent:!0,depthWrite:!1,blending:u.AdditiveBlending,vertexShader:`
attribute vec4 aG; attribute float aSp;
uniform float uTime, uPx, uSift, uDay; uniform vec3 uCamL;
varying float vI; varying float vS;
${pe}
void main(){
  vec3 p = position; float sift = aG.z;
  float span = aSp;
  float y = mod(p.y - uTime*aG.x*mix(1., 0.5, sift), span);
  p.z += (p.y - y)*${(be/se).toFixed(4)}*(1. - sift);         // stay inside the leaning column
  p.y = y; p.x += sin(uTime*1.3 + aG.y*40.)*0.4; p.z += cos(uTime*1.1 + aG.y*31.)*0.4;
  vec3 d = vec3(fract(aG.y*13.1), fract(aG.y*27.7), fract(aG.y*51.3))*2. - 1.;
  float tw = max(0., sin(uTime*(3. + 5.*aG.y) + aG.y*90. + dot(d, normalize(uCamL - p))*8.)); tw *= tw; tw *= tw;
  vI = (0.28 + 0.72*tw*tw)*mix(uDay, uSift*0.55, sift); vS = sift;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  gl_PointSize = clamp(aG.w*uPx/max(-mvPosition.z, 0.5), 1.8, 4.2)*step(0.004, vI);
  ${we}
}`,fragmentShader:`
uniform vec3 uDayCol, uTurq;
varying float vI; varying float vS;
${ye}
void main(){
  vec2 q = gl_PointCoord*2. - 1.; float r2 = dot(q, q);
  if (r2 > 1.) discard;
  float core = (1. - r2); core *= core;
  gl_FragColor = vec4(mix(uDayCol*5., uTurq*4. + uDayCol, vS)*vI*core, 1.);
  ${ot}
}`}));return p.frustumCulled=!1,p.renderOrder=6,p.name="strike-glitter",{puffs:F,glit:p}}function Tt(C,e,a){const o=new $e,$=[[46,e.range(2.3,3.6),a+2.6,3,2.6],[79,e.range(-.4,.5),a+3.6,2.6,2.2],[30,e.range(.2,1.4),a+.5,3.4,1.6],[24,e.range(3.4,4.6),a+.9,3.8,1.4],[58,e.range(4.6,5.8),a+3,3.2,1.8]];for(const[D,P,L,M,f]of $){const t=e(),d=[D,P,L,M],z=1,O=26,j=[.74,.76,.78],V=[.6,.63,.67],m=[];for(let n=0;n<=6;n++){const F=n/6,b=(F-.25)*z,G=.02*(1-F*.7),S=.12*F*F;m.push([o.v(-G,b,S,j,d,[t,0,f,0]),o.v(G,b,S,j,d,[t,0,f,0])])}for(let n=0;n<6;n++)o.quad(m[n][0],m[n][1],m[n+1][1],m[n+1][0]);for(const n of[-1,1])for(let F=0;F<O;F++){const b=F/(O-1),G=(b-.2)*z,S=(.34+.2*Math.sin(b*Math.PI)-.14*b)*e.range(.8,1.15),x=.25+.5*b,q=.12*b*b,p=.02,r=e.range(.05,.22),s=o.v(0,G-p,q,j,d,[t,0,f,0]),B=o.v(0,G+p,q,j,d,[t,0,f,0]),k=n*S*.6,R=G+S*.6*x,Z=o.v(k,R-p,q+r*.5,j,d,[t,.6,f,0]),J=o.v(k,R+p,q+r*.5,j,d,[t,.6,f,0]),l=o.v(n*S,G+S*x*1.05,q+r*1.6,V,d,[t,1,f,0]);o.quad(s,Z,J,B),o.tri(Z,l,J)}}const h=new u.Mesh(o.build(),new u.ShaderMaterial({uniforms:{...xe(),...C},fog:!0,side:u.DoubleSide,vertexShader:`
attribute vec4 a; attribute vec4 b; attribute vec3 color;
uniform float uT, uTime;
varying vec3 vL; varying vec3 vN; varying vec3 vC;
${pe}
${ce}
void main(){
  float tau = uT - a.z, on = step(0., tau), h = b.x;
  vec3 p = position*b.z*on;
  p.z += b.y*b.y*0.25*b.z*sin(uTime*3. + h*20.);                      // barbs breathe
  float rock = sin(tau*1.7 + h*6.)*0.9;
  vec3 n = normal;
  p = rotAx(p, vec3(0., 1., 0.), tau*0.9 + h*5.); n = rotAx(n, vec3(0., 1., 0.), tau*0.9 + h*5.);
  p = rotAx(p, vec3(0., 0., 1.), 1.2 + rock); n = rotAx(n, vec3(0., 0., 1.), 1.2 + rock);
  vec3 c = AX*a.x + vec3(cos(a.y), 0., sin(a.y))*4.6;
  c -= AX*a.w*tau*(0.75 + 0.25*cos(tau*3.4 + h*6.));                  // falls in swoops, down the shaft
  c += vec3(cos(tau*1.7 + h*6.), 0., sin(tau*1.1 + h*3.))*0.9;
  vL = c + p; vN = n; vC = color;
  vec4 mvPosition = modelViewMatrix*vec4(vL, 1.);
  gl_Position = projectionMatrix*mvPosition;
  ${we}
}`,fragmentShader:`
varying vec3 vL; varying vec3 vN; varying vec3 vC;
${ye}
${ce}
${Me}
void main(){
  vec3 N = normalize(vN);
  float up = smoothstep(${I.toFixed(1)}, ${(de-8).toFixed(1)}, vL.y);
  vec3 L = uSkyCol*(0.35 + 0.75*up) + uSunCol*(0.25 + 0.5*abs(dot(N, uSunL)))*smoothstep(${(de-16).toFixed(1)}, ${de.toFixed(1)}, vL.y) + uAmb + uDayCol*uDay*0.5*(1. - up);
  gl_FragColor = vec4(vC*L, 1.);
  ${ze}
}`}));return h.frustumCulled=!1,h.name="strike-feathers",h}const Be=42;function It(C,e){const a=new $e,o=[[31,.5,.5,2],[29,6.4,6.8,2],[25,10.6,10.8,2.2],[20,11.6,11.6,2],[14,8.8,8.8,1.2],[8,9.2,9,.5],[0,9,8.6,0],[-8,7.8,7.2,0],[-15,5.8,5,.5],[-21,3.4,2.4,1],[-24,1.2,.8,1.2]],$=[];for(const[P,L,M,f]of o){const t=[];for(let d=0;d<16;d++){const z=d/16*te,O=Math.sin(z);t.push(a.v(Math.cos(z)*L,f+O*M,P,O<.2?[.55,.54,.51]:[.3,.3,.31],[0,0,0,0],[.5,0,0,0]))}$.push(t)}a.loft($,!0);const h=(P,L,M,f,t,d,z,O)=>{const j=M*Math.sin(L),V=-Math.cos(L),m=Math.cos(L),n=M*Math.sin(L),F=e(),b=[],G=S=>z[0]*N(Be-5,Be+5,Math.abs(S));for(let S=0;S<=5;S++){const x=S/5,q=.5*t*(x<.75?.82+.18*x/.75:Math.sqrt(Math.max(.02,1-((x-.75)/.25)**2))),p=P.x+j*f*x,r=P.z+V*f*x,s=P.y+d-.9*x*x;b.push([a.v(p-m*q,s-.12,r-n*q,[1,1,1],[z[0],G(p-m*q),M,x],[F,-1,1,O*x*x]),a.v(p,s+.1,r,[1,1,1],[z[0],G(p),M,x],[F,0,1,O*x*x]),a.v(p+m*q,s-.12,r+n*q,[1,1,1],[z[0],G(p+m*q),M,x],[F,1,1,O*x*x])])}for(let S=0;S<5;S++)a.quad(b[S][0],b[S][1],b[S+1][1],b[S+1][0]),a.quad(b[S][1],b[S][2],b[S+1][2],b[S+1][1])};for(const P of[-1,1]){const L=new _(P*8,3,8),M=new _(P*Be,3.5,13),f=new _(P*58,3.5,8),t=new _;for(let V=0;V<13;V++){const m=V/12;t.lerpVectors(L,M,m),h(t,ae(-5,8,m)*Ne,P,ae(24,28.5,m)*e.range(.97,1.03),5.6,-.3-V*.05,[1],1)}for(let V=0;V<11;V++){const m=V/10;t.lerpVectors(M,f,m),h(t,ae(12,84,Math.pow(m,.9))*Ne,P,(30+7*Math.sin(m*2.6)-3*m)*e.range(.97,1.03),4.8-.9*m,-1-V*.05,[1],1.6)}const d=16,z=[[2.2,2.4],[3.6,.9],[2.4,-.9],[-4,-1.5],[-9.5,-1.6],[-13.5,-1.45]],O=[];for(let V=0;V<z.length;V++){const m=[];for(let n=0;n<=d;n++){const F=n/d,b=F<.7?t.lerpVectors(L,M,F/.7):t.lerpVectors(M,f,(F-.7)/.3),G=1-.55*N(.7,1,F),S=b.x+P*(V>2?1.5*N(.7,1,F)*(V-2):0),x=b.z+z[V][0]*G+(V===z.length-1?n%2*1.3:0);m.push(a.v(S,b.y+z[V][1]*(.6+.4*G),x,[1,1,1],[1,N(Be-5,Be+5,Math.abs(S)),P,V/(z.length-1)],[e(),F,2,0]))}O.push(m)}a.loft(O,!1);const j=[];for(let V=0;V<=5;V++){const m=V/5,n=[],F=ae(-7,-11.5,m),b=ae(-5,-22,m),G=V===5?.4:ae(2.4,1.5,m)+(V===4?1.1:0);for(let S=0;S<8;S++){const x=S/8*te;n.push(a.v(P*4.2+Math.cos(x)*G,F+Math.sin(x)*G,b+(V===5?1.2:0),V>=4?[.05,.05,.055]:[.4,.39,.37],[0,0,0,0],[.5,0,3,0]))}j.push(n)}a.loft(j,!0)}for(let P=0;P<12;P++){const L=P/11;h(new _(ae(-3.4,3.4,L),1.5,-17),ae(-54,54,L)*Ne,1,26-4*Math.abs(L-.5),5.6,-Math.abs(P-5.5)*.06,[0],.3)}const D=new u.Mesh(a.build(),new u.ShaderMaterial({uniforms:{...xe(),...C,uFlap:{value:0},uCamO:{value:new _},uSunO:{value:new _(0,1,0)},uUpO:{value:new _(0,1,0)},uSnowCol:{value:new u.Color(.75,.83,.95)},uFade:{value:0},uBarN:{value:e.range(5.5,7.5)}},fog:!0,side:u.DoubleSide,vertexShader:`
attribute vec4 a; attribute vec4 b; attribute vec3 color;
uniform float uFlap;
varying vec3 vL; varying vec3 vR; varying vec3 vN; varying vec3 vC; varying vec4 vA; varying vec4 vB;
${pe}
void rz(inout vec3 p, inout vec3 n, vec2 piv, float an){ float c = cos(an), s = sin(an); vec2 d = p.xy - piv;
  p.xy = piv + vec2(d.x*c - d.y*s, d.x*s + d.y*c); n.xy = vec2(n.x*c - n.y*s, n.x*s + n.y*c); }
void main(){
  vec3 p = position, n = normal; float sg = a.z;
  float a1 = (0.08 + 0.36*sin(uFlap))*a.x, a2 = (0.05 + 0.28*sin(uFlap - 1.0))*a.y;
  p.y -= cos(uFlap)*b.w*2.6*a.x;                                      // feather tips lag the stroke
  rz(p, n, vec2(sg*${Be.toFixed(1)}, 3.5), sg*a2);
  rz(p, n, vec2(sg*8., 3.), sg*a1);
  p.y -= 1.7*sin(uFlap)*(1. - a.x);                                   // the body rides against the wings
  vR = position; vL = p; vN = n; vC = color; vA = a; vB = b;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  ${we}
}`,fragmentShader:`
uniform vec3 uCamO, uSunO, uUpO, uSnowCol; uniform float uFade, uBarN;
varying vec3 vL; varying vec3 vR; varying vec3 vN; varying vec3 vC; varying vec4 vA; varying vec4 vB;
${ye}
${ce}
${Me}
void main(){
  vec3 V = normalize(uCamO - vL);
  vec3 N = normalize(vN); if (dot(N, V) < 0.) N = -N;
  float pat = vB.z, v = vA.w;
  vec3 pale = vec3(0.64, 0.62, 0.57), dark = vec3(0.17, 0.16, 0.15), alb;
  if (pat < 0.5) {            // body: long dark streaks on pale grey
    float s = vn2(vec2(vR.x*1.3 + vn2(vR.xz*0.2)*2., vR.z*0.17));
    alb = vC*mix(0.5, 1.12, smoothstep(0.35, 0.65, s));
  } else if (pat < 1.5) {     // flight feathers: bars, dark tip, shaded edges
    float bars = smoothstep(0.3, 0.7, 0.5 + 0.5*sin(v*uBarN*6.2832 + vB.x*0.3));
    alb = mix(dark, pale, bars);
    alb = mix(alb, dark*0.8, smoothstep(0.86, 1., v));
    alb *= 1. - 0.4*smoothstep(0.55, 1., abs(vB.y));
  } else if (pat < 2.5) {     // coverts: mottled rows
    float m = vn2(vR.xz*0.55 + 3.), rw = 0.5 + 0.5*sin(v*15.7 + vn2(vR.xz*0.3)*3.);
    alb = mix(pale*0.95, dark*1.3, smoothstep(0.42, 0.72, m)*0.8)*(0.8 + 0.25*rw);
  } else alb = vC;
  float under = 0.5 - 0.5*dot(N, uUpO);
  vec3 L = uSnowCol*(0.2 + 0.8*under) + uSkyCol*0.45*(1. - under) + uSunCol*max(dot(N, uSunO), 0.)*1.2;
  // by night the snow below still throws enough light up for the bars of the underwing to be read
  L = max(L, vec3(0.40, 0.45, 0.54)*(0.3 + 0.7*under));
  vec3 col = alb*L;
  float fr = 1. - max(dot(N, V), 0.); fr *= fr*fr;
  col += uSkyCol*0.25*fr;
  col = mix(col, uSnowCol*0.9, uFade);
  gl_FragColor = vec4(col, 1.);
  ${ze}
}`}));return D.frustumCulled=!1,D.name="strike-owl",D}async function Xt(C,e={}){const a=c=>C.core&&C.core.makeRng?C.core.makeRng(C.core.hashSeed("snow-roof-strike-"+c+":"+C.seed)):C.rng.fork?C.rng.fork(c):C.rng,o=C.noise,$=C.quality&&C.quality.detail||1,h=(e.palette&&e.palette.length>=7?e.palette:kt).map(c=>new u.Color(c)),[D,P,L,,,,M]=h,f=!!e.viewer,t=e.hour||"noon",d=e.weather||"clear",z=e.exitSide===1?1:-1,O={bulge:.79,burst:.83,wrench:.875,...e.keys||{}},j=e.secondsPerU??53,V=e.gravity??32,m=(O.bulge-O.burst)*j,n=(O.wrench-O.burst)*j,F=.42,b=(c,K=1)=>new u.Color(c).multiplyScalar(K);let G=M.clone(),S=b("#2B6FD6").lerp(b("#ffffff"),.22).multiplyScalar(1.25),x=M.clone().multiplyScalar(1.7),q=2.4,p=0,r=new u.Color(.75,.83,.95);t==="twilight"&&(G=b("#FFD9C6"),S=b("#D7A9A6").lerp(b("#6E78C8"),.45).multiplyScalar(.85),x=b("#FFD2BC",.9),q=1.7,r=b("#B9A9C9",.8)),t==="night"&&(G=b("#DCE6FF",.62),S=b("#0E2148").lerp(b("#3FD98A"),.18).multiplyScalar(.9),x=b("#DCE6FF",.75),q=.75,p=.35,r=b("#5E7FB5",.6)),d==="blizzard"&&(S.lerp(b("#C9D3DE"),.75),x.multiplyScalar(.35),q*=.8,r.lerp(b("#C9D3DE"),.6)),d==="thaw"&&(q*=1.35,p=Math.max(p,.6)),e.roofGlow!==void 0&&(q=e.roofGlow);const s=new _().fromArray(e.sunDir||[-.96,.225,.169]).normalize(),B=t==="night"?1.4:1,k={uCamL:{value:new _(0,3,60)},uDayCol:{value:G},uAmb:{value:P.clone().lerp(L,.45).multiplyScalar(.42*Math.min(1,q/2.2+.25))},uShadowCol:{value:D.clone().multiplyScalar(.5)},uSunL:{value:s},uSunCol:{value:x},uSkyCol:{value:S},uTurq:{value:L.clone()},uCobalt:{value:P.clone()},uDay:{value:0},uTime:{value:0},uT:{value:-10}},R=new u.Group;R.name="under-the-snow-roof-hero";const Z=()=>C.yield?.();await Z();const J=await $t(k,a("roof").range(0,40),Z);J.material.uniforms.uGlow.value=q,J.material.uniforms.uGreen.value=p,J.material.uniforms.uDomeK.value=t==="night"?1.5:1,await C.yield?.();const l=await Pt(k,o,a("shaft"),Z);await C.yield?.();const v=await _t(k,a("striker"),Z);await C.yield?.();const{blocks:y,mound:E,lands:X}=Kt(k,a("blocks"),a("near-blocks"),o,V,n,$,v.hubs);await C.yield?.();const{puffs:i,glit:g}=jt(k,a("dust"),V,n,F,$,d==="blizzard",X);await C.yield?.();const A=Tt(k,a("feathers"),n);await C.yield?.();const w=It(k,a("owl"));w.material.uniforms.uSnowCol.value=r,w.scale.setScalar(.9),await C.yield?.();const{cone:H,pool:W}=Vt(k);await C.yield?.();const ee=Gt(k,J.material.uniforms);await C.yield?.();const le=Bt(k,a("sedge"),v.hubs,v.mesh.material.uniforms.uFoot);R.add(J,ee,l,v.mesh,le,E,y,W,H,i,g,A,w);const re=[new _(0,Ge,92),new _(0,Ge,60),new _(0,Ge,30),new _(0,Ge,6.24)];for(const c of[22,44,65])re.push(new _(0,Ge+12-12*Math.cos(c*Ne),6.24-12*Math.sin(c*Ne)));const ve=re[re.length-1].clone();for(const c of[15,30,45,60])re.push(ve.clone().addScaledVector(oe,c));const Se=a("choreography"),fe=Se.int(0,1),T=Se.range(1.1,1.45),he=Se.range(-.08,.08),U=new _(z*.45,.17,.88).applyAxisAngle(new _(0,1,0),he*z).normalize(),ne=U.clone().addScaledVector(oe,-U.dot(oe)).normalize(),Le=new _(U.x,.22,U.z).normalize();let ke=.92;const Y={t:-10,bulge:0,hole:0,day:0,clench:0,legs:!1,owl:!1},ge=(c,K)=>{const Q=c-(n+1.2);return Q>0?(K&&K.copy(oe).multiplyScalar(120+85*(1-Math.exp(-Q/1.6))).addScaledVector(ne,33+5*Q+.75*Q*Q*Q),!0):!1},Ae=64.5,Ee=14.07,He=2.4,Ue=88,Ye=21,Fe={t0:-5.95,t1:-4.6,half:2,soft:.28,dark:.5},ue={t0:-4.5,t1:m+.17,half:5.4,soft:.4,dark:.5},Qe=(c,K)=>{let Q=(c-Fe.t0)/(Fe.t1-Fe.t0);return K.turn=0,K.long=He,K.side=0,K.lift=0,K.tilt=0,Q>0&&Q<1?(K.d=Ae-Ee*c-(-12+27*N(0,.3,Q)+4*N(.3,.75,Q)+9*N(.75,1,Q)),K.side=9*N(.6,1,Q),K.half=Fe.half,K.soft=Fe.soft,K.dark=Fe.dark*N(0,.12,Q)*(1-N(.7,1,Q)),K.tilt=.8*Math.sin(c*2.6),K.lift=.3*(.5-.5*Math.cos(c*5.2)),!0):(Q=(c-ue.t0)/(ue.t1-ue.t0),Q>0&&Q<1?(K.d=ae(ae(Ae-Ee*ue.t0+14,Ue,N(ue.t0,ue.t0+.6,c))-3*N(ue.t0+.6,ue.t0+1.85,c),Oe+7,N(ue.t0+1.85,ue.t1,c)),K.half=ue.half,K.soft=ae(ue.soft,.12,N(.1,.6,Q)),K.dark=ue.dark*N(0,.2,Q)*(1-N(.84,1,Q)),K.lift=.5-.5*Math.cos(c*10.5),K.tilt=.3*Math.sin(c*2.3),!0):c>-.5&&c<n+.9?(K.d=Ye,K.long=2,K.half=ae(4.4,5.6,N(-.5,.5,c)),K.soft=.2,K.dark=.5*N(-.5,.1,c)*(1-N(n-.1,n+.9,c)),K.lift=.35*(.5+.5*Math.sin(c*6.5)),K.tilt=.3*z*N(n-.6,n+.4,c),!0):(K.dark=0,!1))},rt=w.position,Pe=new _,Ze=new _,it=new _,Ie=new u.Quaternion,gt=new u.Matrix4,bt=new u.Vector2,st=new _(0,1,0),ct=(c,K)=>{k.uT.value=c,k.uTime.value=K,Y.t=c;const Q=c<0,De=J.material.uniforms;Y.bulge=Q?ae(.8*N(m,m*.45,c),1,N(m*.15,0,c)):1-.8*N(0,.7,c),De.uBulge.value=Y.bulge,De.uCrack.value=Q?.72*N(m*.85,0,c):.72+.28*N(0,.5,c),De.uCrGrow.value=N(m*.9,m*.4,c),De.uDim.value=.07*N(m,m*.45,c)*(1-N(0,.5,c)),Y.hole=N(0,.26,c),De.uHole.value=Y.hole,t==="night"&&(De.uGreen.value=p*(.6+.4*Math.sin(K*.45))),Y.day=N(0,.3,c)*(1-.3*N(.3,.9,c))+.25*N(n+.2,n+1.6,c),k.uDay.value=Y.day*B;let Ve=0;if(c<F){const ie=Re(c/F,0,1);Ve=62*(1-ie)*(1+.6*(1-ie))/1.6}else if(c>n){const ie=c-n;Ve=.5*95*ie*ie}Y.legs=c>=0&&Ve<125;const Xe=v.mesh.material.uniforms,qe=c-F;let et=qe>0?3*Math.exp(-3.5*qe)*Math.sin(7*qe)+.9*(1-Math.exp(-2*qe)):0;et+=1.3*N(n-.45,n-.02,c),et*=1-N(n,n+.3,c),Xe.uLegS.value=Ve,Xe.uDrop.value=et;const ut=ae(-.4,.36,N(F-.03,F+.3,c)),tt=Ct(c,T,T+.62),Lt=1.5*N(F,F+.3,c);for(let ie=0;ie<2;ie++)Xe.uFoot.value[ie].set(ut-(ie===fe?.8*tt:.1*tt),Lt+(ie===fe?1.1*tt:0));Y.clench=ut,Xe.uShake.value=.12+(qe>0?Math.exp(-qe*3):1)+(c>n-.1?Math.exp(-Math.max(c-n,0)*1.5):0),E.material.uniforms.uGrow.value=.5*N(.1,1.5,c)+.22*N(1.5,n,c)+.28*N(n,n+2.5,c),i.material.uniforms.uHole.value=Y.hole,g.material.uniforms.uSift.value=N(m-5,m+1,c);const ht=c-(n+1.2);if(Y.owl=ge(c,rt),Y.owl){const ie=.72+.28*N(0,2.2,ht);Pe.copy(oe).lerp(Le,ie).normalize(),Ze.crossVectors(st,Pe).normalize(),it.crossVectors(Pe,Ze),w.quaternion.setFromRotationMatrix(gt.makeBasis(Ze,it,Pe)),w.quaternion.multiply(Ie.setFromAxisAngle(Pe.set(0,0,1),z*-.15*ie+.06*Math.sin(K*1.3)));const _e=w.material.uniforms;_e.uFlap.value=K*te*1.6,Ie.copy(w.quaternion).invert(),_e.uSunO.value.copy(s).applyQuaternion(Ie),_e.uUpO.value.copy(st).applyQuaternion(Ie),_e.uFade.value=d==="blizzard"?N(1.5,4,ht):0}J.visible=!0,ee.visible=Y.hole>.02,l.visible=!Q,v.mesh.visible=Y.legs,y.visible=!Q,E.visible=c>.1;{const ie=k.uCamL.value,_e=ie.dot(oe);Pe.copy(ie).addScaledVector(oe,-_e),H.material.uniforms.uConeK.value=N(11.5,20,Pe.length())}H.visible=W.visible=Y.day>.002,i.visible=!Q,A.visible=c>n,w.visible=Y.owl};let Je=null;const Mt=(c,K,Q)=>{let De=Je===null?((K-8.3)%15+15)%15-2.6:(Je-O.burst)*j;if(R.updateWorldMatrix(!0,!1),Q){Q.getWorldPosition(k.uCamL.value),R.worldToLocal(k.uCamL.value);const Ve=C.renderer?C.renderer.getDrawingBufferSize(bt).y*.5*Q.projectionMatrix.elements[5]:400;i.material.uniforms.uPx.value=Ve,g.material.uniforms.uPx.value=Ve}ct(De,K),Y.owl&&(w.updateWorldMatrix(!1,!1),w.material.uniforms.uCamO.value.copy(k.uCamL.value).applyMatrix4(R.matrixWorld),w.worldToLocal(w.material.uniforms.uCamO.value))};ct(-10,0);const St={strikePoint:new _(0,0,0),shaftAxis:{origin:new _(0,0,0),direction:oe.clone(),radius:ft,footY:I,surfaceY:de},roofHole:{center:new _(0,I,me),radiusX:14.5,radiusZ:16,discRadius:Oe,y:I},flyThrough:re,portalSeat:{position:re[re.length-1].clone(),facing:oe.clone().multiplyScalar(-1),up:new _(0,be,se),radius:7},lookAt:new _(0,6.2,-1),closestPass:new _(0,Ge,27),owl:rt,daylight:{origin:new _(0,0,0),axis:oe.clone(),radius:10},feet:v.hubs.map(c=>c.clone()),sunDir:s.clone(),gallery:{width:20,height:I},timeline:{...O,secondsPerU:j}};return{object:R,radius:f?20:40,height:f?7:64,center:f?new _(0,4,-2):new _(0,12,-3),anchors:St,state:Y,update:Mt,setProgress(c){Je=c},owlAt(c,K){return ge((c-O.burst)*j,K)},owlShadowAt(c,K){return Qe((c-O.burst)*j,K)},setClimb(c){ke=Re(c,.5,.99)},clearSedge(c){return Rt(le,c,Z)},dispose(){},ground:!0,groundY:0}}export{zt as CRACK_GLSL,At as DOME_GLSL,Ft as OWL_GLSL,I as ROOF_Y,Xt as buildHero};
