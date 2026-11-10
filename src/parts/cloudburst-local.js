import*as q from"three";import{clamp as _t,lerp as it,smoothstep as st}from"../kit/core.js";const zt=["#2B2F52","#7C8C9A","#6E1F26","#EAD9B0","#1F6FC0","#FFC56B","#B79A6A"],n={IRON:0,STONE:1,ARCADE:2,CORR:3,GLASS:4,WOOD:5,PAVE:6,BRICK:7,LATTICE:8,VALANCE:9,GLOW:10,SLATE:11,MATTE:12,ARCLIT:13,BRASS:14,CHAWL:15,VIADUCT:16,COACH:17,TILE:18,DOME:19,FIRE:20,SPILL:21,RAIL:22,PAINT:23,COAL:24},nt=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uHorizCol, uStormCol, uAmbCol, uGroundCol, uFillCol, uStormDir;
uniform float uSun, uWet, uFresh, uTime, uLamp, uRain;
uniform vec4 uPud[6];       // the placed puddles on the throat's ground: centre x, z and half sizes (0 = none)
uniform vec4 uEdge;
uniform vec4 uGndK;       // the ground by hour: wet ballast albedo, sky mirror, hard shadow under the gantries, ground steam
uniform vec2 uPaintLo;    // the least an engine's enamel shows in its weaker channels (red or green, blue), set by the hour's exposure and tint
float gSkyK = 1., gSpecK = 1., gSunK = 1.;      // set by the ground shaders before shadeSurf: sky mirror, broad sun lobe, cast shadow
vec3 gSheenT = vec3(1.);                         // set by the surface shader: the hue an engine's enamel gives the sky it carries (white: bare wet iron)
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ return vn(p) * .5 + vn(p * 2.03 + 7.1) * .25 + vn(p * 4.1 + 3.7) * .125 + vn(p * 8.3 + 1.3) * .125; }
// analytic sky used for reflections: lemon horizon, clear blue above, the indigo wall toward uStormDir
vec3 skyRefl(vec3 d){
  float h = clamp(d.y, 0., 1.);
  vec3 c = mix(uHorizCol, uSkyCol, smoothstep(.06, .8, h));
  vec2 dh = d.xz + vec2(1e-4, 0.);
  float s = dot(dh / max(length(dh), 1e-4), uStormDir.xz);
  c = mix(c, uStormCol, smoothstep(-.25, .6, s) * smoothstep(.015, .2, h) * .9);
  return c;
}
// height of the shed roof skin over x (semicircular spans on 8.5 m columns)
float roofY(float x){ float xs = mod(x + 62.5, 25.) - 12.5; return 8.5 + sqrt(max(156.25 - xs * xs, 0.)); }
float inShed(vec3 p){
  return step(p.z, .3) * step(-141., p.z) * step(abs(p.x + 12.5), 50.4) * step(p.y, roofY(p.x) - .25);
}
// 1 = direct sun reaches p (cloud-shadow edge outside, shafts through the west flank inside)
float sunVis(vec3 p){
  float e = smoothstep(-uEdge.w, uEdge.w, uEdge.z - dot(p.xz, uEdge.xy));
  float ins = inShed(p);
  float t = (37.5 - p.x) / max(uSunDir.x, .05);
  vec3 q = p + uSunDir * t;
  float bay = abs(fract(q.z / 17.5 + .25) - .5);
  float stripe = smoothstep(.2, .09, bay);
  float low = smoothstep(9.2, 7.6, q.y) * smoothstep(.07, .12, abs(fract(q.z / 8.75) - .5) + .07);
  float high = stripe * smoothstep(19., 15., q.y) * .85;
  float shaft = max(low, high) * smoothstep(-141., -134., p.z) * smoothstep(-6., 3., q.z);
  return e * mix(1., shaft, ins);
}
float shedAO(vec3 p){ return mix(1., .5 + .3 * smoothstep(-30., 0., p.z), inShed(p)); }
// the shed's hanging gas lamps (one under each crown, every third rib): a warm pool round each and a low glow under the whole roof
vec3 shedLamps(vec3 p, vec3 N){
  float xs = mod(p.x + 62.5, 25.) - 12.5, zl = mod(p.z + 30.625, 26.25) - 13.125;
  vec3 L = vec3(-xs, 9.6 - p.y, -zl);
  float d2 = dot(L, L);
  float ndl = max(dot(N, L) / sqrt(d2 + 1e-3) * .6 + .4, 0.);
  float pool = (1. - smoothstep(150., 400., d2)) / (1. + d2 / 50.);
  return vec3(1.5, .86, .36) * (inShed(p) * max(uLamp, .4) * (.1 + .6 * pool * ndl));
}
vec3 shadeSurf(vec3 alb, vec3 N, vec3 V, vec3 pL, float gloss, float wet){
  float vis = sunVis(pL) * gSunK;
  float ao = shedAO(pL);
  float ndl = dot(N, uSunDir);
  float dif = clamp(ndl * .8 + .2, 0., 1.);
  vec3 sun = uSunCol * (uSun * vis * dif);
  vec3 amb = mix(uGroundCol, uAmbCol, N.y * .5 + .5) * ao;
  amb += uFillCol * (max(dot(N, uStormDir), 0.) * .6 + .1) * ao;
  amb += uSunCol * uSun * .06 * ao * (1. - .5 * N.y);            // warm bounce off wet ground
  amb += uSunCol * (uSun * inShed(pL) * (.04 + .13 * max(N.x, 0.)) * smoothstep(-80., 37., pL.x));   // glow of the west arcade
  amb += shedLamps(pL, N);
  vec3 a = alb * mix(1., .62, wet);
  vec3 col = a * (sun + amb);
  vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
  float nh = max(dot(N, H), 0.);
  float sp = pow(nh, mix(14., 90., gloss)) * (.12 + 1.6 * wet) * gloss;
  col += uSunCol * (uSun * vis * sp * step(0., ndl) * gSpecK);
  float F = 1. - max(dot(N, V), 0.); F = F * F * F * F * F;
  vec3 Rr = reflect(-V, N);
  col += skyRefl(Rr) * mix(gSheenT, vec3(1.), .4) * (F * (.08 + .55 * wet) * gloss * ao * gSkyK);
  float up = max(Rr.y, 0.);
  col += uAmbCol * gSheenT * (up * up * wet * gloss * .5 * (1. - .8 * uSun) * ao);     // overcast sheen on wet iron and roofs
  return col;
}
`,Lt=`
attribute vec3 aCol; attribute float aK;
#ifdef ARMS
attribute vec4 aPiv; attribute vec3 aArm; uniform float uProg;
#endif
varying vec3 vL, vN, vC; varying vec2 vUv; varying float vK;
#include <fog_pars_vertex>
void main(){
  vec3 p = position, n = normal;
#ifdef ARMS
  // semaphore arm: rotate about the pivot's Z axis. aArm = (drop angle, state before, bounce phase)
  float s = smoothstep(aPiv.w, aPiv.w + .022, uProg);
  float st = mix(aArm.y, 1. - aArm.y, s);
  float bounce = sin((uProg - aPiv.w) * 900.) * exp(-max(uProg - aPiv.w, 0.) * 160.) * step(aPiv.w, uProg) * .12;
  float a = aArm.x * (st + bounce);
  float ca = cos(a), sa = sin(a);
  vec2 d = p.xy - aPiv.xy;
  p.xy = aPiv.xy + vec2(d.x * ca - d.y * sa, d.x * sa + d.y * ca);
  n.xy = vec2(n.x * ca - n.y * sa, n.x * sa + n.y * ca);
#endif
  vL = p; vN = n; vC = aCol; vUv = uv; vK = aK;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,yt=`
uniform vec3 uCamL;
#ifdef DOOR
uniform float uRainCam; uniform vec2 uTrackR;
#endif
varying vec3 vL, vN, vC; varying vec2 vUv; varying float vK;
#ifdef TINTED
varying float vLit;
#endif
#include <fog_pars_fragment>
${nt}
// rain on a wet side: separate threads of water, each with beads running down it (c: metres across the side, y: metres up,
// fc: how much of c one pixel covers). A thread is never thinner than a pixel and a half; where the threads would be finer
// than the pixels the side takes their average, so nothing is ever stretched into a smear
float rivulets(float c, float y, float fc){
  float q = c / .034, id = floor(q), fx = abs(fract(q) - .5), h = h21(vec2(id, 7.31));
  float aa = max(fc / .034, 1e-3);
  float hw = .07 + .09 * fract(h * 13.7);
  float line = 1. - smoothstep(hw, hw + aa * 1.5, fx);
  float ph = fract(y * (.5 + .7 * fract(h * 3.1)) + uTime * (.25 + .9 * fract(h * 5.3)) + h * 9.);
  float bead = smoothstep(0., .05, ph) * (1. - smoothstep(.05, .5, ph));
  return mix(.14, step(.5, h) * line * (.2 + .8 * bead), 1. - smoothstep(.25, .6, aa));
}
void main(){
  int k = int(vK + .5);
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCamL - vL + vec3(0., 1e-4, 0.));
  vec2 uv = vUv;
  vec2 fw = fwidth(uv);
  vec2 qd = dFdx(uv) * dFdx(vL.y) + dFdy(uv) * dFdy(vL.y);    // which way the uv runs downhill: rain streaks follow it
  float acr = abs(qd.x) > abs(qd.y) ? uv.y : uv.x;
  float fwa = abs(qd.x) > abs(qd.y) ? fw.y : fw.x;
  float uvm = fwa / max(length(fwidth(vL)), 1e-6);             // uv per metre across the fall line: rivulets are drawn only where the uv is laid in metres
  float magK = smoothstep(.002, .02, max(fw.x, fw.y));        // 0 under magnification: stretched noise is left out an arm's length away
  vec3 alb = vC; float gloss = .3; vec3 col; bool done = false; vec3 emi = vec3(0.); float rimK = 0., ironK = 0., run = .5, sheenK = 0., glassK = 0., dryG = 0., paintP = 0., paintK = 0.; vec2 gq = vec2(0.); vec3 pT = vec3(1.), pH = vec3(1.);
  vec3 pS = vL + N * .45;
  float ins = inShed(pS);
  float wet = uWet * (1. - ins * .85) * smoothstep(-.6, .3, N.y + .35);
#ifdef DOOR
  wet = 0.;                                                   // inside our own doorway nothing is wet
#endif
  float n1 = fbm(uv * .7), n2 = vn(uv * 9.);
  if (k == ${n.LATTICE}) {
    float fx = fract(uv.x);
    float t = .075 + max(fw.x, fw.y) * .8;
    float m = min(abs(fx - uv.y), abs(fx - (1. - uv.y))) * .707;
    m = min(m, min(fx, 1. - fx));
    m = min(m, min(uv.y, 1. - uv.y) - .05);
    if (m > t) discard;
    k = ${n.IRON};
  }
  if (k == ${n.RAIL}) {
    // an open iron railing: uv.x in 1.6 m bays, uv.y 0..1 over its height. A top rail, a low rail, posts and thin balusters,
    // which drop out with distance instead of closing up, so the town shows through it
    float px = abs(fract(uv.x) - .5), bx = abs(fract(uv.x * 8.) - .5);
    float top = step(1. - uv.y, max(.09, fw.y * 1.6));
    float low = step(abs(uv.y - .1), max(.035, fw.y * .8)) * step(fw.y, .25);
    float post = step(.5 - px, max(.03, fw.x * .8)) * step(fw.x, .16);
    float bal = step(bx, .14) * step(fw.x * 8., .32) * step(uv.y, .93);
    if (max(max(top, low), max(post, bal)) < .5) discard;
    k = ${n.IRON};
  }
  if (k == ${n.PAINT}) {                                      // an engine's painted plate: iron under enamel (below)
    // paintK: how far it is a colour and not black. A strong colour keeps a body of grey in it (no channel under a third
    // of the strongest): the grade's film curve would otherwise crush a deep maroon to a flat primary red.
    paintP = 1.; k = ${n.IRON};
    float mxc = max(alb.r, max(alb.g, alb.b)), mnc = min(alb.r, min(alb.g, alb.b));
    paintK = smoothstep(.3, .65, (mxc - mnc) / max(mxc, 1e-4));
    alb = mix(alb, max(alb, mxc * vec3(.22, .22, .24)), paintK);
    pH = alb / max(mxc, 1e-4); pT = mix(vec3(1.), pH, .9 * paintK);
  }
  if (k == ${n.VALANCE}) {
    float fx = abs(fract(uv.x) - .5) * 2.;
    if (uv.y > 1. - .36 * fx) discard;
    vec2 hp = vec2((fract(uv.x) - .5) * .55, (uv.y - .5));
    if (length(hp) < .1 && fw.x < .25) discard;
    if (fx > .9 && uv.y > .3 && fw.x < .15) discard;
    alb *= .78 + .3 * n2;
    alb *= 1. - .45 * smoothstep(.35, .8, fbm(vec2(uv.x * .6, uv.y * .5 + 3.))) ;
    alb *= 1. + .6 * ins;                                     // seen from under the roof it is painted iron in lamp light, not a black cut-out
    gloss = .35;
  } else if (k == ${n.IRON}) {
    float rust = smoothstep(.5, .78, fbm(uv * vec2(1.1, .32) + 11.)) * (1. - paintP);       // (an engine's enamel is kept clean: no rust, no stains drawn out down the plate)
    alb = mix(alb, vec3(.15, .08, .05), rust * .45);
    alb *= mix(.8 + .35 * n2, .95 + .1 * n2, paintP);
    // rain running down wet plate: streaks that break the gloss, and (below) a sheen of sky so a side is never pure black
    run = vn(vec2(acr * 7., vL.y * 1.1 + uTime * .7)) * .6 + vn(vec2(acr * 19., vL.y * 2.3 + uTime * 1.3)) * .4;
    run = mix(.5, run, magK);                                  // (an arm's length away the streaks would be stretched noise: left out)
    gloss = (.6 - rust * .3) * mix(1., .7 + .5 * run, wet);
    ironK = wet;
#ifdef TINTED
    // rolling stock: wet plate carries the sky, and a polished engine is glossy dry too: an even band of sky along
    // the boiler and on the cab side before the rain (a little more of it by lamp-light, when the sky has less to give),
    // the rain's streaks once it is wet
    // (water runs down the upright plate only: a boiler's crown and a tender's top carry an even film)
    run = mix(.5, mix(.5, .38 + .4 * rivulets(acr, vL.y, fwa), (1. - smoothstep(.3, .7, abs(N.y))) * smoothstep(.3, .55, uvm)), smoothstep(0., .3, wet));
    if (paintP > .5) {
      // enamel, wet: the rain stands on it in beads (round, each holding a point of sky, sliding a little) and never runs in
      // streaks; the uv of every painted plate is laid in metres. Where a bead would be less than three or four pixels across
      // (it would be a square speck): their average.
      vec2 bq = uv * 17.;
      bq.y += uTime * (.02 + .12 * h21(vec2(floor(bq.x), 3.)));
      float bid = h21(floor(bq)), bw = max(fw.x, fw.y) * 17.;
      float br = .07 + .09 * fract(bid * 3.7);
      float bd = length(fract(bq) - .5 + (vec2(fract(bid * 7.3), fract(bid * 11.9)) - .5) * .5);
      float bead = step(.6, bid) * (1. - smoothstep(br, br + .08 + bw, bd));
      float skew = bw / max(min(fw.x, fw.y) * 17., 1e-5);       // (seen along the plate the beads would draw out into scratches: left out)
      run = mix(.5, mix(.5, .48 + .13 * bead, (1. - smoothstep(.04, .12, bw)) * (1. - smoothstep(3., 7., skew))), smoothstep(0., .3, wet) * (1. - smoothstep(.5, .85, N.y)));
    }
    gloss = (.6 - rust * .3) * mix(1., .85 + .3 * run, wet);
    ironK = max(wet, .6 + .2 * uLamp); sheenK = ironK; dryG = max(.4 - wet, 0.);
    {
      // painted plate carries the sky in its own colour: a maroon boiler shines maroon, a green one green (black and bare
      // iron stay silver), and the neutral floor under the paint is lowered so grey never swamps it
      alb *= 1. + .3 * paintK * wet;                          // (enamel does not go dull when it is wet)
      gSheenT = pT;
    }
#endif
  } else if (k == ${n.STONE}) {
    vec2 b = uv / vec2(1.3, .62); b.x += .5 * floor(b.y);
    vec2 fb = fract(b); float id = h21(floor(b));
    float mortar = smoothstep(0., .035 + fw.x, fb.x) * smoothstep(0., .07 + fw.y * 1.6, fb.y);
    alb *= (.84 + .26 * id) * mix(.66, 1., mortar);
    alb *= 1. - .42 * smoothstep(.42, .8, fbm(vec2(uv.x * .8, uv.y * .11)));
    alb = mix(alb, alb * vec3(.7, .85, .6), smoothstep(.6, .9, n1) * .35);
    gloss = .28;
  } else if (k == ${n.ARCADE} || k == ${n.ARCLIT}) {
    vec2 cell = floor(uv), f = fract(uv);
    vec2 p = vec2(f.x * .6, f.y);
    float hw = .185, spring = .44;
    vec2 c1 = vec2(.3 + hw, spring), c2 = vec2(.3 - hw, spring);
    float dTop = max(length(p - c1), length(p - c2)) - 2. * hw;
    float dLow = max(abs(p.x - .3) - hw, .1 - p.y);
    float d = p.y > spring ? dTop : dLow;
    vec2 b = uv * vec2(3.2, 11.); b.x += .5 * floor(b.y);
    vec2 fb = fract(b); float id = h21(floor(b));
    alb *= (.84 + .26 * id) * mix(.7, 1., smoothstep(0., .05, fb.x) * smoothstep(0., .09, fb.y));
    alb *= 1. - .4 * smoothstep(.42, .8, fbm(vec2(uv.x * 2.3, uv.y * .5)));
    gloss = .28;
    if (d < 0.) {
      float tr = min(abs(p.x - .3) - .011, abs(length(p - vec2(.3, spring + .17)) - .08) - .012);
      tr = min(tr, -d - .016);
      if (tr > 0.) {
        vec3 R = reflect(-V, N);
        if (k == ${n.ARCLIT}) col = uHorizCol * (.5 + 1.1 * uSun) * (.75 + .25 * n2);
        else {
          float lit = step(.8, h21(cell + 3.7));
          col = skyRefl(R) * .15 + vec3(.01, .012, .018) + vec3(1.5, .8, .3) * lit * (.35 + .15 * sin(uTime * 2.3 + cell.x * 7.));
          col += uSunCol * uSun * pow(max(dot(R, uSunDir), 0.), 60.) * 1.5;
        }
        done = true;
      } else alb *= .8;
    } else if (d < .075 && p.y > spring - .02) {
      float ang = atan(p.y - spring + .2, p.x - .3 + 1e-5);
      alb = mix(alb, vec3(.33, .1, .09), step(.5, fract(ang * 4.5)) * .85);
      alb *= 1.06;
    } else if (f.y < .07 || f.y > .955) alb *= 1.18;
    else if (abs(abs(p.x - .3) - hw - .03) < .016 && p.y < spring && p.y > .1) alb *= .55;
  } else if (k == ${n.CORR}) {
    float c = sin(uv.x * 15.7);
    float rust = smoothstep(.5, .85, fbm(uv * vec2(.5, .16) + 5.));
    alb = mix(alb, vec3(.15, .085, .055), rust * .5);
    alb *= (.82 + .2 * c * (1. - smoothstep(.1, .5, fw.x * 15.7))) * (1. - .5 * step(fract(uv.y / 2.4), .035));
    alb *= 1. + .6 * ins * smoothstep(-40., -4., vL.z);       // the underside of the first roof bays reads as sheet iron from the platform
    gloss = .7 - rust * .4;
  } else if (k == ${n.GLASS}) {
    float bx = abs(fract(uv.x / .62) - .5), by = abs(fract(uv.y / 2.2) - .5);
    float bar = max(1. - smoothstep(.06, .08 + fw.x * 2.5, bx), 1. - smoothstep(.02, .03 + fw.y * .8, by));
    float dirt = fbm(uv * vec2(.6, .25));
    vec3 g;
    vec3 Ng = normalize(vN + vec3(0., 1e-5, 0.));
    if (dot(Ng, V) > 0.) {
      vec3 R = reflect(-V, Ng);
      g = skyRefl(R) * (.5 + .2 * dirt) + uSunCol * uSun * pow(max(dot(R, uSunDir), 0.), 40.) * 2.5;
      g = mix(g, vec3(.05, .055, .06), .3 * dirt);
    } else g = mix(uHorizCol, uSkyCol, .45) * (.45 + .75 * uSun) * (.45 + .6 * dirt) + uSunCol * uSun * .25 * max(dot(-Ng, uSunDir), 0.);
    col = mix(g, vC * .12, bar * (1. - smoothstep(.6, 1.6, fw.x)) * .85);
    done = true;
  } else if (k == ${n.WOOD}) {
    float pl = floor(uv.x / .19);
    alb *= .78 + .3 * h21(vec2(pl, 3.));
    alb *= 1. - .4 * smoothstep(.43 - fw.x * 3., .5, abs(fract(uv.x / .19) - .5));
    alb *= mix(1., .8 + .3 * vn(uv * vec2(30., 2.)), magK);
    alb *= 1. - .1 * (1. - magK) * step(.6, h21(vec2(pl, floor(uv.y / .9) + 5.)));       // close to: each board its own tone, joints crisp
    alb = mix(alb, vec3(.2, .17, .14), smoothstep(.55, .85, n1) * .5);
    gloss = .35;
#ifdef TINTED
    run = .3 + .7 * rivulets(acr, vL.y, fwa);
    ironK = wet * .5; sheenK = wet;                           // wet paint and planks on rolling stock: threads of rain, sky sheen
#endif
  } else if (k == ${n.SPILL}) {
    // a footboard under a lit opening: wet plank with the lamp light from inside lying on it
    alb *= .8 + .3 * vn(uv * vec2(3., 30.));
    float sp = 1. - smoothstep(0., .5, length(uv - .5));
    emi = vec3(.72, .31, .085) * (uLamp * sp * sp * 1.3);
    gloss = .4;
  } else if (k == ${n.PAVE}) {
    vec2 b = uv / vec2(1.1, .7); b.y += .5 * floor(b.x);
    vec2 fb = fract(b); float id = h21(floor(b));
    alb *= (.82 + .28 * id) * mix(.6, 1., smoothstep(0., .04 + fw.x, fb.x) * smoothstep(0., .06 + fw.y, fb.y));
    alb *= .85 + .25 * n1;
    alb = mix(alb, vec3(.6, .58, .52) * (.75 + .3 * id), 1. - smoothstep(.4, .44 + fw.x, uv.x));
    alb = mix(alb, vec3(.62, .6, .5), (1. - smoothstep(.0, .03 + fw.x, abs(uv.x - .62) - .045)) * .8);        // a painted line a pace back from the edge
    alb *= 1. + .22 * (1. - smoothstep(.5, 1.1, abs(uv.x - 2.) + (n1 - .5) * .8));                                  // the worn walking line
    float trk = ins * smoothstep(-26., -3., vL.z);            // wet trodden in under the gable
    float pud = smoothstep(.52, .62, fbm(uv * .23 + 9.)) * (1. - ins * (1. - .8 * trk));
    pud = max(pud, ins * .7 * smoothstep(.5, .66, fbm(uv * vec2(.5, .21) + 23.)));                                      // mopped and trodden wet, catching the side shafts
    vec2 fc = vL.xz * vec2(2.3, 1.5), fi = floor(fc);
    float fpr = step(.5, h21(fi + 3.3)) * (1. - smoothstep(.1, .17, length((fract(fc) - .5 - (vec2(h21(fi), h21(fi + 7.7)) - .5) * .5) * vec2(1., .5))));
    pud = max(pud, fpr * trk * .8);
    gloss = mix(.45, .98, pud * uWet);
    wet = max(wet, pud * uWet);
    alb *= 1. - .3 * pud;
  } else if (k == ${n.BRICK}) {
    vec2 b = uv / vec2(.62, .26); b.x += .5 * floor(b.y);
    vec2 fb = fract(b); float id = h21(floor(b));
    float mm = smoothstep(0., .06 + fw.x * 2., fb.x) * smoothstep(0., .14 + fw.y * 4., fb.y);
    alb *= (.75 + .4 * id) * mix(.6, 1., mix(mm, .8, smoothstep(.2, .6, fw.y * 4.)));
    alb *= 1. - .5 * smoothstep(.4, .85, fbm(vec2(uv.x * .5, uv.y * .14) + 2.));
    gloss = .2;
  } else if (k == ${n.CHAWL}) {
    // limewashed wall of a chawl or shack: one shuttered opening per uv cell, stains under the sills
    vec2 cell = floor(uv), f = fract(uv);
    float id = h21(cell + 7.3);
    alb *= .8 + .32 * fbm(uv * vec2(.9, 1.7) + 3.);
    alb *= 1. - .45 * smoothstep(.35, .9, fbm(vec2(uv.x * 2.3, uv.y * .35) + 9.)) * (.4 + .6 * f.y);
    alb = mix(alb, alb * vec3(.55, .72, .5), smoothstep(.55, .8, n1) * .5 * (1. - f.y));
    float qx = abs(f.x - .5);
    float door = step(.62, id);
    float hw = mix(.2, .17, door), y0 = mix(.3, .05, door);
    float op = (1. - smoothstep(hw - fw.x, hw + fw.x, qx)) * smoothstep(y0 - fw.y, y0 + fw.y, f.y) * (1. - smoothstep(.8 - fw.y, .8 + fw.y, f.y));
    vec3 sh = mix(vec3(.04, .19, .2), vec3(.3, .19, .06), step(.5, h21(cell + 1.7)));
    sh = mix(sh, vec3(.24, .055, .045), step(.78, h21(cell + 4.1)));
    float open = step(.45, h21(cell + 2.3)) * (1. - step(hw * .55, qx));
    float nearW = 1. - smoothstep(.02, .09, max(fw.x, fw.y));
    // the wall's own dressing, drawn sharp: a plinth of brick courses, a string course at each floor, a painted surround and a
    // stone sill to every opening, a drainpipe down every few bays
    float gnd = step(cell.y, .5) * (1. - smoothstep(.2 - fw.y, .2 + fw.y, f.y));
    vec2 bc = vec2(uv.x * 5.2, f.y * 36.); bc.x += .5 * floor(bc.y);
    vec2 bf = fract(bc);
    vec3 pl = vec3(.3, .13, .085) * (.7 + .5 * h21(floor(bc))) * mix(1., smoothstep(0., .08 + fw.x * 6., bf.x) * smoothstep(0., .16 + fw.y * 40., bf.y) * .45 + .55, nearW);
    alb = mix(alb, pl, gnd * (1. - door * (1. - smoothstep(hw, hw + .02, qx))));
    alb *= 1. + .22 * smoothstep(.972 - fw.y, .972 + fw.y, f.y) - .2 * (1. - smoothstep(0., .01 + fw.y, abs(f.y - .958) - .004)) * nearW;
    float sur = (1. - smoothstep(hw + .04 - fw.x, hw + .04 + fw.x, qx)) * smoothstep(y0 - .035 - fw.y, y0 - .035 + fw.y, f.y) * (1. - smoothstep(.835 - fw.y, .835 + fw.y, f.y));
    alb = mix(alb, alb * 1.3 + .035, clamp(sur - op, 0., 1.) * (.4 + .6 * nearW));
    float sill = (1. - door) * (1. - smoothstep(hw + .07 - fw.x, hw + .07 + fw.x, qx)) * (1. - smoothstep(.012, .012 + fw.y, abs(f.y - y0 + .022)));
    alb = mix(alb, vec3(.5, .47, .4), sill * nearW);
    alb *= 1. - .3 * (1. - door) * (1. - smoothstep(hw + .06, hw + .08, qx)) * smoothstep(y0 - .085, y0 - .04, f.y) * (1. - smoothstep(y0 - .04, y0 - .034, f.y)) * nearW;       // the sill's shadow
    float pipe = step(.66, h21(vec2(cell.x, 5.5))) * (1. - smoothstep(.006, .006 + fw.x, abs(f.x - .06))) * (1. - smoothstep(.03, .12, fw.x));
    alb = mix(alb, vec3(.05, .055, .06), pipe * .85);
    // rooms: a dim warm inside by day (a shelf, a figure's shape), lamp-lit in the rain and at dusk
    float room = h21(cell + 6.6);
    vec3 dimIn = mix(vec3(.012, .012, .016), vec3(.085, .05, .026) * (.6 + .8 * smoothstep(y0 + .3, y0, f.y)), step(.35, room));
    vec2 hq = vec2(f.x - .5 - (room - .5) * .12, f.y - y0);        // somebody at the window: head and shoulders against the room
    float fig = max(1. - smoothstep(.03, .04, length(hq - vec2(0., .19))), 1. - smoothstep(.9, 1.1, length((hq - vec2(0., .05)) / vec2(.075, .1))));
    dimIn *= 1. - .65 * step(.55, room) * (1. - door) * fig;
    vec3 inner = mix(sh * (.7 + .3 * step(.5, fract(f.y * 14.))), dimIn, open);
    emi = vec3(1.7, .95, .36) * (uLamp * open * op * step(.4, h21(cell + 9.9)) * (.8 + .2 * sin(uTime * 3.1 + id * 40.)));
    emi += vec3(.5, .27, .1) * (.16 * open * op * step(.62, room) * (1. - uLamp));
    alb = mix(alb, inner, op * (1. - smoothstep(.25, .7, max(fw.x, fw.y))));
    alb *= 1. - .35 * smoothstep(.05, 0., f.y) * step(.5, cell.y + 1.);
    gloss = .16;
  } else if (k == ${n.VIADUCT}) {
    // brick viaduct side: uv.x metres along, uv.y metres below the deck; round arches on piers
    vec2 b = uv / vec2(.62, .26); b.x += .5 * floor(b.y);
    vec2 fb = fract(b); float id = h21(floor(b));
    float mm = smoothstep(0., .06 + fw.x * 2., fb.x) * smoothstep(0., .14 + fw.y * 4., fb.y);
    alb *= (.75 + .4 * id) * mix(.6, 1., mix(mm, .8, smoothstep(.2, .6, fw.y * 4.)));
    alb *= 1. - .5 * smoothstep(.4, .85, fbm(vec2(uv.x * .5, uv.y * .14) + 2.));
    float ax = (fract(uv.x / 10.) - .5) * 10.;
    float dA = uv.y > 5.6 ? abs(ax) - 3.7 : length(vec2(ax, uv.y - 5.6)) - 3.7;
    alb = mix(alb, alb * 1.25, (1. - smoothstep(.0, .12, abs(dA - .28) - .26)));
    alb = mix(alb, vec3(.012, .011, .013), 1. - smoothstep(-.08, .08, dA));
    alb *= 1. - .3 * step(uv.y, 1.) * step(.9, uv.y);
    alb = mix(alb, alb * vec3(.5, .68, .42), smoothstep(.5, .8, n1) * .5);
    gloss = .2;
  } else if (k == ${n.COACH}) {
    // carriage side band: uv.x in bays, uv.y 0..1 (openings in every bay) or 2..3 (every third bay only)
    float M = uv.y > 1.5 ? 3. : 1.;
    float vy = uv.y - (M > 2. ? 2. : 0.);
    float bay = floor(uv.x);
    float bm = mod(bay, M);
    float has = step(bm, .5);
    float ox = abs(fract(uv.x) - .5);
    float rect = (1. - smoothstep(.3 - fw.x, .3 + fw.x, ox)) * smoothstep(.16 - fw.y, .16 + fw.y, vy) * (1. - smoothstep(.9 - fw.y, .9 + fw.y, vy));
    float op = has * rect;
    alb *= mix(1., .82 + .3 * vn(uv * vec2(9., 40.)), magK);
    alb *= 1. - .3 * smoothstep(.485 - fw.x * 4., .5, abs(fract(uv.x * 4.) - .5)) * (1. - smoothstep(.05, .2, fw.x));     // panel joints: a fine dark seam
    float bar = (1. - smoothstep(.1, .1 + fw.y * 4., abs(fract(vy * 4.) - .5))) * step(M, 2.);
    // lamp-lit interior: brighter under the lamp, heads and shoulders against it, a dark frame round the opening
    float vx = fract(uv.x), hid = h21(vec2(bay, 5.));
    float hx = mix(.34, .66, fract(hid * 13.7)), hy = mix(.4, .56, fract(hid * 29.3));
    vec2 hp = vec2((vx - hx) * 2., (vy - hy) * 1.1);
    float sil = max(1. - smoothstep(.07, .13, length(hp)), 1. - smoothstep(.15, .26, length(vec2(hp.x * .62, hp.y + .3)))) * step(.35, hid) * .85;
    float rim = 1. - smoothstep(.0, .035, .3 - ox) * smoothstep(.16, .2, vy) * smoothstep(.9, .86, vy);
    float tb = (vx - .2) / .6;
    float vbar = smoothstep(.39, .43, abs(fract(tb * 5.) - .5)) * step(2., M) * (1. - smoothstep(.02, .08, fw.x));   // iron bars across the openings
    float lampK = (.1 + .9 * smoothstep(.2, 1., vy) * (.55 + .45 * smoothstep(.5, .0, abs(tb - .5)))) * (1. - .93 * sil) * (1. - rim) * (1. - .85 * vbar) * (.6 + .4 * h21(vec2(bay, 3.)));
    emi = vec3(.72, .31, .085) * (uLamp * op * (1. - bar) * lampK);
#ifdef TINTED
    emi *= vLit;                                              // our own coach is a frame, not a subject
#endif
    alb = mix(alb, mix(vec3(.012, .011, .012), alb * .45, max(bar, rim)), op);
    if (M > 2.) {
      // between the lit openings (6 m apart, the flicker rule) the side is continuous, unlit detail: a closed louvred
      // shutter, then a door with a dark droplight that holds the sky and a brass handle
      float near = 1. - smoothstep(.03, .12, fw.y), isDoor = step(1.5, bm), shut = (1. - has) * (1. - isDoor) * rect;
      alb = mix(alb, alb * vec3(.82, .78, .72) * mix(.8, .84 + .16 * smoothstep(.3, .5, fract(vy * 28.)), near), shut);       // fine louvres, soft
      alb *= 1. - .4 * (1. - has) * (1. - isDoor) * (1. - smoothstep(0., .025 + fw.x, abs(ox - .3))) * step(.16, vy) * step(vy, .9);
      alb *= 1. - .3 * shut * (1. - smoothstep(0., .016 + fw.x, .3 - ox) * smoothstep(0., .028 + fw.y, vy - .16) * smoothstep(0., .028 + fw.y, .9 - vy));     // a darker frame, 3 cm, round the louvres
      float dr = (1. - has) * isDoor, vxd = fract(uv.x);
      alb *= 1. - .55 * dr * (1. - smoothstep(0., .012 + fw.x, abs(ox - .36))) * step(vy, .96);
      alb *= 1. - .3 * dr * (1. - smoothstep(0., .01 + fw.x, abs(ox - .26))) * step(.14, vy) * step(vy, .36) * near;
      glassK = dr * (1. - smoothstep(.2 - fw.x, .2 + fw.x, ox)) * smoothstep(.44 - fw.y, .44 + fw.y, vy) * (1. - smoothstep(.9 - fw.y, .9 + fw.y, vy));
      gq = vec2(ox / .2, (vy - .44) / .46);
      alb = mix(alb, vec3(.5, .34, .1), dr * step(abs(vxd - .83), .02) * step(abs(vy - .3), .075) * near);
    }
    // a cream waist band and gold lining, unbroken from end to end
    float wl = 1. - smoothstep(0., fw.y, abs(vy - .07) - .028);
    alb = mix(alb, vec3(.6, .53, .36), wl * .9);
    float lnA = 1. - smoothstep(0., fw.y, abs(vy - .13) - .008), lnB = 1. - smoothstep(0., fw.y, abs(vy - .95) - .008);
    alb = mix(alb, vec3(.62, .42, .12), max(lnA, lnB) * (1. - op) * .85);
    run = .3 + .7 * rivulets(acr * 2., vL.y, fwa * 2.) * (1. - op);     // (a bay is two metres; no water runs down an open window)
    ironK = wet * .5; sheenK = wet;
    gloss = .55;
  } else if (k == ${n.TILE}) {
    vec2 b = uv / vec2(.3, .42); b.x += .5 * floor(b.y);
    float id = h21(floor(b));
    float cx = abs(fract(b.x) - .5);
    float far = smoothstep(.2, .7, max(fw.x / .3, fw.y / .42));
    alb *= mix((.72 + .4 * id) * (.75 + .5 * cx) * mix(.7, 1., smoothstep(0., .2, fract(b.y))), .9, far);
    alb = mix(alb, vec3(.05, .07, .04), smoothstep(.5, .85, n1) * .55);
    gloss = .5;
  } else if (k == ${n.GLOW}) {
    col = vC * 4.5; done = true;
  } else if (k == ${n.FIRE}) {
    // a firelit cab: the glow falls off from the firehole (low and forward), flickering slowly
    // (uv: distance in metres from the firehole / 2.3 about (.16, .2); the plate is dark iron, vC its tone)
    float fd = length(vec2(uv.x - .16, uv.y - .2)) * 2.3;
    float fl = .8 + .2 * vn(vec2(uTime * 3., 1.7));
    vec3 fire = vec3(1., .36, .08);
    vec3 plate = vC * (.75 + .5 * n2);
    // riveted seams across the plates, so the glow lies on ironwork and not on a blank panel
    float seam = 1. - smoothstep(.006, .014 + fw.y, abs(fract(uv.y * 4.6 + .2) - .5));
    float rivet = (1. - smoothstep(.1, .22, length(vec2(fract(uv.x * 46.) - .5, (fract(uv.y * 4.6 + .28) - .5) * 10.)))) * (1. - smoothstep(.01, .03, fw.x));
    plate *= (1. - .55 * seam) * (1. + .9 * rivet);
    col = plate * (fire * ((4.6 * exp(-fd / .42) + .9 * exp(-fd / 1.4)) * fl) + uAmbCol * .7 + uGroundCol * .4);
    col += (uHorizCol + uAmbCol) * ((.03 + .035 * n2) * (1. + .9 * rivet) * (1. - .5 * seam) * uSun);       // with the sun out, daylight through the open back: dark ironwork, not a black hole
    col += fire * ((1. - smoothstep(.2, .3, fd)) * (2.2 + 1.2 * vn(uv * 40. + uTime * vec2(.7, 2.3))) * fl);       // the firehole itself
    col += fire * (exp(-fd * fd / .09) * .5 * fl);
    done = true;
  } else if (k == ${n.SLATE}) {
    vec2 b = uv / vec2(.5, .34); b.x += .5 * floor(b.y);
    float id = h21(floor(b));
    alb *= (.8 + .3 * id) * mix(.7, 1., smoothstep(0., .1 + fw.y * 3., fract(b.y)));
    alb *= 1. - .3 * smoothstep(.5, .85, n1);
    gloss = .7;
  } else if (k == ${n.BRASS}) {
    alb *= .8 + .3 * n2; gloss = .95; wet = max(wet, .5);
  } else if (k == ${n.DOME}) {
    // the great dome: fine courses of pale stone, weather streaks running down from the lantern
    float crs = fract(uv.y / .9);
    alb *= mix(.8, 1., smoothstep(0., .1 + fw.y * 2., crs)) * (.9 + .16 * h21(vec2(floor(uv.y / .9), floor(uv.x / 2.2))));
    alb *= 1. - .3 * smoothstep(.45, .85, fbm(vec2(uv.x * .7, uv.y * .09)));
    alb = mix(alb, vec3(.92, .56, .2) * (alb.g * 1.6 + .25), .6);       // the brief's gold
    gloss = .5; rimK = 1.;
  } else if (k == ${n.COAL}) {
    // a tender's load: wet black lumps, each face its own tone, the wet ones catching the sky
    float lump = h21(floor(uv * 7.) + 3.1);                 // coal: black lumps, one in five with a wet face that holds a glint of sky
    alb *= .5 + .9 * lump; gloss = .1 + .5 * step(.8, lump); wet *= .45;
  } else {
    alb *= .82 + .3 * n2; gloss = .18;
  }
#ifdef DOOR
  if (!done) {
    // our own doorway: sky light from outside and a little lamp light off the floor; the sun is capped and
    // greyed so the paint reads in rain, in the shed and at dusk alike
    vec3 sc = uSunCol * uSun; float sl = dot(sc, vec3(.3, .5, .2));
    sc = mix(vec3(sl), sc, .5) * (.5 / max(sl, .5));
    float ndl = clamp(dot(N, uSunDir) * .7 + .3, 0., 1.);
    float vis = sunVis(pS);
    float open = .38 + .62 * smoothstep(-.8, .9, dot(N.xz, uTrackR));          // faces turned to the open air are brighter
    vec3 li = sc * (vis * ndl) + (mix(uGroundCol, uAmbCol, N.y * .3 + .7) * .7 + uAmbCol * .35) * open + vec3(1.2, .6, .2) * (.15 * uLamp + .07);
    li += uSunCol * (uSun * inShed(vec3(uCamL.x, 2., uCamL.z)) * .1 * (.5 + .5 * open));     // under the roof the station's own warm light reaches the paint
    float rf = smoothstep(6., -4., uCamL.z);                    // under the roof: the paint is lifted, and the lamps and the west arcade warm it
    li = li * (1. + .5 * rf) + vec3(1.5, .86, .36) * (rf * (.06 + .1 * max(uLamp, .4)) * (.6 + .4 * open));
    col = alb * li;
    if (k == ${n.BRASS}) { float rr = 1. - abs(dot(N, V)); col += (uSunCol * uSun * .22 + vec3(1.5, .86, .36) * .1) * (rf * rr * rr); }     // a warm rim on the brass strip and the pole
    vec3 Rd = reflect(-V, N); Rd.y = abs(Rd.y);
    vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
    col += skyRefl(Rd) * (gloss * gloss * .16 * open * open) + sc * (vis * pow(max(dot(N, H), 0.), 40.) * gloss * .8);
    if (k == ${n.BRASS}) {                                     // rain beading and running on the pole and the brass
      vec2 dq = vec2(uv.x * 100., uv.y * 60.);
      dq.y += uTime * (.6 + 2.2 * h21(vec2(floor(dq.x), 3.)));
      float did = h21(floor(dq));
      float dr = length((fract(dq) - .5) * vec2(1., .7) + vec2(did - .5, 0.) * .3);
      float drops = step(.68, did) * (1. - smoothstep(.07, .2 + .1 * fract(did * 7.3), dr)) * smoothstep(0., .3, uRainCam);
      col = mix(col, uAmbCol * .9 + uHorizCol * .3 + sc * vis, drops * .5);
    } else if (abs(N.y) < .5) {                                // and on the paint: fewer, slower, duller
      vec2 dq = vec2(uv.x * 46., uv.y * 22.);
      dq.y += uTime * (.2 + 1.2 * h21(vec2(floor(dq.x), 7.)));
      float did = h21(floor(dq));
      float dr = length((fract(dq) - .5) * vec2(1., .55) + vec2(did - .5, 0.) * .3);
      float drops = step(.78, did) * (1. - smoothstep(.06, .2, dr)) * smoothstep(0., .3, uRainCam);
      col = mix(col, uAmbCol * .8 + uHorizCol * .25 + sc * (vis * .5), drops * .4);
    }
    col *= 1. - .5 * smoothstep(.12, .7, vL.y - uCamL.y);       // the lintel's shadow gathers at the head of the jamb
  }
#else
  if (!done) {
    col = shadeSurf(alb, N, V, pS, gloss, wet) + emi;
    if (ironK > 0.) {
      float fr = 1. - max(dot(N, V), 0.); fr *= fr;
      vec3 Rs = reflect(-V, N); float upS = max(Rs.y, 0.); Rs.y = abs(Rs.y);
      vec3 sr = skyRefl(Rs);
      float pF = 1. - max(.5 * paintK, .45 * paintP);                             // (painted plate: every sky term below takes the paint's hue, and the floor is lower)
      col += uAmbCol * pT * (upS * upS * dryG * gloss * .5 * (1. - .8 * uSun) * shedAO(pS));       // the overcast sheen, on dry polished plate
      col += (uAmbCol * .8 + sr * .2) * pT * (ironK * pF * (.085 + .13 * fr) * (.25 + 1.3 * run) * shedAO(pS));
      col += uSkyCol * pT * (ironK * pF * (.15 * max(N.y, 0.) + .05 * (1. - abs(N.y))) * (.5 + run) * (1. - .85 * uSun) * shedAO(pS));     // under the rain a girder overhead is wet riveted iron, not a silhouette
      // seen from beneath, wet iron takes the light off the wet ground and the lamps: a blue-grey soffit, its plates told apart
      col += (uHorizCol * .5 + uAmbCol * .5 + vec3(.5, .28, .1) * uLamp * .3) * pT * (ironK * max(-N.y, 0.) * (.1 + .12 * n2 + .1 * run) * shedAO(pS));
      col += sr * mix(pT, vec3(1.), .25 * fr) * (sheenK * (.1 + .5 * fr) * (.1 + 1.1 * run * run * run) * shedAO(pS));     // rain-run streaks of sky on wet paint and plate
#ifdef TINTED
      if (k == ${n.IRON}) { float mx = max(col.r, max(col.g, col.b)); col *= 1. / (1. + 1.4 * max(mx - .7, 0.)); }     // polished plate shines, and never burns out to white
      if (paintP > .5 && paintK < 1.) {                         // black enamel: the sky lies on it as a sheen, not as a coat of silver
        float m0 = max(max(col.r, max(col.g, col.b)), 1e-4), m1 = min(m0, .075 + (m0 - .075) * .5);
        col *= mix(m1 / m0, 1., paintK);
      }
      if (paintK > 0.) {
        // enamel keeps its own colour under any sky: what the plate shows (light and sheen together) is drawn in the paint's
        // hue and a little deeper, so a maroon boiler under a blue-grey storm is deep maroon, not mauve or silver; and the two
        // weaker channels never fall below what the grade's film curve can carry (uPaintLo), so its shadows stay maroon and
        // do not crush to a flat red
        float v0 = max(max(col.r, max(col.g, col.b)), 1e-4), v = v0 * .82;
        v = min(v, .11 + (v - .11) * .55);                      // (deep even where the low sun is on it)
        col = mix(col * (v / v0), v * pH, .85 * paintK);
        col = mix(col, max(col, min(vec3(v * .78) * (uPaintLo.xxy / uPaintLo.x), uPaintLo.xxy)), paintK);       // (blue a shade over green, through the hour's tint: in deep shade it is maroon-black, never brown)
      }
#endif
    }
#ifndef TINTED
    if (k == ${n.IRON}) {
      // before the rain, dry painted iron under the pearl overcast is never a black cut-out: a soft skylight sheen on plate,
      // stiffener and rivet (gone once everything is wet, when the terms above carry it)
      float frD = 1. - max(dot(N, V), 0.); frD *= frD;
      col += (uAmbCol * .7 + uSkyCol * .3) * ((1. - uWet) * (.06 + .1 * frD + .05 * n2) * (.8 + .4 * abs(N.x)) * shedAO(pS));
    }
#endif
    if (glassK > 0.) {                                          // a droplight: dark glass holding the sky
      vec3 Rg = reflect(-V, N); Rg.y = abs(Rg.y);
      float gfr = 1. - smoothstep(0., .14, 1. - gq.x) * smoothstep(0., .08, gq.y) * smoothstep(0., .08, 1. - gq.y);       // its frame
      float bwG = max(.05, fw.x * 7.);
      float band = smoothstep(.5 - bwG, .5 + bwG, vn(vec2((uv.x + gq.y * .1) * 11., 3.7)));                  // the sky lies on the glass in slanted streaks
      vec3 gl = vec3(.016, .014, .013) * (.5 + gq.y) + vec3(.72, .31, .085) * (uLamp * .12 * gq.y);       // a dim inside, lighter toward the lamp
      gl += skyRefl(Rg) * ((.07 + .5 * band) * (.45 + .55 * run) * shedAO(pS));
      col = mix(col, mix(gl, col * .4, gfr), glassK);
    }
    if (rimK > 0.) {                                           // the dome burns gold on its sun side, indigo in its shadow
      float sv = uSun * sunVis(pS), sside = clamp(dot(N, uSunDir) * .9 + .4, 0., 1.);
      float fk = .6 + .8 * uFresh;                             // hottest in the first seconds of sun
      col *= mix(vec3(1.), mix(vec3(.5, .6, 1.25), mix(vec3(1.8, 1.62, 1.25), vec3(2.75, 2.05, .95), fk), sside), sv);
      float rd = 1. - max(dot(N, V), 0.);
      col += uSunCol * (sv * rd * rd * rd * 2.6 * fk * rimK * (.25 + .75 * clamp(dot(N, uSunDir) + .45, 0., 1.)));
    }
  }
#endif
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Ot=`
uniform vec3 uGz;
float gantryMask(vec3 p, vec3 R, float gz){
  float t = (gz - p.z) / min(R.z, -1e-3);
  vec3 q = p + R * t;
  float on = step(gz, p.z) * step(abs(q.x + 12.5), 56.);
  float truss = smoothstep(7.2, 7.6, q.y) * smoothstep(9.6, 9.2, q.y) * (.62 + .38 * step(abs(fract(q.x / 1.6 + q.y * .31) - .5), .2));
  float dolls = smoothstep(9.2, 9.5, q.y) * smoothstep(14.4, 13.2, q.y) * (.25 + .75 * step(abs(fract(q.x / 4.6) - .5), .1));
  float legs = step(q.y, 9.3) * step(abs(abs(q.x + 12.5) - 52.) , .8);
  return on * max(max(truss, dolls * .8), legs);
}
vec3 sceneRefl(vec3 p, vec3 R){
  vec3 c = skyRefl(R);
  float rz = min(R.z, -1e-3);
  float fwd = step(R.z, -.01);
  vec3 q = p + R * ((-166. - p.z) / rz);                      // the terminus
  float dx = q.x + 12.;
  float sil = step(abs(q.x + 12.5), 50.) * step(q.y, 27.);
  sil = max(sil, step(abs(dx), 14.) * step(q.y, 36. - abs(dx) * .6));
  float dn = 1. - dx * dx / 137.;
  sil = max(sil, step(abs(dx), 13.) * step(q.y, 47.));
  sil = max(sil, step(abs(dx), 11.7) * step(q.y, 47. + 19. * sqrt(max(dn, 0.))));
  sil = max(sil, step(abs(dx), 1.6) * step(q.y, 73.));
  sil = max(sil, step(abs(abs(q.x + 12.5) - 48.5), 2.3) * step(q.y, 38.5));
  sil = max(sil, step(abs(abs(dx) - 14.), 2.4) * step(q.y, 49.));
  vec3 stone = vec3(.6, .49, .36) * (uSunCol * uSun * (.3 + .45 * smoothstep(-10., 10., dx)) + uAmbCol * .7);
  c = mix(c, stone, sil * fwd * step(-160., p.z));
  q = p + R * ((0. - p.z) / rz);                              // the shed gable
  float ry = q.y - roofY(q.x) - .9, sw = clamp(fwidth(ry), .2, 4.);       // the gable's edge is as soft as the water is rough: no crumbs of sky along it
  float shed = step(abs(q.x + 12.5), 51.) * (1. - smoothstep(-sw, sw, ry)) * step(0., p.z);
  vec3 dark = uAmbCol * .25 + uSunCol * uSun * .03;            // mirrored iron is grey under the sky, never a black hole
  c = mix(c, dark, shed * fwd);
  float g = max(gantryMask(p, R, uGz.x), max(gantryMask(p, R, uGz.y), gantryMask(p, R, uGz.z)));
  c = mix(c, dark, g * fwd);
  return c;
}`,Nt=`
attribute float aTd; varying vec3 vL; varying float vTd;
#include <fog_pars_vertex>
void main(){ vL = position; vTd = aTd;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,qt=`
uniform vec3 uCamL; varying vec3 vL; varying float vTd;
#include <fog_pars_fragment>
${nt}
${Ot}
void main(){
  vec3 p = vL;
  vec3 V = normalize(uCamL - p + vec3(0., 1e-4, 0.));
  float dist = length(uCamL - p);
  float ins = inShed(vec3(p.x, 1., p.z));
  float fwp = max(fwidth(p.x), fwidth(p.z));
  float lod = 1. - smoothstep(.05, .2, fwp);
  vec2 pr = mat2(.8, -.6, .6, .8) * p.xz, pq = mat2(.28, .96, -.96, .28) * p.xz;
  // the fine stones are turned again and their lattice is bent by a slow warp, so the octaves never line up into a weave
  vec2 wp = (vec2(vn(pq * 1.9 + 3.), vn(pr * 2.3 + 11.)) - .5) * .22;
  vec2 ps = mat2(.8, .6, -.6, .8) * pq + wp.yx, prw = pr + wp;
  float lodN = 1. - smoothstep(.02, .12, fwp);
  float g1 = vn(prw * 6.) * .65 + vn(pq * 13. + 9.) * .35, g2 = vn(prw * 11.) * .55 + vn(ps * 17. + 4.) * .45, f1 = fbm(p.xz * .07), f2 = fbm(pr * .33 + 3.);
  // (the stones' contrast is held to about half: a quiet bed for the rails, not a field of salt and pepper)
  vec3 alb = mix(vec3(.05, .045, .042), vec3(.2, .175, .15), mix(.5, mix(.5, g1, lod) * .55 + mix(.5, g2, lodN) * .45, .55));
  float near = 1. - smoothstep(1.5, 2.7, vTd), cess = 0.;
#ifdef DECK
  // the viaduct's deck: a trodden cinder path along each edge
  cess = smoothstep(2.75, 3.05, vTd);
#endif
  alb *= mix(vec3(.5, .49, .52), vec3(1.), near * .75 + .25 * f1);
  alb = mix(alb, vec3(.17, .09, .05), (1. - smoothstep(.2, 1.5, vTd)) * .4);
  alb *= 1. - mix(.14, .35, uWet) * smoothstep(.5, .75, fbm(p.xz * .21 + 20.));
  alb *= mix(.78 + .44 * (g1 * .55 + g2 * .45), 1., max(uWet, 1. - lodN));                       // dry: every stone tells
  alb *= 1. - .3 * (1. - smoothstep(.0, .55, vTd)) * smoothstep(.35, .7, vn(p.xz * vec2(1.3, .35) + 60.));       // oil and ash between the rails
  float f3 = fbm(p.xz * vec2(.8, .2) + 13.);
  float open = smoothstep(3.2, 6., vTd);                         // open ground clear of every line: round pools there, not long streaks
  float pv = mix(f3, fbm(pr * .16 + 5.) * .92, open) * .7 + f2 * .3 - near * .25;
#ifdef DECK
  alb *= 1. - .34 * (1. - smoothstep(.12, .5, vTd)) * (.7 + .3 * f3);                        // an oil stripe down each four-foot
  alb *= 1. + .3 * smoothstep(1.3, 1.6, vTd) * (1. - smoothstep(2.0, 2.5, vTd)) * (.6 + .8 * f2);     // clean stone on the ballast shoulders
  alb = mix(alb, vec3(.15, .135, .115) * (.8 + .4 * f2), cess * .85);
  pv += .1 * smoothstep(1.5, 2.1, vTd);                        // and long puddles in the six-foot and on the path, once it is wet
#endif
  float pm = smoothstep(.56, .64, pv);
  float damp = 1. - .4 * smoothstep(.5, .59, pv);              // the dark damp margin round a puddle
  alb *= damp * mix(1., .72 + .56 * fbm(pr * 1.3 + 40.), .45 + .55 * uWet);
  alb *= mix(1., uGndK.x, uWet);
  pm *= uWet * (1. - ins) * (1. - smoothstep(0., .35, near) * .9) * (1. - .8 * open);      // (the open ground keeps its placed puddles; its small pools read from the door as white smears)
  {
    // the placed puddles (under the yard's water column, and in the low ground between its roads): ragged at the rim
    float rag = (f2 - .5) * .7 + (g1 - .5) * .12 * lod, pp = 0.;
    for (int i = 0; i < 6; i++) pp = max(pp, (1. - smoothstep(.7, .86, length((p.xz - uPud[i].xy) / max(uPud[i].zw, vec2(.01))) + rag)) * step(.02, uPud[i].z));
    pm = max(pm, pp * uWet * (1. - .45 * near));
  }
  // by hour: at noon the sky lies less on the stones and the gantries throw short hard shadows; the broad sun lobe is held
  // back on the far right, so the glare under the sun is a streak and not a quarter of the picture
  { float rgt = smoothstep(10., 40., p.x - uCamL.x); gSpecK = (1. - .7 * rgt) * uGndK.y * uGndK.y; gSkyK = uGndK.y * (1. - .3 * rgt); }       // (under a high sun the stones' facets would add up to chalk)
  {
    vec3 q = p + uSunDir * ((8.4 - p.y) / max(uSunDir.y, .05));
    float dz = min(min(abs(q.z - uGz.x), abs(q.z - uGz.y)), abs(q.z - uGz.z));
    float sh = (1. - smoothstep(.55, 1.05, dz)) * step(abs(q.x + 12.5), 56.) * (.65 + .35 * step(abs(fract(q.x / 1.6) - .5), .22));
    gSunK = 1. - uGndK.z * sh * (1. - ins);
  }
  // the stones' facets: a difference of the noise across each cell, so the highlights do not sit on the lattice points
  float fac = .34 * lodN * (1. - cess);
  vec3 N = normalize(vec3((vn(prw * 11.) - vn(prw * 11. + vec2(.37, .61))) * fac, 1., (vn(ps * 17. + 4.) - vn(ps * 17. + vec2(4.53, 4.29))) * fac));
  vec3 col = shadeSurf(alb, N, V, p, .38, uWet * (1. - ins * .8));
  // rings from the last drops
  vec2 cell = floor(p.xz / .9), cf = fract(p.xz / .9) - .5;
  float ph = fract(uTime * (.7 + .8 * uRain) + h21(cell));
  float rd = length(cf - (vec2(h21(cell + 1.3), h21(cell + 2.9)) - .5) * .5);
  float ring = sin((rd - ph * .45) * 60.) * smoothstep(.07, 0., abs(rd - ph * .45)) * (1. - ph) * max(uFresh, uRain) * step(.55 - .3 * uRain, h21(cell + 5.1)) * lod;
  vec3 Np = normalize(vec3(ring * .25 + (g1 - .5) * .012, 1., ring * .25 + (g2 - .5) * .012));
  vec3 R = reflect(-V, Np);
  R.y = abs(R.y) + 1e-3;
  vec3 refl = sceneRefl(p, R);
  {
    // a puddle holds the colour of the sky overhead, not the white of the haze at the horizon (silhouettes stay where they are)
    vec3 sk0 = skyRefl(R), dsk = refl - sk0;
    vec3 skHi = mix(skyRefl(normalize(vec3(R.x, R.y + .3, R.z))), uSkyCol, .35 + .3 * uSun);
    refl = mix(refl, skHi, (1. - smoothstep(0., .02, dot(dsk, dsk))) * (.8 + .12 * uSun));
  }
  refl = max(refl, skyRefl(R) * (uSunDir.y * uSunDir.y));      // under a high sun the mirrored iron and glass stand lit in bright haze: a pale shape in a pale puddle
  float vis = sunVis(p) * gSunK;
  float sd = max(dot(R, uSunDir), 0.);
  refl += uSunCol * (uSun * vis * (pow(sd, 220.) * 10. + pow(sd, 30.) * .05 * (.4 + 1.2 * g1) * gSpecK));
  float F = 1. - max(V.y, 0.); F = .28 + .6 * F * F * F;
  // (the hour's sky factor is for the stones only; a puddle is a mirror at any hour, and never darker than the wet stones
  // beside it, the ones outside its damp margin: damp is never under .6)
  vec3 mir = refl * F + alb * .04;
  col = mix(col, max(mir, col * (.9 / damp)), pm);
  { float gl = max(col.r, max(col.g, col.b)); col *= 1. / (1. + .9 * max(gl - .7, 0.)); }     // the sun's road glitters, and never burns the rails out of the picture
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Et=`
attribute float aM; attribute vec3 aT;
varying vec3 vL, vT; varying vec2 vUv; varying float vM;
#include <fog_pars_vertex>
void main(){ vL = position; vUv = uv; vM = aM; vT = aT;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ft=`
uniform vec3 uCamL; varying vec3 vL, vT; varying vec2 vUv; varying float vM;
#include <fog_pars_fragment>
${nt}
void main(){
  vec3 V = normalize(uCamL - vL + vec3(0., 1e-4, 0.));
  vec3 N = vec3(0., 1., 0.);
  float ins = inShed(vec3(vL.x, 1., vL.z));
  vec2 fw = fwidth(vUv) + 1e-5;
  vec3 col; float a = 1.;
  if (vM < .5) {
    float s = vUv.y / .72;
    float fs = abs(fract(s) - .5);
    float bar = 1. - smoothstep(.2 - fw.y * .7, .2 + fw.y * .7, fs);
    bar = mix(bar, .4, smoothstep(.2, .6, max(fw.y, fw.x) / .72));
    float ends = 1. - smoothstep(1.28 - fw.x, 1.28 + fw.x, abs(vUv.x));
    float id = h21(vec2(floor(s), floor(vL.x * .3)));
    vec3 alb = vec3(.085, .066, .052) * (.7 + .6 * id) * (.8 + .4 * vn(vUv * vec2(3., 30.)));
    alb = mix(alb, vec3(.2, .1, .05), smoothstep(.25, .0, abs(abs(vUv.x) - .84)) * .5);
    col = shadeSurf(alb, N, V, vL, .5, uWet * (1. - ins * .8));
    a = bar * ends;
  } else if (vM < 1.5) {
    float hw = max(.04, fw.x * .8);
    a = 1. - smoothstep(hw - fw.x * .5, hw + fw.x * .5, abs(vUv.x));
    vec3 T = normalize(vT + vec3(0., 0., 1e-5));
    vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
    float th = dot(T, H);
    float glint = pow(sqrt(max(1. - th * th, 0.)), 14.);
    float vis = sunVis(vL + vec3(0., .5, 0.));
    // the running surface is polished steel, wet or dry: it holds the sky overhead and the horizon in equal parts
    col = max(skyRefl(reflect(-V, N)) * .55, (uSkyCol + uHorizCol) * (.4 + .06 * vn(vUv.yy * 1.7))) * shedAO(vL) + vec3(.02) + uSunCol * (uSun * ins * .1);
    col *= 1. - .34 * uSun * (1. - ins);                         // (a yard of twelve roads under the sun: steel, not chalk lines)
    col += uSunCol * (uSun * vis * glint * (1.2 + 1.3 * uFresh) * (.7 + .3 * vn(vUv.yy * .4)));
    a *= clamp(.05 / hw, .22, 1.);
  } else if (vM < 2.5) {
    col = shadeSurf(vec3(.12, .062, .04) * (.8 + .4 * vn(vUv.yy * 2.3)), normalize(vec3(vT.z, .3, -vT.x)), V, vL, .4, uWet * .5);
  } else {
    float r = abs(fract(vUv.x / .16) - .5);
    float hw = max(.14, fw.x / .16 * .8);
    a = (1. - smoothstep(hw - fw.x * 3., hw + fw.x * 3., r)) * step(abs(vUv.x), .47);
    float stool = step(abs(fract(vUv.y / 2.7) - .5), .03);
    a = max(a, stool) * (1. - smoothstep(.4, 1.2, fw.x));
    vec3 galv = vec3(.105, .105, .11) * (.75 + .5 * vn(vUv * vec2(40., .7))) + vec3(.05, .02, .0) * smoothstep(.55, .8, vn(vUv * vec2(9., .3) + 5.));
    col = shadeSurf(mix(galv, vec3(.07), stool), N, V, vL, .35, uWet * .6);
  }
  if (a < .01) discard;
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,gt=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogF = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    float fogF = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  float fogF = 0.;
#endif`,Dt=`
attribute vec2 aCorner; attribute vec3 aColA, aColB; attribute vec4 aSw;
uniform float uProg, uTime, uWet, uLamp, uSun; uniform vec3 uCamL;
varying vec2 vC2; varying vec3 vCol; varying float vLaid;
#include <fog_pars_vertex>
void main(){
  vec3 c = (modelMatrix * vec4(position, 1.)).xyz; float size = aSw.z; float laid = 0.;
  float s = smoothstep(aSw.x, aSw.x + .022, uProg);
  vCol = mix(aColA, aColB, s) * (.85 + .15 * sin(uTime * (5. + aSw.y * 7.) + aSw.y * 40.));
  if (aSw.x < -1.5) vCol *= min(uLamp * 1.25, 1.);            // a lamp inside a carriage: seen when the lamps are lit
  if (aSw.w > .5) {
    // aSw.w: 1 = mirrored in the wet ground of the throat (y 0), 1 + h = in a wet surface at height h (the viaduct's deck, a
    // platform), over 500 = at the height of the carrier's own origin (a lamp-lit window on a moving coach)
    float py = aSw.w > 500. ? modelMatrix[3].y : aSw.w - 1.;
    float ch = max(uCamL.y - py, .05), t = ch / max(ch + c.y - py, .01);
    c = vec3(mix(uCamL.x, c.x, t), py + .06, mix(uCamL.z, c.z, t));
    float lim = aSw.w > 1.5 ? 1. : step(-75., c.x) * step(c.x, 50.) * step(-1., c.z);
    // (in full sun the streaks are faint and short: lamps lie on wet ground at dusk and in the rain, not at midday)
    // the streak lies in the wet, drawn out toward the eye: a quad on the ground, soft at both ends, never standing up
    vec2 toC = uCamL.xz - c.xz + vec2(1e-4, 0.); float D = length(toC); toC /= max(D, 1e-3);
    vec2 sd = vec2(-toC.y, toC.x);
    float halfL = clamp(.45 * D, 1.5, 30.) * (1. - .33 * smoothstep(.4, .6, uSun));
    float halfW = max(aSw.z * .55, D * .004);
    c.xz += sd * (aCorner.x * halfW) + toC * (aCorner.y * halfL);
    c.y = py + (aSw.w > 1.5 ? .06 : .19);
    vCol *= .12 * uWet * mix(.3, 1., min(uLamp * 1.25, 1.)) * lim * smoothstep(1.5, 5., D);
    laid = halfL;
  }
  vec4 mvPosition = viewMatrix * vec4(c, 1.);
  float d = max(-mvPosition.z, .1);
  size = max(size, d * .0045);
  mvPosition.xy += aCorner * (size * (1. - step(.5, laid)));
  vC2 = aCorner; vLaid = laid;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Pt=`
varying vec2 vC2; varying vec3 vCol; varying float vLaid;
#include <fog_pars_fragment>
void main(){
  float r = length(vC2);
  float f = max(1. - r, 0.);
  float I = exp(-r * r * 26.) * 3.2 + f * f * f * .55;
  if (vLaid > .5) {
    // a lamp lying in the wet: a long soft streak toward the eye, broken across by the roughness of the ground, soft at both ends
    float x2 = vC2.x * vC2.x, y2 = vC2.y * vC2.y;
    float ym = vC2.y * vLaid;
    float brk = .74 + .26 * sin(ym * 5.3 + sin(ym * 1.7 + vC2.x * 2.) * 2.6) * sin(ym * 2.1 + 1.3);       // (uneven: never a ruled ladder of bars)
    I = exp(-x2 * 6.) * (1. - x2) * exp(-y2 * 3.2) * (1. - y2) * (1. - y2) * 2.1 * brk;
  }
  ${gt}
  gl_FragColor = vec4(vCol * I * (1. - fogF), 1.);
}`,Yt=`
attribute vec2 aCorner; attribute vec4 aP; attribute vec4 aVel;
uniform float uTime, uFresh; uniform vec4 uGndK;
varying vec2 vC2; varying vec3 vL; varying vec3 vS;
#include <fog_pars_vertex>
void main(){
  float life = 1. / aP.y;
  float t = fract(uTime * aP.y + aP.x);
  vec3 c = position + aVel.xyz * (t * life);
  c.x += sin(uTime * .31 + aP.x * 31.) * 1.2 * t; c.z += cos(uTime * .27 + aP.x * 17.) * 1.2 * t;
  c.y += sqrt(t) * aP.w * .35;
  float size = aP.z + aP.w * t;
  float al = smoothstep(0., .12, t) * (1. - t) * (1. - t);
  al *= mix(1., uFresh * .4 * uGndK.w, aVel.w);
  vL = c; vC2 = aCorner; vS = vec3(aP.x * 13., t, al);
  vec4 mvPosition = modelViewMatrix * vec4(c, 1.);
  float ro = aP.x * 6.283 + t * (aP.x - .5) * 2.;
  mat2 R = mat2(cos(ro), -sin(ro), sin(ro), cos(ro));
  mvPosition.xy += R * aCorner * size;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Gt=`
uniform vec3 uCamL;
varying vec2 vC2; varying vec3 vL; varying vec3 vS;
#include <fog_pars_fragment>
${nt}
void main(){
  float r = length(vC2);
  float n = fbm(vC2 * 1.7 + vS.x + vec2(0., -vS.y * 1.5));
  float sr = clamp(1. - r - (n - .5) * .55, 0., 1.);
  float a = vS.z * sr * sr * (3. - 2. * sr) * sr;
  if (a < .004) discard;
  vec3 V = normalize(uCamL - vL + vec3(0., 1e-4, 0.));
  float vis = sunVis(vL);
  float fs = max(dot(-V, uSunDir), 0.);
  vec3 col = uAmbCol * 1.15 * shedAO(vL) + uFillCol * .3;
  col += uSunCol * (uSun * vis * (.42 + .8 * fs * fs * fs + .3 * (1. - smoothstep(.2, .9, r))));
  col *= .75 + .4 * n;
  a *= smoothstep(.6, 5., vFogDepth);
  gl_FragColor = vec4(col, a * .68);
  #include <fog_fragment>
}`,Wt=`
varying vec2 vUv; varying vec3 vL;
#include <fog_pars_vertex>
void main(){ vUv = uv; vL = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ht=`
varying vec2 vUv; varying vec3 vL;
#include <fog_pars_fragment>
${nt}
void main(){
  float soft = 1. - vUv.y * vUv.y; soft *= soft;
  float along = smoothstep(0., .08, vUv.x) * smoothstep(1., .55, vUv.x);
  float n = fbm(vec2(vUv.x * 7. - uTime * .36, vUv.y * 1.5 + uTime * .17 + vL.z * .1)) * .7 + fbm(vec2(vUv.x * 17. + uTime * .5, vUv.y * 4. - uTime * .3 + vL.z * .3)) * .3;
  n = smoothstep(.22, .78, n);
  vec2 mq = vec2(vUv.x * 70. - uTime * .5, vUv.y * 7. + uTime * .23 + vL.z * .37), mi = floor(mq);
  float mote = step(.93, h21(mi)) * (1. - smoothstep(.05, .32, length(fract(mq) - .5))) * (.5 + .5 * sin(uTime * 3. + h21(mi + 3.1) * 40.));
  float e = smoothstep(-uEdge.w, uEdge.w, uEdge.z - dot(vL.xz, uEdge.xy));
  ${gt}
  float lowK = smoothstep(2.4, 6.5, vL.y) * (.35 + .65 * smoothstep(-13., -3., vL.x));       // a beam thins out above the carriage roofs: it never ends as a bar across a tender or a barrow
  float I = soft * along * lowK * (.16 + 1.5 * n + 2.2 * mote) * uSun * e * smoothstep(1.5, 9., vFogDepth) * (1. - fogF);
  gl_FragColor = vec4(uSunCol * I * .13, 1.);
}`,Xt=`
attribute vec2 aCorner; attribute vec4 aP;
uniform float uTime, uFresh;
varying vec2 vC2; varying vec3 vL; varying float vA;
#include <fog_pars_vertex>
void main(){
  float t = fract(uTime * aP.y + aP.x);
  float fall = t * t * aP.z;
  vec3 c = position - vec3(0., fall, 0.);
  vL = c; vC2 = aCorner;
  vA = (.35 + .65 * uFresh) * step(aP.w, .35 + .65 * uFresh) * smoothstep(0., .1, t);
  vec4 mvPosition = modelViewMatrix * vec4(c, 1.);
  float d = max(-mvPosition.z, .1);
  float w = max(.022, d * .0011);
  float up = (viewMatrix * vec4(0., 1., 0., 0.)).y;
  mvPosition.xy += vec2(aCorner.x * w, aCorner.y * (.12 + .5 * t) * up);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ut=`
varying vec2 vC2; varying vec3 vL; varying float vA;
#include <fog_pars_fragment>
${nt}
void main(){
  float a = (1. - abs(vC2.x)) * (1. - vC2.y * vC2.y) * vA;
  vec3 col = uHorizCol * .7 + uSunCol * uSun * sunVis(vL) * 1.6;
  gl_FragColor = vec4(col, a * .8);
  #include <fog_fragment>
}`;function lt(){const t=[],m=[],a=[],p=[],T=[],P=[];let C=.5,I=.5,A=.5,N=0,k=0;const s={get tris(){return P.length/3},get nv(){return k},mat(o,e){return o&&(C=o[0],I=o[1],A=o[2]),e!==void 0&&(N=e),s},v(o,e,r,l,u,i,f,v,h=1){return t.push(o,e,r),m.push(l,u,i),a.push(C*h,I*h,A*h),p.push(f,v),T.push(N),k++},quad(o,e,r,l,u=0,i=0,f=1,v=1,h=1){const b=e[0]-o[0],c=e[1]-o[1],x=e[2]-o[2],S=l[0]-o[0],y=l[1]-o[1],w=l[2]-o[2];let R=c*w-x*y,D=x*S-b*w,V=b*y-c*S;const z=Math.hypot(R,D,V)||1;R/=z,D/=z,V/=z;const E=s.v(o[0],o[1],o[2],R,D,V,u,i,h);s.v(e[0],e[1],e[2],R,D,V,f,i,h),s.v(r[0],r[1],r[2],R,D,V,f,v,h),s.v(l[0],l[1],l[2],R,D,V,u,v,h),P.push(E,E+1,E+2,E,E+2,E+3)},tri(o,e,r,l=[0,0],u=[1,0],i=[.5,1],f=1){const v=e[0]-o[0],h=e[1]-o[1],b=e[2]-o[2],c=r[0]-o[0],x=r[1]-o[1],S=r[2]-o[2];let y=h*S-b*x,w=b*c-v*S,R=v*x-h*c;const D=Math.hypot(y,w,R)||1;y/=D,w/=D,R/=D;const V=s.v(o[0],o[1],o[2],y,w,R,l[0],l[1],f);s.v(e[0],e[1],e[2],y,w,R,u[0],u[1],f),s.v(r[0],r[1],r[2],y,w,R,i[0],i[1],f),P.push(V,V+1,V+2)},box(o,e,r,l,u,i,f=0,v={}){const h=Math.cos(f),b=Math.sin(f),c=l/2,x=u/2,S=i/2,y=v.uv||1,w=v.shade||1,R=(g,M,F)=>[o+g*h+F*b,e+M,r-g*b+F*h],D=R(-c,-x,S),V=R(c,-x,S),z=R(c,x,S),E=R(-c,x,S),B=R(-c,-x,-S),G=R(c,-x,-S),$=R(c,x,-S),L=R(-c,x,-S),Z=v.u0||0,K=v.v0!==void 0?v.v0:e-x;return s.quad(D,V,z,E,Z,K*y,Z+l*y,(K+u)*y,w),s.quad(G,B,L,$,Z+(l+i)*y,K*y,Z+(2*l+i)*y,(K+u)*y,w*.96),s.quad(V,G,$,z,Z+l*y,K*y,Z+(l+i)*y,(K+u)*y,w*.98),s.quad(B,D,E,L,Z-i*y,K*y,Z,(K+u)*y,w*.98),v.top!==!1&&s.quad(E,z,$,L,Z,r*y,Z+l*y,(r+i)*y,w*1.04),v.bottom&&s.quad(B,G,V,D,Z,0,Z+l*y,i*y,w*.8),s},strut(o,e,r,l=r){const u=e[0]-o[0],i=e[1]-o[1],f=e[2]-o[2],v=Math.hypot(u,i,f)||1;let h,b,c;if(Math.abs(u)+Math.abs(f)<1e-4)h=1,b=0,c=0;else{const G=Math.hypot(u,f);h=f/G,b=0,c=-u/G}const x=u/v,S=i/v,y=f/v,w=b*y-c*S,R=c*x-h*y,D=h*S-b*x,V=r/2,z=l/2,E=(G,$,L)=>[G[0]+h*V*$+w*z*L,G[1]+b*V*$+R*z*L,G[2]+c*V*$+D*z*L],B=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let G=0;G<4;G++){const $=B[G],L=B[(G+1)%4];s.quad(E(o,$[0],$[1]),E(o,L[0],L[1]),E(e,L[0],L[1]),E(e,$[0],$[1]),G*.3,0,G*.3+.3,v,.92+.04*G)}return s},lathe(o,e,r,l,u,i={}){const f=i.phase||0,v=i.us||1,h=i.vs||1,b=i.sx||1,c=x=>i.vmap?(e+x-i.vmap[0])/(i.vmap[1]-i.vmap[0]):(e+x)*h;for(let x=0;x<l.length-1;x++){const S=l[x][0],y=l[x][1],w=l[x+1][0],R=l[x+1][1],D=w-S,V=R-y,z=Math.hypot(D,V)||1,E=V/z,B=-D/z,G=Math.max(S,w,.01);if(i.flat)for(let $=0;$<u;$++){const L=f+$/u*6.2832,Z=f+($+1)/u*6.2832,K=Math.cos(L),g=Math.sin(L),M=Math.cos(Z),F=Math.sin(Z),_=G*6.2832/u*v;s.quad([o+M*S*b,e+y,r+F*S],[o+K*S*b,e+y,r+g*S],[o+K*w*b,e+R,r+g*w],[o+M*w*b,e+R,r+F*w],$*_,c(y),($+1)*_,c(R),.9+.1*Math.abs(Math.cos(L*2+x)))}else{const $=k;for(let L=0;L<=u;L++){const Z=f+L/u*6.2832,K=Math.cos(Z),g=Math.sin(Z),M=L/u*G*6.2832*v;s.v(o+K*S*b,e+y,r+g*S,K*E,B,g*E,M,c(y)),s.v(o+K*w*b,e+R,r+g*w,K*E,B,g*E,M,c(R))}for(let L=0;L<u;L++){const Z=$+L*2;P.push(Z,Z+1,Z+3,Z,Z+3,Z+2)}}}return s},build(){const o=new q.BufferGeometry;for(const e of d)e(o);return o},async buildAsync(o){const e=new q.BufferGeometry;for(const r of d)r(e),await o();return e}},d=[o=>o.setAttribute("position",new q.Float32BufferAttribute(t,3)),o=>o.setAttribute("normal",new q.Float32BufferAttribute(m,3)),o=>o.setAttribute("aCol",new q.Float32BufferAttribute(a,3)),o=>o.setAttribute("uv",new q.Float32BufferAttribute(p,2)),o=>o.setAttribute("aK",new q.Float32BufferAttribute(T,1)),o=>o.setIndex(k>65535?new q.Uint32BufferAttribute(P,1):new q.Uint16BufferAttribute(P,1)),o=>o.computeBoundingSphere()];return s}const Ct=t=>{const m=new q.Color(t);return[m.r,m.g,m.b]},Q=(t,m,a)=>[it(t[0],m[0],a),it(t[1],m[1],a),it(t[2],m[2],a)],Y=(t,m)=>[t[0]*m,t[1]*m,t[2]*m],ft=[-50,-25,0,25],$t=[-9.9,-2.2,6.4,10.3],It=[0,1,2,2,3,4,5,5,6,7,8,8,9,10,11,11],Zt=[0,0,0,0,1,1,1,1,2,2,3,3],tt=-2.6,jt=[-6.8,tt,2.4,7],pt=9,bt=10;function Jt(t,m){const a=t.range(4.35,4.85),p=m-10,T=t.range(150,172),P=T-t.range(14,22),C=t.range(54,60),I=[],A=[];for(let r=0;r<4;r++)for(let l=0;l<4;l++)I.push(r===2&&l===1?tt:ft[r]+$t[l]);for(let r=0;r<12;r++)A.push(r===7?tt:-2.2+(r-7)*a);const N=r=>{const l=Math.max(0,r-260);return l*l/1340},k=[];for(let r=1,l=t.int(2,3);r<=l;r++)k.push({base:15,off:a*r,zs:244-r*t.range(9,13),ze:60+r*t.range(4,8)});for(let r=1;r<=2;r++)k.push({base:0,off:-a*r,zs:248-r*t.range(9,13),ze:58+r*t.range(4,8)});const s=(r,l)=>{if(r>=16){const h=k[r-16];return s(h.base,l)+h.off*st(h.zs,h.zs-36,l)}const u=It[r],i=jt[Zt[u]],f=st(p,T,l),v=st(P,C,l);return i+(A[u]-i)*f+(I[r]-A[u])*v+N(l)},d=[],o=new Set,e=new Set;for(let r=0;r<16;r++){const l=It[r],u=Zt[l];let i=m;o.has(l)?i=P+2:e.has(u)&&(i=p+2),o.add(l),e.add(u);const f=r===pt?-146:-133+r%3*.8,v=[];for(let h=i;h>f;h-=5)v.push([s(r,h),h]);v.push([s(r,f),f]),d.push({x:I[r],pts:v,from:i,end:f})}return k.forEach((r,l)=>{const u=[];for(let i=r.zs+2;i>r.ze;i-=5)u.push([s(16+l,i),i]);u.push([s(16+l,r.ze),r.ze]),d.push({x:s(16+l,r.ze),pts:u,from:r.zs+2,end:r.ze,siding:!0})}),{tracks:d,xAt:s,roadX:I,midX:A,zA0:p,zA1:T,zB0:P,zB1:C}}function Qt(t,m){const a=[],p=[],T=[],P=[],C=[];let I=0;const A=(s,d,o,e,r,l)=>{let u=0;for(let i=0;i<s.length;i++){const f=s[Math.max(i-1,0)],v=s[Math.min(i+1,s.length-1)];let h=v[0]-f[0],b=v[1]-f[1];const c=Math.hypot(h,b)||1;h/=c,b/=c;const x=-b,S=h;i>0&&(u+=Math.hypot(s[i][0]-s[i-1][0],s[i][1]-s[i-1][1]));const y=s[i][0]+x*d,w=s[i][1]+S*d;l?(a.push(y,e,w,y,e-o,w),p.push(-1,u,1,u)):(a.push(y-x*o,e,w-S*o,y+x*o,e,w+S*o),p.push(-o,u,o,u)),T.push(r,r),P.push(h,0,b,h,0,b),i>0&&C.push(I-2,I-1,I+1,I-2,I+1,I),I+=2}};t.tracks.forEach((s,d)=>{A(s.pts,0,1.42,.03+d*.004,0,!1);const o=d>=8&&d<=11;for(const e of[-.84,.84])A(s.pts,e,.2,.19,1,!1),o&&A(s.pts,e,.16,.185,2,!0)});const N=[];for(let s=262;s>=62;s-=8)N.push([.15+Math.max(0,s-260)**2/1340,s]);A(N,0,.5,.2,3,!1);const k=new q.BufferGeometry;return k.setAttribute("position",new q.Float32BufferAttribute(a,3)),k.setAttribute("uv",new q.Float32BufferAttribute(p,2)),k.setAttribute("aM",new q.Float32BufferAttribute(T,1)),k.setAttribute("aT",new q.Float32BufferAttribute(P,3)),k.setIndex(C),k}function te(t,m){const P=m+4,C=62,I=Math.round((P- -146)/4),A=[],N=[],k=[];for(let d=0;d<=I;d++){const o=-146+(P- -146)*d/I,e=t.tracks.map((r,l)=>o<=r.from+3&&o>=r.end-1?t.xAt(l,o):1e6);for(let r=0;r<=C;r++){const l=-75+125*r/C;let u=9;for(let i=0;i<e.length;i++)u=Math.min(u,Math.abs(l-e[i]));A.push(l,0,o),N.push(u)}}for(let d=0;d<I;d++)for(let o=0;o<C;o++){const e=d*(C+1)+o,r=e+C+1;k.push(e,r,e+1,e+1,r,r+1)}const s=new q.BufferGeometry;return s.setAttribute("position",new q.Float32BufferAttribute(A,3)),s.setAttribute("aTd",new q.Float32BufferAttribute(N,1)),s.setIndex(k),s}function xt(t){const m=[],a=[],p=[],T={};let P=0;for(const C in t)T[C]=[];return{get count(){return P/4},add(C,I,A,N){const k=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let s=0;s<4;s++){m.push(C,I,A),a.push(k[s][0],k[s][1]);for(const d in t){const o=N[d];for(let e=0;e<t[d];e++)T[d].push(o[e])}}p.push(P,P+1,P+2,P,P+2,P+3),P+=4},build(){const C=new q.BufferGeometry;C.setAttribute("position",new q.Float32BufferAttribute(m,3)),C.setAttribute("aCorner",new q.Float32BufferAttribute(a,2));for(const I in t)C.setAttribute(I,new q.Float32BufferAttribute(T[I],t[I]));return C.setIndex(p),C}}}function Kt(t,m,a,p,T,P,C,I){const A=P/2,N=[[-A,-A],[A,-A],[A,A],[-A,A]];for(const s of N)t.strut([m+s[0],p,a+s[1]],[m+s[0],T,a+s[1]],C*1.3);const k=Math.max(1,Math.round((T-p)/I));for(let s=0;s<4;s++){const d=N[s],o=N[(s+1)%4];for(let e=0;e<k;e++){const r=p+(T-p)*e/k,l=p+(T-p)*(e+1)/k,u=(e+s)%2;t.strut([m+(u?d:o)[0],r,a+(u?d:o)[1]],[m+(u?o:d)[0],l,a+(u?o:d)[1]],C)}}}const At=-12,St=-166,Vt=9.2,Bt=1.35,ee=1.56,oe=.61,kt=.5;function ae(t,m){let a=1/0,p=-1/0;for(let T=m;T>t;T-=2.5){const P=Math.atan2(At,T-St),C=Math.asin(Vt*Bt/Math.hypot(At,T-St));a=Math.min(a,(T-t)*Math.tan(P-C)),p=Math.max(p,(T-t)*Math.tan(P+C))}return a<p?[a,p]:null}function se(t,m,a,p,T,P,C,I,A,N=null){const k=[];T.tracks.forEach((c,x)=>{if(c.from+1>=a&&c.end<=a){const S=T.xAt(x,a);k.some(y=>Math.abs(y.x-S)<1.2)||k.push({x:S,r:x})}}),k.sort((c,x)=>c.x-x.x);const s=k[0].x-P.range(3.6,5),d=k[k.length-1].x+P.range(3.6,5),o=7.6,e=9.2,r=.6,l=[s,d],u=[];for(let c=0;c<k.length-1;c++){const x=k[c+1].x-k[c].x,S=(k[c].x+k[c+1].x)/2;x>=4.25&&Math.abs(S)>7&&u.push(S)}for(const c of[it(s,d,.36),it(s,d,.7)]){let x=null;for(const S of u)(x===null||Math.abs(S-c)<Math.abs(x-c))&&(x=S);x!==null&&Math.abs(x-c)<14&&!l.some(S=>Math.abs(S-x)<8)&&l.push(x)}t.mat(C.iron,n.IRON);for(const c of l)t.mat(C.stoneDark,n.STONE).box(c,.3,a,1.9,.6,1.9,0,{v0:0}),t.mat(C.iron,n.IRON),Kt(t,c,a,.6,e,1.1,.11,1.45);const i=Math.round((d-s)/1.6),f=(d-s)/i;for(const c of[a-r,a+r])for(const x of[o,e])t.strut([s-.6,x,c],[d+.6,x,c],.17);for(let c=0;c<=i;c++){const x=s+c*f,S=x+f,y=c%2;for(const w of[a-r,a+r])t.strut([x,o,w],[x,e,w],.1),c<i&&t.strut([x,y?o:e,w],[S,y?e:o,w],.09);c<i&&c%2===0&&t.strut([x,e,a-r],[S,e,a+r],.08)}t.mat(C.wood,n.WOOD).box((s+d)/2,e+.12,a-.15,d-s+1,.07,1,0,{uv:1}),t.mat(C.iron,n.IRON).strut([s,e+1.15,a-r],[d,e+1.15,a-r],.07);for(let c=s;c<=d;c+=3.2)t.strut([c,e,a-r],[c,e+1.15,a-r],.06);const v=[],h=[1,.07,.03],b=[.05,1,.55];for(const c of k){const x=c.r===pt,S=c.x+(x?-tt:0),y=x?0:kt;if(N&&S+y+oe>N[0]&&S-y-ee<N[1]||!x&&c.r!==bt&&I.arms.length>=I.maxArms-1||!x&&c.r!==bt&&A.chance(.12))continue;const w=S+(x?0:A.range(-kt,kt)),R=e+A.range(3.9,5.4),D=a+r;t.mat(C.cream,n.IRON).strut([w,e,D],[w,R-1.6,D],.2),t.mat(C.iron,n.IRON).strut([w,R-1.6,D],[w,R,D],.17),t.lathe(w,R,D,[[.16,0],[.2,.08],[.02,.5]],4,{flat:!0,phase:.785}),t.mat(C.iron,n.LATTICE).quad([w+.52,e,D-.3],[w+.52,R-.5,D-.3],[w+.12,R-.5,D-.3],[w+.12,e,D-.3],0,0,(R-.5-e)/.4,1),v.push(new q.Vector3(w,R+.5,D));const V=!x&&A.chance(.22)?2:1;for(let z=0;z<V&&I.arms.length<I.maxArms;z++){const E=R-.75-z*1.5,B=D+.2,G=m,$=G.nv,L=z===1;G.mat(L?[.75,.5,.06]:[.62,.05,.04],n.MATTE).box(w-.55,E,B,.9,.27,.035),G.mat([.8,.78,.7],n.MATTE).box(w-1.1,E,B,.2,.27,.035),G.mat(L?[.75,.5,.06]:[.62,.05,.04],n.MATTE).box(w-1.38,E,B,.36,.27,.035),G.mat(C.iron,n.IRON).box(w+.3,E-.13,B-.03,.62,.56,.03),G.mat(h,n.GLOW).box(w+.45,E,B,.17,.17,.02),G.mat(b,n.GLOW).box(w+.31,E-.32,B,.17,.17,.02);let Z=0,K=2;x?K=p-.085-z*.01:c.r===bt?(Z=1,K=p-.2):c.r===13?K=.5+A.range(0,.04):A.chance(.25)?(Z=1,K=A.range(.52,.92)):A.chance(.3)&&(K=A.range(.52,.92)),I.arms.push({v0:$,v1:G.nv,piv:[w,E,B,K],arm:[.82,Z,A()]}),t.mat(C.iron,n.IRON).box(w+.45,E,B-.2,.2,.26,.2);const g=Z?b:h,M=Z?h:b;for(const F of[0,1])I.glows.add(w+.45,E,B+.08,{aColA:Y(g,2.6),aColB:Y(M,2.6),aSw:[K,A(),.42,F]})}}return{z:a,y0:o,y1:e,xl:s,xr:d,perches:v,band:N}}function ne(t,m,a,p,T,P){const A=p.range(8,10.5),N=2.9;t.mat(T.iron,n.IRON);for(const f of[-1,1])for(let v=0;v<4;v++){const h=a-A/2+.4+(A-.8)*v/3,b=m+f*(3.8/2-.25);if(t.strut([b,0,h],[b,4.4,h],.2),v<3){const c=h+(A-.8)/3;t.strut([b,.3,v%2?h:c],[b,4.4-.2,v%2?c:h],.09)}}t.mat(T.brick,n.BRICK).box(m,1.3,a-A/2+1.6,3.8-.7,2.6,2.6,0,{v0:0}),t.mat(T.wood,n.WOOD).box(m+.5,4.4+.1,a,3.8+1.6,.2,A+.8,0,{bottom:!0}),t.mat(T.iron,n.IRON);const k=m+3.8/2+1.2;t.strut([k,4.4+1.2,a-A/2-.3],[k,4.4+1.2,a+A/2+.3],.07);for(let f=0;f<=6;f++){const v=a-A/2-.3+(A+.6)*f/6;t.strut([k,4.4+.2,v],[k,4.4+1.2,v],.06)}const s=4.4+.2;t.mat(T.maroon,n.WOOD).box(m,s+.5,a,3.8,1,A,0,{top:!1}),t.mat(T.creamPaint,n.WOOD).box(m,s+N-.25,a,3.8,.5,A,0,{top:!1}),t.mat(T.glass,n.GLASS);const d=3.8/2-.03,o=A/2-.03;t.quad([m+d,s+1,a+o],[m+d,s+1,a-o],[m+d,s+N-.5,a-o],[m+d,s+N-.5,a+o],0,0,A,1.4),t.quad([m-d,s+1,a+o],[m+d,s+1,a+o],[m+d,s+N-.5,a+o],[m-d,s+N-.5,a+o],0,0,3.8,1.4),t.quad([m+d,s+1,a-o],[m-d,s+1,a-o],[m-d,s+N-.5,a-o],[m+d,s+N-.5,a-o],0,0,3.8,1.4),t.mat(T.creamPaint,n.WOOD).box(m-d+.05,s+1.7,a,.1,1.4,A,0,{top:!1});for(const f of[-1,1])for(const v of[-1,1])t.box(m+f*(3.8/2-.08),s+1.7,a+v*(A/2-.08),.2,1.4,.2,0,{top:!1});const e=s+N,r=3.8/2+.7,l=A/2+.7,u=1.5,i=A/2-1.2;t.mat(T.slate,n.SLATE),t.quad([m+r,e,a+l],[m+r,e,a-l],[m,e+u,a-i],[m,e+u,a+i],0,0,A,2.4),t.quad([m-r,e,a-l],[m-r,e,a+l],[m,e+u,a+i],[m,e+u,a-i],0,0,A,2.4),t.tri([m-r,e,a+l],[m+r,e,a+l],[m,e+u,a+i],[0,0],[3.8,0],[3.8/2,2.4]),t.tri([m+r,e,a-l],[m-r,e,a-l],[m,e+u,a-i],[0,0],[3.8,0],[3.8/2,2.4]),t.mat(T.wood,n.WOOD).box(m,e-.06,a,r*2,.1,l*2,0,{bottom:!0,top:!1}),t.mat(T.iron,n.IRON).lathe(m-.9,e+.6,a+i-1,[[.11,0],[.11,1.7],[.2,1.75],[.2,1.95],[.02,2.1]],6);for(const f of[-1,1])t.lathe(m,e+u,a+f*i,[[.09,0],[.13,.15],[.02,.7]],4,{flat:!0});t.mat(T.wood,n.WOOD);for(let f=0;f<9;f++)t.box(m-3.8/2-.55,.3+f*.5,a+A/2-.6-f*.55,.9,.07,.34);t.mat(T.iron,n.IRON).strut([m-3.8/2-1,1.2,a+A/2-.4],[m-3.8/2-1,4.4+1.2,a+A/2-5.4],.07);for(let f=0;f<4;f++)t.mat([.55,.06,.04],n.MATTE).lathe(k,4.4-.5,a-1.2+f*.75,[[.1,0],[.16,.3]],6);return P.glows.add(m,s+2,a,{aColA:[1.6,.9,.4],aColB:[1.6,.9,.4],aSw:[2,p(),.5,0]}),P.steam.add(m-.9,e+2.7,a+i-1,{aP:[p(),.16,.25,1.6],aVel:[.25,1.1,.1,0]}),new q.Vector3(m,4.4+.2,a)}function re(t,m,a,p,T,P,C){t.mat(P.stoneDark,n.STONE).box(m,.12,a,1.1,.24,1.1,0,{v0:0}),t.mat(P.maroon,n.IRON).lathe(m,.24,a,[[.36,0],[.36,.25],[.24,.45],[.2,1.4],[.24,1.5],[.19,1.6],[.17,4],[.26,4.1],[.26,4.3],[.1,4.55]],8);const I=m+p*2.5,A=4.3;t.mat(P.iron,n.IRON).strut([m,A,a],[I,A+.15,a],.22),t.strut([m,A-1,a],[m+p*1.5,A+.05,a],.07),t.lathe(m-p*.45,1.3,a,[[.02,0],[.24,.02],[.24,.07],[.02,.09]],8),t.mat(P.leather,n.MATTE).lathe(I,A-1.75,a,[[.07,0],[.11,.5],[.17,1.3],[.15,1.75]],6);for(let N=0;N<3;N++)C.drips.add(I,A-1.75,a,{aP:[T(),T.range(.7,1.3),2.5,T()*.3]});return new q.Vector3(I,A-1.75,a)}function ie(t,m,a,p,T,P,C){for(const s of[-74.2,49.2]){const d=o=>Math.max(0,o-260)**2/1340;for(let o=0;o<a;o+=20){const e=o,r=Math.min(a,o+20),l=s+d((e+r)/2),u=2.7+.25*Math.sin(o*.37+s);t.mat(Y(T.brick,p.range(.85,1.1)),n.BRICK).box(l,u/2,(e+r)/2,.5,u,r-e,0,{v0:0,u0:o}),t.mat(T.stoneDark,n.STONE).box(l,u+.08,(e+r)/2,.7,.16,r-e),t.mat(Y(T.brick,.9),n.BRICK).box(l,(u+.3)/2,e+.4,.85,u+.3,.8,0,{v0:0})}}const I=p.range(118,160);let A=1e9;m.tracks.forEach((s,d)=>{s.end<I&&(A=Math.min(A,m.xAt(d,I-6),m.xAt(d,I+6)))}),C.cabin=ne(t,Math.min(-42,A-7.5),I,p,T,P),C.waterColumns=[[-12.3,1],[12.7,-1],[-37.3,1],[38.2,-1]].map(([s,d],o)=>re(t,s,50+o%2*3.5,d,p,T,P));for(let s=0;s<12;s++){const d=p.int(0,15),o=p.range(70,a-30),e=m.xAt(d,o)+(p.chance(.5)?2.05:-2.05);Math.abs(e)<1.2||m.tracks.some((r,l)=>r.end<o&&r.from>o&&Math.abs(m.xAt(l,o)-e)<1.9)||(t.mat(T.iron,n.IRON).box(e,.3,o,.12,.6,.12),t.mat([.8,.78,.72],n.MATTE).box(e,.72,o+.07,.4,.4,.04),t.mat([.6,.05,.04],n.MATTE).box(e,.72,o+.1,.4,.09,.02),P.glows.add(e,.98,o+.12,{aColA:[1.6,.12,.05],aColB:[.1,1.6,.8],aSw:[p.chance(.4)?p.range(.5,.9):2,p(),.16,0]}),t.mat(T.iron,n.IRON).strut([e+.5,.05,o-.6],[e+.75,.95,o-.6],.07),t.mat([.8,.78,.72],n.MATTE).box(e+.76,1,o-.6,.16,.16,.16))}{const s=p.range(175,215);let d=-1e9;m.tracks.forEach((e,r)=>{e.end<s-6&&e.from>s-6&&(d=Math.max(d,m.xAt(r,s-6),m.xAt(r,s+6)))});const o=Math.max(d+7.5,40);if(o<45){t.mat(T.iron,n.IRON);for(const e of[-2.4,2.4])for(const r of[-1.8,1.8])t.mat(T.stoneDark,n.STONE).box(o+e,.25,s+r,1.3,.5,1.3,0,{v0:0}),t.mat(T.iron,n.IRON),Kt(t,o+e,s+r,.5,6.6,.8,.09,1.5);for(const e of[-1.8,1.8])t.strut([o-3.4,6.75,s+e],[o+3.4,6.75,s+e],.3);t.mat(Q(T.maroon,T.iron,.5),n.IRON).box(o,8.25,s,6.8,2.7,4.6,0,{bottom:!0}),t.mat(T.iron,n.IRON);for(const e of[6.98,8.25,9.55])t.box(o,e,s,6.95,.12,4.75,0,{top:!1});for(let e=-2;e<=2;e++)t.box(o+e*1.36,8.25,s,.1,2.7,4.72,0,{top:!1});t.mat(T.iron,n.LATTICE).quad([o-3.5,.3,s+2.5],[o-3.5,9.9,s+2.5],[o-3.5,9.9,s+2.05],[o-3.5,.3,s+2.05],0,0,24,1),t.mat(T.leather,n.MATTE).lathe(o-2.2,4.4,s-2.9,[[.1,0],[.16,.6],[.14,2.35]],6),t.mat(T.iron,n.IRON).strut([o-2.2,6.9,s-1.8],[o-2.2,6.75,s-2.9],.2);for(let e=0;e<9;e++)P.drips.add(o+p.range(-3.3,3.3),6.9,s+(p.chance(.5)?2.3:-2.3),{aP:[p(),p.range(.6,1.1),6.8,p()*.6]});C.waterTank=new q.Vector3(o,9.7,s)}for(let e=0;e<7;e++){const r=p.range(170,a-30),l=p.range(-71,-52),u=p.range(1.4,2.8),i=u*p.range(.38,.5);m.tracks.some((f,v)=>f.end<r&&f.from>r&&Math.abs(m.xAt(v,r)-l)<u+2.4)||t.mat(p.chance(.5)?[.035,.033,.035]:[.2,.18,.15],n.MATTE).lathe(l,0,r,[[u,0],[u*.55,i*.65],[u*.12,i]],7,{phase:p()*6,sx:p.range(.8,1.5)})}}const N=-68+p.range(-1.5,1.5),k=p.range(36,50);t.mat(T.brick,n.BRICK).box(N,1.15,k,3.4,2.3,2.8,0,{v0:0,top:!1}),t.mat(T.tin,n.CORR).quad([N-2.1,2.2,k+1.8],[N+2.1,2.7,k+1.8],[N+2.1,2.7,k-1.8],[N-2.1,2.2,k-1.8],0,0,3.6,4.2);for(let s=0;s<6;s++){const d=N+p.range(-1.7,1.7);t.mat(T.stoneDark,n.MATTE).box(d,2.5+d*0+(d-N)*.12,k+p.range(-1.4,1.4),.3,.2,.26,p()*3)}t.mat(T.maroon,n.WOOD).box(N+1.72,1,k+.4,.06,2,.9);for(let s=0;s<3;s++){const d=43+p.range(-2,2),o=p.range(80,230),e=p.range(-.2,.2);let r=-1e9;if(m.tracks.forEach((l,u)=>{l.end<o+3&&(r=Math.max(r,m.xAt(u,o)))}),!(d<r+3.6))for(let l=0;l<4;l++)t.mat(Y(T.sleeper,p.range(.8,1.3)),n.WOOD).box(d,.14+l*.27,o,2.6,.25,2.2-l*.3,e+l%2*1.5708)}m.tracks.forEach(s=>{if(!s.siding)return;const d=s.x,o=s.end-.5;t.mat([.5,.07,.05],n.WOOD).box(d,1.05,o,2.5,.4,.45);for(const e of[-.84,.84])t.mat(T.iron,n.IRON).strut([d+e,.15,o+2.2],[d+e,1.1,o],.14).strut([d+e,.15,o+.1],[d+e,1.2,o+.1],.14);P.glows.add(d,1.55,o+.3,{aColA:[1.6,.1,.04],aColB:[1.6,.1,.04],aSw:[2,p(),.26,0]})}),C.sidings=m.tracks.filter(s=>s.siding).map(s=>s.pts),t.mat([.22,.12,.08],n.IRON);for(let s=0;s<5;s++)t.box(-69.5+s*.22,.1+s%2*.12,185,.12,.14,11);for(const[s,d]of[[-72.6,110],[-72.6,225],[47.7,60],[47.7,170],[47.7,262]])t.mat(T.iron,n.IRON).lathe(s,0,d,[[.2,0],[.2,.5],[.1,.8],[.07,5.2],[.14,5.3]],6),t.strut([s-.5,4.7,d],[s+.5,4.7,d],.05),t.mat([1,.75,.4],n.GLOW).lathe(s,5.3,d,[[.14,0],[.24,.5]],4,{flat:!0,phase:.785}),t.mat(T.iron,n.IRON).lathe(s,5.8,d,[[.3,0],[.05,.25],[.02,.5]],4,{flat:!0,phase:.785}),P.glows.add(s,5.55,d,{aColA:[1.5,.95,.45],aColB:[1.5,.95,.45],aSw:[2,p(),.55,0]})}const wt={R:12.5,SY:8.5,ZL:-140,BAY:8.75,NB:16};async function le(t,m,a,p,T,P){const{R:C,SY:I,ZL:A,BAY:N,NB:k}=wt,s=(o,e,r)=>[o+Math.cos(r)*e,I+Math.sin(r)*e],d=.7854;for(const o of[0,A]){for(const e of ft){for(let f=0;f<26;f++){const v=Math.PI*f/26,h=Math.PI*(f+1)/26,b=s(e,11.6,v),c=s(e,12.95,v),x=s(e,12.95,h),S=s(e,11.6,h),y=f*1.5,w=y+1.5;t.mat(a.maroon,n.IRON).quad([b[0],b[1],o],[c[0],c[1],o],[x[0],x[1],o],[S[0],S[1],o],y,0,w,1.35),t.quad([S[0],S[1],o],[S[0],S[1],o-.8],[b[0],b[1],o-.8],[b[0],b[1],o],y,2,w,2.8,.8),o===0&&t.quad([c[0],c[1],o],[c[0],c[1],o-.8],[x[0],x[1],o-.8],[x[0],x[1],o],y,3,w,3.8);const R=s(e,11.42,v),D=s(e,11.42,h);t.mat(a.creamPaint,n.IRON).quad([R[0],R[1],o+.05],[b[0],b[1],o+.05],[S[0],S[1],o+.05],[D[0],D[1],o+.05],y,5,w,5.2)}const l=Math.asin((15-I)/11.42),u=14;for(let f=0;f<u;f++){const v=l+(Math.PI-2*l)*f/u,h=l+(Math.PI-2*l)*(f+1)/u,b=s(e,11.42,v),c=s(e,11.42,h);t.mat(a.glass,n.GLASS).quad([c[0],15,o-.1],[b[0],15,o-.1],[b[0],b[1],o-.1],[c[0],c[1],o-.1],c[0],15,b[0],(b[1]+c[1])/2)}const i=Math.cos(l)*11.42;t.mat(a.maroon,n.IRON).box(e,15,o-.1,i*2,.34,.3),t.mat(a.creamPaint,n.VALANCE).quad([e-i+.3,13.75,o-.05],[e+i-.3,13.75,o-.05],[e+i-.3,14.9,o-.05],[e-i+.3,14.9,o-.05],0,1,Math.round((i*2-.6)/.6),0);for(let f=1;f<6;f++){const v=e-i+2*i*f/6,h=I+Math.sqrt(Math.max(11.42*11.42-(v-e)*(v-e),0));t.mat(a.maroon,n.IRON).strut([v,15,o-.1],[v,h,o-.1],.14)}if(o===0){T.shedMouths.push(new q.Vector3(e,13,0));const f=26;for(let v=0;v<f;v++)p.drips.add(e-i+.5+(2*i-1)*(v+m())/f,13.8,.05,{aP:[m(),m.range(.5,.9),13.6,m()]})}}for(let e=0;e<5;e++){const r=-62.5+25*e,l=o===0?-.95:A-.95;t.mat(Y(a.stone,m.range(.9,1.08)),n.STONE),t.box(r,.55,l,3.2,1.1,3.2,0,{v0:0}).box(r,5.25,l,2.5,8.3,2.5,0,{v0:1.1}).box(r,9.65,l,3.1,.5,3.1),t.lathe(r,9.9,l,[[1.6,0],[1.6,1.3],[.8,1.7],[.8,2.9],[1.1,3.1],[.06,6]],4,{flat:!0,phase:d,vs:1}),t.mat(a.stoneDark,n.STONE).lathe(r,15.9,l,[[.05,0],[.3,.2],[.3,.45],[.04,.8]],6);for(const u of[-.92,.92])t.mat(a.voussoir,n.STONE).lathe(r+u,1.1,l+1.3,[[.24,0],[.17,.2],[.17,7.2],[.3,7.6],[.3,7.9]],6);if(o===0&&e>0&&e<4)for(let u=0;u<6;u++)p.drips.add(r+m.range(-.3,.3),9.2,.75,{aP:[m(),m.range(.8,1.4),9,m()*.5]})}await P()}for(const[o,e]of[[37.5,1],[-62.5,-1]]){const r=o+e*.45,l=o-e*.45,u=9.2,i=28;t.mat(a.stone,n.ARCADE),e>0?t.quad([r,0,-1.6],[r,0,A],[r,u,A],[r,u,-1.6],0,0,i,1):t.quad([r,0,A],[r,0,-1.6],[r,u,-1.6],[r,u,A],i,0,0,1),t.mat(Y(a.stone,.9),e>0?n.ARCLIT:n.ARCADE),e>0?t.quad([l,0,A],[l,0,-1.6],[l,u,-1.6],[l,u,A],i,0,0,1):t.quad([l,0,-1.6],[l,0,A],[l,u,A],[l,u,-1.6],0,0,i,1),t.mat(a.stoneLight,n.STONE).box(o,u+.2,A/2,1.4,.4,-A-2);for(let f=1;f<k;f++){const v=-f*N;t.mat(Y(a.stone,m.range(.85,1.05)),n.STONE).box(r+e*.5,4.3,v,1,8.6,1.2,0,{v0:0}),t.box(r+e*.3,8.9,v,.6,.6,1.2),f%2===0&&t.lathe(o,u+.4,v,[[.75,0],[.75,.8],[.05,2.6]],4,{flat:!0,phase:d})}}await P();for(let o=0;o<4;o++){const e=ft[o];for(let l=1;l<k;l++){const u=-l*N,i=18;for(let f=0;f<i;f++){const v=Math.PI*f/i,h=Math.PI*(f+1)/i,b=s(e,11.3,v),c=s(e,11.3,h),x=s(e,12.15,h),S=s(e,12.15,v);t.mat(a.ironPaint,n.LATTICE).quad([b[0],b[1],u],[c[0],c[1],u],[x[0],x[1],u],[S[0],S[1],u],f*2.3,0,(f+1)*2.3,1),t.mat(a.maroon,n.IRON).quad([b[0],b[1],u+.2],[c[0],c[1],u+.2],[c[0],c[1],u-.2],[b[0],b[1],u-.2],f*2,0,f*2+2,.4,.85)}(l&7)===0&&await P(),t.mat(a.iron,n.IRON).strut([e-12.2,9.1,u],[e+12.2,9.1,u],.09),l%3===2?(t.strut([e,20.6,u],[e,10.3,u],.05),t.mat([1,.72,.36],n.GLOW).lathe(e,9.55,u,[[.15,0],[.27,.55]],4,{flat:!0,phase:d}),t.mat(a.iron,n.IRON).lathe(e,10.1,u,[[.44,0],[.12,.28],[.04,.6]],6),p.glows.add(e,9.8,u,{aColA:[1.5,.92,.42],aColB:[1.5,.92,.42],aSw:[2,m(),.75,0]})):l%3===0&&T.pigeons.push(new q.Vector3(e+m.range(-9,9),9.2,u))}for(let l=0;l<7;l++){const u=Math.PI*(l+1)/8,i=s(e,11.75,u),f=s(e,12.2,u);t.mat(a.ironPaint,n.LATTICE).quad([i[0],i[1],-.8],[i[0],i[1],A],[f[0],f[1],A],[f[0],f[1],-.8],0,0,300,1)}const r=20;for(let l=0;l<k;l++){(l&7)===0&&await P();const u=-l*N,i=u-N,f=m.range(.82,1.12),v=m.chance(.07)?m.int(2,5):-1;for(let h=0;h<r;h++){const b=Math.PI*h/r,c=Math.PI*(h+1)/r,x=(b+c)/2*57.3,S=x>62&&x<118||o===3&&l%2===1&&x>9&&x<52,y=s(e,C,b),w=s(e,C,c);if(S)t.mat(a.glass,n.GLASS);else{let R=Y(a.tin,f*(.94+.12*((h*7+l*3)%5)/4));m.chance(.035)&&(R=m.chance(.5)?a.oxide:Y(a.tin,1.6)),t.mat(R,n.CORR)}if(t.quad([y[0],y[1],u],[y[0],y[1],i],[w[0],w[1],i],[w[0],w[1],u],u,b*C,i,c*C),h===v||h===v+1){const R=s(e,C+.1,b),D=s(e,C+.1,c);t.mat(Y(a.blue,.8),n.MATTE).quad([R[0],R[1],u-1.2],[R[0],R[1],i+2.1],[D[0],D[1],i+2.4],[D[0],D[1],u-1.5],0,0,5,2)}}if(l%2===0){const h=u-N+.2;t.mat(Y(a.tin,.55),n.CORR).box(e,21.5,h,2.2,1.2,14.6,0,{top:!1}),t.mat(Y(a.tin,.9*f),n.CORR),t.quad([e+1.6,22,h+7.6],[e+1.6,22,h-7.6],[e,22.75,h-7.6],[e,22.75,h+7.6],0,0,15.2,1.8),t.quad([e-1.6,22,h-7.6],[e-1.6,22,h+7.6],[e,22.75,h+7.6],[e,22.75,h-7.6],0,0,15.2,1.8)}}}for(const o of[-37.5,-12.5,12.5]){await P(),t.mat(Y(a.iron,.8),n.IRON).box(o,8.75,A/2,1.1,.4,-A-.5);for(let e=1;e<k;e++){const r=-e*N;t.mat(a.maroon,n.IRON).lathe(o,0,r,[[.5,0],[.5,.3],[.38,.45],[.38,1.5],[.45,1.58],[.29,1.75]],8),t.mat(a.creamPaint,n.IRON).lathe(o,0,r,[[.27,1.75],[.22,7.3]],8),t.mat(a.maroon,n.IRON).lathe(o,0,r,[[.22,7.3],[.31,7.4],[.27,7.5],[.5,8.1],[.58,8.2],[.58,8.55]],8);for(const l of[-1,1])t.mat(a.ironPaint,n.LATTICE).tri([o+l*.25,6.2,r],[o+l*2.7,8.55,r],[o+l*.25,8.55,r],[0,0],[3,0],[0,1]);if(m.chance(.3)){const l=o>0?1:-1;t.mat(a.wood,n.WOOD).box(o+l*.36,1.75,r,.08,.12,1.3);for(let u=-1;u<=1;u++)t.mat([.55,.06,.04],n.MATTE).lathe(o+l*.5,1.35,r+u*.42,[[.1,0],[.16,.3]],6)}}}}function fe(t,m,a,p,T,P){const k=wt.ZL,s=()=>a.pick([p.maroon,p.buff,Q(p.blue,p.leather,.6),p.tin,p.leather,p.sack,p.sack]),d=(i,f,v,h,b,c,x,S)=>{const y=Math.cos(x),w=Math.sin(x),R=[Math.max(S[0],.1),Math.max(S[1],.085),Math.max(S[2],.07)];t.mat(R,n.WOOD).box(i,f+b/2,v,h,b,c,x),t.mat(p.brass,n.BRASS);for(const D of[-.3,.3])t.box(i+y*D*h,f+b/2+.005,v-w*D*h,.05,b+.01,c+.024,x);t.mat(Y(R,1.5),n.MATTE).box(i,f+b*.74,v,h+.014,.028,c+.014,x,{top:!1}),t.mat(p.brass,n.BRASS);for(const D of[-1,1])t.box(i+y*D*(h/2+.012),f+b*.5,v-w*D*(h/2+.012),.024,.05,c*.42,x,{top:!1})},o=(i,f,v,h)=>{const b=Math.cos(v),c=Math.sin(v);if(!h){t.mat(p.wood,n.WOOD).box(i,1.05+.62,f,1.7,.1,.85,v);for(const y of[-.46,.46]){const w=i+c*y,R=1.05+.42,D=f+b*y,V=.42,z=(E,B)=>[w+b*Math.cos(B)*E,R+Math.sin(B)*E,D-c*Math.cos(B)*E];t.mat([.2,.2,.22],n.MATTE);for(let E=0;E<12;E++){const B=E/12*6.2832,G=(E+1)/12*6.2832;t.quad(z(V*.82,B),z(V,B),z(V,G),z(V*.82,G),0,0,.2,.2,.9+.1*(E%2))}t.mat([.42,.07,.05],n.MATTE);for(let E=0;E<6;E++){const B=(E+.5)/6*6.2832;t.quad(z(.06,B-.5),z(V*.84,B-.07),z(V*.84,B+.07),z(.06,B+.5),0,0,.1,.4)}t.mat(p.brass,n.BRASS);for(let E=0;E<6;E++){const B=E/6*6.2832,G=(E+1)/6*6.2832;t.tri(z(0,0),z(.09,B),z(.09,G))}}t.mat(p.iron,n.IRON).strut([i-c*.46,1.05+.42,f-b*.46],[i+c*.46,1.05+.42,f+b*.46],.05),t.mat(p.wood,n.WOOD).strut([i+b*.85,1.05+.65,f-c*.85],[i+b*1.7,1.05+.95,f-c*1.7],.07),t.strut([i-b*.85,1.05+.6,f+c*.85],[i-b*.85,1.05,f+c*.85],.07)}const x=a.int(2,4);let S=h?1.05:1.05+.67;for(let y=0;y<x;y++){const w=a.range(.25,.45),R=Y(s(),a.range(.7,1.1)*1.7),D=i+a.range(-.25,.25),V=f+a.range(-.1,.1),z=a.range(.7,1.2),E=a.range(.5,.75),B=v+a.range(-.3,.3);if(h)if(S+w<=1.05+1.1)d(4.08+(D-i)*.3,S,V,Math.min(z,.95),w,E,1.5708+(B-v),R);else continue;else d(D,S,V,z,w,E,B,R);S+=w}},e=(i,f,v)=>{const h=a.int(3,6);for(let b=0;b<h;b++){const c=a.range(.5,.9),x=b>2?1:0,S=Y(p.crate,a.range(.75,1.2)),y=a.range(-.5,.5)*(1-x),w=a.range(-.3,.3);if(v&&x)continue;const R=v?4.12+y*.2:i+y,D=1.05+c/2+x*.7,V=f+(b%3-1)*.85*(1-x*.6);t.mat(S,n.WOOD).box(R,D,V,c*1.1,c,c,w),t.mat(Y(S,1.45),n.MATTE).box(R,D+c*.36,V,c*1.1+.03,.06,c+.03,w,{top:!1}).box(R,D-c*.36,V,c*1.1+.03,.06,c+.03,w,{top:!1})}},r=(i,f)=>{const v=a.int(4,8);for(let h=0;h<v;h++)t.mat(Y(p.tin,a.range(1.1,1.6)),n.BRASS).lathe(i+h%2*.48+a.range(-.05,.05),1.05,f+Math.floor(h/2)*.5,[[.2,0],[.2,.55],[.12,.7],[.15,.78],[.15,.82]],6)},l=(i,f)=>{t.mat(Y(p.crate,1.15),n.WOOD).box(i,1.05+.45,f,.9,.9,1.6),t.mat(p.cream,n.MATTE).box(i,1.05+.915,f,1,.04,1.7),t.mat(p.maroon,n.MATTE).box(i,1.05+.08,f,.93,.16,1.63,0,{top:!1}),t.mat(p.brass,n.BRASS).lathe(i,1.05+.9,f+.3,[[.16,0],[.24,.1],[.25,.5],[.12,.62],[.05,.78]],8),t.lathe(i,1.05+.9,f-.35,[[.12,0],[.17,.08],[.17,.34],[.06,.45]],8);for(const[v,h]of[[-.5,-.9],[.5,-.9],[.5,.9],[-.5,.9]])t.mat(p.wood,n.WOOD).strut([i+v,1.05,f+h],[i+v,1.05+2.3+(v>0?.25:0),f+h],.06);t.mat(Q(p.cream,p.blue,a.chance(.4)?.6:0),n.MATTE).quad([i-.75,1.05+2.25,f+1.1],[i+.75,1.05+2.6,f+1.1],[i+.75,1.05+2.6,f-1.1],[i-.75,1.05+2.25,f-1.1],0,0,2,2),T.glows.add(i,1.05+1.25,f+.3,{aColA:[1.3,.6,.2],aColB:[1.3,.6,.2],aSw:[2,a(),.22,0]}),T.steam.add(i,1.05+1.7,f+.3,{aP:[a(),.3,.12,.7],aVel:[.05,.7,0,0]})},u=(i,f)=>{t.mat(p.maroon,n.WOOD).box(i,1.05+.42,f,.45,.07,2).box(i-.2,1.05+.75,f,.06,.5,2);for(const v of[-.9,.9])t.mat(p.iron,n.IRON).box(i,1.05+.2,f+v,.42,.4,.06)};P.platformEnds=[];for(let i=0;i<4;i++){const f=ft[i];for(const[v,h]of[[f-8.2,i===2?tt-1.8:f-3.9],[f-.4,f+4.7]]){const b=h-v,c=(v+h)/2;t.mat(Y(p.pave,a.range(.9,1.08)),n.PAVE),t.quad([v,1.05,34],[c,1.05,34],[c,1.05,-134],[v,1.05,-134],0,34,b/2,-134),t.quad([c,1.05,34],[h,1.05,34],[h,1.05,-134],[c,1.05,-134],b/2,34,0,-134),t.quad([v,.05,46],[h,.05,46],[h,1.05,34],[v,1.05,34],1,46,1+b,34),t.mat(p.brick,n.BRICK),t.quad([v,0,-134],[v,0,34],[v,1.05,34],[v,1.05,-134],-134,0,34,1.05),t.quad([h,0,34],[h,0,-134],[h,1.05,-134],[h,1.05,34],34,0,-134,1.05),t.tri([v,0,34],[v,0,46],[v,1.05,34],[34,0],[46,0],[34,1.05]),t.tri([h,0,46],[h,0,34],[h,1.05,34],[46,0],[34,0],[34,1.05]),P.platformEnds.push(new q.Vector3(c,1.05,30));const x=Math.abs(c-2.15)<.1,S=()=>x?a.range(3,4.1):c+a.range(-.9,.9);if(x){let y=0;for(let w=-10;w>-128;w-=18,y++){const R=w<-95;o(a.range(3.1,3.6),w,a.range(-.35,.35)+(y%2?1.5708:0),R),r(a.range(2.5,2.8),w-2.6),y%2===0?l(4,w+3.3):(e(a.range(3.5,4),w+3.2,R),u(4.3,w-9))}o(3.3,14,.3),e(3.7,4)}else for(let y=24-a.range(0,8);y>-128;y-=a.range(11,19)){const w=a();w<.34?o(S(),y,a.range(-.5,.5)+(a.chance(.5)?1.5708:0)):w<.56?e(S(),y):w<.74?r(S()-.3,y):w<.86&&y<-6?l(x?3.9:c,y):u(x?4.2:c,y)}x||(t.mat(p.maroon,n.IRON).lathe(c,1.05,22,[[.18,0],[.18,.4],[.08,.7],[.06,3.4],[.12,3.5]],6),t.mat([1,.75,.4],n.GLOW).lathe(c,1.05+3.5,22,[[.12,0],[.22,.45]],4,{flat:!0,phase:.785}),t.mat(p.iron,n.IRON).lathe(c,1.05+3.95,22,[[.28,0],[.04,.24],[.02,.5]],4,{flat:!0,phase:.785}),T.glows.add(c,1.05+3.72,22,{aColA:[1.5,.95,.45],aColB:[1.5,.95,.45],aSw:[2,a(),.5,0]}))}}t.mat(p.pave,n.PAVE);for(const[i,f]of[[-62.05,tt-1.8],[-.4,37.05]])t.quad([i,1.05,-134],[f,1.05,-134],[f,1.05,k-6],[i,1.05,k-6],2,-134,2+f-i,k-6),t.mat(p.brick,n.BRICK).quad([i,0,-134+.02],[f,0,-134+.02],[f,1.05,-134+.02],[i,1.05,-134+.02],i,0,f,1.05),t.mat(p.pave,n.PAVE);t.mat(p.brick,n.BRICK).quad([tt-1.8,0,k-6],[tt-1.8,0,-134],[tt-1.8,1.05,-134],[tt-1.8,1.05,k-6],0,0,12,1.05),t.quad([-.4,0,-134],[-.4,0,k-6],[-.4,1.05,k-6],[-.4,1.05,-134],0,0,12,1.05),P.standingEngines=[],m.tracks.forEach((i,f)=>{if(f===pt||i.siding)return;const v=i.x,h=i.end+.6;t.mat([.5,.07,.05],n.WOOD).box(v,1.05,h,2.5,.4,.45);for(const b of[-.84,.84])t.mat(p.iron,n.IRON).strut([v+b,.15,h+2.2],[v+b,1.1,h],.14).strut([v+b,.15,h+.1],[v+b,1.2,h+.1],.14);T.glows.add(v,1.55,h+.3,{aColA:[1.6,.1,.04],aColB:[1.6,.1,.04],aSw:[2,a(),.26,0]}),Math.abs(v)>5&&P.standingEngines.push({position:new q.Vector3(v,0,h+4),heading:new q.Vector3(0,0,-1)})})}function ue(t,m,a,p){const N=At,k=St,s=.7854,d=(g=1)=>Y(a.stone,g*m.range(.94,1.06)),o=4.17,e=Math.round((37.5- -62.5)/o);t.mat(d(),n.ARCADE),t.quad([-62.5,1.05,-146],[37.5,1.05,-146],[37.5,24,-146],[-62.5,24,-146],0,0,e,3),t.quad([37.5,0,-186],[-62.5,0,-186],[-62.5,24,-186],[37.5,24,-186],0,0,e,3),t.quad([37.5,0,-146],[37.5,0,-186],[37.5,24,-186],[37.5,24,-146],0,0,10,3),t.quad([-62.5,0,-186],[-62.5,0,-146],[-62.5,24,-146],[-62.5,24,-186],0,0,10,3),t.mat(a.stoneLight,n.STONE).box(-12.5,24+.3,-332/2,37.5- -62.5+1.2,.6,40+1.2);for(const g of[-146+.3,-186-.3])t.mat(a.stoneLight,n.VALANCE).quad([-62.5,24+1.9,g],[37.5,24+1.9,g],[37.5,24+.6,g],[-62.5,24+.6,g],0,1,110,0);const r=24+.6,l=24+6.2,u=-332/2;t.mat(a.slate,n.SLATE),t.quad([-62.5+1,r,-147],[37.5-1,r,-147],[37.5-1,l,u],[-62.5+1,l,u],0,0,98,20),t.quad([37.5-1,r,-185],[-62.5+1,r,-185],[-62.5+1,l,u],[37.5-1,l,u],0,0,98,20),t.mat(a.maroon,n.VALANCE).quad([-62.5+1,l+.7,u],[37.5-1,l+.7,u],[37.5-1,l,u],[-62.5+1,l,u],0,1,140,0);for(let g=0;g<=12;g++){const M=-62.5+100*g/12;if(!(Math.abs(M-N)<15&&Math.abs(M-N)>13))for(const[F,_]of[[-146,1],[-186,-1]])_>0&&Math.abs(M)<9||(t.mat(d(.96),n.STONE).box(M,24/2+.6,F+_*.5,1.3,24+1.2,1,0,{v0:0}),t.lathe(M,24+1.2,F+_*.4,[[.85,0],[.85,1.2],[.5,1.5],[.5,2.6],[.7,2.75],[.04,5]],4,{flat:!0,phase:s}))}const i=(g,M,F,_,H,X)=>{t.mat(d(1.03),n.ARCADE);const O=Math.max(2,Math.round(M*2/4.6));t.quad([g-M,1.05,H],[g+M,1.05,H],[g+M,F,H],[g-M,F,H],0,0,O,3),t.quad([g+M,0,X],[g-M,0,X],[g-M,F,X],[g+M,F,X],0,0,O,3),t.quad([g+M,0,H],[g+M,0,X],[g+M,F,X],[g+M,F,H],0,0,9,3),t.quad([g-M,0,X],[g-M,0,H],[g-M,F,H],[g-M,F,X],0,0,9,3),t.mat(d(1),n.ARCADE),t.tri([g-M,F,H],[g+M,F,H],[g,_,H],[0,.25],[1,.25],[.5,.95]),t.tri([g+M,F,X],[g-M,F,X],[g,_,X],[0,.25],[1,.25],[.5,.95]),t.mat(a.slate,n.SLATE),t.quad([g+M+.4,F-.2,H+.5],[g+M+.4,F-.2,X-.5],[g,_+.25,X-.5],[g,_+.25,H+.5],0,0,40,12),t.quad([g-M-.4,F-.2,X-.5],[g-M-.4,F-.2,H+.5],[g,_+.25,H+.5],[g,_+.25,X-.5],0,0,40,12);for(const W of[H,X])t.mat(a.stoneLight,n.STONE).lathe(g,_,W,[[.5,0],[.5,.6],[.25,.9],[.4,1.5],[.03,3.2]],4,{flat:!0,phase:s})};i(N,14,30,37,-146-.5,-186-3.5),i(-62.5+6.5,6.5,26,31.5,-146-.5,-186-2.5),i(37.5-6.5,6.5,26,31.5,-146-.5,-186-2.5);const f=(g,M,F,_,H=0)=>{t.mat(d(1.02),n.STONE).lathe(g,0,M,[[F*1.15,H],[F*1.15,H+1.2],[F,H+1.6],[F,_-6],[F*1.12,_-5.7],[F*1.12,_-5.3]],8,{flat:!0,phase:.39}),t.mat(d(1),n.ARCADE).lathe(g,0,M,[[F*.94,_-5.3],[F*.94,_-1.6]],8,{flat:!0,phase:.39,us:1/(F*.94*.785),vmap:[_-5.3,_-1.6]}),t.mat(a.stoneLight,n.STONE).lathe(g,0,M,[[F*1.14,_-1.6],[F*1.2,_-1.3],[F*1.14,_-1]],8,{flat:!0,phase:.39});const X=[];for(let O=0;O<=6;O++){const W=O/6;X.push([F*1.02*Math.max(0,Math.cos(W*1.5708))**.75+.03,_-1+F*1.7*Math.sin(W*1.5708)])}t.mat(a.domeStone,n.STONE).lathe(g,0,M,X,8,{vs:.7}),t.mat(a.gilt,n.BRASS).lathe(g,_-1+F*1.7,M,[[.1,0],[.3,.3],[.1,.6],[.2,.9],[.02,2.4]],6),p.turrets.push(new q.Vector3(g,_+F*1.7+1.4,M))},v=m.range(36,39.5);for(const g of[-62.5,37.5])for(const M of[-146+.5,-186-.5])f(g,M,2.3,v);for(const g of[-1,1])for(const M of[-146-1.5,-186-3.5])f(N+g*14,M,2.3,(v+m.range(2,4.5))*1.16,M>-160?23:0);const h=m.pick([8,12,16]),b=Vt,c=42.5,x=m.range(12.5,14.5),S=Bt,y=1.42,w=b*S,R=g=>28+(g-28)*y,D=g=>g.map(([M,F])=>[M*S,R(F)]);t.mat(d(.98),n.STONE).lathe(N,0,k,D([[b+1.4,28],[b+1.4,30.5],[b+.4,31.5]]),8,{flat:!0,phase:.39}),t.mat(d(1.04),n.ARCADE).lathe(N,0,k,D([[b,31.5],[b,41]]),8,{flat:!0,phase:.39,us:1/(w*.785/2),vmap:[R(31.5),R(41)]}),t.mat(a.stoneLight,n.STONE).lathe(N,0,k,D([[b+.2,41],[b+.9,41.5],[b+.9,42.1],[b-.4,c]]),8,{flat:!0,phase:.39});for(let g=0;g<8;g++){const M=.39+g*s,F=N+Math.cos(M)*(w+.6),_=k+Math.sin(M)*(w+.6);t.mat(d(1),n.STONE).lathe(F,R(30.5),_,[[.95,0],[.95,10.5],[1.15,10.8],[1.15,11.6],[.7,12],[.7,13.4],[.9,13.6],[.04,16.2]].map(([H,X])=>[H*S,X*y]),6,{flat:!0})}const V=[],z=12;for(let g=0;g<=z;g++){const M=g/z*1.5708;V.push([((b-.55)*Math.max(0,Math.cos(M))**.72+1.1*(g/z))*S,R(c+x*Math.sin(M)**.92)])}t.mat(a.domeStone,n.DOME).lathe(N,0,k,V,32,{vs:.6});for(let g=0;g<h;g++){const M=.39+g*6.2832/h,F=Math.cos(M),_=Math.sin(M);for(let H=0;H<z;H++){const X=V[H],O=V[H+1];t.mat(a.stoneLight,n.DOME).strut([N+F*(X[0]+.16),X[1],k+_*(X[0]+.16)],[N+F*(O[0]+.16),O[1],k+_*(O[0]+.16)],.74,.56)}}const E=c+x;t.mat(d(1.05),n.ARCADE).lathe(N,0,k,D([[1.25,E-.3],[1.25,E+2.6]]),8,{flat:!0,us:1/(1.25*S*.785),vmap:[R(E-.3),R(E+2.6)]}),t.mat(a.stoneLight,n.STONE).lathe(N,0,k,D([[1.5,E+2.6],[1.5,E+2.9],[1.1,E+3.4],[.5,E+4.3],[.3,E+4.6]]),8);const B=60,G=R(B);t.mat(a.gilt,n.BRASS).lathe(N,0,k,D([[.3,E+4.6],[.55,E+5],[.3,E+5.4],[.42,E+5.9],[.12,E+6.6],[.2,B-1.1],[.04,B]]),8),p.dome=new q.Vector3(N,R(c+x*.5),k),p.finial=new q.Vector3(N,G,k);const $=12,L=7.7,Z=6,K=L*2;for(let g=-1;g<=1;g+=2){let M=null;for(let F=0;F<=$;F++){const _=F/$*1.0472,H=g*(L-K*(1-Math.cos(_))),X=Z+K*Math.sin(_),O=g*(L+1.5-(K+1.5)*(1-Math.cos(_))*1),W=Z+(K+1.5)*Math.sin(_);if(M){const U=F%2?a.voussoir:a.stoneLight,j=[M[0],M[1],-146+.9],J=[M[2],M[3],-146+.9],et=[O,W,-146+.9],ot=[H,X,-146+.9];g>0?t.mat(U,n.STONE).quad(j,J,et,ot,0,0,1.5,1.4):t.mat(U,n.STONE).quad(J,j,ot,et,0,0,1.5,1.4);const rt=[M[0],M[1],-146+.06],at=[H,X,-146+.06];g>0?t.mat(d(.8),n.STONE).quad(rt,j,ot,at,0,0,2.1,1.4):t.mat(d(.8),n.STONE).quad(j,rt,at,ot,0,0,2.1,1.4)}M=[H,X,O,W]}t.mat(d(1),n.STONE).box(g*(L+.8),3.5,-146+.3,1.6,4.9,2.6,0,{v0:1.05}),t.mat(a.voussoir,n.STONE).lathe(g*(L+.1),1.05,-146+1.2,[[.4,0],[.28,.3],[.28,4.3],[.5,4.8],[.5,4.95]],8)}t.mat([.012,.012,.016],n.MATTE).quad([-L,0,-146+.06],[L,0,-146+.06],[L,Z,-146+.06],[-L,Z,-146+.06]);for(let g=0;g<$;g++){const M=g/$*1.0472,F=(g+1)/$*1.0472,_=L-K*(1-Math.cos(M)),H=Z+K*Math.sin(M),X=Math.max(0,L-K*(1-Math.cos(F))),O=Z+K*Math.sin(F);t.quad([-_,H,-146+.06],[_,H,-146+.06],[X,O,-146+.06],[-X,O,-146+.06])}}async function me(t,m={}){const a=t.rng,p=(Array.isArray(m.palette)&&m.palette.length>=7?m.palette:zt).map(Ct),[T,P,C,I,A,N,k]=p,s=m.throat??300,d=async()=>{t.yield&&await t.yield()},o=a.range(.1,.4),e=a.pick(["maroon","maroon","indigo","green"]),r=e==="maroon"?Y(C,1.25):e==="indigo"?Y(Q(T,A,.25),1.5):[.03,.085,.055],l={iron:[.035,.036,.04],ironPaint:Q(r,[.05,.05,.05],.35),maroon:r,cream:Y(I,.8),creamPaint:Y(I,.72),buff:k,blue:A,stone:Y(Q(k,I,o),.88),stoneLight:Y(Q(k,I,.75),.86),stoneDark:Q(Y(k,.45),[.12,.12,.12],.4),voussoir:Y(Q(C,k,.3),1.7),domeStone:Y(Q(k,I,.3),.95),gilt:Y(N,.8),brass:Y(N,.6),slate:Y(Q(T,P,.5),.75),tin:Q(P,[.24,.24,.24],.5),oxide:[.3,.09,.05],glass:[.1,.12,.14],wood:[.2,.14,.09],sleeper:[.1,.08,.06],crate:[.3,.22,.13],pave:[.36,.34,.3],brick:Y(Q(C,k,.45),1.25),leather:[.06,.04,.03],sack:[.4,.33,.2]},u=O=>new q.Vector3(O[0],O[1],O[2]),i=(m.sunDir?u(m.sunDir):new q.Vector3(.836,.259,-.483)).normalize(),f=[200+a.range(-6,6),120+a.range(-6,6),50+a.range(0,5)],v={uSunDir:{value:i},uSunCol:{value:u(Y(Q(N,[1,1,1],.1),2.1))},uSkyCol:{value:u(Y(Q(A,[1,1,1],.4),.9))},uHorizCol:{value:u(Y(Q(I,[1,.84,.3],.65),.86))},uStormCol:{value:u(Y(T,1.7))},uAmbCol:{value:u(Y(Q(P,[.5,.62,.85],.5),.56))},uGroundCol:{value:new q.Vector3(.075,.065,.055)},uFillCol:{value:new q.Vector3(.05,.09,.2)},uStormDir:{value:new q.Vector3(-.8,0,.6).normalize()},uSun:{value:1},uWet:{value:1},uFresh:{value:.8},uTime:{value:0},uProg:{value:.56},uLamp:{value:0},uEdge:{value:new q.Vector4(-.6,.8,1e3,14)},uCamL:{value:new q.Vector3(0,30,400)},uGz:{value:new q.Vector3(f[0],f[1],f[2])},uGndK:{value:new q.Vector4(1,1,0,1)},uPaintLo:{value:new q.Vector2(.05,.055)},uRain:{value:0},uPud:{value:[0,1,2,3,4,5].map(()=>new q.Vector4(0,0,0,0))}},h=(O,W,U={})=>new q.ShaderMaterial({uniforms:{...q.UniformsUtils.clone(q.UniformsLib.fog),...v},vertexShader:O,fragmentShader:W,fog:!0,...U}),b=h(Lt,yt,{side:q.DoubleSide}),c=h(Lt,yt,{side:q.DoubleSide,defines:{ARMS:1}}),x=new q.Group;x.name="cloudburst-local-hero";const S={shedMouths:[],pigeons:[],turrets:[]},y={arms:[],maxArms:30,glows:xt({aColA:3,aColB:3,aSw:4}),steam:xt({aP:4,aVel:4}),drips:xt({aP:4})},w=(O,W,U,j=0)=>{const J=new q.Mesh(O,W);return J.name=U,J.renderOrder=j,J.frustumCulled=j<3,x.add(J),J},R=Jt(a.fork("tracks"),s);await d(),m.ground!==!1&&w(te(R,s),h(Nt,qt),"ground"),await d(),w(Qt(R,a),h(Et,Ft,{transparent:!0,depthWrite:!1,side:q.DoubleSide}),"tracks",1),await d();const D=lt(),V=lt(),z=a.fork("gantries");S.gantries=[];const E=Math.min(m.straightFrom??s,s);for(let O=0;O<f.length;O++){const W=f[O],U=t.core.makeRng(t.core.hashSeed("gantry-dolls-"+O+":"+t.seed));S.gantries.push(se(D,V,W,(740-W)/880,R,z,l,y,U,O===0?ae(W,E):null)),await d()}ie(D,R,s,a.fork("throat"),l,y,S),await d(),w(await D.buildAsync(d),b,"throat");{const O=V.build(),W=V.nv,U=new Float32Array(W*4),j=new Float32Array(W*3);for(const J of y.arms)for(let et=J.v0;et<J.v1;et++)U.set(J.piv,et*4),j.set(J.arm,et*3);O.setAttribute("aPiv",new q.BufferAttribute(U,4)),O.setAttribute("aArm",new q.BufferAttribute(j,3)),w(O,c,"arms")}await d();const B=lt();await le(B,a.fork("shed"),l,y,S,d),w(await B.buildAsync(d),b,"shed");const G=lt();fe(G,R,a.fork("floor"),l,y,S),await d(),w(await G.buildAsync(d),b,"platforms");const $=lt();ue($,a.fork("terminus"),l,S),await d(),w(await $.buildAsync(d),b,"terminus");const L=a.fork("steam");if(m.steam!==!1){S.steamVents=[];for(const W of ft){for(let U=0;U<9;U++)y.steam.add(W+L.range(-8,8),L.range(9,15.5),L.range(-12,1),{aP:[L(),1/L.range(9,14),L.range(2.4,4),L.range(6,10)],aVel:[L.range(-.2,.5),L.range(.7,1.5),L.range(1.1,2.4),0]});for(let U=0;U<10;U++)y.steam.add(W+L.range(-7,7),L.range(10,15),L.range(-128,-18),{aP:[L(),1/L.range(12,18),L.range(2.5,4),L.range(5,8)],aVel:[L.range(-.15,.15),L.range(.2,.45),L.range(.3,.9),0]});for(let U=0;U<6;U++)y.steam.add(W+L.range(2,10),L.range(16,20),L.range(-130,-6),{aP:[L(),1/L.range(6,9),1.2,L.range(3.5,5.5)],aVel:[L.range(-.3,.1),L.range(.7,1.1),.2,1]});S.steamVents.push(new q.Vector3(W,20,-4))}for(let W=0;W<56;W++){const U=L.range(-68,44),j=L.range(8,s-10);Math.abs(U)<6||y.steam.add(U,.4,j,{aP:[L(),1/L.range(5,9),1.2,L.range(3,5)],aVel:[L.range(-.25,.25),L.range(.4,.75),L.range(-.25,.25),1]})}const O=w(y.steam.build(),h(Yt,Gt,{transparent:!0,depthWrite:!1}),"steam",3);O.userData.puffs=y.steam.count}if(m.shafts!==!1){const O=[],W=[],U=[];let j=0;const J=i,et=new q.Vector3(J.z,0,-J.x).normalize();for(let rt=1;rt<wt.NB;rt+=2){const at=-wt.BAY*(rt+.5),ut=34.5,ct=14.2,mt=Math.min(ct/Math.max(J.y,.05)+4,(-1.5-at)/Math.max(-J.z,.05),(ut+61)/Math.max(J.x,.05));if(mt<16)continue;const Rt=ut-J.x*mt,Tt=ct-J.y*mt,Mt=at-J.z*mt;for(const[ht,vt,dt]of[[0,3.4,0],[et.x*2.7,0,et.z*2.7]])O.push(ut-ht,ct-vt,at-dt,Rt-ht,Tt-vt,Mt-dt,Rt+ht,Tt+vt,Mt+dt,ut+ht,ct+vt,at+dt),W.push(0,-1,1,-1,1,1,0,1),U.push(j,j+1,j+2,j,j+2,j+3),j+=4}const ot=new q.BufferGeometry;ot.setAttribute("position",new q.Float32BufferAttribute(O,3)),ot.setAttribute("uv",new q.Float32BufferAttribute(W,2)),ot.setIndex(U),w(ot,h(Wt,Ht,{transparent:!0,depthWrite:!1,blending:q.AdditiveBlending,side:q.DoubleSide}),"shafts",4)}m.drips!==!1&&w(y.drips.build(),h(Xt,Ut,{transparent:!0,depthWrite:!1}),"drips",5),m.lamps!==!1&&w(y.glows.build(),h(Dt,Pt,{transparent:!0,depthWrite:!1,blending:q.AdditiveBlending}),"glows",6);const Z=(O,W,U)=>new q.Vector3(O,W,U);Object.assign(S,{portalSeat:{position:Z(0,2.9,-140),facing:Z(0,0,1),width:14,height:19},flyThrough:[Z(s>260?(s-260)**2/1340:0,2.9,s),Z(0,2.9,260),Z(0,2.9,200),Z(0,2.9,120),Z(0,2.9,50),Z(0,2.9,0),Z(0,2.9,-70),Z(0,2.9,-140)],ourTrack:R.tracks[pt].pts,rivalTrack:R.tracks[bt].pts,departRoad:R.tracks[13].pts,tracks:R.tracks,trackXAt:R.xAt,viewpoints:{clearing:{position:Z(1.2,2.9,s),target:Z(-12,40,-166)},throat:{position:Z(0,2.9,160),target:Z(-8,22,-100)},shed:{position:Z(0,2.9,-20),target:Z(0,4,-140)},flank:{position:Z(150,30,60),target:Z(-12,18,-70)}},sunDir:i.clone()});const K=v;let g=!!m.autoSun;const M=O=>{O=_t(O,0,1),K.uProg.value=O,K.uEdge.value.z=it(-270,430,st(.4,.535,O)),K.uFresh.value=st(.44,.52,O)*(1-.72*st(.56,.8,O)),g&&(K.uSun.value=st(.4,.52,O))};M(.56);const F=(O,W,U=1)=>{if(W===void 0)return;const j=W.isColor?W:new q.Color(W);O.value.set(j.r*U,j.g*U,j.b*U)},_=(O={})=>{O.sunDir&&K.uSunDir.value.copy(O.sunDir.isVector3?O.sunDir:u(O.sunDir)).normalize(),O.stormDir&&K.uStormDir.value.copy(O.stormDir.isVector3?O.stormDir:u(O.stormDir)).setY(0).normalize(),F(K.uSunCol,O.sunColor,O.sunIntensity??2.05),F(K.uSkyCol,O.sky),F(K.uHorizCol,O.horizon),F(K.uStormCol,O.storm),F(K.uAmbCol,O.ambient),F(K.uGroundCol,O.ground),F(K.uFillCol,O.fill),O.sun!==void 0&&(K.uSun.value=O.sun),O.wet!==void 0&&(K.uWet.value=O.wet)},H=new q.Vector3,X=new q.Matrix4;return{object:x,radius:78,height:26,center:new q.Vector3(-8,8,25),anchors:S,extent:{min:new q.Vector3(-75,0,-190),max:new q.Vector3(50,74,s+4)},uniforms:v,setProgress:M,setLight:_,mk:h,colors:l,setSun(O){g=!1,K.uSun.value=O},update(O,W,U){K.uTime.value=W,U&&(x.updateWorldMatrix(!0,!1),X.copy(x.matrixWorld).invert(),K.uCamL.value.copy(H.setFromMatrixPosition(U.matrixWorld).applyMatrix4(X)))},dispose(){},ground:!0,groundY:-.06}}export{gt as FOG_FADE,Pt as GLOW_FRAG,Dt as GLOW_VERT,nt as GLSL_COMMON,Ot as GLSL_MIRROR,qt as GROUND_FRAG,Nt as GROUND_VERT,n as K,tt as OUR_X,yt as SURF_FRAG,Ft as TRACK_FRAG,Et as TRACK_VERT,me as buildHero,Ct as lin,lt as makeG,xt as makeSprites,Q as mixc,Y as mulc};
