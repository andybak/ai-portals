import*as e from"three";import{makePath as qa}from"../kit/core.js";import{makeFiction as _a,makeShared as Pa,buildFigure as Y0,buildFarForms as Va,buildGlass as Ia,buildCar as Oa,makeToonMaterial as $0,makeAcc as ht,LIGHT_GLSL as Ie,U_TURN as Ka,U_FREE as Wo}from"../parts/still-waving.js";const M=(g,E,be)=>{const se=Math.min(1,Math.max(0,(be-g)/(E-g)));return se*se*(3-2*se)},Eo=`
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
`,Ro=`
uniform vec4 uSinkA; uniform vec4 uSinkB;
float swSink(vec2 xz) {
  vec2 d = xz - uSinkA.zw; float a = d.x * uSinkA.x + d.y * uSinkA.y, b = d.x * uSinkA.y - d.y * uSinkA.x;
  return uSinkB.z * smoothstep(4., 60., uSinkB.x - a) * smoothstep(uSinkB.y - 95., uSinkB.y - 55., a) * (1. - smoothstep(60., 130., abs(b)));
}
`,Oe=`
uniform vec3 uCamW; uniform float uTime; uniform float uWind;
${Ro}
varying vec3 vWp; varying vec3 vLp; varying vec3 vN; varying vec3 vCol; varying float vDist;
`,Ke=`
  vLp = p; p.y -= swSink(p.xz);
  vec4 wp = modelMatrix * vec4(p, 1.);
  vWp = wp.xyz; vN = mat3(modelMatrix) * n; vDist = distance(wp.xyz, uCamW);
  gl_Position = projectionMatrix * viewMatrix * wp;
`,Ne=`
${Ie}
${Eo}
uniform float uTime; uniform vec3 uCamW; uniform vec4 uRingL; uniform vec3 uRingC;
varying vec3 vWp; varying vec3 vLp; varying vec3 vN; varying vec3 vCol; varying float vDist;
// the exit ring's own cool light on whatever stands near it: leaves, copes, verge
vec3 swRing(vec3 alb, vec3 n, float wrap) {
  vec3 L = uRingL.xyz - vLp; float d2 = dot(L, L);
  float nl = max(dot(n, L) / sqrt(d2 + 1e-3) * (1. - wrap) + wrap, 0.);
  return alb * uRingC * (uRingL.w * nl * 34. / (34. + d2));
}
`,Z0=`
uniform vec4 uLane;
vec3 swCap(vec3 c, float on) {
  const vec3 LW = vec3(.2126, .7152, .0722);
  float cap = (2. / 3.) * dot(uLane.rgb * (uKeyCol * (1.9 * uLane.w) + uSkyCol * (.74 + .25)), LW);
  float knee = .5 * cap, l = dot(c, LW);
  float l2 = min(l, knee) + (cap - knee) * (1. - exp(-max(l - knee, 0.) / max(cap - knee, 1e-4)));
  return c * mix(1., l2 / max(l, 1e-4), on);
}
`,X0=(g,E={})=>new e.ShaderMaterial({uniforms:{...g,uDim:{value:1},uWarm:{value:0}},...E,vertexShader:`${Oe} attribute vec3 color; attribute float aSway; varying float vKind;
    void main() { vec3 p = position, n = normal; vCol = color; vKind = aSway; ${Ke} }`,fragmentShader:`${Ne} uniform float uDim; uniform float uWarm; uniform vec4 uSinkA; varying float vKind;
    void main() { vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) n = -n;
      float fp = 560. / max(vDist, 1.);
      vec3 alb = vCol; vec3 nb = vec3(0.);
      float sheen = 0.;                                                           // only the farm's slates set it (flight round 2); 0 to 1
      vec2 w = vec2(vLp.x + vLp.z * .73, vLp.y);                                  // along the face, up
      if (vKind > 3.1 && vKind < 3.4) w.x = vLp.x * uSinkA.x + vLp.z * uSinkA.y;      // the lane walls of the road ahead: metres along the lane
      if (vKind < .5) {
        alb *= 1. - .10 * vn(vLp.xy * 3.1 + vLp.z * 1.7) * smoothstep(1., 5., fp * .3);
      } else if (vKind < 1.5) {                                                   // limewash: brush blotches, rain streaks under the eaves, damp at the foot
        float k = smoothstep(1., 4., fp * .25);
        float blot = vn(w * 1.3) * .6 + vn(w * 4.1 + 3.) * .4;
        float streak = vn(vec2(w.x * 5., w.y * .35 + 2.)) * smoothstep(1.5, 4.4, vLp.y);
        alb *= 1. - (.10 * (blot - .5) + .10 * streak) * k;
        alb = mix(alb, alb * vec3(.74, .80, .76), (1. - smoothstep(.05, .7, vLp.y + (blot - .5) * .5)) * .55);
        nb = vec3(blot - .5, 0., vn(w * 9.) - .5) * .12 * k;
      } else if (vKind < 2.5) {                                                   // slate: courses, staggered joints, the odd pale or mossy slate
        float k = smoothstep(1.5, 5., fp * .24);
        float row = floor(vLp.y / .24), fx = vLp.x / .30 + .5 * mod(row, 2.);
        float id = h21(vec2(floor(fx), row));
        float lip = smoothstep(.0, .18, fract(vLp.y / .24)), joint = smoothstep(.0, .08, abs(fract(fx) - .5) * 2. - .0) ;
        alb *= mix(1., (.80 + .36 * id) * (.72 + .28 * lip) * (.8 + .2 * smoothstep(.0, .12, 1. - abs(fract(fx) - .5) * 2.)), k);
        alb = mix(alb, alb * vec3(.80, 1.05, .78), step(.9, id) * .5 * k);
        alb *= 1. - .12 * vn(vLp.xy * vec2(.7, 2.)) ;
        // the farm's roofs (kind 2.3): each slate takes its own part of the roof's small sheen, .45 to 1 of it (riven
        // slates lie at slightly different tilts), less under the lip of the course above; and the slate's tail, the
        // 3 cm of its cut lower edge just above that lip's shadow, takes the whole of it: a thin lit line to each
        // course. Never above 1; where the courses are too far off to draw, the pattern's own mean (.72)
        if (vKind > 2.2) { float cy = fract(vLp.y / .24), tail = smoothstep(.16, .22, cy) * (1. - smoothstep(.28, .34, cy));
          sheen = mix(.72, max((.45 + .55 * id) * (.75 + .25 * lip), tail), k); }
      } else if (vKind < 3.5) {                                                   // field stone: courses of uneven stones, dark joints, lichen on the cope
        // dry field stone: the courses step up and down every stride of wall, tall courses and thin ones, long stones and
        // short, grey ones and warm buff ones, the joints dark and open
        float k = smoothstep(1.2, 4., fp * .2);
        float seg = floor(w.x / .85 + .3 * vn(vec2(w.y * 2.1, 5.))), sh = h21(vec2(seg, 17.));
        float yy = w.y / .135 + sh * 3.7; yy += .20 * sin(yy * 3.1 + sh * 40.) + .05 * sin(yy * 7.3 + sh * 11.);      // courses of unequal height (monotonic)
        float row = floor(yy);
        float len = mix(.16, .52, h21(vec2(row, seg + 9.)) * h21(vec2(row + 3., seg)));
        float fx = (w.x + h21(vec2(row, seg + 3.)) * 7.) / len + .12 * (vn(vec2(w.y * 9., row)) - .5);
        float id = h21(vec2(floor(fx), row + seg * 13.)), id2 = h21(vec2(floor(fx) + 31., row + seg * 7.));
        vec2 cf = vec2(fract(fx), fract(yy));
        float sx = fract(w.x / .85 + .3 * vn(vec2(w.y * 2.1, 5.)));
        float jx = min(min(cf.x, 1. - cf.x) * len / .135, min(sx, 1. - sx) * .85 / .135) * 2.0, jy = min(cf.y, 1. - cf.y) * 2.;
        float joint = jx * jy / (jx + jy + 1e-3) * 2.;                             // rounded corners
        float body = smoothstep(.05, .30, joint + (vn(w * 23.) - .5) * .10);
        vec3 tint = mix(mix(vec3(.80, .86, .92), vec3(1.0, 1.0, 1.0), id), vec3(1.22, 1.04, .76), step(.62, id2) * (.5 + .5 * id));   // grey, pale grey, buff
        alb *= mix(vec3(1.), tint * (.80 + .34 * id) * (.92 + .16 * vn(w * 31.)), k);
        alb *= mix(1., .40 + .60 * body, k) * 1.12;
        float lich = smoothstep(.55, .75, vn(w * 2.3 + 5.) * .6 + vn(w * 7.) * .4) * smoothstep(.2, 1.1, vLp.y);
        alb = mix(alb, vec3(.42, .46, .34) * (.7 + .5 * id), lich * .40 * smoothstep(.6, 3., fp * .2));
        alb = mix(alb, alb * vec3(.62, .74, .60), (1. - smoothstep(.0, .30, vLp.y + (vn(w * 3.) - .5) * .2)) * .6);   // green and damp at the foot
        nb = vec3(cf.x - .5, cf.y - .5, 0.) * (1. - body) * 1.1 * k + vec3(id - .5, id2 - .5, 0.) * .16 * k;
      } else {                                                                    // wood: grain along the height, silvered
        float k = smoothstep(1.5, 5., fp * .05);
        float gr = vn(vec2(vLp.x * 40. + vLp.z * 37., vLp.y * 2.3)) * .6 + vn(vec2(vLp.x * 90. + vLp.z * 83., vLp.y * 6.)) * .4;
        alb *= 1. + (gr - .5) * .6 * k;
      }
      vec3 c = swLight(alb * uDim, normalize(n + nb));
      // THE FARM'S SLATE IS DARK SLATE (run c). Its tone is its albedo, SLATE, the same constant as the roof of the house
      // at the gate (one valley, one quarry), under the light every other face has. Over that lies a small sheen of the
      // dusk sky, warmer where the mirrored ray goes toward the afterglow. THE RULE IS THE SLATE'S OWN: a dry slate
      // face mirrors about 5 percent of what is beyond it when met square on (refractive index near 1.57), and a riven
      // roofing slate is too rough to rise toward a mirror at a glancing angle as wet smooth stone would; so SLATE_SKY,
      // 0.05, is the LARGEST share of the sky any slate may hold, from any place and at any angle. A face met square on
      // holds 0.02 and the share rises with the angle between eye and slate, as light does, to that 0.05 and no
      // further (sheen is never above 1). The slate's albedo is about 0.09 and the sky it stands against is the sky
      // itself, so a roof is darker than the sky and the hazed hills behind it by the slate's own darkness, not by where
      // the eye is. (Run b gave 6 to 38 percent, and up to 1.45 times that on one slate: the roofs went as pale as the haze.)
      if (sheen > 0.) {
        const float SLATE_SKY = .05;
        vec3 vv = normalize(uCamW - vWp + vec3(0., 1e-4, 0.)), rr = reflect(-vv, n);
        float fr = 1. - max(dot(n, vv), 0.);
        c += mix(uSkyCol, uKeyCol, .40 * smoothstep(-.2, .8, dot(rr, uSunW))) * (sheen * (.02 + (SLATE_SKY - .02) * fr * fr));
      }
      // from the hilltop the lime wall is the palest peach thing in the valley: it keeps the afterglow through the haze
      float lime = step(.5, vKind) * step(vKind, 1.5) * uWarm;
      c = mix(c, c * vec3(1.20, 1.02, .82), lime);
      c += swRing(alb, n, .25);
      gl_FragColor = vec4(swFog(c, vDist * (1. - .45 * lime)), 1.); }`}),J0=(g,E=0)=>new e.ShaderMaterial({uniforms:{...g,uRim:{value:E}},vertexShader:`${Oe} attribute vec3 color; attribute float aSway; varying float vKeep;
    void main() { vec3 p = position, n = normal; vCol = color; vKeep = aSway;
      float w = aSway * (.5 + .5 * sin(uTime * 1.3 + p.x * .21 + p.z * .17)) * uWind;
      p.x += w * .10 * sin(uTime * 2.7 + p.z * 1.9 + p.y * 2.3); p.z += w * .10 * sin(uTime * 3.1 + p.x * 2.1);
      p.y += w * .05 * sin(uTime * 4.3 + p.x * 3.3 + p.z * 2.9);
      ${Ke} }`,fragmentShader:`${Ne} ${Z0} varying float vKeep; uniform float uRim;
    float tri(vec3 q, vec3 w, float f, float o) { return vn(q.zy * f + o) * w.x + vn(q.xz * f + o) * w.y + vn(q.xy * f + o) * w.z; }
    void main() { vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
      float fp = 560. / max(vDist, 1.);
      float kM = smoothstep(1.2, 4., fp * .45), kL = smoothstep(1.5, 4.5, fp * .07);
      float fl = .35 * sin(uTime * 2. + vLp.x * 3. + vLp.y * 2.);
      vec3 q = vLp;
      float fq = max(fwidth(q.x), max(fwidth(q.y), fwidth(q.z)));                  // metres under one pixel, the long way: a face seen edge-on
      // leaf masses about 45 cm across, seen on three planes so no face smears
      float mass = vn(q.xz * 2.3 + q.y * 1.1) * .34 + vn(q.xy * 2.5 + q.z * 1.3 + 4.) * .33 + vn(q.zy * 2.4 + q.x * 1.2 + 8.) * .33;
      float fine = vn(q.xz * 9.1 + q.y * 5.3 + fl) * .34 + vn(q.xy * 9.7 + q.z * 4.3) * .33 + vn(q.zy * 8.9 + q.x * 5.1 + fl) * .33;
      float grit = vn(q.xz * 31. + q.y * 17.) * .5 + vn(q.zy * 29. + q.x * 19. + q.y * 7.) * .5;
      float leafId = h21(floor(q.xy * 13. + q.z * 7.3)) * .5 + h21(floor(q.zy * 12. + q.x * 6.1) + 5.) * .5;
      if (vKeep < .4) {                                                            // the grass bank under the hedge
        vec3 w3 = n * n; w3 *= w3; w3 /= (w3.x + w3.y + w3.z + 1e-4);        // the face it lies on, nearly unblended
        // clumps; each size fades to its mean before a slant can squeeze it into stripes
        float tus = mix(.5, tri(q, w3, 1.5, 2.), 1. - smoothstep(.10, .30, fq * 1.5)) * .6 + mix(.5, tri(q, w3, 3.4, 7.), 1. - smoothstep(.10, .30, fq * 3.4)) * .4;
        float bl = tri(q, w3, 18., 0.) * .55 + tri(q, w3, 41., 3.) * .45;          // blades
        float drift = smoothstep(.50, .70, tri(q, w3, .30, 20.) * .7 + tus * .3);  // where the seed heads stand
        float scrape = smoothstep(.63, .70, tri(q, w3, .8, 31.) * .65 + tri(q, w3, 2.9, 5.) * .35) * (1. - smoothstep(.12, .36, fq));   // bare earth where the bank has slipped
        vec3 ga = vCol * vec3(1.14, 1.0, .76) * 1.36 * (.60 + .74 * tus) * (1. + (bl - .5) * .7 * kL);
        ga = mix(ga, vec3(dot(ga, vec3(.30, .60, .10))), .34);                                      // the meadow's grey green, not emerald
        ga = mix(ga, ga * vec3(1.32, 1.18, .84), drift * .40);
        ga = mix(ga, ga * vec3(1.9, 1.7, 1.1), step(.86, h21(floor(q.xz * 21.) + floor(q.y * 21.))) * drift * kL * .7);   // single seed heads
        ga = mix(ga, ga * .46, (1. - smoothstep(.22, .52, tus)) * .6 * kM);                     // the dark between clumps
        ga = mix(ga, vec3(.150, .118, .092) * (.75 + .5 * bl), scrape * .85 * kM);
        vec3 nb2 = normalize(n + vec3(bl - .5, 0., tus - .5) * .6 * kM);
        // a gentler key than the open meadow gets: a bank facing the afterglow is warm, never a pale slab
        vec3 gc = ga * (uKeyCol * max(dot(nb2, uSunW), 0.) * .85 + mix(uGndCol, uSkyCol, nb2.y * .5 + .5) * .74 + uSkyCol * .62);
        gl_FragColor = vec4(swFog(gc, vDist), 1.); return;
      }
      float hed = step(vKeep, .9);                                                 // hawthorn (0.8) or an ash crown (1)
      // the outline: where the surface turns away from the eye the gaps between masses are open air
      vec3 v = normalize(uCamW - vWp + vec3(0., 1e-4, 0.));
      float rim = abs(dot(n, v));
      float open = mass * .7 + fine * .3;
      if (rim < (.56 - open) * .9 * kM * step(.5, vKeep)) discard;
      float m = mix(.5, mass, kM);
      vec3 alb = vCol * mix(.50 + 1.0 * m, (.56 + .34 * m), hed) * mix(vec3(1.), vec3(.94, .98, .80), hed);
      alb *= 1. + (fine - .5) * .7 * kL;
      alb *= mix(1., (.55 + .9 * leafId) * (.7 + .6 * grit), kL * .85);                                              // leaf by leaf
      alb = mix(alb, vCol * .55, smoothstep(.46, .30, mass) * kM * .5);                        // the dark inside the hedge
      alb = mix(alb, vCol * vec3(1.55, 1.6, 1.25), step(.80, leafId) * kL * smoothstep(.4, .7, mass) * .55);   // single leaves turned to the sky
      vec3 c = swLight(alb, normalize(n + (vec3(mass, fine, leafId) - .5) * kM * vec3(.7, .3, .7))) + alb * uSkyCol * vec3(.44, .52, .44) * (1. - .55 * hed);
      c += alb * uKeyCol * .30 * (1. - .5 * hed) * smoothstep(.5, .85, m) * kM * max(dot(n, uSunW) + .35, 0.);   // the afterglow through the outer leaves
      c *= .74 + .26 * smoothstep(-.2, .9, n.y + mass);                                         // undersides in shade
      c += uSkyCol * vec3(.012, .017, .020);                                                     // shade is blue air, never black
      // the cutting's hedges: bough by bough (masses about 1.8 m across, which hold to the far end of the lane), and along
      // the top, where the leaves see the whole sky, the last of the afterglow
      float bough = vn(q.xz * .55 + q.y * .4 + 3.) * .6 + vn(q.xy * .6 + q.z * .5) * .4;
      c *= mix(1., .62 + .76 * bough, uRim * hed);
      // and its face: clump by clump (the 45 cm masses), lit ones and the dark between them, and the upper half of the face,
      // which sees the sky over the far hedge, takes the sky's light and the afterglow; the foot, under its own top, does not.
      // vKeep runs from 0.8 at the foot of the hawthorn to 0.88 along its shoulders (set at build for these two hedges only).
      // That light is a fact of the hedge and of nothing else: how high the leaf stands on the hedge's own rings (vKeep) and,
      // in the line below, which way it faces the afterglow. Along each hedge's falling end (S_FLARE to S_STOP) the rings
      // themselves carry less of it (set at build, see hedgeRun and skyEnd): a hedge that has sunk to a ragged knee-high
      // line has no upper half standing in the sky. The body does NOT follow skyEnd's square law as the sprays do: its
      // baked share reaches this shader as vKeep = 0.8 + 0.08 x share and passes through the smoothstep below (0.81 to
      // 0.875), a second curve. So the body keeps all its light until the share has fallen to 0.94 (0.9 m into the
      // fall), has half of it at a share of 0.53 (7.6 m in, s 278.6) and none from a share of 0.125 down (18.1 m in,
      // s 289.1), ten metres before the hedge stops; the sprays above it go out by the square law over all 28 m.
      // It is the same from every eye.
      float clump = smoothstep(.34, .66, mass), topK = smoothstep(.81, .875, vKeep) * uRim * hed;
      c *= mix(1., .62 + .76 * clump, uRim * hed * kM);
      c += vCol * (uSkyCol * 1.1 + uKeyCol * (.5 + .9 * max(dot(n, uSunW), 0.))) * topK * (.30 + .70 * mix(.5, clump, kM));
      // the face turned from the afterglow is in shade, and the brief's shade is #34454F (0.034, 0.059, 0.078 linear), "never grey or black"
      c = max(c, vec3(.034, .059, .078) * (.25 + .30 * bough) * uRim * hed);      // its floor only: the deepest leaf shade is a third of that tone
      c += swRing(alb, n, .35) * .85;                                                           // the ring's light in the leaves that hang over it
      c = swCap(c, uRim * hed);                                                                 // the lane hedges' cap: see CAP_GLSL
      gl_FragColor = vec4(swFog(c, vDist), 1.); }`}),Q0=(g,E=0)=>new e.ShaderMaterial({uniforms:{...g,uRim:{value:E}},side:e.DoubleSide,vertexShader:`${Oe} attribute vec3 color; attribute vec4 aCard; attribute float aSky; varying vec2 vUv; varying float vPh; varying vec2 vSky;
    void main() { vec3 p = position, n = normal; vCol = color; vUv = uv; vPh = aCard.w;
      vSky = vec2(aSky, normal.y);                                                 // the card's share of the hedge's sky light, and how far it faces up in the place's own frame (one value to a card)
      float w = (.5 + .5 * sin(uTime * 1.3 + aCard.x * .21 + aCard.z * .17)) * uWind;
      vec3 d = p - aCard.xyz;                                                      // the card flutters about its own centre and rides the bough
      p += vec3(sin(uTime * 2.7 + aCard.w * 6.), .5 * sin(uTime * 4.3 + aCard.w * 9.), sin(uTime * 3.1 + aCard.w * 4.)) * .09 * w;
      p += cross(vec3(.3, 1., .2), d) * .16 * sin(uTime * 5.1 + aCard.w * 17.) * w;
      ${Ke} }`,fragmentShader:`${Ne} ${Z0} varying vec2 vUv; varying float vPh; varying vec2 vSky; uniform float uRim;
    void main() {
      float fp = 560. / max(vDist, 1.), kL = smoothstep(.8, 2.6, fp * .12);         // leaflets about 12 cm wide
      float sx = vUv.x * 3., id = floor(sx), lx = fract(sx) * 2. - 1., ax = abs(lx);
      float yy = vUv.y * 4.2 + id * .37 + vPh, fy = fract(yy) - .5;
      float env = sin(3.1416 * clamp(vUv.y, 0., 1.)) * (1. - .55 * abs(vUv.x * 2. - 1.));
      vec2 e = vec2((ax - .48) * 1.7, fy * 2.3 - (ax - .48) * 1.1);
      float leaf = 1. - smoothstep(.42, .56, dot(e, e) / max(env * env, .04));
      leaf = max(leaf, (1. - smoothstep(.04, .09, ax)) * step(.08, env));
      // far off a spray is only a soft-edged tuft
      vec2 c2 = vUv * 2. - 1.; float tuftA = 1. - smoothstep(.55, 1.0, dot(c2 * vec2(1., .8), c2 * vec2(1., .8)) + (h21(floor(vUv * 6.) + vPh) - .5) * .7);
      float a = mix(tuftA, leaf, kL);
      if (a < .5) discard;
      vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
      float tone = .78 + .5 * h21(vec2(id + floor(yy), vPh * 7.));
      vec3 alb = vCol * mix(1., tone, kL);
      vec3 c = swLight(alb, n);
      c += alb * uKeyCol * .42 * max(dot(n, uSunW) + .45, 0.);                    // thin leaves pass the afterglow
      c *= .70 + .30 * smoothstep(-.4, .7, n.y);
      // the shoots along the top of the cutting's hedges hold the afterglow. As on the hedge's face this is a fact of the
      // hedge: how far the spray faces up (in the place's own frame, not the tipped one) and the share its place on the
      // hedge has of the sky light (vSky.x: all of it, falling to none along the hedge's falling end). The same from every eye.
      c += (alb * (1.5 * uKeyCol + .8 * uSkyCol) + vec3(.030, .026, .012) * uKeyCol) * smoothstep(.25, .75, vSky.y) * uRim * vSky.x;
      c = max(c, vec3(.034, .059, .078) * (.20 + .25 * tone) * uRim);                             // leaves in shade: a floor in the brief's shade hue (#34454F), never black
      c += swRing(alb, n, .45) * 1.25;
      c = swCap(c, uRim);                                                                       // the lane hedges' cap: see CAP_GLSL
      gl_FragColor = vec4(swFog(c, vDist), 1.); }`}),Ue=()=>{const g=[],E=[],be=[],se=[],He=[],ft=[],oe=[],ke=new e.Color,H=new e.Vector3,w=new e.Vector3,D=new e.Vector3;let Me=.137;const ze=()=>(Me=(Me*9301.17+.2113)%1,Me);let Le=.5772;const j=()=>(Le=(Le*9301.17+.2113)%1,Le);return{count:()=>g.length/12,add(fe,te,ye,je,Jt=1,Ye=0,ie=1,re=null){const T=re||(Ye?j:ze);D.set(T()-.5,T()-.5,T()-.5).normalize(),H.crossVectors(te,D).normalize(),w.copy(te).multiplyScalar(.55).addScaledVector(D,.5).add(H.clone().multiplyScalar(.2)),w.y-=.35,w.normalize(),Ye&&(w.set(D.x*.35,1,D.z*.35).normalize(),te=D.set(D.z,.25,-D.x).normalize()),H.crossVectors(w,te).normalize(),H.lengthSq()<.5&&H.set(1,0,0),ke.set(je).multiplyScalar(Jt);const Qt=T(),Ae=g.length/3,ut=ye*(Ye?.3:.55),$e=ye;for(const[Fe,Ze]of[[-1,0],[1,0],[1,1],[-1,1]])g.push(fe.x+H.x*Fe*ut+w.x*(Ze-.35)*$e,fe.y+H.y*Fe*ut+w.y*(Ze-.35)*$e,fe.z+H.z*Fe*ut+w.z*(Ze-.35)*$e),Ye?E.push(te.x*.5,.86,te.z*.5):E.push(te.x,te.y,te.z),be.push(ke.r,ke.g,ke.b),se.push(Fe*.5+.5,Ze),He.push(fe.x,fe.y,fe.z,Qt),ft.push(ie);oe.push(Ae,Ae+1,Ae+2,Ae,Ae+2,Ae+3)},mesh(fe){const te=new e.BufferGeometry;te.setAttribute("position",new e.Float32BufferAttribute(g,3)),te.setAttribute("normal",new e.Float32BufferAttribute(E,3)),te.setAttribute("color",new e.Float32BufferAttribute(be,3)),te.setAttribute("uv",new e.Float32BufferAttribute(se,2)),te.setAttribute("aCard",new e.Float32BufferAttribute(He,4)),te.setAttribute("aSky",new e.Float32BufferAttribute(ft,1)),te.setIndex(oe);const ye=new e.Mesh(te,fe);return ye.frustumCulled=!1,ye}}},Na=(g,E)=>new e.ShaderMaterial({uniforms:{...g,uVerge:{value:new e.Color(E.verge)},uMeadow:{value:new e.Color(E.meadow)},uSeed:{value:new e.Color(E.seedhead)}},side:e.DoubleSide,vertexShader:`${Oe} ${Eo} attribute vec4 aI; attribute vec4 aJ; uniform vec3 uVerge; uniform vec3 uMeadow; uniform vec3 uSeed; varying float vT;
    void main() {
      float cy = cos(aI.w), sy = sin(aI.w), t = position.y;                        // t: 0 at the root, 1 at the tip
      vec3 base = aI.xyz;
      vec4 bw = modelMatrix * vec4(base, 1.);
      float dist = distance(bw.xyz, uCamW), keep = 1. - smoothstep(60., 95., dist);
      float gust = vn(base.xz * .06 + vec2(uTime * .55, uTime * .32)) * .65 + vn(base.xz * .21 + vec2(uTime * 1.2, -uTime * .6)) * .35;
      vec3 l = vec3(position.x * cy - position.z * sy, 0., position.x * sy + position.z * cy);
      float hgt = aJ.x * keep;
      vec3 p = base + l * (.6 + .4 * keep) + vec3(0., t * hgt, 0.);
      float bend = t * t * hgt * (.25 + (.50 * gust + .08 * sin(uTime * 3.1 + aJ.z * 40. + base.x)) * uWind);
      p.x += bend * .8 + l.x * t * hgt * 1.4; p.z += bend * .45 + l.z * t * hgt * 1.4; p.y -= bend * .35;
      vec3 n = normalize(vec3(l.x * 2. + .3, 1.2, l.z * 2. + .2));
      vec3 root = mix(uVerge * .45, uMeadow * .7, aJ.y);
      vec3 tip = mix(mix(uVerge, uMeadow, aJ.y) * 1.15, uSeed * 1.2, aJ.w * smoothstep(.55, 1., t));
      vCol = mix(root, tip, t); vT = t;
      ${Ke} }`,fragmentShader:`${Ne} varying float vT;
    void main() { vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
      vec3 c = swLight(vCol, n) + vCol * uKeyCol * .35 * vT * max(dot(n, uSunW) + .5, 0.);
      c += swRing(vCol, n, .5);
      gl_FragColor = vec4(swFog(c, vDist), 1.); }`}),Ua=(g,E)=>new e.ShaderMaterial({uniforms:{...g,uMeadow:{value:new e.Color(E.meadow)},uDark:{value:new e.Color(E.dark)},uSeed:{value:new e.Color(E.seedhead)},uHouse:{value:new e.Vector2(0,-22)},uWet:{value:E.wet||0},uMist:{value:0},uHigh:{value:0}},vertexShader:`${Oe}
    void main() { vec3 p = position, n = normal; vCol = vec3(0.); ${Ke} }`,fragmentShader:`${Ne}
    uniform vec3 uMeadow; uniform vec3 uDark; uniform vec3 uSeed; uniform vec2 uHouse; uniform float uWet; uniform vec4 uSinkA; uniform float uMist; uniform float uHigh; uniform float uFwd; uniform vec4 uBeck;
    void main() { vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
      vec2 q = vLp.xz;
      float fp = 560. / max(vDist, 1.);                                          // pixels per metre here
      float big = vn(q * .011) * .6 + vn(q * .037 + 9.) * .4;                    // field to field
      float mid = vn(q * .19 + 4.) * .6 + vn(q * .53 + 11.) * .4;
      // the wind: two trains of gusts crossing the grass
      float gust = vn(q * .06 + vec2(uTime * .55, uTime * .32)) * .65 + vn(q * .21 + vec2(uTime * 1.2, -uTime * .6)) * .35;
      // tussocks (0.7 m), blades (6 cm, streaked along the wind) and specks, each faded out as it nears a pixel
      float kT = smoothstep(1.2, 4., fp * .7), kB = smoothstep(1.5, 5., fp * .08), kS = smoothstep(1.5, 4., fp * .04);
      float tus = vn(q * 1.45 + 2.) * .6 + vn(q * 3.1) * .4;
      vec2 qb = vec2(q.x * 15. + q.y * 6. + gust * 2.5, q.y * 5.5 - q.x * 2.);
      float bl = vn(qb) * .55 + vn(qb * 2.3 + 7.) * .45;
      float sp = h21(floor(q * 26.));
      // tawny seed heads lie in drifts; the gusts flatten and lift them
      float drift = smoothstep(.42, .7, vn(q * .045 + 20.) * .55 + mid * .25 + gust * .28);
      vec3 green = uMeadow * (.74 + .42 * big) * (.9 + .2 * mid);
      vec3 alb = mix(green, uSeed * (.8 + .3 * mid), drift * .55);
      alb *= 1. + (tus - .5) * .5 * kT;
      alb *= 1. + (bl - .5) * .75 * kB;
      alb = mix(alb, uSeed * 1.25, step(.93, sp) * kS * (.35 + .5 * drift));     // seed heads catching the afterglow
      alb = mix(alb, uDark * 1.1, smoothstep(.62, .2, tus) * .28 * kT * (1. - drift));   // the dark between tussocks
      alb *= .76 + .50 * gust * smoothstep(1400., 40., vDist);
      float r = distance(q, uHouse);
      float far = smoothstep(380., 760., r);                                     // the bowl's rim: hedged fields
      vec2 fq = q * .0085 + vec2(vn(q * .003) * 1.7, vn(q * .0031 + 5.) * 1.7);
      vec2 fc = floor(fq), ff = abs(fract(fq) - .5);
      float fields = h21(fc + 3.), hedgeLn = smoothstep(.455, .485, max(ff.x, ff.y));
      vec3 fcol = mix(uMeadow * .72, mix(uSeed * .62, uMeadow * 1.02, fields), step(.35, fields));
      alb = mix(alb, fcol, far * .85);
      alb = mix(alb, uDark * 1.25, hedgeLn * .8 * far * .85);
      // THE VALLEY FLOOR, seen from far or from above: fields, blue-green and tawny by turns, ruled by dark hedgerows.
      // fa runs from the gate toward the hill along the last line of the road, fb across it; the long hedges fan out
      // from behind the house, so from the hilltop they all lead the eye to it.
      vec2 dg = q - uSinkA.zw; float fa = dg.x * uSinkA.x + dg.y * uSinkA.y, fb = dg.x * uSinkA.y - dg.y * uSinkA.x;
      // the hillside beyond the hollow (more than 200 m to the car's right of the lane): it is farmed like the valley floor,
      // so it keeps the fields and their hedgerows where the bowl's rim would fade them to open hill. Its fields come in
      // between s 420 and s 470 (110 to 60 m short of uBeck.x), a ramp 5 m longer at each end than the hollow's own
      // opening (s 425 to 465): about the same place, not the same numbers.
      float hillK = smoothstep(200., 280., -fb) * smoothstep(uBeck.x - 110., uBeck.x - 60., fa);
      float vfar = smoothstep(mix(110., 70., uHigh), mix(240., 125., uHigh), vDist) * (1. - far * (1. - hillK)) * smoothstep(-70., -20., fa);
      float fA = fa / 37. + .22 * vn(vec2(fb * .006, 3.)) + .5, row = floor(fA);
      float fBc = fb / max(.30, (fa + 150.) / 400.) / mix(64., 96., h21(vec2(row, 7.)));
      float fB = fBc + h21(vec2(row, 2.)) * 5., col = floor(fB);
      float wA = max(fwidth(fA), 1e-5), wB = max(fwidth(fBc), 1e-5);
      float eA = .5 - abs(fract(fA) - .5), eB = .5 - abs(fract(fB) - .5);
      float lnA = 1. - smoothstep(.7, 1.6, min(eA / wA, eA * 37. / 1.6)), lnB = 1. - smoothstep(.6, 1.3, min(eB / wB, eB * 80. / 1.6));
      float lnK = 1. - smoothstep(.10, .30, max(wA, wB));
      float fid = h21(vec2(row, col) + 11.);
      vec3 fld = fid < .42 ? uMeadow * vec3(.66, .84, .90) * .80 : (fid < .80 ? mix(uSeed, uMeadow, .30) * .92 : uMeadow * vec3(.92, 1.04, .86));
      fld *= .90 + .20 * mid + .10 * (vn(vec2(fb * .5, fa * .03)) - .5);        // mown lines along the field
      alb = mix(alb, fld, vfar * .80);
      alb = mix(alb, uDark * .80, max(lnA, lnB) * lnK * vfar * .90);
      alb = mix(alb, alb * vec3(.60, .74, .98), far * .65);                      // the hills hold the blue of the hour
      alb = mix(alb, alb * .78, uWet * .6);
      vec3 c = swLight(alb, normalize(n + vec3(bl - .5, 0., tus - .5) * .5 * kT));
      c += alb * uKeyCol * .30 * drift * gust * smoothstep(700., 20., vDist);    // the sheen running with the gusts
      c *= mix(vec3(1.), mix(vec3(1.24, 1.03, .80), vec3(.86, .97, 1.12), smoothstep(-240., 200., fb)), vfar);
      float lastLight = drift * smoothstep(.45, .75, gust + mid * .4);
      c = mix(c, c * mix(vec3(.80, .90, .95), vec3(.56, .70, .94), far) + alb * uKeyCol * .95 * lastLight * (1. - far), uFwd);   // the afterglow side of the valley is warmer
      // ground mist pooled in the low ground before the house: the house and its trees stand on a pale band
      float wisp = vn(vec2(fb * .017 + uTime * .012, fa * .03)) * .6 + vn(vec2(fb * .045 - uTime * .017, fa * .08 + 4.)) * .4;
      float pool = smoothstep(-30., 30., fa) * (1. - smoothstep(40., 110., fa + 60. * (wisp - .5)));            // the long pool before the house
      float lie = smoothstep(.30, .95, fract(fA)) * (1. - smoothstep(150., 215., fa)) * .45;                    // thin veils lying against the far hedge of each field
      float mistK = max(pool * smoothstep(.22, .62, wisp), lie * smoothstep(.40, .75, wisp)) * uMist * smoothstep(80., 150., vDist);
      c = mix(c, (uFogCol * 1.10 + uKeyCol * .14) * mix(vec3(1.08, 1.0, .90), vec3(.96, 1.0, 1.04), smoothstep(-240., 200., fb)), mistK * .70);
      c += swRing(alb, n, .2);
      // THE BECK (the road ahead): it comes down past the knoll, runs under the lane at the bridge and winds away over the
      // low ground on the afterglow side, widening into a tarn. Water is the sky lying on the land; rushes darken its banks.
      float aF = fa - uBeck.x;
      float f1 = 58. + smoothstep(6., 40., fb) * (14. * sin(fb * .031) + 9. * sin(fb * .0113)) - .30 * max(fb, 0.);      // the reach that crosses under the lane
      float g2 = -11. - 3. * sin(aF * .13) - 45. * (1. - smoothstep(-50., 10., aF)) - 130. * (1. - smoothstep(-112., -50., aF));                                    // the reach that runs beside the lane, then away to the tarn
      float d1 = aF - f1, d2 = fb - g2;
      float w1 = max(fwidth(d1), 1e-4), w2 = max(fwidth(d2), 1e-4);
      float hw1 = 1.0 + .5 * vn(vec2(fb * .11, 2.)), hw2 = 1.7 + 1.1 * vn(vec2(aF * .09, 5.)) + 3.0 * smoothstep(14., 34., aF) * (1. - smoothstep(50., 58., aF));      // it widens into a pool above the bridge
      float m1 = step(-15., fb) * step(4.6, abs(fb)) * (1. - smoothstep(380., 480., fb)), m2 = step(aF, 59.5) * smoothstep(-118., -100., aF);
      float water = max((1. - smoothstep(0., 1., (abs(d1) - max(hw1, .9 * w1)) / max(w1, .25))) * m1,
                        (1. - smoothstep(0., 1., (abs(d2) - max(hw2, .9 * w2)) / max(w2, .25))) * m2);
      vec2 tp = vec2(aF - uBeck.y, fb - uBeck.z);
      float tr = length(tp * vec2(1. / 85., 1. / 44.)) + (vn(tp * .021 + 3.) - .5) * .38;      // the long tarn in the low ground on the afterglow side
      water = max(water, 1. - smoothstep(.90, 1.0, tr));
      float rush = max((1. - smoothstep(hw1 + .2, hw1 + 2.6, abs(d1) + (tus - .5) * 1.6)) * m1, (1. - smoothstep(hw2 + .2, hw2 + 2.6, abs(d2) + (tus - .5) * 1.6)) * m2);
      rush = max(rush, 1. - smoothstep(.95, 1.25, tr + (tus - .5) * .2)) * (1. - water);
      c = mix(c, c * vec3(.46, .58, .42), rush * .75);
      vec3 vw = normalize(uCamW - vWp + vec3(0., 1e-4, 0.));
      float gW = .5 + .5 * dot(normalize(-vw.xz + vec2(1e-5, 0.)), normalize(uSunW.xz + vec2(1e-5, 0.)));
      float frW = 1. - max(vw.y, 0.); frW = frW * frW * frW; frW = .34 + .66 * frW * frW;      // close to, we look down into dark water; further off it is all sky
      vec3 skyW = mix(uSkyCol * .66, uKeyCol * vec3(1.16, .95, .72), gW * gW) * (.74 + .40 * vn(vec2(aF * .45 + uTime * .8, fb * 5. - uTime * .2)));
      float eW = min(smoothstep(hw1 * .35, hw1, abs(d1)) * m1 + (1. - m1), smoothstep(hw2 * .35, hw2, abs(d2)) * m2 + (1. - m2)) * smoothstep(.55, .95, tr);
      skyW = mix(skyW, uDark * .55 + skyW * .18, eW * .7);                                        // the banks and their rushes stand in it upside down
      // so that it is water and not a pale plane: (1) the rushes of the bank stand in it as a ragged dark fringe, spike by
      // spike, up to 2 m in from the bank (rushes are about a metre tall and lean); (2) wind lanes: where a breath of air
      // ruffles it the water takes the blue overhead and loses the glow, in long patches that drift down the wind; (3) rings
      // where a fish has risen, at three places down the middle of the pool, each widening to 2.4 m in 4.5 s and dying as it goes
      float inB = max((hw1 - abs(d1)) * m1, (hw2 - abs(d2)) * m2);
      float spike = vn(vec2((aF + fb) * 2.9, 7.)) * .6 + vn(vec2((aF - fb) * 8.3, 3.)) * .4;
      float fringe = (1. - smoothstep(.15, .4 + 1.6 * spike, inB)) * step(.001, m1 + m2) * smoothstep(.55, .95, tr);
      skyW = mix(skyW, uDark * .50 + skyW * .15, fringe * .8);
      float wlane = smoothstep(.50, .66, vn(vec2(aF * .22 - uTime * .10, fb * .9 + uTime * .03)) * .65 + vn(vec2(aF * .7 - uTime * .25, fb * 2.6)) * .35);
      skyW = mix(skyW, uSkyCol * vec3(.46, .60, .80), wlane * .60 * (1. - fringe));
      // a ring is a pale line and a dark one, each 0.11 m wide: like every pattern here it fades to the water's own tone
      // (its mean: the two lines are added to and taken from it) before its width nears a pixel
      float kR = smoothstep(1.5, 5., fp * .11);
      for (int k = 0; k < 3; k++) {
        float fk = float(k), cA = 24. + 13. * fk, cB = -11. - 3. * sin(cA * .13) + (k == 1 ? 1.2 : -.8);
        float rr = length(vec2(aF - cA, fb - cB)), ph = fract(uTime / 4.5 + fk * .37), fall = (1. - ph) * (1. - ph);
        float e1 = (rr - 2.4 * ph) / .11, e2 = (rr - 2.4 * ph + .24) / .11;
        skyW += (uSkyCol * .55 * exp(-e1 * e1) - skyW * .35 * exp(-e2 * e2)) * fall * step(.001, m2) * kR;
      }
      float glint = smoothstep(.80, .92, vn(vec2(aF * 2.6 + uTime * 1.3, fb * 7. - uTime * .4))) * (1. - eW);
      skyW += uKeyCol * .30 * glint * gW;                                                         // the current, catching the last light
      c = mix(c, min(skyW * frW * 1.12, vec3(.92)) + uSkyCol * vec3(.36, .50, .66) * (1. - frW), water);      // the ember of the afterglow lies in it: no track is that colour
      gl_FragColor = vec4(swFog(c, vDist), 1.); }`}),Ha=(g,E)=>new e.ShaderMaterial({uniforms:{...g,uGravel:{value:new e.Color(E.gravel)},uVerge:{value:new e.Color(E.verge)},uSeed:{value:new e.Color(E.seedhead)},uWet:{value:E.wet||0},uSkyTint:{value:new e.Color(E.zenith)},uBand:{value:new e.Color(E.band)},uOpp:{value:new e.Color(E.opposite)},uRingS:{value:new e.Vector2(635,0)},uRingCol:{value:new e.Color("#CFE3F2")},uFwd:g.uFwd},polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`${Oe} varying vec2 vUv;
    void main() { vec3 p = position, n = normal; vCol = vec3(0.); vUv = uv; ${Ke} }`,fragmentShader:`${Ne}
    uniform vec3 uGravel; uniform vec3 uVerge; uniform vec3 uSeed; uniform float uWet; uniform vec3 uSkyTint; uniform vec3 uBand; uniform vec3 uOpp; uniform vec2 uRingS; uniform vec3 uRingCol; uniform float uFwd; varying vec2 vUv;
    void main() { vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
      float x = abs(vUv.x), fp = 560. / max(vDist, 1.);
      float kG = smoothstep(1.5, 5., fp * .07), kP = smoothstep(1.2, 4., fp * .5), kS = smoothstep(1.5, 4., fp * .035);
      // gravel: fine grit, pebbles (cells of 3.5 cm, some pale, some dark), patches of bare earth
      float grit = vn(vUv * vec2(27., 23.)) * .5 + vn(vUv * vec2(61., 57.)) * .5;
      float peb = vn(vUv * vec2(47., 43.) + 7.) * .6 + vn(vUv * vec2(19., 17.)) * .4;
      float ptch = vn(vUv * vec2(1.3, .55) + 3.) * .6 + vn(vUv * vec2(3.7, 1.9)) * .4;
      float wob = (vn(vec2(vUv.y * .23, 1.5)) - .5) * .22;                         // the ruts wander a little
      float rutD = abs(x - .78 + wob * sign(vUv.x));
      float rut = 1. - smoothstep(.13, .40, rutD);
      vec3 alb = uGravel * (.86 + .22 * (ptch - .5) * kP);
      alb *= 1. + (grit - .5) * .5 * kG;
      alb = mix(alb, uGravel * vec3(1.14, 1.10, 1.04), smoothstep(.62, .72, peb) * kS * .55);
      alb = mix(alb, uGravel * vec3(.58, .55, .52), smoothstep(.38, .28, peb) * kS * .55);
      alb *= 1. - rut * (.20 + .12 * ptch);                                      // packed and damp where the wheels run
      // grass down the crown, in tufts, and coming in from the verges
      float tuft = vn(vUv * vec2(5., 1.7) + 9.) * .6 + vn(vUv * vec2(13., 4.)) * .4;
      float crown = (1. - smoothstep(.04, .30, x + (tuft - .5) * .3 * kP)) * smoothstep(.40, .70, ptch + (tuft - .5) * .6) * .8;
      float blade = vn(vUv * vec2(34., 9.) + uTime * vec2(.6, .2)) * .6 + vn(vUv * vec2(71., 15.)) * .4;
      vec3 grass = mix(uVerge, uSeed, .15 + .35 * tuft) * (.72 + .55 * mix(.5, blade, kG)) * (.85 + .3 * vn(vUv * vec2(1.7, .45) + uTime * vec2(.9, .6)));
      alb = mix(alb, grass, crown * .85);
      float edge = smoothstep(1.50, 1.92, x + (vn(vUv * vec2(2.3, .9)) - .5) * .55 + (tuft - .5) * .28 * kP);
      alb = mix(alb, grass, edge);
      vec3 c = swLight(alb, normalize(n + vec3(grit - .5, 0., peb - .5) * .35 * kG));
      // rain: puddles in the ruts and a wet sheen everywhere, both showing the sky the back window faces
      vec3 v = normalize(uCamW - vWp + vec3(0., 1e-4, 0.));
      float fres = 1. - max(v.y, 0.); fres = fres * fres; fres = .08 + .92 * fres * fres;
      vec3 skyR = mix(mix(uOpp, uBand, .30) * 1.12, uSkyTint * 1.05, smoothstep(.0, .5, v.y));
      float pm = vn(vUv * vec2(.83, .31) + 13.) * .6 + vn(vUv * vec2(2.9, 1.1) + 2.) * .4;
      float puddle = smoothstep(.535, .575, pm + rut * .10 - .06) * smoothstep(.45, .75, rut) * (1. - edge) * (1. - crown);
      float rip = 1. + .07 * (vn(vUv * vec2(9., 5.) + uTime * vec2(.9, 1.3)) - .5) * kP;
      c *= 1. - uWet * .30 * (1. - edge);                                           // wet gravel is darker
      c = mix(c, skyR * rip, min(1., uWet * 1.2) * (puddle * mix(.6, .95, fres) + (1. - edge) * (1. - crown) * .22 * fres));
      float ahead = uRingS.x - vUv.y;                                             // metres this side of the ring
      float streak = ahead > 0. ? exp(-ahead / 14.) * .8 + exp(-ahead / 80.) * .75 : exp(max(ahead, -60.) / 3.);
      float shim = .88 + .24 * vn(vec2(vUv.x * 3., vUv.y * .35 - uTime * 1.4));
      c *= mix(vec3(1.), mix(vec3(.72), vec3(.60, .76, .88), edge), uFwd);                                      // dusk on the gravel, so the light can lie on it
      c += alb * uRingCol * streak * shim * uRingS.y * ((.16 + .62 * rut) * (1. - edge) * (1. - crown) + .10);
      gl_FragColor = vec4(swFog(c, vDist), 1.); }`}),ja=(g,E)=>new e.ShaderMaterial({uniforms:{uTime:E.uTime,uWinv:{value:new e.Matrix3},uSunF:{value:new e.Vector3},uGlow:{value:new e.Color(g.glow)},uOpp:{value:new e.Color(g.opposite)},uZen:{value:new e.Color(g.zenith)},uBand:{value:new e.Color(g.band)},uFogCol:E.uFogCol,uLow:{value:g.low||0},uFwd:E.uFwd},depthWrite:!1,depthTest:!1,side:e.BackSide,vertexShader:`varying vec3 vDir; void main() { vDir = position; vec4 p = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
    if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:`${Eo}
    uniform float uTime; uniform mat3 uWinv; uniform vec3 uSunF; uniform vec3 uGlow; uniform vec3 uOpp; uniform vec3 uZen; uniform vec3 uBand; uniform vec3 uFogCol; uniform float uLow; uniform float uFwd;
    varying vec3 vDir;
    void main() {
      vec3 d = normalize(uWinv * vDir + vec3(0., 1e-6, 0.));
      float e = d.y, g = .5 + .5 * dot(normalize(d.xz + vec2(1e-5, 0.)), normalize(uSunF.xz));
      float g2 = g * g;
      float gf = g2 * g2 * g2 * g;                                              // the forward leg: dusk has come on, the glow keeps to its own side
      vec3 hor = mix(uOpp * mix(1., .80, uFwd), uGlow, mix(g2 * (3. - 2. * g), gf, uFwd));
      float up = smoothstep(0., mix(.62, .30, uFwd), max(e, 0.));
      vec3 c = mix(hor, uZen * mix(1., .70, uFwd), sqrt(up) * mix(1., mix(.78, 1. - .5 * gf, uFwd), g2));
      c += uBand * exp(-max(e, 0.) * 11.) * g2 * g * .32;
      float be = (e - .115) / .085; c = mix(c, uBand * .86, exp(-be * be) * (1. - .75 * g2) * .62);       // the arch of rose over the earth's shadow
      // a few high streaks still catching the light, drifting
      float de = max(e, 0.) + .12;
      vec2 q = vec2(d.x / de * 1.1 + uTime * .006, d.z / de * 3.4);
      float st = smoothstep(.56, .86, vn(q) * .65 + vn(q * 2.3 + 5.) * .35) * smoothstep(.03, .16, e) * (1. - smoothstep(.4, .7, e));
      c = mix(c, mix(uBand * .95, uGlow * 1.05, g2), st * .55 * mix(1., .25 + .75 * gf, uFwd));
      c = mix(c, uBand * .94, exp(-max(e, 0.) * 6.5) * uLow * .9);
      // THE ROAD AHEAD: long bars of cloud low over the land, slate above, their undersides still alight on the afterglow side
      float de2 = max(e, 0.) + .20;
      vec2 cq = vec2(d.x / de2 * .55 + uTime * .004, d.z / de2 * 2.9 + d.x * .35);
      float c0 = vn(cq) * .62 + vn(cq * 2.3 + 3.) * .38, c1 = vn(cq + vec2(.05, .30)) * .62 + vn((cq + vec2(.05, .30)) * 2.3 + 3.) * .38;
      float bar = smoothstep(.50, .68, c0) * smoothstep(.035, .085, e) * (1. - smoothstep(.20, .40, e)) * uFwd;
      float under = smoothstep(.02, .22, c0 - c1);
      vec3 body = mix(uZen * .52 + uOpp * .10, uBand * .70, g2 * .8), lit = mix(uBand * .86, uGlow * 1.18, g);
      c = mix(c, mix(body, lit, under * (.35 + .65 * g)), bar * .82);
      c += uGlow * .16 * exp(-max(e, 0.) * 9.) * g2 * uFwd;                      // and a last warm band along the land on that side
      // the afterglow's own quarter (never in the back window; the head turns through it): a deeper ember along the hills
      c = mix(c, uGlow * vec3(1.06, .86, .62), exp(-max(e, 0.) * 13.) * gf * .75);
      c = mix(uFogCol, c, smoothstep(-.03, .035, e));
      gl_FragColor = vec4(min(c, vec3(.85)), 1.);
    }`}),Ya={A:{glow:"#F0B59B",opposite:"#7F96A6",zenith:"#56708C",band:"#F7C7A6",key:"#F0B59B",fillSky:"#8FA6B8",fillGround:"#3C4A44",fog:"#7F96A6",meadow:"#5F7355",dark:"#26332E",gravel:"#CFC6B4",verge:"#586B4C",wall:"#F4EFE2",wet:0,seedhead:"#9C9468"},B:{glow:"#EFE4A4",opposite:"#B9C8D2",zenith:"#7F9CB8",band:"#F8E27C",key:"#F8E69A",keyGain:1.22,fillSky:"#9DB2C4",fillGround:"#404E48",fog:"#A9BAC5",meadow:"#657A5C",dark:"#2B3A34",gravel:"#9A978C",verge:"#52674A",wall:"#F4EFE2",wet:.15,seedhead:"#A3A27A",low:1},C:{glow:"#EDA98F",opposite:"#6E8798",zenith:"#48607C",band:"#F6BE9C",key:"#EDAE96",fillSky:"#8098AC",fillGround:"#34423E",fog:"#72899A",meadow:"#506650",dark:"#222E2A",gravel:"#A9A69A",verge:"#4A5E46",wall:"#F4EFE2",wet:.8,seedhead:"#8A8A62"}};var Ja={id:"still-waving",name:"Still Waving",category:"wilderness",weirdness:.2,media:["open","air"],async build(g){const E=g.rng,be=g.vary||{},se=g.quality?.detail??1,He=be.density??1,ft=E(),oe=be.hour==="dawn"?"B":ft<.42?"A":ft<.7?"B":"C",ke=!!be.rare,H=Ya[oe],w=_a({mirror:oe==="B"});await g.yield();const D=Pa(H);H.keyGain&&D.uKeyCol.value.multiplyScalar(H.keyGain),D.uSinkA={value:new e.Vector4(Math.sin(w.hf),Math.cos(w.hf),w.gate.x,w.gate.z)},D.uSinkB={value:new e.Vector4(0,w.a300,0,0)},D.uFwd={value:0},D.uRingL={value:new e.Vector4(0,0,0,0)},D.uRingC={value:new e.Color("#CFE3F2")},D.uBeck={value:new e.Vector4(w.a300+230,0,0,0)},D.uWind={value:1},await g.yield();const Me=new e.Vector3(-Math.sin(55*Math.PI/180)*Math.cos(12*Math.PI/180),Math.sin(12*Math.PI/180),Math.cos(55*Math.PI/180)*Math.cos(12*Math.PI/180));{const t=new e.Color(H.gravel).multiplyScalar(.86*(1-.3*(H.wet||0)));D.uLane={value:new e.Vector4(t.r,t.g,t.b,Me.y)}}const ze=new e.Scene;ze.fog=new e.FogExp2(new e.Color(H.fog),.0012);const Le=qa(w.railPoints),j=new e.Group;j.matrixAutoUpdate=!1,ze.add(j);const fe=new e.DirectionalLight(new e.Color(H.key),1.1);fe.position.copy(Me).multiplyScalar(200),fe.target.position.set(0,0,0);const te=new e.HemisphereLight(new e.Color(H.fillSky),new e.Color(H.fillGround),.75);j.add(fe,fe.target,te),await g.yield();const ye=ja(H,D);ye.uniforms.uSunF.value.copy(Me);const je=new e.Mesh(new e.SphereGeometry(2400,32,20),ye);je.renderOrder=-1,je.frustumCulled=!1,ze.add(je),await g.yield();const Jt=0,Ye=-22,ie=Math.sin(w.hf),re=Math.cos(w.hf),T=g.noise.n2,Qt=[470,840,1290],Ae=[30,72,128],ut=[190,250,330],$e=9,Fe=24,Ze=26,Xe=new e.Vector3(.8*Math.sin(w.hf)-.6*Math.cos(w.hf),0,.8*Math.cos(w.hf)+.6*Math.sin(w.hf)),St=t=>-11-3*Math.sin(t*.13)-45*(1-M(-50,10,t))-130*(1-M(-112,-50,t)),ea=.38,ta=.01,oa=8,aa=6,qo=2,Ct=10,Bt=-118,_o=2,Po=40;let de=null;const na=(t,n,o)=>{if(!de||o>-7||n>Ct||n<Bt-32)return t;let a=1/0,i=0;for(let f=0;f+5<de.length;f+=3){const l=de[f+3]-de[f],x=de[f+4]-de[f+1],k=n-de[f],m=o-de[f+1],h=Math.min(Math.max((k*l+m*x)/(l*l+x*x),0),1),s=k-l*h,u=m-x*h,b=s*s+u*u;b<a&&(a=b,i=de[f+2]+(de[f+5]-de[f+2])*h)}const r=Math.max(Math.sqrt(a)-oa,0),d=i+$e/Fe*r*r/(r+aa),v=Math.min(Math.max(.5+.5*(t-d)/qo,0),1),c=Math.max(t+(d-t)*v-qo*v*(1-v),Math.min(i,t));return t+(c-t)*M(7,13,-o)*(1-M(-10,Ct,n))*M(Bt-32,Bt,n)},Vo=60,eo=180,O=(t,n)=>{const o=w.aOf(t,n),a=w.bOf(t,n),i=Math.abs(a),r=w.hillAt(o+34*Math.sin(a/170+1.3)*M(34,170,i))*(1-.25*M(120,500,i)*(.5+.5*Math.sin(a/260))),d=t-Jt,v=n-Ye,c=Math.hypot(d,v)+1e-6,f=(-d*ie-v*re)/c,l=(60-26*M(.3,.92,f))*(.85+.3*T(t*.0017,n*.0017)),x=M(400,1180,c),k=l*x*x,m=1.6*T(t*.006,n*.006)*M(Vo,eo,i)*M(40,140,Math.abs(o-60)+i);let h=0;if(o<-150)for(let C=0;C<3;C++){const p=Qt[C]+90*T(a*.0011+C*7.3,C*3.1)+.1*i*(C-1),G=ut[C],L=-o-p,W=Ae[C]*(.8+.32*T(a*.0019+C*11.7,5.5+C))*(1-.35*M(500,1500,i)),B=L<0?M(-G,0,L):1-.55*M(0,G*1.6,L);h=Math.max(h,W*B)}const s=o-(w.a300+230);let u=0,b=0;if(s>-40){const C=M(-40,50,s),p=M(14,60,i),G=(L,W,B,R)=>{const V=(s-L)/B,U=(a-W)/B;return R*Math.exp(-(V*V+U*U))};if(u=C*p*(G(105,88,62,11.5)+G(330,120,110,15)-7.5*M(22,130,-a)*(1-.6*M(190,420,-a))*(1-.7*M(160,420,s))),u+=C*p*1.1*T(t*.021+7,n*.021),i>3.6&&i<36&&s<150){const L=s-(58+M(6,40,a)*(14*Math.sin(a*.031)+9*Math.sin(a*.0113))-.3*Math.max(a,0));let W=a>-15?Math.exp(-L*L/16):0;if(s<59.5&&s>-30&&a<0){const B=a-(-11-3*Math.sin(s*.13)-45*(1-M(-50,10,s)));W=Math.max(W,Math.exp(-B*B/9))}u-=.38*W*M(3.6,7,i)*(1-M(24,36,i))}for(let L=0;L<2;L++){const W=[470,1020][L]+110*T(a*.0013+L*5.1,9.7+L),B=[210,300][L],R=s-W,V=[44,132][L]*(.62+.55*T(a*.0021+L*3.3,2.5+L*7))*(1-.3*Math.exp(-a*a/32400));b=Math.max(b,V*(R<0?M(-B,0,R):1-.6*M(0,B*1.5,R)))}}let y=0;if(a<-7){const C=M(w.a300+125,w.a300+165,o);y=-$e*(1-Math.exp((a+7)/Fe))*C*(1-M(w.a300+198,w.a300+230+Ct,o))+Ze*M(210,640,-a)*C}const A=na(Math.max(r,k,h,b)+m+u+y,s,a);if(Oo||s<150)return A;const q=Math.hypot((s-285)/85,(a+150)/44),_=1-M(.8,1.25,q);return A+(Io-A)*_};let Io=0,Oo=!0;{const t=w.gate.x+(w.a300+230+285)*ie-150*re,n=w.gate.z+(w.a300+230+285)*re+150*ie;Io=O(t,n)-.4,Oo=!1}{const t=[];let n=1/0;for(let o=Ct;o>=Bt-32-1e-6;o-=_o){const a=w.a300+230+o,i=St(o),r=St(o+.5)-St(o-.5),d=Math.sqrt(1+r*r);let v=O(w.gate.x+a*ie+i*re,w.gate.z+a*re-i*ie);for(let c=-Po;c<=Po+1e-6;c+=2){const f=a-r/d*c,l=i+c/d;l>-7||(v=Math.min(v,O(w.gate.x+f*ie+l*re,w.gate.z+f*re-l*ie)))}n=Math.min(v-ea,n-ta*_o*d),t.push(o,i,n)}de=t}const Te=[],Lt=[];for(let t=-2060;t<-100;t+=35)Te.push(t);for(let t=-100;t<196;t+=8)Te.push(t);for(let t=196;t<424;t+=1.5)Te.push(t);for(let t=424;t<680;t+=4)Te.push(t);for(let t=680;t<=2100;t+=70)Te.push(t);const Ko=[0,2,4,7,11,16,24,36,52,75,105,150,180,210,250,290,340,400,470,550,650,750,870,1e3,1150,1300,1500,1700],sa=[60,90,127.5,165,186,192,198],ia=Ko.slice(1).concat(sa).sort((t,n)=>n-t);for(const t of ia)Lt.push(-t);for(const t of Ko)Lt.push(t);const to=Te.length,Se=Lt.length,Ft=new Float32Array(to*Se*3),No=[];for(let t=0;t<to;t++){for(let n=0;n<Se;n++){const o=Te[t],a=Lt[n],i=w.gate.x+o*ie+a*re,r=w.gate.z+o*re-a*ie,d=(t*Se+n)*3;if(Ft[d]=i,Ft[d+1]=O(i,r),Ft[d+2]=r,t<to-1&&n<Se-1){const v=t*Se+n;No.push(v,v+Se,v+1,v+1,v+Se,v+Se+1)}}t%12===11&&await g.yield()}const Tt=new e.BufferGeometry;Tt.setAttribute("position",new e.BufferAttribute(Ft,3)),await g.yield(),Tt.setIndex(No),await g.yield(),Tt.computeVertexNormals(),await g.yield();const ra=Ua(D,H);await g.yield();const Gt=new e.Mesh(Tt,ra);Gt.frustumCulled=!1,j.add(Gt),await g.yield();const ve=()=>{const t=[],n=[],o=[],a=[],i=new e.Vector3,r=new e.Vector3,d=new e.Matrix3,v=new e.Color,c={P:t,Nn:n,C:o,Sw:a,kind:0,add(f,l,x,k=1,m=0,h=null){const s=f.index?f.toNonIndexed():f,u=s.attributes.position,b=s.attributes.normal;d.getNormalMatrix(l),v.set(x).multiplyScalar(k);for(let y=0;y<u.count;y++)i.fromBufferAttribute(u,y),h&&h(i),i.applyMatrix4(l),r.fromBufferAttribute(b,y).applyMatrix3(d).normalize(),t.push(i.x,i.y,i.z),n.push(r.x,r.y,r.z),o.push(v.r,v.g,v.b),a.push(m||c.kind);s!==f&&s.dispose(),f.dispose()},box(f,l,x,k,m,h,s,u=1,b=0,y=0){c.add(new e.BoxGeometry(k,m,h),new e.Matrix4().makeTranslation(f,l,x).multiply(new e.Matrix4().makeRotationY(b)).multiply(new e.Matrix4().makeRotationZ(y)),s,u)},mesh(f){const l=new e.BufferGeometry;l.setAttribute("position",new e.Float32BufferAttribute(t,3)),l.setAttribute("normal",new e.Float32BufferAttribute(n,3)),l.setAttribute("color",new e.Float32BufferAttribute(o,3)),l.setAttribute("aSway",new e.Float32BufferAttribute(a,1));const x=new e.Mesh(l,f);return x.frustumCulled=!1,x}};return c},oo=X0(D,{side:e.DoubleSide}),Dt=J0(D),z=new e.Vector3;let ao=null;{const t=[-2.7,-1.35,0,1.35,2.7],n=[],o=[],a=[];let i=0;for(let v=-21;v<=655;v+=1){for(const c of t)w.place(v,c,0,z),n.push(z.x,O(z.x,z.z)+.05,z.z),o.push(c,v);if(i>0){const c=i*5,f=c-5;for(let l=0;l<4;l++)a.push(f+l,c+l,f+l+1,f+l+1,c+l,c+l+1)}i++,i%220===0&&await g.yield()}const r=new e.BufferGeometry;r.setAttribute("position",new e.Float32BufferAttribute(n,3)),r.setAttribute("uv",new e.Float32BufferAttribute(o,2)),r.setIndex(a),r.computeVertexNormals();const d=new e.Mesh(r,Ha(D,H));d.frustumCulled=!1,d.renderOrder=1,j.add(d),ao=d.material.uniforms,ao.uRingS.value.x=513+278*(1-Wo)}await g.yield();let Uo=null,Ho=null;{const n=[],o=(()=>{let l=.4217;return()=>(l=(l*8121.13+.3379)%1,l)})();for(let l=0;l<13;l++){const x=l/13*Math.PI*2+o(),k=.015+.1*o(),m=.008+.008*o(),h=.03+.12*o(),s=.45+.55*o(),u=Math.cos(x),b=Math.sin(x),y=-b*m,A=u*m;n.push(u*k+y,0,b*k+A,u*k-y,0,b*k-A,u*(k+h),s,b*(k+h))}const a=new e.InstancedBufferGeometry;a.setAttribute("position",new e.Float32BufferAttribute(n,3));const i=l=>(l<155?36:l>636?0:l>255&&l<305?12:l>412&&l<505?15:l<255?18:22)*se*Math.min(1.2,He),r=[],d=[];let v=0,c=0;for(let l=-7;l<648;l+=.5)for(v+=i(l)*.5;v>=1;){v-=1;const x=o()<.012,k=o()<.5?-1:1,m=o(),h=x?(o()-.5)*.5:k*(1.72+(l<155?4.6:2.3)*m*m);if(x&&l<-2)continue;w.place(l+o()*.5,h,0,z);const s=T(z.x*.045+20,z.z*.045)*.5+.5;r.push(z.x,O(z.x,z.z)+.03,z.z,o()*6.283),d.push(x?.05+.05*o():.2+.34*o()*(.6+.8*s),o(),o(),o()<.35+.4*s?1:.15),++c%1500===0&&await g.yield()}a.setAttribute("aI",new e.InstancedBufferAttribute(new Float32Array(r),4)),a.setAttribute("aJ",new e.InstancedBufferAttribute(new Float32Array(d),4)),a.instanceCount=c;const f=new e.Mesh(a,Na(D,H));f.frustumCulled=!1,j.add(f),Uo=a.getAttribute("position"),Ho=f.material}const la=async()=>{const t=[],n=[],o=Math.round(2400*se*Math.min(1.1,He));let a=.2931;const i=()=>(a=(a*7919.37+.2718)%1,a);for(let r=0;r<o;r++){const d=i(),v=388+150*i(),c=-(2.6+34*d*d);w.place(v,c,0,z);const f=T(z.x*.045+20,z.z*.045)*.5+.5;t.push(z.x,O(z.x,z.z)+.02,z.z,i()*6.283),n.push(.3+.45*i()*(.6+.8*f),i(),i(),i()<.5+.4*f?1:.15),r%800===799&&await g.yield()}j.add(Je(t,n))},Je=(t,n)=>{const o=new e.InstancedBufferGeometry;o.setAttribute("position",Uo),o.setAttribute("aI",new e.InstancedBufferAttribute(new Float32Array(t),4)),o.setAttribute("aJ",new e.InstancedBufferAttribute(new Float32Array(n),4)),o.instanceCount=t.length/4;const a=new e.Mesh(o,Ho);return a.frustumCulled=!1,a};await g.yield();const no=H.wall,so="#4A5764",Z="#8A8F88",dt="#2E6DA4",ca="#1E2A33",me="#E9E4D6",ha="#3B4448",Y=ve(),Wt=ve();{const t=Wt,n=(h,s,u)=>new e.Matrix4().makeTranslation(h,s,u),o=1.5,a=4+o,i=15+o,r=-22,d=-29,v=4.4,c=7,f=(r+d)/2,l=(a+i)/2;t.kind=1,t.box(l,v/2,f,i-a,v,r-d,no,.8);for(const h of[a,i]){const s=new e.Shape;s.moveTo(d-f,0),s.lineTo(r-f,0),s.lineTo(0,c-v),s.closePath(),t.add(new e.ShapeGeometry(s),n(h,v,f).multiply(new e.Matrix4().makeRotationY(-Math.PI/2)),no,.86)}t.box(13.4+o,c+.35,f,.9,1.6,.8,no,.74),t.kind=0,t.box(l,.22,f,i-a+.08,.44,r-d+.08,ha,1),t.box(13.4+o,c+1.18,f,1.02,.1,.92,Z,.9);for(const h of[-.22,.22])t.add(new e.CylinderGeometry(.1,.13,.42,10),n(13.4+o+h,c+1.42,f),"#9A6248",.9);t.kind=2;const x=Math.atan2(c-v,(r-d)/2),k=Math.hypot(c-v,(r-d)/2)+.5;for(const h of[1,-1]){const s=n(l,(v+c)/2-.1,f+h*((r-d)/4+.18)).multiply(new e.Matrix4().makeRotationX(h*x));t.add(new e.BoxGeometry(i-a+.7,.12,k),s,so,1)}t.kind=0,t.box(l,c+.03,f,i-a+.74,.14,.24,"#5A6670",1);for(const h of[a-.36,i+.36])for(const s of[1,-1])t.add(new e.BoxGeometry(.05,.2,k),n(h,(v+c)/2-.18,f+s*((r-d)/4+.18)).multiply(new e.Matrix4().makeRotationX(s*x)),me,.8);t.box(l,v-.14,r+.42,i-a+.5,.1,.12,"#39434A",1),t.box(a+.25,v/2-.1,r+.1,.09,v-.2,.09,"#39434A",1),await g.yield();for(const[h,s,u,b]of[[6.3,1.62,1,1.4],[12.7,1.62,1,1.4],[6.3,3.5,1,1.1],[12.7,3.5,1,1.1]]){const y=h+o;t.box(y,s,r+.03,u,b,.04,ca,1),t.box(y,s+b*.22,r+.035,u,b*.5,.045,"#33475A",1);for(const A of[-1,1])t.box(y+A*(u/2+.035),s,r+.13,.07,b+.14,.05,me,.9);t.box(y,s+b/2+.035,r+.13,u+.14,.07,.05,me,.9),t.box(y,s,r+.135,u,.05,.04,me,.9),t.box(y,s,r+.13,.035,b,.035,me,.9);for(const A of[-.25,.25])t.box(y+A*u,s-b*.25,r+.128,.022,b*.5,.025,me,.85);t.box(y,s-b/2-.05,r+.16,u+.26,.09,.22,Z,.95)}const m=9.5+o;t.box(m,1.03,r+.04,.98,2.06,.06,dt,.78);for(const h of[.55,1.45])for(const s of[-.22,.22])t.box(m+s,h,r+.08,.3,h<1?.62:.78,.02,dt,.62);t.box(m+.36,1.05,r+.1,.05,.05,.05,"#C9B37A",1),t.box(m,2.24,r+.05,.98,.3,.05,"#33475A",1);for(const h of[-1,1])t.box(m+h*.54,1.2,r+.1,.09,2.44,.1,me,.9);t.box(m,2.44,r+.1,1.17,.09,.1,me,.9),t.box(m,.07,r+.42,1.5,.14,.7,Z,.95),t.kind=2,t.box(m,2.66,r+.34,1.9,.08,.78,so,1,0,0),t.kind=0;for(const h of[-1,1])t.box(m+h*.82,2.5,r+.3,.06,.26,.6,me,.8);await g.yield();for(const h of[-1,1]){t.kind=3,t.box(h*2.05,.75,-8,.56,1.5,.56,Z,.95),t.kind=0,t.box(h*2.05,1.54,-8,.7,.1,.7,Z,1.08),t.add(new e.ConeGeometry(.46,.26,4),n(h*2.05,1.72,-8).multiply(new e.Matrix4().makeRotationY(Math.PI/4)),Z,1);const s=h*.42,u=1.85,b=h*2.05+Math.sin(s)*(u/2+.2),y=-8.2-Math.cos(s)*(u/2+.2);for(const C of[.22,.68,1.14])t.box(b,C,y,u,.09,.05,dt,1,Math.PI/2-s);for(let C=-.5;C<=.501;C+=.125)t.box(b+Math.sin(s)*C*u*-1,.7+.05*Math.cos(C*6.283),y+Math.cos(s)*C*u,.045,1.02+.1*Math.cos(C*6.283),.04,dt,C===-.5||C===.5?.85:1,Math.PI/2-s);t.box(b,.68,y,u*1.08,.07,.03,dt,.8,Math.PI/2-s,.5*h);const A=h<0?46:17;await g.yield(),t.kind=3,t.box(h*(2.33+A/2),.5,-8,A,1,.46,Z,.78),t.kind=0;let q=0,_=.7311+h*.1;for(let C=.12;C<A;q++){_=(_*9973.7+.371)%1;const p=.11+.11*_,G=.22+.13*(_*7.3%1),L=.86+.34*(_*13.7%1);t.box(h*(2.33+C+p/2),.99+G/2,-8,p,G,.44+.1*(_*3.1%1),_*5.3%1<.3?"#A39A84":Z,L,.1*(_-.5),.34*(_*17.1%1-.5)),C+=p+.012,q%90===89&&await g.yield()}}}await g.yield();const io=ve(),mt=new e.Color(H.dark).lerp(new e.Color(H.meadow),.66).multiplyScalar(1.3),fa=new e.Color(H.meadow).multiplyScalar(.8),Et=.6,ro=Ue(),jo=Ue(),Ge="#"+mt.getHexString(),$=new e.Vector3,Q=new e.Vector3;let lo=.6183;const Qe=()=>(lo=(lo*7907.31+.1931)%1,lo),Rt=async(t,n,o,a,i,r,d,v=1,c=io,f=ro,l=0,x=null,k=null,m=0,h=null)=>{const s=[],u=[],b=[],y=[];let A=0;for(let p=t;p<=n+1e-6;p+=o,A++){A%10===9&&await g.yield();const G=Math.sqrt(Math.min(1,Math.min(p-t,n-p)/(o*1.01))),L=.55+.45*G,W=i(p)*(.95+.1*T(p*.31,7.7*a))*G,B=r(p)*G,R=.8*L+B*Et,V=[[-R,0,0],[-.8,B,0],[-.72,B+.25,1],[-.62,B+W*.82,1],[-.26,B+W,1],[.26,B+W*.97,1],[.62,B+W*.8,1],[.72,B+.25,1],[.8,B,0],[.8*L+B*1.1,0,0]],U=d(p),J=h?h(p):1;if(G>.99)for(let F=0;F<8;F++){const N=F<3,I=(N?(F-1)*.42:F===4?.78:-.8)*a+.12*T(p*2.1+F,4.4),K=N?W+.05+.18*T(p*1.7,F*3.1):W*(F<5?.45:[.18,.62,.86][F-5])+W*.14*T(p*1.3,F*5.7),X=U.x+U.lx*I,ee=U.z+U.lz*I;$.set(X+.4*T(p*3.7,F),O(X,ee)+B+K,ee+.4*T(F,p*3.1)),N?Q.set(U.lx*(F-1)*.5*a,1,U.lz*(F-1)*.5*a).normalize():Q.set(U.lx*(F===4?1:-1)*a,.35,U.lz*(F===4?1:-1)*a).normalize(),f.add($,Q,.95+.3*T(p*.9,F*2.3),Ge,(N?1.25:1)*(.55+.45*v)*(1+.25*T(p*.37,F+2.2)),0,J)}if(G>.99)for(let F=0;F<m;F++){const N=o*(F+.5+.4*T(p*3.3,F*1.9))/m-o*.5,I=d(Math.min(n,Math.max(t,p+N))),K=.34*T(p*2.9+F,6.1)*a,X=I.x+I.lx*K,ee=I.z+I.lz*K,ne=(1.1+.4*T(p*1.1+F*5.3,2.7))*Math.min(1,W/2);$.set(X,O(X,ee)+B+W*.96+ne*.3,ee),Q.set(I.lx*a,0,I.lz*a),f.add($,Q,ne,Ge,1.2*(.55+.45*v)*(1+.25*T(p*.41+F,7.2)),1,J)}if(G>.99)for(let F=0;F<l;F++){const N=.06+.9*((F+.5+.45*T(p*1.9,F*7.7))/l),I=o*.5*T(p*2.3+5,F*4.1),K=I?d(Math.min(n,Math.max(t,p+I))):U,X=-(.8-.22*N*N+.1*T(p*2.7,F*3.3))*a,ee=K.x+K.lx*X,ne=K.z+K.lz*X;$.set(ee,O(ee,ne)+B+N*W,ne),Q.set(-K.lx*a,.25+.5*N,-K.lz*a).normalize(),f.add($,Q,.85+.35*T(p*.9+3,F*2.3),Ge,(.62+.5*N)*(.6+.4*v)*(1+.3*T(p*.37+F,2.2)),0,J)}if(x&&B>.5&&G>.99)for(let F=0,N=Math.round((5+6*B)*Math.max(.6,se));F<N;F++){const I=Qe(),K=o*(Qe()-.5),X=d(Math.min(n,Math.max(t,p+K))),ee=-(R-(R-.8)*I)*a,ne=X.x+X.lx*ee,Ve=X.z+X.lz*ee,xe=.5+.5*T(ne*.3,Ve*.3);x.push(ne,O(ne,Ve)+B*I-.03,Ve,6.283*Math.abs(T(p*5.1,F*1.3))),k.push(.22+.34*xe*(.5+Qe()),.55+.45*Qe(),Qe(),xe>.72&&Qe()<.5?1:.1)}for(let F=0;F<V.length;F++){const N=V[F],I=N[2]*.16*T(p*.83+F*3.1,F*1.7+a),K=(N[0]*(N[2]?L:1)+I*G)*a,X=U.x+U.lx*K,ee=U.z+U.lz*K;s.push(X,O(X,ee)+N[1]+(N[2]&&F>2&&F<7?.2*T(p*1.3,F*2.9):0),ee);const ne=N[2]?(1+.3*T(p*.17,F+11.3))*v:.72+.28*v,Ve=N[2]?mt:fa;if(u.push(Ve.r*ne,Ve.g*ne,Ve.b*ne),b.push(N[2]?m&&F>=3&&F<=6?.8+.08*J:.8:0),A>0&&F>0){const xe=A*10+F,ct=xe-10;a>0?y.push(ct-1,ct,xe-1,ct,xe,xe-1):y.push(ct-1,xe-1,ct,ct,xe-1,xe)}}}await g.yield();const q=new e.BufferGeometry;q.setAttribute("position",new e.Float32BufferAttribute(s,3)),q.setIndex(y),q.computeVertexNormals(),await g.yield();const _=q.attributes.position,C=q.attributes.normal;for(const p of y)c.P.push(_.getX(p),_.getY(p),_.getZ(p)),c.Nn.push(C.getX(p),C.getY(p),C.getZ(p)),c.C.push(u[p*3],u[p*3+1],u[p*3+2]),c.Sw.push(b[p]);q.dispose()},Yo=.58,ua=.3315,da=.3395,ma=15,va=.3235,wa=.3395,pa=6.6,xa=.378,ya=.401,$o=2,Zo=4.1,De=299,Ce=271,ga=30,We=118,Xo=t=>{const n=M(Ce,De,t);return ga*n*n},qt=t=>$o*M(140,153,t)+(Zo-$o)*M(246,262,t)-(Zo-.5)*M(Ce,De-6,t),Jo=2.2,co=t=>Jo*M(246,262,t)-(Jo-.5)*M(Ce,De-6,t),Qo=t=>(1-.74*M(Ce+1,De-5,t))*(1+.34*T(t*.29,7.7)*M(Ce-8,Ce+6,t)),ba=t=>(2.2+.8*M(246,260,t))*Qo(t),ka=t=>3*Qo(t),e0=t=>{const n=Math.min(1,Math.max(0,(t-Ce)/(De-Ce)));return(1-n)*(1-n)},P={},ho=t=>n=>{w.road(n,P);const o=t(n);return{x:P.x+Math.cos(P.h)*o,z:P.z-Math.sin(P.h)*o,lx:Math.cos(P.h),lz:-Math.sin(P.h)}},t0=t=>-(3.7+qt(t)*Et+Xo(t)),Ma=t=>3.7+co(t)*Et+Xo(t),fo=ve(),o0=Ue(),a0=ve(),n0=Ue(),s0=ve(),i0=Ue(),r0=ve();await la();const l0=[],c0=[],h0=[],f0=[];await Rt(We,De,1.25,-1,ba,qt,ho(t0),Yo,fo,o0,9,l0,c0,3,e0),await g.yield(),await Rt(216,De,1.25,1,ka,co,ho(Ma),Yo*.85,a0,n0,9,h0,f0,3,e0),await g.yield();const u0=ve();await Rt(-52,24,1.5,1,()=>4.6,()=>0,t=>({x:t,z:-30.6,lx:0,lz:1}),.32,u0,jo),await g.yield();const _t=[];Y.kind=4;for(let t=14;t<We-2;t+=3.5){w.place(t,-3.1,0,z);const n=O(z.x,z.z),o=1.08+.1*T(t*.9,3.3),a=.07*T(t*.7,9.1);Y.box(z.x,n+o/2,z.z,.12,o,.12,"#6A645A",.85+.3*Math.abs(T(t*1.9,5.5)),.6*T(t,1.1),a),_t.push([new e.Vector3(z.x,n+o-.12,z.z),new e.Vector3(z.x,n+o*.52,z.z)])}const Ee=[];for(let t=396;t<501;t+=3.2){w.place(t,-6.2-.5*T(t*.05,2.2),0,z),w.road(t,P);const n=O(z.x,z.z),o=t>440&&t<446.5,a=(o?1.32:1.12)+.1*T(t*.9,6.3);if(Y.box(z.x,n+a/2,z.z,o?.17:.12,a,o?.17:.12,"#6A645A",.85+.3*Math.abs(T(t*1.9,8.5)),.6*T(t,4.1),.06*T(t*.7,2.1)),o&&t<443.3){const i=w.place(t+1.6,-6.2-.5*T((t+1.6)*.05,2.2),0,new e.Vector3),r=O(i.x,i.z);for(let d=0;d<5;d++)Y.box(i.x,r+.22+d*.235,i.z,3,.075,.035,"#7A7468",.9+.08*d,P.h-Math.PI/2);Y.box(i.x,r+.7,i.z,3.25,.06,.03,"#7A7468",.85,P.h-Math.PI/2,.3)}else(!o||t>443.3)&&Ee.push([new e.Vector3(z.x,n+a-.12,z.z),new e.Vector3(z.x,n+a*.52,z.z),o]);o&&t<443.3&&Ee.push(null)}Y.kind=0;const vt=[30,70,110,133,160,191,233],Pt=fo,d0=[],m0=[];{const v=.8867368421052633,c=.52/2+.1,f=(s,u,b)=>b.set(w.gate.x+s*ie+u*re,0,w.gate.z+s*re-u*ie),l=new e.Vector3,x={},k={},m=[[-.6,0],[-.33,.82],[.05,1],[.5,0]],h=(s,u)=>{f(s,u,l);const b=O(l.x,l.z);Y.kind=3,Y.box(l.x,b+.55,l.z,.44,1.3,.44,Z,.78,w.hf),Y.kind=0,Y.box(l.x,b+1.24,l.z,.52,.1,.52,Z,v,w.hf)};for(let s=1;37*(s-.61)<w.a210;s++){const u=37*(s-.61);let b=0;for(let A=0;A<260;A+=.5)if(w.road(A,P),w.aOf(P.x,P.z)>=u){b=A;break}w.road(b,P);const y=w.bOf(P.x,P.z);if(x[s]=u,k[s]=y,!(b<=vt[0])){for(const A of[-1,1]){if(A<0&&b<We)continue;let q=A<0&&b>=We?Math.max(3.6,-t0(b)+1.2):3.6;const _=s===3&&A>0;A>0&&h(u,y+A*q),_&&(q+=4.4);const C=[],p=[],G=A>0&&!_?c:0;for(let R=q,V=0;Math.abs(y+A*R)<=eo+1e-6;R+=4,V++){const U=V===0?R+G:R,J=1-M(Vo,eo,Math.abs(y+A*R)),F=Math.min(1,4*J),N=1*(.8+.35*T(R*.33,s*3.7+A))*J*(V===0?.8:1),I=.5*T(R*.05,s*1.3+A);for(let K=0;K<4;K++)f(u+I+(m[K][0]*(.8+.2*N)+.08*T(R*.9+K,s))*F,y+A*U,l),C.push(l.x,O(l.x,l.z)+m[K][1]*N,l.z);if(V>0)for(let K=1;K<4;K++){const X=V*4+K,ee=X-4;A>0?p.push(ee-1,ee,X-1,ee,X,X-1):p.push(ee-1,X-1,ee,ee,X-1,X)}}const L=new e.BufferGeometry;L.setAttribute("position",new e.Float32BufferAttribute(C,3)),L.setIndex(p),L.computeVertexNormals();const W=L.attributes.position,B=L.attributes.normal;for(const R of p){const V=.45*(1+.25*T(R*.37,s+A));Pt.P.push(W.getX(R),W.getY(R),W.getZ(R)),Pt.Nn.push(B.getX(R),B.getY(R),B.getZ(R)),Pt.C.push(mt.r*V,mt.g*V,mt.b*V),Pt.Sw.push(.55)}L.dispose()}await g.yield()}}{const s=x[3],u=k[3]+3.6,b="#7A7468";f(s,u+1.7,l);let y=O(l.x,l.z);Y.kind=4;for(let A=0;A<5;A++)Y.box(l.x,y+.24+A*.235,l.z,3.2,.08,.04,b,.8+.06*A,w.hf);for(const A of[-1.5,0,1.5])f(s,u+1.7+A,l),Y.box(l.x,y+.72,l.z,.09,1.16,.05,b,.75,w.hf);f(s,u+1.7,l),Y.box(l.x,y+.72,l.z,3.3,.07,.03,b,.72,w.hf,.23),Y.kind=3,f(s,u+3.85,l),y=O(l.x,l.z),Y.box(l.x,y+.32,l.z,.9,1.06,.16,Z,.52,w.hf),Y.kind=0;for(const[A,q]of[[-.3,.3],[.3,.3]])f(s+A,u+3.85,l),Y.box(l.x,y+q,l.z,.5,.08,.42,Z,.6,w.hf)}for(let s=0;s<4;s++)for(let u=0;u<9;u++){const b=x[3]+5+9*s+1.5*T(s*7.1+u*3.3,1.9),y=k[3]+(k[4]-k[3])*(b-x[3])/37;f(b,y+9+9*u+1.5*T(u*5.7+s*2.1,8.4),l),d0.push({x:l.x,z:l.z,ry:s+u*1.9,sc:.85+.15*(1+T(s*3.9+u*1.7,5.2)),k:.26+.04*T(s*1.3,u*2.9)})}{w.place(100,-4.3,0,z),w.road(100,P);const s=O(z.x,z.z);Y.kind=3,Y.box(z.x,s+.2,z.z,1.9,.5,.62,Z,.78,P.h-Math.PI/2),Y.kind=0,Y.box(z.x,s+.452,z.z,1.62,.01,.36,Z,.78/2,P.h-Math.PI/2)}}const v0=[],S=ve(),Re=ve(),uo=Ue(),w0=526,mo=7,za=564.5,Aa=1.3;{let t=.6173,n=0;const o=()=>(t=(t*9973.7+.371)%1,t);w.road(560,P);const a=P.h-Math.PI/2,i="#7A7468",r=async(x,k,m,h)=>{for(let s=x;s<k-.2;s+=2.4){const u=Math.min(2.4,k-s),b=h?h(s+u/2):1,y=(.78+.1*T(s*.11,m))*b,A=.14*T(s*.07,3.1+m);w.place(s+u/2,m+A,0,z);const q=O(z.x,z.z);if(S.kind=3.2,S.box(z.x,q+y/2-.06,z.z,u+.03,y+.12,.52,Z,.72+.12*o(),a),S.kind=0,!(b<.8||s>641))for(let _=.02;_<u-.05;n++){const C=Math.min(u-_,.17+.2*o()),p=.19+.09*o();w.place(s+_+C/2,m+A,0,z),S.box(z.x,q+y+p/2-.03,z.z,C,p,.46+.1*o(),o()<.3?"#A39A84":Z,.84+.36*o(),a+.14*(o()-.5),.62*(o()-.5)),_+=C+.004,n%40===39&&await g.yield()}}},d=(x,k)=>{w.place(x,k,0,z);const m=O(z.x,z.z);S.kind=3.2,S.box(z.x,m+.66,z.z,.5,1.42,.56,Z,.9,a),S.kind=0,S.box(z.x,m+1.42,z.z,.6,.12,.66,"#A39A84",.95,a)},v=za,c=569.3,f=4.25,l=-4.25;await r(506,v,f),await g.yield(),await r(c,716,f),await g.yield(),await r(519,531,l,x=>1-.75*M(523,530,x)),await r(580.6,640,l),await g.yield(),d(v,f),d(c,f),d(519,l);{const k=a+Math.PI/2;let m=.4409;const h=()=>(m=(m*9973.7+.371)%1,m);for(let s=-8.2,u=0;s>-66;s-=1.2,u++){const b=.5*T(s*.06,8.8),y=1-.8*M(-46,-43,s)*(1-M(-40,-37,s));w.place(466+b,s-.6,0,z);const A=O(z.x,z.z),q=(.86+.1*T(s*.2,1.9))*y;if(S.kind=3,S.box(z.x,A+q/2-.45,z.z,1.26,q+.9,.52,Z,.74+.12*h(),k),S.kind=0,y<.8)continue;const _=z.x,C=z.z,p=Math.cos(w.hf),G=-Math.sin(w.hf);for(let L=.02;L<1.15;){const W=Math.min(1.2-L,.17+.2*h()),B=.19+.09*h(),R=.6-L-W/2;S.box(_+R*p,A+q+B/2-.05,C+R*G,W,B,.46+.1*h(),h()<.3?"#A39A84":Z,.84+.36*h(),k+.14*(h()-.5),.62*(h()-.5)),L+=W+.004}u%6===5&&await g.yield()}}for(const x of[f,l]){const k={};for(let m=0;m<10;m++){const h=582.6+1.2*m,s=1+.3*Math.sin(Math.PI*(m+.5)/10),u=w.road(h,k).y;w.place(h,x,0,z),S.kind=3.2,S.box(z.x,u+s/2-1.2,z.z,1.23,s+2.4,.64,Z,.76+.12*o(),a),S.kind=0,S.box(z.x,u+s+.05,z.z,1.14+.06*o(),.1,.78,"#A39A84",.88+.22*o(),a,.04*(o()-.5))}for(const m of[581.7,594.3]){const h=w.road(m,k).y;w.place(m,x,0,z),S.kind=3.2,S.box(z.x,h-.4,z.z,.8,3.6,.84,Z,.9,a),S.kind=0,S.box(z.x,h+1.46,z.z,.92,.12,.96,"#A39A84",.98,a)}}for(let x=0;x<16;x++){w.place(w0+mo*o(),l-.2-1.2*o()*o(),0,z);const k=O(z.x,z.z),m=.16+.22*o();S.kind=3.2,S.box(z.x,k+m*.3,z.z,m*1.5,m*.8,m,o()<.3?"#A39A84":Z,.8+.3*o(),6.28*o(),.5*(o()-.5)),S.kind=0}{const k=w.place(c-.1,f+.1,0,new e.Vector3),m=O(k.x,k.z),h=Math.sin(P.h+Math.PI-1.18),s=Math.cos(P.h+Math.PI-1.18),u=4.1,b=Math.atan2(-s,h);S.kind=4;for(let q=0;q<5;q++)S.box(k.x+h*u/2,m+.24+q*.235,k.z+s*u/2,u,.08,.04,i,.95+.07*q,b);for(const q of[.02,.5,.98])S.box(k.x+h*u*q,m+.72,k.z+s*u*q,.09,1.16,.05,i,.9,b);S.box(k.x+h*u/2,m+.72,k.z+s*u/2,u*1.03,.07,.03,i,.85,b,.23);const y=w.place(v-Aa,f+1.25,0,new e.Vector3),A=O(y.x,y.z);S.box(y.x,A+1.12,y.z,.12,2.24,.12,me,.8,.3),S.box(y.x+Math.sin(P.h)*.42,A+2.12,y.z+Math.cos(P.h)*.42,.95,.17,.035,me,.92,a),S.box(y.x+Math.cos(P.h)*.4,A+1.88,y.z-Math.sin(P.h)*.52,.98,.17,.035,me,.86,a+Math.PI/2),S.box(y.x,A+2.27,y.z,.17,.06,.17,"#43484A",1,.3),S.kind=0}for(let x=0;x<6;x++){const k=513+40*x,m=w.place(k,6.6,0,new e.Vector3),h=O(m.x,m.z),s=.025*T(k*.3,1.7);S.kind=4,S.add(new e.CylinderGeometry(.085,.125,7.5,8,1,!0),new e.Matrix4().makeTranslation(m.x,h+3.75,m.z).multiply(new e.Matrix4().makeRotationZ(s)),"#43484A",1),S.box(m.x,h+6.9,m.z,1.7,.11,.11,"#43484A",1,P.h),S.kind=0;for(const u of[-.75,0,.75])S.add(new e.CylinderGeometry(.035,.045,.12,6),new e.Matrix4().makeTranslation(m.x+Math.cos(P.h)*u,h+7,m.z-Math.sin(P.h)*u),"#C8CCC6",.8);v0.push([-.75,0,.75].map(u=>new e.Vector3(m.x+Math.cos(P.h)*u,h+6.98,m.z-Math.sin(P.h)*u)))}}await g.yield();const p0=[],x0=[],y0=Ue(),vo=w0,wo=562;await Rt(vo,wo,1.25,1,t=>2.6*(.25+.75*M(vo,vo+mo,t)*(1-M(wo-mo,wo,t))),()=>.9,ho(()=>8.2),.72,Re,y0,7,p0,x0),j.add(Je(p0,x0)),await g.yield();const qe=[],g0=w.a300+230+78,b0=-17;{const t=new e.Vector3(w.gate.x+g0*ie+b0*re,0,w.gate.z+g0*re-b0*ie),n=new e.Matrix4().makeTranslation(t.x,O(t.x,t.z),t.z).multiply(new e.Matrix4().makeRotationY(w.hf+Math.PI/2)),o=(m,h,s)=>n.clone().multiply(new e.Matrix4().makeTranslation(m,h,s)),a=(m,h,s,u,b,y,A,q,_)=>{S.kind=q,S.add(new e.BoxGeometry(s,b+2,u),o(m,b/2-1,h),A,_);for(const G of[-s/2,s/2]){const L=new e.Shape;L.moveTo(-u/2,0),L.lineTo(u/2,0),L.lineTo(0,y-b),L.closePath(),S.add(new e.ShapeGeometry(L),o(m+G,b,h).multiply(new e.Matrix4().makeRotationY(-Math.PI/2)),A,_*1.06)}S.kind=2.3;const C=Math.atan2(y-b,u/2),p=Math.hypot(y-b,u/2)+.5;for(const G of[1,-1])S.add(new e.BoxGeometry(s+.7,.14,p,8,1,1),o(m,(b+y)/2-.08,h+G*(u/4+.16)).multiply(new e.Matrix4().makeRotationX(G*C)),so,1,0,L=>{L.y-=r(L.x,s)*(.5-G*L.z/p)});S.kind=0},i=.006,r=(m,h)=>i*h*Math.max(0,1-2*m/h*(2*m/h));a(-2.5,0,18,6,2.8,5,Z,3,.8),a(-3,-17,15,7,3.6,6,Z,3,.8),a(9,-12,7,5,2.6,4.2,Z,3,.74),S.kind=3,S.add(new e.BoxGeometry(.9,1.4,.8),o(-10.4,5.3,0),Z,.74),S.kind=0,S.add(new e.BoxGeometry(1.02,.1,.92),o(-10.4,6.05,0),Z,.9),S.add(new e.BoxGeometry(3,2.5,.06),o(1,1.25,3.02),Z,.3),S.add(new e.BoxGeometry(3.7,.3,.1),o(1,2.65,3.03),"#A39A84",.9);const d=new e.Vector3;for(const[m,h]of[[-5.9,1.5],[-8,1.5],[-10.1,1.5]]){for(const[s,u]of[[-1,-1],[1,-1],[1,1],[-1,1]])d.set(m+s*.3,h+u*.4,3.03).applyMatrix4(n),qe.push(d.x,d.y,d.z,s,u);S.add(new e.BoxGeometry(.9,.16,.08),o(m,h+.48,3.02),"#A39A84",.9)}const v="#7A7468",c="#A39A84",f=m=>new e.Matrix4().makeRotationZ(m),l=m=>new e.Matrix4().makeRotationY(m),x=[[-2.5,0,18,6,2.8,5],[-3,-17,15,7,3.6,6],[9,-12,7,5,2.6,4.2]],k=(m,h)=>(d.set(m,0,h).applyMatrix4(n),O(d.x,d.z)-n.elements[13]);for(let m=0;m<x.length;m++){const[h,s,u,b,y,A]=x[m],q=Math.atan2(A-y,b/2),_=Math.hypot(A-y,b/2)+.5,C=u+2*(.2+.16),p=Math.round(C/.62),G=C/p;for(let L=0;L<p;L++){const W=-C/2+(L+.5)*G,B=T(W*1.3+m*9.1,4.7);S.add(new e.BoxGeometry(G-.02,.15,.32),o(h+W,A+.02-r(W,u),s).multiply(f(.03*B)),c,.62+.08*B)}for(const L of[-(u/2+.2),u/2+.2])for(const W of[1,-1])S.add(new e.BoxGeometry(.32,.1,_),o(h+L,(y+A)/2-.08+.11,s+W*(b/4+.16)).multiply(new e.Matrix4().makeRotationX(W*q)),c,.66);for(const L of[-1,1])for(const W of[-1,1])for(let B=0,R=-.4;R<y-.05;B++,R+=.42){const V=B%2?.52:.28,U=B%2?.28:.52,J=Math.min(.41,y-R),F=T(B*1.7+m*5.3,L*3.1+W*1.3);S.add(new e.BoxGeometry(V,J,U),o(h+L*(u/2+.03-V/2),R+J/2,s+W*(b/2+.03-U/2)),c,.66+.1*F)}m===0&&await g.yield()}for(const[m,h]of[[-5.9,1.5],[-8,1.5],[-10.1,1.5]]){S.add(new e.BoxGeometry(.92,.09,.2),o(m,h-.445,3.07),c,.8);for(const s of[-1,1])S.add(new e.BoxGeometry(.13,.8,.06),o(m+s*.365,h,3),c,.7)}for(const m of[-1,1])for(let h=0;h<3;h++){const s=h%2?.3:.42;S.add(new e.BoxGeometry(s,.82,.14),o(1+m*(1.5+s/2),.42+.835*h,3.04),c,.66+.05*h)}{const u=o(-1.225,1.17,3.145);S.kind=4,S.add(new e.BoxGeometry(1.45,2.3,.05),u,v,.8);for(const b of[-.75,.75])S.add(new e.BoxGeometry(1.45-.1,.13,.03),u.clone().multiply(new e.Matrix4().makeTranslation(0,b,.04)),v,.95);S.kind=0}{for(const[C,p]of[[3,5.75]])for(let G=C,L=0;G<p-.2;G+=1.2,L++){const W=Math.min(1.2,p-G),B=G+W/2,R=k(6.24,B),V=.8+.06*T(B*.9,6.6);S.kind=3,S.add(new e.BoxGeometry(.52,V+.8,W+.03),o(6.24,R+V/2-.4,B),Z,.74+.06*T(B*2.3,1.1)),S.kind=0;for(let U=.02,J=0;U<W-.05;J++){const F=.5+.5*T(B*3.1+J*1.7,8.2),N=Math.min(W-U,.19+.16*F),I=.2+.07*(1-F);S.add(new e.BoxGeometry(.48,I,N),o(6.24,R+V+I/2-.03,G+U+N/2).multiply(l(.12*(F-.5))),F<.3?c:Z,.84+.3*F),U+=N+.004}}for(const C of[5.75,9.25]){const p=k(6.24,C);S.kind=3,S.add(new e.BoxGeometry(.56,1.42,.5),o(6.24,p+.66,C),Z,.9),S.kind=0,S.add(new e.BoxGeometry(.66,.12,.6),o(6.24,p+1.42,C),c,.95)}const A=70*Math.PI/180,q=k(6.24,9.25),_=o(6.24-Math.sin(A)*2.9/2,q,9.25-.3-Math.cos(A)*2.9/2).multiply(l(Math.PI/2+A));S.kind=4;for(let C=0;C<5;C++)S.add(new e.BoxGeometry(2.9,.08,.04),_.clone().multiply(new e.Matrix4().makeTranslation(0,.24+C*.235,0)),v,.95+.07*C);for(const C of[-.48,0,.48])S.add(new e.BoxGeometry(.09,1.16,.05),_.clone().multiply(new e.Matrix4().makeTranslation(2.9*C,.72,0)),v,.9);S.kind=0}}await g.yield();const k0=E.fork?E.fork("ash"):E,M0=new e.Quaternion,po=new e.Vector3(0,1,0),wt=new e.Vector3,Sa=new e.Vector3(1,1,1);let Vt=Y;const pt=(t,n,o,a,i,r)=>{wt.subVectors(n,t);const d=wt.length();M0.setFromUnitVectors(po,wt.normalize()),Vt.add(new e.CylinderGeometry(a,o,d,7,1,!0),new e.Matrix4().compose(t.clone().add(n).multiplyScalar(.5),M0,Sa),i,r)};Y.kind=4;const z0=[[541,-10.5,10.2,15,26],[586,11.5,11.6,15,26],[629,-9,9.4,15,26],[671,8.5,10.8,10,14],[557,5.7,4.2,6,14],[606,-5.9,3.6,6,14],[652,-6.2,4.4,6,12],[697,-7.5,9.5,9,12],[628,80,9.5,8,12],[641,94,11.5,8,12],[620,99,8,7,10],[632,5.3,12,15,26,.62],[633.6,-5.4,11.4,15,26,.62],[458,-9.4,4.6,12,30,1,1.6],[474,St(-56)-5.5,9,9,12],[601,-40,10.5,10,14],[615,-45,11.5,10,14]];let A0=.3719;const S0=Object.assign(()=>A0=(A0*9301.17+.2113)%1,{range:(t,n)=>t+(n-t)*S0()});for(let t=0;t<vt.length+z0.length;t++){const n=t>=vt.length?z0[t-vt.length]:null,o=n?S0:k0,a=n?Math.max(.5,n[2]/10.5):1,i=n?n[0]:vt[t],r=!n&&i>=We&&i<170,d=!!n||i<We||!r,v=n?n[2]:k0.range(9,12),c=w.place(i,n?n[1]:d?i<We?7.4:10.5:-(3.9+qt(i)*Et),0,new e.Vector3),f=O(c.x,c.z)+(d?0:qt(i)),l=o.range(0,50),x=v*.27,k=n?Re:r?s0:io,m=n?uo:r?i0:ro;Vt=n?S:r?r0:Y,Vt.kind=4;const h=new e.Vector3(c.x,f-.2,c.z),s=new e.Vector3(c.x+o.range(-.3,.3),f+v*.4,c.z+o.range(-.3,.3));pt(h,s,.27*a,.17*a,"#4A4E4C",1),n||m0.push(h);const u=n?n[3]:15,b=n?n[4]:26;for(let y=0;y<u;y++){const A=.4+.6*(y+o())/u,q=y*2.4+o.range(-.5,.5),_=Math.pow(Math.sin(Math.PI*Math.min(1,(A-.3)/.72)),.75),C=x*_*(y===u-1?.1:o.range(.45,1)),p=new e.Vector3(c.x+Math.cos(q)*C,f+v*A,c.z+Math.sin(q)*C);n&&n[6]&&(p.x+=n[6]*A*A*Xe.x,p.z+=n[6]*A*A*Xe.z,p.y-=.25*n[6]*A*A);const G=(.95+.9*_)*o.range(.8,1.2)*(v/10.5);y%3===2&&await g.yield(),(y%3===0||y===u-1)&&pt(s,p,.12*a,.035,"#4A4E4C",.9);const L=new e.Matrix4().makeTranslation(p.x,p.y,p.z).multiply(new e.Matrix4().makeRotationY(q)).multiply(new e.Matrix4().makeScale(G*1.15,G*.72,G)),W=k.P.length;k.add(new e.IcosahedronGeometry(1,1),L,Ge,(.75+.4*A)*(.9+.2*o())*(n&&n[5]?n[5]:1),1,B=>B.multiplyScalar(.74*(1+.3*T(B.x*1.9+l+y,B.y*1.9+B.z*1.7))));for(let B=W;B<k.P.length;B+=3)Q.set(k.P[B]-c.x,(k.P[B+1]-(f+v*.62))*1.2+.6,k.P[B+2]-c.z).normalize(),$.set(k.Nn[B],k.Nn[B+1],k.Nn[B+2]).multiplyScalar(.45).addScaledVector(Q,.55).normalize(),k.Nn[B]=$.x,k.Nn[B+1]=$.y,k.Nn[B+2]=$.z;for(let B=0;B<b;B++){const R=o.range(0,Math.PI*2),V=o.range(-.55,1),U=Math.sqrt(1-V*V*.9),J=o.range(.85,1.2);Q.set(Math.cos(R)*U,V,Math.sin(R)*U),$.set(Q.x*G*1.15*J,Q.y*G*.72*J,Q.z*G*J).applyAxisAngle(po,-q).add(p),Q.set($.x-c.x,($.y-(f+v*.62))*1.2+.6,$.z-c.z).normalize(),m.add($,Q,o.range(1.1,1.8)*Math.min(1,a*1.25),Ge,(.95+.55*A)*o.range(.85,1.25))}}await g.yield()}Y.kind=0;{const t=d=>{let v=0;const c=()=>{const f=Math.sin(d*127.1+v++*311.7+74.7)*43758.5453;return f-Math.floor(f)};return Object.assign(c,{range:(f,l)=>f+(l-f)*c()})},n=new e.IcosahedronGeometry(1,1),o=Array.from(n.attributes.position.array),a=new e.Matrix3,i=new e.Color;n.dispose();const r=async(d,v,c,f,l,x,k,m=!1)=>{const h=Math.max(.5,f/10.5),s=O(v,c),u=d.range(0,50),b=f*.27,y=m?f/28:.27*h,A=m?y*.17/.27:.17*h,q=m?y/2:.12*h;if(m){const p=Math.min(1,h*1.25),G=f/10.5;x=Math.round(x*G*G/(p*p))}Vt=S,S.kind=4;const _=new e.Vector3(v,s-.2,c),C=new e.Vector3(v+d.range(-.3,.3)+k*.16*Xe.x,s+f*.4-.25*k*.16,c+d.range(-.3,.3)+k*.16*Xe.z);if(pt(_,C,y,A,"#4A4E4C",1),m){const p=Math.min(1,4*y/_.distanceTo(C));pt(_,_.clone().lerp(C,p),1.5*y,y+(A-y)*p,"#4A4E4C",1)}for(let p=0;p<l;p++){const G=.4+.6*(p+d())/l,L=p*2.4+d.range(-.5,.5),W=Math.pow(Math.sin(Math.PI*Math.min(1,(G-.3)/.72)),.75),B=b*W*(p===l-1?.1:d.range(.45,1)),R=new e.Vector3(v+Math.cos(L)*B+k*G*G*Xe.x,s+f*G-.25*k*G*G,c+Math.sin(L)*B+k*G*G*Xe.z),V=(.95+.9*W)*d.range(.8,1.2)*(f/10.5);p%3===2&&await g.yield(),(p%3===0||p===l-1)&&pt(C,R,q,.035,"#4A4E4C",.9);const U=new e.Matrix4().makeTranslation(R.x,R.y,R.z).multiply(new e.Matrix4().makeRotationY(L)).multiply(new e.Matrix4().makeScale(V*1.15,V*.72,V));a.getNormalMatrix(U),i.set(Ge).multiplyScalar((.75+.4*G)*(.9+.2*d()));for(let J=0;J<o.length;J+=3)$.set(o[J],o[J+1],o[J+2]),Q.copy($).applyMatrix3(a).normalize(),$.multiplyScalar(.74*(1+.3*T($.x*1.9+u+p,$.y*1.9+$.z*1.7))).applyMatrix4(U),wt.set($.x-v,($.y-(s+f*.62))*1.2+.6,$.z-c).normalize(),Q.multiplyScalar(.45).addScaledVector(wt,.55).normalize(),Re.P.push($.x,$.y,$.z),Re.Nn.push(Q.x,Q.y,Q.z),Re.C.push(i.r,i.g,i.b),Re.Sw.push(1);for(let J=0;J<x;J++){const F=d.range(0,Math.PI*2),N=d.range(-.55,1),I=Math.sqrt(1-N*N*.9),K=d.range(.85,1.2);Q.set(Math.cos(F)*I,N,Math.sin(F)*I),$.set(Q.x*V*1.15*K,Q.y*V*.72*K,Q.z*V*K).applyAxisAngle(po,-L).add(R),Q.set($.x-v,($.y-(s+f*.62))*1.2+.6,$.z-c).normalize(),uo.add($,Q,d.range(1.1,1.8)*Math.min(1,h*1.25),Ge,(.95+.55*G)*d.range(.85,1.25),0,1,d)}}S.kind=0,await g.yield()};{let d=300,v=-1e9;for(let l=300;l<=460;l+=.5){const x=w.road(l,P).y;x>v&&(v=x,d=l)}const c=-19,f=w.place(d,c,0,new e.Vector3);for(let l=0;l<5;l++){const x=t(l),k=l*2*Math.PI/5+x.range(-.245,.245),m=3.4+x.range(-.7,.7),h=x.range(7,10);await r(x,f.x+Math.cos(k)*m,f.z+Math.sin(k)*m,h,15,26,1.6*h/4.6,!0)}}{const x=[],k=t(12)();for(let s=0;s<7;s++){const u=t(5+s),b=425+25*(s+.5+.6*(u()-.5))/7,y=s*.618+k;x.push({tr:u,s:b,lat:28+17*(y-Math.floor(y))})}const m=x.map(s=>s.lat).sort((s,u)=>s-u),h=m[1];for(const s of x){const u=s.lat<=h,b=u?s.tr.range(3.6,4.4):s.tr.range(7,10),y=w.place(s.s,-s.lat,0,z);await r(s.tr,y.x,y.z,b,u?10:12,16,u?1.6*b/4.6:0,!u)}}}{const n=[new e.Vector2(.8,0),new e.Vector2(.72,.5),new e.Vector2(.45,.98),new e.Vector2(0,1.3)],o="#"+new e.Color(H.seedhead).lerp(new e.Color(H.meadow),2/3).getHexString(),a=new e.BufferGeometry;{const i=new e.LatheGeometry(n,6).toNonIndexed(),r=i.attributes.position.array,d=i.attributes.normal.array,v=[],c=[],f=new e.Vector3,l=new e.Vector3;for(let x=0;x<r.length;x+=9)if(f.set(r[x+3]-r[x],r[x+4]-r[x+1],r[x+5]-r[x+2]),l.set(r[x+6]-r[x],r[x+7]-r[x+1],r[x+8]-r[x+2]),f.cross(l).lengthSq()>1e-10)for(let k=0;k<9;k++)v.push(r[x+k]),c.push(d[x+k]);a.setAttribute("position",new e.Float32BufferAttribute(v,3)),a.setAttribute("normal",new e.Float32BufferAttribute(c,3)),i.dispose()}for(const i of d0)m0.some(r=>Math.hypot(r.x-i.x,r.z-i.z)<3)||Y.add(a,new e.Matrix4().makeTranslation(i.x,O(i.x,i.z)-.04,i.z).multiply(new e.Matrix4().makeRotationY(i.ry)).multiply(new e.Matrix4().makeScale(i.sc,i.sc,i.sc)),o,i.k);await g.yield()}const xt=[],xo=[],yo=[],go=[],bo=[];for(let t=0;t<6;t++){const n=10+40*t,o=w.place(n,5+co(n)*.2,0,new e.Vector3),a=O(o.x,o.z);w.road(n,P),Y.kind=4,Y.add(new e.CylinderGeometry(.085,.125,7.5,8,1,!0),new e.Matrix4().makeTranslation(o.x,a+3.75,o.z),"#43484A",1),Y.kind=4,Y.box(o.x,a+6.9,o.z,1.7,.11,.11,"#43484A",1,-P.h),Y.kind=0;for(const i of[-.75,0,.75])Y.add(new e.CylinderGeometry(.035,.045,.12,6),new e.Matrix4().makeTranslation(o.x+Math.cos(P.h)*i,a+7,o.z-Math.sin(P.h)*i),"#C8CCC6",.8);bo.push([-.75,0,.75].map(i=>new e.Vector3(o.x+Math.cos(P.h)*i,a+6.98,o.z-Math.sin(P.h)*i)))}bo.unshift([new e.Vector3(-11.3,6.3,-22.2),new e.Vector3(-11,6.5,-22.2),new e.Vector3(-10.7,6.3,-22.2)]);const le=new e.Vector3,ce=new e.Vector3;for(const t of[bo,v0])for(let n=0;n<t.length-1;n++)for(let o=0;o<3;o++){const a=t[n][o],i=t[n+1][o],r=10,d=.022*a.distanceTo(i);for(let v=0;v<r;v++){const c=v/r,f=(v+1)/r;le.lerpVectors(a,i,c),le.y-=d*4*c*(1-c),ce.lerpVectors(a,i,f),ce.y-=d*4*f*(1-f);const l=xt.length/3;xt.push(le.x,le.y,le.z,le.x,le.y,le.z,ce.x,ce.y,ce.z,ce.x,ce.y,ce.z),xo.push(ce.x,ce.y,ce.z,ce.x,ce.y,ce.z,le.x,le.y,le.z,le.x,le.y,le.z),yo.push(1,0,-1,0,-1,1,1,1),go.push(l,l+1,l+2,l+1,l+3,l+2)}}const C0=(t,n)=>{const o=xt.length/3;xt.push(t.x,t.y,t.z,t.x,t.y,t.z,n.x,n.y,n.z,n.x,n.y,n.z),xo.push(n.x,n.y,n.z,n.x,n.y,n.z,t.x,t.y,t.z,t.x,t.y,t.z),yo.push(1,0,-1,0,-1,1,1,1),go.push(o,o+1,o+2,o+1,o+3,o+2)};for(let t=0;t<_t.length-1;t++)for(let n=0;n<2;n++)C0(_t[t][n],_t[t+1][n]);for(let t=0;t<Ee.length-1;t++)if(Ee[t]&&Ee[t+1])for(let n=0;n<2;n++)C0(Ee[t][n],Ee[t+1][n]);await g.yield(),j.add(io.mesh(Dt)),await g.yield();const yt=Q0(D);j.add(ro.mesh(yt)),await g.yield(),j.add(Re.mesh(Dt)),await g.yield(),j.add(uo.mesh(yt)),await g.yield(),j.add(y0.mesh(yt)),await g.yield(),S.kind=0,j.add(S.mesh(oo)),await g.yield();const It=new e.Group,ko=new e.Group,Mo=new e.Group,B0=J0(D,1),L0=Q0(D,1);It.add(fo.mesh(B0)),await g.yield(),It.add(o0.mesh(L0)),await g.yield(),ko.add(a0.mesh(B0),n0.mesh(L0)),await g.yield(),It.add(Je(l0,c0)),ko.add(Je(h0,f0)),Mo.add(s0.mesh(Dt),i0.mesh(yt),r0.mesh(oo)),j.add(It,ko,Mo),await g.yield();const gt=new e.BufferGeometry;gt.setAttribute("position",new e.Float32BufferAttribute(xt,3)),gt.setAttribute("aOther",new e.Float32BufferAttribute(xo,3)),gt.setAttribute("uv",new e.Float32BufferAttribute(yo,2)),gt.setIndex(go);const Ot={value:new e.Vector2(800,450)},F0=new e.Mesh(gt,new e.ShaderMaterial({uniforms:{...D,uView:Ot,uInk:{value:new e.Color("#2B3236")}},side:e.DoubleSide,vertexShader:`uniform vec2 uView; uniform vec3 uCamW; attribute vec3 aOther; varying float vDist;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.);
          vec4 c0 = projectionMatrix * viewMatrix * wp, c1 = projectionMatrix * viewMatrix * modelMatrix * vec4(aOther, 1.);
          vec2 d = (c1.xy / max(abs(c1.w), 1e-3) - c0.xy / max(abs(c0.w), 1e-3)) * uView * (uv.y > .5 ? -1. : 1.);
          d = normalize(d + vec2(1e-5, 0.));
          float pxPerM = projectionMatrix[1][1] * uView.y * .5 / max(c0.w, .1);
          float wpx = max(.02 * pxPerM, 1.5 * uView.y / 450.);                 // never thinner than a pixel and a half
          c0.xy += vec2(-d.y, d.x) * uv.x * (uv.y > .5 ? -1. : 1.) * wpx / uView * c0.w;
          vDist = distance(wp.xyz, uCamW); gl_Position = c0; }`,fragmentShader:`${Ie} uniform vec3 uInk; varying float vDist;
        void main() { gl_FragColor = vec4(swFog(uInk, vDist), 1.); }`}));F0.frustumCulled=!1,j.add(F0);{const t=[],n=[],o=[],a=[],i=new e.Vector3,r=new e.Vector3;for(let c=-7;c<293;c+=3){w.place(c,0,0,i),i.y=O(i.x,i.z)+.12,w.place(c+3,0,0,r),r.y=O(r.x,r.z)+.12;const f=t.length/3;t.push(i.x,i.y,i.z,i.x,i.y,i.z,r.x,r.y,r.z,r.x,r.y,r.z),n.push(r.x,r.y,r.z,r.x,r.y,r.z,i.x,i.y,i.z,i.x,i.y,i.z),o.push(1,0,-1,0,-1,1,1,1),a.push(f,f+1,f+2,f+1,f+3,f+2)}const d=new e.BufferGeometry;d.setAttribute("position",new e.Float32BufferAttribute(t,3)),d.setAttribute("aOther",new e.Float32BufferAttribute(n,3)),d.setAttribute("uv",new e.Float32BufferAttribute(o,2)),d.setIndex(a);const v=new e.Mesh(d,new e.ShaderMaterial({uniforms:{...D,uView:Ot,uPale:{value:new e.Color(H.gravel)}},side:e.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:`uniform vec2 uView; uniform vec3 uCamW; attribute vec3 aOther; varying float vDist;
          ${Ro}
          void main() {
            vec3 pA = position, pB = aOther; pA.y -= swSink(pA.xz); pB.y -= swSink(pB.xz);
            vec4 wp = modelMatrix * vec4(pA, 1.);
            vec4 c0 = projectionMatrix * viewMatrix * wp, c1 = projectionMatrix * viewMatrix * modelMatrix * vec4(pB, 1.);
            vec2 d = (c1.xy / max(abs(c1.w), 1e-3) - c0.xy / max(abs(c0.w), 1e-3)) * uView * (uv.y > .5 ? -1. : 1.);
            d = normalize(d + vec2(1e-5, 0.));
            float pxPerM = projectionMatrix[1][1] * uView.y * .5 / max(c0.w, .1);
            float wpx = max(3.3 * pxPerM, 2.4 * uView.y / 450.);
            c0.xy += vec2(-d.y, d.x) * uv.x * (uv.y > .5 ? -1. : 1.) * wpx * .5 / uView * c0.w;
            vDist = distance(wp.xyz, uCamW);
            if (vDist < 110. || c0.w < .3) c0 = vec4(2., 2., 2., 1.);
            gl_Position = c0; }`,fragmentShader:`${Ie} uniform vec3 uPale; varying float vDist;
          void main() { gl_FragColor = vec4(swFog(swLight(uPale * .98, vec3(0., 1., 0.)), vDist * .8), smoothstep(125., 190., vDist)); }`}));v.frustumCulled=!1,v.renderOrder=2,j.add(v)}const Kt=ve();{const t=new e.Vector3(-12.6,2.05,-15.2),n=new e.Vector3(-3.8,2.05,-17),o=n.clone().sub(t),a=o.length();o.normalize();const i=Math.atan2(-o.z,o.x),r=["#F4EFE2","#C9D6E2","#F4EFE2","#EBCDBE","#DCE3E6"];for(const v of[t,n])Wt.add(new e.CylinderGeometry(.05,.06,2.2,6,1,!0),new e.Matrix4().makeTranslation(v.x,1.1,v.z),"#6A5E52",1);Wt.box((t.x+n.x)/2,2.07,(t.z+n.z)/2,a,.025,.025,"#D8D4C8",1,i);let d=.7;for(let v=0;v<5;v++){const c=[1.5,.8,1.7,.9,1.2][v],f=[1,.7,1.25,.75,.9][v],l=t.clone().addScaledVector(o,d+c/2),x=new e.Matrix4().makeTranslation(l.x,2.04-f/2,l.z).multiply(new e.Matrix4().makeRotationY(i)),k=new e.PlaneGeometry(c,f,8,8),m=k.attributes.uv,h=Kt.Sw.length,s=k.toNonIndexed(),u=s.attributes.uv;Kt.add(s,x,r[v],.62,0);for(let b=0;b<u.count;b++)Kt.Sw[h+b]=(1-u.getY(b))*f+v*10;k.dispose(),d+=c+.22}}const T0={...D,uDim:{value:1}},Ca=Kt.mesh(new e.ShaderMaterial({uniforms:T0,side:e.DoubleSide,vertexShader:`${Oe} attribute vec3 color; attribute float aSway;
        void main() { vec3 p = position, n = normal; vCol = color;
          float ph = floor(aSway / 10.), d = aSway - ph * 10.;
          float a = sin(uTime * 2.3 + ph * 1.9 + p.x * 1.1) * .30 + sin(uTime * 5.3 + ph + d * 4. + p.x * 2.) * .10 + .22;
          p += n * a * d; p.y += abs(a) * d * .18;
          n = normalize(n + vec3(0., -a * .9, 0.) + .35 * cos(uTime * 5.3 + ph + d * 4.) * vec3(1., 0., 0.));
          ${Ke} }`,fragmentShader:`${Ne} uniform float uDim;
        void main() { vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) n = -n;
          vec3 c = (swLight(vCol, n) + vCol * uKeyCol * .25 * max(dot(-n, uSunW), 0.)) * uDim;
          gl_FragColor = vec4(swFog(c, vDist), 1.); }`}));await g.yield(),j.add(Y.mesh(oo)),await g.yield();const Nt=2.4,Ba=t=>1+(Nt-1)*M(.285,.335,t),zo=X0(D,{side:e.DoubleSide}),_e=new e.Group;_e.add(Wt.mesh(zo)),await g.yield(),_e.add(u0.mesh(Dt),jo.mesh(yt),Ca),j.add(_e);{const t=[],n=[];let o=.3719;const a=()=>(o=(o*8887.13+.2171)%1,o),i=Math.round(520*Math.max(.6,se));for(let r=0;r<i;r++){const d=a()<.72?-1:1,v=d<0?46:17,c=d*(2.1+v*a()*a()),f=-8+.27+.3*a()*a();t.push(c,.02,f,a()*6.283),n.push(.16+.3*a(),a(),a(),a()<.3?1:.12)}_e.add(Je(t,n))}const G0=(t,n,o,a,i)=>t.set(-i*n,i*o,-8+i*(a+8));await g.yield();const Pe=new e.Vector3(0,0,-8),et=await Y0(g,D,{});et.mesh.position.copy(Pe),j.add(et.mesh);let he=null;const D0=new e.Vector3(-1.05,0,-8.5),La=new e.Vector3(-11,0,-21.6);oe==="C"&&(he=await Y0(g,D,{scale:.74,dress:["#6E86A6","#3E4C66"]}),he.mesh.position.copy(D0),he.uniforms.uHand.value=1,j.add(he.mesh));const Be=Va(D);j.add(Be.mesh);const tt=new e.Vector3(14.2,1.62,-21.9),W0=new e.MeshBasicMaterial({color:0,fog:!1}),E0=new e.Mesh(new e.PlaneGeometry(1,1.4),W0);E0.position.copy(tt),_e.add(E0);const Ao=new e.Color("#F4EFE2"),So=new e.Color("#FFC56E"),Co=new e.Color("#A8584C"),Bo=new e.Color("#6E86A6"),Lo=new e.Color("#2A2A28");Be.uniforms.uSz.value[3].set(.75,.6,ke?7.6:3.2),await g.yield();const Fo=$0(D),ot=new e.Group,at=new e.Group;ot.add(at),j.add(ot);const nt="#3A3936",st="#20201F",ae=(t,n,o,a=1,i=1,r=1,d=0)=>new e.Matrix4().makeTranslation(t,n,o).multiply(new e.Matrix4().makeRotationX(d)).multiply(new e.Matrix4().makeScale(a,i,r));{const t=ht();t.add(new e.SphereGeometry(1,16,12),ae(0,.5,0,.15,.165,.37),0,0,nt,st),t.add(new e.SphereGeometry(1,14,10),ae(0,.7,.4,.105,.11,.13),0,0,nt,st),t.add(new e.SphereGeometry(1,10,8),ae(0,.665,.53,.055,.05,.09),0,0,nt,st),t.add(new e.SphereGeometry(1,12,8),ae(0,.43,.27,.1,.13,.09),0,0,"#F1ECE0","#B9C2CC");for(const o of[-1,1])t.add(new e.ConeGeometry(.04,.1,6),ae(o*.07,.8,.37,1,1,1,-.3),0,0,nt,st);const n=new e.Mesh(t.build(),Fo);n.frustumCulled=!1,at.add(n)}const bt=[],kt=new e.Group;for(const[t,n]of[[-.085,.24],[.085,.24],[-.085,-.25],[.085,-.25]]){const o=ht();o.add(new e.CylinderGeometry(.045,.032,.42,8,1,!1),ae(0,-.21,0),0,0,nt,st);const a=new e.Mesh(o.build(),Fo);a.position.set(t,.42,n),a.frustumCulled=!1,at.add(a),bt.push(a)}{const t=ht();t.add(new e.CylinderGeometry(.02,.035,.34,6,1,!1),ae(0,.15,-.06,1,1,1,-.5),0,0,nt,st);const n=new e.Mesh(t.build(),Fo);n.frustumCulled=!1,kt.add(n),kt.position.set(0,.56,-.34),at.add(kt)}const we=.1,ge=ke?.253:.15,it=160,rt=new Float32Array(it+1);rt[0]=-6;for(let t=1;t<=it;t++){const n=we+(ge-we)*(t-.5)/it,o=M(we,we+.012,n)*(1-M(ge-.012,ge,n)),a=ke?.7*w.speed(n):Math.min(3/.0115,.8*w.speed(n));rt[t]=rt[t-1]+a*o*(ge-we)/it}const Fa=t=>{const n=Math.min(it-.001,Math.max(0,(t-we)/(ge-we)*it)),o=n|0;return rt[o]+(rt[o+1]-rt[o])*(n-o)};await g.yield();const Ta=Math.max(6,Math.round(9*Math.min(1,se+.07))),R0=[],q0=[],_0=[],P0=[];for(let t=0;t<Ta;t++){const n=t%2?1:-1,o=E.range(4.5,8),a=E.range(0,8),i=[n*E.range(16,30),E.range(1.5,8),-E.range(15,40)],r=[-n*E.range(1,12),E.range(3,13),-E.range(95,160)];for(const d of[[-.21,0,-.07,1],[0,0,.08,0],[0,0,-.04,0],[.21,0,-.07,1],[0,0,-.04,0],[0,0,.08,0],[0,0,.08,0],[-.035,0,-.14,0],[.035,0,-.14,0]])R0.push(d[0],d[1],d[2]),q0.push(i[0],i[1],i[2],o),_0.push(r[0],r[1],r[2],a),P0.push(d[3])}const Mt=new e.BufferGeometry;Mt.setAttribute("position",new e.Float32BufferAttribute(R0,3)),Mt.setAttribute("aA",new e.Float32BufferAttribute(q0,4)),Mt.setAttribute("aB",new e.Float32BufferAttribute(_0,4)),Mt.setAttribute("aTip",new e.Float32BufferAttribute(P0,1));const Ut=new e.Mesh(Mt,new e.ShaderMaterial({uniforms:{...D,uInk:{value:new e.Color(H.dark).multiplyScalar(.9)}},side:e.DoubleSide,vertexShader:`uniform float uTime; uniform vec3 uCamW; attribute vec4 aA; attribute vec4 aB; attribute float aTip; varying float vDist;
        vec3 at(float k) { vec3 p = mix(aA.xyz, aB.xyz, k); p.y += 3. * sin(k * 3.1416) + .8 * sin(k * 17. + aB.w); p.x += 4. * sin(k * 5. + aB.w) * (1. - k); return p; }
        void main() {
          float k = fract((uTime + aB.w) / aA.w);
          vec3 c = at(k), f = normalize(at(k + .01) - c + vec3(0., 0., -1e-4));
          vec3 r = normalize(cross(vec3(0., 1., 0.), f) + vec3(1e-4, 0., 0.)), up = cross(f, r);
          float sc = max(1., length(c) / 34.);                                  // a swift never dwindles to nothing
          float glide = smoothstep(.2, .6, sin(uTime * 1.7 + aB.w * 3.));
          vec3 q = position * sc; q.y += aTip * sc * .11 * mix(sin(uTime * 26. + aB.w * 9.), -.3, glide);
          vec4 wp = modelMatrix * vec4(c + r * q.x + up * q.y + f * q.z, 1.);
          vDist = distance(wp.xyz, uCamW); gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`${Ie} uniform vec3 uInk; varying float vDist;
        void main() { gl_FragColor = vec4(swFog(uInk, vDist * .6), 1.); }`}));Ut.frustumCulled=!1,ze.add(Ut);const Ht={...D,uM:{value:0},uP0:{value:w.place(704,-62,31,new e.Vector3)},uDir:{value:new e.Vector3},uInk:{value:new e.Color(H.dark).multiplyScalar(.55)}};{Ht.uDir.value.copy(w.place(676,60,23,new e.Vector3)).sub(Ht.uP0.value).normalize();const t=Math.max(12,Math.round(24*se)),n=[],o=[],a=[];let i=.5127;const r=()=>i=(i*8121.13+.3379)%1;for(let c=0;c<t;c++){const f=[(r()-.5)*16+3*Math.sin(c*1.7),(r()-.5)*9,-30+62*(c+r())/t,r()*6.283],l=.8+.4*r();for(const x of[[-.78,0,-.1,1],[0,0,.24,0],[0,0,-.2,0],[.78,0,-.1,1],[0,0,-.2,0],[0,0,.24,0],[-.4,0,.06,.5],[.4,0,.06,.5],[0,0,-.34,0]])n.push(x[0]*l,x[1],x[2]*l),o.push(f[0],f[1],f[2],f[3]),a.push(x[3])}const d=new e.BufferGeometry;d.setAttribute("position",new e.Float32BufferAttribute(n,3)),d.setAttribute("aA",new e.Float32BufferAttribute(o,4)),d.setAttribute("aTip",new e.Float32BufferAttribute(a,1));const v=new e.Mesh(d,new e.ShaderMaterial({uniforms:Ht,side:e.DoubleSide,vertexShader:`uniform float uTime; uniform vec3 uCamW; uniform float uM; uniform vec3 uP0; uniform vec3 uDir; attribute vec4 aA; attribute float aTip; varying float vDist;
          void main() {
            vec3 f = uDir, r = normalize(cross(vec3(0., 1., 0.), f) + vec3(1e-5, 0., 0.)), up = cross(f, r);
            float ph = aA.w, beat = sin(uTime * 6.3 + ph * 5.), soar = smoothstep(.55, .9, sin(uTime * .9 + ph * 2.));
            vec3 c = uP0 + f * (uM + aA.z + .8 * sin(uTime * .7 + ph)) + r * (aA.x + 1.2 * sin(uTime * .5 + ph * 3.)) + up * (aA.y + .7 * sin(uTime * .8 + ph * 1.7));
            vec3 q = position; q.y += aTip * mix(.42 * beat, .12, soar) - .10 * beat * (1. - aTip);
            vec4 wp = modelMatrix * vec4(c + r * q.x + up * q.y + f * q.z, 1.);
            vDist = distance(wp.xyz, uCamW); gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`${Ie} uniform vec3 uInk; varying float vDist;
          void main() { gl_FragColor = vec4(swFog(uInk, vDist * .5), 1.); }`}));v.frustumCulled=!1,j.add(v)}await g.yield();const Ga={...D};{const t=[],n=[],o=[];for(let r=0,d=0;r<qe.length;r+=5,d++)t.push(qe[r],qe[r+1],qe[r+2]),n.push(qe[r+3],qe[r+4]),d%4===3&&o.push(d-3,d-2,d-1,d-3,d-1,d);const a=new e.BufferGeometry;a.setAttribute("position",new e.Float32BufferAttribute(t,3)),a.setAttribute("uv",new e.Float32BufferAttribute(n,2)),a.setIndex(o);const i=new e.Mesh(a,new e.ShaderMaterial({uniforms:Ga,side:e.DoubleSide,vertexShader:`uniform vec3 uCamW; varying float vOn; varying vec2 vUv; varying float vDist;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.); vUv = uv; vDist = distance(wp.xyz, uCamW);
            vOn = 1.;                                                                         // every pane lit, and steady, for the whole flight: the brief's light says nothing changes but the window of home
            gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`${Ie} varying float vOn; varying vec2 vUv; varying float vDist;
          void main() {
            vec3 c = vec3(.60, .32, .10) * (.62 + .38 * (1. - dot(vUv, vUv) * .5));                 // lit, by one oil lamp behind the middle of it: a dull orange at two thirds of what it was, far under the 5.0 of home's window
            float bar = max(1. - smoothstep(.04, .10, abs(vUv.x)), 1. - smoothstep(.03, .08, abs(vUv.y)));   // the sash bars, pale
            c = mix(c, vec3(.42, .40, .34) * (uSkyCol + .25 * vOn), bar * .8);
            gl_FragColor = vec4(mix(swFog(c, vDist), c, vOn * .7), 1.); }`}));i.frustumCulled=!1,j.add(i)}await g.yield();const pe=new e.Group,V0=[];j.add(pe);{const t="#8792A0",n="#3E4852",o="#2E363E",a="#D5D6D0",i=$0(D);i.side=e.DoubleSide;const r=ht();r.add(new e.SphereGeometry(1,14,10),ae(0,0,0,.13,.12,.34),0,0,t,n),r.add(new e.SphereGeometry(1,10,8),ae(0,.05,.33,.06,.075,.13),0,0,a,"#9AA4AE"),r.add(new e.SphereGeometry(1,10,8),ae(0,.1,.46,.045,.045,.075),0,0,a,"#9AA4AE"),r.add(new e.ConeGeometry(.018,.2,6),ae(0,.09,.62,1,1,1,Math.PI/2),0,0,"#C9A04A","#7A6238"),r.add(new e.BoxGeometry(.05,.02,.62),ae(0,-.05,-.6),0,0,o,"#23292F"),r.add(new e.ConeGeometry(.09,.26,6),ae(0,0,-.4,1,.5,1,-Math.PI/2),0,0,t,n);const d=new e.Mesh(r.build(),i);d.frustumCulled=!1,pe.add(d);const v=(c,f,l,x,k,m,h)=>{const s=new e.BufferGeometry;return s.setAttribute("position",new e.Float32BufferAttribute([h*c,0,l,h*f,0,k,h*f,0,m,h*c,0,x],3)),s.setIndex(h>0?[0,2,1,0,3,2]:[0,1,2,0,2,3]),s.computeVertexNormals(),s};for(const c of[-1,1]){const f=new e.Group,l=new e.Group;f.position.set(c*.1,.06,.05),l.position.set(c*.5,0,0),f.add(l),pe.add(f);const x=ht();x.add(v(0,.5,.15,-.22,.17,-.19,c),ae(0,0,0),0,0,t,n);const k=ht();k.add(v(0,.34,.17,-.19,.13,-.17,c),ae(0,0,0),0,0,t,n),k.add(v(.34,.6,.13,-.17,.04,-.1,c),ae(0,0,0),0,0,o,"#262C33");const m=new e.Mesh(x.build(),i),h=new e.Mesh(k.build(),i);m.frustumCulled=!1,h.frustumCulled=!1,f.add(m),l.add(h),V0.push([f,l,c])}pe.visible=!1,pe.scale.setScalar(1.15)}{const t=[],n=[];let o=.5179;const a=()=>(o=(o*6791.31+.1931)%1,o),i=Math.round(420*se);for(let r=0;r<i;r++){const d=-34+92*a(),v=a()<.5?-1:1,c=2.7+1.5*a()*a()+3*M(14,34,d)*(1-M(50,58,d)),f=-11-3*Math.sin(d*.13)-45*(1-M(-50,10,d))+v*c;w.place(530+d,f,0,z),t.push(z.x,O(z.x,z.z)-.05,z.z,a()*6.283),n.push(.55+.6*a(),.1*a(),a(),a()<.3?1:.1)}j.add(Je(t,n))}const jt=.72,Da=.9,I0=(t,n)=>{const o=Math.min(1,Math.max(0,(t-jt)/(Da-jt)));return w.place(581+13*o,-12+48*Math.pow(o,1.5),.7+4.2*(1-(1-o)*(1-o)),n)};await g.yield();const O0=oe==="B"?1:Math.round(900*se*Math.min(1.15,He)),K0=[],N0=[];for(let t=0;t<O0;t++){const n=4+(t+E())*(505/O0);w.place(n,(t%2?.78:-.78)+E.range(-.25,.25),0,z),K0.push(z.x,O(z.x,z.z)+.15,z.z),N0.push(n,E(),E(),0)}const To=new e.BufferGeometry;To.setAttribute("position",new e.Float32BufferAttribute(K0,3)),To.setAttribute("aS",new e.Float32BufferAttribute(N0,4));const Yt={...D,uView:Ot,uCarS:{value:0},uLife:{value:10},uAmt:{value:0},uTint:{value:new e.Color(oe==="C"?"#B9C6D0":"#D8C3B0")}},Go=new e.Points(To,new e.ShaderMaterial({uniforms:Yt,transparent:!0,depthWrite:!1,vertexShader:`uniform float uTime; uniform vec3 uCamW; uniform vec2 uView; uniform float uCarS; uniform float uLife; uniform float uAmt;
        ${Ro}
        attribute vec4 aS; varying float vA; varying float vDist;
        void main() {
          float age = (uCarS - aS.x) / max(uLife, 1.);
          float on = step(0., age) * step(age, 1.);
          vec3 p = position; float ag = clamp(age, 0., 1.);
          p.y -= swSink(p.xz);
          p.y += ag * (.5 + .9 * aS.y) + .05 * sin(uTime * .9 + aS.z * 30.);
          p.x += (aS.z - .5) * 1.6 * ag + .18 * sin(uTime * .7 + aS.y * 40.); p.z += (aS.y - .5) * 1.2 * ag + .18 * cos(uTime * .6 + aS.z * 17.);
          vec4 wp = modelMatrix * vec4(p, 1.); vDist = distance(wp.xyz, uCamW);
          vec4 cp = projectionMatrix * viewMatrix * wp;
          float size = mix(.9, 3.4, sqrt(ag)) * (.7 + .6 * aS.y);
          gl_PointSize = min(size * projectionMatrix[1][1] * uView.y * .5 / max(cp.w, .5), uView.y * .5);
          // thickest just behind the wheels, thinning down the lane we have left
          vA = on * uAmt * smoothstep(0., .05, ag) * (1. - ag) * (1. - ag) * smoothstep(3., 9., vDist) * (1. - smoothstep(40., 95., vDist));
          if (vA < .002) cp = vec4(2., 2., 2., 1.);
          gl_Position = cp; }`,fragmentShader:`${Ie} uniform vec3 uTint; varying float vA; varying float vDist;
        void main() { vec2 q = gl_PointCoord * 2. - 1.; float r = dot(q, q); float a = (1. - smoothstep(.0, 1., r)); a = a * a * vA;
          gl_FragColor = vec4(swFog(uTint * (uKeyCol * .24 + uSkyCol * .78 + .10), vDist), a); }`}));Go.frustumCulled=!1,Go.renderOrder=5,j.add(Go),await g.yield();const U0=Ia({beads:oe==="C",breathGain:oe==="B"?1.25:1,key:H.key,side:w.mirror});await g.yield();const ue=await Oa({aspect:g.aspect||16/9,fov:44,paneTop:H.fillSky,paneLow:H.glow,time:D.uTime,shared:D,yield:g.yield}),zt=new e.Group;zt.add(ue.group,U0.mesh),zt.visible=!1,ze.add(zt),await g.yield();const Wa=new e.Vector3(0,0,-1),$t=new e.Vector3,Zt=new e.Vector3,lt=new e.Vector3,Do=new e.Vector2,Ea=new e.Matrix3,H0=9.42478,Ra=t=>oe==="B"?1:oe==="C"?M(.2,.23,t):M(.26,.29,t),At=t=>Zt.copy(t).applyMatrix4(j.matrix).distanceTo($t),Xt=g.renderer;{const t=w.place(632.6,0,2.3,new e.Vector3);D.uRingL.value.set(t.x,t.y,t.z,0),D.uBeck.value.y=285,D.uBeck.value.z=-150}const j0=(t,n,o,a)=>{o.getWorldPosition($t),D.uTime.value=n,D.uCamW.value.copy($t),Xt&&(Xt.getDrawingBufferSize(Do),Ot.value.copy(Do),Be.uniforms.uView.value.copy(Do));const i=w.setW(j,a,Le),r=w.S(Math.min(a,Wo));D.uSunW.value.copy(Me).transformDirection(j.matrix),je.position.copy($t),ye.uniforms.uWinv.value.copy(Ea.setFromMatrix4(j.matrix).invert()),D.uWind.value=1-.9*(M(.325,.345,a)-M(.385,.41,a));const d=M(ua,da,a);Mo.position.y=-ma*d,Gt.material.uniforms.uMist.value=M(.3,.33,a)*(1-M(.4,.44,a)),Gt.material.uniforms.uHigh.value=M(4,11,i.y)*(1-M(.4,.44,a)),D.uFwd.value=M(.44,.56,a);const v=M(.5,.62,a)*(.45+.55*M(.56,.97,a));D.uRingL.value.w=v*3.2,ao.uRingS.value.y=v*1.15,ue.uniforms.uRing.value=v,ue.uniforms.uFwd.value=D.uFwd.value,D.uSinkB.value.x=w.aOf(i.x,i.z),D.uSinkB.value.z=pa*M(va,wa,a)*(1-M(xa,ya,a));const c=Ba(a);_e.scale.set(-c,c,c),_e.position.set(0,0,8*(c-1)),et.mesh.scale.setScalar(c),zo.uniforms.uDim.value=1-.04*(c-1)/(Nt-1),zo.uniforms.uWarm.value=(c-1)/(Nt-1),T0.uDim.value=1-.7*(c-1)/(Nt-1);const f=M(.065,.075,a)-M(.165,.175,a);et.uniforms.uHand.value=f;const l=At(lt.set(Pe.x,1.4,Pe.z)),x=1-M(60,110,l),k=1-x;et.uniforms.uNear.value=x,et.mesh.visible=x>.003;const m=-1+2*M(.45,.55,f),h=Math.sin(H0*n+1.2-.9),s=.18+.82*M(-.2,.9,Math.sin(H0*n+1.2)),u=(2+3.2*M(60,300,l))*s,b=Be.uniforms;b.uP.value[0].set(c*(Pe.x+m*.3)+Math.max(.45*c,l*.0058)*h,2.3*c,Pe.z),b.uC.value[0].set(Ao.r*u,Ao.g*u,Ao.b*u,M(30,56,l)),b.uSz.value[0].set(.62*c,.62*c,5.2),b.uP.value[1].set(Pe.x,.83*c,Pe.z),b.uSz.value[1].set(.46*c,1.66*c,2.6);const y=1+.9*M(110,260,l);b.uC.value[1].set(Co.r*y,Co.g*y,Co.b*y,k);const A=Ra(a),q=At(G0(lt,tt.x,tt.y,tt.z,c)),_=A*(2.2+2.8*M(30,200,q));if(W0.color.setRGB(So.r*_+.012,So.g*_+.016,So.b*_+.018),G0(b.uP.value[2],tt.x,tt.y,-21.7,c),b.uSz.value[2].set(1*c,1.3*c,3.6),b.uC.value[2].set(3.4,1.55,.36,A*M(70,150,q)),he){const I=M(.185,.214,a),K=M(.208,.216,a);he.mesh.position.lerpVectors(D0,La,I),he.mesh.rotation.y=I>.001&&I<.999?2.2:0,he.uniforms.uWave.value=1-M(.18,.19,a);const X=(1-M(60,110,At(he.mesh.position)))*(1-K);he.uniforms.uNear.value=X,he.mesh.visible=X>.003,Be.uniforms.uP.value[4].set(he.mesh.position.x,.62,he.mesh.position.z),Be.uniforms.uC.value[4].set(Bo.r,Bo.g,Bo.b,(1-K)*M(60,110,At(he.mesh.position)))}const C=Fa(a),p=M(we,we+.006,a)*(1-M(ge-.004,ge+.004,a)),G=M(ge,ge+.008,a),L=C*5.6;ot.position.set(.95-.6*M(we,we+.03,a),0,C),at.position.y=.05*Math.abs(Math.sin(L))*p-.14*G,at.rotation.x=-.62*G+.08*Math.sin(L*2)*p,bt[0].rotation.x=.95*Math.sin(L)*p+.62*G,bt[1].rotation.x=.95*Math.sin(L+.5)*p+.62*G,bt[2].rotation.x=.95*Math.sin(L+2.6)*p+1.5*G,bt[3].rotation.x=.95*Math.sin(L+3.1)*p+1.5*G,kt.rotation.y=.7*Math.sin(n*9)*(1-p),kt.rotation.x=-.9*p;const W=At(lt.set(ot.position.x,.4,C));ot.visible=W<130,Be.uniforms.uP.value[3].set(ot.position.x,.4,C);const B=1-.45*M(110,220,W);Be.uniforms.uC.value[3].set(Lo.r*B,Lo.g*B,Lo.b*B,M(60,110,W));const R=w.speed(Math.min(a,Wo-.001))*(a<Ka?.0115:.0115*w.pace(a)/.39);Yt.uCarS.value=r,Yt.uLife.value=Math.min(120,Math.max(4,6*R)),Yt.uAmt.value=(oe==="B"?0:oe==="C"?.14:.26)*M(1.5,8,R)*(1-M(288,304,r)),Le.pointAt(Math.min(Math.max(a,0),1),Zt),Ut.position.copy(Zt),Ut.rotation.y=a>.47?Math.PI:0,Ht.uM.value=150*(Math.min(Math.max(a,0),1)-.5);{const I=M(jt,jt+.02,a),K=n*17;I0(a,pe.position),I0(a+.004,lt),pe.rotation.set(-1.15*(1-I)-.18*I,I>0?Math.atan2(lt.x-pe.position.x,lt.z-pe.position.z):-.9,0,"YXZ"),pe.position.y+=.06*I*Math.sin(K-1.6);for(const[X,ee,ne]of V0)X.rotation.z=ne*((1-I)*-1.3+I*(.12+.72*Math.sin(K))),ee.rotation.z=ne*((1-I)*2.45+I*(.05+.62*Math.sin(K-1)));pe.visible=a>.5&&a<.93}zt.visible=a>0,ue.group.position.copy(Zt),ue.group.position.z-=1.12*M(.44,.53,a)+.45*M(.6,.7,a)+.9*M(.74,.9,a);const V=M(.41,.47,a);ue.group.position.y+=V*(.0035*Math.sin(n*6.9)+.0022*Math.sin(n*11.3+1)+.0012*Math.sin(n*23.7)),ue.group.position.x+=V*(.0022*Math.sin(n*5.3+2)+.001*Math.sin(n*17.1)),ue.group.rotation.z=V*.0035*Math.sin(n*4.1+.5);const U=o.projectionMatrix.elements,J=1/Math.max(U[0],.001),F=1/Math.max(U[5],.001);ue.group.scale.set(w.mirror*Math.max(.2,J-.08*F)*ue.D/ue.hw,.92*F*ue.D/ue.hh,1);const N=M(.24,.265,a)-M(.31,.335,a);Xt&&U0.update(o,Xt,Wa,a,n,N)};return j0(0,0,{getWorldPosition:t=>t.set(0,0,0),matrixWorld:new e.Matrix4,projectionMatrix:new e.Matrix4().makePerspective(-.4,.4,.23,-.23,.3,3e3)},0),{scene:ze,path:Le,duration:46,pace:w.pace,title:oe==="B"?"Still Waving, First Light":oe==="C"?"Still Waving, After Rain":"Still Waving",camera:{fov:44,near:.3,far:3e3,lookAhead:2,sway:.3,bank:0,nearThrough:.3},portal:{shape:"circle",radius:3.3,color:"#CFE3F2",glow:.8,revealDistance:120},post:{exposure:1,bloom:{strength:.35,radius:.5,threshold:.92},grade:{saturation:1.02,contrast:1.03,vignette:.2,grain:.02}},ride:"none",style:"none",companion:"none",carried:zt,update:j0,dispose(){}}}};export{Ja as default};
