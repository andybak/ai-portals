import*as s from"three";import{makePath as Fo}from"../kit/core.js";import{makeSky as va,skyDirection as wa}from"../kit/sky.js";import*as ya from"../kit/terrain.js";import*as xa from"../kit/water.js";import*as Ue from"../kit/flora.js";import*as oe from"../kit/fauna.js";import*as Zt from"../kit/fx.js";import{buildHero as ba,GLSL_COMMON as Ee,GLSL_BRAID as za}from"../parts/prismatic-dawn.js";const Ma=["#0F5FB4","#1FA88A","#F2C62E","#D4581C","#C9CCD1","#FFE9C4","#1B222E"],B={x0:162,zb:150,k:90,hw:17,y:-.95},ka={dawn:{hero:{hour:"dawn",season:"autumn"},sun:[5,90],line:!0,frost:1,snow:0,sky:{preset:"dawn",zenith:"#2A4E86",mid:"#7f8cc0",horizon:"#b49aae",ground:"#4c5672",horizonPow:5,midPow:2.2,scatterColor:"#ffb476",scatter:1,scatterPow:2.4,scatterHigh:.1,sunColor:"#ffd9ac",sunSize:1.7,sunIntensity:11,sunGlow:.75,stars:.03,clouds:!1,clouds2:!1,bodies:[{elevation:46,azimuth:224,size:1.5,phase:.13,phaseAngle:110,intensity:1,glow:.1}]},fog:["#8796b8",8e-4],dir:["#ffd6a4",6.5],hemi:["#6F93C8","#4a5670",3.2],faunaSun:["#ffd6a4",2.6],faunaSky:["#6F93C8",1.1],grass:["#8f7a48","#e9e4d2"],forest:"#1d3a2b",rock:"#8d8478",post:{exposure:.9,bloom:{strength:.3,radius:.6,threshold:.96},grade:{saturation:1.12,contrast:1.06,tint:"#fff7ee",shadowTint:"#070d20",vignette:.3,grain:.02}},portal:"#ffe2b8"},evening:{hero:{hour:"evening",season:"autumn"},sun:[6,268],line:!1,frost:.35,snow:0,sky:{preset:"goldenHour",zenith:"#27437A",mid:"#7f86b4",horizon:"#c9a59a",ground:"#4f4a5c",horizonPow:4,scatterColor:"#ff9c4c",scatter:.9,scatterPow:3,sunElevation:6,sunColor:"#ffc88c",sunSize:1.8,sunIntensity:11,clouds:!1,clouds2:!1},fog:["#9a93a8",58e-5],dir:["#ffc58a",6.5],hemi:["#6A86C0","#5a5262",3],faunaSun:["#ffc58a",2.6],faunaSky:["#6A86C0",1],grass:["#9a7f44","#e2c98a"],forest:"#21392a",rock:"#96826e",post:{exposure:.9,bloom:{strength:.3,radius:.6,threshold:.96},grade:{saturation:1.12,contrast:1.06,tint:"#fff4e6",shadowTint:"#0c0a1c",vignette:.3,grain:.02}},portal:"#ffd9a8"},winter:{hero:{hour:"dawn",season:"winter",steam:.55},sun:[5,90],line:!0,frost:1.3,snow:1,sky:{preset:"dawn",zenith:"#2c4a7e",mid:"#b99ab0",horizon:"#7c8aae",ground:"#66708c",horizonPow:8,midPow:3,scatterColor:"#ffc08e",scatter:.85,scatterPow:2.6,sunColor:"#ffdcb4",sunSize:1.7,sunIntensity:10,clouds:!1,clouds2:{coverage:.4,opacity:.2,lit:"#ffd6c8",shade:"#9c8cae"}},fog:["#93a0be",9e-4],dir:["#ffd6a4",6],hemi:["#7696c8","#6a7690",3],faunaSun:["#ffd6a4",2.6],faunaSky:["#7696c8",1.1],grass:["#a39a7c","#eef0f2"],forest:"#263c34",rock:"#9a958e",post:{exposure:.92,bloom:{strength:.28,radius:.6,threshold:.97},grade:{saturation:1.06,contrast:1.05,tint:"#f6f8ff",shadowTint:"#081024",vignette:.3,grain:.02}},portal:"#ffe2b8"},day:{hero:{hour:"day",season:"summer"},sun:[53,132],line:!1,frost:0,snow:0,sky:{preset:"day",zenith:"#2F68C0",horizon:"#BFD8F0",sunElevation:53,clouds:{coverage:.2,opacity:.7},clouds2:{opacity:.25}},fog:["#a9c2de",5e-4],dir:["#fff3dc",4.6],hemi:["#86AEE6","#5c6a4c",3.1],faunaSun:["#fff3dc",2.4],faunaSky:["#86AEE6",1.2],grass:["#4f7030","#a9c05a"],forest:"#1f4428",rock:"#9a8f7c",post:{exposure:.95,bloom:{strength:.25,radius:.6,threshold:.97},grade:{saturation:1.12,contrast:1.06,tint:"#ffffff",shadowTint:"#06101e",vignette:.3,grain:.02}},portal:"#fff0d0"},night:{hero:{hour:"night",season:"winter",steam:.5},sun:[38,220],line:!1,frost:1.3,snow:1,sky:{preset:"night",clouds:!1,bodyOverrides:{0:{elevation:38,azimuth:220,size:2.3,phase:1,intensity:1.2}}},fog:["#16233f",7e-4],dir:["#a9beea",2.2],hemi:["#3a56a0","#18244a",1.8],faunaSun:["#a9beea",.8],faunaSky:["#3a56a0",.9],grass:["#6d7484","#c9d6ee"],forest:"#16263a",rock:"#6c7488",post:{exposure:1.15,bloom:{strength:.4,radius:.7,threshold:.9},grade:{saturation:1,contrast:1.04,tint:"#eef3ff",shadowTint:"#050a1c",vignette:.34,grain:.025}},portal:"#bcd4ff"}},Aa=`
varying vec3 vW, vN;
#include <fog_pars_vertex>
void main(){
  vec4 w = modelMatrix*vec4(position, 1.);
  vW = w.xyz; vN = normal;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ca=`
varying vec3 vW, vN;
uniform vec3 uCSinter, uCMeadow, uCFrost, uCMoss, uCDark, uCRust, uCOra, uCYel;
uniform vec3 uForest, uRock, uSnowCol, uFum[10], uPots[5], uPools[4];
uniform vec4 uWallow;
uniform float uFrost, uSnow, uWaterY, uEdge;
#include <fog_pars_fragment>
${Ee}
${za}
void main(){
  vec2 p = vW.xz;
  float px = max(length(dFdx(p)), length(dFdy(p))), h = vW.y;
  // as in the hero's ground: no detail term outlives its own resolution, and relief shading stays close to the camera
  float mid = 1. - smoothstep(0.6, 3.0, px), rel = 1. - smoothstep(0.10, 0.34, px);
  float n1 = fbm3b(p*0.06 + 3.1, 16.7, px), n2 = fbm3b(p*0.33 + 11., 3.03, px), n3 = bnz(p*2.6, 0.385, px);
  float nA = fbm3(p*0.011 + uSeed.xy), nF = fbm3(p*0.02 + 5.);
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float up = smoothstep(4., 30., h), slope = 1. - N.y;
  // cured meadow, darker sedge hollows, pale sinter flats, game trails
  vec3 grass = uCMeadow*meadowTone(p, px);
  // from the air the meadow is stippled, not smooth: tussocks a metre apart and sedge clumps four metres apart, each a pale
  // crown with its own small shadow on the side away from the sun; each scale fades to its mean before it can alias
  {
    vec2 tq = p*0.95, ti = floor(tq), tf = tq - ti, to = vec2(hash12(ti), hash12(ti + 7.3))*0.56 + 0.22;
    float k1 = (1. - smoothstep(0.2, 0.55, px))*step(0.22, hash12(ti + 3.1));
    float c1 = 1. - smoothstep(0.12, 0.3, length(tf - to)), s1 = 1. - smoothstep(0.1, 0.32, length(tf - to + uSunXZ*0.2));
    vec2 uq = p*0.24 + 3.7, ui = floor(uq), uf = uq - ui, uo = vec2(hash12(ui + 1.9), hash12(ui + 5.3))*0.5 + 0.25;
    float k2 = (1. - smoothstep(0.9, 2.4, px))*step(0.45, hash12(ui + 9.1));
    float c2 = 1. - smoothstep(0.1, 0.3, length(uf - uo)), s2 = 1. - smoothstep(0.1, 0.34, length(uf - uo + uSunXZ*0.2));
    grass *= 1. + k1*(0.42*c1 - 0.3*s1*(1. - c1)) + k2*(0.3*c2 - 0.34*s2*(1. - c2));
  }
  float sint = smoothstep(0.57, 0.68, nA + (n1 - 0.5)*0.22);
  // the flats round the spring are sinter out to some 300 m, with islands of frosted grass standing on them
  float r0 = length(p);
  float flatM = (1. - smoothstep(215., 315., r0 + (nA - 0.5)*90.))*smoothstep(0.36, 0.5, fbm3(p*0.017 + uSeed.yx + 9.) + 0.3*(1. - smoothstep(120., 210., r0)));
  sint = max(sint, flatM);
  sint *= smoothstep(30., 75., length(vec2(p.x - 128., max(abs(p.y - 212.) - 62., 0.))));     // the bank run is meadow, not a sinter flat
  // summer: green grass against pale sinter. The boundary is broken at tussock scale (clumps three metres and half a metre
  // across) and kept a metre or two wide, so the grass stands on the flats as islands with edges, not as soft green smears
  float eW = clamp(0.07 + px*0.05, 0.07, 0.5);
  sint = mix(sint, smoothstep(0.5 - eW, 0.5 + eW, sint + (n2 - 0.5)*0.55 + (n3 - 0.5)*0.24*mid), uEdge);
  vec3 sinter = uCSinter*(0.64 + 0.32*n1 + 0.10*(n2 - 0.5)*mid);
  sinter = mix(sinter, sinter*vec3(0.78, 0.87, 1.0), (1. - smoothstep(0.22, 0.5, n1))*0.8);
  // terraces: stepped rimstone with a film of water standing behind every lip, and the spring's braided runoff carried on
  // across them in the same strands the hero's sheet draws (same lookup, so they join)
  vec4 ter = terraces(p, px);
  vec2 dirp = p/max(r0, 1e-3);
  vec2 bw = vec2(fbm2(p*0.035 + 21.), fbm2(p*0.035 + 57.)) - 0.5;
  vec2 rq = dirp*21. + vec2(r0*0.085, -r0*0.055) + bw*5. + uSeed.xy;
  vec2 brA = braid(vnoise(rq), vnoise(rq*2.3 + bw*3.5 + 13.));
  float allM = smoothstep(84., 110., r0)*(1. - smoothstep(210., 300., r0))*smoothstep(0.4, 0.62, fbm2(dirp*2.1 + uSeed.xy + 5.))*0.9;
  sinter = mix(sinter, mix(uCOra, uCRust, 0.45)*(0.75 + 0.4*n2), smoothstep(0.45, 0.95, ter.w)*smoothstep(0.3, 0.6, fbm2(p*0.031 + 17.))*0.8*flatM);
  sinter = mix(sinter, sinter*vec3(0.5, 0.78, 0.96) + vec3(0., 0.03, 0.07), ter.y*0.85);
  sinter = mix(sinter, mix(uCRust*1.05, uCOra, brA.y), brA.y*allM*0.8);
  sinter = mix(sinter, mix(uCYel*0.9, vec3(0.75, 0.80, 0.78), 0.5), brA.x*allM*0.85);
  float terK = sint*(1. - brA.y*allM);
  float st = n1*2.75, stf = fract(st), fst = fwidth(st), wst = max(0.1, 2.5*fst);
  sinter *= 1. - 0.25*smoothstep(1. - wst, 1. - wst*0.35, stf)*(1. - smoothstep(1. - clamp(fst, 0.002, 0.3), 1., stf))*(0.1/wst)*(1. - smoothstep(0.12, 0.3, fst))*mid;
  vec3 colr = mix(grass, sinter, sint);
  float tr = 1. - abs(2.*vnoise(p*0.021 + uSeed.zw) - 1.);
  colr = mix(colr, uCMeadow*0.4 + uCDark*0.35, smoothstep(0.94, 0.99, tr)*(1. - sint)*mid*0.6);
  // warm ground: fumarole vents, mud pots, the wallow, the river's banks
  float warm = 0.;
  for (int i = 0; i < 10; i++){
    vec3 f = uFum[i]; float dd = length(p - f.xy);
    warm = max(warm, 1. - smoothstep(f.z*0.4, f.z, dd + (n2 - 0.5)*f.z*0.6));
    float core = 1. - smoothstep(1.0, 3.6, dd + (n2 - 0.5)*1.5);
    colr = mix(colr, uCSinter*(0.5 + 0.4*n2), core*0.9);
    colr = mix(colr, uCDark*1.2, (1. - smoothstep(0.3, 0.9, dd))*0.8);
  }
  // lesser hot pools out on the flats: a blue eye, a turquoise shelf, a yellow lip, orange and rust mats draining away
  float poolW = 0.;
  for (int i = 0; i < 4; i++){
    vec3 f = uPools[i];
    float tq = (length(p - f.xy) + (n2 - 0.5)*f.z*0.22 + (n1 - 0.5)*f.z*0.5)/f.z;
    vec3 pc = mix(vec3(0.05, 0.27, 0.62), vec3(0.14, 0.6, 0.6), smoothstep(0.25, 0.8, tq));
    pc = mix(pc, uCYel, smoothstep(0.82, 0.96, tq));
    pc = mix(pc, uCOra, smoothstep(1.0, 1.2, tq));
    pc = mix(pc, uCRust, smoothstep(1.25, 1.7, tq));
    colr = mix(colr, pc, 1. - smoothstep(1.6, 3.2 + 2.*brA.y, tq));
    poolW = max(poolW, 1. - smoothstep(0.86, 0.98, tq));
    warm = max(warm, 1. - smoothstep(1.4, 3.2, tq));
    terK *= smoothstep(1.5, 2.4, tq);
  }
  for (int i = 0; i < 5; i++){
    vec3 f = uPots[i]; float dd = length(p - f.xy);
    warm = max(warm, 1. - smoothstep(f.z*1.2, f.z*3.2, dd + (n2 - 0.5)*f.z));
    float rimw = 1. - smoothstep(f.z*0.95, f.z*1.5, dd + (n2 - 0.5)*0.8);
    float pot = 1. - smoothstep(f.z*0.8, f.z, dd);
    float bub = 0.5 + 0.5*sin(dd*7. - uTime*2.2 + float(i)*1.7)*sin(uTime*0.9 + float(i)*2.3 + dd);
    colr = mix(colr, uCSinter*0.8, rimw*0.8);
    colr = mix(colr, vec3(0.36, 0.34, 0.33)*(0.7 + 0.45*bub), pot);
  }
  float wl = 1. - smoothstep(uWallow.z*0.55, uWallow.z, length(p - uWallow.xy) + (n2 - 0.5)*2.4);
  colr = mix(colr, vec3(0.20, 0.155, 0.11)*(0.7 + 0.6*n2), wl*0.85);
  float rd = riverD(p);
  float bank = 1. - smoothstep(-0.5, 4.5, rd + (n2 - 0.5)*2.);
  vec3 gravel = mix(vec3(0.10, 0.10, 0.10), vec3(0.36, 0.33, 0.29), bnz(p*3.1, 0.32, px)*0.55 + n2*0.45);
  warm = max(max(warm, wl), 1. - smoothstep(-1., 7., rd + (n1 - 0.5)*6.));
  colr = mix(colr, uCMoss*(0.75 + 0.5*n2), warm*0.8*(1. - sint*0.5)*(1. - wl));
  colr = mix(colr, gravel, bank*0.9);
  colr *= 1. - 0.5*smoothstep(uWaterY + 0.3, uWaterY - 0.05, h)*step(rd, 8.);
  // hoar frost stops dead at the warm halos
  float fr = clamp((1. - warm)*uFrost*(0.28 + 0.35*n1 + 0.25*(1. - sint)), 0., 0.6)*(1. - 0.45*(1. - smoothstep(215., 315., r0))*(1. - sint));
  // ridges: lodgepole forest, pale talus on the steeps, a few open parks
  vec3 forest = uForest*(0.8 + 1.5*fbm3(p*0.09 + 31.))*(0.8 + 0.4*vnoise(p*vec2(0.7, 0.21)));
  float rk = smoothstep(0.30, 0.48, slope + (nF - 0.5)*0.3);
  vec3 ridge = mix(forest, uRock*(0.65 + 0.5*n1), rk);
  ridge = mix(ridge, grass*0.85, smoothstep(0.6, 0.7, nF)*(1. - rk)*0.75);
  colr = mix(colr, ridge, up);
  fr *= 1. - up*0.9;
  colr = mix(colr, uCFrost*(0.80 + 0.15*n3), fr);
  float sn = uSnow*smoothstep(0.2, 0.55, N.y - rk*0.5 + (n1 - 0.5)*0.3)*(1. - warm)*(1. - 0.55*up*(1. - rk));
  colr = mix(colr, uSnowCol*(0.86 + 0.14*n2), sn);
  // light: the hero's sun, gated by the sinking shadow line
  vec2 bmp = (vec2(bnz(p*0.8 + 3., 1.25, px), bnz(p*0.8 + 41., 1.25, px)) - 0.5)*0.07 + (vec2(bnz(p*3.7, 0.27, px), bnz(p*3.7 + 17., 0.27, px)) - 0.5)*0.09;
  N = normalize(N + vec3(bmp.x, 0., bmp.y)*(1. - sn*0.6));
  float lit = sunGate(h);
  float ndl = max(dot(N, uSunDir), 0.), n0 = max(uSunDir.y, 0.);
  float sunT = mix(clamp(min(n0*3. + 0.07, 0.85) + (ndl - n0)*mix(1.5, 3., rel), 0.07, 0.85), ndl*0.85 + 0.03, up);
  float sh = max(castShadow(p, px), geyShadow(p))*(1. - up);
  terK *= 1. - up;
  vec3 E = uSunCol*sunT*lit*(1. - sh*0.92)*max(1. + (ter.x - 1.)*1.6*terK, 0.2) + uSkyCol*(0.8 + 0.2*N.y)*(1. + (ter.x - 1.)*0.35*terK);
  vec3 c3 = colr*E*(1. + 0.9*poolW);
  vec3 V = normalize(cameraPosition - vW);
  float fres = pow(1. - max(V.y, 0.), 5.);
  c3 += (ter.y*terK*0.5 + poolW)*mix(uHorizon, uZenith, clamp(V.y*1.5, 0., 1.))*(0.03 + 0.45*fres)*(0.7 + 0.6*vnoise(p*1.3 + vec2(uTime*0.7, -uTime*0.5)));
  vec2 cell = floor(p*7.);
  float tw = hash12(cell + floor(dot(V.xz, vec2(37., 23.)) + V.y*31.)*vec2(1.3, 2.7));
  c3 += uSunCol*step(0.994, tw)*clamp((fr + sn)*1.6, 0., 1.)*lit*(1. - sh)*(1. - smoothstep(0.07, 0.22, px))*2.0*(1. - up);
  gl_FragColor = vec4(max(c3, 0.), 1.);
  #include <fog_fragment>
}`,Mt=`
attribute vec3 color, aPivot;
attribute vec4 aAnim, iPos, iPar, iMove;
attribute float aGlow;
uniform float uH, uGraze, uBugle;
uniform vec4 uRun;
uniform vec2 uGal;
varying vec3 vW, vN, vC;
varying vec2 vK;
#include <fog_pars_vertex>
${Ee}
void main(){
  vec3 p = position, n = normal;
  float sc = iPar.x, pose = iPar.y, seed = iPar.z, part = aAnim.z, t = uTime;
  // pose 6, the gallop (uGal.x 0 standing .. 1 flat out, uGal.y strides in radians per second): fore and hind pairs half a
  // stride apart, lower legs folding on the swing, the body bounding and rocking a few degrees, head low, tail up
  float gal = pose > 5.5 ? uGal.x : 0., gph = t*uGal.y + seed*6.2832;
  if (part > 1.5 && part < 2.5){
    float a = 0.05*sin(t*0.5 + seed*9.) + gal*(0.2 + 0.06*sin(gph*2. + 1.));
    if (pose > 0.5 && pose < 1.5) a += uGraze*(0.84 + 0.16*sin(t*2.3 + seed*5.))*smoothstep(-0.75, -0.45, sin(t*0.23 + seed*40.));
    if (pose > 3.5 && pose < 4.5) a -= uBugle*(0.9 + 0.1*sin(t*3.1));
    a *= aAnim.x;
    vec3 d = p - aPivot; float c = cos(a), s = sin(a);
    d.yz = vec2(d.y*c - d.z*s, d.z*c + d.y*s); n.yz = vec2(n.y*c - n.z*s, n.z*c + n.y*s);
    p = aPivot + d;
  } else if (part > 2.5 && part < 3.5){
    p.x += aAnim.y*aAnim.y*uH*0.14*sin(t*2.1 + seed*11.)*(1. - 0.7*gal);
    float ta = gal*(1.05 + 0.15*sin(gph*2.))*(0.45 + 0.55*aAnim.y);
    vec3 d = p - aPivot; float c = cos(ta), s = sin(ta);
    d.yz = vec2(d.y*c - d.z*s, d.z*c + d.y*s);
    p = aPivot + d;
  } else if (part > 0.5 && part < 1.5){
    float ang = 0., fold = 0.;
    if (pose > 2.5 && pose < 3.5) ang = 0.33*sin(t*iMove.w*3.3 + aAnim.x*6.2832 + seed*13.);
    if (pose > 1.5 && pose < 2.5) ang = 0.55*sin(t*4.3 + aAnim.x*10. + seed);
    if (pose > 5.5){
      float lp = gph + ((aPivot.z > 0. ? 0. : 0.52) + (aPivot.x > 0. ? 0.09 : 0.))*6.2832;
      ang = 0.6*sin(lp)*gal;
      fold = max(cos(lp), 0.)*gal*smoothstep(0.42, 0.6, aAnim.y)*(aAnim.y - 0.42)*1.7*aPivot.y*0.72;
    }
    vec3 d = p - aPivot; float c = cos(ang), s = sin(ang);
    d.yz = vec2(d.y*c + d.z*s, d.z*c - d.y*s);
    d.z -= fold*0.8*(aPivot.z > 0. ? 1. : 0.55); d.y += fold*0.88;
    p = aPivot + d;
  } else {
    p.x *= 1. + 0.02*sin(t*1.9 + seed*7.);
  }
  if (pose > 1.5 && pose < 2.5){
    float r = 1.9 + 0.8*sin(t*1.25 + seed), c = cos(r), s = sin(r);
    vec3 q = p; q.y -= uH*0.62;
    p = vec3(q.x*c - q.y*s, q.x*s + q.y*c + uH*0.38, q.z);
    n = vec3(n.x*c - n.y*s, n.x*s + n.y*c, n.z);
  }
  p.y += gal*(0.045*uH*sin(gph*2.) + p.z*0.085*sin(gph + 1.2));
  vK = vec2(aGlow, clamp(p.y/max(uH, 0.1), 0., 1.5));
  float fl = step(4.5, pose)*step(pose, 5.5);
  sc *= 1. - fl*smoothstep(0.8, 1., uRun.x);
  p *= sc;
  float cy = cos(iPos.w), sy = sin(iPos.w);
  vec3 w3 = vec3(p.x*cy + p.z*sy, p.y, -p.x*sy + p.z*cy) + iPos.xyz;
  n = vec3(n.x*cy + n.z*sy, n.y, -n.x*sy + n.z*cy);
  if (pose > 2.5 && pose < 3.5) w3.xz += iMove.xy*mod(t*iMove.w + seed*31., iMove.z);
  w3.y += fl*0.035*sin(t*1.7 + seed*20.);
  w3.xz += fl*uRun.yz*uRun.w*uRun.x*uRun.x*(0.7 + 0.6*seed);
  vW = w3; vC = color*iPar.w;
  vN = normalize(n + vec3(0., 1e-5, 0.));
  vec4 mvPosition = viewMatrix*vec4(w3, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,kt=`
varying vec3 vW, vN, vC;
varying vec2 vK;
uniform vec3 uCFrost;
uniform float uCoatFrost;
uniform vec2 uCoat;
#include <fog_pars_fragment>
${Ee}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  float nz = fbm3(vW.xz*6. + vW.y*4.);
  // shaggy coat: strands hanging down the forequarters, lighter cape on hump and shoulders
  float fur = vnoise(vec2(vW.x*23. + vW.z*17., vW.y*5.));
  vec3 alb = vC*(0.6 + 0.6*nz + 0.3*(fur - 0.5))*uCoat.x*(1. + 0.5*smoothstep(0.62, 0.95, vK.y)*(1. - uCoat.y));
  float fro = smoothstep(0.1, 0.8, N.y)*smoothstep(0.5, 0.8, vK.y)*uCoatFrost*(0.4 + 0.6*vnoise(vW.xz*19. + vW.y*7.));
  alb = mix(alb, uCFrost*0.9, fro*0.85);
  float lit = sunGate(vW.y);
  float ndl = dot(N, uSunDir);
  vec3 E = uSunCol*clamp(ndl*0.7 + 0.22, 0., 1.)*0.8*lit + uSkyCol*(0.42 + 0.4*N.y);
  vec3 c3 = alb*E;
  float rim = pow(1. - max(dot(N, V), 0.), 2.5);
  float rim2 = rim*rim;
  c3 += uSunCol*mix(rim, rim2*rim2, uCoat.y)*(0.3 + 0.7*max(dot(-V, uSunDir), 0.))*0.16*lit*smoothstep(-0.5, 0.2, ndl);
  c3 += uSkyCol*rim*0.07*(1. - 0.6*uCoat.y);
  // before the sun reaches them the glow of the dawn sky already edges every animal on its sunward side, and once it does
  // the edge burns gold: no beast is a flat dark block
  float sunSide = smoothstep(-0.35, 0.55, dot(N.xz, uSunXZ)), edge = pow(1. - max(dot(N, V), 0.), 1.8);
  c3 += (uHorizon*0.5 + uSunCol*0.07)*edge*sunSide*(1. - 0.6*uCoat.y)*(1. - uNight*0.7)*clamp(0.3 + uSunDir.y*8., 0., 1.);
  c3 += uSunCol*edge*edge*sunSide*lit*0.42*(0.4 + 0.6*max(dot(-V, uSunDir), 0.))*(1. - uCoat.y);
  // the runners: gold along hump and back, a wider warm edge all round
  c3 += uSunCol*vec3(1., 0.8, 0.5)*uCoat.y*(0.9*rim2*rim)*smoothstep(0.05, 0.6, N.y)*smoothstep(0.4, 0.75, vK.y)*lit;
  gl_FragColor = vec4(max(c3, 0.), 1.);
  #include <fog_fragment>
}`,Ro=`
attribute vec3 color;
attribute float iRime;
#ifndef CONE
attribute vec4 wind;
#endif
varying vec3 vW, vN, vC;
varying vec2 vUv;
varying vec2 vR;
#include <fog_pars_vertex>
${Ee}
void main(){
  vec4 w = modelMatrix*instanceMatrix*vec4(position, 1.);
  vec3 base = (modelMatrix*instanceMatrix*vec4(0., 0., 0., 1.)).xyz;
  float ph = base.x*0.05 + base.z*0.07;
  #ifndef CONE
  w.xz += (normalize(uWind + vec2(1e-3, 0.))*0.5 + uWind*0.15)*wind.x*(0.5 + 0.5*sin(uTime*1.1 + ph)) + wind.y*0.05*vec2(sin(uTime*3.1 + position.y*2. + ph*3.), cos(uTime*2.7 + ph*2.));
  vR = vec2(iRime, wind.z);
  #else
  vR = vec2(iRime, 0.);
  #endif
  vUv = uv; vC = color; vW = w.xyz;
  vN = normalize(mat3(modelMatrix*instanceMatrix)*normal + vec3(0., 1e-5, 0.));
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,_o=`
varying vec3 vW, vN, vC;
varying vec2 vUv;
varying vec2 vR;
uniform sampler2D map;
uniform vec3 uCFrost;
#include <fog_pars_fragment>
${Ee}
void main(){
  vec3 alb = vC;
  #ifndef CONE
  vec4 tx = texture2D(map, vUv);
  if (vR.y > 0.01 && tx.a < 0.4) discard;
  alb *= mix(vec3(1.), tx.rgb*1.35, step(0.01, vR.y));
  #else
  alb *= 0.6 + 0.8*vnoise(vW.xz*0.35 + vW.y*0.9);
  #endif
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  float rime = vR.x*(0.45 + 0.55*clamp(N.y*0.8 + 0.5, 0., 1.))*(0.6 + 0.4*vnoise(vW.xz*1.7 + vW.y*2.3));
  alb = mix(alb, uCFrost*0.85, clamp(rime, 0., 0.92));
  float lit = sunGate(vW.y);
  float ndl = dot(N, uSunDir);
  vec3 E = uSunCol*clamp(ndl*0.6 + 0.4, 0., 1.)*0.7*lit + uSkyCol*(0.5 + 0.35*N.y);
  vec3 c3 = alb*E;
  c3 += alb*uSunCol*pow(max(dot(-V, uSunDir), 0.), 4.)*0.25*lit;
  gl_FragColor = vec4(max(c3, 0.), 1.);
  #include <fog_fragment>
}`,No=`
attribute vec4 iPos, iMove;
attribute float iSeed;
uniform vec2 uStreak;
varying vec2 vUv;
varying float vA;
#include <fog_pars_vertex>
${Ee}
void main(){
  float along = position.x, across = position.y;
  float L = iPos.w*uShadowLen, W = (0.34*iPos.w + 0.25)*uStreak.y;
  vec2 dir = -uSunXZ, pr = vec2(-dir.y, dir.x);
  vec2 xz = iPos.xz + dir*(along*L - 0.4) + pr*across*W*(1. + along*0.9);
  if (iMove.z > 0.) xz += iMove.xy*mod(uTime*iMove.w + iSeed*31., iMove.z);
  vec4 w = modelMatrix*vec4(xz.x, iPos.y + 0.07, xz.y, 1.);
  vUv = position.xy;
  vA = sunGate(iPos.y + 0.3)*(1. - uNight*0.5)*clamp(uSunDir.y*20., 0., 1.);
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Eo=`
varying vec2 vUv;
varying float vA;
uniform vec3 uShade;
uniform vec2 uStreak;
#include <fog_pars_fragment>
void main(){
  float e = 1. - vUv.y*vUv.y;
  float a = e*e*smoothstep(0., 0.03, vUv.x)*(1. - smoothstep(0.35, 1., vUv.x))*vA*uStreak.x;
  #ifdef USE_FOG
  float ff = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  a *= 1. - ff;
  #endif
  if (a < 0.004) discard;
  gl_FragColor = vec4(uShade, a);
}`,Sa=`
attribute vec4 iRing;             // x, z, age 0..1, strength
uniform float uY;
varying vec2 vUv;
varying vec2 vA;
#include <fog_pars_vertex>
void main(){
  float r = 0.4 + 2.6*sqrt(max(iRing.z, 0.));
  vec4 w = modelMatrix*vec4(iRing.x + position.x*r, uY, iRing.y + position.y*r, 1.);
  vUv = position.xy;
  vA = vec2(iRing.w*pow(max(1. - iRing.z, 0.), 1.5), iRing.z);
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Pa=`
varying vec2 vUv;
varying vec2 vA;
uniform vec3 uRingCol;
#include <fog_pars_fragment>
void main(){
  float d = length(vUv), wd = mix(0.45, 0.2, vA.y);
  float band = smoothstep(1. - 2.*wd, 1. - 1.5*wd, d)*(1. - smoothstep(1. - wd*0.4, 1., d));
  float crest = smoothstep(1. - 1.2*wd, 1. - 0.7*wd, d);
  float core = (1. - smoothstep(0., 0.55, d))*(1. - smoothstep(0., 0.4, vA.y));       // the slap itself: a pale boil
  float a = min((band*0.85 + core)*vA.x, 1.);
  if (a < 0.004) discard;
  gl_FragColor = vec4(mix(uRingCol*0.14, uRingCol, max(crest, core)), a);
  #include <fog_fragment>
}`,Fa=`
attribute vec4 iRing;
uniform float uY;
varying vec2 vUv;
varying vec2 vA;
#include <fog_pars_vertex>
void main(){
  float k = clamp(iRing.z/0.42, 0., 1.), hs = 0.7 + 0.5*fract(iRing.x*7.31 + iRing.y*3.17);
  float h = 1.25*hs*sin(3.1416*sqrt(k)), wd = (0.3 + 0.55*k)*hs;
  vec4 w = modelMatrix*vec4(iRing.x, uY + (position.y + 1.)*0.5*h, iRing.y, 1.);
  vec4 mvPosition = viewMatrix*w;
  mvPosition.x += position.x*wd;
  vUv = position.xy;
  vA = vec2(iRing.w*(1. - k)*step(0.001, h), k);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ra=`
varying vec2 vUv;
varying vec2 vA;
uniform vec3 uRingCol;
#include <fog_pars_fragment>
void main(){
  float t = vUv.y*0.5 + 0.5;                                    // 0 at the water, 1 at the top: a fan that opens upward and thins
  float fan = 1. - smoothstep(0.25 + 0.5*t, 0.45 + 0.55*t, abs(vUv.x));
  float a = fan*(1. - smoothstep(0.35, 1., t))*smoothstep(0., 0.08, t)*vA.x*0.9;
  if (a < 0.004) discard;
  gl_FragColor = vec4(uRingCol, a);
  #include <fog_fragment>
}`,_a=`
attribute vec3 aC, iCol;
attribute vec4 iPos, iPar;
varying vec2 vUv;
varying vec4 vCol;
varying vec3 vW, vLit;
#include <fog_pars_vertex>
${Ee}
void main(){
  vec2 b = iPos.xz;
  float dc = length(cameraPosition - iPos.xyz);
  float hh = iPar.y*(1. - smoothstep(105., 140., dc));
  vec3 l = vec3(position.x*iPar.x, position.y*hh, position.z*iPar.x);
  float cy = cos(iPos.w), sy = sin(iPos.w);
  vec3 w3 = vec3(l.x*cy + l.z*sy, l.y, -l.x*sy + l.z*cy) + iPos.xyz;
  // wind: gust bands travelling downwind, every tussock shivering on its own
  vec2 wd = uWind + vec2(0.02, 0.3);
  float wl = max(length(wd), 0.05); wd /= wl;
  float band = 0.5 + 0.5*sin(dot(b, wd)*0.21 - uTime*1.7 + 2.*sin(dot(b, vec2(-wd.y, wd.x))*0.05 + uTime*0.2));
  float sway = (0.03 + 0.11*band*band)*min(wl*0.5, 1.2);
  w3.xz += (wd*sway + vec2(sin(uTime*3.7 + iPar.z*40.), cos(uTime*3.1 + iPar.z*31.))*0.012)*aC.y*aC.y*(hh/0.5);
  vUv = aC.xy; vCol = vec4(iCol, iPar.z + aC.z);
  vW = w3;
  vLit = vec3(geyShadow(b), iPar.w, band);
  vec4 mvPosition = viewMatrix*vec4(w3, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Na=`
varying vec2 vUv;
varying vec4 vCol;
varying vec3 vW, vLit;
uniform vec3 uCFrost;
uniform vec4 uGrass;
uniform float uTFrost, uTAmb, uSnow;
#include <fog_pars_fragment>
${Ee}
// one blade: x in blade spacings from the foot of blade i, v up the card. Positive inside. Each blade has its own height,
// lean and width; wpx (spacings per pixel) fattens blades with distance so a far tussock closes into a soft clump
float blade(float x, float v, float i, float sd, float wpx){
  if (i < 0.5 || i > 7.5) return -1.;
  float h1 = hash12(vec2(i*1.7 + sd*91.3, sd*37.1 + i*0.31)), h2 = hash12(vec2(i*3.1 + sd*53.7, 7. + sd*11.3));
  float t = v/(0.5 + 0.5*h1);
  if (t >= 1.) return -1.;
  float c = (h2 - 0.5)*1.5*t*t + (h1 - 0.5)*0.4;
  return (0.30 + 0.12*h2)*(1. - t*t) + 0.03 + wpx*0.6 - abs(x - c);
}
void main(){
  float sd = vCol.a, bush = step(4., sd);
  float xs = vUv.x*9., v = vUv.y;
  float i0 = floor(xs), f = xs - i0 - 0.5, m;
  float wpx = min(fwidth(xs), 2.);
  // rabbitbrush: 26 twigs fanning out of one foot under a round outline; each forks once, so the dome is a mesh of fine lines
  float xc = vUv.x*2. - 1., dome = sqrt(max(1. - xc*xc, 0.));
  float ts = (xc/(0.25 + 0.75*v))*13. + 13.;
  float tw = min(fwidth(ts), 1.5);
  if (bush > 0.5){
    float ti = floor(ts), tf = ts - ti - 0.5;
    float hh = hash12(vec2(ti*1.7 + sd*31., sd*7.1)), top = dome*(0.72 + 0.28*hh);
    float fork = (hash12(vec2(ti*2.3, sd*13.)) - 0.5)*0.9*smoothstep(0.35, 0.9, v/max(top, 0.05));
    m = min((0.2 + tw*0.7) - min(abs(tf - fork), abs(tf + fork*0.6)), top - v);
    m = min(m, 13. - abs(ts - 13.));
    i0 = ti;
  } else {
    m = max(blade(f, v, i0, sd, wpx), max(blade(f + 1., v, i0 - 1., sd, wpx), blade(f - 1., v, i0 + 1., sd, wpx)));
  }
  if (m < 0.) discard;
  vec3 V = normalize(cameraPosition - vW);
  float lit = sunGate(vW.y)*(1. - vLit.x*0.9);
  float tipK = smoothstep(0.1, 0.95, v);
  float bt = hash12(vec2(i0*5.3 + sd*17.7, sd*3.3));
  vec3 alb = vCol.rgb*mix(vec3(0.8), uGrass.rgb, tipK)*(0.84 + 0.32*bt);
  // hoar frost edges the upper blade; the thatch below keeps its cured gold, so a tussock reads pale over dark
  float fro = clamp(uTFrost*(1. - vLit.y)*mix(0.22, 1.7, tipK), 0., 0.9);
  alb = mix(alb, uCFrost*0.86, fro);
  if (bush > 0.5){
    float hd = step(0.55, hash12(vec2(i0*3.7 + sd*5., floor(v*9.))))*smoothstep(0.5, 0.75, v)*(1. - uSnow);
    alb = mix(alb, vec3(0.8, 0.62, 0.14), hd*(1. - 0.5*fro));
  }
  float back = max(dot(-V, uSunDir), 0.); back *= back;
  // in the ridge's shadow the meadow is cool blue-grey, not sky blue: part of the fill is taken to its own grey
  vec3 amb = mix(uSkyCol, vec3(dot(uSkyCol, vec3(0.2126, 0.7152, 0.0722))), uTAmb);
  vec3 E = uSunCol*(uGrass.w*(0.75 + 0.5*tipK)*(0.8 + 0.4*vLit.z) + 0.34*back*tipK)*lit + amb*(0.7 + 0.3*tipK);
  vec3 c3 = alb*E*mix(mix(0.78, 0.6, uTAmb*2.), 1., smoothstep(0., 0.4, v));
  gl_FragColor = vec4(max(c3, 0.), 1.);
  #include <fog_fragment>
}`,At=c=>c-Math.floor(c),Ct=(c,w)=>{let E=At(c*.1031),b=At(w*.1031),M=E;const u=E*(b+33.33)+b*(M+33.33)+M*(E+33.33);return E+=u,b+=u,M+=u,At((E+b)*M)},Fe=(c,w)=>{const E=Math.floor(c),b=Math.floor(w),M=c-E,u=w-b,O=M*M*(3-2*M),D=u*u*(3-2*u),W=Ct(E,b),$=Ct(E+1,b),k=Ct(E,b+1),q=Ct(E+1,b+1);return(W+($-W)*O)*(1-D)+(k+(q-k)*O)*D},Ea=(c,w)=>Fe(c,w)*.6667+Fe(c*2.07+17.13,w*2.07+17.13)*.3333,Ve=(c,w)=>Fe(c,w)*.5714+Fe(c*2.07+17.13,w*2.07+17.13)*.2857+Fe(c*4.19+41.7,w*4.19+41.7)*.1429;function Ta(c,w,E){const b=new oe.Geo,M=new s.Color(c),u=new s.Color(w),O=new s.Color(E);b.loft([{z:-.66,y:.32,rx:0,ry:0},{z:-.52,y:.22,rx:.11,ry:.13},{z:-.22,y:.13,rx:.29,ry:.24},{z:.14,y:.1,rx:.33,ry:.25},{z:.42,y:.12,rx:.22,ry:.2},{z:.58,y:.17,rx:0,ry:0}],{sides:9,top:M,belly:u});for(const q of[-1,1])b.loft([{z:-.6,y:.3,x:q*.1,rx:0,ry:0},{z:-.3,y:.27,x:q*.2,rx:.09,ry:.13},{z:.1,y:.25,x:q*.24,rx:.1,ry:.14},{z:.34,y:.22,x:q*.18,rx:0,ry:0}],{sides:6,top:M,belly:u});const D=b.n,W=[],$=[];for(let q=0;q<=7;q++){const _=q/7;W.push([0,.2+.74*_,.42+.17*Math.sin(_*Math.PI*1.15)-.03*_]),$.push(.088-.045*_)}b.tube(W,$,6,M,M);const k=W[7];return b.blob(0,k[1]+.02,k[2]+.06,.055,.058,.1,M,null,6,3),b.tube([[0,k[1]+.01,k[2]+.13],[0,k[1]-.04,k[2]+.28]],[.036,.012],4,O,O),b.anim([D,b.n],(q,_)=>[Math.min(1,Math.max(0,(_-.2)/.7)),0,2,0]),b.pivot([D,b.n],0,.2,.42),b.build()}function st(c,w){const E=new s.InstancedBufferGeometry,b=w.length;E.index=c.index;for(const D in c.attributes)E.setAttribute(D,c.attributes[D]);const M=new Float32Array(b*4),u=new Float32Array(b*4),O=new Float32Array(b*4);return w.forEach((D,W)=>{M.set([D.x,D.y,D.z,D.yaw],W*4),u.set([D.scale,D.pose,D.seed,D.tint??1],W*4),O.set(D.move||[0,0,0,0],W*4)}),E.setAttribute("iPos",new s.InstancedBufferAttribute(M,4)),E.setAttribute("iPar",new s.InstancedBufferAttribute(u,4)),E.setAttribute("iMove",new s.InstancedBufferAttribute(O,4)),E.instanceCount=b,E}function To(c){const w=c.attributes.position,E=c.attributes.aAnim,b=c.attributes.aPivot;let M=-1,u=-1e9;for(let W=0;W<w.count;W++)E.getZ(W)>1.5&&E.getZ(W)<2.5&&E.getX(W)>.95&&w.getZ(W)-w.getY(W)*.4>u&&(u=w.getZ(W)-w.getY(W)*.4,M=W);if(M<0)return()=>[0,1,1];const O=[w.getX(M),w.getY(M),w.getZ(M)],D=[b.getX(M),b.getY(M),b.getZ(M)];return W=>{const $=O[1]-D[1],k=O[2]-D[2],q=Math.cos(W),_=Math.sin(W);return[O[0],D[1]+$*q-k*_,D[2]+k*q+$*_]}}var Va={id:"prismatic-dawn",name:"The Prismatic Eye",category:"wilderness",weirdness:.1,media:["air","open"],async build(c){const{rng:w,noise:E}=c,{clamp:b,lerp:M,smoothstep:u}=c.core,O=c.vary||{},D=c.quality?.detail??1,W=b(O.density??1,.7,1.3),$=!!O.rare,k=new s.Scene,q=w.fork("variation")();let _=q<.45?"dawn":q<.68?"evening":q<.84?"winter":q<.94?"day":"night";O.hour==="dawn"?_=q<.68?"dawn":"winter":O.hour==="day"?_="day":O.hour==="golden"?_="evening":O.hour==="night"&&(_="night");const m=ka[_],Xt=w.fork("weather")()<.22,St=w.fork("cast")()<.45&&(_==="evening"||_==="day"),Z=wa(m.sun[0],m.sun[1]).clone().normalize(),Do=111,Wo=58,Ie=[[131,2.7,268],[130.5,2.73,262.7],[129.2,2.77,257],[126.6,2.81,250.5],[124.2,2.86,244],[123.2,2.91,236.5],[123.8,2.96,228],[126.4,3.02,219],[130,3.08,209],[132.6,3.15,198],[134,3.23,186],[134.8,3.4,173],[136.6,4.4,150],[144,6.2,122],[152,8.6,93]];{const t=[12,15,18,21,24,27,30];for(let a=0;a<=6;a++){const o=a*30*Math.PI/180;Ie.push([Do+45*Math.cos(o),t[a],Wo-45*Math.sin(o)])}}Ie.push([66.3,29,73],[63,23.5,89],[50.5,14.5,100],[30.5,8,103.5],[9,5.3,98],[-10,4.7,90],[-24,4.5,76],[-35,4.5,60],[-45,4.6,44],[-52.5,4.7,28],[-56,4.7,9],[-51,4.6,-10],[-39,4.5,-28],[-21,4.5,-42],[0,4.6,-48.5],[22,5.6,-49.5],[43,9.5,-47],[62,16,-53],[75.5,24,-69],[78,32.5,-89.5],[67.5,41,-108],[46,49,-120],[20,56,-122.5],[-6,62.5,-116],[-29,68.5,-103],[-46.5,73.5,-85],[-55,76.5,-67],[-53,77.5,-55]);const Te=(()=>{const e=Math.cos(50*Math.PI/180),t=Math.sin(50*Math.PI/180),a=Math.SQRT1_2;return new s.Vector3(e*a,-t,e*a)})();Ie.push([-47,76,-46.5]);for(const e of[80,54,27,0])Ie.push([-Te.x*e,9-Te.y*e,-Te.z*e]);const I=Fo(Ie),me=I.length,A=e=>e/me;await c.yield();const Pt=[A(127),A(182)],Q=await ba(c,{palette:Ma,...m.hero,weather:Xt?"still":"breeze",sunDir:[Z.x,Z.y,Z.z],surge:Pt,river:[B.x0,B.zb,B.k,B.hw],route:Ie,snagCount:Math.round(44*b(D,.6,1))});k.add(Q.object);const ae=Q.uniforms,rt=Q.anchors,Be=rt.geyser.base[0],Ke=rt.geyser.base[2],Re=rt.fan.direction,De=rt.wind;await c.yield();const Go=new s.Vector3(0,9,0),pe=e=>{const t=Math.max(0,B.zb-e);return B.x0+t*t/(t+B.k)},ce=(e,t)=>{const a=Math.max(0,B.zb-t),o=a+B.k,n=(a*a+2*a*B.k)/(o*o);return Math.abs(e-pe(t))/Math.sqrt(1+n*n)-B.hw},xe=(e,t)=>{const a=e*Re[0]+t*Re[1],o=-e*Re[1]+t*Re[0];return Math.min(Math.hypot(e,t)-116,Math.hypot(e-Be,t-Ke)-46,Math.max(Math.abs(o)-(12+Math.max(a,0)*.24),a-205,-a))},_e={x:pe(151)-B.hw+4.5,z:151},Ft=(e,t)=>{const a=ce(e,t),o=xe(e,t);let n=-.34+.05*E.n2(e*.02,t*.02);t>250&&(n-=4.9*Math.min(1,(t-250)/15)*(1-u(134.5,141,e))*u(40,95,e)),n+=u(45,150,o)*u(6,40,a)*(.55+.75*E.fbm2(e*.006+7,t*.006,3));const r=Math.hypot((e+60)/800,(t-60)/600)+.1*E.fbm2(e*.0012,t*.0012+5,3),i=u(.86,1.4,r);if(i>0){const y=1-.84*Math.exp(-Math.pow((t-110)/300,2)),x=150+85*E.fbm2(e*.0015+3,t*.0015+9,4);n+=i*x*y*(.3+.7*u(30,300,a))+i*16*E.fbm2(e*.007,t*.007+2,3)*Math.min(1,y+.3)}const p=u(3.5,-2.5,a);if(p>0){const y=1.38*Math.exp(-Math.pow((e-_e.x)/5.5,2)-Math.pow((t-_e.z)/17,2));n=M(n,-1.8+y+.12*E.n2(e*.15,t*.07),p)}return n};let Rt=null;const Uo=(e,t)=>Rt&&t>240?Rt(e,t):Ft(e,t),_t=(e,t)=>t>244&&e>30&&e<146,be=(e,t)=>M(-.02,Uo(e,t),Math.max(u(20,40,xe(e,t)),u(3,.5,ce(e,t)))),ze=va({rng:w,bake:!0,renderer:c.renderer,...m.sky,sunElevation:_==="night"?-30:m.sun[0],sunAzimuth:m.sun[1]});k.add(ze.object),await c.yield(),k.fog=new s.FogExp2(new s.Color(m.fog[0]),m.fog[1]);const Vo=new s.HemisphereLight(new s.Color(m.hemi[0]),new s.Color(m.hemi[1]),m.hemi[2]),Xe=new s.DirectionalLight(new s.Color(m.dir[0]),m.dir[1]);Xe.position.copy(Z).multiplyScalar(300),k.add(Vo,Xe,Xe.target);const $e=Q.colors;m.snow&&$e.meadow.lerp(new s.Color("#c9d2e0"),.2),_==="day"&&$e.meadow.set("#637a3c");const $t=()=>s.UniformsUtils.clone(s.UniformsLib.fog),ge=(e,t,a={},o={})=>new s.ShaderMaterial({uniforms:{...$t(),...ae,...a},vertexShader:e,fragmentShader:t,fog:!0,...o}),Le=(e,t)=>I.nearestXZ(e,t).dist,K=[],Io=Math.round(b(8*W,6,10)),ue=w.fork("fumaroles");K.push({x:116+ue.range(-2,2),z:146+ue.range(-3,3),r:9,big:.8}),K.push({x:92+ue.range(-6,6),z:232+ue.range(-8,8),r:8,big:.8});for(let e=0;e<500&&K.length<Io;e++){const t=ue.range(0,6.283),a=ue.range(150,420),o=Math.cos(t)*a,n=Math.sin(t)*a+40;xe(o,n)<55||ce(o,n)<14||Le(o,n)<45||_t(o,n)||K.some(r=>Math.hypot(r.x-o,r.z-n)<70)||Math.hypot(o,n)<300||K.push({x:o,z:n,r:ue.range(7,13),big:ue.range(.7,1.4)})}const ve=[];for(let e=0;e<400&&ve.length<5;e++){const t=ue.range(40,124),a=ue.range(205,330),o=ue.range(1.5,2.5);xe(t,a)<50||Le(t,a)<18+o||_t(t,a)||ve.some(n=>Math.hypot(n.x-t,n.z-a)<14)||K.some(n=>Math.hypot(n.x-t,n.z-a)<16)||ve.push({x:t,z:a,r:o})}const Qt={x:128.4,z:190,r:6.4,big:.22};K.length<10?K.push(Qt):K[9]=Qt;const ne={x:120.5,z:201,r:4.2},it=[{x:70,z:-185,r:11},{x:-158,z:-112,r:8},{x:-178,z:62,r:9},{x:-52,z:196,r:7.5}],Jt=new s.Vector3(1e5,1e5,1),Bo={uFum:{value:Array.from({length:10},(e,t)=>K[t]?new s.Vector3(K[t].x,K[t].z,K[t].r):Jt.clone())},uPots:{value:Array.from({length:5},(e,t)=>ve[t]?new s.Vector3(ve[t].x,ve[t].z,ve[t].r):Jt.clone())},uWallow:{value:new s.Vector4(ne.x,ne.z,ne.r,0)},uPools:{value:it.map(e=>new s.Vector3(e.x,e.z,e.r))},uForest:{value:new s.Color(m.forest)},uRock:{value:new s.Color(m.rock)},uSnowCol:{value:new s.Color("#d9e1ee")},uSnow:{value:m.snow},uWaterY:{value:B.y},uEdge:ae.uEdge};ae.uFrost.value=m.frost*.55,$e.sinter.multiplyScalar(.78);{const i=new Float32Array(93987),p=new Uint32Array(30976*6),y=f=>{const d=(f-88)/88;return 250*d+2350*d*d*d};for(let f=0,d=0;f<=176;f++){const v=120+y(f);for(let g=0;g<=176;g++,d+=3){const R=115+y(g);i[d]=R,i[d+1]=Ft(R,v),i[d+2]=v}(f&3)===3&&await c.yield()}for(let f=0,d=0;f<176;f++)for(let v=0;v<176;v++,d+=6){const g=f*177+v,R=g+1,V=g+176+1,T=V+1;p[d]=g,p[d+1]=V,p[d+2]=R,p[d+3]=R,p[d+4]=V,p[d+5]=T}await c.yield();const x=new s.BufferGeometry;x.setAttribute("position",new s.BufferAttribute(i,3)),x.setIndex(new s.BufferAttribute(p,1));const S=new Float32Array(i.length),h=177;for(let f=0;f<=176;f++){const d=Math.max(0,f-1)*h,v=Math.min(176,f+1)*h;for(let g=0;g<=176;g++){const R=(f*h+Math.max(0,g-1))*3,V=(f*h+Math.min(176,g+1))*3,T=(d+g)*3,L=(v+g)*3,F=i[V]-i[R],N=i[V+1]-i[R+1],H=i[V+2]-i[R+2],ie=i[L]-i[T],ye=i[L+1]-i[T+1],Se=i[L+2]-i[T+2],Pe=ye*H-Se*N,te=Se*F-ie*H,le=ie*N-ye*F,Ye=Math.hypot(Pe,te,le)||1,j=(f*h+g)*3;S[j]=Pe/Ye,S[j+1]=te/Ye,S[j+2]=le/Ye}(f&31)===31&&await c.yield()}x.setAttribute("normal",new s.BufferAttribute(S,3)),await c.yield();const P=new s.Mesh(x,ge(Aa,Ca,Bo));P.renderOrder=-8,P.frustumCulled=!1,k.add(P);const l=Float32Array.from({length:177},(f,d)=>y(d)),U=f=>{let d=0,v=175;for(;d<v;){const g=d+v+1>>1;l[g]<=f?d=g:v=g-1}return d};Rt=(f,d)=>{const v=U(f-115),g=U(d-120),R=b((f-115-l[v])/(l[v+1]-l[v]),0,1),V=b((d-120-l[g])/(l[g+1]-l[g]),0,1),T=(g*177+v)*3+1,L=i[T],F=i[T+3],N=i[T+531],H=i[T+534];return R+V<=1?L+(F-L)*R+(N-L)*V:H+(N-H)*(1-R)+(F-H)*(1-V)}}await c.yield();const eo=ya.makeHorizonRidges({rng:w.fork("ridges"),layers:3,radius:[1900,3500],height:[55,135],base:-30,fog:k.fog,sunDir:Z,sunColor:m.dir[0],sunIntensity:_==="night"?.25:.9,colorNear:_==="night"?"#0e1830":"#33455f",snow:m.snow?!0:"#c4cfe2",snowLine:m.snow?.3:.72,rim:.3,coverage:.8});k.add(eo.object),await c.yield();const to=[];for(let e=640;e>=-600;e-=40)to.push([pe(e),B.y,e]);const oo=xa.makeRiver({rng:w.fork("river"),points:to,width:B.hw*2+1.5,speed:1.5,segments:330,across:10,light:ze,...m.line?{zenith:"#3f5c98",mid:"#4a63a0",horizon:"#6a78a0",scatter:.2}:_==="evening"?{zenith:"#3c4d84",mid:"#5c5c90",horizon:"#a47c84",scatter:.4}:{},deep:_==="night"?"#0a1626":"#3a7c8c",shallow:_==="night"?"#4f8a8e":"#7fbdb6",foam:.25,bankFoam:.35,ripple:.9,opacity:.82,bankFade:2.2,chop:.05});k.add(oo.object),await c.yield();const Ko=Ue.makeWind({direction:[De[0]||.1,De[1]||1],strength:Xt?.35:.9,speed:1});await c.yield();const ao={wind:Ko,backlight:.7,backlightTint:"#ffe2a0"};await Ue.prepareLeafTexture(ao,c.yield);const Nt=Ue.windMaterial(ao);await c.yield();const no=(e,t)=>{if(Math.hypot(e-ne.x,t-ne.z)<ne.r*.8)return!0;for(const a of K)if(Math.hypot(a.x-e,a.z-t)<3.5)return!0;for(const a of ve)if(Math.hypot(a.x-e,a.z-t)<a.r*1.5)return!0;return!1},so=(e,t)=>ce(e,t)<1.5||no(e,t)?0:u(-4,22,xe(e,t)),se=ae.uSeed.value,lt=ae.uFan.value,ro=(e,t)=>{const a=Math.hypot(e,t),o=u(6,60,a),n=a+(Ve(e*.021+se.x,t*.021+se.y)-.5)*15*o+(Ea(e*.085+se.z,t*.085+se.w)-.5)*5*o*o,r=e*lt.x+t*lt.y,i=-e*lt.y+t*lt.x,p=Ve(e*.013+se.z*1.7,t*.013+se.w*1.7),y=Fe(e*.07+9,t*.07+9);return Math.min(n-116,Math.hypot(e-Be,t-Ke)-46,Math.max(Math.abs(i)-(12+Math.max(r,0)*.24),r-205,-r))+(p-.5)*30+(y-.5)*10},Lo=(e,t)=>ce(e,t)<1?0:u(-2,9,ro(e,t)),Et=m.frost>.5?[1.45,1.42,1.3]:_==="day"?[1.08,1.06,.8]:[1.34,1.22,.9],jo={uGrass:{value:new s.Vector4(Et[0],Et[1],Et[2],Math.min(3*Z.y+.07,_==="day"?.44:.6))},uTFrost:{value:m.frost*.55*(m.frost>.5?1:.4)},uTAmb:{value:m.frost>.5&&_!=="night"?.5:.12},uSnow:{value:m.snow?1:0}};let Tt=null;{const e=w.fork("grass"),t=217,a=D*(.85+.15*W),o=new s.Vector3,n=new s.Vector3,r=Math.ceil(t)+10,i=new Float32Array(r+1),p=new Float32Array(r+1),y=new Float32Array(r+1),x=new Float32Array(r+1);for(let f=0;f<=r;f++){I.posAtDist(f-8,o),I.tangentAtDist(f-8,n);const d=Math.hypot(n.x,n.z)||1;i[f]=o.x,p[f]=o.z,y[f]=n.x/d,x[f]=n.z/d}const S=[{iPos:[],iPar:[],iCol:[]},{iPos:[],iPar:[],iCol:[]}],h=new s.Color("#d9e1ee"),P=new s.Color,l=[[0,6,6.4,1],[6,14,3,1.05],[14,34,1.3,1.2],[34,92,.3,1.6]];let U=0;for(const[f,d,v,g]of l){const{iPos:R,iPar:V,iCol:T}=S[f<14?0:1],L=Math.round((t+8)*(d-f)*2*v*a);for(let F=0;F<L;F++){const N=e.range(0,t+8),H=(e()<.5?-1:1)*e.range(f,d),ie=e.range(0,6.283),ye=e(),Se=e.range(.78,1.12),Pe=e.range(.4,.62),te=e();(++U&63)===0&&await c.yield();const le=Math.min(r-1,Math.floor(N)),Ye=N-le,j=i[le]+(i[le+1]-i[le])*Ye-x[le]*H,Y=p[le]+(p[le+1]-p[le])*Ye+y[le]*H,ko=ce(j,Y);if(ko<1.2||no(j,Y))continue;const Ht=ro(j,Y)+12*u(106,117,j)*u(148,160,Y),Ao=u(-2,9,Ht);if(Ao<.12||1-Math.abs(2*Fe(j*.021+se.z,Y*.021+se.w)-1)>.955&&te<.94)continue;const Co=Ve(j*.011+se.x,Y*.011+se.y),So=Math.hypot(j,Y),pa=Ht>20?Math.max(u(.57,.68,Co+(Ve(j*.06+3.1,Y*.06+3.1)-.5)*.22),(1-u(215,315,So+(Co-.5)*90))*u(.36,.5,Ve(j*.017+se.y+9,Y*.017+se.x+9)+.3*(1-u(120,210,So))))*u(20,38,Ht)*u(30,75,Math.hypot(j-128,Math.max(Math.abs(Y-212)-62,0))):0;if(te<pa*.92||m.snow&&te>.62)continue;let Ze=Math.max(1-u(.5,8,ko),1-u(22,46,Math.hypot(j-Be,Y-Ke)));for(const zt of K)Ze=Math.max(Ze,1-u(zt.r*.4,zt.r,Math.hypot(zt.x-j,zt.z-Y)));const ga=(.65+.5*(Fe(j*.25+77,Y*.25+77)*.5714+Fe(j*.5175+176.52,Y*.5175+176.52)*.2857+.0714))*.84*(.86+.28*At(ye*7.13)),Yt=u(.52,.72,Ve(j*.035+19,Y*.035+19))*.65;P.copy($e.meadow).multiplyScalar(ga),P.r*=1-.26*Yt,P.g*=1-.34*Yt,P.b*=1-.42*Yt,P.lerp($e.moss,Ze*.6),m.snow&&P.lerp(h,.4*(1-Ze));const Po=Math.max(Ze,.7*u(.44,.64,Ve(j*.045+61,Y*.045+61)));R.push(j,be(j,Y)-.03,Y,ie),V.push(Se*g,Pe*(.5+.5*Ao)*(g>1.3?1.25:1)*(m.snow?.6:1)*(1+.25*(Po-Ze)),ye,Po),T.push(P.r,P.g,P.b)}}Tt=ge(_a,Na,jo,{side:s.DoubleSide}),await c.yield();for(let f=0;f<2;f++){const d=S[f],v=f===0?3:2,g=[],R=[],V=[];for(let F=0;F<v;F++){const N=F*Math.PI/v,H=Math.cos(N)*.5,ie=Math.sin(N)*.5,ye=F%2?-1:1,Se=-Math.sin(N)*ye,Pe=Math.cos(N)*ye,te=F*4;g.push(-H-Se*.1,0,-ie-Pe*.1,H-Se*.1,0,ie-Pe*.1,-H+Se*.26,1,-ie+Pe*.26,H+Se*.26,1,ie+Pe*.26),R.push(0,0,F*.37,1,0,F*.37,0,1,F*.37,1,1,F*.37),V.push(te,te+1,te+2,te+2,te+1,te+3)}const T=new s.InstancedBufferGeometry;T.setAttribute("position",new s.Float32BufferAttribute(g,3)),T.setAttribute("aC",new s.Float32BufferAttribute(R,3)),T.setIndex(V),T.setAttribute("iPos",new s.InstancedBufferAttribute(new Float32Array(d.iPos),4)),T.setAttribute("iPar",new s.InstancedBufferAttribute(new Float32Array(d.iPar),4)),T.setAttribute("iCol",new s.InstancedBufferAttribute(new Float32Array(d.iCol),3)),T.instanceCount=d.iPos.length/4;const L=new s.Mesh(T,Tt);L.frustumCulled=!1,k.add(L),await c.yield()}}await c.yield();const Dt=w.fork("brush"),qo=m.frost>.5?{leaf:"#8f9468",leafLight:"#d9dccb",leafDark:"#4d5338"}:{leaf:"#6f8a44",leafLight:"#b9c878",leafDark:"#3a4a26"},Wt=[];for(let e=0;e<3;e++)Wt.push(Ue.bushGeometry({rng:Dt,size:Dt.range(.62,.85),detail:1,flowers:m.snow?0:.55,flowerColor:"#e6c236",...qo})),await c.yield();const io=Ue.makeScatter({rng:Dt,path:I,uRange:[0,A(237)],radius:60,corridor:8.5,count:Math.round(80*W),spacing:1.6,scale:[.75,1.3],heightAt:be,density:so,material:Nt,variants:Wt,groundShadow:{sunDir:Z,strength:.4}});k.add(io.object),await c.yield();const Qe=[],lo=(()=>{const e=w.fork("brush2"),t=[],a=new s.Vector3,o=new s.Vector3,n=.08*me,r=(i,p,y)=>{I.posAtDist(i,a),I.tangentAtDist(i,o);const x=Math.hypot(o.x,o.z)||1,S=a.x-o.z/x*p,h=a.z+o.x/x*p;so(S,h)<.5||_t(S,h)||t.some(P=>Math.hypot(P.x-S,P.z-h)<2.6)||Qe.some(P=>Math.hypot(P.x-S,P.z-h)<1.7)||(Math.abs(p)<8?Qe.push({x:S,y:be(S,h),z:h,s:y,rot:e.range(0,6.283),sd:e()}):t.push({x:S,y:be(S,h),z:h,s:y,rot:e.range(0,6.283),d:Math.abs(p),u:i/me,v:t.length%3}))};r(n+5,-2.2,1.5),r(n+7.5,2.6,1.3),r(n+9,-4.6,1.9),r(n+12,-1.9,1.7),r(n+13,3.3,1.5),r(n+17,-3.6,2),r(n+19,1.8,1.6),r(n+24,-2.4,2.1),r(n+27,4.2,1.8),r(7,-3.4,1.7),r(11,4.2,2),r(17,-6.5,2.2),r(23,2.6,1.6);for(let i=0,p=Math.round(110*W);i<p;i++){const y=e.range(6,190),x=(e()<.5?-1:1)*e.range(2.2,17),S=e.range(.9,1.9);y>n-6&&y<n+30&&x>4.5&&x<13||r(y,x,S)}return Ue.makeScatter({rng:e,points:t,heightAt:be,material:Nt,variants:Wt,groundShadow:{sunDir:Z,strength:.45}})})();if(k.add(lo.object),await c.yield(),Qe.length){const t=[],a=[],o=[],n=[],r=[],i=[],p=new s.Color(m.frost>.5?"#5c6638":"#6f8a44"),y=new s.Color;for(let h=0;h<5;h++){const P=h*Math.PI/5,l=Math.cos(P)*.5,U=Math.sin(P)*.5,f=h%2?-1:1,d=-Math.sin(P)*f,v=Math.cos(P)*f,g=h*4;t.push(-l-d*.04,0,-U-v*.04,l-d*.04,0,U-v*.04,-l+d*.16,1,-U+v*.16,l+d*.16,1,U+v*.16),a.push(0,0,h*.37,1,0,h*.37,0,1,h*.37,1,1,h*.37),o.push(g,g+1,g+2,g+2,g+1,g+3)}for(const h of Qe)y.copy(p).multiplyScalar(.8+.4*h.sd),n.push(h.x,h.y-.04,h.z,h.rot),r.push(.82*h.s,(.5*h.s+.12)*(m.snow?.8:1),4+h.sd,.72+.15*h.sd),i.push(y.r,y.g,y.b);const x=new s.InstancedBufferGeometry;x.setAttribute("position",new s.Float32BufferAttribute(t,3)),x.setAttribute("aC",new s.Float32BufferAttribute(a,3)),x.setIndex(o),x.setAttribute("iPos",new s.InstancedBufferAttribute(new Float32Array(n),4)),x.setAttribute("iPar",new s.InstancedBufferAttribute(new Float32Array(r),4)),x.setAttribute("iCol",new s.InstancedBufferAttribute(new Float32Array(i),3)),x.instanceCount=Qe.length;const S=new s.Mesh(x,Tt);S.frustumCulled=!1,k.add(S)}await c.yield();const Oo={map:{value:Nt.map}},J=w.fork("trees"),we=new s.Object3D,Me=[];for(let e=0;e<600&&Me.length<Math.round(11*W);e++){const t=J.range(0,6.283),a=J.range(230,640),o=Math.cos(t)*a*1.15,n=Math.sin(t)*a*.9+60;xe(o,n)<90||ce(o,n)<25||Le(o,n)<110||Me.some(r=>Math.hypot(r.x-o,r.z-n)<110)||Me.push({x:o,z:n,r:J.range(22,55),n:J.int(12,26)})}for(const[e,t,a,o]of[[3.5,210,30,16],[4.05,232,34,18],[4.6,250,30,16],[5.25,262,26,12],[2.95,245,30,14],[2.2,238,28,12]])Me.push({x:Math.cos(e)*t,z:Math.sin(e)*t,r:a,n:Math.round(o*b(D,.6,1)),edge:!0});for(let e=2;e<K.length&&e<5;e++)Me[e]&&!Me[e].edge&&(Me[e].x=K[e].x+30,Me[e].z=K[e].z-12);const co=[];for(const e of Me)for(let t=0;t<e.n;t++){const a=e.x+J.gauss()*e.r*.5,o=e.z+J.gauss()*e.r*.5;if(xe(a,o)<70||ce(a,o)<12||Le(a,o)<(e.edge?55:80)||it.some(r=>Math.hypot(r.x-a,r.z-o)<r.r*2.6+4))continue;let n=m.snow?.75:.14*m.frost;for(const r of K)n=Math.max(n,m.frost*(1-u(35,85,Math.hypot(r.x-a,r.z-o))));co.push({x:a,z:o,s:J.range(.8,1.2),rime:n})}await c.yield();const uo=[];for(let e=0;e<3;e++)uo.push(Ue.coniferGeometry({rng:J,height:18+e*3,detail:e===0?1:0,slim:1.1,leaf:"#234a34",leafLight:"#4f7a4c",leafDark:"#0f241a"})),await c.yield();const Ho=ge(Ro,_o,Oo,{side:s.DoubleSide}),fo=[];uo.forEach((e,t)=>{const a=co.filter((r,i)=>i%3===t);if(!a.length)return;const o=new s.InstancedMesh(e,Ho,a.length),n=new Float32Array(a.length);a.forEach((r,i)=>{we.position.set(r.x,be(r.x,r.z)-.2,r.z),we.rotation.set(0,J.range(0,6.283),0),we.scale.setScalar(r.s),we.updateMatrix(),o.setMatrixAt(i,we.matrix),n[i]=r.rime,i%5===0&&fo.push({x:r.x,y:be(r.x,r.z),z:r.z,h:6})}),e.setAttribute("iRime",new s.InstancedBufferAttribute(n,1)),o.instanceMatrix.needsUpdate=!0,k.add(o)}),await c.yield();{const e=Math.round(2600*D),t=new s.ConeGeometry(.17,.92,5,1,!0).translate(0,.52,0),a=new s.Color(m.forest).multiplyScalar(.8),o=new Float32Array(t.attributes.position.count*3);for(let p=0;p<o.length;p+=3)o[p]=a.r,o[p+1]=a.g,o[p+2]=a.b;t.setAttribute("color",new s.BufferAttribute(o,3));const n=new s.InstancedMesh(t,ge(Ro,_o,{},{defines:{CONE:1}}),e),r=new Float32Array(e);let i=0;for(let p=0;p<e*14&&i<e;p++){const y=J.range(0,6.283),x=J.range(.86,1.75),S=-60+Math.cos(y)*x*800,h=60+Math.sin(y)*x*600,P=Ft(S,h);if(P<5||E.fbm2(S*.004+40,h*.004,2)<-.25+(P<14?.3:0))continue;we.position.set(S,P-1,h),we.rotation.set(0,J.range(0,6.283),0);const l=J.range(17,27);we.scale.set(l*1.25,l,l*1.25),we.updateMatrix(),n.setMatrixAt(i,we.matrix),r[i++]=m.snow?.7:.1*m.frost,(p&1023)===1023&&await c.yield()}n.count=i,t.setAttribute("iRime",new s.InstancedBufferAttribute(r,1)),n.instanceMatrix.needsUpdate=!0,n.frustumCulled=!1,k.add(n)}await c.yield();const Gt={...oe.HERD_PRESETS.bison,sides:16,legSides:7,hump:.3,width:.46,depth:.66,neck:[.4,.3],neckLen:.2,neckAng:-14,headLen:.4,headR:.19,headPitch:62,horns:.17,tail:.34,coat:"#3b2a1e",belly:"#2a1e17",legs:"#231913",sock:"#1c1410",accent:"#1d1511",horn:"#2a2622",hoof:"#15110e"},je={...oe.HERD_PRESETS.deer,h:1.5,sides:14,antlers:.78,neck:[.2,.12],neckLen:.56,width:.34,depth:.46,coat:"#7a5c3e",belly:"#5a4430",legs:"#3a2a1e",sock:"#32241a",accent:"#d9c8a4",horn:"#cdbb92"},Ut=oe.quadrupedGeometry(Gt),ho=oe.quadrupedGeometry(je),Yo=To(Ut),Vt=To(ho);await c.yield();const C=w.fork("herd"),fe=[],ke=[],ct=[[112,205],[117,160],[123.5,128],[129,95],[131,70],[124,46],[106,30],[86,14],[73,-18],[70,-60],[60,-110],[40,-170],[20,-230],[0,-300],[-20,-380]],Zo=(e,t)=>{if(!$)return!1;if(e>100&&e<136&&t>96&&t<160)return!0;for(let a=0;a<ct.length-1;a++){const o=ct[a],n=ct[a+1],r=n[0]-o[0],i=n[1]-o[1],p=b(((e-o[0])*r+(t-o[1])*i)/(r*r+i*i),0,1);if(Math.hypot(o[0]+r*p-e,o[1]+i*p-t)<11)return!0}return!1},Je=_==="day"?2.6:1,It=(e,t,a=4.5)=>ce(e,t)>2.5&&xe(e,t)>-4&&I.distanceTo(e,1.2,t)>8.6&&Math.hypot(e-ne.x,t-ne.z)>7&&!Zo(e,t)&&!fe.some(o=>Math.hypot(o.x-e,o.z-t)<a)&&!it.some(o=>Math.hypot(o.x-e,o.z-t)<o.r*1.7+2)&&!K.some(o=>Math.hypot(o.x-e,o.z-t)<5)&&!ve.some(o=>Math.hypot(o.x-e,o.z-t)<o.r+3),ee=(e,t,a,o,n,r=1)=>{const i={x:e,z:t,y:be(e,t),yaw:a,scale:o,pose:n,seed:C(),tint:r*C.range(.85,1.15)};return fe.push(i),i};ee(128.1,238.2,-Math.PI/2-.25+C.range(-.1,.1),1.2,0),ee(ne.x,ne.z,C.range(.6,1.2),1.1,2);for(const[e,t,a,o,n]of[[5,-59.5,2.2,1.14,0],[13.5,-63,-1.9,.96,1],[20,-60.5,2.6,1.02,0],[29,-64.5,1.3,.92,1],[16.5,-66.5,.4,.56,0],[38,-62,-2.4,1.1,0]]){const r=ee(e,t,a+C.range(-.2,.2),o,n,o<.7?Je:1);r.y=.02}{const e=.08*I.length,t=I.posAtDist(e),a=I.posAtDist(e+20),o=Math.hypot(a.x-t.x,a.z-t.z)||1,n=(a.x-t.x)/o,r=(a.z-t.z)/o;for(const[i,p,y,x,S]of[[9.5,9,.98,0,-1.75],[14.5,10.4,1.1,1,1.2],[11.5,7.2,.55,0,2.4]]){let h=t.x+n*i-r*p,P=t.z+r*i+n*p;h=Math.min(h,pe(P)-B.hw-1.4),ee(h,P,S+C.range(-.15,.15),y,x,y<.7?Je:1)}}for(let e=0;e<7;e++){const t=236-e*8.5+C.range(-2,2),a=I.nearestXZ(134,t),o=I.pointAt(a.u).x,n=Math.min(o+C.range(8.8,12.5),pe(t)-B.hw-2.8);if(!It(n,t,3.2))continue;const r=e%3===2;ee(n,t,C.range(0,6.283),r?C.range(.5,.58):C.range(.86,.96),r?0:C()<.7?1:0,r?Je:1)}{const e=164+C.range(-1,1),t=Math.min(I.pointAt(I.nearestXZ(136,e).u).x+9.6,pe(e)-B.hw-2.2);fe.some(n=>Math.hypot(n.x-t,n.z-e)<5)||ee(t,e,Math.PI/2+C.range(-.3,.3),1.07,0);const a=172.5+C.range(-1,1),o=Math.min(I.pointAt(I.nearestXZ(136,a).u).x+11.5,pe(a)-B.hw-2.4);It(o,a,3.2)&&ee(o,a,C.range(0,6.283),.9,1)}if(!$)for(let e=0,t=0;e<40&&t<6;e++){const a=C.range(108,125),o=C.range(118,162);if(I.distanceTo(a,1.2,o)<13||fe.some(r=>Math.hypot(r.x-a,r.z-o)<3.4)||K.some(r=>Math.hypot(r.x-a,r.z-o)<6))continue;const n=t===2;ee(a,o,C.range(0,6.283),n?.55:t===0?1.12:C.range(.86,.98),t%2?1:0,n?Je:1),t++}const Xo=Math.round(b(41*W,30,52))+1-($?16:0);await c.yield();for(let e=0;e<3e3&&fe.length<Xo;e++){(e&31)===31&&await c.yield();const t=C();let a,o;if(t<.42)a=C.range(52,128),o=C.range(150,300);else if(t<.6)a=C.range(60,150),o=C.range(290,420);else if(t<.82)a=C.range(188,330),o=C.range(40,330);else{const i=C.range(1.6,5.2),p=C.range(135,260);a=Math.cos(i)*p,o=Math.sin(i)*p}if(!It(a,o)||xe(a,o)<6&&t<.82)continue;const n=C()<.16,r=!n&&C()<.3;ee(a,o,C.range(0,6.283),n?C.range(.5,.6):r?C.range(1.05,1.16):C.range(.86,.98),C()<.62&&!n?1:0,n?Je:1)}{const e=C.range(2.5,3.6),t=C.range(128,150),a=[Math.cos(e+Math.PI/2),Math.sin(e+Math.PI/2)],o=Math.atan2(a[0],a[1]);for(let n=0;n<5;n++){const r=-40-n*7.5+C.range(-1,1),i=Math.cos(e)*t+a[0]*r,p=Math.sin(e)*t+a[1]*r,y=ee(i,p,o,n===0?1.1:C.range(.55,.98),3);y.y=.02,y.move=[a[0],a[1],150,1.15]}}ee(_e.x-.3,_e.z+3,-2.1,1.2,4),ke.push(fe.pop()),ee(_e.x+1.4,_e.z-5,2.6,.9,1),ke.push(fe.pop()),ee(_e.x-.8,_e.z-12,1.2,.88,0),ke.push(fe.pop()),await c.yield();const ut={uH:{value:Gt.h},uGraze:{value:.62},uBugle:{value:0},uRun:{value:new s.Vector4(0,0,-1,0)},uCoatFrost:{value:m.frost},uGal:{value:new s.Vector2(0,15)},uCoat:{value:new s.Vector2(_==="day"?.7:1,0)}},mo=new s.Mesh(st(Ut,fe),ge(Mt,kt,ut,{side:s.DoubleSide}));mo.frustumCulled=!1,k.add(mo),await c.yield();const po={...ut,uH:{value:je.h},uGraze:{value:1.5},uBugle:{value:0}},$o=oe.quadrupedGeometry({...je,antlers:0}),Bt=new s.Mesh(st(ho,ke.slice(0,1)),ge(Mt,kt,po,{side:s.DoubleSide}));Bt.frustumCulled=!1,k.add(Bt);const go=new s.Mesh(st($o,ke.slice(1)),Bt.material);go.frustumCulled=!1,k.add(go),await c.yield();const X=St?{body:"#a08c72",shade:"#5a4c40",bill:"#141414",wing:"#6c5c4c",lining:"#c9b89c",neck:"#16161a",breast:"#d9ccb4",size:1.5,n:8}:{body:"#eef0f4",shade:"#b4bccc",bill:"#16161a",wing:"#e6e9f0",lining:"#e6e9f0",neck:"#eef0f4",breast:"#eef0f4",size:1.9,n:8},et=w.fork("swans"),Kt=[];for(let e=0;e<X.n;e++){const t=212-e*3.6+et.range(-1.2,1.2);Kt.push({x:pe(t)-B.hw+et.range(3.5,7.5),y:B.y-.04,z:t,yaw:Math.PI+et.range(-.5,.5),scale:1.55*(St?.8:1)*et.range(.92,1.08),pose:5,seed:et()})}const vo={...ut,uH:{value:.9},uGraze:{value:0},uRun:{value:new s.Vector4(0,0,-1,9)},uCoatFrost:{value:0}},Lt=new s.Mesh(st(Ta(X.body,X.shade,X.bill),Kt),ge(Mt,kt,vo,{side:s.DoubleSide}));Lt.frustumCulled=!1,k.add(Lt),await c.yield();const wo={sunDir:Z,sunColor:m.faunaSun[0],sunIntensity:m.faunaSun[1],sky:m.faunaSky[0],skyIntensity:m.faunaSky[1],ground:m.hemi[1],groundIntensity:.7},Qo={...wo,skyIntensity:m.faunaSky[1]*2.1,ground:m.faunaSky[0],groundIntensity:1.3},Jo=[[18,27,.5],[44,25,.5],[60,20,.5],[66,17.5,.6],[72,16.2,1.3],[78,14.2,2.6],[84,12,3.6],[96,10.4,4.2],[108,9.6,4.5],[120,9.4,4.8],[132,10.2,5.3],[146,13,6],[163,18,7.4],[183,27,9.5]],re=[],Ae=[],We=[0],Ne=new s.Vector3,de=new s.Vector3;for(const[e,t,a]of Jo){I.posAtDist(e,Ne),I.tangentAtDist(e,de);const o=Math.hypot(de.x,de.z)||1;re.push([Ne.x-de.z/o*t,B.y+a,Ne.z+de.x/o*t]),Ae.push(e)}for(const[e,t,a]of[[40,-6,13],[-30,-4,19],[-120,0,27],[-240,0,36]]){const o=[pe(e)+t,a,e],n=re[re.length-1];Ae.push(Ae[Ae.length-1]+Math.hypot(o[0]-n[0],o[1]-n[1],o[2]-n[2])),re.push(o)}for(let e=1;e<re.length;e++)We.push(We[e-1]+Math.hypot(re[e][0]-re[e-1][0],re[e][1]-re[e-1][1],re[e][2]-re[e-1][2]));const he=oe.makeFlock({rng:w.fork("swanflock"),species:"geese",count:X.n,size:X.size,form:"loose",spread:[2.2,.4,10.5],wander:[.4,.2,.4,.4],route:re,closed:!1,start:0,speed:19,flap:2.6,neck:.5,body:X.body,belly:X.breast,wingC:X.wing,trail:X.lining,tip:St?"#2a2420":X.wing,head:X.neck,neckC:X.neck,tailC:X.body,beak:X.bill,light:Qo,translucency:1,rim:.7});k.add(he.object),await c.yield();const ft=he.route.length,ea=ft/We[We.length-1],yo=e=>{const t=e*me,a=t+30-13*u(47,63,t)+4*u(67,91,t)+50*Math.pow(u(79,174,t),1.5)+Math.max(0,t-174)*.5;let o=1;for(;o<Ae.length-1&&Ae[o]<a;)o++;return(We[o-1]+(We[o]-We[o-1])*b((a-Ae[o-1])/(Ae[o]-Ae[o-1]),0,1.5))*ea},dt=40,ht=new s.InstancedBufferAttribute(new Float32Array(dt*4),4);ht.setUsage(s.DynamicDrawUsage);const xo=[],mt=w.fork("rings"),pt=he.geometry.attributes.iA.array;for(let e=0;e<dt;e++)xo.push({j:e%X.n,flock:e>=16,ph:mt(),T:mt.range(1.3,1.9),jx:mt.range(-.5,.5),jz:mt.range(-.5,.5)});const qe=new s.InstancedBufferGeometry;qe.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,-1,1,0,1,1,0],3)),qe.setIndex([0,2,1,1,2,3]),qe.setAttribute("iRing",ht),qe.instanceCount=dt;const ta=new s.Color(_==="night"?"#8fa6d8":m.line?"#eef4ff":"#fff0d8").multiplyScalar(_==="night"?1:1.5),tt=new s.Mesh(qe,new s.ShaderMaterial({uniforms:{...$t(),uY:{value:B.y+.13},uRingCol:{value:ta}},vertexShader:Sa,fragmentShader:Pa,fog:!0,transparent:!0,depthWrite:!1,side:s.DoubleSide}));tt.renderOrder=4,tt.frustumCulled=!1,k.add(tt);const gt=new s.Mesh(qe,new s.ShaderMaterial({uniforms:tt.material.uniforms,vertexShader:Fa,fragmentShader:Ra,fog:!0,transparent:!0,depthWrite:!1,side:s.DoubleSide}));gt.renderOrder=4,gt.frustumCulled=!1,k.add(gt),await c.yield();const Oe=oe.makeFauna(k,{light:wo}),ot={species:"crows",size:1.45,body:"#13151c",belly:"#0b0c10",wingC:"#191d29",trail:"#141823",tip:"#0b0d13",head:"#15171f",beak:"#27272b",glide:.6,flap:2.4};Oe.add(oe.makeFlock({rng:w.fork("ravens"),...ot,size:1.9,count:6,form:"loose",spread:[4.5,3,10],wander:[1.2,.8,1.4,.35],along:{path:I,side:-10.5,up:-1,lead:3,from:A(215),to:A(430),drift:2.5}}),{always:!0}),Oe.add(oe.makeFlock({rng:w.fork("ravens3"),...ot,size:2.5,count:5,form:"loose",spread:[3,1.4,5],wander:[.6,.4,.6,.3],cross:{path:I,u:.7,lead:16,height:-11.5,offset:3,bow:0,angle:70,side:Math.abs(w.sign()),span:170,window:.09}}),{always:!0}),Oe.add(oe.makeFlock({rng:w.fork("ravens4"),...ot,size:1.9,count:4,form:"loose",spread:[3,2.5,7],wander:[.9,.7,1.1,.35],along:{path:I,side:-9.5,up:2,lead:-1,from:A(312),to:A(398),drift:2}}),{always:!0}),Oe.add(oe.makeFlock({rng:w.fork("ravens5"),...ot,size:2.2,count:4,form:"loose",spread:[4,1.5,5],wander:[.7,.5,.7,.3],cross:{path:I,u:.79,lead:8,offset:-20,height:-11.5,angle:12,side:1,span:120,window:.085}}),{always:!0}),Oe.add(oe.makeFlock({rng:w.fork("ravens2"),...ot,size:2,count:2,form:"loose",spread:[5,1,7],wander:[.6,.4,.6,.3],cross:{path:I,u:.945,lead:8,height:-4,angle:75,side:w.sign(),span:150,window:.085}}),{always:!0}),await c.yield();let G=null;if($){const e=w.fork("stampede"),t=Fo(ct.map(l=>[l[0],0,l[1]])),a=Math.floor(t.length),o=new Float32Array(a+1),n=new Float32Array(a+1),r=new s.Vector3;for(let l=0;l<=a;l++)t.posAtDist(l,r),o[l]=r.x,n[l]=r.z;const i=[],p=[1.24,1.05,1,.62,1.08,1.2,1.02,.66,1.06,1.26,1,.64,1.1,1.02,1.16,1.05];for(let l=0;l<800&&i.length<16;l++){const U=e.range(-21,21),f=e.range(-6.5,6.5);i.some(d=>Math.abs(d.al-U)<4.6&&Math.abs(d.lt-f)<2.6)||i.push({al:U,lt:f,x:0,y:0,z:0,yaw:0,scale:p[i.length],pose:6,seed:e(),tint:e.range(.8,1.05),turn:e.range(-2.6,2.6)})}const y=st(Ut,i),x=y.attributes.iPos;x.setUsage(s.DynamicDrawUsage);const S={...ut,uCoatFrost:{value:m.frost*.16},uGal:{value:new s.Vector2(0,13.5)},uCoat:{value:new s.Vector2(.42,1)}},h=new s.Mesh(y,ge(Mt,kt,S,{side:s.DoubleSide}));h.frustumCulled=!1,k.add(h),G={runners:i,posA:x,runU:S,mesh:h,at:(l,U,f)=>{const d=b(l,0,a-1.001),v=Math.floor(d),g=d-v,R=o[v+1]-o[v],V=n[v+1]-n[v],T=Math.hypot(R,V)||1;f.x=o[v]+R*g-V/T*U,f.z=n[v]+V*g+R/T*U,f.yaw=Math.atan2(R,V)},len:a,shadow:null,dust:null,puffs:null,tmp:{x:0,z:0,yaw:0}}}const oa=e=>100+Math.max(0,e*me-127)*.72*u(127,147,e*me),aa=(e,t)=>{const a=Math.hypot(e-Be,t-Ke);return a<23?.5*Math.pow(1-b((a-4.5)/18.5,0,1),1.7):0};await c.yield();const z=w.fork("vapour"),at=[],Ce=b(D,.6,1),bo=ae.uSteamK.value>1?1/ae.uSteamK.value:1,vt=ae.uSteamK.value>1?.72:1,Ge=(e,t,a,o,n,r,i,p,y)=>{for(let x=0;x<o;x++)at.push({o:[e+z.gauss()*r*.3,t,a+z.gauss()*r*.3],p:[z(),z.range(y*.8,y*1.2),r*z.range(.8,1.2),i*z.range(.8,1.25)],q:[n*z.range(.75,1.2),1,z(),p*z.range(.8,1.2)]})};for(const e of K)Ge(e.x,.6,e.z,Math.round(24*Ce),30*e.big,1.4,9*e.big,.27,10);for(const e of ve)Ge(e.x,.4,e.z,Math.round(5*Ce),7,.9,3.4,.2,6);for(const e of it)Ge(e.x,.5,e.z,Math.round(14*Ce),16+e.r,e.r*.5,e.r*1.3,.2,9);{const e=ae.uCreek.value;for(let t=0,a=Math.round(20*Ce);t<a;t++){const o=z.range(-1.25,.05),n=e.z+(z()<.5?-1:1)*z.range(7,15),r=e.x+Math.sin(o)*n,i=e.y+Math.cos(o)*n;Ge(r,.4,i,2,z.range(2.5,5),1.6,z.range(4.5,6.5),.16,7)}for(const[t,a]of[[9,-68],[14,-72],[25,-71],[33,-70],[44,-67],[22,-76]])Ge(t,.4,a,Math.round(3*Ce),8,2*vt,7*vt*vt,.17*bo,8)}for(let e=0,t=Math.round(70*Ce);e<t;e++){const a=z.range(70,200),o=z.range(-1,1)*(8+a*.2),n=Re[0]*a-Re[1]*o,r=Re[1]*a+Re[0]*o;ce(n,r)<0||I.distanceTo(n,3,r)<9||Ge(n,.5,r,1,z.range(4,9),2.4,7,.13,9)}for(let e=0,t=Math.round(64*Ce);e<t;e++){const a=z.range(-260,340);Ge(pe(a)+z.range(-B.hw,B.hw)*.8,B.y+.6,a,1,z.range(1.5,4),5,13,.1,17)}const wt=(e,t,a,o)=>{if(e.pose===2||e.pose===3||Le(e.x,e.z)>95)return;const n=Math.cos(e.yaw),r=Math.sin(e.yaw),i=t(a),p=e.x+(i[0]*n+i[2]*r)*e.scale,y=e.y+i[1]*e.scale,x=e.z+(-i[0]*r+i[2]*n)*e.scale,S=z();for(let h=0;h<3;h++)at.push({o:[p+r*.12*h,y-.03*o,x+n*.12*h],p:[S+h*.04,3.1,.12*e.scale,(.55+.2*h)*e.scale*vt],q:[.3+.12*h,1,z(),.3*bo]})};for(const e of fe)wt(e,Yo,e.pose===1?.62:0,Gt.h);wt(ke[0],Vt,-.5,je.h),wt(ke[1],Vt,1.5,je.h),wt(ke[2],Vt,0,je.h),await c.yield();for(let e=0;e<12;e++)at.push({o:[ne.x+z.gauss()*1.6,.5,ne.z+z.gauss()*1.6],p:[z(),z.range(3,4.6),.9,z.range(3,4.6)],q:[z.range(2,4),3,z(),.26],tint:[.95,.8,.6]});{const e=Te.clone(),t=new s.Vector3(-e.z,0,e.x).normalize(),a=new s.Vector3().crossVectors(t,e),o=[[.55,.8,1.1],[.6,1.1,.9],[1.1,.95,.5],[1.1,.72,.45]];for(let n=0,r=Math.round(34*Ce);n<r;n++){const i=z.range(4,78),p=z.range(0,6.283),y=z.range(9.5,19),x=Go.clone().addScaledVector(e,-i).addScaledVector(t,Math.cos(p)*y).addScaledVector(a,Math.sin(p)*y);x.y<4||at.push({o:[x.x,x.y,x.z],p:[z(),z.range(6,9),z.range(3,5),z.range(7,11)],q:[z.range(5,10),0,z(),.17],tint:o[n%4]})}}Q.addSteam(at),await c.yield();const na=(()=>{const e=[],t=w.fork("boil");for(let o=0,n=Math.round(44*Ce);o<n;o++)e.push({o:[t.gauss()*3.2,.9,t.gauss()*3.2],p:[t(),t.range(5.5,8),2.2,t.range(7,11)],q:[t.range(16,30),1,t(),t.range(.22,.34)],tint:[.8,.92,1.1]});const a=Q.addSteam(e,5);return a.material.uniforms.uSteamK={value:0},a})();if(await c.yield(),G){const e=[],t=G.runners.map((o,n)=>n).sort((o,n)=>G.runners[o].al-G.runners[n].al).slice(0,5);for(const o of t){const n=G.runners[o];for(let r=0;r<8;r++)e.push({j:o,o:[0,-50,0],p:[z()*.125+r*.125,z.range(1.7,2.3),.6*n.scale,z.range(2.2,3.2)*n.scale],q:[z.range(.6,1.2),3,z(),.5],tint:m.frost>.2&&r%2?[.9,.95,1.05]:[1.05,.95,.78],side:z.range(-1.1,1.1)})}const a=Q.addSteam(e,6);a.material.uniforms.uSteamK={value:0},a.geometry.attributes.aO.setUsage(s.DynamicDrawUsage),G.dust=a,G.puffs=e}await c.yield();{const e=(l,U)=>Le(l,U)<95?.36*Lo(l,U)*(m.snow?.6:1):0,t=[...fe.map(l=>({x:l.x,y:l.y+e(l.x,l.z),z:l.z,h:(l.pose===2?.9:1.95)*l.scale,move:l.move,seed:l.seed})),...ke.map(l=>({x:l.x,y:l.y,z:l.z,h:2*l.scale,seed:0})),...fo.map(l=>({x:l.x,y:l.y,z:l.z,h:l.h,seed:0}))],a=new s.InstancedBufferGeometry,o=t.length,n=6,r=[],i=[];for(let l=0;l<=n;l++)r.push(l/n,-1,0,l/n,1,0);for(let l=0;l<n;l++)i.push(l*2,l*2+2,l*2+1,l*2+1,l*2+2,l*2+3);a.setAttribute("position",new s.Float32BufferAttribute(r,3)),a.setIndex(i);const p=new Float32Array(o*4),y=new Float32Array(o*4),x=new Float32Array(o);t.forEach((l,U)=>{p.set([l.x,l.y,l.z,l.h],U*4),y.set(l.move?[l.move[0],l.move[1],l.move[2],l.move[3]]:[0,0,0,0],U*4),x[U]=l.seed}),a.setAttribute("iPos",new s.InstancedBufferAttribute(p,4)),a.setAttribute("iMove",new s.InstancedBufferAttribute(y,4)),a.setAttribute("iSeed",new s.InstancedBufferAttribute(x,1)),a.instanceCount=o;const S=new s.Color(_==="night"?"#01030a":"#0a1430"),h={transparent:!0,depthWrite:!1,side:s.DoubleSide},P=new s.Mesh(a,ge(No,Eo,{uShade:{value:S},uStreak:{value:new s.Vector2(.62,1)}},h));if(P.renderOrder=-4,P.frustumCulled=!1,k.add(P),await c.yield(),G){const l=new s.InstancedBufferGeometry,U=G.runners.length;l.index=a.index,l.setAttribute("position",a.attributes.position);const f=new s.InstancedBufferAttribute(new Float32Array(U*4),4);f.setUsage(s.DynamicDrawUsage),l.setAttribute("iPos",f),l.setAttribute("iMove",new s.InstancedBufferAttribute(new Float32Array(U*4),4)),l.setAttribute("iSeed",new s.InstancedBufferAttribute(new Float32Array(U),1)),l.instanceCount=U;const d=new s.Mesh(l,ge(No,Eo,{uShade:{value:new s.Color("#0a1a4c")},uStreak:{value:new s.Vector2(.8,1.4)}},h));d.renderOrder=-4,d.frustumCulled=!1,k.add(d),G.shadow=f}}const yt={value:0},Da=new s.Color(m.dir[0]),jt=Zt.makeParticles({rng:w.fork("ice"),preset:"dust",time:yt,count:Math.round(1700*D),box:[64,40,64],size:[.03,.085],velocity:[De[0]*.4,-.35,De[1]*.4],velocityRandom:[.3,.2,.3],colors:_==="night"?["#cfe0ff","#e8f0ff","#a9c0f0"]:["#fff1d6","#ffffff","#ffe0b0"],intensity:1.5,opacity:.8,twinkle:.85,near:[1,4]});await c.yield();const qt=Zt.makeParticles({rng:w.fork("spray"),preset:"rain",time:yt,count:Math.round(1500*D),box:[44,34,44],velocity:[De[0]*1.2,-7.5,De[1]*1.2],velocityRandom:[.8,2.5,.8],size:[.02,.04],stretch:.03,colors:["#dfe9f6","#fff4de","#c6d6ea"],intensity:.9,opacity:.32,additive:.7,near:[1.5,6]});k.add(jt.object,qt.object),await c.yield();let xt=null;m.snow&&(xt=Zt.makeParticles({rng:w.fork("snow"),preset:"snow",time:yt,count:Math.round(3200*D),opacity:.85}),k.add(xt.object)),await c.yield();const sa=new s.Vector3,nt=new s.Vector3,ra=new s.Vector3,zo=(e,t)=>{I.pointAt(t,nt);const a=Be-nt.x,o=Ke-nt.z,n=M(M(M(.12,.6,u(A(205),A(262),t)),-.2,u(A(272),A(318),t)),-.03,u(A(325),A(352),t)),r=Math.cos(n),i=Math.sin(n),p=M(M($?3:6,$?12:24,u(A(130),A(260),t)),35,u(A(295),A(345),t));return sa.set(nt.x+a*r-o*i,p,nt.z+a*i+o*r)},ia=(e,t)=>he.route.pointAt(Math.min(yo(t),ft*.995)-5,ra);Q.setPortal({color:m.portal,strength:1,normal:[-Te.x,-Te.y,-Te.z]});const la=new s.Color(m.faunaSun[0]).multiplyScalar(m.faunaSun[1]),He=c.core.bell,Mo=(e,t)=>u(e-.7,e+.7,t),ca=ae.uSteamK.value,bt=new s.Vector3,ua=ze.uniforms.uSun.value.y,fa=ze.uniforms.uSun.value.z,Ot=ae.uGey.value.z,da=Z.y<.4&&Math.abs(Z.x)>.5,ha=Z.y<.25&&Z.x>.5,ma=(e,t,a,o=0)=>{yt.value=t;const n=o*me,r=m.line?n<190?M(4.3,-1.5,n/190):M(-1.5,-7,u(190,237,n)):-100,i=Mo(r,.6);Q.setShadowLine(r),Q.setEruption(u(Pt[0],Pt[1],o)*(1-.4*u(A(385),A(480),o))),Q.update(e,t,a);const p=He(o,.47,.67,.25);ae.uVeilK.value=1-.7*He(o,.385,.67,.2),na.material.uniforms.uSteamK.value=ca*(.3+.7*He(o,.44,.68,.2)),Xe.intensity=m.dir[1]*i,ze.update(e,t,a),eo.update(e,t,a),oo.update(e,t,a);let y=0;if(da){a.getWorldPosition(bt);const f=(Be-bt.x)/Z.x,d=bt.y+Z.y*f,v=b(d/Ot,0,1.6),g=3.2+3.2*v,R=Math.abs(bt.z+Z.z*f-(Ke+De[1]*v*v*2.2));y=(f>4?u(0,4,d)*(1-u(Ot-3,Ot+9,d))*u(A(200),A(240),o)*(1-u(A(385),A(420),o)):0)*Math.max(1-u(g*.7,g*1.6,R),.5*(1-u(g,g+9,R)))}ze.uniforms.uSun.value.y=ua*(1-.97*y)*(1-(ha?.6*p:0)),ze.uniforms.uSun.value.z=fa*(1+.25*y),io.update(e,t,a),lo.update(e,t,a),jt.update(e,t,a),qt.update(e,t,a),xt&&xt.update(e,t,a),jt.setOpacity(M(0,.8,u(A(158),A(316),o))*(1-.5*u(.9,1,o))),qt.setOpacity(He(o,A(170),A(390))*.4),po.uBugle.value=.6*He(o,A(47),A(158),.35);const x=Math.min(yo(o),ft*.995),S=o*me,h=u(28,55,S),P=u(46,55,S);vo.uRun.value.x=h,he.update(e,x/19,a),he.uniforms.uPhase.value+=t,he.uniforms.uVis.value*=P,he.uniforms.uSunColor.value.copy(la).multiplyScalar(Math.max(i,Mo(r,2.2))),he.object.visible=S>46&&x<ft*.99,Lt.visible=S<59;const l=ht.array;let U=!1;for(let f=0;f<dt;f++){const d=xo[f],v=((t/d.T+d.ph)%1+1)%1,g=d.j;let R=0,V=0,T=0;if(d.flock){if(P>0){const L=x-pt[g*4+2]-7*v*d.T;he.route.pointAt(L,Ne),he.route.pointAt(L+5,de),de.sub(Ne);const F=Math.hypot(de.x,de.z)||1;R=Ne.x+de.z/F*pt[g*4]+d.jx,V=Ne.z-de.x/F*pt[g*4]+d.jz,T=P*(1-u(.9,2.3,Ne.y+pt[g*4+1]-B.y))*(ce(R,V)<-.3?1:0)}}else if(h>.02&&S<59){const L=Kt[g];R=L.x+d.jx*.6,V=L.z-9*h*h*(.7+.6*L.seed)+2.2*v*d.T*h+d.jz*.4,T=u(.02,.2,h)*(1-u(.8,1,h))}l[f*4]=R,l[f*4+1]=V,l[f*4+2]=v,l[f*4+3]=T,T>0&&(U=!0)}if(ht.needsUpdate=!0,tt.visible=U,gt.visible=U,Oe.update(e,t,a,o),G){const f=u(127,143,o*me),d=oa(o),v=G.tmp,g=G.posA.array,R=G.shadow.array;for(let F=0;F<G.runners.length;F++){const N=G.runners[F];G.at(d+N.al,N.lt,v),N.x=v.x,N.z=v.z,N.y=be(v.x,v.z)+aa(v.x,v.z),N.yaw=v.yaw+N.turn*(1-f),g[F*4]=N.x,g[F*4+1]=N.y,g[F*4+2]=N.z,g[F*4+3]=N.yaw,R[F*4]=N.x,R[F*4+1]=N.y,R[F*4+2]=N.z,R[F*4+3]=d<G.len-26?1.95*N.scale:0}G.posA.needsUpdate=!0,G.shadow.needsUpdate=!0,G.runU.uGal.value.x=f;const V=G.dust.geometry.attributes.aO,T=V.array;for(let F=0;F<G.puffs.length;F++){const N=G.puffs[F],H=G.runners[N.j],ie=N.p[1],ye=((t/ie+N.p[0])%1+1)%1*ie;G.at(d+H.al-3.4*H.scale-11.5*f*ye,H.lt+N.side,v),T[F*3]=v.x,T[F*3+1]=H.y+.25,T[F*3+2]=v.z}V.needsUpdate=!0,G.dust.material.uniforms.uSteamK.value=f*(1-u(316,395,o*me));const L=d<G.len-26;G.mesh.visible=L,G.dust.visible=L&&f>0}};return Q.setShadowLine(m.line?4.3:-100),Q.setEruption(0),Xe.intensity=m.line?0:m.dir[1],await ze.prewarm(c.renderer,null,k),{scene:k,path:I,duration:58,pace:e=>{let t=M(.66,.95,u(.14,.2,e))-.24*He(e,.3,.375,.4);return t=M(t,.85,u(.385,.43,e)),t=M(t,1.4,u(.63,.69,e)),t=M(t,1.12,u(.77,.83,e)),M(t,1,u(.9,.95,e))},title:_==="winter"?"The Prismatic Eye, Midwinter":_==="night"?"The Prismatic Eye by Moonlight":"The Prismatic Eye",camera:{fov:62,near:.3,far:5200,lookAhead:20,sway:1,bank:.6},pois:[{at:ia,from:A(32),to:A(119),weight:.55,fade:.3},{at:zo,from:A(120),to:A(406),weight:.9,fade:.16},{at:zo,from:A(200),to:A(395),weight:.6,fade:.2},{at:[0,8,0],from:A(375),to:A(470),weight:.5,fade:.3},{at:[0,4,0],from:A(505),to:A(612),weight:.85,fade:.25},{at:[8,1.5,-66],from:A(595),to:A(668),weight:.45,fade:.3},{at:[70,0,-185],from:.622,to:.745,weight:.75,fade:.3},{at:[0,0,0],from:.725,to:.955,weight:.9,fade:.25},{at:[0,0,0],from:.76,to:.95,weight:.7,fade:.25}],portal:{shape:"circle",radius:7,color:m.portal,glow:1,tilt:!0,revealDistance:420},post:m.post,ride:"none",update:ma,dispose(){ze.dispose()}}}};export{Va as default};
