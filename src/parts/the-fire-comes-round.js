import*as d from"three";import{clamp as fe,lerp as Ce,smoothstep as Fe}from"../kit/core.js";const se=7200,_e=1600,Be=[260,70,260],Qe=`
uniform vec4 uFA, uFK, uFP;      // the line's four waves: amplitude (m), wavenumber (rad/m), phase
uniform vec4 uFS;                // x: sum of the amplitudes, y: how much the bays are sharpened
uniform vec3 uFire;              // colour of the fire's light, linear
uniform float uFcrT;             // the world clock (s)
uniform sampler2D uFcrLine;      // along the line (|x| < 7200 m), two rows: see fcrLine and fcrLine2
uniform sampler2D uFcrMap;       // the ground map in the line's co-ordinates: see fcrScorch
uniform sampler2D uFcrTab;       // along the line, eight rows of numbers (float, unfiltered): the four smoke towers that reach a place (rows 0, 1, 2 and 6), the nearest burst place (rows 3 to 5)
// r the smoke's top / 3200 m, g strength of the fire's light / 2, b the belt's front edge (m behind the line) / 80, a the belt's depth / 160 m
vec4 fcrLine(float x){ return textureLod(uFcrLine, vec2(x*(1./14400.) + .5, .25), 0.); }
// r the land's height 60 m behind the line / 128 m (where the land should end), g width of the char before the belt / 255 m, b (round 4) how much of a gap of the line this is (0..1, softened over 56 m), a top of the low smoke / 800 m
vec4 fcrLine2(float x){ return textureLod(uFcrLine, vec2(x*(1./14400.) + .5, .75), 0.); }
float fcrFront(float x){ vec4 s = sin(x*uFK + uFP); float n = dot(uFA, s)/uFS.x; return uFS.x*(n + uFS.y*(1. - n*n)); }
float fcrFrontS(float x){ vec2 s = sin(x*uFK.xy + uFP.xy); float n = dot(uFA.xy, s)/uFS.x; return uFS.x*(n + uFS.y*(1. - n*n)); }
// the broad lights breathe slowly along the line: at most 17 per cent, at most 0.30 cycles a second
float fcrFlick(float x){ return 1. + .10*sin(x*.0041 + uFcrT*1.3) + .07*sin(x*.0113 - uFcrT*1.9 + 2.); }
// the fire's light at a place on the ground: xyz = unit direction to the light, w = its strength on level ground:
// 1 at an ordinary stretch of the line, 0.72 at 50 m, 0.51 at 100 m, 0.31 at 200 m, 0.15 at 500 m, 0.07 at 1 km,
// 0.02 at 2 km: the hot near light falls fast, the long light of the lit smoke reaches a kilometre and a half (more
// before a surge, less before a low stretch). It stands low: slopes toward the fire catch it. By the place alone.
// (Five places of the line round the nearest are weighed together, the nearest most: no seam where the nearest changes.)
vec4 fcrLight(vec3 p){
  float a = max(p.z - fcrFront(p.x), 0.), wS = 0., eS = 0.; vec3 dS = vec3(0.);
  for (int i = 0; i < 5; i++) {
    float o = (float(i) - 2.)*.45*a, zf = fcrFront(p.x + o), dz = max(p.z - zf, 0.), d = sqrt(o*o + dz*dz);
    float w = (a + 1.)/(d + 1.); w *= w*w; w *= w;
    float dk = d*(1./1500.), e = .78/(1. + pow(d*(1./80.), 1.5)) + .22/((1. + d*(1./500.))*(1. + dk*dk*dk));
    wS += w; eS += w*e*2.*fcrLine(p.x + o).g*fcrFlick(p.x + o);
    dS += w*normalize(vec3(o, 24. + .05*d, min(zf - p.z, -1e-3)));
  }
  return vec4(normalize(dS), eS/wS);
}
// THE SCORCH AND EMBER FIELD at a place on the ground: x how burnt it is (1 under and behind the flames and in the
// char before them, falling to 0 over the char's outer part; a small patch under every spot fire), y the glow of
// the bed under the flames and at their feet (0..1), z the glow the spot fires throw round them (0..1), w the flame
// height at that x / 255 m.
vec2 fcrMapUV(vec3 p){ return vec2(p.x*(1./14400.) + .5, (p.z - fcrFront(p.x) + 160.)*(1./448.)); }
// (the map ends 288 m before the line: its fields fade out before that, so that nothing of its last row is drawn out toward the eye)
vec4 fcrMapEdge(vec4 s, float v){ s.rgb *= 1. - smoothstep(.86, .97, v); return s; }
vec4 fcrScorch(vec3 p){ vec2 uv = fcrMapUV(p); return fcrMapEdge(textureLod(uFcrMap, uv, 0.), uv.y); }
// THE SURGE over x on the world clock: the burst place of the bursts' table that is nearest x, drawn as a leap of the
// wall itself. Returns 1 where a place answers for this x (0 where it was taken away, fading near the border to the
// next place); q = (metres from the surge's middle along the line, its age as a share of its life, its radius (m),
// its rise (m)). fcrSurgeEnv(q.y) is how high the flames stand: up over 8 per cent of the life, down by 62.
float fcrSurgeEnv(float a){ return smoothstep(0., .08, a)*(1. - smoothstep(.30, .62, a)); }
float fcrSurge(float x, out vec4 q){
  float u = x*(1./14400.) + .5;
  vec4 A = textureLod(uFcrTab, vec2(u, 7./16.), 0.), B = textureLod(uFcrTab, vec2(u, 9./16.), 0.), C = textureLod(uFcrTab, vec2(u, 11./16.), 0.);
  float cyc = uFcrT/max(A.y, 1.) + A.z, k = floor(cyc), a = fract(cyc)*A.y/max(A.w, 1.);
  float xk = A.x + 70.*sin(k*2.399 + B.x*6.2832);
  q = vec4(x - xk, a, B.y*(1. + .2*sin(k*1.713 + B.x*17.3 + 1.)), B.z*(1. + .14*sin(k*.917 + B.x*29.1 + 2.)));
  return C.y*smoothstep(0., 150., C.x)*step(a, 1.);
}
float fcrGlowAt(vec3 p){ float d = p.z - fcrFrontS(p.x); return exp(-max(d, 0.)/240. - max(-d, 0.)/420. - max(p.y, 0.)/150.); }
// how much of the fire's glow the low air puts into a ray (0..1): a thin medium that hugs the line
float fcrAirGlow(vec3 ro, vec3 rd, float tmax){
  float za = -uFS.x - 300., zb = uFS.x + 700., t0 = 0., t1 = min(tmax, 9000.);
  if (abs(rd.z) > 1e-4){ float ta = (za - ro.z)/rd.z, tb = (zb - ro.z)/rd.z; t0 = max(t0, min(ta, tb)); t1 = min(t1, max(ta, tb)); }
  else if (ro.z < za || ro.z > zb) return 0.;
  if (rd.y > 1e-4) t1 = min(t1, (800. - ro.y)/rd.y);
  if (t1 <= t0) return 0.;
  // eight places, nearer together at the near end; what lies far along a ray that runs with the line is thinned by the air before it
  float len = t1 - t0, g = 0.;
  // (round 4) the air within 200 m of the eye gives none of it and the air within 1,400 m less: near to, the flames and the smoke are seen themselves, not a glow before them
  for (int i = 0; i < 8; i++) { float u = (float(i) + .5)*.125, tt = len*u*(.35 + .65*u); g += fcrGlowAt(ro + rd*(t0 + tt))*(.35 + 1.3*u)*exp(-tt*(1./3500.))*smoothstep(200., 1400., t0 + tt); }
  return 1. - exp(-g*len*(.125/1250.));
}
`,Ke=`
uniform sampler2D uNoise;        // 256 x 256: g is r moved by (37, 239), so one lookup gives two layers of a 3D noise
float fcrN3(vec3 x){ vec3 p = floor(x), f = fract(x); f = f*f*(3. - 2.*f);
  vec2 uv = (p.xy + vec2(37., 239.)*p.z) + f.xy;
  vec2 rg = textureLod(uNoise, (uv + .5)/256., 0.).yx;
  return mix(rg.x, rg.y, f.z); }
`,tt=`
const mat2 fcrM1 = mat2(.80, .60, -.60, .80), fcrM2 = mat2(.28, .96, -.96, .28), fcrM3 = mat2(-.45, .89, -.89, -.45);
// fcrScorch, filtered by a pixel's footprint on the ground, up to 28 m (less shimmer far off)
vec4 fcrScorchF(vec3 p){ float fw = length(fwidth(p.xz)); vec2 uv = fcrMapUV(p); return fcrMapEdge(textureLod(uFcrMap, uv, min(log2(max(fw*(1./7.), 1.)), 2.)), uv.y); }
// THE CHAR AND ITS SINGED MARGIN at a place (sc = fcrScorchF(p)): x how black the ground is (the char under and before
// the flames), y how singed (0..1: the brown, half burnt margin round the black, of very uneven width). The edge is
// ragged at every scale down to a metre: fingers that lie across the line and reach out before it (10 to 35 m wide,
// 60 to 200 m long), islands of black before the edge and of unburnt ground inside it, torn in the small.
vec2 fcrBurn(vec3 p, vec4 sc){
  float fw = length(fwidth(p.xz)), d = p.z - fcrFront(p.x);
  float wq = fcrN3(vec3(fcrM2*p.xz*(1./53.), 4.)) - .5;                                // (the fingers' field is bent and turned in its own space: no lattice)
  float fg = fcrN3(vec3(mat2(.94, .34, -.34, .94)*vec2((p.x + 46.*wq)*(1./17.), (d + 60.*wq)*(1./110.)), 3.))*.62
    + mix(.5, fcrN3(vec3(mat2(.80, -.60, .60, .80)*vec2(p.x*(1./5.3) + 40., d*(1./29.)) + 9.*wq, 8.)), (1. - smoothstep(4., 12., fw)))*.38;
  float n = fcrN3(vec3(fcrM1*p.xz*(1./31.), 3.))*.45 + mix(.5, fcrN3(vec3(fcrM2*p.xz*(1./9.7), 6.)), (1. - smoothstep(5., 14., fw)))*.27
    + mix(.5, fcrN3(vec3(fcrM3*p.xz*(1./2.9), 1.)), (1. - smoothstep(1.4, 4., fw)))*.17 + mix(.5, fcrN3(vec3(fcrM1*p.xz*(1./.93), 5.)), (1. - smoothstep(.45, 1.3, fw)))*.11;
  float zone = smoothstep(0., .10, sc.x)*(1. - smoothstep(.88, 1., sc.x));
  float s = sc.x + ((fg - .5)*1.15 + (n - .5)*.75)*zone, wd = .035 + .012*fw;
  float black = smoothstep(.50 - wd, .50 + wd, s);
  float singe = smoothstep(.16 - 2.*wd, .36 + wd, s + (n - .5)*.35*zone);
  return vec2(black, singe*(1. - black));
}
// how black the ground is at a place (0..1), with a ragged edge: 1 in the char, 0.3 to 0.55 in its singed margin. sc = fcrScorchF(p)
float fcrChar(vec3 p, vec4 sc){
  vec2 b = fcrBurn(p, sc);
  return b.x + b.y*(.30 + .25*fcrN3(vec3(fcrM2*p.xz*(1./6.3), 9.)));
}
// THE SHADE ROUGH GROUND LAYS ON ITSELF under the fire's low light: tufts, clods and clumps stand in the light and
// throw long shade AWAY from the fire (longer the farther from it, as the light stands lower). Returns the share of
// the fire's light that reaches the ground at p (0.3 to 1); Lf = fcrLight(p). Multiply the fire's light by it.
float fcrRough(vec3 p, vec4 Lf){
  float fw = length(fwidth(p.xz)), run = max(length(Lf.xz), .05), te = Lf.y/run;      // the light's rise over its run
  vec2 dir = Lf.xz/run, q = fcrM1*p.xz*(1./10.), dq = fcrM1*dir*(1./10.), r = fcrM3*p.xz*(1./2.6), dr = fcrM3*dir*(1./2.6);
  float k1 = (1. - smoothstep(3.5, 10., fw)), k2 = (1. - smoothstep(.9, 2.6, fw)), sh = 1.;
  // clumps up to 1.8 m high some 12 m apart; tufts up to 0.5 m some 3 m apart: is one of them between here and the fire?
  float h0 = smoothstep(.52, .80, fcrN3(vec3(q, 4.5)))*1.8, g0 = smoothstep(.50, .78, fcrN3(vec3(r, 2.5)))*.5;
  sh *= 1. - k1*.6*smoothstep(0., .5, smoothstep(.52, .80, fcrN3(vec3(q + dq*3.5, 4.5)))*1.8 - h0 - 3.5*te);
  sh *= 1. - k1*.6*smoothstep(0., .5, smoothstep(.52, .80, fcrN3(vec3(q + dq*9., 4.5)))*1.8 - h0 - 9.*te);
  sh *= 1. - k2*.5*smoothstep(0., .16, smoothstep(.50, .78, fcrN3(vec3(r + dr*1.1, 2.5)))*.5 - g0 - 1.1*te);
  sh *= 1. - k2*.5*smoothstep(0., .16, smoothstep(.50, .78, fcrN3(vec3(r + dr*2.8, 2.5)))*.5 - g0 - 2.8*te);
  return max(sh, .3)*(1. + .25*k1*(h0*(1./1.8)) + .2*k2*(g0*2.));      // (what stands up catches a little more)
}
// the light burnt ground gives out (linear): a net of embers in the char, the hot bed under the flames and at their
// feet, the spot fires' glow round them. sc = fcrScorchF(p), ch = fcrChar(p, sc)
vec3 fcrEmberC(vec3 p, vec4 sc, float ch){
  float fw = length(fwidth(p.xz));
  float e1 = fcrN3(vec3(fcrM2*p.xz*(1./1.9), 7. + uFcrT*.05)), e2 = fcrN3(vec3(fcrM3*p.xz*(1./5.3), 2. + uFcrT*.03)), e3 = fcrN3(vec3(fcrM1*p.xz*(1./17.), 5. + uFcrT*.012));
  float k1 = (1. - smoothstep(.8, 2.6, fw))*(1. - smoothstep(2.4, 7., fw)), k3 = (1. - smoothstep(8., 24., fw));
  // specks, and short threads where two fields cross; far off, a faint even glow
  float net = mix(.12, smoothstep(.66, .84, e1)*smoothstep(.35, .62, e2) + .7*(1. - smoothstep(0., .07, abs(e2 - .5)))*smoothstep(.42, .62, e1), k1)*mix(1., .65 + .7*e3, k3);
  // the bed is a bed of coals (round 4): bright where they lie close, dark between, ragged where it ends; far off its mean
  float hot = sc.y*sc.y*smoothstep(.10, .50, sc.y + (e2 - .5)*.5*k3 + (e3 - .5)*.5*k3);
  float coals = mix(.72, (.16 + 1.30*smoothstep(.30, .74, e2))*mix(1., .45 + 1.1*e1, k1), (1. - smoothstep(5., 16., fw)));
  coals *= .30 + .70*smoothstep(.015, .16, abs(normalize(p - cameraPosition).y));      // (e) coals lie between dark pieces: seen nearly edge on, the bed shows less of them (no bright ruled line at the foot of a far lobe)
  return uFire*((ch*net*(.22 + 1.6*sc.y) + hot*.55*coals*mix(1., .5 + e3, k3))*fcrFlick(p.x) + sc.z*.30*mix(1., .45 + 1.1*e2, k3));      // (the spot fires' glow lies on rough ground: round 4, 0.30 with the ground's grain; it was an even 0.5)
}
vec3 fcrEmber(vec3 p, vec4 sc){ return fcrEmberC(p, sc, fcrChar(p, sc)); }
`,Ye=`
vec3 fcrRamp(float T){
  vec3 c = mix(vec3(.40, .028, .004), vec3(.95, .125, .010), smoothstep(.04, .36, T));
  c = mix(c, vec3(1.40, .32, .025), smoothstep(.34, .62, T));
  c = mix(c, vec3(1.80, .72, .09), smoothstep(.60, .82, T));
  return mix(c, vec3(2.40, 1.45, .26), smoothstep(.87, 1., T)); }
`,$e=`
vec4 fcrFlame(vec2 Q, vec2 m, float h, float seed, float pace, float heat){
  float yn = clamp(Q.y, 0., 1.), yf = yn*1.9, ax = abs(Q.x);
  float sc = clamp(h*(1./190.), .035, 1.3);                             // a small flame has small forms: 38 m wide and 46 m tall on a flame of 100 m
  float px = max(fwidth(m.y), .01)/sc;                                  // (c) metres to a pixel, at that scale
  float spd = 34.*sc*(.55 + .35*pace);                                  // every tongue its own speed: 0.4 to 0.67 forms a second
  vec3 q = vec3(m.x/(38.*sc) + seed*37., (m.y - uFcrT*spd)/(46.*sc) + seed*91., seed*13.7);
  q.x += (fcrN3(vec3(q.x*.45 + 3., q.y*.45, seed*3.1)) - .5)*1.3;       // a flame bends as it climbs
  float a = fcrN3(q);
  // finer forms on them, each turned its own way so that no grain of the noise shows, each climbing a little faster
  float b = mix(.5, fcrN3(vec3(mat2(.88, .48, -.48, .88)*q.xy*vec2(2.3, 2.1), q.z) + vec3(7.3, -uFcrT*.31, 2.1)), (1. - smoothstep(5., 16., px)));
  float c = mix(.5, fcrN3(vec3(mat2(.76, -.65, .65, .76)*q.xy*vec2(5.3, 4.9), q.z) + vec3(1.7, -uFcrT*.8, 5.3)), (1. - smoothstep(2.3, 7., px)));
  float d = mix(.5, fcrN3(vec3(mat2(.45, .89, -.89, .45)*q.xy*vec2(12., 11.), q.z) + vec3(4.1, -uFcrT*1.7, 8.7)), (1. - smoothstep(1., 3., px)));
  float e = mix(.5, fcrN3(vec3(mat2(.92, -.39, .39, .92)*q.xy*vec2(27., 25.), q.z) + vec3(9.4, -uFcrT*3.1, 3.3)), (1. - smoothstep(.45, 1.3, px)));
  float f = a*.58 + b*.30 + c*.15 + (d - .5)*.09 + (e - .5)*.05;
  float side = 1. - smoothstep(.42, .94, ax + (b - .5)*.4 + .12*yf);    // torn sides, narrower upward
  yf /= .62 + .76*fcrN3(vec3(m.x/(120.*sc) + seed*5., uFcrT*.05 + seed*3., seed*21.));      // across a sheet the tongues stand high and low, and change slowly
  // how deep inside the flame this point is: all of the base; higher up only the peaks of the field, which tear off as they rise
  float body = f + .10 - .64*pow(yf, .85) - (1. - side)*1.1;
  float fs = clamp(.012*h, .25, 1.2), foot = smoothstep(-.5, .5, (m.y - .08*h*(1. - smoothstep(.25, .60, a)) + (c - .5)*fs)/fs);      // (its foot is ragged: no ruled base)
  float dens = smoothstep(-.10, .46, body); dens = dens*sqrt(dens)*foot;                    // no crisp edge
  float core = clamp((body - .10)/.55, 0., 1.);
  // pale yellow only in the small hearts, deep in the body and low; orange round them; red and thin at the torn edges
  float tex = smoothstep(.22, .78, b*.50 + c*.35 + d*.15);                                   // inside a tongue: bright streams and darker eddies
  float T = clamp(.62*core*(.22 + .78*pow(1. - min(yf, 1.), 1.8))*(.30 + 1.15*tex)*(.86 + .28*e)*(.45 + .55*heat) + .10*dens, 0., 1.);
  float al = dens*(.28 + .72*core);
  vec3 rgb = fcrRamp(T)*al; float A = al;
  // its own smoke: dark pockets in the gaps between its tongues and rolling up out of them. It hides the flames behind,
  // so that in a body of many sheets dark gaps open and close as the forms climb
  float ws = smoothstep(.38, .66, (1. - a)*.60 + b*.40)*smoothstep(.12, .50, yf)*(1. - smoothstep(.75, 1.25, yf))*(1. - smoothstep(.30, .80, ax + .18*(yf - .9)))
    *(.48 - .12*heat)*smoothstep(.25, .55, fcrN3(vec3(q.xy*.6 + 11., seed*9.)));
  vec3 scol = mix(uFire*vec3(.40, .30, .24), vec3(.034, .027, .025), smoothstep(.35, 1.4, yf));
  rgb += (1. - A)*scol*ws; A += (1. - A)*ws;
  // the air round it, lit by it (faint: the mass of smoke behind is the smoke's own pass)
  float ha = .04*heat*(1. - smoothstep(.55, 1., ax))*(1. - smoothstep(.40, .85, yn))*smoothstep(0., .10, yn);
  rgb += (1. - A)*uFire*vec3(.90, .72, .50)*ha; A += (1. - A)*ha;
  return vec4(rgb, A);
}
`,Ae=s=>Fe(se,se-900,Math.abs(s));function it(s,r,u){const e={},f=[s.range(2700,3500),s.range(960,1340),s.range(520,690),s.range(230,330)];e.A=[s.range(210,300),s.range(120,165),s.range(40,62),s.range(12,20)],e.K=f.map(t=>Math.PI*2/t),e.lam=f,e.P=[s.range(0,6.2832),s.range(0,6.2832),s.range(0,6.2832),s.range(0,6.2832)],e.Asum=e.A[0]+e.A[1]+e.A[2]+e.A[3],e.bay=.3,e.lean=s.range(.62,.8),e.top=s.range(2300,2900),e.topPh=[s.range(0,6.2832),s.range(0,6.2832)];const P=t=>e.A[0]*Math.sin(t*e.K[0]+e.P[0])+e.A[1]*Math.sin(t*e.K[1]+e.P[1])+e.A[2]*Math.sin(t*e.K[2]+e.P[2])+e.A[3]*Math.sin(t*e.K[3]+e.P[3]);e.frontZ=t=>{const o=P(t)/e.Asum;return e.Asum*(o+e.bay*(1-o*o))},e.frontS=t=>{const o=(e.A[0]*Math.sin(t*e.K[0]+e.P[0])+e.A[1]*Math.sin(t*e.K[1]+e.P[1]))/e.Asum;return e.Asum*(o+e.bay*(1-o*o))};let x=1/0,H=-1/0;for(let t=-se;t<=se;t+=8){const o=e.frontZ(t);o<x&&(x=o),o>H&&(H=o)}e.zLo=x,e.zHi=H,e.fwd=t=>fe((e.frontZ(t)-x)/Math.max(1,H-x),0,1);let R=0,F=-1/0;for(let t=-520;t<=520;t+=1){const o=e.frontZ(t)-.02*Math.abs(t);o>F&&(F=o,R=t)}e.lobe={x:R,z:e.frontZ(R)};const z=[],O=[],V=[];let M=0,n=-se,k=e.frontZ(-se),a=0;for(let t=-se;t<=se+1e-6;t+=2){const o=e.frontZ(t);M+=Math.hypot(t-n,o-k),n=t,k=o,M>=a&&(z.push(t),O.push(o),V.push(M),a+=14)}e.cols={x:z,z:O,s:V,n:z.length,length:M};const c=[{x:e.lobe.x+s.range(-70,70),w:s.range(80,150),h:s.range(130,190),top:s.range(.6,.95),tw:s.range(240,400)}],g=22;for(let t=0;t<g;t++){let o=0,i=-1/0;for(let G=0;G<4;G++){const K=-6e3+(t+s())*(12e3/g),J=e.fwd(K)+.5*s();J>i&&(i=J,o=K)}const l=s()<.55,p={x:o,w:s.range(80,210),h:s.range(120,200),top:l?s.range(.5,1):s.range(.18,.38),tw:s.range(260,640)};Math.abs(p.x-c[0].x)>380&&c.push(p)}c.sort((t,o)=>t.x-o.x),e.strong=c;for(const t of c){t.sh=[];const o=2+Math.floor(s()*2);for(let i=0;i<o;i++)t.sh.push({dx:s.range(-1.1,1.1)*t.tw,f:s.range(.3,.75),w:s.range(.3,.7)*t.tw})}e.side=s.sign()*s.range(.05,.14);{const t=(e.lean-.62)/.18,o=(Math.abs(e.side)-.05)/.09,i=Math.sign(e.side)||1;e.wind=u==="upright"||u==="cross"?u:"back",e.wind==="upright"?(e.lean=.1+.1*t,e.side*=.5,e.drawn=1e-5,e.rise=15,e.thick=.14,e.head=1,e.flameLean=[0,.1],e.sparkWind=[0,.03,0],e.vel=[0,15,-15*e.lean]):e.wind==="cross"?(e.lean=.24+.1*t,e.side=i*(.5+.25*o),e.drawn=25e-6,e.rise=13,e.thick=.2,e.head=.2,e.flameLean=[i*.2,.12],e.sparkWind=[i*.55,.05,i*6],e.vel=[i*20,13,-13*e.lean]):(e.drawn=11e-5,e.rise=24,e.thick=.25,e.head=0,e.flameLean=[0,.3],e.sparkWind=[0,.12,0],e.vel=[0,24,-24*e.lean])}const $=[];for(let t=0;t<22;t++){const o=-se+(t+s())*(2*se/22),i=s.range(20,80);c.some(l=>Math.abs(o-l.x)<l.w*.8+i)||$.push({x:o,w:i})}e.gaps=$;const ge=t=>t>=1?0:(1-t*t)*(1-t*t);e.surge=t=>{let o=0;for(const i of c)o=Math.max(o,i.h*ge(Math.abs(t-i.x)/i.w));return o},e.gap=t=>{let o=1;for(const i of $)o=Math.min(o,Fe(i.w*.5-6,i.w*.5+10,Math.abs(t-i.x)));return o},e.flameH=t=>{const o=.5+.5*r.n2(t/520,3.7),i=.5+.5*r.n2(t/170,9.3),l=.5+.5*r.n2(t/47,5.1),p=Ce(15+15*l,40+50*fe(1.3*i-.15,0,1),Fe(.3,.5,o));return Math.max(p,e.surge(t)*(.85+.15*l))*e.gap(t)*Ae(t)},e.beltD=(t,o=e.flameH(t))=>fe(40+.55*o+45*(.5+.5*r.n2(t/310,21.7)),40,150),e.edge=t=>{const o=.5+.5*r.n2(t/60,33.1),i=.5+.5*r.n2(t/19,41.3);return 4+34*o*o+9*i+30*(1-e.gap(t))};let A=!1,Q=null;for(const t of c){t.r=s(),t.r2=s();const o=s(),i=s();t.tlean=e.side+(i*2-1)*.13,t.rw=o,Math.abs(t.x-e.lobe.x)<1700&&(!Q||t.r>Q.r)&&(Q=t),t.r>.82&&Math.abs(t.x-e.lobe.x)<1700&&(A=!0)}!A&&Q&&(Q.r=.9);for(const t of c){const o=t.r>.82?.84+.16*t.r2:.25+.45*Math.pow(t.r/.82,1.5);t.H=Math.min(e.top*o*(e.wind==="upright"?.68:e.wind==="cross"?.8:1),3150)*(.3+.7*Ae(t.x)),t.hw=(190+170*t.rw)*(.7+.8*o)*(e.wind==="upright"?.7:1),t.top=o,t.tw=t.hw}{const t=(i,l)=>{const p=l/i.H;return i.hw*(.42+.58*Fe(0,.55,p))*(1+e.head*Fe(.45,.88,p))},o=(i,l)=>{const p=Math.min(i.H,l.H);for(let G=1;G<=16;G++){const K=p*G/16;if(l.x+l.tlean*K-(i.x+i.tlean*K)<.95*(t(i,K)+t(l,K)))return K}return-1};e.fill=[];for(let i=0;i+1<c.length;i++){const l=c[i],p=c[i+1],G=Math.min(l.H,p.H);let K=o(l,p);if(!(K<0)){if(K>=.6*G){const J=p.x+p.tlean*G-(l.x+l.tlean*G),X=t(l,G)+t(p,G),U=fe(.9*J/Math.max(X,1),.6,1);if(l.hw*=U,p.hw*=U,l.tw=l.hw,p.tw=p.hw,K=o(l,p),K<0)continue}e.fill.push({xa:l.x+l.tlean*K*.5,xb:p.x+p.tlean*K*.5,top:Math.min(.92*G,1.25*K+120)})}}}return e.char=t=>{const o=.5+.5*r.n2(t/140,61.9),i=.5+.5*r.n2(t/37,13.3);return(45+150*Math.pow(o,1.5)+25*i)*(.4+.6*Ae(t))},e.lowTop=(t,o)=>{let i=fe(150+5.2*o,150,720)*(.62+.76*(.5+.5*r.n2(t/230,91.7)))*(.3+.7*Ae(t));for(const l of e.fill){const p=Fe(l.xa-160,l.xa+40,t)*(1-Fe(l.xb-40,l.xb+160,t));p>0&&(i=Math.max(i,Ce(i,l.top,p)))}return i},e.smokeTop=t=>{let o=e.lowTop(t,e.flameH(t));for(const i of c){const l=Math.abs(t-i.x-i.tlean*i.H*.5)/(i.hw*1.2);l<1&&(o=Math.max(o,i.H*(1-l*l*l*l)))}return o},e}const qe=23e3,S=2048,Oe=64,at=-160,We=7;async function lt(s,r){const u=new Float32Array(S),e=new Float32Array(S),f=new Float32Array(S),P=new Float32Array(S),x=new Float32Array(S),H=new Float32Array(S),R=new Float32Array(S),F=n=>-se+(n+.5)*(2*se/S);for(let n=0;n<S;n++)u[n]=s.flameH(F(n)),n%1024===1023&&await r();for(let n=0;n<S;n++){const k=F(n);e[n]=s.beltD(k,u[n]),f[n]=s.edge(k),H[n]=s.char(k)}await r();let z=0;const O=18;for(let n=-O;n<=O;n++)z+=u[fe(n,0,S-1)];for(let n=0;n<S;n++){const k=z/(2*O+1);x[n]=fe(.35+k/75,0,1.6),R[n]=s.lowTop(F(n),k),z+=u[fe(n+O+1,0,S-1)]-u[fe(n-O,0,S-1)]}for(let n=0;n<S;n++){const k=F(n);let a=R[n];for(const c of s.strong){const g=Math.abs(k-c.x-c.tlean*c.H*.5)/(c.hw*1.2);g<1&&(a=Math.max(a,c.H*(1-g*g*g*g)))}P[n]=a}const V=new Float32Array(S),M=new Float32Array(S);for(let n=0;n<S;n++)M[n]=1-s.gap(F(n));for(let n=0;n<S;n++){let k=0;for(let a=-8;a<=8;a++)k+=M[fe(n+a,0,S-1)];V[n]=Math.min(1,k/8)}return{H:u,D:e,E:f,T:P,S:x,M:H,LT:R,G:V}}const Xe=[-1,0,1,0,1,1,-1,1],Je=s=>s-Math.floor(s),de=(s,r)=>{const u=fe((r+se)/(2*se)*S-.5,0,S-1.001),e=Math.floor(u);return s[e]+(s[e+1]-s[e])*(u-e)};function ft(s,r,u,e){const f=s.cols,P=[];for(let x=0;x<150;x++){const H=Math.min(f.n-2,Math.floor(u()*(f.n-1))),R=Ce(f.x[H],f.x[H+1],u()),F=u(),z=u(),O=u.range(1,2.4),V=u(),M=u();if(u()>Ae(R))continue;const k=100+150*(.5+.5*e.n2(R/700,77.7)),a=Math.min(225,20+de(r.M,R)*.95+k*F*F),c=2.5+3*z+16*z*z*z;P.push({x:R,z:s.frontZ(R)-de(r.E,R)+a,r:c,h:c*O,seed:V,n:3+Math.floor(M*M*7),on:!0})}return P}function ot(s,r,u,e,f,P){for(let x=f;x<P;x++){const H=r.E[x],R=r.D[x],F=r.H[x],z=fe(F/60,.15,1),O=r.M[x];for(let V=0;V<Oe;V++){const M=-(at+(V+.5)*We)-H,n=M>0?1:1-Fe(.2*O,1.1*O,-M),k=(M>0?z*(1-Fe(.3*R,R+50,M)):z*Math.exp(M/12))*Fe(0,4,V),a=(V*S+x)*4;u[a]=e[V*S+x]=Math.round(n*255),u[a+1]=Math.round(k*255),u[a+3]=Math.min(255,Math.round(F))}}}function ct(s,r){const u=(r.x+se)/(2*se)*S-.5,e=(r.z-s.frontZ(r.x)-at)/We-.5,f=Math.ceil(1.7*(2.5*r.r+8)/We);return[Math.max(0,Math.floor(u-f)),Math.min(S-1,Math.ceil(u+f)),Math.max(0,Math.floor(e-f)),Math.min(Oe-2,Math.ceil(e+f)),u,e]}function rt(s,r,u,e,f,P,x){const H=r[4],R=r[5],F=2.5*s.r+8,z=255*Math.min(1,.5+.03*s.r),O=.4*s.r,V=.9*s.r+2;for(let M=Math.max(r[2],P);M<=Math.min(r[3],x);M++)for(let n=Math.max(r[0],e);n<=Math.min(r[1],f);n++){const k=((n-H)*(n-H)+(M-R)*(M-R))*We*We,a=(M*S+n)*4;u[a+2]=Math.min(255,u[a+2]+Math.round(z*Math.exp(-k/(F*F)))),k<V*V&&(u[a]=Math.max(u[a],Math.round(255*Fe(V,O,Math.sqrt(k)))))}}function ht(s,r,u){for(const e of r)e.rect=ct(s,e),e.baked=!!e.on,e.on&&rt(e,e.rect,u,0,S,0,Oe)}function ut(s,r,u,e){const f=s.rect;for(let P=f[2];P<=f[3];P++)for(let x=f[0];x<=f[1];x++){const H=P*S+x;u[H*4]=e[H],u[H*4+2]=0}s.baked=!1;for(const P of r)P.baked&&P.rect[0]<=f[1]&&P.rect[1]>=f[0]&&P.rect[2]<=f[3]&&P.rect[3]>=f[2]&&rt(P,P.rect,u,f[0],f[1],f[2],f[3])}async function dt(s,r,u,e,f,P,x,H,R){const F=s.cols,z=new Float32Array(qe),O=new Float32Array(qe),V=new Float32Array(qe),M=new Float32Array(qe),n=new Float32Array(qe),k=new Uint8Array(qe),a=new Float32Array(qe),c=new Int16Array(qe);let g=0;const $=(o,i,l,p,G,K,J,X)=>{g>=qe||(z[g]=o,O[g]=i,V[g]=l,M[g]=p,n[g]=G,k[g]=K,a[g]=J,c[g]=X,g++)};for(let o=0;o<1e3;o++){const i=Math.min(F.n-2,Math.floor(e()*(F.n-1))),l=Ce(F.x[i],F.x[i+1],e()),p=e(),G=e(),K=e(),J=e();let X=de(r.H,l);if(X<4){if(J>.25*Ae(l))continue;X=5+6*G}const U=p*p*p,T=X*(.3+.85*Math.sqrt(U))*(.55+1.1*G*G),Z=Math.max(8+(52+.15*X)*U,.9*T),oe=fe(Math.round(2+Z/9),3,10),ce=s.frontZ(l)-de(r.E,l)-K*de(r.D,l),he=Math.min(Z*.6,26);for(let ke=0;ke<oe;ke++){const ne=(e()+e()+e()-1.5)/1.5,Le=e(),He=e(),Ee=e(),Te=T*(1-.6*Math.pow(Math.abs(ne),1.4))*(.55+.6*Le),pe=fe(Te*(.5+1*He*He),3.5,Math.max(5,Z*.8));$(l+ne*Z*.5,ce+(Ee-.5)*he,Te,pe,e(),0,(e()-.5)*.3,-1)}o%330===329&&await R()}for(let o=0;o<1500;o++){const i=Math.min(F.n-2,Math.floor(e()*(F.n-1))),l=Ce(F.x[i],F.x[i+1],e()),p=e(),G=e();if(e()>Ae(l)||de(r.H,l)<4)continue;const J=1.2+4*p*p;$(l,s.frontZ(l)-de(r.E,l)+de(r.M,l)*(.42+.5*G),J,J*(.8+.8*e()),e(),0,(e()-.5)*.3,-1)}await R(),u.forEach((o,i)=>{$(o.x,o.z,Math.min(o.r*e.range(.3,.6),.25*o.h),o.r*e.range(.45,.8),e(),3,0,i);for(let l=0;l<o.n;l++){const p=e()*6.2832,G=o.r*.8*Math.sqrt(e()),K=o.h*e.range(.4,1.15);$(o.x+G*Math.cos(p),o.z+G*Math.sin(p)*.6,K,K*e.range(.35,.7),e(),1,e.range(-.25,.25),i)}});const ge=(o,i)=>de(r.S,o)*(.78/(1+Math.pow(Math.max(i,0)/80,1.5))+.22);for(let o=0;o<1500;o++){const i=Math.min(F.n-2,Math.floor(f()*(F.n-1))),l=Ce(F.x[i],F.x[i+1],f()),p=f(),G=f(),K=f(),J=f(),X=f();if(J>Ae(l)||de(r.H,l)<4)continue;const U=de(r.M,l)*(.05+1*p),T=3+9*G*G;$(l,s.frontZ(l)-de(r.E,l)+U,T,T*(1.5+2.5*K),X,5,ge(l,U),-1)}for(let o=0;o<60;o++){const i=Math.min(F.n-2,Math.floor(f()*(F.n-1))),l=Ce(F.x[i],F.x[i+1],f()),p=f.range(100,220),G=f.range(15,70),K=5+Math.floor(f()*4);for(let J=0;J<K;J++){const X=l+(f()-.5)*p,U=G+f.range(-12,30),T=f.range(12,26),Z=f.range(18,36),oe=f();de(r.H,X)<4||f()>Ae(X)||$(X,s.frontZ(X)-de(r.E,X)+U,T,Z,oe,5,ge(X,U),-1)}}for(let o=0;o<36;o++){const i=Math.min(F.n-2,Math.floor(f()*(F.n-1))),l=Ce(F.x[i],F.x[i+1],f()),p=f.range(200,450),G=f.range(60,220),K=6+Math.floor(f()*5),J=f.range(22,48);for(let X=0;X<K;X++){const U=l+(f()-.5)*p,T=G+f.range(-25,40),Z=J*f.range(.6,1),oe=f.range(50,110),ce=f();de(r.H,U)<4||f()>Ae(U)||$(U,s.frontZ(U)-de(r.E,U)+T,Z,oe,ce,5,ge(U,T),-1)}}u.forEach((o,i)=>{const l=f(),p=f.range(1.6,2.6);o.r>5&&$(o.x,o.z-1,Math.min(o.h*p,34),Math.min(o.h*p,34)*.3,l,6,ge(o.x,o.z-s.frontZ(o.x))+.4,i)}),await R();const A={n:0,order:null,geometry:null,cx:z,cz:O,ch:V,cw:M,kind:k,spot:c,mesh:null,triangles:0,add:(...o)=>$(...o),count:()=>g};A.fill=async o=>{const i=new Float64Array(g);for(let Z=0;Z<g;Z++)i[Z]=Math.round((O[Z]+4096)*256)*32768+Z;i.sort(),await R();const l=g,p=new Float32Array(l*12),G=new Float32Array(l*8),K=new Float32Array(l*16),J=new Float32Array(l*8),X=new Uint32Array(l*6),U=new Uint16Array(l);for(let Z=0;Z<l;Z++){const oe=i[Z]%32768;U[Z]=oe;const ce=k[oe],he=H(z[oe],O[oe])-.3,ke=o&&(o[oe]||c[oe]>=0&&!u[c[oe]].on),ne=ke?0:ce>=3?V[oe]:V[oe]*1.9,Le=ke?0:M[oe],He=ce>=5?a[oe]:Je(n[oe]*7.31);for(let pe=0;pe<4;pe++){const ye=Z*4+pe;p[ye*3]=z[oe],p[ye*3+1]=he,p[ye*3+2]=O[oe],G[ye*2]=Xe[pe*2],G[ye*2+1]=Xe[pe*2+1],K[ye*4]=Le,K[ye*4+1]=ne,K[ye*4+2]=n[oe],K[ye*4+3]=He,J[ye*2]=ce,J[ye*2+1]=ce>=5?0:a[oe]}const Ee=Z*4,Te=Z*6;X[Te]=Ee,X[Te+1]=Ee+1,X[Te+2]=Ee+2,X[Te+3]=Ee,X[Te+4]=Ee+2,X[Te+5]=Ee+3,Z%3500===3499&&await R()}const T=new d.BufferGeometry;T.setAttribute("position",new d.BufferAttribute(p,3)),T.setAttribute("aQ",new d.BufferAttribute(G,2)),T.setAttribute("aS",new d.BufferAttribute(K,4)),T.setAttribute("aT",new d.BufferAttribute(J,2)),T.setIndex(new d.BufferAttribute(X,1)),A.geometry&&A.geometry.dispose(),A.geometry=T,A.n=l,A.order=U,A.triangles=l*2,A.area=0;for(let Z=0;Z<l;Z++)k[Z]<3&&!(o&&o[Z])&&(A.area+=3.8*M[Z]*V[Z]);A.mesh&&(A.mesh.geometry=T)},A.geometry=new d.BufferGeometry;const Q=new d.ShaderMaterial({transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:d.DoubleSide,uniforms:{uFcrT:x.uFcrT,uNoise:x.uNoise,uHaze:x.uHaze,uFire:x.uFire,uLeanF:x.uLeanF},vertexShader:`
      attribute vec2 aQ; attribute vec4 aS; attribute vec2 aT;   // aQ: across -1..1, up 0..1. aS: half width (m; 0 = taken away), card height (m), slice, own speed 0..1 (kinds 5, 6: the fire's light there). aT: kind (0 flame, 1 lick of a spot fire, 3 what a spot fire burns, 4 a black stalk of the world's forest, 5 low smoke on the ground, 6 a spot fire's plume), own lean
      uniform float uFcrT; uniform vec2 uHaze, uLeanF;
      varying vec2 vQ; varying vec4 vF; varying float vFog; varying vec2 vT;
      void main(){
        float w = aS.x, h = aS.y, fl = 1. - step(2.5, aT.x) + step(5.5, aT.x);      // (what leans with the flames: flames, licks, a spot fire's plume)
        vec2 tc = cameraPosition.xz - position.xz; float tl = max(length(tc), 1e-3); vec2 r = vec2(tc.y, -tc.x)/tl;   // (b) a card faces the eye about the upright
        float sw = sin(uFcrT*(.35 + .5*aS.w) + aS.z*40.)*.05 + aT.y;       // each leans its own way and sways slowly at its own pace
        vec3 p = position;
        p.xz += r*(aQ.x*w + sw*aQ.y*aQ.y*h*fl);
        p.y += aQ.y*h;
        p.x += uLeanF.x*aQ.y*aQ.y*h*fl; p.z -= uLeanF.y*aQ.y*aQ.y*h*fl;      // every flame leans back into the fire (the fire draws the air in), and with the wind
        vec4 mv = viewMatrix*vec4(p, 1.);
        gl_Position = projectionMatrix*mv;
        float dist = length(mv.xyz); vFog = 1. - exp(-dist*dist*uHaze.x*uHaze.x - dist/9000.);     // the low air before the fire is thick: far flames sink into it
        vQ = aQ; vF = vec4(aQ.x*w, aQ.y*h, min(min(h, 8.*w), 200.), aS.z); vT = vec2(aT.x, aS.w);      // (a narrow card has forms to its own measure)
      }`,fragmentShader:Ke+Ye+`
      uniform float uFcrT; uniform vec3 uFire; varying vec2 vQ; varying vec4 vF; varying float vFog; varying vec2 vT;
      `+$e+`
      void main(){
        float clr = 1. - clamp(vFog, 0., 1.);
        if (vT.x > 4.5) {                       // low smoke lying on the ground (5); a spot fire's thin leaning plume (6): soft, torn, never dense
          float yn = clamp(vQ.y, 0., 1.), ax = abs(vQ.x), plume = step(5.5, vT.x), hh = max(vF.z, 1.);
          vec3 q = vec3(vF.x/(1.3*hh) + vF.w*37., vF.y/(.8*hh) - uFcrT*(.035 + .06*plume) + vF.w*91., vF.w*13.7 + uFcrT*.012);
          float n1 = fcrN3(q), n = n1*.65 + fcrN3(vec3(mat2(.76, -.65, .65, .76)*q.xy*2.7, q.z + 3.))*.35;
          float wide = mix(1. - smoothstep(.35, 1., ax), 1. - smoothstep(.08 + .45*yn, .30 + .70*yn, ax + (n1 - .5)*.5), plume);
          float al = smoothstep(.30, .72, n)*wide*(1. - smoothstep(.20, .95, yn + (n - .5)*.7))*smoothstep(0., mix(.10, .03, smoothstep(14., 24., hh)), yn)*mix(.38 + .20*smoothstep(10., 16., hh) + .18*smoothstep(26., 40., hh), .20, plume)*clr;      // (a bank is denser than a wisp: 0.58, a great bank 0.76 at the most; no cut foot)
          if (al < .004) discard;
          gl_FragColor = vec4(mix(uFire*vec3(.34, .27, .22)*min(vT.y, 1.2), vec3(.030, .028, .030), mix(.25 + .5*yn, .35 + .6*yn, plume))*al, al); return;
        }
        if (vT.x > 3.5) {                       // a stalk of the forest standing black in the fire: a bent trunk, on some a swollen head
          float yn = clamp(vQ.y, 0., 1.), x = vQ.x - (fcrN3(vec3(yn*2.3 + vF.w*31., vF.w*7., 2.)) - .5)*.9*yn;
          float tr = .15*(1. - .6*yn) + .12*(1. - smoothstep(0., .10, yn));
          float head = step(.72, fract(vF.w*13.))*(1. - smoothstep(.17, .26, length(vec2(x, (yn - .88)*3.4))));
          float al = max((1. - smoothstep(tr*.6, tr, abs(x))), head)*(1. - smoothstep(.96, 1., yn))*clr;
          if (al < .004) discard;
          gl_FragColor = vec4(vec3(.011, .008, .007)*al, al); return;
        }
        if (vT.x > 2.5) {                       // what burns in a spot fire: a dark tuft or stump
          float ax = abs(vQ.x), yn = clamp(vQ.y, 0., 1.);
          float top = (.12 + .88*fcrN3(vec3(vQ.x*4.3 + vF.w*57., vF.w*9., 1.))*fcrN3(vec3(vQ.x*13. + vF.w*31., vF.w*5., 4.))*2.)*(1. - ax*ax);       // a jagged dark heap: a tuft, a stump, a fallen bough
          float tg = max(top, 1e-3);            // (round 6: at the card's two lower corners top is nought: the step's two edges never meet)
          float al = (1. - smoothstep(tg*.8, tg, yn))*(1. - smoothstep(.75, .95, ax))*clr;
          if (al < .004) discard;
          gl_FragColor = vec4(vec3(.012, .009, .007)*al, al); return;
        }
        vec4 c = fcrFlame(vQ, vF.xy, max(vF.z, 1.), vF.w, vT.y, 1.);
        if (vT.x > .5) c *= min(1.8, 1./max(c.a, 1e-3));      // a spot fire has few flames: each is the denser, so that it does not stand as a ghost over its own light
        c *= clr;
        if (c.a < .004) discard;
        gl_FragColor = c;
      }`}),t=new d.Mesh(A.geometry,Q);return t.name="front-flames",t.frustumCulled=!1,t.renderOrder=3,A.mesh=t,A}function mt(s,r,u,e,f){const P=s.strong.length,x=P+10,H=[],R=30;for(let A=0;A<x;A++){const t={x:A<P?s.strong[A].x+r.range(-50,50):-5200+(A-P+r())*1040,period:r.range(24,52),phase:r(),life:r.range(13,18),R:r.range(70,135),rise:r.range(185,300),seed:r(),back:r.range(10,45),on:!0};H.push(t)}const F=x*R,z=new Float32Array(F*4),O=new Float32Array(F*4),V=new Float32Array(F*4),M=new Float32Array(F*4);for(let A=0;A<x;A++){const Q=H[A],t=f(Q.x,s.frontZ(Q.x)-Q.back)-.3,o=[];for(let i=0;i<R;i++){const l=(u()+u()+u()-1.5)/1.5,p=u();o.push({ox:l,oz:u()*2-1,hs:(1-.7*Math.pow(Math.abs(l),1.2))*(.5+.5*p),ws:.3+.3*u(),seed:u(),pace:u(),lean:(u()-.5)*.3})}o.sort((i,l)=>i.oz-l.oz),o.forEach((i,l)=>{const p=(A*R+l)*4;z.set([Q.x,Q.period,Q.phase,Q.life],p),O.set([Q.R,Q.rise,Q.seed,Q.back],p),V.set([i.ox,i.oz,i.hs,i.ws],p),M.set([i.seed,i.pace,i.lean,t],p)})}const n=new d.InstancedBufferGeometry;n.setAttribute("position",new d.Float32BufferAttribute([0,0,0,0,0,0,0,0,0,0,0,0],3)),n.setAttribute("aQ",new d.Float32BufferAttribute(Xe,2)),n.setIndex([0,1,2,0,2,3]);const k=new d.InstancedBufferAttribute(O,4);n.setAttribute("aB",new d.InstancedBufferAttribute(z,4)),n.setAttribute("aC",k),n.setAttribute("aE",new d.InstancedBufferAttribute(V,4)),n.setAttribute("aF",new d.InstancedBufferAttribute(M,4)),n.instanceCount=F;const a=new d.ShaderMaterial({transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:d.DoubleSide,uniforms:{uFcrT:e.uFcrT,uNoise:e.uNoise,uHaze:e.uHaze,uFA:e.uFA,uFK:e.uFK,uFP:e.uFP,uFS:e.uFS,uFire:e.uFire,uFcrLine:e.uFcrLine,uFcrMap:e.uFcrMap,uFcrTab:e.uFcrTab,uLeanF:e.uLeanF},vertexShader:Qe+`
      attribute vec2 aQ; attribute vec4 aB, aC, aE, aF;   // aB: place x (m), period (s), phase, life (s). aC: radius (m; 0 = taken away), rise (m), seed, metres behind the line. aE: this tongue's place across and in depth (-1..1), its share of the rise, of the radius. aF: its slice, pace, lean, the ground there (m)
      uniform vec2 uHaze, uLeanF;
      varying vec2 vQ; varying vec4 vF; varying vec3 vT;
      void main(){
        float cyc = uFcrT/aB.y + aB.z, k = floor(cyc), a = fract(cyc)*aB.y/aB.w;     // the surge's age as a share of its life; past 1 the place rests
        // each surge of a place goes up a little aside of the last, and is a little greater or less (the same law as layout.bursts.at)
        float xk = aB.x + 70.*sin(k*2.399 + aC.z*6.2832);
        float R = aC.x*(1. + .2*sin(k*1.713 + aC.z*17.3 + 1.)), H = aC.y*(1. + .14*sin(k*.917 + aC.z*29.1 + 2.));
        float a2 = a - .035*aF.x;                                                   // its tongues come up and sink a little after one another
        float env = fcrSurgeEnv(a2)*step(a, 1.)*step(.5, aC.x);
        float h = H*aE.z*env*1.9, w = max(R*aE.w*(.45 + .55*env), .14*h)*step(.001, env);      // (no tongue is a tall narrow strip)
        float xt = xk + aE.x*R*1.1;
        vec3 base = vec3(xt, aF.w, fcrFront(xt) - aC.w - 12. - R*.25 + aE.y*R*.30);      // always behind the line, each at its own place along it
        vec2 tc = cameraPosition.xz - base.xz; float tl = max(length(tc), 1e-3); vec2 r = vec2(tc.y, -tc.x)/tl;     // (b)
        vec3 p = base;
        p.xz += r*(aQ.x*w + (aF.z + sin(uFcrT*(.35 + .5*aF.y) + aF.x*40.)*.05)*aQ.y*aQ.y*h);
        p.y += aQ.y*h;
        p.x += uLeanF.x*aQ.y*aQ.y*h; p.z -= uLeanF.y*aQ.y*aQ.y*h;                   // it leans with the rest
        vec4 mv = viewMatrix*vec4(p, 1.);
        gl_Position = projectionMatrix*mv;
        float dist = length(mv.xyz);
        vQ = aQ; vF = vec4(aQ.x*w, aQ.y*h, min(min(h, 6.*w), 200.), aF.x); vT = vec3(aF.y, .45 + .55*(1. - smoothstep(.22, .55, a)), 1. - exp(-dist*dist*uHaze.x*uHaze.x - dist/9000.));
      }`,fragmentShader:Ke+Ye+`
      uniform float uFcrT; uniform vec3 uFire; varying vec2 vQ; varying vec4 vF; varying vec3 vT;
      `+$e+`
      void main(){
        vec4 c = fcrFlame(vQ, vF.xy, max(vF.z, 1.), vF.w, vT.x, clamp(vT.y, 0., 1.))*(1. - clamp(vT.z, 0., 1.));
        if (c.a < .004) discard;
        gl_FragColor = c;
      }`}),c=new d.Mesh(n,a);c.name="front-surges",c.frustumCulled=!1,c.renderOrder=4;const g=A=>A-Math.floor(A),$=(A,Q)=>Q/H[A].period+H[A].phase;return{mesh:c,sites:H,attrC:k,per:R,table:{places:H,cycle:(A,Q)=>Math.floor($(A,Q)),age:(A,Q)=>g($(A,Q))*H[A].period,until:(A,Q)=>(1-g($(A,Q)))*H[A].period,at:(A,Q)=>{const t=H[A],o=t.x+70*Math.sin(Q*2.399+t.seed*6.2832);return{x:o,z:s.frontZ(o)-t.back,R:t.R*(1+.2*Math.sin(Q*1.713+t.seed*17.3+1)),rise:t.rise*(1+.14*Math.sin(Q*.917+t.seed*29.1+2))}}},triangles:F*2}}const st=`
uniform vec4 uFcrSm, uFcrWd;     // uFcrSm x: lean (m back for a m up), y: the greatest top (m), z: how the upper parts are drawn out downwind (1/m), w: the common lean along the line. uFcrWd x: how it thickens with height, y: how far a tower's head spreads, z and w (round 5): where the two long waves of its face stand
uniform vec3 uFcrVel;            // how its forms climb (m/s)
uniform vec3 uFcrAmb; uniform vec4 uFcrHz;      // the dusk's light on the smoke; the haze: its colour, its density
const mat3 fcrR1 = mat3(.36, .48, -.8, -.8, .6, 0., .48, .64, .6);
const mat3 fcrR2 = mat3(0., .8, .6, -.8, .36, -.48, -.6, -.48, .64);
const mat3 fcrR3 = mat3(.6, 0., .8, .64, .6, -.48, -.48, .8, .36);
// what stands over an x of the line: four towers (x of the foot, half width of the head, height, lean along the
// line), the surge there (x, age as a share of its life, radius, rise), the low mass's top
vec4 fcrTw0, fcrTw1, fcrTw2, fcrTw3, fcrSg; float fcrSgW, fcrSgZ, fcrLow, fcrThin, fcrGap;
vec4 fcrOp;      // (round 5) the openings of the low mass at the place last asked of fcrSmEnv: x how far its great forms sag there, y how much of an opening that may be by the height, z the gap of the line under it (by the height), w what the towers and a surge make of the place
void fcrSmLoad(float x, float xs, float xg){
  float u = x*(1./14400.) + .5, us = xs*(1./14400.) + .5;
  fcrTw0 = textureLod(uFcrTab, vec2(us, 1./16.), 0.); fcrTw1 = textureLod(uFcrTab, vec2(us, 3./16.), 0.); fcrTw2 = textureLod(uFcrTab, vec2(us, 5./16.), 0.); fcrTw3 = textureLod(uFcrTab, vec2(us, 13./16.), 0.);
  vec4 A = textureLod(uFcrTab, vec2(u, 7./16.), 0.), B = textureLod(uFcrTab, vec2(u, 9./16.), 0.), C = textureLod(uFcrTab, vec2(u, 11./16.), 0.);
  float cyc = uFcrT/max(A.y, 1.) + A.z, k = floor(cyc), a = fract(cyc)*A.y/max(A.w, 1.);
  float xk = A.x + 70.*sin(k*2.399 + B.x*6.2832);
  fcrSg = vec4(xk, a, B.y*(1. + .2*sin(k*1.713 + B.x*17.3 + 1.)), B.z*(1. + .14*sin(k*.917 + B.x*29.1 + 2.)));
  fcrSgW = C.y*smoothstep(0., 150., C.x)*step(a, 1.);
  fcrSgZ = fcrFront(xk) - B.w - 40.;
  fcrLow = max(C.z, 40.); fcrThin = C.w; fcrGap = fcrLine2(xg).b;      // (round 4: one look more: over a gap of the line no smoke is born)
}
float fcrSmax(float a, float b){ float h = max(.3 - abs(a - b), 0.); return max(a, b) + h*h*(.25/.3); }
// a tower: a leaning column, narrow at its foot, widening into its head, round on top; its trunk wanders
void fcrSmTower(vec4 q, vec3 p, float y, float b, float wob, inout float E, inout float cap){
  if (q.z < 1.) return;
  float v = y/q.z, wx = q.y*(.42 + .58*smoothstep(0., .55, v))*(1. + uFcrWd.y*smoothstep(.45, .88, v));      // in a still air its head spreads
  float ux = (p.x - q.x - q.w*y + 280.*wob*smoothstep(.04, .4, v))/wx;
  float ct = max(v - .74, 0.)*(1./.26);
  float e = 1. - sqrt(ux*ux + b*b + ct*ct);
  if (e > E) cap = ct;
  E = fcrSmax(E, e);
}
// x: 1 in the core of the mass, 0 at its faces; y: 0 in its body .. 1 at the top of what stands here;
// z: half thickness (m); w: -1 at the face toward the fire .. +1 at the far face
vec4 fcrSmEnv(vec3 p, bool load){
  float y = max(p.y, 0.), w = 100. + uFcrWd.x*y;
  float zl = mix(fcrFront(p.x), fcrFrontS(p.x), smoothstep(0., 500., y));           // its foot follows the line itself; higher it forgets the small lobes
  float b = (zl - p.z - (40. + uFcrSm.x*y + uFcrSm.z*y*y))/w;                             // it leans back, and its upper parts are drawn out downwind
  // (round 5) NO PLANE ALONG THE LINE: over one to two kilometres of the line the mass stands nearer here and farther there, and differently at each
  // height (three waves of 610, 1,270 and 2,130 m: up to 45 m either way at 150 m up, 150 m + 0.09 of the height from 600 m up, nothing under 15 m: its foot stays over the flames, and it does not come over the eye of a flight along the wall). Seen along its length the wall is
  // lobe behind lobe, each with its own slant, and no face is a leaning sheet. No look.
  b += (40.*smoothstep(15., 150., y) + 90.*smoothstep(150., 600., y) + .08*y)*(.50*sin(p.x*(6.2832/1270.) + y*.0043 + uFcrWd.z) + .38*sin(p.x*(6.2832/2130.) - y*.0029 + uFcrWd.w) + .30*sin(p.x*(6.2832/610.) + y*.0071 + 2.*uFcrWd.z))/w;
  if (abs(b) > 3.3) { fcrOp = vec4(0., 0., 0., -9.); return vec4(.5 - abs(b), 0., w, b); }
  float wob = fcrN3(fcrR3*(p - uFcrVel*uFcrT)*(1./330.) + vec3(7.7, 2.2, 5.1)) - .5;       // flanks and faces billow: no plane, no smooth outline
  if (load) fcrSmLoad(p.x, p.x - uFcrSm.w*y, p.x - uFcrSm.w*y + 260.*wob);             // (the opening over a gap wanders with the great forms: its flanks are no upright curtain)
  b += wob*.9*smoothstep(15., 150., y);                                                 // (round 4: from 15 m up, 40 before: seen along its length the near face is no slanted plane)
  float cap = max(y/(fcrLow*(1. + .6*wob)) - .50, 0.)*(1./.50);
  float E = 1. - sqrt(b*b + cap*cap) - fcrThin*(1. - smoothstep(150., 500., y));      // the low mass (over the low stretches less of it: sparse rolls, not a fog)
  // (round 5) WHERE IT STANDS OPEN (where its great forms sag, 150 to 300 m wide; over a gap of the line, to some 200 m up) is no longer cut here: round 4 took a
  // smooth steep piece out of the envelope, and the rim of every opening was a smooth cut, straight over a hundred metres and more, leaning with the wind (a slot
  // with two straight sides over a gap of the line: the pale pane). The openings are handed on (fcrOp) and cut in fcrSmField, where the billows are known: their
  // rims are broken by the billows of 240 and 95 m and rolled by the smaller ones, as every other face is. The towers and a surge stand through an opening as before.
  float Et = -9., capT = 0.;
  fcrSmTower(fcrTw0, p, y, b, wob, Et, capT); fcrSmTower(fcrTw1, p, y, b, wob, Et, capT); fcrSmTower(fcrTw2, p, y, b, wob, Et, capT); fcrSmTower(fcrTw3, p, y, b, wob, Et, capT);
  if (fcrSgW > 0.) {                                                                   // over a surge the wall's own smoke stands up: no column apart, no ball
    float a = fcrSg.y, up = smoothstep(0., .08, a)*fcrSgW, yh = 60. + 2.4*fcrSg.w*(1. - exp(-3.2*a)), Rr = fcrSg.z*(1.1 + 1.2*a);
    float dx = (p.x - fcrSg.x - uFcrSm.w*y + 180.*wob*smoothstep(.1, .6, y/yh))/Rr;
    float topS = fcrLow*(1. + .6*wob) + max(yh*(.85 + .5*wob) - fcrLow, 0.)*up*exp(-dx*dx*dx*dx*1.1);      // (a broad swell of the low mass, as torn as the rest; round 5: round on top with full shoulders. It was a bell: from far a pale peak with a point and two straight flanks)
    float capS = max(y/topS - .50, 0.)*2.;
    float eS = 1. - sqrt(b*b + capS*capS) - 3.*smoothstep(.50, 1., a)*smoothstep(.7*fcrLow, 1.3*fcrLow, y);      // (what stood up thins away into the towers)
    if (eS > Et) capT = capS;
    Et = fcrSmax(Et, eS);
  }
  fcrOp = vec4(-wob, smoothstep(30., 90., y)*(1. - smoothstep(350., 700., y)), fcrGap*(1. - smoothstep(70., 260., y)), Et);
  if (Et > E) cap = capT;
  E = fcrSmax(E, Et);
  return vec4(E, cap, w, b);
}
float fcrBig, fcrMid, fcrAo, fcrSmooth, fcrCoarse, fcrLumpD, fcrNearK; bool fcrWant = false;
float fcrBil(float g){ float d = 2.*g - 1.; return (sqrt(d*d + .03) - .173)*1.15; }      // (the crease is a rounded valley, not a cut: no vein)
// THE SMOKE'S COLOUR at a place inside it (after fcrSmField there). lit 0..1: how much of the fire's light reaches the
// place (its facing, what stands between); ao: the creases between billows. BY HEIGHT (round 4): hot orange at the
// foot among the flames, deep orange over them, rust at 300 to 600 m, brown to 1,100 m, then a grey-violet that takes
// the dusk's blue; the shade is deep low down (bright undersides, dark cores) and soft higher up (no black in red).
vec3 fcrSmCol(vec3 p, vec4 e, float lit, float ao){
  float y = max(p.y, 0.), str = mix(1.15, 2.*fcrLine(p.x + (fcrBig - .5)*500.).g, exp(-y/300.));      // greater over a surge, less over a low stretch; higher up the light is the whole line's
  str = 1.6*str/(1. + .6*str)*fcrFlick(p.x);                                           // (round 4: at most 1.45, 2 before: over the strongest places the smoke was lit so hard that its forms went pale and flat)
  float I = .80*exp(-y/150.) + .32*exp(-y/520.) + .13*exp(-y/1800.), hi = smoothstep(200., 1100., y), soft = smoothstep(120., 800., y);
  vec3 lc = mix(uFire*vec3(1., .85, .7), uFire.r*vec3(.62, .30, .17), hi);
  vec3 alb = mix(vec3(.62, .44, .30), vec3(.54, .50, .57), smoothstep(250., 1700., y))*mix(.62 + .56*smoothstep(.28, .72, fcrMid), 1., soft);      // (low down some billows are sooty, some pale: masses apart)
  // (what the fire's light does not reach is not black in red: low down it takes the light the smoke round it has scattered, a dark brown)
  lit = mix(smoothstep(.12, .88, lit), lit, soft);                                    // (low down a roll's lit underside ends at a line: light and dark stand apart, the picture has a form in its brightness and not in its red alone)
  vec3 c = alb*((lc*(lit*mix(1.42, .42, soft)) + mix(uFire.r*vec3(.64, .39, .26), lc, soft)*mix(.13, .58, soft))*(1.2*I*str*mix(1., .5, smoothstep(-.5, .6, e.w))*mix(ao, 1., .55*soft))
    + uFcrAmb*(mix(.5 + .8*(1. - lit), (.30 + 1.10*lit)*(.55 + .45*ao), smoothstep(150., 600., y))*(.6 + mix(.2, .6, hi)*e.y)*mix(1.15, 1.7, hi)));      // (round 5: high up a body has a light and a dark side and darkens into its creases: no evenly grey pane)
  // the fire inside the foot of the mass. From far it glows through the whole foot; near to (round 4) it is seen where the smoke is thin, in the creases
  // between the billows, and the billows' bodies stand dark before it: no even orange fog over the flames
  float cr = 1.05 - ao;
  return c + lc*(.30*str*mix(ao, cr*cr, fcrNearK)*exp(-y/85.)*exp(-abs(e.w*e.z + 15.)/70.));
}
// the colour of the thin smoke round the mass at a height: the fire's light from below, scattered; the dusk's blue higher up
vec3 fcrVeilCol(float y){
  float I = .80*exp(-y/150.) + .32*exp(-y/520.) + .13*exp(-y/1800.);
  return mix(vec3(.62, .44, .30), vec3(.54, .50, .57), smoothstep(250., 1700., y))*(uFire.r*mix(vec3(.60, .26, .12), vec3(.58, .26, .15), smoothstep(200., 1100., y))*(.50*I) + uFcrAmb*mix(.35, .85, smoothstep(250., 1700., y)));      // (round 5: a deep rust low down and dimmer; it was a pale tan, and an opening that showed it read as a grey pane)
}
vec3 fcrSmShade(vec3 p, vec4 e){ return fcrSmCol(p, e, mix(.20, .64, smoothstep(.30, .70, fcrMid)), fcrAo); }      // (without the look toward the fire, for the far wall and for mirrors: round 5, its billows of 240 m stand light and dark by turns; it was one even tone)
float fcrSig(float st){ return min(.22, .9/st); }      // (round 5) how dense the mass is drawn (1/m), by the length of the ray's step: a full step inside a body lets two fifths through, so that with its soft face a ray goes two steps and more into a body before it is hidden, at every distance: every outline is a soft rim and no cut, and a body still hides what is behind it
// the field: > 0 inside the smoke. lod: the length of the ray's step there (m); forms under two steps are left out
float fcrSmField(vec3 p, vec4 e, float lod){
  vec3 q = p - uFcrVel*uFcrT;
  float k3 = 1. - smoothstep(45., 120., lod), k4 = 1. - smoothstep(20., 55., lod);
  float g1 = fcrN3(fcrR1*q*(1./620.) + vec3(3.3, 1.7, 8.1));                            // a few great slow masses
  q += (g1 - .5)*vec3(150., 90., 150.);                                              // which push the lesser ones about: no billow is a ball
  float g2 = fcrN3(fcrR2*q*(1./240.) + vec3(11.3, 4.1, 7.7));                           // billows on them
  float g3 = .5; if (k3 > 0.) g3 = mix(.5, fcrN3(fcrR3*(q + (g2 - .5)*vec3(50., 30., 50.))*(1./95.) + vec3(5., -uFcrT*.02, 1.)), k3);      // and smaller ones on those (not looked up where a step is too long for them)
  float b2 = fcrBil(g2), b3 = fcrBil(g3);                                            // a billow is round outward and creased where it meets the next
  float carve = mix(.78, 1., smoothstep(0., 300., p.y));                             // rolls from its foot up; the billows open as it climbs
  // (round 5) the openings, cut here with the billows in their rims: where the great forms sag, and over a gap of the line; what a tower or a surge makes of the place stands
  float ex = max(e.x - 2.*smoothstep(.08, .32, fcrOp.x + (g2 - .5)*.30 + (g3 - .5)*.16*k3)*fcrOp.y - 1.7*smoothstep(.25, .85, fcrOp.z + ((g2 - .5)*.5 + (g3 - .5)*.25*k3)*step(.02, fcrOp.z)), fcrOp.w);
  // clear air: near the ground the mass thins out toward +Z and is gone 50 m before the line. (Round 5: the face this leaves SLOPES up and out from the foot to some 350 m:
  // round 4 took the mass's near third away below a level of 60 to 200 m, which left a level underside along the whole wall: a dark flat sheet with a straight lower edge)
  fcrSmooth = ex*1.05 - 1.4*smoothstep(0., .85, -e.w + (g2 - .5)*.9 + (g3 - .5)*.5 - .30 - 1.05*smoothstep(15., 380., p.y));
  // (round 5) the billows reach out beyond the face, to 0.6 of the mass's half width: round 4 let them end 0.3 beyond it, and whatever was thin outside a face (its rim,
  // the veil) followed the smooth leaning envelope: seen along the wall, one long smooth slanting edge. Now the rim itself is rounded by the billows of 620, 240 and 95 m.
  float f = fcrSmooth + ((g1 - .5)*.80 + (b2 - .32)*.62 + (b3 - .32)*.46*k3)*carve*smoothstep(-.6, -.05, ex);
  float b4 = .32, b5 = .5, k5 = 0.; fcrCoarse = f; fcrLumpD = 0.;
  if (k4 > 0. && f > -.7) {                                                          // the smallest billows; at the faces they tear it into wisps
    vec3 q4 = (q + (g3 - .5)*vec3(34., 20., 34.))*vec3(1., .62, 1.);                 // (pushed about by the greater ones and drawn out upward: no ball)
    b4 = fcrBil(fcrN3(fcrR1*q4*(1./38.) + vec3(2., -uFcrT*.05, 8.)));
    float edge = 1. - smoothstep(.1, .8, abs(f)), amp = (.28 + .22*edge)*carve;
    float lump = (b4 - .32)*amp; if (lump > 0.) lump *= smoothstep(-.34, -.04, f);      // (a lump swells a face; it does not stand adrift before it: no ball)
    if (fcrWant) fcrLumpD = (b4 - fcrBil(fcrN3(fcrR1*(q4 - vec3(0., 9., 0.))*(1./38.) + vec3(2., -uFcrT*.05, 8.))))*amp*k4;      // (for the light: the same lump 14 m lower; one look, only where the ray shades)
    f += (lump - fcrN3(fcrR2*q*(1./15.) + vec3(4., -uFcrT*.09, 2.))*(.16 + .16*edge)*(1. - smoothstep(8., 20., lod)))*k4;      // (they roll its faces and tear into it: no specks adrift before a face)
    if (lod < 6.) {                                                                  // near to (steps under 6 m: within 750 m of the eye) the faces are rolled once more, 6.5 m: one more look there
      b5 = fcrN3(fcrR3*((q + uFcrVel*(uFcrT*.45) + (g3 - .5)*vec3(34., 20., 34.) + (b4 - .5)*vec3(9., 5., 9.)))*(1./7.5) + vec3(1., -uFcrT*.13, 6.));      // (they climb at 0.55 of the mass's speed: a place sees one pass at most 1.8 times a second)
      k5 = 1. - smoothstep(3.6, 6., lod);
      f += (b5 - .5)*(.10 + .14*edge)*k5*smoothstep(-.30, 0., f);                     // (plain small swells pushed about by the greater ones: no net of creases, no scales)
    }
  }
  if (fcrWant && k4 <= 0. && k3 > 0.) fcrLumpD = (b3 - fcrBil(mix(.5, fcrN3(fcrR3*(q + (g2 - .5)*vec3(50., 30., 50.) - vec3(0., 30., 0.))*(1./95.) + vec3(5., -uFcrT*.02, 1.)), k3)))*.46*carve;      // (for a mirror's light: the 95 m billow 30 m lower; one look, never in the eye's own march)
  fcrNearK = 1. - smoothstep(6., 16., lod);
  fcrBig = g1; fcrMid = g2; fcrAo = (.50 + .50*smoothstep(0., .70, b2))*mix(1., .55 + .45*smoothstep(0., .62, b3), k3)*mix(1., .62 + .38*smoothstep(0., .55, b4), k4)*mix(1., .74 + .26*smoothstep(.28, .62, b5), k5);      // (a billow darkens toward its creases over its whole flank: a round form, no vein)
  return f;
}
`,pt=st+`
vec4 fcrSmokeMirror(vec3 ro, vec3 rd){
  float sl = uFcrSm.x - 2.25*uFcrWd.x - .094, g0 = ro.z + sl*ro.y - (uFS.x*1.3 + 365.), den = rd.z + sl*rd.y;      // (the leaning plane no smoke stands before: round 5, beyond every swell of its face)
  float t = g0 <= 0. ? 0. : (den < -1e-4 ? -g0/den : 1e9);
  vec3 col = vec3(0.); float Tr = 1.;
  if (t < 9000.) {
    // (round 4) the steps find WHERE the ray enters the mass and how thick the mass is behind that place; its colour is
    // taken once, at the place of entry itself: no bands where a long step moves from one height to the next
    float st = 45. + .05*t, tp = t, fp = -1.5, tc = -1., sAcc = 0., tA = t, rng = 54.*st; t += .5*st;      // (round 5: the steps reach 2.4 km and more, and what they meet in the last half of that way fades: where the steps run out is no edge in the water)
    for (int i = 0; i < 9; i++) {                                         // (nine steps, ten before: the fourth tower's look in each is paid for)
      vec3 p = ro + rd*t; vec4 e = fcrSmEnv(p, true); float f = -1.6;
      if (e.x > -1.5 && p.y < 3700.) {
        f = 1.05*e.x; if (e.x > -.9) f = fcrSmField(p, e, 200.);
        if (f > 0.) {
          if (tc < 0.) tc = mix(tp, t, clamp(-fp/(f - fp), 0., 1.));
          float rho = smoothstep(0., .40, f), a = 1. - exp(-rho*(.25 + .75*rho)*min(st, t - tc)*(1./45.));      // (thinner than the mass itself: its outline in the water is soft)
          a *= 1. - smoothstep(.5, 1., (t - tA)/rng);
          sAcc += Tr*a; Tr *= 1. - a;
        }                                                                  // (round 5: the thin smoke round the mass is no longer in the mirror: its marched shell had a surface)
      }
      tp = t; fp = min(f, 0.); t += st; st *= 1.42;
    }
    if (tc >= 0.) {                                                        // the face the ray came in by: its billows of 95 m, their undersides lit, the fire in its creases
      vec3 pc = ro + rd*tc; vec4 e = fcrSmEnv(pc, true);
      fcrWant = true; fcrSmField(pc, e, 60.); fcrWant = false; fcrNearK = 1.;
      col += sAcc*mix(fcrSmCol(pc, e, .5*smoothstep(-.12, .16, fcrLumpD), fcrAo), uFcrHz.rgb, 1. - exp(-tc*tc*uFcrHz.w*uFcrHz.w));
    }
  }
  return vec4(col, 1. - Tr);
}
// THE SMOKE BEFORE A SOLID THING (round 4; a gift for the world's land): the smoke is one pass on the far plane, so land
// that the eye sees THROUGH smoke (the ground of a farther lobe behind a nearer one, seen along the wall) would stand
// unveiled in it. fcrSmokeVeil(ro, p): what the smoke between the eye at ro and the place p lays over p: rgb
// premultiplied (with the haze of the way), a its thickness. Use: colour = colour*(1. - v.a) + v.rgb. Nine even steps with
// the great forms only; a step outside the mass looks nothing up (at the worst 9 x 12 looks; none where p is nearer
// than 90 m). By place and the world clock.
vec4 fcrSmokeVeil(vec3 ro, vec3 p){
  vec3 d = p - ro; float L = length(d); if (L < 90.) return vec4(0.);
  vec3 rd = d/L, col = vec3(0.); float st = (L - 40.)*(1./9.), t = .5*st, Tr = 1.;      // (the smoke that stands over the place itself is not laid on it: only what is 40 m and more before it)
  for (int i = 0; i < 9; i++) {
    vec3 q = ro + rd*t; float y = max(q.y, 0.), b = (fcrFront(q.x) - q.z - (40. + uFcrSm.x*y + uFcrSm.z*y*y))/(100. + uFcrWd.x*y);
    if (b > -2.2 && b < 3.1) {                                          // (round 5: wider, for the long waves of the mass's face)
      vec4 e = fcrSmEnv(q, true);
      if (e.x > -.6) {
        float f = fcrSmField(q, e, 200.);
        if (f > 0.) { float rho = smoothstep(0., .40, f), a = 1. - exp(-rho*(.25 + .75*rho)*st*(1./15.)); col += Tr*a*mix(fcrSmShade(q, e), uFcrHz.rgb, 1. - exp(-t*t*uFcrHz.w*uFcrHz.w)); Tr *= 1. - a; }
      }
    }
    t += st;
  }
  return vec4(col, 1. - Tr);
}
// THE FLAMES FOR A MIRROR (round 4: made to fill the lower half of a picture from 150 m). Three depths of the belt, the
// nearest first; in each, bodies of very different height (a great one beside a low run), tongues that rise and sway,
// dark gaps between them, a heart low down, torn tops; over a surge they leap with it (the same table). Each stands on
// the land's height at its end. 18 looks (it was 3). By place and the world clock.
// where a ray first comes to a given number of metres (back) behind the line (round 5; no look: the line is a sum of waves). A safe march by the line's steepest slope: it never
// oversteps, so a ray that runs along a lobed line meets the flank it truly meets. (Round 4 solved for the crossing in two guesses: a ray nearer the line's
// direction than some 45 degrees landed at a wrong place, the flames ended there at a hard upright edge in the water, and beside it stood an even slab.)
// res: how far short of the belt the ray still is when the march ends (m): nought where it is met.
float fcrBeltT(vec3 ro, vec3 rd, float back, float S, out float res){
  float t = 0.; res = 0.;
  for (int i = 0; i < 7; i++) {
    res = ro.z + rd.z*t - fcrFront(ro.x + rd.x*t) + back;
    if (res <= .5) break;
    t += res/S;
  }
  return t;
}
vec4 fcrFlameMirror(vec3 ro, vec3 rd){
  if (rd.z > -1e-3) return vec4(0.);
  vec3 col = vec3(0.); float Tr = 1., t = 0., res;
  float S = -rd.z + (1. + 2.*uFS.y)*dot(abs(uFA), abs(uFK))*abs(rd.x);
  float x0 = ro.x + rd.x*fcrBeltT(ro, rd, 30., S, res);
  vec4 ln = fcrLine(x0), q; float H = fcrScorch(vec3(x0, 0., fcrFront(x0))).w*255., gy = fcrLine2(x0).r*128.;
  float Hs = fcrSurge(x0, q); Hs *= q.w*fcrSurgeEnv(q.y)*exp(-q.x*q.x/max(q.z*q.z, 1.));
  for (int i = 0; i < 3; i++) {
    float fi = float(i), back = ln.b*80. + ln.a*160.*(.10 + .36*fi) + 4.;
    t = fcrBeltT(ro, rd, back, S, res);                                    // where the ray meets this depth of the belt
    vec3 p = ro + rd*t; float y = max(p.y - gy, 0.);
    float body = fcrN3(vec3(p.x*(1./64.) + fi*17.3, fi*5.1, 2.5));
    float Hl = max(H*(.40 + 1.15*body), Hs*(.55 + .6*body)), yf = y/max(Hl, 1.);
    float sway = fcrN3(vec3(p.x*(1./37.) + fi*9., y*(1./70.) - uFcrT*.22, 5. + fi)) - .5;
    vec3 q1 = vec3((p.x + sway*26.)*(1./13.), y*(1./30.) - uFcrT*.75, 1.3 + fi*3.7);
    float tex = fcrN3(q1)*.6 + fcrN3(q1*vec3(2.9, 2.3, 1.) + vec3(4.1, -uFcrT*.9, 9.2))*.4;
    // (round 5: NO SLAB. Round 4 drew the tongues in full contrast with dark cut between them: in a water they hung down as hard-edged blocks. Now a
    // tongue's sides are soft, the dark between tongues is a thin dim fire and no cut, and the whole image is brightest at the bank and FADES toward the
    // flames' tops, which are torn and soft: a body has no side and no end that is a line)
    float fade = pow(1. - min(yf, 1.), 1.5), tx = smoothstep(.15, .90, tex);
    float a = (1. - smoothstep(.40, 1.05, yf + (tex - .5)*.9))*fade*(.15 + .85*tx)*smoothstep(1., 4., Hl)*(1. - smoothstep(2., 14., res))*.9;
    col += Tr*a*.8*fcrRamp(clamp((.12 + .88*tex)*(.40 + .60*fade)*(.60 + .5*body) + .06, 0., .70)); Tr *= 1. - a;      // (never brighter than the flames themselves: orange, no white)
  }
  float clr = exp(-t*t*uFcrHz.w*uFcrHz.w);
  return vec4(col*clr, (1. - Tr)*clr);
}
`;function wt(s,r,u,e){let f=-1/0;for(let H=-se;H<=se;H+=10)f=Math.max(f,s.frontS(H));const P=new d.ShaderMaterial({transparent:!0,depthWrite:!1,depthTest:!0,premultipliedAlpha:!0,side:d.BackSide,defines:e?{STEPS:u,FARSTEPS:u>=56?10:6,FCR_BOLT:1}:{STEPS:u,FARSTEPS:u>=56?10:6},uniforms:{uBolt:r.uBolt,uBoltI:r.uBoltI,uFcrT:r.uFcrT,uNoise:r.uNoise,uHaze:r.uHaze,uHazeCol:r.uHazeCol,uFA:r.uFA,uFK:r.uFK,uFP:r.uFP,uFS:r.uFS,uFire:r.uFire,uFcrLine:r.uFcrLine,uFcrMap:r.uFcrMap,uFcrTab:r.uFcrTab,uFcrSm:r.uFcrSm,uFcrVel:r.uFcrVel,uFcrWd:r.uFcrWd,uFcrAmb:r.uFcrAmb,uFcrHz:r.uFcrHz,uAmb:r.uAmb,uGroundY:r.uGroundY,uFace:{value:new d.Vector2(Math.max(f,s.zHi)+345,s.lean-2.25*s.thick-.094)}},vertexShader:`
      varying vec3 vDir;
      void main(){ vDir = position; vec4 p = projectionMatrix*vec4(mat3(viewMatrix)*position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:Qe+Ke+tt+st+`
      uniform vec3 uAmb, uHazeCol; uniform float uGroundY, uBoltI; uniform vec2 uFace, uHaze; uniform vec4 uBolt;
      varying vec3 vDir;
      // THE HIGH THIN SMOKE (round 5; it replaces the marched veil of round 4, whose outer bound was a surface: seen along the wall it
      // stood as a dark sheet with a straight edge, and the march's start plane and the towers' table cut it). It is a field WITHOUT A
      // SURFACE: thickest inside the wall's own slab (between its towers, in its gaps, over its low parts), falling away by half every
      // 140 to 500 m before the wall's near face (more slowly the higher) and every 350 to 1,000 m behind its far face, nothing at the
      // ground, most at 350 m, a fifth at 2 km. So the fire's smoke meets the clear night by degrees from every way a look can go:
      // the stars dim over some degrees, the glow is carried across, a gap shows the sky dimmed, and the wall seen along its length
      // fades into it. No step of the march and no look: its depth along the ray is summed at fourteen places.
      float fcrThinAt(vec3 p){
        float y = max(p.y, 0.), zl = fcrFrontS(p.x);
        float dF = p.z - zl - 60. + (uFcrSm.x - uFcrWd.x)*y, dB = zl - 140. - (uFcrSm.x + uFcrWd.x)*y - p.z;      // metres before the mass's near face, metres behind its far one
        return (exp(-y*(1./1200.)) - exp(-y*(1./150.)))*exp(-max(dF, 0.)/(200. + .22*y) - max(dB, 0.)/(500. + .5*y));
      }
      void main(){
        vec3 ro = cameraPosition, rd = normalize(vDir);                    // (a) the eye's ray
        // the burnt ground behind the line: the land's own height where it ends, carried on behind
        float tG = 1e9;
        if (rd.y < -1e-4) {
          tG = (ro.y - uGroundY)/(-rd.y);
          for (int i = 0; i < 3; i++) tG = max((ro.y - (fcrLine2(ro.x + rd.x*min(tG, 30000.)).r*128. + uGroundY))/(-rd.y), 0.);
        }
        vec3 gp = ro + rd*min(tG, 30000.);
        vec3 gem = fcrEmber(gp, fcrScorchF(gp));                           // (c) outside every branch: it reads the pixel's footprint
        float tEnd = min(tG, 18000.);
        if (rd.y > 1e-4) tEnd = min(tEnd, (3700. - ro.y)/rd.y);
        float g0 = ro.z + uFace.y*ro.y - uFace.x, den = rd.z + uFace.y*rd.y;      // the leaning plane no smoke stands before (round 5: farther out, beyond every swell of the mass's face; no smoke of any kind ends at it)
        float tIn = g0 <= 0. ? 0. : (den < -1e-4 ? -g0/den : 1e9);
        vec3 col = vec3(0.); float Tr = 1., tOp = 1e9;
        if (tIn < tEnd) {
          // Outside the mass the ray goes in long steps that lengthen with the way gone and looks at the great forms only.
          // Where they come within reach (the shell the small forms can stand out by), it finds that shell's face and
          // goes on in short steps (by the distance: a form of some pixels is met several times) with every form.
          const float SH = .36;
          float st0 = clamp(.011*tIn, 9., 44.);
          float t = tIn + st0*textureLod(uNoise, (floor(gl_FragCoord.xy) + .5)*(1./256.), 0.).b, tPrev = tIn, dPrev = 0.;
          bool inside = false; int nb = 0;
          for (int i = 0; i < STEPS; i++) {
            if (t > tEnd || Tr < .02) break;
            vec3 p = ro + rd*t; vec4 e = fcrSmEnv(p, true);
            // (round 5) a ray that has used half its steps goes on in longer ones (up to six times), and the forms it draws coarsen with them:
            // it is not out of steps while it is still among the near billows, and what it draws beyond passes over by degrees into the far wall
            float lg = 1. + 5.*smoothstep(.5, 1., float(i)*(1./float(STEPS)));
            float stO = st0 + .06*(t - tIn), stI = min(clamp(.008*t, 3.5, 32.), stO)*lg, st = stO;
            if (e.x > -.9) {
              float f0 = 0.; if (!inside) f0 = fcrSmField(p, e, stO);
              if (!inside && f0 > -SH) {
                float lo = tPrev, hi = t;
                if (nb < 3) { nb++;                                         // (a face is sought at most three times along a ray: a firm cap)
                for (int k = 0; k < 5; k++) { float mid = .5*(lo + hi); vec3 pm = ro + rd*mid; if (fcrSmField(pm, fcrSmEnv(pm, false), stO) > -SH) hi = mid; else lo = mid; }
                t = hi; tPrev = lo; p = ro + rd*t; e = fcrSmEnv(p, false); }
                inside = true; dPrev = 0.;
                stI = min(clamp(.008*t, 3.5, 32.), stO)*lg;
              }
              if (inside) {
                fcrWant = true; float f = fcrSmField(p, e, stI); fcrWant = false;
                st = stI*(1. + 2.5*clamp(-f*(1./SH), 0., 1.));              // through the empty part of the shell a little faster
                if (f < -SH - .12) { inside = false; dPrev = 0.; st = stO; }
                else if (f > -.36) {                                        // (round 5: THE RIM. The mass's density does not begin at its face: it rises from nought over the 25 to 45 m before it, by the same field, so that every billow, wisp and gap's rim is see-through before it is solid, near and far)
                  float y = max(p.y, 0.), ao = fcrAo, gb = fcrBig, gm = fcrMid, sm = fcrSmooth, fc = fcrCoarse, lD = fcrLumpD, nk = fcrNearK, rch = max(22. + .12*y, .025*t), lowk = 1. - smoothstep(150., 500., y);
                  // two looks toward the fire: is there smoke between? a near one (this billow's facing) and a far one with the great forms only (the mass's own shade: dark cores).
                  // Low down the fire is under the mass (round 4). There the near look goes straight down to the flames, and it asks for the billow's own facing, not
                  // for the mass's (which stands whole between any face and the fire): every roll has a lit underside and a dark top, and its flank goes from one to the other.
                  vec3 ld = normalize(mix(vec3(0., -.82, .57), vec3(-.6*uFcrSm.w, -1., .22), lowk));
                  vec3 p2 = p + ld*rch, p3 = p + vec3(0., -.82, .57)*(3.6*rch);
                  float f2 = fcrSmField(p2, fcrSmEnv(p2, false), max(stI, 56.)); sm -= fcrSmooth;
                  float f3 = fcrSmField(p3, fcrSmEnv(p3, false), 200.);
                  float sh = smoothstep(mix(-.12, -.24, lowk), mix(.42, .32, lowk), mix(f, fc + lD, lowk) - f2 - .85*lowk*sm)*mix(.30 + .70*smoothstep(-.25, .50, f - f3), 1., smoothstep(500., 1200., y));
                  fcrBig = gb; fcrMid = gm; fcrNearK = nk;
                  float rho = smoothstep(0., mix(.19, .40, smoothstep(6., 32., stI)), f);      // a face is as crisp as the steps can hold: near, a roll has an outline (round 5: .19, .15 before: its outline against the night is a little softer)
                  float thin = mix(1. - min(fcrThin, .3), 1., smoothstep(150., 500., y));      // the low stretches give thinner smoke (and less of it: see fcrSmEnv)
                  float hal = smoothstep(-.36, 0., f);
                  float dn = fcrSig(stI)*(mix(.12, .20, smoothstep(6., 20., stI))*hal*hal + rho*(.25 + .75*rho))*(1. - .5*smoothstep(.25, 1., e.y))*thin;      // soft at every face, thinner toward every top; near, where the steps are short, dense enough for a roll to hide what is behind it
                  float a = 1. - exp(-.5*(dn + dPrev)*(t - tPrev)); dPrev = dn;
                  vec3 c = fcrSmCol(p, e, sh, ao);                              // billow by billow: bright undersides, dark cores; soft shade higher up
                  vec3 alb = mix(vec3(.62, .44, .30), vec3(.50, .48, .58), smoothstep(250., 1700., y)), fcol = uFire*mix(vec3(1., .85, .7), vec3(1., .6, .35), smoothstep(30., 800., y));
                  if (fcrSgW > 0.) {                                            // a surge lights the smoke over it from within
                    float hs = smoothstep(0., .08, fcrSg.y)*(1. - smoothstep(.22, .80, fcrSg.y))*fcrSgW, yh = 60. + 2.4*fcrSg.w*(1. - exp(-3.2*fcrSg.y));
                    vec2 dh = vec2((p.x - fcrSg.x - uFcrSm.w*y)*.75, p.z - (fcrSgZ - uFcrSm.x*y));
                    c += fcol*alb*(1.3*hs*exp(-dot(dh, dh)/(4.8*fcrSg.z*fcrSg.z))*exp(-y/(.55*yh))*(1.15 - ao)*(.45 + .55*sh));      // (a red heart low in what stands up, seen in the creases between its billows: no lit column, no ball)
                  }
                  #ifdef FCR_BOLT
                  { vec3 db = (p - uBolt.xyz)*vec3(1., 1., .3); float qb = 1. + dot(db, db)/(uBolt.w*uBolt.w); c += vec3(.40, .38, 1.)*(1.15*uBoltI*(.35 + .65*ao)/(qb*qb)); }      // dry lightning: a light inside the mass, seen through its billows
                  #endif
                  float fog = 1. - exp(-t*t*uHaze.x*uHaze.x);
                  col += Tr*a*mix(c, uHazeCol, fog); Tr *= 1. - a;
                  if (Tr < .5) tOp = min(tOp, t);
                } else dPrev = 0.;
              }
            } else { inside = false; dPrev = 0.; st = max(st, (-e.x - .8)*45.); }
            tPrev = t; t += st;
          }
          // a ray that runs along the wall is out of steps before it is out of smoke: the wall beyond, in long steps, with its billows of 240 and 95 m
          // (round 5: as dense as the march draws it at that step, and light and dark by its billows: no even sheet where the two meet)
          if (Tr > .03 && t < tEnd) {
            float st2 = max(t - tPrev, 60.);
            for (int i = 0; i < FARSTEPS; i++) {
              if (t > tEnd || Tr < .03) break;
              vec3 p = ro + rd*t; vec4 e = fcrSmEnv(p, true);
              if (e.x > -.9) {
                float f = fcrSmField(p, e, st2);
                if (f > -.36) {
                  float rho = smoothstep(0., .40, f), hal = smoothstep(-.36, 0., f), a = 1. - exp(-fcrSig(st2)*(.20*hal*hal + rho*(.25 + .75*rho))*(1. - .5*smoothstep(.25, 1., e.y))*st2);
                  col += Tr*a*mix(fcrSmShade(p, e), uHazeCol, 1. - exp(-t*t*uHaze.x*uHaze.x)); Tr *= 1. - a;
                  if (Tr < .5) tOp = min(tOp, t);
                }
              }
              t += st2; st2 *= 1.5;
            }
          }
        }
        // (round 5) THE HIGH THIN SMOKE before what the march has drawn (as far as the eye sees along the ray: to where the mass hides the rest)
        {
          float tS = min(min(tG, tOp), 9000.), ta = 0., tb = 40., tau = 0., ym = 0., tm = 0.;
          for (int i = 0; i < 14; i++) {
            if (ta >= tS) break;
            float te = min(tb, tS), tc = .5*(ta + te); vec3 p = ro + rd*tc;
            float d = fcrThinAt(p)*(te - ta)*smoothstep(100., 600., tc);      // (not in the near air: within 100 m of the eye none, in full from 600 m: near to, the flames and the smoke are seen themselves)
            tau += d; ym += d*max(p.y, 0.); tm += d*tc;
            ta = tb; tb *= 1.5;
          }
          if (tau > 1e-4) {
            float a = 1. - exp(-tau*(1./600.)); ym /= tau; tm /= tau;
            vec3 ch = mix(fcrVeilCol(ym), uHazeCol, 1. - exp(-tm*tm*uHaze.x*uHaze.x));
            col = ch*a + col*(1. - a); Tr *= 1. - a;
          }
        }
        // (round 4) THE SMOKE OF THE BURNT COUNTRY behind the line: a thin layer some hundred metres deep over what has burnt, four and a half kilometres back.
        // A gap low in the wall does not show a clean horizon: it shows the sky browned and dimmed by this, more the lower and the flatter the look; over the
        // wall's low parts the stars come back by degrees. No look: a closed form along the ray.
        if (rd.z < -1e-3 && Tr > .02) {
          // where the ray is 150 m behind the line. (Round 5: found by a safe march of eight steps by the line's steepest slope, no look. Round 4 took two guesses:
          // for a ray oblique to a lobed line the place jumped from one lobe to the next between two neighbouring rays, and the burnt country's air began and
          // ended along an upright straight edge in the picture. A ray that has not come behind the line in eight steps gets less of it, by degrees.)
          float tc = 0., rs = 0., Sb = -rd.z + (1. + 2.*uFS.y)*dot(abs(uFA.xy), abs(uFK.xy))*abs(rd.x);
          for (int i = 0; i < 8; i++) { rs = ro.z + rd.z*tc - fcrFrontS(ro.x + rd.x*tc) + 150.; if (rs <= 1.) break; tc += rs/Sb; }
          float te = min(tEnd, tc + 4500.);
          if (te > tc) {
            float yc = max(ro.y + rd.y*tc, 0.), k = rd.y*(1./350.), Lb = te - tc;
            float a = 1. - exp(-exp(-yc/350. - max(rs, 0.)*(1./120.))*(abs(k) < 1e-5 ? Lb : (1. - exp(-k*Lb))/k)*(1./1500.));      // (round 5: 1/1,500, 1/2,800 before: an opening low in the wall shows smoke-brown air, not a pale pane)
            col += Tr*a*mix(fcrVeilCol(yc + 120.), uHazeCol, 1. - exp(-tc*tc*uHaze.x*uHaze.x)); Tr *= 1. - a;
          }
        }
        if (tG < 1e8 && Tr > .01) {                                         // the ground under and behind the fire: burnt black, a net of embers, the hot bed
          vec3 bed = vec3(.006, .0055, .005)*(uAmb*2.5 + uFire*3.4*fcrLight(gp).w) + gem;
          float fog = 1. - exp(-tG*tG*uHaze.x*uHaze.x);
          col += Tr*mix(bed, uHazeCol, fog); Tr = 0.;
        }
        float ag = fcrAirGlow(ro, rd, min(tG, tOp));                        // the glow of the low air before the smoke (not of what the smoke hides): it hides what is behind it as it brightens (orange, never a pale veil over the sky)
        col += uFire*.5*ag; Tr *= 1. - .8*ag;
        gl_FragColor = vec4(col, 1. - Tr*sqrt(Tr));                         // what is behind (the sky, its stars) goes a little faster than the smoke comes
      }`}),x=new d.Mesh(new d.BoxGeometry(2,2,2),P);return x.name="front-smoke",x.frustumCulled=!1,x.renderOrder=1,{mesh:x,triangles:12}}function xt(s,r,u,e){const f=Math.round(5e3*e),P=Math.round(1800*e),x=f+P,H=new Float32Array(x*4),R=new Float32Array(x*4),F=new Float32Array(x*2);for(let c=0;c<f;c++){const g=r();H.set([r()*_e,r.range(-30,12),r.range(5,11),r()],c*4),R.set([r.range(120,420),280*g*g*g-20,r.range(6,30),r()],c*4),F.set([0,r.range(.22,.5)],c*2)}for(let c=f;c<x;c++)H.set([r()*Be[0],r()*Be[1],r()*Be[2],r()],c*4),R.set([r.range(2,7),r.range(.6,1.4),r(),r()],c*4),F.set([1,r.range(.025,.045)],c*2);const z=new d.InstancedBufferGeometry;z.setAttribute("position",new d.Float32BufferAttribute([0,0,0,0,0,0,0,0,0,0,0,0],3)),z.setAttribute("aQ",new d.Float32BufferAttribute([-1,-1,1,-1,1,1,-1,1],2)),z.setIndex([0,1,2,0,2,3]),z.setAttribute("aA",new d.InstancedBufferAttribute(H,4)),z.setAttribute("aV",new d.InstancedBufferAttribute(R,4)),z.setAttribute("aK",new d.InstancedBufferAttribute(F,2)),z.instanceCount=x;const O=[];for(let c=0;c<24;c++)O.push(new d.Vector3(0,-1e5,c));const V={value:2.4},M={value:new d.DataTexture(new Uint8Array([255,255,255,255]),1,1,d.RGBAFormat)},n={value:new d.Vector4(0,0,0,0)};M.value.magFilter=M.value.minFilter=d.LinearFilter,M.value.generateMipmaps=!1,M.value.needsUpdate=!0;const k=new d.ShaderMaterial({transparent:!0,depthWrite:!1,premultipliedAlpha:!0,uniforms:{uFcrT:u.uFcrT,uHaze:u.uHaze,uFA:u.uFA,uFK:u.uFK,uFP:u.uFP,uFS:u.uFS,uFire:u.uFire,uFcrLine:u.uFcrLine,uFcrMap:u.uFcrMap,uPix:u.uPix,uWindS:u.uWindS,uTube:{value:O},uTubeR:V,uKeepM:M,uKeepB:n},vertexShader:Qe+`
      attribute vec2 aQ; attribute vec4 aA, aV; attribute vec2 aK;
      uniform sampler2D uKeepM; uniform vec4 uKeepB;      // the keep-out's map and its place: (x0, z0, 1/width, 1/depth)
      uniform float uPix, uTubeR; uniform vec2 uHaze; uniform vec3 uTube[24], uWindS;      // uWindS: metres along the line and back for a metre a spark climbs; the brands' drift along the line (m/s)
      varying vec2 vQ; varying vec2 vI;
      float segD(vec3 p, vec3 a, vec3 b){ vec3 ab = b - a; float t = clamp(dot(p - a, ab)/max(dot(ab, ab), 1e-4), 0., 1.); return length(p - a - ab*t); }
      void main(){
        vec3 c, vel = vec3(0., 1., 0.); float heat, str, range = 1.;
        if (aK.x < .5) {
          // the storm: up from the line with the heat, back with the indraft, and the lightest carried out over the plain
          float age = fract(uFcrT/aA.z + aA.w), up = pow(age, .75), sw = aV.z*age;
          float x = aA.x + ${_e}.*floor((cameraPosition.x - aA.x)/${_e}. + .5);        // (d) the image of its place nearest the eye
          c = vec3(x + uWindS.x*aV.x*up, 3. + aV.x*up, fcrFront(x) + aA.y - uWindS.y*aV.x*up + aV.y*pow(age, 1.6));
          c.x += sw*sin(age*8. + aV.w*40.) + 10.*age*sin(uFcrT*.4 + aV.w*17.);
          c.z += sw*.6*cos(age*6.3 + aV.w*23.);
          c.y += sw*.5*sin(age*11. + aV.w*9.);
          heat = pow(1. - age, 1.4);                                                       // bright at the fire, cooling as it rises
          str = smoothstep(0., .04, age)*heat*1.25;
        } else {
          // brands adrift low over the plain: a field fixed in the world, drawn in its image nearest the eye
          vec3 q = aA.xyz + vec3(aV.x*sin(uFcrT*.31*aV.y + aV.w*30.) + uWindS.z*uFcrT*aV.y, aV.x*.5*sin(uFcrT*.23*aV.y + aV.w*11.) + 2.2*uFcrT*aV.y, aV.x*cos(uFcrT*.27*aV.y + aV.w*19.) - 13.*uFcrT*aV.y);
          q.y = 3. + mod(q.y, ${Be[1]}.);
          q.x += ${Be[0]}.*floor((cameraPosition.x - q.x)/${Be[0]}. + .5);
          q.z += ${Be[2]}.*floor((cameraPosition.z - q.z)/${Be[2]}. + .5);
          c = q;
          float d = c.z - fcrFront(c.x);                                                  // metres before the line: by place
          heat = (.22 + .6*exp(-max(d, 0.)/300.))*(.55 + .45*fract(aV.w*29.3));
          // thickest low and near the fire, thinning upward and out over the plain; no two alike in brightness
          str = smoothstep(-20., 30., d)*exp(-max(d, 0.)/260.)*smoothstep(3., 8., c.y)*exp(-max(c.y - 12., 0.)/38.)*(1. - smoothstep(${Be[1]-20}., ${Be[1]}., c.y - 3.))*(.35 + .65*fract(aV.w*13.7));
          range = 0.;
          // it streams with the air the fire draws in: drawn as a short streak along its own way at this moment
          vel = aV.y*vec3(aV.x*.31*cos(uFcrT*.31*aV.y + aV.w*30.) + uWindS.z, aV.x*.115*cos(uFcrT*.23*aV.y + aV.w*11.) + 2.2, -aV.x*.27*sin(uFcrT*.27*aV.y + aV.w*19.) - 13.);
        }
        float dT = 1e9; for (int i = 0; i < 23; i++) dT = min(dT, segD(c, uTube[i], uTube[i + 1]));
        str *= smoothstep(uTubeR, uTubeR + 1.2, dT);   // the route's clear air, by place: a tube of twenty-three straights along the route
        // THE KEEP-OUT, by the spark's own place in the world (c.xz, whatever its height; never by the lens's place): no
        // spark of the storm and no brand is drawn over a kept ground or within its margin; full again beyond the soft edge
        str *= smoothstep(.04, 1., texture2D(uKeepM, (c.xz - uKeepB.xy)*uKeepB.zw).r);
        vec4 mv = viewMatrix*vec4(c, 1.);
        float dist = max(length(mv.xyz), .1), s = aK.y, sz = max(s, dist*uPix*mix(1.4, 1.3, range));       // (c) never under a pixel
        float sv = mix(.31, s, range);                                                    // (a brand keeps its light to 60 m, where it is a pixel; the storm's sparks thin by their size)
        str *= min(1., (sv*sv)/(sz*sz))*exp(-dist*dist*uHaze.x*uHaze.x);
        str *= mix(1. - smoothstep(85., 125., dist), 1., range);                           // (d)
        vec2 d2 = normalize((viewMatrix*vec4(vel, 0.)).xy + vec2(1e-4, 2e-4));
        mv.xy += d2*(aQ.y*mix(max(3.*sz, .5), 1.5*sz, range)) + vec2(d2.y, -d2.x)*(aQ.x*sz);      // (a brand's streak: half a metre, what it flies in a twenty-fifth of a second)      // (b) a card turned to the eye, drawn out along its own way
        gl_Position = projectionMatrix*mv; vQ = aQ; vI = vec2(str, heat);
      }`,fragmentShader:`
      varying vec2 vQ; varying vec2 vI;
      void main(){
        float r2 = dot(vQ, vQ), g = exp(-r2*3.2)*max(1. - r2, 0.)*vI.x;
        if (g < .003) discard;
        g = min(g, 1.);
        gl_FragColor = vec4(mix(vec3(.80, .085, .007), vec3(1.30, .42, .05), clamp(vI.y, 0., 1.))*g, g);     // laid over what is behind it, never added: orange cooling to red
      }`}),a=new d.Mesh(z,k);return a.name="front-sparks",a.frustumCulled=!1,a.renderOrder=5,{mesh:a,tube:O,tubeR:V,keepM:M,keepB:n,triangles:x*2}}function Ue(s,r,u,e){if(!s.towRows){const f=s.strong,P=f.length,x=15,H=new Float32Array(P*x),R=new Float32Array(P*x),F=new Float32Array(P),z=new Float32Array(P);for(let n=0;n<P;n++){const k=f[n];F[n]=1/0,z[n]=-1/0;for(let a=0;a<x;a++){const c=a/12.5,g=c*k.H,$=Math.max(c-.74,0)/.26,ge=3.24-$*$,A=k.hw*(.42+.58*Fe(0,.55,c))*(1+s.head*Fe(.45,.88,c));H[n*x+a]=k.x+(k.tlean-s.side)*g,R[n*x+a]=ge>0?Math.sqrt(ge)*A+140*Fe(.04,.4,c):-1e9,ge>0&&(F[n]=Math.min(F[n],H[n*x+a]-R[n*x+a]),z[n]=Math.max(z[n],H[n*x+a]+R[n*x+a]))}}const O=new Float32Array(S*16),V=[0,0,0,0],M=[0,0,0,0];for(let n=0;n<S;n++){const k=-se+(n+.5)*(2*se/S);V[0]=V[1]=V[2]=V[3]=-1,M[0]=M[1]=M[2]=M[3]=1/0;for(let a=0;a<P;a++){let c=Math.max(F[a]-k,k-z[a]);if(c<0){c=1/0;for(let $=0;$<x;$++)c=Math.min(c,Math.abs(k-H[a*x+$])-R[a*x+$])}let g=3;if(!(c>=M[3])){for(;g>0&&c<M[g-1];)M[g]=M[g-1],V[g]=V[g-1],g--;M[g]=c,V[g]=a}}for(let a=0;a<4;a++){const c=n*16+a*4,g=V[a]>=0?f[V[a]]:null;O[c]=g?g.x:0,O[c+1]=g?g.hw:1,O[c+2]=g?g.H:0,O[c+3]=g?g.tlean:0}}s.towRows=O}for(let f=0;f<S;f++){const P=-se+(f+.5)*(2*se/S),x=s.towRows;for(let n=0;n<4;n++){const k=((n<3?n:6)*S+f)*4,a=f*16+n*4;e[k]=x[a],e[k+1]=x[a+1],e[k+2]=x[a+2],e[k+3]=x[a+3]}let H=1/0,R=1/0,F=0;for(let n=0;n<u.length;n++){const k=Math.abs(P-u[n].x);k<H?(R=H,H=k,F=n):k<R&&(R=k)}const z=u[F],O=(3*S+f)*4,V=(4*S+f)*4,M=(5*S+f)*4;e[O]=z.x,e[O+1]=z.period,e[O+2]=z.phase,e[O+3]=z.life,e[V]=z.seed,e[V+1]=z.R,e[V+2]=z.rise,e[V+3]=z.back,e[M]=(R-H)*.5,e[M+1]=z.on?1:0,e[M+2]=r.LT[f],e[M+3]=.3*(1-Fe(.44,1,r.S[f]))}}async function gt(s,r={}){const u=s.rng.fork("the-front"),e=u.fork("line"),f=u.fork("flames"),P=u.fork("bursts"),x=u.fork("sparks"),H=u.fork("noise"),R=u.fork("spots"),F=u.fork("surge"),z=u.fork("stalks"),O=u.fork("bolts"),V=u.fork("low-smoke"),M=s.noise,n=fe(s.quality&&s.quality.detail||1,.5,1),k=r.heightAt||(()=>0),a=it(e,M,r.wind),c=async()=>{s.yield&&await s.yield()};await c();const g=256,$=new Uint8Array(g*g),ge=new Uint8Array(g*g*4);let A=Math.floor(H()*4294967296)>>>0;for(let m=0;m<g*g;m+=4){A=A+1831565813>>>0;let w=Math.imul(A^A>>>15,1|A);w=w+Math.imul(w^w>>>7,61|w)^w,w^=w>>>14,$[m]=w&255,$[m+1]=w>>>8&255,$[m+2]=w>>>16&255,$[m+3]=w>>>24}for(let m=0,w=0;m<g;m++){const B=(m-239&255)<<8,C=255-m<<8;for(let q=0;q<g;q++,w+=4)ge[w]=$[m<<8|q],ge[w+1]=$[B|q-37&255],ge[w+2]=$[C|q*7+91&255],ge[w+3]=255}const Q=new d.DataTexture(ge,g,g,d.RGBAFormat);Q.wrapS=Q.wrapT=d.RepeatWrapping,Q.magFilter=d.LinearFilter,Q.minFilter=d.LinearMipmapLinearFilter,Q.generateMipmaps=!0,Q.needsUpdate=!0,await c();const t=await lt(a,c),o=d.DataUtils.toHalfFloat,i=new Uint16Array(S*2*4);for(let m=0;m<S;m++){const w=-se+(m+.5)*(2*se/S),B=m*4,C=(S+m)*4;i[B]=o(fe(t.T[m]/3200,0,1)),i[B+1]=o(t.S[m]/2),i[B+2]=o(fe(t.E[m]/80,0,1)),i[B+3]=o(fe(t.D[m]/160,0,1)),i[C]=o(fe(k(w,a.frontZ(w)-60)/128,-8,8)),i[C+1]=o(t.M[m]/255),i[C+2]=o(t.G[m]),i[C+3]=o(t.LT[m]/800),m%1024===1023&&await c()}const l=new d.DataTexture(i,S,2,d.RGBAFormat,d.HalfFloatType);l.wrapS=l.wrapT=d.ClampToEdgeWrapping,l.magFilter=l.minFilter=d.LinearFilter,l.generateMipmaps=!1,l.needsUpdate=!0;const p=ft(a,t,R,M),G=new Uint8Array(S*Oe*4),K=new Uint8Array(S*Oe);await c(),ot(a,t,G,K,0,S>>1),await c(),ot(a,t,G,K,S>>1,S),await c(),ht(a,p,G);const J=new d.DataTexture(G,S,Oe,d.RGBAFormat);J.wrapS=J.wrapT=d.ClampToEdgeWrapping,J.magFilter=d.LinearFilter,J.minFilter=d.LinearMipmapLinearFilter,J.generateMipmaps=!0,J.needsUpdate=!0;const X=new Float32Array(S*8*4),U=new d.DataTexture(X,S,8,d.RGBAFormat,d.FloatType);U.wrapS=U.wrapT=d.ClampToEdgeWrapping,U.magFilter=U.minFilter=d.NearestFilter,U.generateMipmaps=!1;const T={uFcrLine:{value:l},uFcrMap:{value:J},uFcrTab:{value:U},uFcrT:{value:0},uNoise:{value:Q},uFA:{value:new d.Vector4(a.A[0],a.A[1],a.A[2],a.A[3])},uFK:{value:new d.Vector4(a.K[0],a.K[1],a.K[2],a.K[3])},uFP:{value:new d.Vector4(a.P[0],a.P[1],a.P[2],a.P[3])},uFS:{value:new d.Vector4(a.Asum,a.bay,0,0)},uFire:{value:new d.Color(1,.34,.06)},uHaze:{value:new d.Vector2(r.haze??16e-5,0)},uHazeCol:{value:new d.Color(.03,.045,.085)},uAmb:{value:new d.Color(.06,.066,.105)},uGroundY:{value:r.groundY??-1},uPix:{value:.0026},uFcrSm:{value:new d.Vector4(a.lean,a.top,a.drawn,a.side)},uFcrVel:{value:new d.Vector3(a.vel[0],a.vel[1],a.vel[2])},uFcrWd:{value:new d.Vector4(a.thick,a.head,6.2832*Je(a.lobe.x*.0137+a.lean*7),6.2832*Je(a.lobe.z*.0291+a.top*.0013))},uLeanF:{value:new d.Vector2(a.flameLean[0],a.flameLean[1])},uWindS:{value:new d.Vector3(a.sparkWind[0],a.sparkWind[1],a.sparkWind[2])},uBolt:{value:new d.Vector4(0,-1e5,0,70)},uBoltI:{value:0}};T.uFcrAmb=T.uAmb,T.uFcrHz={value:new d.Vector4(T.uHazeCol.value.r,T.uHazeCol.value.g,T.uHazeCol.value.b,T.uHaze.value.x)},r.hazeColor&&(T.uHazeCol.value.copy(r.hazeColor),T.uFcrHz.value.set(r.hazeColor.r,r.hazeColor.g,r.hazeColor.b,T.uHaze.value.x)),r.ambient&&T.uAmb.value.copy(r.ambient),await c();const Z=new d.Group;Z.name="the-front";const oe=wt(a,T,Math.max(37,Math.round(58*n)),!!r.lightning);Z.add(oe.mesh);const ce=await dt(a,t,p,f,V,M,T,k,c);Z.add(ce.mesh),await c();const he=mt(a,P,F,T,k);Z.add(he.mesh),a.bursts=he.table,Ue(a,t,he.sites,X),U.needsUpdate=!0,await c();const ke=xt(a,x,T,n);Z.add(ke.mesh);const ne={on:!!r.lightning,period:O.range(10.1,16),phase:O(),seed:Math.floor(O()*1e9),gap:.34,radius:105},Le=(m,w)=>{let B=Math.imul(m^ne.seed,2654435761)+Math.imul(w+1,2246822507)|0;return B^=B>>>15,B=Math.imul(B,739982445),B^=B>>>12,B=Math.imul(B,695872825),B^=B>>>15,(B>>>0)/4294967296};ne.flashes=m=>1+Math.floor(3*Le(m,2));let He=a.strong.filter(m=>m.H>1e3&&Math.abs(m.x-a.lobe.x)<1500);if(!He.length){const m=a.strong.filter(w=>Math.abs(w.x-a.lobe.x)<2600).sort((w,B)=>B.H-w.H);He=m.length?[m[0]]:[{x:a.lobe.x,H:1e3,tlean:a.side,hw:200}]}ne.at=m=>{const w=He[Math.min(He.length-1,Math.floor(Le(m,0)*He.length))],B=w.H*(.45+.3*Le(m,1)),C=w.x+w.tlean*B+(Le(m,3)-.5)*.5*w.hw;return{x:C,y:B,z:a.frontS(C)-40-a.lean*B-a.drawn*B*B+.3*(100+a.thick*B)}},ne.cycle=m=>Math.floor(m/ne.period+ne.phase),ne.age=m=>{const w=m/ne.period+ne.phase;return(w-Math.floor(w))*ne.period};const Ee=m=>m<=0||m>=.4?0:m<.1?Fe(0,.1,m):1-Fe(.1,.4,m);ne.light=m=>{const w=ne.cycle(m),B=ne.age(m),C=ne.flashes(w);let q=0;for(let ie=0;ie<C;ie++)q+=Ee(B-ie*ne.gap);return Math.min(q,1)},a.lightning=ne;const Te=new d.Vector2,pe=new Uint8Array(qe);let ye=0,je=!1;const Ze=async()=>{const m=ce,w=m.geometry.attributes.aS;let B=!1,C=0;for(const q of p)q.on||C++;for(let q=0;q<m.n;q++){const ie=m.order[q];if((pe[ie]||m.spot[ie]>=0&&!p[m.spot[ie]].on)&&w.getX(q*4)!==0){for(let we=0;we<4;we++)w.setX(q*4+we,0),w.setY(q*4+we,0);B=!0}}if(B&&(w.needsUpdate=!0),C!==ye){ye=C;for(const q of p)!q.on&&q.baked&&ut(q,p,G,K);J.needsUpdate=!0}return C},De=[];let Ie=null;const Ne={forest:typeof r.forest=="function"?r.forest:null,object:Z,radius:900,height:700,center:new d.Vector3(a.lobe.x,260,a.lobe.z),ground:!0,groundY:0,layout:a,glsl:{front:Qe,noise:Ke,ramp:Ye,ground:tt,flame:$e,mirror:pt},uniforms:{uFA:T.uFA,uFK:T.uFK,uFP:T.uFP,uFS:T.uFS,uFire:T.uFire,uFcrT:T.uFcrT,uNoise:T.uNoise,uFcrLine:T.uFcrLine,uFcrMap:T.uFcrMap,uFcrTab:T.uFcrTab,uFcrSm:T.uFcrSm,uFcrWd:T.uFcrWd,uFcrVel:T.uFcrVel,uFcrAmb:T.uFcrAmb,uFcrHz:T.uFcrHz},all:T,anchors:{lobe:new d.Vector3(a.lobe.x,0,a.lobe.z),frontZ:a.frontZ,flameHeight:a.flameH},triangles:ce.triangles+he.triangles+oe.triangles+ke.triangles,calls:4,stalks:0,get cardArea(){return ce.area||0},async takeForest(m){const w=typeof m=="function"?m:Ne.forest;if(!w||je)return{known:je,flamesTaken:0,spotsTaken:0,stalks:Ne.stalks};const B=new Float32Array(S);let C=!1;for(let v=0;v<S;v+=2){const b=-se+(v+.5)*(2*se/S),y=a.frontZ(b),W=t.E[v],E=Math.max(w(b,y-W+8)||0,w(b,y+30)||0,w(b,y-W-20)||0);B[v]=E,v+1<S&&(B[v+1]=E),E>0&&(C=!0),v%512===510&&await c()}if(!C)return ce.n||await ce.fill(pe),Ne.triangles=ce.triangles+he.triangles+oe.triangles+ke.triangles,{known:!1,flamesTaken:0,spotsTaken:0,stalks:0};const q=ce,ie=q.count();let we=0;for(let v=0;v<ie;v++){if(pe[v]||q.kind[v]>=3)continue;const b=q.cx[v],y=q.cz[v],W=y<a.frontZ(b)-de(t.E,b)+3;q.spot[v]>=0||(W?de(B,b)<=.01:!(w(b,y)>0))&&(pe[v]=1,we++)}for(const v of p)v.on&&!(w(v.x,v.z)>0)&&(v.on=!1);let Me=0;const Se=a.cols;for(let v=0;v<3400;v++){const b=Math.min(Se.n-2,Math.floor(z()*(Se.n-1))),y=Ce(Se.x[b],Se.x[b+1],z()),W=z(),E=z(),Y=z(),D=z();if(de(t.H,y)<4||E>Ae(y))continue;const j=a.frontZ(y)-de(t.E,y)+6-W*W*.7*de(t.D,y),ve=w(y,j)||0,ae=ve>0?ve:de(B,y);ae>1&&(q.add(y,j,ae*(.75+.35*Y),Math.max(.8,ae*(.12+.1*E)),Y,4,0,-1),Me++,v%1200===1199&&await c())}await q.fill(pe);const xe=ye,_=await Ze()-xe;return Ne.triangles=ce.triangles+he.triangles+oe.triangles+ke.triangles,Ne.stalks=Me,je=!0,{known:!0,flamesTaken:we,spotsTaken:_,stalks:Me}},async clearGround(m,w=8,B=1){const C=ce;let q;if(typeof m=="function")q=(_,v,b)=>{if(m(_,v))return!0;for(let y=0;y<8;y++){const W=Math.cos(y*.7854),E=Math.sin(y*.7854);if(m(_+b*W,v+b*E)||b>12&&m(_+.5*b*W,v+.5*b*E))return!0}return!1};else{const v=new Map,b=(y,W)=>y*65536+W;for(const y of m){const W=b(Math.floor(y.x/64)+32768,Math.floor(y.z/64)+32768);let E=v.get(W);E||v.set(W,E=[]),E.push(y)}q=(y,W,E)=>{const Y=Math.floor((y-E)/64)+32768,D=Math.floor((y+E)/64)+32768,j=Math.floor((W-E)/64)+32768,ve=Math.floor((W+E)/64)+32768;for(let ae=Y;ae<=D;ae++)for(let ee=j;ee<=ve;ee++){const re=v.get(b(ae,ee));if(re){for(const L of re)if((L.x-y)*(L.x-y)+(L.z-W)*(L.z-W)<E*E)return!0}}return!1}}let ie=0,we=0;for(let _=0;_<C.n;_++)pe[_]||(q(C.cx[_],C.cz[_],C.cw[_]*B+w)&&(pe[_]=1,ie++,C.spot[_]>=0&&(p[C.spot[_]].on=!1)),_%6e3===5999&&await c());for(const _ of p)_.on&&q(_.x,_.z,_.r+w)&&(_.on=!1);await c();const Me=ye,Se=await Ze()-Me;let xe=!1;return he.sites.forEach((_,v)=>{if(!_.on)return;const b=_.R*1.2;for(const y of[-70,0,70])for(const W of[-1,-.5,0,.5,1])for(const E of[0,.5,1]){const Y=_.x+y+W*1.1*b,D=a.frontZ(Y)-_.back-12-E*.55*b;if(_.on&&q(Y,D,.6*b*.5+w)){_.on=!1,we++,xe=!0;for(let j=0;j<he.per;j++)he.attrC.setX(v*he.per+j,0)}}}),xe&&(he.attrC.needsUpdate=!0,Ue(a,t,he.sites,X),U.needsUpdate=!0),{tonguesTaken:ie,spotsTaken:Se,burstsTaken:we}},async clearRoute(m,w=8,B=!1){const C=[];for(let h=0;h<=m.length;h+=2)C.push(m.posAtDist(h));C.push(m.end.clone()),await c();const q=128,ie=new Map,we=(h,N)=>h*65536+N;let Me=1/0,Se=-1/0,xe=1/0,_=-1/0;for(const h of C){const N=we(Math.floor(h.x/q)+32768,Math.floor(h.z/q)+32768);let I=ie.get(N);I||ie.set(N,I=[]),I.push(h),h.x<Me&&(Me=h.x),h.x>Se&&(Se=h.x),h.z<xe&&(xe=h.z),h.z>_&&(_=h.z)}const v=(h,N,I,te)=>{const le=Math.floor((h-I)/q)+32768,be=Math.floor((h+I)/q)+32768,ue=Math.floor((N-I)/q)+32768,Ve=Math.floor((N+I)/q)+32768;for(let ze=le;ze<=be;ze++)for(let Re=ue;Re<=Ve;Re++){const et=ie.get(we(ze,Re));if(et){for(const nt of et)if(te(nt))return!0}}return!1},b=ce,y=260+w;let W=0,E=0,Y=0,D=1/0;for(const h of p)if(h.on){const N=40+h.r;v(h.x,h.z,N,I=>(I.x-h.x)*(I.x-h.x)+(I.z-h.z)*(I.z-h.z)<N*N)&&(h.on=!1)}for(let h=0;h<b.n;h++){const N=b.cx[h],I=b.cz[h];if(pe[h]||b.spot[h]>=0&&!p[b.spot[h]].on||N<Me-y||N>Se+y||I<xe-y||I>_+y)continue;const te=b.kind[h]>=3?b.ch[h]:b.ch[h]*1.9,le=b.cw[h],be=le+(.34+Math.abs(a.flameLean[0]))*te+w;if(b.kind[h]>=5){const ze=te>20?265:le+55;v(N,I,ze,Re=>(Re.x-N)*(Re.x-N)+(Re.z-I)*(Re.z-I)<ze*ze)&&(pe[h]=1,Y++);continue}let ue=NaN;v(N,I,be,ze=>Math.abs(ze.x-N)<be&&ze.z-I<le+w&&I-ze.z<be?(ue!==ue&&(ue=k(N,I)+te+w),ze.y<ue):!1)&&(pe[h]=1,W++,b.spot[h]>=0&&(p[b.spot[h]].on=!1))}const j=ye,ve=await Ze()-j;await c();let ae=!1;he.sites.forEach((h,N)=>{if(!h.on||B)return;const I=h.R*1.2,te=h.rise*1.14,le=70+1.1*I+.65*I+.2*te+w;if(h.x+le<Me||h.x-le>Se)return;const be=k(h.x,a.frontZ(h.x));if(C.some(ue=>{if(Math.abs(ue.x-h.x)>=le)return!1;const Ve=a.frontZ(ue.x)-h.back-12;return ue.z<Ve+.05*I+w+20&&ue.z>Ve-.55*I-.62*te-w&&ue.y<be+1.95*te+w})){h.on=!1,E++,ae=!0;for(let ue=0;ue<he.per;ue++)he.attrC.setX(N*he.per+ue,0)}}),ae&&(he.attrC.needsUpdate=!0,Ue(a,t,he.sites,X),U.needsUpdate=!0);for(let h=0;h<C.length;h+=8){const N=C[h];for(let I=N.x-320;I<=N.x+320;I+=16){const te=a.frontZ(I)-N.z,le=(I-N.x)*(I-N.x)+te*te;le<D&&(D=le)}}D=Math.sqrt(D);const ee=new d.Vector3,re=(h,N,I)=>{const te=ee.copy(I).sub(N),le=Math.max(te.lengthSq(),1e-6),be=fe((h.x-N.x)*te.x/le+(h.y-N.y)*te.y/le+(h.z-N.z)*te.z/le,0,1);return Math.hypot(N.x+te.x*be-h.x,N.y+te.y*be-h.y,N.z+te.z*be-h.z)},L=[0,C.length-1];let me=0,Pe=C[0];const Ge=h=>{let N=0;for(;N<L.length-2&&L[N+1]<=h;)N++;return re(C[h],C[L[N]],C[L[N+1]])};for(let h=0;h<23;h++){let N=0,I=-1;for(let te=0;te<C.length;te+=2){const le=Ge(te);le>N&&(N=le,I=te)}me=N,h===0&&I>=0&&(Pe=C[I]),h<22&&((I<0||L.includes(I))&&(I=Math.round((C.length-1)*(h+1)/23)),L.includes(I)||(L.push(I),L.sort((te,le)=>te-le)))}for(;L.length<24;)L.push(L[L.length-1]);if(!B){for(let h=0;h<24;h++)ke.tube[h].copy(C[L[h]]);ke.tubeR.value=2.4+me}return{tonguesTaken:W,spotsTaken:ve,burstsTaken:E,lowSmokeTaken:Y,nearestSheet:D,knee:Pe.clone(),sparkKeep:2.4+me}},async keepBrands(m,w=60,B=40){const C=Math.max(0,Number.isFinite(+w)?+w:60),q=Math.max(12,Number.isFinite(+B)?+B:40),ie=[],we=[],Me=[];let Se=0,xe=[1/0,1/0,-1/0,-1/0];if(typeof m=="function"){let b=1/0,y=-1/0,W=1/0,E=-1/0,Y=0;for(let D=-se-400;D<=se+400;D+=24){for(let j=a.zLo-400;j<=a.zHi+4e3;j+=24,Y++)m(D,j)&&(D<b&&(b=D),D>y&&(y=D),j<W&&(W=j),j>E&&(E=j));Y>25e3&&(Y=0,await c())}if(y>=b){b-=24,y+=24,W-=24,E+=24;const D=Math.max(6,Math.sqrt((y-b)*(E-W)/25e4)),j=Math.ceil((y-b)/D),ve=Math.ceil((E-W)/D),ae=new Uint8Array(j*ve);for(let ee=0;ee<ve;ee++){for(let re=0;re<j;re++)m(b+(re+.5)*D,W+(ee+.5)*D)&&(ae[ee*j+re]=1);Y+=j,Y>25e3&&(Y=0,await c())}for(let ee=0;ee<ve;ee++)for(let re=0;re<j;re++)ae[ee*j+re]&&(ie.push(b+(re+.5)*D),we.push(W+(ee+.5)*D),Me.push(re===0||ee===0||re===j-1||ee===ve-1||!ae[ee*j+re-1]||!ae[ee*j+re+1]||!ae[(ee-1)*j+re]||!ae[(ee+1)*j+re]?1:0));Se=.7072*D,await c()}}else if(m)for(const v of m)ie.push(v.x),we.push(v.z),Me.push(1);for(let v=0;v<ie.length;v++)xe[0]=Math.min(xe[0],ie[v]),xe[1]=Math.min(xe[1],we[v]),xe[2]=Math.max(xe[2],ie[v]),xe[3]=Math.max(xe[3],we[v]);if(ie.length&&De.push({px:ie,pz:we,pe:Me,m:C,sf:q,half:Se,bx:xe}),De.length){let v=1/0,b=1/0,y=-1/0,W=-1/0;for(const L of De){const me=L.m+L.sf+L.half+4;v=Math.min(v,L.bx[0]-me),b=Math.min(b,L.bx[1]-me),y=Math.max(y,L.bx[2]+me),W=Math.max(W,L.bx[3]+me)}const E=Math.max(6,Math.max(y-v,W-b)/250);v-=2*E,b-=2*E;const Y=Math.ceil((y-v)/E)+2,D=Math.ceil((W-b)/E)+2,j=new Float32Array(Y*D).fill(1);let ve=0;for(const L of De)for(let me=0;me<L.px.length;me++){const Pe=L.px[me],Ge=L.pz[me],h=L.pe[me]?L.m+L.sf+L.half+2:L.half+2,N=Math.max(0,Math.floor((Pe-h-v)/E)),I=Math.min(Y-1,Math.floor((Pe+h-v)/E)),te=Math.max(0,Math.floor((Ge-h-b)/E)),le=Math.min(D-1,Math.floor((Ge+h-b)/E));for(let be=te;be<=le;be++)for(let ue=N;ue<=I;ue++){const Ve=Math.hypot(v+(ue+.5)*E-Pe,b+(be+.5)*E-Ge)-L.half-2,ze=fe((Ve-L.m)/L.sf,0,1);ze<j[be*Y+ue]&&(j[be*Y+ue]=ze)}ve+=(I-N+1)*(le-te+1),ve>6e4&&(ve=0,await c())}const ae=new Uint8Array(Y*D*4);for(let L=0;L<Y*D;L++){const me=Math.floor(j[L]*255);ae[L*4]=me,ae[L*4+1]=me,ae[L*4+2]=me,ae[L*4+3]=255}const ee=new d.DataTexture(ae,Y,D,d.RGBAFormat);ee.wrapS=ee.wrapT=d.ClampToEdgeWrapping,ee.magFilter=ee.minFilter=d.LinearFilter,ee.generateMipmaps=!1,ee.needsUpdate=!0;const re=ke.keepM.value;ke.keepM.value=ee,re&&re.dispose&&re.dispose(),ke.keepB.value.set(v,b,1/(Y*E),1/(D*E)),Ie={x0:v,z0:b,x1:v+Y*E,z1:b+D*E,cell:E,W:Y,H:D,data:ae}}const _=(v,b)=>{const y=Ie;if(!y)return 1;const W=fe((v-y.x0)/y.cell-.5,0,y.W-1),E=fe((b-y.z0)/y.cell-.5,0,y.H-1),Y=Math.min(y.W-2,Math.floor(W)),D=Math.min(y.H-2,Math.floor(E)),j=W-Y,ve=E-D,ae=(L,me)=>y.data[(me*y.W+L)*4]/255,ee=(ae(Y,D)*(1-j)+ae(Y+1,D)*j)*(1-ve)+(ae(Y,D+1)*(1-j)+ae(Y+1,D+1)*j)*ve,re=fe((ee-.04)/.96,0,1);return re*re*(3-2*re)};return{found:ie.length>0,squares:ie.length,margin:C,soft:q,map:Ie?{x0:Ie.x0,z0:Ie.z0,x1:Ie.x1,z1:Ie.z1,cell:Ie.cell}:null,at:_}},update(m,w,B){if(T.uFcrT.value=w,ne.on){const C=ne.light(w);if(T.uBoltI.value=C,C>0){const q=ne.at(ne.cycle(w));T.uBolt.value.set(q.x,q.y,q.z,ne.radius)}}B&&B.isPerspectiveCamera&&s.renderer&&(s.renderer.getDrawingBufferSize(Te),T.uPix.value=2*Math.tan(B.fov*Math.PI/360)/Math.max(1,Te.y))},dispose(){}};return Ne.forest&&await Ne.takeForest(),ce.n||(await ce.fill(pe),Ne.triangles=ce.triangles+he.triangles+oe.triangles+ke.triangles),Ne}export{gt as buildHero,it as frontLayout};
