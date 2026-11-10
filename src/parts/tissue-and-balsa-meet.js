import*as i from"three";import{clamp as Ae,lerp as Q,smoothstep as Fe}from"../kit/core.js";const Ft=["#D9A55B","#F6C7A6","#B8A6D9","#D8362B","#F4DE6A","#7FB6DE","#8E9A4A"],nt={white:"#F0F0F0",lemon:"#F4DE6A",orange:"#F08A2E",red:"#D8362B",blue:"#7FB6DE",olive:"#8E9A4A"},ot={honey:"#D9A55B",umber:"#5C3B1E"},J=n=>new i.Color(n),re=n=>new i.Vector3(n.r,n.g,n.b);function St(){return{uTime:{value:0},uSunDir:{value:new i.Vector3(-.92,.19,-.34).normalize()},uPix:{value:.0012},uFadeHalf:{value:450},uHoney:{value:re(J(ot.honey))},uUmber:{value:re(J(ot.umber))},uPeach:{value:re(J("#F6C7A6"))},uLilac:{value:re(J("#B8A6D9"))},uHot:{value:re(J("#FFF3DC"))},uEarth:{value:re(J("#B9A27A"))},uFree:{value:[new i.Matrix4,new i.Matrix4,new i.Matrix4]},uFreeWind:{value:new i.Vector3(0,0,0)},uFreeSpin:{value:new i.Vector3(0,0,0)},uPop:{value:new i.Vector2(1e4,0)}}}const kt={fadeHalf:450},it=new i.Vector2;function Bt(n,e,t,f){n.uTime.value=e;let o=900;f&&(f.getDrawingBufferSize(it),o=Math.max(200,it.y));const y=t&&t.projectionMatrix?t.projectionMatrix.elements[5]:1.6;n.uPix.value=2/(Math.max(.2,y)*o)}const he=`
uniform float uTime, uPix, uFadeHalf;
uniform vec3 uSunDir, uHoney, uUmber, uPeach, uLilac, uHot, uEarth;
float tbHash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float tbHash1(float n){ return fract(sin(n * 12.9898) * 43758.5453); }
float tbNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(tbHash(i), tbHash(i + vec2(1., 0.)), f.x), mix(tbHash(i + vec2(0., 1.)), tbHash(i + vec2(1., 1.)), f.x), f.y); }
vec3 tbDome(vec3 d){
  float h = d.y;
  vec3 c = mix(uPeach, uLilac, smoothstep(0.02, 0.62, h));
  c = mix(c, uLilac * vec3(0.7, 0.72, 0.9), smoothstep(0.4, 1., h));       // deeper overhead
  c = mix(c, uEarth, 1. - smoothstep(-0.2, 0.005, h));                     // under the horizon: the evening's earth, which every far thing of the ground fades to
  float s = dot(d, uSunDir);
  float blur = smoothstep(0.86, 0.995, s);            // the 16 degree hot blur with a wide soft fall-off
  float halo = smoothstep(0.3, 1.0, s);
  c = mix(c, uHot, 0.4 * halo * halo);
  c = mix(c, uHot, blur * blur * 0.95);
  return c;
}
float tbFade(float dist){ return 1. - exp2(-dist / max(uFadeHalf, 1.)); }
float tbSun(vec3 d){ float s = dot(d, uSunDir); return 0.5 * smoothstep(0.5736, 0.99, s); }   // cos 55 deg
`,rt=`
#ifdef TB_HELIX
attribute vec4 aHelix; attribute vec4 aModel; attribute vec2 aRange;
uniform vec4 uCol; uniform float uLaw; uniform mat4 uFree[3]; uniform vec3 uFreeWind, uFreeSpin; uniform vec2 uPop;
#ifdef TB_ORIGIN
attribute vec3 aOrigin;                                  // each model circles its own centre (thistledown, climbers)
#endif
float tbFreeWind(float z){ return z > 1.5 ? uFreeWind.z : (z > 0.5 ? uFreeWind.y : uFreeWind.x); }
float tbFreeSpin(float z){ return z > 1.5 ? uFreeSpin.z : (z > 0.5 ? uFreeSpin.y : uFreeSpin.x); }
float tbWind(float seed){ return (0.55 + 0.45 * tbHash1(seed * 3.7)) * (1. - 0.85 * uCol.w); }   // uCol.w = 1: still under power
mat3 tbRotY(float a){ float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
mat3 tbRotZ(float a){ float c = cos(a), s = sin(a); return mat3(c, s, 0., -s, c, 0., 0., 0., 1.); }
mat3 tbRotX(float a){ float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }
// local model space: nose +Z, span along X, up +Y. Returns object-space position (before modelMatrix).
vec3 tbPlace(vec3 p, out float wind){
  float seed = aModel.y, span = aModel.x;
  if (aModel.z > -0.5) {                                  // a free model: placed by a matrix the world sets
    wind = tbFreeWind(aModel.z);
    vec4 ps = vec4(p * span, 1.);
    if (aModel.z > 1.5) return (uFree[2] * ps).xyz;
    return aModel.z > 0.5 ? (uFree[1] * ps).xyz : (uFree[0] * ps).xyz;
  }
  bool own = aRange.y > aRange.x;                        // its own range of climb (clear of the flown line), else the whole column
  float lo = own ? aRange.x : uCol.x, H = max((own ? aRange.y : uCol.y) - lo, 1.);
  float hh = mod(aHelix.y - lo + aModel.w * uTime, H);
  float grow = aModel.w > 0. ? smoothstep(0., 10., hh) * smoothstep(0., 14., H - hh) : 1.;   // a standing model keeps its size
  float y = lo + (uLaw > 0. && aModel.w > 0. ? H * (exp(uLaw * hh / H) - 1.) / (exp(uLaw) - 1.) : hh);   // (round 10) slow low, fast high: see uLaw above
  float th = aHelix.z + aHelix.w * uTime, way = aHelix.w < 0. ? -1. : 1.;    // way: a model dealt a right-hand circle flies nose first too
  float r = aHelix.x * (1. + 0.05 * sin(uTime * 0.21 + seed * 40.));
  // dethermaliser: when the falling wave front has passed this model it sinks flat and level
  float pop = uPop.y * smoothstep(0., 12., y - uPop.x), y0 = y;
  #ifdef TB_ORIGIN
    pop = 0.;                                             // the wave is the column's own: a model circling a centre of its own elsewhere is not in it
  #endif
  float bank = way * uCol.z * (0.75 + 0.5 * tbHash1(seed * 7.1)) * (1. - pop) + (0.06 + 0.2 * pop) * sin(uTime * (0.7 + seed) + seed * 50.);   // popped: level, rocking like a leaf
  float pitch = 0.05 * sin(uTime * (0.5 + 0.6 * seed) + seed * 90.) - 0.03 - 0.13 * pop;
  y += 0.5 * span * 0.12 * sin(uTime * 0.6 + seed * 70.) - pop * mix(9., min(26., max(y0 - 54., 0.)), step(aHelix.x + 0.5 * span, 22.)) * smoothstep(0., 110., y0 - uPop.x);   // the small ones inside the camera's circle settle toward the crest; the rest sink 9 m (counted in every ring's clear air at the build)
  wind = tbWind(seed);                                   // circlers: motors mostly run down
  vec3 q = tbRotZ(-bank) * (tbRotX(pitch) * (p * span * grow));
  q = tbRotY(th + 1.5708 * way) * q;                      // heading = the tangent of its circle, left-hand or right
  vec3 at = q + vec3(r * sin(th), y, r * cos(th));
  #ifdef TB_ORIGIN
    at += aOrigin;
  #endif
  return at;
}
#endif
`;function Te(n,e={}){const t={uTime:n.uTime,uPix:n.uPix,uFadeHalf:n.uFadeHalf,uSunDir:n.uSunDir,uHoney:n.uHoney,uUmber:n.uUmber,uPeach:n.uPeach,uLilac:n.uLilac,uHot:n.uHot,uEarth:n.uEarth,uCol:{value:e.col||new i.Vector4(0,300,.35,0)},uLaw:{value:e.law||0},uFree:n.uFree,uFreeWind:n.uFreeWind,uFreeSpin:n.uFreeSpin,uPop:n.uPop,uHub:{value:new i.Vector4(...e.hub||[0,.3],...e.skein||[.25,-.2])},uMinPx:{value:e.minPx??.8}};return new i.ShaderMaterial({uniforms:t,defines:{...e.helix?e.origin?{TB_HELIX:1,TB_ORIGIN:1}:{TB_HELIX:1}:{},...e.soft?{TB_SOFT:1}:{}},side:i.DoubleSide,transparent:!!e.soft,depthWrite:!e.soft,vertexShader:`
      attribute vec3 aSide; attribute float aKind;
      uniform float uMinPx; uniform vec4 uHub;
      varying vec3 vW; varying float vGone; varying float vKind; varying float vT;
      ${he}
      ${rt}
      void main(){
        vec3 p0 = position, sd = aSide; float wind = 0.;
        #ifdef TB_HELIX
          float sp = aModel.z > -0.5 ? tbFreeSpin(aModel.z) : uTime * (1.5 + 5. * tbHash1(aModel.y * 9.3)) * step(0.5, tbHash1(aModel.y * 5.7));
          float w0 = aModel.z > -0.5 ? tbFreeWind(aModel.z) : tbWind(aModel.y);
          if (aKind > 2.5) {                       // propeller blade: turn about the hub; hidden while the fan shows
            float c = cos(sp), s = sin(sp); float show = smoothstep(0.42, 0.6, w0);
            float fold = 1.5 * smoothstep(0.76, 0.9, w0);      // a folding propeller: when the motor is spent the blades lie back along the nose
            vec2 d = (p0.xy - vec2(0., uHub.x)) * show; p0.z -= abs(d.y) * sin(fold); d.y *= cos(fold);
            p0.xy = vec2(0., uHub.x) + vec2(c * d.x - s * d.y, s * d.x + c * d.y);
            sd.xy = vec2(c * sd.x - s * sd.y, s * sd.x + c * sd.y) * show;
          } else if (aKind > 1.5) {                // rubber skein: twist runs down as it unwinds, knots slide tailward, then it sags
            float zn = clamp((uHub.z - p0.z) / max(uHub.z - uHub.w, 1e-3), 0., 1.);
            float tw = (1. - w0) * (38. * zn + 2.5 * sin(zn * 25. - (1. - w0) * 30.)) + 3.0 * zn;
            float c = cos(tw), s = sin(tw);
            float knot = 1. + 0.9 * (1. - w0) * smoothstep(0.6, 1., sin(zn * 19. + w0 * 40.));
            sd.xy = vec2(c * sd.x - s * sd.y, s * sd.x + c * sd.y) * knot;
            p0.y -= 0.02 * w0 * sin(zn * 3.14159);
          }
          vec3 P0 = tbPlace(p0, wind); float w1; vec3 P1 = tbPlace(p0 + sd, w1);
        #else
          vec3 P0 = p0, P1 = p0 + sd;
        #endif
        vec4 wp = modelMatrix * vec4(P0, 1.); vec3 ws = (modelMatrix * vec4(P1, 1.)).xyz - wp.xyz;
        float dist = length(wp.xyz - cameraPosition);
        float hw = length(ws);
        float k = uMinPx * uPix * dist / max(hw, 1e-5);
        float isStick = step(1e-6, hw) * (1. - step(1.5, aKind));
        vGone = isStick * (1. - 1. / max(k, 1.));        // true cover: a stick widened k times is drawn at 1/k of its strength, never removed
        float widen = mix(1., clamp(k, 1., 12.), isStick);
        vec3 pw = wp.xyz + ws * widen;
        vW = pw; vKind = aKind; vT = tbHash(position.xy * 3.1 + position.z);
        gl_Position = projectionMatrix * viewMatrix * vec4(pw, 1.);
      }`,fragmentShader:`
      varying vec3 vW; varying float vGone; varying float vKind; varying float vT;
      ${he}
      void main(){
        vec3 d = vW - cameraPosition; float dist = length(d); d /= max(dist, 1e-4);
        float sky = smoothstep(-0.08, 0.3, d.y);                    // the dome is behind it: umber
        vec3 c = mix(uHoney * (0.93 + 0.12 * vT), uUmber, 0.9 * sky);
        if (vKind > 1.5 && vKind < 2.5) c = uUmber * 0.62;          // rubber
        if (vKind > 3.5) {                                          // a hill's paper lining: shaded once, at the build, by its slope to the sun;
          c = mix(mix(uHot, uLilac, 0.6) * 0.42, mix(uHoney, uHot, 0.62), clamp(vKind - 4., 0., 1.));   // from a dim cool paper in the shade to a warm balsa sheet in the sun
          if (vKind > 5.5) c = mix(uUmber * 1.25, uHoney, clamp(vKind - 6., 0., 1.));       // 6..7: bare sheet balsa (a crest not yet papered)
          c = mix(c, uHot, 0.5 * tbSun(d));                         // and against the light the paper glows a little, as every paper here does
        }
        #ifdef TB_SOFT
          // a hill's own sticks lie on its lining: one widened k times is drawn at 1/k of its strength OVER the lining (true cover),
          // so a far hill is its paper with faint ribs and never a net of pale wire
          gl_FragColor = vec4(mix(c, tbDome(d), clamp(tbFade(dist) * 0.45, 0., 1.)), 1. - vGone);
        #else
        float f = max(tbFade(dist) * (vKind > 3.5 ? 0.45 : 0.9), vGone);   // a hill's lining takes half the distance's fade, so a far hill stays a solid thing
        gl_FragColor = vec4(mix(c, tbDome(d), clamp(f, 0., 1.)), 1.);
        #endif
      }`})}function st(n){const e=Te(n);return e.polygonOffset=!0,e.polygonOffsetFactor=2,e.polygonOffsetUnits=2,e}function we(n,e={}){const t={uTime:n.uTime,uPix:n.uPix,uFadeHalf:n.uFadeHalf,uSunDir:n.uSunDir,uHoney:n.uHoney,uUmber:n.uUmber,uPeach:n.uPeach,uLilac:n.uLilac,uHot:n.uHot,uEarth:n.uEarth,uCol:{value:e.col||new i.Vector4(0,300,.35,0)},uLaw:{value:e.law||0},uFree:n.uFree,uFreeWind:n.uFreeWind,uFreeSpin:n.uFreeSpin,uPop:n.uPop,uFront:{value:e.frontUniform||new i.Vector4(1e6,1e6,3,1)},uBay:{value:new i.Vector2(...e.bay||[4,4])},uLift:{value:e.lift??0},uGain:{value:e.gain??1},uMilk:{value:e.milk??0},uSway:{value:e.sway===!0?1:e.sway||e.blade||1},uInk:{value:e.ink??1},uFar:{value:e.far??1},uBody:{value:e.body??0},uSub:{value:e.sub??0},uLit:{value:e.lit??0},uDeepen:{value:e.deepen??0},uRib:{value:e.rib??.75},uTunnel:{value:e.tunnel??0},uMarks:{value:e.marks??1},uForm:{value:e.form??0},uBare:{value:new i.Vector2(...e.bare||[0,0])}},f={};e.helix&&(f.TB_HELIX=1),e.helix&&e.origin&&(f.TB_ORIGIN=1),e.sway&&(f.TB_SWAY=1),e.blade&&(f.TB_BLADE=1),e.front&&(f.TB_FRONT=1),e.scatter&&(f.TB_SCATTER=1);const o=!!e.body&&!e.scatter;o&&(f.TB_BODY=1),e.body&&e.scatter&&(f.TB_FANADD=1);const y=new i.ShaderMaterial({uniforms:t,defines:f,side:i.DoubleSide,depthWrite:o,depthTest:!0,transparent:!0,blending:i.CustomBlending,blendEquation:i.AddEquation,blendSrc:e.scatter||o?i.OneFactor:i.ZeroFactor,blendDst:e.scatter?i.OneFactor:o?i.OneMinusSrcAlphaFactor:i.SrcColorFactor,blendSrcAlpha:i.ZeroFactor,blendDstAlpha:i.OneFactor,vertexShader:`
      attribute vec2 aBay; attribute float aSlack;
      uniform float uLift; uniform vec4 uFront;
      varying vec3 vW; varying vec3 vCol; varying vec2 vBay; varying float vSlack; varying float vFront; varying vec3 vFan; varying float vThin;
      ${he}
      ${rt}
      #if defined(TB_SWAY) || defined(TB_BLADE)
        uniform float uSway;
      #endif
      #ifdef TB_SWAY
        attribute vec4 aSway;                              // xyz: displacement at full swing, w: phase
      #endif
      #ifdef TB_BLADE
        attribute vec4 aRoot; attribute vec4 aLean;        // an instanced sliver: foot xyz + height; lean x, z, phase, width
      #endif
      #ifdef TB_HELIX
        attribute float aPart; attribute vec3 aColA; attribute vec3 aColB;
      #else
        attribute vec3 aCol;
      #endif
      #ifdef TB_FRONT
        attribute vec3 aSag; attribute float aFront;
      #endif
      void main(){
        vec3 p = position; float lift = uLift; vFan = vec3(0.); vFront = -1e6; vSlack = aSlack; vThin = 1.;
        #ifdef TB_SWAY
          p += aSway.xyz * sin(uTime * uSway + aSway.w);
        #endif
        #ifdef TB_BLADE
          float by = position.y, bph = aLean.z * 6.2832;
          float bsw = sin(uTime * uSway * (0.7 + 0.6 * fract(aLean.z * 7.3)) + bph);
          vec2 bln = aLean.xy * (0.7 + 0.5 * bsw);
          float btw = bph + 1.3 * by * sin(uTime * uSway * 0.6 + bph * 3.);              // twisting slowly
          vec3 bc = aRoot.xyz + vec3(bln.x * by * by, by, bln.y * by * by) * aRoot.w;
          float bw = aLean.w * (1. - 0.55 * by), bd = length((modelMatrix * vec4(bc, 1.)).xyz - cameraPosition);
          float bk = max(1., 1.6 * uPix * bd / max(bw, 1e-4));                           // never thinner than 1.6 px: paler instead
          vThin = 1. / bk;
          p = bc + vec3(cos(btw), 0., sin(btw)) * (position.x * bw * min(bk, 30.));
        #endif
        #ifdef TB_HELIX
          float wind; p = tbPlace(position, wind);
          vCol = mix(aColA, aColB, clamp(aPart, 0., 1.)); lift *= aModel.x;
          float sp = aModel.z > -0.5 ? tbFreeSpin(aModel.z) : 0.;
          vFan = vec3(step(1.5, aPart), wind, sp);
        #else
          vCol = aCol;
        #endif
        #ifdef TB_FRONT
          float sl = smoothstep(-uFront.z, uFront.z, aFront - uFront.x);
          float breathe = 0.72 + 0.28 * sin(uTime * 0.9 + aFront * 0.7 + position.x * 0.3);
          p += aSag * sl * breathe; vFront = aFront;
        #endif
        vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vBay = aBay;
        vec4 mv = viewMatrix * wp; gl_Position = projectionMatrix * mv;
        float len = max(length(mv.xyz), 1e-3);
        vec4 p2 = projectionMatrix * vec4(mv.xyz * (1. - min(lift / len, 0.5)), 1.);
        gl_Position.z = p2.z / max(p2.w, 1e-4) * gl_Position.w;
      }`,fragmentShader:`
      uniform vec4 uFront; uniform vec2 uBay; uniform float uGain, uMilk;
      varying vec3 vW; varying vec3 vCol; varying vec2 vBay; varying float vSlack; varying float vFront; varying vec3 vFan; varying float vThin;
      uniform float uInk, uFar, uBody, uSub, uLit, uDeepen, uRib, uTunnel, uMarks, uForm; uniform vec2 uBare;
      ${he}
      float tbLine(float x, float c, float w, float fw){ return 1. - smoothstep(w, w + fw, abs(x - c)); }
      void main(){
        vec3 d = vW - cameraPosition; float dist = length(d); d /= max(dist, 1e-4);
        vec2 b = fract(vBay), cell = floor(vBay), fw = fwidth(vBay) + 1e-5;
        vec2 m = vBay * uBay, fm = fw * uBay;                         // metres, and metres per pixel
        float fine = 1. - smoothstep(0.1, 0.3, max(fw.x, fw.y));      // marks under ~3 px become their flat tint
        float hsh = tbHash(cell + 7.3);
        vec2 e = min(b, 1. - b), em = e * uBay;
        float wob = tbNoise(m * 0.35 + 3.) - 0.5;
        float slack = clamp(vSlack + smoothstep(-uFront.z, uFront.z, vFront - uFront.x + wob * uFront.w * 2.), 0., 1.);
        float cov = 1. - smoothstep(-0.25, 0.25, vFront - uFront.y + wob * uFront.w);
        float lead = 1. - smoothstep(0.1, 0.5, abs(vFront - uFront.y + wob * uFront.w + 0.45));   // folded leading edge of a sheet
        float deep = uDeepen + (hsh - 0.5) * 0.14;                     // each panel a breath off its neighbour (uDeepen: a fuller pigment, for a paper laid under the sky)
        float mk = fine * uMarks;                                      // uMarks: how strongly a paper carries its marks (the land's papers faintly)
        deep += mk * (0.24 * (1. - smoothstep(0., 0.16, e.x)) + 0.12 * (1. - smoothstep(0., 0.1, e.y)));   // scallop: dope pools at ribs
        float seamBay = step(0.6, tbHash(vec2(cell.x, 3.7)));          // doubled seam where two sheets overlap
        float wS = max(0.03, 0.9 * fm.x), lw = max(0.006, 0.75 * fm.x) / uBay.x;
        deep += mk * seamBay * (0.3 * step(em.x, wS * 3.) * step(b.x, 0.5) + 0.6 * tbLine(b.x, wS * 3. / uBay.x, lw, fw.x));
        float blob = 1. - smoothstep(0.06, 0.1 + length(fm), length(em) * (0.75 + 0.5 * hsh));
        deep += mk * 1.3 * blob;                                       // glue blob at each joint
        if (uSub > 0.5) {                                              // riblets: fine ribs between the formers, seen only close to
          vec2 es = (0.5 - abs(fract(vBay * uSub) - 0.5)) * uBay / uSub;
          float fs = 1. - smoothstep(0.06, 0.2, max(fw.x, fw.y) * uSub);
          deep += fs * 0.1 * max(1. - smoothstep(0.02, 0.02 + fm.x, es.x), 1. - smoothstep(0.02, 0.02 + fm.y, es.y));
        }
        // creases: contour lines of two noises, long and wandering, only where the skin is slack
        float n1 = tbNoise(m * vec2(0.55, 0.16) + hsh * 20.), n2 = tbNoise(m.yx * vec2(0.5, 0.21) + 40. + hsh * 9.);
        float cw = 0.035 + 2. * length(fwidth(m * 0.3));
        float cr = (1. - smoothstep(0., cw, abs(n1 - 0.5))) + 0.7 * (1. - smoothstep(0., cw, abs(n2 - 0.45)));
        deep += slack * (0.85 * cr * fine + 0.3 * (n1 - 0.3)) + lead * 0.9;
        vec3 T = pow(max(vCol, vec3(1e-4)), vec3(max(1. + deep, 0.5)));
        float fanA = 0.;
        #ifdef TB_BODY
          // the frame under the paper: a rib is drawn in the skin as its shadow, at every line of the bays
          vec2 wr = max(vec2(0.03), 0.6 * fm);
          float rib = max(1. - smoothstep(wr.x, wr.x + fm.x, em.x), 1. - smoothstep(wr.y, wr.y + fm.y, em.y));
          T *= mix(vec3(1.), vec3(0.66, 0.54, 0.46), uRib * rib * fine);
        #endif
        if (vFan.x > 0.5) {                                            // propeller fan: two soft sectors, arc and density fall as it runs down
          vec2 q = vBay; if (abs(q.x) < 1e-4) q.x = 1e-4;
          float r = length(q), a = atan(q.y, q.x) + vFan.z * 0.12, run = 1. - smoothstep(0.3, 0.58, vFan.y);
          float sec = smoothstep(1. - (0.2 + 0.75 * run), 1., abs(cos(a)));
          float disc = (1. - smoothstep(0.92, 1., r)) * smoothstep(0.06, 0.12, r);
          fanA = clamp(run * disc * (0.35 + 0.4 * sec), 0., 1.);
          T = mix(vec3(1.), uHoney * 1.05, fanA); cov = 1.;
        }
        float fade = tbFade(dist) * uFar;                              // uFar: how much of the distance's fade this paper takes (a hill's skin takes half)
        #ifdef TB_SCATTER
          float lobe = (tbSun(d) * uGain + uMilk) * (1. - fade) * cov * vThin * (1. - step(0.5, vFan.x));   // uMilk: paper that scatters a little everywhere (white skins, the sheet)
          gl_FragColor = vec4(pow(max(T, vec3(1e-4)), vec3(0.72)) * lobe * 1.4, 1.);
          #ifdef TB_FANADD
            if (vFan.x > 0.5) gl_FragColor = vec4(mix(uHoney, uHot, 0.5) * fanA * 0.2 * (1. - fade), 1.);   // a running propeller: a faint warm disc, added (a paper with a body draws none)
          #endif
        #elif defined(TB_BODY)
          // a paper with a BODY: it shows its own colour, lit (by the sky of the direction beyond it, mirrored above the horizon,
          // and the hot of the hour; or from above with uLit), and hides what is behind it (uBody 1: wholly); it writes depth, so one
          // paper hides another rightly; distance mixes its colour toward the dome's, it does not thin it. A propeller's fan is not
          // drawn here (the additive pass draws it).
          float a = uBody * cov * vThin * (1. - step(0.5, vFan.x));
          if (a < 0.02) discard;
          vec3 light = mix(mix(tbDome(vec3(d.x, abs(d.y), d.z)), uHot, 0.5), mix(uPeach, uHot, 0.8) * (0.95 + 0.3 * tbSun(d)), uLit);   // uLit: a paper laid under the sky (ground, hills) takes the hour's light from above
          if (uForm > 0.) {                                             // uForm: a paper standing in the low sun; its faces turned to the sun warm, those turned away cooler and darker
            vec3 n = normalize(cross(dFdx(vW), dFdy(vW)));
            if (dot(n, d) > 0.) n = -n;
            light *= mix(vec3(1.), mix(vec3(0.66, 0.72, 0.92), vec3(1.16, 1.07, 0.9), smoothstep(-0.45, 0.7, dot(n, uSunDir))), uForm);
          }
          if (uTunnel > 0.5 && !gl_FrontFacing) {                       // the inside of a hull of uTunnel rings (bay v counts them from the stern), lit by place: bright by its openings
            float r = vBay.y;                                           // (the stern's mouth, the nose, either end of a bare stretch uBare), dim between them; each ring former's shadow lies on the paper
            float glow = max(exp(-r / 2.5), exp(-(uTunnel - r) / 2.5));
            if (uBare.y > uBare.x) glow = max(glow, max(exp(-abs(r - uBare.x) / 1.5), exp(-abs(r - uBare.y) / 1.5)));
            light *= mix(0.42, 1.14, glow) * (1. - 0.3 * (1. - smoothstep(0.015, 0.06, e.y)));
          }
          T = max(mix(vec3(1.), T, uInk), vec3(0.));
          gl_FragColor = vec4(mix(T * light, tbDome(d), clamp(fade, 0., 1.)) * a, a);
        #else
          T = mix(T, vec3(1.), fade); T = max(mix(vec3(1.), T, cov * vThin * uInk), vec3(0.));
          gl_FragColor = vec4(max(T, vec3(0.02)), 1.);
        #endif
      }`});return y.forceSinglePass=!0,y}class te{constructor(e=Float32Array,t=4096){this.T=e,this.a=new e(t),this.length=0}push(){const e=arguments.length;if(this.length+e>this.a.length){const o=new this.T(Math.max(this.a.length*2,this.length+e));o.set(this.a),this.a=o}const t=this.a;let f=this.length;for(let o=0;o<e;o++)t[f++]=arguments[o];this.length=f}attr(e){return new i.BufferAttribute(this.a.subarray(0,this.length),e)}}class Le{constructor(){this.p=new te,this.s=new te,this.k=new te,this.i=new te(Uint32Array),this.n=0}_v(e,t,f,o,y,u,v){return this.p.push(e,t,f),this.s.push(o,y,u),this.k.push(v),this.n++}stick(e,t,f,o=0,y=null){let u=t[0]-e[0],v=t[1]-e[1],x=t[2]-e[2];const _=Math.hypot(u,v,x)||1;u/=_,v/=_,x/=_;let M,w,m;y?(M=y[0],w=y[1],m=y[2]):(M=x,w=0,m=-u,Math.abs(v)>.95&&(M=1,w=0,m=0));const k=M*u+w*v+m*x;M-=k*u,w-=k*v,m-=k*x;const q=Math.hypot(M,w,m)||1;M*=f/q,w*=f/q,m*=f/q;const b=this._v(e[0],e[1],e[2],-M,-w,-m,o),O=this._v(e[0],e[1],e[2],M,w,m,o),g=this._v(t[0],t[1],t[2],M,w,m,o),B=this._v(t[0],t[1],t[2],-M,-w,-m,o);return this.i.push(b,O,g,b,g,B),[u,v,x,M/f,w/f,m/f]}stick2(e,t,f,o=0,y=null){const u=this.stick(e,t,f,o,y),v=u[1]*u[5]-u[2]*u[4],x=u[2]*u[3]-u[0]*u[5],_=u[0]*u[4]-u[1]*u[3];this.stick(e,t,f,o,[v,x,_])}plate(e,t=0){const f=this.n;e.forEach((o,y)=>this._v(o[0],o[1],o[2],0,0,0,Array.isArray(t)?t[y]:t));for(let o=1;o<e.length-1;o++)this.i.push(f,f+o,f+o+1)}get triangles(){return this.i.length/3}geometry(e=i.BufferGeometry){const t=new e;return t.setAttribute("position",this.p.attr(3)),t.setAttribute("aSide",this.s.attr(3)),t.setAttribute("aKind",this.k.attr(1)),t.setIndex(this.i.attr(1)),t}async geometryAsync(e){const t=this.geometry();return await e.yield(),t.computeBoundingSphere(),await e.yield(),t}}class De{constructor(e=!1){this.part=e,this.p=new te,this.b=new te,this.c=new te,this.sl=new te,this.sg=new te,this.f=new te,this.sw=new te,this.i=new te(Uint32Array),this.n=0}_v(e,t,f,o,y,u,v){return this.p.push(e[0],e[1],e[2]),this.b.push(t,f),this.sl.push(y),this.f.push(u),this.part?this.c.push(o):this.c.push(o.r,o.g,o.b),v?this.sg.push(v[0],v[1],v[2]):this.sg.push(0,0,0),this.sw.push(0,0,0,0),this.n++}quad(e,t,f,o,y,u,v={}){const x=v.slack??0,_=v.front??-1e6,M=g=>Array.isArray(x)?x[g]:x,w=g=>Array.isArray(_)?_[g]:_,m=g=>v.cols?v.cols[g]:u,k=this._v(e,y[0],y[1],m(0),M(0),w(0)),q=this._v(t,y[2],y[1],m(1),M(1),w(1)),b=this._v(f,y[2],y[3],m(2),M(2),w(2)),O=this._v(o,y[0],y[3],m(3),M(3),w(3));if(v.sag){const g=[0,1,2].map(d=>(e[d]+t[d]+f[d]+o[d])/4),B=this._v(g,(y[0]+y[2])/2,(y[1]+y[3])/2,v.cols?{r:(m(0).r+m(1).r+m(2).r+m(3).r)/4,g:(m(0).g+m(1).g+m(2).g+m(3).g)/4,b:(m(0).b+m(1).b+m(2).b+m(3).b)/4}:u,(M(0)+M(1)+M(2)+M(3))/4,(w(0)+w(1)+w(2)+w(3))/4,v.sag);this.i.push(k,q,B,q,b,B,b,O,B,O,k,B)}else this.i.push(k,q,b,k,b,O);if(v.sway)for(let g=0;g<4;g++){const B=Array.isArray(v.sway[0])?v.sway[g]:v.sway;for(let d=0;d<4;d++)this.sw.a[(k+g)*4+d]=B[d]}}get triangles(){return this.i.length/3}geometry(e=i.BufferGeometry,t=!1,f=!1){const o=new e;return f&&o.setAttribute("aSway",this.sw.attr(4)),o.setAttribute("position",this.p.attr(3)),o.setAttribute("aBay",this.b.attr(2)),o.setAttribute("aSlack",this.sl.attr(1)),o.setAttribute(this.part?"aPart":"aCol",this.c.attr(this.part?1:3)),t&&(o.setAttribute("aSag",this.sg.attr(3)),o.setAttribute("aFront",this.f.attr(1))),o.setIndex(this.i.attr(1)),o}async geometryAsync(e,t=!1,f=!1){const o=this.geometry(i.BufferGeometry,t,f);return await e.yield(),o.computeBoundingSphere(),await e.yield(),o}}function lt(n,e){const t=new Le,f=new De(!0),o=[{c0:.17,taper:.35,sweep:0,wy:.118,le:.11,dih:.03,tip:.075,ribs:17,tail:.19,st:[[.33,.028,-.005,.055],[.2,.045,-.035,.085],[.11,.05,-.045,.115],[-.06,.05,-.04,.115],[-.2,.035,-.015,.07],[-.44,.01,.02,.045]]},{c0:.125,taper:.5,sweep:.03,wy:.14,le:.09,dih:.02,tip:.11,ribs:19,tail:.17,st:[[.3,.016,0,.036],[.12,.024,-.012,.045],[-.05,.022,-.008,.04],[-.26,.014,0,.03],[-.5,.006,.01,.025]]},{c0:.25,taper:.6,sweep:.34,wy:.035,le:.2,dih:.03,tip:.03,ribs:17,tail:0,st:[[.25,.02,-.01,.04],[.1,.04,-.035,.06],[-.08,.035,-.025,.05],[-.2,.012,0,.03]]}][n],y=a=>o.wy+o.dih*Math.min(Math.abs(a),.3)/.3+o.tip*Math.max(0,Math.abs(a)-.3)/.2,u=a=>o.c0*(1-o.taper*Math.max(0,Math.abs(a)-.3)/.2),v=a=>o.le-o.sweep*Math.abs(a)-(o.c0-u(a))*.25,x=(a,s,h=0)=>[a,y(a)+h*u(a),v(a)-s*u(a)],_=[-.5,-.3,0,.3,.5],M=o.ribs;for(let a=0;a<4;a++){const s=_[a],h=_[a+1];t.stick(x(s,0),x(h,0),.0065,0,[0,0,1]),t.stick(x(s,.33,.02),x(h,.33,.02),.0045,0,[0,0,1]),t.stick(x(s,.667,.01),x(h,.667,.01),.003,1,[0,0,1]),t.stick(x(s,.97),x(h,.97),.0095,0,[0,0,1])}const w=e.int(2,M-3),m=e.range(.15,.3)*(e.chance(.5)?1:-1);for(let a=0;a<M;a++){const s=-.5+a/(M-1),h=a===0||a===M-1,F=s+(a===w?m/(M-1):0);t.stick(x(s,0),x(F,1),h?.0048:.0032,h?0:1,[1,0,0]),h&&t.stick(x(s,.1,.05),x(s,.8,.03),.0032,1,[0,1,0])}for(let a=0;a<4;a++){const s=_[a],h=_[a+1],F=(s+.5)*(M-1),P=(h+.5)*(M-1),N=Math.abs(s)>.45?.6:0,U=Math.abs(h)>.45?.6:0;f.quad(x(s,0),x(h,0),x(h,.33,.085),x(s,.33,.085),[F,0,P,1],0,{slack:[N,U,U,N]}),f.quad(x(s,.33,.085),x(h,.33,.085),x(h,1),x(s,1),[F,1,P,3],0,{slack:[N,U,U,N]})}const k=o.st,q=k[k.length-1],b=q[0],O=q[3];if(o.tail){const a=o.tail,s=.105,h=(F,P)=>[F,O+.004,b+s-P*s*(1-.3*Math.abs(F)/a)];t.stick(h(-a,0),h(a,0),.0045,0,[0,0,1]),t.stick(h(-a,1),h(a,1),.006,0,[0,0,1]),t.stick(h(-a,.4),h(a,.4),.003,1,[0,0,1]);for(let F=0;F<7;F++){const P=-a+F/6*2*a;t.stick(h(P,0),h(P,1),F%6===0?.004:.0026,F%6===0?0:1,[1,0,0])}f.quad(h(-a,0),h(0,0),h(0,1),h(-a,1),[0,0,3,2],0,{slack:[.5,0,0,.5]}),f.quad(h(0,0),h(a,0),h(a,1),h(0,1),[3,0,6,2],0,{slack:[0,.5,.5,0]})}else for(const a of[-.5,.5]){const s=x(a,.15),h=x(a,1),F=[a,h[1]+.09,h[2]-.02],P=[a,s[1]+.07,s[2]-.06];t.stick(s,P,.004,0,[0,0,1]),t.stick(P,F,.004,0,[0,1,0]),t.stick(F,h,.004,0,[0,0,1]),f.quad(s,h,F,P,[0,0,2,1],0,{slack:[0,0,.4,.4]})}const g=(a,s,h)=>[s*a[1],h>0?a[3]:a[2],a[0]];for(let a=0;a<k.length;a++){const s=k[a];if(t.stick(g(s,-1,1),g(s,1,1),.0026,1,[0,0,1]),t.stick(g(s,-1,-1),g(s,1,-1),.0026,1,[0,0,1]),t.stick(g(s,-1,-1),g(s,-1,1),.0026,1,[0,0,1]),t.stick(g(s,1,-1),g(s,1,1),.0026,1,[0,0,1]),a===k.length-1)break;const h=k[a+1];for(const P of[-1,1])for(const N of[-1,1])t.stick(g(s,P,N),g(h,P,N),.0042,0,[P,N,0]);const F=[[-1,-1],[1,-1],[1,1],[-1,1],[-1,-1]];for(let P=0;P<4;P++)f.quad(g(s,...F[P]),g(s,...F[P+1]),g(h,...F[P+1]),g(h,...F[P]),[P,a,P+1,a+1],1)}if(n===1){const a=[0,k[1][3],.1],s=[0,k[2][3],-.03],h=[0,o.wy,-.02],F=[0,o.wy,.07];t.stick(a,F,.004,0,[0,0,1]),t.stick(s,h,.004,0,[0,0,1]),f.quad(a,s,h,F,[0,0,1,1],1)}if(o.tail){const a=[0,O,b+.12],s=[0,O,b-.005],h=[0,O+.125,b-.03],F=[0,O+.1,b+.045];t.stick(a,F,.004,0,[0,0,1]),t.stick(F,h,.004,0,[0,1,0]),t.stick(h,s,.004,0,[0,0,1]),t.stick([0,O+.055,b+.08],[0,O+.06,b-.015],.0026,1,[0,1,0]),f.quad(a,s,h,F,[0,0,2,2],1,{slack:[0,0,.4,.3]})}if(n===0)for(const a of[-1,1]){const s=[a*.035,-.035,.19],h=[a*.095,-.15,.225];t.stick2(s,h,.0022,0);const F=[];for(let P=0;P<10;P++)F.push([h[0],h[1]+.024*Math.cos(P*.6283),h[2]+.024*Math.sin(P*.6283)]);t.plate(F,0),t.stick(s,[-s[0],s[1],s[2]],.002,0,[0,0,1])}{const a=k[0],s=k[k.length-1];t.plate([g(a,-1,-1),g(a,1,-1),g(a,1,1),g(a,-1,1)],0),t.plate([[-a[1]*.6,a[2]+.008,a[0]+.014],[a[1]*.6,a[2]+.008,a[0]+.014],[a[1]*.6,a[3]-.008,a[0]+.014],[-a[1]*.6,a[3]-.008,a[0]+.014]],0),t.plate([g(s,-1,-1),g(s,1,-1),g(s,1,1),g(s,-1,1)],0)}const B=(k[0][2]+k[0][3])/2,d=k[0][0]+.014,r=n===1?.1:.135;for(const a of[-1,1])t.plate([[-.004*a,B+.012*a,d],[.017*a,B+.45*r*a,d],[.012*a,B+r*a,d],[-.012*a,B+.96*r*a,d],[-.015*a,B+.4*r*a,d]],3);f.quad([-r,B-r,d],[r,B-r,d],[r,B+r,d],[-r,B+r,d],[-1,-1,1,1],2);const T=k[k.length-2],L=T[0]+.02,E=(T[2]+T[3])/2,R=6,$=.0062;for(let a=0;a<R;a++){const s=Q(k[0][0],L,a/R),h=Q(k[0][0],L,(a+1)/R),F=Q(B,E,a/R),P=Q(B,E,(a+1)/R);for(const N of[[$,0,0],[0,$,0]]){const U=t._v(0,F,s,-N[0],-N[1],0,2),l=t._v(0,F,s,N[0],N[1],0,2),c=t._v(0,P,h,N[0],N[1],0,2),D=t._v(0,P,h,-N[0],-N[1],0,2);t.i.push(U,l,c,U,c,D)}}return{F:t,S:f,hub:[B,d],skein:[k[0][0],L]}}const j=4,Pe=1,Ye=[8,14],ct=1,At=.3,Xe=7,Tt={length:120,open:Xe};function ut(n,e,t){const f=.5+.5*(-n*t[0]+t[1]-e*t[2])/Math.hypot(n,1,e);return .99*Fe(.15,.95,f)}function ht(n,e){return{r:n.r*Q(.22,1.06,e),g:n.g*Q(.36,1.02,e),b:n.b*Q(.95,.86,e)}}async function Pt(n,e,t,f){const{H:o,RX:y,RZ:u,olive:v,lemon:x,crestAt:_,sun:M}=f,w=Math.ceil(y/j)+1,m=Math.ceil(u/j)+1,k=e.range(.6,1.4),q=e.range(-6,6),b=e.range(-5,5),O=e.range(.25,.5),g=(l,c)=>{const D=Math.hypot((l-q*.3)/y,(c-b*.3)/u);if(D>=1)return 0;const C=Math.pow(.5+.5*Math.cos(Math.PI*D),.85),G=O*Math.exp(-(((l-18-q)/16)**2)-((c+10-b)/18)**2),X=t.fbm2(l*.035+11,c*.035-4,3)*2.2*k*Fe(0,.5,1-D);return Math.max(0,o*Math.min(1,C+G*(1-C)*1.2)*(1-.06*k)+X*Math.min(1,C*3))},B=[],d=(l,c)=>(c+m)*(2*w+1)+(l+w);for(let l=-m;l<=m;l++)for(let c=-w;c<=w;c++)B[d(c,l)]=g(c*j,l*j);const r=(l,c)=>Math.abs(l)>w||Math.abs(c)>m?0:B[d(l,c)],T=(l,c,D)=>.22*Math.sin(l*12.9+c*78.2+D*37.7),L=(l,c)=>{let D=l*j+T(l,c,1),C=c*j+T(l,c,2);const G=q*.3,X=b*.3,ie=Math.hypot((D-G)/y,(C-X)/u);return ie>.985?(D=G+(D-G)/ie*.985,C=X+(C-X)/ie*.985,[D,.02,C]):[D,Math.max(.02,r(l,c)),C]},E=(l,c)=>Math.hypot((l*j-q*.3)/y,(c*j-b*.3)/u)<.985,R=new Le,$=new De(!1),a=new De(!1),s=new Le,h=[-.6,0,-.8],F=l=>l[0]*h[0]+l[2]*h[2];let P=1e9,N=-1e9;const U=[];for(let l=-m;l<=m;l++){for(let c=-w;c<w;c++){const D=L(c,l),C=L(c+1,l);if(!E(c,l)&&!E(c+1,l))continue;const G=Math.max(D[1],C[1])>_*o-3;R.stick2(D,C,G?.16:.13,0)}await n.yield()}for(let l=-w;l<=w;l++){for(let c=-m;c<m;c++){const D=L(l,c),C=L(l,c+1);!E(l,c)&&!E(l,c+1)||R.stick2(D,C,.085,1)}await n.yield()}for(let l=-m;l<m;l++){for(let c=-w;c<w;c++){const D=L(c,l),C=L(c+1,l),G=L(c+1,l+1),X=L(c,l+1),ie=Math.max(D[1],C[1],G[1],X[1]);if(!E(c,l)&&!E(c+1,l)&&!E(c+1,l+1)&&!E(c,l+1))continue;const Ee=ie>=_*o-1.5?6:4;ie>.3&&s.plate([[c,l],[c+1,l],[c+1,l+1],[c,l+1]].map(([Z,K])=>{const ae=L(Z,K);return[ae[0],Math.max(.02,ae[1]-At),ae[2]]}),[[c,l],[c+1,l],[c+1,l+1],[c,l+1]].map(([Z,K])=>Ee+ut((r(Z+1,K)-r(Z-1,K))/(2*j),(r(Z,K+1)-r(Z,K-1))/(2*j),M)));const Y=(D[1]+C[1]+G[1]+X[1])/4,Se=Math.min(D[1],C[1],G[1],X[1]),fe=_*o,He=[[c,l],[c+1,l],[c+1,l+1],[c,l+1]].map(([Z,K])=>ut((r(Z+1,K)-r(Z-1,K))/(2*j),(r(Z,K+1)-r(Z,K-1))/(2*j),M));if(Se<fe+1.5){const Z=.5*Fe(.55,.95,Math.abs(Math.sin(c*3.3+l*5.1)));$.quad(D,C,G,X,[c,l,c+1,l+1],v,{slack:[0,0,Z,0],front:[D[1],C[1],G[1],X[1]],sag:[0,-.5,0],cols:He.map(K=>ht(v,K))})}if(ie>fe-1.5){const Z=[D,C,G,X].map(ae=>F(ae)+40*Math.max(0,fe-ae[1])),K=[F(D),F(C),F(G),F(X)];P=Math.min(P,...K),N=Math.max(N,...K),a.quad(D,C,G,X,[c,l,c+1,l+1],x,{front:Z,sag:[0,-.75,0],cols:He.map(ae=>ht(x,.35+.65*ae))}),Y>fe&&U.push([(D[0]+G[0])/2,Y,(D[2]+G[2])/2])}}await n.yield()}return{F:R,SO:$,SL:a,B:s,heightAt:g,D:h,fmin:P,fmax:N,crest:U,yc:_*o}}function ft(n,e={}){return new i.ShaderMaterial({uniforms:{uTime:n.uTime,uPix:n.uPix,uFadeHalf:n.uFadeHalf,uSunDir:n.uSunDir,uHoney:n.uHoney,uUmber:n.uUmber,uPeach:n.uPeach,uLilac:n.uLilac,uHot:n.uHot,uEarth:n.uEarth,uMist:{value:e.mistUniform||new i.Vector4(0,4,0,0)},uStrength:{value:e.strength??1}},transparent:!0,depthWrite:!1,vertexShader:`
      attribute vec3 aPos; attribute vec4 aSeed; uniform vec4 uMist; varying vec2 vUv; varying float vA;
      ${he}
      void main(){
        float band = 1. - smoothstep(0.2, 1., abs(aSeed.w - uMist.x) / max(uMist.y, 0.1));
        float t = uTime * 0.35 + aSeed.y * 6.283;
        vec3 c = aPos + vec3(sin(t) * 0.8, aSeed.z * (0.6 + 0.4 * sin(t * 0.7 + 1.)), cos(t * 0.8) * 0.8);
        vec4 mv = viewMatrix * modelMatrix * vec4(c, 1.);
        float size = max(aSeed.x, 6. * uPix * abs(mv.z)) * (0.6 + 0.4 * band);
        mv.xy += position.xy * size; vUv = position.xy; vA = band * (0.5 + 0.5 * tbHash1(aSeed.y * 31.));
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      varying vec2 vUv; varying float vA; uniform float uStrength;
      ${he}
      void main(){
        float r = dot(vUv, vUv); float a = (1. - smoothstep(0.05, 1., r)); a *= a * vA * 0.11 * uStrength;
        gl_FragColor = vec4(mix(uPeach, vec3(1.), 0.72), a);
      }`})}function Ht(n){return new i.ShaderMaterial({uniforms:{uTime:n.uTime,uPix:n.uPix,uFadeHalf:n.uFadeHalf,uSunDir:n.uSunDir,uHoney:n.uHoney,uUmber:n.uUmber,uPeach:n.uPeach,uLilac:n.uLilac,uHot:n.uHot,uEarth:n.uEarth},transparent:!0,depthWrite:!1,depthTest:!0,side:i.DoubleSide,blending:i.CustomBlending,blendEquation:i.AddEquation,blendSrc:i.ZeroFactor,blendDst:i.SrcColorFactor,blendSrcAlpha:i.ZeroFactor,blendDstAlpha:i.OneFactor,vertexShader:`
      attribute vec3 aSt; varying vec3 vSt; varying vec3 vW;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vSt = aSt;
        vec4 mv = viewMatrix * wp; gl_Position = projectionMatrix * mv;
        float len = max(length(mv.xyz), 1e-3);
        vec4 p2 = projectionMatrix * vec4(mv.xyz * (1. - min(0.9 / len, 0.5)), 1.);
        gl_Position.z = p2.z / max(p2.w, 1e-4) * gl_Position.w;
      }`,fragmentShader:`
      varying vec3 vSt; varying vec3 vW;
      ${he}
      void main(){
        float t = vSt.y, s = abs(vSt.x);
        float wv = vSt.z > 0.5 ? sqrt(max(1. - t * t, 0.))                                         // a hill's: a mound, from its middle to its tip
          : mix(0.14, 1., smoothstep(0.06, 0.3, t)) * (1. - 0.8 * smoothstep(0.5, 1., t));         // a tree's: a thin trunk, then the crown, drawn out to a point
        float soft = 0.15 + 0.6 * t;                                                                  // its edge softer the further it falls
        float a = (1. - smoothstep(wv * (1. - soft), wv, s)) * (1. - smoothstep(0.75, 1., t)) * smoothstep(0., 0.02, t);
        a *= 1. - tbFade(length(vW - cameraPosition));
        gl_FragColor = vec4(mix(vec3(1.), vec3(0.58, 0.64, 0.84), (vSt.z > 0.5 ? 0.62 : 0.8) * a), 1.);
      }`})}async function zt(n,e,t){const{L:f,white:o,gores:y=[o,o,o],sunXY:u=[.9,.3]}=t,v=Math.round(f/6),x=24,_=(d,r)=>{const T=(d+.5)/x*Math.PI*2-Math.PI/2,L=.55+.57*Fe(-.55,.7,Math.cos(T)*u[0]+Math.sin(T)*u[1]);return{r:r.r*L,g:r.g*L,b:r.b*Q(1,L,.7)}},M=new Le,w=new De(!1),m=13,k=15,q=Ye[0],b=Ye[1],O=2,g=d=>{const r=d/f;return r<.55?10+3*Fe(0,.3,r):13-(12.2-Xe)*Math.pow((r-.55)/.45,1.6)},B=(d,r,T=0)=>{const L=d*6,E=r/x*Math.PI*2-Math.PI/2,R=g(L)-T+.12*Math.sin(d*7.7+r*3.1);return[R*Math.cos(E),R*Math.sin(E),L-f+.1*Math.sin(r*5.3+d)]};for(let d=0;d<=v;d++){const r=d%2===0||d===v,T=d===v,L=T?.45:r?1.15:.8;for(let E=0;E<x;E++){const R=B(d,E),$=B(d,E+1),a=B(d,E,L),s=B(d,E+1,L);M.stick2(R,$,T?.2:r?.15:.11,0),M.stick(a,s,T?.16:.085,0,[0,0,1]),M.stick(R,a,.06,1,[0,0,1])}await n.yield()}for(let d=0;d<x;d++){for(let r=0;r<v;r++){const T=B(r,d),L=B(r+1,d);M.stick2(T,L,.095,0);const E=B(r,d+1),R=B(r+1,d+1),$=[0,1,2].map(s=>(T[s]+E[s])/2*1.006),a=[0,1,2].map(s=>(L[s]+R[s])/2*1.006);if($[2]=(T[2]+E[2])/2,a[2]=(L[2]+R[2])/2,M.stick($,a,.05,1,[E[0]-T[0],E[1]-T[1],0]),(d<m||d>k)&&(r<q||r>=b)&&!(d>k&&d<x-2&&r>=O&&r<q)){const s=Math.floor(d/2),h=r<6?0:r<12?1:2,F=s%2?o:r>=v-3?y[2%y.length]:y[(s/2+2*h)%y.length];w.quad(T,E,R,L,[2*d,r,2*d+2,r+1],_(d,F))}}await n.yield()}return{F:M,S:w,R:g}}function dt(n){return new i.ShaderMaterial({uniforms:{uTime:n.uTime,uPix:n.uPix,uFadeHalf:n.uFadeHalf,uSunDir:n.uSunDir,uHoney:n.uHoney,uUmber:n.uUmber,uPeach:n.uPeach,uLilac:n.uLilac,uHot:n.uHot,uEarth:n.uEarth},side:i.BackSide,depthWrite:!1,depthTest:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",fragmentShader:`
      varying vec3 vD;
      ${he}
      void main(){
        vec3 d = vD / max(length(vD), 1e-4);
        vec3 c = tbDome(d);
        // the evening's cloud, painted on the dome: long thin bars lying across the sky above the far ranges, lit from under by
        // the hour on the sun's side and mauve away from it, thinning out overhead, drifting slowly (the dome carries no line)
        float dr = uTime * 0.003;
        float n = 0.6 * tbNoise(vec2(d.x * 3.2 + d.z * 1.1 + dr, d.y * 21.) + 11.) + 0.4 * tbNoise(vec2(d.z * 3.4 - d.x * 1.2 - dr, d.y * 29.) + 4.7);
        float cl = smoothstep(0.5, 0.74, n) * smoothstep(0.27, 0.38, d.y) * (1. - smoothstep(0.52, 0.85, d.y));
        vec3 cc = mix(uLilac * vec3(0.84, 0.76, 0.95), mix(uPeach, uHot, 0.65) * 1.06, 0.25 + 0.75 * smoothstep(-0.3, 0.9, dot(d, uSunDir)));
        c = mix(c, cc, 0.55 * cl);
        gl_FragColor = vec4(c, 1.);
      }`})}function mt(n,e,t,f,o){const y=e.length,u=new Float32Array(y*4),v=new Float32Array(y*4),x=new Float32Array(y*3),_=new Float32Array(y*3),M=new Float32Array(y*3),w=new Float32Array(y*2);e.forEach((r,T)=>{u.set([r.r,r.hp??r.h,r.th,r.rate],T*4),v.set([r.span,r.seed??(T*.618+f*.37)%1,r.free,r.climb],T*4),x.set([r.a.r,r.a.g,r.a.b],T*3),_.set([r.b.r,r.b.g,r.b.b],T*3),r.origin&&M.set(r.origin,T*3),r.hi>r.lo&&w.set([r.lo,r.hi],T*2)});const m=(r,T)=>(r.setAttribute("aHelix",new i.InstancedBufferAttribute(u,4)),r.setAttribute("aModel",new i.InstancedBufferAttribute(v,4)),r.setAttribute("aRange",new i.InstancedBufferAttribute(w,2)),o.origin&&r.setAttribute("aOrigin",new i.InstancedBufferAttribute(M,3)),T&&(r.setAttribute("aColA",new i.InstancedBufferAttribute(x,3)),r.setAttribute("aColB",new i.InstancedBufferAttribute(_,3))),r.instanceCount=y,r.boundingSphere=new i.Sphere(new i.Vector3(0,150,0),400),r),k=m(t.F.geometry(i.InstancedBufferGeometry),!1),q=m(t.S.geometry(i.InstancedBufferGeometry),!0),b=m(t.S.geometry(i.InstancedBufferGeometry),!0),O={helix:!0,origin:!!o.origin,col:o.col,law:o.law,hub:t.hub,skein:t.skein,bay:[1,1/9],lift:o.lift??.05,minPx:o.minPx},g=new i.Mesh(k,Te(n,O)),B=new i.Mesh(q,we(n,{...O,ink:o.ink,body:o.body??Pe})),d=new i.Mesh(b,we(n,{...O,scatter:!0,gain:o.gain,body:o.body??Pe}));B.material.uniforms.uBay.value.set(.67,.44),d.material.uniforms.uBay.value.set(.67,.44),B.renderOrder=1,d.renderOrder=2;for(const r of[g,B,d])r.frustumCulled=!1;return[g,B,d]}function _t(n,e,t,f,o={}){return mt(n,e,lt(t,f),t,{...o,col:o.col||new i.Vector4(0,300,.35,0)})}const vt=[["white","lemon","orange","red","blue","olive"],["red","white","red","white"],["lemon","blue","lemon","blue","white"]];async function Dt(n,e={}){const t=n.rng.fork?n.rng.fork("thermal"):n.rng,f=n.noise,o=e.palette||Ft,y=Ae(e.detail??n.quality?.detail??1,.6,1),u=St();u.uHoney.value.copy(re(J(o[0]))),u.uPeach.value.copy(re(J(o[1]))),u.uLilac.value.copy(re(J(o[2])));const v={white:J(nt.white),lemon:J(o[4]),orange:J(nt.orange),red:J(o[3]),blue:J(o[5]),olive:J(o[6])},x=e.dome??!0,_=new i.Group;_.name="thermal";const M=40,w=46,m=300,k=.35,q=new i.Vector4(w,m,k,0),b={radius:e.circleRadius??30,y0:e.circleY0??50,y1:e.circleY1??78},O=vt[e.colourway??(t.chance(.6)?0:t.chance(.5)?1:2)],g=e.cast??t.pick([[.6,.3,.1],[.3,.6,.1],[.4,.27,.33]]),B=Math.round(e.count??t.range(220,300)),d=2,r=t.range(.05,.068),T=Tt.length,L=e.airship!==!1,E=e.airship||{},R=E.heading??Math.PI-25*Math.PI/180,$=new i.Vector3(Math.sin(R),0,Math.cos(R)),a=new i.Vector3(...E.stern||[b.radius+19,b.y1+2,-51]),s=a.clone().addScaledVector($,T),h=[{r0:b.radius-7,r1:b.radius+8,y0:b.y0-9,y1:b.y1+9},{r0:b.radius+6,r1:b.radius+25,y0:b.y1-24,y1:b.y1+11}];if(L){let p=1e9;for(let A=0;A<=12;A++){const H=a.clone().addScaledVector($,T*A/12);p=Math.min(p,Math.hypot(H.x,H.z))}h.push({r0:p-17,r1:1e4,y0:a.y-23,y1:a.y+23})}const F=e.flown||null,P=[.73,.79,.6],N=2.1,U=9,l=(p,A,H,S,I)=>{if(!F)return!0;const W=P[p]*A+N,V=H*.95,z=H*1.05,ne=.06*A,le=H+.5*A<=22?Math.min(26,Math.max(S+ne-54,0)):U,ke=S-ne-le,ve=I+ne;for(const ce of F){const ue=Math.hypot(ce.x,ce.z),pe=Math.max(0,V-ue,ue-z),ye=Math.max(0,ke-ce.y,ce.y-ve);if(pe*pe+ye*ye<W*W)return!1}return!0},c=[[],[],[]];let D=0;const C=3,G=p=>(Math.exp(C*p)-1)/(Math.exp(C)-1),X=vt.indexOf(O);c[0].push({span:14,r:b.radius+2,h:64,th:0,rate:.3,climb:0,free:0,a:[v.orange,v.red,v.blue][X],b:[v.white,v.white,v.lemon][X]}),c[0].push({span:8,r:b.radius-9,h:58,th:2,rate:.4,climb:0,free:1,a:[v.lemon,v.white,v.lemon][X],b:[v.lemon,v.white,v.lemon][X]});for(let p=2;p<B;p++){const A=t(),H=A<g[0]?0:A<g[0]+g[1]?1:2,S=Math.pow(t(),1.1),I=2.6+11.4*S;let W=Q(9,57,Math.pow(S,.8))+t.gauss()*2.5;W=Ae(W,6,60-I*.3);const V=t();let z=w+(m-w)*G(V),ne=w+(m-w)*V,le=t.range(.25,.7);const ke=t.int(0,d-1),ve=t.gauss()*.16,ce=5+.45*I,ue=t.pick(O),pe=t.chance(.55)?t.pick(O):ue,ye=t.range(.92,1.08),Ge=h.filter(Me=>W+I*.5>Me.r0&&W-I*.5<Me.r1);let tt=0,at=0,Be=!Ge.length&&l(H,I,W,w,m);if(!Be){const Me=Math.min(m,...Ge.map(ee=>ee.y0)),Mt=Math.max(w,...Ge.map(ee=>ee.y1));z<Me-2&&l(H,I,W,z,z)&&(le=0,Be=!0);for(let ee=Mt;!Be&&ee<=m-80;ee+=4)l(H,I,W,ee,m)&&(tt=ee,at=m,z=ee+G(V)*(m-ee),ne=ee+V*(m-ee),Be=!0)}if(Be){const Me=ke*(Math.PI*2/d)+z*r+ve;c[H].push({span:I,r:W,h:z,hp:le?ne:z,th:Me,rate:ce/W*ye,climb:le,lo:tt,hi:at,free:-1,a:v[ue],b:v[pe]})}else D++;p%60===59&&await n.yield()}await n.yield();const ie=(p,A,H,S,I)=>{const W=Math.hypot(p,S);for(let V=0;V<3;V++)for(const z of c[V]){if(z.free>=0)continue;const ne=z.hi>z.lo,le=z.climb?ne?z.lo:w:z.h,ke=z.climb?ne?z.hi:m:z.h,ve=.06*z.span,ce=z.r+.5*z.span<=22?Math.min(26,Math.max(le+ve-54,0)):U,ue=P[V]*z.span+I,pe=Math.max(0,z.r*.95-W,W-z.r*1.05),ye=Math.max(0,le-ve-ce-H,A-ke-ve);if(pe*pe+ye*ye<ue*ue)return!1}return!0},Ee=[];for(let p=0;p<3;p++){const A=c[p];if(!A.length)continue;const S=lt(p,t);await n.yield();const[I,W,V]=mt(u,A,S,p,{col:q,law:C});for(const z of[I,W,V])z.frustumCulled=!1,_.add(z),Ee.push(z);await n.yield()}const Y=await Pt(n,t,f,{H:M,RX:45,RZ:t.range(46,54),olive:e.grass?J(e.grass):v.olive,lemon:v.lemon,crestAt:e.crestAt??t.range(.5,.62),sun:e.sun||[-.92,.19,-.34]}),Se=new i.Vector4(0,0,3,1),fe=new i.Vector4(0,6,0,0),He=new i.Mesh(await Y.F.geometryAsync(n),Te(u,{soft:!0})),Z=new i.Mesh(await Y.B.geometryAsync(n),st(u)),K=new i.Mesh(Y.SO.geometry(i.BufferGeometry,!0),we(u,{front:!0,frontUniform:new i.Vector4(Y.yc-3.5,Y.yc,2,.7),bay:[j,j],lift:.5,far:.5,body:Pe,lit:1,rib:.18,marks:.2,form:ct})),ae=Y.SL.geometry(i.BufferGeometry,!0),Ke=new i.Mesh(ae,we(u,{front:!0,frontUniform:Se,bay:[j,j],lift:.6,far:.5,body:Pe,lit:1,rib:.3,form:ct})),je=new i.Mesh(ae,we(u,{front:!0,frontUniform:Se,bay:[j,j],lift:.6,scatter:!0,milk:.03,gain:.8}));K.renderOrder=1,Ke.renderOrder=1,je.renderOrder=2,_.add(He,Z,K,Ke,je),await n.yield();const ze=Math.round(2500*y),Ze=new Float32Array(ze*3),$e=new Float32Array(ze*4),de=t.fork?t.fork("mist"):t;for(let p=0;p<ze;p++){const A=Y.crest[Math.floor(de()*Y.crest.length)%Y.crest.length],H=A[0]+de.range(-2.5,2.5),S=A[2]+de.range(-2.5,2.5);Ze.set([H,Y.heightAt(H,S)+.4,S],p*3),$e.set([de.range(1.8,4.2),de(),de.range(.2,2.2),H*Y.D[0]+S*Y.D[2]+de.range(-1,1)],p*4),p%150===149&&await n.yield()}const be=new i.InstancedBufferGeometry;be.setAttribute("position",new i.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),be.setIndex([0,1,2,0,2,3]),be.setAttribute("aPos",new i.InstancedBufferAttribute(Ze,3)),be.setAttribute("aSeed",new i.InstancedBufferAttribute($e,4)),be.instanceCount=ze;const Ce=new i.Mesh(be,ft(u,{mistUniform:fe,strength:.03}));Ce.frustumCulled=!1,Ce.renderOrder=3,_.add(Ce);const ge=new i.Group;ge.name="airship",ge.position.copy(s),ge.rotation.y=R;let Ie=null;if(L){const p=[...new Set(O.filter(z=>z!=="white"&&z!=="olive"))],A=p.map(z=>v[z]),H=e.sun||[-.92,.19,-.34],S=await zt(n,t,{L:T,white:v.lemon.clone().lerp(new i.Color(1,1,1),.62),gores:A,sunXY:[H[0]*Math.cos(R)-H[2]*Math.sin(R),H[1]]});Ie=S.R;const I=new i.Mesh(await S.F.geometryAsync(n),Te(u)),W=S.S.geometry(),V=new i.Mesh(W,we(u,{bay:[1.7,6],lift:.45,body:Pe,far:.4,tunnel:Math.round(T/6),bare:Ye,marks:.45}));V.renderOrder=1,ge.add(I,V),_.add(ge),await n.yield()}let _e=null;x&&(_e=new i.Mesh(new i.SphereGeometry(1,24,12),dt(u)),_e.frustumCulled=!1,_e.renderOrder=-.5,_.add(_e));const pt=e.bare??t.range(.22,.5),Je=Y.fmax-Y.fmin,Oe=e.dethermalise??t.chance(.12);let Qe=!1,Re=[!1,!1,!1],se=[1.5708,1.5708,1.5708];function We(p,A){const H=Q(Y.fmin+.14*Je,Y.fmin+(1-pt)*Je,p);Se.set(H-9,H,2.5,1),fe.set(H-6.5,7.5,0,0),u.uPop.value.set(Oe?Q(m+12,w-30,A):1e4,Oe?1:0)}We(0,0);const Ve=new i.Matrix4,xe=new i.Vector3,me=new i.Vector3,Ne=new i.Vector3,Ue=new i.Vector3;function yt(p,A,H,S=0,I=1){Re[p]=!0,_.updateMatrixWorld(),Ve.copy(_.matrixWorld).invert(),et(p,Ue.copy(A).applyMatrix4(Ve),xe.copy(H).transformDirection(Ve),S,I)}function et(p,A,H,S,I){xe.copy(H).normalize(),me.set(0,1,0).cross(xe),me.lengthSq()<1e-6&&me.set(1,0,0),me.normalize(),Ne.crossVectors(xe,me).normalize();const W=Math.cos(S),V=Math.sin(S),z=me.clone().multiplyScalar(W).addScaledVector(Ne,-V),ne=Ne.clone().multiplyScalar(W).addScaledVector(me,V);u.uFree.value[p].makeBasis(z,ne,xe).setPosition(A),p===0?u.uFreeWind.value.x=I:u.uFreeWind.value.y=I}function wt(p,A,H=1){Re[p]=!0,u.uFree.value[p].copy(A),u.uFreeWind.value.setComponent(p,H)}const oe=(p,A,H)=>new i.Vector3(p,A,H),bt={axis:oe(0,0,0),crest:oe(0,M,0),columnBottom:w,columnTop:m,columnRadius:60,circle:{center:oe(0,0,0),radius:b.radius,y0:b.y0,y1:b.y1},portalSeat:L?{position:s.clone(),facing:$.clone().negate(),travel:$.clone(),radius:Xe}:null,airship:L?{stern:a.clone(),nose:s.clone(),dir:$.clone(),length:T,radius:13}:null,viewpoints:{entry:{from:oe(0,7,230),at:oe(0,120,0)},image:{from:oe(-b.radius*.7,Q(b.y0,b.y1,.55),b.radius*.7),at:oe(-4,190,-3)},crest:{from:oe(b.radius,b.y0+2,6),at:oe(0,M-4,0)}},axisLook:oe(0,Q(b.y0,b.y1,.6)+60,0)};function gt(p,A,H){if(Bt(u,A,H,n.renderer),!Qe){const S=.5-.5*Math.cos(A*.09);We(S,S)}for(let S=0;S<2;S++)if(!Re[S]){const I=S===0?b.radius+14:b.radius-10,W=S===0?b.y1+12:b.y0+4,V=A*(S===0?.2:.3)+S*2.4;et(S,Ue.set(I*Math.sin(V),W,I*Math.cos(V)),xe.set(Math.cos(V),0,-Math.sin(V)),k,S===0?1:A*.05%1)}for(let S=0;S<3;S++){const I=u.uFreeWind.value.getComponent(S);if(se[S]=(se[S]+Math.min(p,.1)*6.2832*Q(1.4,0,Fe(.45,.8,I)))%6283.2,I>.72){const W=Math.round((se[S]-1.5708)/Math.PI)*Math.PI+1.5708;se[S]+=(W-se[S])*(1-Math.exp(-4*Math.min(p,.1)))}}u.uFreeSpin.value.set(se[0],se[1],se[2]),ge.rotation.y=R+.008*Math.sin(A*.17)}const qe={r:62,h:m,c:new i.Vector3(0,95,0)},xt={fadeHalf:kt.fadeHalf,uniforms:u,balsa:p=>Te(u,p),lining:()=>st(u),tissue:p=>we(u,p),mist:p=>ft(u,p),shade:()=>Ht(u),dome:()=>dt(u),flock:(p,A,H,S)=>_t(u,p,A,H,S)};return{object:_,radius:qe.r,height:qe.h,center:qe.c,anchors:bt,update:gt,setProgress(p,A=0){Qe=!0,We(Ae(p,0,1),Ae(A,0,1))},setFree:yt,setFreeMatrix:wt,colourway:X,hill:Y,style:xt,rare:Oe,unbuilt:D,heightAt:Y.heightAt,columnClear:ie,hullInner:p=>Ie?Ie(Ae(p,0,T))-1.35:1e6,post:{flat:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},dispose(){},ground:!1,groundY:0}}export{Tt as AIRSHIP,ot as BALSA,Ye as BARE,Pe as BODY,ct as FORM,At as LINE_UNDER,Ft as PALETTE,kt as STYLE,he as STYLE_GLSL,De as Skins,Le as Sticks,nt as TISSUE,Te as balsaMaterial,_t as buildFlock,Dt as buildHero,dt as domeMaterial,st as liningMaterial,ut as liningShade,ft as mistMaterial,Ht as shadeMaterial,ht as shadeTint,Bt as styleUpdate,we as tissueMaterial};
