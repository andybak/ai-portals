import*as a from"three";import{makePath as x0,clamp as Ot,lerp as M,smoothstep as w}from"../kit/core.js";import{mergeVertices as w0}from"three/addons/utils/BufferGeometryUtils.js";import{buildHero as g0}from"../parts/brimstone-parasol.js";const O=Math.PI*2,fe=2500,Pt=2400,z=(P=0,b=0,F=0)=>new a.Vector3(P,b,F),m=P=>new a.Color(P),y0=[{name:"custard",pal:["#F2D24B","#E9EFE6","#D9502B","#9DB89A","#6FB4FF","#0A0C1A","#1A1410"],lemon:"#F4E27A",ochre:"#D9A03A",seam:"#FF8A2A",hull:"#9DB89A",crust:"#E8B93A"},{name:"lime",pal:["#E4EDB0","#F1F4EC","#3FA98C","#A9B8C8","#7FC0FF","#080B18","#12161A"],lemon:"#F0F3D2",ochre:"#B9CC7A",seam:"#B06CFF",hull:"#D8C6A0",crust:"#D5E08A"},{name:"burnt",pal:["#E08A3C","#F3DCD8","#B8402E","#B9A58C","#7FB0FF","#0B0A16","#1A1210"],lemon:"#EDB46A",ochre:"#C06A2C",seam:"#FFB040",hull:"#A9C2B8",crust:"#E9A04A"}],ue=`
uniform vec3 uSun, uKey, uBounce, uPlume, uPlanetC, uPlanetDir, uSnowSh;
uniform float uTime, uSunK, uLineY, uRibDrift, uPlumeK;
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fb2(vec2 p){ return vn2(p) * 0.5 + vn2(p * 2.03 + 7.1) * 0.3 + vn2(p * 4.1 + 3.7) * 0.2; }
// sun reaching the ground under the dome: 70 percent, with the ribs' shadows as radial stripes that crawl west
float domeSun(vec3 P){
  float r = length(P.xz), inside = 1. - smoothstep(2180., 2520., r);
  float a01 = atan(P.z, P.x + 1e-4) / 6.2831853;
  float x = a01 * 96. + uRibDrift, f = abs(fract(x) - 0.5);
  float hair = abs(fract(x * 5.) - 0.5);
  float fx = fwidth(a01) * 96., kx = 1. - smoothstep(0.35, 0.9, fx), kh = 1. - smoothstep(0.35, 0.9, fx * 5.);
  float stripe = 1. - 0.44 * mix(0.3, 1. - smoothstep(0.05 - fx * 0.5, 0.12 + fx * 0.5, f), kx) - 0.4 * mix(0.3, 1. - smoothstep(0.07, 0.16, hair), kh) * smoothstep(200., 600., r);
  stripe = mix(1., stripe, smoothstep(140., 420., r));
  return mix(1., 0.74 * stripe, inside) * smoothstep(uLineY - 1.5, uLineY + 1.5, P.y);
}
// frost: 0 bare sulphur .. 1 snow. key: sun term already shaped by the caller (0..~1.3)
vec3 moonLit(vec3 alb, vec3 N, vec3 P, float frost, float key){
  vec3 toV = vec3(-P.x, 260., -P.z); toV /= max(length(toV), 1e-3);
  vec3 fill = mix(uBounce * 0.35, uSnowSh * 0.62, frost * 0.85) * (0.78 - 0.22 * N.y)
            + uPlume * uPlumeK * (0.35 + 0.65 * max(dot(N, toV), 0.))
            + uPlanetC * 0.12 * max(dot(N, uPlanetDir), 0.);
  return alb * (uKey * key + fill);
}
`;var C0={id:"brimstone-parasol",name:"The Brimstone Parasol",category:"alien",weirdness:.5,media:["space"],async build(P){const b=P.rng,F=P.noise,ct=P.vary||{},tt=P.quality?.detail??1,St=Ot(ct.density??1,.7,1.3),k=new a.Scene;k.background=new a.Color("#000000");const ft=b.fork?b.fork("looks"):b,At=ft();let xt=At<.12?40:At<.62?14:At<.84?4:40;ct.hour==="dawn"||ct.hour==="golden"||ct.hour==="night"?xt=4:ct.hour==="day"&&(xt=At<.6?14:40);const he=ft(),V=he<.5?"gibbous":he<.78?"crescent":"stars",G=y0[(()=>{const t=ft();return t<.5?0:t<.76?1:2})()],me=ft(),H=me<.22?"halted":me<.34?"stakes":"convoy",D=H==="stakes"?0:H==="halted"?4:Ot(Math.round(ft.range(3,9.4)*(.8+.2*St)),3,9),Ne=ft.chance(.4),De=!!ct.rare,C=G.pal,Wt=xt*Math.PI/180,kt=z(-Math.cos(Wt),Math.sin(Wt),0),wt=z(Math.sin(32*Math.PI/180),.115,Math.cos(32*Math.PI/180)).normalize(),I=xt<8,pe=xt>30,W={uSun:{value:kt},uKey:{value:m("#FFF6E4").multiplyScalar(I?1.05:1.12)},uBounce:{value:m(C[0]).multiplyScalar(I?.3:1)},uPlume:{value:m(I?"#C9D6FF":"#CFE4FF")},uPlumeK:{value:I?.4:V==="crescent"?.3:.2},uPlanetC:{value:m(C[3]).multiplyScalar(V==="stars"?0:V==="crescent"?.5:1)},uPlanetDir:{value:wt},uSnowSh:{value:m("#8FA6C8")},uTime:{value:0},uRibDrift:{value:0},uSunK:{value:I?.5:pe?.92:.66},uLineY:{value:I?5.5:-500}},Y=z(-307,455,-213),Ut=z(Math.sin(13*Math.PI/180)*Math.cos(19*Math.PI/180),Math.sin(19*Math.PI/180),-Math.cos(13*Math.PI/180)*Math.cos(19*Math.PI/180)),E=t=>380-62*Math.exp(-((t+1230)/260)*((t+1230)/260)),K=x0([[380,8,-3315],[380,9.5,-3130],[380,30,-2950],[380,12,-2770],[380,10,-2500],[380,10,-2200],[380,13,-1950],[E(-1740),16,-1740],[E(-1500),13,-1500],[E(-1330),15,-1330],[E(-1200),52,-1200],[E(-1090),132,-1090],[E(-990),194,-990],[E(-900),196,-900],[E(-760),150,-760],[380,95,-600],[380,64,-470],[380,50,-340],[380,47,-220],[380,47,-120],[380,47,0],[377,47,53],[306,50,124],[195,56,164],[103,62,165],[39,67,155],[0,70,150],[-58,98,159],[-136,176,165],[-222,257,146],[-293,320,97],[-342,365,30],Y.clone().addScaledVector(Ut,-200),Y.clone().addScaledVector(Ut,-100),Y]),nt=4540.4,Ct=1099.7+15,Xt=K.length-(nt-3035.9),Bt=1099.7/nt,Qt=3035.9/nt,de=t=>{const e=t*K.length;return e<=Ct?Math.max(e-15,0)/nt:e>=Xt?1-(K.length-e)/nt:M(Bt,Qt,(e-Ct)/(Xt-Ct))},Ft=t=>(t<=Bt?t*nt+15:t>=Qt?K.length-(1-t)*nt:M(Ct,Xt,(t-Bt)/(Qt-Bt)))/K.length,ut=(t,e)=>K.pointAt(Ft(t),e),ve=(t,e)=>K.tangentAt(Ft(t),e),Ie=52,et=z(280,0,-1590),xe=z(E(-1215)+42,0,-1215),at={x:300,z:-3290,rx:520,rz:450,y:0},we=1.5,Z=b.range(0,500),Gt=t=>{let e=Math.abs(Math.atan2(Math.sin(t),Math.cos(t)));const i=1-w(.3,.72,e);return 380*M(1,1/Math.cos(Math.min(e,.8)),i)+14*F.n2(Math.cos(t)*1.7+Z,Math.sin(t)*1.7)*(1-i)},qt=(t,e)=>{const i=(t-at.x)/at.rx,r=(e-at.z)/at.rz;return Math.hypot(i,r)+.1*F.n2(t*.004+Z,e*.004)+.04*F.n2(t*.017,e*.017+Z)},ge=t=>E(t)-31+9*Math.sin(t/61)+4.5*Math.sin(t/23.5+1.3),Ee=.4,L=(t,e)=>{const i=Math.hypot(t,e);let r=5.5+5.5*F.fbm2(t/520+Z,e/520,3)+1.6*F.n2(t/85,e/85+Z);if(r*=.45+.55*w(40,420,Math.abs(i-2330)),r=M(-5,r,w(.93,1.1,qt(t,e))),e<-150||i>560){const l=E(e),o=Math.abs(t-l),n=e<-2200?9:K.nearestXZ(l,e).y;o<130&&e>-3400&&(r=M(Math.min(r,n-8-.4*F.n2(t*.05,e*.05)),r,w(22,130,o)))}if(e>-2130&&e<-1240&&t>200&&t<470){const l=w(-2130,-2050,e)*(1-w(-1330,-1268,e)),o=Math.abs(t-ge(e)),n=1-w(20,34,Math.hypot(t-ge(-1296),e+1296));r=Math.max(r,1.6)+2.1*Math.exp(-((o-23)/5.5)*((o-23)/5.5))*l*(1-n),r=M(r,-3.5,Math.max((1-w(6.5,17,o))*l,n))}if(r=M(r,6,w(3900,5200,i)),i<640){const l=Math.atan2(e,t),o=Gt(l),n=i-o;let s=35*Math.exp(-(n*n)/(n>0?3844:1156));const c=.85*w(2,9,s)*(1-w(31,35,s));s+=2.2*F.n2(t*.03+Z,e*.03)*w(4,20,s)*(1-w(26,34,s)),r=M(r,3,w(640,470,i))+s;const u=(r-3)/5.8,f=u-Math.floor(u);r=M(r,3+(Math.floor(u)+w(.55,.95,f))*5.8,c),r=M(-4,r,w(o-100,o-72,i))}return r},b0=(t,e)=>Math.max(L(t,e),qt(t,e)<1?at.y:-99,Math.hypot(t,e)<330?we:-99),Yt=z().crossVectors(z(0,1,0),wt).normalize().negate(),Tt=z().crossVectors(Yt,wt).normalize();Tt.y<0&&Tt.negate();const gt={uSun:W.uSun,uTime:W.uTime,uPDir:{value:wt},uPR:{value:Yt},uPU:{value:Tt},uPLight:{value:V==="crescent"?z().copy(Yt).multiplyScalar(.62).addScaledVector(wt,.74).addScaledVector(Tt,.25).normalize():kt},uPGain:{value:V==="crescent"?1.7:.95},uPLimb:{value:V==="crescent"?0:.45},uPOn:{value:V==="stars"?0:1},uStars:{value:V==="stars"?1.25:.62},uDust:{value:V==="stars"?1.7:.8},uSage:{value:m(C[3])},uCream:{value:m("#E9EFE6")},uRust:{value:m("#B8683C")},uSkyC:{value:new a.Color(.0105,.0115,.0175)},uSeed:{value:b.range(0,40)},uHalo:{value:0},uBandK:{value:1}},Re=gt.uStars.value,He=new a.ShaderMaterial({uniforms:gt,depthWrite:!1,depthTest:!1,side:a.BackSide,fog:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",fragmentShader:`
uniform vec3 uSun, uPDir, uPR, uPU, uPLight, uSage, uCream, uRust, uSkyC; uniform float uTime, uPOn, uStars, uDust, uSeed, uHalo, uBandK, uPGain, uPLimb;
varying vec3 vD;
float h31(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7)) + uSeed) * 43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
vec3 starLayer(vec3 d, float n, float px, float thresh){
  vec3 p = d * n, c = floor(p);
  float h = h31(c); vec3 o = vec3(h31(c + 3.1), h31(c + 7.7), h31(c + 11.3)) * 0.6 + 0.2;
  float dist = length(p - c - o), rad = max(0.07, px * n * 1.1);
  float m = 1. - smoothstep(rad * 0.35, rad, dist);
  float e = min(1., (0.07 * 0.07) / (rad * rad)) * 0.6 + 0.4;
  float b = step(thresh, h) * (0.3 + 0.7 * h31(c + 19.)); b *= b * b;
  vec3 tint = mix(vec3(1., 0.86, 0.72), vec3(0.78, 0.88, 1.), h31(c + 23.));
  return tint * m * b * e;
}
void main(){
  vec3 d = normalize(vD);
  float px = length(fwidth(d)) * 0.7;
  vec3 c = uSkyC;
  vec3 st = starLayer(d, 150., px, 0.9) * 2.2 + starLayer(d.zxy, 260., px, 0.86) * 1.1 + starLayer(d.yzx, 90., px, 0.93) * 3.6;
  float band = exp(-d.x * d.x / 0.035) * (0.4 + 0.6 * vn2(vec2(atan(d.z, d.y + 1e-4) * 5., d.x * 9.)));
  float dustN = vn2(d.yz * 7. + d.x * 3.) * 0.6 + vn2(d.zy * 19.) * 0.4;
  float band2 = exp(-d.x * d.x / 0.09) * (0.55 + 0.45 * vn2(vec2(atan(d.z, d.y + 1e-4) * 3., d.x * 5. + 9.)));
  c += vec3(0.62, 0.7, 0.9) * (band * dustN * 0.03 + (uBandK - 1.) * band2 * (0.35 + 0.65 * dustN) * 0.012) * uDust;
  st *= 1. + 1.4 * band * uDust;
  float up = smoothstep(-0.02, 0.01, d.y);
  // the sun: a hard white coin, no sky glow (bloom makes the only halo)
  float sd = dot(d, uSun), disc = smoothstep(0.99992, 0.99996, sd);
  float g1 = max(sd, 0.); g1 *= g1; g1 *= g1; g1 *= g1; g1 *= g1; g1 *= g1; g1 *= g1; g1 *= g1; g1 *= g1;   // ^256
  float g2 = g1 * g1; g2 *= g2; g2 *= g2;                                                                        // ^2048
  float g0 = max(sd, 0.); g0 *= g0; g0 *= g0; g0 *= g0; float g64 = g0 * g0; g64 *= g64; g64 *= g64;
  vec3 sun = vec3(1., 0.96, 0.88) * (disc * 26. + g2 * 1.6 + g1 * 0.05 + uHalo * (g1 * 0.9 + g64 * 0.3 + g0 * 0.07));
  // the parent planet: 16 degrees across, banded, sheared, one pale storm; its night side hides the stars
  float pm = 0.;
  vec2 q = vec2(dot(d, uPR), dot(d, uPU)) / (max(dot(d, uPDir), 0.2) * 0.1405);
  float rr = dot(q, q), fwr = min(fwidth(rr), 0.2);
  if (uPOn > 0.5 && dot(d, uPDir) > 0.9) {
    if (rr < 1.) {
      float zz = sqrt(max(1. - rr, 0.));
      vec3 n = q.x * uPR + q.y * uPU - zz * uPDir;
      float lat = q.y * 0.97 + q.x * 0.24, lon = q.x * 0.97 - q.y * 0.24;
      float lo = lon / max(sqrt(max(1. - lat * lat, 0.)), 0.15);
      float shear = uTime * 0.012 * (0.4 + sin(lat * 9.)) + uSeed;
      float w = vn2(vec2(lo * 2.2 + shear, lat * 16.)) * 0.5 + vn2(vec2(lo * 5. - shear * 1.7, lat * 34.)) * 0.25;
      float b = sin(lat * 15. + w * 2.6 + sin(lat * 4. + uSeed) * 1.5);
      vec3 pc = mix(uSage, uCream, smoothstep(-0.5, 0.6, b));
      pc = mix(pc, uRust, (1. - smoothstep(0.03, 0.075, abs(lat + 0.17 + 0.03 * w))) * 0.8);
      pc = mix(pc, uSage * 0.6, smoothstep(0.68, 0.98, abs(lat)) * 0.6);
      vec2 so = vec2((lo - 0.25 - 0.1 * sin(uTime * 0.02)) / 0.24, (lat - 0.32) / 0.09);
      pc = mix(pc, vec3(0.97, 0.95, 0.88), (1. - smoothstep(0.5, 1., dot(so, so))) * 0.85);
      float ndl = dot(n, uPLight), lit = smoothstep(-0.06, 0.3, ndl) * (0.35 + 0.65 * max(ndl, 0.));
      float edge = 1. - smoothstep(1. - 1.5 * fwr - 0.01, 1., rr);
      c = mix(c, pc * (lit * uPGain + 0.004) * (1. - uPLimb + uPLimb * zz), edge);
      pm = edge;
    }
  }
  c += st * uStars * up * (1. - pm);
  c += sun * step(-0.01, d.y) * (1. - pm);
  gl_FragColor = vec4(c, 1.);
}`}),Lt=new a.Mesh(new a.SphereGeometry(100,24,16),He);Lt.frustumCulled=!1,Lt.renderOrder=-10,k.add(Lt),await P.yield();const U=await g0(P,{palette:C,detail:tt,sunDir:kt,snowRing:!1,surge:Ne?.9:.32,fog:0,portal:Y,portalDir:Ut});U.uniforms.uGold.value.set("#FFDFA0").multiplyScalar(1.12),k.add(U.object);const Ve=U.anchors.portalSeat;await P.yield();const $=(t,e,i={},r={})=>new a.ShaderMaterial({vertexShader:t,fragmentShader:e,uniforms:{...W,...i},fog:!1,...r}),Ke=`
attribute vec3 color; varying vec3 vW, vN, vC;
void main(){ vC = color; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,je=`
${ue}
uniform vec3 uSnow, uOchre, uGold; uniform float uTrackOn, uCal, uRelief;
varying vec3 vW, vN, vC;
// value noise with its analytic gradient (value, d/dx, d/dz): the relief is lit from exact slopes, never from screen derivatives
vec3 vnd(vec2 p){ vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f), du = 6. * f * (1. - f);
  float a = h21(i), b = h21(i + vec2(1., 0.)), c = h21(i + vec2(0., 1.)), d = h21(i + vec2(1., 1.));
  float k1 = b - a, k2 = c - a, k4 = a - b - c + d;
  return vec3(a + k1 * u.x + k2 * u.y + k4 * u.x * u.y, du * vec2(k1 + k4 * u.y, k2 + k4 * u.x)); }
// three octaves; each fades to its mean tone (0.5, flat) once it is finer than the pixel footprint fw (in units of p)
vec3 fbd(vec2 p, float fw){
  vec3 a = vnd(p), b = vnd(p * 2.03 + 7.1), c = vnd(p * 4.1 + 3.7);
  float ka = 1. - smoothstep(0.3, 0.8, fw), kb = 1. - smoothstep(0.3, 0.8, fw * 2.03), kc = 1. - smoothstep(0.3, 0.8, fw * 4.1);
  return vec3(0.5, 0., 0.) + vec3(a.x - 0.5, a.yz) * 0.5 * ka + vec3(b.x - 0.5, b.yz * 2.03) * 0.3 * kb + vec3(c.x - 0.5, c.yz * 4.1) * 0.2 * kc; }
// a pair of ruts 5.2 m apart: x = coverage, y = chevron tread (filtered to its mean tone when finer than a pixel)
vec3 rutPair(float dx, float z, float w, float fd, float fz){
  float d = abs(abs(dx) - 2.6), rut = 1. - smoothstep(0.6 - fd * 0.5, 0.6 + w + fd * 0.5, d);
  rut *= min(1., 1.5 / max(fd, 1e-3));
  float tri = abs(fract((z + d * 1.3) / 1.5) - 0.5) * 2.;
  float tread = mix(0.55, smoothstep(0.38 - fz, 0.5 + fz, tri), 1. - smoothstep(0.2, 0.55, fz));
  float wall = (1. - smoothstep(0.03, 0.2 + fd, abs(d - 0.68))) * sign(abs(dx) - 2.6) * sign(dx) * (1. - smoothstep(0.1, 0.5, fd));
  return vec3(rut, tread, wall);
}
void main(){
  vec3 P = vW, N = normalize(vN), V = cameraPosition - P; float dist = length(V); V /= max(dist, 1e-3);
  float r = length(P.xz), mid = 1. - smoothstep(500., 2600., dist);
  float fwp = length(fwidth(P.xz)), fwx = fwidth(P.x), fwz = fwidth(P.z);
  vec3 n1 = fbd(P.xz * 0.011, fwp * 0.011), n2 = fbd(P.xz * 0.09 + 13., fwp * 0.09), n3 = fbd(P.xz * 0.7 + 5., fwp * 0.7), n4 = vnd(P.xz * 4.3);
  float k4 = 1. - smoothstep(0.25, 0.7, fwp * 4.3);
  // polygonal crust plates (7 m), one 3x3 Voronoi: the two nearest centres give the edge distance and its direction
  vec2 g = P.xz / 7., gi = floor(g), gf = fract(g); float f1 = 9., f2 = 9., cid = 0.; vec2 c1 = vec2(0.), c2 = vec2(0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)), c = o + vec2(h21(gi + o), h21(gi + o + 31.7)) * 0.8 + 0.1 - gf;
    float d = dot(c, c); if (d < f1) { f2 = f1; c2 = c1; f1 = d; c1 = c; cid = h21(gi + o + 5.3); } else if (d < f2) { f2 = d; c2 = c; }
  }
  vec2 en = c2 - c1; float enl = max(length(en), 1e-3); en /= enl;
  float ed = (f2 - f1) / (2. * enl) * 7.;                                  // metres to the plate edge (exact for a Voronoi)
  float fe = max(fwp * 0.6, 1e-3), kPl = (1. - smoothstep(0.35, 1.5, fe)) * smoothstep(0.34, 0.52, fbd(P.xz * 0.019 + 17., fwp * 0.019).x + 0.25 * (1. - smoothstep(20., 90., dist)));
  float crack = (1. - smoothstep(0.035, 0.035 + fe, ed)) * min(1., 0.13 / fe + 0.25) * kPl;
  float bev = (1. - smoothstep(0.03, 0.5, ed)) * kPl;
  // pebbles: little domes with a sharp shadow thrown away from the sun
  vec2 pc = floor(P.xz * 0.8); float ph = h21(pc);
  vec2 pf = fract(P.xz * 0.8) - 0.5 - (vec2(h21(pc + 3.), h21(pc + 9.)) - 0.5) * 0.5;
  float pr = 0.09 + 0.17 * fract(ph * 31.), kP = step(0.8, ph) * smoothstep(0.42, 0.55, n3.x + 0.15 * (n2.x - 0.5)) * (1. - smoothstep(0.06, 0.22, fwp));
  float pd = length(pf), peb = (1. - smoothstep(pr * 0.8, pr, pd)) * kP;
  vec2 sdir = -uSun.xz / max(length(uSun.xz), 1e-3); float sL = min(pr * 0.75 / max(uSun.y, 0.12), 0.3);
  float sa = dot(pf, sdir), sb = abs(pf.x * sdir.y - pf.y * sdir.x), sw = pr * (1. - 0.6 * clamp(sa / max(sL, 1e-3), 0., 1.));
  float pebSh = step(0., sa) * (1. - smoothstep(sL * 0.85, sL, sa)) * (1. - smoothstep(sw * 0.8, sw, sb)) * kP * (1. - peb);
  // snow: the ring under the curtain, the lining's fall on the rampart, frost on the crest and in the lee
  float a01 = atan(P.z, P.x + 1e-4) / 6.2831853;
  float wob = (n1.x - 0.5) * 150. + (n2.x - 0.5) * 40.;
  float ring = smoothstep(2140., 2260., r + wob) * (1. - smoothstep(2450., 2570., r + wob));
  float lin = smoothstep(395., 425., r + wob * 0.3) * (1. - smoothstep(455., 500., r + wob * 0.3)) * smoothstep(0.44, 0.6, n2.x + 0.5 * N.y * N.y - 0.15 + 0.2 * (n3.x - 0.5)) * 0.88;
  // the rampart's terraces, read from the height contours the mesh was stepped on. On the terraced band frost keeps to
  // the treads (white strips, bare vermilion risers) instead of to noise, so the wall never breaks into blotches
  float tst = (P.y - 3.25) / 5.8, tfs = fract(tst), tfw = fwidth(tst);
  float kTm = smoothstep(6., 11., P.y) * (1. - smoothstep(32., 36., P.y)) * (1. - smoothstep(560., 640., r)) * uCal, kTf = 1. - smoothstep(0.35, 0.9, tfw);
  float crest = smoothstep(25., 33., P.y + (n3.x - 0.5) * 5. + 2.5 + (n2.x - 0.5) * 9.) * (1. - smoothstep(560., 640., r)) * uCal * smoothstep(0.445, 0.48 + fwp * 0.1, fbd(P.xz * 0.19 + 3., fwp * 0.19).x + 0.22 * (n3.x - 0.5) + 0.12 * (n2.x - 0.5)) * (1. - kTm);      // ragged: about a third of the crest is bare rock
  float lee = smoothstep(0.6, 0.72, 0.55 * n2.x + 0.45 * fbd(P.xz * 0.027 + 71., fwp * 0.027).x + 0.1 * (n3.x - 0.5) - 0.6 * dot(N, uSun)) * 0.85 * mid * (1. - kTm);
  // the harvesters' ruts: the working track (14 m to port) and an older pair wandering under the path
  float trZ = smoothstep(-2850., -2800., P.z) * (1. - smoothstep(-700., -560., P.z)) * uTrackOn;
  float fz = (fwz + fwx * 1.3) / 1.5;
  vec3 t1 = rutPair(P.x - 394., P.z, 0.12, fwx, fz), t2 = rutPair(P.x - (mix(371., 414., smoothstep(-2300., -2150., P.z)) + mix(24., 12., smoothstep(-2300., -2150., P.z)) * sin(P.z / 230.)), P.z, 0.16, fwx, fz);
  t2.xz *= 0.8;
  float trK = trZ * (1. - smoothstep(350., 1100., dist)), track = max(t1.x, t2.x) * trK, tread = t1.x > t2.x ? t1.y : t2.y, wall = (t1.z + t2.z) * trK;
  float frost = clamp(max(max(ring, lin), max(crest, lee)), 0., 1.) * (1. - 0.92 * track);
  float bare = 1. - frost;
  crack *= bare; bev *= bare; peb *= bare; pebSh *= bare;
  // sunlit risers, frosted treads; beyond the reach of the contours the band settles to its mean striped tone
  float kT = kTm * kTf;
  float riser = smoothstep(0.5 - tfw, 0.58 + tfw, tfs) * (1. - smoothstep(0.93 - tfw, 0.99, tfs)) * kT, treadT = (1. - smoothstep(0.42, 0.56, tfs)) * kT;
  float trF = mix(0.5, (1. - smoothstep(0.44 - tfw, 0.54 + tfw, tfs)) + smoothstep(0.95 - tfw, 1., tfs), kTf) * smoothstep(7., 15., P.y) * (0.84 + 0.16 * smoothstep(0.3, 0.6, n2.x));
  frost = max(frost, trF * kTm * (1. - 0.92 * track)); bare = 1. - frost;
  // snow relief: spokes and combs round the ring (one ridge family per rib), wind ridges everywhere else
  float fwa = fwidth(a01); vec2 tanA = vec2(-P.z, P.x) / max(r, 1.);
  float kS1 = 1. - smoothstep(0.2, 0.6, fwa * 480.), kS2 = 1. - smoothstep(0.2, 0.6, fwa * 1920.), kS3 = 1. - smoothstep(0.2, 0.6, fwa * 7680.);
  float x1 = a01 * 480. * 6.2831853, x2 = a01 * 1920. * 6.2831853 + 1.5 * sin(r * 0.021), x3 = a01 * 7680. * 6.2831853 + 2. * n3.x;
  float ridge = sin(x2) + 0.45 * sin(2. * x2 + 0.6);
  float slopeT = (sin(x1) * 0.1 * kS1 + ridge * (0.16 + 0.2 * n2.x) * kS2 + sin(x3) * 0.1 * kS3) * ring;
  vec2 wd = vec2(0.82, 0.57), we = vec2(-0.57, 0.82);
  vec3 sas = fbd(vec2(dot(P.xz, wd) * 0.07, dot(P.xz, we) * 0.6) + 3., fwp * 0.6);
  vec2 gSas = (sas.y * 0.07 * wd + sas.z * 0.6 * we) * (0.7 + 1.9 * crest) * (frost - frost * ring);      // on the crest the snow is combed into sharp ridges
  // the height gradient in world xz, each part already filtered by its own footprint
  vec2 G = n2.yz * (0.09 * 0.9 * mid) + n3.yz * (0.7 * 0.1 * (0.35 + 0.65 * bare)) + n4.yz * (4.3 * 0.02 * k4 * bare);
  G += -en * bev * 0.42 + (vec2(cid, fract(cid * 7.3)) - 0.5) * 0.1 * kPl * bare;
  G += -pf / max(pd, 1e-3) * smoothstep(pr * 0.15, pr, pd) * peb * 1.1;
  G += tanA * slopeT + gSas;
  G *= 1. - 0.85 * track;
  G.x += wall * 0.5;
  vec2 dn = N.xz / max(length(N.xz), 1e-3);
  G += -dn * riser * 0.55 + N.xz * treadT * 0.6 - en * crack * 0.3;
  float gl = length(G); G *= min(1., 0.75 / max(gl, 1e-4));
  vec3 Nb = normalize(vec3(N.x - G.x, N.y, N.z - G.y));
  // colour
  vec3 alb = vC * (0.76 + 0.28 * n1.x + 0.14 * (n2.x - 0.5) * mid + 0.1 * (n3.x - 0.5));
  alb = mix(alb, uOchre * (0.6 + 0.3 * n3.x), smoothstep(0.56, 0.74, fbd(P.xz * 0.023 + 40., fwp * 0.023).x) * 0.55);
  // the open plain beyond the snow ring, seen from the climb: broad ochre and sage-grey provinces, so it reads as land
  float farK = smoothstep(900., 2600., dist) * smoothstep(2450., 2750., r) * bare;
  float mA = fb2(P.xz * 0.0012 + 9.), mB = fb2(P.zx * 0.0027 + 31.);
  alb = mix(alb, mix(uOchre * 0.9, alb * vec3(0.66, 0.76, 0.7), smoothstep(0.42, 0.58, mB)), smoothstep(0.38, 0.66, mA) * 0.38 * farK);
  alb *= 1. - (0.2 + 0.22 * smoothstep(0.5, 0.75, fb2(P.xz * 0.0045 + 77.))) * farK;                 // a darker custard than the ground under the bell
  // razor shadows of far boulders and scarps, many times longer than what casts them, and a few black lakes flecked with gold
  vec2 sc = vec2(P.x / 330., P.z / 46.), sci = floor(sc), scf = fract(sc); float sh1 = h21(sci + 7.), sLen = 0.3 + 0.6 * h21(sci + 3.), sx0 = h21(sci + 11.) * (1. - sLen);
  float fsz = fwidth(sc.y), shd = step(0.7, sh1) * step(sx0, scf.x) * (1. - smoothstep(sx0 + sLen * 0.7, sx0 + sLen, scf.x)) * (1. - smoothstep(0.1, 0.16 + fsz, abs(scf.y - 0.5))) * min(1., 0.5 / max(fsz, 1e-3));
  alb *= 1. - 0.62 * shd * farK;
  float lk = smoothstep(0.69, 0.71, fb2(P.xz * 0.0017 + 51.)) * farK * smoothstep(2900., 3300., r);
  alb = mix(alb, vec3(0.02, 0.018, 0.02) + uGold * 0.5 * mix(0.2, step(0.8, h21(floor(P.xz / 34.))), 1. - smoothstep(10., 30., fwp)), lk);
  alb = mix(alb, uOchre * 0.5, (1. - smoothstep(0.3, 2.6, P.y)) * 0.7);                 // damp dark crust round the lakes
  alb *= (1. - 0.55 * crack) * (0.92 + 0.16 * cid * kPl * bare) * (1. + 0.22 * peb * (fract(ph * 13.) - 0.3));
  alb = mix(alb, alb * vec3(0.78, 0.6, 0.52), riser * (0.7 + 0.3 * step(0.5, fract(P.y * 1.7 + n3.x))));
  alb = mix(alb, vC * vec3(0.5, 0.43, 0.34) * mix(0.42, 0.8, tread), track * 0.94);
  float sn = 0.5 + 0.5 * ridge * kS2 * ring;
  vec3 snow = uSnow * (0.75 + 0.1 * (n2.x - 0.5) + 0.08 * (n3.x - 0.5) + 0.04 * (sn - 0.5));
  alb = min(mix(alb, snow, frost), vec3(0.78));
  float sy = max(uSun.y, 0.07), ndl = dot(Nb, uSun);
  float key = uSunK * clamp(mix(1., ndl / sy, uRelief * (1. - 0.3 * frost * (1. - crest))), 0., mix(1.9, 1.5, frost * (1. - 0.6 * crest))) * domeSun(P) * (1. - 0.85 * pebSh);
  vec3 c = moonLit(alb, Nb, P, frost, key);
  // fallout: under the bell the plume's grain never stops arriving. Soft pools of its light drift outward over the plain
  // (brighter where a thick fall is overhead) and single grains flash gold where they land
  float kIn = (1. - smoothstep(1950., 2200., r)) * smoothstep(430., 700., r);
  vec2 rdir = P.xz / max(r, 1.);
  float pool = vn2(P.xz * 0.0085 - rdir * (uTime * 0.11)) * vn2(P.xz * 0.0031 + 17. - rdir * (uTime * 0.05));
  c *= 1. + (1.2 * smoothstep(0.18, 0.7, pool) - 0.12) * kIn * step(0.01, key);
  vec2 fcell = floor(P.xz * 0.9); float fh = h21(fcell + 61.);
  vec2 fq = fract(P.xz * 0.9) - 0.5 - (vec2(h21(fcell + 12.), h21(fcell + 28.)) - 0.5) * 0.7;
  float fl = fract(uTime * (0.18 + 0.2 * fh) + fh * 31.), flash = smoothstep(0., 0.08, fl) * (1. - smoothstep(0.08, 0.5, fl));
  c += uGold * vec3(1., 0.86, 0.55) * 1.8 * step(0.955, fh) * flash * kIn * (1. - smoothstep(30., 220., dist)) * (1. - smoothstep(0.0006, 0.0035 + fwp * fwp * 2., dot(fq, fq)));
  // snow glints
  float near = 1. - smoothstep(60., 420., dist);
  vec2 cell = floor(P.xz * 1.7); float hh = h21(cell);
  vec2 gq = fract(P.xz * 1.7) - 0.5 - (vec2(h21(cell + 2.), h21(cell + 8.)) - 0.5) * 0.6;
  c += uGold * 3.2 * step(0.92, hh) * smoothstep(0.5, 1., sin(uTime * (0.7 + hh * 1.9) + hh * 50.)) * frost * near * step(0.01, key) * (1. - smoothstep(0.002, 0.012 + fwp * fwp * 2., dot(gq, gq)));
  gl_FragColor = vec4(c, 1.);
}`,ye=$(Ke,je,{uSnow:{value:m(C[1])},uOchre:{value:m(G.ochre)},uGold:{value:m("#FFF0C8")},uTrackOn:{value:H==="stakes"?.5:1},uCal:{value:1},uRelief:{value:I?.3:.86}});await P.yield();const ht=t=>ut(t,z()),j=[];{const t=ht(.585);j.push({x:xe.x,z:xe.z,puff:De?2:1,u:.43},{x:et.x,z:et.z,puff:3,u:.34},{x:t.x-62,z:t.z,puff:1,u:.585}),j.push({x:E(-1290)-70,z:-1290,puff:0},{x:520,z:-1840,puff:1,u:.3},{x:322,z:-700,puff:3,u:.55,gain:1.5,R:60,H:82});let e=0;for(;j.length<14&&e++<200;){const i=b.range(0,O),r=b.range(620,2e3),l=Math.cos(i)*r,o=Math.sin(i)*r;Math.abs(l-E(o))<140||j.some(n=>Math.hypot(n.x-l,n.z-o)<260)||j.push({x:l,z:o,puff:j.length<9?1:0})}for(const i of j)i.y=L(i.x,i.z)}const _e=m(G.lemon),Oe=m(C[0]),We=m(G.ochre),Ue=m(C[3]).lerp(m("#8a8a78"),.35),be=m(C[2]),T=new a.Color,Me=(t,e,i,r)=>{const l=Math.hypot(t,e)+260*F.n2(t/900+Z,e/900)+70*F.n2(t/140,e/140+Z);r.copy(_e).lerp(Oe,1-w(2500,3100,l)),r.lerp(We,(1-w(1250,1650,l))*.75),r.lerp(Ue,(1-w(760,1e3,l))*.8),r.lerp(be,(1-w(520,720,l))*(.62+.3*w(-.2,.5,F.n2(t/55+Z,e/55))));let o=0;for(const n of j){const s=Math.hypot(n.x-t,n.z-e);s<190&&(o=Math.max(o,1-w(30,190,s+40*F.n2(t/60,e/60))))}return r.lerp(be,o*.8),r.multiplyScalar(.72/.82)},ze=(t,e,i,r,l)=>{const o=[];for(let f=t;f<=e+.001;f+=i)o.push(f);let n=i*1.3,s=t;const c=[];for(;s>-l;)s-=n,c.push(s),n*=r;n=i*1.3,s=e;const u=[];for(;s<l;)s+=n,u.push(s),n*=r;return c.reverse().concat(o,u)};{const t=ze(302,458,6,1.24,9200),e=ze(-2890,540,12.5,1.26,9200),i=t.length,r=e.length,l=new Float32Array(i*r*3),o=new Float32Array(i*r*3),n=new Uint32Array((i-1)*(r-1)*6);let s=0;for(let f=0;f<r;f++){for(let p=0;p<i;p++){const h=t[p],x=e[f],d=Math.hypot(h,x);let g=L(h,x);d<512&&(g-=12),l[s*3]=h,l[s*3+1]=g,l[s*3+2]=x,Me(h,x,g,T),o[s*3]=T.r,o[s*3+1]=T.g,o[s*3+2]=T.b,s++}f%12===11&&await P.yield()}s=0;for(let f=0;f<r-1;f++)for(let p=0;p<i-1;p++){const h=f*i+p,x=h+1,d=h+i,g=d+1;n[s++]=h,n[s++]=d,n[s++]=x,n[s++]=x,n[s++]=d,n[s++]=g}const c=new a.BufferGeometry;c.setAttribute("position",new a.BufferAttribute(l,3)),c.setAttribute("color",new a.BufferAttribute(o,3)),c.setIndex(new a.BufferAttribute(n,1)),c.computeVertexNormals();const u=new a.Mesh(c,ye);u.frustumCulled=!1,k.add(u),await P.yield()}{const e=[];for(let s=0;s<=44;s++)e.push(-112+150*Math.pow(s/44,.9));for(let s=1;s<=12;s++)e.push(38+s*9);const i=[],r=[],l=[];for(let s=0;s<e.length;s++){s%2===1&&await P.yield();for(let c=0;c<=288;c++){const u=c/288*O,f=Gt(u),p=s===e.length-1;let h=f+e[s];e[s]>60&&(h=M(h,380+e[s],w(60,146,e[s])));const x=Math.cos(u)*h,d=Math.sin(u)*h,g=L(x,d)+(p?-4:.25);i.push(x,g,d),Me(x,d,g,T),r.push(T.r,T.g,T.b)}}for(let s=0;s<e.length-1;s++)for(let c=0;c<288;c++){const u=s*289+c,f=u+1,p=u+288+1,h=p+1;l.push(u,f,p,f,h,p)}const o=new a.BufferGeometry;o.setAttribute("position",new a.Float32BufferAttribute(i,3)),o.setAttribute("color",new a.Float32BufferAttribute(r,3)),o.setIndex(l),o.computeVertexNormals();const n=new a.Mesh(o,ye);n.frustumCulled=!1,k.add(n),await P.yield()}const Zt=`
${ue}
uniform vec3 uCrust, uLemon, uSeam, uGoldT, uBlueT, uSplit; uniform float uS, uPlateK;
varying vec3 vW;
// the parasol seen in the melt: one quadratic against the paraboloid of fall, ribs from the azimuth of the hit
vec3 bell(vec3 P, vec3 R){
  float q = ${Pt}. / (${fe}. * ${fe}.);
  float A = q * (R.x * R.x + R.z * R.z), B = 2. * q * (P.x * R.x + P.z * R.z) + R.y, C = q * dot(P.xz, P.xz) - ${Pt}. + P.y;
  float disc = B * B - 4. * A * C; vec3 acc = vec3(0.);
  if (disc > 0. && A > 1e-9) {
    float sq = sqrt(max(disc, 0.));
    for (int i = 0; i < 2; i++) {
      float t = (-B + (i == 0 ? -sq : sq)) / (2. * A);
      if (t > 0.) {
        vec3 H = P + R * t; float hr = max(length(H.xz), 1.);
        vec3 n = normalize(vec3(H.x / hr * 2. * q * hr, 1., H.z / hr * 2. * q * hr));
        float limb = min(4., 1. / max(0.08, abs(dot(n, R))));
        float x = atan(H.z, H.x + 1e-4) / 6.2831853 * 96., rib = 1. - smoothstep(0.04, 0.2, abs(fract(x) - 0.5));
        vec3 tint = mix(uBlueT * 0.33, uGoldT, smoothstep(-0.2, 0.5, dot(vec3(H.x, 0., H.z) / hr, uSun)));
        acc += tint * 0.07 * limb * (0.55 + 1.3 * rib) * (i == 0 ? 1. : 0.5) * smoothstep(0., 0.06, 1. - H.y / ${Pt}.);
      }
    }
  }
  return acc;
}
void main(){
  vec3 P = vW, V = cameraPosition - P; float dist = length(V); V /= max(dist, 1e-3);
  float t = uTime, near = 1. - smoothstep(80., 500., dist);
  vec2 g = (P.xz + vec2(0.25, 0.55) * t) / uS + 0.35 * vec2(vn2(P.xz * 0.004 + t * 0.004), vn2(P.zx * 0.004 - t * 0.004)) * 3.;
  vec2 gi = floor(g), gf = fract(g); float f1 = 9., f2 = 9., h1 = 0., h2 = 0.; vec2 c1 = vec2(0.), c2 = vec2(0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)); float hh = h21(gi + o);
    vec2 c = o + 0.5 + 0.36 * sin(t * (0.03 + 0.05 * hh) + 6.2831 * vec2(hh, h21(gi + o + 17.3))) - gf;
    float d = dot(c, c);
    if (d < f1) { f2 = f1; h2 = h1; c2 = c1; f1 = d; h1 = hh; c1 = c; } else if (d < f2) { f2 = d; h2 = hh; c2 = c; }
  }
  float edge = (sqrt(f2) - sqrt(f1)) * 0.5 * uS;                       // metres to the plate boundary (approx)
  vec2 en = c2 - c1; en /= max(length(en), 1e-3);                       // across the seam, toward the neighbour
  float plate = step(1. - uPlateK, fract(h1 * 7.13)), plate2 = step(1. - uPlateK, fract(h2 * 7.13));
  // the seam's life: open, orange, dull red, black, lemon skin, gold. It is a smooth field over the lake (not a hash of the
  // two plates), so width and glow run unbroken through every junction and a wide seam never stops dead at a straight cut
  float age = fract(fb2(P.xz * (0.26 / uS) + 7.) * 3.4 + t * 0.016);
  float wv = 0.3 + 1.7 * smoothstep(0., 0.05, age) * (1. - smoothstep(0.05, 0.6, age)) + 0.5 * vn2(P.xz * 0.11 + 3.);
  // the plate that splits under us at the start (uSplit: x, z, opening)
  float sx = abs(P.x - uSplit.x - 2.6 * sin(P.z * 0.11) - 0.9 * sin(P.z * 0.47));
  float sw = uSplit.z * 2.1 * smoothstep(-14., 6., P.z - uSplit.y) * (1. - smoothstep(60., 104., P.z - uSplit.y));
  float split = 1. - smoothstep(sw * 0.55, sw + 0.02, sx);
  float seam = max((1. - smoothstep(wv * 0.5, wv, edge)) * max(plate, plate2), split * step(0.02, sw));
  float isPlate = plate * (1. - seam);
  float hot = max(smoothstep(0., 0.04, age) * (1. - smoothstep(0.1, 0.42, age)) * (1. - smoothstep(wv * 0.2, wv * 0.8, edge)) * max(plate, plate2), split * (1. - smoothstep(sw * 0.2, sw * 0.9 + 1e-3, sx)));
  // crust: gold with lemon skins, mottled, raised rims lit from the sun side
  float m1 = fb2(P.xz * 0.21 + h1 * 40.), m2 = fb2(P.xz * 1.9), rim = 1. - smoothstep(wv, wv + 0.9, edge);
  vec3 alb = mix(uCrust, uLemon, smoothstep(0.45, 0.75, m1 + 0.3 * fract(h1 * 3.3) - 0.2)) * (0.66 + 0.3 * m1 + 0.14 * (m2 - 0.5) * near);
  alb *= 0.85 + 0.3 * fract(h1 * 9.7);
  alb = mix(alb, uLemon * 0.8, rim * 0.35);
  vec3 N = normalize(vec3((fract(h1 * 5.1) - 0.5) * 0.1 + (m1 - 0.5) * 0.12 - en.x * rim * 0.55, 1., (fract(h1 * 8.3) - 0.5) * 0.1 + (m2 - 0.5) * 0.1 * near - en.y * rim * 0.55));
  float sy = max(uSun.y, 0.07);
  float key = uSunK * clamp(mix(1., dot(N, uSun) / sy, 0.8), 0., 2.) * domeSun(P + vec3(0., 12., 0.));
  vec3 cPlate = moonLit(alb, N, P, 0., key);
  // melt: black glass with the bell, the jet and the sun in it
  vec3 Nm = normalize(vec3((vn2(P.xz * 0.13 + t * 0.03) - 0.5) * 0.012, 1., (vn2(P.zx * 0.13 - t * 0.025) - 0.5) * 0.012));
  vec3 R = reflect(-V, Nm); R.y = abs(R.y);
  float fr = 0.05 + 0.95 * pow(1. - max(V.y, 0.), 5.);
  vec3 refl = bell(P, R);
  vec2 toO = -P.xz / max(length(P.xz), 1.), rh = R.xz / max(length(R.xz), 1e-3);
  float jx = toO.x * rh.y - toO.y * rh.x, jel = R.y / max(length(R.xz), 1e-3) * length(P.xz);
  refl += vec3(1.5, 1.6, 1.8) * exp(-jx * jx * 9e4) * step(0., dot(toO, rh)) * step(jel, ${Pt}.) * 0.8;
  float sd = max(dot(R, uSun), 0.); float sg = pow(sd, 900.);
  refl += vec3(1., 0.95, 0.85) * sg * 9.;
  vec3 cMelt = vec3(0.05, 0.027, 0.014) + refl * fr * 2.3;
  // seam colour by age
  vec3 cSeam = mix(uSeam * vec3(0.3, 0.12, 0.1), vec3(0.02, 0.016, 0.014), smoothstep(0.42, 0.58, age));
  cSeam = mix(cSeam, uLemon * 0.5, smoothstep(0.6, 0.78, age));
  cSeam = mix(cSeam, uCrust * 0.6, smoothstep(0.82, 0.98, age));
  cSeam = mix(cSeam, uSeam * 0.25, split);
  float flick = 0.85 + 0.15 * vn2(P.xz * 0.8 + t * 0.6);
  cSeam += uSeam * 1.6 * hot * flick + vec3(1., 0.85, 0.5) * hot * hot * 0.5;
  vec3 c = mix(cMelt, cPlate, isPlate);
  c = mix(c, cSeam, seam);
  c += uSeam * 0.1 * rim * isPlate * (1. - smoothstep(0.0, 0.35, age));        // glow licking the plate edge beside a hot seam
  // seen from kilometres off (the climb) the plates are finer than a pixel: settle to their mean tone, never a speckle
  vec3 cFar = mix(vec3(0.02, 0.019, 0.022), moonLit(mix(uCrust, uLemon, 0.3) * 0.8, vec3(0., 1., 0.), P, 0., uSunK * domeSun(P + vec3(0., 12., 0.))), uPlateK * 0.8) + uSeam * 0.03;
  c = mix(c, cFar * (0.9 + 0.2 * vn2(P.xz * 0.006)), smoothstep(1300., 2500., dist));
  gl_FragColor = vec4(c, 1.);
}`,$t="varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",Xe=ht(.03),Pe={value:z(380,Xe.z+22,0)},Jt=(t,e,i)=>({uCrust:{value:m(G.crust)},uLemon:{value:m(G.lemon)},uSeam:{value:m(G.seam)},uGoldT:{value:m("#FFF0C8")},uBlueT:{value:m(C[4])},uSplit:i?Pe:{value:z(0,0,0)},uS:{value:t},uPlateK:{value:e}});{const t=new a.PlaneGeometry(1500,1240,30,62).rotateX(-Math.PI/2).translate(at.x,at.y,at.z);k.add(new a.Mesh(t,$($t,Zt,Jt(12,.72,!0))));const e=new a.RingGeometry(60,345,48,8).rotateX(-Math.PI/2).translate(0,we,0),i=new a.PlaneGeometry(270,900,6,20).rotateX(-Math.PI/2).translate(335,Ee,-1685);k.add(new a.Mesh(i,$($t,Zt,Jt(6.5,.62,!1)))),k.add(new a.Mesh(e,$($t,Zt,Jt(21,.7,!1))))}const yt=`
attribute vec3 color; attribute float aF; uniform float uTime, uBreath, uSpin;
varying vec3 vW, vN, vC, vL; varying float vF, vBy;
void main(){
  vC = color; vF = aF; vec3 p = position; vL = position; vBy = 0.;
  #ifdef USE_INSTANCING
    mat4 m = modelMatrix * instanceMatrix; vBy = m[3].y;
    float ph = fract(sin(dot(instanceMatrix[3].xz, vec2(12.9898, 78.233))) * 43758.5453);
    p *= 1. - uBreath * (0.5 + 0.5 * sin(uTime * (0.25 + 0.3 * ph) + ph * 6.2831));      // frost flowers sublime and feather back
  #else
    mat4 m = modelMatrix;
    float ph = 0.;
  #endif
  vec3 nn = normal;
  #ifdef WHEEL
    float ca = cos(uSpin + ph * 6.), sa = sin(uSpin + ph * 6.);
    p.yz = vec2(p.y * ca - p.z * sa, p.y * sa + p.z * ca); nn.yz = vec2(nn.y * ca - nn.z * sa, nn.y * sa + nn.z * ca);
    float sq = max(-1.62 - p.y, 0.); p.y = max(p.y, -1.62); p.x *= 1. + sq * 0.55 + 0.14 * (1. - smoothstep(-1.62, -0.7, p.y)); vBy -= 1.62;             // the balloon flattens where it bears
  #endif
  #ifdef MACHINE
    float mh = max(p.y - 9.2, 0.) / 10.; float sw = sin(uTime * 0.9 + ph * 6.2831) * 0.14 + sin(uTime * 2.3 + ph * 11.) * 0.03;
    p.z += mh * mh * 10. * sw; p.x += mh * mh * 10. * sw * 0.4;                              // the whip mast sways 8 degrees
  #endif
  vec4 w = m * vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(m) * nn + vec3(0., 1e-5, 0.));
  gl_Position = projectionMatrix * viewMatrix * w;
}`,bt=`
${ue}
uniform vec3 uSnow, uGold, uDustC; uniform float uCap, uEmis, uBaseY;
varying vec3 vW, vN, vC, vL; varying float vF, vBy;
void main(){
  vec3 P = vW, N = normalize(vN), V = normalize(cameraPosition - P + vec3(0., 1e-4, 0.));
  if (!gl_FrontFacing) N = -N;
  float r = length(P.xz), g1 = fb2(P.xz * 0.9 + P.y * 0.7), g2 = fb2(P.xz * 4.7 - P.y * 3.1);
  float inRing = smoothstep(2080., 2220., r) * (1. - smoothstep(2500., 2640., r));
  float cap = smoothstep(0.35, 0.75, N.y + 0.5 * (g1 - 0.5)) * mix(0.3, 1., inRing) + smoothstep(0.2, 0.6, N.z * 0.6 + N.x * 0.7 + 0.5 * (g1 - 0.5)) * 0.6;
  float frost = clamp(max(vF, cap * uCap), 0., 1.);
  vec3 alb = vC * (0.78 + 0.3 * (g1 - 0.5) + 0.2 * (g2 - 0.5));
  #if defined(MACHINE) || defined(WHEEL)
    float fwL = length(fwidth(vL)) + 1e-4, plain = step(vF, 0.5);
  #endif
  #ifdef WHEEL
    // balloon tyre: a dark diamond lattice of cords over a pale quilted skin (in the wheel's own frame, so it turns), hoop ribs, a dark hub
    float wr = length(vL.yz), wa = atan(vL.z, vL.y + 1e-5) / 6.2831853, tyre = smoothstep(0.86, 0.96, wr);
    float lu = wa * 16., lv = vL.x * 1.45, fl = fwL * (16. / (6.2831853 * max(wr, 0.6)) + 1.45);
    float d1 = abs(fract(lu + lv) - 0.5), d2 = abs(fract(lu - lv) - 0.5), kL = 1. - smoothstep(0.12, 0.4, fl);
    float cord = mix(0.28, max(smoothstep(0.42 - fl, 0.46, d1), smoothstep(0.42 - fl, 0.46, d2)), kL);
    float hoop = (1. - smoothstep(0.05, 0.08 + fwL * 2., abs(fract(vL.x * 2.4 + 0.5) - 0.5))) * (1. - smoothstep(0.03, 0.12, fwL));
    float quilt = mix(0.5, (1. - 2. * d1) * (1. - 2. * d2), kL);
    alb = vC * (0.82 + 0.34 * quilt) * (1. - 0.74 * max(cord, hoop * 0.8));
    vec3 hubC = vec3(0.1, 0.12, 0.12) * (0.7 + 0.9 * step(0.5, fract(wa * 6.)) * step(0.3, wr) + 0.8 * (1. - smoothstep(0.2, 0.26, wr)));
    alb = mix(hubC, alb, tyre);
    alb = mix(alb, uDustC * (0.75 + 0.3 * g1), (1. - smoothstep(0.1, 1.5, P.y - vBy + 0.5 * (g1 - 0.5))) * 0.55);
  #endif
  #ifdef MACHINE
    // pressure hull: riveted bands, panel seams, a ribbed hopper, a louvred fin; dust only round the skirts
    vec3 q = vL; float hr = length(vec2(q.x, q.y - 5.35)), ha = atan(q.x, q.y - 5.35 + 1e-5) / 6.2831853;
    float onHull = (1. - smoothstep(0.06, 0.14, abs(hr - 2.25))) * step(-2.95, q.z) * step(q.z, 1.75) * plain;
    float zb = abs(fract((q.z + 2.5) / 1.3 + 0.5) - 0.5) * 1.3, kD = 1. - smoothstep(0.05, 0.16, fwL);
    vec2 rv = vec2(abs(zb - 0.26), (fract(ha * 36.) - 0.5) * 0.393);
    float rivet = (1. - smoothstep(0.07, 0.085 + fwL, length(rv))) * onHull * kD;
    float seamL = (1. - smoothstep(0.012, 0.02 + fwL, abs(fract(ha * 6. + 0.08) - 0.5) * 2.36)) * step(0.3, zb) * onHull * kD;
    float pid = h21(vec2(floor(ha * 6. + 0.58), floor((q.z + 2.5) / 1.3 + 0.5)));
    alb = vC * (0.92 + 0.1 * (g2 - 0.5)) * (1. + 0.1 * (pid - 0.5) * onHull);
    alb *= (1. - 0.5 * seamL) * (1. + rivet * (0.9 * smoothstep(-0.02, 0.03, rv.y) - 0.55));
    float onBox = step(3.5, q.y) * step(q.y, 5.7) * step(q.z, -2.98) * step(1.9, max(abs(q.x), -q.z - 4.5)) * plain;
    float ribB = step(0.72, fract((abs(q.x) > 2.1 ? q.z : q.x) * 1.9)) * onBox;
    float louv = step(0.6, fract(q.y * 3.2)) * step(7.5, q.y) * step(q.y, 9.7) * step(abs(q.x), 0.1) * plain;
    alb *= 1. - 0.34 * mix(0.28, ribB, kD) - 0.52 * mix(0.4, louv, kD);
    alb *= 1. + 0.5 * step(0.5, fract(q.y * 3.2)) * step(fract(q.y * 3.2), 0.6) * step(7.5, q.y) * step(q.y, 9.7) * step(abs(q.x), 0.1) * plain * kD;      // a lit lip on every radiator slat
    // the hopper's rear face: a hatch with a rim and a handle, a ladder, a row of rivets under the rim; its flanks: a seam and rivets
    float rear = step(q.z, -6.4) * step(3.45, q.y) * step(q.y, 5.75) * step(abs(q.x), 2.2) * plain;
    float hd = max(abs(q.x - 0.35) - 0.8, abs(q.y - 4.5) - 0.78);
    float hatch = (1. - smoothstep(0.035, 0.05 + fwL, abs(hd))) + (1. - smoothstep(0.05, 0.07 + fwL, max(abs(q.x - 0.9) - 0.03, abs(q.y - 4.5) - 0.22)));
    float lad = max((1. - smoothstep(0.03, 0.045 + fwL, abs(abs(q.x + 1.35) - 0.3))), step(0.78, fract(q.y * 3.1)) * step(abs(q.x + 1.35), 0.3)) * step(q.y, 5.6);
    vec2 rv2 = vec2((fract(q.x * 2.6) - 0.5) / 2.6, q.y - 5.52);
    float flank = step(2.1, abs(q.x)) * step(3.45, q.y) * step(q.y, 5.75) * step(q.z, -2.98) * step(-6.44, q.z) * plain;
    vec2 rv3 = vec2((fract(q.z * 2.6) - 0.5) / 2.6, q.y - 5.52);
    float riv2 = (1. - smoothstep(0.06, 0.075 + fwL, length(rv2))) * rear + (1. - smoothstep(0.06, 0.075 + fwL, length(rv3))) * flank;
    float seam2 = (1. - smoothstep(0.02, 0.03 + fwL, abs(q.y - 4.4))) * flank;
    alb *= 1. - kD * (0.55 * clamp(hatch, 0., 1.) * rear + 0.6 * lad * rear + 0.5 * seam2);
    alb *= mix(1., 0.86, step(hd, 0.) * rear * kD) * (1. + riv2 * kD * (0.9 * smoothstep(-0.02, 0.03, rv2.y) - 0.55));
    alb = mix(alb, uDustC * (0.75 + 0.3 * g1), (1. - smoothstep(0.4, 3.2, P.y - vBy + 1.2 * (g1 - 0.5))) * 0.5 * plain);
  #endif
  alb = min(mix(alb, uSnow * (0.7 + 0.12 * g2), frost * step(vF, 0.99) + step(0.99, vF) * 0.), vec3(0.78));
  float ndl = dot(N, uSun);
  float key = mix(smoothstep(-0.02, 0.1, ndl) * max(ndl, 0.), clamp((ndl + 0.55) / 1.55, 0., 1.), frost * 0.5) * domeSun(P) * 1.05;
  #if !defined(MACHINE) && !defined(WHEEL)
    float ice = step(0.99, vF), nvI = abs(dot(N, V));
    key = mix(key, (0.62 + 0.5 * abs(ndl)) * domeSun(P), ice); alb = mix(alb, min(alb * 1.25, vec3(0.8)), ice);
  #endif
  vec3 c = moonLit(alb, N, P, frost, key);
  #if !defined(MACHINE) && !defined(WHEEL)
    c += uGold * 0.3 * ice * (1. - nvI) * (1. - nvI) * step(0.01, key);
  #endif
  #if defined(MACHINE) || defined(WHEEL)
    c += alb * uBounce * uSunK * (0.34 - 0.3 * N.y) * (1. - smoothstep(0., 12., P.y - vBy));   // sunlit ground lighting the flanks from below
  #endif
  vec3 H = normalize(uSun + V + vec3(0., 1e-3, 0.)); float sp = max(dot(N, H), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  c += uGold * sp * sp * frost * 0.5 * step(0., ndl);
  c += vC * uEmis * step(1.5, vF);
  gl_FragColor = vec4(c, 1.);
}`,Mt=(t,e=0)=>({uSnow:{value:m(C[1])},uGold:{value:m("#FFF0C8")},uCap:{value:t},uEmis:{value:0},uBreath:{value:e},uDustC:{value:m(C[0])},uBaseY:{value:1.5}}),Se=$(yt,bt,Mt(1)),v=new a.Object3D,Qe=new a.Matrix4,Ae=new a.Matrix4,te=[],Ye=m(C[0]).lerp(m(G.ochre),.5).multiplyScalar(.8),Ze=m(C[2]).lerp(m(C[6]),.35),$e=(t,e)=>{const i=new a.IcosahedronGeometry(1,t),r=i.attributes.position,l=r.count,o=new Float32Array(l*3),n=new Float32Array(l);for(let c=0;c<l;c++){let u=r.getX(c),f=r.getY(c),p=r.getZ(c);const h=1+.34*F.n3(u*1.3+e,f*1.3,p*1.3)+.16*F.n3(u*3.1,f*3.1+e,p*3.1);u*=h,p*=h,f=Math.max(f*h*.8,-.32)+.3,r.setXYZ(c,u,f,p);const x=.5+.5*F.n3(u*2+e,f*2,p*2);T.copy(Ze).lerp(Ye,x),o[c*3]=T.r,o[c*3+1]=T.g,o[c*3+2]=T.b}i.setAttribute("color",new a.BufferAttribute(o,3)),i.setAttribute("aF",new a.BufferAttribute(n,1)),i.deleteAttribute("normal"),i.deleteAttribute("uv");const s=w0(i,.001);return i.dispose(),s.computeVertexNormals(),s},ee=[],Je=Math.round(400*tt*St),t0=Math.round(380*tt*St);{const t=b.fork?b.fork("rocks"):b,e=z(),i=z(),r=async(l,o,n,s,c,u=0,f=0)=>{const p=new a.InstancedMesh($e(o,t.range(0,50)),Se,l);let h=0,x=0;for(;h<l&&x++<l*6;){x%120===0&&await P.yield();const d=f>0?t.range(u,f):c?t.range(.1,.76):t.chance(.6)?t.range(.105,.3):t.range(.3,.76);ut(d,e),ve(d,i);const g=t.range(n,s)*(t.chance(.5)?1:-1)*(d>.3&&!c&&f===0?1.8:1),S=e.x-i.z*g,A=e.z+i.x*g,q=L(S,A);if(qt(S,A)<1.04||Math.hypot(S,A)<Gt(Math.atan2(A,S))-60||Math.abs(S-394)<6||q<.3)continue;const B=c?t.range(1.5,6)*(t.chance(.2)?1.6:1):Math.min(.5+3.2*Math.pow(t(),2.2),.42*(Math.abs(g)-3.5));B<.35||K.distanceTo(S,q+B,A)<6.5+B||(v.position.set(S,q,A),v.rotation.set(t.range(-.3,.3),t.range(0,O),t.range(-.3,.3)),v.scale.set(B*t.range(.8,1.3),B*t.range(.6,1.1),B*t.range(.8,1.3)),v.updateMatrix(),p.setMatrixAt(h++,v.matrix),te.push({x:S,z:A,y:q,h:v.scale.y*1.15,w:B*1.9}),c||ee.push({x:S,z:A,y:q,sz:B}))}p.count=h,p.frustumCulled=!1,k.add(p)};await r(Je,1,6.5,34,!1),await P.yield(),await r(t0,1,34,420,!0),await P.yield(),await r(22,1,8,24,!1,.675,.745),await P.yield()}const it=[];{const t=b.fork?b.fork("chimneys"):b,e=10,i=10,r=[],l=[],o=[],n=[],s=m(C[2]).multiplyScalar(.7),c=m(G.ochre),u=m(G.lemon);for(let h=0;h<=i;h++)for(let x=0;x<=e;x++){const d=h/i,g=x/e*O;let S=.2*Math.pow(1-d,1.6)+.045*(1-d)+.012;S*=1+.35*F.n3(Math.cos(g)*1.5,Math.sin(g)*1.5,d*5)+.16*Math.sin(d*23+g*2),h===i&&(S=.004),r.push(Math.cos(g)*S+.03*Math.sin(d*7),d,Math.sin(g)*S+.03*Math.cos(d*5)),T.copy(s).lerp(c,w(.05,.5,d)).lerp(u,w(.55,.95,d)).multiplyScalar(.8+.2*Math.sin(d*31+g)),l.push(T.r,T.g,T.b),o.push(w(.6,1,d)*.8)}for(let h=0;h<i;h++)for(let x=0;x<e;x++){const d=h*(e+1)+x,g=d+1,S=d+e+1,A=S+1;n.push(d,S,g,g,S,A)}const f=new a.BufferGeometry;f.setAttribute("position",new a.Float32BufferAttribute(r,3)),f.setAttribute("color",new a.Float32BufferAttribute(l,3)),f.setAttribute("aF",new a.Float32BufferAttribute(o,1)),f.setIndex(n),f.computeVertexNormals();for(const h of j){const x=t.int(5,9);for(let d=0;d<x;d++){const g=t.range(0,O),S=d===0?0:t.range(7,30),A=h.x+Math.cos(g)*S,q=h.z+Math.sin(g)*S,B=(d===0?t.range(26,40):t.range(15,32))*(h.puff===2?.6:1),N=L(A,q)-.5;K.distanceTo(A,N+B,q)<22||it.push({x:A,y:N,z:q,h:B,w:B*t.range(.55,.9),rot:t.range(0,O),lean:t.range(-.07,.07)})}h.top=h.y+(it.length?it[it.length-1].h*.5:10)}for(const[h,x,d]of[[-1284,22,38],[-1288,-18,36],[-1262,-27,30],[-1252,24,50],[-1226,-19,46],[-1206,30,38],[-1188,-25,54],[-1172,21,44],[-1140,-31,40],[-1128,34,52],[-1345,33,30],[-1352,-30,27]]){const g=E(h)+x,S=L(g,h)-.5;it.push({x:g,y:S,z:h,h:d,w:d*t.range(.5,.7),rot:t.range(0,O),lean:t.range(-.05,.05)})}const p=new a.InstancedMesh(f,$(yt,bt,Mt(.5)),it.length);it.forEach((h,x)=>{v.position.set(h.x,h.y,h.z),v.rotation.set(h.lean,h.rot,h.lean*.7),v.scale.set(h.w,h.h,h.w),v.updateMatrix(),p.setMatrixAt(x,v.matrix),te.push({x:h.x,z:h.z,y:h.y,h:h.h,w:h.w*.34,taper:1})}),p.frustumCulled=!1,k.add(p),await P.yield()}{const t=b.fork?b.fork("flowers"):b,e=[],i=[],r=[],l=7,o=m(G.lemon).lerp(m(C[1]),.45).multiplyScalar(.8),n=m(C[1]).multiplyScalar(.86);for(let d=0;d<l;d++){const g=d/l*O+.3*Math.sin(d*5.1),S=.45+.35*Math.sin(d*2.7),A=.75+.25*Math.sin(d*3.3),q=Math.cos(g),B=Math.sin(g),N=Math.cos(S),rt=Math.sin(S),J=[q*N*A,rt*A,B*N*A],vt=[q*N*A*.42,rt*A*.5,B*N*A*.42],jt=.16*A,p0=[vt[0]-B*jt,vt[1]-.05,vt[2]+q*jt],d0=[vt[0]+B*jt,vt[1]-.05,vt[2]-q*jt];for(const v0 of[[[0,0,0],p0,J],[[0,0,0],J,d0]])v0.forEach((_t,P0)=>{e.push(_t[0],_t[1],_t[2]);const ce=_t===J?n:o;i.push(ce.r,ce.g,ce.b),r.push(1)})}const s=new a.BufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute(e,3)),s.setAttribute("color",new a.Float32BufferAttribute(i,3)),s.setAttribute("aF",new a.Float32BufferAttribute(r,1)),s.computeVertexNormals();const c=Math.round(2300*tt*St),u=new a.InstancedMesh(s,$(yt,bt,Mt(0,.3),{side:a.DoubleSide}),c);let f=0,p=0;const h=z(),x=z();for(;f<c&&p++<c*5;){p%300===0&&await P.yield();let d,g;const S=t();if(S<.5&&ee.length){const N=t.pick(ee),rt=t.range(-.6,1.9),J=N.sz*t.range(.9,2.2);d=N.x+Math.cos(rt)*J,g=N.z+Math.sin(rt)*J}else if(S<.72)g=t.range(-2835,-2140),d=(t.chance(.6)?394:M(371,414,w(-2300,-2150,g))+M(24,12,w(-2300,-2150,g))*Math.sin(g/230))+(t.chance(.5)?1:-1)*(t.chance(.4)?t.range(0,1.4):t.range(3.7,5.6));else{const N=!t.chance(.5),rt=N?t.range(.672,.745):t.range(.105,.3);ut(rt,h),ve(rt,x);const J=(N?t.range(-22,22):t.range(-30,30))+t.gauss()*4;d=h.x-x.z*J,g=h.z+x.x*J}const A=L(d,g);if(A<.25||qt(d,g)<1.01)continue;const q=F.n2(d*.045+9,g*.045);if(S>=.72&&q<-.1)continue;const B=t.range(.7,1.9)*(.8+.4*w(-.2,.6,q))*(A>24?2.1:1);v.position.set(d,A-.03,g),v.rotation.set(t.range(-.2,.2),t.range(0,O),t.range(-.2,.2)),v.scale.setScalar(B),v.updateMatrix(),u.setMatrixAt(f++,v.matrix)}u.count=f,u.frustumCulled=!1,k.add(u),await P.yield()}const ae=new a.ShaderMaterial({transparent:!0,depthWrite:!1,blending:a.MultiplyBlending,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-6,fog:!1,uniforms:{uTint:{value:z(.4,.43,.47)}},vertexShader:`attribute vec3 aSeg; varying vec3 vS; varying vec2 vU;
void main(){ vS = aSeg; vU = uv;
  #ifdef USE_INSTANCING
    vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.);
  #else
    vec4 w = modelMatrix * vec4(position, 1.);
  #endif
  gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`uniform vec3 uTint; varying vec3 vS; varying vec2 vU;
void main(){ float u = mix(vS.x, vS.y, vU.x), v = abs(vU.y - 0.5) * 2.;
  float u2 = u * u, prof = mix(sqrt(max(1. - u2 * u2, 0.)), 1. - 0.86 * u, vS.z);
  float m = (1. - smoothstep(prof - 0.06, prof, v)) * (1. - smoothstep(0.985, 1., u));
  gl_FragColor = vec4(mix(vec3(1.), uTint, m), 1.); }`}),oe=Math.min(1/Math.tan(Wt),9),ke=t=>{const e=[],i=[];for(const o of t){const n=o.h*oe,s=Math.max(1,Math.ceil(n/22));for(let c=0;c<s;c++){const u=o.x-o.w*.25+n*c/s,f=o.x-o.w*.25+n*(c+1)/s,p=Math.max(L(u,o.z),0)+.1,h=Math.max(L(f,o.z),0)+.1;v.position.set(u,p,o.z),v.rotation.set(0,0,Math.atan2(h-p,f-u)),v.scale.set(Math.hypot(f-u,h-p),1,o.w),v.updateMatrix(),e.push(v.matrix.clone()),i.push(c/s,(c+1)/s,o.taper||0)}}const r=new a.PlaneGeometry(1,1).rotateX(-Math.PI/2).translate(.5,0,0);r.setAttribute("aSeg",new a.InstancedBufferAttribute(new Float32Array(i),3));const l=new a.InstancedMesh(r,ae,e.length);return e.forEach((o,n)=>l.setMatrixAt(n,o)),l.frustumCulled=!1,l.renderOrder=1,k.add(l),l};await P.yield(),I||ke(te),await P.yield();const Nt=t=>{const e=[],i=[],r=[],l=[];for(const[n,s,c,u]of t){const f=n.index?n.toNonIndexed():n;u&&f.applyMatrix4(u);const p=f.attributes.position.array,h=f.attributes.normal.array;for(let x=0;x<p.length;x+=3)e.push(p[x],p[x+1],p[x+2]),i.push(h[x],h[x+1],h[x+2]),r.push(s.r,s.g,s.b),l.push(c);f.dispose(),n!==f&&n.dispose()}const o=new a.BufferGeometry;return o.setAttribute("position",new a.Float32BufferAttribute(e,3)),o.setAttribute("normal",new a.Float32BufferAttribute(i,3)),o.setAttribute("color",new a.Float32BufferAttribute(r,3)),o.setAttribute("aF",new a.Float32BufferAttribute(l,1)),o},y=(t,e,i,r=0,l=0,o=0,n=1,s=1,c=1)=>new a.Matrix4().compose(z(t,e,i),new a.Quaternion().setFromEuler(new a.Euler(r,l,o)),z(n,s,c)),Ce=(()=>{const t=m(G.hull).multiplyScalar(.8),e=m(G.hull).multiplyScalar(.42),i=m(G.hull).multiplyScalar(.62),r=m("#141a1e"),l=m("#8f9690").multiplyScalar(.6),o=m(C[1]).multiplyScalar(.84),n=m(C[2]),s=m("#DCEBFF"),c=m("#FFB060"),u=[[new a.BoxGeometry(4.4,.9,11),l,0,y(0,2.7,0)],[new a.CapsuleGeometry(2.25,4.2,5,18),t,0,y(0,5.35,-.6,Math.PI/2)],[new a.SphereGeometry(2.1,16,10),t,0,y(0,6.95,3.5,0,0,0,1,1.12,1.12)],[new a.SphereGeometry(2.14,16,3,.25,Math.PI-.5,1.02,.36),r,0,y(0,6.95,3.5,0,0,0,1,1.12,1.12)],[new a.BoxGeometry(5.4,.25,2.6),l,0,y(0,1.3,6.9,-.5)],[new a.BoxGeometry(.2,1.7,2.6),l,0,y(2.7,1.9,6.6,-.5)],[new a.BoxGeometry(.2,1.7,2.6),l,0,y(-2.7,1.9,6.6,-.5)],[new a.SphereGeometry(1,10,6),o,1,y(0,1.75,6.4,0,0,0,2.4,.8,1.1)],[new a.BoxGeometry(4.3,2.3,3.5),i,0,y(0,4.6,-4.7)],[new a.SphereGeometry(1,12,7),o,1,y(0,5.7,-4.7,0,0,0,2.05,1.25,1.65)],[new a.BoxGeometry(.16,2.3,3.4),l,0,y(0,8.6,-.9)],[new a.BoxGeometry(.24,.22,3.6),n,0,y(0,9.8,-.9)],[new a.BoxGeometry(.24,2.4,.2),n,0,y(0,8.65,-2.65)],[new a.BoxGeometry(.24,2.4,.2),n,0,y(0,8.65,.85)],[new a.CylinderGeometry(.06,.15,10,5),l,0,y(1.3,14,1.6)],[new a.SphereGeometry(.34,8,6),s,2,y(1.3,19.1,1.6)],[new a.SphereGeometry(.17,6,4),c,2,y(1.3,16.2,1.6)],[new a.SphereGeometry(.17,6,4),c,2,y(1.3,12.8,1.6)],[new a.BoxGeometry(1.5,.5,.2),s,2,y(0,5.2,5.9)]];for(let f=0;f<4;f++)u.push([new a.TorusGeometry(2.31,.1,5,18),e,0,y(0,5.35,-2.5+f*1.3)]);for(let f=0;f<3;f++)for(const p of[-1,1])u.push([new a.CylinderGeometry(.28,.28,1.5,6),r,0,y(p*2.5,2.2,-4+f*4,0,0,Math.PI/2)]);for(let f=0;f<3;f++)for(const p of[-1,1])u.push([new a.BoxGeometry(1.9,.12,3.5),l,0,y(p*3.25,4.05,-4+f*4)]),u.push([new a.BoxGeometry(.12,.9,.12),r,0,y(p*2.45,3.6,-4+f*4)]);for(const f of[-1,1]){u.push([new a.CapsuleGeometry(.42,3.4,3,8),o,0,y(f*2.42,3.75,-.7,Math.PI/2)]),u.push([new a.BoxGeometry(.5,.5,.4),l,0,y(f*1.55,4.1,5.35)],[new a.BoxGeometry(.34,.34,.1),s,2,y(f*1.55,4.1,5.58)]),u.push([new a.BoxGeometry(.07,.07,5.2),l,0,y(f*1.1,7.95,-.6)]);for(let p=0;p<4;p++)u.push([new a.BoxGeometry(.07,.42,.07),l,0,y(f*1.1,7.72,-3+p*1.6)])}for(let f=0;f<7;f++)u.push([new a.ConeGeometry(.16,.7,4),r,0,y(-2.25+f*.75,.75,8.25,1.1)]);return u.push([new a.BoxGeometry(4.6,.14,3.8),n,0,y(0,5.78,-4.7)],[new a.BoxGeometry(4,.2,3.2),e,0,y(0,5.8,-4.7)]),u.push([new a.BoxGeometry(.3,.3,1.6),r,0,y(0,2.3,-6.3)]),Nt(u)})();await P.yield();const Be=(()=>{const t=[new a.Vector2(.001,.62),new a.Vector2(.5,.66),new a.Vector2(.84,.74)];for(let o=0;o<=7;o++){const n=(.5-o/7)*Math.PI*.94;t.push(new a.Vector2(.84+1.16*Math.pow(Math.cos(n),.62),1.05*Math.sin(n)))}t.push(new a.Vector2(.84,-.74),new a.Vector2(.5,-.66),new a.Vector2(.001,-.62));const e=new a.LatheGeometry(t.reverse(),22).rotateZ(-Math.PI/2),i=e.attributes.position.count,r=new Float32Array(i*3),l=m(C[1]).multiplyScalar(.8);for(let o=0;o<i;o++)r[o*3]=l.r,r[o*3+1]=l.g,r[o*3+2]=l.b;return e.deleteAttribute("uv"),e.setAttribute("color",new a.BufferAttribute(r,3)),e.setAttribute("aF",new a.BufferAttribute(new Float32Array(i),1)),e})();await P.yield();const Dt=H==="stakes"?0:Math.max(2,Math.round(5*tt)),It=D+Dt,R=[];for(let t=0;t<D;t++)R.push({x:394,lag:t*34,tilt:0,far:!1});const e0=ht(.14).z,Fe=ht(.15).z,se=ht(.165).z;H==="halted"&&(R[1].lag=19,R[1].tilt=.09,R[2].lag=se-Fe-3,R[3].lag=se-e0-1);const a0=D>=4?D-2:Math.max(D-1,0);for(let t=0;t<Dt;t++){const e=-Math.PI/2+.55+t*.13+b.range(-.03,.03),i=b.range(2240,2440);R.push({x:Math.cos(e)*i,z:Math.sin(e)*i,far:!0,yaw:-e+Math.PI,tilt:0})}const Et=$(yt,bt,Mt(.25),{defines:{MACHINE:1}});Et.uniforms.uEmis.value=7;const re=$(yt,bt,{...Mt(.15),uSpin:{value:0}},{defines:{WHEEL:1}});let ot=null,mt=null,X=null;if(It>0){ot=new a.InstancedMesh(Ce,Et,Math.max(D,1)),ot.count=D;const t=m(G.hull).multiplyScalar(.8),e=Nt([[new a.BoxGeometry(5.6,3.6,11),m("#8f9690").multiplyScalar(.6),0,y(0,2.4,0)],[new a.CapsuleGeometry(2.25,6.5,2,8),t,0,y(0,5.35,.4,Math.PI/2)],[new a.CylinderGeometry(.1,.16,10,4),t,0,y(1.3,14,1.6)],[new a.SphereGeometry(.4,6,4),m("#DCEBFF"),2,y(1.3,19.1,1.6)]]),i=new a.InstancedMesh(e,Et,Math.max(Dt,1));i.count=Dt,i.frustumCulled=!1,k.add(i),R.forEach((o,n)=>{if(!o.far)return;const s=Math.max(L(o.x,o.z),0);v.position.set(o.x,s,o.z),v.rotation.set(0,o.yaw,0),v.scale.setScalar(1),v.updateMatrix(),i.setMatrixAt(n-D,v.matrix),o.cy=s}),mt=new a.InstancedMesh(Be,re,Math.max(D,1)*6),mt.count=D*6,ot.frustumCulled=mt.frustumCulled=!1,k.add(ot,mt);const r=new a.PlaneGeometry(1,1).rotateX(-Math.PI/2).translate(.5,0,0),l=new Float32Array(It*2*3);for(let o=0;o<It;o++)l.set([0,1,.25],o*6),l.set([0,1,1],o*6+3);r.setAttribute("aSeg",new a.InstancedBufferAttribute(l,3)),X=new a.InstancedMesh(r,ae,It*2),X.frustumCulled=!1,X.renderOrder=1,X.visible=!I,k.add(X)}const o0=t=>H==="halted"?se+14:Fe+14.3+a0*34+462*(t-.15),Ge=(t,e)=>{if(!ot)return;const i=o0(t);R.forEach((r,l)=>{const o=r.x,n=r.far?r.z+0:i-r.lag,s=Math.max(L(o,n),0);if(r.cz=n,r.cy=s,v.position.set(o,s,n),v.rotation.set(-r.tilt,r.far?r.yaw:0,r.tilt*.4),v.scale.setScalar(1),v.updateMatrix(),r.far||ot.setMatrixAt(l,v.matrix),!r.far)for(let c=0;c<6;c++)Ae.copy(v.matrix).multiply(Qe.makeTranslation((c%2?1:-1)*3.2,1.64,-4+Math.floor(c/2)*4)),mt.setMatrixAt(l*6+c,Ae);if(X){const c=9.2*oe,u=r.far?-kt.x:1;v.position.set(o-2,s+.15,n),v.rotation.set(0,0,0),v.scale.set(c,1,12),v.updateMatrix(),X.setMatrixAt(l*2,v.matrix),v.position.set(o+1.3,s+.16,n+1.6),v.scale.set(19.4*oe,1,.5),v.updateMatrix(),X.setMatrixAt(l*2+1,v.matrix)}}),ot.instanceMatrix.needsUpdate=!0,mt.instanceMatrix.needsUpdate=!0,X&&(X.instanceMatrix.needsUpdate=!0),re.uniforms.uSpin.value=H==="halted"?0:e*3};if(Ge(0,0),H==="halted"&&ot){const t=R[0].cz-7.1,e=R[0].cy+2.3,i=R[1].cz+5.5,r=R[1].cy+2.6,l=Math.hypot(t-i,e-r),o=[[new a.BoxGeometry(.22,.22,l),m("#8f9690").multiplyScalar(.55),0,y(394,(e+r)/2,(t+i)/2,-Math.atan2(e-r,t-i))]];for(let s=0;s<8;s++){const c=s/8,u=(s+1)/8,f=g=>-1.5*4*g*(1-g),p=M(r,e,c)+f(c)-.3,h=M(r,e,u)+f(u)-.3,x=M(i,t,c),d=M(i,t,u);o.push([new a.BoxGeometry(.1,.1,Math.hypot(d-x,h-p)),m("#141a1e"),0,y(394.6,(p+h)/2,(x+d)/2,-Math.atan2(h-p,d-x))])}const n=new a.Mesh(Nt(o),Se);n.frustumCulled=!1,k.add(n)}const qe=new a.Vector2,ne={uPx:{value:400}};let lt=null;if(D>0&&H!=="halted"){const t=Math.round(440*Math.max(tt,.7)),e=D*6*t,i=new Float32Array(e*4),r=new Float32Array(e*3);for(let n=0;n<e;n++)i[n*4]=Math.floor(n/(6*t)),i[n*4+1]=Math.floor(n/t)%6,i[n*4+2]=b(),i[n*4+3]=b();const l=new a.BufferGeometry;l.setAttribute("position",new a.BufferAttribute(r,3)),l.setAttribute("aD",new a.BufferAttribute(i,4));const o={...ne,uTime:W.uTime,uHz:{value:new Float32Array(9)},uHy:{value:new Float32Array(9)},uCol:{value:m(G.lemon).lerp(m(C[0]),.35).multiplyScalar(I?.45:1.05)}};lt=new a.Points(l,new a.ShaderMaterial({uniforms:o,transparent:!0,depthWrite:!1,fog:!1,vertexShader:`
attribute vec4 aD; uniform float uTime, uPx, uHz[9], uHy[9]; varying float vA;
void main(){
  int hi = int(aD.x + 0.5); float side = mod(aD.y, 2.) < 0.5 ? -1. : 1., row = floor(aD.y / 2.);
  // eight arcs per wheel (a fan): every grain rides one of them, p0 + v t - 0.9 t t, and lands on the stripe behind the wheel
  float arc = floor(aD.z * 6.), r3 = fract(aD.z * 6.), vy = 2.5 + 2.2 * (arc + 0.5) / 6. + 0.03 * (r3 - 0.5), T = vy / 0.9, tt = fract(uTime / T + aD.w) * T;
  float lat = (fract(arc * 0.37 + row * 0.21) - 0.5) * 1.4 + 0.05 * (r3 - 0.5);
  vec3 p = vec3(394. + side * 3.2 + lat * (0.6 + 0.12 * tt), uHy[hi] + 0.15 + vy * tt - 0.9 * tt * tt, uHz[hi] - 5.4 + row * 4. - 2.8 * tt);
  vec4 mv = viewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
  float sz = 0.05 + 0.07 * r3, px = sz * uPx / max(-mv.z, 0.5), cap = max(3.6, uPx * 0.0105);
  gl_PointSize = clamp(px, 1.6, cap); vA = min(1., px / 1.6) * (0.75 + 0.25 * r3) * smoothstep(0., 0.25, tt) * (1. - 0.5 * smoothstep(T * 0.8, T, tt));
}`,fragmentShader:`uniform vec3 uCol; varying float vA;
void main(){ vec2 q = gl_PointCoord - 0.5; float d = dot(q, q); if (d > 0.25) discard; gl_FragColor = vec4(uCol * (1.1 - 1.2 * d), vA * (1. - smoothstep(0.14, 0.25, d))); }`})),lt.frustumCulled=!1,lt.renderOrder=2,k.add(lt)}await P.yield();const pt=j.filter(t=>t.puff>0),dt=j.find(t=>t.puff===2),Te=(()=>{const i=[],r=[],l=[];for(let n=0;n<=12;n++)for(let s=0;s<=48;s++){const c=.03+.97*(n/12),u=s/48*O;i.push(Math.cos(u)*c,1-c*c,Math.sin(u)*c),r.push(s/48,c)}for(let n=0;n<12;n++)for(let s=0;s<48;s++){const c=n*49+s,u=c+1,f=c+48+1,p=f+1;l.push(c,u,f,u,p,f)}const o=new a.BufferGeometry;return o.setAttribute("position",new a.Float32BufferAttribute(i,3)),o.setAttribute("uv",new a.Float32BufferAttribute(r,2)),o.setIndex(l),o})(),Rt=new Float32Array(pt.length*4);pt.forEach((t,e)=>{const i=b.range(34,44),r=b.range(60,76),l=b.range(9,14);t.R=t.R||(t.puff===2?150:t.puff===3?72:i),t.H=t.H||(t.puff===2?180:t.puff===3?98:r),t.per=t.puff===2?11:t.puff===3?9:l,Rt.set([t.per,b(),t.gain||(t.puff===2?2.6:t.puff===3?3.2:1),t.puff===2?36:t.puff===3?28:16],e*4)});const ie={uTime:W.uTime,uSun:W.uSun,uGoldT:{value:m("#FFF0C8")},uBlueT:{value:m(C[4])},uG:{value:1},uKidIn:{value:0}};Te.setAttribute("aK",new a.InstancedBufferAttribute(Rt,4));const Ht=new a.InstancedMesh(Te,new a.ShaderMaterial({uniforms:ie,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,fog:!1,vertexShader:`attribute vec4 aK; varying vec3 vW, vN; varying vec2 vAS; varying vec4 vK; varying float vTf;
void main(){ vAS = uv; vK = aK; vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.); vW = w.xyz;
  float R = length(instanceMatrix[0].xyz), H = length(instanceMatrix[1].xyz); vTf = sqrt(H / 0.9);
  vN = normalize(vec3(position.x * 2. * H / R, 1., position.z * 2. * H / R)); gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`uniform float uTime, uG, uKidIn; uniform vec3 uSun, uGoldT, uBlueT; varying vec3 vW, vN; varying vec2 vAS; varying vec4 vK; varying float vTf;
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
void main(){
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.)), N = normalize(vN);
  float limb = min(4., 1. / max(0.1, abs(dot(N, V))));
  float x = vAS.x * vK.w, id = floor(x), f = abs(fract(x) - 0.5), fw = fwidth(vAS.x) * vK.w;
  float inK = uKidIn * step(2.55, vK.z) * step(vK.z, 2.65);            // from inside the rare bell its skin clears: thin bright ribs to the crown, no veil over the ground
  float rib = (1. - smoothstep(mix(0.05, 0.012, inK), mix(0.22, 0.06, inK) + fw, f)) * (0.4 + 0.6 * h11(id + 3.));
  float hair = (1. - smoothstep(0.1, 0.4, abs(fract(x * 5.) - 0.5))) * (1. - smoothstep(0.1, 0.35, fw * 5.)) * 0.3;
  float launch = (uTime - vAS.y * vTf) / vK.x + vK.y;                    // density is a function of when the grain left the vent
  float pulse = 0.22 + 0.78 * smoothstep(0.2, 0.75, 0.5 + 0.5 * sin(launch * 6.2831853)) + 0.25 * sin(launch * 40. + id);
  vec3 tint = mix(uBlueT * 0.4, uGoldT, smoothstep(-0.3, 0.5, dot(normalize(vec3(N.x, 0., N.z) + vec3(1e-4, 0., 0.)), uSun)));
  float a = 0.06 * limb * (mix(0.5, 0.035, inK) + (1.6 + 1.2 * inK) * rib + hair * (1. - 0.7 * inK)) * max(pulse, 0.) * vK.z * uG * smoothstep(0.03, 0.12, vAS.y) * (1. - smoothstep(0.93, 1., vAS.y) * 0.6);
  gl_FragColor = vec4(tint * a, 1.);
}`}),pt.length);pt.forEach((t,e)=>{v.position.set(t.x,t.top,t.z),v.rotation.set(0,0,0),v.scale.set(t.R,t.H,t.R),v.updateMatrix(),Ht.setMatrixAt(e,v.matrix)}),Ht.frustumCulled=!1,Ht.renderOrder=3,k.add(Ht),await P.yield();{const t=Math.round(520*tt),e=pt.reduce((u,f)=>u+(f.puff===2?t*5:f.puff===3?t*3.4:f.u?t:t*.4)|0,0),i=new Float32Array(e*4),r=new Float32Array(e*4),l=new Float32Array(e*2),o=new Float32Array(e*3);let n=0;pt.forEach((u,f)=>{const p=(u.puff===2?t*5:u.puff===3?t*3.4:u.u?t:t*.4)|0;for(let h=0;h<p;h++,n++){i.set([u.x,u.top,u.z,u.H],n*4);const x=b.chance(u.puff>=2?.45:.3);r.set([b.range(0,O),x?-1:b.range(.8,1)*u.R,b(),b()],n*4),l.set([Rt[f*4],Rt[f*4+1]],n*2)}});const s=new a.BufferGeometry;s.setAttribute("position",new a.BufferAttribute(o,3)),s.setAttribute("aV",new a.BufferAttribute(i,4)),s.setAttribute("aG",new a.BufferAttribute(r,4)),s.setAttribute("aI",new a.BufferAttribute(l,2));const c=new a.Points(s,new a.ShaderMaterial({uniforms:{...ne,...ie},transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,fog:!1,vertexShader:`
attribute vec4 aV, aG; attribute vec2 aI; uniform float uTime, uPx; uniform vec3 uSun, uGoldT, uBlueT; varying vec3 vC;
void main(){
  float H = aV.w, Tf = sqrt(H / 0.9), jet = step(aG.y, 0.), Tup = 2.5 + H * 0.02;
  float sv = fract(aG.z + uTime / mix(Tf, Tup, jet)), ca = cos(aG.x), sa = sin(aG.x);
  float launch = (uTime - sv * mix(Tf, Tup, jet)) / aI.x + aI.y - jet * 0.02;
  float pulse = 0.2 + 0.8 * smoothstep(0.2, 0.75, 0.5 + 0.5 * sin(launch * 6.2831853));
  vec3 p = mix(aV.xyz + vec3(ca * aG.y * sv, H * (1. - sv * sv), sa * aG.y * sv),
               aV.xyz + vec3(ca, 0., sa) * (0.4 + 2.4 * aG.w * aG.w) * (0.5 + sv) * (0.6 + H * 0.006) + vec3(0., H * (1. - (1. - sv) * (1. - sv)), 0.), jet);
  vec4 mv = viewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
  float sz = (0.5 + 0.9 * aG.w) * (1. + 0.3 * jet), px = sz * uPx / max(-mv.z, 0.5), big = max(px, 1.6);
  gl_PointSize = min(big, 48.);
  vec3 tint = mix(uBlueT * 0.45, uGoldT, mix(smoothstep(-0.3, 0.5, -ca * -uSun.x + sa * uSun.z), 0.8, jet));
  vC = tint * pulse * (0.5 + 1.3 * jet) * min(1., (px * px) / (big * big) + 0.25) * 0.9;
}`,fragmentShader:"varying vec3 vC; void main(){ vec2 q = gl_PointCoord - 0.5; float d = dot(q, q); gl_FragColor = vec4(vC * exp(-d * 18.), 1.); }"}));c.frustumCulled=!1,c.renderOrder=4,k.add(c)}await P.yield();{const t=m("#9aa39c").multiplyScalar(.6),e=m(C[2]),i=m("#DCEBFF"),r=Nt([[new a.CylinderGeometry(.07,.11,4.6,5),t,0,y(0,2.3,0)],[new a.BoxGeometry(.9,.5,.06),e,0,y(0,3.6,0)],[new a.ConeGeometry(.5,.9,5),t,0,y(0,.4,0)],[new a.SphereGeometry(.3,8,6),i,2,y(0,4.8,0)]]),l=[];for(let n=0;n<9;n++){const s=-150+n*40,c=Math.atan2(s,380),u=Gt(c)-10;l.push([Math.cos(c)*u,Math.sin(c)*u,2.3])}if(H==="stakes")for(let n=0;n<12;n++)l.push([391+n%2*6,-2815+n*38,2]);const o=new a.InstancedMesh(r,Et,l.length);l.forEach(([n,s,c],u)=>{const f=L(n,s)-.2;v.position.set(n,f,s),v.rotation.set(0,u*1.3,0),v.scale.setScalar(c),v.updateMatrix(),o.setMatrixAt(u,v.matrix)}),o.frustumCulled=!1,k.add(o),I||ke(l.map(([n,s,c])=>({x:n,z:s,y:0,h:4.8*c,w:.5*c,taper:.4})))}{const t=b.fork?b.fork("mist"):b,e=Math.round(150*tt),i=new Float32Array(e*4),r=ht(.14).z,l=new a.PlaneGeometry(1,1,4,1).rotateX(-Math.PI/2);for(let n=0;n<e;n++){let s=t.range(-2835,-2130),c=380+(t.chance(.5)?1:-1)*t.range(5,60);H==="halted"&&n%3===0&&(s=r+t.range(-10,95),c=t.range(374,408));const u=Math.max(L(c,s),L(c,s-12),0);i.set([c,u+t.range(.25,.6),s,t()],n*4)}l.setAttribute("aM",new a.InstancedBufferAttribute(i,4));const o=new a.InstancedMesh(l,new a.ShaderMaterial({uniforms:{uTime:W.uTime,uCol:{value:m(G.lemon).lerp(m(C[1]),.6).multiplyScalar(I?.3:.85)},uA:{value:I?.22:.45}},transparent:!0,depthWrite:!1,fog:!1,side:a.DoubleSide,vertexShader:`attribute vec4 aM; uniform float uTime; varying vec2 vU; varying float vA; varying vec3 vW;
void main(){ float ph = fract(aM.w + uTime * (0.03 + 0.02 * fract(aM.w * 7.3))), sz = 9. + 16. * fract(aM.w * 13.7);
  vec3 p = vec3(position.x * sz * 0.7, 0., position.z * sz * 1.6) + aM.xyz + vec3(sin(aM.w * 40.) * 4. * ph, -0.25 * ph, -26. * ph + 8.);
  vU = uv; vA = smoothstep(0., 0.25, ph) * (1. - smoothstep(0.6, 1., ph)); vW = p;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.); }`,fragmentShader:`uniform vec3 uCol; uniform float uTime, uA; varying vec2 vU; varying float vA; varying vec3 vW;
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
void main(){ vec2 q = vU * 2. - 1.; float d = dot(q, q);
  float st = vn2(vec2(vW.x * 0.5, vW.z * 0.09 + uTime * 0.08)) * 0.6 + vn2(vec2(vW.x * 1.7, vW.z * 0.2 + uTime * 0.13)) * 0.4;
  float a = (1. - smoothstep(0.15, 1., d)) * smoothstep(0.25, 0.75, st) * vA * uA;
  gl_FragColor = vec4(uCol, a); }`}),e);o.frustumCulled=!1,o.renderOrder=2,k.add(o)}await P.yield();const le={uVeil:{value:0},uTime:W.uTime};{const t=new a.BufferGeometry;t.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));const e=new a.Mesh(t,new a.ShaderMaterial({uniforms:le,transparent:!0,depthWrite:!1,depthTest:!1,blending:a.AdditiveBlending,fog:!1,vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:"uniform float uVeil; varying vec2 vP; void main(){ gl_FragColor = vec4(vec3(0.74, 0.8, 0.9) * uVeil * (0.2 + 0.08 * vP.y), 1.); }"}));e.frustumCulled=!1,e.renderOrder=20,k.add(e)}const Le={value:0};{const t=new a.Mesh(new a.PlaneGeometry(2,2),new a.ShaderMaterial({uniforms:{uPos:{value:Ve.position.clone()},uCol:{value:m("#FFD98A")},uGrow:Le},transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,fog:!1,vertexShader:`uniform vec3 uPos; uniform float uGrow; varying vec2 vQ; varying float vK;
void main(){ vec4 mv = viewMatrix * vec4(uPos, 1.); float d = max(-mv.z, 1.);
  vK = smoothstep(mix(110., 60., uGrow), mix(330., 210., uGrow), d); vQ = position.xy; mv.xy += position.xy * d * mix(0.06, 0.2, uGrow);
  gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform vec3 uCol; uniform float uGrow; varying vec2 vQ; varying float vK;
void main(){ float r = length(vQ), core = exp(-r * r * 60.), halo = exp(-r * mix(5., 4., uGrow)) * (0.18 + 0.34 * uGrow);
  float rays = (exp(-abs(vQ.x) * 46.) + exp(-abs(vQ.y) * 46.)) * exp(-r * mix(3.2, 2.3, uGrow)) * (0.55 + 0.6 * uGrow) + (exp(-abs(vQ.x + vQ.y) * 40.) + exp(-abs(vQ.x - vQ.y) * 40.)) * exp(-r * 6.) * (0.22 + 0.3 * uGrow);
  gl_FragColor = vec4(uCol * (core * 2.4 + halo + rays) * vK * (1. - smoothstep(0.7, 1., r)), 1.); }`}));t.frustumCulled=!1,t.renderOrder=12,k.add(t)}const M0=z(0,260,0),s0=z(0,150,0),r0=z(0,58,0),n0=z(-300,545,-208),i0=z(),l0=z(),c0=z(),_=z(),Q=Math.PI/180,Vt=(t,e)=>{ut(t,_);const i=Math.atan2(Y.x-_.x,-(Y.z-_.z));let l=Math.atan2(-_.x,_.z)-i;l=Math.atan2(Math.sin(l),Math.cos(l));const o=w(.897,.936,t),n=Ot(l-38*Q,.4*l,32*Q)*(1-o),s=Math.atan2(Y.y-_.y,Math.max(Math.hypot(Y.x-_.x,Y.z-_.z),1)),c=Ot(s-M(15,6.5,o)*Q,3*Q,24*Q),u=i+n,f=Math.cos(c);return e.set(_.x+Math.sin(u)*f*600,_.y+Math.sin(c)*600,_.z-Math.cos(u)*f*600)},zt=[{at:(t,e)=>Vt(e,s0).lerp(r0,1-w(.842,.868,e)),from:.7,to:1,fade:.2,weight:.8},{at:(t,e)=>Vt(e,i0).lerp(n0,1-w(.842,.868,e)),from:.825,to:1,weight:.82,fade:.2},{at:(t,e)=>Vt(e,l0),from:.842,to:1,weight:.9,fade:.16},{at:(t,e)=>Vt(e,c0),from:.842,to:1,weight:.9,fade:.16}],f0=z(394,7,-2600),u0=z();D>0&&zt.push({at:(t,e)=>f0.set(394,4.2,ut(e,u0).z+9),from:.09,to:.205,weight:.5});{const t=z(-Math.sin(14*Q)*Math.cos(2*Q),-Math.sin(2*Q),Math.cos(14*Q)*Math.cos(2*Q)),e=z();zt.push({at:(i,r)=>ut(r,e).addScaledVector(t,3e3),from:.04,to:.1,fade:.25,weight:.6})}for(const t of zt){const e=t.at;t.at=(i,r)=>e(i,de(r)),t.from=Ft(t.from),t.to=Ft(t.to)}const Kt=[[.235,0,1e3,0],[.275,0,1e3,0],[.315,et.x,et.y+46,et.z],[.35,et.x,et.y+46,et.z],[.395,0,230,0],[.44,0,270,0],[.485,0,-70,0],[.55,0,-50,0],[.6,-150,14,-189],[.625,-150,14,-189],[.7,0,58,0]],h0=z();zt.unshift({at:(t,e)=>{let i=0;for(;i<Kt.length-2&&e>Kt[i+1][0];)i++;const r=Kt[i],l=Kt[i+1],o=w(r[0],l[0],e);return h0.set(M(r[1],l[1],o),M(r[2],l[2],o),M(r[3],l[3],o))},from:.215,to:.7,fade:.06,weight:.9});const m0=[],st=z();return{scene:k,path:K,duration:Ie,pace:t=>{let e=.84;return e=M(e,.7,w(.08,.12,t)),e=M(e,.55,w(.165,.19,t)),e=M(e,.9,w(.24,.27,t)),e=M(e,1.45,w(.275,.33,t)),e=M(e,1.2,w(.38,.42,t)),e=M(e,1.75,w(.45,.5,t)),e=M(e,.85,w(.6,.72,t)),e=M(e,.62,w(.78,.86,t)),e},camera:{fov:62,near:.5,far:9e3,lookAhead:46,sway:.3,bank:.45},pois:zt,portal:{shape:"circle",radius:7,color:"#FFD98A",glow:1,revealDistance:2400,tilt:!0},post:{exposure:I?1.05:pe?.86:.94,bloom:{strength:.5,radius:.6,threshold:.92},grade:{saturation:1.06,contrast:1.05,tint:"#ffffff",shadowTint:"#05060c",vignette:.26,grain:.012,aberration:0}},ride:"none",update(t,e,i,r){const l=de(r);W.uTime.value=e,W.uRibDrift.value=e*.011,st.setFromMatrixPosition(i.matrixWorld),Lt.position.copy(st),U.setProgress(l),U.update(t,e,i);{const o=w(.84,.915,l),n=w(.832,.86,l);U.uniforms.uDim.value=M(1,.045,n),U.uniforms.uDimR.value=M(1,.5,n),U.uniforms.uRibW.value=M(1,.2,n),U.uniforms.uDimL.value=M(1,.1,o),gt.uStars.value=Re*M(1,V==="stars"?.3:.42,n),Le.value=w(.835,.868,l),gt.uBandK.value=1+4.2*o*(V==="stars"?.6:1)}if(P.renderer.getDrawingBufferSize(qe),ne.uPx.value=qe.y*i.projectionMatrix.elements[5]*.5,Ge(l,e),dt){const o=Math.hypot(st.x-dt.x,st.z-dt.z)/dt.R,n=dt.top+dt.H*(1-o*o);ie.uKidIn.value=w(-6,30,n-st.y)}Pe.value.z=w(.012,.05,l);{const o=Math.hypot(st.x,st.z),n=o/(fe*Math.sqrt(Math.max(1-st.y/Pt,.02)));le.uVeil.value=l>0?.5*w(.86,.93,n)*(1-w(.96,1.01,n)):0,gt.uHalo.value=le.uVeil.value*2}if(lt){const o=lt.material.uniforms.uHz.value,n=lt.material.uniforms.uHy.value;for(let s=0;s<D;s++)o[s]=R[s].cz,n[s]=R[s].cy}for(const o of m0)o(t,e,i,l)},dispose(){U.dispose(),Ce.dispose(),Be.dispose(),re.dispose(),ae.dispose()}}}};export{C0 as default};
