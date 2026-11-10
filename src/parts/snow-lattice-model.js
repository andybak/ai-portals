import*as P from"three";const te=9.6,ue=te*Math.sqrt(3),j=ue*Math.sqrt(3)/2,X=ue/2,fe=te*3/(2*Math.SQRT2),se=fe*8/3,Ae=2,Ce=1.2,Oe=.36,ye=.62,ht=20,he=6.6,_e=.4,Be=[1/16,7/16,9/16,15/16],Ke=[[1,0],[-.5,Math.sqrt(3)/2],[-.5,-Math.sqrt(3)/2]],Ye=2*Math.SQRT2/3,xe=[];for(let f=0;f<4;f++){const L=f<2?1:-1,p=f===0||f===2?1:-1;xe.push(new P.Vector3(0,0,p));for(let T=0;T<3;T++)xe.push(new P.Vector3(L*Ke[T][0]*Ye,L*Ke[T][1]*Ye,-p/3))}const Dt={RING:te,A_LAT:ue,DX:j,LAYER:X,BOND:fe,C_LAT:se,R_O:Ae,R_H:Ce,R_ROD:Oe,R_COIL:ye,ZC:Be,BONDS:xe},Ie=["#D8382B","#F3EBD7","#B88A3A","#9AA4AE","#DCE9F4","#E7C3C4","#1F3F7A"];function ut(f=Ie){const L=Ie.map((b,x)=>new P.Color(f[x]||b)),p=new P.Vector3(.765,.469,-.441).normalize(),T=new P.Vector3(.62,.66,-.42).normalize(),v=new P.Vector3().crossVectors(new P.Vector3(0,1,0),T).normalize(),l=new P.Vector3().crossVectors(T,v).normalize(),V=[];for(let b=0;b<8;b++)V.push(new P.Vector3(.45,.5,.74).normalize());const N=[],B=[];for(let b=0;b<8;b++)N.push(new P.Vector4(0,0,0,0)),B.push(new P.Vector3(0,0,1));return{palette:L,uniforms:{uClock:{value:0},uTime:{value:0},uSun:{value:p},uWinX:{value:v},uWinY:{value:l},uWinZ:{value:T},uPal:{value:L},uBond:{value:xe},uGlide:{value:V},uFileP:{value:N},uFileD:{value:B},uHelix:{value:new P.Vector4(0,1e6,0,0)},uHaze:{value:new P.Vector4(480,300,1500,.93)},uPxH:{value:400},uRelay:{value:new P.Vector4(-200,45,5,.35)},uShow:{value:[he,he,he,he,he,he,he,he]},uBar:{value:new P.Vector4(.158,.099,.982,se)},uBarK:{value:new P.Vector2(1,0)},uRT:{value:0},uMouth:{value:new P.Vector4(0,1e6,0,1)},uTierX:{value:1e6},uGuest:{value:new P.Vector2(58,84)},uNear:{value:new P.Vector2(-2,-1)}}}}const ge=`
uniform float uClock, uTime, uPxH;
uniform vec3 uSun, uWinX, uWinY, uWinZ;
uniform vec3 uPal[7];
uniform vec3 uBond[16];
uniform vec3 uGlide[8];
uniform vec4 uHaze, uRelay, uHelix, uBar;
uniform vec2 uBarK, uNear, uGuest;
uniform vec4 uMouth;
uniform float uRT, uTierX;
uniform float uShow[8];
uniform vec4 uFileP[8];
uniform vec3 uFileD[8];
float slmHash(float n){ return fract(sin(n * 12.9898 + 4.1414) * 43758.5453); }
vec4 slmQuat(vec3 ax, float a){ float h = a * 0.5; return vec4(ax * sin(h), cos(h)); }
vec4 slmQmul(vec4 a, vec4 b){ return vec4(a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz), a.w * b.w - dot(a.xyz, b.xyz)); }
vec3 slmRot(vec4 q, vec3 v){ return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
vec3 slmUnrot(vec4 q, vec3 v){ return slmRot(vec4(-q.xyz, q.w), v); }
// distance pales and cools: toward sky first, toward rose far away
vec3 slmAerial(vec3 col, float dist){
  float dn = dist / max(uHaze.x, 1.0);
  float f = (1.0 - exp(-0.9 * dn * dn * sqrt(dn))) * uHaze.w;      // a thing of distance: nothing within a fifth of the haze length is veiled, by its whole length vermilion is rose
  vec3 hz = mix(uPal[4], uPal[5], smoothstep(uHaze.y, uHaze.z, dist));
  return mix(col, hz, f);
}
// the same, for what stands inside a nave (nr.x: distance dims and cools it toward the nave's own rose-grey, never
// toward sky) and for what stands low on the cliff (nr.y: it has gone pale into the rose haze of the hollow)
vec3 slmAerialIn(vec3 col, float dist, vec2 nr){
  if (nr.x < -0.001) { float lm = dot(col, vec3(0.3, 0.5, 0.2)); col = mix(mix(vec3(lm), col, 0.80) * vec3(0.80, 0.74, 0.96) * (1.0 - 0.6 * lm), uPal[5] * vec3(0.17, 0.09, 0.17), min(0.6, -0.5 * nr.x + 0.12 * lm)); }   // (ivory steps back further than vermilion: a tier in shade is one dark cool rose, not lilac)   // a tier standing behind a growing row: wood in shade, a cooler half-tone (never paler than the haze)
  if (nr.y < -0.5) return col;                                                // the upright ring is never hazed
  vec3 a = slmAerial(col, dist);
  if (nr.x > 0.001) {
    vec3 nave = uPal[5] * vec3(0.10, 0.045, 0.085);                             // the dim of the nave: a deep plum, never black
    vec3 b = mix(col * vec3(0.62, 0.60, 0.72), nave, 0.08 + 0.72 * (1.0 - exp(-dist / 90.0)));   // nothing near the eye is milky: distance takes it to the nave's own dim
    a = mix(a, slmAerial(b, dist), nr.x);                                       // (seen from the hollow the real naves pale with distance exactly as the painted ones do)
  }
  return mix(a, mix(uPal[5], vec3(1.0), 0.30), nr.y * smoothstep(24.0, 120.0, dist));   // the hollow's haze is a thing of distance
}
float slmNear(float d){ return smoothstep(uNear.x, uNear.y, d); }
float slmGuestFar(float d){ return 1.0 - smoothstep(uGuest.x, uGuest.y, d); }   // a guest too far off to read as two balls on a rod is not there: it eases in, whole
`,qe=`
// the one window highlight: r = reflected view ray (unit). Rounded tall pane with a faint cross-bar.
float slmWindow(vec3 r, float soft){
  float z = dot(r, uWinZ);
  vec2 p = vec2(dot(r, uWinX), dot(r, uWinY)) / max(z, 0.05);
  vec2 hs = vec2(0.34, 0.54);
  vec2 q = abs(p) - hs + 0.06;
  float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.06;
  float aa = clamp(fwidth(p.x) + fwidth(p.y), 0.004, 0.035) + soft;
  float pane = (1.0 - smoothstep(-aa, aa, sd)) * step(0.05, z);
  float bar = min(abs(p.y - 0.09), abs(p.x));
  pane *= 1.0 - 0.55 * (1.0 - smoothstep(0.03, 0.03 + aa, bar));
  return pane;
}
// lacquer: full colour on the lit side, a cooler bluer half-tone away from it, never black; shade = baked depth 0..1
vec3 slmLacquer(vec3 base, vec3 n, vec3 v, float shade, float gloss){
  float hl = 0.5 + 0.5 * dot(n, uSun);
  vec3 cool = base * vec3(0.40, 0.40, 0.60) + uPal[4] * 0.035;   // (FIX 7: linear values: on the screen the side away from the key is two thirds of the lit side and bluer, so any still says where the light comes from)
  vec3 col = mix(cool, base, smoothstep(0.17, 0.60, hl));
  float g = dot(col, vec3(0.3, 0.5, 0.2));
  vec3 deep = mix(vec3(g), col, 0.60) * vec3(0.37, 0.34, 0.50) + uPal[5] * 0.035;
  col = mix(col, deep, shade);
  float fr = 1.0 - max(dot(n, v), 0.0); fr *= fr; fr *= fr;
  col = mix(col, uPal[4], fr * 0.38 * (1.0 - 0.75 * shade));       // the rim of reflected sky belongs to a ball in the open
  vec3 r = reflect(-v, n);
  col = mix(col, vec3(1.0, 1.0, 0.98), slmWindow(r, 0.0) * gloss * (1.0 - 0.62 * shade));
  return col;
}
`,Ge=2.2,We=.3,Je=2,et=40,vt=Math.max(Ge,1)+We,Ue=`
void slmMolecule(vec3 site, vec4 dock, out vec3 c, out vec4 q, out float sc){
  float seed = dock.y;
  vec3 a1 = vec3(slmHash(seed + 1.0), slmHash(seed + 2.0), slmHash(seed + 3.0)) - 0.5;
  vec3 a2 = vec3(slmHash(seed + 5.0), slmHash(seed + 6.0), slmHash(seed + 7.0)) - 0.5;
  a1 /= max(length(a1), 1e-3); a2 /= max(length(a2), 1e-3);
  float w = (0.2 + 0.3 * slmHash(seed + 4.0)) * 6.2832;
  int gi = int(clamp(dock.w, 0.0, 7.0) + 0.5);
  vec3 G = uGlide[gi];
  vec3 sd = cross(G, vec3(0.0, 1.0, 0.0)); sd /= max(length(sd), 1e-3);
  c = site; q = vec4(0.0, 0.0, 0.0, 1.0); sc = 1.0;
  if (dock.x > 9000.0) {
    float ph = uTime * (0.045 + 0.05 * slmHash(seed + 8.0)) + seed * 6.2832;
    float R = dock.z;
    c += (G * sin(ph) * ${Ge.toFixed(1)} + sd * cos(ph) + vec3(0.0, ${We.toFixed(1)}, 0.0) * sin(ph * ${Je.toFixed(1)} + seed * ${et.toFixed(1)})) * R;
    q = slmQmul(slmQuat(a1, w * uTime + seed * 50.0), slmQuat(a2, 0.41 * w * uTime));
  } else if (dock.x > 8000.0) {
    float ph = uTime * (0.9 + 0.5 * slmHash(seed + 8.0)) + seed;
    float tap = clamp(sin(ph) * 2.5, -1.0, 1.0); tap *= 1.5 - 0.5 * tap * tap;
    c += a1 * tap * dock.z;
    q = slmQuat(a2, uTime * 0.6 + seed * 9.0);
  } else if (dock.x > -900.0) {
    float tau = dock.x - uClock;
    if (tau > 0.0) {
      float g = ${ht.toFixed(1)} * tau * tau / (tau + 1.2);
      float sw = smoothstep(0.25, 1.7, tau);
      vec4 FP = uFileP[gi]; vec3 FD = uFileD[gi];
      vec3 onAxis = FP.xyz + FD * dot(site - FP.xyz, FD);
      c = mix(site, onAxis, sw * FP.w);
      c += G * g + (sd * sin(tau * 0.9 + uTime * 1.3 + seed * 70.0) + vec3(0.0, 1.0, 0.0) * sin(tau * 0.7 + uTime * 1.1 + seed * 30.0)) * mix(1.6, 0.4, FP.w) * sw;
      float f = tau < 1.5 ? tau * tau / 3.0 : tau - 0.75;
      q = slmQmul(slmQuat(a1, w * f), slmQuat(a2, 0.41 * w * f));
      float shw = fract(dock.w + 0.05) > 0.2 ? 0.95 : uShow[gi];      // a back-course molecule only shows as it comes in to its place
      sc = 1.0 - smoothstep(shw * 0.6, shw, tau);
    } else {
      float k = max(1.0 + tau, 0.0);
      c -= G * (0.3 * sin(-12.566 * tau) * k * k);
    }
  }
}
// relay: the ivory ball of a marked link slides to the far end (0 -> 1) and back the next period
float slmRelay(vec3 mid, float lane){
  if (lane < 0.5) return 0.0;
  float tt = uRT - (mid.z - uRelay.x) / max(uRelay.y, 1.0) - lane * 1.7 + 400.0;
  float cyc = floor(tt / max(uRelay.z, 0.1));
  float e = smoothstep(0.0, uRelay.w, tt - cyc * uRelay.z);
  return mix(e, 1.0 - e, mod(cyc, 2.0));
}
// what a site's baked depth says (aDock.z): 0..1 a plain shade | 2..3 a site of the shafts (shade + 2): bars of
// daylight walk down the nave and lift the shade to nothing | 4..5 a site low on the cliff face (4 + how far it has
// gone into the rose haze).  Returns (shade, nave, rose).
vec3 slmDepth(vec3 p, float z){
  if (z < 1.5) return vec3(z, 0.0, 0.0);
  if (z > 11.5) return vec3(0.0, 0.0, -1.0);                       // 12: the upright ring: full pigment, and distance does not pale it
  if (z > 9.5) {                                                   // 10 + s: a site of the rampart beyond the flown ring: the bars only graze it, it stays the nave's dim
    float f2 = fract((dot(p, uBar.xyz) + uBarK.y) / max(uBar.w, 1.0));
    float b2 = smoothstep(0.0, 0.07, f2) * (1.0 - smoothstep(0.46, 0.53, f2)) * uBarK.x * 0.22;
    return vec3((z - 10.0) * (1.0 - b2), (1.0 - 0.92 * b2) * smoothstep(0.15, 0.6, z - 10.0), 0.0);
  }
  if (z > 7.5) {                                                   // 8 + k: a face site beyond the flown ring: steps a tone back outside the pool of daylight
    float k = clamp(z - 8.0, 0.0, 1.0);
    float m = uMouth.x * smoothstep(uMouth.y, uMouth.y + max(uMouth.w, 0.1), length(p.xy - vec2(0.0, uMouth.z)));
    return vec3(0.6 * m, 0.9 * m * (1.0 - k), k);
  }
  if (z > 5.5) { float k = clamp(z - 6.0, 0.0, 1.0); return vec3(0.46 + 0.14 * k, -(0.44 + 0.10 * k), 0.0); }
  if (z > 3.5) return vec3(0.0, 0.0, clamp(z - 4.0, 0.0, 1.0));
  float f = fract((dot(p, uBar.xyz) + uBarK.y) / max(uBar.w, 1.0));
  float bar = smoothstep(0.0, 0.07, f) * (1.0 - smoothstep(0.46, 0.53, f)) * uBarK.x;   // inside a bar: full pigment, the whole way down the nave (one ring lit, the next dim)
  return vec3((z - 2.0) * (1.0 - bar), (1.0 - 0.92 * bar) * smoothstep(0.15, 0.6, z - 2.0), 0.0);
}
float slmQuiver(vec3 p){ return sin(dot(p, vec3(0.05, 0.07, 0.11)) - uTime * 1.7); }
`;function tt(f,L,p,T,v,l,V,N){const B=Math.max(Math.hypot(l.z,l.x),.001),b=-l.z/B,x=l.x/B,r=Math.sin(V)*Ge,m=Math.cos(V),M=We*Math.sin(V*Je+T*et);return N[0]=f+(l.x*r+b*m)*v,N[1]=L+(l.y*r+M)*v,N[2]=p+(l.z*r+x*m)*v,N}const dt=`
attribute vec3 aSite; attribute vec4 aOff, aDock, aMisc;
varying vec3 vC, vP; varying vec4 vQ, vA, vM; varying vec2 vUv, vNR; varying float vSc;
void main(){
  vec3 c; vec4 q; float sc;
  slmMolecule(aSite, aDock, c, q, sc);
  vec3 dp = aDock.x > 8000.0 ? vec3(0.0) : slmDepth(aSite, aDock.z);
  if (aDock.x > -900.0 && aDock.x < 8000.0) dp *= 1.0 - smoothstep(-1.2, 0.4, aDock.x - uClock);   // a molecule on its way down is in full daylight; seated, it takes its tier's shade
  vNR = dp.yz;
  if (aDock.x < 8000.0) sc *= slmNear(-(modelViewMatrix * vec4(aSite, 1.0)).z);
  else if (aDock.x < 9000.0) { float gz = -(modelViewMatrix * vec4(aSite, 1.0)).z; sc *= slmGuestFar(gz) * (aDock.x < 8450.0 ? slmNear(gz) : 1.0); }
  vec3 off = aOff.xyz; float rl = 0.0;
  if (aMisc.w > 0.5) {
    rl = slmRelay(aSite + off * 1.25, aMisc.w - 1.0);
    if (aMisc.w > 1.5) { dp *= 1.0 - 4.0 * rl * (1.0 - rl); vNR = dp.yz; }   // (FIX 7: mid-hop it is in full ivory: the relay reads as a line of bright beads running along the dim wall)
    off *= 1.0 + 0.5 * rl + 0.03 * slmQuiver(aSite + off);
  }
  vec4 mv = modelViewMatrix * vec4(c + slmRot(q, off) * sc, 1.0);
  float r = aOff.w * sc; vSc = clamp(sc, 0.0, 1.0);
  float d = max(length(mv.xyz), r * 1.05 + 1e-3);
  vec3 fw = mv.xyz / d;
  vec3 rt = cross(fw, vec3(0.0, 1.0, 0.0)); rt /= max(length(rt), 1e-3);
  vec3 up = cross(rt, fw);
  float k = r * d / sqrt(max(d * d - r * r, 1e-4));
  float px = k * projectionMatrix[1][1] / d * uPxH;
  float grow = max(1.0, 0.9 / max(px, 1e-3));
  vec3 p = mv.xyz + (rt * position.x + up * position.y) * k * grow * 1.05;
  vP = p; vC = mv.xyz; vQ = q; vUv = position.xy;
  vA = vec4(r * grow, dp.x, (aMisc.x < 0.5 && slmHash(aDock.y + 11.0) < 0.03) ? 1.0 : 0.0, rl);
  vM = vec4(aMisc.xyz, aMisc.w > 0.5 ? 1.0 : 0.0);
  gl_Position = projectionMatrix * vec4(p, 1.0);
}`,mt=`
uniform mat4 projectionMatrix;
varying vec3 vC, vP; varying vec4 vQ, vA, vM; varying vec2 vUv, vNR; varying float vSc;
void main(){
  vec3 rd = vP / max(length(vP), 1e-4);
  float R = max(vA.x, 1e-3);
  float b = dot(rd, vC);
  float h = b * b - dot(vC, vC) + R * R;
  float cov = clamp(h / max(fwidth(h), 1e-5) + 0.5, 0.0, 1.0);
  if (cov < 0.03) discard;
  vec3 hit = rd * (b - sqrt(max(h, 0.0)));
  vec3 nV = (hit - vC) / R; nV /= max(length(nV), 1e-3);
  vec3 n = (vec4(nV, 0.0) * viewMatrix).xyz;
  vec3 v = (vec4(-rd, 0.0) * viewMatrix).xyz;
  vec3 nL = slmUnrot(vQ, n);
  float pr = 1.0 / max(fwidth(vUv.x) + fwidth(vUv.y), 1e-4);      // radius in pixels
  float e = 0.025 + 1.2 / pr;
  vec3 base = uPal[int(vM.x + 0.5)];
  if (vA.z > 0.5) base = mix(base, vec3(0.86, 0.30, 0.05), 0.36);   // the orange batch
  vec3 base0 = base;
  float a = ${Oe.toFixed(2)} * vSc / R, as = ${ye.toFixed(2)} * vSc / R;
  int bi = int(vM.y + 0.5);
  float code = vM.z + 0.5, sgn = vA.w > 0.5 ? -1.0 : 1.0;
  for (int k = 0; k < 4; k++) {
    float kd = floor(mod(code, 4.0)); code = floor(code / 4.0);
    vec3 D = vM.w > 0.5 ? uBond[bi] * (k == 0 ? sgn : -sgn) : uBond[min(bi, 3) * 4 + k];
    if (kd < 0.5 || (vM.w > 0.5 && k > 1)) continue;
    float cs = dot(nL, D);
    float s = cs > 0.0 ? sqrt(max(1.0 - cs * cs, 0.0)) : 2.0;
    float hole = 0.17 * vSc / R;
    float rc = kd < 1.5 ? a * 1.8 : (kd < 2.5 ? as * 1.16 : hole * 1.7);
    float ri = kd < 1.5 ? 0.0 : (kd < 2.5 ? as * 0.96 : hole);
    vec3 cc = kd < 1.5 ? uPal[2] * 1.02 : (kd < 2.5 ? uPal[3] * 0.92 : vec3(0.87, 0.74, 0.55));
    float e2 = min(e, 0.06);
    float sh = kd > 2.5 ? 1.0 : smoothstep(rc, rc * (kd < 1.5 ? 1.5 : 1.2) + e2, s);
    bool hs = vM.w > 0.5 && kd > 1.5;                                      // a spring seat on an ivory ball: no ferrule
    base *= mix(hs ? vec3(0.66, 0.62, 0.66) : vec3(0.40, 0.34, 0.40), vec3(1.0), sh);   // the small dark ring of contact
    float ring = (1.0 - smoothstep(rc - e2, rc + e2, s)) * smoothstep(ri - e2, ri + e2, s);
    base = mix(base, cc, hs ? ring * 0.9 : ring);                                            // brass collar, steel ferrule or chipped wood
    if (kd > 1.5) base = mix(vec3(0.16, 0.11, 0.10), base, smoothstep(hole - e, hole + e, s));   // the drilled socket
  }
  vec3 col = slmLacquer(base, n, v, vA.y, 0.92);
  vec3 avg = base0 * mix(vec3(0.88, 0.89, 0.94), vec3(0.64, 0.66, 0.77), vA.y) + 0.04;
  col = mix(avg, col, smoothstep(1.2, 3.5, pr));
  col = slmAerialIn(col, length(hit), vNR);
  gl_FragColor = vec4(col, cov);
  vec4 cp = projectionMatrix * vec4(hit, 1.0);
  gl_FragDepth = clamp(cp.z / max(cp.w, 1e-4) * 0.5 + 0.5, 0.0, 1.0);
}`;function xt(f){return new P.ShaderMaterial({uniforms:f.uniforms,alphaToCoverage:!0,vertexShader:ge+Ue+dt,fragmentShader:ge+qe+mt})}const pt=`
attribute vec3 aSite; attribute vec4 aOff, aDock, aMisc;
varying vec3 vU, vAx, vSd, vPv; varying vec4 vL; varying vec2 vNR;
void main(){
  vec3 c; vec4 q; float sc; vec3 A, B; float halfW, shv = 0.0;
  float vz0 = -(modelViewMatrix * vec4(aSite, 1.0)).z;
  float nf = aDock.x < 8000.0 ? slmNear(vz0) : (aDock.x < 9000.0 ? slmGuestFar(vz0) * (aDock.x < 8450.0 ? slmNear(vz0) : 1.0) : 1.0);     // a molecule near the lens (inside a nave) draws in to nothing, whole
  vec3 dp = aDock.x > 8000.0 ? vec3(0.0) : slmDepth(aSite, aDock.z);
  if (aDock.x > -900.0 && aDock.x < 8000.0) dp *= 1.0 - smoothstep(-1.2, 0.4, aDock.x - uClock);   // a molecule on its way down is in full daylight; seated, it takes its tier's shade
  vNR = dp.yz;
  float rl = slmRelay(aSite + aOff.xyz * 1.25, aMisc.y);
  float hh = 1.0 + 0.5 * rl + 0.03 * slmQuiver(aSite + aOff.xyz);
  if (aOff.w < 0.5) {
    slmMolecule(aSite, aDock, c, q, sc); sc *= nf;
    vec3 o = slmRot(q, aOff.xyz) * sc;
    if (rl > 0.5) { A = c + o * hh; B = c + o * 2.5; } else { A = c; B = c + o * hh; }
    halfW = ${Oe.toFixed(2)} * sc;
    if (aMisc.w > 0.5) {                                   // a waiting peg: gone into its socket before the spring stretches across
      float pk = 1.0 - smoothstep(aMisc.z - 1.05, aMisc.z - 0.5, uClock);
      B = c + o * (0.3 + 0.7 * pk); halfW *= 1.3 * step(0.02, pk); shv = 1.0;
    }
  } else {
    vec3 Hp = aSite + aOff.xyz * hh, O1 = aSite + aOff.xyz * (rl > 0.5 ? 0.0 : 2.5);
    float sA = uClock - aDock.x, sB = uClock - aMisc.x;
    float first = max(sA, sB), last = min(sA, sB);
    float show = smoothstep(0.0, 0.5, first);
    float ext = mix(sA >= sB ? 0.17 : 0.30, 1.0, smoothstep(-0.6, -0.02, last)) * show;
    if (sA >= sB) { A = Hp; B = Hp + (O1 - Hp) * ext; } else { A = O1; B = O1 + (Hp - O1) * ext; }
    float k = clamp(1.0 - last, 0.0, 1.0);
    shv = last > 0.0 ? sin(12.566 * last) * k * k : 0.0;
    shv += 0.15 * slmQuiver(aSite);
    nf = min(nf, slmNear(-(modelViewMatrix * vec4(aSite + aOff.xyz * 2.5, 1.0)).z));
    vec3 md = (A + B) * 0.5; A = md + (A - md) * nf; B = md + (B - md) * nf;
    halfW = ${ye.toFixed(2)} * show * nf;
    if (distance(aSite + aOff.xyz * 1.75, uHelix.xyz) < uHelix.w - 0.02) halfW = 0.0;      // the pool draws this one as real wire
  }
  vec4 a = modelViewMatrix * vec4(A, 1.0), b = modelViewMatrix * vec4(B, 1.0);
  vec3 ax = b.xyz - a.xyz; float len = length(ax); ax /= max(len, 1e-3);
  vec3 pv = mix(a.xyz, b.xyz, position.y);
  vec3 sd = cross(ax, pv); sd /= max(length(sd), 1e-3);
  float dist = max(length(pv), 0.05);
  float pxw = halfW * projectionMatrix[1][1] / dist * uPxH;
  float grow = halfW > 1e-4 ? max(1.0, (aOff.w < 0.5 && aMisc.w > 0.5 ? 1.5 : 0.8) / max(pxw, 1e-3)) : 1.0;
  if (nf < 0.999) grow = 1.0;
  pv += sd * position.x * halfW * grow;
  vU = vec3(position.x, position.y, len); vAx = ax; vSd = sd; vPv = pv;
  vL = vec4(aOff.w, dp.x, shv, pxw);
  gl_Position = projectionMatrix * vec4(pv, 1.0);
}`,yt=`
varying vec3 vU, vAx, vSd, vPv; varying vec4 vL; varying vec2 vNR;
void main(){
  vec3 rd = vPv / max(length(vPv), 1e-4);
  vec3 sd = vSd / max(length(vSd), 1e-3);
  vec3 fc = cross(sd, vAx); fc /= max(length(fc), 1e-3);
  if (dot(fc, rd) > 0.0) fc = -fc;
  float x = clamp(vU.x, -1.0, 1.0), ex = max(fwidth(vU.x), 1e-4);
  vec3 v = (vec4(-rd, 0.0) * viewMatrix).xyz;
  float dist = length(vPv);
  vec3 col; float cov = 1.0;
  if (vL.x < 0.5) {
    vec3 nV = sd * x + fc * sqrt(max(1.0 - x * x, 0.0));
    vec3 n = (vec4(nV, 0.0) * viewMatrix).xyz;
    col = slmLacquer(uPal[2], n, v, vL.y, 0.55);
    vec3 hv = uSun + v; hv /= max(length(hv), 1e-3);
    float sp = max(dot(n, hv), 0.0); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
    col = mix(col, vec3(1.0, 0.97, 0.86), sp * 0.6 * (1.0 - 0.5 * vL.y));
    col = mix(uPal[2] * 0.86, col, smoothstep(0.7, 2.0, vL.w));
    if (vL.z > 0.5) col = mix(col, vec3(1.0, 0.97, 0.84), smoothstep(0.74, 0.86, vU.y) * 0.92);
  } else {
    const float N = 9.0; float wr = 0.22;
    float ph = 6.2832 * N * vU.y + vL.z * 1.6 * sin(3.1416 * vU.y);
    float sl = cos(ph) * 6.2832 * N * ${ye.toFixed(2)} / max(vU.z, 0.05);
    float k = sqrt(1.0 + sl * sl);
    float u = (x - (1.0 - wr) * sin(ph)) / k;
    float front = step(0.0, cos(ph));
    float w = wr * mix(0.5, 1.22, front);
    float e = ex / k * 0.75 + 1e-4;
    float wire = 1.0 - smoothstep(w - e, w + e, abs(u));
    float pitch = vU.z / N * vL.w / ${ye.toFixed(2)};          // pixels per turn
    float lod = smoothstep(2.0, 5.0, pitch);
    cov = mix(0.75 * (1.0 - smoothstep(0.75, 0.95, abs(x))), wire, lod);
    if (cov < 0.4) discard;
    float un = clamp(u / max(w, 1e-3), -1.0, 1.0);
    vec3 nV = sd * (x * 0.6 + un * 0.7) + fc * sqrt(max(1.0 - x * x, 0.0)) * (front * 2.0 - 1.0) + vAx * (un * 0.5 * sign(sl + 1e-5));
    nV /= max(length(nV), 1e-3);
    if (dot(nV, rd) > 0.0) nV = reflect(nV, fc);
    vec3 n = (vec4(nV, 0.0) * viewMatrix).xyz;
    vec3 steel = slmLacquer(uPal[3], n, v, vL.y, 0.5) * mix(0.5, 1.0, front);
    vec3 hv = uSun + v; hv /= max(length(hv), 1e-3);
    float sp = max(dot(n, hv), 0.0); sp *= sp; sp *= sp; sp *= sp;
    steel = mix(steel, vec3(1.0), sp * 0.7 * front * (1.0 - 0.5 * vL.y));
    col = mix(uPal[3] * mix(0.80, 0.66, vL.y), steel, lod);
  }
  col = slmAerialIn(col, dist, vNR);
  gl_FragColor = vec4(col, cov);
}`;function gt(f){return new P.ShaderMaterial({uniforms:f.uniforms,alphaToCoverage:!0,side:P.DoubleSide,vertexShader:ge+Ue+pt,fragmentShader:ge+qe+yt})}const je=9,wt=12,we=5,at=.165,Mt=ye-at,zt=`
attribute vec3 aSite; attribute vec4 aOff, aDock, aMisc;
varying vec3 vN, vW; varying vec2 vS, vNR; varying float vBk;
void main(){
  vec3 dp = aDock.x > 8000.0 ? vec3(0.0) : slmDepth(aSite, aDock.z);
  if (aDock.x > -900.0 && aDock.x < 8000.0) dp *= 1.0 - smoothstep(-1.2, 0.4, aDock.x - uClock);   // a molecule on its way down is in full daylight; seated, it takes its tier's shade
  vNR = dp.yz;
  float rl = slmRelay(aSite + aOff.xyz * 1.25, aMisc.y);
  float hh = 1.0 + 0.5 * rl + 0.03 * slmQuiver(aSite + aOff.xyz);
  vec3 Hp = aSite + aOff.xyz * hh, O1 = aSite + aOff.xyz * (rl > 0.5 ? 0.0 : 2.5);
  float sA = uClock - aDock.x, sB = uClock - aMisc.x;
  float first = max(sA, sB), last = min(sA, sB);
  float show = smoothstep(0.0, 0.5, first);
  float ext = mix(sA >= sB ? 0.17 : 0.30, 1.0, smoothstep(-0.6, -0.02, last)) * show;
  vec3 A, B;
  if (sA >= sB) { A = Hp; B = Hp + (O1 - Hp) * ext; } else { A = O1; B = O1 + (Hp - O1) * ext; }
  float nfh = min(slmNear(-(modelViewMatrix * vec4(aSite, 1.0)).z), slmNear(-(modelViewMatrix * vec4(aSite + aOff.xyz * 2.5, 1.0)).z));
  vec3 md = (A + B) * 0.5; A = md + (A - md) * nfh; B = md + (B - md) * nfh;
  float k = clamp(1.0 - last, 0.0, 1.0);
  float shv = (last > 0.0 ? sin(12.566 * last) * k * k : 0.0) + 0.15 * slmQuiver(aSite);
  vec3 ax = B - A; float len = length(ax); ax /= max(len, 1e-3);
  vec3 ref = abs(ax.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 e1 = cross(ax, ref); e1 /= max(length(e1), 1e-3);
  vec3 e2 = cross(ax, e1);
  float t = position.x, phi = position.y;
  float th = ${(2*Math.PI*je).toFixed(4)} * t + shv * 1.6 * sin(3.1416 * t);
  float Rc = ${Mt.toFixed(3)} * nfh;
  vec3 rad = e1 * cos(th) + e2 * sin(th);
  vec3 tn = ax * len + (e2 * cos(th) - e1 * sin(th)) * (${(2*Math.PI*je).toFixed(4)} * Rc);
  tn /= max(length(tn), 1e-3);
  vec3 bn = cross(tn, rad); bn /= max(length(bn), 1e-3);
  vec3 nrm = rad * cos(phi) + bn * sin(phi);
  vec3 pc = A + ax * (len * t) + rad * Rc;
  vec4 w = modelMatrix * vec4(pc, 1.0);
  float dist = max(distance(w.xyz, cameraPosition), 0.05);
  float rw = max(${at.toFixed(3)}, 0.8 * dist / max(projectionMatrix[1][1] * uPxH, 1.0));
  if (len < 0.05 || show < 0.01) rw = 0.0;
  rw *= nfh;
  w.xyz += nrm * rw;
  vec3 toEye = cameraPosition - w.xyz; toEye /= max(length(toEye), 1e-3);
  vN = nrm; vW = w.xyz; vS = vec2(dp.x, cos(phi)); vBk = dot(mat3(modelMatrix) * rad, toEye);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,bt=`
varying vec3 vN, vW; varying vec2 vS, vNR; varying float vBk;
void main(){
  vec3 n = vN / max(length(vN), 1e-3);
  vec3 v = cameraPosition - vW; float dist = length(v); v /= max(dist, 1e-3);
  vec3 col = slmLacquer(uPal[3], n, v, vS.x, 0.35);
  col *= mix(0.66, 1.0, smoothstep(-0.7, 0.3, vS.y));                 // the inside of the coil is in its own shade
  float frontT = smoothstep(-0.35, 0.25, vBk);                         // each turn passes in front (bright) and then behind (in shade)
  col *= mix(0.5, 1.0, frontT);
  vec3 hv = uSun + v; hv /= max(length(hv), 1e-3);
  float sp = max(dot(n, hv), 0.0); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  col = mix(col, vec3(1.0), sp * 0.8 * (1.0 - 0.5 * vS.x) * frontT);  // the thin highlight along the wire
  gl_FragColor = vec4(slmAerialIn(col, dist, vNR), 1.0);
}`;async function Ct(f,L,p=160){const T=f.springData||[],v=new Float32Array(T.length),l=v.length/15;for(let d=0;d<T.length;d+=16384){const F=Math.min(T.length,d+16384);for(let W=d;W<F;W++)v[W]=T[W];await L.yield()}const V=[],N=[],B=je*wt+1;for(let d=0;d<B;d++)for(let F=0;F<we;F++)V.push(d/(B-1),F/we*Math.PI*2,0);for(let d=0;d<B-1;d++)for(let F=0;F<we;F++){const W=d*we+F,Z=d*we+(F+1)%we,Y=W+we,de=Z+we;N.push(W,Y,Z,Z,Y,de)}const b=new P.InstancedBufferGeometry;b.setAttribute("position",new P.Float32BufferAttribute(V,3)),b.setIndex(N);const x=(d,F)=>{const W=new P.InstancedBufferAttribute(new Float32Array(p*F),F);return W.setUsage(P.DynamicDrawUsage),b.setAttribute(d,W),W},r=x("aSite",3),m=x("aOff",4),M=x("aDock",4),u=x("aMisc",4);b.instanceCount=p;const t=new P.ShaderMaterial({uniforms:f.uniforms,side:P.DoubleSide,vertexShader:ge+Ue+zt,fragmentShader:ge+qe+bt}),z=new P.Mesh(b,t);z.frustumCulled=!1,z.name="helix pool";const c=8,A=64;let E=1/0,ee=-1/0;const q=new Float32Array(l*3);for(let d=0;d<l;d++){const F=d*15;q[d*3]=v[F]+v[F+3]*1.75,q[d*3+1]=v[F+1]+v[F+4]*1.75;const W=q[d*3+2]=v[F+2]+v[F+5]*1.75;W<E&&(E=W),W>ee&&(ee=W),(d&2047)===2047&&await L.yield()}const n=l?Math.floor((ee-E)/c)+1:1,e=new Int32Array(n+1),s=new Int32Array(l);for(let d=0;d<l;d++)e[Math.floor((q[d*3+2]-E)/c)+1]++,(d&8191)===8191&&await L.yield();for(let d=0;d<n;d++)e[d+1]+=e[d];const y=e.slice(0,n);await L.yield();for(let d=0;d<l;d++)s[y[Math.floor((q[d*3+2]-E)/c)]++]=d,(d&8191)===8191&&await L.yield();await L.yield();const g=6e3,w=new Int32Array(g),h=new Float32Array(g),C=new Int32Array(A*2+1);let Q=0;return{mesh:z,count:l,update(d,F,W=1.1,Z=.62){const Y=F||[1,0,0,0,0,1,0,0,0,0,-1,0],de=W*1.12,pe=Z*1.12;let me=0;C.fill(0);const Me=Math.max(0,Math.floor((d.z-A-E)/c)),ze=Math.min(n-1,Math.floor((d.z+A-E)/c));for(let J=Me<=ze?e[Me]:0,ae=Me<=ze?e[ze+1]:0;J<ae&&me<g;J++){const ne=s[J],be=q[ne*3]-d.x,ke=q[ne*3+1]-d.y,Se=q[ne*3+2]-d.z,re=be*be+ke*ke+Se*Se;if(re<A*A){const Te=Math.sqrt(re);if(Te>7){const Re=-(be*Y[8]+ke*Y[9]+Se*Y[10]);if(Re<-3||Math.abs(be*Y[0]+ke*Y[1]+Se*Y[2])>Re*de+5||Math.abs(be*Y[4]+ke*Y[5]+Se*Y[6])>Re*pe+5)continue}w[me]=ne,h[me]=Te,C[Te*2|0]++,me++}}let Fe=A;if(me>p){let J=0;for(let ae=0;ae<=A*2;ae++){if(J+C[ae]>p){Fe=ae*.5;break}J+=C[ae]}}let ie=0;for(let J=0;J<me&&ie<p;J++){if(h[J]>=Fe)continue;const ae=w[J]*15;r.array[ie*3]=v[ae],r.array[ie*3+1]=v[ae+1],r.array[ie*3+2]=v[ae+2];for(let ne=0;ne<4;ne++)m.array[ie*4+ne]=v[ae+3+ne],M.array[ie*4+ne]=v[ae+7+ne],u.array[ie*4+ne]=v[ae+11+ne];ie++}for(let J=ie;J<Q;J++)m.array[J*4]=0,m.array[J*4+1]=0,m.array[J*4+2]=0,M.array[J*4]=9999,u.array[J*4]=9999;Q=ie,r.version++,m.version++,M.version++,u.version++,f.uniforms.uHelix.value.set(d.x,d.y,d.z,Fe)}}}function kt(){const f=[],L=[],p=[],T=[],v=[],l=[],V=[],N=[],B={balls:0,links:0,loose:[],ball(b,x,r,m,M,u,t,z,c,A,E,ee){f.push(b,x,r),L.push(m,M,u,t),p.push(z[0],z[1],z[2],z[3]),T.push(c,A,E,ee),B.balls++},link(b,x,r,m,M,u,t,z,c,A,E=0,ee=0){v.push(b,x,r),l.push(m,M,u,t),V.push(z[0],z[1],z[2],z[3]),N.push(c,A,E,ee),B.links++},vapour(b,x,r,m,M,u=0){const t=[9999,m,M,u],z=fe*_e;B.loose.push(b,x,r,m,M,u),B.ball(b,x,r,0,0,0,Ae,t,0,0,245,0);for(let c=0;c<2;c++){const A=xe[c];B.ball(b,x,r,A.x*z,A.y*z,A.z*z,Ce,t,1,c,4,1),B.link(b,x,r,A.x*z,A.y*z,A.z*z,0,t,9999,0)}},guest(b,x,r,m,M=3){const u=[8400,m,M,0],t=xe[1],z=1.9;for(const c of[1,-1])B.ball(b,x,r,t.x*z*c,t.y*z*c,t.z*z*c,1.5,u,6,1,c>0?4:1,1),B.link(b,x,r,t.x*z*c,t.y*z*c,t.z*z*c,0,u,9999,0)},async build(b,x){const r=async(t,z,c,A)=>{const E=new P.InstancedBufferGeometry;E.setAttribute("position",new P.Float32BufferAttribute(t,3)),E.setIndex([0,1,2,0,2,3]);for(const[q,n,e]of z){const s=new Float32Array(n.length);for(let y=0;y<n.length;y+=16384){const g=Math.min(n.length,y+16384);for(let w=y;w<g;w++)s[w]=n[w];x&&await x.yield()}E.setAttribute(q,new P.InstancedBufferAttribute(s,e)),x&&await x.yield()}E.instanceCount=c;const ee=new P.Mesh(E,A);return ee.frustumCulled=!1,ee},m=await r([-1,-1,0,1,-1,0,1,1,0,-1,1,0],[["aSite",f,3],["aOff",L,4],["aDock",p,4],["aMisc",T,4]],B.balls,xt(b)),M=await r([-1,0,0,1,0,0,1,1,0,-1,1,0],[["aSite",v,3],["aOff",l,4],["aDock",V,4],["aMisc",N,4]],B.links,gt(b));m.name="balls",M.name="links";const u=b.springData||(b.springData=[]);for(let t=0;t<B.links;t++)x&&(t&2047)===2047&&await x.yield(),l[t*4+3]>.5&&u.push(v[t*3],v[t*3+1],v[t*3+2],l[t*4],l[t*4+1],l[t*4+2],l[t*4+3],V[t*4],V[t*4+1],V[t*4+2],V[t*4+3],N[t*4],N[t*4+1],N[t*4+2],N[t*4+3]);return{balls:m,links:M}}};return B}async function Ve(f,L,p){const T=p.rng||f.rng,v=p.bounds,l=[],V=new Map,N=(e,s,y,g)=>(((e+512)*1024+(s+512))*1024+(y+512))*4+g,B=Math.floor((v.x0-2*te)/j),b=Math.ceil((v.x1-te)/j),x=Math.floor(v.z0/se)-1,r=Math.ceil(v.z1/se);let m=0;for(let e=B;e<=b;e++){const s=Math.floor((v.y0-e*X)/ue),y=Math.ceil((v.y1-e*X)/ue);for(let g=s;g<=y;g++){const w=e*X+g*ue;if(!(w<v.y0-.01||w>v.y1+.01))for(let h=x;h<=r;h++)for(let C=0;C<4;C++){const Q=te+e*j+(C>1?te:0),d=(h+Be[C])*se;if(Q<v.x0||Q>v.x1||d<v.z0||d>v.z1)continue;const F=p.site(Q,w,d,C);F&&(V.set(N(e,g,h,C),l.length),l.push({x:Q,y:w,z:d,c:C,m:e,n:g,l:h,T:F.T??-1e3,glide:F.glide||0,shade:F.shade||0,seed:T()*97})),(++m&255)===0&&await f.yield()}}}const M=l.length,u=new Int32Array(M*4).fill(-1),t=new Uint8Array(M*4),z=[[0,0],[-1,1],[-1,0]];for(let e=0;e<M;e++){const s=l[e],y=s.c;for(let g=0;g<4;g++){let w;if(g===0)w=V.get(N(s.m,s.n,s.l,y^1));else{const h=z[g-1],C=y<2?1:-1;w=V.get(N(s.m+C*h[0],s.n+C*h[1],s.l+(y===0?-1:y===3?1:0),3-y))}w!==void 0&&(u[e*4+g]=w),t[e*4+g]=y%2===0?g<2?1:0:g<2?0:1}(e&255)===0&&await f.yield()}const c=new Int32Array(M).fill(-1),A=new Int32Array(64),E=new Int32Array(64);for(let e=0;e<M*2;e++){let s=T()*M|0,y=0;for(;y<64;y++){if(c[s]>=e*64){for(let h=c[s]-e*64;h<y;h++){const C=A[h],Q=E[h];t[C*4+Q]=0,t[u[C*4+Q]*4+Q]=1}break}c[s]=e*64+y;const g=T()*4|0;let w=-1;for(let h=0;h<4;h++){const C=g+h&3;if(t[s*4+C]&&u[s*4+C]>=0){w=C;break}}if(w<0)break;A[y]=s,E[y]=w,s=u[s*4+w]}(e&63)===0&&await f.yield()}const ee=p.pegs??.5,q=fe*_e,n=Ae+1.25;for(let e=0;e<M;e++){const s=l[e],y=[s.T,s.seed,s.shade,s.glide];let g=0;for(let w=3;w>=0;w--){const h=xe[s.c*4+w],C=u[e*4+w];let Q;const d=C<0&&!!p.sprung&&p.sprung(s,w);if(t[e*4+w]){Q=1;const F=C>=0?l[C]:null,W=F&&p.lane&&s.T<=-900&&F.T<=-900?p.lane(s,F):0;L.ball(s.x,s.y,s.z,h.x*q,h.y*q,h.z*q,Ce,y,1,s.c*4+w,F||d?6:4,1+W),L.link(s.x,s.y,s.z,h.x*q,h.y*q,h.z*q,0,y,0,W),F&&L.link(s.x,s.y,s.z,h.x*q,h.y*q,h.z*q,1,y,F.T,W)}else C>=0?(Q=2,l[C].T>s.T+.01&&L.link(s.x,s.y,s.z,h.x*(n+2.2),h.y*(n+2.2),h.z*(n+2.2),0,[s.T,s.seed,0,s.glide],0,0,l[C].T,1)):d?(Q=2,T()):T()<ee?(Q=1,L.link(s.x,s.y,s.z,h.x*n,h.y*n,h.z*n,0,y,0,0)):Q=3;g=g*4+Q}L.ball(s.x,s.y,s.z,0,0,0,Ae,y,0,s.c,g,0),(e&127)===0&&await f.yield()}return{sites:l,count:M}}function St(f,L,p,T,v,l,V){const N=(c,A)=>c.geometry.attributes[A].array,B=(c,A)=>(c[A*3]-p)**2+(c[A*3+1]-T)**2+(c[A*3+2]-v)**2<Ae*Ae,b=N(f,"aSite"),x=N(f,"aMisc"),r=xe[l*4+V];let m=-1,M=-1;for(let c=0;c<f.geometry.instanceCount;c++)B(b,c)&&(x[c*4+3]<.5?m=c:x[c*4+1]===l*4+V&&(M=c));if(M>=0){x[M*4+2]=6;return}if(m<0)return;const u=4**V;x[m*4+2]+=(2-Math.floor(x[m*4+2]/u)%4)*u;const t=N(L,"aSite"),z=N(L,"aOff");for(let c=L.geometry.instanceCount-1;c>=0;c--)if(!(!B(t,c)||z[c*4+3]>.5||z[c*4]*r.x+z[c*4+1]*r.y+z[c*4+2]*r.z<=0)){for(const A of Object.values(L.geometry.attributes))A.isInstancedBufferAttribute&&A.array.copyWithin(c*A.itemSize,(c+1)*A.itemSize);L.geometry.instanceCount--}}const At=[7,8,9,10,11,12,13,14,15,16],Qe=-2,ot=4,Pt=3,st=6,Xe=14,nt=12,lt=256,it=(f,L)=>f%2===0==L<2;function Ee(f,L,p,T,v,l,V,N,B,b,x,r){const m=T-f,M=v-L,u=l-p,t=b-V,z=x-N,c=r-B,A=f-V,E=L-N,ee=p-B,q=m*m+M*M+u*u,n=t*t+z*z+c*c,e=t*A+z*E+c*ee,s=m*A+M*E+u*ee;let y=0,g=0;if(q>1e-12&&n>1e-12){const w=m*t+M*z+u*c,h=q*n-w*w;h>1e-12&&(y=Math.min(1,Math.max(0,(w*e-s*n)/h))),g=(w*y+e)/n,g<0?(g=0,y=Math.min(1,Math.max(0,-s/q))):g>1&&(g=1,y=Math.min(1,Math.max(0,(w-s)/q)))}else q>1e-12?y=Math.min(1,Math.max(0,-s/q)):n>1e-12&&(g=Math.min(1,Math.max(0,e/n)));return Math.hypot(A+m*y-t*g,E+M*y-z*g,ee+u*y-c*g)}async function Ot(f,L,p,T){const v=fe*_e,l=T.course,V=T.ring,N=Qe*j,B=Qe*X+(Math.floor((T.floorY+X-Qe*X+.1)/ue)+1)*ue,b=(M,u)=>{for(let t=0;t<ot;t++)if(Math.abs(Math.hypot(M-N,u-B-t*ue)-te)<.6)return{shade:0};return null};let x=V.x;for(let M=0;M<l.length;M+=3)l[M+2]>T.sightZ&&l[M]<x&&(x=l[M]);const r=[0,0,0],m=[0,0,0];for(const M of At){const u={x0:N-te-1,x1:N+te+1,y0:T.floorY+.5,y1:B+(ot-1)*ue+X+.5,z0:V.z-(M+Pt-1)*se/2-3,z1:V.z-M*se/2+3},t=[];for(let n=Math.floor((u.x0-2*te)/j);n<=Math.ceil((u.x1-te)/j);n++)for(let e=Math.floor((u.y0-n*X)/ue);e<=Math.ceil((u.y1-n*X)/ue);e++)for(let s=Math.floor(u.z0/se)-1;s<=Math.ceil(u.z1/se);s++)for(let y=0;y<4;y++){const g=te+n*j+(y>1?te:0),w=n*X+e*ue,h=(s+Be[y])*se;if(!(g<u.x0||g>u.x1||w<u.y0-.01||w>u.y1+.01||h<u.z0||h>u.z1||!b(g,w))){t.push(g,w,h,g,w,h,Ae);for(let C=0;C<4;C++){const Q=xe[y*4+C],d=g+Q.x*v,F=w+Q.y*v,W=h+Q.z*v,Z=g+Q.x*fe,Y=w+Q.y*fe,de=h+Q.z*fe,pe=Y<T.floorY+.1,me=pe||Z>=u.x0&&Z<=u.x1&&Y>=u.y0&&Y<=u.y1&&de>=u.z0&&de<=u.z1&&!!b(Z,Y);it(y,C)?(t.push(g,w,h,d,F,W,Oe,d,F,W,d,F,W,Ce),me&&t.push(d,F,W,Z,Y,de,ye)):pe?t.push(g,w,h,Z-Q.x*v,Y-Q.y*v,de-Q.z*v,ye):me||t.push(g,w,h,d,F,W,Oe)}}}await f.yield();const z=(u.y0+u.y1)/2,c=(u.z0+u.z1)/2,A=Math.hypot(te+1,u.y1-z,u.z1-c)+v+Ce;let E=!0;for(let n=0;E&&n<l.length;n+=3)if(!(Math.hypot(l[n]-N,l[n+1]-z,l[n+2]-c)-A>=Xe))for(let e=0;E&&e<t.length;e+=7)l[n]-Math.max(t[e],t[e+3])-t[e+6]>=Xe||(E=Ee(t[e],t[e+1],t[e+2],t[e+3],t[e+4],t[e+5],l[n],l[n+1],l[n+2],l[n],l[n+1],l[n+2])-t[e+6]>=Xe);for(let n=0;E&&n<l.length;n+=3)if(!(l[n+2]<=T.sightZ))for(let e=0;E&&e<t.length;e+=7)Math.max(t[e+2],t[e+5])<=l[n+2]||Math.max(t[e],t[e+3])+t[e+6]+nt<x||(E=Ee(t[e],t[e+1],t[e+2],t[e+3],t[e+4],t[e+5],l[n],l[n+1],l[n+2],V.x,V.y,V.z)-t[e+6]>=nt);await f.yield();for(const n of T.loose)for(let e=0;E&&e<n.length;e+=6){const s=n[e+4],y=p.uniforms.uGlide.value[Math.round(Math.min(7,Math.max(0,n[e+5])))],g=st+vt*s;if(Math.hypot(n[e]-N,n[e+1]-z,n[e+2]-c)-A>=g)continue;const w=[];for(let h=0;h<t.length;h+=7)Ee(t[h],t[h+1],t[h+2],t[h+3],t[h+4],t[h+5],n[e],n[e+1],n[e+2],n[e],n[e+1],n[e+2])-t[h+6]<g&&w.push(h);if(w.length){tt(n[e],n[e+1],n[e+2],n[e+3],s,y,0,r);for(let h=1;E&&h<=lt;h++){tt(n[e],n[e+1],n[e+2],n[e+3],s,y,h/lt*2*Math.PI,m);for(const C of w)Ee(t[C],t[C+1],t[C+2],t[C+3],t[C+4],t[C+5],r[0],r[1],r[2],m[0],m[1],m[2])-t[C+6]<st&&(E=!1);r[0]=m[0],r[1]=m[1],r[2]=m[2]}await f.yield()}}if(!E)continue;const ee=(n,e)=>n.y+xe[n.c*4+e].y*fe<=T.floorY+.1,q=await Ve(f,L,{rng:f.core.makeRng(f.core.hashSeed("slm-column:"+f.seed)),pegs:.5,bounds:u,site:b,sprung:ee});for(const n of q.sites)for(let e=1;e<4;e++){const s=xe[n.c*4+e];ee(n,e)&&(it(n.c,e)?L.link(n.x,n.y,n.z,s.x*v,s.y*v,s.z*v,1,[n.T,n.seed,n.shade,n.glide],-1e3,0):L.link(n.x+s.x*fe,n.y+s.y*fe,n.z+s.z*fe,-s.x*v,-s.y*v,-s.z*v,1,[-1e3,0,0,0],n.T,0),T.floor(n.x+s.x*fe,n.y+s.y*fe,n.z+s.z*fe,3-n.c,e))}return M}return 0}const le=16,rt=22;async function Vt(f,L={}){const p=f.rng,T=L.detail??f.quality?.detail??1,v=L.style||ut(L.palette||Ie),l=v.uniforms,V=new P.Group;V.name="snow-lattice-model:hero";const N=5,B=(N+.5)*se,b=new P.Vector3(0,2*X,B),x=B+11,r=x-350,m=150,M=r+150,u=M+15,t=[-14,-84+p.range(-5,5),-136+p.range(-5,5)],z=[p.range(112,140),p.range(112,140)],c=4+(T>.7?1:0),A=3,E=[le,p.range(6.6,7.6),p.range(5.2,6.2)],ee=[0,-p.range(8.6,10),-p.range(2,5)],q=(a,o,i)=>{const S=(a-i*m)*i,H=o-M,D=S*.866+H*.5,I=-S*.5+H*.866;return D>=-20&&Math.abs(I)<=27&&D<=z[i>0?0:1]-Math.abs(I)*.577},n=(a,o)=>o>=r&&o<=x&&Math.abs(a)<=Math.min(m,(x-o)*1.732)||q(a,o,1)||q(a,o,-1),e=2*X,s=!!L.rare,y=118,g=r+125,w=34,h=3.5,C=j,Q=1.5,d=22,F=66,W=[0,34,62],Z=[y-16,y-16-2*j,y-16-3*j],Y=(a,o,i)=>{const S=a-y,H=o-g,D=Math.sign(H)*Math.max(0,Math.abs(H)-F),I=(Math.round(Math.atan2(D,S)/1.0472)%6+6)%6,G=Math.max(Math.abs(S),Math.abs(S*.5+D*.866),Math.abs(S*.5-D*.866)),$=I*1.0472,oe=-S*Math.sin($)+D*Math.cos($),k=G+i,_=k<=Z[2]?k*w/Z[2]:k<=Z[1]?w+(k-Z[2])*w/(Z[1]-Z[2]):k<=Z[0]?2*w+(k-Z[1])*w/(Z[0]-Z[1]):3*w+k-Z[0];return{lv:Math.min(3,Math.max(0,Math.floor(h-_/w+I/6))),sx:I,frac:Math.min(1,Math.max(0,.5+oe/Math.max(1.155*G,1)))}},de=(a,o,i=-1e9)=>{const S=-a;return i>x-65-.577*a?0:s&&i>-1e8?a<-t[0]?0:Y(a,i,o).lv:S>t[0]-o?0:S>t[1]-o?1:S>t[2]-o?2:3},pe=20,me=128,Me=18.5,ze=(u-r)/le-4.5,Fe=(a,o)=>{const i=a-(-t[0]+j),S=o-u,H=i*.866+S*.5,D=-i*.5+S*.866;return H>pe&&H<me&&D>=-2*j&&D<j?H-pe:-1},ie=[],J=Math.round(p.range(15,22)*T);for(let a=0;a<J;a++){const o=a%2?1:-1,i=a>=J-4;let S,H;if(i){const I=z[o>0?0:1]*p.range(.55,.95);S=o*(m+I*.866),H=M+I*.5}else H=p.range(r+20,x-110),S=o*m,Math.abs(H-M)<45&&(H+=90);const D=p.chance(.7)?1:-1;ie.push({x0:S,z0:H,dx:o*.866*(i?-.2:1),dz:i?.98:.5*D,len:p.range(45,95),built:p.range(8,30),t0:p.range(-6,4),v:p.range(2,3.2),g:o>0?5:6,hw:p.range(7,10)})}for(const a of[1,-1])for(let o=0;o<5;o++){const i=x-80+o*14.5+(a>0?0:6),S=a*(x-i)*1.732,H=(o+(a>0?0:1))%2===1,D=46+(o*7+(a>0?3:0))%4*9;ie.push({x0:S,z0:i,dx:H?a*.866:0,dz:H?.5:1,len:D,built:D*(.3+.07*((o*3+(a>0?1:0))%4)),t0:12.5+o*1.1+(a>0?0:.6),v:2.6+.2*(o%3),g:a>0?5:6,hw:11+o%2*2.5,tip:!0})}const ae=(a,o)=>{for(const i of ie){const S=a-i.x0,H=o-i.z0,D=S*i.dx+H*i.dz,I=Math.abs(-S*i.dz+H*i.dx);if(D>-4&&D<i.len&&I<i.hw*(1-.5*D/i.len))return{sp:i,u:D}}return null},ne=new Set,be=(a,o)=>(Math.round(a/se-Be[o])+(o+.5)/4)*se,ke=(a,o,i,S)=>{const H=a-b.x,D=o-b.y;if(Math.abs(i-B)<3&&Math.abs(Math.hypot(H,D)-te)<.6)return D>1&&H>0?{T:rt,glide:7,shade:12}:{shade:12};if(n(a,i)){const G=de(a,0,i),$=de(a,s&&G!==1?j:2*j,i),oe=G*e;if(o<-(c+(Math.abs(a)<52?A:0))*X-.1)return null;const k=s?-1:Fe(a,i);if(s&&o>$*e+.1){if(o>oe+.1||Math.abs(a)>=m)return null;const _=Y(a,i,0),R=G>=1&&G<=3?G:3;if(_.sx===3&&G>=1){const O=y-Z[G-1],U=W[G-1];return G>=2&&o<oe-.1?{shade:6.7}:o>oe-.1&&a<O+.75*j?{T:((Math.round(i/se-Be[S])+(S===2?.5:1))*se-r-U)/le,glide:G}:{T:(i-6-r-U)/le,glide:G+.25}}return{T:Q+40*(_.frac-.82)-.2,glide:R+.25}}if(o<=$*e+.1){if($>=1)return{shade:6+Math.min(1,Math.max(0,($*e-o)/(2.1*X)))};const _=G!==$?.86:!s&&a>-t[0]-10&&i<x-90?.62:0;return o<-.1?{shade:o>-X-.1?10.42:10.72}:{shade:Math.min(.92,Math.max(_*(o>($-1)*e-.1?1:0),($*e-o)/(2.1*X)))}}if(o<=oe+.1&&Math.abs(a)<m)return G>1?{T:ee[G-1]+(be(i,S)-r)/E[G-1],glide:G,shade:6.2}:o>oe-.1&&a<-t[0]+j?{T:((Math.round(i/se-Be[S])+(S===2?.5:1))*se-r)/le,glide:1}:{T:(i-6-r)/le,glide:1.25};if(k>=0&&o<=oe+e+.1&&G>=1&&G<=2){const _=ze+k/Me;if(o>oe+e-.1){const R=Math.floor(k/10);return ne.has(R)?{T:_-.15,glide:4.25}:(ne.add(R),{T:ze+(R+.5)*10/Me,glide:4})}return{T:_-.3,glide:4.25}}return null}const I=ae(a,i);if(I){const G=I.sp.tip?0:de(a,0,i)*e;return o>G+.1||o<G-X-.1?null:I.u<I.sp.built?{shade:0}:{T:I.sp.t0+(I.u-I.sp.built)/I.sp.v+p.range(-.3,.3),glide:I.sp.g}}return null},Se=(a,o)=>Math.abs(a.y)<.1&&Math.abs(o.y)<.1&&a.m===o.m&&a.n===o.n?a.m===-2?1:a.m===-6?2:0:0,re=kt();await f.yield();const Te=await Ve(f,re,{bounds:{x0:-m-150,x1:m+150,y0:-(c+A)*X,y1:8*X,z0:r-30,z1:x+60},site:ke,lane:Se,pegs:.55*T});await f.yield();{let a=2654435769;const o=()=>(a=Math.imul(a,1664525)+1013904223>>>0,a/4294967296);for(const i of[{x0:9,z0:B-.8,dx:.866,dz:.5,len:50,built:12,t0:19.1,v:2.6,hw:12.5,g:5},{x0:-9,z0:B-.8,dx:-.866,dz:.5,len:50,built:10,t0:19.9,v:2.4,hw:12.5,g:6}])await Ve(f,re,{rng:o,pegs:.5,bounds:{x0:i.dx>0?4:-70,x1:i.dx>0?70:-4,y0:-.5,y1:X+.5,z0:B-10,z1:B+42},site(S,H,D){const I=S-i.x0,G=D-i.z0,$=I*i.dx+G*i.dz,oe=Math.abs(-I*i.dz+G*i.dx);if($<0||$>i.len||oe>i.hw*(1-.4*$/i.len)||n(S,D)||H<.1&&ae(S,D))return null;const k=Math.abs(Math.sin(S*12.9898+D*78.233)*43758.5453)%1;return $<i.built?{shade:0}:{T:i.t0+($-i.built)/i.v+(k-.5)*.4,glide:i.g}}});await f.yield()}{const a=k=>f.core.makeRng(f.core.hashSeed(k+":"+f.seed)),o=Math.max(0,40-(ie.length+2)),i=o>=8,S=Math.min(3,Math.floor(o/2)),H=Math.round(Math.max(0,Math.min(8,o-2*S-(i?2:0)))*T),D=[],I=[];for(const k of[1,-1])for(let _=3-S;_<3;_++){const R=x-72.75+_*14.5+(k>0?0:6),O=k*(x-R)*1.732;D.push({x0:O,z0:R,dx:k*.866,dz:.5,len:50,built:12.5,t0:(R-r)/le,v:2.6,hw:10,g:k>0?5:6})}if(i)for(const k of[1,-1]){const _=B-.8+12.5;D.push({x0:k*(9+25*.866),z0:_,dx:0,dz:1,len:40,built:10,t0:(_-r)/le,v:2.6,hw:9,g:k>0?5:6})}if(H>0){const k=a("slm-sprigs");for(let _=0;_<H;_++){const R=_%2?1:-1;let O=r+40+((_>>1)+k())*(x-130-r)/4;Math.abs(O-M)<45&&(O+=80);const U=k()<.7?.5:-.5,K=44+k()*40,ce=7+k()*3;I.push({x0:R*m,z0:O,dx:R*.866,dz:U,len:K,built:K/4,t0:(O-r)/le,v:2.6,hw:ce,g:R>0?5:6})}}const G=(k,_)=>{for(const R of[1,-1]){const O=k-R*9,U=_-(B-.8),K=O*R*.866+U*.5,ce=Math.abs(-O*.5+U*R*.866);if(K>=0&&K<=50&&ce<=12.5*(1-.4*K/50))return!0}return!1},$=(k,_,R)=>{for(const O of k){const U=_-O.x0,K=R-O.z0,ce=U*O.dx+K*O.dz,Ne=Math.abs(-U*O.dz+K*O.dx);if(ce>-4&&ce<=O.len&&Ne<=O.hw*(1-.5*ce/O.len))return{sp:O,u:ce}}return null},oe=(k,_)=>(R,O,U)=>{if(n(R,U)||ae(R,U)||G(R,U)||_&&$(_,R,U))return null;const K=$(k,R,U);if(!K||O>.1||O<-X-.1)return null;const ce=Math.abs(Math.sin(R*12.9898+U*78.233)*43758.5453)%1;return K.u<K.sp.built?{shade:0}:{T:K.sp.t0+(K.u-K.sp.built)/K.sp.v+(ce-.5)*.4,glide:K.sp.g}};D.length&&await Ve(f,re,{rng:a("slm-point"),pegs:.5,bounds:{x0:-m-40,x1:m+40,y0:-X-.5,y1:.5,z0:x-90,z1:x+60},site:oe(D,null)}),await f.yield(),I.length&&await Ve(f,re,{rng:a("slm-sprigs-b"),pegs:.5,bounds:{x0:-m-110,x1:m+110,y0:-X-.5,y1:.5,z0:r-50,z1:x+50},site:oe(I,D)}),await f.yield()}const Re=p.range(.42,.6);[[.2,.1,.97],[-.3,.82+(Re-.42)*.4,.24],[.5,.55,.67],[.55,.6,.58],[.8,.55,.1],[.5,.62,.6],[-.5,.62,.6],[.0575,.0194,-.998]].forEach((a,o)=>l.uGlide.value[o].set(a[0],a[1],a[2]).normalize());for(let a=1;a<=3;a++)l.uFileP.value[a].set(-t[a-1]+j*.5,(a-1)*e+e*.7,0,1),l.uFileD.value[a].set(0,0,1);l.uFileP.value[1].set(2*te,e,0,1),s&&[[-.45,.6,.66],[-.34,.7,.63],[-.2,.78,.59]].forEach((a,o)=>{l.uGlide.value[o+1].set(a[0],a[1],a[2]).normalize(),l.uFileP.value[o+1].set(Math.max(-t[0],y-Z[o])+j*.5,(o+1)*e,0,1),l.uFileD.value[o+1].set(0,0,1)}),l.uFileP.value[4].set(-t[0]+j,2*e,u,1),l.uFileD.value[4].set(.866,0,.5),[he,he,he,he,6.4,he,he,13].forEach((a,o)=>{l.uShow.value[o]=s&&o>=1&&o<=3?[he,5.6,5][o-1]:a});for(const a of[0,5,6,7])l.uFileP.value[a].set(0,0,0,0);l.uRelay.value.set(r,45,5,.35),l.uTierX.value=s?1e6:-t[0]+2*j;const ct=Math.round(110*T);for(let a=0;a<ct;a++){const o=a%3,i=p(),S=p.gauss()*9,H=Math.max(134,142+o*22+i*40+S)+(s?85:0),D=68+o*12+i*26+p.gauss()*6,I=r+20+i*150+o*20+p.gauss()*10;re.vapour(H,D,I,p()*97,p.range(3,6.5),0),(a&63)===0&&await f.yield()}re.guest(-2*j,-2.5,r+96,p()*97,3),re.guest(-3*j,-X-2.5,r+96+3.5*se,p()*97,3),re.guest(j*(s?2:4),(s?0:e)-2.5,r+60,p()*97,2.5),await f.yield();const{balls:Ze,links:He}=await re.build(v,f);V.add(Ze,He),await f.yield();{const a=[],o=[],i=[],S=-(c+A)*X-5,H=S-(L.skirt??420),D=(k,_,R,O,U,K,ce)=>{a.push(k,_,R),o.push(O,U,K),i.push(ce)},I=(k,_)=>{for(let R=1;R<k.length-1;R++)for(const O of[k[0],k[R],k[R+1]])D(O[0],S,O[1],0,1,0,.3);for(let R=0;R<k.length;R++){if(R===_)continue;const O=k[R],U=k[(R+1)%k.length],K=U[0]-O[0],ce=U[1]-O[1],Ne=Math.hypot(K,ce)||1,Pe=ce/Ne,Le=-K/Ne;D(O[0],S,O[1],Pe,0,Le,.3),D(U[0],S,U[1],Pe,0,Le,.3),D(U[0],H,U[1],Pe,0,Le,1),D(O[0],S,O[1],Pe,0,Le,.3),D(U[0],H,U[1],Pe,0,Le,1),D(O[0],H,O[1],Pe,0,Le,1)}},G=x-m/1.732;I([[-m,r],[m,r],[m,G],[0,x],[-m,G]],L.rootWall?-1:0);for(const k of[1,-1]){const _=z[k>0?0:1],R=(O,U)=>[k*m+k*(O*.866-U*.5),M+O*.5+U*.866];I([R(-20,-27),R(_-15.6,-27),R(_,0),R(_-15.6,27),R(-20,27)],4)}const $=new P.BufferGeometry;$.setAttribute("position",new P.Float32BufferAttribute(a,3)),$.setAttribute("normal",new P.Float32BufferAttribute(o,3)),$.setAttribute("aFade",new P.Float32BufferAttribute(i,1));const oe=new P.Mesh($,Ft(v));oe.frustumCulled=!1,oe.name="under",V.add(oe)}await f.yield();const ve=(a,o,i)=>new P.Vector3(a,o,i),$e={place:ve(0,-3*X,850-B),portalSeat:{position:b.clone(),facing:ve(0,0,-1),radius:7},flyThrough:[ve(0,25,r-20),ve(0,25,r+20),ve(0,21,r+110),ve(0,17.4,r+200),ve(0,b.y,B-70),b.clone()],viewpoints:{burst:ve(0,25,r),pace:ve(0,20,r+100),fork:ve(0,18,M-30),ring:ve(0,b.y,B-70)},rootZ:r,tipZ:x,forkZ:u,branchZ:M,halfWidth:m,floorY:0,bottomY:-(c+A)*X,stepHeight:e,stepX:[-t[0],-t[1],-t[2]],branchLength:{left:z[0],right:z[1]},zipSpeed:le,forkClock:(u-r)/le,ringClock:rt,loopSeconds:44,kink:(a,o=new P.Vector3)=>s?o.set(y-Z[0]+j*.5,e,Math.min(Math.max(r+le*a,g-F-30),g+F+30)):o.set(-t[0]+j*.5,e,Math.min(r+le*a,x-80)),kinkB:(a,o=new P.Vector3)=>{if(s)return o.set(y-Z[1]+j*.5,2*e,Math.min(Math.max(r+le*a+W[1],g-F-20),g+F+20));const i=pe+Math.min(me-pe,Math.max(0,Me*(a-ze)));return o.set(-t[0]+j+i*.866,2*e,u+i*.5)},clockForCameraZ:(a,o=45)=>(a+o-r)/le,flaw:s?ve(y-6,1.2*e,g):null,flawB:s?ve(y+1,1.15*e,g+36):null,relayLaneX:[-2*te,-te],counts:{oxygens:Te.count,balls:re.balls,links:re.links}};let De=null;const ft=new P.Vector2;return{object:V,radius:16,height:10,center:new P.Vector3(0,21,10),ground:!1,groundY:-(c+A)*X,style:v,anchors:$e,loose:re.loose,sprung(a,o,i,S,H){St(Ze,He,a,o,i,S,H),$e.counts.links=He.geometry.instanceCount},setClock(a){De=a},paceCamera(a,o=45){De=(a+o-r)/le},setProgress(a){De=a*24},update(a,o,i){l.uTime.value=o,l.uClock.value=De!==null?De:o%44,l.uRT.value=o,l.uBarK.value.y=o*2.5,f.renderer&&(l.uPxH.value=f.renderer.getDrawingBufferSize(ft).y*.5)},dispose(){}}}const Lt=`
attribute float aFade; varying vec3 vPos, vN, vV; varying float vFade;
void main(){ vPos = position; vN = normal; vFade = aFade; vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = mv.xyz; gl_Position = projectionMatrix * mv; }`,Bt=`
varying vec3 vPos, vN, vV; varying float vFade;
void main(){
  vec3 an = abs(vN);
  vec2 p = an.z >= max(an.x, an.y) ? vPos.xy : (an.y >= an.x ? vec2(vPos.x, vPos.z * 0.6124) : vec2(vPos.z * 0.6124, vPos.y));
  vec2 per = vec2(${(2*j).toFixed(4)}, ${ue.toFixed(4)}), hp = per * 0.5;
  vec2 a = mod(p + hp, per) - hp, b = mod(p + hp - vec2(${j.toFixed(4)}, ${X.toFixed(4)}), per) - hp;
  vec2 g = abs(dot(a, a) < dot(b, b) ? a : b);
  float h = max(g.y, g.x * 0.866 + g.y * 0.5);
  float fw = max(fwidth(p.x) + fwidth(p.y), 1e-4) * 0.7;
  float wall = smoothstep(5.3 - fw, 5.3 + fw, h);
  wall = mix(wall, 0.6, smoothstep(1.6, 4.5, fw));
  vec3 cw = mix(uPal[0], uPal[1], 0.5) * vec3(0.84, 0.84, 0.92);
  vec3 ch = uPal[5] * vec3(0.66, 0.62, 0.72);
  vec3 col = mix(ch, mix(cw, uPal[5], 0.3), wall);
  col = mix(col, mix(uPal[5] * vec3(0.93, 0.92, 0.95), mix(uPal[5], vec3(1.0), 0.4), wall), clamp(vFade, 0.0, 1.0));
  if (an.y >= max(an.x, an.z)) {
    col = mix(col, uPal[5] * vec3(0.12, 0.055, 0.10), 0.84 + 0.10 * smoothstep(uTierX - 4.0, uTierX + 6.0, vPos.x));   // seen down the wells: the nave's plum
    col = mix(col, uPal[5] * 0.62, (1.0 - smoothstep(1.5, 2.6 + fw, length(g))) * 0.5 * (1.0 - smoothstep(1.6, 4.5, fw)));   // and a little rose at the bottom of each
  }
  gl_FragColor = vec4(slmAerial(col, length(vV)), 1.0);
}`;function Ft(f){return new P.ShaderMaterial({uniforms:f.uniforms,side:P.DoubleSide,vertexShader:ge+Lt,fragmentShader:ge+Bt})}export{Dt as LATTICE,Ue as MOTION_GLSL,Ie as PALETTE,qe as SHADE_GLSL,ge as STYLE_GLSL,Ft as backingMaterial,xt as ballMaterial,Ot as buildColumn,Vt as buildHero,Ve as buildLattice,gt as linkMaterial,tt as looseAt,kt as makeBatch,Ct as makeHelixPool,ut as makeStyle};
