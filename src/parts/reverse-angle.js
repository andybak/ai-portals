import*as t from"three";const O=2.5,U=e=>{const o=e*O+.25;return o-Math.floor(o)},X=(e,o,s)=>{const i=Math.min(1,Math.max(0,(s-e)/(o-e)));return i*i*(3-2*i)},ie=e=>X(0,.25,e)*(1-X(.25,.8,e));function j(e={}){const o=s=>new t.Color(s);return{uSunDir:{value:(e.sunDir||new t.Vector3(.5,.4,.6)).clone().normalize()},uSunCol:{value:o("#FFF1D6").multiplyScalar(e.sun??1.3)},uSkyCol:{value:o("#9DC0E8").multiplyScalar(e.fill??.42)},uFogCol:{value:o("#C9D9E6").multiplyScalar(.82)},uFogK:{value:e.fogK??615e-6},uBeat:{value:0},uTime:{value:0},uBrake:{value:0},uU:{value:0},uSweep:{value:new t.Vector3(-900,0,0)},uRes:{value:new t.Vector2(800,450)}}}const Y=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uFogCol, uSweep; uniform float uFogK, uBeat, uTime, uBrake, uU; uniform vec2 uRes;
float pulse(float b){ return smoothstep(0., 0.25, b) * (1. - smoothstep(0.25, 0.8, b)); }
vec3 shadeLit(vec3 alb, vec3 n, float sh){
  float d = max(dot(n, uSunDir), 0.) * sh;
  vec3 amb = uSkyCol * (0.6 + 0.4 * n.y) + vec3(0.06, 0.05, 0.04) * (0.5 - 0.5 * n.y);
  return alb * (uSunCol * d + amb);
}
vec3 fogged(vec3 c, float dist){ return mix(uFogCol, c, exp(-uFogK * max(dist, 0.))); }
// the haze is warm only toward the sun; looking down-sun it is the sky's cool blue-grey. toCam: from the point to the eye
vec3 fogColDir(vec3 toCam){
  float s = 0.5 - 0.5 * dot(normalize(toCam.xz + vec2(1e-5, 0.)), normalize(uSunDir.xz + vec2(1e-5, 0.)));
  return mix(vec3(0.74, 0.96, 1.3) * dot(uFogCol, vec3(0.3333)), uFogCol, smoothstep(0.2, 0.8, s)); }
vec3 foggedDir(vec3 c, float dist, vec3 toCam){ return mix(fogColDir(toCam), c, exp(-uFogK * max(dist, 0.))); }
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1, 0)), f.x), mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), f.x), f.y); }
// cloud shadows, 150 m across, crawling up the valley at 9 m/s: 1 in the sun, 0 under a cloud. They are carried by the
// flight itself (uU) more than by the clock, so the light at each moment of the story is always the same light.
float cloudT(){ return uTime * 0.25 + uU * 34.; }
// the one broad shadow that crosses the wood. A cloud is not a slab: it has thin places that let three quarters of the sun
// through, each about 20 m across (three spruce crowns side by side), and the wind draws them across the valley at 20 m/s,
// the speed the small clouds' shadows have in the film (17 m per unit of cloud time, 1.2 units a second at the flight's pace).
// Under the broad shadow the wood is therefore never one held tone: pools of sun cross it for as long as the shadow lies on it
float sweepSh(vec2 xz, float soft){ vec2 q = (xz - vec2(0., uSweep.x)) / vec2(260., 70.);
  vec2 hp = (xz + vec2(20. * uTime, 0.)) / 21.; float thin = smoothstep(0.46, 0.62, vnoise(hp) * 0.7 + vnoise(hp * 2.1 + 3.) * 0.3);
  return 1. - uSweep.y * (1. - smoothstep(0.62 - soft, 1., length(q))) * (1. - 0.75 * thin); }
float cloudSun(vec2 xz){ float t = cloudT(); vec2 cp = (xz + vec2(312. + 17. * t, 520. - 5. * t)) / 130.; return (1. - smoothstep(0.505, 0.565, vnoise(cp) * 0.65 + vnoise(cp * 2.3 + 7.) * 0.35)) * sweepSh(xz, 0.); }
// the same clouds with a soft edge: for the wood and its mist, where a hard edge would read as a cut
float cloudSoft(vec2 xz){ float t = cloudT(); vec2 cp = (xz + vec2(312. + 17. * t, 520. - 5. * t)) / 130.; return (1. - smoothstep(0.5, 0.66, vnoise(cp) * 0.65 + vnoise(cp * 2.3 + 7.) * 0.35)) * sweepSh(xz, 0.25); }
`,Q=`
vec3 gBump;                                                                   // relief: added to the normal by the caller
float gStone = 1.;                                                            // size of the rubble's stones: the barn is built three times life size, and so are its stones
vec3 surface(vec3 alb, vec3 w, vec3 n, float part, float dist, out float gloss){
  gloss = 0.; gBump = vec3(0.);
  vec2 hz = n.xz + vec2(1e-4, 0.); hz /= max(length(hz), 1e-4);
  float tu = dot(w.xz, vec2(-hz.y, hz.x));                                  // along the wall or the eave
  if (part > 3.5 && part < 4.5) {                                             // coursed rubble: uneven courses, stones of every length, weathered
    vec3 T = vec3(-hz.y, 0., hz.x);
    float big = step(1.5, gStone); vec2 q = vec2(tu / gStone, w.y / (0.47 * gStone) + (0.95 * vnoise(vec2(w.y * 0.9, 1.7)) + 0.3 * sin(w.y * 2.3 + 1.)) * (1. - 0.6 * big)); q.y += 0.22 * vnoise(vec2(tu * 0.4, w.y * 0.3)); float row = floor(q.y);
    q.x = q.x * (0.5 + 1.0 * hash21(vec2(row, 1.))) + hash21(vec2(row, 7.)) * 3.; q.x += 0.75 * vnoise(vec2(q.x * 0.71 + row * 13.1, row * 0.37)); vec2 f = fract(q);
    float h = hash21(vec2(floor(q.x), row)), h3 = hash21(vec2(floor(q.x) + 7., row)), fade = clamp(1.25 - fwidth(q.y) * 4.5, 0., 1.);
    float d = min(min(f.x, 1. - f.x) * 2.6, min(f.y, 1. - f.y)), mort = 1. - smoothstep(0.02, 0.1, d);
    float stain = vnoise(vec2(tu * 0.17, w.y * 0.05)) * 0.6 + vnoise(vec2(tu, w.y) * 0.6) * 0.4, grit = vnoise(vec2(tu, w.y) * 5.) * 0.6 + vnoise(vec2(tu, w.y) * 13.) * 0.4;
    alb *= mix(1., 0.86 + 0.26 * h - big * 0.3 * step(0.7, h3) * h, fade) * mix(0.6 + 0.7 * stain, 0.8 + 0.35 * stain, big) * (0.86 + 0.14 * smoothstep(0., 9., w.y)) * mix(1., 0.82 + 0.36 * grit, fade);
    alb *= mix(vec3(1.), mix(vec3(1.06, 1., 0.92), vec3(0.92, 0.98, 1.08), h3) * (1. - 0.2 * step(0.86, h3)), fade);
    alb *= 1. - (0.26 - 0.16 * big) * smoothstep(0.45, 0.7, vnoise(vec2(tu * 2.3, w.y * 0.07) + 4.)) * smoothstep(3., 14., w.y);   // rain streaks down from the eaves
    alb = mix(alb, alb * vec3(1.16, 1.08, 0.8), smoothstep(0.58, 0.8, vnoise(vec2(tu, w.y) * 0.9 + 9.) * 0.6 + vnoise(vec2(tu, w.y) * 2.7) * 0.4) * 0.4);   // ochre lichen
    alb = mix(alb, alb * 0.6, mort * fade);
    // each stone has its own face and rounded arrises: the side light rakes them
    vec2 bev = vec2(smoothstep(0.82, 1., f.x) - (1. - smoothstep(0., 0.18, f.x)), smoothstep(0.72, 1., f.y) - (1. - smoothstep(0., 0.28, f.y)));
    gBump = (T * ((h - 0.5) * 0.5 + bev.x * 0.34 + (grit - 0.5) * 0.4) + vec3(0., 1., 0.) * ((h3 - 0.5) * 0.26 + bev.y * 0.34 + (stain - 0.5) * 0.2)) * fade;
  } else if (part > 2.5 && part < 3.5) {                                      // slate, in rows down the slope
    vec2 q = vec2(tu / 0.8, w.y / 0.4); float row = floor(q.y); q.x += 0.5 * mod(row, 2.) + 0.13 * hash21(vec2(row, 3.)); vec2 f = fract(q);
    float h = hash21(vec2(floor(q.x), row)), fade = clamp(1.25 - fwidth(q.y) * 3.2, 0., 1.);
    alb *= mix(1., 0.5 + 0.95 * h, fade) * (0.75 + 0.5 * vnoise(vec2(tu, w.y) * 0.35));
    alb *= 1. - 0.7 * fade * (1. - smoothstep(0., 0.26, f.y)) - 0.4 * fade * (1. - smoothstep(0., 0.07, min(f.x, 1. - f.x)));
    gBump = vec3(0., 1., 0.) * (0.5 * (smoothstep(0.6, 1., f.y) - 0.3) + (h - 0.5) * 0.3) * fade;                  // each course tips out over the one below
    alb = mix(alb, vec3(0.2, 0.17, 0.07), smoothstep(0.66, 0.8, vnoise(vec2(tu, w.y) * 0.5 + 3.)) * 0.4);
    gloss = 0.5 * (0.4 + 0.6 * h);
  } else if (part > 4.5 && part < 7.5) {                                      // timber
    vec3 g = part < 5.5 ? w.xzy : part < 6.5 ? w.yzx : w.xyz;                 // g.z runs along the grain
    float gr = vnoise(vec2(g.x * 9. + g.y * 7., g.z * 0.55)) * 0.6 + vnoise(vec2(g.x * 37. + g.y * 31., g.z * 1.7)) * 0.4;
    float knot = smoothstep(0.8, 0.95, vnoise(vec2(g.x + g.y, g.z * 0.35) * 1.3));
    alb *= (0.5 + 1.0 * gr) * (1. - 0.6 * knot);
    alb *= 1. - 0.5 * (1. - smoothstep(0., 0.035, abs(fract((g.x + g.y) * 1.6) - 0.5)));   // the joints between boards
  } else if (part > 10.5 && part < 11.5) {                                    // spruce bark: plates and furrows running up the stem
    float bk = vnoise(vec2((w.x + w.z) * 5.5, w.y * 0.55)) * 0.6 + vnoise(vec2((w.x - w.z) * 15., w.y * 1.9)) * 0.4;
    alb *= (0.4 + 1.1 * bk) * (0.8 + 0.4 * vnoise(vec2(w.x + w.z, w.y) * 0.9));
    alb = mix(alb, vec3(0.22, 0.24, 0.2), smoothstep(0.6, 0.85, vnoise(vec2(w.x - w.z, w.y * 0.6) * 1.4)) * 0.35);   // grey lichen
  } else if (part > 12.5 && part < 13.5) {                                    // straw bales: strands, two strings, round shoulders
    float by = (w.y - 10.91) / 1.12, row = floor(by), fy = fract(by), fx = fract((w.x - mod(row, 2.) + 1.01) / 2.02);
    float strand = vnoise(vec2(w.x * 2.6 + row * 5., w.y * 46.)) * 0.55 + vnoise(vec2(w.x * 9., w.y * 110. + w.z * 60.)) * 0.45;
    float ends = vnoise(vec2(w.x, w.y) * 38.) * 0.5 + vnoise(vec2(w.x, w.y + w.z) * 90.) * 0.5;
    float hf = clamp(1.6 - dist * 0.03, 0., 1.), ed = min(min(fx, 1. - fx) * 1.8, min(fy, 1. - fy)), sd = min(abs(fy - 0.31), abs(fy - 0.69));
    alb *= mix(0.8, 0.42 + 0.6 * strand + 0.5 * ends * ends, hf) * (0.4 + 0.6 * smoothstep(0., 0.13, ed)) * (0.8 + 0.2 * smoothstep(0., 0.1, sd));
    alb = mix(alb, vec3(0.2, 0.12, 0.05), (1. - smoothstep(0.012, 0.03, sd)) * 0.85);
    gBump = (vec3(-hz.y, 0., hz.x) * (smoothstep(0.86, 1., fx) - (1. - smoothstep(0., 0.14, fx))) + vec3(0., 1., 0.) * (smoothstep(0.8, 1., fy) - (1. - smoothstep(0., 0.2, fy)) + 0.35 * ((1. - smoothstep(0., 0.06, abs(fy - 0.34))) - (1. - smoothstep(0., 0.06, abs(fy - 0.28)))))) * 0.7;
  } else if (part > 13.5) {                                                   // October foliage: leaf masses, mottled gold and rust, holed at the edges
    float lf = vnoise(w.xy * 1.3 + w.z * 0.9) * 0.55 + vnoise(w.zy * 3.7 + w.x * 2.1) * 0.45, lg = vnoise(w.xz * 0.35 + w.y * 0.3);
    if (lf < 0.3 && dist < 400.) discard;
    alb *= (0.4 + 1.1 * lf) * mix(vec3(1.), vec3(1.06, 0.88, 0.5), smoothstep(0.45, 0.7, lg));   // gold to ochre: nothing here is red
    gBump = vec3(lf - 0.5, 0., vnoise(w.yx * 2.9) - 0.5) * 0.9;
  } else if (part > 7.5 && part < 8.5) {                                      // hay
    vec2 a = w.xz * mat2(0.8, 0.6, -0.6, 0.8), b = w.xz * mat2(0.5, -0.87, 0.87, 0.5);
    float s = vnoise(vec2(a.x * 7.3, a.y * 0.9 + w.y * 3.)) * 0.4 + vnoise(vec2(b.x * 11.7, b.y * 1.3 - w.y * 2.)) * 0.35 + vnoise(vec2(a.y * 29., b.y * 4.3)) * 0.25;
    float hf = clamp(1.5 - dist * 0.09, 0., 1.);
    alb *= mix(0.8, 0.5 + 0.95 * s * s, hf) * (0.8 + 0.4 * vnoise(w.xz * 0.5)) * (0.75 + 0.25 * smoothstep(-0.3, 0.4, sin(w.y * 5.6 + 0.5)));
  }
  return alb;
}
`;function _(e,o={}){return new t.ShaderMaterial({name:"ra-lit"+(o.name||""),side:o.side??t.FrontSide,vertexColors:!0,uniforms:{...e,uTint:{value:new t.Color(o.color||"#ffffff")},uGlowPos:{value:o.glowPos||new t.Vector3(0,-999,0)},uGlow:{value:o.glow??0},uAmb:{value:o.amb??1},uSunK:{value:o.sunK??1},uRimK:{value:o.rim??0},uGlowMin:{value:o.glowMin??0},uGlowFall:{value:o.glowFall??.02},uCloudK:{value:o.cloud??0},uEave:{value:o.eave||new t.Vector4(0,0,0,0)},uWrap:{value:o.wrap??0},uAir:{value:o.air||new t.Vector3(0,0,0)},uEdge:{value:o.edge||new t.Vector3(0,1,0)},uGrip:{value:0}},vertexShader:`
      attribute float aPart; uniform float uTime, uGrip; varying vec3 vN, vW, vC, vL; varying float vPart;
      void main(){
        vec3 pos = position, nor = normal;
        // a mitten that grips (uGrip 0..1; only the pair on the sill is ever given it): the thumb is folded in under the palm,
        // the fingers are bent over at the knuckles toward the palm (115 degrees: a fist's hook), and the hand is cocked back
        // at the wrist (43 degrees), as a hand is that holds on to an edge with the forearm lying low behind it. The knit is
        // still drawn from the unbent position (vL), so the stitches bend with the wool
        if (uGrip > 0. && aPart > 8.5 && aPart < 9.5) {
          if (aPart > 9.1) {                                                  // the thumb (part 9.25): swung about the hand's length, in under the palm
            float hs = pos.x > 0. ? 1. : -1., a = -hs * 2.0 * uGrip, c = cos(a), sn = sin(a); vec2 q = pos.xz - vec2(hs * 0.1, 0.03);
            pos.xz = vec2(hs * 0.1, 0.03) + vec2(q.x * c + q.y * sn, -q.x * sn + q.y * c); nor.xz = vec2(nor.x * c + nor.z * sn, -nor.x * sn + nor.z * c);
          }
          float th = 2.0 * uGrip * smoothstep(0.3, 0.44, pos.y), c = cos(th), sn = sin(th); vec2 q = pos.yz - vec2(0.37, 0.045);   // the knuckles: half way up the hand (the pouch is 0.2 to 0.5), turning about a line inside the palm
          pos.yz = vec2(0.37, 0.045) + vec2(q.x * c - q.y * sn, q.x * sn + q.y * c); nor.yz = vec2(nor.y * c - nor.z * sn, nor.y * sn + nor.z * c);
          th = -0.75 * uGrip * smoothstep(0.13, 0.27, pos.y); c = cos(th); sn = sin(th); q = pos.yz - vec2(0.2, -0.03);            // the wrist: where the cuff ends (0.2), turning about a line at the back of it
          pos.yz = vec2(0.2, -0.03) + vec2(q.x * c - q.y * sn, q.x * sn + q.y * c); nor.yz = vec2(nor.y * c - nor.z * sn, nor.y * sn + nor.z * c);
        }
        vec4 p = vec4(pos, 1.);
        #ifdef USE_INSTANCING
        p = instanceMatrix * p; vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * nor);
        #else
        vN = normalize(mat3(modelMatrix) * nor);
        #endif
        #ifdef USE_COLOR
        vC = color;
        #else
        vC = vec3(1.);
        #endif
        vPart = aPart; vL = position;   // one part number per piece: equal at all corners
        #ifdef USE_INSTANCING_COLOR
        vC *= instanceColor;
        #endif
        if (aPart > 13.5) p.xz += vec2(0.3 * sin(uTime * 1.1 + position.x * 0.13 + position.y * 0.21), 0.2 * sin(uTime * 1.6 + position.z * 0.17)) + 0.07 * sin(uTime * 4.3 + position.y * 1.9 + position.x * 2.3);   // wind in the crowns
        vec4 w = modelMatrix * p; vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:Y+Q+`
      uniform vec3 uTint, uGlowPos; uniform float uGlow, uAmb, uSunK, uRimK, uGlowMin, uGlowFall, uCloudK, uWrap; uniform vec4 uEave; uniform vec3 uAir, uEdge;
      varying vec3 vN, vW, vC, vL; varying float vPart;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) n = -n;
        vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
        gStone = uEave.x > 0. ? 1.7 : 1.; float gloss; vec3 alb = surface(vC * uTint, vW, n, vPart, dist, gloss);
        n = normalize(n + gBump);
        if (uEave.x > 0. && vPart > 3.5 && vPart < 4.5) alb *= 0.62 + 0.38 * smoothstep(0.5, 14., vW.y);   // the barn's wall is damp and dark toward the ground
        if (vPart > 8.5 && vPart < 9.5) {                                     // knitted wool, thick: columns of V stitches 2 cm wide, a ribbed turned cuff, a cable up the back of the hand
          float cuffK = 1. - smoothstep(0.165, 0.185, vL.y), kx = vL.x * 50., ky = vL.y * 44., cx = fract(kx) - 0.5;
          float kfade = clamp(1.5 - fwidth(kx) * 1.7, 0., 1.);                                   // stitches only where the lens can hold them
          float st = (1. - 0.5 * smoothstep(0.26, 0.5, abs(cx))) * (0.8 + 0.2 * sin((ky + abs(cx) * 1.2) * 6.2832));
          float ra = atan(vL.z / 0.76, vL.x + step(abs(vL.x) + abs(vL.z), 1e-5)), rib = 0.62 + 0.38 * smoothstep(-0.5, 0.5, cos(ra * 14.));   // the cuff's ribs run up it
          float back = 1. - smoothstep(-0.01, 0.01, vL.z), inY = smoothstep(0.2, 0.24, vL.y) * (1. - smoothstep(0.62, 0.68, vL.y));
          float sw = 0.026 * sin(vL.y * 34.), ca = max(1. - smoothstep(0.011, 0.02, abs(vL.x - sw)), 1. - smoothstep(0.011, 0.02, abs(vL.x + sw)));   // two strands crossing
          float gut = (1. - smoothstep(0.004, 0.012, abs(abs(vL.x) - 0.052))) * back * inY;      // a purl gutter either side of the cable
          float knit = mix(st, rib, cuffK); knit = mix(knit, 0.62 + 0.55 * ca, back * inY * (1. - smoothstep(0.044, 0.05, abs(vL.x)))); knit *= 1. - 0.45 * gut;
          knit *= 1. - 0.3 * (1. - smoothstep(0., 0.012, abs(vL.y - 0.2))) * (1. - cuffK);     // the shadow under the cuff's fold
          alb *= mix(0.86, knit, kfade) * (0.84 + 0.32 * (vnoise(vL.xy * 70.) * 0.6 + vnoise(vL.yz * 23.) * 0.4));
        }
        if (vPart > 0.5 && vPart < 1.5) {                                     // a quilted coat sleeve: stitched channels a hand apart, down filling between them
          float ch = fract(-vL.y / 0.2429), seam = 1. - smoothstep(0., 0.09, min(ch, 1. - ch));
          alb *= (1. - 0.6 * seam) * (0.78 + 0.34 * (vnoise(vL.xy * vec2(46., 19.)) * 0.6 + vnoise(vL.zy * vec2(21., 60.)) * 0.4)) * (0.72 + 0.4 * sin(3.1416 * ch));
          alb *= 1. - 0.35 * (1. - smoothstep(0.004, 0.012, abs(vL.x - 0.3 * vL.z)));           // the sleeve's long seam
        }
        if (vPart > 11.5 && vPart < 12.5) { float bq = dot(vL.xy, vec2(0.38, 0.92)) * 330., bq2 = dot(vL.xy, vec2(-0.6, 0.8)) * 47.; alb *= (1. - 0.2 * (0.5 + 0.5 * sin(bq)) * clamp(1.2 - fwidth(bq) * 0.5, 0., 1.)) * (0.9 + 0.1 * smoothstep(-0.3, 0.3, sin(bq2 + 3. * vnoise(vL.xy * 9.)))); }   // barbs, and the splits in the vane
        if (vPart > 9.5 && vPart < 10.5) alb *= (0.8 + 0.2 * smoothstep(-0.2, 0.35, sin(vL.z * 70. + abs(vL.x) * 22.))) * (0.85 + 0.3 * vnoise(vL.xz * 25.)) * (1. - 0.45 * smoothstep(0.9, 1.5, abs(vL.x)));   // barred plumage
        float ndl = max(dot(n, uSunDir), 0.) * mix(1., 0.3 + 0.7 * cloudSun(vW.xz), uCloudK);
        // the roof's overhang shades the top of the gable: uEave = ridge height, slope, depth of the shadow, strength
        float ev = uEave.x - abs(vW.x + uEave.z * uSunDir.x * 0.6) * uEave.y - vW.y; ndl *= 1. - uEave.w * (1. - smoothstep(uEave.z * 0.7, max(uEave.z, 1e-6), ev)) * step(0.5, abs(n.z));
        vec3 amb = mix(uSkyCol, vec3(dot(uSkyCol, vec3(0.3333))), 0.35) * (0.6 + 0.4 * n.y) + vec3(0.2, 0.15, 0.07) * (0.5 - 0.5 * n.y);   // sky above, the straw's light from below
        vec3 c = alb * (uSunCol * ndl * uSunK + amb * uAmb);
        vec3 hv = normalize(V + uSunDir + vec3(0., 1e-4, 0.)); float sp = max(dot(n, hv), 0.); sp *= sp; sp *= sp; sp *= sp;
        c += uSunCol * gloss * sp * sp * 0.5 * uSunK * step(0., dot(n, uSunDir));
        float fr = 1. - max(dot(n, V), 0.); fr *= fr;
        c += alb * (uSunCol * 0.5 + uSkyCol) * fr * uRimK;                    // nap: wool and feather edges catch the sky
        if (vPart > 8.5 && vPart < 9.5) { float tlm = 0.5 + 0.5 * dot(-V, uSunDir);                                  // against the low sun the wool's nap is lit through, on the sun's side of each hand
          c += uSunCol * vec3(1., 0.2, 0.11) * fr * (0.35 + 0.65 * fr) * smoothstep(0.35, 0.85, tlm) * (0.35 + 0.65 * smoothstep(-0.3, 0.6, dot(n, uSunDir))) * 0.8 * uSunK; }
        vec3 g = uGlowPos - vW; float gd = length(g);
        float gk = uGlow / (1. + gd * gd * uGlowFall);
        float topK = mix(1., 0.15 + 0.85 * smoothstep(-0.2, 0.6, n.y), step(0.001, uWrap));   // a wrapped light rims the top, not the whole outline
        c += alb * vec3(1., 0.7, 0.36) * gk * (max((dot(n, g / max(gd, 1e-3)) + uWrap) / (1. + uWrap), uGlowMin) + fr * uRimK * 0.9 * topK);
        if (vPart > 8.5 && vPart < 9.5) c += vec3(1., 0.5, 0.26) * gk * fr * 0.42 * topK * step(0.001, uWrap);   // the wool's nap catches the ring
        if (vPart > 11.5 && vPart < 12.5) c += alb * alb * vec3(1., 0.76, 0.44) * gk * 0.6 * max(-dot(n, g / max(gd, 1e-3)), 0.);   // the ring's light comes through our own vanes
        // uEdge = the plane (z) of a frame's outer arris, how far the wear goes in, strength: the worn edge of the timber, the
        // dust and hay stuck to it, catch the sun that stands beyond the door, so each post ends in a thin line of light
        if (uEdge.z > 0.) { float eg = 1. - smoothstep(0., max(uEdge.y, 1e-4), abs(vW.z - uEdge.x)), ch = vnoise(vec2(vW.y * 7., vW.x * 3.)) * 0.6 + vnoise(vec2(vW.y * 31., vW.x * 9.)) * 0.4;
          c *= 1. - 0.5 * smoothstep(0.62, 0.7, vnoise(vec2(vW.z * 23. + vW.x * 17., vW.y * 0.9)));                         // drying checks run up the post: dark under the sun, the sky and the ring's light alike
          c += uSunCol * vec3(1., 0.74, 0.42) * eg * eg * uEdge.z * (1. - abs(n.z)) * (0.25 + 0.75 * cloudSoft(vW.xz)) * (0.35 + 1.1 * ch); }   // on the reveals only: the frame's outer face is the wall's face
        // the coat (part 1, the sleeve): whatever light falls on it, on screen it is never bluer than the coat's own colour
        // #2B2F3A (blue 58 to red 43: 1.35). The tone map's toe and the grade steepen a linear ratio in the darks (measured:
        // linear 1.75 came out 1.6 to 1.7 in the mid tones and over 3 near black), so the linear cap is 1.2 for blue and 1.06
        // for green: a slate grey. The sky's fill cannot turn it navy; the sun and the ring may still warm it
        if (vPart > 0.5 && vPart < 1.5) c.gb = min(c.gb, c.r * vec2(1.06, 1.2));
        c = foggedDir(c, dist, V);
        // uAir = density, the door's plane, brightness: dust hanging in the loft, lit by the ring and the slits; only the
        // part of the sight line that lies inside the loft counts, so from the valley the doorway stays dark
        float inside = dist * clamp((uAir.y - vW.z) / max(cameraPosition.z - vW.z, 1e-3), 0., 1.);
        c = mix(c, vec3(1., 0.7, 0.38) * uAir.z, 1. - exp(-inside * uAir.x));
        gl_FragColor = vec4(c, 1.);
      }`})}function le(e,{eye:o,pitchDeg:s=8,yaw:i=Math.PI}){const v=e.renderer,r=v.getDrawingBufferSize(new t.Vector2),u=k=>Math.min(64,Math.max(50,2*Math.atan(.829/Math.max(k,.1))*180/Math.PI)),n=new t.PerspectiveCamera(u(r.x/Math.max(1,r.y)),r.x/Math.max(1,r.y),.15,4e3);n.position.copy(o),n.rotation.set(s*Math.PI/180,i,0,"YXZ"),n.updateMatrixWorld(!0);const h=(e.quality?.detail??1)<.8?0:4,a=new t.WebGLRenderTarget(Math.max(2,r.x),Math.max(2,r.y),{type:t.HalfFloatType,samples:h,depthBuffer:!0});a.texture.minFilter=a.texture.magFilter=t.LinearFilter,a.texture.generateMipmaps=!1;const g=new t.Mesh(new t.PlaneGeometry(2,2),new t.ShaderMaterial({name:"ra-cut",uniforms:{uMap:{value:a.texture}},depthTest:!0,depthFunc:t.AlwaysDepth,depthWrite:!0,fog:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform sampler2D uMap; varying vec2 vUv; void main(){ gl_FragColor = vec4(max(texture2D(uMap, vUv).rgb, 0.), 1.); }"}));g.name="ra-cut-quad",g.frustumCulled=!1,g.matrixAutoUpdate=!1,g.renderOrder=9999,g.visible=!1;const m=new t.Vector2,p=new t.Matrix4,z=new t.Vector3;return{camB:n,quad:g,target:a,render(k){v.getDrawingBufferSize(m);const M=Math.max(2,Math.round(m.x)),F=Math.max(2,Math.round(m.y));(M!==a.width||F!==a.height)&&(a.setSize(M,F),n.aspect=M/F,n.fov=u(M/F),n.updateProjectionMatrix());const l=v.getRenderTarget(),d=v.autoClear;v.autoClear=!0,v.setRenderTarget(a),v.render(k,n),v.setRenderTarget(l),v.autoClear=d},place(k){const M=k.projectionMatrix.elements,F=.5;z.set(F/Math.max(1e-4,M[0])*1.002,F/Math.max(1e-4,M[5])*1.002,1),p.makeTranslation(0,0,-F).scale(z),g.matrix.copy(k.matrixWorld).multiply(p),g.matrixWorldNeedsUpdate=!0},dispose(){a.dispose()}}}function he(e){const o=new t.ShaderMaterial({name:"ra-glint",transparent:!0,depthWrite:!1,blending:t.NormalBlending,uniforms:{...e,uPos:{value:new t.Vector3},uPx:{value:5},uGain:{value:1},uFlut:{value:0},uCol:{value:new t.Color(1,.985,.95)},uDash:{value:1}},vertexShader:Y+`
      uniform vec3 uPos; uniform float uPx; varying vec2 vQ;
      void main(){
        vec4 c = projectionMatrix * viewMatrix * vec4(uPos, 1.);
        c.xy += position.xy * (uPx * 4.) / max(uRes, vec2(1.)) * c.w;
        vQ = position.xy * 4.; gl_Position = c;
      }`,fragmentShader:Y+`
      uniform float uGain, uFlut, uDash; uniform vec3 uCol; varying vec2 vQ;
      void main(){
        float r = length(vQ), p = mix(pulse(uBeat), 0.6 + 0.25 * sin(uTime * 4.3) + 0.15 * sin(uTime * 9.1), uFlut);
        float disc = 1. - smoothstep(0.5, 1.05, r), ax = abs(vQ.x);
        float th = mix(0.8, -0.55, p), wy = vQ.y - ax * th * (1. - 0.1 * ax);      // two wings: up, then struck down on the beat
        float dash = (1. - smoothstep(0.2, 0.46, abs(wy))) * (1. - smoothstep(1.9, 2.7, ax * sqrt(1. + th * th))) * uDash;
        float halo = (1. - smoothstep(0.5, 3.6, r)); halo *= halo * 0.2 * (0.4 + 0.6 * p);
        float a = clamp(max(disc, dash) + halo, 0., 1.) * uGain;
        gl_FragColor = vec4(uCol * 2.3 * (0.5 + 0.5 * p), a);
      }`}),s=new t.Mesh(new t.PlaneGeometry(2,2),o);return s.name="ra-glint",s.frustumCulled=!1,s.renderOrder=50,s.visible=!1,{mesh:s,mat:o,setPos(i){o.uniforms.uPos.value.copy(i)}}}function ce(e){const o=new t.ShaderMaterial({name:"ra-loose-feather",transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...e,uPos:{value:new t.Vector3},uPx:{value:12},uGain:{value:0},uTop:{value:0},uWind:{value:0}},vertexShader:Y+`
      uniform vec3 uPos; uniform float uPx, uTop, uWind; varying vec2 vQ; varying float vFl;
      void main(){
        vec4 c = projectionMatrix * viewMatrix * vec4(uPos + vec3(uWind * max(uTop - uPos.y, 0.), 0., 0.), 1.);
        float spin = uTime * 1.9 + 0.7 * sin(uTime * 0.6), fl = abs(cos(spin));                       // about its own length: flat, edge on, flat: under two flashes a second
        // it lies across its fall and swings like a pendulum: 60 degrees from upright, 30 and 15 either way, so never nearer upright than 14 degrees
        float a = 1.05 + 0.55 * sin(uTime * 1.1) + 0.25 * sin(uTime * 2.3), ca = cos(a), sa = sin(a), px = uPx * 2.2;
        // the axis it turns about is not quite its quill (the quill is bowed and heavy at its bare end): edge on, its tip has swung
        // toward or away from the eye and three fifths of its length is seen. The vanes narrow in the fragment shader, so the bow stays
        vec2 o = vec2(position.x * 0.42, position.y * (0.6 + 0.4 * fl));
        o = vec2(o.x * ca - o.y * sa, o.x * sa + o.y * ca);
        c.xy += o * px / max(uRes, vec2(1.)) * c.w * 2.;
        vQ = position.xy; vFl = fl; gl_Position = c;   // one turn for the whole feather: equal at all corners
      }`,fragmentShader:Y+`
      uniform float uGain; varying vec2 vQ; varying float vFl;
      void main(){
        float y = clamp(vQ.y * 0.5 + 0.5, 0., 1.), x = vQ.x - 0.3 * sin(3.1416 * y) + 0.15;            // the quill is bowed
        float wd = sqrt(max(sin(3.1416 * y), 0.)) * (0.5 + 0.5 * y) * smoothstep(0.1, 0.24, y);       // vanes from above the bare quill to a round tip
        float vane = 1. - smoothstep(0.75, 1., abs(x) / max(wd * (x > 0. ? 0.8 : 0.42) * max(vFl, 0.2), 1e-4));  // a broad vane and a narrow one; edge on they keep a fifth of their breadth
        float shaft = 1. - smoothstep(0.03, 0.12, abs(x)), quill = shaft * (1. - smoothstep(0.92, 1., y));
        float a = max(vane, quill * 0.9), flatK = smoothstep(0.15, 0.8, vFl);
        vec3 lit = vec3(1.3, 1.26, 1.14) + uSunCol * 0.55 * smoothstep(0.82, 1., vFl);                 // flat to us it takes the sun
        vec3 col = mix(vec3(0.5, 0.54, 0.63), lit, flatK) * (1. - 0.4 * shaft * flatK) * (0.85 + 0.15 * y);
        gl_FragColor = vec4(col, a * uGain);
      }`}),s=new t.Mesh(new t.PlaneGeometry(2,2),o);return s.name="ra-loose-feather",s.frustumCulled=!1,s.renderOrder=50,s.visible=!1,{mesh:s,mat:o,setPos(i){o.uniforms.uPos.value.copy(i)}}}const J=`
  attribute vec4 aF;   // kind (0 primary, 1 secondary, 2 tail, 3 under covert of the hand, 4 under covert of the arm), index 0..1, side, length
  varying vec2 vFl; varying vec3 vN, vW; varying float vKind;
  const float ARM = 0.5, HAND = 0.32, TAU = 6.2831853;
  void main(){
    float kind = aF.x, t = aF.y, side = aF.z, len = aF.w, w = position.x, l = position.y;
    float cov = step(2.5, kind), hand = (kind < 0.5 || (kind > 2.5 && kind < 3.5)) ? 1. : 0.;
    float ph = TAU * (uBeat - 0.25);
    float a = mix(0.96, 0.26, uBrake) * cos(ph) + mix(0.06, 0.2, uBrake);          // shoulder, +-55 degrees; a raised V to brake
    float aw = 0.5 * cos(ph - TAU * 0.12) * (1. - 0.5 * uBrake) - 0.12;            // wrist, lagging
    float down = max(sin(ph), 0.);
    float wd = (cov > 0.5 ? 0.23 : kind < 0.5 ? mix(0.15, 0.112, uBrake) : kind < 1.5 ? 0.2 : 0.15) * (0.5 + 0.5 * smoothstep(0., 0.25, l)) * (1. - mix(0.8, 0.5, cov) * smoothstep(0.72, 1., l) * smoothstep(0.72, 1., l));   // a covert is broad and round-ended
    vec3 p, n;
    if (kind < 1.5 || cov > 0.5) {
      float ang = hand > 0.5 ? mix(1.2, 0.07, t) + uBrake * mix(-0.22, -0.6, t) : mix(1.52, 1.32, t) - 0.1 * uBrake * t;   // braking: the hand opens like fingers
      float rootX = hand > 0.5 ? ARM + HAND * t : ARM * (0.06 + 0.94 * t);
      vec2 dir = vec2(cos(ang), sin(ang)), per = vec2(-dir.y, dir.x);
      vec2 P = vec2(rootX, -0.03 - 0.04 * cov) + dir * (l * len) + per * (w * wd);                  // the coverts start ahead of the quills: they wrap the arm's leading edge
      float lift = (hand > 0.5 ? 0.004 + 0.006 * t : -0.004 + 0.003 * t) + w * 0.012 + 0.02 * sin(3.1416 * l) * (1. + uBrake);
      lift = mix(lift, -0.012 - 0.05 * (0.3 - len) + w * 0.01 - 0.012 * sin(3.1416 * l), cov);        // under the wing, the shorter row lying over the longer
      float xs = max(P.x, 0.), xi = min(xs, ARM), xo = max(xs - ARM, 0.), s = clamp(xs / 1.45, 0., 1.);
      float an = a + aw * (1. - 0.6 * uBrake) + 0.3 * s * s * (down + 0.35 * uBrake) * 1.3;                // tips bend up on the downstroke
      vec2 q = xi * vec2(cos(a), sin(a)) + xo * vec2(cos(an), sin(an));
      float au = xs < ARM ? a : an;
      n = vec3(-side * sin(au), cos(au), 0.);
      p = vec3(side * (0.09 + q.x), 0.05 + q.y, P.y) + n * lift;
    } else {
      float fan = mix(0.3, 1.05, uBrake), ang = (t * 2. - 1.) * fan;                // tail: 35 to 120 degrees
      vec2 dir = vec2(sin(ang), cos(ang)), per = vec2(dir.y, -dir.x);
      vec2 P = dir * (0.05 + l * len) + per * (w * wd);
      float dr = -0.22 * uBrake;                                                    // the fan tips down as a brake
      float y = 0.012 * abs(t - 0.5) + w * 0.01, z = P.y;
      p = vec3(P.x, 0.02 + y * cos(dr) + z * sin(dr), 0.24 + z * cos(dr) - y * sin(dr));
      n = vec3(0., cos(dr), -sin(dr));
    }
    float bp = 0.96 * uBrake, cb = cos(bp), sb = sin(bp);                          // body pitched up 50 degrees
    p = vec3(p.x, p.y * cb - p.z * sb, p.y * sb + p.z * cb); n = vec3(n.x, n.y * cb - n.z * sb, n.y * sb + n.z * cb);
    vFl = vec2(w, l); vKind = kind;   // smooth across the blade
    vN = normalize(mat3(modelMatrix) * n);
    vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp;
  }`,$=`
  uniform float uFade; varying vec2 vFl; varying vec3 vN, vW; varying float vKind;
  void main(){
    vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
    vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(n, V) < 0.) n = -n;
    float ndl = dot(n, uSunDir), fw = fwidth(vFl.x) + 1e-4;
    float shaft = (1. - smoothstep(0.03, 0.03 + max(fw, 0.03), abs(vFl.x))) * clamp(0.1 / fw, 0., 1.) * (1. - smoothstep(0.8, 0.97, vFl.y));
    float barb = 0.93 + 0.07 * sin(vFl.y * 90. + abs(vFl.x) * 40.) * clamp(0.3 / fw - 1., 0., 1.);
    float ax = abs(vFl.x), edge = smoothstep(0.5, 0.3, ax);
    vec3 alb = vec3(0.82, 0.81, 0.78) * barb * (0.86 + 0.14 * edge);
    float tl = 0.5 + 0.5 * dot(-V, uSunDir), back = smoothstep(0.3, 0.7, tl);      // the sun behind the bird for this eye: both wings are lit through alike
    vec3 c = shadeLit(alb, n, 1. - back) + alb * vec3(0.5, 0.47, 0.42) * 0.32 * (1. - 0.5 * back);   // the straw fields' light from below
    // the sun behind the vane: every feather is a translucent blade, cream where one layer lets the light through,
    // amber and cooler where the next feather or the coverts lie over it, the shaft dark, the edge and tip burning
    float over = 1. - smoothstep(0.08, 0.6, vFl.y);                                // under the coverts
    float lap = smoothstep(0.0, 0.26, vFl.x) * (1. - smoothstep(0.5, 0.95, vFl.y)); // the half that lies under the next feather
    float thin = clamp(1. - 0.5 * over - 0.42 * lap, 0., 1.);
    float cov = (1. - smoothstep(0., 0.05, abs(vFl.y - 0.3 - 0.05 * cos(vFl.x * 6.2832)))) + (1. - smoothstep(0., 0.04, abs(vFl.y - 0.52 - 0.04 * cos(vFl.x * 6.2832)))) * step(0.5, vKind) * step(vKind, 1.5);   // the scalloped edges of the coverts
    float isCov = step(2.5, vKind);                                                 // an under covert: soft, close, nearly opaque, its round end catching the light
    // the flight feathers (primaries, secondaries, tail) are lit through as they always were: amber to cream, each free edge
    // and tip burning, the shaft a dark line down every blade. The under coverts have their own, quieter light
    vec3 through = mix(mix(vec3(0.8, 0.36, 0.09), vec3(0.86, 0.46, 0.16), isCov), mix(vec3(1., 0.79, 0.4), vec3(1., 0.86, 0.56), isCov), thin * (0.55 + 0.45 * smoothstep(0.15, 0.85, vFl.y))) * uSunCol * 0.8;
    c = mix(c, c * vec3(0.5, 0.55, 0.76), back * 0.7);
    c += through * back * tl * tl * mix(0.6 * (0.22 + 0.78 * thin), 0.2 * (0.3 + 0.7 * thin), isCov) * (1. - 0.35 * cov * (1. - isCov)) * (0.9 + 0.1 * barb);
    float rim = min(smoothstep(0.37, 0.48, -vFl.x) * mix(1., smoothstep(0.3, 0.75, vFl.y), isCov) + smoothstep(0.91, 0.99, vFl.y), 1.);   // the free edge and the tip burn
    c += vec3(1., 0.88, 0.66) * mix(1.2, 0.3, isCov) * rim * back * tl;
    c = mix(c, c * (0.82 + 0.3 * smoothstep(0.55, 0.95, vFl.y)) + vec3(0.16, 0.17, 0.2) * (1. - smoothstep(0.1, 0.6, vFl.y)), isCov);   // each covert shades the root of the next
    c *= 1. - mix(0.85, 0.12, isCov) * shaft;
    c = mix(c, vec3(1.32, 1.28, 1.2) * (0.82 + 0.18 * edge), 0.9 * smoothstep(60., 170., dist));   // far off the bird is simply white: a fleck with wings
    c = min(c, vec3(2.0));
    gl_FragColor = vec4(fogged(c, dist), 1.);
  }`;function c(e,o,s=0){const i=e.index?e.toNonIndexed():e,v=i.attributes.position.count,r=new t.Color(o),u=new Float32Array(v*3),n=new Float32Array(v);for(let h=0;h<v;h++)u[h*3]=r.r,u[h*3+1]=r.g,u[h*3+2]=r.b,n[h]=s;return i.setAttribute("color",new t.BufferAttribute(u,3)),i.setAttribute("aPart",new t.BufferAttribute(n,1)),i.deleteAttribute("uv"),i}function Z(e){let o=0;for(const r of e)o+=r.attributes.position.count;const s=new t.BufferGeometry,i=["position","normal","color","aPart"],v=[3,3,3,1];i.forEach((r,u)=>{const n=new Float32Array(o*v[u]);let h=0;for(const a of e){const g=a.attributes[r];g&&n.set(g.array,h),h+=a.attributes.position.count*v[u]}s.setAttribute(r,new t.BufferAttribute(n,v[u]))});for(const r of e)r.dispose();return s}const b=(e,o,s,i,v=0,r=0,u=0,n=1,h=n,a=n)=>(e.applyMatrix4(new t.Matrix4().compose(new t.Vector3(o,s,i),new t.Quaternion().setFromEuler(new t.Euler(v,r,u)),new t.Vector3(n,h,a))),e);function ee(e){const o=new t.Group;o.name="ra-pigeon";const s=new t.PlaneGeometry(1,1,2,5);s.translate(0,.5,0);const i=[];for(const l of[-1,1]){for(let d=0;d<10;d++)i.push(0,d/9,l,.62+.13*Math.sin(Math.PI*(.25+.75*d/9)));for(let d=0;d<8;d++)i.push(1,d/7,l,.4+.07*(d/7));for(let d=0;d<9;d++)i.push(3,d/8,l,.27-.05*(d/8));for(let d=0;d<10;d++)i.push(4,d/9,l,.04+.3*(.4+.07*(d/9)));for(let d=0;d<10;d++)i.push(4,(d+.5)/10,l,.04+.15*(.4+.07*((d+.5)/10)))}for(let l=0;l<12;l++)i.push(2,l/11,0,.42-.08*Math.abs(l/11-.5));const v=new t.InstancedBufferGeometry().copy(s);v.instanceCount=i.length/4,v.setAttribute("aF",new t.InstancedBufferAttribute(new Float32Array(i),4));const r=new t.ShaderMaterial({name:"ra-feather",side:t.DoubleSide,uniforms:{...e,uFade:{value:1}},vertexShader:Y+J,fragmentShader:Y+$}),u=new t.Mesh(v,r);u.frustumCulled=!1,u.name="ra-feathers",o.add(u);const n=(l,d=14,w=10)=>new t.SphereGeometry(l,d,w),h="#EDE9DF",a=[c(b(n(1,18,14),0,0,0,0,0,0,.122,.112,.27),h),c(b(n(1,14,12),0,.05,-.2,.35,0,0,.076,.078,.12),h),c(b(n(1,18,14),0,-.022,-.09,.25,0,0,.13,.124,.16),h),c(b(n(1,12,10),0,-.012,.25,-.12,0,0,.075,.05,.15),h),c(b(n(1,12,10),.105,.035,-.03,0,.2,0,.07,.062,.14),h),c(b(n(1,12,10),-.105,.035,-.03,0,-.2,0,.07,.062,.14),h),c(b(n(1,16,12),0,.085,-.29,.2,0,0,.066,.07,.078),h,2),c(b(n(1),0,.104,-.318,0,0,0,.05,.045,.05),h,2),c(b(new t.ConeGeometry(.017,.085,8),0,.066,-.39,-Math.PI/2-.22,0,0),"#4A3E3A",2),c(b(n(1,8,6),.011,.083,-.362,0,0,0,.016,.013,.021),"#F4F0E8",2),c(b(n(1,8,6),-.011,.083,-.362,0,0,0,.016,.013,.021),"#F4F0E8",2),c(b(n(1,10,8),.045,.1,-.338,0,.55,0,.0085,.02,.02),"#CFC8BC",2),c(b(n(1,10,8),.0485,.1,-.343,0,.55,0,.0085,.0155,.0155),"#0B0908",2),c(b(n(.0035,5,4),.052,.106,-.353),"#FFFFFF",2),c(b(n(1,10,8),-.045,.1,-.338,0,-.55,0,.0085,.02,.02),"#CFC8BC",2),c(b(n(1,10,8),-.0485,.1,-.343,0,-.55,0,.0085,.0155,.0155),"#0B0908",2),c(b(n(.0035,5,4),-.052,.106,-.353),"#FFFFFF",2)],g=(l,d)=>new t.CylinderGeometry(d*.6,d,l,5).translate(0,l/2,0);for(const l of[-1,1]){a.push(c(b(n(1,8,6),l*.045,-.085,.03,0,0,0,.03,.05,.035),h,1)),a.push(c(b(new t.CylinderGeometry(.008,.009,.1,6),l*.045,-.165,.03),"#B58E84",1));for(const d of[-.45,0,.45])a.push(c(b(g(.075,.0075),l*.045,-.213,.03,-Math.PI/2-.12,0,d),"#B58E84",1));a.push(c(b(g(.035,.007),l*.045,-.213,.03,Math.PI/2+.12,0,0),"#B58E84",1))}a.push(c(b(new t.CylinderGeometry(.019,.019,.055,8),-.045,-.158,.03),"#D9A441",1));const m=new t.ShaderMaterial({name:"ra-bird-body",vertexColors:!0,uniforms:{...e},vertexShader:Y+`
      attribute float aPart; varying vec3 vN, vW, vC, vL;
      void main(){
        vec3 p = position, n = normal; vL = position;
        if (aPart > 0.5 && aPart < 1.5) { float f = mix(1.25, -0.75, uBrake), c = cos(f), s = sin(f); vec3 h = vec3(0., -0.07, 0.03), q = p - h;   // feet: tucked back, then thrown forward
          p = h + vec3(q.x, q.y * c - q.z * s, q.y * s + q.z * c); n = vec3(n.x, n.y * c - n.z * s, n.y * s + n.z * c); }
        float bp = 0.96 * uBrake, cb = cos(bp), sb = sin(bp);
        if (aPart > 1.5) { vec3 nk = vec3(0., 0.05, -0.22), hq = p - nk; float hd = -0.42 * uBrake, hc = cos(hd), hs = sin(hd);   // the head does not pitch with the body: it bows 24 degrees, to look at whoever waits below it
          hq = vec3(hq.x, hq.y * hc - hq.z * hs, hq.y * hs + hq.z * hc); n = vec3(n.x, n.y * hc - n.z * hs, n.y * hs + n.z * hc);
          p = vec3(0., nk.y * cb - nk.z * sb + 0.02 * uBrake, nk.y * sb + nk.z * cb) + hq; }
        else { p = vec3(p.x, p.y * cb - p.z * sb, p.y * sb + p.z * cb); n = vec3(n.x, n.y * cb - n.z * sb, n.y * sb + n.z * cb); }
        vN = normalize(mat3(modelMatrix) * n); vC = color;
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:Y+`
      varying vec3 vN, vW, vC, vL;
      void main(){
        vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
        vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
        // breast and neck in overlapping scalloped feathers, smaller toward the head: each one's lower edge catches the light
        float sz = mix(40., 24., smoothstep(-0.3, 0.05, vL.z)); vec2 k = vec2(atan(vL.x, 0.16 - vL.y) * sz * 0.16, vL.z * sz); float row = floor(k.y); k.x += 0.5 * mod(row, 2.); vec2 kf = fract(k);
        float sd = length(vec2(kf.x - 0.5, (kf.y - 0.1) * 0.9)), sk = clamp(1.6 - dist * 0.14, 0., 1.) * step(0.5, vC.g) * step(vC.b, 0.95);
        float scal = (smoothstep(0.34, 0.52, sd) - 0.5 * (1. - smoothstep(0., 0.3, kf.y))) * sk;
        float rim = 1. - max(dot(n, V), 0.); rim *= rim * rim; float tl = 0.5 + 0.5 * dot(-V, uSunDir);
        float flank = smoothstep(-0.55, 0.35, dot(n, uSunDir));                    // the light wraps round from behind
        vec3 c = shadeLit(vC * 0.86, n, 1.) * 0.66 + vC * vec3(0.33, 0.3, 0.54) * 0.36 * (0.75 + 0.25 * n.y) + vC * vec3(0.52, 0.52, 0.6) * 0.5;   // a white bird: even its shade side is pale
        c *= 1. - 0.1 * smoothstep(0.36, 0.5, sd) * sk; c += vec3(1., 0.85, 0.62) * 0.05 * max(-scal, 0.);    // each breast feather's edge lies in the next one's shade; the whole in its own soft blue-violet shadow, so the face reads
        c += vec3(1., 0.88, 0.66) * rim * flank * 2.2 * tl * step(0.5, vC.g);
        c = mix(c, vC * vec3(1.35, 1.32, 1.25), 0.85 * smoothstep(60., 170., dist));
        gl_FragColor = vec4(fogged(min(c, vec3(2.6)), dist), 1.);
      }`}),p=new t.Mesh(Z(a),m);p.frustumCulled=!1,p.name="ra-bird-body",o.add(p);const z=new t.Vector3,k=new t.Matrix4,M=new t.Vector3(0,1,0),F=new t.Vector3;return{group:o,feathers:u,body:p,place(l,d){z.copy(d).negate(),k.lookAt(z,F,M),o.quaternion.setFromRotationMatrix(k),o.position.copy(l)}}}const te=`
  attribute vec4 aF;   // kind (0 primary, 1 greater covert, 2 median covert, 5.. marginal coverts by row), place, length, side
  uniform float uStroke; varying vec2 vFl; varying vec3 vN, vW, vK;
  void main(){
    float kind = aF.x, t = aF.y, len = aF.z, side = aF.w, w = position.x, l = 1. - (1. - position.y) * (1. - position.y);   // the blade's rows crowd toward the tip, where it rounds
    float ph = 6.2831853 * (uBeat - 0.25), down = max(sin(ph), 0.) * uStroke;                         // the dove's downstroke: the same half of the same beat
    float open = smoothstep(0.15, 0.33, uBeat) * (1. - smoothstep(0.62, 0.9, uBeat)) * uStroke;      // the fan is open through the downstroke, shut on the way back up
    float cov = (kind > 0.5 && kind < 2.5) || kind > 3.5 ? 1. : 0., marg = step(4.5, kind), row = kind - 5.;
    vec2 arm = vec2(-0.92, 0.39), root, dir; float wd, lift, flex = 0.4 * (1. - open);   // the wrist flexes 23 degrees on the upstroke
    if (kind < 2.5) {                                                         // the hand: quills set along 0.17 m of hand bone, the outermost at its end
      float ang = (0.04 + 0.86 * t) * mix(0.55, 1., open) + flex;            // nine quills fanned through 49 degrees when open, 27 when shut
      root = vec2(0.17 * (1. - t), -0.012 - 0.02 * cov); dir = vec2(cos(ang), sin(ang));
      wd = (cov > 0.5 ? 0.1 : mix(0.1, 0.125, t)) * (0.45 + 0.55 * smoothstep(0., 0.3, l));
      float em = (1. - smoothstep(0.2, 0.45, t)) * smoothstep(0.42, 0.6, l) * (1. - cov);   // the three outer primaries are cut away toward the tip: open, they stand apart as fingers
      float l3 = l * l * l; wd *= (1. - 0.38 * em) * sqrt(max(1. - l3 * l3 * mix(1., l3, cov), 0.));   // a round tip, rounder still on a covert
      lift = 0.004 + 0.016 * t - w * 0.012 + cov * (0.012 + 0.008 * (kind - 1.));
    } else {                                                                  // marginal coverts: small round scales in rows along the leading edge, hand and arm
      float sp = 0.17 - t * 0.6;                                              // along the edge, metres from the wrist: from the end of the hand bone (+0.17) back along the arm (to -0.43)
      vec2 along = sp > 0. ? vec2(1., 0.) : arm, back = sp > 0. ? vec2(0.08, 1.) : vec2(0.39, 0.92);
      root = along * abs(sp) + back * (-0.045 + 0.03 * row); dir = normalize(back + along * 0.25 * sign(sp));
      float l3 = l * l * l; wd = 0.062 * (0.6 + 0.4 * smoothstep(0., 0.3, l)) * sqrt(max(1. - l3 * l3, 0.));
      lift = 0.05 - 0.009 * row + w * 0.004 + 0.006 * sin(3.1416 * l);       // the leading edge is a round limb, thickest at its front
    }
    vec2 q = root + dir * (l * len) + vec2(-dir.y, dir.x) * (w * wd + 0.07 * l * l * len * (1. - marg));   // a quill is not straight: it curves back toward the trailing edge
    float sx = clamp(q.x / 0.9, 0., 1.), bend = 0.26 * sx * sx * down * (1. - marg);                 // tips bend up on the downstroke (the dove's 0.3 rad at the tip)
    lift += 0.02 * sin(3.1416 * l) * (1. - cov);                                                    // each vane is a shallow arch
    // the wing's plane in the carried frame (x right, y up, z toward the eye): the span runs in from the corner, down and
    // away from the eye, so the tips are 0.4 m further off than the wrist and the arm comes back past the eye's side
    vec3 A = normalize(vec3(-0.60, -0.62, -0.50)), Bv = normalize(vec3(-0.72, 0.55, 0.20)), Nu = normalize(cross(A, Bv));
    // the wrist stands 0.23 m in and 0.21 m down from the point the pair is carried by; folded in the hands (uStroke 0) it is drawn
    // back 0.3 m to our flank, so that only the shut quills lie beside us
    vec3 p = vec3(-0.23 + 0.3 * (1. - uStroke), -0.21, 0.10) + A * q.x + Bv * q.y - Nu * lift + Nu * bend;
    vec3 n = normalize(-Nu + A * (0.58 * sx * down * (1. - marg)) + Bv * (w * 0.12));   // toward the eye: we look at the wing's underside; the bent tip turns its face
    p.x *= side; n.x *= side;
    vFl = vec2(w, l); vK = vec3(cov, marg, kind);   // one kind per feather: equal at all corners
    vN = normalize(mat3(modelMatrix) * n);
    vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp;
  }`,oe=`
  uniform vec3 uGlowPos; uniform float uAmb, uGlow, uGlowFall, uGlowMin, uWrap; varying vec2 vFl; varying vec3 vN, vW, vK;
  void main(){
    vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
    vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(n, V) < 0.) n = -n;
    float isCov = vK.x, marg = vK.y, fw = fwidth(vFl.x) + 1e-4, ax = abs(vFl.x + 0.22 * (1. - isCov)), edge = 1. - smoothstep(0.3, 0.5, abs(vFl.x));   // a flight feather's shaft lies toward its leading edge: the narrow vane, the one the next feather leaves bare
    float shaft = (1. - smoothstep(0.025, 0.025 + max(fw, 0.03), ax)) * clamp(0.1 / fw, 0., 1.) * (1. - smoothstep(0.8, 0.97, vFl.y));
    float barb = 0.93 + 0.07 * sin(vFl.y * 90. + ax * 40.) * clamp(0.3 / fw - 1., 0., 1.);
    vec3 alb = vec3(0.82, 0.81, 0.78) * barb * (0.86 + 0.14 * edge);
    float tl = 0.5 + 0.5 * dot(-V, uSunDir), back = smoothstep(0.3, 0.7, tl);      // the sun behind this wing for our eye: it is lit through, as the dove's are from the loft
    // the next feather lies over this one's trailing half and throws a soft shade on it; a covert shades the root beneath it
    float lap = smoothstep(0.0, 0.26, vFl.x) * (1. - smoothstep(0.5, 0.95, vFl.y)), over = (1. - smoothstep(0.08, 0.6, vFl.y)) * (1. - isCov);
    float d = max(dot(n, uSunDir), 0.) * (1. - back);
    vec3 amb = uSkyCol * (0.8 + 0.2 * n.y) + vec3(0.06, 0.05, 0.04) * (0.5 - 0.5 * n.y);
    float thin = clamp(1. - 0.5 * over - 0.42 * lap, 0., 1.);
    // the dove's light: sun, sky, the straw fields from below (we see the wing's underside, which faces them); and where the sun
    // falls on the far side of a vane a part of it comes through, so a white wing's shade side is pale, never grey
    vec3 c = alb * (uSunCol * d + amb * (uAmb / 1.2)) + alb * vec3(0.5, 0.47, 0.42) * 0.5 * (1. - 0.5 * back) * (uAmb / 1.2);
    c += alb * uSunCol * vec3(1., 0.9, 0.72) * 0.3 * max(dot(-n, uSunDir), 0.) * (0.4 + 0.6 * thin) * (1. - back);
    c *= 1. - 0.3 * lap * (1. - 0.6 * isCov) - 0.22 * over;
    vec3 through = mix(mix(vec3(0.8, 0.36, 0.09), vec3(0.86, 0.46, 0.16), isCov), mix(vec3(1., 0.79, 0.4), vec3(1., 0.86, 0.56), isCov), thin * (0.55 + 0.45 * smoothstep(0.15, 0.85, vFl.y))) * uSunCol * 0.8;
    c = mix(c, c * vec3(0.62, 0.66, 0.82), back * 0.7);
    c += through * back * tl * tl * mix(0.75 * (0.22 + 0.78 * thin), 0.42 * (0.3 + 0.7 * thin), isCov) * (0.9 + 0.1 * barb);
    float rim = min(smoothstep(0.37, 0.48, -vFl.x) * mix(1., smoothstep(0.3, 0.75, vFl.y), isCov) + smoothstep(0.91, 0.99, vFl.y), 1.);   // the free edge and the tip burn
    c += vec3(1., 0.88, 0.66) * mix(1.2, 0.3, isCov) * rim * back * tl;
    c = mix(c, c * (0.86 + 0.24 * smoothstep(0.55, 0.95, vFl.y)) + vec3(0.16, 0.17, 0.2) * (1. - smoothstep(0.1, 0.6, vFl.y)) * (uAmb / 1.2), isCov * (1. - 0.6 * marg) * 0.7);   // each covert shades the root of the next
    c *= 1. - mix(0.85, 0.12, isCov) * shaft;
    // the ring's light in the loft: on the faces turned to it, and through the vanes that stand against it
    vec3 g = uGlowPos - vW; float gd = length(g), gk = uGlow / (1. + gd * gd * uGlowFall), gn = dot(n, g / max(gd, 1e-3));
    c += alb * vec3(1., 0.7, 0.36) * gk * max((gn + uWrap) / (1. + uWrap), uGlowMin) * (1. - 0.6 * shaft);
    c += alb * alb * vec3(1., 0.76, 0.44) * gk * 0.6 * max(dot(-V, g / max(gd, 1e-3)), 0.) * thin * (1. - isCov);
    gl_FragColor = vec4(fogged(min(c, vec3(2.0)), dist), 1.);
  }`;function ue(e,o={}){const s=new t.ShaderMaterial({name:"ra-hand",side:t.DoubleSide,uniforms:{...e,uStroke:{value:1},uAmb:{value:1.2},uGlow:{value:o.glow??0},uGlowPos:{value:o.glowPos||new t.Vector3(0,-999,0)},uGlowFall:{value:o.glowFall??.02},uGlowMin:{value:o.glowMin??0},uWrap:{value:o.wrap??0}},vertexShader:Y+te,fragmentShader:Y+oe}),i=new t.PlaneGeometry(1,1,2,8);i.translate(0,.5,0);const v=r=>{const u=[];for(let a=8;a>=0;a--)u.push(0,a/8,.58-.031*Math.abs(a-1),r);for(let a=8;a>=0;a--)u.push(1,a/8,.18-.004*a,r);for(let a=7;a>=0;a--)u.push(2,(a+.5)/8,.1,r);for(let a=3;a>=0;a--)for(let g=0;g<16;g++)u.push(5+a,(g+.5*(a%2))/16,.07+.008*a,r);const n=new t.InstancedBufferGeometry().copy(i);n.instanceCount=u.length/4,n.setAttribute("aF",new t.InstancedBufferAttribute(new Float32Array(u),4));const h=new t.Mesh(n,s);return h.frustumCulled=!1,h.matrixAutoUpdate=!1,h.name="ra-tip",h};return{left:v(-1),right:v(1),mat:s}}function ae(e=1){const o="#D4202A",s="#B61A23",i=(m,p)=>Math.sign(m)*Math.pow(Math.abs(m),p),v=new t.SphereGeometry(1,22,16),r=v.attributes.position;for(let m=0;m<r.count;m++){const p=r.getX(m),z=r.getY(m),k=r.getZ(m),M=.8+.2*X(-1,.1,z),F=.03*Math.max(0,p*e)*X(.25,-.5,z);r.setXYZ(m,i(p,.72)*.138*M+e*F,z*.215+.29,i(k,.8)*.082*(.85+.15*M)+.035*Math.max(0,z)**2)}v.computeVertexNormals();const u=new t.SphereGeometry(1,12,10),n=u.attributes.position;for(let m=0;m<n.count;m++){const p=n.getY(m);n.setXYZ(m,i(n.getX(m),.8)*.056*(1-.18*p),p*.15,i(n.getZ(m),.8)*.052*(1-.18*p))}u.computeVertexNormals();const h=new t.CylinderGeometry(.112,.128,.2,28,3,!0),a=h.attributes.position;for(let m=0;m<a.count;m++){const p=Math.atan2(a.getZ(m),a.getX(m)),z=1+.05*Math.cos(p*14);a.setXYZ(m,a.getX(m)*z,a.getY(m),a.getZ(m)*z*.76)}h.computeVertexNormals();const g=(m,p)=>b(new t.TorusGeometry(m,.02,6,24).rotateX(Math.PI/2),0,p,0,0,0,0,1,1,.76);return Z([c(v,o,9),c(b(u,e*.15,.2,.014,0,0,-e*.78),o,9.25),c(b(h,0,.08,0),s,9),c(g(.125,-.02),s,9),c(g(.116,.182),s,9)])}function ve(){const e=[];for(let s=0;s<=42;s++){const i=s/42,v=Math.sqrt(Math.abs(Math.sin(Math.PI*i*7)));e.push(new t.Vector2((.108+.1*i)*(.84+.22*v),-1.7*i))}const o=new t.LatheGeometry(e,16);return o.scale(1,1,.86),o.computeVertexNormals(),c(o,"#2B2F3A",1)}function se(e,o=1,s={}){const i=_(e,{name:"-mitten",amb:1.3,rim:.9,side:t.DoubleSide,...s}),v=h=>{const a=new t.Mesh(ae(h),i);return a.scale.setScalar(o),a.name="ra-mitten",a.frustumCulled=!1,a},r=new t.Group,u=v(-1),n=v(1);return r.add(u,n),{group:r,L:u,R:n,mat:i}}function ne(e){const o=(z,k=14,M=10)=>new t.SphereGeometry(z,k,M),s="#2B2F3A",v=[c(b(new t.CylinderGeometry(.62,.8,2.9,12),0,1.45,0),s),c(b(o(1),0,2.85,0,0,0,0,.85,.36,.5),s),c(b(o(1),0,3.3,-.03,0,0,0,.47,.5,.5),s),c(b(new t.ConeGeometry(.3,.42,10),0,3.66,-.16,-.5,0,0),s),c(b(new t.CircleGeometry(.3,14),0,3.27,.455,0,0,0,1,1.12,1),"#1B1612")],r=new t.Mesh(Z(v),_(e,{name:"-waiter"}));r.name="ra-waiter";const u=c(new t.CylinderGeometry(.13,.15,1,8).translate(0,.5,0),s),n=_(e,{name:"-arm"}),h=[new t.Mesh(u,n),new t.Mesh(u,n)],a=new t.Group;a.add(r,h[0],h[1]);const g=new t.Vector3,m=new t.Vector3(0,1,0);return{group:a,mesh:r,arms:h,setArm:(z,k,M)=>{const F=h[z];g.subVectors(M,k);const l=g.length();F.position.copy(k),F.scale.set(1,Math.max(.05,l),1),F.quaternion.setFromUnitVectors(m,g.divideScalar(Math.max(1e-4,l)))},shoulders:[new t.Vector3(-.72,2.85,.1),new t.Vector3(.72,2.85,.1)]}}function de(e,o="falcon"){const s=o==="goshawk",i=s?.8:1,v=s?1.5:1,r=s?1.2:1,u=s?1.25:1,n=s?1.33:1,h=(l,d=14,w=10)=>new t.SphereGeometry(l,d,w),a="#59616E",g="#A9A294",m="#979083",p="#E0B93C",k=[c(b(h(1),0,.02,0,0,0,0,.2,.15,.5),a,0),c(b(h(1),0,-.05,-.04,0,0,0,.19,.15,.44),g,10),c(b(h(.125),0,.04,-.5),"#23272E"),c(b(h(.09,10,8),0,-.02,-.52,0,0,0,1,.8,1),g,10),c(b(new t.ConeGeometry(.038,.11,6),0,0,-.635,-2,0,0),p),c(b(h(.022,6,5),.085,.07,-.56),"#0A0A0A"),c(b(h(.022,6,5),-.085,.07,-.56),"#0A0A0A")],M=(l,d,w,A)=>{const B=new t.PlaneGeometry(l,d,3,1).translate(l/2,0,0).rotateX(-Math.PI/2),V=B.attributes.position;for(let L=0;L<V.count;L++){const S=V.getX(L)/l;V.setZ(L,V.getZ(L)*(1-.85*S*S*S)+.25*d*S)}return B.computeVertexNormals(),c(B,w,A)};for(let l=0;l<9;l++)k.push(b(M((.62-.05*Math.abs(l-4)*.5)*n,.11,l%2?m:g,10),0,.01+.002*l,.38,0,-Math.PI/2+(l-4)*.11,0));for(const l of[-1,1]){const d=[];for(let w=0;w<7;w++)d.push(b(M(.5*u,.17,w%2?m:g,10),.12+w*.085,.004*w,-.02+.03*w,0,-1.25-.05*w,0));for(let w=0;w<9;w++)d.push(b(M((.58+.34*Math.sin(Math.PI*(.2+.8*w/8)))*i,.105*v,w>5?a:w%2?m:g,10),.72+w*.02,.03+.003*w,.06,0,-1.2+w*.125*r,0));d.push(c(b(h(1,10,6),.42,.012,-.03,0,0,0,.42,.035,.13),g,10));for(const w of d){if(w.rotateZ(.32),l<0){w.scale(-1,1,1);const A=w.attributes.position.array;for(let B=0;B<A.length;B+=9)for(let V=0;V<3;V++){const L=A[B+3+V];A[B+3+V]=A[B+6+V],A[B+6+V]=L}w.computeVertexNormals()}k.push(w)}k.push(c(b(new t.CylinderGeometry(.045,.028,.34,6),l*.1,-.27,-.14,.55,0,0),g,10));for(let w=-1;w<=1;w++)k.push(c(b(new t.CylinderGeometry(.018,.014,.16,5),l*.1+w*.05,-.47,-.27,1.25,0,w*.45),p)),k.push(c(b(new t.ConeGeometry(.016,.1,4),l*.1+w*.1,-.5,-.4,2.5,0,w*.45),"#0C0B0A"))}const F=new t.Mesh(Z(k),_(e,{side:t.DoubleSide,name:"-falcon",amb:1.35,rim:.35}));return F.name="ra-falcon",F.frustumCulled=!1,{mesh:F}}async function fe(e,o={}){const s=j({sunDir:new t.Vector3(-.6,.4,-.7)}),i=new t.Group;s.uFogK.value=0;let v=()=>{};if((o.piece||"pigeon")==="pigeon"){const r=ee(s);r.group.position.y=1.2,r.group.rotation.y=Math.PI,i.add(r.group),v=(u,n)=>{s.uBeat.value=U(n),s.uBrake.value=.5+.5*Math.sin(n*.4)}}else{const r=se(s),u=ne(s);await e.yield(),r.L.position.set(-.9,3.1,.7),r.R.position.set(.9,3.1,.7),i.add(u.group,r.group),u.setArm(0,u.shoulders[0],r.L.position),u.setArm(1,u.shoulders[1],r.R.position),v=(n,h)=>{s.uBeat.value=U(h)}}return{object:i,radius:2,height:3,center:new t.Vector3(0,1.2,0),anchors:{},update:v,dispose(){},ground:!1,groundY:0}}const re=e=>{const o=e.attributes.position.array,s=e.attributes.normal.array;for(let i=0;i<o.length;i+=9)for(let v=0;v<3;v++){const r=o[i+3+v];o[i+3+v]=o[i+6+v],o[i+6+v]=r;const u=s[i+3+v];s[i+3+v]=s[i+6+v],s[i+6+v]=u}for(let i=0;i<s.length;i++)s[i]=-s[i];return e},E=(e,o)=>{const s=Math.sin(e*12.9898+o*78.233)*43758.5453;return s-Math.floor(s)};function me(e){const o="#9AA6B0",s="#C6D0D8",i="#6E7880",h=e.corn,a=e.corn.clone().multiplyScalar(.62),g=e.corn.clone().multiplyScalar(1.25),m=(y,G,C,q,N=1)=>c(b(new t.OctahedronGeometry(.017*N,0),y,G,C,E(q,5)*3,E(q,6)*3,0,1.25,.7,1),q%3===0?g:q%3===1?h:a),p=()=>[c(new t.CylinderGeometry(.237,.195,.44,16,1,!0).translate(0,.44/2,0),o),c(new t.CylinderGeometry(.247,.247,.035,16,1,!0).translate(0,.44-.012,0),s),c(new t.RingGeometry(.237-.004,.247,16).rotateX(-Math.PI/2).translate(0,.44+.0055,0),s),c(new t.CylinderGeometry(.195+.006,.195+.006,.03,16,1,!0).translate(0,.02,0),i)],z=.247+.014,k=(y,G)=>c(new t.BoxGeometry(y?.05:.03,.07,y?.03:.05).translate(y?0:G*(.247+.008),.44-.05,y?G*(.247+.008):0),i),M=p(),F=.066;M.push(k(0,1),k(0,-1),c(new t.TorusGeometry(z,.012,4,10,Math.PI).rotateX(-1.95).translate(0,.44-.05,0),i)),M.push(c(new t.SphereGeometry(.237-.004,12,3,0,Math.PI*2,0,Math.PI/2).scale(1,F/(.237-.004),1).translate(0,.44-.03,0),h));for(let y=0;y<22;y++){const G=E(y,1)*6.283,C=(.237-.03)*Math.sqrt(E(y,2));M.push(m(Math.cos(G)*C,.44-.03+F*Math.sqrt(Math.max(0,1-(C/(.237-.004))**2))+.002,Math.sin(G)*C,y))}const l=Z(M).translate(e.x,e.y,e.z),d=Math.atan2(.247-(.195+.006),.44-.03),w=new t.Matrix4().makeRotationZ(-e.mid*(Math.PI/2-d)),A=p();A.push(k(1,1),k(1,-1)),A.push(re(c(new t.CylinderGeometry(.237-.006,.195-.006,.44-.01,16,1,!0).translate(0,.44/2+.005,0),i))),A.push(c(new t.CircleGeometry(.195+.006,16).rotateX(Math.PI/2).translate(0,.006,0),i)),A.push(c(new t.CircleGeometry(.195,16).rotateX(-Math.PI/2).translate(0,.02,0),o));const B=Z(A);B.applyMatrix4(w);const V=new t.Vector3(0,.44,0).applyMatrix4(w),L=new t.Vector3(0,.44/2,0).applyMatrix4(w);B.computeBoundingBox();const S=e.mid>0?B.boundingBox.min.x:B.boundingBox.max.x,I=new t.Vector3(e.foot-S,e.y+.247-V.y,e.z);B.translate(I.x,I.y,I.z);const R=V.x+I.x,f=[];{const y=Math.acos(Math.min(1,.235/z)),G=new t.Vector3(0,0,1),C=new t.Vector3(e.mid*Math.sin(y),-Math.cos(y),0),q=new t.Vector3().crossVectors(G,C),N=new t.TorusGeometry(z,.012,4,10,Math.PI);N.applyMatrix4(new t.Matrix4().makeBasis(G,C,q)),f.push(c(N.translate(R-e.mid*.045,e.y+.247,e.z),i))}f.push(c(b(new t.SphereGeometry(1,10,3,0,Math.PI*2,0,Math.PI/2),R-e.mid*.1,e.y+.012,e.z,0,0,0,.2,.085,.2),a));for(let y=0;y<26;y++){const G=E(y,17)*6.283,C=Math.sqrt(E(y,18))*.94,q=Math.min(.2*C*Math.cos(G),.1);f.push(m(R-e.mid*(.1-q),e.y+.012+.085*Math.sqrt(1-C*C)+.004,e.z+.2*C*Math.sin(G),y+140,1.15))}const x=.075,P=e.mid*(e.stop-R),T=.3,D=e.z+.25+e.reach;{const y=new t.SphereGeometry(1,12,4,0,Math.PI*2,0,Math.PI/2),G=y.attributes.position;for(let C=0;C<G.count;C++){const q=G.getX(C);G.setXYZ(C,(q>0?q*(P+.012):q*.045)*e.mid,G.getY(C)*x,G.getZ(C)*(T+.012))}if(e.mid<0){const C=y.index.array;for(let q=0;q<C.length;q+=3){const N=C[q+1];C[q+1]=C[q+2],C[q+2]=N}}y.computeVertexNormals(),f.push(c(y.translate(R,e.y,e.z),a))}for(let y=0;y<64;y++){const G=(E(y,3)-.5)*Math.PI,C=Math.sqrt(E(y,4))*.97,q=P*C*Math.cos(G),N=T*C*Math.sin(G);f.push(m(R+e.mid*q,e.y+x*Math.sqrt(1-C*C)+.004,e.z+N,y+40,1.15))}for(let y=0;y<20;y++){const G=y>=14,C=.25+E(y,7)*(Math.PI/2-.25),q=1.08+.5*E(y,8)*E(y,8),N=G?e.mid*(e.stop2-R)-.16*E(y,8):P*Math.min(1,q*Math.cos(C)),H=G?D-.01:Math.min(e.z+T*q*Math.sin(C),D-.01);f.push(m(R+e.mid*N,e.y+.011,H,y+110,1.15))}const K=Z([B,...f]);return{up:l,down:K,lie:[L.x+I.x,e.z],heap:[R+e.mid*P*.4,e.z,P,T,x],mouth:R,tilt:d}}const W=(e,o,s,i,v,r,u,n=0)=>c(new t.BoxGeometry(Math.abs(o-e),i-s,Math.abs(r-v)).translate((e+o)/2,(s+i)/2,(v+r)/2),u,n);function pe(e){const o=[],s=["#4A3828","#42311F"],i="#8B7355",v=e.doorZ,r=e.doorZ+.12,u=e.doorZ+.2;let n=o;for(const S of[-1,1]){const I=e.x1-e.x0,R=I/4;for(let x=0;x<4;x++)n.push(W(S*(e.x0+x*R+.0125),S*(e.x0+(x+1)*R-.0125),e.sillY,e.lintelY,v,r,s[x%2],5));const f=[e.sillY+.2,(e.sillY+e.lintelY)/2-.125,e.lintelY-.45];for(const x of f)n.push(W(S*(e.x0+.06),S*(e.x1-.06),x,x+.25,r,u,i,6));for(let x=0;x<2;x++){const P=f[x]+.25,T=f[x+1],D=I-.3,K=Math.hypot(D,T-P);n.push(c(new t.BoxGeometry(K,.2,u-r).rotateZ(S*Math.atan2(T-P,D)).translate(S*(e.x0+I/2),(P+T)/2,(r+u)/2),i,6))}}const h=[];n=h;const a=e.roof,g=Math.tan(a.ang),m=S=>a.y+(S-a.x)*g-a.thick/2/Math.cos(a.ang),p=e.wallZ;{const S=new t.Shape;S.moveTo(e.lx0,e.wallTop),S.lineTo(e.lx1,e.wallTop),S.lineTo(e.lx1,m(e.lx1)),S.lineTo(e.lx0,m(e.lx0)),S.closePath(),n.push(c(new t.ExtrudeGeometry(S,{depth:.4,bevelEnabled:!1}).translate(0,0,p-.4),"#7B7C80",4))}const z=e.lx0+.5,k=z+2.2,M=k+.9,F=M+1.5,l=4.4,d=l-1.8,w="#8F9094",A="#C9C0B0";n.push(W(z,k,0,l,p-.1,p+.1,"#2E2218",5),W(z-.25,k+.25,l,l+.45,p-.05,p+.14,w,4)),n.push(W(z+.25,z+.45,2.1,2.3,p+.1,p+.17,"#101114")),n.push(W(M,F,d,l,p-.05,p+.03,"#1D2A3B")),n.push(W(M-.12,F+.12,l,l+.4,p-.05,p+.14,w,4),W(M-.2,F+.2,d-.22,d,p-.05,p+.2,w,4));for(const S of[M,(M+F)/2,F])n.push(W(S-.06,S+.06,d,l,p,p+.09,A));for(const S of[d+.06,(d+l)/2,l-.06])n.push(W(M,F,S-.06,S+.06,p,p+.09,A));const B=-Math.sin(a.ang),V=Math.cos(a.ang),L=a.z+a.len/2;return n.push(c(new t.BoxGeometry(a.wid+.1,.14,.6).rotateZ(a.ang).translate(a.x+B*(a.thick/2+.07),a.y+V*(a.thick/2+.07),L-.25),"#56606F",3)),n.push(c(new t.BoxGeometry(a.wid,.5,.22).rotateZ(a.ang).translate(a.x+B*(a.thick/2-.25),a.y+V*(a.thick/2-.25),p+.5),"#3A2A1C",6)),{leaves:o,lean:h}}function we(e){const o=[],s="#8B7355",i="#5E4A36",v="#3A2A1C",r=(e.z0+e.z1)/2,u=(e.z1-e.z0)/2,n=e.wheel/2,h=e.ground+n,a=.3,g=[e.x0+n+.25,e.x1-n-.25],m=u-.18;for(const f of g){for(const x of[-1,1]){const P=r+x*m,T=[c(new t.TorusGeometry(n-.16,.16,4,16),s),c(new t.CylinderGeometry(.34,.34,.5,8).rotateX(Math.PI/2),v)];for(let D=0;D<10;D++)T.push(c(new t.CylinderGeometry(.07,.1,n-.5,4,1,!0).translate(0,(n-.5)/2+.3,0).rotateZ(D*Math.PI/5+.2),i));for(const D of T)o.push(D.translate(f,h,P))}o.push(W(f-.16,f+.16,h-.16,h+.16,r-m,r+m,v)),o.push(W(f-.3,f+.3,h+.16,e.bedY-a,r-u+.5,r+u-.5,i,7))}o.push(W(e.x0,e.x1,e.bedY-a,e.bedY,r-u+.42,r+u-.42,s,6));const p=e.ground+e.wheel+.12;for(const f of[-1,1]){o.push(W(e.x0,e.x1,p,p+.2,r+f*(u-.3),r+f*u,s,6));for(let x=0;x<=6;x++){const P=e.x0+.1+x*(e.x1-e.x0-.2)/6;o.push(W(P-.08,P+.08,e.bedY,p,r+f*(u-.4),r+f*(u-.26),i,5))}}const z=Math.asin(.36/2.6),k=u-.15,M=e.topY-.11,F=M-p,l=F*Math.tan(z),d=F/Math.cos(z)+.09;for(const f of[[e.x0+.36,-1],[e.x1-.36,1]]){for(const x of[-1,1])o.push(c(new t.BoxGeometry(.22,d,.22).translate(0,d/2,0).rotateZ(-z*f[1]).translate(f[0],p,r+x*k),s,5));for(let x=1;x<=4;x++){const P=x/4,T=x===4?.22:.2;o.push(c(new t.BoxGeometry(T,T,2*u).translate(f[0]+f[1]*l*P,p+F*P,r),x===4?s:i,7))}}for(const f of[-1,1]){o.push(W(e.x0+.36-l,e.x1-.36+l,M-.11,M+.11,r+f*(k-.11),r+f*(k+.11),s,6));for(let x=1;x<=5;x++){const P=e.x0+.1+x*(e.x1-e.x0-.2)/6;o.push(W(P-.08,P+.08,p+.2,M-.11,r+f*(k-.08),r+f*(k+.08),i,5))}}{const f=e.x1-.4,x=h+.3,P=e.x1+5.4,T=e.ground+.12,D=Math.hypot(P-f,T-x),K=Math.atan2(T-x,P-f);for(const y of[-1,1])o.push(c(new t.BoxGeometry(D,.2,.2).rotateZ(K).translate((f+P)/2,(x+T)/2,r+y*.95),s,6));o.push(W(e.x1+.5,e.x1+.7,h+.02,h+.2,r-1.05,r+1.05,i,7))}const w=[],A=9,B=e.x1-2.1,V=e.x0+(e.x1-e.x0)/3+1.7;for(let f=0;f<A;f++){const x=Math.floor(f/3),P=e.load-.95*x-.5*(f%3)*(.4+.6*E(f,11))-(f?.1:0),T=B+(V-B)*f/(A-1)+.25*(E(f,12)-.5),D=new t.IcosahedronGeometry(1,1),K=D.attributes.position,y=(P-e.bedY)/2+.15;for(let G=0;G<K.count;G++){const C=K.getX(G),q=K.getY(G),N=K.getZ(G),H=1+.1*Math.sin(C*4.1+f*1.7)*Math.sin(N*3.3+f)+.06*Math.sin(q*5.2+C*2+f*2.9);K.setXYZ(G,C*H*(1.15+.2*E(f,13)),q*y*(q>0?1:.6),N*H*(u-.75)*(.88+.12*E(f,14)))}D.computeVertexNormals(),w.push(c(D.translate(T,e.bedY+y*.6-.05,r+.2*(E(f,15)-.5)),new t.Color("#C9B274").multiplyScalar(.85+.3*E(f,16)),8))}let L=-1e9;for(const f of w){const x=f.attributes.position;for(let P=0;P<x.count;P++)L=Math.max(L,x.getY(P))}let S=0;for(const f of w){const x=f.attributes.position;for(let P=0;P<x.count;P++)S=Math.max(S,Math.abs(x.getZ(P)-r))}const I=(e.load-e.bedY)/(L-e.bedY),R=(u-.75)/S;for(const f of w)f.translate(0,-e.bedY,-r).scale(1,I,R).translate(0,e.bedY,r),o.push(f);return o}function xe(){const e=new t.Color("#C9B274"),o=new t.Color("#A88A4A"),s=10,i=.75,v=[],r=(n,h)=>{const a=[],g=[],m=(l,d)=>[h[l][0]*Math.cos(d),h[l][0]*Math.sin(d)],p=(l,d,w)=>{a.push(l,d,n*i),g.push(w.r,w.g,w.b)};for(let l=0;l<s;l++){const d=l/s*6.2832,w=(l+1)/s*6.2832;for(let A=0;A+1<h.length;A++){const B=m(A,d),V=m(A,w),L=m(A+1,d),S=m(A+1,w),I=h[A][1],R=h[A+1][1],f=A===0&&h[0][0]===0?[[B,I],[L,R],[S,R]]:[[B,I],[L,R],[S,R],[B,I],[S,R],[V,I]];for(let x=0;x<f.length;x+=3){const P=n>0?[0,1,2]:[0,2,1];for(const T of P)p(f[x+T][0][0],f[x+T][0][1],f[x+T][1])}}}const z=new t.BufferGeometry,k=a.length/3,M=new Float32Array(k*3),F=new Float32Array(k).fill(8);for(let l=0;l<k;l++)M[l*3+2]=n;return z.setAttribute("position",new t.BufferAttribute(new Float32Array(a),3)),z.setAttribute("normal",new t.BufferAttribute(M,3)),z.setAttribute("color",new t.BufferAttribute(new Float32Array(g),3)),z.setAttribute("aPart",new t.BufferAttribute(F,1)),z},u=e.clone().lerp(o,.5);for(let n=0;n<3;n++)for(let h=0,a=9-n;h<a;h++){const g=(h-(a-1)/2)*2,m=1+n*1.732;v.push(c(new t.CylinderGeometry(1,1,2*i,s,1,!0).rotateX(Math.PI/2),"#C9B274",8).translate(g,m,0)),v.push(r(1,[[0,o],[.42,e],[.74,o],[1,e]]).translate(g,m,0),r(-1,[[0,o],[1,u]]).translate(g,m,0))}return Z(v)}export{O as BEAT_HZ,Y as GLSL_COMMON,Q as GLSL_SURFACE,U as beatOf,fe as buildHero,_ as litMat,pe as makeBarnFace,le as makeCut,de as makeFalcon,he as makeGlint,ce as makeLooseFeather,ae as makeMittenGeometry,se as makeMittens,me as makePail,ee as makePigeon,j as makeShared,ve as makeSleeveGeometry,xe as makeStackGeometry,ue as makeTips,we as makeWagon,ne as makeWaiter,Z as merge,c as paint,ie as pulseOf};
