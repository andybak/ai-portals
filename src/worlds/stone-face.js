import*as l from"three";import{makePath as Ha}from"../kit/core.js";import{buildDevice as _a,makeShared as Ia,makeMaterials as Ka,makeRibbon as Na,Rig as Ct,GLSL_COMMON as I,GLSL_HOLE as Oa,LEN as y,DUR as ce,EYE as Xe,POLE_DZ as Ft}from"../parts/stone-face.js";const Ye=Math.PI/180,j={x0:10.67,d0:438,x1:4.62,d1:470.75,paling:471,side:13,door:{z:-490.1,parts:[[2.64,6.09,0,4.55],[2.64,4.785,4.55,5.42],[-1,3.84,4.96,5.84],[-1,3.99,5.84,7.61,.444],[3.3,6.7,5.4,11.2],[3.95,6.05,11.2,11.95]]}},m=g=>new l.Color(g),Za=`
  uniform vec2 uRake; uniform float uCloud; uniform float uCsK; uniform vec3 uPaint; uniform vec3 uShut; uniform vec3 uCream; uniform vec3 uSlate; uniform vec3 uStraw; uniform vec3 uDeep; uniform vec3 uDust;
  varying vec3 vN; varying vec2 vL; varying vec4 vI; varying float vD; varying float vFace; varying vec3 vW; varying float vAw; varying float vCz;
  float bx(vec2 p, vec2 c, vec2 h) { vec2 d = abs(p - c) - h; return max(d.x, d.y); }
  float hh(float x) { return fract(sin(x * 91.7 + 1.3) * 4375.85); }
  float doorX(float w, float k2, float k3) { return (k3 > .6 ? w * .24 : 0.) * (k2 > .5 ? 1. : -1.); }
  float openings(vec2 p, float w, float h, float k2, float k3) {
    float dx = doorX(w, k2, k3);
    float m = bx(p, vec2(dx, 1.2), vec2(.62, 1.2));
    float one = bx(p, vec2(-dx * .8, 1.75), vec2(w * .21, .85));
    float two = bx(vec2(abs(p.x), p.y), vec2(w * .29, 1.75), vec2(w * .115, .85));
    m = min(m, k3 > .6 ? one : two);
    float n = w > 8.6 ? 3. : 2., sp = w / n, hf = (n - 1.) * .5;
    float xi = p.x - sp * clamp(floor(p.x / sp + (n > 2.5 ? .5 : 0.)) + (n > 2.5 ? 0. : .5), -hf, hf);
    m = min(m, bx(vec2(xi, p.y), vec2(0., 5.3), vec2(.52, .85)) + step(h, 7.1) * 9.);
    return m;
  }
  void main() {
    vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); float w = vI.x, h = vI.y, sd = vI.z, y0 = vI.w, yA = vL.y + y0;
    float k2 = fract(sd * 17.31), k3 = fract(sd * 71.7), k4 = fract(sd * 131.9), k5 = fract(sd * 233.3);
    bool trimBox = y0 > .5; bool face = vFace > .5 && !trimBox;
    // a painted town: white and cream most of all, then butter, slate and blue, a few rose and brick fronts (none of those near the red sign
    // that comes for us); the mix leans a different way in each block of the street, so the street changes as it goes by
    float blk = floor(-vCz / 62.), lean = fract(blk * .37 + .2), kp = fract(k5 + lean * .45), far = step(104., -vCz) * step(-vCz, 322.), calm = step(322., -vCz);
    vec3 paint = uPaint;
    if (kp > .30) paint = uCream;
    if (kp > .46) paint = vec3(.84, .77, .58);          // butter, light enough to stay yellow on the shade side
    if (kp > .60) paint = vec3(.30, .40, .55);
    if (kp > .74) paint = vec3(.17, .36, .70);
    if (kp > .84) paint = mix(vec3(.44, .55, .7), uCream, 1. - far);
    if (kp > .94) paint = mix(vec3(.13, .22, .42), uPaint, 1. - far);          // (second pass) deep blue where a brick-red front stood: red is the sign's and the curtain's
    { float th = mod(blk, 5.), tk = step(fract(k5 * 7.3 + k4 * 3.1), .56) * (1. - calm);
      vec3 themeC = th < .5 ? uPaint : (th < 1.5 ? vec3(.85, .78, .6) : (th < 2.5 ? vec3(.36, .5, .7) : (th < 3.5 ? mix(uCream, vec3(.5, .63, .82), far) : uSlate * 1.05)));
      paint = mix(paint, themeC, tk); }
    paint = mix(paint, uCream, calm * step(.46, kp) * step(kp, .60));          // by the hotel even the butter fronts are cream: the curtain is the one warm thing
    float darkP = step(dot(paint, vec3(.33)), .4);
    vec3 trim = mix(mix(uPaint * 1.05, uCream * .96, step(.5, k4)), uPaint * 1.08, darkP);
    vec3 shut = mix(uShut, uDeep, step(.87, k2)); shut = mix(shut, uSlate * .66, step(k2, .3)); shut = shut * 1.3 + vec3(.03, .025, .01);
    shut = mix(shut, mix(uCream * .95, vec3(.82, .76, .6), step(.7, k2) * far), darkP * step(.35, k2));          // butter shutters, not red
    shut = mix(shut, vec3(.16, .3, .2), step(.8, k4) * (1. - darkP));          // a few bottle-green doors and shutters on the pale fronts
    vec3 band = mix(uSlate * .9, uCream * .9, step(.4, k3)); band = mix(band, uShut * 1.1, step(.86, k3));
    band = mix(band, vec3(.82, .76, .6), step(.55, k4) * step(k4, .75)); band = mix(band, vec3(.08, .22, .56), step(.75, k4));
    band = mix(band, uPaint, darkP * step(k3, .5));
    band = mix(band, uSlate * .9, calm * step(.55, k4) * step(k4, .75));
    float near = 1. - smoothstep(30., 85., vD), close = 1. - smoothstep(10., 30., vD);
    // clapboard: each board a shade of its own, a shadow line under its lap, nail heads close to
    float bf = fract(yA / .19), bi = floor(yA / .19);
    vec3 alb = trimBox ? trim : paint;
    float lapL = mix(.95, (.99 + .05 * bf) * (1. - .3 * (1. - smoothstep(.0, .13, bf))) * (.965 + .07 * hh(bi + sd * 50.)), near);
    float streak = hh(floor(vL.x * 7.) + sd * 9.) * hh(floor(vL.x * 2.3) + 4.);
    alb *= lapL * (1. - .07 * streak * near);
    alb *= 1. - .25 * close * step(abs(fract(vL.x / .62) - .5), .012) * step(abs(bf - .55), .07);
    float sh = 0.;
    if (face) {
      float m = openings(vL, w, h, k2, k3), dx = doorX(w, k2, k3);
      // fascia over the shop floor, corner boards, frieze with dentils, water table
      float fasc = step(abs(vL.y - 3.6), .3);
      alb = mix(alb, band * (1. - .14 * step(.25, abs(vL.y - 3.6))), fasc);
      float cb = step(w * .5 - .17, abs(vL.x));
      alb = mix(alb, trim, cb); alb *= 1. - .22 * step(w * .5 - .025, abs(vL.x));
      float fr = step(h - .52, vL.y);
      alb = mix(alb, trim * (1. - .2 * step(.5, fract(vL.x / .3)) * step(vL.y, h - .26) * step(h - .46, vL.y) * near), fr);
      alb = mix(alb, trim * .86, step(vL.y, .3));
      // a painted shape where a low front has no upper windows: plain, no lettering
      if (h < 7.1) { vec2 q = (vL - vec2(0., 5.0)) / vec2(w * .3, .52); float e = k2 > .5 ? length(q) - 1. : max(abs(q.x), abs(q.y)) - .9;
        alb = mix(alb, mix(band, trim, step(-.16, e)), step(e, 0.)); }
      // casings, then what is in them: louvred shutters, a panelled door
      alb = mix(alb, trim * 1.02, step(m, .11) * step(0., m));
      alb *= 1. - .18 * step(abs(m - .11), .012) * near;
      if (m < 0.) {
        vec2 dl = vL - vec2(dx, 1.2); bool door = abs(dl.x) < .62 && abs(dl.y) < 1.2;
        float lf = fract(vL.y / .105);
        vec3 lou = shut * mix(.9, (.7 + .42 * lf) * (1. - .25 * step(lf, .22)), near);
        lou = mix(lou, shut * 1.12, step(-.075, m));                                  // the stile round each leaf
        vec3 dr = shut * .92; float pan = min(bx(dl, vec2(0., .5), vec2(.4, .5)), bx(dl, vec2(0., -.62), vec2(.4, .4)));
        dr *= 1. - .22 * step(pan, 0.) + .2 * step(abs(pan - .02), .02) * near; dr = mix(dr, uCream * 1.1, step(length(dl - vec2(.47, -.1)), .045) * near);
        alb = door ? dr : lou;
        // the casing's own shadow into the recess
        sh = max(sh, step(0., openings(vL + vec2(-uRake.x, uRake.y) * .045, w, h, k2, k3)));
      } else {
        sh = max(sh, step(openings(vL + vec2(-uRake.x, uRake.y) * .075, w, h, k2, k3), .11) * step(.11, m));
      }
      // fascia, frieze and cornice shadows, and the whole shop floor under an awning
      sh = max(sh, step(vL.y, 3.3) * step(3.3 - .08 * uRake.y, vL.y));
      sh = max(sh, step(h - .52 - .05 * uRake.y, vL.y) * step(vL.y, h - .52));
      sh = max(sh, step(h - .22 * uRake.y, vL.y));
      float t = (3.4 - vL.y) / max(uRake.y, .1);
      sh = max(sh, vAw * step(0., t) * step(t, 1.4) * step(abs(vL.x - t * uRake.x), (w - 1.1) * .5));
      // road dust thrown up the foot of the wall
      alb = mix(alb, uDust, (1. - smoothstep(.0, 1.5, vL.y)) * .5);
    }
    float sunny = step(.5, vFace) * step(0., vN.x * uSun.x);
    float nl = n.y > .5 ? uSun.y : sunny * (1. - sh) * 1.0;
    // the side of the street turned from the sun is in decided blue shade, lit from the sky and, low down, from the sunlit road
    vec3 sky = uSkyC * (n.y < -.5 ? .2 : .64) * mix(.84, 1.06, smoothstep(0., 8., yA)) * mix(vec3(1.), vec3(.66, .7, .8), step(.5, vFace) * (1. - sunny));
    vec3 bounce = uGndC * (max(n.z, 0.) * 1.6 + abs(n.x) * .34 * mix(1.8, .4, smoothstep(0., 6., yA)) + max(-n.y, 0.) * 3.);
    vec3 c = alb * (uSunC * nl + sky + bounce);
    // the torn clouds' shade, the same patches the road carries, climbing the fronts as they race down the street
    vec2 gp = vW.xz - uSun.xz * (vW.y / max(uSun.y, 1e-3));
    c = mix(c, c * vec3(.5, .62, .95), sfShade(gp, uCloud) * uCsK * .9 * mix(.3, 1., sunny * (1. - sh)) * smoothstep(7., 22., vD));
    gl_FragColor = vec4(sfFog(c, vD), 1.); }`,fe=249.6,ve=280.4,da=8.62,he=11.62,Mt=6.6,ma=`
float sfSlat(float z, float fp) {
  float P = 2.2, q = z / P, i = floor(q), t = abs(fract(q) - .5) * P, hh = fract(sin(i * 91.7) * 4375.85);
  float hw = .5 + .24 * hh;
  float cov = clamp((hw - t) / max(fp, 1e-3) + .5, 0., 1.) * step(.11, hh);
  return mix(cov, .5, smoothstep(.3 * P, .8 * P, fp)); }
`,ja=`
#define HALL_Z0 ${fe.toFixed(2)}
#define HALL_Z1 ${ve.toFixed(2)}
#define HALL_RIDGE ${he.toFixed(2)}
#define HALL_SLOPE ${((he-da)/Mt).toFixed(4)}
#define HALL_HALF ${Mt.toFixed(2)}
`,Dt=`
  float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h2(i), h2(i + vec2(1., 0.)), f.x), mix(h2(i + vec2(0., 1.)), h2(i + vec2(1., 1.)), f.x), f.y); }`,$e=`
  vec4 sfCloud(vec2 q, float big) {
    q.x += .95;                                          // no cell border on the street's axis: the sky is not a mirror
    vec2 cs = vec2(2.6, 3.4), cell = floor(q / cs), f = q / cs - cell - .5;
    float thr = .5 - .34 * big, has = smoothstep(thr, thr + .06, h2(cell + 7.3));
    float edge = smoothstep(.5, .3, abs(f.x)) * smoothstep(.5, .3, abs(f.y));   // a cloud thins out toward the border of its cell: no cut edges
    vec2 o = (vec2(h2(cell), h2(cell + 3.1)) - .5) * .4; f -= o;
    float sz = (.7 + .5 * h2(cell + 11.9)) * (1. + .85 * big);
    float body = 1. - length(f * vec2(2.4, 4.4) / sz);
    float torn = vn(q * 2.3 + 5.) * .5 + vn(q * 5.9 + 1.7) * .28 + vn(q * 13.1) * .15 + vn(q * 29.) * .07;
    return vec4(body * .95 + torn - .52 - (1. - edge) * .9, has, f); }
  // the shade those clouds lay on the street: patches a block long with ragged hard edges, racing at us with the gale. gp is the point carried
  // down the sun to the ground; returns how deep in shade it is (0..1)
  // (a cloud's shadow has a wide soft edge; and none lies on the first block of the street: we arrive in full sun)
  float sfShade(vec2 gp, float uc) { vec4 cs = sfCloud(vec2(gp.x / 12. + 3.05, gp.y / 9. - uc * 3.4 + 1.15), .62);
    // (polish2) torn clouds throw torn shade: the sun breaks through it in ragged patches a few metres across that travel with the cloud, so the
    // road under a cloud is a pattern of sun and blue, never one flat tone
    float holes = vn(vec2(gp.x / 12., gp.y / 9. - uc * 3.4) * 3.3 + 7.3) * .7 + vn(vec2(gp.x / 12., gp.y / 9. - uc * 3.4) * 8.1 + 2.) * .3;
    return smoothstep(.0, .24, cs.x) * cs.y * (1. - smoothstep(-84., -48., gp.y)) * smoothstep(.36, .5, holes); }`;var ao={id:"stone-face",name:"Stone Face",category:"city",weirdness:.45,media:["open"],async build(g){const C=g.rng,V=g.quality?.detail??1,Qe=g.vary||{},A=C.chance(.5)?-1:1,At=C.chance(.4)?"barrels":"carts",Ce=C.pick(["hotel","hotel","opera","bank"]),Fe=Qe.hour==="golden"?!0:Qe.hour==="day"?!1:C.chance(.4),Lt=!!Qe.rare,Je=Fe?1:-1,et=(Fe?44:52)*Ye,ee=new l.Vector3(Je*Math.sin(18*Ye)*Math.cos(et),Math.sin(et),-Math.cos(18*Ye)*Math.cos(et)).normalize(),M=new l.Scene,G=Ia(ee),Me={value:new l.Vector2(800,450)};M.fog=new l.FogExp2(G.uFogC.value,G.uFogD.value);const Gt=new l.DirectionalLight("#FFF6E2",3);Gt.position.copy(ee).multiplyScalar(100),M.add(Gt),M.add(new l.HemisphereLight("#A9CBEE","#E9DFC8",.9));const Wt={value:new l.Vector4(0,-5,1,0)},te={value:.35},X={value:0},De={value:0},tt={value:0},ue={value:0},at={value:0},Ae={value:1},ot={value:0};await g.yield();const Bt=new l.ShaderMaterial({uniforms:{uTop:{value:m("#3F7FD0").multiplyScalar(.85)},uHor:{value:m("#C4DCF4").multiplyScalar(1.18)},uFogC:G.uFogC,uCloud:ue,uBig:at,uSun:G.uSun,uWin:{value:new l.Vector3(0,0,0)}},vertexShader:`
        varying vec3 vDir;
        void main() { vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.);
          if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:`
        uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uFogC; uniform float uCloud; uniform float uBig; uniform vec3 uSun; uniform vec3 uWin; varying vec3 vDir;
        float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
          return mix(mix(h2(i), h2(i + vec2(1., 0.)), f.x), mix(h2(i + vec2(0., 1.)), h2(i + vec2(1., 1.)), f.x), f.y); }
        `+$e+`
        void main() {
          vec3 d = normalize(vDir + vec3(0., 1e-5, 0.)); float y = max(d.y, 0.);
          vec3 c = mix(uHor, uTop, 1. - (1. - y) * (1. - y) * (1. - y));
          c = mix(c, uFogC, smoothstep(.2, -.02, d.y) * .9);
          // the piece of sky that stands behind the hotel (hidden by it, but for its one open window) is zenith blue, not horizon haze:
          // the window reads as a hole with sky in it from the far end of the street
          float inw = step(abs(d.x), -d.z * uWin.x) * step(d.y, -d.z * uWin.y) * step(0., d.y) * step(d.z, 0.) * min(uWin.z, 1.);
          // as the front comes over, the window looks up toward the sun's part of the sky: it blazes (uWin.z above 1), warm toward the sun's side
          vec3 wsky = mix(uTop, uHor, .2) * 1.32; float blaze = max(uWin.z - 1., 0.);
          wsky = mix(wsky, vec3(.5, .86, 1.7) + vec3(.3, .2, .02) * smoothstep(-.2, .6, d.x * sign(uSun.x) + d.y), blaze);
          c = mix(c, wsky, .9 * inw);
          // small torn clouds on a plane overhead: cells drifting +z (downwind, at us), most cells empty; each lit from the sun's side, blue beneath
          // high mare's tails, combed out along the wind: thin, bright, behind everything else in the sky and never in the hotel's window
          { vec2 qc = d.xz / max(d.y, .09); qc.y -= uCloud * .12; qc.x += qc.y * .22;      // combed a little across the street's axis, so they never point at the vanishing point
            float ci = vn(vec2(qc.x * 1.7 + vn(qc * vec2(.5, .3) + 3.) * 2.6, qc.y * .62)) * .6 + vn(vec2(qc.x * 4.9, qc.y * 1.7 + 7.)) * .4;
            ci = smoothstep(.52, .86, ci) * smoothstep(.42, .7, vn(qc * vec2(.31, .27) + 11.));
            c = mix(c, vec3(1.02, 1.03, 1.04), ci * .62 * smoothstep(.07, .22, d.y) * (1. - inw)); }
          // once the front is down the horizon is the sky's: a far bank of cumulus stands along it, lit from the sun's side, blue beneath, its foot lost
          // in the haze (uBig is 0 for the whole street: nothing ever stands behind the hotel or in its window)
          { float az = d.x / max(-d.z, .25), el = d.y;      // ahead of us only; no atan
            float top = .05 + .13 * vn(vec2(az * 2.1 + 4., 0.)) + .07 * vn(vec2(az * 6.3, 3.)) + .03 * vn(vec2(az * 19., 7.)) + .012 * vn(vec2(az * 53., el * 60.));
            top *= uBig * 2.05 * (.3 + .7 * smoothstep(.04, .5, abs(az)));            // lower straight behind the door, so the door stands against blue
            float in1 = smoothstep(top, top - .012, el);
            float lit = smoothstep(-.02, .05, el - top * (.45 + .25 * vn(vec2(az * 9., 1.))) + .03 * sign(uSun.x) * sin(az * 23. + vn(vec2(az * 5., 2.)) * 4.));
            vec3 bc = mix(vec3(.5, .62, .86), vec3(1.07, 1.03, .96), lit);   // (polish4) deeper blue on the bank's shade side: the white gate stands against modelled cloud
            bc = mix(uFogC * 1.02, bc, smoothstep(.0, .05, el));
            c = mix(c, bc, in1 * step(0., el) * step(d.z, -.05)); }
          vec2 q = d.xz / max(d.y, .05); q.y -= uCloud;
          vec4 cl = sfCloud(q, max(uBig, .72)); float dens = cl.x, has = cl.y; vec2 f = cl.zw;   // (polish4) .72: the street's torn clouds are a little larger and more of them, so no two stretches share one empty blue
          float n2 = vn(q * 5.9 + 1.7), n3 = vn(q * 13.1);
          float a = smoothstep(.1, .32, dens) * has * smoothstep(.05, .16, d.y);
          // thickness toward the middle; the side of each cloud turned to the sun is white, its belly the shade colour of the street
          float lit = smoothstep(-.25, .35, (f.x * uSun.x - f.y * .6) * 2.2 + (n2 - .5) * .9 + (n3 - .5) * .5);
          vec3 cc = mix(vec3(.55, .66, .84), vec3(1.06, 1.03, .97), lit) * mix(1., .9, smoothstep(.3, .9, dens) * (1. - lit));
          cc = mix(cc, c * 1.1, .35 * (1. - smoothstep(.1, .45, dens)));          // thin torn edges take the sky
          gl_FragColor = vec4(mix(c, cc, a * .95), 1.); }`,side:l.BackSide,depthWrite:!1,fog:!1}),st=new l.Mesh(new l.SphereGeometry(100,24,12),Bt);st.renderOrder=-1,st.frustumCulled=!1,M.add(st),await g.yield();const P=await _a(g,{shared:G,uRes:Me,sx:A,slot2:At,kind:Ce,rare:Lt,lotRun:j});M.add(P.object);const pa=P.front;await g.yield();const Y=new Ct;{const e=new l.PlaneGeometry(400,760,1,1);e.rotateX(-Math.PI/2),Y.addGeo(e,Y.mat(0,0,-260),m("#ffffff"))}const nt=m("#ffffff");for(const e of[-1,1])Y.box(13,.3,122,nt,e*11,.15,-55,0,0,0,!1),Y.box(13,.3,290,nt,e*11,.15,-269,0,0,0,!1),Y.box(11.8,.3,16,nt,e*11.6,.15,-422,0,0,0,!1);const de=new l.ShaderMaterial({uniforms:{...G,...P.frontU,uRoad:{value:new l.Color(.62,.5,.37)},uBoard:{value:m("#CDBFA6").multiplyScalar(.66)},uSunSide:{value:Je},uHat:Wt,uRes:Me,uDrift:tt,uGale:te,uCloud:ue,uBig:at,uTime:X,uSwing:De,uCsK:Ae,uLull:ot,tRoof:{value:null},tWash:{value:null},tLine:{value:null}},vertexShader:`
        varying vec3 vW; varying vec3 vN; varying float vD;
        void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normal;
          vec4 mv = viewMatrix * w; vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:I+Oa+ja+ma+`
        uniform float uTheta; uniform vec3 uSunF; uniform vec2 uHinge; uniform vec2 uWall; uniform vec3 uRoad; uniform vec3 uBoard; uniform vec3 uShadeC; uniform float uSunSide; uniform vec2 uRes; uniform float uDrift; uniform float uGale; uniform float uCloud; uniform float uBig; uniform sampler2D tRoof; uniform sampler2D tWash; uniform sampler2D tLine; uniform float uTime; uniform float uSwing; uniform float uCsK; uniform float uLull; uniform vec4 uHat;
        varying vec3 vW; varying vec3 vN; varying float vD;
        float h1(float x) { return fract(sin(x * 91.7) * 4375.85); }
        float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
          return mix(mix(h2(i), h2(i + vec2(1., 0.)), f.x), mix(h2(i + vec2(0., 1.)), h2(i + vec2(1., 1.)), f.x), f.y); }
        `+$e+`
        // THE ROAD IS A SURFACE: its height in metres. Two ruts with thrown-up lips, wheel tracks that swerve across the street, the hoof-pocked
        // middle, fine wind ripples close to, and the track the hat's rim scribes (hk: how much of that track there is here). wz: how wide a
        // thing must be drawn at this distance to stay wider than a pixel
        float hatX(float z) { return .15 * sin(uHat.w - (z - uHat.y) * .5784); }
        float rdH(vec2 p, float wz, float rip, float hk) {
          float ax = abs(p.x), h = 0., s2 = .007 + wz * wz;
          float a0 = abs(ax - .75); h += (-.05 * exp(-a0 * a0 / s2) + .024 * exp(-(a0 - .2) * (a0 - .2) / s2)) * .084 / sqrt(s2);
          for (int i = 0; i < 3; i++) { float fi = float(i);
            float xc = (3.1 - .5 * fi) * sin(p.y * (.058 + .023 * fi) + fi * 2.1) + .5 * sin(p.y * .19 + fi * 5.);
            float d1 = abs(abs(p.x - xc) - .7);
            h += (-.016 * exp(-d1 * d1 / s2) + .007 * exp(-(d1 - .17) * (d1 - .17) / s2)) * .084 / sqrt(s2); }
          vec2 sc = vec2(2.6, 2.1), c = floor(p * sc), f = fract(p * sc) - .5; float k = h2(c + 3.3);
          vec2 o = (vec2(h2(c + 1.1), h2(c + 7.7)) - .5) * .5; float r = length((f - o) * vec2(1., 1.3));
          h -= .034 * step(.5, k) * (1. - smoothstep(2.2, 3.6, ax)) * exp(-r * r / .016) * rip;
          h += .005 * sin(p.y * 23. + 3. * vn(p * vec2(1.4, .5)) + 1.4 * sin(p.x * 2.3)) * rip * smoothstep(.3, .62, vn(p * vec2(.45, .16) + 31.));
          float dt = abs(p.x - hatX(p.y)); h += (-.03 * exp(-dt * dt / .0009) + .012 * exp(-(dt - .06) * (dt - .06) / .0012)) * hk;
          return h; }
        // carry the fragment along the sun to the plane of the front: in shadow unless it misses the wall or lands in the window
        vec3 frontShadow(vec3 p) {
          float st = sin(uTheta), ct = cos(uTheta); vec3 n = vec3(0., -st, ct), w = vec3(0., ct, st), H = vec3(0., uHinge.x, uHinge.y);
          float dn = min(dot(uSunF, n), -1e-4); float t = dot(H - p, n) / dn; vec3 q = p + t * uSunF;
          vec2 wc = vec2(q.x, dot(q - H, w));
          float hd = sfHole(wc);
          float inW = step(0., t) * step(abs(wc.x), uWall.x) * step(0., wc.y) * max(step(wc.y, uWall.y), sfCrown(wc));   // (flight4) the wall's rectangle and, above it, its crown
          return vec3(inW * step(0., hd), max(hd, 0.), inW * step(hd, 0.));
        }
        // THE METRONOME ON THE GROUND: carry the fragment up the sun to the height of the washing lines; it is in shadow if it meets the line itself
        // or the cloth streaming from it. The cloth is a strip from the line, a (from straight down) round toward us: its shadow is a ragged rung
        // across the road every 30 m, thin while the gale holds the sheets near the sun's own slant, deep when they hang limp in the lull
        float washShadow(vec3 p, float dF) {
          float r = abs(uSun.z) / max(uSun.y, 1e-3), kx = uSun.x / max(uSun.y, 1e-3);
          float zq = p.z - r * (5.2 - p.y);
          vec4 li = texture2D(tLine, vec2((floor(-zq) + .5) / 512., .5));
          float none = step(.5, li.r), row = floor(li.r * 255. + .5), dL = floor(-zq) + li.g * 17. - 8.;
          float xq = p.x + kx * (5.2 - p.y), bowK = max(1. - xq * xq / 49., 0.);
          float yT = 5.5 - bowK * (.45 - .4 * uGale), zL = -dL + bowK * uGale * 1.3;
          zq = p.z - r * (yT - p.y); xq = p.x + kx * (yT - p.y);
          vec4 w = texture2D(tWash, vec2((xq + 6.4) / 12.8, (min(row, 15.) + .5) / 16.));
          float L = w.r * 255. / 60., sd = w.g;
          // (flight1) the shadow is taken from the cloth's own pose, with no factor laid on it: the same gust that lifts the line's washing (see
          // the cloth's vertex shader: one expression, here and there) widens its rung on the road. A point k of the way down a piece L long
          // stands L k from the line at ak = a (.6 + .4 k) from straight down, and its shadow falls L k (sin ak - r cos ak) toward us from the
          // line's own; the rung is the span of that over the piece (taken at the hem, at .6 and at .3), and its edge toward us is ragged by
          // the wave that runs down the cloth (.26 m at the hem in the full gale)
          float gust = .5 + .5 * sin(uTime * 1.3 + dL * .07 + 1.2 * sin(uTime * .7 + dL * .031));   // dL is the line's d (= -z): the same phase as the cloth's
          float a = smoothstep(0., .22, uGale) * (.66 + .36 * uGale + .1 * sin(uTime * 3.3 + sd * 17.) + (.2 + .2 * uGale) * gust) + uSwing * sin(uTime * (2.1 + 1.1 * sd) + sd * 9.);
          a = min(a, 1.45);
          float f1 = L * (sin(a) - cos(a) * r), f6 = L * .6 * (sin(a * .84) - cos(a * .84) * r), f3 = L * .3 * (sin(a * .72) - cos(a * .72) * r);
          float wv = .26 * uGale * (cos(a) + r * sin(a)) * (.5 + .5 * sin(xq * 9. + uTime * 11. + sd * 30.));
          float hi = max(max(f1, f6), 0.) + wv, lo = min(min(f1, f6), min(f3, 0.));
          float dz = zq - zL;
          float cloth = step(lo, dz) * step(dz, hi) * step(.05, L);
          float line = step(abs(dz), max(.03, dF * .0016)) * step(abs(xq), 7.);
          return max(cloth, line) * (1. - none);
        }
        // (polish3) the market hall's slatted roof, carried down the sun: a ladder of hard blue stripes over road and boardwalk
        float hallShadow(vec3 p, float fp) {
          float kx = uSun.x / max(uSun.y, 1e-3), kz = uSun.z / max(uSun.y, 1e-3);
          float h = 10.2, xq = p.x + kx * (h - p.y); h = HALL_RIDGE - HALL_SLOPE * abs(xq);
          xq = p.x + kx * (h - p.y); h = HALL_RIDGE - HALL_SLOPE * abs(xq);
          xq = p.x + kx * (h - p.y); float zq = p.z + kz * (h - p.y);
          return sfSlat(zq, fp) * step(abs(xq), HALL_HALF) * step(zq, -HALL_Z0) * step(-HALL_Z1, zq); }
        void main() {
          float dF = length(vW - cameraPosition);   // per fragment: the road is two huge triangles, and a distance interpolated across them is wrong
          vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); bool top = n.y > .5; bool board = vW.y > .2;
          float lot = smoothstep(-429., -436., vW.z);                       // past the hinge: the empty lot
          float close = 1. - smoothstep(5., 26., dF), mid = 1. - smoothstep(30., 110., dF);
          vec3 fs = frontShadow(vW); float fsh = fs.x * smoothstep(.3, .7, uTheta);   // under the falling front the road keeps its surface
          float g1 = vn(vW.xz * .31), g2 = vn(vW.xz * 1.7 + 9.), g3 = vn(vW.xz * 7.3), g4 = vn(vW.xz * 23.);
          // packed pale dust: trodden warm down the middle, looser and paler by the kerbs, grain and small stones close to
          vec3 alb = uRoad * (.9 + .13 * g1 + .07 * g2 * mid);
          alb *= mix(vec3(1.), vec3(1.05, 1., .9), smoothstep(4.5, 1., abs(vW.x)) * (1. - lot) * .6);
          // the street has been used: the middle is trodden darker and warmer, loose pale dust is banked along both kerbs, and old wheel tracks
          // wander down it beside the two that are the centre line
          float road = step(vW.y, .1) * (1. - lot), axx = abs(vW.x);
          alb *= mix(vec3(1.), vec3(.9, .86, .78), smoothstep(3.6, .8, axx) * road * (.6 + .4 * g1));
          alb = mix(alb, uRoad * vec3(1.22, 1.2, 1.14), smoothstep(3.1, 4.4, axx + (g1 - .5) * 1.6) * road * .75);
          { float fw = max(.07, dF * 1.3 / max(uRes.y, 1.)), tr = 0.;
            for (int i = 0; i < 3; i++) { float fi = float(i), x0 = 1.55 + fi * .82 + 1.1 * (vn(vec2(vW.z * .037 + fi * 7.3, fi * 3.1 + sign(vW.x))) - .5);
              tr = max(tr, (1. - smoothstep(fw * .5, fw, abs(axx - x0))) * (.45 + .55 * vn(vec2(vW.z * .09, fi * 9. + sign(vW.x) * 2.)))); }
            alb *= 1. - .09 * tr * road * min(1., .07 / fw * 2.2); }
          alb *= 1. + (.1 * (g3 - .5) + .13 * (g4 - .5)) * close;
          // combed by wheels and wind along the street: long streaks, fine across and slow along, so they hold at a grazing angle where grain cannot
          float comb = vn(vec2(vW.x * 4.3, vW.z * .23 + 3.)) * .55 + vn(vec2(vW.x * 11., vW.z * .6)) * .3 + vn(vec2(vW.x * 27., vW.z * 1.4)) * .15 * close;
          alb *= 1. + (comb - .5) * (.05 + .1 * fsh) * (1. - smoothstep(40., 90., dF)) * step(vW.y, .1) * (1. - lot);
          vec2 pc = floor(vW.xz * 5.), pf = fract(vW.xz * 5.) - .5; float ph = h2(pc);
          float pd = length(pf - (vec2(h2(pc + 1.7), h2(pc + 2.9)) - .5) * .5), pr = .05 + .11 * h2(pc + 5.3);
          float peb = step(.92, ph) * (1. - smoothstep(pr * .5, pr, pd));
          float pcl = 1. - smoothstep(3.5, 13., dF);
          alb *= 1. - .34 * peb * pcl * step(vW.y, .1);
          alb *= 1. + .16 * step(.92, ph) * (1. - smoothstep(pr, pr * 1.7, length(pf - (vec2(h2(pc + 1.7), h2(pc + 2.9)) - .5) * .5 + vec2(-.03, .05)))) * (1. - peb) * pcl * step(vW.y, .1);
          // wind ripples across the lot, at right angles to the breeze
          // the lot: wind-rippled dust in low relief at three scales, each fading out where it would be finer than a pixel: sun on the crests, blue in the troughs
          float fp = dF * dF / (1.41 * max(uRes.y, 1.));
          float wob = vn(vW.xz * vec2(.35, .12)) * 6.283;
          float r1 = sin(vW.z * 10.5 + wob * 1.6 + 2.5 * vn(vW.xz * vec2(1.3, .3)));
          float r2 = sin(vW.z * 2.6 + wob + 3. * g1);
          float r3 = sin(vW.z * .7 + vW.x * .12 + 4. * vn(vW.xz * .07));
          float rel = r1 * .5 * (1. - smoothstep(.06, .2, fp / .6)) + r2 * .36 * (1. - smoothstep(.06, .2, fp / 2.4)) + r3 * .2 * (1. - smoothstep(.06, .2, fp / 9.)) + (g1 - .5) * .5 + (vn(vW.xz * vec2(.11, .05) + 20.) - .5) * .7;
          alb *= mix(vec3(1.), vec3(1.) + (rel > 0. ? vec3(.24, .2, .12) : vec3(.42, .32, .12)) * rel, lot * step(vW.y, .1));
          alb *= mix(vec3(1.), vec3(1., .9, .72), lot * step(vW.y, .1));
          // two wheel ruts 1.5 m apart: the centre line, drawn on the ground (never thinner than ~1.5 px), each with a pale thrown-up lip
          float rw = max(.11, dF * 1.6 / max(uRes.y, 1.)), ax = abs(abs(vW.x) - .75 - .035 * (vn(vec2(vW.z * .21, 2.)) - .5) * close);
          float rut = 1. - smoothstep(rw * .5, rw, ax), lip = (1. - smoothstep(rw, rw * 2.4, ax)) * (1. - rut);
          float rk = step(vW.y, .1) * min(1., .11 / rw * 1.6);
          alb *= 1. - vec3(.3, .27, .2) * (1. + .4 * g3 * close) * rut * rk; alb *= 1. + .09 * lip * rk;
          // (second pass) THE PACE, UNDERFOOT: a plank crossing laid across the street every 17 m, from kerb to kerb (the washing lines count the
          // pace overhead, these count it on the ground: one goes under the hat every 1.4 s, at the speed we have kept from the start). Flat on
          // the road, 4 cm thick: weathered silver boards laid along the street, ragged at their ends, one missing here and there, dust drifted
          // over them and worn through where the two ruts cross; the end of every board that faces us is a line of blue shade
          // (none at d 180.7, where the ladder slaps down flat round the hat: nothing lies under a hazard that could be taken for part of it; none past d 402)
          float plSh = 0., onPl = 0.;
          { float cd = -vW.z, ck = floor((cd - 10.7) / 17. + .5), zc0 = cd - (10.7 + 17. * ck);
            float bxp = vW.x / .34, bip = floor(bxp), bfp = fract(bxp), bhp = h1(bip * 1.37 + ck * 7.1), bh2 = h1(bip * 5.71 + ck * 3.3);
            float halfL = 1.02 + .24 * (bhp - .5), zc = zc0 + (bh2 - .5) * .34;
            float cOn = step(-.5, ck) * step(ck, 23.5) * step(.5, abs(ck - 10.)) * road * step(abs(vW.x), 4.42) * step(.1, bhp);
            float inB = cOn * step(abs(zc), halfL);
            float pxw = dF * 1.4 / max(uRes.y, 1.);                                    // a pixel, in metres, here
            float gapK = 1. - smoothstep(.05, .16, pxw);
            float gap = (1. - smoothstep(.012 + pxw * .5, .03 + pxw, min(bfp, 1. - bfp) * .34)) * gapK;
            vec3 pl = mix(vec3(.4, .3, .19), vec3(.34, .29, .22), step(.6, bh2)) * (.72 + .56 * bhp);
            pl *= 1. + (.16 * (vn(vec2(vW.x * 31., vW.z * 2.1 + bip)) - .5) + .1 * (g3 - .5)) * close;      // grain along each board
            pl = mix(pl, vec3(.1, .12, .17), .8 * gap);
            pl *= 1. - .3 * close * step(length(vec2((bfp - .5) * .34, (abs(zc) - halfL + .12))), .022);          // a nail at each end
            float worn = 1. - smoothstep(.1, .34, abs(abs(vW.x) - .75));                            // the ruts have cut through: dust in the notches
            float dustC = clamp(smoothstep(.66, .9, vn(vW.xz * vec2(.8, 1.5) + ck * 9.) * .7 + g2 * .3) + .6 * worn, 0., 1.);
            alb = mix(alb, pl, inB * (1. - .9 * dustC));
            plSh = cOn * step(halfL, -zc) * step(-zc, halfL + max(.07, pxw * 1.3)) * (1. - .9 * worn) * min(1., .14 / max(pxw, 1e-3)); onPl = inB; }
          // the gale: pale dust streaming down the street at us, frozen and gone when the wind stops
          float wz = vW.z - uDrift;
          float wn = vn(vec2(vW.x * 1.1 + vn(vec2(wz * .05, 3.)) * 2.5, wz * .06)) * .62 + vn(vec2(vW.x * 2.9, wz * .15)) * .38;   // long thin streaks down the street
          // (second pass) THE GALE GROWS ON THE ROAD: a few thin streamers in the breeze we arrive in, broad rivers of blown dust by the poles;
          // none down the middle (the hat's pale crown stands against the trodden road, not against blown dust)
          float wthr = mix(.56, .4, smoothstep(.35, 1., uGale));
          float wisp = smoothstep(wthr, wthr + .16, wn) * smoothstep(.55, 1.5, abs(vW.x));
          float gk = min(1., uGale * 4.) * step(vW.y, .1);
          alb = mix(alb * .93, uRoad * vec3(1.4, 1.42, 1.42), wisp * gk * (.5 + .32 * uGale - .08 * lot));
          if (board) {
            float pz = vW.z / .3, pi = floor(pz), pfz = fract(pz);
            float gap = 1. - (1. - smoothstep(.0, .07, pfz)) * .45 * (1. - smoothstep(30., 70., dF));
            alb = uBoard * (.8 + .22 * h1(pi)) * gap * (.93 + .14 * vn(vec2(vW.x * 9., pi * 3.7)) * close);
            alb *= 1. - .3 * close * step(length(vec2(abs(abs(vW.x) - 5.75) - 1.1, (pfz - .5) * .3)), .018);     // nail heads
            alb *= 1. - .2 * step(abs(vW.x), 4.62);                                                            // the kerb board
            alb = mix(alb, uRoad * .95, .35 * smoothstep(5.3, 4.5, abs(vW.x)) * g2);                             // dust blown onto the boards
          }
          if (!top) alb = uBoard * (.72 + .1 * step(.5, fract(vW.z / 2.4)));
          // shadows: the true roofline of the row on the sun side (cornices, pediments, the gaps of the alleys), and the falling front
          float k = abs(uSun.x) / max(uSun.y, 1e-3), xr = uSunSide * vW.x;
          float bk = texture2D(tRoof, vec2((-vW.z - 2.) / 430., .5)).b * 255. / 16.;       // the square: the sun-side row stands back here
          float hN = max(7. + bk - xr, 0.) / max(k, 1e-3) + vW.y;
          float d0 = -(vW.z - (hN - vW.y) * abs(uSun.z) / max(uSun.y, 1e-3));
          vec4 rf = texture2D(tRoof, vec2(d0 / 430., .5)); float roof = (uSunSide < 0. ? rf.r : rf.g) * 255. / 16.;
          float rowSh = step(hN, roof) * step(0., d0 + 4.) * step(d0, 430.) * step(xr, 7.5 + bk) * step(0., xr + 20.);
          float hallSh = hallShadow(vW, dF * dF / (1.41 * max(uRes.y, 1.)));
          float sh = 1. - max(max(max(rowSh, fs.x), max(washShadow(vW, dF) * (1. - lot), plSh)), hallSh);
          alb *= mix(vec3(1.), vec3(.6, .72, .98), hallSh);
          // relief, lit from ahead: every wall of a rut or a hoof mark that faces the lens is in blue shade, its far side takes the sun
          float relief = 1.;
          { float flat0 = step(vW.y, .1), rk = (1. - smoothstep(16., 46., dF)) * flat0;
            float wz = dF * 1.1 / max(uRes.y, 1.), rip = 1. - smoothstep(3.5, 8.5, dF);
            float sT = vW.z - uHat.y, hk = step(-.06, sT) * (1. - smoothstep(5., 15., sT)) * uHat.z * flat0 * (1. - onPl);
            vec2 sh2 = normalize(uSun.xz + vec2(1e-5, 0.));
            float h0 = rdH(vW.xz, wz, rip, hk), h1 = rdH(vW.xz + sh2 * .035, wz, rip, hk), dh = (h1 - h0) / .035;
            float road2 = mix(step(abs(vW.x), 4.5), 1., lot);
            float hkOnly = hk * exp(-(vW.x - hatX(vW.z)) * (vW.x - hatX(vW.z)) / .02);
            float on = max(road2, hkOnly) * rk;
            relief = clamp(1. - 1.7 * dh * on, .3, 1.55);
            alb *= 1. + clamp(h0 * 5., -.3, .12) * on;
            // the spurt of dust the hat's rim throws back toward us from where it touches
            float fan = step(0., sT) * (1. - smoothstep(.0, 1.1, sT)) * (1. - smoothstep(.03 + .22 * sT, .06 + .3 * sT, abs(vW.x - hatX(vW.z)))) * uHat.z * flat0;
            alb = mix(alb, uRoad * vec3(1.42, 1.4, 1.34), fan * .7); }
          vec3 c = sfLit(alb, n, top ? relief : 1.);
          // in shadow the surface is kept and, under the front, drawn harder: grain, pebbles and planks in cool light, the rut lips picked out by
          // the bounce from the patch of sun, and the whole road a little paler toward that patch
          vec3 dtl = board ? alb / max(uBoard, vec3(1e-3)) * vec3(1.2, 1.08, .86) : alb / max(uRoad, vec3(1e-3));
          dtl = max(vec3(1.) + (dtl - 1.) * (1. + (board ? .6 : 1.2) * fsh), vec3(.66));
          float patchK = fsh * exp(-fs.y * .55);
          vec3 shadeC = uShadeC * mix(vec3(1.), vec3(.9, .97, 1.1), fsh) * dtl * (1. + .14 * patchK) + vec3(.07, .09, .12) * lip * rk * fsh * (.5 + patchK);
          // shadows are blue, never olive: the hazards' shadows are MIN-blended over the road in a blue darker than any sunlit grain of it (see
          // makeMaterials); the one channel a warm dark rut could still undercut is its blue, so that is given a floor just under the shadow's
          if (top) { c.b = max(c.b, .165); c = mix(shadeC, c, sh); }
          c *= 1. + vec3(.16, .13, .06) * fs.z * smoothstep(.3, .7, uTheta);   // the beam through the window: the warmest, brightest ground there is
          // the torn clouds' soft blue shadows slide over the lot toward us (the same field the sky draws, carried down the sun)
          vec4 cl = sfCloud((vW.xz - cameraPosition.xz) / 12. + uSun.xz / max(uSun.y, 1e-3) - vec2(0., uCloud * 3.), uBig);
          c = mix(c, c * vec3(.5, .64, 1.), smoothstep(.06, .42, cl.x) * cl.y * lot * .7 * (top ? 1. : 0.));
          // and down the street the same torn clouds throw patches of blue shade that race at us with the gale (gone once the front starts to come)
          c = mix(c, c * vec3(.37, .56, 1.14), sfShade(vW.xz, uCloud) * (1. - lot) * uCsK * .9 * sh);   // (a torn cloud's shade thins out as it reaches us: the road by the lens is always in sun)
          // the blown dust stands a little off the road, and the sun is beyond it: seen along the street each streamer is a veil of light, thin
          // by the lens and deep toward the far end, deeper as the gale rises; in a shadow it is blue. In the lull the dust hangs, a still even veil
          { float lit = top ? sh : 1.;
            float tauG = wisp * gk * (1. - lot) * (.012 + .085 * uGale * uGale) * min(dF, 46.);
            float tauL = uLull * (1. - lot) * step(vW.y, .1) * (.45 + .55 * vn(vW.xz * vec2(.21, .05) + 40.)) * .0045 * max(min(dF, 70.) - 8., 0.);
            float veil = 1. - exp(-(tauG + tauL));
            vec3 dustC = mix(uShadeC * 1.5, uSunC * vec3(.98, .9, .72) * (.82 + .2 * wn), lit * (1. - .8 * sfShade(vW.xz, uCloud) * uCsK));
            c = mix(c, dustC, veil * (top ? 1. : 0.)); }
          gl_FragColor = vec4(sfFog(c, dF), 1.); }`});Y.build(de,de),Y.set(new l.Matrix4),M.add(Y.mesh),await g.yield();const K=[],me={"-1":new Float32Array(1024),1:new Float32Array(1024)},pe=[],xa={"-1":[[116,124],[190.5,193.5]],1:[[116,124],[234.5,237.5]]},lt=9,E=[1e9,-1e9];for(const e of[-1,1]){const t=xa[String(e*-A)],s=[[-4,t[0][0]],[t[0][1],t[1][0]],[t[1][1],414],[414,430]];for(const[o,i]of s){const r=Math.max(1,Math.round((i-o)/C.range(7.6,9.4)));for(let a=0;a<r;a++){const c=(i-o)/r,v=e===-A&&o+c*(a+.5)>200&&o+c*(a+.5)<234.5?lt:0,f=o>=414?1.2:v,d=C.range(6,9.5),h=C();v&&(E[0]=Math.min(E[0],o+c*a),E[1]=Math.max(E[1],o+c*(a+1)));const p=o+c*a,b=7+f,S=h*17.31%1,D=h*71.7%1,B=h*131.9%1>.42&&!(p+c/2>400||Math.abs(p+c/2-(.122*y+6.5))<9&&e===A)&&![239,.59*y+Ft,.62*y+Ft,.649*y+Ft].some(k=>Math.abs(p+c/2-k)<c/2+.4);K.push([e*(7+f+6),-(o+c*(a+.5)),c,d,B?12:-12,e,h,0]),K.push([e*(b-.22+.4),-(p+c/2),c+.06,.26,.8,e,h,d]);let T=d+.26;if(S>.5){const k=c*(.36+.3*D),Q=.7+.9*D;K.push([e*(b+.2),-(p+c/2),k,Q,.4,e,h,T]),K.push([e*(b-.1+.3),-(p+c/2),k+.3,.16,.6,e,h,T+Q]);for(let H=Math.floor((p+c/2-k/2)/430*1024);H<=(p+c/2+k/2)/430*1024;H++)H>=0&&H<1024&&(me[e][H]=T+Q+.16)}for(let k=Math.floor(p/430*1024);k<(p+c)/430*1024;k++)k>=0&&k<1024&&(me[e][k]=Math.max(me[e][k],T));B&&pe.push([e*b,-(p+c/2),c-1.1,e,h])}}K.push([e*15.5,-435.05,10,C.range(9,10.5),-15,e,C(),0])}const xe=new Uint8Array(1024*4);for(let e=0;e<1024;e++){xe[e*4]=Math.min(255,Math.round(me[-1][e]*16)),xe[e*4+1]=Math.min(255,Math.round(me[1][e]*16)),xe[e*4+3]=255;const t=(e+.5)/1024*430;xe[e*4+2]=Je===-A&&t>E[0]&&t<E[1]?lt*16:0}const Le=new l.DataTexture(xe,1024,1,l.RGBAFormat);Le.magFilter=l.NearestFilter,Le.minFilter=l.NearestFilter,Le.needsUpdate=!0,de.uniforms.tRoof.value=Le;const ye=new l.InstancedBufferGeometry;ye.copy(new l.BoxGeometry(1,1,1).translate(0,.5,0));const Tt=new Float32Array(K.length*4),Pt=new Float32Array(K.length*4);K.forEach((e,t)=>{Tt.set([e[0],e[1],e[2],e[3]],t*4),Pt.set([e[4],e[5],e[6],e[7]],t*4)}),ye.setAttribute("aBox",new l.InstancedBufferAttribute(Tt,4)),ye.setAttribute("aInf",new l.InstancedBufferAttribute(Pt,4)),ye.instanceCount=K.length;const ya=new l.Vector2(Math.abs(ee.z/ee.x),ee.y/Math.abs(ee.x)),ba=new l.ShaderMaterial({uniforms:{...G,uCloud:ue,uCsK:Ae,uRake:{value:ya},uPaint:{value:m("#F4F1E8").multiplyScalar(.8)},uShut:{value:m("#7C8998").multiplyScalar(.72)},uCream:{value:m("#E9DFC8").multiplyScalar(.8)},uSlate:{value:m("#8FA3BD").multiplyScalar(.8)},uStraw:{value:m("#D9B25A").multiplyScalar(.72)},uDeep:{value:m("#5578AA").multiplyScalar(.62)},uDust:{value:m("#E9DFC8").multiplyScalar(.7)}},vertexShader:`
        attribute vec4 aBox; attribute vec4 aInf;
        varying vec3 vN; varying vec2 vL; varying vec4 vI; varying float vD; varying float vFace; varying vec3 vW; varying float vAw; varying float vCz;
        void main() { vCz = aBox.y; float dep = abs(aInf.x); vAw = step(0., aInf.x); vec3 p = vec3(position.x * dep + aBox.x, position.y * aBox.w + aInf.w, position.z * aBox.z + aBox.y);
          vN = normal; bool front = abs(normal.x) > .5;
          vL = front ? vec2(position.z * aBox.z, position.y * aBox.w) : vec2(position.x * dep, position.y * aBox.w);
          vI = vec4(aBox.z, aBox.w, aInf.z, aInf.w); vFace = front ? 1. : 0.; vW = p;
          vec4 mv = viewMatrix * vec4(p, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:I+Dt+$e+Za}),qt=new l.Mesh(ye,ba);qt.frustumCulled=!1,M.add(qt);const be=new l.InstancedBufferGeometry;be.copy(new l.PlaneGeometry(1,1,8,5));const Et=new Float32Array(pe.length*4),Ut=new Float32Array(pe.length*2);pe.forEach((e,t)=>{Et.set([e[0],e[1],e[2],e[3]],t*4),Ut.set([e[4],-e[3]*ee.x>0?1:0],t*2)}),be.setAttribute("aA",new l.InstancedBufferAttribute(Et,4)),be.setAttribute("aB",new l.InstancedBufferAttribute(Ut,2)),be.instanceCount=pe.length;const wa=new l.ShaderMaterial({uniforms:{...G,uGale:te,uTime:X,uSwing:De,uCloud:ue,uCsK:Ae,uC0:{value:m("#F4F1E8").multiplyScalar(.8)},uC1:{value:m("#8FA3BD").multiplyScalar(.72)},uC2:{value:m("#B7C3D2").multiplyScalar(.8)},uC3:{value:m("#E9DFC8").multiplyScalar(.8)}},vertexShader:`
        attribute vec4 aA; attribute vec2 aB; uniform float uGale; uniform float uTime; uniform float uSwing;
        varying vec3 vP; varying float vD; varying vec3 vK; varying float vOut; varying vec2 vGp; uniform vec3 uSun;
        void main() {
          float v = position.y + .5, xw = position.x * aA.z, sd = aB.x, cv = min(v / .8, 1.), val = max(v - .8, 0.) / .2;
          float outw = cv * 1.4, drop = cv * .55 + val * .34;
          float g = uGale + uSwing * .4;
          float lift = sin(cv * 3.1416) * g * (.12 + .16 * sin(uTime * 3.1 + sd * 20. + xw * 1.7) + .08 * sin(uTime * 7.3 + xw * 4.1 + sd * 7.));
          float flap = val * g * (.3 * sin(uTime * 9. + xw * 5. + sd * 30.) + .14);
          vec3 p = vec3(aA.x - aA.w * (outw - flap * .3), 3.42 - drop + lift, aA.y + xw + flap * .5);
          vP = vec3(xw, v, sd); vK = vec3(aB.y, aA.w, lift); vOut = cv; vGp = p.xz - uSun.xz * (p.y / max(uSun.y, 1e-3));
          vec4 mv = viewMatrix * vec4(p, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:I+Dt+$e+`
        uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform float uCloud; uniform float uCsK;
        varying vec3 vP; varying float vD; varying vec3 vK; varying float vOut; varying vec2 vGp;
        void main() {
          float sd = vP.z, k = fract(sd * 37.7);
          // scalloped valance
          float sc = abs(fract(vP.x / .42) - .5) * 2.; if (vP.y > .86 + .14 * sqrt(max(1. - sc * sc, 0.))) discard;
          vec3 a = k < .2 ? uC1 : (k < .4 ? vec3(.1, .26, .6) : (k < .6 ? mix(vec3(.3, .44, .66), uC1, step(326., -vGp.y)) : (k < .76 ? mix(uC3, vec3(.2, .3, .46), step(104., -vGp.y) * step(-vGp.y, 318.)) : uC2))), b = k > .9 ? uC3 : uC0;
          vec3 alb = mix(a, b, step(.5, fract(vP.x / .56 + .25)));
          float sunlit = mix(smoothstep(.45, .7, vOut), 1., vK.x);
          float under = gl_FrontFacing ? 1. : 0.;
          vec3 n = normalize(vec3(-vK.y * .36, .93, 0.));
          float top = max(dot(n, uSun), 0.);
          // from below the canvas is lit by what comes through it and by the pale road; from above by the sun itself
          vec3 li = mix(uSunC * top * sunlit + uSkyC * .7, uSunC * .62 * sunlit + uSkyC * .28 + uGndC * 2.6, under);
          vec3 c = alb * li * (1. - .12 * step(.8, vP.y) * (1. - under));
          c = mix(c, c * vec3(.5, .62, .95), sfShade(vGp, uCloud) * uCsK * .9 * sunlit * smoothstep(7., 22., vD));
          gl_FragColor = vec4(sfFog(c, vD), 1.); }`,side:l.DoubleSide}),Rt=new l.Mesh(be,wa);Rt.frustumCulled=!1,M.add(Rt),await g.yield(),await g.yield();const we=Ka(G),n=new Ct,rt=m("#8E897E").multiplyScalar(.85),Va=m("#F4F1E8").multiplyScalar(.8),Xa=m("#16181C"),Ya=m("#3A4250"),u=e=>{const t=Math.sin(e*12.9898+4.1)*43758.5453;return t-Math.floor(t)},q=13,le=-512,ga=[.6,.74,.88,1],ge=[m("#F4F1E8"),m("#8FA3BD").multiplyScalar(.9),m("#E9DFC8"),m("#F4F1E8")],Ge=m("#F4F1E8").multiplyScalar(1.5);let N=0;const it=(e,t,s,o=!1)=>{const i=u(N++),r=o?2.12+.07*u(N*3.7):2.05+.5*u(N*3.7)*u(N*3.7),a=(u(N*7.1)-.5)*(o?.008:.025),c=o?(u(N*5.3)>.86?ge[1]:ge[0]).clone().multiplyScalar(.9+.2*u(N*1.7)):(u(N*5.3)>.76?ge[Math.floor(u(N*1.7)*4)]:rt).clone().multiplyScalar(ga[Math.floor(i*4)]);(o||i>.13)&&(n.box(s?.25:.035,r,s?.035:.25,c,e,r/2,t,s?0:a,0,s?a:0,!1),n.box(s?.25:.07,.05,s?.07:.25,Ge,e,r+.025,t,0,0,0,!1))};for(let e=-q;e<=q;e+=.3)it(e,le,!0);await g.yield();for(const e of[-1,1]){for(let t=-442.8;t>le;t-=.3)it(e*q,t,!1);await g.yield()}const ae=rt.clone().multiplyScalar(.6);for(const e of[.55,1.75]){n.box(q*2,.09,.05,ae,0,e,le-.05,0,0,0,!1);for(const t of[-1,1])n.box(.05,.09,69.2,ae,t*(q+.05),e,(le-442.8)/2,0,0,0,!1)}for(let e=-q;e<=q+.01;e+=3.25)n.box(.13,2.6,.13,ae,e,1.3,le-.1,0,0,0,!1);for(const e of[-1,1])for(let t=-444;t>le;t-=3.4)n.box(.13,2.6,.13,ae,e*(q+.1),1.3,t,0,0,0,!1);for(const t of[-1,1]){for(let s=4.75;s<=q-.2;s+=.3)it(t*s,-471,!0,!0);n.box(q-4.6,.07,.16,Ge,t*(q+4.6)/2,2.24,-471,0,0,0,!1);for(const s of[.55,1.75])n.box(q-4.6,.09,.05,ae,t*(q+4.6)/2,s,-471-.05,0,0,0,!1);for(let s=7.6;s<q;s+=3.1)n.box(.13,2.6,.13,ae,t*s,1.3,-471-.1,0,0,0,!1);n.box(.34,3.5,.34,m("#F4F1E8").multiplyScalar(1.05),t*4.5,1.75,-471,0,0,0,!1).box(.5,.14,.5,m("#F4F1E8").multiplyScalar(.9),t*4.5,3.55,-471,0,0,0,!1),n.addGeo(new l.SphereGeometry(.24,10,8),n.mat(t*4.5,3.84,-471),m("#F4F1E8").multiplyScalar(.95))}{const e=[j.x0,-j.d0],t=[j.x1,-j.d1],s=Math.hypot(t[0]-e[0],t[1]-e[1]),o=Math.floor(s/.22);for(const i of[-1,1]){const r=Math.atan2(i*(e[0]-t[0]),e[1]-t[1]);for(let a=0;a<=o;a++){const c=a/o,v=i*(e[0]+(t[0]-e[0])*c),f=e[1]+(t[1]-e[1])*c,d=1.06+.1*u(a*3.3+i*11+600);u(a*7.9+i*5+610)<.05||n.box(.03,d,.11,(u(a*5.3+i+620)>.84?ge[1]:ge[0]).clone().multiplyScalar(.88+.22*u(a*1.7+i*3+630)),v,.08+d/2,f,0,r,0,!1)}for(const a of[.38,.9])n.box(.05,.08,s,ae,i*((e[0]+t[0])/2+.04),a,(e[1]+t[1])/2,0,r,0,!1);for(let a=0;a<=12;a++){const c=a/13,v=i*(e[0]+(t[0]-e[0])*c+.1),f=e[1]+(t[1]-e[1])*c;n.box(.13,1.36,.13,Ge.clone().multiplyScalar(.6),v,.68,f,0,r,0,!1).box(.2,.05,.2,Ge,v,1.385,f,0,r,0,!1)}}}await g.yield();const O=1.45,L={box(e,t,s,o,i,r,a,c=0,v=0,f=0,d=!0){return n.box(e*O,t*O,s*O,o,i*O,r*O,-y+(a+y)*O,c,v,f,d),L}},w=m("#F4F1E8").multiplyScalar(1.12),$=w.clone().multiplyScalar(.9);for(const e of[-1,1])L.box(.42,3.5,.5,w,e*2.03,1.75,-y,0,0,0,!1),L.box(.12,3.5,.58,$,e*2.2,1.75,-y,0,0,0,!1),L.box(.56,.34,.64,$,e*2.05,.17,-y,0,0,0,!1);L.box(4.9,.46,.52,w,0,3.68,-y,0,0,0,!1),L.box(5.3,.12,.8,$,0,3.97,-y,0,0,0,!1),L.box(5,.08,.66,w,0,3.46,-y,0,0,0,!1),L.box(3.7,.04,.3,rt.clone().multiplyScalar(.8),0,.02,-y,0,0,0,!1);const Ht=new l.Quaternion,We=new l.Euler,ct=new l.Vector3,ft=new l.Vector3,za=new l.Vector3(0,1,0),z=(e,t,s,o,i)=>{ct.set(t[0],t[1],t[2]),ft.set(s[0],s[1],s[2]);const r=ct.distanceTo(ft);Ht.setFromUnitVectors(za,ft.clone().sub(ct).normalize()),We.setFromQuaternion(Ht),e.box(o,r,o,i,(t[0]+s[0])/2,(t[1]+s[1])/2,(t[2]+s[2])/2,We.x,We.y,We.z,!1)},oe=m("#B08A5A").multiplyScalar(.95),_=m("#3F7FD0").multiplyScalar(.62),Be=m("#9FB0C6").multiplyScalar(.8);for(const e of[-1,1])z(L,[e*2.75,4.02,-y],[0,5.25,-y],.22,w),z(L,[e*2.1,3.7,-y-.3],[e*4.6,.1,-y-3.4],.16,oe),z(L,[e*2.1,2,-y-.3],[e*3.4,.1,-y-1.9],.12,oe),L.box(.5,.1,1.2,oe,e*4.6,.05,-y-3.4,0,e*.6,0,!1),L.box(.3,.3,.3,Be,e*2.03,4.3,-y,0,0,0,!1);L.box(3.2,.74,.1,$,0,4.42,-y-.05,0,0,0,!1);for(const e of[-1,1]){for(let t=0;t<17;t++){const s=.34+t*.2,o=t>13?1:1.9;L.box(o,.2,.06,(t%2?w:$).clone().multiplyScalar(.94+.08*u(t*3.1+e)),e*(2.3+o/2),s+.1,-y-.08,.06,0,0,!1)}L.box(.14,3.2,.14,w,e*4.2,1.6,-y-.04,0,0,0,!1),L.box(1,.1,.24,w,e*3.75,3.2,-y-.04,0,0,0,!1).box(1.2,.1,.24,w,e*2.85,3.8,-y-.04,0,0,0,!1),L.box(1.3,1.5,.05,Be.clone().multiplyScalar(.8),e*3.25,1.75,-y-.02,0,0,0,!1),L.box(1.5,.1,.12,w,e*3.25,2.55,-y,0,0,0,!1).box(1.5,.1,.12,w,e*3.25,.95,-y,0,0,0,!1)}n.addGeo(new l.CylinderGeometry(.34*O,.34*O,.08,20).rotateX(Math.PI/2),n.mat(0,4.44*O,-y+.05),Be);const _t=[];for(const e of[-1,1]){const t=e*5,s=-y-.1,o=5.4,i=11,r=3.4;for(let a=0;a<20;a++){const c=o+(a+.5)*(i-o)/20;n.box(r,(i-o)/20,.07,(a%2?w:$).clone().multiplyScalar(.93+.09*u(a*3.7+e*5+40)),t,c,s,.05,0,0,!1)}for(const a of[-1,1])n.box(.2,i-o+.1,.16,w,t+a*(r/2-.1),(o+i)/2,s+.03,0,0,0,!1);n.box(r+.5,.2,.5,w,t,i+.1,s,0,0,0,!1).box(r+.2,.14,.3,$,t,o+.07,s+.05,0,0,0,!1),n.box(2.1,.75,.12,w,t,i+.57,s,0,0,0,!1).box(2.4,.12,.3,$,t,i+1,s,0,0,0,!1),n.box(1.25,1.9,.06,Be.clone().multiplyScalar(.8),t,8.3,s+.06,0,0,0,!1),n.box(1.55,.12,.16,w,t,9.32,s+.08,0,0,0,!1).box(1.6,.12,.2,w,t,7.28,s+.08,0,0,0,!1),n.box(.05,1.9,.08,w,t,8.3,s+.09,0,0,0,!1),n.box(.09,1.9,.09,w,t,i+1.95,s,0,0,0,!1),n.addGeo(new l.SphereGeometry(.13,8,6),n.mat(t,i+2.95,s),w),_t.push([t,i+2.8,s+.06,e]),z(n,[t+e*.9,10.3,s-.25],[t+e*4.4,.1,s-6.2],.2,oe),z(n,[t+e*1.2,7,s-.25],[t+e*3.4,.1,s-3.6],.15,oe),z(n,[t-e*.6,10.3,s-.25],[t-e*.6,.1,s-6.6],.18,oe),n.box(.6,.1,1.4,oe,t+e*4.4,.05,s-6.2,0,e*.5,0,!1)}const Te=[];for(let e=30;e<=360;e+=30)e!==180&&e!==240&&Te.push(e);Te.push(374,386,353);const R=[],F=(e,t)=>m(e).multiplyScalar(t),ze=[F("#F4F1E8",.84),F("#F4F1E8",.84),F("#F4F1E8",.84),F("#E9DFC8",.84),F("#C9D6E6",.82)],Sa=[F("#C9D6E6",.82),F("#3F7FD0",.6),F("#8FA3BD",.72),F("#E9DFC8",.84),F("#5E86C4",.66)],Se=new Uint8Array(2048*4),vt=new Uint8Array(512*4).fill(255);Te.forEach((e,t)=>{const s=e===353,o=e>=370||s,i=e>=355||s,r=s?[]:[[-5.4,-1.7],[1.7,5.4]];let a=0;for(const[f,d]of r){let h=f+C.range(0,.3);for(let p=0;p<12;p++){const b=C(),S=b<.5||o?0:b<.8?.25:.5,D=e>=270?1.15:1,B=(S===0?C.range(1.5,2.2):S===.25?C.range(.95,1.15):C.range(.8,.95))*D,T=(S===0?C.range(1.9,2.6):S===.25?C.range(1,1.2):C.range(1.5,1.8))*D;let k=C();const Q=C.chance(S===0?.26:.5)?C.pick(Sa):C.pick(ze),H=o?ze[p%3]:Q;if(o)for(;k*5.3%1>=.6;)k=(k+.071)%1;if(h+B>d)break;if(!i&&!(V<.9&&a++%3===2)){R.push([h+B/2,5.5,-e,B,T,k,S,H]);for(let J=Math.round((h+6.4)*10);J<Math.round((h+B+6.4)*10);J++)J>=0&&J<128&&(Se[(t*128+J)*4]=Math.round(T*60),Se[(t*128+J)*4+1]=Math.round(k*255))}h+=B+C.range(.12,.45)}}const c=(f,d,h,p,b,S)=>{R.push([f+d/2,5.5,-e,d,h,p,b,S]);for(let D=Math.round((f+6.4)*10);D<Math.round((f+d+6.4)*10);D++)D>=0&&D<128&&(Se[(t*128+D)*4]=Math.round(h*60),Se[(t*128+D)*4+1]=Math.round(p*255))},v=f=>{let d=f;for(;d*5.3%1>=.6;)d=(d+.071)%1;return d};for(const f of[-1,1])if(i){let d=1.8+.25*u(t*3.3+f*7+800);for(let h=0;h<4;h++){const p=(h+t+(f>0?1:0))%3,b=p===0?0:p===1?.25:.5,S=b===0?1.25+.5*u(t*5.1+h*3.7+f+810):b===.25?1.2:.95,D=b===0?2.1+1.1*u(t*7.3+h*1.9+f+820):b===.25?1.35:1.9;if(d+S>6.5)break;c(f>0?d:-d-S,S,D,v(u(t*9.7+h*2.3+f+830)),b,(p===0&&h>0?ze[4]:ze[0]).clone().multiplyScalar(1.02)),d+=S+.2+.25*u(t+h*5.5+840)}}else{const d=u(t*4.1+f*3+850),h=d<.55?0:.25,p=h===0?1.05:.9,b=h===0?1.9+.5*d:1.1;c(f>0?5.5:-5.5-p,p,b,v(u(t*6.7+f+860)),h,ze[0])}for(let f=e-5;f<=e+5;f++)vt[f*4]=t,vt[f*4+1]=Math.round((e-f+8)*15)});const Pe=new l.DataTexture(Se,128,16,l.RGBAFormat);Pe.magFilter=l.NearestFilter,Pe.minFilter=l.NearestFilter,Pe.needsUpdate=!0;const qe=new l.DataTexture(vt,512,1,l.RGBAFormat);qe.magFilter=l.NearestFilter,qe.minFilter=l.NearestFilter,qe.needsUpdate=!0,de.uniforms.tWash.value=Pe,de.uniforms.tLine.value=qe;const ka=[m("#3F7FD0").multiplyScalar(.62),m("#8FA3BD").multiplyScalar(.72),m("#2F4F86").multiplyScalar(.6),m("#6E93B8").multiplyScalar(.7),m("#24406E").multiplyScalar(.62)],Ee=m("#F4F1E8").multiplyScalar(.84),It=m("#3A4250"),Ca=[.122*y+6.5,120,192,239,289,304,318];let Kt=0;for(let e=18,t=0;e<405&&Kt<22;e+=17.3,t++){const s=t%2?1:-1;if(e<30||Ca.some(i=>Math.abs(i-e)<9))continue;const o=s===-A&&e>E[0]&&e<E[1]?lt:0;R.push([s*(5.75+o),4.42,-e,1.5,.84,C(),1,C.pick(ka)]),n.box(2.3,.13,.13,Ee,s*(5.9+o),4.56,-e,0,0,0,!1),n.box(1.5,.1,.1,Ee,s*(6.42+o),4.06,-e,0,0,s*.82,!1),n.box(.16,.2,.16,Ee,s*(4.72+o),4.56,-e,0,0,0,!1),n.box(.1,1.5,.16,Ee,s*(6.95+o),4.1,-e,0,0,0,!1);for(const i of[-1,1])n.box(.03,.2,.03,It,s*(5.75+o)+i*.6,4.42,-e,0,0,0,!1);Kt++}const $a=m("#9A7446").multiplyScalar(.9),Nt=m("#6E5030"),W=m("#5E7BA6").multiplyScalar(.7),ht=m("#3F7FD0").multiplyScalar(.5),se=m("#C9D6E6").multiplyScalar(.8),ut=[],Ot=(e,t)=>{const s=e*9.6,o=-t,i=5,r=15.2;for(const a of[-1,1])for(const c of[-1,1])z(n,[s+a*1.25,i,o+c*1.25],[s+a*.22,r,o+c*.22],.17,se);for(let a=1;a<=4;a++){const c=a/4.6,v=1.25-1.03*c,f=i+(r-i)*c,d=1.25-1.03*(a-1)/4.6,h=i+(r-i)*(a-1)/4.6;for(const p of[-1,1])n.box(v*2,.1,.1,se,s,f,o+p*v,0,0,0,!1),n.box(.1,.1,v*2,se,s+p*v,f,o,0,0,0,!1),z(n,[s-d,h,o+p*d],[s+v,f,o+p*v],.09,se),z(n,[s+p*d,h,o+d],[s+p*v,f,o-v],.09,se)}n.box(.3,.3,1.5,se,s,r+.2,o+.5,0,0,0,!1),n.box(.06,1.5,2.2,m("#F4F1E8").multiplyScalar(.85),s,r+.2,o+2.6,0,0,0,!1).box(.07,1.5,.5,ht,s,r+.2,o+3.5,0,0,0,!1),ut.push([s,r+.2,o-.35])},Zt=(e,t,s)=>{const o=e*9.4,i=-t,r=3.4;n.box(r,9.5,r,w.clone().multiplyScalar(.72),o,8.25,i,0,0,0,!1);for(const a of[-1,1])for(const c of[-1,1])n.box(.26,9.5,.26,w.clone().multiplyScalar(.8),o+a*r/2,8.25,i+c*r/2,0,0,0,!1),n.box(.3,2.2,.3,w.clone().multiplyScalar(.8),o+a*(r/2-.15),14.1,i+c*(r/2-.15),0,0,0,!1);n.box(r+.5,.3,r+.5,w.clone().multiplyScalar(.8),o,13.05,i,0,0,0,!1).box(r+.5,.26,r+.5,w.clone().multiplyScalar(.8),o,15.3,i,0,0,0,!1),n.box(1.2,2,.08,W.clone().multiplyScalar(.7),o,10.6,i+r/2+.03,0,0,0,!1).box(.08,2,1.2,W.clone().multiplyScalar(.7),o-e*(r/2+.03),10.6,i,0,0,0,!1),n.addGeo(new l.ConeGeometry(2.9,3.4,4).rotateY(Math.PI/4),n.mat(o,17.1,i),s),n.addGeo(new l.CylinderGeometry(.3,.62,.85,10),n.mat(o,14.2,i),m("#3A3F48")),n.box(.08,1.6,.08,s,o,19.4,i,0,0,0,!1).box(.9,.5,.04,ht,o,19.9,i+.5,0,0,0,!1)},Fa=m("#C9D6E6").multiplyScalar(.8),ne=m("#6F86A8").multiplyScalar(.7),Ma=(e,t)=>{const s=e*9.6,o=-t;for(const i of[-1,1])for(const r of[-1,1])z(n,[s+i*1.9,5,o+r*1.9],[s+i*1.5,10.6,o+r*1.5],.24,ne),i>0?(z(n,[s-1.8,5.6,o+r*1.8],[s+1.6,9.8,o+r*1.6],.13,ne),z(n,[s+1.8,5.6,o+r*1.8],[s-1.6,9.8,o+r*1.6],.13,ne)):(z(n,[s+r*1.8,5.6,o-1.8],[s+r*1.6,9.8,o+1.6],.13,ne),z(n,[s+r*1.8,5.6,o+1.8],[s+r*1.6,9.8,o-1.6],.13,ne));n.box(4.3,.24,4.3,ne,s,10.7,o,0,0,0,!1),n.addGeo(new l.CylinderGeometry(2.05,1.9,3.3,18),n.mat(s,12.5,o),Fa);for(const i of[11.3,12.4,13.6])n.addGeo(new l.CylinderGeometry(2.08-(13.6-i)*.04,2.08-(13.6-i)*.04,.12,18),n.mat(s,i,o),m("#2A2F38"));n.addGeo(new l.ConeGeometry(2.4,1.5,18),n.mat(s,14.9,o),W),n.box(.14,.5,.14,ne,s,15.8,o,0,0,0,!1)};Ot(-A,70),Zt(A,147,W),Ot(A,263),Zt(-A,322,ht),Ma(A,371);const Da=m("#E9DFC8").multiplyScalar(.76),Qa=m("#D9B25A").multiplyScalar(.74),jt=new l.Color(.86,.8,.64).multiplyScalar(.8),Vt=(e,t,s)=>{const o=e*10.3,i=-t;n.box(4.6,9,5.2,s,o,9.5,i,0,0,0,!1).box(2.6,3.2,3,s.clone().multiplyScalar(1.06),o,15.6,i,0,0,0,!1),n.box(5.1,.24,5.7,W,o,14.1,i,0,0,0,!1);for(const r of[7.6,10.9])n.box(4.7,.3,5.3,W,o,r,i,0,0,0,!1);n.addGeo(new l.CylinderGeometry(2,2,3.5,3).rotateX(-Math.PI/2).scale(1,.62,1),n.mat(o,17.2+.62,i),W),z(n,[o-e*1.2,16.4,i+.6],[o-e*3.4,9.2,i+1.4],.36,s.clone().multiplyScalar(.92)),n.box(.9,1.3,.06,W.clone().multiplyScalar(.7),o,12.4,i+2.63,0,0,0,!1).box(.7,.9,.06,W.clone().multiplyScalar(.7),o,15.7,i+1.53,0,0,0,!1),n.box(.06,1.3,.9,W.clone().multiplyScalar(.7),o-e*2.33,12.4,i,0,0,0,!1),n.box(.08,1.9,.08,Nt,o,19.3,i,0,0,0,!1).box(.05,.36,.9,se,o,20,i+.3,0,0,0,!1)},Aa=(e,t)=>{const s=e*10.6,o=-t;n.box(6.2,5.6,8,jt,s,7.8,o,0,0,0,!1),n.addGeo(new l.CylinderGeometry(3.9,3.9,8.7,3).rotateX(-Math.PI/2).scale(1,.55,1),n.mat(s,10.6+1.07,o),W),n.addGeo(new l.CylinderGeometry(3.6,3.6,8.3,3).rotateX(-Math.PI/2).scale(1,.55,1),n.mat(s,10.6+.99,o+.3),jt),n.box(6.5,.22,.2,w.clone().multiplyScalar(.8),s,10.6,o+4.06,0,0,0,!1),n.box(1.5,1.7,.08,_,s,11.75,o+4.47,0,0,0,!1);for(const i of[-1,1])n.box(.1,2.3,.1,w.clone().multiplyScalar(.8),s,11.75,o+4.52,0,0,i*.72,!1);n.box(.22,.22,2.4,Nt,s,13.55,o+5.2,0,0,0,!1).box(.3,.42,.3,dt,s,13.3,o+6.2,0,0,0,!1);for(const i of[-1,1])n.box(1.3,1.5,.06,W.clone().multiplyScalar(.7),s+i*1.7,8.2,o+4.03,0,0,0,!1)},dt=m("#2A2F38");Vt(A,40,Da),Aa(-A,105),Vt(-A,284,new l.Color(.13,.19,.32));{const t=w.clone().multiplyScalar(.72),s=w.clone().multiplyScalar(.62);for(const o of[-1,1])n.box(.32,7.3,.32,t,o*5.35,3.65,-22,0,0,0,!1).box(.5,.5,.5,s,o*5.35,.25,-22,0,0,0,!1).box(.44,.16,.44,s,o*5.35,7.38,-22,0,0,0,!1),z(n,[o*5.35,5.2,-22],[o*3.7,6.85,-22],.2,t),n.box(.5,.14,.14,_,o*5.35,4.7,-22,0,0,0,!1),n.box(.5,1.1,.07,_,o*3.66,6.22,-22+.02,0,0,0,!1);n.box(11.6,.3,.3,t,0,7,-22,0,0,0,!1).box(12,.1,.46,s,0,7.2,-22,0,0,0,!1),n.box(7.4,1.1,.08,t.clone().multiplyScalar(1.12),0,6.22,-22,0,0,0,!1),n.box(7.6,.1,.14,s,0,6.8,-22,0,0,0,!1).box(7.6,.1,.14,s,0,5.64,-22,0,0,0,!1);for(const o of[-1,0,1])n.addGeo(new l.CylinderGeometry(o?.27:.36,o?.27:.36,.06,18).rotateX(Math.PI/2),n.mat(o*2.1,6.22,-22+.06),_)}await g.yield();const Xt=[],x=new Ct,mt=[];{const e=w.clone().multiplyScalar(.74),t=w.clone().multiplyScalar(.6),s=_.clone().multiplyScalar(.9),o=(i,r,a,c,v,f,d=0)=>n.addGeo(new l.CylinderGeometry(r,r,i,3).rotateX(-Math.PI/2).rotateY(Math.PI/2).scale(1,.5,1),n.mat(a,c,v,0,0,d),f);{for(const a of[-1,1])n.box(1.35,7.85+3.4,2.6,t,a*6.3,(7.85+3.4)/2+.3,-90,0,0,0,!1),n.box(1.6,.16,2.9,e,a*6.3,7.85+3.75,-90,0,0,0,!1),n.addGeo(new l.ConeGeometry(1.35,1.5,4).rotateY(Math.PI/4),n.mat(a*6.3,7.85+4.6,-90),W),a!==A&&n.box(.7,1.9,.06,s,a*6.3,1.3,-90+1.32,0,0,0,!1).box(.6,.9,.06,s,a*6.3,5.2,-90+1.32,0,0,0,!1),n.box(1.45,.14,2.7,e,a*6.3,3.6,-90,0,0,0,!1);for(const a of[-1,0,1])n.box(11.4,.3,.14,t,0,7.85+.15,-90+a*1.1,0,0,0,!1);for(let a=-12;a<=12;a++)u(a*9.7+505)<.84&&n.box(.3,.07,2.5,e.clone().multiplyScalar(.86+.28*u(a*3.1+500)),a*.46,7.85+.335,-90+.06*(u(a*7.3+510)-.5),0,0,0,!1);for(const a of[-1,1])for(let c=0;c<=5;c++)n.box(.18,2.6,.18,e,-5.7+c*2.28,7.85+.3+1.3,-90+a*1.2,0,0,0,!1);{n.box(11.4,.18,.2,e,0,7.85+2.99,-90+-1*1.2,0,0,0,!1),n.box(11.4,.12,.14,e.clone().multiplyScalar(1.2),0,7.85+1.45,-90+-1*1.2,0,0,0,!1),n.box(11.4,.1,.1,e,0,7.85+.55,-90+-1*1.2,0,0,0,!1);for(let c=-12;c<=12;c++){let v=!0;for(let f=0;f<=5;f++)Math.abs(c*.46-(-5.7+f*2.28))<.235&&(v=!1);v&&n.box(.1,.84,.08,e,c*.46,7.85+.99,-90+-1*1.2,0,0,0,!1)}}n.box(11.4,.34,.06,s,0,7.85+.17,-90+1.33,0,0,0,!1);{const a=49.4*Ye,c=Math.tan(a),v=Math.cos(a),f=Math.sin(a),d=.27,h=.45,p=1.33,b=.57,S=1.3;for(let U=0;U<5;U++){const ke=-5.7+U*2.28+.09,Ze=ke+2.1,St=(ke+Ze)/2,je=(Ze-ke-S)/2;for(let Z=0;Z<9;Z++){const Ve=7.85+b+Z*d,kt=e.clone().multiplyScalar(.92+.16*u(Z*3.9+U*7.7+550));Z>=3&&Z<=6?(n.box(je,.03,h,kt,ke+je/2,Ve,-90+p,a,0,0,!1).box(je,.03,h,kt,Ze-je/2,Ve,-90+p,a,0,0,!1),n.box(S,.03,h,s.clone().multiplyScalar(.9+.2*u(Z*5.1+U*3.3+560)),St,Ve,-90+p,a,0,0,!1)):n.box(Ze-ke,.03,h,kt,St,Ve,-90+p,a,0,0,!1)}const ha=b+3*d-h/2*f-.12,ua=b+6*d+h/2*f+.12;for(const Z of[-1,1])n.box(.1,ua-ha,.08,s,St+Z*(S/2),7.85+(ha+ua)/2,-90+p,0,0,0,!1)}const D=.4,B=1.2+D,T=b+9*d+(p-1.2)*c,k=T+1.2*c,Q=T-D*c,H=B/v;n.box(11.62,.06,H,W,0,7.85+(k+Q)/2,-90+B/2,a,0,0,!1);for(const U of[-1,1])n.box(11.64,.075,.3,s,0,7.85+(k+Q)/2+U*(H/2-.15)*f*-1,-90+B/2+U*(H/2-.15)*v,a,0,0,!1);n.box(11.4,.15,.24,t,0,7.85+T-.095/v,-90+1.2,a,0,0,!1);const J=Math.hypot(1.2,k-3.08),Ra=Math.atan2(k-3.08,1.2);for(let U=-7;U<=7;U++)n.box(.16,.08,J,e.clone().multiplyScalar(.9+.2*u(U*5.9+520)),U*.76,7.85+(k+3.08)/2,-90-.6,-Ra,0,0,!1)}for(const a of[-1,1])z(n,[a*5.6,7.85-1.6,-90],[a*3.9,7.85,-90],.2,t)}{const a=t,c=e;for(const v of[-1,1]){for(const f of[-1,1])z(n,[v*6.55,.3,-100+f*1.5],[v*5.9,8.3,-100+f*.75],.26,a);z(n,[v*6.5,1,-100-1.4],[v*6,7.2,-100+.8],.14,a),z(n,[v*6.5,1,-100+1.4],[v*6,7.2,-100-.8],.14,a),n.box(.2,.2,2.2,a,v*6.2,4.4,-100,0,0,0,!1)}for(const v of[-1,1]){n.box(13.2,.36,.24,a,0,8.3,-100+v*.75,0,0,0,!1),n.box(13.2,.1,.1,c,0,8.3+1.4,-100+v*.92,0,0,0,!1);for(let f=-4;f<=4;f++)n.box(.1,1.605,.1,c,f*1.6,8.3+.6225,-100+v*.92,0,0,0,!1)}for(let v=-14;v<=14;v++)n.box(.33,.08,2.1,c.clone().multiplyScalar(.88+.24*u(v*4.3+530)),v*.46,8.3+.22,-100+.05*(u(v*6.1+540)-.5),0,0,0,!1);for(const v of[-1,1])z(n,[v*5.9,8.3-2.2,-100],[v*3.6,8.3-.1,-100],.18,a)}{const r=[A*7.9,13.2,-146],a=[-A*7.6,9.3,-146];z(n,r,a,.1,It),n.box(.2,5.2,.2,e,a[0],7.6,-146,0,0,0,!1).box(.5,.12,.5,e,a[0],10.2,-146,0,0,0,!1);for(let c=0;c<7;c++){const v=.1+c*.135;Xt.push([r[0]+(a[0]-r[0])*v,r[1]+(a[1]-r[1])*v-.05,-146,c])}}if(await g.yield(),E[1]>E[0]){const i=-A,r=i*9.5,a=-(E[1]-4.6),c=e.clone().multiplyScalar(1.12);x.box(4.2,.9,4.2,t,r,.75,a,0,0,0,!1).box(3.3,7.2,3.3,e,r,4.8,a,0,0,0,!1);for(const v of[-1,1])for(const f of[-1,1])x.box(.3,7.2,.3,c,r+v*1.6,4.8,a+f*1.6,0,0,0,!1);x.box(3.56,.22,3.56,_,r,4.5,a,0,0,0,!1).box(4,.3,4,t,r,8.55,a,0,0,0,!1),x.box(1.2,2.3,.08,s,r,2.35,a+1.67,0,0,0,!1).box(.08,2.3,1.2,s,r-i*1.67,2.35,a,0,0,0,!1),x.box(1.5,.14,.12,c,r,3.6,a+1.7,0,0,0,!1).box(.12,.14,1.5,c,r-i*1.7,3.6,a,0,0,0,!1),x.box(3,3.1,3,e,r,10.25,a,0,0,0,!1).box(3.7,.28,3.7,t,r,11.94,a,0,0,0,!1);for(const v of[-1,1])for(const f of[-1,1])x.box(.26,3.1,.26,c,r+v*1.45,10.25,a+f*1.45,0,0,0,!1);x.addGeo(new l.ConeGeometry(2.5,4.4,4).rotateY(Math.PI/4),x.mat(r,14.28,a),W),x.box(.1,2.6,.1,c,r,17.6,a,0,0,0,!1),R.push([r,18.8,a,.9,2.8,.37,0,F("#3F7FD0",.62)]),mt.push([[r,10.25,a+1.53],[1,0,0],[0,1,0],1.3,1.3,0],[[r-i*1.53,10.25,a],[0,0,i],[0,1,0],1.3,1.3,0]),mt.push([[r,6.45,a+1.67],[1,0,0],[0,1,0],.5,1.15,1],[[r-i*1.67,6.45,a],[0,0,i],[0,1,0],.5,1.15,1]);for(const v of[210,300])v>E[0]&&v<E[1]&&x.box(.24,5.5,.24,e,i*7,3.05,-v,0,0,0,!1).box(.5,.4,.5,t,i*7,.5,-v,0,0,0,!1);x.box(2.4,.6,.9,W.clone().multiplyScalar(.8),r-i*3.6,.6,a+3.2,0,0,0,!1).box(.16,1.5,.16,_,r-i*3.6,1.05,a+2.6,0,0,0,!1).box(.1,.1,.7,_,r-i*3.6,1.6,a+2.9,.5,0,0,!1)}await g.yield();for(const i of[366.5,378,393.5,402.5,409])for(const r of[-1,1]){const a=r*6,c=-i;x.box(.34,.5,.34,t,a,.55,c,0,0,0,!1).box(.16,3.1,.16,e,a,1.85,c,0,0,0,!1).box(.26,.1,.26,_,a,2.5,c,0,0,0,!1),x.box(.8,.08,.08,e,a,3.15,c,0,0,0,!1),x.box(.36,.5,.36,m("#DCE8F4").multiplyScalar(.92),a,3.68,c,0,0,0,!1);for(const v of[-1,1])for(const f of[-1,1])x.box(.05,.52,.05,dt,a+v*.18,3.68,c+f*.18,0,0,0,!1);x.addGeo(new l.ConeGeometry(.36,.3,4).rotateY(Math.PI/4),x.mat(a,4.08,c),W),x.box(.42,.05,.42,dt,a,3.42,c,0,0,0,!1)}await g.yield();{const i=-(fe+ve)/2,r=ve-fe,a=6;for(let v=0;v<=6;v++){const f=-250-5*v,d=v===0||v===6;for(const h of[-1,1])x.box(.34,8.4,.34,e,h*a,4.5,f,0,0,0,!1).box(.6,.55,.6,t,h*a,.57,f,0,0,0,!1).box(.46,.16,.46,_,h*a,4.9,f,0,0,0,!1),z(x,[h*a,6.9,f],[h*3.6,8.6,f],.2,e),z(x,[h*6.75,8.55,f],[0,he+.06,f],d?.34:.24,e),z(x,[0,8.9,f],[h*3.3,10.05,f],.16,e),v<6&&z(x,[h*a,7.2,f],[h*a,8.5,f-1.4],.16,t),v>0&&z(x,[h*a,7.2,f],[h*a,8.5,f+1.4],.16,t);x.box(13.6,.34,.3,e,0,8.7,f,0,0,0,!1),x.box(.24,2.75,.24,e,0,10.2,f,0,0,0,!1)}for(const v of[-1,1])x.box(.3,.3,r,t,v*a,8.42,i,0,0,0,!1),x.box(.2,.2,r,t,v*3.3,10.2,i,0,0,0,!1);x.box(.3,.3,r,t,0,he+.1,i,0,0,0,!1);for(let v=-9;v<=9;v++){const f=v*.66,d=he-.4545*Math.abs(f)-.3,h=d-8.95;h>.25&&x.box(.44,h,.07,e,f,8.95+h/2,-250+.2,0,0,0,!1)}const c=[F("#3F7FD0",.62),F("#F4F1E8",.86),F("#C9D6E6",.84),F("#8FA3BD",.74)];for(let v=0;v<=6;v++)for(let f=-3;f<=3;f++)Math.abs(f)<2||V<.9&&(v+f)%2||R.push([f*1.42+.3*(u(v*7.1+f*3.3+300)-.5),8.52,-250-5*v-.05,.8,.95+.3*u(v*3.7+f+310),u(v*5.3+f*9.1+320),0,c[(v*3+f+12)%4]])}}{const e=[F("#3F7FD0",.62),F("#F4F1E8",.84),F("#8FA3BD",.76)];for(const t of Xt)R.push([t[0],t[1],t[2],1.9,2.3+.3*u(t[3]*3.3+70),u(t[3]*7.7+50),0,e[t[3]%3]])}for(const e of _t)R.push([e[0],e[1],e[2],.75,2.3,.02+.05*(e[3]>0?1:0),0,F("#8FA3BD",.78)]);await g.yield();{const e=m("#2A2F38"),t=m("#B9AE98").multiplyScalar(.7),s=m("#B9AE98").multiplyScalar(.6),o=m("#E9DFC8").multiplyScalar(.8);for(const i of[-1,1])for(let r=6,a=0;r<404;r+=5.5+9*u(a*3.9+i*17+300),a++){if(r>113&&r<127||r>187&&r<197||r>231&&r<242||r>58&&r<92.5)continue;const c=u(a*7.7+i*3+320),v=i*(6.5+.12*u(a*2.1)),f=-r;if(c<.34){const d=1+Math.floor(u(a*5.1+3)*2.99);for(let h=0;h<d;h++){const p=f+h*.78,b=.3;n.addGeo(new l.CylinderGeometry(.3,.3,.9,10),n.mat(v,b+.45,p),s),n.addGeo(new l.CylinderGeometry(.345,.345,.5,10),n.mat(v,b+.45,p),s.clone().multiplyScalar(1.12));for(const S of[.12,.78])n.addGeo(new l.CylinderGeometry(.325,.325,.06,10),n.mat(v,b+S,p),e)}}else if(c<.62){const d=.7+.3*u(a*1.3),h=.5+.3*u(a*4.7);n.box(d,d*.8,d,t,v,.3+d*.4,f,0,u(a)*.5,0,!1).box(h,h*.8,h,t.clone().multiplyScalar(1.15),v,.3+d*.8+h*.4,f+.05,0,u(a+9)*.9,0,!1).box(h,h*.8,h,t.clone().multiplyScalar(.9),v-i*.1,.3+h*.4,f+d*.5+h*.6,0,u(a+5)*.6,0,!1)}else if(c<.82)for(let d=0;d<3;d++)n.addGeo(new l.SphereGeometry(.34,8,6).scale(.7,.55,1.15),n.mat(v,.5+(d===2?.34:0),f+(d===2?.35:d*.72),0,.2*d,0),o.clone().multiplyScalar(.9+.1*d));else{const d=c>.91?m("#B9AE98").multiplyScalar(.72):m("#CFC6B2").multiplyScalar(.74);n.box(.42,.07,1.7,d,v,.76,f,0,0,0,!1).box(.07,.6,1.7,d,v+i*.2,1.08,f,0,0,i*.12,!1);for(const h of[-1,1])n.box(.4,.46,.07,d,v,.53,f+h*.72,0,0,0,!1)}}}await g.yield(),n.build(we.lit,we.shadow()),n.set(new l.Matrix4),M.add(n.mesh,n.shadow);{const e=n.shadow.material;e.uniforms.uTheta=P.frontU.uTheta,e.uniforms.uHinge=P.frontU.uHinge,e.uniforms.uHole=P.frontU.uHole,e.vertexShader=e.vertexShader.replace("varying float vD;","varying float vD; varying float vZ;").replace("w.y = uY;","w.y = uY; vZ = w.z;"),e.fragmentShader=e.fragmentShader.replace("varying float vD;","varying float vD; varying float vZ; uniform float uTheta; uniform vec2 uHinge; uniform vec4 uHole;").replace("void main() {","void main() { if (vZ < uHinge.y && uHinge.x + (uHole.x - uHole.z) * cos(uTheta) > cameraPosition.y) discard;")}await g.yield(),x.build(we.lit,we.shadow()),x.set(new l.Matrix4),M.add(x.mesh,x.shadow),await g.yield();{const e=new l.BufferGeometry,t=da-.14,s=he+.2,o=Mt+.3,i=[];for(const c of[-1,1])i.push(c*o,t,-fe,0,s,-fe,0,s,-ve,c*o,t,-fe,0,s,-ve,c*o,t,-ve);e.setAttribute("position",new l.Float32BufferAttribute(i,3));const r=new l.ShaderMaterial({uniforms:{...G},vertexShader:`
          varying vec3 vW; varying float vD;
          void main() { vW = position; vec4 mv = viewMatrix * vec4(position, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:I+ma+`
          varying vec3 vW; varying float vD;
          void main() { float fp = max(fwidth(vW.z), 1e-4), a = sfSlat(vW.z, fp);
            float under = step(cameraPosition.y, vW.y - .0);            // from the street we see the underside: slate blue, lit by the pale road
            float i = floor(vW.z / 2.2), hh = fract(sin(i * 91.7) * 4375.85);
            vec3 alb = mix(vec3(.3, .4, .58), vec3(.42, .5, .64), hh);
            vec3 c = mix(alb * (uSunC * .8 + uSkyC * .6), alb * (uSkyC * .3 + uGndC * 1.5), under);
            gl_FragColor = vec4(sfFog(c, vD), a); }`,side:l.DoubleSide,transparent:!0,depthWrite:!1}),a=new l.Mesh(e,r);a.frustumCulled=!1,a.renderOrder=1,M.add(a)}{const e=we.shadow();e.uniforms.uY.value=.312,e.vertexShader=e.vertexShader.replace("varying float vD;","varying float vD; varying float vX;").replace("w.y = uY;","w.y = uY; vX = w.x;"),e.fragmentShader=e.fragmentShader.replace("varying float vD;","varying float vD; varying float vX;").replace("void main() {","void main() { if (abs(vX) < 4.52 || abs(vX) > 17.4) discard;");const t=new l.Mesh(x.mesh.geometry,e);t.frustumCulled=!1,t.renderOrder=2,M.add(t)}await g.yield();{const e=new l.BufferGeometry,t=[],s=[],o=[],i=[],r=new l.Vector3,a=new l.Vector3,c=new l.Vector3;for(const[d,h,p,b,S,D]of mt){r.fromArray(h),a.fromArray(p),c.crossVectors(r,a);for(const[B,T]of[[-1,-1],[1,-1],[1,1],[-1,-1],[1,1],[-1,1]])t.push(d[0]+h[0]*B*b+p[0]*T*S,d[1]+h[1]*B*b+p[1]*T*S,d[2]+h[2]*B*b+p[2]*T*S),s.push(B*(D?b:1),T*(D?S:1)),o.push(c.x,c.y,c.z),i.push(D)}e.setAttribute("position",new l.Float32BufferAttribute(t,3)),e.setAttribute("aUv",new l.Float32BufferAttribute(s,2)),e.setAttribute("aN",new l.Float32BufferAttribute(o,3)),e.setAttribute("aK",new l.Float32BufferAttribute(i,1));const v=new l.ShaderMaterial({uniforms:{...G,uHour:{value:(Fe?1.5:10.5)/12*Math.PI*2}},vertexShader:`
          attribute vec2 aUv; attribute vec3 aN; attribute float aK; varying vec2 vUv; varying vec3 vN; varying float vK; varying float vD;
          void main() { vUv = aUv; vN = aN; vK = aK; vec4 mv = viewMatrix * vec4(position, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:I+`
          uniform float uHour; varying vec2 vUv; varying vec3 vN; varying float vK; varying float vD;
          float hand(vec2 p, float ang, float len, float w) { vec2 d = vec2(sin(ang), cos(ang)); float t = clamp(dot(p, d), -.12, len); return length(p - d * t) - w; }
          void main() { vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) n = -n; vec3 alb;
            if (vK < .5) { float r = length(vUv); if (r > .97) discard;
              float an = atan(vUv.x, vUv.y + step(r, .001)), tk = abs(fract(an * 12. / 6.28318 + .5) - .5);
              alb = vec3(.9, .86, .74);
              alb = mix(alb, vec3(.1, .13, .22), step(tk, .07) * step(.62, r) * step(r, .8));
              float sec = 37.;                                  // (polish4) the clock has stopped: the piano is the street's one pendulum
              float hd = min(hand(vUv, uHour, .42, .055), hand(vUv, 3.2676, .68, .04));   // (lead6) the minute hand stands still, a little past the half hour
              alb = mix(alb, vec3(.08, .1, .16), step(hd, 0.));
              alb = mix(alb, vec3(.2, .36, .7), step(hand(vUv, sec * 6.28318 / 60., .74, .022), 0.));
              alb = mix(alb, vec3(.3, .4, .58), step(r, .07));
              alb = mix(alb, vec3(.16, .22, .36), step(.84, r)); alb = mix(alb, vec3(.8, .78, .7), step(.93, r)); }
            else { vec2 q = vUv; alb = vec3(.07, .1, .19);
              float a = 0.; vec2 top = vec2(0., .95), bob = top + 1.55 * vec2(sin(a), -cos(a));
              vec2 dr = normalize(bob - top); float t = clamp(dot(q - top, dr), 0., 1.55);
              alb = mix(alb, vec3(.42, .47, .56), step(length(q - top - dr * t), .035));
              alb = mix(alb, vec3(.72, .78, .86), step(length(q - bob), .17));          // (polish4) a still steel bob: no brass, no swing
              alb = mix(alb, vec3(.8, .78, .7), max(step(.42, abs(q.x)), step(1.07, abs(q.y)))); }
            gl_FragColor = vec4(sfFog(sfLit(alb, n, 1.), vD), 1.); }`}),f=new l.Mesh(e,v);f.frustumCulled=!1,M.add(f)}const Ue=new l.InstancedBufferGeometry;Ue.copy(new l.PlaneGeometry(1,1)),Ue.setAttribute("aP",new l.InstancedBufferAttribute(new Float32Array(ut.flat()),3)),Ue.instanceCount=ut.length;const Yt={value:0},La=new l.ShaderMaterial({uniforms:{...G,uSpin:Yt},vertexShader:`
        attribute vec3 aP; varying vec2 vUv; varying float vD; varying float vPh;
        void main() { vUv = position.xy * 2.; vPh = aP.z * .37; vec4 mv = viewMatrix * vec4(aP + vec3(position.xy * 5.6, 0.), 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:I+`
        uniform float uSpin; varying vec2 vUv; varying float vD; varying float vPh;
        void main() { float r = length(vUv), an = atan(vUv.y, vUv.x + 1e-5 * step(abs(vUv.x) + abs(vUv.y), 0.)) + uSpin + vPh;
          float sec = fract(an * 12. / 6.28318), sail = step(sec, .62) * step(.3, r) * step(r, .97);
          float rim = step(abs(r - .97), .025) + step(abs(r - .62), .02) + step(abs(r - .3), .025), hub = step(r, .09);
          if (sail + rim + hub < .5) discard;
          // galvanised sails set at a pitch: each catches the sky on one edge and is in its own shade at the other; the sun stands beyond them
          vec3 c = vec3(.62, .68, .76) * (uSkyC * (.75 + .5 * sec) + uSunC * .5 * step(sec, .18) * sail + uGndC * 1.2);
          c = mix(c, vec3(.1, .11, .13), max(hub, rim * (1. - sail)) * .8);
          gl_FragColor = vec4(sfFog(c, vD), 1.); }`,side:l.DoubleSide}),$t=new l.Mesh(Ue,La);$t.frustumCulled=!1,M.add($t);const Re=new Float32Array(513);{let e=0;for(let t=0;t<=512;t++){const s=t/512,o=Math.max(P.gale(s),s>.67?P.gale(.669)*Math.exp(-(s-.67)*ce/1.5):0)*5.2;Re[t]=e,e+=o*ce/512}}const re=new l.InstancedBufferGeometry;re.copy(new l.PlaneGeometry(1,1,12,6));const Qt=new Float32Array(R.length*3),Jt=new Float32Array(R.length*4),ea=new Float32Array(R.length*3);R.forEach((e,t)=>{Qt.set([e[0],e[1],e[2]],t*3),Jt.set([e[3],e[4],e[5],e[6]],t*4),ea.set([e[7].r,e[7].g,e[7].b],t*3)}),re.setAttribute("aPos",new l.InstancedBufferAttribute(Qt,3)),re.setAttribute("aDim",new l.InstancedBufferAttribute(Jt,4)),re.setAttribute("aCol",new l.InstancedBufferAttribute(ea,3)),re.instanceCount=R.length;const Ga=new l.ShaderMaterial({uniforms:{...G,uGale:te,uTime:X,uSwing:De},vertexShader:`
        attribute vec3 aPos; attribute vec4 aDim; attribute vec3 aCol; uniform float uGale; uniform float uTime; uniform float uSwing;
        varying vec3 vC; varying vec3 vN; varying float vD; varying float vK; varying vec4 vF; varying vec3 vS;
        void main() {
          float k = .5 - position.y, xn = position.x, sd = aDim.z, stiff = step(.75, aDim.w);
          float flut = sin(uTime * (4. + 2. * sd) + sd * 40.) * .5 + .5;
          float blow = smoothstep(0., .22, uGale);   // any gale at all lays the washing out flat downwind: thin streaming strips, not hanging squares
          float calm = (1. - blow) * (1. - stiff);   // no wind: it hangs from its pegs in folds
          // (flight1) the gale comes in gusts that travel down the street at us: as one passes a line its washing is lifted flatter ("streaming flat
          // downwind"), more so the harder it blows, and sinks back after it; the road's shadow of the line reads the same gust
          float gust = .5 + .5 * sin(uTime * 1.3 - aPos.z * .07 + 1.2 * sin(uTime * .7 - aPos.z * .031));   // a crest keeps its phase where z grows by 1.3 / .07 = 18.6 m a second: toward us, at a gale's speed; 90 m from crest to crest (three lines)
          float a = mix(blow * (.66 + .36 * uGale + .1 * sin(uTime * 3.3 + sd * 17.) + (.2 + .2 * uGale) * gust), uGale * (.3 + .42 * flut), stiff) + uSwing * sin(uTime * (2.1 + 1.1 * sd) + sd * 9.) * (1. - .4 * stiff);
          a = min(a, 1.45);
          float ak = mix(a * (.6 + .4 * k), a, stiff);
          // pegged at its corners (a sheet in the middle too): the top edge scallops between the pegs, the cloth gathers into vertical folds
          // that deepen toward the hem, and the hem hangs a little lower in the middle
          float seg = aDim.x > 1. ? 2. : 1., scal = abs(sin(3.14159 * (xn + .5) * seg));
          float fph = xn * (8. + 5. * sd) + sd * 40., fold = sin(fph) * .7 + sin(fph * 2.3 + sd * 70.) * .3;
          float amp = (.02 + .085 * k) * calm;
          float xw = xn * aDim.x * (1. - .09 * k * calm);
          float yl = aDim.y * k + (scal * .085 * exp(-k * 3.5) + .06 * (1. - 4. * xn * xn) * k * k + .02 * fold * k) * calm;
          vec3 p = aPos + vec3(xw, -cos(ak) * yl - .22 * stiff, sin(ak) * yl);
          float bow = (1. - stiff) * (1. - aPos.x * aPos.x / 49.) * step(-440., aPos.z); p.z += bow * uGale * 1.3; p.y -= bow * (.45 - .4 * uGale);   // the line it hangs from sags, and bows downwind
          vec3 nn = vec3(0., sin(ak), cos(ak));
          float wave = (1. - stiff) * uGale * k * .26 * sin(k * 8. - uTime * 11. + sd * 30. + position.x * 3.);
          p += nn * (wave + fold * amp); vN = normalize(nn + vec3(0., 0., .3 * (1. - stiff) * uGale * cos(k * 8. - uTime * 11. + sd * 30.)));
          vC = aCol; vK = stiff; vF = vec4(xn, calm, k, sd); vS = vec3(aDim.xy, aDim.w);
          vec4 mv = viewMatrix * vec4(p, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:I+`
        varying vec3 vC; varying vec3 vN; varying float vD; varying float vK; varying vec4 vF; varying vec3 vS;
        void main() {
          float xn = vF.x, calm = vF.y, k = vF.z, sd = vF.w, fq = 8. + 5. * sd, fph = xn * fq + sd * 40.;
          // cut to its shape: a shirt (a body and two sleeves, a notch for the neck), long johns (two legs), or a plain sheet
          float kd = vS.z, ax = abs(xn);
          if (kd > .2 && kd < .3 && ((k > .4 && ax > .27) || (k < .1 && ax < .1) || (k > .3 && k < .42 && ax > .27 && ax < .31))) discard;
          if (kd > .4 && kd < .6 && ((k > .42 && ax < .05 + .05 * (k - .42)) || (k < .3 && ax > .4))) discard;
          float fold = sin(fph) * .7 + sin(fph * 2.3 + sd * 70.) * .3, dfold = (cos(fph) * .7 + cos(fph * 2.3 + sd * 70.) * .69) * fq;
          float amp = (.02 + .085 * k) * calm;
          vec3 n = normalize(vN + vec3(-dfold * amp / max(vS.x, .1), 1e-5, 0.)); if (!gl_FrontFacing) n = -n;
          // a shop sign: a pale moulding round the board and one plain painted shape on it (a disc, a lozenge or two bars), no letters
          vec3 alb = vC;
          // some sheets are striped ticking: blue or straw on white
          { float stp = step(.64, fract(sd * 5.3)) * (1. - vK) * step(kd, .1) * step(.3, dot(vC, vec3(.34)));
            vec3 sc = mix(vec3(.2, .36, .66), vec3(.42, .52, .68), step(.6, fract(sd * 11.7)));
            alb = mix(alb, sc, stp * step(.62, fract(xn * vS.x / .34 + sd * 3.))); }
          if (vK > .5) { vec2 q = vec2(xn * 2., k * 2. - 1.); float asp = vS.x / max(vS.y, .1);
            float e = min((1. - abs(q.x)) * vS.x, (1. - abs(q.y)) * vS.y) * .5, k1 = fract(sd * 7.7);
            vec2 qa = vec2(q.x * asp, q.y);
            float dv = k1 < .34 ? length(qa) - .58 : (k1 < .67 ? abs(qa.x) * .62 + abs(q.y) - .62 : max(abs(qa.x) - 1.25, abs(abs(q.y) - .3) - .13));
            vec3 pale = vec3(.74, .72, .66);
            alb = mix(alb, pale, step(dv, 0.)); alb = mix(alb, pale, step(e, .075)); alb *= 1. - .25 * step(abs(e - .075), .012); }
          vec3 c = sfLit(alb, n, 1.) * mix(.8, 1.25, vK) * (1. - .06 * calm);
          // the sun stands beyond the cloth: a single thickness glows warm white with it, the hollows of the folds stay blue
          float ridge = smoothstep(-.5, .8, fold * (gl_FrontFacing ? 1. : -1.)), dp = calm * smoothstep(.0, .5, k);
          c += alb * uSunC * (.56 + .1 * calm + (.62 * ridge - .16) * dp) * (1. - vK) * (1. - max(dot(n, uSun), 0.));
          c *= mix(vec3(1.), vec3(.56, .68, .96), (1. - ridge) * dp * .9);
          // a doubled hem and a turned top edge, a shade darker; wooden pegs on the line
          c *= 1. - (.2 * step(.94, k) + .12 * step(k, .04) + .12 * step(.47, ax)) * (1. - vK);
          // (polish3) a hanging sheet is a made thing: two woven blue bands above its hem, and when it hangs limp its folds are drawn harder
          c = mix(c, c * vec3(.42, .56, .92), (step(.8, k) * step(k, .835) + step(.86, k) * step(k, .875)) * step(kd, .1) * (1. - vK) * step(.25, fract(sd * 3.1)));
          c *= 1. - .22 * calm * smoothstep(.2, -.6, fold) * smoothstep(.1, .6, k) * (1. - vK);
          float pgx = min(abs(abs(xn) - .46), vS.x > 1. ? abs(xn) : 9.) * vS.x;
          c = mix(c, vec3(.3, .22, .13), step(pgx, .017) * step(k * vS.y, .085) * (1. - vK));
          gl_FragColor = vec4(sfFog(c, vD), 1.); }`,side:l.DoubleSide}),ta=new l.Mesh(re,Ga);ta.frustumCulled=!1,M.add(ta);const Wa={shared:G,uRes:Me},aa=[];for(const e of Te){const t=Na(Wa,8);t.u.uA.value.set(-7,5.52,-e),t.u.uB.value.set(7,5.52,-e),t.u.uW.value=.025,t.u.uCol.value.set("#7D6E58").multiplyScalar(2.2),M.add(t.mesh),aa.push(t.u)}await g.yield();const pt=Math.round(800*V),oa=new Float32Array(pt*4);for(let e=0;e<pt;e++)oa.set([(u(e*3.1+900)-.5)*13,.25+5.2*u(e*5.7+1700)*u(e*1.3+77),-328-100*u(e*7.9+2500),u(e*11.3+3300)],e*4);const He=new l.InstancedBufferGeometry;He.copy(new l.PlaneGeometry(1,1)),He.setAttribute("aM",new l.InstancedBufferAttribute(oa,4)),He.instanceCount=pt;const Ba=new l.ShaderMaterial({uniforms:{uTime:X,uLull:ot,uRes:Me,uSunC:G.uSunC},vertexShader:`
        attribute vec4 aM; uniform float uTime; uniform float uLull; uniform vec2 uRes; varying vec2 vUv; varying float vA;
        void main() {
          vec3 c = aM.xyz + vec3(sin(uTime * .31 + aM.w * 40.), sin(uTime * .23 + aM.w * 17.) * .6, cos(uTime * .27 + aM.w * 29.)) * .25;
          vec4 mv = viewMatrix * vec4(c, 1.); float d = max(-mv.z, .01);
          float veil = step(aM.w, .11);            // one in nine is not a mote but a wide faint sheet of the hanging dust, low over the road
          c.y = mix(c.y, .22 + .55 * fract(aM.w * 53.), veil); mv = viewMatrix * vec4(c, 1.); d = max(-mv.z, .01);
          float sz = max(.016 + .02 * fract(aM.w * 7.3), 1.7 * d / max(uRes.y * .5 * projectionMatrix[1][1], 1.));
          mv.xy += position.xy * mix(vec2(sz * 2.), vec2(4.2, .95) * (.7 + 5. * aM.w), veil);
          vA = uLull * mix(smoothstep(.8, 2.6, d) * (1. - smoothstep(22., 60., d)) * (.4 + .6 * sin(uTime * (1.3 + 2.2 * fract(aM.w * 3.1)) + aM.w * 50.)),
            .3 * smoothstep(3.5, 9., d) * (1. - smoothstep(45., 90., d)) * (.75 + .25 * sin(uTime * .5 + aM.w * 90.)), veil);
          vUv = uv; gl_Position = projectionMatrix * mv; }`,fragmentShader:`
        uniform vec3 uSunC; varying vec2 vUv; varying float vA;
        void main() { vec2 p = vUv - .5; float a = clamp(1. - dot(p, p) * 4., 0., 1.); a *= a;
          gl_FragColor = vec4(uSunC * vec3(1., .93, .78) * .9 * a * max(vA, 0.), 1.); }`,transparent:!0,depthWrite:!1,blending:l.AdditiveBlending}),xt=new l.Mesh(He,Ba);xt.frustumCulled=!1,xt.renderOrder=6,M.add(xt),await g.yield();const yt=Math.round(110*V),sa=new Float32Array(yt*4);for(let e=0;e<yt;e++)sa.set([(e%2?1:-1)*(1.9+2.5*u(e*3.3+4100)),u(e*5.9+4300),u(e*7.7+4500),.8+.7*u(e*9.1+4700)],e*4);const _e=new l.InstancedBufferGeometry;_e.copy(new l.PlaneGeometry(1,1)),_e.setAttribute("aR",new l.InstancedBufferAttribute(sa,4)),_e.instanceCount=yt;const bt={value:0},Ta=new l.ShaderMaterial({uniforms:{...G,uCamZ:bt,uDrift:tt,uGale:te,uTime:X},vertexShader:`
        attribute vec4 aR; uniform float uCamZ; uniform float uDrift; uniform float uGale; uniform float uTime;
        varying vec2 vUv; varying vec3 vA; varying float vD;
        void main() {
          float L = 110., zr = mod(aR.y * L + uDrift * (.75 + .5 * aR.z), L), z = uCamZ - L + zr + 5.;
          float x = aR.x + .45 * sin(uTime * .9 + aR.z * 40. + zr * .08);
          float w = aR.w * (1.5 + 1.3 * aR.z), h = aR.w * (.36 + .42 * fract(aR.z * 7.3));
          vec4 mv = viewMatrix * vec4(x, .06 + h * .5, z, 1.); mv.xy += position.xy * vec2(w, h);
          vD = length(mv.xyz); vUv = uv;
          float g = uGale * (.45 + .55 * uGale) * step(-427., z) * step(fract(aR.z * 13.7), .3 + .7 * uGale);
          vA = vec3(g * smoothstep(3.5, 10., vD) * (1. - smoothstep(55., 100., vD)), aR.z, zr);
          gl_Position = projectionMatrix * mv; }`,fragmentShader:I+Dt+`
        varying vec2 vUv; varying vec3 vA; varying float vD;
        void main() { vec2 p = vUv - .5;
          // a torn sheet hugging the ground: full along its foot, combed out along the wind, ragged on top
          float n = vn(vec2(p.x * 3. + vA.y * 31., p.y * 2. + vA.z * .35)) * .6 + vn(vec2(p.x * 9. + vA.y * 57., p.y * 5.)) * .4;
          float body = (1. - 4. * p.x * p.x) * (1. - smoothstep(.25 + .5 * n, 1.01, vUv.y)) * smoothstep(0., .12, vUv.y);
          float a = clamp(body * (.45 + .9 * n) - .12, 0., 1.);
          vec3 c = mix(vec3(.56, .58, .66), uSunC * vec3(1.34, 1.14, .8), smoothstep(.1, .7, vUv.y + (n - .5) * .5));
          gl_FragColor = vec4(sfFog(c, vD), a * clamp(vA.x, 0., 1.) * .66); }`,transparent:!0,depthWrite:!1}),wt=new l.Mesh(_e,Ta);wt.frustumCulled=!1,wt.renderOrder=4,M.add(wt),await g.yield();const Ie=Math.round(520*V),gt=new Float32Array((Ie+Math.round(210*V)+8)*4);let na=Ie;for(let e=0;e<Ie;e++){const t=u(e*2.3+500),s=u(e*9.1+600)<.45;let o=(u(e*3.7+510)-.5)*25,i=-437-74*u(e*5.3+520);s&&(t<.5?o=(t<.25?-1:1)*(12.6-1.4*u(e*1.9)*u(e*4.1)):i=-511.4+2.2*u(e*1.9)*u(e*4.1)),!s&&Math.abs(o)<8.4&&(o=(o<0?-1:1)*(8.4+4.2*u(e*3.7+515)));const r=.3+.5*u(e*6.7+530)*(s?1.3:1);gt.set([o,i,Math.abs(o)<8.4?Math.min(r,.26):r,u(e*8.9+540)],e*4)}{const e=[j.x0,-j.d0],t=[j.x1,-j.d1],s=Math.hypot(t[0]-e[0],t[1]-e[1]),o=(t[1]-e[1])/s,i=(e[0]-t[0])/s,r=Math.round(2*(s-2.2)/.3*V);let a=Ie;for(let c=0;c<r;c++){const v=c%2?1:-1,f=(2.2+(s-2.2)*u(c*2.9+700))/s,h=u(c*4.7+710)<.667?-(.12+.48*u(c*6.1+720)*u(c*3.3+725)):.05+.3*u(c*6.1+720),p=e[0]+(t[0]-e[0])*f-h*o,b=e[1]+(t[1]-e[1])*f-h*i;p<4.4||(gt.set([v*p,b,.22+.23*u(c*8.3+730),u(c*9.7+740)],a*4),a++)}na=a}const Ke=new l.InstancedBufferGeometry;Ke.copy(new l.PlaneGeometry(1,1).translate(0,.5,0)),Ke.setAttribute("aT",new l.InstancedBufferAttribute(gt,4)),Ke.instanceCount=na;const Pa=new l.ShaderMaterial({uniforms:{...G,uTime:X,uGale:te},vertexShader:`
        attribute vec4 aT; uniform float uTime; uniform float uGale; varying vec2 vUv; varying float vD; varying float vSd;
        void main() { vec3 rt = normalize(vec3(viewMatrix[0][0], 0., viewMatrix[2][0]) + vec3(1e-5, 0., 0.));
          float lean = position.y * position.y * (.25 + 1.6 * uGale + .5 * uGale * sin(uTime * 5. + aT.w * 40. + aT.x));
          vec3 p = vec3(aT.x, 0., aT.y) + rt * position.x * aT.z * 1.5 + vec3(0., position.y * aT.z, lean * aT.z);
          vUv = vec2(position.x, position.y); vSd = aT.w;
          vec4 mv = viewMatrix * vec4(p, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:I+`
        varying vec2 vUv; varying float vD; varying float vSd;
        void main() { float hit = 0., sh = 0.;
          for (int i = 0; i < 9; i++) { float fi = float(i), r1 = fract(sin(fi * 12.9 + vSd * 91.) * 437.5), r2 = fract(sin(fi * 7.3 + vSd * 57.) * 917.3);
            float x0 = (r1 - .5) * .5, h = .5 + .5 * r2, bend = (r1 - .5) * .9;
            float d = abs(vUv.x - x0 - bend * vUv.y * vUv.y) - .05 * (1. - vUv.y / h);
            if (d < 0. && vUv.y < h) { hit = 1.; sh = r2; } }
          if (hit < .5) discard;
          // dry straw, paler toward the tips where the sun comes through from beyond
          vec3 alb = mix(vec3(.3, .25, .09), vec3(.8, .6, .22), vUv.y) * (.7 + .5 * sh);
          vec3 c = alb * (uSunC * (.35 + .65 * vUv.y) + uSkyC * .5);
          gl_FragColor = vec4(sfFog(c, vD), 1.); }`,side:l.DoubleSide}),la=new l.Mesh(Ke,Pa);la.frustumCulled=!1,M.add(la),await g.yield();const ra={value:0},ia={value:1},Ne=new Float32Array(513);{let e=0;for(let t=0;t<=512;t++)Ne[t]=e,e+=P.gale(t/512)*8.5*ce/512}const ca=`
      attribute vec4 aR; attribute vec3 aC; uniform float uCamZ; uniform float uTravel; uniform float uGale; uniform float uTime; uniform float uTumK;
      float tBase;
      vec3 tumble(vec3 pos, out vec3 nrm, out float live) {
        float g = min(uGale * 2.2, 1.);
        vec2 sz = vec2(.28, .36) * (.8 + .45 * fract(aR.x * 7.3));
        float zw = -aR.y * 520. + uTravel * (.65 + .7 * aR.z), L = 96.;
        float z = uCamZ - 84. + mod(zw - (uCamZ - 84.), L);
        float sgn = aR.x < .5 ? -1. : 1.;
        float ax = 4.08 + 2.2 * fract(aR.x * 13.7) + .06 * sin(zw * .11 + aR.x * 40.);
        tBase = step(4.5, ax) * .3;
        float ph = zw * (.45 + .4 * fract(aR.x * 3.1)) + aR.y * 50.;
        float top = .12 + .5 * fract(aR.z * 5.3);
        float y0 = top * abs(sin(ph)) * g;
        float a = (fract(ph * 2.3 / 6.2832) - .5) * 6.2832 * g, yaw = aR.z * 6.2832 + .7 * sin(ph * .7);
        vec3 q = vec3(pos.x * sz.x, 0., pos.y * sz.y);
        q.y += (sin(pos.x * 6.5 + uTime * 7. + aR.x * 30.) * .16 * sz.x + .22 * sz.y * sin(pos.y * 3.6 + ph)) * (.3 + .7 * g) * .35;
        float ca = cos(a), sa = sin(a), cy = cos(yaw), sy = sin(yaw);
        q = vec3(q.x, q.y * ca - q.z * sa, q.y * sa + q.z * ca); nrm = vec3(0., ca, sa);
        q = vec3(q.x * cy + q.z * sy, q.y, -q.x * sy + q.z * cy); nrm = vec3(nrm.z * sy, nrm.y, nrm.z * cy);
        live = max(smoothstep(-400., -394., z), 1. - smoothstep(-442., -438., z)) * smoothstep(-469., -465., z) * smoothstep(-84., -76., z - uCamZ);
        live *= mix(smoothstep(20., 24., uCamZ - z), 1., uTumK) * step(-414., z);          // (and none by the set-back fronts or in the lot)
        q *= live;
        return vec3(sgn * ax, tBase + y0 + .035 + .5 * sz.y * abs(sa) * live, z) + q; }`,Oe=Math.max(24,Math.round(44*V)),ie=new l.InstancedBufferGeometry;ie.copy(new l.PlaneGeometry(1,1,8,8));{const e=new Float32Array(Oe*4),t=new Float32Array(Oe*3),s=[F("#F4F1E8",.86),F("#F4F1E8",.86),F("#C9D6E6",.84),F("#D9B25A",.8),F("#5E86C4",.7)];for(let o=0;o<Oe;o++){const r=s[o%3];e.set([u(o*1.7+200),u(o*3.1+210),u(o*5.9+220),0],o*4),t.set([r.r,r.g,r.b],o*3)}ie.setAttribute("aR",new l.InstancedBufferAttribute(e,4)),ie.setAttribute("aC",new l.InstancedBufferAttribute(t,3)),ie.instanceCount=Oe}const fa={...G,uShadeC:{value:new l.Color(.105,.13,.2)},uCamZ:bt,uTravel:ra,uGale:te,uTime:X,uTumK:ia},qa=new l.ShaderMaterial({uniforms:fa,side:l.DoubleSide,vertexShader:ca+`
        varying vec3 vC; varying vec3 vN; varying float vD; varying vec2 vUv; varying float vBig; varying float vSeed;
        void main() { vec3 n; float live; vec3 w = tumble(position, n, live); vC = aC; vN = n; vUv = uv; vBig = aR.w; vSeed = aR.x;
          vec4 mv = viewMatrix * vec4(w, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:I+`
        varying vec3 vC; varying vec3 vN; varying float vD; varying vec2 vUv; varying float vBig; varying float vSeed;
        void main() { vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
          // thin stuff with the sun beyond it: lit through from either side, blue only where it turns edge-on to the light
          float nl = abs(dot(n, uSun)); vec3 alb = vC;
          // cloth is torn at its edges and falls in folds: sun on the ridges, the street's blue in the valleys
          float e = min(min(vUv.x, 1. - vUv.x), min(vUv.y, 1. - vUv.y));
          if (vBig > .5 && e < .04 + .035 * sin(vUv.x * 19. + vSeed * 40.) * sin(vUv.y * 15. + vSeed * 23.)) discard;
          float folds = sin(vUv.x * 9. + vSeed * 20. + 1.8 * sin(vUv.y * 4.4 + vSeed * 7.)) * step(.5, vBig);
          vec3 c = alb * (uSunC * (.22 + .7 * nl) * (.74 + .3 * folds) + uSkyC * .95 + uGndC * 1.5);
          c = mix(c, c * vec3(.6, .73, 1.02), (1. - smoothstep(-.7, .1, folds)) * .7 * step(.5, vBig));
          gl_FragColor = vec4(sfFog(c, vD), 1.); }`}),Ea=new l.ShaderMaterial({uniforms:fa,side:l.DoubleSide,transparent:!0,depthWrite:!1,blending:l.CustomBlending,blendEquation:l.MinEquation,blendSrc:l.OneFactor,blendDst:l.OneFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:ca+`
        uniform vec3 uSun; varying float vD;
        void main() { vec3 n; float live; vec3 w = tumble(position, n, live);
          float t = max(w.y - tBase - .012, 0.) / max(uSun.y, 1e-3); w.xz -= uSun.xz * t; w.y = tBase + .012;
          vec4 mv = viewMatrix * vec4(w, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:`
        uniform vec3 uShadeC; uniform vec3 uFogC; uniform float uFogD; varying float vD;
        void main() { float f = 1. - exp(-uFogD * uFogD * vD * vD); gl_FragColor = vec4(mix(uShadeC, uFogC, f), 1.); }`}),va=new l.Mesh(ie,qa),zt=new l.Mesh(ie,Ea);va.frustumCulled=!1,zt.frustumCulled=!1,zt.renderOrder=2,M.add(va,zt),await g.yield();const Ua=Ha([[0,Xe,0],[0,Xe,-y/2],[0,Xe,-y]]);return{scene:M,path:Ua,duration:ce,pace:()=>1,title:Ce==="opera"?"Stone Face: the Opera House":Ce==="bank"?"Stone Face: the Bank":"Stone Face",ride:"none",style:"none",companion:"none",camera:{fov:62,near:.3,nearThrough:.3,far:3e3,lookAhead:40,sway:0,bank:0},pois:[],portal:{shape:"rect",width:5.2,height:4.9,halo:!1,style:"ring",color:"#F4F1E8",glow:.8,revealDistance:120,blendDistance:25},post:{exposure:1,bloom:{strength:.12,radius:.5,threshold:1},grade:{saturation:1.15,contrast:1.12,vignette:.16,grain:.02}},debug:{report:P.report,vary:{sx:A,slot2:At,kind:Ce,lateHour:Fe,rare:Lt}},update(e,t,s,o){const i=P.update(e,t,s,o);te.value=i,X.value=t,bt.value=s.matrixWorld.elements[14];{const r=P.hat.state,a=r.y<.6?1:0;Wt.value.set(.15*Math.sin(Math.PI*2*1.1*t%(Math.PI*2)),r.pos.z+.06,a,Math.PI*2*1.1*t%(Math.PI*2))}for(const r of aa)r.uBow.value=i*1.3,r.uSag.value=.45-.4*i;De.value=.045+.42*l.MathUtils.smoothstep(o,.668,.69)*Math.exp(-Math.max(o-.69,0)*ce*1.3);{const r=pa.dH+s.matrixWorld.elements[14],a=P.frontU.uTheta.value,c=r>12&&a<1.2;Bt.uniforms.uWin.value.set(c?6.2/r:0,c?Math.max(0,(11.3*Math.cos(a)-Xe)/Math.max(r-11.3*Math.sin(a),1)):0,c?1+l.MathUtils.smoothstep(a,.12,.6):0)}ue.value=(t*.22+o*ce*.5)%3400,at.value=l.MathUtils.smoothstep(o,.848,.868),tt.value=t*17%4e4;{let r=1-l.MathUtils.smoothstep(P.frontU.uTheta.value,.03,.3);for(const[a,c]of[[.147,.122],[.245,.2535],[.366,.366],[.488,.488],[.59,.649]])r*=1-l.MathUtils.smoothstep(o,a-.06,a-.04)*(1-l.MathUtils.smoothstep(o,c+.004,c+.02));Ae.value=r*(1-l.MathUtils.smoothstep(o,.652,.668))}{let r=1;for(const[a,c]of[[.085,.15],[.21,.27],[.33,.39],[.45,.51],[.555,.67]])r*=1-l.MathUtils.smoothstep(o,a-.014,a-.002)*(1-l.MathUtils.smoothstep(o,c+.002,c+.014));ia.value=r}{const r=l.MathUtils.clamp(o,0,1)*512,a=Math.min(511,Math.floor(r));Yt.value=-(Re[a]+(Re[a+1]-Re[a])*(r-a))-(o<=0?t*1.8:0)}{const r=l.MathUtils.clamp(o,0,1)*512,a=Math.min(511,Math.floor(r));ra.value=Ne[a]+(Ne[a+1]-Ne[a])*(r-a)+(o<=0?t*3%5e3:0)}ot.value=l.MathUtils.smoothstep(o,.672,.7)*(1-l.MathUtils.smoothstep(o,.8,.845))},dispose(){P.dispose()}}}};export{ao as default};
