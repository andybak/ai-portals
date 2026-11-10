import*as n from"three";import{makePath as no,makeRng as j0,hashSeed as Ft,clamp as xe,lerp as Se,smoothstep as ie,bell as T0}from"../kit/core.js";import{makeSky as ro,makeCloudField as ka,makeLightRig as io,skyDirection as lo}from"../kit/sky.js";import*as Sa from"../kit/water.js";import*as za from"../kit/fx.js";import{buildHero as ho}from"../parts/waterspout-sisters.js";const l=(i,D=1)=>new n.Color(i).multiplyScalar(D),g=(i,D,te)=>new n.Vector3(i,D,te),ze=-930,L0=620,X0=100,Tt=44,Aa=2270.9,Ca=285,Lt=470,Bt=Math.PI/6,Z0=10,$0=-60,fo={afternoon:{hero:"afternoon",elev:22,pal:["#19C2B8","#0B4F9E","#0E3B3C","#F3E8CF","#2B3157","#66728C","#D2542E"],sky:{preset:"day",zenith:"#2a66b8",mid:"#74a6d2",horizon:"#a3bccc",ground:"#3f6078",horizonPow:3.2,scatterColor:"#ffe2a8",scatter:.4,scatterPow:5,sunColor:"#FFE2A8",sunSize:1.6,sunIntensity:6,sunGlow:.3,lightColor:"#fff0d4",lightIntensity:2.7,ambientColor:"#9bb6e0",groundLight:"#3f8f8a",ambientIntensity:1.4},fog:["#8FA6B8",35e-5],key:["#F3E8CF",.86],shade:["#3A4A7A",1],lip:["#F3E8CF",.8],rain:"#262d42",sarg:"#b08a34",sea:{deep:"#0B4F9E",shallow:"#19C2B8",scatter:"#38c9b4",ink:"#12504e",inkA:.8,hard:5,sand:"#a8ecd2",glit:1,far:["#86a3be",.3]},post:{exposure:1,bloom:{strength:.3,radius:.6,threshold:1},grade:{saturation:1.1,contrast:1.06,tint:"#fffaf0",shadowTint:"#060a1c",vignette:.3,grain:.02}}},noon:{hero:"noon",elev:60,heroShadow:["#7f93b8",1.1],pal:["#12d6c6","#0a58b8","#0b3a40","#fbf7ee","#2c3a66","#6a7a98","#D2542E"],sky:{preset:"day",zenith:"#1c63cf",mid:"#57a0e4",horizon:"#b4d2e2",ground:"#3f6a88",horizonPow:3.6,scatterColor:"#ffffff",scatter:.2,scatterPow:6,sunColor:"#fff8e8",sunSize:1.4,sunIntensity:8,sunGlow:.3,lightColor:"#ffffff",lightIntensity:3.1,ambientColor:"#9cc0f0",groundLight:"#3aa8a0",ambientIntensity:1.5},fog:["#9cbdd2",3e-4],key:["#fffaf0",.9],shade:["#4d6fb0",1],lip:["#ffffff",.85],rain:"#283248",sarg:"#c0963a",sea:{deep:"#0a58b8",shallow:"#12d6c6",scatter:"#3fe0cc",ink:"#0a3238",inkA:.78,hard:1.5,sand:"#b6f4dc",glit:1.3,far:["#93b6d6",.27]},post:{exposure:.96,bloom:{strength:.28,radius:.55,threshold:1},grade:{saturation:1.03,contrast:1.07,tint:"#fffdf6",shadowTint:"#040c1c",vignette:.28,grain:.02}}},lastlight:{hero:"lastlight",elev:7,heroShadow:["#5a5aa0",1.02],heroSun:["#ffa066",1.05],pal:["#4fae96","#2a5a66","#3f8272","#ffd9b0","#3a2c5c","#6a5a84","#D2542E"],sky:{preset:"day",zenith:"#27357e",mid:"#8a72a8",horizon:"#eda677",ground:"#4a4460",horizonPow:3,scatterColor:"#ff9a52",scatter:.85,scatterPow:4,sunColor:"#ff9a50",sunSize:1.9,sunIntensity:4.5,sunGlow:.6,lightColor:"#ffab72",lightIntensity:2.4,ambientColor:"#8d7fc0",groundLight:"#5a7a66",ambientIntensity:1.5},fog:["#a48fa6",38e-5],key:["#ffb880",.92],shade:["#4c4a8e",1],lip:["#ff9c6a",.85],rain:"#3c3154",sarg:"#6a5230",sea:{deep:"#2d7970",shallow:"#3fa690",scatter:"#4ab49e",ink:"#688e8c",inkA:.46,hard:9,sand:"#7cc0a4",glit:.9,tq:.8,turq:"#62c4a8",turqK:.76,road:.9,roadPow:5,refl:.5,horizon:"#ad8c62",sheen:["#ff8f52",.62],sheenBack:["#e09a6c",.42],smearK:3.6,smearW:1.5,smearCol:"#ff9a8a",jade:"#2c8474",mirror:["#eda677",.6],gold:["#ffb066",.85]},post:{exposure:1.05,bloom:{strength:.36,radius:.65,threshold:.98},grade:{saturation:1.1,contrast:1.05,tint:"#fff6ee",shadowTint:"#0a0612",vignette:.32,grain:.022}}},night:{hero:"night",elev:34,pal:["#1f8f98","#0a2a4a","#28323f","#c8d6f0","#141a36","#2c3a5c","#D2542E"],sky:{preset:"night",clouds:!1,bake:!0,milkyWay:.1,zenith:"#060a1c",mid:"#1e2642",horizon:"#3c4660",lightColor:"#a9c1ff",lightIntensity:1.5,ambientColor:"#3a5aa8",groundLight:"#16506a",ambientIntensity:2.4},fog:["#242c48",3e-4],key:["#b8c8ea",.62],shade:["#1c2646",1],lip:["#9fb4e6",.5],rain:"#343a4e",sarg:"#2c2818",sea:{deep:"#0a2a4a",shallow:"#1a6a78",scatter:"#2aa8a0",ink:"#35424f",inkA:.4,hard:14,sand:"#3a8a90",glit:.8,glow:"#0b6b78",phos:1,horizon:"#16284c",road:.5,roadPow:5,roadTint:[.8,.9,1],night:["#5a6474",.125],silver:["#8fb0e0",.075],nightHor:["#5a7090",.16],wakeFoam:.8,wakePhos:.7},post:{exposure:1.4,bloom:{strength:.5,radius:.7,threshold:.85},grade:{saturation:.95,contrast:1.04,tint:"#eef4ff",shadowTint:"#06081a",vignette:.36,grain:.028}}}},co={fair:{ocean:{preset:"choppy",height:.8,foam:.5,reflectivity:.7},lift:1.25,squall:0,calm:0,fogK:1,smear:.13,rain:.55},squall:{ocean:{preset:"choppy",height:1.3,foam:.58,spread:1.25,reflectivity:.7},lift:1.9,squall:1,calm:0,fogK:1.3,smear:.08,rain:1},calm:{ocean:{preset:"calm",height:.2,reflectivity:.5},lift:.5,squall:0,calm:1,fogK:.9,smear:.22,rain:.4}},Ve=`
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx)*0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y)*q.z); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fb3(vec2 p){ return 0.5*n2(p) + 0.3*n2(p*2.07 + 13.1) + 0.2*n2(p*4.3 + 41.7); }
`,_e=`
uniform vec3 fogColor; uniform float fogDensity; varying float vFogDepth;
float fogK(){ return 1.0 - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth); }
`,Pt=`
uniform float uMX, uLipZ, uWestX;
float edgeS(vec2 p){ return (uLipZ + (n2(vec2(p.x*0.0045, 3.1)) - 0.5)*150.0 + (n2(vec2(p.x*0.021, 7.7)) - 0.5)*36.0) - p.y; }
float edgeW(vec2 p, float west){
  float w = west - 2500.0*(1.0 - smoothstep(-2400.0, -1500.0, p.y));
  return p.x*uMX - (w + (n2(vec2(p.y*0.004, 9.3)) - 0.5)*260.0 + (n2(vec2(p.y*0.017, 1.7)) - 0.5)*60.0);
}
`,Ma=`
float lipFar(vec2 p){ vec2 q = (p - vec2(0.0, -930.0))*vec2(1.0, 0.6); return smoothstep(900.0, 2200.0, length(q))*(1.0 - smoothstep(-1300.0, -300.0, p.y)); }
float lipSoft(vec2 p){                                                   // the footprint without its scallops: what rain is masked by (a torn mask cut the veils' ends razor-straight)
  float eS = edgeS(p), eW = edgeW(p, uWestX);
  return -240.0*log(exp(-clamp(eS/240.0, -12.0, 12.0)) + exp(-clamp(eW/240.0, -12.0, 12.0))) + 380.0*(n2(p/850.0 + 7.0) - 0.5);
}
float lipE(vec2 p){
  float eS = edgeS(p), eW = edgeW(p, uWestX), fl = lipFar(p);
  float e = -240.0*log(exp(-clamp(eS/240.0, -12.0, 12.0)) + exp(-clamp(eW/240.0, -12.0, 12.0)));
  e += (170.0*(fb3(p/340.0 + 2.0) - 0.5) + 380.0*(n2(p/850.0 + 7.0) - 0.5))*(1.0 + fl);
  e += 150.0*(abs(2.0*n2(p/175.0 + 23.0) - 1.0) - 0.42);                  // billowed: rounded lobes 100-300 m across with notches between them
  return e + fl*(700.0*(n2(p/2100.0 + 3.0) - 0.5) + 420.0*(n2(p/260.0 + 31.0) - 0.5) + 180.0*(n2(p/120.0 + 11.0) - 0.5));
}
`,Fa=`
varying vec3 vW; varying float vFogDepth;
void main(){ vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz; vec4 mv = viewMatrix*wp; vFogDepth = -mv.z; gl_Position = projectionMatrix*mv; }
`,uo=i=>`
uniform float uTime, uInkA, uHard, uCalm, uSquall, uGlit, uGustZ, uSmear, uOriginZ, uSeaWest, uPhosK, uSargK, uTq, uRowC, uFleck;
uniform vec3 uInk, uFoamLit, uFoamShade, uSarg, uSunCol, uSand, uPhos, uSmearCol, uTurq, uFarCol, uSeaLit; uniform vec4 uLug[3], uReef;
uniform vec2 uWindD, uSunAz; uniform float uRoad, uRoadPow, uSheen, uBackK, uNightK, uLast; uniform vec3 uSheenCol, uSheenBack, uRoadTint, uNightCol, uSilver, uNightHor, uHazeN, uJade, uApr, uGold, uSeaHaze, uDFog;
uniform vec4 uSp[6];
varying vec3 vW;
${_e}${Ve}${Pt}${i}
// One whitecap size seen from the helix. A crest is not a patch of paint: it is a ragged white LEADING EDGE (the breaking
// lip, about a metre deep, lying across the wind and bowed downwind) that trails a short LACE of foam on its upwind side
// (torn at four and nine times the crest's own frequency, a third as dense, gone within a few metres of the lip). The
// blob of noise that places it is never drawn. Lip and lace flare and die as the noise drifts; gone under a pixel.
// Seen from further off the lip is drawn deeper (never under about three pixels of foam: a crest is a white comma with
// a torn edge, not a one-pixel tick), and its lace with it.
float wcap(vec2 qc, float sz, float fj, float fT, float fwg){
  vec2 q = qc/(vec2(5.5, 17.0)*sz) + vec2(uTime*0.09, 3.0 + 17.0*fj);
  q += 0.1*(vec2(n2(q*5.3 + 2.0), n2(q*5.3 + 11.0)) - 0.5);                               // a ragged outline
  float dL = clamp(3.2*fwg/(5.5*sz), 0.2, 0.55);                                            // the lip's depth in cells: a metre, or three pixels
  float n = n2(q), nD = n2(q + vec2(dL, 0.0)), nL = n2(q + vec2(0.55 + dL, 0.0));
  float body = smoothstep(fT, fT + 0.03, n);
  float t1 = n2(q*vec2(3.7, 3.1) + 9.0 + uTime*vec2(0.22, 0.08)), t2 = n2(q*vec2(9.0, 7.0) + 4.0 - uTime*vec2(0.3, 0.12));
  float lip = body*(1.0 - smoothstep(fT - 0.02, fT + 0.045, nD))*(0.55 + 0.45*smoothstep(0.24, 0.46, t2));
  float lace = body*(1.0 - smoothstep(fT - 0.03, fT + 0.07, nL))*smoothstep(0.47, 0.6, 0.55*t1 + 0.45*t2);
  return max(lip, 0.3*lace)*(1.0 - smoothstep(1.1*sz, 3.0*sz, fwg));
}
// THREADS OF LIGHT (last light): the sky lying on a glassy swell. q = (metres across the swell, metres along its crests).
// A thread is a level line of a phase that only ever rises across the swell (the noise in it is too gentle to turn it
// back), so it is ONE wavering line running along the crests: it cannot close into a loop, a hook or a letter (the level
// lines of plain noise did, and filled flat between). S: metres from thread to thread; k numbers them. Each is lit only
// along stretches of its own (lenS metres and more), swelling from nothing to its full depth and back to nothing, so no
// end is cut; its depth (thk, in spacings: least and most) wavers along it and is never more than five pixels; a thread
// finer than half a pixel dims out, and where the threads lie closer than three pixels they are their own even tone, cov.
// taper (0..1) thins them, to nothing at 0 (the edge of a swell's face). Never called from a loop (it takes fwidth).
float threadsOf(vec2 q, float S, float lenS, float sd, vec2 thk, float dens, float taper, float cov){
  float ph = q.x/S + 2.4*(n2(vec2(q.y/(9.0*S), q.x/(11.0*S)) + sd) - 0.5) + 1.1*(n2(vec2(q.y/(2.6*S), q.x/(14.0*S)) + sd + 31.0) - 0.5) + 0.4*(n2(vec2(q.y/(0.95*S), q.x/(9.0*S)) + sd + 57.0) - 0.5);   // (three bends: 80, 23 and 9 m long at S = 4.5; with the last two small a thread seen end on was a ruled line. The phase still rises with q.x everywhere: 0.65/S of slope at most against 1/S)
  float fw = max(fwidth(ph), 1e-4), k = floor(ph), f = abs(fract(ph) - 0.5);
  float g = n2(vec2(q.y/lenS + k*17.3 + sd, k*5.13 + uTime*0.02));
  float th = mix(thk.x, thk.y, n2(vec2(q.y/(1.6*S) + k*3.1, sd + 7.0 + uTime*0.12)))*smoothstep(1.0 - dens, 1.3 - dens, g)*taper;
  float thC = min(th, 2.5*fw);
  float line = (1.0 - smoothstep(thC - 0.75*fw, thC + 0.75*fw, f))*smoothstep(0.0, 0.6*fw, th);
  return mix(line, cov, smoothstep(0.2, 0.45, fw));
}
void main(){
  vec2 p = vW.xz;
  float al = dot(p, uWindD) - uTime*1.6, ac = dot(p, vec2(-uWindD.y, uWindD.x));
  ac += 11.0*(n2(vec2(al*0.0042, ac*0.011)) - 0.5) + 3.0*(n2(vec2(al*0.019, ac*0.05)) - 0.5);   // windrows meander
  float fwc = fwidth(ac), fwp = length(fwidth(p));
  float cell = ac/46.0;
  float hiK = smoothstep(45.0, 150.0, cameraPosition.y - vW.y);                            // 0 on the slalom, 1 from the middle of the helix: looked down on, the 20 m streaks are a rash of white dashes and the lanes ruled lines, so they give way to flecks sized to the pixel
  // cloud shadow: the lip's own outline (rounded corner, scallops 60-250 m across) with a penumbra that wanders between
  // 2 and 9 times uHard, and the shadows of detached scud ahead of it: no ruled line. Opened by the sliding sun patches
  float eS = edgeS(p), eW = edgeW(p, uSeaWest);
  float eC = -240.0*log(exp(-clamp(eS/240.0, -12.0, 12.0)) + exp(-clamp(eW/240.0, -12.0, 12.0)));
  eC += 120.0*(fb3(p/240.0 + 6.0) - 0.5) + 46.0*(n2(p/57.0 + uTime*0.012) - 0.5);
  float flS = smoothstep(800.0, 2000.0, length((p - vec2(0.0, uOriginZ))*vec2(1.0, 0.6)));   // far from the route (seen from the helix, a kilometre and more off) the edge opens into bays and its penumbra widens: no straight side
  eC += flS*(760.0*(n2(p/1250.0 + 3.0) - 0.5) + 380.0*(n2(p/410.0 + 31.0) - 0.5));
  float eN = min(p.y + 3700.0, 3400.0 - p.x*uMX) + 900.0*(n2(p/1100.0 + 5.0) - 0.5);
  float wS = max(fwp*1.2, uHard*(2.0 + 7.0*n2(p/150.0 + 6.0))) + 170.0*flS + 130.0*uNightK*hiK;
  float sh = smoothstep(-wS, wS, eC)*smoothstep(0.0, 600.0, eN);
  sh = max(sh, 0.6*smoothstep(0.6, 0.78, n2(p/90.0 + vec2(uTime*0.03, 2.0)))*smoothstep(-320.0, -60.0, eC)*smoothstep(0.0, 600.0, eN));
  vec2 pwp = p + 170.0*(vec2(n2(p/310.0 + 1.0), n2(p/310.0 + 7.0)) - 0.5) + 56.0*(vec2(n2(p/83.0 + 3.0), n2(p/83.0 + 9.0)) - 0.5);   // (warped: the gaps between patches are ragged, not kites)
  float pt = clamp((wsPatch(pwp - vec2(0.0, uOriginZ)) - uPatch.z)/max(1.0 - uPatch.z, 0.01), 0.0, 1.0);
  float shade = sh*(1.0 - 0.78*pt*(1.0 - 0.8*hiK*uNightK)), lit = 1.0 - shade;                 // (by night, looked down on, a patch keeps a fifth of its contrast: a faint sheen, not a pale wedge)
  float hiL = uLast*hiK;                                                                   // last light, looked down on: the body of the sea is painted below (LAST LIGHT, THE BODY OF THE SEA) and the pale ink, the ink-dark ruffles and the sheen patches stand down for it
  float a = uInkA*shade*(1.0 - 0.8*hiL); vec3 col = uInk*a; vec3 add = vec3(0.0);
  // cat's-paws and the gust front: dark ruffled water
  float ruf = mix(0.5 + 0.5*n2(vec2(ac*0.3, al*0.022)), 0.75, 0.85*hiK);                    // (looked down on, the ruffles' 3 m grain is a field of ruled streaks: even there)
  float cp = smoothstep(0.52, 0.74, n2(p*0.0052 + uTime*vec2(0.021, -0.03)))*ruf;
  float g = uGustZ - p.y + 22.0*(n2(vec2(p.x*0.02, uTime*0.25)) - 0.5);
  float gb = smoothstep(0.0, 14.0, g)*exp(-max(g, 0.0)/150.0)*(0.5 + 0.5*ruf);
  float cp2 = smoothstep(0.55, 0.61, n2(p*0.023 + uTime*vec2(0.05, -0.07) + 13.0))*(0.6 + 0.4*n2(vec2(ac*0.9, al*0.07)))*(1.0 - smoothstep(mix(160.0, 900.0, uCalm), mix(520.0, 1900.0, uCalm), vFogDepth))*(1.0 - smoothstep(2.5, 7.0, fwp));   // a calm sea: small cat's-paws with crisp edges, 30-60 m across, close to
  float dk = clamp((0.14 + 0.34*uCalm)*cp + 0.55*gb, 0.0, 0.8)*(1.0 - hiL);
  col = col*(1.0 - dk) + uInk*0.55*dk; a = a*(1.0 - dk) + dk;
  float dk2 = 0.5*uCalm*cp2*(1.0 - hiL);                                                               // (darker than the glassy swell round them: ruffled water mirrors nothing)
  col = col*(1.0 - dk2) + uInk*0.3*dk2; a = a*(1.0 - dk2) + dk2;
  // wind lanes (12-20 m) and foam streaks (2 m) laid along the wind
  float lane = smoothstep(0.55, 0.8, n2(vec2(ac*0.045, al*0.0035)))*(1.0 - smoothstep(4.0, 16.0, fwc));
  float st = smoothstep(0.6, 0.85, n2(vec2(ac*0.24, al*0.011)))*(0.35 + 0.65*n2(vec2(ac*0.9 + 17.0, al*0.045)));
  st *= mix(1.5*smoothstep(0.3, 0.68, n2(p*1.3 + uTime*vec2(0.17, 0.11)))*(0.35 + 0.65*n2(p*0.29 + 4.0)), 0.5, smoothstep(0.2, 0.7, fwp));   // torn into lace up close
  float foam = (0.5 + 0.9*uSquall)*(st*(1.0 - smoothstep(0.7, 2.6, fwc))*(0.45 + 0.4*lane) + 0.1*lane*(0.5 + 0.5*ruf))*(1.0 - 0.75*uCalm)*(1.0 - 0.85*hiK);
  foam += uSquall*0.5*smoothstep(-6.0, 10.0, g)*exp(-max(g, 0.0)/60.0)*ruf;
  foam = clamp(foam, 0.0, 0.85);
  // FROM THE HELIX (150 m up and more) the streaks above are under a pixel. There the sea carries WHITECAPS OF A REAL SIZE:
  // crests lying across the wind, 1.5-4.5 m by 5-14 m (three sizes, each in its own quarters of the sea), every one torn,
  // flaring and dying as it runs. They are gathered into WIND ROWS (bands 30-70 m across laid along the wind, 150-500 m
  // long, frayed into strands) inside gust patches 200-400 m across; between the rows the water is calm and dark. A crest
  // under a pixel is gone, so far off the rows are only a faint paling, and from higher there are fewer. Round the feet
  // of the sisters the inflow breaks the biggest crests. Under them the swell: long faces 70 m apart, darker on the side
  // turned from the light, a little brighter toward it.
  float fwg = sqrt(max(length(dFdx(p))*length(dFdy(p)), 1e-4));                             // the footprint's mean axis (metres per pixel)
  float aniK = 1.0 - smoothstep(4.0, 10.0, fwp/max(fwg, 0.05));                              // (seen low across the water a crest would be a stretched dash: none there)
  float gusts = smoothstep(0.36, 0.64, 0.6*n2(p/260.0 + uTime*vec2(0.01, -0.014) + 4.0) + 0.4*n2(p/90.0 + 11.0));
  float acR = ac + 34.0*(n2(vec2(al*0.0045, ac*0.006) + 2.0) - 0.5);                        // (the rows' own meander)
  float rows = smoothstep(0.58, 0.7, n2(vec2(acR/52.0, al/420.0) + 6.0))*(0.3 + 0.7*smoothstep(0.3, 0.6, n2(vec2(acR/21.0 + 3.0, al/170.0))));
  float nearSp = 0.0;
  for (int i = 0; i < 6; i++) { vec2 dsp = p - uSp[i].xy; nearSp = max(nearSp, min(uSp[i].z, 1.0)*exp(-dot(dsp, dsp)/12000.0)); }
  nearSp *= 1.0 - 0.8*uNightK;                                                              // (the big crests break against a spray crown, inside its stain; by night only the small sparks in rows remain)
  // ... and the gust patches themselves lie in GUST FIELDS 600-1,200 m across (drifting downwind). Looked down on from
  // 100 m and more the crests break only inside a field: four or five wind rows here, a gust patch there, and calm water
  // of the sea's own colour between them (an even scatter over the whole sea was a rash of white ticks)
  float fieldN = 0.62*n2(p/880.0 + uTime*vec2(0.004, -0.006) + 31.0) + 0.38*n2(p/340.0 + 5.0 + uTime*vec2(0.006, -0.004));
  float field = mix(1.0, smoothstep(0.47, 0.6, fieldN), smoothstep(80.0, 160.0, cameraPosition.y - vW.y));
  float gather = clamp(rows*(0.05 + 0.95*gusts)*field + 0.75*nearSp, 0.0, 1.0)*(1.0 - 0.35*smoothstep(150.0, 300.0, cameraPosition.y - vW.y))*clamp(uFleck, 0.5, 1.3);
  float fT = mix(0.97, 0.7, min(gather, 1.0));
  vec2 qc = vec2(al, ac) + 3.0*(vec2(n2(p/13.0 + 1.0), n2(p/13.0 + 7.0)) - 0.5);            // (warped: no two crests lie quite the same way)
  vec3 fk = vec3(wcap(qc, 0.62, 0.0, fT, fwg), wcap(qc, 1.0, 1.0, fT, fwg), wcap(qc, 1.7, 2.0, fT, fwg));
  float szA = n2(p/150.0 + 21.0), szB = n2(p/150.0 + 47.0);                                   // which size breaks where
  float fleck = max(max(fk.x*smoothstep(0.3, 0.55, szA), fk.y*smoothstep(0.62, 0.36, szA)), fk.z*max(smoothstep(0.5, 0.7, szB)*(1.0 - 0.8*uNightK), nearSp));
  // ... and where a crest is under a pixel (a kilometre off and more) the rows still carry it as a speck sized to the
  // pixel's own footprint (two octaves, cross-faded), dimmer than a crest seen whole: the far sea is whitecapped in rows too
  float Lf = log2(max(fwg, 0.3)*2.4), l0 = floor(Lf), s0 = exp2(l0), fTf = mix(0.97, 0.76, min(gather, 1.0));
  vec2 qf = vec2(al*1.35, ac*0.78) + 2.6*s0*(vec2(n2(p/(s0*5.0) + 1.0), n2(p/(s0*5.0) + 7.0)) - 0.5);
  float fkA = smoothstep(fTf, fTf + 0.1, n2(qf/s0 + vec2(uTime*0.11, 3.0)))*(0.35 + 0.65*n2(qf/(s0*0.45) + 9.0));
  float fkB = smoothstep(fTf, fTf + 0.1, n2(qf/(2.0*s0) + vec2(uTime*0.11, 3.0)))*(0.35 + 0.65*n2(qf/(s0*0.9) + 9.0));
  fleck = max(fleck, 0.14*(0.25 + 0.75*gusts)*field*mix(fkA, fkB, Lf - l0)*smoothstep(1.3, 3.0, fwg)*(1.0 - smoothstep(14.0, 40.0, fwg)));   // (none outside a gust field)
  fleck *= hiK*aniK*(0.84 + 0.4*uSquall)*(1.0 - 0.7*uCalm);
  float farRow = 0.035*rows*(0.3 + 0.7*gusts)*field*hiK*smoothstep(0.8, 3.2, fwg)*(1.0 - smoothstep(14.0, 44.0, fwg))*aniK*(1.0 - 0.6*uCalm)*(1.0 - 0.7*uNightK);   // far off: the rows as the faintest paling (more of it was a comb of milky bars, by night pale wedges)
  float acH = ac + 46.0*(n2(vec2(al*0.0031, ac*0.0052) + 2.0) - 0.5) + 14.0*(n2(vec2(al*0.011, ac*0.02) + 7.0) - 0.5);   // (their own, wider meander: seen from above no lane is straight)
  float laneHi = hiK*smoothstep(0.52, 0.8, n2(vec2(acH*0.019, al*0.0042) + 6.0))*smoothstep(0.3, 0.7, n2(vec2(acH*0.07, al*0.012) + 3.0))*(1.0 - smoothstep(18.0, 60.0, fwc));   // ... and soft pale wind lanes 50-100 m apart, broken every 100-250 m
  foam = max(foam, clamp(0.95*fleck + farRow + 0.03*laneHi*(1.0 - 0.6*uCalm), 0.0, 0.85));   // (the pale lanes are the faintest thing there: more of them was a fan of streaks converging on the horizon)
  float alS = al + 64.0*(n2(vec2(ac/430.0, al/1400.0) + 11.0) - 0.5) + 26.0*(n2(vec2(ac/170.0, al/520.0) + 3.0) - 0.5) + 9.0*(n2(vec2(ac/48.0, al/160.0) + 8.0) - 0.5);   // (the swell's lines bend at three scales: ruled, or bent only a little, they fan from the bottom of the frame like spokes)
  float swH = 0.7*n2(vec2((alS - uTime*4.0)/38.0, ac/130.0) + 5.0) + 0.3*n2(vec2((alS - uTime*2.5)/15.0 + 3.0, ac/52.0)) - 0.5;   // (crests 130 to 260 m long: at twice that, looked along from the helix, the faces were pale rays fanning from under the wing)
  swH *= hiK*(1.0 - smoothstep(5.0, 20.0, fwp));
  float dkS = clamp(-1.0*swH, 0.0, 0.25)*(1.0 - hiL)*(1.0 - 0.5*uCalm)*(1.0 - 0.6*foam)*(0.55 + 0.45*smoothstep(0.3, 0.6, n2(p/330.0 + 17.0)));   // (deeper in some reaches of the sea than in others)                  // the swell's back faces, from above
  col = col*(1.0 - dkS) + uInk*0.45*dkS; a = a*(1.0 - dkS) + dkS;
  float swLn = (1.0 - smoothstep(0.0, 0.05, abs(swH - 0.13)))*smoothstep(0.35, 0.6, n2(vec2(al/31.0, ac/140.0) + 13.0))*smoothstep(0.42, 0.66, n2(p/300.0 + 29.0))*(1.0 - smoothstep(2.0, 7.0, fwg))*mix(1.0, 0.45, smoothstep(0.8, 2.0, fwg));   // the long crest lines of the swell, broken every hundred metres or so, in a few reaches of the sea only, and fainter where a pixel is over a metre and a half of water (looked down on, the swell is soft shading with a few bent crest lines: line beside line, they were spokes)
  add += uSeaLit*(1.0 - 0.75*hiL)*((0.5*max(swH, 0.0) + 0.22*swLn)*(0.4 + 0.6*lit) + 0.3*pt*sh*hiK*(0.75 + swH));          // ... its faces toward the light; and inside the cloud's shadow a sun patch is brighter, more saturated WATER (never a veil)
  col = col*(1.0 - foam) + mix(uFoamShade, uFoamLit, lit)*foam; a = a*(1.0 - foam) + foam;
  add += uPhos*uPhosK*foam;
  // sargassum windrows: one meandering golden line per 46 m lane, hundreds of metres long
  float ci = floor(cell), cf = fract(cell);
  float off = 0.25 + 0.5*h21(vec2(ci, 3.0)) + 0.16*(n2(vec2(al*0.006, ci*1.7)) - 0.5);
  float wd = 0.7 + 1.2*h21(vec2(ci, 9.0)), aa = max(fwc, 0.18);
  float nearS = 1.0 - smoothstep(0.5, 2.5, fwp);                                          // clumps and ragged sides resolve near the eye
  float rough = (0.9*(n2(vec2(al*0.33 + ci*5.0, ac*0.55)) - 0.5) + 0.5*(n2(p*1.9 + 3.0) - 0.5))*nearS;
  float dl = abs(cf - off)*46.0 + 1.5*rough;                                              // metres from the windrow's centre line: no straight side
  float ln = (1.0 - smoothstep(wd - aa - 0.55*nearS, wd + aa + 0.25*nearS, dl))*min(1.0, 2.5*wd/aa);
  ln *= (1.0 - smoothstep(0.7, 2.0, fwc))*(1.0 - smoothstep(0.9, 2.4, fwp))*(1.0 - 0.85*hiK)*(1.0 - step(0.001, uSheen)*smoothstep(0.35, 0.6, fwc));   // (at last light a far windrow catches the low sun as a ruled yellow line: gone sooner)   // a windrow under about 2 px wide fades out (beyond some 150 m): never a 1 px dark stroke (nor, looked down on from the helix, a scratch)
  float clump = mix(1.0, smoothstep(0.34, 0.62, n2(vec2(al*0.31 + ci*3.0, ac*0.4)))*(0.4 + 0.6*smoothstep(0.25, 0.7, n2(p*2.6 + uTime*0.1))), nearS);   // broken into 2-4 m tufts
  float sg = ln*clump*smoothstep(0.38, 0.6, n2(vec2(al*0.0032 + ci*7.3, ci*0.37)))*smoothstep(0.3, 0.62, n2(vec2(al*0.034, ci*3.1)))*(0.45 + 0.55*n2(p*0.9 + uTime*0.15))*uSargK;
  // ... and one long windrow that lies across the run-in, 35 m ahead at 2 s: it streaks under the nose
  float wd2 = 0.5 + 3.2*n2(vec2(al*0.045, 2.0))*n2(vec2(al*0.013, 6.0));                  // (0.5 to 3 m: a raft here, a thread there)
  float ln2 = (1.0 - smoothstep(wd2 - aa - 0.55*nearS, wd2 + aa + 0.25*nearS, abs(ac - uRowC) + 1.5*rough))*min(1.0, 2.5*wd2/aa);
  ln2 *= (1.0 - smoothstep(0.7, 2.0, fwc))*(1.0 - smoothstep(0.9, 2.4, fwp))*(1.0 - smoothstep(210.0, 330.0, length(p - vec2(0.0, -135.0))));
  float clump2 = mix(1.0, smoothstep(0.3, 0.58, n2(vec2(al*0.31 + 1.7, ac*0.4)))*(0.45 + 0.55*smoothstep(0.25, 0.7, n2(p*2.6 + uTime*0.1))), nearS);
  float sg2 = ln2*clump2*(0.5 + 0.5*n2(p*0.9 + uTime*0.15))*min(uSargK*1.3, 0.95);
  sg2 *= smoothstep(0.4, 0.56, n2(vec2(al/21.0 + 5.0, 1.0)))*(0.35 + 0.65*smoothstep(0.32, 0.6, n2(vec2(al/7.0, 4.0))));   // broken into rafts 10-35 m long with as much open water between: weed on the wind, not a ruled band
  for (int iL = 0; iL < 3; iL++) {                                                        // ... and parted where each skiff of the run-in file has sailed through it (her wake lies in the gap)
    vec2 dLg = p - uLug[iL].xy; float tLg = clamp(-dot(dLg, uLug[iL].zw), 0.0, 90.0);
    sg2 *= smoothstep(4.0 + 0.04*tLg, 13.0 + 0.1*tLg, length(dLg + uLug[iL].zw*tLg));
  }
  sg = max(sg, sg2);
  sg *= 0.88;                                                                             // weed lies in the water: a little of the sea shows through
  float crest2 = (1.0 - smoothstep(0.0, 0.55*wd2, abs(ac - uRowC) + 1.2*rough))*sg2*lit;                 // the run-in's windrow carries a thin sunlit crest along its middle
  col = col*(1.0 - sg) + uSarg*(0.6 + 0.4*lit)*(0.8 + 0.5*n2(p*0.7 + 9.0))*(1.0 + 0.9*sg2 + 0.9*crest2)*sg; a = a*(1.0 - sg) + sg;   // (the run-in's windrow is the freshest: gold)
  // the swell's long faces (used at last light: they carry the orange sky; uSheen is 0 at every other hour)
  float swl = n2(vec2((al - uTime*3.0)*0.085, ac*0.016)), swf = n2(vec2((al - uTime*4.5)*0.31 + 9.0, ac*0.06));
  float shv = 0.7*swl + 0.3*swf + 0.24*(n2(p*0.004 + 3.0) - 0.5), shw = mix(clamp(1.5*fwidth(shv), 0.012, 0.05), 0.12, uNightK);   // (the edge of a face is three pixels wide near the eye, never wider than it was: at a fixed width a face 100 m off had a border metres deep, a blur)
  float shn = smoothstep(0.68 - shw, 0.68 + shw, shv);   // (at last light crisp-edged: glass beside ruffled water; under the moon soft: crisp silver dashes across the sparks' rows were a plaid)
  float hiN = max(smoothstep(1.5, 9.0, fwp), 0.85*hiK*uNightK);                              // (by night, looked down on, each swell face would be a pale lozenge: patches there too)
  float farN = n2(p*0.004 + 3.0 + uTime*0.004) + uCalm*0.22*(n2(vec2(ac*0.006, al*0.028) + 9.0) - 0.5);   // (a calm sea: the patches are drawn out along the wind into long streaks ...)
  shn = mix(shn, 0.3*(0.4 + 1.2*smoothstep(mix(0.45, 0.3, uNightK), mix(0.55, 0.7, uNightK), farN)), hiN);   // from altitude: bronze in patches 200-400 m across (... with crisp edges: glass beside ruffled water, not a smear)
  shn *= mix(1.0, 0.3 + 0.7*smoothstep(0.35, 0.65, n2(vec2((al - uTime*2.0)*0.5, ac*0.11))), 1.0 - smoothstep(0.3, 1.5, fwp));   // close to, each face breaks into ripple dashes
  // (last light, near the eye) ... and a face is never one flat light: the apricot sky lies on the glassy swell as THIN
  // WAVERING THREADS (threadsOf above: 4.5 m apart, a quarter of a metre to a metre deep and never over five pixels,
  // tens of metres long, lying along the crests, drifting with the swell; they swell out of nothing and thin to nothing
  // toward the edge of the face they lie on), with jade between them. A calm sea carries more of them.
  float thrN = threadsOf(vec2(al - uTime*3.4, ac), 4.5, 18.0, 3.0, vec2(0.03, 0.12), mix(0.42, 0.55, uCalm), smoothstep(0.32, 0.6, shv), 0.07);   // (reaches of 20 to 50 m with gaps as long: at 30 m and denser a thread ran 150 m unbroken)
  shn = mix(shn, 1.15*thrN, uLast*(1.0 - hiN));
  float nsw = smoothstep(mix(0.24, 0.45, uCalm), mix(0.8, 0.59, uCalm), 0.62*swl + 0.38*swf);   // the same swell, unthresholded: broad soft faces (last light's rose wash, the night sea's body); crisper on a calm sea
  nsw = mix(nsw, 0.42*(0.6 + 0.8*mix(farN, smoothstep(0.4, 0.6, farN), uCalm)), hiN);
  // sand shoals and their caustic net under the entry
  float nearE0 = 1.0 - smoothstep(250.0, 620.0, length(p - vec2(0.0, 60.0)) + 240.0*(n2(p*0.0052 + 1.0) - 0.5) + 110.0*(n2(p*0.016 + 8.0) - 0.5)), nearE = nearE0*(1.0 - sh);   // the shoal ends in tongues and patches
  float sd = smoothstep(0.4, 0.72, n2(p*0.011 + 5.0))*nearE;
  float nr1 = 1.0 - abs(2.0*n2(p*0.33 + uTime*vec2(0.12, 0.07)) - 1.0), nr2 = 1.0 - abs(2.0*n2(p*0.8 - uTime*vec2(0.1, 0.14) + 7.0) - 1.0);
  float net = smoothstep(0.3, 0.95, nr1*(0.35 + 0.65*nr2))*(1.0 - smoothstep(0.5, 2.5, fwp));   // a soft web: two ridged octaves drifting against each other
  float lanes = (1.0 - smoothstep(380.0, 1250.0, length(p - vec2(0.0, 60.0))))*smoothstep(0.4, 0.74, 0.6*n2(vec2(ac*0.011, al*0.0034) + 3.3) + 0.4*n2(p*0.021 + 5.0));   // beyond the shoal: pale lanes and reef patches in the blue
  vec2 rq = p - uReef.xy;                                                                  // ... and a patch reef west to north-west of the fifth sister (uReef: its centre and half-axes, dealt per seed): the helix looks down on pale shallows and coral heads there, not on one blue
  float reefM = 1.0 - smoothstep(0.5, 1.0, length(rq/uReef.zw) + 0.55*(n2(p/190.0 + 3.0) - 0.5) + 0.3*(n2(p/64.0 + 8.0) - 0.5));
  float reef = reefM*smoothstep(0.36, 0.62, 0.6*n2(p*0.012 + 15.0) + 0.4*n2(p*0.041 + 2.0));
  float tq = uTq*max(max(nearE*(1.0 - 0.6*sd), 1.5*lanes*(1.0 - 0.55*sh)), 1.5*reef*(1.0 - 0.5*sh)*(1.0 - 0.6*uNightK));
  col = col*(1.0 - tq) + uTurq*(1.0 + uSheen*(1.1*swl - 0.5))*tq; a = a*(1.0 - tq) + tq;
  float sk = 0.26*sd;
  col = col*(1.0 - sk) + uSand*sk; a = a*(1.0 - sk) + sk;
  float weed = 0.85*smoothstep(0.43, 0.66, 0.6*n2(p*0.019 + 11.0) + 0.4*n2(p*0.06 + 3.0))*nearE0*(1.0 - 0.75*shade)*(1.0 - sd);   // seagrass and coral heads: dark teal patches 20-80 m across, also under the sun patches inside the shadow line: the lagoon is never one flat colour
  vec2 wq = vec2(p.x*uMX, p.y);                                                           // ... and three beds laid across the run-in itself (30-70 m across, ragged): the first 150 m are never one turquoise
  float wr = 0.55*(n2(p*0.09 + 4.0) - 0.5) + 0.3*(n2(p*0.31 + 8.0) - 0.5);
  float beds = max(max(1.0 - smoothstep(0.55, 1.0, length((wq - vec2(-24.0, 58.0))/vec2(34.0, 15.0)) + wr), 1.0 - smoothstep(0.55, 1.0, length((wq - vec2(31.0, 2.0))/vec2(40.0, 19.0)) + wr)), 1.0 - smoothstep(0.55, 1.0, length((wq - vec2(-12.0, -66.0))/vec2(30.0, 13.0)) + wr));
  weed = max(weed, 0.8*beds*(1.0 - 0.75*shade));
  weed = max(weed, 0.6*reefM*smoothstep(0.52, 0.7, 0.6*n2(p*0.026 + 21.0) + 0.4*n2(p*0.08 + 5.0)));   // (the patch reef's coral heads)
  weed *= 0.75 + 0.5*n2(p*0.23 + 2.0);                                                    // (mottled: beds, not blots)
  col = col*(1.0 - weed) + uInk*1.25*weed; a = a*(1.0 - weed) + weed;
  add += uSand*0.11*net*nearE*(0.4 + 0.6*sd)*(1.0 - 0.7*weed);
  // sun glitter
  float gl = n2(p*3.3 + uTime*vec2(1.3, 0.8))*n2(p*4.6 - uTime*vec2(0.9, 1.5));
  float Ls = log2(max(fwg, 0.3)*1.7), ls0 = floor(Ls), ss0 = exp2(ls0);                     // (from the helix) glitter is sparks a pixel or two across, twinkling: never a milky veil
  float spk = mix(smoothstep(0.8, 0.9, n2(p/ss0 + uTime*vec2(0.7, 0.45)))*n2(p/(0.6*ss0) - uTime*vec2(0.5, 0.8) + 5.0), smoothstep(0.8, 0.9, n2(p/(2.0*ss0) + uTime*vec2(0.7, 0.45)))*n2(p/(1.2*ss0) - uTime*vec2(0.5, 0.8) + 5.0), Ls - ls0)*aniK;
  vec2 toP = p - cameraPosition.xz; float sroad = max(dot(toP/max(length(toP), 1.0), uSunAz), 0.0);
  float road = pow(sroad, 60.0), roadW = pow(sroad, uRoadPow);
  gl = mix(smoothstep(0.54, 0.68, gl), mix(0.03, 0.8*spk*(0.25 + 0.75*gusts)*(0.12 + 0.88*max(roadW, 0.6*field*sroad)), hiK), smoothstep(0.15, 0.9, fwp));   // (looked down on, sparks lie toward the sun and where a gust field ruffles the water: away from the sun the sea keeps its colour)
  add += uSunCol*uGlit*1.1*gl*lit*mix(1.0 - 0.88*uCalm, 1.0, road);                      // a calm sea keeps a narrow glitter path
  add += uSunCol*uRoadTint*uRoad*(0.3*roadW + 0.7*road)*(0.35 + 0.65*lit)*(0.6 + 0.4*n2(vec2(ac*0.2, al*0.03 + uTime*0.2)));   // the bronze sun road (silver under the moon)
  float gz = 1.0 - clamp((cameraPosition.y - vW.y)/max(vFogDepth, 1.0), 0.0, 1.0); gz *= gz; gz *= gz; gz *= gz;   // (seen low across the water; from the helix the sea keeps its colour)
  // last light: the swell carries the orange sky as a broken bronze sheen, widest toward the sun. It mirrors the open
  // horizon, not the sun, so it lies under the cloud too: the shadowed sea is jade and bronze, never black
  // Faces turned away from the sun carry the rose-violet of the sky on that side: bright flecks, and a broad soft wash
  float shD = shn*mix(smoothstep(10.0, 260.0, vFogDepth), smoothstep(3.0, 30.0, vFogDepth), uCalm), nearL = uLast*(1.0 - hiN);
  float kL = nearL*(1.0 - hiL)*min(0.9*shD, 0.88)*(1.0 - foam)*(1.0 - sg)*(0.62 + 0.38*n2(p*1.3 + uTime*0.4));   // (rippled: where a thread is several pixels deep it is broken water, not a flat fill)                               // (last light, near the eye: a light is the SKY lying on the water, so it takes the water's place in the sky's own apricot, gold toward the sun; added on top of the jade it was a cream paler than the sky it mirrors)
  col = col*(1.0 - kL) + mix(uApr*1.45, uGold*1.15, roadW)*(0.72 + 0.28*lit)*kL; a = a*(1.0 - kL) + kL;
  add += (1.0 - hiL)*mix(uSheenBack, uSheenCol, max(roadW, 0.45*(1.0 - smoothstep(200.0, 700.0, vFogDepth))))*uSheen*(shD*(1.0 - nearL)*(0.6 + 0.4*roadW + 0.25*uCalm)*(0.6 + 0.4*lit) + uBackK*nsw*(1.0 - roadW)*(0.75 - 0.2*lit)*(1.0 - 0.8*gz)*(1.0 - 0.75*uSquall)*mix(0.4, 1.0, smoothstep(250.0, 600.0, vFogDepth))*(1.0 - 0.85*foam));   // (inside 700 m the faces take some of the sun side's apricot: near the eye rose-violet over jade was lilac-grey; four tenths of the wash inside 400 m, a quarter under a squall, none over foam: near the eye the wash was lilac streaks over the jade, and the foam lines keep their own lit white)   // ... and thinner still low across the water, where a wash is drawn out into a mauve smear (a squall halves it)   // (the wash is thinner on the sunlit green: rose over emerald goes grey)
  // NIGHT: the moonlit swell. The kit sea is all but black away from the moon, so the dressing carries it: navy faces on
  // every swell (dimmer in the troughs), silver on the faces toward the moon, blue-green sparks where a whitecap breaks
  // (3-8 m crests lying across the wind, flaring and dying), and a paler band under the horizon
  if (uNightK > 0.0) {
    float moonW = roadW*sqrt(roadW);
    float cap = smoothstep(0.7, 0.86, n2(vec2((al - uTime*2.0)*1.5, ac*0.3 + 0.35*sin(al*0.4))))*smoothstep(0.5, 0.76, n2(p*0.05 + uTime*vec2(0.13, -0.09)));
    cap *= 0.5 + 0.5*sin(uTime*2.3 + 40.0*n2(p*0.09));
    cap *= 0.3 + 0.7*smoothstep(0.3, 0.7, n2(p*2.1 + uTime*vec2(0.4, 0.2)));               // each crest is torn, not a lozenge
    cap = mix(cap, 0.01, smoothstep(0.35, 1.8, fwp))*(1.0 - 0.9*hiK);                        // (from the helix the sparks are the flecks' own: a row of crests would be a ruled rash)
    vec3 nb = uNightCol*(0.42 + 1.36*nsw)*(1.0 - 0.4*lit)*(0.75 + 0.5*ruf);
    nb += uNightCol*1.3*lit*smoothstep(150.0, 900.0, vFogDepth)*(1.0 - 0.8*hiK);            // the open sea beyond the cloud's shadow: no ink there, and far off the kit sea is black (looked down on, half of it: the shadow's ragged edge is a faint sheen, not pale wedges)
    nb += uSilver*shn*(0.5 + 1.6*moonW)*(1.0 - 0.5*hiK);
    nb += uPhos*cap*(0.5 + 0.6*foam);
    nb += uNightHor*smoothstep(260.0, 2300.0, vFogDepth);
    add += nb;
  }
  // toward the horizon the sea takes the pale sky under the cloud's far edge, in wind lanes: it grades away, no dark stripe
  add += uFarCol*gz*smoothstep(40.0, 300.0, vFogDepth)*(0.6 + 0.4*lit)*(0.7 + 0.6*n2(vec2(ac*0.021, al*0.0031)));
  // each sister stands on a pale smear drawn toward the eye
  float smr = 0.0;
  for (int i = 0; i < 6; i++) {
    vec2 d = cameraPosition.xz - uSp[i].xy; float dl = max(length(d), 1.0); d /= dl;
    vec2 r = p - uSp[i].xy; float sa = dot(r, d), sc = dot(r, vec2(-d.y, d.x));
    float w = uSp[i].w + 0.02*max(sa, 0.0);                                             // narrow, so three smears never merge into a wash
    smr += uSp[i].z*exp(-(sc*sc)/(w*w))*smoothstep(0.0, 60.0, sa)*exp(-max(sa, 0.0)/(0.25*dl + 60.0));
  }
  smr *= 0.55 + 0.45*n2(vec2(p.x*0.21 + p.y*0.07, p.y*0.5 + uTime*0.7));
  smr *= mix(1.0, mix((0.3 + 0.9*smoothstep(0.3, 0.7, n2(vec2((al - uTime*2.0)*0.45, ac*0.1) + 5.0)))*(1.0 - 0.85*thrN), 0.62, smoothstep(1.5, 9.0, fwp))*smoothstep(25.0, 140.0, length(toP)), step(0.001, uSheen));   // at last light the tubes' reflections are rose dashes lying along the swell BETWEEN the apricot threads, not a wash
  add += uSmearCol*uSmear*min(smr, 1.0)*(1.0 - smoothstep(42.0, 95.0, cameraPosition.y - vW.y));   // (from the helix they would be ruled rays fanning from under the wing, and at 90 m a milky patch: gone by 95 m; the slalom never climbs past 37)
  // LAST LIGHT, THE BODY OF THE SEA (uLast; the kit sea at that hour is jade under a lilac haze, and from the helix a
  // film). Looked down on, and beyond a kilometre from any height, the dressing paints the water itself under its own
  // foam and reefs: GLASS. Jade where the eye looks down into it, taking a bronze cast as the eye's line flattens
  // (bronze-jade to the horizon); on it the swell's LIGHTS, thin crisp lines of the apricot sky 6-17 m apart and
  // 50-130 m long, wavering and forking (an eighth of the water; toward the sun half of it, and gold: the glitter
  // road), one even tone where a line is under a pixel; DARK CAT'S-PAWS where a gust ruffles it (matt: they carry no lights). It hazes to the
  // sea's own far colour (uSeaHaze: the dome's colour below the horizon), never to the air's lilac.
  float bA = 0.0; vec3 bodyC = vec3(0.0);
  if (uLast > 0.0) {
    float vdn = clamp((cameraPosition.y - vW.y)/max(vFogDepth, 1.0), 0.0, 1.0), fres = 1.0 - vdn; fres *= fres*fres;
    float kA = 1.0 - smoothstep(4.0, 13.0, fwp), kB = 1.0 - smoothstep(1.5, 5.0, fwp);
    float rdL = roadW*roadW;                                                               // (the road of lights is narrower than the sun road's own wash)
    vec2 pq = vec2(al, ac) + 90.0*(vec2(n2(p/230.0 + 3.0), n2(p/230.0 + 17.0)) - 0.5) + 28.0*(vec2(n2(p/61.0 + 9.0), n2(p/61.0 + 23.0)) - 0.5);   // (warped at two scales: a cat's-paw has a ragged, lobed edge, never a straight side)
    float slk = smoothstep(0.4, 0.62, 0.6*n2(pq/vec2(840.0, 360.0) + 41.0 + uTime*vec2(0.004, 0.003)) + 0.4*n2(pq/vec2(270.0, 125.0) + 7.0));   // SLICKS: reaches of glassier water 300-800 m across. Far off, where a light is finer than the pixel, they carry the sky as pale apricot bands with jade between (one even tone to the horizon was a flat khaki field)
    float cov = mix(mix(0.03, 0.46, slk), 0.42, rdL);
    vec2 thkL = vec2(0.04, 0.13)*(1.0 + 1.6*rdL);                                             // (the same threads as near the eye, at 17 m and 6.5 m: single wavering lines along the swell, 50-120 m long, thicker and more of them toward the sun; level lines of noise were wood grain here, closed ring inside ring)
    float lights = mix(cov, max(threadsOf(vec2(alS - uTime*4.0, ac), 17.0, 120.0, 5.0, thkL, mix(0.5, 0.85, rdL), 1.0, cov), kB*threadsOf(vec2(alS - uTime*2.6, ac), 6.5, 50.0, 9.0, thkL, mix(0.45, 0.8, rdL), 1.0, cov)), kA);
    vec2 pr = vec2(0.8*pq.x - 0.6*pq.y, 0.6*pq.x + 0.8*pq.y);                               // (the second size on a turned lattice: on one lattice the cat's-paws lay in rows with near-straight sides, like paving)
    float pv = 0.74*n2(pq/vec2(360.0, 160.0) + uTime*vec2(0.02, 0.012) + 13.0) + 0.26*n2(pr/vec2(150.0, 84.0) + 3.0 - uTime*vec2(0.03, 0.0));
    float pst = 0.6*mix(n2(vec2(al/34.0, ac/4.2) + 5.0), 0.5, smoothstep(1.5, 6.0, fwp)) + 0.4*mix(n2(vec2(al/110.0, ac/11.0) + 9.0), 0.5, smoothstep(5.0, 18.0, fwp));   // wind streaks at two sizes: they fray a cat's-paw's edge along the wind and ruffle its inside
    float pvw = clamp(1.5*fwidth(pv), 0.03, 0.25);                                            // (a feathered edge, 20 m and more deep)
    float paw = smoothstep(0.67 - pvw, 0.67 + pvw, pv + 0.11*(pst - 0.5))*(1.0 - smoothstep(40.0, 130.0, fwp))*(1.0 - 0.6*uCalm)*(0.62 + 0.6*pst);   // fewer and larger than they were, their edges ragged
    vec3 brz = uApr*vec3(0.9, 0.7, 0.48);
    bodyC = mix(uJade*(0.72 + 0.26*lit)*(1.0 - 0.45*paw), brz, clamp(0.05 + 0.95*fres*fres, 0.0, 0.86)*(1.0 - 0.7*paw));   // (jade where the eye looks down into it; toward the horizon a bronze mirror, on which a cat's-paw stays dark jade. Half and half all the way out it was one olive field)
    bodyC += mix(uApr, uGold, rdL)*(1.0 - 0.25*shade)*lights*(0.16 + 0.74*smoothstep(0.0, 0.45, fres))*(1.0 - 0.92*paw);
    bodyC += uGold*(0.4*pow(sroad, 24.0)*fres + 1.5*spk*roadW*roadW)*(1.0 - 0.8*paw)*(0.4 + 0.6*lit);   // the road's bright core under the sun, sparks in it
    float hzB = 1.0 - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth*0.35);                  // (its marks carry further than the air's haze: slicks and cat's-paws are still there at three kilometres)
    bodyC = mix(bodyC, uSeaHaze, hzB);
    bA = uLast*max(hiK*mix(0.7, 0.93, smoothstep(150.0, 800.0, vFogDepth)), smoothstep(300.0, 1300.0, vFogDepth));
  }
  a = clamp(a, 0.0, 0.93);
  float ff = fogK(), far = 1.0 - smoothstep(mix(1700.0, 2400.0, hiK), mix(3300.0, 4300.0, hiK), vFogDepth);   // (from the helix the dressing runs further out: the sea keeps its shadow, lanes and night glow to the haze)
  col = mix(col, uDFog*a, ff);
  float hz = 0.97*uNightK*smoothstep(10.0, 24.0, cameraPosition.y)*smoothstep(mix(1000.0, 1500.0, hiK), mix(2600.0, 3600.0, hiK), vFogDepth);   // (low over the water it comes on from 1 km and is whole by 2.6: at 1.5 to 3.6 km the sea between 2 and 3.5 km, one row of pixels from the slalom, was neither: its glow gone into the fog, the haze a half, a dark hairline ruled under the horizon. Measured with the layers colour-coded)   // by night, from the slalom's 30 m up (not the run-in's 12 m: its far sea is lit by the open sky) the sea beyond 3 km is the moon haze of the sky's horizon (there the fog has taken the swell's glow and the kit sea alone is navy: a dark stripe under the horizon)
  vec4 o = vec4((col + add*(1.0 - ff))*far, a*far);
  bA *= 1.0 - o.a; o += vec4(bodyC*bA, bA);                                                 // (the body lies under the dressing's own marks and over the kit sea)
  gl_FragColor = o*(1.0 - hz) + vec4(uHazeN*mix(1.0, 0.92, smoothstep(3600.0, 6000.0, vFogDepth))*hz, hz);   // (at the rim it is the dome's own colour below the horizon)
}
`,po=i=>`
uniform float uTime, uOriginZ, uFlash, uSpin, uReliefD, uNightC; uniform vec4 uBayA, uHaze;
uniform vec3 uIndigo, uLip, uSunDir, uSunCol, uShadeCol, uBounce, uFlashPos, uLift;
varying vec3 vW;
${_e}${Ve}${Pt}${Ma}${i}
float ceilTone(vec2 w){ return 0.62*n2(w/165.0 + 3.0) + 0.38*n2(w/74.0 + 17.0); }
float ceilFar(vec2 w, float k){ float a = n2(w/1350.0 + 4.0); return mix(a, 0.5*a + 0.32*n2(w/610.0 + 19.0) + 0.18*n2(w/270.0 + 41.0), k); }   // the far deck's hanging masses: 600-1,400 m across, no two alike (three unrelated scales: nothing repeats); k: 0 where a pixel is over 60 m of deck along the eye's line (there the two finer scales are drawn out into streaks: only the broad lobes are left)
vec2 ceilAB(vec2 w){ return vec2(abs(2.0*n2(w/250.0 + 3.0) - 1.0), abs(2.0*n2(w/104.0 + 17.0) - 1.0)); }   // 0 along the creases, at two scales
float ceilH(vec2 w, float rnd, float k2){                              // 0 at the bottom of a pouch, 0.65 along a crease (rounded off by rnd: no cusp, and none at all at a grazing angle); k2: 1 near (broad pouches, creased at 100 m), 0 far off from the helix (the 100-200 m lobes carry most of the depth: each hangs by its own amount, and that is what stands in profile)
  vec2 ab = ceilAB(w); ab = sqrt(ab*ab + rnd);
  vec2 hh = sqrt(min(ab*vec2(1.6, 1.7), 1.0));
  return 1.0 - mix(0.3, 0.66, k2)*hh.x - mix(0.7, 0.34, k2)*hh.y;
}
void main(){
  vec2 p = vW.xz, q = p - vec2(0.0, uOriginZ);
  float e = lipE(p), fl = lipFar(p)*vFogDepth;                                                       // the lip: rounded corner, scallops, ragged far bays
  float eF = min(p.y + 5200.0, 3900.0 - p.x*uMX) + 900.0*(n2(p/1500.0 + 4.0) - 0.5) + 400.0*(n2(p/430.0 + 9.0) - 0.5);
  float farK = smoothstep(0.0, 1500.0, eF);                                                          // the far (north, east) edges dissolve over 1.5 km
  float ang = uTime*0.009*uSpin, ca = cos(ang), sa = sin(ang);
  vec2 c = q - vec2(0.0, -150.0), r = vec2(c.x*ca - c.y*sa, c.x*sa + c.y*ca);
  vec2 wv = vec2(fb3(r/290.0 + 1.7 + uTime*0.004), fb3(r/290.0 + 9.2 - uTime*0.003)) - 0.5;
  vec2 w = r + 170.0*wv + uTime*vec2(1.1, -0.7);
  float lump = fb3(r/420.0 + 3.0);
  float t0 = ceilTone(w);
  vec2 s2 = normalize(uSunDir.xz + vec2(1e-4, 0.0)), sr = vec2(s2.x*ca - s2.y*sa, s2.x*sa + s2.y*ca);
  float fwL = max(length(dFdx(p)), length(dFdy(p))), finK = 1.0 - smoothstep(22.0, 60.0, fwL);   // the long axis of a pixel's footprint on the deck: over 22-60 m of it (the deck seen at under about ten degrees) every tone finer than half a kilometre is a streak drawn out along the eye's line, and stands down
  float relief = clamp((t0 - ceilTone(w + sr*55.0))*3.4, -1.0, 1.0)*finK;       // (far field) > 0 on the flank of a billow that faces the low sun
  // the march: rise = metres above the sheet at which the eye ray meets the underside
  vec3 V = normalize(vW - cameraPosition);
  vec2 sXZ = vec2(V.x*ca - V.z*sa, V.x*sa + V.z*ca)/max(V.y, 0.05);         // metres across per metre of rise, in the turned frame
  // FROM THE HELIX the far deck is seen at 3-15 degrees. A flat painted sheet is squeezed into streaks there, whatever
  // is painted on it; what reads at that angle is relief in profile (a 100 m pouch 3 km off stands 30 px tall). So from
  // altitude (hiC) the march keeps its full depth out to the far lip: the ray may run 1,250 m under the sheet (not 320),
  // the depth passes from the broad pouches (a 400 m pouch 4 km off is a streak 50 px by 3) to the 100-200 m lobes, which
  // hang a third deeper there, each by its own amount, and are shaded by height (pale bellies, dark clefts); the broad
  // painted tones, which could only be streaks, are damped, and the grain is sized to the pixel.
  float hiC = smoothstep(110.0, 250.0, cameraPosition.y), farP = 0.0*hiC*smoothstep(450.0, 1400.0, vFogDepth);
  float lodR = 1.0 - smoothstep(1100.0, 2600.0, vFogDepth);   // (beyond 3-4 km a pouch is a few pixels of pale belly over a dark cleft, row on row: scales. There the deck is the painted billows again)
  float amp = 0.45 + 0.8*smoothstep(0.28, 0.7, n2(r/640.0 + 5.5));          // deep pouches in some quarters of the base, shallower in others: never a flat sheet
  amp = mix(amp, 1.3*max(amp, 0.62)*smoothstep(0.26, 0.62, 0.65*n2(r/1150.0 + 2.2) + 0.35*n2(r/380.0 + 14.0)), farP);   // (far off the pouches hang in fields 500-1,500 m across with smooth, billowed deck between them: an unbroken band of them was a strip of scales)
  float graze = 1.0 - smoothstep(0.3, 0.75, V.y), rnd = mix(0.012, 0.03, graze) + 0.035*farP, k2 = 1.0 - farP*(0.3 + 0.7*smoothstep(0.3, 0.7, n2(r/720.0 + 9.0)));   // (far off the small lobes lead in some quarters and the broad pouches in others: no band of one size)   // creases round off as the ray grazes the deck (no hairline folds)
  float jit = h21(gl_FragCoord.xy + 17.0);                                  // the march starts at a per-pixel offset: no contour steps
  float Dn = min(uReliefD*amp*lodR, mix(320.0, 1250.0, farP)/max(length(sXZ), 1e-3));   // a grazing ray never runs more than 320 m (from the helix, far off: 1,250 m): 22 steps resolve the pouches (57 m apart at most)
  vec2 w0 = r + uTime*vec2(1.1, -0.7);
  w0 += farP*(170.0*(vec2(n2(r/560.0 + 21.0), n2(r/560.0 + 43.0)) - 0.5) + 64.0*(vec2(n2(r/170.0 + 5.0), n2(r/170.0 + 31.0)) - 0.5));   // far off the pouches are crowded here and drawn out there (two more scales of noise): uneven sizes, uneven spacing
  float rise = Dn, hP = 0.0, dP = -Dn*ceilH(w0, rnd, k2), found = 0.0, hA = 0.0, dA = -1.0, hB = Dn, dB = 1.0;
  for (int i = 1; i <= 22; i++) {
    float hc = Dn*(float(i) - 0.9*jit)/22.0, df = hc - Dn*ceilH(w0 + sXZ*hc, rnd, k2);
    if (found < 0.5 && df >= 0.0) { hA = hP; dA = dP; hB = hc; dB = df; found = 1.0; }
    hP = hc; dP = df;
  }
  if (found > 0.5) {                                                        // two secant steps inside the bracket
    rise = mix(hA, hB, clamp(-dA/max(dB - dA, 1e-4), 0.0, 1.0));
    float dR = rise - Dn*ceilH(w0 + sXZ*rise, rnd, k2);
    if (dR < 0.0) { hA = rise; dA = dR; } else { hB = rise; dB = dR; }
    rise = mix(hA, hB, clamp(-dA/max(dB - dA, 1e-4), 0.0, 1.0));
    dR = rise - Dn*ceilH(w0 + sXZ*rise, rnd, k2);                           // (a third: far off a step of the march is 57 m, and two left the bellies stair-edged)
    if (dR < 0.0) { hA = rise; dA = dR; } else { hB = rise; dB = dR; }
    rise = mix(hA, hB, clamp(-dA/max(dB - dA, 1e-4), 0.0, 1.0));
  }
  vec2 wh = w0 + sXZ*rise;
  float Hh = ceilH(wh, rnd, k2), relK = Dn/max(uReliefD, 1.0), rk = min(relK*1.4, 1.0);
  vec2 ab = ceilAB(wh);
  float ao = 1.0 - mix(0.3, 0.66, k2)*(1.0 - smoothstep(0.02, 0.4, ab.x)) - mix(0.7, 0.34, k2)*(1.0 - smoothstep(0.02, 0.4, ab.y));   // broad soft shade toward the creases (never a hairline)
  ao = mix(ao, smoothstep(0.1, 1.0, 1.2 - 1.3*Hh), 0.45*farP);                                      // (far off from the helix: by height, the hanging bellies pale and the clefts between them dark)
  ao = mix(ao, 0.5 + 0.5*ao, 0.7*graze*(1.0 - farP));                                    // ... least of all where the deck is seen at a grazing angle and the shade is squeezed into lines
  vec2 gH = vec2(ceilH(wh + vec2(9.0, 0.0), rnd, k2) - Hh, ceilH(wh + vec2(0.0, 9.0), rnd, k2) - Hh)/9.0;
  float Lg = log2(max(vFogDepth*0.0135/21.0, 1.0)), l0g = floor(Lg), sg0 = 21.0*exp2(l0g);   // the grain is never finer than about 5 px: 21 m within 1.5 km, doubling with distance (two sizes cross-faded)
  vec2 bmp = mix(vec2(n2(wh/sg0 + 2.0), n2(wh/sg0 + 37.0)), vec2(n2(wh/(2.0*sg0) + 2.0), n2(wh/(2.0*sg0) + 37.0)), Lg - l0g) - 0.5;   // the pouches' own cauliflower grain
  vec3 Nr = normalize(vec3(Dn*gH.x + 0.55*bmp.x*rk, -1.0, Dn*gH.y + 0.55*bmp.y*rk));   // the underside's normal (turned frame), facing down
  float fdot = dot(Nr.xz, sr), flank = smoothstep(0.04, 0.72, fdot);          // under the deck the low sun's light comes in level: it takes the flanks that face it
  float wisp = fb3(wh/36.0 + 5.0), dt = fb3(wh/58.0 + 8.0);
  float stri = n2(vec2(r.x/310.0, r.y/42.0) + 9.0);
  float grain = bmp.x + 0.6*(n2(wh/8.5 + 5.0) - 0.5)*(1.0 - smoothstep(500.0, 1300.0, vFogDepth));     // cauliflower grain at 21 and 8.5 m: in the tone as well as the normal, most where the deck is seen at a grazing angle (no satin sheets)
  float tone = mix(0.72 + 0.46*mix(0.5, lump, 0.4 + 0.6*finK) - 0.66*finK*(t0 - 0.5) + 0.04*mix(0.5, stri, finK) + finK*(0.14*(wisp - 0.5) + 0.12*(dt - 0.5)), 0.5 + 0.4*mix(lump, 0.5, 0.7*farP) + (0.36 + 0.34*farP)*(ao - 0.55)*rk + (0.2*(dt - 0.5) + 0.12*(wisp - 0.5) + 0.04*stri)*(1.0 - 0.6*farP) + (0.12 + 0.2*graze + 0.1*farP)*grain, lodR);
  vec3 col = uIndigo*(0.34 + 0.62*tone)*0.92 + uShadeCol*0.05*tone + uBounce*(0.03 - 0.1*Nr.y*ao*ao*relK);   // the sea's turquoise on the bottoms of the pouches
  col *= mix(1.0 - 0.26*max(-relief, 0.0), (0.7 - 0.12*farP + (0.3 + 0.12*farP)*ao)*(1.0 - 0.2*smoothstep(0.1, 0.6, -fdot)), lodR*rk);   // hollows and the flanks turned from the sun are dark
  vec2 sl = uSunDir.xz/max(uSunDir.y, 0.1);
  float pt = clamp((wsPatch(q - sl*620.0) - uPatch.z)/max(1.0 - uPatch.z, 0.01), 0.0, 1.0);
  // THE FAR DECK (beyond the marched pouches, 1.5 km and more) hangs in three or four broad unequal LOBES, 600-1,400 m
  // across: seen at a few degrees a painted tone is a streak, so the masses are drawn the way they would be seen: the
  // lookup slides along the eye's line by each mass's own depth (one step: the near side of a hanging belly swells toward
  // the eye, its far side is hidden); a belly is shaded (the thick of the cloud), the deck between the lobes paler, the
  // flank turned from the low sun dark and the flank that faces it lit along its edge.
  float farS = (1.0 - lodR*rk)*mix(0.4, 1.0, hiC), farD = mix(2.0, 1.0, finK);                 // (twice the shading where the fine tones have stood down)
  vec2 wF = w + sXZ*min(46.0, 380.0/max(length(sXZ), 1e-3))*(ceilFar(w, finK) - 0.5);
  float fh = ceilFar(wF, finK), fhS = ceilFar(wF + sr*210.0, finK), fFl = clamp((fh - fhS)*3.2, -1.0, 1.0), belly = smoothstep(0.34, 0.66, fh);
  col *= 1.0 + farS*(mix(0.42, -0.5, 1.0 - finK)*(belly - 0.55) - 0.3*farD*max(-fFl, 0.0));
  col += uLip*vec3(1.0, 0.8, 0.6)*max(fFl, 0.0)*farS*farD*(0.06 + 0.14*pt)*(0.5 + 0.5*belly);
  col += uLift*(1.3 - tone);                                                                         // (night: the hollows keep a slate-indigo floor, never one clipped blue)
  col += uLip*max(relief, 0.0)*(0.03 + 0.10*pt)*(1.0 - lodR);
  col += uLip*vec3(1.0, 0.8, 0.6)*flank*(0.03 + 0.21*pt + 0.06*farP)*(0.4 + 0.6*ao)*min(relK*1.6, 1.0);        // lit flanks, brightest where a sun patch slides through
  col += uSunCol*vec3(1.0, 0.74, 0.62)*pt*0.11*(0.35 + 0.65*mix(smoothstep(0.3, 0.7, t0), ao*(0.5 + 0.5*flank), lodR))*(0.7 + 0.6*wisp);   // warm bars sliding across the base
  vec2 bq = p - uBayA.xy; float bd = length(bq - uBayA.zw*clamp(dot(bq, uBayA.zw), -320.0, 60.0));
  col *= 1.0 - 0.45*(1.0 - smoothstep(110.0, 330.0, bd));                                           // over the portal's bay and its mouth the base is a dark roof (never a pale patch that reads as sky)
  float rag = 70.0*(n2(p/38.0 + uTime*0.02) - 0.5) + 60.0*(t0 - 0.5)*(1.0 + fl/420.0);
  float er = 0.6*fb3(p/130.0 + 4.0 + uTime*0.006) + 0.4*fb3(p/43.0 - uTime*0.012), e2 = e + rag;   // within a couple of kilometres the last 340 m of the sheet are eaten into puffs and bays 40-130 m across: no clean curve against the sky
  float eat = smoothstep(0.0, 0.2, er - 0.6*(1.0 - smoothstep(0.0, 340.0, e2))*(1.0 - smoothstep(1500.0, 3200.0, vFogDepth)));
  float alpha = smoothstep(0.0, 75.0 + 0.22*fl, e2)*eat*farK;                                       // seen edge-on from kilometres off, the lip dissolves over a wider band ...
  float lipK = exp(-max(e2, 0.0)/(120.0 + 0.2*fl));                                                  // ... and its lit fringe is as wide
  float flK = min(fl/2500.0, 1.0);
  col = mix(col, uLip*mix(vec3(1.0), mix(vec3(1.12, 0.86, 0.58), vec3(0.5, 0.56, 0.7), uNightC), flK)*(0.4 + 0.5*mix(t0, 0.25 + 0.75*ao, lodR) + 0.3*max(relief, 0.0))*(1.0 + 0.9*flK)*(1.0 + lodR*(0.75*(wisp - 0.5) + 0.6*(dt - 0.5) + 0.5*(bmp.x + bmp.y))), min(lipK*(0.8 + 0.5*flK), 1.0));   // the far lip, back-lit by the open sky, glows
  float sd = max(dot(V, uSunDir), 0.0);
  col += uSunCol*(1.4*pow(sd, 220.0) + 0.3*pow(sd, 40.0) + 0.12*pow(sd, 8.0))*(0.3 + 0.7*lipK);
  col += vec3(0.5, 0.62, 1.0)*uFlash*exp(-length(p - uFlashPos.xz)/380.0)*(0.3 + 1.1*lump)*(0.6 + 0.6*ao);
  col = mix(col, uHaze.rgb, max(fogK()*uHaze.a, 1.0 - smoothstep(0.0, 2600.0, eF)));                 // toward its far edges the sheet is haze (by night the moon haze of the sky's own horizon, and more of it: no dark band over the horizon)
  gl_FragColor = vec4(col*alpha, alpha);
}
`,mo=`
attribute float aSeed, aW, aK; uniform float uTime; uniform vec2 uLean;
varying vec2 vUv, vXZ; varying float vSeed, vM, vK, vW, vObl, vBroad, vFogDepth;
void main(){
  vUv = uv; vSeed = aSeed; vM = uv.x*aW; vW = aW; vXZ = position.xz; vBroad = smoothstep(2250.0, 2460.0, aW);   // (the broad one is known by its breadth: a squall's heavier, narrower curtains are veils like the rest)
  vec3 p = position; float k = 1.0 - uv.y; k *= sqrt(max(k, 0.0));
  p.xz += uLean*k*(0.8 + 0.4*fract(aSeed*5.3) + 0.06*sin(uTime*0.11 + aSeed*9.0));       // the foot trails downwind of the cloud it fell from
  vec2 nr = position.xz - vec2(0.0, -1000.0), vd = p.xz - cameraPosition.xz;   // the sheet's normal is radial from (0, -1000) (the lean shears it: the same normal); the eye's line is to the LEANED point
  vObl = smoothstep(0.14, 0.55, abs(dot(nr/max(length(nr), 1.0), vd/max(length(vd), 1.0))));   // seen along its own plane a curtain fades out: never a slab on edge
  vK = aK*vObl;
  vec4 mv = modelViewMatrix*vec4(p, 1.0); vFogDepth = -mv.z; gl_Position = projectionMatrix*mv;
}
`,vo=`
uniform float uTime, uFogAmt, uAlpha; uniform vec3 uRain, uRainLit, uRainSun; uniform vec2 uSunAz;
varying vec2 vUv, vXZ; varying float vSeed, vM, vK, vW, vObl, vBroad;
${_e}${Ve}${Pt}${Ma}
void main(){
  float s = vUv.x, v = vUv.y, x = abs(2.0*s - 1.0), fwm = fwidth(vM);
  float wob = n2(vec2(v*2.3 + vSeed*13.0, vSeed*7.0 + uTime*0.015)) - 0.5;                 // the flanks wander as they fall
  float fray = 0.6*n2(vec2(vM/170.0 + vSeed*13.0, 2.0 + uTime*0.01)) + 0.4*mix(n2(vec2(vM/55.0 - vSeed*29.0, 5.0)), 0.5, 0.8*smoothstep(900.0, 1700.0, vFogDepth));   // reaches 50-170 m broad hang lower or higher than their neighbours
  // the shape: full breadth under the cloud, 0.6 of it at the foot, and across it a bell: dense only in its heart, grading
  // away over the outer two thirds (300-900 m), its rim wandering with height
  float hw = 0.9*mix(0.6, 1.0, smoothstep(0.0, 0.62, v));
  float rim = x/hw + 0.34*(n2(vec2(vM/260.0 + vSeed*3.0, v*2.6 + vSeed*5.0)) - 0.5) + 0.16*wob + 0.12*(fray - 0.5);
  float prof = (1.0 - smoothstep(0.08, 1.0, rim))*(1.0 - smoothstep(0.86, 1.0, x));         // (zero at the mesh's own ends, whatever the noise)
  prof *= prof*(3.0 - 2.0*prof);                                                            // (a bell with long soft tails: the broad curtain's, 3 km across)
  // Every other curtain (0.6-2 km across) is a VEIL WITH FEATHERED FLANKS. The bell above, at their breadth, fell from
  // full to nothing inside 60 m where the rim's noise ran with it, and the lower edge (keyed to the same body) fell with
  // it: a pane of slate with a ruled end, seen from the top of the helix. Here the rim wanders half as far over twice
  // the length, the density is the square of ONE smoothstep across the whole half-breadth (a third of the breadth is
  // heart, the rest a feather 200-400 m deep that the sky shows through), and it is nothing well before the mesh ends.
  float rimN = 0.8*x/hw + 0.15*(n2(vec2(vM/520.0 + vSeed*3.0, v*1.3 + vSeed*5.0)) - 0.5) + 0.08*wob + 0.05*(fray - 0.5);
  float pN = (1.0 - smoothstep(0.0, 1.0, rimN))*(1.0 - smoothstep(0.45, 0.95, x));          // (nothing left of it over the last twentieth of the mesh: no seam where a curtain ends)
  prof = mix(pN*pN, prof, vBroad);
  float dens = 0.62 + 0.38*n2(vec2(vM/470.0 + vSeed*17.0, 1.5 + 0.7*v));                  // broad slow change inside it: heavier and lighter reaches, no columns
  float flD = lipFar(vXZ)*vFogDepth;
  float inC = smoothstep(-120.0, 700.0, lipSoft(vXZ) + 300.0*(fray - 0.5))*smoothstep(150.0 + 0.3*flD, 800.0 + 0.5*flD, lipE(vXZ));   // rain falls only from solid cloud, well inside the torn lip and its lit fringe (graded over 650 m and more: no cut end) ...
  inC *= smoothstep(0.0, 1500.0, min(vXZ.y + 5200.0, 3900.0 - vXZ.x*uMX));               // ... and thins where the sheet's far edges melt into haze
  float body = prof*dens*inC;
  // it thins as it falls: all of it under the base, half of it half-way down, a seventh near the sea
  float fall = smoothstep(0.0, 0.9, v);
  float mass = body*mix(mix(0.14, 0.62, vBroad), 1.0, fall*sqrt(fall));                    // (the broad curtain behind the line of sisters stays half as dense to just above the sea: the tubes' lower thirds are ivory on slate too, not pale on pale haze)
  // the lower edge: a deep feather (a quarter to a half of the fall), lower in the curtain's heart, higher on its flanks
  // (virga), and uneven along it at 330, 170 and 55 m
  float vb = max((mix(mix(0.38, 0.52, vBroad), 0.05, smoothstep(mix(0.02, 0.08, vBroad), mix(0.6, 0.7, vBroad), body)) + 0.3*(n2(vec2(vM/330.0 + vSeed*11.0, 3.0)) - 0.5) + 0.26*(fray - 0.5))*mix(1.0, 0.25, vBroad), 0.03);
  float trail = smoothstep(vb - 0.03, vb + mix(0.42, 0.15, vBroad), v);                   // (the broad one's feather is shallower: its foot hangs just above the horizon, still uneven, still soft)
  // fall streaks inside the veil: bundles 70 m, strands 26 m and threads 9 m across (the finest only while they are two
  // pixels and more), slanting a little more than the curtain leans, each fading in and out along its own length
  float fineK = 1.0 - smoothstep(2.0, 6.0, fwm), midK = 1.0 - smoothstep(6.0, 18.0, fwm);
  float sl = vM + 46.0*(1.0 - v);
  float sA = n2(vec2(sl/70.0 + vSeed*5.0, 0.45*v + uTime*0.012)), sB = n2(vec2(sl/26.0 + vSeed*31.0, 1.1*v + uTime*0.03 + vSeed)), sC = n2(vec2(sl/9.0 + vSeed*17.0, 2.3*v + uTime*0.06));
  float str = 0.34*sA + 0.38*mix(0.5, sB, midK) + 0.28*mix(0.5, sC, fineK);
  float stK = 0.28*vObl*vObl*smoothstep(250.0, 700.0, vFogDepth);                          // how much of the veil the streaks may take: none edge-on or close to
  stK *= (0.15 + 0.85*smoothstep(0.42, 0.66, n2(vec2(vM/310.0 + vSeed*7.0, 0.6*v + 3.0 + uTime*0.008))))*mix(1.0, 0.55, smoothstep(1200.0, 1900.0, vFogDepth));   // ... and they hang in bunches 150-300 m across with plain veil between (an even row of them was a comb), fainter in the far curtains
  float veil = mass*trail*mix(1.0, 0.45 + 1.1*smoothstep(0.22, 0.78, str), stK);
  float hiK = smoothstep(150.0, 290.0, cameraPosition.y);
  float top = (1.0 - smoothstep(mix(0.94, 0.8, hiK), 1.0, v + mix(0.05, 0.14, hiK)*(fray - 0.5)))*(1.0 - smoothstep(0.96, 1.0, v));   // the top melts into the base it hangs from (from the helix a little sooner: the far deck is thin haze there)
  float al = min(1.0 - exp(-3.6*veil), 0.9)*top*uAlpha*vK*smoothstep(150.0, 420.0, vFogDepth);
  vec2 dv = vXZ - vec2(0.0, -1000.0); dv /= max(length(dv), 1.0);
  float sunK = 0.5 + 0.5*dot(dv, uSunAz); sunK *= sunK;
  float upK = smoothstep(0.5, 0.95, v);
  vec3 col = mix(uRain*(0.93 + 0.14*str), uRainLit, 0.9*upK);                             // toward its top it takes the base's own tone ...
  col = mix(col, uRainSun, (0.05 + 0.4*sunK)*(0.35 + 0.65*dens)*smoothstep(0.1, 0.45, mass)*(1.0 - 0.6*smoothstep(0.3, 1.0, mass)));   // rain toward the sun (the moon) lets the light through; thin rain takes none: never a bright slit
  col = mix(col, uRainSun, 0.22*(1.0 - smoothstep(0.3, 0.72, str))*stK*(0.4 + 0.6*sunK)*smoothstep(0.1, 0.4, mass));   // between the streaks the veil is a little lighter: depth, not one tone
  float eF = min(vXZ.y + 5200.0, 3900.0 - vXZ.x*uMX);
  col = mix(col, fogColor, max(fogK()*mix(mix(uFogAmt, 0.5, upK), mix(0.9, 0.58, max(hiK, 0.8*vBroad)), smoothstep(1900.0, 3300.0, vFogDepth)), upK*(1.0 - smoothstep(0.0, 2600.0, eF))));   // ... and the base's own share of haze (so it hangs from the deck at its distance, never darker than what it hangs from); the far curtains are paler: they step back
  gl_FragColor = vec4(col*al, al);
}
`,go=`
attribute vec4 iA, iB, iC, iD; uniform float uTime; uniform vec3 uSunDir;
varying vec2 vUv, vC; varying vec3 vLv; varying vec4 vS; varying float vFogDepth;
void main(){
  float a = iB.x + iB.y*uTime;
  vec3 c = iA.xyz + vec3(cos(a), 0.0, sin(a))*iA.w;
  float fr = iC.z > 0.0 ? fract(uTime/max(iC.z, 1.0) + iB.w) : 0.5;
  c.xz += iC.xy*(fr - 0.5)*iC.z;
  c.y += 0.12*iD.w*iB.z*sin(uTime*0.21 + iB.w*40.0);
  vec4 mv = viewMatrix*vec4(c, 1.0);
  float fade = (iC.z > 0.0 ? sin(3.14159*fr) : 1.0)*smoothstep(0.3*iD.y*iB.z, iD.y*iB.z, -mv.z);
  vec2 up = (viewMatrix*vec4(0.0, 1.0, 0.0, 0.0)).xy; float ul = length(up);
  up = ul > 0.05 ? up/ul : vec2(0.0, 1.0);
  vec2 rt = vec2(up.y, -up.x);
  mv.xy += (rt*position.x + up*position.y*iD.x)*iB.z;
  vUv = position.xy*2.0; vS = vec4(iB.w, fade, iC.w, iD.z); vC = c.xz;
  vec3 lv = (viewMatrix*vec4(uSunDir, 0.0)).xyz;
  vLv = vec3(dot(lv.xy, rt), dot(lv.xy, up), lv.z);
  vFogDepth = -mv.z; gl_Position = projectionMatrix*mv;
}
`,wo=`
uniform float uTime, uOpacity, uSoft, uFarMix, uBarK; uniform vec3 uShadeCol, uIndigo, uLip, uRim, uGlowCol; uniform vec4 uBar; uniform vec2 uBarO;
varying vec2 vUv, vC; varying vec3 vLv; varying vec4 vS;
${_e}${Ve}
void main(){
  vec2 p = vUv; float seed = vS.x, lit = vS.z, hang = step(vS.w, -0.5);
  float n = fb3(p*1.6 + seed*37.0 + uTime*0.085);
  float nf = n2(p*4.7 - seed*19.0 - uTime*0.13);
  float nh = n2(p*11.0 + seed*3.0 + uTime*0.05), nh2 = n2(p*9.0 - seed*7.0 + 29.0);
  vec2 pw = p + 0.2*(vec2(n, nf) - 0.5) + 0.05*(vec2(nh, nh2) - 0.5);
  float hs = 0.0, ws = 1e-4, cov = 0.0; vec3 Ns = vec3(0.0, 0.0, 1e-4);
  for (int i = 0; i < 6; i++) {
    float fi = float(i), k = fract(seed*7.31 + fi*0.618);
    float a = fi*1.2566 + seed*40.0 + 0.6*sin(seed*91.0 + fi*2.3) + 0.2*sin(uTime*0.31 + fi*1.9 + seed*9.0);
    float rr = i == 5 ? 0.56 : 0.30 + 0.15*k;
    vec2 c = i == 5 ? vec2(0.0) : vec2(cos(a), sin(a))*(0.53 - 0.12*k);
    vec2 d = (pw - c)/rr; float q = 1.0 - dot(d, d), qq = max(q, 0.0);
    float h = rr*sqrt(qq), w = h*h; w *= w;
    hs += w*h; ws += w; Ns += w*vec3(d, sqrt(qq)); cov = max(cov, q);
  }
  float h = hs/ws;
  float e = cov - 0.5*(1.0 - 1.25*n) - 0.15*(1.0 - nf) - 0.09*(1.0 - nh);
  float al = smoothstep(0.0, mix(0.5, 0.85, uSoft), e)*vS.y*(1.0 - smoothstep(0.8, 1.0, dot(p, p)))*(1.0 - 0.9*hang*smoothstep(-0.15, 0.75, p.y));   // open scud has a soft, thin rim
  vec2 bump = vec2(n2(p*3.1 + seed*5.0 + 11.0), n2(p*3.1 + seed*5.0 + 47.0)) - 0.5;
  vec3 N = normalize(vec3(Ns.xy/ws + 0.8*bump + 0.45*(vec2(nh, nh2) - 0.5), Ns.z/ws + 0.25));
  vec3 L = normalize(vLv + vec3(0.0, 1e-4, 0.0));
  float wrap = clamp(dot(N, L)*0.62 + 0.38, 0.0, 1.0);
  float ao = smoothstep(0.02, 0.4, h);
  float lk = min(lit, 1.0);
  vec3 dark = uIndigo*(0.72 + 0.4*n)*(0.6 + 0.4*ao)*mix(0.6, 1.0, smoothstep(0.0, 0.45, lk)) + uShadeCol*(0.02 + 0.07*lk);   // open scud is no darker than the base; the hollow is
  vec3 col = mix(dark, uLip*vec3(1.04, 0.88, 0.68)*(0.7 + 0.3*n), pow(wrap, 3.0 - 1.4*lk)*lk*(0.4 + 0.6*ao));   // sheltered cloud takes the sun on its crowns only
  float lxy = max(length(L.xy), 0.05), nxy = max(length(N.xy), 0.05);
  float rim = 1.0 - N.z; rim *= rim;
  float thin = 1.0 - smoothstep(0.05, 0.6, e);
  col += uRim*(rim + 0.5*thin)*clamp(dot(N.xy, L.xy)/(lxy*nxy)*0.8 + 0.35, 0.0, 1.0)*(0.12 + 1.4*lk)*smoothstep(-0.3, 0.2, L.z);   // gold rim on the sun side
  float back = clamp(-L.z, 0.0, 1.0);
  col = mix(col, uLip*1.05, back*back*(0.4*(1.0 - 0.8*hang) + 0.4*thin*thin*(0.4 + 1.2*n))*min(1.0, lit*2.2));   // against the sun it glows through                // silver lining when the sun is behind it
  col = mix(col, uIndigo*(0.74 + 0.1*n), 0.5*hang*smoothstep(-0.2, 0.6, p.y));               // a hanging rag has no top: it dissolves upward into the base it hangs from
  col += uGlowCol*max(vS.w, 0.0)*(0.35 + 0.65*ao)*(0.4 + 0.6*N.z);                         // the lantern's light on the grotto
  float bt = (dot(vC - uBarO, uBar.xy) - uBar.z - 22.0*sin(uTime*0.17))/max(uBar.w, 1.0);   // the bar of sun that lies across the mouth of the portal's bay (the same bar as on the bay itself)
  col += uRim*uBarK*exp(-bt*bt)*(0.25 + 0.75*wrap)*(0.45 + 0.55*ao)*(1.0 - 0.7*hang*smoothstep(-0.2, 0.6, p.y));
  float farK = uFarMix*smoothstep(250.0, 1100.0, vFogDepth);                               // (the grotto and its rags) from the entry they are a lowered bay of the same cloud:
  col = mix(col, uIndigo*(1.15 + 0.2*n) + uLip*0.14, 0.7*farK);                             // the base's own tone, and half the weight
  col = mix(col, fogColor, fogK()*0.5);
  gl_FragColor = vec4(col*al, al)*(uOpacity*(1.0 - 0.5*farK));
}
`,yo=`
varying vec2 vP;
void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }
`,xo=`
uniform vec3 uCol; uniform float uTime, uR, uFar, uVis; varying vec2 vP;
${Ve}
void main(){
  float rl = length(vP), r = rl/uR;
  vec2 dir = vP/max(rl, 1e-3);
  float ray = 0.78 + 0.22*n2(dir*2.6 + uTime*0.5) + 0.07*sin(uTime*1.7) + 0.05*sin(uTime*3.1 + r*4.0);
  float core = 1.0 - smoothstep(0.15, 1.12, r);
  float halo = exp(-max(r - 1.0, 0.0)*1.15)*smoothstep(0.7, 1.02, r), wide = 0.16*exp(-max(r - 1.0, 0.0)*0.5);
  float a = (0.95*core*uFar + halo*(0.5 + 0.4*uFar) + wide)*ray*uVis*(1.0 - smoothstep(2.8, 3.6, r));
  gl_FragColor = vec4(uCol*a, 1.0);
}
`,bo=`
attribute vec3 aCol; attribute vec2 aW; attribute vec4 iA, iB, iC;
uniform float uTime, uTb, uPx, uEscWide; uniform vec3 uShip, uEscC, uEscF; uniform vec4 uEscK, uEscW; uniform vec2 uFlap;
varying vec3 vN, vCol, vLocal, vWP; varying float vFogDepth;
void main(){
  float mode = iC.x, seed = iB.w;
  float tt = mode < 0.5 ? (uTb - iC.y) : uTime;
  float a = iB.x + iB.y*tt;
  vec3 c = iA.xyz; float fold = 0.0, amp = uFlap.x;
  float hgt = c.y + 1.2*sin(uTime*0.5 + seed*30.0);
  if (mode > 1.5) {
    c.xz += uShip.xz;
    float ph = fract(uTime/9.0 + seed), dive = smoothstep(0.62, 0.74, ph), up = smoothstep(0.80, 1.0, ph);   // (each on its own nine-second round of the clock: circle, fold, plunge, climb away)
    hgt = c.y*(1.0 - dive + up) - 2.5*dive*(1.0 - up);
    fold = dive*(1.0 - smoothstep(0.76, 0.84, ph)); amp = mix(max(amp, 0.25), 0.75, up*(1.0 - up)*4.0);
  }
  vec3 pos = vec3(c.x + cos(a)*iA.w, hgt, c.z + sin(a)*iA.w);
  float sg = iB.y < 0.0 ? -1.0 : 1.0;
  vec3 f = normalize(mix(vec3(-sin(a), 0.0, cos(a))*sg, vec3(0.0, -1.0, 0.0), 0.88*fold));
  float esc = step(2.5, mode), outer = esc*abs(iC.y), sideE = mix(uEscK.y, -sign(iC.y), outer);   // (an outer escort peels to its own side)
  float pk = mix(uEscK.x, uEscW.y, outer)*esc, open = outer*uEscW.x;
  if (mode > 2.5) {                                                    // escorts: they hold station ahead of the wing round the last of the helix, weaving, then peel away outward and down
    vec3 de = normalize(uEscF + vec3(0.0, 0.0, 1e-5)), sde = normalize(cross(de, vec3(0.0, 1.0, 0.0)));
    float wv = uTime*0.5 + seed*30.0, pq = pk*pk;
    pos = uEscC + de*(iA.x - mix(uEscK.w, uEscW.w, outer)) + sde*(iA.y + sign(iC.y)*uEscWide*open + iA.w*sin(wv) - sideE*(55.0 + 50.0*seed)*pq) + vec3(0.0, iA.z + 0.3*iA.w*sin(wv*0.63 + 1.0) - (12.0 + 22.0*seed)*pq, 0.0);
    f = normalize(vec3(de.x, 0.0, de.z)/max(length(de.xz), 1e-3) + sde*(0.22*cos(wv) - sideE*1.3*pk*(1.0 - 0.5*pk)) + vec3(0.0, 0.08 - 0.35*pk*(1.0 - 0.5*pk), 0.0)); sg = 1.0;   // level in the inflow that lifts them: we see the whole planform, not a wing on edge
  }
  vec3 r = normalize(cross(f, vec3(0.0, 1.0, 0.0))), u = cross(r, f);
  float bk = iC.z*sg*(1.0 - open) + 0.16*sin(uTime*0.9 + seed*40.0) + 0.07*sin(uTime*2.3 + seed*17.0) + sideE*0.6*pk*(1.0 - 0.5*pk);   // (on the last straight the outer two level their wings)
  vec3 r2 = r*cos(bk) + u*sin(bk), u2 = cross(r2, f);
  vec3 lp = position; vec3 ln = normal;
  if (aW.x > 0.5) {
    float sx = abs(lp.x), w = uTime*uFlap.y*6.2832 + seed*20.0;
    // (escorts carry their wings in a deep M: from astern a bird, not a stroke)
    float th = 0.12 + 0.22*esc + amp*sin(w), th2 = -0.22 - 0.3*esc + amp*sin(w - 0.9);
    lp.y += sin(th)*min(sx, 0.45) + sin(th2)*max(sx - 0.45, 0.0);
    lp.z += fold*sx*sx*1.5; lp.x *= mix(1.0, 0.58, fold);                 // the dive: wings half closed and swept back to an arrowhead (a bird at any angle; narrower, it was a lozenge)
    // a wing seen on edge is never a hairline: the mid-chord row lifts and the edges drop until it is 1.5 px thick
    lp.y += (position.y > 0.016 ? 1.0 : -1.0)*min(0.75*uPx*distance(pos, cameraPosition)/max(iB.z, 0.1), 0.09);
  }
  float seen = (mode > 0.5 && mode < 1.5) ? 1.0 - smoothstep(55.0, 95.0, cameraPosition.y - pos.y) : 1.0 - mix(uEscK.z, uEscW.z, outer)*esc;   // one of the free stack 60-100 m and more below the eye is a pale smudge on the spray: it folds away as we climb past it
  vec3 wp = pos + iB.z*seen*(r2*lp.x + u2*lp.y - f*lp.z);
  vN = normalize(r2*ln.x + u2*ln.y - f*ln.z);
  vCol = mix(aCol, vec3(0.78, 0.76, 0.7), iC.w*aW.y);
  if (mode > 1.5 && mode < 2.5) vCol = mix(vCol, vec3(0.05, 0.05, 0.06), smoothstep(0.5, 0.9, abs(position.x))*aW.x);   // the divers' dark wingtips
  vLocal = position; vWP = wp;
  vec4 mv = viewMatrix*vec4(wp, 1.0); vFogDepth = -mv.z; gl_Position = projectionMatrix*mv;
}
`,Dt=`
uniform vec3 uSunDir, uSunCol, uShadeCol, uBounce; uniform float uKey; varying vec3 vWP;
${_e}
vec3 faceN(vec3 n){ vec3 N = normalize(n); return dot(N, vWP - cameraPosition) > 0.0 ? -N : N; }
vec3 litCol(vec3 alb, vec3 N, float two){
  float df = max(dot(N, uSunDir), 0.0);
  float lt = mix(df, 0.3 + 0.7*abs(dot(N, uSunDir)), two);
  return alb*(uSunCol*uKey*lt + uShadeCol*(0.5 + 0.25*N.y) + uBounce*max(-N.y, 0.0)*0.7*exp(-max(vWP.y, 0.0)/120.0));   // the sea's turquoise bounce dies out with height: birds under the base stay dark
}
`,ko=`
varying vec3 vN, vCol, vLocal;
${Dt}
void main(){
  vec3 N = faceN(vN);
  float barb = 0.96 + 0.04*sin(vLocal.x*70.0 + vLocal.z*18.0);                       // (stronger, a folded wing seen from above was a striped slab)
  vec3 col = litCol(vCol*barb, N, 0.0);
  col += uSunCol*uKey*0.16*pow(max(dot(N, normalize(uSunDir + vec3(0.0, 1.0, 0.0))), 0.0), 12.0);
  gl_FragColor = vec4(mix(col, fogColor, fogK()), 1.0);
}
`,Ta=`
attribute vec4 iA, iB; uniform float uTime, uTb, uSeaY;
vec3 fishPos(out float on, out float hop, out float pitch){
  float tau = uTb - iB.x, seed = iB.w, life = 2.4 + seed*0.9;
  float Ts = 0.8 + 0.5*fract(seed*7.3);
  float ph = 3.14159*tau/Ts;
  hop = abs(sin(ph));
  float env = step(0.0, tau)*step(tau, life)*smoothstep(0.0, 0.16, tau)*(1.0 - smoothstep(life - 0.22, life, tau));
  on = env;
  pitch = 0.4*cos(ph)*(sin(ph) < 0.0 ? -1.0 : 1.0);
  vec2 xz = iA.xy + iA.zw*iB.y*max(tau, 0.0) + vec2(-iA.w, iA.z)*0.7*sin(tau*2.1 + seed*30.0);
  return vec3(xz.x, uSeaY - 0.9 + env*(1.05 + (0.5 + 1.4*fract(seed*3.1))*pow(hop, 0.7)), xz.y);
}
`,So=`
attribute vec3 aCol; attribute vec2 aW;
varying vec3 vN, vCol, vWP; varying float vGl, vFogDepth;
${Ta}
void main(){
  float on, hop, pitch; vec3 pos = fishPos(on, hop, pitch);
  vec3 f = normalize(vec3(iA.z*cos(pitch), sin(pitch), iA.w*cos(pitch)));
  vec3 r = normalize(cross(f, vec3(0.0, 1.0, 0.0))), u = cross(r, f);
  vec3 lp = position;
  lp.y += aW.x*abs(lp.x)*(0.22 + 0.16*sin(uTime*44.0 + iB.w*50.0));
  lp.x += (1.0 - aW.x)*0.05*sin(uTime*30.0 + lp.z*9.0 + iB.w*20.0)*smoothstep(-0.1, 0.5, lp.z);
  vec3 wp = pos + iB.z*on*(r*lp.x + u*lp.y - f*lp.z);
  vN = normalize(r*normal.x + u*normal.y - f*normal.z);
  vCol = aCol; vWP = wp; vGl = (0.25 + 0.75*aW.x)*pow(0.5 + 0.5*sin(uTime*23.0 + iB.w*90.0 + lp.x*3.0), 4.0);
  vec4 mv = viewMatrix*vec4(wp, 1.0); vFogDepth = -mv.z; gl_Position = projectionMatrix*mv;
}
`,zo=`
varying vec3 vN, vCol; varying float vGl;
${Dt}
void main(){
  vec3 N = faceN(vN);
  vec3 col = litCol(vCol, N, 0.6) + uSunCol*uKey*0.9*vGl;
  gl_FragColor = vec4(mix(col, fogColor, fogK()), 1.0);
}
`,Ao=`
uniform float uPx;
varying vec2 vUv; varying float vA, vSd, vFogDepth;
${Ta}
void main(){
  float on, hop, pitch; vec3 pos = fishPos(on, hop, pitch);
  float dd = distance(pos, cameraPosition);
  float w = max(0.42*iB.z, 1.3*uPx*dd), len = 2.6 + 0.8*fract(iB.w*11.0);
  vec2 xz = pos.xz - iA.zw*(position.y*len) + vec2(-iA.w, iA.z)*position.x*w;
  vUv = position.xy; vSd = iB.w; vA = on*(0.3 + 0.7*pow(1.0 - hop, 1.2))*min(1.0, 0.42*iB.z/max(1.3*uPx*dd, 1e-4));
  vec4 mv = viewMatrix*vec4(xz.x, uSeaY + 0.12, xz.y, 1.0); vFogDepth = -mv.z; gl_Position = projectionMatrix*mv;
}
`,Co=`
uniform vec3 uFoamLit; varying vec2 vUv; varying float vA, vSd;
${_e}
float mark(vec2 q, float yc, float ly, float wx){ vec2 d = vec2(q.x/wx, (q.y - yc)/ly); return 1.0 - smoothstep(0.35, 1.0, dot(d, d)); }
void main(){
  // two or three splash marks where the tail last struck, each smaller than the one before: not a dashed line
  float j1 = fract(vSd*7.3), j2 = fract(vSd*13.7), j3 = fract(vSd*23.1);
  vec2 q = vec2(vUv.x + 0.1*(j2 - 0.5), vUv.y);
  float m = mark(q, 0.10 + 0.07*j1, 0.11, 0.42) + 0.8*mark(q + vec2(0.12*(j1 - 0.5), 0.0), 0.42 + 0.14*j2, 0.085, 0.30) + 0.6*step(0.35, j3)*mark(q - vec2(0.14*(j3 - 0.5), 0.0), 0.76 + 0.12*j3, 0.06, 0.2);
  float al = vA*min(m, 1.0)*0.8*(1.0 - fogK());
  gl_FragColor = vec4(uFoamLit*al, al);
}
`,Mo=`
attribute vec3 aCol; attribute vec4 aLine; attribute vec2 aFlex;
uniform float uTime, uPx;
varying vec3 vN, vCol, vWP, vLp; varying float vTwo, vRope, vFogDepth;
void main(){
  vLp = position; vRope = 0.0;
  vec3 lp = position + normal*aFlex.x*(0.5*sin(uTime*4.2 + aFlex.y + position.y*0.55) + 0.2*sin(uTime*7.1 + aFlex.y*1.7));
  vec4 wp = modelMatrix*vec4(lp, 1.0);
  if (abs(aLine.w) > 0.0) {
    vec3 tw = normalize(mat3(modelMatrix)*aLine.xyz);
    vec3 vd = wp.xyz - cameraPosition; float dd = max(length(vd), 1e-3);
    vec3 sd = cross(tw, vd/dd); float sl = length(sd);
    sd = sl > 1e-4 ? sd/sl : vec3(0.0, 1.0, 0.0);
    float farR = smoothstep(90.0, 170.0, dd);                                      // far off a rope is half a pixel of tan, not a black bar
    wp.xyz += sd*(aLine.w < 0.0 ? -1.0 : 1.0)*max(abs(aLine.w), mix(0.8, 0.5, farR)*uPx*dd);
    vRope = 1.0 + farR;
  }
  vN = normalize(mat3(modelMatrix)*normal); vCol = aCol; vTwo = step(0.001, aFlex.x); vWP = wp.xyz;
  vec4 mv = viewMatrix*wp; vFogDepth = -mv.z; gl_Position = projectionMatrix*mv;
}
`,Fo=`
varying vec3 vN, vCol, vLp; varying float vTwo, vRope; uniform vec3 uSailFar;
${Dt}${Ve}
void main(){
  vec3 N = faceN(vN);
  vec3 col = litCol(vCol, N, 0.0);
  if (vRope > 0.5) {                                                                 // rigging: fine tan line that takes the low sun whatever way its ribbon faces, and melts into what lies behind it far off
    col = vCol*(uSunCol*uKey*0.55 + uShadeCol*0.6);
    col = mix(col, mix(uSailFar, fogColor, 0.45), 0.6*clamp(vRope - 1.0, 0.0, 1.0));
  }
  if (vTwo > 0.5) {
    float hgt = smoothstep(2.0, 23.0, vLp.y);
    float blot = n2(vLp.zy*0.3 + 3.0), grain = n2(vLp.zy*vec2(2.3, 0.7) + 11.0);
    float seam = 0.5 + 0.5*sin(vLp.z*5.2 + 0.25*vLp.y + 1.5*blot);
    float reef = 1.0 - 0.2*smoothstep(0.84, 0.92, abs(fract(vLp.y*0.21 + 0.03*sin(vLp.z*1.3)) - 0.5)*2.0);   // reef bands
    vec3 alb = vCol*(0.56 + 0.46*hgt)*(0.7 + 0.5*blot)*(0.92 + 0.14*grain)*(1.0 - 0.22*smoothstep(0.84, 0.99, seam))*mix(1.0, reef, smoothstep(0.0, 0.3, hgt)*(1.0 - smoothstep(0.5, 0.8, hgt)));
    alb = mix(alb, vec3(dot(alb, vec3(0.3, 0.55, 0.15)))*vec3(1.18, 0.93, 0.7), 0.36);
    float ndl = dot(N, uSunDir), thru = max(-ndl, 0.0);
    float lt = 0.22 + 0.66*max(ndl, 0.0) + 0.9*thru*(0.75 + 0.5*blot);
    col = alb*(uSunCol*uKey*lt*mix(vec3(1.0), vec3(1.14, 0.84, 0.6), smoothstep(0.0, 0.35, thru)) + uShadeCol*(0.5 + 0.25*N.y) + uBounce*max(-N.y, 0.0)*0.7);
  }
  gl_FragColor = vec4(mix(col, fogColor, fogK()), 1.0);
}
`,To=`
varying vec2 vUv; varying vec3 vW; varying float vFogDepth;
void main(){ vUv = uv; vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz; vec4 mv = viewMatrix*wp; vFogDepth = -mv.z; gl_Position = projectionMatrix*mv; }
`,Lo=`
uniform float uTime, uLen, uBeam, uPhosK; uniform vec3 uFoam, uPhos;
varying vec2 vUv; varying vec3 vW;
${_e}${Ve}
void main(){
  float sx = vUv.x, x = abs(sx), m = vUv.y, mp = max(m, 0.0);
  float hw = uBeam*0.8 + 0.3*mp, xs = sx*hw, xm = abs(xs);                     // metres off the centre line
  float nearK = 1.0 - smoothstep(0.3, 1.6, length(fwidth(vW.xz)));
  float nz = fb3(vec2(xs*0.2, m*0.045 - uTime*0.22) + 3.0);                    // billows 5 m across, 20 m long
  float nz2 = fb3(vec2(xs*0.5 + 7.0, m*0.13 - uTime*0.5));                     // streaks 2 m across, 8 m long
  float mrb = 0.55*nz2 + 0.45*fb3(vW.xz*0.42 + uTime*vec2(0.06, 0.04));
  float marb = smoothstep(0.24, 0.76, mrb), marbT = smoothstep(0.42, 0.78, mrb);   // marbT: the track's tighter marbling, so it thins and holes astern
  // the two bow-wave crests and their inward feather of wavelets
  float curl = n2(vec2(m*0.1 - uTime*0.55, 3.0 + 4.0*step(0.0, sx)));                  // each arm curls on its own after about 40 m
  float xc = 0.9 + 0.27*mp + 2.5*(nz - 0.5)*smoothstep(8.0, 60.0, mp) + 3.4*(curl - 0.5)*smoothstep(0.875*uLen, 2.34375*uLen, mp), cwd = 0.75 + 0.011*mp;
  float fwW = length(fwidth(vW.xz)), cw2 = max(cwd, 0.8*fwW);                  // (a crest is never drawn thinner than the pixel it falls in: the V holds 300 m off, fainter)
  float dx = (xm - xc)/cw2;
  float crest = exp(-dx*dx)*(0.62 + 0.5*nz2)*sqrt(cwd/cw2);
  crest *= mix(1.0, smoothstep(0.36, 0.6, n2(vec2(m*0.3 - uTime*1.5, xs*0.7) + 5.0)), smoothstep(0.8125*uLen, 2.1875*uLen, mp));   // thin crests that break into dashes astern (from 26 m behind the schooner, 13 m behind a skiff)
  float wav = 0.5 + 0.5*sin(0.9*(m - 2.6*xm) - uTime*3.0 + 4.0*nz);
  float feather = smoothstep(0.42*xc, xc, xm)*(1.0 - smoothstep(xc, xc + 2.2*cwd, xm));
  float decay = 0.1 + 0.9*exp(-mp/(uLen*2.4));
  float armK = (crest + feather*(0.16 + 0.62*wav*wav*marb))*decay;
  // the track astern: aerated water boiling up behind the counter, marbled, widening slowly
  float tw = uBeam*(0.5 + 0.007*mp), aft = max(m - uLen, 0.0);
  float track = (1.0 - smoothstep(0.3*tw, tw, xm + 0.5*tw*(nz - 0.5)))*smoothstep(uLen*0.5, uLen*0.92, m);
  float trackK = track*(0.06 + 0.94*marbT)*(0.42 + 0.58*exp(-aft/18.0))*exp(-aft/(uLen*2.3))*1.25;
  // foam sliding down her sides, and the bone in her teeth
  float side = (1.0 - smoothstep(0.5*uBeam, 0.5*uBeam + 2.2 + 2.0*nz2, xm))*smoothstep(0.0, 6.0, m)*(1.0 - smoothstep(uLen*0.5, uLen*1.0, m))*(0.35 + 0.65*marb);
  float bone = exp(-(m - 2.0)*(m - 2.0)/(uLen*0.9))*(1.0 - smoothstep(0.6, 3.4 + 0.3*mp, xm))*(0.75 + 0.25*nz2)*(0.8 + 0.2*sin(uTime*0.9 + 0.5))*smoothstep(-3.0, -0.5, m);
  float f = (armK + trackK + 0.7*side)*smoothstep(-2.0, 2.5, m) + bone;
  f *= mix(1.0, 0.6 + 0.6*marb, 0.5*nearK*(1.0 - bone));
  float endK = 1.0 - smoothstep(uLen*3.8, uLen*5.1, m + 0.3*uLen*(nz - 0.5));
  float al = clamp(f, 0.0, 0.93)*endK*(1.0 - smoothstep(0.9, 1.0, x));
  vec3 tint = mix(vec3(0.5, 0.86, 0.8), vec3(1.0), smoothstep(0.18, 0.6, f));    // thin foam is aerated green water
  vec3 col = (uFoam*tint*(0.9 + 0.18*nz2) + uPhos*uPhosK*(0.6 + 1.0*nz2)*smoothstep(0.3, 0.85, f))*al;   // by night the fire burns in the cores of the foam
  gl_FragColor = vec4(mix(col, fogColor*al, fogK()), al);
}
`,Bo=`
attribute vec4 iS; uniform float uTime, uPh, uLen; uniform vec3 uSunDir;
varying vec2 vUv; varying vec3 vK; varying vec2 vL; varying float vFogDepth;
void main(){
  float sd = iS.x, a = fract(sd*7.31), b = fract(sd*13.7), c = fract(sd*29.3);
  float ks = sqrt(clamp(uLen/32.0, 0.25, 1.0));                                  // a 16 m skiff throws her spray 4 m, not over her yard
  float vy = (6.5 + 6.0*iS.z)*ks, T = 2.0*vy/9.8 + 0.25;
  float cyc = uTime/T + sd*5.0, t = fract(cyc), tt = t*T;
  float seq = floor(cyc); a = fract(a + 0.37*seq); b = fract(b + 0.61*seq);
  float arg = (uTime - tt)*0.9 + uPh;                                           // the pitch at the moment this drop left the stem
  float env = 0.42 + 0.58*smoothstep(-0.5, 0.8, -sin(arg + 0.5));
  vec3 p = vec3(iS.y*(0.4 + 0.9*a), 0.5, -0.5*uLen + 0.6 + 2.6*b);
  p += vec3(iS.y*(1.6 + 3.2*a)*(0.5 + 0.5*iS.z), vy, 1.2 + 3.6*c - 1.5*iS.z)*tt;
  p.x += iS.y*0.6*tt*tt; p.y -= 4.9*tt*tt; p.z += 1.1*tt*tt;                    // falls, and the wind carries it aft and to leeward
  p.y = max(p.y, 0.25);
  float size = iS.w*(0.55 + 1.9*t)*(0.7 + 0.5*env);
  vec4 mv = modelViewMatrix*vec4(p, 1.0);
  mv.xy += position.xy*size;
  vUv = position.xy*2.0;
  vK = vec3(env*smoothstep(0.0, 0.07, t)*pow(1.0 - t, 1.3), sd, t);
  vL = normalize((viewMatrix*vec4(uSunDir, 0.0)).xy + vec2(1e-4, 0.0));
  vFogDepth = -mv.z; gl_Position = projectionMatrix*mv;
}
`,Po=`
uniform float uTime, uPhosK; uniform vec3 uFoam, uSunCol, uShade, uPhos;
varying vec2 vUv; varying vec3 vK; varying vec2 vL;
${_e}${Ve}
void main(){
  float r = length(vUv);
  float n = n2(vUv*2.3 + vK.y*37.0 + vec2(0.0, -uTime*0.8)), nf = n2(vUv*6.5 - vK.y*19.0 + uTime*0.6);
  float body = (1.0 - smoothstep(0.15, 0.95, r + 0.45*(n - 0.5) + 0.2*(nf - 0.5)));
  float drops = smoothstep(0.62, 0.86, nf)*(1.0 - smoothstep(0.5, 1.0, r))*vK.z;          // it breaks into drops as it falls
  float al = clamp(body*(0.5 + 0.5*n)*mix(1.0, 0.55, vK.z) + 0.7*drops, 0.0, 1.0)*vK.x*0.8*(1.0 - smoothstep(0.92, 1.0, r));
  float sun = clamp(0.55 + 0.6*dot(vUv, vL), 0.0, 1.0);                                     // the low sun catches the side toward it
  vec3 col = mix(uShade, uFoam, 0.35 + 0.65*sun) + uSunCol*0.3*sun*sun*(0.4 + 0.6*n) + uPhos*uPhosK*(0.5 + 0.8*nf);
  gl_FragColor = vec4(mix(col, fogColor, fogK())*al, al);
}
`;function Do(i){const D=[],te=[],N=[],E=[],v=[],j=i==="frigate"?[.035,.035,.045]:i==="booby"?[.1,.075,.055]:[.62,.64,.66],X=i==="frigate"?[.11,.09,.08]:[.74,.73,.69],ue=i==="frigate"?[.02,.02,.03]:[.05,.05,.06],ee=(r,k,a,p,y,S,Z)=>(D.push(r,k,a),te.push(p[0],p[1],p[2]),N.push(y[0],y[1],y[2]),E.push(S,Z),D.length/3-1),pe=i==="frigate"?[[-.5,.004,0],[-.4,.016,0],[-.33,.04,0],[-.24,.05,.01],[-.1,.075,-.012],[.08,.07,-.01],[.26,.04,0],[.4,.014,0]]:[[-.42,.004,0],[-.33,.02,0],[-.27,.05,0],[-.2,.06,.008],[-.06,.1,-.015],[.12,.095,-.012],[.3,.05,0],[.44,.012,0]],J=6,me=[];for(let r=0;r<pe.length;r++){const[k,a,p]=pe[r],y=[];for(let S=0;S<J;S++){const Z=S/J*Math.PI*2,le=Math.cos(Z),he=Math.sin(Z),c0=r<2,Pe=he<-.3&&r>=3&&r<=5,ge=c0?i==="frigate"?[.3,.3,.33]:[.75,.6,.2]:i==="frigate"?Pe&&r===3?[.5,.05,.04]:j:i==="booby"&&r>5?j:X;y.push(ee(le*a*.85,he*a+p,k,[le,he,0],ge,0,Pe?1:0))}me.push(y)}for(let r=0;r<pe.length-1;r++)for(let k=0;k<J;k++){const a=me[r][k],p=me[r][(k+1)%J],y=me[r+1][k],S=me[r+1][(k+1)%J];v.push(a,y,p,p,y,S)}const ve=i==="frigate"?[[.05,-.17,.1],[.25,-.235,.05],[.45,-.27,-.02],[.72,-.1,.07],[1,.16,.19]]:[[.06,-.15,.1],[.3,-.19,.08],[.5,-.2,.04],[.78,-.1,.08],[1,.04,.07]];for(const r of[-1,1]){const k=ve.map(([a,p,y],S)=>{const Z=Se(p,y,.45),le=S<3?X:j,he=S>=3?ue:j;return[ee(r*a,.012,p,[0,1,0],i==="frigate"?j:he,1,0),ee(r*a,.02,Z,[0,1,0],i==="frigate"?le:S>=3?ue:X,1,0),ee(r*a,0,y,[0,1,0],he,1,0)]});for(let a=0;a<k.length-1;a++)for(let p=0;p<2;p++)v.push(k[a][p],k[a+1][p],k[a][p+1],k[a][p+1],k[a+1][p],k[a+1][p+1])}if(i==="frigate")for(const r of[-1,1]){const k=ee(r*.012,0,.36,[0,1,0],j,0,0),a=ee(r*.05,0,.38,[0,1,0],j,0,0),p=ee(r*.15,0,.98,[0,1,0],ue,0,0);v.push(k,a,p)}else{const r=ee(-.035,0,.4,[0,1,0],j,0,0),k=ee(.035,0,.4,[0,1,0],j,0,0),a=ee(0,0,i==="tern"?.78:.66,[0,1,0],ue,0,0);v.push(r,k,a)}const ae=new n.BufferGeometry;return ae.setAttribute("position",new n.Float32BufferAttribute(D,3)),ae.setAttribute("normal",new n.Float32BufferAttribute(te,3)),ae.setAttribute("aCol",new n.Float32BufferAttribute(N,3)),ae.setAttribute("aW",new n.Float32BufferAttribute(E,2)),ae.setIndex(v),ae}function Ko(){const i=[],D=[],te=[],N=[],E=[],v=(r,k,a,p,y,S)=>(i.push(r,k,a),D.push(p[0],p[1],p[2]),te.push(y[0],y[1],y[2]),N.push(S,0),i.length/3-1),j=[[-.5,.004],[-.4,.06],[-.18,.1],[.12,.08],[.38,.026]],X=[];for(const[r,k]of j){const a=[];for(let p=0;p<5;p++){const y=p/5*Math.PI*2+.3,S=Math.cos(y),Z=Math.sin(y);a.push(v(S*k*.75,Z*k,r,[S,Z,0],Z>.2?[.12,.24,.4]:[.8,.82,.82],0))}X.push(a)}for(let r=0;r<j.length-1;r++)for(let k=0;k<5;k++){const a=X[r][k],p=X[r][(k+1)%5],y=X[r+1][k],S=X[r+1][(k+1)%5];E.push(a,y,p,p,y,S)}const ue=[.34,.46,.58],ee=[.18,.3,.44];for(const r of[-1,1]){const k=v(r*.05,.02,-.26,[0,1,0],ue,1),a=v(r*.44,.02,.08,[0,1,0],ee,1),p=v(r*.34,.02,.22,[0,1,0],ee,1),y=v(r*.05,.02,-.06,[0,1,0],ue,1);E.push(k,a,p,k,p,y);const S=v(r*.03,0,.12,[0,1,0],ue,1),Z=v(r*.26,0,.3,[0,1,0],ee,1),le=v(r*.03,0,.26,[0,1,0],ue,1);E.push(S,Z,le)}const pe=v(0,0,.36,[1,0,0],[.2,.3,.44],0),J=v(0,.13,.56,[1,0,0],[.2,.3,.44],0),me=v(0,0,.46,[1,0,0],[.2,.3,.44],0),ve=v(0,-.2,.6,[1,0,0],[.2,.3,.44],0);E.push(pe,J,me,pe,me,ve);const ae=new n.BufferGeometry;return ae.setAttribute("position",new n.Float32BufferAttribute(i,3)),ae.setAttribute("normal",new n.Float32BufferAttribute(D,3)),ae.setAttribute("aCol",new n.Float32BufferAttribute(te,3)),ae.setAttribute("aW",new n.Float32BufferAttribute(N,2)),ae.setIndex(E),ae}function La(i,D,te){const N=i==="schooner"?{L:32,B:6.6,masts:[[-5.5,27,9.5],[4.5,30,12]],sails:!0,sprit:!0}:i==="ketch"?{L:26,B:6,masts:[[-3.5,27,9],[8,17,6]],sails:!1,sprit:!0}:{L:16,B:4.4,masts:[[-1.8,16.5,9]],sails:!0,sprit:!1},E=N.L,v=Math.pow(E/32,.7),j=[],X=[],ue=[],ee=[],pe=[],J=[],me=g(),ve=g(),ae=g(),r=g(),k=g(),a=g(),p=g(0,1,0),y=(c,u,w,M,F)=>(j.push(c.x,c.y,c.z),X.push(u.x,u.y,u.z),ue.push(w.r,w.g,w.b),M?ee.push(M[0],M[1],M[2],M[3]):ee.push(0,0,0,0),F?pe.push(F[0],F[1]):pe.push(0,0),j.length/3-1),S=(c,u,w,M,F,$)=>{const re=j.length/3,G=.002;for(let W=0;W<=u;W++)for(let U=0;U<=c;U++){const q=U/c,H=W/u;$?$(q,H,a):(w(Math.min(q+G,1),H,ve),w(Math.max(q-G,0),H,ae),w(q,Math.min(H+G,1),r),w(q,Math.max(H-G,0),k),a.crossVectors(ve.sub(ae),r.sub(k))),a.lengthSq()<1e-12?a.set(0,1,0):a.normalize(),w(q,H,me),y(me,a,M(q,H),null,F?F(q,H):null)}for(let W=0;W<u;W++)for(let U=0;U<c;U++){const q=re+W*(c+1)+U,H=q+1,ce=q+c+1,se=ce+1;J.push(q,H,ce,H,se,ce)}},Z=(c,u,w,M,F,$=6)=>{const re=new n.Vector3().subVectors(u,c),G=re.clone().normalize(),W=new n.Vector3().crossVectors(G,Math.abs(G.y)>.9?g(1,0,0):p).normalize(),U=new n.Vector3().crossVectors(G,W);S($,1,(q,H,ce)=>{const se=q*Math.PI*2,$e=Se(w,M,H);return ce.copy(c).addScaledVector(re,H).addScaledVector(W,Math.cos(se)*$e).addScaledVector(U,Math.sin(se)*$e)},()=>F,null,(q,H,ce)=>{const se=q*Math.PI*2;return ce.set(0,0,0).addScaledVector(W,Math.cos(se)).addScaledVector(U,Math.sin(se))})},le=(c,u,w,M)=>{const F=new n.Vector3().subVectors(u,c).normalize(),$=w/2,re=y(c,p,M,[F.x,F.y,F.z,$]),G=y(c,p,M,[F.x,F.y,F.z,-$]),W=y(u,p,M,[F.x,F.y,F.z,$]),U=y(u,p,M,[F.x,F.y,F.z,-$]);J.push(re,G,W,G,U,W)},he=l("#d9d2c0"),c0=l("#7a2418"),Pe=l("#ece8dc"),ge=l("#3a2a1c"),Ae=l("#a88a5e"),Oe=l("#8a6f48"),We=l("#b08a52"),de=l("#b39f78"),e0=l("#e4dccb"),t0=D.clone().multiplyScalar(.95),u0=D.clone().multiplyScalar(.87),De=D.clone().lerp(l("#e8a070"),.35),Ne=c=>.5*N.B*Math.pow(Math.sin(Math.PI*xe(.16+.84*c,0,1)),.6),Fe=c=>(2+1.3*c*c+.5*(1-c)*(1-c))*v,Ge=c=>-1.8*v*(1-.7*c*c*c*c),Te=(c,u,w)=>{const M=c*2-1,F=Math.abs(M),$=M<0?-1:1,re=Ge(u),G=Fe(u),W=Math.pow(F,1.6);return w.set($*Ne(u)*Math.pow(F,.42),re+(G-re)*W,E/2-u*E-1.7*v*u*u*u*W)};S(20,14,Te,(c,u)=>{const w=Math.abs(c*2-1),M=Ge(u)+(Fe(u)-Ge(u))*Math.pow(w,1.6);return w>.95?ge:M<.12?c0:M<.55*v?Pe:he}),S(20,1,(c,u,w)=>(Te(c,0,w),w.x*=1-u,w),()=>he);const L=c=>Fe(xe((E/2-c)/E,0,1))-.4*v;S(4,14,(c,u,w)=>{Te(1,u,w);const M=c*2-1;return w.set(M*Ne(u)*.96,w.y-.4*v+.14*v*(1-M*M),w.z)},(c,u)=>Math.round(u*14)%2?Ae:Oe);const Q=(c,u,w,M,F,$,re)=>{const G=(W,U,q)=>{const H=Math.round(W*4)%4,ce=H===0||H===3?-1:1,se=H<2?-1:1;return U.set(c+ce*M/2,q,w+se*$/2)};S(4,1,(W,U,q)=>G(W,q,u+U*F),()=>re,null,(W,U,q)=>(G(W,q,0),q.set(q.x-c,0,q.z-w))),S(1,1,(W,U,q)=>q.set(c+(W-.5)*M,u+F,w+(U-.5)*$),()=>Oe,null,(W,U,q)=>q.set(0,1,0))};i!=="skiff"?(Q(0,L(1.5),1.5,2.3,1,3.6,e0),Q(0,L(-9),-9,1.6,.7,2,e0),Q(0,L(E/2-3),E/2-3.2,1.4,.9,1.2,We)):Q(0,L(2),2.2,1.3,.45,1.6,e0);const V=Fe(1)+.1,d0=g(0,V+1.5*v,-E/2-6.5*v);N.sprit&&Z(g(0,V-.2,-E/2+2.5),d0,.17*v,.09*v,We);const Ue=.52,we=g(te*Math.sin(Ue),0,Math.cos(Ue)),Le=g(te*Math.cos(Ue),0,-Math.sin(Ue)),be=[];N.masts.forEach(([c,u,w],M)=>{const $=g(0,u,c+.035*u),re=L(c),G=(H,ce=g())=>ce.set(0,H,c+.035*H+.25*v);Z(g(0,0,c),$,.27*v,.11*v,We,7),be.push($);const W=re+1.7*v,U=G(W),q=U.clone().addScaledVector(we,w).setY(W+.5*v);if(Z(U,q,.13*v,.1*v,We),N.sails){const H=W+(i==="skiff"?.62:.5)*u,ce=G(H),se=ce.clone().addScaledVector(we,w*.78).setY(H+.2*u);Z(ce,se,.09*v,.07*v,We);const $e=g(),o0=g();S(8,8,(Ke,qe,Y0)=>($e.lerpVectors(U,q,Ke),o0.lerpVectors(ce,se,Ke),Y0.lerpVectors($e,o0,qe).addScaledVector(Le,.09*w*Math.sin(Math.PI*Ke)*Math.sin(Math.PI*(.1+.85*qe)))),(Ke,qe)=>qe>.86?De:Math.round(Ke*8)%2?t0:u0,(Ke,qe)=>[.22*v*Ke*(.4+.6*qe)+.001,qe*3+M*2.1]),le(se,G(Math.min(u*.97,H+.42*u)),.06,de)}else Z(U.clone().setY(W+.35*v),q.clone().setY(W+.85*v),.34*v,.24*v,t0,7);le(q,G(u*.93),.05,de),le(q,g(0,L(c+w*.8),c+w*.8),.06,de);for(const H of[-1,1])for(const ce of[-.9,.7]){const se=xe((E/2-(c+ce))/E,0,1);le(g(H*Ne(se)*.97,Fe(se),c+ce),G(u*.84),.055,de)}Z(g(-.9*v,u*.84,c+.035*u*.84),g(.9*v,u*.84,c+.035*u*.84),.05*v,.05*v,We,4)});const K=N.masts[0],_=g(0,K[1]*.9,K[0]+.035*K[1]*.9),p0=N.sprit?d0:g(0,V,-E/2+.2);if(le(p0,_,.06,de),be.length>1&&le(be[0],be[1],.05,de),le(be[be.length-1],g(0,L(E/2-.6)+.3,E/2-.6),.05,de),N.sprit&&le(d0,g(0,.4,-E/2+.4),.06,de),i!=="skiff"){const c=N.sails?1:.5,u=p0.clone().lerp(_,N.sails?.04:.12),w=p0.clone().lerp(_,.04+.8*c),M=g(te*1.6*v,L(K[0]-2)+1.4*v,K[0]-(N.sails?1.5:5)),F=g();S(6,6,($,re,G)=>(F.lerpVectors(u,w,$),G.lerpVectors(F,M,re).addScaledVector(Le,.7*v*c*Math.sin(Math.PI*$)*Math.sin(Math.PI*re))),($,re)=>Math.round($*6)%2?t0:u0,($,re)=>[.2*v*re+.001,$*4+5]),le(M,g(te*1.2,L(K[0]+3),K[0]+3),.05,de)}const a0=be[be.length-1].clone().setY(be[be.length-1].y+.3);S(6,1,(c,u,w)=>w.copy(a0).addScaledVector(we,c*3.4*v).setY(a0.y-(u-.5)*.7*v*(1-.7*c)),()=>De,c=>[.5*v*c+.001,c*5]);const fe=new n.BufferGeometry;fe.setAttribute("position",new n.Float32BufferAttribute(j,3)),fe.setAttribute("normal",new n.Float32BufferAttribute(X,3)),fe.setAttribute("aCol",new n.Float32BufferAttribute(ue,3)),fe.setAttribute("aLine",new n.Float32BufferAttribute(ee,4)),fe.setAttribute("aFlex",new n.Float32BufferAttribute(pe,2)),fe.setIndex(J);const je=[],oe=[],Xe=[],m0=22;for(let c=0;c<=m0;c++){const u=-3+Math.pow(c/m0,1.6)*E*5.2,w=N.B*.8+.3*Math.max(u,0);if(je.push(-w,0,-E/2+u,w,0,-E/2+u),oe.push(-1,u,1,u),c<m0){const M=c*2;Xe.push(M,M+1,M+2,M+1,M+3,M+2)}}const Ze=new n.BufferGeometry;return Ze.setAttribute("position",new n.Float32BufferAttribute(je,3)),Ze.setAttribute("uv",new n.Float32BufferAttribute(oe,2)),Ze.setIndex(Xe),{geometry:fe,wake:Ze,length:E,beam:N.B,height:Math.max(...N.masts.map(c=>c[1]))}}var No={id:"waterspout-sisters",name:"The Five Sisters",category:"sky",weirdness:.1,media:["air","open"],async build(i){const D=new n.Scene,te=i.vary||{},N=xe(i.quality?.detail??1,.5,1),E=xe(te.density??1,.7,1.3),v=xe(te.mood??.5,0,1),j=()=>n.UniformsUtils.clone(n.UniformsLib.fog),X={value:0},ue={value:0},ee={value:.003},pe=i.rng.fork("five-sisters-look-340");let J=pe.pick(["afternoon","noon","lastlight","afternoon","night","afternoon","lastlight","noon"]),me=pe.pick(["fair","squall","fair","calm"]);const ve=pe.pick(["schooner","ketch","schooner","skiff"]),ae=pe.pick(["frigate","booby","frigate","tern"]),r=pe.chance(.35)?-1:1;let k=!!te.rare;te.hour==="day"?J="noon":te.hour==="golden"?J=J==="lastlight"?"lastlight":"afternoon":te.hour==="dawn"?J="lastlight":te.hour==="night"&&(J="night"),k&&(te.hour==="day"||te.hour==="night")&&(k=!1),k&&(J==="noon"||J==="night")&&(J="afternoon"),k&&me==="calm"&&(me="fair");const a=fo[J],p=co[me],y=J==="night",S=(e,t,o)=>g(e*r,t,o),Z=a.sea.horizon?p.calm&&J==="lastlight"?"#"+l(a.sea.horizon).lerp(l(a.sky.horizon),.72).getHexString():a.sea.horizon:null,le=-112.5*r,he=lo(a.elev,le).clone().normalize(),c0="#"+l(a.sky.horizon).lerp(l(a.fog[0]),.3).multiplyScalar(1.3*.92).getHexString(),Pe={rng:i.rng,clouds:!1,clouds2:!1,...a.sky,ground:y?c0:Z||a.sky.horizon,groundFalloff:y?500:30,renderer:i.renderer};y?Pe.bodyOverrides={0:{elevation:a.elev,azimuth:le,size:2.6,phase:1,intensity:1.1,glow:.3}}:(Pe.sunElevation=a.elev,Pe.sunAzimuth=le),await i.yield();const ge=ro(Pe);D.add(ge.object),await i.yield();const Ae=l(a.fog[0]);p.squall&&Ae.lerp(l(a.rain),.25),D.fog=new n.FogExp2(Ae,a.fog[1]*p.fogK);const Oe=io(ge,{bounce:.45});D.add(Oe.object);const We=Oe.sun.intensity,de=l(a.key[0],a.key[1]),e0=l(a.shade[0],a.shade[1]),t0=l(a.sky.ambientColor,y?.5:.55),u0=l(a.pal[0],.3),De=l("#f2f5f0",.8).multiply(l(a.key[0]).lerp(l("#ffffff"),.5)),Ne=l(a.shade[0]).lerp(l("#c8d4e4"),.45).multiplyScalar(.8);J==="lastlight"&&Ne.lerp(De,.5);const Fe=l(a.pal[4]).lerp(l(a.pal[5]),.28).multiplyScalar(.92),Ge=()=>({...j(),uSunDir:{value:he},uSunCol:{value:de},uShadeCol:{value:t0},uBounce:{value:u0},uKey:{value:1}});await i.yield();const Te=[S(0,12,X0),S(0,12,-50),S(0,12,-200),S(-35,35,-380),S(40,35,-610),S(-5,30,-840),S(-30,30,-1150)];for(let e=1;e<=15;e++){const t=e/15*2.5*Math.PI,o=Se(100,85,e/15);Te.push(S(70-o*Math.cos(t),Se(30,Ca,e/15),-1150-o*Math.sin(t)))}const Ce=Te[Te.length-1].clone(),L=S(70+Lt*Math.cos(Bt),Ca+Lt*Math.sin(Bt),-1235);Te.push(Ce.clone().lerp(L,.2),Ce.clone().lerp(L,.45),Ce.clone().lerp(L,.72),L);const Q=no(Te),V=Q.length,d0=Math.round(V/50),Ue=Aa-X0,we=e=>(X0+e*Ue)/V,Le=e=>(e*V-X0)/Ue*Tt,be=e=>e*Aa/V,K=await ho(i,{palette:a.pal,mood:a.hero,sunDir:he,mirror:r<0,seat:[L.x*r,L.y,L.z-ze],approach:[Ce.x*r,Ce.y,Ce.z-ze],...a.heroShadow?{shadowColor:l(a.heroShadow[0],a.heroShadow[1])}:{},...a.heroSun?{sunColor:l(a.heroSun[0],a.heroSun[1])}:{},seaY:p.lift+.22,patchMin:y?.62:.5,timeline:{thin:we(.26),kink:we(.3),rope:we(.386),gone:we(.455),spot:we(.34),ring:we(.43),finger:we(.5),down:we(.74)}});K.object.position.set(0,0,ze),D.add(K.object),K.setProgress(0);for(const e of[0,1,2,4])K.setLife(e,{foot:3});const _=S(70,0,-1150);await i.yield();const p0=ve==="skiff"?8:6,a0=(e,t)=>t.set((74+p0*(Le(e)-11.24))*r,14,-558),fe=g(),je=g(),oe=g(),Xe=g(),m0=new n.Vector4;let Ze=0;await i.yield();const c=(e,t,o)=>{let s=1e9,h=t;for(let m=t;m<=o;m+=2){const B=Q.posAtDist(m,oe).distanceTo(e);B<s&&(s=B,h=m)}return h},u=c(Te[6],0,V),w=c(Ce,u,V),M=e=>{for(let t=0;t<=u;t+=2)if(Q.posAtDist(t,oe).z<=e)return t;return u},F=[0,1,2,3].map(e=>{const t=K.sisters[e].home;let o=1e9,s=0;for(let h=0;h<=u;h+=2){Q.posAtDist(h,oe);const m=Math.hypot(oe.x-t.x,oe.z-t.y-ze);m<o&&(o=m,s=h)}return s}),$=M($0),re=M(a0(0,fe).z),G=e=>{let t=0;for(let o=u;o<=w;o+=2){Q.posAtDist(o,oe);const s=oe.x-_.x;if(o>u&&(oe.z-_.z)*e>0&&s*t<=0)return o;t=s}return w},W=G(-1),U=G(1);await i.yield();const q=30;let H=u;for(let e=u;e>u-400&&(Q.posAtDist(e,oe),Q.tangentAtDist(e,Xe),fe.set(_.x-oe.x,0,_.z-oe.z).normalize(),Xe.y=0,Xe.normalize(),H=e,!(fe.dot(Xe)>Math.cos(q*Math.PI/180)));e-=2.5);const ce=30;let se=w;for(let e=w;e>u;e-=2.5){Q.posAtDist(e,oe),fe.copy(L).sub(oe);const t=Math.hypot(fe.x,fe.z),o=xe(((_.x-oe.x)*fe.x+(_.z-oe.z)*fe.z)/(t*t),0,1),s=Math.hypot(oe.x+fe.x*o-_.x,oe.z+fe.z*o-_.z),h=K.spineAt(4,oe.y+fe.y*o,m0).w;if(s<h+ce)break;se=e}const $e=150,o0=(e,t)=>ie(e-$e,e,t),Ke=e=>{const t=e*V;return Se(Se(Se(2,1.15,o0(u,t)),.95,o0(W,t)),.25,o0(se,t))};await i.yield();const qe=.58,Y0=.25,Ba=150,Pa=.9,Da=(e,t)=>(Q.pointAt(t,je),je.set(_.x,je.y-Y0*je.y,_.z)),Ka=[{at:(e,t)=>(Ze=t,Q.pointAt(Math.min(t+30/V,1),oe)),from:0,to:1,weight:.004,fade:.01},{at:S(55,55,-380),from:$/V,to:F[0]/V,weight:.42},{at:(e,t)=>a0(t,fe),from:F[0]/V,to:re/V,weight:.5,fade:.4},{at:S(-55,42,-610),from:F[0]/V,to:F[1]/V,weight:.5,fade:.45},{at:S(65,55,-840),from:(F[1]+20)/V,to:F[2]/V,weight:.45,fade:.4},{at:S(-120,150,-1060),from:be(.415),to:we(.47),weight:.3},{at:Da,from:H/V,to:w/V,weight:qe,fade:Ba/(w-H)},{at:L,from:se/V,to:1,weight:Pa,fade:.3}],Kt=100,B0=(e,t,o)=>ie(t-Kt,t,e)*(1-ie(o,o+Kt,e)),qa=e=>{const t=e*V,o=B0(t,u,se);return(1-.2*B0(t,F[0],F[1]))*(1+.15*B0(t,F[3],u))*(1-.09*o)*(1-.06*o)*(1+.08*B0(t,w,V))},qt=K.uniforms.uWind.value,ye=new n.Vector2(qt.x,qt.y).normalize();await i.yield();const Ra=Sa.waterLight(ge),ke=Sa.makeOcean({rng:i.rng,light:Ra,...p.ocean,reflectivity:(p.ocean.reflectivity??1)*(a.sea.refl??1),...Z?{horizonColor:Z}:{},deep:a.sea.deep,shallowColor:l(a.sea.shallow,.72),scatter:a.sea.scatter,glow:a.sea.glow||"#000000",radius:6800,fadeStart:.42,windAngle:Math.atan2(ye.y,ye.x),shallows:[{x:0,z:60,radius:240,falloff:100},{x:-170*r,z:-60,radius:150,falloff:80},{x:190*r,z:10,radius:170,falloff:90},{x:40*r,z:260,radius:220,falloff:100},{x:-175*r,z:-300,radius:80,falloff:80},{x:235*r,z:-285,radius:90,falloff:80},{x:-45*r,z:-465,radius:55,falloff:60}]});D.add(ke.object);const v0=l(a.sky.horizon).lerp(Ae,.3).multiplyScalar(1.3),J0=y?v0.clone().multiplyScalar(.92):l(Z||a.sky.horizon),Rt=J0,Q0=y&&ke.uniforms&&ke.uniforms.uHorizonColor?ke.uniforms.uHorizonColor:null,et=y&&ge.uniforms&&ge.uniforms.uGround?ge.uniforms.uGround:null,P0=ke.uniforms&&ke.uniforms.uFoam&&typeof ke.uniforms.uFoam.value=="number"?ke.uniforms.uFoam:null,Ea=P0?P0.value:0;await i.yield();const Re=j0(Ft("patch-reef:"+i.seed)),Et=Re.range(0,35)*Math.PI/180,Wt=Re.range(330,470),D0=[360*Re.range(.85,1.15),270*Re.range(.85,1.15)],K0=S(70-Wt*Math.cos(Et),0,-1150-Wt*Math.sin(Et)),tt=[];for(let e=0;e<6;e++)tt.push(new n.Vector4(0,0,0,14));const at={uMX:{value:r},uLipZ:{value:$0},uWestX:{value:-1100}},ot={...j(),...at,uPatch:K.patchUniforms.uPatch,uTime:X,uOriginZ:{value:ze},uSeaWest:{value:-520},uFarCol:{value:a.sea.far?l(a.sea.far[0],a.sea.far[1]):l("#000000")},uSeaLit:{value:y?l("#8fb0e0",.035):l(a.sea.shallow).lerp(l(a.sea.deep),.45).multiplyScalar(.8)},uLug:{value:[0,1,2].map(()=>new n.Vector4(0,1e5,1,0))},uReef:{value:new n.Vector4(K0.x,K0.z,D0[0],D0[1])},uInk:{value:l(a.sea.ink)},uInkA:{value:a.sea.inkA},uHard:{value:a.sea.hard},uCalm:{value:p.calm},uSquall:{value:p.squall},uGlit:{value:a.sea.glit},uFleck:{value:Se(.85,1.2,v)*(y?.55:1)},uGustZ:{value:-420},uSmear:{value:p.smear*(a.sea.smearK||1)},uRowC:{value:-135*ye.x},uPhosK:{value:(a.sea.phos||0)*.5},uSargK:{value:xe(.72*E,.45,.9)},uFoamLit:{value:De},uFoamShade:{value:Ne},uSarg:{value:l(a.sarg,1)},uSunCol:{value:de},uSand:{value:l(a.sea.sand,.8)},uTurq:{value:l(a.sea.turq||a.sea.shallow,a.sea.turqK||.5)},uTq:{value:a.sea.tq||.34},uPhos:{value:l("#3affd8",.5)},uSmearCol:{value:a.sea.smearCol?l(a.sea.smearCol,.6):l(a.pal[3],.55).lerp(de,.4)},uWindD:{value:ye},uSp:{value:tt},uSunAz:{value:new n.Vector2(he.x,he.z).normalize()},uRoad:{value:a.sea.road??.05},uRoadPow:{value:a.sea.roadPow||9},uSheen:{value:a.sea.sheen?a.sea.sheen[1]*(1-.35*p.calm):0},uSheenCol:{value:l(a.sea.sheen?a.sea.sheen[0]:"#000000")},uSheenBack:{value:l(a.sea.sheenBack?a.sea.sheenBack[0]:a.sea.sheen?a.sea.sheen[0]:"#000000")},uBackK:{value:a.sea.sheenBack?a.sea.sheenBack[1]:0},uRoadTint:{value:a.sea.roadTint?g(...a.sea.roadTint):g(1,.72,.42)},uLast:{value:a.sea.jade?1:0},uJade:{value:l(a.sea.jade||"#000000")},uApr:{value:a.sea.mirror?l(a.sea.mirror[0],a.sea.mirror[1]):l("#000000")},uGold:{value:a.sea.gold?l(a.sea.gold[0],a.sea.gold[1]):l("#000000")},uSeaHaze:{value:l(Z||"#000000")},uDFog:{value:a.sea.jade?Ae.clone().lerp(l(Z),.75):Ae},uNightK:{value:a.sea.night?1:0},uNightCol:{value:a.sea.night?l(a.sea.night[0],a.sea.night[1]):l("#000000")},uSilver:{value:a.sea.silver?l(a.sea.silver[0],a.sea.silver[1]):l("#000000")},uNightHor:{value:a.sea.nightHor?l(a.sea.nightHor[0],a.sea.nightHor[1]):l("#000000")},uHazeN:{value:v0}},Ye=new n.Mesh(new n.PlaneGeometry(17e3,17e3).rotateX(-Math.PI/2),new n.ShaderMaterial({uniforms:ot,vertexShader:Fa,fragmentShader:uo(K.PATCH_GLSL),transparent:!0,depthWrite:!1,fog:!0,premultipliedAlpha:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));Ye.renderOrder=-6,Ye.frustumCulled=!1,Ye.position.y=p.lift,Ye.name="sea-dressing",D.add(Ye),await i.yield();const st={...j(),...at,uPatch:K.patchUniforms.uPatch,uTime:X,uOriginZ:{value:ze},uFlash:{value:0},uFlashPos:{value:g(0,L0,-900)},uSpin:{value:K.uniforms.uDir.value},uIndigo:{value:Fe},uLip:{value:l(a.lip[0],a.lip[1])},uSunDir:{value:he},uSunCol:{value:de},uShadeCol:{value:e0},uBounce:{value:u0},uReliefD:{value:Se(88,106,v)},uNightC:{value:y?1:0},uLift:{value:y?g(.0052,.0056,.0066):g(0,0,0)},uHaze:{value:y?new n.Vector4(v0.r,v0.g,v0.b,.85):new n.Vector4(Ae.r,Ae.g,Ae.b,.5)},uBayA:{value:new n.Vector4(L.x,L.z,K.bayBar.x,K.bayBar.y)}},g0=new n.Mesh(new n.PlaneGeometry(10400,6900).rotateX(Math.PI/2),new n.ShaderMaterial({uniforms:st,vertexShader:Fa,fragmentShader:po(K.PATCH_GLSL),transparent:!0,depthWrite:!1,fog:!0,premultipliedAlpha:!0,side:n.DoubleSide}));g0.position.set(0,L0,-3050),g0.renderOrder=-4,g0.frustumCulled=!1,g0.name="cloud-base",D.add(g0),await i.yield();const Wa=i.rng.fork("shafts"),w0=j0((i.seed|0)*7919+20261006>>>0),nt=[[4,1600,2900,.94],[-38,2150,640,.46],[37,3300,1700,.62],[-57,2700,1300,.6]];p.squall&&nt.push([61,1800,1050,.8]),nt.push([49,2550,1250,.74]);const Nt=nt.map(([e,t,o,s],h)=>({th:(e+w0.range(-4,4))*Math.PI/180,R:t*w0.range(.93,1.08)*(p.squall?.86:1),W:o*w0.range(.85,1.15)*(p.squall?1.12:1),k:Math.min(s*w0.range(.9,1.08)*(p.squall?1.12:1),.96),seed:w0()}));Nt.sort((e,t)=>t.R-e.R);{const e=[],t=[],o=[],s=[],h=[],m=[];Nt.forEach((f,d)=>{const A=d*29*11;for(let P=0;P<=10;P++)for(let R=0;R<=28;R++){const ne=f.th+(R/28-.5)*f.W/f.R;e.push(r*f.R*Math.sin(ne),P/10*(L0+4)-4,-1e3-f.R*Math.cos(ne)),t.push(R/28,P/10),o.push(f.seed),s.push(f.W),h.push(f.k)}for(let P=0;P<10;P++)for(let R=0;R<28;R++){const ne=A+P*29+R,Me=ne+1,F0=ne+28+1,Mt=F0+1;m.push(ne,Me,F0,Me,Mt,F0)}});const z=new n.BufferGeometry;z.setAttribute("position",new n.Float32BufferAttribute(e,3)),z.setAttribute("uv",new n.Float32BufferAttribute(t,2)),z.setAttribute("aSeed",new n.Float32BufferAttribute(o,1)),z.setAttribute("aW",new n.Float32BufferAttribute(s,1)),z.setAttribute("aK",new n.Float32BufferAttribute(h,1)),z.setIndex(m);const O=y?l(a.rain,1.2):Ae.clone().lerp(l(a.key[0]),.35).multiplyScalar(.92),b=new n.Vector2(ye.x>=0?1:-1,ye.y>=0?.3:-.3).normalize().multiplyScalar(270),x=new n.Mesh(z,new n.ShaderMaterial({uniforms:{...j(),...at,uTime:X,uFogAmt:{value:.26},uAlpha:{value:y?.88:.93},uRain:{value:l(a.rain)},uRainLit:{value:y?Fe.clone().lerp(l(a.rain),.5):Fe.clone().multiplyScalar(.9)},uRainSun:{value:O},uSunAz:{value:new n.Vector2(he.x,he.z).normalize()},uLean:{value:b}},vertexShader:mo,fragmentShader:vo,transparent:!0,depthWrite:!1,fog:!0,premultipliedAlpha:!0,side:n.DoubleSide}));x.renderOrder=-3.95,x.frustumCulled=!1,x.name="rain-curtains",D.add(x)}const Be=Wa.fork("far-lip");await i.yield();const I=i.rng.fork("scud"),It=[],Ht=[],Vt=[],_t=[],q0=(e,t,o,s,h,m,B,C,z,O,b,x=.55,f=2.2,d=0,A=1)=>{It.push(e,t,o,s),Ht.push(h,m,B,I()),Vt.push(z,O,C,b),_t.push(x,f,d,A)},Na=Math.round(90*N*E),Ia=Math.round(64*N*E);for(let e=0;e<Na;e++){const t=I.range(4,9)*(I.chance(.5)?1:-1);q0(I.range(-700,1500)*r,I.range(584,612),$0+I.range(-280,10),0,0,0,I.range(60,140),I.range(60,120),t,I.range(-1,1),1,I.range(.5,.7))}for(let e=0;e<Ia;e++)q0((-1110+I.range(-50,230))*r,I.range(584,612),I.range(-1450,-260),0,0,0,I.range(70,150),I.range(60,120),I.range(-1,1),I.range(3,8),.9,I.range(.5,.7));const Ha=K.uniforms.uDir.value;for(let e=0;e<K.sisters.length;e++){const t=K.sisters[e],o=Math.round((e===4?30:9)*N*E),s=t.top.x,h=t.top.y+ze;for(let m=0;m<o;m++){const B=t.collarR*I.range(.28,e===4?1.05:.95),C=I.range(0,6.283);let z=1e9;for(let b=0;b<6;b++){const x=C+b*1.047;z=Math.min(z,K.collarHeight(e,t.top.x+Math.cos(x)*B,t.top.y+Math.sin(x)*B))}const O=I.range(50,e===4?80:110);z=Math.max(z-4,e===4?492:300),q0(s,z,h,B,C,Ha*I.range(2.5,6)/B,O,0,0,0,I.range(.6,1),.62,2.2,-1)}await i.yield()}{const e=Math.round(72*N*E);for(let t=0;t<e;t++){const o=70+I.range(-520,900),s=-1150+I.range(-620,480),h=o*r,m=I.range(90,180)*1.5,B=I.range(.6,1),C=I.range(.5,1.1),z=I.range(90,150),O=I.range(.5,.75)*.64;let b=I.range(584,606);Math.hypot(h-L.x,s-L.z)<300||(Math.hypot(o-70,s+1150)<330&&(b=Math.min(b,K.collarHeight(4,h,s-ze)-8)),q0(h,b,s,0,0,0,m,z,ye.x*C,ye.y*C,B,O,2.2,-1))}}const rt=[],it=[],lt=[],ht=[],Ot=(e,t)=>K.bayHeight(e,t-ze);{const e=I.fork("grotto-ring"),t=Math.round(56*N),o=Math.atan2(Ce.z-L.z,Ce.x-L.x);for(let C=0;C<t;C++){const z=o+e.range(.95,2*Math.PI-.95),O=Se(110,340,Math.pow(e(),.8)),b=e.range(150,260),x=e.range(.3,.8),f=L.x+Math.cos(z)*O,d=L.z+Math.sin(z)*O;let A=e.range(586,604);Math.hypot(f-_.x,d-_.z)<330&&(A=Math.min(A,K.collarHeight(4,f,d-ze)-8)),A=Math.min(A,Ot(f,d)-6),rt.push(f,A,d,0),it.push(0,0,b,I()),lt.push(ye.x*x,ye.y*x,e.range(100,160),e.range(.45,.85)),ht.push(e.range(.36,.46),2.2,-1,1)}const s=e.fork("shelves"),h=K.bayBar.x,m=K.bayBar.y,B=Math.round(34*N);for(let C=0;C<B;C++){const z=-s.range(10,290),O=xe(-z/300,0,1),b=(C%2?1:-1)*(118+50*O+s.range(-38,46)),x=L.x+h*z-m*b,f=L.z+m*z+h*b,d=s.range(160,270),A=s.range(.27,.36),P=s.range(.1,.3);let R=Ot(x,f)-s.range(2,16);Math.abs(b)<.5*d+30&&(R=Math.max(R,L.y+z*Math.tan(Bt)+25+.5*A*d)),rt.push(x,R,f,0),it.push(0,0,d,s()),lt.push(ye.x*P,ye.y*P,s.range(110,160),s.range(.6,.95)),ht.push(A,2.2,-1,1)}}await i.yield();const y0=L.clone().sub(Ce).normalize(),ft=g(0,0,1),R0=new n.Vector3().crossVectors(ft,y0).normalize();R0.y<0&&R0.negate();const ct=[],T=i.rng.fork("grotto"),x0=(e,t,o,s,h,m,B)=>{const C=L.clone().addScaledVector(y0,e).addScaledVector(ft,Math.cos(o)*t).addScaledVector(R0,Math.sin(o)*t);C.y=Math.min(C.y,L0+20-.3*s),ct.push({p:C,s:e,size:s,lit:h,asp:m,nearK:B,glow:.42*Math.exp(-C.distanceTo(L)/55)})};for(let e=0;e<34;e++)x0(T.range(36,100),125*Math.sqrt(T()),T.range(0,6.283),T.range(80,130),T.range(.15,.22),T.range(.8,1),.3);for(let e=0;e<76;e++){const t=T.range(-90,32),o=T.range(42,92),s=T.range(.7,.95),h=ie(-8,-70,t),m=(t<-40?21:15)+.42*o+T()*T.range(0,46);x0(t,m,T.range(0,6.283),o,.06+h*T.range(.3,.6),s,.5)}for(let e=0,t=Math.round(14*N);e<t;e++)x0(T.range(-30,44),T.range(72,145),T.range(0,6.283),T.range(90,140),T.range(.12,.22),T.range(.7,.95),.5);for(let e=0;e<14;e++)x0(T.range(-40,30),T.range(64,150),T.range(Math.PI+.2,2*Math.PI-.2),T.range(100,150),T.range(.12,.22),T.range(.7,.95),.5);for(let e=0,t=Math.round(26*N);e<t;e++){const o=T.range(-70,150),s=T.range(100,175);x0(o,T.range(95,200),T.range(-.35,Math.PI+.35),s,T.range(.3,.6),T.range(.65,.9),.5)}ct.sort((e,t)=>t.s-e.s);const Gt=[],Ut=[],jt=[],Xt=[];for(const e of ct)Gt.push(e.p.x,e.p.y,e.p.z,0),Ut.push(0,0,e.size,T()),jt.push(0,0,0,e.lit),Xt.push(e.asp,e.nearK,e.glow,.25);await i.yield();const Va=(e,t,o,s=0)=>({...j(),uTime:X,uOpacity:{value:e},uSoft:{value:t},uFarMix:{value:s},uSunDir:{value:he},uShadeCol:{value:e0},uIndigo:{value:Fe},uLip:{value:l(a.lip[0],a.lip[1])},uRim:{value:de.clone().multiply(new n.Color(1,.8,.55)).multiplyScalar(.9)},uGlowCol:{value:o||l("#BFF3EE",.5)},uBar:{value:K.bayBar},uBarO:{value:new n.Vector2(L.x,L.z)},uBarK:{value:0}}),b0=(e,t,o,s,h,m,B,C=0,z=null,O=0)=>{const b=new n.InstancedBufferGeometry;b.setAttribute("position",new n.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),b.setIndex([0,1,2,0,2,3]),b.setAttribute("iA",new n.InstancedBufferAttribute(new Float32Array(e),4)),b.setAttribute("iB",new n.InstancedBufferAttribute(new Float32Array(t),4)),b.setAttribute("iC",new n.InstancedBufferAttribute(new Float32Array(o),4)),b.setAttribute("iD",new n.InstancedBufferAttribute(new Float32Array(s),4)),b.instanceCount=e.length/4;const x=new n.Mesh(b,new n.ShaderMaterial({uniforms:Va(h,C,z,O),vertexShader:go,fragmentShader:wo,transparent:!0,depthWrite:!1,fog:!0,premultipliedAlpha:!0}));return x.renderOrder=m,x.frustumCulled=!1,x.name=B,D.add(x),x};b0(It,Ht,Vt,_t,.6,-.5,"scud",1);{const e=x=>x-Math.floor(x),t=(x,f,d)=>x+(f-x)*d,o=(x,f)=>{let d=e(x*.1031),A=e(f*.1031),P=d;const R=d*(A+33.33)+A*(P+33.33)+P*(d+33.33);return d+=R,A+=R,P+=R,e((d+A)*P)},s=(x,f)=>{const d=Math.floor(x),A=Math.floor(f);let P=x-d,R=f-A;return P=P*P*(3-2*P),R=R*R*(3-2*R),t(t(o(d,A),o(d+1,A),P),t(o(d,A+1),o(d+1,A+1),P),R)},h=(x,f)=>.5*s(x,f)+.3*s(x*2.07+13.1,f*2.07+13.1)+.2*s(x*4.3+41.7,f*4.3+41.7),m=(x,f)=>{const d=$0+(s(x*.0045,3.1)-.5)*150+(s(x*.021,7.7)-.5)*36-f,A=-1100-2500*(1-ie(-2400,-1500,f)),P=x*r-(A+(s(f*.004,9.3)-.5)*260+(s(f*.017,1.7)-.5)*60),R=ie(900,2200,Math.hypot(x,(f+930)*.6))*ie(-300,-1300,f);let ne=-240*Math.log(Math.exp(-xe(d/240,-12,12))+Math.exp(-xe(P/240,-12,12)));return ne+=(170*(h(x/340+2,f/340+2)-.5)+380*(s(x/850+7,f/850+7)-.5))*(1+R),ne+=150*(Math.abs(2*s(x/175+23,f/175+23)-1)-.42),ne+R*(700*(s(x/2100+3,f/2100+3)-.5)+420*(s(x/260+31,f/260+31)-.5)+180*(s(x/120+11,f/120+11)-.5))},B=[],C=[],z=[],O=[],b=Math.round(150*N*E);for(let x=0;x<1800&&B.length<b*4;x++){const f=Be.range(-4300,-700)*r,d=Be.range(-4300,-1300),A=Be.range(170,300),P=Be.range(572,606),R=Be.range(2,6)*(Be.chance(.5)?1:-1),ne=Be.range(110,170),Me=Be.range(.8,1),F0=Be.range(.5,.7),Mt=Be(),ba=m(f,d);ba<-90||ba>300||(B.push(f,P,d,0),C.push(0,0,A,Mt),z.push(R*.2,R*.5,ne,Me),O.push(F0,2.2,.55,1))}b0(B,C,z,O,.92,-.5,"lip-fringe",1,l(a.lip[0],a.lip[1]*.8).multiply(new n.Color(1.12,.86,.58)))}b0(rt,it,lt,ht,.85,-.45,"grotto-rags",1,null,1).material.uniforms.uBarK.value=.85,b0(Gt,Ut,jt,Xt,.97,-.4,"grotto",0,null,1).material.uniforms.uBarK.value=.5;{const e=[],t=[],o=[],s=[];for(let h=0;h<Math.round(16*N);h++){const m=L.clone().addScaledVector(y0,T.range(-210,-100)).addScaledVector(R0,T.range(50,115)).addScaledVector(ft,T.range(-60,60));e.push(m.x,m.y,m.z,0),t.push(0,0,T.range(28,52),T()),o.push(0,(T.chance(.5)?1:-1)*T.range(8,14),T.range(18,30),T.range(.5,.9)),s.push(.65,1.2,0,.4)}b0(e,t,o,s,.8,-.3,"grotto-tags").material.uniforms.uBarK.value=.5}const ut={uCol:{value:l("#BFF3EE")},uTime:X,uR:{value:Z0},uFar:{value:1},uVis:{value:0}},s0=new n.Mesh(new n.PlaneGeometry(Z0*7.2,Z0*7.2),new n.ShaderMaterial({uniforms:ut,vertexShader:yo,fragmentShader:xo,transparent:!0,depthWrite:!1,depthTest:!1,blending:n.AdditiveBlending,side:n.DoubleSide}));s0.position.copy(L),s0.lookAt(L.clone().sub(y0)),s0.renderOrder=4,s0.frustumCulled=!1,s0.name="lantern",D.add(s0),await i.yield();const k0=i.rng.fork("towers"),Zt=[];for(let e=0;e<7;e++)Zt.push([(-2700+e*900+k0.range(-250,250))*r,k0.range(380,460),k0.range(950,1700),k0.range(560,860)]);const E0=ka({rng:i.rng,sky:ge,at:Zt,height:.95,wind:[1.2,0,.4],renderOrder:-4.5,farFade:[5200,6900],fogFade:.4});D.add(E0.object),await i.yield();const W0=ka({rng:k0,sky:ge,at:(y?[[4350,215,-3400,820],[4500,300,-2700,1500],[4650,210,-1950,760],[4800,265,-1300,1150]]:[[4300,330,-3700,700],[4560,300,-3050,900],[4700,340,-1250,620],[5e3,300,200,820]]).map(([e,t,o,s])=>[e*r,t,o,s]),height:y?.6:.95,opacity:y?.2:.8,wind:[1.2,0,.4],renderOrder:-4.5,farFade:[5200,6900],fogFade:.4,noiseTexture:E0.noiseTexture});if(D.add(W0.object),y)for(const e of[E0,W0]){const t=e.uniforms||{};t.uLit&&t.uLit.value&&t.uLit.value.isColor&&t.uLit.value.lerp(l("#39445f"),e===W0?.6:.45),t.uShade&&t.uShade.value&&t.uShade.value.isColor&&t.uShade.value.lerp(l("#1c2440"),.4)}await i.yield();const n0=La(ve,l(a.pal[6]),-r),dt=new n.ShaderMaterial({uniforms:{...Ge(),uTime:X,uPx:ee,uSailFar:{value:l(a.pal[6]).multiply(de).multiplyScalar(.7).add(l(a.pal[6]).multiply(t0).multiplyScalar(.5))}},vertexShader:Mo,fragmentShader:Fo,side:n.DoubleSide,fog:!0}),$t=e=>new n.ShaderMaterial({uniforms:{...j(),uTime:X,uLen:{value:e.length},uBeam:{value:e.beam},uPhosK:{value:(a.sea.phos||0)*(a.sea.wakePhos??1)},uFoam:{value:Ne.clone().lerp(De,.8).multiplyScalar(a.sea.wakeFoam??1)},uPhos:{value:l("#3affd8",.5)}},vertexShader:To,fragmentShader:Lo,transparent:!0,depthWrite:!1,fog:!0,premultipliedAlpha:!0,side:n.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-6}),Yt=$t(n0),pt=46,Jt=-r,Qt=e=>{const t=new n.InstancedBufferGeometry,o=[];t.setAttribute("position",new n.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),t.setIndex([0,1,2,0,2,3]);for(let s=0;s<pt;s++){const h=Math.sin(s*12.9898+4.1)*43758.5453%1,m=Math.sin(s*78.233+1.3)*12543.127%1,B=Math.abs(h),C=Math.abs(m);o.push((s+.5)/pt,s%3===2?-Jt:Jt,B,(1.9+2.6*C)*Math.pow(e.length/32,.6))}return t.setAttribute("iS",new n.InstancedBufferAttribute(new Float32Array(o),4)),t.instanceCount=pt,t},ea=Qt(n0),ta=(e,t=n0)=>new n.ShaderMaterial({uniforms:{...j(),uTime:X,uPh:{value:e},uLen:{value:t.length},uSunDir:{value:he},uPhosK:{value:(a.sea.phos||0)*.8},uFoam:{value:De.clone().multiplyScalar(1.05)},uShade:{value:Ne.clone().lerp(De,.35)},uSunCol:{value:de},uPhos:{value:l("#3affd8",.5)}},vertexShader:Bo,fragmentShader:Po,transparent:!0,depthWrite:!1,fog:!0,premultipliedAlpha:!0}),aa=[],_a=j0(Ft("vessel-rock:"+i.seed));for(let e=0;e<(ve==="skiff"?2:1);e++){const t=_a.range(0,6.283),o=new n.Mesh(n0.geometry,dt),s=new n.Mesh(n0.wake,Yt),h=new n.Mesh(ea,ta(t));o.frustumCulled=!1,s.frustumCulled=!1,s.renderOrder=-5.5,o.name="vessel"+e,s.name="wake"+e,h.frustumCulled=!1,h.name="bow-spray"+e,D.add(o,s,h),aa.push({mesh:o,wake:s,spray:h,off:e?g(-30*r,0,-34):g(0,0,0),ph:t})}const Oa=ve==="ketch"?.2:ve==="skiff"?.3:.44,oa={value:g()},N0=g();await i.yield();const r0=ve==="skiff"?n0:La("skiff",l(a.pal[6]),-r),Je=j0(Ft("run-in-lugger:"+i.seed)),sa=8,I0=25,i0=g(),S0=g(),na=e=>sa*(Le(e/V)-Le(0)),Ga=na(V),ra=(e,t)=>{const o=e.x-t.x,s=e.z-t.z,h=e.dx-(t.dx||0),m=e.dz-(t.dz||0),B=h*h+m*m,C=B>1e-9?xe(-(o*h+s*m)/B,0,Ga):0;return Math.hypot(o+h*C,s+m*C)},l0=[];for(let e=0;e<620;e+=2.5)Q.posAtDist(e,i0),l0.push(i0.x,i0.z,na(e));const ia=Je.chance(.5)?1:-1,la=[0,1,2].map(()=>[Je.range(0,6.283),Je.range(0,6.283)]),mt=[];for(let e=0,t=0;e<3;e++){let o=null;for(let s=0;s<60&&!o;s++){const h=t+(e?Je.range(90,160):Je.range(60,140)),m=Je.range(I0,90)*(e%2?-ia:ia),B=(45+Je.range(-30,30))*Math.PI/180;Q.posAtDist(h,i0),Q.tangentAtDist(h,S0);const C=Math.hypot(S0.x,S0.z)||1,z={D:h,x:i0.x-S0.z/C*m,z:i0.z+S0.x/C*m,dx:Math.sin(B)*r,dz:Math.cos(B)};let O=!0;for(let b=0;b<l0.length&&b/3*2.5<h+150&&O;b+=3)Math.hypot(z.x+z.dx*l0[b+2]-l0[b],z.z+z.dz*l0[b+2]-l0[b+1])<I0&&(O=!1);for(const b of mt)ra(z,b)<I0&&(O=!1);for(const b of K.sisters)ra(z,{x:b.home.x,z:b.home.y+ze})<b.ring+I0&&(O=!1);O&&(o=z)}if(!o)break;t=o.D,mt.push(o),await i.yield()}const Ua=ve==="skiff"?Yt:$t(r0),ja=ve==="skiff"?ea:Qt(r0),ha=mt.map((e,t)=>{const o=new n.Mesh(r0.geometry,dt),s=new n.Mesh(r0.wake,Ua),h=new n.Mesh(ja,ta(la[t][0],r0));return o.frustumCulled=!1,s.frustumCulled=!1,h.frustumCulled=!1,s.renderOrder=-5.5,o.name="lugger"+t,s.name="lugger-wake"+t,h.name="lugger-spray"+t,D.add(o,s,h),{x:e.x,z:e.z,dx:e.dx,dz:e.dz,yaw:Math.atan2(-e.dx,-e.dz),ph:la[t],mesh:o,wake:s,spray:h}}),H0=g(K0.x+Re.range(-.3,.3)*D0[0],0,K0.z+Re.range(-.3,.3)*D0[1]),Xa=Math.atan2(ye.x,ye.y),vt=[Re.range(0,6.283),Re.range(0,6.283),Re.range(0,6.283)],z0=new n.Mesh(r0.geometry,dt);z0.frustumCulled=!1,z0.name="lugger-at-anchor",D.add(z0),await i.yield();const Y=i.rng.fork("birds"),V0=[],gt=[],wt=[],fa=ae==="frigate"?1.15:ae==="booby"?.95:.8,yt=(e,t,o,s,h,m,B,C,z)=>{V0.push(e,t,o,s),gt.push(h,m,fa*Y.range(.92,1.1),Y()),wt.push(B,C,-.3,z)},Ee=g(),Ie=g(),ca=g(),He=g(),A0=g(),qo=g(0,1,0);[.5,.525,.55,.575,.6,.625,.65,.675,.7,.725,.75].forEach((e,t)=>{Q.pointAt(e,Ee),Q.tangentAt(e,Ie),ca.set(_.x-Ee.x,0,_.z-Ee.z).normalize();for(let o=0,s=3+t%2;o<s;o++){He.copy(Ee).addScaledVector(Ie,10+o*Y.range(8,13)).addScaledVector(ca,Y.range(8,12)+o%2*Y.range(3,7));const h=Ee.y+Y.range(0,4.5)+o*Y.range(-2,3.5),m=Math.hypot(He.x-_.x,He.z-_.z);yt(_.x,h,_.z,m,Math.atan2(He.z-_.z,He.x-_.x),r*Y.range(10.5,13.5)/m,0,Le(e),(t+o)%3===1?1:0)}});const xt=[50,68],Za=Math.round(14*E);for(let e=0;e<Za;e++){const t=Y.chance(.5)?Y.range(xt[0],xt[1]):Y.range(120,165),o=e<4?Y.range(38,85):Y.range(60,320);yt(_.x,o,_.z,t,Y.range(0,6.283),r*Y.range(10,14)/t,1,0,Y.chance(.35)?1:0)}for(let e=0;e<4;e++)yt(Y.range(-8,8),Y.range(17,26),-34+Y.range(-8,8),Y.range(13,21),Y.range(0,6.283),(Y.chance(.5)?1:-1)*Y.range(.5,.75),2,0,1);const $a=20,Ya=40,ua=250,Ja=10,Qa=100,da=17,bt=(e,t)=>{if(e>=u)Q.posAtDist(e,t);else{const s=(e-u)/100;t.set((70-100*Math.cos(s))*r,30,-1150-100*Math.sin(s))}const o=1-ie(w,w+Qa,e);if(o>0){const s=t.x-_.x,h=t.z-_.z,m=Math.hypot(s,h)||1,B=Se(1,xt[1]/m,o);t.x=_.x+s*B,t.z=_.z+h*B}return t},kt=g(),pa=g(0,0,-1),_0=new n.Vector4(0,r,0,0),C0=new n.Vector4(0,0,0,0);[[-3,-7,-7,2.2,0],[4,6,-2,2.6,0],[16,2,-5,3.4,0],[2,-da,-4,1.8,-1],[8,da,-8,2.4,1]].forEach(([e,t,o,s,h])=>{V0.push(e,t*r,o,s),gt.push(0,0,fa*1.85*Y.range(.95,1.1),Y()),wt.push(3,h*r,-.34*r,0)});const M0=new n.InstancedBufferGeometry().copy(Do(ae));M0.setAttribute("iA",new n.InstancedBufferAttribute(new Float32Array(V0),4)),M0.setAttribute("iB",new n.InstancedBufferAttribute(new Float32Array(gt),4)),M0.setAttribute("iC",new n.InstancedBufferAttribute(new Float32Array(wt),4)),M0.instanceCount=V0.length/4;const ma=ae==="frigate"?[.05,.35]:ae==="booby"?[.32,2.6]:[.48,3.4],St=new n.Mesh(M0,new n.ShaderMaterial({uniforms:{...Ge(),uTime:X,uTb:ue,uPx:ee,uShip:oa,uEscC:{value:kt},uEscF:{value:pa},uEscK:{value:_0},uEscW:{value:C0},uEscWide:{value:Ja},uFlap:{value:new n.Vector2(ma[0],ma[1])}},vertexShader:bo,fragmentShader:ko,side:n.DoubleSide,fog:!0}));St.frustumCulled=!1,St.name="sea-birds",D.add(St),await i.yield();const Qe=i.rng.fork("fish"),O0=[],va=[],eo=Math.max(40,Math.round(60*N));for(const e of[-2.6,-.9,2.2])for(let t=0;t<eo;t++){const o=e+Qe()*1.4,s=Qe.range(15,52),h=we(o/Tt)+s/V;Q.pointAt(h,Ee),Q.tangentAt(Math.max(h,0),Ie),A0.set(-Ie.z,0,Ie.x).normalize();const m=Qe.range(-1,1),B=m*(5+s*.26),C=m*.75+Qe.range(-.2,.2),z=Ie.x*Math.cos(C)+A0.x*Math.sin(C),O=Ie.z*Math.cos(C)+A0.z*Math.sin(C),b=Math.hypot(z,O)||1;O0.push(Ee.x+A0.x*B,Ee.z+A0.z*B,z/b,O/b),va.push(o,Qe.range(14,19),Qe.range(1.75,2.35),Qe())}const ga=new n.InstancedBufferAttribute(new Float32Array(O0),4),wa=new n.InstancedBufferAttribute(new Float32Array(va),4),G0=new n.InstancedBufferGeometry().copy(Ko());G0.setAttribute("iA",ga),G0.setAttribute("iB",wa),G0.instanceCount=O0.length/4;const ya={value:p.lift},zt=new n.Mesh(G0,new n.ShaderMaterial({uniforms:{...Ge(),uKey:{value:1.25},uTime:X,uTb:ue,uSeaY:ya},vertexShader:So,fragmentShader:zo,side:n.DoubleSide,fog:!0}));zt.frustumCulled=!1,zt.name="flying-fish",D.add(zt);const h0=new n.InstancedBufferGeometry;h0.setAttribute("position",new n.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),h0.setIndex([0,1,2,0,2,3]),h0.setAttribute("iA",ga),h0.setAttribute("iB",wa),h0.instanceCount=O0.length/4;const U0=new n.Mesh(h0,new n.ShaderMaterial({uniforms:{...j(),uTime:X,uTb:ue,uSeaY:ya,uPx:ee,uFoamLit:{value:De}},vertexShader:Ao,fragmentShader:Co,transparent:!0,depthWrite:!1,fog:!0,premultipliedAlpha:!0,side:n.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-6}));U0.frustumCulled=!1,U0.renderOrder=-5.4,U0.name="fish-skitter",D.add(U0),await i.yield();const At=za.makeParticles({rng:i.rng.fork("rain"),preset:"rain",count:Math.round(2600*N),time:X,colors:y?["#8fa8d8","#6f88c0","#b8c8f0"]:["#e6eef4","#c8d6e6","#ffffff"],opacity:0});D.add(At.object),await i.yield();let f0=null;k&&(f0=za.makeRainbow({sunDir:he,intensity:.25,secondary:!0}),f0.object.traverse(e=>{e.renderOrder=-3.9}),D.add(f0.object));const to={exposure:a.post.exposure*(p.squall?1.04:1),bloom:{...a.post.bloom},grade:{...a.post.grade,saturation:a.post.grade.saturation*(p.squall?.93:1)}};await i.yield(),await ge.prewarm(i.renderer,null,D);const ao=new n.Vector2,xa=g(),oo=a.sea.smearW||1,Ct=e=>{const t=Math.sin(e*127.1+3.7)*43758.5453;return t-Math.floor(t)};function so(e,t,o,s){s=xe(s??0,0,1);const h=Le(s),m=h/Tt;X.value=t,ue.value=h;const B=i.renderer.getDrawingBufferSize(ao).y||450;if(ee.value=2/(Math.max(o.projectionMatrix.elements[5],.2)*B),K.setProgress(s),K.update(e,t,o),ge.update(e,t,o),Oe.update(e,t,o),ke.update(e,t,o),E0.update(e,t,o),W0.update(e,t,o),At.update(e,t,o),f0&&(f0.update(e,t,o),f0.uniforms.uIntensity.value=.25*(1-.65*ie(.72,.86,s))),Ye.position.x=o.matrixWorld.elements[12],Ye.position.z=o.matrixWorld.elements[14],Q0||et){const f=ie(0,70,o.matrixWorld.elements[13]);Q0&&Q0.value.copy(J0).lerp(Rt,f),et&&et.value.copy(J0).lerp(Rt,f)}P0&&(P0.value=Ea*(1-.75*ie(80,230,o.matrixWorld.elements[13]))),xa.setFromMatrixPosition(o.matrixWorld),He.copy(L).sub(xa);const C=Math.max(He.length(),1);ut.uFar.value=ie(60,300,C),ut.uVis.value=ie(.45,.85,He.dot(y0)/C),ot.uGustZ.value=-420+42.6*h;for(let f=0;f<6;f++){const d=K.sisters[f],A=d.life;tt[f].set(d.base.x,d.base.y+ze,(A.foot<60?A.alpha:0)*(.5+.5*A.thin),(d.waist*1.1+3)*oo)}a0(s,N0),oa.value.copy(N0);for(const f of aa){const d=N0.x+f.off.x,A=N0.z+f.off.z,P=ke.heightAt(d,A,t);f.mesh.position.set(d,P*.5-.15,A),f.mesh.rotation.set(.05*Math.sin(t*.9+f.ph),-Math.PI/2*r,r*Oa*(1+.1*Math.sin(t*.6+f.ph)),"YXZ"),f.wake.position.set(d,p.lift+.3,A),f.wake.rotation.y=-Math.PI/2*r,f.spray.position.set(d,p.lift+.2+.4*P,A),f.spray.rotation.y=-Math.PI/2*r}for(let f=0;f<ha.length;f++){const d=ha[f],A=sa*(h-Le(0)),P=d.x+d.dx*A,R=d.z+d.dz*A,ne=ke.heightAt(P,R,t);d.mesh.position.set(P,ne*.5-.1,R),d.mesh.rotation.set(.06*Math.sin(t*1.1+d.ph[0]),d.yaw,r*.3*(1+.12*Math.sin(t*.7+d.ph[1])),"YXZ"),d.wake.position.set(P,p.lift+.3,R),d.wake.rotation.y=d.yaw,ot.uLug.value[f].set(P,R,d.dx,d.dz),d.spray.position.set(P,p.lift+.2+.4*ne,R),d.spray.rotation.y=d.yaw}{const f=ke.heightAt(H0.x,H0.z,t);z0.position.set(H0.x,f*.5-.1,H0.z),z0.rotation.set(.09*Math.sin(t*1.05+vt[0]),Xa+.14*Math.sin(t*.17+vt[1]),.07*Math.sin(t*.66+vt[2]),"YXZ")}{const f=s*V,d=Le(U/V)-h,A=$a*(d>0?d*d/(d+1.5):0),P=Math.min(f+Ya+A,V);bt(P,kt),pa.subVectors(bt(P+2,Ee),bt(P-2,Ie)).normalize();const R=kt.distanceTo(L),ne=f-se,Me=ua-R;_0.x=ie(0,110,ne),_0.z=ie(60,150,ne),_0.w=.55*(ne>0?ne*ne/(ne+40):0),C0.x=1-ie(ua,Lt,R),C0.y=ie(0,110,Me),C0.z=ie(60,150,Me),C0.w=.55*(Me>0?Me*Me/(Me+40):0)}const z=p.rain*T0(m,.28,.52,.3),O=Math.max(T0(m,.15,.2,.5),T0(m,.265,.305,.5),T0(m,.355,.42,.4),.45*T0(m,.56,.86,.2));At.setOpacity(xe(Math.max(z,.8*O),0,1)*.75);const b=ie(.02,.05,m)*(1-ie(.8,.9,m)),x=.5+.5*Math.sin(t*.35+1)*Math.sin(t*.23);if(Oe.sun.intensity=We*Se(1,.3+.5*x*x,b),y){const d=Math.floor(t/3.6),A=t-d*3.6;st.uFlash.value=(Ct(d)>.25?1.3:0)*ie(0,.1,A)*Math.exp(-Math.max(A-.1,0)/.3),st.uFlashPos.value.set(r*(-300+900*Ct(d+7.3)),L0,-500-1100*Ct(d*1.7+3.1))}}return{scene:D,path:Q,duration:d0,pace:qa,camera:{fov:62,near:.5,far:7200,lookAhead:30,sway:1,bank:{valueOf:()=>Ke(Ze)}},pois:Ka,portal:{shape:"circle",radius:Z0,color:"#BFF3EE",glow:1.5,revealDistance:900,tilt:!0},post:to,ride:"biplane",update:so,dispose(){ge.dispose(),K.dispose()}}}};export{No as default};
