import*as a from"three";const ce=["#1B3FA6","#5B8FD9","#D8341F","#F2C21B","#1E8C55","#6A3B8F","#14183A"],K={BLUE:0,LBLUE:1,RED:2,YELLOW:3,GREEN:4,VIOLET:5,LINE:6,PALE:7};function ee(t){return new a.Color(t)}const q=(t,e,n)=>t.clone().lerp(e,n);function ke(t=ce){const[e,n,r,s,v,d,S]=t.map(ee),p=new a.Color(1,1,1),M=[q(e,S,.62),q(e,n,.25),q(r,d,.62),q(s,r,.5),q(v,S,.5),q(d,S,.55),S.clone(),n.clone()],i=[e,n,r,s,v,d,S,q(n,p,.22)].map(l=>l.clone()),u=[n.clone(),q(n,p,.4),s.clone(),q(s,p,.4),q(v,s,.8),n.clone(),q(S,e,.3),q(n,p,.4)],f=[q(v,e,.35),e,d,r,s,r,S,n].map(l=>l.clone());return{deep:M,hue:i,lite:u,nbr:f}}function Me(t=ce){const e=ke(t);return{uTime:{value:0},uDeep:{value:e.deep},uHue:{value:e.hue},uLite:{value:e.lite},uLine:{value:ee(t[6])},uNbr:{value:e.nbr},uViewH:{value:450},uLiteCap:{value:.94},uHeave:{value:1},uStride:{value:0},uLiftTop:{value:0},uGreen:{value:ee(t[4])},uViolet:{value:ee(t[5])}}}const pe=`
uniform float uTime, uHeave, uCrownK, uLiteCap;
uniform vec3 uDeep[8], uHue[8], uLite[8], uNbr[8];
uniform vec3 uLine, uGreen, uViolet;
float mHash(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float mNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mHash(i), mHash(i + vec2(1., 0.)), f.x), mix(mHash(i + vec2(0., 1.)), mHash(i + vec2(1., 1.)), f.x), f.y); }
`,Se=pe+`
// brush drag: streaks long along the arc (a), narrow across; fades to its average when finer than ~3 px
float mDrag(float a, float across, float seed, float fw){
  // each grain of the bristles gives way by itself when it is finer than about 3 px (the fine one first): never a stipple
  float n1 = mNoise(vec2(a * 0.22 + seed * 7.1, across * 5.5 + seed * 3.3)) - 0.5, n2 = mNoise(vec2(a * 0.6 + seed, across * 13. - seed * 5.)) - 0.5;
  return n1 * 0.65 * (1. - smoothstep(0.06, 0.18, fw)) + n2 * 0.35 * (1. - smoothstep(0.02, 0.06, fw));
}
// bandPaintW: the same with the screen-space width of s and of across given by the caller (for s that jumps from one
// back to the next, where fwidth would spike along every crest)
vec3 bandPaintW(float hueIx, float s, float a, float across, float seed, float fw0, float fw){
  int i = int(clamp(hueIx + 0.5, 0., 7.));
  vec3 deep = uDeep[i], hue = uHue[i], lite = uLite[i];
  float drag = mDrag(a, across, seed, fw) * (1. - smoothstep(0.25, 0.8, fwidth(a)));   // (a flank seen end on: the streaks along it are finer than a pixel and would stipple)
  // the crown slides along the arc and back, like muscle under a hide
  float slide = 2.4 * sin(uTime * 0.6 * uHeave + seed * 6.283);
  float crown = 0.79 + 0.21 * sin(a * uCrownK + slide + seed * 4.);
  float fs = min(fw0, 0.2);
  float sc = clamp(s * crown + drag * 0.2, 0., 1.), sl = clamp(sc + drag * 0.16, 0., 1.);
  // three loads of the brush: the deep along the contour, the hue, the light swell. Each meets the next in a crisp step
  // whose border the drag of the bristles makes ragged (a ramp reads as gloss); finer than a few pixels the steps soften (fs)
  float tDeep = 0.25 * smoothstep(0.0, 0.2, sc) + 0.75 * smoothstep(0.125 - fs, 0.15 + fs, sc);
  float tLite = 0.3 * smoothstep(0.515 - fs, 0.54 + fs, sl) + 0.7 * smoothstep(0.655 - fs, 0.68 + fs, sl);   // a flat matte swell with one half-tone rim, no bright core
  // a form only a few pixels across is one solid load of its hue: far horses and far backs stay at full pigment strength
  float small = smoothstep(0.03, 0.09, fw0);
  tDeep = mix(tDeep, 0.84 + 0.16 * tDeep, small); tLite *= 1. - 0.6 * small;
  vec3 c = mix(deep, hue, tDeep);
  c = mix(c, lite, tLite * uLiteCap);
  // the hand's fault: a neighbour hue dragged a hand's width over the edge, in patches along the arc
  float dragPatch = smoothstep(0.60, 0.68, mNoise(vec2(a * 0.11 + seed * 31., seed * 17.)));
  float edge = (1. - smoothstep(0.03, 0.13 + drag * 0.08, s)) * dragPatch;
  c = mix(c, uNbr[i], edge * 0.6 * (1. - smoothstep(0.03, 0.09, fw0)));      // (not on forms a few pixels across: it would speckle)
  c = mix(c, drag > 0. ? lite : deep, abs(drag) * 0.2 * smoothstep(0.1, 0.3, sc));   // the brush, loaded unevenly: streaks of the light and of the deep along the arc
  c *= 1. + drag * 0.07;                       // the 3 percent drag of the bristles
  return c;
}
// Rows of overlapping backs laid over a sheet (x metres along, zr rows up). Each back is an arc whose crest bows toward
// +zr; it stands over the row behind and is covered by the row in front, and within a row one back overlaps its neighbour.
// Returns how far (in rows) the pixel lies below the crest of the back that owns it; id is that back's lot, slope the
// crest's slope (rows per metre) for the hairline. No derivative is taken in here.
float backRows(float x, float zr, float D, float salt, out float id, out float slope){
  const float H = 1.75;
  float r0 = ceil(zr - H), dWin = 0., hit = 0.; id = 0.; slope = 0.;
  for (int k = 0; k < 4; k++) {
    float row = r0 + float(k);
    float Lc = D * (3.4 + 2.8 * mHash(vec2(row, 7.3 + salt))), o = mHash(vec2(row, 3.7 + salt)) * 900.;
    float g = (x + o) / Lc, ci0 = floor(g), nb = g - ci0 < 0.5 ? -1. : 1.;
    float pa = mHash(vec2(row * 1.3 + ci0, 1.9 + salt)), pb = mHash(vec2(row * 1.3 + ci0 + nb, 1.9 + salt));
    for (int j = 0; j < 2; j++) {
      float ci = (j == 0 ? pa > pb : pa <= pb) ? ci0 : ci0 + nb;
      float hk = mHash(vec2(ci * 2.3 + 5.1, row * 1.7 + 0.3 + salt));
      float xc = (ci + 0.36 + 0.28 * hk) * Lc - o, Rw = Lc * (0.62 + 0.14 * fract(hk * 7.7));
      float e = (x - xc) / Rw, ht = H * (0.72 + 0.28 * fract(hk * 13.1));
      float d = row + ht * (1. - e * e) * (1. - 0.22 * e) - 0.35 - zr;
      if (hit < 0.5 && d > 0.) { hit = 1.; dWin = d; id = hk; slope = abs(ht * (2. * e + 0.22 * (1. - 3. * e * e)) / Rw); }
    }
  }
  return dWin;
}
vec3 bandPaint(float hueIx, float s, float a, float across, float seed){ return bandPaintW(hueIx, s, a, across, seed, fwidth(s), fwidth(across) + 1e-5); }
// broken hairline: 1 = draw the contour, 0 = the fifth of its length where the hand lifts
float lineKeep(float a, float seed){
  float n = mNoise(vec2(a * 0.16 + seed * 13.7, seed * 5.1));
  return step(0.2, n);
}
`,Pe=`
uniform float uViewH, uHullFar;
float hullWidth(float base, float viewDepth, float wob){
  float px = 2. * max(viewDepth, 0.1) / max(projectionMatrix[1][1] * uViewH, 1.);   // metres per pixel at this depth
  float w = base * wob;
  // uHullFar 1 (animals): a body only a few pixels across is drawn without its line, as one load of paint, so that a far
  // horse stays ultramarine and does not go navy under its own contour
  return clamp(w, 1.7 * px, max(1.8 * px, 0.006 * uViewH * px)) * (1. - step(1e-3, uHullFar) * smoothstep(0.3, 0.62, px * uHullFar));   // uHullFar: 0 never, else 21 / the animal's height in metres
}
`,Ve=`
uniform float uStride, uLiftTop;
void rotX(inout vec3 p, inout vec3 n, vec3 piv, float ang){
  float c = cos(ang), s = sin(ang); vec3 q = p - piv;
  p = piv + vec3(q.x, q.y * c - q.z * s, q.y * s + q.z * c);
  n = vec3(n.x, n.y * c - n.z * s, n.y * s + n.z * c);
}
void horsePose(inout vec3 p, inout vec3 n, vec4 part, vec3 piv, vec3 piv2, vec4 inst, vec4 inst2){
  float kind = part.x, g = inst.y, seed = inst.w, w = part.z;
  float ph0 = (uStride + inst.x) * 6.2831853;
  float t = uTime;
  if (kind < 0.5) {                                   // body: the flank swells and sinks
    p += n * w * 0.02 * sin(t * 0.9 + seed * 6.283);
  } else if (kind < 1.5) {                            // neck, head, mane, ears
    float flick = max(0., sin(t * 0.61 + seed * 40.)); flick = flick * flick; flick = flick * flick; flick = flick * flick;
    p.z -= part.y * 0.07 * flick * sin(t * 9.);
    float ang = inst.z - uLiftTop * inst2.z + 0.025 * sin(t * 0.47 + seed * 9.) - g * (0.2 + 0.05 * sin(ph0 + 1.2));
    rotX(p, n, piv, ang * w);
  } else if (kind < 3.5) {                            // legs
    float ph = ph0 + part.y * 6.2831853;
    float hind = piv.z > 0. ? 1. : -1.;
    // in the run the legs are drawn long under the heavy haunch: stretched down from the hip (the body is lifted to match below)
    float lk = 1. + 0.15 * g; p.y = piv.y + (p.y - piv.y) * lk; piv2.y = piv.y + (piv2.y - piv.y) * lk;
    float st = sin(seed * 31. + part.y * 17.);                                        // standing: no two legs parallel, a decided angle at knee and hock
    float A = -0.62 * sin(ph) * g + (0.03 * sin(t * 0.31 + seed * 5. + part.y * 6.283) + 0.085 * st) * (1. - g);
    if (kind > 2.5) { float K = hind * (1.25 * g * max(0., cos(ph)) + (0.16 + 0.1 * st) * (1. - g)); rotX(p, n, piv2, K * w); }
    rotX(p, n, piv, A);
  } else {                                            // tail: hangs and swishes, streams in the gallop
    p.x += sin(t * 1.3 + seed * 9. - w * 2.2) * w * w * 0.11 * (1. - g);
    rotX(p, n, piv, w * (g * (0.5 + 0.1 * sin(ph0 * 2. - w * 3.)) + 0.05 * sin(t * 0.8 + seed * 3.) * (1. - g)));
  }
  // the whole body rocks once a stride
  vec3 c0 = vec3(0., 0.75, 0.);
  rotX(p, n, c0, 0.075 * g * sin(ph0 + 0.6));
  p.y += 0.055 * g * sin(ph0 - 0.4) + 0.105 * g;
}
`,ze=`
attribute vec4 aBand, aPart;
#ifdef HORSE
attribute vec3 aPiv, aPiv2;
attribute vec4 aInst, aInst2;
varying vec4 vInst2; varying vec3 vRest; varying float vKind;
#endif
uniform float uHullW;
#ifdef SWAY
uniform float uSway;
#endif
varying vec4 vBand; varying float vHull, vSeed, vFace;
#ifdef FLANK
varying float vTop;
#endif
void main(){
  vec3 p = position, n = normal;
  #ifdef FLANK
  vTop = aPart.z;
  #endif
  float seed = aPart.y;
  #ifdef HORSE
  seed = aInst.w; vInst2 = aInst2; vRest = position; vKind = aPart.x;
  horsePose(p, n, aPart, aPiv, aPiv2, aInst, aInst2);
  #endif
  mat4 mm = modelMatrix;
  #ifdef USE_INSTANCING
  mm = modelMatrix * instanceMatrix;
  #endif
  vec4 wp = mm * vec4(p, 1.);
  #ifdef SWAY
  {                                                   // leaf fans nod in order along the course (aPart.z: 0 root, 1 tip)
    vec3 o = mm[3].xyz; seed = fract(seed + dot(o.xz, vec2(0.137, 0.291)));
    float ph = uTime * 1.25 - o.z * 0.045 + o.x * 0.02, k = aPart.z * aPart.z;
    wp.xz += vec2(sin(ph), cos(ph * 0.83)) * k * uSway; wp.y -= k * uSway * 0.5 * (0.5 + 0.5 * sin(ph));
  }
  #endif
  vec3 wn = mat3(mm) * n; wn = wn / max(length(wn), 1e-6);
  vec4 vp = viewMatrix * wp;
  { vec3 tv = wp.xyz - cameraPosition; vFace = dot(wn, tv) / max(length(tv), 1e-4); }   // under 0: the surface here faces the lens
  if (aPart.w > 0.5) {
    float wob = 0.62 + 0.9 * mNoise(vec2(aBand.z * 0.21 + seed * 11., seed * 3.7));
    wp.xyz += wn * hullWidth(uHullW, -vp.z, wob);
    vp = viewMatrix * wp;
  }
  vBand = aBand; vHull = aPart.w; vSeed = seed;
  gl_Position = projectionMatrix * vp;
}`,Le=`
varying vec4 vBand; varying float vHull, vSeed, vFace;
#ifdef FLANK
varying float vTop; uniform float uFlankD, uViewH;
#endif
#ifdef EDGE
uniform float uEdgeW;
#endif
#ifdef HORSE
varying vec4 vInst2; varying vec3 vRest; varying float vKind;
uniform float uSide;
float starIn(vec2 q, float R){
  float ang = (dot(q, q) < 1e-10 ? 0. : atan(q.y, q.x)) + 1.5708;
  float a = abs(mod(ang, 1.2566371) - 0.6283185), rho = length(q);
  vec2 pt = rho * vec2(cos(a), sin(a)), T = vec2(R, 0.), I = R * 0.42 * vec2(0.809, 0.588), e = I - T;
  return (e.x * (pt.y - T.y) - e.y * (pt.x - T.x)) / max(length(e), 1e-5);
}
#endif
void main(){
  // the contour is the far shell seen past the form's edge. Where a great back folds through itself the shell turns its face to
  // the lens over a whole patch (it stood as a dark spike on the hill): there, and on the near side of two-sided hills, it is left out.
  if (vHull > 0.5) { if (!gl_FrontFacing || vFace < -0.2 || lineKeep(vBand.z, vSeed) < 0.5) discard; gl_FragColor = vec4(uLine, 1.); return; }
  float hueIx = vBand.x, s = vBand.y;
  #ifdef HORSE
  if (vInst2.y > -0.5 && hueIx < 0.5) hueIx = vInst2.y;
  #endif
  #ifdef FLANK
  // a hill's flank is not one flat tone: it is rows of smaller backs standing one over another up to the crest, each with
  // its deep edge, its light swell and its hairline (rows finer than 3 px give way to the plain back)
  float zr = -abs(vBand.w - vTop) / uFlankD, fz = fwidth(zr), fx = fwidth(vBand.z), fid, fsl;
  // the lot that lays out the rows is the part's seed, a whole number of 256ths (addHillBack): rounded here, because a varying that
  // is the same at all three corners still wavers in its last bits from pixel to pixel, and a hash turns that into a stipple
  float fd0 = backRows(vBand.z, zr, uFlankD, floor(vSeed * 256. + 0.5) * (37. / 256.), fid, fsl);
  float fd = max(fz + fsl * fx, 1e-5);
  // (a flank seen end on: its rows are crossed along their length faster than three pixels a row, and they give way too)
  float fkeep = (1. - smoothstep(0.07, 0.15, fd)) * smoothstep(0.45, 1.1, -zr);
  float s2 = pow(smoothstep(0., 0.42, fd0), 0.8) * (1. - 0.72 * smoothstep(0.42, 0.85, fd0));
  s = mix(s, max(s2, 0.03) * (0.45 + 0.55 * smoothstep(0.02, 0.2, s)), fkeep);
  #endif
  #ifdef FLANK
  vec3 c = bandPaintW(hueIx, s, vBand.z, vBand.w, vSeed, mix(fwidth(vBand.y), 2.5 * fd, fkeep), fz * uFlankD + 1e-5);
  {
    float wA = clamp(0.3 / uFlankD / fd, 0.9, max(1.2, 0.006 * uViewH));
    c = mix(c, uLine, (1. - smoothstep(wA, wA + 1., fd0 / fd)) * lineKeep(vBand.z * 0.7 + fid * 90., vSeed) * fkeep);
  }
  #else
  vec3 c = bandPaint(hueIx, s, vBand.z, vBand.w, vSeed);
  #endif
  #ifdef HORSE
  // the patch of reflected colour under the belly
  float belly = (1. - smoothstep(0.515, 0.555, vRest.y + 0.05 * (mNoise(vec2(vBand.z * 0.5, vSeed * 9.)) - 0.5))) * step(vKind, 0.5) * step(vBand.x, 0.5) * step(abs(vRest.z + 0.04), 0.36);
  c = mix(c, mix(uGreen, uViolet, step(0.5, fract(vSeed * 7.3))), belly * 0.45);
  if (vInst2.x > 0.5 && vKind < 0.5) {               // the picture's own marks: crescent on the breast, stars down the flank
    float aa = fwidth(vRest.y) * 1.2 + 1e-5, m = 0.;
    if (vRest.z > 0.40) {
      vec2 q = vec2(vRest.x * uSide, vRest.y) - vec2(0.015, 0.79);
      float d1 = 0.118 - length(q), d2 = length(q - vec2(0.050, 0.030)) - 0.104;
      m = smoothstep(0., aa, min(d1, d2));
    } else if (vRest.x * uSide > 0.08) {
      vec2 zy = vRest.zy; float d = -1.;
      d = max(d, starIn(zy - vec2(0.270, 0.930), 0.060));
      d = max(d, starIn(zy - vec2(0.110, 0.860), 0.050));
      d = max(d, starIn(zy - vec2(-0.050, 0.800), 0.056));
      d = max(d, starIn(zy - vec2(-0.170, 0.715), 0.044));
      d = max(d, starIn(zy - vec2(-0.480, 0.720), 0.054));
      m = smoothstep(0., aa, d);
    }
    c = mix(c, bandPaint(7., 0.55 + 0.4 * s, vBand.z, vBand.w, vSeed + 0.37), m);
  }
  #endif
  #ifdef EDGE
  {                                                   // flat blades carry no hull: the hairline is drawn from s
    float fe = fwidth(s) * 1.5 + 1e-5, w0 = max(uEdgeW, fe);
    c = mix(c, uLine, (1. - smoothstep(w0, w0 + fe, s)) * lineKeep(vBand.z * 3. + vSeed * 40., vSeed));
  }
  #endif
  gl_FragColor = vec4(c, 1.);
}`;function ae(t,e={}){return new a.ShaderMaterial({uniforms:{...t,uHeave:e.heave!==void 0?{value:e.heave}:t.uHeave,uLiteCap:e.liteCap!==void 0?{value:e.liteCap}:t.uLiteCap,uHullW:{value:e.hullWidth??.08},uSide:{value:e.side??1},uCrownK:{value:e.crownK??.55},uSway:{value:e.sway??0},uEdgeW:{value:e.edge??.07},uHullFar:{value:e.hullFar??(e.horse?1:0)},uFlankD:{value:e.flank||30}},defines:{...e.horse?{HORSE:1}:{},...e.flank?{FLANK:1}:{},...e.sway?{SWAY:1}:{},...e.edge?{EDGE:1}:{}},vertexShader:pe+Pe+(e.horse?Ve:"")+ze,fragmentShader:Se+Le,side:e.doubleSide?a.DoubleSide:a.FrontSide})}function ne(){return{pos:[],nor:[],band:[],part:[],piv:[],piv2:[],idx:[],n:0}}const se=new a.Vector3,ve=new a.Vector3,qe=new a.Vector3,j=new a.Vector3,De=new a.Vector3,Ne=new a.Vector3;function we(t){const e=new a.CatmullRomCurve3(t.map(n=>new a.Vector3(n[0],n[1],n[2])),!1,"catmullrom",.5);return(n,r)=>e.getPoint(n,r)}const A=(t,e=.2,n=.2)=>{let r=1;if(e>0&&t<e){const s=1-t/e;r*=Math.sqrt(Math.max(0,1-s*s))}if(n>0&&t>1-n){const s=1-(1-t)/n;r*=Math.sqrt(Math.max(0,1-s*s))}return r},Ie=[[.38,1.35],[Math.PI-.38,1.35]];function O(t,e){const n=e.at||we(e.pts),r=e.nSeg,s=e.nRing,v=e.unit??1,d=new a.Vector3().fromArray(e.ref||[0,1,0]),S=e.lobes||Ie,p=e.ends||[.14,.14],M=e.piv||[0,0,0],i=e.piv2||M,u=e.hull!==!1,f=typeof e.kind=="function"?e.kind:null;let l=0;const g=(w,m,P,T)=>{n(Math.min(1,w+.004),se),n(Math.max(0,w-.004),ve),n(w,m),j.subVectors(se,ve),j.lengthSq()<1e-12&&j.set(0,0,1),j.normalize(),T.copy(d).addScaledVector(j,-d.dot(j)),T.lengthSq()<1e-10&&T.set(1,0,0),T.normalize(),P.crossVectors(T,j).normalize(),l||(l=P.x<-1e-4?-1:1),l<0&&P.negate()},c=e.sq??1,x=w=>c===1?w:Math.sign(w)*Math.pow(Math.abs(w),c),b=()=>({C:new a.Vector3,N1:new a.Vector3,N2:new a.Vector3,r:[0,0]}),y=b(),I=b(),V=b(),R=(w,m)=>{g(w,m.C,m.N1,m.N2);const P=e.rad(w);m.r[0]=P[0],m.r[1]=P[1]},L=(w,m,P)=>P.copy(w.C).addScaledVector(w.N1,w.r[0]*x(Math.cos(m))).addScaledVector(w.N2,w.r[1]*x(Math.sin(m))),E=new a.Vector3,X=new a.Vector3,o=new a.Vector3,h=new a.Vector3,B=new a.Vector3,k=new a.Vector3,C=new a.Vector3,z=t.n,F=s+1;let D=e.a0||0;const J=new a.Vector3,Q=e.seam??-Math.PI/2;let _=.02;for(let w=0;w<=8;w++){const m=e.rad(w/8);_=Math.max(_,(m[0]+m[1])*.5)}for(let w=0;w<=r;w++){const m=w/r,P=.01;R(m,y),R(Math.min(1,m+P),I),R(Math.max(0,m-P),V);const T=(y.r[0]+y.r[1])*.5;C.copy(y.C),w>0&&(D+=C.distanceTo(J)*v),J.copy(C);const N=(p[0]>0?a.MathUtils.smoothstep(m,0,p[0]):1)*(p[1]>0?a.MathUtils.smoothstep(1-m,0,p[1]):1),Z=e.weight?e.weight(m):e.w??1,te=typeof e.limb=="function"?e.limb(m):e.limb??0,ye=!e.hullEnds||m>e.hullEnds[0]&&m<e.hullEnds[1]?1:0;for(let ie=0;ie<=s;ie++){const U=Q+ie/s*Math.PI*2;L(y,U,E),L(I,U,o),L(V,U,X),L(y,U+.05,h),L(y,U-.05,B),k.crossVectors(h.sub(B),o.sub(X)),se.subVectors(E,C),k.lengthSq()<1e-14||T<1e-4?(k.subVectors(I.C,V.C).multiplyScalar(m<.5?-1:1),k.lengthSq()<1e-14&&k.set(0,1,0)):k.dot(se)<0&&k.negate(),k.normalize();let G=0;const le=Math.PI*2;for(const Y of S){let ue=Math.abs(((U-Y[0])%le+le+Math.PI)%le-Math.PI)/Y[1];ue<1&&(G=Math.max(G,(Y[2]??1)*Math.cos(ue*Math.PI*.5)))}G=Math.min(e.sMax??1,Math.max(e.sFloor??0,G*N));for(let Y=0;Y<(u?2:1);Y++)t.pos.push(E.x,E.y,E.z),t.nor.push(k.x,k.y,k.z),t.band.push(e.hue,G,D,(U-Q)*_*v),t.part.push(f?f(m):e.kind??0,te,e.flank?Math.PI*_*v:Z,Y*ye),t.piv.push(M[0],M[1],M[2]),t.piv2.push(i[0],i[1],i[2])}}const H=u?2:1,W=(w,m,P)=>z+(w*F+m)*H+P;let $=0;const re=new a.Vector3,de=new a.Vector3,he=new a.Vector3,fe=new a.Vector3;for(let w=0;w<r;w++)for(let m=0;m<s;m+=2){const P=W(w,m,0)*3,T=W(w+1,m,0)*3,N=W(w,m+1,0)*3;re.set(t.pos[P],t.pos[P+1],t.pos[P+2]),de.set(t.pos[T],t.pos[T+1],t.pos[T+2]).sub(re),he.set(t.pos[N],t.pos[N+1],t.pos[N+2]).sub(re),fe.set(t.nor[P],t.nor[P+1],t.nor[P+2]),$+=de.cross(he).dot(fe)}const be=$>0;for(let w=0;w<r;w++)for(let m=0;m<s;m++)for(let P=0;P<H;P++){const T=W(w,m,P),N=W(w+1,m,P),Z=W(w,m+1,P),te=W(w+1,m+1,P);be!==(P===1)?t.idx.push(T,N,Z,Z,N,te):t.idx.push(T,Z,N,Z,te,N)}return t.n+=(r+1)*F*H,D}function oe(t){const e=new a.BufferGeometry;return e.setAttribute("position",new a.Float32BufferAttribute(t.pos,3)),e.setAttribute("normal",new a.Float32BufferAttribute(t.nor,3)),e.setAttribute("aBand",new a.Float32BufferAttribute(t.band,4)),e.setAttribute("aPart",new a.Float32BufferAttribute(t.part,4)),e.setAttribute("aPiv",new a.Float32BufferAttribute(t.piv,3)),e.setAttribute("aPiv2",new a.Float32BufferAttribute(t.piv2,3)),e.setIndex(t.n>65535?new a.Uint32BufferAttribute(t.idx,1):new a.Uint16BufferAttribute(t.idx,1)),e.computeBoundingSphere(),e.computeBoundingBox(),e}function me(t){const e=t.lod??1,n=t.unit??10,r=ne(),s=o=>Math.max(3,Math.round(o*e)),v=o=>Math.max(6,Math.round(o*(.4+.6*e))),d=K.BLUE,S=K.LINE,p=a.MathUtils.lerp,M=a.MathUtils.smoothstep,i=[],u=o=>i.push({unit:n,...o}),f=Math.PI,l=(o,h=.5)=>[o>0?h:f-h,1.95,.43];u({pts:[[0,.8,-.46],[0,.745,-.06],[0,.765,.36]],rad:o=>{const h=A(o,.22,.22);return[.272*h,.262*h]},ref:[0,1,0],hue:d,nSeg:s(10),nRing:v(16),kind:0,w:1,ends:[.2,.2],sq:.9,lobes:[[.42,.8],[f-.5,.72,.96],l(1),l(-1)]});for(const o of[1,-1])u({pts:[[.07*o,.9,-.16],[.115*o,.885,-.44],[.15*o,.66,-.595],[.155*o,.47,-.52]],rad:h=>{const B=A(h,.3,.12),k=p(.235,.108,M(h,.45,1))*B;return[k*.92,k*1.08]},ref:[0,1,-1],hue:d,nSeg:s(10),nRing:v(14),kind:0,w:.35,ends:[.2,.1],sq:.86,lobes:[[o>0?.5:f-.6,o>0?.9:.78,o>0?1:.5],l(o,.45)]});u({pts:[[0,1.03,.26],[0,.83,.435],[0,.55,.39]],rad:o=>{const h=A(o,.3,.25);return[p(.29,.15,o*o)*h,p(.22,.12,o)*h]},ref:[0,0,1],hue:d,nSeg:s(8),nRing:v(14),kind:0,w:.6,ends:[.2,.22],sq:.8,lobes:[[f/2-.5,.8],[f/2,2,.43]]});for(const o of[1,-1])u({pts:[[.115*o,1,.16],[.185*o,.84,.27],[.178*o,.63,.345]],rad:h=>{const B=A(h,.3,.3);return[.085*B,p(.17,.12,h)*B]},ref:[0,.5,1],hue:d,nSeg:s(6),nRing:v(10),kind:0,w:.5,ends:[.2,.2],sq:.75,lobes:[[o>0?.3:f-.4,o>0?.8:.7,o>0?1:.95],l(o,.3)]});const c=we([[0,.84,.25],[0,1.14,.415],[.03,1.385,.6],[.085,1.475,.81],[.14,1.4,.93]]),x=o=>{const h=A(o,.12,.2);return[p(.18,.062,Math.pow(o,.85))*h,p(.245,.095,Math.pow(o,.9))*h]},b=[0,.93,.25],y=o=>M(o,0,.45);u({at:c,rad:x,ref:[0,.3,-1],hue:d,nSeg:s(12),nRing:v(14),kind:1,weight:y,piv:b,ends:[.1,.12],sq:.86,lobes:[[.35,.78],[f-.45,.7,.96],l(1,.3),l(-1,.3)]}),u({pts:[[.11,1.45,.89],[.18,1.3,.995],[.25,1.06,.965],[.3,.87,.86]],rad:o=>{const h=A(o,.22,.12);return[p(.08,.046,M(o,.1,.8))*h,(p(.142,.058,M(o,.12,.72))+.014*M(o,.78,.95))*h]},ref:[.3,.1,1],hue:d,nSeg:s(9),nRing:v(12),kind:1,w:1,piv:b,ends:[.15,.12],sq:.8,lobes:[[.7,.6,.9],l(1,.4),l(-1,.4)]});for(const o of[1,-1]){const h=.105+.055*o;u({pts:[[h,1.46,.83],[h+.02*o,1.57,.835],[h+.035*o,1.665,.86]],rad:B=>{const k=.05*Math.sin(Math.PI*Math.min(1,.25+B*.75));return[k*.55,k]},ref:[0,0,1],hue:d,nSeg:4,nRing:6,kind:1,w:1,limb:B=>B,piv:b,ends:[0,.3],sFloor:.25})}const I=new a.Vector3,V=new a.Vector3,R=new a.Vector3;u({at:(o,h)=>{const B=p(.1,.9,o);return c(B,I),c(Math.min(1,B+.01),V),c(Math.max(0,B-.01),R),V.sub(R).normalize(),R.set(0,.3,-1),R.addScaledVector(V,-R.dot(V)).normalize(),h.copy(I).addScaledVector(R,x(B)[1]*.97)},rad:o=>{const h=A(o,.15,.15);return[.032*h,.058*h]},ref:[0,.3,-1],hue:S,nSeg:s(12),nRing:6,kind:1,weight:o=>y(p(.1,.9,o)),piv:b,hull:!1,sFloor:.2});const E=[0,.93,-.66];u({pts:[[0,.95,-.62],[0,.86,-.8],[0,.56,-.865],[0,.26,-.8]],rad:o=>{const h=A(o,.2,0);return[p(.05,.072,M(o,0,.5))*h*(1-M(o,.5,1)*.97),.04*h*(1-o*.8)]},ref:[0,1,-1],hue:d,nSeg:s(10),nRing:8,kind:4,weight:o=>o,piv:E,ends:[.1,.1],lobes:[[Math.PI/2,1.5],[-Math.PI/2,1.5]],sMax:.46});const X=[[1,1,0],[-1,1,.12],[1,-1,.5],[-1,-1,.62]];for(const[o,h,B]of X){const k=.158*o,C=h>0,z=.5,F=C?[k,.7,.27]:[k*.9,.78,-.42],D=C?[k*.97,.335,.31]:[k,.345,-.63],J=C?[[k*1.05,.76,.265],[k*1,.53,.3],D,[k*.96,.19,.288],[k*.96,.062,.305]]:[[k*.97,.66,-.485],[k,.5,-.545],D,[k,.2,-.572],[k,.062,-.535]];u({pts:J,rad:H=>{const W=A(H,.2,0),$=p(C?.112:.128,.05,M(H,.04,z))-.013*M(H,z,.8)+.007*M(H,.86,1)+(C?.004:.012)*Math.exp(-Math.pow((H-z)/.07,2));return[$*.72*W,$*1.16*W]},ref:[0,0,1],hue:d,nSeg:s(11),nRing:v(9),kind:H=>H>z+.02?3:2,weight:H=>M(H,z,z+.14),limb:B,piv:F,piv2:D,ends:[.16,0],sq:.72,lobes:[[o>0?.5:f-.6,.7,o>0?.95:.85],l(o,.2)]});const Q=C?.305:-.535,_=J[4][0];u({pts:[[_,.078,Q],[_,.04,Q+.012],[_,0,Q+.026]],rad:H=>{const W=p(.036,.05,H)*A(H,.25,.02);return[W*.95,W*1.45]},ref:[0,0,1],hue:S,nSeg:2,nRing:v(8),kind:3,limb:B,piv:F,piv2:D,hull:!1,sFloor:.2,sq:.7})}return{G:r,specs:i}}function ge(t,e){if((e.side??1)>0){for(const r of[t.pos,t.nor,t.piv,t.piv2])for(let s=0;s<r.length;s+=3)r[s]=-r[s];for(let r=0;r<t.idx.length;r+=3){const s=t.idx[r+1];t.idx[r+1]=t.idx[r+2],t.idx[r+2]=s}}const n=oe(t);return n.boundingSphere=new a.Sphere(new a.Vector3(0,.8,0),1.6),n}function Re(t,e){const r=a.MathUtils.degToRad(t.range(52,62)),s=t.range(11.8,12.4),v=9,d=new a.Vector3(-Math.sin(r)*e,0,Math.cos(r)),S=new a.Vector3(-Math.cos(r)*e,0,-Math.sin(r)),p=S.clone().multiplyScalar(8.8).addScaledVector(d,-5.2),M=new a.Vector3(0,v,0).addScaledVector(p,-1.5);M.y=v;const i=[];for(let u=0;u<4;u++){const f=M.clone().addScaledVector(p,u);f.y=v+s*u;const l=t.range(-.07,.07),g=14*t.range(.975,1.03),c=Math.atan2(d.x,d.z)+l,x=new a.Vector3(Math.sin(c),0,Math.cos(c));i.push({pos:f,yaw:c,scale:g,h:x,neck:t.range(-.03,.1)+(u===3?.06:0),seed:t(),phase:t()})}return{S:14,psi:r,dy:s,y0:v,h:d,p:S,step:p,horses:i,side:e}}async function Be(t,e,n,r){const s=K.VIOLET,v=K.RED,d=a.MathUtils.lerp,S=e.horses,p=e.side;for(let i=0;i<4;i++){const u=S[i].pos.clone().addScaledVector(e.p,1.1),f=S[i].h,l=S[i].pos.y,g=(l+9)*.5,c=l-g+.3,x=(R,L,E=0)=>[u.x+f.x*R+e.p.x*E,c-L,u.z+f.z*R+e.p.z*E],b=n.range(7,12)+i*2,y=n.range(5,9)+i*2,I=[25,27.5,22,17][i],V=20+i*2;O(t,{pts:[x(-I-7,b+12+i*5,3),x(-I,b*.4,1),x(-10,0),x(0,0),x(9,0),x(V-4,y*.35,1),x(V+3,y+10+i*5,4)],rad:R=>{const L=A(R,.17,.17);return[(4.6+i*.25)*L,g*(.25+.75*L)]},ref:[0,1,0],hue:i%2?s:v,sMax:i%2?.84:1,nSeg:26,nRing:26,sq:.66,ends:[.1,.1],lobes:[[p>0?.2:Math.PI-.2,1.25],[Math.PI/2,.5],[p>0?Math.PI-.55:.55,.95,.9]],limb:n()}),await r()}const M=7;for(let i=0;i<M;i++){const u=i%2?1:-1,f=Math.min(3,Math.floor(i/2)),l=S[f],g=u>0?n.range(15,22)+f*2:-n.range(24,30)-f*2,c=l.pos.clone().addScaledVector(l.h,g).addScaledVector(e.p,n.range(-1,4));c.y=l.pos.y-(u>0?n.range(5,10):n.range(12,17));const x=new a.Vector3().copy(l.h).multiplyScalar(u*n.range(14,24)).addScaledVector(e.p,-n.range(4,14)),b=c.clone().add(x);b.y=-5;const y=c.clone().lerp(b,.5);y.y=c.y*.72+n.range(0,4),y.addScaledVector(x,-.12);const I=n.range(5.5,8.5),V=n.chance(.45)?s:v,R=n();O(t,{pts:[[b.x,b.y,b.z],[y.x,y.y,y.z],[c.x,c.y,c.z]],rad:L=>{const E=A(L,0,.3);return[d(I*1.3,I*.7,L)*E,d(I*1.5,I*.8,L)*E]},ref:[0,1,.01],hue:V,sMax:V===s?.66:1,nSeg:10,nRing:16,sq:.85,ends:[0,.2],lobes:[[.3,1.3],[Math.PI-.3,1.3],[Math.PI/2,.6]],limb:R}),i%2&&await r()}for(let i=0;i<3;i++){const u=S[3],f=[-16,2,17][i]+n.range(-3,3),l=u.pos.y-[16,7,20][i]-n.range(0,4),g=n.range(8,11),c=u.pos.clone().addScaledVector(u.h,f).addScaledVector(e.p,6.5),x=c.clone().addScaledVector(e.p,n.range(26,36)).addScaledVector(u.h,n.range(-8,8));O(t,{pts:[[x.x,-6,x.z],[d(x.x,c.x,.6),l*.74,d(x.z,c.z,.6)],[c.x,l,c.z]],rad:b=>{const y=A(b,0,.3);return[d(g*1.5,g*.8,b)*y,d(g*1.4,g*.75,b)*y]},ref:[0,1,.01],hue:i===1||n.chance(.5)?v:s,nSeg:10,nRing:16,sq:.85,ends:[0,.2],lobes:[[.3,1.3],[Math.PI-.3,1.3],[Math.PI/2,.6]],limb:n()})}}function Ke(t={}){const{G:e,specs:n}=me(t);for(const r of n)O(e,r);return ge(e,t)}async function Ee(t={},e){const{G:n,specs:r}=me(t);for(let s=0;s<r.length;s++)O(n,r[s]),e&&await e();return ge(n,t)}const Fe=new a.CatmullRomCurve3([[0,.3],[.07,.78],[.19,1.045],[.33,1.02],[.47,.975],[.58,1],[.7,1.19],[.8,1.39],[.88,1.44],[.95,1.31],[1,.9]].map(t=>new a.Vector3(t[0],t[1],0))),He=new a.Vector3;function Ae(t){return Fe.getPoint(a.MathUtils.clamp(t,0,1),He).y}function xe(t,e){const n=e.width,r=e.scale,s=e.rb??r*.9,v=e.flip?-1:1,d=Math.cos(e.yaw||0),S=Math.sin(e.yaw||0),p=e.dip??0;return O(t,{at:(i,u)=>{const f=i,l=(f-.5)*n*v,g=1-a.MathUtils.smoothstep(Math.min(f,1-f),0,e.dipRange??.13),c=(e.baseY??0)+(Ae(.04+f*.93)-.3)*r-s-p*g*g;return u.set(e.cx+l*d,c,e.z+l*S)},rad:i=>{const u=A(i,.1,.1);return[(e.depth??r*.35)*(.04+.96*u),s*(.04+.96*u)]},ref:[0,1,0],hue:e.hue,nSeg:e.nSeg??40,nRing:e.nRing??12,ends:[.14,.14],lobes:[[Math.PI-.95,.56],[.95,.56],[Math.PI-.6,1.7,.46],[.6,1.7,.46]],limb:Math.round((e.seed??.3)*256)/256,sFloor:.04,hull:e.hull,flank:!0,hullEnds:[.115,.885]})}function Ce(t=20,e=160,n=.6){const r=new a.BoxGeometry(t,e,n);return r.userData.W=t,r.userData.L=e,r}function Te(t,e,n={}){return new a.ShaderMaterial({uniforms:{uTime:t.uTime,uTint:{value:ee(e)},uWedgeOn:{value:n.on??1},uW:{value:n.W??20},uL:{value:n.L??160},uPh:{value:n.phase??0},uStrength:{value:n.strength??.3}},vertexShader:`uniform float uTime, uPh, uL; varying vec2 vP;
      void main(){ vP = position.xy; vec3 p = position;
        float a = 0.06 * sin(uTime * 0.33 + uPh * 6.283), c = cos(a), s = sin(a);     // leans a few degrees
        p.xy = vec2(p.x * c - p.y * s, p.x * s + p.y * c); p.x += 4. * sin(uTime * 0.27 + uPh * 4.);   // and slides
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`,fragmentShader:`uniform vec3 uTint; uniform float uWedgeOn, uW, uL, uStrength; varying vec2 vP;
      void main(){ float k = (1. - smoothstep(uW * 0.5 - 4., uW * 0.5, vP.x)) * (1. - smoothstep(uL * 0.5 - 12., uL * 0.5, abs(vP.y)));
        gl_FragColor = vec4(mix(vec3(1.), uTint, uStrength * k * uWedgeOn), 1.); }`,transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.DstColorFactor,blendDst:a.ZeroFactor,blendSrcAlpha:a.ZeroFactor,blendDstAlpha:a.OneFactor,side:a.FrontSide})}async function We(t,e,n,r,s,v){const d=v.side,S=v.CG,p=a.MathUtils.lerp,M=r.horses,i={},u=Math.round(9*v.detail);for(let f=0;f<u;f++){const l=s.range(-.9,2.2)*d+Math.PI*.5,g=s.range(30,52),c=Math.cos(l)*g+M[0].pos.x*.5,x=Math.sin(l)*g*.8-2,b=s.range(3.2,6.5),y=b*s.range(1,1.5),I=s.chance(.5)?K.GREEN:K.VIOLET,V=s.range(-.25,.25)*b;O(S,{pts:[[c,-1.5,x],[c+V*.5,y*.5,x],[c+V,y,x]],rad:R=>{const L=A(R,.35,.55);return[b*L,b*.9*L]},ref:[0,0,1],hue:I,nSeg:7,nRing:12,ends:[0,.3],lobes:[[Math.PI/2-.5,1.5],[-Math.PI/2,1]],limb:s(),sFloor:.05})}if(await t.yield(),v.ground!==!1){const f=ne();for(let g=0;g<3;g++){const c=[0,-70,78][g]*d,x=[6,44,30][g],b=[92,60,54][g],y=[1.2,-.6,-.9][g];O(f,{pts:[[c,y-26,x],[c,y-13,x],[c,y,x]],rad:I=>{const V=Math.sqrt(Math.max(0,1-I*I));return[b*V,b*.8*V]},ref:[0,0,1],hue:g===2?K.YELLOW:K.GREEN,nSeg:10,nRing:56,ends:[0,0],lobes:[[Math.PI/2-.6*d,2.6]],limb:s(),sFloor:.1,hull:g>0})}const l=new a.Mesh(oe(f),ae(n,{crownK:.05,heave:1/3}));l.frustumCulled=!1,e.add(l),i.ground=l,await t.yield()}if(v.backdrop!==!1){const f=ne();xe(f,{cx:30*d,z:-150,width:300,scale:68,baseY:-8,flip:d<0,hue:K.RED,depth:22,seed:s()}),await t.yield(),xe(f,{cx:-70*d,z:-420,width:760,scale:170,baseY:-30,flip:d>0,hue:K.YELLOW,depth:50,seed:s(),nSeg:48}),await t.yield();const l=new a.Vector3(-34*d,14,-70),g=72;i.arcAnchor={center:l,radius:g},O(f,{at:(x,b)=>{const y=p(.12,Math.PI-.12,x);return b.set(l.x+Math.cos(y)*g*d,l.y+Math.sin(y)*g*.9,l.z)},rad:x=>{const b=A(x,.08,.08);return[3.5*b,7.5*b]},ref:[0,0,1],hue:K.YELLOW,nSeg:40,nRing:8,ends:[.05,.05],lobes:[[Math.PI/2,1.5]],limb:s(),sFloor:.25});const c=new a.Mesh(oe(f),ae(n,{crownK:.022,heave:1/3,hullWidth:.3}));c.frustumCulled=!1,e.add(c),i.hills=c,await t.yield()}if(v.wedge!==!1){const g=a.MathUtils.degToRad(s.range(24,32))*d,c=new a.Mesh(Ce(22,190),Te(n,v.palette[4],{W:22,L:190,phase:s()}));c.position.set(M[1].pos.x-2*d,40,M[0].pos.z+14),c.rotation.z=g,c.renderOrder=50,c.frustumCulled=!1,e.add(c),i.wedge=c,i.wedgeAnchor={position:c.position.clone(),lean:g,width:22,length:190}}return i}async function Oe(t,e={}){const n=t.rng,r=e.detail??1,s=e.mirror?-1:1,v=e.palette&&e.palette.length>=7?e.palette:ce,d=e.uniforms||Me(v),S=new a.Group;S.name="tower-of-blue-horses";const p=Re(n,s);await t.yield();const M=await Ee({lod:e.lod??1.5,side:s},t.yield);await t.yield();const i=ae(d,{horse:!0,side:s,liteCap:.8,hullFar:1.5}),u=new Float32Array(16),f=new Float32Array(16),l=new a.InstancedMesh(M,i,4),g=new a.Matrix4,c=new a.Quaternion,x=new a.Euler,b=new a.Vector3;p.horses.forEach((z,F)=>{x.set(0,z.yaw,0),c.setFromEuler(x),b.setScalar(z.scale),g.compose(z.pos,c,b),l.setMatrixAt(F,g),u.set([z.phase,0,z.neck,z.seed],F*4),f.set([F===0?1:0,-1,F===3?1:0,0],F*4)}),M.setAttribute("aInst",new a.InstancedBufferAttribute(u,4)),M.setAttribute("aInst2",new a.InstancedBufferAttribute(f,4)),l.frustumCulled=!1,l.instanceMatrix.needsUpdate=!0,S.add(l),await t.yield();const y=ne();await Be(y,p,n,t.yield),await t.yield();const I=ae(d,{crownK:.09,heave:.6}),V=await We(t,S,d,p,n,{...e,detail:r,side:s,palette:v,CG:y,bandMat:I}),R=new a.Mesh(oe(y),I);R.frustumCulled=!1,S.add(R),await t.yield();const L=p.horses[0],E=p.horses[3],X=new a.Vector3(Math.cos(L.yaw),0,-Math.sin(L.yaw)).multiplyScalar(s),o=E.pos.y+E.scale*1.665,h=(z,F,D)=>L.pos.clone().addScaledVector(L.h,z).addScaledVector(X,F).setY(L.pos.y+D),B={ledges:p.horses.map(z=>({position:z.pos.clone(),yaw:z.yaw,scale:z.scale})),closestPass:h(4,11.5,6),flyThrough:[h(60,34,-2),h(30,18,3),h(13,12,5.5),h(4,11.5,6),h(-8,12,8),h(-22,16,13),h(-40,14,22),h(-56,-4,32),h(-60,-30,42)],viewpoints:{reveal:new a.Vector3(18*s,12,150),front:new a.Vector3(10*s,16,78),closest:h(6,11.5,6),behind:new a.Vector3(-20*s,44,-78)},top:new a.Vector3(E.pos.x,o,E.pos.z),wedge:V?.wedgeAnchor||null,cloudArc:V?.arcAnchor||null};let k=null;const C=new a.Vector2;return{object:S,radius:32,height:o,center:new a.Vector3(0,o*.52,0),anchors:B,uniforms:d,horses:l,horseGeometry:M,horseMaterial:i,bandMaterial:I,layout:p,wedge:V?.wedge||null,setProgress(z){k=z},update(z,F){d.uTime.value=F,t.renderer&&(t.renderer.getDrawingBufferSize(C),d.uViewH.value=C.y);const D=k==null?Math.pow(Math.max(0,Math.sin(F*.37)),6):a.MathUtils.smoothstep(k,.12,.22)*(1-a.MathUtils.smoothstep(k,.27,.36));d.uLiftTop.value=.24*D,V?.update&&V.update(z,F,k)},dispose(){},ground:!1,groundY:0}}export{Ve as HORSE_GLSL,K as HUE,Pe as HULL_GLSL,ce as PALETTE,pe as STYLE_COMMON_GLSL,Se as STYLE_GLSL,xe as addHillBack,ae as bandMaterial,Oe as buildHero,A as capProfile,we as curveOf,oe as finishBandGeo,Ae as horseTopline,O as loftBand,ne as makeBandGeo,ke as makeBandTable,Ke as makeHorseGeometry,Ee as makeHorseGeometryAsync,Me as makeStyleUniforms,Ce as makeWedgeGeometry,ee as pig,Te as wedgeMaterial};
