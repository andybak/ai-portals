import*as h from"three";import{clamp as _,lerp as $,smoothstep as R}from"../kit/core.js";const Q=["#F3E6C4","#E0A93E","#9C6A2B","#18A7B0","#0B5C74","#E5533D","#3B2A20"],ve={exposure:1,bloom:{strength:.25,radius:.5,threshold:2.6},grade:{saturation:1,contrast:1,vignette:.12,grain:.01}},te=[.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777],oe=[1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602],ae=new h.Matrix3().fromArray(te).invert(),se=new h.Matrix3().fromArray(oe).invert();function ne(n,a=1,e=new h.Color){const f=new h.Color(n),t=new h.Vector3(Math.min(f.r,.95),Math.min(f.g,.95),Math.min(f.b,.95)).applyMatrix3(se),s=o=>{o=_(o,4e-4,.97);const l=.983729*o-1,d=.432951*o-.0245786,y=.238081*o+90537e-9;return(-d-Math.sqrt(Math.max(d*d-4*l*y,0)))/(2*l)};t.set(s(t.x),s(t.y),s(t.z)).applyMatrix3(ae);const p=.6/a;return e.setRGB(Math.max(t.x,0)*p,Math.max(t.y,0)*p,Math.max(t.z,0)*p)}const Z=`
uniform sampler2D uField; uniform vec4 uFieldXf; uniform float uFieldSize; uniform vec2 uSunShift; uniform float uTime;
vec4 waxField(vec3 wp){
  vec2 q = wp.xz + uSunShift*max(wp.y, 0.);
  vec2 f = vec2(uFieldXf.x*q.x - uFieldXf.y*q.y, uFieldXf.y*q.x + uFieldXf.x*q.y) + uFieldXf.zw;
  vec4 t = textureLod(uField, f/uFieldSize + .5, 0.);
  return vec4(t.rgb*100., t.a);
}
float waxSet(vec4 f, float force){ return smoothstep(.25, .75, f.a)*(1. - force); }      // 1 = set (cold), 0 = molten
float waxSunM(vec4 f, float force){ return mix(f.b*(1. - smoothstep(.25, .75, f.a)), 60., force); }   // metres of sun received
float waxSag(float sunM){ float t = clamp(sunM/34., 0., 1.); return t*(1.6 - .6*t); }    // lip sag / slump 0..1: steadily with the metres into sun, whole by 34 m (the lane's width)
`,re=`
uniform vec3 uSun, uCream, uHoney, uAmber, uTurq, uDeep, uCoral, uUmber, uBlue, uVeil, uGlint;
uniform float uBandCreep, uGrooveSp, uGrooveW, uRefl, uBodyBias;
float wxH(vec2 p){ p = fract(p*vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
float wxN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(wxH(i), wxH(i + vec2(1., 0.)), f.x), mix(wxH(i + vec2(0., 1.)), wxH(i + vec2(1., 1.)), f.x), f.y); }
float wxF(vec2 p){ return wxN(p)*.55 + wxN(p*2.13 + 17.)*.3 + wxN(p*4.7 + 41.)*.15; }
// brush ridges: bristle furrows running along s.y (the flow), -1..1
float wxRidge(vec2 s){
  float w = wxN(s*vec2(.8, .09))*2.6 + wxN(s*vec2(.21, .04) + 9.)*6.;
  return sin(s.x*14.96 + w*3.)*.55 + sin(s.x*3.7 + w*1.3 + 2.)*.45;
}
// the sky as wax sees it: six level poured bands, cream and let-down blue, creeping down
vec3 waxSky(vec3 d){
  float el = asin(clamp(d.y, -1., 1.))*3.8197 + uBandCreep;        // one band = 15 degrees
  float b = abs(fract(el*.5) - .5)*2.;                             // 0..1 triangle over two bands
  return mix(uCream, uBlue, smoothstep(.3, .7, b));
}
// five stepped milky veils: the style's only distance rule
vec3 waxVeil(vec3 c, float d){
  float k = smoothstep(144., 156., d)*.13 + smoothstep(288., 312., d)*.13 + smoothstep(480., 520., d)*.13
          + smoothstep(770., 830., d)*.13 + smoothstep(1150., 1250., d)*.13;
  return mix(c, uVeil, k);
}
// stylus grooves filled umber: long strokes along s.y, spaced ~sp metres in s.x, each of uneven length (they overshoot)
float waxGroove(vec2 s, float sp, vec2 fw){
  sp = max(sp, .05);
  float gx = s.x/sp + wxN(s*vec2(.05, .06))*1.4;
  float id = floor(gx), fx = abs(fract(gx) - .5)*sp;
  float len = 9. + 22.*wxH(vec2(id, 3.)), off = 40.*wxH(vec2(id, 7.));
  float seg = fract((s.y + off)/(len*1.6))*1.6;                    // 0..1 drawn, 1..1.6 gap
  float w = (.045 + .03*wxH(vec2(id, 11.)))*uGrooveW;
  float px = max(fw.x, 1e-4);
  float line = 1. - smoothstep(max(w, px*.75), max(w, px*.75) + px, fx);
  line *= smoothstep(0., .04, seg)*(1. - smoothstep(.96, 1., seg));
  return line*min(1., w/(px*.75));                                  // thinner than a pixel: fade to its average
}
// a painted fish on a buried layer: umber outline (a stylus groove, never thinner than a pixel and a half), filled coral, honey belly and bars, dorsal and
// belly fins, a forked tail, eye and gill stroke. q metres from its middle, nose toward +x; e = pixel size / len
vec4 waxFish(vec2 q, float len, float t, float e){
  vec2 p = q/max(len, .1);
  if (abs(p.x) > .62 || abs(p.y) > .42) return vec4(0.);
  p.y += sin(p.x*5. - t*1.6)*.03*(.6 - p.x);
  e = max(e, 1e-4);
  float bx = (p.x - .1)/.4, body = .17*sqrt(max(1. - bx*bx, 0.));
  float tl = clamp((-.18 - p.x)/.32, 0., 1.), tail = step(p.x, -.18)*(.03 + tl*.19);
  float dfin = max(0., 1. - abs(p.x - .08)/.22)*.085, vfin = max(0., 1. - abs(p.x - .16)/.1)*.06;
  float top = max(body + step(0., p.y)*dfin, tail), bot = max(body + step(p.y, 0.)*vfin, tail);
  float d = p.y > 0. ? p.y - top : -p.y - bot;
  d = max(d, abs(p.x) - .5);
  d = max(d, ((-.4 - p.x)*.9 - abs(p.y))*.7);                                                     // the tail is forked
  float lw = clamp(1.6*e, .016, .03), lk = 1. - .75*smoothstep(.015, .05, e);      // far off the drawn line thins away: a coral shape with honey bars
  float fill = 1. - smoothstep(-e, e, d), line = 1. - smoothstep(lw, lw + e, abs(d));
  line = max(line, 1. - smoothstep(.02, .02 + e, length(p - vec2(.37, .05))));                    // eye
  line = max(line, (1. - smoothstep(lw*.6, lw*.6 + e, abs(p.x - .22 + p.y*p.y*3.)))*fill*step(abs(p.y), body));     // gill stroke
  float inBody = step(abs(p.y), body)*step(-.18, p.x);
  vec3 c = mix(uCoral, uHoney, 1. - smoothstep(-.08, -.02, p.y));
  float bar = (1. - smoothstep(.028, .028 + e, abs(fract(p.x*5.2 + .15) - .5)*.19))*step(-.14, p.x)*step(p.x, .18)*inBody;
  c = mix(c, uHoney, bar*.9);
  c = mix(c, mix(uCoral, uUmber, .35), (1. - inBody)*.6);                                           // fins and tail a darker coral
  c = mix(c, mix(uUmber, uCoral, .2), line*lk);
  return vec4(c, max(fill, line*lk));
}
// tint: cold pigment (cream, or coral for the sail). thin 0..1, hollow 0..1, s = surface metres (x across flow, y along flow),
// T = world tangent along s.x, clearM = metres of sun needed to go from glossy cream to clear turquoise, detail 0/1.
vec3 waxShade(vec3 wp, vec3 N, vec3 T, vec3 V, vec4 fld, float force, float thin, float hollow, vec2 s, vec3 tint, float clearM, float detail, float dist){
  float set = waxSet(fld, force), sunM = waxSunM(fld, force);
  float deepH = clamp(hollow - 1., 0., 1.); hollow = min(hollow, 1.);      // (a hollow attribute above 1 is a deep, closed hollow: under an overhang)
  float soft = 1. - smoothstep(0., 22., sunM)*.85;                 // ridges soften and slump in sun
  vec2 fw = fwidth(s) + 1e-5;
  float fine = (1. - smoothstep(.07, .2, max(fw.x, fw.y)))*detail;  // brush ridges resolved?
  float fwm = max(fw.x, fw.y), mid = 1. - smoothstep(.5, 1.6, fwm);
  float broad = (1. - smoothstep(.45, 1.3, fwm))*detail;           // the loaded brush's own furrows, a hand deep: resolved from far off and along the face
  float bw = wxN(s*vec2(.8, .09))*2.6 + wxN(s*vec2(.21, .04) + 9.)*6.;
  float bph = (s.x*7.4 + bw*.55)*.5, bsn = sin(bph), bg = abs(bsn);  // 0 in the furrow, 1 on the land between
  float bfw = max(fw.x, 1e-4), blw = max(.055, bfw*.8);
  float furrow = (1. - smoothstep(blw, blw + bfw, bg*.27))*min(1., .055/(bfw*.8))*broad;
  float bslope = cos(bph)*(bsn < 0. ? -1. : 1.)*(1. - smoothstep(.6, 1., bg));
  float h = wxRidge(s), e = .03;
  float dh = (wxRidge(s + vec2(e, 0.)) - wxRidge(s - vec2(e, 0.)))/(2.*e);
  vec3 B = cross(N, T);
  float bl = wxF(s*.35 + 3.) - .5;                                  // pour overlaps: broad lumps
  float dby = (wxF((s + vec2(0., .2))*.35 + 3.) - .5 - bl)/.2;
  vec3 Nn = normalize(N - T*(dh*.085*fine + bslope*.3*broad)*soft - B*dby*.5*mid*soft);
  float NV = max(dot(Nn, V), 0.);
  vec2 par = vec2(dot(V, T), dot(V, B))/max(dot(V, N), .35);        // buried layers slide as the eye moves
  // ---- cold wax: matte, frosted, cloudy to a depth, amber buried under pale layers
  float a1 = wxF(s*.11 - par*.3), a2 = wxF(s*.034 - par*1.2*.034 + 7.);
  float bur = smoothstep(.46, .78, a1*.55 + a2*.45 + hollow*.5 - h*.06*fine);
  float scq = wxF(s*vec2(.15, .085) + 23.) + (wxN(s*vec2(1.3, .22) + 3.) - .5)*.03*broad;     // scraped back: a hard-edged patch a couple of metres across, scored along the stroke
  float scl = smoothstep(.35, .6, wxN(s*vec2(5.5, .16) + 5.)), sce = .008 + .03*smoothstep(.2, 1., fwm);
  float scr = smoothstep(.655, .655 + sce, scq)*(.72 + .28*scl*(1. - smoothstep(.1, .4, fw.x)))*detail*(1. - smoothstep(1.2, 3., fwm));
  vec3 cold = mix(tint, mix(tint, uHoney, .5), bur*.38);
  float hle = max(fwm*.9, .035);
  float hol2 = mix(hollow, smoothstep(.5 - hle, .5 + hle, hollow*1.2 + (wxF(s*vec2(.3, .19) + 77.) - .5)*.62)*(.55 + .45*hollow), .8*detail);
  cold = mix(cold, uAmber, clamp(scr*.8 + hol2*.8 + bur*bur*.25, 0., 1.));
  { float dq = hollow*1.25 + (wxN(s*vec2(.3, .19) + 131.) - .5)*.5, de = max(fwm*.9, .03);         // the deep of a hollow: the buried layer itself, dark and broad, with a made edge
    cold = mix(cold, mix(uAmber, uUmber, .3)*.86, smoothstep(.78 - de, .78 + de, dq)*.72*step(.5, detail)); }
  cold = mix(cold, uAmber, clamp(-h, 0., 1.)*.26*fine);
  cold += uCream*clamp(h, 0., 1.)*.05*fine;             // furrows show the layer under
  cold = mix(cold, mix(uAmber, uHoney, .25), furrow*.46);
  float chq = wxF(s*vec2(1.1, .42) + 51.), cha = max(fwm*1.1, .02);
  float chalk = smoothstep(.56 - cha, .56 + cha, chq)*(1. - smoothstep(.35, 1.1, fwm))*detail;       // chalk bloom: pale patches with a made edge
  cold = mix(cold*(1. - .055*broad), tint*1.01, chalk*.75);
  float wrap = .5 + .5*dot(Nn, normalize(uSun*.55 + vec3(0., .8, 0.)));
  cold *= .78 + .22*wrap;
  float fr = wxN(s*23.)*wxN(s*61. + 5.);                            // chalky frost, and pinholes
  float frK = 1. - smoothstep(.02, .06, max(fw.x, fw.y));
  cold += (fr - .25)*.10*frK*uCream;
  float pin = smoothstep(.93, .97, wxH(floor(s*3.1)))*(1. - smoothstep(.0, .11, length(fract(s*3.1) - .5)))*frK;
  cold = mix(cold, uUmber, pin*.7);
  { vec2 pc = floor(s*2.1), pf = fract(s*2.1) - .5 - (vec2(wxH(pc + 3.), wxH(pc + 47.)) - .5)*.5; float pr = .11 + .1*wxH(pc + 19.), pa = max(fwm*2.1, 1e-3);    // the larger pinholes: seen from ten metres
    cold = mix(cold, mix(uUmber, uAmber, .25), step(.86, wxH(pc + 9.))*(1. - smoothstep(pr - pa*.6, pr + pa*.6, length(pf)))*(1. - smoothstep(.09, .22, fwm))*detail*.8*(1. - smoothstep(.1, .4, thin))); }
  { vec2 bc = floor(s*vec2(1.25, .9)), bf = fract(s*vec2(1.25, .9)) - .5; float bh = wxH(bc + 71.), br = .07 + .09*wxH(bc + 13.);     // trapped bubbles, burst: a dark pit with a pale rim
    vec2 bo = (bf - (vec2(wxH(bc + 5.), wxH(bc + 29.)) - .5)*.6)/vec2(1.25, .9);
    float bd = length(bo), ba = max(fwm, 1e-3), bK = step(.74, bh)*(1. - smoothstep(.07, .2, fwm))*detail*(1. - smoothstep(.1, .4, thin));
    cold = mix(cold, tint*1.02, (1. - smoothstep(br + .03, br + .03 + ba, bd))*bK*.8);
    cold = mix(cold, mix(uAmber, uUmber, .5), (1. - smoothstep(br - ba*.5, br + ba*.5, bd))*bK*.85); }
  cold = min(cold, uCream*1.02);
  // ---- warm wax: glossy, clear, running
  float cfg = clearM*(.5 + .26*wxF(vec2(s.x*.33, s.y*.035) + 31.) + .16*wxN(vec2(s.x*1.15, s.y*.1) + 57.));      // the clear front is one line across the flow, running down in short tongues (not a field of fingers)
  float clear = smoothstep(cfg, cfg + .5 + clearM*.07, sunM);
  float run = wxF(s*vec2(.5, .16) + vec2(0., uTime*.55))*2. - 1.;   // slow runs down the flow
  // ropes of thicker wax running down the flow: smooth warped bands (no cell of the noise can show as a bar or a right angle)
  float rpw = wxN(vec2(s.x*.45, s.y*.12 - uTime*.05) + 13.)*5.2 + wxN(vec2(s.x*1.1 + 7., s.y*.31 - uTime*.11))*1.7;
  float rpn = .5 + .5*sin(s.x*4.2 + rpw + .7*sin(s.y*.5 + s.x*.8));
  vec3 Nw = normalize(mix(Nn, N, .5) + T*(run*.10 + thin*(rpn - .5)*.4*(1. - smoothstep(.06, .25, fwm)))*mid);
  float NVw = max(dot(Nw, V), 0.);
  vec3 body = mix(uDeep, uTurq, clamp(.25 + .75*NVw - a2*.3 + thin*.6 + uBodyBias, 0., 1.));
  { vec2 sb = s - par*2.2;                                           // clear wax has depth: a darker layer and painted strokes two metres down, sliding as the eye moves
    float dp1 = wxF(vec2(sb.x*.16, sb.y*.05) + 13.), dp2 = wxF(vec2(sb.x*.6 + .4*sin(sb.y*.09), sb.y*.06) + 71.), ea = max(fw.x*.6, .012), thk = 1. - smoothstep(.1, .34, thin);
    body = mix(body, uDeep, smoothstep(.42, .62, dp1)*.7*detail*thk);
    body = mix(body, mix(uAmber, uUmber, .3), smoothstep(.57 - ea, .57 + ea, dp2)*(.4 + .3*smoothstep(.4, .6, dp1))*detail*thk*(1. - smoothstep(1., 2.5, fwm))); }
  body = mix(body, mix(cold, uHoney, .38)*.92, (1. - clear)*.9);        // gloss arrives first, over wax still cream: wet, a tone deeper and warmer
  vec3 R = reflect(-V, Nw);
  float om1 = clamp(1. - NVw, 0., 1.), fres = .04 + .96*om1*om1*om1*om1*om1;
  vec3 warm = mix(body, mix(waxSky(R), uBlue, .45), fres*uRefl);
  { float ska = max(fw.x*1.6, .02), skq = wxF(vec2(s.x*2.1, s.y*.08 + uTime*.02) + 61.) + run*.04;
    float streak = smoothstep(.655 - ska, .655 + ska, skq)*(1. - smoothstep(.5, 1.4, fwm));
    warm = mix(warm, mix(uBlue, uCream, .25), streak*.3*(1. - clear)*(1. - smoothstep(0., .3, thin)));
    { float sl = s.y*.62 + 1.1*sin(s.x*.55 + wxN(s*vec2(.2, .1) + 3.)*4.) + wxN(s*vec2(.45, .3) + 7.)*2.4, sf = abs(fract(sl) - .5)*2., sw = max(fw.y*1.1, .075);
      float fold = (1. - smoothstep(sw, sw*1.8, sf))*(1. - clear)*(1. - smoothstep(0., .2, thin))*detail*(1. - smoothstep(.35, .9, fwm))*smoothstep(1.5, 5., sunM);
      warm = mix(warm, mix(uHoney, uAmber, .55), fold*.5); }        // wet wax slumps: sagging folds across the flow, between the gloss line and the clear front
    float mk = wxF(vec2(s.x*1.1 + .35*sin(s.y*.13), s.y*.03 + uTime*.012) + 91.), ma = max(fw.x*.8, .015);      // the mirror in clear wax: long smooth pale strokes down the flow
    warm = mix(warm, mix(uBlue, uCream, .2), smoothstep(.6 - ma, .6 + ma, mk)*.3*clear*detail*(1. - smoothstep(0., .3, thin))*(1. - smoothstep(.6, 1.6, fwm))); }
  float sp = max(dot(R, uSun), 0.);
  float sp2 = sp*sp; sp2 *= sp2; sp2 *= sp2; sp2 *= sp2; sp2 *= sp2; sp2 *= sp2;      // ^64
  warm += uGlint*(sp2*sp2*sp2*sp2*sp2*sp2*1.0 + sp2*.06);
  // thin wax in sun passes light as honey (edges, necks, lips), brightest seen from below and beside
  float back = .55 + .45*clamp(1. - NVw + .5*max(-V.y, 0.), 0., 1.);
  float rth = .74 + .2*(wxN(vec2(s.x*.37 + 5., s.y*.08)) - .5);      // ropes of thicker wax, running slowly: threads with a beginning and an end, never a regular stripe or a bar
  float rope = smoothstep(rth - .08, rth + .08, rpn)*smoothstep(.34, .52, wxN(vec2(s.x*.9 + 3., s.y*.3 - uTime*.07) + 71.))*(1. - smoothstep(.06, .25, fwm));   // (too far off to hold a rope: plain honey)
  vec3 honey = mix(uHoney*(.95 + .55*back), mix(uHoney, uAmber, .5)*(.85 + .25*back), rope*.62);
  honey += uGlint*(sp2*sp2*sp2*.5 + rope*(1. - rope)*.12);
  warm = mix(warm, honey, smoothstep(0., .34, thin));
  vec3 col = mix(warm, cold, set);
  { // shadow is the darker layer buried under the pale ones: the deeper and more closed a hollow, the more of it shows, in two made steps down to the dark of
    // the stylus grooves. No cast shadow: a rule of the place (the hollow attribute), the same in sun and shade; thin lit wax above it stays honey.
    float dn = (wxF(s*vec2(.22, .11) + 151.) - .5)*.34 + (wxN(s*vec2(1.7, .3) + 9.) - .5)*.08, de = max(fwm*.8, .02);
    float d1 = smoothstep(.22 - de, .22 + de, deepH + dn), d2 = smoothstep(.7 - de, .7 + de, deepH + dn*.8);
    float keep = 1. - smoothstep(.12, .5, thin)*(1. - set);
    col = mix(col, mix(uAmber, uUmber, .45)*(.8 - .12*furrow), d1*.8*keep);
    col = mix(col, mix(uAmber, uUmber, .82)*(.62 - .08*furrow), d2*.86*keep); }
  // ---- stylus grooves
  float gK = (1. - smoothstep(170., 250., dist))*detail;
  if (gK > 0. && uGrooveSp > 0.) col = mix(col, uUmber*(1. + .6*(1. - set)), waxGroove(s, uGrooveSp, fw)*gK*(.9 - .5*(1. - set)*clear)*(1. - smoothstep(.05, .34, thin)*(1. - set)));      // molten honey holds no groove
  return waxVeil(col, dist);
}
`,le=`
        // weed painted on the buried layer: single loaded strokes, amber and umber, swaying slowly
        vec4 seaWeed(vec2 q, float e){
          vec2 c = floor(q/7.), f = q - c*7.; vec4 o = vec4(0.);
          for (int i = 0; i < 3; i++) {
            float fi = float(i), h1 = wxH(c + fi*17.3), h2 = wxH(c*1.7 + fi*5.1 + 3.);
            vec2 root = vec2(1.2 + 4.6*h1, .6 + 1.6*h2); float len = 2.6 + 2.2*h2;
            float b = (f.y - root.y)/len;
            float a0 = root.x + sin(b*3.2 + uTime*(.4 + .3*h1) + h1*40.)*.42*b + (h2 - .5)*1.4*b*b;
            float w = mix(.2, .035, clamp(b, 0., 1.));
            float al = (1. - smoothstep(w, w + e, abs(f.x - a0)))*step(0., b)*step(b, 1.)*step(.3, h1 + h2*.5);
            o = mix(o, vec4(mix(uAmber, uUmber, step(.6, h2)*.7), 1.), al);
          }
          return o;
        }
`;async function ie(n,a,e={}){const f=e.res||512,t=e.size||1600,s=t/f,p=new Uint8Array(f*f*4),o=new Float32Array(f),l=new Float32Array(f),d=new Float32Array(f);for(let r=0;r<f;r++){const S=(r+.5)*s-t/2;for(let i=0;i<f;i++)o[i]=a((i+.5)*s-t/2,S),i===f>>1&&await n.yield();let V=-1e3;for(let i=0;i<f;i++)i>0&&o[i]>0!=o[i-1]>0&&(V=i-1+o[i-1]/(o[i-1]-o[i])),l[i]=(i-V)*s;V=1e3+f;for(let i=f-1;i>=0;i--)i<f-1&&o[i]>0!=o[i+1]>0&&(V=i+o[i]/(o[i]-o[i+1])),d[i]=(V-i)*s;for(let i=0;i<f;i++){const H=(r*f+i)*4,v=o[i]>0;p[H]=v?_(l[i]*2.55,0,255):0,p[H+1]=v?_(d[i]*2.55,0,255):0,p[H+2]=v?0:_(l[i]*2.55,0,255),p[H+3]=_(.5+o[i]/6,0,1)*255}await n.yield()}const y=new h.DataTexture(p,f,f,h.RGBAFormat);return y.minFilter=y.magFilter=h.LinearFilter,y.wrapS=y.wrapT=h.ClampToEdgeWrapping,y.generateMipmaps=!1,y.needsUpdate=!0,y}function fe(n,a={}){const e=a.palette&&a.palette.length>=7?a.palette:Q,f=a.exposure??1,t=r=>ne(r,f),s=(r,S,V)=>{const i=(v,N)=>parseInt(v.slice(1+N*2,3+N*2),16);let H="#";for(let v=0;v<3;v++)H+=Math.round($(i(r,v),i(S,v),V)).toString(16).padStart(2,"0");return H},p=a.blue||(e===Q?"#B9D9DC":s(e[0],e[3],.3)),o=new h.DataTexture(new Uint8Array([255,255,0,255]),1,1,h.RGBAFormat);o.needsUpdate=!0;const l=new h.Vector3(Math.sin(1.309)*Math.cos(.838),Math.sin(.838),Math.cos(1.309)*Math.cos(.838)),d={uTime:{value:0},uField:{value:o},uFieldXf:{value:new h.Vector4(1,0,0,0)},uFieldSize:{value:1600},uSunShift:{value:new h.Vector2},uSun:{value:l},uBandCreep:{value:0},uCream:{value:t(e[0])},uHoney:{value:t(e[1])},uAmber:{value:t(e[2])},uTurq:{value:t(e[3])},uDeep:{value:t(e[4])},uCoral:{value:t(e[5])},uUmber:{value:t(e[6])},uBlue:{value:t(p)},uVeil:{value:t(s(e[0],"#ffffff",.4))},uGlint:{value:t("#fbf6ea").multiplyScalar(2.5)}},y={palette:e,uniforms:d,blue:p,setSun(r){d.uSun.value.copy(r).normalize();const S=Math.max(d.uSun.value.y,.2);d.uSunShift.value.set(-d.uSun.value.x/S,-d.uSun.value.z/S)},setField(r,S=1600){d.uField.value=r,d.uFieldSize.value=S},setFieldXf(r,S,V){d.uFieldXf.value.set(Math.cos(r),Math.sin(r),S,V)},update(r){d.uTime.value=r,d.uBandCreep.value=r/900},material(r={}){const S={...d,uClearM:{value:r.clearM??3},uGrooveSp:{value:r.groove??0},uGrooveW:{value:r.grooveW??1},uRefl:{value:r.refl??.6},uBodyBias:{value:r.bodyBias??0},uDetail:{value:r.detail??1},...r.uniforms||{}};return new h.ShaderMaterial({uniforms:S,side:r.side??h.FrontSide,vertexShader:`
          attribute float aThin, aHollow, aForce; attribute vec3 aTan;
          varying vec3 vW, vN, vT; varying vec2 vS; varying vec3 vK; varying float vX;
          ${Z}
          ${r.vertexDecl||""}
          void main(){
            vec3 p = position, n = normal, tg = aTan; float thin = aThin, hollow = aHollow, force = aForce, xv = 0.; vec2 s = uv;
            ${r.instanced?"mat4 M = modelMatrix*instanceMatrix;":"mat4 M = modelMatrix;"}
            ${r.vertexPos||""}
            vec4 wxP = M*vec4(p, 1.);
            vW = wxP.xyz; vN = mat3(M)*n; vT = mat3(M)*tg; vS = s; vK = vec3(thin, hollow, force); vX = xv;
            gl_Position = projectionMatrix*viewMatrix*wxP;
          }`,fragmentShader:`
          varying vec3 vW, vN, vT; varying vec2 vS; varying vec3 vK; varying float vX;
          uniform float uClearM, uDetail;
          ${Z}
          ${re}
          ${r.fragDecl||""}
          void main(){
            ${r.fragPre||""}
            vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
            vec3 T = vT - N*dot(vT, N); T = normalize(T + vec3(1e-4, 0., 2e-4));
            vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-4);
            vec4 fld = waxField(vW);
            float thin = vK.x, hollow = vK.y, force = vK.z, detail = uDetail, clearM = uClearM; vec2 s = vS; vec3 tint = ${r.tint||"uCream"};
            ${r.fragMid||""}
            vec3 col = waxShade(vW, N, T, V, fld, force, thin, hollow, s, tint, clearM, detail, dist);
            ${r.fragPost||""}
            gl_FragColor = vec4(col, 1.);
          }`})}};return y.setSun(a.sun||l),y}function ce(n,a){const e=n.rng,f=n.noise,t=280,s=95,p=a.sweep,o=t+s*p,l=1.225,d=t+s*l,y=e.range(0,100),r=e.range(0,100),S=a.height,V=(c,g)=>{if(c<=t)g.x=210-c,g.z=0,g.tx=-1,g.tz=0,g.nx=0,g.nz=1;else{const P=(c-t)/s,T=Math.sin(P),w=Math.cos(P);g.x=-70-s*T,g.z=95-s*w,g.tx=-w,g.tz=T,g.nx=T,g.nz=w}return g},i=c=>{const g=R(0,46,c),P=1-R(o-46,o,c),T=1+.06*f.n2(c*.012+y,3.1)+.025*f.n2(c*.05,r),w=1+.14*R(t-20,t+50,c)*(1-R(o-95,o-40,c));return Math.max(1.2,S*(.04+.96*g)*(.04+.96*P)*T*w)},H=c=>1-R(14,60,Math.abs(c-d)),v=c=>$(1,.3,H(c)),N=c=>$(1,.12,H(c)),u=(c,g)=>1-8.8*g*Math.sin(Math.PI*Math.pow(_(c/27,0,1),.8)),b=(c,g,P)=>Math.min(u(Math.min(c,26),g),-3)-(2.5+12*P*(1-c/30)),A=[];for(const[c,g]of[[15,-2.4],[10.5,-2],[6.4,-1.4],[3.3,-.5]])A.push({k:0,off:c,y:g,thin:0,sag:0,hol:0});const F=[];{const c=[1.2,2.2,3.3,4.5,5.8,7.2,8.6,10,11.4,12.8,14.2,15.6,17,18.4,19.8,21.2,22.5,23.7,24.8,25.6,26.2];for(let g=0;g<c.length;g++)F.push(c[g]),g>0&&g<c.length-3&&F.push((c[g]+c[g+1])/2)}for(const c of F)A.push({k:1,y:c,thin:0,sag:R(21,26,c)*.25,hol:R(10.5,19.5,c),deep:R(14.5,25,c)});const k=[[2.6,26.5,.3,.45,1],[4.6,26.1,.6,.7,.9],[6,25.4,.9,.9,.5],[7,24.5,1,1,0],[6.95,25.5,1,1,0],[6.1,27,.75,.85,0],[4.3,28.3,.45,.6,0],[1.6,29.4,.2,.3,0],[-1.4,30,.05,.1,0]];for(const[c,g,P,T,w]of k)A.push({k:2,off:c,y:g,thin:P,sag:T,hol:w,deep:w>.4?P<.5?1:.75:0});for(const c of[29.2,26,19,10,1.5,-1])A.push({k:3,y:c,thin:0,sag:0,hol:0});const W=c=>.9*f.n2(c*.09,y+9)+.45*f.n2(c*.37,r+4),K={};return{Hmax:S,straight:t,R:s,Ltot:o,sArch:d,archPhi:l,spine:V,Hof:i,rows:A,point:(c,g,P,T=!0)=>{const w=A[g];V(c,K);const M=i(c),x=M/30,C=v(c),D=N(c);let I,z;if(w.k===0)I=w.off+1*(x-1)*0,z=w.y;else if(w.k===1)I=u(w.y,C)*Math.max(x,.25),z=w.y*x;else if(w.k===2){I=w.off*Math.max(x,.25),z=w.y*x;const m=w.thin;I+=m*.5*W(c+31)*x,z+=m*W(c)*x}else I=b(w.y,C,D)*Math.max(x,.25),z=w.y*x;if(T&&w.k>0){const m=.36*Math.sin(c*.62+1.6*f.n2(c*.05,z*.03+y))+.26*f.n2(c*.13+r,z*.07),q=.34*f.n2(c*.035+y,z*.11),B=w.k===2?.35:1;I+=(m+q)*B*Math.min(1,x*1.5),z+=w.k===2?0:.1*f.n2(c*.11,z*.07+r)}return P.x=K.x+K.nx*I,P.z=K.z+K.nz*I,P.y=z,P.off=I,P},nearArch:H,faceOff:u,backOff:b,leanOf:v,thickOf:N,tipRow:7,rootRow:4}}async function J(n,a){const e=a.getAttribute("position").array,f=a.index.array,t=e.length/3,s=new Float32Array(t*3);for(let p=0;p<f.length;p+=3){const o=f[p]*3,l=f[p+1]*3,d=f[p+2]*3,y=e[d]-e[l],r=e[d+1]-e[l+1],S=e[d+2]-e[l+2],V=e[o]-e[l],i=e[o+1]-e[l+1],H=e[o+2]-e[l+2],v=r*H-S*i,N=S*V-y*H,u=y*i-r*V;s[o]+=v,s[o+1]+=N,s[o+2]+=u,s[l]+=v,s[l+1]+=N,s[l+2]+=u,s[d]+=v,s[d+1]+=N,s[d+2]+=u,p%9e3===8997&&await n.yield()}for(let p=0;p<t;p++){const o=p*3,l=Math.hypot(s[o],s[o+1],s[o+2])||1;s[o]/=l,s[o+1]/=l,s[o+2]/=l,p%2e4===19999&&await n.yield()}return a.setAttribute("normal",new h.BufferAttribute(s,3)),a}async function he(n,a,e){const f=[];{let k=0;for(;k<a.Ltot-.6;)f.push(k),k+=k>92&&k<a.sArch+26?1:2;f.push(a.Ltot)}const t=f.length-1,s=a.rows.length,p=(t+1)*s,o=new Float32Array(p*3),l=new Float32Array(p*2),d=new Float32Array(p*3),y=new Float32Array(p),r=new Float32Array(p),S=new Float32Array(p),V=new Float32Array(p),i=new Float32Array(p),H={},v={},N={},u=n.noise;for(let k=0;k<=t;k++){const W=f[k];a.spine(W,N);let K=0,G=0,c=0,g=0;for(let P=0;P<s;P++){const T=k*s+P,w=a.rows[P];a.point(W,P,v),P>0&&(K+=Math.hypot(v.x-G,v.y-c,v.z-g)),G=v.x,c=v.y,g=v.z,o[T*3]=v.x,o[T*3+1]=v.y,o[T*3+2]=v.z,l[T*2]=W,l[T*2+1]=K,d[T*3]=N.tx,d[T*3+1]=0,d[T*3+2]=N.tz;const M=v.x-e.p.x,x=v.y-e.p.y,C=v.z-e.p.z,D=M*e.d.x+x*e.d.y+C*e.d.z,I=Math.hypot(M-e.d.x*D,x-e.d.y*D,C-e.d.z*D),z=Math.abs(D)<26?1-R(e.r+.8,e.r+5.4+2.2*u.n2(W*.2,v.y*.2),I):0;y[T]=Math.max(w.thin,z*.9),r[T]=(_(w.hol*(.78+.3*u.n2(W*.045,v.y*.05))+(w.k===1?.3*R(.35,.7,u.n2(W*.021+5,v.y*.09)):0),0,1)+(w.deep||0)*Math.min(a.Hof(W)/a.Hmax,1))*(1-z),S[T]=Math.abs(D)<26?1-R(e.r+1.5,e.r+6,I):0,V[T]=w.sag;const m=w.k===1?_((w.y-8.6)/9,0,1):w.k===2&&w.hol>.4?1:0;m>0&&(a.point(W,P,H,!1),i[T]=(m+.25*_((H.off-v.off)/.6,-1,1))*Math.min(a.Hof(W)/a.Hmax,1)*(1-z)*R(.3,.5,a.leanOf(W)))}k%2===1&&await n.yield()}await n.yield();const b=new Uint32Array(t*(s-1)*6);let A=0;for(let k=0;k<t;k++)for(let W=0;W<s-1;W++){const K=k*s+W,G=K+s;b[A++]=K,b[A++]=K+1,b[A++]=G,b[A++]=G,b[A++]=K+1,b[A++]=G+1}const F=new h.BufferGeometry;return F.setIndex(new h.BufferAttribute(b,1)),F.setAttribute("position",new h.BufferAttribute(o,3)),F.setAttribute("uv",new h.BufferAttribute(l,2)),F.setAttribute("aTan",new h.BufferAttribute(d,3)),F.setAttribute("aThin",new h.BufferAttribute(y,1)),F.setAttribute("aHollow",new h.BufferAttribute(r,1)),F.setAttribute("aForce",new h.BufferAttribute(S,1)),F.setAttribute("aSag",new h.BufferAttribute(V,1)),F.setAttribute("aCurl",new h.BufferAttribute(i,1)),await n.yield(),await J(n,F),F}async function ue(n,a,e){const f=n.noise,t=64,s=9,p=[],o=[],l=[],d=[],y=[],r=[],S=[],V=[],i={},H={};a.spine(a.sArch,H);const v=a.Hof(a.sArch),N=v/30,u=e.d,b=e.right,A=e.up,F=e.r,k=(M,x,C)=>(C?a.backOff(x/N,a.leanOf(M),a.thickOf(M)):a.faceOff(x/N,a.leanOf(M)))*N;for(let M=0;M<=t;M++){const x=M/t*Math.PI*2,C=Math.cos(x),D=Math.sin(x),I=1+.03*f.n2(C*2.2+7,D*2.2)+.018*f.n2(C*7+3,D*7);for(let z=0;z<s;z++){const m=(F+[2.7,1.5,.35,0,.15,0,.35,1.5,2.7][z])*(z===1||z===7?1+(I-1)*2.5:I),q=-m*C,B=e.p.y+m*D,L=a.sArch+q,U=q*q/(2*a.R),X=k(L,B,!1)+U,O=k(L,B,!0)+U,j=-([X-.7,X+1,X+1.25,X-.1,(X+O)/2,O+.1,O-1.25,O-1,O+.7][z]-e.seatOff);p.push(e.p.x+b.x*m*C+A.x*m*D+u.x*j,e.p.y+b.y*m*C+A.y*m*D+u.y*j,e.p.z+b.z*m*C+A.z*m*D+u.z*j),o.push(j+300,F*Math.acos(_(D,-1,1))+500),l.push(u.x,u.y,u.z),d.push(z===0||z===8?.85:1),y.push(0),r.push(2),S.push(0)}}for(let M=0;M<t;M++)for(let x=0;x<s-1;x++){const C=M*s+x,D=C+s;V.push(C,D,C+1,D,D+1,C+1)}await n.yield();const W=p.length/3,K=60,G=36,c=Math.tan(e.climb),g=new h.Vector3(u.x,0,u.z).normalize(),P=new h.Vector3(e.p.x,0,e.p.z),T=e.p.y-2.4;for(let M=0;M<=K;M++){const x=-118+M/K*126,C=x>-70?T+Math.min(x,2.5)*c-R(2.5,8,x)*9:(T-70*c)*R(-118,-70,x)**1.4,D=$(21,11.5,R(-110,-8,x));for(let I=0;I<=G;I++){const z=(I/G-.5)*2*36,m=z+(4.2*f.n2(x*.085,z*.03+3.1)+2.2*f.n2(x*.21+9,z*.05))*R(5,14,Math.abs(z)),q=Math.exp(-(m*m)/(D*D)),B=Math.max(R(24,36,Math.abs(z)),1-R(-118,-100,x)),L=C*q+.35*f.n2(x*.06,z*.08)*q-1.1*B;p.push(P.x+g.x*x+b.x*z,L,P.z+g.z*x+b.z*z),o.push(z+700,x+900),l.push(b.x,0,b.z),d.push(0),y.push(0),r.push(2),S.push(0)}M%12===11&&await n.yield()}for(let M=0;M<K;M++)for(let x=0;x<G;x++){const C=W+M*(G+1)+x,D=C+G+1;V.push(C,C+1,D,D,C+1,D+1)}await n.yield();const w=new h.BufferGeometry;return w.setIndex(new h.BufferAttribute(new Uint32Array(V),1)),w.setAttribute("position",new h.Float32BufferAttribute(p,3)),w.setAttribute("uv",new h.Float32BufferAttribute(o,2)),w.setAttribute("aTan",new h.Float32BufferAttribute(l,3)),w.setAttribute("aThin",new h.Float32BufferAttribute(d,1)),w.setAttribute("aHollow",new h.Float32BufferAttribute(y,1)),w.setAttribute("aForce",new h.Float32BufferAttribute(r,1)),w.setAttribute("aSag",new h.Float32BufferAttribute(S,1)),w.setAttribute("aCurl",new h.BufferAttribute(new Float32Array(S.length),1)),await n.yield(),await J(n,w),w}function Y(n,a){const e=[],f=[],t=[],s=a.length;for(let l=0;l<s;l++)for(let d=0;d<n;d++){const y=d/n*Math.PI*2+l*.4,[r,S]=a[l];e.push(Math.cos(y)*S,r,Math.sin(y)*S);const V=l===0?.6:l===s-1?-.5:0,i=Math.hypot(1,V);f.push(Math.cos(y)/i,V/i,Math.sin(y)/i)}e.push(0,1,0),f.push(0,-1,0);for(let l=0;l<s-1;l++)for(let d=0;d<n;d++){const y=l*n+d,r=l*n+(d+1)%n;t.push(y,r,y+n,r,r+n,y+n)}const p=s*n;for(let l=0;l<n;l++)t.push((s-1)*n+l,(s-1)*n+(l+1)%n,p);const o=new h.InstancedBufferGeometry;return o.setIndex(t),o.setAttribute("position",new h.Float32BufferAttribute(e,3)),o.setAttribute("normal",new h.Float32BufferAttribute(f,3)),o}const ee="attribute vec3 iPos; attribute vec4 iA, iB;",de=`
  vec3 aw = (M*vec4(iPos, 1.)).xyz; vec4 f0 = waxField(aw + vec3(-uSunShift.x, 0., -uSunShift.y)*14.);
  float fz = iB.w, sunM = waxSunM(f0, fz), sg = waxSag(sunM), ph = iA.z;
  float grow = max(clamp(f0.r/40., 0., 1.), 1. - smoothstep(.25, .75, f0.a));      // lengthens for five seconds behind the edge, then hardens; in sun it is as long as the shade left it
  float thr = step(iB.x, .45)*(1. - fz);                             // a share of the fringe does not let go for a long while: it draws out to a thread, a bead at its tip
  float t1 = clamp((sunM - 2. - ph*16.)/9., 0., 1.), t2 = clamp((sunM - mix(11., 70., thr) - ph*mix(16., 50., thr))/mix(3., 9., thr), 0., 1.);   // in sun: stretch to a thread, let go
  float cyc = fract(uTime*(.16 + .12*iB.x) + ph*7.);
  float cg = min(cyc/.85, (1. - cyc)/.15);                           // a molten stub beads, lengthens and lets go, eased
  float Lm = mix(iA.x*(.22 + .42*cg*cg), iA.x*(.74 + .26*sin(uTime*(.5 + .4*iB.x) + ph*40.)), fz);   // the arch's ropes stay long, breathing
  float L = mix(iA.x*(.22 + .78*grow)*(1. + (.8 + .7*thr)*t1*t1), Lm, t2);
  float pix = distance(aw, cameraPosition)*.0011;                    // never thinner than a pixel and a half
  float w = max(iA.y, pix), bead = w*(1. + .35*t1)*mix(1., .55 + .6*cg, t2);
  float bl = min(bead*2.6, L*.75), t = position.y, isB = step(.6, t);
  float yl = mix((t/.6)*(L - bl), (L - bl) + (t - .6)/.4*bl, isB);
  float rr = mix(max(w*(1. - (.6 + .15*thr)*t1*(1. - t2)), pix*1.2), bead*(1. + .25*thr*t1), isB);
  p = iPos + vec3(position.x*rr, -yl - 3.*iA.w*sg, position.z*rr);
  float sw = (1. - waxSet(f0, fz))*t*t*L;
  p.x += sin(uTime*1.3 + ph*40.)*.05*sw; p.z += cos(uTime*1.1 + ph*31.)*.05*sw;
  thin = mix(.85, .35, isB); hollow = 0.; force = fz; tg = vec3(1., 0., 0.);
  s = vec2(ph*97. + position.x, yl + iB.x*31.);
`,pe=`
  vec3 aw = (M*vec4(iPos, 1.)).xyz; vec4 f0 = waxField(aw + vec3(-uSunShift.x, 0., -uSunShift.y)*14.);
  float fz = iB.w, sunM = waxSunM(f0, fz), sg = waxSag(sunM), ph = iA.z;
  float show = smoothstep(3., 12., sunM - ph*16.)*(1. - smoothstep(70., 110., sunM)*.75);
  float cyc = fract(uTime/(2.4 + 1.6*iB.x) + ph*5.);
  float tf = max(cyc - .25, 0.)/.75;
  float pix = distance(aw, cameraPosition)*.0011;
  float sc = smoothstep(0., .25, cyc)*(1. - smoothstep(.92, 1., cyc))*show*max(iA.y, pix);
  p = iPos + vec3(position.x*sc, -position.y*sc*2.6*(1. + 1.8*tf) - .3 - 3.*iA.w*sg - iA.x*tf*tf, position.z*sc);
  thin = .9; hollow = 0.; force = 1.; tg = vec3(1., 0., 0.); s = vec2(ph*97., position.y);
`;function me(n,a,e){const f=a.length,t=new Float32Array(f*3),s=new Float32Array(f*4),p=new Float32Array(f*4);for(let o=0;o<f;o++){const l=a[o];t.set(l.p,o*3),s.set(l.a,o*4),p.set(l.b,o*4)}return n.setAttribute("iPos",new h.InstancedBufferAttribute(t,3)),n.setAttribute("iA",new h.InstancedBufferAttribute(s,4)),n.setAttribute("iB",new h.InstancedBufferAttribute(p,4)),n.instanceCount=Math.min(f,e),n}async function we(n,a,e,f){const t=n.rng.fork?n.rng.fork("drips"):n.rng,s=n.noise,p={},o=[],l=[],d=[],y=a.rows.findIndex(u=>u.thin===1),r=a.Hmax,S=(u,b)=>{const A=a.Hof(u)/r,F=t(),k=F<.62?y:F<.8?y-1:F<.92?y-2:y+1;a.point(u,k,p);const W=.35+.65*R(-.5,.6,s.n2(u*.045,17.3))+.25*s.n2(u*.4,3.3),K=(.5+3.5*Math.pow(t(),1.25))*_(W,.42,1.15)*Math.max(A,.3)*(k===y?1:.6),G=(.085+.12*t()+K*.03)*(b?1:1.15);return{p:[p.x+t.range(-.15,.15),p.y+.12,p.z+t.range(-.15,.15)],a:[K,G,t(),a.rows[k].sag],b:[t(),0,0,0],y:p.y}},V=2730,i=300;for(let u=0;u<V;u++){let b=t.range(22,a.Ltot-6);t()>a.Hof(b)/r+.15&&(b=t.range(70,a.Ltot-40)),o.push(S(b,!1)),u%60===59&&await n.yield()}for(let u=0;u<i;u++)l.push(S(t.range(120,235),!0));await n.yield();const H=a.Hof(a.sArch)/30,v=(u,b)=>{const A=e.r+b,F=Math.cos(u),k=Math.sin(u),W=-A*F,K=e.p.y+A*k,G=a.sArch+W,c=a.faceOff(K/H,a.leanOf(G))*H+W*W/(2*a.R),g=-(c+1.32-e.seatOff);return[e.p.x+e.right.x*A*F+e.up.x*A*k+e.d.x*g,e.p.y+e.right.y*A*F+e.up.y*A*k+e.d.y*g,e.p.z+e.right.z*A*F+e.up.z*A*k+e.d.z*g]};for(let u=0;u<250;u++){const b=t.range(.04,Math.PI-.04),A=Math.abs(Math.cos(b)),F=v(b,t.range(-.05,1.2)),k=.5+Math.pow(t(),1.3)*$(1.9,4.2,A*A);l.push({p:F,a:[k,.08+.1*t()+k*.015,t(),0],b:[t(),0,0,1],y:F[1]})}for(let u=0;u<950;u++){const b=S(t()<.84?t.range(140,332):t.range(40,a.Ltot-20),!1);b.a=[Math.max(b.y-3.4,2)*(.35+.65*t()),.17+.16*t(),t(),b.a[3]],d.push(b),u%60===59&&await n.yield()}for(let u=0;u<110;u++){const b=t()<.5?-1:1,A=Math.PI/2+b*t.range(.62,1.25),F=v(A,t.range(0,.8));d.push({p:F,a:[Math.max(F[1]-6.6,1.5),.06+.05*t(),t(),0],b:[t(),0,0,1]})}const N=u=>{for(let b=u.length-1;b>0;b--){const A=Math.floor(t()*(b+1)),F=u[b];u[b]=u[A],u[A]=F}return u};return{far:N(o),near:N(l),drops:N(d),counts:[Math.round(V*f),Math.round(l.length*f),Math.round(d.length*f)]}}async function be(n,a={}){const e=n.rng,f=_(a.detail??1,.5,1),t=!a.style,s=a.style||fe(n,{palette:a.palette}),p=s.uniforms,o=ce(n,{sweep:e.range(1.6,1.76),height:e.range(31.5,34)}),l=o.spine(o.sArch,{}),d=4*Math.PI/180,y=-4,r=new h.Vector3(-l.nx*Math.cos(d),Math.sin(d),-l.nz*Math.cos(d)),S=new h.Vector3(-r.z,0,r.x).normalize(),V=new h.Vector3().crossVectors(S,r).normalize(),i={p:new h.Vector3(l.x+l.nx*y,9.5,l.z+l.nz*y),d:r,right:S,up:V,r:7.5,climb:d,seatOff:y};await n.yield();const H=new h.Group;H.name="standing-breaker";const v=6,N=n.core?n.core.makeRng(n.core.hashSeed("foot-fish:"+n.seed)):e,u=[];{const m={};let q=0,B=0,L=0,U=0,X=19;const O=o.Hof(150)/30;for(let E=0;E<o.rows.length;E++)o.point(150,E,m,!1),E>0&&(q+=Math.hypot(m.x-B,m.y-L,m.z-U)),B=m.x,L=m.y,U=m.z,o.rows[E].k===1&&m.y<=2.3*O&&(X=q);for(let E=0;E<v-1;E++)u.push([55+(E+N.range(.2,.8))*220/(v-1),X+N.range(-.3,.3),N.range(6,9),N()<.75?-1:1,N.range(0,6.28)]);u.push([700+N.range(-7,3),900-N.range(38,62),N.range(6,8),1,N.range(0,6.28)])}const b={value:u.map(m=>new h.Vector4(m[0],m[1],m[2],m[3]))},A={value:i.p.clone()},F={value:i.d.clone()},k=s.material({clearM:15,detail:1,groove:2.3,grooveW:1.9,refl:.32,bodyBias:.08,uniforms:{uArchP:A,uArchD:F,uFish:b,...a.swellUniforms||{}},vertexDecl:"attribute float aSag; attribute float aCurl;",vertexPos:"vec4 fv = waxField((M*vec4(p, 1.)).xyz + vec3(-uSunShift.x, 0., -uSunShift.y)*(14.*thin)); p.y -= 3.*aSag*waxSag(waxSunM(fv, min(force, 1.))); xv = aCurl;",fragDecl:"uniform vec3 uArchP, uArchD; uniform vec4 uFish["+v+"];"+le+(a.swellDecl||""),fragPre:"if (vK.z < 1.5) { vec3 q = vW - uArchP; float al = dot(q, uArchD); if (abs(al) < 26. && length(q - uArchD*al) < 7.62) discard; }",fragMid:`if (force > 1.5) detail = 0.; force = min(force, 1.); if (thin > .01) fld = waxField(vW + vec3(-uSunShift.x, 0., -uSunShift.y)*(14.*smoothstep(0., .5, thin))); fld.a = smoothstep(.435, .565, fld.a); float footY = 3.7 + 1.3*(wxF(vec2(s.x*.19, 3.7)) - .5) + .5*(wxN(vec2(s.x*1.1, 9.)) - .5), footW = max(fwidth(vW.y)*.8, .02), footK = vK.z < 1.5 ? 1. - smoothstep(-footW, footW, vW.y - footY) : 0.; if (vK.z < 1.5) clearM = mix(400., 7., footK); float hw = max(fwidth(vK.x)*.75, .02);
      if (vK.z < 1.5 && s.x > ${(o.sArch-1).toFixed(3)}) {
        float hn = wxF(s*vec2(.3, .21) + 5.) - .5, far = smoothstep(-.4, .4, s.x - ${(o.sArch+5).toFixed(3)} + hn*4.);
        float hq = thin - .22 + hn*.5, he = smoothstep(-hw, hw, hq), ht = smoothstep(-hw, hw, hq + 3.*hw);
        if (far*ht > .5 && thin < .34) { fld = waxField(vW + vec3(-uSunShift.x, 0., -uSunShift.y)*(14.*smoothstep(0., .5, .34))); fld.a = smoothstep(.435, .565, fld.a); }   // inside the edge the wax is all honey-thin: it looks as far up-sun as thin wax does
        float hold = far*(1. - he);
        thin = mix(thin, max(thin, .34)*ht, far);
        fld.a = max(fld.a, hold); force *= 1. - hold; }`,fragPost:`
      { float heap = step(1.5, vK.z)*(1. - smoothstep(.15, .4, thin));     // the heaped swell under the arch: a world may shade it as its own sea (opts.swellFrag)
        ${a.swellFrag||""}
        vec3 Bq = cross(N, T); vec2 par = vec2(dot(V, T), dot(V, Bq))/max(dot(V, N), .35);
        float ew = fwidth(s.x) + fwidth(s.y), stW = waxSet(fld, force), sunW = waxSunM(fld, force), fcA = 0.;
        { // the amber belly: the hollow shows the buried amber more fully the deeper a point lies in the curl (vX: the curl depth, by the section alone), in three
          // poured steps whose made, lobed edges run down the flutes as tongues. On set wax only (where the lane has melted the wall it ends as the set wax ends);
          // not on a stylus groove (each runs on through it as an umber line), not where the first umber step stands (worked here as waxShade works it), not on
          // thin wax, not on the heaped swell. Nothing here is darker than the amber itself; on the third step each brush land carries the furrows' paler tone.
          vec2 cfw = fwidth(s) + 1e-5; float cfm = max(cfw.x, cfw.y), cq = vX + (wxF(s*vec2(.21, .13) + 211.) - .5)*.2, ce = max(fwidth(cq)*.8, .004);
          if (vX > 0. && vK.z < 1.5) {
            float b1 = smoothstep(.2 - ce, .2 + ce, cq), b2 = smoothstep(.5 - ce, .5 + ce, cq), b3 = smoothstep(.8 - ce, .8 + ce, cq);
            float dn = (wxF(s*vec2(.22, .11) + 151.) - .5)*.34 + (wxN(s*vec2(1.7, .3) + 9.) - .5)*.08, de = max(cfm*.8, .02);
            float d1 = smoothstep(.22 - de, .22 + de, clamp(hollow - 1., 0., 1.) + dn);
            float gl = uGrooveSp > 0. ? waxGroove(s, uGrooveSp, cfw)*(1. - smoothstep(170., 250., dist))*detail : 0.;
            float cbw = wxN(s*vec2(.8, .09))*2.6 + wxN(s*vec2(.21, .04) + 9.)*6., cbg = abs(sin((s.x*7.4 + cbw*.55)*.5)), cpe = max(cfw.x*1.4, .02);
            float crn = smoothstep(.88 - cpe, .88 + cpe, cbg)*(1. - smoothstep(.45, 1.3, cfm))*detail*b3;
            col = mix(col, waxVeil(mix(uAmber, mix(uAmber, uHoney, .25), crn*.5), dist), (.35*b1 + .35*b2 + .3*b3)*(1. - gl)*(1. - d1)*(1. - smoothstep(.07, .3, thin))*stW); } }
        // the gloss line: where the lane's light has just reached the wall the first film of melt is thin and the sun stands in it: one bright honey line climbing the face
        col = mix(col, waxVeil(mix(uHoney, uCream, .22)*1.3, dist), 4.*stW*(1. - stW)*.9*(1. - smoothstep(0., .3, thin))*(1. - step(1.5, vK.z)));
        if (vK.z < 1.5 && thin > .2) {                                       // round the arch the thin wax still runs: slow ropes round the rim, standing in relief (a crease, a lit shoulder), and beads on them, each with its glint
          vec3 qa = vW - uArchP; float ala = dot(qa, uArchD); vec3 rv = qa - uArchD*ala; float ra = length(rv);
          if (abs(ala) < 26. && ra < 20.) {
            float ang = atan(dot(rv, normalize(cross(uArchD, vec3(0., 1., 0.)))), rv.y), pe = max(fwidth(ra), 1e-3);
            float ph = (ra - 7.6)*1.15 + (wxN(vec2(ang*3., ra*.4) + 5.) - .5)*1.4 - uTime*.05, rl = fract(ph) - .5;
            float rK = smoothstep(.2, .45, thin)*(1. - smoothstep(.5, 1.6, pe));
            col = mix(col, waxVeil(mix(uAmber, uUmber, .22), dist), (1. - smoothstep(.07, .07 + pe*1.2, abs(rl + .3)))*.6*rK);
            col = mix(col, waxVeil(mix(uHoney, uCream, .6)*1.15, dist), (1. - smoothstep(.06, .06 + pe*1.2, abs(rl - .1)))*.5*rK);
            vec2 bq = vec2(ang*ra*.8, ph), bc = floor(bq), bf = fract(bq) - .5 - (vec2(wxH(bc + 3.), wxH(bc + 17.)) - .5)*.4;
            float br = .2 + .14*wxH(bc + 7.), bon = step(.5, wxH(bc + 29.))*rK;
            col = mix(col, waxVeil(mix(uHoney, uAmber, .6), dist), (1. - smoothstep(br - pe, br + pe, length(bf)))*bon*.75);
            col = mix(col, waxVeil(uGlint*.6, dist), (1. - smoothstep(.05, .05 + pe, length(bf - vec2(.07, .08))))*bon); } }
        { float visF = max(footK, heap)*(1. - stW)*smoothstep(2.5, 8., sunW)*(1. - thin);
          if (visF > .003) {
            // the top of the clear foot: thin clear wax over the cream, pale, then deep at once
            col = mix(col, waxVeil(mix(uTurq, uBlue, .55), dist), footK*visF*smoothstep(footY - .5, footY - .08, vW.y)*.75);
            for (int i = 0; i < ${v}; i++) { vec4 fi = uFish[i]; vec2 fq = s - fi.xy - par*.6; fq.x *= fi.w;
              vec4 fc = waxFish(fq, fi.z, uTime + float(i)*1.7, ew/max(fi.z, .1));
              col = mix(col, waxVeil(fc.rgb, dist), fc.a*visF*.94); fcA = max(fcA, fc.a); } } }
        if (vK.z > 1.5 && thin < .4 && ${a.swellFrag?"false":"true"}) {                                   // the heaped swell is clear to its painted layer: weed under the boat as it climbs
          vec4 wd = seaWeed(s - par*1.6, ew);
          col = mix(col, waxVeil(wd.rgb, dist), wd.a*.6*(1. - smoothstep(.25, .9, ew))*(1. - fcA)*(1. - thin*2.5)); } }`}),W=new h.Mesh(await he(n,o,i),k);W.name="wall",await n.yield();const K=new h.Mesh(await ue(n,o,i),k);K.name="arch",H.add(W,K),await n.yield();const G=await we(n,o,i,f);await n.yield();const c=s.material({clearM:6,detail:0,side:h.DoubleSide,vertexDecl:ee,vertexPos:de}),g=s.material({clearM:3,detail:0,side:h.DoubleSide,vertexDecl:ee,vertexPos:pe}),P=(m,q,B,L,U)=>{const X=new h.Mesh(me(m,q,B),L);return X.frustumCulled=!1,X.name=U,H.add(X),X};P(Y(3,[[0,1.5],[.6,.5],[.85,1]]),G.far,G.counts[0],c,"fringe"),await n.yield(),P(Y(5,[[0,1.5],[.14,.8],[.6,.5],[.76,.9],[.88,1]]),G.near,G.counts[1],c,"fringe-near"),await n.yield(),P(Y(3,[[0,.05],[.42,.4],[.68,.93],[.84,.93],[.95,.55]]),G.drops,G.counts[2],g,"drops"),await n.yield();const T=.6;let w=a.progress??T;if(t){s.setSun(new h.Vector3(-.173,.743,.646));const m=await ie(n,(q,B)=>{const L=-B,U=q,O=320*(.44+(210-L)/280*.32-T)-11+420*R(-50,-105,L);return Math.max(O-U,U-(O+64))});s.setField(m,1600),s.setFieldXf(-Math.PI/2,320*(w-T),0)}if(a.sea??t){const m=new h.PlaneGeometry(1600,1600,1,1);m.rotateX(-Math.PI/2);const q=m.getAttribute("uv"),B=m.getAttribute("position");for(let U=0;U<q.count;U++)q.setXY(U,B.getX(U),B.getZ(U));m.setAttribute("aTan",new h.Float32BufferAttribute([1,0,0,1,0,0,1,0,0,1,0,0],3));const L=new h.Mesh(m,s.material({clearM:3,detail:1}));L.position.y=-.35,L.name="preview-sea",H.add(L)}const M=(m,q,B)=>new h.Vector3(m,q,B),x=i.p.clone(),C=r.clone().multiplyScalar(-1),D={worldPlacement:{position:M(-165,0,540),rotationY:Math.PI/2},portalSeat:{position:x,facing:C,direction:r.clone(),radius:7,hole:7.5},archAxis:{point:x.clone(),dir:r.clone(),waxY:x.y-2.4},flyThrough:[M(196,2.4,20),M(140,2.4,15),M(70,2.4,9.5),M(20,2.4,10.5),M(-25,2.5,22),M(-62,3.1,52),x.clone().addScaledVector(r,-70),x.clone().addScaledVector(r,-35),x.clone()],viewpoints:{wall:{eye:M(260,2.4,60),look:M(60,16,0)},face:{eye:M(70,2.4,9.5),look:M(52,9,-5)},lip:{eye:M(40,2.4,10),look:M(15,26,4)},arch:{eye:x.clone().addScaledVector(r,-42),look:x.clone()}},fringeLine:Array.from({length:41},(m,q)=>{const B={};return o.point(o.Ltot*(.03+.94*q/40),o.rows.findIndex(L=>L.thin===1),B,!1),M(B.x,B.y,B.z)}),footLine:(m,q=new h.Vector3)=>{const B=o.spine(_(m,0,o.Ltot),{});return q.set(B.x,0,B.z)},length:o.Ltot},I={center:M(50,11,0),radius:62,height:16},z=new h.Matrix3;return{object:H,radius:I.radius,height:I.height,center:I.center,anchors:D,style:s,fish:b,size:{length:o.Ltot,radius:230,height:o.Hmax},ground:!1,groundY:0,setProgress(m){w=m,t&&s.setFieldXf(-Math.PI/2,320*(m-T),0)},update(m,q){t&&s.update(q);for(let B=0;B<v;B++){const L=u[B],U=(q*.45+L[4]*7)/44,X=B<v-1?(U-Math.floor(U)-.5)*44:1.2*Math.sin(q*.19+L[4]);b.value[B].x=L[0]+X*L[3],b.value[B].y=L[1]+.22*Math.sin(q*.31+L[4]*2)-(B<v-1?4.5*(1-R(0,5,22-Math.abs(X))):0)}H.updateWorldMatrix(!0,!1),A.value.copy(i.p).applyMatrix4(H.matrixWorld),F.value.copy(i.d).applyMatrix3(z.setFromMatrix4(H.matrixWorld)).normalize()},dispose(){t&&p.uField.value.dispose()}}}export{ee as DRIP_DECL,Z as WAX_FIELD_GLSL,Q as WAX_PALETTE,ve as WAX_POST,re as WAX_SHADE_GLSL,le as WAX_WEED_GLSL,ie as bakeWaxField,be as buildHero,fe as createWaxStyle,Y as dripGeometry,me as instAttrs,J as waxNormals,ne as waxToScene};
