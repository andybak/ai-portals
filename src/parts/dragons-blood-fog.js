import*as m from"three";import"three/addons/utils/BufferGeometryUtils.js";import{clamp as re,lerp as O,smoothstep as te,makeRng as Ee,hashSeed as He}from"../kit/core.js";const Qe=["#E9E6DE","#D9C19A","#2E4A34","#6C7690","#3DB5AC","#B3122A","#E8799C"],Y=300,se=Math.PI*2;async function et(a,s=256,u=null){const k=new Uint8Array(s*s*4),g=async(z,H,d)=>{const w=new Float32Array(s*s);let L=1,B=0;for(let F=0;F<z;F++){const x=H<<F,R=new Float32Array(x*x);for(let U=0;U<x*x;U++)R[U]=a();const A=x/s;for(let U=0;U<s;U++){u&&(U&31)===0&&await u();const q=U*A,S=Math.floor(q),p=q-S,M=p*p*(3-2*p),P=S%x*x,j=(S+1)%x*x;for(let I=0;I<s;I++){const y=I*A,b=Math.floor(y),D=y-b,W=D*D*(3-2*D),o=b%x,e=(b+1)%x,l=R[P+o],r=R[P+e],v=R[j+o],N=R[j+e];w[U*s+I]+=L*((l+(r-l)*W)*(1-M)+(v+(N-v)*W)*M)}}B+=L,L*=.55,u&&await u()}for(let F=0;F<s*s;F++)k[F*4+d]=Math.round(re((w[F]/B-.5)*2.1+.5,0,1)*255)};await g(5,4,0),await g(5,4,1),await g(4,16,2),await g(4,2,3);const h=new m.DataTexture(k,s,s,m.RGBAFormat);return h.wrapS=h.wrapT=m.RepeatWrapping,h.magFilter=m.LinearFilter,h.minFilter=m.LinearMipmapLinearFilter,h.generateMipmaps=!0,h.anisotropy=4,h.needsUpdate=!0,h}const De=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uBounce;
uniform vec3 uFogLit; uniform vec3 uFogShade;
uniform vec4 uBreak;   // sun break ellipse: centre x, centre z, 1/rx, 1/rz
uniform vec4 uFogP;    // rim height, fog depth at the lip, fog depth far back, density
uniform vec4 uLipA;    // bay depth, inner half width, outer half width, centre x
uniform vec4 uLipB;    // west stretch, east stretch, phase 1, phase 2
uniform vec4 uCap;     // sun fraction under the cap cloud, wind speed, fog supply 0..1, drip rate
uniform vec4 uHole;    // a lull in the sheet: centre x, centre z, 1/r^2, how much of the depth it takes
uniform vec4 uView;    // x: metres of near field cleared while the eye is inside the fog, y: 0 eye inside the fog .. 1 eye above it
uniform float uTime;
uniform sampler2D uNoise;
uniform sampler2D uMask; uniform vec4 uMaskXf;   // top-down mask of the grove: r crowns, g wake edges and bow pillows, b wake troughs
// the moonlit look (all three are black by day, so the day looks do not change): the glow of the dragon's blood
// (sap veins, scars, crown undersides and the mist they light), the moon's silver rim light, the moon's bloom in the mist
uniform vec3 uEmber; uniform vec3 uRim; uniform vec3 uHalo;
uniform vec4 uGlowP;   // one ember light (the glowing tree on the pinnacle): position, radius; far below everything when there is none
vec3 glowAt(vec3 wp, vec3 N){
  vec3 d = uGlowP.xyz - wp; float l2 = dot(d, d), r2 = uGlowP.w * uGlowP.w, f = r2 / (r2 + l2);
  return uEmber * f * f * (0.35 + 0.65 * clamp(dot(N, d) / sqrt(max(l2, 1e-4)), 0., 1.));
}
// silver rim light: strongest on edges seen against the moon (N and V unit vectors, V toward the eye)
float moonRim(vec3 N, vec3 V){
  float r = 1. - abs(dot(N, V)); float b = max(dot(-V, uSunDir), 0.);
  return r * r * r * (0.3 + 0.7 * b * b);
}
float lipZf(float x){
  float d = x - uLipA.w; d = abs(d) * (d < 0. ? uLipB.x : uLipB.y);
  return -uLipA.x * (1. - smoothstep(uLipA.y, uLipA.z, d)) + 9. * sin(x * 0.021 + uLipB.z) + 5. * sin(x * 0.047 + uLipB.w);
}
// the cloud torn off the fall drifts on south down the canyon and dissolves: its shade slides over the canyon floor
// (0 no shade .. 1 under a wisp; only within a few metres of the floor, so no wall is stained by it)
float floorShade(vec3 wp){
  float low = 1. - smoothstep(5., 15., wp.y);
  if (low <= 0.) return 0.;
  vec2 q = wp.xz - vec2(uTime * 2.5, uTime * 12.);
  float n = textureLod(uNoise, q * 0.0031 + 0.31, 0.).a * 0.72 + textureLod(uNoise, q * 0.0113 + 0.6, 0.).r * 0.28;
  return low * smoothstep(0.46, 0.64, n);
}
float sunMask(vec3 wp){
  vec2 e = (wp.xz - uBreak.xy) * uBreak.zw;
  float wr = textureLod(uNoise, wp.xz * 0.0043 + 0.2, 1.).a - 0.5;                 // the pool's edge is a cloud's shadow: curved, a little ragged, some ten metres soft
  float br = 1. - smoothstep(0.84, 1.0, dot(e, e) * (1. + 0.3 * wr));
  float open = smoothstep(-26., 4., wp.z - lipZf(wp.x));
  return mix(uCap.x, 1., max(br, open)) * (1. - 0.45 * floorShade(wp));
}
// the falling cloud also carries slow drifting shade; rock does not (it read as grey stains on the sunlit wall)
float sunMaskF(vec3 wp){
  float open = smoothstep(-26., 4., wp.z - lipZf(wp.x));
  float deep = open * (1. - smoothstep(uFogP.x - 120., uFogP.x - 40., wp.y));
  float cs = textureLod(uNoise, (wp.xz + vec2(wp.y * 0.5, -uTime * 7.)) * 0.0052, 0.).a;
  return sunMask(wp) * (1. - 0.4 * deep * smoothstep(0.44, 0.74, cs));
}
// how deep the sheet is: 0 a knee-deep veil ("thin" weather) .. 1 the full river
float deepK(){ return smoothstep(1.5, 4., uFogP.y); }
// how much of the key light the sheet takes: 0 under the cap cloud, 1 inside the sun break. Under the thin high
// veil of "thin" weather (uCap.x about 0.8) the whole sheet takes the sun, only softened
float sunK(float m){ return mix(smoothstep(uCap.x + 0.05, 0.95, m), 1., 0.75 * smoothstep(0.62, 0.88, uCap.x)); }
// height of the fog top over the plateau at xz (local metres)
float fogTop(vec2 xz){
  float g = lipZf(xz.x) - xz.y;
  float d = mix(uFogP.y, uFogP.z, smoothstep(105., 235., g)) * mix(0.55, 1., smoothstep(0., 24., g));
  float sup = 1. - smoothstep(-60., 0., g - uCap.z * 520.);   // when the supply fails the sheet's trailing edge slides south to the lip
  vec2 w = vec2(0., uTime * uCap.y);
  float n = textureLod(uNoise, (xz - w) * 0.011, 0.).a;
  float n2 = textureLod(uNoise, (xz - w * 0.8) * 0.037, 0.).r;
  vec2 hd = xz - uHole.xy; d *= 1. - uHole.w * exp(-dot(hd, hd) * uHole.z);
  return uFogP.x + d * (0.8 + 0.17 * n + 0.08 * n2) * mix(1., sup, step(uCap.z, 0.999));
}
// how thin the sheet is over xz: 0 full fog .. 1 the pavement shows. Torn holes that drift with the wind in
// loose groups, the lull round the scarred trunk (its outline torn by the same noise), and the wake that
// every trunk trails downwind, its edges rippling
float fogThin(vec2 xz){
  vec2 q = xz - vec2(0., uTime * uCap.y);
  float n = textureLod(uNoise, q * vec2(0.058, 0.026) + 0.37, 1.).g;
  float n2 = textureLod(uNoise, q * vec2(0.011, 0.0047) + 0.71, 0.).a;
  float holes = smoothstep(0.6, 0.8, n) * smoothstep(0.3, 0.55, n2) * deepK();   // a knee-deep veil does not tear: bare pavement in it read as black water under ice
  vec2 hd = xz - uHole.xy;
  // (the lull is drawn out along the flow and its outline is torn by both noises: a ragged tear, never a ring)
  vec2 hs = hd * vec2(1., 0.6);
  float lull = uHole.w * smoothstep(0.22, 0.62, exp(-dot(hs, hs) * uHole.z * 0.6) + (n - 0.5) * 1.3 + (n2 - 0.5) * 0.5);
  vec2 wq = xz + vec2((n - 0.5) * 1.8, 0.);
  float wk = textureLod(uMask, (wq - uMaskXf.xy) * uMaskXf.zw, 0.).b;
  float dkW = smoothstep(1.5, 3.6, uFogP.y), dayW = dkW * (1. - uView.z);
  // a deep sheet opens right down to the pavement; a knee-deep one only thins. By day the deep river opens along the
  // whole wake, and behind the trunks nearest the route (a wide skirt in the mask) as a lane half a crown wide
  float wake = smoothstep(mix(mix(0.42, 0.3, dkW), 0.14, dayW), mix(mix(0.7, 0.58, dkW), 0.33, dayW), wk) * mix(0.42, 0.93, dkW);
  return max(max(holes, lull), wake) * smoothstep(-1., 3., lipZf(xz.x) - xz.y);
}
// the river's surface: metres of relief on the mean fog top. Long swells, round billows and small puffs, all
// racing downwind, drawn out along the flow, and all soft (a crease or a facet reads as wind-scoured snow); lod blurs it with distance.
// (The caller calms it toward the lip.)
float relief(vec2 xz, float lod){
  vec2 q = vec2(xz.x, xz.y - uTime * uCap.y);
  float sw = textureLod(uNoise, q * vec2(0.017, 0.0062) + 0.13, lod + 1.).a;
  float bi = textureLod(uNoise, vec2(q.x, q.y - uTime * 2.) * vec2(0.031, 0.0125) + vec2(sw * 0.3, 0.), lod).r;
  float pf = textureLod(uNoise, q * vec2(0.049, 0.02) + 0.61, lod).b;
  return ((sw - 0.5) * 1.5 + (bi - 0.5) * 1.5 + (pf - 0.5) * 0.4) * mix(0.34, 1., deepK());   // a shallow veil has shallow relief: its hollows must not reach the ground
}
// opacity of the part of the view ray wp -> cam that lies inside the slab (between the pavement and the
// fog top, and behind the lip)
float gDepth = 0.;
float slabFog(vec3 wp, vec3 cam){
  float gw = lipZf(wp.x) - wp.z, gc = lipZf(cam.x) - cam.z;
  float top = fogTop(wp.xz), bot = uFogP.x - 0.5;
  float dy = cam.y - wp.y;
  // the top is taken as a plane from the fog top over the point to the fog top over the eye; a and b are the
  // heights of the two ends of the ray above that plane, and the ray is inside the slab wherever it is below it
  float a = wp.y - top, b = cam.y - fogTop(cam.xz);
  gDepth = max(-a, 0.);
  float lo = 0., hi = 1.;
  if (a >= 0. && b >= 0.) hi = 0.;
  else if (a < 0. && b >= 0.) hi = a / (a - b);
  else if (a >= 0. && b < 0.) lo = a / (a - b);
  if (wp.y < bot && dy > 0.02) lo = max(lo, (bot - wp.y) / dy);
  if (gc < 0.) hi = min(hi, gw / max(gw - gc, 1e-3));
  if (gw < 0. && gc > 0.) lo = max(lo, gw / min(gw - gc, -1e-3));          // a point beyond the lip seen from inside the river: fogged as far as the lip
  float dist = distance(wp, cam);
  float len = dist * max(hi - lo, 0.);
  len *= mix(1., smoothstep(0., 1.6, -a), step(0., b));                   // seen from above, the sheet's top is soft
  len = max(len - uView.x * (1. - exp(-len / max(uView.x, 0.01))), 0.);     // the near field stays clear while we fly inside it
  len *= 1. - mix(0.8, 0.62, uView.z) * uView.y * step(0., b) * (1. - smoothstep(16., 60., dist)) * deepK();   // looked down into from just above, the near river is mist: the pavement ghosts through it (by day most of all)
  // seen from above, what counts is how thin the sheet is where the eye's ray enters it: a hole or a wake is a
  // window on whatever lies under and beyond it
  float thinAt = fogThin(mix(wp.xz, cam.xz, clamp(hi, 0., 1.))) * uView.y * step(0., b) * (1. - smoothstep(110., 240., dist));
  float dK = deepK();
  float f = 1. - exp(-uFogP.w * len * (1. - mix(0.5, 0.9, dK) * thinAt));
  // under a knee-deep veil the pavement is never bare: seen from above it is lifted at least halfway to the mist's colour
  f = max(f, 0.5 * (1. - dK) * smoothstep(0., 1., -a) * step(0., b) * uView.y * uCap.z * step(0., gw));
  f = max(f, 0.46 * dK * thinAt * smoothstep(0., 1., -a) * step(0., b) * uCap.z * step(0., gw));   // nor is the bottom of a hole torn in the deep river: mauve-grey, a third darker than the mist round it
  // the sheet licks up whatever stands in it: a trunk fades into the river over a metre or so, in tongues that
  // climb and fall, so nothing meets the top at a waterline
  float lk = textureLod(uNoise, vec2(wp.x * 0.31 + wp.z * 0.23, wp.y * 0.13 - uTime * 0.4), 0.).g;
  float lk2 = textureLod(uNoise, vec2(wp.x * 0.13 + wp.y * 0.21, (wp.z - uTime * uCap.y) * 0.05), 0.).g;
  float skirt = exp(-max(a, 0.) / (0.4 + 2.4 * lk * lk2)) * (0.6 + 0.38 * lk2) * step(0., b) * uView.y * uCap.z * (1. - thinAt);
  return max(f, skirt * step(0., gw + 3.) * (1. - smoothstep(60., 160., dist)));
}
vec3 fogColour(vec3 wp){ float m = sunMask(wp); return mix(uFogShade, uFogLit, 0.25 + 0.75 * m); }
// the pearl seen from inside the fog along direction d: brighter and white-gold toward the sun break. The sky
// and everything that dissolves into it use this one colour, so nothing far off stands as a paler band
vec3 pearl(vec3 cam, vec3 d){
  vec2 eb = (cam.xz + d.xz * 115. - uBreak.xy) * uBreak.zw;
  float brk = (1. - smoothstep(0.1, 1.9, dot(eb, eb))) * (1. - 0.6 * smoothstep(0.3, 0.75, d.y)) * (1. - uView.z);   // (by night there is no break: its edge stood in the mist as a pale pane)
  float s1 = max(dot(d, uSunDir), 0.), s2 = s1 * s1, s4 = s2 * s2, sd = s4 * s4;
  vec3 c = mix(uFogShade * 0.92, uFogLit * mix(vec3(1.), vec3(1.2, 1.12, 0.94), brk), (0.2 + 0.8 * mix(uCap.x * 0.7, 1., brk)) * mix(1., 0.6, uView.z)) * (1. + 0.16 * d.y + 0.3 * sd);
  // by night the mist is dark blue away from the moon and blooms warm silver round it
  c *= mix(1., 0.62 + 0.7 * s2, uView.z);
  return c + uHalo * (0.62 * sd * sd * sd + 0.3 * sd + 0.1 * s2);
}
vec3 applySlab(vec3 col, vec3 wp, vec3 cam){
  float sf = slabFog(wp, cam);
  // (seen from above, the fog that drowns a thing has the colour of the sheet beside it: violet pearl-grey under the cap by day)
  float sm = sunMask(wp), sunnyS = sunK(sm);
  vec3 shd = uFogShade * mix(vec3(1.), vec3(0.8, 0.79, 0.93), step(0., uSunDir.y) * (1. - uView.z) * uView.y);
  vec3 fc = mix(shd, uFogLit, mix(0.25 + 0.75 * sm, mix(0.12, 1., sunnyS), uView.y) * (0.42 + 0.58 * exp(-gDepth * 0.55)));
  if (uView.y < 0.999) {
    vec3 d = wp - cam; float dl = length(d); fc = mix(pearl(cam, d / max(dl, 1e-3)), fc, uView.y);
    // from inside the river nothing far off survives, however high it stands above the fog top (far crowns across
    // the bay showed as a dashed line in the pearl)
    sf = max(sf, (1. - smoothstep(0.6, 1., uView.y)) * smoothstep(140., 280., dl) * step(0., lipZf(cam.x) - cam.z + 3.));
  }
  return mix(col, fc, sf);
}
// called after the scene's own distance haze: seen from inside the river a far thing is pearl, not haze-blue
// (far crowns across the bay, fogged to pearl and then hazed blue, drew a dashed line in the fog)
vec3 farPearl(vec3 col, vec3 wp, vec3 cam){
  if (uView.y > 0.999) return col;
  vec3 d = wp - cam; float dl = length(d);
  float k = (1. - smoothstep(0.6, 1., uView.y)) * smoothstep(140., 280., dl) * step(0., lipZf(cam.x) - cam.z + 3.);
  return mix(col, pearl(cam, d / max(dl, 1e-3)), k);
}
`;function tt(a){const s={depth:a.range(175,215),w0:a.range(120,160),w1:a.range(265,300),cx:a.range(-25,25),sl:a.range(.88,1.12),sr:a.range(.88,1.12),p1:a.range(0,se),p2:a.range(0,se)};return s.z=u=>{let k=u-s.cx;return k=Math.abs(k)*(k<0?s.sl:s.sr),-s.depth*(1-te(s.w0,s.w1,k))+9*Math.sin(u*.021+s.p1)+5*Math.sin(u*.047+s.p2)},s}function ot(a,s){const u=a.hour||"morning",k=a.weather||"fog",g=a.season||"feb",h=L=>new m.Color(L),z=h(s[0]),H=h(s[3]),d={hour:u,weather:k,season:g},w=(L,B)=>{const F=L*Math.PI/180,x=B*Math.PI/180;return new m.Vector3(Math.cos(x)*Math.sin(F),Math.sin(x),-Math.cos(x)*Math.cos(F)).normalize()};return u==="dawn"?(d.sunDir=w(98,8),d.sunCol=h("#ffb07a").multiplyScalar(2.3),d.sky=h("#8d93b8").multiplyScalar(.55),d.fogLit=h("#ffc9a8").multiplyScalar(1.05),d.fogShade=h("#7d83a6").multiplyScalar(.75),d.cap=.3):u==="evening"?(d.sunDir=w(252,22),d.sunCol=h("#ffc88a").multiplyScalar(2.5),d.sky=h("#93a0c4").multiplyScalar(.6),d.fogLit=h("#ffe2bd").multiplyScalar(1.1),d.fogShade=H.clone().multiplyScalar(.85),d.cap=.28):u==="night"?(d.sunDir=w(253,11),d.sunCol=h("#b4c3ff").multiplyScalar(1),d.sky=h("#1c2a5a").multiplyScalar(1.05),d.fogLit=h("#b4c3ee").multiplyScalar(.5),d.fogShade=h("#1b2650").multiplyScalar(.62),d.cap=.86):(d.sunDir=w(108,30),d.sunCol=h("#fff0d8").multiplyScalar(2.3),d.sky=h("#a9b9d6").lerp(H,.3).multiplyScalar(.62),d.fogLit=z.clone().lerp(h("#fff6e0"),.5).multiplyScalar(1.02),d.fogShade=H.clone().lerp(z,.36).multiplyScalar(.95),d.cap=.2),a.sunDir&&(d.sunDir=a.sunDir.clone().normalize()),d.bounce=h(s[1]).multiplyScalar(u==="night"?.05:.22),d.night=u==="night",d.fogLip=k==="thin"?1.6:k==="drizzle"||g==="summer"?5:4,d.fogBack=k==="thin"?3:k==="drizzle"?12:g==="summer"?13:11,d.wind=g==="summer"?30:24,d.dripRate=k==="drizzle"?3:1,d.veil=k==="thin"?.55:1,k==="thin"&&u!=="night"&&(d.cap=.8),d}const _=m.Vector3;function at(){return{p:[],n:[],c:[],u:[],w:[],i:[],nv:0}}function ve(a,s,u,k,g,h,z,H,d,w){return a.p.push(s.x,s.y,s.z),a.n.push(u.x,u.y,u.z),a.c.push(k.r*g,k.g*g,k.b*g),a.u.push(h,z),a.w.push(H,d,w),a.nv++}function st(a){const s=new m.BufferGeometry;return s.setAttribute("position",new m.Float32BufferAttribute(a.p,3)),s.setAttribute("normal",new m.Float32BufferAttribute(a.n,3)),s.setAttribute("color",new m.Float32BufferAttribute(a.c,3)),s.setAttribute("uv",new m.Float32BufferAttribute(a.u,2)),s.setAttribute("aW",new m.Float32BufferAttribute(a.w,3)),s.setIndex(a.i),s}const Te=new _,We=new _,qe=new _,Ke=new _,_e=new _;function Xe(a,s,u,k,g,h,z,H,d,w,L=!1){const B=s.length;let F=d,x=-1;for(let R=0;R<B;R++){const A=s[Math.max(0,R-1)],U=s[Math.min(B-1,R+1)];Te.subVectors(U,A).normalize(),Math.abs(Te.y)<.92?We.set(0,1,0):We.set(1,0,0),We.cross(Te).normalize(),qe.crossVectors(Te,We),R>0&&(F+=s[R].distanceTo(s[R-1]));const q=a.nv;for(let S=0;S<=k;S++){const p=S%k/k*se,M=Math.cos(p),P=Math.sin(p);_e.set(We.x*M+qe.x*P,We.y*M+qe.y*P,We.z*M+qe.z*P);const j=u[R]*(L||S===k||S===0?1:1+(w()-.5)*.1);Ke.copy(s[R]).addScaledVector(_e,j),ve(a,Ke,_e,g,h[R]*(L?1:.92+w()*.16),S/k,F,z[R],0,H)}if(x>=0)for(let S=0;S<k;S++)a.i.push(x+S,x+S+1,q+S,x+S+1,q+S+1,q+S);x=q}}const Ie=new _,Ge=new _,Oe=new _,Ze=new _,Le=new _,Pe=new _;function Be(a,s,u,k,g,h,z,H,d,w,L,B,F,x){Le.crossVectors(u,k),Le.lengthSq()<1e-6&&Le.set(1,0,0),Le.normalize(),Pe.crossVectors(Le,u).normalize(),Ie.copy(s),Ge.copy(s).addScaledVector(u,g*.36).addScaledVector(Le,h*.5).addScaledVector(Pe,z),Oe.copy(s).addScaledVector(u,g*.36).addScaledVector(Le,-h*.5).addScaledVector(Pe,z),Ze.copy(s).addScaledVector(u,g).addScaledVector(Pe,-g*.06);const R=ve(a,Ie,B,H,w,.5,0,F,0,x),A=ve(a,Ge,B,d,(w+L)*.5,0,.36,F,.45,x),U=ve(a,Oe,B,d,(w+L)*.5,1,.36,F,.45,x),q=ve(a,Ze,B,d,L,.5,1,F,1,x);a.i.push(R,q,U,R,A,q)}function $e(a,s,u,k,g=!1,h=!1){const z=at(),H=5,d=k?5.5:a.range(4.7,5.6),w=a.range(.33,.5),L=a.range(3.8,5.2),B=d+a.range(2.7,3.4),F=a.range(.9,1.5),x=a.range(-.3,.3),R=a.range(-.3,.3),A=new _(x,d,R),U=(e,l,r=new _)=>r.set(A.x*.6+L*e*Math.cos(l),B-F*e*e,A.z*.6+L*e*Math.sin(l)),q=s===0?[0,.05,.2,.42,.64,.84,.95,1.02]:s===1?[0,.5,1.02]:[0,1.02],S=s===0?[1.5,1.16,1,.95,.93,.98,1.12,1.26]:s===1?[1.3,.95,1.22]:[1.15,1.15],p=q.map(e=>new _(x*e*e,d*e,R*e*e));Xe(z,p,S.map(e=>e*w),g?16:s===0?10:s===1?6:4,u.bark,q.map(e=>O(1,.62,e*e)),q.map(()=>0),0,0,a,g);const M=[],P=[],j=g?[0,12,10,8,6,5]:[0,9,8,6,4,3],I=g?[0,4,3,3,2,1]:[0,2,2,2,1,1],y=e=>w*.8*Math.pow(.73,e-1),b=(e,l)=>{const r=Math.sqrt((e.r0*e.r0+e.r1*e.r1)/2),v=(e.t0+e.t1)/2,N=U(r,v),K=l/H,T=Math.pow(K,.88),t=Math.pow(K,1.15+.3*r),i=new _(A.x+(N.x-A.x)*T,A.y+(N.y-A.y)*t,A.z+(N.z-A.z)*T);if(l<H){const n=L*.05;i.x+=a.range(-n,n),i.z+=a.range(-n,n),i.y+=a.range(-n,n)*.6}else i.y+=a.range(-.18,.12);return i.userData=r,i},D=(e,l,r,v)=>{if(l===H){M.push({p:r,dir:e.dir,rc:r.userData,t:(e.t0+e.t1)/2});return}const N=(e.t1-e.t0)*(e.r0+e.r1)/2,K=e.r1-e.r0,T=[];if(l===0||N>K*1.12){const t=l===0?a.chance(.7)?3:4:N>K*2.5?3:2;let i=e.t0;const n=e.t1-e.t0;for(let c=0;c<t;c++){const f=c===t-1?e.t1:e.t0+n*(c+1+a.range(-.14,.14))/t;T.push({r0:e.r0,r1:e.r1,t0:i,t1:f}),i=f}}else{const t=Math.sqrt((e.r0*e.r0+e.r1*e.r1)/2)*(1+a.range(-.05,.05));T.push({r0:e.r0,r1:t,t0:e.t0,t1:e.t1},{r0:t,r1:e.r1,t0:e.t0,t1:e.t1})}for(const t of T){const i=b(t,l+1),n=l+1,c=y(n),f=v*.82,C=new _().subVectors(i,r),J=C.length();C.multiplyScalar(1/Math.max(J,1e-4)),t.dir=C;const ae=l/H,G=n/H,ie=ae*ae*(.4+.6*i.userData),oe=G*G*(.4+.6*i.userData);if(s===0||s===1&&n<=3){const ge=s===0?j[n]:n<=2?4:3,Ne=s===0?I[n]:1,pe=s===0?.84:.66,ce=s===0?.62:.42,ue=[r],ye=[f],be=[O(pe,ce,ae)],ze=[ie];if(Ne===2&&!g){const he=new _().lerpVectors(r,i,.5);he.y-=J*.05,he.x+=C.x*0+(he.x-A.x)*.03,he.z+=(he.z-A.z)*.03,ue.push(he),ye.push((f+c)*.5*1.42),be.push(O(pe,ce,(ae+G)/2)),ze.push((ie+oe)/2),(n===2||n===3)&&P.push({p:he,dir:C,w:(ie+oe)/2,r:(f+c)*.6})}if(g){for(let Ve=1;Ve<Ne;Ve++){const ke=Ve/Ne,Me=Math.sin(Math.PI*ke),V=new _().lerpVectors(r,i,ke);V.y-=J*.05*Me,V.x+=(V.x-A.x)*.03*Me,V.z+=(V.z-A.z)*.03*Me,ue.push(V),ye.push(O(f,c,ke)*(1+.42*Me)),be.push(O(pe,ce,O(ae,G,ke))),ze.push(O(ie,oe,ke)),(n===2||n===3)&&Ve===Ne>>1&&P.push({p:V,dir:C,w:(ie+oe)/2,r:(f+c)*.6})}const he=c*(n===H?.8:1);ue.push(i),ye.push(he),be.push(O(pe,ce,G)),ze.push(oe),n<H&&(ue.push(new _().copy(i).addScaledVector(C,he*.6)),ye.push(he*.78),be.push(O(pe,ce,G)*.9),ze.push(oe)),ue.push(new _().copy(i).addScaledVector(C,he*(n<H?1.02:.9))),ye.push(he*.06),be.push(O(pe,ce,G)*.8),ze.push(oe)}else ue.push(i),ye.push(c*(Ne===2?.92:1.05)),be.push(O(pe,ce,G)),ze.push(oe);Xe(z,ue,ye,ge,u.bark,be,ze,1,a()*3,a,g)}D(t,n,i,c)}},W=a()*se;D({r0:0,r1:1,t0:W,t1:W+se},0,A,w*1.2);const o={trunkH:d,trunkR:w,R:L,top:B,drop:F,F:A,canopy:U,tips:M,mids:P,fine:g};return h?()=>Ye(z,a,s,u,o):Ye(z,a,s,u,o)}function Ye(a,s,u,k,g){const{R:h,top:z,drop:H,F:d,canopy:w,tips:L,mids:B}=g,F=new _(0,1,0),x=new _,R=new _,A=new _,U=new _,q=new _,S=new _,p=new _,M=u===0?14:u===1?11:8,P=u===0?.45:-.1,j=u===0?.84:1.05,I=u===0?k.leafDark:k.leafShell,y=[],b=w(0,0,x);b.y-=P;const D=ve(a,b,F,I,u===0?.5:1,.5,.5,.1,0,5);for(let o=0;o<2;o++){const e=o===0?.6:1;y.push(a.nv);for(let l=0;l<M;l++){const r=(l%2?1:-1)*(u===0?0:.075)*(o?1:.5)+(s()-.5)*.06,v=(l+(o?.5:0))/M*se;w(e*j*(1+r),v,x),x.y-=P+(o?u===0?.3:.25+r*2.5:0);const N=u===0?.95:1.7;S.set(Math.cos(v)*e*N,1,Math.sin(v)*e*N).normalize();const K=u===0?l%2?.34:.5:(o?.62:.92)*(1+0*s());ve(a,x,S,I,K,.5+Math.cos(v)*e*.5,.5+Math.sin(v)*e*.5,.5*e*e,0,5)}}for(let o=0;o<M;o++){const e=(o+1)%M,l=y[0]+o,r=y[0]+e,v=y[1]+o,N=y[1]+e;a.i.push(D,r,l,l,r,v,r,N,v)}const W=h*Math.sqrt(Math.PI/Math.max(L.length,1));if(u===0){for(const o of L){x.set(Math.cos(o.t),0,Math.sin(o.t)),R.copy(o.dir).multiplyScalar(.55).addScaledVector(F,.7).addScaledVector(x,.3*o.rc).normalize(),A.crossVectors(R,Math.abs(R.y)<.9?F:x.set(1,0,0)).normalize(),U.crossVectors(R,A);const e=s()*se,l=re(W*s.range(.72,.9),.55,1);for(let r=0;r<12;r++){const v=e+r*2.39996,N=O(-.42,1.36,(r+.5)/12+s.range(-.03,.03)),K=Math.cos(N),T=Math.sin(N);q.set(0,0,0).addScaledVector(A,Math.cos(v)*K).addScaledVector(U,Math.sin(v)*K).addScaledVector(R,T).normalize(),S.copy(q).multiplyScalar(.55).addScaledVector(R,.75).normalize(),p.copy(o.p).addScaledVector(R,.06+.1*Math.max(T,0));const t=l*s.range(.85,1.12)*(.82+.18*K);Be(a,p,q,R,t,t*.19,t*.035,k.leafDark,k.leafLight,.5,s.range(.85,1.1)*(.6+.4*te(-.4,.5,N)),S,o.rc*.6+.4,2)}if(g.fine&&o.rc>.74){x.set(Math.cos(o.t),0,Math.sin(o.t));for(let r=0;r<7;r++){const v=e+r*.9,N=s.range(-.75,-.05),K=s.range(-.9,.9);q.set(x.x*Math.cos(K)-x.z*Math.sin(K),0,x.z*Math.cos(K)+x.x*Math.sin(K)).multiplyScalar(Math.cos(N)),q.y=Math.sin(N),q.normalize(),S.copy(q).multiplyScalar(.4).addScaledVector(F,-.6).normalize(),p.copy(o.p).addScaledVector(q,.05),p.y-=.05+.01*Math.sin(v);const T=l*s.range(.95,1.3);Be(a,p,q,F,T,T*.2,T*.03,k.leafDark,k.leafLight,.55,s.range(.9,1.15),S,o.rc*.6+.4,2)}}s()<.3&&(p.copy(o.p).addScaledVector(R,.2),q.copy(R).multiplyScalar(.8).addScaledVector(F,.4).normalize(),Be(a,p,q,A,s.range(.55,.8),.2,0,k.spray,k.spray,.7,1,q,1,4),Be(a,p,q,U,s.range(.55,.8),.2,0,k.spray,k.spray,.7,1,q,1,4))}for(const o of B)if(!(s()>.85))for(let e=0;e<(g.fine?5:2);e++){const l=g.fine?s.range(.4,.8):s.range(.35,.95),r=g.fine?s.range(.018,.034):s.range(.012,.022);x.set(-o.dir.z,0,o.dir.x).normalize(),S.set(o.dir.x,.3,o.dir.z).normalize(),p.copy(o.p).addScaledVector(o.dir,g.fine?(e-2)*.16+s.range(-.05,.05):(e-.5)*.3),p.y-=o.r*(g.fine?.85:.6);const v=g.fine?.6:1,N=ve(a,Ke.copy(p).addScaledVector(x,r),S,k.lichen,.5*v,0,0,o.w,0,3),K=ve(a,Ke.copy(p).addScaledVector(x,-r),S,k.lichen,.5*v,1,0,o.w,0,3);p.y-=l;const T=ve(a,Ke.copy(p).addScaledVector(x,r*.5),S,k.lichen,.7*v,0,1,o.w,1,3),t=ve(a,Ke.copy(p).addScaledVector(x,-r*.3),S,k.lichen,.7*v,1,1,o.w,1,3);a.i.push(N,T,K,K,T,t)}}else{const o=u===1?Math.min(L.length,60):5;for(let e=0;e<o;e++){const l=L[Math.floor(e*L.length/o)];x.set(Math.cos(l.t),0,Math.sin(l.t)),q.copy(F).multiplyScalar(.75).addScaledVector(x,.25+.6*l.rc).normalize(),A.set(s()-.5,s()*.3,s()-.5).normalize(),p.copy(l.p),p.y-=.25;const r=u===1?s.range(.75,1.1):s.range(1.3,1.8);Be(a,p,q,A,r,r*(u===1?.24:.34),.05,k.leafDark,k.leafLight,.6,1.05,q,l.rc,2)}if(u===1)for(let e=0;e<M*2;e++){const l=(e+s.range(-.3,.3))/(M*2)*se;w(1.02,l,p),p.y-=.45,x.set(Math.cos(l),0,Math.sin(l)),A.set(-Math.sin(l),0,Math.cos(l));for(let r=0;r<2;r++){q.copy(x).multiplyScalar(r?.35:.9).addScaledVector(F,r?.95:.42).addScaledVector(A,s.range(-.35,.35)).normalize();const v=s.range(.85,1.3);Be(a,p,q,A,v,v*.3,.05,k.leafDark,k.leafLight,.6,1.2,S.copy(q).multiplyScalar(.5).addScaledVector(F,.8).normalize(),.9,2)}}}return{geo:st(a),tris:a.i.length/3,R:h,top:z,trunkH:g.trunkH,trunkR:g.trunkR,tips:L.map(o=>o.p)}}const nt=`
attribute vec3 aW; attribute vec4 aInst;
varying vec3 vCol; varying vec3 vN; varying vec3 vWp; varying vec2 vUv; varying vec3 vK; varying float vKeep; varying float vBw;
#include <fog_pars_vertex>
${De}
void main(){
  vec4 wp = instanceMatrix * vec4(position, 1.);
  vec3 p = position; float ph = aInst.x, t = uTime;
  float gust = 0.6 + 0.4 * sin(t * 0.7 + wp.x * 0.05 + wp.z * 0.03);
  float bw = aW.x;
  wp.z += bw * (0.11 + 0.08 * sin(t * 1.9 + ph + p.x * 1.3)) * gust;
  wp.x += bw * 0.05 * sin(t * 2.3 + ph * 1.7 + p.z * 1.1) * gust;
  wp.y += bw * 0.03 * sin(t * 2.9 + ph + p.x * 2. + p.z * 2.);
  float isLeaf = step(1.5, aW.z) * step(aW.z, 2.5) + step(3.5, aW.z) * step(aW.z, 4.5);
  wp.xyz += aW.y * isLeaf * 0.04 * gust * vec3(sin(t * 11. + ph + p.x * 9.), sin(t * 13. + p.z * 8. + ph), sin(t * 9. + p.y * 7.));
  float li = aW.y * step(2.5, aW.z) * step(aW.z, 3.5);
  wp.z += li * (0.38 + 0.16 * sin(t * 4. + ph + p.x * 3.)) * gust; wp.y += li * 0.14; wp.x += li * 0.08 * sin(t * 5.3 + ph);
  vWp = wp.xyz; vCol = color * (0.86 + 0.28 * aInst.z); vUv = uv; vK = vec3(aW.z, aInst.y, aW.y); vKeep = aInst.w; vBw = aW.x;
  vN = normalize(mat3(instanceMatrix) * normal);
  vec4 mvPosition = viewMatrix * modelMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,it=`
varying vec3 vCol; varying vec3 vN; varying vec3 vWp; varying vec2 vUv; varying vec3 vK; varying float vKeep; varying float vBw;
uniform vec3 uResin; uniform vec3 uCamL;
#include <fog_pars_fragment>
${De}
// one bead of resin at c.xy, radius c.z: (cover, dome shading, glint)
vec3 beadAt(vec2 p, vec3 c){
  vec2 d = (p - c.xy) / c.z; float r2 = dot(d, d);
  float cov = 1. - smoothstep(0.7, 1., r2);
  vec2 g = d - vec2(-0.32, 0.36);
  return vec3(cov, cov * (1. - 0.75 * r2), cov * exp(-dot(g, g) * 14.));
}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 Vd = uCamL - vWp; vec3 V = Vd / max(length(Vd), 1e-3);
  float kind = vK.x; float leafy = step(1.5, kind);
  float back = gl_FrontFacing ? 0. : 1.;
  vec3 alb = vCol; float gloss = 0.; float resin = 0.; float wet = 0.;
  // by moonlight the dragon's blood shows: thin veins of crimson sap glow down every trunk and out along the lower
  // forks (never under a pixel and a half wide: far off they melt into one dull glow of the trunk)
  float sapN = texture2D(uNoise, vec2(vUv.x * 2. + 0.13, vUv.y * 0.045 + 0.2)).g;
  float sapW = 0.007 + fwidth(sapN) * 1.25, sap = 0., ribU = 0.5;
  if (kind < 1.5) {
    float n = texture2D(uNoise, vec2(vUv.x * 2., vUv.y * 0.31)).b;
    float n2 = texture2D(uNoise, vec2(vUv.x * 0.5, vUv.y * 0.07)).r;
    float ringS = smoothstep(0.38, 0.5, abs(fract(vUv.y * 3.4 + n * 0.35) - 0.5));
    // bark for the close pass: leaf-scar rings, fissures down the trunk, grain, patches of crust lichen
    float n3 = texture2D(uNoise, vec2(vUv.x * 5., vUv.y * 1.9)).b;
    float ring2 = smoothstep(0.3, 0.5, abs(fract(vUv.y * 11. + n * 0.8) - 0.5));
    float fis = smoothstep(0.52, 0.74, texture2D(uNoise, vec2(vUv.x * 3., vUv.y * 0.13 + 0.4)).g);
    float crust = smoothstep(0.6, 0.78, texture2D(uNoise, vec2(vUv.x * 1.3 + 0.2, vUv.y * 0.27)).r);
    alb *= (0.74 + 0.36 * n2) * (1. - 0.34 * ringS) * (0.82 + 0.3 * n) * (1. - 0.2 * ring2) * (0.8 + 0.4 * n3) * (1. - 0.38 * fis);
    alb = mix(alb, vec3(0.42, 0.46, 0.36) * (0.7 + 0.6 * n3), crust * 0.55);
    N = normalize(N + vec3((n3 - 0.5) * 0.7, (ringS - 0.3) * 0.6 + (ring2 - 0.4) * 0.3, (n - 0.5) * 0.7 - fis * 0.2) * mix(1., 0.3, step(0.5, kind)));
    alb = mix(alb, vCol * (0.9 + 0.2 * n) * (1. - 0.2 * ringS), 0.6 * step(0.5, kind));      // forks: paler, smoother skin than the trunk
    // out along the branches the bark darkens into the sheaths of dead leaf bases under the rosettes, and the
    // warm fog-bounce of the lower forks gives way to the cool shade under the shell
    float tipK = smoothstep(0.08, 0.6, vBw) * step(0.5, kind);
    alb *= mix(vec3(1.05, 1., 0.93), vec3(0.5, 0.56, 0.6) * (0.8 + 0.4 * n3), tipK);
    alb = mix(alb, alb * vec3(1.7, 0.5, 0.45), tipK * uView.z * 0.7);
    sap = (1. - smoothstep(sapW * 0.45, sapW, abs(sapN - 0.5))) * (1. - 0.8 * tipK) * mix(1., 0.55, step(0.5, kind));
    if (kind < 0.5 && vK.y >= 0.) {
      // the tapper's scar: an oblong cut 1.2 m tall, wet crimson with one long highlight, beads of resin standing
      // on it and one run creeping down the bark (x, y in metres round and along the trunk)
      float du = fract(vUv.x - vK.y + 0.5) - 0.5;
      float x = du * 2.6, y = vUv.y - 4.55;
      float wob = (texture2D(uNoise, vec2(y * 0.2, 0.3)).r - 0.5) * 0.08;
      float e = (x + wob) * (x + wob) / 0.04 + y * y / 0.5;
      float inside = 1. - smoothstep(0.72, 0.95, e);
      float lipR = smoothstep(0.6, 0.95, e) * (1. - smoothstep(1.05, 1.5, e));
      float wood = texture2D(uNoise, vec2(x * 3., y * 0.4)).b;
      float rw = texture2D(uNoise, vec2(y * 0.11, 0.83)).g - 0.5;
      float rx = x - 0.03 - rw * 0.12, ry = y + 0.6;                              // the run: from the cut's lower end, 1.1 m down
      float runW = 0.034 * (1. - 0.55 * (1. - smoothstep(-1.1, 0., ry))) * (1. + 0.5 * (1. - smoothstep(-1.1, -0.95, ry)));
      float run = (1. - smoothstep(runW * 0.7, runW, abs(rx))) * step(ry, 0.) * (1. - smoothstep(-1.12, -1.06, ry));
      vec3 cut = mix(vec3(0.13, 0.03, 0.02), uResin * 0.62, 0.35 + 0.55 * smoothstep(0.3, 0.7, wood));
      cut *= 0.7 + 0.5 * (1. - smoothstep(0.1, 1., e));                                  // deeper colour at the rim of the cut
      alb = mix(alb, vec3(0.62, 0.55, 0.44), lipR * 0.8);
      alb = mix(alb, cut, inside);
      alb = mix(alb, uResin * 0.7, run);
      // beads: (x, y, radius)
      vec3 bd = vec3(0.);
      bd += beadAt(vec2(x, y), vec3(-0.05, 0.36, 0.04)); bd += beadAt(vec2(x, y), vec3(0.07, 0.14, 0.034));
      bd += beadAt(vec2(x, y), vec3(-0.02, -0.1, 0.046)); bd += beadAt(vec2(x, y), vec3(0.085, -0.3, 0.036));
      bd += beadAt(vec2(x, y), vec3(-0.09, -0.36, 0.032)); bd += beadAt(vec2(x, y), vec3(0.01, -0.56, 0.044));
      bd += beadAt(vec2(rx + 0.03, ry), vec3(0.03, -0.52, 0.045)); bd += beadAt(vec2(rx + 0.03, ry), vec3(0.03, -1.08, 0.05));
      float bead = clamp(bd.x, 0., 1.);
      alb = mix(alb, uResin * (0.55 + 0.6 * bd.y), bead);
      resin = max(max(inside * (0.5 + 0.5 * smoothstep(0.4, 0.7, wood)), run), bead);
      gloss = resin;
      // the wet face mirrors the bright fog: one long streak down the cut and along the run, a glint on each bead
      float s1 = (x + 0.045 + wob) / 0.028, s2 = rx / max(runW * 0.4, 1e-3);
      float streak = exp(-s1 * s1) * inside * (1. - smoothstep(0.36, 0.72, abs(y))) + exp(-s2 * s2) * run * 0.7;
      wet = streak * 0.9 + bd.z * 1.6;
    }
  }
  if (kind > 4.5) {
    alb *= 0.66 + 0.8 * texture2D(uNoise, vUv * 2.7).b * (0.6 + 0.8 * texture2D(uNoise, vUv * 9.).b);
    vec2 g = vUv * 12. + vec2(0., 0.5 * floor(vUv.x * 12.)); vec2 id = floor(g), f = fract(g) - 0.5;
    float hh = fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453);
    f += (hh - 0.5) * 0.3; float r = length(f);
    float spoke = 0.5 + 0.5 * cos(atan(f.y, f.x + 1e-4) * 7. + hh * 6.28);
    float ros = (1. - smoothstep(0.12, 0.56, r)) * mix(1., 0.45 + 0.75 * spoke, smoothstep(0.08, 0.3, r));
    float rosFar = smoothstep(45., 130., length(Vd));                          // far off the rosettes melt into one tone: no speckle, no jump between near and far crowns
    alb *= mix(1., mix(mix(0.62, 1.3, ros), 1.05, rosFar), 1. - back);
    alb += vec3(0.008, 0.02, 0.02) * ros * ros * (1. - back) * (1. - rosFar);   // pale rosette tips
    // the underside: dead leaf bases and bark, never black; by night it is the red of the tree's blood
    if (back > 0.5) { alb = mix(alb, mix(vec3(0.13, 0.12, 0.105), vec3(0.36, 0.045, 0.04), uView.z), mix(0.8 * (1. - 0.95 * vKeep), 0.92, uView.z)); N = -N; }
  }
  float m = sunMask(vWp);
  float ndl = dot(N, uSunDir);
  float wrap = mix(clamp(ndl, 0., 1.), clamp(ndl * 0.6 + 0.4, 0., 1.), leafy);
  float under = step(0.5, kind) * (1. - step(1.5, kind));
  vec3 lit = uSunCol * wrap * m * (1. - 0.62 * under) + uSkyCol * (0.55 + 0.45 * N.y) * (1. - 0.3 * under) + uBounce * (0.5 - 0.5 * N.y);
  // under the cap cloud the crowns are lit by the whole pearl sky: dark blue-green, never black beside the sunlit ones
  lit += (uSkyCol * 0.3 + uFogLit * 0.62) * (1. - m) * leafy * clamp(0.6 + 0.4 * N.y, 0., 1.) * (1. - 0.9 * vKeep) * step(0., uSunDir.y);
  // the fog sheet below is the brightest thing in the grove: it lights every underside
  lit += uFogLit * (0.2 + 0.34 * m) * clamp(0.5 - 0.85 * N.y, 0., 1.3) * (1. + 0.35 * under) * (1. - 0.6 * leafy * (1. - step(4.5, kind))) * (1. - 0.95 * vKeep) + uSkyCol * 0.22 * leafy;
  vec3 col = alb * lit;
  if (kind > 4.5) { vec2 rd = vUv - 0.5; float rib = 0.5 + 0.5 * sin(atan(rd.y, abs(rd.x) + 1e-4) * 26. + length(rd) * 9.); col *= mix(1., 0.62 + 0.5 * rib, back); ribU = rib; }
  col *= mix(1., mix(0.82, 0.9, step(4.5, kind)), back * leafy);
  float thru = max(dot(-V, uSunDir), 0.);
  col += alb * uSunCol * m * 0.3 * thru * thru * leafy * (1. - step(4.5, kind));
  vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
  float sp = pow(max(dot(N, H), 0.), 48.);
  col += gloss * uSunCol * (m * sp * 1.8 + 0.03) + wet * (uFogLit * (0.5 + 0.5 * m) + uSkyCol * 0.5);
  // night: the sap veins (a slow pulse running down them), the scars and the crowns' undersides glow like embers, and
  // every edge seen against the moon is rimmed silver
  float flowS = 0.6 + 0.4 * sin(vUv.y * 2.4 - uTime * 1.3 + sapN * 31.);
  float underG = back * step(4.5, kind);
  float farG = smoothstep(45., 170., length(Vd));                              // across the bay a crown's underside and its trunk are one ember each
  col += uEmber * (sap * (0.5 + 0.7 * flowS) + resin * 0.9 + underG * (0.12 + 0.2 * ribU) * (1. + 2.2 * farG) + 0.05 * back * leafy * (1. - step(4.5, kind)) + 0.2 * farG * (1. - leafy));
  col += uRim * moonRim(N, V) * mix(1., 0.28, leafy);
  // the canyon's own trees (aInst.y = -2) are seen from above and far off: the crown's top takes the night sky, a dark
  // blue-green dome with pale tips (never a black hole in a ring of red), and the trunk under it is lit by its own blood
  float cany = step(vK.y, -1.5);
  col += (alb * 1.15 + 0.01) * uRim * vec3(0.55, 0.85, 1.3) * leafy * (1. - back * step(4.5, kind)) * (0.45 + 0.55 * clamp(N.y, 0., 1.)) * cany;
  col += uEmber * 0.15 * (1. - leafy) * (1. - 0.6 * farG) * cany;
  col = mix(applySlab(col, vWp, uCamL), col, vKeep);     // vKeep: the one umbrella that must stand dark in the pearl
  gl_FragColor = vec4(max(col, vec3(0.)), 1.);
  #include <fog_fragment>
  gl_FragColor.rgb = mix(farPearl(gl_FragColor.rgb, vWp, uCamL), gl_FragColor.rgb, vKeep);
}`;async function lt(a,s,u,k,g,h){const z=[],H=12.5/Math.sqrt(k),d=u.getSpacedPoints(g?150:90),w=(y,b)=>{let D=1e9;for(const W of d){if(W.y<Y||W.y>Y+15)continue;const o=Math.hypot(W.x-y,W.z-b);o<D&&(D=o)}return D},L=(y,b)=>{let D=1e9;for(const W of d){if(W.y<Y)continue;const o=Math.hypot(W.x-y,W.z-b)+Math.max(W.y-Y-12,0)*.5;o<D&&(D=o)}return D},B=new Map,F=(y,b)=>Math.floor(y/16)+":"+Math.floor(b/16),x=y=>{z.push(y);const b=F(y.x,y.z);B.has(b)||B.set(b,[]),B.get(b).push(y)},R=(y,b,D)=>{const W=Math.floor(y/16),o=Math.floor(b/16);for(let e=-1;e<=1;e++)for(let l=-1;l<=1;l++){const r=B.get(W+e+":"+(o+l));if(r){for(const v of r)if(Math.hypot(v.x-y,v.z-b)<D)return!0}}return!1},A=new _;let U=null,q=1;if(g&&g.axisTrees)for(const y of g.axisTrees){const b={x:y.x,z:y.z,s:y.s,rot:a()*se,lod:0,variant:y.variant??1,scar:-1,phase:a()*se,tint:y.tint??.5,keep:y.keep||0};if(y.scarTo){const D=y.scarTo.x-y.x,W=y.scarTo.z-y.z,o=Math.hypot(D,W)||1;b.rot=0,b.scar=(Math.atan2(D/o,W/o)/se%1+1)%1}x(b)}let S=.44;if(g&&g.resinAt){let y=1e9;for(let b=0;b<=400;b++){const D=u.getPointAt(b/400).distanceTo(g.resinAt);D<y&&(y=D,S=b/400)}}const p=g?g.avenue||22:13,M=g?.9/p:.058;for(let y=0;y<p;y++){let b=.04+y*M;g&&!U&&b<S&&b+M>=S&&(b=S);const D=u.getPointAt(b);if(u.getTangentAt(b,A),s.z(D.x)-D.z<8)break;if(D.y>Y+12)continue;const o=-A.z,e=A.x,l=Math.hypot(o,e)||1,r=!U&&b>=S-1e-6,v=r?1.22:a.range(.92,1.16),N=y%3,K=r?5.5:5.2*v+6.4+a.range(0,1.5),T=r?g&&g.resinSide||1:q,t=D.x+o/l*K*T,i=D.z+e/l*K*T;if(!r&&(s.z(t)-i<5.5*v||R(t,i,9.5)||w(t,i)<5.2*v+5.6)){q=-q;continue}const n={x:t,z:i,s:v,rot:a()*se,lod:0,variant:N,scar:-1,phase:a()*se,tint:a()};if(r){const c=(D.x-t)*.8-A.x*4,f=(D.z-i)*.8-A.z*4,C=Math.hypot(c,f)||1;n.rot=0,n.scar=(Math.atan2(c/C,f/C)/se%1+1)%1,n.variant=0,U={tree:n,normal:new _(c/C,0,f/C),from:D.clone()}}else q=-q;x(n)}const P=-(s.depth+14+185),j=[];for(let y=-412;y<412;y+=H)for(let b=P+8;b<18;b+=H)j.push([y,b]);await h();let I=0;for(const[y,b]of j){++I%60===0&&await h();const D=y+a.range(.1,.9)*H,W=b+a.range(.1,.9)*H,o=a.range(.82,1.18),e=s.z(D)-W,l=a();if(e<3.6||Math.abs(D)>414||e>120&&l>(e>190?.3:.42)||R(D,W,9.3))continue;const r=w(D,W);r<5.3*o+6.6||x({x:D,z:W,s:o,rot:a()*se,lod:2,variant:a.int(0,2),scar:a()<.16?a():-1,phase:a()*se,tint:a(),fd:r,fdAll:L(D,W)})}if(g&&g.clear)for(const y of g.clear)for(let b=z.length-1;b>=0;b--){const D=z[b];D.scar>=0&&D.lod===0||(D.keep||0)>0||U&&U.tree===D||Math.hypot(D.x-y.x,D.z-y.z)<y.r&&z.splice(b,1)}if(g&&g.giants){const y=Ee(He("giants:"+Math.round(s.depth*100)));for(const b of g.giants){for(let D=z.length-1;D>=0;D--){const W=z[D];W.lod===2&&Math.hypot(W.x-b.x,W.z-b.z)<3.4*(b.s+W.s)&&z.splice(D,1)}z.push({x:b.x,z:b.z,s:b.s,rot:y()*se,lod:b.lod??1,variant:b.variant??0,scar:-1,phase:y()*se,tint:b.tint??.35,giant:!0})}}return{trees:z,resin:U,zBack:P}}async function rt(a,s,u,k,g,h,z=null){const w=new Uint8Array(8388608),L=2048/k,B=1024/g;await h();const F=(p,M,P,j)=>{if(p<0||M<0||p>=2048||M>=1024||j<=0)return;const I=(M*2048+p)*4+P;w[I]=Math.min(255,w[I]+j*255)},x=(p,M,P,j)=>p<=0?M:p>=1?0:p<P?M+(j-M)*p/P:j*(1-(p-P)/(1-P)),R=(p,M,P,j,I,y,b,D)=>{for(let W=Math.floor(M-j);W<=Math.ceil(M+j);W++)for(let o=Math.floor(p-P);o<=Math.ceil(p+P);o++){const e=(o+.5-p)/P,l=(W+.5-M)/j,r=Math.sqrt(e*e+l*l);r<1&&F(o,W,I,x(r,y,b,D))}},A=(p,M,P)=>{const j=(M*2048+p)*4+3,I=P*255;I>w[j]&&(w[j]=I)},U=(p,M,P,j,I,y,b)=>{const D=Math.max(Math.floor((Math.min(p,P)-I-s)*L),0),W=Math.min(Math.ceil((Math.max(p,P)+I-s)*L),2047),o=Math.max(Math.floor((Math.min(M,j)-I-u)*B),0),e=Math.min(Math.ceil((Math.max(M,j)+I-u)*B),1023),l=P-p,r=j-M,v=Math.max(l*l+r*r,1e-6);for(let N=o;N<=e;N++){const K=(N+.5)/B+u-M;for(let T=D;T<=W;T++){const t=(T+.5)/L+s-p,i=re((t*l+K*r)/v,0,1),n=t-l*i,c=K-r*i,f=Math.sqrt(n*n+c*c);f<I&&A(T,N,b*re((I-f)/y,0,1))}}};let q=0;for(const p of a){if((z||(++q&1)===0)&&await h(),z){const W=z.depthAt(p.x,p.z),o=p.s,e=N=>Math.min(Math.max(N-W,0)/z.tan,64),l=5.3*o,r=5.7*o,v=7.6*o;l>W+.3&&U(p.x,p.z,p.x+z.dx*e(l),p.z+z.dz*e(l),Math.max(.5*o,.6),.6,.9),v>W+.5&&U(p.x+z.dx*e(r),p.z+z.dz*e(r),p.x+z.dx*e(v),p.z+z.dz*e(v),4.5*o*re((v-W)/2.2,.35,1),1.5,1)}const M=(p.x-s)*L,P=(p.z-u)*B,j=4.6*p.s,I=30*p.s,y=P-.8*B,b=P+I*B,D=!p.giant&&!(p.keep>0)&&(p.fd===void 0||p.fd<30);R(M,P,j*L,j*B,0,1,.8,.95);for(let W=Math.floor(y);W<=Math.ceil(b);W++){const o=(W+.5-P)/(I*B);if(W+.5>=P-.4*B){const N=re((W+.5-(P-.4*B))/(b-(P-.4*B)),0,1),K=O(.6,3.6,N)*L,T=x(o,.95,.4,.5);for(let t=Math.floor(M-K);t<=Math.ceil(M+K);t++)F(t,W,2,T*re(K+.5-Math.abs(t+.5-M),0,1));if(D&&o<.72){const t=O(1.5,5.6,Math.min(N*1.6,1))*L*p.s,i=.3*(1-te(.5,.72,o))*te(0,.05,N);for(let n=Math.floor(M-t);n<=Math.ceil(M+t);n++){const c=(W*2048+n)*4+2;if(n<0||W<0||n>=2048||W>=1024)continue;const f=255*i*re((t+.5-Math.abs(n+.5-M))/3,0,1);f>w[c]&&(w[c]=f)}}}const e=re((W+.5-y)/(b-y),0,1),l=O(.9,4.6,e)*L,r=.75*L,v=x(o,1,.5,.6);for(const N of[-1,1])for(let K=Math.floor(M+N*l-r);K<=Math.ceil(M+N*l+r);K++)F(K,W,1,v*re(r+.5-Math.abs(K+.5-(M+N*l)),0,1))}R(M,P-1.5*B,2.6*L,2*B,1,.9,.5,.5)}const S=new m.DataTexture(w,2048,1024,m.RGBAFormat);return S.flipY=!1,S.wrapS=S.wrapT=m.ClampToEdgeWrapping,S.minFilter=m.LinearMipmapLinearFilter,S.magFilter=m.LinearFilter,S.generateMipmaps=!0,S.needsUpdate=!0,S}const Ce=a=>10*(1-Math.exp(-.9*Math.sqrt(Math.max(a,0))))+.05*a;function ht(a,s){const u=[0];for(let z=1;z<a.length;z++)u.push(u[z-1]+Math.hypot(a[z][0]-a[z-1][0],a[z][1]-a[z-1][1]));const k=u[u.length-1],g=[];let h=0;for(let z=0;z<=s;z++){const H=k*z/s;for(;h<a.length-2&&u[h+1]<H;)h++;const d=re((H-u[h])/Math.max(u[h+1]-u[h],1e-6),0,1);g.push({x:O(a[h][0],a[h+1][0],d),z:O(a[h][1],a[h+1][1],d),a:H})}return g}async function ct(a,s,u,k,g,h,z){const d=[];for(let t=-430;t<=430;t+=1)d.push([t,u.z(t)]);const w=ht(d,136);w.forEach(t=>{t.front=!0});const L=u.z(430),B=u.z(-430),F=w.slice();for(let t=1;t<=11;t++)F.push({x:430,z:O(L,k,t/12)});for(let t=0;t<=21;t++)F.push({x:O(430,-430,t/22),z:k});for(let t=0;t<=11;t++)F.push({x:-430,z:O(k,B,t/12)});const x=F.length;let R=0;for(let t=0;t<x;t++){const i=F[(t+x-1)%x],n=F[(t+1)%x],c=F[t];let f=n.x-i.x,C=n.z-i.z;const J=Math.hypot(f,C)||1;f/=J,C/=J,c.front&&(t===0||t===136)&&(f=1,C=0),c.tx=f,c.tz=C,c.nx=-C,c.nz=f,t>0&&(R+=Math.hypot(c.x-F[t-1].x,c.z-F[t-1].z)),c.s=R}for(let t=0;t<60;t++){let i=w[0].nx,n=w[0].nz;for(let c=1;c<136;c++){const f=w[c],C=(i+2*f.nx+w[c+1].nx)/4,J=(n+2*f.nz+w[c+1].nz)/4;i=f.nx,n=f.nz,f.nx=C,f.nz=J}}for(let t=1;t<136;t++){const i=w[t],n=Math.hypot(i.nx,i.nz)||1;i.nx/=n,i.nz/=n}const A=[];let U=Y;for(;U>.5;){let t=a.range(9,24);U-t<6&&(t=U),A.push({hi:U,lo:U-t,o:a()<.32?a.range(4.5,8):a.range(0,3.2),seed:a()*50}),U-=t}const q=[{y:Y,k:0,f:0}];A.forEach((t,i)=>{const n=t.hi-t.lo,c=Math.max(1,Math.round(n/7.5));i>0&&q.push({y:t.hi-.45,k:i,f:0});for(let f=0;f<c;f++)q.push({y:t.hi-n*(f+.5)/c,k:i,f:.5});t.lo>.5&&q.push({y:t.lo+.45,k:i,f:1})}),q.push({y:0,k:A.length-1,f:1});const S=(t,i)=>A[t].o*(.5+.7*(.5+.5*s.n2(i/80,A[t].seed))),p=t=>{const i=1-Math.abs(s.n2(t/95,9.1));return i*i},M=[],P=[],j=[],I=(t,i,n)=>{const c=Y-i;let f=.05*c+S(n,t.s)+11*p(t.s)*(.3+.7*c/Y)+3*s.fbm3(t.x*.045,i*.045,t.z*.045,3)+1.5;return c>250&&(f+=.016*(c-250)*(c-250)),t.front&&c<105&&(f=O(Math.min(f,Ce(c+g.fogLip)-2.6),f,te(85,105,c))),f*te(0,5,c)},y=q.length;for(let t=0;t<y;t++){const i=q[t],n=i.y/Y;for(let c=0;c<=x;c++){const f=F[c%x],C=Y-i.y,J=i.y+7*Math.sin(Math.PI*n)*s.n2(f.s/260,3.3),ae=I(f,i.y,i.k);M.push(f.x+f.nx*ae,J,f.z+f.nz*ae);let G=1;i.k>0&&i.f<.75&&(G-=(i.f<.25?.62:.3)*re((S(i.k-1,f.s)-S(i.k,f.s))/3.5,0,1)),G*=.86+.14*s.n2(f.s/30,i.y/30),P.push(G,0,f.front?te(115,15,C):0)}(t&1)===1&&await z()}for(let t=0;t<y-1;t++)for(let i=0;i<x;i++){const n=t*(x+1)+i,c=n+1,f=n+x+1,C=f+1;j.push(n,f,c,c,f,C)}let b=M.length/3;const D=12;for(let t=0;t<=D;t++)for(let i=0;i<=136;i++){const n=w[i],c=t/D,f=O(n.z,k,c);M.push(n.x,Y+(t===0||t===D||i===0||i===136?0:.5*s.n2(n.x/14,f/14)),f),P.push(1,0,0)}for(let t=0;t<D;t++)for(let i=0;i<136;i++){const n=b+t*137+i,c=n+1,f=n+137,C=f+1;j.push(n,c,f,c,C,f)}await z();const W=u.cx-u.w1/u.sl,o={x:h?h.x:W+34,z:h?h.z:u.z(W)+92,top:h&&h.top!==void 0?h.top:Y-15,r:20,ph:a()*se};b=M.length/3;const e=26,l=[{y:o.top,k:0,f:0}].concat(q.filter(t=>t.y<o.top-1));for(let t=0;t<l.length;t++)for(let i=0;i<=e;i++){const n=l[t],c=i%e/e*se,f=Math.sin(c),C=Math.cos(c),J=o.top-n.y,ae=900+i*4.6;let G=13+.03*J+S(n.k,ae)*.9*(.5+.5*s.n2(c*1.3+n.k*9.7,n.k*3.3+Math.cos(c)))+4.5*s.fbm3(f*1.6+7,n.y*.03,C*1.6,3);G*=1+.2*Math.sin(c*2+o.ph+n.y*.006)+.12*Math.sin(c*3+o.ph*2.3-n.y*.011),J>235&&(G+=.02*(J-235)*(J-235)),G*=(.5+.5*te(0,9,J))*O(1,h&&h.slim?h.slim:1,te(5,28,J)*(1-te(215,260,J)));const ie=5*Math.sin(n.y*.011+o.ph)*te(0,60,n.y);M.push(o.x+ie+f*G,n.y,o.z+ie*.5+C*G);let oe=1;n.k>0&&n.f<.75&&(oe-=(n.f<.25?.6:.3)*re((S(n.k-1,ae)-S(n.k,ae))/3.5,0,1)),P.push(oe,0,0)}for(let t=0;t<l.length-1;t++)for(let i=0;i<e;i++){const n=b+t*(e+1)+i,c=n+1,f=n+e+1,C=f+1;j.push(n,f,c,c,f,C)}const r=M.length/3;M.push(o.x+5*Math.sin(o.top*.011+o.ph),o.top+1.6,o.z+2.5*Math.sin(o.top*.011+o.ph)),P.push(1,0,0);for(let t=0;t<e;t++)j.push(r,b+t,b+t+1);await z();const v=new m.BufferGeometry;v.setAttribute("position",new m.Float32BufferAttribute(M,3)),await z(),v.setAttribute("color",new m.Float32BufferAttribute(P,3)),await z();const N=new Uint32Array(j.length);for(let t=0;t<j.length;t+=12e4){const i=Math.min(t+12e4,j.length);for(let n=t;n<i;n++)N[n]=j[n];await z()}v.setIndex(new m.BufferAttribute(N,1));const K=v.getAttribute("position").array,T=new Float32Array(K.length);for(let t=0;t<N.length;t+=3){const i=N[t]*3,n=N[t+1]*3,c=N[t+2]*3,f=K[c]-K[n],C=K[c+1]-K[n+1],J=K[c+2]-K[n+2],ae=K[i]-K[n],G=K[i+1]-K[n+1],ie=K[i+2]-K[n+2],oe=C*ie-J*G,de=J*ae-f*ie,ge=f*G-C*ae;T[i]+=oe,T[i+1]+=de,T[i+2]+=ge,T[n]+=oe,T[n+1]+=de,T[n+2]+=ge,T[c]+=oe,T[c+1]+=de,T[c+2]+=ge,t%45e3===44997&&await z()}await z();for(let t=0;t<T.length;t+=3){const i=Math.hypot(T[t],T[t+1],T[t+2])||1;T[t]/=i,T[t+1]/=i,T[t+2]/=i}return v.setAttribute("normal",new m.BufferAttribute(T,3)),await z(),{geo:v,front:w,pin:o,tris:j.length/3}}const ut=`
varying vec3 vCol; varying vec3 vN; varying vec3 vWp;
#include <fog_pars_vertex>
void main(){
  vec4 wp = vec4(position, 1.);
  vWp = wp.xyz; vCol = color; vN = normal;
  vec4 mvPosition = viewMatrix * modelMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ft=`
varying vec3 vCol; varying vec3 vN; varying vec3 vWp;
uniform vec3 uRock; uniform vec3 uGreen; uniform vec3 uFloor; uniform vec3 uCamL; uniform float uFlush;
uniform vec4 uPin;        // the pinnacle's crown: centre x, centre z, top height, radius
uniform vec4 uBlob[12];   // things standing on the rock that shade it: x, z, radius, height of the foot
uniform float uWL;        // water level of the pools on the canyon floor (far below everything when there are none)
#include <fog_pars_fragment>
${De}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float h = uFogP.x - vWp.y;
  float sx = vWp.x + vWp.z * 0.6;
  float warp = texture2D(uNoise, vWp.xz * 0.004 + vWp.y * 0.002).r;
  vec2 bq = vec2(sx * 0.0016, vWp.y * 0.041 + warp * 0.3);
  float bed = texture2D(uNoise, bq).g;
  float bedUp = texture2D(uNoise, bq + vec2(0., 0.004)).g;
  float fine = texture2D(uNoise, vec2(sx * 0.007, vWp.y * 0.31 + warp)).b;
  float camD = distance(uCamL, vWp), nearK = 1. - smoothstep(60., 240., camD);
  float streak = 0.5 * texture2D(uNoise, vec2(sx * 0.0113 + warp * 0.05, vWp.y * 0.0031)).r + 0.5 * texture2D(uNoise, vec2(sx * 0.0057 + 0.37, vWp.y * 0.0023 + warp * 0.02)).b;
  float grain = texture2D(uNoise, vWp.xy * 0.21 + vWp.z * 0.17).b;
  float flatness = smoothstep(0.5, 0.82, N.y);
  N = normalize(N + vec3(0., (bedUp - bed) * 5. + (fine - 0.5) * 0.5, 0.) * (1. - flatness) + vec3(0., 1e-4, 0.));
  float bed2 = texture2D(uNoise, vec2(sx * 0.0031 + 0.5, vWp.y * 0.13 + warp * 0.5)).r;
  float led = smoothstep(0.006, 0.03, bedUp - bed) * (1. - flatness);
  vec3 alb = uRock * (0.42 + 0.5 * bed) * (0.86 + 0.28 * grain) * (0.8 + 0.4 * bed2);
  alb = mix(alb, alb * vec3(1.1, 0.92, 0.74), smoothstep(0.5, 0.8, bed2) * 0.55);
  alb = mix(alb, alb * vec3(0.80, 0.75, 0.72), smoothstep(0.45, 0.75, fine) * 0.55);
  alb *= 1. - 0.1 * smoothstep(0.5, 0.74, streak) * (1. - flatness);
  alb = mix(alb, uRock * vec3(0.98, 0.96, 0.9), flatness * 0.45);
  float veg = smoothstep(0.7, 0.92, N.y) * smoothstep(0.55, 0.85, texture2D(uNoise, vWp.xz * 0.06).g) * smoothstep(3., 8., h) * (1. - smoothstep(215., 250., h));
  alb = mix(alb, uGreen * 1.25, veg * 0.5);
  alb = mix(alb, uRock * 0.9 * (0.75 + 0.4 * grain), smoothstep(235., 270., h) * 0.7);
  float scrubN = texture2D(uNoise, vWp.xz * 0.0019).r * 0.65 + texture2D(uNoise, vWp.xz * 0.011).g * 0.35;
  float scrub = smoothstep(0.42, 0.62, scrubN) * smoothstep(255., 285., h) * flatness * (1. - vCol.g);
  alb = mix(alb, mix(uGreen * 1.5, vec3(0.3, 0.25, 0.13), 0.35 + 0.3 * grain), scrub * 0.6);
  float top = flatness * (1. - smoothstep(1., 4., h));
  float gk = texture2D(uNoise, vWp.xz * 0.085).r, gk2 = texture2D(uNoise, vWp.xz * 0.33).b;
  float grike = (1. - smoothstep(0.0, 0.05 + camD * 0.0004, abs(gk - 0.5))) * (0.25 + 0.75 * nearK);
  vec3 pave = vec3(0.2, 0.192, 0.182) * (0.66 + 0.6 * gk2);
  pave = mix(pave, vec3(0.07, 0.07, 0.065), grike * 0.85);
  float tus = smoothstep(0.6, 0.72, texture2D(uNoise, vWp.xz * 0.052 + 0.3).g);
  pave = mix(pave, mix(vec3(0.46, 0.42, 0.27), uGreen * 1.2, max(step(0.55, gk2), uFlush)), tus * 0.75);
  pave = mix(pave, uGreen * 1.5, uFlush * 0.35 * smoothstep(0.4, 0.6, gk2));
  // cushion shrubs painted on the pavement between the real ones: what a hole torn in the fog shows at its bottom
  vec2 cg = vWp.xz * 0.21; vec2 ci = floor(cg), cf = fract(cg) - 0.5;
  float ch = fract(sin(dot(ci, vec2(127.1, 311.7))) * 43758.5453), ch2 = fract(ch * 7.31);
  vec2 co = cf - (vec2(ch2, fract(ch * 3.7)) - 0.5) * 0.5; float cr = length(co) / (0.15 + 0.17 * ch2);
  float cush = (1. - smoothstep(0.55, 1., cr + (gk2 - 0.5) * 0.7 + (gk - 0.5) * 0.5)) * step(0.62, ch) * (1. - smoothstep(90., 220., camD));
  vec3 cushC = mix(uGreen * 1.25, vec3(0.16, 0.17, 0.1), fract(ch * 5.3)) * (0.45 + 0.75 * clamp(1. - cr * cr, 0., 1.)) * (0.6 + 0.8 * gk2);
  pave = mix(pave * (1. - 0.4 * smoothstep(1.5, 0.9, cr) * step(0.62, ch)), cushC, cush * 0.9);
  alb = mix(alb, pave, top);
  // ledge and pinnacle tops: weathered lichen-grey pavement cut by grikes, never bleached
  float topK = flatness * (1. - smoothstep(4., 40., h)) * (1. - top);
  float gkB = texture2D(uNoise, vWp.xz * 0.23 + 0.4).g;
  float grB = max(grike, (1. - smoothstep(0.0, 0.06, abs(gkB - 0.5))) * nearK);
  vec3 ledge = mix(pave * 1.7, uRock * 0.55, 0.45) * (0.7 + 0.6 * gk2);
  ledge = mix(ledge, vec3(0.31, 0.33, 0.29) * (0.7 + 0.6 * grain), smoothstep(0.5, 0.68, texture2D(uNoise, vWp.xz * 0.11 + 0.7).r) * 0.7);
  ledge = mix(ledge, vec3(0.06, 0.055, 0.05), grB * 0.85);
  alb = mix(alb, ledge, topK * 0.85);
  // the pinnacle's crown, passed within twenty metres: weathered grey karst. Clints split by dark grikes a hand wide
  // wherever it lies near level, runnels fluting the steep faces, crust lichen and rust in patches, solution pits
  vec2 pq = vWp.xz - uPin.xy; float pdist = length(pq);
  float crownK = (1. - smoothstep(uPin.w, uPin.w + 6., pdist)) * smoothstep(uPin.z - 20., uPin.z - 10., vWp.y) * step(vWp.y, uPin.z + 6.);
  if (crownK > 0.001) {
    float nearC = 1. - smoothstep(45., 150., camD);
    vec2 wob = vec2(gk, gk2) - 0.5;
    vec2 g1 = mat2(0.78, 0.62, -0.62, 0.78) * vWp.xz * 0.62 + wob * 0.5 + vWp.y * 0.21;
    vec2 c1 = floor(g1), f1 = abs(fract(g1) - 0.5);
    float h1 = fract(sin(dot(c1, vec2(91.7, 37.3))) * 43758.5453);
    float w1 = 0.07 + 0.06 * h1 + min(camD, 70.) * 0.0009;
    float e1 = 0.5 - max(f1.x, f1.y), gr1 = 1. - smoothstep(w1 * 0.55, w1, e1), lip1 = smoothstep(w1, w1 * 1.25, e1) * (1. - smoothstep(w1 * 1.5, w1 * 2.6, e1));
    vec2 g2 = mat2(0.94, -0.34, 0.34, 0.94) * vWp.xz * 1.9 + wob * 0.8 + vWp.y * 0.5;
    vec2 f2 = abs(fract(g2) - 0.5);
    float gr2 = (1. - smoothstep(0.04, 0.1, 0.5 - max(f2.x, f2.y))) * step(0.45, h1) * nearC;
    // (the runnels are laid by angle round the crown, twice, each copy faded out round its own seam)
    float angA = atan(pq.y, pq.x + 1e-4), angB = atan(-pq.y, -pq.x + 1e-4), wA = 0.5 + 0.5 * cos(angA);
    float flA = (1. - smoothstep(0.03, 0.12, abs(texture2D(uNoise, vec2(angA * 1.9, vWp.y * 0.021 + 0.3)).b - 0.5))) * 0.75 + (1. - smoothstep(0.02, 0.1, abs(texture2D(uNoise, vec2(angA * 5.3 + 0.4, vWp.y * 0.05)).g - 0.5))) * 0.5 * nearC;
    float flB = (1. - smoothstep(0.03, 0.12, abs(texture2D(uNoise, vec2(angB * 1.9 + 0.5, vWp.y * 0.021 + 0.3)).b - 0.5))) * 0.75 + (1. - smoothstep(0.02, 0.1, abs(texture2D(uNoise, vec2(angB * 5.3 + 0.9, vWp.y * 0.05)).g - 0.5))) * 0.5 * nearC;
    float steep = 1. - smoothstep(0.35, 0.75, N.y);
    float grk = clamp(mix(max(gr1, gr2 * 0.45), mix(flB, flA, wA) * 0.38, steep), 0., 1.) * mix(0.3, 1., nearC);
    float pt = texture2D(uNoise, vWp.xz * 0.83 + vWp.y * 0.61).b, pt2 = texture2D(uNoise, vWp.xz * 0.19 + vWp.y * 0.13 + 0.5).r;
    vec3 karst = vec3(0.262, 0.25, 0.228) * (0.62 + 0.7 * pt2) * (0.8 + 0.4 * h1 * (1. - steep));
    karst = mix(karst, vec3(0.3, 0.33, 0.27), smoothstep(0.5, 0.64, texture2D(uNoise, vWp.xz * 0.07 + vWp.y * 0.05 + 0.2).g) * 0.75);
    karst = mix(karst, vec3(0.36, 0.2, 0.1), smoothstep(0.58, 0.7, texture2D(uNoise, vWp.xz * 0.06 + vWp.y * 0.04 + 0.8).r) * 0.7);
    karst = mix(karst, karst * 1.5 + 0.03, lip1 * (1. - steep) * 0.6 * nearC);
    karst *= 1. - 0.4 * smoothstep(0.6, 0.8, pt) * nearC;
    karst = mix(karst, vec3(0.06, 0.058, 0.065), grk * 0.88);
    float kk = crownK * mix(1., 0.62, steep * (1. - smoothstep(uPin.z - 14., uPin.z - 6., vWp.y)));      // cream is left only on the strata faces below the top
    alb = mix(alb, karst, kk);
    float ta = h1 * 6.2832;
    N = normalize(N + (vec3(pt - 0.5, 0., pt2 - 0.5) * 0.9 + vec3(cos(ta), 0., sin(ta)) * 0.22 * (1. - steep) - vec3(0., grk * 0.5, 0.)) * kk + vec3(0., 1e-4, 0.));
  }
  float fl = flatness * smoothstep(280., 296., h) * vCol.g;
  float damp = smoothstep(0.35, 0.7, texture2D(uNoise, vWp.xz * 0.013 + 0.21).r);
  // the canyon floor in three tones: white limestone flags split by joints, bars of grey gravel, damp ochre flats
  vec2 sq = vWp.xz * 0.15 + (vec2(gk, texture2D(uNoise, vWp.zx * 0.027 + 0.4).g) - 0.5) * 1.1;
  vec2 si = floor(sq), sf = abs(fract(sq) - 0.5);
  float sh1 = fract(sin(dot(si, vec2(41.3, 289.1))) * 43758.5453);
  float joint = 1. - smoothstep(0.012, 0.04 + camD * 0.00035, 0.5 - max(sf.x, sf.y));
  vec3 flo = uFloor * (0.74 + 0.26 * sh1) * (0.8 + 0.26 * grain) * (0.9 + 0.2 * gk2) * (1. - 0.6 * joint * (1. - smoothstep(120., 420., camD))) * (1. - 0.22 * grike);
  float gravel = smoothstep(0.54, 0.63, texture2D(uNoise, vWp.xz * 0.0077 + 0.63).r * 0.72 + texture2D(uNoise, vWp.xz * 0.045 + 0.2).g * 0.28);
  vec3 grav = vec3(0.3, 0.29, 0.275) * (0.5 + 1. * texture2D(uNoise, vWp.xz * 1.1).b) * (0.85 + 0.3 * gk2);
  flo = mix(flo, grav, gravel * 0.9);
  flo = mix(flo, flo * vec3(0.84, 0.76, 0.62), damp * 0.6 * (1. - gravel));
  // the pools' shores (vCol.b: near a pool): the bed dark and wet under the water and for a hand's height above it,
  // then a pale rim of calcite
  float hw = vWp.y - uWL + (gk2 - 0.5) * 0.05;
  float wetM = (1. - smoothstep(0.02, 0.11, hw)) * vCol.b, rimC = smoothstep(0.08, 0.13, hw) * (1. - smoothstep(0.2, 0.36, hw)) * vCol.b;
  flo = mix(flo, vec3(0.8, 0.77, 0.69) * (0.86 + 0.2 * grain), rimC * 0.85);
  flo *= 1. - 0.6 * wetM;
  flo = mix(flo, vec3(0.2, 0.33, 0.3) * (0.6 + 0.6 * grain), (1. - smoothstep(-0.5, 0., hw)) * vCol.b * 0.7);
  alb = mix(alb, flo, fl);
  alb *= 1. - 0.32 * vCol.b * (1. - fl);
  float m = sunMask(vWp), ao = vCol.r;
  // whatever stands on the rock shades its foot and throws a short shadow down-sun
  float occ = 0.;
  for (int i = 0; i < 12; i++) {
    vec4 bl = uBlob[i];
    float dd = length(vWp.xz - bl.xy + uSunDir.xz * bl.z * 0.45) / max(bl.z, 0.01);
    occ = max(occ, (1. - smoothstep(0.7, 1.55, dd)) * (1. - smoothstep(bl.z * 0.5 + 0.6, bl.z * 1.2 + 1.6, abs(vWp.y - bl.w))));
  }
  ao *= 1. - 0.55 * occ;
  m *= 1. - 0.5 * top * smoothstep(0.3, 0.9, uCap.z);
  float wall = smoothstep(2., 7., h);
  m = mix(m, 1., wall) * (1. - 0.8 * occ);      // the pavement lies in the shade of the sheet, except under its holes
  float fsh = floorShade(vWp);
  m *= 1. - 0.45 * fsh;                         // drifting shade of the dissolving cloud on the canyon floor
  float wr = mix(0.13, 0.36, wall * (1. - flatness));
  float ndl = max(dot(N, uSunDir) * (1. - wr) + wr, 0.);
  vec3 lit = uSunCol * ndl * m * mix(0.22, 1., ao) * (1. - 0.72 * led) + uSkyCol * (0.5 + 0.5 * N.y + 0.42 * wall * (1. - N.y)) * (0.35 + 0.65 * ao) * (1. - 0.25 * led) + uBounce * (0.6 - 0.4 * N.y) * ao;
  vec3 col = alb * lit;
  vec3 Vd = uCamL - vWp; vec3 V = Vd / max(length(Vd), 1e-3);
  vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
  col += uSunCol * m * vCol.b * 0.25 * pow(max(dot(N, H), 0.), 24.) * smoothstep(0.6, 0.8, grain);
  col += alb * uRim * moonRim(N, V) * 2.6;                       // night: cliff tops and ledges rimmed silver against the moon
  // night: no face is black. The sky's own deep blue fills every wall (a little more from above and on the side
  // turned to the moon, less in the recess under each bed), so the strata read as form in the dark
  vec3 mh = normalize(vec3(uSunDir.x, 0., uSunDir.z) + vec3(1e-5, 0., 0.));
  float toMoon = dot(N, mh);
  vec3 albN = mix(alb, vec3(dot(alb, vec3(0.3, 0.5, 0.2))), 0.72);
  // the beds by night: level layers some thirteen metres thick that dip gently along the wall. Each has its own tone
  // and is jointed into blocks, each block a shade of its own; under every bed's overhang lies a band of deep shade,
  // and the ledge on top of the bed below takes the sky: layered rock, not one navy face
  float bl = vWp.y * 0.078 + warp * 0.45 + texture2D(uNoise, vec2(sx * 0.0009, 0.37)).a * 1.5;
  float blw = fwidth(bl) + 1e-4, bf = fract(bl), bi = floor(bl), bh = fract(sin(bi * 12.9898) * 43758.5453);
  float bedK = (1. - smoothstep(0.22, 0.6, blw)) * (1. - flatness) * wall;
  float jx = sx * (0.05 + 0.04 * bh) + bh * 37., jr = fract(sin(floor(jx) * 78.233 + bi * 3.17) * 43758.5453);
  float jw = fwidth(jx) + 1e-4, jf = fract(jx), bjoint = (1. - smoothstep(0., 0.03 + jw, min(jf, 1. - jf))) * (1. - smoothstep(0.25, 0.6, jw));
  float under = smoothstep(0.66, 0.9, bf) * bedK;
  float shelf = (1. - smoothstep(0.05, 0.3, bf)) * bedK;
  float bedTone = mix(1., (0.68 + 0.46 * bh + 0.2 * jr) * (1. - 0.36 * bjoint), bedK);
  col += albN * uRim * vec3(0.5, 0.74, 1.42) * (0.3 + 0.22 * N.y + 0.3 * toMoon) * (0.35 + 0.65 * ao) * (1. - 0.45 * led) * (1. - top) * mix(0.55, 1., wall * (1. - fl)) * bedTone * (1. - 0.62 * under) * (1. + 0.4 * shelf);
  // whatever faces up (a ledge, the crown of a spur or of the pinnacle) takes the moonlit sky from above
  col += albN * uRim * vec3(0.56, 0.8, 1.36) * 0.75 * max(N.y, 0.) * (1. - top) * (0.4 + 0.6 * ao) * mix(0.5, 1., wall);
  col += alb * glowAt(vWp, N) * 2.3;                                 // and the stone by the glowing tree on the pinnacle takes its red
  // and the moon picks out the top edge of a bed: a blue-silver rim along the whole of a block, missing where a block
  // has fallen away, strongest where the face turns to the moon or stands under it in the eye's view (close by the
  // edges stay broad and soft; where the beds crowd closer than a pixel the glints melt into a faint sheen)
  float bth = 0.05 + 0.12 * bh, farL = smoothstep(60., 150., camD);
  float bthE = mix(bth, min(bth, blw * 1.25), farL);
  float ledT = smoothstep(0., blw * 1.4, bf) * (1. - smoothstep(bthE, mix(bth * 2.4 + blw * 1.4, bthE + blw * 1.3, farL), bf)) * smoothstep(0.22, 0.4, bh) * (0.45 + 0.55 * bh);
  ledT *= (1. - smoothstep(0.3, 0.7, blw)) * (1. - flatness) * wall;
  float brk = step(0.36, jr) * (1. - bjoint);
  vec2 vh = -V.xz; float bM = max(dot(vh / max(length(vh), 1e-3), mh.xz), 0.);      // how far round toward the moon the eye looks, whatever its pitch
  float moonW = clamp(0.05 + 0.95 * smoothstep(0.1, 0.95, bM) + 0.9 * max(dot(N, uSunDir), 0.), 0., 1.);
  col += uRim * (alb * 1.2 + 0.03) * ledT * (0.5 + 0.5 * ao) * mix(0.5, 1., smoothstep(25., 90., camD)) * (1. - 0.5 * smoothstep(350., 900., camD)) * brk * mix(1., 0.3 + 0.7 * moonW, farL) * 0.85;
  col = applySlab(col, vWp, uCamL);
  float clingK = vCol.b * (1. - smoothstep(3., 24., h)) * smoothstep(-1., 1.5, h) * 0.92 * uView.y * smoothstep(0.3, 0.9, uCap.z) * (0.5 + 0.5 * smoothstep(1., 4., uFogP.y));
  col = mix(col, mix(uFogShade, uFogLit, 0.3 + 0.7 * m), clingK);
  gl_FragColor = vec4(max(col, vec3(0.)), 1.);
  #include <fog_fragment>
  gl_FragColor.rgb = farPearl(gl_FragColor.rgb, vWp, uCamL);
}`;async function pt(a,s,u,k,g,h){const z=[0];{let o=0;for(let e=1;e<=540;e++){const l=e*.5,r=Ce(l),v=O(g.wind,14,te(0,14,l));z.push(z[e-1]+Math.hypot(.5,r-o)/v),o=r}}const H=o=>{const e=re(o*2,0,539.99),l=Math.floor(e);return O(z[l],z[l+1],e-l)},d=()=>({p:[],n:[],uv:[],f:[],t:[],l:[],sd:[],i:[],nv:0}),w=(o,e,l,r,v,N,K,T,t,i,n,c,f,C,J)=>(o.p.push(e,l,r),o.n.push(v,N,K),o.uv.push(T,t),o.f.push(i,n,c,f),o.t.push(C.tx,C.tz),o.l.push(i<.5?e:C.x,i<.5?r:C.z),o.sd.push(J),o.nv++),L=(o,e)=>{const l=new m.BufferGeometry;return l.setAttribute("position",new m.Float32BufferAttribute(o.p,3)),l.setAttribute("normal",new m.Float32BufferAttribute(o.n,3)),l.setAttribute("aUV",new m.Float32BufferAttribute(o.uv,2)),l.setAttribute("aF",new m.Float32BufferAttribute(o.f,4)),l.setAttribute("aT",new m.Float32BufferAttribute(o.t,2)),l.setAttribute("aL",new m.Float32BufferAttribute(o.l,2)),l.setAttribute("aSide",new m.Float32BufferAttribute(o.sd,1)),l.setIndex(o.i),e&&l.computeVertexNormals(),l.boundingSphere=new m.Sphere(new _(0,180,-100),700),l},B=u.length-1,F=Y+g.fogLip,x=d(),R=[1e9,150,118,92,68,48,32,20,10,4,0];for(let o=0;o<R.length;o++)for(let e=0;e<=B;e++){const l=u[e],r=Math.min(R[o],l.z-k),v=(o===0?0:1)*(e===0||e===B?0:1);w(x,l.x,F,l.z-r,0,1,0,l.a,-r/g.wind,0,-r,v,0,l,0)}for(let o=0;o<R.length-1;o++)for(let e=0;e<B;e++){const l=o*(B+1)+e,r=l+1,v=l+B+1,N=v+1;x.i.push(l,v,r,r,v,N)}const A=u[B].a,U=o=>{const e=re(o/A,0,.9999)*B,l=Math.floor(e),r=e-l,v=u[l],N=u[l+1];return{x:O(v.x,N.x,r),z:O(v.z,N.z,r),nx:O(v.nx,N.nx,r),nz:O(v.nz,N.nz,r),tx:O(v.tx,N.tx,r),tz:O(v.tz,N.tz,r),a:o}};await h();const q=x.nv,S=21,p=B*2;for(let o=0;o<=S;o++){o%2===1&&await h();for(let e=0;e<=p;e++){const l=e%2?U((u[(e-1)/2].a+u[(e+1)/2].a)/2):u[e/2],r=94*Math.pow(o/S,2.3),v=Ce(r),N=Ce(r+.25)-v,K=Math.hypot(l.nx,l.nz)||1,T=l.nx/K,t=l.nz/K,i=Math.hypot(.25,N),n=N/i,c=.25/i,f=(o===S?0:1)*(e===0||e===p?0:1),C=O(-.6,.1,te(55,94,r))+.14*s.n2(l.a/110,4.4)*te(40,80,r);w(x,l.x+T*v,F-r,l.z+t*v,T*c,n,t*c,l.a,H(r),1,r,f,C,l,0)}}for(let o=0;o<S;o++)for(let e=0;e<p;e++){const l=q+o*(p+1)+e,r=l+1,v=l+p+1,N=v+1;x.i.push(l,v,r,r,v,N)}await h();const M=d(),P=7,j=12;for(let o=0;o<P;o++){await h();const e=Math.max(0,A*o/P-50+a.range(-20,20)),l=Math.min(A,e+A/P+120),r=Math.round((l-e)/10.5),v=a(),N=M.nv,K=46+a.range(0,18),T=218+a.range(0,22);for(let t=0;t<=j;t++)for(let i=0;i<=r;i++){const n=i/r,c=U(O(e,l,n)),f=t/j,C=O(K,T,Math.pow(f,.9)),J=Ce(C)+1.5+o%3*2.4+.001*(C-46)*(C-46)*(.5+.9*v)+5*Math.sin(c.a*.027+o*1.7)*te(50,150,C)+6*s.n2(c.a/60,C/60+o*5),ae=te(0,.22,n)*te(1,.78,n)*te(0,.1,f)*(t===j?0:1),G=O(-.3,.48,te(92,142,C))+.32*te(142,T,C)+.14*s.n2(c.a/110,o*3.1)*te(84,130,C);w(M,c.x+c.nx*J,F-C,c.z+c.nz*J,c.nx,0,c.nz,c.a+o*37,H(C)+o*1.9,2,C,ae,G,c,0)}for(let t=0;t<j;t++)for(let i=0;i<r;i++){const n=N+t*(r+1)+i,c=n+1,f=n+r+1,C=f+1;M.i.push(n,f,c,c,f,C)}}await h();const I=d(),y=8;for(let o=0;o<150;o++){o%25===24&&await h();const e=U(a.range(.03,.97)*A),l=a.range(112,196),r=Math.min(a.range(45,88),250-l),v=a.range(6,14),N=a.range(.4,1.4),K=a.range(2,12),T=a()*se,t=I.nv;for(let i=0;i<=y;i++){const n=i/y,c=l+r*n,f=Ce(c)+K+.001*(c-46)*(c-46)*N,C=3*Math.sin(i*.9+T)*n,J=e.x+e.nx*f+e.tx*C,ae=e.z+e.nz*f+e.tz*C,G=O(v,v*.38,Math.pow(n,.8)),ie=te(0,.2,n)*(i===y?0:1),oe=O(.28,.78,n);for(const de of[-1,1])w(I,J,F-c,ae,e.nx,0,e.nz,e.a+o*53+de*G,H(c)+o*.7,3,c,ie,oe,e,de*G)}for(let i=0;i<y;i++){const n=t+i*2;I.i.push(n,n+2,n+1,n+1,n+2,n+3)}}await h();const b=L(x,!1);await h();const D=L(M,!0);await h();const W=L(I,!1);return await h(),{sheet:b,curtains:D,streamers:W,tris:(x.i.length+M.i.length+I.i.length)/3,lipAt:U,A}}const dt=`
attribute vec2 aUV; attribute vec4 aF; attribute vec2 aT; attribute vec2 aL; attribute float aSide;
varying vec2 vUV; varying vec4 vF; varying vec3 vWp; varying vec3 vN; varying vec3 vX; varying float vS; varying float vAx;
uniform vec3 uCamL; uniform vec2 uFwd;
#include <fog_pars_vertex>
${De}
// metres by which the lip's line rises and sinks along its length a: slow swells and lumps six metres long that
// travel with the wind, so the edge against the sea haze is never ruled
float lipLump(float a){
  float b1 = textureLod(uNoise, vec2(a * 0.011, uTime * 0.07), 0.).a - 0.5;
  float b2 = textureLod(uNoise, vec2(a * 0.043 + 0.5, uTime * 0.13), 0.).r - 0.5;
  return (b1 * 2.4 + b2 * 2.1) * mix(0.4, 1., deepK());
}
void main(){
  vec3 p = position; float mode = aF.x; vec3 nrm = normal;
  // the near river (aF.w = 1): a fan of rings laid round the eye each frame, far ring first, and raised into the
  // relief that the fragment shader lights, so that crests overlap, troughs hide and the wakes and holes are hollows
  float nearM = step(0.5, aF.w) * (1. - step(0.5, mode));
  vec2 L2 = aL; vec2 uvN = aUV; float gN = -aF.y;
  if (nearM > 0.5) { L2 = uCamL.xz + vec2(-uFwd.y, uFwd.x) * position.x + uFwd * position.z; p.xz = L2; gN = lipZf(L2.x) - L2.y; uvN = vec2(L2.x, -gN / max(uCap.y, 1.)); }
  float topLip = fogTop(L2);
  vec3 T3 = vec3(aT.x, 0., aT.y);
  if (mode < 0.5) {
    p.y = topLip + lipLump(aUV.x) * (1. - smoothstep(0., 22., gN)) * (1. - nearM);
    if (nearM > 0.5) {
      float d = length(position.xz);
      float calm = mix(0.32, 1., smoothstep(10., 34., gN)) * (1. - smoothstep(64., 100., d));
      float lod = clamp(log2(max(d, 1.) / 10.) + 3.5, 2., 7.);
      float pil = textureLod(uMask, (L2 - uMaskXf.xy) * uMaskXf.zw, 0.).g;
      float r0 = relief(L2, lod), st = max(1.2, d * 0.09);
      p.y = topLip + (r0 + 0.55 * pil) * calm;
      nrm = normalize(vec3(-(relief(L2 + vec2(st, 0.), lod) - r0) / st * calm, 1., -(relief(L2 + vec2(0., st), lod) - r0) / st * calm));
    }
  }
  else {
    p.y += (topLip - (uFogP.x + uFogP.y)) * exp(-aF.y / 9.) + lipLump(aUV.x) * exp(-aF.y / 7.) * (1. - step(1.5, mode));
    // slow billows ride down the clinging sheet, so its outline against the sky is never a ruled line
    float bl = textureLod(uNoise, vec2(aUV.x * 0.011, (aUV.y - uTime) * 0.33), 0.).a - 0.5;
    float bl2 = textureLod(uNoise, vec2(aUV.x * 0.043 + 0.5, (aUV.y - uTime) * 0.6), 0.).r - 0.5;
    p += normal * ((bl + 0.2) * 3. * smoothstep(0.02, 5., aF.y) + bl2 * 1.5 * smoothstep(0.02, 2., aF.y)) * (1. - step(1.5, mode));
    float sway = smoothstep(40., 200., aF.y);
    p += vec3(-aT.y, 0., aT.x) * sway * 3. * sin(uTime * 0.31 + aUV.x * 0.021 + aF.y * 0.02) + T3 * sway * 2. * sin(uTime * 0.23 + aUV.x * 0.013 + aF.y * 0.033);
    vec3 cd = p - uCamL; vec3 sd = cross(vec3(0., 1., 0.), cd);
    p += sd / max(length(sd), 1e-3) * aSide;
  }
  vWp = p; vN = nrm; vUV = uvN; vF = vec4(aF.x, mix(aF.y, -gN, nearM), aF.z, mode < 0.5 ? nearM : aF.w); vAx = L2.x;
  vS = aL.x + 0.7 * (aL.y + uLipA.x) * clamp((aL.x - uLipA.w) / 60., -1., 1.);
  float sgn = abs(aSide) > 0. ? sign(aSide) : 0.;
  vX = vec3(dot(uSunDir, T3), mode < 0.5 ? uSunDir.z : -uSunDir.y, sgn);
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,mt=`
varying vec2 vUV; varying vec4 vF; varying vec3 vWp; varying vec3 vN; varying vec3 vX; varying float vS; varying float vAx;
uniform vec3 uCamL; uniform float uVeil; uniform float uDive;
#include <fog_pars_fragment>
${De}
float flowLn(float ax, float fz){
  // (broad soft folds five to fifteen metres across, ten times as long as wide, and a faint silk over them: drawn out sixty to one they read as a stretched texture)
  return 0.5 * texture2D(uNoise, vec2(ax * 0.043, fz * 0.0048)).r + 0.38 * texture2D(uNoise, vec2(ax * 0.019 + 0.31, fz * 0.0031 + 0.5)).g + 0.12 * texture2D(uNoise, vec2(ax * 0.052 + 0.17, fz * 0.0052 + 0.2)).b;
}
void main(){
  float mode = vF.x, h = vF.y;
  float flat0 = 1. - step(0.5, mode);
  // on the wall the noise is drawn out four times along the fall, so the cloud tears into streamers, not blotches
  vec2 q = mix(vec2(vUV.x, (vUV.y - uTime) * 14.), vec2(vWp.x, vWp.z - uTime * uCap.y), flat0);
  vec2 q2 = mix(vec2(vUV.x, (vUV.y - uTime * 1.25) * 14.), vec2(vWp.x, vWp.z - uTime * uCap.y * 1.18), flat0);
  vec2 s1 = mix(vec2(0.012, 0.0016), vec2(0.023, 0.008), flat0), s2 = mix(vec2(0.033, 0.0041), vec2(0.081, 0.03), flat0), s3 = mix(vec2(0.05, 0.0072), vec2(0.29, 0.09), flat0);
  vec2 lo = mix(vX.xy * 9., uSunDir.xz * 5., flat0);
  float n1 = texture2D(uNoise, q * s1).r;
  float n2 = texture2D(uNoise, q2 * s2 + vec2(n1 * 0.06, 0.)).g;
  float n3 = texture2D(uNoise, q * s3).b;
  float dens = n1 * 0.5 + n2 * 0.36 + n3 * 0.14;
  float m1 = texture2D(uNoise, (q + lo) * s1).r;
  float m2 = texture2D(uNoise, (q2 + lo * 0.35) * s2 + vec2(n1 * 0.06, 0.)).g;
  float shade = clamp(0.5 + ((n1 - m1) * 0.6 + (n2 - m2) * 0.4) * mix(1.5, 4.6, flat0) + (n3 - 0.5) * 0.34 * flat0, 0., 1.);
  float m = sunMaskF(vWp);
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 Vd = uCamL - vWp; float dist = length(Vd); vec3 V = Vd / max(dist, 1e-3);
  // the long glassy lines the river draws out as it nears the edge; they carry on over the bend and down the
  // first metres of the wall (one coordinate for both: metres across the flow, metres along it)
  // (three widths of line; toward the lip they are gathered into channels, and each is lit as a low ridge: its
  // flank to the sun bright, its far flank and the trough beside it blue-violet)
  float fz = (vUV.y - uTime) * uCap.y;
  float gLip = flat0 * max(-h, 0.);
  float cvx = vAx + 11. * sin(vAx * 0.043 + 1.3) * (1. - smoothstep(0., 44., gLip)) + (n1 - 0.5) * 1.6;
  float ln = flowLn(cvx, fz), lnX = flowLn(cvx + 2.2, fz);
  float lines = smoothstep(0.3, 0.7, ln);
  float ridge = clamp(0.5 - (lnX - ln) * 5.5 * clamp(mix(vX.x, uSunDir.x, flat0) * 3., -1., 1.), 0., 1.);
  float lineL = mix(lines, ridge, 0.55) * (0.7 + 0.3 * lines);
  // (and broad lanes, metres wide, some thick and bright, some thin and blue: bundles of flow, not ruled lines)
  float lane = texture2D(uNoise, vec2(cvx * 0.043 + 0.2, fz * 0.0016 + 0.4)).a;
  float lipK = clamp(m * (0.42 + 0.62 * lineL), 0., 1.);
  lipK = mix(lipK, lipK * (0.1 + 1.15 * lineL * smoothstep(0.22, 0.7, lane)), uView.z);   // by moonlight: silver crests, deep blue troughs, never one pale sheet
  vec3 lipCol = mix(uFogShade * vec3(0.84, 0.9, 1.06), uFogLit * 1.03, lipK);
  lipCol *= 0.8 + 0.26 * smoothstep(0.32, 0.68, lane);
  vec3 col; float alpha;
  if (mode < 0.5) {
    // the river on the plateau, drawn as cloud: one height field (swells, cauliflower billows, puffs) racing to
    // the lip. Its slope is lit like a cloud top (sun-facing sides white-gold, lee sides and hollows blue-violet),
    // crowns throw round shadows on it, every trunk trails a hollow wake, and torn holes show the pavement.
    float lift = vWp.y - uFogP.x;
    float d2 = distance(vWp.xz, uCamL.xz);
    float glass = smoothstep(-24., -2., h);
    float calm = mix(mix(0.32, 0.7, uView.z), 1., smoothstep(10., 34., -h));    // the river keeps a third of its relief right to the edge (more by moonlight)
    float dK = deepK();
    float lodF = clamp(log2(max(dist, 6.) / 6.) + 1.6, 0., 6.);
    float ee = 0.5 + dist * 0.02;
    float h0 = relief(vWp.xz, lodF), hx = relief(vWp.xz + vec2(ee, 0.), lodF), hz = relief(vWp.xz + vec2(0., ee), lodF);
    vec2 su = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
    float hS = relief(vWp.xz + su * (2.2 + dist * 0.015), lodF + 0.5);
    vec3 wk = texture2D(uMask, (vWp.xz - uMaskXf.xy) * uMaskXf.zw, -0.7).rgb;
    float wakeK = 1. - smoothstep(70., 170., dist);
    vec3 Ns = normalize(vec3(-(hx - h0) / ee * calm * 0.8, 1., -(hz - h0) / ee * calm * 0.8));
    float ndl = dot(Ns, uSunDir);
    float lee = smoothstep(0.1, 1.1, hS - h0) * step(0., uSunDir.y);
    // under the cap cloud the river is pearl-grey with a violet cast, its relief soft; inside the sun break it snaps
    float sunny = sunK(m);
    // (no sun under the cap: there the relief is only a faint darkening of the hollows, or it reads as snow drifts)
    float relK = mix(0.5, 1., sunny) * (1. - 0.15 * uView.z) * (1. - 0.8 * smoothstep(140., 460., dist)) * calm;
    // close by, the river's skin is drawn out by the wind into soft crests a metre or two wide: bright tops, violet troughs
    float cr = texture2D(uNoise, vec2(q.x * 0.13 + n1 * 0.25, q.y * 0.024)).g * 0.65 + texture2D(uNoise, vec2(q2.x * 0.31, q2.y * 0.055) + 0.4).b * 0.35;
    float crestK = (1. - smoothstep(28., 85., dist)) * mix(0.8, 1., sunny);
    // (by moonlight, on the last fifty metres to the edge, the relief is drawn hard: silver crests, troughs in deep shade;
    //  there the skin is round billows a few metres across, not wind-drawn streaks: long hard streaks read as smear in the dark)
    float nL = uView.z * (1. - smoothstep(30., 60., -h));
    float rnd = texture2D(uNoise, vec2(q.x * 0.051 + n1 * 0.2, q.y * 0.034) + 0.15).g * 0.7 + texture2D(uNoise, vec2(q2.x * 0.14, q2.y * 0.09) + 0.4).r * 0.3;
    cr = mix(cr, rnd, nL);
    float lam = clamp(mix(0.7, 0.5, nL) + (((ndl - uSunDir.y) * mix(0.95, 1.8, nL) - mix(0.22, 0.75, nL) * lee) * sunny + h0 * mix(0.12, 0.3, nL) + (smoothstep(0.3, 0.7, cr) - 0.6) * 0.62 * crestK + 0.2 * wk.g * wakeK) * relK * mix(1., 1.6, nL), 0., 1.);
    // crown shadows: thrown well clear of each crown, a round pool of blue-violet a crown wide
    float lowSun = min(1. / max(uSunDir.y, 0.1), 2.4);
    vec2 so = uSunDir.xz * lowSun * max(17. - lift, 10.);
    float sh = texture2D(uMask, (vWp.xz + so - uMaskXf.xy) * uMaskXf.zw, 1.3).r;      // one tap: each shadow is one round disc
    sh = smoothstep(0.16, 0.8, sh) * step(0., uSunDir.y);
    // a low sun lays every trunk and crown out as one long shadow across the mist (painted once, in true projection)
    float lowK = (1. - smoothstep(0.36, 0.48, uSunDir.y)) * step(0., uSunDir.y);
    float shL = texture2D(uMask, (vWp.xz - uMaskXf.xy) * uMaskXf.zw, 0.2).a;
    sh = mix(sh, smoothstep(0.08, 0.5, shL), lowK);
    float key = smoothstep(0.1, 0.9, lam);
    float lightK = mix(0.06 * key, key, sunny) * (1. - 0.88 * sh * sunny);
    vec3 capC = mix(vec3(1.), vec3(0.8, 0.79, 0.93), step(0., uSunDir.y) * (1. - uView.z));   // by day the shade is pearl-grey with a violet cast
    vec3 shadeC = mix(uFogShade * capC, uFogLit, uView.w) * mix(0.56 + 0.48 * lam, 0.7 + 0.26 * lam, max(sunny, uView.z)) * (1. - 0.1 * sh * (1. - sunny));
    col = mix(shadeC, uFogLit * mix(vec3(1.), vec3(1.08, 1., 0.84), sunny * (1. - uView.z)), clamp(lightK, 0., 1.));
    col *= 1. - 0.2 * sh * lowK * (1. - 0.3 * uView.z);                             // (a long shadow is plainly darker, also where the veil is all one tone)
    col = mix(col, lipCol * (1. - 0.4 * sh) * mix(1., 0.45 + 0.75 * smoothstep(-0.55, 0.6, h0 + (cr - 0.5) * 1.3), uView.z), glass * mix(0.88, 0.7, uView.z));
    col *= mix(1., 0.5 + 0.72 * lam, nL * (1. - smoothstep(70., 150., dist)));
    col += uRim * 0.42 * nL * smoothstep(0.52, 0.8, cr) * key * (1. - sh);
    col *= 1. - 0.5 * wk.b * mix(0.72, 1., glass) * wakeK;                                  // the wake every trunk trails downwind: a darker lane
    // night: the moon lays a path of light down the river toward the eye, brightest on the crests, and the blood of
    // every tree lights the mist round its foot like an ember
    vec2 mxz = uSunDir.xz / max(length(uSunDir.xz), 1e-3), vxz = -V.xz / max(length(V.xz), 1e-3);
    float pathK = max(dot(mxz, vxz), 0.); pathK *= pathK; pathK *= pathK; pathK *= pathK; pathK *= pathK;
    col += uHalo * pathK * (0.3 + 0.7 * smoothstep(0.35, 0.7, cr)) * (0.4 + 0.6 * key) * (1. - 0.7 * sh);
    float em = texture2D(uMask, (vWp.xz - uMaskXf.xy) * uMaskXf.zw, 4.).r;
    col += uEmber * 0.2 * smoothstep(0.04, 0.5, em) * (1. - 0.5 * glass) * (1. - 0.75 * smoothstep(50., 190., dist));
    // how much cloud lies under this point of the surface: next to none in the drifting holes and in the wake of
    // each trunk; the eye ray's length through it sets the opacity
    float thin = fogThin(vWp.xz) * (1. - smoothstep(110., 240., dist));
    float thick = max(lift, 0.) * (1. - 0.99 * thin);
    // mist, not a surface: looked down into from just above, the river is half see-through (the pavement, the shrubs
    // and the trunks' feet ghost through it); it thickens to white with distance and as the eye climbs
    float od = thick / max(V.y, 0.1) * mix(0.08 + 0.014 * clamp(uCamL.y - vWp.y, 0., 22.), 1.2, glass * (1. - 0.45 * wk.b)) * mix(1.7, 1., dK);
    float body = 1. - exp(-od);
    body = max(body, 0.52 * (1. - dK) * (1. - thin));        // a knee-deep veil is never clear to the ground
    body *= 1. - 0.7 * (1. - dK) * (1. - smoothstep(12., 44., dist));   // within 25 m of the eye the pavement ghosts through it
    // the deep river too: within fifty metres it is drawn out into racing streaks with half-clear lanes between them: mist, not snow
    float stk = texture2D(uNoise, vec2(q.x * 0.17 + n1 * 0.2, q.y * 0.019) + 0.3).r * 0.6 + texture2D(uNoise, vec2(q2.x * 0.43, q2.y * 0.04) + 0.7).a * 0.4;
    stk = mix(stk, rnd, nL);
    body *= 1. - dK * (1. - smoothstep(14., 60., dist)) * (1. - glass) * (0.3 + 0.52 * (1. - smoothstep(0.34, 0.66, stk)));
    // by day the nearest thirty metres are plainly mist, not a surface: between the streaks whole lanes a few metres
    // wide are clear to the pavement, and the river closes to white only beyond that
    float dayN = dK * (1. - uView.z) * (1. - smoothstep(16., 48., dist)) * (1. - glass);
    float laneN = texture2D(uNoise, vec2(q.x * 0.06 + n1 * 0.15 + 0.5, q.y * 0.011)).g;
    body *= 1. - dayN * (0.22 + 0.62 * smoothstep(0.4, 0.6, laneN));
    // and by day the wake behind each near trunk is a lane open to the ground, two crowns long
    body *= 1. - 0.85 * smoothstep(0.06, 0.5, wk.b) * dK * (1. - uView.z) * (1. - glass) * (1. - smoothstep(45., 120., dist));
    // cloud has no outline: where it thins (the rim of a hole, the lip of a wake) it breaks into puffs, and each
    // crest's far side melts away, so billows overlap as soft layers and never as drifts with an edge
    float fr = texture2D(uNoise, q * 0.21).b * 0.6 + texture2D(uNoise, q2 * 0.53 + 0.3).g * 0.4;
    body *= smoothstep(0., 0.4, body - (fr - 0.3) * 0.55 * mix(0.3, 1., dK) * (1. - glass));
    body *= 1. - smoothstep(0.12, 0.9, thin + (fr - 0.5) * 0.6 * step(0.02, thin)) * (1. - glass);
    float turn = dot(normalize(vN + vec3(0., 1e-4, 0.)), V) / max(V.y, 0.03);
    body *= mix(1., smoothstep(-0.1 + 0.3 * fr, 0.4 + 0.3 * fr, turn), step(0.5, vF.w) * (1. - glass));
    body *= 1. - 0.9 * wk.r * smoothstep(4.2, 5.6, lift);                    // a drowned crown shows through the sheet as a dark island
    alpha = vF.z * smoothstep(0.25, 1.6, lift) * clamp(body, 0., 0.96) * smoothstep(-0.4, 2.2, uCamL.y - vWp.y) * uView.y * smoothstep(1.2, 5.5, dist);
    // the near fan hands over to the flat sheet beyond a hundred metres and along the lip's glassy run (they overlap, never cross-fade)
    alpha *= mix(max(smoothstep(72., 96., d2), 1. - smoothstep(17., 26., -h)), (1. - smoothstep(98., 120., d2)) * smoothstep(8., 17., -h), step(0.5, vF.w));
  } else {
    // the fall: one curtain modelled by long vertical folds, lit on the flanks that face the sun, blue inside
    float th = vF.w;
    float glass = 1. - smoothstep(5., 26., h);
    float w1 = (n1 - 0.5) * 2.2 + (n2 - 0.5) * 1.3;
    float lw = texture2D(uNoise, vec2(vS * 0.0031, 0.37)).a, lw2 = texture2D(uNoise, vec2(vS * 0.0113, 0.71 + h * 0.0009)).r;
    float amp = 0.6 + 1.1 * lw2;
    // the folds billow as they fall: round swells that ride down with the cloud push their edges about, so no fold is a ruled stripe
    float bz = texture2D(uNoise, q * vec2(0.021, 0.011) + 0.27).a, bz2 = texture2D(uNoise, q2 * vec2(0.057, 0.024) + 0.6).r;
    float bw = ((bz - 0.5) * 1.5 + (bz2 - 0.5) * 0.8) * (1. - 0.4 * glass) * mix(1., 0.4, smoothstep(50., 130., h));
    float a1 = vS * 0.122 + 9. * lw + w1 + h * 0.0035 + bw, a2 = vS * 0.27 + 2.1 + 14. * lw - w1 * 0.7 + h * 0.0061 - bw * 1.3, a3 = vS * 0.037 + 0.7;
    float F = (0.6 * sin(a1 + 0.5 * sin(a1)) + 0.25 * sin(a2)) * amp + 0.3 * sin(a3);
    float slope = clamp((0.73 * cos(a1 + 0.5 * sin(a1)) * (1. + 0.5 * cos(a1)) + 0.75 * cos(a2)) * amp * 0.8, -1., 1.);
    // a second, rounder field: slow billows some thirty metres across that ride down with the cloud. Looked down on
    // from close by, or seen along the wall at a grazing angle (the stoop), the fall is drawn from this field: a cascade of soft puffs with lit
    // edges and shadowed hollows, never long streaks fanning out from under the eye
    // (and all through the stoop, uDive: falling beside it, the whole fall is billows)
    float lookDn = max(max(smoothstep(0.3, 0.62, V.y), 1. - smoothstep(0.2, 0.5, abs(dot(N, V)))) * (1. - smoothstep(80., 125., length(Vd.xz))), uDive);
    vec2 qb = vec2(vUV.x + 31. * step(mode, 1.5), (vUV.y - uTime * 0.85) * 14.), lob = vX.xy * 8.;
    float b1 = texture2D(uNoise, qb * vec2(0.016, 0.0075) + 0.13).a;
    float b2 = texture2D(uNoise, qb * vec2(0.047, 0.021) + vec2(b1 * 0.08, 0.3)).r;
    float b3 = texture2D(uNoise, qb * vec2(0.13, 0.055) + 0.5).g;
    float c1 = texture2D(uNoise, (qb + lob) * vec2(0.016, 0.0075) + 0.13).a;
    float c2 = texture2D(uNoise, (qb + lob * 0.4) * vec2(0.047, 0.021) + vec2(b1 * 0.08, 0.3)).r;
    float densB = b1 * 0.44 + b2 * 0.38 + b3 * 0.18;
    float shadeB = clamp(0.5 + ((b1 - c1) * 0.6 + (b2 - c2) * 0.5) * 3.4, 0., 1.);
    float a = smoothstep(th, th + mix(0.42, mix(0.3, 0.2, uDive), lookDn), mix(mix(dens + 0.07 * F, densB + 0.1, lookDn), 0.62, glass * 0.8) + 0.08) * (mode > 2.5 ? mix(0.86, 0.66, lookDn) : mode > 1.5 ? 0.94 : 1.);   // (the billows' soft range is wide: they join into one falling curtain, not separate puffs)
    // strands: the falling cloud is drawn out into ropes a few metres across and threads a metre across, bright where
    // they are thick, with thin veil between them through which the layer behind shows darker: depth, not one drape
    // (the ropes wander with the billows and thicken and thin down their length; in places the fall is all ropes, in
    //  others one smooth veil)
    float stX = vS + bw * 2.6 + 1.8 * sin(h * 0.031 + vS * 0.05);
    float stN = texture2D(uNoise, vec2(stX * 0.071 + (n1 - 0.5) * 0.06, q.y * 0.0013 + 0.3)).r * 0.58 + texture2D(uNoise, vec2(stX * 0.23 + 0.4, q2.y * 0.0031 + lw)).g * 0.42;
    float stZone = smoothstep(0.3, 0.62, texture2D(uNoise, vec2(vS * 0.0047 + 0.6, q.y * 0.00035)).a + 0.25 * uView.z);
    float stK = (1. - glass) * (1. - lookDn) * smoothstep(18., 60., h) * mix(0.55, 1., uView.z) * (0.35 + 0.65 * stZone);
    float strand = smoothstep(0.5, 0.68, stN), stGap = 1. - smoothstep(0.28, 0.48, stN);
    a *= 1. - 0.46 * stGap * stK;
    // the lowest third of the fall tears into separate streamers: long ribbons a few metres wide with clear wall between them
    float deepF = smoothstep(150., 212., h) * (1. - step(2.5, mode)) * (1. - lookDn);
    float rbn = texture2D(uNoise, vec2(vS * 0.047 + (n1 - 0.5) * 0.07, q.y * 0.0009 + 0.3)).r * 0.62 + texture2D(uNoise, vec2(vS * 0.131 + 0.4, q2.y * 0.0017)).g * 0.38;
    float thR = mix(0.42, 0.6, smoothstep(150., 236., h));
    a = mix(a, smoothstep(thR, thR + 0.09, rbn) * (0.5 + 0.5 * smoothstep(0.3, 0.6, dens)) * 0.9, deepF);
    // between 80 and 170 m down the curtains part round the big billows: windows of bare wall, each with a soft lit rim
    float isCurt = step(1.5, mode) * (1. - step(2.5, mode)), bb = b1 + (b2 - 0.5) * 0.34;
    float winH = smoothstep(66., 96., h) * (1. - smoothstep(150., 186., h)) * isCurt;
    float win = smoothstep(0.5, 0.62, bb) * winH, winRim = smoothstep(0.4, 0.5, bb) * (1. - smoothstep(0.5, 0.6, bb)) * winH;
    a *= 1. - 0.92 * win * (1. - 0.75 * uDive);        // (in the stoop the windows are only thinner cloud: seen from beside the fall they were dark blots)
    // seen along its surface from the side the sheet's outline frays; seen from above, down the wall, it stays whole
    float nv = abs(dot(N, V));
    float fray = smoothstep(0., mix(0.34, 0.24, glass), nv + (n2 - 0.5) * mix(0.34, 0.22, glass));
    float ang = mode > 2.5 ? 1. : mix(fray, 1., smoothstep(0.2, 0.55, V.y));
    alpha = a * vF.z * (1. - vX.z * vX.z) * ang * mix(uVeil, min(uVeil * 1.5, 1.), (1. - smoothstep(0.36, 0.48, uSunDir.y)) * (1. - uView.z) * uDive);   // (a thin evening fall seen from beside it in the stoop is still cloud, not a tan haze on the wall)
    alpha *= clamp(uCap.z * 3. - (1. - h / 250.) * 2., 0., 1.);
    alpha *= smoothstep(mix(4., 24., uDive), mix(14., 66., uDive), dist);    // (in the stoop the cloud keeps its distance: seen from a few metres it was a smear across half the frame)
    alpha *= mix(exp(-uFogP.w * max(dist - 40., 0.)), 1., uView.y);          // from inside the fog on the plateau the fall is lost in the pearl
    float facing = 0.6 + 0.4 * clamp(dot(N, uSunDir) * 1.4 + 0.3, 0., 1.);
    float body = smoothstep(th - 0.1, th + 0.6, dens);
    float flank = clamp(0.5 - 0.8 * slope * clamp(vX.x * 2.4, -1., 1.), 0., 1.);
    float model = mix(flank, 0.5 + 0.5 * clamp(F, -1., 1.), 0.3);
    float light = m * facing * (0.12 + 0.95 * mix(model, 0.85, glass * 0.8)) * (0.66 + 0.34 * shade) * (0.72 + 0.3 * body) * (0.94 + 0.22 * (bz2 - 0.5) * (1. - glass));
    light = mix(light, min(light + 0.34, 1.02), winRim * shadeB);
    light = min(light * (1. + (0.5 * strand - 0.22 * stGap) * stK), 1.05);
    light *= mix(1., mode < 1.5 ? 0.74 : mode > 2.5 ? 1.12 : 1., stK);         // the sheet on the wall is the far layer, the streamers the nearest
    light = mix(light, m * facing * (mix(0.4, 0.3, uDive) + mix(0.66, 0.8, uDive) * shadeB) * (0.7 + 0.34 * smoothstep(th - 0.1, th + 0.5, densB)), lookDn);
    // the shade inside the cloud takes the hour: blue-violet under a high sun; under a low one mauve-rose, and lifted
    // toward the lit colour, so no hollow is a grey darker than the wall behind it (that read as smoke)
    float warmK = (1. - smoothstep(0.36, 0.48, uSunDir.y)) * (1. - uView.z);
    vec3 shT = mix(mix(vec3(0.7, 0.8, 1.1), vec3(1.), glass), vec3(1.3, 0.98, 1.02), warmK * (1. - glass));
    // (and under a low sun the fall is cloud in evening light: its lit side pale rose-white, plainly brighter than the
    //  lit wall behind it, its hollows mauve: lit the colour of the wall it read as blown dust)
    float wK = warmK * (1. - glass);
    light = mix(light, 0.26 + 0.8 * light, wK);
    vec3 litC = mix(uFogLit, vec3(1.13, 0.995, 0.99), 0.8 * wK);
    col = mix(mix(uFogShade * shT, litC, 0.24 * warmK), litC, clamp(light, 0., 1.05));
    col = mix(col, uFogShade, (1. - a) * 0.15);
    col = mix(col, lipCol, glass * (1. - step(1.5, mode)));                    // the bend: the same white curve as the river's last metres
    col += uFogLit * 0.14 * glass * pow(1. - nv, 3.) * m;
    float fwd = max(dot(-V, uSunDir), 0.); fwd *= fwd; fwd *= fwd;
    col += uHalo * 0.5 * fwd * fwd;                                           // night: the cloud between the eye and the moon glows
    // night: every rope and every torn edge of a veil is edged silver by the moon
    col += uRim * (0.85 * strand * stK * (0.4 + 0.6 * shade) + 1.1 * a * (1. - a) * (1. - glass) * (0.5 + 0.5 * m));
  }
  gl_FragColor = vec4(max(col, vec3(0.)), clamp(alpha, 0., 1.));
  #include <fog_fragment>
}`,vt=`
attribute vec4 aD; attribute vec2 aK;
uniform float uViewH; uniform vec3 uCamL;
varying vec3 vD; varying float vE;
#include <fog_pars_vertex>
${De}
void main(){
  vec3 p = position; float f = fract(uTime * uCap.w / aD.w + aD.z); float len, w0, al;
  vE = -1.;
  if (aK.y < 0.5) { p.y -= f * f * aK.x; p.z += f * f * 0.9; len = 0.12 + 0.55 * f; w0 = 0.014; al = smoothstep(0., 0.06, f) * (1. - smoothstep(0.85, 1., f)); }
  else {
    // a seep thread: a broken string of falling drops, never longer than a sixth of the frame's height, tapering to
    // nothing at both ends, and gone when it is seen nearly end-on (down the wall in the stoop it drew a ruled line)
    vec3 toC = uCamL - position; float dC = length(toC);
    len = min(aK.x, 0.17 * dC + 1.5); w0 = 0.08; vE = aD.y;
    al = 0.7 * (1. - smoothstep(0.5, 0.8, abs(toC.y) / max(dC, 1e-3)));
  }
  float m = sunMask(p);
  p.y -= aD.y * len;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(p, 1.);
  vec4 clip = projectionMatrix * mvPosition;
  float px = max(clip.w, 0.) * 3. / max(uViewH * projectionMatrix[1][1], 1.);
  float w = max(w0, px);
  mvPosition.x += aD.x * w * 0.5;
  gl_Position = projectionMatrix * mvPosition;
  al *= mix(exp(-uFogP.w * max(clip.w - 30., 0.)), 1., smoothstep(0.6, 1., uView.y));          // lost in the pearl while we fly inside the fog
  if (aK.y < 0.5) al *= 1. - smoothstep(70., 170., clip.w);               // a leaf drip is a near thing: far off, a row of them drew a dotted line
  vD = vec3(aD.y * len * step(0.5, aK.y) + aD.z * 31., al * clamp(w0 / w, mix(0.3, 0.07, step(0.5, aK.y)), 1.), m);
  #include <fog_vertex>
}`,wt=`
varying vec3 vD; varying float vE;
#include <fog_pars_fragment>
${De}
void main(){
  // (a leaf drip, vE = -1, keeps its faint pulse; a seep thread, vE running 0..1 down it, is beads with clear gaps between them)
  float seep = step(-0.5, vE);
  float ph = fract(vD.x * 0.42 - uTime * 2.3);
  float bead = smoothstep(0., 0.14, ph) * (1. - smoothstep(0.3, 0.46, ph));
  float dash = mix(0.55 + 0.45 * smoothstep(0.3, 0.6, fract(vD.x * 0.16 - uTime * 1.4)), bead * sin(3.14159 * clamp(vE, 0., 1.)), seep);
  vec3 col = uSkyCol * 1.5 + uSunCol * vD.z * 0.75;
  gl_FragColor = vec4(max(col, vec3(0.)), clamp(vD.y * dash, 0., 1.));
  #include <fog_fragment>
}`;function xt(a,s,u){const k=s.length+u.length,g=new Float32Array(k*12),h=new Float32Array(k*16),z=new Float32Array(k*8),H=[];let d=0;const w=(B,F,x)=>{const R=a(),A=x?1:a.range(1.1,2.6);for(let U=0;U<4;U++)g.set([B.x,B.y,B.z],d*12+U*3),h.set([U%2?1:-1,U<2?0:1,R,A],d*16+U*4),z.set([F,x],d*8+U*2);H.push(d*4,d*4+2,d*4+1,d*4+1,d*4+2,d*4+3),d++};for(const B of s)w(B,B.fall,0);for(const B of u)w(B,B.fall,1);const L=new m.BufferGeometry;return L.setAttribute("position",new m.BufferAttribute(g,3)),L.setAttribute("aD",new m.BufferAttribute(h,4)),L.setAttribute("aK",new m.BufferAttribute(z,2)),L.setIndex(H),L}async function zt(a,s={}){const u=a.rng.fork?a.rng.fork("fogfall"):a.rng,k=a.noise,g=Array.isArray(s.palette)&&s.palette.length>=7?s.palette:Qe,h=ot(s,g),z=a.quality?.detail??1,H=re(s.density??1,.6,1.4),d=V=>new m.Color(V),w=tt(u),L=new m.Group;L.name="fogfall";const B=await et(u,256,()=>a.yield());await a.yield();const F=w.cx+u.range(15,45),x=u.range(-3,3),R=[[172,96,7],[128,80+x,7],[86,63-x,7],[50,45+x*.5,7],[23,25,7.5],[7,9,8.5],[0,0,9],[-3,-32,4],[-12,-72,-8]],A=typeof s.route=="function"?s.route({L:w,rim:Y}):null,U=new m.CatmullRomCurve3(A?A.points.map(V=>V.clone()):R.map(([V,E,X])=>new _(F+V,Y+X,w.z(F+V)-E)),!1,"centripetal"),q=new _(F,Y+9,w.z(F));await a.yield();const{trees:S,resin:p,zBack:M}=await lt(u,w,U,H,A,()=>a.yield());await a.yield();const P=-440,j=M-6,I=880,y=26-j,b=h.sunDir.y>.03&&h.sunDir.y<.48,D=Math.hypot(h.sunDir.x,h.sunDir.z)||1,W=await rt(S,P,j,I,y,()=>a.yield(),b?{dx:-h.sunDir.x/D,dz:-h.sunDir.z/D,tan:h.sunDir.y/D,depthAt:(V,E)=>{const X=w.z(V)-E;return O(h.fogLip,h.fogBack,te(105,235,X))*O(.55,1,te(0,24,X))*.92}}:null);await a.yield();const o={set:!1,x:F+70,z:w.z(F)-95},e={uSunDir:{value:h.sunDir.clone()},uSunCol:{value:h.sunCol},uSkyCol:{value:h.sky},uBounce:{value:h.bounce},uFogLit:{value:h.fogLit},uFogShade:{value:h.fogShade},uBreak:{value:new m.Vector4(o.x,o.z,1/150,1/90)},uFogP:{value:new m.Vector4(Y,h.fogLip,h.fogBack,h.weather==="thin"?.22:.3)},uLipA:{value:new m.Vector4(w.depth,w.w0,w.w1,w.cx)},uLipB:{value:new m.Vector4(w.sl,w.sr,w.p1,w.p2)},uCap:{value:new m.Vector4(h.cap,h.wind,1,h.dripRate)},uDive:{value:0},uHole:{value:new m.Vector4(0,0,1/196,0)},uView:{value:new m.Vector4(0,1,0,0)},uTime:{value:0},uNoise:{value:B},uCamL:{value:new _(0,Y+50,400)},uMask:{value:W},uMaskXf:{value:new m.Vector4(P,j,1/I,1/y)},uFwd:{value:new m.Vector2(0,-1)},uEmber:{value:h.night?new m.Color(1,.04,.03):new m.Color(0,0,0)},uRim:{value:h.night?new m.Color(.33,.38,.52):new m.Color(0,0,0)},uHalo:{value:h.night?new m.Color(.42,.37,.3):new m.Color(0,0,0)},uGlowP:{value:new m.Vector4(0,-5e3,0,1)}},l=(V,E,X,ee={})=>new m.ShaderMaterial({uniforms:{...m.UniformsUtils.clone(m.UniformsLib.fog),...e,...X},vertexShader:V,fragmentShader:E,fog:!0,...ee});await a.yield();const r=await ct(u,k,w,M,h,A&&A.pinnacle,()=>a.yield()),v=5*Math.sin(r.pin.top*.011+r.pin.ph),N=[];for(let V=0;V<12;V++)N.push(new m.Vector4(0,0,0,0));const K=new m.Mesh(r.geo,l(ut,ft,{uRock:{value:d(g[1])},uGreen:{value:d(g[2])},uFloor:{value:d("#ddd3bd")},uFlush:{value:h.season==="november"?1:0},uPin:{value:new m.Vector4(r.pin.x+v,r.pin.z+v*.5,r.pin.top,22)},uBlob:{value:N},uWL:{value:-1e3}},{vertexColors:!0}));L.add(K),await a.yield();const T=d(g[2]),t={bark:d("#a89f92").multiplyScalar(.74),leafDark:T.clone().multiplyScalar(.68),leafLight:T.clone().lerp(d("#7fae95"),.3).multiplyScalar(.9),lichen:d("#8d9a8c"),spray:h.season==="november"?d("#e0782a"):h.season==="summer"?T.clone().lerp(d("#93b392"),.4):d("#e4dcba").lerp(T,.4).multiplyScalar(.8)};t.leafMid=t.leafDark.clone().lerp(t.leafLight,.34),t.leafShell=t.leafDark.clone().lerp(t.leafLight,.12).multiply(new m.Color(.8,.96,1.08));const i=l(nt,it,{uResin:{value:d(g[5])}},{vertexColors:!0,side:m.DoubleSide}),n=[[],[],[]];let c=0;for(let V=0;V<3;V++)for(let E=0;E<3;E++)n[V].push($e(u,V,t,V===0&&E===0)),await a.yield();{const V=Ee(He("fine:"+a.seed));for(const E of[!0,!1]){const X=$e(V,0,t,E,!0,!0);await a.yield(),n[0].push(X()),await a.yield()}p&&(p.tree.variant=3);for(const E of S)(E.keep||0)>.8&&(E.variant=4)}{const V=S.filter($=>$.lod===2).sort(($,ne)=>$.fd-ne.fd);let E=S.reduce(($,ne)=>$+(ne.lod===0?n[0][ne.variant].tris:0),0),X=0;for(;X<V.length&&V[X].fd<26;X++){const $=n[0][V[X].variant].tris;if(E+$>(s.hiTris||56e3))break;E+=$,V[X].lod=0}const ee=V.slice(X).sort(($,ne)=>$.fdAll-ne.fdAll);for(let $=0;$<(s.midCount||52)&&$<ee.length;$++)ee[$].lod=1}const f=new m.Matrix4,C=new m.Quaternion,J=new _(0,1,0),ae=new _,G=new _,ie=[];for(let V=0;V<3;V++)for(let E=0;E<n[V].length;E++){const X=S.filter(Z=>Z.lod===V&&Z.variant===E);if(!X.length)continue;const ee=n[V][E],$=new m.InstancedMesh(ee.geo,i,X.length),ne=new Float32Array(X.length*4);X.forEach((Z,le)=>{C.setFromAxisAngle(J,Z.rot),f.compose(G.set(Z.x,Y-(Z.giant?.5:.15),Z.z),C,ae.set(Z.s,Z.s,Z.s)),$.setMatrixAt(le,f),ne.set([Z.phase,Z.scar,Z.tint,Z.keep||0],le*4),Z.r=ee.R*Z.s,Z.h=ee.top*Z.s,Z.trunkR=ee.trunkR*Z.s;const me=V===0?Math.round(40*z):V===1?2:0;for(let Q=0;Q<me;Q++){if(V===0)G.copy(ee.tips[u.int(0,ee.tips.length-1)]),G.x+=u.range(-.5,.5),G.z+=u.range(-.5,.5),G.y-=.15,G.applyMatrix4(f);else{const Se=u()*se;G.set(Z.x+Math.cos(Se)*Z.r*.9,Y+(ee.top-1.4)*Z.s,Z.z+Math.sin(Se)*Z.r*.9)}ie.push({x:G.x,y:G.y,z:G.z,fall:Math.max(G.y-Y-h.fogLip*.7,1)})}}),$.geometry.setAttribute("aInst",new m.InstancedBufferAttribute(ne,4)),$.instanceMatrix.needsUpdate=!0,$.computeBoundingSphere(),L.add($),c+=ee.tris*X.length,await a.yield()}const oe=await pt(u,k,r.front,M,h,()=>a.yield());await a.yield();const de=l(dt,mt,{uVeil:{value:h.veil}},{transparent:!0,depthWrite:!1,side:m.DoubleSide,forceSinglePass:!0});[oe.sheet,oe.curtains,oe.streamers].forEach((V,E)=>{const X=new m.Mesh(V,de);X.renderOrder=2+E,L.add(X)});{const E=Math.round(92*(.7+.3*z)),X=78*Math.PI/180,ee=1,$=124;await a.yield();const ne=new Float32Array(105*(E+1)*3),Z=new Float32Array(105*(E+1)*4),le=new Uint32Array(104*E*6);for(let fe=0;fe<=E;fe++){const we=$*Math.pow(ee/$,fe/E);for(let xe=0;xe<=104;xe++){const Ae=(xe/104*2-1)*X,Fe=fe*105+xe;ne[Fe*3]=Math.sin(Ae)*we,ne[Fe*3+2]=Math.cos(Ae)*we,Z[Fe*4+2]=fe===0||xe===0||xe===104?0:1,Z[Fe*4+3]=1}}for(let fe=0,we=0;fe<E;fe++)for(let xe=0;xe<104;xe++,we+=6){const Ae=fe*105+xe,Fe=Ae+1,Re=Ae+104+1,Je=Re+1;le[we]=Ae,le[we+1]=Re,le[we+2]=Fe,le[we+3]=Fe,le[we+4]=Re,le[we+5]=Je}const me=105*(E+1),Q=new m.BufferGeometry,Se=new Float32Array(me*3),je=new Float32Array(me*2);for(let fe=0;fe<me;fe++)Se[fe*3+1]=1,je[fe*2]=1;Q.setAttribute("position",new m.BufferAttribute(ne,3)),Q.setAttribute("normal",new m.BufferAttribute(Se,3)),Q.setAttribute("aUV",new m.BufferAttribute(new Float32Array(me*2),2)),Q.setAttribute("aF",new m.BufferAttribute(Z,4)),Q.setAttribute("aT",new m.BufferAttribute(je,2)),Q.setAttribute("aL",new m.BufferAttribute(new Float32Array(me*2),2)),Q.setAttribute("aSide",new m.BufferAttribute(new Float32Array(me),1)),Q.setIndex(new m.BufferAttribute(le,1));const Ue=new m.Mesh(Q,de);Ue.frustumCulled=!1,Ue.renderOrder=2.4,L.add(Ue),oe.tris+=le.length/3}await a.yield();const ge=[],Ne=Math.round((h.weather==="drizzle"?90:34)*z);for(let V=0;V<Ne;V++){const E=r.front[u.int(6,130)],X=u.range(20,215),ee=Ce(Math.min(X,90))+.05*Math.max(X-90,0)+u.range(2,9);ge.push({x:E.x+E.nx*ee,y:Y-X,z:E.z+E.nz*ee,fall:u.range(14,46)})}const pe=new m.Mesh(xt(u,ie,ge),l(vt,wt,{uViewH:{value:1080}},{transparent:!0,depthWrite:!1,side:m.DoubleSide,forceSinglePass:!0}));pe.frustumCulled=!1,pe.renderOrder=6,L.add(pe),await a.yield();const ce=w.z(w.cx),ue=p?p.tree:null,ye={rimY:Y,sunDir:h.sunDir.clone(),lipCross:q,flyThrough:U.getSpacedPoints(16),resinTrunk:ue?{position:new _(ue.x+p.normal.x*ue.trunkR,Y+4.5*ue.s-.15,ue.z+p.normal.z*ue.trunkR),normal:p.normal.clone(),viewFrom:p.from.clone()}:null,fallView:{position:new _(w.cx-15,Y-30,ce+140),lookAt:new _(w.cx,Y-105,ce+10)},aboveFog:new _(F+150,Y+22,w.z(F+150)-88),stoop:[new _(w.cx+60,Y-30,ce+62),new _(w.cx-20,Y-105,ce+66),new _(w.cx-95,Y-185,ce+74),new _(w.cx-150,Y-240,ce+92)],pinnacle:{top:new _(r.pin.x,r.pin.top+1.6,r.pin.z),ledge:new _(r.pin.x+6,r.pin.top+.6,r.pin.z+5),radius:r.pin.r},portalSeat:{position:new _(w.cx-40,8,330),facing:new _(0,0,-1)},trees:S.map(V=>({x:V.x,z:V.z,r:V.r,h:V.h,lod:V.lod,giant:!!V.giant})),lipZ:V=>w.z(V)},be=new _(0,165,-80),ze=340,he=312,Ve=new _,ke=new m.Vector2,Me=new m.Matrix4;return{object:L,radius:ze,height:he,center:be,anchors:ye,ground:!0,groundY:0,uniforms:e,glsl:De,materials:{rock:K.material,tree:i,fog:de},lip:w,zBack:M,pinnacle:r.pin,stats:{triangles:Math.round(c+r.tris+oe.tris+(ie.length+ge.length)*2),trees:S.length},setSunBreak(V,E,X=150,ee=90){o.set=!0,e.uBreak.value.set(V,E,1/Math.max(X,1),1/Math.max(ee,1))},setSupply(V){e.uCap.value.z=re(V,0,1)},addTrees(V){const E=[];for(let X=0;X<2;X++)for(let ee=0;ee<3;ee++){const $=V.filter(Q=>(Q.lod||0)===X&&(Q.variant||0)%3===ee);if(!$.length)continue;const ne=n[X][ee],Z=ne.geo.clone(),le=new m.InstancedMesh(Z,i,$.length),me=new Float32Array($.length*4);$.forEach((Q,Se)=>{C.setFromAxisAngle(J,Q.rot||0),f.compose(G.set(Q.x,Q.y,Q.z),C,ae.set(Q.s,Q.s,Q.s)),le.setMatrixAt(Se,f),me.set([Q.phase||0,-2,Q.tint??.4,0],Se*4),Q.r=ne.R*Q.s,Q.h=ne.top*Q.s}),Z.setAttribute("aInst",new m.InstancedBufferAttribute(me,4)),le.instanceMatrix.needsUpdate=!0,le.computeBoundingSphere(),L.add(le),E.push(le)}return E},setSun(V,E){L.updateWorldMatrix(!0,!1),Me.copy(L.matrixWorld).invert(),e.uSunDir.value.copy(V).transformDirection(Me),E&&e.uSunCol.value.copy(E)},update(V,E,X){if(e.uTime.value=E,X){Ve.setFromMatrixPosition(X.matrixWorld),L.updateWorldMatrix(!0,!1),e.uCamL.value.copy(Ve).applyMatrix4(Me.copy(L.matrixWorld).invert());const ee=X.matrixWorld.elements,$=-ee[8],ne=-ee[10],Z=Math.hypot($,ne);Z>.05&&e.uFwd.value.set($/Z,ne/Z)}o.set||e.uBreak.value.set(o.x,o.z+45*Math.sin(E*.08),1/150,1/90),a.renderer&&(a.renderer.getDrawingBufferSize(ke),pe.material.uniforms.uViewH.value=ke.y)},dispose(){}}}export{zt as buildHero};
