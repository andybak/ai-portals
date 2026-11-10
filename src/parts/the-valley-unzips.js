import*as t from"three";import{mergeGeometries as $e}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as $,lerp as de,smoothstep as ee}from"../kit/core.js";const dt=["#27406B","#9DB4D0","#E6DDC8","#D9822B","#C9A24A","#C2372D","#BFD0E4"],Ee=`
uniform float uTime; uniform float uBreeze; uniform float uSliderZ; uniform float uCurl;
// half-width of the opening at course position z: 0 ahead of the slider, 0.3 m a metre behind it, 150 m at most
float zipOpen(float z){ float d = max(uSliderZ + 15.0 - z, 0.0); return min(0.3 * d * smoothstep(0.0, 20.0, d) + 12.0 * smoothstep(0.0, 55.0, d), 150.0); }
// nominal radius of the full-grown breaker for an opening w: under 2.5 m while it is still inside the slider (w < 30),
// then the edge springs up as the cloth leaves the slider's rear and goes on growing
float zipRoll(float w){ return 1.2 + 1.3 * smoothstep(8.0, 24.0, w) + 7.0 * smoothstep(29.0, 40.0, w) + 2.6 * smoothstep(31.0, 44.0, w) * (1.0 - smoothstep(58.0, 80.0, w)) + 8.0 * smoothstep(45.0, 150.0, w); }
// its section: the young curl stands up, taller than wide; the old one has slumped, wider than tall
float zipWide(float w){ return mix(0.85, 1.3, smoothstep(45.0, 100.0, w)); }
// where the parted tape (and its teeth) lies: centre line |x| for an opening w, at the zip-side foot of the breaker
float zipTape(float w){ return max(2.75, w - 3.5 - 1.25 * zipWide(w) * zipRoll(w)); }
float dnHash(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float dnNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(dnHash(i), dnHash(i + vec2(1., 0.)), f.x), mix(dnHash(i + vec2(0., 1.)), dnHash(i + vec2(1., 1.)), f.x), f.y); }
// slow sag-and-billow of the hills, in metres per unit amplitude (about -1..1); p = world xz
float denimBillow(vec2 p, float t){
  float a = sin(p.x * 0.0131 + t * 0.33 + 1.7 * sin(p.y * 0.0071 - t * 0.19));
  float b = sin(p.y * 0.0173 - t * 0.27 + 1.3 * sin(p.x * 0.0093 + t * 0.15));
  return (a * b * 0.75 + 0.25 * sin(p.x * 0.041 + p.y * 0.033 + t * 0.9)) * uBreeze;
}
`,st=`
uniform vec3 cRaw, cIndigo, cFade, cEcru, cWrong;
float gStreak = 1.0;                                     // a material sets it 0 before denimColor() to leave the fade streaks out (straps)
vec3 wearRamp(float w){
  vec3 c = mix(cRaw, cIndigo, smoothstep(0.0, 0.34, w));
  c = mix(c, cFade, smoothstep(0.34, 0.80, w));
  return mix(c, mix(cFade, cEcru, 0.72), smoothstep(0.80, 1.0, w));
}
vec3 dnTone(float f, float af){                           // the five flat tones of the cloth, hard-edged
  vec3 c = mix(cRaw, cIndigo, smoothstep(0.17 - af, 0.17 + af, f));
  c = mix(c, mix(cIndigo, cFade, 0.52), smoothstep(0.41 - af, 0.41 + af, f));
  c = mix(c, cFade, smoothstep(0.62 - af, 0.62 + af, f));
  return mix(c, mix(cFade, cEcru, 0.72), smoothstep(0.86 - af, 0.86 + af, f));
}
vec3 denimColor(vec2 uv, float wear, bool front){
  // POLISH 3: the cloth is drawn in the metal's hand. Five flat tones (raw, indigo, mid, fade, rubbed), cut into hard-edged
  // shapes that lie along the grain; the twill rib is a thin crisp line 11 degrees off the grain; nothing soft anywhere.
  float ribC = (uv.x + 0.2 * uv.y) / 2.4;                // 2.4 m twill rib (12 m along the travel: under 2.4 crossings a second)
  float fw = fwidth(ribC) + 1e-5;                        // ribs per pixel
  float tri = abs(fract(ribC) - 0.5) * 2.0;
  float ribLine = 1.0 - smoothstep(0.26 - 2.0 * fw, 0.26 + 2.0 * fw, tri);
  float vis = 1.0 - smoothstep(0.07, 0.15, fw);          // dissolved where a rib is under about 7 px
  float mpp = fwidth(uv.x) + fwidth(uv.y);               // metres per pixel
  float nearK = 1.0 - smoothstep(0.09, 0.30, mpp);       // yarn level, only close to the lens
  float peepK = 1.0 - smoothstep(0.035, 0.11, mpp);      // single yarns: only where a cord is three pixels and more (within about 20 m)
  float yarn = dnNoise(vec2(uv.x * 3.6 + 2.0 * dnNoise(uv * 0.4), uv.y * 0.62));   // short strokes: weft showing between the warp cords
  float ay = clamp(fwidth(yarn), 1e-4, 0.2);
  float peep = smoothstep(0.62 - ay, 0.62 + ay, yarn) * peepK;     // ecru weft peeping between the cords, each a hard fleck
  vec2 nc = floor(uv / 3.1); vec2 np = (nc + 0.2 + 0.6 * vec2(dnHash(nc), dnHash(nc + 7.3))) * 3.1;
  float nep = (1.0 - smoothstep(0.17, 0.17 + mpp + 1e-4, length(uv - np))) * step(0.72, dnHash(nc + 3.1)) * nearK;
  if (!front) {                                          // the wrong side: ONE flat pale tone, weft-faced: a rib of fine lines, nothing soft
    float rc = uv.x / 1.6; float fb = fwidth(rc) + 1e-5;
    float line = 1.0 - smoothstep(0.15 - fb, 0.15 + fb, abs(fract(rc) - 0.5));
    float rv = 1.0 - smoothstep(0.16, 0.34, fb);         // under about 4 px a rib the lines melt into their mean
    vec3 c = mix(cWrong, cFade, 0.44 * mix(0.30, line, rv));
    return mix(c, cIndigo, peep * 0.35);
  }
  // the grain field: long slivers ten and more times longer than wide (broad far off, a metre or two wide within 100 m,
  // single cords in the nearest strip). It only moves the tone borders, so every edge it makes is a hard one.
  float nearS = 1.0 - smoothstep(0.22, 0.60, mpp);
  float gA = dnNoise(vec2(uv.x * 0.11, uv.y * 0.0065) + 31.0) - 0.5;
  float gB = dnNoise(vec2(uv.x * 0.47, uv.y * 0.011) + 31.0) - 0.5;
  float gC = dnNoise(vec2(uv.x * 1.3, uv.y * 0.05) + 5.0) - 0.5;
  float f = wear + (gA * 0.34 * (1.0 - 0.45 * nearS) + gB * 0.26 * nearS) * (0.35 + 0.65 * gStreak) + gC * 0.22 * nearK;
  float af = clamp(fwidth(f), 1e-4, 0.05);
  vec3 c = dnTone(f, af);
  // slubs: thick places in single yarns, short hard flecks one tone paler (a few one tone darker) lying along the grain
  vec2 sc = vec2(uv.x / 2.9, uv.y / 26.0); vec2 si = floor(sc); float sh = dnHash(si + 11.0);
  vec2 sf = fract(sc) - vec2(0.2 + 0.6 * dnHash(si + 3.7), 0.5); float sl = 0.10 + 0.26 * dnHash(si + 5.1);
  float fleck = (1.0 - smoothstep(0.10, 0.10 + mpp / 2.9 + 1e-4, abs(sf.x))) * (1.0 - smoothstep(sl, sl + mpp / 26.0 + 1e-4, abs(sf.y)))
    * (1.0 - smoothstep(0.40, 0.85, mpp)) * gStreak;
  c = mix(c, dnTone(f + (sh > 0.5 ? 0.23 : -0.23), af), fleck * step(0.3, abs(sh - 0.5) * 2.0));
  c = mix(c, cRaw, 0.30 * ribLine * vis * (1.0 - 0.5 * step(f, 0.17)));      // the rib: a thin dark line, clear within about 60 m
  c = mix(c, cEcru, max(peep * 0.7, nep));
  return c;
}
`;function pt(r,v={}){const a=v.palette||dt,g=h=>new t.Color(h),k={indigo:g(a[0]),fade:g(a[1]),ecru:g(a[2]),orange:g(a[3]),brass:g(a[4]),red:g(a[5]),chambray:g(a[6]),raw:g("#1B2B4A"),wrong:g("#C9D3E0"),brassPolish:g("#E9D69A"),copper:g("#B8693E"),copperPolish:g("#D99A6C"),white:g("#F3EFE4"),orangeDark:g("#B5631C"),redDeep:g("#A92C25")},y={uTime:{value:0},uBreeze:{value:v.breeze??1},uSliderZ:{value:330},uCurl:{value:1},uRight:{value:new t.Vector3(-1,.28,.12).normalize()},uHop:{value:new t.Vector2(1e6,0)}},te=()=>({uTime:y.uTime,uBreeze:y.uBreeze,uCurl:y.uCurl,cRaw:{value:k.raw},cIndigo:{value:k.indigo},cFade:{value:k.fade},cEcru:{value:k.ecru},cWrong:{value:k.wrong},uSliderZ:y.uSliderZ,uHop:y.uHop});function ge(h={}){return new t.ShaderMaterial({uniforms:{...te(),uBillow:{value:h.billow??1.5},uGrain:{value:h.grainScale??1}},side:h.twoSided?t.DoubleSide:t.FrontSide,vertexShader:Ee+`
        attribute float aWear; uniform float uBillow; uniform float uGrain; varying vec2 vUv; varying float vWear;
        void main(){ vUv = uv * uGrain; vWear = aWear;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          wp.y += uBillow * denimBillow(wp.xz, uTime);
          gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:Ee+st+`
        varying vec2 vUv; varying float vWear;
        void main(){ gl_FragColor = vec4(denimColor(vUv, vWear, gl_FrontFacing), 1.0); }`})}const xe={};function Z(h="brass",d={}){const M=h==="copper"?k.copper:k.brass,R=h==="copper"?k.copperPolish:k.brassPolish,H=xe[h]=xe[h]||new t.Color;return H.copy(M).offsetHSL(-.012,.02,-.17),new t.ShaderMaterial({uniforms:{cMetal:{value:M},cPolish:{value:R},cShade:{value:H},uRight:y.uRight,...d.uniforms||{}},defines:d.vertexShader?{}:{SCRATCH:1},vertexShader:d.vertexShader||`
        attribute float aEdge; varying float vEdge; varying vec3 vN; varying vec3 vP;
        void main(){ vEdge = aEdge; vP = position;
          #ifdef USE_INSTANCING
            mat4 mm = modelMatrix * instanceMatrix;
          #else
            mat4 mm = modelMatrix;
          #endif
          vN = mat3(mm) * normal;
          gl_Position = projectionMatrix * viewMatrix * mm * vec4(position, 1.0); }`,fragmentShader:`
        uniform vec3 cMetal, cPolish, cShade, uRight; varying float vEdge; varying vec3 vN;
        #ifdef SCRATCH
          varying vec3 vP;
          float mH(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
          float mN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
            return mix(mix(mH(i), mH(i + vec2(1., 0.)), f.x), mix(mH(i + vec2(0., 1.)), mH(i + vec2(1., 1.)), f.x), f.y); }
        #endif
        void main(){ vec3 n = vN / max(length(vN), 1e-4);
          float rt = dot(n, uRight), up = step(0.5, n.y);
          float lit = max(step(-0.05, rt), up);
          // three flat tones by the way a face is turned: tops plain metal, walls half tarnished, walls turned from the afternoon and undersides full
          float dark = max((1.0 - up) * mix(0.5, 1.0, step(rt, -0.22)), step(n.y, -0.35)) * (1.0 - step(0.5, vEdge));
          float p = step(0.5, vEdge) * lit;      // the polish is an edge, and only where it turns to the afternoon
          #ifdef SCRATCH
            // wear, in the same two tones: long handling scratches and a few rubbed streaks, only on faces the polish may touch
            vec2 sp = abs(n.y) > 0.6 ? vP.zx : (abs(n.x) > abs(n.z) ? vP.zy : vP.xy);
            float aa = fwidth(sp.x) + fwidth(sp.y);
            float sc = step(0.84, mN(vec2(sp.x * 0.045 + 2.0 * mN(sp * 0.04), sp.y * 0.85 + 0.7 * mN(sp * 0.11)))) * step(0.40, mN(sp * 0.06 + 5.0));
            float nick = step(0.9, mN(sp * 0.9 + 17.0)) * step(0.68, mN(sp * 0.13 + 2.0));
            p = max(p, max(sc * (1.0 - smoothstep(1.0, 2.4, aa)), nick * (1.0 - smoothstep(0.45, 1.1, aa))) * lit);
          #endif
          gl_FragColor = vec4(mix(mix(cMetal, cShade, dark), cPolish, p), 1.0); }`})}function oe(h,d={}){const M=h||k.white;return new t.ShaderMaterial({uniforms:{...te(),cA:{value:M},cB:{value:d.dark||M.clone().multiplyScalar(.8)},uPly:{value:d.ply?1:0},uSway:{value:d.sway??0},uBillow:{value:d.billow??0}},side:d.twoSided?t.DoubleSide:t.FrontSide,vertexShader:Ee+`
        attribute float aSway; uniform float uSway; uniform float uBillow; varying vec2 vUv;
        void main(){ vUv = uv;
          #ifdef USE_INSTANCING
            vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
          #else
            vec4 wp = modelMatrix * vec4(position, 1.0);
          #endif
          wp.y += uBillow * denimBillow(wp.xz, uTime);         // billow: ride the cloth it is sewn to
          float k = aSway * uSway * uBreeze;                 // aSway: 0 at the held end .. 1 at the loose end
          wp.x += k * (0.6 + sin(uTime * 1.3 + wp.z * 0.11 + wp.y * 0.07));
          wp.z += k * 0.6 * sin(uTime * 0.9 + wp.x * 0.09);
          gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
        uniform vec3 cA, cB; uniform float uPly; varying vec2 vUv;
        void main(){ float t = vUv.x / 0.9 + vUv.y * 0.9; float fw = fwidth(t);
          float tri = abs(fract(t) - 0.5) * 2.0;
          float ply = smoothstep(0.72 - fw, 0.72 + fw, tri) * (1.0 - smoothstep(0.15, 0.35, fw)) * uPly;
          gl_FragColor = vec4(mix(cA, cB, ply), 1.0); }`})}function _e(){return new t.ShaderMaterial({uniforms:{...te(),cRed:{value:k.red},cDeep:{value:k.redDeep},cDot:{value:k.white},uTick:{value:0},uPrint:{value:0}},vertexShader:`varying vec3 vW;
        void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:Ee+`
        uniform vec3 cRed, cDeep, cDot; uniform float uTick; uniform float uPrint; varying vec3 vW;
        void main(){ vec2 p = vW.xz;
          float row = floor(p.y / 15.0); vec2 q = vec2(p.x + 15.0 * mod(row, 2.0), p.y);
          vec2 c = (floor(q / vec2(30.0, 15.0)) + 0.5) * vec2(30.0, 15.0);
          float d = length(q - c); float aa = 0.7 * (fwidth(p.x) + fwidth(p.y)) + 1e-4;
          float dotm = 1.0 - smoothstep(2.5 - aa, 2.5 + aa, d);
          // the print: four small pips round every dot (a sprig), gone where they are under a pixel
          dotm = max(dotm, (1.0 - smoothstep(0.85 - aa, 0.85 + aa, length(abs(q - c) - vec2(4.4)))) * (1.0 - smoothstep(0.5, 1.1, aa)));
          { float pm = uPrint * (1.0 - uTick) * step(404.0, p.y); float thinK = 1.0 - smoothstep(0.6, 1.6, aa);
            vec2 mq = vec2(p.x, mod(p.y - 380.0, 124.0) - 62.0); float r = length(mq);
            float an = atan(mq.y, mq.x + 1e-3 * step(abs(mq.x) + abs(mq.y), 1e-3));
            float sp = abs(fract(an * 14.0 / 6.2832) - 0.5) * 6.2832 / 14.0 * max(r, 1.0);
            float sp2 = abs(fract(an * 30.0 / 6.2832) - 0.5) * 6.2832 / 30.0 * max(r, 1.0);
            float med = max(1.0 - smoothstep(0.8, 0.8 + aa, abs(r - 27.0)), (1.0 - smoothstep(0.5, 0.5 + aa, abs(r - 10.0))) * thinK);
            med = max(med, 1.0 - smoothstep(1.9, 1.9 + aa, length(vec2(sp, r - 18.5))));
            med = max(med, 1.0 - smoothstep(1.1, 1.1 + aa, length(vec2(sp2, r - 32.5))));
            float bx = abs(p.x);
            float brd = max(1.0 - smoothstep(0.7, 0.7 + aa, abs(bx - 58.0)), (1.0 - smoothstep(0.35, 0.35 + aa, abs(bx - 62.0))) * thinK);
            brd = max(brd, 1.0 - smoothstep(1.6, 1.6 + aa, length(vec2(bx - 67.5, mod(p.y, 12.0) - 6.0))));
            float clear = max(step(r, 36.0), step(54.0, bx) * step(bx, 72.0));
            dotm = mix(dotm, max(med, brd), pm * max(clear, max(med, brd))); }
          float w = zipOpen(p.y); float inside = w - abs(p.x);          // metres inside the edge
          float band = smoothstep(-2.0, 6.0, inside) * (1.0 - smoothstep(16.0, 34.0, inside)) * step(1.0, w);
          float ph = inside * 0.26 + uTime * 1.2 + 2.5 * dnNoise(p * 0.035); float fp = fwidth(ph);
          float crease = (1.0 - smoothstep(0.16, 0.16 + 2.0 * fp + 0.02, abs(fract(ph) - 0.5) * 2.4)) * band * (1.0 - smoothstep(0.25, 0.6, fp));
          // the cloth itself: fine warp lines along the zip (never across the travel), long pressed folds, short broken wrinkles
          float wq = p.x / 1.15 + 0.35 * dnNoise(vec2(p.x * 0.9, p.y * 0.03)); float wf = fwidth(wq) + 1e-4;
          float warp = (1.0 - smoothstep(0.10, 0.10 + wf, abs(fract(wq) - 0.5))) * (1.0 - smoothstep(0.12, 0.3, wf));
          float fq = (p.x * 0.94 + p.y * 0.21) / 37.0 + 0.5 * dnNoise(p * 0.013); float ff = fwidth(fq) + 1e-5;
          float fid = floor(fq); float foldL = (1.0 - smoothstep(0.011, 0.011 + ff, abs(fract(fq) - 0.5))) * step(0.3, dnHash(vec2(fid, 3.0))) * (1.0 - smoothstep(0.02, 0.06, ff));
          float gq = (p.x * 0.5 - p.y * 0.86) / 19.0 + 0.9 * dnNoise(p * 0.021 + 7.0); float gf = fwidth(gq) + 1e-5;
          float wr = (1.0 - smoothstep(0.014, 0.014 + gf, abs(fract(gq) - 0.5))) * step(0.62, dnNoise(p * 0.045 + 3.0)) * (1.0 - smoothstep(0.03, 0.08, gf));
          vec3 col = mix(cRed, cDeep, max(max(crease, 0.45 * warp), max(foldL, wr)));
          // ticking (uTick 1): pairs of narrow stripes lying along the zip every 12 m, instead of the dots
          float tx = abs(abs(mod(p.x + 6.0, 12.0) - 6.0) - 1.6); float ta = fwidth(p.x) + 1e-4;
          float tick = (1.0 - smoothstep(0.55 - ta, 0.55 + ta, tx)) * (1.0 - smoothstep(0.5, 1.6, ta));
          gl_FragColor = vec4(mix(col, cDot, mix(dotm, tick, uTick)), 1.0); }`})}let ae=null;function L(){if(ae)return ae;const h=r.rng.fork?r.rng.fork("denim-sky"):r.rng,d=[];for(let R=0;R<10;R++){const H=R<8?-1.9+R*.54+h.range(-.12,.12):2.6+(R-8)*1.1;d.push(new t.Vector4(H,(R%2?.4:.235)+h.range(-.045,.045),h.range(.19,.33),h.range(.02,.033)))}const M=new t.ShaderMaterial({uniforms:{uTime:y.uTime,uBreeze:y.uBreeze,uSliderZ:y.uSliderZ,uCurl:y.uCurl,cSky:{value:k.chambray},cSlub:{value:k.ecru},uSlub:{value:d}},side:t.BackSide,depthWrite:!1,depthTest:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:Ee+`
        uniform vec3 cSky, cSlub; uniform vec4 uSlub[10]; varying vec3 vD;
        void main(){ vec3 d = vD / max(length(vD), 1e-4);
          float az = atan(d.x, d.z + sign(d.z + 1e-6) * 1e-5 + 1e-6); float el = asin(clamp(d.y, -1.0, 1.0));
          vec2 g = d.xz / max(d.y, 0.2) * 34.0; vec2 fg = fwidth(g); float fe = fwidth(el) + 1e-5;
          float zen = smoothstep(0.866, 0.97, d.y) * (1.0 - smoothstep(0.2, 0.5, max(fg.x, fg.y)));
          float weave = (step(0.5, fract(g.x)) - 0.5) * (step(0.5, fract(g.y)) - 0.5) * 4.0 * zen;
          float drift = uTime * 0.001745;
          // the cloth of the sky: thin level weft streaks, each a few degrees long and a quarter of a degree thick
          float fine = smoothstep(0.66, 0.70, dnNoise(vec2((az + drift) * 9.0, el * 110.0))) * (1.0 - smoothstep(0.002, 0.006, fe)) * (1.0 - smoothstep(0.8, 1.2, el));
          float s = 0.0;
          for (int i = 0; i < 10; i++) { vec4 q = uSlub[i];
            float da = mod(az - q.x + drift + 3.14159265, 6.2831853) - 3.14159265;
            float x = da / q.z; float y = (el - q.y) / q.w;
            float body = max(1.0 - x * x, 0.0) * (0.82 + 0.18 * sin(da * 23.0 + q.x * 7.0));      // a thick place in the yarn: a level spindle
            s = max(s, 1.0 - smoothstep(0.80, 1.0, y * y / max(body * body, 1e-3) + step(body, 0.0) * 4.0)); }
          vec3 col = mix(cSky * (1.0 + 0.012 * weave), cSlub, 0.22 * fine);
          gl_FragColor = vec4(mix(col, cSlub, s), 1.0); }`});return ae=new t.Mesh(new t.SphereGeometry(2600,48,24),M),ae.renderOrder=-.5,ae.frustumCulled=!1,ae}function Ze(h,d,M,R=.6,H={}){const Y=[],X=[],ie=[],B=(c,x,S,F,C)=>{const P=x[0]-c[0],V=x[1]-c[1],O=x[2]-c[2],se=S[0]-c[0],J=S[1]-c[1],I=S[2]-c[2];let A=V*I-O*J,G=O*se-P*I,E=P*J-V*se;const he=F?A*F[0]+G*F[1]+E*F[2]<0:!1,fe=Math.hypot(A,G,E)||1;A/=fe,G/=fe,E/=fe,he&&(A=-A,G=-G,E=-E);const Se=he?[c,S,x]:[c,x,S];for(const Me of Se)Y.push(Me[0],Me[1],Me[2]),X.push(A,G,E),ie.push(C)},D=c=>{let x=0;for(let S=0;S<c.length;S++){const F=c[S],C=c[(S+1)%c.length];x+=F[0]*C[1]-C[0]*F[1]}return x},u=[h,...H.holes||[]].map((c,x)=>{const S=(D(c)>0?1:-1)*(x===0?1:-1),F=c.length,C=[],P=[];for(let V=0;V<F;V++){const O=c[V],se=c[(V+F-1)%F],J=c[(V+1)%F];let I=O[1]-se[1],A=-(O[0]-se[0]),G=J[1]-O[1],E=-(J[0]-O[0]);const he=Math.hypot(I,A)||1,fe=Math.hypot(G,E)||1;I*=S/he,A*=S/he,G*=S/fe,E*=S/fe;const Se=R/Math.max(.35,1+I*G+A*E);C.push([G,E]),P.push([O[0]-(I+G)*Se,O[1]-(A+E)*Se])}return{r:c,out:C,ins:P}}),z=Math.min(R,(M-d)*.45);for(const{r:c,out:x,ins:S}of u){const F=c.length;for(let C=0;C<F;C++){const P=(C+1)%F,V=c[C],O=c[P],se=S[C],J=S[P],I=[x[C][0],0,x[C][1]],A=[V[0],d+z,V[1]],G=[O[0],d+z,O[1]],E=[O[0],M-z,O[1]],he=[V[0],M-z,V[1]],fe=H.edgeWalls?1:0;B(A,G,E,I,fe),B(A,E,he,I,fe);const Se=[se[0],M,se[1]],Me=[J[0],M,J[1]],Le=[I[0],1,I[2]];B(he,E,Me,Le,1),B(he,Me,Se,Le,1);const ue=[se[0],d,se[1]],Ue=[J[0],d,J[1]],ze=[I[0],-1,I[2]];B(A,G,Ue,ze,1),B(A,Ue,ue,ze,1)}}const T=u[0].ins.map(c=>new t.Vector2(c[0],c[1])),re=u.slice(1).map(c=>c.ins.map(x=>new t.Vector2(x[0],x[1]))),qe=T.concat(...re),le=t.ShapeUtils.triangulateShape(T,re);for(const c of le){const x=qe[c[0]],S=qe[c[1]],F=qe[c[2]];B([x.x,M,x.y],[S.x,M,S.y],[F.x,M,F.y],[0,1,0],0),B([x.x,d,x.y],[S.x,d,S.y],[F.x,d,F.y],[0,-1,0],0)}const U=new t.BufferGeometry;return U.setAttribute("position",new t.Float32BufferAttribute(Y,3)),U.setAttribute("normal",new t.Float32BufferAttribute(X,3)),U.setAttribute("aEdge",new t.Float32BufferAttribute(ie,1)),U}function We(h=7,d=.9,M=.45){const Y=[],X=[],ie=[];for(let D=0;D<=10;D++){const u=D/10,z=(u-.5)*h,T=Math.min(u,1-u)*h,re=1-ee(0,.9,T),qe=d*(.55+.45*ee(0,.7,T));for(let le=0;le<=4;le++){const U=le/4*Math.PI;Y.push(-Math.cos(U)*qe*.5,Math.sin(U)*M-re*.7-.05,z),X.push(u*h,le/4)}}for(let D=0;D<10;D++)for(let u=0;u<4;u++){const z=D*5+u,T=z+4+1;ie.push(z,T,z+1,z+1,T,T+1)}const B=new t.BufferGeometry;return B.setAttribute("position",new t.Float32BufferAttribute(Y,3)),B.setAttribute("uv",new t.Float32BufferAttribute(X,2)),B.setAttribute("aSway",new t.Float32BufferAttribute(new Float32Array(Y.length/3),1)),B.setIndex(ie),B}const Pe=new t.Vector3;function be(h,d,M){y.uTime.value=d,ae&&M&&(Pe.setFromMatrixPosition(M.matrixWorld),ae.position.copy(Pe))}function Re(h){const d=h.attributes.position,M=h.attributes.normal,R=d.count,H=new Map,Y=new Float32Array(R*3),X=d.array,ie=M.array,B=new Float64Array(R);for(let u=0;u<R;u++){const z=(Math.round(X[u*3]*50)+2e4)*16e8+(Math.round(X[u*3+1]*50)+2e4)*4e4+(Math.round(X[u*3+2]*50)+2e4);B[u]=z;let T=H.get(z);T||(T=[0,0,0],H.set(z,T)),T[0]+=ie[u*3],T[1]+=ie[u*3+1],T[2]+=ie[u*3+2]}for(let u=0;u<R;u++){const z=H.get(B[u]),T=Math.hypot(z[0],z[1],z[2])||1;Y[u*3]=z[0]/T,Y[u*3+1]=z[1]/T,Y[u*3+2]=z[2]/T}const D=new t.BufferGeometry;return D.setAttribute("position",d),D.setAttribute("aOut",new t.BufferAttribute(Y,3)),h.index&&D.setIndex(h.index),D.boundingSphere=h.boundingSphere,D}let ye=null;function pe(){return ye||(ye=new t.ShaderMaterial({uniforms:{cLine:{value:k.brass.clone().offsetHSL(-.02,0,-.36)}},side:t.BackSide,vertexShader:`
        attribute vec3 aOut;
        void main(){ vec4 wp = modelMatrix * vec4(position, 1.0);
          vec3 wn = mat3(modelMatrix) * aOut; wn = wn / max(length(wn), 1e-4);
          wp.xyz += wn * clamp(distance(wp.xyz, cameraPosition) * 0.0042, 0.35, 2.6);
          gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:"uniform vec3 cLine; void main(){ gl_FragColor = vec4(cLine, 1.0); }"})),ye}return{palette:k,uniforms:y,glsl:{common:Ee,denimFrag:st},clothUniforms:te,denim:ge,metal:Z,thread:oe,cotton:_e,sky:L,slab:Ze,stitchGeometry:We,update:be,outline:pe,outlineGeometry:Re}}const Ce=-800,we=800,Ge=4,nt=150,Ye=5,ut=[[0,330],[25,505],[26,517],[27,541],[28,575],[32.2,734.6],[33,752],[44,752]];function mt(r,v){if(r<=v[0][0])return v[0][1];for(let a=1;a<v.length;a++)if(r<=v[a][0]){const g=v[a-1],k=v[a];return de(g[1],k[1],(r-g[0])/(k[0]-g[0]))}return v[v.length-1][1]}function gt(r={}){const v=r.start??330,a=r.stop??752,g=r.creep??7,k=r.top??38,y=r.runAt??25,te=r.spin??3;return ge=>{const xe=Math.max(ge,0),Z=$((xe-y)/te,0,1);return Math.min(a,v+g*xe+(k-g)*(te*(Z*Z*Z-.5*Z*Z*Z*Z)+Math.max(xe-y-te,0)))}}const Je=`
uniform float uBillow; uniform vec2 uHop; float gFlankPinch = 0.0; float gFlankFold = 0.0; float gFlankR = 1.0;
// returns world position of the cloth point (s, t) on flank sgn; nrm = its upper-face normal.
// The edge is not wound up like a hose: it lifts, flops over outward and lies as a slumped, open roll of one loose
// turn at most (TH radians), so the hem (t = 0) stays OUTSIDE, on the crest or the back of the breaker. Cloth is laid
// true to length from the hem; what the opening has pushed back beyond that is tucked under at the contact line.
vec3 flankPos(float sgn, float s, float t, out vec3 nrm, out float wound){
  float w = zipOpen(s);
  float g2 = abs(2.0 * dnNoise(vec2(s * 0.027 + sgn * 9.0, uTime * 0.02)) - 1.0);
  float pinch = 1.0 - smoothstep(0.0, 0.42, g2);                       // gathers: cinched every 25 to 50 m
  gFlankPinch = pinch;
  float big = dnNoise(vec2(s * 0.0085 + sgn * 5.0, 3.0));              // the outline rises and sags between them
  float young = 1.2 + 1.3 * smoothstep(8.0, 24.0, w) + 9.0 * smoothstep(58.0, 100.0, w) + 6.5 * smoothstep(80.0, 150.0, w);
  float R = mix(young, zipRoll(w), uCurl) * mix(1.0, (0.74 + 0.48 * big) * (1.0 - 0.40 * pinch), smoothstep(30.0, 44.0, w));
  { float hq = (s - uHop.x) / 24.0; R *= 1.0 - uHop.y * step(sgn, 0.0) * exp(-hq * hq); }      // a low gather where the path hops the west roll
  gFlankR = R;
  float TH = mix(2.85, 4.5, smoothstep(47.0, 62.0, w)) + 2.1 * (dnNoise(vec2(s * 0.024 - sgn * 3.0, 9.0 + uTime * 0.02)) - 0.5) * smoothstep(30.0, 42.0, w);
  float Rm = max(R * 0.92, 0.5);
  float a = max(min(w, Rm * TH) - t, 0.0); float th = a / Rm;
  float fold = s * 0.21 + sgn * th * 1.15 + 5.0 * dnNoise(vec2(s * 0.016, sgn * 4.0));     // oblique drape folds, 3 or 4 per 100 m
  gFlankFold = fold;
  float on = smoothstep(0.25, 1.3, th);
  float r = R * (1.0 - 0.045 * th) * (1.0 + 0.12 * sin(fold) * on);
  float slump = mix(1.0, 0.60, smoothstep(45.0, 100.0, w));            // heavy cloth: the old roll is wider than tall
  float lift = smoothstep(0.0, 0.6, th);
  float x = w - r * sin(th) * zipWide(w);
  float y = (R - r * cos(th)) * slump;
  x += 0.22 * y;                                                       // and it leans away from the zip
  y += lift * 0.5 * sin(s * 0.19 + th * 2.0 + uTime * 0.8) * min(R * 0.12, 1.0);   // the edge flutters as it lifts
  y = max(y, 0.0);
  if (t >= w) { x = t; y = 0.0; }
  float hold = smoothstep(10.0, 150.0, t) * (1.0 - smoothstep(0.0, 2.0, th));
  vec3 p = vec3(sgn * (x + ${Ye.toFixed(1)}), ${Ge.toFixed(1)} + y, s);
  p.y += uBillow * hold * denimBillow(p.xz, uTime);
  nrm = t >= w ? vec3(0.0, 1.0, 0.0) : vec3(sgn * sin(th), cos(th), 0.0);
  wound = th;
  return p;
}
`;async function xt(r,v={}){const a=v.style||pt(r,v),g=a.palette,k=a.uniforms,y=r.rng,te=r.noise,ge=$(v.detail??1,.6,1),xe=v.schedule||ut,Z=v.duration??44,oe=typeof v.law=="function"?v.law:e=>mt(e,xe),_e=oe(0),ae=oe(1e6),L=new t.Group;L.name="the-zip";const Ze=y.range(0,100),We=v.wash==="raw"?-.16:v.wash==="stonewashed"?.22:0;await r.yield();const Pe=Math.round(330*ge),be=Math.round(75*(.7+.3*ge)),Re=(Pe+1)*(be+1),ye=new Float32Array(Re*2*3),pe=new Float32Array(Re*2*2),h=new Float32Array(Re*2),d=[],M=y.range(.1,.19),R=-y.range(.1,.19);for(let e=0;e<2;e++){const o=e===0?1:-1,n=e===0?M:R,s=Math.cos(n),f=Math.sin(n),i=e*Re;for(let l=0;l<=Pe;l++){const m=l/Pe,K=m<.16?de(Ce,120,m/.16):de(120,we+20,(m-.16)/.84);for(let q=0;q<=be;q++){const W=nt*Math.pow(q/be,1.45),w=i+l*(be+1)+q;ye[w*3]=o,ye[w*3+1]=K,ye[w*3+2]=W,pe[w*2]=W*s-K*f+e*31.7,pe[w*2+1]=W*f+K*s;const Q=ee(40,150,W);if(h[w]=de(.36+We+.2*te.fbm2(pe[w*2]*.021+Ze,pe[w*2+1]*.0024+e*7,3)+.1*te.n2(pe[w*2]*.075,pe[w*2+1]*.007+Ze),.32+We,Q),l<Pe&&q<be){const b=w+be+1;o>0?d.push(w,b,w+1,w+1,b,b+1):d.push(w,w+1,b,w+1,b+1,b)}}l%10===9&&await r.yield()}}const H=new t.BufferGeometry;H.setAttribute("position",new t.BufferAttribute(ye,3)),H.setAttribute("uv",new t.BufferAttribute(pe,2)),H.setAttribute("aWear",new t.BufferAttribute(h,1)),H.setIndex(d),H.boundingSphere=new t.Sphere(new t.Vector3(0,0,0),900);const Y=new t.ShaderMaterial({uniforms:{...a.clothUniforms(),uBillow:{value:v.billow??1.5},uCut:{value:new t.Vector4(1e6,1e6,1,1)},uCutDir:{value:new t.Vector2(0,1)}},side:t.DoubleSide,vertexShader:a.glsl.common+Je+`
      attribute float aWear; varying vec2 vUv; varying float vWear; varying vec3 vST; varying float vTh; varying vec2 vWXZ;
      void main(){ vec3 n; float th; vec3 p = flankPos(position.x, position.y, position.z, n, th); vWXZ = p.xz;
        vUv = uv; vWear = aWear; vST = position; vTh = th;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0); }`,fragmentShader:a.glsl.common+a.glsl.denimFrag+`
      uniform vec4 uCut; uniform vec2 uCutDir; varying vec2 vUv; varying float vWear; varying vec3 vST; varying float vTh; varying vec2 vWXZ;
      void main(){ float sgn = vST.x, s = vST.y, t = vST.z; float wear = vWear;
        vec2 kq = vWXZ - uCut.xy; if (length(vec2(dot(kq, uCutDir) / uCut.z, (kq.x * uCutDir.y - kq.y * uCutDir.x) / uCut.w)) < 1.0) discard;
        float back = gl_FrontFacing ? 0.0 : 1.0;
        // whiskers: sharp pale creases running out from the zip, and a fan ahead of the slider where the cloth is still held
        float aw = fwidth(t) + fwidth(s) + 1e-3, fine = 1.0 - smoothstep(0.6, 1.8, aw);      // metres a pixel; a crease under a pixel melts away
        float wa = s * 0.085 + t * 0.022 * sgn + sgn * 40.0 + 0.8 * dnNoise(vec2(s * 0.01, t * 0.02));
        float wi = floor(wa + 0.5), wh = dnHash(vec2(wi * 1.3 + 5.0, sgn * 3.0 + 4.0)), wlen = 22.0 + 90.0 * wh;
        float whisk = (1.0 - smoothstep(0.42, 0.42 + aw, abs(wa - wi - 0.3 * (wh - 0.5)) / 0.085)) * step(0.4, wh)
          * smoothstep(13.0, 17.0, t) * (1.0 - smoothstep(0.8 * wlen, wlen, t));
        vec2 q = vec2(t + 5.0, s - uSliderZ - 20.0); float ql = length(q), fr = max(q.y + 34.0, 4.0);
        float fa3 = q.x / fr * 3.4 + sgn * 13.0, fi = floor(fa3 + 0.5), flen = 60.0 + 130.0 * dnHash(vec2(fi * 1.9 + 2.0, sgn * 7.0 + 1.0));
        float fanL = (1.0 - smoothstep(0.45, 0.45 + aw, abs(fa3 - fi) / 3.4 * fr)) * smoothstep(0.0, 30.0, q.y) * smoothstep(14.0, 18.0, t)
          * (1.0 - smoothstep(0.75 * flen, flen, ql));
        wear += 0.34 * max(whisk, fanL) * fine;
        // POLISH 3: drag creases out on the flank: long thin lines oblique to the zip, a rubbed crest with a raw line beside it,
        // each its own length (42 m apart along the course: under one a second), so no stretch of the cloth is bare
        { float ca = (s * 0.5 + t * sgn * 0.87) / 21.0 + 1.3 * dnNoise(vec2(s * 0.006, t * 0.011 + sgn * 3.0));
          float ci = floor(ca + 0.5), ch = dnHash(vec2(ci * 2.1 + 9.0, sgn * 2.0 + 6.0)), cd = (ca - ci) * 21.0;
          float t0 = 22.0 + 60.0 * ch, t1 = t0 + 34.0 + 70.0 * dnHash(vec2(ci * 0.7 + 1.0, 3.0));
          float on2 = step(0.28, ch) * smoothstep(t0, t0 + 5.0, t) * (1.0 - smoothstep(t1 - 5.0, t1, t)) * (1.0 - smoothstep(1.5, 4.0, aw));
          wear += (0.34 * (1.0 - smoothstep(0.55, 0.55 + aw, abs(cd))) - 0.24 * (1.0 - smoothstep(0.45, 0.45 + aw, abs(cd - 1.5)))) * on2; }
        // beside the zip (the felled seam itself is geometry): a dark gutter outside it, the tape edge rubbed pale
        float wob = 0.5 * sin(s * 0.031 + sgn) + 0.25 * sin(s * 0.117);
        float tt = t + wob, ta = fwidth(tt) + 1e-4;
        wear -= 0.30 * smoothstep(13.6, 14.4, tt) * (1.0 - smoothstep(15.5, 18.5, tt));
        wear += 0.30 * (1.0 - smoothstep(1.0, 3.0, t)) + 0.18 * smoothstep(0.3, 2.5, vTh);
        // gathers, worked out here from s alone (no interpolated ramp: no facet)
        float g2 = abs(2.0 * dnNoise(vec2(s * 0.027 + sgn * 9.0, uTime * 0.02)) - 1.0);
        float pk = smoothstep(0.45, 0.8, (1.0 - smoothstep(0.0, 0.42, g2)) * smoothstep(0.2, 1.5, vTh)); wear -= 0.3 * pk * (1.0 - back);
        vec3 colF = denimColor(vUv, clamp(wear, 0.0, 1.0), true);
        vec3 colB = denimColor(vUv, 0.5, false);
        // the wrong side, where it has flopped over, is ONE flat pale tone with its weft rib. Everything else on it is
        // a LINE: a crisp dark crease in each drape valley, a thin rubbed line on each fold crest, shorter broken creases
        // between them, one tuck line at each gather; then the dark turned hem and the tape at the free edge
        float on = smoothstep(0.35, 1.0, vTh);
        float fold = s * 0.21 + sgn * vTh * 1.15 + 5.0 * dnNoise(vec2(s * 0.016, sgn * 4.0));
        float fq = fract(fold / 6.2832 + 0.25), fd = min(fq, 1.0 - fq), fa = fwidth(fold) / 6.2832 + 1e-4;
        float lw = max(0.011, 0.9 * fa), keep = 1.0 - smoothstep(0.10, 0.22, fa);
        float crease = (1.0 - smoothstep(lw, lw + fa, fd)) * on * keep;
        float crestL = (1.0 - smoothstep(0.7 * lw, 0.7 * lw + fa, 0.5 - fd)) * on * keep;
        float f2 = s * 0.66 + sgn * vTh * 2.3 + 6.0 * dnNoise(vec2(s * 0.031 + 11.0, sgn * 2.0));
        float id2 = floor(f2 / 6.2832 + 0.5), fd2 = abs(f2 / 6.2832 - id2), fa2 = fwidth(f2) / 6.2832 + 1e-4;
        float h2 = dnHash(vec2(id2 * 3.7 + 1.3, sgn * 5.0 + 2.0)), t0 = 0.5 + 2.4 * dnHash(vec2(id2 * 1.9 + 7.0, 4.0));
        float small = (1.0 - smoothstep(0.7 * fa2, 1.7 * fa2, fd2)) * step(0.22, h2) * smoothstep(t0, t0 + 0.15, vTh) * (1.0 - smoothstep(t0 + 1.7, t0 + 2.0, vTh))
          * (1.0 - smoothstep(0.08, 0.2, fa2));
        float fg = fwidth(g2) + 1e-4;
        float tuck = (1.0 - smoothstep(fg, 2.2 * fg, g2)) * smoothstep(0.5, 1.2, vTh) * (1.0 - smoothstep(0.05, 0.12, fg));
        vec3 cLine = mix(cIndigo, cFade, 0.18);
        colB = mix(colB, mix(cEcru, vec3(1.0), 0.45), crestL);
        colB = mix(colB, mix(cLine, cFade, 0.2), small);
        colB = mix(colB, cLine, max(crease, tuck));
        float hem = 1.0 - smoothstep(6.4 - ta, 6.4 + ta, tt);
        float hemLine = (1.0 - smoothstep(0.35, 0.35 + ta, abs(tt - 6.4))) * (1.0 - smoothstep(0.4, 1.2, ta));
        float tape = 1.0 - smoothstep(1.7 - ta, 1.7 + ta, tt);
        colB = mix(colB, wearRamp(0.33), hem);
        colB = mix(colB, wearRamp(0.74), hemLine);          // the hem's folded edge, rubbed
        colB = mix(colB, cRaw, tape);
        gl_FragColor = vec4(mix(colF, colB, back), 1.0); }`}),X=new t.Mesh(H,Y);X.frustumCulled=!1,X.name="flanks",L.add(X),await r.yield();{const e=[[6.2,.04,.1],[7,1.55,.72],[8.3,2,.93],[10.2,1.8,.74],[12.1,2,.93],[13.4,1.55,.72],[14.2,.04,.06]],o=Math.round(300*ge),n=[],s=[],f=[],i=[],l=[];for(let ne=0;ne<2;ne++)for(let Te=0;Te<=o;Te++){const He=Te/o,ve=He<.12?de(Ce,120,He/.12):de(120,we+20,(He-.12)/.88),Be=ne===0?1:-1;for(let _=0;_<e.length;_++){const N=n.length/3,ce=.5*Math.sin(ve*.031+Be)+.25*Math.sin(ve*.117);n.push(Be,ve,e[_][0]-ce),s.push(e[_][0]+ne*40,ve),f.push(e[_][1]),i.push($(e[_][2]+We*.6,.02,1)),Te<o&&_<e.length-1&&(Be>0?l.push(N,N+e.length,N+1,N+1,N+e.length,N+e.length+1):l.push(N,N+1,N+e.length,N+1,N+e.length+1,N+e.length))}}const m=new t.BufferGeometry;m.setAttribute("position",new t.Float32BufferAttribute(n,3)),m.setAttribute("uv",new t.Float32BufferAttribute(s,2)),m.setAttribute("aH",new t.Float32BufferAttribute(f,1)),m.setAttribute("aWear",new t.Float32BufferAttribute(i,1)),m.setIndex(l),m.boundingSphere=new t.Sphere(new t.Vector3(0,0,0),900);const K=new t.ShaderMaterial({uniforms:{...a.clothUniforms(),uBillow:{value:v.billow??1.5}},side:t.DoubleSide,vertexShader:a.glsl.common+Je+`
        attribute float aWear; attribute float aH; varying vec2 vUv; varying float vWear;
        void main(){ vec3 n; float th; vec3 p = flankPos(position.x, position.y, position.z, n, th);
          p += n * (aH + 0.12); vUv = uv; vWear = aWear;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0); }`,fragmentShader:a.glsl.common+a.glsl.denimFrag+`
        varying vec2 vUv; varying float vWear;
        void main(){ gl_FragColor = vec4(denimColor(vUv, vWear, true), 1.0); }`}),q=new t.Mesh(m,K);q.frustumCulled=!1,q.name="zip-seam",L.add(q),await r.yield();const W=(()=>{const ve=[],Be=[],_=[];for(let ce=0;ce<=5;ce++){const Fe=ce/5,De=(Fe-.5)*7,Ie=Math.min(Fe,1-Fe)*7,ht=1-ee(0,.9,Ie);for(let Oe=0;Oe<=3;Oe++){const at=Oe/3*Math.PI;ve.push(-Math.cos(at)*.5,Math.sin(at)*.5-ht*.75-.05,De),Be.push(Fe*7,Oe/3)}}for(let ce=0;ce<5;ce++)for(let Fe=0;Fe<3;Fe++){const De=ce*4+Fe,Ie=De+3+1;_.push(De,Ie,De+1,De+1,Ie,Ie+1)}const N=new t.InstancedBufferGeometry;return N.setAttribute("position",new t.Float32BufferAttribute(ve,3)),N.setAttribute("uv",new t.Float32BufferAttribute(Be,2)),N.setIndex(_),N})(),w=[],Q=y.fork?y.fork("zip-stitch"):y;for(let ne=0;ne<2;ne++)for(const[Te,He,ve,Be]of[[8.3,1,2,0],[12.1,1,2,5],[4.1,-1,0,2.5]])for(let _=-330+Be;_<we+12;_+=10){if(Q()<.025)continue;const N=ne===0?1:-1,ce=.5*Math.sin(_*.031+N)+.25*Math.sin(_*.117);w.push(N,_,Te-ce+.5*te.n2(_*.03,Te+ne*9.1),He*(1+ve))}W.setAttribute("aST",new t.InstancedBufferAttribute(new Float32Array(w),4)),W.instanceCount=w.length/4,W.boundingSphere=new t.Sphere(new t.Vector3(0,0,0),900);const b=new t.ShaderMaterial({uniforms:{...a.clothUniforms(),uBillow:{value:v.billow??1.5},cA:{value:g.orange},cB:{value:g.orangeDark}},side:t.DoubleSide,vertexShader:a.glsl.common+Je+`
        attribute vec4 aST; varying vec2 vUv;
        void main(){ vec3 n; float th; float face = sign(aST.w), lift = abs(aST.w) - 1.0;
          vec3 org = flankPos(aST.x, aST.y, aST.z, n, th);
          float wide = max(1.0, distance(org, cameraPosition) * 0.0045);        // a dash stays a line of orange far off
          vec3 p = flankPos(aST.x, aST.y + position.z, aST.z + position.x * wide, n, th);
          p += n * face * (lift + position.y + 0.1); vUv = uv;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0); }`,fragmentShader:`
        uniform vec3 cA, cB; varying vec2 vUv;
        void main(){ float t = vUv.x / 0.9 + vUv.y * 0.9; float fw = fwidth(t);
          float ply = smoothstep(0.72 - fw, 0.72 + fw, abs(fract(t) - 0.5) * 2.0) * (1.0 - smoothstep(0.15, 0.35, fw));
          gl_FragColor = vec4(mix(cA, cB, ply), 1.0); }`}),j=new t.Mesh(W,b);j.frustumCulled=!1,j.name="zip-stitches",L.add(j)}await r.yield();const ie=a.cotton(),B=new t.Mesh(new t.PlaneGeometry(2*(nt+Ye-3),we-Ce+16).rotateX(-Math.PI/2),ie);B.position.set(0,0,(Ce+we)/2+10),B.name="red-plain",L.add(B),await r.yield();const D=`
    // x of the tape centre and y of its top at course position z
    vec2 tapeAt(float z){ float w = zipOpen(z); float c = zipTape(w); return vec2(c, mix(${(Ge+.2).toFixed(1)}, 0.4, smoothstep(2.75, 13.0, c))); }`;{const o=[],n=[],s=[],f=[],i=[-3.2,0,3.4,7.5];for(let q=0;q<2;q++)for(let W=0;W<=200;W++){const w=de(Ce,we+20,W/200);for(let Q=0;Q<4;Q++){const b=o.length/3;o.push(q===0?1:-1,w,i[Q]),n.push(i[Q]*4+q*9,w*.5),s.push(Q===0?.42:Q===3?.05:.16),W<200&&Q<3&&(q===0?f.push(b,b+4,b+1,b+1,b+4,b+5):f.push(b,b+1,b+4,b+1,b+5,b+4))}}const l=new t.BufferGeometry;l.setAttribute("position",new t.Float32BufferAttribute(o,3)),l.setAttribute("uv",new t.Float32BufferAttribute(n,2)),l.setAttribute("aWear",new t.Float32BufferAttribute(s,1)),l.setIndex(f);const m=new t.ShaderMaterial({uniforms:{...a.clothUniforms(),cRed:{value:g.red},cDeep:{value:g.redDeep}},side:t.DoubleSide,vertexShader:a.glsl.common+D+`
        attribute float aWear; varying vec2 vUv; varying float vWear; varying vec3 vT;
        void main(){ vec2 c = tapeAt(position.y); vUv = uv; vWear = aWear; vT = vec3(position.z, position.y, smoothstep(3.1, 4.6, c.x));
          float ripple = 0.25 * sin(position.y * 0.5 + uTime * 2.0) * smoothstep(3.0, 14.0, c.x) * step(1.0, position.z);
          vec3 p = vec3(position.x * (c.x + position.z), c.y + ripple - 0.012 * position.z, position.y);
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0); }`,fragmentShader:a.glsl.common+a.glsl.denimFrag+`
        uniform vec3 cRed, cDeep; varying vec2 vUv; varying float vWear; varying vec3 vT;
        void main(){ vec3 den = denimColor(vUv, vWear, true);
          float q = vT.y / 1.5, fq = fwidth(q) + 1e-4, fa = fwidth(vT.x) + 1e-4;
          float rib = (1.0 - smoothstep(0.16 - fq, 0.16 + fq, abs(fract(q) - 0.5))) * (1.0 - smoothstep(0.2, 0.5, fq));
          float selv = max(1.0 - smoothstep(-2.5 - fa, -2.5 + fa, vT.x), smoothstep(6.7 - fa, 6.7 + fa, vT.x));
          gl_FragColor = vec4(mix(den, mix(cRed, cDeep, max(selv, 0.7 * rib)), vT.z), 1.0); }`}),K=new t.Mesh(l,m);K.frustumCulled=!1,K.name="tapes",L.add(K)}await r.yield();let u=null;const z=(()=>{const e=[[1.5,2.7],[-1.2,2.7],[-1.8,1.7],[-3.6,1.7],[-4.2,2.5],[-5.6,2.5],[-6.25,1.5]],o=[...e,[-6.5,0],...e.slice().reverse().map(([s,f])=>[s,-f])],n=[];for(let s=0;s<6;s++)n.push([-4.95+Math.cos(s*Math.PI/3)*1.35,Math.sin(s*Math.PI/3)*1.35]);return u=a.slab(o,0,3.05,.06),$e([a.slab(o,0,3,.4),a.slab(n,2.9,3.7,.3)])})(),T=a.metal("brass",{uniforms:a.clothUniforms(),vertexShader:a.glsl.common+D+`
      attribute float aEdge; attribute vec2 aZS; varying float vEdge; varying vec3 vN;
      void main(){ vEdge = aEdge; float z = aZS.x, sgn = aZS.y;
        vec2 c = tapeAt(z); float d = uSliderZ + 15.0 - z;
        float e = max(d - 60.0, 0.0);
        float phi = 1.5708 * smoothstep(64.0, 116.0, d) + 0.5 * sin(e * 0.16) * exp(-e * 0.03) + 0.05 * sin(uTime * 1.1 + z) * step(64.0, d);
        float cs = cos(phi), sn = sin(phi);
        vec2 l = vec2(position.x - 1.5, position.y);                       // rock about the root's outer foot
        vec3 p = vec3(1.5 + l.x * cs + l.y * sn, -l.x * sn + l.y * cs, position.z);
        vec3 n = vec3(normal.x * cs + normal.y * sn, -normal.x * sn + normal.y * cs, normal.z);
        p.x = (p.x + c.x) * sgn; p.y += c.y + 0.1; p.z += z; n.x *= sgn;
        vN = mat3(modelMatrix) * n;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0); }`});T.side=t.DoubleSide;const re=[],qe=Math.min(we-14,ae+47);for(let e=0;e<2;e++)for(let o=Ce+9+e*6;o<qe;o+=12)re.push(o,e===0?1:-1);z.setAttribute("aZS",new t.InstancedBufferAttribute(new Float32Array(re),2));const le=new t.InstancedMesh(z,T,re.length/2);le.frustumCulled=!1,le.name="teeth",L.add(le),await r.yield();{const e=a.outlineGeometry(u),o=a.outline().uniforms.cLine;for(const n of[1,-1]){const s=new t.InstancedBufferGeometry;s.setAttribute("position",e.attributes.position),s.setAttribute("aOut",e.attributes.aOut),s.setIndex(e.index);const f=[];for(let m=0;m<re.length;m+=2)re[m+1]===n&&f.push(re[m],n);s.setAttribute("aZS",new t.InstancedBufferAttribute(new Float32Array(f),2)),s.instanceCount=f.length/2;const i=new t.ShaderMaterial({uniforms:{...a.clothUniforms(),cLine:o},side:n>0?t.BackSide:t.FrontSide,vertexShader:a.glsl.common+D+`
          attribute vec3 aOut; attribute vec2 aZS;
          void main(){ float z = aZS.x, sgn = aZS.y;
            vec2 c = tapeAt(z); float d = uSliderZ + 15.0 - z;
            float e = max(d - 60.0, 0.0);
            float phi = 1.5708 * smoothstep(64.0, 116.0, d) + 0.5 * sin(e * 0.16) * exp(-e * 0.03) + 0.05 * sin(uTime * 1.1 + z) * step(64.0, d);
            float cs = cos(phi), sn = sin(phi);
            vec2 l = vec2(position.x - 1.5, position.y);
            vec3 p = vec3(1.5 + l.x * cs + l.y * sn, -l.x * sn + l.y * cs, position.z);
            vec3 n = vec3(aOut.x * cs + aOut.y * sn, -aOut.x * sn + aOut.y * cs, aOut.z);
            p.x = (p.x + c.x) * sgn; p.y += c.y + 0.1; p.z += z; n.x *= sgn;
            vec4 wp = modelMatrix * vec4(p, 1.0);
            wp.xyz += n / max(length(n), 1e-4) * clamp(distance(wp.xyz, cameraPosition) * 0.0034, 0.16, 1.5);
            gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:"uniform vec3 cLine; void main(){ gl_FragColor = vec4(cLine, 1.0); }"}),l=new t.Mesh(s,i);l.frustumCulled=!1,l.name="teeth-line",L.add(l)}}await r.yield();const U=(e,o=2)=>{let n=e;for(let s=0;s<o;s++){const f=[];for(let i=0;i<n.length;i++){const l=n[i],m=n[(i+1)%n.length];f.push([l[0]*.75+m[0]*.25,l[1]*.75+m[1]*.25],[l[0]*.25+m[0]*.75,l[1]*.25+m[1]*.75])}n=f}return n},c=e=>[...e,...e.slice().reverse().filter(o=>Math.abs(o[0])>1e-6).map(([o,n])=>[-o,n])],x=1+y.range(-.06,.06),S=y.range(-3,3),F=[[0,45+S],[7,44.5+S],[13,40],[15.5,30],[16,12],[20,-4],[29,-20],[34.5,-33],[35,-41],[32,-45],[15,-45],[9,-40],[0,-35]].map(([e,o])=>[e*x,o]),C=U(c(F),2),P=[];P.push(a.slab(C,9.5,22,1.5)),P.push(a.slab(C.map(([e,o])=>[e*.5,o*.8-3]),21.5,29,1.3)),P.push(a.slab(C,21.6,23.4,.7,{holes:[C.map(([e,o])=>[e*.9,o*.93-.5])]})),P.push(a.slab(C.map(([e,o])=>[e*.97,o*.985]),.4,3.3,.8)),await r.yield();for(const e of[1,-1]){const o=[[16,14],[19.5,-3],[28.5,-19.5],[34,-33],[34.6,-43.5]].map(([i,l])=>[i*x*e,l]),n=o.slice().reverse().map(([i,l])=>[i-3.6*e,l]);P.push(a.slab([...o,...n],5.6,9.8,.7));const s=[];for(let i=0;i<10;i++)s.push([e*25.5*x+Math.cos(i*.628)*3.6,-33+Math.sin(i*.628)*3.6]);P.push(a.slab(s,21.6,23.8,.9));const f=[];for(let i=0;i<14;i++)f.push([e*25.5*x+Math.cos(i*.449)*6.2,-33+Math.sin(i*.449)*6.2]);P.push(a.slab(f,21.6,22.6,.6,{holes:[f.map(([i,l])=>[e*25.5*x+(i-e*25.5*x)*.76,-33+(l+33)*.76])]})),await r.yield()}P.push(a.slab(U([[0,14],[4.5,6],[8.5,-14],[8,-32],[0,-37],[-8,-32],[-8.5,-14],[-4.5,6]],1),3.2,9.8,.6)),await r.yield();const V=U([[0,26],[-4,40],[-12,52],[-25,60],[-42,62.5],[-53,61],[-62,58.5],[-64.5,55],[-62,52],[-53,52.5],[-47.5,50],[-45.5,40],[-45,26]],2),O=U([[-13,32],[-14.5,40],[-20.5,48],[-29,52],[-36.5,50],[-37.5,32]],2);P.push(a.slab(U([[8,28],[9,12],[6,2],[-6,2],[-9,12],[-8,28]],2),28.5,31,1));const se=new t.Matrix4().set(0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,1);P.push(a.slab(V,-10,10,1.6,{holes:[O]}).applyMatrix4(se)),await r.yield();const J=$e(P);P.forEach(e=>e.dispose());const I=a.metal("brass"),A=new t.Group;A.name="slider";const G=new t.Mesh(J,I);A.add(G),L.add(A),await r.yield();const E=new t.Vector3(0,56.5,-57),fe=U(c([[0,7.5],[12,7.5],[16,4],[16,-6],[12,-11],[7,-17],[7,-26],[12.5,-36],[15,-45],[14,-49.5],[9,-52],[0,-52]]),2).map(([e,o])=>[e,-o]),Se=U([[11.5,3],[11.5,-6.2],[-11.5,-6.2],[-11.5,3]],2).map(([e,o])=>[e,-o]),Me=U([[5,-35.5],[5,-46],[-5,-46],[-5,-35.5]],2).map(([e,o])=>[e,-o]),Le=a.slab(fe,-2,2,1.2,{holes:[Se,Me]}).rotateX(Math.PI/2),ue=new t.Mesh(Le,I);ue.position.copy(E),ue.name="pull-tab",A.add(ue),await r.yield();{const e=a.outline(),o=new t.Mesh(a.outlineGeometry(J),e);o.name="slider-line",o.frustumCulled=!1,A.add(o),await r.yield();const n=new t.Mesh(a.outlineGeometry(Le),e);n.name="tab-line",n.frustumCulled=!1,ue.add(n)}await r.yield();const Ue=$e([a.slab(U([[15,0],[15,16],[-15,16],[-15,0]],2),3.6,10.5,1),a.slab(U([[19,3],[19,13],[-19,13],[-19,3]],1),3.2,6.2,.7)]),ze=new t.Mesh(Ue,I);ze.position.set(0,0,ae+45.5+3),ze.name="bottom-stop",L.add(ze);{const e=new t.Mesh(a.outlineGeometry(Ue),a.outline());e.name="stop-line",e.frustumCulled=!1,ze.add(e)}await r.yield();{const e=Math.round(140*ge),o=[],n=[],s=[],f=y.fork?y.fork("torn"):y;for(let K=0;K<e;K++){const q=f(),W=f()<.5?-1:1,w=f(),Q=f();for(let j=0;j<=3;j++)for(const ne of[-1,1])o.push(j/3,ne,0),n.push(q,W,w,Q);const b=K*8;for(let j=0;j<3;j++)s.push(b+j*2,b+j*2+1,b+j*2+2,b+j*2+1,b+j*2+3,b+j*2+2)}const i=new t.BufferGeometry;i.setAttribute("position",new t.Float32BufferAttribute(o,3)),i.setAttribute("aSeed",new t.Float32BufferAttribute(n,4)),i.setIndex(s);const l=new t.ShaderMaterial({uniforms:{...a.clothUniforms(),cA:{value:g.white},uRun:{value:1},uAmt:{value:1}},side:t.DoubleSide,vertexShader:a.glsl.common+`
        attribute vec4 aSeed; uniform float uRun; uniform float uAmt;
        void main(){ float life = fract(uTime * (0.55 + 0.35 * aSeed.z) + aSeed.x);
          float up = 1.0 - (1.0 - life) * (1.0 - life);
          // REPAIR 3: they were hairlines born against the casting's rear face and read as scratches across the brass. They are threads
          // (the brief: 'short white threads snap free of the tape edge and whirl up for a second'): born at the parted tape's outer edge
          // just behind the casting, outboard of its plates, they whirl up and out over the young rolls BESIDE the metal, with a thread's body
          vec3 o = vec3(aSeed.y * (36.0 + 10.0 * aSeed.w), 4.0 + up * (5.0 + 9.0 * aSeed.z), uSliderZ - 51.0 - life * (10.0 + 26.0 * aSeed.w) * uRun);
          float ang = life * (7.0 + 9.0 * aSeed.w) + aSeed.x * 40.0, len = 2.6 + 3.0 * aSeed.z;
          vec3 dir = vec3(cos(ang) * 0.8, sin(ang * 0.7) * 0.6 + 0.3, sin(ang) * 0.8);
          o.x += aSeed.y * (up * (7.0 + 8.0 * aSeed.z) + (1.0 + sin(ang * 0.6)) * 1.5 * life); o.z += cos(ang * 0.5) * 2.0 * life;
          float t = position.x; vec3 p = o + dir * (t - 0.5) * len + vec3(0.0, sin(t * 3.14159) * 1.1 * sin(ang * 1.3), 0.0);
          vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
          float wd = max(0.17, -mv.z * 0.0016) * smoothstep(0.0, 0.08, life) * (1.0 - smoothstep(0.75, 1.0, life)) * step(aSeed.z, uAmt);   // as many at once as before, each one a thread
          vec3 vd = mat3(viewMatrix) * dir; vec2 sdir = vec2(-vd.y, vd.x); sdir = sdir / max(length(sdir), 1e-4);
          mv.xy += sdir * position.y * wd;
          gl_Position = projectionMatrix * mv; }`,fragmentShader:"uniform vec3 cA; void main(){ gl_FragColor = vec4(cA, 1.0); }"}),m=new t.Mesh(i,l);m.frustumCulled=!1,m.name="torn-ends",L.add(m),L.userData.tornMat=l}v.sky&&L.add(a.sky()),await r.yield();let me=-1,ke=_e,Qe=ke,et=7,Ae=0,Ne=0;const it=(e,o=ke)=>{const n=Math.max(o+15-e,0),s=Math.min(.3*n*ee(0,20,n)+12*ee(0,55,n),150),f=1.2+1.3*ee(8,24,s)+7*ee(29,40,s)+2.6*ee(31,44,s)*(1-ee(58,80,s))+8*ee(45,150,s),i=de(.85,1.3,ee(45,100,s));return{w:s,edge:s+Ye,roll:f,rollTop:Ge+2.2*1.22*f*de(1,.6,ee(45,100,s)),tape:Math.max(2.75,s-3.5-1.25*i*f)}},je=e=>{ke=$(e,Ce+100,we)},Ve=60,Ke=Math.ceil(Z*Ve)+2,Xe=new Float32Array(Ke);{let e=0,o=0;const n=1/Ve;for(let s=0;s<Ke;s++){Xe[s]=e;const f=s*n,i=$((oe(f+.3)-2*oe(f)+oe(f-.3))/.09,-70,70);o+=(i*Math.cos(e)/50-.62*Math.sin(e)-.22*o)*n,e+=o*n,e<-.15&&(e=-.15,o=Math.abs(o)*.55),e>1.25&&(e=1.25,o=-Math.abs(o)*.3)}}const rt=e=>{const o=$(e,0,Z)*Ve,n=Math.min(Ke-2,Math.floor(o));return de(Xe[n],Xe[n+1],o-n)},lt=r.core.makeRng(r.core.hashSeed("zip-tab-idle:"+r.seed)),tt=lt()*6.2832;function ft(e,o,n){v.style||a.update(e,o,n),me>=0?je(oe(me*Z)):v.demo!==!1&&me===-1&&je(oe(o%Z)),k.uSliderZ.value=ke,A.position.z=ke;const s=me>=0?me*Z:o%Z,f=me===-2?7:(oe(s+.15)-oe(s-.15))/.3;L.userData.tornMat.uniforms.uAmt.value=$(f/9,0,1.2),L.userData.tornMat.uniforms.uRun.value=$(f/7,.3,2.5);const i=.07*Math.sin(o*.79+tt)+.02*Math.sin(o*1.9+2*tt);if(me===-2){const l=$(e,0,.1);if(l>1e-4){const m=$((ke-Qe)/l,-60,60),K=$((m-et)/l,-70,70);et=m,Qe=ke;const q=Math.max(1,Math.ceil(l/.017)),W=l/q;for(let w=0;w<q;w++)Ne+=(K*Math.cos(Ae)/50-.62*Math.sin(Ae)-.22*Ne)*W,Ae+=Ne*W,Ae<-.15&&(Ae=-.15,Ne=Math.abs(Ne)*.55),Ae>1.25&&(Ae=1.25,Ne=-Math.abs(Ne)*.3)}ue.rotation.x=$(Ae+i,-.15,1.25)}else ue.rotation.x=$(rt(s)+i,-.15,1.25)}const p=(e,o,n)=>new t.Vector3(e,o,n),ot=ae,ct={zipFrom:p(0,Ge,Ce),zipTo:p(0,Ge,we),sliderStart:p(0,0,_e),sliderStop:p(0,0,ot),bottomStop:p(0,7,ot+56),flyThrough:[p(-210,70,0),p(-166,70,71),p(-100,68,176),p(-35,9,250),p(-22,9,330),p(-26,10,390),p(-50,16,425),p(-75,17,470),p(-75,18,548),p(-40,17,600),p(0,17,660),p(-30,20,690),p(-62,24,742),p(-58,32,810)],viewpoints:[{position:p(-210,70,0),target:p(0,20,330),note:"entry: slider on the axis, red wedge behind it"},{position:p(-22,9,340),target:p(0,22,470),note:"21 s (slider near z 477): up the V, teeth 25 m left, breakers both sides"},{position:p(-75,17,500),target:p(0,30,520),note:"26 s (slider near z 517): the brass wall and the tab"},{position:p(0,17,610),target:p(0,20,700),note:"31 s (slider near z 690): the valley parting under the lens"},{position:p(-62,24,742),target:p(0,30,740),note:"36 s: the stopped slider, tab ringing"}],portalSeat:{position:p(-40,52,905),normal:p(0,-.31,-.95).normalize(),radius:7,note:"suggestion only: the buttonhole belongs to the waistband the world builds"},tabPivot:E.clone(),sliderHalfWidth:35,sliderHalfLength:45,sliderTop:63,right:p(-1,0,0)};return{object:L,radius:130,height:63,center:p(0,26,400),anchors:ct,style:a,parts:{flank:X,plain:B,teeth:le,slider:A,tab:ue,stop:ze},get sliderZ(){return ke},sliderZAt:e=>oe(e),openingAt:it,setProgress(e){me=$(e,0,1)},setSliderZ(e){me=-2,je(e)},update:ft,dispose(){},ground:!1,groundY:0}}export{Ee as GLSL_COMMON,Je as GLSL_ROLL,dt as PALETTE,ut as SCHEDULE,xt as buildHero,pt as makeStyle,gt as zipLaw};
