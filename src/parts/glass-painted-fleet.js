import*as h from"three";const bt=["#0B0B0E","#1B49B5","#12B5B0","#E0322B","#F5B81F","#F4A3B5","#FBF6E6","#1F8A4C","#7A1F1A"],Me="#C08A2E",qe=new h.Matrix3().set(.59719,.35458,.04823,.076,.90834,.01566,.0284,.13383,.83777),Le=new h.Matrix3().set(1.60475,-.53108,-.07367,-.10208,1.10813,-.00605,-.00327,-.07276,1.07602),Pe=qe.clone().invert(),Re=Le.clone().invert(),X=new h.Vector3;function se(f){f=Math.min(.93,Math.max(5e-4,f));const t=1-.983729*f,e=.0245786-.432951*f,c=-(90537e-9+.238081*f);return(-e+Math.sqrt(Math.max(0,e*e-4*t*c)))/(2*t)}function lt(f,t=1,e=null){const c=f.isColor?f:new h.Color(f);return X.set(c.r*t,c.g*t,c.b*t),e&&X.set(X.x*e[0],X.y*e[1],X.z*e[2]),X.applyMatrix3(Re),X.set(se(X.x),se(X.y),se(X.z)).applyMatrix3(Pe),new h.Color(Math.max(0,X.x)*.6,Math.max(0,X.y)*.6,Math.max(0,X.z)*.6)}const F={PLAIN:0,STRIPE_V:1,STRIPE_U:2,DIAMOND:3,CHEVRON:4,CHECK:5,COMB:6,DOTS:7,CRESCENT:8,STAR:9,EYE:10,TILES:11,BALUSTER:12,LATTICE:13,HATCH:14,PLANKS:15,STUDS:16,BRACT:17,LEAF:18,DISC:19,DROP:20,DABS:21,FROND:22,FAN:24,TRI:25,CLOUD:26,CURL:27,ARCH:28,DECK:30},R={NOBORDER:1,GLOW:2,NOBRONZE:8,KEEP:16,INKONLY:32,FINE:64},Ht=`
float h11(float n){ return fract(sin(n*127.1+311.7)*43758.5453); }
float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+1.),f.x), f.y); }
vec2 gFace;
// returns (sel, d): sel 0 colour A, 1 colour B, 2 hole, 3 ink fill, 4 bronze; d = metres to the nearest painted edge
vec2 pat(float id, vec2 p, float sc, float seed){
  vec2 q = p / max(sc, 1e-3); float sel = 0., d = 1e3;
  if (id < .5) { }
  else if (id < 1.5) { float f = fract(q.y); sel = step(.5, f); d = min(min(f, 1.-f), abs(f-.5)) * sc; }
  else if (id < 2.5) { float f = fract(q.x); sel = step(.5, f); d = min(min(f, 1.-f), abs(f-.5)) * sc; }
  else if (id < 3.5) { vec2 f = abs(fract(q)-.5); float m = f.x+f.y; sel = step(m, .33); d = abs(m-.33)*sc*.7; }
  else if (id < 4.5) { float f = fract(q.y + abs(fract(q.x)-.5)); sel = step(.5, f); d = min(min(f, 1.-f), abs(f-.5))*sc*.7; }
  else if (id < 5.5) { vec2 c = floor(q), f = fract(q); sel = mod(c.x+c.y, 2.); d = min(min(f.x,1.-f.x), min(f.y,1.-f.y))*sc; }
  else if (id < 6.5) { float fy = fract(q.y), fx = fract(q.x*2.5); float tooth = step(.5, fx);
    sel = fy > .62 ? 1. : (fy > .12 ? tooth : 0.);
    d = min(abs(fy-.62), abs(fy-.12)) * sc; if (fy > .12 && fy < .62) d = min(d, min(min(fx,1.-fx), abs(fx-.5))*sc*.4); }
  else if (id < 7.5) { float r = length(fract(q)-.5); sel = step(r, .27); d = abs(r-.27)*sc; }
  else if (id < 8.5) { vec2 f = fract(q)-.5; float dc = max(length(f)-.38, .31-length(f-vec2(.15,.07))); sel = step(dc, 0.); d = abs(dc)*sc; }
  else if (id < 9.5) { vec2 f = fract(q)-.5; float r = length(f); float a = atan(f.y, f.x + 1e-5);
    float c5 = cos(a*2.5); float ds = r - (.13 + .25*c5*c5*c5*c5); sel = step(ds, 0.); d = abs(ds)*sc*.6; }
  else if (id < 10.5) { vec2 f = (fract(q*vec2(.5,1.))-.5)*vec2(2.,1.);
    float de = max(length(f-vec2(0.,.42))-.74, length(f+vec2(0.,.42))-.74); float r = length(f);
    sel = de < 0. ? (r < .17 ? 3. : (r < .27 ? 0. : 1.)) : 0.; d = min(abs(de), abs(r-.27) + step(0., de))*sc; }
  else if (id < 11.5) { float row = floor(q.y); vec2 f = vec2(fract(q.x + .5*mod(row,2.)), fract(q.y));
    float r = length(f - vec2(.5, .62)); sel = step(.72, h21(vec2(floor(q.x + .5*mod(row,2.)), row) + seed*9.));
    d = (f.y < .62 ? abs(r-.5) : min(abs(r-.5), min(f.x, 1.-f.x)))*sc; }
  else if (id < 12.5) { float f = abs(fract(q.x)-.5); float vy = p.y/max(gFace.y,1e-3);
    float w = .2 + .1*sin(vy*12.566) ; float rail = step(vy, .1) + step(.86, vy);
    sel = (rail > .5 || f < w) ? 0. : 2.; d = min(abs(f-w)*sc, min(abs(vy-.1), abs(vy-.86))*gFace.y); }
  else if (id < 13.5) { float a = fract(q.x+q.y), b = fract(q.x-q.y); float bar = step(a,.2) + step(b,.2);
    float vy = p.y/max(gFace.y,1e-3); float ch = step(gFace.y - .5, p.y) + step(p.y, .35);
    sel = (bar + ch) > .5 ? 0. : 2.; d = min(min(abs(a-.2), a), min(abs(b-.2), b))*sc*.7; d = min(d, min(abs(p.y-.35), abs(gFace.y-.5-p.y))); }
  else if (id < 14.5) { d = min(abs(fract(q.x+q.y)-.5), abs(fract(q.x-q.y)-.5))*sc*.7; }
  else if (id < 15.5) { d = abs(fract(q.y)-.5)*sc; }
  else if (id < 16.5) { float r = length(fract(q)-.5); sel = r < .2 ? 4. : 0.; d = abs(r-.2)*sc; }
  else if (id < 18.5) { vec2 f = p/max(gFace,vec2(1e-3)) - .5; float dl = max(length(f-vec2(.38,0.)), length(f+vec2(.38,0.))) - .62;
    sel = dl < 0. ? 0. : 2.; d = id < 17.5 ? abs(f.x)*gFace.x + step(.3, abs(f.y)) : min(abs(dl)*gFace.x, abs(f.x)*gFace.x + step(0., dl)); }
  else if (id < 19.5) { vec2 f = p/max(gFace,vec2(1e-3)) - .5; float r = length(f); float a = atan(f.y, f.x + 1e-5);
    float n = floor(sc + .5); float sa = fract(a/6.2832*n);
    sel = r > .5 ? 2. : (n > .5 ? step(.5, sa) : 0.); d = abs(r-.5)*gFace.x; if (n > .5) d = min(d, min(min(sa,1.-sa),abs(sa-.5))*6.2832*r*gFace.x/n);
    if (seed > .5) { d = min(d, abs(r-.16)*gFace.x); if (r < .16) sel = 1.; } }
  else if (id < 20.5) { vec2 f = vec2(p.x/max(gFace.x,1e-3) - .5, p.y/max(gFace.y,1e-3));
    float dd = f.y < .3 ? length(vec2(f.x, (f.y-.3))) - .3 : abs(f.x) - .3*(1.-smoothstep(.3, 1., f.y));
    float hd = length(vec2(f.x, f.y-.86)*vec2(1., gFace.y/max(gFace.x,1e-3))) - .16;
    sel = min(dd, hd) < 0. ? (hd < 0. ? 3. : 0.) : 2.; d = abs(min(dd,hd))*gFace.x; }
  else if (id < 21.5) { vec2 c = floor(q); vec2 f = fract(q)-.5; float hh = h21(c + seed*3.); float a = hh*6.2832;
    vec2 r = vec2(cos(a)*f.x + sin(a)*f.y, -sin(a)*f.x + cos(a)*f.y);
    float dd = max(abs(r.x)-.3, abs(r.y + r.x*r.x*.9)-.055); sel = (hh > .45 && dd < 0.) ? 1. : 0.; }
  else if (id < 22.5) { float t = p.x/max(gFace.x,1e-3); float fy = abs(p.y/max(gFace.y,1e-3) - .5);
    float tooth = step(fract(q.x), .6); float w = .5*(1.-t*t)*(.25+.75*smoothstep(0.,.15,t));
    sel = (fy < .07 || (tooth > .5 && fy < w)) ? 0. : 2.; d = abs(fy-.07)*gFace.y; }
  else if (id < 24.5) { vec2 f = vec2((p.x/max(gFace.x,1e-3) - .5)*2., p.y/max(gFace.y,1e-3)); float r = length(f);
    float n = max(floor(sc+.5), 1.); float sa = fract(atan(f.y, f.x + 1e-5)/3.1416*n);
    sel = r > 1. ? 2. : (r < .25 ? 1. : step(.5, sa)); d = min(abs(r-1.), abs(r-.25))*gFace.y; d = min(d, min(min(sa,1.-sa),abs(sa-.5))*3.1416*r*gFace.y/n); }
  else if (id < 25.5) { vec2 f = p/max(gFace,vec2(1e-3)); float dd = abs(f.x-.5)*2. - f.y; sel = dd > 0. ? 2. : 0.; d = abs(dd)*gFace.x*.45; }
  else if (id < 26.5) { vec2 f = (p/max(gFace,vec2(1e-3)) - vec2(.5,.36))*vec2(gFace.x/max(gFace.y,1e-3), 1.);
    float dd = length(f)-.34; dd = min(dd, length(f-vec2(.42,-.06))-.27); dd = min(dd, length(f+vec2(.44,.08))-.25);
    dd = min(dd, length(f-vec2(.8,-.16))-.18); dd = min(dd, length(f+vec2(.82,.17))-.17); dd = min(dd, length(f-vec2(.16,.2))-.3);
    dd = max(dd, -.34 - f.y);
    float cu = abs(length(f-vec2(.1,.02))-.15) + step(f.x, .1)*step(f.y, .02);
    sel = dd < 0. ? 1. : 2.; d = min(abs(dd), dd < -.03 ? cu : 1.)*gFace.y; }
  else if (id < 27.5) { vec2 f = p/max(gFace,vec2(1e-3)); float r = length(f - vec2(.0, 1.));
    float c1 = abs(r - .82); float c2 = abs(length(f-vec2(.62,.4))-.2);
    sel = (c1 < .065 || (c2 < .055 && f.x > .4)) ? 3. : 2.; d = 1e3; }
  else if (id < 28.5) { vec2 f = vec2(abs(p.x/max(gFace.x,1e-3) - .5)*2., p.y/max(gFace.y,1e-3));
    float top = f.y - .62; float dd = top > 0. ? length(vec2(f.x, top/.38)) - 1. : f.x - 1.; sel = dd > 0. ? 2. : 0.; d = abs(dd)*gFace.x*.5;
    d = min(d, abs(fract(q.y)-.5)*sc); }
  return vec2(sel, d);
}
`,Ie=`
attribute vec3 aCol; attribute vec3 aCol2; attribute vec4 e; attribute vec4 pt; attribute vec4 mv;
uniform float uTime; uniform vec4 uWind; uniform float uFlap;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vCol2; varying vec4 vE; varying vec4 vPt; flat varying float vSeed;
void main(){
  vec3 p = position; float iph = 0.; vSeed = 0.;
  mat4 mm = modelMatrix;
  #ifdef USE_INSTANCING
    mm = modelMatrix * instanceMatrix; iph = instanceMatrix[3].x*.37 + instanceMatrix[3].z*.23;
  #endif
  vCol = aCol; vCol2 = aCol2;
  #ifdef USE_INSTANCING_COLOR
    vSeed = instanceColor.r;
    #if !defined(HULL) && !defined(FLAG)
      vCol = aCol * instanceColor; 
    #endif
  #endif
  #ifdef FLAG
    float dc = length(cameraPosition - mm[3].xyz);
    if (mod(floor((pt.w + .5)/16.), 2.) > .5) p.xz *= max(1., dc/45.); else p.xy *= vec2(min(1. + dc/260., 2.6), min(1. + dc/400., 2.));
    iph += vSeed*40.;
  #endif
  float fr = abs(mv.x), am = mv.y, sway = 0.;
  if (am != 0.) {
    float ph = uTime*fr + mv.z + iph + (fr > 3. ? e.x*1.9 + e.y*.8 : 0.);
    float s = sin(ph) + (fr > 3. ? .45*sin(ph*2.3 + 1.) : 0.);
    if (am > 0.) p += normal * (am*mv.w*s*(fr > 3. ? uFlap : 1.)); else sway = -am*mv.w*s;
  }
  vec4 w = mm * vec4(p, 1.);
  w.xyz += uWind.xyz * sway;
  vW = w.xyz; vN = normalize(mat3(mm) * normal + vec3(0., 1e-6, 0.)); vE = e; vPt = pt;
  gl_Position = projectionMatrix * viewMatrix * w;
  #ifdef PROW
    gl_Position.z = (gl_Position.z + gl_Position.w) * .02 - gl_Position.w;      // our own prow is drawn in front of the sea
  #endif
}`,Oe=`
uniform float uTime, uGap, uInk, uBronzeAmt, uFlagBronze; uniform vec3 uSun, uInkCol, uBack, uBronze, uTint; uniform vec3 uPal[9]; uniform vec2 uDom;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec3 vCol2; varying vec4 vE; varying vec4 vPt; flat varying float vSeed;
${Ht}
float gHole, gSd, gSc; vec3 gMean;
vec3 pal(float i){ return uPal[int(clamp(i, 0., 8.) + .5)]; }
// per-boat choices: gSd is the boat's seed as a small integer (never the raw interpolated varying), hashed without sin
float hs(float k){ return h21(vec2(gSd, k)); }
#ifdef HULL
vec3 hullPaint(vec2 p, out float d){
  float L = gFace.x, v = p.y / gFace.y;
  float band = v < .34 ? 0. : (v < .7 ? 1. : 2.);
  float bowp = step(.34, v) * step(L*.79, p.x) * step(p.x, L*.985);
  float k = bowp > .5 ? 3. : band;
  float v0 = k > 2.5 ? .34 : (band < .5 ? 0. : (band < 1.5 ? .34 : .7)), v1 = k > 2.5 ? 1. : (band < .5 ? .34 : (band < 1.5 ? .7 : 1.));
  float h1 = hs(k*7. + 1.), h2 = hs(k*7. + 2.), h3 = hs(k*7. + 3.);
  float id = k > 2.5 ? (h1 < .42 ? 10. : (h1 < .72 ? 9. : 8.)) : floor(1. + h1*8.999);
  float ca = 1. + floor(h2*4.999), cb = 1. + floor(h3*4.999);
  if (hs(k*7. + 4.) < .55) ca = uDom.x;
  if (hs(k*7. + 5.) < .4) cb = uDom.y;
  if (abs(cb - ca) < .5) cb = 6.;
  if (id > 9.5) cb = 6.;
  float hb = (v1 - v0) * gFace.y;
  vec2 pl = vec2(p.x - (k > 2.5 ? L*.79 : 0.), (v - v0) * gFace.y);
  float sc = id < 1.5 ? hb : (id < 2.5 ? hb*1.6 : hb);
  if (id > 4.5 && id < 5.5) sc = hb*.5;
  if (id > 9.5) pl.x += .08*L - hb*2.;
  vec2 r = pat(id, pl, sc, 0.);
  d = min(r.y, min(abs(v-.34), abs(v-.7)) * gFace.y);
  if (v > .34) d = min(d, min(abs(p.x - L*.79), abs(p.x - L*.985)));
  // far away the pattern is replaced by the band's mean colour instead of turning to moire
  float fb = id < 2.5 ? .5 : (id < 3.5 ? .22 : (id < 6.5 ? .5 : (id < 7.5 ? .23 : (id < 9.5 ? .18 : .4))));
  gSc = (id > 4.5 && id < 5.5) ? sc : sc*.5; gMean = mix(pal(ca), pal(cb), fb);
  return r.x < .5 ? pal(ca) : (r.x < 1.5 ? pal(cb) : uInkCol);
}
#endif
#ifdef FLAG
vec3 flagPaint(vec2 p, out float d){
  vec2 f = p / max(gFace, vec2(1e-3)); float hz = step(.5, hs(3.)); float t = hz > .5 ? f.y : f.x;
  float n = 2. + floor(hs(5.)*1.99); float k = min(floor(t*n), n-1.), ft = fract(t*n);
  float blk = (hz > .5 ? gFace.y : gFace.x) / n;
  d = min(k > .5 ? ft : 1., k < n-1.5 ? 1.-ft : 1.) * blk;
  vec3 c = pal(1. + floor(hs(11. + k*3.)*5.999));
  gSc = blk; gMean = c;                 // the ink between blocks fades by the block's own size
  return c;
}
#endif
vec3 paint(vec2 p, out float d){
  gHole = 0.; gSc = -1.;
  float flags = floor(vPt.w + .5), seed = vPt.y;
  #ifdef HULL
    if (vPt.x < 29.5) return hullPaint(p, d);
    if (vPt.x > 30.5) { vec2 rb = pat(2., p, vPt.z, seed); d = rb.y; return rb.x < .5 ? pal(1. + floor(hs(77.)*4.999)) : pal(6.); }
  #endif
  #ifdef FLAG
    if (mod(floor(flags/16.), 2.) < .5) return flagPaint(p, d);
  #endif
  float id = vPt.x > 29.5 ? 2. : vPt.x;
  vec2 r = pat(id, p, vPt.z, seed); d = r.y;
  if (r.x > 1.5 && r.x < 2.5) gHole = 1.;
  // far away every repeating pattern settles to its mean colour instead of breaking into confetti
  if ((id > .5 && id < 7.5) || (id > 10.5 && id < 16.5)) {
    float fb = id < 2.5 ? .5 : (id < 3.5 ? .22 : (id < 5.5 ? .5 : (id < 6.5 ? .6 : (id < 7.5 ? .23 : (id < 11.5 ? .28 : 0.)))));
    float ks = (id > 5.5 && id < 6.5) ? .4 : ((id > 12.5 && id < 13.5) ? .6 : ((id > 6.5 && id < 7.5) || id > 15.5 ? .5 : 1.));
    gSc = vPt.z * ks; gMean = mix(vCol, vCol2, fb);
  }
  return r.x < .5 ? vCol : (r.x < 1.5 ? vCol2 : (r.x < 3.5 ? uInkCol : uBronze));
}
void main(){
  vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  vec3 N = normalize(vN); float nv = dot(N, V); if (nv < 0.) { N = -N; nv = -nv; }
  float ndv = max(nv, .3);
  vec3 dpx = dFdx(vW), dpy = dFdy(vW); vec2 dux = dFdx(vE.xy), duy = dFdy(vE.xy);
  float px = max(max(length(dux), length(duy)), 1e-5);
  vec3 T = (N*nv - V) * (uGap / ndv);
  float a11 = dot(dpx,dpx), a12 = dot(dpx,dpy), a22 = dot(dpy,dpy), det = a11*a22 - a12*a12;
  vec2 sh = vec2(0.);
  if (det > 1e-14) { vec2 ab = vec2(a22*dot(T,dpx) - a12*dot(T,dpy), a11*dot(T,dpy) - a12*dot(T,dpx)) / det; sh = ab.x*dux + ab.y*duy; }
  float sl = length(sh); if (sl > .28) sh *= .28 / sl;
  gFace = vE.zw; gSd = floor(vSeed*4095. + .5);
  float flags = floor(vPt.w + .5);
  sh *= mix(1., .3, mod(floor(flags/64.), 2.));
  float noBorder = mod(flags, 2.), glow = mod(floor(flags/2.), 2.), noBronze = mod(floor(flags/8.), 2.), inkOnly = mod(floor(flags/32.), 2.);
  float dT, dE; 
  vec3 cT = paint(vE.xy, dT); float holeT = gHole;
  vec2 pe = vE.xy + sh;
  vec3 col = paint(pe, dE); float holeE = gHole;
  float sc = max(vPt.z, .05);
  float fLo = 1., fHi = 3., iLo = 1.2, iHi = 3.;
  #ifdef HULL
    fLo = 2.2; fHi = 6.; iLo = 2.6; iHi = 6.;      // far hulls settle to their band colours instead of shimmering
  #endif
  if (gSc > 0.) { sc = gSc; col = mix(gMean, col, smoothstep(fLo, fHi, gSc/px)); }
  float wob = .78 + .44*vn(vE.xy*1.7 + vPt.y*31. + vSeed*57.);
  float lw = max(uInk*wob*mix(1., .42, mod(floor(flags/64.), 2.)), .75*px);
  float bd = min(min(vE.x, vE.z - vE.x), min(vE.y, vE.w - vE.y));
  float inkB = (1. - noBorder) * (1. - smoothstep(lw*1.25 - px*.5, lw*1.25 + px*.5, bd)) * smoothstep(2.5, 6., min(vE.z, vE.w)/px) * (1. - holeT);
  float inkP = (1. - smoothstep(lw - px*.5, lw + px*.5, dT)) * (1. - smoothstep(120., 190., dist)) * smoothstep(iLo, iHi, sc/px);
  if (vPt.x > 16.5 && vPt.x < 25.5) inkP *= smoothstep(3., 8., min(vE.z, vE.w)/px);
  float ink = max(inkB, inkP);
  if ((holeE > .5 || inkOnly > .5) && ink < .5) discard;
  if (noBorder < .5 && holeE < .5 && (pe.x < 0. || pe.y < 0. || pe.x > vE.z || pe.y > vE.w)) col = uBack;
  // bronze: a third, deeper layer on what faces up and toward the sun
  vec2 bq = (vE.xy + sh*2.) * vec2(2.1, 6.5); float brow = floor(bq.y); bq.x += brow*.37;
  float dash = step(.6, h21(vec2(floor(bq.x), brow))) * step(abs(fract(bq.y)-.5), .24) * step(abs(fract(bq.x)-.5), .4);
  float sp = max(dot(N, normalize(uSun + V + vec3(0., 1e-4, 0.))), 0.); sp *= sp; sp *= sp; sp *= sp;
  float bm = smoothstep(.3, .8, dot(N, uSun)) * (1. - noBronze) * (1. - smoothstep(70., 150., dist)) * uBronzeAmt;
  col = mix(col, uBronze * (.72 + 1.2*sp), min(dash*bm, 1.));
  vec3 ic = uInkCol;
  #ifdef FLAG
    ic = mix(ic, uBronze*1.1, uFlagBronze * step(inkP, inkB));
  #endif
  col = mix(col, ic, ink);
  col *= mix(uTint, vec3(1.), glow);
  gl_FragColor = vec4(col, 1.);
}`,De=`
uniform vec3 uSky, uSea, uInkCol, uBronze, uSunDisc, uSquall; uniform float uStars, uSquallAmt, uTime, uDisc;
uniform vec4 uCloud[8]; uniform vec2 uShear; uniform float uDrift; uniform vec3 uCloudCol;
varying vec3 vD;
${Ht}
float cloudSd(vec2 f){ float dd = length(f)-.34; dd = min(dd, length(f-vec2(.42,-.06))-.27); dd = min(dd, length(f+vec2(.44,.08))-.25);
  dd = min(dd, length(f-vec2(.8,-.16))-.18); dd = min(dd, length(f+vec2(.82,.17))-.17); dd = min(dd, length(f-vec2(.16,.2))-.3); return max(dd, -.3 - f.y); }
// the low cloud bank in the west: a flat base and a scalloped top that swells and thins, open over the portal
float bankTop(float az){ float ab = abs(az);
  float env = smoothstep(.13, .24, ab) * (1. - smoothstep(.78, 1.03, ab));
  float hump = .5 + .5*sin(az*5.3 + 1.1) * sin(az*2.1 + .4);
  float sc = abs(sin(az*23. + 1.6*sin(az*5.)));
  return .036 + env * (.006 + .058*hump) * (.4 + .6*sc); }
void main(){
  vec3 d = normalize(vD); float fy = max(fwidth(d.y), 1e-5);
  vec3 col = d.y > 0. ? uSky : uSea;
  // five small scalloped clouds: white behind, ink outline and one inner curl in front, the two layers shearing as the eye moves
  if (d.y > .03) {
    float az = atan(-d.x, d.z + 1e-5); float cink = 0.;
    if (abs(az) < 1.06 && d.y < .14) {
      float tp = bankTop(az), sl = (bankTop(az + .004) - bankTop(az - .004)) / .008;
      float tF = bankTop(az + uShear.x*4.), yF = d.y + uShear.y;
      float thick = smoothstep(.003, .008, tp - .036), wb = max(.0026, fy*1.1);
      col = mix(col, uCloudCol, step(.036, yF) * step(yF, tF) * step(.0035, tF - .036));
      float ed = min(abs(d.y - tp) / sqrt(1. + sl*sl), abs(d.y - .036));
      cink = (1. - smoothstep(wb, wb + fy, ed)) * step(.036 - wb - fy, d.y) * step(d.y, tp + wb + fy) * thick;
    }
    for (int i = 0; i < 8; i++) {
      vec4 c = uCloud[i]; float da = mod(az - c.x - uDrift + 3.14159, 6.28318) - 3.14159;
      vec2 p = vec2(da, d.y - c.y) / c.z * vec2(c.w, 1.);
      if (abs(p.x) < 1.3 && abs(p.y) < 1.) {
        float sI = cloudSd(p) * c.z, sF = cloudSd(p + uShear / c.z) * c.z; float w = max(.0032, fy*1.1);
        col = mix(col, uCloudCol, step(sF, 0.));
        cink = max(cink, 1. - smoothstep(w, w + fy, abs(sI)));
        float cu = abs(length(p - vec2(.1, .02)) - .15) * c.z + (p.x < .1 && p.y < .02 ? 1. : 0.);
        cink = max(cink, (1. - smoothstep(w*.8, w*.8 + fy, cu)) * step(sI, -w));
      }
    }
    col = mix(col, uInkCol, cink);
  }
  if (uStars > .01 && d.y > .02) {
    vec2 sp = vec2(atan(d.z, d.x + 1e-5)*14., d.y*26.); vec2 c = floor(sp), f = fract(sp)-.5; float hh = h21(c);
    vec2 o = (vec2(h21(c+3.1), h21(c+7.7))-.5)*.6; float r = length((f-o)*vec2(1., 1.));
    float tw = .75 + .25*sin(uTime*(1.+hh*2.) + hh*40.);
    col = mix(col, uBronze*(1.1*tw), uStars*step(.78, hh)*(1.-smoothstep(.07, .1, r)));
  }
  if (uDisc > .01) {
    float c = dot(d, normalize(uSunDisc)); float r = acos(clamp(c, -1., 1.));
    float rd = uDisc; float w = fwidth(r) + 1e-5;
    float disc = 1. - smoothstep(rd - w, rd + w, r);
    if (uStars > .01) { vec3 d2 = normalize(uSunDisc + vec3(.012, .008, 0.)*8.*rd); float r2 = acos(clamp(dot(d, d2), -1., 1.)); disc *= smoothstep(rd*.9 - w, rd*.9 + w, r2); }
    col = mix(col, uBronze*1.25, disc * step(0., d.y));
    float ring = 1. - smoothstep(w*1.2, w*2.4, abs(r - rd)); if (uStars < .01) col = mix(col, uInkCol, ring*step(0., d.y));
  }
  if (uSquallAmt > .01) {
    float az = atan(-d.x, d.z + 1e-5);            // 0 = west, +pi/2 = north
    float a = (az - 1.25) / .55; float top = .34*(1. - a*a) + .02*sin(a*23.) + .015*sin(a*51.+2.);
    if (abs(a) < 1. && d.y > 0.) {
      float inC = step(d.y, top) * step(.11 + .03*sin(a*9.), d.y);
      float edge = min(abs(d.y - top), abs(d.y - .11 - .03*sin(a*9.)));
      float rain = step(d.y, .12) * step(abs(fract((az*38. + d.y*60.) + uTime*.0)-.5), .09) * step(.3, fract(d.y*31. - uTime*1.2 + floor(az*38. + d.y*60.)*.37));
      col = mix(col, uSquall, inC*uSquallAmt);
      col = mix(col, uInkCol, max((1. - smoothstep(fy*1.5, fy*3., edge)) * step(d.y, top + fy*3.), rain) * uSquallAmt);
    }
  }
  col = mix(col, uInkCol, 1. - smoothstep(fy*.9, fy*1.9, abs(d.y)));
  gl_FragColor = vec4(col, 1.);
}`,gt={L:58,C:5},ne=`
uniform float uTau, uTime, uL, uC;
float envz(float z){ return (.6 + .0185*z) * smoothstep(8., 50., z) * (1. - smoothstep(150., 185., z)); }
float wave(vec2 xz, out float dOut, out float aOut){
  float zc = xz.y + uC*uTau + 3.*sin(xz.x*.021 + 1.3) + 1.5*sin(xz.x*.057);
  float k = floor(zc/uL + .5); float d = zc - k*uL;
  float a = envz(xz.y) * (.85 + .15*sin(xz.x*.013 + k*2.1));
  float w = d < 0. ? 3.2 : 7.5;
  dOut = d; aOut = a;
  return a*exp(-(d*d)/(w*w)) + .1*sin(xz.x*.21 + uTime*1.1)*sin(xz.y*.17 - uTime*.8)*smoothstep(-2., 12., xz.y);
}`,Mt=(f,t,e)=>{const c=Math.min(1,Math.max(0,(e-f)/(t-f)));return c*c*(3-2*c)};function Ve(f,t,e,c){const s=gt.L,m=t+gt.C*e+3*Math.sin(f*.021+1.3)+1.5*Math.sin(f*.057),p=Math.floor(m/s+.5),v=m-p*s,a=(.6+.0185*t)*Mt(8,50,t)*(1-Mt(150,185,t))*(.85+.15*Math.sin(f*.013+p*2.1)),o=v<0?3.2:7.5;return a*Math.exp(-(v*v)/(o*o))+.1*Math.sin(f*.21+c*1.1)*Math.sin(t*.17-c*.8)*Mt(-2,12,t)}const _e=`
${ne}
varying vec3 vW;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  float d, a; float h = wave(w.xz, d, a);
  if (w.z < 4. && w.z > -14.) h = max(h, -w.z/60. + .09);
  w.y += h; vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Ge=`
uniform float uGap, uBronzeAmt, uLamp; uniform vec3 uSea, uRiver, uFoam, uInkCol, uBronze, uTint, uSun;
varying vec3 vW;
${Ht}
${ne}
// one layer of comma strokes; returns signed distance (metres * s) to the stroke, cell hash in hh
float comma(vec2 xz, float s, float scroll, float river, float thk, float arc, out float hh){
  vec2 q = vec2(xz.x/(3.4*s), (xz.y + scroll)/(4.6*s)); float row = floor(q.y);
  q.x += row*.37 + river*.12*sin(uTime*.9 + row*1.7);
  vec2 c = vec2(floor(q.x), row); hh = h21(c);
  vec2 m = (fract(q) - .5) * vec2(3.4, 4.6);
  m.y += .25*sin(uTime*1.3 + hh*30.);
  float r = length(m - vec2(0., -.95)); float ang = atan(m.x, m.y + .95 + 1e-5);
  float th = thk * (1. - clamp((ang + arc)/(2.*arc), 0., 1.)*.85);
  return (abs(ang) < arc ? abs(r - .95) - th : 1.) * s;
}
void main(){
  vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  float river = step(vW.z, -150.);
  float vD, vA; wave(vW.xz, vD, vA);            // the crest phase per fragment: interpolating it across the crest-index jump drew a stray line
  float swE = -3.6 + 3.1*sin(uTime*.55 + vW.x*.021) - 1.4*abs(sin(vW.x*.41 + .6*sin(uTime*.3)));
  float swT = vW.z - swE, swF = max(fwidth(swT), 1e-4);      // the footprint across the swash line, taken outside any branch
  if (river < .5 && vW.z < swE) discard;
  float px = max(max(length(dFdx(vW.xz)), length(dFdy(vW.xz))), 1e-4);
  vec2 sh = -V.xz * (uGap / max(V.y, .22)); float sl = length(sh); if (sl > .35) sh *= .35/sl;
  vec3 col = mix(uSea, uRiver, river);
  // comma rows at three scales, cross-faded with distance so the rows stay ruled to the horizon
  float w0 = 1. - smoothstep(45., 90., dist), w2 = smoothstep(170., 320., dist), w1 = 1. - w0 - w2;
  float scroll = (1. - river) * uTime * 1.7;
  float wh = 0., ik = 0., hh;
  for (int i = 0; i < 3; i++) {
    float s = i == 0 ? 1. : (i == 1 ? 2.6 : 7.); float wgt = i == 0 ? w0 : (i == 1 ? w1 : w2);
    if (wgt > .01) {
      float lw = max(.05*s, .75*px);
      float nearK = i == 0 ? (1. - smoothstep(22., 40., dist)) * (1. - .6*river) : 0.; float thk = mix(.2, .31, nearK), arc = mix(.75, 1.2, nearK);
      float dT = comma(vW.xz, s, scroll, river, thk, arc, hh); float on = step(.34, hh);
      float dE = comma(vW.xz + sh*s, s, scroll, river, thk, arc, hh);
      wh = max(wh, wgt * on * (1. - smoothstep(-px*.5, px*.5, dE)));
      ik = max(ik, wgt * on * (1. - smoothstep(lw - px*.5, lw + px*.5, abs(dT))) * step(0., dT) * smoothstep(.8, 2., .2*s/px));
    }
  }
  col = mix(col, uFoam, wh);
  // bronze on the wave backs
  vec2 bq = (vW.xz + sh*2.) * vec2(1.3, .45); float brow = floor(bq.y); bq.x += brow*.41;
  float dash = step(.5, h21(vec2(floor(bq.x), brow))) * step(abs(fract(bq.y)-.5), .2) * step(abs(fract(bq.x)-.5), .36);
  float sp = max(dot(vec3(0., 1., 0.), normalize(uSun + V + vec3(0., 1e-4, 0.))), 0.); sp *= sp; sp *= sp;
  col = mix(col, uBronze*(.7 + 1.2*sp), min(1., dash * smoothstep(.5, 1.2, vA) * smoothstep(1., 3., vD) * (1. - smoothstep(8., 13., vD)) * uBronzeAmt * (1. - smoothstep(90., 200., dist))));
  // the breaker: a scalloped white band down the front of the crest, outlined in ink, with curls
  float lwb = max(.07, .8*px);
  if (vA > .25) {
    float sc = abs(sin(vW.x*.52 + sin(vW.x*.13)*1.5));
    float lo = -(1.1 + 1.5*vA) + (.5 + .5*vA)*sc, hi = .45;
    float inB = step(lo, vD) * step(vD, hi);
    float ed = min(abs(vD - lo), abs(vD - hi));
    vec2 cc = vec2(fract(vW.x*.52/3.1416 + .5) - .5, (vD - lo)*.3 - .28);
    float cu = abs(length(cc) - .17) + step(cc.x, 0.)*step(cc.y, 0.);      // an open curl, not a closed loop
    float g = smoothstep(.25, .5, vA);
    // lace, near the eye: round holes where the sea shows through the foam, each ringed in ink, and a second scalloped line inside the band
    float lace = (1. - smoothstep(45., 85., dist)) * smoothstep(2.5, 6., .3/px);
    vec2 q = vec2(vW.x*.8, (vD - lo)*1.1); float hr = length(fract(q) - .5);
    float hOn = step(.6, h21(floor(q) + 3.7)) * step(.5, q.y) * step(q.y + .7, (hi - lo)*1.1) * inB * lace;
    float hole = hOn * (1. - smoothstep(.3 - px*.5, .3 + px*.5, hr));
    float ed2 = abs(vD - lo - .45*(hi - lo)) + 4.*hole;
    col = mix(col, uFoam, inB*g);
    col = mix(col, uSea, hole*g);
    float cth = mix(.012, .035, smoothstep(10., 45., dist));      // the curl is a thin stroke close to, and holds its width far off
    float ikb = (1. - smoothstep(lwb, lwb + px, ed)) * step(lo - lwb*2., vD) * step(vD, hi + lwb*2.) * smoothstep(2.5, 6., (hi - lo)/px);
    ikb = max(ikb, inB*(1. - hole)*(1. - smoothstep(cth, cth + px*.3, cu)) * (1. - smoothstep(60., 120., dist)));
    ikb = max(ikb, inB*(1. - smoothstep(lwb, lwb + px, ed2)) * (1. - smoothstep(60., 110., dist)) * smoothstep(3., 7., (hi - lo)/px));
    ikb = max(ikb, hOn*(1. - smoothstep(lwb, lwb + px, abs(hr - .3))));
    ik = max(ik, g*ikb);
  }
  // swash: foam scallops sliding up the sand and back
  if (river < .5 && vW.z < swE + 9.) {
    float band = 1.3 + .5*sin(vW.x*.9 + uTime); float lws = max(.07, .8*swF);
    col = mix(col, uFoam, step(swT, band));
    ik = max(ik, (1. - smoothstep(lws, lws + swF, min(swT, abs(swT - band)))) * smoothstep(1.5, 4., band/swF));
  }
  col = mix(col, uInkCol, ik);
  gl_FragColor = vec4(col * uTint, 1.);
}`,Ue=`
uniform float uSlide, uAmt; varying vec2 vUv;
void main(){
  vec2 p = vUv; float t = p.x*.8 + p.y*.6 - uSlide;
  float f = fract(t*.55); float streak = smoothstep(.0, .06, f) * (1. - smoothstep(.1, .34, f));
  float s2 = fract(t*.55 + .43); streak += .45 * smoothstep(.0, .02, s2) * (1. - smoothstep(.03, .08, s2));
  float a = .05 * streak;
  gl_FragColor = vec4(vec3(min(a, .08) * uAmt), 1.);
}`;function We(f={}){const t=f.mul||null,e=M=>lt(M,1,t),c=bt.map(M=>e(M)),s={uTime:{value:0},uTau:{value:0},uL:{value:gt.L},uC:{value:gt.C},uWind:{value:new h.Vector4(.64,0,.77,1)},uFlap:{value:1},uGap:{value:f.gap??.075},uInk:{value:f.ink??.034},uInkCol:{value:e(bt[0])},uBack:{value:e("#F3EBD2")},uBronze:{value:e(Me)},uBronzeAmt:{value:1},uTint:{value:new h.Color(1,1,1)},uSun:{value:new h.Vector3(.24,.97,0).normalize()},uPal:{value:c},uDom:{value:new h.Vector2(3,4)},uFlagBronze:{value:0},uSea:{value:e(bt[2])},uRiver:{value:e("#14AAA8")},uFoam:{value:e(bt[6])},uLamp:{value:0}},m=[];function p(M={}){const S={};M.hull&&(S.HULL=1),M.flag&&(S.FLAG=1),M.prow&&(S.PROW=1);const B=new h.ShaderMaterial({uniforms:s,vertexShader:Ie,fragmentShader:Oe,defines:S,side:M.side??h.DoubleSide});return m.push(B),B}const v=new h.ShaderMaterial({uniforms:s,vertexShader:_e,fragmentShader:Ge,side:h.DoubleSide}),a={uSky:{value:lt(bt[1])},uSea:s.uSea,uInkCol:s.uInkCol,uBronze:{value:lt(Me)},uTime:s.uTime,uCloud:{value:[[.44,.17,.19,-1],[1.35,.27,.18,1],[2.4,.34,.11,-1],[1.78,.4,.16,1],[4.5,.27,.11,-1],[5.55,.34,.11,1],[.08,.43,.23,1],[-.34,.25,.16,-1]].map(M=>new h.Vector4(M[0],M[1],M[2],M[3]))},uShear:{value:new h.Vector2},uDrift:{value:0},uCloudCol:{value:e(bt[6])},uSunDisc:{value:new h.Vector3(0,.1,1)},uDisc:{value:0},uStars:{value:0},uSquall:{value:lt("#5B3F9E")},uSquallAmt:{value:0}},o=new h.Mesh(new h.SphereGeometry(2600,32,20),new h.ShaderMaterial({uniforms:a,side:h.BackSide,depthWrite:!1,depthTest:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:De}));o.renderOrder=-1,o.frustumCulled=!1;const u={uSlide:{value:0},uAmt:{value:1}},d=new h.Mesh(new h.PlaneGeometry(2,2),new h.ShaderMaterial({uniforms:u,depthTest:!1,depthWrite:!1,transparent:!0,blending:h.AdditiveBlending,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Ue}));d.renderOrder=50,d.frustumCulled=!1;const z=new h.Vector3,w=new h.Vector3,x=new h.Quaternion,E=new h.Vector3;return{P:c,uniforms:s,skyU:a,paneU:u,mat:p,sea:v,sky:o,pane:d,enc:lt,camPos:w,camQuat:x,update(M,S,B=0){s.uTime.value=M,S.matrixWorld.decompose(w,x,E),o.position.copy(w),z.set(0,0,-1).applyQuaternion(x);const I=Math.tan((S.fov||62)*Math.PI/360)*1.02,C=S.aspect||1.78;d.position.copy(w).addScaledVector(z,1),d.quaternion.copy(x),d.scale.set(I*C,I,1),u.uSlide.value=Math.atan2(z.x,z.z)*.9+B*3,a.uDrift.value=M*.0035,a.uShear.value.set((w.x*.6+w.z*.8)*5e-5,w.y*4e-4)}}}const zt=new h.Vector3,St=new h.Vector3,Pt=new h.Vector3,Rt=new h.Vector3,ot=new h.Vector3,Kt=new h.Vector3,ze=new h.Color(1,1,1),Se=new h.Vector3(0,1,0);class rt{constructor(t=6e3){this.n=0,this.cap=t,this.M=null,this.P=new Float32Array(t*3),this.N=new Float32Array(t*3),this.C=new Float32Array(t*3),this.C2=new Float32Array(t*3),this.E=new Float32Array(t*4),this.T=new Float32Array(t*4),this.V=new Float32Array(t*4),this.c=ze,this.c2=ze,this.pid=0,this.sc=1,this.fl=0,this.seed=0,this.wf=0,this.wa=0,this.wp=0}_grow(){const t=this.cap*2;for(const[e,c]of[["P",3],["N",3],["C",3],["C2",3],["E",4],["T",4],["V",4]]){const s=new Float32Array(t*c);s.set(this[e]),this[e]=s}this.cap=t}col(t,e){return this.c=t,this.c2=e||t,this}pat(t=0,e=1,c=0,s=0){return this.pid=t,this.sc=e,this.fl=c,this.seed=Math.min(.999,Math.max(0,s)),this}wave(t=0,e=0,c=0){return this.wf=t,this.wa=e,this.wp=c,this}tr(t){return this.M=t||null,this}_v(t,e,c,s,m,p){this.n>=this.cap&&this._grow();const v=this.n++,a=v*3,o=v*4;this.P[a]=t.x,this.P[a+1]=t.y,this.P[a+2]=t.z,this.N[a]=ot.x,this.N[a+1]=ot.y,this.N[a+2]=ot.z,this.C[a]=this.c.r,this.C[a+1]=this.c.g,this.C[a+2]=this.c.b,this.C2[a]=this.c2.r,this.C2[a+1]=this.c2.g,this.C2[a+2]=this.c2.b,this.E[o]=e,this.E[o+1]=c,this.E[o+2]=s,this.E[o+3]=m,this.T[o]=this.pid,this.T[o+1]=this.seed,this.T[o+2]=this.sc,this.T[o+3]=this.fl,this.V[o]=this.wf,this.V[o+1]=this.wa,this.V[o+2]=this.wp,this.V[o+3]=p}quadE(t,e,c,s,m,p,v,a,o,u,d){zt.set(t[0],t[1],t[2]),St.set(e[0],e[1],e[2]),Pt.set(c[0],c[1],c[2]),Rt.set(s[0],s[1],s[2]),this.M&&(zt.applyMatrix4(this.M),St.applyMatrix4(this.M),Pt.applyMatrix4(this.M),Rt.applyMatrix4(this.M)),ot.subVectors(St,zt),Kt.subVectors(Rt,zt),ot.cross(Kt),ot.lengthSq()<1e-12&&(ot.subVectors(Pt,St),Kt.subVectors(Rt,St),ot.cross(Kt)),ot.lengthSq()<1e-12?ot.set(0,1,0):ot.normalize();const z=d||(this.wa!==0?[1,1,1,1]:[0,0,0,0]);return this._v(zt,m[0],m[1],o,u,z[0]),this._v(St,p[0],p[1],o,u,z[1]),this._v(Pt,v[0],v[1],o,u,z[2]),this._v(zt,m[0],m[1],o,u,z[0]),this._v(Pt,v[0],v[1],o,u,z[2]),this._v(Rt,a[0],a[1],o,u,z[3]),this}quad(t,e,c,s,m){const p=Math.hypot(e[0]-t[0],e[1]-t[1],e[2]-t[2]),v=Math.hypot(s[0]-t[0],s[1]-t[1],s[2]-t[2]);return this.quadE(t,e,c,s,[0,0],[p,0],[p,v],[0,v],p,v,m)}rect(t,e,c,s,m,p){return this.quadE(t,[t[0]+e[0]*s,t[1]+e[1]*s,t[2]+e[2]*s],[t[0]+e[0]*s+c[0]*m,t[1]+e[1]*s+c[1]*m,t[2]+e[2]*s+c[2]*m],[t[0]+c[0]*m,t[1]+c[1]*m,t[2]+c[2]*m],[0,0],[s,0],[s,m],[0,m],s,m,p)}box(t,e,c,s,m,p,v=""){const a=s/2,o=m/2,u=p/2,d=(z,w,x,E)=>this.quad([t+z[0],e+z[1],c+z[2]],[t+w[0],e+w[1],c+w[2]],[t+x[0],e+x[1],c+x[2]],[t+E[0],e+E[1],c+E[2]]);return v.includes("E")||d([a,-o,u],[a,-o,-u],[a,o,-u],[a,o,u]),v.includes("W")||d([-a,-o,-u],[-a,-o,u],[-a,o,u],[-a,o,-u]),v.includes("S")||d([-a,-o,u],[a,-o,u],[a,o,u],[-a,o,u]),v.includes("N")||d([a,-o,-u],[-a,-o,-u],[-a,o,-u],[a,o,-u]),v.includes("T")||d([-a,o,u],[a,o,u],[a,o,-u],[-a,o,-u]),v.includes("B")||d([-a,-o,-u],[a,-o,-u],[a,-o,u],[-a,-o,u]),this}strip(t,e,c,s){let m=0,p=0;const v=[0];for(let a=1;a<t.length;a++)m+=Math.hypot(t[a][0]-t[a-1][0],t[a][1]-t[a-1][1],t[a][2]-t[a-1][2]),v.push(m);for(let a=0;a<t.length;a++)p+=Math.hypot(e[a][0]-t[a][0],e[a][1]-t[a][1],e[a][2]-t[a][2])/t.length;for(let a=0;a<t.length-1;a++){const o=c?[c[a],c[a+1],s[a+1],s[a]]:void 0;this.quadE(t[a],t[a+1],e[a+1],e[a],[v[a],0],[v[a+1],0],[v[a+1],p],[v[a],p],m,p,o)}return this}get triangles(){return this.n/3}build(){const t=new h.BufferGeometry,e=this.n;return t.setAttribute("position",new h.BufferAttribute(this.P.slice(0,e*3),3)),t.setAttribute("normal",new h.BufferAttribute(this.N.slice(0,e*3),3)),t.setAttribute("aCol",new h.BufferAttribute(this.C.slice(0,e*3),3)),t.setAttribute("aCol2",new h.BufferAttribute(this.C2.slice(0,e*3),3)),t.setAttribute("e",new h.BufferAttribute(this.E.slice(0,e*4),4)),t.setAttribute("pt",new h.BufferAttribute(this.T.slice(0,e*4),4)),t.setAttribute("mv",new h.BufferAttribute(this.V.slice(0,e*4),4)),t.computeBoundingSphere(),t.computeBoundingBox(),t}}const Zt={L:20,beam:1.15};function ie(f){const t=Math.abs(2*f-1);return{b:Zt.beam*Math.pow(Math.max(0,Math.sin(Math.PI*Math.min(1,Math.max(0,f)))),.62),g:1.15+1.75*Math.pow(t,2.6)+.55*Mt(.68,1,f),k:1.25*Math.pow(t,3.6)}}function He(f,t=18){const e=new rt(1400),c=Zt.L,s=1.5,m=[];for(let a=0;a<=t;a++){const o=a/t,u=ie(o);m.push({z:(o-.5)*c,u:o*c,...u})}e.pat(0,1,R.NOBORDER);for(let a=0;a<t;a++){const o=m[a],u=m[a+1];for(const d of[1,-1]){const z=[0,o.k,o.z],w=[0,u.k,u.z],x=[d*o.b*.74,o.k+.42*(o.g-o.k),o.z],E=[d*u.b*.74,u.k+.42*(u.g-u.k),u.z],M=[d*o.b,o.g,o.z],S=[d*u.b,u.g,u.z];e.quadE(z,w,E,x,[o.u,0],[u.u,0],[u.u,.45*s],[o.u,.45*s],c,s),e.quadE(x,E,S,M,[o.u,.45*s],[u.u,.45*s],[u.u,s],[o.u,s],c,s)}a>0&&a<t-1&&(e.pat(F.DECK,1.7,R.NOBORDER|R.NOBRONZE).col(f.deck,f.deck2),e.quadE([-o.b*.9,o.g-.42,o.z],[-u.b*.9,u.g-.42,u.z],[u.b*.9,u.g-.42,u.z],[o.b*.9,o.g-.42,o.z],[o.u,0],[u.u,0],[u.u,2],[o.u,2],c,2),e.pat(0,1,R.NOBORDER))}const p=m[t],v=m[0];return e.pat(31,.5,0),e.quad([0,p.k+.9,p.z-.25],[0,p.g+1.5,p.z+2.7],[0,p.g+1.85,p.z+2.55],[0,p.g+.05,p.z-.25]),e.quad([0,v.k+1,v.z+.25],[0,v.g+.75,v.z-1.5],[0,v.g+1.05,v.z-1.35],[0,v.g+.05,v.z+.25]),e.build()}function Ke(f){const t=new rt(200);t.col(f.bamboo,f.bamboo).pat(F.PLANKS,.45,R.KEEP|R.NOBRONZE|R.NOBORDER).box(0,1.65,0,.07,3.3,.07,"B"),t.pat(0,1,0).wave(7.5,.275,0);const e=1.5,c=.95,s=2.3,m=6;for(let p=0;p<m;p++)for(let v=0;v<2;v++){const a=p/m*e,o=(p+1)/m*e,u=v/2*c,d=(v+1)/2*c;t.quadE([a+.04,s+u,0],[o+.04,s+u,0],[o+.04,s+d,0],[a+.04,s+d,0],[a,u],[o,u],[o,d],[a,d],e,c,[a/e,o/e,o/e,a/e])}return t.build()}function Ze(f,t,e=lt){const c=new rt(700),s=Zt.L,m=z=>ie(z/s+.5),p=z=>m(z).g-.42,v=f[0],a=f[6],o=e("#D8B25A"),u=e("#7B4A22");for(const z of[1,-1]){const w=[],x=[];for(let S=0;S<=6;S++){const B=-6.2+S*1.5,I=m(B),C=z*(I.b+.09);w.push([C,I.g+.03,B]),x.push([C,I.g+.2,B])}c.col(z>0?f[4]:a,f[3]).pat(F.STRIPE_U,.9,R.NOBRONZE,.2).strip(w,x);const E=m(-7.2),M=z*(E.b+.09);c.col(f[z>0?1:3],a).pat(F.PLAIN,1,0,.1).quad([M,E.g-.12,-7.5],[M,E.g-.12,-6.2],[M,E.g+.34,-6.2],[M,E.g+.34,-7.5])}for(const[z,w,x,E,M]of[[-4.4,-.3,.8,f[2],F.PLANKS],[-3.3,.36,.65,f[3],F.PLANKS],[-3.4,-.42,.5,f[4],F.CHECK],[2.2,.3,.75,e("#B9793A"),F.PLANKS],[3.3,-.3,.6,f[5],F.PLANKS]])c.col(E,u).pat(M,.2,0,.3).box(w,p(z)+x*.4,z,x*1.2,x*.8,x,"B");for(const[z,w,x]of[[-1.9,.5,f[3]],[-2.1,-.45,f[4]],[.9,.5,a],[1,-.4,f[3]],[4.6,.2,f[4]],[6.6,.25,f[3]],[6.9,-.2,a]])c.col(x,v).pat(F.DISC,0,0,.9).box(w,p(z)+.2,z,.4,.4,.4,"B");{const w=p(5.6),x=.8,E=Math.PI*2;for(let M=0;M<6;M++){const S=M/6*E,B=(M+1)/6*E;c.col(M%2?f[1]:e("#2F6FD0"),f[2]).pat(F.HATCH,.26,R.NOBRONZE,.4).quad([Math.cos(S)*x,w,5.6+Math.sin(S)*x],[Math.cos(B)*x,w,5.6+Math.sin(B)*x],[Math.cos(B)*x*.2,w+.75,5.6+Math.sin(B)*x*.2],[Math.cos(S)*x*.2,w+.75,5.6+Math.sin(S)*x*.2])}}const d=p(-.6);return c.col(o,o).pat(F.PLANKS,.45,R.NOBRONZE|R.NOBORDER).box(0,d+1.5,-.6,.08,3,.08,"B"),t||(c.col(f[4],f[4]).pat(F.PLAIN,1,R.NOBRONZE,.2).box(0,d+3.3,-.6,.5,.6,.5),c.col(f[3],f[3]).pat(F.PLAIN,1,R.NOBRONZE).box(0,d+3.66,-.6,.3,.12,.3).box(0,d+2.94,-.6,.3,.12,.3)),c.wave(),c.build()}function je(f){const t=new rt(200),e=Zt.L;for(let c=0;c<8;c++){const s=-6.6+c*1.75,m=ie(s/e+.5),p=c%2?.34:-.34,v=m.g-.42,a=1.25;t.col(f[1+c*2%5],f[0]).pat(F.DROP,1,R.NOBRONZE|R.NOBORDER,0).wave(-.6,-.05,c*1.3),t.quad([p-.3,v,s-.3],[p+.3,v,s+.3],[p+.3,v+a,s+.3],[p-.3,v+a,s-.3]).quad([p+.3,v,s-.3],[p-.3,v,s+.3],[p-.3,v+a,s+.3],[p+.3,v+a,s-.3])}return t.wave(),t.build()}function Ye(f){const t=new rt(12);return t.col(f[6],f[6]).pat(F.CLOUD,.1,R.NOBRONZE|R.NOBORDER,.3).wave(1.4,.05,0).quad([-1.1,0,.36],[1.1,0,.36],[1.1,0,-.64],[-1.1,0,-.64]),t.build()}function Qe(f,t=0,e=f[3],c=f[6]){const s=new rt(420),m=f[0],p=R.NOBRONZE,v=1.6,a=12.2,o=[.77,0,-.64],u=[.64,0,.77],d=(w,x,E)=>[o[0]*w+u[0]*E,x,v+o[2]*w+u[2]*E];if(s.wave().col(m,m).pat(F.PLAIN,1,R.NOBORDER|p).box(0,a/2+.3,v,.2,a-.6,.2,"TB"),t!==1){const w=[3.7,5.6,7.5,9.4,11.2],x=t?[2.5,2.75,2.6,2.2,1.7]:[2.9,2.6,2.25,1.85,1.4],E=[-1,-.5,0,.5,1],M=t?-.3:.35,S=g=>E.map(k=>d(k*x[g],w[g]+M*k*(g/4),.85*(1-k*k)*Math.pow(1-g/4,.7))),B=g=>E.map(k=>(1-k*k)*(1-g/4)),I=t?[[F.STRIPE_U,1.2],[F.PLAIN,1],[F.CHEVRON,.95],[F.STRIPE_U,.8]]:[[F.CHECK,.95],[F.STRIPE_U,1.3],[F.DIAMOND,1.9],[F.STRIPE_V,1.8]];for(let g=0;g<4;g++)s.col(g%2?c:e,g%2?e:c).pat(I[g][0],I[g][1],p,.2+g*.2).wave(1.1,.3,g*.5).strip(S(g),S(g+1),B(g),B(g+1));const C=x[4]+.45,Y=w[4]-M*(C/x[4])+.06,V=w[4]+M*(C/x[4])+.06;s.wave().col(m,m).pat(F.PLAIN,1,R.NOBORDER|p).quad(d(-C,Y-.1,.05),d(C,V-.1,.05),d(C,V+.1,.05),d(-C,Y+.1,.05))}else{const w=[-3.4,4.3],x=[2.4,13.4],E=[3.3,3.7],M=[.05,.3,.55,.78,1],S=(O,U,st)=>[O[0]+(U[0]-O[0])*st,O[1]+(U[1]-O[1])*st],B=[],I=[],C=[],Y=[],V=[],g=[];for(const O of M){const U=S(w,E,O),st=S(w,x,O),ct=Math.sin(Math.PI*Math.min(1,O*1.15))*O;B.push(d(U[0],U[1],1.4*ct)),I.push(d((U[0]+st[0])/2,(U[1]+st[1])/2,1.8*ct)),C.push(d(st[0],st[1],0)),Y.push(.7*ct),V.push(ct),g.push(0)}s.col(e,c).pat(F.STRIPE_U,1.5,p,.3).wave(1.1,.3,.4).strip(B,I,Y,V),s.col(c,e).pat(F.STRIPE_V,1.5,p,.5).wave(1.1,.3,.4).strip(I,C,V,g);const k=S(w,x,-.07),J=S(w,x,1.06);s.wave().col(m,m).pat(F.PLAIN,1,R.NOBORDER|p).quad(d(k[0]+.09,k[1]-.06,.05),d(J[0]+.09,J[1]-.06,.05),d(J[0]-.09,J[1]+.06,.05),d(k[0]-.09,k[1]+.06,.05))}const z=(w,x,E,M)=>{for(let S=0;S<E;S++){const B=S/E,I=(S+1)/E,C=g=>-.9*4*g*(1-g),Y=[0,w[1]+(x[1]-w[1])*B+C(B),w[2]+(x[2]-w[2])*B],V=[0,w[1]+(x[1]-w[1])*I+C(I),w[2]+(x[2]-w[2])*I];s.col(f[[3,4,1,6,2,5][(S+M)%6]],f[6]).pat(F.TRI,1,p,0).wave(6,.08,S*1.7).quad([.4,Y[1]-.85,Y[2]+.15],[.4,V[1]-.85,V[2]+.15],V,Y,[1,1,0,0])}};return z([0,5.2,12.5],[0,a-.1,v],11,0),z([0,a-.1,v],[0,3.9,-11.3],13,3),s.wave(),s.build()}const $e=`
${ne}
attribute vec4 aS; uniform vec2 uAnchor; uniform float uMode; uniform vec3 uCam;
varying vec2 vUv; varying float vK;
void main(){
  vec3 p; float sz; float ang = 0.; vK = aS.z;
  float d, a;
  if (uMode < .5) {
    float x = uAnchor.x + (aS.x - .5)*2.*uAnchor.y;
    float base = uC*uTau + 3.*sin(x*.021 + 1.3) + 1.5*sin(x*.057);
    float z = (floor(base/uL) + 1. + floor(aS.y*3.999))*uL - base;
    wave(vec2(x, z), d, a);
    float t = fract(uTime*.85 + aS.z*7.);
    p = vec3(x + (aS.z - .5)*1.6*t, a*.9 + a*(.5 + aS.w)*2.2*t*(1. - t) + .15, z - .5 - t*(1.6 + 2.2*aS.w));
    sz = (.65 + .85*aS.w) * smoothstep(.5, 1.1, a) * (1. - t*.55) * smoothstep(0., .12, t);
    ang = aS.z*6.28 + t*2.;
    vec4 mvp = viewMatrix * vec4(p, 1.);
    float c = cos(ang), s = sin(ang);
    mvp.xy += vec2(c*position.x - s*position.y, s*position.x + c*position.y) * sz;
    gl_Position = projectionMatrix * mvp;
  } else if (uMode > 1.5) {
    float x = uCam.x + mod(aS.x*170. + uTime*15.*(.6 + aS.w) - uCam.x, 170.) - 85.;
    float z = -60. + aS.y*62.; float y = max(-z/60., 0.) + .12 + aS.z*aS.z*1.3 + .1*sin(uTime*3. + aS.z*40.);
    vec4 mvp = viewMatrix * vec4(x, y, z + (x - uCam.x)*.5, 1.);
    vec4 mv2 = viewMatrix * vec4(x + 1., y, z + (x + 1. - uCam.x)*.5, 1.);
    vec2 dir = normalize(mv2.xy - mvp.xy + vec2(1e-5, 0.));
    // long thin strokes that hold about 1.5 px far off; none right at the lens
    mvp.xy += (dir*position.x*(2.2 + 2.8*aS.w) + vec2(-dir.y, dir.x)*position.y*max(.055, -mvp.z*.0042)) * smoothstep(2.5, 7., -mvp.z);
    gl_Position = projectionMatrix * mvp;
  } else {
    float zr = aS.y*70.; float z = zr + 70.*floor((uCam.z - zr)/70. + 1.);
    float x = uCam.x + (aS.x - .5)*64.;
    float t = fract(uTime*(.7 + .5*aS.w) + aS.z*9.); float dir = aS.z > .5 ? 1. : -1.;
    float hgt = 1.1 + 1.6*aS.w;
    float h = wave(vec2(x, z), d, a);
    p = vec3(x + dir*(t - .5)*4.5, h + hgt*4.*t*(1. - t) - .1, z);
    ang = atan(hgt*4.*(1. - 2.*t), 4.5) * dir;
    sz = (.55 + .5*aS.w) * smoothstep(96., 108., z) * (1. - smoothstep(196., 208., z));
    float c = cos(ang), s = sin(ang);
    p.xy += vec2(c*position.x*dir - s*position.y, s*position.x*dir + c*position.y) * sz;
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
  }
  vUv = position.xy;
}`,Xe=`
uniform float uMode; uniform vec3 uFoam, uInkCol, uBronze, uTint; varying vec2 vUv; varying float vK;
void main(){
  vec2 m = vUv * 2.; float px = max(fwidth(m.x), 1e-4);
  vec3 col;
  if (uMode > 1.5) { col = uFoam; if (abs(m.x) > .9 - abs(m.y)*.9) discard; }
  else if (uMode < .5) {
    float r = length(m - vec2(0., -.55)), ang = atan(m.x, m.y + .55 + 1e-5);
    float th = .26 * (1. - clamp((ang + .9)/1.8, 0., 1.)*.8);
    float dd = abs(ang) < .9 ? abs(r - .75) - th : 1.;
    if (dd > 0.) discard;
    col = mix(uInkCol, uFoam, step(dd, -.07 - px*.5));
  } else {
    float dd = max(length(m - vec2(.55, 0.)), length(m + vec2(.55, 0.))*1. ) ; dd = max(length(m*vec2(1., 2.6)) - .8, -1.);
    float tail = max(abs(m.y) - (-m.x - .55)*.9, -m.x - .98); 
    dd = min(dd, m.x < -.55 ? tail : 1.);
    if (dd > 0.) discard;
    col = dd > -.09 - px ? uInkCol : (m.y > .02 ? uBronze*1.15 : uFoam);
  }
  gl_FragColor = vec4(col * uTint, 1.);
}`;function ke(f,t,e,c){const s=new h.InstancedBufferGeometry;s.setAttribute("position",new h.BufferAttribute(new Float32Array([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,-.5,0,.5,.5,0,-.5,.5,0]),3));const m=new Float32Array(t*4);for(let a=0;a<t*4;a++)m[a]=c();s.setAttribute("aS",new h.InstancedBufferAttribute(m,4)),s.instanceCount=t;const p={...f,uMode:{value:e},uAnchor:{value:new h.Vector2(-100,110)},uCam:{value:new h.Vector3}},v=new h.Mesh(s,new h.ShaderMaterial({uniforms:p,vertexShader:$e,fragmentShader:Xe,side:h.DoubleSide}));return v.frustumCulled=!1,v}async function Je(f,t={}){const e=f.rng.fork?f.rng.fork("fleet"):f.rng,c=f.quality?.detail??1,s=t.mats||We(t),m=s.uniforms,p=t.look||{},v=l=>lt(l,1,t.mul||null),a={deck:v(t.rare?"#E9EEF2":"#D9A441"),deck2:v(t.rare?"#AEB9C6":"#8A4B1E"),bamboo:v("#D8B25A")},o=new h.Group;o.name="painted-fleet";const u=t.portalAt||[-100,215],d=t.meet||{x:-100,D:48,u1:.78,z1:55},z=l=>l<-60?1:-l/60;p.dom&&m.uDom.value.set(p.dom[0],p.dom[1]);{const l=[],i=[];for(let b=-1500;b<-330;b+=45)l.push(b);for(let b=-330;b<=130;b+=5)l.push(b);for(let b=175;b<=1400;b+=45)l.push(b);for(let b=-12;b<196;b+=1.6)i.push(b);for(let b=196,D=4;b<2400;b+=D,D*=1.5)i.push(b);const y=l.length,A=i.length,L=new Float32Array(y*A*3),G=[];for(let b=0;b<A;b++)for(let D=0;D<y;D++){const K=(b*y+D)*3;L[K]=l[D],L[K+1]=0,L[K+2]=i[b]}for(let b=0;b<A-1;b++)for(let D=0;D<y-1;D++){const K=b*y+D;G.push(K,K+y,K+1,K+1,K+y,K+y+1)}const T=new h.BufferGeometry;T.setAttribute("position",new h.BufferAttribute(L,3)),T.setIndex(G);const P=new h.Mesh(T,s.sea);P.frustumCulled=!1,P.name="sea",o.add(P)}await f.yield?.();const w=He(a),x=Ke(a);await f.yield?.();const E=s.mat({hull:!0}),M=s.mat({flag:!0}),S=[];for(let l=-900;l<=300;l+=4)Math.abs((l%100+150)%100-50)<8.5||S.push(l);const B=new h.InstancedMesh(w,E,S.length),I=new h.InstancedMesh(x,M,S.length*2),C=new h.Matrix4,Y=new h.Quaternion,V=new h.Euler,g=new h.Vector3,k=new h.Vector3,J=new h.Color,O=new h.Matrix4,U=new h.Quaternion,st=m.uWind.value,ct=Math.atan2(-st.z,st.x);let jt=0;const Yt=[],kt=l=>Math.min(4095,Math.floor(l*4096))/4095,le=new Set,re=l=>{let i=Math.min(4095,Math.floor(l*4096));for(;le.has(i);)i=(i+611)%4096;return le.add(i),i/4095},Ct=(l,i,y,A,L,G,T,P)=>{k.set(A,L,G).applyMatrix4(y),U.setFromAxisAngle(Se,ct),g.set(T,T,T),O.compose(k,U,g),l.setMatrixAt(i,O),P!==void 0&&l.setColorAt(i,J.setRGB(kt(P),0,0))};S.forEach((l,i)=>{const y=e.range(.9,1.1),A=-22-12.6*y+e.range(-1.2,.6);V.set(-.017+e.range(-.01,.01),Math.PI*0+e.range(-.035,.035),e.range(-.13,.13)),k.set(l+e.range(-.5,.5),z(A)-.12,A),g.set(1,1,y),i%3===1&&l>-340&&l<60&&Yt.push({i,x:k.x,y:k.y,z:k.z,ex:V.x,ey:V.y,ez:V.z,sc:y}),C.compose(k,Y.setFromEuler(V),g),B.setMatrixAt(i,C);const L=e();B.setColorAt(i,J.setRGB(re(L),0,0)),Ct(I,jt++,C,0,2.55,-8.9,e.range(1.2,1.7),e()),e()<.66&&Ct(I,jt++,C,0,3.3,9.6,e.range(1,1.4),e())}),await f.yield?.(),I.count=jt,B.instanceMatrix.needsUpdate=!0,I.instanceMatrix.needsUpdate=!0,B.computeBoundingSphere(),I.computeBoundingSphere(),B.name="fleet",I.name="fleet-flags",o.add(B,I),await f.yield?.(),await f.yield?.();const It=t.moored||[],Et=t.anchored||[],ft=18,tt=5,Qt=ft+4+It.length+2+(tt-1)+1+Et.length,vt=new h.InstancedMesh(w,E,Qt),nt=new h.InstancedMesh(x,M,Qt*2);vt.frustumCulled=!1,nt.frustumCulled=!1,vt.name="boats",nt.name="boat-flags";for(let l=0;l<Qt;l++)vt.setColorAt(l,J.setRGB(re(e()),0,0)),nt.setColorAt(l*2,J.setRGB(kt(e()),0,0)),nt.setColorAt(l*2+1,J.setRGB(kt(e()),0,0));o.add(vt,nt);const j=gt.L,mt=gt.C,Ot=l=>3*Math.sin(l*.021+1.3)+1.5*Math.sin(l*.057),Ce=-(d.z1+Ot(d.x))/mt-d.u1*d.D,$t=j/mt,Dt=l=>Ce+l*d.D,ce=[d.x+15,d.x-16,d.x+24,d.x+19,d.x-22,d.x-62,d.x+58,d.x+128,d.x-38,d.x+42,d.x-46,d.x+48,d.x-120,d.x+84,d.x-12,d.x+28,d.x-32,d.x+37],xt=ce.length,fe=[55,98,98,141,141],de=(j-43)/(mt*d.D),Ee=ce.map((l,i)=>{let y=e.int(0,3);if(i<5){const L=Dt(d.u1+de*(i===0?0:i<3?1:2));let G=1e9;for(let T=0;T<4;T++){const P=4*j-((mt*L+Ot(l)+T*j)%(4*j)+4*j)%(4*j);Math.abs(P-fe[i])<G&&(G=Math.abs(P-fe[i]),y=T)}}if(i>=14){const L=i<16?.5:1.5,G=Dt(d.u1+de*L),T=55+43*L;let P=1e9;for(let b=0;b<4;b++){const D=4*j-((mt*G+Ot(l)+(b+.5)*j)%(4*j)+4*j)%(4*j);Math.abs(D-T)<P&&(P=Math.abs(D-T),y=b)}}const A=e.range(.92,1.08);return{x:l,j:y,fo:i>=14?.5:0,sc:i<5?1.3:A}}),Ae=[{x:d.x-7,keyed:!0},{x:100.5,ph:.1},{x:-200.5,ph:.45},{x:-299.5,ph:.8}],Q={tau:0,time:0,init:!1},Vt=new Float32Array(ft*3),Fe=d.zOf||(l=>-284+l*500),he=[{x:d.x-7,lead:19,sc:1.25,wait:0,cap:154,ph:.3},{x:d.x+9,lead:31,sc:1.15,wait:33,cap:162,ph:1.9,sail:0},{x:d.x-27,lead:56,sc:1,wait:63,cap:185,ph:3.4,sail:2},{x:d.x+32,lead:79,sc:1,wait:86,cap:190,ph:4.6,sail:1},{x:d.x-52,lead:105,sc:1.05,wait:110,cap:179,ph:5.5,sail:0}],At=new Float32Array(tt*4),Ft=t.cross||null,ue=(l,i,y)=>.5*(l+i+Math.sqrt((l-i)*(l-i)+y*y)),pe=(l,i,y)=>.5*(l+i-Math.sqrt((l-i)*(l-i)+y*y)),_t=l=>Math.min(1,Math.max(0,l));await f.yield?.();const Bt=s.mat(),Tt=new h.InstancedMesh(Ze(s.P,!!p.night,v),Bt,tt);Tt.frustumCulled=!1,Tt.name="convoy-gear";const Nt=new h.InstancedMesh(je(s.P),Bt,ft+3);Nt.frustumCulled=!1,Nt.name="boat-specks";const Be=tt*3+3,qt=new h.InstancedMesh(Ye(s.P),Bt,Be);qt.frustumCulled=!1,qt.name="wakes",o.add(Tt,Nt,qt),await f.yield?.();const ve=[0,0,0],Xt=[];for(const l of he)l.sail!==void 0&&Xt.push(l);for(const l of Et)l.sail!==void 0&&Xt.push(l);for(const l of Xt)l.si=ve[l.sail]++;const Te=p.dom?p.dom[0]:3,me=p.dom?p.dom[1]:4,dt=s.P,xe=[[dt[Te],dt[6]],[dt[me===6?4:me],dt[6]],[dt[5],dt[1]]],Jt=ve.map((l,i)=>{const y=new h.InstancedMesh(Qe(dt,i,xe[i][0],xe[i][1]),Bt,Math.max(1,l));return y.frustumCulled=!1,y.name="sails-"+i,y.count=l,o.add(y),y});await f.yield?.();const we=s.camPos,te=(l,i,y,A,L)=>{const G=at(i,y)+.13,T=y>0?Math.atan2(at(i,y+1)-at(i,y-1),2):0;V.set(A?T:-T,A,0,"YXZ"),k.set(i,G,y),L=Math.max(.001,L),g.set(L,L,L),O.compose(k,U.setFromEuler(V),g),qt.setMatrixAt(l,O)},ye=(l,i,y)=>{const A=Math.max(.001,Mt(42,54,Math.hypot(i-we.x,y-we.z)));O.copy(C).scale(g.set(A,A,A)),Nt.setMatrixAt(l,O)},at=(l,i)=>Ve(l,i,Q.tau,Q.time),wt=(l,i)=>Math.max(z(i)+.12,at(l,i)-.42);function it(l,i,y,A,L,G,T,P,b=!0){V.set(G,L,T,"YXZ"),k.set(i,y,A),g.set(P,P,P),C.compose(k,Y.setFromEuler(V),g),vt.setMatrixAt(l,C);const D=b?P*1.1:0;Ct(nt,l*2,C,0,2.55,-8.9,D),Ct(nt,l*2+1,C,0,3.3,9.6,D*.85)}await f.yield?.();const Gt=u[0],Ut=u[1]-1.5,Wt=new h.Group;{const l=new rt(300),i=s.P[3],y=s.P[6],A=s.P[4];for(const G of[1,-1]){l.col(G>0?i:A,y).pat(F.STRIPE_U,1.3,0);const T=G*6.4,P=9.3,b=-G*3.4,D=14.6,K=-(D-P),r=b-T,n=Math.hypot(K,r),q=.34,N=K/n*q,H=r/n*q,W=G*.25;l.quad([T-N,P-H,W],[b-N*.4,D-H*.4,W],[b+N*.4,D+H*.4,W],[T+N,P+H,W])}const L=new h.Mesh(l.build(),s.mat());L.frustumCulled=!1,Wt.add(L),Wt.position.set(Gt,0,Ut),o.add(Wt)}const yt=new h.InstancedMesh(x,M,2);yt.frustumCulled=!1,o.add(yt),yt.setColorAt(0,J.setRGB(kt(e()),0,0)),yt.setColorAt(1,J.setRGB(kt(e()),0,0));let et=null;if(p.night){const l=new rt(60),i=lt("#FFD23F");l.col(i,lt("#FF9A3A")).pat(F.DISC,0,R.GLOW|R.NOBRONZE,.9).quad([-.38,0,0],[.38,0,0],[.38,.76,0],[-.38,.76,0]).quad([0,0,-.38],[0,0,.38],[0,.76,.38],[0,.76,-.38]),l.col(i,i).pat(F.DISC,0,R.GLOW|R.NOBRONZE|R.NOBORDER,0).quad([-.3,-3.25,-3.6],[.3,-3.25,-3.6],[.3,-3.25,-6.4],[-.3,-3.25,-6.4]),et=new h.InstancedMesh(l.build(),Bt,ft+tt+Et.length),et.frustumCulled=!1,et.name="boat-lamps",o.add(et)}await f.yield?.();const ee=ke(m,Math.round(640*c),0,e);ee.name="spray",o.add(ee),ee.material.uniforms.uAnchor.value.set(d.x,105);let Lt=null;t.rare&&(Lt=ke(m,Math.round(1500*c),1,e),Lt.name="sardinella",o.add(Lt));const $=(l,i,y)=>Mt(l,i,y);function Ne(l,i,y,A=0){Q.time=i;const L=Dt(A);if(!Q.init||Math.abs(A-Q.u)>.02)Q.tau=L,Q.init=!0;else{let r=L-Q.tau;r-=$t*Math.round(r/$t),Q.tau+=l*(1+Math.min(.6,Math.max(-.6,r*.6)))}Q.u=A,m.uTau.value=Q.tau;const G=Q.tau,T=4*j;for(let r=0;r<xt;r++){const n=Ee[r],q=T-((mt*G+Ot(n.x)+(n.j+n.fo)*j)%T+T)%T,N=q-2.2,H=at(n.x,N-7),W=at(n.x,N+7),_=at(n.x,N),Z=n.sc*$(T,T-40,q)*$(2,20,q);Vt[r*3]=n.x,Vt[r*3+1]=_,Vt[r*3+2]=N,et&&(k.set(n.x,_+3.3*Z,N),U.identity(),g.set(Z,Z,Z),O.compose(k,U,g),et.setMatrixAt(r,O)),it(r,n.x+.6*Math.sin(i*.7+r),(H+W+2*_)/4-.4,N,Math.PI+.05*Math.sin(i*.5+r*2),Math.atan2(W-H,14)*.9+.03,.06*Math.sin(i*1.3+r*1.7),Z),ye(r,n.x,N)}for(let r=1;r<4;r++){const n=Ae[r];let q,N=1;{const _=(i/30+n.ph)%1;q=-32+$(0,.85,_)*52,N=$(0,.05,_)*(1-$(.92,1,_))}const H=wt(n.x,q+7),W=wt(n.x,q-7);it(xt+r,n.x,(H+W+2*wt(n.x,q))/4,q,0,Math.atan2(W-H,14),q<2?.04*Math.sin(i*5+r):.06*Math.sin(i*1.2+r),N)}for(let r=0;r<It.length;r++){const n=It[r],q=n.still?0:1,N=n.ux?n.x+n.ux*A:n.vx?((n.x+n.vx*i+520)%1040+1040)%1040-520:n.x,H=n.vx&&!n.ux?$(520,480,Math.abs(N)):1;it(xt+4+r,N,(n.y??-.38)+.05*q*Math.sin(i*1.3+r*1.9),n.z,n.yaw,.012*q*Math.sin(i*.9+r),n.still?n.roll??.2:.075*Math.sin(i*1.1+r*2.1),(n.sc??.8)*H)}const P=.2*Math.sin(i*.8),b=xt+4+It.length;it(b,Gt+31.2,-.8+P,Ut,-Math.PI/2,0,.02*Math.sin(i*.7),2),it(b+1,Gt-31.2,-.8+P,Ut,Math.PI/2,0,.02*Math.sin(i*.7+1),2),Wt.position.y=P;const D=Fe(A),K=i*.55;for(let r=0;r<tt;r++){const n=he[r],q=$(.69,.72,A),N=Math.cos((A-.7)*34.9),H=r===0?(2-7*N)*q:r===1?(11*N-6)*q:0,W=D+n.lead+H;let _,Z;if(r===0){const ut=-31+$(d.uLa??.5,d.uLb??.72,A)*60,pt=W-40*(1-$(.6,.72,A));Z=_t((pt-ut)/8)*_t((n.cap-W)/10),_=pe(ue(ut,pt+2.2*Math.sin(i*.33+n.ph)*Z,5),n.cap,8)}else Z=_t((W-n.wait)/8)*_t((n.cap-W)/10),_=pe(ue(n.wait,W+3*Math.sin(i*.3+n.ph)*Z,6),n.cap,8);const ae=7*n.sc,ht=n.x+.45*Z*Math.sin(i*.23+n.ph*2),be=wt(ht,_+ae),ge=wt(ht,_-ae),oe=wt(ht,_);it(r===0?xt:b+1+r,ht,(be+ge+2*oe)/4,_,0,Math.atan2(ge-be,2*ae),_<2?.04*Math.sin(i*5+r):.06*Math.sin(i*1.2+r*1.9),n.sc),Tt.setMatrixAt(r,C),n.sail!==void 0&&Jt[n.sail].setMatrixAt(n.si,C),r===0&&Ct(nt,xt*2,C,0,2.3,2.6,n.sc*1.05),r>=2&&ye(ft+r-2,ht,_),et&&(k.set(0,3.7,-.6).applyMatrix4(C),k.y=oe+.42+3.3*n.sc,U.identity(),g.set(n.sc,n.sc,n.sc),O.compose(k,U,g),et.setMatrixAt(ft+r,O)),At[r*4]=ht,At[r*4+1]=oe,At[r*4+2]=_,At[r*4+3]=Z;for(let ut=0;ut<3;ut++){const pt=(ut+(K+r*.37)%1)/3*12;te(r*3+ut,ht,_-10.3*n.sc-pt,0,(1.1+.17*pt)*n.sc*$(0,1.2,pt)*$(12,9.5,pt)*Z)}}if(Ft){const r=Ft.z-600*(Math.min(A,.16)-.094)-Math.max(0,A-.16)*60,n=Ft.sc??.9;it(b+tt+1,Ft.x,-.38+.05*Math.sin(i*1.3),r,Math.PI,.012*Math.sin(i*.9),.06*Math.sin(i*1.1),n);for(let q=0;q<3;q++){const N=(q+K%1)/3*11;te(tt*3+q,Ft.x,r+10.3*n+N,Math.PI,(1+.16*N)*n*$(0,1.2,N)*$(11,8.5,N))}}else{it(b+tt+1,0,-40,0,0,0,0,.001,!1);for(let r=0;r<3;r++)te(tt*3+r,0,-40,0,0)}for(let r=0;r<Et.length;r++){const n=Et[r],q=7*n.sc,N=Math.sin(n.yaw)*q,H=Math.cos(n.yaw)*q,W=at(n.x+N,n.z+H),_=at(n.x-N,n.z-H),Z=at(n.x,n.z);it(b+tt+2+r,n.x,(W+_+2*Z)/4-.42*n.sc,n.z,n.yaw,Math.atan2(_-W,2*q),.02*Math.sin(i*.8+r*2.1),n.sc),n.sail!==void 0&&Jt[n.sail].setMatrixAt(n.si,C),et&&(k.set(0,0,-3).applyMatrix4(C),k.y=Z+3.3*n.sc,U.identity(),g.set(n.sc,n.sc,n.sc),O.compose(k,U,g),et.setMatrixAt(ft+tt+r,O))}for(let r=0;r<3;r++)Jt[r].instanceMatrix.needsUpdate=!0;for(let r=0;r<Yt.length;r++){const n=Yt[r];V.set(n.ex,n.ey,n.ez+.026*Math.sin(i*.9+n.i*1.7),"XYZ"),k.set(n.x,n.y,n.z),g.set(1,1,n.sc),C.compose(k,Y.setFromEuler(V),g),B.setMatrixAt(n.i,C)}B.instanceMatrix.needsUpdate=!0,Tt.instanceMatrix.needsUpdate=!0,Nt.instanceMatrix.needsUpdate=!0,qt.instanceMatrix.needsUpdate=!0;for(let r=0;r<2;r++)k.set(Gt+(r?3.4:-3.4),14.4+P-2.3*1.5,Ut+(r?-.25:.25)),U.setFromAxisAngle(Se,ct),g.set(1.5,1.5,1.5),O.compose(k,U,g),yt.setMatrixAt(r,O);vt.instanceMatrix.needsUpdate=!0,nt.instanceMatrix.needsUpdate=!0,yt.instanceMatrix.needsUpdate=!0,et&&(et.instanceMatrix.needsUpdate=!0),Lt&&Lt.material.uniforms.uCam.value.setFromMatrixPosition(y.matrixWorld)}return{object:o,radius:320,height:16,center:new h.Vector3(d.x,3,60),ground:!1,mats:s,anchors:{portal:new h.Vector3(u[0],2.6,u[1]),fleetVanish:new h.Vector3(-880,2.2,-23),fleetNear:new h.Vector3(-60,2.5,-23),bowsZ:-22,sternsZ:-47,lanes:[0,-100,-200,100,200],launchX:d.x-7,breakers:[55,98,141]},heightAt:at,sandY:z,keyTau:Dt,state:Q,period:$t,slots:S,retPos:Vt,escPos:At,update:Ne,dispose(){}}}export{Me as BRONZE,R as FLG,Ht as GLSL_COMMON,Zt as HULL,bt as PALETTE,F as PAT,rt as SB,gt as SEA,Je as buildHero,je as crewGeometry,Ze as dressGeometry,lt as enc,Ke as flagGeometry,He as hullGeometry,ie as hullProfile,We as makeSouwerMaterials,Qe as sailGeometry,Ve as seaHeight,ke as spriteMesh,Ye as wakeGeometry};
