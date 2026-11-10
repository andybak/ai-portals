import*as c from"three";const pe="#E8A94E",he={hw:10,depth:14,eaves:25.5,ridge:31,wall:.9,floors:[0,9,18]},se={hw:3.5,y0:10.4,y1:19.6,yc:15,jamb:1,sillOut:1.1,sillH:.7,leafW:3.5,leafOpen:115,back:.3},O={PLAIN:0,LIME:1,SLATE:2,STONE:3,WOOD:4,FLAGS:5,ROCK:6,GLASS:7,NET:8,CLOTH:9,LEAF:10,PANE:11,RUN:12,DRY:13,SWAG:14,PAVE:15},ce={swing:.62,fold:.6,lift:.3},qe=(v,f=1)=>v*Math.sin(ce.swing*f)+ce.fold*f,fe=120*Math.PI/180,ue=11*Math.PI/180,re=[-Math.sin(fe)*Math.cos(ue),Math.sin(ue),-Math.cos(fe)*Math.cos(ue)],X=(v,f=1)=>{const m=new c.Color(v);return[m.r*f,m.g*f,m.b*f]},Te=X,_=(v,f=1)=>"vec3("+X(v,f).map(m=>m.toFixed(4)).join(", ")+")",ye=`
  float skH(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float skN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(skH(i), skH(i + vec2(1., 0.)), f.x), mix(skH(i + vec2(0., 1.)), skH(i + vec2(1., 1.)), f.x), f.y); }
  float skF(vec2 p){ return (.5 * skN(p) + .27 * skN(p * 2.03 + 7.1) + .15 * skN(p * 4.07 + 3.7)) / .92; }
  // the bars' thickness at a place q of the flat shell (x toward the sun's bearing, y across it), drifting on the clock
  float skBars(vec2 q, float t, float drift){
    return skF(vec2(q.x * 1.25 + 3.3, q.y * .4 + 11.7 + t * drift)) * .8 + .2 * skN(vec2(q.x * 3.4, q.y * 1.1 - t * drift * 1.6)); }
  // k: x the bars' cover toward the west, y away from it, z the heaps, w the drift
  vec4 westSky(vec3 d, vec2 sun, float t, vec4 k){
    float el = clamp(d.y, 0., 1.); vec2 nd = normalize(d.xz + vec2(1e-5)); float bw = dot(nd, sun), west = smoothstep(-.35, .9, bw);
    // the band: the rose glow, and the deep ember in it at the rim
    float aR = exp(-el / .2) * smoothstep(-.3, .8, bw) * .8, aE = exp(-el / .07) * smoothstep(.1, .9, bw) * .96;
    vec3 col = ${_("#E0A39A")} * aR; float a = aR;
    col = col * (1. - aE) + mix(${_("#C2665A")}, ${_("#DC7A66")}, smoothstep(0., .07, el)) * aE; a = a + aE - a * aE;
    // the bars
    vec2 p = d.xz / (el + .16), q = vec2(dot(p, sun), dot(p, vec2(-sun.y, sun.x)));
    float cover = mix(k.y, k.x, west) * smoothstep(.015, .09, el) * (1. - .5 * smoothstep(.55, .95, el));
    float n = skBars(q, t, k.w), n1 = skBars(q * 1.07, t, k.w);
    float dens = smoothstep(1. - cover, 1.22 - cover, n + .12), low = clamp((n - n1) * 7., 0., 1.), lit = clamp(.62 + (n - n1) * 6., 0., 1.);
    vec3 under = mix(${_("#A88CA8")}, mix(${_("#E69A8A")}, ${_("#E88A66")}, west * west), west);
    vec3 top = mix(${_("#566088")}, ${_("#6A6292")}, west);
    vec3 cc = mix(top, under, lit * (.45 + .55 * west) * (1. - .3 * smoothstep(.7, 1., dens))) + ${_("#F2CE98")} * (dens * (1. - dens) * 4. * low * (.15 + .85 * west));
    float ca = dens * mix(.5, .92, west);
    col = col * (1. - ca) + cc * ca; a = a + ca - a * ca;
    // the heaps over the western rim: rounded heads on a level foot a little over the sea's edge, in a few companies along
    // the rim; their feet lit ember and gold from below, coral in their middles, lilac in their heads
    float az = atan(nd.x * sun.y - nd.y * sun.x, bw), few = smoothstep(.42, .68, skN(vec2(az * 1.6 + 4.2 + t * k.w * .3, 2.))) * k.z * smoothstep(0., .55, bw);
    vec2 hq = vec2(az * 5. + t * k.w * .6 + 2.7, el * 13.);
    float hn = skF(hq), hup = skF(hq + vec2(0., .5)), win = smoothstep(.034, .042, el) * (1. - smoothstep(.07, .2, el));
    float hd = smoothstep(.27, .4, hn * win * few) * .94, up = clamp(smoothstep(.04, .15, el) + (hn - hup) * 2.5, 0., 1.);
    vec3 hc = mix(mix(${_("#E08A72")}, ${_("#C48C9A")}, smoothstep(0., .45, up)), ${_("#5A547E")}, smoothstep(.35, .95, up)) + ${_("#F2CE98")} * (1. - smoothstep(.036, .06, el)) * .5;
    col = col * (1. - hd) + hc * hd; a = a + hd - a * hd;
    return vec4(col, a);
  }
  // the first stars, in the east only: points by a fixed hash of direction, twinkling on the clock
  float skStars(vec3 d, vec2 sun, float t){
    vec3 g = d * 70., id = floor(g), f = fract(g) - .5; float h = skH(id.xy + id.z * 17.3);
    vec3 o = vec3(skH(id.yz + 3.1), skH(id.zx + 9.7), skH(id.xy + 5.3)) - .5; float r = length(f - o * .6);
    float east = (1. - smoothstep(-.55, .1, dot(normalize(d.xz + vec2(1e-5)), sun))) * smoothstep(.08, .3, d.y);
    return step(.95, h) * (1. - smoothstep(.04, .16, r)) * east * (.55 + .45 * sin(t * (1.2 + 5. * h) + h * 70.)) * (.35 + .65 * skH(id.zy + 1.7));
  }`,de=`
  vec2 gustAt(vec2 p, vec3 wind, float t){
    vec2 w = normalize(wind.xz + vec2(1e-5, 0.)); float s = dot(p, w), q = dot(p, vec2(-w.y, w.x));
    float a = .5 + .5 * sin((s - 7. * t) * .1122 + 1.9 * sin(q * .043) + .8 * sin(q * .017 + 2.));
    float b = .5 + .5 * sin((s - 5.5 * t) * .4833 + 2.3 * sin(q * .11 + 1.3));
    return vec2(a, clamp(.72 * a + .28 * b, 0., 1.));
  }`,ge=`
  attribute vec3 color; attribute vec4 aP; attribute vec2 aUv; attribute float aSh;
  uniform float uTime; uniform vec3 uWind;
  varying vec3 vCol, vN, vW; varying vec4 vP; varying vec2 vUv; varying float vSh;
  #include <fog_pars_vertex>
  ${de}
  void main(){
    vec4 wp = modelMatrix * vec4(position, 1.);
    vec3 nW = normalize(mat3(modelMatrix) * normal);
    // (the ground's fourth number is its share of turf, not a sway: the ground stands still)
    float kind = aP.x, sw = (kind > 5.5 && kind < 6.5) ? 0. : aP.w;
    float ph = wp.x * .23 + wp.z * .19 + wp.y * .31;
    // (r5m1: ONE WIND. Whatever sways leans with the gust that passes its own place and recovers behind it; never past its full sway)
    vec2 tg = gustAt(wp.xz, uWind, uTime);
    float gust = .15 + .85 * tg.y;
    if (kind > 12.5 && kind < 14.5) {
      // LINEN AND NETS ON A ROOF'S LINE: a piece hangs from its line (d metres below it) and swings out from it down the
      // wind as far as the wind meets it squarely, 0.62 of a radian at the full gust, its hem lifting as it swings; folds
      // travel down it, and along it where the wind runs along the line (3.2 m long at 5 m a second)
      float d = max(-aUv.y, 0.), lift = min(d, 1.6) / 1.6;
      vec3 wn = normalize(vec3(uWind.x, 0., uWind.z)), nh = normalize(vec3(nW.x, 0., nW.z) + vec3(1e-5, 0., 0.));
      float sq = dot(wn, nh), th = sq * (.12 + .5 * tg.y) * sw, live = sw * lift * (.3 + .7 * tg.y);
      float wave = sin(6.2832 * (d / 2.6 + aUv.x * .23) - uTime * 4.2 + 4. * tg.y);
      float flag = sin(dot(wp.xz, wn.xz) * 1.9635 - uTime * 9.8 + aUv.x) * (1. - abs(sq));
      wp.xyz += nh * (d * sin(th) + live * .3 * (wave + flag)) + vec3(0., d * (1. - cos(th)) + .1 * live * wave, 0.);
    } else
    wp.xyz += vec3(uWind.x, 0., uWind.z) * (sw * gust) + vec3(0., sw * .12 * sin(uTime * 2.1 + ph * 1.3), 0.);
    vW = wp.xyz; vN = nW; vCol = color; vP = aP; vUv = aUv; vSh = aSh;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,xe=`
  uniform float uTime, uBreath, uAmb; uniform vec3 uSky, uGround, uKeyDir, uKeyCol, uLampCol, uLampK, uWind;
  uniform vec3 uSkyZ, uSkyM, uSkyH, uSkyS, uSunDir, uSunCol, uCirLit, uCirShade, uEmber; uniform vec4 uSkyG, uSkyG2, uSunP, uCir, uSkin; uniform vec2 uSkinDir; uniform float uSkinT0;
  varying vec3 vCol, vN, vW; varying vec4 vP; varying vec2 vUv; varying float vSh;
  #include <fog_pars_fragment>
  float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
  ${ye}
  ${de}
  uniform vec3 uLampW; uniform vec4 uPave, uWell;
  // THE LAMP ON THE FLAGS (r5m1), a law of the stone's own place and nothing else: rays from the window (uLampW) to the
  // stone. It falls with the distance (as the baked law does: 1.2 to 17 m, a half at 77 m) and with the slope of the stone
  // to the rays, and lies only inside the window's cone. BEYOND THE STREET'S MOUTH the window is seen between the street's
  // two last walls: the share of its breadth that a place sees is its light, so the fan ends in a soft edge that widens
  // with the distance from the window (never under a metre). THE WELL's rim and post stand in the rays and throw their
  // soft shadows on the stone behind them, softer the further behind. (The square's south parapet shades what lies beyond
  // the square by the baked law. The two open leaves, folded back at 115 degrees with their feet 10.4 m over the landing,
  // stand outside every ray that reaches a flag: they throw no shadow on lit stone.)
  float paveLamp(vec3 P){
    vec3 dv = P - uLampW; if (dv.z < .3 || dv.y > -1.) return 0.;
    float d = length(dv), far = max(d - 17., 0.) / 60., facing = -dv.y / d;
    float F = 1.2 / (1. + far * far) * smoothstep(.4384, .6157, dv.z / d) * smoothstep(0., .2, facing) * (.75 + .25 * smoothstep(.15, .6, facing));
    float m = (P.z - uPave.y) / max(P.z - uLampW.z, 1.);
    if (m > 0.) { float x0 = uPave.x / (1. - m), hw = max(uPave.z * m / (1. - m), .5), sh = clamp((x0 + hw - abs(P.x)) / (2. * hw), 0., 1.); F *= sh * sh * (3. - 2. * sh); }
    // (a ray climbs 'rise' metres for every metre it runs toward the window: a thing h high shades the stone behind it for h / rise metres)
    vec2 toW = normalize(uLampW.xz - P.xz), rel = uWell.xy - P.xz; float al = dot(rel, toW), pe = abs(rel.x * toW.y - rel.y * toW.x), rise = -dv.y / max(length(dv.xz), 1.), soft = .25 + .05 * max(al, 0.);
    float rim = sqrt(max(uWell.z * uWell.z - pe * pe, 0.)), sR = step(0., al + rim) * (1. - smoothstep(uWell.z - soft, uWell.z + soft, pe)) * (1. - smoothstep(uWell.w - .3, uWell.w + .5, (al - rim) * rise));
    float sP = step(0., al) * (1. - smoothstep(.62 - .6 * soft, .62 + .6 * soft, pe)) * (1. - smoothstep(1.6, 2.4, al * rise));
    F *= 1. - .82 * max(sR, sP);
    return F;
  }
  // THE SKY IN A DIRECTION, for what mirrors it: the kit's own clear-sky law by the kit's own numbers (the dome's uniforms,
  // shared): its three-colour gradient, the warm wash on the sunken sun's side, the sun's two halo lobes; and the high
  // streaks as soft patches of their own two colours on the kit's own shell (uCir: cover, scale, opacity, drift), and the
  // world's own sky over it (the band at the sea's rim and the cloud of the west, by the one law the dome's skin is drawn
  // by). A ray that goes down meets the town and the sea under that sky: the shade's slate.
  vec3 skyAt(vec3 d){
    float dn = smoothstep(-.3, .0, d.y); d = normalize(vec3(d.x, max(d.y, 0.), d.z));
    float inv = 1. - clamp(d.y, 0., 1.);
    vec3 c = mix(uSkyZ, uSkyM, pow(inv, uSkyG2.x)); c = mix(c, uSkyH, pow(inv, uSkyG.x));
    float side = clamp(.5 + .5 * dot(d, uSunDir), 0., 1.), sc = pow(side, uSkyG.z) * mix(uSkyG2.y, 1., pow(inv, uSkyG2.z));
    c = mix(c, uSkyS, clamp(sc * uSkyG.y, 0., 1.));
    float mu = dot(d, uSunDir), g2 = mix(.9, .985, uSunP.w);
    c += uSunCol * uSunP.z * (.16 * pow(.0784 / (1.5184 - 1.44 * mu), 1.5) + .42 * pow((1. - g2) * (1. - g2) / (1. + g2 * g2 - 2. * g2 * mu), 1.5));
    float sh = sqrt(484. * d.y * d.y + 45.) - 22. * d.y; vec2 q = d.xz * sh * uCir.y + uCir.w * uTime;
    float streak = smoothstep(.8 - .6 * uCir.x, 1.05 - .6 * uCir.x, vn(vec2(q.x * .28 + q.y * .1, q.y) * 1.6) + .5 * vn(q * 3.1)) * uCir.z * smoothstep(0., .1, d.y);
    c = mix(c, mix(uCirShade, uCirLit, .25 + .75 * side) + uSkyS * pow(side, uSkyG.z * .6) * uSkyG.y * .15, streak);
    // the world's own band and cloud, as the dome's skin has them
    vec4 w = westSky(d, uSkinDir, uTime + uSkinT0, uSkin); c = c * (1. - w.a) + w.rgb;
    return mix(uGround * 1.5, c, dn);
  }
  void main(){
    int s = int(vP.x + .5);
    vec2 uv = vUv; vec3 n = normalize(vN);
    float big = vn(uv * .22 + 3.1), mid = vn(uv * .9 + 11.7), fine = vn(uv * 3.7);
    float tone = 1., ao = clamp(vP.y, 0., 1.), gl = 0.;
    float wq = max(fwidth(uv.x), fwidth(uv.y)) / .42;
    if (s == 1) {                                  // limewash over rubble: mottled, lumps showing, damp at the foot, runs under the eaves
      float lump = smoothstep(.35, .75, vn(uv * vec2(1.1, 1.6) + 5.)) * .1;
      tone = .8 + .24 * big + .12 * mid - lump + .05 * fine;
      tone *= 1. - .26 * smoothstep(.5, .9, vn(vec2(uv.x * .7, uv.y * .08 + 2.))) * (.4 + .6 * mid);
      // where the wash has worn off, the rubble's own courses show darker
      float worn = smoothstep(.6, .72, vn(uv * .17 + 9.) * .7 + .3 * mid);
      // and at the wall's foot (the pattern's own height is the height over the ground) the wash is worn away raggedly by
      // boots, rain and splash: the rubble shows there on every wall
      worn = max(worn, .9 * smoothstep(2.3, .5, uv.y + 1.6 * (vn(uv * vec2(.45, .3) + 3.) - .5)));
      float rw = floor(uv.y / .8), rx = uv.x / 1.3 + .5 * mod(rw, 2.) + h21(vec2(rw, 2.)) * .4;
      float rj = smoothstep(0., .12, fract(uv.y / .8)) * smoothstep(0., .08, fract(rx)), rid = h21(vec2(floor(rx), rw));
      // under whole wash the same stones still show as soft lumps, where the eye is near enough to tell one from the next
      float told = 1. - smoothstep(.12, .45, wq);
      tone *= mix(1., (.9 + .16 * rid) * (.84 + .16 * rj) * (.93 + .14 * vn(uv * 9.)), told * (1. - worn));
      tone *= mix(1., (.58 + .26 * rid) * (.75 + .25 * rj), worn);
    } else if (s == 2) {                           // slate in courses: every slate its own tone, a dark line under each course
      float row = floor(uv.y / .62), fx = uv.x / .5 + .5 * mod(row, 2.) + h21(vec2(row, 7.)) * .3;
      float id = h21(vec2(floor(fx), row));
      float edge = smoothstep(0., .16, fract(uv.y / .62)) * smoothstep(0., .1, fract(fx)) ;
      tone = (.72 + .5 * id) * (.62 + .38 * edge) * (.9 + .2 * big);
    } else if (s == 3) {                           // dressed stone in courses with mortar
      float row = floor(uv.y / .9), fx = uv.x / 1.7 + .5 * mod(row, 2.) + h21(vec2(row, 3.)) * .35;
      float id = h21(vec2(floor(fx), row * 1.7));
      float joint = smoothstep(0., .1, fract(uv.y / .9)) * smoothstep(0., .05, fract(fx));
      tone = (.74 + .36 * id) * (.68 + .32 * joint) * (.86 + .22 * mid) + .04 * fine;
      // old wash worn to patches on some stones, and the damp of the tide's reach: stone within 2 m of the water stands dark
      tone *= 1. + .16 * smoothstep(.55, .8, vn(uv * .31 + 17.)) * step(.5, id);
      tone *= mix(.56, 1., smoothstep(.9, 2.3, vW.y + .9 * (vn(vec2(uv.x * .4, 5.)) - .5)));
    } else if (s == 4) {                           // planks: a tone to each, grain along them, a dark seam between
      float pl = uv.x / .5, id = h21(vec2(floor(pl), 9.));
      tone = (.74 + .4 * id) * (.6 + .4 * smoothstep(0., .1, fract(pl))) * (.82 + .3 * vn(vec2(uv.x * 9., uv.y * .5)));
    } else if (s == 5 || s == 15) {                // flags: big worn slabs, a tone to each, dark joints, damp patches
      float row = floor(uv.y / 1.9), fx = uv.x / 2.6 + h21(vec2(row, 5.)) ;
      float id = h21(vec2(floor(fx), row * 2.3));
      float joint = smoothstep(0., .08, fract(uv.y / 1.9)) * smoothstep(0., .06, fract(fx));
      tone = (.74 + .34 * id) * (.66 + .34 * joint) * (.8 + .32 * big);
      // (the flags the lamp falls on show their grain and the hollows worn in them)
      if (s == 15) tone *= (.9 + .2 * fine) * (.92 + .16 * mid);
    } else if (s == 6) {                           // living rock and thin turf: strata and blotches
      tone = .62 + .5 * big + .3 * mid * mid + .12 * fine - .15 * smoothstep(.4, .6, vn(vec2(uv.x * .05, uv.y * .9)));
      // THE WIND ON THE HILL (r5m1): where turf, heath or crop grows (the ground's own share, vP.w: none on rock, road,
      // shingle or the town's ground) the gust's fronts run over it down the wind, the blades laid over showing paler
      // and with a sheen as a front passes, a shade darker in the lull behind it
      if (vP.w > .01) { float g = gustAt(vW.xz, uWind, uTime).x, lit = smoothstep(.45, .95, g); gl = vP.w * lit; tone *= 1. + vP.w * (.3 * lit - .1 * smoothstep(.5, .05, g)); }
    } else if (s == 7) {                           // old glass: dark, with slow glints that slide as the flame breathes
      float g = vn(vec2(uv.x * 1.3 + uTime * .11, uv.y * .7 - uTime * .07)) * vn(uv * 2.9 + uTime * .05);
      tone = .8 + .5 * big; gl = smoothstep(.3, .62, g);
    } else if (s == 8) {                           // net: a knotted mesh, holes cut where the mesh can be resolved
      // (far off, where the knots cannot be told, the same mesh is drawn two, four, eight times as coarse, so that a net is
      // seen through at every distance and never stands as a board)
      float lvl = exp2(clamp(ceil(log2(max(wq / .2, .001))), 0., 4.));
      vec2 q = uv / (.42 * lvl); float m = min(abs(fract(q.x + q.y) - .5), abs(fract(q.x - q.y) - .5));
      if (m > .15) discard;
      tone = .85 + .4 * mid;
    } else if (s == 9) {                           // cloth: soft folds; where the cloth stirs in the wind (its sway) they run along it
      tone = .76 + .22 * sin(uv.x * 9. + 2. * mid - uTime * 2.3 * step(.004, vP.w)) + .07 * sin(uv.x * 23. + uv.y * 2.) + .1 * big;
    } else if (s == 10) {                          // leaf and needle masses
      // (they stir: gusts run over every leaf mass on the one wind, turning the paler undersides up as they pass)
      float gust = vn(vec2((vW.x + vW.z) * .45 - uTime * .8 * uWind.x, vW.y * .6 + uTime * .2));
      tone = (.7 + .6 * mid) * (.78 + .5 * gust); gl = .8 * (gust - .5);
    } else if (s == 11) {                          // a pane of old glass in the town: dark, a little uneven
      tone = .7 + .5 * mid;
    } else if (s == 13) {                          // linen on a roof's line: soft broad folds that run as it stirs
      // (the folds stand as deep in it as in the washing of the lanes, broader, and run along it and down it as it stirs)
      tone = .68 + .18 * sin(uv.x * 4.3 + 2. * mid - uTime * 2.1) + .09 * sin(uv.y * 2.4 + uTime * 4.2 + uv.x * 1.4) + .08 * big;
    } else if (s == 14) {                          // a net drying in a swag: the knotted mesh seen through, cork floats along its head rope
      // (its foot hangs in festoons, 2.75 to 3.4 m under the line, a foot rope along them; the mesh as the nets of the quay)
      // (a drying net's mesh is told a little finer than a net's on the quay, its cords thinner: it hangs as a veil against the sky)
      float dn = -uv.y, lvl = exp2(clamp(ceil(log2(max(wq / .3, .001))), 0., 4.)), hem = 2.75 + .6 * abs(sin(uv.x * 1.2566));
      if (dn > hem) discard;
      vec2 q = uv / (.42 * lvl); float m = min(abs(fract(q.x + q.y) - .5), abs(fract(q.x - q.y) - .5)) + .035;
      float cork = 1. - smoothstep(.16, .22, length(vec2((fract(uv.x / .9) - .5) * .9, dn - .2))), rope = max(1. - smoothstep(.05, .09, dn), 1. - smoothstep(.05, .09, hem - dn));
      if (m > .15 && cork < .5 && rope < .5) discard;
      tone = (.8 + .4 * mid) * (1. + .7 * cork);
    } else if (s == 12) {                          // water running in a gutter: streaks of the sky sliding down it (the pattern's v runs up the fall)
      float g = vn(vec2(uv.x * 7., uv.y * 2.4 + uTime * 2.8)) * .65 + .35 * vn(vec2(uv.x * 15., uv.y * 5. + uTime * 4.1));
      tone = .7; gl = smoothstep(.42, .7, g);
    } else { tone = .88 + .2 * big + .06 * fine; }
    vec3 alb = vCol * tone;
    float up = n.y * .5 + .5;
    vec3 amb = mix(uGround, uSky, up) * (uAmb * ao);
    // THE LAST LIGHT, the key: faces turned to the band take it plainly, faces aslant to it by their slant, faces turned from
    // it none (they stand in the sky's blue fill); vSh is the painted shade a standing thing throws along its own wall
    float key = max(dot(n, uKeyDir), 0.) * (1. - clamp(vSh, 0., 1.));
    // the lamp's paint p: where it lies the sky's blue and the last light's pale straw give way to it (uLampK.z), and it is laid as gold of
    // strength uLampK.x p / (1 + uLampK.y p) (far washes are plainly seen, near ones never burn to white), a little by the face's own tone
    float p = max(vP.z, 0.), lum = dot(alb, vec3(.3, .55, .15));
    if (s == 15) p = paveLamp(vW);
    // (cloth lets the last light through: a sail or a sheet seen against the band glows in its own colour)
    if (s == 9 || s == 13) key += .6 * max(dot(-n, uKeyDir), 0.);
    vec3 col = alb * (amb + uKeyCol * key * (.45 + .55 * ao));
    // (chalk in the last light is pale, never white: what the sky and the band lay on a face is eased off above .45)
    // (on the flags the lamp falls on, the dusk's own light on the stone stays under the gold: light on stone, not paint)
    col *= 1. / (1. + .8 * max(max(col.r, max(col.g, col.b)) - .45, 0.)) / (1. + (s == 15 ? .9 : uLampK.z) * p);
    // (tar and old paint on planks keep a dull sheen of the sky: dark wood is slate under it, never a black hole)
    col += uSky * (s == 7 ? .2 + .7 * gl : s == 12 ? .12 + gl : s == 4 ? .13 * ao : 0.);
    if (s == 11) {
      // A PANE IS A DIM MIRROR OF THE SKY, by the mirror law (a law of physics, as the water's reflection is): the eye's ray
      // is turned about the pane's own normal and the pane shows the sky in that direction, band and cloud as the sky has
      // them, BUT NEVER MORE THAN A THIRD OF THE SKY'S OWN LIGHT (old glass before a dark room: a seventh of it seen square
      // on, a third along the pane), and greyed toward the dusk's cool: the band is a pale rose in it, never a red or an
      // orange bar, so no pane can be taken for a lamp within. Old glass is uneven: each pane leans a little in soft
      // patches. Unlit from within: nothing here is warm but what the lamp's own paint lays on it.
      vec3 v = normalize(vW - cameraPosition);
      vec3 pn = normalize(n + .06 * vec3(vn(uv * vec2(1.7, 1.1) + 7.) - .5, vn(uv * 1.3 + 2.) - .5, vn(uv * 1.9 + 4.) - .5));
      float cs = clamp(dot(-v, pn), 0., 1.), fr = .14 + .19 * pow(1. - cs, 3.);
      vec3 mir = skyAt(reflect(v, pn)); float ml = dot(mir, vec3(.3, .55, .15));
      col = alb * amb * .22 + mix(ml * vec3(.9, .97, 1.14), mir, .42) * fr * (.7 + .3 * ao);
    }
    // (the grass under a gust has a sheen of the sky)
    if (s == 6) col += uSky * (.05 * gl);
    // THE GOLD ON THE FLAGS MULTIPLIES THE STONE (r5m1): every slab's own tone, its joints and its grain stay under it
    if (s == 15) col += uLampCol * (uLampK.x * p / (1. + uLampK.y * p) * uBreath) * min(alb * 5., vec3(1.4));
    // (and on linen and nets it is paint on the thing: a pale sheet stands softly gold on its window side, a tanned net a warm brown)
    else if (s == 13 || s == 14) col += uLampCol * (uLampK.x * p / (1. + uLampK.y * p) * uBreath) * min(alb * (s == 14 ? 1.5 : 2.4), vec3(1.));
    else col += uLampCol * (uLampK.x * p / (1. + uLampK.y * p) * uBreath) * (.7 + .55 * lum + .45 * gl);
    gl_FragColor = vec4(col, 1.);
    #include <fog_fragment>
  }`;function be(v,f="#D9756A",m=null){const e={uTime:{value:0},uBreath:{value:1},uAmb:{value:1.6},uSky:{value:new c.Vector3(...X("#98A8C8"))},uGround:{value:new c.Vector3(...X("#565E72"))},uKeyDir:{value:new c.Vector3(...re)},uKeyCol:{value:new c.Vector3(...X("#D9D08E",1.5))},uLampCol:{value:new c.Vector3(1,.45,.07)},uLampK:{value:new c.Vector3(1.1,1.2,2.5)},uWind:{value:new c.Vector3(1,0,0)},uLampW:{value:new c.Vector3(0,1e5,0)},uPave:{value:new c.Vector4(5,1e5,se.hw,0)},uWell:{value:new c.Vector4(0,-1e5,1,1)}},o=v?v.uniforms:null,a=b=>({value:new c.Color(b)}),E=(b,q,W,z)=>({value:new c.Vector4(b,q,W,z)}),M=v&&v.options.clouds2?v.options.clouds2:null;return Object.assign(e,{uSkyZ:o?o.uZenith:a("#2B3759"),uSkyM:o?o.uMid:a("#5470A8"),uSkyH:o?o.uHorizon:a("#8AA3C4"),uSkyS:o?o.uScatterColor:a("#D9D08E"),uSkyG:o?o.uGrad:E(7,1.5,1.7,0),uSkyG2:o?o.uGrad2:E(1.4,.02,5.2,0),uSunDir:o?o.uSunDir:{value:new c.Vector3(...re)},uSunCol:o?o.uSunColor:a("#D9756A"),uSunP:o?o.uSun:E(0,0,0,0),uEmber:a(f),uCirLit:a(M?M.lit:"#000000"),uCirShade:a(M?M.shade:"#000000"),uCir:M?E(M.coverage,M.scale*3.2,M.opacity,Math.hypot(M.wind[0],M.wind[1])):E(0,1,0,0)}),Object.assign(e,{uSkinDir:m?m.uDir:{value:new c.Vector2(re[0],re[2]).normalize()},uSkin:m?m.uSkin:E(0,0,0,0),uSkinT0:m?m.uSkinT0:{value:0}}),e}function ke(v,f={}){return new c.ShaderMaterial({uniforms:{...c.UniformsUtils.clone(c.UniformsLib.fog),...v},vertexShader:ge,fragmentShader:xe,fog:!0,side:f.side??c.FrontSide})}const Pe=-1;function Ae(){let v=2048,f=0,m=new Float32Array(v*3),e=new Float32Array(v*3),o=new Float32Array(v*3),a=new Float32Array(v*2),E=new Float32Array(v*4),M=new Float32Array(v),b=4096,q=0,W=new Uint32Array(b);const z=(r,u)=>{const p=new Float32Array(v*u);return p.set(r),p},w=()=>{v*=v<32768?4:2,m=z(m,3),e=z(e,3),o=z(o,3),a=z(a,2),E=z(E,4),M=z(M,1)},A=(r,u,p)=>{if(q+3>b){b*=2;const t=new Uint32Array(b);t.set(W),W=t}W[q++]=r,W[q++]=u,W[q++]=p},d={c:[1,1,1],surf:0,ao:1,sway:0,lamp:0,sh:0,M:null},C=new c.Vector3,x=new c.Vector3,I=new c.Matrix3,R=[0,0,0],k={st:d,set(r){return Object.assign(d,r),r.M!==void 0&&d.M&&I.getNormalMatrix(d.M),k},col(r,u=1){return d.c=typeof r=="string"?X(r,u):[r[0]*u,r[1]*u,r[2]*u],k},vert(r,u,p,t,s,h,n,l){C.set(r[0],r[1],r[2]),x.set(u[0],u[1],u[2]),d.M&&(C.applyMatrix4(d.M),x.applyMatrix3(I).normalize()),f===v&&w();const i=f*3,y=f*4;return m[i]=C.x,m[i+1]=C.y,m[i+2]=C.z,e[i]=x.x,e[i+1]=x.y,e[i+2]=x.z,o[i]=d.c[0],o[i+1]=d.c[1],o[i+2]=d.c[2],a[f*2]=p,a[f*2+1]=t,E[y]=d.surf,E[y+1]=s,E[y+2]=h??d.lamp,E[y+3]=n??d.sway,M[f]=l??d.sh,f++},quad(r,u,p,t,s={}){const h=u[0]-r[0],n=u[1]-r[1],l=u[2]-r[2],i=t[0]-r[0],y=t[1]-r[1],g=t[2]-r[2];let S=n*g-l*y,L=l*i-h*g,T=h*y-n*i;const N=Math.hypot(S,L,T)||1;S/=N,L/=N,T/=N;const D=Math.hypot(h,n,l),P=Math.hypot(i,y,g),G=s.uv?s.uv[0]:0,U=s.uv?s.uv[1]:0,K=s.sub?Math.max(1,Math.ceil(D/s.sub)):1,$=s.sub?Math.max(1,Math.ceil(P/s.sub)):1,Y=(B,V)=>B===void 0?[V,V,V,V]:typeof B=="number"?[B,B,B,B]:B,Z=Y(s.ao,d.ao),ee=Y(s.lamp,d.lamp),te=Y(s.sway,d.sway),oe=Y(s.sh,d.sh),ae=[S,L,T],ve=f,ie=(B,V,F)=>(B[0]*(1-V)+B[1]*V)*(1-F)+(B[3]*(1-V)+B[2]*V)*F;if(K===1&&$===1&&!s.lampAt)k.vert(r,ae,G,U,Z[0],ee[0],te[0],oe[0]),k.vert(u,ae,G+D,U,Z[1],ee[1],te[1],oe[1]),k.vert(t,ae,G,U+P,Z[3],ee[3],te[3],oe[3]),k.vert(p,ae,G+D,U+P,Z[2],ee[2],te[2],oe[2]);else for(let B=0;B<=$;B++)for(let V=0;V<=K;V++){const F=V/K,Q=B/$,le=R;for(let J=0;J<3;J++)le[J]=(r[J]*(1-F)+u[J]*F)*(1-Q)+(t[J]*(1-F)+p[J]*F)*Q;const we=s.lampAt?s.lampAt(le):ie(ee,F,Q);k.vert(le,ae,G+D*F,U+P*Q,ie(Z,F,Q),we,ie(te,F,Q),ie(oe,F,Q))}for(let B=0;B<$;B++)for(let V=0;V<K;V++){const F=ve+B*(K+1)+V;A(F,F+1,F+K+2),A(F,F+K+2,F+K+1)}return k},tri(r,u,p,t={}){const s=u[0]-r[0],h=u[1]-r[1],n=u[2]-r[2],l=p[0]-r[0],i=p[1]-r[1],y=p[2]-r[2];let g=h*y-n*i,S=n*l-s*y,L=s*i-h*l;const T=Math.hypot(g,S,L)||1,N=[g/T,S/T,L/T],D=Math.hypot(s,h,n),P=t.ao??[d.ao,d.ao,d.ao],G=t.lamp??[d.lamp,d.lamp,d.lamp],U=k.vert(r,N,0,0,P[0],G[0]),K=k.vert(u,N,D,0,P[1],G[1]),$=k.vert(p,N,D*.5,Math.hypot(l,i,y),P[2],G[2]);return A(U,K,$),k},box(r,u,p,t,s,h,n={}){const l=n.no||"",i=n.aoLow??d.ao,y=n.aoHigh??d.ao,g={sub:n.sub,ao:[i,i,y,y],lamp:n.lamp,uv:n.uv,lampAt:n.lampAt};return l.includes("s")||k.quad([r,u,h],[t,u,h],[t,s,h],[r,s,h],g),l.includes("n")||k.quad([t,u,p],[r,u,p],[r,s,p],[t,s,p],g),l.includes("e")||k.quad([t,u,h],[t,u,p],[t,s,p],[t,s,h],g),l.includes("w")||k.quad([r,u,p],[r,u,h],[r,s,h],[r,s,p],g),l.includes("t")||k.quad([r,s,h],[t,s,h],[t,s,p],[r,s,p],{sub:n.sub,ao:n.aoTop??y,lamp:n.lampTop??n.lamp,lampAt:n.lampAt}),l.includes("b")||k.quad([r,u,p],[t,u,p],[t,u,h],[r,u,h],{ao:i*.6,lamp:n.lamp}),k},post(r,u,p,t,s,h,n=8,l={}){const i=l.aoLow??d.ao,y=l.aoHigh??d.ao;for(let g=0;g<n;g++){const S=g/n*Math.PI*2,L=(g+1)/n*Math.PI*2,T=Math.cos(S),N=Math.sin(S),D=Math.cos(L),P=Math.sin(L);k.quad([r+D*s,p,u+P*s],[r+T*s,p,u+N*s],[r+T*h,t,u+N*h],[r+D*h,t,u+P*h],{ao:[i,i,y,y],uv:[g*1.3,0],lamp:l.lamp}),l.open||k.tri([r,t,u],[r+D*h,t,u+P*h],[r+T*h,t,u+N*h],{ao:[y,y,y]})}return k},get count(){return f},get triangles(){return q/3},bake(r,u=0,p=f){for(let t=u;t<p;t++)E[t*4+2]<0&&(E[t*4+2]=r(m[t*3],m[t*3+1],m[t*3+2],e[t*3],e[t*3+1],e[t*3+2]))},shade(r,u=0,p=f){for(let t=u;t<p;t++)M[t]<1&&(M[t]=Math.max(M[t],r(m[t*3],m[t*3+1],m[t*3+2],e[t*3],e[t*3+1],e[t*3+2])))},geometry(){const r=new c.BufferGeometry;return r.setAttribute("position",new c.BufferAttribute(m.slice(0,f*3),3)),r.setAttribute("normal",new c.BufferAttribute(e.slice(0,f*3),3)),r.setAttribute("color",new c.BufferAttribute(o.slice(0,f*3),3)),r.setAttribute("aUv",new c.BufferAttribute(a.slice(0,f*2),2)),r.setAttribute("aP",new c.BufferAttribute(E.slice(0,f*4),4)),r.setAttribute("aSh",new c.BufferAttribute(M.slice(0,f),1)),r.setIndex(new c.BufferAttribute(f>65535?W.slice(0,q):new Uint16Array(W.subarray(0,q)),1)),r.computeBoundingSphere(),r.computeBoundingBox(),r}};return k}function j(v,f){const m=se,e=m.hw+m.jamb,o=m.y1+.9,a=W=>{const z=Math.min(1,Math.max(0,W));return z*z*(3-2*z)},E=Math.max(Math.abs(v)-e,0),M=.1+2.3*(1-a(Math.hypot(E,Math.max(f-o,0))/4.2)),b=Math.hypot(E,Math.max(m.y0-f,0)),q=.1+1.9*Math.max(0,1-b/4);return q+(M-q)*a((f-m.y0+1.5)/3)}const H={chalk:"#DAD7CF",stone:"#A8A49A",slate:"#666A74",tar:"#5A4A42",oak:"#8C7658",iron:"#33363C",blue:"#8399B4",green:"#829C84",vine:"#55704A",lead:"#454850",glass:"#34404E",rock:"#77756E",turf:"#5E6850",flags:"#8E8B84",rope:"#8E8878",pot:"#8A6652",spar:"#5C564E"};async function Ee(v,f={}){const m=f.light||be(),e=he,o=se,a=Ae(),E=v.core.makeRng(v.core.hashSeed("the tall house")),M=new c.Group,b=(t,s,h,n)=>{const l=new Set(n);for(let i=t;i<=s+1e-6;i+=h)l.add(Math.round(i*100)/100);return[...l].filter(i=>i>=t-1e-6&&i<=s+1e-6).sort((i,y)=>i-y)},q=t=>e.ridge-(e.ridge-e.eaves)*Math.abs(t)/e.hw,W=b(-e.hw,e.hw,1,[-o.hw,o.hw,-1.5,1.5]),z=b(0,e.eaves,1,[6.3,o.y0,o.y1,e.eaves]),w=(t,s=e.eaves)=>Math.min(1,.5+.5*(s-t)/2.2)*(.78+.22*Math.min(1,t/1.6)),A=(t,s)=>w(s,q(t));a.col(H.chalk).set({surf:O.LIME});for(let t=0;t<z.length-1;t++)for(let s=0;s<W.length-1;s++){s===0&&await v.yield();const h=W[s],n=W[s+1],l=z[t],i=z[t+1],y=(h+n)/2,g=(l+i)/2;Math.abs(y)<o.hw&&g>o.y0&&g<o.y1||Math.abs(y)<1.5&&g<6.3||a.quad([h,l,0],[n,l,0],[n,i,0],[h,i,0],{uv:[h+30,l],ao:[A(h,l),A(n,l),A(n,i),A(h,i)],lampAt:S=>j(S[0],S[1])})}for(let t=0;t<W.length-1;t++){const s=W[t],h=W[t+1];for(const[n,l]of[[0,.5],[.5,1]]){const i=(y,g)=>e.eaves+(q(y)-e.eaves)*g;a.quad([s,i(s,n),0],[h,i(h,n),0],[h,i(h,l),0],[s,i(s,l),0],{uv:[s+30,e.eaves],ao:[A(s,i(s,n)),A(h,i(h,n)),A(h,i(h,l)),A(s,i(s,l))],lampAt:y=>j(y[0],y[1])})}}await v.yield();const d=e.depth,C=(t,s,h)=>{for(const[n,l]of[[0,1.6],[1.6,e.eaves-2.2],[e.eaves-2.2,e.eaves]])a.quad([t[0],n,t[1]],[s[0],n,s[1]],[s[0],l,s[1]],[t[0],l,t[1]],{uv:[h,n],ao:[w(n),w(n),w(l),w(l)]})};C([e.hw,0],[e.hw,-d],7),C([e.hw,-d],[-e.hw,-d],31),C([-e.hw,-d],[-e.hw,0],53),a.tri([e.hw,e.eaves,-d],[-e.hw,e.eaves,-d],[0,e.ridge,-d],{ao:[.7,.7,.6]}),await v.yield();const x=.8,I=.7,R=(e.ridge-e.eaves)/e.hw,k=e.eaves-x*R;for(const t of[-1,1]){a.col(H.slate).set({surf:O.SLATE});const s=[t*(e.hw+x),k,I],h=[t*(e.hw+x),k,-d-I],n=[0,e.ridge,I],l=[0,e.ridge,-d-I];t>0?a.quad(s,h,l,n,{ao:1,uv:[3,0]}):a.quad(h,s,n,l,{ao:1,uv:[17,0]}),a.col(H.stone,.6).set({surf:O.PLAIN});const i=[t*e.hw,e.eaves,0],y=[0,e.ridge,0],g=T=>j(T[0],T[1])*.6;t>0?a.quad(i,s,n,y,{ao:.45,lampAt:g}):a.quad(s,i,y,n,{ao:.45,lampAt:g});const S=[s[0],s[1]-.3,I],L=[0,e.ridge-.3,I];a.col(H.oak,.7).set({surf:O.WOOD}),t>0?a.quad(S,s,n,L,{ao:.9,lampAt:g}):a.quad(s,S,L,n,{ao:.9,lampAt:g})}a.col(H.stone,.8).set({surf:O.PLAIN}).box(-.3,e.ridge-.15,-d-I,.3,e.ridge+.25,I,{no:"b"}),await v.yield();const r=[];for(const t of[-6.2,5.6]){a.col(H.stone,.9).set({surf:O.STONE}).box(t-1.1,q(t)-1.6,-d/2-.9,t+1.1,e.ridge+3.1,-d/2+.9,{no:"b",aoLow:.7,aoHigh:1}),a.col(H.stone,.7).set({surf:O.PLAIN}).box(t-1.3,e.ridge+3.1,-d/2-1.1,t+1.3,e.ridge+3.4,-d/2+1.1,{});for(const s of[-.5,.5])a.col(H.pot).post(t+s,-d/2,e.ridge+3.4,e.ridge+4.3,.34,.26,7,{aoLow:.7});r.push(new c.Vector3(t,e.ridge+4.3,-d/2))}await v.yield();const u=.14,p=o.hw+o.jamb;a.col(H.stone).set({surf:O.STONE});for(const t of[-1,1]){const s=t>0?o.hw:-p,h=t>0?p:-o.hw;a.box(s,o.y0,0,h,o.y1,u,{no:"nb"+(t>0?"w":"e"),lamp:2.6,uv:[t*4+9,0]});const n=t*o.hw;t>0?a.quad([n,o.y0,-e.wall],[n,o.y0,u],[n,o.y1,u],[n,o.y1,-e.wall],{lamp:3.2}):a.quad([n,o.y0,u],[n,o.y0,-e.wall],[n,o.y1,-e.wall],[n,o.y1,u],{lamp:3.2})}a.box(-p-.4,o.y1,0,p+.4,o.y1+1.1,u+.06,{no:"nb",lamp:2.5,uv:[2,5]}),a.quad([-o.hw,o.y1,-e.wall],[o.hw,o.y1,-e.wall],[o.hw,o.y1,u],[-o.hw,o.y1,u],{lamp:3.2}),a.quad([-o.hw,o.y0,u],[o.hw,o.y0,u],[o.hw,o.y0,-e.wall],[-o.hw,o.y0,-e.wall],{lamp:2.6}),a.col(H.slate,.9).set({surf:O.PLAIN});for(let t=0;t<23;t++){const s=(t+.5)/23*2-1,h=s*(p+.3),n=o.y1+1.2+.95*(1-s*s),l=-s*.5,i=Math.cos(l),y=Math.sin(l),g=.7,S=.12,L=(T,N)=>[h+T*i-N*y,n+T*y+N*i,u];a.quad(L(-S,0),L(S,0),L(S,g),L(-S,g),{lampAt:T=>j(T[0],T[1])*.8})}return a.col(H.stone,1.05).set({surf:O.STONE}),a.box(-p-.2,o.y0-o.sillH,0,p+.2,o.y0,o.sillOut,{no:"n",lamp:1.3,lampTop:2.4,aoLow:.7,uv:[1,3]}),Se(v,{group:M,m:a,light:m,fixed:E,chimneys:r})}function me(v,f,m,e,o={}){const a=new c.Vector3(m[0]-f[0],m[1]-f[1],m[2]-f[2]).normalize(),E=Math.abs(a.y)>.9?new c.Vector3(1,0,0):new c.Vector3(0,1,0),M=new c.Vector3().crossVectors(a,E).normalize(),b=new c.Vector3().crossVectors(M,a),q=(w,A)=>[0,1,2,3].map(d=>{const C=Math.cos(d*Math.PI/2+.785),x=Math.sin(d*Math.PI/2+.785);return[w[0]+(M.x*C+b.x*x)*A,w[1]+(M.y*C+b.y*x)*A,w[2]+(M.z*C+b.z*x)*A]}),W=q(f,e),z=q(m,o.r1??e);for(let w=0;w<4;w++){const A=(w+1)%4;v.quad(W[A],W[w],z[w],z[A],o)}}function ne(v,f,m,e,o,a,E,M,b){v.quad([f,m,a],[e,m,a],[e,o,a],[f,o,a],{lamp:E,uv:[f,m]}),v.quad([e,m,-a],[f,m,-a],[f,o,-a],[e,o,-a],{lamp:M,uv:[f+5,m]}),v.quad([e,m,a],[e,m,-a],[e,o,-a],[e,o,a],{lamp:b}),v.quad([f,m,-a],[f,m,a],[f,o,a],[f,o,-a],{lamp:b}),v.quad([f,o,a],[e,o,a],[e,o,-a],[f,o,-a],{lamp:b}),v.quad([f,m,-a],[e,m,-a],[e,m,a],[f,m,a],{lamp:b})}async function Se(v,f){const{group:m,m:e,light:o,fixed:a,chimneys:E}=f,M=he,b=se;e.col(H.tar).set({surf:O.WOOD,lamp:0}),e.quad([-1.5,0,-.4],[1.5,0,-.4],[1.5,6.3,-.4],[-1.5,6.3,-.4],{ao:[.5,.5,.42,.42],lampAt:w=>j(w[0],w[1])*.8}),e.col(H.stone,.8).set({surf:O.STONE}),e.quad([-1.5,0,-.4],[-1.5,0,0],[-1.5,6.3,0],[-1.5,6.3,-.4],{ao:.6,lamp:.5}),e.quad([1.5,0,0],[1.5,0,-.4],[1.5,6.3,-.4],[1.5,6.3,0],{ao:.6,lamp:.5}),e.quad([-1.5,6.3,-.4],[1.5,6.3,-.4],[1.5,6.3,0],[-1.5,6.3,0],{ao:.5,lamp:.4}),e.col(H.stone).box(-2.1,6.3,0,2.1,7.1,.12,{no:"nb",lampAt:w=>j(w[0],w[1])});for(const w of[-1,1])e.box(w>0?1.5:-2.1,0,0,w>0?2.1:-1.5,6.3,.1,{no:"nb",lampAt:A=>j(A[0],A[1])});e.col(H.stone,1.1).set({surf:O.FLAGS}).box(-2.6,-.5,0,2.6,0,1.5,{no:"nb",lampAt:w=>.5,aoLow:.7});for(const[w,A,d]of[[-.9,1.2,1],[-.9,4.9,1]])e.col(H.iron).set({surf:O.PLAIN}),e.box(w-.5,A,-.4,w+1.6,A+.16,-.34,{no:"n",lamp:.3});const q=[[-6.3,2.2,3,4.2],[6.3,2.2,3,4.2],[-7.9,11.6,2.2,3.6],[7.9,11.6,2.2,3.6],[-7.6,19.6,2.2,3.4],[7.6,19.6,2.2,3.4],[0,25.4,1.9,2.4]];for(const[w,A,d,C]of q){e.col(H.stone).set({surf:O.STONE}),e.box(w-d/2-.35,A-.4,0,w+d/2+.35,A,.3,{no:"n",lampAt:x=>j(x[0],x[1]),aoLow:.7}),e.box(w-d/2-.3,A+C,0,w+d/2+.3,A+C+.5,.12,{no:"nb",lampAt:x=>j(x[0],x[1])});for(const x of[-1,1]){const I=.03+.16*a(),R=d/2-.03,k=w+x*d/2,r=k-x*R,u=j(w,A+C/2)*.9,p=n=>[k,n,.07],t=n=>[r,n,.07+I],s=A+.05,h=A+C-.05;e.col(H.blue,.75+.3*a()).set({surf:O.WOOD}),x>0?e.quad(t(s),p(s),p(h),t(h),{lamp:u,ao:.9,uv:[w+x,A]}):e.quad(p(s),t(s),t(h),p(h),{lamp:u,ao:.9,uv:[w+x,A]}),e.col(H.iron).set({surf:O.PLAIN});for(const n of[A+.6,A+C-.75]){const l=k-x*R*.7,i=.1+I*.7;x>0?e.quad([l,n,i],[k,n,.1],[k,n+.15,.1],[l,n+.15,i],{lamp:u*.4}):e.quad([k,n,.1],[l,n,i],[l,n+.15,i],[k,n+.15,.1],{lamp:u*.4})}}e.set({M:null})}await v.yield();const W=b.leafOpen*Math.PI/180,z=.07;for(const w of[-1,1]){await v.yield();const A=new c.Vector3(-w*Math.cos(W),0,Math.sin(W)),d=new c.Vector3(-w*Math.sin(W),0,-Math.cos(W)),C=w>0?d:d.clone().negate(),x=new c.Matrix4().makeBasis(A,new c.Vector3(0,1,0),C).setPosition(w*b.hw,b.y0,.02),I=2.7,R=1.1,k=.35,r=w>0?R:k,u=w>0?k:R,p=w>0?I:k,t=w>0?k:I,s=.6,h=b.leafW,n=b.y1-b.y0;e.col(H.oak).set({surf:O.WOOD,M:x,ao:1}),ne(e,0,0,.26,n,z,r,u,s),ne(e,h-.26,0,h,n,z,r,u,s),ne(e,h/2-.11,.28,h/2+.11,n-.28,z,r,u,s);const l=[0,1,2,3,4].map(g=>g*n/4),i=.1;for(const[g,S]of[[0,.28],[n-.28,n],[l[1]-i,l[1]+i],[l[2]-i,l[2]+i],[l[3]-i,l[3]+i]])ne(e,.26,g,h-.26,S,z,r,u,s);for(const[g,S]of[[.26,h/2-.11],[h/2+.11,h-.26]])for(const[L,T]of[[.28,l[1]-i],[l[1]+i,l[2]-i],[l[2]+i,l[3]-i],[l[3]+i,n-.28]]){e.col(H.glass).set({surf:O.GLASS}),e.quad([g,L,.02],[S,L,.02],[S,T,.02],[g,T,.02],{lamp:p*1.2,uv:[g*3+w,L]}),e.quad([S,L,-.02],[g,L,-.02],[g,T,-.02],[S,T,-.02],{lamp:t*1.2,uv:[g*3+7,L]}),e.col(H.lead).set({surf:O.PLAIN});for(const N of[1/3,2/3]){const D=L+(T-L)*N;ne(e,g,D-.025,S,D+.025,.035,r*.5,u*.5,.5)}}e.set({M:null}).col(H.iron).set({surf:O.PLAIN});const y=new c.Vector3(2,4.2,w>0?-z:z).applyMatrix4(x);me(e,[y.x,y.y,y.z],[w*(b.hw+2.6),b.y0+4.2,.05],.05,{lamp:.6})}return e.set({M:null}),Le(v,f)}const Me=v=>1+.03*Math.sin(v*37.7)*(.6+.4*Math.sin(v*14.3+1.1))+.13*Math.sin(v*1.885);async function Le(v,f){const{group:m,m:e,light:o,fixed:a,chimneys:E}=f,M=he,b=se,q=[[-2.7,0,.22],[-3.6,2.6,.25],[-5.6,6.2,.25],[-8.2,9.4,.25],[-9,13.5,.25],[-8.8,17.4,.25],[-9.1,21,.25],[-8,24.2,.3],[-5.4,24.9,.3]];e.col("#4A4038").set({surf:O.PLAIN,M:null});for(let l=0;l<q.length-1;l++)me(e,q[l],q[l+1],.16-l*.012,{lampAt:i=>j(i[0],i[1])*.5,ao:.8});e.set({surf:O.LEAF});for(let l=0;l<360;l++){l%60===59&&await v.yield();const i=Math.pow(a(),.8)*(q.length-1),y=Math.min(q.length-2,Math.floor(i)),g=i-y,S=q[y],L=q[y+1],T=.5+1.2*(i/q.length),N=S[0]+(L[0]-S[0])*g+(a()-.5)*2*T,D=Math.min(M.eaves-.5,S[1]+(L[1]-S[1])*g+(a()-.5)*1.8),P=.2+.4*a(),G=.3+.28*a(),U=a()*6.283,K=(a()-.5)*.9,$=Math.cos(U)*G,Y=Math.sin(U)*G;e.col(H.vine,.7+.7*a());const Z=j(N,D)*.75;e.quad([N-$,D-Y,P],[N+Y*.7,D-$*.7,P+K*G],[N+$,D+Y,P+K*G*.6],[N-Y*.7,D+$*.7,P-K*G*.4],{lamp:Z,sway:[.04,.18,.3,.18],ao:.85})}await v.yield();const W=ke(o,{side:c.DoubleSide});await v.yield();const z=e.geometry();await v.yield();const w=new c.Mesh(z,W);w.name="tall-house",m.add(w),await v.yield();const A=-(M.wall+b.back),d=new c.PlaneGeometry(2*b.hw,b.y1-b.y0),C=new c.Mesh(d,new c.MeshBasicMaterial({color:pe,fog:!1,toneMapped:!1}));C.position.set(0,b.yc,A),C.name="behind-the-opening",m.add(C);const x={x0:5.5,x1:8.8,y0:11,y1:22,z0:.8,z1:4.4,n:12,wing:.3},I=[],R=[],k=[],r=[],u=[],p=[];for(let l=0;l<x.n;l++){const i=l%2?1:-1,y=.4+.9*a(),g=.5+1.4*a(),S=.4+1*a(),L=i*(x.x0+y+a()*(x.x1-x.x0-2*y)),T=x.y0+g+a()*(x.y1-x.y0-2*g),N=x.z0+S+a()*(x.z1-x.z0-2*S),D=[a()*6.283,a()*6.283,a()*6.283,a()],P=I.length/3;for(const G of[-1,1])for(const U of[[0,.16],[G*x.wing,.2],[G*x.wing*.8,-.14],[0,-.1]])I.push(0,0,0),R.push(L,T,N),k.push(y,g,S),r.push(...D),u.push(U[0],U[1]);p.push(P,P+1,P+2,P,P+2,P+3,P+4,P+6,P+5,P+4,P+7,P+6)}const t=new c.BufferGeometry;t.setAttribute("position",new c.Float32BufferAttribute(I,3)),t.setAttribute("aC",new c.Float32BufferAttribute(R,3)),t.setAttribute("aA",new c.Float32BufferAttribute(k,3)),t.setAttribute("aPh",new c.Float32BufferAttribute(r,4)),t.setAttribute("aQ",new c.Float32BufferAttribute(u,2)),t.setIndex(p),t.boundingSphere=new c.Sphere(new c.Vector3(0,b.yc+1.5,2.5),10);const s=new c.ShaderMaterial({uniforms:{...c.UniformsUtils.clone(c.UniformsLib.fog),uTime:o.uTime,uBreath:o.uBreath,uLampCol:o.uLampCol,uSky:o.uSky},fog:!0,side:c.DoubleSide,vertexShader:`
      attribute vec3 aC, aA; attribute vec4 aPh; attribute vec2 aQ; uniform float uTime; varying float vWing;
      #include <fog_pars_vertex>
      void main(){
        vec3 w = vec3(.7, .9, .55) * (.8 + .5 * aPh.w), c = aC + aA * sin(uTime * w + aPh.xyz), vel = aA * w * cos(uTime * w + aPh.xyz);
        vec3 f = normalize(vel + vec3(1e-3, 0., 0.)), s = normalize(cross(f, vec3(0., 1., 0.)) + vec3(0., 0., 1e-3)), up = cross(s, f);
        float flap = sin(uTime * (17. + 6. * aPh.w) + aPh.x * 9.);
        vec3 p = c + f * aQ.y + s * (aQ.x * cos(flap)) + up * (abs(aQ.x) * sin(flap));
        vWing = abs(aQ.x) * 3.;
        vec4 mvPosition = viewMatrix * modelMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uBreath; uniform vec3 uLampCol, uSky; varying float vWing;
      #include <fog_pars_fragment>
      void main(){
        vec3 pale = vec3(.82, .8, .74) * (.75 + .25 * clamp(vWing, 0., 1.));
        gl_FragColor = vec4(pale * (uSky * .5 + uLampCol * 1.5 * uBreath), 1.);
        #include <fog_fragment>
      }`}),h=new c.Mesh(t,s);h.name="moths",m.add(h);const n=new c.Vector3(0,b.yc,0);return{object:m,radius:20,height:M.ridge,center:n,light:o,mason:e,mothBox:x,anchors:{window:new c.Vector3(0,b.yc,-M.wall),windowNormal:new c.Vector3(0,0,1),lineStart:new c.Vector3(0,b.yc,60-M.wall),leafClear:b.hw,chimneys:E},update(l,i){o.uTime.value=i,o.uBreath.value=Me(i)},ground:!0,groundY:0}}export{ce as DRY,pe as GOLD,de as GUST_GLSL,he as HOUSE,fe as KEY_AZ,re as KEY_DIR,ue as KEY_EL,Pe as LAMP_BAKE,H as PAL,ye as SKIN_GLSL,O as SURF,se as WIN,me as bar,Me as breathAt,Ee as buildHero,qe as dryReach,j as frontWash,Te as linear,be as makeLight,Ae as makeMason,ke as stoneMaterial};
