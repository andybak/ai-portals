import*as i from"three";const Ot=110,Dt=250,Ft=2,Gt=4,_t=8,Qe=f=>f-Math.PI*2*Math.round(f/(Math.PI*2)),Se=110,St=.25,na=14400,Et=2;function ft(f,c,s,I,r,n,v=Se){const w=k=>s*k+(I*k>0?Math.max(0,v-Math.abs(I)):v),C=w(f),x=w(-f),m=C>1?Math.max(0,n-r*f)/C:1/0;return(x>1?Math.max(0,n+r*f)/x:1/0)*c<m?-f:f}function Tt(f,c,s,I,r,n,v,w,C,x,m,b,k,L){const S=Math.hypot(n,v),y=S>.001?Math.atan2(v,n):0,F=f[c+1]>=1&&!L,G=F&&f[c+1]===2,re=r>.001?Math.atan2(I,s):F?f[c]:y+Math.PI,de=Math.max(r,x),ve=C+Ft,R=Math.sqrt(Math.max(0,ve*ve-b*b+r*r)),U=Math.min(1,Math.max(0,(w-S)/_t)),t=R+(Math.max(m,R)-R)*U*U*(3-2*U);let h=0;if(S>.001&&t>.001&&!(S>w&&r*r>S*S-w*w)){const $=(t*t+S*S-w*w)/(2*t*S);h=$>=1?0:Math.acos(Math.max(-1,$)),h>Math.PI-.05&&(h=Math.PI-.05),2*t*Math.sin(Math.min(h,Math.PI/2))<Gt&&(h=0)}const g=Qe(re-y),M=Math.abs(g)<h?(g>=0?1:-1)*h:g;let u=F?Qe(f[c]-y):M;Math.abs(u)<h&&(u=!G&&Math.abs(g)<h?M:(u>0||u===0&&g>=0?1:-1)*h);const ae=($,j)=>{let W=Qe(j-$);return h>0&&$>=0!=j>=0&&Math.abs($)+Math.abs(j)<Math.PI&&(W-=(W>=0?1:-1)*Math.PI*2),W};if(F&&k>0){const $=Math.max(Ot/de,Math.PI*Math.min(Math.hypot(s-f[c+2],I-f[c+3])/k,Dt)/m)*k,j=ae(u,M);u=Qe(u+Math.max(-$,Math.min($,j))),Math.abs(u)<h&&(u=(u>=0?1:-1)*h)}f[c]=y+u,f[c+1]=h>0&&Math.abs(u)<h+1e-6?2:1,f[c+2]=s,f[c+3]=I;const T=Math.min(1,Math.max(0,(b-x)/(m-x))),ee=1-T*T*(3-2*T);return y+g+ee*(Qe(M-g)+ae(M,u))}const Ut=["#F2F0EA","#C9D2DE","#2B55C8","#2A1B3D","#A11D1D","#E8552D","#C9A227"],Ke=16,mt=12,Ge=`
#define NW ${Ke}
#define NB ${mt}
uniform vec4 uWell[NW];   // x, z, depth D, half-width a   (h = D a^2 / (r^2 + a^2))
uniform vec4 uWellB[NW];  // pull (m of cloth drawn in), seated ball radius (0 none), seated ball centre y, folds 0..1
uniform vec4 uBall[NB];   // shadow casters: centre xyz, radius (0 = off)
uniform vec3 uL;          // unit vector toward the window
uniform vec4 uPatch;      // sewn patch: centre x, z, half size, grid angle (rad)
uniform vec2 uSeam;       // seam: plan z of the seam, 1 = on
uniform float uTime;
uniform vec2 uOrg;      // where the ruling's origin lies on the cloth
uniform vec4 uRip;      // the flick: direction x, z, offset along it (m), height (m)
uniform vec4 uHalfK;    // how much of the half rule (xy) and the quarter rule (zw) each family of lines shows (x, z: lines running along z; y, w: along x); the world turns down the family we cross at speed
float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx)*.1031); q += dot(q, q.yzx+33.33); return fract((q.x+q.y)*q.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
float sheetH(vec2 p){
  float rd = dot(p, uRip.xy) - uRip.z; float y = uRip.w*exp(-rd*rd*.0014);
  for (int i = 0; i < NW; i++){ vec4 w = uWell[i]; vec2 d = p - w.xy; float a2 = w.w*w.w; y -= w.z*a2/(dot(d,d)+a2+1e-3); }
  for (int i = 0; i < NW; i++){ vec4 w = uWell[i]; vec4 b = uWellB[i]; vec2 d = p - w.xy; float q = b.y*b.y - dot(d,d);
    if (q > 0.) y = min(y, b.z - sqrt(q) - .15); }
  return y;
}
vec3 sheetN(vec2 p){ float e = .6; float hx = sheetH(p+vec2(e,0.)) - sheetH(p-vec2(e,0.)); float hz = sheetH(p+vec2(0.,e)) - sheetH(p-vec2(0.,e));
  return normalize(vec3(-hx, 2.*e, -hz)); }
vec2 sheetM(vec2 p){
  vec2 m = p - uOrg;
  for (int i = 0; i < NW; i++){ vec4 w = uWell[i]; vec2 d = p - w.xy; float r = length(d); float a = max(w.w, 1.);
    m += d/max(r, 1e-3) * uWellB[i].x * (1.5708 - atan(r/a)); }
  return m;
}
// the same, and g: how many metres of ruling pass per metre of cloth across each family of lines (under 1 where a well has
// drawn the cloth out, over 1 where it has gathered it), so the pen keeps ONE width on the cloth however far it is stretched
vec2 sheetMG(vec2 p, out vec2 g){
  vec2 m = p - uOrg; vec2 r0 = vec2(1., 0.), r1 = vec2(0., 1.);
  for (int i = 0; i < NW; i++){ vec4 w = uWell[i]; vec2 d = p - w.xy; float r = max(length(d), 1e-3); float a = max(w.w, 1.); vec2 n = d/r;
    float f = uWellB[i].x*(1.5708 - atan(r/a)); float fr = f/r, fp = -uWellB[i].x*a/(r*r + a*a);
    m += n*f; float k = fp - fr;
    r0 += vec2(fr + k*n.x*n.x, k*n.x*n.y); r1 += vec2(k*n.x*n.y, fr + k*n.y*n.y); }
  g = vec2(length(r0), length(r1)); return m;
}
// one family of ruled lines: u across the lines, v along them. half = how much of the half rule (a thinner line
// midway between two ruled ones, so a cell is 20 m where the cloth is seen close) is drawn here
float ruleAxis(float u, float v, float fw, float seed, float half_, float quart, float g, float gv){
  g = clamp(g, .08, 3.);                                                                 // the stroke's width is a width on the cloth, not in the stretched ruling
  float j = floor(u/40. + .5);
  float id = j*7.31 + seed;
  float wob = (vn(vec2(v*.011 + id, id*1.7)) - .5)*.7 + (vn(vec2(v*.09, id)) - .5)*.12 + (h11(id) - .5)*.5;
  wob *= min(g, 1.);
  float du = u - j*40. + wob;
  float heavy = 1. - step(.25, abs(mod(j + .5, 5.) - .5));
  float w = mix(.8, 1.7, heavy)*g;
  float f = max(fw, 1e-3);
  float wv = max(w, f*mix(1.7, 2.6, heavy));                                             // never thinner than a pixel and a half
  float cov = clamp((min(du + .5*f, .5*wv) - max(du - .5*f, -.5*wv))/f, 0., 1.)*max(mix(.9, .96, heavy), w/wv);   // box filter
  float core = 1. - .3*(1. - smoothstep(.12*w, .34*w, abs(du)))*(1. - smoothstep(.1*w, .5*w, f));   // pale core, dark edges
  float along = smoothstep(.5, .75, gv);                                                  // (no skips where the cloth is drawn out along the line: a skip would stretch into a loose lozenge)
  float skip = smoothstep(.82, .86, vn(vec2(v*.1 + id*3.1, id)))*(1. - smoothstep(.5, 3., f/g))*along;     // the pen skipped
  float press = .9 + .1*vn(vec2(v*.02 - id, id*.3));
  cov *= core*(1. - skip)*press;
  // the half rule
  float j2 = floor(u/40.); float id2 = j2*5.17 + seed + 3.3;
  float du2 = u - j2*40. - 20. + ((vn(vec2(v*.013 + id2, id2*1.3)) - .5)*.8 + (h11(id2) - .5)*.6)*min(g, 1.);
  float wv2 = max(.5*g, f*1.5);
  float cov2 = clamp((min(du2 + .5*f, .5*wv2) - max(du2 - .5*f, -.5*wv2))/f, 0., 1.)*max(.85, .5*g/wv2);
  cov2 *= (1. - smoothstep(.84, .88, vn(vec2(v*.1 + id2*3.1, id2)))*(1. - smoothstep(.5, 3., f/g))*along)*half_;
  cov = max(cov, cov2);
  // the quarter rule: a hair of the same pen every 10 m, seen only from very close
  float j3 = floor(u/20.); float id3 = j3*3.71 + seed + 9.1;
  float du3 = u - j3*20. - 10. + ((vn(vec2(v*.017 + id3, id3*1.1)) - .5)*.6 + (h11(id3) - .5)*.5)*min(g, 1.);
  float wv3 = max(.3*g, f*1.3);
  float cov3 = clamp((min(du3 + .5*f, .5*wv3) - max(du3 - .5*f, -.5*wv3))/f, 0., 1.)*max(.7, .3*g/wv3)*.8;
  cov = max(cov, cov3*quart*(1. - smoothstep(.8, .86, vn(vec2(v*.13 + id3*2.3, id3)))*along));
  float k = 1. + heavy;                                                                  // heavy lines survive twice as far
  return mix(cov, mix(.2, .34, heavy), smoothstep(40./12.*k, 40./6.*k, f));                         // under six pixels a cell: even wash
}
// xy: ink coverage, (pencil dots: none; the demonstrator's pencil is rubbed out)
vec2 sheetInk(vec2 m, vec2 fw, vec2 g){
  float half_ = 1. - smoothstep(.34, .72, sqrt(max(fw.x*fw.y, 1e-6)));    // the half rule shows where a 20 m cell is seen large
  float quart = 1. - smoothstep(.11, .27, sqrt(max(fw.x*fw.y, 1e-6)));
  float ax = ruleAxis(m.x, m.y, fw.x, 0., half_*uHalfK.x, quart*uHalfK.z, g.x, g.y);
  float az = ruleAxis(m.y, m.x, fw.y, 51.7, half_*uHalfK.y, quart*uHalfK.w, g.y, g.x);
  return vec2(1. - (1. - ax)*(1. - az), 0.);
}
vec2 sheetInk(vec2 m, vec2 fw){ return sheetInk(m, fw, vec2(1.)); }
// TWO FLAT TONES. sheetShade is signed: above 0 lit, below 0 shade, about a metre per unit, so a material that has
// derivatives can cut it to an edge a pixel and a half wide however far a shadow has run (the cloth does), and one that has
// none uses sheetLit (a fixed edge of 0.6 m). Ball shadows: the ray to the window against each sphere, one long lozenge per
// ball that bends into any dip it crosses. The cloth's own shade is the side of a dip turned from the window, from the
// surface normal: the light stands low for a shallow dip, so each has its crescent, and higher down in a deep well, so
// the great well is a crescent too and never a pit of shade. No march, no penumbra.
float sheetSelf(vec3 P){
  vec3 n = sheetN(P.xz);
  vec2 lh = normalize(uL.xz + vec2(1e-5, 0.));
  float rise = -dot(n.xz, lh)/max(n.y, .05);                       // metres the cloth climbs per metre toward the window
  // a ball's own dip keeps its crescent wherever it sits, also on the wall of a great well (where the light stands higher):
  // the part of the climb that belongs to the great wells (half-width 65 m and over) is taken off before the low threshold
  float big = 0.;
  for (int i = 0; i < NW; i++){ vec4 w = uWell[i]; vec2 d = P.xz - w.xy; float a2 = w.w*w.w, q = dot(d, d) + a2;
    big += step(65., w.w)*2.*w.z*a2*dot(d, lh)/(q*q); }
  return min(mix(.15, .45, smoothstep(8., 70., -P.y)) - rise, .15 - (rise - max(big, 0.)));
}
float sheetShade(vec3 P, float selfShadow){
  float v = 1e3;
  for (int i = 0; i < NB; i++){ vec4 b = uBall[i]; vec3 oc = b.xyz - P; float t = dot(oc, uL);
    float d = sqrt(max(dot(oc,oc) - t*t, 0.));
    v = min(v, mix(1e3, max(d - b.w*1.16, -t), step(.5, b.w))); }
  if (selfShadow > .5) v = min(v, sheetSelf(P)*40.);
  return v;
}
float sheetLit(vec3 P, float selfShadow){ return clamp(.5 + sheetShade(P, selfShadow)/.6, 0., 1.); }
`,jt=`
${Ge}
varying vec3 vP;
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.);
  wp.y += sheetH(wp.xz);
  vP = wp.xyz;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,Ht=`
${Ge}
uniform vec3 cCloth, cShade, cInk, cPlum;
varying vec3 vP;
void main(){
  vec2 p = vP.xz;
  vec2 gm; vec2 m = sheetMG(p, gm);
  // the sewn patch: its own ruling, a few degrees off true
  vec2 pd = m - uPatch.xy; float inPatch = step(max(abs(pd.x), abs(pd.y)), uPatch.z)*step(.5, uPatch.z);
  float ca = cos(uPatch.w), sa = sin(uPatch.w);
  vec2 mr = mix(m, uPatch.xy + mat2(ca, -sa, sa, ca)*pd + vec2(13., 7.), inPatch);
  vec2 fw = fwidth(m) * 1.0;
  float edgeD = abs(max(abs(pd.x), abs(pd.y)) - uPatch.z);            // distance to the patch hem
  float fwm = max(fw.x, fw.y);
  vec2 ink = sheetInk(mr, fw, gm);
  // two flat tones and one edge, a pixel and a half wide
  float sv = sheetShade(vP, 1.);
  // the flick: the whole side of the ripple turned from the window is in shade, one straight band crossing the sheet
  float rdd = dot(p, uRip.xy) - uRip.z;
  float rsl = -uRip.w*exp(-rdd*rdd*.0014)*rdd*.0028*dot(uRip.xy, normalize(uL.xz + vec2(1e-5, 0.)));
  sv = min(sv, (.02 - rsl)*300.);
  float lit = clamp(.5 + sv/(1.5*fwidth(sv) + 1e-4), 0., 1.);
  vec3 cSh = clamp(cShade + (cShade - cCloth)*.42, 0., 1.);       // shade on the cloth: a step deeper than the room's tone
  vec3 tone = mix(cSh, cCloth, lit);
  // tension creases running downhill on every slope: thin strokes of shade tone, crisp on one side, each its own length;
  // no fixed period (their places round a dip are jittered and they never quite settle)
  float fwp = max(length(dFdx(vP)), length(dFdy(vP))) + 1e-4;         // metres a pixel covers here
  float wr = 0., fold = 0.;
  for (int i = 0; i < NW; i++){ vec4 w = uWell[i]; vec2 d = p - w.xy + vec2(1e-3, 0.); float r2 = dot(d,d); float r = sqrt(r2); float a2 = w.w*w.w;
    float slope = 2.*w.z*a2*r/((r2+a2)*(r2+a2) + 1.);
    float nc = 2.*floor(9. + w.w*.16);
    float ang = atan(d.y, d.x)/6.2832;
    float t = ang*nc + float(i)*.37;
    float c = floor(t); float hs = h11(c + float(i)*17.3), hl = h11(c*3.1 + float(i)*5.9);
    float dm = (t - c - .5 - (hs - .5)*.55 - .05*sin(uTime*.7 + c*1.9))*6.2832/nc*r;      // metres from the crease
    float hw = max(.16, .9*fwp);
    float line = (1. - smoothstep(hw, hw + fwp, dm))*smoothstep(-hw - .35*fwp, -hw, dm);
    float thr = mix(.07, .22, hl);
    wr = max(wr, line*smoothstep(thr, thr*1.2, slope)*step(.45, h11(c*5.7 + float(i)*1.3))*step(uWellB[i].y + 1., r));
    // pulled folds: a well that has just taken more weight (uWellB.w) draws a few long tapered wedges of shade down its wall
    float tf = ang*13. + float(i)*.61; float cf = floor(tf); float hf = h11(cf*2.3 + float(i)*7.1);
    float dmf = (tf - cf - .5 - (hf - .5)*.5)*6.2832/13.*r;
    float wf = (1.6 + 1.6*hf)*smoothstep(w.w*1.08, w.w*1.5, r)*(1. - smoothstep(w.w*(1.7 + .6*hf), w.w*(2.5 + hf), r))*uWellB[i].w;
    fold = max(fold, (1. - smoothstep(wf - fwp, wf + fwp, abs(dmf) + (1. - step(.02, wf))*1e3))); }
  tone = mix(tone, cSh, wr*lit*(1. - smoothstep(1.2, 2.6, fwp)));
  tone = mix(tone, cSh, fold*lit);
  // contact smudge under every large ball
  float sm = 0.;
  for (int i = 0; i < NB; i++){ vec4 b = uBall[i]; float g = length(vP - b.xyz) - b.w;
    sm = max(sm, (1. - smoothstep(0., .3*b.w + .01, g))*step(.5, b.w)); }
  tone = mix(tone, cPlum, sm*sm*.5);
  // the seam: a double row of thread stitches; the patch hem
  float sz = abs(abs(m.y - uSeam.x) - 5.);
  float dash = step(.42, fract(m.x/7. + .3*vn(vec2(m.x*.02, 3.))));
  float st = (1. - smoothstep(.22, .22 + fwm + .05, sz))*dash*uSeam.y*(1. - smoothstep(1., 4., fwm));
  float hemDash = step(.4, fract((pd.x + pd.y)/5.));
  st = max(st, (1. - smoothstep(.25, .3 + fwm, abs(edgeD - 1.6)))*hemDash*step(.5, uPatch.z)*step(max(abs(pd.x), abs(pd.y)), uPatch.z)*(1. - smoothstep(1., 4., fwm)));
  tone = mix(tone, mix(cShade, cPlum, .1), (1. - smoothstep(.0, .5 + fwm, edgeD))*.6*step(.5, uPatch.z));   // hem's thin shadow
  tone = mix(tone, mix(cCloth, cShade, lit*.9 + .0)*.97, st*.75);
  // pencil dots, then ballpoint on top: shadow never darkens the ballpoint
  vec3 col = mix(tone, cInk, clamp(ink.x, 0., 1.));
  gl_FragColor = vec4(col, 1.);
}`,$t=`
varying vec3 vD;
void main(){ vD = position; vec4 p = projectionMatrix*viewMatrix*vec4(position + cameraPosition, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,Kt=`
uniform vec3 cCloth, cShade, cPlum, cWhite, cOrange, cRed, cBrass, uL; uniform float uClock, uTime;   // (uClock: the hour the clock's hands show; uTime sweeps its second hand)
uniform vec4 uWin, uWin2;   // azimuth of patch centre (rad, 0 = -X wall, + toward +Z), elevation, lean, creep (uWin2: a second window's light, .w = how many times taller, 0 = none)
varying vec3 vD;
vec2 winUV(vec3 d, vec4 wn, float hs){
  float az0 = wn.x + wn.w, el0 = wn.y - wn.w*.35;
  float ca = cos(az0), sa = sin(az0), ce = cos(el0), se = sin(el0);
  vec3 c = vec3(-ca*ce, se, sa*ce), r = vec3(sa, 0., ca), up = vec3(ca*se, ce, -sa*se);
  float f = dot(d, c); vec2 q = vec2(dot(d, r), dot(d, up))/max(f, .05);
  return f > .05 ? vec2((q.x - wn.z*q.y)/.365, q.y/(.1226*hs)) : vec2(9.);    // 40 degrees wide, 14 tall, leaning
}
float panes(vec2 w, vec2 f){
  float inside = (1. - smoothstep(1. - f.x, 1. + f.x, abs(w.x)))*(1. - smoothstep(1. - f.y, 1. + f.y, abs(w.y)));
  // glazing bars in shade tone: three upright, two across
  float bu = min(min(abs(w.x + .5), abs(w.x)), abs(w.x - .5));
  float bv = min(abs(w.y + .333), abs(w.y - .333));
  float bars = max(1. - smoothstep(.022, .022 + 2.*f.x, bu), 1. - smoothstep(.05, .05 + 2.*f.y, bv));
  return inside*(1. - bars);
}
// (round classroom) a thing on the wall at azimuth az and elevation el lies in its own flat plane, as the window's light does:
// xy = its plane's coordinates (x toward greater azimuth, y up), z = 1 where the plane is in front of us
vec3 wallQ(vec3 d, float az, float el, out vec3 c, out vec3 r, out vec3 up){
  float ca = cos(az), sa = sin(az), ce = cos(el), se = sin(el);
  c = vec3(-ca*ce, se, sa*ce); r = vec3(sa, 0., ca); up = vec3(ca*se, ce, -sa*se);
  float f = dot(d, c); return vec3(vec2(dot(d, r), dot(d, up))/max(f, .05), step(.05, f));
}
float chalk(float dist, float w, float fw){ return 1. - smoothstep(w - fw, w + fw, dist); }
float slab(vec2 p, vec2 b, float fw){ vec2 a = abs(p) - b; return 1. - smoothstep(-fw, fw, max(a.x, a.y)); }
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba*clamp(dot(pa, ba)/dot(ba, ba), 0., 1.)); }
// a spare ball on the shelf: a flat disc in its two tones, lit from where the cloth's light comes
vec3 spare(vec3 col, vec2 sp, float fw, vec3 c, vec3 r, vec3 up, float x, float rad, vec3 lit, float on){
  vec2 o = (sp - vec2(x, rad))/rad; float m = (1. - smoothstep(1. - fw/rad, 1. + fw/rad, length(o)))*on;
  vec3 n = o.x*r + o.y*up - sqrt(max(1. - dot(o, o), 0.))*c;
  return mix(col, mix(mix(lit, cPlum, .55), lit, smoothstep(-.05, .05, dot(n, uL))), m);
}
void main(){
  vec3 d = normalize(vD + vec3(0., 1e-5, 0.));
  // each a flat leaning parallelogram on the wall: its edges and bars are straight lines (derivatives taken here, outside any branch)
  vec2 w1 = winUV(d, uWin, 1.), w2 = winUV(d, vec4(uWin2.xyz, uWin.w), max(uWin2.w, .1));
  vec2 f1 = min(fwidth(w1), vec2(.2)) + 1e-4, f2 = min(fwidth(w2), vec2(.2)) + 1e-4;      // (the clamp keeps the seam far behind clean)
  float lightK = max(panes(w1, f1), panes(w2, f2)*step(.05, uWin2.w));
  // (round classroom) every coordinate and its derivative is taken here, outside any branch; below, each thing is drawn only
  // inside its own box on the wall (outside that box every one of its terms is nought), so most pixels do none of its work
  vec3 bc, br, bu, sc, sr, su, kc, kr, ku;
  vec3 bq = wallQ(d, uWin2.x + .65, .166, bc, br, bu);       // the blackboard: 37 degrees left of the second window's light, its tray lying over the rail
  vec3 sq = wallQ(d, uWin.x - .75, .1, sc, sr, su);          // the shelf: 43 degrees right of the first window's light
  vec3 kq = wallQ(d, uWin.x + .52, .135, kc, kr, ku);        // the clock: 30 degrees left of it, low on the wall
  vec2 bp = bq.xy/.1, sp = sq.xy, kp = kq.xy/.045;          // (the board's half sizes are 2.35 by 1 in bp; the clock's face is the unit disc in kp)
  float bf = min(length(fwidth(bp)), .3)*.7 + 1e-4, sf = min(length(fwidth(sp)), .05)*.7 + 1e-5, kf = min(length(fwidth(kp)), .5)*.7 + 1e-4;
  float ef = min(fwidth(d.y), .02) + 1e-5;
  vec3 lineC = mix(cShade, cPlum, .24), col = cShade;
  // the wainscot: a darker band along the foot of the wall, under its rail
  col = mix(col, mix(cShade, cPlum, .15), 1. - smoothstep(.046 - ef, .046 + ef, d.y));
  col = mix(col, lineC, chalk(abs(d.y - .049), .003, ef));
  // the blackboard: plum-black in a brass frame, a tray under it with two chalks and the felt
  float onB = bq.z;
  if (onB > .5 && abs(bp.x) < 2.9 && bp.y > -1.5 && bp.y < 1.4) {
  col = mix(col, cBrass, slab(bp, vec2(2.43, 1.08), bf)*onB);
  vec3 boardC = mix(cPlum, cShade, .1);
  col = mix(col, boardC, slab(bp, vec2(2.35, 1.), bf)*onB);
  col = mix(col, lineC, slab(bp - vec2(0., -1.17), vec2(2.55, .05), bf)*onB);
  col = mix(col, cWhite, max(slab(bp - vec2(1.0, -1.085), vec2(.1, .03), bf), slab(bp - vec2(.62, -1.085), vec2(.07, .03), bf))*onB);
  col = mix(col, mix(cShade, cPlum, .5), slab(bp - vec2(-1.3, -1.07), vec2(.17, .05), bf)*onB);
  // the chalk: the well from above (rings, spokes, the heavy ball, one marble on its way round: a still dot), the sheet in section with the
  // ball in its dip over the dashed line where the cloth lay, an orbit, and three lines of the teacher's hand (no letter)
  float ch = 0., w = .024;
  { vec2 q = bp - vec2(1.28, .0); float ra = length(q), th = atan(q.y, q.x), dl = mod(th + .3927, .7854) - .3927;
    ch = max(ch, max(max(chalk(abs(ra - .2), w, bf), chalk(abs(ra - .46), w, bf)), chalk(abs(ra - .76), w, bf)));
    ch = max(ch, chalk(ra*abs(sin(dl)), w*.8, bf)*step(.2, ra)*(1. - step(.76, ra)));
    ch = max(ch, chalk(ra, .075, bf));
    ch = max(ch, chalk(length(q - .46*vec2(cos(2.2), sin(2.2))), .06, bf)); }
  { float x = bp.x + 1.22, tt = x/.3, ys = .46 - .98/(1. + tt*tt), sl = .98*2.*tt/(.3*(1. + tt*tt)*(1. + tt*tt));
    float inX = 1. - smoothstep(.86 - bf, .86 + bf, abs(x));
    ch = max(ch, chalk(abs(bp.y - ys)/sqrt(1. + sl*sl), w, bf)*inX);
    ch = max(ch, chalk(abs(bp.y - .46), w*.7, bf)*inX*step(.45, fract(x*3.5 + .2))*.8);
    ch = max(ch, chalk(length(vec2(x, bp.y + .33)), .185, bf)); }
  { vec2 q = (bp - vec2(.02, -.5))/vec2(.5, .26);
    ch = max(ch, chalk(abs(length(q) - 1.)*.26, w, bf));
    ch = max(ch, chalk(length(bp - vec2(-.2, -.5)), .06, bf));
    ch = max(ch, chalk(length(bp - vec2(.02 + .5*cos(.9), -.5 + .26*sin(.9))), .045, bf));
    ch = max(ch, chalk(abs(bp.y - .62 - .035*sin(bp.x*36.)), w*.75, bf)*slab(bp - vec2(.03, .62), vec2(.45, .2), bf));
    ch = max(ch, chalk(abs(bp.y - .36 - .035*sin(bp.x*33. + 2.)), w*.75, bf)*slab(bp - vec2(-.05, .36), vec2(.37, .2), bf));
    ch = max(ch, chalk(abs(bp.y - .1 - .035*sin(bp.x*39. + 4.)), w*.75, bf)*slab(bp - vec2(.11, .1), vec2(.27, .2), bf)); }
  col = mix(col, cWhite, ch*.9*slab(bp, vec2(2.3, .96), bf)*onB);
  }
  // the shelf of spare balls: a plank on two brackets, and the kit's balls on it, each in its own two tones
  float onS = sq.z;
  if (onS > .5 && abs(sp.x) < .33 && sp.y > -.08 && sp.y < .13) {
  col = mix(col, lineC, max(slab(sp - vec2(0., -.005), vec2(.27, .005), sf), max(slab(sp - vec2(.17, -.022), vec2(.005, .013), sf), slab(sp - vec2(-.17, -.022), vec2(.005, .013), sf)))*onS);
  col = spare(col, sp, sf, sc, sr, su, -.215, .036, cRed, onS);
  col = spare(col, sp, sf, sc, sr, su, -.145, .02, cWhite, onS);
  col = spare(col, sp, sf, sc, sr, su, -.085, .029, cOrange, onS);
  col = spare(col, sp, sf, sc, sr, su, -.005, .042, mix(cPlum, cShade, .12), onS);
  col = spare(col, sp, sf, sc, sr, su, .065, .019, cBrass, onS);
  col = spare(col, sp, sf, sc, sr, su, .125, .031, cWhite, onS);
  col = spare(col, sp, sf, sc, sr, su, .2, .024, cOrange, onS);
  }
  // the clock: a face of the kit's white in a rim, twelve marks, two hands at the hour and a second hand in the kit's ball colour (red; navy on biro)
  // going round (screen right is toward lesser azimuth)
  float onK = kq.z;
  if (onK > .5 && dot(kp, kp) < 2.6) {
  float kr0 = length(kp), ka = atan(-kp.x, kp.y);
  col = mix(col, lineC, chalk(kr0, 1.14, kf)*onK);
  col = mix(col, cWhite, chalk(kr0, 1., kf)*onK);
  { float tk = abs(fract(ka*1.9099 + .5) - .5)*.5236*kr0;
    col = mix(col, lineC, chalk(tk, .035, kf)*step(.78, kr0)*(1. - step(.93, kr0))*onK);
    float ah = uClock*.5236, am = fract(uClock)*6.2832;
    col = mix(col, cPlum, max(chalk(seg(kp, vec2(0.), .5*vec2(-sin(ah), cos(ah))), .07, kf), chalk(seg(kp, vec2(0.), .8*vec2(-sin(am), cos(am))), .045, kf))*onK);
    float as = uTime*.10472;
    col = mix(col, cRed, chalk(seg(kp, .18*vec2(sin(as), -cos(as)), .84*vec2(-sin(as), cos(as))), .022, kf)*onK);
    col = mix(col, cPlum, chalk(kr0, .09, kf)*onK); }
  }
  gl_FragColor = vec4(mix(col, cCloth, lightK), 1.);
}`,dt=`
uniform vec3 cCloth, cShade, cInk, cPlum, cWhite;
float sheetHit(vec3 o, vec3 d){
  float t = 3., tp = 0., hp = max(o.y - sheetH(o.xz), 0.);
  for (int k = 0; k < 16; k++){ vec3 q = o + d*t; float h = q.y - sheetH(q.xz);
    if (h < 0.) return mix(tp, t, hp/max(hp - h, 1e-4));
    tp = t; hp = h; t *= 1.42; }
  return -1.;
}
vec3 sheetCol(vec3 q, float fw){
  vec2 ink = sheetInk(sheetM(q.xz), vec2(fw));
  float lit = clamp(.5 + sheetShade(q, 1.)/max(1.5*fw, .3), 0., 1.);
  return mix(mix(clamp(cShade + (cShade - cCloth)*.42, 0., 1.), cCloth, lit), cInk, clamp(ink.x, 0., 1.));
}
float windowQuad(vec3 d){
  vec3 r = normalize(cross(vec3(0., 1., 0.), uL)); vec3 u = cross(uL, r);
  float f = dot(d, uL); vec2 q = vec2(dot(d, r), dot(d, u))/max(f, 1e-3);
  q.x += q.y*.25; q /= vec2(.36, .22);
  float inside = step(.05, f)*(1. - smoothstep(.93, 1., abs(q.x)))*(1. - smoothstep(.9, 1., abs(q.y)));
  float bars = max(1. - smoothstep(.05, .09, min(min(abs(q.x + .5), abs(q.x)), abs(q.x - .5))),
                   1. - smoothstep(.08, .14, min(abs(q.y + .333), abs(q.y - .333))));
  return inside*(1. - bars);
}
// the window's light lying on the wall of the room (the same patch the room draws), for the gloss and the glass
uniform vec4 uWin, uWin2;
vec2 winUV(vec3 d, vec4 wn, float hs){
  float az0 = wn.x + wn.w, el0 = wn.y - wn.w*.35;
  float ca = cos(az0), sa = sin(az0), ce = cos(el0), se = sin(el0);
  vec3 c = vec3(-ca*ce, se, sa*ce), r = vec3(sa, 0., ca), up = vec3(ca*se, ce, -sa*se);
  float f = dot(d, c); vec2 q = vec2(dot(d, r), dot(d, up))/max(f, .05);
  return f > .05 ? vec2((q.x - wn.z*q.y)/.365, q.y/(.1226*hs)) : vec2(9.);    // 40 degrees wide, 14 tall, leaning
}
float wallPatch1(vec3 d, vec4 wn, float hs){
  vec2 wuv = winUV(d, wn, hs); float u = wuv.x, v = wuv.y;
  float inside = (1. - smoothstep(.97, 1.03, abs(u)))*(1. - smoothstep(.94, 1.06, abs(v)));
  float bu = min(min(abs(u + .5), abs(u)), abs(u - .5)), bv = min(abs(v + .333), abs(v - .333));
  return inside*(1. - max(1. - smoothstep(.022, .05, bu), 1. - smoothstep(.05, .1, bv)));
}
float wallPatch(vec3 d){ return max(wallPatch1(d, uWin, 1.), wallPatch1(d, vec4(uWin2.xyz, uWin.w), max(uWin2.w, .1))*step(.05, uWin2.w)); }
vec3 roomCol(vec3 d){ return mix(cShade, cWhite, max(windowQuad(d), wallPatch(d))); }
`,Yt=`
varying vec3 vP, vN, vO;
void main(){
  vO = position; vec4 wp = vec4(position, 1.); vec3 n = normal;
  #ifdef USE_INSTANCING
    wp = instanceMatrix*wp; n = mat3(instanceMatrix)*n;
  #endif
  wp = modelMatrix*wp; vP = wp.xyz; vN = mat3(modelMatrix)*n;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,Qt=(f="",c="",s=!1,I="")=>`
${Ge}
${s?dt:""}
${I}
uniform vec3 cLit, cShd; uniform float uEdge; uniform vec4 uAux;
varying vec3 vP, vN, vO;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-6, 0.)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(vP - cameraPosition + vec3(0., 1e-6, 0.));
  float tone = smoothstep(-uEdge, uEdge, dot(N, uL));
  vec3 lit = cLit, shd = cShd;
  ${f}
  vec3 col = mix(shd, lit, clamp(tone, 0., 1.));
  ${c}
  gl_FragColor = vec4(col, 1.);
}`,Xt=`
  vec3 o = vO/90.;
  vec2 sw = vec2(o.x + o.y*.6, o.z - o.y*.4)*2.2 + uAux.xy;
  sw += 1.6*vec2(vn(sw*1.3 + 4.), vn(sw*1.3 + 17.));
  sw += .8*vec2(vn(sw*2.1 + 31.), vn(sw*2.1 + 9.));
  float sv = vn(sw*1.4); float sf = fwidth(sv) + 1e-4;
  float swirl = smoothstep(.5 - sf, .5 + sf, sv);                     // marbling: a flat second plum with a crisp edge
  float pit = 1. - smoothstep(87.6, 89.2, length(vO));                    // inside a finger pit
  lit = mix(cLit, cLit*1.3, swirl*(1. - pit));
  shd = mix(cShd, cShd*1.4, swirl*(1. - pit));
  vec3 fwR3 = fwidth(V) + fwidth(N)*2.;
  float fwR = max(max(fwR3.x, fwR3.y), fwR3.z);
`,vt=10,Zt=`
#define NMIR ${vt}
uniform vec3 cOrange, cBrass;
uniform vec4 uMar[NMIR];   // glass marbles the mirror shows: centre xyz, radius (0 = none)
`,Jt=f=>`
  vec3 R = reflect(V, N);
  float th = sheetHit(vP + N*.3, R);
  float gl = 1. - pit;
  vec3 bc = vec3(uWell[${f}].x, uWellB[${f}].z, uWell[${f}].y);
  vec3 toCam = cameraPosition - bc;
  float high = smoothstep(150., 255., length(toCam));
  // (no branch round the derivatives: a ray that misses reads the cloth at the ball and is masked out)
  float hitW = step(0., th);
  vec3 q = vP + R*max(th, 0.);
  float graze = smoothstep(.04, .16, -dot(R, sheetN(q.xz)));   // where the reflected ray only grazes the cloth (the lip, far flat cloth) the net fades out: one clean soft end
  vec2 m = mix(q.xz - uOrg, sheetM(q.xz), .3);
  vec2 f = clamp(max(fwidth(m), vec2(fwR*max(th, 0.))), vec2(.05), vec2(60.));
  vec2 d = abs(fract(m/40. + .5) - .5)*40.;
  vec2 jl = floor(m/40. + .5);
  vec2 hv = vec2(1. - step(.25, abs(mod(jl.x + .5, 5.) - .5)), 1. - step(.25, abs(mod(jl.y + .5, 5.) - .5)));   // every fifth line heavier, as on the cloth
  vec2 hw = max(vec2(.3) + .3*hv, f*(.55 + .2*hv));
  vec2 ln = (1. - smoothstep(hw, hw + f, d))*(1. - smoothstep(vec2(3.5), vec2(8.) + 3.*hv, f));
  float net = max(ln.x, ln.y)*hitW*graze;
  col = mix(col, mix(cInk, cShade, .2), net*.92*gl);
  // the brass hoop: one thin line where the reflected sheet ends
  float fy = fwidth(R.y) + 1e-4;
  col = mix(col, cBrass, (1. - smoothstep(max(.004, fy), max(.004, fy) + fy, abs(R.y - .006)))*(1. - hitW)*gl*.85);
  // the marbles' orange passing across the gloss: a thin limb of glass and the twisted vane, never a ringed disc
  float msd = 9., mt = 0., mr = 1., mk = 0.; vec3 mo = vec3(0., 1., 0.);
  for (int i = 0; i < NMIR; i++){ vec4 mb = uMar[i]; vec3 oc = mb.xyz - vP; float tc = dot(oc, R);
    float sd = sqrt(max(dot(oc, oc) - tc*tc, 0.))/max(mb.w, 1e-3);
    if (mb.w > .01 && tc > 0. && sd < msd){ msd = sd; mt = tc; mo = oc - tc*R; mr = mb.w; mk = fract(mb.w*7.31)*10.; } }
  float mfw = min(fwidth(msd), .3) + 1e-3;
  float seen = (1. - smoothstep(1. - mfw, 1. + mfw, msd))*step(mt, mix(1e5, th + 12., hitW))*gl;
  vec3 e1 = normalize(cross(R, vec3(.31, .9, .3)) + vec3(1e-5, 0., 0.)), e2 = cross(R, e1);
  float va = mk*2.4 + uTime*.6; vec2 vq = vec2(dot(mo, e1), dot(mo, e2))/max(mr, 1e-3);
  vq = mat2(cos(va), -sin(va), sin(va), cos(va))*vq;
  float vane = (1. - smoothstep(.3 - mfw, .3 + mfw, abs(vq.y - .34*sin(vq.x*3.4 + mk))*(1. + .7*vq.x*vq.x)))*(1. - smoothstep(.8 - mfw, .8 + mfw, abs(vq.x)));
  float limb = smoothstep(.9 - mfw, .9 + mfw, msd)*smoothstep(-.2, .2, dot(normalize(mo + vec3(0., 1e-4, 0.)), uL));   // only the window-side crescent of its rim, never a ring
  col = mix(col, cWhite, seen*limb*.7);
  col = mix(col, cOrange, seen*vane);
  col = mix(col, cWhite, max(windowQuad(R), wallPatch(R)*.9)*(1. - hitW)*(1. - seen)*gl);
  float rimE = 1. - abs(dot(N, V)); float rimF = fwidth(rimE) + 1e-4;
  col = mix(col, cLit*1.6 + .004, smoothstep(.8 - rimF, .8 + rimF, rimE)*(1. - tone)*(1. - high)*gl);   // reflected light along the shaded limb
  col = mix(col, cShd*.8, pit*(1. - tone)*.6);
`,Wt=`
varying vec3 vP, vC; varying float vR;
void main(){
  mat4 im = mat4(1.);
  #ifdef USE_INSTANCING
    im = instanceMatrix;
  #endif
  vec4 wp = modelMatrix*im*vec4(position, 1.);
  vP = wp.xyz; vC = (modelMatrix*im*vec4(0., 0., 0., 1.)).xyz; vR = length((modelMatrix*im*vec4(1., 0., 0., 0.)).xyz);
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,At=`
${Ge}
${dt}
uniform vec3 cLimb; uniform vec4 cTint;
varying vec3 vP, vC; varying float vR;
void main(){
  vec3 V = normalize(vP - cameraPosition + vec3(0., 1e-6, 0.));
  vec3 oc = cameraPosition - vC; float b = dot(oc, V);
  float tF = -b - sqrt(max(b*b - dot(oc, oc) + vR*vR, 0.));
  vec3 Nf = normalize(cameraPosition + V*tF - vC + vec3(0., 1e-5, 0.));
  vec3 perp = Nf - dot(Nf, V)*V; float rim = length(perp);
  float fr = fwidth(rim) + 1e-4;
  float lt = smoothstep(-.03, .03, dot(Nf, uL));
  float ring = smoothstep(.85 - fr, .85 + fr, rim);
  float wq = windowQuad(reflect(V, Nf));
  vec3 rimCol = mix(cShade, cWhite, max(lt, wq));
  // a drawn ball on any ground: one thin limb line all the way round, the window-side crescent of white inside it
  float limb = smoothstep(.955 - fr, .955 + fr, rim)*(1. - wq);
  rimCol = mix(rimCol, cLimb, limb);
  #ifdef RIM
    float al = max(ring, wq);
    if (al < .02) discard;
    gl_FragColor = vec4(rimCol, al);
  #else
    vec3 D = normalize(V - 2.1*perp);                         // glass inverts what is behind it: the room as a cap in its lower third
    vec3 fD3 = fwidth(D); float fD = max(max(fD3.x, fD3.y), fD3.z);
    float th = sheetHit(vC, D);
    vec3 col = roomCol(D);
    if (th > 0.) col = sheetCol(vC + D*th, clamp(fD*th*1.5, .5, 40.));
    col = mix(col, cTint.rgb, cTint.a);                       // the glass holds a tone of its own, a little under the lit cloth
    col = mix(col, rimCol, max(ring, wq));
    gl_FragColor = vec4(col, 1.);
  #endif
}`,ea=`
${Ge}
varying vec2 vUv; varying vec3 vW; varying float vR;
void main(){
  mat4 im = mat4(1.);
  #ifdef USE_INSTANCING
    im = instanceMatrix;
  #endif
  vec3 c = (modelMatrix*im*vec4(0., 0., 0., 1.)).xyz; float R = length((modelMatrix*im*vec4(1., 0., 0., 0.)).xyz);
  vec2 s = -normalize(uL.xz + vec2(1e-5, 0.)); vec2 t = vec2(-s.y, s.x);
  vec2 xz = c.xz + s*(position.x + .4)*R*7.5 + t*position.y*R*2.8;
  vec3 wp = vec3(xz.x, sheetH(xz) + .12, xz.y);
  vUv = position.xy; vW = wp; vR = R;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.);
}`,ta=`
${Ge}
uniform vec3 cCloth, cShade, cInk, cPlum, cOrange;
varying vec2 vUv; varying vec3 vW; varying float vR;
void main(){
  float a = (vUv.x + .4)*7.5, b = vUv.y*2.8;                    // in marble radii: along the shadow, across it
  float sl = length(vec2((a - 2.6)/3.3, b*1.1)); float se = 1.5*fwidth(sl) + 1e-4;
  float sh = 1. - smoothstep(1. - se, 1. + se, sl);
  float sv = sheetShade(vW, 1.); float facing = clamp(.5 + sv/(1.5*fwidth(sv) + 1e-4), 0., 1.);   // only lit cloth takes a shadow
  float contact = 1. - smoothstep(.15, 1.1, length(vec2(a, b)));
  float spot = (1. - smoothstep(.5, 1., length(vec2((a - 3.1)/.9, b/.42))))*facing;
  vec3 col = mix(clamp(cShade + (cShade - cCloth)*.42, 0., 1.), cPlum, contact*contact*.5);
  col = mix(col, mix(cCloth, cOrange, .3), spot);
  float al = max(sh*facing, contact*.9);
  vec2 m = sheetM(vW.xz); vec2 ink = sheetInk(m, fwidth(m));
  col = mix(col, cInk, clamp(ink.x, 0., 1.));
  if (al < .01) discard;
  gl_FragColor = vec4(col, al);
}`;function aa(f,c={}){const s=c.palette||Ut,I=t=>new i.Color(t),r={cloth:I(s[0]),shade:I(s[1]),ballpoint:I(s[2]),plum:I(s[3]),red:I(s[4]),orange:I(s[5]),brass:I(s[6])},n=c.hour||"four",v=(n==="golden"?11:18)*Math.PI/180,w=n==="dawn"?-1:1,C=new i.Vector3(w*Math.cos(v)*.97,Math.sin(v),Math.cos(v)*(w>0?.171:-.243)).normalize();c.lightDir&&C.copy(c.lightDir).normalize(),n==="night"&&(r.cloth=r.shade.clone().lerp(r.cloth,.12)),r.white=c.white?I(c.white):r.cloth,r.whiteShade=c.white?r.white.clone().lerp(r.plum,.5):r.shade.clone().lerp(r.plum,.2);const x=t=>Array.from({length:t},()=>new i.Vector4(0,0,0,1)),m={uWell:{value:x(Ke)},uWellB:{value:x(Ke)},uBall:{value:x(mt)},uL:{value:C},uPatch:{value:new i.Vector4(0,0,0,.07)},uSeam:{value:new i.Vector2(0,0)},uTime:{value:0},uRip:{value:new i.Vector4(1,0,0,0)},uHalfK:{value:new i.Vector4(1,1,1,1)},uOrg:{value:new i.Vector2(0,0)},cCloth:{value:r.cloth},cShade:{value:r.shade},cInk:{value:r.ballpoint},cPlum:{value:r.plum},cOrange:{value:r.orange},cWhite:{value:r.white},uWin:{value:new i.Vector4(.45,.27,.55,0)},uWin2:{value:new i.Vector4(-.8,.27,.55,0)}};for(let t=0;t<Ke;t++)m.uWell.value[t].set(0,0,0,1),m.uWellB.value[t].set(0,0,0,0);for(let t=0;t<mt;t++)m.uBall.value[t].set(0,-1e4,0,0);const b=(t={})=>({...m,...t}),k=(t,h,g,M={})=>new i.ShaderMaterial({vertexShader:t,fragmentShader:h,uniforms:b(g),...M}),L=(t,h,g,M,u,ae=.66*M,T=0,ee=0)=>{m.uWell.value[t].set(h,g,M,Math.max(u,1)),m.uWellB.value[t].set(ae,T,ee,0)},S=(t,h,g,M,u)=>m.uBall.value[t].set(h,g,M,u),y=(t,h)=>{const g=m.uRip.value,M=t*g.x+h*g.y-g.z;let u=g.w*Math.exp(-M*M*.0014);const ae=m.uWell.value,T=m.uWellB.value;for(let ee=0;ee<Ke;ee++){const $=ae[ee],j=t-$.x,W=h-$.y,le=$.w*$.w;u-=$.z*le/(j*j+W*W+le+.001)}for(let ee=0;ee<Ke;ee++){const $=ae[ee],j=T[ee],W=t-$.x,le=h-$.y,p=j.y*j.y-W*W-le*le;p>0&&(u=Math.min(u,j.z-Math.sqrt(p)-.15))}return u},F=(t,h,g=new i.Vector3)=>g.set(y(t-.6,h)-y(t+.6,h),2*.6,y(t,h-.6)-y(t,h+.6)).normalize(),G=k(jt,Ht,{},{side:i.DoubleSide}),re=(t={})=>{const h=t.radius??3e3,g=t.rings??200,M=t.sectors??300,u=(g+1)*M,ae=new Float32Array(u*3),T=new Uint32Array(g*M*6);for(let j=0,W=0;j<=g;j++){const le=j/g,p=h*(.04*le+.96*Math.pow(le,3.2));for(let P=0;P<M;P++,W+=3){const be=(P+(j&1)*.5)/M*Math.PI*2;ae[W]=Math.cos(be)*p,ae[W+2]=Math.sin(be)*p}}for(let j=0,W=0;j<g;j++)for(let le=0;le<M;le++,W+=6){const p=j*M+le,P=j*M+(le+1)%M,be=p+M,_e=P+M;j&1?(T[W]=p,T[W+1]=be,T[W+2]=P,T[W+3]=P,T[W+4]=be,T[W+5]=_e):(T[W]=p,T[W+1]=_e,T[W+2]=P,T[W+3]=p,T[W+4]=be,T[W+5]=_e)}const ee=new i.BufferGeometry;ee.setAttribute("position",new i.BufferAttribute(ae,3)),ee.setIndex(new i.BufferAttribute(T,1));const $=new i.Mesh(ee,G);return $.frustumCulled=!1,$.name="sheet",$},de=k($t,Kt,{cRed:{value:r.red},cBrass:{value:r.brass},uClock:{value:n==="golden"?5.75:n==="dawn"?6.5:n==="night"?8.5:4}},{side:i.BackSide,depthWrite:!1}),U={palette:r,uniforms:m,lightDir:C,glsl:{common:Ge,gloss:dt},setWell:L,setBall:S,heightAt:y,normalAt:F,sheetMaterial:G,makeSheet:re,roomMaterial:de,makeRoom:()=>{const t=new i.Mesh(new i.BoxGeometry(2,2,2),de);return t.frustumCulled=!1,t.renderOrder=-.5,t.name="room",t},ballMaterial:(t={})=>k(Yt,Qt(t.body||"",t.post||"",!!t.gloss,t.pre||""),{...t.uniforms||{},cLit:{value:t.lit||r.red},cShd:{value:t.shade||(t.lit||r.red).clone().lerp(r.plum,.55)},uEdge:{value:t.edge??.05},uAux:{value:t.aux||new i.Vector4}},{side:t.side??i.FrontSide}),shared:b,mk:k,update(t,h){m.uTime.value=h,m.uWin.value.w=Math.min(h/42,1.5)*.01745}};return U.makeMarbles=t=>oa(U,t),U.setRipple=(t,h,g,M)=>m.uRip.value.set(t,h,g,M),U}function oa(f,c){const s=f.palette,I=new i.Group;I.name="marbles";const r=new i.SphereGeometry(1,20,12),n=28,v=[],w=[];for(let R=0;R<=n;R++){const U=R/n*2-1,t=U*Math.PI*.85,h=.56*Math.sqrt(Math.max(1-U*U*.92,0));for(let g=-1;g<=1;g++)v.push(U*.74,Math.cos(t)*h*g,Math.sin(t)*h*g)}for(let R=0;R<n;R++)for(let U=0;U<2;U++){const t=R*3+U,h=t+3;w.push(t,h,t+1,t+1,h,h+1)}const C=new i.BufferGeometry;C.setAttribute("position",new i.Float32BufferAttribute(v,3)),C.setIndex(w),C.computeVertexNormals();const x=new i.PlaneGeometry(1,1,10,2),m=s.white!==s.cloth,b={value:m?s.white:s.shade.clone().lerp(s.plum,.3)},k={value:m?new i.Vector4(s.cloth.r,s.cloth.g,s.cloth.b,.1):new i.Vector4(s.shade.r,s.shade.g,s.shade.b,.32)},L=[f.mk(Wt,At,{cLimb:b,cTint:k},{side:i.BackSide}),f.ballMaterial({lit:s.orange,shade:s.orange.clone().lerp(s.plum,.32),edge:.08,side:i.DoubleSide}),f.mk(Wt,At,{cLimb:b,cTint:k},{side:i.FrontSide,transparent:!0,depthWrite:!1,defines:{RIM:1}}),f.mk(ea,ta,{},{transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})],S=[r,C,r,x],y=S.map((R,U)=>new i.InstancedMesh(R,L[U],c)),F=y[0].instanceMatrix;F.setUsage(i.DynamicDrawUsage),y.forEach((R,U)=>{R.instanceMatrix=F,R.frustumCulled=!1,R.renderOrder=[0,0,3,1][U],I.add(R)});const G=new i.Matrix4,re=new i.Vector3,de=new i.Vector3,ve=new i.Quaternion;for(let R=0;R<c;R++)G.compose(de.set(0,-1e4,0),ve,re.set(1,1,1)),G.toArray(F.array,R*16);return{group:I,count:c,meshes:y,set(R,U,t,h,g,M){G.compose(de.set(U,t,h),M||ve,re.set(g,g,g)),G.toArray(F.array,R*16)},commit(){F.needsUpdate=!0}}}async function sa(f,c=null){const s=f.attributes.position.array,I=f.index.array,r=new Float32Array(s.length);for(let n=0;n<I.length;n+=3){const v=I[n]*3,w=I[n+1]*3,C=I[n+2]*3,x=s[C]-s[w],m=s[C+1]-s[w+1],b=s[C+2]-s[w+2],k=s[v]-s[w],L=s[v+1]-s[w+1],S=s[v+2]-s[w+2],y=m*S-b*L,F=b*k-x*S,G=x*L-m*k;r[v]+=y,r[v+1]+=F,r[v+2]+=G,r[w]+=y,r[w+1]+=F,r[w+2]+=G,r[C]+=y,r[C+1]+=F,r[C+2]+=G,c&&n%6e3===5997&&await c()}for(let n=0;n<r.length;n+=3){const v=Math.hypot(r[n],r[n+1],r[n+2])||1;r[n]/=v,r[n+1]/=v,r[n+2]/=v}f.setAttribute("normal",new i.BufferAttribute(r,3))}async function Nt(f,c,s,I,r=1,n=null){const v=(c+1)*(s+1),w=new i.BufferGeometry,C=new i.BufferAttribute(new Float32Array(v*3),3),x=new Uint32Array(c*(2*s-2)*3);for(let b=0,k=0;b<s;b++){for(let L=0;L<c;L++){const S=b*(c+1)+L+1,y=S-1,F=y+c+1,G=F+1;b!==0&&(x[k++]=S,x[k++]=y,x[k++]=G),b!==s-1&&(x[k++]=y,x[k++]=F,x[k++]=G)}n&&b%16===15&&await n()}w.setAttribute("position",C),w.setIndex(new i.BufferAttribute(x,1)),n&&await n();for(let b=0;b<v;b++){const k=Math.floor(b/(c+1)),L=b%(c+1),S=Math.PI*Math.pow(k/s,r),y=L/c*Math.PI*2,F=-Math.cos(y)*Math.sin(S),G=Math.cos(S),re=Math.sin(y)*Math.sin(S),de=f-I(F,G,re);C.setXYZ(b,F*de,G*de,re*de),n&&b%800===799&&await n()}n&&await n(),await sa(w,n),n&&await n();const m=w.attributes.normal;for(let b=0;b<=s;b++){const k=b*(c+1),L=k+c,S=m.getX(k)+m.getX(L),y=m.getY(k)+m.getY(L),F=m.getZ(k)+m.getZ(L),G=Math.hypot(S,y,F)||1;m.setXYZ(k,S/G,y/G,F/G),m.setXYZ(L,S/G,y/G,F/G)}return w.computeBoundingSphere(),w}async function la(f,c,s=null){const r=[];for(let v=0;v<120;v++){const w=1-(v+.5)/60,C=Math.sqrt(1-w*w),x=v*2.39996;r.push(Math.cos(x)*C,w,Math.sin(x)*C)}const n=Math.cos(2.6/20);return Nt(20,f,c,(v,w,C)=>{let x=-1;for(let b=0;b<360;b+=3){const k=v*r[b]+w*r[b+1]+C*r[b+2];k>x&&(x=k)}if(x<n)return 0;const m=Math.acos(Math.min(1,x))*20/2.6;return .95*(1-m*m)},1,s)}const V={D:150,a:110,sink:35,pull:99,pullSink:55,ballR:90,ballY:-50,ballDrop:45,lip:280};async function ia(f,c={}){const s=f.rng,I=c.detail??f.quality?.detail??1,r=!c.style,n=c.style||aa(f,c),v=n.palette,w=c.wellIndex??0,C=c.ballIndex??0,x=new i.Group;x.name="great-well";const m=()=>f.yield?f.yield():Promise.resolve();n.setWell(w,0,0,V.D,V.a,V.pull,V.ballR,V.ballY),n.setBall(C,0,V.ballY,0,V.ballR);const b=s.range(0,Math.PI*2),k=new i.Vector4(s.range(0,40),s.range(0,40),0,0),L=Math.atan2(-160,230)+s.range(-.06,.06),S=c.golfStart?Math.atan2(c.golfStart[1],c.golfStart[0]):L+.12,y=c.golfStart?Math.hypot(c.golfStart[0],c.golfStart[1]):305;c.sheet!==!1&&(x.add(n.makeSheet({radius:3e3,rings:110,sectors:224})),await m()),c.room!==!1&&x.add(n.makeRoom());const F=[[.24,.55,9.5],[.24,-.55,9.5],[.31,Math.PI,11.5]].map(([o,e,N])=>({x:Math.sin(o)*Math.cos(e),y:Math.cos(o),z:Math.sin(o)*Math.sin(e),r:N})),G=await Nt(V.ballR,128,80,(o,e,N)=>{let z=0;for(const O of F){const ie=Math.acos(Math.min(1,o*O.x+e*O.y+N*O.z))*V.ballR;ie<O.r*1.15&&(z=Math.max(z,15*(1-f.core.smoothstep(O.r*.72,O.r*1.02,ie))))}return z},1.5,m);await m();const re=Array.from({length:vt},()=>new i.Vector4(0,-1e4,0,0)),de=n.ballMaterial({lit:v.plum.clone().multiplyScalar(1.75),shade:v.plum.clone().multiplyScalar(.62),edge:.09,body:Xt,post:Jt(w),pre:Zt,gloss:!0,aux:k,uniforms:{uMar:{value:re},cBrass:{value:v.brass}}}),ve=new i.Mesh(G,de);ve.name="bowling-ball",ve.rotation.order="YXZ",x.add(ve),await m();const R=20,U=await la(120,72,m);await m();const t=v.whiteShade,h=c.white||v.white!==v.cloth?v.white.clone().lerp(v.plum,.28):v.cloth.clone().lerp(v.shade,.85),g=n.ballMaterial({lit:v.white,shade:t,edge:.06,aux:new i.Vector4(h.r,h.g,h.b,0),body:"float dp = 1. - smoothstep(19.5, 19.86, length(vO)); lit = mix(lit, uAux.rgb, dp); shd = mix(shd, shd*.86, dp);"}),M=new i.Mesh(U,g);M.name="golf-ball",M.scale.setScalar(1e-5),x.add(M),await m();const u=Math.max(12,Math.round((c.marbles??40)*I)),ae=n.makeMarbles(u);x.add(ae.group);const T=[],ee=s.int(2,4),$=s.range(.3,.9),j=s.range(0,6.28);for(let o=0;o<u;o++){const e=s.chance(.45);T.push({inner:e,r:e?s.range(100,103.5):s.range(139,150),th:(o+s.range(-.38,.38))/u*Math.PI*2+$*.5*Math.sin(o/u*Math.PI*2*ee+j)/ee,R:s.range(5.4,6.4)*(e?.62:.88),q:new i.Quaternion().setFromEuler(new i.Euler(s.range(0,6.28),s.range(0,6.28),s.range(0,6.28))),k:s.range(.94,1.06)})}await m();const W=f.core.smoothstep,le=o=>Math.min(1,Math.max(0,o)),p=new i.Vector3,P=new i.Vector3,be=new i.Vector3,_e=new i.Quaternion,lt=new i.Quaternion,Ct=121.5,nt=c.lodgeTurn??0;let Ee=Math.cos(S),Te=Math.sin(S),Xe=S,Ze=0,it=!1;const oe=[],Je=new Float64Array(u);let we=1;const l=new Float64Array(u*14),et=[];let wt=NaN,ut=NaN,pt=0;const he=new Float32Array(u*4),Ye=new Float32Array(u),We=new Float64Array(u*3),ge=new Float64Array(u*3),Ae=new Float64Array(u*2),ct=Array.from({length:u},()=>new i.Quaternion),tt=new Uint8Array(u),Bt=3,rt=12,K=[0,0,0,0,0,0,0,0,0],xt=new Float64Array(u*4);let bt=NaN,gt=NaN,yt=NaN,Mt=NaN;const kt=()=>{for(let o=1;o<vt;o++){let e=-1,N=1e9;for(let z=0;z<u;z++)Ye[z]<N&&(N=Ye[z],e=z);if(e<0){re[o].set(0,-1e4,0,0);continue}re[o].set(he[e*4],he[e*4+1],he[e*4+2],he[e*4+3]),Ye[e]=1e9}},zt=o=>o-Math.PI*2*Math.round(o/(Math.PI*2));function Rt(o,e,N){const z=le(o/.65),O=W(.65,1,o),ie=W(0,.03,o);let fe=!(Math.abs(N-wt-e)<1e-4)||et.length!==oe.length||e===0&&o!==ut;for(let q=0;q<oe.length;q++)e===0&&et[q]!==oe[q]&&(fe=!0),et[q]=oe[q];et.length=oe.length,wt=N,ut=o,fe&&(l.fill(0),Je.fill(0));const Ne=fe?0:N+2.6*O-pt;pt=N+2.6*O;const d=V.ballY-V.ballDrop*O;x.updateWorldMatrix(!0,!1),p.setFromMatrixPosition(x.matrixWorld),n.setWell(w,p.x,p.z,V.D+V.sink*O,V.a,V.pull+V.pullSink*O,V.ballR,p.y+d),n.setBall(C,p.x,p.y+d,p.z,V.ballR),ve.position.set(0,d,0),ve.rotation.set(.06*Math.sin(Math.PI*O),b+N*.012,0),Xe=S+nt*z*z,Ee=Math.cos(Xe),Te=Math.sin(Xe);const te=y-(y-Ct)*Math.pow(z,1.9),Ce=p.x+Ee*te,ye=p.z+Te*te;n.setWell(w+1,Ce,ye,14*ie,30),n.normalAt(Ce,ye,P);const Oe=n.heightAt(Ce,ye),je=o>.001;M.scale.setScalar(je?1:1e-5),M.position.set(Ee*te+P.x*R,Oe+P.y*R-p.y,Te*te+P.z*R),M.quaternion.setFromAxisAngle(be.set(-Te,0,Ee).normalize(),(y-te)/R),n.setBall(C+1,Ce+P.x*R,Oe+P.y*R,ye+P.z*R,je?R:0);const De=ie*W(185,150,te);for(let q=0;q<u;q++){const B=T[q];let D=B.r*(1-.04*O);const se=54*B.k*Math.sqrt(120/B.r)/B.r,Me=N+2.6*O;let me=B.th-se*Me;const a=q*14,He=l[a+2];let _=l[a+1];if(_&&e>0){l[a+8]+=e*we;const X=Math.max(l[a+9],1),J=Se*we*Math.min(1,l[a+8]/St)*e/X;if(l[a+10]>0){const A=Se*we*e/X,E=l[a+3]*l[a+11]*e/X,H=Math.min(J,l[a+10]*6*we*e/X);let Z=Math.max(-A,Math.min(A,E<H?H-E:E>A?A-E:0));const Y=-se*Ne*l[a+3];Z*Y>0&&(Z=Math.sign(Z)*Math.min(Math.abs(Z),Math.max(0,A-Math.abs(Y)))),l[a+2]+=l[a+3]*Z}else if(l[a+10]<0){const A=l[a+2];let E=Math.min(J,Math.max(Math.abs(A)*6,20/X)*we*e);l[a+5]&&(E=Math.min(E,Math.max(0,J+Math.sign(A)*l[a+11]*e/X))),l[a+2]=Math.abs(A)<=E?0:A-Math.sign(A)*E}}me+=l[a+2];const pe=zt(me-Xe);D+=Math.max(0,te+33-D)*Math.exp(-(pe*pe)/(.36*.36))*De;const ke=Math.cos(me),ze=Math.sin(me);for(let X=B.inner?oe.length:0;X<oe.length;X+=3){const J=oe[X]-p.x,A=oe[X+1]-p.z,E=Math.hypot(ke*D-J,ze*D-A),H=oe[X+2];if(X!==0){if(E<H){const ce=D>=Math.hypot(J,A)?1:-1,ue=1-E/H;D+=ce*H*ue*ue*(3-2*ue)}continue}const Z=Math.hypot(J,A),Y=D>=Z?1:-1,ne=E<H,Q=2*Z*Math.sin(zt(me-Math.atan2(A,J))/2),Fe=Math.abs(Q),qe=Math.max(.25,l[a+12]||1);let xe=D,$e=!1;if(ne){const ce=1-E/H;xe+=Y*H*ce*ce*(3-2*ce)}const Pt=Math.abs(xe-D);if(!fe&&e>0&&(_===0||_===3?Y!==l[a]&&l[a]!==0&&(ne||l[a+5])&&(_===3||Pt+l[a+13]>Et)&&(_===0?(l[a+3]=ft(Q>=0?1:-1,1,(Q-l[a+6])/e,-se*Ne/e*D,Q,H*.5,Se*we),l[a+8]=0,l[a+2]=0):l[a+3]=ft(l[a+3],1,l[a+11],-se*Ne/e*D,Q,H*.5,Se*we),l[a+4]=l[a],_=1,$e=!0):_===1?Y===l[a+4]?(_=3,$e=!0):Q*l[a+3]>=H*.5&&(_=2,$e=!0):Y===l[a+4]&&(_=3,$e=!0)),_===1){const ce=l[a+4],ue=Math.max(0,1-Fe/H),ot=H*ue*ue*(3-2*ue);if($e)l[a+7]=ce*(l[a+9]-Z);else if(e>0){l[a+3]=ft(l[a+3],2,l[a+11],-se*Ne/e*D,Q,H*.5,Se*we);const st=Se*we*e*qe;let ht=l[a+7];ht+=Math.max(-st,Math.min(st,ot-ht));const qt=Z+ce*ht;l[a+7]=ce*((ce>0?Math.max(qt,l[a+9]-st):Math.min(qt,l[a+9]+st))-Z)}D=Z+ce*l[a+7],l[a+10]=H}else if(_){const ce=xe;if($e)l[a+7]=l[a+9]-ce;else if(e>0){const ue=l[a+9]-ce,ot=Math.min(Se*Math.min(1,l[a+8]/St),Math.max(Math.abs(ue)*6,20))*we*e*qe;l[a+7]=Math.abs(ue)<=ot?0:ue-Math.sign(ue)*ot}_===2&&l[a+7]===0&&(_=3),_===3&&l[a+7]===0&&l[a+2]===0&&(_=0),D=ce+l[a+7],l[a+10]=_===2?Math.max(0,H*.5-Q*l[a+3]):_===3?-1:0}else D=xe;e>0&&(l[a+11]=l[a]!==0?(Q-l[a+6])/e-(l[a+2]-He)*Z/e:0),l[a]=Y,l[a+1]=_,l[a+5]=ne?1:0,l[a+6]=Q,l[a+13]=Pt}if(B.inner||(D=Math.max(D,98+B.R),l[a+9]=D),!B.inner){const X=98+B.R+Math.max(0,te+33-98-B.R)*Math.exp(-(pe*pe)/.1296)*De,J=_?Math.max(0,X-D):0,A=2*Se*we*e,E=Je[q];e>0&&(Je[q]=J>E?E+Math.min(J-E,A):_?J:Math.max(J,E-A)),D+=Je[q]}const Be=p.x+ke*D,Re=p.z+ze*D;n.normalAt(Be,Re,P);const Pe=n.heightAt(Be,Re);l[a+12]=P.y,_e.setFromAxisAngle(be.set(0,1,0),se*Me),lt.setFromAxisAngle(be.set(-ke,0,-ze),se*Me*B.r/B.R%(Math.PI*2)).multiply(_e).multiply(B.q),ae.set(q,ke*D+P.x*B.R,Pe+P.y*B.R-p.y,ze*D+P.z*B.R,B.R,lt),he[q*4]=Be+P.x*B.R,he[q*4+1]=Pe+P.y*B.R,he[q*4+2]=Re+P.z*B.R,he[q*4+3]=B.R,Ye[q]=oe.length>=2?Math.hypot(Be-oe[0],Re-oe[1]):q,We[q*3]=Ae[q*2]=Be,We[q*3+1]=Ae[q*2+1]=Re,We[q*3+2]=Math.min(D,B.inner?B.r*(1-.04*O):98+B.R),ge[q*3]=Be+P.x*B.R,ge[q*3+1]=Pe+P.y*B.R,ge[q*3+2]=Re+P.z*B.R,ct[q].copy(lt),tt[q]=0}ae.commit(),kt()}const Ue=(o,e,N)=>{const z=T[o].R;n.normalAt(e,N,P);const O=n.heightAt(e,N);return K[0]=ge[o*3]+e+P.x*z-K[3],K[1]=ge[o*3+1]+O+P.y*z-K[4],K[2]=ge[o*3+2]+N+P.z*z-K[5],Math.hypot(K[0]-K[6],K[1]-K[7],K[2]-K[8])};Rt(0,0,0);const Ie=(o,e,N=0)=>-(V.D+V.sink*N)*V.a*V.a/(o*o+e*e+V.a*V.a),Ve=(o,e,N=6,z=0)=>{const O=Math.cos(o)*e,ie=Math.sin(o)*e,fe=.5,Ne=new i.Vector3(Ie(O-fe,ie,z)-Ie(O+fe,ie,z),2*fe,Ie(O,ie-fe,z)-Ie(O,ie+fe,z)).normalize();return new i.Vector3(O,Ie(O,ie,z),ie).addScaledVector(Ne,N)},at=Math.PI/180,Le=[];Le.push(Ve(L+.1,345));for(let o=0;o<=10;o++){const e=o/10;Le.push(Ve(L-e*100*at,280-162*W(0,1,e)))}for(let o=1;o<=8;o++){const e=o/8;Le.push(Ve(L-(100+e*130)*at,118,6,W(.1,.9,e)))}for(let o=1;o<=6;o++){const e=o/6;Le.push(Ve(L-(230+e*38)*at,118+190*e*e*(1.2-.2*e),6,1))}const It=new i.Vector3(400,0,-150),Vt=new i.Vector3(.936*.5,-.866,-.351*.5).normalize(),Lt={lip:Ve(L,V.lip,6),startAngle:L,flyThrough:Le,corridor:{rMin:110,rMax:126},golfStart:new i.Vector3(Ee*y,Ie(Ee*y,Te*y)+R,Te*y),golfLodged:new i.Vector3(Math.cos(S+nt)*111,-60,Math.sin(S+nt)*111),ballCentre:new i.Vector3(0,V.ballY,0),ballCentreSunk:new i.Vector3(0,V.ballY-V.ballDrop,0),viewpoints:{reveal:Ve(L,V.lip+14,9),whip:Ve(L-165*at,118,6,.5),crest:Le[Le.length-1]},portalSeat:{position:It.clone().setY(-66),facing:Vt.clone().negate(),note:"throat of the empty funnel (world-built), 60 degrees down"}};return{object:x,radius:c.viewRadius??200,height:120,center:new i.Vector3(0,30,0),anchors:Lt,style:n,lipRadius:V.lip,clothAt:Ie,setEvent(o){it=!0,Ze=le(o)},setAvoid(o){oe.length=0;for(let e=0;e<o.length;e++)oe.push(o[e])},setPace(o){we=o>0?o:1},stepAside(o,e,N,z,O=0,ie=0){let fe=!1;K[6]=o,K[7]=e,K[8]=N;const Ne=!(Math.abs(ie-bt-O)<1e-4)||O===0&&(o!==gt||e!==yt||N!==Mt);bt=ie,gt=o,yt=e,Mt=N;for(let d=0;d<u;d++){const te=T[d],Ce=z+te.R+Bt,ye=Ce+rt,Oe=ge[d*3],je=ge[d*3+1],De=ge[d*3+2],q=Math.hypot(Oe-o,je-e,De-N);if(q>=ye){xt[d*4+1]=0,tt[d]&&(ae.set(d,Oe-p.x,je-p.y,De-p.z,te.R,ct[d]),he[d*4]=Oe,he[d*4+1]=je,he[d*4+2]=De,Ae[d*2]=We[d*3],Ae[d*2+1]=We[d*3+1],tt[d]=0,fe=!0);continue}const B=Oe-o,D=De-N,se=Math.hypot(B,D),Me=Ce+rt*Math.pow(q/ye,ye/rt),me=We[d*3+2],a=We[d*3],He=We[d*3+1],_=a-B,pe=He-D,ke=p.x-_,ze=p.z-pe;n.normalAt(a,He,P);const Be=n.heightAt(a,He);K[3]=a+P.x*te.R,K[4]=Be+P.y*te.R,K[5]=He+P.z*te.R;const Re=Tt(xt,d*4,B,D,se,ke,ze,me,z+te.R,Ce,ye,q,O,Ne),Pe=Math.cos(Re),X=Math.sin(Re);let J=0,A=0;if(Ue(d,_+Pe*se,pe+X*se)<Me){const Y=(Me+8)/12;for(A=Y;A<Me+8&&Ue(d,_+Pe*(se+A),pe+X*(se+A))<Me;A+=Y)J=A;for(let ne=0;ne<12;ne++){const Q=(J+A)/2;Ue(d,_+Pe*(se+Q),pe+X*(se+Q))<Me?J=Q:A=Q}}let E=se+A;{const Y=Pe*ke+X*ze,ne=ke*ke+ze*ze,Q=Y*Y-ne+me*me;if(Q>0){const Fe=Math.sqrt(Q),qe=Y-Fe,xe=Y+Fe;ne<me*me?E=Math.max(E,xe):E>qe&&E<xe&&(E=se*se>ne-me*me?xe:Math.max(qe,0))}}let H=_+Pe*E,Z=pe+X*E;if(Ue(d,H,Z)<z+te.R+2){const Y=Math.atan2(Z-p.z,H-p.x),ne=Math.max(Math.hypot(H-p.x,Z-p.z),me),Q=(H-_)*-Math.sin(Y)+(Z-pe)*Math.cos(Y)>=0?1:-1;J=0,A=(z+te.R+10)/ne;for(let Fe=0;Fe<14;Fe++){const qe=(J+A)/2,xe=Y+Q*qe;Ue(d,p.x+Math.cos(xe)*ne,p.z+Math.sin(xe)*ne)<z+te.R+2?J=qe:A=qe}H=p.x+Math.cos(Y+Q*A)*ne,Z=p.z+Math.sin(Y+Q*A)*ne}Ue(d,H,Z),ae.set(d,K[0]-p.x,K[1]-p.y,K[2]-p.z,te.R,ct[d]),he[d*4]=K[0],he[d*4+1]=K[1],he[d*4+2]=K[2],Ae[d*2]=H,Ae[d*2+1]=Z,tt[d]=1,fe=!0}if(fe){ae.commit();for(let d=0;d<u;d++)Ye[d]=oe.length>=2?Math.hypot(Ae[d*2]-oe[0],Ae[d*2+1]-oe[1]):d;kt()}},setMirror(o,e,N,z){re[0].set(o,e,N,z)},setProgress(o){const[e,N]=c.eventU||[.5,.72];it=!0,Ze=le((o-e)/Math.max(N-e,1e-4))},update(o,e,N){if(!it){const z=e%22;Ze=z<3?0:z<14?(z-3)/11:z<19?1:1-W(19,22,z)}r&&n.update(o,e,N),Rt(Ze,Math.min(o,.1),e)},dispose(){},ground:!1,groundY:0}}export{Ut as PALETTE,na as SWINGA,Se as SWINGV,Et as SWING_MIN,St as SWING_UP,ia as buildHero,Nt as carvedSphere,sa as chunkedNormals,la as golfGeometry,aa as makeStyle,ft as swingWay,Tt as wayRound};
