import*as o from"three";import{mergeGeometries as te}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as dt,lerp as j,smoothstep as gt}from"../kit/core.js";import{makeRng as qe,hashSeed as Oe}from"../kit/core.js";const Ot=["#8E6A3A","#E6D3AA","#5C6078","#86C9B4","#F7F3E8","#C6D8E2","#C98A6B"],ke={horizon:"#EEF1EC",zenith:"#B7CEDD"},ie=42,Nt=(e,t,a=0)=>Math.sqrt(e*e+t*t+a*a),Ue=Math.cos(34*Math.PI/180),Ye=Math.tan(34*Math.PI/180);function pa(e=12,t=100){const a=e*Math.PI/180,u=t*Math.PI/180;return new o.Vector3(-Math.sin(u)*Math.cos(a),Math.sin(a),Math.cos(u)*Math.cos(a)).normalize()}const Ne=()=>({uWetC:{value:new o.Color(Ot[0])},uDryC:{value:new o.Color(Ot[1])},uShadeC:{value:new o.Color(Ot[2])},uSkyLo:{value:new o.Color(ke.horizon)},uSkyHi:{value:new o.Color(ke.zenith)},uSunDir:{value:new o.Vector3(.96,.21,.17).normalize()},uTime:{value:0},uT:{value:0},uDryClock:{value:.66},uWetY:{value:-1e3},uShBias:{value:.3},uInvTone:{value:0},uExposure:{value:1},uSea:{value:new o.Vector4(-1e5,-1e5,-1e3,-1e5)},uMoat:{value:[new o.Vector4(10,-1e3,10,-1e3),new o.Vector4(10,-1e3,10,-1e3),new o.Vector4(10,-1e3,10,-1e3)]},uMoatR:{value:new o.Vector3(340,258,193)},uCourt:{value:new o.Vector4(-1e5,-1e5,8.1,0)},uTs:{value:0},uMouthW:{value:new o.Vector4(0,-1e4,0,0)},uMouthN:{value:new o.Vector3(0,0,1)},uRipple:{value:1},uGlint:{value:1},uBleach:{value:1110},uShK:{value:.6},uFoamW:{value:new o.Color(Ot[4])}}),le={uniforms:Ne()},Pe=e=>new o.Matrix3().fromArray(e).invert().elements.map(t=>t.toFixed(6)).join(","),Ke=Pe([.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777]),Qe=Pe([1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602]),je=6.5,Ze=1,he=`
  uniform vec3 uWetC, uDryC, uShadeC, uSkyLo, uSkyHi, uSunDir;
  uniform float uTime, uT, uDryClock, uWetY, uInvTone, uExposure, uRipple, uBleach, uGlint, uShK;
  uniform vec4 uSea, uCourt, uMoat[3], uMouthW; uniform vec3 uMoatR, uMouthN;
  uniform vec3 uFoamW;
  float cbtH31(vec3 p){ p = fract(p*vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y)*p.z); }
  float cbtN3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(mix(cbtH31(i), cbtH31(i + vec3(1,0,0)), f.x), mix(cbtH31(i + vec3(0,1,0)), cbtH31(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(cbtH31(i + vec3(0,0,1)), cbtH31(i + vec3(1,0,1)), f.x), mix(cbtH31(i + vec3(0,1,1)), cbtH31(i + vec3(1,1,1)), f.x), f.y), f.z); }
  float cbtBleach(float dist){ return (1. - exp(-max(dist - clamp(700. - uBleach, 150., 200.), 0.)/max(uBleach, 1.)))*0.9; }      // nothing within 150 m, a third gone by 600 m (uBleach 1110); a fret (short uBleach) starts 200 m out
  // the sky of this world: a plain bleached gradient, used for sheen and mirrors too
  vec3 cbtSky(vec3 d){ float h = clamp(d.y, 0., 1.); vec3 c = mix(uSkyLo, uSkyHi, smoothstep(0., 1., sqrt(h)));
    // the horizon's chalk white is cleaner and a little brighter on the sun's side (no disc, no band of another colour)
    float sl = max(dot(d.xz, uSunDir.xz)/max(length(d.xz)*length(uSunDir.xz), 1e-4), 0.);
    return c*(1. + 0.08*sl*sl*(1. - smoothstep(0., 0.42, h))); }
  // inverse of the engine's filmic curve (only used when uInvTone = 1): display-linear colour -> scene value
  vec3 cbtToScene(vec3 D){
    vec3 y = clamp(mat3(${Qe})*clamp(D, 0., 0.95), 0.0004, 0.97);
    vec3 A = 0.983729*y - 1., B = 0.432951*y - 0.0245786, Cc = 0.238081*y + 0.000090537;
    vec3 v = (-B - sqrt(max(B*B - 4.*A*Cc, 0.)))/(2.*A);
    return max(mat3(${Ke})*v, 0.)*(0.6/max(uExposure, 0.05));
  }
  // THE LIE OF THE BEACH, shared by the sand and the water. The castle is a family of ovals round (0, 385), 0.76 as
  // wide as long: cbtOval = (oval radius, angle: 0 on the approach axis, positive to port = +X). cbtBase = the smooth
  // beach (falls 1 in 40 to port, lifts 1 in 60 to starboard; the court is a table at y 8). cbtLobes = the ragged,
  // lobed offset of every wet front in metres. cbtCourtRun = the order in which the court and nave flood.
  vec2 cbtOval(vec2 p){ vec2 q = vec2(p.x/0.76 + 1e-5, 385. - p.y); return vec2(length(q), atan(q.x, q.y)); }
  float cbtBase(vec2 p){ float b = p.x > 0. ? -p.x*0.025 - 1.4*smoothstep(3., 24., p.x) : min(-p.x/60., 5.); return max(b, -12.); }
  float cbtLobes(vec2 p){ return (cbtN3(vec3(p*0.09, 1.7)) - 0.5)*11. + (cbtN3(vec3(p*0.37, 5.1)) - 0.5)*3. + (cbtN3(vec3(p*1.3, 8.3)) - 0.5)*0.8; }
  float cbtCourtRun(vec2 p){ return (p.y - 250.) - 0.5*p.x; }
  // the crown of the ramp through gate 3 floods with the court (its wandering edges are the world's: the same sines);
  // beside the crown the moat and the sea keep their own water
  float cbtRamp(vec2 p, float rho){ float w = abs(p.x) + 0.6*sin(p.y*0.31 + (p.x > 0. ? 3.4 : 1.3)) + 0.4*sin(p.y*0.83 + (p.x > 0. ? 0.5 : 2.6)); return step(w, 5.25)*step(rho + 0.4*cbtLobes(p), 197.)*step(161., rho)*step(p.y, 385.); }
  // the highest water that has ever stood at this place (world y; -1000 = never), n = 0..1 wick noise
  float cbtWetLine(vec3 P, float n){
    vec2 o = cbtOval(P.xz); float lob = cbtLobes(P.xz), wl = -1000.;
    if (o.x < 161. || cbtRamp(P.xz, o.x) > 0.5) { if (cbtCourtRun(P.xz) + lob < uCourt.y) wl = (o.x < 161. ? uCourt.z + 0.15 : 9.4) + 0.7*n; }
    else {
      if (-P.x + lob < uSea.y) wl = max(cbtBase(P.xz) + 0.45, uSea.z) + 1.1*n;
      for (int i = 0; i < 3; i++) {
        float r = i == 0 ? uMoatR.x : i == 1 ? uMoatR.y : uMoatR.z;
        float dm = o.x - r; if (i == 2 && dm > 0.) dm *= 0.62;      // moat 3 is dug wider on its outer side
        if (abs(dm) < 10. + 0.45*lob) wl = max(wl, (o.y + lob*0.004 > uMoat[i].z ? uMoat[i].y : uMoat[i].w) + 0.3 + 1.7*n);      // (the damp band ends in lobes, never on an arc)
      }
    }
    return wl;
  }
  bool cbtCut = false;      // set by a material that cuts pixels away (the mound's mouth, the gaps between falling grains): a pixel that is cut is still carried to the last derivative, for its neighbours' sake, and is cut there; on the way it is spared whatever feeds no derivative
  // THE COLLAR ON A FACE. Where a front of the tide reaches the foot of a standing face (a turret's drum, a wall, a
  // moat's bank, the nave's wall) it leaves a bright foam line at the waterline, never taller than a quarter of a metre,
  // and above that a hand of lace whose holes run all the way down and which frays to nothing within a metre of the
  // waterline (a metre and a half inside the curtain: the mound's foot, the nave's walls). Never a white wall: nothing
  // above the foam line is whole. It reads the fronts the water itself reads (uSea, uCourt, uMoat) and nothing else:
  // f = metres behind the front here, hgt = metres above the water that stands or runs at this foot (gy = the level
  // of a swash's film on the sand at this foot, given by the caller; the sea's own level where that is higher). Returns the white.
  float cbtWick = 0.;      // the wick above the collar: how far the damp has climbed the face here (0..1), left by cbtCollar; the sand there is wet sand
  float cbtCollar(vec3 P, float ny, float fy, float gy){
    cbtWick = 0.;
    if (cbtCut || abs(ny) > 0.8) return 0.;      // (nor on a pixel that is cut: the collar takes no derivative and feeds none)
    vec2 o = cbtOval(P.xz); float f = -1., hgt = 1e3, run = 12., lob = cbtLobes(P.xz);
    if (o.x < 161.) { hgt = P.y - uCourt.z; f = uCourt.x - (cbtCourtRun(P.xz) + lob); run = 40.; }
    else {
      float hs = P.y - max(gy, uSea.z);
      if (hs < 4.) { hgt = hs; f = uSea.x - (-P.x + lob); }
      for (int i = 0; i < 3; i++) {
        float r = i == 0 ? uMoatR.x : i == 1 ? uMoatR.y : uMoatR.z;
        float dm = o.x - r; if (i == 2 && dm > 0.) dm *= 0.62;
        float fm = (o.y - uMoat[i].x)*r*0.8, hm = P.y - uMoat[i].y;
        if (abs(dm) < 9.5 && fm > 0. && hm < 4. && hm < hgt) { f = fm; hgt = hm; run = 60.; }
      }
    }
    if (hgt > 5.2 || f < 0.) return 0.;
    float hc = 1. + 2.*cbtN3(vec3(P.xz*0.21, 5.));
    // the damp wicks up the face above the foam and stays when the foam has fallen back; its upper edge is soft and follows the grain (teeth of 0.4 m and of 1.7 m)
    cbtWick = smoothstep(0., 0.1*run, f)*(1. - smoothstep(-0.2, 0.2, hgt - 1.25*hc - 0.5 - 0.7*(cbtN3(vec3(P.xz*0.6, P.y*0.5)) - 0.5) - 0.35*(cbtN3(P*2.3) - 0.5)))*(1. - smoothstep(0.6, 0.8, abs(ny)));
    float slap = 0.5 + 0.5*sin(uTime*1.3 + 6.2832*cbtN3(vec3(P.xz*0.07, 3.)));      // where the water stands, the swell still slaps the foot now and again
    float surge = smoothstep(0., 0.1*run, f)*(0.42 + 0.58*max(exp(-f/max(run, 1.)), 0.8*slap*slap));
    float edge = 1./max(fy*0.9, 0.02);                                           // (fy = this pixel's height on the face, taken by the caller)
    // the foam line: 0.05 to 0.25 m of whole white standing on the water
    float lineH = 0.25*surge*(0.5 + 0.5*cbtN3(vec3(P.xz*1.1, uTime*0.7)));
    float a = smoothstep(-1., 1., (lineH - hgt)*edge);
    // the lace above it: holes a quarter of a metre across from the waterline up, more of them the higher, nothing left at its top; it frays as the front goes on
    float top = (o.x < 161. ? 1.5 : 1.)*smoothstep(0., 0.1*run, f)*(0.55 + 0.45*max(exp(-f/max(run, 1.)), 0.8*slap*slap))*(0.6 + 0.4*cbtN3(vec3(P.xz*0.21, 5.)));
    float up = clamp(hgt/max(top, 0.05), 0., 1.), fray = smoothstep(0.3*run, 1.6*run, f);
    float lace = cbtN3(vec3((P.x + P.z)*3.1, P.y*4.2 + uTime*0.35, (P.z - P.x)*3.1));
    lace = mix(lace, 0.5, smoothstep(0.05, 0.16, fy));      // (under three pixels a hole gives way to its mean: far off the collar is the foam line and a breath of white over it, never a dotted fringe)
    a = max(a, smoothstep(0.46, 0.6, lace + 0.1 - 0.12*up - 0.08*fray)*(1. - smoothstep(0.55, 1., up))*smoothstep(-1., 1., (top - hgt)*edge));
    // (nothing of it lower than 0.6 m under the water)
    return a*step(-0.6, hgt)*(1. - smoothstep(0.6, 0.8, abs(ny)));
  }
  // THE HAND. One palm print per cell (7 x 9.6 m, three staggered layers; a print never reaches its cell's edge): a shallow bowl with four finger grooves.
  // q = (metres along the face, metres up it), fine = 0..1 keeps the grooves (0 when they are under three pixels).
  float cbtPalmSoft = 0.03;     // how soft a print's edges are, in the print's own coordinate: a pixel and a half of it (set by the material from the pixel's footprint before it asks for prints)
  float cbtPalm(vec2 q, float fine){
    float d = 0., sf = cbtPalmSoft;
    for (int k = 0; k < 3; k++) {
      vec2 A = q + float(k)*vec2(2.33, 3.2), c = floor(A/vec2(7.0, 9.6));
      float r = cbtH31(vec3(c, float(k)*7. + 3.)), r2 = fract(r*7.13), r3 = fract(r*13.7);
      vec2 l = A - (c + 0.5)*vec2(7.0, 9.6) + (vec2(r, r2) - 0.5)*vec2(0.3, 1.0);
      float t = (r3 - 0.5)*0.6, cs = cos(t), sn = sin(t), sz = 0.8 + 0.25*fract(r*31.7);
      vec2 u = vec2(l.x*cs + l.y*sn, -l.x*sn + l.y*cs)/(vec2(2.3, 3.5)*sz);
      if (abs(u.x) < 1. && abs(u.y) < 1. && fract(r*57.3) > 0.08) {
        // a pressed print is crisp: the heel a dish with a firm rim, the four fingers flat-floored grooves with firm sides
        // and rounded tips; every edge is as soft as a pixel and a half and no softer, so the print neither smears close to nor glitters far off
        vec2 hq = vec2(u.x/0.78, (u.y + 0.42)/0.52); float eh = dot(hq, hq), heel = 0.72*smoothstep(0., 0.62 + 2.*sf, 1. - eh);   // the heel of the hand
        float env = smoothstep(-0.2 - sf, -0.1 + sf, u.y)*(1. - smoothstep(0.66 + 0.2*cos(u.x*2.2) - sf, 0.8 + 0.2*cos(u.x*2.2) + sf, u.y))*(1. - smoothstep(0.74 - sf, 0.8 + sf, abs(u.x)));
        float fx = smoothstep(0.34 - sf, 0.6 + sf, 0.5 + 0.5*cos((u.x*2.5 + 0.5)*6.2832));                             // four fingers
        float fing = env*mix(0.14, 0.05 + fx*0.21, fine);
        d = max(d, max(heel, fing)*(0.75 + 0.25*r));
      }
    }
    return d;
  }
  // press a depth h (metres, positive = pushed in) into the surface: the normal it leaves (screen-space, no tangents)
  vec3 cbtBump(vec3 P, vec3 N, float h){
    vec3 dpx = dFdx(P), dpy = dFdy(P); float hx = dFdx(h), hy = dFdy(h);
    vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
    if (abs(det) < 1e-12) return N;
    vec3 g = (hx*r1 + hy*r2)/det;
    float gl = length(g); g *= min(1., 1.6/max(gl, 1e-4));                 // never past about 58 degrees
    vec3 n = N + g; return n/max(length(n), 1e-4);
  }
  // dribbled slurry: runnels and ridges running down a steep face (0 groove .. 1 ridge), lumps between them
  float cbtDrib(vec3 P, vec3 N){
    vec3 w = N*N; float wx = w.x/max(w.x + w.z, 1e-4);
    float wob = 0.7*cbtN3(vec3(P.y*0.16, P.x*0.21, P.z*0.21)) + 0.5*cbtN3(P*vec3(0.5, 0.2, 0.5));
    float a = 0.5 + 0.5*cos((P.z + wob)*4.6), b = 0.5 + 0.5*cos((P.x + wob)*4.6 + 1.7);
    return mix(b, a, smoothstep(0.25, 0.75, wx));
  }
  // THE ONE BAR OF SUN on the head wall. The sun grazes that wall at ten degrees, which no shadow map can draw
  // (a texel smears into two metres), so inside the zone round the mouth the light is worked out: the shaft through
  // the notch in the starboard arm, the shadow the pressed collar throws on the wall behind it, and the top of the
  // wall above the starboard crest's shadow. Returns (zone weight, lit).
  vec2 cbtHeadSun(vec3 P){
    if (uMouthW.w < 0.5) return vec2(0.);
    vec3 d = P - uMouthW.xyz, T = vec3(uMouthN.z, 0., -uMouthN.x); T /= max(length(T), 1e-4);
    float dn = dot(d, uMouthN), lat = dot(d, T);
    float zone = (1. - smoothstep(2.6, 4.6, dn))*smoothstep(-30., -27., dn)*(1. - smoothstep(24., 27., abs(lat)))*(1. - smoothstep(21., 24., d.y));
    if (zone < 0.001) return vec2(0.);
    vec2 sh2 = uSunDir.xz/max(length(uSunDir.xz), 1e-4);
    // ONE bar with clean edges: the notch's two sides, drawn out along the wall by the grazing sun, bound it left and
    // right (30 m, the ring and a little more); its top falls away from the sun at the sun's own slope; everything
    // else on the head wall is in the shade of the starboard file and the head's own spires
    float rag = (cbtN3(P*0.45) - 0.5)*0.5 + (cbtN3(P*1.7) - 0.5)*0.15;
    float ls = lat*sign(dot(T.xz, sh2) + 1e-5);                            // metres along the wall toward the sun
    float bar = 1. - smoothstep(18.4, 19.2, abs(lat) + rag);
    float tanE = uSunDir.y/max(length(uSunDir.xz), 1e-4);
    bar *= 1. - smoothstep(-0.4, 0.4, d.y - (15. + ls*tanE + rag));
    return vec2(zone, bar);
  }
  float cbtTide = 0.;           // (out of cbtWetnessY) 1 where the sand is wet because water has stood or run there
  float cbtRippled = 0.;        // 0..1, set by a material where it draws ripples: there the drying front follows the ripples' own crests, a clean ragged line, and is not broken up by islands as small as a ripple
  // THE RULE. Returns wetness 0 (dry, pale) or 1 (wet, dark), hard-edged along a ragged front.
  //  P world position, N unperturbed world normal, edge 0..1 = how much of an arris this is (dries first),
  //  age 0..1 = how recently it was wetted (1 = just now, cannot dry yet)
  float cbtWetnessY(vec3 P, float ny, float edge, float age){
    vec3 fq3 = fwidth(P); float fqm = max(max(fq3.x, fq3.y), fq3.z);      // this pixel's footprint in metres
    // (the teeth of a front are noise of 0.43 m and 1.1 m: each gives way to its mean when a tooth is under three pixels, so a far front is ragged, never dithered)
    float rag = cbtN3(P*0.55)*0.6 + mix(cbtN3(P*2.3), 0.5, smoothstep(0.07, 0.16, fqm))*0.4;
    float ph = fract(uTime*0.085 + cbtN3(P*0.13 + 21.)*2.3 + rag*0.25);
    float crust = smoothstep(0., 0.82, ph)*(1. - smoothstep(0.88, 1., ph));   // a crust dries out over the lip for ten seconds, then lets go
    float s = ny - ${Ue.toFixed(4)} + (rag - 0.5)*0.07 + 0.085*(crust - 0.45);   // steeper than 34 degrees: always wet
    float canDry = smoothstep(-1., 1., s/max(fwidth(s)*0.9, 0.002));
    float thr = cbtN3(P*0.21 + 9.)*0.55 + mix(cbtN3(P*0.9 + 4.), 0.5, max(smoothstep(0.18, 0.42, fqm), 0.75*cbtRippled))*0.3 + rag*0.15*(1. - 0.6*cbtRippled) - edge*0.55 + age*1.2;
    float c = uDryClock - thr;                                             // pale islands grow from arrises as the clock rises
    float dried = smoothstep(-1., 1., c/max(fwidth(c)*0.9, 0.004));
    float wk = cbtN3(vec3(P.xz*0.35, 3.));
    float wl = max(uWetY + 0.4 + 2.2*wk, cbtWetLine(P, wk)) - P.y;         // water line and its wick
    float above = 1. - smoothstep(-1., 1., wl/max(fwidth(wl)*0.9, 0.01));
    cbtTide = 1. - above;
    return 1. - canDry*dried*above;
  }
  float cbtWetness(vec3 P, vec3 N, float edge, float age){ return cbtWetnessY(P, N.y, edge, age); }
  // THE SHADING, for every surface of the world. base = pigment (linear), wet 0..1 (sheen), fresh 0..1 (glossy new
  // slurry), sh = 1 lit .. 0 in cast shadow. Grains resolve near the camera and average out with distance.
  float cbtGrainFar = 24.;      // metres within which single grains turn the light (a material may set it before shading)
  float cbtGrainK = 0.;         // the surface's own speckle (relative), set by a material so that shade keeps the grain as the sun does
  float cbtSheen = 0.;          // 0..1, set by a material: a flat the tide has wetted mirrors the sky at grazing angles
  float cbtDeep = 1.;           // 1 for sand (the deeper shade of wet sand in cast shadow); a material of another pigment sets it to 0
  vec3 cbtPrintD = vec3(0.);    // set by a material that presses palm prints: the face's own normal less the normal its prints leave (0 where no print is)
  float cbtPrintSh = 1.;        // and the cast shadow of that face before the print lays its own crescent of shade in it
  vec3 cbtShadeC(vec3 base, float wet, float fresh, vec3 P, vec3 N, float sh, float cav){
    vec3 fp = fwidth(P);      // (this pixel's footprint, for the glitter below: taken first and for every pixel, so that a pixel that is cut gives it to its neighbours and is shaded no further)
    if (cbtCut) return vec3(0.);
    vec3 V = cameraPosition - P; float dist = length(V); V /= max(dist, 1e-3);
    float gf = (1. - smoothstep(7., cbtGrainFar, dist))*(1. - 0.8*fresh), cf = 1. - smoothstep(60., 220., dist);
    vec3 cell = floor(P*27.);
    float r0 = cbtH31(cell);
    vec3 gn = vec3(r0, cbtH31(cell + 3.1), cbtH31(cell + 7.7)) - 0.5;
    vec3 cn = vec3(cbtN3(P*2.6), cbtN3(P*2.6 + 11.), cbtN3(P*2.6 + 23.)) - 0.5;
    vec3 n2 = N + gn*0.85*gf + cn*0.32*cf*(1. - 0.7*fresh); n2 /= max(length(n2), 1e-3);
    float ndl = dot(n2, uSunDir), big = dot(N, uSunDir);
    float ndt = mix(big, ndl, 0.4 + 0.6*gf);                             // grains decide the terminator near the camera, lumps count for less far off
    float lit = smoothstep(-0.07, 0.16, ndt)*smoothstep(-0.10, 0.04, big)*sh;
    float gk = ((r0 - 0.5)*0.17 - 0.3*step(0.94, cbtH31(cell + 5.9)))*gf + (cbtN3(P*0.8) - 0.5)*0.04;
    base *= 1. + gk;
    base *= 1. - 0.58*fresh;
    // one low sun: flats take the pigment as written, a face the sun meets squarely is brighter and faintly lemon,
    // a face it only grazes is duller, so every turret and blob has a lit side before its shadow side
    vec3 litC = base*(mix(0.76, 1., smoothstep(-0.02, 0.2, ndl)) + 0.14*(1. - 0.55*wet)*smoothstep(0.2, 0.8, ndl))*mix(vec3(1.), vec3(1.03, 1.015, 0.93), smoothstep(0.1, 0.6, ndl));
    litC *= mix(vec3(1.), vec3(1.012, 1.022, 0.95), smoothstep(0.1, 0.6, ndl));      // the lemon a little clearer against the slate (green rises with red, blue falls: never orange)
    float up = clamp(n2.y*0.5 + 0.5, 0., 1.);
    float fill = (0.6 + 0.45*up)*(1. - 0.52*cav);                        // the large soft sky draws the form inside a shadow: faces turned up are lighter, hollows darker
    float lum = dot(base, vec3(0.3, 0.5, 0.2));
    vec2 sh2 = uSunDir.xz/max(length(uSunDir.xz), 1e-4);
    fill *= 1. + 0.3*clamp(dot(n2.xz, sh2), -1., 1.);                     // (two tones of slate: the sky on the sun's side is the brighter half)
    // shade is drawn, not laid flat: every grain, speck and print the sun would show is there in two tones of slate
    fill *= 1. + 2.6*gk + 1.5*cbtGrainK + 0.55*step(0.95, cbtH31(cell + 2.3))*gf;
    vec3 shT = uShadeC*mix(vec3(0.9, 0.94, 1.13), vec3(1.), smoothstep(0.2, 0.55, lum));      // blue-violet over ochre, the brief's slate on pale sand
    vec3 shC = shT*(uShK*0.95 + 0.7*lum)*max(fill, 0.3);                  // slate laid over the sand's own colour
    shC += base*uShadeC*0.3*max(-dot(n2.xz, sh2), 0.)*(1. - up*0.5)*(1. - 0.3*cav);     // a little light handed back by the sunlit sand opposite
    // IN SHADE A PRINT ONLY DARKENS: where the face without its print would lie in shade, no part of the print (its rim,
    // its finger grooves) is paler than that face is beside it; tone on tone, two close tones of slate. Where the sun is
    // on the face (the bar on the head wall, any lit wall) the print is drawn as it was.
    float printK = 0., printFr = 0.;
    if (dot(cbtPrintD, cbtPrintD) > 1e-9) {
      vec3 Nf = N + cbtPrintD; Nf /= max(length(Nf), 1e-4);
      vec3 n0 = Nf + gn*0.85*gf + cn*0.32*cf*(1. - 0.7*fresh); n0 /= max(length(n0), 1e-3);
      float big0 = dot(Nf, uSunDir), up0 = clamp(n0.y*0.5 + 0.5, 0., 1.);
      float lit0 = smoothstep(-0.07, 0.16, mix(big0, dot(n0, uSunDir), 0.4 + 0.6*gf))*smoothstep(-0.10, 0.04, big0)*cbtPrintSh;
      float fill0 = (0.6 + 0.45*up0)*(1. + 0.3*clamp(dot(n0.xz, sh2), -1., 1.))*(1. + 2.6*gk + 1.5*cbtGrainK + 0.55*step(0.95, cbtH31(cell + 2.3))*gf);
      vec3 shC0 = shT*(uShK*0.95 + 0.7*lum)*max(fill0, 0.3) + base*uShadeC*0.3*max(-dot(n0.xz, sh2), 0.)*(1. - up0*0.5);
      printK = 1. - lit0;
      shC = mix(shC, min(shC, shC0), printK);
      printFr = 1. - max(dot(Nf, V), 0.); printFr *= printFr; printFr *= printFr;
    }
    // THE DARK: one further step of the same blue-violet, only where the sand is both wet and in cast shadow (the nave's
    // floor and lower faces, the shaded side of every wet wall and blob); its edges are the cast edges; never darker
    // than half the slate's value
    // (the floor bounds the deepening, never the shade itself: the step can only darken, and only down to the floor;
    // shade that is already at or under the floor, as on black sand, stays exactly as it was drawn)
    shC = min(shC, max(shC*(1. - 0.42*cbtDeep*clamp(wet, 0., 1.)*(1. - sh)), uShadeC*0.23));
    vec3 col = mix(shC, litC, lit);
    float fr = 1. - max(dot(N, V), 0.); fr *= fr; fr *= fr;
    if (printK > 0.) fr = mix(fr, min(fr, printFr), printK);      // (nor does a print's rim take more sky in shade than the face beside it)
    vec3 R = reflect(-V, N); R.y = abs(R.y);
    col = mix(col, cbtSky(R), min(fr*(0.34*wet + 0.4*fresh + 0.55*cbtSheen), 0.92));      // faint sheen of sky at grazing angles; a tide-wet flat is a mirror far off
    float sp = max(dot(R, uSunDir), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
    col += vec3(1., 0.98, 0.9)*sp*sp*fresh*sh*0.55;                     // wet gloss of a blob that has just landed
    float tw = smoothstep(0.2, 1., 0.5 + 0.5*sin(uTime*1.7 + r0*311.));
    col += vec3(1., 0.98, 0.92)*step(0.988, cbtH31(cell + 13.3))*tw*lit*(1. - wet)*(1. - smoothstep(6., 25., dist))*0.5;   // quartz glints
    // sand in a low sun glitters at any distance: sparks one to two pixels across (the cells grow with the pixel's
    // footprint, so nothing shimmers), each easing in and out on its own clock
    { float pm = max(max(fp.x, fp.y), fp.z);
      float lv = floor(log2(max(pm, 0.004)/0.004)), cs = 1./(0.0062*exp2(lv));
      vec3 gc = floor(P*cs) + lv*17.; float gh = cbtH31(gc), g2 = cbtH31(gc + 9.7);
      float tw2 = smoothstep(0.5, 1., 0.5 + 0.5*sin(uTime*(1.1 + 2.2*g2) + g2*97.));
      col += vec3(1., 0.98, 0.9)*step(0.98, gh)*tw2*lit*(0.17 + 0.15*wet)*clamp(0.08 + 2.4*lum, 0., 1.)*uGlint; }
    col = mix(col, uSkyLo, cbtBleach(dist));     // distance bleaches: a third gone by 600 m
    return uInvTone > 0.5 ? cbtToScene(col) : col;
  }
  vec3 cbtShade(vec3 base, float wet, float fresh, vec3 P, vec3 N, float sh){ return cbtShadeC(base, wet, fresh, P, N, sh, 0.); }
`,Te=`
  vec3 cbtDrip(vec3 land, vec3 ball, vec3 nLand, vec2 inst, float T, out vec3 nrm, out float fresh, out float age, out float lift){
    float t = T - inst.x;
    float air = clamp(-t/4.5, 0., 1.), vis = step(-4.5, t);
    float s = clamp(t/0.7, 0., 1.); s = 1. - (1. - s)*(1. - s);
    float sag = smoothstep(0.1, 3.8, t);
    vec3 wob = ball*(1. + 0.07*sin(T*5.3 + inst.y*40. + ball.y*3.));
    float tau = 1. - air;                                                              // 0 let go .. 1 landed
    wob.xz *= 1. - 0.82*smoothstep(0., 1., ball.y); wob.y *= ball.y > 0. ? 1.7 + 2.6*tau : 1.;   // a teardrop with a tail that draws out as it gathers speed
    vec3 L = land;
    L.y = land.y < 0. ? land.y*mix(0.2, 1., sag) : land.y*(1. + 0.3*(1. - sag));       // the skirt creeps down, the crown settles
    L.xz *= mix(0.86, 1., sag) + 0.27*sin(s*3.14159)*(1. - sag); L.y *= 1. - 0.24*sin(s*3.14159)*(1. - sag);      // the splat: out and flat for a moment
    vec3 nb = ball + vec3(0., 1e-3, 0.); nb /= max(length(nb), 1e-4);
    vec3 nm = mix(nb, nLand, s); nrm = nm/max(length(nm), 1e-4);
    lift = (1. - 0.3*tau - 0.7*tau*tau)*150.*step(1e-4, air);                         // it falls as things fall: slow at the top, fast at the bottom (let go 150 m up: above any frame of the approach)
    fresh = (1. - smoothstep(1.5, 9., t));
    age = 1. - smoothstep(7., 24., t);
    return mix(wob, L, s)*vis;
  }
`,De=`
  vec3 cbtSlump(vec3 pos, vec3 fan, vec2 sl, float ts, out float k, out float st, out float h){
    st = ts - sl.x; h = clamp((pos.y - fan.y)/10., 0., 1.);
    #ifdef USE_INSTANCING
      st += 0.03*clamp(pos.x, -7., 7.);
      float S = -7. + 23.*smoothstep(-0.8, 3.4, st);            // how far it has sat down (the side that went first is lower: the rim tilts)
      k = smoothstep(pos.y - 0.5, pos.y + 3.0, S);               // what reaches the ground runs out into the fan (nothing, until it starts); above it the drum stays a drum
      vec3 q = pos; q.y -= max(S, 0.); q.xz *= 1. + 0.05*smoothstep(0., 2., st);
      vec3 fn = fan - vec3(0., sl.y, 0.); fn.xz *= mix(0.42, 1., smoothstep(0.2, 4.8, st));      // the skirt runs out as the drum comes down
      return mix(q, fn, k);
    #else
      k = clamp((st - 0.9*h)/2.6, 0., 1.); k = k*k*(3. - 2.*k);
      return mix(pos, fan - vec3(0., sl.y, 0.), k);
    #endif
  }
`,$e=`
  #include <common>
  #include <shadowmap_pars_vertex>
  uniform float uShBias, uT, uTs; uniform vec3 uSunDir;
  attribute vec2 aD;
  #ifdef TINT
    attribute vec4 aTint; varying vec4 vTint;
  #endif
  #ifdef DRIP
    attribute vec3 aBall; attribute vec2 aLand; varying float vAir;
    ${Te}
  #endif
  #ifdef SLUMP
    attribute vec3 aFan, aFanN; attribute vec2 aSlump;
    ${De}
  #endif
  #ifdef BUCKET
    attribute vec2 aFoot; varying vec3 vSunL, vBk;
  #endif
  varying vec3 vW, vN, vD, vL, vNs; varying vec4 vSh;
  void main(){
    vec3 p = position, n = normal; float fresh = 0., age = aD.y, lift = 0.;
    #ifdef SLUMP
      float sk, st, sh_;
      { p = cbtSlump(position, aFan, aSlump, uTs, sk, st, sh_);
        n = mix(normal, aFanN, sk); n /= max(length(n), 1e-4);
        float wetS = smoothstep(-3., -0.3, st)*(1. - smoothstep(0.12, 0.5, sh_ - 0.27*max(st, 0.)));          // the foot darkens before it goes, and the dark climbs the drum as it rides down
        #ifdef USE_INSTANCING
          wetS *= 1. - smoothstep(2.0, 3.2, st - 1.0*(1. - sh_));                         // what was the dry top lies pale on the fan; its margin stays dark a while
          fresh = max(sk, 0.75*wetS*(1. - sh_))*wetS;
        #else
          fresh = sk*(1. - smoothstep(5., 16., st));
        #endif
        age = max(age, wetS); }
    #endif
    #ifdef DRIP
      p = cbtDrip(position, aBall, normal, aLand, uT, n, fresh, age, lift);
      vAir = step(1e-3, lift);
    #endif
    vL = p;
    vec4 lp = vec4(p, 1.); vec3 ln = n;
    #ifdef USE_INSTANCING
      lp = instanceMatrix*lp; ln = mat3(instanceMatrix)*ln;
    #endif
    vec4 wp = modelMatrix*lp; wp.y += lift;
    vec3 wn = mat3(modelMatrix)*ln; wn /= max(length(wn), 1e-5);
    vW = wp.xyz; vN = wn; vD = vec3(aD.x, age, fresh);
    #ifdef BUCKET
      vSunL = uSunDir; vBk = vec3(0., aFoot);      // aFoot = where the ground meets the cast, outside and inside the wall (local y)
      #ifdef USE_INSTANCING
        vSunL = uSunDir*mat3(modelMatrix*instanceMatrix);      // the sun in the turret's own frame
      #endif
      #ifdef SLUMP
        vBk.x = sk;
      #endif
    #endif
    #ifdef TINT
      vTint = aTint;
    #endif
    vSh = vec4(0.); vNs = vec3(0., 0., 1.);
    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
      vec3 so = wn*uShBias;
      #ifdef SUNSHIFT
        so += uSunDir*(1.5*(1. - abs(wn.y)));      // upright faces the low sun grazes are looked up a little toward it: no blotches of self-shadow
      #endif
      vSh = directionalShadowMatrix[0]*(wp + vec4(so, 0.));
      vNs = transpose(inverse(mat3(directionalShadowMatrix[0])))*wn;      // this surface's normal in the shadow map's own space
    #endif
    gl_Position = projectionMatrix*viewMatrix*wp;
  }
`,Xe=`
  #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
    float cbtRow(vec2 b, float dx, vec4 w, float z, float gz){
      return w.x*texture2DCompare(directionalShadowMap[0], b, z) + w.y*texture2DCompare(directionalShadowMap[0], b + vec2(dx, 0.), z + gz)
           + w.z*texture2DCompare(directionalShadowMap[0], b + vec2(2.*dx, 0.), z + 2.*gz) + w.w*texture2DCompare(directionalShadowMap[0], b + vec2(3.*dx, 0.), z + 3.*gz);
    }
    vec4 cbtBsp(float f){ float f2 = f*f, f3 = f2*f; return vec4((1. - f)*(1. - f)*(1. - f), 3.*f3 - 6.*f2 + 4., -3.*f3 + 3.*f2 + 3.*f + 1., f3)/6.; }
  #endif
  // ns = the receiver's normal in shadow-map space (vNs of the sand vertex shader); pass vec3(0.) to have the slope
  // measured from screen derivatives instead (fine on one flat sheet such as the water)
  float cbtSunN(vec4 sc, vec3 ns){
    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
      vec3 c = sc.xyz/max(sc.w, 1e-4);
      vec3 cx = dFdx(c), cy = dFdy(c);
      if (c.x < 0.003 || c.x > 0.997 || c.y < 0.003 || c.y > 0.997 || c.z > 1.) return 1.;
      float det = cx.x*cy.y - cx.y*cy.x; det = abs(det) < 1e-12 ? 1e-12 : det;
      vec2 g = clamp(vec2(cy.y*cx.z - cx.y*cy.z, cx.x*cy.z - cy.x*cx.z)/det, -5., 5.);   // depth slope of this surface per unit of map uv
      if (dot(ns, ns) > 1e-12) { float nz = abs(ns.z) < 1e-6 ? (ns.z < 0. ? -1e-6 : 1e-6) : ns.z; g = clamp(-ns.xy/nz, -5., 5.); }   // from the normal: no jump at triangle edges
      vec2 sz = directionalLightShadows[0].shadowMapSize;
      vec2 uv = c.xy*sz - 0.5, f = fract(uv), b = (floor(uv) - 0.5)/sz, d = 1./sz;
      float z = c.z + directionalLightShadows[0].shadowBias + dot(g, b - c.xy) - 0.6*(abs(g.x)*d.x + abs(g.y)*d.y);
      vec4 wx = cbtBsp(f.x), wy = cbtBsp(f.y); vec2 gd = g*d;
      return wy.x*cbtRow(b, d.x, wx, z, gd.x) + wy.y*cbtRow(b + vec2(0., d.y), d.x, wx, z + gd.y, gd.x)
           + wy.z*cbtRow(b + vec2(0., 2.*d.y), d.x, wx, z + 2.*gd.y, gd.x) + wy.w*cbtRow(b + vec2(0., 3.*d.y), d.x, wx, z + 3.*gd.y, gd.x);
    #else
      return 1.;
    #endif
  }
  float cbtSun(vec4 sc){ return cbtSunN(sc, vec3(0.)); }
`,Je=`
  #include <common>
  #include <packing>
  #include <shadowmap_pars_fragment>
  ${he}
  ${Xe}
  varying vec3 vW, vN, vD, vL, vNs; varying vec4 vSh;
  #ifdef BUCKET
    varying vec3 vSunL, vBk;
  #endif
  #ifdef TINT
    varying vec4 vTint;
  #endif
  #ifdef DRIP
    varying float vAir;
  #endif
  #ifdef HOLE
    uniform vec4 uHole;       // local x, y, z of the mouth centre and its radius
  #endif
  void main(){
    #ifdef HOLE
      // (the round mouth is decided here and cut further down, straight after the shading: the shading takes this pixel's
      // footprint by a derivative, and a derivative taken after a cut is not defined for the pixels round the hole)
      cbtCut = length(vL.xy - uHole.xy) < uHole.w && vL.z < uHole.z + 3. && vL.z > uHole.z - 12.;
    #endif
    vec3 N = vN/max(length(vN), 1e-5); if (!gl_FrontFacing) N = -N;
    float sh = cbtSunN(vSh, vNs);
    #ifdef SUNSHIFT
      sh = mix(sh, smoothstep(0.3, 0.7, sh), 1. - smoothstep(0.3, 0.7, abs(vN.y)/max(length(vN), 1e-4)));      // upright faces of the outworks are passed at nine metres: their cast shadows get a clean edge
    #endif
    vec2 hs = cbtHeadSun(vW); sh = mix(sh, hs.y, hs.x);
    float edge = max(vD.x, 0.), cav = 0., gouge = 0., patTop = 0., grainH = 0., arris = 0.;
    vec3 Ng = N;
    vec3 fpw = fwidth(vW); float pm = max(max(fpw.x, fpw.y), fpw.z);
    #ifdef HAND
      { // every steep face keeps the palm that patted it; round the mouth the gouges of the arm that scooped it
        // (a print is laid by the face's own directions: along it and up it. Up a face that leans further back than about fifty degrees the
        // upright coordinate would draw a print out to half as long again or more, so such a face keeps none)
        float steep = 1. - smoothstep(0.5, 0.72, abs(N.y)), fine = 1. - smoothstep(0.1, 0.3, pm), keep = 1. - smoothstep(0.5, 1.4, pm);      // (a print is 4.6 m across: it is on its way to its mean under nine pixels and is the mean under three and a half, so a far wall never beats into stripes)
        cbtPalmSoft = clamp(1.5*pm/2.3, 0.02, 0.45);
        vec3 w2 = N*N; float wx = w2.x/max(w2.x + w2.z, 1e-4);
        float hp = mix(cbtPalm(vec2(vW.x, vW.y*1.04), fine), cbtPalm(vec2(vW.z + 31., vW.y*1.04 + 2.), fine), smoothstep(0.3, 0.7, wx));
        // the lip of each print nearest the sun lays a crescent of shade inside it, so a face the sun meets squarely is still drawn
        vec2 sT = mix(uSunDir.xy, uSunDir.zy, smoothstep(0.3, 0.7, wx)); sT *= 0.7/max(length(sT), 1e-4);
        float hpS = hp;
        if (!cbtCut && steep*keep > 0.02) hpS = mix(cbtPalm(vec2(vW.x, vW.y*1.04) + sT, fine), cbtPalm(vec2(vW.z + 31., vW.y*1.04 + 2.) + sT, fine), smoothstep(0.3, 0.7, wx));
        #ifdef RIPPLE
          { // patted tops: the walls' tops and the crown of the ramp keep the palm too (plan coordinates)
            vec2 ov = cbtOval(vW.xz); float flatT = smoothstep(0.84, 0.94, abs(N.y));
            float rampT = (1. - smoothstep(4.0, 5.2, abs(vW.x)))*smoothstep(157., 163., ov.x)*(1. - smoothstep(208., 216., ov.x))*step(vW.z, 385.);
            patTop = flatT*max(rampT, smoothstep(3.4, 4.4, vW.y - cbtBase(vW.xz))*smoothstep(161., 165., ov.x))*(1. - smoothstep(0.7, 1.8, pm));
            if (patTop > 0.02) { vec2 s2 = uSunDir.xz*(0.8/max(length(uSunDir.xz), 1e-4));
              float ht = cbtPalm(vW.xz*vec2(1.15, 1.) + vec2(1.3, 17.), fine), htS = cbtPalm((vW.xz + s2)*vec2(1.15, 1.) + vec2(1.3, 17.), fine);
              hp = mix(hp, ht, patTop); hpS = mix(hpS, htS, patTop); }
            steep = max(steep, patTop); }
        #endif
        float cres = smoothstep(0.05, 0.17, hp - hpS)*(1. - smoothstep(0.5, 0.9, hp))*steep*keep*(1. - hs.x*(1. - hs.y));      // (inside the worked-out light of the head wall only where the bar of sun lies: there it draws the prints; never in its worked-out shade)
        cbtPrintSh = sh;
        sh *= 1. - 0.85*cres;
        vec3 md = vW - uMouthW.xyz, mT = vec3(uMouthN.z, 0., -uMouthN.x);
        float mx = dot(md, mT); mx = abs(mx) < 1e-4 ? 1e-4 : mx; float mr = length(vec2(mx, md.y)), mth = atan(md.y, mx);
        // six furrows an arm dragged toward the mouth: each starts between two shells, widest at the collar, and tapers
        // to nothing within two ring radii; ragged edges; the floor lies in the shade of its sunward lip (a cast shadow
        // like any other, never darker), the lip away from the sun catches the light
        float mz = uMouthW.w*smoothstep(9.9, 11.4, mr)*(1. - smoothstep(22., 26., mr))*smoothstep(-24., -15., dot(md, uMouthN))*(1. - smoothstep(4., 8., dot(md, uMouthN)));
        float gW = mix(1.7, 0.14, smoothstep(11., 25., mr)), gRag = 0.34*(cbtN3(vec3(mx, md.y, 5.)*0.8) - 0.5) + 0.13*(cbtN3(vec3(mx, md.y, 9.)*2.7) - 0.5);
        float gph = cos(mth*3. + 0.4 + 0.9*(cbtN3(vec3(mx, md.y, 2.)*0.12) - 0.5)), gLat = mr*abs(gph)/3. + gRag, gg = 1. - smoothstep(0.3*gW, gW, gLat);
        vec2 gS = vec2(dot(uSunDir, mT), uSunDir.y); gS *= 0.45/max(length(gS), 1e-4);                     // 0.45 m toward the sun, in the wall's plane
        float mxS = mx + gS.x; mxS = abs(mxS) < 1e-4 ? 1e-4 : mxS; float mrS = length(vec2(mxS, md.y + gS.y)), mthS = atan(md.y + gS.y, mxS);
        float ggS = gg; if (!cbtCut) ggS = 1. - smoothstep(0.3*gW, gW, mrS*abs(cos(mthS*3. + 0.4 + 0.9*(cbtN3(vec3(mxS, md.y + gS.y, 2.)*0.12) - 0.5)))/3. + gRag);
        float gFloor = max(smoothstep(0.55, 0.9, gg), smoothstep(0.06, 0.3, gg - ggS)), gLip = smoothstep(0.08, 0.35, ggS - gg)*(1. - smoothstep(0.75, 1., gg));
        hp = mix(hp, max(hp*(1. - gg), gg*0.42), mz); gouge = mz*keep*gLip; sh *= 1. - 0.96*mz*keep*gFloor;
        { float lvh = log2(max(pm, 0.008)/0.008), l0h = floor(lvh), c0h = 1./(0.021*exp2(l0h));
          float spk = mix(cbtH31(floor(vW*c0h) + l0h*13.), cbtH31(floor(vW*c0h*0.5) + (l0h + 1.)*13.), lvh - l0h);
          grainH = ((spk - 0.5)*0.3 - 0.18*step(0.9, spk) + 0.13*step(spk, 0.07))*(1. - smoothstep(0.1, 0.24, pm));
          grainH += 0.42*gouge;                                                                                  // the lip away from the sun catches the light
          cbtGrainFar = 36.; }
        cav = min(hp*steep*keep, 2.);
        cbtPrintD = N;
        N = cbtBump(vW, N, cav*mix(0.62, 1.1, mz));
        cbtPrintD = cbtPrintD - N;
        cav = min(cav + 0.7*cres, 2.);      // in shade the same crescent is the darker of two tones of slate
      }
    #endif
    N = N + uSunDir*(0.5*hs.x*hs.y); N /= max(length(N), 1e-4);      // inside the bar the collar is turned a little to the sun, like its shells
    float freshB = vD.z, ageB = vD.y, grainB = grainH;
    #ifdef BUCKET
      { // A BUCKET CAST, seen from nine metres. vL = the turret's own space (y up from its foot), vSunL the sun there.
        float keepB = (1. - vBk.x)*(1. - smoothstep(0.3, 0.7, pm));                       // not while it sits down, nor when it is a few pixels tall
        float ang = atan(vL.z, vL.x + 1e-5), rad = max(length(vL.xz), 0.5), hy = vL.y;
        float sideF = (1. - smoothstep(0.35, 0.6, abs(Ng.y)))*keepB;
        vec2 er = vec2(cos(ang), sin(ang)), sl2 = vSunL.xz/max(length(vSunL.xz), 1e-4);
        float tS = dot(sl2, vec2(-er.y, er.x)), rS = max(dot(sl2, er), 0.07), sg = tS < 0. ? -1. : 1.;
        // the sand it is made of: a speckle of pale and dark about three pixels across at whatever distance we pass
        float lv = log2(max(pm, 0.008)/0.008), l0 = floor(lv), c0 = 1./(0.021*exp2(l0));
        float spk = mix(cbtH31(floor(vL*c0) + l0*13.), cbtH31(floor(vL*c0*0.5) + (l0 + 1.)*13.), lv - l0);
        grainB = ((spk - 0.5)*0.34 - 0.2*step(0.9, spk) + 0.15*step(spk, 0.07))*keepB*(1. - smoothstep(0.1, 0.24, pm));
        // two mould seams, a bead a hand proud from foot to rim: the low sun lays a slate line beside each
        float sS = rad*er.y*(er.x > 0. ? 1. : -1.), seamOn = sideF*(1. - smoothstep(12.2, 12.7, hy));
        float bead = exp(-sS*sS/0.07);
        float ls = max(min(0.34*abs(tS)/rS, 1.6), 2.2*pm), sd = -sS*sg;
        float seamSh = smoothstep(0.1, 0.24, sd)*(1. - smoothstep(0.2 + ls, 0.38 + ls, sd))*seamOn;
        // the rim ring, the step the bucket's base left under the top, lying in its own shade
        float rw = max(0.13, 1.4*pm), ring = (1. - smoothstep(rw*0.6, rw, abs(hy - 11.35)))*sideF;
        // each notch of the rim throws a short tooth down the face
        float an = (fract(ang/0.7853982 + 0.5) - 0.5)*0.7853982*rad, sn = -an*sg;
        float ln = clamp(0.95*abs(tS)/rS, 0.5, 1.7)*clamp((hy - 12.2)/1.3, 0., 1.);
        float tooth = smoothstep(0.3, 0.45, sn)*(1. - smoothstep(0.3 + ln, 0.45 + ln, sn))*step(12.2, hy)*sideF;
        sh *= 1. - 0.92*max(max(seamSh, ring*0.85), tooth);
        N = cbtBump(vW, N, (-0.26*bead*seamOn + 0.15*ring + (cbtN3(vL*1.1 + 3.) - 0.5)*0.14)*keepB);
        // the lowest two metres have drawn water up: darker, glossy, along a ragged line
        vec2 toC = vec2(0., 385.) - vW.xz; toC /= max(length(toC), 1e-3);
        float wd = mix(vBk.y, vBk.z, smoothstep(-0.25, 0.25, dot(Ng.xz, toC))) + 0.9 + 1.0*(cbtN3(vec3(vL.xz*0.33, 2.)) - 0.5) + 0.4*(cbtN3(vec3(vL.xz*1.5, 7.)) - 0.5) - hy;
        float wick = smoothstep(-1., 1., wd/max(fwidth(wd)*0.9, 0.02))*sideF;
        freshB = max(freshB, 0.45*wick); ageB = max(ageB, wick);
        cbtGrainFar = 36.;
        // edges draw themselves in biscuit: the rim, its notches and the two seam beads have dried to a ragged pale line
        { float fe = fwidth(vD.x), eth = clamp(0.8 - 2.*fe, 0.3, 0.8) + (cbtN3(vL*1.7 + 5.) - 0.5)*0.2;
          arris = smoothstep(-1., 1., (vD.x - eth)/max(fe*0.9, 0.01))*keepB*(1. - wick)*(1. - smoothstep(0.1, 0.5, vD.y)); }
      }
    #endif
    #ifdef DRIB
      float ridge = cbtDrib(vW, Ng), capS = 0.;
      { // dribbled slurry: runnels down every flank, lumps between them; fades under three pixels
        float flank = 1. - smoothstep(0.45, 0.9, Ng.y), keep = 1. - smoothstep(0.12, 0.4, pm);
        float lump = cbtN3(vW*0.8 + 7.);
        cav = (1. - ridge)*flank*keep*smoothstep(0.25, 0.7, cbtN3(vW*0.23 + 5.));      // dribbles come in patches
        N = cbtBump(vW, N, (cav*0.17 + (lump - 0.5)*0.5*keep));
        cav *= 0.7;
      }
    #endif
    #ifdef RIPPLE
      { // wind and swash ripples on every flat: real little ridges for the one light, crests drying first.
        // Finer than about three pixels they are replaced by their average (nothing shimmers).
        float flat_ = smoothstep(0.90, 0.985, N.y)*uRipple*(1. - patTop);
        vec2 rp = vW.xz + 2.4*vec2(cbtN3(vec3(vW.xz*0.06, 2.)), cbtN3(vec3(vW.xz*0.06, 7.))) + 0.5*cbtN3(vec3(vW.xz*0.31, 4.));
        float ph = rp.x*1.02 + rp.y*0.29 + 1.6*cbtN3(vec3(vW.xz*0.045, 9.));
        float fw = fwidth(ph), keep = flat_*(1. - smoothstep(0.1, 0.26, fw));      // (a ripple under about six pixels is on its way to its mean; under four it is the mean)
        float sn = sin(ph*6.2832), cs = cos(ph*6.2832);
        float steep = 0.5 + 0.5*sn;                                                       // asymmetric: a long back and a short lee
        // and the long bars the backwash leaves, nine metres apart, which carry the pattern into the middle distance
        float ph2 = vW.x*0.105 + vW.z*0.024 + 2.2*cbtN3(vec3(vW.xz*0.017, 5.));
        float fw2 = fwidth(ph2), keep2 = flat_*(1. - smoothstep(0.12, 0.3, fw2));
        float sn2 = sin(ph2*6.2832), cs2 = cos(ph2*6.2832);
        N = N + vec3(0.74, 0., 0.21)*(-cs*(0.15 + 0.13*steep)*keep - cs2*0.12*keep2); N /= max(length(N), 1e-4);
        edge = max(edge, max(keep*smoothstep(0.1, 0.9, sn)*0.6, keep2*smoothstep(0.2, 0.9, sn2)*0.5)) - keep*smoothstep(0.2, 0.95, -sn)*0.22 - keep2*smoothstep(0.3, 0.95, -sn2)*0.3;
        cbtRippled = keep;
      }
    #endif
    #ifdef TINT
      if (vD.x > 1.5) { N = N + uSunDir*1.25; N /= max(length(N), 1e-4); }   // the cockles of the ring are turned to the shaft of sun
      float gl = clamp(vTint.a - 1., 0., 1.);                          // aTint.a above 1 = glassy: smooth, glossy, no grains
      cbtDeep = 0.;
      vec3 col = cbtShade(vTint.rgb/(1. - 0.58*gl), min(vTint.a, 1.), gl, vW, N, sh);   // any other pigment of the world, same light
      #ifdef HOLE
        if (cbtCut) discard;      // (the mouth, cut here: no derivative is taken below)
      #endif
    #else
      #ifdef DRIB
        // every blob shows both states: its top third has dried to a pale cap with a ragged edge that runs further
        // down the ridges between the runnels; the overhung flank stays dark (vD.x = baked cap weight)
        { float cph = fract(uTime*0.085 + cbtN3(vW*0.13 + 21.)*2.3);                      // the cap's edge creeps down as it dries, then lets go
          capS = 0.3*(smoothstep(0., 0.82, cph)*(1. - smoothstep(0.88, 1., cph)) - 0.5); }
        capS += vD.x + (cbtN3(vW*0.9 + 3.) - 0.5)*0.5 + (cbtN3(vW*3.1) - 0.5)*0.16 + (ridge - 0.5)*0.3*(1. - smoothstep(0.12, 0.4, pm));
        float lie = Ng.y > -0.12 ? max(Ng.y, 0.42 + 0.75*capS) : Ng.y;
        float w = cbtWetnessY(vW, lie, 0.75, vD.y);
        { // where a crust is letting go, its grains run down the runnels of the dark flank below: pale dashes, a hand wide
          float gph = fract(uTime*0.085 + cbtN3(vW*0.13 + 21.)*2.3 + 0.1), go = (1. - smoothstep(0.5, 0.62, gph))*smoothstep(0., 0.04, gph);
          float dash = smoothstep(0.52, 0.66, cbtN3(vec3(vW.x*2.6, vW.y*0.8 + uTime*2.6, vW.z*2.6)))*smoothstep(0.4, 0.7, 1. - ridge);
          w *= 1. - go*dash*(1. - smoothstep(0.45, 0.9, Ng.y))*step(-0.35, Ng.y)*(1. - smoothstep(0.12, 0.4, pm))*(1. - vD.z); }
        vec3 col = cbtShadeC(mix(uDryC, uWetC, w), w, vD.z, vW, N, sh, cav);
        #ifdef HOLE
          if (cbtCut) discard;      // (the mouth, cut here: no derivative is taken below)
        #endif
        #ifdef DRIP
          // a gobbet in the air: wet and dark, with the low sun bright along its sunward edge
          col = mix(col, mix(uDryC, vec3(1.), 0.3), 0.85*vAir*smoothstep(0.35, 0.75, dot(N, uSunDir)));
        #endif
      #else
        float w = cbtWetness(vW, abs(Ng.y) > 0.86 ? N : Ng, edge, ageB);
        #ifdef RIPPLE
          { // a wall's crest and the edge of the causeway's crown are pale ragged lines; flats the tide has wetted mirror the sky
            float fe = fwidth(vD.x), eth = clamp(0.62 - 2.*fe, 0.3, 0.62) + (cbtN3(vW*1.3 + 5.) - 0.5)*0.3;
            arris = smoothstep(-1., 1., (vD.x - eth)/max(fe*0.9, 0.01))*smoothstep(0.45, 0.8, vW.y - cbtBase(vW.xz))*(1. - smoothstep(0.1, 0.5, ageB))*(1. - cbtTide);
            float ovx = cbtOval(vW.xz).x, dry_ = smoothstep(-0.6, 0.6, -vW.x + cbtLobes(vW.xz) - uSea.x);      // (not under the sheet itself: there the water is the mirror)
            cbtSheen = cbtTide*smoothstep(0.93, 0.99, Ng.y)*dry_*step(161., ovx)*(1. - cbtRamp(vW.xz, ovx)); }
        #endif
        w *= 1. - arris; cbtGrainK = grainB;
        #if defined( HAND ) || defined( BUCKET )
          // the foot of this face where a front has reached it (walls, banks, turrets, the mound): the damp that has wicked
          // up it makes the sand there wet sand, before any light falls on it (the darker ochre in the sun, the wet slate in shade)
          float footY = cbtBase(vW.xz) + 0.1;
          #ifdef BUCKET
            { // (a bucket cast knows where the ground meets it: the film lies on that ground, and no higher over the
              // beach than the water's own sheet is laid: the sheet's rule, ground + 0.06 held under the beach + 0.45)
              vec2 toF = vec2(0., 385.) - vW.xz; toF /= max(length(toF), 1e-3);
              footY = min(vW.y - (vL.y - mix(vBk.y, vBk.z, smoothstep(-0.25, 0.25, dot(Ng.xz, toF)))) + 0.06, cbtBase(vW.xz) + 0.45); }
          #endif
          float cl = cbtCollar(vW, Ng.y, fpw.y, footY);
          w = max(w, cbtWick);
        #endif
        vec3 col = cbtShadeC(mix(uDryC, uWetC, w)*(1. + grainB)*(1. - 0.8*clamp(-vD.x, 0., 1.)), w, freshB, vW, N, sh, cav);
        #ifdef HOLE
          if (cbtCut) discard;      // (the mouth, cut here: no derivative is taken below)
        #endif
        #if defined( HAND ) || defined( BUCKET )
          // and the white collar the front leaves there (in cast shadow it is the foam's own shaded white)
          if (cl > 0.001) { vec3 fc = mix(mix(uShadeC*2.1, uFoamW, 0.35), uFoamW, sh); col = mix(col, mix(fc, uSkyLo, cbtBleach(length(cameraPosition - vW))), cl); }
        #endif
      #endif
    #endif
    gl_FragColor = vec4(col, 1.);
  }
`;function ta(e={}){const t={};e.tint&&(t.TINT=1),e.drip&&(t.DRIP=1),e.slump&&(t.SLUMP=1),e.ripple&&(t.RIPPLE=1),e.hand&&(t.HAND=1),e.drib&&(t.DRIB=1),e.bucket&&(t.BUCKET=1),e.sunShift&&(t.SUNSHIFT=1);const a={...o.UniformsUtils.clone(o.UniformsLib.lights),...e.uniforms??le.uniforms};return e.hole&&(t.HOLE=1,a.uHole={value:e.hole}),new o.ShaderMaterial({uniforms:a,defines:t,vertexShader:$e,fragmentShader:Je,lights:!0,side:e.side??o.FrontSide})}function ea(e=le.uniforms){return new o.ShaderMaterial({uniforms:{uTs:e.uTs},vertexShader:`
      uniform float uTs; attribute vec3 aFan; attribute vec2 aSlump;
      ${De}
      void main(){
        float k, st, h;
        vec4 lp = vec4(cbtSlump(position, aFan, aSlump, uTs, k, st, h), 1.);
        #ifdef USE_INSTANCING
          lp = instanceMatrix*lp;
        #endif
        gl_Position = projectionMatrix*viewMatrix*modelMatrix*lp; }`,fragmentShader:`
      #include <packing>
      void main(){ gl_FragColor = packDepthToRGBA(gl_FragCoord.z); }`})}function aa(e=le.uniforms){return new o.ShaderMaterial({uniforms:{uT:e.uT},vertexShader:`
      uniform float uT; attribute vec3 aBall; attribute vec2 aLand;
      ${Te}
      void main(){ vec3 n; float a, b, lift;
        vec3 p = cbtDrip(position, aBall, normal, aLand, uT, n, a, b, lift);
        vec4 wp = modelMatrix*instanceMatrix*vec4(p, 1.); wp.y += lift;
        gl_Position = projectionMatrix*viewMatrix*wp; }`,fragmentShader:`
      #include <packing>
      void main(){ gl_FragColor = packDepthToRGBA(gl_FragCoord.z); }`})}const at=20,rt=-63,Pt=6,Ft=117,mt=30,Tt=21,ht=new o.Vector3(0,8,rt),ce=.15;function oa(e){const t=[],a=rt+Pt,u=at-Pt,i=(n,l,m,M)=>t.push({x:n,z:l,nx:m,nz:M,a:0}),h=Math.round((Ft+14-a)/e),c=Math.round(Math.PI/2*(Pt+22)/(e*1.15)),p=Math.round(2*u/e);for(let n=0;n<h;n++)i(-at,j(Ft+14,a,n/h),-1,0);for(let n=0;n<c;n++){const l=n/c*Math.PI/2;i(-u-Math.cos(l)*Pt,a-Math.sin(l)*Pt,-Math.cos(l),-Math.sin(l))}for(let n=0;n<p;n++)i(j(-u,u,n/p),rt,0,-1);for(let n=0;n<c;n++){const l=n/c*Math.PI/2;i(u+Math.sin(l)*Pt,a-Math.cos(l)*Pt,Math.sin(l),-Math.cos(l))}for(let n=0;n<=h;n++)i(at,j(a,Ft+14,n/h),1,0);for(let n=1;n<t.length;n++)t[n].a=t[n-1].a+Nt(t[n].x-t[n-1].x+(t[n].nx-t[n-1].nx)*Tt,t[n].z-t[n-1].z+(t[n].nz-t[n-1].nz)*Tt);return t}function Ae(e,t,a){let u=0;for(let i=0;i<2;i++){const p=e+i*2.6+a,n=t+i*3.2,l=Math.floor(p/5.2),m=Math.floor(n/6.4),M=Math.sin(l*127.1+m*311.7+i*74.7+a)*43758.5453,f=M-Math.floor(M),D=f*7.13%1,z=f*13.7%1,x=p-(l+.5)*5.2+(f-.5)*1.6,S=n-(m+.5)*6.4+(D-.5)*1.6,g=(z-.5)*.7,H=x*Math.cos(g)+S*Math.sin(g),U=-x*Math.sin(g)+S*Math.cos(g),C=(H/2.3)**2+(U/3.5)**2;if(C<1){const w=(1-C)*(1-C);u=Math.max(u,w*(.55+.25*f)*(1+.22*Math.cos(H*5.46)))}}return u}async function sa(e,t){const{noise:a}=e,u=t.outline,i=u.length,h=[];for(const w of[0,.25,.42])h.push({k:"floor",t:w});h.push({k:"abs",d:-9.5,y:0},{k:"abs",d:-7.2,y:0},{k:"abs",d:-5.6,y:0},{k:"abs",d:-4.2,y:0},{k:"abs",d:-2.6,y:.85},{k:"abs",d:-1,y:1.7});for(let w=0;w<=13;w++)h.push({k:"wall",q:w/13});h.push({k:"top",d:6.5,dy:-.5},{k:"top",d:7.8,dy:0});for(const w of[9.6,12,14.5,17,19.5,22,24.5,27,29.5,32,34])h.push({k:"top",d:w,dy:0});h.push({k:"top",d:35.4,dy:-.6});for(let w=0;w<=17;w++)h.push({k:"flank",q:w/17});h.push({k:"abs",d:52.2,y:3.4},{k:"abs",d:54,y:2.4},{k:"abs",d:56.2,y:1.2},{k:"abs",d:58.5,y:.25},{k:"abs",d:61,y:0},{k:"abs",d:63.5,y:0},{k:"abs",d:66.5,y:0},{k:"abs",d:71,y:-.3});const c=h.length,p=new Float32Array(i*c*3),n=new Float32Array(i*c*2),l=t.sunH.x,m=t.sunH.y,M=[],f=u[i-1].a,D=[],z=[];for(let w=t.rng.range(0,10);w<f;w+=t.rng.range(9,24))D.push({a:w,h:t.rng.range(3,7)+(t.rng.chance(.3)?t.rng.range(3,7):0)});for(let w=t.rng.range(0,10);w<f;w+=t.rng.range(8,20))z.push({a:w,h:t.rng.range(1.6,4.2)+(t.rng.chance(.2)?3:0)});const x=(w,v,K,I,O)=>{let B=-9;for(const R of w){if(Math.abs(R.a-v)>26)continue;const W=Math.min(R.h,O*.45);B=Math.max(B,W-.56*Nt(R.a-v,K-I(W,O)))}return B},S=(w,v)=>-.4+6.2*dt((w-1.7)/Math.max(v-2.4,1),0,1),g=(w,v)=>36.4+14.6*(1-dt((w-4.2)/Math.max(v-5.8,1),0,1));await e.yield();for(let w=0;w<i;w++){const v=u[w];let K=0,I=[0,-1e9,0];for(let O=0;O<c;O++){const B=h[O];let R,W,st=0;const it=A=>{const P=v.x+v.nx*A,L=v.z+v.nz*A,X=P<0?Math.exp(-(((L-t.saddle.z)/(t.saddle.w*Ze))**2)):0;return{E:1,C:mt+(3.4*a.fbm2(P*.02+7,L*.02,3)+1.6*a.n2(v.a*.055,2.5))*(1-X)-t.saddle.depth*X,px:P,pz:L,sd:X}};if(O===0&&(K=it(20).C),B.k==="floor"){const P=Math.max(v.z,rt+at),L=j(0,v.x,B.t),X=j(P,v.z,B.t);W=0+.2*Math.cos(Math.abs(L)/at*Math.PI*4)*gt(.02,.3,B.t)+.1*a.n2(L*.08,X*.08),Math.abs(L)<9&&X<rt+8&&(W=Math.min(W,.2)),p.set([L,W,X],(w*c+O)*3),n.set([0,.62],(w*c+O)*2);continue}if(B.k==="abs"){R=B.d;const A=it(R<0?4:44);W=B.y*Math.min(1,A.E*5)*(.75+.5*a.n2(A.px*.11,A.pz*.11+5)),R<0&&Math.abs(v.x)<13&&v.nz<-.5&&(W*=gt(8,12.5,Math.abs(v.x))),R>60&&(W=B.y)}else if(B.k==="wall"){const A=it(4),P=B.q,L=P*A.C;R=-.4+6.2*P+.35*Math.sin(P*3.1)+1.1*a.n2(v.a*.05,4.5+P*.5)*Math.sin(P*2.8+.2)+.7*Ae(v.a,L*1.02,3.3)*gt(0,.08,P)*(1-gt(.9,1,P)),W=1.7*Math.min(1,A.E*5)+(A.C-2.4)*P,W=Math.max(W,0),Math.abs(v.x)<12&&v.nz<-.5&&(R+=0)}else if(B.k==="top"){R=B.d;const A=it(R);W=A.C+B.dy*Math.min(1,A.E*3)+.9*a.fbm2(A.px*.09,A.pz*.09+31,2)*A.E;let P=0;for(const L of t.feet){const X=Nt(A.px-L.x,A.pz-L.z);P=Math.max(P,Math.min(L.r*.5,(L.r+5.5-X)*.52))}W+=Math.max(P,0)*A.E*(1-.85*A.sd)}else{const A=it(40),P=B.q,L=(1-P)*A.C;R=36.4+14.6*P-.5*Math.sin(P*3.1)+2.6*a.n2(v.a*.04,9.5+P*.4)*Math.sin(P*2.6+.3)-.85*Ae(v.a*1.35+40,L*1.05,8.1)*gt(0,.1,P)*(1-gt(.88,1,P));const X=1.2+2.6*a.n2(v.a*.028,17.5),et=.82*gt(-.35,.3,a.n2(v.a*.045,61.5+P*1.3)),Mt=P-et*Math.sin(15.08*P+X)/15.08;W=j(A.C-1.6,4.2*Math.min(1,A.E*5),dt(Mt,0,1)),W=Math.max(W,0)}const $=Math.abs(v.x)<15&&v.nz<-.5;if(R<3&&!$&&v.nz===0&&v.z>rt+Pt+9){const A=x(z,v.a,R,S,K);A>W&&(W=A,st=-.2)}if(R>40){const A=x(D,v.a,R,g,K);A>W&&(W=A,st=-.2)}(R<-5||R>62)&&(st=.35);const ut=Math.sqrt(Math.max(0,1-Math.pow(Math.max(v.z-103,0)/27.5,2)));ut<1&&(R=Tt+(R-Tt)*(.04+.96*ut),W*=Math.pow(ut,.75));let _=v.x+v.nx*R,ot=v.z+v.nz*R;if(R<0){const A=Math.max(at+R,.5);_=dt(_,-A,A),ot=Math.max(ot,rt-R)}if(R<8&&ot<rt+16&&Math.abs(_)>9){const A=(at-1.2)*Math.sign(_),P=rt+1.2,L=2.9-.47*Nt(_-A,ot-P)+.12*a.n2(_*.3,ot*.3);L>W&&(W=L,st=-.25)}const vt=_*l+(ot-rt-1.5)*m,xt=Math.abs((ot-rt-1.5)*l-_*m);if(_>14&&vt>14){const A=1.3+.085*Math.max(vt-20,0)+Math.max(xt-2.6,0)*2.7+.5*(xt/2.6)**2*Math.min(1,xt/2.6);A<W&&(W=j(W,A,gt(14,19,vt)),st=.3)}p.set([_,W,ot],(w*c+O)*3),n.set([0,st],(w*c+O)*2),B.k==="top"&&W>I[1]&&(I=[_,W,ot])}w%10===4&&M.push(I),await e.yield()}await e.yield();const H=Ce(i,c,!1);await e.yield();const U=new Float32Array(p.length);for(let w=0;w<H.length;w+=12e3)We(U,p,H,w,Math.min(H.length,w+12e3)),await e.yield();Be(U),await e.yield();const C=ee(p,n,i,c,!1,2.2,!0,H,U);for(let w=0;w<i;w+=32)Re(C,i,c,!1,2.2,w,Math.min(i,w+32)),await e.yield();return C.userData.crestLine=M,C}async function na(e,t){const a=Object.keys(e[0].attributes),u=new o.BufferGeometry,i={};let h=0,c=0;for(const m of e)h+=m.attributes.position.count,c+=m.index.count;for(const m of a)i[m]=new Float32Array(h*e[0].attributes[m].itemSize);const p=new Uint32Array(c);let n=0,l=0;for(const m of e){for(const f of a)i[f].set(m.attributes[f].array,n*m.attributes[f].itemSize);const M=m.index.array;for(let f=0;f<M.length;f++)p[l+f]=M[f]+n;n+=m.attributes.position.count,l+=M.length,await t()}for(const m of a)u.setAttribute(m,new o.BufferAttribute(i[m],e[0].attributes[m].itemSize));return u.setIndex(new o.BufferAttribute(p,1)),u}function Ce(e,t,a){const u=a?e:e-1,i=new Uint32Array(u*(t-1)*6);let h=0;for(let c=0;c<u;c++){const p=(c+1)%e;for(let n=0;n<t-1;n++){const l=c*t+n,m=p*t+n,M=c*t+n+1,f=p*t+n+1;i[h++]=l,i[h++]=m,i[h++]=M,i[h++]=m,i[h++]=f,i[h++]=M}}return i}function ee(e,t,a,u,i,h,c=!1,p=Ce(a,u,i),n=ra(e,p)){const l=new o.BufferGeometry;return l.setAttribute("position",new o.BufferAttribute(e,3)),l.setIndex(new o.BufferAttribute(p,1)),l.setAttribute("normal",new o.BufferAttribute(n,3)),l.setAttribute("aD",new o.BufferAttribute(t,2)),c||Re(l,a,u,i,h),l}function ra(e,t){const a=new Float32Array(e.length);return We(a,e,t,0,t.length),Be(a)}function We(e,t,a,u,i){for(let h=u;h<i;h+=3){const c=a[h]*3,p=a[h+1]*3,n=a[h+2]*3,l=t[p]-t[c],m=t[p+1]-t[c+1],M=t[p+2]-t[c+2],f=t[n]-t[c],D=t[n+1]-t[c+1],z=t[n+2]-t[c+2],x=m*z-M*D,S=M*f-l*z,g=l*D-m*f;e[c]+=x,e[c+1]+=S,e[c+2]+=g,e[p]+=x,e[p+1]+=S,e[p+2]+=g,e[n]+=x,e[n+1]+=S,e[n+2]+=g}}function Be(e){for(let t=0;t<e.length;t+=3){const a=Math.max(Nt(e[t],e[t+1],e[t+2]),1e-9);e[t]/=a,e[t+1]/=a,e[t+2]/=a}return e}function Re(e,t,a,u,i,h=0,c=t){const p=e.attributes.normal.array,n=e.attributes.position.array,l=e.attributes.aD.array;for(let m=h;m<c;m++)for(let M=0;M<a;M++){const f=m*a+M,D=u?(m+t-1)%t:Math.max(m-1,0),z=u?(m+1)%t:Math.min(m+1,t-1);let x=0,S=0,g=0,H=0;for(let C=0;C<4;C++){const w=C===0?D*a+M:C===1?z*a+M:C===2?m*a+Math.max(M-1,0):m*a+Math.min(M+1,a-1),v=n[w*3]-n[f*3],K=n[w*3+1]-n[f*3+1],I=n[w*3+2]-n[f*3+2];x+=v,S+=K,g+=I,H+=Nt(v,K,I)}const U=-(x*p[f*3]+S*p[f*3+1]+g*p[f*3+2])/Math.max(H,.001);l[f*2]=dt(U*i,0,1)}}let Ut=null;async function fe(e,t){const a=t.segs??9,u=[];let i=0,h=0,c=0;const p=e.range(0,Math.PI*2),n=t.lean??e.range(0,.05),l=e.range(.25,.6),m=e.range(0,6.28),M=e.range(0,6.28),f=e.range(2,5),D=e.range(.12,.42),z=t.kink?e.range(.4,.6):2,x=t.H/(t.maxBlobs??58);for(;i<t.H&&u.length<90;){const I=i/t.H;let O=t.tipR+(t.R0-t.tipR)*Math.pow(1-I,t.pow)*(1+D*Math.sin(I*f*6.28+m)*(1-I));O=Math.max(O,t.tipR)+t.R0*.3*Math.exp(-I*16);const B=O*e.range(.74,1.26);let R=Math.max(B*e.range(.5,.72),x*e.range(.75,1.1));if(R=Math.min(R,B*1.5+.2),h+=Math.cos(p)*n*R+e.range(-1,1)*B*.16*l,c+=Math.sin(p)*n*R+e.range(-1,1)*B*.16*l,I>z&&u.length&&!u.kinked){u.kinked=!0;const it=e.range(0,6.28);h+=Math.cos(it)*B*.85,c+=Math.sin(it)*B*.85}const W=e.range(0,6.28),st=e.range(0,6.28);u.push({x:h,y:i,z:c,r:B,h:R,a1:e.range(0,6.28),a2:e.range(0,6.28),lop:e.range(.08,.2)+.12*(1-I)*(1-I),t1:W,t2:st,t3:(W+st)*.5+Math.PI+.7*Math.sin(W*7),tw:e.range(.35,.8),td:e.range(.6,1.5),td2:e.range(.3,1.1)}),i+=R*e.range(.82,.98)}let S=u.findIndex((I,O)=>O>=2&&I.r<(t.fatR??2));S<0&&(S=u.length);const g=[[.5,0,.5,1],[.92,.08,1,0],[1,.32,.45,.1],[.88,.58,.08,.72],[.56,.8,0,1]],H=[[.5,0,.5,1],[.95,.12,1,0],[1,.46,.3,.3],[.62,.82,0,1]],U=(I,O,B,R,W)=>{const st=O-I,it=R.length,$=st*it+2,ut=new Float32Array(B*$*3),_=new Float32Array(B*$*2),ot=new Float32Array(B*$);for(let P=0;P<B;P++){const L=P/B*Math.PI*2;for(let wt=I;wt<O;wt++){const Q=u[wt],It=wt>0?u[wt-1].h:1.5,Vt=1+Q.lop*Math.cos(L-Q.a1)+Q.lop*.5*Math.cos(2*L-Q.a2),At=Math.max(Q.tw*.62,4.6/B),Lt=Math.atan2(Math.sin(L-Q.t1),Math.cos(L-Q.t1))/At,Et=Math.atan2(Math.sin(L-Q.t2),Math.cos(L-Q.t2))/(At*.8),Gt=Math.atan2(Math.sin(L-Q.t3),Math.cos(L-Q.t3))/(At*.9),Yt=Math.max(Math.exp(-Lt*Lt)*Q.td,Math.exp(-Et*Et)*Q.td2,Math.exp(-Gt*Gt)*.5*(Q.td+Q.td2));for(let zt=0;zt<it;zt++){const Ct=R[zt],St=Q.r*(zt===0&&wt===0&&t.skirt?.9:Ct[0])*Vt*(1+.14*Yt*Ct[2]),_t=Q.y+Q.h*Ct[1]-Yt*Ct[2]*Math.min(It,Q.h*1.4)*.95,bt=P*$+1+(wt-I)*it+zt,Wt=bt*3;ut[Wt]=t.ox+Q.x+Math.cos(L)*St,ut[Wt+1]=t.oy+_t,ut[Wt+2]=t.oz+Q.z+Math.sin(L)*St,_[bt*2+1]=(t.fresh??0)*gt(.55,1,(Q.y+Q.h)/t.H),ot[bt]=Ct[3]}}const X=u[I],et=u[O-1],Mt=I?.3:t.skirt?1.3*(1+.16*Math.cos(3*L+X.a1)):.9,Dt=I?X.h*1.5:t.skirt?2.3*(1+.3*Math.cos(3*L+X.a1)):3;ut.set([t.ox+X.x+Math.cos(L)*X.r*Mt,t.oy+X.y-Dt,t.oz+X.z+Math.sin(L)*X.r*Mt],P*$*3);const Ht=W?t.capR??.04:et.r*.3,pt=W?et.h*(t.capR?.98:1.12):et.h*1.05;ut.set([t.ox+et.x+Math.cos(L)*Ht,t.oy+et.y+pt,t.oz+et.z+Math.sin(L)*Ht],(P*$+$-1)*3),_[(P*$+$-1)*2+1]=t.fresh??0,ot[P*$+$-1]=1}const vt=ee(de(ut,B,$,3),de(_,B,$,2),B,$,!0,1.6),xt=de(ot,B,$,1),A=vt.attributes.aD.array;for(let P=0;P<xt.length;P++)A[P*2]=xt[P];return vt},C=[];S>0&&C.push(U(0,S,t.segsFat??18,g,S===u.length)),Ut&&await Ut(),S<u.length&&C.push(U(S,u.length,a,H,!0)),Ut&&await Ut();const w=C.length>1?te(C,!1):C[0],v=u.length;for(const I of u)I.x+=t.ox,I.y+=t.oy,I.z+=t.oz;const K=u[v-1];return{geo:w,blobs:u,top:{x:K.x,y:K.y+K.h,z:K.z,r:K.r}}}function de(e,t,a,u){const i=new Float32Array(e.length);for(let h=0;h<t;h++)for(let c=0;c<a;c++)for(let p=0;p<u;p++)i[(h*a+c)*u+p]=e[(h*a+(a-1-c))*u+p];return i}function ia(e,t=14){const a=[[.55,-.12,.3],[1,-.22,1],[1.07,.06,.2],[.86,.33,0],[.46,.47,0],[.02,.5,0]],u=[-1.25,-.72,-.1,.5,1.05,1.5],i=a.length,h=new Float32Array(t*i*3),c=new Float32Array(t*i*3),p=new Float32Array(t*i*2),n=e.range(0,6.28),l=n+e.range(1.6,3.4),m=l+e.range(1.2,2.2);for(let D=0;D<t;D++){const z=D/t*Math.PI*2,x=(g,H)=>Math.exp(-((Math.atan2(Math.sin(z-g),Math.cos(z-g))/H)**2)),S=Math.max(x(n,.55),.75*x(l,.4),.55*x(m,.7));for(let g=0;g<i;g++){const H=g,U=(D*i+(i-1-H))*3,C=a[H],w=C[0]*(1+.1*Math.cos(z*2+n))*(1+.12*S*C[2]);h[U]=Math.cos(z)*w,h[U+1]=C[1]-S*C[2]*.85,h[U+2]=Math.sin(z)*w;const v=Math.cos(u[H])*.8,K=Math.sin(u[H])*.8;c[U]=Math.cos(z)*v,c[U+1]=K+.1,c[U+2]=Math.sin(z)*v}}const M=ee(h,p,t,i,!0,1.2),f=[0,0,.1,.62,1,1];for(let D=0;D<t;D++)for(let z=0;z<i;z++)M.attributes.aD.array[(D*i+(i-1-z))*2]=f[z];return M.setAttribute("aBall",new o.BufferAttribute(c,3)),M}function la(e,t,a){const c=[],p=[],n=[],l=[e.range(.3,.45),e.range(.55,.7),e.range(.8,.9)],m=e.range(.55,1);for(let f=0;f<27;f++){const D=f/26*2-1,z=D*1.2,x=f%2===1?1:0;for(let S=0;S<6;S++){const g=S/5,H=2.55*(1-.16*D*D)*(.12+.88*g),U=.62*Math.sin(Math.PI*Math.pow(g,.75)*.93+.1)*(1-.55*D*D)+x*.1*(.3+g);c.push(Math.sin(z)*H*1.02,Math.cos(z)*H-.35,U);let C=0;for(const K of l)C=Math.max(C,1-Math.min(1,Math.abs(g-K)/.07));const w=dt(C*m+(g<.14?.7:0),0,1),v=x?1:.8;p.push(j(t.r,a.r,w)*v,j(t.g,a.g,w)*v,j(t.b,a.b,w)*v,0)}}for(let f=0;f<26;f++)for(let D=0;D<5;D++){const z=f*6+D,x=z+6;n.push(z,x,z+1,x,x+1,z+1)}const M=new o.BufferGeometry;return M.setAttribute("position",new o.Float32BufferAttribute(c,3)),M.setAttribute("aTint",new o.Float32BufferAttribute(p,4)),M.setAttribute("aD",new o.Float32BufferAttribute(new Float32Array(324),2)),M.setIndex(n),M.computeVertexNormals(),M}function ha(e){const{noise:t}=e,a=44,u=[[13.6,-5.2],[12.7,-1.6],[11.3,.9],[9.6,2],[8.5,2.15],[7.8,1.7],[7.62,.6],[7.6,-2],[7.5,-8],[7.2,-16],[6.6,-26],[0,-27.5]],i=u.length,h=new Float32Array(a*i*3),c=new Float32Array(a*i*2);for(let n=0;n<a;n++){const l=n/a*Math.PI*2;for(let m=0;m<i;m++){const M=u[m],f=m>=7?1:0,D=f*.3*Math.pow(Math.abs(Math.cos(l*5.5+.4)),3)*(m<i-1?1:0),z=(1-f)*.5*t.n3(Math.cos(l)*2.2,Math.sin(l)*2.2,m*.7),x=M[0]+D+z,S=(n*i+m)*3;h[S]=ht.x+Math.cos(l)*x,h[S+1]=ht.y+Math.sin(l)*x,h[S+2]=ht.z+M[1]+z*.4-Math.cos(l)*x*ce*(m<=6?1:m===7?.45:0),c[(n*i+m)*2+1]=f*.7}}const p=ee(h,c,a,i,!0,1.4);for(let n=0;n<a;n++)for(let l=8;l<i;l++)p.attributes.aD.array[(n*i+l)*2]=-Math.min(1,(l-7)*.3);return p}async function Fe(e,t,a,u,i,h=a){const c=e.fork?e.fork("trickles"):e;if(e.fork){let S=-1;for(const g of t)g.old&&(S+=2+9*Math.max(4,Math.round(h*g.old)));for(let g=0;g<S;g++)e()}let p=0;for(const S of t)S.n=Math.max(3,Math.round(a*(S.many??1))),p+=S.n;const n=new o.InstancedBufferGeometry;n.setAttribute("position",new o.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]);const l=new Float32Array(p*3),m=new Float32Array(p*3),M=new Float32Array(p*3),f=new Float32Array(p*4),D=new Float32Array(p);for(let S=0,g=0;S<t.length;S++){i&&S%16===15&&await i(),i&&t[S].own&&S%4===3&&await i();const H=t[S],U=c(),C=c.range(.16,.26);for(let w=0;w<H.n;w++,g++){const v=()=>c.range(-.14,.14);l.set([H.p0.x+v(),H.p0.y,H.p0.z+v()],g*3),m.set([H.p1.x+v(),H.p1.y,H.p1.z+v()],g*3),M.set([H.p2.x+v()*3,H.p2.y,H.p2.z+v()*3],g*3),f.set([c(),C*c.range(.85,1.15),U,c.range(.07,.11)],g*4),D[g]=H.litY??-1e4}}n.setAttribute("aP0",new o.InstancedBufferAttribute(l,3)),n.setAttribute("aP1",new o.InstancedBufferAttribute(m,3)),n.setAttribute("aP2",new o.InstancedBufferAttribute(M,3)),n.setAttribute("aPh",new o.InstancedBufferAttribute(f,4)),n.setAttribute("aLitY",new o.InstancedBufferAttribute(D,1)),n.instanceCount=p,i&&await i();const z=new o.ShaderMaterial({uniforms:{...u,uViewH:{value:450}},vertexShader:`
      uniform float uTime, uViewH;
      attribute vec3 aP0, aP1, aP2; attribute vec4 aPh; attribute float aLitY;
      varying vec3 vW; varying vec4 vQ;
      void main(){
        float t = fract(uTime*aPh.y + aPh.x), q = t*t, tb = max(t - 0.05, 0.), qb = tb*tb;
        float burst = smoothstep(0.1, 0.5, sin(uTime*0.45 + aPh.z*6.283 - t*1.5)*0.5 + 0.5);    // a crust lets go, runs, stops
        vec3 p = mix(mix(aP0, aP1, q), mix(aP1, aP2, q), q), pb = mix(mix(aP0, aP1, qb), mix(aP1, aP2, qb), qb);      // the head of the thread, and where it was a moment ago
        vec4 mv = viewMatrix*modelMatrix*vec4(p, 1.), mb = viewMatrix*modelMatrix*vec4(pb, 1.);
        float d = max(-mv.z, 0.1);
        float pxm = d/max(uViewH*projectionMatrix[1][1]*0.5, 1.);                                   // metres to a pixel at this depth
        float W = max(aPh.w, mix(2.3, 1.25, smoothstep(50., 150., d))*pxm)*burst*smoothstep(0., 0.04, t)*(1. - smoothstep(0.93, 1., t));      // a grain is never under two pixels across
        W *= step(fract(aPh.x*7.31 + aPh.z*3.), clamp(42./d, 0.04, 1.));                             // far off only a few of the threads are drawn: a spire never wears a cloud of them
        vec2 dir = mb.xy - mv.xy; float dl = length(dir); dir = dl > 1e-4 ? dir/dl : vec2(0., 1.);
        float L = clamp(dl, 5.*W, 22.*W);                                                            // five or six grains long
        mv.xy += vec2(dir.y, -dir.x)*position.x*W + dir*position.y*L;      // (this way round the quad faces us)
        vW = (modelMatrix*vec4(mix(p, pb, position.y), 1.)).xyz;
        vQ = vec4(position.x, position.y*L/max(2.6*W, 1e-5), smoothstep(aLitY - 0.6, aLitY + 0.6, p.y), aPh.x*91.7);
        gl_Position = projectionMatrix*mv;
      }`,fragmentShader:`
      ${he}
      varying vec3 vW; varying vec4 vQ;
      void main(){
        float c = floor(vQ.y), h = cbtH31(vec3(c, vQ.w, 1.7)), h2 = fract(h*7.13);
        vec2 g = vec2(vQ.x - (h - 0.5)*0.9, (fract(vQ.y) - 0.5)*2.6 - (h2 - 0.5)*0.9);            // one grain to a cell, each a little out of line
        float grain = step(dot(g, g), 0.3 + 0.3*h2)*step(0.2, fract(h*13.7));
        float core = step(abs(vQ.x - (h - 0.5)*0.5), 0.4)*step(0.3, fract(h*5.3));                    // the thread itself, broken: fine sand running between the grains
        cbtCut = grain + core < 0.5;      // (between the grains: decided here, cut below, once the shading has taken this pixel's footprint: a derivative taken after a cut is not defined)
        vec3 n = uSunDir + vec3(0., 0.6, 0.); n /= max(length(n), 1e-4);
        vec3 col = cbtShade(uDryC, 0., 0., vW, n, vQ.z);
        if (cbtCut) discard;
        gl_FragColor = vec4(col, 1.);
      }`}),x=new o.Mesh(n,z);return x.frustumCulled=!1,x.castShadow=!1,x}async function ma(e,t,a,u,i){const c=[],p=[];for(let z=0;z<2;z++){const x=c.length/3;for(let S=0;S<=4;S++){const g=S/4;c.push(g*g*.6+g*.4,-1,z,g*g*.6+g*.4,1,z)}for(let S=0;S<4;S++){const g=x+S*2;p.push(g,g+2,g+1,g+1,g+2,g+3)}}const n=new o.InstancedBufferGeometry,l=Math.max(1,t.length);n.setAttribute("position",new o.Float32BufferAttribute(c,3)),n.setIndex(p);const m=new Float32Array(l*4),M=new Float32Array(l*4);for(let z=0;z<t.length;z++){i&&z%60===59&&await i();const x=t[z];m.set([x.p.x,x.p.y,x.p.z,x.gone??1e6],z*4),M.set([x.len,x.sink,e(),e()*6.2832],z*4)}n.setAttribute("aP0",new o.InstancedBufferAttribute(m,4)),n.setAttribute("aRun",new o.InstancedBufferAttribute(M,4)),n.instanceCount=l;const f=new o.ShaderMaterial({uniforms:{...u,uViewH:{value:450},uWind:{value:a.clone().normalize()}},vertexShader:`
      uniform float uTime, uTs, uViewH; uniform vec3 uWind;
      attribute vec4 aP0, aRun;
      varying vec3 vW; varying vec4 vQ; varying float vOn;
      void main(){
        float s = position.x, c = position.y;
        vec3 side = vec3(-uWind.z, 0., uWind.x);
        float gust = 0.6 + 0.4*sin(uTime*0.8 - dot(aP0.xyz, uWind)*0.045 + aRun.w);
        float len = aRun.x*(0.55 + 0.45*gust);
        vec3 ctr = aP0.xyz + uWind*(len*s) + vec3(0., 1.1*s*(1. - s)*gust - aRun.y*s*s, 0.) + side*(0.7*s*sin(uTime*1.1 + aRun.w*3. + s*4.));
        vec4 mv0 = viewMatrix*modelMatrix*vec4(ctr, 1.);
        float pxm = max(-mv0.z, 0.1)/max(uViewH*projectionMatrix[1][1]*0.5, 1.);              // metres to a pixel at this depth
        float wT = 0.14 + 0.055*len*s, w = max(wT, 1.5*pxm);      // (the ribbon's own width; where that is under a pixel and a half it is drawn that wide and as much fainter, so its cover on screen is its true cover: a far plume is a breath, never a wire)
        vec3 p = ctr + (position.z < 0.5 ? vec3(0., 1., 0.) : side)*(c*w);
        vW = (modelMatrix*vec4(p, 1.)).xyz;
        vQ = vec4(s, c, len, aRun.z);
        vOn = (0.45 + 0.55*gust)*(1. - smoothstep(aP0.w - 0.4, aP0.w + 0.4, uTs))*(wT/w);
        gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.);
      }`,fragmentShader:`
      ${he}
      varying vec3 vW; varying vec4 vQ; varying float vOn;
      void main(){
        float s = vQ.x, c = vQ.y;
        float env = (1. - smoothstep(0.45, 1., abs(c)))*smoothstep(0., 0.02, s)*(1. - s)*(1. - 0.55*s);      // densest at the crest, thinning to nothing
        float along = s*vQ.z;
        float n1 = cbtN3(vec3(along*0.45 - uTime*2.4, c*(1.5 + 4.*s) + vQ.w*17., vQ.w*5.));      // streaks of sand drawn out down the wind
        float n2 = cbtN3(vec3(along*1.6 - uTime*4.2, c*(4. + 6.*s) + vQ.w*3., 2.));
        float a = env*smoothstep(0.36, 0.62, 0.62*n1 + 0.38*n2 + 0.6*env - 0.22)*vOn;
        if (a < 0.02) discard;
        float dist = length(cameraPosition - vW);
        vec3 col = mix(mix(uDryC, vec3(1.), 0.22), uSkyLo, cbtBleach(dist));
        gl_FragColor = vec4(col, min(a, 0.72));
      }`,transparent:!0,depthWrite:!1,side:o.DoubleSide}),D=new o.Mesh(n,f);return D.frustumCulled=!1,D.castShadow=!1,D.name="crest-plumes",D}function ca(e){const u=[],i=[],h=[];for(const p of[-1,1]){const n=p*(at-3.9),l=rt+2.3,m=5.3,M=u.length/3;u.push(n,m,l),i.push(1,-.25);for(let f=1;f<=7;f++)for(let D=0;D<24;D++){const z=D/24*6.2832,x=f/7,S=1+(.13*e.n2(Math.cos(z)*1.7+p*5,Math.sin(z)*1.7+3)+.06*e.n2(Math.cos(z)*5.1,Math.sin(z)*5.1+p*9))*x,g=9.9*x*S,H=n+Math.cos(z)*g,U=l+Math.sin(z)*g,C=m*(1-Math.pow(x,.92))-.42*x*x+.1*e.n2(H*.45,U*.45)*x*(1-x)*4;u.push(H,C,U),i.push(.9-.5*x,f===7?.2:-.25);const w=M+1+(f-1)*24+D,v=M+1+(f-1)*24+(D+1)%24;if(f===1)h.push(M,v,w);else{const K=w-24,I=v-24;h.push(K,I,w,I,v,w)}}}const c=new o.BufferGeometry;return c.setAttribute("position",new o.Float32BufferAttribute(u,3)),c.setAttribute("aD",new o.Float32BufferAttribute(i,2)),c.setIndex(h),c.computeVertexNormals(),c}function ae(e,t,a,u,i){const c=i*Ye*.8,p=[t,a+c,u],n=[];for(let m=0;m<7;m++){const M=m/7*6.2832,f=i*e.range(.8,1.2);p.push(t+Math.cos(M)*f,a-.15,u+Math.sin(M)*f),n.push(0,1+(m+1)%7,1+m)}const l=new o.BufferGeometry;return l.setAttribute("position",new o.Float32BufferAttribute(p,3)),l.setAttribute("aD",new o.Float32BufferAttribute(new Float32Array(16).fill(0).map((m,M)=>M%2===0?1:0),2)),l.setIndex(n),l.computeVertexNormals(),l}async function va(e,t={}){const a=e.rng.fork?e.rng.fork("drip-cathedral"):e.rng,u=dt(t.detail??e.quality?.detail??1,.6,1),i=t.palette&&t.palette.length>=7?t.palette:Ot,h=Ne(),c=(s={})=>ta({...s,uniforms:h});h.uWetC.value.set(i[0]),h.uDryC.value.set(i[1]),h.uShadeC.value.set(i[2]);const p=(t.sun?t.sun.clone():new o.Vector3(.963,.208,.17)).normalize();h.uSunDir.value.copy(p);const n=new o.Vector2(p.x,p.z).normalize(),l=new o.Group;l.name="drip-cathedral";const m=c(),M=c({drib:!0});await e.yield();const f=[];for(let s=0;s<8;s++)f.push({arm:"port",x:-at-Tt+a.range(-4.5,4.5),z:s?j(71,-38,(s-1)/6)+a.range(-3,3):98});for(let s=0;s<7;s++)f.push({arm:"star",x:at+Tt+a.range(-4.5,4.5),z:j(95,-27,s/6)+a.range(-4,4)});f.push({arm:"head",x:-31+a.range(-3,3),z:-79+a.range(-3,3)},{arm:"head",x:a.range(-4,4),z:-86+a.range(-2,3)},{arm:"head",x:27+a.range(-2,3),z:-82+a.range(-3,2)});const D=a.int(2,6),z=new Set([a.int(1,7),a.int(8,11),a.int(12,14),a.int(15,17)]);f.forEach((s,r)=>{const d=gt(100,-40,s.z);s.H=r===16?90:r===0?48:dt(j(40,66,d)+a.range(-8,16)+(r%2?7:-4),38,84),s.kind=r===0?"grow":r===16?"tall":a.pick(["fat","needle","plain","plain","needle","fat","plain"]),s.R0=(r===0?9.2:5.2+s.H*.045)*a.range(.9,1.15)*(s.kind==="fat"?1.22:s.kind==="needle"?.88:1),s.kind==="fat"&&(s.H=Math.max(38,s.H*.8)),s.oy=mt-.8});const x={z:(f[0].z-f[0].R0+f[1].z+f[1].R0)/2,w:dt((f[0].z-f[0].R0-f[1].z-f[1].R0)*.5,4,7),depth:je};await e.yield();const S={rng:a,outline:oa(1.75),feet:f.map(s=>({x:s.x,z:s.z,r:s.R0})),sunH:n,saddle:x};await e.yield();const g=new o.Mesh(await sa(e,S),c({hand:!0,hole:new o.Vector4(ht.x,ht.y,ht.z,7.7)}));g.castShadow=!0,g.receiveShadow=!0,l.add(g),await e.yield();const H={port:[],port2:[],star:[],star2:[],head:[]},U=[],C=[];Ut=()=>e.yield();let w=null;for(let s=0;s<f.length;s++){const r=f[s],d=s===0,b=await fe(a,{H:r.H,R0:r.R0,tipR:d?2:a.range(.42,.62),pow:d?1.5:r.kind==="fat"?a.range(1.1,1.5):r.kind==="needle"?a.range(2.7,3.4):a.range(1.6,2.4),kink:s===D,maxBlobs:d?30:56,fatR:s<3?1.25:2,segs:d?16:r.arm==="port"?11:8,segsFat:d?30:r.arm==="port"?s<3?26:22:16,ox:r.x,oy:r.oy,oz:r.z,fresh:d?.55:0,capR:d?1.2:0,lean:d?.01:s%5===3?a.range(.07,.11):void 0});r.blobs=b.blobs,r.top=b.top,C.push(r),await e.yield();const T=d?w=[b.geo]:H[r.arm==="head"?"head":r.arm+(r.z<30?"2":"")];if(d||T.push(b.geo),z.has(s)){const y=Math.floor(b.blobs.length*a.range(.22,.4)),k=b.blobs[y],F=a.range(0,6.28),N=await fe(a,{H:(r.H-(k.y-r.oy))*a.range(.45,.7),R0:k.r*.62,tipR:.42,pow:1.6,lean:.16,maxBlobs:22,ox:k.x+Math.cos(F)*k.r*.7,oy:k.y+1.5,oz:k.z+Math.sin(F)*k.r*.7});T.push(N.geo),await e.yield()}const G=d?12:s<4?13:9,V=d||s<4?3.4:.8,q=d||s<4?3:r.arm==="star"?.8:3.4;for(let y=0;y<G;y++){const k=a.int(6,Math.max(7,Math.floor(b.blobs.length*.7))),F=k-a.int(3,6),N=b.blobs[Math.min(k,b.blobs.length-1)],E=b.blobs[Math.max(F,0)],Z=Math.atan2(n.y,n.x)+a.range(-1.9,1.9),J=Math.cos(Z),nt=Math.sin(Z),Y=Math.max(E.r*.72,N.r*.9+.3),lt=Y<=E.r*.84,tt=new o.Vector3(N.x+J*N.r*.86,N.y+N.h*.8,N.z+nt*N.r*.86),ft=new o.Vector3(E.x+J*Y,E.y+E.h*.72,E.z+nt*Y),yt=new o.Vector3(j(tt.x,ft.x,.7)+J*.6,tt.y-.2,j(tt.z,ft.z,.7)+nt*.6);U.push({p0:tt,p1:yt,p2:ft,many:q,old:V});const Jt=a.range(.9,1.7);lt&&T.push(ae(a,ft.x,ft.y+.05,ft.z,Math.min(Jt,E.r*.24)))}await e.yield()}const v=C[0],K=v.blobs.find(s=>s.y-v.oy>5.5)??v.blobs[3],I=a.range(-.1,.5),O=await fe(a,{H:4.4,R0:3.2,tipR:2,pow:1.2,lean:.02,maxBlobs:3,segs:11,segsFat:20,fresh:.55,capR:1.1,skirt:!0,ox:K.x+Math.cos(I)*K.r*.82,oy:K.y+K.h*.4,oz:K.z+Math.sin(I)*K.r*.82});w.push(O.geo);const B=v.x,R=v.z,W=Math.max(O.top.x+12,B+19),st=[[0,6,184],[-4,18,154],[W*.75,34,126],[W,42,R+4],[W,42,R-20],[-10,33,46],[-3,17,20],[0,8,0],[0,8,rt-1.2]].map(s=>new o.Vector3(...s)),it={position:new o.Vector3(0,ht.y,rt-1.2),facing:new o.Vector3(0,0,1),radius:7},$=[];if(t.course)for(const s of t.course(l,st,it.position)){const r=l.worldToLocal(s.clone());$.push(r.x,r.z)}else for(let s=0;s+1<st.length;s++){const r=st[s],d=st[s+1],b=Math.ceil(r.distanceTo(d)/2);for(let T=s?1:0;T<=b;T++)$.push(j(r.x,d.x,T/b),j(r.z,d.z,T/b))}const ut=(s,r)=>{let d=1e18;for(let b=0;b<$.length;b+=2)d=Math.min(d,($[b]-s)**2+($[b+1]-r)**2);return Math.sqrt(d)};await e.yield();const _=qe(Oe("spire-trickles:"+e.seed)),ot=[],vt=[];for(let s=1;s<C.length;s++){const r=C[s];if(ut(r.x,r.z)>40)continue;const d=H[r.arm==="head"?"head":r.arm+(r.z<30?"2":"")],b=r.z<rt?Math.PI/2:r.x<0?0:Math.PI;for(let T=0;T<8;T++){const G=_.int(3,Math.max(4,Math.floor(r.blobs.length*.55))),V=r.blobs[Math.min(G,r.blobs.length-1)];let q=Math.min(G,r.blobs.length-1)-1;for(;q>0&&r.blobs[q].r<V.r*1.12+.4&&G-q<7;)q--;const y=r.blobs[Math.max(q,0)],k=b+_.range(-1.4,1.4),F=Math.cos(k),N=Math.sin(k),E=Math.max(y.r*.7,V.r*.95+.4),Z=new o.Vector3(V.x+F*V.r*.9,V.y+V.h*.75,V.z+N*V.r*.9),J=new o.Vector3(y.x+F*E,y.y+y.h*.72,y.z+N*E),nt=new o.Vector3(j(Z.x,J.x,.65)+F*.5,j(Z.y,J.y,.25),j(Z.z,J.z,.65)+N*.5);ot.push({p0:Z,p1:nt,p2:J,many:2,own:!0});const Y=y.r*.24;E<=y.r*.86&&d.push(ae(_,J.x,J.y+.05,J.z,Y>.9?Math.min(_.range(.9,1.6),Y):Y))}await e.yield()}{const s=g.geometry.attributes.position,r=[];for(let y=0;y<s.count;y++){const k=s.getX(y),F=s.getZ(y);k<-at-4&&k>-at-80&&F>x.z-x.w*3.4&&F<Ft+40&&r.push(k,s.getY(y),F)}await e.yield();const d=(y,k)=>{let F=1e9,N=mt;for(let E=0;E<r.length;E+=3){const Z=(r[E]-y)**2+(r[E+2]-k)**2;Z<F&&(F=Z,N=r[E+1])}return N},b=t.waterTop??-1e9,T=g.geometry.index.array,G=[];for(let y=0;y<T.length;y+=3){const k=T[y],F=T[y+1],N=T[y+2],E=s.getX(k),Z=s.getX(F),J=s.getX(N);Math.max(E,Z,J)<-at-4&&Math.min(E,Z,J)>-at-80&&Math.max(s.getZ(k),s.getZ(F),s.getZ(N))>x.z-x.w*3.4&&G.push(E,s.getY(k),s.getZ(k),Z,s.getY(F),s.getZ(F),J,s.getY(N),s.getZ(N))}await e.yield();const V=(y,k)=>{let F=-1e9;for(let N=0;N<G.length;N+=9){const E=G[N],Z=G[N+2],J=G[N+3]-E,nt=G[N+5]-Z,Y=G[N+6]-E,lt=G[N+8]-Z,tt=J*lt-nt*Y;if(Math.abs(tt)<1e-9)continue;const ft=((y-E)*lt-(k-Z)*Y)/tt,yt=((k-Z)*J-(y-E)*nt)/tt;ft>=0&&yt>=0&&ft+yt<=1&&(F=Math.max(F,G[N+1]+ft*(G[N+4]-G[N+1])+yt*(G[N+7]-G[N+1])))}return F},q=(y,k,F)=>{if(V(y,k)<=b)return!1;for(let N=0;N<7;N++){const E=N/7*6.2832;if(V(y+Math.cos(E)*F*1.2,k+Math.sin(E)*F*1.2)<=b)return!1}return!0};for(let y=0;y<14;y++){const k=y%2?1:-1,F=-at-_.range(8,34),N=x.z+k*x.w*_.range(1.2,1.55),E=x.z+k*x.w*_.range(.2,.42),Z=j(N,E,.55),J=new o.Vector3(F,d(F,N)+.12,N),nt=new o.Vector3(F+_.range(-.6,.6),d(F,E)+.1,E);ot.push({p0:J,p1:new o.Vector3(F,d(F,Z)+.3,Z),p2:nt,many:2.4,own:!0});const Y=_.range(1,1.9);q(nt.x,nt.z,Y)&&vt.push(ae(_,nt.x,nt.y+.02,nt.z,Y))}await e.yield();for(let y=0;y<18;y++){const k=y%3>0,F=-at-Tt,N=k?Ft-14:_.range(x.z+x.w*2.2,Ft-14),E=k?_.range(.1,1.75):_.range(-.25,.25),Z=-Math.cos(E),J=Math.sin(E),nt=mt-_.range(2.5,9);let Y=4;const lt=qt=>{const ze=F+Z*qt,Se=N+J*qt;return new o.Vector3(ze,d(ze,Se),Se)};let tt=2;for(;tt<44&&lt(tt).y>nt;)tt+=1.5;for(;Y<34&&(lt(tt+Y).y-lt(tt+Y+1.5).y>.8||lt(tt+Y-1.5).y-lt(tt+Y).y>1);)Y+=1.5;const ft=Y<34&&lt(tt+Y).y>=3;if(!ft)for(Y=10;Y>4&&lt(tt+Y).y<3;)Y-=1;const yt=lt(tt),Jt=lt(tt+Y*.55),kt=lt(tt+Y);if(yt.y-kt.y<2){await e.yield();continue}if(yt.y+=.12,Jt.y+=.3,kt.y+=.1,ot.push({p0:yt,p1:Jt,p2:kt,many:2.4,own:!0}),ft){const qt=_.range(.8,1.4);q(kt.x,kt.z,qt)&&vt.push(ae(_,kt.x,kt.y+.02,kt.z,qt))}y%2&&await e.yield()}await e.yield()}const xt=[];for(const s of["port","port2","star","star2","head"]){const r=await na(H[s].map(b=>(b.deleteAttribute("uv"),b)),()=>e.yield()),d=new o.Mesh(r,M);d.castShadow=!0,d.receiveShadow=!0,d.name="spires-"+s,l.add(d),xt.push(d),await e.yield()}await e.yield();const A=new o.Mesh(te(w,!1),M);A.castShadow=!0,A.receiveShadow=!0,l.add(A);const P=35,L=[17,19,21,23,25],X=ia(a,16),et=new o.InstancedMesh(X,c({drip:!0,drib:!0}),P),Mt=new Float32Array(P*2),Dt=new o.Matrix4,Ht=new o.Quaternion,pt=new o.Vector3,wt=new o.Vector3;let Q=v.top.y-.35,It=v.top.x,Vt=v.top.z,At=O.top.y-.3,Lt=O.top.x,Et=O.top.z,Gt=0;const Yt=22.6/(P-L.length-1),zt=[];for(let s=0;s<P;s++){const r=L.includes(s),d=(r?1.9:j(2.15,1.5,s/(P-1)))*a.range(.92,1.1);Ht.setFromAxisAngle(pt.set(0,1,0),a.range(0,6.28)),r?(Lt+=a.range(-.25,.25),Et+=a.range(-.25,.25),Dt.compose(pt.set(Lt,At,Et),Ht,wt.set(d,d,d)),zt.push({position:new o.Vector3(Lt,At,Et),journeySecond:.9+s*1.2}),At+=d*.66):(It+=a.range(-.3,.3),Vt+=a.range(-.3,.3),Dt.compose(pt.set(It,Q,Vt),Ht,wt.set(d,d,d)),Gt++,Q+=Gt<P-L.length?Yt:.5*d),et.setMatrixAt(s,Dt),Mt[s*2]=.9+s*1.2,Mt[s*2+1]=a()}const Ct=Q;X.setAttribute("aLand",new o.InstancedBufferAttribute(Mt,2)),et.customDepthMaterial=aa(h),et.castShadow=!0,et.receiveShadow=!0,et.frustumCulled=!1,l.add(et),await e.yield();{const s=p.y/Math.max(Nt(p.x,p.z),.001),r=a.fork?a.fork("wall-chutes"):a;for(let d=0;d<22;d++){const b=d%2?1:-1,T=j(96,-44,(d+r.range(0,.9))/22),G=r.range(-1.5,1.5),V=mt-r.range(.5,9),q=r.range(1.6,3.4),y=F=>b*(at-.4+6.2*dt((F-1.7)/(mt-2.4),0,1)-1.4),k=b<0?mt-(46+2*at)*.5*s-2:1e4;U.push({p0:new o.Vector3(y(V),V,T),p1:new o.Vector3(y(j(V,q,.55)),j(V,q,.55),T+G*.6),p2:new o.Vector3(y(q)-b*.8,q,T+G),many:3.6,old:4.2,litY:k})}for(const d of[5,6,7]){const b=C[d];for(let T=0;T<7;T++){const G=Math.min(r.int(2,12),b.blobs.length-1),V=b.blobs[G],q=r.range(4,8),y=r.range(-1.2,1.2),k=Math.cos(y),F=Math.sin(y),N=new o.Vector3(V.x+k*V.r*1.02,V.y+V.h*.14,V.z+F*V.r*1.02);U.push({p0:N,p1:new o.Vector3(N.x+k*.5,N.y-q*.35,N.z+F*.5),p2:new o.Vector3(N.x+k*.8,N.y-q,N.z+F*.8),many:4.6})}}}if(t.breeze??!0)for(let s=1;s<C.length;s++){const r=C[s].top,d=-p.x,b=-p.z,T=Math.max(Nt(d,b),.001),G=d/T,V=b/T;U.push({p0:new o.Vector3(r.x,r.y-.4,r.z),p1:new o.Vector3(r.x+G*5,r.y+.5,r.z+V*5),p2:new o.Vector3(r.x+G*15,r.y-3.5,r.z+V*15),many:3.2})}await e.yield();const St=await Fe(a,U,Math.round(13*u),h,()=>e.yield(),Math.round(24*u));l.add(St),await e.yield();const _t=await Fe(_,ot,Math.round(13*u),h,()=>e.yield());if(_t.name="more-trickles",l.add(_t),vt.length){const s=new o.Mesh(te(vt,!1),m);s.receiveShadow=!0,s.name="saddle-cones",l.add(s)}await e.yield();const bt=new o.Mesh(ha(e),c({hand:!0}));bt.castShadow=!0,bt.receiveShadow=!0,l.add(bt),await e.yield();const Wt=new o.Mesh(ca(e.noise),bt.material);Wt.receiveShadow=!0,Wt.name="corner-cones",l.add(Wt),await e.yield();const He=new o.Color(i[4]).lerp(new o.Color(i[1]),.25),Le=new o.Color(i[6]),ue=[0,1,2,3].map(()=>la(a,He,Le)),pe=[];await e.yield();const me=new o.Vector3,oe=new o.Vector3,se=new o.Vector3,Ee=.42;for(let s=0;s<16;s++){const r=(s+.5)/16*Math.PI*2+a.range(-.05,.05),d=Math.cos(r),b=Math.sin(r),T=Ee+a.range(-.12,.12);oe.set(d*Math.cos(T),b*Math.cos(T),-Math.sin(T)),se.set(d*Math.sin(T),b*Math.sin(T),Math.cos(T)),me.crossVectors(oe,se);const G=.98*a.range(.92,1.08),V=8.7+a.range(-.15,.3);Dt.makeBasis(me,oe,se).scale(wt.set(G,G,G*1.15)).setPosition(ht.x+d*V,ht.y+b*V,ht.z+2.22);const q=ue[s%4].clone().applyMatrix4(Dt),y=q.attributes.position;for(let k=0;k<y.count;k++)y.setZ(k,y.getZ(k)-(y.getX(k)-ht.x)*ce);q.computeVertexNormals(),q.attributes.aD.array.fill(2),pe.push(q),await e.yield()}const Bt=new o.Mesh(te(pe,!1),c({tint:!0,side:o.DoubleSide}));Bt.castShadow=!0,Bt.receiveShadow=!0,Bt.name="cockle-ring",l.add(Bt),ue.forEach(s=>s.dispose()),await e.yield();let ct=null;t.shadowLight!==!1&&(ct=new o.DirectionalLight("#ffffff",t.lightIntensity??0),ct.castShadow=!0,ct.shadow.mapSize.set(2048,2048),ct.shadow.bias=-6e-4,ct.shadow.normalBias=0,l.add(ct),l.add(ct.target));const ve=(s,r,d=165,b=420)=>{if(h.uSunDir.value.copy(s).normalize(),l.updateMatrixWorld(!0),pt.set(ht.x,ht.y,ht.z+2.1),l.localToWorld(pt),h.uMouthW.value.set(pt.x,pt.y,pt.z,1),h.uMouthN.value.set(ce,0,1).normalize().transformDirection(l.matrixWorld),!ct)return;ct.target.position.copy(l.worldToLocal(pt.copy(r))),ct.position.copy(l.worldToLocal(pt.copy(r).addScaledVector(h.uSunDir.value,b)));const T=ct.shadow.camera;T.left=-d,T.right=d,T.top=d,T.bottom=-d,T.near=10,T.far=b*2,T.updateProjectionMatrix(),ct.target.updateMatrixWorld(!0),ct.updateMatrixWorld(!0)};ve(p,new o.Vector3(0,40,0));const Kt=[],we=[],ge=[],Ie=h.uWetC.value,Ve=h.uDryC.value;for(const s of C){const r=Kt.length/3,d=s.blobs.length;for(let b=0;b<=d;b++){const T=s.blobs[Math.min(b,d-1)],G=b===d,V=b%2?Ve:Ie;for(let q=0;q<6;q++){const y=q/6*6.2832+b*.5,k=G?.05:T.r;Kt.push(T.x+Math.cos(y)*k,T.y+(G?T.h:T.h*.4),T.z+Math.sin(y)*k),we.push(V.r,V.g,V.b,b%2?0:1)}if(b<d)for(let q=0;q<6;q++){const y=r+b*6+q,k=r+b*6+(q+1)%6;ge.push(y,y+6,k,k,y+6,k+6)}}}const Rt=new o.BufferGeometry;Rt.setAttribute("position",new o.Float32BufferAttribute(Kt,3)),Rt.setAttribute("aTint",new o.Float32BufferAttribute(we,4)),Rt.setAttribute("aD",new o.Float32BufferAttribute(new Float32Array(Kt.length/3*2),2)),Rt.setIndex(ge),Rt.computeVertexNormals();const Qt=new o.Mesh(Rt,Bt.material);Qt.name="spire-silhouettes",Qt.frustumCulled=!1,await e.yield();const xe=v.top.y,Ge=Ct,_e={portalSeat:it,naveFloorY:0,crestY:mt,naveAxis:[new o.Vector3(0,8,Ft),ht.clone()],flyThrough:st,growingSpire:{foot:new o.Vector3(B,mt,R),topAtArrival:new o.Vector3(v.top.x,xe,v.top.z),topAtLeaving:new o.Vector3(It,Ge,Vt),footRadius:v.R0},dripPass:new o.Vector3(W,42,O.top.z+8),forkLandings:zt,spires:C.map(s=>({arm:s.arm,foot:new o.Vector3(s.x,mt,s.z),tip:new o.Vector3(s.top.x,s.top.y,s.top.z),footRadius:s.R0})),saddle:new o.Vector3(-at-Tt,mt-x.depth,x.z),notch:{through:new o.Vector3(20+21*n.x,11,rt+1.5+4+21*n.y),toward:p.clone()},viewpoints:{reveal:new o.Vector3(0,36,150),nave:new o.Vector3(0,8,10),threeQuarter:new o.Vector3(-150,60,230)},footprint:{halfWidth:86,zFront:131,zBack:-129},crests:[...C.slice(1).flatMap(s=>[.42,.7,1].map(r=>{const d=s.blobs[Math.min(s.blobs.length-1,Math.floor(s.blobs.length*r))];return r===1?{p:new o.Vector3(s.top.x,s.top.y,s.top.z),r:.3}:{p:new o.Vector3(d.x,d.y+d.h*.8,d.z),r:d.r}})),...(g.geometry.userData.crestLine??[]).map(s=>({p:new o.Vector3(s[0],s[1],s[2]),r:0}))]};let jt=t.focus;try{jt=jt??new URLSearchParams(globalThis.location?.search??"").get("cbtFocus")}catch{jt=null}const Zt={grow:[new o.Vector3(B,xe+3,R),9,16],mouth:[new o.Vector3(0,8,rt),20,10],nave:[new o.Vector3(0,26,30),34,30],file:[new o.Vector3(C[10].x,mt+14,C[10].z),13,24],fork:[new o.Vector3(O.top.x,O.top.y+3,O.top.z),5,9]}[jt];let be=!0,$t=0,ne=0,re=null;const ye=t.clockSlack??[6,3],Me=new o.Vector2,Xt={object:l,radius:112,height:122,center:new o.Vector3(0,42,5),anchors:_e,ground:!0,groundY:-.6,sun:ct,reflection:Qt,style:{uniforms:h},sandMaterial:c,slumpDepthMaterial:()=>ea(h),materials:{sand:m,tint:Bt.material,drip:et.material,grains:St.material},meshes:{mound:g,spires:xt,stem:A,drips:et,trickles:St,mouth:bt,shells:Bt},setProgress(s){be=!1,$t=dt(s,0,1),h.uDryClock.value=.52+.36*$t},setSun(s,r,d,b){ve(s,r??l.localToWorld(new o.Vector3(0,40,0)),d,b)},update(s,r,d){if(h.uTime.value=r,be){const b=Math.min(r%46/ie,1);h.uT.value=b*ie,h.uDryClock.value=.52+.36*b}else{const b=$t*ie,T=re===null?0:dt(r-re,0,2);ne=$t<=0?-.3+(r%1.2+1.2)%1.2:dt(ne+T,b-ye[0],b+ye[1]),h.uT.value=ne}re=r,e.renderer&&(e.renderer.getDrawingBufferSize(Me),St.material.uniforms.uViewH.value=Me.y),_t.material.uniforms.uViewH.value=St.material.uniforms.uViewH.value},dispose(){Qt.parent||Rt.dispose(),et.customDepthMaterial&&et.customDepthMaterial.dispose()}};return Zt&&(Xt.center=Zt[0],Xt.radius=Zt[1],Xt.height=Zt[2]),Xt}export{Te as DRIP_GLSL,ie as JOURNEY_SECONDS,Ot as PALETTE,Xe as SHADOW_GLSL,ke as SKY,De as SLUMP_GLSL,le as STYLE,he as STYLE_GLSL,va as buildHero,aa as dripDepthMaterial,Ne as makeStyleUniforms,ma as plumeMesh,ta as sandMaterial,ea as slumpDepthMaterial,pa as sunDirection};
