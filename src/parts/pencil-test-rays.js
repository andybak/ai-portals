import*as e from"three";const O=["#F4EEDC","#333335","#A9A7A1","#D4D0C4","#9FD3EA","#D9472F"],M={length:400,pitch:12,count:33,half:8.5,speed:18,zStart:200};function re(o){const s=l=>new e.Matrix3().fromArray(l).invert().elements.map(n=>n.toFixed(6)).join(","),t=s([.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777]);return`
  vec3 toScene(vec3 D){
    vec3 y = clamp(mat3(${s([1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602])})*clamp(D, 0., 0.95), 0.0004, 0.97);
    vec3 A = 0.983729*y - 1., B = 0.432951*y - 0.0245786, Cc = 0.238081*y + 0.000090537;
    vec3 v = (-B - sqrt(max(B*B - 4.*A*Cc, 0.)))/(2.*A);
    return max(mat3(${t})*v, 0.)*${(.6/o).toFixed(5)};
  }`}function me(o,s=1){const t=(a,h)=>[a[0]*h[0]+a[3]*h[1]+a[6]*h[2],a[1]*h[0]+a[4]*h[1]+a[7]*h[2],a[2]*h[0]+a[5]*h[1]+a[8]*h[2]],i=new e.Matrix3().fromArray([.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777]).invert().elements,l=new e.Matrix3().fromArray([1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602]).invert().elements,f=t(l,[o.r,o.g,o.b].map(a=>Math.min(a,.95))).map(a=>Math.min(.97,Math.max(4e-4,a))).map(a=>{const h=.983729*a-1,c=.432951*a-.0245786,p=.238081*a+90537e-9;return(-c-Math.sqrt(Math.max(c*c-4*h*p,0)))/(2*h)}),r=t(i,f).map(a=>Math.min(1,Math.max(0,a)*.6/s));return new e.Color().setRGB(r[0],r[1],r[2])}const ie=o=>`
  ${re(o)}
  uniform vec3 uPaper, uGraphite, uSmudge, uPale, uBlue, uRed;
  uniform vec2 uRes;
  uniform float uTime;          // seconds, full rate
  uniform vec2 uSun;            // unit world xz direction the hatch shadows fall in (away from the sun circle)
  uniform vec3 uStage;          // x: clean inside (70 m), y: blue beyond (220 m), z: metres the clean line takes to lay (7.2)
  float hash11(float n){ return fract(sin(n*127.1 + 3.7)*43758.5453); }
  float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
  float hash31(vec3 p){ p = fract(p*vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y)*p.z); }
  float vnoise1(float x){ float i = floor(x), f = fract(x); f = f*f*(3. - 2.*f); return mix(hash11(i), hash11(i + 1.), f); }
  float vnoise2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(hash21(i), hash21(i + vec2(1, 0)), f.x), mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), f.x), f.y); }
  float vnoise3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f); vec2 o = vec2(0., 1.);
    return mix(mix(mix(hash31(i), hash31(i + o.yxx), f.x), mix(hash31(i + o.xyx), hash31(i + o.yyx), f.x), f.y),
               mix(mix(hash31(i + o.xxy), hash31(i + o.yxy), f.x), mix(hash31(i + o.xyy), hash31(i + o.yyy), f.x), f.y), f.z); }
  // stepped clocks: the living are on twos (12 drawings a second), held lines are re-traced 6 times a second
  float clock12(){ return floor(uTime*12.); }
  float clock6(){ return floor(uTime*6.); }
  // pencil grain, anchored to the world (so it slides in parallax) at a cell of about 1.5 pixels whatever the distance
  float grainAt(vec3 w, float dist){
    float cell = 0.0035*max(dist, 0.3), l = log2(cell), f = fract(l);
    float c0 = exp2(floor(l));
    return mix(vnoise3(w/c0), vnoise3(w/(c0*2.)), f)*0.7 + 0.3*vnoise3(w/(c0*6.) + 9.);
  }
  // quick diagonal hatch on a plane: p = plane coordinates in metres with +x toward where shadows fall.
  // returns coverage 0..1; fw must be fwidth of the hatch phase taken by the caller. Finer than ~3 px it is the flat average.
  float hatchPhase(vec2 p, float period){ return (p.x*0.62 + p.y*0.78)/period + 0.35*vnoise2(p*0.45); }
  float hatchCov(float ph, float fw, vec2 p){
    float row = floor(ph), f = abs(fract(ph) - 0.5);
    float along = p.x*0.78 - p.y*0.62;
    float brk = step(0.22, vnoise2(vec2(along*0.35 + row*7.3, row*1.7)));      // strokes lift off the paper here and there
    fw = max(fw, 1e-4);
    float line = (1. - smoothstep(0.16 - fw, 0.16 + fw, f))*brk;
    return mix(line, 0.3, smoothstep(0.28, 0.4, fw));
  }
  // stage of the drawing by distance: 0 clean (inside uStage.x), 1 rough, 2 blue construction only (beyond uStage.y)
  float stageOf(float dist){ return step(uStage.x, dist) + step(uStage.y, dist); }
`,_=`
  // returns the clip position; px = full width in pixels actually drawn (floor 1.6)
  vec4 ribbon(vec3 P, vec3 Q, float side, float press, float weight, out float px){
    vec4 a = projectionMatrix*viewMatrix*vec4(P, 1.), b = projectionMatrix*viewMatrix*vec4(Q, 1.);
    vec2 d = (b.xy/max(abs(b.w), 1e-4) - a.xy/max(abs(a.w), 1e-4))*uRes;
    float l = length(d); d = l > 1e-5 ? d/l : vec2(1., 0.);
    float dist = max(a.w, 0.3);
    float pxPerM = projectionMatrix[1][1]*uRes.y*0.5/dist;
    // a clean line is about 2 cm at 8 m and keeps that angular width further out
    px = max(max(0.02, 0.003*dist)*pxPerM*press*weight, 1.6);
    a.xy += vec2(-d.y, d.x)*side*px/uRes*a.w;
    a.z -= 0.0008*a.w;
    return a;
  }
  // boil: a wander of less than half a line width, re-seeded on a stepped clock
  vec3 boil(vec3 P, float seed, float clk, float dist){
    float h = seed*17.13 + clk*3.71;
    return P + (vec3(hash11(h), hash11(h + 1.3), hash11(h + 2.9)) - 0.5)*max(0.02, 0.003*dist)*0.45;
  }
`,U=`
  varying vec3 vW, vCol; varying vec3 vUVK;      // u along (m), v across -1..1, strength 0..1
  varying float vPx;
  void main(){
    if (vUVK.z < 0.01) discard;
    float dist = max(length(vW - cameraPosition), 0.3);
    float g = grainAt(vW, dist);
    float edge = mix(1., 1. - vUVK.y*vUVK.y, smoothstep(2.2, 5., vPx));
    float cov = edge*(0.62 + 0.6*g)*(0.6 + 0.4*vUVK.z);
    if (cov < 0.5) discard;
    // opaque mix toward paper: never alpha, so nothing sorts
    float k = vUVK.z*(0.78 + 0.22*smoothstep(0.15, 0.6, g));
    gl_FragColor = vec4(toScene(mix(uPaper, vCol, k)), 1.);
  }
`,le=`
  attribute vec3 aNext; attribute vec4 aLine;    // side, u along (m), pressure, pencil (0 graphite 1 blue 2 red 3 pale 4 smudge)
  attribute float aSeed;
  varying vec3 vW, vCol; varying vec3 vUVK; varying float vPx;
  vec3 pencil(float id){ return id < 0.5 ? uGraphite : id < 1.5 ? uBlue : id < 2.5 ? uRed : id < 3.5 ? uPale : id < 4.5 ? uSmudge : id < 5.5 ? uBlue : id < 6.5 ? mix(uPale, uPaper, 0.4) : uGraphite; }
  void main(){
    vec3 P = (modelMatrix*vec4(position, 1.)).xyz, Q = (modelMatrix*vec4(aNext, 1.)).xyz;
    float dist = length(P - cameraPosition);
    vec3 o = boil(vec3(0.), aSeed + floor(aLine.y*0.5), clock6(), dist);
    gl_Position = ribbon(P + o, Q + o, aLine.x, aLine.z, 1., vPx);
    if ((aLine.w > 4.5 && aLine.w < 5.5 && dist > 85.) || (aLine.w > 6.5 && dist > 130.)) gl_Position = vec4(0., 0., 2., 1.);      // small notes are not there from afar
    vW = P; vCol = pencil(aLine.w); vUVK = vec3(aLine.y, aLine.x, 1.);
  }
`,ce=`
  varying vec3 vL, vW; uniform float uCell; uniform vec4 uLaneFade;
  float gridLine(float x, float fw, float px){ float d = abs(fract(x - 0.5) - 0.5)/max(fw, 1e-5); return 1. - smoothstep(px*0.5 - 0.5, px*0.5 + 0.5, d); }
  void main(){
    float dist = max(length(vW - cameraPosition), 0.3);
    vec2 q = vL.xz/uCell, fw = fwidth(q);
    // 10 m cells while a cell is wider than ~7 px, then every fifth line, then only paper (the horizon guide is a ribbon)
    vec2 fine = vec2(gridLine(q.x, fw.x, 1.25), gridLine(q.y, fw.y, 1.25))*(1. - smoothstep(0.09, 0.2, fw));
    vec2 q5 = q/5., fw5 = fw/5.;
    vec2 coarse = vec2(gridLine(q5.x, fw5.x, 1.4), gridLine(q5.y, fw5.y, 1.4))*(1. - smoothstep(0.08, 0.2, fw5));
    float g = grainAt(vW, dist);
    float line = max(max(fine.x, fine.y), max(coarse.x, coarse.y))*(0.55 + 0.45*smoothstep(0.1, 0.55, g));
    gl_FragColor = vec4(toScene(mix(uPaper, uBlue, clamp(line, 0., 1.))), 1.);
  }
`,D=`
  // hatch (uMode 0) or thumb smudge (uMode 1) on a quad: uv -1..1 is the patch, world xz anchors the marks
  varying vec3 vW; varying vec2 vUv, vP; varying float vAmt; uniform float uMode;
  void main(){
    if (vAmt < 0.01) discard;
    float dist = max(length(vW - cameraPosition), 0.3);
    float rim = length(vUv) + 0.35*(vnoise2(vP*0.9 + 3.) - 0.5);
    if (rim > 0.5 + 0.5*vAmt) discard;
    vec2 p = vP; float ph = hatchPhase(p, dist < 5. ? 0.09 : dist < 12. ? 0.16 : dist < 34. ? 0.27 : 0.6), fw = fwidth(ph);
    float c = uMode > 0.5 ? 0.75 + 0.25*grainAt(vW, dist) : hatchCov(ph, fw, p);
    // the heart of a shadow is hatched a second time, across the first, and pressed harder (a value step deeper than its fringe)
    vec2 p2 = vec2(p.y, -p.x); float ph2 = hatchPhase(p2, dist < 5. ? 0.1 : dist < 12. ? 0.18 : dist < 34. ? 0.3 : 0.66), fw2 = fwidth(ph2);
    float heart = uMode > 0.5 ? 0. : step(rim, 0.22 + 0.4*vAmt)*step(dist, 90.);
    float c2 = hatchCov(ph2, fw2, p2)*heart;
    if (max(c, c2) < 0.25) discard;
    gl_FragColor = vec4(toScene(mix(uPaper, uMode > 0.5 ? uSmudge : mix(uSmudge, uGraphite, 0.26 + 0.34*heart*step(0.25, c2)), clamp(max(c, c2), 0., 1.))), 1.);
  }
`;function fe(o=O,s={}){const t=c=>new e.Color(o[c]||O[c]),i=s.exposure??1,l=s.stage??[70,220,7.2],n={uPaper:{value:t(0)},uGraphite:{value:t(1)},uSmudge:{value:t(2)},uPale:{value:t(3)},uBlue:{value:t(4)},uRed:{value:t(5)},uRes:{value:new e.Vector2(800,450)},uTime:{value:0},uStage:{value:new e.Vector3(l[0],l[1],l[2])},uSun:{value:new e.Vector2(1,0)}},f=ie(i),r=[],a=c=>{const p=new e.ShaderMaterial(c);return r.push(p),p};return{uniforms:n,GLSL:f,RIBBON_GLSL:_,LINE_FS:U,exposure:i,lineMaterial(c=le,p={}){return a({uniforms:{...n,...p},vertexShader:f+_+c,fragmentShader:f+U,side:e.DoubleSide})},paperMaterial(c={}){return a({uniforms:{...n,...c},side:e.DoubleSide,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:2,vertexShader:"void main(){ gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }",fragmentShader:f+"void main(){ gl_FragColor = vec4(toScene(uPaper), 1.); }"})},toneMaterial(c=0){return a({uniforms:{...n,uMode:{value:c}},side:e.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1,vertexShader:"varying vec3 vW; varying vec2 vUv, vP; varying float vAmt; void main(){ vUv = uv*2. - 1.; vAmt = 1.; vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vP = w.xz; gl_Position = projectionMatrix*viewMatrix*w; }",fragmentShader:f+D})},seaMaterial(c=10){return a({uniforms:{...n,uCell:{value:c},uLaneFade:{value:new e.Vector4}},polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1,vertexShader:"varying vec3 vL, vW; void main(){ vL = position; vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }",fragmentShader:f+ce})},skyMaterial(){return a({uniforms:n,side:e.BackSide,depthWrite:!1,vertexShader:"void main(){ gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }",fragmentShader:f+"void main(){ gl_FragColor = vec4(toScene(uPaper), 1.); }"})},ribbonGeometry:N,update(c,p){n.uTime.value=c,p&&(p.getDrawingBufferSize(n.uRes.value),n.uRes.value.y<2&&n.uRes.value.set(800,450))},dispose(){for(const c of r)c.dispose()}}}function N(o){let s=0;for(const h of o)s+=h.pts.length;const t=new Float32Array(s*6),i=new Float32Array(s*6),l=new Float32Array(s*8),n=new Float32Array(s*2),f=[];let r=0;o.forEach((h,c)=>{const p=h.pts,b=p.length,m=h.seed??c*7.31;let w=0;for(let u=0;u<b;u++){const A=p[u],v=u<b-1?p[u+1]:[2*A[0]-p[u-1][0],2*A[1]-p[u-1][1],2*A[2]-p[u-1][2]];u>0&&(w+=Math.hypot(A[0]-p[u-1][0],A[1]-p[u-1][1],A[2]-p[u-1][2]));const x=u/(b-1),S=typeof h.press=="function"?h.press(x):h.press??1,y=.82+.36*(.5+.5*Math.sin(m*12.9+x*(5+m%3)*2.1)),k=S*y*(h.taper===!1?1:.45+.55*Math.min(1,Math.sin(Math.PI*Math.min(Math.max(x,.001),.999))*3));for(let L=0;L<2;L++)t.set(A,r*3),i.set(v,r*3),l.set([L?1:-1,w,k,h.pencil??0],r*4),n[r]=m,r++;u<b-1&&f.push(r-2,r-1,r,r-1,r+1,r)}});const a=new e.BufferGeometry;return a.setAttribute("position",new e.BufferAttribute(t,3)),a.setAttribute("aNext",new e.BufferAttribute(i,3)),a.setAttribute("aLine",new e.BufferAttribute(l,4)),a.setAttribute("aSeed",new e.BufferAttribute(n,1)),a.setIndex(f),a}const W=48,q=14;function he(o){const s=.94+o()*.12,t=o.range(-.03,.03),i=(c,p)=>new e.Vector3(c,p,0),l=(c,p)=>new e.CatmullRomCurve3(c,!1,"centripetal").getPoints(p),n=l([i(0,.4*s),i(.06,.43*s),i(.115,.6*s)],3),f=l([i(.115,.6*s),i(.175,.44*s),i(.3,.4*s),i(.58,.31*s),i(.84,.11+t),i(1,-.15+t)],11),r=l([i(1,-.15+t),i(.84,-.1+t),i(.56,-.17*s),i(.3,-.36*s),i(.12,-.58*s),i(.045,-.7*s),i(0,-.72*s)],10),a=[...n,...f.slice(1),...r.slice(1)],h=a.map(c=>new e.Vector2(c.x,c.y));for(let c=a.length-2;c>=0;c--)h.push(new e.Vector2(-a[c].x,a[c].y));return h}const z=`
  uniform float uS, uSeed; uniform vec2 uFlip; uniform vec2 uPlan[${W+1}];
  const float NS = ${q}.;
  uniform float uSomer, uShadowLen, uFlat;         // uFlat 1: the ray flies belly down, wings level (a leap to be looked at from above)
  uniform float uT2[34];                           // the Arcade: seconds before the eye passes arch i (index i + 2) that its ray takes off
  struct Arch { float i, T, H, dir, zc, span, ok, rollS, skew, big, wide, t2; };
  float gReal;                   // seconds on the eye's own clock (rubbing-out keeps to it)
  float gKey = 0.;               // 1 while a key of the flip test is being placed (a key never somersaults)
  float gTau;                    // the leap clock in seconds (set by archOf): the eye passes the arch at a.T
  float gOpen = 1.;              // how far the ray's wings are open in the pose just set (leapPose): 0 a dart at the water, 1 the flat kite
  float gSlim = 1.;              // ... and how far they are drawn in (the span of the dart as a part of the kite's)
  // seconds before a.T: the ray takes off (T2; it is three seconds in the air), the arc of action is pencilled (TARC)
#ifdef SEA
  #define TARC 10.5
#else
  #define TARC 11.0
#endif
#ifdef SEA
  // a free leap on the open sea: the same drawing, placed by instance attributes in a window that wraps round the eye,
  // looping on its own clock (arc at 0 s, the blue ovals of the plan from 0.45, the ray 1.2-4.2, its splash to 5.4)
  attribute vec4 aL0, aL1;       // base x, base z, heading, phase (s)  |  height (m), half span (m), leap length (m), id + seed
  uniform vec4 uSea;             // clock (s), window side (m), shown from (m), shown to (m) of the eye at mid-cycle
  uniform vec4 uCamV;            // eye x, z and its velocity x, z
  uniform vec3 uSeaP;            // period (s), metres the spot moves between cycles, heading scatter (rad)
  uniform vec4 uKeep[6];         // six segments (xz to xz) the leaps keep clear of (the camera's course)
  uniform vec4 uKeepR;           // clearance (m) | a half plane dot(xz, .yz) < .w outside which nothing leaps
  vec3 gO; vec2 gR; float gS;
  float segDist(vec2 p, vec4 sg){ vec2 pa = p - sg.xy, ba = sg.zw - sg.xy; return length(pa - ba*clamp(dot(pa, ba)/max(dot(ba, ba), 1e-4), 0., 1.)); }
  Arch archOf(float slot){
    Arch a; float tt = uSea.x + aL0.w, n = floor(tt/uSeaP.x);
    gTau = tt - n*uSeaP.x; gReal = gTau; a.big = 1.; a.wide = 1.; a.t2 = 9.3;
    float r = aL1.w*1.37 + n*0.618 + uSeed;
    vec2 c0 = uCamV.xy + uCamV.zw*(uSeaP.x*0.5 - gTau);    // where the eye will be half way through this cycle
    vec2 b = aL0.xy + (vec2(hash11(r + 0.2), hash11(r + 0.4)) - 0.5)*uSeaP.y;
    b += uSea.y*floor((c0 - b)/uSea.y + 0.5);
    float d0 = length(b - c0);
    a.i = aL1.w + n; a.ok = step(uSea.z, d0)*step(d0, uSea.w)*step(0., tt); a.T = 10.5;     // nothing before its clock starts
    a.ok *= step(uKeepR.x, min(min(min(segDist(b, uKeep[0]), segDist(b, uKeep[1])), min(segDist(b, uKeep[2]), segDist(b, uKeep[3]))), min(segDist(b, uKeep[4]), segDist(b, uKeep[5]))))*step(dot(b, uKeepR.yz), uKeepR.w);
    gS = aL1.z/17.;
    a.H = abs(aL1.x)*(uSeaP.y > 0.001 ? 0.75 + 0.5*hash11(r) : 1.)/gS; a.dir = aL1.x < 0. || hash11(r + 0.5) < 0.5 ? 1. : -1.; a.zc = 0.; a.span = aL1.y/gS;     // a negative height: always along the heading
    a.rollS = hash11(r + 0.77) < 0.5 || (uFlat > 0.01 && uFlat < 0.99) ? 1. : -1.; a.skew = (hash11(r + 0.93) - 0.5)*4./max(gS, 1.);     // (a long leap strays no further than a short one)
    float hd = aL0.z + (hash11(r + 0.11) - 0.5)*uSeaP.z; gR = vec2(cos(hd), sin(hd)); gO = vec3(b.x, 0., b.y);
    return a;
  }
  vec3 toWd(vec3 v){ return vec3(v.x*gR.x - v.z*gR.y, v.y, v.x*gR.y + v.z*gR.x); }
  vec3 toW(vec3 p){ return gO + toWd(p*gS); }
  vec3 shadowAt(vec3 C){ vec3 w = toW(vec3(C.x, 0., C.z)); w.xz += uSun.xy*uShadowLen*C.y*gS; return w; }
#else
  vec3 toW(vec3 p){ return (modelMatrix*vec4(p, 1.)).xyz; }
  vec3 toWd(vec3 v){ return mat3(modelMatrix)*v; }
  vec3 shadowAt(vec3 C){ return toW(vec3(C.x + uShadowLen*C.y, 0., C.z)); }
  // pool slot -> the arch it stands for just now (the window runs from 22 m behind the eye to 146 m ahead)
  Arch archOf(float slot){
    gReal = uS/18.; gTau = gReal;
    Arch a; float i0 = ceil((max(uS, -46.) - 22.)/12.);
    a.i = i0 + mod(slot - i0, NS);
    a.ok = step(-2.5, a.i)*step(a.i, 30.5);                 // arches -2 and -1 stand before the lane proper
    a.T = (6. + 12.*a.i)/18.; a.t2 = uT2[int(clamp(a.i + 2.5, 0., 33.))];
    float r = a.i*1.37 + uSeed;
    a.H = 8. + 2.4*hash11(r);
    a.dir = a.i < 18.5 ? 1. : -1.;                 // leapt from the left as far as arch 18 (the eye keeps right of the axis till then: the ray lands on its side, inside the frame), then from the right
    a.zc = 200. - (6. + 12.*a.i) + (hash11(r + 0.31) - 0.5)*1.6;
    a.span = 3.1 + 0.6*hash11(r + 0.57);
    a.rollS = hash11(r + 0.77) < 0.5 ? 1. : -1.;
    a.skew = (hash11(r + 0.93) - 0.5)*5.;
    // variety down the colonnade: arches 9-13 lean so that each crosses the next; arches 20-22 are
    // drawn half as large again
    if (a.i > 8.5 && a.i < 13.5) a.skew = 13.;
    a.big = a.i > 19.5 && a.i < 22.5 ? 1.3 : 1.; a.wide = a.big > 1.2 ? 1.14 : 1.;
    return a;
  }
  // the flip test: the wave's clock at this arch (below 0: not rolled yet), and whether key kq is the drawing in hand
  // (two runs of 1.7 s; on each of the six arches ahead one of six keys is the drawing in hand, one key further on from arch
  // to arch, and every arch steps one key on at twelve a second: ONE ray caught in successive drawings, a dart at a near
  // foot, a kite on a crown beyond, a dart going in further off, running down the colonnade)
  float flipClock(Arch a){ return (uFlip.x >= 0. && uFlip.x < 1.7) || (uFlip.x >= 2.5 && uFlip.x < 4.2) ? uFlip.x : -1.; }
  float flipIs(float fph, float kq, float i, float dA){
    float m = mod(floor(fph*12.) + i - floor(kq*0.5) + 60., 6.);
    float on = m < 0.5 || (dA < 46. && abs(m - 3.) < 0.5) ? 1. : 0.;
    return on*step(0.5, mod(i + 40., 2.))*step(20., dA)*step(dA, 118.);
  }
#endif
  // when the arc of action is pencilled, and when the blue ovals of the plan begin to be set along it
  float arcT0(Arch a){
    float t = a.T - TARC;
#ifndef SEA
    t -= 14.*step(a.i, 8.5);                       // the first arcs of the colonnade are pencilled in long before: it is there from the first glance
#endif
    return t;
  }
  // seconds since the ray of this leap took off (negative: not yet). Far ahead of the eye the first arches of the colonnade
  // are leapt again and again, every five seconds, each time over a plan set out afresh (gLoop), so the Arcade is alive
  // from the first glance; an arch's last leap is the one that meets the eye.
  float gLoop;
  float leapClock(Arch a){
    float x = gTau - (a.T - a.t2); gLoop = 0.;
#ifndef SEA
    if (a.i < 8.5 && x < -1.){ x = mod(x, 5.); if (x > 3.6) x -= 5.; gLoop = 1.; }
    else if (mod(a.i, 2.) > 0.5) x = min(x, -2.);  // every other arch is still only its plan when the eye comes by: two rays in the air at once, never a knot
    if (a.i > 27.5) x = min(x, -2.);               // the last three arches are never leapt: the plan stands bare before the page
#endif
    return x;
  }
  float planT0(Arch a){
#ifdef SEA
    return arcT0(a) + 0.45;
#else
    return a.i < 8.5 ? arcT0(a) + 0.5 : a.T - 7.6;
#endif
  }
  // A BODIED DRAWING (a cleaned-up ray is opaque: paper fill, tone, line). hk = (1 the leaping ray | 0 a key of the flip
  // test, its place k of twelve along the arc). Returns whether it is there, and its place on the arc.
  float bodyOf(Arch a, vec2 hk, out float l, out float t, out float tone){
    float show = a.ok; tone = 1.; l = 1.; gKey = hk.x > 0.5 ? 0. : 1.;
    if (hk.x > 0.5){
      float dr = floor(leapClock(a)*12.);
      show *= step(-0.5, dr)*step(dr, 35.5); t = (dr + 0.5)/36.;
    } else {
      t = (3.*hk.y + 1.5)/36.;
#ifdef SEA
      show = 0.;
#else
      float fph = flipClock(a), dA = 6. + 12.*a.i - uS;
      show *= (fph >= 0. ? flipIs(fph, hk.y, a.i, dA) : 0.)*step(a.T - TARC, gTau);
#endif
    }
    return show;
  }
  float isSomer(float i){ return max(uSomer, mod(i, 4.) > 2.5 ? 1. : 0.)*(1. - gKey); }
  vec3 arcPoint(Arch a, float l, float t){
    float H = a.H*(a.big > 1.2 ? 0.86 : 0.94);
    return vec3(a.dir*(-8.5 + 17.*t)*a.wide, 4.*H*t*(1. - t), a.zc + a.skew*(t - 0.5));
  }
  // pose of the ray at leap parameter t (0 leaves the water, 1 lands); l = 0 first ray, 1 the one that follows
  void leapPose(Arch a, float l, float t, out vec3 C, out vec3 hd, out vec3 wg, out vec3 nm, out float flap){
    float H = a.H*(a.big > 1.2 ? 0.86 : 0.94);
    C = arcPoint(a, l, t);
    vec2 tg = normalize(vec2(a.dir*17.*a.wide, 4.*H*(1. - 2.*t)));
    float sa = isSomer(a.i)*6.2832*smoothstep(0.1, 0.9, t)*a.dir;
    float cs = cos(sa), sn = sin(sa); tg = vec2(tg.x*cs - tg.y*sn, tg.x*sn + tg.y*cs);
    hd = vec3(tg, 0.);
    vec3 n0 = vec3(-tg.y, tg.x, 0.)*a.dir;
#ifdef SEA
    float open = smoothstep(0.04, 0.27, t)*(1. - smoothstep(0.73, 0.96, t));
#else
    float open = smoothstep(0.04, 0.25, t)*(1. - smoothstep(0.8, 0.98, t));       // (down the lane a ray stays open till it is nearly in the water: the nearest kite is the largest)
#endif
    gOpen = open; gSlim = mix(0.42, 1., open);
    // at the water the ray is a slim dart: its wings drawn in (a narrow lens with the spine down the middle), nearly flat to
    // the lane like the open kite over the top, so its two edges never close up into a blade
    float ro = 1.5708*mix(0.8, 1., open)*a.rollS*(1. - 0.9*uFlat);
    wg = vec3(0., 0., cos(ro)) + n0*sin(ro);
    nm = cross(wg, hd);
    flap = 0.12*(1. - open) + 0.2*sin(12.566*t + l)*open*(1. - gKey);       // (a key of the flip test is a held pose: no flap)
    // AN ANIMATOR NEVER DRAWS THE KITE EDGE-ON (a flat ray seen along its own plane is a black blade). Seen nose-on or
    // tail-on it is drawn with level wings lifted in a shallow V; seen within 25 degrees of its plane from the side it is
    // rolled just far enough to show its back.
    vec3 vd = cameraPosition - toW(C); vd /= max(length(vd), 1e-3);
    float cg = dot(toWd(nm), vd), ch = dot(toWd(wg), vd), cR = sqrt(cg*cg + ch*ch);
    float nose = (1. - smoothstep(0.3, 0.55, cR))*(uFlat > 0.01 ? 0. : 1.);       // (a banking or level ray keeps its own roll)
    if (nose > 0.001){
      wg = normalize(mix(wg, vec3(0., 0., wg.z < 0. ? -1. : 1.), nose)); nm = cross(wg, hd); flap += 0.42*nose*open;
      cg = dot(toWd(nm), vd); ch = dot(toWd(wg), vd); cR = sqrt(cg*cg + ch*ch);
    }
    float cT = min(0.42, 0.95*cR);
    if (cR > 0.3 && abs(cg) < cT && uFlat < 0.5){
      float bq = acos(clamp(cT/cR, 0., 1.)), aq = atan(ch, cg), ab = abs(aq);      // (cR is over 0.3 here: never atan(0, 0))
      float pq = (aq < 0. ? -1. : 1.)*(ab < 1.5708 ? ab - bq : ab - (3.14159 - bq));
      float cq = cos(pq), sq = sin(pq);
      vec3 w2 = wg*cq - nm*sq; nm = nm*cq + wg*sq; wg = w2;
    }
  }
  vec2 planAt(float f){ f = clamp(f, 0., ${W}.); int i = int(floor(f)); int i2 = min(i + 1, ${W});
    return mix(uPlan[i], uPlan[i2], f - float(i)); }
  vec3 rayLocal(vec2 p, float flap){
    float a = abs(p.x), be = flap*(0.2 + 0.8*a);
    return vec3(sign(p.x)*a*cos(be)*gSlim, a*sin(be)*gSlim + 0.05*max(0., 1. - a*2.5), p.y);
  }
  // planform point of mark number j of a part: 0 outline, 1 straight strokes (spine, creases), 2 tail, 3 blue oval, 4 blue axes
  vec2 markAt(float part, float j, float n, vec4 ab, float rough, float seed, float whip){
    float u = j/max(n, 1.);
    if (part < 0.5){
      if (rough < 0.5) return planAt(j);
      vec2 o = vec2(vnoise1(j*0.33 + seed), vnoise1(j*0.29 + seed + 40.)) - 0.5;
      return planAt(mod(j*1.31 + 5., ${W}.))*(1. + 0.07*(vnoise1(j*0.09 + seed) - 0.5)) + o*0.055;
    }
    if (part < 1.5) return mix(ab.xy, ab.zw, u) + vec2(0., 0.03*sin(u*3.1416));
    if (part < 2.5) return vec2(whip*u*u*0.62 + 0.06*sin(u*9. + whip*4.)*u, ab.y - (ab.y - ab.w)*u);
    if (part < 3.5){ float an = u*6.2832*1.24 + 0.5 + seed; float rr = 1. + 0.05*u;
      return vec2(1.07*rr*cos(an), -0.04 + 0.66*rr*sin(an)); }
    return mix(ab.xy, ab.zw, u);
  }
`,Q=`
  float gDeep = 0.;              // 1: a drawing right under the eye: the softest pencil, a value step deeper
  float gRibs = 1.;              // 0: a ray folded to a dart (no wing ribs, no pressure: a strip of tone and its spine)
  float segD(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba*clamp(dot(pa, ba)/max(dot(ba, ba), 1e-5), 0., 1.)); }
  vec4 backTone(vec2 pl, float e, float g, float fp, float tone){
    float ax = abs(pl.x), nz = vnoise2(pl*4.3 + 7.);
    if (e > 1. && e > 0.94 + 0.2*nz) return vec4(0.);
    vec3 cSm = mix(uPaper, mix(uSmudge, uGraphite, 0.24*gDeep), tone), cDk = mix(uPaper, mix(uSmudge, uGraphite, 0.5 + 0.28*gDeep), tone), cGr = mix(uPaper, uGraphite, tone);
    float sw = pl.y + 0.42*ax;                                      // constant along the sweep of a wing
    float lead = 0.5 - 0.5*ax*sqrt(ax) - pl.y;                      // how far behind the leading edge
    float streak = vnoise2(vec2(ax*2.3 + 3., sw*12.))*0.62 + g*0.38;
    vec3 col = cSm;
    // light: the leading edge of each wing and a few gaps between the strokes stay paper
    float lit = step(0.2, ax)*(1. - smoothstep(0.03 + 0.05*nz, 0.05 + 0.05*nz, lead))*step(e, 1.);
    lit = max(lit, step(streak, 0.21)*step(0.3, ax));
    col = mix(col, uPaper, lit);
    // pressure: along the spine, and in strokes that follow the sweep across the middle of each wing
    float press = step(ax, 0.15 + 0.1*nz)*step(pl.y, 0.42);
    press = max(press, step(0.52, vnoise2(vec2(ax*3.1 + 9., sw*25.))*0.7 + g*0.3)*smoothstep(0.07, 0.13, lead)*(1. - smoothstep(0.26, 0.5 + 0.2*nz, lead)));
    col = mix(col, cDk, press*(1. - lit)*step(e, 1.));
    // a ray folded to a dart is a lens of line with only a strip of tone down its middle: paper either side of it
    if (gRibs < 0.5) col = mix(uPaper, cSm, step(ax, 0.36 + 0.2*nz)*step(e, 1.));
    // line: spine, three ribs to a wing, the eyes
    float lw = max(0.011, fp*0.75), d = segD(pl, vec2(0., 0.37), vec2(0., -0.64));
    vec2 q = vec2(ax, pl.y);
    for (int i = 0; i < 3; i++){ float fi = float(i);
      d = min(d, segD(q, vec2(0.13, 0.2 - 0.15*fi), vec2(0.5 - 0.06*fi, 0.1 - 0.13*fi)) + 0.004 + 9.*(1. - gRibs));
      d = min(d, segD(q, vec2(0.5 - 0.06*fi, 0.1 - 0.13*fi), vec2(0.86 - 0.2*fi, -0.11 - 0.07*fi)) + 0.008 + 9.*(1. - gRibs)); }
    d = min(d, length(q - vec2(0.15, 0.43)) - 0.02);
    col = mix(col, cGr, (1. - smoothstep(lw, lw + fp, d))*step(0.3, g + 0.4*step(d, lw*0.5))*step(e, 1.)*step(fp, 0.062));
    return vec4(col, 1.);
  }
`,I=`
  attribute vec4 aV, aAB;        // part, j, side, n  |  stroke ends in planform
  attribute vec3 aI;             // instance: pool slot, kind (0 a key of the flip test | 1 the leaping ray and the blue drawings ahead of it | 2 a blue oval of the plan), k
  varying vec3 vW, vCol; varying vec3 vUVK; varying float vPx;
  vec3 place(vec2 p, vec3 C, vec3 hd, vec3 wg, vec3 nm, float flap, float span){
    vec3 r = rayLocal(p, flap); return C + span*(r.x*wg + r.y*nm + r.z*hd); }
  void main(){
    Arch a = archOf(aI.x);
    float tau = gTau, kind = aI.y, k = aI.z, show = a.ok, l = 1., t, live = 0., fut = 0., flip = 0., plan = 0., filled = -1.;
    float xLeap = leapClock(a), dr = floor(xLeap*12.);          // the drawing the leaping ray has reached (36 to a leap, on twos)
    float part = aV.x, j = aV.y, n = aV.w, u = j/max(n, 1.);
    gKey = kind < 0.5 ? 1. : 0.;
    if (kind < 0.5){
      // THE FLIP TEST (rare): the animator rolls the drawings and a wave runs down the colonnade: on every arch one bold
      // bodied ray steps round the plan, at a different place on each
      t = (3.*k + 1.5)/36.;
#ifdef SEA
      show = 0.;
#else
      float fph = flipClock(a), dF = 6. + 12.*a.i - uS;
      flip = fph >= 0. && flipIs(fph, k, a.i, dF) > 0.5 ? 1. : 0.;
      show *= flip*step(a.T - TARC, tau);     // (the bare plans ahead, never one so near that the frame would cut it)
#endif
    } else if (kind < 1.5){
      // THE LEAPING RAY, and the next two drawings of it, not yet made: blue kites standing on the next ovals of the plan
      float d = k - 4., kf = floor((dr + 2.)/3.) + d - 1.;
      live = 1. - step(0.5, abs(d)); fut = step(0.5, d);
      show *= step(-0.5, dr)*step(dr, 35.5)*step(-0.5, d)*(fut > 0.5 ? step(kf, 11.5) : 1.);
      t = fut > 0.5 ? (3.*kf + 1.5)/36. : (dr + 0.5)/36.;
    } else {
      // THE PLAN: twelve blue ovals along the arc of action, one for each drawing not yet made, set one after another when
      // the arc is pencilled. The ray rubs each out as it fills it.
      plan = 1.; t = (3.*k + 1.5)/36.;
      filled = xLeap - (3.*k + 1.)/12.;
      show *= step(planT0(a) + k*0.06, tau)*step(filled, 0.3)*(gLoop > 0.5 ? step(-1.4 + k*0.09, xLeap) : 1.);
    }
    vec3 C, hd, wg, nm; float flap; leapPose(a, l, t, C, hd, wg, nm, flap);
    float dist = length(toW(C) - cameraPosition);
    float st = stageOf(dist), cleanF = clamp((uStage.x - dist)/uStage.z, 0., 1.);
    float seed = aI.x*31. + k + kind*400. + a.i*0.37;
    float rough = part < 0.5 && live > 0.5 ? step(cleanF, u + 0.001) : 0.;
    float whip = sin(t*15. + 2. + a.i);
    vec2 p = markAt(part, j, n, aAB, rough, seed, whip), q = markAt(part, j + 0.5, n, aAB, rough, seed, whip);
    if (plan > 0.5){ float ps = st > 1.5 ? 0.85 : 0.4; p *= ps; q *= ps; }       // (an oval of the plan is only the mass of the body: a bead on the arc)
    float span = a.span*a.big;
    vec3 P = toW(place(p, C, hd, wg, nm, flap, span));
    vec3 Q = toW(place(q, C, hd, wg, nm, flap, span));
    // what is not yet drawn stands a little behind the drawing in hand, so no blue line ever crosses the bold ray
    if (live < 0.5 && flip < 0.5){ vec3 bk = normalize(P - cameraPosition + vec3(0., 1e-4, 0.))*0.6; P += bk; Q += bk; }
    // which marks exist at this stage of the drawing
    float blue = step(2.5, part);
    if (plan > 0.5) show *= part > 2.5 && part < 3.5 ? step(dist, 150.) : 0.;
#ifndef SEA
    if (plan > 0.5) show *= dist < 38. ? 1. : mod(k, 4.) < 0.5 ? step(dist, 66.) : 0.;      // (down the colonnade the beads thin out, then only the arcs stand)
#endif
    else if (fut > 0.5) show *= part < 0.5 ? step(dist, 150.) : 0.;
    else if (flip > 0.5) show *= 1. - blue;
    else if (blue < 0.5) show *= (1. - step(1.5, st))*(part < 0.5 ? 1. : step(0.999, cleanF));
    else show *= step(0.5, st)*(part < 3.5 || st > 1.5 ? 1. : 0.);     // a cleaned ray keeps no construction; a rough one is scribbled over its oval
    // value: stepped, never alpha. The drawing in hand is the sure bold line, thick and thin; what is to come is blue
    float press = 0.6 + 0.85*vnoise1(j*0.21 + seed), wt = 1., str = 1.;
    vec3 col = dist < 62. ? uGraphite : dist < 120. ? mix(uGraphite, uSmudge, 0.35) : mix(uGraphite, uSmudge, 0.6);
    wt = (dist < 14. ? 3.1 : dist < 32. ? 2.6 : dist < 62. ? 2.1 : 1.6)*(part > 0.5 ? 0.62 : 1.);
    if (fut > 0.5){ col = mix(uBlue, uPaper, k > 5.5 ? 0.3 : 0.); wt = 1.; press = 0.8; }
    if (plan > 0.5){ col = mix(uBlue, uPaper, filled >= 0. ? 0.6 : dist > 80. ? 0.3 : 0.); wt = dist < 45. ? 1.15 : 1.; press = 0.8; }
    if (blue > 0.5 && plan < 0.5){ col = uBlue; press = 0.8; wt = 1.; }
    if (part > 0.5 && part < 2.5) press *= 0.35 + 0.65*sin(3.1416*clamp(u, 0.02, 0.98))*(part > 1.5 ? 1.6*(1. - u) + 0.2 : 1.);
    if (flip > 0.5) wt = min(wt, part > 0.5 ? 1.3 : 2.1);
    if (live > 0.5 || flip > 0.5){
      wt *= mix(0.5, 1., smoothstep(0.1, 0.7, gOpen));
      // a dart keeps its outline (with the horns), its spine and its tail: the creases of the wings are for the open kite
      if (part > 0.5 && part < 1.5 && abs(aAB.x) > 0.05) show *= step(0.45, gOpen);
    }
    if (rough > 0.5){ press *= 0.85; wt = min(wt, 1.5); }
    vec3 o = boil(vec3(0.), seed + floor(j*0.25), live > 0.5 || flip > 0.5 ? clock12() : clock6(), dist);
    gl_Position = ribbon(P + o, Q + o, aV.z, press, wt, vPx);
    if (show < 0.5) gl_Position = vec4(0., 0., 2., 1.);
    if (live < 0.5 && flip < 0.5) str *= smoothstep(6., 11., dist);
    vW = P; vCol = col; vUVK = vec3(j*0.2, aV.z, show*str);
  }
`,$=`
#ifdef SEA
  #define HULLSCALE gS
#else
  #define HULLSCALE 1.
#endif
  attribute vec3 aH;             // outline index j (centre: -1), ring (0 centre, 1 outline, 1.12 the smudge's overshoot), -
  attribute float aSlot; attribute vec2 aHK;        // aHK: 0 a held key | 1 the live ray, drawing number
  varying vec2 vPl; varying float vE, vDors, vTone, vSpan, vOpen; varying vec3 vW;
  void main(){
    Arch a = archOf(aSlot);
    float l, t, tone, show = bodyOf(a, aHK, l, t, tone);
    vec3 C, hd, wg, nm; float flap; leapPose(a, l, t, C, hd, wg, nm, flap);
    vOpen = gOpen;
    vec3 Cw = toW(C); float dist = length(Cw - cameraPosition);
    // (a body is there whatever the stage of the drawing: in the rough pass it is the scribbled ray's paper and tone)
    show *= step(dist, 112.);
    tone = dist < 46. ? 1. : dist < 80. ? 0.74 : 0.5;         // a value step paler with distance, never a fade
    vTone = tone;
    vec2 p = aH.x < -0.5 ? vec2(0., -0.05) : planAt(aH.x)*max(aH.y, 1.);
    vec3 r = rayLocal(p, flap);
    float span = a.span*a.big;
    vec4 w = vec4(toW(C + span*(r.x*wg + r.y*nm + r.z*hd)), 1.);
    vDors = dot(toWd(nm), cameraPosition - Cw); vPl = p*span*HULLSCALE; vSpan = span*HULLSCALE; vE = aH.y; vW = w.xyz;     // (planform in metres, whatever the length of a free leap)
    gl_Position = show > 0.5 ? projectionMatrix*viewMatrix*w : vec4(0., 0., 2., 1.);
  }
`,Y=`
  varying vec2 vPl; varying float vE, vDors, vTone, vSpan, vOpen; varying vec3 vW;
  uniform float uDark;           // 1: the smudged back whichever side faces us (the breaches: the one dark whole shape of their frame)
  float seg2(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba*clamp(dot(pa, ba)/max(dot(ba, ba), 1e-5), 0., 1.)); }
  void main(){
    float dist = max(length(vW - cameraPosition), 0.3), g = grainAt(vW, dist);
    float nz = vnoise2(vPl*1.3 + 7.), ph = hatchPhase(vPl, dist < 16. ? 0.25 : 0.3), fw = fwidth(ph);
    float ph2 = hatchPhase(vec2(vPl.y, -vPl.x), dist < 16. ? 0.29 : 0.34), fw2 = fwidth(ph2);
    float fp = max(length(fwidth(vPl)), 1e-4), lw = max(0.014, fp*0.7);
    vec3 col = uPaper;
    // (a ray further down the colonnade keeps its paper body but its tone is a value step paler)
    vec3 cSm = mix(uPaper, uSmudge, vTone), cGr = mix(uPaper, uGraphite, vTone);
    if ((vDors > 0. && uDark > -0.5) || uDark > 0.5){          // the dark back: tone, pressure, spine and ribs (backTone)
      gRibs = step(0.45, vOpen); gDeep = step(dist, 27.);
      vec4 c = backTone(vPl/max(vSpan, 0.1), vE, g, fp/max(vSpan, 0.1), vTone);
      if (c.a < 0.5) discard;
      col = c.rgb;
    } else {                  // white belly: paper, with the quick hatch on the side away from the sun circle
      if (vE > 1.) discard;
      float mh = vPl.x*0.5 - vPl.y*0.25 + 0.8*(nz - 0.5), m = step(0.0, mh);
      col = mix(uPaper, mix(cSm, cGr, 0.3), hatchCov(ph, fw, vPl)*m);
      vec2 pc = vec2(vPl.y, -vPl.x);                                 // cross-hatched where the belly turns furthest from the sun circle
      col = mix(col, mix(cSm, cGr, 0.5), hatchCov(ph2, fw2, pc)*step(0.75, mh)*step(dist, 60.));
      // two remoras ride under it: small dark fish, a lens of tone in line, the eye left as paper
      vec2 pn = vPl/max(vSpan, 0.1); float fpn = fp/max(vSpan, 0.1);
      float r1 = seg2(pn, vec2(0.11, -0.02), vec2(0.17, -0.40)) - 0.020*(1. - 0.7*smoothstep(-0.2, -0.42, pn.y));
      float r2 = seg2(pn, vec2(-0.27, 0.10), vec2(-0.37, -0.19)) - 0.018*(1. - 0.7*smoothstep(-0.02, -0.2, pn.y));
      float rm = min(r1, r2);
      col = mix(col, cSm, step(rm, 0.)*step(0.2, g)*step(fpn, 0.03));
      col = mix(col, uPaper, step(min(length(pn - vec2(0.118, -0.06)), length(pn - vec2(-0.283, 0.065))), 0.008)*step(fpn, 0.006));
      col = mix(col, cGr, (1. - smoothstep(0.003 + fpn*0.4, 0.003 + fpn*1.3, abs(rm)))*step(fpn, 0.03));
      vec2 g2 = vec2(abs(vPl.x), vPl.y); float dm = 1e3;
      for (int n = 0; n < 5; n++){ float fn = float(n); dm = min(dm, seg2(g2, vec2(0.26 + 0.03*fn, 0.42 - 0.17*fn), vec2(0.5 - 0.02*fn, 0.36 - 0.18*fn))); }
      dm = min(dm, seg2(g2, vec2(0., 0.86), vec2(0.2, 0.9)));
      col = mix(col, cGr, (1. - smoothstep(lw, lw + fp, dm))*0.9*step(fp, 0.2));
    }
    gl_FragColor = vec4(toScene(col), 1.);
  }
`;function E(o=()=>!0){const s=[[0,W,0,0,0,0],[1,4,0,.34,0,-.62],[1,4,.13,.22,.64,-.03],[1,4,-.13,.22,-.64,-.03],[2,10,0,-.7,0,-1.74],[3,18,0,0,0,0],[4,2,0,.95,0,-1.6],[4,2,-1.25,-.03,1.25,-.03]].filter(r=>o(r[0])),t=[],i=[],l=[];let n=0;for(const[r,a,h,c,p,b]of s)for(let m=0;m<=a;m++){for(let w=0;w<2;w++)t.push(r,m,w?1:-1,a),i.push(h,c,p,b),n++;m<a&&l.push(n-2,n-1,n,n-1,n+1,n)}const f=new e.InstancedBufferGeometry;return f.setAttribute("position",new e.BufferAttribute(new Float32Array(n*3),3)),f.setAttribute("aV",new e.BufferAttribute(new Float32Array(t),4)),f.setAttribute("aAB",new e.BufferAttribute(new Float32Array(i),4)),f.setIndex(l),f}function X(){const o=[-1,0,0],s=[];for(let i=0;i<=W;i++)o.push(i,1,0,i,1.12,0);for(let i=0;i<W;i++){const l=1+i*2;s.push(0,l,l+2,l,l+1,l+3,l,l+3,l+2)}const t=new e.InstancedBufferGeometry;return t.setAttribute("position",new e.BufferAttribute(new Float32Array(o.length),3)),t.setAttribute("aH",new e.BufferAttribute(new Float32Array(o),3)),t.setIndex(s),t}const J=`
  attribute vec4 aV;             // part (0 arc, 1 tick), j, side, n or tick number
  attribute float aSlot;
  varying vec3 vW, vCol; varying vec3 vUVK; varying float vPx;
  void main(){
    Arch a = archOf(aSlot);
    float tau = gTau, t0 = arcT0(a), press, seed = aSlot*3.1, ua;
    float xLeap = leapClock(a), tr = xLeap/3.;     // where the leaping ray is on it (above 1: it has landed)
    float fr = clamp(gLoop > 0.5 ? (xLeap + 1.4)/0.4 : (tau - t0)/0.4, 0., 1.), show = a.ok*step(t0, tau);
    vec3 p, q;
    if (aV.x < 0.5){
      float u = min(mix(-0.015, 1.015, aV.y/max(aV.w, 1.)), fr*1.03 - 0.015);
      p = arcPoint(a, 1., u); q = arcPoint(a, 1., u + 0.01); ua = u;
      press = 0.55 + 0.75*sin(3.1416*clamp(u, 0., 1.)) + 0.25*vnoise1(aV.y*0.4 + a.i);
    } else {
      float tk = (3.*aV.w + 1.5)/36.; ua = tk;
      vec3 c = arcPoint(a, 1., tk), e = arcPoint(a, 1., tk + 0.01) - c;
      vec3 nn = normalize(vec3(-e.y, e.x, 0.) + vec3(0., 1e-5, 0.))*(0.2 + 0.1*hash11(aV.w + a.i));
      p = c + nn*(aV.y*2. - 1.) + vec3(0.08*(hash11(aV.w*3. + a.i) - 0.5), 0., 0.); q = p + nn*0.5;
      show *= step(t0 + 0.45 + aV.w*0.05, tau)*(gLoop > 0.5 ? step(-0.95 + aV.w*0.05, xLeap) : 1.); press = 0.9;
    }
    vec3 P = toW(p), Q = toW(q);
    float dist = length(P - cameraPosition);
    vec3 bk = normalize(P - cameraPosition + vec3(0., 1e-4, 0.))*0.75; P += bk; Q += bk;      // (behind the bold ray and its blue drawings)
    if (aV.x > 0.5) show *= step(dist, 135.);          // spacing ticks finer than the line are left off
    show *= 1. - step(1.04, tr);                       // once the ray has landed nothing of the plan is left
    vec3 o = boil(vec3(0.), seed + floor(aV.y*0.2) + aV.x*9., clock6(), dist);
    gl_Position = ribbon(P + o, Q + o, aV.z, press, dist < 45. ? 2.1 : dist < 120. ? 1.7 : 1.4, vPx);
    if (show < 0.5) gl_Position = vec4(0., 0., 2., 1.);
    float rub = step(ua, tr), farA = 0.25*step(260., dist);         // far off the plan is a step paler
    vW = P; vCol = mix(uRed, uPaper, max(rub*0.42, farA)); vUVK = vec3(aV.y, aV.z, show*(1. - 0.25*rub)*smoothstep(5., 11., dist));
  }
`;function Z(o=40,s=12){const t=[],i=[];let l=0;for(let f=0;f<=o;f++)t.push(0,f,-1,o,0,f,1,o),l+=2,f<o&&i.push(l-2,l-1,l,l-1,l+1,l);for(let f=0;f<s;f++)t.push(1,0,-1,f,1,0,1,f,1,1,-1,f,1,1,1,f),i.push(l,l+1,l+2,l+1,l+3,l+2),l+=4;const n=new e.InstancedBufferGeometry;return n.setAttribute("position",new e.BufferAttribute(new Float32Array(l*3),3)),n.setAttribute("aV",new e.BufferAttribute(new Float32Array(t),4)),n.setIndex(i),n}const pe=(o,s=1)=>{const t=new Float32Array(q*s);for(let i=0;i<t.length;i++)t[i]=i;return o.setAttribute("aSlot",new e.InstancedBufferAttribute(t,1)),o.instanceCount=t.length,o};async function ge(o,s={}){const t=o.rng,i=s.detail??o.quality?.detail??1,l=s.preview??!1,n=s.style||fe(s.palette||O,{exposure:(s.exposure??1)*(l?2.1:1),stage:s.stage}),f=new e.Group;f.name="arcade-of-leaps";const r={uFlip:{value:new e.Vector2(-1,0)},uS:{value:0},uSeed:{value:t()*50},uPlan:{value:he(t)},uSomer:{value:s.somersault?1:0},uShadowLen:{value:s.shadowLen??.45},uFlat:{value:0},uDark:{value:1},uT2:{value:Array.from({length:34},(d,g)=>(s.takeoff&&s.takeoff[g-2])??(((g-2)%4+4)%4===0?4.6:2))}},a=d=>z+d,h=(d,g,C=0)=>{const F=new e.Mesh(d,g);return F.frustumCulled=!1,F.renderOrder=C,f.add(F),F},c=[];if(s.sky!==!1&&h(new e.SphereGeometry(2800,16,10),n.skyMaterial(),-.5),s.sea!==!1){const d=new e.CircleGeometry(1500,48);d.rotateX(-Math.PI/2),h(d,n.seaMaterial(10),-4)}await o.yield();const p=[1,3,5,7,9,11],b=i<.8?6:12,m=E(),w=[],u=[],A=[];for(let d=0;d<q;d++){for(const g of p)w.push(d,0,g);w.push(d,1,4),A.push(d,1,5,d,1,6);for(let g=0;g<b;g++)u.push(d,2,Math.round(g*12/b))}const v=d=>{const g=[],C=[];for(let F=0;F<q;F++){g.push(F),C.push(1,0);for(const ne of p)g.push(F),C.push(0,ne)}return d.setAttribute("aSlot",new e.InstancedBufferAttribute(new Float32Array(g),1)),d.setAttribute("aHK",new e.InstancedBufferAttribute(new Float32Array(C),2)),d.instanceCount=g.length,d};m.setAttribute("aI",new e.InstancedBufferAttribute(new Float32Array(w),3)),m.instanceCount=w.length/3;const x=n.lineMaterial(a(I),r);h(m,x,2),c.push(m);const S=n.lineMaterial(a(I),r);S.depthWrite=!1;const y=E(d=>d===3);y.setAttribute("aI",new e.InstancedBufferAttribute(new Float32Array(u),3)),y.instanceCount=u.length/3,h(y,S,.5),c.push(y);const k=E(d=>d===0);k.setAttribute("aI",new e.InstancedBufferAttribute(new Float32Array(A),3)),k.instanceCount=A.length/3,h(k,S,.5),c.push(k),await o.yield();const L=v(X()),P=new e.ShaderMaterial({uniforms:{...n.uniforms,...r},side:e.DoubleSide,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:2,vertexShader:n.GLSL+z+$,fragmentShader:n.GLSL+Q+Y});h(L,P,1),c.push(L);const R=pe(Z(48,12)),V=n.lineMaterial(a(J),r);V.depthWrite=!1,h(R,V,.5),c.push(R),await o.yield();const T=te(t);{const d=new Float32Array(q*2);for(let g=0;g<d.length;g++)d[g]=Math.floor(g/2)*4+2+g%2;T.setAttribute("aSlot",new e.InstancedBufferAttribute(d,1)),T.instanceCount=d.length}h(T,n.lineMaterial(a(ee),r),2),c.push(T);const B=new e.InstancedBufferGeometry;B.setAttribute("position",new e.BufferAttribute(new Float32Array([-1,0,-1,1,0,-1,1,0,1,-1,0,1]),3)),B.setIndex([0,2,1,0,3,2]),v(B);const H=new e.ShaderMaterial({uniforms:{...n.uniforms,...r,uMode:{value:0}},side:e.DoubleSide,vertexShader:n.GLSL+z+ae,fragmentShader:n.GLSL+D});h(B,H,1),c.push(B),await o.yield();const K=N(de(t)),oe=h(K,n.lineMaterial(),1);c.push(K),await o.yield();let j=null;const se=s.previewS??0,G=new e.Vector3;return{rayUniforms:r,laneGuides:oe,object:f,style:n,radius:40,height:11,center:new e.Vector3(0,-1,0),ground:!1,groundY:0,anchors:{axis:[0,0,-1],laneStart:[0,2,M.zStart],laneEnd:[0,2,-M.zStart],footX:M.half,flyThrough:[[0,2,260],[0,2,200],[0,2,100],[0,2,0],[0,2,-100],[0,2,-200],[0,2.9,-210],[0,9.7,-228.8],[0,16.6,-247.6],[0,23.4,-266.4]],portalSeat:{position:[0,23.4,-266.4],facing:[0,-.342,.94],radius:7,tiltDeg:20},slots:[[-60,23.4,-266.4],[60,23.4,-266.4]],viewpoints:{axis:{from:[0,2,214],to:[0,6,0]},under:{from:[0,2,60],to:[0,7,20]},side:{from:[46,4,40],to:[0,5,0]}},arches:Array.from({length:M.count},(d,g)=>{const C=g-2;return{z:M.zStart-(6+M.pitch*C),s:6+M.pitch*C,from:C<19?-1:1,somersault:(C%4+4)%4===3}}),timing:{speed:M.speed,arcDrawn:-7.4,firstLeap:[-7,-4],secondLeap:[-4.35,-1.35],erased:[.2,1.1]}},flipTest(d,g=r.uS.value){r.uFlip.value.set(d,g)},setProgress(d){j=d},update(d,g,C){s.style||n.update(g,o.renderer),f.updateWorldMatrix(!0,!1),G.setFromMatrixPosition(C.matrixWorld),f.worldToLocal(G),r.uS.value=j??M.zStart-G.z+se},dispose(){for(const d of c)d.dispose();P.dispose(),H.dispose(),s.style||n.dispose()}}}const ee=`
  attribute vec4 aV; attribute vec2 aM;      // part (0 loops, 1 crown, 2 droplets, 3 ellipses), j, side, n | stroke number, random
  attribute float aSlot;                     // slot*4 + leap*2 + end (0 leaving the water, 1 landing)
  varying vec3 vW, vCol; varying vec3 vUVK; varying float vPx;
  vec3 splashPt(float part, float u, float m, float rnd, float age, float ph0){
    float th = u*6.2832;
    if (part < 0.5){ float g = 0.55 + age*2.6; th = th*1.18 + m*2.1; float ph = m*2.094 + ph0;
      vec2 lp = vec2(0.62*sin(th) + (m - 1.)*0.45, 1.05*(1. - cos(th)) + 0.1)*g; return vec3(lp.x*cos(ph), lp.y, lp.x*sin(ph)); }
    float g = 0.85 + (clamp(age, 0.25, 0.6) - 0.25)*1.1, R = 1.05*g;
    if (part < 1.5){ float sp = th*4. + ph0, tooth = floor(sp/3.14159);
      // scalloped rim: six leaves with round tops that lean outward and sharp valleys between them, every leaf its own height
      float yn = (0.42 + 0.58*pow(abs(sin(sp)), 0.7))*(0.7 + 0.3*hash11(tooth + ph0)), Rr = R*(1. + 0.42*yn);
      return vec3(Rr*cos(th), 0.1 + 1.3*g*yn, Rr*sin(th)); }
    // droplets: small circles thrown just clear of the leaf tips
    if (part < 2.5){ float an = ((floor(m*2. + 1.) + 0.5)*3.14159 - ph0)/4., r = 0.075 + 0.045*rnd;
      return vec3(cos(an)*R*1.42 + r*cos(th), (1.3 + 0.2*fract(rnd*7.3 + m*0.37))*g + r*sin(th), sin(an)*R*1.42); }
    float ge = 1. + (min(age, 1.15) - 0.7)*1.2, Re = (m < 0.5 ? 1.25 : 2.0)*ge; th = th*1.08 + m + ph0;
    return vec3(Re*cos(th), 0., Re*0.92*sin(th));
  }
  void main(){
    float slot = floor(aSlot/4. + 0.01), le = aSlot - slot*4., l = floor(le/2. + 0.01), e = le - l*2.;
    Arch a = archOf(slot);
#ifdef SEA
    float age = floor((leapClock(a) - e*3. + 0.04)*12.)/12.;
#else
    float age = floor((leapClock(a) - e*2.8 + 0.04)*12.)/12.;      // (the crown opens as the nose goes in, while the arch's foot is still in the frame)
#endif
    float part = aV.x, u = aV.y/aV.w, show = a.ok*step(0., age)*step(0.5, l);
    show *= part < 0.5 ? step(age, 0.24) : part < 2.5 ? step(0.25, age)*step(age, 0.94) : step(aM.x < 0.5 ? 0.25 : 0.7, age);     // the inner ellipse is the crown's foot
    vec3 F = arcPoint(a, l, e); F.y = 0.04;
#ifdef SEA
    float sc = a.span/2.5*(e > 0.5 ? 1.3 : 1.05), ph0 = a.i*2.3 + le;
#else
    float sc = a.span/2.5*(e > 0.5 ? 1.2 : 0.95), ph0 = a.i*2.3 + le;      // (a crown is a small, sure drawing: never larger than the ray that made it)
#endif
    if (part < 0.5) sc *= 0.6;                     // the first loose loops stay small: the crown is the drawing
    vec3 p = F + sc*splashPt(part, u, aM.x, aM.y, age, ph0), q = F + sc*splashPt(part, u + 0.02, aM.x, aM.y, age, ph0);
    vec3 Fw = toW(F);
    if (part > 0.5 && part < 1.5){
      // the crown is drawn as the animator would from the side: the row of leaves on our side stands, the far row lies low
      vec2 tc = cameraPosition.xz - Fw.xz; tc /= max(length(tc), 1e-3);
      vec2 dp = toW(p).xz - Fw.xz, dq = toW(q).xz - Fw.xz;
      float fp = dot(dp/max(length(dp), 1e-3), tc), fq = dot(dq/max(length(dq), 1e-3), tc);
      p.y = F.y + (p.y - F.y)*mix(0.3, 1., smoothstep(-0.45, 0.25, fp)); q.y = F.y + (q.y - F.y)*mix(0.3, 1., smoothstep(-0.45, 0.25, fq));
    }
    vec3 P = toW(p), Q = toW(q);
    float dist = length(Fw - cameraPosition), st = stageOf(dist);
    show *= 1. - step(1.5, st);
    // a near splash that the edge of the frame would cut is not drawn at all
    vec4 cF = projectionMatrix*viewMatrix*vec4(Fw, 1.);
    show *= max(step(34., dist), step(abs(cF.x), 0.78*cF.w))*(part < 2.5 ? step(9., dist) : step(3.5, dist));
#ifndef SEA
    show *= step(dist, 82.);
#endif
    float lev = step(45., dist) + step(95., dist) + step(150., dist), rub = step(1.15, age);
    vec3 col = lev < 0.5 ? uGraphite : lev < 1.5 ? mix(uGraphite, uSmudge, 0.6) : lev < 2.5 ? uSmudge : uPale;
    if (part < 0.5) col = mix(col, uSmudge, 0.6);
    if (part > 2.5) col = mix(col, uSmudge, 0.75);
    if (rub > 0.5) col = mix(uPale, uPaper, 0.45);
    if (st > 0.5 && part > 0.5 && part < 2.5) col = uBlue;          // not yet cleaned up: the crown is still construction
    float seed = aSlot*5.3 + aM.x*11. + part*3.;
    vec3 o = boil(vec3(0.), seed + floor(aV.y*0.25), rub > 0.5 ? clock6() : clock12(), dist)*1.6;
    gl_Position = ribbon(P + o, Q + o, aV.z, 0.7 + 0.5*vnoise1(aV.y*0.5 + seed), part > 0.5 && part < 1.5 ? (lev < 0.5 ? 2.4 : 1.6) : part < 2.5 ? 1.6 : 1.3, vPx);
    if (show < 0.5) gl_Position = vec4(0., 0., 2., 1.);
    vW = P; vCol = col; vUVK = vec3(aV.y*0.2, aV.z, show*(1. - 0.25*rub));
  }
`;function te(o){const s=[];for(let r=0;r<3;r++)s.push([0,12,r]);s.push([1,44,0]);for(let r=0;r<4;r++)s.push([2,8,r]);s.push([3,24,0],[3,24,1]);const t=[],i=[],l=[];let n=0;for(const[r,a,h]of s){const c=o();for(let p=0;p<=a;p++){for(let b=0;b<2;b++)t.push(r,p,b?1:-1,a),i.push(h,c),n++;p<a&&l.push(n-2,n-1,n,n-1,n+1,n)}}const f=new e.InstancedBufferGeometry;return f.setAttribute("position",new e.BufferAttribute(new Float32Array(n*3),3)),f.setAttribute("aV",new e.BufferAttribute(new Float32Array(t),4)),f.setAttribute("aM",new e.BufferAttribute(new Float32Array(i),2)),f.setIndex(l),f}const ae=`
#ifdef SEA
  #define SEASCALE gS
  #define SHADOWP w.xz*mat2(uSun.x, -uSun.y, uSun.y, uSun.x)
#else
  #define SEASCALE 1.
  #define SHADOWP position.xz*size + a.i
#endif
  attribute float aSlot; attribute vec2 aHK;
  varying vec3 vW; varying vec2 vUv, vP; varying float vAmt;
  void main(){
    Arch a = archOf(aSlot);
    float l, t, tone, show = bodyOf(a, aHK, l, t, tone);
    vec3 C = arcPoint(a, l, t);
    float open = smoothstep(0.08, 0.4, t)*(1. - smoothstep(0.62, 0.94, t));
    vec2 size = a.span*a.big*vec2(mix(0.7, 1.25, open), 1.3);
    vec4 w = vec4(shadowAt(C) + toWd(vec3(position.x*size.x, 0., position.z*size.y))*SEASCALE + vec3(0., 0.05, 0.), 1.);
    vW = w.xyz; vUv = position.xz; vP = SHADOWP;
    float dist = length(w.xyz - cameraPosition);
    vAmt = show*step(dist, 112.)*(1. - 0.45*C.y/11.);
    gl_Position = vAmt > 0.01 ? projectionMatrix*viewMatrix*w : vec4(0., 0., 2., 1.);
  }
`,ue=["0212100002","1210","021211010010","02121101111000","020111121110","120201111000","120200101101","021210","01021210000111","110102121000"];function de(o){const s=[],i=M.half,l=M.zStart,n=(f,r,a,h,c)=>{const p=[],b=Math.ceil(Math.abs(h-a)/14);for(let m=0;m<=b;m++)p.push([f+(o()-.5)*.05,r,a+(h-a)*m/b]);s.push({pts:p,pencil:1,press:c,taper:!1,seed:o()*90})};n(-i,.035,l+96,-l-9,1),n(i,.035,l+88,-l-13,1),n(0,.035,l+110,-l-62,.8),n(-i-.25,.035,l-60,-l+40,.6),n(i+.3,.035,l+70,l+4,.6);for(let f=-2;f<M.count-2;f++){const r=l-(6+M.pitch*f),a=f<2;for(const b of[-1,1]){const m=b*i,w=(a?.95:.45)+o()*.2,u=o.range(-.2,.2),A=a?1:5;s.push({pts:[[m-w*Math.cos(.8+u),.035,r-w*Math.sin(.8+u)],[m+w*Math.cos(.8+u),.035,r+w*Math.sin(.8+u)]],pencil:A,press:a?1.2:.9,seed:o()*90}),s.push({pts:[[m-w*Math.cos(-.8+u),.035,r-w*Math.sin(-.8+u)],[m+w*Math.cos(-.8+u),.035,r+w*Math.sin(-.8+u)]],pencil:A,press:a?1.2:.9,seed:o()*90})}s.push({pts:[[-.5-o()*.2,.035,r],[.5+o()*.2,.035,r+o.range(-.05,.05)]],pencil:5,press:.8,seed:o()*90});const h=String(f+3),c=a?.52:.4;let p=i+1.5;for(const b of h){const m=ue[+b],w=[];for(let u=0;u+1<m.length;u+=2)w.push([p+(+m[u]+(o()-.5)*.12)*c+ +m[u+1]*c*.1,.45+(+m[u+1]+(o()-.5)*.1)*c,r+.4]);w.length>1&&s.push({pts:w,pencil:a?7:5,press:a?1.5:1,taper:!1,seed:o()*90}),p+=c*1.6}a&&s.push({pts:[[i+1.2,.3,r+.4],[p+.2,.34,r+.4]],pencil:1,press:.9,seed:o()*90})}return s}function we(o,s,t={}){const i=t.leaps,l=new e.Group,n=[],f=[],r={...s,uS:{value:0},uFlip:{value:new e.Vector2(-1,0)},uFlat:{value:typeof t.flat=="number"?t.flat:t.flat?1:0},uDark:{value:typeof t.dark=="number"?t.dark:t.dark?1:0},uSea:{value:new e.Vector4(0,t.window??1e6,t.from??0,t.to??1e6)},uCamV:{value:new e.Vector4},uSeaP:{value:new e.Vector3(t.period??11.2,t.jitter??0,t.scatter??0)},uKeep:{value:Array.from({length:6},(v,x)=>t.keep&&t.keep[x]||new e.Vector4(0,1e5,0,1e5))},uKeepR:{value:t.keepR??new e.Vector4(0,0,0,1)}},a=(v,x,S)=>{const y=i.length*x,k=new Float32Array(y*4),L=new Float32Array(y*4);return i.forEach((P,R)=>{for(let V=0;V<x;V++){const T=(R*x+V)*4;k.set([P.x,P.z,P.heading,P.phase],T),L.set([P.height,P.half,P.length,(P.id??R)+(P.seed??0)],T)}}),v.setAttribute("aL0",new e.InstancedBufferAttribute(k,4)),v.setAttribute("aL1",new e.InstancedBufferAttribute(L,4)),S&&S(v,y),v.instanceCount=y,n.push(v),v},h=(v,x,S)=>{x.defines={SEA:1};const y=new e.Mesh(v,x);return y.frustumCulled=!1,y.renderOrder=S,l.add(y),f.push(x),y},c=(t.skins??[4]).filter(v=>v>4),p=t.plan??0,b=(v,x)=>{const S=new Float32Array(x*2);for(let y=0;y<i.length;y++)S.set([1,0],y*2);v.setAttribute("aHK",new e.InstancedBufferAttribute(S,2))},m=(v,x)=>(S,y)=>{const k=new Float32Array(y*3);i.forEach((L,P)=>x.forEach((R,V)=>k.set([(L.id??P)+(L.seed??0),v,R],(P*x.length+V)*3))),S.setAttribute("aI",new e.InstancedBufferAttribute(k,3))},w=o.lineMaterial(z+I,r),u=o.lineMaterial(z+I,r);if(u.depthWrite=!1,h(a(E(t.parts),1,m(1,[4])),w,2),c.length&&h(a(E(v=>v===0),c.length,m(1,c)),u,.5),p&&h(a(E(v=>v===3),p,m(2,Array.from({length:p},(v,x)=>Math.round(x*12/p)))),u,.5),t.hull&&h(a(X(),1,b),new e.ShaderMaterial({uniforms:{...o.uniforms,...r},side:e.DoubleSide,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:2,vertexShader:o.GLSL+z+$,fragmentShader:o.GLSL+Q+Y}),1),t.arc){const v=o.lineMaterial(z+J,r);v.depthWrite=!1,h(a(Z(t.arc[0],t.arc[1]),1),v,.5)}const A=t.splash??[];if(A.length&&h(a(te(t.rng),A.length,(v,x)=>{const S=new Float32Array(x);i.forEach((y,k)=>A.forEach((L,P)=>{S[k*A.length+P]=(y.id??k)*4+L})),v.setAttribute("aSlot",new e.InstancedBufferAttribute(S,1))}),o.lineMaterial(z+ee,r),2),t.shadow){const v=new e.InstancedBufferGeometry;v.setAttribute("position",new e.BufferAttribute(new Float32Array([-1,0,-1,1,0,-1,1,0,1,-1,0,1]),3)),v.setIndex([0,2,1,0,3,2]),h(a(v,1,b),new e.ShaderMaterial({uniforms:{...o.uniforms,...r,uMode:{value:0}},side:e.DoubleSide,vertexShader:o.GLSL+z+ae,fragmentShader:o.GLSL+D}),1)}return{group:l,geos:n,mats:f,uniforms:r,set(v,x,S,y,k){r.uSea.value.x=v,r.uCamV.value.set(x,S,y,k)}}}export{Q as BACK_GLSL,ue as DIGITS,M as LANE,O as PALETTE,ge as buildHero,we as makeLeapPool,fe as makeStyle,N as ribbonGeometry,me as toSceneColor};
