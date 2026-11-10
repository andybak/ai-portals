import*as M from"three";import{makePath as He,makeRng as j0}from"../kit/core.js";import{makeSky as Ge}from"../kit/sky.js";import*as B0 from"../kit/fauna.js";import{makeParticles as Ue}from"../kit/fx.js";import{buildHero as je}from"../parts/moon-in-dry-dock.js";const b0=Math.PI*2,Ve=w=>Math.min(1,Math.max(0,w)),F0=(w,st,nt)=>{const zt=Ve((nt-w)/(st-w));return zt*zt*(3-2*zt)},l0=3.5,Qt=20,ae=352,we=485,t0=136,n0=-140,c0=154,V0=1.2,lt=17,P0=-230,Zt=175,$e=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 color; attribute vec4 aM; attribute vec3 aW;
varying vec3 vCol, vN, vP, vW; varying vec4 vM;
void main(){
  vCol = color; vN = normal; vP = position; vM = aM; vW = aW;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Me=`
uniform sampler2D uRoofTex;      // street x 340..500 -> r: south row roof height / 32, g: north row
uniform vec4 uCres[8];           // spare crescents: centre x, z, half length, half width
uniform vec4 uHang;              // the swinging crescent's shadow: centre x, z, cos, sin of its yaw (w > 5 = none)
uniform float uHangOn;
float archOpen(float x, float h){
  float xl = (fract((x - ${ae.toFixed(1)}) / ${l0.toFixed(1)}) - .5) * ${l0.toFixed(1)};
  float top = 3.2 + sqrt(max(1.96 - xl * xl, 0.));
  return step(abs(xl), 1.4) * step(h, top);
}
float townSun(vec3 p){
  if (p.x < 346. || p.x > 492. || abs(p.z - ${Qt.toFixed(1)}) > 10.6 || p.y > 24.) return 1.;
  float sz = abs(uSunDir.z) > 2e-3 ? uSunDir.z : 2e-3;
  float zNear = sz < 0. ? 26.5 : 13.5, zFar = sz < 0. ? 13.5 : 26.5;
  float lit = 1.;
  float side = sz < 0. ? p.z - 26.52 : 13.48 - p.z;
  if (side > 0.) { float t = (zNear - p.z) / sz; lit = archOpen(p.x + uSunDir.x * t, p.y + uSunDir.y * t); }
  float inFar = sz < 0. ? 13.48 - p.z : p.z - 26.52;
  if (inFar > 0.) return 0.;
  float t2 = (zFar - p.z) / sz;
  float h = p.y + uSunDir.y * t2, x = p.x + uSunDir.x * t2;
  vec4 rt = texture2D(uRoofTex, vec2(clamp((x - 340.) / 160., 0., 1.), .5));
  float rh = (sz < 0. ? rt.r : rt.g) * 32.;
  return lit * (1. - smoothstep(-.5, .5, rh - h));
}
float chanSun(vec3 p){
  float sx = abs(uSunDir.x) > 1e-3 ? uSunDir.x : 1e-3;
  float t = (${lt.toFixed(1)} * sign(sx) - p.x) / sx;
  float h = p.y + uSunDir.y * t, z = p.z + uSunDir.z * t;
  float top = (z > 159. && z < 175.) ? 4. : .4;
  float open = min(step(175.5, z) + step(z, 153.), 1.);
  return max(smoothstep(-.7, .7, h - top), open);
}
float basinSun(vec3 p){
  if (abs(p.x) < ${(lt-.1).toFixed(1)} && p.z > 154.5 && p.z < 176. && p.y < 4.2) return chanSun(p);
  if (p.y > -.4 || abs(p.x) > 141.2 || p.z < -145.2 || p.z > 176.) return 1.;
  float t = -p.y / max(uSunDir.y, .03);
  vec2 q = p.xz + uSunDir.xz * t;
  float d = min(140.8 - abs(q.x), min(q.y + 144.8, 158.8 - q.y));
  float gate = step(abs(q.x), ${lt.toFixed(1)}) * step(150., q.y);
  return max(smoothstep(-1.2, 1.2, d), gate);
}
float quaySun(vec3 p){
  float s = 1.;
  if (p.y > 3. || p.x < 120. || p.x > 360.) return s;
  vec2 off = uSunDir.xz * (7. - p.y) / max(uSunDir.y, .08);
  for (int i = 0; i < 8; i++) {
    vec4 c = uCres[i];
    vec2 q = (p.xz + off - c.xy) / max(abs(c.zw), vec2(1.));
    q.y -= .35 * sign(c.w) * (1. - q.x * q.x);
    s *= 1. - .82 * (1. - smoothstep(.55, 1.1, dot(q, q)));
  }
  return s;
}
float hangSun(vec3 p){
  vec2 off = uSunDir.xz * (52. - p.y) / max(uSunDir.y, .08);
  vec2 d = p.xz + off - uHang.xy;
  vec2 q = vec2(d.x * uHang.z + d.y * uHang.w, -d.x * uHang.w + d.y * uHang.z) / vec2(75., 15.);
  q.y -= .5 * (1. - q.x * q.x);
  return 1. - .8 * uHangOn * (1. - smoothstep(.6, 1.1, dot(q, q)));
}
`,Xe=w=>`
#include <common>
#include <fog_pars_fragment>
uniform float uTime, uWet, uNight;
uniform vec3 uShutA, uShutB, uPud, uChalkC, uLamp, uHorC, uZenC, uWallC;
varying vec3 vCol, vN, vP, vW; varying vec4 vM;
${w.noise}
${w.light}
${Me}
#define PLANT_ONE .09
#define PLANT_W 2.
#define PLANT_ROWS 4
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 p = vP; vec3 pL = p + vec3(0., 30., 0.);
  vec3 toCam = cameraPosition - p; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
  float k = vM.x, sd = vM.y;
  vec3 alb = vCol; vec3 emis = vec3(0.); float gloss = 0.; float sun = 1.; float spark = 1.; float rakeW = 0.; float stPud = 0.;
  float fine = 1. - smoothstep(30., 110., dist);          // fine pattern fades to its mean with distance
  if (k < .5) {
    // ---- plaster wall with windows, shutters, sills and string courses
    float W = max(vW.x, 1.), H = vW.y, u = vM.z, v = vM.w;
    float nW = max(1., floor(W / 3.1)), cw = W / nW;
    float ci = floor(u / cw), cu = (fract(u / cw) - .5) * cw;
    float fl = floor(v / 3.5), cv = v - fl * 3.5 - 1.8;
    float fits = step((fl + 1.) * 3.5, H + .6) * step(0., v);
    float wh = hash13(vec3(ci, fl, floor(fract(sd) * 97.)));
    alb *= .84 + .24 * fbm3(vec3(u * .33, v * .33, fract(sd) * 50.));
    alb *= 1. - .2 * smoothstep(.45, .85, vnoise(vec3(u * 1.7, v * .13, fract(sd) * 31.))) * fine;
    float sc = 1. - smoothstep(.08, .12, abs(v - fl * 3.5 - .1));
    alb = mix(alb, vCol * 1.12 + .03, sc * .55 * step(.5, fl) * step(0., v));
    alb *= mix(.7, 1., smoothstep(-.3, 1.4, v + 3. * step(.5, fl)));
    vec3 wallA = alb;
    if (fits > .5 && (wh > .07 || sd > 1.5) && dist < 700.) {
      float ax = abs(cu), ay = abs(cv);
      float open = sd > 1.5 ? 2. : step(.28, wh);
      float inWin = step(ax, .55) * step(ay, .9);
      float shut = step(.55, ax) * step(ax, 1.08) * step(ay, .93) * (open > .5 && open < 1.5 ? 1. : 0.) + inWin * (1. - min(open, 1.));
      float sill = step(ax, .8) * step(-1.08, cv) * step(cv, -.92);
      vec3 shc = (fract(sd * 7.3) < .5 ? uShutA : uShutB) * (.75 + .5 * fract(wh * 13.));
      if (shut > .5) {
        alb = shc * mix(.8, .66 + .34 * step(.38, fract(cv * 7.)), fine) * (1. - .5 * step(abs(ax - (open > .5 ? .815 : .01)), .03));
      } else if (inWin > .5) {
        float frame = 1. - step(ax, .47) * step(ay, .82);
        float mull = step(ax, .03) + step(abs(cv - .15), .03);
        if (frame + mull > .5) alb = vec3(.6, .58, .52);
        else {
          alb = vec3(.025, .035, .045); sun = 0.;
          vec3 r = reflect(-V, n);
          emis = mix(uHorC, uZenC, clamp(r.y * 1.5 + .3, 0., 1.)) * (.1 + .25 * smoothstep(-.9, .7, cv - ax));
          emis += vec3(1.4, .8, .32) * uNight * step(.5, fract(wh * 31.)) * (.6 + .4 * vnoise(vec3(u * 3., v * 3., 1.)));
        }
        alb *= .55 + .45 * smoothstep(.9, .55, cv);
      } else if (sill > .5) alb = vec3(.62, .6, .54);
      else alb *= 1. - .3 * step(ax, .8) * step(-1.5, cv) * step(cv, -1.08) * fine;      // the sill's shadow and drip
      float wf = smoothstep(300., 650., dist);
      alb = mix(alb, wallA * .93, wf); emis *= 1. - wf * (1. - uNight); sun = mix(sun, 1., wf);
    }
  } else if (k < 1.5) {
    // ---- pantile roof (u along the eaves, v down the slope)
    float tu = vM.z / .3, tv = vM.w / .44;
    float h = hash13(vec3(floor(tu), floor(tv), floor(fract(sd) * 77.)));
    float barrel = abs(fract(tu) - .5) * 2.;
    float pat = (.6 + .5 * h) * (.5 + .5 * (1. - barrel * barrel)) * (.78 + .22 * smoothstep(0., .25, fract(tv)));
    alb *= mix(.74, pat, fine) * (.8 + .4 * fbm3(vec3(vM.z * .2, vM.w * .2, fract(sd) * 20.)));
    alb = mix(alb, vec3(.3, .31, .22), smoothstep(.6, .85, fbm3(vec3(vM.z * .35, vM.w * .35, fract(sd) * 9.))) * .4);
  } else if (k < 2.5) {
    // ---- coursed stone: dock altars, piers, columns, sea walls
    float flt = step(.7, abs(n.y));
    vec3 tg = flt > .5 ? vec3(1., 0., 0.) : normalize(vec3(n.z, 0., -n.x) + vec3(1e-5, 0., 0.));
    float su = dot(p, tg), sv = flt > .5 ? p.z : p.y;
    // large quiet ashlar: courses of unequal height, blocks of unequal length, fine pale joints, an even tone
    float cy = sv / 1.12 + .17 * sin(sv * 1.83 + 1.3) + .07 * sin(sv * 4.1);
    float crs = floor(cy), ch = hash13(vec3(crs, 5., flt));
    float bl = 2.3 + 1.5 * ch;
    float cx = su / bl + ch * 7.3;
    vec2 f = abs(vec2(fract(cx), fract(cy)) - .5); float h = hash13(vec3(floor(cx), crs, 3. + flt));
    float far2 = 1. - smoothstep(70., 260., dist);
    float jw = .028 + dist * .0011;
    float jd = min((.5 - f.x) * bl, (.5 - f.y) * 1.1);
    float joint = 1. - smoothstep(jw * .5, jw, jd);                       // 1 in the joint
    alb *= (.95 + .08 * h * far2) * (.84 + .3 * fbm3(p * .09));
    alb *= 1. - .1 * (1. - smoothstep(jw, jw * 4., jd)) * far2;             // each block's arris, a little worn
    alb = mix(alb, alb * 1.22 + .025, joint * .55 * far2);                 // lime in the joints
    alb *= mix(1., .78 + .22 * smoothstep(0., 2.2, vM.w), (1. - flt) * step(vM.w, 40.));          // grime at the foot of each riser
    float inB = step(p.y, -.3) * (1. - flt) * step(abs(p.x), 142.5) * step(p.z, 161.5);
    float yk = fract((p.y + 30.) / 6.);
    float nose = inB * smoothstep(.56, .86, yk);                             // the shadow each nosing throws down its riser
    alb *= mix(vec3(1.), vec3(.74, .8, .95), nose) * mix(1., 1.12 - .14 * yk, inB);
    sun *= 1. - nose;
    rakeW = (1. - flt) * step(.5, -n.z) * step(150., p.z) * step(p.z, 176.5) * step(abs(p.x), 142.5);
    alb = mix(alb, alb * vec3(.84, .92, .88), smoothstep(.5, .75, vnoise(vec3(su * .09, sv * .22, 11.))) * .5);
    alb *= 1. - .2 * smoothstep(.5, .8, vnoise(vec3(su * .7, sv * .07, 3.))) * (1. - flt);
    // the tide's mark: the bottom fifth of every wall in the basin stained dark, green-black with weed, ragged along its top
    float tideY = p.y + 24.7 + 2. * (vnoise(vec3(su * .21, 3., 9.)) - .5) + .7 * (vnoise(vec3(su * 1.4, sv * .4, 2.)) - .5);
    float damp = (1. - flt) * (1. - smoothstep(-.9, .5, tideY)) * step(p.y, -16.);
    alb = mix(alb, alb * vec3(.46, .56, .5), damp * .8);
    float weed = smoothstep(.5, .72, vnoise(vec3(su * 1.7, sv * .2, 7.)) * .75 + .25 * vnoise(vec3(su * 6., sv * 1.2, 3.)) + .22 * smoothstep(-3.2, -.4, tideY));      // bladderwrack hanging in strands under the line
    alb = mix(alb, vec3(.05, .085, .05) * (.7 + .6 * vnoise(vec3(su * 3., sv * 3., 1.))), weed * damp * .7);
    alb = mix(alb, alb * vec3(.8, .9, .76), (1. - flt) * smoothstep(1.6, 0., tideY) * smoothstep(-1.2, .2, tideY) * .5 * step(p.y, -16.));   // the paler rime just above it
    // p2 WALL PLANTS: valerian and samphire rooted in the bed joints of the basin's walls above the tide's mark. A rule of the masonry alone: one
    // block in PLANT_ONE of every course carries a clump rooted in the bed joint under it, somewhere along its length; the clump is a low crown over the
    // joint and a ragged hanging mass below it, PLANT_W wide, grey-green, the valerian with rose heads; it stays on its own lift of the wall and throws
    // a small crisp shadow on the stone where the sun reaches. It reads the wall's own coordinates (su, sv, the courses and their blocks) and the
    // tide's mark; nothing of the lens, the distance or the flight.
    if (inB > .5 && tideY > 2.) {
      float pl = 0., shd = 0.; vec3 pc = vec3(0.);
      float sOff = .3 * sign(dot(uSunDir, tg)), lift = floor((sv + 30.) / 6.);
      for (int r = 0; r <= PLANT_ROWS; r++) {
        float cr = crs + float(r), chR = hash13(vec3(cr, 5., 0.)), blR = 2.3 + 1.5 * chR, cxR = su / blR + chR * 7.3;
        float dn = (float(r) - fract(cy)) * 1.12;                                 // metres below the bed joint under that course
        if (floor((sv + dn + 30.) / 6.) != lift) continue;
        for (int q = -1; q <= 1; q++) {
          float id = floor(cxR) + float(q); vec3 hp = hash33(vec3(id, cr, 23.));
          if (hp.x > PLANT_ONE) continue;
          float wd = PLANT_W * (1. + 1.2 * hp.y), len = wd * (.55 + .4 * hp.z);    // its width, how far it hangs
          float dx = su - (id + .25 + .5 * hp.z - chR * 7.3) * blR;                // metres along the wall from its root
          float rag = .62 + .38 * sin(dx * 9. / PLANT_W + hp.z * 40.) * sin(dx * 23. / PLANT_W + hp.y * 30.);      // the strands hang to unequal lengths
          vec2 a1 = vec2(dx, dn), a2 = a1 + vec2(sOff, -.34) * PLANT_W;
          float X1 = a1.x / (.5 * wd) * (1. + .2 * sin(a1.y * 8. / PLANT_W + hp.y * 50.)), Y1 = a1.y > 0. ? a1.y / (len * rag) : -a1.y / (.2 * wd);
          float X2 = a2.x / (.5 * wd), Y2 = a2.y > 0. ? a2.y / (len * rag) : -a2.y / (.2 * wd);
          shd = max(shd, step(X2 * X2 + Y2, 1.));
          if (X1 * X1 + Y1 < 1.) {
            float val = step(fract(hp.y * 7.), .7);                                // seven in ten are valerian, the rest samphire
            vec3 leaf = mix(vec3(.17, .235, .125), vec3(.1, .17, .07), val) * (.7 + .6 * vnoise(vec3(su * 2.7, sv * 2.7, 5.) / PLANT_W)) * mix(1.15, .7, clamp(a1.y / len, 0., 1.));
            vec2 hc = a1 / (.3 * PLANT_W); float hh = hash13(vec3(floor(hc) + hp.yz * 91., id));
            float hr = length(fract(hc) - .5 - (vec2(fract(hh * 7.), fract(hh * 13.)) - .5) * .36);
            float head = val * step(.5, hh) * step(hr, .28) * step(a1.y, len * .45);     // rose heads over the crown and the upper half
            pc = mix(leaf, vec3(.64, .25, .19) * (.85 + .3 * fract(hh * 29.)), head); pl = 1.;
          }
        }
      }
      alb = mix(alb, pc, pl);
      sun *= 1. - .8 * shd * (1. - pl);
    }
    bool sea = abs(p.x) > 141.5 || p.z > 174.5;
    if (sea) {
      float tide = p.y + 23.6 + 1.1 * vnoise(vec3(su * .25, 2., 5.)) + .15 * sin(su * 1.4 + uTime * 1.3);
      alb = mix(alb, vec3(.03, .035, .022) * (.6 + .8 * vnoise(vec3(su * 2., sv * 2. + sin(uTime * .8 + su) * .15, 1.))), smoothstep(.4, -.3, tide));
      alb = mix(alb, alb * 1.25 + .05, smoothstep(1.4, .5, tide) * smoothstep(.2, .6, tide) * .5);
    }
  } else if (k < 3.5) {
    // ---- ground: street cobbles with a runnel, quay slabs and rails, the dock floor
    if (p.y < -20.) {
      vec2 fl = p.xz / vec2(1.6, 3.2); fl.x += .5 * floor(fl.y);
      vec2 ff = abs(fract(fl) - .5);
      alb *= .6 + .34 * vnoise(vec3(p.xz * .1, 1.)) + .32 * hash13(vec3(floor(fl), 6.));
      float jwF = clamp(dist * .0035, .05, .17);                               // joints widen with distance, so the paving still reads from the far end
      alb *= .56 + .44 * smoothstep(.5, .5 - jwF, max(ff.x, ff.y));
      float dWall = min(min(${t0.toFixed(1)} - abs(p.x), p.z - (${n0.toFixed(1)})), ${c0.toFixed(1)} - p.z);
      float dampF = 1. - smoothstep(1.5, 9., dWall + 4. * (vnoise(vec3(p.xz * .22, 3.)) - .5));
      alb = mix(alb, alb * vec3(.5, .6, .52), dampF * .8);                     // the foot of the walls stays dark and damp, a little green
      alb *= 1. - .3 * smoothstep(.55, .8, vnoise(vec3(p.x * .05, p.z * .5, 7.)));
      alb *= .9 + .2 * vnoise(vec3(p.xz * 1.3, 2.)) * fine;
      alb = mix(alb, uChalkC * .52, smoothstep(.5, .78, fbm3(vec3(p.xz * .05, 4.)) + .1 * vnoise(vec3(p.xz * .6, 1.))) * .75);
      float pudN = fbm3(vec3(p.xz * .055, 9.));
      // dry mornings: soft cream drifts of chalk swept against the slabs; after rain: flat puddles that hold the sky
      alb = mix(alb, uChalkC * (.5 + .1 * vnoise(vec3(p.xz * .9, 5.))), smoothstep(.56, .72, pudN + .05 * vnoise(vec3(p.xz * .7, 2.))) * .8 * (1. - uWet));
      gloss = smoothstep(.6, .64, pudN) * uWet; spark = .0;
      float rl = abs(abs(p.x) - 9.); float rw = max(.07, dist * .0016);
      float rail = 1. - smoothstep(rw, rw * 1.7, rl);
      alb = mix(alb, vec3(.16, .15, .15), rail * (1. - gloss));
    } else if (p.x > 346. && abs(p.z - ${Qt.toFixed(1)}) < 6.5) {
      vec2 c = p.xz / vec2(.3, .22); c.x += .5 * floor(c.y);
      vec2 f = abs(fract(c) - .5); float h = hash13(vec3(floor(c), 2.));
      float mort = smoothstep(.5, .34, max(f.x, f.y));
      alb *= mix(.66, (.62 + .36 * h) * (.6 + .4 * mort), max(fine, .1)) * (.74 + .5 * fbm3(vec3(p.xz * .22, 1.)));
      alb = mix(alb, alb * vec3(1.08, .96, .86), smoothstep(.4, .7, vnoise(vec3(p.xz * .7, 3.))));
      float rz = abs(p.z - ${Qt.toFixed(1)} + .35 * sin(p.x * .07));
      float run = (1. - smoothstep(.1, .2, rz)) * smoothstep(.3, .55, vnoise(vec3(p.x * .4, 3., 1.)));
      alb *= 1. - .35 * (1. - smoothstep(.2, .55, rz)); gloss = run * .8;
      float pud = uWet * smoothstep(.5, .55, fbm3(vec3(p.xz * .2, 5.)) - .07 * h + .04 * mort);       // lying in the hollows, edged by the setts
      gloss = max(gloss, pud); stPud = pud;
    } else {
      vec2 c = p.xz / vec2(1.5, .9); c.x += .5 * floor(c.y);
      vec2 f = abs(fract(c) - .5); float h = hash13(vec3(floor(c), 4.));
      float jn = smoothstep(.5, .47, max(f.x * 1., f.y));
      alb *= mix(.72, (.72 + .34 * h) * (.6 + .4 * jn), max(fine, .25)) * (.72 + .5 * fbm3(vec3(p.xz * .06, 3.)));
      alb *= .9 + .2 * vnoise(vec3(p.xz * 2.1, 6.)) * fine;
      float nearCres = smoothstep(350., 300., p.x) * smoothstep(120., 150., p.x);
      alb = mix(alb, uChalkC * .5, smoothstep(.5, .8, fbm3(vec3(p.xz * .07, 8.)) + .08 * vnoise(vec3(p.xz * .8, 3.))) * .7 * nearCres);
      float rw = max(.05, dist * .0015);
      float d1 = abs(p.x - 147.5), d2 = abs(p.z + 151.5);
      float on1 = step(-146., p.z) * step(p.z, 150.), on2 = step(-146., p.x) * step(p.x, 148.);
      float dr = min(d1 + 9. * (1. - on1), d2 + 9. * (1. - on2));
      float along = d1 < d2 ? p.z : p.x;
      alb = mix(alb, vec3(.17, .12, .08), step(dr, .75) * step(fract(along / .9), .3) * .8 * fine);
      alb = mix(alb, vec3(.2, .19, .19), 1. - smoothstep(rw, rw * 1.7, abs(dr - .38)));
      gloss = uWet * smoothstep(.45, .6, fbm3(vec3(p.xz * .12, 5.))); spark = .15;
    }
    sun *= quaySun(p);
  } else if (k < 4.5) {
    // ---- timber (u along the grain, v across)
    float g = vnoise(vec3(vM.z * 1.1, vM.w * 22., fract(sd) * 40.));
    alb *= (.72 + .5 * g) * (.8 + .3 * hash13(vec3(floor(vM.w / .32), floor(fract(sd) * 91.), 3.)));
    alb *= 1. - .55 * smoothstep(.42, .5, abs(fract(vM.w / .32) - .5)) * fine;
  } else if (k < 5.5) {
    alb *= mix(1., .82 + .36 * vnoise(p * 1.6 + fract(sd) * 30.), fine) * (.9 + .2 * vnoise(p * .011 + 3.));
  } else {
    // ---- the wall at the back of an arcade: arched shop doors
    float cu = (fract(vM.z / ${l0.toFixed(1)}) - .5) * ${l0.toFixed(1)}, v = vM.w;
    float wh = hash13(vec3(floor(vM.z / ${l0.toFixed(1)}), floor(fract(sd) * 57.), 2.));
    float inA = step(abs(cu), 1.15) * step(v, 2.5 + sqrt(max(1.3225 - cu * cu, 0.)));
    alb *= .8 + .25 * fbm3(vec3(vM.z * .4, v * .4, 3.));
    if (inA > .5) {
      if (wh < .55) { alb = mix(uShutA, uShutB, step(.3, wh)) * .7 * (.7 + .3 * step(.5, fract(cu * 2.2))) * (1. - .4 * step(abs(cu), .03)); }
      else { alb = vec3(.03, .028, .026); emis = vec3(1.2, .7, .3) * (.012 + uNight * .5) * smoothstep(3.3, .5, v); }
    }
    alb *= mix(.75, 1., smoothstep(0., 1.2, v));
  }
  sun *= townSun(p) * basinSun(p) * hangSun(p) * smoothstep(0., .5, vW.z);
  float nl = max(dot(n, uSunDir), 0.);
  nl = mix(nl, .9, rakeW);                                                 // the gate-end wall takes the sun full on its dressed faces: warm where it is lit, blue where the Moon or the dock side shades it
  float up = n.y * .5 + .5;
  float ao = mix(.5, 1., smoothstep(.5, 1., vW.z));
  if (vW.z < -.5) ao = 1.;                                                 // p2: a cast shadow laid on the ground (light attribute -1): no sun, the whole sky
  float mSh = moonShadow(pL);
  { vec3 oc = pL - uMoonC; float bb = dot(oc, uSunDir), cc = dot(oc, oc) - 14400.; mSh = 1. - smoothstep(0., 240., bb * bb - cc) * step(bb, 0.) * step(0., cc); }      // a crisper edge than the hero's own: the Moon's shadow is drawn on stone here
  vec3 lit = uSunCol * nl * sun * mSh + uSkyCol * (.35 + .65 * up) * ao * (1. + .2 * rakeW) + uGndCol * (1. - up) * ao * 1.4 * (1. - .6 * rakeW) + uGndCol * (1. - ao) * 1.2;
  // in the gateway the sunlit cheek and sill throw light back on the leaves and the far cheek, so their timber and iron read
  float gateK = step(153.5, p.z) * step(p.z, 177.5) * step(abs(p.x), ${(lt+1.2).toFixed(1)}) * step(p.y, 5.6) * step(-26.5, p.y) * step(abs(n.y), .7);
  lit += uSunCol * vec3(1., .84, .58) * (p.x > 0. ? .62 : .24) * mix(.3, 1., mSh) * gateK * (.35 + .65 * abs(n.x));
  // the copings and nosings at the gate end keep a warm edge even in the Moon's shadow
  lit += uSunCol * .2 * (1. - mSh) * step(.7, n.y) * step(150., p.z) * step(p.z, 178.) * step(k, 2.5) * step(1.5, k);
  vec3 dl = uMoonC - pL; float dm = length(dl);
  lit += uLamp * max(dot(n, dl / max(dm, 1.)) * .65 + .35, 0.) * 150. / max(dm, 150.);      // the Moon as a lamp (night)
  vec3 col = alb * lit + emis;
  if (gloss > .01) {
    vec3 r = reflect(-V, vec3(0., 1., 0.));
    float fres = 1. - max(V.y, 0.); fres = .06 + .94 * fres * fres * fres * fres;
    vec3 env = mix(uHorC, uPud, clamp(r.y * 1.6, 0., 1.));
    env = mix(env, vec3(1.02, 1., .97) * (uSkyCol * .9 + uSunCol * .5), smoothstep(.5, .72, fbm3(vec3(r.xz / (abs(r.y) + .25) * 1.1 + p.xz * .012 + uTime * vec2(.05, .09), 2.))) * .7);
    float slot = max(1. - smoothstep(.25, .8, abs(p.z - ${Qt.toFixed(1)}) / 6.5), smoothstep(.22, .5, r.y));
    vec3 fronts = uWallC * (.55 + .3 * vnoise(vec3(p.x * .45, p.z * .6, 3.))) * (.75 + .25 * step(.5, fract(p.x * .29)));
    env = mix(env, mix(fronts, uZenC * 1.05 + uHorC * .12, slot), stPud);
    fres = mix(fres, min(fres, .78), stPud);
    float sp = max(dot(r, uSunDir), 0.); float gl = exp(-(1. - sp) * 900.) * 9. + exp(-(1. - sp) * 60.) * .5;
    float tw = vnoise(vec3(p.x * 5. - uTime * 2.6, p.z * 22., uTime * 1.5));
    vec3 water = alb * lit * .45 + env * clamp(fres + .12, 0., 1.) + uSunCol * (gl + smoothstep(.72, .92, tw) * .9 * nl * spark) * sun * mSh;
    col = mix(col, water, gloss);
  }
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Ke=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aCol; attribute vec4 aPh;      // aPh: phase, amplitude, type, extra
uniform float uTime;
varying vec3 vCol, vN, vP, vUv; varying float vW;
vec3 shape(vec2 q){
  float ty = aPh.z;
  if (ty < .5) {                                 // laundry: pinned along its top edge
    float hang = 1. - q.y;
    float w = sin(uTime * 1.7 + aPh.x + q.x * 2.4) + .5 * sin(uTime * 2.9 + aPh.x * 1.7 + q.y * 3.);
    return vec3(q.x + .05 * hang * sin(uTime * 1.3 + aPh.x), q.y + .04 * hang * w, aPh.y * hang * (.5 + .45 * w));
  }
  if (ty < 1.5) {                                // awning or sail: pinned top and bottom, bellying
    float pin = sin(3.14159 * q.y);
    return vec3(q.x, q.y, aPh.y * pin * (.6 + .4 * sin(q.x * 5. + q.y * 4. - uTime * 2.6 + aPh.x)));
  }
  if (ty < 2.5) {                                // shutter: a rigid leaf on its hinge
    float a = min(aPh.w + aPh.y * sin(uTime * (.6 + fract(aPh.x) * .7) + aPh.x), 2.9);
    return vec3(q.x * cos(a), q.y, q.x * sin(a));
  }
  if (ty < 3.5) {                                // a sagging line; with a phase it is a slipped rope hanging in a loop, swinging
    float bow = 4. * q.x * (1. - q.x);
    return vec3(q.x + (aPh.x > .5 ? sin(uTime * 1.1 + aPh.x) * .2 * bow : 0.), -aPh.y * bow, 0.);
  }
  float a = sin(uTime * (2. + fract(aPh.x * 3.3) * 2.) + aPh.x) * aPh.y;    // a leaf hanging from its stalk
  vec2 c = q - vec2(.5, 1.);
  return vec3(.5 + c.x * cos(a), 1. + c.y * cos(a * .6), c.x * sin(a) + c.y * sin(a * .6));
}
void main(){
  vec2 q = position.xy;
  vec3 a = (instanceMatrix * vec4(shape(q), 1.)).xyz;
  vec3 b = (instanceMatrix * vec4(shape(q + vec2(.05, 0.)), 1.)).xyz;
  vec3 c = (instanceMatrix * vec4(shape(q + vec2(0., .05)), 1.)).xyz;
  vec3 n = normalize(cross(b - a, c - a) + vec3(0., 1e-6, 1e-7));
  if (aPh.z > 2.5 && aPh.z < 3.5) {
    vec3 tc = cameraPosition - a; float dist = length(tc);
    vec3 sd = normalize(cross(b - a, tc) + vec3(1e-5, 2e-5, 0.));
    a += sd * (q.y - .5) * max(aPh.w, dist * .0022);
    n = tc / max(dist, 1e-3);
  }
  vCol = aCol; vN = n; vP = a; vUv = vec3(uv, aPh.z + .05 + fract(aPh.x * .137) * .9);
  // the wind's crest as light and shade travelling over the cloth (laundry and awnings only)
  vW = aPh.z < .5 ? (1. - q.y) * sin(uTime * 1.7 + aPh.x + q.x * 2.4 + 1.2)
     : aPh.z < 1.5 ? sin(3.14159 * q.y) * cos(q.x * 5. + q.y * 4. - uTime * 2.6 + aPh.x) : 0.;
  vec4 mvPosition = modelViewMatrix * vec4(a, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ze=w=>`
#include <common>
#include <fog_pars_fragment>
varying vec3 vCol, vN, vP, vUv; varying float vW;
${w.noise}
${w.light}
${Me}
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  float ty = floor(vUv.z), rnd = clamp((fract(vUv.z) - .05) / .9, 0., 1.); vec2 uv = vUv.xy;
  vec3 alb = vCol;
  if (ty < .5) {
    alb *= .9 + .12 * vnoise(vec3(uv * 14., rnd * 9.));
    if (rnd > .6) alb *= .8 + .2 * step(.5, fract(uv.x * 7.));
    else if (rnd > .35) alb *= .85 + .15 * step(.5, fract(uv.y * 9.)) ;
    alb *= .8 + .2 * smoothstep(0., .25, uv.y);
  } else if (ty < 1.5) {
    alb = mix(alb, vec3(.78, .74, .64), step(.5, fract(uv.x * (3. + floor(rnd * 3.)))) * step(rnd, .7));
    alb *= .9 + .12 * vnoise(vec3(uv * 22., rnd * 9.));
  } else if (ty < 2.5) {
    alb *= (.7 + .3 * step(.4, fract(uv.y * 12.))) * (1. - .4 * step(.44, abs(uv.x - .5))) * (1. - .4 * step(.47, abs(uv.y - .5)));
  } else if (ty < 3.5) {
    alb = vec3(.3, .26, .2);
  } else {
    vec2 c = uv - .5; if (dot(c, c) > .25) discard;
    alb *= .7 + .6 * rnd;
  }
  alb *= 1. + .2 * clamp(vW, -1., 1.);
  vec3 pL = vP + vec3(0., 30., 0.);
  float sun = townSun(vP) * moonShadow(pL) * hangSun(vP);
  float up = n.y * .5 + .5;
  float thru = ty > 1.5 && ty < 3.5 ? 0. : .5;
  vec3 col = alb * (uSunCol * (max(dot(n, uSunDir), 0.) + thru * max(dot(-n, uSunDir), 0.)) * sun + uSkyCol * (.4 + .6 * up) + uGndCol * (1. - up) * 1.3);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Ye=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vP;
void main(){
  vP = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Qe=w=>`
#include <common>
#include <fog_pars_fragment>
uniform float uTime; uniform vec3 uSeaC, uHorC, uZenC;
varying vec3 vP;
${w.noise}
${w.light}
float seaH(vec2 q){
  return vnoise(vec3(q * .16 + uTime * vec2(.11, .3), uTime * .22)) * .7 + vnoise(vec3(q * .47 + uTime * vec2(-.2, .42), uTime * .4)) * .3;
}
void main(){
  vec3 tc = cameraPosition - vP; float dist = length(tc); vec3 V = tc / max(dist, 1e-3);
  vec2 q = vP.xz;
  float e = .35 + dist * .004;
  float h0 = seaH(q), hx = seaH(q + vec2(e, 0.)), hz = seaH(q + vec2(0., e));
  float amp = 2.2 / (1. + dist * .006);
  vec3 n = normalize(vec3(-(hx - h0) / e * amp, 1., -(hz - h0) / e * amp));
  vec3 r = reflect(-V, n); r.y = abs(r.y);
  float fres = 1. - max(dot(n, V), 0.); float f2 = fres * fres; fres = .03 + .97 * f2 * f2 * fres;
  vec3 sky = mix(uHorC, uZenC, sqrt(clamp(r.y, 0., 1.)));
  vec3 deep = uSeaC * (uSkyCol * 1.5 + uSunCol * .35 * max(uSunDir.y, 0.)) * (.75 + .5 * h0);
  vec3 col = mix(deep, sky, fres);
  float sp = max(dot(r, uSunDir), 0.);
  float tw = vnoise(vec3(q * 1.7, uTime * 2.2)); tw *= tw;
  float sh = moonShadow(vP + vec3(0., 30., 0.));
  col += uSunCol * (exp(-(1. - sp) * 420.) * 7. + exp(-(1. - sp) * 26.) * tw * 2.4 + smoothstep(.55, .8, tw) * .12 * uSunDir.y) * sh;
  float lw = 3.5 + max(vP.z - 175., 0.) * .07;
  float lane = exp(-vP.x * vP.x / (lw * lw)) * smoothstep(176., 186., vP.z) * (1. - smoothstep(250., 430., vP.z));
  col += vec3(1., .88, .6) * lane * (smoothstep(.3, .75, tw) * 1.5 + .1);
  float lap = (1. - smoothstep(0., 2.2, vP.z - ${Zt.toFixed(1)} - .7 * sin(uTime * 1.1 + vP.x * .35) - .5)) * step(${P0.toFixed(1)}, vP.x);
  lap = max(lap, (1. - smoothstep(0., 2., ${P0.toFixed(1)} - vP.x - .7 * sin(uTime * .9 + vP.z * .3) - .5)) * step(vP.z, ${Zt.toFixed(1)}));
  col = mix(col, vec3(.8, .88, .92) * (uSkyCol * 1.2 + uSunCol * .6 * sh), lap * (.35 + .4 * vnoise(vec3(q * 1.3, uTime))));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Je=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aS;     // origin x, y, z, phase
attribute vec4 aS2;    // rise (m), speed (cycles/s), size, kind (0 smoke, 1 fret)
uniform float uTime, uProg;
varying vec3 vUv; varying float vK; varying vec3 vWp;
void main(){
  float f = fract(uTime * aS2.y + aS.w);
  vec3 p = aS.xyz;
  float size = aS2.z;
  if (aS2.w < .5) {
    p.y += aS2.x * (1. - (1. - f) * (1. - f)) * .8;
    p.z += f * f * aS2.x * 1.3; p.x += f * f * aS2.x * .35 + sin(uTime * .6 + aS.w * 40.) * .3 * f;
    size *= .35 + 1.6 * f;
    vUv.z = smoothstep(0., .1, f) * (1. - f) * (1. - f) * .5;
  } else if (aS2.w < 1.5) {
    p.x += sin(uTime * .05 + aS.w * 30.) * 9.; p.z += (f - .5) * aS2.x; p.y += sin(uTime * .21 + aS.w * 50.) * .8;
    vUv.z = smoothstep(0., .2, f) * smoothstep(1., .8, f) * .3 * (1. - smoothstep(.56, .74, uProg));
  } else if (aS2.w < 2.5) {                      // chalk sifting down from the belly to the dock floor: fine falling streaks
    p.y -= aS2.x * f; p.x += sin(uTime * .5 + aS.w * 40.) * .9; p.z += cos(uTime * .4 + aS.w * 31.) * .9;
    vUv.z = smoothstep(0., .08, f) * smoothstep(1., .8, f) * .2;
  } else {                                       // a veil of dust hanging in the sun at the belly's rim, once the Moon stirs
    p.x += sin(uTime * .11 + aS.w * 30.) * 3.; p.z += cos(uTime * .09 + aS.w * 47.) * 3.; p.y -= f * 3.;
    vUv.z = smoothstep(0., .25, f) * smoothstep(1., .75, f) * aS2.x * smoothstep(.6, .7, uProg);
  }
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  vec2 shp = aS2.w > 2.5 ? vec2(1., 1.5) : (aS2.w > 1.5 ? vec2(.26, 2.6) : vec2(1., abs(aS2.w - 1.) < .5 ? .32 : 1.));
  mvPosition.xy += position.xy * size * shp;
  vWp = p + (vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]) * position.x * shp.x + vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]) * position.y * shp.y) * size;
  vUv.xy = position.xy * 2.; vK = aS2.w;
  vUv.z *= aS2.w > 2.5 ? smoothstep(16., 44., -mvPosition.z) : (aS2.w > 1.5 ? smoothstep(4., 12., -mvPosition.z) : smoothstep(1.5, 6., -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,to=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSmoke, uFret, uSunDir, uSunCol, uSkyCol, uMoonC;
varying vec3 vUv; varying float vK; varying vec3 vWp;
void main(){
  float r2 = dot(vUv.xy, vUv.xy);
  float a = (1. - smoothstep(.05, 1., r2)) * vUv.z;
  vec3 c = vK < .5 ? uSmoke : uFret;
  if (vK > 1.5) {
    // chalk in the air under the Moon: gold where the sun comes in under the rim, dim blue in the Moon's shade and the dock side's
    vec3 oc = vWp + vec3(0., 30., 0.) - uMoonC; float b = dot(oc, uSunDir), cc = dot(oc, oc) - 14400.;
    float lit = 1. - smoothstep(0., 1500., b * b - cc) * step(b, 0.) * step(0., cc);
    float sx = abs(uSunDir.x) > .05 ? uSunDir.x : .05;
    lit *= smoothstep(-3., 3., vWp.y + uSunDir.y * (140. * sign(sx) - vWp.x) / sx);
    c = mix(uSkyCol * 1.1, uSunCol * vec3(1.05, .86, .56), lit);
    a *= vK > 2.5 ? .3 + 1.25 * lit : .7 + .6 * lit;
  }
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
}`,eo=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vP; varying float vD;
void main(){
  vP = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  vD = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oo=w=>`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uFret;
uniform float uTime, uProg, uLayer;
varying vec3 vP; varying float vD;
${w.noise}
void main(){
  vec2 q = vP.xz + uLayer * 37.;
  float n = fbm3(vec3(q * .016 + uTime * vec2(.012, .022), uTime * .02 + uLayer * 5.));
  float n2 = vnoise(vec3(q * .07 - uTime * vec2(.03, .012), uTime * .05));
  float a = smoothstep(.16, .5, n * .75 + n2 * .25 + .1 - uLayer * .14);
  a *= smoothstep(0., 6., ${t0.toFixed(1)} - abs(vP.x)) * smoothstep(0., 6., vP.z - (${n0.toFixed(1)})) * smoothstep(0., 6., ${c0.toFixed(1)} - vP.z);
  a *= (1. - smoothstep(.54, .72, uProg)) * smoothstep(4., 30., vD) * (.92 - uLayer * .22);
  gl_FragColor = vec4(uFret * (.86 + .2 * n), a);
  #include <fog_fragment>
}`,ao=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 color;
attribute vec4 aG;     // perch x, y, z, release u
attribute vec4 aG2;    // heading, speed, phase, climb
uniform float uProg, uSecs, uTime, uSize;
varying vec3 vCol, vN, vP;
void main(){
  float t = max(uProg - aG.w, 0.) * uSecs;
  float fly = smoothstep(0., .45, t);
  vec3 lp = position * uSize; vec3 ln = normal;
  float sp = abs(position.x);
  if (sp > .09) {
    float beat = sin(uTime * 15. + t * 4. + aG2.z * 6.283) * mix(1., .35, smoothstep(2.5, 6., t));
    float a = (beat * .85 + .15) * smoothstep(.09, .7, sp) * fly;
    float fold = mix(.22, 1., fly);
    lp.x = position.x * cos(a) * fold * uSize; lp.y += (sp * sin(a) - (1. - fly) * sp * .28) * uSize; lp.z -= (1. - fly) * sp * .5 * uSize;
    ln = normalize(vec3(-sign(position.x) * sin(a), cos(a), 0.) * sign(normal.y + .001));
  } else {
    lp.y += (1. - fly) * .0;
    float peck = sin(uTime * 1.3 + aG2.z * 40.);
    lp.y += (1. - fly) * max(peck - .9, 0.) * -.5 * step(.12, position.z) * uSize;
  }
  float yaw = aG2.x + t * .16 * (aG2.z - .5) * 2.;
  float c = cos(yaw), s = sin(yaw);
  float pitch = fly * .35 * exp(-t * .5);
  lp = vec3(lp.x, lp.y * cos(pitch) + lp.z * sin(pitch), -lp.y * sin(pitch) + lp.z * cos(pitch));
  vec3 wp = vec3(c * lp.x + s * lp.z, lp.y, -s * lp.x + c * lp.z);
  vec3 wn = vec3(c * ln.x + s * ln.z, ln.y, -s * ln.x + c * ln.z);
  float run = aG2.y * (t - (1. - exp(-t * 1.4)) / 1.4);
  vec3 o = aG.xyz + vec3(s, 0., c) * run;
  o.y += aG2.w * (1. - exp(-t * 2.)) + sin(t * .4 + uTime * .9 + aG2.z * 9.) * .5 * fly + .05;
  vec3 p = o + wp;
  vCol = color; vN = wn; vP = p;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ze=w=>`
#include <common>
#include <fog_pars_fragment>
varying vec3 vCol, vN, vP;
${w.light}
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  gl_FragColor = vec4(lightIt(vCol, n, vP + vec3(0., 30., 0.), 1.) + vCol * (uSkyCol * .45 + uSunCol * .06), 1.);
  #include <fog_fragment>
}`,so=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aQ;     // corner of the card (-1..1, -1..1), strength of the card
attribute vec4 aL;     // pail x, z, size of its glow, brightness
varying vec3 vQ;
void main(){
  vec3 p = vec3(aL.x + position.x * aL.z, -30. + position.y, aL.y + position.z * aL.z);
  vQ = vec3(aQ.xy, aQ.z * aL.w);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,no=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uGlow;
varying vec3 vQ;
void main(){
  float r2 = dot(vQ.xy, vQ.xy);
  float a = (exp(-r2 * 5.) * .6 + exp(-r2 * 28.) * .4) * (1. - smoothstep(.7, 1., r2));
  vec3 col = uGlow * a * vQ.z;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      col *= 1. - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(col, 1.);
}`,n={WALL:0,ROOF:1,STONE:2,GROUND:3,WOOD:4,PLAIN:5,SHOP:6};function w0(){const w=[],st=[],nt=[],zt=[],X=[],Dt=[];let Bt=0;const ut={get count(){return Bt},get positions(){return w},get indices(){return Dt},vert(q,E,T,B,G,A,O,W,_,yt,Q,vt,K,C){return w.push(q,E,T),st.push(B,G,A),nt.push(O[0],O[1],O[2]),zt.push(W,_,yt,Q),X.push(vt,K,C),Bt++},quad(q,E,T,B,G,A,O={}){const W=E[0]-q[0],_=E[1]-q[1],yt=E[2]-q[2],Q=B[0]-q[0],vt=B[1]-q[1],K=B[2]-q[2];let C=_*K-yt*vt,j=yt*Q-W*K,ct=W*vt-_*Q;const $=Math.hypot(C,j,ct)||1;C/=$,j/=$,ct/=$;const S=O.sd??.37,Ct=O.u0??0,kt=O.u1??Math.hypot(W,_,yt),Ht=O.v0??0,e0=O.v1??Math.hypot(Q,vt,K),u0=O.w??kt-Ct,Lt=O.h??e0-Ht,It=O.l??1,a0=ut.vert(q[0],q[1],q[2],C,j,ct,G,A,S,Ct,Ht,u0,Lt,It);ut.vert(E[0],E[1],E[2],C,j,ct,G,A,S,kt,Ht,u0,Lt,It),ut.vert(T[0],T[1],T[2],C,j,ct,G,A,S,kt,e0,u0,Lt,It),ut.vert(B[0],B[1],B[2],C,j,ct,G,A,S,Ct,e0,u0,Lt,It),Dt.push(a0,a0+1,a0+2,a0,a0+2,a0+3)},tri(q,E,T,B,G,A={}){const O=E[0]-q[0],W=E[1]-q[1],_=E[2]-q[2],yt=T[0]-q[0],Q=T[1]-q[1],vt=T[2]-q[2];let K=W*vt-_*Q,C=_*yt-O*vt,j=O*Q-W*yt;const ct=Math.hypot(K,C,j)||1;K/=ct,C/=ct,j/=ct;const $=A.sd??.37,S=A.l??1,Ct=A.w??1,kt=A.h??1,Ht=ut.vert(q[0],q[1],q[2],K,C,j,B,G,$,A.ua??0,A.va??0,Ct,kt,S);ut.vert(E[0],E[1],E[2],K,C,j,B,G,$,A.ub??1,A.vb??0,Ct,kt,S),ut.vert(T[0],T[1],T[2],K,C,j,B,G,$,A.uc??.5,A.vc??1,Ct,kt,S),Dt.push(Ht,Ht+1,Ht+2)},wall(q,E,T,B,G,A,O,W,_={}){ut.quad([q,G,E],[T,G,B],[T,A,B],[q,A,E],O,W,{v0:_.v0??0,v1:(_.v0??0)+(A-G),..._})},box(q,E,T,B,G,A,O,W,_={}){const yt=Math.cos(_.yaw||0),Q=Math.sin(_.yaw||0),vt=(Ht,e0,u0)=>[q+Ht*yt+u0*Q,E+e0,T-Ht*Q+u0*yt],K=vt(-B,-G,A),C=vt(B,-G,A),j=vt(B,-G,-A),ct=vt(-B,-G,-A),$=vt(-B,G,A),S=vt(B,G,A),Ct=vt(B,G,-A),kt=vt(-B,G,-A);ut.quad(K,C,S,$,O,W,_),ut.quad(C,j,Ct,S,O,W,_),ut.quad(j,ct,kt,Ct,O,W,_),ut.quad(ct,K,$,kt,O,W,_),ut.quad($,S,Ct,kt,_.top||O,W,_),_.bottom&&ut.quad(ct,j,C,K,O,W,_)},beam(q,E,T,B,G,A,O,W,_=n.WOOD,yt={}){const Q=B-q,vt=G-E,K=A-T,C=Math.hypot(Q,vt,K)||1;let j=K,ct=0,$=-Q,S=Math.hypot(j,$);S<1e-4&&(j=1,$=0,S=1),j*=O/S,$*=O/S;const Ct=(vt*$-K*ct)/C,kt=(K*j-Q*$)/C,Ht=(Q*ct-vt*j)/C,e0=Ct*1,u0=kt*1,Lt=Ht*1,It=(X0,I0,W0)=>[(W0?B:q)+j*X0+e0*I0,(W0?G:E)+ct*X0+u0*I0,(W0?A:T)+$*X0+Lt*I0],a0={u1:C,v1:2*O,...yt};ut.quad(It(-1,-1,0),It(-1,-1,1),It(1,-1,1),It(1,-1,0),W,_,a0),ut.quad(It(1,-1,0),It(1,-1,1),It(1,1,1),It(1,1,0),W,_,a0),ut.quad(It(1,1,0),It(1,1,1),It(-1,1,1),It(-1,1,0),W,_,a0),ut.quad(It(-1,1,0),It(-1,1,1),It(-1,-1,1),It(-1,-1,0),W,_,a0),yt.caps&&(ut.quad(It(-1,-1,1),It(-1,1,1),It(1,1,1),It(1,-1,1),W,_,a0),ut.quad(It(-1,-1,0),It(1,-1,0),It(1,1,0),It(-1,1,0),W,_,a0))},lathe(q,E,T,B,G,A,O={}){const W=O.sd??.37,_=O.l??1,yt=Bt;for(let Q=0;Q<T.length;Q++){const[vt,K]=T[Q],C=T[Math.max(Q-1,0)],j=T[Math.min(Q+1,T.length-1)],ct=j[0]-C[0],$=j[1]-C[1],S=Math.hypot(ct,$)||1;for(let Ct=0;Ct<=B;Ct++){const kt=Ct/B*b0,Ht=Math.sin(kt),e0=Math.cos(kt);ut.vert(q+Ht*K,vt,E+e0*K,Ht*ct/S,-$/S,e0*ct/S,O.cols?O.cols[Q]:G,A,W,kt*Math.max(K,.2),vt,1,1,_)}}for(let Q=0;Q<T.length-1;Q++)for(let vt=0;vt<B;vt++){const K=yt+Q*(B+1)+vt,C=K+B+1;Dt.push(K,K+1,C,K+1,C+1,C)}},blob(q,E,T,B,G,A,O,W,_={}){const yt=_.seg||7,Q=_.rows||5,vt=Bt,K=_.k??n.PLAIN,C=_.sd??W(),j=_.l??1;for(let ct=0;ct<=Q;ct++)for(let $=0;$<=yt;$++){const S=ct/Q*Math.PI,Ct=$%yt/yt*b0,kt=ct===0||ct===Q?1:1+(_.rough??.22)*(Math.sin(Ct*3+C*40+ct)*Math.cos(S*4+C*17)),Ht=Math.sin(S)*Math.sin(Ct),e0=Math.cos(S),u0=Math.sin(S)*Math.cos(Ct),Lt=.75+.5*(e0*.5+.5);ut.vert(q+Ht*B*kt,E+e0*G*kt,T+u0*A*kt,Ht,e0,u0,[O[0]*Lt,O[1]*Lt,O[2]*Lt],K,C,0,0,1,1,j)}for(let ct=0;ct<Q;ct++)for(let $=0;$<yt;$++){const S=vt+ct*(yt+1)+$,Ct=S+yt+1;Dt.push(S,Ct,S+1,S+1,Ct,Ct+1)}},mesh(q){const E=new M.BufferGeometry;E.setAttribute("position",new M.Float32BufferAttribute(w,3)),E.setAttribute("normal",new M.Float32BufferAttribute(st,3)),E.setAttribute("color",new M.Float32BufferAttribute(nt,3)),E.setAttribute("aM",new M.Float32BufferAttribute(zt,4)),E.setAttribute("aW",new M.Float32BufferAttribute(X,3)),E.setIndex(Bt>65535?new M.Uint32BufferAttribute(Dt,1):new M.Uint16BufferAttribute(Dt,1)),E.computeBoundingSphere();const T=new M.Mesh(E,q);return T.matrixAutoUpdate=!1,T},async meshAsync(q,E){const T=new M.BufferGeometry;T.setAttribute("position",new M.Float32BufferAttribute(w,3)),await E(),T.setAttribute("normal",new M.Float32BufferAttribute(st,3)),await E(),T.setAttribute("color",new M.Float32BufferAttribute(nt,3)),await E(),T.setAttribute("aM",new M.Float32BufferAttribute(zt,4)),await E(),T.setAttribute("aW",new M.Float32BufferAttribute(X,3)),await E(),T.setIndex(Bt>65535?new M.Uint32BufferAttribute(Dt,1):new M.Uint16BufferAttribute(Dt,1)),await E(),T.computeBoundingSphere(),await E();const B=new M.Mesh(T,q);return B.matrixAutoUpdate=!1,B}};return ut}function Ae(w,st,nt,zt,X,Dt,Bt,ut,q,E,T,B={}){const G=Dt+Bt,A=B.l??1,O={sd:T,l:A,v0:-Dt};B.noS||w.wall(st,X,nt,X,0,G,q,n.WALL,{...O,h:Bt}),B.noN||w.wall(nt,zt,st,zt,0,G,q,n.WALL,{...O,h:Bt}),B.noE||w.wall(nt,X,nt,zt,0,G,q,n.WALL,{...O,h:Bt}),B.noW||w.wall(st,zt,st,X,0,G,q,n.WALL,{...O,h:Bt});const W=.45,_=ut===0?(X-zt)/2:(nt-st)/2,yt=_*(B.pitch??.34),Q={sd:T,l:A},vt=Math.hypot(_+W,yt*(_+W)/_);if(ut===0){const K=(zt+X)/2,C=G-yt*W/_,j=G+yt,ct=st-W,$=nt+W;w.quad([ct,C,X+W],[$,C,X+W],[$,j,K],[ct,j,K],E,n.ROOF,{...Q,v0:vt,v1:0}),w.quad([$,C,zt-W],[ct,C,zt-W],[ct,j,K],[$,j,K],E,n.ROOF,{...Q,v0:vt,v1:0}),w.tri([nt,G,X],[nt,G,zt],[nt,j,K],q,n.WALL,{sd:T,l:A,ua:0,va:99,ub:1,vb:99,uc:.5,vc:99,h:0}),w.tri([st,G,zt],[st,G,X],[st,j,K],q,n.WALL,{sd:T,l:A,ua:0,va:99,ub:1,vb:99,uc:.5,vc:99,h:0})}else{const K=(st+nt)/2,C=G-yt*W/_,j=G+yt,ct=zt-W,$=X+W;w.quad([nt+W,C,$],[nt+W,C,ct],[K,j,ct],[K,j,$],E,n.ROOF,{...Q,v0:vt,v1:0}),w.quad([st-W,C,ct],[st-W,C,$],[K,j,$],[K,j,ct],E,n.ROOF,{...Q,v0:vt,v1:0}),w.tri([st,G,X],[nt,G,X],[K,j,X],q,n.WALL,{sd:T,l:A,ua:0,va:99,ub:1,vb:99,uc:.5,vc:99,h:0}),w.tri([nt,G,zt],[st,G,zt],[K,j,zt],q,n.WALL,{sd:T,l:A,ua:0,va:99,ub:1,vb:99,uc:.5,vc:99,h:0})}return G+yt}function ro(w,st,nt,zt,X=56,Dt=10){const Bt=[],ut=[],q=[],E=(A,O,W)=>{const _=A*st,yt=nt*Math.pow(Math.max(1-A*A,0),.62)+.25,Q=nt*.9*(A*A-.4)+O*yt,vt=Math.sqrt(Math.max(w*w-_*_-Q*Q,1)),K=W/Math.hypot(_,vt,Q);Bt.push(_*K,vt*K,Q*K)};for(let A=0;A<2;A++)for(let O=0;O<=Dt;O++)for(let W=0;W<=X;W++)E(W/X*2-1,O/Dt*2-1,A?w-zt:w),ut.push(O/Dt,A);const T=X+1,B=T*(Dt+1);for(let A=0;A<Dt;A++)for(let O=0;O<X;O++){const W=A*T+O,_=W+T;q.push(W,_,W+1,W+1,_,_+1);const yt=B+W,Q=B+_;q.push(yt,yt+1,Q,yt+1,Q+1,Q)}for(let A=0;A<X;A++){let O=A,W=B+A;q.push(O,O+1,W,O+1,W+1,W),O=Dt*T+A,W=B+O,q.push(O,W,O+1,O+1,W,W+1)}const G=new M.BufferGeometry;return G.setAttribute("position",new M.Float32BufferAttribute(Bt,3)),G.setAttribute("uv",new M.Float32BufferAttribute(ut,2)),G.setIndex(q),G}function Pe(w,st){const nt=[],zt=[],X=[];for(let Bt=0;Bt<=st;Bt++)for(let ut=0;ut<=w;ut++)nt.push(ut/w,Bt/st,0),zt.push(ut/w,Bt/st);for(let Bt=0;Bt<st;Bt++)for(let ut=0;ut<w;ut++){const q=Bt*(w+1)+ut,E=q+w+1;X.push(q,q+1,E,q+1,E+1,E)}const Dt=new M.BufferGeometry;return Dt.setAttribute("position",new M.Float32BufferAttribute(nt,3)),Dt.setAttribute("uv",new M.Float32BufferAttribute(zt,2)),Dt.setIndex(X),Dt}function Ce(){const w=[],st=[],nt=[],zt=new M.Matrix4,X=new M.Vector3,Dt=new M.Vector3,Bt=new M.Vector3,ut=new M.Vector3;return{add(q,E,T,B,G,A){zt.makeBasis(X.fromArray(E),Dt.fromArray(T),Bt.fromArray(B)).setPosition(ut.fromArray(q));for(let O=0;O<16;O++)w.push(zt.elements[O]);st.push(G[0],G[1],G[2]),nt.push(A[0],A[1],A[2],A[3])},build(q,E){const T=nt.length/4,B=new M.InstancedMesh(q,E,Math.max(T,1));return B.count=T,B.instanceMatrix.array.set(w),B.instanceMatrix.needsUpdate=!0,q.setAttribute("aCol",new M.InstancedBufferAttribute(new Float32Array(T?st:[0,0,0]),3)),q.setAttribute("aPh",new M.InstancedBufferAttribute(new Float32Array(T?nt:[0,0,0,0]),4)),B.frustumCulled=!1,B.matrixAutoUpdate=!1,B}}}const io={ochre:{walls:["#E9C98A","#E2B877","#D9A066","#EBD3A0","#DB9A78","#E4C08A"],roof:"#C8643C",shutA:"#3F6B4F",shutB:"#3E6FA8",cloth:["#EEF1F4","#C8643C","#3E6FA8","#E9C98A","#EEF1F4","#8FD3E8"]},whitewash:{walls:["#F0ECE2","#E8E2D4","#F1EEE8","#E4D9C4","#EDE7DA"],roof:"#C8643C",shutA:"#3E6FA8",shutB:"#2F5F9A",cloth:["#EEF1F4","#3E6FA8","#8FD3E8","#E9C98A","#C8643C"]},rose:{walls:["#E8B9A6","#E3A68F","#EBCBB5","#D9C7A0","#DDAE98"],roof:"#B85C3C",shutA:"#8FA58A",shutB:"#6F8F7A",cloth:["#EEF1F4","#8FA58A","#E8B9A6","#EBD9B0","#C8643C"]}},_0=Math.PI/180,$0=(w,st)=>[Math.sin(st*_0)*Math.cos(w*_0),Math.sin(w*_0),Math.cos(st*_0)*Math.cos(w*_0)],ke={day:{preset:"day",sun:$0(27,105),sunCol:["#FFE9C4",1.22],skyCol:["#7F9CC4",.62],gnd:.2,zenith:"#3565A6",horizon:"#B4CFE6",fog:"#B5CDE4",fogD:78e-5,exposure:1,self:0,lamp:0,night:0,clouds:.25},dawn:{preset:"dawn",sun:$0(9,112),sunCol:["#FFB792",1.2],skyCol:["#8E97CC",.5],gnd:.16,zenith:"#4A65AC",horizon:"#F3CDBD",fog:"#E3C3C2",fogD:95e-5,exposure:1.06,self:0,lamp:0,night:0,clouds:.4},golden:{preset:"goldenHour",sun:$0(17,-118),sunCol:["#FFC37A",1.3],skyCol:["#8E9BCB",.78],gnd:.26,zenith:"#3F62A6",horizon:"#F4D6A6",fog:"#E6CDA6",fogD:9e-4,exposure:1.16,self:0,lamp:0,night:0,clouds:.42},night:{preset:"night",sun:$0(40,105),sunCol:["#8FA8E0",.1],skyCol:["#5E7CE0",.3],gnd:.07,zenith:"#0A1230",horizon:"#243560",fog:"#1B2748",fogD:8e-4,exposure:1.3,self:.5,lamp:.75,night:1,clouds:.2}};var ho={id:"moon-in-dry-dock",name:"The Moon in Dry Dock",category:"bizarre",weirdness:.95,media:["air","open"],async build(w){const st=w.rng,nt=Math.min(1,Math.max(.5,w.quality?.detail??1)),zt=Math.min(1.3,Math.max(.7,w.vary?.density??1)),X=new M.Scene,Dt=st.fork("v7"),Bt=Dt(),ut=Dt(),q=Dt(),E=Dt(),T=Dt(),B=Dt(),G=Dt();let A=w.vary?.hour;ke[A]||(A=Bt<.46?"day":Bt<.76?"golden":"dawn");const O=A==="night"||ut<.5?"clear":ut<.76?"fret":"rain",W=q<.27?"whitewash":q<.72?"ochre":"rose",_=E<.5?"gulls":E<.78?"doves":"swifts",yt=T<.25?4:T<.6?6:T<.8?7:8,Q=B<.55?"lateen":"drifter",vt=G<.62?"third":"half",K=!!w.vary?.rare,C=ke[A],j=io[W],ct=["#E9C98A",j.roof,"#EEF1F4","#F8FBFF","#3E6FA8","#2B3A4A","#8FD3E8"],$=(o,e=1)=>{const d=new M.Color(o);return[d.r*e,d.g*e,d.b*e]},S=(o,e,d=.1)=>{const p=1+(e()-.5)*2*d;return[o[0]*p,o[1]*p,o[2]*p]},Ct=(o,e=1)=>new M.Color(o).multiplyScalar(e);await w.yield();const kt=new M.Vector3().fromArray(C.sun).normalize(),Ht={rng:st,preset:C.preset,sunDirection:kt,zenith:C.zenith,horizon:C.horizon,clouds:{coverage:C.clouds,scale:1.5,softness:.24,wind:[.004,.012]},clouds2:{coverage:.46,stretch:1,opacity:.5,scale:.8},quality:nt<.8?.5:1};A==="night"&&(Ht.bodies=[],Ht.sunIntensity=0,Ht.sunGlow=0,Ht.stars=1,Ht.key="sun"),A==="day"&&(Ht.sunColor="#FFF1D6",Ht.scatter=.22);const e0=Ge(Ht);X.add(e0.object);const u0=Ct(C.fog);O==="fret"&&u0.lerp(new M.Color("#F2F4F4"),.35),X.fog=new M.FogExp2(u0,C.fogD*(O==="fret"?1.5:O==="rain"?.8:1)),await w.yield();const Lt=await je(w,{palette:ct,detail:nt,sunDir:C.sun,job:vt,journeySeconds:43});Lt.object.position.set(0,-30,0),Lt.object.updateMatrixWorld(!0),X.add(Lt.object);const It=Ct(C.sunCol[0],C.sunCol[1]),a0=Ct(C.skyCol[0],C.skyCol[1]),X0=Ct("#E9C98A",C.gnd),I0=Ct(C.zenith,.9),W0=Ct(C.horizon,A==="night"?1:.92);Lt.setLight({sunDir:C.sun,sunColor:It,skyColor:a0,groundColor:X0,zenith:I0,horizon:W0,self:[C.self*.9,C.self,C.self*1.12],mirrorSun:$0(A==="golden"?15:A==="dawn"?9:17,236)});const p0=Lt.uniforms,R0=Lt.glsl,K0=30,k0=Lt.anchors,Le=k0.flyThrough.map(o=>[o.x,o.y-K0,o.z]),C0=He(Le,{samples:600});await w.yield();const fe=new Uint8Array(256*4),q0=new M.DataTexture(fe,256,1,M.RGBAFormat,M.UnsignedByteType);q0.minFilter=q0.magFilter=M.LinearFilter,q0.generateMipmaps=!1,q0.colorSpace=M.NoColorSpace;const se=[];for(let o=0;o<8;o++)se.push(new M.Vector4(0,9999,1,1));const ne={uSunDir:p0.uSunDir,uSunCol:p0.uSunCol,uSkyCol:p0.uSkyCol,uGndCol:p0.uGndCol,uMoonC:p0.uMoonC,uTime:p0.uTime,uProg:p0.uProg,uSecs:p0.uSecs,uRoofTex:{value:q0},uCres:{value:se},uHang:{value:new M.Vector4(0,9999,1,0)},uHangOn:{value:0},uWet:{value:O==="rain"?1:0},uNight:{value:C.night},uShutA:{value:Ct(j.shutA,.8)},uShutB:{value:Ct(j.shutB,.8)},uPud:{value:I0.clone().lerp(W0,.25)},uChalkC:{value:p0.uChalk.value},uHorC:{value:W0},uZenC:{value:I0},uLamp:{value:new M.Color(C.lamp*.55,C.lamp*.8,C.lamp*1.25)},uWallC:{value:(()=>{const o=new M.Color(0,0,0);for(const e of j.walls)o.add(new M.Color(e));return o.multiplyScalar(.8/j.walls.length),o.multiply(a0.clone().multiplyScalar(.9).add(It.clone().multiplyScalar(.45)))})()},uSeaC:{value:Ct("#3E6FA8",A==="night"?.25:.5)},uSmoke:{value:a0.clone().multiplyScalar(1.2).add(It.clone().multiplyScalar(.45))},uFret:{value:new M.Color(.9,.93,.95).multiply(a0.clone().multiplyScalar(1.1).add(It.clone().multiplyScalar(.55)))}},Se=M.UniformsLib.fog,O0=(o,e,d={},p={})=>new M.ShaderMaterial({vertexShader:o,fragmentShader:e,fog:!0,uniforms:{...M.UniformsUtils.clone(Se),...ne,...d},...p}),H0=O0($e,Xe(R0),{},{side:M.DoubleSide}),ue=O0(Ke,Ze(R0),{},{side:M.DoubleSide}),At=(()=>{const o=$("#E9C98A",.26);return[o[0]+.17,o[1]+.185,o[2]+.19]})(),s0=[.3,.215,.135],Yt=[.09,.09,.1],re=$(j.roof,.7).map((o,e)=>o*[.92,1.05,1.25][e]+.015),ie=j.walls.map(o=>$(o,.86)),t=st.fork("town"),V=w0(),J0=o=>({x:t0+V0*o,z0:n0-V0*o,z1:c0+V0*o});{const o=n.GROUND,e=n.STONE,d=[At[0]*.95,At[1]*.95,At[2]*.95],p=(a,s,r,i,u,z,I=o)=>V.quad([a,u,i],[s,u,i],[s,u,r],[a,u,r],z,I);p(-t0,t0,n0,c0,-30,d);for(let a=0;a<5;a++){const s=J0(a),r=J0(a+1),i=-30+6*a,u=i+6,z=S(At,t,.05);V.wall(s.x,s.z0,s.x,s.z1,i,u,z,e),V.wall(-s.x,s.z1,-s.x,s.z0,i,u,z,e),V.wall(-s.x,s.z0,s.x,s.z0,i,u,z,e),V.wall(s.x,s.z1,lt,s.z1,i,u,z,e),V.wall(-lt,s.z1,-s.x,s.z1,i,u,z,e);for(const I of[-1,1])V.wall(lt*I,I>0?s.z1:r.z1+0,lt*I,I>0?r.z1+0:s.z1,i,u,z,e);a<4&&(p(s.x,r.x,r.z0,r.z1,u,z,e),p(-r.x,-s.x,r.z0,r.z1,u,z,e),p(-s.x,s.x,r.z0,s.z0,u,z,e),p(lt,s.x,s.z1,r.z1,u,z,e),p(-s.x,-lt,s.z1,r.z1,u,z,e))}const f=J0(5),c=1400,h=-1400;p(f.x,c,h,Zt,0,At),p(P0,-f.x,h,Zt,0,At),p(-f.x,f.x,h,f.z0,0,At),p(lt,f.x,f.z1,Zt,0,At),p(-f.x,-lt,f.z1,Zt,0,At),p(-lt,lt,c0,Zt,-26,d,e),V.wall(lt,c0,-lt,c0,-30,-26,At,e),V.wall(lt,f.z1,lt,Zt,-30,0,At,e),V.wall(-lt,Zt,-lt,f.z1,-30,0,At,e),V.wall(lt,Zt,c,Zt,-34,0,At,e),V.wall(P0,Zt,-lt,Zt,-34,0,At,e),V.wall(-lt,Zt,lt,Zt,-34,-26,At,e),V.wall(P0,h,P0,Zt,-34,0,At,e);const l=[At[0]*1.12,At[1]*1.12,At[2]*1.12],v=[At[0]*1.6,At[1]*1.52,At[2]*1.36];for(const a of[-1,1])V.box(a*(f.x+.7),.2,(f.z0+f.z1)/2,.7,.2,(f.z1-f.z0)/2+1.4,l,e);V.box(0,.2,f.z0-.7,f.x,.2,.7,l,e),V.box((400+lt)/2,.2,Zt-.8,(400-lt)/2,.2,.8,l,e),V.box((P0-lt)/2,.2,Zt-.8,(-P0-lt)/2,.2,.8,l,e),V.box(P0+.8,.2,-200,.8,.2,380,l,e);for(const a of[-1,1]){V.box(a*(lt+f.x)/2,.22,f.z1+.45,(f.x-lt)/2,.26,.85,l,e);for(let s=0;s<5;s++){const r=J0(s),i=-24+6*s;s<4&&V.box(a*(lt+.2+r.x)/2,i-.3,r.z1-.14,(r.x-lt-.2)/2,.4,.36,v,e),s<4&&V.box(a*(r.x-.12),i-.14,(r.z0+r.z1)/2,.34,.22,(r.z1-r.z0)/2,v,e),V.lathe(a*lt,r.z1,[[i-6,.44],[i+.07,.44],[i+.07,0]],8,l,e,{sd:.3})}V.lathe(a*lt,Zt,[[-34,.5],[.45,.5],[.45,0]],8,l,e,{sd:.3}),V.box(a*(lt+6),4.66,166.5,6.4,.26,7.9,l,e,{bottom:!0});for(const s of[159,174])V.lathe(a*lt,s,[[.4,.42],[4.4,.42]],8,l,e,{sd:.3})}for(const a of[-1,1]){V.box(a*(lt+6),2.2,166.5,6,2.2,7.5,S(At,t,.04),e,{top:l}),V.lathe(a*(lt+6),166.5,[[4.4,1.2],[4.9,1],[5.2,.62],[6.3,.55],[6.5,.9],[6.9,.9],[7,.3]],10,Yt,n.PLAIN,{sd:.2});for(let F=0;F<4;F++){const L=F*Math.PI/4+a;V.beam(a*(lt+6)-Math.sin(L)*2.6,6.7,166.5-Math.cos(L)*2.6,a*(lt+6)+Math.sin(L)*2.6,6.7,166.5+Math.cos(L)*2.6,.09,s0,n.WOOD)}const s=.15,r=Math.cos(s),i=Math.sin(s),u=a*(lt-.75),z=160.4,I=-26,y=4,N=[.5,.38,.24],x=(F,L)=>[u-a*i*F-a*r*L,z+r*F-i*L],m=-a*s,b=(I+y)/2,k=(y-I)/2;{const F=x(7.5,0);V.box(F[0],b,F[1],.6,k,7.5,N,n.WOOD,{sd:.3+.2*a,bottom:!0,yaw:m})}for(let F=0;F<=6;F++){const L=x(7.5,.7);V.box(L[0],I+1+F*4.6,L[1],.1,.36,7.56,Yt,n.PLAIN,{sd:.5,yaw:m})}for(let F=0;F<=6;F++)for(const L of[1.6,3.4,6.6,8.3,11.4,13.2]){const D=.7+1.9*Math.abs(Math.sin(F*12.9+L*7.13+a)*43758.5%1),R=x(L,.615);V.box(R[0],I+1+F*4.6-.36-D/2,R[1],.012,D/2,.06+.05*(D%.7),[.34,.14,.05],n.PLAIN,{sd:.5,yaw:m})}for(const F of[.45,5.1,9.9,14.55]){const L=x(F,.74);V.box(L[0],b,L[1],.16,k,.38,[.24,.175,.115],n.WOOD,{sd:.7,yaw:m})}for(let F=0;F<3;F++)for(let L=0;L<2;L++){const D=x(L?5.5:.9,.86),R=x(L?9.5:4.7,.86),U=I+1.7+F*9.2,Z=U+8.2,rt=(F+L)%2;V.beam(D[0],rt?U:Z,D[1],R[0],rt?Z:U,R[1],.2,[.26,.19,.125],n.WOOD,{sd:.2+.1*F})}{const F=x(10.3,.86),L=x(14.2,.86);V.beam(F[0],I+1.7,F[1],L[0],y-1.6,L[1],.24,[.26,.19,.125],n.WOOD)}{const F=x(0,0);V.lathe(F[0],F[1],[[I,.72],[y+.5,.72],[y+.6,.4],[y+.9,.05]],8,Yt,n.PLAIN,{sd:.4})}for(let F=0;F<=5;F++){const L=x(.6+F*2.8,.45),D=x(.6+Math.min(F+1,5)*2.8,.45);V.beam(L[0],y,L[1],L[0],y+1.15,L[1],.05,Yt,n.PLAIN),F<5&&(V.beam(L[0],y+1.1,L[1],D[0],y+1.1,D[1],.045,Yt,n.PLAIN),V.beam(L[0],y+.6,L[1],D[0],y+.6,D[1],.035,Yt,n.PLAIN))}for(const F of[26,47])for(let L=0;L<5;L++){const D=c0+V0*L-.16,R=-30+6*L;for(const Tt of[-.28,.28])V.beam(a*F+Tt,R,D,a*F+Tt,R+6.9,D,.045,Yt,n.PLAIN);for(let Tt=0;Tt<13;Tt++)V.beam(a*F-.28,R+.4+Tt*.5,D,a*F+.28,R+.4+Tt*.5,D,.03,Yt,n.PLAIN);const U=-.16*C.sun[0]/Math.max(Math.abs(C.sun[2]),.12),Z=-.16*C.sun[1]/Math.max(Math.abs(C.sun[2]),.12),rt=D+.16-.015;if(C.sun[2]<-.05&&Math.abs(U)<1.6)for(const Tt of[-.28,.28])V.wall(a*F+Tt+U+.06,rt,a*F+Tt+U-.06,rt,R+.05,R+5.95+Z,At,e,{l:0})}for(const F of[157.5,176.5-3.4])V.lathe(a*(lt+1.4),F,[[.4,.5],[.7,.5],[.75,.34],[1.4,.3],[1.5,.52],[1.66,.46],[1.7,.05]],8,Yt,n.PLAIN,{sd:.6});for(const F of[34,58,84])V.lathe(a*F,c0+V0*5+1.6,[[.4,.42],[.65,.42],[.7,.3],[1.25,.27],[1.35,.45],[1.5,.4],[1.54,.05]],7,Yt,n.PLAIN,{sd:.6})}V.lathe(-lt-6,171,[[4.4,.9],[4.8,.7],[11,.42],[11.2,.75],[11.4,.75]],10,[.78,.76,.7],n.PLAIN,{sd:.3}),V.lathe(-lt-6,171,[[12.7,.62],[13,.66],[13.6,.05]],8,Yt,n.PLAIN,{sd:.3});const g=372;V.box(-136,-16,g,89,17.6,6,S(At,t,.04),e,{top:At}),V.box(-136,2.2,g+4.8,89,.6,1.2,l,e),V.lathe(-47,g,[[-34,9.5],[1.6,9.5],[1.6,8.6],[2.4,8.6],[2.4,0]],18,At,e,{sd:.3}),V.lathe(-47,g,[[2.4,1.5],[9.5,1.05],[9.7,1.6],[10,1.6]],10,[.8,.78,.72],n.PLAIN),V.lathe(-47,g,[[11.6,1.2],[12,1.25],[13.2,.05]],8,$(j.roof,.7),n.PLAIN);for(const a of k0.bollards){const s=a.position,r=s.y-K0;V.lathe(s.x,s.z,[[r,.42],[r+.25,.42],[r+.3,.3],[r+.85,.27],[r+.95,.45],[r+1.08,.4],[r+1.12,.05]],7,Yt,n.PLAIN,{sd:.6})}}await w.yield();const at=w0(),M0=Ce(),T0={"-1":[],1:[]},he=[];for(const o of[-1,1]){let e=ae+(o<0?0:l0*2);for(;e<we+40;){const d=t.int(2,3),p=d*l0;T0[o].push({x0:e,x1:e+p,bays:d,top:t.range(15,18.6),col:S(t.pick(ie),t,.06),sd:t()}),e+=p,t.chance(o<0?.36:.2)&&(e+=l0)}}for(const o of[-1,1]){const e=Qt+6.5*o,d=e+4*o,p=e+11.5*o,f=new Set;T0[o].forEach((c,h)=>{const{x0:l,x1:v,top:g,col:a}=c,s=g-5,r=(h===2||h===5||h===8)&&l<450||v>415&&l<453,i=c.sd+(r?2:0),u={sd:i,l:1};o<0?at.wall(l,e,v,e,5,g,a,n.WALL,{...u,h:s}):at.wall(v,e,l,e,5,g,a,n.WALL,{...u,h:s}),r&&he.push({x0:l,x1:v,top:g,s:o,zf:e});const z={sd:i,l:1,u0:0,u1:1,v0:99,v1:99,w:1,h:0};for(let x=0;x<c.bays;x++){const m=l+(x+.5)*l0,b=1.4,k=3.2,F=8;at.quad([m-l0/2,k,e],[m-b,k,e],[m-b,5,e],[m-l0/2,5,e],a,n.WALL,z),at.quad([m+b,k,e],[m+l0/2,k,e],[m+l0/2,5,e],[m+b,5,e],a,n.WALL,z);for(let L=0;L<F;L++){const D=Math.PI*L/F,R=Math.PI*(L+1)/F,U=m-b*Math.cos(D),Z=k+b*Math.sin(D),rt=m-b*Math.cos(R),Tt=k+b*Math.sin(R);if(at.quad([U,Z,e],[rt,Tt,e],[rt,5,e],[U,5,e],a,n.WALL,z),at.quad([U,Z,e],[rt,Tt,e],[rt,Tt,e+.6*o],[U,Z,e+.6*o],[a[0]*.8,a[1]*.8,a[2]*.8],n.WALL,{...z,l:.5}),v>404){const m0=b+.26,A0=e-.09*o,v0=[.6,.57,.5],x0=L===3||L===4,xt=m-m0*Math.cos(D),Rt=k+m0*Math.sin(D),Xt=m-m0*Math.cos(R),_t=k+m0*Math.sin(R),ht=x0?A0-.05*o:A0;at.quad([U,Z,ht],[rt,Tt,ht],[Xt,_t,ht],[xt,Rt,ht],x0?[.66,.63,.55]:v0,n.PLAIN,{sd:.2}),at.quad([xt,Rt,ht],[Xt,_t,ht],[Xt,_t,e],[xt,Rt,e],[.42,.4,.36],n.PLAIN,{sd:.2}),at.quad([U,Z,ht],[rt,Tt,ht],[rt,Tt,e],[U,Z,e],[.34,.32,.3],n.PLAIN,{sd:.2,l:.6})}}}for(let x=0;x<=c.bays;x++)f.add(Math.round((l+x*l0)*10));at.quad([l,5,e],[v,5,e],[v,5,d],[l,5,d],[a[0]*.7,a[1]*.7,a[2]*.7],n.PLAIN,{sd:i,l:.5}),at.wall(l,d,v,d,0,5,a,n.SHOP,{sd:i,l:.5,u0:l-ae,u1:v-ae});for(const x of[l,v])at.wall(x,d,x,p,0,g,a,n.WALL,{sd:i,v0:-5,h:s}),at.wall(x,e,x,d,5,g,a,n.WALL,{sd:i,v0:0,h:s});at.wall(l,p,v,p,0,g,a,n.WALL,{sd:i,v0:-5,h:s});const I=Math.min(e,p),y=Math.max(e,p),N=Ae(at,l,v,I,y,0,g,0,a,S(re,t,.12),i,{noS:1,noN:1,noE:1,noW:1,pitch:.3});if(c.ridge=N,t.chance(.8)){const x=t.range(l+1,v-1),m=(I+y)/2+t.range(-3,3);at.box(x,g+2.1,m,.45,2.1,.45,[a[0]*.9,a[1]*.9,a[2]*.9],n.PLAIN,{sd:i,top:[.05,.05,.05]}),c.chimney=[x,g+4.3,m]}});for(const c of f){const h=c/10,l=S([At[0]*1.3,At[1]*1.22,At[2]*1.1],t,.06);if(h<404){at.lathe(h,e,[[0,.44],[.3,.44],[.38,.31],[2.95,.27],[3.02,.4],[3.2,.44]],10,l,n.PLAIN,{sd:.11});continue}const v=[l[0]*.8,l[1]*.8,l[2]*.82];at.box(h,.11,e,.5,.11,.5,v,n.PLAIN,{sd:.11}),at.lathe(h,e,[[.22,.4],[.27,.455],[.33,.47],[.39,.44],[.43,.36],[.5,.335],[1.3,.325],[2.2,.295],[2.74,.27],[2.76,.315],[2.82,.315],[2.84,.27],[2.9,.275],[2.97,.34],[3.03,.43],[3.06,.43]],14,l,n.PLAIN,{sd:.11}),at.box(h,3.13,e,.5,.07,.5,[l[0]*1.06,l[1]*1.06,l[2]*1.06],n.PLAIN,{sd:.11,bottom:!0})}for(let c=0;c<256;c++){const h=340+(c+.5)/256*160;let l=0;for(const v of T0[o])h>=v.x0&&h<=v.x1&&(l=(v.top+v.ridge)/2);fe[c*4+(o<0?0:1)]=Math.round(Math.min(1,l/32)*255)}}q0.needsUpdate=!0,await w.yield();const pe=Ce(),N0=j.cloth.map(o=>$(o,.82)),Fe=$("#C8643C",.75),Oe=[.1,.22,.07];for(const o of he){const e=o.x1-o.x0,d=Math.max(1,Math.floor(e/3.1)),p=e/d,f=o.top-5,c=-o.s,h=$(t.chance(.5)?j.shutA:j.shutB,.8);for(let l=0;(l+1)*3.5<=f+.6;l++)for(let v=0;v<d;v++){const g=(v+.5)*p,a=o.s<0?o.x0+g:o.x1-g,s=5+l*3.5+1.8;for(const u of[-1,1])M0.add([a+u*.55,s-.92,o.zf+c*.07],[-u*.53,0,0],[0,1.84,0],[0,0,c*.53],S(h,t,.15),[t.range(0,30),t.chance(.5)?t.range(.25,.5):t.range(.04,.12),2,t.range(1.8,2.6)]);const r=s-.98,i=[.62,.6,.54];at.box(a,s+1.02,o.zf+c*.09,.74,.09,.09,i,n.PLAIN,{bottom:!0});for(const u of[-1,1])at.box(a+u*.62,s,o.zf+c*.05,.06,.93,.05,i,n.PLAIN);if(l>0&&o.x1>415&&t.chance(.34)){const u=o.zf+c*.42;at.box(a,r-.02,u,.98,.07,.42,i,n.PLAIN,{bottom:!0});for(let z=0;z<=6;z++)at.beam(a-.93+z*.31,r,u+c*.38,a-.93+z*.31,r+.95,u+c*.38,.022,Yt,n.PLAIN);at.beam(a-.95,r+.95,u+c*.38,a+.95,r+.95,u+c*.38,.03,Yt,n.PLAIN);for(const z of[-1,1])at.beam(a+z*.95,r+.95,u-c*.4,a+z*.95,r+.95,u+c*.38,.03,Yt,n.PLAIN);continue}if(at.box(a,r,o.zf+c*.2,.82,.06,.2,i,n.PLAIN,{bottom:!0}),t.chance(.75))for(const u of[-.42,0,.42])t.chance(.25)||(at.box(a+u,r+.2,o.zf+c*.24,.13,.14,.13,Fe,n.PLAIN),at.blob(a+u,r+.5,o.zf+c*.26,.26,.2,.24,Oe,t,{seg:5,rows:3}),at.blob(a+u+t.range(-.1,.1),r+.64,o.zf+c*.3,.13,.09,.12,$(t.chance(.7)?"#D8342A":"#E86A8A",.9),t,{seg:4,rows:2}))}}const D0=(o,e)=>{for(const d of T0[o])if(e>d.x0+.4&&e<d.x1-.4)return d.top;return 0};for(const[o,e,d,p]of[[404.5,12.3,1.9,2.6],[390.5,13.2,1.7,2.4]]){const f=Qt-6.5,c=13,h=.1;M0.add([o,e,f],[0,0,c],[0,1,0],[1,0,0],[.3,.26,.2],[0,h,3,.05]);let l=t.range(.05,.09);for(;l<.93;){const v=t.range(1.3,2.5),g=t.range(d,p);if(l+v/c>.96)break;const a=l+v/c/2,s=e-h*4*a*(1-a),r=t.chance(.55);M0.add([o,s-g,f+l*c],[0,0,v],[0,g,0],[1,0,0],S(r?N0[0]:t.pick(N0),t,.06),[t.range(0,30),t.range(.95,1.35),0,0]),l+=v/c+t.range(.012,.045)}}for(const o of[384,396]){let e=o+t.range(-1,1),d=D0(-1,e),p=D0(1,e);if((!d||!p)&&(e+=l0,d=D0(-1,e),p=D0(1,e)),!d||!p)continue;const f=Math.min(d,p)-.5,c=Qt-6.5,h=13,l=.08;M0.add([e,f,c],[0,0,h],[0,1,0],[1,0,0],[.1,.085,.07],[0,l,3,.05]);let v=t.range(.06,.14);for(;v<.9;){const g=t.range(1,2.5),a=t.range(.9,1.7);if(v+g/h>.95)break;const s=v+g/h/2;if(t.chance(.9)&&(o<376||Math.abs(s-.5)>.36)){const r=v+g/h/2,i=f-l*4*r*(1-r);M0.add([e,i-a,c+v*h],[0,0,g],[0,a,0],[1,0,0],S(t.pick(N0),t,.08),[t.range(0,30),t.range(.45,.85),0,0])}v+=g/h+t.range(.01,.06)}}for(const o of[360]){let e=o,d=D0(-1,e),p=D0(1,e);if((!d||!p)&&(e+=l0,d=D0(-1,e),p=D0(1,e)),!d||!p)continue;const f=Math.min(d,p,14.6)-2.6,c=Qt-6.5,h=13,l=.11,v=17;M0.add([e,f,c],[0,0,h],[0,1,0],[1,0,0],[.1,.085,.07],[0,l,3,.04]);for(let g=0;g<v;g++){const a=(g+.5)/v,s=f-l*4*a*(1-a),r=.5,i=t.range(.55,.75);M0.add([e,s-i,c+a*h-r/2],[0,0,r],[0,i,0],[1,0,0],S(N0[(g+(o|0))%N0.length],t,.06),[t.range(0,30),t.range(.5,.9),0,0])}}{const o=st.fork("awnings"),e=[j.roof?$(j.roof,.9):[.6,.2,.1],[.2,.34,.52],[.62,.5,.2],[.25,.42,.3]];for(const d of[-1,1])for(const p of T0[d]){if(!o.chance(p.x0>410?.92:.5)||p.x0<366)continue;const f=Qt+d*6.5,c=p.x1-p.x0-.7,h=S(o.pick(e),o,.1),l=o.range(1,1.5),v=o.range(1.9,2.5),g=o.range(0,30),a=p.x0>426,s=o.range(.14,.26);p.x1>422&&p.x0<447||(M0.add([p.x0+.35,6.55-l,f-d*v],[c,0,0],[0,l,d*v],[0,1,.4*d],h,[g,s*(a?2.3:1),1,0]),p.x0>398&&M0.add([p.x0+.35,6.55-l-.46,f-d*v],[c,0,0],[0,.5,0],[0,0,-d],h,[g,a?.34:.2,0,0]))}}{const o=C.sun[2]<0?1:-1,e=T0[o][3],d=Qt+6.5*o,p=-o;at.beam(e.x0+.1,0,d+p*.5,e.x0+.3,5.2,d+p*.45,.07,[.2,.15,.1],n.WOOD);const f=Math.round(380*nt);for(let h=0;h<f;h++){const l=t.range(e.x0-.4,e.x1+.4),v=t(),g=3+3.6*Math.sqrt(v)-1.2*Math.max(0,Math.cos((l-e.x0)/l0*b0))*t(),a=t.range(.3,.55),s=t.range(-.9,.9),r=t.range(.7,1.5);pe.add([l,g,d+p*t.range(.12,.55)],[Math.cos(s)*a,0,Math.sin(s)*a],[0,a*1.15,0],[-Math.sin(s)*a,0,Math.cos(s)*a],[.09*r,.2*r,.05*r],[t.range(0,60),t.range(.25,.7),4,0])}const c=Qt+o*4.9;for(const h of[371,374.6,401,404.8,433]){const l=h+t.range(-.4,.4),v=c+t.range(-.3,.3),g=S(t.pick([N0[0],N0[0],N0[1]]),t,.05);at.lathe(l,v,[[.42,.66],[.6,.6],[.745,.57],[.76,0]],12,g,n.PLAIN,{sd:t()}),at.lathe(l,v,[[0,.24],[.04,.05],[.5,.04]],6,Yt,n.PLAIN),at.lathe(l+.15,v-.1,[[.76,.05],[.84,.06],[.95,.025],[1,.03]],6,[.3,.42,.34],n.PLAIN);for(let a=0;a<2;a++){const s=t.range(0,b0),r=l+Math.sin(s)*.95,i=v+Math.cos(s)*.95,u=[.2,.3,.42];at.box(r,.45,i,.21,.025,.21,u,n.PLAIN,{yaw:s,bottom:!0}),at.box(r+Math.sin(s)*.2,.72,i+Math.cos(s)*.2,.21,.26,.02,u,n.PLAIN,{yaw:s,bottom:!0});for(const[z,I]of[[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]])at.box(r+z,.22,i+I,.02,.22,.02,u,n.PLAIN)}}for(const[h,l]of[[388.2,o],[389.1,o],[417.6,-o],[445,o]]){const v=Qt+l*5.6,g=t.int(1,3);for(let a=0;a<g;a++){const s=.2+a*.4,r=t.range(-.3,.3),i=h+t.range(-.05,.05);if(at.box(i,s,v,.36,.19,.26,S([.42,.32,.18],t,.1),n.WOOD,{yaw:r,sd:t(),top:[.1,.08,.05]}),a===g-1)for(let u=0;u<9;u++)at.blob(i+(u%3-1)*.2,s+.2,v+(Math.floor(u/3)-1)*.15,.09,.075,.08,$("#F2D21F",.85),t,{seg:4,rows:2,rough:0})}}{const l=Qt+o*5.75,v=-o*.16,g=[.08,.2,.3],a=.022,s=N=>{for(let x=0;x<12;x++){const m=x/12*b0,b=(x+1)/12*b0,k=.34;at.beam(N+Math.cos(m)*k,.35+Math.sin(m)*k,l+v*Math.sin(m)*k,N+Math.cos(b)*k,.35+Math.sin(b)*k,l+v*Math.sin(b)*k,a,[.06,.06,.06],n.PLAIN),x%2===0&&at.beam(N,.35,l,N+Math.cos(m)*k,.35+Math.sin(m)*k,l+v*Math.sin(m)*k,.008,[.5,.5,.52],n.PLAIN)}};s(396.5-.52),s(396.5+.52);const r=[396.5-.52,.35],i=[396.5-.08,.33],u=[396.5-.22,.88],z=[396.5+.36,.9],I=[396.5+.52,.35],y=[396.5+.34,1.02];for(const[N,x]of[[r,i],[i,u],[r,u],[u,z],[i,z],[z,I],[z,y]])at.beam(N[0],N[1],l+v*(N[1]-.35),x[0],x[1],l+v*(x[1]-.35),a,g,n.PLAIN);at.box(396.5-.24,.95,l+v*.6,.12,.025,.06,[.12,.08,.05],n.PLAIN),at.beam(396.5+.34,1.02,l+v*.67-.24,396.5+.34,1.02,l+v*.67+.24,a,[.4,.4,.42],n.PLAIN)}}const g0={head:null,pivot:new M.Vector3};{const o=C.sun[2]<0?1:-1,e=428.5,d=Qt+o*5.5,p=A==="night"?[.5,.5,.5]:[.62,.36,.14];at.lathe(e,d,[[0,.36],[.45,.43],[.9,.36],[.9,0]],10,[.3,.22,.13],n.WOOD,{sd:.4}),at.blob(e,1.03,d,.3,.14,.2,p,t,{seg:8,rows:5,rough:.05}),at.blob(e+.2,.96,d+o*-.17,.2,.05,.06,[p[0]*.8,p[1]*.8,p[2]*.8],t,{seg:5,rows:3,rough:0});const f=w0();f.blob(0,.03,.02,.1,.085,.1,p,t,{seg:7,rows:4,rough:0});for(const c of[-1,1])f.tri([c*.085,.07,.02],[c*.025,.1,.02],[c*.07,.19,0],[p[0]*.7,p[1]*.7,p[2]*.7],n.PLAIN);g0.head=f.mesh(H0),g0.head.matrixAutoUpdate=!0,g0.head.frustumCulled=!1,g0.pivot.set(e-.27,1.04,d),g0.head.position.copy(g0.pivot),X.add(g0.head)}await w.yield();const r0=w0(),te=[];for(const o of[-1,1])for(const e of T0[o])e.chimney&&e.x0<470&&te.push(e.chimney);const Ne=(o,e)=>.105*Math.max(0,Math.max(o-415,-e-295)),De=(o,e,d,p)=>e>344&&o<we+60&&p>Qt-19.5&&d<Qt+19.5||e>286&&o<314&&p>-86&&d<-54,de=async(o,e,d,p,f)=>{let c=0;for(let h=d;h+9<p;){await w.yield();const l=t.range(9,12.5);for(let v=o+t.range(0,5);v+7<e;){const g=t.range(7,13),a=Math.max(v-520,-h-360,0);if(!(t.chance(.07)||a>0&&t()>f)&&!De(v,v+g,h,h+l)){const r=Ne(v+g/2,h+l/2),i=t.chance(.08)?t.range(15,19):t.range(8.5,14.5),u=t(),z=Ae(r0,v,v+g,h,h+l,r,i,t.chance(.82)?0:1,S(t.pick(ie),t,.07),S(re,t,.14),u);te.length<26&&t.chance(.05)&&v<520&&h>-400&&(r0.box(v+g/2,z+.6,h+l/2+1.5,.4,1.3,.4,At,n.PLAIN,{top:[.05,.05,.05]}),te.push([v+g/2,z+2,h+l/2+1.5]))}v+=g+(t.chance(.14)?t.range(3,7):0)}h+=l+(c++%2?t.range(5,7.5):.2)}};await w.yield(),await de(354,735,-335,168,.35+.65*nt*Math.min(1,zt)),await w.yield(),await de(-212,350,-500,-240,.35+.65*nt*Math.min(1,zt));const G0={mesh:null};{const d=S(ie[1],t,.03),p=[At[0]*1.2,At[1]*1.2,At[2]*1.2];r0.box(300,13.5,-70,3.2,13.5,3.2,d,n.STONE,{sd:.4}),r0.box(300,27.3,-70,3.6,.35,3.6,p,n.STONE);for(const[a,s]of[[-1,-1],[1,-1],[-1,1],[1,1]])r0.box(300+a*2.5,30.2,-70+s*2.5,.65,2.6,.65,d,n.STONE);r0.box(300,33.4,-70,3.4,.7,3.4,d,n.STONE),r0.box(300,34.3,-70,3.8,.25,3.8,p,n.STONE);const f=[300,38.4,-70],c=S(re,t,.05),h=3.9,l=34.5;r0.tri([300-h,l,-70+h],[300+h,l,-70+h],f,c,n.ROOF,{ua:0,va:6,ub:8,vb:6,uc:4,vc:0}),r0.tri([300+h,l,-70+h],[300+h,l,-70-h],f,c,n.ROOF,{ua:0,va:6,ub:8,vb:6,uc:4,vc:0}),r0.tri([300+h,l,-70-h],[300-h,l,-70-h],f,c,n.ROOF,{ua:0,va:6,ub:8,vb:6,uc:4,vc:0}),r0.tri([300-h,l,-70-h],[300-h,l,-70+h],f,c,n.ROOF,{ua:0,va:6,ub:8,vb:6,uc:4,vc:0}),r0.beam(300-2.4,32.4,-70,300+2.4,32.4,-70,.14,s0,n.WOOD);const v=w0(),g=[.34,.25,.1];v.lathe(0,0,[[-1.9,1],[-1.75,.92],[-1.1,.6],[-.55,.5],[-.3,.3],[-.2,0]],10,g,n.PLAIN,{sd:.2}),v.lathe(0,0,[[-2.1,.12],[-1.9,.12],[-1.9,0]],5,Yt,n.PLAIN),G0.mesh=v.mesh(H0),G0.mesh.matrixAutoUpdate=!0,G0.mesh.frustumCulled=!1,G0.mesh.position.set(300,32.3,-70),X.add(G0.mesh);for(const[a,s,r]of[[315,-52,15.5],[283,-90,13]]){r0.beam(a,0,s,a+1.2,r*.72,s-.8,.34,[.23,.15,.1],n.WOOD);for(let i=0;i<3;i++){const u=i*2.1+a;r0.beam(a+1.2,r*.72,s-.8,a+1.2+Math.sin(u)*2.8,r*.93,s-.8+Math.cos(u)*2.8,.16,[.23,.15,.1],n.WOOD)}for(let i=0;i<6;i++){const u=i/6*b0,z=i?3.4:0;r0.blob(a+1.2+Math.sin(u)*z,r+(i?0:.9),s-.8+Math.cos(u)*z,t.range(3,4),t.range(1.2,1.7),t.range(3,4),[.07,.17,.07],t,{seg:8,rows:5,rough:.3})}}for(const[a,s,r]of[[1330,150,.9],[2050,330,1]]){const u=20*_0,z=262*_0;let I=null;for(let y=0;y<=64;y++){const N=y/64,x=u+(z-u)*N,m=Math.pow(Math.sin(Math.PI*N),.45),b=s*m*(.45+.55*Math.abs(w.noise.fbm2(N*5.3+a,1.7,4)))+4,k=[Math.sin(x)*a,Math.cos(x)*a,b];I&&r0.quad([k[0],0,k[1]],[I[0],0,I[1]],[I[0],I[2],I[1]],[k[0],k[2],k[1]],[.3*r,.33*r,.2*r],n.PLAIN,{sd:.5}),I=k}}}await w.yield();const St=w0(),Ie=[],y0=208,Z0=75,U0=15,le=1.4,We=ro(y0,Z0,U0,le,Math.round(40+16*nt),10),qe=Math.sqrt(y0*y0-Z0*Z0-(U0*.54)**2),me=new M.Matrix4().makeTranslation(0,K0,0),ve=(o,e=1)=>{const d=new M.Matrix4().multiplyMatrices(me,o),p=new M.Mesh(We,Lt.crescentMaterial(y0,d,e));p.matrixAutoUpdate=!1,p.matrix.copy(o),p.frustumCulled=!1;const f={mesh:p,um:d,world:o.clone()};return Ie.push(f),f},Y0=(o,e,d,p,f)=>{const c=e*Z0,h=U0*Math.pow(Math.max(1-e*e,0),.62)+.25,l=U0*.9*(e*e-.4)+d*h,v=Math.sqrt(Math.max(y0*y0-c*c-l*l,1)),g=p/Math.hypot(c,v,l);return f.set(c*g,v*g,l*g).applyMatrix4(o)};{const o=Math.min(3,Math.floor(yt/2)),e=new M.Matrix4,d=new M.Matrix4,p=new M.Matrix4,f=new M.Matrix4,c=new M.Vector3,h=new M.Vector3,l=new M.Vector3;let v=0;const g=w0();for(const s of[-1,1])for(let r=0;r<(s<0?o:yt-o);r++){await w.yield();const i=(.3+.07*r+t.range(-.03,.03))*-s,u=Qt+s*(18.5+r*15.5),z=247+t.range(-6,6)+r*4;e.makeTranslation(z,1.6+r*5.6,u),d.makeRotationX(i),p.makeRotationY(s>0?Math.PI:0),f.makeTranslation(0,-qe,-U0*.54);const I=new M.Matrix4().copy(e).multiply(d).multiply(p).multiply(f),y=K&&s>0&&r===0,N=y?g:St;if(!y){const x=ve(I);X.add(x.mesh)}Y0(I,0,0,y0,c),v<8&&!y&&se[v++].set(c.x,c.z,Z0*.98,(U0+3)*s);for(const x of[-.86,-.62,-.36,-.12,.12,.36,.62,.86]){Y0(I,x,.72,y0-le-.2,c),Y0(I,x,-.72,y0-le-.2,h);const m=S(s0,t,.15),b=.16;c.y>1.2&&N.beam(c.x+t.range(-.3,.3),0,c.z+(c.z-h.z)*b,c.x,c.y,c.z,.2,m,n.WOOD,{sd:t()}),h.y>1.2&&N.beam(h.x+t.range(-.3,.3),0,h.z+(h.z-c.z)*b,h.x,h.y,h.z,.2,m,n.WOOD,{sd:t()}),c.y>3&&h.y>3&&N.beam(c.x,c.y-.5,c.z,h.x,h.y-.5,h.z,.16,m,n.WOOD,{sd:t()}),Math.min(c.y,h.y)>6&&N.beam(c.x,.2,c.z,h.x,h.y*.8,h.z,.11,m,n.WOOD,{sd:t()});const k=c.y<h.y?c:h;N.box(k.x,.3,k.z,.5,.3,.9,m,n.WOOD,{sd:t(),yaw:t.range(-.2,.2)})}for(const x of[-.7,-.35,0,.35,.7]){let m=null,b=null;for(let k=0;k<=6;k++)Y0(I,x+t.range(-.004,.004),-1.02+2.04*k/6,y0+.5,l),m?N.beam(m[0],m[1],m[2],l.x,l.y,l.z,.075,[.13,.1,.07],n.PLAIN):b=[l.x,l.y,l.z],m=[l.x,l.y,l.z];if(b&&m)for(const[k,F]of[[b,m],[m,b]]){const L=Math.sign(k[2]-F[2])||1;k[1]>.6&&N.beam(k[0],k[1],k[2],k[0]+.25*Math.sin(x*37),.05,k[2]-L*Math.min(1.1,k[1]*.25),.075,[.13,.1,.07],n.PLAIN)}}}const a=(s,r)=>C0.nearestXZ(s,r).dist>7.5;await w.yield();for(let s=0;s<Math.round(9*zt);s++){const r=t.range(160,340),i=Qt+t.pick([-1,1])*t.range(9,15.5),u=t.range(-.25,.25)+(t.chance(.3)?Math.PI/2:0);if(!a(r,i))continue;const z=t.int(2,4),I=t.range(2.5,4.5);for(let y=0;y<z;y++)for(let N=0;N<z+1-y;N++)St.box(r+(N-(z-y)/2)*.47*Math.cos(u),.2+y*.4,i-(N-(z-y)/2)*.47*Math.sin(u),.2,.19,I,S([.44,.34,.2],t,.14),n.WOOD,{sd:t(),yaw:u+t.range(-.03,.03),bottom:!1})}for(let s=0;s<Math.round(10*zt);s++){const r=t.range(150,345),i=Qt+t.pick([-1,1])*t.range(8,15);if(!a(r,i))continue;const u=t.range(.7,1.1),z=t.int(2,4),I=[.36,.28,.16];for(let y=0;y<z;y++)St.lathe(r,i,[[y*.2,u*.55],[y*.2+.02,u],[y*.2+.2,u],[y*.2+.22,u*.55]],10,S(I,t,.1),n.WOOD,{sd:t()})}for(let s=0;s<Math.round(7*zt);s++){const r=t.range(150,340),i=Qt+t.pick([-1,1])*t.range(8.5,14),u=t.range(0,b0);if(!a(r,i))continue;const z=Math.cos(u),I=Math.sin(u),y=S([.33,.25,.15],t,.1),N=[.6,.59,.55];St.box(r,.75,i,.6,.06,1,y,n.WOOD,{yaw:u,bottom:!0,sd:t()});for(const x of[-1,1])St.box(r+x*.62*z,.95,i-x*.62*I,.03,.2,1,y,n.WOOD,{yaw:u,sd:t()}),St.lathe(r+x*.72*z,i-x*.72*I,[[.02,.1],[.38,.5],[.74,.1]],9,Yt,n.PLAIN,{});St.beam(r+1*I,.75,i+1*z,r+2.2*I,.3,i+2.2*z,.04,y,n.WOOD);for(let x=0;x<7;x++)St.box(r+t.range(-.35,.35),.98+(x>3?.3:0),i+t.range(-.7,.7),.2,.15,.3,S(N,t,.06),n.PLAIN,{yaw:u+t.range(-.4,.4),sd:t()})}await w.yield();for(let s=-130;s<=150;s+=20)for(const r of[-1,1]){const i=r*144.2;a(i,s)&&St.lathe(i,s,[[0,.42],[.25,.42],[.3,.3],[.85,.27],[.95,.45],[1.08,.4],[1.12,.05]],7,Yt,n.PLAIN,{sd:.6})}}await w.yield();const d0={group:null,c:null};if(K){const d=Qt+26,p=[.3,.2,.12],f=[.12,.1,.08];for(const s of[-1,1]){const r=252+s*10,i=d+4.5,u=76+2.5;St.beam(r,0,i,252-s*.3,u,d,.4,p,n.WOOD,{sd:.3,v1:.28}),St.box(r,.4,i,.9,.4,.9,s0,n.WOOD);for(let z=1;z<9;z++){const I=z*10/u;St.box(r+(252-r)*I,z*10,i+(d-i)*I,.47,.35,.47,f,n.PLAIN,{bottom:!0})}St.beam(252,76,d,252+s*86,0,d+4.5,.11,f,n.PLAIN),St.beam(252,76,d,252+s*30,.5,d+81,.11,f,n.PLAIN)}St.box(252,76-.5,d,.75,1,.75,Yt,n.PLAIN,{bottom:!0}),d0.group=new M.Group,d0.group.position.set(252,76-1.6,d);const c=76-1.6-58,l=new M.Matrix4().makeTranslation(0,-c,0).multiply(new M.Matrix4().makeRotationX(1.15)).multiply(new M.Matrix4().makeTranslation(0,-y0,8));d0.c=ve(l,1),d0.group.add(d0.c.mesh);const v=w0(),g=new M.Vector3;for(const s of[-.42,.42])for(const r of[-.9,.2])Y0(l,s,r,y0+.2,g),v.beam(0,0,0,g.x,g.y,g.z,.1,f,n.PLAIN);const a=v.mesh(H0);a.frustumCulled=!1,d0.group.add(a),X.add(d0.group),ne.uHangOn.value=1}await w.yield();const z0=[],ee=.6;{let o=null;if(Lt.object.traverse(e=>{const d=e.geometry;!o&&d&&d.attributes.aA&&d.attributes.aB&&d.attributes.aR&&(o=d)}),o){const e=o.attributes.aA.array,d=o.attributes.aB.array,p=o.attributes.aR.array,f=o.attributes.position,c=p0.uSecs.value,h=Lt.object.position.x,l=Lt.object.position.z,v=[];for(let i=0;i<f.count;i++)v.includes(f.getX(i))||v.push(f.getX(i));v.sort((i,u)=>i-u);let g=null,a=null;const s=p0.uRootInv.value.clone();Lt.setProgress(1);for(let i=0;i<=40;i++){Lt.update(0,c+i*.25);const u=Lt.moon.matrix.elements;(!g||u[13]<g[13])&&(g=u.slice()),(!a||u[13]>a[13])&&(a=u.slice())}Lt.setProgress(0),Lt.update(0,0),p0.uRootInv.value.copy(s);const r=(i,u,z,I)=>{const y=e[i*3],N=e[i*3+1],x=e[i*3+2],m=u[0]*y+u[4]*N+u[8]*x+u[12],b=u[1]*y+u[5]*N+u[9]*x+u[13],k=u[2]*y+u[6]*N+u[10]*x+u[14],F=d[i*3],L=d[i*3+1],D=d[i*3+2],R=Math.max(Math.hypot(F-m,L-b,D-k),.001),U=(m-F)/R,Z=(b-L)/R,rt=(k-D)/R,Tt=Math.hypot(rt+1e-4,1e-4,-U+1e-4),m0=(rt+1e-4)/Tt,A0=(-U+1e-4)/Tt,v0=new Float64Array(v.length*4);for(let x0=0;x0<v.length;x0++){const xt=1-v[x0],Rt=Math.min(Math.max(z*(.55+.4*xt),0),1.12),Xt=U*(1-Rt)+1e-4,_t=Z*(1-Rt)-Rt,ht=rt*(1-Rt),Gt=R*xt/Math.hypot(Xt,_t,ht);v0[x0*4]=h+F+Gt*Xt,v0[x0*4+1]=l+D+Gt*ht,v0[x0*4+2]=I*xt*(Math.abs(m0)+.4*Math.abs(U)),v0[x0*4+3]=I*xt*(Math.abs(A0)+.4*Math.abs(rt))}return v0};for(let i=0;i<o.instanceCount;i++){const u=p[i*4+2],z=Math.max(1-p[i*4],0)*c;if(Math.abs(p[i*4+3])>.5||!(u<.32)||z<=0)continue;const I=1-Math.exp(-z*.7)*Math.cos(z*1.4),y=4.5*Math.exp(-z*.28),N=r(i,g,I,y),x=r(i,a,I,y);for(let m=0;m+1<v.length;m++){const b=m*4,k=Math.max(1,Math.ceil(Math.max(Math.hypot(N[b+4]-N[b],N[b+5]-N[b+1]),Math.hypot(x[b+4]-x[b],x[b+5]-x[b+1]))/.2));for(let F=0;F<=k;F++){const L=F/k;let D=1e9,R=-1e9,U=1e9,Z=-1e9;for(const rt of[N,x]){const Tt=rt[b]+(rt[b+4]-rt[b])*L,m0=rt[b+1]+(rt[b+5]-rt[b+1])*L,A0=rt[b+2]+(rt[b+6]-rt[b+2])*L+u,v0=rt[b+3]+(rt[b+7]-rt[b+3])*L+u;D=Math.min(D,Tt-A0),R=Math.max(R,Tt+A0),U=Math.min(U,m0-v0),Z=Math.max(Z,m0+v0)}R>-t0&&D<t0&&Z>n0&&U<c0&&z0.push(D,R,U,Z)}}}}}const Te=(o,e,d,p)=>{for(let f=0;f<z0.length;f+=4)if(z0[f]<e&&z0[f+1]>o&&z0[f+2]<p&&z0[f+3]>d)return!0;return!1};{const e=[.6,.59,.55],d=(f,c)=>!(Math.abs(f)<5&&Math.abs(c)<34)&&Math.abs(Math.abs(f)-9)>1.6&&Math.hypot(f,c)<128,p=Math.round(120*(.5+.5*nt)*zt);for(let f=0;f<p;f++){f%12===0&&await w.yield();const c=f<p*.6,h=c?t.range(-34,34):t.range(-120,120),l=c?t.range(-10,150):t.range(-125,148),v=t();if(d(h,l))if(v<.36){const g=t.int(5,12);for(let a=0;a<g;a++){const s=t.range(.3,.75),r=t.range(0,b0),i=t.range(0,1.8)*(a<g/2?1:.45);St.box(h+Math.sin(r)*i,-30+s*.5+(a<g/2?0:.7),l+Math.cos(r)*i,s*t.range(.6,1),s*.5,s*t.range(.7,1.3),S(e,t,.08),n.PLAIN,{yaw:t.range(0,3),sd:t()})}}else if(v<.62){const g=t.int(2,4),a=t.range(2.5,5),s=t.range(0,b0);for(let r=0;r<g;r++)for(let i=0;i<g+1-r;i++)St.box(h+(i-(g-r)/2)*.62*Math.cos(s),-30+.28+r*.56,l-(i-(g-r)/2)*.62*Math.sin(s),.28,.27,a,S(s0,t,.2),n.WOOD,{sd:t(),yaw:s+t.range(-.04,.04)})}else if(v<.8){const g=t.range(.9,1.5),a=t.int(2,5),s=[.36,.28,.16];for(let r=0;r<a;r++)St.lathe(h,l,[[-30+r*.26,g*.5],[-30+r*.26+.03,g],[-30+r*.26+.26,g],[-30+r*.26+.29,g*.5]],10,S(s,t,.1),n.WOOD,{sd:t()})}else if(v<.92)for(let g=0;g<t.int(2,4);g++){const a=h+t.range(-1,1),s=l+t.range(-1,1);St.lathe(a,s,[[-30,.3],[-29,.42],[-29,.36],[-30+.9,0]],8,[.47,.52,.57],n.PLAIN,{cols:[[.4,.44,.5],[.5,.55,.6],[.2,.22,.25],$("#8FD3E8",.9)]})}else{const g=t.range(0,b0),a=Math.cos(g),s=Math.sin(g),r=S([.42,.33,.2],t,.1);for(const i of[-1,1])St.beam(h+i*1.5*a-.5*s,-30,l-i*1.5*s-.5*a,h+i*1.5*a,-30+1.1,l-i*1.5*s,.06,r),St.beam(h+i*1.5*a+.5*s,-30,l-i*1.5*s+.5*a,h+i*1.5*a,-30+1.1,l-i*1.5*s,.06,r);St.beam(h-1.8*a,-30+1.12,l+1.8*s,h+1.8*a,-30+1.12,l-1.8*s,.08,r);for(let i=0;i<3;i++)St.box(h+t.range(-.2,.2),-30+1.24+i*.07,l+t.range(-.2,.2),.16,.03,2.2,S([.47,.385,.26],t,.15),n.WOOD,{yaw:g+Math.PI/2+t.range(-.1,.1),sd:t()})}}{const f=j0(4211+(w.seed|0));for(let c=0;c<16;c++){const h=c%2?-1:1,l=h*(lt+5+(c>>1)*11.5+f.range(-2.5,2.5)),v=f.range(141.5,150),g=(c+(c>>2))%4;if(g===0){const a=f.int(3,5),s=f.range(3,5.5),r=f.chance(.5)?Math.PI/2+f.range(-.1,.1):f.range(-.15,.15);for(let i=0;i<a;i++)for(let u=0;u<a+1-i;u++)St.box(l+(u-(a-i)/2)*.66*Math.cos(r),-30+.3+i*.6,v-(u-(a-i)/2)*.66*Math.sin(r),.3,.29,s,S(s0,f,.22),n.WOOD,{sd:f(),yaw:r+f.range(-.04,.04)})}else if(g===1)for(let a=0;a<14;a++){const s=f.range(.35,.8),r=f.range(0,b0),i=f.range(0,2.4)*(a<8?1:.4);St.box(l+Math.sin(r)*i,-30+s*.5+(a<8?0:.75),v+Math.cos(r)*i,s*f.range(.6,1),s*.5,s*f.range(.7,1.3),S(e,f,.08),n.PLAIN,{yaw:f.range(0,3),sd:f()})}else if(g===2)for(let a=0;a<2;a++){const s=f.range(1,1.6),r=f.int(3,5),i=l+a*f.range(2.4,3.2),u=[.36,.28,.16];for(let z=0;z<r;z++)St.lathe(i,v,[[-30+z*.26,s*.5],[-30+z*.26+.03,s],[-30+z*.26+.26,s],[-30+z*.26+.29,s*.5]],10,S(u,f,.1),n.WOOD,{sd:f()})}else{for(let a=0;a<4;a++)St.box(l+a*.7,-30+.25,v,.25,.25,f.range(4,6.5),S(s0,f,.2),n.WOOD,{sd:f(),yaw:Math.PI/2+f.range(-.06,.06)});for(let a=0;a<3;a++){const s=l+4+a*1.1;St.beam(s,-30,151.2+a*.3,s+.2,-30+7.4,153.8,.2,S(s0,f,.2),n.WOOD,{sd:f()})}}}}for(const f of[-1,1]){const c=f>0?96:44,h=f*9;St.box(h,-30+.75,c,1.1,.12,1.9,s0,n.WOOD,{bottom:!0,sd:.3});for(const l of[-1.2,1.2])for(const v of[-.9,.9])St.lathe(h+v,c+l,[[-30+.02,.05],[-30+.32,.34],[-30+.62,.05]],8,Yt,n.PLAIN);for(let l=0;l<10;l++)St.box(h+t.range(-.6,.6),-30+1.1+(l>5?.42:0),c+t.range(-1.3,1.3),.3,.2,.42,S(e,t,.07),n.PLAIN,{yaw:t.range(-.3,.3),sd:t()})}{const f=j0("moon-floor-lights:"+w.seed),c=140,h=new Float32Array(c*4);for(let r=0;r<c;r++){const i=f.range(-130,130),u=f.range(-134,148),z=f.range(.85,1.25),I=f.range(.75,1.1),y=Te(i-.42-ee,i+.42+ee,u-.42-ee,u+.42+ee);y||St.lathe(i,u,[[-30,.3],[-29,.42],[-29,.36],[-30+.9,0]],8,[.47,.52,.57],n.PLAIN,{cols:[[.4,.44,.5],[.5,.55,.6],[.2,.22,.25],$("#8FD3E8",.9)]}),h.set(y?[i,u,0,0]:[i,u,z,I],r*4)}const l=[],v=[],g=[];[[.06,4.2,.4],[1,.55,2.4],[1.2,3.6,.7],[2.2,3,.5],[3.3,2.4,.32]].forEach(([r,i,u],z)=>{for(const[I,y]of[[-1,-1],[1,-1],[1,1],[-1,1]])l.push(I*i,r,y*i),v.push(I,y,u);g.push(z*4,z*4+2,z*4+1,z*4,z*4+3,z*4+2)});const a=new M.InstancedBufferGeometry;a.setAttribute("position",new M.Float32BufferAttribute(l,3)),a.setAttribute("aQ",new M.Float32BufferAttribute(v,3)),a.setIndex(g),a.setAttribute("aL",new M.InstancedBufferAttribute(h,4)),a.instanceCount=c;const s=new M.Mesh(a,O0(so,no,{uGlow:p0.uGlow},{transparent:!0,depthWrite:!1,blending:M.AdditiveBlending,side:M.DoubleSide}));s.frustumCulled=!1,s.renderOrder=2,s.matrixAutoUpdate=!1,X.add(s);var Ee=h}}await w.yield();{const o=[.3,.24,.15];for(const[e,d,p,f,c,h]of[[1,31.5,2.6,5.6,2.1,5],[1,39,-2.2,5.3,4.4,4],[1,53,2.8,5.6,7.9,5],[1,22,2.1,5.4,9.3,3],[-1,33,-2.4,5.5,11.3,5],[-1,43,2.5,5.3,14.2,4],[-1,23,2.2,5.5,16.1,3],[1,66,2.5,5.5,17.5,4],[-1,60,2.7,5.6,19.9,5]]){const l=e*d,v=l-p/2,g=-30+6*h,a=c0+V0*(h-1),s=a-.42,r=a+(h===5?2.8:.75);M0.add([v,g+.45,s],[p,0,0],[0,1,0],[0,0,-1],o,[c,f,3,.3]);for(const i of[v,v+p])V.beam(l,g+.95,r,i,g+.6,a+.1,.13,o,n.PLAIN),V.beam(i,g+.6,a+.1,i,g+.45,s,.13,o,n.PLAIN);V.lathe(l,r,[[g,.42],[g+.25,.42],[g+.3,.3],[g+.85,.27],[g+.95,.45],[g+1.08,.4],[g+1.12,.05]],7,Yt,n.PLAIN,{sd:.6})}}await w.yield();{const d=[-4200,-27,4200,4200,-27,4200,4200,-27,Zt,-4200,-27,Zt,-4200,-27,Zt,P0,-27,Zt,P0,-27,-4200,-4200,-27,-4200],p=new M.BufferGeometry;p.setAttribute("position",new M.Float32BufferAttribute(d,3)),p.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);const f=new M.Mesh(p,O0(Ye,Qe(R0)));f.frustumCulled=!1,f.matrixAutoUpdate=!1,X.add(f)}const xe=[];{const o=w0(),e=Q==="drifter",d=e?7.5:4.6,p=e?2.3:1.55,f=[-1,-.82,-.5,0,.5,.85,1].map(x=>{const m=p*Math.pow(Math.max(1-Math.pow(Math.abs(x),e?2.6:2.2),0),.6)+.04;return{z:x*d,w:m,sheer:.95+.55*x*x+(x>0?.35*x*x:0),keel:-.75+.5*Math.pow(Math.abs(x),3)}}),c=[1,1,1],h=[.3,.24,.16];for(let x=0;x<f.length-1;x++){const m=f[x],b=f[x+1];for(const k of[-1,1]){const F=[k*m.w,m.sheer,m.z],L=[k*b.w,b.sheer,b.z],D=[k*m.w*.72,m.keel*.35,m.z],R=[k*b.w*.72,b.keel*.35,b.z],U=[0,m.keel,m.z],Z=[0,b.keel,b.z];o.quad(D,R,L,F,c,0),o.quad(U,Z,R,D,[.5,.16,.1],n.PLAIN),o.quad([k*m.w,m.sheer+.07,m.z],[k*b.w,b.sheer+.07,b.z],[k*b.w*.86,b.sheer+.07,b.z],[k*m.w*.86,m.sheer+.07,m.z],[.5,.4,.25],n.PLAIN)}o.quad([-m.w*.86,m.sheer-.25,m.z],[-b.w*.86,b.sheer-.25,b.z],[b.w*.86,b.sheer-.25,b.z],[m.w*.86,m.sheer-.25,m.z],h,n.PLAIN)}const l=[.42,.31,.18],v=Q==="lateen"?[.74,.68,.55]:[.4,.17,.1];e?(o.box(0,2,-1.6,1.25,1,1.5,[.75,.72,.64],n.PLAIN,{top:[.3,.3,.32]}),o.lathe(0,.6,[[1.1,.42],[4.6,.4],[4.7,.44],[4.9,.44]],8,[.08,.08,.09],n.PLAIN,{cols:[[.08,.08,.09],[.6,.12,.08],[.08,.08,.09],[.08,.08,.09]]}),o.beam(0,.9,4.6,0,8.3,4.4,.08,l,n.PLAIN),o.beam(0,.9,-5.4,0,6.6,-5.6,.07,l,n.PLAIN),o.tri([.02,2.2,-5.5],[.02,6.3,-5.6],[.2,2,-8.2],v,1),o.tri([.2,2,-8.2],[.02,6.3,-5.6],[.02,2.2,-5.5],v,1),o.beam(0,2.4,4.4,0,3.4,.9,.05,l,n.PLAIN)):(o.beam(0,.7,.9,0,8.4,.5,.075,l,n.PLAIN),o.beam(0,2.6,4.2,0,9.6,-3.4,.055,l,n.PLAIN),o.tri([.02,2.75,4.1],[.02,9.45,-3.3],[.25,1.7,-3.9],v,1),o.tri([.25,1.7,-3.9],[.02,9.45,-3.3],[.02,2.75,4.1],v,1),o.box(0,1,-1.2,1.1,.05,.16,l,n.PLAIN),o.box(0,1,1.9,.95,.05,.16,l,n.PLAIN),o.box(.3,1.25,-2.3,.45,.22,.6,[.55,.42,.2],n.PLAIN));const g=o.mesh(null),a=g.geometry,s=14,r=new Float32Array(s*4),i=new Float32Array(s*3),u=["#3E6FA8","#EEF1F4","#C8643C","#3F6B4F","#E9C98A","#8FD3E8","#EEF1F4"].map(x=>$(x,.78)),z=[[18.6,219],[-18.2,216],[78,268],[-88,222],[14,318],[150,240],[-150,300],[230,215],[-60,340],[110,345]];await w.yield();for(let x=0;x<s;x++){const m=z[x]||[t.range(-420,520),t.range(430,900)],b=t.range(-6,6),k=t.range(-6,6),F=m[0]+(x<2?b*.15:b),L=m[1]+(x<2?k*.3:k),D=t.range(-.5,.5)+(t.chance(.3)?Math.PI:0)+.5,R=x<2?x?.06:Math.PI-.05:D;if(r.set([F,L,R,t()*.98+(x<2?2:0)],x*4),i.set(u[(x*3+1)%u.length],x*3),e&&x<6){const U=x<2?2:1;xe.push([F+Math.sin(R)*.6*U,-27+5.3*U*(U>1?1.4:1),L+Math.cos(R)*.6*U])}}const I=new M.InstancedBufferGeometry;for(const x of["position","normal","color","aM"])I.setAttribute(x,a.attributes[x]);I.setIndex(a.index),I.setAttribute("aB",new M.InstancedBufferAttribute(r,4)),I.setAttribute("aT",new M.InstancedBufferAttribute(i,3)),I.instanceCount=s;const y=O0(`
#include <common>
#include <fog_pars_vertex>
attribute vec3 color; attribute vec4 aM; attribute vec4 aB; attribute vec3 aT;
uniform float uTime;
varying vec3 vCol, vN, vP;
void main(){
  float ph = fract(aB.w) * 6.283;
  float roll = sin(uTime * .9 + ph) * .08, pitch = sin(uTime * .7 + ph * 1.7) * .045;
  vec3 p = position * (1. + .5 * floor(aB.w)), n = normal;
  p.y *= 1. + .2 * floor(aB.w);                      // the two boats in the gateway carry taller masts and funnels
  if (aM.x > .5 && aM.x < 1.5) p.x += sin(p.y * .7 + p.z * .5 - uTime * 2.2 + ph) * .22 * smoothstep(1.5, 5., p.y);      // the sail fills and slackens
  p = vec3(p.x * cos(roll) - p.y * sin(roll), p.x * sin(roll) + p.y * cos(roll), p.z);
  n = vec3(n.x * cos(roll) - n.y * sin(roll), n.x * sin(roll) + n.y * cos(roll), n.z);
  p = vec3(p.x, p.y * cos(pitch) - p.z * sin(pitch), p.y * sin(pitch) + p.z * cos(pitch));
  float c = cos(aB.z), s = sin(aB.z);
  p = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); n = vec3(c * n.x + s * n.z, n.y, -s * n.x + c * n.z);
  p += vec3(aB.x + sin(uTime * .23 + ph) * .7, -27. + sin(uTime * .8 + ph * .6) * .22, aB.y + cos(uTime * .19 + ph) * .7);
  vCol = aM.x < .5 ? color * aT : color; vN = n; vP = p;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ze(R0),{},{side:M.DoubleSide}),N=new M.Mesh(I,y);N.frustumCulled=!1,N.matrixAutoUpdate=!1,X.add(N),a.dispose()}for(const o of[V,at,r0,St])await w.yield(),X.add(await o.meshAsync(H0,()=>w.yield()));await w.yield(),X.add(M0.build(Pe(6,5),ue)),await w.yield(),X.add(pe.build(Pe(1,1),ue)),await w.yield(),await w.yield();const Be={uSize:{value:_==="doves"?2.1:2.4}};{const o=w0(),e=new M.Vector3,d=[],p=[.4,.28,.16];for(let y=.648;y<=.7125;y+=.008){C0.pointAt(y,e);const N=Math.hypot(e.x,e.z),x=(N-5.5)/N,m=(N-7.3)/N;d.push({x:e.x*x,z:e.z*x,xi:e.x*m,zi:e.z*m,y:e.y-10.5,u:y})}d.forEach((y,N)=>{const x=S(p,t,.15);if(o.beam(y.x,-30,y.z,y.x,y.y+1.15,y.z,.1,x,n.WOOD,{sd:t()}),o.beam(y.xi,-30,y.zi,y.xi,y.y+.1,y.zi,.1,x,n.WOOD,{sd:t()}),N%2===0&&y.y>-22&&o.beam(y.x,y.y-7,y.z,y.xi,y.y,y.zi,.07,x,n.WOOD,{sd:t()}),!N)return;const m=d[N-1];if(o.beam(m.x,m.y+1.1,m.z,y.x,y.y+1.1,y.z,.075,x,n.WOOD,{sd:t()}),o.beam(m.x,m.y+.55,m.z,y.x,y.y+.55,y.z,.05,x,n.WOOD,{sd:t()}),t.chance(.8))for(let b=0;b<5;b++){const k=(b+.5)/5,F=m.x+(m.xi-m.x)*k,L=m.z+(m.zi-m.z)*k,D=y.x+(y.xi-y.x)*k,R=y.z+(y.zi-y.z)*k;t.chance(.88)&&o.beam(F,m.y+.04,L,D,y.y+.04,R,.03,S([.47,.385,.26],t,.18),n.WOOD,{sd:t(),v1:.3})}});{const k=[.47,.385,.26],F=[[-1,-1],[1,-1],[1,1],[-1,1]],L=(D,R)=>{const U=(R- -30)/14.6,Z=1.7*(1.3-.3*U);return[11.5+F[D][0]*Z,68+F[D][1]*Z]};for(let D=0;D<4;D++){const R=L(D,-30),U=L(D,-30+14.6+1.15);o.beam(R[0],-30,R[1],U[0],-30+14.6+1.15,U[1],.11,S(p,t,.15),n.WOOD,{sd:t()})}for(let D=1;D<=3;D++)for(let R=0;R<4;R++){const U=-30+D*14.6/3,Z=L(R,U),rt=L((R+1)%4,U),Tt=L((R+1)%4,U-14.6/3+.3);o.beam(Z[0],U,Z[1],rt[0],U,rt[1],.075,S(p,t,.15),n.WOOD,{sd:t()}),(D+R)%2===0&&o.beam(Z[0],U,Z[1],Tt[0],U-14.6/3+.3,Tt[1],.06,S(p,t,.15),n.WOOD,{sd:t()})}for(let D=0;D<8;D++)o.box(11.5+t.range(-.08,.08),-30+14.6+.1,68-1.7-.2+(D+.5)*(2*1.7+.4)/8,1.7+.35,.035,.2,S(k,t,.16),n.WOOD,{sd:t(),bottom:!0});for(let D=0;D<3;D++){const R=L(D,-15.4),U=L(D+1,-30+14.6);o.beam(R[0],-30+14.6+1.1,R[1],U[0],-30+14.6+1.1,U[1],.055,S(p,t,.15),n.WOOD,{sd:t()})}for(const D of[-.26,.26])o.beam(11.5-1.7*1.3-.5,-30,68+D,11.5-1.7-.1,-30+14.6+.9,68+D,.045,p,n.WOOD);for(let D=1;D<30;D++){const R=D/30;o.beam(11.5-1.7*1.3-.5+(1.7*.3+.4)*R,-30+(14.6+.9)*R,68-.26,11.5-1.7*1.3-.5+(1.7*.3+.4)*R,-30+(14.6+.9)*R,68+.26,.03,p,n.WOOD)}o.lathe(11.5+.5,68-.4,[[-30+14.6+.14,.3],[-30+14.6+1.1,.42],[-30+14.6+1.1,.36],[-30+14.6+1,0]],8,[.47,.52,.57],n.PLAIN,{cols:[[.4,.44,.5],[.5,.55,.6],[.2,.22,.25],$("#8FD3E8",.9)]}),o.box(11.5-.6,-30+14.6+.3,68+.7,.45,.16,.3,[.6,.59,.55],n.PLAIN,{yaw:.4})}X.add(o.mesh(H0));{const N=Ee,x=N.length/4,m=w0(),b=j0("moon-yard-gear:"+w.seed),k=[],F=[];for(let xt=0;xt<160;xt++)k.push([b(),b(),b(),b(),b(),b(),b()]);const L=[At[0]*.95,At[1]*.95,At[2]*.95],D=1/Math.max(kt.y,.15),R=[.47,.385,.26],U=(xt,Rt,Xt,_t,ht,Gt,Ut,o0,J,Wt=1,it=.26)=>{const Ft=Math.cos(Ut),jt=Math.sin(Ut),Ot=(Y,Et,dt)=>[xt+Y*Ft+dt*jt,Rt+Et,Xt-Y*jt+dt*Ft],f0=Ot(-_t,-ht,Gt),Vt=Ot(_t,-ht,Gt),$t=Ot(_t,-ht,-Gt),h0=Ot(-_t,-ht,-Gt),i0=Ot(-_t,ht,Gt),Nt=Ot(_t,ht,Gt),ft=Ot(_t,ht,-Gt),bt=Ot(-_t,ht,-Gt),H={sd:J,u0:0,u1:2*Gt,v0:.03,v1:.29},pt=[o0[0]*1.5,o0[1]*1.5,o0[2]*1.45];m.quad(Vt,$t,ft,Nt,o0,n.WOOD,H),m.quad(h0,f0,i0,bt,o0,n.WOOD,H),Wt&&m.quad(Nt,ft,bt,i0,o0,n.WOOD,{sd:J,u0:0,u1:2*Gt,v0:.03,v1:.03+it}),m.quad(f0,Vt,Nt,i0,pt,n.PLAIN,{sd:J}),m.quad($t,h0,bt,ft,pt,n.PLAIN,{sd:J})},Z=.25,rt=Math.ceil(2*t0/Z),Tt=Math.ceil((c0-n0)/Z),m0=new Uint8Array(rt*Tt),A0=-30+2.6,v0=(xt,Rt)=>{const Xt=Math.floor((xt+t0)/Z),_t=Math.floor((Rt-n0)/Z);Xt>=0&&Xt<rt&&_t>=0&&_t<Tt&&(m0[_t*rt+Xt]=1)},x0=(xt,Rt,Xt,_t,ht,Gt,Ut)=>{if(Rt>Ut&&ht>Ut)return;const o0=Rt>Ut?(Rt-Ut)/(Rt-ht):0,J=ht>Ut?(Ut-Rt)/(ht-Rt):1,Wt=_t-xt,it=Gt-Xt,Ft=Math.ceil(Math.hypot(Wt,it)*(J-o0)/.2);for(let jt=0;jt<=Ft;jt++){const Ot=Ft?o0+(J-o0)*jt/Ft:o0;v0(xt+Wt*Ot,Xt+it*Ot)}};{const xt=St.positions,Rt=St.indices;for(let J=0;J<Rt.length;J+=3){J%9e3===0&&await w.yield();for(let Wt=0;Wt<3;Wt++){const it=Rt[J+Wt]*3,Ft=Rt[J+(Wt+1)%3]*3;xt[it+1]>-1||xt[Ft+1]>-1||x0(xt[it],xt[it+1],xt[it+2],xt[Ft],xt[Ft+1],xt[Ft+2],0)}}for(const J of k0.bollards)if(!(J.position.y-K0>-1))for(let Wt=-.5;Wt<=.5;Wt+=Z)for(let it=-.5;it<=.5;it+=Z)v0(J.position.x+Wt,J.position.z+it);const Xt=new M.Matrix4,_t=new M.Matrix4,ht=new M.Vector3,Gt=[];Lt.object.traverse(J=>{J.isInstancedMesh&&J.geometry.attributes.aFx&&Gt.push(J)});for(const J of Gt){const Wt=J.geometry.attributes.position,it=J.geometry.index,Ft=Wt.count,jt=it?it.count:Ft,Ot=new Float32Array(Ft*3),f0=[1e9,1e9,1e9],Vt=[-1e9,-1e9,-1e9];for(let $t=0;$t<Ft;$t++)ht.fromBufferAttribute(Wt,$t),f0[0]=Math.min(f0[0],ht.x),f0[1]=Math.min(f0[1],ht.y),f0[2]=Math.min(f0[2],ht.z),Vt[0]=Math.max(Vt[0],ht.x),Vt[1]=Math.max(Vt[1],ht.y),Vt[2]=Math.max(Vt[2],ht.z);for(let $t=0;$t<J.count;$t++){$t%256===0&&await w.yield(),Xt.fromArray(J.instanceMatrix.array,$t*16),_t.multiplyMatrices(J.matrixWorld,Xt);const h0=_t.elements;let i0=h0[13];for(let Nt=0;Nt<3;Nt++)i0+=Math.min(h0[Nt*4+1]*f0[Nt],h0[Nt*4+1]*Vt[Nt]);if(!(i0>A0)){for(let Nt=0;Nt<Ft;Nt++)ht.fromBufferAttribute(Wt,Nt).applyMatrix4(_t),Ot[Nt*3]=ht.x,Ot[Nt*3+1]=ht.y,Ot[Nt*3+2]=ht.z;for(let Nt=0;Nt<jt;Nt+=3)for(let ft=0;ft<3;ft++){const bt=(it?it.getX(Nt+ft):Nt+ft)*3,H=(it?it.getX(Nt+(ft+1)%3):Nt+(ft+1)%3)*3;x0(Ot[bt],Ot[bt+1],Ot[bt+2],Ot[H],Ot[H+1],Ot[H+2],A0)}}}}for(const J of k0.hoists)for(let Wt=-1.25;Wt<=1.25;Wt+=Z)for(let it=-1.25;it<=1.25;it+=Z)v0(J.position.x+Wt,J.position.z+it);const Ut=o.positions,o0=o.indices;for(let J=0;J<o0.length;J+=3)for(let Wt=0;Wt<3;Wt++){const it=o0[J+Wt]*3,Ft=o0[J+(Wt+1)%3]*3;x0(Ut[it],Ut[it+1],Ut[it+2],Ut[Ft],Ut[Ft+1],Ut[Ft+2],A0)}}for(let xt=0;xt<z0.length;xt+=4){const Rt=Math.max(0,Math.floor((z0[xt]+t0)/Z)),Xt=Math.min(rt-1,Math.floor((z0[xt+1]+t0)/Z)),_t=Math.max(0,Math.floor((z0[xt+2]-n0)/Z)),ht=Math.min(Tt-1,Math.floor((z0[xt+3]-n0)/Z));for(let Gt=_t;Gt<=ht;Gt++)for(let Ut=Rt;Ut<=Xt;Ut++)m0[Gt*rt+Ut]=1}for(let xt=0;xt<k.length;xt++){xt%16===0&&await w.yield();const[Rt,Xt,_t,ht,Gt,Ut,o0]=k[xt],J=ht<.4?0:ht<.7?1:2,Wt=.82+.36*o0,it=P=>{const et=Math.sin((P+1)*12.9898+o0*78.233)*43758.5453;return et-Math.floor(et)},Ft=J===0?1+Math.floor(Ut*3):J===1?4+Math.floor(Ut*5):5+Math.floor(Ut*8),jt=Ut*(J===0?3:J===1?5:8)%1,Ot=J===0?3.6+1.4*jt:J===1?6+3*jt:3.6+1.2*jt,f0=Ft<6?2:3,Vt=J===0?Ot/2:J===1?Ft*.25+.15:.65,$t=Ot/2,h0=J===0?.8*Ft:J===1?.3+.42*f0:.16*Ft,i0=Math.hypot(Vt,$t),Nt=(Gt<.5?0:Math.PI/2)+(Gt*2%1-.5)*.3,ft=Math.cos(Nt),bt=Math.sin(Nt),H=(Xt<.5?-1:1)*(14+i0+Rt*(t0-19-2*i0)),pt=n0+5+i0+_t*(c0-n0-10-2*i0);let Y=!0;for(let P=0;P<x&&Y;P++){const et=N[P*4]-H,Mt=N[P*4+1]-pt;Math.hypot(Math.max(Math.abs(et*ft-Mt*bt)-Vt,0),Math.max(Math.abs(et*bt+Mt*ft)-$t,0))<2.5&&(Y=!1)}for(const P of F)Math.hypot(P[0]-H,P[1]-pt)<P[2]+i0+.6&&(Y=!1);if(!Y)continue;F.push([H,pt,i0,h0]);const Et=(P,et)=>[H+P*ft+et*bt,pt-P*bt+et*ft];for(let P=-Vt-.6;P<=Vt+.6&&Y;P+=.17)for(let et=-$t-.6;et<=$t+.6;et+=.17){const Mt=Et(P,et),ot=Math.floor((Mt[0]+t0)/Z),qt=Math.floor((Mt[1]-n0)/Z);if(ot>=0&&ot<rt&&qt>=0&&qt<Tt&&m0[qt*rt+ot]){Y=!1;break}}if(!Y)continue;if(J===0)for(let P=0;P<Ft;P++)for(let et=-1;et<=1;et++){const Mt=P*3+et+1,ot=et*(Ot/2-.4),qt=P%2?Et(0,ot):Et(ot,0),wt=Wt*(.84+.32*it(Mt));U(qt[0],-30+.4+.8*P,qt[1],.4,.4,Ot/2-.12*it(Mt+40),Nt+(P%2?Math.PI/2:0)+(it(Mt+80)-.5)*.04,[s0[0]*wt,s0[1]*wt,s0[2]*wt],it(Mt+120))}else if(J===1){for(const P of[-1,1]){const et=Et(0,P*Ot*.3);U(et[0],-30+.15,et[1],.15,.15,Vt,Nt+Math.PI/2,[s0[0]*Wt*.8,s0[1]*Wt*.8,s0[2]*Wt*.8],it(P+300))}for(let P=0,et=0;P<f0;P++)for(let Mt=0;Mt<Ft-P;Mt++,et++){const ot=Et((Mt-(Ft-P-1)/2)*.5,(it(et+40)-.5)*.5),qt=Wt*1.45*(.84+.32*it(et));U(ot[0],-30+.51+.42*P,ot[1],.2,.2,Ot/2*(.94+.06*it(et+80)),Nt+(it(et+160)-.5)*.02,[s0[0]*qt,s0[1]*qt,s0[2]*qt],it(et+120))}}else{U(H,-30+h0/2-.03,pt,Vt-.1,h0/2-.03,$t-.3,Nt,[.09,.07,.05],.5,0);for(let P=0;P<Ft;P++){const et=Et((it(P+40)-.5)*.06,(it(P)-.5)*.24),Mt=Wt*(.84+.32*it(P+80));U(et[0],-30+.115+.16*P,et[1],Vt,.045,$t*(.96+.04*it(P+120)),Nt+(it(P+160)-.5)*.03,[R[0]*Mt,R[1]*Mt,R[2]*Mt],it(P+200),P===Ft-1?1:0,2*Vt)}}const dt=-kt.x*D*h0,Pt=-kt.z*D*h0,tt=[Et(-Vt,$t),Et(Vt,$t),Et(Vt,-$t),Et(-Vt,-$t)],mt=P=>[P[0],-30+.04,P[1]],gt=P=>[P[0]+dt,-30+.04,P[1]+Pt];m.quad(mt(tt[0]),mt(tt[1]),mt(tt[2]),mt(tt[3]),L,n.GROUND,{l:-1}),m.quad(gt(tt[0]),gt(tt[1]),gt(tt[2]),gt(tt[3]),L,n.GROUND,{l:-1});for(let P=0;P<4;P++)m.quad(mt(tt[P]),mt(tt[(P+1)%4]),gt(tt[(P+1)%4]),gt(tt[P]),L,n.GROUND,{l:-1})}{const Ft=14.854999999999999+2*Z,jt=Lt.object.position.x+k0.keel.x,Ot=Lt.object.position.z+k0.keel.z,f0=m0.slice(),Vt=(ft,bt)=>{const H=Math.floor((ft+t0)/Z),pt=Math.floor((bt-n0)/Z);H>=0&&H<rt&&pt>=0&&pt<Tt&&(f0[pt*rt+H]=1)},$t=(ft,bt,H)=>{const pt=Math.max(1,Math.ceil(Math.hypot(ft[0],ft[2])*(H[0]-bt[0])/.2)),Y=Math.max(1,Math.ceil(Math.hypot(ft[4],ft[6])*(H[1]-bt[1])/.2)),Et=Math.max(1,Math.ceil(Math.hypot(ft[8],ft[10])*(H[2]-bt[2])/.2));for(let dt=0;dt<=pt;dt++)for(let Pt=0;Pt<=Y;Pt++)for(let tt=0;tt<=Et;tt++){const mt=bt[0]+(H[0]-bt[0])*dt/pt,gt=bt[1]+(H[1]-bt[1])*Pt/Y,P=bt[2]+(H[2]-bt[2])*tt/Et,et=ft[0]*mt+ft[4]*gt+ft[8]*P+ft[12],Mt=ft[2]*mt+ft[6]*gt+ft[10]*P+ft[14];Math.abs(et-jt)<Ft&&Vt(et,Mt)}};{const ft=new M.Matrix4,bt=new M.Matrix4,H=new M.Vector3,pt=[];Lt.object.traverse(dt=>{dt.isInstancedMesh&&dt.geometry.attributes.aFx&&dt.parent!==Lt.moon&&pt.push(dt)});for(const dt of pt){const Pt=dt.geometry.attributes.position,tt=[1e9,1e9,1e9],mt=[-1e9,-1e9,-1e9];for(let gt=0;gt<Pt.count;gt++)H.fromBufferAttribute(Pt,gt),tt[0]=Math.min(tt[0],H.x),tt[1]=Math.min(tt[1],H.y),tt[2]=Math.min(tt[2],H.z),mt[0]=Math.max(mt[0],H.x),mt[1]=Math.max(mt[1],H.y),mt[2]=Math.max(mt[2],H.z);for(let gt=0;gt<dt.count;gt++){gt%256===0&&await w.yield(),ft.fromArray(dt.instanceMatrix.array,gt*16),bt.multiplyMatrices(dt.matrixWorld,ft);const P=bt.elements;let et=P[12]-jt,Mt=0,ot=P[14]-Ot,qt=0;for(let wt=0;wt<3;wt++)et+=P[wt*4]*(tt[wt]+mt[wt])/2,Mt+=Math.abs(P[wt*4])*(mt[wt]-tt[wt])/2,ot+=P[wt*4+2]*(tt[wt]+mt[wt])/2,qt+=Math.abs(P[wt*4+2])*(mt[wt]-tt[wt])/2;Math.abs(et)-Mt>Ft||Math.hypot(Math.abs(et)+Mt,Math.abs(ot)+qt)<80-.6-2*Z||$t(P,tt,mt)}}const Y=m.positions,Et=m.indices;for(let dt=0;dt<Et.length;dt+=3)for(let Pt=0;Pt<3;Pt++){const tt=Et[dt+Pt]*3,mt=Et[dt+(Pt+1)%3]*3;if(Y[tt+1]<-30+.1&&Y[mt+1]<-30+.1||Math.min(Y[tt],Y[mt])-jt>Ft||Math.max(Y[tt],Y[mt])-jt<-Ft)continue;const gt=Y[mt]-Y[tt],P=Y[mt+2]-Y[tt+2],et=Math.ceil(Math.hypot(gt,P)/.2);for(let Mt=0;Mt<=et;Mt++){const ot=et?Mt/et:0;Vt(Y[tt]+gt*ot,Y[tt+2]+P*ot)}}}const h0=(ft,bt,H,pt,Y)=>{if(Y&&c0-(bt+pt)<2*lt||Math.hypot(Math.max(Math.abs(ft-jt)-H,0),Math.max(Math.abs(bt-Ot)-pt,0))<=80)return!1;const Et=Math.max(0,Math.floor((ft-H-.6+t0)/Z)),dt=Math.min(rt-1,Math.floor((ft+H+.6+t0)/Z)),Pt=Math.max(0,Math.floor((bt-pt-.6-n0)/Z)),tt=Math.min(Tt-1,Math.floor((bt+pt+.6-n0)/Z));for(let mt=Pt;mt<=tt;mt++)for(let gt=Et;gt<=dt;gt++)if(f0[mt*rt+gt])return!1;for(let mt=0;mt<x;mt++)if(Math.hypot(Math.max(Math.abs(N[mt*4]-ft)-H,0),Math.max(Math.abs(N[mt*4+1]-bt)-pt,0))<2.5)return!1;return!0},i0=Math.ceil((n0+2.9+.6-Ot)/7),Nt=Math.floor((c0-2.9-.6-Ot)/7);await w.yield();{const ft=j0("moon-keel-line:"+w.seed),bt=.6,H=.95,pt=Math.floor((8-bt-.5)/H),Y=4+pt*12+2,Et=dt=>{const Pt=.8+.4*dt;return[.215*Pt,.15*Pt,.092*Pt]};for(let dt=i0;dt<=Nt;dt++){const Pt=Ot+7*dt,tt=[];for(let Kt=0;Kt<Y;Kt++)tt.push(ft());if(!h0(jt,Pt,4.345,2.9,!1))continue;let mt=0;const gt=()=>tt[mt++];for(const Kt of[-1,1])U(jt+Kt*2.9,-30+.3,Pt,.35,.3,2.9,0,Et(gt()),gt());for(let Kt=0;Kt<pt;Kt++){const be=-30+bt+(Kt+.5)*H,oe=Kt/pt;if(Kt%2===0)for(const ce of[-1,0,1])U(jt+(gt()-.5)*.24,be,Pt+ce*(2.05-.75*oe),.4,H/2-.02,(8.2-3.6*oe)/2+(gt()-.5)*.25,Math.PI/2,Et(gt()),gt());else for(const ce of[-1,0,1])U(jt+ce*(2.9-1.5*oe),be,Pt+(gt()-.5)*.2,.4,H/2-.02,(5.6-1.9*oe)/2+(gt()-.5)*.2,0,Et(gt()),gt())}const P=bt+pt*H;U(jt,-30+(P+8)/2,Pt,.75,(8-P)/2,1.5,Math.PI/2,Et(gt()),gt());const et=(pt-1)/pt,Mt=(pt-1)%2?2.9-1.5*et+.4:(8.2-3.6*et)/2,ot=(pt-1)%2?(5.6-1.9*et)/2:2.05-.75*et+.4,qt=-kt.x*D*8,wt=-kt.z*D*8,Jt=[[-1,1],[1,1],[1,-1],[-1,-1]],L0=Kt=>[jt+Kt[0]*4.1,-30+.04,Pt+Kt[1]*2.9],S0=Kt=>[jt+Kt[0]*Mt+qt,-30+.04,Pt+Kt[1]*ot+wt];m.quad(L0(Jt[0]),L0(Jt[1]),L0(Jt[2]),L0(Jt[3]),L,n.GROUND,{l:-1}),m.quad(S0(Jt[0]),S0(Jt[1]),S0(Jt[2]),S0(Jt[3]),L,n.GROUND,{l:-1});for(let Kt=0;Kt<4;Kt++)m.quad(L0(Jt[Kt]),L0(Jt[(Kt+1)%4]),S0(Jt[(Kt+1)%4]),S0(Jt[Kt]),L,n.GROUND,{l:-1})}}await w.yield();{const ft=j0("moon-staging:"+w.seed),bt=74,H=14.6,pt=1.7,Y=-30;for(let Et=i0+(i0%2+2)%2;Et<=Nt;Et+=2)for(const dt of[-1,1]){const Pt=Ot+7*Et,tt=jt+dt*(9+2.5),mt=[];for(let ot=0;ot<bt;ot++)mt.push(ft());if(!h0(tt,Pt,2.755,2.32,!0))continue;let gt=0;const P=()=>mt[gt++],et=[[-dt,-1],[dt,-1],[dt,1],[-dt,1]],Mt=(ot,qt)=>{const wt=(qt-Y)/H,Jt=pt*(1.3-.3*wt);return[tt+et[ot][0]*Jt,Pt+et[ot][1]*Jt]};for(let ot=0;ot<4;ot++){const qt=Mt(ot,Y),wt=Mt(ot,Y+H+1.15);m.beam(qt[0],Y,qt[1],wt[0],Y+H+1.15,wt[1],.11,S(p,P,.15),n.WOOD,{sd:P()})}for(let ot=1;ot<=3;ot++)for(let qt=0;qt<4;qt++){const wt=Y+ot*H/3,Jt=Mt(qt,wt),L0=Mt((qt+1)%4,wt),S0=Mt((qt+1)%4,wt-H/3+.3);m.beam(Jt[0],wt,Jt[1],L0[0],wt,L0[1],.075,S(p,P,.15),n.WOOD,{sd:P()}),(ot+qt)%2===0&&m.beam(Jt[0],wt,Jt[1],S0[0],wt-H/3+.3,S0[1],.06,S(p,P,.15),n.WOOD,{sd:P()})}for(let ot=0;ot<8;ot++)m.box(tt+(P()-.5)*.16,Y+H+.1,Pt-pt-.2+(ot+.5)*(2*pt+.4)/8,pt+.35,.035,.2,S(R,P,.16),n.WOOD,{sd:P(),bottom:!0});for(let ot=0;ot<3;ot++){const qt=Mt(ot,Y+H),wt=Mt(ot+1,Y+H);m.beam(qt[0],Y+H+1.1,qt[1],wt[0],Y+H+1.1,wt[1],.055,S(p,P,.15),n.WOOD,{sd:P()})}for(const ot of[-.26,.26])m.beam(tt-dt*(pt*1.3+.5),Y,Pt+ot,tt-dt*(pt+.1),Y+H+.9,Pt+ot,.045,p,n.WOOD);for(let ot=1;ot<30;ot++){const qt=ot/30,wt=tt-dt*(pt*1.3+.5-(pt*.3+.4)*qt);m.beam(wt,Y+(H+.9)*qt,Pt-.26,wt,Y+(H+.9)*qt,Pt+.26,.03,p,n.WOOD)}m.lathe(tt+dt*.5,Pt-.4,[[Y+H+.14,.3],[Y+H+1.1,.42],[Y+H+1.1,.36],[Y+H+1,0]],8,[.47,.52,.57],n.PLAIN,{cols:[[.4,.44,.5],[.5,.55,.6],[.2,.22,.25],$("#8FD3E8",.9)]})}}}X.add(m.mesh(H0))}const f=w0(),c=_==="doves",h=[.78,.78,.76],l=c?[.74,.74,.73]:[.42,.46,.52],v=c?[.6,.6,.6]:[.05,.05,.06];f.blob(0,0,0,.085,.085,.27,h,t,{seg:6,rows:5,rough:0}),f.blob(0,.075,.27,.058,.058,.075,h,t,{seg:5,rows:4,rough:0}),f.tri([-.022,.07,.33],[.022,.07,.33],[0,.055,.43],[.8,.55,.08],n.PLAIN),f.tri([-.07,.01,-.24],[.07,.01,-.24],[0,0,-.43],h,n.PLAIN);for(const y of[-1,1]){const N=[.09,.3,.52,.7],x=[.21,.2,.13,.03],m=[.04,.05,-.02,-.13];for(let b=0;b<3;b++)f.quad([y*N[b],.03,m[b]-x[b]/2],[y*N[b+1],.03,m[b+1]-x[b+1]/2],[y*N[b+1],.03,m[b+1]+x[b+1]/2],[y*N[b],.03,m[b]+x[b]/2],b===2?v:l,n.PLAIN)}const g=f.mesh(null).geometry,a=20,s=a+6,r=new Float32Array(s*4),i=new Float32Array(s*4),u=new M.Vector3;for(let y=0;y<a;y++){const N=2.4+(y+t.range(.1,.9))/a*(d.length-3.4),x=Math.min(d.length-2,Math.floor(N)),m=N-x,b=d[x],k=d[x+1];C0.tangentAt(b.u,u),r.set([b.x+(k.x-b.x)*m,b.y+(k.y-b.y)*m+1.34,b.z+(k.z-b.z)*m,.636+.006*(y/a)+t.range(0,.007)],y*4),i.set([Math.atan2(u.x,u.z)+t.range(-.45,.45),t.range(12,16.5),t(),t.range(10,14.5)],y*4)}C0.pointAt(.215,e),C0.tangentAt(.215,u),u.y=0,u.normalize();for(let y=0;y<6;y++){const N=y%2?1:-1,x=6.5+y*1.5+t.range(-.5,.5),m=N*t.range(8.5,11.5),b=-N*u.z*.9+u.x*.5,k=N*u.x*.9+u.z*.5;r.set([e.x+u.x*x+u.z*m,e.y-8.6,e.z+u.z*x-u.x*m,.182+.0035*y+t.range(0,.002)],(a+y)*4),i.set([Math.atan2(b,k)+t.range(-.15,.15),t.range(10,13),t(),t.range(12,15.5)],(a+y)*4)}const z=new M.InstancedBufferGeometry;for(const y of["position","normal","color"])z.setAttribute(y,g.attributes[y]);z.setIndex(g.index),z.setAttribute("aG",new M.InstancedBufferAttribute(r,4)),z.setAttribute("aG2",new M.InstancedBufferAttribute(i,4)),z.instanceCount=s;const I=new M.Mesh(z,O0(ao,ze(R0),Be,{side:M.DoubleSide}));I.frustumCulled=!1,I.matrixAutoUpdate=!1,X.add(I)}await w.yield();const _e=A==="night"?"night":{sunDir:C.sun,sunColor:C.sunCol[0],sunIntensity:2.7*C.sunCol[1],sky:C.skyCol[0],skyIntensity:2.6*C.skyCol[1],ground:"#E9C98A",groundIntensity:.6},E0=B0.makeFauna(X,{light:_e}),Q0=_==="doves"?{body:"#ffffff",belly:"#ffffff",wingC:"#f1f1ee",trail:"#ffffff",tip:"#dcdcdc",beak:"#e6a0a0",size:1.25}:{},ge=_==="swifts"?{species:"swifts",size:2.2}:{species:"gulls",...Q0};await w.yield(),E0.add(B0.makeFlock({rng:st.fork("six"),species:"gulls",...Q0,count:6,spread:[5,1.6,7],cross:{path:C0,u:.215,lead:9,span:170,angle:58,side:1,height:.5,duration:43}})),await w.yield(),E0.add(B0.makeFlock({rng:st.fork("wheel"),...ge,count:Math.round(16*nt),center:[-62,4,-52],radius:40,height:12})),await w.yield(),E0.add(B0.makeFlock({rng:st.fork("street"),species:"gulls",...Q0,count:7,spread:[6,2.5,10],along:{path:C0,side:.5,up:6.5,lead:21,from:-.05,to:.15,drift:7}})),await w.yield(),E0.add(B0.makeFlock({rng:st.fork("roofs"),species:"gulls",...Q0,count:5,spread:[3,1.5,6],cross:{path:C0,u:.03,lead:16,span:70,angle:72,side:-1,height:5,duration:43}})),await w.yield(),E0.add(B0.makeFlock({rng:st.fork("harbour"),...ge,count:Math.round(14*nt),center:[8,2,262],radius:58,height:12})),await w.yield();{const o=[],e=[],d=st.fork("puffs");for(const c of te.concat(xe)){const h=Math.round(11*nt),l=d.range(.07,.11),v=d();for(let g=0;g<h;g++)o.push(c[0],c[1],c[2],(v+g/h)%1),e.push(d.range(10,15),l,d.range(2.2,3.4),0)}if(O==="fret"){const c=Math.round(90*nt);for(let h=0;h<c;h++)o.push(d.range(-126,126),d.range(-8,3),d.range(-130,144),d()),e.push(d.range(20,40),d.range(.008,.016),d.range(34,54),1)}{const c=st.fork("sift"),h=Math.round(1e3*nt);for(let s=0;s<h;s++){let r=104*Math.sqrt(c()),i=c.range(0,Math.PI*2);s%3&&(Math.cos(i)*kt.x+Math.sin(i)*kt.z)*r<14&&(i=Math.atan2(kt.z,kt.x)+c.range(-1.15,1.15),r=c.range(30,104));const u=98-Math.sqrt(14400-r*r)-.5+(r>60?0:12),z=u+30;o.push(r*Math.cos(i),u,r*Math.sin(i),c()),e.push(z,c.range(1.1,2.2)/z,c.range(.5,1.15),2)}const l=Math.round(48*nt),v=Math.atan2(kt.z,kt.x);for(let s=0;s<l;s++){const r=s%2===1,i=r?Math.PI/2+c.range(-1.1,1.1):v+c.range(-1.25,1.25),u=r?c.range(84,122):c.range(24,96);o.push(u*Math.cos(i),c.range(-25,-13),u*Math.sin(i),c()),e.push(r?c.range(.04,.075):c.range(.08,.15),c.range(.02,.04),c.range(15,26),3)}const g=Math.round(44*nt),a=kt.x>=0?1:-1;for(let s=0;s<g;s++)o.push(a*c.range(9,66),c.range(-27,-8),c.range(8,122),c()),e.push(c.range(.1,.17),c.range(.02,.04),c.range(12,21),3)}const p=new M.InstancedBufferGeometry;p.setAttribute("position",new M.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),p.setIndex([0,1,2,0,2,3]),p.setAttribute("aS",new M.InstancedBufferAttribute(new Float32Array(o),4)),p.setAttribute("aS2",new M.InstancedBufferAttribute(new Float32Array(e),4)),p.instanceCount=e.length/4;const f=new M.Mesh(p,O0(Je,to,{},{transparent:!0,depthWrite:!1}));f.frustumCulled=!1,f.renderOrder=4,f.matrixAutoUpdate=!1,X.add(f)}if(await w.yield(),O==="fret")for(let o=0;o<2;o++){const e=new M.BufferGeometry,d=-3+o*5.5;e.setAttribute("position",new M.Float32BufferAttribute([-t0,d,n0,t0,d,n0,t0,d,c0,-t0,d,c0],3)),e.setIndex([0,2,1,0,3,2]);const p=new M.Mesh(e,O0(eo,oo(R0),{uLayer:{value:o}},{transparent:!0,depthWrite:!1,side:M.DoubleSide}));p.frustumCulled=!1,p.renderOrder=3,p.matrixAutoUpdate=!1,X.add(p)}await w.yield();const ye=Ue({rng:st.fork("motes"),preset:"dust",time:p0.uTime,count:Math.round(1500*nt),box:[64,34,64],size:[.03,.065],near:[9,20],color:A==="night"?"#aab8d8":"#fff3df",intensity:A==="night"?.5:1});X.add(ye.object),await w.yield(),E0.add(B0.makeFlock({rng:j0(977+(w.seed|0)),species:"gulls",...Q0,count:4,spread:[5,1.6,7],cross:{path:C0,u:.94,lead:46,span:110,angle:74,side:-1,height:2.5,duration:43}})),await w.yield(),await e0.prewarm(w.renderer,null,X);const Re=C.sun[2]<0?-.5:.5;return{scene:X,path:C0,duration:43,pace:o=>1-.27*F0(.44,.5,o)*(1-F0(.6,.66,o))+.16*F0(.26,.31,o)*(1-F0(.38,.44,o))+.1*F0(.66,.72,o)*(1-F0(.82,.88,o)),camera:{fov:62,near:.3,far:3e3,lookAhead:22,sway:.5,bank:.45},pois:[{at:[0,122,0],from:.13,to:.31,weight:.5},{at:[0,165,0],from:.27,to:.4,weight:.5},{at:[k0.seamPoint.x,k0.seamPoint.y-K0,k0.seamPoint.z],from:.45,to:.565,weight:.42},{at:[-12,-4,36],from:.585,to:.7,weight:.62},{at:[4,-15,140],from:.67,to:.8,weight:.5},{at:[0,24,200],from:.775,to:.93,weight:.42}],portal:{shape:"circle",radius:7,color:"#fff0c4",glow:1,revealDistance:260},post:{exposure:C.exposure,bloom:{strength:A==="night"?.5:.3,radius:.35,threshold:1},grade:{saturation:1.08,contrast:1.05,tint:"#fffaf2",shadowTint:"#060d1a",vignette:.24,grain:.02,aberration:0}},ride:"none",update(o,e,d,p){Lt.setProgress(p),Lt.update(o,e,d),e0.update(o,e,d),E0.update(o,e,d,p),ye.update(o,e,d);const f=F0(.022,.05,p)*(1-F0(.1,.13,p));if(g0.head.position.set(g0.pivot.x,g0.pivot.y+.1*f,g0.pivot.z),g0.head.rotation.set(0,Math.PI/2+Re*f+.08*Math.sin(e*.7)*f,-.3*(1-f)),G0.mesh.rotation.z=.5*Math.sin(e*1.9),d0.group){const c=F0(.03,.19,p),h=.1+(Math.PI/2-.1)*c+.4*c*Math.sin(e*.23+.6)+.05*Math.sin(e*.31);d0.group.rotation.set(.035*Math.sin(e*.51),h,.03*Math.sin(e*.37)),d0.group.updateMatrixWorld(!0),d0.c.um.multiplyMatrices(me,d0.c.mesh.matrixWorld),ne.uHang.value.set(d0.group.position.x,d0.group.position.z,Math.cos(h),-Math.sin(h))}},dispose(){Lt.dispose(),e0.dispose?.(),q0.dispose()}}}};export{ho as default};
