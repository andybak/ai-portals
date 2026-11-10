import*as n from"three";const Et=["#0E0D10","#E23A2C","#F4A0B5","#F5E08C","#5FA356","#3F9BD8","#F7F3EA"],lt={orange:"#F58B30",lilac:"#B48BD8",lavender:"#9E9CDA"},$e=6;function ve(p,g=1,z=1){const u=[[.59719,.35458,.04823],[.076,.90834,.01566],[.0284,.13383,.83777]],i=[[1.60475,-.53108,-.07367],[-.10208,1.10813,-.00605],[-.00327,-.07276,1.07602]],w=(D,R)=>D.map(Y=>Y[0]*R[0]+Y[1]*R[1]+Y[2]*R[2]),h=D=>D.map(R=>(R*(R+.0245786)-90537e-9)/(R*(.983729*R+.432951)+.238081)),c=new n.Color(p),m=[c.r*z,c.g*z,c.b*z];let y=m.slice();for(let D=0;D<200;D++){const R=w(i,h(w(u,y.map(Y=>Y*g/.6))));y=y.map((Y,X)=>Math.min(.87,Math.max(0,Y+(m[X]-Math.min(1,Math.max(0,R[X])))*.6)))}return new n.Color().setRGB(y[0],y[1],y[2],n.LinearSRGBColorSpace)}async function ia(p,g){const u=new Uint8Array(262144),i=(m,y)=>{const D=new Float32Array(m*y);for(let R=0;R<D.length;R++)D[R]=g();return{a:D,nx:m,ny:y}},w=(m,y,D)=>{const R=Math.floor(y),Y=Math.floor(D);let X=y-R,G=D-Y;X=X*X*(3-2*X),G=G*G*(3-2*G);const $=(R%m.nx+m.nx)%m.nx,_=($+1)%m.nx,C=(Y%m.ny+m.ny)%m.ny,o=(C+1)%m.ny,f=m.a[C*m.nx+$],b=m.a[C*m.nx+_],x=m.a[o*m.nx+$],k=m.a[o*m.nx+_];return f+(b-f)*X+(x-f)*G+(f-b-x+k)*X*G},h=[[i(64,64),i(128,128),.55,i(16,16),.3],[i(6,96),i(12,128),.5,i(3,40),.35],[i(8,8),i(16,16),.4,i(4,4),.2]];for(let m=0;m<3;m++){const[y,D,R,Y,X]=h[m],G=new Float32Array(256*256);for(let f=0;f<256;f++){for(let b=0;b<256;b++){const x=b/256,k=f/256;G[f*256+b]=w(y,x*y.nx,k*y.ny)+R*w(D,x*D.nx,k*D.ny)+X*w(Y,x*Y.nx,k*Y.ny)}f%32===31&&await p.yield()}let $=1/0,_=-1/0;for(let f=0;f<G.length;f++)G[f]<$&&($=G[f]),G[f]>_&&(_=G[f]);const C=new Float32Array(1025),o=1024/Math.max(1e-6,_-$);for(let f=0;f<G.length;f++)C[Math.min(1023,Math.floor((G[f]-$)*o))+1]++;for(let f=1;f<=1024;f++)C[f]+=C[f-1];await p.yield();for(let f=0;f<G.length;f++)u[f*4+m]=Math.round(255*C[Math.min(1023,Math.floor((G[f]-$)*o))+1]/G.length);await p.yield()}for(let m=0;m<256*256;m++)u[m*4+3]=255;const c=new n.DataTexture(u,256,256,n.RGBAFormat,n.UnsignedByteType);return c.wrapS=c.wrapT=n.RepeatWrapping,c.magFilter=n.LinearFilter,c.minFilter=n.LinearMipmapLinearFilter,c.generateMipmaps=!0,c.anisotropy=4,c.needsUpdate=!0,c}const Re=`
  uniform float uTime, uFinger, uGhost;
  uniform sampler2D uTooth;
  uniform vec4 uCloud[5];          // world xz of the centre, half-length along the wind, half-width across it
  uniform vec2 uWind;              // unit world xz the wind blows toward
  uniform vec4 uGust;              // world xz, radius, strength 0..1
  float pbHash(float n){ return fract(sin(n * 12.9898 + 4.137) * 43758.5453); }
  // x: how far the drawing is rubbed out here (0..1); y: freshness just behind a trailing edge (0..1)
  vec2 pbShadow(vec2 p, float off, float rag){
    float s = 0., f = 0.;
    vec2 w = uWind, c = vec2(-uWind.y, uWind.x);
    for (int i = 0; i < 5; i++) {
      vec4 C = uCloud[i];
      vec2 d = p - C.xy;
      float al = dot(d, w) + off, qa = al / max(C.z, 1.), qb = dot(d, c) / max(C.w, 1.);
      float m = (1. - sqrt(qa * qa + qb * qb)) * min(C.z, C.w) + rag;      // metres inside the edge
      s = max(s, smoothstep(-1.5, 1.5, m));
      f = max(f, step(m, 0.) * exp(min(m, 0.) * 0.14) * (1. - smoothstep(-0.2, 0.1, qa)));
    }
    return vec2(s, f);
  }
  float pbGust(vec2 p){ vec2 d = (p - uGust.xy) / max(uGust.z, 1.); return uGust.w * exp(-dot(d, d)); }
  // THE SAILS' SHADOW (fourth polish): the first mill's four blades thrown on the bank as four bars of bare paper that turn
  // with the sails. uBlade: world xz of the hub's shadow, the sails' angle, strength; uBladeM: ground offset -> the sail
  // plane (two rows); uBladeS: a blade's bar, across (from, to) and along (from, to), metres in the sail plane.
  // x: rubbed out here (0..1); y: just stroked back behind the bar's trailing edge (0..1)
  uniform vec4 uBlade, uBladeM, uBladeS;
  vec2 pbArm(vec2 a){
    float al = smoothstep(uBladeS.z - 1., uBladeS.z + 1., a.y) * (1. - smoothstep(uBladeS.w - 1., uBladeS.w + 1., a.y));
    float s = smoothstep(uBladeS.x - 0.35, uBladeS.x + 0.35, a.x) * (1. - smoothstep(uBladeS.y - 0.35, uBladeS.y + 0.35, a.x));
    return vec2(s, step(uBladeS.y, a.x) * exp(-max(a.x - uBladeS.y, 0.) * 0.45)) * al;
  }
  vec2 pbBlade(vec2 p){
    if (uBlade.w < 1e-3) return vec2(0.);
    vec2 d = p - uBlade.xy, q = vec2(dot(uBladeM.xy, d), dot(uBladeM.zw, d));
    float cs = cos(uBlade.z), sn = sin(uBlade.z);
    q = vec2(q.x * cs + q.y * sn, q.y * cs - q.x * sn);
    vec2 m = max(max(pbArm(q), pbArm(vec2(q.y, -q.x))), max(pbArm(-q), pbArm(vec2(-q.y, q.x))));
    return m * uBlade.w;
  }
  // pigment taken by the paper. m: the stroke's own uv in metres, fwm: fwidth(m) taken by the caller, cov: the
  // wanted coverage, soft: 1 for a smear. The grain is anchored in the stroke but picks its octave per axis from
  // the pixel footprint, so black speckles through a stroke at every distance and never moires.
  float pbGrain(vec2 uv){ vec2 t = textureLod(uTooth, uv, 0.4).rg; return mix(t.r, t.g, 0.56); }   // more streak than speckle: the paper shows in dry lines along the stroke
  float pbToothG(vec2 m, vec2 fwm){
    vec2 L = log2(max(fwm, vec2(1e-4)) * 200.);          // metres per tooth tile, as a power of two
    vec2 l0 = floor(L), f = L - l0, s0 = exp2(-l0), s1 = s0 * 0.5;
    float g = mix(mix(pbGrain(m * s0), pbGrain(m * vec2(s1.x, s0.y)), f.x),
                  mix(pbGrain(m * vec2(s0.x, s1.y)), pbGrain(m * s1), f.x), f.y);
    float mid = 4. * max(f.x * (1. - f.x), f.y * (1. - f.y));
    return clamp((g - 0.5) * (1.2 + 0.5 * mid) + 0.5, 0., 1.);
  }
  // the slow blotch of the tooth at about a dozen pixels, anchored like the grain: what makes a far band's edge the hand's
  float pbBlot(vec2 uv){ return textureLod(uTooth, uv, 0.).b; }
  float pbBlotG(vec2 m, vec2 fwm){
    vec2 L = log2(max(fwm, vec2(1e-4)) * 110.);
    vec2 l0 = floor(L), f = L - l0, s0 = exp2(-l0), s1 = s0 * 0.5;
    return mix(mix(pbBlot(m * s0), pbBlot(m * vec2(s1.x, s0.y)), f.x), mix(pbBlot(m * vec2(s0.x, s1.y)), pbBlot(m * s1), f.x), f.y);
  }
  // cov: the pressure the tooth is cut against (a full press of the side of the stick still leaves a fifth of the paper);
  // covS: the strength of a smear (soft 1), which is pigment moved by a finger and takes no tooth
  float pbTooth(vec2 m, vec2 fwm, float cov, float covS, float soft){
    float g = pbToothG(m, fwm);
    float hard = smoothstep(-0.07, 0.07, cov * 1.08 - g * 0.88 - 0.02);
    return mix(covS, hard, 1. - soft);
  }
`,Nt=`
  // the far field as the finger leaves it: a few broad parcels, each ONE stick at full colour (looked up unfiltered, so a pixel
  // is one stick or paper), merged in pairs with distance (the rows of the parcel map) so that none is thinner than about six
  // pixels; their edges waver and are cut against the tooth, and a cloud shadow is a bite of bare paper with a toothed edge,
  // inside which a dusting of the stick remains. l: local xz, wp: world xz, x0 / inv: the parcel map. Returns the ink.
  vec3 pbFar(vec2 l, vec2 wp, float x0, float inv, sampler2D parcels){
    vec2 fw = max(fwidth(l), vec2(1e-3));
    float foot = fw.x;
    // (sixth round) the hand-over from one row of the parcel map to the next is no ruled line across the polder: it wanders
    // with the tooth's slow blotch, so a far band ends in a ragged run, never on a square step
    float k = clamp(ceil(log2(foot * 0.15) + (pbBlot(l * vec2(0.011, 0.0043) + 0.31) - 0.5) * 1.5), 0., 7.);   // parcels of 40 m x 2^k: six pixels or more
    float amp = min(foot * 3., 70.) * (1. - smoothstep(40., 120., fw.y));            // no wobble where a pixel spans its whole wave
    float wob = (sin(l.y * 0.011 + 2. * sin(l.x * 0.004)) * 0.6 + sin(l.y * 0.027 + 1.3 + l.x * 0.002) * 0.4) * amp;
    // (third polish) seen along the rows a pixel spans the short waves, and the bands came out ruled: a longer wave of the
    // hand takes over there, so a far band still bows by a few pixels and misses its neighbour
    float amp2 = min(foot * 3.4, 150.) * smoothstep(30., 110., fw.y) * (1. - smoothstep(260., 700., fw.y));
    wob += (sin(l.y * 0.0031 + 1.7 * sin(l.x * 0.0012) + 0.6) * 0.65 + sin(l.y * 0.0058 + 2.1 + l.x * 0.0009) * 0.35) * amp2;
    wob += (pbBlotG(l.yx + 37., fw.yx) - 0.5) * min(foot * 3.8, 170.);                 // and its edge is ragged by a few pixels at every distance
    vec4 c = texture2D(parcels, vec2((l.x + wob - x0) * inv, (k + 0.5) / 8.));
    float g = pbToothG(l.yx, fw.yx);                                                  // dry streaks run along the rows
    float ed = min(c.a, 1. - c.a) * 2.;                                               // 0 at a parcel's edge, 1 down its middle
    // (coverage round) A SOLID BAND: the stick pressed hard, the paper showing as fine grain (about a pixel in fourteen) and
    // as a dry ragged line where one parcel meets the next; a cloud shadow leaves a dusting
    vec2 sf = pbShadow(wp, 0., (g - 0.5) * min(foot * 5., 60.));
    float lo = mix(0.42, 0.07, smoothstep(0., 0.1, ed)), hi = mix(1.01, 0.085, sf.x);
    return c.rgb * step(lo, g) * step(g, hi);                                         // the stick whole, or paper
  }
`,la=`
  attribute vec3 aA, aB, aCol;
  attribute vec4 aMisc;            // width (m), bow (m), seed, lay * 2 + strength (lay 0 faces the eye, 1 flat on the ground)
  attribute vec4 aLife;            // phase, period (0 = permanent), comb offset (lay 1) or tip sway (lay 0), kind (0 stroke 1 smear 2 dab 3 trail)
  #ifdef SPIN
  attribute vec4 aPivot;           // hub (local xyz), phase; aA / aB are (x, y) in the sail plane, z along the axle
  uniform vec3 uAxle; uniform float uSpin;
  #endif
  uniform float uPx;               // world size of a pixel at distance 1
  varying vec2 vUv; varying vec3 vDim; varying vec3 vCol; varying vec4 vW; varying vec4 vLife; varying vec3 vK; varying vec2 vLoc; varying vec3 vBl;
  ${Re}
  void main(){
    float u = position.x, v = position.y, lay = step(1.5, aMisc.w), strength = aMisc.w - 2. * lay;
    vec3 a = aA, b = aB;
    #ifdef SPIN
      float ang = uSpin * aPivot.w + aPivot.w * 37.;
      float cs = cos(ang), sn = sin(ang);
      vec3 ax = normalize(uAxle + vec3(0., 0., 1e-5)), rx = normalize(cross(vec3(0., 1., 0.), ax) + vec3(1e-5, 0., 0.));
      a = aPivot.xyz + rx * (a.x * cs - a.y * sn) + vec3(0., 1., 0.) * (a.x * sn + a.y * cs) + ax * a.z;
      b = aPivot.xyz + rx * (b.x * cs - b.y * sn) + vec3(0., 1., 0.) * (b.x * sn + b.y * cs) + ax * b.z;
    #endif
    #ifdef SKY
      vec3 A = cameraPosition + a, B = cameraPosition + b;
    #else
      vec3 A = (modelMatrix * vec4(a, 1.)).xyz, B = (modelMatrix * vec4(b, 1.)).xyz;
    #endif
    vec3 d = B - A; float len = length(d); vec3 dir = d / max(len, 1e-4);
    vec3 P = A + d * u;
    vec3 eye = cameraPosition - P; float dist = length(eye);
    #ifdef SPIN
      vec3 side = normalize(cross(normalize(mat3(modelMatrix) * ax), dir) + vec3(1e-5, 2e-5, 0.));    // in the sail plane
    #else
      vec3 side = lay > 0.5 ? normalize(cross(vec3(0., 1., 0.), dir) + vec3(1e-5, 0., 2e-5))
                            : normalize(cross(dir, eye) + vec3(1e-5, 2e-5, 0.));
    #endif
    float hw = 0.5 * aMisc.x * (1. - 0.28 * u * u * u), g = 0.;
    P += side * aMisc.y * sin(3.14159 * u);
    #if !defined(SKY) && !defined(SPIN)
      if (lay > 0.5) { g = pbGust(P.xz); P.xz += uWind * 1.5 * g; hw *= 1. + 0.7 * g; }
      else { P.xz += uWind * (0.5 + 0.5 * sin(uTime * 2.3 + aMisc.z * 40.)) * aLife.z * u * u; }   // lay 0: aLife.z = sway (m) at the tip
    #endif
    float hmin = 0.8 * uPx * dist, fade = 1.;
    if (hw < hmin) { fade = hw / max(hmin, 1e-5); hw = hmin; }
    #ifdef SPIN
      if (aLife.z > 0.5) hw *= smoothstep(0.55, 0.75, fade);             // the lattice is drawn only where the stick can draw it
    #endif
    P += side * hw * v;
    // being laid: the tip runs heel to tip, the stroke stands, thins, and is laid again
    float prog = 2., thin = strength, fresh = 0.;
    if (aLife.y > 0.) {
      float c = fract(uTime / aLife.y + aLife.x);
      prog = c * aLife.y / 0.9;                           // about a second to lay
      thin *= 1. - smoothstep(0.72, 1., c);
      fresh = exp(-c * aLife.y * 0.8);
    }
    vUv = vec2(u, v); vDim = vec3(len, 0.5 * aMisc.x, fade); vCol = aCol;
    vW = vec4(P.xz, dist, lay > 0.5 ? aLife.z : 0.); vLife = vec4(prog, thin, fresh, aLife.w); vK = vec3(aMisc.z, g, position.z);
    // the sails' shadow takes an upright mark whole (a petal, a leaf, a whip goes out at once, each a little before or after
    // its neighbour); a mark laid on the ground is cut where the bar lies (z = -1: worked out per pixel)
    vBl = vec3(0., 0., -1.);
    #if !defined(SKY) && !defined(SPIN)
      if (lay < 0.5) vBl = vec3(pbBlade(A.xz + (aMisc.z - 0.5) * vec2(1.3, 0.9)), 1.);
    #endif
    #ifdef SKY
      vW.w = (P.y - cameraPosition.y) / max(length(P - cameraPosition), 1.);      // the sine of its height over the horizon
    #endif
    vec4 p = projectionMatrix * viewMatrix * vec4(P, 1.);
    #ifdef SKY
      if (abs(p.w) < 1e-4) p.w = 1e-4;
      p = p.xyww; p.z *= 0.99995;
    #endif
    gl_Position = p;
    #ifdef FIELD
      vec3 sl = normalize(cross(vec3(0., 1., 0.), b - a) + vec3(1e-5, 0., 0.));
      vLoc = vec2(mix(a.x, b.x, u) + sl.x * (aMisc.y * sin(3.14159 * u) + hw * v), mix(a.z, b.z, u));   // local xz: the stripe texture's axes
    #else
      vLoc = vec2(0.);
    #endif
  }
`,ca=`
  varying vec2 vUv; varying vec3 vDim; varying vec3 vCol; varying vec4 vW; varying vec4 vLife; varying vec3 vK; varying vec2 vLoc; varying vec3 vBl;
  uniform float uShade, uStrength, uNear, uFingerK, uGrainK, uCap, uStreak, uRag;
  #ifdef FIELD
  uniform sampler2D uStripes, uParcels; uniform vec2 uStripeMap;      // local x0, 1 / span
  #endif
  ${Re}
  #ifdef FIELD
  ${Nt}
  #endif
  void main(){
    float u = vUv.x, v = vUv.y, kind = vLife.w;
    vec2 mu = vec2(u * vDim.x, v * vDim.y) + vK.x * vec2(73.1, 31.7);
    vec2 fw = fwidth(mu);
    float wpx = 2. * vDim.y / max(fw.y, 1e-4);                             // the stroke's width in pixels
    float e = texture2D(uTooth, vec2(u * vDim.x / max(vDim.y * 9., 1e-3) + vK.x * 3., vK.x * 5.3 + v * 0.07)).b;
    float fb = smoothstep(uFinger * 0.75, uFinger * 1.5, vW.z);            // the finger: distance
    fb *= uFingerK;
    // smears and bands are pigment moved by a finger (soft); strokes, dabs and trails take the tooth. Distance softens a
    // stroke's edges and thins it, but what is left is still the stick at full colour: a weak stick is paler, never darker
    float isSide = 1. - step(0.5, kind), smear = step(0.5, kind) * step(kind, 1.5);   // (a band, kind 4, takes the tooth too: the ring's rim is a ragged stroke, not a tube)
    float gst = min(1., vK.y * 1.6);                                       // under the thumb a stroke is dragged and widened and goes drier; it keeps its tooth (never a blur)
    float soft = smear;
    float thin = (1. - smoothstep(1.5, 4.5, wpx)) * (1. - smear);         // too narrow for tooth: a firm line of the stick
    float softE = max(soft, max(fb, thin));
    // a side-stroke has a rounded heavy heel and a tail that narrows as the stick lifts
    float hu = u * vDim.x / max(vDim.y, 1e-3);
    float capv = length(vec2(max(0., 1. - hu / max(uCap, 1e-3)) * step(1e-3, uCap), v)) / mix(1., 1. - 0.56 * uCap, smoothstep(0.78, 1., u));   // uCap 0: square
    // (third polish) CHALK AT THE STROKE'S OWN SCALE: the tooth above is picked per pixel (no moire) and so only pinholes a
    // broad stroke. A second look-up in the stroke's own uv gives dry streaks about a sixth of its width running along it
    // (stS) and a coarse grain that frays its rim and breaks its tail (gS); both stay put on the stroke at every distance.
    float isDab = step(1.5, kind) * step(kind, 2.5);
    float sw = uStreak * smoothstep(6., 14., wpx) * (1. - fb);
    float gS = texture2D(uTooth, vec2(hu, v) * 0.1 + vK.x * vec2(5.7, 9.3)).r;
    float stS = texture2D(uTooth, vec2(hu / 18. + vK.x * 9.1, v * 0.03 + vK.x * 3.7)).g;
    float av = mix(abs(v), capv, isSide) + (e - 0.5) * 0.34 * (1. - softE) + (gS - 0.5) * 0.3 * sw * isSide;
    // (fourth polish) uRag: a short broad stroke (grass pulled down a bank) is as ragged as a long one: its sides wander at
    // the stroke's own width, its rim is frayed by the coarse grain and its tail runs dry for the last third
    float e2 = texture2D(uTooth, vec2(hu * 0.13 + vK.x * 7.1, vK.x * 2.9 + v * 0.05)).b;
    av += ((e2 - 0.5) * 0.6 + (gS - 0.5) * 0.35) * uRag * isSide * (1. - thin);
    float edge = 1. - smoothstep(mix(0.6, 0.15, softE), 1., av);
    float press = mix(1.0, 0.55, smoothstep(0.04, 1., u));
    float tail = 1. - smoothstep(0.74 - 0.3 * uRag, 1.02, u + (e - 0.5) * 0.3);
    float heel = smoothstep(0., 0.012, u - (e - 0.3) * 0.02);
    float cov = edge * press * mix(0.18, 1., tail) * heel * (1. - smoothstep(0.985, 1., u));
    if (kind > 3.5) cov = edge;                                                         // a blended band, laid end to end
    else if (kind > 2.5) cov = edge * (1. - u) * sqrt(max(1. - u, 0.)) * 0.8;           // a trail dragged behind a moving thing: dry, all tooth
    else if (kind > 1.5) { vec2 q = vec2((u - 0.5) * 2., v); cov = 1. - smoothstep(0.45, 1., length(q) + (e - 0.5) * 0.5 + (gS - 0.5) * 0.4); }   // a press of the end of the stick: a frayed rim
    else if (kind > 0.5) cov = edge * sin(3.14159 * clamp(u, 0., 1.));
    cov *= uStrength * (1. - 0.3 * gst);
    // laid by the hand
    float tip = 1. - smoothstep(vLife.x - 0.05, vLife.x, u);
    cov *= tip * vLife.y;
    float boost = 0.15 * vLife.z;
    // rubbed out by a cloud shadow, stroked back in behind it: what is left is a dusting of the stick, about a grain in ten
    vec2 sh = vec2(0.), bl = vec2(0.);
    float ghost = 1., ghostS = 1.;
    if (uShade > 0.5) {
      sh = pbShadow(vW.xy, vW.w, (v * v - 0.5) * min(vDim.y, 6.) * 1.6 + (e - 0.5) * 5.);
      bl = vBl.z < 0. ? pbBlade(vW.xy) : vBl.xy;
      sh.y = max(sh.y, bl.y);
      ghost = mix(1., 4. * uGhost, sh.x); ghostS = mix(1., uGhost, sh.x);
      boost += 0.15 * sh.y;
    }
    cov = min(1., cov * (1. + 3. * boost)) * mix(1., 0.667, fb);
    #ifdef FIELD
      cov *= mix(uNear, 1., smoothstep(30., 80., vW.z));                    // the dabs take over near the eye
    #endif
    cov = mix(smoothstep(0.08, 0.34, cov), cov, uGrainK);                  // uGrainK < 1: a heavier hand, less paper showing
    // the side of the stick never fills the tooth: a fifth of the paper shows at mid-stroke, least at the heel, most in the tail
    float dry = mix(1., 0.8, isSide) - 0.14 * isDab;
    float covS = mix(cov * ghostS, smoothstep(0.1, 0.26, cov), thin);
    float a = pbTooth(mu, fw, cov * dry * ghost, covS, max(soft, thin));
    // a line too narrow for tooth is never dimmed: thinner than a pixel, or rubbed out by a shadow, it breaks into dots of the
    // stick like a dry line (the dots are anchored along the stroke)
    float oc = exp2(-floor(log2(max(fw.x, 1e-5) * 24.)));
    float dot1 = texture2D(uTooth, vec2(mu.x * oc * 0.125, vK.x * 7.3)).r;
    a *= step(dot1, min(mix(1.01, 0.22, sh.x * thin), vDim.z < 0.999 ? vDim.z * 1.25 - 0.1 : 1.01));
    // THE LAW AT THE PIXEL: a stroke, dab, trail or band writes its stick whole or leaves the paper; only a finger-smear is soft
    a = mix(step(0.5, a), a, smear);
    // under a blade's bar the mark is gone to bare paper (no dusting is left: the bar must read as paper at a glance); an
    // upright mark goes whole, a mark on the ground is cut along the bar with a grainy edge
    a *= step(bl.x, 0.35 + 0.3 * gS);
    // dry streaks of paper over about a fifth of the body (least at the heel, most toward the tail) and a tail broken into grain
    float dryK = mix(0.05, 0.2, smoothstep(0.03, 0.3, u)) + 0.3 * smoothstep(0.55, 1., u);
    float cut = max(step(stS, dryK * sw), step(gS, 0.75 * smoothstep(0.7, 1., u) * sw)) * isSide;
    cut = max(cut, step(gS, 0.17) * isDab * smoothstep(4., 9., wpx));           // a dab takes the tooth too: flecks of paper in it
    cut = max(cut, step(gS, 0.6 * smoothstep(0.5, 1., u) * uRag) * isSide * (1. - thin));
    #ifdef SKY
      // (fourth polish) THE SKY SITS BACK: scumble is thin pigment. Above the low sky each stroke lets about half the paper
      // through, as dry streaks a sixth of its width and a coarse grain that eats its rim away (so a stroke ends in grain, not
      // on an edge); the lowest band over the horizon is fuller, so the mills and the bridge keep blue behind them
      float open = smoothstep(0.1, 0.27, vW.w);
      float gC = texture2D(uTooth, vec2(hu, v) * 0.045 + vK.x * vec2(3.1, 7.7)).r;
      float skyCut = max(step(stS, mix(0.18, 0.36, open)), step(gC, mix(0.08, 0.18, open) + mix(0.45, 0.72, open) * smoothstep(0.32, 0.95, av)));
      cut = max(cut, skyCut * isSide * smoothstep(5., 10., wpx));
    #endif
    a *= 1. - cut;
    vec3 col = vCol * 0.87 * a;
    #ifdef FIELD
      vec2 suv = vec2((vLoc.x - uStripeMap.x) * uStripeMap.y, 0.5);
      float rel = fwidth(vLoc.x) / max(texture2D(uStripes, suv).a * 16., 0.5);          // pixels a stripe is wide, inverted
      vec3 far = pbFar(vLoc, vW.xy, uStripeMap.x, uStripeMap.y, uParcels);
      float kf = max(smoothstep(0.3, 0.42, rel), smoothstep(uFinger * 0.75, uFinger * 0.9, vW.z));   // past here the hand stops ruling stripes
      // the hand-over to the far parcels is speckled grain by grain, never a blend; where the far field has no ink the paper
      // floor shows (no second black on a tinted paper)
      if (kf > dot1 * 0.98 + 0.01) { col = far; a = step(1e-3, far.r + far.g + far.b); }
    #endif
    if (a < 0.035) discard;
    gl_FragColor = vec4(col, 1.);
  }
`,ha=`
  varying vec3 vL; varying vec3 vWp; varying vec2 vAx;
  void main(){ vL = position; vec4 w = modelMatrix * vec4(position, 1.); vWp = w.xyz; vAx = (modelMatrix * vec4(1., 0., 0., 0.)).xz; gl_Position = projectionMatrix * viewMatrix * w; }
`,da=`
  varying vec3 vL; varying vec3 vWp; varying vec2 vAx;
  uniform vec3 uPaper, uBack, uBandCol; uniform float uBodyGrain; uniform vec4 uBodyDir; uniform vec2 uBodyBand; uniform vec2 uBodyOpen; uniform float uPx;      // a body in a stick (a grassed dyke, water, a cloud): uBack shows through as grain
  #ifdef FLOOR
  uniform sampler2D uStripes, uParcels, uNearTex; uniform vec2 uStripeMap; uniform vec2 uStripeZ;
  uniform vec4 uNearMap;           // x0, 1 / span of the band map, warp (0: linear), waver (1: the upland's slow wave of the arm)
  uniform vec4 uRowBox;            // local x0, x1, z0, z1: where a band resolves into rows of plants (leaf green, the stick in flecks)
  uniform vec4 uRow;               // centre x, row period (0: none), the first row's distance from the centre, pressure of the row lines
  uniform vec3 uLeaf; uniform float uFarOn; uniform vec3 uRowCut;   // uRowCut (a, b, c): the rows stand only where a * x + b * z + c < 0 (this side of the mill dyke)
  #endif
  ${Re}
  #ifdef FLOOR
  ${Nt}
  // (sixth round) THE BAND OF BARE PAPER ON SOLID BANDS. Looked up on a band's own centre line, so the shadow's edge crosses
  // every band square and each band has its own comb offset. x: rubbed out; y: just stroked back behind the trailing edge
  // (the running tip); z: the stick running dry just ahead of the leading edge (the band goes out in a dry tail)
  vec3 pbBand(vec2 p, float off, float rag){
    float s = 0., f = 0., dr = 0.; vec2 w = uWind, c = vec2(-uWind.y, uWind.x);
    for (int i = 0; i < 5; i++) {
      vec4 C = uCloud[i]; vec2 d = p - C.xy;
      float al = dot(d, w) + off, qa = al / max(C.z, 1.), qb = dot(d, c) / max(C.w, 1.);
      float m = (1. - sqrt(qa * qa + qb * qb)) * min(C.z, C.w) + rag, tr = 1. - smoothstep(-0.2, 0.1, qa);
      s = max(s, step(0., m));
      f = max(f, step(m, 0.) * exp(min(m, 0.) * 0.05) * tr);
      dr = max(dr, step(m, 0.) * (1. - smoothstep(0., min(26., min(C.z, C.w)), -m)) * (1. - tr));
    }
    return vec3(s, f, dr);
  }
  #endif
  void main(){
    vec3 col = uPaper;
    #ifdef FLOOR
      // (coverage round) THE FIELDS ARE SOLID BANDS OF FLOWER COLOUR. Every stripe is one unbroken band of its stick pressed
      // hard: the paper shows through it only as fine grain, as the thin ditch line between two bands, and under a shadow.
      // Where the plants stand as single big tulips (uRowBox) the band is their leaves: rows of leaf green flecked with the
      // stick, a line of paper between rows. Far off the bands merge into parcels (pbFar), as before.
      vec2 l = vL.xz, fw = max(fwidth(l), vec2(1e-4));
      float dist = length(cameraPosition - vWp);
      float bl = pbBlotG(l.yx * 0.5 + 11., fw.yx * 0.5), g = pbToothG(l.yx, fw.yx);
      float x = l.x + (bl - 0.5) * min(0.5 + fw.x * 3., 5.);                 // the band's edge is the hand's: it wanders by a few pixels
      float ax = abs(x), wA = max(0., ax - 45.); wA = min(wA * wA / 1300., 120.) * uNearMap.w;
      x -= wA * (0.62 * sin(l.y * 0.021 + x * 0.004 + 0.8) + 0.38 * sin(l.y * 0.033 + 1.3 - x * 0.003));
      float t = uNearMap.z > 0. ? x / (1. + abs(x) / max(uNearMap.z, 1e-3)) : x;
      vec4 st = texture2D(uNearTex, vec2((t - uNearMap.x) * uNearMap.y, 0.25));
      vec4 st2 = texture2D(uNearTex, vec2((t - uNearMap.x) * uNearMap.y, 0.75));   // across the band 0..1, its width / 64 m, its comb offset
      float inZ = step(uStripeZ.x, l.y) * step(l.y, uStripeZ.y);
      float ink = step(0.1, st.a) * inZ;
      vec3 band = st.rgb;
      vec2 rb = l + (bl - 0.5) * 2.4;
      float inBox = step(uRowBox.x, rb.x) * step(rb.x, uRowBox.y) * step(uRowBox.z, rb.y) * step(rb.y, uRowBox.w) * step(0.75, st.a) * step(dot(uRowCut.xy, rb) + uRowCut.z, 0.);
      float fl = texture2D(uTooth, l * vec2(0.047, 0.026) + 0.21).r, fl2 = texture2D(uTooth, l * vec2(0.061, 0.033) + 0.63).r;
      if (inBox > 0.5) {
        // (sixth round) under the big single tulips the bed is PAPER: only flecks the size of a leaf, of leaf green and of the row's
        // own stick, lie on it, so every cup and leaf standing there is seen whole against the black
        band = fl < 0.3 ? uLeaf : st.rgb;
        if (fl >= 0.3 && fl2 > 0.2) ink = 0.;
        if (uRow.y > 0.) {
          float dc = abs(l.x - uRow.x + (pbBlot(l.yx * vec2(0.021, 0.09) + 0.4) - 0.5) * 0.5), rc = (dc - uRow.z) / max(uRow.y, 1e-3), dr = abs(fract(rc + 0.5) - 0.5) * uRow.y;
          float thin = 1. - smoothstep(0.12, 0.3, fw.x);                      // the line is dropped once thinner than a pixel
          if (dr > uRow.y * 0.5 - (0.1 + 0.1 * bl) * thin * uRow.w - 1e-4 && thin > 0.01) ink = 0.;
          if (dc < uRow.z - 0.62) ink = 0.;                                    // the ditch down the middle of the lane
        }
      }
      float acr = st2.r, bwid = st2.g * 64., ac2 = 2. * acr - 1.;
      vec2 pc = vWp.xz + vAx * ((0.5 - acr) * bwid);                          // this band's centre line
      vec3 sf = pbBand(pc, (st2.b - 0.5) * 60., (g - 0.5) * 2.5 + ac2 * ac2 * min(bwid, 14.) * 0.55);   // a tip is round: the stick's end
      vec2 bd = pbBlade(vWp.xz);
      // THE MEDIUM MOVES: every band is laid again as we watch. A tip runs along it (downwind, 26 m a second, each band in its own
      // time): for nine metres the stick drags dry and the paper shows in streaks, behind it the band stands a little heavier
      // for a while with no grain at all. Under the thumb of a gust the band goes dry too.
      float tp = mod(l.y + uTime * 26. + fract(st.a * 4.5536) * 1100., 1100.);
      float dryT = (1. - smoothstep(0., 9., tp)) * 0.62, fresh = smoothstep(9., 12., tp) * (1. - smoothstep(60., 110., tp));
      float tipF = step(0.45, sf.y);                                           // the running tip: a shade heavier, no grain at all
      float lo = max(0.07 * (1. - fresh) * (1. - tipF), max(max(dryT, 0.86 * sf.z * sf.z), 0.45 * pbGust(vWp.xz)));
      ink *= step(lo, g) * step(g, mix(1.01, 0.085, sf.x)) * step(bd.x, 0.35 + 0.3 * g);
      col = mix(uPaper, band, ink);
      vec2 suv = vec2((vL.x - uStripeMap.x) * uStripeMap.y, 0.5);
      float rel = fw.x / max(texture2D(uStripes, suv).a * 16., 0.5);
      float kf = max(smoothstep(0.3, 0.42, rel), smoothstep(uFinger * 0.75, uFinger * 0.9, dist));
      vec3 far = pbFar(vL.xz, vWp.xz, uStripeMap.x, uStripeMap.y, uParcels);
      if (uFarOn > 0.5 && kf > 0.3 + 0.4 * bl) col = uPaper + far * inZ;
    #else
      // a body in a stick. uBodyDir (a, b, k, on): the stick was pulled DOWN the slope, so its dry streaks run along the height
      // (a grassed flank); uBodyBand (y0, y1): a band of another stick along the foot, its edge the hand's (a flowering verge)
      vec2 bm = mix(vec2(vWp.x * 0.8 + vWp.y * 1.1 - vWp.z * 0.33, vWp.z * 0.8 + vWp.x * 0.45 + vWp.y * 0.5), vec2(vWp.y * uBodyDir.z, vWp.x * uBodyDir.x + vWp.z * uBodyDir.y), uBodyDir.w);
      vec2 bfw = max(fwidth(bm), vec2(1e-4));
      float bg = pbToothG(bm, bfw), bb = pbBlotG(bm.yx * 0.4 + 3., bfw.yx * 0.4), yb = vWp.y + (bb - 0.5) * 2.4;
      col = mix(uPaper, uBack, step(bg + 1e-3, uBodyGrain));
      // (sixth round) A GRASSED BODY IS DRAWN, not filled: the stick pulled DOWN the slope in separate strokes about a metre wide,
      // each with its own width, a heel at the top and a tail that runs dry, paper between them; far off they close into the
      // stick with its grain. THE VERGE is a line of single presses of another stick along the foot (far off, one dry line).
      float ac = vWp.x * uBodyDir.x + vWp.z * uBodyDir.y, fwa = max(fwidth(ac), 1e-4);
      if (uBodyDir.w > 0.5) {
        // no two strokes alike and none ruled: the cells bow and miss each other with a slow wave of the hand (anchored to the
        // ground), every stroke has its own width and length, one in seven is left out, and on a level top they break as well
        // (down a slope a stroke is measured by the height it falls; on a level top the strokes are a hatch of short pulls)
        vec3 fn = normalize(cross(dFdx(vWp), dFdy(vWp)) + vec3(0., 1e-6, 0.));
        float flatK = smoothstep(0.85, 0.97, abs(fn.y)), pc = vWp.z * uBodyDir.x - vWp.x * uBodyDir.y, ln = -vWp.y + pc * 2.2 * flatK;
        float nb = texture2D(uTooth, vec2(ac, ln) * 0.019 + 0.37).b, nb2 = texture2D(uTooth, vec2(ac * 0.043, ln * 0.031) + 0.11).b;
        float cx = ac / 1.15 + (nb - 0.5) * 1.1 + (nb2 - 0.5) * 0.5 + (bb - 0.5) * 0.4, ci = floor(cx), cf = fract(cx), h1 = pbHash(ci * 1.37 + 3.1), h2 = pbHash(ci * 2.91 + 7.7);
        float v = fract(ln / mix(3.5, 8., h2) + h1 * 3.7);                     // 0 at the heel (the top), 1 at the dry tail
        float sS = texture2D(uTooth, vec2(ln * 0.06 + h1 * 5., cx * 0.13)).g;
        float on = step(abs(cf - 0.5 - (h2 - 0.5) * 0.12) * 2. / mix(0.74, 1.0, h1) + (bg - 0.5) * 0.3 + 0.16 * v * v, 1.) * step(0.04 + 0.12 * v + 0.42 * smoothstep(0.78, 1., v), sS) * step(0.03, v) * step(0.07, fract(h1 * 7.3 + h2));
        float nearK = 1. - smoothstep(0.3, 0.6, fwa / 1.15);
        // (ninth round) THE BOARDS OF A BUILT THING (uBodyOpen (a, b) with b above 0; every other body has (0, 0) and keeps the
        // line above): the paper between boards shows only where a gap is wide enough to show. The mean gap is 0.13 of a cell
        // (a board fills 0.74 to all of it); it is measured in pixels of a 1080-line frame at the world's lens (62 degrees: a pixel
        // is 2 tan 31 / 1080 at distance 1), by uPx whatever the frame's own size, so a small still and a large screen open the
        // boards at the same place: from a pixels (shut) to b pixels (open).
        // Where its boards are shut such a body is the filled stick EXACTLY as a body that is not drawn has it (the grain on
        // the first line's own measure, the one a body with on = 0 reads), so far off a tower is live's picture to the pixel.
        if (uBodyOpen.y > 0.) {
          nearK = smoothstep(uBodyOpen.x, uBodyOpen.y, 0.13 * 1.15 * uPx / (fwa * (2. * 0.60086 / 1080.)));
          vec2 bm0 = vec2(vWp.x * 0.8 + vWp.y * 1.1 - vWp.z * 0.33, vWp.z * 0.8 + vWp.x * 0.45 + vWp.y * 0.5);
          col = mix(uPaper, uBack, step(pbToothG(bm0, max(fwidth(bm0), vec2(1e-4))) + 1e-3, uBodyGrain));
        }
        col = mix(col, mix(uBack, uPaper, on), nearK);
        if (uBodyBand.y > uBodyBand.x) {
          float px = ac / 1.5, pi = floor(px), p1 = pbHash(pi * 1.91 + 0.7), p2 = pbHash(pi * 3.3 + 5.1), y0 = uBodyBand.x + 0.9;
          vec2 pq = vec2((fract(px) - 0.5) / (0.3 + 0.12 * p2), (vWp.y - y0 - 0.5 - 1.1 * p1) / (0.55 + 0.35 * p2));
          float press = step(length(pq) + (bg - 0.5) * 0.5, 1.) * step(p2, 0.86);
          press = mix(press, step(abs(vWp.y - y0 - 0.9), 0.7) * step(0.35, bg), smoothstep(0.3, 0.6, fwa / 1.5));
          if (press > 0.5) col = uBandCol;
        }
      }
    #endif
    gl_FragColor = vec4(col, 1.);
  }
`,fa=`
  attribute vec2 aCorner; attribute vec3 aCol; attribute vec4 aDab;   // height, width, seed, comb offset
  uniform float uDabFar, uLean, uPx, uLocal;     // uLocal 1: tooth anchored to the mesh (things that travel), not the world
  varying vec2 vC; varying vec3 vCol; varying vec4 vD; varying vec2 vT;
  ${Re}
  void main(){
    vec3 base = (modelMatrix * vec4(position, 1.)).xyz;
    vec3 eye = cameraPosition - base; float dist = length(eye);
    vec3 right = normalize(cross(vec3(0., 1., 0.), eye) + vec3(1e-5, 0., 2e-5));
    float g = pbGust(base.xz);
    float nod = sin(uTime * (2.2 + aDab.z) + aDab.z * 40. + dot(base.xz, uWind) * 0.35);
    float dw = max(aDab.y, 0.55 * uPx * dist);
    vec3 P = base + right * aCorner.x * dw * (1. + g) + vec3(0., aCorner.y * aDab.x, 0.)
           + vec3(uWind.x, 0., uWind.y) * (0.07 * nod + 0.9 * g + uLean * aDab.x * (1. + 0.25 * nod)) * aCorner.y;
    vC = aCorner; vCol = aCol; vT = mix(base.xz, position.xz, uLocal);
    vD = vec4(base.xz, 1. - smoothstep(uDabFar * 0.6, uDabFar, dist), aDab.w);
    gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
    if (vD.z < 0.01) gl_Position = vec4(2., 2., 2., 1.);
  }
`,ua=`
  varying vec2 vC; varying vec3 vCol; varying vec4 vD; varying vec2 vT;
  ${Re}
  void main(){
    vec2 q = vec2(vC.x / 0.5, (vC.y - 0.42) / 0.42);
    vec2 tuv = vC * 0.22 + vCol.rg * 3.7 + vT * 0.013;
    float t = texture2D(uTooth, tuv).r;
    float cov = 1. - smoothstep(0.55, 1., length(q) + (t - 0.5) * 0.5);
    vec2 sh = pbShadow(vD.xy, vD.w, 0.), bl = pbBlade(vD.xy + (vCol.rg - 0.5) * 0.8);
    sh.y = max(sh.y, bl.y);
    cov *= vD.z;
    float a = smoothstep(-0.05, 0.05, cov - 0.25 - 0.5 * t * (1. - sh.y));
    // rubbed out: the dab goes grain by grain, and a dusting of its stick is left on the paper (never a darker dab)
    float t2 = texture2D(uTooth, tuv * 2.7 + 0.37).r;
    if (a < 0.5 || t2 > mix(1.01, 1.5 * uGhost, sh.x) || bl.x > 0.35 + 0.3 * t2) discard;
    gl_FragColor = vec4(vCol * 0.87, 1.);
  }
`;function pa(){const p=[],g=[];for(let u=0;u<=$e;u++)p.push(u/$e,-1,0,u/$e,1,0);for(let u=0;u<$e;u++){const i=u*2;g.push(i,i+1,i+2,i+1,i+3,i+2)}const z=new n.BufferGeometry;return z.setAttribute("position",new n.Float32BufferAttribute(p,3)),z.setIndex(g),z}async function va(p,g={}){const z=g.palette||Et,u=g.exposure||2,i={paper:ve(g.paper||z[0],u),scarlet:ve(z[1],u),rose:ve(z[2],u),cream:ve(z[3],u),green:ve(z[4],u),cerulean:ve(z[5],u),white:ve(z[6],u),orange:ve(g.extra?.orange||lt.orange,u),lilac:ve(g.extra?.lilac||lt.lilac,u),lavender:ve(g.extra?.lavender||lt.lavender,u)};for(const o in i)o!=="paper"&&i[o].multiplyScalar(1/.87);await p.yield();const w=await ia(p,p.rng.fork("tooth")),h=new n.Vector2(0,-1);g.wind&&h.set(g.wind[0],g.wind[1]).normalize();const c={uTime:{value:0},uFinger:{value:g.finger||900},uGhost:{value:1/12},uTooth:{value:w},uCloud:{value:[0,1,2,3,4].map(()=>new n.Vector4(0,1e6,130,210))},uWind:{value:h},uGust:{value:new n.Vector4(0,1e6,40,0)},uPx:{value:.0012},uBlade:{value:new n.Vector4(0,0,0,0)},uBladeM:{value:new n.Vector4(1,0,0,1)},uBladeS:{value:new n.Vector4(-.7,2.9,1.5,23.5)}},m=pa(),y=new Map,D=new n.Vector2;function R(o={}){const f=["sky","field","spin","add"].map(k=>o[k]?1:0).join("")+(o.shade===!1?0:1)+(o.finger===!1?0:1)+(o.strength??1)+"/"+(o.grain??1)+"/"+(o.cap??0)+"/"+(o.streak??.7)+"/"+(o.rag??0)+(o.stripes?o.stripes.uuid:"");if(y.has(f))return y.get(f);const b={};o.sky&&(b.SKY=1),o.field&&(b.FIELD=1),o.spin&&(b.SPIN=1);const x=new n.ShaderMaterial({defines:b,vertexShader:la,fragmentShader:ca,side:n.DoubleSide,uniforms:{...c,uShade:{value:o.shade===!1||o.sky?0:1},uStrength:{value:o.strength??1},uNear:{value:o.near??.4},uFingerK:{value:o.sky||o.finger===!1?0:1},uGrainK:{value:o.grain??1},uCap:{value:o.cap??0},uStreak:{value:o.streak??.7},uRag:{value:o.rag??0},uStripes:{value:o.stripes||null},uParcels:{value:o.parcels||o.stripes||null},uStripeMap:{value:o.stripeMap||new n.Vector2(0,1)},uAxle:{value:o.axle||new n.Vector3(0,0,1)},uSpin:o.spinUniform||{value:0}}});return o.sky&&(x.depthWrite=!1,x.depthTest=!1),o.add&&(x.blending=n.CustomBlending,x.blendEquation=n.MaxEquation,x.blendSrc=n.OneFactor,x.blendDst=n.OneFactor,x.depthWrite=!1,x.transparent=!0),y.set(f,x),x}function Y(o={}){return new n.ShaderMaterial({defines:o.stripes?{FLOOR:1}:{},vertexShader:ha,fragmentShader:da,side:o.side??n.FrontSide,uniforms:{...c,uPaper:{value:o.color||i.paper},uBack:{value:i.paper},uBodyGrain:{value:o.grain??0},uBodyDir:{value:o.dir||new n.Vector4(1,0,1,0)},uBodyBand:{value:o.band||new n.Vector2(1,0)},uBodyOpen:{value:o.open||new n.Vector2(0,0)},uBandCol:{value:o.bandColor||i.paper},uStripes:{value:o.stripes||null},uParcels:{value:o.parcels||o.stripes||null},uStripeMap:{value:o.stripeMap||new n.Vector2(0,1)},uStripeZ:{value:o.stripeZ||new n.Vector2(-1e5,1e5)},uNearTex:{value:o.near||o.stripes||null},uNearMap:{value:o.nearMap||new n.Vector4(0,1,0,0)},uRowBox:{value:o.rowBox||new n.Vector4(1,0,1,0)},uRow:{value:o.row||new n.Vector4(0,0,0,1)},uLeaf:{value:o.leaf||i.green.clone().multiplyScalar(.87)},uFarOn:{value:o.far===!1?0:1},uRowCut:{value:o.rowCut||new n.Vector3(0,0,-1)}}})}function X(o,f,b,x=0,k=0){const T=new Uint8Array(32768),q=new n.Color,F=new n.Color,E=d=>x>0?d/(1+Math.abs(d)/x):d,L=E(f),S=E(b)-L;let ae=11;for(const d of o){q.copy(d.c).multiplyScalar(.87).convertLinearToSRGB();const W=Math.ceil((E(d.x-d.w/2)-L)/S*4096-.5),O=Math.floor((E(d.x+d.w/2)-L)/S*4096-.5);for(let K=Math.max(1,W);K<=Math.min(4094,O);K++){T[K*4]=Math.min(255,q.r*255),T[K*4+1]=Math.min(255,q.g*255),T[K*4+2]=Math.min(255,q.b*255),T[K*4+3]=(d.kind==="bloom"?200:100)+ae,F.setRGB((K-W+.5)/Math.max(1,O-W+1),Math.min(1,d.w/64),Math.min(1,Math.max(0,(d.off||0)/60+.5)),n.LinearSRGBColorSpace).convertLinearToSRGB();const j=(4096+K)*4;T[j]=Math.round(F.r*255),T[j+1]=Math.round(F.g*255),T[j+2]=Math.round(F.b*255),T[j+3]=255}ae=(ae+37)%56}for(let d=0;d<4096;d++){const W=(4096+d)*4;T[W+3]===0&&(T[W]=188,T[W+1]=0,T[W+2]=188,T[W+3]=255)}const U=new n.DataTexture(T,4096,2,n.RGBAFormat,n.UnsignedByteType);return U.colorSpace=n.SRGBColorSpace,U.magFilter=U.minFilter=n.NearestFilter,U.generateMipmaps=!1,U.wrapS=U.wrapT=n.ClampToEdgeWrapping,U.needsUpdate=!0,{tex:U,map:new n.Vector4(L,1/S,x,k)}}function G(){const o=[],f=[],b=[],x=[],k=[],V=[];let T=0;return{get count(){return T},add(q,F,E,L,S){S=S||{},o.push(q[0],q[1],q[2]),f.push(F[0],F[1],F[2]),b.push(L.r,L.g,L.b),x.push(E,S.bow||0,S.seed??(T*.618034+.137)%1,(S.lay?2:0)+Math.min(1,S.strength??1)),k.push(S.phase||0,S.period||0,S.off||0,S.kind||0),S.pivot&&V.push(S.pivot[0],S.pivot[1],S.pivot[2],S.pivot[3]),T++},mesh(q={}){const F=new n.InstancedBufferGeometry;F.index=m.index,F.setAttribute("position",m.getAttribute("position"));const E=(S,ae,U)=>F.setAttribute(S,new n.InstancedBufferAttribute(new Float32Array(ae),U));E("aA",o,3),E("aB",f,3),E("aCol",b,3),E("aMisc",x,4),E("aLife",k,4),q.spin&&E("aPivot",V,4),F.instanceCount=T;const L=new n.Mesh(F,R(q));return L.frustumCulled=!1,q.sky&&(L.renderOrder=-.5),L}}}async function $(o,f={}){const b=Math.floor(o.length/9),x=new Float32Array(b*9),k=new Float32Array(b*6),V=new Float32Array(b*9),T=new Float32Array(b*12);await p.yield();for(let L=0;L<b;L++){const S=L*9,ae=L*.754877%1;for(let U=0;U<3;U++){const d=L*3+U;x[d*3]=o[S],x[d*3+1]=o[S+1],x[d*3+2]=o[S+2],k[d*2]=U===0?-1.5:U===1?1.5:0,k[d*2+1]=U===2?1.3:0,V[d*3]=o[S+5],V[d*3+1]=o[S+6],V[d*3+2]=o[S+7],T[d*4]=o[S+3],T[d*4+1]=o[S+4],T[d*4+2]=ae,T[d*4+3]=o[S+8]}L%3e3===2999&&await p.yield()}const q=new n.BufferGeometry;q.setAttribute("position",new n.BufferAttribute(x,3)),q.setAttribute("aCorner",new n.BufferAttribute(k,2)),q.setAttribute("aCol",new n.BufferAttribute(V,3)),q.setAttribute("aDab",new n.BufferAttribute(T,4));const F=new n.ShaderMaterial({vertexShader:fa,fragmentShader:ua,side:n.DoubleSide,uniforms:{...c,uDabFar:{value:f.far||70},uLean:{value:f.lean||0},uLocal:{value:f.local?1:0}}}),E=new n.Mesh(q,F);return E.frustumCulled=!1,E}const _=[0,1,2,3,4].map(()=>({x:0,z:1e6,a:130,b:210,auto:!1})),C={pal:i,U:c,wind:h,tooth:w,clouds:_,sticks:[i.scarlet,i.rose,i.orange,i.cream,i.lilac,i.green,i.cerulean,i.white,i.lavender],strokeMaterial:R,paper:Y,bandMap:X,batch:G,dabs:$,dab:(o,f,b,x,k,V,T,q=0)=>{o.push(f,b,x,k,V,T.r,T.g,T.b,q)},windSpeed:7,home:new n.Vector2(0,0),range:1400,setCloud(o,f,b,x=130,k=210,V=!1){Object.assign(_[o],{x:f,z:b,a:x,b:k,auto:V})},setGust(o,f,b=40,x=1){c.uGust.value.set(o,f,b,x)},update(o,f,b){if(c.uTime.value=f,b&&b.projectionMatrix){let x=1080;p.renderer&&p.renderer.getDrawingBufferSize&&(x=p.renderer.getDrawingBufferSize(D).y||1080),c.uPx.value=2/(Math.max(.1,b.projectionMatrix.elements[5])*x)}for(let x=0;x<5;x++){const k=_[x];k.auto&&(k.x+=h.x*C.windSpeed*o,k.z+=h.y*C.windSpeed*o,(k.x-C.home.x)*h.x+(k.z-C.home.y)*h.y>C.range&&(k.x-=h.x*2*C.range,k.z-=h.y*2*C.range)),c.uCloud.value[x].set(k.x,k.z,k.a,k.b)}}};return C.sky=o=>ga(p,C,o),C.heap=(o,f)=>wa(p,C,o,f),C.dust=(o,f)=>Ma(C,o,f),C.paperDiscs=Ot,C}function ga(p,g,z={}){const u=p.rng.fork("pb-sky"),i=g.pal,w=g.batch(),h=1e3,c=Math.PI/180,m=z.blue||i.cerulean,y=z.drag||i.white,D=z.band||[i.lavender,i.green],R=(z.lean??20)*c,Y=(z.density??1)>=1?1.5:z.density,X=(o,f,b,x,k,V,T)=>{const q=Math.cos(f),F=Math.sin(f),E=Math.sin(o),L=Math.cos(o),S=[E*q,F,-L*q],ae=[L,0,E],U=[-E*F,q,L*F],d=Math.cos(x),W=Math.sin(x),O=Math.tan(b/2),K=[ae[0]*d+U[0]*W,ae[1]*d+U[1]*W,ae[2]*d+U[2]*W],j=ee=>{const Z=[S[0]+K[0]*O*ee,S[1]+K[1]*O*ee,S[2]+K[2]*O*ee],me=h/Math.hypot(Z[0],Z[1],Z[2]);return[Z[0]*me,Z[1]*me,Z[2]*me]};w.add(j(-1),j(1),k*c*h,V,T)};if(z.low)for(let o=0;o<120;o++){const f=u()*6.283,b=1.2+(u.range(1.5,17)-1.5)*.3,x=u.range(9,16),k=R*.3+u.range(-5,5)*c*.5,V=u.range(2.4,3.8)*.62,T={bow:u.range(-5,5)*.5,strength:u.range(.6,.95)};o%3!==2&&X(f,b*c,x*c,k,V,z.low[o%z.low.length],T)}for(let o=0;o<84;o++){const f=D[u.chance(.55)?0:1];X(o/84*6.283+u.range(-.03,.03),u.range(-.05,.5)*c,u.range(7,17)*c,u.range(-1.2,1.2)*c,u.range(.5,1),f,{strength:u.range(.62,.8),bow:u.range(-.6,.6)})}const G=new n.Group,$=w.mesh({sky:!0,cap:.5,streak:1}),_=o=>o.clone().multiplyScalar(.87),C=new n.Mesh(new n.SphereGeometry(1,24,12),new n.ShaderMaterial({side:n.BackSide,depthTest:!1,depthWrite:!1,uniforms:{uPaper:{value:i.paper},uBlue:{value:_(m)},uDrag:{value:_(y)},uTooth:g.U.uTooth,uDens:{value:Y},uTime:g.U.uTime},vertexShader:"varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(cameraPosition + position * 1000., 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",fragmentShader:ma}));return C.frustumCulled=!1,C.renderOrder=-.6,G.add(C,$),G}const ma=`
  varying vec3 vDir;
  uniform vec3 uPaper, uBlue, uDrag; uniform sampler2D uTooth; uniform float uDens, uTime;
  // (sixth round) THE SKY IS DRAWN AND HAS A TOP. The dome is ruled into rows that lean twenty degrees up to the right; every
  // cell of a row holds ONE side-stroke of the stick (a round heavy heel at the lower left, a body crossed by dry streaks, a
  // tail that narrows and breaks into grain). Low down the strokes are broad, long and pressed hard, so they close into one
  // lay; from about ten degrees up they narrow, shorten and miss each other, and some are left out, so the paper stands
  // between them in gaps that widen to the zenith. Each stroke of the open sky is laid again in its own time.
  const float SKL = 13., SKH = 3.3;                             // a cell: degrees along the stroke, degrees across it
  float skH(vec2 c, float k){ return fract(sin(dot(c, vec2(12.9898, 78.233)) + k * 37.719) * 43758.5453); }
  float skStroke(vec2 ab, vec2 cell, float rowOff, float st, float bl, float thin){
    float h1 = skH(cell, 1.), h2 = skH(cell, 2.), h3 = skH(cell, 3.), h4 = skH(cell, 4.), h5 = skH(cell, 5.);
    float ac = (cell.x + 0.5 + (h1 - 0.5) * 0.36) * SKL - rowOff, bc = (cell.y + 0.5) * SKH;
    float Ec = ac * 0.342 + bc * 0.9397;                         // the stroke's own height over the horizon, degrees
    float t = smoothstep(8., 19., Ec), tl = smoothstep(13., 31., Ec), t2 = smoothstep(22., 60., Ec);
    if (h5 > mix(1.1, 0.9, tl) - 0.36 * t2 - thin) return 0.;
    bc += (h3 - 0.5) * SKH * 0.3 * t;
    float hl = 0.5 * SKL * mix(1.25, 0.66, tl) * (0.8 + 0.4 * h2), hw = SKH * mix(0.85, 0.34, t) * (0.84 + 0.32 * h4);
    float x = ab.x - (ac - hl), u = x / (2. * hl);
    if (u < -0.02 || u > 1.02) return 0.;
    float v = (ab.y - bc - (h4 - 0.5) * 1.3 * sin(3.14159 * clamp(u, 0., 1.))) / (hw * (1. - 0.4 * u * u));
    float av = length(vec2(max(0., 1. - x / hw), v)) + (bl - 0.5) * 0.55;          // a round heel, ragged sides
    float dry = mix(0.04, 0.2, smoothstep(0.05, 0.5, u)) + 0.6 * smoothstep(0.6, 1., u);
    dry *= mix(0.3, 1., t);                                      // low strokes are pressed hard
    float per = mix(15., 36., h3), c = fract(uTime / per + h1 * 7.);
    float open = step(0.3, tl);                                  // only the open sky is restruck: the low lay stands
    float laid = max(1. - open, step(u, c * per / 1.3));
    dry += 0.9 * smoothstep(0.86, 1., c) * open;
    return step(av, 1.) * step(u, 1. - 0.12 * bl) * step(dry, st) * laid;
  }
  float skRow(vec2 ab, float row, float st, float bl, float thin){
    float rowOff = skH(vec2(row, 7.), 9.) * SKL, xi = (ab.x + rowOff) / SKL, i = floor(xi), i2 = i + (fract(xi) > 0.5 ? 1. : -1.);
    return max(skStroke(ab, vec2(i, row), rowOff, st, bl, thin), skStroke(ab, vec2(i2, row), rowOff, st, bl, thin));
  }
  void main(){
    vec3 d = normalize(vDir + vec3(0., 1e-5, 0.));
    float el = asin(clamp(d.y, -1., 1.)), az = atan(d.x, abs(d.z) + abs(d.x) < 1e-5 ? 1e-5 : d.z);
    vec2 q = vec2(az, el) * 0.7957747;                           // five tiles round the sky
    vec2 r = vec2(q.x, (q.y - 0.5 * q.x) * 0.4);
    float s1 = texture2D(uTooth, r).g, s2 = texture2D(uTooth, r * vec2(3., 5.) + vec2(0.37, 0.11)).g;
    float A = az * 57.29578, E = el * 57.29578;
    vec2 ab = vec2(-A * 0.9397 + E * 0.342, E * 0.9397 + A * 0.342);       // along a stroke (up to the right on screen), across it
    // the tooth is the paper's own: looked up once in the dome's leaning coordinates
    float stk = textureLod(uTooth, ab * vec2(0.02, 0.03) + vec2(0.13, 0.41), 0.).g, gr = textureLod(uTooth, ab * 0.05 + 0.53, 0.).r;
    float bl = textureLod(uTooth, ab * vec2(0.06, 0.09) + 0.19, 0.).b, st = stk * 0.72 + gr * 0.28;
    float thin = 0.4 * (1. - step(1., uDens)), row = floor(ab.y / SKH);
    float cov = max(skRow(ab, row - 1., st, bl, thin), max(skRow(ab, row, st, bl, thin), skRow(ab, row + 1., st, bl, thin)));
    // one stroke goes the wrong way
    vec2 w2 = vec2(A * 0.9397 + E * 0.342 + 12., E * 0.9397 - A * 0.342 - 31.5);
    float wu = (w2.x + 6.5) / 13., wv = w2.y / (1.35 * (1. - 0.4 * wu * wu)) ;
    if (wu > 0. && wu < 1. - 0.12 * bl) cov = max(cov, step(length(vec2(max(0., 1. - (w2.x + 6.5) / 1.35), wv)) + (bl - 0.5) * 0.55, 1.) * step(mix(0.05, 0.6, wu * wu), st));
    // the closed lay over the horizon: every mill, poplar and tower has the stick whole behind it
    cov = max(cov, step(E, 9.5 + (bl - 0.5) * 4.) * step(0.012, gr));
    vec3 col = uBlue;
    // white dragged thinly over the low blue: most at the horizon, none above twenty degrees
    float w = (1. - smoothstep(0.0, 0.17, d.y + (bl - 0.5) * 0.05)) * 0.86;
    w *= 0.86 + 0.14 * sin(uTime * 0.7 + bl * 31. + q.x * 3.);   // the drag is laid again and again: its streaks come and go, each in its own time
    if (s1 * 0.55 + s2 * 0.45 < w) col = uDrag;
    float paper = max(1. - cov, step(uDens, s1 * 0.6 + bl * 0.4));       // a thin sky (night): mostly paper
    gl_FragColor = vec4(mix(col, uPaper, paper), 1.);
  }
`;function wa(p,g,z,u={}){const i=(u.rng||p.rng).fork("pb-heap"),w=g.pal,[h,c,m]=u.center,y=u.width,D=u.height,R=u.lumps||40,Y=u.strokes||800,X=u.top||w.white,G=u.hollow||w.rose,$=u.under||w.lavender,_=u.open?1:0;let C=(u.toward?u.toward[0]:0)-h,o=(u.toward?u.toward[1]:0)-m;const f=Math.hypot(C,o)||1;C/=f,o/=f;const b=-o,x=C,k=(d,W,O)=>[h+b*d+C*O,c+W,m+x*d+o*O],V=i.range(-.14,.14)*y,T=i.range(.42,.62),q=i.range(.3,.5),F=i.sign()*i.range(.24,.3)*y,E=(d,W,O)=>{const K=Math.abs(d-W)/O;return K<1?Math.pow(1-K*K,.75):0},L=d=>D*Math.max(E(d,V,y*.3),T*E(d,F,y*.3),q*E(d,-F*1.25,y*.22),.3*E(d,0,y*.5)),S=[];for(let d=0,W=0;d<R&&W<R*30;W++){const O=i.range(-.5,.5)*y,K=L(O),j=y*i.range(.09,.15)*(R<12?1.5:1);if(K<j*1.2)continue;const ee=i(),Z=Math.max(j*.45,(d<R*.4?1-ee*ee*.5:ee)*(K-j*.75));S.push({x:O,y:Z,r:j,d:(1-Z/D)*y*.12+i.range(0,y*.02)}),d++}S.length||S.push({x:0,y:D*.4,r:y*.3,d:0});const ae=[];for(const d of S)for(let W=0;W<4;W++){const O=d.r*(.88-W*.25),K=(38+W*16+_*14)*Math.PI/180;for(let j=Math.PI*1.14-i()*K*.5;j>-.14*Math.PI;j-=K*(i.range(.55,.8)+_*.52)){const ee=j+K*.5,Z=j-K*.5,me=O*i.range(.9,1.1),de=O*i.range(.86,1.12),fe=i.range(-.05,.05)*d.r;ae.push({L:d,rho:O,th:j,a:[d.x+fe+Math.cos(ee)*me,d.y+Math.sin(ee)*me*.9],c:[d.x+fe+Math.cos(Z)*de,d.y+Math.sin(Z)*de*.9],sag:O*(1-Math.cos(K*.5)),k:i()})}}const U=Math.min(1,Y/Math.max(1,ae.length));for(const d of ae){if(!_&&d.k>U&&!(d.rho>d.L.r*.8&&Math.sin(d.th)>.8)||d.a[1]<d.L.r*.08||d.c[1]<d.L.r*.08)continue;const W=d.L,O=W.y/D,K=Math.sin(d.th)*d.rho/W.r+i.range(-.1,.1);let j=X,ee=i.range(.9,1);K<-.02+(O<.2?.42:0)?(j=$,ee=i.range(.6,.85)):K<.3&&(j=i.chance(.25)?X:G,ee=i.range(.65,.9));const Z=O>.6?i.range(7,14):O<.25?i.range(26,44):i.range(16,30);z.add(k(d.a[0],d.a[1],W.d),k(d.c[0],d.c[1],W.d),W.r*i.range(.4,.56)*(1-.4*_),j,{bow:d.sag,strength:_?Math.min(1,ee+.1):ee,phase:i(),period:Z})}return{discs:S.map(d=>({p:k(d.x,d.y,d.d-y*.004),r:d.r*.8,right:[b,0,x],floor:c}))}}function Ot(p,g=14){const z=[];for(const i of p)for(let w=0;w<g;w++){const h=w/g*6.2832,c=(w+1)/g*6.2832,m=i.floor??-1e9,y=D=>[i.p[0]+i.right[0]*Math.cos(D)*i.r,Math.max(m,i.p[1]+Math.sin(D)*i.r),i.p[2]+i.right[2]*Math.cos(D)*i.r];z.push(...i.p,...y(h),...y(c))}const u=new n.BufferGeometry;return u.setAttribute("position",new n.Float32BufferAttribute(z,3)),u}const Be=[-.766,.643],oe=-14,ne=[-22.8,91.9],xa=50*Math.PI/180,ge=[[-22.8,91.9],[80,-60],[139,-187],[199,-337],[251,-534],[299,-798],[342,-1139],[420,-2055]];function ba(p){for(let g=0;g<ge.length-1;g++){const z=ge[g],u=ge[g+1];if(p>=z[0]&&p<=u[0])return z[1]+(u[1]-z[1])*(p-z[0])/(u[0]-z[0])}return null}async function za(p,g={}){const z=g.palette||Et,u=g.detail??p.quality?.detail??1,i=!g.style,w=g.style||await va(p,{palette:z,wind:Be,paper:g.paper,exposure:g.exposure||1}),h=w.pal,c=p.rng.fork("pb-hero"),m=new n.Group;m.name="pastel-bulb-fields-hero",await p.yield();const y=g.crop||(c.chance(.7)?"tulip":c.chance(.5)?"hyacinth":"daffodil"),D=y==="hyacinth"?[h.lilac,h.rose,h.white,h.cerulean,h.lilac]:y==="daffodil"?[h.cream,h.white,h.cream,h.orange,h.white]:[h.scarlet,h.cream,h.lilac,h.rose,h.white,h.scarlet,h.cream,h.orange],R=y==="hyacinth"?.72:1,Y=98,X=-3050,G=[];for(const e of[-1,1]){let t=6.6,r=null,a=null,s=c.int(2,6),l=c.int(6,14);const v=e<0?2050:1420;for(;t<v;){const A=Math.max(0,(t-1e3)/400);let P=c.range(6,14)*R*(1+A*1.6),H,I="bloom";if(--l<=0)H=h.cerulean,P=c.range(2.6,3.6),I="ditch",l=c.int(14,26);else if(--s<=0)H=h.green,I="green",s=c.int(6,12)-(y==="daffodil"?2:0);else do H=c.pick(D);while(H===r||H===a&&c.chance(.7));a=r,r=H;const N=e*(t+P/2),J=e>0?ba(N):null;G.push({x:N,w:P,c:H,kind:I,off:c.range(-12,12),dz:J,shy:c.chance(.22)?c.range(6,30):c.range(0,3)}),t+=P+c.range(.7,1.6)*(1+A)}}const $=-2100,_=3600,C=4096,o=new Uint8Array(C*4),f=new n.Color;for(const e of G){f.copy(e.c).multiplyScalar(.87).convertLinearToSRGB();const t=Math.ceil((e.x-e.w/2-$)/_*C),r=Math.floor((e.x+e.w/2-$)/_*C);for(let a=Math.max(0,t);a<=Math.min(C-1,r);a++)o[a*4]=Math.min(255,f.r*255),o[a*4+1]=Math.min(255,f.g*255),o[a*4+2]=Math.min(255,f.b*255),o[a*4+3]=Math.min(255,e.w/16*255)}for(let e=0;e<C;e++)o[e*4+3]===0&&(o[e*4+3]=150);const b=new n.DataTexture(o,C,1,n.RGBAFormat,n.UnsignedByteType);b.colorSpace=n.SRGBColorSpace,b.magFilter=n.LinearFilter,b.minFilter=n.LinearMipmapLinearFilter,b.generateMipmaps=!0,b.wrapS=b.wrapT=n.ClampToEdgeWrapping,b.needsUpdate=!0;const x=new n.Vector2($,1/_),k=p.core&&p.core.makeRng?p.core.makeRng(p.core.hashSeed("pb-parcels:"+(p.seed??0))):c.fork("parcels"),V=2048,T=8,q=new Uint8Array(V*T*4),F=G.slice().sort((e,t)=>e.x-t.x);for(let e=0;e<F.length;){let t=0,r=0,a=1e9;const s=c.int(3,6),l=Math.sign(F[e].x);for(;e+t<F.length&&Math.sign(F[e+t].x)===l;){const P=F[e+t];if(a=Math.min(a,Math.abs(P.x)),t>=s&&r>=a*a/700)break;r+=P.w+1,t++}t=Math.max(1,t);const v=F.slice(e,e+t),A=v.filter(P=>P.kind==="bloom");A.length&&!c.chance(.12)?c.pick(A):c.pick(v),e+=t}let E=[];for(let e=0;e<F.length;){let t=0,r=0;const a=k.int(3,5),s=Math.sign(F[e].x);for(;e+t<F.length&&Math.sign(F[e+t].x)===s&&(t<a||r<30);)r+=F[e+t].w+1,t++;t=Math.max(1,t);const l=F.slice(e,e+t),v=l.filter(H=>H.kind==="bloom"),A=E[E.length-1];let P=(v.length&&!k.chance(.15)?k.pick(v):k.pick(l)).c;A&&A.c===P&&v.length>1&&(P=k.pick(v.filter(H=>H.c!==P).concat(v)).c),E.push({x0:l[0].x-l[0].w/2,x1:l[t-1].x+l[t-1].w/2,c:P,sg:s}),e+=t}for(let e=0;e<T;e++){for(const r of E){f.copy(r.c).multiplyScalar(.87).convertLinearToSRGB();const a=Math.ceil((r.x0-$)/_*V),s=Math.floor((r.x1-$)/_*V)-1;for(let l=Math.max(0,a);l<=Math.min(V-1,s);l++){const v=(e*V+l)*4;q[v]=Math.min(255,f.r*255),q[v+1]=Math.min(255,f.g*255),q[v+2]=Math.min(255,f.b*255),q[v+3]=Math.round(255*(l-a+.5)/Math.max(1,s-a+1))}}const t=[];for(let r=0;r<E.length;){const a=E[r],s=E[r+1];if(s&&s.sg===a.sg){const l=t[t.length-1];let v=k.chance(.5)?a.c:s.c;l&&l.c===v&&(v=v===a.c?s.c:a.c),t.push({x0:a.x0,x1:s.x1,c:v,sg:a.sg}),r+=2}else t.push(a),r++}E=t}const L=new n.DataTexture(q,V,T,n.RGBAFormat,n.UnsignedByteType);L.colorSpace=n.SRGBColorSpace,L.magFilter=n.NearestFilter,L.minFilter=n.NearestFilter,L.generateMipmaps=!1,L.wrapS=L.wrapT=n.ClampToEdgeWrapping,L.needsUpdate=!0,await p.yield();const S=w.batch();let ae=0;for(const e of G){const t=e.dz===null?[[Y,X]]:[[Y,e.dz+22+e.shy],[e.dz-22-e.shy*.5,X]];for(const[r,a]of t){let s=r-c.range(0,9)-(c.chance(.15)?c.range(6,20):0);for(;s>a+20;){const l=Math.max(Math.abs(s+100),Math.abs(e.x)*.8),v=Math.min(s-a,l<800?c.range(80,160):c.range(240,460)),A=c.range(-.45,.45),P=oe+.05+ae%5*.012;S.add([e.x+A,P,s],[e.x+A+c.range(-.3,.3),P,s-v],e.w,e.c,{lay:1,bow:c.range(-.7,.7),off:e.off,strength:c.range(.82,1)}),s-=v+(c.chance(.6)?-c.range(2,5):c.range(1,3.5))}}++ae%40===0&&await p.yield()}const U=S.mesh({field:!0,stripes:b,parcels:L,stripeMap:x,near:.92,cap:.5}),d=1.7,W=w.bandMap(G.filter(e=>Math.abs(e.x)<890).map(e=>({...e,off:e.off*d})),-900,900),O=g.lane||null,K=new n.PlaneGeometry(5200,4600,1,1);K.rotateX(-Math.PI/2),K.translate(-200,oe-.02,-1500);const j=new n.Mesh(K,w.paper({stripes:b,parcels:L,stripeMap:x,stripeZ:new n.Vector2(X,Y),near:W.tex,nearMap:W.map,rowBox:O?new n.Vector4(O[0],O[1],O[3],O[2]):void 0,row:O?new n.Vector4((O[0]+O[1])/2,1.2,1.6,1):void 0,rowCut:O?new n.Vector3(.828,.56,-23.1):void 0}));j.frustumCulled=!1,m.add(j),await p.yield();const ee=[],Z=[],me=(e,t,r,a,s=ee)=>s.push(...e,...t,...r,...e,...r,...a),de=(e,t,r=ee)=>{let a=null;for(let s=0;s<t.length;s++){const l=t[Math.max(0,s-1)],v=t[Math.min(t.length-1,s+1)];let A=v[0]-l[0],P=v[1]-l[1];const H=Math.hypot(A,P)||1;A/=H,P/=H;const I=e(s).map(([N,J])=>[t[s][0]-P*N,J,t[s][1]+A*N]);if(a)for(let N=0;N<I.length-1;N++)me(a[N],a[N+1],I[N+1],I[N],r);a=I}},fe=(e,t,r,a,s,l,v=8,A=0,P=ee)=>{for(let H=0;H<v;H++){const I=A+H/v*6.2832,N=A+(H+1)/v*6.2832;me([e+Math.cos(I)*s,r,t+Math.sin(I)*s],[e+Math.cos(N)*s,r,t+Math.sin(N)*s],[e+Math.cos(N)*l,a,t+Math.sin(N)*l],[e+Math.cos(I)*l,a,t+Math.sin(I)*l],P)}},ue=[[-35.7-.766*34,76.6+.643*34]];for(let e=0;e<=8;e++){const t=xa*(1-e/8);ue.push([-100+100*Math.cos(t),100*Math.sin(t)])}ue.push([0,-200],[0,-900],[0,-3100]);const Ke=()=>({top:.3,o1:5.1,o2:5.7,prof:[[-5.7,oe-.3],[-5.1,.3],[-4.6,.3],[-4.5,-.8],[4.5,-.8],[4.6,.3],[5.1,.3],[5.7,oe-.3]]});de(()=>Ke().prof.slice(2,6),ue),de(()=>Ke().prof.slice(0,3),ue,Z),de(()=>Ke().prof.slice(5),ue,Z),fe(ne[0],ne[1],oe-.3,1.5,11.5,7.6,10,0,Z),fe(ne[0],ne[1],1.5,1.52,7.6,5.5,10,0,Z);const ke=(g.upland??.5)+1,Je=()=>[[-10,oe-.3],[-10,ke],[-4,ke],[0,oe-.3]];g.canalGap===!1?de(Je,[[1500,101],[-2200,101]],Z):(de(Je,[[1500,101],[-47,101]],Z),de(Je,[[-94,101],[-2200,101]],Z));const ze=oe+6;de(()=>[[-9,oe-.3],[-2.6,ze],[2.6,ze],[9,oe-.3]],ge,Z);const ct=Be,Me=[ct[0],0,ct[1]],Fe=[Me[2],0,-Me[0]],qt=h[g.sailcloth||"scarlet"]||h.scarlet,we=[],te=w.batch(),We=w.batch(),ht=w.batch(),B=p.core&&p.core.makeRng?p.core.makeRng(p.core.hashSeed("pb-milldraw:"+(p.seed??0))):c.fork("milldraw"),dt=g.millLit||h.lavender,ft=g.millShade||h.lilac,Kt=g.millBrick||h.rose,It=h.white;for(let e=0;e<7;e++){const t=e===0?40:c.range(30,37)*(1+.06*Math.max(0,e-1)),r=e===0?23:t*c.range(.55,.6)*(e>1?.86:1),a=e===0?ne[0]:ge[e][0],s=e===0?ne[1]:ge[e][1],l=e===0?1.5:ze,v=t*.15,A=t*.072,P=l+t*.8,H=re=>v+(A-v)*(re-l)/(t*.8);fe(a,s,l-1,P,v,A,8,.39),fe(a,s,P,l+t*.93,A*1.25,A*1,8),fe(a,s,l+t*.93,l+t,A*1,A*.2,8);const I=l+t*.34,N=H(I)*1.55;fe(a,s,I-.5,I,H(I),N,8,.39),fe(a,s,I,I+.01,N,.1,8,.39);const J=(re,pe,Te)=>[a+Me[0]*re+Fe[0]*pe,Te,s+Me[2]*re+Fe[2]*pe],Ba=H(I+1),Ue=H(P-1);te.add(J(Ue*.95,-Ue*.42,P-.6),J(v*1,-v*.46,l+.6),v*.42,h.lavender,{bow:.25,strength:.92,seed:c()}),te.add(J(Ue*1,Ue*.12,P-2.5),J(v*1.05,v*.1,l+t*.12),v*.26,h.lavender,{bow:-.2,strength:.7,seed:c()}),te.add(J(N*1.02,-N*1.12,I+1.15),J(N*1.02,N*1.12,I+1.05),.42,h.white,{seed:c()}),te.add(J(N*1.02,-N*1.05,I+.15),J(N*1.02,N*1.02,I+.2),.3,h.lavender,{strength:.6,seed:c()});for(let re=-2;re<=2;re++)te.add(J(N*1.03,re*N*.5,I+1.2),J(N*1.03,re*N*.5,I+.1),.2,h.white,{strength:.8,seed:c()});if(te.add(J(A*1.3,-A*1.25,l+t*.87),J(A*1.3,A*1.2,l+t*.88),t*.035,h.cream,{bow:-A*.35,seed:c()}),e<=2){const re=e===0?25:e===1?16:10,pe=(P-l-1.2)/re,Te=Math.atan2(Me[2]*.75-Fe[2]*.66,Me[0]*.75-Fe[0]*.66);for(let Q=0;Q<re;Q++){const se=l+.9+(Q+.5)*pe,ce=H(se)+.45,Se=se<I-.6;if(!(Math.abs(se-I-.4)<1))for(let le=0;le<8;le++){const ie=.39+le/8*6.2832,ye=ie+6.2832/8,Oe=Math.cos((ie+ye)/2-Te),qe=Oe<=.08,Le=B.range(.02,.1),_e=1-B.range(.02,.12),Rt=B.chance(.5),Ye=B(),Ze=B();if(!qe&&Oe<.5&&(Q+le)%2===0&&Ye<.6)continue;const Xe=he=>[a+(Math.cos(ie)*(1-he)+Math.cos(ye)*he)*ce,se+(Ye-.5)*.12,s+(Math.sin(ie)*(1-he)+Math.sin(ye)*he)*ce],Ft=qe?ft:Se?Kt:dt,oa=pe*(qe?.5:.8),na={strength:qe?.5+.2*Ze:.82+.18*Ze,bow:(Ye-.5)*.16,seed:B()};if(Se&&!qe)for(let he=0;he<2;he++){const it=3+(Q+le+he)%2,Lt=(he-.5)*pe*.5;for(let Pe=0;Pe<it;Pe++){const ra=Le+(_e-Le)*(Pe+.07)/it,sa=Le+(_e-Le)*(Pe+.93)/it,Wt=Xe(ra),Gt=Xe(sa);Oe<.5&&(Pe+he+Q)%3===0||(Wt[1]+=Lt,Gt[1]+=Lt+(Ze-.5)*.06,te.add(Wt,Gt,pe*.38,Ft,{strength:.8+.2*((Pe*.37+Ze)%1),seed:(Ye+Pe*.31+he*.17)%1}))}}else te.add(Xe(Rt?_e:Le),Xe(Rt?Le:_e),oa,Ft,na)}}for(let Q=0;Q<8;Q++){const se=Q/8*6.2832,ce=se+6.2832/8,Se=Math.cos((se+ce)/2-Te),le=A*1.2+.4,ie=l+t*(.845+.05*B());Se>.75||te.add([a+Math.cos(se)*le,ie,s+Math.sin(se)*le],[a+Math.cos(ce)*le,ie+.2,s+Math.sin(ce)*le],t*.05,Se<=.08?ft:dt,{strength:Se<=.08?.6:.9,seed:B()})}}const aa=l+t*.86,je=J(A*1.25+1.6,0,aa),Pt=(e===0?1:c.range(.8,1.25))*(c.chance(.5)||e===0,1),Ne=[je[0],je[1],je[2],Pt],be=r*.115*(1+.22*Math.max(0,e-1));for(let re=0;re<4;re++){const pe=Math.cos(re*Math.PI/2+.3*e),Te=Math.sin(re*Math.PI/2+.3*e),Q=(ie,ye,Oe)=>[ie*pe-ye*Te,ie*Te+ye*pe,Oe],se=()=>c();We.add(Q(be*.52,r*.2,.05),Q(be*.5,r*.99,.05),be*.86,qt,{pivot:Ne,strength:.95,bow:.1,seed:se()}),We.add(Q(0,-r*.04,.2),Q(0,r,.2),Math.max(.42,r*.022),h.white,{pivot:Ne,seed:se()}),We.add(Q(be,r*.2,.2),Q(be,r*.995,.2),Math.max(.3,r*.014),h.white,{pivot:Ne,strength:.9,seed:se(),off:1});for(let ie=0;ie<7;ie++){const ye=r*(.2+.8*ie/6);We.add(Q(-.1,ye,.25),Q(be+.15,ye,.25),Math.max(.26,r*.012),h.white,{pivot:Ne,strength:.85,seed:se(),off:1})}const ce=r-be*.2,Se=Math.sin(50*Math.PI/180),le=Math.cos(50*Math.PI/180);ht.add(Q(be*.5,ce,.1),Q(ce*Se,ce*le,.1),be*1.25,It,{pivot:Ne,kind:3,strength:.8,bow:ce*.094,seed:se()})}we.push({base:[a,l,s],hub:je,height:t,sail:r,speed:Pt}),await p.yield()}const Qe={value:0},ut=new n.Vector3(Me[0],0,Me[2]),Ht=We.mesh({spin:!0,spinUniform:Qe,axle:ut}),pt=ht.mesh({spin:!0,spinUniform:Qe,axle:ut,add:!0,shade:!1});pt.renderOrder=5,m.add(Ht,pt),await p.yield();const xe=(e,t)=>{for(let r=0;r<e.length-1;r++){const a=e[r],s=e[r+1],l=Math.hypot(s[0]-a[0],s[1]-a[1]);if(t<=l||r===e.length-2){const v=t/l,A=(s[0]-a[0])/l,P=(s[1]-a[1])/l;return{x:a[0]+(s[0]-a[0])*v,z:a[1]+(s[1]-a[1])*v,nx:-P,nz:A,tx:A,tz:P}}t-=l}return null},Ie=[],et=c.fork("dabs"),vt=.85/Math.max(.5,u),Ge=g.lane||null;let Vt=0;for(const e of G){if(Math.abs(e.x)>84||e.kind==="ditch")continue;const t=Math.max(2,Math.floor((e.w-.6)/.95));for(let r=0;r<t;r++){const a=e.x-(t-1)*.475+r*.95;for(let s=92-et()*vt;s>-235;s-=vt){const l=et(),v=et();if(e.dz!==null&&Math.abs(s-e.dz)<24+e.shy||e.x<0&&s>0&&Math.abs(Math.hypot(a+100,s)-100)<6.6||Ge&&a>Ge[0]&&a<Ge[1]&&s<Ge[2]&&s>Ge[3])continue;const A=Math.min(1,Math.max(0,(s+10)/35)),P=a+(l-.5)*(.25+.75*A),H=s+(v-.5)*.3;e.kind==="green"?w.dab(Ie,P,oe+.05,H,.55+l*.2,.2,h.green,e.off):(w.dab(Ie,P,oe+.32,H,.5+v*.14,.27,e.c,e.off),l<.62&&w.dab(Ie,P+.22,oe+.03,H+.3,.42,.15,h.green,e.off)),++Vt%2500===0&&await p.yield()}}}const Ut=await w.dabs(Ie,{far:78});m.add(Ut),await p.yield();const tt=[],M=c.fork("grass"),jt=Math.round(2600*u);for(let e=0;e<jt;e++){const t=20+M()*M()*620,r=xe(ue,t),a=M.sign(),s=M(),l=Ke(),v=a*(4.65+.9*s);w.dab(tt,r.x+r.nx*v,l.top-.5*s+.03,r.z+r.nz*v,M.range(.9,1.6)*(.5+.5*s),M.range(.2,.34),M.chance(.1)?h.cream:h.green,0)}for(let e=0;e<Math.round(2e3*u);e++){const t=xe(ge,M()*900),r=M(),a=-(2.2+7*r)*(M.chance(.85)?1:-1);w.dab(tt,t.x+t.nx*a,ze-5.6*r+.03,t.z+t.nz*a,M.range(1.2,2.1),M.range(.2,.32),M.chance(.1)?h.cream:h.green,0)}await p.yield();const _t=await w.dabs(tt,{far:460,lean:.55});m.add(_t);for(let e=330;e<3050;){const t=M.range(70,130)*(1+e/1200),r=xe(ue,e),a=xe(ue,Math.min(3200,e+t));for(const s of[-1,1]){const l=s*M.range(5.5,5.9),v=-2.2+M.range(-.5,.5);te.add([r.x+r.nx*l,v,r.z+r.nz*l],[a.x+a.nx*l,v-.3,a.z+a.nz*l],M.range(3.6,5),h.green,{strength:M.range(.55,.8),bow:M.range(-.4,.4)})}e+=t+M.range(-4,6)}for(let e=78;e<2300;){const t=M.range(60,110)*(1+e/900),r=xe(ge,e),a=xe(ge,e+t),s=-M.range(5,6.5);te.add([r.x+r.nx*s,ze-2.4,r.z+r.nz*s],[a.x+a.nx*s,ze-2.6,a.z+a.nz*s],M.range(3.6,5),h.green,{strength:M.range(.55,.8)}),e+=t+M.range(-3,6)}for(let e=0;e<20;e++){const t=xe(ge,M.range(215,760)),r=-M.range(.5,6.5),a=ze-Math.max(0,-r-2.6)*.95+.55,s=M.sign(),l=[t.x+t.nx*r,a,t.z+t.nz*r];te.add([l[0]-t.tx*.9*s,a,l[2]-t.tz*.9*s],[l[0]+t.tx*.9*s,a,l[2]+t.tz*.9*s],1.15,h.cream,{kind:2}),te.add([l[0]+t.tx*.8*s,a-.25,l[2]+t.tz*.8*s],[l[0]+t.tx*1.5*s,a-.5,l[2]+t.tz*1.5*s],.5,h.cream,{kind:2})}const gt=w.batch(),De=p.core&&p.core.makeRng?p.core.makeRng(p.core.hashSeed("pb-mound:"+(p.seed??0))):c.fork("mound"),mt=(e,t,r,a,s,l)=>{for(let v=-1;v<=1;v++){const A=v*r*.42+De.range(-.2,.2),P=De.range(0,.22),H=De.range(.62,1.08),I=J=>[e[0]+(t[0]-e[0])*J+l[0]*A,e[1]+(t[1]-e[1])*J,e[2]+(t[2]-e[2])*J+l[1]*A],N=a===h.cream?v===0?h.cream:h.green:De.chance(.1)?h.cream:a;gt.add(I(P),I(H),r*De.range(.2,.32),N,{strength:Math.min(1,(s.strength||.7)+.15),bow:De.range(-.5,.5),seed:De()})}};for(let e=0;e<10;e++){const t=(e+M.range(-.3,.3))/10*6.2832,r=Math.cos(t),a=Math.sin(t),s=8.4,l=M.range(10.2,11.2);mt([ne[0]+r*s,.9,ne[1]+a*s],[ne[0]+r*l+a*1.2,M.range(-7.5,-4.5),ne[1]+a*l-r*1.2],M.range(2.8,3.8),M.chance(.15)?h.cream:h.green,{strength:M.range(.55,.8),bow:M.range(-.4,.4)},[-a,r])}for(let e=0;e<14;e++){const t=(e+B.range(.2,.8))/14*6.2832,r=Math.cos(t),a=Math.sin(t),s=B.range(8.8,9.6),l=B.range(10.6,11.6);mt([ne[0]+r*s,B.range(-2.5,.2),ne[1]+a*s],[ne[0]+r*l-a*1,B.range(-12.5,-9),ne[1]+a*l+r*1],B.range(2.2,3.2),B.chance(.2)?h.cream:h.green,{strength:B.range(.55,.8),bow:B.range(-.4,.4),seed:B()},[-a,r])}for(let e=0;e<9;e++){const t=(e+B.range(-.2,.2))/9*6.2832,r=t+.62,a=B.range(6.7,7.3);te.add([ne[0]+Math.cos(t)*a,1.56,ne[1]+Math.sin(t)*a],[ne[0]+Math.cos(r)*a,1.56,ne[1]+Math.sin(r)*a],B.range(1,1.5),h.green,{lay:1,strength:B.range(.6,.85),bow:-.5,seed:B()})}for(const[e,t]of[[-98,-640],[-43,420]]){const r=Math.sign(t-e);for(let a=e;(t-a)*r>20;){const s=B.range(26,54),l=a+r*s,v=()=>B.chance(.14)?h.cream:h.green;te.add([a,ke+.06,108+B.range(-.6,.6)],[l,ke+.06,108+B.range(-.6,.6)],B.range(4.2,5.4),v(),{lay:1,strength:B.range(.55,.8),bow:B.range(-.4,.4),off:B.range(-8,8),seed:B()}),te.add([a+r*B.range(0,8),ke-2.6,104],[l,ke-2.9,103.9],B.range(3.4,4.6),v(),{strength:B.range(.5,.75),bow:B.range(-.3,.3),seed:B()}),te.add([a+r*B.range(0,8),ke-7.2,102.2],[l,ke-7,102.1],B.range(3.4,4.6),v(),{strength:B.range(.45,.65),bow:B.range(-.3,.3),seed:B()}),a=l+r*B.range(-3,5)}}if(await p.yield(),g.canal!==!1)for(let e=0;e<64;e++){const t=10+e*13*(1+e*.035)+M.range(-4,4),r=M.range(18,42)*(1+e*.03),a=M.range(-3.3,3.3),s=xe(ue,t),l=xe(ue,t+r),v=M.chance(.22);te.add([s.x+s.nx*a,.02,s.z+s.nz*a],[l.x+l.nx*a,.02,l.z+l.nz*a],M.range(.9,2.1),v?h.white:h.cerulean,{lay:1,strength:v?.6:M.range(.7,.95),bow:M.range(-.3,.3),phase:M(),period:M.range(5,10),off:M.range(-8,8)})}const Yt=te.mesh({});m.add(Yt,gt.mesh({cap:.5,rag:1})),await p.yield();const Ce=[1010,110,-2150],wt=1700,at=1190,xt=w.batch(),Zt=w.heap(xt,{center:Ce,width:wt,height:at,toward:[0,-60],lumps:28,strokes:Math.round(640*(.6+.4*u)),rng:c,open:1,under:h.orange}),bt=xt.mesh({shade:!1,finger:!1,grain:.35,cap:.5}),He=new n.Group;m.add(He),bt.renderOrder=2,He.add(bt);const Xt=w.paper({side:n.DoubleSide}),$t=w.paper({side:n.DoubleSide,color:h.white.clone().multiplyScalar(.87),grain:.1}),yt=new n.Mesh(Ot(Zt.discs),$t);yt.frustumCulled=!1,He.add(yt);const kt=new n.BufferGeometry;kt.setAttribute("position",new n.Float32BufferAttribute(ee,3));const Mt=new n.Mesh(kt,Xt);Mt.frustumCulled=!1,m.add(Mt);const Jt=w.paper({side:n.DoubleSide,color:h.green.clone().multiplyScalar(.87),grain:.17,dir:new n.Vector4(.5,.866,.45,1),band:new n.Vector2(oe-.6,oe+(g.verge??3.8)),bandColor:(g.vergeColor||h.rose).clone().multiplyScalar(.87)}),St=new n.BufferGeometry;St.setAttribute("position",new n.Float32BufferAttribute(Z,3));const Bt=new n.Mesh(St,Jt);Bt.frustumCulled=!1,m.add(Bt),await p.yield();let zt=null;(g.sky??i)&&(zt=w.sky(),m.add(zt),await p.yield());const Dt=g.bandCloud??1,Ct=[];for(const e of G){if(Math.abs(e.x)>760||e.kind==="ditch")continue;const t=Math.max(2,Math.round((Math.abs(e.x)<260?9:5)*u));for(let r=0;r<t;r++)Ct.push({p:[e.x+c.range(-.4,.4)*e.w,oe,0],dir:[0,-1],off:e.off*d,c:e.c})}const At=w.dust(Ct,{cloud:Dt,range:[-92,3050]});At.renderOrder=6,m.add(At),await p.yield();const ot=new n.Vector3,nt=new n.Vector3;let rt=null,st=0,Tt=c.range(0,6);const Qt=e=>{m.updateMatrixWorld(),ot.set(Be[0]*e,0,-100+Be[1]*e).applyMatrix4(m.matrixWorld),w.setCloud(Dt,ot.x,ot.z,130,g.bandHalfWidth??520,!1)},Ae=g.bladeSun||null,ea=g.bladeGround??0,Ve=new n.Vector3,Ee=new n.Vector3,ta=()=>{if(!Ae||Ae[1]>-.05)return;Ve.set(we[0].hub[0],we[0].hub[1],we[0].hub[2]).applyMatrix4(m.matrixWorld),Ee.set(Fe[0],0,Fe[2]).transformDirection(m.matrixWorld);const e=1/-Ae[1],t=(Ve.y-ea)*e,r=Ae[0]*e,a=Ae[2]*e,s=Ee.x*a-Ee.z*r;Math.abs(s)<1e-4||(w.U.uBlade.value.set(Ve.x+Ae[0]*t,Ve.z+Ae[2]*t,(st+37)%(Math.PI*2),g.bladeStrength??1),w.U.uBladeM.value.set(a/s,-r/s,-Ee.z/s,Ee.x/s))};return{object:m,radius:105,height:44,center:new n.Vector3(70,10,-190),extent:3100,ground:!1,groundY:oe,style:w,stripes:G,mills:we,crop:y,field:U,floor:j,cumulus:He,anchors:{entry:[-35.7,3.2,76.6],entryHeading:[.766,0,-.643],flyThrough:[[-35.7,3.2,76.6],[-18.1,3.2,57.4],[-6,3.2,34.2],[0,3.2,0],[0,3.2,-60],[0,3.2,-120],[0,3.2,-173]],portalSeat:{position:[0,3.2,-173],facing:[0,0,1],radius:7},reveal:{position:[0,3.2,0],lookAt:[60,14,-400]},firstMill:{base:we[0].base.slice(),hub:we[0].hub.slice(),sail:we[0].sail},millRow:we.slice(1).map(e=>e.hub.slice()),cumulus:{center:[Ce[0],Ce[1]+at/2,Ce[2]],top:[Ce[0],Ce[1]+at,Ce[2]],width:wt},bandCrossing:[0,0,-100],wind:[Be[0],0,Be[1]],floorY:oe},setProgress(e){rt=e},update(e,t,r){if(i){Tt+=e;const a=Tt%13/13;nt.set(150+Be[0]*(a*420-60),0,-260+Be[1]*(a*420-60)).applyMatrix4(m.matrixWorld),w.setGust(nt.x,nt.z,42,Math.sin(Math.PI*a))}Qt(rt===null?-604+t*w.windSpeed%1e3:-340+760*rt),i&&w.update(e,t,r),st+=e*(Math.PI*2/6.5),Qe.value=st%(Math.PI*2*4e3),ta()},dispose(){i&&w.tooth.dispose(),b.dispose(),L.dispose(),W.tex.dispose(),U.geometry.dispose()}}}const ya=`
  attribute vec3 aP, aCol; attribute vec4 aDir;            // dx, dz, comb offset, seed
  uniform int uWhich; uniform vec2 uRange; uniform float uSpeed;
  varying vec2 vC; varying vec4 vCol;
  ${Re}
  void main(){
    vec4 C = uCloud[uWhich];
    vec3 Pw = (modelMatrix * vec4(aP, 1.)).xyz;
    vec2 dW = normalize((mat3(modelMatrix) * vec3(aDir.x, 0., aDir.y)).xz + vec2(1e-6, 0.));
    vec2 w = uWind, c = vec2(-uWind.y, uWind.x), d0 = Pw.xz - C.xy;
    float al0 = dot(d0, w) + aDir.z, ac0 = dot(d0, c), zw = dot(dW, w), zc = dot(dW, c);
    float ia = 1. / max(C.z, 1.), ib = 1. / max(C.w, 1.);
    float A = zw * zw * ia * ia + zc * zc * ib * ib, B = al0 * zw * ia * ia + ac0 * zc * ib * ib;
    float disc = B * B - A * (al0 * al0 * ia * ia + ac0 * ac0 * ib * ib - 1.);
    float sg = zw >= 0. ? 1. : -1.;
    float t = (-B - sg * sqrt(max(disc, 0.))) / max(A, 1e-8);          // where the trailing edge cuts this row
    float cyc = uTime / 3. + aDir.w * 7.31, age = fract(cyc) * 3., h = pbHash(aDir.w * 17. + floor(cyc)), h2 = pbHash(h * 91.7);
    float back = uSpeed / (sg * max(abs(zw), 0.25)) * age;             // the tip has run on since this puff was raised
    float tt = t - back;
    float ok = step(0., disc) * step(uRange.x, tt) * step(tt, uRange.y);
    vec3 pos = Pw + vec3(dW.x, 0., dW.y) * tt + vec3(w.x, 0., w.y) * (2.5 * age + (h - 0.5) * 3.) + vec3(c.x, 0., c.y) * (h2 - 0.5) * 5.
             + vec3(0., 0.5 + (0.9 + h2) * age, 0.);
    float size = (1.3 + 2.0 * age) * (0.7 + 0.6 * h);
    float k = 1. - age / 3.;
    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    pos += (right * position.x + up * position.y) * size;
    vC = position.xy; vCol = vec4(aCol, ok * k * sqrt(k) * smoothstep(0., 0.25, age) * 0.3);
    gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.);
    if (vCol.a < 0.004) gl_Position = vec4(2., 2., 2., 1.);
  }
`,ka=`
  varying vec2 vC; varying vec4 vCol;
  ${Re}
  void main(){
    float r = length(vC), g = texture2D(uTooth, vC * 0.3 + vCol.rg * 2.3).r;
    float a = (1. - smoothstep(0.1, 1., r)) * vCol.a * 1.6 - g;                     // flecks of pigment, not a glow
    if (a < 0.) discard;
    gl_FragColor = vec4(vCol.rgb * 0.87, 1.);
  }
`;function Ma(p,g,z={}){const u=g.length,i=new n.InstancedBufferGeometry;i.setAttribute("position",new n.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]);const w=new Float32Array(u*3),h=new Float32Array(u*4),c=new Float32Array(u*3);g.forEach((D,R)=>{w.set(D.p,R*3),h.set([D.dir[0],D.dir[1],D.off||0,(R*.618034+.31)%1],R*4),c.set([D.c.r,D.c.g,D.c.b],R*3)}),i.setAttribute("aP",new n.InstancedBufferAttribute(w,3)),i.setAttribute("aDir",new n.InstancedBufferAttribute(h,4)),i.setAttribute("aCol",new n.InstancedBufferAttribute(c,3)),i.instanceCount=u;const m=new n.ShaderMaterial({vertexShader:ya,fragmentShader:ka,depthWrite:!1,uniforms:{...p.U,uWhich:{value:z.cloud??1},uRange:{value:new n.Vector2(...z.range||[-1e5,1e5])},uSpeed:{value:p.windSpeed}}}),y=new n.Mesh(i,m);return y.frustumCulled=!1,y}export{za as buildHero,va as makeStyle};
