import*as o from"three";const Y={half:1200,slope:.325,apex:3693},L={x0:290,x1:532,y0:160,y1:194,zBack:1104,head:190,wall:7},X=[[290,296],[336,344],[384,392],[432,440],[480,488],[524,532]],K={x:30,w:14,h:34},ie=y=>({x:48*y.int(Math.floor(K.x/48)+1,Math.floor(L.x0/48)-1)+28,y:105,hw:18,hh:9}),I=y=>Y.half-Y.slope*y,_=y=>new o.Color(y);function ne(y={}){const s=_("#FFC46B"),l=_("#A3211B"),u=_("#DDEBFF"),t=_("#3C66E0"),e={uTime:{value:0},uKeyCol:{value:s.clone().multiplyScalar(1.1)},uKeyAt:{value:new o.Vector3(850,1350,-910)},uAmb:{value:new o.Color(.006,.006,.011)},uPit:{value:[0,1,2,3].map(()=>new o.Vector4(0,-1e3,0,1))},uPitCol:{value:[0,1,2,3].map(()=>l.clone().multiplyScalar(3.2))},uPale:{value:[0,1,2].map(()=>new o.Vector4(0,-1e3,0,1))},uPaleCol:{value:[0,1,2].map(()=>new o.Color(0,0,0))},uSkyZen:{value:new o.Color(.0021,.0019,.0034)},uSkyHor:{value:new o.Color(.013,.013,.024)},uHaze:{value:new o.Color(.105,.056,.02)},uFog:{value:new o.Vector4(6e-4,.0011,26,22e-5)},uPyrDir:{value:new o.Vector2(0,-1)},uRingCol:{value:u.clone().multiplyScalar(1)},uGlowMap:{value:null},uGlowBox:{value:new o.Vector4(-760,1360,1/1280,1/800)},uRes:{value:new o.Vector2(1280,720)}};return y.fog&&e.uFog.value.fromArray(y.fog),{uniforms:e,colors:{amber:s,red:l,pale:u,blue:t}}}const O=`
uniform float uTime;
uniform vec3 uKeyCol, uKeyAt, uAmb, uSkyZen, uSkyHor, uHaze, uRingCol;
uniform vec3 uPitCol[4];
uniform vec4 uPit[4];
uniform vec4 uPale[3]; uniform vec3 uPaleCol[3];
uniform vec4 uFog; uniform vec2 uPyrDir;
float nlH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
float nlH3(vec3 p){ p = fract(p*0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y)*p.z); }
float nlN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(nlH(i), nlH(i + vec2(1.0, 0.0)), f.x), mix(nlH(i + vec2(0.0, 1.0)), nlH(i + vec2(1.0, 1.0)), f.x), f.y); }
float nlN3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  float a = mix(mix(nlH3(i), nlH3(i + vec3(1.,0.,0.)), f.x), mix(nlH3(i + vec3(0.,1.,0.)), nlH3(i + vec3(1.,1.,0.)), f.x), f.y);
  float b = mix(mix(nlH3(i + vec3(0.,0.,1.)), nlH3(i + vec3(1.,0.,1.)), f.x), mix(nlH3(i + vec3(0.,1.,1.)), nlH3(i + vec3(1.,1.,1.)), f.x), f.y);
  return mix(a, b, f.z); }
float nlF(vec2 p){ return 0.54*nlN(p) + 0.29*nlN(p*2.03 + 17.3) + 0.17*nlN(p*4.1 + 31.7); }
// colour of the night in a direction: black overhead, a cold band at the horizon, amber air toward the face
vec3 nlSky(vec3 d){
  float e = max(d.y, 0.0);
  float hl = length(d.xz);
  float tp = max(dot(d.xz/max(hl, 1e-4), uPyrDir), 0.0);
  vec3 c = uSkyZen + uSkyHor*exp(-e*10.0) + uHaze*(0.3*tp + 0.7*tp*tp*tp)*exp(-e*2.2)*smoothstep(0.0, 0.05, hl);
  // the fire country: its dull red lies low under the smoke on every bearing but the house's, uneven, slowly creeping
  vec2 dn = d.xz/max(hl, 1e-4);
  float lay = 0.45 + 0.55*nlN(dn*2.6 + vec2(uTime*0.013, 7.0)) + 0.35*(nlN(dn*9.0 - vec2(3.0, uTime*0.021)) - 0.5);
  float away = 1.0 - smoothstep(0.1, 0.95, tp);
  return c + vec3(0.065, 0.0095, 0.007)*(away*smoothstep(0.0, 0.05, hl)*max(lay, 0.0)*(exp(-e*7.0) + 0.36*exp(-e*2.2)));
}
float nlFogAmount(vec3 P, float dens){
  vec3 v = P - cameraPosition; float dist = length(v);
  float f1 = 1.0 - exp(-dist*dist*dens*dens);
  float H = uFog.z, y0 = max(cameraPosition.y, 0.0), y1 = max(P.y, 0.0), dy = y1 - y0;
  float sdy = dy >= 0.0 ? max(dy, 0.5) : min(dy, -0.5);
  float mean = mix(exp(-0.5*(y0 + y1)/H), H*(exp(-y0/H) - exp(-y1/H))/sdy, step(0.5, abs(dy)));
  float f2 = 1.0 - exp(-uFog.y*dist*mean);
  return 1.0 - (1.0 - f1)*(1.0 - f2);
}
vec3 nlFog(vec3 col, vec3 P){
  vec3 v = P - cameraPosition; vec3 d = v/max(length(v), 1e-3);
  return mix(col, nlSky(d), nlFogAmount(P, uFog.x));
}
// the light of the Night Land on a surface: amber from the face (falling off with distance from it) and its rim on
// whatever turns its edge to it, red from the nearest pits, the pale lights (dome, ring crossing, gallery)
float nlKeyFall(vec3 P){
  vec2 q = max(abs(P.xz) - vec2(1200.0), 0.0);
  float d = length(q);
  return 1.0/(1.0 + d*d/(650.0*650.0));
}
vec3 nlKey(vec3 P, vec3 N, vec3 V, vec3 alb, float rimK){
  vec3 L = normalize(uKeyAt - P);
  float fall = nlKeyFall(P);
  float nl = max(dot(N, L), 0.0);
  float fr = 1.0 - max(dot(N, V), 0.0);
  float rim = fr*fr; rim = rim*rim*fr*nl*nl;
  return alb*(uAmb + uKeyCol*(nl*fall*0.42)) + uKeyCol*rim*rimK*fall;
}
vec3 nlPits(vec3 P, vec3 N, vec3 V, vec3 alb, float rimK){
  vec3 c = vec3(0.0); float fr = 1.0 - max(dot(N, V), 0.0);
  for (int i = 0; i < 4; i++) {
    vec3 dl = uPit[i].xyz - P; float r2 = dot(dl, dl);
    float a = 1.0/(1.0 + r2/(uPit[i].w*uPit[i].w));
    float w = 0.3 + 0.7*max(dot(N, dl)*inversesqrt(r2 + 1e-3), 0.0);
    c += (alb + 0.25*rimK*fr*fr)*uPitCol[i]*a*w;
  }
  return c;
}
vec3 nlPales(vec3 P, vec3 N, vec3 V, vec3 alb, float rimK){
  vec3 c = vec3(0.0); float fr = 1.0 - max(dot(N, V), 0.0);
  for (int i = 0; i < 3; i++) {
    vec3 dl = uPale[i].xyz - P; float r2 = dot(dl, dl);
    float a = 1.0/(1.0 + r2/(uPale[i].w*uPale[i].w));
    float w = 0.3 + 0.7*max(dot(N, dl)*inversesqrt(r2 + 1e-3), 0.0);
    c += (alb + 0.2*rimK*fr*fr)*uPaleCol[i]*a*w;
  }
  return c;
}
// how the lights of the face thin with height: full to 150 m, four fifths at 250 m, 37 in 100 at 600 m, embers (12 in 100) at 1100 m, out by 1600 m
float nlHeightDim(float y){ return exp(-max(y - 150.0, 0.0)/450.0)*(1.0 - smoothstep(1100.0, 1600.0, y)); }
// the ring: distance outside it (m), the way that points out from it, and its slow pulses travelling round
float nlRingD(vec2 p){
  vec2 q = abs(p) - vec2(1200.0);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 220.0;
}
vec2 nlRingN(vec2 p){
  vec2 q = abs(p) - vec2(1200.0);
  vec2 g = max(q.x, q.y) < 0.0 ? (q.x > q.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0)) : normalize(max(q, 0.0) + 1e-5);
  return g*vec2(p.x < 0.0 ? -1.0 : 1.0, p.y < 0.0 ? -1.0 : 1.0);
}
float nlRingPulse(vec2 p){
  float a = atan(p.y, p.x + 1e-5);
  float node = mod(a*5.0 - uTime*0.19, 6.2831853) - 3.14159265;
  return 0.78 + 0.16*sin(a*37.0 - uTime*0.45) + 0.45*exp(-node*node*30.0);
}
// the clear light of the ring on whatever stands within a few metres of it (the tube lies half a metre over the ground)
vec3 nlRing(vec3 P, vec3 N, vec3 alb){
  float rd = nlRingD(P.xz); vec2 g = nlRingN(P.xz);
  vec3 dl = vec3(-g.x*rd, 0.5 - P.y, -g.y*rd); float r2 = dot(dl, dl);
  return alb*uRingCol*(1.3*nlRingPulse(P.xz)*(0.25 + 0.75*max(dot(N, dl)*inversesqrt(r2 + 1e-3), 0.0))/(1.0 + r2/60.0));
}
vec3 nlLight(vec3 P, vec3 N, vec3 V, vec3 alb, float rimK){
  return nlKey(P, N, V, alb, rimK) + nlPits(P, N, V, alb, rimK) + nlPales(P, N, V, alb, rimK) + nlRing(P, N, alb);
}
`,j=1024,R=512;async function se(y,s){const l=s.rng,u=y.noise,t=s.lit??.7,e=new Uint8Array(j*R*4),i=12,h=10,a=Math.ceil(j/i),x=Math.ceil(R/h),C=new Float32Array(a*x),r=new Float32Array(a*x),n=new Float32Array(a*x);for(let w=0;w<x;w++)for(let g=0;g<a;g++){const z=u.fbm2(g*.11+3.1,w*.17-7.7,3),k=u.n2(g*.031-11,w*.05+5);let P=t+.42*z+.2*k;const F=l();F<.1+(.7-t)*.5?P*=.12:F<.24?P*=.5:F>.9&&(P=Math.max(P,.92));const v=(w+.5)*h*6;P*=1-.75*Math.min(1,Math.max(0,(v-420)/1150)),C[w*a+g]=Math.min(.97,Math.max(.02,P)),r[w*a+g]=l()<.16?l.range(.5,1):l.range(0,.22),n[w*a+g]=l()}let f=0;const p=(w,g)=>C[Math.min(x-1,Math.max(0,g))*a+(w%a+a)%a];for(let w=0;w<R;w++){const g=Math.floor(w/h)*a,z=w/h-.5,k=Math.floor(z),P=z-k;for(let F=0;F<j;F++,f+=4){const v=g+Math.floor(F/i),N=l(),M=l(),V=l(),Z=l();let D=C[v];if(n[v]<.9||D<.6){const B=F/i-.5+(Z-.5)*.5,W=Math.floor(B),T=B-W;D=(p(W,k)*(1-T)+p(W+1,k)*T)*(1-P)+(p(W,k+1)*(1-T)+p(W+1,k+1)*T)*P}const E=N<D,A=V<.8?E:M<D,S=(M<.5?.14+.36*M:M<.9?.32+(M-.5):.72+(M-.9)*2.8)*Math.min(1.1,.5+.7*D),q=Math.max(24,Math.min(255,Math.floor(255*S)));e[f]=E?q:0,e[f+1]=A?q:0,e[f+2]=Math.floor(255*Math.min(1,Math.max(0,r[v]+(V-.5)*.3))),e[f+3]=Math.floor(Z*255.99)}(w&15)===15&&await y.yield()}const m=new o.DataTexture(e,j,R,o.RGBAFormat,o.UnsignedByteType);return m.wrapS=m.wrapT=o.RepeatWrapping,m.magFilter=o.LinearFilter,m.minFilter=o.LinearMipmapLinearFilter,m.generateMipmaps=!0,m.anisotropy=Math.min(8,y.renderer?.capabilities?.getMaxAnisotropy?.()||1),m.needsUpdate=!0,m}const re=`
attribute vec3 aF;                       // x along the face from its centre (m), y up (m), z: which of the four faces
varying vec3 vW; varying vec3 vF;
void main(){
  vF = aF; vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,ce=`
precision highp float;
${O}
uniform sampler2D uWin; uniform vec2 uTex; uniform vec4 uGal; uniform vec3 uGate, uMetal, uLamp, uPaleLamp;
uniform vec2 uGreet;                     // the greeting wave: height it has reached (m), strength
uniform float uWinE, uWake, uGalK, uDim;
uniform vec3 uDimLamp, uWatch; uniform vec4 uPort;
uniform vec4 uCity;                     // polish round 1: two offsets dealt from the 'cities' stream, the share of bays with a great embrasure, the share of piers with a shaft
varying vec3 vW; varying vec3 vF;
float gDim;
// THE WATCH (a rule of the house, on every visit): the floors between the great gate and the great gallery, from the
// ground to six floors over the gallery's lintel, are the night watch's quarters, and the watch keeps its lamps lit
float watchK(vec2 p){ return (1.0 - smoothstep(uWatch.y, uWatch.y + 80.0, abs(p.x - uWatch.x)))*(1.0 - smoothstep(uWatch.z, uWatch.z + 60.0, p.y)); }
float boxCov(float x, float w, float a, float b){ return clamp((min(x + 0.5*w, b) - max(x - 0.5*w, a))/max(w, 1e-5), 0.0, 1.0); }
float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
// polish round 1 (P3e): how much of a pixel a window covers, by its kind: a box (x0..x1, y0..y1 of its cell), a pair of
// small ones side by side, or a round one 2.6 m across
// second part (G3b): the head of a street's opening is an arch: round, 1.4 m in radius, springing at 4.18 m
float archCov(vec2 p, vec2 w){
  vec2 q = vec2((p.x - 0.5)*4.0, max(p.y*6.0 - 4.18, 0.0)); float aw = max(w.x*4.0, w.y*6.0)*0.5 + 1e-3;
  return 1.0 - smoothstep(1.4 - aw, 1.4 + aw, length(q));
}
float winCov(vec2 p, vec2 w, vec4 b, float small, float rnd){
  float box = boxCov(p.x, w.x, b.x, b.y)*boxCov(p.y, w.y, b.z, b.w);
  float two = (boxCov(p.x, w.x, 0.14, 0.4) + boxCov(p.x, w.x, 0.6, 0.86))*boxCov(p.y, w.y, 0.4, 0.62);
  vec2 q = (p - vec2(0.5, 0.4667))*vec2(4.0, 6.0); float aw = max(w.x*4.0, w.y*6.0)*0.5 + 1e-3;
  return mix(mix(box, two, small), 1.0 - smoothstep(1.3 - aw, 1.3 + aw, length(q)), rnd);
}
// one point of light for a block of windows: k = log2 of the block's size in windows, per axis
float farPoint(vec2 c, vec2 k){
  vec2 sz = exp2(k), bc = c/sz, bi = floor(bc), bf = bc - bi;
  vec4 t = textureLod(uWin, (bi + 0.5)*sz/uTex, min(k.x, k.y));
  float mean = 0.5*(t.r + t.g);
  mean += gDim*clamp(1.0 - mean*2.6, 0.0, 1.0);          // the night lamps of the rooms asleep
  vec2 jk = smoothstep(vec2(0.0), vec2(1.0), k);
  float h = nlH(bi + k*17.0), h2 = nlH(bi + k.yx*23.0 + 5.5), h3 = nlH(bi*1.7 + k*5.0 + 11.0);
  // far off, the light of a floor runs together along it: each point is drawn out along its row (a weave of faint
  // lines; single windows only nearer), and at least half the blocks carry their light, so that upward and far along
  // the face thins smoothly and never into loose dots
  float p = mix(1.0, clamp(mean*2.4 + 0.5, 0.5, 1.0), max(jk.x, jk.y));
  vec2 q = bf - 0.5 - (vec2(h, h2) - 0.5)*0.55*jk; q.y += 0.0333*(1.0 - jk.y);
  return step(h3, p)*(mean/p)*0.1733*2.86*mix(1.0, 0.64, jk.x)*exp(-q.x*q.x*mix(9.0, 1.0, jk.x) - q.y*q.y*9.0);
}
// The three strata of smoke lie against the face as bars (300 to 380 m, 620 to 700 m, 980 to 1040 m up, some 160 m deep,
// ragged, drifting west): how much of the light of a point F of the face reaches an eye in the direction V through them.
// It is worked out along the line of sight, so it is right for any eye: from far below a bar is black across the windows
// and the rows above it show again, dimmer.
float smokeT(vec3 F, vec3 V, float dist){
  float gk = max(V.z + 0.325*V.y, 1e-3), vy = abs(V.y) < 1e-3 ? 1e-3 : V.y, tau = 0.0;
  float xw = F.x + uTime*3.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float wob = 36.0*(nlN(vec2(xw/230.0, fi*9.1)) - 0.5) + 14.0*(nlN(vec2(xw/60.0, fi*3.3 + 5.0)) - 0.5);
    float h0 = (i == 0 ? 300.0 : i == 1 ? 620.0 : 980.0) + wob, h1 = h0 + (i == 2 ? 60.0 : 80.0) + 0.5*wob;
    float dn = 0.3 + 1.6*smoothstep(0.25, 0.75, nlN(vec2(xw/520.0, fi*5.7 + 2.0)));
    float deep = 160.0*(0.6 + 0.8*nlN(vec2(xw/340.0, fi*2.9 + 7.0)));
    float sa = (h0 - F.y)/vy, sb = (h1 - F.y)/vy;
    float s0 = max(min(sa, sb), 0.0), s1 = min(max(sa, sb), min(dist, deep/gk));
    tau += dn*0.012*max(s1 - s0, 0.0);
  }
  return 0.42 + 0.58*exp(-tau);
}
void main(){
  float fx = vF.x, fy = vF.y, face = vF.z, f0 = 1.0 - step(0.5, face);
  vec3 toEye = cameraPosition - vW; float dist = length(toEye); vec3 V = toEye/max(dist, 1e-3);
  vec2 c = vec2((fx + 1200.0)/4.0 + face*211.0, fy/6.0);
  vec2 fw = max(fwidth(c), vec2(1e-5));
  vec2 pc = vec2((fx + 1200.0)/240.0, fy/300.0), pw = max(fwidth(pc), vec2(1e-6));
  vec2 ci = floor(c), cf = c - ci;
  // the bays of the wall: every twelfth and thirteenth column is a blank pier of plate, every tenth floor an open gallery
  // with a rail and people along it
  float rib = 1.0 - step(1.5, mod(ci.x, 12.0));
  // the mouths of the great gallery: the bays between the piers, from its floor to the lintel
  if (f0*step(uGal.x, fx)*step(fx, uGal.y)*step(uGal.z, fy)*step(fy, uGal.w)*(1.0 - rib) > 0.5) discard;
  float band = (1.0 - step(0.5, mod(ci.y, 10.0)))*step(5.0, ci.y)*(1.0 - rib);
  vec2 e0 = c - 0.5*fw, e1 = c + 0.5*fw;
  float ribFar = clamp((floor(e1.x/12.0)*2.0 + clamp(fract(e1.x/12.0)*12.0, 0.0, 2.0) - floor(e0.x/12.0)*2.0 - clamp(fract(e0.x/12.0)*12.0, 0.0, 2.0))/fw.x, 0.0, 1.0);
  vec4 tn = textureLod(uWin, (ci + 0.5)/uTex, 0.0);
  vec4 tb = textureLod(uWin, c/uTex, 3.2);
  vec2 cc = vec2((ci.x + 0.5 - face*211.0)*4.0 - 1200.0, (ci.y + 0.5)*6.0);
  float wq = f0*watchK(cc), wqF = f0*watchK(vec2(fx, fy)), hN = nlH(ci + 53.1);
  gDim = mix(uDim*0.09, 0.3, wqF);
  float hd = nlHeightDim(fy);
  // ---- POLISH ROUND 1 (P3): THE CITIES. The house is many cities, one above another: a city is ten storeys (60 m) high,
  // its lowest storey its street (the open floor that was there); a bay is 48 m. kfl: the storey within its city.
  float kfl = mod(ci.y, 10.0), cityJ = floor(ci.y/10.0), bayI = floor(ci.x/12.0);
  // a stretch of a city (240 m of it, about one in seven) sleeps; none in the watch's quarters
  float sleepK = step(nlH(vec2(floor(ci.x/60.0), cityJ)*1.7 + uCity.yx + 3.0), 0.14)*(1.0 - step(0.02, wq));
  float cityOn = 1.0 - sleepK;
  // (b) a great embrasure: in one bay in so many of a city (the share and which: the 'cities' stream), the rooms of the
  // three storeys under the next city's street are one hall open to the night, as the hall of the watch is; none in
  // the watch's quarters (its own hall is there), none in the lowest city, none within 60 m of the face's edge
  vec2 eC = vec2((bayI*12.0 + 7.0 - face*211.0)*4.0 - 1200.0, cityJ*60.0 + 45.0);
  float eOn = step(nlH(vec2(bayI, cityJ)*1.31 + uCity.xy), uCity.z)*step(0.5, cityJ)*(1.0 - step(0.02, f0*watchK(eC)))*step(60.0, (1200.0 - 0.325*(eC.y + 9.0)) - abs(eC.x));
  float embZ = eOn*step(abs(cc.x - eC.x), 20.0)*step(abs(cc.y - eC.y), 10.0), embZF = eOn*step(abs(fx - eC.x), 20.0)*step(abs(fy - eC.y), 10.0);
  // ---- the plate: seams of the great plates, panel lines; close by, the joint of every bay and floor, a course of rivets
  // over each joint, the runs of an age of weather; a wash of the light of its own windows and a little of the night's
  vec2 pf = 0.5 - abs(fract(pc) - 0.5);
  float seam = max(1.0 - smoothstep(0.0, 1.5*pw.x + 0.0011, pf.x), 1.0 - smoothstep(0.0, 1.5*pw.y + 0.0009, pf.y))*clamp(0.0035/(max(pw.x, pw.y) + 0.0035), 0.0, 1.0);
  vec2 sc = pc*10.0, sf = 0.5 - abs(fract(sc) - 0.5), sw = pw*10.0;
  float fine = max(1.0 - smoothstep(0.0, 1.5*sw.x + 0.004, sf.x), 1.0 - smoothstep(0.0, 1.5*sw.y + 0.004, sf.y))*clamp(0.02/(max(sw.x, sw.y) + 0.02) - 0.3, 0.0, 1.0);
  float tone = 0.7 + 0.6*nlH(floor(pc) + face*13.0) + 0.1*(nlH(floor(sc)) - 0.5)*clamp(0.02/(max(sw.x, sw.y) + 0.02), 0.0, 1.0);
  float mpp = max(fw.x*4.0, fw.y*6.0), kc = 1.0 - smoothstep(0.08, 0.5, mpp);          // metres of wall to a pixel
  vec2 jf = 0.5 - abs(cf - 0.5);
  float joint = max(1.0 - smoothstep(0.0, 1.5*fw.x + 0.008, jf.x), 1.0 - smoothstep(0.0, 1.5*fw.y + 0.006, jf.y))*kc;
  float rivet = (1.0 - smoothstep(0.03, 0.06, length(vec2((fract(cf.x*8.0) - 0.5)*0.5, cf.y*6.0 - 0.2))))*(1.0 - smoothstep(0.02, 0.07, mpp));
  float run = smoothstep(0.5, 0.85, nlN(vec2(fx*2.7, ci.y*5.7 + face)))*(0.25 + 0.75*fract(cf.y + 0.75))*kc;
  float ledge = (1.0 - step(0.5, mod(ci.y, 10.0)))*step(5.0, ci.y)*(1.0 - smoothstep(0.0, 0.012 + fw.y, abs(cf.y - 0.1)))*kc;
  float spill = (0.5*(tb.r + tb.g) + gDim*clamp(1.0 - 1.3*(tb.r + tb.g), 0.0, 1.0))*hd;
  float fa = face*1.5707963;
  vec3 N = vec3(sin(fa)*0.951, 0.3091, cos(fa)*0.951);
  vec3 metal = uMetal*tone*(1.0 - 0.55*seam - 0.3*fine)*(1.0 + 0.3*rib)*(1.0 - 0.5*joint)*(1.0 - 0.32*run)*(1.0 + 0.6*rivet + 0.5*ledge);
  // two pipes run up every pier, clipped to it at each floor
  float xr = (mod(ci.x, 12.0) + cf.x)*4.0, pd = min(abs(xr - 1.5), abs(xr - 6.8)), pwd = 0.22 + fw.x*4.0;
  float pipe = rib*kc*(1.0 - smoothstep(0.2, pwd + 0.04, pd));
  metal *= 1.0 + pipe*(1.1*(1.0 - clamp(pd/0.24, 0.0, 1.0)) - 0.4) - 0.3*rib*kc*(smoothstep(0.24, 0.3, pd) - smoothstep(0.3, 0.8, pd)) + 0.5*pipe*step(cf.y, 0.05);
  // polish round 1 (P3c): the ribs (the piers, 8 m wide) stand out from the plate: the plate beside a rib lies in its
  // shade, the rib's own edges catch the light, and seen aslant the rib shows its flank (0.9 m deep) over the plate
  // beside it; and the plate is stained by the water of ages under every street, in runs up to 25 m long
  float dRib = min(xr - 8.0, 48.0 - xr), dEdge = min(xr, 8.0 - xr);
  metal *= (1.0 - 0.34*(1.0 - rib)*exp(-max(dRib, 0.0)/1.7))*(1.0 + 0.4*rib*exp(-max(dEdge, 0.0)/(0.3 + fw.x*4.0)));
  // (second part, G4c: on all four faces, by the view along each face's own length and out from it. G4b, ANTIALIASING:
  // the rib's lit edge above is widened by a pixel's footprint, fw.x; so is the car's light in a shaft below, by wY.)
  float vxl = V.x*cos(fa) - V.z*sin(fa), vzl = V.x*sin(fa) + V.z*cos(fa);
  float flankW = min(0.9*abs(vxl)/max(vzl, 0.05), 1.2), flank = (1.0 - rib)*(vxl < 0.0 ? step(xr - 8.0, flankW) : step(48.0 - xr, flankW));
  float stain = smoothstep(0.5, 0.9, nlN(vec2(fx*0.8 + face*31.0, cityJ*7.0)))*exp(-(60.0 - mod(fy, 60.0))/25.0)*(1.0 - rib);
  metal *= 1.0 - 0.38*stain;
  // the night's own light on the plate (what the land's fires and the ring send up, and the eye grown used to the dark),
  // the amber thrown back by the swept ground at its foot, and the glow of its own windows in the air before it
  // (the plate is seen wherever its windows are: the night's glow stays on it far above where the lamps thin, a step
  // lighter than the sky; the fire country reddens its lower flank; far off the bloom of its windows lies between them)
  vec3 night = vec3(0.2, 0.21, 0.27)*(0.32 + 0.68*hd) + vec3(0.2, 0.12, 0.05)*exp(-max(fy, 0.0)/90.0)*uWake + vec3(0.07, 0.016, 0.012)*exp(-max(fy, 0.0)/500.0);
  vec3 col = metal*(night + uLamp*spill*(0.3 + 0.22*rib + 0.3*(1.0 - kc))) + nlPits(vW, N, V, metal, 0.0) + nlPales(vW, N, V, metal, 0.0);
  col += metal*(night*0.25 + uLamp*spill*0.5)*flank;
  // ---- which cells carry a window: none on the lowest two floors, in the frame of the gate or in the frame of the gallery
  float gateZ = f0*(1.0 - step(uGate.y + 4.0, abs(cc.x - uGate.x)))*(1.0 - step(uGate.z + 5.0, cc.y));
  float galZ = f0*step(uGal.x - 2.0, cc.x)*step(cc.x, uGal.y + 2.0)*step(uGal.z - 1.0, cc.y)*step(cc.y, uGal.w + 6.0);
  float portZ = f0*step(abs(cc.x - uPort.x), uPort.z + 2.0)*step(abs(cc.y - uPort.y), uPort.w + 1.0);
  float wm = step(12.0, cc.y)*(1.0 - gateZ)*(1.0 - galZ)*(1.0 - portZ)*(1.0 - embZ)*(1.0 - rib);
  // ---- the window. Near: an exact box filter of the embrasure. Far: the wall is a field of points, one for each block
  // of 2^k windows (k from the size of a pixel, taken per axis), carrying the block's light from the texture's mip chain
  float wx = smoothstep(0.28, 0.6, fw.x), wy = smoothstep(0.28, 0.6, fw.y), wfar = max(wx, wy);
  float tri = abs(fract(tn.a + uTime*0.03 + nlH(ci)*0.37)*2.0 - 1.0);
  float st = smoothstep(0.47, 0.53, tri);
  // a bay of an open floor is lit when its lamp is lit in either state: no brighter than a window, and as often dark
  float open = mix(mix(step(0.01, tn.r), step(0.01, tn.g), st), step(0.01, tn.r + tn.g), band);
  float bN = max(tn.r, tn.g)*mix(1.0, 0.75, band);
  // polish round 1 (P3a): a city's street is lit along its whole length where the city wakes (a lamp to every bay)
  // (second part, G3a: not along its whole length: in stretches of 12 m, about three in five; the rest is as it was,
  // lit bay by bay or dark. A street's bay is a wider opening than a window, so its light is held to 0.55.)
  float stOn = step(0.4, nlH(vec2(floor(ci.x/3.0), cityJ) + 47.0)), stK = mix(1.0, 0.55, band);
  float mineS = band*cityOn*stOn*(1.0 - open);          // (G4d: a street's bay that this round lit, and live did not)
  open = max(open, band*cityOn*stOn); bN = max(bN, 0.4*band*cityOn*stOn);
  // a room asleep keeps a low night lamp, two rooms in three (bluer than the evening's lamps); in the watch's quarters
  // nearly every room keeps a full one
  float dimOn = (1.0 - open)*step(hN, mix(uDim, 0.9, wq));
  open = max(open, dimOn);
  bN = mix(bN, mix(0.06, 0.2 + 0.4*fract(hN*7.3), wq), dimOn);
  float dimK = mix(1.0, mix(0.3, 1.0, wq), dimOn);
  // rooms of unlike widths: a slit, a common window, a broad one
  float wv = nlH(ci + 91.7), wh = mix(wv < 0.22 ? 0.11 : wv < 0.8 ? 0.2 : 0.34, 0.44, band);
  // polish round 1 (P3e, P3a): windows of unlike kinds by storey. The storey over a street has tall hall windows; the
  // fifth and sixth storeys of a city have rows of small ones, two to a room; the storey under a street has round
  // ones; the street itself is a taller storey, open from the sill to 5.6 m
  float tallK = step(0.5, kfl)*step(kfl, 1.5), smallK = step(4.5, kfl)*step(kfl, 6.5), roundK = step(8.5, kfl);
  wh = mix(wh, 0.3, tallK);
  wh = mix(wh, 0.35, band);                 // (second part, G3b: a pier 1.2 m wide between the street's openings; it was 0.5 m)
  float wx0 = 0.5 - wh, wx1 = 0.5 + wh, wy0 = mix(0.25, 0.17, tallK), wy1 = mix(mix(0.6833, 0.93, band), 0.87, tallK);
  vec4 wbox = vec4(wx0, wx1, wy0, wy1);
  float covFull = winCov(cf, fw, wbox, smallK, roundK)*mix(1.0, archCov(cf, fw), band);
  float covOpen = covFull*open;
  vec2 lod = min(max(log2(fw*3.2), vec2(0.0)), vec2(12.0)), l0 = floor(lod), lf = lod - l0;
  float bF = mix(mix(farPoint(c, l0), farPoint(c, l0 + vec2(1.0, 0.0)), lf.x), mix(farPoint(c, l0 + vec2(0.0, 1.0)), farPoint(c, l0 + vec2(1.0)), lf.x), lf.y);
  float h1 = nlH(ci + 7.3), h2 = nlH(ci + 31.7), h3 = fract(tn.a*7.13 + h1);
  // life: each lamp breathes, somebody crosses in front of it now and then and all but hides it; far off, a scintillation
  // (the house is awake and watching: a window changes its state about every 17 s)
  float cross1 = smoothstep(0.86, 0.97, sin(uTime*(0.5 + 0.9*h2) + h1*40.0));
  float flN = 0.86 + 0.14*sin(uTime*(1.3 + 2.9*h1) + tn.a*40.0) - 0.7*cross1;
  float flF = 0.72 + 0.6*nlN3(vec3(c*0.21, uTime*0.9)) + 0.24*(nlN3(vec3(c*0.045 + 9.0, uTime*0.45)) - 0.5);
  float bright = bN*flN;
  // lamps carried along a floor, room to room
  float fl = ci.y, lh = nlH(vec2(fl, 3.0)), ldir = lh > 0.5 ? 1.0 : -1.0;
  float lx = mod(lh*97.0 + uTime*ldir*(0.25 + 0.3*nlH(vec2(fl, 9.0))) - ci.x + 15.5, 31.0) - 15.5;
  bright *= 1.0 + 1.3*step(0.62, nlH(vec2(fl, 5.0)))*exp(-lx*lx*1.6);
  // the greeting (rare): a front of brightness climbing the rows
  float gz = uGreet.x - fy;
  float greet = 1.0 + uGreet.y*smoothstep(-30.0, 0.0, gz)*(0.35 + 0.9*exp(-max(gz, 0.0)/90.0));
  float gK = mix(greet*uWake, 1.0, mineS);             // (G4d: what this round lit burns steadily and takes no part in the greeting)
  bright *= gK*mix(1.0, 0.4, sleepK);                    // (polish round 1, P3c: where a city sleeps its lamps are low)
  vec3 wcol = mix(uLamp, uPaleLamp, tn.b);
  wcol = mix(wcol, mix(uDimLamp, wcol, wq), dimOn);
  float E = uWinE*mix(0.45, 1.0, smoothstep(0.03, 0.2, fw.x));
  vec3 win = wcol*(E*bright*hd*stK);
  float litCov = covOpen*wm*(1.0 - wfar);
  // ---- wherever a window is more than a point: the reveal of the wall (0.7 m of plate at the sill and the jambs), the
  // people standing at the sill, the room behind (interior mapping: back wall, floor line, a lamp, a doorway)
  float wI = (1.0 - wfar)*f0*wm*open;
  if (wI > 0.001 && covFull > 0.001) {
    vec3 D = -V; float dz = max(-D.z, 0.02);
    vec2 l0 = vec2(cf.x*4.0, cf.y*6.0);
    // the room: x 0.15..3.85 (an open floor runs on behind its posts), y 0.6..5.7, depth 0.7..6.6
    float tb1 = 6.6/dz;
    float tx = D.x > 0.0 ? (3.85 - l0.x)/max(D.x, 1e-4) : (0.15 - l0.x)/min(D.x, -1e-4);
    tx = mix(tx, 1e5, band);
    float ty = D.y > 0.0 ? (5.7 - l0.y)/max(D.y, 1e-4) : (0.6 - l0.y)/min(D.y, -1e-4);
    float t = min(tb1, min(tx, ty));
    vec3 hp = vec3(l0 + D.xy*t, dz*t);
    vec3 lp = vec3(2.0 + (h3 - 0.5)*1.5, 4.85, 3.3);
    vec3 dl = hp - lp; dl.x = mix(dl.x, mod(dl.x + 2.0, 4.0) - 2.0, band);              // a lamp to every bay of an open floor
    float I = 1.0/(1.0 + dot(dl, dl)*0.16);
    float isBack = step(tb1, t + 1e-4), isFloor = (1.0 - isBack)*step(ty, t + 1e-4)*step(D.y, 0.0), isCeil = (1.0 - isBack)*step(ty, t + 1e-4)*step(0.0, D.y);
    vec3 tint = mix(vec3(0.74, 0.6, 0.45), vec3(0.5, 0.5, 0.52), h2);
    vec3 alb = tint*(0.55 + 0.3*isBack);
    alb *= 1.0 - 0.35*isBack*step(hp.y, 1.9);                                               // a dado
    float door = isBack*step(abs(mod(hp.x, 4.0) - (0.9 + 2.2*h1)), 0.5)*step(hp.y, 3.0);    // a doorway to the room behind
    alb = mix(alb, vec3(0.05, 0.04, 0.035), door*0.9);
    alb = mix(alb, vec3(0.16, 0.12, 0.09), isFloor);
    alb = mix(alb, tint*0.8, isCeil);
    vec3 room = wcol*alb*(0.07 + 1.15*I);
    // the lamp itself
    vec3 dv = vec3(D.x, D.y, dz), wv = lp - vec3(l0, 0.0);
    float pr = dot(wv, dv), dp2 = max(dot(wv, wv) - pr*pr, 0.0);
    room += wcol*(3.2*exp(-dp2/0.016) + 0.25*exp(-dp2/0.5))*step(pr, t + 0.3);
    // somebody at the sill, on a plane 0.3 m inside the wall: black against the room; along an open floor, up to three to a bay
    vec2 pp = l0 + D.xy*(0.3/dz);
    float who = max(step(0.42, h2), band);
    float lean = clamp(V.x, -1.0, 1.0)*0.09;                                                // they turn toward whoever passes
    float pxm = mix(2.0 + (h1 - 0.5)*0.9, 2.0 + (h1 - 0.5)*0.5, band), sway = 0.02*sin(uTime*(0.6 + h3) + h1*30.0);
    float sdp = min(length(pp - vec2(pxm + lean + sway, 2.33)) - 0.14, sdBox(pp - vec2(pxm + lean*0.4, 1.55), vec2(0.23, 0.5)) - 0.07);
    float side = h3 > 0.5 ? 1.0 : -1.0, lifts = step(0.8, h1);
    float raise = lifts*(0.25 + 0.75*(1.0 - smoothstep(40.0, 85.0, dist)))*(0.85 + 0.15*sin(uTime*1.7 + h3*20.0));
    vec2 hand = vec2(pxm + side*(0.33 + 0.06*raise), 1.72 + 0.72*raise);
    vec2 sh = vec2(pxm + side*0.22, 2.02), ab = hand - sh; float hh = clamp(dot(pp - sh, ab)/max(dot(ab, ab), 1e-4), 0.0, 1.0);
    sdp = min(sdp, length(pp - sh - ab*hh) - 0.055);
    // a second, smaller one beside the first in some windows
    float kid = step(0.78, h3)*(1.0 - band);
    sdp = min(sdp, mix(9.0, min(length(pp - vec2(pxm - side*0.55, 1.92)) - 0.11, sdBox(pp - vec2(pxm - side*0.55, 1.45), vec2(0.15, 0.34)) - 0.05), kid));
    for (int k = 0; k < 2; k++) {
      float hk = fract(h1*7.3 + float(k)*0.37 + h2), xk = (k == 0 ? 0.72 : 3.28) + (hk - 0.5)*0.5;
      float sk = min(length(pp - vec2(xk + lean, 2.3 + 0.1*(hk - 0.5))) - 0.14, sdBox(pp - vec2(xk + lean*0.4, 1.55), vec2(0.23, 0.5)) - 0.07);
      sdp = min(sdp, mix(9.0, sk, band*step(0.3, hk)));
    }
    float aa = max(fw.x*4.0, fw.y*6.0)*0.75 + 0.004;
    float pm = who*(1.0 - smoothstep(-aa, aa, sdp));
    room = mix(room, wcol*0.012, pm);
    // polish round 1 (P3a), second part (G3b): along a street a lamp hangs in every bay, on a cord from the arch, a
    // metre inside the piers, at its own height (3.1 to 4.3 m) and a little off the middle, in the house's amber; and
    // people walk both ways, about one to every nine metres each way, a metre and a half inside the piers
    vec2 pl = l0 + D.xy*(1.0/dz); float lc = floor(pl.x/4.0), lh1 = nlH(vec2(ci.x + lc, ci.y) + 13.0), lh2 = nlH(vec2(ci.x + lc, ci.y) + 29.0);
    vec2 lq = vec2(pl.x - lc*4.0 - 2.0 - (lh1 - 0.5)*1.2, pl.y - 3.1 - 1.2*lh2); float ls2 = dot(lq, lq);
    float cord = band*cityOn*(1.0 - smoothstep(0.015, 0.03 + aa, abs(lq.x)))*step(0.0, lq.y);
    room = mix(room, wcol*0.03, cord);
    float lampA = band*cityOn*(2.6*exp(-ls2/0.012) + 0.3*exp(-ls2/0.2));
    vec2 pk = l0 + D.xy*(1.6/dz); float Xa = ci.x*4.0 + pk.x, sdw = 9.0;
    for (int k = 0; k < 2; k++) {
      float fk = float(k), dirk = 1.0 - 2.0*fk, sk2 = (Xa - dirk*uTime*(1.1 + 0.2*fk))/9.0 + fk*0.37, ck = floor(sk2), hk2 = nlH(vec2(ck, ci.y + fk*17.0));
      float xk2 = (sk2 - ck - 0.5)*9.0 - (hk2 - 0.5)*5.0, bob = 0.03*sin(uTime*6.0 + hk2*30.0);
      float sw2 = min(length(vec2(xk2, pk.y - 2.3 - bob)) - 0.14, sdBox(vec2(xk2, pk.y - 1.45 - bob), vec2(0.21, 0.6)) - 0.06);
      sdw = min(sdw, mix(9.0, sw2, step(0.4, hk2)));
    }
    room = mix(room, wcol*0.02, band*(1.0 - smoothstep(-aa, aa, sdw)));
    float lg = length(pp - hand - vec2(side*0.03, 0.1));
    room += who*lifts*uPaleLamp*(4.5*exp(-lg*lg/0.006) + 0.5*exp(-lg*lg/0.09));
    // the reveal: the thickness of the wall seen through the opening, lit by the room (the sill most, the head least)
    vec2 rv = l0 + D.xy*(0.7/dz);
    float inner = winCov(rv/vec2(4.0, 6.0), fw, wbox, smallK, roundK)*mix(1.0, archCov(rv/vec2(4.0, 6.0), fw), band);
    vec3 reveal = uMetal*tone*wcol*(0.6 + 1.0*step(rv.y, 1.5) - 0.35*step(4.1, rv.y));
    room = mix(reveal, room, inner);
    win = mix(win, room*((0.55 + 0.9*bN)*dimK*flN*gK*hd*stK), wI);
    win += uLamp*(lampA*inner*hd*wI);                  // (G4d: the street's own lamps, steady, outside the greeting)
  }
  // the shutter: plain plate a shade darker, set back under its head
  float shut = covFull*(1.0 - open)*wm*(1.0 - wfar);
  col = mix(col, metal*(night*0.45 + uLamp*spill*0.07)*(0.55 + 0.45*smoothstep(0.6, 0.683, 0.683 - cf.y + 0.6)), shut);
  col = mix(col, win, litCov);
  // far off. Seen aslant, an embrasure in a wall 0.7 m thick shows less of its room and more of its lit reveal: the face
  // at a grazing angle is a soft sheen, not rows of bright bars
  float ca = cos(fa), sa = sin(fa), cn = max(dot(V, N), 0.03);
  float tX = abs(V.x*ca - V.z*sa)/cn, tY = abs(dot(V, vec3(-sa*0.3091, 0.951, -ca*0.3091)))/cn;
  float aslant = mix(0.3, 1.0, clamp(1.0 - 0.7*tX/1.6, 0.0, 1.0)*clamp(1.0 - 0.7*tY/2.6, 0.0, 1.0));
  float farK = hd*greet*uWake*wfar*step(12.0, fy)*(1.0 - gateZ)*(1.0 - galZ)*(1.0 - portZ)*(1.0 - embZF)*(1.0 - 0.92*ribFar)*aslant*mix(1.0, 0.4, sleepK);
  float dkF = clamp(1.0 - 1.3*(tb.r + tb.g), 0.0, 1.0)*(1.0 - wqF);
  col += mix(mix(uLamp, uPaleLamp, tb.b*0.6), uDimLamp, 0.45*dkF)*(1.3*uWinE*farK*bF*flF);
  // polish round 1 (P3a): far off, a city's street is a line of light along the face where the city wakes, broken at the ribs
  float yb = mod(fy, 60.0), wY = max(fwidth(fy), 1e-4);
  float lineC = clamp((min(yb + 0.5*wY, 5.58) - max(yb - 0.5*wY, 1.5))/wY, 0.0, 1.0)*step(60.0, fy);
  col += mix(uLamp, uPaleLamp, 0.3)*(1.3*uWinE*0.1733*0.12*lineC*(farK/max(greet*uWake, 1e-3))*cityOn*smoothstep(0.35, 0.65, nlN(vec2(c.x*0.21, cityJ*3.7))));   // (second part, G3a: 0.12 for 0.5, and broken into stretches)
  // the corner of the house: the last plate of each face catches the night's glow, a pale line up its edge
  float edgeD = (1200.0 - 0.325*fy) - abs(fx);
  col += vec3(0.02, 0.022, 0.03)*((0.3 + 0.7*hd)*(1.0 - smoothstep(0.0, 2.5 + 1.5*fwidth(fx), edgeD)));
  // polish round 1 (P3d): lights rising and falling in a few shafts. One rib in so many (the share and which: the 'cities'
  // stream) carries a shaft of glass 0.8 m wide up its middle, from the ground to the top of its lit cities (300 to
  // 800 m); a car's light goes up it and down again, once in 90 to 210 s
  float shOn = step(nlH(vec2(bayI, 19.0) + uCity.xy), uCity.w)*rib*(1.0 - gateZ)*(1.0 - galZ);
  float shTop = 300.0 + 500.0*nlH(vec2(bayI, 23.0)), shPer = 90.0 + 120.0*nlH(vec2(bayI, 29.0));
  float dyc = fy - shTop*(0.5 - 0.5*cos(6.2832*(uTime/shPer + nlH(vec2(bayI, 31.0)))));
  col += uPaleLamp*(shOn*boxCov(xr, max(fw.x*4.0, 1e-4), 3.6, 4.4)*hd*(0.06*step(fy, shTop)*(0.6 + 0.4*step(0.5, fract(fy/6.0))) + 2.6*exp(-dyc*dyc/(6.0 + wY*wY))));
  // light spilled on the sill and round the embrasure, close by: it shows the plate its joints
  float halo = (1.0 - wfar)*wm*open*bright*hd*exp(-max(sdBox(cf - vec2(0.5, 0.4667), vec2(wh, 0.2167)), 0.0)*20.0)*(1.0 - covFull);
  col += metal*uLamp*halo*1.5;
  // ---- the great gate: two leaves of ribbed plate standing open on the lit hall within
  float gx = fx - uGate.x, gw = fwidth(fx);
  float inGate = f0*(1.0 - smoothstep(uGate.y - gw, uGate.y + gw, abs(gx)))*(1.0 - smoothstep(uGate.z - gw, uGate.z + gw, fy));
  float gap = boxCov(gx, gw, -1.1, 1.1);
  vec3 leaf = metal*(vec3(0.012) + uPaleLamp*(1.1*exp(-abs(gx)*0.7) + 0.2*exp(-abs(gx)*0.2)));
  leaf *= (0.7 + 0.3*step(0.14, fract(fy/2.8333)))*(0.85 + 0.15*step(0.08, fract(abs(gx)/1.75)));
  vec3 hall = uPaleLamp*(1.5 + 2.4*exp(-fy/12.0))*(0.8 + 0.2*step(0.5, fract(fy/5.6667)));
  col = mix(col, mix(leaf, hall, gap), inGate);
  float gfr = f0*(1.0 - inGate)*exp(-max(sdBox(vec2(gx, fy - uGate.z*0.5), vec2(uGate.y, uGate.z*0.5)), 0.0)*0.16);
  col += metal*uPaleLamp*gfr*0.5;
  // ---- the second great opening, passed on the climb: the hall of the watch, three floors high and a bay wide, open to
  // the night along its whole front behind a rail: a lit ceiling with its beams, lamps hung in a row, a back wall of doors
  // in tiers, and the watch standing at the rail
  // (polish round 1, P3b: the same hall is drawn for a great embrasure, at its own place, on any face; the hall of the
  // watch is drawn exactly as before)
  vec4 HP = uPort; float hOn = f0, eS = 0.0, hWarm = 0.55, eK = 0.0;
  if (embZF > 0.5) { HP = vec4(eC, 18.0, 9.0); hOn = 1.0; eS = bayI*13.0 + cityJ*7.0; hWarm = 0.05 + 0.3*nlH(vec2(bayI, cityJ) + 61.0); eK = 1.0; }    // (second part, G3a: in the house's amber)
  vec2 so = vec2(fx - HP.x, fy - HP.y);
  float inP = hOn*(1.0 - smoothstep(HP.z - gw, HP.z + gw, abs(so.x)))*(1.0 - smoothstep(HP.w - gw, HP.w + gw, abs(so.y)));
  if (inP > 0.001) {
    vec3 D = -V; float dz = max(-D.z, 0.02);
    float tb1 = 18.0/dz;
    float tx = D.x > 0.0 ? (HP.z - so.x)/max(D.x, 1e-4) : (-HP.z - so.x)/min(D.x, -1e-4);
    float ty = D.y > 0.0 ? (HP.w - so.y)/max(D.y, 1e-4) : (-HP.w - so.y)/min(D.y, -1e-4);
    float t = min(tb1, min(tx, ty));
    vec3 hp = vec3(so + D.xy*t, dz*t);
    float isBack = step(tb1, t + 1e-4), isY = (1.0 - isBack)*step(ty, t + 1e-4), isCeil = isY*step(0.0, D.y), isFloor = isY*step(D.y, 0.0);
    vec3 dl = hp - vec3(0.0, HP.w - 2.0, 13.0); dl.x = mod(hp.x + 3.0, 6.0) - 3.0;      // a lamp every 6 m, 2 m under the ceiling, 13 m inside
    float I = 1.0/(1.0 + dot(dl, dl)*0.03);
    vec3 alb = vec3(0.4, 0.39, 0.37);
    vec2 bc = vec2(hp.x/3.0, (hp.y + HP.w)/6.0), bf = fract(bc);
    float dh = nlH(floor(bc) + 71.0);
    float door = isBack*step(abs(bf.x - 0.5), 0.22)*step(bf.y, 0.62)*step(0.08, bf.y);
    alb = mix(alb, mix(vec3(0.27, 0.26, 0.245), vec3(0.5, 0.48, 0.44), step(0.55, dh)), door);
    alb *= 1.0 - 0.4*isBack*step(bf.y, 0.06);
    alb = mix(alb, vec3(0.13, 0.11, 0.095)*(0.92 + 0.08*step(0.04, fract(hp.x/3.0))), isFloor);
    alb = mix(alb, vec3(0.5, 0.47, 0.42)*(1.0 - 0.5*step(fract(hp.z/4.5), 0.12)), isCeil);
    vec3 hallC = mix(uLamp, uPaleLamp, hWarm);
    vec3 hall2 = hallC*alb*(0.12 + 0.95*I);
    vec2 pp = so + D.xy*(1.0/dz);
    // the watch at the rail: small and many, in knots and gaps, of unlike heights
    float pcx = pp.x/0.8, ph2 = nlH(vec2(floor(pcx), 77.0 + eS));
    float pxm = (fract(pcx) - 0.5)*0.8 - (ph2 - 0.5)*0.34 - 0.03*sin(uTime*(0.5 + ph2) + ph2*40.0), pym = (pp.y + HP.w)/(0.84 + 0.24*fract(ph2*7.3));
    float sdp = min(length(vec2(pxm, pym - 1.62)) - 0.13, sdBox(vec2(pxm, pym - 0.78), vec2(0.2, 0.72)) - 0.05);
    float aaP = gw*0.75 + 0.01;
    float man = step(0.2 + 0.6*nlN(vec2(floor(pcx)*0.29, 5.0)), ph2)*(1.0 - smoothstep(-aaP, aaP, sdp));
    float lift = step(0.86, ph2)*(0.8 + 0.2*sin(uTime*1.7 + ph2*20.0));
    float lgd = length(vec2(pxm - 0.3, pym - 1.5 - 0.6*lift));
    float rail = 1.0 - smoothstep(0.03, 0.06 + gw, abs(so.y + HP.w - 1.15));
    hall2 = mix(hall2, uLamp*0.012, max(man, rail*0.6));
    hall2 += uPaleLamp*step(0.86, ph2)*(2.2*exp(-lgd*lgd/0.008) + 0.2*exp(-lgd*lgd/0.1));
    // (second part, G3a: an embrasure is no brighter than the windows round it (0.4 of the hall of the watch), and piers
    // 0.9 m wide stand in its opening every 6 m)
    float pierE = eK*(1.0 - smoothstep(0.45 - gw, 0.45 + gw, abs(mod(so.x, 6.0) - 3.0)));
    col = mix(col, hall2*(hd*mix(1.0, 0.4, eK)), inP*(1.0 - pierE));
  }
  col += metal*mix(uLamp, uPaleLamp, hWarm)*(hOn*(1.0 - inP)*0.14*exp(-max(sdBox(so, HP.zw), 0.0)*mix(0.22, 1.2, step(0.5, embZF))));
  // ---- the light of the great gallery on the wall round its mouths and on the piers between them
  float gsd = sdBox(vec2(fx - 0.5*(uGal.x + uGal.y), fy - 0.5*(uGal.z + uGal.w)), vec2(0.5*(uGal.y - uGal.x), 0.5*(uGal.w - uGal.z)));
  col += metal*uLamp*(f0*uGalK*exp(-max(gsd, 0.0)*0.09));
  // ---- the smoke that lies against the face, then the air between
  float T = mix(1.0, smokeT(vW, V, dist), f0);
  col = col*T + vec3(0.007, 0.0055, 0.005)*(1.0 - T);
  col = mix(col, nlSky(-V), nlFogAmount(vW, uFog.w));
  gl_FragColor = vec4(col, 1.0);
}`;function fe(){const l=[],u=[],t=[];for(let i=0;i<4;i++){const h=i*Math.PI/2,a=Math.cos(h),x=Math.sin(h),C=l.length/3;for(let r=0;r<=32;r++){const n=Y.apex*Math.pow(r/32,1.6),f=I(n),p=f;for(let m=0;m<=24;m++){const w=-p+2*p*(m/24);l.push(w*a+f*x,n,-w*x+f*a),u.push(w,n,i)}}for(let r=0;r<32;r++)for(let n=0;n<24;n++){const f=C+r*25+n,p=f+24+1;t.push(f,f+1,p,f+1,p+1,p)}}const e=new o.BufferGeometry;return e.setAttribute("position",new o.Float32BufferAttribute(l,3)),e.setAttribute("aF",new o.Float32BufferAttribute(u,3)),e.setIndex(t),e.computeBoundingSphere(),e}class Q{constructor(){this.p=[],this.n=[],this.c=[],this.k=[],this.i=[]}quad(s,l,u,t,e,i=0){const h=this.p.length/3,a=[l[0]-s[0],l[1]-s[1],l[2]-s[2]],x=[t[0]-s[0],t[1]-s[1],t[2]-s[2]];let C=a[1]*x[2]-a[2]*x[1],r=a[2]*x[0]-a[0]*x[2],n=a[0]*x[1]-a[1]*x[0];const f=Math.hypot(C,r,n)||1;C/=f,r/=f,n/=f;for(const p of[s,l,u,t])this.p.push(p[0],p[1],p[2]),this.n.push(C,r,n),this.c.push(e[0],e[1],e[2]),this.k.push(i);this.i.push(h,h+1,h+2,h,h+2,h+3)}box(s,l,u,t,e,i,h,a=0){this.quad([s,l,i],[t,l,i],[t,e,i],[s,e,i],h,a),this.quad([t,l,u],[s,l,u],[s,e,u],[t,e,u],h,a),this.quad([t,l,i],[t,l,u],[t,e,u],[t,e,i],h,a),this.quad([s,l,u],[s,l,i],[s,e,i],[s,e,u],h,a),this.quad([s,e,i],[t,e,i],[t,e,u],[s,e,u],h,a),this.quad([s,l,u],[t,l,u],[t,l,i],[s,l,i],h,a)}geometry(){const s=new o.BufferGeometry;return s.setAttribute("position",new o.Float32BufferAttribute(this.p,3)),s.setAttribute("normal",new o.Float32BufferAttribute(this.n,3)),s.setAttribute("color",new o.Float32BufferAttribute(this.c,3)),s.setAttribute("aKind",new o.Float32BufferAttribute(this.k,1)),s.setIndex(this.i),s.computeBoundingSphere(),s}}const ee=`
uniform vec3 uLampP[14]; uniform vec3 uLampC, uGalAmb, uPortalC; uniform vec3 uPortalP;
vec3 galLight(vec3 P, vec3 N, vec3 V, vec3 alb, float gloss){
  vec3 c = alb*uGalAmb;
  vec3 R = reflect(-V, N);
  for (int i = 0; i < 14; i++) {
    vec3 dl = uLampP[i] - P; float r2 = dot(dl, dl), inv = inversesqrt(r2 + 1e-3);
    float a = 1.0/(1.0 + r2*0.005);
    c += alb*uLampC*a*(0.3 + 0.7*max(dot(N, dl)*inv, 0.0));
    float sp = max(dot(R, dl*inv), 0.0); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
    c += uLampC*gloss*sp*a;
  }
  vec3 dp = uPortalP - P; float p2 = dot(dp, dp);
  c += alb*uPortalC*(0.3 + 0.7*max(dot(N, dp)*inversesqrt(p2 + 1e-3), 0.0))/(1.0 + p2*0.004);
  return c;
}`,te=`
attribute vec3 color; attribute float aKind;
varying vec3 vW, vN, vC; varying float vK;
void main(){
  vC = color; vK = aKind; vN = normal;
  vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,he=`
precision highp float;
${O}
${ee}
uniform vec3 uLamp, uPaleLamp; uniform vec4 uArch;      // the arch in the east wall: z centre, y of the spring line, radius, y of its foot
varying vec3 vW, vN, vC; varying float vK;
float boxCov(float x, float w, float a, float b){ return clamp((min(x + 0.5*w, b) - max(x - 0.5*w, a))/max(w, 1e-5), 0.0, 1.0); }
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 toEye = cameraPosition - vW; vec3 V = toEye/max(length(toEye), 1e-3);
  if (dot(N, V) < 0.0) N = -N;
  if (vK > 4.5 && vK < 5.5) {                                         // the east wall: cut the arch out of it
    vec2 q = vec2(abs(vW.z - uArch.x), vW.y);
    float inA = q.y < uArch.y ? step(q.x, uArch.z)*step(uArch.w, q.y) : step(length(vec2(q.x, q.y - uArch.y)), uArch.z);
    if (inA > 0.5) discard;
  }
  vec3 alb = vC; float gloss = 0.0; vec3 emis = vec3(0.0);
  if (vK > 0.5 && vK < 1.5) {                             // the back wall: tiers of inner windows
    vec2 c = vec2(vW.x/4.0, (vW.y - 160.0)/6.5), fw = max(fwidth(c), vec2(1e-5));
    vec2 ci = floor(c), cf = c - ci;
    float h = nlH(ci + 3.1), h2 = nlH(ci + 17.0);
    float cov = boxCov(cf.x, fw.x, 0.31, 0.69)*boxCov(cf.y, fw.y, 0.3, 0.74)*step(ci.y, 4.5);
    float lit = step(0.32, h)*(0.6 + 0.4*h2)*(0.88 + 0.12*sin(uTime*(1.2 + 2.0*h2) + h*40.0));
    vec2 pp = (cf - vec2(0.5, 0.3))*vec2(4.0, 6.5);       // a watcher in the opening
    float who = step(0.45, h2)*(1.0 - smoothstep(0.0, 0.05, min(length(pp - vec2((h - 0.5)*0.8, 0.95)) - 0.13, max(abs(pp.x - (h - 0.5)*0.8) - 0.22, pp.y - 0.78))));
    emis = mix(uLamp, uPaleLamp, step(0.85, h))*(1.15*lit*cov*(1.0 - 0.95*who)*(0.6 + 0.7*cf.y));
    alb *= 1.0 - 0.5*cov;
  } else if (vK > 1.5 && vK < 2.5) {                      // the floor: plates, worn and bright
    vec2 g = vW.xz/4.0, gf = 0.5 - abs(fract(g) - 0.5), gw = max(fwidth(g), vec2(1e-5));
    float ln = max(1.0 - smoothstep(0.0, 1.5*gw.x + 0.006, gf.x), 1.0 - smoothstep(0.0, 1.5*gw.y + 0.006, gf.y))*clamp(0.05/(max(gw.x, gw.y) + 0.05), 0.0, 1.0);
    alb *= (0.9 + 0.2*nlH(floor(g)))*(1.0 - 0.4*ln);
    gloss = 0.5*(0.6 + 0.4*nlN(vW.xz*0.7));
  } else if (vK > 2.5 && vK < 3.5) {
    emis = vC*4.0; alb = vec3(0.0);
  } else if (vK > 6.5) {                                  // the wall of the face in section: five plates thick, jointed at every floor
    float dp = (1200.0 - 0.325*vW.y) - vW.z;
    float l1 = 0.5 - abs(fract(dp/1.4) - 0.5), lw = fwidth(dp/1.4), l2 = 0.5 - abs(fract(vW.y/6.0) - 0.5), hw = fwidth(vW.y/6.0);
    float ln = max(1.0 - smoothstep(0.0, 1.5*lw + 0.02, l1), 0.7*(1.0 - smoothstep(0.0, 1.5*hw + 0.006, l2)));
    alb *= (0.8 + 0.35*nlH(floor(vec2(dp/1.4, vW.y/6.0))))*(1.0 - 0.55*ln);
    gloss = 0.15;
  }
  vec3 col = galLight(vW, N, V, alb, gloss) + emis;
  gl_FragColor = vec4(nlFog(col, vW), 1.0);
}`;function me(){const y=[],s=[],l=[],u=[],t=(v,N,M)=>[[N,v,0],[0,v,M],[-N,v,0],[0,v,-M]],e=(v,N,M)=>{y.push(v[0],v[1],v[2]);const V=Math.hypot(N[0],N[1],N[2])||1;return s.push(N[0]/V,N[1]/V,N[2]/V),l.push(M),y.length/3-1},i=t(0,.27,.2),h=t(1.36,.25,.13),a=i.map(v=>e(v,[v[0],.1,v[2]],0)),x=h.map(v=>e(v,[v[0],.35,v[2]],0));for(let v=0;v<4;v++){const N=(v+1)%4;u.push(a[v],a[N],x[N],a[v],x[N],x[v])}const C=e([0,1.5,0],[0,1,0],0);for(let v=0;v<4;v++)u.push(x[v],x[(v+1)%4],C);const r=[0,1.61,.01],n=.115,f=[[1,0,0],[0,0,1],[-1,0,0],[0,0,-1]].map(v=>e([r[0]+v[0]*n,r[1],r[2]+v[2]*n],v,1)),p=e([r[0],r[1]+n*1.2,r[2]],[0,1,0],1),m=e([r[0],r[1]-n*1.2,r[2]],[0,-1,0],1);for(let v=0;v<4;v++){const N=(v+1)%4;u.push(f[v],f[N],p,f[N],f[v],m)}const w=e([.19,1.36,0],[1,0,.3],2),g=e([.27,1.3,0],[1,0,.3],2),z=e([-.035,0,0],[1,0,.3],3),k=e([.035,0,0],[1,0,.3],3);u.push(w,g,k,w,k,z);const P=[[-.07,-.02,0],[.07,-.02,0],[.07,.16,0],[-.07,.16,0]].map(v=>e(v,[0,0,1],4));u.push(P[0],P[1],P[2],P[0],P[2],P[3]);const F=new o.BufferGeometry;return F.setAttribute("position",new o.Float32BufferAttribute(y,3)),F.setAttribute("normal",new o.Float32BufferAttribute(s,3)),F.setAttribute("aPart",new o.Float32BufferAttribute(l,1)),F.setIndex(u),F}const pe=`
attribute vec4 aPos;       // x, y, z, the way the figure faces
attribute vec4 aVar;       // height scale, hash, colour seed, carries a lamp
uniform vec3 uEye; uniform float uWave;
float figYaw(){
  vec2 toC = uEye.xz - aPos.xz; float dC = length(toC);
  float yawC = atan(toC.x, toC.y + 1e-4);
  float dy = mod(yawC - aPos.w + 3.14159265, 6.2831853) - 3.14159265;
  return aPos.w + dy*(1.0 - smoothstep(22.0, 75.0, dC))*0.9*uWave;
}
float figRaise(){
  float h = aVar.y, dC = length(uEye.xz - aPos.xz);
  return uWave*(1.0 - smoothstep(9.0, 38.0, dC))*(0.55 + 0.45*fract(h*7.7)) + 0.07*sin(uTime*(1.1 + h) + h*50.0);
}
vec3 figHand(float raise){
  float h = aVar.y;
  float th = mix(0.75, 2.75, clamp(raise, 0.0, 1.0)) + 0.1*sin(uTime*2.3 + h*31.0)*raise;
  return vec3(0.23, 1.33, 0.0) + 0.6*vec3(0.12*sin(th), -cos(th), sin(th));
}
vec3 figPlace(vec3 p, float yaw){
  float h = aVar.y;
  float sw = sin(uTime*(0.7 + 0.6*fract(h*3.3)) + h*40.0);
  p.x += 0.035*sw*p.y; p.z += 0.02*cos(uTime*0.9 + h*17.0)*p.y;
  p *= aVar.x;
  float cy = cos(yaw), sy = sin(yaw);
  return vec3(p.x*cy + p.z*sy, p.y, -p.x*sy + p.z*cy) + aPos.xyz;
}`,ue=y=>`
${O}
${y?ee:""}
${pe}
attribute float aPart;
uniform vec3 uLampHand; uniform float uArmour;
varying vec3 vCol; varying vec3 vEmis; varying vec3 vWp;
void main(){
  float h = aVar.y;
  float yaw = figYaw(), raise = figRaise();
  vec3 p = position;
  float lampOn = step(0.5, aVar.w);
  vec3 hand = figHand(raise);
  if (aPart > 2.5 && aPart < 3.5) p += hand;
  if (aPart > 3.5) p = hand + p*lampOn*(1.0 - uArmour);
  if (aPart > 0.5 && aPart < 1.5) p.z += 0.03*raise;
  vec3 wp = figPlace(p, yaw);
  float cy = cos(yaw), sy = sin(yaw);
  vec3 N = normalize(vec3(normal.x*cy + normal.z*sy, normal.y, -normal.x*sy + normal.z*cy));
  vec3 toE = cameraPosition - wp; vec3 V = toE/max(length(toE), 1e-3);
  // cloth: greys, browns, dull blues, a few pale; the head a shade of skin. The men at the ring are in grey armour.
  float cs = aVar.z;
  vec3 cloth = mix(mix(vec3(0.075, 0.07, 0.07), vec3(0.12, 0.085, 0.06), step(0.35, cs)), mix(vec3(0.06, 0.075, 0.105), vec3(0.2, 0.18, 0.16), step(0.88, cs)), step(0.62, cs));
  vec3 alb = aPart > 0.5 && aPart < 1.5 ? vec3(0.3, 0.2, 0.15) : cloth*(0.7 + 0.5*fract(h*13.0));
  alb = mix(alb, vec3(0.13, 0.137, 0.155)*(0.8 + 0.4*fract(h*13.0)), uArmour);
  // an armoured man stands in the cold clear light of the disc in his own right hand
  vec3 self = uArmour*alb*vec3(0.72, 0.83, 1.0)*(0.1 + 0.75*max(dot(normalize(normal), vec3(0.64, 0.3, 0.7)), 0.0));
  ${y?"vCol = galLight(wp, N, V, alb, 0.0) + alb*uLampHand*lampOn*raise*0.6;":"vCol = nlLight(wp, N, V, alb, 0.8) + self;"}
  vEmis = aPart > 3.5 ? uLampHand*3.5 : vec3(0.0);
  vWp = wp;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,de=`
precision highp float;
${O}
varying vec3 vCol; varying vec3 vEmis; varying vec3 vWp;
void main(){ gl_FragColor = vec4(nlFog(vCol + vEmis, vWp), 1.0); }`;function ae(y,s,l={}){const u=me(),t=new o.InstancedBufferGeometry;t.index=u.index;for(const m of["position","normal","aPart"])t.setAttribute(m,u.attributes[m]);const e=s.length,i=new Float32Array(e*4),h=new Float32Array(e*4);let a=0,x=0,C=0;s.forEach((m,w)=>{i.set([m[0],m[1],m[2],m[3]],w*4),h.set([m[4],m[5],m[6],m[7]],w*4),a+=m[0]/e,x+=m[1]/e,C+=m[2]/e});let r=0;for(const m of s)r=Math.max(r,Math.hypot(m[0]-a,m[1]-x,m[2]-C));t.setAttribute("aPos",new o.InstancedBufferAttribute(i,4)),t.setAttribute("aVar",new o.InstancedBufferAttribute(h,4)),t.instanceCount=e,t.boundingSphere=new o.Sphere(new o.Vector3(a,x,C),r+3);const n={...y.uniforms,...l.uniforms||{},uEye:{value:new o.Vector3(0,-1e4,0)},uWave:{value:l.wave??1},uLampHand:{value:new o.Color(l.lamp||"#FFD79A")},uArmour:{value:l.armour?1:0}},f=new o.ShaderMaterial({uniforms:n,vertexShader:ue(!!l.indoor),fragmentShader:de,side:o.DoubleSide}),p=new o.Mesh(t,f);return p.name=l.name||"figures",{mesh:p,uniforms:n,count:e,triangles:e*(u.index.count/3),aPos:t.attributes.aPos,aVar:t.attributes.aVar,sphere:t.boundingSphere}}const ve=[0,1,2,3,4,5,6].map(y=>L.x0+(y+.5)*(L.x1-8-L.x0)/7),c={x:524,z:1125,foot:163,spring:179,r:10};function xe(y,s,l,u){const{x0:t,x1:e,y0:i,y1:h}=L,a=L.zBack,x=I(i),C=I(h),r=c.x,n=new Q,f=[.16,.175,.2],p=[.07,.075,.09],m=[.2,.2,.21];n.quad([t,i,x],[e,i,x],[e,i,a],[t,i,a],m,2),n.quad([t,h,a],[e,h,a],[e,h,C],[t,h,C],f,0),n.quad([t,i,a],[e,i,a],[e,h,a],[t,h,a],f,1),n.quad([t,i,x],[t,i,a],[t,h,a],[t,h,C],f,0),n.quad([r,i,a],[r,i,x],[r,h,C],[r,h,a],f,5),n.quad([e,c.foot,a+4],[e,c.foot,C-2],[e,h-3,C-2],[e,h-3,a+4],p,0),n.quad([r,c.foot,c.z-c.r-1],[e,c.foot,c.z-c.r-1],[e,h-3,c.z-c.r-1],[r,h-3,c.z-c.r-1],p,0),n.quad([e,c.foot,c.z+c.r+1],[r,c.foot,c.z+c.r+1],[r,h-3,c.z+c.r+1],[e,h-3,c.z+c.r+1],p,0),n.quad([r,c.foot,c.z+c.r+1],[e,c.foot,c.z+c.r+1],[e,c.foot,c.z-c.r-1],[r,c.foot,c.z-c.r-1],m,2);const w=r-.7,g=c.r+2.6;n.box(w,i,c.z-g,r,c.spring,c.z-c.r,f,0),n.box(w,i,c.z+c.r,r,c.spring,c.z+g,f,0);const z=18;for(let d=0;d<z;d++){const b=Math.PI*d/z,G=Math.PI*(d+1)/z,H=($,U,le)=>[le,c.spring+Math.sin($)*U,c.z+Math.cos($)*U];n.quad(H(b,c.r,w),H(G,c.r,w),H(G,g,w),H(b,g,w),f,0),n.quad(H(b,c.r,r),H(G,c.r,r),H(G,c.r,w),H(b,c.r,w),p,0),n.quad(H(b,g,w),H(G,g,w),H(G,g,r),H(b,g,r),f,0)}for(let d=0;d<7;d++)n.box(500+2*d,i,1109+d*.5,r,i+(d+1)*3/7,1141-d*.5,[.24,.24,.25],2);const k=L.wall,P=L.head,F=I(P),v=[.3,.31,.34];for(const[d,b]of X){for(const G of[d,b])n.quad([G,i,x],[G,i,x-k],[G,P,F-k],[G,P,F],v,7);n.quad([d,i,x-k],[b,i,x-k],[b,P,F-k],[d,P,F-k],f,0)}n.quad([t,P,F],[e,P,F],[e,P,F-k],[t,P,F-k],v,7),n.quad([t,P,F-k],[e,P,F-k],[e,h,C-k],[t,h,C-k],f,0),n.box(t,i,x-.9,e,i+1.2,x,f,0);const N=[];for(let d=1;d<=4;d++){const b=i+6.5*d;N.push(b),n.box(t,b-.4,a,r,b,a+2.4,f,0),n.box(t,b,a+2.2,r,b+1,a+2.4,p,0)}const M=[];for(const d of[a+9,a+27])for(const b of ve){const G=d>a+20?8.5:10.5,H=h-G;M.push(new o.Vector3(b,H+.6,d)),n.box(b-.07,H+1.3,d-.07,b+.07,h,d+.07,p,6),n.box(b-.6,H+1.2,d-.6,b+.6,H+1.45,d+.6,p,6),n.box(b-.42,H,d-.42,b+.42,H+1.2,d+.42,[1,.62,.25],3)}const V={...s.uniforms,uLamp:l.uLamp,uPaleLamp:l.uPaleLamp,uLampP:{value:M},uLampC:{value:new o.Color(1,.6,.24).multiplyScalar(.36*(u.galLight??1))},uGalAmb:{value:new o.Color(.045,.027,.012)},uPortalP:{value:new o.Vector3(519,171,1125)},uPortalC:{value:new o.Color(.72,.83,1).multiplyScalar(.55)},uArch:{value:new o.Vector4(c.z,c.spring,c.r,c.foot)}},Z=te.replace("vec4 wp = modelMatrix*vec4(position, 1.0);",`vec3 pp = position;
  if (aKind > 2.5 && aKind < 3.5 || aKind > 5.5 && aKind < 6.5) { float hang = ${h.toFixed(1)} - pp.y; pp.x += hang*0.03*sin(uTime*0.83 + pp.x*0.045); pp.z += hang*0.022*sin(uTime*0.61 + pp.x*0.07 + 1.3); }
  vec4 wp = modelMatrix*vec4(pp, 1.0);`).replace("attribute vec3 color;","uniform float uTime; attribute vec3 color;"),D=new o.ShaderMaterial({uniforms:V,vertexShader:Z,fragmentShader:he,side:o.DoubleSide}),E=new o.Mesh(n.geometry(),D);E.name="gallery";const A=u.streams.crowd,S=[],q=Math.round(u.crowd??2400),B=(d,b,G,H)=>S.push([d,b,G,H,A.range(.9,1.1)*(A.chance(.12)?.68:1),A(),A(),A.chance(.3)?1:0]),W=Math.round(q*.17),T=Math.round(q*.17),be=q-W-T;for(let d=0;d<W;d++)B(A.range(t+1,r-1),i,x-1.5-A.range(0,1.4)*A(),A.range(-.5,.5));for(let d=0;d<T;d++){const b=A.pick(N);B(A.range(t+1,r-2),b,a+A.range(.9,1.8),A.range(-.4,.4))}let oe=0;for(;S.length<q&&oe++<q*20;){const d=t+2+(r-t-4)*Math.pow(A(),.8),b=a+3.2+(x-3.2-a-3.2)*Math.pow(A(),.75);d>496&&b>1107&&b<1143||d>430&&Math.abs(b-1125)<3.2+(d-430)*.012||B(d,i,b,A.chance(.6)?A.range(-.9,.9):A.range(.6,2.4))}for(const d of S)if(d[2]>x-k-.8)for(const[b,G]of X)d[0]>b-.7&&d[0]<G+.7&&(d[0]=d[0]-b<G-d[0]&&b-4>t?b-.7-2.5*d[5]:G+.7+2.5*d[5]);const J=ae(s,S,{indoor:!0,name:"crowd",uniforms:{uLampP:V.uLampP,uLampC:V.uLampC,uGalAmb:V.uGalAmb,uPortalP:V.uPortalP,uPortalC:V.uPortalC}});return{mesh:E,crowd:J,uniforms:V,lamps:M,triangles:n.i.length/3+J.triangles}}const we=`
precision highp float;
${O}
uniform vec3 uLamp;
varying vec3 vW, vN, vC; varying float vK;
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  // lit by the rooms: the deck by its own floor, the underside by the floor below, the rail's inner face by the room behind
  float fl = 0.88 + 0.12*sin(uTime*1.3 + vW.x*0.7);
  vec3 col = vC*(vec3(0.05, 0.053, 0.068) + uLamp*((0.5*max(N.y, 0.0) + 0.42*max(-N.y, 0.0) + 0.5*max(-N.z, 0.0) + 0.04*max(N.z, 0.0) + 0.12*abs(N.x))*fl));
  gl_FragColor = vec4(nlFog(col, vW), 1.0);
}`;function ye(y,s,l,u){const t=new Q,e=[.3,.31,.34],i=[.16,.17,.2],h=[],a=(f,p,m,w,g)=>{const z=I(m),k=z+w;t.box(f,m-.35,z-.3,p,m,k,e,0),t.box(f,m,k-.12,p,m+1.05,k,i,0),t.box(f,m,z,f+.12,m+1.05,k,i,0),t.box(p-.12,m,z,p,m+1.05,k,i,0);for(let P=0;P<g;P++)h.push([l.range(f+.5,p-.5),m,z+l.range(.55,w-.45),l.range(-.6,.6),l.range(.9,1.1)*(l.chance(.12)?.68:1),l(),l(),l.chance(.45)?1:0])},x=K.x-60,C=L.x1;for(const f of[60,120,180])for(let p=Math.ceil(x/48)*48;p+48<=C+1;p+=48){const m=l.chance(.5),w=l.int(7,15);!m||f>L.y0-12&&p+48>L.x0-2||a(p+9,p+47,f+1.3,2.8,w)}for(let f=0;f<110;f++){const p=l.int(Math.ceil((x+1200)/4),Math.floor((C+1200)/4)-1),m=l.int(3,Math.floor((L.y1+36)/6)),w=l.int(1,2),g=p*4-1200,z=m*6;p%12<2||m%10===0||Math.abs(g+2-K.x)<K.w/2+6&&z<K.h+8||g+4>L.x0-4&&z+6>L.y0-4&&z<L.y1+8||Math.abs(g+2-u.x)<u.hw+4&&Math.abs(z+3-u.y)<u.hh+4||a(g+.5,g+3.5,z+1.4,1.7,w)}const r=new o.Mesh(t.geometry(),new o.ShaderMaterial({uniforms:{...y.uniforms,uLamp:s.uLamp},vertexShader:te,fragmentShader:we,side:o.DoubleSide}));r.name="balconies";const n=ae(y,h,{name:"balcony-people",wave:1});return{mesh:r,people:n,triangles:t.i.length/3+n.triangles}}async function ge(y,s={}){s.streams||(s={...s,streams:{windows:y.rng.fork("windows"),crowd:y.rng.fork("crowd")}});const l=!s.shared,u=s.shared||ne(),t=new o.Group;t.name="last-house";const e=await se(y,{lit:s.lit??.7,rng:s.streams.windows});await y.yield();const i=s.streams.cities||y.core.makeRng(y.core.hashSeed("cities:"+y.seed)),h=s.streams.balconies||y.core.makeRng(y.core.hashSeed("balconies:"+y.seed)),a=ie(h),x={...u.uniforms,uWin:{value:e},uTex:{value:new o.Vector2(j,R)},uGal:{value:new o.Vector4(L.x0,X[5][0],L.y0,L.head)},uGate:{value:new o.Vector3(K.x,K.w/2,K.h)},uMetal:{value:new o.Color("#5F656E")},uLamp:{value:new o.Color("#FFC46B")},uPaleLamp:{value:new o.Color("#FFE3B4")},uGreet:{value:new o.Vector2(-1e3,0)},uWinE:{value:3},uWake:{value:1},uGalK:{value:.36*(s.galLight??1)},uDim:{value:2/3},uDimLamp:{value:new o.Color(.56,.7,1)},uWatch:{value:new o.Vector3(.5*(K.x-60+L.x1),.5*(L.x1-K.x+60),L.y1+36)},uPort:{value:new o.Vector4(a.x,a.y,a.hw,a.hh)},uCity:{value:new o.Vector4(i.range(0,97),i.range(0,97),1/8,1/6)}},C=new o.ShaderMaterial({uniforms:x,vertexShader:re,fragmentShader:ce}),r=new o.Mesh(fe(),C);r.name="face",t.add(r),await y.yield();const n=xe(y,u,x,s);t.add(n.mesh),t.add(n.crowd.mesh),await y.yield();const f=ye(u,x,h,a);t.add(f.mesh),t.add(f.people.mesh),await y.yield();const p=new o.Vector3;return{object:t,radius:150,height:210,center:new o.Vector3(330,150,1150),anchors:{portal:new o.Vector3(520,171,1125),gate:new o.Vector3(K.x,0,Y.half),arch:c,lamps:n.lamps},shared:u,uniforms:x,gallery:n,texture:e,triangles:3072*2+n.triangles+f.triangles,balconies:f,setGreet(m,w){x.uGreet.value.set(m,w)},update(m,w,g){if(p.setFromMatrixPosition(g.matrixWorld),n.crowd.uniforms.uEye.value.copy(p),f.people.uniforms.uEye.value.copy(p),l){u.uniforms.uTime.value=w;const z=Math.hypot(p.x,p.z)||1;u.uniforms.uPyrDir.value.set(-p.x/z,-p.z/z)}},dispose(){},ground:!0,groundY:0}}export{pe as FIG_POSE,L as GAL,X as GAL_PIERS,K as GATE,O as NL_GLSL,Y as PYR,ge as buildHero,I as faceZ,me as figureGeometry,ie as hallOfWatch,ae as makeFigures,ne as makeShared};
