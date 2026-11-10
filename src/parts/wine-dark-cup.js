import*as u from"three";import{mergeGeometries as _e}from"three/addons/utils/BufferGeometryUtils.js";const it=["#D8703A","#0D0B0A","#EDE4D0","#6B2342","#7A4322","#F0A868"],_=Math.PI*2,be=`
uniform float uTime;
uniform vec4 uFront;      // xz = unit normal of the reversal line, z = its distance along that normal, w = half width (m)
uniform vec4 uFront2;     // a second line of the same kind: night is where either line has passed
uniform float uFlip;      // 0: black-figure first (day), 1: red-figure first
uniform float uKiln;      // azimuth of the kiln highlight (radians), once round a minute
uniform vec2 uAxis;       // world xz of the cup's axis
uniform vec3 uClay, uGlaze, uWhite, uPurple, uBrown, uBar;
float wdcBarMask = 1.;     // a mask surface sets this to 0 round added colour: the bar never lies across white or purple
float wdcH(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float wdcN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(wdcH(i), wdcH(i + vec2(1., 0.)), f.x), mix(wdcH(i + vec2(0., 1.)), wdcH(i + vec2(1., 1.)), f.x), f.y); }
// 0 = black-figure (glaze figures on clay), 1 = red-figure (clay figures on glaze)
float wdcNight(vec3 wp){
  float s = dot(wp.xz, uFront.xy) - uFront.z;
  float n = smoothstep(-uFront.w, uFront.w, s);
  float s2 = dot(wp.xz, uFront2.xy) - uFront2.z;
  n = max(n, smoothstep(-uFront2.w, uFront2.w, s2));
  return mix(n, 1. - n, uFlip);
}
// the kiln highlight: one soft cream bar in the mirror direction, sliding with position and view
float wdcBar(vec3 wp, vec3 N, vec3 V, float wide){
  if (wide < 0.) return 0.;                           // a surface the bar never lies on (the slipways under our keel)
  if (wide > 0.75) {                                  // sea, wall, kiln field: a spoke of light lying on the pot
    vec2 q = wp.xz - uAxis; vec2 kd = vec2(cos(uKiln), sin(uKiln));
    float hw = 2.5 + 0.035 * length(q);
    float ac = abs(q.x * kd.y - q.y * kd.x); float fa = max(fwidth(ac), 1e-4);
    float sb = (1. - smoothstep(hw - fa, hw + fa, ac)) * smoothstep(-hw, hw, dot(q, kd));       // firm edged: cream or black, never brown
    return sb * 0.8;
  }
  vec3 R = reflect(-V, N);
  float az = atan(R.z, R.x + (R.x < 0. ? -1e-4 : 1e-4));
  float k = mix(1., 0.22, wide);
  float ph = az + (dot(wp.xz, vec2(0.021, 0.013)) + wp.y * 0.017) * k - uKiln;
  float d = abs(fract(ph * 0.15915494 + 0.5) - 0.5) * 6.2831853;
  float w = mix(0.06, 0.13, wide);
  float fd = clamp(fwidth(ph), 1e-4, 0.5 * w);
  float b = 1. - smoothstep(w - fd, w + fd, d);       // a firm-edged bar: glaze is black or cream, never a brown gradient
  return b * 0.85;
}
// fig: 1 where the figure is (glaze by day), 0 on ground. line: the drawn line (0..1). white/purple: added colour.
// dry: 0..1 where the brush ran dry. Nb: normal tilted by the relief of the line (pass N if none).
vec3 wdcResolve(float fig, float line, float white, float purple, float dry, vec3 wp, vec3 N, vec3 Nb, vec3 V, float wide){
  float night = wdcNight(wp);
  float g = mix(fig * (1. - line), max(1. - fig, line * fig), night);      // amount of glaze on this pixel
  float burn = wdcN(wp.xz * 0.045 + wp.y * 0.06);
  vec3 clay = uClay * (0.95 + 0.1 * burn);
  clay *= 1. - 0.16 * step(0.988, wdcH(floor(gl_FragCoord.xy * 0.5) + 3.));      // the fixed fired-clay speckle
  float bead = night * line * fig;
  float bar = mix(wdcBar(wp, N, V, wide), 0.55 * wdcBar(wp, Nb, V, wide), bead) * wdcBarMask;
  float thin = dry * (1. - bead);
  vec3 glaze = mix(uGlaze, uBrown, thin) + uBar * bar * (1. - 0.75 * thin);
  vec3 col = mix(clay, glaze, g);
  col = mix(col, uPurple, purple);
  col = mix(col, uWhite, white);
  return col;
}
`,lt=`
attribute float aSub;     // 0 ground/edge (clay by day), 1 figure (glaze by day), 2 chalk white, 3 wine purple
attribute float aL;       // metres to the nearest drawn line (99 = none)
attribute float aPose;    // -1 always; else pose id
uniform vec4 uPose;       // n poses, rate (per s), mode (0 swap, 1 grow), ping-pong (0/1)
#ifdef WDC_INST
attribute vec4 aI;        // per instance: phase, rate scale, flag, spare
#endif
#ifdef WDC_SWING
attribute vec4 aPivot;    // per instance: pivot xyz (local), swing phase
#endif
varying vec3 vW; varying vec3 vN; varying vec2 vUv; varying float vSub; varying float vL; varying float vFlag;
uniform float uTime;
void main(){
  vec3 p = position; vec3 n = normal;
  float ph = 0.; float rs = 1.; vFlag = 0.;
  #ifdef WDC_INST
    ph = aI.x; rs = aI.y; vFlag = aI.z;
  #endif
  float st = floor(uTime * uPose.y * rs + ph);
  float nn = max(uPose.x, 1.);
  float per = uPose.w > 0.5 ? max(2. * nn - 2., 1.) : nn;
  float k = st - per * floor(st / per);
  if (uPose.w > 0.5 && k > nn - 0.5) k = per - k;
  float show = aPose < -0.5 ? 1. : (uPose.z > 0.5 ? step(aPose - 0.5, k) : 1. - step(0.5, abs(aPose - k)));
  #ifdef WDC_TIP
    float a = (k - 0.5) * 0.44 * (0.6 + 0.4 * sin(ph * 7.3));
    float ca = cos(a), sa = sin(a);
    p = vec3(p.x, p.y * ca - p.z * sa, p.y * sa + p.z * ca); n = vec3(n.x, n.y * ca - n.z * sa, n.y * sa + n.z * ca);
  #endif
  p *= show;
  vec4 lp = vec4(p, 1.);
  #ifdef USE_INSTANCING
    lp = instanceMatrix * lp; n = mat3(instanceMatrix) * n;
  #endif
  #ifdef WDC_SWING
    float ss = floor(uTime * 2.5 + aPivot.w);
    float sk = ss - 4. * floor(ss / 4.);
    float sw = (sk > 2.5 ? 0. : sk - 1.) * 0.07;
    vec3 q = lp.xyz - aPivot.xyz; float cs = cos(sw), sn = sin(sw);
    float ax = sin(aPivot.w * 3.1), az = cos(aPivot.w * 3.1);       // swing axis (horizontal)
    float along = q.x * az - q.z * ax;                               // horizontal offset across the axis
    float ny = q.y * cs - along * sn; float na = q.y * sn + along * cs;
    q += vec3(az, 0., -ax) * (na - along); q.y = ny;
    lp.xyz = aPivot.xyz + q;
  #endif
  vec4 wp = modelMatrix * lp;
  vW = wp.xyz; vN = mat3(modelMatrix) * n; vUv = uv; vSub = aSub; vL = aL;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,ct=`
varying vec3 vW; varying vec3 vN; varying vec2 vUv; varying float vSub; varying float vL; varying float vFlag;
uniform vec4 uSurf;       // line half width (m), dry strength, brush load length (m), wide (0..1)
uniform vec4 uSurf2;      // ghost groove offset (m, 0 none), brush stroke width (m), dot radius (uv), spare
#ifdef WDC_MASK
uniform sampler2D uMask;  // R glaze, G line, B chalk white, G and B together = wine purple
uniform vec2 uMaskSize;   // metres covered by the mask (for the brush coordinates)
#endif
${be}
void main(){
  vec3 N = vN / max(length(vN), 1e-5);
  if (!gl_FrontFacing) N = -N;
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  float s = floor(vSub + 0.5);
  float fig = step(0.5, s);
  float white = 1. - step(0.5, abs(s - 2.));
  float purple = 1. - step(0.5, abs(s - 3.));
  float fw = fwidth(vL);
  float hw = max(uSurf.x, 0.75 * fw);
  float keep = 1. - smoothstep(0.7, 2.4, fw);
  float line = (1. - smoothstep(hw, hw + fw + 1e-4, abs(vL))) * keep;
  if (uSurf2.x > 0.) line = max(line, 0.5 * keep * (1. - smoothstep(hw * 0.5, hw * 0.5 + fw + 1e-4, abs(abs(vL) - uSurf2.x))));
  vec2 bu = vUv;
  #ifdef WDC_MASK
    vec4 m = texture2D(uMask, vUv);
    float mp = min(m.g, m.b);
    float face = fig;                                          // the cut edge (aSub 0) carries no drawing
    fig *= m.r; line = max(line, (m.g - mp) * face); white = max(white, (m.b - mp) * face); purple = max(purple, mp * face);
    bu = vUv * uMaskSize * face;
    float nearC = textureLod(uMask, vUv, 5.).b * face; float ncw = clamp(fwidth(nearC), 1e-3, 0.03);
    wdcBarMask = 1. - smoothstep(0.045 - ncw, 0.045 + ncw, nearC);          // firm edged: the highlight stops short of the eye and the shields
  #endif
  #ifdef WDC_DOT
    float dr = length(vUv - vec2(-0.22, 0.25)); float dfw = fwidth(dr);
    float rr = length(vUv); float rfw = fwidth(rr);
    float grape = 1. - step(1.5, vFlag);                       // flag 2 = the stalk: plain glaze
    purple *= grape * (1. - smoothstep(0.72, 0.72 + rfw + 1e-4, rr));
    white = max(white, step(0.5, vFlag) * grape * (1. - smoothstep(uSurf2.z, uSurf2.z + dfw + 1e-4, dr)));
    bu = vW.xy;
  #endif
  white *= 1. - 0.9 * line; purple *= 1. - 0.9 * line;          // a scratch goes through added colour too
  // relief of the line: tilt the normal by the world-space gradient of the line value
  float lx = dFdx(line), ly = dFdy(line); vec3 px = dFdx(vW), py = dFdy(vW);
  vec3 grad = lx * px / max(dot(px, px), 1e-8) + ly * py / max(dot(py, py), 1e-8);
  vec3 Nb = N - grad * 0.035; Nb /= max(length(Nb), 1e-4);
  // the brush running dry: each stroke thins toward the end of its load
  float sw = max(uSurf2.y, 0.5);
  float stroke = floor(bu.y / sw);
  float uu = bu.x + 53.7 * wdcH(vec2(stroke, 3.7));
  float load = fract(uu / max(uSurf.z, 1.));
  float lr = smoothstep(0.55, 1., load);                        // streaks of thin glaze, more of them toward the end of the load
  float sn = wdcN(vec2(uu * 0.022, bu.y * 17. / sw)); float sfw = clamp(fwidth(sn), 0.01, 0.3);
  float dry = uSurf.y * lr * smoothstep(1.02 - 0.44 * lr - sfw, 1.02 - 0.44 * lr + sfw, sn);      // at most two fifths thin: streaks with black between them
  float wd = uSurf.w;
  #ifdef WDC_NOEDGEBAR
    if (s < 0.5) wd = -1.;                                     // a slab so near the eye that its cut edge would carry the whole bar: none
  #endif
  gl_FragColor = vec4(wdcResolve(fig, line, white, purple, dry, vW, N, Nb, V, wd), 1.);
}
`,ut=`
varying vec3 vW; varying vec3 vL;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vL = position; gl_Position = projectionMatrix * viewMatrix * wp; }
`,ht=`
varying vec3 vW; varying vec3 vL;
uniform vec4 uSea;        // r0 (first ring inner radius), pitch (m), band width (m), cell length (m)
uniform vec4 uSea2;       // ring speed (m/s), night alpha, outer radius, spare
${be}
void main(){
  vec2 p = vL.xz; float r = length(p);
  float fl = max(length(fwidth(p)), 1e-4);                               // long axis of the pixel footprint (m)
  float fw = max(sqrt(length(dFdx(p)) * length(dFdy(p))), 1e-4);         // its mean size: what decides when a band merges to a tone
  float ri = floor((r - uSea.x) / uSea.y);
  float t = (r - uSea.x - ri * uSea.y) / uSea.z;                    // 0..1 across the band (inner to outer)
  float rm = uSea.x + (ri + 0.5) * uSea.y;
  float dir = mod(ri, 2.) < 0.5 ? 1. : -1.;
  float cells = max(floor(6.2831853 * rm / uSea.w + 0.5), 3.);
  float spd = uSea2.x * (0.6 + 0.4 * wdcH(vec2(ri, 9.1))) * dir;
  float th = atan(p.y, p.x + (p.x < 0. ? -1e-4 : 1e-4)) + spd * uTime / max(rm, 1.);
  float sc = th * 0.15915494 * cells + dir * floor(uTime * 8.) * 0.03125;
  float cid = floor(sc); float su = fract(sc); if (dir < 0.) su = 1. - su;
  // one running-wave cell, in metres: x along the band, y across (0 at the trough side)
  float cw = 6.2831853 * rm / cells; float bw = uSea.z;
  vec2 q = vec2(su * cw, t * bw);
  vec2 c1 = vec2(0.58 * cw, 0.52 * bw); float r1 = 0.46 * bw;         // the body of the curl
  vec2 c2 = c1 + vec2(0.15, -0.13) * bw; float r2 = 0.31 * bw;       // the bite that hollows it into a hook
  float base = q.y - 0.22 * bw;                                         // solid foot of the wave
  float xe = max(c1.x - 0.22 * bw, 1e-3);
  float xr = clamp(q.x / xe, 0., 1.);
  float ramp = max(q.y - (0.22 + 0.52 * xr * xr) * bw, q.x - xe);    // the rising back
  float crest = max(min(length(q - c1) - r1, ramp), -(length(q - c2) - r2));
  float d = min(base, crest);
  float inBand = step(0., t) * step(t, 1.) * step(uSea.x, r) * step(r, uSea2.z);
  float ew = clamp(0.75 * length(vec2(dFdx(d), dFdy(d))), 1e-4, fl);      // the edge is filtered across itself, not along the view: crisp at grazing angles
  float wave = (1. - smoothstep(-ew, ew, d)) * inBand;
  float tone = 0.42 * inBand;                                           // what the band averages to far away
  float fig = mix(wave, tone, smoothstep(0.25 * bw, 0.8 * bw, fw));
  // a fine reserved line under each band: the groundline
  float gr = abs(r - uSea.x - ri * uSea.y + 0.9); float gw = clamp(fwidth(gr), 1e-4, fl); float gh = max(0.14, 0.8 * gw);
  float gl = 1. - smoothstep(gh - 0.5 * gw, gh + 0.5 * gw, gr);
  fig = max(fig, gl * step(uSea.x - 1., r) * step(r, uSea2.z + 1.) * (1. - smoothstep(0.5, 2., fw)));
  float lr = smoothstep(0.5, 1., fract(sc * 0.125 + wdcH(vec2(ri, 2.))));
  float sn = wdcN(vec2(sc * 0.9, t * 17.)); float sfw = clamp(fwidth(sn), 0.01, 0.3);
  float dry = 0.75 * lr * smoothstep(1.02 - 0.6 * lr - sfw, 1.02 - 0.6 * lr + sfw, sn) * (1. - smoothstep(0.15 * bw, 0.5 * bw, fw));   // streaks, not a wash
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  vec3 N = vec3(0., 1., 0.);
  vec3 col = wdcResolve(fig, 0., 0., 0., dry * fig, vW, N, N, V, 1.);     // dry streaks only in the waves' own glaze: the night mirror is plain black
  float night = wdcNight(vW);
  gl_FragColor = vec4(col, mix(1., mix(uSea2.y, 1., fig), night));
}
`,ft=`
varying vec3 vD;
void main(){ vD = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }
`,dt=`
varying vec3 vD; uniform vec3 uKilnCol; uniform float uKilnR; uniform vec2 uRim; uniform float uKilnAvoid;
${be}
void main(){
  vec3 d = vD / max(length(vD), 1e-4);
  vec3 wp = cameraPosition + vec3(d.x, 0., d.z) * uKilnR;       // the field is a dome of radius uKilnR over the eye: the front closes over it
  float night = wdcNight(wp);
  float nw = clamp(fwidth(night), 1e-3, 0.5); night = smoothstep(0.5 - nw, 0.5 + nw, night);     // a hard join on the field too, never a gradient
  vec3 V = -d; vec3 N = vec3(-d.x, 0., -d.z); N /= max(length(N), 1e-3);
  // the kiln highlight on the mirror field: not a beam but the reflection of the kiln mouth, a short cream bar with
  // round ends that bends with the pot and slides round it, with a smaller echo on the far side
  float az = atan(d.z, d.x + (d.x < 0. ? -1e-4 : 1e-4)) - uKiln - 2.2;
  float el = asin(clamp(d.y, -1., 1.));
  float da = (fract(az * 0.15915494 + 0.5) - 0.5) * 6.2831853;
  // a low flat bar with round ends lying just over the rim and bending with it (uRim: the rim's radius and height;
  // its elevation is worked out where this direction meets the rim), never a crescent; it draws in to nothing as it
  // nears uKilnAvoid, the azimuth of the handle, so no light ever stands behind the way out
  vec2 rc = cameraPosition.xz - uAxis; vec2 dh = d.xz / max(length(d.xz), 1e-3); float rb = dot(rc, dh);
  float rT = -rb + sqrt(max(rb * rb - dot(rc, rc) + uRim.x * uRim.x, 0.));
  float elR = atan(uRim.y - cameraPosition.y, max(rT, 1.));
  float dv = abs(fract((uKiln + 2.2 - uKilnAvoid) * 0.15915494 + 0.5) - 0.5) * 6.2831853;
  float grow = smoothstep(0.5, 1.0, dv);
  float lz = length(vec2(max(abs(da) - 0.42 * grow, 0.) * 0.9, el - elR - 0.05)) - 0.024 * grow;
  float lw = clamp(fwidth(lz), 1e-4, 0.02);
  float sb = 1. - smoothstep(-lw, lw, lz);
  vec3 glaze = mix(uGlaze, uWhite * 0.93, sb);
  vec3 field = uKilnCol * (1. - 0.12 * step(0.988, wdcH(floor(gl_FragCoord.xy * 0.5) + 3.)));
  gl_FragColor = vec4(mix(field, glaze, night), 1.);
}
`;function qe(t,w=5){const r=t.length,z=[];for(let o=0;o<r;o++){const x=t[o],m=t[(o+1)%r],c=x[2]?x:t[(o-1+r)%r],g=m[2]?m:t[(o+2)%r],i=x[2]&&m[2]?1:w;for(let M=0;M<i;M++){const P=M/i,e=P*P,f=e*P,n=(a,d,S,p)=>.5*(2*d+(-a+S)*P+(2*a-5*d+4*S-p)*e+(-a+3*d-3*S+p)*f);z.push([n(c[0],x[0],m[0],g[0]),n(c[1],x[1],m[1],g[1])])}}return z}function ce(t,w,r,z,o,x,m){const c=new u.BufferGeometry;return c.setAttribute("position",new u.Float32BufferAttribute(t,3)),c.setAttribute("normal",new u.Float32BufferAttribute(w,3)),c.setAttribute("uv",new u.Float32BufferAttribute(r,2)),c.setAttribute("aSub",new u.Float32BufferAttribute(z,1)),c.setAttribute("aL",new u.Float32BufferAttribute(o,1)),c.setAttribute("aPose",new u.Float32BufferAttribute(x,1)),m&&c.setIndex(m),c}function se(t,w=.5,r={}){const z=r.sub??1,o=r.edgeSub??0,x=r.pose??-1,m=r.z??0,c=r.holes||[],g=t.map(v=>new u.Vector2(v[0],v[1]));u.ShapeUtils.isClockWise(g)&&g.reverse();const s=c.map(v=>{const F=v.map(l=>new u.Vector2(l[0],l[1]));return u.ShapeUtils.isClockWise(F)||F.reverse(),F}),i=u.ShapeUtils.triangulateShape(g,s),M=g.concat(...s),P=[],e=[],f=[],n=[],a=[],d=[],S=[],p=v=>r.uvRect?[(v.x-r.uvRect[0])/r.uvRect[2],(v.y-r.uvRect[1])/r.uvRect[3]]:[v.x,v.y],b=m+w/2,y=m-w/2,k=M.length;for(const v of M)P.push(v.x,v.y,b),e.push(0,0,1),f.push(...p(v)),n.push(z),a.push(99),d.push(x);for(const v of i)S.push(v[0],v[1],v[2]);if(r.back!==!1){for(const v of M)P.push(v.x,v.y,y),e.push(0,0,-1),f.push(...p(v)),n.push(r.backSub??z),a.push(99),d.push(x);for(const v of i)S.push(k+v[0],k+v[2],k+v[1])}if(w>0){const v=[g,...s];for(const F of v){let l=0;for(let A=0;A<F.length;A++){const R=F[A],T=F[(A+1)%F.length],C=T.x-R.x,K=T.y-R.y,I=Math.hypot(C,K)||1e-6,ue=K/I,j=-C/I,q=P.length/3;P.push(R.x,R.y,b,T.x,T.y,b,T.x,T.y,y,R.x,R.y,y);for(let ne=0;ne<4;ne++)e.push(ue,j,0),n.push(o),a.push(99),d.push(x);f.push(l,0,l+I,0,l+I,w,l,w),l+=I,S.push(q,q+2,q+1,q,q+3,q+2)}}}return ce(P,e,f,n,a,d,S)}function Me(t,w,r={}){const z=r.sub??1,o=r.edgeSub??0,x=r.thick??.5,m=r.up||new u.Vector3(0,1,0),c=[],g=[],s=[],i=[],M=[],P=[],e=[],f=new u.Vector3,n=new u.Vector3,a=new u.Vector3,d=new u.Vector3;let S=r.u0??0;const p=t.length,b=[];for(let k=0;k<p;k++){f.subVectors(t[Math.min(k+1,p-1)],t[Math.max(k-1,0)]),n.crossVectors(f,m),n.lengthSq()<1e-10&&n.set(1,0,0),n.normalize(),k>0&&(S+=t[k].distanceTo(t[k-1]));const v=w[k]*.5,F=r.poseAt?r.poseAt(k):r.pose??-1;a.copy(t[k]).addScaledVector(n,-v),d.copy(t[k]).addScaledVector(n,v),b.push(a.clone(),d.clone(),n.clone(),S,F),c.push(a.x,a.y,a.z,d.x,d.y,d.z),g.push(m.x,m.y,m.z,m.x,m.y,m.z),s.push(S,-v,S,v),i.push(z,z),M.push(r.rib?v:99,r.rib?v:99),P.push(F,F),r.rib&&(c.push(t[k].x,t[k].y,t[k].z),g.push(m.x,m.y,m.z),s.push(S,0),i.push(z),M.push(0),P.push(F))}const y=r.rib?3:2;for(let k=0;k<p-1;k++){const v=k*y,F=v+y;r.rib?e.push(v,v+2,F,F,v+2,F+2,v+2,v+1,F+2,F+2,v+1,F+1):e.push(v,v+1,F,F,v+1,F+1)}if(x>0)for(let k=0;k<2;k++){const v=c.length/3;for(let F=0;F<p;F++){const l=b[F*5+k],A=b[F*5+2],R=b[F*5+3],T=b[F*5+4],C=k?1:-1;c.push(l.x,l.y,l.z,l.x-m.x*x,l.y-m.y*x,l.z-m.z*x),g.push(A.x*C,A.y*C,A.z*C,A.x*C,A.y*C,A.z*C),s.push(R,0,R,x),i.push(o,o),M.push(99,99),P.push(T,T)}for(let F=0;F<p-1;F++){const l=v+F*2;e.push(l,l+1,l+2,l+2,l+1,l+3)}}return ce(c,g,s,i,M,P,e)}function pt(t,w={}){const r=w.palette||it,z=e=>new u.Color(e),o={clay:z(r[0]),glaze:z(r[1]),white:z(r[2]),purple:z(r[3]),brown:z(r[4]),kiln:z(r[5])},x={clay:o.clay.clone().multiply(new u.Color(D.clay[0],D.clay[1],D.clay[2])),glaze:o.glaze.clone().multiplyScalar(D.glaze),white:o.white.clone().multiply(new u.Color(D.white[0],D.white[1],D.white[2])),purple:o.purple.clone().multiply(new u.Color(D.purple[0],D.purple[1],D.purple[2])),brown:o.brown.clone().multiply(new u.Color(D.brown[0],D.brown[1],D.brown[2])),kiln:o.kiln.clone().multiply(new u.Color(D.kiln[0],D.kiln[1],D.kiln[2])),bar:o.white.clone().multiplyScalar(D.bar)},m={uTime:{value:0},uFront:{value:new u.Vector4(0,-1,60,2.5)},uFront2:{value:new u.Vector4(1,0,1e6,2.5)},uFlip:{value:w.startNight?1:0},uKiln:{value:0},uAxis:{value:new u.Vector2(0,0)},uClay:{value:x.clay},uGlaze:{value:x.glaze},uWhite:{value:x.white},uPurple:{value:x.purple},uBrown:{value:x.brown},uBar:{value:x.bar}},c=e=>Object.assign({},m,e),g=[];function s(e={}){const f={};e.mask&&(f.WDC_MASK=1),(e.inst||e.tip||e.dot)&&(f.WDC_INST=1),e.swing&&(f.WDC_SWING=1),e.noEdgeBar&&(f.WDC_NOEDGEBAR=1),e.tip&&(f.WDC_TIP=1),e.dot&&(f.WDC_DOT=1);const n=new u.ShaderMaterial({defines:f,vertexShader:lt,fragmentShader:ct,side:e.side??u.DoubleSide,uniforms:c({uSurf:{value:new u.Vector4(e.lineW??.09,e.dry??.6,e.load??46,e.wide??0)},uSurf2:{value:new u.Vector4(e.ghost??0,e.strokeW??4,e.dotR??.3,0)},uPose:{value:new u.Vector4(e.poses??1,e.poseRate??8,e.grow?1:0,e.pingpong?1:0)},uMask:{value:e.mask||null},uMaskSize:{value:new u.Vector2(...e.maskSize||[1,1])}})});return n.extensions.derivatives=!0,g.push(n),n}function i(e={}){const f=new u.ShaderMaterial({vertexShader:ut,fragmentShader:ht,transparent:!0,depthWrite:!0,uniforms:c({uSea:{value:new u.Vector4(e.r0??22,e.pitch??15,e.band??6.5,e.cell??11)},uSea2:{value:new u.Vector4(e.speed??4.5,e.nightAlpha??.7,e.outer??200,0)}})});return f.extensions.derivatives=!0,g.push(f),f}function M(){const e=new u.ShaderMaterial({vertexShader:ft,fragmentShader:dt,side:u.BackSide,depthWrite:!1,depthTest:!0,uniforms:c({uKilnCol:{value:x.kiln},uKilnR:{value:170},uRim:{value:new u.Vector2(392,134)},uKilnAvoid:{value:99}})});return g.push(e),e}function P(){const e=new u.Mesh(new u.IcosahedronGeometry(10,2),M());return e.frustumCulled=!1,e.renderOrder=-.5,e}return{palette:o,ink:x,uniforms:m,glsl:be,slab:s,sea:i,kiln:M,kilnDome:P,slabGeometry:se,ribbonGeometry:Me,smoothOutline:qe,setFront(e,f,n,a=2.5){const d=Math.hypot(e,f)||1;m.uFront.value.set(e/d,f/d,n,a)},setFront2(e,f,n,a=2.5){const d=Math.hypot(e,f)||1;m.uFront2.value.set(e/d,f/d,n,a)},setFlip(e){m.uFlip.value=e?1:0},setAxis(e,f){m.uAxis.value.set(e,f)},update(e,f){m.uTime.value=f,m.uKiln.value=f*_/60%_},dispose(){for(const e of g)e.dispose()}}}const D={clay:[1,.93,1.55],glaze:1,white:[1.17,1.1,.95],purple:[.85,1.8,1.65],brown:[1.5,2,2.4],kiln:[1.08,.8,.8],bar:1.3},G=t=>4-t,Y=8,W={x0:-62,y0:-5,w:130,h:65,px:2048,py:1024},E={x0:-27,y0:35,per:48,wx:-20,wy:47},wt=[[63,4.6,1],[55,.6],[40,-1.6],[0,-2.4],[-34,-1.6],[-50,3],[-58,14],[-61,28],[-59,42],[-52,52],[-43,55.5],[-37,52],[-35.4,46.2,1],[-40.5,48.6],[-46.5,46.6],[-51.2,40],[-52.6,31],[-50,25.6],[-44,23.5],[-20,22],[10,22],[30,23.4],[38,25,1],[38,30.2,1],[47.4,30.6,1],[50.6,39],[49.8,45.4],[46.6,49.4,1],[52.6,45.6],[54.4,38],[53.4,30],[51.2,22.6],[50.4,16],[53.4,10.8],[58.4,8.2]],ke=[[-44,23.5],[-20,22],[10,22],[30,23.4],[38,25]];function X(t){for(let w=0;w<ke.length-1;w++){const r=ke[w],z=ke[w+1];if(t<=z[0]||w===ke.length-2){const o=(t-r[0])/(z[0]-r[0]),x=o*o*(3-2*o);return r[1]+(z[1]-r[1])*(.5*o+.5*x)}}return 22}async function mt(t,w,r){const z=document.createElement("canvas");z.width=W.px,z.height=W.py;const o=z.getContext("2d"),x=W.px/W.w,m=l=>(G(l)-W.x0)*x,c=l=>W.py-(l-W.y0)*(W.py/W.h),g="#ff0000",s="#ffff00",i="#ff00ff",M="#ffffff",P="#000000";await t.yield?.(),o.fillStyle=g,o.fillRect(0,0,W.px,W.py),await t.yield?.(),o.lineCap="round",o.lineJoin="round";const e=(l,A)=>{o.beginPath(),l.forEach((R,T)=>T?o.lineTo(m(R[0]),c(R[1])):o.moveTo(m(R[0]),c(R[1]))),A&&o.closePath()},f=(l,A,R,T)=>{e(l,T),o.strokeStyle=R,o.lineWidth=A*x,o.stroke()},n=(l,A,R,T)=>{o.beginPath(),o.arc(m(l),c(A),R*x,0,_),o.fillStyle=T,o.fill()},a=(l,A,R,T,C)=>{o.beginPath(),o.arc(m(l),c(A),R*x,0,_),o.strokeStyle=C,o.lineWidth=T*x,o.stroke()},d=.9+w()*.5,S=.7+w()*.4;o.beginPath(),r.forEach((l,A)=>{const R=(l[0]+d-W.x0)*x,T=W.py-(l[1]-S-W.y0)*(W.py/W.h);A?o.lineTo(R,T):o.moveTo(R,T)}),o.closePath(),o.strokeStyle="rgba(255,255,0,0.85)",o.lineWidth=.3*x,o.stroke(),await t.yield?.();const p=(l,A,R)=>{const T=[];for(let C=A;C<=R;C+=2)T.push([C,X(C)-l]);return T};f(p(1.7,-45,44),.34,s),f(p(2.9,-45,46),.34,s),f([[-47,9.6],[-20,8.6],[20,8.6],[46,9.6]],.34,s),f([[-45,8.1],[-20,7.2],[20,7.2],[44,8]],.3,s);const b=11;for(let l=0;l<b;l++){const A=-30+l*6,R=X(A)-7.4;l%2===0?(n(A,R,2.75,i),a(A,R,1.55,.36,g),n(A,R,.5,g)):(n(A,R,2.75,M),a(A,R,1.6,.34,s),n(A,R,.5,s)),a(A,R,3.25,.3,s),l<b-1&&a(A+3,12.2,.85,.3,s)}const y=45.2,k=12.6;o.beginPath(),o.moveTo(m(y-6.6),c(k-.5)),o.quadraticCurveTo(m(y-.5),c(k+5.4),m(y+6.2),c(k+.4)),o.quadraticCurveTo(m(y+.2),c(k-4.6),m(y-6.6),c(k-.5)),o.closePath(),o.fillStyle=i,o.fill(),n(y,k+.1,2.45,M),n(y,k+.1,1.25,g),n(y,k+.1,.22,P),f([[y-8.2,k+3.2],[y-3,k+6.6],[y+3.4,k+6.4],[y+7.6,k+3.6]],.36,s),f([[y-7.8,k-.6],[y-10.4,k-1.9]],.34,s);for(let l=0;l<3;l++)f([[52.5,9.4-l*1.5],[60.2-l*.6,6.3-l*.75]],.3,s);o.save(),o.translate(m(51.6),c(40.6)),o.rotate(.12),o.fillStyle=i,o.fillRect(-4*x,-.9*x,8*x,1.8*x),o.restore(),f([[48.4,33.2],[54.6,33.2]],.32,s),f([[48.6,34.6],[54.8,34.6]],.32,s);const v=[[-52,12],[-55.6,20],[-56.8,29],[-55.4,40.5],[-50.2,48.6],[-43.4,51.8],[-39.4,50]];o.beginPath(),o.moveTo(m(v[0][0]),c(v[0][1]));for(let l=1;l<v.length-1;l++){const A=v[l],R=v[l+1];o.quadraticCurveTo(m(A[0]),c(A[1]),m((A[0]+R[0])/2),c((A[1]+R[1])/2))}o.strokeStyle=s,o.lineWidth=.34*x,o.stroke(),n(-41.6,50.9,.75,i),n(-45.2,50.9,.75,i),n(-48.6,49.4,.75,i);for(let l=0;l<5;l++)f([[-58.6+l*.5,16+l*2.3],[-54.2+l*.3,15.2+l*2.3]],.28,s);await t.yield?.();{const l=I=>(I-W.x0)*x,A=I=>W.py-(I-W.y0)*(W.py/W.h),R=(I,ue)=>{o.beginPath(),I.forEach((j,q)=>q?o.lineTo(l(j[0]),A(j[1])):o.moveTo(l(j[0]),A(j[1]))),o.strokeStyle=s,o.lineWidth=ue*x,o.stroke()};o.lineCap="butt",o.lineJoin="miter";const T=E.x0-2.4,C=E.x0+E.per+9.6,K=E.y0;R([[T,K+.75],[C,K+.75]],.34),R([[T,K+Y-.75],[C,K+Y-.75]],.34);for(let I=T;I<C-.1;I+=2.4)R([[I,K+1.7],[I+1.5,K+Y/2],[I,K+Y-1.7]],.36);o.fillStyle=i,o.fillRect(l(E.wx),A(E.wy+4),4*x,4*x)}await t.yield?.();const F=new u.CanvasTexture(z);return F.colorSpace=u.NoColorSpace,F.anisotropy=4,F.generateMipmaps=!0,F.minFilter=u.LinearMipmapLinearFilter,F.magFilter=u.LinearFilter,F}function yt(){const t=qe(wt,5).map(c=>[G(c[0]),c[1]]),w=[W.x0,W.y0,W.w,W.h],r=[se(t,Y,{uvRect:w,edgeSub:1})];{const c=r[0],g=c.getAttribute("normal"),s=c.getAttribute("uv"),i=c.getAttribute("position"),M=e=>(e-W.x0)/W.w,P=e=>(e-W.y0)/W.h;for(let e=0;e<g.count;e++){if(Math.abs(g.getZ(e))>.5)continue;const f=s.getX(e),n=s.getX(e+1)-f,a=f-E.per*Math.floor(f/E.per),d=(i.getY(e)+i.getY(e+1))/2,S=(i.getX(e)+i.getX(e+1))/2,p=S<-42&&d>39.3&&d<42.2;for(let b=0;b<4;b++){const y=b===1||b===2?a+n:a,k=s.getY(e+b)>1?Y:0;p?s.setXY(e+b,M(E.wx+2),P(E.wy+2)):s.setXY(e+b,M(E.x0+y),P(E.y0+k))}e+=3}}const z=[],o=[];for(let c=-36;c<=34;c+=2)z.push([G(c),X(c)-.6]);for(let c=34;c>=-36;c-=2)z.push([G(c),X(c)+3.6]);for(let c=-35;c<33;c+=4){const g=c+.55,s=c+3.45;o.push([[G(g),X(g)+.7],[G(s),X(s)+.7],[G(s),X(s)+2.7],[G(g),X(g)+2.7]])}r.push(se(z,Y-.5,{holes:o,uvRect:w}));const x=[[-45.2,31.6],[-44.2,31.2],[-52.6,9],[-54.2,4],[-56.4,-2.6],[-59.6,-2.2],[-57.6,4.6],[-54.4,9.6]].map(c=>[G(c[0]),c[1]]);for(const c of[-1,1])r.push(se(x,.7,{z:c*(Y/2+.36),uvRect:[0,0,1e5,1e5]}));return{geo:_e(r,!1),outline:t}}const L={x0:-26,x1:26,y0:27.5,y1:87.5,yard:88.1},ze=95;function Ke(t){const o=[],x=[],m=[],c=[],g=[],s=[],i=[],M=2.5+t*3.2,P=1.2+t*1.7,e=.012+.016*t,f=(a,d)=>{const S=a/10,p=d/20,b=Math.sin(Math.PI*S),y=Math.sin(Math.PI*Math.pow(p,.8)),k=L.y0+P*b;return[(L.x0+(L.x1-L.x0)*S)*(1-e*2*Math.sin(Math.PI*p)*Math.abs(S-.5)*2),L.y1+(k-L.y1)*p,M*Math.pow(b,.8)*y]};for(let a=0;a<2;a++){const d=o.length/3,S=a?-1/2:1/2;for(let p=0;p<=20;p++)for(let b=0;b<=10;b++){const y=f(b,p);o.push(y[0],y[1],y[2]+S),x.push(0,0,a?-1:1),m.push(y[0],y[1]),c.push(2),g.push(p%2?2.5:0),s.push(t)}for(let p=0;p<20;p++)for(let b=0;b<10;b++){const y=d+p*11+b,k=y+1,v=y+10+1,F=v+1;a?i.push(y,k,v,k,F,v):i.push(y,v,k,k,v,F)}}const n=[];for(let a=0;a<=10;a++)n.push(f(a,0));for(let a=1;a<=20;a++)n.push(f(10,a));for(let a=9;a>=0;a--)n.push(f(a,20));for(let a=19;a>=1;a--)n.push(f(0,a));for(let a=0;a<n.length;a++){const d=n[a],S=n[(a+1)%n.length],p=o.length/3;o.push(d[0],d[1],d[2]+1/2,S[0],S[1],S[2]+1/2,S[0],S[1],S[2]-1/2,d[0],d[1],d[2]-1/2);const b=S[0]-d[0],y=S[1]-d[1],k=Math.hypot(b,y)||1;for(let v=0;v<4;v++)x.push(-y/k,b/k,0),m.push(0,0),c.push(0),g.push(99),s.push(t);i.push(p,p+1,p+2,p,p+2,p+3)}return ce(o,x,m,c,g,s,i)}function vt(t){const w=[],r=[],z=[],o=[],x=[],m=[],c=[],s=ze+2,i=56,M=1.3,P=e=>{const f=18+(s-18)*(e/i),n=t+f*_/34,a=2+1.1*Math.max(0,(f-86)/10),d=Math.cos(n),S=Math.sin(n);return[[d*a-S*M/2,S*a+d*M/2],[-d*a-S*M/2,-S*a+d*M/2],[-d*a+S*M/2,-S*a-d*M/2],[d*a+S*M/2,S*a-d*M/2],f,d,S]};for(let e=0;e<4;e++){const f=w.length/3;for(let n=0;n<=i;n++){const a=P(n),d=a[e],S=a[(e+1)%4],p=a[5],b=a[6],y=e===0?[-b,p]:e===1?[-p,-b]:e===2?[b,-p]:[p,b];w.push(d[0],a[4],d[1],S[0],a[4],S[1]),r.push(y[0],0,y[1],y[0],0,y[1]),z.push(a[4],-2,a[4],2);const k=e%2===0?1:0;o.push(k,k),x.push(99,99),m.push(-1,-1)}for(let n=0;n<i;n++){const a=f+n*2;c.push(a,a+1,a+2,a+2,a+1,a+3)}}return ce(w,r,z,o,x,m,c)}function gt(t,w){const r=[Ke(0),Ke(1),Ke(2)],z=[vt(t)],o=qe([[-29.5,L.yard+1.6,1],[-28.6,L.yard-.2],[-20,L.yard-.9],[20,L.yard-.9],[28.6,L.yard-.2],[29.5,L.yard+1.6,1],[27.6,L.yard+1.2],[20,L.yard+.9],[-20,L.yard+.9],[-27.6,L.yard+1.2]],3);r.push(se(o,2.2,{}));for(const s of r)s.rotateY(w),z.push(s);const x=(s,i,M,P)=>{const e=i[0]-s[0],f=i[1]-s[1],n=Math.hypot(e,f),a=-f/n*M/2,d=e/n*M/2;return se([[s[0]+a,s[1]+d],[i[0]+a,i[1]+d],[i[0]-a,i[1]-d],[s[0]-a,s[1]-d]],.6,{z:P})};z.push(x([0,88],[G(47.6),47.5],.8,0),x([0,88],[G(-45),53.6],.8,0));const m=Math.cos(w),c=Math.sin(w),g=new u.Vector3(0,.25,1).normalize();for(const[s,i]of[[L.x0+.4,G(33)],[L.x1-.4,G(-26)]]){const M=new u.Vector3(s*m,L.y0+.8,-s*c),P=new u.Vector3(i,X(G(i))+.4,Math.sign(-s*c)*3);z.push(Me([M,M.clone().lerp(P,.5),P],[.7,.7,.7],{thick:.5,up:g}))}return _e(z,!1)}function xt(){const t=[],w=[],r=[],z=[],o=[],x=[],m=[],s=[[-128,2.5],[-64,3.15],[0,3.7],[64,3.15],[128,2.5]],i=[],M=(p,b)=>{const y=p*Math.PI/180;return[Math.sin(y)*b,2.3+Math.cos(y)*b]};i.push([...M(-168,1),.62]);for(let p=0;p<s.length;p++){const[b,y]=s[p];i.push([...M(b-17,y*.74),Math.sin(17*Math.PI/180)*y*.74]),i.push([...M(b,y),0]),i.push([...M(b+17,y*.74),Math.sin(17*Math.PI/180)*y*.74]),p<s.length-1&&i.push([...M(b+32,1.55),Math.sin(32*Math.PI/180)*1.55])}i.push([...M(168,1),.62]);const P=(p,b,y,k,v,F)=>(t.push(p,b,y),w.push(0,F,0),r.push(p,y),z.push(k),o.push(v),x.push(-1),t.length/3-1),e=P(0,0,2.3,1,0,1),f=t.length/3;for(const p of i)P(p[0],0,p[1],1,p[2],1);for(let p=0;p<i.length-1;p++)m.push(e,f+p,f+p+1);const n=P(-.2,0,0,1,99,1),a=P(.2,0,0,1,99,1),d=P(.24,0,2.3,1,99,1),S=P(-.24,0,2.3,1,99,1);m.push(n,a,d,n,d,S);for(let p=0;p<i.length-1;p++){const b=i[p],y=i[p+1],k=y[0]-b[0],v=y[1]-b[1],F=Math.hypot(k,v)||1,l=t.length/3;t.push(b[0],0,b[1],y[0],0,y[1],y[0],-.17,y[1],b[0],-.17,b[1]);for(let A=0;A<4;A++)w.push(-v/F,0,k/F),r.push(0,0),z.push(0),o.push(99),x.push(-1);m.push(l,l+1,l+2,l,l+2,l+3)}return ce(t,w,r,z,o,x,m)}function bt(){const t=[],w=[],r=[],z=[],o=[],x=[],m=[];for(let g=0;g<10;g++){const s=(g+.5)/10*_,i=Math.cos(s)*1.03,M=Math.sin(s)*1.03;t.push(i,M,0),w.push(0,0,1),r.push(i,M),z.push(3),o.push(99),x.push(-1)}for(let g=1;g<9;g++)m.push(0,g,g+1);return ce(t,w,r,z,o,x,m)}function Mt(t,w){const r=[],z=[],o=[],x=[],m=(g,s,i,M,P,e,f,n,a,d,S)=>{const p=[],b=[],y=[],v=Math.max(3,Math.round(P/5)),F=t()*_;for(let l=0;l<=v;l++){const A=l*5,R=l/v,T=M+n*Math.sin(A/a+F)*Math.min(1,A/30)+d*R*R,C=i+(S-i)*Math.min(1,A/22)*Math.min(1,A/22)*(3-2*Math.min(1,A/22));p.push(new u.Vector3(g,C,s)),b.push(e+(f-e)*Math.pow(R,.8)),y.push(T),g+=Math.cos(T)*5,s+=Math.sin(T)*5}return{pts:p,ws:b,hs:y}},c=t()*_;for(let g=0;g<7;g++){const s=c+(g+(t()-.5)*.45)*_/7,i=97.2+g*3%7*1.15,M=w*(.74+t()*.26),P=m(0,0,ze+.5,s,M,4.2,1.5,.38+t()*.2,26+t()*14,(t()-.5)*.7,i);r.push(P);const e=P.pts.length,f=4+Math.floor(t()*2);x.push({p:P.pts[e-1],h:P.hs[e-1],w:1.5,r:8+t()*3,dir:t()<.5?1:-1});let n=t()<.5?1:-1;for(let a=0;a<f;a++){const d=Math.floor(e*(.16+.68*(a+.3+t()*.4)/f)),S=P.pts[d],p=34+t()*52*(1-.4*d/e),b=m(S.x,S.z,S.y,P.hs[d]+n*(.75+t()*.45),p,P.ws[d]*.62,.9,.3,14+t()*8,-n*(.5+t()*.8),i+.42*(a+1)*(a%2?-1:1)*.5+.3);r.push(b);const y=b.pts.length;x.push({p:b.pts[y-1],h:b.hs[y-1],w:.9,r:5+t()*3,dir:-n}),n=-n}}{const g=w*.767,s=100,i=t()*_,M=[],P=[],e=[];for(let n=0;n<=s;n++){const a=c+n/s*_,d=g+5.5*Math.sin(a*5+i);M.push(new u.Vector3(Math.cos(a)*d,99.4,Math.sin(a)*d)),P.push(2.5),e.push(a+Math.PI/2)}r.push({pts:M,ws:P,hs:e});const f=13;for(let n=0;n<f;n++){const a=c+(n+.25+t()*.5)/f*_,d=g+5.5*Math.sin(a*5+i),S=n%2?1:-1,p=m(Math.cos(a)*d,Math.sin(a)*d,99.4,a+S*(.25+t()*.3),w*(.26+t()*.05),2.3,1,.3,14+t()*8,-S*(.3+t()*.5),99.8+n%3*.5);r.push(p);const b=p.pts.length;x.push({p:p.pts[b-1],h:p.hs[b-1],w:1,r:5+t()*2.5,dir:-S})}}for(const g of r){let s=t()<.5?1:-1;for(let i=2;i<g.pts.length-1;i++){const M=g.pts[i],P=g.hs[i],e=g.ws[i],f=t()<.75?2:1;for(let n=0;n<f;n++){const a=(t()-.5)*4,d=P+s*(1+t()*.75);z.push({x:M.x+Math.cos(P)*a-Math.sin(P)*s*e*.4,y:M.y-.12-t()*.2,z:M.z+Math.sin(P)*a+Math.cos(P)*s*e*.4,yaw:d,s:.8+t()*.5,key:t()}),s=-s}o.push({x:M.x,y:M.y-.5,z:M.z,r:Math.hypot(M.x,M.z),key:t(),drop:t(),jit:t(),ph:t()})}}return{arms:r,seats:z,hangs:o,tendrils:x}}async function zt(t,w={}){const r=t.rng,z=w.style||pt(t,w),o=!w.style,x=Math.min(1,Math.max(.5,w.detail??t.quality?.detail??1)),m=w.reach??292,c=w.spin??.011,g=new u.Group;g.name="vine-ship";const s=new u.Group;g.add(s);const i=(h,N=s)=>(h.frustumCulled=!1,h.matrixAutoUpdate=!0,N.add(h),h),M=r()*_,{geo:P,outline:e}=yt();await t.yield?.();const f=await mt(t,r,e);await t.yield?.();const n=z.slab({mask:f,maskSize:[W.w,W.h],dry:.8,load:58+r()*14,strokeW:5.5,wide:.12}),a=i(new u.Mesh(P,n)),d=gt(M,(r()<.5?-1:1)*(.36+r()*.16));await t.yield?.();const S=z.slab({poses:3,poseRate:1.3,pingpong:!0,dry:.5,load:40,strokeW:3,lineW:.13}),p=i(new u.Mesh(d,S)),b=Mt(r,m);await t.yield?.();const y=[];let k=0;for(const h of b.arms)y.push(Me(h.pts,h.ws,{thick:2.4,edgeSub:1,u0:k*17})),++k%8===0&&await t.yield?.();const v=6;for(const h of b.tendrils){const N=-Math.sin(h.h)*h.dir,B=Math.cos(h.h)*h.dir,ae=h.p.x+N*h.r,Z=h.p.z+B*h.r,pe=Math.atan2(-B,-N),we=2.55,me=9;for(let O=0;O<v;O++){const U=[],ee=[];for(let te=0;te<=me;te++){const ye=(O+te/me)/v,xe=pe+h.dir*ye*we*_,Qe=h.r*(1-.86*Math.pow(ye,.8));U.push(new u.Vector3(ae+Math.cos(xe)*Qe,h.p.y,Z+Math.sin(xe)*Qe)),ee.push(h.w*(1-.5*ye))}y.push(Me(U,ee,{thick:1.6,edgeSub:1,pose:O}))}await t.yield?.()}const F=[];for(let h=0;h<14;h++){const N=h/14*_,B=h%2?6.4:5.2;F.push([Math.cos(N)*B,Math.sin(N)*B])}const l=se(F,1.6,{});l.rotateX(-Math.PI/2),l.translate(0,ze+1.1,0),y.push(l),await t.yield?.();const A=_e(y,!1);for(const h of y)h.dispose();await t.yield?.();const R=z.slab({poses:v,poseRate:.9,grow:!0,pingpong:!0,dry:.7,load:64,strokeW:2.2}),T=i(new u.Mesh(A,R)),C=xt();await t.yield?.();const K=b.seats.slice().sort((h,N)=>h.key-N.key),I=Math.min(K.length,Math.round((w.leaves??900)*x)),ue=z.slab({tip:!0,poses:2,poseRate:.9,dry:.35,load:9,strokeW:3,lineW:.07}),j=i(new u.InstancedMesh(C,ue,I)),q=new Float32Array(I*4),ne=new u.Matrix4,Ee=new u.Quaternion,Se=new u.Vector3,Ue=new u.Vector3,Ze=new u.Vector3(0,1,0);for(let h=0;h<I;h++){const N=K[h];Ee.setFromAxisAngle(Ze,Math.PI/2-N.yaw),Se.set(N.x,N.y,N.z),Ue.setScalar(N.s),j.setMatrixAt(h,ne.compose(Se,Ee,Ue)),q[h*4]=N.key*97,q[h*4+1]=.5+N.key*7919%1,q[h*4+2]=0,q[h*4+3]=0,h%300===299&&await t.yield?.()}C.setAttribute("aI",new u.InstancedBufferAttribute(q,4)),j.instanceMatrix.needsUpdate=!0,await t.yield?.();const et=b.hangs.filter(h=>h.r>46&&h.r<m-6).sort((h,N)=>h.key-N.key),re=[],tt=Math.round((w.bunches??160)*x);for(const h of et){if(re.length>=tt)break;let N=!0;for(const B of re){const ae=B.x-h.x,Z=B.z-h.z;if(ae*ae+Z*Z<361){N=!1;break}}N&&re.push(h)}await t.yield?.();const Pe=[8,7,6,5,5,4,3,2],ot=41,je=.84,Fe=bt(),Ae=re.length*ot,at=z.slab({dot:!0,swing:!0,dry:0,dotR:.27}),Ne=i(new u.InstancedMesh(Fe,at,Ae)),he=new Float32Array(Ae*4),fe=new Float32Array(Ae*4),He=new u.Vector3,Oe=new u.Vector3;let H=0;const Re=[];for(let h=0;h<re.length;h++){const N=re[h],B=2.5+N.drop*N.drop*Math.min(22,N.y-12-61-2.5),ae=Math.atan2(N.z,N.x)+Math.PI/2+(N.jit-.5)*1.5,Z=Math.cos(ae),pe=Math.sin(ae),we=N.y-B;Re.push({x:N.x,z:N.z,top:we,bottom:we-12});const me=(U,ee,te,ye,xe)=>{He.set(Z*te,0,pe*te),Oe.set(-pe,0,Z),ne.makeBasis(He,Se.set(0,ye,0),Oe).setPosition(N.x+Z*U,ee,N.z+pe*U),Ne.setMatrixAt(H,ne),he[H*4]=0,he[H*4+1]=1,he[H*4+2]=xe,he[H*4+3]=0,fe[H*4]=N.x,fe[H*4+1]=N.y,fe[H*4+2]=N.z,fe[H*4+3]=N.ph*40,H++};me(0,N.y-B/2-.3,.3,B/2+.9,2);let O=0;for(let U=0;U<Pe.length;U++)for(let ee=0;ee<Pe[U];ee++,O++){const te=(ee-(Pe[U]-1)/2)*1.5+((O*37+h*11)%7-3)*.035;me(te,we-.8-U*1.42-(O*13+h)%5*.03,je,je,(O+h)%3===0?1:0)}h%24===23&&await t.yield?.()}Fe.setAttribute("aI",new u.InstancedBufferAttribute(he,4)),Fe.setAttribute("aPivot",new u.InstancedBufferAttribute(fe,4)),Ne.instanceMatrix.needsUpdate=!0,await t.yield?.();let Te=null,We=null,ie=null,Ye=null;if(w.sea!==!1){const h=new u.CircleGeometry(w.seaRadius??200,128);h.rotateX(-Math.PI/2),Te=i(new u.Mesh(h,z.sea({outer:w.seaRadius??200})),g),Te.renderOrder=2;const N=new u.CylinderGeometry(w.seaRadius??200,w.seaRadius??200,150,64,1,!1);N.translate(0,-75.4,0),Ye=i(new u.Mesh(N,new u.MeshBasicMaterial({color:z.ink.glaze,side:u.BackSide,fog:!1,toneMapped:!1})),g)}(w.kiln??(o||$.kiln))&&(We=z.kilnDome(),g.add(We)),(w.mirror||$.mirror)&&(ie=new u.Group,ie.scale.set(1,-1,.985),s.add(ie),i(new u.Mesh(P,n),ie),i(new u.Mesh(d,S),ie)),await t.yield?.();const V=(h,N,B)=>new u.Vector3(h,N,B),oe=80,ve=2.5,J=Math.PI/180,Ce=V(-Math.sin(140*J),0,Math.cos(140*J)).normalize(),Xe=V(Math.cos(140*J)*oe,ve,Math.sin(140*J)*oe),Ve=[Xe.clone().addScaledVector(Ce,-120),Xe.clone().addScaledVector(Ce,-60)];for(let h=140;h<=270;h+=13)Ve.push(V(Math.cos(h*J)*oe,ve,Math.sin(h*J)*oe));Ve.push(V(60,ve,-oe),V(130,ve,-oe));let Ie=1e9;for(const h of Re)Ie=Math.min(Ie,h.bottom);const $e=w.frontNormal?V(w.frontNormal[0],0,w.frontNormal[1]).normalize():Ce.clone(),Le=w.frontFrom??130,Je=w.frontTo??-420,st={flyThrough:Ve,orbitRadius:oe,arcFrom:140*J,arcTo:270*J,ramTip:V(G(63),4.6,0),eye:V(G(45.2),12.6,Y/2),sternTop:V(G(-43),55.5,0),stemTop:V(G(46.6),49.4,0),sailCenter:V(0,56,0),mastTop:V(0,ze,0),railY:22,canopy:{yMin:96,yMax:105.5,radius:m+12,lowestBunch:Ie},bunches:Re,frontNormal:$e,frontFrom:Le,frontTo:Je,viewpoints:{entry:V(40,122,330),broadside:V(-20,14,150),underRam:V(-80,2.5,6),underSail:V(-30,2.5,-74),under:V(30,2.5,60),far:V(150,60,420)}};let Be=$.front??w.front??4,Ge=o||$.front!=null||w.front!=null;const Q=new u.Vector3,De=new u.Vector3,nt=new u.Matrix3,rt=()=>{g.updateWorldMatrix(!0,!1),Q.copy($e).applyMatrix3(nt.setFromMatrix4(g.matrixWorld)),Q.y=0;const h=Q.length()||1;Q.divideScalar(h),De.setFromMatrixPosition(g.matrixWorld),z.setFront(Q.x,Q.z,Be*h+De.x*Q.x+De.z*Q.z,w.frontWidth??2.5)};let le=66,de=106,ge=V(0,48,0);return $.close===1?le=m+12:$.close===2?(le=30,de=-75,ge=V(0,40,0)):$.close===3?(le=14,de=10,ge=V(-38,14,0)):$.close===4?(le=150,de=150):$.close===5&&(le=40,de=-165,ge=V(0,85,0)),{object:g,radius:le,height:de,center:ge,anchors:st,style:z,ground:!1,groundY:0,parts:{turn:s,hull:a,rig:p,vine:T,leaves:j,discs:Ne,sea:Te,well:Ye,dome:We,mirror:ie},setFront(h){Be=h,Ge=!0},setReversal(h){const N=Math.min(1,Math.max(0,h));Be=Le+(Je-Le)*N,Ge=!0},setProgress(h){const N=w.reverseFrom??.56,B=w.reverseTo??.635;this.setReversal((h-N)/Math.max(B-N,1e-4))},update(h,N,B){s.rotation.y=c*N,o&&z.update(h,N,B),Ge&&rt()},dispose(){o&&z.dispose(),f.dispose()}}}const $=(()=>{try{const t=new URLSearchParams(globalThis.location?.search||""),w=r=>t.get(r)==null?null:Number(t.get(r));return{kiln:t.get("wdcKiln")==="1",mirror:t.get("wdcMirror")==="1",front:w("wdcFront"),close:w("wdcClose")}}catch{return{}}})();export{zt as buildHero,pt as makeStyle,Me as ribbonGeometry,se as slabGeometry,qe as smoothOutline};
