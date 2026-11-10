import*as d from"three";import{makePath as aa,clamp as J0,lerp as h0,smoothstep as j0}from"../kit/core.js";import*as g0 from"../kit/interior.js";import*as ee from"../kit/fx.js";import*as Ae from"../kit/fauna.js";import{buildHero as oa,GLSL_LIGHT as ra,GLSL_CURVE as Xe,ZONES as Z0}from"../parts/dragon-kite-loft.js";const L=Math.PI,_0=L*2,t0=d.Vector3,o0=32,b0=16,S0=46,Se=10,f0=-770.6,W0=28,Le=16,Be=49,ue=12,u0=a=>S0-Math.abs(a)*(S0-b0)/o0,te=a=>2-Le*a,j=(a,l,p)=>new d.BoxGeometry(a,l,p),J=(a,l,p,y=8,w=!1)=>new d.CylinderGeometry(a,l,p,y,1,w),n0=(a,l=10,p=8)=>new d.SphereGeometry(a,l,p),U=(a,l,p)=>"#"+new d.Color(a).lerp(new d.Color(l),p).getHexString(),X=(a,l=.3)=>[1.02+l*.95,a,0,1],E0=[.12,0,0,1],d0=[.8,0,0,1],s0=[2.06,0,0,1],he=[3.1,0,0,1],$e=[4.4,0,0,1],ae=[5.1,0,0,1],ve=[6.5,1,0,1],N0=[.9,0,.12,1],w0=a=>[6.5,a,0,1],$="#5c4230",E="#7c5a3a",_="#D9B36A",V="#F4EBD6",r0="#D8381E",C0="#1F8A6B",Z="#E8B93A",Qe="#8FC4F0",Ge="#7d9a4a",oe="#150d09",Ce=`
${ra}
uniform vec4 uHole[${ue}];        // torn or propped panes: centre xyz, radius
uniform vec4 uPool[${ue}];        // their pools on the planks: x, z, radius across, radius along
uniform vec3 uPaperS, uPaperL, uPaperR, uPaperG, uHaze, uShaft, uFlame, uMoon;
uniform float uTime, uLantern, uFront, uEye, uBoost, uKey;
${Xe}
float sq(float x){ return x*x; }
// coverage of a line of half width w by a pixel aa wide at distance d (keeps its weight when thinner than a pixel)
float ln(float d, float w, float aa){ aa = max(aa, 1e-4); return clamp((min(d + aa*.5, w) - max(d - aa*.5, -w))/aa, 0., 1.); }
float fillAA(float d, float aa){ return clamp(.5 - d/max(aa, 1e-4), 0., 1.); }
float roomBars(float z){ return mix(.64 + .36*cos(6.2831853*(z - 10.)/16.), .3 + .95*dkBars(z), uKey); }
// light arriving at p on a surface facing n: every source falls off with distance
vec3 roomLight(vec3 p, vec3 n){
  float sg = uSunDir.x < 0. ? -1. : 1.;
  float dS = max(32. - p.x*sg, 0.), dL = max(32. + p.x*sg, 0.);
  float hS = 1./(1. + dS*dS*.0017), hL = 1./(1. + dL*dL*.0017);
  float a = clamp(n.x*sg*.62 + .38 + n.y*.12, 0., 1.);
  float b = clamp(-n.x*sg*.62 + .38, 0., 1.);
  float g = clamp(-n.z*.6 + .4, 0., 1.);
  float gz = .22 + .78*exp(-max(p.z + 770., 0.)/170.);
  vec3 c = uSun*hS*2.1*a*a + uSky*hL*2.3*b*b;
  c += uRoof*clamp(n.y*.6 + .4, 0., 1.)*(.4 + .6*smoothstep(0., 30., p.y))*roomBars(p.z);
  c += uGable*g*g*gz + uFloor*clamp(-n.y*.5 + .5, 0., 1.)*.9;
  c += uAmb*(.7 + .7*smoothstep(-1., 16., p.y));
  // lantern night: the lit body throws warm light on what it passes
  float sL = DK_Z0 - p.z, dxl = p.x - snakeX(sL), dyl = p.y - eyeY(sL) + 4.3;
  float lit = smoothstep(-9., 5., sL - max(uFront, uEye));
  c = c*uBoost + uFlame*uLantern*lit*1.8*exp(-dxl*dxl/210.)*(.45 + .55*exp(-dyl*dyl/70.));
  // the lantern gallery: under the drying deck the day is shut out and several hundred lanterns light the nave
  float gal = dkGal(p), nave = 1. - .55*smoothstep(15., 23., abs(p.x));
  c = c*mix(1., .11, gal*nave) + uFlame*uGalK*gal*nave*(.2 + .2*clamp(n.y*.5 + .5, 0., 1.) + .16*smoothstep(4., 22., p.y))*(.86 + .14*sin(p.z*.785));
  // the open roof bay: its shaft of sky light on whatever stands in it
  return c + uBayCol*dkBay(p)*clamp(dot(n, uSunDir)*.7 + .3, 0., 1.)*1.5;
}
// the dye room: how far inside it, and the colour of the dye lot hung at this station
float dyeZone(float z){ float s = -6. - z; return smoothstep(${(Z0.dye[0]-6).toFixed(1)}, ${(Z0.dye[0]+6).toFixed(1)}, s)*(1. - smoothstep(${(Z0.dye[1]-6).toFixed(1)}, ${(Z0.dye[1]+4).toFixed(1)}, s)); }
float holeGlow(vec3 p){
  float h = 0.;
  for (int i = 0; i < ${ue}; i++) {
    vec3 d = p - uHole[i].xyz;
    h = max(h, 1. - smoothstep(uHole[i].w*.75, uHole[i].w, length(d)));
  }
  return h;
}
float gust(float z){ return sin(uTime*1.7 + z*.09)*sin(uTime*.83 + z*.031); }
`,na=`
#include <common>
#include <fog_pars_vertex>
attribute float aId;
varying vec3 vPos; varying vec3 vN; varying float vId;
void main(){
  vPos = position; vN = normal; vId = aId;
  vec4 mvPosition = modelViewMatrix*vec4(position, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,sa=`
#include <common>
#include <fog_pars_fragment>
${Ce}
uniform vec3 uTimber, uGold, uCream, uAccA, uAccB, uAccC;
varying vec3 vPos; varying vec3 vN; varying float vId;
vec3 dyeLot(float z){
  float t = (-6. - z - 272.)/8.;
  vec3 c = mix(uCream, uAccC, smoothstep(.4, 1.4, t));
  c = mix(c, uAccA, smoothstep(2.4, 4., t));
  c = mix(c, uAccB, smoothstep(6.4, 7.6, t));
  return c;
}
float lattice(vec2 q, float aa){
  vec2 a = abs(fract(q/1.4) - .5)*1.4;
  float m = ln(min(.7 - a.x, .7 - a.y), .075, aa);
  float mx = max(a.x, a.y);
  m = max(m, ln(abs(mx - .37), .05, aa));
  m = max(m, ln(min(a.x, a.y), .045, aa)*step(.37, mx));
  return mix(m, .38, smoothstep(.5, 1.6, aa));
}
vec3 paper(vec3 base, vec2 q, float z){
  float h = dkH21(floor(q/1.4));
  float m = (.74 + .34*dkVn(q*.33))*(.86 + .26*h);
  m *= 1. - .3*step(.93, h);
  vec3 c = base*m*(1. + .1*gust(z));
  return mix(c, c*vec3(1.05, .9, .68), .5*step(h, .12));
}
vec3 timber(vec3 base, vec2 q, float w){
  float id = floor(q.x/w);
  float h = dkH21(vec2(id, 7.));
  vec3 a = base*(.8 + .55*h)*(.68 + .6*dkVn(vec2(q.x*9./w, q.y*.55 + h*30.)));
  return a*(.9 + .2*dkVn(vec2(q.x*37./w, q.y*2.6)));
}
void main(){
  vec3 p = vPos, n = normalize(vN);
  vec3 V = uCam - p; float dist = length(V); V /= max(dist, 1e-4);
  float fwy = fwidth(p.y), fwx = fwidth(p.x), fwz = fwidth(p.z);
  vec3 col;
  float hole = holeGlow(p), moonK = 0.;
  if (vId < .5) {
    // ---- plank floor: boards along z with staggered butts, wear, shavings, offcuts, pools of sun
    float w = 1.2, row = floor(p.x/w), off = dkH21(vec2(row, 3.))*14.;
    float pl = floor((p.z + off)/14.), h = dkH21(vec2(row, pl));
    float ex = min(fract(p.x/w), 1. - fract(p.x/w))*w, ez = min(fract((p.z + off)/14.), 1. - fract((p.z + off)/14.))*14.;
    float lod = smoothstep(.02, .22, fwx + fwz*.2);
    float gap = max(ln(ex, .035, fwx*1.2), ln(ez, .04, fwz*1.2))*(1. - lod);
    vec3 a = mix(uTimber*1.7, uGold*.62, .25 + .6*h);
    a *= .66 + .62*dkVn(vec2(p.x*7.5, p.z*.42 + h*40.));
    a *= .9 + .2*dkVn(vec2(p.x*31., p.z*2.2));
    float s = -6. - p.z, dxs = p.x - snakeX(max(s, 0.));
    float wear = exp(-dxs*dxs/90.);
    a = mix(a, uGold*.72, wear*.3);
    a *= 1. - .78*gap;
    // curls of shaving, paper offcuts and paste drips
    vec2 c1 = floor(p.xz/.7), f1 = fract(p.xz/.7) - .5;
    float h1 = dkH21(c1 + 11.), nearb = smoothstep(21., 26., abs(p.x)) + wear*.55 + .12;
    float rr = length(f1 - (vec2(dkH21(c1), dkH21(c1 + 5.)) - .5)*.4);
    float curl = ln(abs(rr - .16), .035, fwx*2.)*step(h1, nearb*.5)*step(-.05, f1.y*sin(h1*40.) + f1.x*cos(h1*40.));
    vec2 c2 = floor(p.xz/3.1), f2 = fract(p.xz/3.1) - .5;
    float h2 = dkH21(c2 + 3.7), an = h2*30.;
    vec2 r2 = vec2(f2.x*cos(an) - f2.y*sin(an), f2.x*sin(an) + f2.y*cos(an));
    float scrap = fillAA(max(abs(r2.x) - .1 - .12*h2, abs(r2.y) - .07), fwx)*step(h2, .16);
    float drip = (1. - smoothstep(.05, .1, length(f2 - .2)))*step(.7, h2);
    float farb = 1. - smoothstep(.05, .3, fwx + fwz*.15);
    a = mix(a, uCream*.74, (curl*.85 + scrap*.9)*farb);
    a = mix(a, a*.45, drip*farb);
    a = mix(a, uCream*.4, (1. - farb)*.06*nearb);
    // the dye room: the planks are wet and stained with every lot that has dripped on them
    float dz = dyeZone(p.z); vec3 lot = dyeLot(p.z);
    float stain = smoothstep(.3, .62, dkVn(p.xz*.17 + 7.))*(.5 + .5*dkVn(p.xz*1.3))*dz;
    a = mix(a, a*.45 + lot*.3, stain*.85)*(1. - .25*dz);
    // light: the rig, bars of roof-light, pools, and what stands on the planks
    vec3 L = roomLight(p, vec3(0., 1., 0.));
    float pool = 0.;
    for (int i = 0; i < ${ue}; i++) {
      vec2 d = (p.xz - uPool[i].xy)/max(uPool[i].zw, vec2(.01));
      pool += 1. - smoothstep(.55, 1., length(d));
    }
    float sh = 0.;
    float al = (fract((s - 75.5)/5.8 + .5) - .5)*5.8;
    sh += .5*(1. - smoothstep(1.3, 3.6, abs(dxs)))*(1. - smoothstep(1.4, 2.9, abs(al)))*step(70., s);
    sh += .5*smoothstep(23., 25.5, abs(p.x));
    float pz = (fract((p.z - 2.)/16. + .5) - .5)*16.;
    sh += .55*(1. - smoothstep(.7, 2.6, length(vec2(abs(p.x) - 16., pz))));
    // the sun wall lays a long warm pool down its side of the floor, broken by the window frames
    float sgf = uSunDir.x < 0. ? -1. : 1., wx = 32. - p.x*sgf;
    float kx = abs(uSunDir.x)/max(uSunDir.y, .05), w0 = 7.*kx, w1 = 15.4*kx;
    float wbay = abs(fract((p.z - 2. + uSunDir.z/max(abs(uSunDir.x), .05)*wx)/8. + .5) - .5)*8.;
    float wpool = smoothstep(w0 - 1., w0 + 2.5, wx)*(1. - smoothstep(w1 - 4., w1 + 2., wx))*smoothstep(.3, 1.9, 4. - wbay)*uKey;
    col = a*(L*(1. - min(sh, .8)) + uShaft*2.6*min(pool, 1.) + uSun*wpool*.42*(1. - .6*min(sh, 1.)));
    float fres = 1. - max(V.y, 0.); fres *= fres; fres *= fres;
    col = mix(col, uHaze*.85, fres*(.25 + .2*h)*(1. - dz));
    col = mix(col, lot*(uRoof*.7 + uPaperS*.16 + uAmb), fres*.62*dz);      // the hung silk mirrored in the wet
  } else if (vId < 1.5) {
    // ---- long walls: boarded dado with pinned flat kites, then lattice windows of oiled paper
    float sg = uSunDir.x < 0. ? -1. : 1., sun = step(0., p.x*sg);
    vec2 q = vec2(p.z, p.y);
    if (p.y < 7.) {
      vec3 a = timber(uTimber*1.25, q, 1.);
      a *= 1. - .6*ln(abs(fract(p.z) - .5), .03, fwz)*(1. - smoothstep(.02, .2, fwz));
      vec2 kc = vec2((fract(p.z/2.3) - .5)*2.3, p.y - 5.45), ki = vec2(floor(p.z/2.3), sun);
      float kh = dkH21(ki), kk = dkH21(ki + 9.);
      float dd = kh < .4 ? abs(kc.x) + abs(kc.y) - .95 : (kh < .7 ? length(kc) - .88 : max(abs(kc.x) - .8, abs(kc.y) - .95 + abs(kc.x)*.6));
      float aa = fwz + fwy;
      vec3 kcol = kk < .7 ? uCream*.8 : (kk < .8 ? uAccA : (kk < .9 ? uAccB : uAccC));
      kcol = mix(kcol, uTimber*.3, ln(abs(dd + .1), .035, aa) + ln(min(abs(kc.x), abs(kc.y)), .02, aa)*.6);
      a = mix(a, kcol, fillAA(dd, aa)*step(p.y, 6.6));
      a = mix(a, uGold*.8, ln(abs(p.y - 6.82), .1, fwy));
      col = a*roomLight(p, n)*mix(.45, 1., smoothstep(0., 5., p.y));
    } else if (p.y < 15.4) {
      float aa = max(fwz, fwy);
      float bayz = (fract((p.z - 2.)/8. + .5) - .5)*8.;
      float frame = max(ln(4. - abs(bayz), .34, aa), max(ln(p.y - 7., .28, aa), ln(15.4 - p.y, .3, aa)));
      frame = max(frame, ln(abs(p.y - 11.2), .14, aa));
      float lat = max(lattice(q - vec2(0., .2), aa), frame);
      vec3 base = mix(uPaperL*mix(1.1, .8, (p.y - 7.)/8.4), uPaperS*mix(.74, 1.12, (p.y - 7.)/8.4), sun);
      vec3 pc = paper(base, q, p.z);
      vec3 open = mix(uPaperL, uPaperS, sun)*3.2;
      pc = mix(pc, open, hole*(1. - frame));
      vec3 wood = uTimber*.5*roomLight(p, n);
      col = mix(pc, wood + pc*.16*sun*uKey, lat*(1. - hole*.8)*mix(1., .8, sun*uKey));
    } else {
      col = timber(uTimber, q, 1.)*roomLight(p, n);
    }
  } else if (vId < 2.5) {
    // ---- roof: dark boards on rafters and purlins, bands of paper roof-light in every bay
    float sl = (32. - abs(p.x))*1.3711, zz = fract((p.z - 2.)/16.)*16.;
    float aa = fwz + fwx;
    float band = step(2.6, zz)*step(zz, 13.4)*step(7., sl)*step(sl, 37.);
    float raf = ln(abs(fract(p.z/2.) - .5)*2., .15, fwz);
    float pur = ln(abs(fract(sl/6. + .5) - .5)*6., .26, fwx*1.4);
    float bars = mix(max(raf, pur), .3, smoothstep(.08, .4, aa));
    vec3 wood = timber(uTimber*1.1, vec2(p.z, sl), 2.)*roomLight(p, n);
    float sunSide = step(0., p.x*(uSunDir.x < 0. ? -1. : 1.));
    vec3 pc = paper(mix(uPaperR*mix(vec3(.74, .84, 1.)*.8, vec3(.5, .66, 1.)*.62, uKey), uPaperR*mix(1.12, 1.3, uKey), sunSide), vec2(p.z, sl), p.z);
    pc = mix(pc, uPaperR*3., hole);
    col = mix(wood, mix(pc, wood*.6, bars*(1. - hole)), band);
    // the open bay: shutters swung back, the sky a glare between the rafters
    float bx = p.x*(uSunDir.x < 0. ? -1. : 1.);
    float bo = step(uBay.x, bx)*step(bx, uBay.y)*step(abs(p.z - uBay.z), uBay.w);
    col = mix(col, mix(uBayCol*1.9 + uPaperR*.4, wood*.5, max(raf, pur)*.8), bo);
  } else if (vId < 3.5) {
    // ---- the far gable: heavy framing, a great round window of blue paper and, in its centre, the moon gate (cut out)
    vec2 g = vec2(p.x, p.y - 18.);
    float r = length(g);
    if (r < 8.6) discard;
    float aa = fwx + fwy, ax = abs(p.x);
    float th = atan(g.y, g.x + step(r, 1e-4)*1e-3);
    float moon = step(11.2, r)*step(r, 19.2);
    vec2 mq = vec2(th*14.483, r - 11.2);
    float ml = lattice(mq, aa)*mix(.62, .3, smoothstep(.25, 1.2, aa));      // from far off the lattice melts into the glow
    ml = max(ml, ln(abs(fract(th*1.9098593 + .5) - .5)*r*.5235988, .2, aa));      // twelve heavy spokes
    ml = max(ml, max(ln(r - 15.2, .16, aa), max(ln(r - 11.2, .3, aa), ln(19.2 - r, .3, aa))));
    vec3 mc = uMoon*(.9 + .18*dkVn(mq*.33))*(.93 + .14*dkH21(floor(mq/1.4)))*mix(1.14, .86, (r - 11.2)/8.)*(1. + .08*gust(p.x*3. + 40.));
    float top = 41.2 - ax*.9375;
    float win = step(21.6, ax)*step(ax, 29.4)*step(4.5, p.y)*step(p.y, top);
    float edge = min(min(ax - 21.6, 29.4 - ax), min(p.y - 4.5, top - p.y));
    float lat = max(lattice(p.xy, aa), ln(edge, .4, aa));
    vec3 pc = paper(uPaperG*mix(.78, 1.3, clamp((p.y - 4.5)/16., 0., 1.)), p.xy, p.x*3. + 40.);
    vec3 a = timber(uTimber*1.2, p.xy, 1.3);
    float stud = max(ln(abs(fract(p.x/4. + .5) - .5)*4., .3, aa), ln(abs(fract(p.y/5.2) - .5)*5.2, .26, aa));
    a = mix(a, uTimber*1.9, stud*.6);
    vec3 gl = roomLight(p, n) + uPaperG*.12 + uMoon*.16*exp(-max(r - 19.2, 0.)*.22);
    vec3 wood = a*gl;
    col = mix(wood, mix(pc, uTimber*.4*gl, lat), win);
    col = mix(col, mix(mc, uTimber*.3*gl + mc*.1, ml), moon);
    moonK = moon*(1. - ml*.6);
  } else {
    // ---- the wall behind us: boards and the big door
    vec3 a = timber(uTimber*1.2, p.xy, 1.1);
    float door = step(abs(p.x), 7.)*step(p.y, 15.);
    a = mix(a, uTimber*.7, door*.6);
    a = mix(a, uGold*.6, ln(abs(max(abs(p.x) - 7., p.y - 15.)), .14, fwx + fwy));
    col = a*roomLight(p, n);
  }
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
  gl_FragColor.rgb = mix(gl_FragColor.rgb, col, moonK*.8);      // the blue window punches through the dust
}`,ia=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 color; attribute vec4 surf;
varying vec3 vPos; varying vec3 vObj; varying vec3 vN; varying vec3 vCol; varying vec4 vSurf;
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.);
  vPos = wp.xyz; vObj = position; vN = mat3(modelMatrix)*normal; vCol = color; vSurf = surf;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ca=`
#include <common>
#include <fog_pars_fragment>
${Ce}
uniform vec3 uGold, uGilt, uInk;
uniform float uGlow;
varying vec3 vPos; varying vec3 vObj; varying vec3 vN; varying vec3 vCol; varying vec4 vSurf;
void main(){
  vec3 p = vPos, q = vObj;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  vec3 V = uCam - p; float dist = length(V); V /= max(dist, 1e-4);
  float id = floor(vSurf.x), gloss = fract(vSurf.x);
  float fw = fwidth(q.x) + fwidth(q.y) + fwidth(q.z);
  float fine = 1. - smoothstep(.02, .16, fw);
  vec3 g = vSurf.y < .5 ? q.yzx : (vSurf.y < 1.5 ? q.zxy : q.xyz);
  vec3 a = vCol;
  float thru = 0., rim = .3;
  if (id < .5) {
    a *= .9 + .2*dkVn(q.xy*3. + q.z*2.3);
  } else if (id < 1.5) {
    a *= .64 + .62*dkVn(vec2((g.x + g.y*.7)*5., g.z*.4));
    a *= 1. + .26*(dkVn(vec2((g.x - g.y)*26., g.z*1.8)) - .5)*fine;
    a *= 1. - .35*ln(abs(fract(g.z*.19 + g.x*.07) - .5), .012, fw)*fine;
    rim = 1.;
  } else if (id < 2.5) {
    a *= .84 + .26*dkVn(q.xy*8. + q.z*6.);
    a *= 1. + .12*sin(q.x*55. + q.z*31.)*sin(q.y*55.)*fine;
    thru = .25;
  } else if (id < 3.5) {
    a *= .78 + .32*dkVn(q.xz*1.7 + q.y);
    a *= .92 + .16*dkVn(q.xz*19. + q.y*13.)*fine;
  } else if (id < 4.5) {
    vec2 s = vec2(g.z*1.2 + g.x*.3, g.y*1.45);
    float r = floor(s.y);
    vec2 f = vec2(fract(s.x + .5*mod(r, 2.)) - .5, (fract(s.y) - 1.)*.9);
    float d = length(f), aa = fw*1.6;
    float hh = dkH21(vec2(floor(s.x + .5*mod(r, 2.)), r));
    a *= mix(.62, 1.1, smoothstep(.15, .75, d))*(.88 + .24*hh);
    a = mix(a, uGilt, ln(abs(d - .6), .055, aa)*fine);
    a = mix(a, uInk, ln(abs(d - .7), .03, aa)*fine);
    a = mix(a, uGilt, (1. - smoothstep(.07, .07 + aa, length(f + vec2(0., .32))))*fine*.9);
    a *= .9 + .2*dkVn(q.xy*14. + q.z*9.);
    thru = .3; rim = .6;
  } else if (id < 5.5) {
    a *= .88 + .16*dkVn(q.xy*11. + q.z*7.);
    float ribs = max(ln(abs(fract(g.z/1.15) - .5)*1.15, .035, fw), ln(abs(fract(g.y/.95) - .5)*.95, .03, fw));
    a *= 1. - .45*ribs*fine;
    thru = .6;
  } else {
    float nd = ln(abs(fract(g.z/1.05 + g.x*.13) - .5)*1.05, .03, fw*1.5);
    a *= .8 + .32*dkVn(vec2((g.x + g.y)*4., g.z*.5));
    a = mix(a, a*vec3(.72, .95, .5), .35*dkVn(vec2(g.z*.3, g.x*2.)));
    a = mix(a, a*.32, nd*.75*fine);
    rim = 1.2;
  }
  vec3 L = roomLight(p, N);
  float ao = mix(.5, 1., smoothstep(0., 2.4, p.y));
  vec3 col = a*L*ao + (a*a*1.2 + a*.3)*roomLight(p, -N)*thru;
  float ndv = max(dot(N, V), 0.);
  vec3 R = reflect(-V, N);
  float sg = uSunDir.x < 0. ? -1. : 1.;
  float hS = 1./(1. + sq(max(32. - p.x*sg, 0.))*.0017);
  float mir = smoothstep(.55, .95, gloss);
  col += uSun*dkSpec(N, V, mix(10., 80., gloss))*gloss*(.3 + hS)*.7;
  col += a*(uRoof*max(R.y, 0.) + uGable*sq(max(-R.z, 0.)) + uSun*sq(max(R.x*sg, 0.))*hS*1.5)*mir*.7;
  float fr = 1. - ndv; fr = fr*fr*fr;
  col += uGold*(uSun*(.25 + hS) + uRoof)*.2*fr*rim;
  col += vCol*vSurf.z*uGlow*3.;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,xt=`
attribute vec4 aH; attribute vec4 aI;
uniform float uEye, uTime;
${Xe}
// dn = unit vector from the pivot down the string; returns how hard the kite is being buffeted
float kiteSwing(out vec3 dn){
  float sK = DK_Z0 - aH.z, ph = aI.z;
  float Lp = aH.w + aI.x*.5;
  float w = 2.6/sqrt(max(Lp, 1.));
  float dx = aH.x - snakeX(clamp(sK, 0., 764.));
  float nearb = exp(-dx*dx/170.);
  float d = uEye + 3.5 - sK;
  float moving = smoothstep(70., 100., uEye);
  float pass = step(0., d)*exp(-max(d, 0.)/150.);
  float along = (1. - step(0., d))*moving;
  float gu = .5 + .5*sin(uTime*.9 + aH.z*.03 + ph*.3);
  float amp = .035 + .05*gu + nearb*(.08*along + .26*pass);
  float ax = amp*sin(uTime*w + ph) + nearb*pass*.3*sin(d*.12 + ph);
  float az = amp*.8*sin(uTime*w*.91 + ph*1.7) + (dx < 0. ? -1. : 1.)*nearb*pass*.42*exp(-max(d, 0.)/50.);
  dn = normalize(vec3(az, -1., -.05 - .07*gu - ax));
  return nearb*(along + pass);
}
`,la=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aQ; attribute vec4 aC1; attribute vec3 aC2;
${xt}
varying vec2 vUv; varying vec4 vQ; varying vec3 vN; varying vec3 vPos; varying vec3 vA; varying vec3 vB; varying float vLan;
void main(){
  vec3 dn; float buf = kiteSwing(dn);
  float S = aI.x, yaw = aI.y, ph = aI.z, pt = aI.w, t = aQ.z;
  vec3 Y = -dn, Zb = vec3(sin(yaw), 0., cos(yaw));
  vec3 X = normalize(cross(Y, Zb)), Z = cross(X, Y);
  vec3 p = position*S;
  float cp = cos(pt), sp = sin(pt);
  p.yz = vec2(p.y*cp - p.z*sp, p.y*sp + p.z*cp);
  vec3 nl = vec3(0., -sp, cp);
  float tip = abs(uv.x)*2.;
  p.z += sin(uTime*(3. + buf*4.) + ph + uv.y*5.)*tip*tip*S*(.035 + .05*buf);
  vec3 wl = aH.xyz + dn*aH.w + X*p.x + Y*p.y + Z*p.z;
  float t2 = t*t;
  wl += vec3(0., .22, -1.)*t2*S*(.55 + .5*buf)*(pt < -.4 ? -.5 : 1.);
  wl += (X*sin(uTime*5.1 + t*7. + ph) + Z*cos(uTime*4.3 + t*6. + ph*1.3))*t*S*(.07 + .06*buf);
  vN = X*nl.x + Y*nl.y + Z*nl.z;
  vUv = uv; vQ = aQ; vPos = wl; vA = aC1.rgb; vB = aC2; vLan = aC1.a;
  vec4 mvPosition = modelViewMatrix*vec4(wl, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fa=`
#include <common>
#include <fog_pars_fragment>
${Ce}
uniform vec3 uCream, uInk, uBam;
uniform float uTrans;
varying vec2 vUv; varying vec4 vQ; varying vec3 vN; varying vec3 vPos; varying vec3 vA; varying vec3 vB; varying float vLan;
void main(){
  float id = vQ.x, b = vQ.y, kw = max(vQ.w, .004);
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  float fb = max(fwidth(b), 1e-5);
  float lodk = 1. - smoothstep(kw*.5, kw*2.6, fb);
  vec3 a = id < .5 ? uCream : (id < 1.5 ? vA : (id < 2.5 ? vB : (id < 3.5 ? uInk*2.6 : (id < 4.5 ? uBam : mix(vA, uCream, .4)))));
  a *= .86 + .22*dkVn(vUv*21. + vPos.z*.01);
  float echo = ln(abs(b - .3), kw*.45, fb)*lodk*step(id, 2.5);
  a = mix(a, id < .5 ? uInk*3. : uCream*.92, echo*.7);
  float key = ln(b, kw, fb)*(1. - step(3.5, id)*step(id, 4.5));
  a = mix(a, uInk, key*mix(.3, 1., lodk));
  float fux = fwidth(vUv.x) + 1e-5, fuy = fwidth(vUv.y) + 1e-5;
  float silk = step(.25, vLan)*step(vLan, .75);                 // drapes and curtains: no bamboo, more light through
  a *= mix(1., (.8 + .2*sin(vUv.x*40. + 2.2*sin(vUv.y*1.3 + vPos.x)))*(1. - .3*uLantern), silk);      // the folds of hung cloth
  // the bamboo inside the lit paper: spine, a spar, a bowed leading edge
  float rib = max(ln(abs(vUv.x), .006, fux), max(ln(vUv.y + .19, .006, fuy), ln(vUv.y + .05 + .55*vUv.x*vUv.x, .006, fux + fuy)));
  rib *= step(id, 2.5)*lodk*(1. - silk)*(1. - step(1.5, vLan));
  vec3 tc = a*a*1.25 + a*.32;
  float pass = id > 4.5 ? 1.5 : 1.;
  float sgp = uSunDir.x < 0. ? -1. : 1.;
  float hSp = 1./(1. + sq(max(32. - vPos.x*sgp, 0.))*.0032);      // how near the sun wall this paper hangs
  vec3 sunT = uPaperS*hSp*uKey*(.36 + .55*silk) + (uRoof*.5 + uGable*.25 + uFlame*uLantern*.35)*silk;
  vec3 col = a*roomLight(vPos, N)*.42 + tc*(roomLight(vPos, -N)*uTrans*pass + sunT)*(1. - .7*rib);
  float fl = .86 + .14*sin(uTime*7. + vPos.x*3.)*sin(uTime*11.3 + vPos.z);
  float lamp = step(1.5, vLan);                                  // a lantern of the gallery: lit in every look
  float lanK = max(step(.75, vLan)*uLantern, lamp);
  float hoop = ln(abs(fract(vUv.y*8.) - .5)/8., .009, fuy)*lamp*step(id, 2.5)*lodk;
  col = col*(1. - .7*lanK) + lanK*fl*(tc*uFlame*2.3*(.3 + .7*b) + uFlame*1.3*b*b*b*b)*(1. - .5*hoop)*mix(1., .8, lamp);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,ua=`
#include <common>
#include <fog_pars_vertex>
${xt}
uniform vec3 uCam;
varying float vW;
void main(){
  vec3 dn; kiteSwing(dn);
  vec3 p = aH.xyz + dn*aH.w*position.y;
  vec3 toCam = uCam - p; float dist = length(toCam);
  vec3 side = cross(dn, toCam); side /= max(length(side), 1e-4);
  float w = max(.022, dist*.0016);
  p += side*position.x*w;
  vW = clamp(.022/w, 0., 1.);
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,da=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uCol;
varying float vW;
void main(){
  gl_FragColor = vec4(uCol, mix(.35, 1., vW));
  #include <fog_fragment>
}`,kt=`
float fogK(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      return smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 0.;
  #endif
}`,zt=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aA; attribute vec4 aB;
uniform vec3 uCam;
varying vec2 vUv; varying vec3 vK;
void main(){
  vec3 D = aB.xyz - aA.xyz; float L = length(D); D /= max(L, 1e-4);
  vec3 P = aA.xyz + D*L*position.y;
  vec3 side = cross(D, uCam - P); side /= max(length(side), 1e-4);
  P += side*position.x*aA.w*(1. + position.y*.7);
  vec3 c = uCam - aA.xyz; float tt = clamp(dot(c, D), 0., L);
  float dc = length(c - D*tt);
  vUv = position.xy; vK = vec3(L, aB.w, .3 + .7*smoothstep(.5, 3., dc/max(aA.w, .1)));
  vec4 mvPosition = modelViewMatrix*vec4(P, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Mt=`
#include <common>
#include <fog_pars_fragment>
${kt}
uniform vec3 uShaft; uniform float uTime, uBeam;
varying vec2 vUv; varying vec3 vK;
float bH(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x*p.y); }
float bN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(bH(i), bH(i + vec2(1., 0.)), f.x), mix(bH(i + vec2(0., 1.)), bH(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  float x = 1. - vUv.x*vUv.x;
  float a = x*x*smoothstep(0., .03, vUv.y)*(1. - smoothstep(.7, 1., vUv.y));
  float dust = .62 + .6*bN(vec2(vUv.x*2.5 + vK.y*9., vUv.y*vK.x*.22 - uTime*.2));
  dust += .25*bN(vec2(vUv.x*9. + vK.y*3., vUv.y*vK.x*.9 - uTime*.5));
  gl_FragColor = vec4(uShaft*uBeam*a*dust*vK.z*(1. - .55*fogK()), 1.);
}`,pa=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aB; attribute vec2 aW;
uniform float uBird, uTime;
${Xe}
varying vec3 vPos; varying vec3 vN; varying vec2 vW;
void main(){
  float s = 600. + aB.z - uBird;
  float k = 1. - smoothstep(690., 768., s);
  float wv = sin(uTime*1.3 + aB.w), wy = sin(uTime*1.7 + aB.w*2.);
  vec3 c = vec3(snakeX(min(s, 764.))*.45 + (aB.x + wv*.9)*k, mix(18., eyeY(min(s, 764.)) + aB.y + wy*.6, k), DK_Z0 - s);
  // flap in bursts, glide between them, bank with the weave
  float burst = smoothstep(-.2, .5, sin(uTime*1.9 + aB.w*3.));
  float fl = sin(uTime*(12. + fract(aB.w)*4.) + aB.w*5.)*mix(.25, 1., burst);
  vec3 p = position*2.7;
  float wk = aW.x*step(.5, aW.y);
  p.y += wk*wk*(fl*.8 + .22)*.92;
  p.x *= 1. - .2*wk*(.5 - .5*fl);
  float bank = cos(uTime*1.3 + aB.w)*.35*k, cb = cos(bank), sb = sin(bank);
  p.xy = vec2(p.x*cb - p.y*sb, p.x*sb + p.y*cb);
  vec3 nn = normal; nn.xy = vec2(nn.x*cb - nn.y*sb, nn.x*sb + nn.y*cb);
  vPos = c + p; vN = nn; vW = aW;
  vec4 mvPosition = modelViewMatrix*vec4(vPos, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ma=`
#include <common>
#include <fog_pars_fragment>
${Ce}
varying vec3 vPos; varying vec3 vN; varying vec2 vW;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  float flat_ = step(.5, vW.y), tail = step(1.5, vW.y);
  float below = step(vPos.y, uCam.y);                          // we look down on it: the blue-black back
  float under = flat_ > .5 ? 1. - below : 1. - smoothstep(-.3, .15, N.y);
  vec3 navy = vec3(.012, .02, .06), cream = vec3(.86, .76, .55), rufous = vec3(.6, .17, .06);
  // blue-black wings and tail from both sides (a little paler beneath), cream belly, rufous throat
  vec3 wing = mix(mix(navy*2.4, cream*.5, uLantern), mix(navy, cream*.12, uLantern*(1. - tail)), max(smoothstep(.15, .4, vW.x), tail));      // by lantern light the underwing shows pale
  vec3 a = flat_ > .5 ? mix(navy, wing, under) : mix(navy, mix(cream, rufous, smoothstep(.45, .7, vW.x)), under);
  if (flat_ > .5) N = vec3(0., 1. - 2.*under, 0.);
  vec3 L = roomLight(vPos, N) + uAmb*.6 + (uRoof*.55 + uSun*.3 + uFloor)*under;
  gl_FragColor = vec4(a*L, 1.);
  #include <fog_fragment>
}`,ha=`
#include <common>
#include <fog_pars_vertex>
varying vec2 vUv;
void main(){
  vUv = position.xy;
  vec4 mvPosition = modelViewMatrix*vec4(position, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,va=`
#include <common>
#include <fog_pars_fragment>
${kt}
uniform vec3 uZen, uHor; uniform float uTime, uMode, uFogK;
varying vec2 vUv;
float sH(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x*p.y); }
void main(){
  vec2 q = vUv/9.;
  vec3 col = mix(uHor, uZen, smoothstep(-.9, .9, q.y));
  float fw = fwidth(vUv.x) + 1e-4;
  if (uMode > .5 && uMode < 1.5) {          // fine rain: bright threads
    vec2 r = vec2(vUv.x*2.6 + vUv.y*.25, vUv.y*.22 + uTime*2.6);
    float h = sH(vec2(floor(r.x), floor(r.y)));
    float th = (1. - smoothstep(.07, .07 + fw*2.6, abs(fract(r.x) - .5)))*step(.45, h)*fract(r.y);
    col += uHor*th*.9;
  } else if (uMode > 1.5 && uMode < 2.5) {   // snow blowing in
    vec2 r = vec2(vUv.x*.9 + sin(uTime*.7 + vUv.y*.6)*.5 + uTime*.3, vUv.y*.9 + uTime*1.3);
    vec2 c = floor(r); float h = sH(c);
    float d = length(fract(r) - .5 - (vec2(h, sH(c + 3.)) - .5)*.5);
    col += vec3(.5)*(1. - smoothstep(.1, .1 + fw*1.2, d))*step(.35, h);
  } else if (uMode > 2.5) {                  // lantern dusk: first stars
    vec2 c = floor(vUv*1.3); float h = sH(c);
    float d = length(fract(vUv*1.3) - .5 - (vec2(h, sH(c + 7.)) - .5)*.6);
    col += vec3(1.1, 1., .8)*(1. - smoothstep(.04, .09, d))*step(.72, h)*(.6 + .4*sin(uTime*3. + h*40.));
  }
  col = mix(col, fogColor, fogK()*uFogK);
  gl_FragColor = vec4(col, 1.);
}`,W=(a,l,p,y,w=12,G=0)=>{const x=[],P=Math.cos(G),q=Math.sin(G);for(let D=0;D<w;D++){const z=D/w*_0,Q=Math.cos(z)*p,N=Math.sin(z)*y;x.push([a+Q*P-N*q,l+Q*q+N*P])}return x};function x0(){const a=[],l=[],p=[],y=[];let w=0;const G=(x,P,q,D,z,Q,N)=>(a.push(x,P,q),l.push(x,P),p.push(D,z,Q,N),w++);return{panel(x,P,q={}){let D=0,z=0;for(const g of x)D+=g[0],z+=g[1];D/=x.length,z/=x.length,q.c&&(D=q.c[0],z=q.c[1]);let Q=0;for(const g of x)Q+=Math.hypot(g[0]-D,g[1]-z);Q/=x.length;const N=J0((q.k??.012)/Q,.02,.45),R=q.t||0,Y=q.z||0,K=G(D,z,Y,P,1,R,N),m=w;for(const g of x)G(g[0],g[1],Y,P,0,R,N);for(let g=0;g<x.length;g++)y.push(K,m+g,m+(g+1)%x.length)},streamer(x,P,q,D,z,Q,N,R=0,Y=1,K=0,m=.14,g=0){let M=null;for(let H=0;H<=N;H++){const O=H/N,p0=h0(D,z,O),z0=h0(R,Y,O),Y0=P-q*O,ne=x+K*O,se=G(ne-p0,Y0,g,Q,0,z0,m),y0=G(ne,Y0,g,Q,1,z0,m),v0=G(ne+p0,Y0,g,Q,0,z0,m);M&&y.push(M[0],se,y0,M[0],y0,M[1],M[1],y0,v0,M[1],v0,M[2]),M=[se,y0,v0]}},lathe(x,P,q,D=.06){let z=null;for(const[Q,N,R]of x){const Y=[];for(let K=0;K<=P;K++){const m=K/P*_0;Y.push(G(Math.cos(m)*N,Q,Math.sin(m)*N,q,R,0,D))}if(z)for(let K=0;K<P;K++)y.push(z[K],Y[K],Y[K+1],z[K],Y[K+1],z[K+1]);z=Y}},build(x){const P=new d.InstancedBufferGeometry;return P.setAttribute("position",new d.Float32BufferAttribute(a,3)),P.setAttribute("uv",new d.Float32BufferAttribute(l,2)),P.setAttribute("aQ",new d.Float32BufferAttribute(p,4)),P.setIndex(y),{geo:P,h:x,tris:y.length/3}}}}const re={swallow(a=0,l=1,p=1,y=2){const w=x0();for(const G of[1,-1]){const x=P=>P.map(q=>[q[0]*G,q[1]]);w.panel(x([[.03,-.1],[.16,-.035],[.3,-.03],[.42,-.07],[.5,-.17],[.46,-.25],[.36,-.3],[.24,-.35],[.12,-.43],[.03,-.4]]),a,{c:[.22*G,-.2]}),w.panel(x(W(.25,-.19,.078,.078,10)),l,{z:.006}),w.panel(x(W(.25,-.19,.034,.034,8)),3,{z:.012}),w.panel(x([[.36,-.045],[.42,-.07],[.5,-.17],[.46,-.25],[.41,-.16]]),2,{z:.006}),w.panel(x([[.015,-.4],[.12,-.43],[.2,-.62],[.23,-.82],[.17,-.95],[.1,-.8],[.03,-.62]]),a,{t:.08}),w.panel(x([[.2,-.62],[.23,-.82],[.17,-.95],[.1,-.8],[.13,-.66]]),1,{z:.006,t:.12}),w.panel(x(W(.032,-.045,.014,.014,6)),3,{z:.014})}return w.panel(W(0,-.25,.07,.17,12),p,{z:.006}),w.panel(W(0,-.25,.034,.1,8),y,{z:.012}),w.panel(W(0,-.055,.06,.065,12),y,{z:.008}),w.build(.95)},butterfly(){const a=x0();for(const l of[1,-1]){const p=y=>y.map(w=>[w[0]*l,w[1]]);a.panel(p([[.02,-.2],[.06,-.08],[.18,0],[.34,0],[.46,-.07],[.5,-.18],[.45,-.3],[.33,-.38],[.15,-.4],[.03,-.36]]),0,{c:[.26*l,-.2]}),a.panel(p(W(.3,-.19,.1,.09,10)),1,{z:.006}),a.panel(p(W(.3,-.19,.045,.04,8)),3,{z:.012}),a.panel(p([[.34,0],[.46,-.07],[.5,-.18],[.43,-.12]]),2,{z:.006}),a.panel(p([[.02,-.38],[.15,-.42],[.3,-.42],[.37,-.52],[.33,-.66],[.22,-.74],[.1,-.7],[.03,-.56]]),0,{}),a.panel(p(W(.2,-.57,.075,.08,10)),2,{z:.006}),a.streamer(.22*l,-.72,.34,.014,.034,5,4,.1,.6),a.panel(p([[.008,-.16],[.1,.07],[.125,.075],[.03,-.16]]),3,{z:.004,k:0})}return a.panel(W(0,-.4,.032,.26,10),3,{z:.01}),a.build(.78)},goldfish(){const a=x0();a.panel(W(0,-.34,.2,.32,14),1,{}),a.panel(W(0,-.4,.12,.2,10),2,{z:.006}),a.panel(W(0,-.09,.14,.1,10),1,{z:.004});for(const l of[1,-1])a.panel(W(.17*l,-.1,.085,.085,10),0,{z:.01}),a.panel(W(.18*l,-.1,.04,.04,8),3,{z:.016}),a.panel([[.17*l,-.3],[.42*l,-.3],[.5*l,-.44],[.36*l,-.5],[.19*l,-.45]],5,{t:.18}),a.streamer(.1*l,-.62,1.15,.06,.15,5,7,.05,1,.16*l);return a.streamer(0,-.64,1.3,.07,.17,5,7,.05,1,0),a.build(1.9)},cicada(){const a=x0();for(const l of[1,-1])a.panel(W(.23*l,-.5,.11,.42,12,.42*l),0,{}),a.panel(W(.23*l,-.5,.055,.3,10,.42*l),0,{z:.005}),a.panel(W(.19*l,-.42,.075,.27,10,.78*l),5,{z:-.004,t:.1}),a.panel(W(.12*l,-.06,.042,.042,8),1,{z:.01});return a.panel(W(0,-.07,.12,.07,10),3,{z:.006}),a.panel(W(0,-.22,.11,.11,10),1,{z:.008}),a.panel(W(0,-.5,.085,.21,10),3,{z:.008}),a.panel(W(0,-.42,.07,.035,8),2,{z:.014}),a.panel(W(0,-.55,.06,.03,8),2,{z:.014}),a.build(.95)},eagle(){const a=x0();for(const l of[1,-1]){const p=y=>y.map(w=>[w[0]*l,w[1]]);a.panel(p([[.04,-.12],[.2,-.06],[.38,-.05],[.5,-.02],[.49,-.1],[.44,-.13],[.46,-.19],[.4,-.2],[.41,-.26],[.34,-.25],[.33,-.31],[.24,-.28],[.12,-.3],[.04,-.28]]),3,{c:[.22*l,-.17]}),a.panel(p([[.27,-.085],[.37,-.08],[.37,-.2],[.28,-.24]]),0,{z:.006}),a.panel(p([[.08,-.12],[.2,-.09],[.2,-.25],[.08,-.26]]),2,{z:.006})}return a.panel(W(0,-.2,.05,.14,10),2,{z:.01}),a.panel(W(0,-.05,.04,.046,8),0,{z:.012}),a.panel([[-.04,-.3],[.04,-.3],[.11,-.5],[.05,-.53],[0,-.5],[-.05,-.53],[-.11,-.5]],3,{t:.1}),a.panel([[-.06,-.42],[.06,-.42],[.08,-.48],[-.08,-.48]],0,{z:.006,t:.1}),a.build(.55)},ladder(){const a=x0();for(let l=0;l<20;l++){const p=-l*1.3,y=l/20*.34;a.panel([[0,p],[.5,p-.5],[0,p-1.05],[-.5,p-.5]],l%3===1?1:l%3===2?2:0,{t:y,k:.03}),a.streamer(0,p-1.05,.25,.02,.02,3,1,y,y)}return a.build(26)},drape(){const a=x0();return a.streamer(0,0,2.4,.5,.5,1,9,0,.42,0,.05),a.build(2.4)},great(){return re.swallow(1,0,2,2)},pennant(){const a=x0();return a.streamer(0,0,2.6,.5,.03,1,9,0,.75,0,.08),a.build(2.6)},sheet(){const a=x0();a.streamer(0,0,1.3,.5,.5,1,8,0,.16,0,.05),a.panel(W(0,-.65,.3,.3,14),2,{z:.004,t:.06}),a.panel(W(0,-.65,.17,.17,10),1,{z:.008,t:.06});for(const[l,p]of[[-.36,-.14],[.36,-.14],[-.36,-1.16],[.36,-1.16]])a.panel(W(l,p,.07,.07,6),2,{z:.004,t:.06});return a.build(1.3)},tassel(){const a=x0();return a.streamer(0,0,1,.05,.012,1,6,0,.5,0,.3),a.build(1)},curtain(a=4.6){const l=x0(),p=.62;l.streamer(0,0,a,.5,.5,1,16,0,p,0,.03);for(const y of[-.4,.4])l.streamer(y,0,a,.045,.045,2,16,0,p,0,.3,.004);for(let y=.75;y<a-.5;y+=1.25){const w=p*(y/a);l.panel(W(0,-y,.26,.26,12),2,{z:.005,t:w,k:.02}),l.panel(W(0,-y,.13,.13,8),0,{z:.01,t:w,k:.02})}for(let y=0;y<5;y++)l.streamer(-.4+y*.2,-a,.5,.07,.03,2,2,p,p+.12,0,.3);return l.build(a+.5)},curtainL(){return re.curtain(6.1)},bolt(a=6.2,l=.6,p=14){const y=x0();y.streamer(0,0,a,.5,.5,1,p,0,l,0,.03);for(const w of[-.37,.37])y.streamer(w,0,a,.035,.035,2,p,0,l,0,.3,.03);return y.build(a)},boltS(){return re.bolt(4.6,.5,12)},valance(){return re.bolt(1.6,.4,6)},valanceL(){return re.bolt(2.5,.45,8)},lantern(){const a=x0();return a.lathe([[0,.12,0],[-.15,.37,.4],[-.5,.5,1],[-.85,.37,.4],[-1,.12,0]],7,1),a.streamer(0,-1,.42,.04,.012,2,2,.1,.5,0,.3),a.build(1.45)},lanternT(){const a=x0();return a.lathe([[0,.09,0],[-.08,.27,.2],[-.72,.31,1],[-1.36,.27,.2],[-1.44,.09,0]],7,1),a.streamer(0,-1.44,.42,.04,.012,2,2,.1,.5,0,.3),a.build(1.9)},torn(){const a=x0();return a.streamer(0,0,1,.011,.007,0,8,.05,1,0,.3),a.build(1)}},_e=new d.Quaternion,Pe=new d.Matrix4,At=new t0(0,1,0),P0=new t0,ya=new t0(1,1,1),St=new t0;function I(a,l,p,y,w,G,x={}){P0.set(p[0]-l[0],p[1]-l[1],p[2]-l[2]);const P=P0.length();P0.normalize();const q=Math.abs(P0.x)>.75?0:Math.abs(P0.y)>.7?1:2;_e.setFromUnitVectors(At,P0),Pe.compose(St.set((l[0]+p[0])/2,(l[1]+p[1])/2,(l[2]+p[2])/2),_e,ya),a.add(j(y,P+(x.over||0),w),{m:Pe,pre:x.pre,c:G,surf:x.surf||(x.bamboo?w0(q):X(q,x.gloss??.3))})}function I0(a,l,p,y,w,G={}){const x=new d.CatmullRomCurve3(l.map(q=>q.isVector3?q:new t0(q[0],q[1],q[2])),!!G.closed),P=new d.TubeGeometry(x,G.seg||10,p,G.rad||5,!!G.closed);P.deleteAttribute("uv"),a.add(P,{pre:G.pre,c:y,surf:w,s:G.s,p:G.p})}const ga=(a,l,p,y,w)=>.5*(2*l+(-a+p)*w+(2*a-5*l+4*p-y)*w*w+(-a+3*l-3*p+y)*w*w*w);function Lt(a,l,p,y,w){const G=a.length,x=new Float32Array(l*p*3),P=new Float32Array(l*p*3),q=[],D=new d.Color,z=(N,R)=>{const Y=Math.min(G-2,Math.floor(N)),K=N-Y;return ga(a[Math.max(0,Y-1)][R],a[Y][R],a[Y+1][R],a[Math.min(G-1,Y+2)][R],K)};for(let N=0;N<l;N++)for(let R=0;R<p;R++){const Y=N/(l-1)*(G-1),K=R/(p-1)*L,m=(N*p+R)*3,g=z(Y,0),M=z(Y,1),H=z(Y,2),O=z(Y,3);x[m]=M*Math.cos(K),x[m+1]=O+(H-O)*Math.pow(Math.sin(K),.8),x[m+2]=g,w(N/(l-1),R/(p-1),D),P[m]=D.r,P[m+1]=D.g,P[m+2]=D.b}for(let N=0;N+1<l;N++)for(let R=0;R+1<p;R++){const Y=N*p+R,K=Y+1,m=Y+p,g=m+1;y>0?q.push(Y,m,K,K,m,g):q.push(Y,K,m,K,g,m)}const Q=new d.BufferGeometry;return Q.setAttribute("position",new d.BufferAttribute(x,3)),Q.setAttribute("color",new d.BufferAttribute(P,3)),Q.setIndex(q),Q.computeVertexNormals(),{g:Q,at:z}}function Je(a,l,p,y,w,G,x,P=E0){P0.set(p[0],p[1],p[2]).normalize(),_e.setFromUnitVectors(At,P0),Pe.compose(St.set(l[0]+P0.x*y/2,l[1]+P0.y*y/2,l[2]+P0.z*y/2),_e,new t0(w,1,w*.16)),a.add(new d.ConeGeometry(.5,y,5),{m:Pe,pre:x,c:G,surf:P})}const ba=[[-4,1.5,1.6,-.6],[-2.6,1.95,2.25,-.35],[-1.1,2.05,2.45,-.15],[.3,1.7,1.95,0],[1.6,1.25,1.25,.05],[3,1.15,1.05,.12],[4.2,1.38,1.3,.2],[5,.85,.75,.3]],wa=[[-2.6,1.7,-1.5,-.5],[-1,1.75,-1.95,-.8],[.6,1.4,-2.05,-1.15],[2.2,1.1,-2.25,-1.5],[3.6,1.1,-2.5,-1.85],[4.4,.7,-2.45,-2]];async function xa(a,l,p,y,w){const G=new d.Color,x=p===2,P=(m,g,M)=>{const H=Math.abs(g-.5)*2;M.set(y.ground),H>.7&&M.lerp(G.set(y.scallop),.9),H<.13&&M.lerp(G.set(Z),.85),m>.8&&M.lerp(G.set(Z),Math.min(1,(m-.8)*4))},q=(m,g,M)=>{M.set(y.scallop),Math.abs(g-.5)<.2&&M.lerp(G.set(V),.7),m>.85&&M.lerp(G.set(Z),.8)},D=(m,g,M)=>{M.set(V).multiplyScalar(.82)},z=Lt(ba,17,13,1,x?P:D),Q=Lt(wa,11,13,-1,x?q:D),N=(m,g,M)=>{const H=m.at(g,1),O=m.at(g,2),p0=m.at(g,3);return new t0(H*Math.cos(M),p0+(O-p0)*Math.pow(Math.sin(M),.8),m.at(g,0))},R=p===0?_:U(_,$,.25);if(p>0)a.add(z.g,{pre:l,surf:x?$e:ae}),a.add(Q.g,{pre:l,surf:x?$e:ae});else for(const[m,g]of[[z,8],[Q,6]]){for(let M=0;M<g;M++){const H=[];for(let O=0;O<=8;O++)H.push(N(m,M,O/8*L));I0(a,H,.07,R,ve,{pre:l,seg:12,rad:4}),I(a,H[0].toArray(),H[8].toArray(),.1,.1,R,{pre:l,bamboo:!0})}for(let M=0;M<=6;M++){const H=[];for(let O=0;O<=(g-1)*2;O++)H.push(N(m,O/2,M/6*L));I0(a,H,.06,R,ve,{pre:l,seg:14,rad:4})}await w()}for(const m of[0,L])for(const g of[z,Q]){const M=[];for(let H=0;H<=(g===z?14:10);H++)M.push(N(g,H/2,m));I0(a,M,.09,x?Z:R,x?N0:ve,{pre:l,seg:14,rad:4})}const Y=[];for(const m of[1,-1]){const g=x?Z:_,M=x?N0:ve;I0(a,[[.85*m,2.3,-1.3],[1.3*m,3.6,-2.2],[1.5*m,4.6,-3.6],[1.2*m,5.3,-5]],.15,g,M,{pre:l,seg:10,rad:5}),I0(a,[[1.3*m,3.6,-2.2],[2.1*m,4.3,-2.6],[2.6*m,5.1,-3.3]],.11,g,M,{pre:l,seg:6,rad:5}),I0(a,[[1.5*m,4.6,-3.6],[.9*m,5.4,-3.7],[.6*m,6.1,-4.2]],.09,g,M,{pre:l,seg:6,rad:5});const H=[1.55*m,1.35,.4],O=new t0(.8*m,.12,.6).normalize();p>0&&a.add(n0(.66,12,9),{p:H,pre:l,c:x?V:U(V,_,.15),surf:x?d0:ae});const p0=new d.TorusGeometry(.72,.06,4,14);p0.lookAt(O),a.add(p0,{p:[H[0]+O.x*.25,H[1]+O.y*.25,H[2]+O.z*.25],pre:l,c:x?oe:R,surf:ve}),Y.push({p:new t0(H[0]+O.x*.82,H[1]+O.y*.82,H[2]+O.z*.82),dir:O})}const K=[];if(x){for(const m of[1,-1]){for(let g=0;g<7;g++){const M=2.6+g*.62,H=m>0?0:L,O=N(z,M,H),p0=N(Q,Math.min(5,M*.72),H),z0=g===5?2:1;a.add(new d.ConeGeometry(.13*z0,.5*z0,5),{p:[O.x*.93,O.y-.25*z0,O.z],r:[L,0,0],pre:l,c:V,surf:d0}),a.add(new d.ConeGeometry(.12,.45,5),{p:[p0.x*.93,p0.y+.22,p0.z],pre:l,c:V,surf:d0})}a.add(n0(.33,8,6),{p:[.5*m,1.22,4.5],s:[1,.8,1.2],pre:l,c:Z,surf:N0});for(let g=0;g<3;g++)Je(a,[1.42*m,2.2-g*.12,.3-g*.75],[.25*m,1,-.55-g*.2],1.9-g*.2,.9,[Z,y.scallop,y.ground][g],l,d0);for(let g=0;g<3;g++)Je(a,[1.85*m,-.25-g*.12,-1.9+g*.9],[.8*m,-.15,-.6],2-g*.3,1,[y.scallop,Z,y.ground][g],l);I0(a,[[.9*m,.6,4.6],[2*m,1.4,5.6],[3.2*m,2.6,5.3],[3.9*m,4,4.3]],.075,Z,N0,{pre:l,seg:10,rad:4}),a.add(n0(.22,6,5),{p:[3.9*m,4,4.3],pre:l,c:y.ground,surf:d0})}a.add(n0(.46,10,8),{p:[0,1.75,4.25],pre:l,c:V,surf:[.9,0,.1,1]}),I0(a,[[0,-1.3,-1],[0,-1.6,1.5],[0,-1.75,3.4],[0,-1.3,5],[0,-.5,5.8]],.3,y.ground,d0,{pre:l,seg:10,rad:6});for(let m=0;m<9;m++){const g=m/8*L,M=[1.5*Math.cos(g),-.6+2.2*Math.pow(Math.sin(g),.8),-3.9];Je(a,M,[Math.cos(g)*.75,Math.sin(g)*.75+.1,-.7],2.9,1.2,[y.ground,Z,y.scallop][m%3],l)}for(let m=0;m<16;m++){const g=.6+m*.28,M=N(Q,Math.min(5,g),L/2+(m%3-1)*.5);K.push([M.x,M.y+.05,M.z,2.4+m%4*.5])}}return{eyes:Y,beard:K}}function ka(a,l){const p=g0.makeBuilder(),y=.62;for(let w=0;w<6;w++){const G=w/6*_0,x=(P,q,D)=>[Math.cos(G+q)*P,Math.sin(G+q)*P,D];p.quad([0,0,.02],x(y,0,0),x(y*.8,.55,.16),x(y*.3,.95,.06),w%2?a:l,E0)}return p.add(n0(.09,6,5),{p:[0,0,.12],c:oe,surf:d0}),p.build()}function za(){const a=g0.makeBuilder(),l="#c8742c",p=new d.Color("#ecdcc0"),y=(w,G,x,P)=>{P.multiplyScalar(.8+.22*Math.sin(x*8+w*2.5)),G<.16&&P.lerp(p,.6)};return a.add(n0(.5,16,12),{p:[0,.4,0],s:[1.2,.8,2],c:l,surf:s0,tint:y}),a.add(n0(.42,12,9),{p:[-.12,.36,-.62],s:[1.3,.92,1.2],c:l,surf:s0,tint:y}),a.add(n0(.35,12,9),{p:[.32,.4,.92],s:[1,.9,1.08],c:l,surf:s0,tint:y}),I0(a,[[-.3,.16,-1.05],[.5,.14,-1],[.9,.14,-.2],[.82,.15,.55]],.11,"#a85a1c",s0,{seg:10,rad:6}),a.add(new d.ConeGeometry(.13,.27,4),{p:[.5,.75,1],r:[.1,.4,-.25],c:l,surf:s0}),a.add(n0(.13,6,5),{p:[.6,.12,.62],s:[1,.7,1.4],c:"#ecdcc0",surf:s0}),a.build()}function Ma(){const a=g0.makeBuilder(),l="#6a4a2c",p=new d.Color("#ead9b8"),y=(w,G,x,P)=>{G<.02&&x>-.2&&(P.lerp(p,.85),P.multiplyScalar(.75+.3*Math.abs(Math.sin(w*40)*Math.sin(G*37+x*31))))};a.add(n0(.3,12,9),{p:[0,0,0],s:[.85,.85,1.35],r:[-.35,0,0],c:l,surf:s0,tint:y}),a.add(n0(.18,10,8),{p:[0,.27,.3],c:l,surf:s0,tint:y}),a.add(new d.ConeGeometry(.05,.2,5),{p:[0,.27,.54],r:[L/2,0,0],c:Z,surf:d0}),a.add(j(.2,.04,.5),{p:[0,-.02,-.55],r:[.3,0,0],c:"#4a3420",surf:s0});for(const w of[-1,1])a.add(J(.02,.02,.3,4),{p:[.09*w,-.36,.02],c:_,surf:E0}),a.add(n0(.03,5,4),{p:[.1*w,.31,.44],c:oe,surf:d0});return a.build()}function Aa(){const a=g0.makeBuilder();for(const l of[-1,1]){const p=new d.TorusGeometry(4,.17,6,30);p.rotateY(L/2),a.add(p,{p:[1.15*l,0,0],c:E,surf:X(2,.35)});for(let y=0;y<8;y++){const w=y/8*_0;I(a,[1.15*l,0,0],[1.15*l,Math.cos(w)*4,Math.sin(w)*4],.24,.3,y?E:U(E,r0,.6))}}for(let l=0;l<8;l++){const p=(l+.5)/8*_0;a.add(J(.11,.11,2.5,6),{p:[0,Math.cos(p)*3.9,Math.sin(p)*3.9],r:[0,0,L/2],c:_,surf:w0(0)})}return a.add(J(.42,.42,3.6,10),{r:[0,0,L/2],c:$,surf:X(0,.4)}),a.add(J(2.2,2.2,2,22,!0),{r:[0,0,L/2],c:U(V,_,.45),surf:s0,tint:(l,p,y,w)=>{w.multiplyScalar(.8+.2*Math.sin(l*23))}}),I(a,[1.9,0,0],[1.9,1.3,0],.16,.16,E),I(a,[1.9,1.3,0],[2.7,1.3,0],.2,.2,_,{bamboo:!0}),a.build()}const Sa={afternoon:{fog:"#dcc79c",dens:.0031,paperS:["#ffe7bd",1.75],paperL:["#9fb6d8",.36],paperR:["#f8dfa8",.74],paperG:["#a9c8ea",.62],zen:"#5fa4ea",hor:"#a5d2f6",sky:0,key:1,moon:["#4a9cf2",1.25],shaft:["#ffe2ac",.5],bay:["#fff0cc",1.25],exposure:1,tint:"#fff6e6",shadow:"#160b04",sat:1.08,accent:.34,portal:"#8FC4F0",title:"The Hundred-Segment Dragon"},lantern:{fog:"#22398c",dens:.0026,paperS:["#4f78e6",.62],paperL:["#3f66d8",.5],paperR:["#476fe0",.55],paperG:["#3a6cf0",.8],zen:"#1c3fc0",hor:"#4a78f0",sky:3,key:0,moon:["#4f7cff",1.5],shaft:["#000000",0],bay:["#a9c0ff",1.15],boost:2.1,exposure:1.3,tint:"#eef0ff",shadow:"#040818",sat:1.1,accent:.4,portal:"#6f9cff",title:"The Hundred-Segment Dragon, Lantern Night"},rain:{fog:"#b4b8b6",dens:.0033,paperS:["#dfe2e0",.84],paperL:["#c9d0d6",.68],paperR:["#d8dcdc",.74],paperG:["#cfd8de",.72],zen:"#c2ccd4",hor:"#e4e9ea",sky:1,key:.25,moon:["#c6d6e6",1.2],shaft:["#000000",0],bay:["#eef3f6",1],exposure:1.03,tint:"#f4f6f8",shadow:"#0a0c10",sat:.97,accent:.14,portal:"#cfd8e2",title:"The Hundred-Segment Dragon, Morning Rain"},gold:{fog:"#dba25a",dens:.0032,paperS:["#ffbc68",1.6],paperL:["#a898b8",.34],paperR:["#f0c48a",.6],paperG:["#9fc0ea",.56],zen:"#6fa0e0",hor:"#c8d8ee",sky:0,key:1,moon:["#5fa2f0",1.25],shaft:["#ffb060",.5],bay:["#ffb866",1.3],exposure:1,tint:"#ffefd8",shadow:"#1a0a02",sat:1.1,accent:.34,portal:"#a8c8f0",title:"The Hundred-Segment Dragon, Low Sun"},snow:{fog:"#cdd5de",dens:.003,paperS:["#f2f5fa",1],paperL:["#cddcf0",.62],paperR:["#e6edf6",.8],paperG:["#dfe8f4",.76],zen:"#b8c8dc",hor:"#eef3f8",sky:2,key:.55,moon:["#c8dcf6",1.25],shaft:["#f0f4ff",.16],bay:["#f4f8ff",1.25],exposure:1,tint:"#f2f6ff",shadow:"#080c14",sat:.98,accent:.3,portal:"#dfe8f4",title:"The Hundred-Segment Dragon, Snow Light"}},F=(a,l=1)=>new d.Color(a).multiplyScalar(l);var Pa={id:"dragon-kite-loft",name:"The Hundred-Segment Dragon",category:"interior",weirdness:.2,media:["cable","interior"],async build(a){const l=a.rng,p=a.quality?.detail??1,y=a.vary||{},w=J0(y.density??1,.7,1.3),G=new d.Scene,x=l.fork("look");x();const P=e=>e<.55?"afternoon":e<.64?"snow":e<.8?"lantern":e<.9?"rain":"gold",q=y.hour||"any",D=q==="night"?"lantern":q==="golden"?"gold":q==="dawn"?"rain":q==="day"?x()<.75?"afternoon":"snow":P(x()),z=Sa[D];G.fog=new d.FogExp2(z.fog,z.dens),G.background=new d.Color(z.fog);const Q=l.fork("cast"),N={mood:D};D==="rain"&&(N.livery="vermilion");const R=await oa(a,N);G.add(R.object);const Y=R.anchors,K=R.snake,m=R.uniforms,g=e=>K.eyeY(e),M=e=>K.x(e);m.uBars.value=.9*(z.key??0);const H=(e,t,n,r,o)=>j0(t,n,e)*(1-j0(r,o,e)),O=e=>1-.78*H(e,232,264,398,422)-.85*H(e,438,462,516,558),p0=e=>M(e)*O(e)-7*H(e,146,184,206,240),z0=e=>g(e)-2.2*H(e,150,186,208,246)+6.5*H(e,356,386,398,430)-1.6*H(e,444,466,505,540)+3.6*H(e,568,600,640,676),Y0=[];for(let e=0;e<760;e+=12)Y0.push(new t0(p0(e),z0(e),-6-e));Y0.push(new t0(0,18,-770));const ne=aa(Y0,{samples:480}),se=Z0.dye,y0=Z0.gallery,v0=Z0.deckY;await a.yield();const q0=m.uSunDir.value.x<0?-1:1,L0=m.uSunDir.value.clone().normalize(),et=L0.y+Math.abs(L0.x)*.9375,Ie=e=>(46-e)/et,i0={x0:Ie(21.5)*Math.abs(L0.x),x1:Ie(8.5)*Math.abs(L0.x),z:-6-Z0.bay+Ie(15)*L0.z,hl:13};i0.x1=Math.min(i0.x1,29.5),m.uBay.value.set(i0.x0,i0.x1,i0.z,i0.hl),m.uBayCol.value.copy(F(...z.bay)),m.uGalK.value=.8;const Bt=(e,t,n)=>{const r=Math.max(0,(46-t-e*q0*.9375)/et),o=(e+L0.x*r)*q0,i=n+L0.z*r;return o>i0.x0-2&&o<i0.x1+2&&Math.abs(i-i0.z)<i0.hl+2},Fe=[],He=[];for(let e=0;e<ue;e++)Fe.push(new d.Vector4(0,-99,0,.01)),He.push(new d.Vector4(0,9999,1,1));const Gt={uSunDir:m.uSunDir,uSun:m.uSun,uSky:m.uSky,uRoof:m.uRoof,uGable:m.uGable,uAmb:m.uAmb,uFloor:m.uFloor,uCam:m.uCam,uGain:m.uGain,uEye:m.uEye,uTime:m.uTime,uBay:m.uBay,uBayCol:m.uBayCol,uGalK:m.uGalK,uHole:{value:Fe},uPool:{value:He},uPaperS:{value:F(...z.paperS)},uPaperL:{value:F(...z.paperL)},uPaperR:{value:F(...z.paperR)},uPaperG:{value:F(...z.paperG)},uHaze:{value:F(z.fog)},uShaft:{value:F(...z.shaft)},uTimber:{value:F("#56402e")},uGold:{value:F(_)},uCream:{value:F(V,.86)},uGilt:{value:F(Z)},uInk:{value:F(oe)},uAccA:{value:F(r0,.8)},uAccB:{value:F(C0,.85)},uAccC:{value:F(Z,.85)},uBam:{value:F(_,.7)},uFlame:{value:new d.Color(1,.5,.16)},uLantern:{value:D==="lantern"?1:0},uFront:m.uFront,uBoost:{value:z.boost??1},uKey:{value:z.key??0},uMoon:{value:F(...z.moon)},uTrans:{value:D==="lantern"?1.25:1},uGlow:{value:1}},R0=(e,t,n={})=>{const{uniforms:r,...o}=n;return new d.ShaderMaterial({uniforms:{...d.UniformsUtils.clone(d.UniformsLib.fog),...Gt,...r||{}},vertexShader:e,fragmentShader:t,fog:!0,...o})},Te=R0(ia,ca,{side:d.DoubleSide}),tt=R0(la,fa,{side:d.DoubleSide}),F0=(e,t,n=0,r=!1)=>{const o=new d.Mesh(e,t);return o.frustumCulled=r,o.renderOrder=n,G.add(o),o};{const e=[],t=[],n=[],r=[],o=(v,B,C,b,A,T)=>{const c0=e.length/3;for(const m0 of[v,B,C,b])e.push(...m0),t.push(...A),n.push(T);r.push(c0,c0+1,c0+2,c0,c0+2,c0+3)},i=Se,s=f0,c=30/43.86,u=32/43.86;o([-o0,0,i],[o0,0,i],[o0,0,s],[-o0,0,s],[0,1,0],0),o([o0,0,i],[o0,b0,i],[o0,b0,s],[o0,0,s],[-1,0,0],1),o([-o0,0,i],[-o0,b0,i],[-o0,b0,s],[-o0,0,s],[1,0,0],1),o([o0,b0,i],[0,S0,i],[0,S0,s],[o0,b0,s],[-c,-u,0],2),o([-o0,b0,i],[0,S0,i],[0,S0,s],[-o0,b0,s],[c,-u,0],2);for(const[v,B,C]of[[s,1,3],[i,-1,4]]){const b=e.length/3;for(const A of[[-o0,0],[o0,0],[o0,b0],[0,S0],[-o0,b0]])e.push(A[0],A[1],v),t.push(0,0,B),n.push(C);r.push(b,b+1,b+2,b,b+2,b+3,b,b+3,b+4)}const h=new d.BufferGeometry;h.setAttribute("position",new d.Float32BufferAttribute(e,3)),h.setAttribute("normal",new d.Float32BufferAttribute(t,3)),h.setAttribute("aId",new d.Float32BufferAttribute(n,1)),h.setIndex(r),F0(h,R0(na,sa,{side:d.DoubleSide}),-2)}let f=g0.makeBuilder();const De=[f];for(let e=0;e<Be;e++){const t=te(e);for(const n of[-1,1]){const r=16*n;I(f,[r,1.3,t],[r,u0(16),t],1.3,1.3,$,{gloss:.35});for(const o of[-1,1])for(const i of[-1,1])f.add(j(.2,u0(16)-1.6,.2),{p:[r+o*.65,(u0(16)+1.6)/2,t+i*.65],r:[0,L/4,0],c:U($,_,.75),surf:X(1,.6)});f.add(j(2.1,1.1,2.1),{p:[r,.55,t],c:"#8a7f6c",surf:he}),f.add(j(1.7,.35,1.7),{p:[r,1.27,t],c:"#9a8f7a",surf:he});for(const o of[6.5,15,23])f.add(j(1.46,.3,1.46),{p:[r,o,t],c:U($,_,.35),surf:X(0,.5)});I(f,[r-.3*n,22.6,t],[r-5.2*n,W0-.3,t],.7,.7,E),I(f,[0,29.5,t],[9.6*n,36.6,t],.7,.7,$),I(f,[o0*n-.5*n,b0-.4,t],[.3*n,S0-.9,t],.9,1,$),I(f,[31.45*n,0,t],[31.45*n,b0,t],1,1,$)}I(f,[-19.4,W0,t],[19.4,W0,t],1.2,1,E,{gloss:.35});for(const n of[-1,1])f.add(j(38.6,.2,.2),{p:[0,W0-.6,t+n*.5],r:[L/4,0,0],c:U($,_,.75),surf:X(0,.6)});I(f,[0,W0,t],[0,S0-.6,t],1,1,$),I(f,[-9.6,37,t],[9.6,37,t],.8,.8,$),await a.yield()}const ye=g0.makeBuilder();for(const e of[-1,1]){for(const t of[6.4,12.8,19.2,25.6])I(ye,[t*e,u0(t)-.55,Se],[t*e,u0(t)-.55,f0],.6,.8,$);I(ye,[31.5*e,b0-.3,Se],[31.5*e,b0-.3,f0],.9,.7,E)}I(ye,[0,S0-.7,Se],[0,S0-.7,f0],.8,.9,$),await a.yield();const B0=l.fork("bench"),at=[r0,C0,Z];for(let e=1;e<Be;e++)for(const t of[-1,1]){const n=te(e)+8,r=27*t;f.add(j(4.4,.4,14),{p:[r,5,n],c:U(E,_,.25+.2*B0()),surf:X(2,.35)}),f.add(j(3.8,.25,13.4),{p:[r,1.9,n],c:$,surf:X(2)});for(const i of[-6.4,0,6.4])for(const s of[-1.8,1.8])f.add(j(.5,4.8,.5),{p:[r+s,2.4,n+i],c:$,surf:X(1)});const o=Math.round(4*w+B0()*2);for(let i=0;i<o;i++){const s=r+B0.range(-1.4,1.4),c=n-6+(i+B0())*(12/o),u=B0.int(0,5),h=5.2;if(u===0)f.add(J(.7,.6,1.2,8),{p:[s,h+.6,c],c:"#4a3a30",surf:d0}),f.add(J(.62,.62,.06,8),{p:[s,h+1.16,c],c:V,surf:E0});else if(u===1){for(let v=0;v<3;v++)f.add(J(.75-v*.05,.5,.2,10),{p:[s+v*.2,h+.1+v*.2,c],c:V,surf:d0});f.add(J(.58,.58,.04,10),{p:[s+.4,h+.62,c],c:B0.pick(at),surf:d0})}else if(u===2){f.add(J(.55,.55,1.3,8),{p:[s,h+.75,c],c:U(V,_,.4),surf:s0});for(const v of[.06,1.44])f.add(J(.8,.8,.12,8),{p:[s,h+v,c],c:E,surf:X(1)})}else if(u===3)f.add(J(.45,.45,3.6,8),{p:[s,h+.45,c],r:[L/2,B0.range(-.3,.3),0],c:B0()<.5?V:B0.pick(at),surf:s0});else if(u===4){const v=new d.TorusGeometry(2.4,.08,4,18);f.add(v,{p:[29.9*t,h+2.3,c],r:[0,L/2+.16*t,0],c:_,surf:w0(1)}),f.add(new d.TorusGeometry(2.3,.08,4,18),{p:[29.6*t,h+2.2,c+.5],r:[0,L/2+.22*t,0],c:_,surf:w0(1)})}else f.add(j(1.6,.05,2.2),{p:[s,h+.03,c],r:[0,B0.range(0,3),0],c:V,surf:E0}),I(f,[s-.9,h+.1,c-1],[s+.9,h+.1,c+1],.08,.08,_,{bamboo:!0})}if(f.add(n0(1,11,5),{p:[r-1.4*t,0,n+B0.range(-4,4)],s:[1.9,.55,2.6],c:U(V,_,.7),surf:s0}),(e+(t>0?1:0))%2)for(let i=0;i<5;i++)f.add(J(.3,.34,14.5,6),{p:[30.9*t-i%2*.55*t,6.3+Math.floor(i/2)*.55,n],r:[L/2,0,0],c:U(Ge,_,B0()*.5),surf:w0(2)});await a.yield()}f=g0.makeBuilder(),De.push(f);const k=l.fork("kites"),ge={},X0={H:[],I:[]},S={cream:F(V,.86),verm:F(r0,.86),virid:F(C0,.9),gilt:F(Z,.88),sky:F(Qe,.8),ink:F(oe,2.4),pale:F("#e2ddd0",.8)},H0=(e,t,n,r,o,i,s,c,u,h,v=0,B=!0)=>{const C=ge[e]||(ge[e]={H:[],I:[],C1:[],C2:[]}),b=k()*40;C.H.push(t,n+o,r,o),C.I.push(i,s,b,c),C.C1.push(u.r,u.g,u.b,v),C.C2.push(h.r,h.g,h.b),B&&o>.3&&(X0.H.push(t,n+o,r,o),X0.I.push(i,s,b,c))},e0=l.fork("props"),La=[],V0=(e,t,n,r)=>{const o=new d.Mesh(e,Te);return o.position.set(t,n,r),G.add(o),o};{const n=new d.LatheGeometry([[.01,0],[1,.02],[1.45,1.1],[1.5,2.1],[1.05,3.2],[.62,3.7],[.78,4],[.62,4.06]].map(o=>new d.Vector2(o[0],o[1])),16);f.add(n,{p:[-12.5,0,-34],c:U(C0,"#9fc7b5",.55),surf:d0});const r=[[-12.5+4.1,12.8,-34-2.5],[-12.5-1.9,11.8,-34+1.5],[-12.5+1.9,10.4,-34+3.8],[-12.5-2.7,9.2,-34-2.4],[-12.5+3.3,8.6,-34+.8],[-12.5+.6,13.6,-34-.6]];for(const o of r){const i=[(-12.5+o[0])/2+e0.range(-.7,.7),4+(o[1]-4)*.55,(-34+o[2])/2+e0.range(-.7,.7)];I0(f,[[-12.5,3.2,-34],i,o],.12,"#3a2418",X(1),{seg:8,rad:5});for(let s=0;s<20;s++){const c=.3+.7*e0(),u=[h0(i[0],o[0],c)+e0.range(-.5,.5),h0(i[1],o[1],c)+e0.range(-.4,.5),h0(i[2],o[2],c)+e0.range(-.5,.5)];f.add(new d.IcosahedronGeometry(e0.range(.18,.34),0),{p:u,c:e0()<.75?"#f2aebb":"#fbe4e6",surf:[.2,0,.1,1]})}await a.yield()}}const ot=g0.tableGeometry({rng:e0.fork("t1"),scale:6,width:1.55,depth:.85,height:.8,color:E}),ie=ot.userData.top??4.8;f.add(ot,{p:[-9.8,0,-52],r:[0,L/2,0]});const qe=(e,t,n,r,o,i,s=0)=>{f.add(J(r,r,o,14),{p:[e,t,n],r:[L/2,s,0],c:i,surf:s0}),f.add(J(r*.28,r*.28,o+.3,6),{p:[e,t,n],r:[L/2,s,0],c:_,surf:w0(2)})};qe(-9.6,ie+1.1,-52.6,1.1,5.2,U(V,"#ffffff",.3),L/2),qe(-10.6,ie+.55,-49.2,.55,3.6,r0,.3),qe(-9.2,ie+.45,-55.6,.45,3,C0,1.3),f.add(j(2.6,.06,3.4),{p:[-8.2,ie+.03,-48.2],r:[0,.3,0],c:V,surf:E0});const Ve=V0(za(),-9.3,ie+2.12,-52.6);Ve.rotation.y=L/2;const de=V0(new d.ConeGeometry(.13,.28,4),0,0,0);{const e=de.geometry,t=e.attributes.position.count,n=new Float32Array(t*3),r=new Float32Array(t*4),o=F("#c8742c");for(let i=0;i<t;i++)n.set([o.r,o.g,o.b],i*3),r.set(s0,i*4);e.translate(0,.14,0),e.setAttribute("color",new d.BufferAttribute(n,3)),e.setAttribute("surf",new d.BufferAttribute(r,4))}Ve.add(de),G.remove(de),de.position.set(.16,.7,1.02),await a.yield();const rt=g0.tableGeometry({rng:e0.fork("t2"),scale:6,width:.95,depth:.95,height:.42,round:!0,color:E}),nt=rt.userData.top??2.5,be=[9.6,nt,-29];f.add(rt,{p:[9.6,0,-29]}),await a.yield(),f.add(g0.teapotGeometry({rng:e0.fork("pot"),scale:6,height:.17,color:"#8a4a30"}),{p:be,r:[0,.8,0]}),await a.yield();for(let e=0;e<4;e++){const t=.4+e*1.45;f.add(g0.cupGeometry({rng:e0.fork("cup"+e),scale:6,color:V,tea:!0}),{p:[9.6+Math.cos(t)*1.9,nt,-29+Math.sin(t)*1.9]}),await a.yield()}const Ct=V0(g0.chairGeometry({rng:e0.fork("stool"),scale:6,style:"stool",color:E}),13.4,0,-26.2);await a.yield();{const e=new d.Matrix4().makeRotationFromEuler(new d.Euler(-.3,-.5,0,"YXZ")).setPosition(9.4,5.2,-52);for(const[t,n,r]of[[L/2,r0,$e],[-L/2,V,ae]])f.add(new d.CircleGeometry(2.45,20,t,L),{pre:e,c:n,surf:r});f.add(new d.TorusGeometry(2.5,.09,5,32),{pre:e,c:_,surf:w0(0)}),f.add(new d.TorusGeometry(1.5,.12,4,12,1.3),{pre:e,p:[.1,0,.05],r:[0,0,-.9],s:[1,1,.3],c:r0,surf:[.95,0,.3,1]});for(const t of[-1,1])I(f,[9.4+2.4*t,0,-51.5-t*1.2],[9.9+.5*t,8.6,-53.4],.3,.3,E);I(f,[11.6,0,-57],[10,8.6,-53.5],.3,.3,E),I(f,[6.8,2.4,-50.6],[11.9,2.4,-53.2],.3,.5,E),f.add(j(6,.3,2),{p:[4.6,2,-45.5],r:[0,.35,0],c:E,surf:X(0)});for(const t of[-2.5,2.5])f.add(j(.4,1.9,1.6),{p:[4.6+t*.94,.95,-45.5-t*.34],r:[0,.35,0],c:$,surf:X(1)});[r0,C0,Z,oe,V].forEach((t,n)=>{const r=2.5+n*1.05,o=-44.75-n*.37;f.add(J(.48,.34,.16,12),{p:[r,2.23,o],c:V,surf:d0}),f.add(J(.4,.4,.03,12),{p:[r,2.31,o],c:t,surf:[.95,0,.06,1]}),n%2===0&&I(f,[r-.5,2.36,o-.5],[r+.4,2.36,o+.55],.07,.07,_,{bamboo:!0})})}const Ue=g0.makeBuilder();Ue.add(J(.07,.07,1.5,6),{r:[L/2,0,0],c:_,surf:w0(2)}),Ue.add(new d.ConeGeometry(.1,.4,6),{p:[0,0,.95],r:[L/2,0,0],c:r0,surf:d0});const Ee=V0(Ue.build(),6.4,2.23,-46.2);Ee.rotation.y=.35,await a.yield(),I(f,[-15,1.7,-19],[-14,1.7,-29],1,1,Ge,{surf:w0(2)});for(const e of[-21,-27])f.add(j(2.2,1.2,1.4),{p:[-14.5-(e+24)*.1,.6,e],c:$,surf:X(0)});f.add(j(.07,1.7,.55),{p:[-15,2.7,-19.6],c:"#a8acb0",surf:[.92,0,0,1]}),f.add(J(.11,.11,.9,6),{p:[-15,3.9,-19.6],c:$,surf:X(1)});for(let e=0;e<9;e++)I(f,[-17.5+e*.16,.15+e%3*.1,-18-e0()*2],[-17.2+e*.3,.15+e%3*.1,-29-e0()*2],.22,.06,U(_,V,e0()*.4),{bamboo:!0});for(let e=0;e<14;e++)f.add(n0(1,13,6),{p:[e0.range(-20,20),0,e0.range(-72,-14)],s:[e0.range(.7,1.7),.34,e0.range(.7,1.7)],r:[0,e0()*3,0],c:U(V,_,e0.range(.55,.85)),surf:s0});await a.yield();for(const[e,t,n,r]of[[17.5,-17,-.5,S.verm],[-19,-35,.6,S.sky],[19.5,-60,-.7,S.virid],[-19.5,-70,.5,S.gilt]]){const o=new d.Matrix4().makeRotationY(n).setPosition(e,0,t);for(const i of[-1,1])I(f,[3.4*i,0,0],[3.4*i,9.4,0],.3,.3,E,{pre:o}),I(f,[3.4*i,0,-2],[3.4*i,.2,2],.3,.3,$,{pre:o});for(const i of[9.2,1])I(f,[-3.6,i,0],[3.6,i,0],.26,.26,_,{pre:o,bamboo:!0});H0("sheet",e,9.1,t,0,6.3,n,0,r,r===S.gilt?S.verm:S.gilt,0,!1)}await a.yield(),f.add(j(9,1.5,3.2),{p:[14.5,.75,-72],r:[0,.2,0],c:$,surf:X(0)}),f.add(j(8.4,.1,2.6),{p:[14.5,1.46,-72],r:[0,.2,0],c:"#20302c",surf:[.97,0,0,1]});for(let e=0;e<4;e++)f.add(new d.TorusGeometry(2.5,.08,4,24),{p:[12.2+e*1.5,3,-71.5-e*.3],r:[0,1.2+e*.1,.1*e],c:_,surf:w0(0)});const T0=[-13,5.4,-66];for(const e of[-1,1]){for(const t of[-3.2,3.2])I(f,[T0[0]+2*e,0,T0[2]+t],[T0[0]+2*e,T0[1]+.3,T0[2]],.45,.45,$);I(f,[T0[0]+2*e,.25,T0[2]-3.6],[T0[0]+2*e,.25,T0[2]+3.6],.5,.5,$)}const _t=V0(Aa(),...T0);await a.yield();const M0=[8.6,9.6,-72],k0=1.35;{const[e,t,n]=M0,r=1.2*k0;f.add(J(r+.08,r+.08,.18,18),{p:[e,t,n],c:E,surf:X(0,.5)}),f.add(J(r+.14,r+.14,.1,18),{p:[e,t-.12,n],c:U($,r0,.5),surf:d0});for(let o=0;o<20;o++){const i=o/20*_0,s=Math.cos(i),c=Math.sin(i);I0(f,[[e+s*r,t,n+c*r],[e+s*r,t+1.9*k0,n+c*r],[e+s*r*.72,t+2.6*k0,n+c*r*.72],[e+s*.08,t+3*k0,n+c*.08]],.038,_,w0(1),{seg:6,rad:3}),(o&3)===3&&await a.yield()}for(const[o,i]of[[.95,r],[1.9,r],[2.6,r*.72]])f.add(new d.TorusGeometry(i,.05,4,20),{p:[e,t+o*k0,n],r:[L/2,0,0],c:_,surf:w0(0)});f.add(n0(.22,8,6),{p:[e,t+3.05*k0,n],c:Z,surf:N0}),f.add(J(.05,.05,W0-t-3*k0,4),{p:[e,(W0+t+3*k0)/2,n],c:U(V,_,.5),surf:s0}),f.add(J(.06,.06,2.3*k0,5),{p:[e,t+.8*k0,n-.45],r:[0,0,L/2],c:_,surf:w0(0)}),f.add(J(.06,.06,2.1*k0,5),{p:[e,t+1.6*k0,n+.5],r:[0,0,L/2],c:_,surf:w0(0)}),f.add(J(.26,.2,.28,8),{p:[e+1,t+.24,n+.7],c:Qe,surf:d0});for(let o=0;o<3;o++)H0("tassel",e,t-.15,n,0,1.6+o*.3,o*2.1,0,S.verm,S.gilt,0,!1)}const Ne=V0(Ma(),M0[0],M0[1]+1.2,M0[2]-.35);Ne.scale.setScalar(1.65);for(const[e,t]of[[1,-42],[-1,-118]]){const n=30.3*e,r=7.25;f.add(j(1.4,.22,3.4),{p:[n,7.02,t],c:E,surf:X(2,.4)});for(const o of[-.9,.9]){f.add(J(.62,.44,.5,10),{p:[n,r+.14,t+o],c:o<0?U(Qe,V,.5):U(C0,"#9fc7b5",.6),surf:d0});for(let i=0;i<9;i++){const s=i*2.4+o,c=.12+i%3*.1,u=1.5+i%4*.3,h=Math.cos(s)*c*u,v=Math.sin(s)*c*u;if(I(f,[n+Math.cos(s)*.2,r+.3,t+o+Math.sin(s)*.2],[n+h,r+.3+u,t+o+v],.13,.03,U("#3f7f3a",Ge,i%3*.3),{surf:E0}),i%3===0){const B=[n+h*1.1-.12*e,r+.35+u,t+o+v*1.1],C=new d.CircleGeometry(.24,6);C.rotateY(-L/2*e),f.add(C,{p:B,c:"#f8f3e4",surf:[.2,0,.12,1]}),f.add(n0(.09,6,4),{p:[B[0]-.06*e,B[1],B[2]],c:Z,surf:[.3,0,.2,1]})}}}}let ce=null;if(D==="rain"){const n=new d.CylinderGeometry(1,.8,1.5,18,1,!0);f.add(n,{p:[-4.4,.75,-61],c:E,surf:X(1,.4)});for(const s of[.3,1.2])f.add(new d.TorusGeometry(s>1?.99:.86,.045,4,18),{p:[-4.4,s,-61],r:[L/2,0,0],c:"#6a6e72",surf:[.9,0,0,1]});f.add(new d.CircleGeometry(.95,18),{p:[-4.4,1.12,-61],r:[-L/2,0,0],c:"#55626a",surf:[.97,0,0,1]}),f.add(new d.TorusGeometry(.9,.04,4,12,L),{p:[-4.4,1.5,-61],r:[0,.5,0],c:"#6a6e72",surf:[.9,0,0,1]}),f.add(n0(1,12,5),{p:[-4.4+.4,0,-61+.3],s:[2.3,.03,1.9],c:"#3a2c20",surf:[.9,0,0,1]});const r=(s,c,u)=>{const h=g0.makeBuilder();return h.add(s,{c,surf:u}),h.build()},o=[0,1,2].map(()=>V0(r(n0(.075,6,5),"#dfe8ee",[.95,0,.5,1]),-4.4,20,-61)),i=V0(r(new d.TorusGeometry(.5,.03,4,16).rotateX(L/2),"#c8d4da",[.95,0,.25,1]),-4.4,1.14,-61);ce={drops:o,ring:i,top:u0(-4.4)-1,x:-4.4,z:-61}}await a.yield();const we=.5,Pt=U(V,_,.5),It=[[S.verm,S.gilt],[S.cream,S.verm],[S.virid,S.gilt],[S.gilt,S.verm],[S.gilt,S.cream],[S.verm,S.cream],[S.cream,S.virid]],st=(e,t,n,r,o)=>f.add(new d.TorusGeometry(r,.07,4,8),{p:[e,t,n],r:o===0?[0,L/2,0]:o===1?[L/2,0,0]:[0,0,0],c:r0,surf:s0}),Re=(e,t,n)=>{const r=u0(e)-.9;f.add(J(.07,.07,r-t,4),{p:[e,(r+t)/2,n],c:Pt,surf:s0})},Ft=D==="rain"?.5:D==="snow"?.22:0,it=[V,U(V,Z,.6),Z,U(Z,r0,.5),r0,r0,"#a3202a",U(C0,V,.32),C0,C0,U(C0,"#0d4a44",.5)].map(e=>U(e,"#cfd0cc",Ft)),Ht=it.map(e=>F(e,.9)),Tt=3.65,pe=27.25;for(let e=0;e<11;e++){const t=272+e*8,n=M(t),r=p0(t),o=Math.max(g(t),z0(t)),i=e%2===1,s=-6-t+(i?1.3:0);if(!i){I(f,[-19.6,pe+.15,s],[19.6,pe+.15,s],.3,.3,_,{bamboo:!0});for(const c of[-17,-6,6,17])Re(c,pe+.3,s),st(c,pe+.15,s,.3,0)}for(let c=0;c<14;c++){const u=-23.7+c*Tt+e0.range(-.12,.12),v=Ht[J0(e+(e0()<.15?e0()<.5?-1:1:0),0,10)].clone().multiplyScalar(e0.range(.84,1.06)),B=e<4?S.verm:S.gilt,C=Math.min(pe,u0(u)-1.8),b=s+(c%2?.22:-.22),A=e0.range(-.1,.1);if(Math.abs(u-n)<7.2||Math.abs(u-r)<5.4||Math.abs(u)<2.6)H0(C-8.5>=o+3.8?"valanceL":"valance",u,C,b,0,3.4,A,0,v,B,we,!1);else{const T=C-(Math.abs(u)>21?8.8:4.4);T>=18.6?H0("bolt",u,C,b,0,J0(T/6.2,3,3.6),A,0,v,B,we,!1):H0("boltS",u,C,b,0,J0(T/4.6,2.6,3.6),A,0,v,B,we,!1)}}e&1&&await a.yield()}const Ke=[];for(let e=0;e<5;e++)for(const t of[-1,1]){const n=276+e*16,r=J0(M(n)+t*(11.6+e%2*1.6),-21,21),o=-6-n,i=it[Math.min(10,Math.round((n-272)/8))];f.add(J(3,2.7,2.6,18),{p:[r,1.3,o],c:U(E,_,.2),surf:X(1,.4)}),f.add(new d.CircleGeometry(2.86,18),{p:[r,2.42,o],r:[-L/2,0,0],c:i,surf:[.96,0,.14,1]});for(const[s,c]of[[.6,2.84],[2.1,2.98]])f.add(new d.TorusGeometry(c,.07,4,18),{p:[r,s,o],r:[L/2,0,0],c:"#5a5e62",surf:[.9,0,0,1]});I(f,[r-t*1.2,2.2,o+.8],[r-t*3.4,6.4,o+2.2],.16,.16,_,{bamboo:!0});for(const[s,c]of[[-3.9,1.4],[3.6,-2.2]])f.add(J(.6,.48,.9,9),{p:[r+s,.45,o+c],c:E,surf:X(1,.4)}),f.add(new d.CircleGeometry(.52,9),{p:[r+s,.8,o+c],r:[-L/2,0,0],c:i,surf:[.96,0,.1,1]});Ke.push([r,o]),await a.yield()}await a.yield();const xe=10.6,Oe=17.6,me=24.6;[627.5,644].forEach((e,t)=>{const n=-6-e;for(const[o,i,s]of[[0,0,_],[.3,.22,U(_,Ge,.4)],[-.28,-.2,U(_,V,.3)]])f.add(new d.TorusGeometry(xe+o,.17,6,72),{p:[0,Oe,n+i],c:s,surf:w0(0)});for(let o=0;o<18;o++){const i=o/18*_0+.17,s=new d.TorusGeometry(.42,.09,4,8);s.rotateY(L/2),s.rotateZ(i+L/2),f.add(s,{p:[Math.cos(i)*xe,Oe+Math.sin(i)*xe,n],c:o%3?r0:Z,surf:s0})}I(f,[-17.6,me,n+.4],[17.6,me,n+.4],.32,.32,_,{bamboo:!0});for(const o of[-17,-8,8,17])Re(o,me+.2,n+.4),st(o,me,n+.4,.32,0);Re(0,Oe+xe,n),[-13.2,-11.3,-9.4,-7.5,9.3,11.2,13.1,15].forEach((o,i)=>{const s=It[(i+t*3)%7],c=(i+t)%2===0;H0(c?"curtainL":"curtain",o,me-.1,n+.4+(i%2?.15:-.15),0,c?1.7:1.75,o<0?-.12:.12,0,s[0],s[1],we,!1)})}),await a.yield(),f=g0.makeBuilder(),De.push(f);{const e=-6-y0[0],t=-6-y0[1],n=(e+t)/2,r=e-t,o=l.fork("gallery");f.add(j(39.4,.5,r),{p:[0,v0+.25,n],c:$,surf:X(2,.3)});for(let c=e-2;c>t;c-=4)f.add(j(39.4,.6,.45),{p:[0,v0-.3,c],c:E,surf:X(0,.35)});f.add(j(39.8,1.5,.9),{p:[0,v0+.35,e+.45],c:E,surf:X(0,.5)}),f.add(j(39.8,.22,1),{p:[0,v0-.5,e+.5],c:r0,surf:[.85,0,.06,1]});for(let c=-9;c<=9;c++)f.add(n0(.24,6,4),{p:[c*2.05,v0+.35,e+.95],c:Z,surf:N0});const i=v0+1.1,s=U(V,_,.25);for(const c of[-1,1])f.quad([0,i,e],[19.4*c,i,e],[19.4*c,u0(19.4)-.6,e],[0,S0-.8,e],s,ae);for(let c=-4;c<=4;c++)I(f,[c*3.9,i,e+.1],[c*3.9,u0(c*3.9)-.9,e+.1],.3,.3,$);for(const c of[30.4,34.4,38.4,42.2]){const u=(S0-c)/.9375-1.2;I(f,[-u,c,e+.12],[u,c,e+.12],.26,.26,$)}await a.yield();for(const c of[-1,1]){const u=17.5*c;for(const h of[6.2,12.4,18.6,v0-.9])f.add(j(.36,.45,r),{p:[u,h,n],c:E,surf:X(2,.35)});for(let h=0;h*4<=r;h++){const v=e-h*4;if(f.add(j(.32,v0,.32),{p:[u,v0/2,v],c:$,surf:X(1,.3)}),h*4>=r)break;for(let B=0;B<4;B++){const C=o(),b=B*6.2+.5,A=B===3?v0-19.9:5.3;if(C<.4)for(let T=0;T<4;T++)f.add(j(.1,A,.5),{p:[u,b+A/2,v-.7-T*.87],c:U($,E,o()),surf:X(1,.25)});else C<.62&&f.add(j(.05,A-.5,3.3),{p:[u-.12*c,b+A/2,v-2],c:U(V,_,.15+.3*o()),surf:ae})}}await a.yield()}}{const e=[i0.z-i0.hl,i0.z+i0.hl];for(let s=0;s<Be;s++){const c=te(s);c>e[0]+1&&c<e[1]-1&&e.push(c)}e.sort((s,c)=>s-c);const t=i0.x1*q0,n=u0(i0.x1)-.9,r=q0*.1,o=-.995,i=U(V,_,.2);for(let s=0;s+1<e.length;s++){const c=Math.max(1,Math.round((e[s+1]-e[s])/6.2)),u=(e[s+1]-e[s]-1.4)/c;for(let h=0;h<c;h++){const v=e[s]+.7+h*u+.2,B=v+u-.4,C=5.6+(s+h)%2*.9,b=(A,T)=>[t+r*C*A,n+o*C*A,T];f.quad(b(0,v),b(0,B),b(1,B),b(1,v),i,ae);for(const A of[0,.5,1])I(f,b(A,v),b(A,B),.22,.22,E);for(const A of[v,(v+B)/2,B])I(f,b(0,A),b(1,A),.22,.22,E)}}}await a.yield();const A0=M(424)+11.6,ke=g(424)-.5,ct=-.44,lt={vermilion:{ground:r0,scallop:C0},azure:{ground:"#2a66b8",scallop:V},black:{ground:"#2b1b15",scallop:Z}}[Q.pick(["vermilion","azure","black","vermilion"])],je=[],Dt=ka(r0,Z);for(const[e,t]of[[-416,0],[-430,1],[-444,2]]){const n=new d.Matrix4().makeRotationY(ct).setPosition(A0,ke,e),r=await xa(f,n,t,lt,a.yield);for(const o of r.eyes){const i=V0(Dt,0,0,0);i.position.copy(o.p).applyMatrix4(n),i.quaternion.setFromUnitVectors(new t0(0,0,1),o.dir.clone().transformDirection(n)),je.push({m:i,rate:5+je.length*.9,q:i.quaternion.clone()})}r.beard.forEach((o,i)=>{const s=new t0(o[0],o[1],o[2]).applyMatrix4(n);H0("tassel",s.x,s.y,s.z,0,o[3],ct+k.range(-.6,.6),0,i%3?F(lt.ground,.8):S.gilt,S.cream,0,!1)});for(const o of[-2.6,2.4]){const i=new t0(-2.9,-2.8,o).applyMatrix4(n),s=new t0(2.9,-2.8,o).applyMatrix4(n);I(f,i.toArray(),s.toArray(),.45,.45,E)}await a.yield()}{const e=ke-3.25;for(const t of[-1,1]){const n=A0+2.3*t;I(f,[n,e,-405],[n,e,-455],.5,.6,E),[-408,-423,-437,-452].forEach((r,o)=>{I(f,[n,0,r],[n,e,r],.7,.7,$,{gloss:.35}),f.add(j(1.3,.8,1.3),{p:[n,.4,r],c:"#8a7f6c",surf:he}),o<3&&I(f,[n,1.5+o%2*.01,r],[n,e-1,r-14+(o===2?-1:0)],.35,.35,E)})}for(const t of[-408,-423,-437,-452])I(f,[A0-2.3,e-5,t],[A0+2.3,e-5,t],.4,.4,E),I(f,[A0-2.3,7,t],[A0+2.3,e-5.5,t],.3,.3,E);for(const t of[-1,1])I(f,[A0-6.2+.9*t,0,-426],[A0-2.7+.9*t,e+.6,-426],.22,.22,_,{bamboo:!0});for(let t=1;t<13;t++){const n=t/13;I(f,[A0-7.1+3.5*n,(e+.6)*n,-426],[A0-5.3+3.5*n,(e+.6)*n,-426],.14,.14,_,{bamboo:!0})}}await a.yield();{const e=[[8.6,0],[8.6,1.4],[9,1.75],[9.6,1.75],[9.95,1.4],[10.7,1.3],[11,.95],[11,0]].map(o=>new d.Vector2(o[0],o[1])),t=new d.LatheGeometry(e,56);t.rotateX(L/2),f.add(t,{p:[0,18,f0],c:E,surf:X(0,.5)}),f.add(new d.TorusGeometry(8.8,.24,6,56),{p:[0,18,f0+1.6],c:r0,surf:[.85,0,.08,1]}),await a.yield();for(let o=0;o<28;o++){const i=o/28*_0;f.add(n0(.26,7,5),{p:[Math.cos(i)*10.35,18+Math.sin(i)*10.35,f0+1.36],c:Z,surf:N0})}const n=[[19.05,0],[19.05,.95],[19.45,1.3],[20,1.3],[20.4,.9],[20.4,0]].map(o=>new d.Vector2(o[0],o[1])),r=new d.LatheGeometry(n,72);r.rotateX(L/2),f.add(r,{p:[0,18,f0],c:E,surf:X(0,.5)});for(let o=0;o<44;o++){const i=(o+.5)/44*_0;18+Math.sin(i)*19.72>.4&&f.add(n0(.24,6,4),{p:[Math.cos(i)*19.72,18+Math.sin(i)*19.72,f0+1.1],c:Z,surf:N0})}for(let o=0;o<12;o++){const i=o/12*_0,s=Math.cos(i),c=Math.sin(i);I(f,[s*10.9,18+c*10.9,f0+.42],[s*19.2,18+c*19.2,f0+.42],.62,.8,o%3?$:E,{gloss:.4}),18+c*15.2>.5&&f.add(n0(.3,7,5),{p:[s*15.2,18+c*15.2,f0+.95],c:Z,surf:N0})}f.add(new d.TorusGeometry(15.2,.2,5,72),{p:[0,18,f0+.5],c:E,surf:X(0,.5)}),f.add(j(46,1.3,2.4),{p:[0,.65,f0+1.1],c:"#8a7f6c",surf:he}),f.add(j(44,.4,2),{p:[0,1.5,f0+1],c:"#9a8f7a",surf:he});for(let o=0;o<7;o++){const i=(.16+o/6*.68)*L,s=Math.cos(i)*11.4,c=18+Math.sin(i)*11.4;I(f,[s,c,f0+.4],[s*1.04,c+.5,f0+4.6],.12,.12,_,{bamboo:!0}),H0("pennant",s*1.04,c+.45,f0+4.4,0,1.6,.2*(o-3),0,[S.verm,S.gilt,S.virid][o%3],S.cream,0,!1)}}await a.yield();for(let e=5;e<Be;e++)for(const t of[-1,1]){const n=te(e),r=-6-n,o=16*t;if(Math.abs(o-M(r))>12.5)continue;const s=g(r),c=-t;f.add(new d.TorusGeometry(.7,.2,5,12),{p:[o+c*.85,s-.5,n],r:[0,L/2,0],c:U(V,_,.45),surf:s0}),f.add(J(.06,.06,.5,4),{p:[o+c*.8,s+.2,n],r:[0,0,L/2],c:oe,surf:d0}),f.add(j(1.1,1.5,.05),{p:[o,s+2.2,n+.69],c:V,surf:E0}),f.add(j(.5,.5,.06),{p:[o,s+2.5,n+.71],c:r0,surf:E0});for(let u=0;u<5;u++)I(f,[o+c*(1.6+u*.22),0,n-1+u*.4],[o+c*.75,15+u*.6,n-.4+u*.15],.2,.08,U(_,V,u*.08),{bamboo:!0});await a.yield()}await a.yield();const ft={great:.95,swallow:.95,butterfly:.78,goldfish:1.9,cicada:.95,eagle:.55,ladder:26,lantern:1.45,lanternT:1.9},le=Q.pick(["swallow","butterfly","cicada","swallow"]),ze=new t0(0,18,-770),fe=e=>k()>z.accent*(e?2:1)?k()<.5?[S.cream,S.pale]:[S.pale,S.cream]:[k.pick(e?[S.verm,S.gilt,S.gilt]:[S.verm,S.virid,S.gilt]),k.pick([S.gilt,S.cream,S.virid,S.verm])],qt=()=>D==="lantern"&&k()<.36?1:0,ut=(e,t)=>{const n=Math.round((2-t)/Le);return Math.abs(t-te(n))<.8&&Math.abs(e)<19?W0-.6:u0(e)-1},dt=[],pt=[];for(let e=436;e<757;e+=7)pt.push([e,p0(e),z0(e)]);const Vt=(e,t,n,r,o)=>{if(r<444)return!1;for(const[i,s,c]of pt){if(i>r-5)break;const u=(r-i)/(764-i),h=s*(1-u),v=h0(c,ze.y,u),B=11.6*u+1.1,C=Math.max(Math.abs(e-h)-o,0),b=n<v?v-n:t>v?t-v:0;if(C*C+b*b<B*B)return!0}return!1},mt=(e,t,n,r,o,i=!1)=>{const s=-6-n,c=ft[o]*r,u=r*.5,h=t-c;if(s<14||s>760||h<7.5||Math.abs(e)+u>30.5||!i&&(s>se[0]-3&&s<se[1]+1||s>y0[0]+1&&s<y0[1]-1&&Math.abs(e)-u<20.6||s<y0[0]+1&&s>y0[0]-2.5&&Math.abs(e)-u<20&&t>v0-2||Bt(e,t-c*.5,n)))return!0;const v=p0(s),B=z0(s);if(Math.abs(e-v)-u<4.8&&h<B+3.7&&t>B-5.5||s<186&&Math.abs(e)-u<(s<150?9:10.5)&&h<15+s*.19)return!0;const C=M(s),b=g(s);if(Math.abs(e-C)-u<5.8&&h<b+3.6&&t>b-8)return!0;for(const T of[40,120,260]){const c0=Math.max(0,s-T),m0=(s-c0)/(764-c0),a0=h0(p0(c0),ze.x,m0),l0=h0(z0(c0),ze.y,m0);if(Math.abs(e-a0)-u<1.2+(1-m0)*1.6&&h<l0+1.5&&t>l0-1.8)return!0}if(Vt(e,h-.5,ut(e,n),s,u+.4)||s>622&&s<649.5&&Math.abs(e)-u<18.6&&h<30||n<-402&&n>-458&&e>A0-7&&e<A0+9&&h<ke+8)return!0;for(const T of dt)if((e-T[0])**2+(t-c/2-T[1])**2*.6+((n-T[2])*2.5)**2<(T[3]+u)**2)return!0;return!1},U0=(e,t,n,r,o,i,s,c,u)=>{if(!u&&mt(t,n,r,o,e))return!1;const h=ut(t,r),v=Math.max(.5,h-n);return H0(e,t,h-v,r,v,o,i,s,c[0],c[1],qt()),!0};U0("great",0,29.6,-161,20,0,1.15,[S.ink,D==="rain"?S.pale:S.verm],!0);{const t=M(229)-11.6,n=g(229)+6.4;U0("butterfly",t,n,-235,12,.45,.25,D==="rain"?[S.pale,S.cream]:[S.virid,S.gilt],!0),dt.push([t,n-4.5,-235,7])}const Ut=["swallow","butterfly","cicada","swallow","butterfly","eagle",le,le];let Et=0;for(let e=84;e<752;e+=4.7/w){const t=M(e),n=g(e),r=-6-e+k.range(-1.5,1.5),o=k.pick(Ut);if(k()<.62){const i=k()<.5?-1:1,s=k.range(2.1,4.2),c=6.7+s*.5+k()*3.2,u=n+k.range(-.4,4.6),h=-i*.35+k.range(-.4,.4),v=fe();for(const B of[0,3.5,7,10.5])if(U0(o,t+i*(c+B),u,r,s,h,.12,v))break}else{const i=k.range(2,3.3);U0(o,t+k.range(-4.6,4.6),n+3.75+ft[o]*i+k()*2.4,r,i,k.range(-.5,.5),k.range(.45,.85),fe())}(++Et&31)===0&&await a.yield()}for(let e=0,t=Math.round(104*w*p);e<t;e++){const n=k.range(se[1]+3,412),r=M(n),o=g(n),i=k.range(1.5,2.6),s=-6-n;if(k()<.8){const c=k()<.5?-1:1;U0("goldfish",r+c*(6.3+i*.5+k()*9),o+k.range(-1.5,5.5),s,i,-c*.3+k.range(-.5,.5),.1,fe(!0))}else U0("goldfish",r+k.range(-5.5,5.5),o+3.7+1.9*i+k()*3,s,i,k.range(-.6,.6),.2,fe(!0));(e&31)===31&&await a.yield()}for(let e=0,t=Math.round(130*w*p);e<t;e++){const n=k.range(y0[1]+2,748),r=k.range(-23,23),o=k.range(2.4,6),i=Math.max(g(n)+(Math.abs(r)<9?7.5:4.2)+.78*o,k.range(23,Math.min(37,u0(r)-2))),s=k.range(-.7,.7),c=k.range(.5,1),u=fe();for(const h of[0,3,6])if(i+h<u0(r)-1.5&&U0("butterfly",r,i+h,-6-n,o,s,c,u))break;(e&31)===31&&await a.yield()}for(let e=0;e<14;e++){const t=k.range(-27,-11);U0("eagle",t,k.range(24,Math.min(31,u0(t)-6)),-6-k.range(y0[1]+4,742),k.range(5,8),k.range(.1,.7),k.range(.3,.7),[S.pale,S.cream])}const Nt=["swallow","butterfly","goldfish","cicada","eagle","ladder",le,le,le,le];for(let e=0,t=Math.round(430*w*p);e<t;e++){const n=k.pick(Nt),r=k.range(-29,29),o=-6-k.range(14,758),i=Math.min(40,u0(r)-1.6),s=k.range(Math.min(13,i),i),c=n==="ladder"?k.range(.45,.7):s>26&&k()<.22?k.range(5,9):k.range(1.8,4.8);U0(n,r,s,k()<.4?te(Math.round((2-o)/Le))+k.range(-.5,.5):o,c,k.range(-.8,.8),s>24?k.range(.3,.9):k.range(0,.3),fe(n==="goldfish")),(e&31)===31&&await a.yield()}await a.yield();{const e=l.fork("lanterns"),t=-6-y0[0],n=-6-y0[1],r=v0-.65,o=[F("#ffe9c4",.9),F("#f6c36a",.9),F(r0,.9),F("#ffd49a",.9),F("#e8642a",.9),F("#ffe9c4",.9)],i=(s,c,u,h,v)=>{const B=e()<.3?"lanternT":"lantern",C=B==="lanternT"?h*.8:h;return mt(s,c,u,C,B,!0)?!1:(H0(B,s,c,u,v-c,C,e()*6,0,e.pick(o),e()<.5?S.verm:S.gilt,2),!0)};for(let s=0;s<28;s++)for(const c of[-1,1])[11.4,16.6,21.8].forEach((u,h)=>{const v=t-1.4-s*4-h*1.1;v<n+1||!i(15.4*c,u,v,e.range(2.2,2.7),u+.4)||I(f,[17.5*c,u+.45,v],[15.2*c,u+.45,v],.13,.13,_,{bamboo:!0})});await a.yield();for(let s=t-3;s>n+3;s-=4.8)for(const c of[-12.2,-7.6,-3,1.6,6.2,10.8]){const u=c+e.range(-.8,.8),h=s+e.range(-1.2,1.2),v=e.range(.4,3.2),B=e.range(1.8,3);i(u,r-v,h,B,r)||i(u,r-.4,h,1.8,r)}}let D0=null;if(y.rare){D0={items:[],sets:[]};for(const t of["great","goldfish","torn"]){const n=re[t]().geo,r=t==="torn"?12:6,o=new d.InstancedBufferAttribute(new Float32Array(r*4),4),i=new d.InstancedBufferAttribute(new Float32Array(r*4),4),s=new Float32Array(r*4),c=new Float32Array(r*3);o.setUsage(d.DynamicDrawUsage),i.setUsage(d.DynamicDrawUsage);for(let u=0;u<r;u++){const h=[F(r0),F(r0,.92),F(r0)][u%3],v=[F(Z),F(V,.9),F(Z)][u%3];s.set([h.r,h.g,h.b,D==="lantern"?1:0],u*4),c.set([v.r,v.g,v.b],u*3)}n.setAttribute("aH",o),n.setAttribute("aI",i),n.setAttribute("aC1",new d.InstancedBufferAttribute(s,4)),n.setAttribute("aC2",new d.InstancedBufferAttribute(c,3)),n.instanceCount=r,F0(n,tt,1),D0.sets.push({H:o,I:i})}const e=16;for(let t=0;t<12;t++){const n=t%2===1,r=t<8,o=r?t>>1:t-8,i=(r?t:t>>1)%2?1:-1,s=n?k.range(3.5,4.1):k.range(5,5.6),c=r?9+o*4.6+k()*1.5:31+o*8.5+k()*3,u=.59+(r?o*.004:.002+o*.003),h=(r?.885+o*.012:.86+o*.006)+(i>0?.005:0),v={set:t%2,idx:t>>1,i:t,side:i,S:s,ahead:c,ut:u,uOut:h,s0:u*764+c+e,pull:(764*(1-h)-c+2)/(h-.75)**2,lat:(r?8.3+o%2*1.5:7.4)+s*.12+k()*.8,up:r?[-.6,2.6,.8,3.4][o]+k.range(-.4,.4):k.range(.5,3.6),lane:3.4+t%3*1.5,high:3.4+t*5%4*.8,ph:k()*6};D0.items.push(v);const B=M(v.s0)+i*v.lat,C=g(v.s0)+v.up,b=u0(B)-1;X0.H.push(B,b,-6-v.s0,b-C),X0.I.push(s,0,v.ph,0)}D0.LAG=e}const Rt=new d.Quaternion,Kt=new t0(0,0,1);function Ot(e,t){const n=D0.LAG;for(const r of D0.items){const o=Math.max(0,(e-r.ut)*764),i=r.pull*Math.max(0,e-.75)**2,s=j0(3,30,o),c=o>0?1:0,u=r.s0+o-n*(1-Math.exp(-o/n))+i+1.8*Math.sin(t*.55+r.ph)*s,h=j0(578,620,u),v=j0(724,762,u),B=h0(r.lat+.7*Math.sin(t*.8+r.ph*2)*s,r.lane,h),C=h0(M(u)+r.side*B,r.side*r.lane*.45,v),b=g(u)+r.up-2.2*Math.sin(Math.min(1,o/34)*L)+.8*Math.sin(t*1.7+r.ph)*s,A=h0(h0(b,g(u)+r.high,h),16.4+r.high*.55,v),T=r.S*(1-j0(755,764,u)),c0=-r.side*.3*(1-s)+c*((1-s)*o*.24*r.side+(.75-.4*h)*Math.sin(t*1.15+r.ph)*s),m0=c?h0(.12+o*.3,-.95+(.45-.25*h)*Math.sin(t*1.9+r.ph*1.3),s):.12,a0=D0.sets[r.set],l0=r.idx*4,G0=D0.sets[2],O0=r.i*4;a0.H.array[l0]=C,a0.H.array[l0+1]=A,a0.H.array[l0+2]=-6-u,a0.H.array[l0+3]=0,a0.I.array[l0]=T,a0.I.array[l0+1]=c0,a0.I.array[l0+2]=r.ph,a0.I.array[l0+3]=m0,G0.H.array[O0]=C,G0.H.array[O0+1]=A,G0.H.array[O0+2]=-6-u,G0.H.array[O0+3]=0,G0.I.array[O0]=c*s*T*1.7,G0.I.array[O0+1]=c0*.5,G0.I.array[O0+2]=r.ph+2,G0.I.array[O0+3]=m0-.25}for(const r of D0.sets)r.H.needsUpdate=!0,r.I.needsUpdate=!0}let jt=0;for(const e of Object.keys(ge)){const t=ge[e],n=re[e]().geo;n.setAttribute("aH",new d.InstancedBufferAttribute(new Float32Array(t.H),4)),n.setAttribute("aI",new d.InstancedBufferAttribute(new Float32Array(t.I),4)),n.setAttribute("aC1",new d.InstancedBufferAttribute(new Float32Array(t.C1),4)),n.setAttribute("aC2",new d.InstancedBufferAttribute(new Float32Array(t.C2),3)),n.instanceCount=t.H.length/4,jt+=n.instanceCount,F0(n,tt,1),await a.yield()}{const e=new d.InstancedBufferGeometry;e.setAttribute("position",new d.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),e.setIndex([0,1,2,0,2,3]),e.setAttribute("aH",new d.InstancedBufferAttribute(new Float32Array(X0.H),4)),e.setAttribute("aI",new d.InstancedBufferAttribute(new Float32Array(X0.I),4)),e.instanceCount=X0.H.length/4,F0(e,R0(ua,da,{uniforms:{uCol:{value:F(D==="lantern"?"#0c1438":"#3a2a1a",1)}},side:d.DoubleSide,transparent:!0,depthWrite:!1}),2)}await a.yield();for(const e of De){for(const t of e.buildChunks(8,780))F0(t,Te,0,!0);await a.yield()}F0(ye.build(),Te,0),await a.yield();const $0=L0.clone().multiplyScalar(-1),Zt=L0.y>.45,ht=z.shaft[1]>0;{const e=[],t=[];[24,60,100,150,205,236,366,398,436,590,668,712].forEach((o,i)=>{const s=Zt&&i>=2,c=s?1.5:1.25,u=te(Math.round((2-(-6-o)-8)/Le))-8+i*37%7-3,h=s?q0*[0,0,27.5,29.2,13,16,19,12,15,18,19.4,19.4][i]:q0*31.9,v=new t0(h,s?u0(h)-.15:9.2+i*29%5,s?u:-6-o),B=Math.min(v.y/Math.max(-$0.y,.05),(o0-1+h*q0)/Math.max(Math.abs($0.x),.05)),C=v.clone().addScaledVector($0,B);ht&&(Fe[i].set(v.x,v.y,v.z,c*1.1),He[i].set(C.x,C.z,c*1.25/Math.max(-$0.y,.22),c*1.35)),e.push(v.x,v.y,v.z,c*.82),t.push(C.x,C.y,C.z,i*.37)});const n=new d.InstancedBufferGeometry;n.setAttribute("position",new d.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]),n.setAttribute("aA",new d.InstancedBufferAttribute(new Float32Array(e),4)),n.setAttribute("aB",new d.InstancedBufferAttribute(new Float32Array(t),4)),n.instanceCount=ue;const r=F0(n,R0(zt,Mt,{uniforms:{uBeam:{value:.6}},side:d.DoubleSide,transparent:!0,depthWrite:!1,blending:d.AdditiveBlending}),5);r.visible=ht}{const e=[],t=[];for(let r=0;r<3;r++)for(let o=0;o<5;o++){const i=q0*h0(i0.x0+.6,i0.x1-.6,o/4),s=new t0(i,u0(i)-.2,i0.z+(r-1)*i0.hl*.62),c=Math.min(s.y/Math.max(-$0.y,.05),(o0-1+i*q0)/Math.max(Math.abs($0.x),.05)),u=s.clone().addScaledVector($0,c);e.push(s.x,s.y,s.z,1.2),t.push(u.x,u.y,u.z,3.1+r*1.7+o*.37)}const n=new d.InstancedBufferGeometry;n.setAttribute("position",new d.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]),n.setAttribute("aA",new d.InstancedBufferAttribute(new Float32Array(e),4)),n.setAttribute("aB",new d.InstancedBufferAttribute(new Float32Array(t),4)),n.instanceCount=15,F0(n,R0(zt,Mt,{uniforms:{uBeam:{value:.3},uShaft:{value:F(z.bay[0],z.bay[1]*.4)}},side:d.DoubleSide,transparent:!0,depthWrite:!1,blending:d.AdditiveBlending}),5)}{const e=new d.CircleGeometry(9.6,40);e.translate(0,18,f0-1.4),F0(e,R0(ha,va,{uniforms:{uZen:{value:F(z.zen,1.45)},uHor:{value:F(z.hor,1.6)},uMode:{value:z.sky},uFogK:{value:.3}}}),-1)}await a.yield();const Q0={value:0},K0=ee.fxGroup();G.add(K0.object),K0.add(ee.makeParticles({rng:l.fork("dust"),preset:"dust",time:Q0,count:Math.round(2400*p),box:[46,26,66],velocity:[0,.12,-2.4],...D==="lantern"?{colors:["#8fb0ff","#ffd9a0","#6f8fe0"]}:{}})),D==="snow"?K0.add(ee.makeParticles({rng:l.fork("snow"),preset:"snow",time:Q0,count:Math.round(1500*p),box:[50,30,80],velocity:[0,-.9,-4.5]})):K0.add(ee.makeParticles({rng:l.fork("petal"),preset:"petals",time:Q0,count:Math.round((D==="rain"?150:400)*p*w),box:[44,26,84],velocity:[0,-.35,-6.5],colors:["#f6c6cf","#f1a3b4","#fbe7e8"],size:[.16,.34]})),K0.add(ee.makeParticles({rng:l.fork("scrap"),preset:"leaves",time:Q0,count:Math.round(230*p),box:[44,24,84],velocity:[0,-.2,-8.5],colors:[V,"#e6d9b8",U(V,Z,.5)],size:[.16,.42]})),K0.add(ee.makeSmokeColumn({rng:l.fork("steam"),time:Q0,position:[be[0]+.9,be[1]+1,be[2]+.9],height:5.5,radius:[.2,1.3],size:[.7,2.6],count:22,color:"#f1ece2",colorTop:"#ffffff",shadowColor:"#b0a590",ambient:"#8a8070",opacity:.3,rate:.14,wind:[.1,0,-.5],sunDir:L0.toArray()}));for(const e of[3,4,8])K0.add(ee.makeSmokeColumn({rng:l.fork("vat"+e),time:Q0,position:[Ke[e][0],2.6,Ke[e][1]],height:13,radius:[1.4,4.2],size:[2.4,6.5],count:20,color:"#efe9de",colorTop:"#ffffff",shadowColor:"#a89c88",ambient:"#8a8070",opacity:.13,rate:.12,wind:[.1,0,-.7],sunDir:L0.toArray()}));await a.yield();const Wt={sunDir:L0.toArray(),sunColor:"#"+F(z.paperS[0]).getHexString(),sunIntensity:1.6,sky:"#"+F(z.paperR[0]).getHexString(),skyIntensity:.9,ground:U(z.fog,_,.4),groundIntensity:.55},Me=Ae.makeFauna(G,{light:Wt}),Ze={body:"#161d38",wingC:"#11172c",trail:"#18203a",tip:"#0a0e1c",head:"#161d38",belly:"#efe2c4",tailC:"#11172c"};Me.add(Ae.makeFlock({rng:l.fork("sw1"),species:"swifts",count:12,size:5.6,speed:15,spread:[10,4,16],...Ze,closed:!0,route:[[10,20,-30],[14,24,-90],[4,27,-170],[-12,25,-230],[-16,22,-150],[-10,18,-70],[-13,21,-20],[0,24,0]]}),{always:!0});const vt={value:0};{const e=[],t=[],n=[],r=(b,A,T,c0,m0=0)=>{for(const a0 of[b,A,T]){e.push(a0[0],a0[1],a0[2]),n.push(a0[3]||0,m0);const l0=c0||[a0[0]*6,a0[1]*6,(a0[2]-.1)*.6];t.push(l0[0],l0[1],l0[2])}},o=[0,0,.55,1],i=[0,0,-.5],s=[0,1,0],c=6,u=[[.4,.075,.07,.8],[.14,.15,.15,.3],[-.12,.13,.13,0],[-.34,.06,.06,0]].map(([b,A,T,c0])=>{const m0=[];for(let a0=0;a0<c;a0++){const l0=a0/c*_0;m0.push([Math.cos(l0)*A,Math.sin(l0)*T-.02,b,c0])}return m0});for(let b=0;b<c;b++){const A=(b+1)%c;r(o,u[0][b],u[0][A]),r(i,u[3][A],u[3][b]);for(let T=0;T<3;T++)r(u[T][b],u[T+1][b],u[T+1][A]),r(u[T][b],u[T+1][A],u[T][A])}for(const b of[-1,1]){const A=[[.07*b,0,.3,0],[.07*b,0,-.04,0],[.34*b,0,.26,.36],[.3*b,0,0,.36],[.62*b,0,.1,.68],[.56*b,0,-.1,.68],[.95*b,0,-.34,1]];r(A[0],A[2],A[1],s,1),r(A[1],A[2],A[3],s,1),r(A[2],A[4],A[3],s,1),r(A[3],A[4],A[5],s,1),r(A[4],A[6],A[5],s,1),r([0,0,-.3,0],[.24*b,0,-1,0],[.03*b,0,-.6,0],s,2)}const h=new d.InstancedBufferGeometry,v=64,B=new Float32Array(v*4),C=l.fork("stream");h.setAttribute("position",new d.Float32BufferAttribute(e,3)),h.setAttribute("normal",new d.Float32BufferAttribute(t,3)),h.setAttribute("aW",new d.Float32BufferAttribute(n,2));for(let b=0;b<v;b++){const A=b%2?-1:1,T=C.range(1.5,10.5);B.set([A*T,6.2+T*.3+C()*1.5,(b+C())*(126/v),C()*40],b*4)}h.setAttribute("aB",new d.InstancedBufferAttribute(B,4)),h.instanceCount=v,F0(h,R0(pa,ma,{uniforms:{uBird:vt},side:d.DoubleSide}),1)}Me.add(Ae.makeFlock({rng:l.fork("sw4"),species:"swifts",count:9,size:5.6,speed:14,spread:[8,3,14],...Ze,closed:!0,start:.5,route:[[-9,19,-40],[-14,23,-110],[0,26,-190],[13,24,-250],[17,21,-160],[11,17,-80],[12,20,-25],[0,23,-5]]}),{always:!0}),Me.add(Ae.makeFlock({rng:l.fork("sw3"),species:"swifts",count:8,size:5.6,speed:17,spread:[2.4,1.2,10],...Ze,closed:!0,route:[[10,31.5,-660],[10.5,31.5,-700],[10.5,32,-744],[6,33.5,-758.5],[-6,33.5,-758.5],[-10.5,32,-744],[-10.5,31.5,-700],[-10,31.5,-660],[-6,33,-646],[6,33,-646]]}),{always:!0}),await a.yield();const Yt=new t0(-9.3,ie+2.6,-52.6),Xt=new t0(M0[0],M0[1]+2,M0[2]),$t=new t0(A0-1.2,ke+.4,-441),Qt=new t0,We=new t0,Jt=new t0,ea=new t0,Ye=e=>-6-ne.pointAt(e,ea).z,ta=m.uSun.value.clone(),yt=new t0;let gt=0;const bt=[M0[0]-.3,M0[1]+.8*k0+.62,M0[2]-.45],wt=[M0[0]+.3,M0[1]+1.6*k0+.62,M0[2]+.5];return{scene:G,path:ne,duration:36,title:z.title,pace:e=>(.42+.68*j0(.05,.2,e))*(1-.16*H(e,.34,.38,.44,.48)-.2*H(e,.585,.62,.71,.75)),camera:{fov:62,near:.5,far:1700,lookAhead:26,sway:0,bank:.5},pois:[{at:Yt,from:0,to:.06,weight:.5},{at:Xt,from:.052,to:.084,weight:.4},{at:(e,t)=>K.body(Ye(t)+13,Qt),from:.085,to:.2,weight:.36},{at:(e,t)=>(K.body(Ye(t)+20,We),We.y+=2,We),from:.195,to:.32,weight:.5},{at:(e,t)=>K.body(Ye(t)+24,Jt),from:.462,to:.565,weight:.62},{at:$t,from:.5,to:.6,weight:.5},{at:ze,from:.575,to:1.06,weight:.9,fade:.14}],portal:{shape:"circle",radius:7,color:z.portal,glow:.9,revealDistance:300},post:{exposure:z.exposure,bloom:{strength:.32,radius:.6,threshold:.92},grade:{saturation:z.sat,contrast:1.05,tint:z.tint,shadowTint:z.shadow,vignette:.3,grain:.022,aberration:0}},ride:"none",update(e,t,n,r=0){Q0.value=t,yt.setFromMatrixPosition(n.matrixWorld);const o=J0(-6-yt.z,0,764),i=r>0?o/764:0;m.uSun.value.copy(ta).multiplyScalar(.93+.07*Math.sin(t*.37)+.03*Math.sin(t*1.1+2)),R.setProgress(i,o),R.update(e,t,n),K0.update(e,t,n),Me.update(e,t,n,r),D0&&Ot(i,t),vt.value=(i-.765)*764,gt+=e*(i<.1?5:.25+4.75*Math.exp(-(i-.1)/.05)),_t.rotation.x=gt,Ve.scale.set(1.5+.02*Math.sin(t*1.4),1.5+.07*Math.sin(t*1.4),1.5);const s=i-.012,c=t%5.2;de.rotation.z=-.3+(s>0?Math.exp(-s*60)*Math.sin(s*700)*.7:0)+(c<.45?Math.sin(c/.45*L*3)*.45:0);const u=t/1.5,h=Math.floor(u),v=j0(0,.2,u-h),B=h%2===0,C=B?bt:wt,b=B?wt:bt;Ne.position.set(h0(C[0],b[0],v),h0(C[1],b[1],v)+Math.sin(v*L)*.55,h0(C[2],b[2],v)),Ne.rotation.set(v>=1?.12*Math.sin(t*9):-.3*Math.sin(v*L),B?0:L,0),Ct.rotation.z=.075*Math.sin(t*2.3);const A=.55*Math.sin(t*.8);Ee.position.x=6.4+A,Ee.rotation.z=-A/.07;for(const T of je)T.m.quaternion.copy(T.q).multiply(Rt.setFromAxisAngle(Kt,t*T.rate+1.6*Math.sin(t*.7+T.rate)));if(ce){const c0=ce.top-1.2;ce.drops.forEach((a0,l0)=>{const G0=(t+l0*.5)%1.5/1.5;a0.position.y=ce.top-c0*G0*G0,a0.scale.set(1,1+5*G0,1)});const m0=t%.5/.5;ce.ring.scale.set(.25+1.5*m0,1-.9*m0,.25+1.5*m0)}},dispose(){R.dispose?.()}}}};export{Pa as default};
