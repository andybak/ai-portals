import*as r from"three";import{makePath as bt,clamp as j,lerp as Te,smoothstep as T}from"../kit/core.js";import{buildHero as $0}from"../parts/ink-dragon.js";const ke=["#EFE8D8","#D5D1C4","#A3A49D","#5F6462","#2C2F30","#101112","#C8321E"],_e=1.5,zt=68,St=122;function At(h,u,M){const b=x=>(x*(x+.0245786)-90537e-9)/(x*(.983729*x+.432951)+.238081),S=b(.59719*h+.35458*u+.04823*M),p=b(.076*h+.90834*u+.01566*M),k=b(.0284*h+.13383*u+.83777*M);return[1.60475*S-.53108*p-.07367*k,-.10208*S+1.10813*p-.00605*k,-.00327*S-.07276*p+1.07602*k]}function Dt(h,u=1){const M=new r.Color(h),b=[M.r,M.g,M.b],S=[Math.min(M.r,.93),Math.min(M.g,.93),Math.min(M.b,.93)];for(let p=0;p<80;p++){const k=At(b[0]*_e/.6,b[1]*_e/.6,b[2]*_e/.6);for(let x=0;x<3;x++)b[x]=j(b[x]*Math.pow((S[x]+.002)/(Math.max(0,k[x])+.002),.7),1e-4,4)}return new r.Color(b[0]*u,b[1]*u,b[2]*u)}const Y0=(()=>{const h=b=>new r.Matrix3().fromArray(b).invert().elements.map(S=>S.toFixed(6)).join(","),u=h([.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777]);return`
  vec3 toScene(vec3 D){
    vec3 y = clamp(mat3(${h([1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602])})*clamp(D, 0., 0.95), 0.0004, 0.97);
    vec3 A = 0.983729*y - 1., B = 0.432951*y - 0.0245786, Cc = 0.238081*y + 0.000090537;
    vec3 v = (-B - sqrt(max(B*B - 4.*A*Cc, 0.)))/(2.*A);
    return max(mat3(${u})*v, 0.)*${(.6/_e).toFixed(5)};
  }
  // colour and alpha to blend over paper (in scene space) so that the result has the tone of the display-space
  // wash; the ink keeps its own colour, so overlapping strokes simply darken
  vec4 compose(vec3 pap, vec3 col, float alpha){
    vec3 Xi = toScene(col), Xp = toScene(pap), Xm = toScene(mix(pap, col, alpha));
    float den = Xp.g - Xi.g;
    return vec4(Xi, abs(den) < 1e-3 ? alpha : clamp((Xp.g - Xm.g)/den, 0., 1.));
  }
  // the exact answer over bare paper (its colour is only right where nothing else lies underneath)
  vec4 composeTrue(vec3 pap, vec3 col, float alpha){
    vec3 Xp = toScene(pap), Xm = toScene(mix(pap, col, alpha));
    vec3 k = 1. - Xm/max(Xp, 1e-4); float a2 = max(k.r, max(k.g, k.b));
    if (a2 < 0.003) return vec4(toScene(col), alpha);
    a2 = min(a2, 1.); return vec4(max((Xm - Xp*(1. - a2))/a2, 0.), a2);
  }`})(),pe=`
  ${Y0}
  uniform vec3 uPaper, uInk, uInk2, uRed, uMoon;
  uniform vec4 uMist;                 // lo, hi, hide-below 0..1, white-out 0..1
  uniform float uTime, uU, uDur, uVis, uPxs, uSnow, uNight;
  float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
    return mix(mix(hash21(i), hash21(i+vec2(1,0)), f.x), mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), f.x), f.y); }
  float granulate(float dens, vec2 p){ float g = vnoise(p*5.3)*0.55 + vnoise(p*12.1 + 7.)*0.45;
    return dens*(1. - mix(0.3, 0.05, smoothstep(0.55, 1., dens))*(1. - g)); }
  // rice paper, anchored to the screen: long fibres in two directions, fine tooth, faint water stains
  vec3 paperAt(vec2 fc){ vec2 p = fc/uPxs;
    float f = vnoise(p*vec2(0.03, 0.8) + 3.)*0.5 + vnoise(vec2(p.x*0.55 + p.y*0.45, (p.y - p.x*0.8)*0.028) + 11.)*0.5;
    float fine = vnoise(p*0.85 + 40.);
    float stain = vnoise(p*0.0052 + 5.)*0.6 + vnoise(p*0.016 + 9.)*0.4;
    float ring = smoothstep(0.5, 0.56, stain)*(1. - smoothstep(0.56, 0.7, stain));
    // the night sheet carries a pale wash laid in broad, slightly uneven passes (screen-anchored like the paper)
    float pass = vnoise(vec2(p.x*0.0035 + p.y*0.0012, p.y*0.016))*0.6 + vnoise(vec2(p.x*0.011, p.y*0.05) + 17.)*0.4;
    return uPaper*(1. + 0.06*(f - 0.5) + 0.03*(fine - 0.5) - 0.035*smoothstep(0.56, 0.9, stain) - 0.03*ring)*(1. - uNight*0.13*pass); }
  float mistAt(vec3 w){
    float n = vnoise(w.xz*0.0045 + uTime*vec2(0.021, 0.008)) + 0.5*vnoise(w.xz*0.013 - uTime*vec2(0.012, 0.03)) - 0.75;
    float y = w.y + n*30.;
    float band = smoothstep(uMist.x, uMist.x + 22., y)*(1. - smoothstep(uMist.y - 22., uMist.y, y));
    float below = (1. - smoothstep(uMist.y - 30., uMist.y, y))*uMist.z;
    return max(band, below); }
  float farFade(float dist){ return exp(-pow(dist/uVis, 1.6)*2.); }
  float airK(vec3 w, float dist){ return (1. - mistAt(w))*(1. - uMist.w*smoothstep(25., 110., dist))*farFade(dist); }
  vec3 inkCol(float d){ return mix(uInk2, uInk, smoothstep(0.35, 1., d)); }
`,Pt=`
  varying vec3 vDir;
  void main(){ vDir = position; vec4 mv = modelViewMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mv; }`,Ct=`
  ${pe}
  varying vec3 vDir;
  void main(){
    vec3 col = paperAt(gl_FragCoord.xy);
    gl_FragColor = vec4(toScene(col), 1.);
  }`,Vt=`
  varying vec2 vP;
  void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,Ft=`
  ${pe}
  uniform vec4 uSun;                 // strength, cut height in disc radii (-9 = none), moon 0/1, halo
  varying vec2 vP;
  void main(){
    float r = length(vP), pa = atan(vP.y, vP.x + 1e-5);
    float rag = 1. + 0.018*sin(pa*5. + 1.) + 0.012*sin(pa*13. + 4.);
    float cut = smoothstep(uSun.y - 0.03, uSun.y + 0.04 + 0.1*vnoise(vec2(vP.x*5., 3.)), vP.y);
    float disc = (1. - smoothstep(rag*0.955, rag, r))*cut;
    float halo = exp(-r*1.15)*uSun.w*smoothstep(3.2, 1.8, r)*cut;
    vec3 pap = paperAt(gl_FragCoord.xy);
    vec3 col = uSun.z < 0.5 ? uRed*(0.95 + 0.07*vnoise(vP*3.)) : uMoon*(0.97 + 0.05*vnoise(vP*7.));
    float alpha = max(disc, halo)*(1. - uMist.w)*uSun.x;
    if (alpha < 0.004) discard;
    gl_FragColor = compose(pap, col, alpha);
  }`,Z0=`
  ${pe}
  attribute vec4 aInfo;               // inkU, seed, radius, height
  uniform float uRefl;
  varying vec3 vW, vN, vNs, vL; varying vec4 vI; varying float vDist;
  void main(){
    vec3 sc = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
    float tS = (uU - aInfo.x)*uDur;
    float blot = smoothstep(0., 0.3, tS)*(1. - smoothstep(0.7, 1.5, tS));
    vec3 p = position;
    p.xz += normalize(normal.xz + 1e-4)*(2.2*blot/sc.x);                 // the wet blot swells the silhouette
    p.xz += vec2(sin(p.y*3.1 + aInfo.y*37.), cos(p.y*2.3 + aInfo.y*19.))*0.13*p.y;   // each tower leans its own way
    vec4 wp = modelMatrix*instanceMatrix*vec4(p, 1.);
    if (uRefl > 0.5) { wp.x += sin(wp.y*0.21 + uTime*1.7 + aInfo.y*9.)*1.6*smoothstep(0., -30., wp.y); wp.z += sin(wp.y*0.17 - uTime*1.3)*1.1*smoothstep(0., -30., wp.y); }
    vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*(normal/(sc*sc)));
    // the tone follows the column, not its facets: a normal leaning mostly on the tower's axis
    vNs = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*(mix(normal, normalize(vec3(position.x, 0.08, position.z) + 1e-4), 0.72)/(sc*sc)));
    vW = wp.xyz; vL = position; vI = aInfo; vDist = distance(cameraPosition, wp.xyz);
    gl_Position = projectionMatrix*viewMatrix*wp;
  }`,J0=`
  ${pe}
  uniform float uRefl; uniform vec3 uSunDir, uSunUp, uSunK;        // uSunK: cos of the seal's window, tan of its radius, its cut height
  varying vec3 vW, vN, vNs, vL; varying vec4 vI; varying float vDist;
  void main(){
    float seed = vI.y, h = vL.y, wy = abs(vW.y);
    vec3 N = normalize(vN), V = normalize(cameraPosition - vW); if (!gl_FrontFacing) N = -N;
    float ndv = abs(dot(N, V)), ndvS = abs(dot(normalize(vNs), V));
    vec2 q = vec2(atan(vL.z, vL.x)*vI.z, h*vI.w);                      // metres on the rock, object-anchored
    // near the eye the tone must not follow the mesh: the facing term is broken up by a wash-sized noise, and the
    // silhouette is nibbled so it is a brush edge, not a polygon edge
    float ndv2 = clamp(ndvS + 0.4*(vnoise(q*0.045 + seed*3.)*0.65 + vnoise(q*0.16 + seed*11.)*0.35 - 0.5), 0., 1.);
    if (uRefl < 0.5 && ndv < 0.13*vnoise(q*0.3 + seed)) discard;
    // the front bleeds across the tower instead of popping
    float bleed = (vnoise(q*0.02 + seed*13.)*0.7 + vnoise(q*0.07 + seed*5.)*0.3)*1.0 + (1. - h)*0.3;
    float tS = (uU - vI.x)*uDur - bleed - uRefl*0.8;
    float wet = smoothstep(0., 0.4, tS), dry = smoothstep(0.55, 1.25, tS), settle = smoothstep(0.6, 2.6, tS);
    // below the mist deck a cliff darkens upward into the mist; above it a peak is darkest at its crest
    float low = (0.3 + 0.7*smoothstep(0., 6., wy))*(0.66 + 0.34*smoothstep(0., 46., wy));
    float crestA = smoothstep(uMist.y - 28., max(vI.w*0.94, uMist.y + 45.), wy);
    float sel = smoothstep(70., 112., wy)*(1. - uRefl);
    float crest = mix(low*0.85, mix(crestA, crestA*crestA, 0.35), sel);
    float body = mix(1.05*low, 0.2 + 0.95*crest, sel);
    // snow: paper left on the crests, the dark gathered at the foot
    float snowTop = uSnow*smoothstep(0.1, 0.55, N.y + (h - 0.75)*0.8 + 0.25*vnoise(q*0.08));
    body = mix(body, 0.3 + 0.6*(1. - crest), uSnow*0.8);
    // dry-brush: bristle tracks running down the rock, drier toward the foot
    float st = vnoise(vec2(q.x*0.2, q.y*0.03) + seed*31.)*0.6 + vnoise(vec2(q.x*0.75, q.y*0.085) + seed*7.)*0.4;
    float dk = mix(0.62, 0.22, crest);
    float keep = smoothstep(dk - 0.22, dk + 0.12, st);
    float full = body*mix(0.42, 1., keep);
    // creases: a few dark vertical strokes and shelf lines
    full += 0.3*smoothstep(0.7, 0.78, vnoise(vec2(q.x*0.4 + seed*3., q.y*0.016)))*(0.3 + 0.7*crest);
    full += 0.22*smoothstep(0.78, 0.84, vnoise(vec2(q.x*0.03 + seed, q.y*0.22)))*crest*smoothstep(0.35, 0.6, vnoise(vec2(q.x*0.12, q.y*0.3 + seed)));   // shelf lines, broken into dashes
    // wet edge: ink pools at the silhouette
    full += 0.7*smoothstep(0.5, 0.95, 1. - ndv2)*(0.35 + 0.65*crest)*mix(0.22, 1., smoothstep(40., 170., vDist));
    // close to, the wash is carried by brush texture instead: broad uneven passes of the loaded brush
    full *= mix(0.78 + 0.44*vnoise(vec2(q.x*0.05 + seed*9., q.y*0.022)), 1., smoothstep(60., 220., vDist));
    full *= 1. - snowTop;
    full = granulate(clamp(full, 0., 1.), q*0.35 + seed)*(1. + 0.035*sin(uTime*1.3 + q.x*0.6 + q.y*0.4));
    float ghost = mix(0.24 + 0.08*fract(seed*7.7), 0.17 + 0.06*fract(seed*7.7), sel)*smoothstep(0.0, 0.18, ndv2)*0.88;
    float blot = 0.62*smoothstep(0.0, 0.5, ndv2)*(0.5 + 0.5*crest)*(0.85 + 0.3*vnoise(q*0.05 + uTime*0.2));
    float d = mix(ghost, blot, wet);
    d = mix(d, full*(0.9 + 0.1*settle), dry);
    d = mix(d, floor(d*5. + 0.5 + 0.45*(vnoise(q*0.8 + seed*3.) - 0.5))/5., mix(0.1, 0.3, smoothstep(60., 250., vDist)));                            // five tones, softly
    if (uRefl > 0.5) {   // only inked rock is mirrored, and the mirror is broken into horizontal dashes sliding on the water
      vec2 sp = gl_FragCoord.xy/uPxs;
      float bar = vnoise(vec2(sp.x*0.011 + uTime*0.22 + seed*9., sp.y*0.2 - uTime*0.5));
      d *= dry*0.8*exp(-wy/34.)*smoothstep(0.46 + 0.14*smoothstep(0., 50., wy), 0.7, bar)*smoothstep(0.03, 0.45, ndv); }
    else d *= 1. - mistAt(vW)*smoothstep(15., 90., vDist);            // inside the deck, what is close still shows
    float ff = farFade(vDist);
    if (uRefl < 0.5 && ff < 0.03) discard;                             // a peak faded to bare paper must not cover the seal
    d *= (1. - uMist.w*smoothstep(70., 260., vDist))*ff;
    d = clamp(d, 0., 1.);
    // where a wall is lost in mist it is bare paper, and the seal painted on that paper shows
    float sa = dot(-V, uSunDir);
    if (uRefl < 0.5 && d < 0.3 && sa > uSunK.x && dot(-V, uSunUp)/(max(sa, 0.5)*uSunK.y) > uSunK.z) discard;
    gl_FragColor = vec4(toScene(mix(paperAt(gl_FragCoord.xy), inkCol(d), d)), 1.);
  }`,Ut=`
  attribute vec2 aR;                  // height fraction, seed
  varying vec3 vW; varying vec2 vR; varying float vDist, vAlong;
  void main(){ vec4 wp = modelMatrix*vec4(position, 1.); vW = wp.xyz; vR = aR; vAlong = uv.x; vDist = distance(cameraPosition, wp.xyz);
    gl_Position = projectionMatrix*viewMatrix*wp; }`,It=`
  ${pe}
  uniform vec3 uSunDir, uSunUp, uSunK;
  varying vec3 vW; varying vec2 vR; varying float vDist, vAlong;
  void main(){
    vec3 ray = normalize(vW - cameraPosition); float sa = dot(ray, uSunDir);
    if (sa > uSunK.x && dot(ray, uSunUp)/(max(sa, 0.5)*uSunK.y) > uSunK.z) discard;     // the seal is stamped over the far ridges, never cut by them
    float h = vR.x;
    float crest = smoothstep(0.15, 1., h); crest *= crest;
    float st = vnoise(vec2(vAlong*0.06, vW.y*0.02) + vR.y*17.);
    float full = crest*(0.55 + 0.45*smoothstep(0.2, 0.6, st)) + 0.25*smoothstep(0.93, 1., h);
    float front = smoothstep(0.45, 0.66, uU + 0.06*vnoise(vec2(vAlong*0.004, vR.y)));
    float d = mix(0.16*smoothstep(0.1, 0.8, h), full, front);
    d *= (1. - mistAt(vW))*(1. - uMist.w)*farFade(vDist);
    gl_FragColor = vec4(toScene(mix(paperAt(gl_FragCoord.xy), inkCol(d), clamp(d, 0., 1.))), 1.);
  }`,Rt=`
  ${pe}
  attribute vec4 iA, iB, iC, iD;
  uniform vec3 uAnim[4]; uniform vec4 uDrift; uniform vec3 uWrap, uVel;
  uniform float uGrow, uPix;
  varying vec2 vUv; varying vec4 vK; varying vec3 vX;      // vX: air factor, reveal, thin compensation
  void main(){
    vec3 base = iA.xyz + uAnim[int(iD.w + 0.5)]; float seed = iA.w, life = 1.;
    if (iD.z != 0.) { float f = fract(uTime*iD.z/uDrift.w + seed*7.31); base += uDrift.xyz*(f - 0.5)*uDrift.w; life = smoothstep(0., 0.12, f)*(1. - smoothstep(0.88, 1., f)); }
    vec3 wb = (modelMatrix*vec4(base, 1.)).xyz;
    if (uWrap.x > 0.) { wb = cameraPosition + mod(wb + uVel*uTime - cameraPosition + uWrap*0.5, uWrap) - uWrap*0.5;
      vec3 e = abs(wb - cameraPosition)/(uWrap*0.5); life *= (1. - smoothstep(0.8, 1., max(e.x, max(e.y, e.z))))*smoothstep(3., 10., distance(wb, cameraPosition)); }
    float ms = length(modelMatrix[0].xyz), hl = length(iB.xyz), hw = iB.w*ms;
    vec3 wdir = normalize(mat3(modelMatrix)*(iB.xyz/max(hl, 1e-4)));
    float u01 = position.x*0.5 + 0.5, kind = iC.y;
    if (kind > 6.5 && kind < 7.5) { float g = fract(uTime*0.22 + seed*5.); hl *= 0.12 + 0.88*g; hw *= 0.12 + 0.88*g; life *= pow(1. - g, 1.3)*smoothstep(0., 0.08, g); }
    vec3 P = wb + wdir*position.x*hl*ms;
    float sw = abs(iC.w);
    if (sw > 0.) { vec3 s = vec3(sin(uTime*1.25 + wb.x*0.06 + wb.z*0.03), 0., cos(uTime*0.95 + wb.z*0.05))*sw;
      s += vec3(sin(uTime*4.3 + seed*40.), 0.4*cos(uTime*3.7 + seed*23.), 0.)*sw*0.1;
      P += s*(iC.w < 0. ? u01*u01 : 1.); }
    float dist = distance(cameraPosition, P), thin = 1.;
    if (iD.x > 1.5) {
      vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
      float m = max(1., dist*uPix/max(hw, 1e-4)); m = min(m, 3.); thin = 1./(m*m);
      P = wb + (right*position.x*hl*ms + up*position.y*hw)*m + (P - wb - wdir*position.x*hl*ms);
    } else {
      vec3 side = iD.x > 0.5 ? normalize(cross(wdir, vec3(0., 1., 0.)) + 1e-5) : normalize(cross(wdir, cameraPosition - P));
      float use = max(hw, min(dist*uPix, hw*5.)); thin = hw/use;
      P += side*position.y*use;
    }
    float tS = (uU - iC.z)*uDur;
    vX = vec3(airK(P, dist)*life, iC.z < 0. ? 1. : clamp(tS/uGrow, 0., 1.), thin);
    vUv = vec2(u01, position.y); vK = vec4(kind, iC.x, seed, iD.y);
    gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.);
  }`,Q0=`
  ${pe}
  uniform float uGhost;
  varying vec2 vUv; varying vec4 vK; varying vec3 vX;
  void main(){
    float u = vUv.x, v = vUv.y, kind = vK.x, dens = vK.y, seed = vK.z, alpha = 0.;
    vec3 col = vec3(0.); float paperK = 0., own = 0.;
    vec2 p = vec2(u*2. - 1., v); float r = length(p), ang = atan(p.y, p.x + 1e-5);
    if (kind < 0.5 || (kind > 3.5 && kind < 4.5) || kind > 9.5) {
      // a stroke: fat where the brush lands, flicked thin at the end; leaf dabs are pointed at both ends
      float prof = kind > 3.5 && kind < 4.5 ? pow(sin(3.14159*clamp(u, 0., 1.)), 0.7)*(1. - 0.35*u) : mix(0.55, 1., smoothstep(0., 0.14, u))*(1. - 0.72*smoothstep(0.45, 1., u));
      float n1 = vnoise(vec2(u*9. + seed*17., v*2. + seed*5.));
      float edge = 1. - smoothstep(prof*(0.72 + 0.2*n1), prof, abs(v));
      float dryK = vK.w*smoothstep(0.15, 1., u)*1.1;
      float st = vnoise(vec2(u*2.2 + seed*31., v*5. + seed*13.))*0.7 + vnoise(vec2(u*14., v*11. + seed))*0.3;
      float keep = smoothstep(dryK - 0.16, dryK + 0.1, st + 0.12);
      float cap = smoothstep(0., 0.05, u)*smoothstep(0., 0.03, 1. - u);
      float d = granulate(clamp(dens*(0.9 + 0.1*smoothstep(0.4, 0.9, abs(v)/max(prof, 0.01))), 0., 1.), vec2(u*20., v*3.) + seed*37.);
      alpha = d*edge*keep*cap*mix(1., vX.z, 0.6);
      if (kind > 9.5) { paperK = 1. - smoothstep(prof*0.45, prof*0.72, abs(v)); alpha = max(alpha, paperK*edge*cap); dens = 0.55; }
    } else if (kind < 3.5) {
      float R = 0.8 + 0.06*sin(ang*3. + seed*20.) + 0.04*sin(ang*7. + seed*50.);
      alpha = (1. - smoothstep(R - 0.14, R, r))*min(dens, 1.);
      if (kind > 2.5) { paperK = 1. - smoothstep(R - 0.45, R - 0.22, r); dens = 0.5; alpha = 1. - smoothstep(R - 0.14, R, r); }
      else if (kind > 1.5) { own = 1.; col = uRed*max(dens, 1.)*(0.9 + 0.2*smoothstep(0.9, 0.2, r)); }
      else alpha *= 0.82 + 0.18*vnoise(p*3. + seed*9.);
      alpha *= vX.z;
    } else if (kind < 5.5) {
      paperK = 1.; alpha = dens*exp(-(p.x*p.x*2.2 + p.y*p.y*3.2))*(0.55 + 0.6*vnoise(vec2(u*3. + seed*9. + uTime*0.03, v*1.5)));
      alpha *= smoothstep(1., 0.7, r);
    } else if (kind < 6.5) {
      float st = vnoise(vec2(u*5. + seed*11., v*6. + seed*3.));
      alpha = dens*exp(-(p.x*p.x*1.6 + p.y*p.y*2.6))*(0.5 + 0.7*st)*smoothstep(1., 0.75, max(abs(p.x), abs(p.y)));
      dens *= 0.6;
    } else if (kind < 7.5) {
      float band = 1. - smoothstep(0.03, 0.09, abs(r - 0.82));
      alpha = dens*band*smoothstep(0.2, 0.55, vnoise(vec2(ang*2.5 + seed*9., r*3.)));
    } else if (kind < 8.5) {
      own = 1.; col = uRed*(1. + 0.3*exp(-r*r*8.)); alpha = dens*exp(-r*r*4.5)*smoothstep(1., 0.7, r);
    } else {
      // crescent: a stroke bowed across its width (hulls, eaves, hats, a leaping back)
      float c = vK.w*(1. - p.x*p.x)*0.62 - vK.w*0.3;
      float th = 0.34*(0.45 + 0.55*sqrt(max(0., 1. - p.x*p.x)));
      float n1 = vnoise(vec2(u*7. + seed*17., v*3.));
      alpha = (1. - smoothstep(th*(0.7 + 0.25*n1), th, abs(v - c)))*granulate(min(dens, 1.), vec2(u*16., v*4.) + seed*3.);
    }
    float grow = vX.y;
    alpha *= mix(uGhost, 1., smoothstep(0., 0.12, grow*1.12 - u*(grow < 1. ? 1. : 0.)))*vX.x;
    if (alpha < 0.004) discard;
    vec3 pap = paperAt(gl_FragCoord.xy);
    if (own < 0.5) col = mix(inkCol(dens), pap, paperK);
    // alpha is meant in display space; the blend happens in scene space, so convert the coverage
    gl_FragColor = paperK > 0.5 ? vec4(toScene(col), alpha) : compose(pap, col, alpha);
  }`,Tt=`
  ${pe}
  attribute vec4 iA, iB, iC, iD, iE;
  uniform vec3 uFlockPos[2], uFlockFwd[2]; uniform float uPix, uFlapW, uSize;
  varying vec2 vUv; varying vec4 vK; varying vec3 vX;
  vec2 rot(vec2 q, float a){ float c = cos(a), s = sin(a); return vec2(c*q.x - s*q.y, s*q.x + c*q.y); }
  void main(){
    int k = int(iD.w + 0.5); float ph = iE.x, side = iC.z;
    vec3 fwd = normalize(uFlockFwd[k]), right = normalize(cross(fwd, vec3(0., 1., 0.))), up = cross(right, fwd);
    vec3 l = iA.xyz, ax = iB.xyz;
    if (side != 0.) {
      float glide = smoothstep(0.55, 0.9, sin(uTime*0.23 + ph*1.7));              // now and then they hold a glide
      float a1 = side*(0.12 + 0.62*sin(uTime*uFlapW + ph)*(1. - 0.8*glide));
      vec2 sh = vec2(side*0.45, 0.15), wr = sh + rot(vec2(side*2.75, 0.), a1);
      if (iC.w > 0.5) { float a2 = a1 + side*0.55*sin(uTime*uFlapW + ph - 1.1)*(1. - 0.8*glide);
        l.xy = wr + rot(l.xy - (sh + vec2(side*2.75, 0.)), a2); ax.xy = rot(ax.xy, a2); }
      else { l.xy = sh + rot(l.xy - sh, a1); ax.xy = rot(ax.xy, a1); }
    }
    vec3 off = iD.xyz + vec3(sin(uTime*0.31 + ph*2.)*1.6, sin(uTime*0.83 + ph)*0.9 + 0.35*sin(uTime*uFlapW + ph + 1.6), sin(uTime*0.27 + ph*3.)*2.);
    vec3 C = uFlockPos[k] + right*off.x + up*off.y + fwd*off.z;
    vec3 base = C + (right*l.x + up*l.y + fwd*l.z)*uSize;
    vec3 wax = (right*ax.x + up*ax.y + fwd*ax.z)*uSize; float hl = length(wax); vec3 wdir = wax/max(hl, 1e-4);
    float hw = iB.w*uSize, dist = distance(cameraPosition, base), thin = 1.;
    vec3 P;
    if (iE.y > 1.5) { vec3 r2 = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), u2 = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
      float m = clamp(dist*uPix/max(hw, 1e-4), 1., 3.); thin = 1./(m*m);
      P = base + (r2*position.x*hl + u2*position.y*hw)*m;
    } else { P = base + wdir*position.x*hl;
      vec3 sd = normalize(cross(wdir, cameraPosition - P)); float use = max(hw, min(dist*uPix, hw*5.)); thin = hw/use; P += sd*position.y*use; }
    vX = vec3(airK(P, dist), 1., thin);
    vUv = vec2(position.x*0.5 + 0.5, position.y); vK = vec4(iC.y, iC.x, iA.w, iE.z);
    gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.);
  }`;function et(){const h=new r.InstancedBufferGeometry;return h.setAttribute("position",new r.Float32BufferAttribute([-1,-1,0,1,-1,0,-1,1,0,1,1,0],3)),h.setIndex([0,1,2,1,3,2]),h.boundingSphere=new r.Sphere(new r.Vector3,1e5),h}function Y(){const h=[],u=[],M=[],b=[],S={count:0,add(p){const k=p.p,x=p.a;h.push(k[0],k[1],k[2],p.seed??S.count*.61803%1),u.push(x[0],x[1],x[2],p.w),M.push(p.d??1,p.kind??0,p.inkU??-1,p.sway??0),b.push(p.mode??0,p.dry??0,p.drift??0,p.anim??0),S.count++},line(p,k,x,q={}){S.add({...q,p:[(p[0]+k[0])/2,(p[1]+k[1])/2,(p[2]+k[2])/2],a:[(k[0]-p[0])/2,(k[1]-p[1])/2,(k[2]-p[2])/2],w:x})},dot(p,k,x,q={}){S.add({...q,p,a:[k,0,0],w:x,mode:2,kind:q.kind??1})},geometry(){const p=et();return p.setAttribute("iA",new r.InstancedBufferAttribute(new Float32Array(h),4)),p.setAttribute("iB",new r.InstancedBufferAttribute(new Float32Array(u),4)),p.setAttribute("iC",new r.InstancedBufferAttribute(new Float32Array(M),4)),p.setAttribute("iD",new r.InstancedBufferAttribute(new Float32Array(b),4)),p.instanceCount=S.count,p}};return S}async function m0(h,u,M=40,b=30,S=null){const p=[],k=[],x=[];for(let Z=0;Z<=b;Z++){S&&(Z&7)===7&&await S();const W=Z/b,ie=[];for(let U=0;U<M;U++){const _=U/M*Math.PI*2,G=Math.cos(_),re=Math.sin(_),fe=j(u.ht+.22*h.n2(G*.9+u.off,re*.9),.2,.9),X=Math.min(1,W+.07*(.5+.5*Math.sin(_*2+u.off))*W),be=X>fe?Math.pow(Math.max(0,1-Math.pow((X-fe)/(1-fe),u.sq??2)),u.pow??.55):1,I=1-.38*T(.1,.7,h.n2(G*1.6+u.off,re*1.6+3))*T(fe-.12,fe+.1,X),Be=h.fbm3(G*1.25+u.off,W*u.fy,re*1.25,3),We=1-Math.abs(h.n3(G*3.1+u.off,W*u.fy*3,re*3.1)),t0=Math.sin(W*u.shelves*6.283+Be*2.5)>.55?1:0,ze=Math.max(0,(1-u.taper*Math.pow(W,1.4))*be*I*(1+.26*Be+.14*(We-.6)+.07*t0)*(1+.12*Math.pow(1-W,5)));ie.push(ze),p.push(Math.cos(_)*ze,W,Math.sin(_)*ze)}x.push(ie)}for(let Z=0;Z<b;Z++)for(let W=0;W<M;W++){const ie=Z*M+W,U=Z*M+(W+1)%M,_=ie+M,G=U+M;k.push(ie,_,U,U,_,G)}S&&await S();const q=new r.BufferGeometry;return q.setAttribute("position",new r.Float32BufferAttribute(p,3)),q.setIndex(k),q.computeVertexNormals(),q.boundingSphere=new r.Sphere(new r.Vector3,1e5),{geo:q,rad:x,RS:M,HS:b}}var qt={id:"ink-dragon",name:"Mountains of Wet Ink",category:"wilderness",weirdness:.5,media:["air"],async build(h){const u=h.rng,M=h.noise,b=h.vary||{},S=j(b.density??1,.7,1.3),p=new r.Scene,k=b.hour==="night"?"night":b.hour==="golden"?"evening":b.hour==="dawn"||b.hour==="day"?"morning":(()=>{const e=u();return e<.45?"morning":e<.75?"evening":"night"})(),x=(()=>{const e=u();return e<.3?"clear":e<.5?"autumn":e<.68?"spring":e<.85?"snow":"rain"})(),q=u.chance(.65)?"raft":"skiff",Z=u.chance(.7)?"cranes":"geese",W=u.chance(.6)?"carp":"dolphin",ie=!!b.rare,U=k==="night",_=x==="rain",G=x==="snow",re=U?"#A4A7A5":k==="evening"?"#DAD6CB":G?"#ECEAE1":"#EFE8D8",fe={paper:Dt(re)},X={paper:new r.Color(re),moon:new r.Color("#EFE9DC"),ink:new r.Color(ke[5]),ink2:new r.Color(ke[4]),red:new r.Color(ke[6])},be=48,I={uPaper:{value:X.paper},uInk:{value:X.ink},uInk2:{value:X.ink2},uRed:{value:X.red},uMoon:{value:X.moon},uMist:{value:new r.Vector4(_?50:zt,St,0,0)},uTime:{value:0},uU:{value:0},uDur:{value:be},uVis:{value:900},uPxs:{value:1},uSnow:{value:G?1:0},uNight:{value:U?1:0}},Be=_?.55:U?.85:1,We=u.range(.6,1.4),t0=u.range(.6,1.4),ze=u.range(-1,1),P=bt([[-62,6,25],[-30,6,-40],[-9*We,6,-105],[-13*t0,6,-175],[4+5*ze,6,-250],[12,7,-335],[20,16,-415],[27,60,-480],[18,125,-545],[-8,185,-610],[-28,218,-685],[-30,228,-785],[-14,230,-895],[-8,228,-1005],[-3,226,-1105],[0,225,-1165],[0,225,-1215],[0,225,-1265]]),J=new r.Vector3(0,225,-1265),n0={x:70+u.range(-8,8),z:-1065+u.range(-15,15),H:262,R:31},a0=k==="evening"?8.5:U?17:12,tt=k==="evening"?3.2:U?15:5,ge=P.pointAt(.64),Se=Math.atan2(n0.x-ge.x,-(n0.z-ge.z))+u.range(.09,.12),g0=[0].map(e=>P.pointAt(e)),nt=Math.tan(r.MathUtils.degToRad(a0-(k==="evening"?.4:3.1))),at=Math.tan(r.MathUtils.degToRad(a0-(k==="evening"?.4:1.6))),Ke=(e,t,n,a,s=!1)=>{{const l=g0[0],c=Math.max(1,Math.hypot(e-l.x,t-l.z));if(c<1750&&w0(e,t,l.x,l.z)<(s?.05+n*1.15/c:.06+n*1.5/c)&&(s?Math.min(a,60)>6+c*at:a>6+c*nt))return!0}const i=Math.hypot(e-ge.x,t-ge.z);return w0(e,t,ge.x,ge.z)<.07+n/i&&a>225+i*.035},w0=(e,t,n,a)=>{let s=Math.atan2(e-n,-(t-a))-Se;return s=Math.atan2(Math.sin(s),Math.cos(s)),Math.abs(s)},y0=[X.paper,new r.Color(ke[1]),new r.Color(ke[2]),new r.Color(ke[3]),X.ink2,X.ink,X.red],x0={paper:X.paper,glsl:Y0.replace("vec4 compose(","vec4 composeLum(")+`
  vec4 compose(vec3 p, vec3 c, float a){ return mix(composeLum(p, c, a), composeTrue(p, c, a), 0.3); }
`};await h.yield();const le=new r.Vector3(J.x,J.y-60,J.z),K=n0,M0=[[30,95,260],[4,52,60],[-8*We,36,-120],[6,48,-300],[26,60,-430],[38,112,-500],[58,215,-620],[40,262,-745],[70,276,-905],[K.x-45,262,K.z+10],[K.x,256,K.z-45],[K.x+45,258,K.z],[K.x,268,K.z+46],[50,260,-1010],[10,247,-1055]],k0=e=>[e[0]-le.x,e[1]-le.y,e[2]-le.z],H=await $0(h,{palette:y0,droplets:800,tone:x0,course:M0.map(k0)});H.object.position.copy(le),p.add(H.object);const qe=H.timing;await h.yield();const Ae=(e=>{const t=new r.CatmullRomCurve3(e.anchors.course.map(n=>new r.Vector3(n[0]+le.x,n[1]+le.y,n[2]+le.z)),!1,"centripetal");return t.arcLengthDivisions=1500,t})(H),ot=Ae.getLength();await h.yield();const de=e=>{const t=Ae.points.length,n=Ae.getLengths(),a=e/(t-1)*(n.length-1),s=Math.min(n.length-2,Math.floor(a));return n[s]+(n[s+1]-n[s])*(a-s)},o0=.745,Ee=[[0,de(1)-120],[.14,de(2)-30],[.2,de(3)-40],[.36,de(3)+400],[.44,de(7)+40],[.505,de(9)],[.585,de(12)],[.625,de(15)],[o0,qe.flickTravel],[.88,qe.endTravel],[1.01,qe.endTravel]],s0=e=>{e=j(e,0,1);let t=0;for(;t<Ee.length-2&&e>Ee[t+1][0];)t++;const n=Ee[t],a=Ee[t+1];return n[1]+(a[1]-n[1])*j((e-n[0])/(a[0]-n[0]),0,1)},b0=e=>(s0(e-.012)+s0(e)*2+s0(e+.012))/4,i0=(e,t)=>Ae.getPointAt(j(b0(e)/ot,0,1),t);let E=null;if(ie){const e=[...y0];e[4]=new r.Color("#A9A69C"),e[5]=new r.Color("#7C7A72");const t=M0.map((n,a)=>{const s=a%2?1:-1,i=a<2?.3:1;return[n[0]+s*26*i,n[1]+(a%3-1)*14*i+6,n[2]+30]});E=await $0(h,{palette:e,tone:x0,droplets:300,ensoRadius:10.6,girth:.85,redEye:!1,course:t.map(k0)}),E.object.position.copy(le).add(new r.Vector3(0,0,-.6)),E.timing2=E.timing,p.add(E.object)}await h.yield();const O=220,st=18,Q=new Float32Array((O+1)*3),r0=new Float32Array((O+1)*3),z0=new Float32Array(O+1),V=new r.Vector3;for(let e=0;e<=O;e++){const t=e/O;P.pointAt(t,V),Q.set([V.x,V.y,V.z],e*3),i0(t,V),r0.set([V.x,V.y,V.z],e*3),z0[e]=240*T(-.08,.02,t)+660*T(.42,.62,t)}const we=(e,t,n=0)=>{const a=Math.hypot(e-Q[0],t-Q[2])-n;if(a<125)return-.2;for(let s=-st;s<0;s++)if(a<240*T(-.08,.02,s/O))return s/O;for(let s=0;s<=O;s++){const i=s*3;if(Math.hypot(e-Q[i],t-Q[i+2])-n<z0[s]||Math.hypot(e-r0[i],t-r0[i+2])-n<120)return s/O}return 2},se=[];for(let e=0;e<=260;e++)Ae.getPointAt(e/260,V),se.push(V.x,V.y,V.z);const S0=(e,t,n,a)=>{for(let s=0;s<=O;s++){const i=s*3;if(Q[i+1]<a+35&&Math.hypot(e-Q[i],t-Q[i+2])<n*1.2+30)return!1}for(let s=0;s<se.length;s+=3)if(se[s+1]<a+14&&Math.hypot(e-se[s],t-se[s+2])<n*1.15+22)return!1;return!0},l0=(e,t)=>{let n=1e9;for(let a=0;a<=O;a++){const s=a*3;if(Q[s+1]>130)break;n=Math.min(n,Math.hypot(e-Q[s],t-Q[s+2]))}return n},d0=[{ht:.62,taper:.26,fy:3.2,off:u.range(0,50),shelves:4,pow:.62,sq:1.7},{ht:.78,taper:.12,fy:2.2,off:u.range(0,50),shelves:2.5,pow:.5},{ht:.6,taper:.34,fy:4,off:u.range(0,50),shelves:5,pow:.5,sq:2.2}],c0=()=>h.yield(),Le=[],Ne=[],Xe=[];for(const e of d0)Le.push(await m0(M,e,40,30,c0)),await h.yield();for(const e of d0)Ne.push(await m0(M,e,56,42,c0)),await h.yield();for(const e of d0)Xe.push(await m0(M,e,20,18,c0)),await h.yield();const ee=[],De=(e,t,n,a,s={})=>{const i={x:e,z:t,R:n,H:a,rot:u.range(0,6.283),v:s.v??u.int(0,2),ax:u.range(.6,1.4),az:u.range(.6,1.4),seed:u(),river:s.river||!1};return i.river&&(i.ax=.8+(i.ax-.6)*.5625,i.az=.8+(i.az-.6)*.5625),i.inkU=s.inkU??we(e,t,n*.8),i.far=!i.river&&P.nearestXZ(e,t).dist>520,ee.push(i),i},L=u.fork("towers"),te=new r.Vector3,B=(e,t,n=[])=>{const a=Math.min(e,430);P.posAtDist(a,V),P.tangentAtDist(a,te);const s=Math.hypot(te.x,te.z)||1,i=te.x/s,l=te.z/s,c=e-a;return n[0]=V.x+i*c-l*t,n[1]=0,n[2]=V.z+l*c+i*t,n[3]=i,n[4]=l,n},A0=(e,t,n)=>{if(l0(e,t)<n*.95+26)return!1;for(let a=0;a<se.length;a+=3)if(se[a+1]<130&&Math.hypot(e-se[a],t-se[a+2])<n+12)return!1;return!0};for(let e=-60;e<560;e+=L.range(30,46))for(const t of[-1,1]){if(L.chance(.04))continue;P.posAtDist(Math.min(e,430),V),P.tangentAtDist(Math.min(e,430),te);const n=Math.max(0,e-430),a=L.range(24,46),s=L.chance(.25)?L.range(330,480):L.range(150,330),i=-te.z,l=te.x,c=Math.hypot(i,l)||1,d=48+a*.9+L.range(0,18),f=V.x+i/c*d*t+te.x/c*n,z=V.z+l/c*d*t+te.z/c*n;l0(f,z)<46+a||!S0(f,z,a,s)||Ke(f,z,a,s,!0)||De(f,z,a,s,{river:!0})}await h.yield();for(const[e,t]of[[178,-57],[128,55]]){const n=L.range(22,26)*(t>0?.9:1),a=L.range(200,270);for(let s=0;s<4;s++){const i=B(e,t+Math.sign(t)*s*10);if(Ke(i[0],i[2],n,a,!0)||!A0(i[0],i[2],n))continue;const l=De(i[0],i[2],n,a,{river:!0,v:1,inkU:-.2});l.ax=l.az=1,l.gate=!0;break}}await h.yield();for(const e of[70,125,180,235,290,345,400]){const t=B(e,85);if(ee.some(s=>s.river&&Math.hypot(s.x-t[0],s.z-t[2])<56))continue;const n=L.range(26,38),a=L.range(160,320);for(let s=0;s<5;s++){const i=B(e+s%2*18,50+n*.9+s*12);if(!(Ke(i[0],i[2],n,a,!0)||!A0(i[0],i[2],n))){De(i[0],i[2],n,a,{river:!0}).bank=!0;break}}}{const e=g0[0],t=P.pointAt(.035,V),n=Math.atan2(t.x-e.x,-(t.z-e.z));for(const a of ee){if(!a.river)continue;let s=Math.atan2(a.x-e.x,-(a.z-e.z))-n;s=Math.abs(Math.atan2(Math.sin(s),Math.cos(s))),(a.inkU<=0||s<.45&&Math.hypot(a.x-e.x,a.z-e.z)<360)&&(a.inkU=Math.min(a.inkU,-.2))}}await h.yield();const Ge=De(K.x,K.z,K.R,K.H,{v:0});Ge.ax=Ge.az=1;for(let e=0;e<2600&&ee.length<157;e++){(e&63)===63&&await h.yield();const t=L.range(0,6.283),n=130+2350*Math.pow(L(),1.45),a=Math.cos(t)*n,s=-820+Math.sin(t)*n,i=L.range(28,70)*(1+n/3200),l=Math.min(520,L.range(150,430)+n*.05);if(l0(a,s)<72+i||!S0(a,s,i,l)||Math.abs(a)<58+i&&s<-800&&s>-1345||Math.hypot(a-J.x,s-J.z)<110+i||Math.hypot(a-K.x,s-K.z)<95+i||Ke(a,s,i,l))continue;let c=!0;for(const d of ee)if(Math.hypot(a-d.x,s-d.z)<(i+d.R)*.75){c=!1;break}c&&De(a,s,i,l)}const Pe=new r.Vector3(Math.sin(Se),.1,-Math.cos(Se)).normalize(),D0=new r.Vector3(0,1,0),P0=U?.06:.0524,h0={uSunDir:{value:Pe},uSunUp:{value:D0},uSunK:{value:new r.Vector3(Math.cos(P0*1.12),Math.tan(P0),k==="evening"?.02:-9)}},it={...I,...h0,uRefl:{value:0}},rt={...I,...h0,uRefl:{value:1}},u0=new r.ShaderMaterial({vertexShader:Z0,fragmentShader:J0,uniforms:it}),lt=new r.ShaderMaterial({vertexShader:Z0,fragmentShader:J0,uniforms:rt,side:r.DoubleSide}),dt=new r.Matrix4,C0=new r.Quaternion,V0=new r.Vector3,F0=new r.Vector3,ct=new r.Vector3(0,1,0),je=(e,t,n,a,s)=>{if(!e.length)return;const i=s[t].geo.clone();i.boundingSphere=new r.Sphere(new r.Vector3,1e5);const l=new r.InstancedMesh(i,n,e.length),c=new Float32Array(e.length*4);return e.forEach((d,f)=>{C0.setFromAxisAngle(ct,d.rot),F0.set(d.x,0,d.z),V0.set(d.R*d.ax,a?-d.H*.5:d.H,d.R*d.az),l.setMatrixAt(f,dt.compose(F0,C0,V0)),c.set([d.inkU,d.seed,d.R,d.H],f*4)}),i.setAttribute("aInfo",new r.InstancedBufferAttribute(c,4)),l.frustumCulled=!1,p.add(l),l};for(let e=0;e<3;e++)je(ee.filter(t=>t.v===e&&t.river),e,u0,!1,Ne),await h.yield(),je(ee.filter(t=>t.v===e&&!t.river&&!t.far),e,u0,!1,Le),je(ee.filter(t=>t.v===e&&t.far),e,u0,!1,Xe),je(ee.filter(t=>t.v===e&&t.river).slice(0,18),e,lt,!0,Xe),await h.yield();const p0=(e,t,n,a=0)=>{const s=(e.river?Ne:Le)[e.v],i=s.rad[Math.round(j(n,0,1)*s.HS)],l=i[(Math.round(t/6.2832*s.RS)%s.RS+s.RS)%s.RS];let c=Math.cos(t)*l+Math.sin(n*3.1+e.seed*37)*.13*n,d=Math.sin(t)*l+Math.cos(n*2.3+e.seed*19)*.13*n;c=c*e.R*e.ax+Math.cos(t)*a,d=d*e.R*e.az+Math.sin(t)*a;const f=Math.cos(e.rot),z=Math.sin(e.rot);return[e.x+c*f+d*z,n*e.H,e.z-c*z+d*f,Math.cos(t)*f+Math.sin(t)*z,-Math.cos(t)*z+Math.sin(t)*f]};await h.yield();{const e=[],t=[],n=[],a=[];[[1750,300,0],[2250,420,1],[2800,560,2]].forEach(([l,c,d])=>{const z=e.length/3,D=u.range(0,100);for(let C=0;C<=150;C++){const R=C/150*Math.PI*2,m=Math.cos(R),g=Math.sin(R),v=C===150?0:R,y=c*(.45+.55*Math.abs(M.fbm2(Math.cos(v)*3.1+D,Math.sin(v)*3.1+D*.7,4))+.35*Math.max(0,M.n2(Math.cos(v)*9+D,Math.sin(v)*9)));if(e.push(m*l,70,-820+g*l,m*l,110+y,-820+g*l),t.push(0,d*.37+.1,1,d*.37+.1),n.push(R*l,0,R*l,1),C<150){const F=z+C*2;a.push(F,F+1,F+2,F+1,F+3,F+2)}}});const s=new r.BufferGeometry;s.setAttribute("position",new r.Float32BufferAttribute(e,3)),s.setAttribute("aR",new r.Float32BufferAttribute(t,2)),s.setAttribute("uv",new r.Float32BufferAttribute(n,2)),s.setIndex(a);const i=new r.Mesh(s,new r.ShaderMaterial({vertexShader:Ut,fragmentShader:It,uniforms:{...I,...h0},side:r.DoubleSide}));i.frustumCulled=!1,p.add(i)}const U0={uSun:{value:new r.Vector4(_?.3:1,-9,U?1:0,U?.55:.3)}},He=new r.Mesh(new r.SphereGeometry(3400,32,16),new r.ShaderMaterial({vertexShader:Pt,fragmentShader:Ct,uniforms:{...I},side:r.BackSide,depthWrite:!1,depthTest:!1}));He.renderOrder=-1,He.frustumCulled=!1,p.add(He);const I0=1500,ht=I0*Math.tan(U?.06:.0524),ye=new r.Mesh(new r.PlaneGeometry(6.4,6.4),new r.ShaderMaterial({vertexShader:Vt,fragmentShader:Ft,uniforms:{...I,...U0},transparent:!0,depthWrite:!1}));ye.scale.setScalar(ht),ye.renderOrder=.05,ye.frustumCulled=!1,p.add(ye),p.background=fe.paper.clone(),await h.yield();const Ce=new r.Vector3,ut=[],$=(e,t={},n=.5)=>{if(!e.count)return null;const a=t.anim||[Ce,Ce,Ce,Ce,Ce],s=new r.ShaderMaterial({vertexShader:Rt.replace("uAnim[4]","uAnim[5]"),fragmentShader:Q0,transparent:!0,depthWrite:!1,side:r.DoubleSide,uniforms:{...I,uAnim:{value:a},uDrift:{value:t.drift||new r.Vector4(1,0,0,100)},uWrap:{value:t.wrap||new r.Vector3},uVel:{value:t.vel||new r.Vector3},uGrow:{value:t.grow??.6},uPix:{value:9e-4},uGhost:{value:t.ghost??0},...t.uniforms||{}}}),i=new r.Mesh(e.geometry(),s);return i.frustumCulled=!1,i.renderOrder=n,p.add(i),ut.push(i),i},N=1/be,o=u.fork("flora"),ne=Y(),f0=Y(),pt=(e,t,n,a,s)=>{const i=-n,l=t,c=o.sign(),d=[e[0]+t*2.6*a,e[1]+3.6*a,e[2]+n*2.6*a],f=[d[0]-t*.6*a+i*1.8*a*c,d[1]+3.4*a,d[2]-n*.6*a+l*1.8*a*c];ne.line([e[0]-t,e[1]-.5,e[2]-n],d,.5*a,{d:.95,dry:.3,inkU:s,sway:-.12*a}),ne.line(d,f,.36*a,{d:.9,dry:.4,inkU:s,sway:.12*a});const z=o.int(3,5);for(let D=0;D<z;D++){const C=D/(z-1||1),R=[Te(d[0],f[0],C)+(o()-.5)*3*a+t*(1-C)*2.5*a,Te(d[1]-.6*a,f[1]+.8*a,C),Te(d[2],f[2],C)+(o()-.5)*3*a+n*(1-C)*2.5*a],m=o.int(6,8),g=o.range(0,6.28);for(let v=0;v<m;v++){const y=g+v/m*6.283+o.range(-.3,.3),F=o.range(1.3,2.3)*a*(1.15-.4*C);ne.add({p:[R[0]+Math.cos(y)*F*.9,R[1]+o.range(-.6,.5)*a,R[2]+Math.sin(y)*F*.9],a:[Math.cos(y)*F,o.range(-.5,.25)*F,Math.sin(y)*F],w:o.range(.32,.5)*a,d:o.range(.8,1),dry:o.range(.1,.5),inkU:s+(.2+D*.12)*N,sway:.14*a+.1*C*a,seed:o()})}}},ft=(e,t,n,a,s,i)=>{let l=[e[0],e[1],e[2]];const c=[l];for(let d=0;d<4;d++)l=[l[0]+(t*2+o.range(-1.6,1.6))*a,l[1]+o.range(.2,2.2)*a,l[2]+(n*2+o.range(-1.6,1.6))*a],c.push(l);for(let d=0;d<4;d++)ne.line(c[d],c[d+1],(.3-d*.05)*a,{d:.95,dry:.35,inkU:s+d*.1*N,sway:.05*d*a});for(let d=0,f=o.int(9,15);d<f;d++){const z=c[o.int(1,4)],D=(i===3?o.range(.45,.8):o.range(.55,1.1))*a;f0.dot([z[0]+o.range(-2,2)*a,z[1]+o.range(-.6,1.8)*a,z[2]+o.range(-2,2)*a],D,D*o.range(.7,1),{kind:i,d:1,inkU:s+(.5+d*.07)*N,sway:.16*a,seed:o()})}},vt=ee.filter(e=>e.inkU<1.5).sort((e,t)=>e.inkU-t.inkU);let R0=Math.round(96*S),T0=x==="spring"?12:x==="autumn"?30:0;for(const e of vt){const t=e.river?o.int(1,3)+(e.gate||e.bank?2:0):o.chance(.75)?o.int(1,2):0,n=e.river?P.nearestXZ(e.x,e.z):null,a=n?P.pointAt(n.u,V):null,s=a?Math.atan2(a.z-e.z,a.x-e.x)+e.rot:0;for(let i=0;i<t&&R0>0;i++,R0--){const l=e.river&&(i===0||i<3&&(e.gate||e.bank)),c=l?o.range(14,52)/e.H:o.range(.74,.985),d=l?s+o.range(-1.25,1.25):o.range(0,6.283),f=p0(e,d,c,-1);P.isClear(f[0],f[1],f[2],12,8)&&pt(f,f[3],f[4],o.range(1.3,2.3)*(l?.85:1+e.R/90),e.inkU+(.9+o())*N)}if(T0>0&&(e.river||o.chance(.35))){const i=e.river&&o.chance(.7)?o.range(10,50)/e.H:o.range(.6,.93),l=p0(e,o.range(0,6.283),i,-.5);P.isClear(l[0],l[1],l[2],10,8)&&(ft(l,l[3],l[4],o.range(1.2,2)*(e.river?1:1.6),e.inkU+1.2*N,x==="spring"?3:2),T0--)}}{const e=p0(Ge,0,.955,0),t=e[1]-1,n=K.x,a=K.z,s=Ge.inkU+1.4*N;for(const i of[-3.6,3.6])ne.line([n+i*.8,t,a+i*.6],[n+i*.8,t+6.5,a+i*.6],.42,{d:.95,inkU:s});ne.add({p:[n,t+7.4,a],a:[9,0,0],w:3.4,kind:9,dry:-1,mode:2,d:1,inkU:s}),ne.add({p:[n,t+12.2,a],a:[5.6,0,0],w:2.5,kind:9,dry:-1,mode:2,d:1,inkU:s+.2*N}),ne.line([n,t+12.5,a],[n,t+16,a],.3,{d:.95,inkU:s+.3*N}),f0.dot([n,t+3.4,a],1.5,1.7,{kind:2,d:1.25,inkU:s+.5*N})}await h.yield();const Ve=Y(),mt=Math.round(20*S),Oe=[];for(let e=0;e<mt;e++){const t=e%2?1:-1;Oe.push([B(o.range(20,520),t*o.range(36,56)),o.int(6,11),1,null])}for(let e=0;e<4;e++)Oe.push([B(55+e*78+o.range(-14,14),o.range(32,46)),o.int(7,11),1,null]);Oe.push([B(45,-16),10,.5,-.2],[B(62,18),10,.5,-.2]);for(const[e,t,n,a]of Oe){const s=a??we(e[0],e[2]);a!==null&&ne.add({p:[e[0],.03,e[2]],a:[e[3]*9,0,e[4]*9],w:3.2,kind:6,mode:1,d:.6,inkU:-1,seed:o()});for(let i=0;i<t;i++){const l=e[0]+j(o.gauss(),-2,2)*4*n,c=e[2]+j(o.gauss(),-2,2)*5*n,d=o.range(8,13),f=o.range(-1.4,1.4),z=o.range(-1.4,1.4),D=s+o.range(0,.5)*N;Ve.line([l,-.3,c],[l+f,d,c+z],o.range(.13,.2),{d:o.range(.6,.95),dry:.25,inkU:D,sway:-.75,seed:o()});for(let C=0,R=o.int(6,9);C<R;C++){const m=o.range(.45,1),g=o.range(0,6.283),v=o.range(.8,1.5),y=l+f*m,F=d*m,kt=c+z*m;Ve.add({p:[y+Math.cos(g)*v*.8,F-v*.45,kt+Math.sin(g)*v*.8],a:[Math.cos(g)*v,-v*.6,Math.sin(g)*v],w:o.range(.2,.3),kind:4,d:o.range(.8,1),inkU:D+(.35+C*.14)*N,sway:.75*m*m,seed:o()})}}}await h.yield();const ve=Y(),_0=(e,t,n)=>{const a=we(e[0],e[2]);ve.add({p:[e[0],.03,e[2]],a:[e[3]*n*1.6,0,e[4]*n*1.6],w:n*.5,kind:6,mode:1,d:.5,inkU:a,seed:o()});for(let s=0;s<t;s++){const i=e[0]+o.gauss()*n*.6*(.4+Math.abs(e[3]))*1.4,l=e[2]+o.gauss()*n*.6*(.4+Math.abs(e[4]))*1.4,c=o.range(1.4,3.6),d=o.range(-.7,.7);Ve.line([i,-.1,l],[i+d,c,l+o.range(-.5,.5)],o.range(.035,.06),{d:o.range(.6,1),dry:.2,inkU:a+o.range(0,.6)*N,sway:-.55,seed:o()}),o.chance(.3)&&Ve.add({p:[i+d,c,l],a:[d*.15,.32,0],w:.09,kind:4,d:.9,inkU:a+.6*N,sway:.55,seed:o()})}};for(let e=0,t=Math.round(16*S);e<t;e++)_0(B(30+e/t*400+o.range(-10,10),(e%2?1:-1)*o.range(11,26)),o.int(18,30),o.range(1.6,3.2));for(let e=0;e<26;e++)_0(B(o.range(-20,540),o.sign()*o.range(40,60)),o.int(10,18),o.range(2.5,5));for(let e=0,t=Math.round(320*Math.min(1.15,S));e<t;e++){const n=B(-90+e/t*720+o.range(-6,6),o.range(-56,56)),a=o.range(3,15)*(o.chance(.5)?1:-1);(e&127)===127&&await h.yield(),ve.add({p:[n[0],.02,n[2]],a:[-n[4]*a+n[3]*a*.08,0,n[3]*a+n[4]*a*.08],w:o.range(.07,.24),kind:0,mode:1,d:o.range(.55,.9),dry:o.range(.5,.9),inkU:we(n[0],n[2])+o.range(0,.5)*N,drift:o.range(1.2,4.2),seed:o()})}await h.yield();for(let e=0;e<36;e++){const t=B(24+e/36*120+o.range(-4,4),o.range(-44,44)),n=o.range(8,19)*(e%2?1:-1);ve.add({p:[t[0],.02,t[2]],a:[-t[4]*n+t[3]*n*.05,0,t[3]*n+t[4]*n*.05],w:o.range(.26,.5),kind:0,mode:1,d:.32,dry:.8,inkU:we(t[0],t[2])+o.range(0,.5)*N,drift:o.range(.8,2.2),seed:o()})}for(let e=0;e<64;e++){const t=e%2?1:-1,n=B(-50+(e>>1)*19+o.range(-5,5),t*o.range(45,55)),a=o.range(14,24);ve.add({p:[n[0],.015,n[2]],a:[n[3]*a,0,n[4]*a],w:o.range(4,8),kind:6,mode:1,d:o.range(.2,.34),inkU:we(n[0],n[2]),seed:o()})}for(let e=0,t=W==="carp"?14:5;e<t;e++){const n=B(20+e/t*420+o.range(-10,10),o.sign()*o.range(7,38)),a=o.range(2.4,4.6);ve.add({p:[n[0],.04,n[2]],a:[a,0,0],w:a,kind:7,mode:1,d:.6,seed:o()}),ve.add({p:[n[0],.04,n[2]],a:[a*.6,0,0],w:a*.6,kind:7,mode:1,d:.5,seed:o()})}const $e=Y(),B0=Y();for(let e=0;e<16;e++){const t=B(o.range(-40,600),o.sign()*o.range(34,110));$e.add({p:[t[0],o.chance(.6)?o.range(3,22):o.range(52,70),t[2]],a:[o.range(40,90),0,0],w:o.range(2.2,5.5),kind:5,mode:2,d:o.range(.4,.7),drift:o.range(1,3.5)*o.sign(),seed:o()})}for(let e=0;e<10;e++){const t=B(o.range(25,150),o.sign()*o.range(6,70));$e.add({p:[t[0],o.range(3,22),t[2]],a:[o.range(26,60),0,0],w:o.range(1.6,4),kind:5,mode:2,d:o.range(.4,.7),drift:o.range(1.5,4)*o.sign(),seed:o()})}for(let e=0;e<34;e++){P.pointAt(o.range(.42,1),V);const t=o.sign()*o.range(40,420);$e.add({p:[V.x+t,o.range(116,140),V.z+o.range(-120,60)],a:[o.range(70,190),0,0],w:o.range(7,18),kind:5,mode:2,d:o.range(.5,.85),drift:o.range(1.5,5)*o.sign(),seed:o()})}for(let e=0;e<46;e++){const t=o.range(0,6.283),n=80+1300*Math.sqrt(o()),a=o.range(70,240);B0.add({p:[Math.cos(t)*n,o.range(127,133),-900+Math.sin(t)*n],a:[a,0,o.range(-.15,.15)*a],w:o.range(12,36),kind:6,mode:1,d:o.range(.14,.3),drift:o.range(2,6)*o.sign(),seed:o()})}$(B0,{drift:new r.Vector4(1,0,.1,500)},.1),$(ve,{drift:new r.Vector4(0,0,1,46),grow:.9},.2),$(ne,{ghost:.14,grow:.7},.4),$(Ve,{ghost:0,grow:.45},.45),$(f0,{ghost:0,grow:.3},.5),$($e,{drift:new r.Vector4(1,0,.15,260)},.6),await h.yield();const ae=u.fork("craft"),ce=ae.sign(),W0=80,Ye=B(W0,ce*9.5),he=Ye[3],ue=Ye[4],w=(e,t,n)=>[e*he-n*ue,t,e*ue+n*he],A=Y(),xe=-ce*1.45,me=q==="raft"?4.3:2.9,Fe=q==="raft"?2.3:1.9,Ze=[new r.Vector3,new r.Vector3,new r.Vector3,new r.Vector3,new r.Vector3],v0=new r.Vector3,K0=[];if(q==="raft"){for(let n=0;n<8;n++)A.line(w(-5-ae.range(0,.5),.28,(n-3.5)*.36),w(5+ae.range(0,.6),.3+.05*n%2,(n-3.5)*.36),.2,{mode:1,d:ae.range(.8,1),dry:ae.range(.2,.5),seed:ae()});for(const n of[-3.6,.2,3.7])A.line(w(n,.36,-1.5),w(n+.1,.36,1.5),.09,{mode:1,d:1});A.line(w(-5,.2,0),w(5.4,.2,0),.26,{d:.9,dry:.3}),A.line(w(-3.5,.4,0),w(-3.4,2.5,.1),.34,{d:1,dry:.15}),A.add({p:w(-3.4,2.78,.1),a:[.95,0,0],w:.5,kind:9,dry:1,mode:2,d:1});const e=w(-3.1,1.75,.5*-ce),t=w(-6.4,-1.1,1.7*-ce);A.line(w(-2.1,2.7,.1*-ce),t,.06,{d:.95,anim:1}),v0.set(t[0]-e[0],t[1]-e[1],t[2]-e[2]).normalize();for(let n=0;n<5;n++){const a=-1.6+n*1.05+ae.range(-.2,.2),s=n===1?3:n===3?4:0,i=ae.range(.9,1.15);A.add({p:w(a,.95*i,xe),a:[.3*i,0,0],w:.56*i,kind:1,mode:2,d:1,anim:s,seed:ae()}),A.line(w(a+.05,1.3*i,xe),w(a+.42,1.68*i,xe),.1,{d:1,anim:s}),A.line(w(a+.4,1.66*i,xe),w(a+.72,1.56*i,xe),.05,{d:1,anim:s}),s&&K0.push({slot:s,u0:(W0-62+(s-3)*26)/P.length})}A.line(w(-5.2,.03,.7),w(-15,.03,3.6),.34,{mode:1,d:.4,dry:.75}),A.line(w(-5.2,.03,-.7),w(-15,.03,-3.6),.34,{mode:1,d:.4,dry:.75})}else{A.add({p:w(0,.42,0),a:w(3.6,0,0),w:1,kind:9,dry:-1,d:1}),A.line(w(-.6,.5,0),w(-.45,1.75,0),.34,{d:1,dry:.15}),A.add({p:w(-.45,2,0),a:[.9,0,0],w:.46,kind:9,dry:1,mode:2,d:1});const e=w(3.6,3.5,1.5*-ce);A.line(w(-.2,1.4,.1),e,.045,{d:.9}),A.line(e,[e[0],-.2,e[2]],.025,{d:.6,anim:1}),v0.set(0,1,0),A.line(w(-3.8,.03,.5),w(-11,.03,2.6),.28,{mode:1,d:.35,dry:.75}),A.line(w(-3.8,.03,-.5),w(-11,.03,-2.6),.28,{mode:1,d:.35,dry:.75})}A.line(w(me,.3,0),w(me,Fe+.7,0),.07,{d:.95}),A.line(w(me,Fe+.65,0),w(me+.5,Fe+.55,0),.05,{d:.95});const gt=U||_?1:.6;A.add({p:w(me+.5,Fe,0),a:[3.4,0,0],w:3.4,kind:8,mode:2,d:.8*gt,anim:2}),A.add({p:w(me+.5,Fe,0),a:[.42,0,0],w:.52,kind:2,mode:2,d:1.5,anim:2});for(let e=0;e<3;e++)A.add({p:w(me+1.2+e*1.5,.02,(e%2-.5)*.3),a:w(.9-e*.15,0,0),w:.42-e*.08,kind:8,mode:1,d:.85-e*.2,anim:2});for(let e=0;e<3;e++){const t=1.6+e*.7;A.add({p:w(-1+e*1.6,.04,xe*2.6),a:[t,0,0],w:t,kind:7,mode:1,d:.55,seed:ae()})}const q0=$(A,{anim:Ze},.7),E0=new r.Vector3(Ye[0],0,Ye[2]),L0=[new r.Vector3,new r.Vector3],Ue=[new r.Vector3(0,0,-1),new r.Vector3(0,0,-1)];{const e=[],t=[],n=[],a=[],s=[],i=u.fork("birds"),l=Z==="cranes",c=Math.round((l?12:16)*Math.min(1.15,S)),d=Math.round((l?12:8)*Math.min(1.15,S)),f=(m,g,v,y)=>{e.push(y.l[0],y.l[1],y.l[2],i()),t.push(y.a[0],y.a[1],y.a[2],y.w),n.push(y.d??1,y.kind??0,y.side??0,y.tip??0),a.push(m[0],m[1],m[2],g),s.push(v,y.mode??0,y.dry??0,0)},z=(m,g)=>{const v=i.range(0,6.283);l?(f(m,g,v,{l:[0,0,-.2],a:[0,0,1.5],w:.6,kind:10}),f(m,g,v,{l:[0,0,0],a:[.78,0,0],w:.62,kind:3,mode:2}),f(m,g,v,{l:[0,.12,2.6],a:[0,.1,1.25],w:.14,d:.95}),f(m,g,v,{l:[0,.3,3.95],a:[.32,0,0],w:.32,kind:2,mode:2,d:1.2}),f(m,g,v,{l:[0,-.1,-2.7],a:[0,0,-1.3],w:.08,d:.9}),f(m,g,v,{l:[0,.1,-1.5],a:[0,0,-.6],w:.36,d:.95,dry:.4})):(f(m,g,v,{l:[0,0,0],a:[0,0,1.35],w:.42,d:.75,dry:.2}),f(m,g,v,{l:[0,0,0],a:[.6,0,0],w:.46,kind:1,mode:2,d:.8}),f(m,g,v,{l:[0,.1,2.3],a:[0,.06,1.1],w:.11,d:.95}));for(const y of[-1,1])f(m,g,v,{l:[y*1.8,.15,-.15],a:[y*1.4,0,-.1],w:l?.62:.42,kind:l?10:0,d:l?1:.8,dry:.2,side:y}),f(m,g,v,{l:[y*3.95,.15,-.45],a:[y*1.3,0,-.3],w:l?.5:.36,d:1,dry:.5,side:y,tip:1})};for(let m=0;m<c;m++){const g=l?(m%2?1:-1)*Math.ceil(m/2):m;z(l?[g*6.5,i.range(-1.5,1.5)+Math.abs(g)*.7,-Math.abs(g)*7.5]:[g*5.4-30,g*.5+i.range(-1,1),-g*5.2],0)}for(let m=0;m<d;m++){const g=l?(m%2?1:-1)*Math.ceil(m/2):m;z(l?[g*7,i.range(-1.5,1.5)+Math.abs(g)*.5,-Math.abs(g)*8]:[-g*5.6,g*.4+i.range(-1,1),-g*5.5],1)}const D=et();D.setAttribute("iA",new r.InstancedBufferAttribute(new Float32Array(e),4)),D.setAttribute("iB",new r.InstancedBufferAttribute(new Float32Array(t),4)),D.setAttribute("iC",new r.InstancedBufferAttribute(new Float32Array(n),4)),D.setAttribute("iD",new r.InstancedBufferAttribute(new Float32Array(a),4)),D.setAttribute("iE",new r.InstancedBufferAttribute(new Float32Array(s),4)),D.instanceCount=e.length/4;const C=new r.ShaderMaterial({vertexShader:Tt,fragmentShader:Q0,transparent:!0,depthWrite:!1,side:r.DoubleSide,uniforms:{...I,uFlockPos:{value:L0},uFlockFwd:{value:Ue},uPix:{value:9e-4},uFlapW:{value:l?5.6:8.5},uSize:{value:l?.85:.62},uGhost:{value:1}}}),R=new r.Mesh(D,C);R.frustumCulled=!1,R.renderOrder=.9,p.add(R)}let Ie=null;if(W==="dolphin"){const e=Y();e.add({p:[0,0,0],a:[0,0,-2.3],w:1.15,kind:9,dry:1,d:.85}),e.line([0,.1,1.9],[0,.75,3],.4,{d:.9,dry:.3}),e.line([0,.5,-.2],[0,1.3,.5],.3,{d:.9,dry:.4}),Ie=$(e,{},.7),Ie.rotation.order="YXZ"}const N0={value:120};{const e=Y();e.add({p:[J.x,J.y+2,J.z-3],a:[46,0,0],w:34,kind:6,mode:2,d:.62,seed:.37}),e.dot([J.x,J.y,J.z-2],12.5,12.5,{kind:3,d:1,seed:.11}),$(e,{uniforms:{uVis:N0}},.62)}{const e=Y(),t=u.fork("air"),n=new r.Vector3(130,80,130),a=new r.Vector3,s=Math.round((_?1100:G?800:x==="spring"?320:200)*S*(h.quality?.detail??1));for(let i=0;i<s;i++){const l=[t.range(0,n.x),t.range(0,n.y),t.range(0,n.z)];if(_)e.add({p:l,a:[-.38,-1.75,.2],w:t.range(.02,.04),d:t.range(.35,.7),dry:.7,seed:t()});else if(G)e.dot(l,.16,.16,{kind:3,d:1,sway:t.range(.3,.9),seed:t()});else if(x==="spring")e.dot(l,.17,.13,{kind:3,d:1,sway:t.range(.4,1.1),seed:t()});else if(x==="autumn")e.dot(l,t.range(.09,.17),.11,{kind:2,d:1,sway:t.range(.4,1.1),seed:t()});else{const c=t.range(0,6.283);e.add({p:l,a:[Math.cos(c)*.3,t.range(-.12,.12),Math.sin(c)*.3],w:.07,kind:4,d:t.range(.5,.95),sway:t.range(.4,1.1),seed:t()})}}_?a.set(-6.5,-30,3.5):G?a.set(-1.6,-2.4,.5):a.set(-2.4,-1.1,.8),$(e,{wrap:n,vel:a},5)}await h.yield();const Je=[];{const e={uMist:{value:new r.Vector4(-1e4,-9999,0,0)},uVis:{value:1e5}},t=Y();t.line([0,-3,-2.6],[.03,-1.86,-5.3],.2,{kind:10,d:.8,seed:.31}),t.line([.03,-1.73,-5.68],[.015,-2.42,-3.95],.075,{d:1,dry:.3,seed:.62}),t.line([.03,-1.73,-5.72],[.05,-1.71,-6.55],.034,{d:.95,seed:.77}),t.dot([.03,-1.675,-5.6],.085,.07,{kind:2,d:1.25,seed:.2}),Je.push({mesh:$(t,{uniforms:e},6),side:0});for(const n of[-1,1]){const a=Y();a.line([.9*n,-.75,-.7],[3.75*n,.02,-.82],.3,{kind:10,d:.9,seed:.43});for(let s=0;s<7;s++){const i=(60+s*5)*Math.PI/180,l=2.05-.1*s,c=(3.85-s*.25)*n,d=.05-.07*s;a.line([c+Math.cos(i)*l*n,d+Math.sin(i)*l,-.8-.06*s],[c,d,-.8+.03*s],.095,{d:1,dry:.3,seed:.17+s*.19})}for(let s=0;s<6;s++){const i=(62+s*5)*Math.PI/180,l=(3.72-s*.26)*n,c=-.05-.07*s;a.line([l+Math.cos(i)*.85*n,c+Math.sin(i)*.85,-.78-.05*s],[l,c,-.78],.115,{d:.5,dry:.15,seed:.33+s*.13})}Je.push({mesh:$(a,{uniforms:e},6),side:n})}for(const n of Je)n.mesh.matrixAutoUpdate=!1,n.mesh.visible=!1}const Qe=new r.Matrix4,wt=new r.Matrix4,yt=new r.Matrix4,Me=new r.Vector3,xt=(e,t,n)=>{const a=n>.003&&!!t.matrixWorld,s=T(.003,.03,n)*(1-T(.95,.992,n)),i=e*(Math.PI*2/.9),l=.5+.5*Math.sin(i),c=.3+.7*j(.5+.62*Math.sin(i+.7),0,1);for(const d of Je)d.mesh.visible=a,a&&(d.side===0?Qe.makeTranslation(.03*Math.sin(e*.7),-2.4*(1-s)+.07*Math.sin(i-1.2),.05*Math.sin(i-.4)):(Qe.makeTranslation(1.6*d.side,-3.1-2.4*(1-s)-.06*Math.sin(i),-3.6),Qe.multiply(wt.makeRotationZ(d.side*(-.7+1*l))).multiply(yt.makeScale(1,c,1))),d.mesh.matrix.multiplyMatrices(t.matrixWorld,Qe),d.mesh.matrixWorldNeedsUpdate=!0)},e0=new r.Vector3,oe=new r.Vector3,X0=new r.Vector2,G0=new r.Vector3,Mt=new r.Vector3;let j0=0;const H0=(e,t,n,a,s,i,l)=>{const c=T(.84,.97,s);P.posAtDist(t,e0),P.tangentAtDist(Math.min(t,P.length-1),oe),l?Ue[e].copy(oe):i>0&&Ue[e].lerp(oe,1-Math.pow(.8,i*60)).normalize();const d=Math.hypot(oe.x,oe.z)||1;L0[e].set(e0.x-oe.z/d*n*(1+2.2*c),e0.y+a+26*c,e0.z+oe.x/d*n*(1+2.2*c))};function O0(e,t,n,a){n.matrixWorld?Me.setFromMatrixPosition(n.matrixWorld):Me.copy(n.position);const s=Me.y;xt(t,n,a),I.uTime.value=t,I.uU.value=a;const i=T(40,200,s);I.uVis.value=Te(900,2500,i)*Be,I.uMist.value.z=T(95,150,s),I.uMist.value.w=T(66,84,s)*(1-T(92,108,s)),h.renderer.getDrawingBufferSize(X0),I.uPxs.value=Math.max(.5,X0.y/720),He.position.copy(Me);const l=r.MathUtils.degToRad(Te(a0,tt,i));Pe.set(Math.sin(Se)*Math.cos(l),Math.sin(l),-Math.cos(Se)*Math.cos(l)),D0.set(0,1,0).addScaledVector(Pe,-Pe.y).normalize(),ye.position.copy(Me).addScaledVector(Pe,I0),ye.lookAt(Me),U0.uSun.value.y=k==="evening"?-.05:-9;const c=b0(a),d=j((a-o0)/.12,0,1),f=j((a-.8)/.18,0,1),z=T(.47,.57,a)*(1-T(.685,.74,a));N0.value=120+6e3*z*z*z;const D=.3*T(.5,.6,a);H.setTravel(c),H.setEnso(d,f),H.setGhost(D),H.mistBand.copy(I.uMist.value),H.fadeRange.set(I.uVis.value*.7,I.uVis.value*1.7),H.update(e,t,n),E&&(E.setTravel(c-qe.flickTravel+E.timing2.flickTravel-50*(1-T(.62,o0,a))),E.setEnso(d,f*.8),E.setGhost(D*.6),E.mistBand.copy(I.uMist.value),E.fadeRange.copy(H.fadeRange),E.update(e,t,n));const C=a*P.length,R=Math.abs(a-j0)>.04;j0=a,H0(0,C+45+7*Math.sin(t*.21),-27,8+2*Math.sin(t*.17),a,e,R),H0(1,C+150+9*Math.sin(t*.16+2),44,40*T(.05,.3,a)+16+3*Math.sin(t*.13+1),a,e,R);const m=16*T(0,.3,a)+Math.sin(t*.23)*1.2;q0.position.set(E0.x+he*m,Math.sin(t*.9)*.06,E0.z+ue*m),Ze[1].copy(v0).multiplyScalar(q==="raft"?.55-.85*Math.max(0,Math.sin(t*.95)):.08*Math.sin(t*2.1)),Ze[2].set(-ue*Math.sin(t*1.5)*.14,-Math.abs(Math.sin(t*1.5))*.03,he*Math.sin(t*1.5)*.14);for(const g of K0){const v=(a-g.u0)/.014,y=Ze[g.slot],F=-ce;v<=0?y.set(0,0,0):v<1?y.set((-ue*F*2.4+he*.8)*v,1.3*Math.sin(v*Math.PI)*(1-v)-1.7*v*v,(he*F*2.4+ue*.8)*v):v<2.6?y.set(0,-2e3,0):y.set(-ue*F*4.6+he*3.4,-1.02+.08*Math.sin(t*2.2+g.slot)+.5*Math.max(0,1-(v-2.6)),he*F*4.6+ue*3.4)}if(Ie){const v=t%5.2/5.2,y=j(v/.3,0,1),F=Math.min(C+40+v*14,420);B(F,-ce*17,Re),Ie.position.set(Re[0],v<.3?3.4*Math.sin(y*Math.PI)-.9:-2e3,Re[2]),Ie.rotation.set(-Math.cos(y*Math.PI)*.95,Math.atan2(-Re[3],-Re[4]),0)}}const Re=[];return O0(0,0,{position:P.start},0),Ue[0].lerp(P.tangentAtDist(45,oe),.2).normalize(),Ue[1].lerp(P.tangentAtDist(150+9*Math.sin(2),oe),.2).normalize(),{scene:p,path:P,duration:be,title:ie?"Mountains of Wet Ink: Two Dragons":_?"Mountains of Wet Ink: Rain":G?"Mountains of Wet Ink: Snow":U?"Mountains of Wet Ink: Moon Reserved":"Mountains of Wet Ink",ride:"none",style:"none",camera:{fov:62,near:.5,far:7e3,lookAhead:30,sway:.8,bank:1},pois:[{at:()=>Mt.copy(q0.position).setY(1.5),from:.008,to:.08,weight:.4},{at:(e,t)=>i0(Math.max(t,.2),G0).lerp(P.pointAt(Math.min(1,t+.08),oe),.35),from:.2,to:.37,weight:.5},{at:(e,t)=>i0(t,G0),from:.45,to:.72,weight:.62}],portal:{shape:"circle",radius:7.2,color:re,glow:0,revealDistance:380},post:{exposure:_e,bloom:{strength:.3,radius:.5,threshold:1.35},grade:{saturation:1,contrast:1,tint:"#ffffff",shadowTint:"#000000",vignette:.34,grain:.03,aberration:0}},update:O0,dispose(){H.dispose(),E&&E.dispose();for(const e of[...Le,...Ne,...Xe])e.geo.dispose()}}}};export{qt as default};
