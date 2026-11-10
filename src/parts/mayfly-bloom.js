import*as e from"three";const Qe=["#EFE8A6","#E9A24C","#C4788A","#8A8A3E","#9A5326","#3E1B2C","#F7D56A"],Fe=s=>new e.Color(s);function nt(s=Qe,t="honey"){const a=s.map(Fe);let l=a[0].clone(),r=a[1].clone(),h=a[2].clone(),k=a[3].clone(),v=a[4].clone(),n=a[5].clone();const u=a[6].clone();t==="thunder"?(r=Fe("#B59A8E"),h=Fe("#8E7088"),k=n.clone().lerp(h,.45),v=n.clone().lerp(h,.2)):t==="autumn"&&(r=r.clone().lerp(h,.55),l=l.clone().lerp(a[1],.35),k=v.clone().lerp(a[1],.45));const o=w=>new e.Vector3(Math.min(1,w.r/l.r),Math.min(1,w.g/l.g),Math.min(1,w.b/l.b));return{uniforms:{uTime:{value:0},uProgress:{value:0},uCitron:{value:l},uHoney:{value:r},uRose:{value:h},uAub:{value:n},uFoil:{value:u},uWest:{value:new e.Vector2(-1,0)},uSun:{value:new e.Vector4(.3,.954,0,0)},uBand:{value:new e.Vector4(8,17,27,t==="thunder"?.45:1)},uViewH:{value:900},uWell:{value:new e.Vector4(0,0,0,0)}},tints:{olive:o(k),amber:o(v),aubergine:o(n)},colors:{citron:l,honey:r,rose:h,olive:k,amber:v,aub:n,foil:u},edition:t}}const be=`
uniform float uTime, uProgress, uViewH;
uniform vec3 uCitron, uHoney, uRose, uAub, uFoil;
uniform vec2 uWest;
uniform vec4 uBand, uSun, uWell;
float gHash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float gNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(gHash(i), gHash(i + vec2(1., 0.)), f.x), mix(gHash(i + vec2(0., 1.)), gHash(i + vec2(1., 1.)), f.x), f.y); }
// THE BLANK. d = unit direction from the eye to the fragment. Citron band, honey, rose, the aubergine
// collar (the neck of the vase); below the horizon the water mirrors the wall a tone deeper; streaks of the pour;
// a seed bubble here and there. Every surface in the world is this colour times an overlay.
vec3 glassGround(vec3 d){
  vec2 h = d.xz; if (dot(h, h) < 1e-8) h = vec2(0., 1.);
  float az = atan(h.x, h.y);
  float el = degrees(asin(clamp(d.y, -1., 1.)));
  float west = 0.5 + 0.5 * dot(normalize(h), uWest);
  // the pour: long sideways streaks that slide slowly inside the wall and drag the band edges with them
  vec2 nh = normalize(h);
  float pour = gNoise(nh * 2.6 + vec2(uTime * 0.012, el * 0.14 + 3.)) * 0.65 + gNoise(nh * 6.3 + vec2(el * 0.45, -uTime * 0.02)) * 0.35;
  float e = el + (pour - 0.5) * 3.6;
  // the lamp stands behind one side of the vase: there the bands flare upward (citron, honey and rose each reach
  // higher, a tall flame of light in the wall, never a disc) and the same light lies down the water toward the eye
  float sd = dot(nh, uSun.xy);
  float sk = uSun.z * smoothstep(0.74, 0.992, sd), skw = uSun.z * smoothstep(0.9, 0.999, sd);
  float cTop = uBand.x * uBand.w * (0.72 + 0.56 * west) * (1. + 1.9 * sk);
  float hTop = uBand.y * (1. + 1.7 * sk), aTop = uBand.z * (1. + 1.5 * sk);
  vec3 cit = mix(mix(uCitron, uHoney, 0.42), uCitron, max(smoothstep(0.1, 0.75, west), sk));
  vec3 c = mix(cit, uHoney, smoothstep(cTop - 2.5 - 5. * sk, cTop + 2.0 + 5. * sk, e));
  c = mix(c, uRose, smoothstep(hTop - 3.5 - 6. * sk, hTop + 3.0 + 6. * sk, e));
  c = mix(c, uAub, smoothstep(aTop - 3.0, aTop + 10.0 + 12. * sk, e) * 0.9);   // the collar closes softly: rose deepening to plum, never a hard band
  c = mix(c, min(uCitron * 1.13, vec3(1.)), skw * (1. - smoothstep(1., 15., abs(e))) * 0.9);   // the hot heart of the flare, low in the band
  // (o7) THE LOW SUN of the landscape vases: one round of deeper honey left standing in the citron band where the lamp
  // is, with the pale bitten rim every cut edge has (uSun.w = its elevation in degrees, 0 = none). The far tree lines
  // and everything else are overlays in front of it, so it burns through them as the lamp does through a vase.
  float sunEl = radians(uSun.w), sunOn = step(0.01, uSun.w);
  vec3 sdir = vec3(uSun.x * cos(sunEl), sin(sunEl), uSun.y * cos(sunEl));
  float sang = degrees(acos(clamp(dot(d, sdir), -1., 1.))), srad = 3.1 + (pour - 0.5) * 0.5;
  c = mix(c, min(uCitron * 1.16, vec3(1.)), (1. - smoothstep(srad + 0.5, srad + 0.75, sang)) * sunOn * 0.85);
  c = mix(c, mix(uHoney, uRose, 0.12) * vec3(1.04, 0.86, 0.7), (1. - smoothstep(srad - 0.1, srad + 0.1, sang)) * sunOn);
  // water: all honey, taking the band's light only in the last degrees under the horizon
  // (round 3) the water is the MIRROR of the wall, a tone deeper: the band's light lies on it under the far bank,
  // honey below that, then the rose of the upper wall and, under the eye, the plum of the vase's foot. So the
  // river is a second ground, cooler and darker than the sky, and pads, flowers, foil and insects stand on it.
  float we = -el + (pour - 0.5) * 2.4;
  vec3 w = mix(mix(cit, uHoney, 0.5 * (1. - skw)), uHoney, smoothstep(0.0, 2.6 + 9. * skw, we));
  w = mix(w, uRose, smoothstep(1.6 + 7. * skw, 7.5 + 20. * skw, we));
  w = mix(w, mix(uRose, uAub, 0.62), smoothstep(6.0 + 14. * skw, 24.0 + 22. * skw, we));
  c = mix(w, c, smoothstep(-0.6, 0.6, el));
  c *= 0.965 + 0.07 * pour;
  // seed bubbles in the wall (sky only): a faint pale bead, a few pixels across
  vec2 bc = vec2(az * 57.3, el) / 4.5; vec2 bi = floor(bc), bf = fract(bc) - 0.5;
  float bh = gHash(bi + 7.7);
  float bub = (1. - smoothstep(0.02, 0.05, length(bf - (vec2(gHash(bi), gHash(bi + 3.1)) - 0.5) * 0.6))) * step(0.86, bh) * step(1.0, el);
  c = mix(c, min(c * 1.12, vec3(1.)), bub * 0.6);
  return c;
}
// (p3) THE WELL. Round the route's own point (uWell.xyz) the water's skin (the plane y 0) is bitten through, uWell.w metres
// about that point (the radius is the world's law of progress, 1.2 to 2.4 to 0.24 m: the hole on the skin is 1.2 m in radius
// as the route goes through the skin, widest, 2.35 m, 3 m of route inside each touch, and is not there where the route's point
// is further from the skin than the radius; its rim wanders 0.08 m). The whole law of the passage under the skin is typed here once:
//   wellOn(p) = 1 where the place of the skin under or over p lies inside that round (for the skin itself and what lies on it);
//   wellIn(P) = 1 where the sight line from the eye to the fragment at P crosses the skin inside that round.
// A thing under the skin, seen from above, is drawn only where wellIn is 1; the skin seen from beneath (the hall's ceiling)
// and what floats on it are not drawn where wellOn is 1; a fragment over the skin, seen from beneath, is not drawn where
// wellHid is 1 (the sight line to it crosses the skin outside the round: the opaque skin stands before it). With uWell.w = 0
// all three are 0 everywhere and the world is as it was. cameraPosition is read here for that one question and nothing else.
float wellOnM(vec3 p, float m){
  float rim = (gNoise(p.xz * 2.3) - 0.5) * 0.16;
  return step(length(vec3(p.x, 0., p.z) - uWell.xyz), uWell.w + rim + m) * step(1e-4, uWell.w);
}
float wellOn(vec3 p){ return wellOnM(p, 0.); }
float wellIn(vec3 P){
  float ey = cameraPosition.y, den = ey - P.y;
  if (ey * P.y > 0.) return 0.;                                // eye and fragment on the same side of the skin: no crossing
  return wellOn(mix(cameraPosition, P, abs(den) > 1e-6 ? ey / den : 0.));
}
// (p3 hall) wellHid keeps 0.06 m back from the rim: within that of the round's edge a thing over the skin is left to the
// ceiling, which stands before it by depth and whose own reckoning of the rim is the rim (two reckonings of one edge, the far
// thing's and the ceiling's, differ by a part of a pixel: taken to the very edge, the rule left single pixels of the blank on
// the rim's row; hall/prints/nibble.txt). The picture is the same: what it leaves, the opaque skin hides.
float wellHid(vec3 P){
  if (!(uWell.w > 0. && cameraPosition.y < 0. && P.y > 0.)) return 0.;
  return 1. - wellOnM(mix(cameraPosition, P, cameraPosition.y / (cameraPosition.y - P.y)), 0.06);
}
// (p3) THE HALL'S GROUND, under the skin: the lit wall is overhead. Upward honey at the horizon to citron by 38 degrees
// (sooner toward the lamp: uSun.xy, the bearing the world takes from the eye's place to the lamp's foot, as live's blank
// has it: the one thing under the skin that is lit by where the eye is); downward honey, rose by 12 degrees, then the plum of the foot by 45 (rose with two fifths of
// aubergine: never darker, never black). The pour drags the edges as it does in the blank and adds no tone of its own.
vec3 hallGround(vec3 d){
  vec2 h = d.xz; if (dot(h, h) < 1e-8) h = vec2(0., 1.);
  vec2 nh = normalize(h);
  float el = degrees(asin(clamp(d.y, -1., 1.)));
  float pour = gNoise(nh * 2.6 + vec2(uTime * 0.012, el * 0.14 + 3.)) * 0.65 + gNoise(nh * 6.3 + vec2(el * 0.45, -uTime * 0.02)) * 0.35;
  float e = el + (pour - 0.5) * 3.6;
  float sk = smoothstep(0.5, 0.995, dot(nh, uSun.xy));
  vec3 up = mix(uHoney, uCitron, smoothstep(0., 38. - 16. * sk, e));
  vec3 dn = mix(mix(uHoney, uRose, smoothstep(0., 12., -e)), mix(uRose, uAub, 0.4), smoothstep(12., 45., -e));
  return mix(dn, up, smoothstep(-0.6, 0.6, el));
}
float aaStep(float edge, float x, float fw){ return smoothstep(edge - fw * 0.75, edge + fw * 0.75, x); }
// THE WHEEL: one pale engraved line where coordinate c crosses 0; halfW in units of c, never under 1.5 px.
float wheelLine(float c, float halfW, float fw){ float w = max(halfW, 0.8 * fw); return 1. - smoothstep(w - fw * 0.6, w + fw * 0.6, abs(c)); }
// THE CUT. r = relief coordinate (0 at the bitten edge, 1 at the heart), fw = fwidth(r) (take it in
// main, never in a loop), dist = metres to the eye (scaled by the material's bite scale), skins = how
// many overlays the thing carries (1 far gallery .. 3 nearest), t1..t3 = the multipliers of each
// terrace, wob = a slow noise value 0..1 for the acid's wander. Returns the fragment colour:
// pale rim, then terraces with hard edges, each lower terrace paling in a soft slope under the step.
// The thresholds slide with distance (the bite): one step beyond 120 m, two to 40 m, three inside;
// each new terrace arrives at the heart and the lower one then eats inward from the edge.
vec3 cameoCut(vec3 ground, float r, float fw, float dist, float skins, vec3 t1, vec3 t2, vec3 t3, float wob){
  float bay = max(wob - 0.78, 0.) * 1.6;                       // an undercut that bit too far
  r = r + (wob - 0.5) * 0.07 - bay;
  float w0 = min(max(0.055, 2.0 * fw), 0.3);
  float s = 0.05 + 0.5 * fw;                                  // width of the soft slope under a step
  float e2 = mix(0.40, 0.15, smoothstep(55., 108., dist)) + 1.3 * smoothstep(104., 124., dist) + step(skins, 1.5) * 3.;
  float e3 = mix(0.70, 0.38, smoothstep(10., 34., dist)) + 1.3 * smoothstep(34., 44., dist) + step(skins, 2.5) * 3.;
  e2 = max(e2, w0 + 0.08); e3 = max(e3, e2 + 0.12);
  vec3 rimC = mix(ground, max(ground, uCitron), 0.5);
  vec3 col = mix(ground, rimC, smoothstep(0., w0, r));
  vec3 c1 = ground * mix(t1, vec3(1.), 0.42 * smoothstep(e2 - s * 1.6, e2, r) * step(e2, 1.5));
  col = mix(col, c1, aaStep(w0, r, fw));
  vec3 c2 = ground * mix(t2, vec3(1.), 0.34 * smoothstep(e3 - s * 1.6, e3, r) * step(e3, 1.5));
  col = mix(col, c2, aaStep(e2, r, fw));
  col = mix(col, ground * t3, aaStep(e3, r, fw));
  // a form only a few pixels wide has no room for a rim: it is its flat average skin
  col = mix(col, ground * mix(t1, vec3(1.), 0.22), smoothstep(0.22, 0.45, fw));
  return col;
}
`,_e=`
varying vec3 vWpos; varying vec3 vWn; varying vec3 vCut;
`;function Oe(s,t={}){const a=s.tints,l=t.tints||[a.olive,a.amber,a.aubergine];return t.thinFirst&&(l[0]=new e.Vector3(Math.pow(l[0].x,t.thinFirst),Math.pow(l[0].y,t.thinFirst),Math.pow(l[0].z,t.thinFirst))),new e.ShaderMaterial({side:t.side??e.DoubleSide,uniforms:{...s.uniforms,uT1:{value:l[0]},uT2:{value:l[1]},uT3:{value:l[2]},uCutP:{value:new e.Vector4(t.skins??3,t.biteScale??1,t.veins??0,t.veinHalf??.03)},uWob:{value:t.wobble??.3},...t.uniforms||{}},vertexShader:`
      attribute vec3 cut; ${_e} uniform float uTime, uProgress; ${t.vertexDecl||""}
      void main(){
        vec3 p = position; vec3 n = normal; vCut = cut;
        ${t.vertexMove||""}
        vec4 wp = vec4(p, 1.);
        #ifdef USE_INSTANCING
          wp = instanceMatrix * wp; n = mat3(instanceMatrix) * n;
        #endif
        wp = modelMatrix * wp; vWpos = wp.xyz; vWn = mat3(modelMatrix) * n;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      ${be} ${_e}
      uniform vec3 uT1, uT2, uT3; uniform vec4 uCutP; uniform float uWob; ${t.fragDecl||""}
      void main(){
        vec3 V = vWpos - cameraPosition; float dist = length(V); vec3 d = V / max(dist, 1e-4);
        vec3 n = vWn * inversesqrt(max(dot(vWn, vWn), 1e-8));
        float fc = abs(dot(n, d));
        float rr = 1. - sqrt(max(1. - fc * fc, 0.));
        float r = mix(vCut.x, rr, step(0.5, vCut.z));
        float wy = vCut.y;
        ${t.fragMod||""}
        float fw = fwidth(r);
        float wob = gNoise(vWpos.xy * uWob + vWpos.z * uWob * 0.61);
        vec3 g = ${t.ground||"glassGround"}(d);
        vec3 col = cameoCut(g, r, fw, dist * uCutP.y, uCutP.x, uT1, uT2, uT3, wob);
        // the wheel: engraved pale lines, drawing themselves in as the thing comes inside 40 m
        float y = uCutP.z > 0.5 ? wy * uCutP.z : wy;
        float fy = fwidth(y);
        float c = uCutP.z > 0.5 ? fract(y) - 0.5 : y;
        float nearK = 1. - smoothstep(26., 42., dist * uCutP.y);
        float ln = wheelLine(c, uCutP.w * (uCutP.z > 0.5 ? uCutP.z : 1.) * nearK, fy) * nearK * step(0.12, r) * (1. - smoothstep(0.3, 0.6, fy));
        col = mix(col, mix(g, max(g, uCitron), 0.35), ln * 0.85);
        ${t.fragPost||""}
        gl_FragColor = vec4(col, 1.);
      }`})}function st(s){return new e.ShaderMaterial({side:e.BackSide,depthWrite:!1,depthTest:!1,uniforms:{...s.uniforms},vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`${be} varying vec3 vDir; void main(){ vec3 d = vDir * inversesqrt(max(dot(vDir, vDir), 1e-8)); gl_FragColor = vec4(glassGround(d), 1.); }`})}function rt(s,t={}){return new e.ShaderMaterial({uniforms:{...s.uniforms,uFlow:{value:t.flow||new e.Vector2(0,-.6)}},vertexShader:"varying vec3 vWpos; void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vWpos = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:`
      ${be} varying vec3 vWpos; uniform vec2 uFlow;
      float martele(vec2 p){                                   // 0 at an oval's rim .. 1 at its dished centre
        p.y *= 0.62; vec2 i = floor(p), f = fract(p); float best = 9.;
        for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
          vec2 o = vec2(float(x), float(y)); vec2 c = o + 0.5 + (vec2(gHash(i + o), gHash(i + o + 17.3)) - 0.5) * 0.7 - f;
          best = min(best, dot(c, c));
        }
        return 1. - smoothstep(0.02, 0.36, best);
      }
      void main(){
        vec3 V = vWpos - cameraPosition; float dist = length(V); vec3 d = V / max(dist, 1e-4);
        vec3 g = glassGround(d);
        vec2 p = vWpos.xz - uFlow * uTime;
        float l = log2(clamp(dist / 5., 1., 8.)); float l0 = floor(l), lf = l - l0;
        float s0 = 0.3 * exp2(l0);
        vec2 q = p / s0; float fq = max(fwidth(q.x), fwidth(q.y));
        float m = mix(martele(q), martele(q * 0.5 + 11.), smoothstep(0.2, 0.9, lf));
        m = mix(m, 0.42, smoothstep(0.16, 0.42, fq));
        gl_FragColor = vec4(g * (0.925 + 0.11 * m), 1.);
      }`})}const Ie={bendStart:250,radius:170,angle:2.25,side:1};function ie(s,t=Ie){if(s<=t.bendStart)return{x:0,z:s,tx:0,tz:1};const a=Math.min((s-t.bendStart)/t.radius,t.angle),l=s-t.bendStart-a*t.radius,r=Math.sin(a)*t.side,h=Math.cos(a);return{x:t.side*t.radius*(1-Math.cos(a))+r*l,z:t.bendStart+t.radius*Math.sin(a)+h*l,tx:r,tz:h}}function $e(s,t,a=Ie){let l=Math.min(t,a.bendStart),r=s*s+(t-l)*(t-l);const h=a.side*a.radius,k=e.MathUtils.clamp(Math.atan2(t-a.bendStart,(h-s)*a.side),0,a.angle),v=ie(a.bendStart+k*a.radius,a),n=(s-v.x)**2+(t-v.z)**2;n<r&&(r=n,l=a.bendStart+k*a.radius);const u=ie(a.bendStart+a.angle*a.radius,a),o=Math.max(0,(s-u.x)*u.tx+(t-u.z)*u.tz),y=(s-u.x-u.tx*o)**2+(t-u.z-u.tz*o)**2;return o>0&&y<r&&(l=a.bendStart+a.angle*a.radius+o),l}const it=`
uniform vec4 uCourse;                                         // bendStart, radius, angle, side
vec4 coursePT(float s){                                       // xy = centre (x,z), zw = unit tangent (x,z)
  if (s <= uCourse.x) return vec4(0., s, 0., 1.);
  float a = min((s - uCourse.x) / max(uCourse.y, 1.), uCourse.z), rest = s - uCourse.x - a * uCourse.y;
  vec2 t = vec2(sin(a) * uCourse.w, cos(a));
  return vec4(vec2(uCourse.w * uCourse.y * (1. - cos(a)), uCourse.x + uCourse.y * sin(a)) + t * rest, t);
}
`,Ke=`
vec3 wingShape(vec2 q){
  float rho = length(q);
  float th = rho > 1e-4 ? atan(q.x, q.y) : 0.;
  float t = (0.20 - th) / 1.25;
  float tc = clamp(t, 0., 1.);
  float rmax = 1. - 0.44 * tc * sqrt(tc) - 0.20 * smoothstep(0.66, 0.74, tc) + 0.10 * smoothstep(0.74, 0.92, tc);
  float a = min(t, 1. - t) * 1.25 * max(rho, 0.12);
  float b = rmax - rho;
  return vec3(min(a, b), t, rho);
}
// the wing's glass: clear membrane, a thicker amber costa, radiating wheel-cut veins (never a net),
// torn flecks of gold foil that turn from dull honey to bright gold with the beat (turn 0..1).
// px = wing length in pixels (marks finer than ~3 px give way to their flat average).
vec3 wingGlass(vec3 g, vec3 w, vec2 q, float fwq, float turn, float seed, float px, vec3 amberT){
  float fine = smoothstep(9., 26., px);
  // the membrane is a thin amber skin, a step thicker toward the root (a wandering hard edge), thickest along the costa
  vec3 memb = g * mix(vec3(1.), amberT, 0.58);
  float rootE = 0.42 + 0.16 * gNoise(vec2(w.y * 7. + seed * 13., 2.7));
  memb = mix(g * mix(vec3(1.), amberT, 0.8), memb, aaStep(rootE, w.z, fwq * 1.5));
  vec3 col = mix(memb, g * mix(vec3(1.), amberT, 0.95), aaStep(0.9, 1. - w.y, 1.25 * fwq / max(w.z, 0.1)) * fine);
  col = mix(mix(g, max(g, uCitron), 0.5), col, aaStep(0.045, w.x, fwq));
  float ft = w.y * 8.; float fv = 8. * 1.25 * fwq / max(w.z, 0.1);
  float vein = wheelLine(fract(ft) - 0.5, 0.05 * (1. - 0.6 * w.z), fv) * smoothstep(0.1, 0.22, w.z) * (1. - smoothstep(0.35, 0.7, fv));
  col = mix(col, mix(g, max(g, uCitron), 0.6), vein * 0.9 * fine);
  float n = gNoise(q * 6.5 + seed * 37.) * 0.6 + gNoise(q * 15. + seed * 91.) * 0.4;
  float fleck = aaStep(0.56, n, fwq * 9.) * smoothstep(0.03, 0.09, w.x) * (1. - vein * 0.7);
  vec3 foil = mix(uHoney, uFoil, 0.25 + 0.75 * turn);
  col = mix(col, foil, fleck * fine);
  // far: one fleck of foil that turns
  return mix(mix(mix(uHoney, uFoil, 0.5 + 0.5 * turn), uCitron, 0.22), col, fine);
}
`;function je(s,t,a){return new e.ShaderMaterial({side:e.DoubleSide,uniforms:{...s.uniforms,uCourse:t,...a,uAmber:{value:s.tints.amber}},vertexShader:`
      attribute vec4 aSeed;
      uniform float uTime, uProgress, uViewH; uniform vec3 uCamL;
      uniform vec4 uWin;      // x = camera's course s, y = half window length, z = flow (m travelled by the band), w = front (s relative to camera)
      uniform vec4 uBandP;    // x = half width, y = depth, z = base height above water, w = river half width (dance)
      uniform vec4 uBraid;    // x,y = braid wavelengths (1/m), z = braid amplitude (m), w = wing length (m)
      uniform vec4 uFarP;     // x = 1 for the far set, y = its reach (m)
      uniform vec4 uLife;     // x = emergence line s, y = exhibit (1 = all hatched), z = fall, w = dance amount
      uniform vec4 uSight;    // xyz = a far thing the swarm leaves in view (the portal), w = how much (0..1)
      ${it}
      varying vec2 vQ; varying float vPart; varying vec3 vWpos; varying vec4 vInfo; // vInfo: turn, seed, px, gather
      void main(){
        float L = uWin.y;
        float flow = uWin.z * (0.9 + 0.2 * aSeed.w), sRel, keep;
        if (uFarP.x < 0.5) {
          sRel = mod(aSeed.x * 2. * L + flow - uWin.x + L, 2. * L) - L;
          keep = step(smoothstep(0.45 * L, L, abs(sRel)) * 0.9, fract(aSeed.w * 17.3));   // the window thins toward its ends
        } else {
          float sd = fract(aSeed.y * 7.31) < 0.62 ? 1. : -1.;
          float r = fract(aSeed.x + sd * (flow - uWin.x) / 800.);
          sRel = sd * (0.45 * L + uFarP.y * r * r * sqrt(sqrt(r)));
          keep = smoothstep(0., 0.012, r) * (1. - smoothstep(0.96, 1., r));
        }
        float s = uWin.x + sRel;
        vec4 ct = coursePT(s);
        vec2 tan2 = ct.zw, nor2 = vec2(ct.w, -ct.z);
        float gather = (1. - smoothstep(uWin.w - 30., uWin.w, sRel));
        float ph = aSeed.w * 6.2831;
        // hatching: each animal has its moment, spreading from the emergence line
        float hatchU = abs(s - uLife.x) / 900. + aSeed.z * 0.10 + fract(aSeed.w * 7.3) * 0.06;
        float hatch = max(uLife.y, smoothstep(hatchU, hatchU + 0.035, uProgress + 0.09));
        // while its moment lasts an animal keeps rising from its dimple, again and again (the bloom never stands still)
        float popping = step(0.001, hatch) * step(hatch, 0.999);
        float pop = fract(uTime * 0.21 + aSeed.w * 5.);
        float hatchK = mix(1., smoothstep(0., 0.12, pop) * (1. - smoothstep(0.9, 1., pop)), popping);
        hatch = mix(hatch, pop, popping);
        // dance: columns over the whole river, rising fast and sinking slowly
        float lane = aSeed.y * 2. - 1.;
        float col = floor(aSeed.y * 23.) / 23. * 2. - 1. + 0.04;
        float lc = mix(lane, col, 0.7);
        float latD = lc * (0.3 + 0.7 * abs(lc)) * uBandP.w * 0.8 + sin(uTime * 0.6 + ph) * 0.7;
        float saw = fract(uTime * 0.22 + aSeed.w); float rise = saw < 0.3 ? saw / 0.3 : 1. - (saw - 0.3) / 0.7;
        float yD = 0.6 + aSeed.z * 2.2 + rise * 3.0;
        // band: lanes 40 m wide and 4 m deep, braided, denser low and toward the middle
        float braid = sin(s * uBraid.x + 1.3) * uBraid.z + sin(s * uBraid.y) * uBraid.z * 0.5;
        float latB = lane * (0.24 + 0.76 * lane * lane) * uBandP.x + braid + sin(uTime * 0.9 + ph * 3.) * 0.35;
        float yB = uBandP.z + uBandP.y * aSeed.z * (0.45 + 0.55 * aSeed.z) + sin(uTime * 1.3 + ph * 5.) * 0.18;
        float lat = mix(latD, latB, gather), y = mix(yD, yB, gather) * hatch;
        // far off the swarm lies low on the water (a line of foil drawn along the river), so no fleck ever stands
        // in front of a tree as a speck: only the animals round the eye fill the air
        vec2 cxz = ct.xy + nor2 * lat;
        float lowK = smoothstep(5., 15., length(cxz - uCamL.xz));
        y = mix(y, min(y, 0.12 + 0.1 * y), lowK);
        cxz = ct.xy + nor2 * lat * mix(1., mix(0.17, 0.55, gather), lowK);   // and gathers toward mid-river, clear of the bars
        keep *= mix(1., step(fract(aSeed.w * 41.7), mix(0.25, 1., gather)), lowK);   // (round 3) before the turn the far stream is a thread, not a field
        vec3 c = vec3(cxz.x, y, cxz.y);
        // attitude: nose upstream, pitched up (steeply while a dancer rises)
        float yaw = (fract(aSeed.w * 13.7) - 0.5) * mix(2.2, 0.35, gather) + sin(uTime * 0.7 + ph) * 0.15;
        vec2 f2 = tan2 * cos(yaw) + nor2 * sin(yaw);
        float pitch = mix(0.35 + 0.9 * step(saw, 0.3), 0.22, gather);
        vec3 fw = vec3(f2.x * cos(pitch), sin(pitch), f2.y * cos(pitch));
        vec3 rt = vec3(f2.y, 0., -f2.x);
        vec3 up = cross(fw, rt);
        float beat = uTime * (11. + 5. * aSeed.z) + ph * 9.;
        float sb = sin(beat);
        float ang = 0.85 + 0.6 * sb;
        // never under ~2 px: far animals are enlarged into single flecks
        vec3 toC = c - uCamL; float dist = max(length(toC), 0.05);
        float W = uBraid.w * 1.35 * (0.85 + 0.3 * fract(aSeed.w * 3.1));
        float px = W * uViewH * 0.5 * projectionMatrix[1][1] / dist;
        // the swarm parts along the line of sight to the portal: a cone that is nothing at the eye and the opening's width there
        vec3 sg = uSight.xyz - uCamL; float st = clamp(dot(toC, sg) / max(dot(sg, sg), 1e-3), 0., 1.);
        float sr = st * 13.5 + 0.02, sightK = mix(1., smoothstep(sr * 0.7, sr, length(toC - sg * st)), uSight.w);
        // one animal in seven is held large through the middle distance (a wing pair of 1 to 4 percent of the
        // frame), most of all in the band, so the swarm is wings in the air and not dust: size, not count
        float big = step(0.94, fract(aSeed.w * 29.7)) * (1. - uFarP.x);
        float pmin = mix(uFarP.x < 0.5 ? 3.0 : 3.6, 4. + 5. * gather * fract(aSeed.w * 71.3), big);
        float k = max(1. + 0.8 * gather * smoothstep(1.5, 5., dist), pmin / max(px, 1e-3)) * step(0.02, hatch) * keep * hatchK * sightK;
        vec3 p;
        if (position.z < 1.5) {
          float sd = position.z;
          vec3 wdir = rt * sd * cos(ang) + up * sin(ang);
          p = c + (fw * position.x + wdir * position.y) * W * k;
        } else {
          vec3 side = cross(fw, toC / dist); side = side * inversesqrt(max(dot(side, side), 1e-6));
          p = c + (fw * position.x + side * position.y) * (W / 1.35) * smoothstep(7., 15., px) * step(0.02, hatch) * keep * hatchK * sightK;
        }
        vQ = position.xy; vPart = position.z; vec4 wp = modelMatrix * vec4(p, 1.); vWpos = wp.xyz;
        vInfo = vec4(0.5 + 0.5 * sin(beat + 0.9), aSeed.w, px * k, gather);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      ${be} ${Ke}
      uniform vec3 uAmber;
      varying vec2 vQ; varying float vPart; varying vec3 vWpos; varying vec4 vInfo;
      void main(){
        vec3 V = vWpos - cameraPosition; float dist = length(V); vec3 d = V / max(dist, 1e-4);
        vec3 g = glassGround(d);
        float fwq = max(fwidth(vQ.x), fwidth(vQ.y));
        vec3 col;
        if (vPart < 1.5) {
          vec3 w = wingShape(vQ);
          if (w.x < 0.) discard;
          col = wingGlass(g, w, vQ, fwq, vInfo.x, vInfo.y, vInfo.z, uAmber);
        } else {
          // body: head, thorax, tapering abdomen in three steps of amber; two long tails as wheel lines
          float x = vQ.x, y = vQ.y;
          float hw = mix(0.035, 0.105, smoothstep(-0.62, 0.02, x)) * (1. - 0.45 * smoothstep(0.12, 0.2, x) + 0.3 * smoothstep(0.2, 0.27, x)) * step(-0.62, x) * (1. - smoothstep(0.3, 0.34, x));
          float r = 1. - abs(y) / max(hw, 1e-3);
          float tl = clamp((-0.6 - x) / 1.65, 0., 1.);
          float tail = wheelLine(abs(y) - mix(0.02, 0.2, tl), 0.014 * (1. - 0.7 * tl), fwq) * step(x, -0.58) * step(-2.25, x);
          if (r < 0. && tail < 0.3) discard;
          vec3 t1 = pow(uAmber, vec3(0.42)), t2 = pow(uAmber, vec3(0.72));
          col = r >= 0. ? cameoCut(g, r, fwidth(r), dist * 28., 3., t1, t2, uAmber, 0.5) : g * t1;
          col = mix(g * t1, col, smoothstep(10., 24., vInfo.z));
        }
        if (wellHid(vWpos) > 0.5) discard;                     // (p3) from beneath the skin: only through the well
        gl_FragColor = vec4(col, 1.);
      }`})}function Ye(s,t,a=!1){const l=new e.InstancedBufferGeometry,r=[.15,-.1],h=[.5,1.22],k=[-1.05,.45],v=[];for(const w of[-1,1])for(const M of w<0?[r,h,k]:[r,k,h])v.push(M[0],M[1],w);const n=.36,u=-2.3,o=.26;a?v.length=9:v.push(n,-o,2,n,o,2,u,o,2,n,-o,2,u,o,2,u,-o,2),l.setAttribute("position",new e.Float32BufferAttribute(v,3));const y=new Float32Array(s*4);for(let w=0;w<s*4;w++)y[w]=t();return l.setAttribute("aSeed",new e.InstancedBufferAttribute(y,4)),l.instanceCount=s,l.boundingSphere=new e.Sphere(new e.Vector3,1e5),l}function lt(){const s=[],t=[],a=[],l=[],r=[],h=new e.Vector3,k=new e.Vector3,v=new e.Vector3,n=new e.Vector3,u=(i,S,b,A,V=1)=>{const H=s.length/3,C=i.length;for(let g=0;g<C;g++){k.subVectors(i[Math.min(g+1,C-1)],i[Math.max(g-1,0)]).normalize(),v.set(0,1,0).addScaledVector(k,-k.y).normalize(),n.crossVectors(k,v);for(let Q=0;Q<b;Q++){const ae=Q/b*Math.PI*2,F=Math.cos(ae),oe=Math.sin(ae);h.copy(i[g]).addScaledVector(v,F*S[g]*V).addScaledVector(n,oe*S[g]),s.push(h.x,h.y,h.z),t.push(v.x*F+n.x*oe,v.y*F+n.y*oe,v.z*F+n.z*oe),a.push(0,A[g],1),l.push(0,0,0,0)}if(g<C-1)for(let Q=0;Q<b;Q++){const ae=H+g*b+Q,F=H+g*b+(Q+1)%b;r.push(ae,F,ae+b,F,F+b,ae+b)}}},o=(i,S,b)=>new e.Vector3(i,S,b),y=[],w=[],M=[];[[.5,0,.012],[.47,0,.05],[.42,.005,.075],[.37,0,.066],[.33,0,.05],[.29,.02,.085],[.21,.045,.118],[.1,.05,.128],[0,.03,.112],[-.08,.01,.086]].forEach((i,S)=>{y.push(o(i[0],i[1],0)),w.push(i[2]),M.push(-2+S*.2)});for(let i=1;i<=10;i++){const S=i/10,b=-.08-.74*S,A=.01+.1*S*S,V=(.084-.05*S)*(i%1===0,1);y.push(o(b+.03,A,0)),w.push(V*.9),M.push(i-.42),y.push(o(b,A,0)),w.push(V),M.push(i)}y.push(o(-.86,.125,0)),w.push(.012),M.push(10.5);for(let i=0;i<w.length;i++)w[i]*=1.45;u(y,w,8,M,1);for(const i of[-1,1]){const S=[],b=[],A=[];for(let V=0;V<=8;V++){const H=V/8;S.push(o(-.84-1.75*H,.12+.22*Math.sin(H*2.4)-.1*H*H,i*(.02+.34*H*(.6+.4*H)))),b.push(.02*(1-.72*H)),A.push(20.25)}u(S,b,4,A)}for(const i of[-1,1])u([o(.26,-.04,i*.07),o(.5,-.1,i*.16),o(.86,0,i*.2),o(1.22,.1,i*.17)],[.02,.016,.012,.006],3,[20.25,20.25,20.25,20.25]),u([o(.14,-.06,i*.08),o(.1,-.2,i*.2),o(-.1,-.3,i*.24),o(-.3,-.33,i*.22)],[.018,.014,.01,.005],3,[20.25,20.25,20.25,20.25]),u([o(.03,-.06,i*.08),o(-.06,-.19,i*.17),o(-.3,-.25,i*.2),o(-.52,-.25,i*.17)],[.018,.014,.01,.005],3,[20.25,20.25,20.25,20.25]);const U=[[.15,-.1],[.5,1.22],[-1.05,.45]];for(const i of[-1,1])for(const[S,b]of[[.14,1.45],[-.02,.6]]){const A=s.length/3;for(const V of U)s.push(S,.1,i*.05),t.push(0,1,0),a.push(0,0,0),l.push(V[0],V[1],i,b*(b<1?-1:1));r.push(A,A+1,A+2)}const P=new e.BufferGeometry;return P.setAttribute("position",new e.Float32BufferAttribute(s,3)),P.setAttribute("normal",new e.Float32BufferAttribute(t,3)),P.setAttribute("cut",new e.Float32BufferAttribute(a,3)),P.setAttribute("aWing",new e.Float32BufferAttribute(l,4)),P.setIndex(r),P}function ct(s,t=.05){return new e.ShaderMaterial({side:e.DoubleSide,uniforms:{...s.uniforms,uAmber:{value:s.tints.amber},uWingLen:{value:t}},vertexShader:`
      attribute vec3 cut; attribute vec4 aWing; attribute vec2 aN;
      uniform float uTime, uViewH, uWingLen;
      varying vec3 vWpos; varying vec3 vWn; varying vec3 vCut; varying vec2 vQ; varying vec4 vInfo;
      void main(){
        vec3 p = position, n = normal; float isW = abs(aWing.z);
        float beat = uTime * (10. + 4. * aN.y) + aN.x * 6.2831 - step(aWing.w, 0.) * 0.7;
        if (isW > 0.5) {
          float ang = 0.82 + 0.62 * sin(beat);
          vec3 o = vec3(0., sin(ang), aWing.z * cos(ang));
          p += (vec3(1., 0., 0.) * aWing.x + o * aWing.y) * abs(aWing.w);
          n = cross(vec3(1., 0., 0.), o);
        }
        vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.);
        vWpos = wp.xyz; vWn = mat3(modelMatrix) * mat3(instanceMatrix) * n; vCut = cut; vQ = aWing.xy;
        float dist = max(length(wp.xyz - cameraPosition), 0.05);
        vInfo = vec4(0.5 + 0.5 * sin(beat + 0.9), aN.y + step(aWing.w, 0.) * 0.37, uWingLen * abs(aWing.w) * uViewH * 0.5 * projectionMatrix[1][1] / dist, isW);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      ${be} ${Ke}
      uniform vec3 uAmber;
      varying vec3 vWpos; varying vec3 vWn; varying vec3 vCut; varying vec2 vQ; varying vec4 vInfo;
      void main(){
        vec3 V = vWpos - cameraPosition; float dist = length(V); vec3 d = V / max(dist, 1e-4);
        vec3 g = glassGround(d); vec3 col;
        if (vInfo.w > 0.5) {
          vec3 w = wingShape(vQ);
          if (w.x < 0.) discard;
          col = wingGlass(g, w, vQ, max(fwidth(vQ.x), fwidth(vQ.y)), vInfo.x, vInfo.y, vInfo.z, uAmber);
        } else {
          vec3 n = vWn * inversesqrt(max(dot(vWn, vWn), 1e-8));
          float fc = abs(dot(n, d)); float r = 1. - sqrt(max(1. - fc * fc, 0.));
          vec3 t1 = pow(uAmber, vec3(0.42)), t2 = pow(uAmber, vec3(0.72));
          float wob = gNoise(vWpos.xy * 60. + vWpos.z * 37.);
          col = cameoCut(g, r, fwidth(r), dist * 28., 3., t1, t2, uAmber, 0.35 + 0.3 * wob);
          float fy = fwidth(vCut.y);
          float ln = wheelLine(fract(vCut.y) - 0.5, 0.07, fy) * step(0.2, r) * (1. - smoothstep(0.3, 0.6, fy)) * (1. - smoothstep(30., 44., dist * 28.));
          col = mix(col, mix(g, max(g, uCitron), 0.4), ln * 0.8);
        }
        if (wellHid(vWpos) > 0.5) discard;                     // (p3) from beneath the skin: only through the well
        gl_FragColor = vec4(col, 1.);
      }`})}function ht(){const s=[],t=[],a=[],l=[],r=(n,u,o,y,w,M=8)=>{for(let j=0;j<M;j++){const U=j/M*Math.PI*2,P=Math.cos(U),i=Math.sin(U);s.push(n,u+P*o,i*y),t.push(0,P,i),a.push(0,w,1)}};[[.0345,0,.001,.001],[.031,0,.0042,.0074],[.027,0,.005,.0088],[.0235,0,.0036,.0052],[.021,5e-4,.0058,.0064],[.014,.001,.0078,.0082],[.004,.001,.0072,.0074],[-.003,5e-4,.0048,.0046]].forEach((n,u)=>r(n[0],n[1],n[2],n[3],20.25));for(let n=1;n<=10;n++){const u=n/10,o=.0037-.0013*u+(n>=9?8e-4:0);r(-.003-.046*u+.0016,0,o*.82,o*.82,n-.42),r(-.003-.046*u,0,o,o,n)}r(-.0515,0,3e-4,3e-4,10.2);const k=s.length/3/8;for(let n=0;n<k-1;n++)for(let u=0;u<8;u++){const o=n*8+u,y=n*8+(u+1)%8;l.push(o,y,o+8,y,y+8,o+8)}for(const n of[-1,1])for(const[u,o,y,w]of[[.012,.16,.066,.0125],[.004,-.2,.062,.0155]]){const M=s.length/3,j=7;for(let U=0;U<=j;U++){const P=U/j,i=w*(.28+.72*Math.sin(Math.min(1,P*1.5)*Math.PI*.5))*Math.sqrt(Math.max(0,1-Math.pow(P,5))),S=u+Math.sin(o)*y*P-.0015*P,b=n*(.004+Math.cos(o)*y*P),A=.0052+.004*P,V=i*.42,H=i*.58;s.push(S+V,A,b,S,A,b,S-H,A,b),t.push(0,1,0,0,1,0,0,1,0);const C=P>.72?.66:.33;if(a.push(0,20,0,C,22,0,0,24,0),U<j){const g=M+U*3;l.push(g,g+1,g+3,g+1,g+4,g+3,g+1,g+2,g+4,g+2,g+5,g+4)}}}const v=new e.BufferGeometry;return v.setAttribute("position",new e.Float32BufferAttribute(s,3)),v.setAttribute("normal",new e.Float32BufferAttribute(t,3)),v.setAttribute("cut",new e.Float32BufferAttribute(a,3)),v.setIndex(l),v}const Je={skins:3,biteScale:22,veins:1,veinHalf:.085,wobble:55,vertexMove:"if (cut.z < 0.5) { float fl = sin(uTime * 34. + p.x * 160.) * 0.16; p.y += abs(p.z) * fl; }",fragMod:`
    float dE = 9.;
    float dfr = fwidth(rr) + 1e-4, dRp = max(1.6, 0.0035 * uViewH / (max(dist, 0.1) * 1.2)), dBody = step(0.5, vCut.z);
    dE = mix(9., rr / (dfr * dRp) + 9. * smoothstep(0.25, 0.5, dfr * dRp), dBody); r = mix(r, 0.92, dBody);
    float fdE = fwidth(dE);`,fragPost:"col = mix(mix(g, max(g, uCitron), 0.5), col, aaStep(1., dE, fdE)); if (wellHid(vWpos) > 0.5) discard;"};function ut(s){const t=s.tints,a=(r,h)=>new e.Vector3(Math.pow(r.x,h),Math.pow(r.y,h),Math.pow(r.z,h)),l=(r,h)=>new e.Vector3(r.x*h.x,r.y*h.y,r.z*h.z);return{...Je,tints:[l(a(t.olive,.45),a(t.amber,.28)),l(a(t.amber,.8),a(t.aubergine,.6)),t.aubergine]}}const dt=Je;function ft(s,t){return new e.ShaderMaterial({side:e.DoubleSide,uniforms:{...s.uniforms,uCamL:t.uCamL,uLeaf:{value:new e.Vector4(0,40,11,.034)}},vertexShader:`
      attribute vec4 aSeed; uniform float uTime, uViewH; uniform vec3 uCamL; uniform vec4 uLeaf;
      varying vec2 vQ; varying vec3 vWpos; varying vec3 vInfo;
      void main(){
        vec2 xz = uCamL.xz + mod(aSeed.xy * uLeaf.y - uCamL.xz, uLeaf.y) - 0.5 * uLeaf.y;
        float f = fract(aSeed.z - uTime * (0.035 + 0.02 * aSeed.w));
        float air = smoothstep(0.3, 0.34, f);
        float y = 0.03 + max(f - 0.3, 0.) / 0.7 * uLeaf.z;
        float ph = aSeed.w * 6.2831;
        xz += vec2(sin(uTime * 0.8 + ph), cos(uTime * 0.6 + ph * 1.7)) * 0.5 * air + vec2(0., -0.5) * uTime * (1. - air) * 0.0;
        float a = (uTime * (1.2 + aSeed.w) + ph) * air;
        float yaw = ph * 3. + uTime * 0.3 * air;
        vec3 e1 = vec3(cos(yaw), 0., sin(yaw));
        vec3 e2 = vec3(-sin(yaw) * cos(a), sin(a), cos(yaw) * cos(a));
        vec3 c = vec3(xz.x, y, xz.y);
        float dist = max(length(c - uCamL), 0.05);
        float size = uLeaf.w * (0.6 + 0.9 * aSeed.z);
        float px = size * uViewH * 0.5 * projectionMatrix[1][1] / dist;
        float k = max(1., 2.6 / max(px, 1e-3)) * step(aSeed.x * 0.999, uLeaf.x) * smoothstep(0., 0.03, f) ;
        vec3 p = c + (e1 * position.x + e2 * position.y) * size * k;
        vec4 wp = modelMatrix * vec4(p, 1.); vWpos = wp.xyz; vQ = position.xy;
        vInfo = vec3(mix(0.75, abs(cos(a)), air), aSeed.w, px * k);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      ${be}
      varying vec2 vQ; varying vec3 vWpos; varying vec3 vInfo;
      void main(){
        float fine = smoothstep(5., 14., vInfo.z);
        float n = gNoise(vQ * 2.6 + vInfo.y * 53.) * 0.7 + gNoise(vQ * 7. + vInfo.y * 11.) * 0.3;
        float shape = 1. - dot(vQ, vQ) * 1.05 - (0.62 - n) * 1.7 * fine;      // a torn edge near; a plain fleck far
        if (shape < 0.) discard;
        vec3 foil = mix(uHoney, uFoil, 0.2 + 0.8 * vInfo.x);
        if (wellHid(vWpos) > 0.5) discard;                     // (p3) from beneath the skin: only through the well
        gl_FragColor = vec4(foil, 1.);
      }`})}async function mt(s,t={}){const a=s.rng.fork?s.rng.fork("mayfly-bloom-hero"):s.rng,l=e.MathUtils.clamp(t.detail??s.quality?.detail??1,.6,1),r={...Ie,...t.course||{}},h=t.glass||nt(t.palette||Qe,t.edition||"honey"),k=h.uniforms,v=t.pathLength??520,n=new e.Group;n.name="river-of-wings";let u=!1,o=null;try{const c=new URLSearchParams(globalThis.location?.search||"");u=c.get("part")==="mayfly-bloom",u&&c.get("hv")&&(o=c.get("hv").split(",").map(Number))}catch{}const y=(t.bandWidth??40)*.5*a.range(.9,1.12),w=a.range(3.6,4.6),M={uCamL:{value:new e.Vector3},uWin:{value:new e.Vector4(0,t.window??60,0,1e4)},uBandP:{value:new e.Vector4(y,w,.5,(t.riverWidth??90)*.46)},uBraid:{value:new e.Vector4(a.range(.018,.03),a.range(.05,.08),a.range(1.5,3.2),t.wingLength??.05)},uLife:{value:new e.Vector4(t.emergeAt??55,1,0,0)},uFarP:{value:new e.Vector4(0,760,0,0)},uSight:{value:new e.Vector4(0,0,0,0)}},j={value:new e.Vector4(r.bendStart,r.radius,r.angle,r.side)},U=Math.round((t.count??26e3)*l),P=je(h,j,M),i=new e.Mesh(Ye(U,a.fork?a.fork("swarm"):a),P);i.frustumCulled=!1,i.name="swarm",n.add(i),await s.yield();const S=Math.round((t.farCount??16e3)*l),b=je(h,j,{...M,uFarP:{value:new e.Vector4(1,760,0,0)}}),A=new e.Mesh(Ye(S,a.fork?a.fork("far"):a,!0),b);A.frustumCulled=!1,A.name="far-band",n.add(A),await s.yield();const V=32,H=M.uBraid.value.w,C=a.fork?a.fork("neighbours"):a,g=lt(),Q=new Float32Array(V*2),ae=[];for(let c=0;c<V;c++){Q[c*2]=C(),Q[c*2+1]=C();const d=c<10;ae.push({x:C.range(.18,d?.75:1.9)*(c%2?1:-1),y:C.range(-.42,d?.3:.75),z:C.range(0,6),v:C.range(.12,.45)*(C()<.3?-1:1),ph:C.range(0,6.28),sc:C.range(.9,1.18),yaw:C.range(-.25,.25)})}g.setAttribute("aN",new e.InstancedBufferAttribute(Q,2));const F=new e.InstancedMesh(g,ct(h,H),V);F.instanceMatrix.setUsage(e.DynamicDrawUsage),F.frustumCulled=!1,F.name="neighbours",n.add(F),await s.yield();const oe=t.dragonflies??6,ue=a.fork?a.fork("dragonflies"):a,Ee=[],fe=new e.InstancedMesh(ht(),Oe(h,ut(h)),oe);for(let c=0;c<oe;c++)Ee.push({z:ue.range(0,120),v:ue.range(9,13),lat:ue.range(-.8,.8),h:ue.range(.25,.8),wl:ue.range(.05,.11),ph:ue.range(0,6.28),sc:ue.range(1,1.35)});fe.instanceMatrix.setUsage(e.DynamicDrawUsage),fe.frustumCulled=!1,fe.name="hunters",n.add(fe);const qe=Math.round((t.leafCount??1500)*l),Me=new e.InstancedBufferGeometry;Me.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0],3));const Pe=new Float32Array(qe*4),Xe=a.fork?a.fork("leaf"):a;for(let c=0;c<Pe.length;c++)Pe[c]=Xe();Me.setAttribute("aSeed",new e.InstancedBufferAttribute(Pe,4)),Me.instanceCount=qe,Me.boundingSphere=new e.Sphere(new e.Vector3,1e5);const Ne=ft(h,M),Ae=new e.Mesh(Me,Ne);Ae.frustumCulled=!1,Ae.name="gold-leaf",n.add(Ae),await s.yield();let pe=null;if(u||t.backdrop){pe=new e.Mesh(new e.SphereGeometry(2400,32,16),st(h)),pe.renderOrder=-.5,pe.frustumCulled=!1,n.add(pe);const c=new e.Mesh(new e.PlaneGeometry(6e3,6e3),rt(h));c.rotation.x=-Math.PI/2,c.position.set(0,0,250),n.add(c);const d=a.fork?a.fork("banks"):a,E=[],q=[],x=[];for(const N of[-1,1]){const G=E.length/3,Y=d.range(0,6),ge=d.range(0,6),xe=420;for(let se=0;se<=xe;se++){const he=-250+se*3,Z=ie(he,r),p=N*(48+5*Math.sin(he*.021+Y)),f=8.5+6*Math.sqrt(Math.abs(Math.sin(he*.052+Y)))+2.2*Math.sqrt(Math.abs(Math.sin(he*.131+ge)))+1.5*Math.sin(he*.023+ge);if(E.push(Z.x+Z.tz*p,-.5,Z.z-Z.tx*p,Z.x+Z.tz*p,f,Z.z-Z.tx*p),q.push(1.05,9,0,0,9,0),se<xe){const m=G+se*2;x.push(m,m+1,m+2,m+1,m+3,m+2)}}}const me=new e.BufferGeometry;me.setAttribute("position",new e.Float32BufferAttribute(E,3)),me.setAttribute("cut",new e.Float32BufferAttribute(q,3)),me.setAttribute("normal",new e.Float32BufferAttribute(new Float32Array(E.length).fill(0).map((N,G)=>G%3===2?1:0),3)),me.setIndex(x);const ke=new e.Mesh(me,Oe(h,{skins:3,wobble:.22}));ke.frustumCulled=!1,n.add(ke)}await s.yield();const Ge=r.bendStart+r.radius*(t.exitAngle??1.2217),_=ie(Ge,r),O=(c,d,E)=>new e.Vector3(c,d,E),ze=O(_.x+_.tx*62,4,_.z+_.tz*62),De=c=>{const d=M.uBraid.value;return Math.sin(c*d.x+1.3)*d.z+Math.sin(c*d.y)*d.z*.5},le=(c,d=.5,E=0)=>{const q=ie(c,r),x=E+De(c);return O(q.x+q.tz*x,M.uBandP.value.z+w*d,q.z-q.tx*x)},Ze=[O(0,2.5,0),O(0,2.6,60),O(0,5,150),O(0,4.6,235),le(275,.12),le(330,.1),le(390,.1),le(440,.12),O(_.x,1.6,_.z),O(_.x+_.tx*30,3.2,_.z+_.tz*30),ze.clone()],Ve=t.centerS??330,Re=le(Ve,.5),et={course:r,courseAt:c=>ie(c,r),courseNearest:(c,d)=>$e(c,d,r),bandPoint:le,portalSeat:{position:ze,normal:O(-_.tx,0,-_.tz),radius:7},flyThrough:Ze,exitS:Ge,viewpoints:{reveal:O(0,5,150),drop:O(0,4.6,235),closest:le(300,.1),bendAway:le(380,.1)},band:{halfWidth:y,depth:w,base:.5}};let Ce=o&&o[5]>=0?o[5]:-1;const tt=t.escort??!0,at=t.strikes||[.31,.52,.8],Ue=typeof t.neighboursAway=="function"?t.neighboursAway:null,ve=t.escortStations||[[0,-.3,-.1,.66,2.1,.85,.1],[.05,-.3,-.1,.66,2.1,.85,.1],[.09,-.4,-.02,.72,2,.8,.2],[.15,.33,.1,.8,2,.7,-.25],[.18,.33,.1,.8,2,.7,-.25],[.245,-.15,-.07,.5,2.45,.95,0],[.3,-.15,-.07,.5,2.45,.95,0],[.335,.5,.06,.85,2,.75,-.3],[.37,.4,0,.8,2.1,.8,-.2],[.455,.36,-.02,.8,2.2,.8,-.2],[.5,.2,.3,9,1.6,.4,0],[.655,-.3,.3,9,1.6,.4,0],[.695,-.44,0,.8,2.1,.8,.3],[.72,-.44,0,.8,2.1,.8,.3],[.78,.37,.12,.8,2,.7,-.25],[.8,.37,.12,.8,2,.7,-.25],[.865,-.24,-.04,.7,2.1,.8,.15],[.885,-.24,-.04,.7,2.1,.8,.15],[.93,.03,-.09,.86,2.3,.5,0],[1.01,0,-.08,.9,2.3,.45,0]];let Te=-1;o&&o[3]>=0&&(Te=o[3]);const Le=new e.Matrix4,de=new e.Vector3,we=new e.Matrix4,I=new e.Vector3,T=new e.Vector3,Be=new e.Vector3,Se=new e.Vector3,ne=new e.Vector3,ce=new e.Vector3,X=new e.Vector3,He=new e.Vector3,L=(c,d,E)=>{const q=e.MathUtils.clamp((E-c)/(d-c),0,1);return q*q*(3-2*q)};o&&(n.matrixAutoUpdate=!1);function ot(c,d,E){if(o){const p=ie(o[0],r),f=Math.atan2(p.tx,p.tz)+(o[4]||0)*Math.PI/180;E.getWorldDirection(T);const m=Math.atan2(T.x,T.z);E.getWorldPosition(I),n.matrix.makeRotationY(m-f);const B=(o[2]||0)+De(o[0]),z=O(p.x+p.tz*B,o[1],p.z-p.tx*B).applyMatrix4(n.matrix);n.matrix.setPosition(I.x-z.x,I.y-z.y,I.z-z.z),n.matrixWorld.copy(n.matrix),n.updateMatrixWorld(!0)}n.updateWorldMatrix(!0,!1),Le.copy(n.matrixWorld).invert(),E.getWorldPosition(de).applyMatrix4(Le),M.uCamL.value.copy(de),k.uTime.value=d;const q=$e(de.x,de.z,r),x=Te;k.uProgress.value=x<0?1:x,M.uLife.value.y=x<0?1:0;const me=x<0?d*9:1.3*v*Math.max(0,x-.47)+d*1.5,ke=x<0?1e4:-120+240*e.MathUtils.clamp((x-.455)/.08,0,1)+3e3*L(.53,.6,x);M.uWin.value.set(q,M.uWin.value.y,me,ke),M.uSight.value.set(ze.x,ze.y+1.5,ze.z,x<0?0:L(.58,.66,x)),pe&&pe.position.copy(de);const N=x>=0||!!o,G=x>=0?x:.5,Y=ie(N?q:Ve,r);let ge=0;N?(E.getWorldDirection(T).transformDirection(Le),ge=Math.tan(e.MathUtils.clamp(Math.asin(e.MathUtils.clamp(T.y,-1,1)),-.25,.85)),T.y=0,T.lengthSq()<1e-6&&T.set(Y.tx,0,Y.tz),T.normalize(),Be.copy(de)):(T.set(Y.tx,0,Y.tz),Be.copy(Re)),Se.set(-T.z,0,T.x);const xe=x<0?1:L(.47,.53,x),se=N?1:5,he=x>=0?x*40:d,Z=Ue&&x>=0?1-e.MathUtils.clamp(Ue(x),0,1):1;for(let p=0;p<V;p++){const f=ae[p];let m=((f.z+f.v*he)%4.6+4.6)%4.6-1,B=f.sc*1.55*L(3.6,3,m)*L(-1,-.7,m),z=0;const D=1-xe;let $=f.x*(1+.55*D)+Math.sin(d*.7+f.ph)*.07,K=f.y*(1+.5*D)+.1*D+Math.sin(d*.9+f.ph*2)*.05+D*Math.sin(d*1.4+f.ph)*.3;if(B*=1+.45*D,m=m*(1-.1*D)+2*D,N&&m<1){const W=1-m;$+=Math.sign(f.x)*W*.25}if(N){const W=Math.max(m,.5);$=Math.max(-.8*W,Math.min(.8*W,$)),K=Math.max(-.42*W,Math.min(.4*W,K))}if(p===0&&N){const W=L(.53,.56,G)*(1-L(.64,.67,G));z=W,$+=(.085-$)*W,K+=(-.125-K)*W,m+=(.46-m)*W,B+=(2.5-B)*W}if(p===1&&N){const W=L(.572,.584,G)*(1-L(.616,.628,G));$+=(-.34+1.1*(G-.584)/.032-$)*W,K+=(.1-K)*W,m+=(.3-m)*W,B+=(2.3-B)*W}I.copy(Be).addScaledVector(Se,$*se).addScaledVector(T,m*se),I.y+=K*(N?1:2.5)+ge*Math.max(m,0)*se,I.y<.15&&(I.y=.15);const R=(f.yaw*(1.6-xe)+Math.sin(d*.5+f.ph)*.12)*(1-.8*z),ee=(.2+.35*(1-xe)+Math.sin(d*1.1+f.ph)*.06)*(1-z)+.98*z,te=Y.tx*Math.cos(R)+Y.tz*Math.sin(R),re=Y.tz*Math.cos(R)-Y.tx*Math.sin(R);ne.set(te*Math.cos(ee),Math.sin(ee),re*Math.cos(ee)),X.set(-re,0,te).negate(),ce.crossVectors(X,ne);const ye=H*B*Z;we.makeBasis(ne,ce,X).scale(He.set(ye,ye,ye)).setPosition(I),F.setMatrixAt(p,we)}F.instanceMatrix.needsUpdate=!0;for(let p=0;p<oe;p++){const f=Ee[p],m=((f.z+f.v*he)%130+130)%130-30,B=(N?q:Ve)+(N?m:m*.35),z=ie(B,r),D=Math.sin(B*f.wl+f.ph),$=Math.cos(B*f.wl+f.ph)*f.wl*y*.5,K=f.lat*y*.5+D*y*.5*.5;I.set(z.x+z.tz*K,.5+w*(f.h+.15*Math.sin(B*.07+f.ph*2)),z.z-z.tx*K);const R=Math.atan($*.5),ee=z.tx*Math.cos(R)+z.tz*Math.sin(R),te=z.tz*Math.cos(R)-z.tx*Math.sin(R);ne.set(ee,0,te),X.set(-te,0,ee).negate(),ce.set(0,1,0),ce.addScaledVector(X,-R*.8).normalize(),X.crossVectors(ne,ce);const re=f.sc*L(100,85,m)*L(-30,-24,m);we.makeBasis(ne,ce,X).scale(He.set(re,re,re)).setPosition(I),fe.setMatrixAt(p,we)}if(tt&&N&&oe>0){let p=0;for(const J of at){const We=(G-J)/.07;We>0&&We<1&&(p=Math.sin(Math.min(1,We*3.2)*Math.PI*.5)*(1-L(.3,1,We)))}let f=ve[0],m=ve[0];for(let J=0;J<ve.length-1;J++)G>=ve[J][0]&&(f=ve[J],m=ve[J+1]);const B=L(f[0],m[0],G),z=J=>f[J]+(m[J]-f[J])*B,D=L(.25,.27,G)*(1-L(.3,.31,G)),$=z(1)+Math.sin(d*.43)*.05*(1-D)+p*.9,K=z(2)+Math.sin(d*.61)*.03*(1-D)+p*.35,R=z(3)+Math.sin(d*.37)*.08*(1-D)+p*2.6;I.copy(de).addScaledVector(Se,$).addScaledVector(T,R),I.y=Math.max(.12,I.y+K+ge*Math.min(R,1.2));const ee=z(5)-p*.5,te=p*.5+Math.sin(d*.5)*.06+z(6),re=T.x*Math.cos(te)-Se.x*Math.sin(te),ye=T.z*Math.cos(te)-Se.z*Math.sin(te);ne.set(re*Math.cos(ee),Math.sin(ee),ye*Math.cos(ee)),X.set(-ye,0,re).negate(),ce.crossVectors(X,ne);const W=z(4);we.makeBasis(ne,ce,X).scale(He.set(W,W,W)).setPosition(I),fe.setMatrixAt(0,we)}fe.instanceMatrix.needsUpdate=!0,Ne.uniforms.uLeaf.value.x=Ce>=0?Ce:x<0?0:L(.82,.9,x)}return{object:n,radius:t.radius??16,height:6,center:Re,anchors:et,glass:h,setProgress(c){Te=c},setFall(c){Ce=c},setViewport(c){k.uViewH.value=c},update:ot,dispose(){},ground:!1,groundY:0}}export{it as COURSE_GLSL,Ie as DEFAULT_COURSE,dt as DRAGONFLY_STYLE,Qe as GALLE_PALETTE,be as GLASS_GLSL,Ke as WING_GLSL,st as blankMaterial,mt as buildHero,ie as courseAt,$e as courseNearest,ht as dragonflyGeometry,ut as dragonflyStyle,nt as makeGlass,lt as mayflyGeometry,ct as mayflyMaterial,Oe as overlayMaterial,rt as waterMaterial};
