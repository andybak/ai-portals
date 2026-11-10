import*as A from"three";import{makePath as Bt,clamp as p0,lerp as X0,smoothstep as U,bell as xt}from"../kit/core.js";import{mergeGeometries as tt}from"three/addons/utils/BufferGeometryUtils.js";import{buildHero as Vt,makeInk as l0,inkLoop as J,inkArc as y0,PAINT_VERT as Gt,PAINT_FRAG as O0,drawFish as yt,drawParrot as it,drawTurtle as Wt,drawSprig as Et}from"../parts/kohbar-lotus-room.js";const W=Math.PI*2,gt=["#F3EBD9","#1B1714","#E9A91C","#D8432B","#27407F","#3F8E3C","#E27A9A"],Y0=182,v0=Y0+4*Math.PI,M0=v0+74,B0=M0+4*Math.PI,m0=B0+182,$0=24,c0=v0+65,S0=v0+33,D0=33,Kt=R=>80-R,Q=R=>B0+R+102,H=R=>R.toFixed(4),et=`
#include <fog_pars_vertex>
`,at=`
#include <fog_vertex>
`,lt=`
#include <fog_pars_fragment>
`,ct=`
#include <fog_fragment>
`,Nt=`
uniform vec4 uWB;
void wallAt(float s, out vec2 p, out vec2 n) {
  if (s < ${H(Y0)}) { p = vec2(80. - s, 45.); n = vec2(0., -1.); }
  else if (s < ${H(v0)}) { float a = (s - ${H(Y0)}) / 8.; p = vec2(-102. - 8. * sin(a), 37. + 8. * cos(a)); n = vec2(sin(a), -cos(a)); }
  else if (s < ${H(M0)}) { p = vec2(-110., 37. - (s - ${H(v0)})); n = vec2(1., 0.); }
  else if (s < ${H(B0)}) { float a = (s - ${H(M0)}) / 8.; p = vec2(-102. - 8. * cos(a), -37. - 8. * sin(a)); n = vec2(cos(a), sin(a)); }
  else { p = vec2(-102. + (s - ${H(B0)}), -45.); n = vec2(0., 1.); }
}
float riverY(float s) { return 40. + max(14. * (1. - smoothstep(9., 25., abs(s - ${H(c0)}))), 16. * (1. - smoothstep(15., 33., abs(s - ${H(S0)})))); }
float wallOff(float s, float y) {
  float e = smoothstep(0., 8., s) * smoothstep(0., 8., ${H(m0)} - s) * smoothstep(3.2, 9., y);
  e *= smoothstep(0.5, 7., max(abs(s - ${H($0)}) - 8., y - 34.));
  e *= smoothstep(0.5, 7., length(max(vec2(abs(s - ${H(c0)}) - 8., abs(y - 35.) - 9.), 0.)));
  float b = 0.6 * sin(s * 0.07 + y * 0.05 + uWB.x) + 0.45 * sin(s * 0.043 - y * 0.08 + uWB.y)
          + 0.3 * sin(y * 0.17 + s * 0.11 + uWB.z) + 0.014 * (y - 30.) * sin(s * 0.021 + uWB.w);
  return b * e;
}
vec3 wallPos(float s, float y, float proud) {
  vec2 p, n; wallAt(s, p, n); float o = wallOff(s, y) + proud;
  return vec3(p.x + n.x * o, y, p.y + n.y * o);
}`;function Lt(R){const I=B=>{if(B<Y0)return[80-B,45,0,-1];if(B<v0){const b=(B-Y0)/8;return[-102-8*Math.sin(b),37+8*Math.cos(b),Math.sin(b),-Math.cos(b)]}if(B<M0)return[-110,37-(B-v0),1,0];if(B<B0){const b=(B-M0)/8;return[-102-8*Math.cos(b),-37-8*Math.sin(b),Math.cos(b),Math.sin(b)]}return[-102+(B-B0),-45,0,1]},g0=B=>40+Math.max(14*(1-U(9,25,Math.abs(B-c0))),16*(1-U(15,33,Math.abs(B-S0)))),P0=(B,b)=>{let S=U(0,8,B)*U(0,8,m0-B)*U(3.2,9,b);return S*=U(.5,7,Math.max(Math.abs(B-$0)-8,b-34)),S*=U(.5,7,Math.hypot(Math.max(Math.abs(B-c0)-8,0),Math.max(Math.abs(b-35)-9,0))),S*(.6*Math.sin(B*.07+b*.05+R[0])+.45*Math.sin(B*.043-b*.08+R[1])+.3*Math.sin(b*.17+B*.11+R[2])+.014*(b-30)*Math.sin(B*.021+R[3]))};return{at:I,off:P0,pos:(B,b,S=0,z0=new A.Vector3)=>{const o=I(B),T=P0(B,b)+S;return z0.set(o[0]+o[2]*T,b,o[1]+o[3]*T)},top:B=>60+36*(1-Math.min(45,Math.abs(I(B)[1]))/45),riverY:g0}}const Yt=`
attribute vec3 aW; varying vec3 vW; varying vec3 vP;
${et}
void main() { vW = aW; vP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition; ${at} }`,$t=`
uniform vec3 uGround, uInk, uAcc, uB, uSun, uFloor, uPaste, uSow, uMat, uSky, uRim, uWater, uDiscS, uRayS, uDiscM, uRayM, uLining, uReveal, uRecess, uRecessDot;
uniform float uTime, uPatchZ, uPatchOn, uHatch, uRevealK;
uniform vec3 uFlr, uLiningDot;                // floor lotus angles (big, small) and breathing clock; the niche's dots
uniform vec4 uDiscs;                        // sun s, sun y, moon s, moon y
varying vec3 vW; varying vec3 vP;
${lt}
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float ln(float d, float w) { float aw = max(fwidth(d), 1e-4); w = max(w, 0.75 * aw); return 1. - smoothstep(w - aw, w + aw, abs(d)); }
float fillTo(float d) { float aw = max(fwidth(d), 1e-4); return 1. - smoothstep(-aw, aw, d); }
float riverY(float s) { return 40. + max(14. * (1. - smoothstep(9., 25., abs(s - ${H(c0)}))), 16. * (1. - smoothstep(15., 33., abs(s - ${H(S0)})))); }
// a faceless disc with turning ray petals
vec3 rayDisc(vec3 col, vec2 d, vec3 cd, vec3 cr, float n, float turn, inout float k) {
  float r = length(d), a = atan(d.y, d.x + (abs(d.x) + abs(d.y) < 1e-4 ? 1e-4 : 0.)) + turn;
  float f = abs(fract(a * n / 6.2831853) - 0.5) * 2.;         // 0 on a ray's axis, 1 between rays
  float ray = (r - 5.4) - 4.6 * (1. - f * 1.25);
  col = mix(col, cr, fillTo(ray) * step(5.4, r));
  k = max(k, ln(ray, 0.09) * step(5.6, r));
  col = mix(col, cd, fillTo(r - 4.6));
  k = max(k, max(ln(r - 4.6, 0.12), ln(r - 5.4, 0.08)));
  float f2 = fract(a * n * 2. / 6.2831853) - 0.5;
  float dl = length(vec2(f2 * 6.2831853 / (n * 2.) * r, r - 3.5));
  col = mix(col, uGround, fillTo(dl - 0.26));
  k = max(k, ln(r - 2.3, 0.07));
  return col;
}
void main() {
  float part = vW.z; vec3 col = uGround; float k = 0.;
  if (part < 0.5) {
    // ---- plaster
    float s = vW.x, y = vW.y; vec2 p = vec2(s, y);
    float pxm = max(fwidth(s) + fwidth(y), 1e-4);
    float west = step(${H(Y0)}, s) * step(s, ${H(B0)});
    float top = 60. + 36. * (1. - min(abs(vP.z), 45.) / 45.);
    float db = (top - y) * mix(1., 0.781, west);
    float h = (db - 0.5) / 1.5, tri = 1. - abs(2. * fract(s / 1.9) - 1.), inB = step(0., h) * step(h, 1.);
    col = mix(col, h < tri ? uAcc : uB, inB);
    k = max(max(ln(db - 0.5, 0.08), ln(db - 2.0, 0.08)), ln((h - tri) * 1.5, 0.08) * inB);
    // the river: two hatched banks and running ripples between
    float d = y - riverY(s), ad = abs(d);
    float inR = fillTo(ad - 3.5);
    col = mix(col, uGround, inR);
    float rw = floor(d / 1.3 + 0.5), dd = d - rw * 1.3 - 0.3 * sin(s * 0.85 + uTime * 0.9 + rw * 2.1);
    float rip = ln(dd, 0.07) * step(ad, 2.6) * step(0.35, fract(s * 0.11 + rw * 0.37 + uTime * 0.05)) * (1. - smoothstep(0.25, 0.7, pxm));
    col = mix(col, uWater, rip);
    float arg = s * uHatch + d * 2.4 - uTime * 1.3, fw = max(fwidth(arg), 1e-3);
    float hatch = smoothstep(0.3 - fw, 0.3 + fw, sin(arg)) * (1. - smoothstep(0.7, 1.7, fw)) * step(2.95, ad) * step(ad, 3.5);
    k = max(k, max(hatch * 0.92, max(ln(ad - 2.95, 0.07), ln(ad - 3.5, 0.09))));
    // border round the doorway
    float dq = max(abs(s - ${H($0)}) - 8., y - 34.);
    float al = y > 34. - (abs(s - ${H($0)}) - 8.) ? s : y;
    float h2 = (dq - 0.5) / 1.6, tr2 = 1. - abs(2. * fract(al / 2.1) - 1.), in2 = step(0., h2) * step(h2, 1.);
    col = mix(col, h2 < tr2 ? uB : uAcc, in2);
    k = max(k, max(max(ln(dq - 0.5, 0.09), ln(dq - 2.1, 0.09)), ln((h2 - tr2) * 1.6, 0.08) * in2));
    // the vent under the west ridge
    vec2 dv = p - vec2(${H(v0+37)}, 87.5);
    float vt = max(abs(dv.x) * 1.25 + dv.y - 4.2, -dv.y - 3.2);
    col = mix(col, uSky, fillTo(vt));
    k = max(k, max(ln(vt, 0.14), ln(vt - 0.9, 0.07)));
    // sun and moon, high on the north wall
    float kd = 0.; vec3 c0 = col;
    col = rayDisc(col, (p - uDiscs.xy) * 1.75, uDiscS, uRayS, 16., -uTime * 0.14, kd);
    col = rayDisc(col, (p - uDiscs.zw) * 1.75, uDiscM, uRayM, 12., uTime * 0.1, kd);
    float nearDisc = min(length(p - uDiscs.xy), length(p - uDiscs.zw));
    k = max(k, kd);
    // sown marks: triads of dots and chevrons in every gap
    vec2 g2 = p / 2.7; vec2 id2 = floor(g2); float hs = hash(id2 + 3.1);
    vec2 f2 = (fract(g2) - 0.5) * 2.7 - (vec2(hash(id2 + 1.7), hash(id2 + 5.9)) - 0.5) * 1.1;
    float sow = step(3.2, db) * step(4.4, ad) * step(2.9, dq) * step(4.6, y) * step(6.6, nearDisc) * step(1.6, vt);
    float tri3 = min(length(f2 - vec2(0., 0.3)), min(length(f2 - vec2(0.27, -0.16)), length(f2 - vec2(-0.27, -0.16))));
    float chev = max(abs(abs(f2.x) * 0.9 + f2.y) - 0.07, abs(f2.x) - 0.42);
    float mk = hs < 0.5 ? 1. - smoothstep(0.13 - pxm, 0.13 + pxm, tri3) : 1. - smoothstep(-pxm, pxm, chev);
    mk *= sow * (1. - smoothstep(0.2, 0.5, pxm)) * step(hs, 0.8);
    col = mix(col, hs > 0.25 && hs < 0.5 ? uAcc : uInk, mk);
    col = mix(col, uInk, k);
  } else if (part < 1.5) {
    // ---- plinth: triangles between lines
    float s = vW.x, y = vW.y;
    float h = (y - 0.25) / 2.1, tri = 1. - abs(2. * fract(s / 3.2) - 1.), inB = step(0., h) * step(h, 1.);
    col = mix(col, h < tri ? uAcc : uB, inB);
    k = max(max(ln(y - 0.25, 0.09), ln(y - 2.35, 0.09)), ln((h - tri) * 1.5, 0.09) * inB);
    k = max(k, ln(y - 2.72, 0.05));
    col = mix(col, uInk, k);
  } else if (part < 2.5) {
    // ---- floor: a wash, the rice-paste drawing, the door's sun
    vec2 p = vP.xz; float pxm = max(fwidth(p.x) + fwidth(p.y), 1e-4);
    float edge = (p.x - 48.) - (45. - p.y) * 32. / max(45. - uPatchZ, 1.);
    float inside = smoothstep(-pxm, pxm, edge) * uPatchOn;
    vec2 gs = p / 1.3; gs.x += 0.5 * floor(gs.y);
    float st = 1. - smoothstep(0.1, 0.1 + pxm, length(fract(gs) - 0.5) - 0.36 * (1. - smoothstep(0., 7., -edge)));
    st *= uPatchOn * step(edge, 0.) * step(-7., edge) * (1. - smoothstep(0.3, 0.8, pxm));
    col = mix(uFloor, uSun, max(inside, st));
    // the drawing: rings and two rounds of petals about the water pot
    // (the flower turns against the wheel on the east wall and its two rounds of petals breathe; the scalloped
    // rim round it stays where it is)
    vec2 d = p - vec2(-35., -7.); float r = length(d), a0 = atan(d.y, d.x + (abs(d.x) + abs(d.y) < 1e-4 ? 1e-4 : 0.)), a = a0 - uFlr.x;
    float w = 0., br1 = sin(uFlr.z * 0.8), br2 = sin(uFlr.z * 0.8 + 2.2);
    float pet1 = r - (8.5 + (10.3 + 0.9 * br1) * pow(abs(cos(a * 4.)), 0.7 - 0.1 * br1));
    float pet2 = r - (25. + (9.3 + 0.8 * br2) * pow(abs(cos(a * 8. + 0.4)), 0.8 - 0.12 * br2));
    float band = abs(r - 22.) - 2.4;
    float outer = abs(r - 37.6) - 1.3;
    float scal = length(vec2((fract(a0 * 30. / 6.2831853) - 0.5) * 6.2831853 / 30. * r, r - 39.1)) - 1.9;
    w = max(max(fillTo(pet1) * step(8.5, r), fillTo(band)), max(fillTo(pet2) * step(24.4, r), max(fillTo(outer), fillTo(scal) * step(38.9, r))));
    w = max(w, fillTo(r - 7.2));
    k = max(max(ln(pet1, 0.13) * step(8.6, r), ln(band, 0.11)), max(ln(pet2, 0.13) * step(24.5, r), max(ln(outer, 0.1), ln(scal, 0.1) * step(38.9, r))));
    k = max(k, max(ln(r - 7.2, 0.12), ln(r - 6.2, 0.07)));
    // inside the white: accent dots and veins
    float f1 = fract(a * 28. / 6.2831853) - 0.5;
    float dots = fillTo(length(vec2(f1 * 6.2831853 / 28. * r, r - 22.)) - 0.75);
    float f3 = fract(a * 8. / 6.2831853 + 0.5) - 0.5;
    float vein = ln(f3 * 6.2831853 / 8. * r, 0.11) * step(10.5, r) * step(pet1, -1.5);
    float eye1 = fillTo(length(vec2(f3 * 6.2831853 / 8. * r, r - 14.6)) - 1.15);
    float f4 = fract((a * 16. + 0.8) / 6.2831853 + 0.5) - 0.5;
    float eye2 = fillTo(length(vec2(f4 * 6.2831853 / 16. * r, r - 30.)) - 0.95);
    float f5 = fract(a0 * 44. / 6.2831853) - 0.5;
    float od = fillTo(length(vec2(f5 * 6.2831853 / 44. * r, r - 37.6)) - 0.5);
    float acc = max(max(dots, eye1), max(eye2, od));
    k = max(k, vein * (1. - eye1));
    // the rest of the floor: a border along the walls and sown dots
    float dw = min(min(45. - abs(p.y), p.x + 110.), 80. - p.x);
    float hb = (dw - 5.) / 2.4, trb = 1. - abs(2. * fract((abs(p.y) > 45. - dw - 0.01 ? p.x : p.y) / 3.6) - 1.), inb = step(0., hb) * step(hb, 1.);
    w = max(w, inb * step(hb, trb));
    k = max(k, max(ln(dw - 5., 0.1), ln(dw - 7.4, 0.1)) + ln((hb - trb) * 2.4, 0.09) * inb);
    vec2 g = p / 4.2; vec2 id = floor(g); float hs = hash(id + 2.3);
    vec2 ff = (fract(g) - 0.5) * 4.2 - (vec2(hash(id + 1.1), hash(id + 4.7)) - 0.5) * 1.6;
    float tri3 = min(length(ff - vec2(0., 0.55)), min(length(ff - vec2(0.48, -0.28)), length(ff - vec2(-0.48, -0.28))));
    float ringm = abs(length(ff) - 0.8) - 0.16;
    // a smaller round of petals under the middle of the orbit
    // (it turns the other way again, with the wheel)
    vec2 d2 = p - vec2(31., -3.); float r2 = length(d2), a2 = atan(d2.y, d2.x + (abs(d2.x) + abs(d2.y) < 1e-4 ? 1e-4 : 0.)) - uFlr.y;
    float br3 = sin(uFlr.z * 1.05 + 1.);
    float petB = r2 - (4.6 + (7.2 + 0.8 * br3) * pow(abs(cos(a2 * 3.)), 0.7 - 0.1 * br3)), ringB = abs(r2 - 14.4) - 0.9;
    w = max(w, max(fillTo(petB), fillTo(ringB)));
    k = max(k, max(ln(petB, 0.13), max(ln(ringB, 0.1), ln(r2 - 2.2, 0.09))));
    float fb = fract(a2 * 6. / 6.2831853 + 0.5) - 0.5, fc = fract(a2 * 26. / 6.2831853) - 0.5;
    acc = max(acc, max(fillTo(length(vec2(fb * 6.2831853 / 6. * r2, r2 - 8.2)) - 0.9), fillTo(length(vec2(fc * 6.2831853 / 26. * r2, r2 - 14.4)) - 0.42)));
    float sow = step(42., r) * step(17., r2) * step(8.6, dw) * (1. - smoothstep(0.3, 0.8, pxm));
    float sw = (hs < 0.6 ? fillTo(tri3 - 0.27) : fillTo(ringm)) * sow;
    col = mix(col, uPaste, w);
    col = mix(col, uSow, sw * (1. - inside));
    col = mix(col, uAcc, acc * step(0.5, w));
    col = mix(col, uInk, min(k, 1.) * (1. - smoothstep(0.35, 0.9, pxm) * 0.6));
  } else if (part < 3.5) {
    // ---- roof: a woven split-bamboo mat
    vec2 q = vW.xy / 2.6; vec2 id = floor(q), f = fract(q) - 0.5;
    float par = mod(id.x + id.y, 2.), pxm = max(fwidth(q.x) + fwidth(q.y), 1e-4);
    vec2 g = par < 0.5 ? f : f.yx;
    float l1 = max(abs(abs(g.y) - 0.22) - 0.07, abs(g.x) - 0.42);
    col = mix(uMat, uInk, (1. - smoothstep(-pxm, pxm, l1)) * (1. - smoothstep(0.12, 0.4, pxm) * 0.75));
  } else if (part < 4.5) {
    // ---- rafters: bamboo with node rings
    float nd = abs(fract(vW.x / 7.) - 0.5) * 7.;
    col = mix(uMat, uGround, fillTo(nd - 0.5));
    col = mix(col, uInk, max(fillTo(nd - 0.22), smoothstep(0.72, 0.72 + max(fwidth(vW.y), 1e-4), abs(vW.y))));
  } else if (part < 5.5) col = uRim;
  else if (part < 6.5) {
    // ---- niche lining: dots on a dark ground
    vec2 g = vW.xy / 1.7; g.x += 0.5 * floor(g.y);
    float l = length(fract(g) - 0.5), aw = max(fwidth(l), 1e-4);
    col = mix(uLining, uLiningDot, (1. - smoothstep(0.17 - aw, 0.17 + aw, l)) * (1. - smoothstep(0.2, 0.5, aw)));
  } else if (part < 7.5) col = uSky;
  else if (part < 8.5) {
    // ---- door reveal: one broad stroke, black at both edges, hatched between in the line manner
    float e = min(vW.y, 1. - vW.y) * 2.;
    float arg = vW.x * uHatch * 0.55 + vW.y * 4.2 - uTime * 1.3, fw = max(fwidth(arg), 1e-3);
    float hatch = smoothstep(0.3 - fw, 0.3 + fw, sin(arg)) * (1. - smoothstep(0.7, 1.7, fw)) * uRevealK;
    float aw = max(fwidth(vW.y) * 2., 1e-4);
    col = mix(uReveal, uInk, max(1. - smoothstep(0.13 - aw, 0.13 + aw, e), hatch));
  } else {
    // ---- lamp recess: dots on a dark ground
    vec2 g = vW.xy / 0.9; g.x += 0.5 * floor(g.y);
    float l = length(fract(g) - 0.5), aw = max(fwidth(l), 1e-4);
    col = mix(uRecess, uRecessDot, (1. - smoothstep(0.2 - aw, 0.2 + aw, l)) * (1. - smoothstep(0.2, 0.5, aw)));
  }
  gl_FragColor = vec4(col, 1.);
  ${ct}
}`,ot=`
attribute vec4 aS; attribute vec3 aN;
uniform float uTime, uViewH, uFlow, uWaveP, uAside, uLamp; uniform vec3 uFan; uniform vec2 uSpin;
varying vec3 vCol; varying vec4 vS;
#if defined(MOVER) || defined(SPIN)
attribute vec4 aR;
#endif
#ifdef FAN
attribute vec4 aF; attribute vec3 aG;
#endif
${Nt}
${et}
void main() {
  vec3 p = position; vCol = color; vS = aS; vec2 nr = aN.xy; float sc = 1., s, y;
#ifdef USE_INSTANCING_COLOR
  if (color.r < 0.) vCol = instanceColor;
#endif
#ifdef MOVER
  if (aR.w < 1.5) {
    // the rare wave: it leaves the wheel's wall and runs west down both side walls at once; each fish it reaches
    // leaps out of the river and turns over about its own middle
    float c = mod(aR.x + uFlow * (aR.w < 0.5 ? -0.45 : 1.), ${H(m0)});
    float fwv = smoothstep(0., 0.2, uWaveP * 1.2 - min(c, ${H(m0)} - c) / ${H(m0*.5)});
    float face = 1. - 2. * fwv, leap = sin(3.14159265 * fwv) * step(0.5, aR.w);
    if (abs(face) < 0.05) face = 0.05;
    p.y += aN.z * sin(uTime * 3.4 + aR.z + p.x * 0.6);
    float tip = 0.9 * leap, ct = cos(tip), st = sin(tip);
    vec2 pf = vec2(face * p.x, p.y); nr.x *= sign(face);
    pf = vec2(pf.x * ct - pf.y * st, pf.x * st + pf.y * ct); nr = vec2(nr.x * ct - nr.y * st, nr.x * st + nr.y * ct);
    s = c + pf.x;
    float ry = riverY(s);
    y = aR.y + pf.y + ry - step(12., aR.y) * 0.5875 * (ry - 40.) + 4. * leap; p.z += 0.3 * leap;   // the snakes keep under the rakes
  } else if (aR.w < 2.5) {
    s = aR.x + p.x + 1.3 * sin(uTime * 0.55 + aR.z) + sign(aR.x - ${H(c0)}) * uAside * 4.5;
    y = aR.y + p.y + 0.9 * abs(sin(uTime * 2.3 + aR.z)) + aN.z * sin(uTime * 3.4 + aR.z + p.x * 0.6);
  } else if (aR.w > 4.5) {
    s = aR.x + p.x + 0.8 * sin(uTime * 0.4 + aR.z);
    y = aR.y + p.y + aN.z * sin(uTime * 3. + aR.z + p.x * 0.5) + (aR.w - 5.) * pow(abs(sin(uTime * 0.9 + aR.z)), 6.);
  } else {
    float lit = smoothstep(0., 1., uLamp - (aR.w - 3.) * 16.);
    s = aR.x + p.x * lit + aN.z * sin(uTime * 5.3 + aR.z + p.y * 1.3) * lit;
    y = aR.y + p.y * lit;
  }
#elif defined(SPIN)
  float sang = aR.z < 0.5 ? uSpin.x : uSpin.y, sca = cos(sang), ssa = sin(sang);
  vec2 q = p.xy * (1. + aN.z * sin(uTime * 0.9 + aR.w));
  q = vec2(q.x * sca - q.y * ssa, q.x * ssa + q.y * sca); nr = vec2(nr.x * sca - nr.y * ssa, nr.x * ssa + nr.y * sca);
  s = aR.x + q.x; y = aR.y + q.y;
#elif defined(FAN)
  float o = smoothstep(aF.w * 0.72, aF.w * 0.72 + 0.28, aG.x < 0.5 ? uFan.x : aG.x < 1.5 ? uFan.y : uFan.z);
  float ang = mix(aG.y, aF.z, o) + 0.025 * sin(uTime * 1.6 + aF.w * 23.) * o + aN.z * sin(uTime * 1.3 + aG.x * 2.);
  float ca = cos(ang), sa = sin(ang), kk = mix(aG.z, 1., o);
  p.y = p.y < 13.5 ? p.y * kk : 13.5 * kk + (p.y - 13.5);
  vec2 q = vec2(p.x * ca - p.y * sa, p.x * sa + p.y * ca);
  nr = vec2(nr.x * ca - nr.y * sa, nr.x * sa + nr.y * ca);
  s = aF.x + q.x; y = aF.y + q.y; p.z += aF.w * 0.06;
#else
  float ph = p.x * 0.21;
  #ifdef USE_INSTANCING
  ph = instanceMatrix[3].x * 0.37 + instanceMatrix[3].y * 0.53;
  #endif
  p.x += aN.z * sin(uTime * 1.7 + ph + p.y * 0.7);
  vec2 q = p.xy;
  #ifdef USE_INSTANCING
  q = (instanceMatrix * vec4(p, 1.)).xy;
  sc = length(instanceMatrix[0].xyz);
  nr = (mat3(instanceMatrix) * vec3(nr, 0.)).xy / max(sc, 1e-4);
  #endif
  s = q.x; y = q.y;
#endif
  vec3 wpos = wallPos(s, y, p.z);
  vec2 pp, nn; wallAt(s, pp, nn);
  vec3 nw = vec3(nn.y * nr.x, nr.y, -nn.x * nr.x);
  float px = 2. * length(cameraPosition - wpos) / (projectionMatrix[1][1] * uViewH);
  float add = step(0.5, aS.z) * clamp(0.8 * px - aS.w * sc, 0., aS.w * sc * 2.2 + 0.02);
  wpos += nw * add;
  vec4 mvPosition = viewMatrix * vec4(wpos, 1.);
  gl_Position = projectionMatrix * mvPosition;
  ${at}
}`,bt=`
attribute vec4 aK; attribute vec4 aV; attribute vec3 aC2;
uniform float uTime, uViewH;
varying vec3 vCol; varying vec3 vC2; varying vec4 vK;
${et}
void main() {
  vCol = color; vC2 = aC2; vK = aK;
  vec3 p = position, n = normal;
  float a = aV.z * sin(uTime * 0.45 + aV.w), ca = cos(a), sa = sin(a);
  vec2 d = p.xz - aV.xy; p.xz = aV.xy + vec2(d.x * ca - d.y * sa, d.x * sa + d.y * ca);
  n.xz = vec2(n.x * ca - n.z * sa, n.x * sa + n.z * ca);
  vec4 wp = modelMatrix * vec4(p, 1.);
#ifdef HULL
  float px = 2. * length(cameraPosition - wp.xyz) / (projectionMatrix[1][1] * uViewH);
  vec3 nw = mat3(modelMatrix) * n;
  wp.xyz += nw / max(length(nw), 1e-4) * clamp(1.5 * px, 0.16, 1.4);
#endif
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  ${at}
}`,Mt=`
uniform vec3 uInk, uGround;
varying vec3 vCol; varying vec3 vC2; varying vec4 vK;
${lt}
float ln(float d, float w) { float aw = max(fwidth(d), 1e-4); w = max(w, 0.75 * aw); return 1. - smoothstep(w - aw, w + aw, abs(d)); }
float fillTo(float d) { float aw = max(fwidth(d), 1e-4); return 1. - smoothstep(-aw, aw, d); }
void main() {
#ifdef HULL
  vec3 col = uInk;
#else
  vec3 col = vCol; float u = vK.x, v = vK.y, pat = vK.z, P = max(vK.w, 1e-3), k = 0.;
  if (pat > 4.5) {
    float nd = (fract(v / P) - 0.5) * P;
    k = ln(nd, 0.07);
  } else if (pat > 3.5) {
    vec2 q = vec2(u, v) / P; vec2 id = floor(q), f = fract(q) - 0.5;
    vec2 g = mod(id.x + id.y, 2.) < 0.5 ? f : f.yx;
    float pxm = max(fwidth(q.x) + fwidth(q.y), 1e-4);
    k = (1. - smoothstep(-pxm, pxm, max(abs(abs(g.y) - 0.22) - 0.08, abs(g.x) - 0.44))) * (1. - smoothstep(0.15, 0.5, pxm) * 0.7);
  } else if (pat > 2.5) {
    float tri = 1. - abs(2. * fract(u / P) - 1.);
    col = v < tri ? vCol : vC2;
    k = max(ln((v - tri) * P * 0.5, 0.08), max(ln(v * P * 0.5, 0.09), ln((1. - v) * P * 0.5, 0.09)));
  } else if (pat > 1.5) {
    float row = floor(v / P), gy = fract(v / P);
    float band = mod(row, 4.);
    if (band > 2.5) {
      float tri = 1. - abs(2. * fract(u / P) - 1.);
      col = gy < tri ? vC2 : uGround;
      k = ln((gy - tri) * P * 0.5, 0.07);
    } else {
      float x = u / P + 0.5 * mod(row, 2.);
      vec2 f = vec2(fract(x) - 0.5, gy - 1.);
      float r = length(f) * P;
      vec2 f0 = vec2(fract(x + 0.5) - 0.5, gy);
      float r0 = length(f0) * P;
      float inS = step(r, 0.5 * P);
      col = mix(vCol, vC2, fillTo(r - 0.27 * P));
      col = mix(col, uGround, fillTo(r - 0.11 * P));
      k = max(ln(r - 0.5 * P, 0.07), ln(r - 0.27 * P, 0.05));
      k = max(k, ln(r0 - 0.5 * P, 0.07) * (1. - inS));
    }
    k = max(k, ln(gy * P, 0.09));
  } else if (pat > 0.5) {
    float nd = (fract(v / P) - 0.5) * P, an = abs(nd);
    col = mix(col, uGround, fillTo(an - 0.42));
    k = max(fillTo(an - 0.18), max(ln(an - 0.42, 0.045), smoothstep(0.8, 0.8 + max(fwidth(u), 1e-4), abs(u))));
    k = max(k, ln(abs(u) - 0.42, 0.03) * step(0.9, an) * step(fract(v * 0.4), 0.6));
  }
  col = mix(col, uInk, clamp(k, 0., 1.));
#endif
  gl_FragColor = vec4(col, 1.);
  ${ct}
}`,Dt=`
attribute vec4 aI; attribute vec4 aJ; attribute vec3 aCol; attribute vec3 aCol2;
uniform float uTime, uGust, uViewH; uniform vec3 uInk;
varying vec3 vCol;
${et}
void main() {
  vec3 p = position; vCol = color;
  if (color.r < -1.5) vCol = aCol2; else if (color.r < 0.) vCol = aCol;
  vec3 w;
  if (aJ.x < 0.5) {
    float t = aI.x, sag = mix(4.5, 9.5, aI.y) * 4. * t * (1. - t);
    float th = (0.2 + 0.12 * uGust) * sin(uTime * 1.15 + aI.y * 1.4) + 0.05 * sin(uTime * 2.6 + t * 9.);
    float rot = aI.w + 0.35 * sin(uTime * 1.9 + aI.w * 3.);
    float cr = cos(rot), sr = sin(rot);
    p.xy *= 0.78;
    if (aI.z > 1.5) { p.xy = vec2(p.x * 0.5, p.y * 1.6 - 1.45); cr = cos(0.25 * sin(uTime * 2.2 + aI.w)); sr = sin(0.25 * sin(uTime * 2.2 + aI.w)); }
    p.xy = vec2(p.x * cr - p.y * sr, p.x * sr + p.y * cr);
    w = vec3(48.4 + 15.2 * t + p.x, 32.4 - sag * cos(th) + p.y, 43.4 - sag * sin(th) - 0.3 * aI.y - p.z);
  } else {
    float t = uTime * 0.33 + aI.w, hop = floor(t) + smoothstep(0., 0.4, fract(t));
    float wr = fract(hop * 0.09 + aI.w * 0.37);
    float sz = aI.z * smoothstep(0., 0.06, wr) * (1. - smoothstep(0.94, 1., wr));
    float rot = aI.w * 5. + hop * 1.7, cr = cos(rot), sr = sin(rot);
    // a loose petal: a pointed teardrop with a black vein down its middle
    vec2 q0 = p.xy; float ql = length(q0);
    if (color.r < -1.5) { vCol = uInk; q0 = vec2(q0.x * 0.13, q0.y * 2.3 + 0.1); }
    else {
      if (ql > 0.01) q0 *= (color.r < -0.5 ? 1. : 1.16) / ql;
      q0 = vec2(q0.x * mix(0.95, 0.2, smoothstep(-0.35, 0.95, q0.y)) + sign(q0.x) * step(0., color.r) * 0.05, q0.y * (q0.y > 0. ? 1.55 : 1.));
    }
    vec2 q = vec2(q0.x, q0.y * 0.8) * sz; q = vec2(q.x * cr - q.y * sr, q.x * sr + q.y * cr);
    vec2 dir = normalize(vec2(-0.62, -0.78) + 0.35 * vec2(sin(aI.w * 7.), cos(aI.w * 5.)));
    vec2 g = aI.xy + dir * (wr - 0.5) * 34.;
    float lift = sin(3.14159265 * smoothstep(0., 0.4, fract(t)));
    w = vec3(g.x + q.x, 0.08 + p.z * 0.2 + lift * (0.5 + 0.5 * abs(q.x)), g.y + q.y);
  }
  vec4 mvPosition = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mvPosition;
  ${at}
}`,_t=`
varying vec3 vCol;
${lt}
void main() { gl_FragColor = vec4(vCol, 1.); ${ct} }`;function jt(){const R=[],I=[],g0=[];return{v(X,u0,B,b,S,z0){return R.push(X,u0,B),I.push(b,S,z0),R.length/3-1},quad(X,u0,B,b){g0.push(X,u0,B,X,B,b)},tri(X,u0,B){g0.push(X,u0,B)},build(){const X=new A.BufferGeometry;return X.setAttribute("position",new A.Float32BufferAttribute(R,3)),X.setAttribute("aW",new A.Float32BufferAttribute(I,3)),X.setIndex(g0),X}}}function Ht(){const R=[],I=[],g0=[],P0=[],X=[],u0=[],B=[];let b=[0,0,0,0],S=null;const z0=new A.Vector3,o=new A.Vector3,T={pivot(e,F,e0,a0){return b=[e,F,e0,a0],T},mx(e){return S=e,T},v(e,F,e0,a0,k0,b0,h0,O){return S&&(z0.set(e[0],e[1],e[2]).applyMatrix4(S),o.set(F[0],F[1],F[2]).transformDirection(S),e=[z0.x,z0.y,z0.z],F=[o.x,o.y,o.z]),R.push(e[0],e[1],e[2]),I.push(F[0],F[1],F[2]),g0.push(e0.r,e0.g,e0.b),P0.push(a0.r,a0.g,a0.b),X.push(k0,b0,h0,O),u0.push(b[0],b[1],b[2],b[3]),R.length/3-1},quad(e,F,e0,a0){B.push(e,F,e0,e,e0,a0)},lathe(e,F,e0,a0,k0=40,b0=1){for(let h0=0;h0<e0.length-1;h0++){const O=e0[h0],o0=e0[h0+1],Z=a0[O[2]]||a0[0];let K=-(o0[0]-O[0]),n0=o0[1]-O[1];const r0=Math.hypot(K,n0)||1;K/=r0,n0/=r0;const q=R.length/3;for(let w0=0;w0<=k0;w0++){const E=w0/k0*W,_=Math.cos(E),s0=Math.sin(E)*b0;for(const f0 of[O,o0]){const x0=Z[2]===3?E*Math.max(O[0],o0[0]):Z[2]===1?0:E*(O[0]+o0[0])*.5,i0=Z[2]===3?f0===O?0:1:f0[1];T.v([e+_*f0[0],f0[1],F+s0*f0[0]],[_*n0,K,s0*n0],Z[0],Z[1],x0,i0,Z[2],Z[3])}}for(let w0=0;w0<k0;w0++){const E=q+w0*2;B.push(E,E+1,E+2,E+1,E+3,E+2)}}return T},tube(e,F,e0,a0,k0,b0,h0=8,O=null){const o0=e.length,Z=R.length/3,K=new A.Vector3,n0=new A.Vector3,r0=new A.Vector3,q=new A.Vector3;let w0=0;for(let E=0;E<o0;E++){const _=e[E],s0=e[Math.max(0,E-1)],f0=e[Math.min(o0-1,E+1)];K.set(f0[0]-s0[0],f0[1]-s0[1],f0[2]-s0[2]).normalize(),O?q.set(O[0],O[1],O[2]):q.set(0,1,0),Math.abs(K.dot(q))>.95&&q.set(1,0,0),n0.crossVectors(K,q).normalize(),r0.crossVectors(n0,K).normalize(),E>0&&(w0+=Math.hypot(_[0]-e[E-1][0],_[1]-e[E-1][1],_[2]-e[E-1][2]));const x0=typeof F=="function"?F(E/(o0-1)):F;for(let i0=0;i0<=h0;i0++){const I0=O?-1.75+3.5*(i0/h0):i0/h0*W,A0=Math.cos(I0),V0=Math.sin(I0),W0=n0.x*V0+r0.x*A0,d0=n0.y*V0+r0.y*A0,E0=n0.z*V0+r0.z*A0;T.v([_[0]+W0*x0,_[1]+d0*x0,_[2]+E0*x0],[W0,d0,E0],e0,a0,O?I0/1.75:Math.sin(I0),w0,k0,b0)}}for(let E=0;E<o0-1;E++)for(let _=0;_<h0;_++){const s0=Z+E*(h0+1)+_,f0=s0+h0+1;B.push(s0,s0+1,f0,s0+1,f0+1,f0)}return T},count(){return B.length/3},build(){const e=new A.BufferGeometry;return e.setAttribute("position",new A.Float32BufferAttribute(R,3)),e.setAttribute("normal",new A.Float32BufferAttribute(I,3)),e.setAttribute("color",new A.Float32BufferAttribute(g0,3)),e.setAttribute("aC2",new A.Float32BufferAttribute(P0,3)),e.setAttribute("aK",new A.Float32BufferAttribute(X,4)),e.setAttribute("aV",new A.Float32BufferAttribute(u0,4)),e.setIndex(B),e}};return T}var Ut={id:"kohbar-lotus-room",name:"The Lotus Room",category:"interior",weirdness:.4,media:["interior","tiny"],async build(R){await R.yield();const I=R.rng,g0=R.quality?.detail??1,P0=R.vary?.density??1,X=!!R.vary?.rare,u0=R.vary?.hour,B=I(),b=u0==="dawn"?"line":u0==="night"?"dusk":u0==="golden"||u0==="day"||B<.52?"sun":B<.7?"line":"dusk",S=gt.map(t=>new A.Color(t)),z0=b==="line"?[0,1,0,0,0,0,0]:b==="dusk"?[0,1,6,6,4,4,6]:[0,1,2,3,4,5,6],o=t=>S[z0[t]],T=S[0],e=S[1],F=b==="dusk"?S[6]:S[3],e0=I(),a0=e0>=.3&&e0<.44,k0=b==="line"||I.chance(.3),b0=new A.Scene;b0.background=T.clone();const h0=new A.Vector2,O=[[-92,6,14],[-72,6,14],[-52,6,14],[-32,6,14.4],[-14,10.5,17],[4,17.5,21.5],[20,23.5,24.4]];for(let t=0;t<=18;t++){const u=t*Math.PI/6;O.push([38+27*Math.sin(u),26+18*U(.75*Math.PI,2*Math.PI,u),-1+27*Math.cos(u)])}O.push([18,43.3,-28],[-2,41.2,-28],[-22,37.8,-28],[-40,34.8,-28],[-58,34,-28],[-78,34,-28],[-98,34,-28],[-116.5,34,-28]);const o0=Bt(O);await R.yield();const Z=await Vt(R,{palette:gt,look:b,demo:!1});Z.object.position.set(80,0,6),Z.object.rotation.y=-Math.PI/2,b0.add(Z.object),Z.object.updateMatrixWorld(!0),await R.yield();const K=Z.uniforms,n0=[I.range(0,W),I.range(0,W),I.range(0,W),I.range(0,W)],r0=Lt(n0),q={uTime:K.uTime,uViewH:K.uViewH,uHatch:K.uHatch,uGround:K.uGround,uInk:K.uInk,uWB:{value:new A.Vector4(n0[0],n0[1],n0[2],n0[3])},uFlow:{value:0},uWaveP:{value:0},uAside:{value:0},uFan:{value:new A.Vector3(0,0,0)},uGust:{value:0},uFlr:{value:new A.Vector3(0,.4,0)},uSpin:{value:new A.Vector2(0,0)},uLamp:{value:9},uPatchZ:{value:38},uPatchOn:{value:b==="sun"?1:0}},w0=()=>A.UniformsUtils.clone(A.UniformsLib.fog),E=(t,u,h,p)=>new A.ShaderMaterial({vertexShader:t,fragmentShader:u,fog:!0,side:A.DoubleSide,defines:p||{},uniforms:{...w0(),...h}}),_=(t,u,h=0,p=b0)=>{const x=new A.Mesh(t,u);return x.frustumCulled=!1,x.renderOrder=h,p.add(x),x},s0=new A.Vector4(Q(22),49.6,Q(-12),49.6),f0=E(Yt,$t,{uTime:q.uTime,uHatch:q.uHatch,uGround:q.uGround,uInk:q.uInk,uPatchZ:q.uPatchZ,uPatchOn:q.uPatchOn,uAcc:{value:F},uB:{value:o(4)},uSun:{value:S[2]},uFloor:{value:b==="line"?T:S[3]},uPaste:{value:T},uSow:{value:b==="line"?F:T},uMat:{value:o(2)},uSky:{value:b==="sun"?S[2]:b==="line"?T:S[4]},uRim:{value:b==="line"?e:o(3)},uWater:{value:b==="line"?e:S[4]},uDiscS:{value:o(2)},uRayS:{value:b==="dusk"?S[4]:o(3)},uDiscM:{value:b==="dusk"?S[2]:T},uRayM:{value:o(4)},uLining:{value:b==="line"?T:S[4]},uLiningDot:{value:b==="line"?F:T},uFlr:q.uFlr,uDiscs:{value:s0},uReveal:{value:b==="line"?T:o(3)},uRevealK:{value:b==="line"?.92:0},uRecess:{value:b==="line"?T:S[4]},uRecessDot:{value:b==="line"?F:T}}),x0=[118,139,160,174.5,Q(-88),Q(-57),Q(-24),Q(-6.5),Q(64)],i0=22;await R.yield();{const t=jt(),u=[t.v(-112,0,-47,0,0,2),t.v(82,0,-47,0,0,2),t.v(82,0,45,0,0,2),t.v(-112,0,45,0,0,2)];t.quad(u[0],u[3],u[2],u[1]);const h=[t.v(48,0,45,0,0,2),t.v(64,0,45,0,0,2),t.v(64,0,46.6,0,0,2),t.v(48,0,46.6,0,0,2)];t.quad(h[0],h[3],h[2],h[1]);const p=[];for(let m=0;m<m0;m+=3.05)p.push(m);const x=[m0,16,32,c0-8,c0+8];for(const m of x0)x.push(m-2,m+2);p.push(...x),p.sort((m,y)=>m-y);const f=p.filter((m,y)=>y===0||x.includes(m)||m-p[y-1]>.4&&!x.some(k=>Math.abs(k-m)<.4)),i=[3.1];for(let m=6;m<=57;m+=3)i.push(m);i.push(26,34,44,i0-2.7,i0+2.9),i.sort((m,y)=>m-y);const a=(m,y)=>y>i0-2.7&&y<i0+2.9&&x0.some(k=>Math.abs(m-k)<2),n=i.length,r=6,d=n+r,c=new A.Vector3,l=(m,y)=>y<n?i[y]:57+(r0.top(m)-57)*((y-n+1)/r),w=[];for(let m=0;m<f.length;m++){const y=f[m];for(let k=0;k<d;k++){const N=l(y,k);r0.pos(y,N,0,c),w.push(t.v(c.x,c.y,c.z,y,N,0))}(m&31)===31&&await R.yield()}for(let m=0;m<f.length-1;m++){const y=(f[m]+f[m+1])/2;for(let k=0;k<d-1;k++){const N=(l(y,k)+l(y,k+1))/2;if(Math.abs(y-$0)<8&&N<34||Math.abs(y-c0)<8&&N>26&&N<44||a(y,N))continue;const G=m*d+k,D=G+d;t.quad(w[G],w[D],w[D+1],w[G+1])}}await R.yield();const v=20,s=-28,M=[];for(let m=0;m<=v;m++){const y=Math.PI*(m/v);M.push([8*Math.cos(y),36+8*Math.sin(y)])}for(let m=0;m<v;m++){const y=M[m],k=M[m+1],N=c0-y[0],G=c0-k[0],D=t.v(-110,y[1],s+y[0],N,y[1],0),V=t.v(-110,k[1],s+k[0],G,k[1],0),$=t.v(-110,44,s+y[0],N,44,0),Y=t.v(-110,44,s+k[0],G,44,0);t.quad(D,V,Y,$)}const z=[[8,26],...M,[-8,26]];let g=0;const P=t.v(-119.5,34,s,0,34,6);for(let m=0;m<z.length-1;m++){const y=z[m],k=z[m+1],N=Math.hypot(k[0]-y[0],k[1]-y[1]),G=t.v(-109.6,y[1],s+y[0],g,0,6),D=t.v(-109.6,k[1],s+k[0],g+N,0,6),V=t.v(-119.5,y[1],s+y[0],g,9.9,6),$=t.v(-119.5,k[1],s+k[0],g+N,9.9,6);t.quad(G,D,$,V),g+=N;const Y=t.v(-119.5,y[1],s+y[0],y[0],y[1],6),t0=t.v(-119.5,k[1],s+k[0],k[0],k[1],6);t.tri(P,Y,t0)}{const m=b==="line"?8:5,y=t.v(-108.4,26,s+8.6,0,0,m),k=t.v(-108.4,26,s-8.6,17.2,0,m),N=t.v(-119.5,26,s-8.6,17.2,1,m),G=t.v(-119.5,26,s+8.6,0,1,m);t.quad(y,k,N,G);const D=t.v(-108.4,26,s+8.6,0,0,m),V=t.v(-108.4,26,s-8.6,17.2,0,m),$=t.v(-108.4,25.1,s+8.6,0,1,m),Y=t.v(-108.4,25.1,s-8.6,17.2,1,m);t.quad(D,$,Y,V)}const C=[[1.3,0],[1.3,2.3],[1.2,2.72],[.9,3],[.35,3.1],[0,3.1]];let L=null;for(let m=0;m<f.length;m++){const y=f[m],k=y>16.01&&y<31.99,N=[];if(k){L=null;continue}for(const G of C)r0.pos(y,3.1,G[0],c),N.push(t.v(c.x,G[1],c.z,y,G[1],1));if(L&&!(f[m-1]>=16&&y<=32&&y>16))for(let G=0;G<C.length-1;G++)t.quad(L[G],N[G],N[G+1],L[G+1]);L=N}const j=(m,y,k,N,G,D,V)=>{const $=[m,k,G],Y=[y,N,D];for(let t0=0;t0<3;t0++)for(const Z0 of[0,1]){const q0=(t0+1)%3,G0=(t0+2)%3,R0=[];for(const[mt,wt]of[[0,0],[1,0],[1,1],[0,1]]){const C0=[0,0,0];C0[t0]=Z0?Y[t0]:$[t0],C0[q0]=mt?Y[q0]:$[q0],C0[G0]=wt?Y[G0]:$[G0];const qt=t0===V?C0[q0]:C0[V],Ct=t0===V||q0===V?wt:mt;R0.push(t.v(C0[0],C0[1],C0[2],qt,Ct,8))}t.quad(R0[0],R0[1],R0[2],R0[3])}};j(46.6,48,0,35.4,43.5,46.6,1),j(64,65.4,0,35.4,43.5,46.6,1),j(46.6,65.4,34,35.4,43.5,46.6,0);{const V=($,Y,t0,Z0)=>t.quad(t.v(...$,0,0,7),t.v(...Y,0,0,7),t.v(...t0,0,0,7),t.v(...Z0,0,0,7));V([-320,-.02,46.6],[520,-.02,46.6],[520,-.02,420],[-320,-.02,420]),V([-320,320,46.6],[520,320,46.6],[520,320,420],[-320,320,420]),V([-320,-.02,420],[520,-.02,420],[520,320,420],[-320,320,420]),V([-320,-.02,46.6],[-320,-.02,420],[-320,320,420],[-320,320,46.6]),V([520,-.02,46.6],[520,-.02,420],[520,320,420],[520,320,46.6])}for(const m of x0){const k=i0-2.7,N=i0+2.9,G=[[m-2,k],[m+2,k],[m+2,N],[m-2,N]],D=G.map(([$,Y])=>r0.pos($,Y,0,new A.Vector3)),V=G.map(([$,Y])=>r0.pos($,Y,-1.8,new A.Vector3));for(let $=0;$<4;$++){const Y=($+1)%4,t0=$&1?5.6:4;t.quad(t.v(D[$].x,D[$].y,D[$].z,0,0,9),t.v(D[Y].x,D[Y].y,D[Y].z,t0,0,9),t.v(V[Y].x,V[Y].y,V[Y].z,t0,1.8,9),t.v(V[$].x,V[$].y,V[$].z,0,1.8,9))}t.quad(t.v(V[0].x,V[0].y,V[0].z,0,0,9),t.v(V[1].x,V[1].y,V[1].z,4,0,9),t.v(V[2].x,V[2].y,V[2].z,4,5.6,9),t.v(V[3].x,V[3].y,V[3].z,0,5.6,9))}for(const m of[-1,1]){const y=t.v(-113,96,0,-113,0,3),k=t.v(83,96,0,83,0,3),N=t.v(83,56.8,m*49,83,62.8,3),G=t.v(-113,56.8,m*49,-113,62.8,3);t.quad(y,k,N,G);for(let D=-104;D<=78;D+=9.1){const $=[];for(const Y of[0,1]){const t0=95.2-38.4*Y,Z0=m*48*Y,q0=[];for(let G0=0;G0<=5;G0++){const R0=-Math.PI/2+Math.PI*(G0/5);q0.push(t.v(D+Math.sin(R0)*.62,t0-Math.cos(R0)*.62,Z0,Y*61.5,Math.sin(R0),4))}$.push(q0)}for(let Y=0;Y<5;Y++)t.quad($[0][Y],$[1][Y],$[1][Y+1],$[0][Y+1])}}{const y=[];for(const k of[-113,83]){const N=[];for(let G=0;G<=6;G++){const D=-Math.PI/2+Math.PI*(G/6);N.push(t.v(k,94.6-Math.cos(D)*.9,Math.sin(D)*.9,k+3,Math.sin(D),4))}y.push(N)}for(let k=0;k<6;k++)t.quad(y[0][k],y[1][k],y[1][k+1],y[0][k+1])}_(t.build(),f0)}await R.yield();const I0={uTime:q.uTime,uViewH:q.uViewH,uFlow:q.uFlow,uWaveP:q.uWaveP,uAside:q.uAside,uLamp:q.uLamp,uFan:q.uFan,uSpin:q.uSpin,uWB:q.uWB,uGround:q.uGround,uHatch:q.uHatch},A0=E(ot,O0,I0);A0.vertexColors=!0;const V0=E(ot,O0,I0,{MOVER:1});V0.vertexColors=!0;const W0=E(ot,O0,I0,{FAN:1});W0.vertexColors=!0;const d0=(t,u,h,p,x=14,f=0)=>{const i=[],a=Math.cos(f),n=Math.sin(f);for(let r=0;r<x;r++){const d=r/x*W,c=Math.cos(d)*h,l=Math.sin(d)*p;i.push([t+c*a-l*n,u+c*n+l*a])}return i},E0=[[90,-1],[51,-1]],st=v0+1,N0=[[v0-7.5,v0+17,8,37],[M0+6,B0+4,4,37]];{const t=l0(),u=(h,p)=>{const x=[];for(let f=h;f<=p;f+=1.2)x.push([f,5.7+.75*Math.sin(f*.52)]);t.xf(null).wave(0).z(.05).stroke(x,.17,e);for(let f=h+1.5;f<p-1;f+=3.02){const i=5.7+.75*Math.sin(f*.52),a=Math.cos(f*.52)>0?-1:1,n=J([[0,0],[.7,.35],[.8,1.1],[.32,1.3],[0,1],[-.32,1.3],[-.8,1.1],[-.7,.35]],2).map(r=>[f+r[0],i+a*(.2+1.45-r[1])]);t.wave((r,d)=>.13*p0(Math.abs(d-i)/1.6,0,1)).z(.06).shape(n,o(5),e,.09),t.z(.07).stroke([[f,i+a*.5],[f,i+a*1.3]],.06,e)}};u(3,14.2),u(34,m0-3),t.xf(null);for(let h=8,p=0;h<m0-6;h+=11.3,p++){const x=r0.riverY(h);if(p&1||x>46){t.wave(0).z(.06).shape(y0(h,x-2.95,1.6,0,Math.PI,8),o(5),e,.1);for(let f=1;f<4;f++){const i=f*Math.PI/4;t.z(.075).stroke([[h,x-2.95],[h+Math.cos(i)*1.3,x-2.95+Math.sin(i)*1.3]],.06,e)}}else{t.wave((i,a)=>.12*p0((a-x-3.5)/3,0,1)).z(.06).stroke([[h,x+3.5],[h+.25,x+4.6],[h+.1,x+5.5]],.11,e);const f=J([[0,0],[.62,.6],[.42,1.4],[0,2],[-.42,1.4],[-.62,.6]],3).map(i=>[h+.1+i[0],x+5.4+i[1]]);t.z(.07).shape(f,o(6),e,.09),t.z(.08).stroke([[h+.1,x+5.5],[h+.1,x+6.6]],.05,e).disc(h+.1,x+5.45,.2,F,6)}}await R.yield(),x0.forEach(h=>{const p=i0,x=[[-2,-2.7],[2,-2.7],...y0(0,.9,2,0,Math.PI,10)].map(f=>[h+f[0],p+f[1]]);t.xf(null).wave(0);for(const f of[-1,1])t.z(.03).fill([[f*2.3,.9],...y0(0,.9,2,0,Math.PI/2,6).map(i=>[f*i[0],i[1]]),[0,3.2],[f*2.3,3.2]].map(i=>[h+i[0],p+i[1]]),T);t.z(.045).stroke(x,.5,e,!0,2),t.z(.05).stroke([[h-2.9,p-2.95],[h+2.9,p-2.95]],.4,e,!1,2),t.z(-.9).shape(y0(0,0,1,Math.PI,W,8).map(f=>[h+f[0]*1.35,p-1.55+f[1]*.85]),F,e,.1),t.z(-.88).stroke([[h-1.5,p-1.55],[h+1.75,p-1.55]],.14,e);for(let f=0;f<5;f++){const i=Math.PI*(.15+.175*f);t.z(.05).disc(h+Math.cos(i)*3.1,p+.9+Math.sin(i)*3.1,.24,o(2),7)}}),t.xf(null);for(let h=0;h<22;h++){const p=h&1?1:-1,x=I.range(.15,1),f=c0+p*(2.5+9.5*x)+I.range(-.6,.6),i=49.5-9*x*x+I.range(-1.2,1.6),a=I.range(2.6,4),n=p*I.range(.5,1.5)+(I.chance(.3)?Math.PI:0),r=Math.sin(n),d=Math.cos(n),c=J([[0,0],[a*.35,.42],[a,0],[a*.35,-.42]],3).map(l=>[f+l[0]*r-l[1]*d,i+l[0]*d+l[1]*r]);t.wave((l,w)=>.2*p0(Math.hypot(l-f,w-i)/4,0,1)**2).z(.06).shape(c,o(5),e,.11),t.z(.075).stroke([[f,i],[f+a*.8*r,i+a*.8*d]],.06,e)}{const p=(x,f)=>[8.6-x,3.2+f];t.xf(p).wave((x,f)=>.3*p0((f-3.2)/24,0,1)**2),t.z(.05).stroke([[0,0],[.3,6],[.2,12],[0,16.5]],1.5,e,!1,2),[-1.2,-.6,.02,.62,1.22].forEach((x,f)=>{const i=8.6+(f&1)*1.6,a=Math.sin(x),n=Math.cos(x),r=c=>[c[0]*a-c[1]*n,16+c[0]*n+c[1]*a-.045*c[0]*c[0]*Math.abs(a)],d=J([[0,0],[i*.3,1.5],[i*.75,1.3],[i,0],[i*.7,-1.2],[i*.3,-1.4]],3).map(r);t.z(.06+f*.01).shape(d,o(5),e,.13),t.z(.075+f*.01).stroke([r([.3,0]),r([i*.5,.05]),r([i*.95,0])],.1,e);for(let c=1;c<6;c++){const l=i*c/6.5;t.stroke([r([l,.05]),r([l+.5,.95])],.06,e).stroke([r([l,.05]),r([l+.5,-.85])],.06,e)}})}_(t.build(),A0,1)}await R.yield();{const t=l0(),u=(a,n,r=I.range(27,33.5))=>{const d=I.range(-1.7,1.7),c=s=>a+d*((s-3)/r)**2,l=[];for(let s=3.3;s<=r;s+=1.9)l.push([c(s),s]);const w=(s,M)=>.55*((M-3)/30)**2;t.xf(null).wave(w).z(.05+n%4*.01).stroke(l,.95-.25*(n&1),e,!1,2);let v=0;for(let s=5+I.range(0,2);s<r-1;s+=I.range(3.6,4.8),v++)if(t.wave(w).z(.1).stroke([[c(s)-.7,s],[c(s)+.7,s]],.24,e),!(s<11||I.chance(.25)))for(const M of v&1?[1]:[-1,1]){const z=I.range(3,4.6),g=M*I.range(.55,1.15),P=Math.sin(g),C=Math.cos(g),L=c(s)+M*.4,j=J([[0,0],[z*.35,.42],[z,0],[z*.35,-.42]],3).map(m=>[L+m[0]*P-m[1]*C,s+m[0]*C+m[1]*P]);t.wave((m,y)=>w(m,y)+.16*p0(Math.hypot(m-L,y-s)/4.5,0,1)**2),t.z(.11).shape(j,o(5),e,.11)}};for(let a=0;a<16;a++)u(Q(3+a*3.5+I.range(-.6,.6)),a);for(let a=0;a<3;a++)u(M0+9+a*2.5+I.range(-.3,.3),a,35.5+a*1.2);await R.yield(),a0||E0.forEach(([a,n])=>{const r=(v,s)=>[a+n*v,14+s];t.xf(r).wave(0);for(const v of[2.1,4.3]){t.z(.3).stroke([[v,-2.8],[v-.25,-6.6],[v+.2,-10.1]],.3,e);for(const s of[-1,0,1])t.stroke([[v+.2,-10.1],[v+.9+s*.5,-10.6+Math.abs(s)*.35]],.16,e)}const d=J([[8.2,1.2],[6.5,3.6],[2.5,3.9],[-1.2,2.2],[-2.2,-.4],[.5,-3],[4.5,-3.4],[7.6,-1.6]],5);t.z(.4).fill(d,o(4)).z(.415).stroke(d,.55,e,!0,2);const c=J([[5.6,2.6],[7.3,6],[7.9,10],[9.2,12.5],[11,12.2],[10.5,9.2],[9.7,5.4],[8.5,1.6]],4);t.z(.42).fill(c,o(4)).z(.43).stroke(c,.2,e,!0);for(let v=0;v<5;v++)t.z(.44).disc(8.1+v*.33,3.6+v*1.75,.3,o(2),7);const l=d0(10.3,12.9,1.6,1.45,16);t.z(.45).fill(l,o(4)).z(.46).stroke(l,.2,e,!0),t.z(.47).disc(10.6,13.2,.52,T,10).z(.48).disc(10.7,13.2,.22,e,7),t.z(.44).shape([[11.6,13.5],[13.5,12.6],[11.6,12.1]],o(2),e,.12);for(const v of[-.5,0,.5])t.z(.44).stroke([[10.1,14.3],[10.1+v*1.6,16.6-Math.abs(v)*.6]],.11,e).z(.45).disc(10.1+v*1.8,17-Math.abs(v)*.6,.36,F,8);const w=J([[5.6,1.6],[2.4,2.4],[-.6,.8],[1.4,-1.6],[4.8,-1.4]],4);t.z(.44).shape(w,o(5),e,.16);for(let v=0;v<4;v++)t.z(.455).stroke(y0(4.6-v*1.2,.5,1,2.2,4.1,5),.1,e);for(let v=0;v<3;v++)t.z(.44).disc(6.9-v*.2,.9-v*1.1,.26,T,7)});const h=b==="dusk"?S[4]:o(6),p=b==="dusk"?S[6]:o(4),x=(a,n,r=1.1,d=15.5)=>{const c=(g,P)=>[a+n*g*r,d+P*r],l=(g,P,C)=>{let L=0,j=0;for(const y of g)L+=y[0],j+=y[1];L/=g.length,j/=g.length;const m=(y,k)=>[L+(y[0]-L)*k,j+(y[1]-j)*k];for(let y=0;y<g.length;y++){const k=g[y],N=g[(y+1)%g.length];for(let G=0;G<C;G++){const D=G/C,V=(G+1)/C;G===0?t.fill([m(k,0),m(k,V),m(N,V)],P):t.fill([m(k,D),m(k,V),m(N,V),m(N,D)],P)}}},w=g=>{const P=[];return g.forEach((C,L)=>{const j=g[(L+1)%g.length],m=Math.max(1,Math.round(Math.hypot(j[0]-C[0],j[1]-C[1])/1.4));for(let y=0;y<m;y++)P.push([C[0]+(j[0]-C[0])*y/m,C[1]+(j[1]-C[1])*y/m])}),P};t.xf(c).wave(0);for(const g of[-5.2,5.6,-7.4,3.4]){const P=w([[g-1.5,-3.1],[g-1.6,-10],[g+1.7,-10],[g+1.5,-3.1]]);t.z(.2),l(P,h,2),t.z(.3).stroke(P,.3,e);for(let C=-1;C<=1;C++)t.z(.32).stroke(y0(g+C*.95,-10,.45,0,Math.PI,4),.1,e)}const v=J([[-9,2],[-8,8],[-2,10.5],[5,10],[9.5,7.5],[9.5,1],[7,-3],[-6,-3.5]],5);t.z(.2),l(v,h,4),t.z(.36).stroke(v,.7,e,!0,2),t.wave((g,P)=>.3*p0((24-P)/10,0,1)).z(.3).stroke([[-9,6.5],[-10.6,3],[-10.2,-1.5]],.22,e).z(.31).disc(-10.2,-2,.55,e,6),t.wave(0);const s=w([[-5.5,10.2],[4.5,10.3],[5.2,2],[-6.2,2]]);t.z(.5),l(s,p,2),t.z(.62).stroke(s,.45,e,!0,2);for(let g=0;g<4;g++)for(let P=0;P<3;P++)t.z(.62).disc(-4+g*2.6,8.3-P*2.2,.4,g+P&1?T:o(2),7);for(let g=0;g<6;g++)t.z(.45).shape([[-6+g*1.9,2],[-4.2+g*1.9,2],[-5.1+g*1.9,.6]],o(2),e,.09);const M=J([[8.5,11],[12,12.5],[15.5,10],[16,6],[13.5,3],[9.5,4]],5);t.z(.45),l(M,h,2),t.z(.52).stroke(M,.5,e,!0,2);const z=J([[9.5,11],[6.5,12.5],[4.6,8.5],[6.5,4],[9.3,5.5]],5);t.wave(.14).z(.66),l(z,o(2),2),t.z(.74).stroke(z,.18,e,!0);for(let g=0;g<4;g++)t.z(.76).stroke([[9,8.4],[5.6+g*.35,11-g*1.9]],.08,e);t.wave(0).z(.56).disc(13.3,8.8,.6,T,10).z(.62).disc(13.4,8.8,.28,e,7).z(.59).stroke(y0(13.3,8.8,.6,0,W,10),.08,e),t.z(.6).shape([[14,4.4],[17.5,2.6],[19.6,3.6],[17.6,3.9],[15.2,5.6]],T,e,.14),t.z(.58).disc(12.4,11.3,.45,F,8).disc(14.2,10.5,.32,o(2),7);for(let g=0;g<5;g++)t.z(.3).disc(-6.4+g*3.4,-1.2+(g&1)*.9,.5,g&1?o(2):T,7)},f=(a,n,r,d=1.1,c=15.5)=>{const l=l0(),w=[],v=[],s=[];for(let g=0;g<=14;g++){const P=g/14,C=-(1.4*P+2.8*P*P*P),L=11*P-5.5*P*P*P,j=-(1.4+8.4*P*P),m=11-16.5*P*P,y=Math.hypot(j,m)||1,k=1.05-.5*P;w.push([C-m/y*k,L+j/y*k]),v.push([C+m/y*k,L-j/y*k]),s.push([C,L,-m/y*k,j/y*k])}l.xf((g,P)=>[n*g*d,P*d]).wave(.07),l.z(.5).fill([...w,...v.reverse()],h).z(.53).stroke([...w,...v],.3,e,!0);for(let g=2;g<13;g++){const P=s[g];l.z(.54).stroke([[P[0]-P[2]*.75,P[1]-P[3]*.75],[P[0]+P[2]*.75,P[1]+P[3]*.75]],.1,e)}l.z(.56).disc(s[14][0],s[14][1],.8,F,8).z(.57).disc(s[4][0],s[4][1],.34,o(2),7).disc(s[8][0],s[8][1],.3,o(2),7);const M=l.build(),z=new A.InstancedBufferGeometry;z.index=M.index;for(const g of Object.keys(M.attributes))z.setAttribute(g,M.attributes[g]);z.setAttribute("aF",new A.InstancedBufferAttribute(new Float32Array([a+n*15.4*d,c+5.6*d,n*Math.PI*11/6,.3]),4)),z.setAttribute("aG",new A.InstancedBufferAttribute(new Float32Array([r,n*Math.PI,1]),3)),z.instanceCount=1,_(z,W0,1)},i=(a,n,r,d)=>{t.xf((l,w)=>[a+n*l*r,d+w*r]).wave(0),t.z(.66).shape([[-7,10.4],[6,10.4],[5.4,12.2],[-6.4,12.2]],o(2),e,.2);for(let l=0;l<8;l++)t.z(.68).shape([[-6+l*1.45,10.6],[-4.75+l*1.45,10.6],[-5.37+l*1.45,11.9]],l&1?o(4):F,e,.08);t.wave(.05).z(.64).fill([[-5.6,12.2],[4.6,12.2],[4.6,19.2],[-5.6,19.2]],b==="line"?T:F);for(let l=0;l<5;l++)for(let w=0;w<3;w++)t.z(.66).disc(-4.3+l*1.9,13.7+w*1.9,.36,l+w&1?b==="line"?F:T:o(2),7);t.z(.67).stroke([[-.5,12.2],[-.3,15.5],[-.5,19.2]],.16,e),t.wave(0);for(const l of[-5.6,4.6])t.z(.68).stroke([[l,12.2],[l,19.6]],.62,e,!1,2);const c=[[-7.4,19.2],[-6,20.8],[-3,22.2],[-.5,22.7],[2,22.2],[5,20.8],[6.4,19.2]];t.z(.7).fill(c,o(4)).z(.72).stroke(c,.5,e,!0,2);for(let l=0;l<6;l++)t.z(.73).disc(-5+l*1.8,20.25,.32,o(2),7);t.z(.72).stroke([[-.5,22.7],[-.5,25.6]],.2,e).z(.73).disc(-.5,23.6,.62,o(2),8).disc(-.5,24.8,.42,F,8),t.wave(.2).z(.72).shape([[-.5,25.7],[2.9,25],[-.5,24.3]],F,e,.1);for(let l=0;l<8;l++){const w=-6.6+l*1.75;t.wave(.1).z(.74).stroke([[w,19.2],[w,18]],.1,e).disc(w,17.8,.32,o(2),6)}};if(a0&&(x(90,-1),x(49,1)),x(st,1,.7,16.5),i(st,1,.7,16.5),_(t.build(),A0,1),a0&&(f(90,-1,0),f(49,1,1)),f(st,1,2,.7,16.5),!a0){const a=l0();a.z(.05).stroke([[0,1.5],[.18,8],[0,15]],.14,e);for(let w=0;w<6;w++){const v=3.6+w*1.8;a.stroke([[.1,v],[.95,v+1.15]],.07,e).stroke([[.1,v],[-.8,v+1.15]],.07,e)}a.z(.06).shape(d0(0,16.2,1.5,2.15,14),o(5),e,.12).z(.075).shape(d0(0,16,.98,1.45,12),o(2),e,.08),a.z(.09).fill(d0(0,15.8,.52,.8,10),o(4)).z(.1).disc(0,15.75,.2,F,6);const n=a.build(),r=new A.InstancedBufferGeometry;r.index=n.index;for(const w of Object.keys(n.attributes))r.setAttribute(w,n.attributes[w]);const d=40,c=new Float32Array(d*2*4),l=new Float32Array(d*2*3);E0.forEach(([w,v],s)=>{for(let M=0;M<d;M++){const z=s*d+M;c[z*4]=w,c[z*4+1]=15,c[z*4+2]=v*X0(-1.75,1.75,M/(d-1)),c[z*4+3]=M/(d-1);const g=M%15,P=g%3,C=Math.floor(g/3);l[z*3]=s,l[z*3+1]=v*(1.9+(P-1)*.125),l[z*3+2]=1-.185*C-.062*P}}),r.setAttribute("aF",new A.InstancedBufferAttribute(c,4)),r.setAttribute("aG",new A.InstancedBufferAttribute(l,3)),r.instanceCount=d*2,_(r,W0,1)}}await R.yield();{const t=l0(),u=b==="dusk"?[S[4],S[6]]:[o(2),o(6),o(4)];for(let h=0;h<60;h++){const p=u[h%u.length];t.ext([(h+.5)*m0/60+(h&1?-.55:.55),I.range(-.3,.3),I.range(0,W),1]),yt(t,{W:T,K:e,acc:F,body:p,second:p===o(2)?o(3):o(2),third:o(5)},I.range(.78,.9),I),(h&15)===15&&await R.yield()}await R.yield();for(let h=0;h<6;h++){t.ext([(h+(h&1?.2:.55))*m0/6,16.4,I.range(0,W),0]);const p=[];for(let f=-6.5;f<=4.61;f+=.55)p.push([f,.5*Math.sin(f*1.15)]);t.xf(null).wave(.26).z(.08).stroke(p,.85,e,!1,2);const x=.5*Math.sin(4.6*1.15);t.z(.09).shape([[4.3,x+.55],[5.5,x+.8],[6.6,x],[5.5,x-.8],[4.3,x-.55]],o(5),e,.12),t.z(.1).disc(5.6,x+.2,.2,T,7).stroke([[6.6,x],[7.3,x+.1],[7.8,x+.4]],.09,F).stroke([[7.3,x+.1],[7.8,x-.25]],.09,F)}for(let h=0;h<14;h++)t.ext([(h+I.range(.1,.9))*m0/14,I.range(5.6,8.4),I.range(0,W),0]),t.xf(null).wave(.5).z(.1).shape(d0(0,0,.85,.55,10),o(2),e,.09),t.z(.11).stroke([[-.15,.5],[-.15,-.5]],.14,e).stroke([[.3,.42],[.3,-.42]],.12,e).disc(.62,.08,.1,e,5),t.z(.09).shape(d0(-.25,.8,.6,.3,8,.5),T,e,.07).shape(d0(.3,.85,.5,.26,8,-.3),T,e,.07);for(const h of[-1,1])t.ext([c0+h*6.2,47.9,I.range(0,W),2]),it(t,{W:T,K:e,acc:F,body:o(5),second:b==="dusk"?S[6]:o(5),third:o(2)},.8);x0.forEach((h,p)=>{t.ext([h,i0-1.5,I.range(0,W),3+p/16]);const x=J([[0,0],[.6,.65],[.34,1.6],[0,2.6],[-.34,1.6],[-.6,.65]],3);t.xf(null).wave((f,i)=>.2*p0(i/2.6,0,1)**2).z(-.86).shape(x,b==="line"?T:S[2],e,.09),t.z(-.84).fill(x.map(f=>[f[0]*.5,.25+f[1]*.55]),F)}),_(t.build(),V0,2)}await R.yield();const _0=[],nt=[],K0=(t,u,h,p=1,x=1,f=null)=>{const i=l0();t(i);const a=i.build(),n=a.attributes.position,r=a.attributes.aS,d=a.attributes.aN;for(let c=0;c<n.count;c++)n.setXYZ(c,(f?0:u)+n.getX(c)*p*x,(f?0:h)+n.getY(c)*p,n.getZ(c)+(f?.16:0)),r.setY(c,r.getY(c)*p),r.setW(c,r.getW(c)*p),d.setXYZ(c,d.getX(c)*x,d.getY(c),d.getZ(c)*p);if(f){const c=new Float32Array(n.count*4);for(let l=0;l<n.count;l++)c[l*4]=u,c[l*4+1]=h,c[l*4+2]=f[0],c[l*4+3]=f[1];a.setAttribute("aR",new A.Float32BufferAttribute(c,4))}(f?nt:_0).push(a)},ft=b==="dusk"?[S[4],S[6]]:[o(2),o(6),o(4)],zt=t=>{const u=ft[t%ft.length];return{W:T,K:e,acc:F,body:u,second:u===o(2)?o(3):o(2),third:o(5)}},kt={W:T,K:e,acc:F,body:o(5),second:b==="dusk"?S[6]:o(5),third:o(2)},Pt={W:T,K:e,acc:F,body:o(5),second:o(2),third:b==="dusk"?S[6]:o(5)},L0=(t,u,h,p,x)=>{K0(f=>yt(f,zt(x),1,I),t,u,h,p,[I.range(0,W),5]),N0.push([t-5.6*h,t+5.6*h,u-2.3*h,u+2.3*h])},T0=(t,u,h,p,x=.5)=>{K0(f=>it(f,kt,1),t,u,h,p,[I.range(0,W),5+x]),N0.push([t-4.6*h,t+4.6*h,u-2.2*h,u+1.9*h])},rt=(t,u,h,p)=>{K0(x=>Wt(x,Pt,1),t,u,h,p,[I.range(0,W),5]),N0.push([t-3.6*h,t+3.6*h,u-2.5*h,u+2.5*h])};{const t=l0(),u=(i,a,n=0)=>[Math.cos(i)*a-Math.sin(i)*n,Math.sin(i)*a+Math.cos(i)*n],h=(i,a,n,r)=>J([[0,0],[n*.3,r],[n*.72,r*.78],[n,0],[n*.72,-r*.78],[n*.3,-r]],3).map(d=>u(i,a+d[0],d[1])),p=i=>(a,n)=>i*p0((Math.hypot(a,n)-3)/8,0,1);t.ext([S0,D0,0,0]).xf(null);for(let i=0;i<16;i++){const a=(i+.5)*W/16;t.wave(p(.05)).z(.05).shape([u(a,8.4,1.2),u(a,12.1,0),u(a,8.4,-1.2)],o(5),e,.12)}for(let i=0;i<16;i++){const a=i*W/16,n=h(a,5,6.3,1.66),r=.08+(i&1)*.03;t.wave(p(.065)).z(r).fill(n,o(6)).z(r+.012).stroke(n,.5,e,!0,2),t.z(r+.014).shape(h(a,6.6,3.1,.66),o(2),e,.07),t.z(r+.016).stroke([u(a,5.9),u(a,6.7)],.08,e).disc(...u(a,10.25),.2,F,6)}t.ext([S0,D0,0,2.4]);for(let i=0;i<8;i++){const a=(i+.5)*W/8,n=h(a,2,5,1.75);t.wave(p(.05)).z(.15).fill(n,o(2)).z(.162).stroke(n,.42,e,!0,2),t.z(.165).shape(h(a,3.2,2.5,.7),o(6),e,.07).disc(...u(a,6.1),.2,b==="line"?F:T,6)}t.wave(0).z(.18).disc(0,0,2.7,F,24).z(.19).stroke(y0(0,0,2.7,0,W,24).slice(0,24),.46,e,!0,2);for(let i=0;i<10;i++)t.z(.2).disc(...u(i*W/10,1.82),.23,T,6);t.z(.2).disc(0,0,1.05,o(2),12).z(.21).stroke(y0(0,0,1.05,0,W,12).slice(0,12),.1,e,!0).disc(0,0,.32,e,6),t.ext([S0,D0,1,0]);for(let i=0;i<12;i++){const a=i*W/12,n=u(a,14.25),r=a+W/24,d=[[n[0]-Math.cos(a)*.25,n[1]-Math.sin(a)*.25],...y0(n[0],n[1],1.85,a+Math.PI+.3,a+3*Math.PI-.3,14)];t.z(.06).shape(d,o(5),e,.15);for(let c=0;c<5;c++){const l=a+Math.PI+.9+c*(W-1.8)/4;t.z(.08).stroke([n,[n[0]+Math.cos(l)*1.45,n[1]+Math.sin(l)*1.45]],.07,e)}t.z(.085).disc(n[0],n[1],.3,o(2),7),t.z(.06).shape(J([u(r,13.3),u(r,14,.6),u(r,15.5),u(r,14,-.6)],3),o(6),e,.1),t.z(.07).shape([u(r,13),u(r,13.7,.5),u(r,13.7,-.5)],o(5),e,.08)}const x=E(ot,O0,I0,{SPIN:1});x.vertexColors=!0,_(t.build(),x,1);const f=l0();f.z(.05).stroke(y0(S0,D0,12.75,0,W,72).slice(0,72),.7,e,!0,2);for(let i=0;i<64;i++){const a=i*W/64;f.z(.05).disc(S0+Math.cos(a)*16.65,D0+Math.sin(a)*16.65,.26,F,6)}_0.push(f.build())}await R.yield();{const t=v0+37;K0(p=>{p.xf(null).wave(0).z(.05).shape([[-2.4,0],[2.4,0],[1.6,1.3],[-1.6,1.3]],b==="line"?T:o(3),e,.16);const x=d0(0,5.3,5.3,4.3,26);p.z(.06).fill(x,o(2)).z(.075).stroke(x,.56,e,!0,2);for(let f=0;f<7;f++)p.z(.08).shape([[-4.2+f*1.2,4.5],[-3+f*1.2,4.5],[-3.6+f*1.2,6.3]],f&1?o(4):F,e,.08);for(let f=0;f<6;f++)p.z(.08).disc(-3+f*1.2,3,.32,b==="line"?F:T,7);p.z(.08).stroke([[-4.6,7.2],[4.6,7.2]],.12,e).stroke([[-3.9,2],[3.9,2]],.12,e),p.z(.07).shape([[-2.4,9.1],[2.4,9.1],[3.2,10.8],[-3.2,10.8]],b==="line"?T:o(3),e,.16),[-1.2,-.62,0,.62,1.2].forEach((f,i)=>{const a=6-Math.abs(f)*.8,n=Math.sin(f),r=Math.cos(f),d=J([[0,0],[a*.35,1],[a,0],[a*.35,-1]],3).map(c=>[c[0]*n-c[1]*r,10.8+c[0]*r+c[1]*n]);p.wave(.07).z(.05+i*.004).shape(d,o(5),e,.13),p.z(.07).stroke([[0,10.8],[a*.8*n,10.8+a*.8*r]],.07,e)}),p.wave(0).z(.09).shape(d0(0,12.6,2,2.3,14),o(2),e,.15).z(.1).disc(0,14,.36,F,7)},t,65.6,1.05,1),N0.push([t-6.5,t+6.5,64,84]),await R.yield(),T0(t-15.5,70.2,2.05,1,.7),T0(t+15.5,70.2,2.05,-1,.7),rt(Q(73.3),14.6,1.5,-1),T0(Q(72.6),24.2,1.3,-1),T0(Q(73.6),31.6,1.3,1),T0(M0+10.8,36.4,1.1,1),T0(M0+12.6,27.6,1.1,-1),T0(M0+10.6,18.8,1.1,1),T0(M0+13,10.8,1,-1),L0(c0-.4,21.4,1.1,1,1),L0(c0+.4,14.6,1.1,-1,2),await R.yield();const u=l0(),h=(p,x,f)=>{const i=f-4.6,a=(M,z)=>.42*p0((z-5)/30,0,1)**2;u.xf((M,z)=>[p+x*M,4.6+z]).wave(a);const n=(M,z,g)=>{const P=[];for(let C=0;C<=12;C++){const L=C/12;P.push([M*L*L*L+g*Math.sin(L*Math.PI),z*L])}return P};u.z(.05).stroke(n(.4,i-6.8,.6),.34,e).stroke(n(-5.8,i-8.2,-.3),.24,e).stroke(n(4.8,i-8.4,.3),.24,e);const r=.4,d=i-6.8;for(const M of[0,6,1,5,2,4,3]){const z=(M-3)*.3,g=6.3-Math.abs(M-3)*.5,P=Math.sin(z),C=Math.cos(z),L=.06+(3-Math.abs(M-3))*.02,j=y=>[r+y[0]*P-y[1]*C,d+y[0]*C+y[1]*P],m=J([[0,0],[g*.35,1.15],[g*.75,.85],[g,0],[g*.75,-.85],[g*.35,-1.15]],3).map(j);u.z(L).fill(m,o(6)).z(L+.008).stroke(m,.36,e,!0,2),u.z(L+.01).fill(J([[g*.2,0],[g*.45,.42],[g*.75,0],[g*.45,-.42]],3).map(j),o(2))}u.z(.15).shape([[r-1.7,d+.3],[r,d-1.2],[r+1.7,d+.3],[r,d+1.7]],o(5),e,.13);const c=-5.8,l=i-6.4,w=[[c,l-.25],...y0(c,l,2.1,-Math.PI/2+.3,1.5*Math.PI-.3,16)];u.z(.07).shape(w,o(5),e,.16);for(let M=0;M<7;M++){const z=-Math.PI/2+.75+M*(W-1.5)/6;u.z(.09).stroke([[c,l-.25],[c+Math.cos(z)*1.7,l+Math.sin(z)*1.7]],.07,e)}u.z(.095).disc(c,l-.25,.32,o(2),7);const v=4.8,s=i-8.4;u.z(.07).shape(J([[0,0],[.95,1],[.62,2.5],[0,3.8],[-.62,2.5],[-.95,1]],3).map(M=>[v+M[0],s+M[1]]),o(6),e,.14),u.z(.09).stroke([[v,s+1],[v,s+3.1]],.07,e).z(.085).shape([[v-.95,s+.35],[v,s-.6],[v+.95,s+.35],[v,s+1.1]],o(5),e,.1),N0.push([p-8.2,p+8.2,25.5,36],[p-3.6,p+3.6,5,26])};h(128.5,1,35),h(149.5,-1,35.3),h(167.2,1,34.8),h(Q(-72),1,35.2),h(Q(-40.5),-1,35),_0.push(u.build()),await R.yield(),L0(115.5,30.8,1.35,-1,0),T0(138.6,31.2,1.15,-1),L0(178.6,30.6,1.1,-1,1),rt(Q(-87.5),30.6,1.25,-1),L0(Q(-56.5),30.8,1.4,-1,2),L0(Q(-21.5),30.8,1.4,-1,0),rt(Q(-8.3),30.6,1.2,-1),await R.yield(),_(tt(_0,!1),A0,1),_(tt(nt,!1),V0,2);for(const p of _0)p.dispose();for(const p of nt)p.dispose()}await R.yield();{const t=(w,v,s)=>{if(v<9.2+s||v>r0.top(w)-3.6-s)return!1;const M=r0.riverY(w);if(Math.abs(v-M)<6.4+s&&v<M+8.6+s||Math.abs(v-M-16.4+.5875*(M-40))<1.7+s)return!1;for(const z of N0)if(w>z[0]-s&&w<z[1]+s&&v>z[2]-s&&v<z[3]+s)return!1;if(Math.hypot(w-S0,v-D0)<17.3+s||Math.abs(w-$0)<11+s&&v<37.5+s||w<21&&v<31||Math.abs(w-c0)<14+s&&v<52||Math.hypot(w-s0.x,v-s0.y)<6.4+s||Math.hypot(w-s0.z,v-s0.w)<6.4+s)return!1;for(const[z]of E0)if(Math.hypot(w-z,v-15)<19.8+s)return!1;if(w>Q(0)&&w<Q(60)&&v<35.5+s||Math.abs(w-(v0+37))<6.5&&Math.abs(v-88)<6.5)return!1;for(const z of x0)if(Math.hypot(w-z,v-i0)<4.6+s)return!1;return!0},u=[[],[]],h=Math.min(1,.92*g0*P0);for(let w=4;w<m0-3;w+=3.9)for(let v=9;v<92;v+=3.9){const s=w+I.range(-1.3,1.3),M=v+I.range(-1.3,1.3),z=I(),g=I(),P=I.range(1,1.75),C=I.range(0,W);I()>h||!t(s,M,P)||u[z<.56?0:1].push({s,y:M,sz:P,rot:C,pick:g})}const p=l0(),x=new A.Color(-1,0,0);for(let w=0;w<6;w++){const v=w/6*W,s=Math.cos(v),M=Math.sin(v);p.z(.05).shape([[.26,0],[.62,.21],[1,0],[.62,-.21]].map(z=>[z[0]*s-z[1]*M,z[0]*M+z[1]*s]),x,e,.07)}p.z(.07).disc(0,0,.3,T,8).z(.08).disc(0,0,.14,F,5);const f=l0();Et(f,{W:T,K:e,acc:F});const i=[p.build(),f.build()],a=new A.Matrix4,n=new A.Quaternion,r=new A.Vector3(0,0,1),d=new A.Vector3,c=new A.Vector3,l=b==="line"?[T]:b==="dusk"?[S[6],S[4]]:[S[2],S[3],S[6],S[4]];for(let w=0;w<2;w++){const v=u[w].length;if(!v)continue;const s=new A.InstancedMesh(i[w],A0,v);s.frustumCulled=!1,s.renderOrder=1,u[w].forEach((M,z)=>{n.setFromAxisAngle(r,w===0?M.rot:(M.rot/W-.5)*.9),a.compose(d.set(M.s,M.y,0),n,c.set(M.sz,M.sz,1)),s.setMatrixAt(z,a),s.setColorAt(z,w===0?l[Math.floor(M.pick*l.length)]:o(5))}),s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0),b0.add(s)}}await R.yield();const ut=[{x:13,z:39,k:1,sg:-1},{x:-40,z:-41,k:.667,sg:1},{x:-72,z:-41,k:.667,sg:1}],It=[[-60,47,-8],[-24,50,31],[60,56,-30],[-5,52,-11]];{const t=Ht(),u=b==="line"?T:o(3);for(const a of ut){const n=a.k,r=[[3.4,2,0],[5.2,3.2,0],[6,6,1],[6,15.5,1],[5.6,17.5,2],[4.2,19.6,2],[3.5,20.4,3],[3.5,21.2,3],[4.3,22,4],[4,22.4,4],[3.3,22.2,4],[3.1,21,5],[0,21,5]].map(d=>[d[0]*n,d[1]*n,d[2]]);t.lathe(a.x,a.z,r,{0:[u,u,0,1],1:[o(2),o(4),2,1.9*(n<1?.8:1)],2:[F,o(4),3,2.4*n],3:[o(2),o(2),5,.42],4:[u,u,0,1],5:[b==="line"?e:S[4],e,0,1]},44);for(const d of[.785,2.356,3.927,5.498])t.lathe(a.x+Math.cos(d)*3.3*n,a.z+Math.sin(d)*3.3*n,[[1.3*n,0,0],[1.1*n,2.6*n,0]],{0:[u,u,0,1]},10)}await R.yield(),t.lathe(-35,-7,[[2.2,0,0],[4.6,2.5,1],[5,5.5,1],[4.2,8.5,2],[2.6,10,3],[2.6,10.8,3],[3.4,11.6,4],[3,11.7,4],[2.4,11,5]],{0:[u,u,0,1],1:[o(2),o(4),2,1.5],2:[o(4),T,3,1.9],3:[o(2),o(2),5,.4],4:[u,u,0,1],5:[e,e,0,1]},36),t.lathe(-35,-7,[[2.3,11.2,0],[2.5,12.4,0],[1.9,13.8,0],[.7,14.6,1],[0,14.9,1]],{0:[o(5),o(5),5,.55],1:[o(2),o(2),0,1]},18);for(let a=0;a<6;a++){const n=(a+.5)*W/6,r=[];for(let d=0;d<=6;d++){const c=2.2+d*.85,l=11.8+1.5*Math.sin(d*.45)-.07*d*d;r.push([-35+Math.cos(n)*c,l,-7+Math.sin(n)*c])}t.tube(r,d=>.12+.75*Math.sin(Math.PI*Math.min(1,d*1.05))**.8,o(5),o(5),0,1,4)}t.lathe(-27.5,1.5,[[0,.02,0],[2.9,.02,0],[3.6,.9,0],[3.8,.9,0],[3,.3,1],[2.4,.5,2],[1.4,1.5,2],[0,1.9,2]],{0:[o(2),o(2),5,.3],1:[o(2),o(2),0,1],2:[T,T,0,1]},24),t.lathe(-42,3,[[1.5,0,0],[1.2,.9,0],[.5,1.3,0],[0,1.3,0]],{0:[F,o(2),3,.9]},14),[[-42.5,7.4,3],[-42,7.9,3],[-41.4,7.3,3]].forEach((a,n)=>t.tube([[-42+(n-1)*.25,1.2,3],a],.1,e,e,0,1,4)),t.mx(new A.Matrix4().makeRotationX(-1.2).setPosition(40.5,4.9,43)),t.lathe(0,0,[[0,0,0],[4.2,0,0],[4.8,.9,1],[4.55,1,1],[4,.3,0],[0,.3,0]],{0:[o(2),o(2),4,.7],1:[u,u,0,1]},28),t.mx(null),t.lathe(70.5,37.5,[[2.6,0,0],[3.3,.4,0],[3.6,4.2,0],[3.85,4.4,2],[3.85,5,2],[3,6.6,3],[1,7.6,3],[.7,8.4,4],[1.1,8.9,4],[0,9.1,4]],{0:[o(2),o(2),4,.62],2:[F,o(4),3,1.2],3:[o(6),o(6),4,.5],4:[u,u,0,1]},28),await R.yield(),It.forEach(([a,n,r],d)=>{t.pivot(a,r,.55,d*1.7),t.lathe(a,r,[[0,0,0],[1.2,.1,0],[2.9,1.6,1],[3.1,3.4,1],[2.2,5.2,2],[1.6,5.8,3],[2.1,6.5,3],[1.5,6.3,4],[0,6.2,4]].map(l=>[l[0],l[1]+n,l[2]]),{0:[u,u,0,1],1:[d&1?o(2):F,d&1?o(4):o(2),2,1.25],2:[o(4),T,3,1.5],3:[u,u,0,1],4:[e,e,0,1]},26);const c=96-Math.abs(r)*.8-1.2;for(let l=0;l<4;l++){const w=l*W/4+.4;t.tube([[a+Math.cos(w)*2.2,n+.6,r+Math.sin(w)*2.2],[a+Math.cos(w)*3.15,n+3.2,r+Math.sin(w)*3.15],[a+Math.cos(w)*1.9,n+6.2,r+Math.sin(w)*1.9],[a,n+10.5,r]],.13,e,e,0,1,4)}t.tube([[a,n+10.5,r],[a,c,r]],.15,e,e,0,1,4)}),t.pivot(0,0,0,0);for(const a of[-1,1])for(let n=0;n<3;n++){const r=[],d=-28+a*(10.2+n*1.5),c=45.6-n*1.1;for(let l=0;l<=26;l++){const w=l/26,v=Math.sin(w*Math.PI*.56)/Math.sin(Math.PI*.56),s=d-a*(10.2+n*1.5+5.5-n)*w**4;r.push([-109.25+.5*n*(1-w)+.35*(a>0?1:0)*w,3+(c-3)*v+(w>.86?-(w-.86)*9:0),s])}t.tube(r,l=>.78-.34*l,o(2),o(2),1,4.4-n*.5,7,[1,0,0])}const p=t.build(),x={uTime:q.uTime,uViewH:q.uViewH,uInk:q.uInk,uGround:q.uGround},f=E(bt,Mt,x);f.vertexColors=!0;const i=E(bt,Mt,x,{HULL:1});i.vertexColors=!0,i.side=A.BackSide,_(p,i,2),_(p,f,3)}await R.yield();const At=[[-42.5,7.4,3],[-42,7.9,3],[-41.4,7.3,3]];{const t=E(Gt,O0,{uTime:q.uTime,uViewH:q.uViewH,uRing:K.uRing,uFace:K.uFace,uHatch:q.uHatch,uGround:q.uGround,uWall:K.uWall,uGable:K.uGable});t.vertexColors=!0;const u=[],h=[],p=(i,a,n=u)=>{const r=i.build(),d=r.attributes.position;for(let c=0;c<d.count;c++){const l=a(d.getX(c),d.getY(c),d.getZ(c));d.setXYZ(c,l[0],l[1],l[2])}n.push(r)},x={W:T,K:e,acc:F,body:o(5),second:b==="dusk"?S[6]:o(5),third:o(2)};for(const i of ut){const a=i.k,n=6*a,r=i.sg<0?.3:.42,d=(l,w)=>(v,s,M)=>{const z=r+(l+w*v)/n,g=n+.07+M;return[i.x+i.sg*g*Math.sin(z),10.8*a+s,i.z+i.sg*g*Math.cos(z)]},c=l0();c.z(0).fill(d0(0,0,5.3*a,3.3*a,28),T).z(.02).stroke(d0(0,0,5.3*a,3.3*a,28),.55*a,e,!0,2),c.z(.04).disc(0,.3*a,.4*a,F,8).disc(0,-1.5*a,.26*a,o(2),7).disc(0,2*a,.26*a,o(2),7),p(c,d(0,1));for(const l of[1,-1]){const w=l0();it(w,x,.5*a),p(w,d(-l*2.5*a,l))}}{const i=r=>(d,c,l)=>[r-d,c,51-l],a=l0();a.wave((r,d)=>.35*p0(d/30,0,1)**2).z(.05).stroke([[0,-1],[.4,8],[.2,16],[0,22]],2.2,e,!1,2),[-1.25,-.7,-.15,.4,.9,1.35].forEach((r,d)=>{const c=11+(d&1)*2.5,l=Math.sin(r),w=Math.cos(r),v=s=>[s[0]*l-s[1]*w,21.5+s[0]*w+s[1]*l-.04*s[0]*s[0]*Math.abs(l)];a.z(.06+d*.01).shape(J([[0,0],[c*.3,1.9],[c*.75,1.6],[c,0],[c*.7,-1.5],[c*.3,-1.8]],3).map(v),o(5),e,.16),a.z(.075+d*.01).stroke([v([.3,0]),v([c*.5,.05]),v([c*.95,0])],.13,e);for(let s=1;s<7;s++){const M=c*s/7.5;a.stroke([v([M,.05]),v([M+.6,1.2])],.07,e).stroke([v([M,.05]),v([M+.6,-1.1])],.07,e)}}),p(a,i(69.5));const n=l0();n.wave(0).z(.05).shape([[-3,-1],[3,-1],[3.5,5],[-3.5,5]],o(3),e,.18);for(let r=0;r<5;r++)n.z(.07).shape([[-3+r*1.2,.4],[-1.8+r*1.2,.4],[-2.4+r*1.2,2.4]],o(4),e,.09);n.z(.07).stroke([[-3.4,3.6],[3.4,3.6]],.4,e,!1,2),n.wave((r,d)=>.22*p0((d-5)/9,0,1)).z(.06).stroke([[0,5],[.2,9],[0,13.5]],.2,e);for(let r=0;r<8;r++)for(const d of[-1,1]){const c=6+r*.95,l=2.6-r*.18;n.z(.07).shape([[0,c],[d*l*.5,c+.75],[d*l,c+.55],[d*l*.55,c-.1]],o(5),e,.08)}n.z(.08).disc(0,13.9,.45,F,8),p(n,i(61))}_(tt(u,!1),t,2);for(const i of u)i.dispose();At.forEach((i,a)=>{const n=l0(),r=[];for(let d=0;d<=17;d+=.55)r.push([.55*Math.sin(d*.42+a*2.1)*(d/17),d]);n.wave((d,c)=>.1+1.25*(c/17)**1.4).z(0).stroke(r,.4,e,!1,2),p(n,(d,c,l)=>[i[0]+d,-(i[1]+c),i[2]+l+a*.02],h)});const f=_(tt(h,!1),t,3);f.scale.y=-1;for(const i of h)i.dispose()}await R.yield();const Tt={uTime:q.uTime,uGust:q.uGust,uViewH:q.uViewH,uInk:q.uInk};{const t=[],u=[],h=[],p=(v,s,M,z,g=12)=>{const P=t.length/3;t.push(0,0,M),u.push(z[0],z[1],z[2]);for(let C=0;C<g;C++){const L=C/g*W,j=C&1?s:v;t.push(Math.cos(L)*j,Math.sin(L)*j,M),u.push(z[0],z[1],z[2])}for(let C=0;C<g;C++)h.push(P,P+1+C,P+1+(C+1)%g)};p(1.14,.98,-.06,[e.r,e.g,e.b]),p(1,.82,0,[-1,0,0]),p(.46,.46,.06,[-2,0,0],8);const x=new A.InstancedBufferGeometry;x.setAttribute("position",new A.Float32BufferAttribute(t,3)),x.setAttribute("color",new A.Float32BufferAttribute(u,3)),x.setIndex(h);const f=[],i=[],a=[],n=[],r=(v,s,M,z)=>{f.push(...v),i.push(...s),a.push(M.r,M.g,M.b),n.push(z.r,z.g,z.b)},d=120;for(let v=0;v<2;v++)for(let s=0;s<d;s++){const M=(s+.5)/d,z=I.range(0,W);(k0?s%4!==0:!1)?r([M,v,2,z],[0,0,0,0],o(5),o(5)):r([M,v,0,z],[0,0,0,0],s&1?o(3):o(2),s&1?o(2):F),!k0&&s%6===3&&r([M,v,2,z+1],[0,0,0,0],o(5),o(5))}const c=Math.round(110*g0*P0),l=b==="line"?[T]:b==="dusk"?[T,S[2],S[4]]:[S[2],T,S[6]];for(let v=0;v<c;v++){const s=I.chance(.55),M=s?I.range(-95,40):I.range(-100,72),z=s?I.range(-6,30):I.range(-38,38),g=I.pick(l);r([M,z,I.range(.55,1.05),I.range(0,W)],[1,0,0,0],g,g)}x.setAttribute("aI",new A.InstancedBufferAttribute(new Float32Array(f),4)),x.setAttribute("aJ",new A.InstancedBufferAttribute(new Float32Array(i),4)),x.setAttribute("aCol",new A.InstancedBufferAttribute(new Float32Array(a),3)),x.setAttribute("aCol2",new A.InstancedBufferAttribute(new Float32Array(n),3)),x.instanceCount=f.length/4;const w=E(Dt,_t,Tt);w.vertexColors=!0,_(x,w,3)}await R.yield();let ht=0,U0=0,J0=0,Q0=0,j0=b==="dusk"?0:9,dt=0;const Ft=b==="sun"?.14:0,pt=t=>.1+.9*Z.progressFromU(t)+Ft*(1-U(.26,.5,t)),Rt=K.uWheel.value;function St(t,u,h,p){t=Math.min(Math.max(t||0,0),.1),p<dt-.3&&(U0=0,J0=0,Q0=0,Z.resetProgress(),b==="dusk"&&(j0=0)),dt=p;const x=X?1-U(.42,.45,p)-U(.47,.51,p):1;Z.setSpin(x),X&&Z.setFlip(p0((p-.46)/.11,0,1)),Z.setProgress(pt(p)),Z.update(t,u,h),q.uPatchZ.value=6+Z.patch.footX;const f=K.uWheel.value-Rt;if(q.uFlr.value.set(-f*.9,f*1.5+.4,u),q.uSpin.value.set(-f*1.3,f*.7),ht+=(X?-2*U(.51,.62,p):0)*t*2.6,q.uFlow.value=u*2.6+ht,q.uWaveP.value=X?p0((p-.51)/.13,0,1):0,U0=Math.max(U0,U(.085,.16,p)),J0=Math.max(J0,U(.135,.195,p)),Q0=Math.max(Q0,U(.73,.83,p)),q.uFan.value.set(U0,J0,Q0),q.uAside.value=U(.87,.95,p),q.uGust.value=.5+.5*Math.sin(u*.23),b==="dusk"){const i=p0(pt(p)*9+.6,0,9);j0=i-j0>2.5?i:Math.min(i,j0+t*1.1)}q.uLamp.value=j0}const vt=new A.Vector3(78.5,42,6),F0=new A.Vector3,H0=new A.Vector3;return{scene:b0,path:o0,duration:46,pace:t=>1.1-.55*xt(t,.15,.295,.2)-.25*xt(t,.58,.7,.3)-.1*U(.7,.76,t),title:b==="line"?"The Lotus Room, Grey Morning":b==="dusk"?"The Lotus Room, Blue Dusk":"The Lotus Room",camera:{fov:62,near:.3,far:900,lookAhead:20,sway:.6,bank:.12},pois:[{at:vt,from:0,to:.1,weight:.45},{at:(t,u)=>(o0.pointAt(u,F0),H0.set(F0.x+26,17,45)),from:.07,to:.235,weight:.62},{at:[56,19,45],from:.165,to:.262,weight:.8},{at:(t,u)=>{o0.pointAt(u,F0);const h=U(.25,.29,u);return H0.set(X0(56,79,h),X0(20,27,h),X0(45,Math.min(F0.z-9,22),h))},from:.225,to:.31,weight:.75},{at:(t,u)=>{o0.pointAt(u,F0);const h=U(.34,.4,u),p=U(.325,.36,u);return H0.set(80-70*h,28-3*h,X0(F0.z-5,-45,p))},from:.275,to:.4,weight:.7},{at:(t,u)=>{o0.pointAt(u,H0);const h=H0.y;return o0.pointAt(u+.04,F0),F0.setY(Math.min(F0.y,h)-6)},from:.335,to:.5,weight:.5,fade:.2},{at:[-80,14,-22],from:.37,to:.437,weight:.75},{at:vt,from:.43,to:.685,weight:.9},{at:[-110,32,6],from:.72,to:.9,weight:.3}],portal:{shape:"arch",width:14,height:14,color:b==="dusk"?"#E27A9A":b==="line"?"#F3EBD9":"#E9A91C",glow:b==="line"?.35:.5,revealDistance:220},post:{flat:1,exposure:1,bloom:{strength:0,radius:.5,threshold:1},grade:{saturation:1,contrast:1,vignette:0,grain:0}},ride:"none",style:"none",companion:"none",update:St,dispose(){}}}};export{Ut as default};
