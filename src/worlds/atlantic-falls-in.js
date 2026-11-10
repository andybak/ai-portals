import*as e from"three";import{makePath as C0,smoothstep as j,clamp as c0,lerp as Q}from"../kit/core.js";import{makeSky as V0}from"../kit/sky.js";import{buildHero as I0,buildGannets as T0,FLOOD_FAR as q0,normalsAsync as E0}from"../parts/atlantic-falls-in.js";const u0=520,e0=Math.PI*2,v0=[{u0:.083,ahead:20,side:5.5},{u0:.097,ahead:6,side:-4}],X=t=>{const M=Math.sin(t*127.1+311.7)*43758.5453;return M-Math.floor(M)},G0={gold:{palette:["#1C4FA0","#2F9C8E","#F3F7F5","#C9A46A","#EFE6D2","#8FB0CF","#F4C56A"],sunDir:[-.828,.407,.386],sunColor:"#F9DDA6",sunI:1.18,sky:"#5E8FD0",skyI:.42,bounce:"#C9A46A",bounceI:.3,zenith:"#2E66B8",horizon:"#8FB0CF",ground:"#B5A68E",fog:"#9BB3CC",fogD:4e-4,shade:"#5F7FA8",cloudLit:"#FBEBC6",cloudShade:"#7F9FC4",floorA:"#C9A46A",floorB:"#EFE6D2",exposure:1,preset:"day",disc:0},noon:{palette:["#1A58B0","#27B3A6","#F3F7F5","#CDB58C","#DDD3BC","#9FBEDB","#FFF3D0"],sunDir:[-.52,.8,.3],sunColor:"#FFF6E6",sunI:1.15,sky:"#6FA2E0",skyI:.46,bounce:"#D8C8A4",bounceI:.34,zenith:"#2A6DC8",horizon:"#A9C8E4",ground:"#C4BBA6",fog:"#AEC6DD",fogD:36e-5,shade:"#526E96",cloudLit:"#FFFFFF",cloudShade:"#8FA9C8",floorA:"#B89868",floorB:"#E4D9BE",exposure:.9,preset:"day",disc:0},pearl:{palette:["#2A4F86","#3A9488","#EDF1F0","#B5A58A","#DDD8CA","#A3B2C2","#F1EAD8"],sunDir:[-.7,.62,.36],sunColor:"#E9E6DE",sunI:.74,sky:"#9FB0C4",skyI:.78,bounce:"#B7AC98",bounceI:.34,zenith:"#8D9CB0",horizon:"#C3CBD2",ground:"#B3AEA2",fog:"#B4BEC8",fogD:46e-5,shade:"#64788F",cloudLit:"#E8E8E4",cloudShade:"#7C8A9C",floorA:"#B9A886",floorB:"#E2DCCB",exposure:1.04,preset:"overcast",disc:0}},f0=`
#ifdef USE_FOG
varying float vFogDepth;
#endif
`,p0=`
#ifdef USE_FOG
uniform vec3 fogColor; uniform float fogDensity; varying float vFogDepth;
#endif
vec3 fogMix(vec3 c){
#ifdef USE_FOG
  return mix(c, fogColor, 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth));
#else
  return c;
#endif
}
float fogAmt(){
#ifdef USE_FOG
  return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
#else
  return 0.;
#endif
}
`,h0=`
float h21(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm3(vec2 p){ return 0.5 * vn(p) + 0.3 * vn(p * 2.03 + 17.1) + 0.2 * vn(p * 4.11 + 41.7); }
`,U0=()=>e.UniformsUtils.clone(e.UniformsLib.fog),d0=(t,M,I,F,w,s={})=>{const S=U0();for(const L of M)S[L]=t[L];return Object.assign(S,I||{}),new e.ShaderMaterial({uniforms:S,vertexShader:F,fragmentShader:w,fog:!0,...s})},H0=[[330,-500],[400,-610],[520,-690],[680,-680],[900,-590],[1200,-450],[1600,-340],[2300,-380],[3300,-620],[4600,-1100]];function _0(){const t=new e.CatmullRomCurve3(H0.map(w=>new e.Vector3(w[0],0,w[1])),!1,"centripetal"),M=240,I=t.getSpacedPoints(M);return{pts:I,zAt:w=>{if(w<=I[0].x)return I[0].z-(I[0].x-w)*.2;for(let s=1;s<=M;s++)if(I[s].x>=w){const S=I[s-1],L=I[s],b=(w-S.x)/Math.max(L.x-S.x,.001);return S.z+(L.z-S.z)*b}return I[M].z},N:M,curve:t}}const w0=t=>{const M=t+u0,I=Math.max(M-330,0);return-4*j(200,330,M)-(I-185*(1-Math.exp(-I/185)))},j0=t=>t?{sea:1,x:3900,z:350,r:1750,level:-656,chEnd:2060}:{sea:0,x:2450,z:420,r:290,level:-672,chEnd:2200},z0=t=>Q(30,140,j(540,1900,t)),k0=t=>130+660*Math.pow(1-j(540,1900,t),1.6),N0=t=>t<540?w0(t)-34:Q(-587,-652,j(540,1e3,t));function O0(t,M,I,F,w){const s=N0(t),S=Math.abs(M-z0(t))/k0(t),L=.1*F.n2(t*.0042,M*.0042)+.05*F.n2(t*.012,M*.012+7),b=.34*j(.93,1,S+L)+.66*j(1.05,1.2,S+1.5*L+.03*F.n2(t*.03,M*.03));let p=s+46*j(700,1300,t)*b;p+=300*j(1100,2300,M)*j(300,900,t);const x=j(900,2200,t)*(.3+.7*b);p+=x*(26*F.fbm2(t*.0011,M*.0011,3)+9*F.n2(t*.006,M*.006));const O=Math.hypot(t-w.x,M-w.z);for(let C=0;C<5;C++){const E=2700+900*C+500*X(C*3.1),v=-900+2600*X(C*7.7+2),c=380+300*X(C+9),B=((t-E)*(t-E)+(M-v)*(M-v))/(c*c),u=w.sea?1:j(500,1e3,Math.hypot(E-w.x,v-w.z))*j(250,600,Math.abs(v-140)+Math.max(E-w.chEnd,0));p+=u*(230+160*X(C+4))*Math.exp(-B*1.6)*(.8+.25*F.n2(t*.004+C,M*.004))}return p-(w.sea?90*(1-j(w.r*.72,w.r*1.08,O)):80*(1-j(w.r*.5,w.r*1.3,O))+46*(1-j(w.r*.9,w.r*1.5,O)))}const R0=`
varying vec3 vP, vN; varying float vTerr;
attribute float aTerr;
${f0}
void main(){ vP = position; vN = normal; vTerr = aTerr; vec4 mv = modelViewMatrix * vec4(position, 1.);
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix * mv; }`,K0=`
precision highp float;
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce, uCam, uHaze, uWhite, uGreen, uFloorA, uFloorB, uLakeCol, uShalCol, uFarCol, uShade;
uniform float uTime, uShafts, uProg;
uniform vec4 uCl[14];
uniform vec4 uBasin;                      // the standing water: centre x, z, radius, level
uniform vec2 uCh;                         // x where the chute meets it; 1 when it is the sea
uniform vec4 uTow; uniform vec2 uTowD;    // the spray tower's shadow on the floor: centre x, z, radius along and across the sun's line; that line
varying vec3 vP, vN; varying float vTerr;
${p0}
${h0}
${q0}
float rampY(float bx){ float u = max(bx - 330., 0.); return -4. * smoothstep(200., 330., bx) - (u - 185. * (1. - exp(-u / 185.))); }
void main(){
  vec2 p = vP.xz; float dist = length(uCam - vP);
  float n1 = fbm3(p * 0.0016 + 3.), n2 = fbm3(p * 0.0075), n3 = vn(p * 0.03);
  float lod = 1. - smoothstep(900., 2600., dist);
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float steep = clamp((1. - N.y) * 5., 0., 1.);
  // salt pans (white) on the flats, ochre fans and gypsum on anything that slopes, scree under the old coast
  float salt = smoothstep(0.30, 0.50, n1 + 0.25 * n2 - vTerr * 0.5 - steep * 0.6);
  vec3 col = mix(mix(uFloorA, uFloorB, 0.3 + 0.3 * steep) * (0.6 + 0.45 * n2), uFloorB * (0.84 + 0.18 * n3), salt);
  col = mix(col, mix(uFloorB * 0.6, uShade, 0.4) * (0.6 + 0.4 * n3), vTerr * 0.7 * (0.6 + 0.4 * vn(vec2(p.x * 0.05, p.y * 0.012))));
  // salt polygons: cells that fade to their mean tone before they pass two pixels
  vec2 g = p / 46.; vec2 gi = floor(g), gf = fract(g); float e1 = 1., e2 = 1.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 o = vec2(float(i), float(j)); vec2 c = o + vec2(h21(gi + o), h21(gi + o + 71.3)) - gf; float d = dot(c, c); if (d < e1) { e2 = e1; e1 = d; } else if (d < e2) e2 = d; }
  float edge = smoothstep(0.0, 0.16, sqrt(e2) - sqrt(e1));
  col *= mix(1., 0.80 + 0.2 * edge, salt * lod);
  // the chute's course (the same numbers as chZc / chHw in the world file)
  float sx = smoothstep(540., 1900., vP.x), zc = mix(30., 140., sx), hw = 130. + 660. * pow(max(1. - sx, 1e-4), 1.6);
  float cn = (vP.z - zc) / hw, acn = abs(cn);
  // dry river canyons: branching dark lines with a lit lip, cut into the plain (not across the flood's own channel)
  float cw = abs(fbm3(p * 0.0011 + vec2(n2 * 0.25, 7.)) - 0.5), cw2 = abs(fbm3(p * 0.0031 + vec2(3., n1 * 0.4)) - 0.5);
  float plain = smoothstep(1.05, 1.5, acn) * smoothstep(900., 1500., vP.x) * (1. - steep);
  float can = max(1. - smoothstep(0.004, 0.012, cw), 0.7 * (1. - smoothstep(0.003, 0.008, cw2)) * lod) * plain;
  col = mix(col, mix(uShade, uFloorA, 0.3) * 0.75, can * 0.75);
  col = mix(col, uFloorB * 1.08, 0.4 * plain * smoothstep(0.012, 0.016, cw) * (1. - smoothstep(0.016, 0.03, cw)));
  // cloud shadows (matched to the cumulus) or, under overcast, roaming shafts of light; slopes take the sun by facing
  float sh = 0.;
  for (int i = 0; i < 14; i++) { vec2 d = (p - uCl[i].xy) / max(uCl[i].z, 1.); d.x *= 0.8; sh = max(sh, 1. - smoothstep(0.55, 1.05, length(d) + 0.3 * n2)); }
  float lit = mix(1. - 0.62 * sh, 0.16 + 2.5 * sh, uShafts);
  float ndl = clamp(dot(N, uSunDir) / max(uSunDir.y, 0.25), 0., 1.7);
  col *= uSunCol * (0.74 * lit * ndl) + uSkyCol * (0.62 + 0.25 * N.y) + uBounce * 0.2;
  col = mix(col, col * vec3(0.55, 0.68, 1.0), 0.55 * sh * (1. - uShafts));
  vec2 dT = p - uTow.xy; float tsh = (1. - smoothstep(0.45, 1.1, length(vec2(dot(dT, uTowD) / uTow.z, dot(dT, vec2(-uTowD.y, uTowD.x)) / uTow.w)) + 0.35 * (n2 - 0.5))) * (1. - smoothstep(0.40, 0.47, uProg));
  float footK = smoothstep(0.30, 0.80, vTerr + 0.35 * (n2 - 0.5) + 0.15 * (n3 - 0.5));
  col = mix(col, mix(uFloorA, uShade, 0.48) * (0.44 + 0.3 * n3) * (0.62 + 0.5 * vn(p * 0.33)) * (uSkyCol * 1.5 + uBounce * 0.4 + uSunCol * 0.12), footK * 0.92);
  // the gale that follows the water lifts salt off the pans: pale streamers racing east across the floor
  float blow = fbm3(vec2((p.x - uTime * 34.) * 0.004 + p.y * 0.002, p.y * 0.03 + 1.7 * n1));
  col = mix(col, vec3(1.0, 0.98, 0.95) * (uSunCol * 1.0 * lit + uSkyCol * 0.95), 0.62 * smoothstep(0.50, 0.66, blow) * (1. - 0.6 * steep) * smoothstep(800., 1400., vP.x) * (1. - footK) * (1. - 0.35 * salt) * smoothstep(0.50, 0.64, uProg));      // seen from over the void, not through the haze from the lip
  // THE LOWER CHUTE: the flood running on down its channel to the standing water: one tongue of torn white water whose
  // marks run ALONG the flow, a few standing waves near its head only, dark wet ragged banks.
  float bedY = vP.x < 540. ? rampY(vP.x + 520.) - 34. : mix(-587., -652., smoothstep(540., 1000., vP.x));
  float hb = vP.y - bedY, shoreH = vP.x < 540. ? 34. : 13.;
  float inX = 1. - smoothstep(uCh.x - 40., uCh.x + 70., vP.x + 60. * (n2 - 0.5));
  float corridor = (1. - smoothstep(0.90, 0.99, acn + 0.06 * (n2 - 0.5))) * inX;
  float chute = corridor * (1. - smoothstep(shoreH + 1., shoreH + 7., hb));
  float wenv = smoothstep(480., 640., vP.x);
  // (1) STANDING WAVES: four or five only, in the upper reach, unequally spaced, every crest broken along its length; they die
  // away downstream into streaked white. ci is the crest's number, dq the distance from it in periods (- upstream, + lee).
  float qx = (vP.x - 760.) / 172.;
  float q = qx + 0.42 * sin(qx * 1.7 + 0.8) - 0.9 * acn * (0.5 + 0.5 * acn) + 1.5 * (fbm3(p * 0.0026 + 11.) - 0.5) + 0.5 * (n2 - 0.5) + 0.2 * (vn(p * 0.021 + 5.) - 0.5);
  float ci = floor(q + 0.5), dq = q - ci;
  float tear = vn(vec2((vP.x - uTime * 38.) * 0.02, vP.z * 0.05));
  float brk = smoothstep(0.26, 0.5, vn(vec2(vP.z * 0.011 + ci * 17.3, ci * 3.1 + 0.5)));
  float str = wenv * smoothstep(0.5, 0.9, ci) * (1. - smoothstep(4.5, 5.6, ci)) * (1. - 0.68 * smoothstep(2.2, 5.2, q)) * (0.72 + 0.28 * h21(vec2(ci, 3.))) * (0.3 + 0.7 * brk);
  float sunUp = clamp(-uSunDir.x * 1.3, 0., 1.);
  float face = smoothstep(-0.36, -0.07, dq) * (1. - smoothstep(-0.03, 0.02, dq));               // the upstream face climbs toward the sun: bright glass
  float lee = smoothstep(0.0, 0.05, dq) * (1. - smoothstep(0.10, 0.32, dq));                    // the short lee falls away in blue shadow
  float crestL = str * (1. - smoothstep(0.012, 0.06 + 0.06 * tear, abs(dq - 0.004)));          // the torn white line itself
  float crestW = str * smoothstep(0.0, 0.03, dq) * (1. - smoothstep(0.04, 0.26, dq + 0.16 * (tear - 0.5)));      // foam trailing from it
  float waveL = 1. + str * sunUp * (0.6 * face - 0.7 * lee);
  // (2) THE GRAIN OF THE TONGUE: foam lanes in flow coordinates (across = the channel's own normalised width, so the lanes
  // converge as it narrows; along = metres downstream minus time, so everything slides at 30 to 46 m/s). These are the
  // dominant marks: long white streaks, thinner green-glass slivers between them, flecks racing down the lanes.
  float lodS = 1. - smoothstep(1100., 3000., dist), lodM = 1. - smoothstep(2200., 5200., dist);
  float sA = vP.x - uTime * 38., sB = vP.x - uTime * 30., sC = vP.x - uTime * 46.;
  float am = cn * hw;                                                                    // metres from the centre line: marks keep their size, they never fan
  float wob = fbm3(vec2(vP.x * 0.0017, cn * 1.6) + 3.) - 0.5;
  am += 46. * wob + 9. * (vn(vec2(sB * 0.006, am * 0.02)) - 0.5);                           // the lanes wander and braid
  // (2) THE GRAIN OF THE TORRENT, in flow coordinates (metres across, metres downstream minus time, so everything slides at
  // 30 to 46 m/s): foam rafts a few lengths long, never hairlines; and the DIAMONDS a supercritical flood stands in,
  // oblique shock waves off both banks crossing each other, white on their crests, glass green in the pockets between.
  float l1 = vn(vec2(am * 0.017 + 3., sA * 0.0042));
  float l2 = vn(vec2(am * 0.041 + 9., sB * 0.011 + 5.));
  float l3 = vn(vec2(am * 0.10 + 31., sC * 0.026));
  float l4 = vn(vec2(am * 0.24 + 7., sA * 0.062 + 2.));
  float lane = 0.34 * l1 + 0.30 * l2 + 0.22 * mix(0.5, l3, 0.35 + 0.65 * lodM) + 0.14 * mix(0.5, l4, lodS);
  float dw = 190. * (fbm3(p * 0.0024 + 21.) - 0.5) + 60. * (vn(p * 0.009 + 3.) - 0.5), dA = am + vP.x * 0.62 + dw, dB = am - vP.x * 0.62 - 0.6 * dw + 80. * (vn(p * 0.0061 + 40.) - 0.5);
  float r1 = 0.5 + 0.5 * cos(6.2831853 * dA / 236.), r2 = 0.5 + 0.5 * cos(6.2831853 * dB / 204. + 1.7);
  r1 *= r1 * r1; r2 *= r2 * r2;
  float dia = max(r1 * smoothstep(0.35, 0.6, vn(p * 0.0047 + 3.)), r2 * smoothstep(0.4, 0.65, vn(p * 0.0041 + 17.))) * wenv, pocket = (1. - r1) * (1. - r2);
  float tearD = vn(vec2(sC * 0.03, am * 0.08));
  float diaW = smoothstep(0.50, 0.80, dia + 0.25 * (tearD - 0.5));                          // the torn white crest of each diamond
  float boil = smoothstep(uCh.x - 300., uCh.x, vP.x);
  float edgeF = smoothstep(0.80, 0.95, acn + 0.12 * (l2 - 0.5)) * wenv;
  float core = (1. - smoothstep(0.25, 0.75, acn)) * (0.6 + 0.4 * pocket);                   // the fast smooth core runs greener than the torn margins
  float foamK = smoothstep(0.45 + 0.09 * core, 0.53 + 0.08 * core, lane + 0.06 * (1. - pocket));
  float ff = clamp(foamK + 0.75 * diaW + crestW * 0.8 + crestL + 0.8 * edgeF + 0.8 * boil, 0., 1.);
  ff = mix(clamp(floodFoam(p, uTime) * 0.75 + 0.2, 0., 1.), ff, wenv);
  vec3 wcol = uWhite * 0.74 * (uSunCol * 0.72 + uHaze * 0.42 + uSkyCol * 0.32);
  float relief = 1. + sunUp * wenv * (0.55 * (r1 + r2) - 0.30) * (0.6 + 0.4 * lodM);        // each diamond lit on the face that climbs toward the sun
  vec3 gcol = mix(uGreen, uWhite, 0.10) * 0.80 * (uSkyCol * 0.95 + uSunCol * 0.72 * waveL * relief) + uSunCol * uGreen * 0.45 * str * face * sunUp;
  gcol *= 0.82 + 0.36 * l2;
  vec3 wcolW = uWhite * 0.80 * (uSunCol * 0.88 * waveL * relief + uSkyCol * 0.62 + uHaze * 0.22);          // white water in the sun: the brightest thing on the floor, brighter than the salt
  wcolW *= mix(vec3(1.), vec3(0.74, 0.93, 0.90), 0.6 * (1. - smoothstep(0.50, 0.66, lane)) * wenv * (1. - diaW));      // thin foam: the jade shows through
  wcolW *= (0.92 + 0.16 * l3) * (1. - 0.14 * lodS * (1. - l4));
  wcolW *= 1. - 0.22 * smoothstep(0.5, 0.75, tearD) * (0.35 + 0.65 * lodM) * wenv * (1. - diaW);          // torn gaps racing down at 46 m/s
  vec3 fl = mix(gcol, wcolW, ff) * mix(1., 0.60 + 0.40 * lit, wenv);
  fl = mix(fl, fl * vec3(0.52, 0.70, 1.04), 0.8 * str * lee * sunUp);                      // the lee in blue shadow
  fl = mix(fl, fl * vec3(0.66, 0.80, 1.0), 0.5 * wenv * sunUp * smoothstep(0.25, 0.7, max(r1, r2)) * (1. - diaW));     // and the lee of each diamond
  fl *= 1. + 0.3 * crestL;
  // dark wet rock banks with a ragged outline: wet and near black at the water, drying upward to grey-ochre ledges
  float bn = 0.20 * (n2 - 0.5) + 0.09 * (n3 - 0.5) + 0.06 * (vn(p * 0.09) - 0.5) + 0.03 * (vn(p * 0.27) - 0.5) * lodS;
  float bankK = (1. - smoothstep(1.0, 1.30, acn + bn)) * inX * wenv * (1. - 0.85 * smoothstep(36., 52., hb + 22. * (n2 - 0.5) + 8. * (n3 - 0.5)));
  float wetB = 1. - smoothstep(shoreH + 2., shoreH + 26., hb + 18. * (n3 - 0.5) + 12. * (vn(p * 0.012 + 3.) - 0.5));
  float lq = hb / 7. + 1.6 * n2 + 0.5 * n3, ledgeB = smoothstep(0.7, 0.95, fract(lq)), ledgeT = 0.62 + 0.7 * h21(vec2(floor(lq), 5.));
  vec3 bankC = mix(mix(uFloorA, uShade, 0.42) * (0.34 + 0.26 * n3) * ledgeT * (1. - 0.55 * ledgeB) * (0.7 + 0.6 * vn(p * 0.21)), mix(uShade, uFloorA, 0.3) * (0.16 + 0.16 * n3), wetB);
  col = mix(col, bankC * (uSunCol * 0.55 * lit * (0.5 + 0.5 * ndl) + uSkyCol), bankK * mix(0.62, 0.92, wetB));
  col = mix(col, fl, chute);
  float edgeN = acn + 0.06 * (n2 - 0.5) + 0.02 * (vn(p * 0.05 + vec2(uTime * 0.6, 0.)) - 0.5);
  col = mix(col, wcol, 0.8 * wenv * inX * smoothstep(0.90, 0.955, edgeN) * (1. - smoothstep(0.985, 1.03, edgeN)) * smoothstep(0.30, 0.55, vn(p * 0.017 + vec2(uTime * 0.5, 3.))));      // a thin broken wash
  // where the flood laps the scree: wet rock and a white wash, never a hard edge
  float wash = corridor * (1. - chute) * (1. - smoothstep(shoreH + 2., shoreH + 30., hb));
  col = mix(col, col * 0.55, wash * 0.8);
  col = mix(col, wcol, wash * (1. - smoothstep(shoreH + 3., shoreH + 16., hb + 8. * (vn(p * 0.07 + vec2(uTime * 0.4, 0.)) - 0.5))));
  // THE STANDING WATER: jade in the first weeks, a blue sea months on. Pale shallows, a foam shore that follows the
  // ground, wind lanes, cloud shadow, a twinkle of sun, and the silt of the flood fanning out from the mouth.
  float dl = length(p - uBasin.xy);
  float wd = uBasin.w - (vP.y + 9. * (fbm3(p * 0.004 + 5.) - 0.5) + 3. * (n3 - 0.5) * lod);
  float inB = (1. - smoothstep(uBasin.z * 1.5, uBasin.z * 1.62, dl)) * smoothstep(uCh.x - 120., uCh.x + 40., vP.x);
  float lake = smoothstep(0., 1.4, wd) * inB;
  float shalD = mix(9., 20., uCh.y), shal = 1. - smoothstep(0., shalD, wd);
  vec2 mo = vec2(p.x - uCh.x, (p.y - 140.) * 1.6); float silt = exp(-dot(mo, mo) / mix(9.0e4, 6.4e5, uCh.y)) * (0.6 + 0.6 * vn(vec2((p.x - uTime * 12.) * 0.006, p.y * 0.012)));
  float lanes = vn(vec2(p.x * 0.0035 - uTime * 0.07, p.y * 0.022)) * 0.6 + vn(p * 0.012 - uTime * vec2(0.3, 0.06)) * 0.4;
  vec3 wat = mix(uLakeCol * (0.72 + 0.3 * lanes), uShalCol, max(shal * 0.85, clamp(silt, 0., 1.) * 0.8));
  wat *= uSunCol * (0.5 + 0.4 * lit) + uSkyCol * 1.1;
  float tw = vn(p * 0.09 + uTime * vec2(0.9, -0.6)) * vn(p * 0.13 - uTime * vec2(0.7, 0.5));
  wat += uSunCol * 0.55 * smoothstep(0.5, 0.75, tw) * lit * (0.3 + 0.7 * lod);
  float foamS = (1. - smoothstep(0.3, 2.6, wd)) * (0.55 + 0.45 * vn(p * 0.045 + vec2(uTime * 0.25, 0.)));
  wat = mix(wat, wcol * 1.1, max(foamS, 0.7 * smoothstep(0.55, 0.95, silt) * (1. - uCh.y * 0.5)));
  col = mix(col, col * 0.6, inB * (1. - lake) * (1. - smoothstep(0., 7., -wd)) * 0.7);          // the damp margin
  col = mix(col, wat, lake);
  // haze does the scale: blue-grey veils, then the far tone of the dome below the horizon
  #ifdef USE_FOG
  float fd = fogDensity * 0.62 * vFogDepth, f = 1. - exp(-fd * fd);
  vec3 warm = mix(uFarCol, uHaze, 0.22) * (uSunCol * 0.55 + uSkyCol * 1.1);
  col = mix(col, warm, clamp(f, 0., 1.));
  #endif
  col = mix(col, uHaze * (uSunCol * 0.4 + uSkyCol * 1.5), mix(0.30, 0.16, uShafts) * smoothstep(500., 3000., dist));     // the blue of a kilometre of air
  col *= mix(vec3(1.), vec3(0.62, 0.70, 0.85), tsh * mix(0.85, 0.5, uShafts));      // the spray tower's shadow streams east with the spray: the floor behind it is a step darker than the spray
  gl_FragColor = vec4(col, 1.);
}`,Z0=`
attribute float aLit, aFace, aGul, aBq;
varying vec3 vP, vN; varying float vLit, vFace, vGul, vBq;
${f0}
void main(){
  vec4 lp = vec4(position, 1.); vec3 n = normal;
  #ifdef USE_INSTANCING
  lp = instanceMatrix * lp; n = mat3(instanceMatrix) * (n / max(vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz)), vec3(1e-4)));
  #endif
  vP = lp.xyz; vN = n; vLit = aLit; vFace = aFace; vGul = aGul; vBq = aBq; vec4 mv = modelViewMatrix * lp;
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix * mv; }`,$0=`
precision highp float;
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce, uHaze, uHoney, uBone, uShade, uCam;
varying vec3 vP, vN; varying float vLit, vFace, vGul, vBq;
${p0}
${h0}
uniform float uTime;
float rampY(float bx){ float u = max(bx - 330., 0.); return -4. * smoothstep(200., 330., bx) - (u - 185. * (1. - exp(-u / 185.))); }
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 fN = cross(dFdx(vP), dFdy(vP)); fN = normalize(fN + N * 1e-4); if (dot(fN, N) < 0.) fN = -fN;
  float cliff = 1. - step(1.5, vFace);                                  // 1 on the escarpment's face (aFace 0..1 up it), 0 on plateau, Musa, slab
  vec3 N0 = N;
  N = normalize(mix(N, fN, mix(0.7, 0.40, cliff)));                      // broken planes: every ledge and block has its own facet
  float dC = length(uCam - vP);
  float along = vP.x * 0.8 + vP.z * 0.6;
  float bed = (vP.y - 0.364 * along) / 9. + 0.6 * vn(vec2(along, vP.y) * 0.01);
  float fb = fract(bed), band = h21(vec2(floor(bed), 3.));
  float n = fbm3(vec2(along * 0.012, vP.y * 0.03)), n2 = vn(vec2(along * 0.11, vP.y * 0.3));
  vec3 alb = mix(uHoney * (0.62 + 0.3 * band), uBone * 0.78, smoothstep(0.45, 0.8, n) * 0.6);
  alb *= 0.82 + 0.18 * n2; alb *= 1. - 0.3 * smoothstep(0.86, 1., fb);
  float gully = smoothstep(0.62, 0.8, fbm3(vec2(along * 0.006, 2.)));
  alb *= 1. - 0.25 * gully;
  float flat_ = smoothstep(0.75, 0.95, N.y);
  alb = mix(alb, mix(uHoney, vec3(0.33, 0.36, 0.24), 0.45) * (0.55 + 0.4 * n), flat_ * 0.8);     // scrub and soil on the tops
  alb = mix(alb, uBone * (0.66 + 0.16 * n2), step(1.5, vLit) * (1. - smoothstep(8.6, 9.8, vP.y)));     // blocks below the tide line are freshly broken
  float ndl = max(dot(N, uSunDir), 0.);
  vec3 lit = alb * (uSunCol * ndl * 1.05 + uSkyCol * (0.6 + 0.4 * N.y) + uBounce * (0.55 - 0.45 * N.y));
  // faces turned from the sun settle to deep slate: the calm, dark element the ring hangs against. The form is real:
  // beds step back riser and tread (vBq is the same bed number the geometry stepped on), each bed is jointed into
  // blocks, couloirs hold cast shade, ledge tops take the sky, and grey-ochre scree fans fill the gully mouths.
  float gulS = smoothstep(0.18, 0.72, vGul + 0.25 * (n - 0.5));
  float bi = floor(vBq), fq = fract(vBq), bh = h21(vec2(bi, 9.));
  float jw = 20. + 26. * h21(vec2(bi, 3.)), js = along / jw + 7. * h21(vec2(bi, 40.)) + 0.25 * vn(vec2(vP.y * 0.05, bi));
  float ji = floor(js), jf = fract(js), blockT = h21(vec2(ji, bi + 5.));
  float mUp = step(h21(vec2(bi, 55.)), 0.45), mDn = step(h21(vec2(bi - 1., 55.)), 0.45);        // this bed runs on into the one above / below: beds two and three times as thick as others
  float plainK = smoothstep(0.50, 0.66, fbm3(vec2(along * 0.0045 + 9., vP.y * 0.006)));          // whole faces left unbroken between the jointed ones
  bh = h21(vec2(bi - mDn, 9.));
  float joint = (1. - smoothstep(0.0, 0.07, jf)) * step(0.35, h21(vec2(ji, bi + 17.))) * step(0.4, h21(vec2(bi - mDn, 71.))) * (1. - plainK);
  blockT = mix(blockT, 0.5, max(plainK, 1. - step(0.4, h21(vec2(bi - mDn, 71.)))));
  float tread = smoothstep(0.66, 0.84, fq + 0.1 * (n2 - 0.5)) * (1. - 0.85 * mUp), under = (1. - smoothstep(0.0, 0.2, fq + 0.1 * (n2 - 0.5))) * (1. - 0.85 * mDn);
  float sub = (1. - plainK) * (1. - smoothstep(0.0, 0.12, fract(vBq * 3.7 + 0.4 * vn(vec2(along * 0.02, bi))))) * smoothstep(0.35, 0.65, vn(vec2(along * 0.04 + bi * 5.1, bi)));
  float stain = vn(vec2(along * 0.11 + bi * 13., fq * 1.6)) * smoothstep(0.4, 0.7, vn(vec2(along * 0.013, bi * 0.7)));     // short drip stains that end at each ledge
  float side = clamp(dot(N, vec3(0.80, 0.0, 0.60)) * 0.5 + 0.5, 0., 1.), topL = clamp(N.y, 0., 1.) * (1. - 0.7 * mUp * smoothstep(0.5, 0.9, fq));
  float fineB = (1. - smoothstep(0.0, 0.18, fract(vBq * 8.3 + 0.3 * n2))) * (1. - 0.6 * plainK) * (1. - smoothstep(500., 1700., dC));      // thin partings inside each bed
  float form = 0.50 + 0.60 * side * side + 0.9 * topL + 0.35 * tread - 0.12 * fineB;                         // light off the bright basin on one flank, sky on every ledge
  form *= mix(1.16, 0.56, gulS) * (1. - 0.36 * under) * (1. - 0.5 * joint * (1. - tread)) * (1. - 0.16 * sub) * (1. - 0.3 * stain * (1. - tread));
  float tone = (0.80 + 0.30 * bh) * (0.90 + 0.20 * blockT) * (0.86 + 0.28 * fbm3(vec2(along * 0.006 + bi * 0.7, vP.y * 0.004)));
  // POLISH 2: the old coast is the Rock's own limestone in shade: thin tilted beds, each its own tone, in warm and cool groups,
  // a dark parting under the harder ones and rain flutes down the risers. Fine grain is what makes it read 700 m high.
  float sK = 1. - smoothstep(900., 2600., dC), sI = floor(bed), sT = h21(vec2(sI, 21.)), sG = h21(vec2(floor(bed / 5. + 0.3 * vn(vec2(along * 0.003, 5.))), 33.));
  float sB2 = bed * 3.1 + 0.4 * n2, sT2 = h21(vec2(floor(sB2), 47.));
  float strataL = (0.76 + 0.40 * sT) * (0.84 + 0.30 * sG) * (1. - 0.5 * (1. - smoothstep(0.0, 0.18, fb)) * step(0.35, sT)) * (0.90 + 0.2 * sT2 * (1. - smoothstep(300., 1100., dC)));
  float flute = 0.84 + 0.32 * vn(vec2(along * 0.085, vP.y * 0.011 + sI * 0.31)) * (0.6 + 0.4 * vn(vec2(along * 0.31, vP.y * 0.02)));
  tone *= mix(1., strataL * flute * 1.08, sK);
  float stone = mix(0.72 + 0.5 * h21(vec2(floor(vP.y / 13. + 2. * vn(vec2(along * 0.004, 3.))), 9.)), form * tone, cliff);
  vec3 slate = mix(uShade, vec3(dot(uShade, vec3(0.3, 0.5, 0.2))), 0.5 * cliff) * mix(1., 1.1, cliff);                   // limestone in shade: greyer than the sky, the same stone as the gold rim
  vec3 shade = mix(slate, uHoney * dot(uShade, vec3(0.4)) * 1.15, mix(0.16, 0.20 + 0.42 * sG * sK + 0.14 * sT * sK, cliff)) * mix(0.36 + 0.42 * clamp(dot(N, vec3(0.6, -0.3, 0.74)) * 0.6 + 0.5, 0., 1.) + 0.42 * smoothstep(0.35, 0.8, N.y), 0.70, cliff) * stone * (0.9 + 0.2 * n2) * (1. - 0.3 * gully * (1. - cliff));
  shade = mix(shade, shade * vec3(1.26, 1.02, 0.74), cliff * clamp(0.4 - 0.9 * N.y + 0.4 * (bh - 0.5), 0., 0.6));      // faces that look down or out take the ochre of the bright floor; ledge tops keep the sky's blue
  float screeE = vFace - 0.13 * vGul + 0.10 * (n - 0.5) + 0.05 * (vn(vec2(along * 0.05, vP.y * 0.04)) - 0.5) + 0.02 * (n2 - 0.5);
  float scree = cliff * (1. - smoothstep(0.10, 0.33, screeE));
  scree = max(scree, cliff * smoothstep(0.55, 0.74, N0.y) * (1. - smoothstep(0.30, 0.45, vFace)));      // POLISH 2: the whole 35 degree apron is scree, to its top
  float grainS = 0.6 * vn(vec2(along, vP.y) * 0.33) + 0.4 * vn(vec2(along, vP.y) * 1.1 + 7.), runS = vn(vec2(along * 0.08, vP.y * 0.009)) * (0.7 + 0.6 * vn(vec2(along, vP.y) * 0.07 + 3.));     // fine grain, then boulders and fall lines
  vec3 screeCol = mix(uHoney, uShade, 0.45) * (0.40 + 0.36 * clamp(dot(N0, vec3(0.80, 0.0, 0.60)) * 0.5 + 0.5, 0., 1.)) * (0.6 + 0.55 * grainS) * (0.86 + 0.26 * runS) * mix(1., 0.72, gulS);
  // POLISH 2: scree is blocks: pale boulders on dark fines at three sizes, so the apron under the cliff has grain instead of a brown smear
  vec2 sp = vec2(along, vP.y * 1.5); float spK = 1. - smoothstep(500., 1600., dC);
  float speck = vn(sp * 0.27) * 0.24 + vn(sp * 0.115 + 7.) * 0.40 + vn(sp * 0.05 + 3.) * 0.36;
  screeCol *= mix(1., mix(0.45, 1.75, smoothstep(0.38, 0.64, speck)), spK);
  shade = mix(shade, screeCol, scree);
  shade += uBounce * mix(0.45, 0.10, cliff) * (1. - smoothstep(-400., 60., vP.y)) * (0.35 + 0.65 * clamp(0.6 - N.y, 0., 1.));
  shade += uBounce * uHoney * 0.55 * cliff * (1. - smoothstep(0.12, 0.5, vFace)) * (0.5 + 0.5 * stone) * (1. - 0.8 * scree * spK);      // warm light off the salt floor in the cliff's lower third      // ochre light off the basin floor under the lower ledges
  float k = clamp(vLit, 0., 1.) * smoothstep(0.0, 0.35, ndl);
  k = mix(k, smoothstep(0.38, 0.62, vLit + 0.6 * (tread - 0.5) + 0.5 * (n - 0.5) + 0.4 * (blockT - 0.5) - 0.45 * gulS) * smoothstep(0.0, 0.3, ndl + 0.25), cliff);     // the gold rim breaks along the top beds and buttress heads, not along a row of the mesh
  vec3 col = mix(shade, lit, k);
  float wy = vP.x < 540. ? rampY(vP.x + 520.) : mix(-587., -652., smoothstep(540., 1000., vP.x)), hw_ = vP.y - wy;
  float wash = cliff * (1. - smoothstep(3., 34., hw_ + 10. * (n - 0.5)));                             // wet rock, then a white wash where the flood laps the scree
  col = mix(col, col * 0.5, wash);
  col = mix(col, vec3(0.62, 0.68, 0.72) * (uSunCol * 0.4 + uSkyCol * 0.9), cliff * (1. - smoothstep(0., 9., hw_ + 9. * (vn(vP.xz * 0.06 + vec2(uTime * 0.5, 0.)) - 0.5))) * 0.8);
  float dist = length(uCam - vP);
  col = mix(col, uHaze * (uSunCol * 0.35 + uSkyCol * 1.5), mix(0.35, 0.10, step(vFace, 2.5)) * smoothstep(400., 2200., dist));
  col = mix(col, fogMix(col), mix(1., 0.55, cliff));                         // the shaded cliff stays the dark shape through a kilometre of air
  gl_FragColor = vec4(col, 1.);
}`;async function X0(t){const{scene:M,U:I,M:F,V:w,ctx:s}=t,S=s.noise,L=_0(),b=j0(w.lakeSea);t.esc=L,t.basin=b,await s.yield();const p=136,x=100,O=new Float32Array(p+1),C=new Float32Array(x+1);for(let T=0;T<=p;T++){const q=T/p;O[T]=250+7400*(.25*q+.75*q*q*q)}for(let T=0;T<=x;T++){const q=T/x*2-1;C[T]=-300+5200*(.3*q+.7*q*q*q)}const E=new Float32Array((p+1)*(x+1)*3),v=new Float32Array((p+1)*(x+1));let c=0;for(let T=0;T<=x;T++){for(let q=0;q<=p;q++,c++){const H=O[q],_=C[T];E[c*3]=H,E[c*3+1]=O0(H,_,L,S,b),E[c*3+2]=_,v[c]=j(430,110,_-L.zAt(H))}await s.yield()}const B=new Uint32Array(p*x*6);let u=0;for(let T=0;T<x;T++)for(let q=0;q<p;q++){const H=T*(p+1)+q,_=H+1,J=H+p+1,W=J+1;B[u++]=H,B[u++]=J,B[u++]=_,B[u++]=_,B[u++]=J,B[u++]=W}const P=new e.BufferGeometry;P.setAttribute("position",new e.BufferAttribute(E,3)),P.setAttribute("aTerr",new e.BufferAttribute(v,1)),P.setIndex(new e.BufferAttribute(B,1)),await s.yield(),await E0(P,s),await s.yield(),P.boundingSphere=new e.Sphere(new e.Vector3(3500,-600,0),7e3),t.cl=[];for(let T=0;T<14;T++)t.cl.push(new e.Vector4(1e5,1e5,1,0));const N=I.uSunDir.value,z=Math.hypot(N.x,N.z)||1,A=z/Math.max(N.y,.25),g=new e.Vector2(-N.x/z,-N.z/z),l=new e.Vector4(2500,1045,1500,430);g.set(.927,.375);const i=d0(I,["uTime","uSunDir","uSunCol","uSkyCol","uBounce","uCam","uHaze","uWhite","uGreen","uShade"],{uFloorA:{value:new e.Color(F.floorA)},uFloorB:{value:new e.Color(F.floorB)},uFarCol:{value:new e.Color(F.ground)},uLakeCol:{value:new e.Color(b.sea?"#1E5AA8":"#23A088")},uShalCol:{value:new e.Color(b.sea?"#4FB9C2":"#8FD8C4")},uBasin:{value:new e.Vector4(b.x,b.z,b.r,b.level)},uCh:{value:new e.Vector2(b.chEnd,b.sea)},uShafts:{value:w.mood==="pearl"?1:0},uCl:{value:t.cl},uProg:I.uProgress,uTow:{value:l},uTowD:{value:g}},R0,K0),h=new e.Mesh(P,i);h.name="basin-floor",M.add(h),await s.yield();const o=[],r=[],m=[],n=[],a=[],d=[];t.escCols=[];const D=200,V=70,K=5,U=V+K,G=new e.Vector3,y=new e.Vector3,R=L.curve.getLength();for(let T=0;T<=D;T++){const q=Math.pow(T/D,1.8);L.curve.getPointAt(q,G),L.curve.getTangentAt(q,y);const H=Math.hypot(y.x,y.z)||1,_=-y.z/H,J=y.x/H,W=q*R,t0=G,a0=j(.12,.62,S.n2(W*.0095,7.7)+.35*S.n2(W*.021,2.2)),n0=165+60*S.fbm2(W*.0012,4.4,3)+50*j(900,300,t0.x)-60*j(2500,4500,t0.x)-26*a0,g0=44*S.fbm2(W*.0042,1.3,3),r0=.15+.1*j(.1,.7,S.n2(W*.0095,7.7)),b0=N0(t0.x+_*(190+g0))-14,x0=n0-b0,S0=o0=>(o0-.2*W)/46+.55*S.n2(W*.003,o0*.004)+.22*S.n2(W*.011,o0*.013),B0=o0=>Math.floor(o0)+.25*(o0-Math.floor(o0))+.75*j(.5,1,o0-Math.floor(o0)),L0=S0(b0+x0*r0),y0={x:t0.x,z:t0.z,nx:_,nz:J,gul:a0,s:W,pts:[]};t.escCols.push(y0);let s0=0;for(let o0=0;o0<U;o0++){let i0,P0=1,D0=2;if(o0<V){const l0=o0/(V-1),m0=Math.max(l0-r0,0)/(1-r0),M0=S0(b0+x0*l0);i0=b0+x0*l0,D0=l0,P0=j(.855,.985,l0),s0=-78-g0-1.4*x0*r0*(1-Math.min(l0/r0,1))+(12+6*S.n2(W*.02,Math.floor(M0)*3.7))*(B0(M0)-B0(L0))*j(0,.08,m0)*(1-.5*a0)+6*S.n2(W*.024+Math.floor(M0)*9.1,Math.floor(M0)*3.3)*j(.05,.2,m0)+2.5*S.n2(W*.07,i0*.05)*j(.05,.2,m0)+96*a0*j(0,.3,m0)*(1-.3*m0)+9*S.n2(W*.016,i0*.012)*j(0,.2,m0)+34*j(.88,1,l0)*j(.88,1,l0)}else{const l0=(o0-V+1)/K;i0=n0-30*l0+22*S.n2(W*.004,l0*3),s0+=40+260*l0}o.push(t0.x-_*s0,i0,t0.z-J*s0),r.push(P0),m.push(D0),n.push(o0<V?a0:0),a.push(o0<V?S0(i0):0),o0<V&&o0%6===5&&y0.pts.push([t0.x-_*s0,i0,t0.z-J*s0]),o0===V-1&&(y0.top=[t0.x-_*s0,i0,t0.z-J*s0]),o0===2&&(y0.lo=[t0.x-_*s0,i0,t0.z-J*s0]),o0===7&&(y0.mid=[t0.x-_*s0,i0,t0.z-J*s0])}T%6===5&&await s.yield()}for(let T=0;T<D;T++)for(let q=0;q<U-1;q++){const H=T*U+q,_=H+U;d.push(H,_,H+1,H+1,_,_+1)}await s.yield();const Z=o.length/3,$=44,f=30;for(let T=0;T<=f;T++)for(let q=0;q<=$;q++){const H=-900+2600*q/$,_=800+2400*(T/f)*(T/f*.6+.4),J=H<-190?-6:w0(H)-40,W=j(480,880,H),t0=(H-230)/620,a0=(_-1650)/620,n0=Math.exp(-(t0*t0*(H>230?2.2:.7)+a0*a0)*1.3),g0=Q(70+40*S.n2(H*.002,_*.002),-780,W*(1-.75*n0))+430*n0*(.82+.3*S.fbm2(H*.004,_*.004,3)),r0=j(830,1180,_+60*S.n2(H*.004,5));o.push(H,Q(Math.min(J,g0)-20,g0,r0)+30*r0*(1-r0)*S.n2(H*.01,_*.01),_),r.push(1),m.push(3),n.push(0),a.push(0)}for(let T=0;T<f;T++)for(let q=0;q<$;q++){const H=Z+T*($+1)+q,_=H+1,J=H+$+1;d.push(H,J,_,_,J,J+1)}await s.yield();const k=new e.BufferGeometry;k.setAttribute("position",new e.Float32BufferAttribute(o,3)),k.setAttribute("aLit",new e.Float32BufferAttribute(r,1)),k.setAttribute("aFace",new e.Float32BufferAttribute(m,1)),k.setAttribute("aGul",new e.Float32BufferAttribute(n,1)),k.setAttribute("aBq",new e.Float32BufferAttribute(a,1)),k.setIndex(d),await s.yield(),await E0(k,s),await s.yield(),k.boundingSphere=new e.Sphere(new e.Vector3(1500,-200,0),6e3),await s.yield();const Y=new e.Mesh(k,d0(I,["uTime","uSunDir","uSunCol","uSkyCol","uBounce","uHaze","uHoney","uBone","uShade","uCam"],null,Z0,$0,{side:e.DoubleSide}));Y.name="escarpment-and-musa",M.add(Y),await s.yield()}const Y0=`
attribute vec4 aPos, aPar, aEnd;
uniform float uTime, uEvent, uProg; uniform vec3 uCam; uniform vec2 uDive;
varying vec2 vUv; varying vec4 vPar; varying float vLife, vH;
${f0}
void main(){
  vec3 c = aPos.xyz; float size = aPos.w, life = 1., seed = aPar.x, kind = aPar.y;
  if (kind > 0.5 && kind < 1.5) {
    float t = fract(uTime * aPar.z + seed); c = mix(aPos.xyz, aEnd.xyz, t); c.y += aEnd.w * 4. * t * (1. - t);
    life = smoothstep(0., 0.14, t) * (1. - smoothstep(0.62, 1., t)); size *= 0.55 + 1.5 * t;
  } else if (kind > 3.5) {
    float ev = kind > 4.5 ? uDive.x : uEvent; if (kind > 5.5) ev = uDive.y;
    float t = clamp((ev - 0.12 - seed * 0.25) * aPar.z, 0., 1.); c = mix(aPos.xyz, aEnd.xyz, t * t * (3. - 2. * t)); c.y += aEnd.w * 4. * t * (1. - t);
    life = smoothstep(0., 0.1, t) * (1. - smoothstep(0.7, 1., t)); size *= 0.4 + 1.6 * t;
  } else if (kind > 1.5) {
    if (aPar.w > 0.5) { float a = uTime * 1.9 + seed * 40. + c.y * 0.035; c.x += uTime * 9. + (c.y + 606.) * 0.22; c.xz += vec2(cos(a), sin(a)) * size * 0.45; }     // a dust devil leans, twists and walks
    else c.x += uTime * 24.;
  }
  else {
    float tm = uTime * (aPar.w > 1.5 ? 3. : 1.);                                    // low mist churns faster than the high cloud
    c += vec3(sin(tm * 0.11 + seed * 6.), 0.6 * sin(tm * 0.17 + seed * 9.), cos(tm * 0.13 + seed * 4.)) * size * 0.10;
    size *= 1. + 0.07 * sin(uTime * 0.23 + seed * 20.);
    if (aEnd.x > 0.) { float gone = smoothstep(aEnd.x, aEnd.x + 0.045, uProg); life *= 1. - gone; c.x += 90. * gone; }
  }
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  float dist = length(uCam - c);
  life *= smoothstep(size * 0.7, size * 2.2, dist);                       // never a wall of white on the lens
  float low = step(1.5, aPar.w) * (1. - step(2.5, aPar.w));
  life *= mix(1., smoothstep(size * 2.2, size * 7., dist), low);            // POLISH 2: low mist is a far veil; it never lies as a milky sheet between the lens and the water                 // low mist lies along the water and the scree: long thin veils, never balls
  float jet = step(4.5, kind);                                              // POLISH 2: a plunge throws up thin white jets, a crown of spikes, never a round puff
  vec3 wp = c + (right * position.x * mix(1., 2.6, low) * mix(1., 0.36, jet) + up * mix(position.y * mix(1., 0.4, low), (position.y + 0.75) * 1.9, jet)) * size;
  vUv = position.xy; vPar = aPar; vLife = life; vH = kind < 0.5 && aPar.w < 0.5 ? clamp((c.y + 640.) / 900., 0., 1.) : 1.;
  vec4 mv = viewMatrix * vec4(wp, 1.);
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix * mv;
}`,Q0=`
precision highp float;
uniform float uTime; uniform vec3 uSunDir, uLitCol, uShadeCol, uDustCol, uStreamCol, uMistCol;
varying vec2 vUv; varying vec4 vPar; varying float vLife, vH;
${p0}
${h0}
void main(){
  float r = length(vUv), seed = vPar.x, tint = vPar.w;
  if (r > 1. || vLife < 0.004) discard;
  vec2 q = vUv * 1.7 + seed * 37.; q.y -= uTime * (tint > 1.5 ? 0.14 : 0.045);
  float n = fbm3(q), n2 = vn(q * 3.3 + 11.);
  float d = r + (n - 0.5) * 0.75 + (n2 - 0.5) * 0.2;
  float a = (1. - smoothstep(0.22, 0.96, d)) * vLife;
  if (tint > 1.5 && tint < 2.5) a = (1. - smoothstep(0.05, 0.95, r + (n - 0.5) * 0.4)) * vLife;      // spray: soft, thin
  float tow = step(0.2, tint) * (1. - step(0.5, tint));
  a = mix(a, (1. - smoothstep(0.50, 0.80, d)) * vLife, tow);
  a = mix(a, (1. - smoothstep(0.30, 0.85, r + (n - 0.5) * 0.9 + 0.35 * (n2 - 0.5))) * vLife * 1.2, step(4.5, vPar.y));     // plunge jets: torn, bright                                          // the thunderhead: lobed and firm-edged, a cloud with a surface
  if (a < 0.004) discard;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]), back = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  float z = sqrt(max(1. - r * r, 0.));
  vec3 N = normalize(right * vUv.x + up * vUv.y + back * (z + 0.25));
  float w = clamp(dot(N, uSunDir) * 0.55 + 0.42 + (n - 0.5) * 0.9 + N.y * 0.18, 0., 1.);
  float soft = step(0.5, tint) * (1. - step(1.5, tint)), strm = step(3.5, tint);
  w *= 0.5 + 0.5 * smoothstep(-0.1, 0.75, vH + (n - 0.5) * 0.3);
  w *= 1. - 0.8 * (1. - step(0.5, tint)) * smoothstep(0.36, 0.56, fract(seed * 13.7)) * (0.7 + 0.3 * n2);
  w *= mix(1., 0.55 + 0.75 * smoothstep(0.25, 0.75, n) * (0.6 + 0.4 * (vUv.y * 0.5 + 0.5)), tow);       // each billow: lit dome, blue hollow      // folds: a third of the billows stand in the mass's own shade                    // the mass shades its own lower folds
  vec3 lit = mix(uLitCol, uDustCol, soft), shade = mix(uShadeCol, uDustCol * vec3(0.62, 0.66, 0.78), soft);
  vec3 col = mix(shade, lit, w * w * (3. - 2. * w)) * (0.86 + 0.14 * n2);
  col = mix(col, mix(uShadeCol * 1.05, uMistCol, w), step(1.5, tint) * (1. - step(2.5, tint)));     // mist and spray: white with blue shadow in every mood, never dust
  col = mix(col, uStreamCol * (0.75 + 0.5 * w), strm);                                // streamers over the prow: sunlit spray, brighter than the shade behind
  float f = fogAmt();
  gl_FragColor = vec4(mix(col, fogColor, f * 0.8), a * (1. - 0.45 * f) * mix(0.8, 0.5, step(1.5, tint)) * mix(1., 0.56, step(2.1, tint) * (1. - step(2.5, tint))) * mix(1., 0.3, step(2.5, tint)) * mix(1., 2.3, strm));
}`;function J0(t){const{scene:M,U:I,M:F,V:w,rng:s,detail:S,A:L}=t,b=[],p=(l,i,h,o,r,m=0,n=0,a=null,d=0)=>b.push([l,i,h,o,s(),r,m,n,a?a[0]:0,a?a[1]:0,a?a[2]:0,d]),x=t.basin,O=Math.round(100*S);for(let l=0;l<O;l++){const i=Math.pow(s(),1.3),h=Q(-668,-440,i),o=Q(105,70,i)*(.8+.2*Math.sin(i*9+1)),r=s()*e0,m=Math.sqrt(s())*o;p(x.chEnd-10+(h+668)*.6+Math.cos(r)*m*1.2,h,130+Math.sin(r)*m,Q(80,50,i)*s.range(.8,1.25),0)}for(let l=0;l<Math.round(44*S);l++){const i=X(l*3.7)*e0,h=90*Math.sqrt(X(l*1.3+5));b.push([x.chEnd+10+Math.cos(i)*h*1.2,-664,130+Math.sin(i)*h,38+22*X(l+.5),X(l*7.7+2),1,.07+.05*X(l*2.9),0,x.chEnd+150+Math.cos(i)*h*1.6,-430+60*X(l*4.1),130+Math.sin(i)*h*1.5,0])}const C=Math.round(150*S);for(let l=0;l<C;l++){const i=Math.pow(s(),.75),h=Q(-420,430,i),o=Q(95,150,i)*(.75+.25*Math.sin(i*9+1)),r=s()*e0,m=Math.sqrt(s())*o;b.push([1150+(h+420)*.35+Math.cos(r)*m*.9,h,560+Math.sin(r)*m*1.1,Q(84,132,s())*Q(1.1,.85,i),s(),0,0,.25,.39+.04*s(),0,0,0])}for(let l=0;l<Math.round(84*S);l++){const i=X(l*2.91+7)*2-1,h=i*Math.abs(i),o=20+250*Math.exp(-h*h*5),r=Q(-240,o,Math.pow(X(l*1.37+.2),.8));b.push([1010+330*X(l*5.3+1)+(r+420)*.3,r,560+h*520,Q(86,140,X(l*3.3+2)),X(l*7.1+4),0,0,0,.385+.045*X(l*9.7),0,0,0])}{const l=Math.round(170*S);for(let i=0;i<l;i++){const h=Math.pow(X(i*1.93+.37),.8),o=Q(-480,210,h),r=X(i*5.17+2.1)*e0,m=Math.sqrt(X(i*3.31+7.7)),n=Q(105,360,Math.pow(h,1.5))*(.8+.2*Math.sin(h*11+1))*(h>.86?Q(1,.55,(h-.86)/.14):1);b.push([x.chEnd+40+(o+480)*.62+Math.cos(r)*m*n*1.25,o,130+Math.sin(r)*m*n,Q(105,190,X(i*7.3+1.1))*Q(.9,1.2,h),(Math.floor(X(i*9.9+4.2)*9)+(-Math.sin(r)*m+.7*(.45-h)+.5*(X(i*2.7+5)-.5)>.12?.8:.2))/13.7,0,0,.25,0,0,0,0])}}for(let l=0;l<26;l++){const i=s.range(600,1500),h=s()<.5?-1:1;p(i,-640-s()*20+60*j(1e3,600,i),z0(i)+h*k0(i)*s.range(.8,1),60+s()*60,0,0,2)}for(let l=0;l<60;l++){const i=l/60,h=Q(232,400,i)+s.range(0,40),o=w0(h)+s()*45,r=Q(-118,-545,i)+s.range(-10,25),m=50+s()*45;(l%3!==1||i>.5)&&p(h,o,r,m*(i<.5?.8:1),0,0,2)}for(let l=0;l<26;l++){const i=s.range(330,620),h=t.esc.zAt(i)+s.range(110,260),o=w0(i)+4+s()*22,r=50+s()*40;l%2===0&&p(i,o,h,r,0,0,2)}for(let l=0;l<44;l++){const i=l/44,h=Q(330,600,i),o=t.esc.zAt(h)+85+s.range(-15,35),r=h+s.range(-15,15),m=w0(h)+2+s()*16,n=30+s()*26;l%4===0&&p(r,m,o,n,0,0,2)}t.clouds=[];for(let l=0;l<14;l++){const i=1500+3800*(l/14)+s.range(-150,150),h=s.range(-330,-150),o=s.range(230,420);let r=s.range(-1700,2400);if(i<3200&&Math.abs(r-200)<650&&(r=200+(r<200?-1:1)*s.range(700,1500)),t.clouds.push({x:i,y:h,z:r,w:o}),w.mood!=="pearl")for(let m=0;m<8;m++){const n=s()*e0,a=Math.sqrt(s())*o*.7,d=(1-a/(o*.7))*o*.32*s();p(i+Math.cos(n)*a,h+d+20,r+Math.sin(n)*a*.7,o*(.34+.2*s()),2)}}if(w.cap)for(let l=0;l<46;l++){const i=s.range(-28,28);p(L.rockCrest[0]-30,L.rockCrest[1]+4+s()*14,L.rockCrest[2]+i-10,26+s()*16,1,.05+s()*.03,0,[L.rockCrest[0]+215+s()*85,L.rockCrest[1]+30+s()*60,L.rockCrest[2]+i*2.4-40],8)}if(w.dust)for(let l=0;l<54;l++){const i=l/54;p(3900+700*Math.sin(i*5)+s()*300,-600+s()*330,-2300+4300*i,330+s()*240,0,0,1)}for(let l=0;l<6;l++){let i=0,h=0;for(let o=0;o<40&&(i=s.range(1300,4300),h=s.range(-500,1400),!(Math.hypot(i-x.x,h-x.z)>x.r*1.25&&(Math.abs(h-z0(i))>k0(i)+160||i>x.chEnd+500)&&h>t.esc.zAt(i)+260));o++)i=s.range(1250,1900),h=s.range(560,1150);for(let o=0;o<6;o++)p(i+o*14+s()*10,-580+o*46,h+8*Math.sin(o*1.3),34+o*9,2,0,1);for(let o=0;o<5;o++)b.push([i+o*30,-594+o*52,h,16+o*10,X(l*9.1+o),2,0,1,0,0,0,0])}if(t.slabAt=new e.Vector3(-55,-56,L.wallZ(-55)+30),w.rare)for(let l=0;l<70;l++){const i=s()*e0,h=s()*22,o=t.slabAt.x+45+s()*150;p(t.slabAt.x+Math.cos(i)*h,t.slabAt.y-8,t.slabAt.z+Math.sin(i)*h,8+s()*7,4,1.6+s()*.9,0,[o,w0(o)+5+s()*13,t.slabAt.z+6+s()*62],7+s()*15)}t.uDive={value:new e.Vector2(0,0)},t.diveAt.forEach((l,i)=>{for(let h=0;h<24;h++){const o=s()*e0,r=s()*.55,m=s();p(l.x+Math.cos(o)*r,.1,l.z+Math.sin(o)*r,.42+s()*.5,5+i,1.5+s()*.8,0,[l.x+.6+s()*1.8+Math.cos(o)*r*2.5,.5+m*1.2,l.z+Math.sin(o)*r*2.5+s.range(-.5,.5)],1+m*1.5)}}),b.sort((l,i)=>i[0]-l[0]);const E=b.length,v=new Float32Array(E*4),c=new Float32Array(E*4),B=new Float32Array(E*4);b.forEach((l,i)=>{v.set(l.slice(0,4),i*4),c.set(l.slice(4,8),i*4),B.set(l.slice(8,12),i*4)});const u=new e.InstancedBufferGeometry;u.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),u.setIndex([0,1,2,0,2,3]),u.setAttribute("aPos",new e.InstancedBufferAttribute(v,4)),u.setAttribute("aPar",new e.InstancedBufferAttribute(c,4)),u.setAttribute("aEnd",new e.InstancedBufferAttribute(B,4)),u.instanceCount=E,u.boundingSphere=new e.Sphere(new e.Vector3(1500,-200,0),9e3),t.uEvent={value:0};const P=d0(I,["uTime","uSunDir","uCam"],{uProg:I.uProgress,uEvent:t.uEvent,uDive:t.uDive,uLitCol:{value:new e.Color(F.cloudLit).lerp(new e.Color("#FFFFFF"),.55).multiplyScalar(.93)},uMistCol:{value:new e.Color(F.palette[2]).multiplyScalar(.82)},uShadeCol:{value:new e.Color(F.cloudShade).multiplyScalar(.8)},uDustCol:{value:new e.Color("#C8A878")},uStreamCol:{value:new e.Color(F.palette[2]).lerp(new e.Color(F.palette[6]),.45).multiplyScalar(.95)}},Y0,Q0,{transparent:!0,depthWrite:!1}),N=new e.Mesh(u,P);N.name="puffs",N.frustumCulled=!1,N.renderOrder=5,M.add(N);const z=I.uSunDir.value,A=t.clouds,g=t.cl;t.parts.push({update(l,i){for(let h=0;h<14;h++){const o=A[h],r=(o.y+640)/Math.max(z.y,.2);w.mood==="pearl"?g[h].set(o.x+900*Math.sin(i*.05+h*2.4)-z.x*r*.3,o.z+700*Math.cos(i*.041+h*1.7),o.w*1.1,0):g[h].set(o.x+i*24-z.x*r,o.z-z.z*r,o.w*.95,0)}}})}function A0(t){const M=[],I=[],F=[],w=[],s=[],S=o=>new e.Color(o),L=S(t.top),b=S(t.belly),p=S(t.head||t.top),x=S(t.bill),O=S(t.wingA||t.top),C=S(t.wingB||t.top),E=S(t.under||t.belly),v=S(t.underTip||t.wingB||t.top),c=(o,r,m,n,a,d=0,D=0)=>(M.push(o,r,m),I.push(n.r,n.g,n.b),F.push(a.r,a.g,a.b),w.push(d,D),M.length/3-1),B=t.len,u=t.radius,P=t.sides||8,N=t.profile,z=N.length,A=new e.Color;for(let o=0;o<z;o++){const[r,m,n]=N[o],a=(r-.45)*B;for(let d=0;d<P;d++){const D=d/P*e0,V=Math.cos(D),K=Math.sin(D),U=V*u*m*(V<0?.92:1)+n*B,G=r>t.headAt?p:t.ruff&&Math.abs(r-t.ruff[0])<.045?S(t.ruff[1]):L;A.copy(b).lerp(G,j(-.35,.25,V)),t.rump&&r<.2&&V>0&&A.lerp(S(t.rump),.9),c(a,U,K*u*m*(t.wide||1),A,A)}}for(let o=0;o<z-1;o++)for(let r=0;r<P;r++){const m=o*P+r,n=o*P+(r+1)%P,a=m+P,d=n+P;s.push(m,n,a,n,d,a)}{const[o,r,m]=N[z-1],n=(o-.45)*B,a=m*B,d=u*r,D=t.billLen,V=t.billDepth,K=t.hook||0,U=c(n+D,a-K,0,x,x),G=c(n,a+V,0,x,x),y=c(n,a-V*.7,0,x,x),R=c(n,a,d*.8,x,x),Z=c(n,a,-d*.8,x,x),$=c(n+D*.6,a+V*.55,0,x,x);s.push(G,R,$,G,$,Z,$,R,U,$,U,Z,y,U,R,y,Z,U);const f=S("#0d0c0b");for(const k of[1,-1]){const Y=c(n-d*.5,a+d*.45,k*d*.93,f,f),T=c(n-d*1.3,a+d*.5,k*d*1,f,f),q=c(n-d*.9,a+d*.05,k*d*1.06,f,f);k>0?s.push(Y,T,q):s.push(Y,q,T)}}{const o=-.45*B+.02,r=t.tailW,m=t.tailLen,n=S(t.tail||t.top),a=c(o+m*.5,.01,r*.35,n,n),d=c(o+m*.5,.01,-r*.35,n,n),D=c(o-m,0,r*(t.tailSq?.55:.2),n,n),V=c(o-m,0,-r*(t.tailSq?.55:.2),n,n),K=c(o-m*(t.tailSq?1:1.25),0,0,n,n);s.push(a,d,D,d,V,D,D,V,K)}const g=t.wing,l=t.span/2,i=u*.55;for(const o of[1,-1]){const r=M.length/3;for(let m=0;m<g.length;m++){const[n,a,d,D]=g[m],V=o*(i+n*(l-i)),K=j(t.wrist||.5,1,n),U=A.copy(O).lerp(C,j(t.tipAt||.66,(t.tipAt||.66)+.06,n)).clone(),G=A.copy(E).lerp(v,j(.8,.9,n)).clone(),y=.012+.06*d*(1-n);c(a*B+d*.5,u*.35,V,U,G,o*n,K),c(a*B+d*(.5-D),u*.35+y,V,U,G,o*n,K),c(a*B-d*.5,u*.35,V,n<(t.tipAt||.66)?C:U,t.underRear?S(t.underRear):G,o*n,K)}for(let m=0;m<g.length-1;m++)for(let n=0;n<2;n++){const a=r+m*3+n,d=a+1,D=a+3,V=D+1;o>0?s.push(a,d,D,d,V,D):s.push(a,D,d,d,D,V)}if(t.fingers){const[m,n,a]=g[g.length-1],d=o*(i+m*(l-i));for(let D=0;D<t.fingers;D++){const V=(D/(t.fingers-1)-.42)*1.25,K=t.fingerLen*(1-.35*Math.abs(D/(t.fingers-1)-.4)),U=a/t.fingers*.42,G=n*B+a*(.5-(D+.5)/t.fingers),y=-Math.sin(V)*K,R=o*Math.cos(V)*K,Z=c(G+U,u*.35,d,C,v,o,1),$=c(G-U,u*.35,d,C,v,o,1),f=c(G+y+U*.5,u*.35+.02,d+R,C,v,o*1.25,1),k=c(G+y-U*.5,u*.35+.02,d+R,C,v,o*1.25,1);o>0?s.push(Z,$,f,$,k,f):s.push(Z,f,$,$,f,k)}}}const h=new e.BufferGeometry;return h.setAttribute("position",new e.Float32BufferAttribute(M,3)),h.setAttribute("color",new e.Float32BufferAttribute(I,3)),h.setAttribute("color2",new e.Float32BufferAttribute(F,3)),h.setAttribute("aW",new e.Float32BufferAttribute(w,2)),h.setIndex(s),h.computeVertexNormals(),h}const W0=`
attribute vec3 color, color2; attribute vec2 aW; attribute vec4 aB;     // per bird: phase, beats per second, share of the cycle spent gliding, beat amplitude
uniform float uTime, uDih;
varying vec3 vCol, vCol2, vN;
${f0}
void main(){
  vec3 p = position, n = normal; float s = abs(aW.x), side = sign(aW.x);
  if (s > 0.001) {
    float tt = uTime + aB.x * 7.;
    float env = aB.z < 0.01 ? 1. : smoothstep(aB.z, aB.z + 0.07, fract(tt * 0.29 + aB.x)) * (1. - smoothstep(0.93, 1., fract(tt * 0.29 + aB.x)));
    float ang = uDih * s + aB.w * env * sin(6.2831853 * aB.y * tt - 1.3 * s) * (0.3 + 0.7 * s) + (1. - env) * 0.05 * sin(tt * 0.9) * s;
    ang += 0.25 * aB.w * env * aW.y * sin(6.2831853 * aB.y * tt - 2.2);                   // the hand lags the arm
    float ca = cos(ang), sa = sin(ang), z = abs(p.z);
    p.y += z * sa; p.z = side * z * ca; p.x -= aW.y * env * aB.w * 0.12 * max(cos(6.2831853 * aB.y * tt), 0.) * z;   // folds a little on the upstroke
    n = normalize(vec3(n.x, n.y * ca, n.z - side * sa * n.y));
  }
  vec4 lp = instanceMatrix * vec4(p, 1.); vN = mat3(instanceMatrix) * n; vCol = color; vCol2 = color2;
  vec4 mv = modelViewMatrix * lp;
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix * mv;
}`,tt=`
precision highp float;
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce;
varying vec3 vCol, vCol2, vN;
${p0}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); vec3 alb = vCol;
  if (!gl_FrontFacing) { N = -N; alb = vCol2; }
  float ndl = max(dot(N, uSunDir), 0.);
  vec3 col = alb * (uSunCol * (ndl * 0.95 + 0.06) + uSkyCol * (0.75 + 0.45 * N.y) + uBounce * (0.9 - 0.9 * N.y));
  gl_FragColor = vec4(fogMix(col), 1.);
}`;function F0(t,M,I,F,w){const s=new e.InstancedBufferAttribute(new Float32Array(I*4),4);M.setAttribute("aB",s);const S=d0(t.U,["uTime","uSunDir","uSunCol","uSkyCol","uBounce"],{uDih:{value:F}},W0,tt,{side:e.DoubleSide}),L=new e.InstancedMesh(M,S,I);L.name=w,L.frustumCulled=!1,L.instanceMatrix.setUsage(e.DynamicDrawUsage),t.scene.add(L);const b=new e.Matrix4,p=new e.Quaternion,x=new e.Euler,O=new e.Vector3;return{mesh:L,aB:s,place(C,E,v,c,B,u){x.set(c,v,B,"YZX"),p.setFromEuler(x),O.setScalar(u),b.compose(E,p,O),L.setMatrixAt(C,b)},commit(){L.instanceMatrix.needsUpdate=!0}}}async function et(t){const{scene:M,U:I,V:F,rng:w,path:s,A:S}=t,L=F.gannets,b=T0(L,I),p=36;await t.ctx.yield();const x=T0(p,I);await t.ctx.yield(),M.add(b.object),M.add(x.object);const O=[],C=new e.Vector3,E=new e.Vector3,v=new e.Vector3,c=s.length;for(let A=0;A<L;A++){const g=A<5,l=A%2?1:-1;O.push({stay:g,dir:l,ph:w(),sc:w.range(.95,1.06),lag:w()*.04,l0:g?[4.3,5.6,9,6.6,12][A]:14+w()*22,l1:g?[.8,1.3,3,1.6,4][A]:5+w()*6,kl:e0/(g?[150,215,180,260,135][A]:w.range(140,260)),pl:g?[.6,2.9,4.6,1.7,3.6][A]:w()*e0,s0:g?[.9,-1.6,3.6,1.6,5.5][A]:l*(6+w()*9),s1:g?[1.5,1.4,3,2,4][A]:3+w()*5,ks:e0/(g?[175,130,235,160,200][A]:w.range(130,240)),ps:g?[2.2,.4,3.9,5.3,1.1][A]:w()*e0,dy:g?[1.5,-1.9,2.8,2.1,3.6][A]:w.range(-2.5,4),y1:g?[.5,.6,.7,.6,.9][A]:1+w()*1.5,ky:e0/(g?[120,165,140,190,110][A]:w.range(110,200)),py:w()*e0})}const B=A=>L-1-A,u={},P=A=>A<5,N=t.perches,z=[];for(let A=0;A<p;A++){const g=N[A%N.length],l=Math.floor(A/N.length);z.push({p:g.p.clone().add(new e.Vector3((g.colony&&!l?0:w.range(-1.2,1.2))+l*.9,0,0)),out:g.out,u0:w()<.35?9:s.nearestXZ(g.p.x,g.p.z).u-.006-w()*.016,ph:w(),yaw:w.range(-.8,.8),sc:g.colony&&!l?1.7:1.15}),g.colony&&!l&&(A===2||A===5)&&(z[A].u0=s.nearestXZ(g.p.x,g.p.z).u-.017+.003*A,z[A].open=1),g.colony&&!l&&A===7&&(z[A].u0=s.nearestXZ(g.p.x,g.p.z).u-.045)}t.parts.push({update(A,g,l,i){const h=i*c;for(let o=0;o<L;o++){const r=O[o],m=1-j(t.U0,t.U0+.05,i),n=(1-i)*c;let a=r.l0+r.l1*Math.sin(h*r.kl+r.pl)+.8*Math.sin(g*.37+o*1.7)+m*(P(o)?.4+.5*o:10+o),d=r.s0+r.s1*Math.sin(h*r.ks+r.ps)+.5*Math.sin(g*.29+o*2.3);const D=r.s1*r.ks*Math.cos(h*r.ks+r.ps);let V=8+r.dy+r.y1*Math.sin(h*r.ky+r.py)+.3*Math.sin(g*.9+o)+m*(.8+.8*Math.sin(o*1.9+.5));if(r.stay){const k=j(.515,.56,i)*(1-j(.895,.94,i));V=Q(V,8-1.2-.33*a+.6*r.y1*Math.sin(h*r.ky+r.py),k),d+=k*(1.5+.15*a),d=c0(d,-.46*a,Q(.46,.6,k)*a),V=8+c0(V-8,-.5*a,.31*a)}let K=-Math.atan(D)+.22*Math.sin(h*r.kl*.7+o*2.1),U=c0(-D*2.2,-.5,.5)+.4*Math.sin(h*r.ks*1.3+o*1.3)+.08*Math.sin(g*.29+o*2.3+1.5),G=.03*Math.sin(g*.9+o)+.6*r.y1*r.ky*Math.cos(h*r.ky+r.py),y=0,R=0,Z=r.sc;if(r.stay){const k=j(.9,.985,i);a+=26*k,d*=1-.85*k,V=Q(V,8+.35*r.dy,k),R=k,a>n-2&&(Z=0),a=Math.min(a,n+4)}else{const k=j(.265+r.lag,.4+r.lag,i);a-=520*k*k,V+=46*k,d+=r.dir*70*Math.sin(k*Math.PI*.5),K+=r.dir*Math.PI*j(.03,.55,k),U+=-r.dir*.6*Math.sin(k*Math.PI),R=Math.sin(k*Math.PI),k>.995&&(Z=0)}s.posAtDist(h+a,C),s.tangentAtDist(h+a,E),v.set(-E.z,0,E.x),C.addScaledVector(v,d),C.y=V;const $=S.wallZ(C.x)+7+Math.max(V-9,0)*.5;C.z<$&&C.x<215&&(C.z=$);let f=Math.atan2(-E.z,E.x)+K;for(let k=0;k<2;k++)if(o===B(k)){const Y=(i-v0[k].u0)/.07,T=t.diveAt[k];if(Y>0){const q=j(0,.55,Y),H=j(.6,1,Y);C.x=Q(C.x,T.x-4*(1-H),q),C.z=Q(C.z,T.z,q),C.y=Q(C.y,28,q)-29*H*H,y=j(.5,.68,Y),G=Q(.5*Math.sin(q*Math.PI),-1.35,j(.52,.7,Y)),R=1-y,Y>=1&&(Z=0)}}u.position=C,u.yaw=f,u.bank=U,u.pitch=G,u.phase=r.ph,u.dive=y,u.flap=R,u.scale=Z,u.perch=0,b.place(o,u)}b.commit(),t.uDive.value.set((i-v0[0].u0-.07+.004)/.03+.12,(i-v0[1].u0-.07+.004)/.03+.12);for(let o=0;o<p;o++){const r=z[o],m=i-r.u0,n=Math.max(m,0)*c,a=j(0,.012,m);C.copy(r.p),C.x+=n*.9+a*2,C.y+=.275*r.sc*(1-a)+a*(1.6+5*Math.sin(Math.min(n/60,1)*Math.PI)-Math.max(n-50,0)*.16),C.z+=r.out[1]*Math.min(n*.3+a*2.5,5.5),C.x+=r.out[0]*Math.min(n*.3,5.5);const d=r.open?j(r.u0-.034,r.u0-.014,i):0;u.position=C,u.yaw=Q(-Math.PI/2-.25+.6*r.yaw,-.12,a),u.bank=0,u.pitch=Q(-.2*d,.04,a),u.phase=r.ph,u.dive=0,u.perch=(1-a)*(1-.5*d),u.flap=a*(1-j(60,140,n)),u.scale=r.sc,m<=0&&(u.yaw+=.22*Math.sin(g*.6+o*1.3),u.pitch+=.05*Math.sin(g*1.1+o*2.1)),x.place(o,u)}x.commit()}})}function ot(t){const{U:M,V:I,rng:F,path:w,A:s,detail:S,density:L}=t,b=w.length,p=new e.Vector3,x=new e.Vector3,O=new e.Vector3,C=A0({len:1.1,radius:.17,sides:10,wide:1.1,headAt:.86,ruff:[.8,"#E6DCC0"],top:"#8C7350",belly:"#A08660",head:"#D9D2C0",bill:"#6E6657",billLen:.085,billDepth:.04,hook:.035,profile:[[0,.12,0],[.08,.5,0],[.22,.86,0],[.4,1,0],[.58,.95,.005],[.7,.74,.012],[.78,.6,.02],[.82,.62,.022],[.87,.36,.02],[.93,.33,.012],[.975,.24,.004]],tailW:.52,tailLen:.3,tailSq:!0,tail:"#3A2E26",span:2.6,wrist:.45,tipAt:2,wing:[[0,.02,.6,.5],[.2,.05,.64,.5],[.45,.07,.62,.5],[.68,.05,.58,.48],[.84,.02,.52,.45]],wingA:"#B99A6A",wingB:"#3A2E26",under:"#A58A5E",underRear:"#2E2520",underTip:"#2E2520",fingers:6,fingerLen:.5}),E=8,v=30,c=F0(t,C,E+v,.16,"vultures"),B=t.toOld(.785),u=[],P={cam:w.posAtDist(B*b,new e.Vector3)};{const n=w.posAtDist(B*b+30,new e.Vector3).sub(P.cam).normalize(),a=t.gazeBasin.clone().sub(P.cam).normalize();P.G=n.multiplyScalar(.62).addScaledVector(a,.38).normalize(),P.Gh=new e.Vector3(P.G.x,0,P.G.z).normalize(),P.R=new e.Vector3(-P.Gh.z,0,P.Gh.x),P.T=w.tangentAtDist(B*b,new e.Vector3).setY(0).normalize()}for(let n=0;n<E;n++){const a=(.72+.021*n)*b,d=13+1.6*n,D=n===2||n===5?-1:1;if(w.posAtDist(a,p),t.rightAt(a,O),n<4){const[V,K,U,G,y,R]=[[11.5,-1.5,-2.4,-.07,-1,1.55],[16,7,-.8,.09,1,1.55],[29,3,-4.2,.03,1,1.3],[46,20,3,-.2,-1,1.2]][n],Z=60,$=P.cam.clone().addScaledVector(P.G,V).addScaledVector(P.R,K);$.y+=U;const f=P.T.x*Math.cos(G)-P.T.z*Math.sin(G),k=P.T.x*Math.sin(G)+P.T.z*Math.cos(G),Y=y*k,T=-y*f,q=new e.Vector3($.x-Z*Y,$.y,$.z-Z*T);u.push({c:q,r:Z,dir:y,ph:Math.atan2(T,Y),T:15.7,sc:R,key:B,bank:.1})}else u.push({c:p.clone().addScaledVector(O,D*(d+12.5+2*(n%3))).setY(8+[-3,5,9,-6,2,12,-1,6][n]),r:d,dir:n%2?1:-1,ph:F()*e0,T:12,sc:F.range(.95,1.08)})}for(let n=0;n<v;n++)u.push({c:new e.Vector3(F.range(380,1e3),F.range(-430,-130),F.range(-260,520)),r:F.range(45,120),dir:F()<.5?1:-1,ph:F()*e0,T:F.range(22,34),sc:1.15});for(let n=0;n<12;n++){const a=u[E+n],d=95+150*X(n*3.7+1);a.c.copy(P.cam).addScaledVector(P.Gh,d).addScaledVector(P.R,(X(n*5.3+2)-.45)*d*.9),a.c.y=8-d*(.22+.3*X(n*2.1+5)),a.r=16+22*X(n*7.9),a.T=12+5*X(n*1.3+3),a.sc=1.3}u.forEach((n,a)=>c.aB.setXYZW(a,F(),.4,0,0));const N=A0({len:.5,radius:.062,sides:6,headAt:.84,top:"#6B6257",belly:"#F1F0EA",head:"#5E564D",bill:"#33302C",billLen:.05,billDepth:.012,hook:.012,profile:[[0,.1,0],[.15,.6,0],[.4,1,0],[.65,.92,0],[.82,.62,.006],[.92,.5,.008],[.975,.3,.004]],tailW:.13,tailLen:.11,span:1.2,wrist:.42,tipAt:.8,wing:[[0,.03,.13,.5],[.22,.07,.125,.5],[.45,.085,.11,.5],[.72,0,.085,.5],[1,-.16,.02,.5]],wingA:"#6B6257",wingB:"#4A433B",under:"#F1F0EA",underTip:"#57504A"}),z=Math.max(4,Math.round((I.shearMany?18:10)*S*Math.min(L,1.1))),A=40,g=F0(t,N,z*A,-.1,"shearwaters"),l=[];for(let n=0;n<z;n++){const a=n<3,d=n%2?1:-1;l.push({cross:a,D:a?[.125,.19,.25][n]*b:0,ang:a?d*F.range(1,1.35):d*F.range(.05,.3),off:d*F.range(22,190),x0:F()*520,gap:17+4*n,ph:F()*10,sp:F.range(2.6,3.4)})}for(let n=0;n<z*A;n++)g.aB.setXYZW(n,F(),3.4,.62,.42);const i=I.petrels?A0({len:.2,radius:.03,sides:6,headAt:.82,top:"#2B2622",belly:"#2B2622",rump:"#F0EEE8",bill:"#141210",billLen:.02,billDepth:.006,hook:.004,profile:[[0,.1,0],[.2,.7,0],[.45,1,0],[.7,.9,0],[.86,.62,.01],[.97,.35,.01]],tailW:.07,tailLen:.06,tailSq:!0,span:.42,wrist:.4,tipAt:2,wing:[[0,.04,.075,.5],[.3,.1,.075,.5],[.55,.1,.065,.5],[.8,0,.05,.5],[1,-.2,.012,.5]],wingA:"#3B342E",wingB:"#231F1B",under:"#3B342E"}):A0({len:.4,radius:.072,sides:8,headAt:.8,top:"#1E2226",belly:"#F2F2EE",bill:"#16181A",billLen:.05,billDepth:.03,hook:.006,profile:[[0,.12,0],[.12,.62,0],[.32,.98,0],[.55,1,0],[.75,.8,.004],[.86,.62,.008],[.95,.52,.008]],tailW:.09,tailLen:.08,span:.65,wrist:.5,tipAt:2,wing:[[0,.02,.1,.5],[.3,.04,.1,.5],[.6,.03,.085,.5],[.85,-.02,.055,.5],[1,-.08,.012,.5]],wingA:"#1E2226",wingB:"#15181B",under:"#D9DAD6",underTip:"#2A2D30"}),h=I.petrels?40:36,o=F0(t,i,h,I.petrels?.55:.02,I.petrels?"storm-petrels":"auks"),r=[];for(let n=0;n<h;n++)o.aB.setXYZW(n,F(),I.petrels?6.5:9,0,I.petrels?.5:.62),r.push({d:F.range(20,330),side:(F()<.5?-1:1)*F.range(5.5,13),ph:F()*e0,line:Math.floor(n/12),j:n%12,wob:F()});const m=[.15,.215,.275].map(n=>n*b);t.parts.push({update(n,a,d,D){const V=D*b,K=M.uTime.value;for(let G=0;G<u.length;G++){const y=u[G],R=y.ph+y.dir*(y.key!==void 0?(D-y.key)*44/1.06:a)*e0/y.T,Z=Math.sin(a*.7+G*1.9);p.set(y.c.x+Math.cos(R)*y.r,y.c.y+1.2*Math.sin(a*.23+G),y.c.z+Math.sin(R)*y.r),c.place(G,p,-R-y.dir*Math.PI/2,y.dir*(y.bank||.3)+.1*Z,.02*Z,y.sc)}c.commit();const U=D<.42;if(g.mesh.visible=U,o.mesh.visible=U,!!U){for(let G=0;G<z;G++){const y=l[G];for(let R=0;R<A;R++){let Z,$,f,k=1;if(y.cross){const T=(V-y.D+y.gap)*.36+(A-1-R)*y.sp+5*Math.sin(a*.21+G);w.posAtDist(y.D,p),w.tangentAtDist(y.D,x);const q=Math.cos(y.ang),H=Math.sin(y.ang),_=x.x*q-x.z*H,J=x.x*H+x.z*q,W=4.5*Math.sin(R*.61+G*1.3)+2.2*Math.sin(R*1.7+G);Z=p.x+_*T-J*W,$=p.z+J*T+_*W,f=Math.atan2(-J,_)}else{const T=(y.x0+a*12-R*y.sp)%520,q=T<0?T+520:T;Z=-640+q*Math.cos(y.ang),$=y.off+q*Math.sin(y.ang)*.5+2*Math.sin(R*.9+G)+5*Math.sin(R*.47+G*2.1),f=-y.ang*.5,k=j(0,25,q)*(1-j(380,420,q))}const Y=Math.sin(a*.85+R*.33+y.ph);p.set(Z,Math.max(s.waterHeight(Z,$,K),-3)+.75+.5*Y,$),g.place(G*A+R,p,f,.85*Y,.03,k)}}g.commit();for(let G=0;G<h;G++){const y=r[G];if(I.petrels)w.posAtDist(y.d,p),t.rightAt(y.d,O),p.addScaledVector(O,y.side+1.5*Math.sin(a*.4+y.ph)),p.x+=3*Math.sin(a*.31+y.ph*2),p.y=s.waterHeight(p.x,p.z,K)+.16+.07*Math.abs(Math.sin(a*5+y.ph)),o.place(G,p,Math.PI+.5*Math.sin(a*.5+y.ph),.15*Math.sin(a*2.3+y.ph),.25,1.6);else{const R=m[y.line],Z=y.line%2?-1:1,$=(V-R+10)*.55+(11-y.j)*1.25-2;w.posAtDist(R,p),w.tangentAtDist(R,x);const f=Math.cos(Z*1.25),k=Math.sin(Z*1.25),Y=x.x*f-x.z*k,T=x.x*k+x.z*f;p.x+=Y*$,p.z+=T*$,p.y=5.6-.02*Math.abs($)+.25*Math.sin(a*1.9+y.ph)+.3*Math.sin(y.j*1.3),o.place(G,p,Math.atan2(-T,Y),.08*Math.sin(a*2+y.ph),.1,1)}}o.commit()}}})}function at(t,M,I=!1){const F=[],w=[],s=[],S=[],L=[],b=new e.Color,p=new e.Vector3,x=new e.Vector3,O=new e.Vector3,C=(g,l,i,h,o,r,m,n,a=0,d=0)=>(F.push(g,l,i),w.push(h,o,r),s.push(m.r,m.g,m.b),S.push(n,a,d),F.length/3-1),E=(g,l,i,h,o=5)=>{const r=F.length/3;g.forEach((m,n)=>{const a=n/(g.length-1),d=Q(l,i,a);for(let D=0;D<o;D++){const V=D/o*e0,K=d*(.8+.4*X(n*3.1+D*1.7));C(m[0]+Math.cos(V)*K,m[1],m[2]+Math.sin(V)*K,Math.cos(V),.1,Math.sin(V),b.copy(h).multiplyScalar(.7+.5*X(n*7+D)),m[3]??a*.5)}});for(let m=0;m<g.length-1;m++)for(let n=0;n<o;n++){const a=r+m*o+n,d=r+m*o+(n+1)%o;L.push(a,a+o,d,d,a+o,d+o)}},v=(g,l,i,h,o,r,m)=>{x.set(l[0]-g[0],l[1]-g[1],l[2]-g[2]),O.set(i[0]-g[0],i[1]-g[1],i[2]-g[2]),p.crossVectors(x,O),p.lengthSq()<1e-12&&p.set(0,1,0),p.normalize();const n=C(g[0],g[1],g[2],p.x,p.y,p.z,h[0],o[0],r,m);return C(l[0],l[1],l[2],p.x,p.y,p.z,h[1],o[1],r,m),C(i[0],i[1],i[2],p.x,p.y,p.z,h[2],o[2],r,m),L.push(n,n+1,n+2),p.y},c=new e.IcosahedronGeometry(1,0),B=c.attributes.position,u=new e.Color,P=new e.Color,N=new e.Color,z=(g,l,i,h,o,r,m,n,a,d)=>{const D=M()*97,V=M()*e0,K=Math.cos(V),U=Math.sin(V),G=[];for(let y=0;y<B.count;y++){p.fromBufferAttribute(B,y);const R=X(Math.round(p.x*31)+Math.round(p.y*57)*3+Math.round(p.z*91)*7+D),Z=.5+1.1*R*R;G.push([g+(p.x*K-p.z*U)*h*Z,l+p.y*o*Z,i+(p.x*U+p.z*K)*r*Z,a*(.8+.4*(p.y*.5+.5))])}for(let y=0;y<B.count;y+=3){const R=G[y],Z=G[y+1],$=G[y+2],f=((R[1]+Z[1]+$[1])/3-l)/Math.max(o,.001),k=.72+.5*X(y*3.3+D);u.copy(m).lerp(n,j(-.5,.7,f)*(.45+.55*X(y*1.9+D))).multiplyScalar(k),v(R,Z,$,[u,u,u],[R[3],Z[3],$[3]],d*(X(y*5.7+D)<.6?1:0),0)}};if(t==="palm"){const g=new e.Color("#8A9C7A"),l=new e.Color("#56684E"),i=new e.Color("#8A8660"),h=I?9:6,o=I?14:8;for(let r=0;r<h;r++){const m=r/h*e0+M()*.6,n=(r%3===0?1:.3)+M()*.45,a=.5+M()*.4,d=.5+M()*.16,D=Math.cos(m)*Math.cos(n),V=Math.sin(n),K=Math.sin(m)*Math.cos(n),U=D*a,G=V*a,y=K*a,R=-Math.sin(m),Z=Math.cos(m),$=-Math.cos(m)*Math.sin(n),f=Math.cos(n),k=-Math.sin(m)*Math.sin(n),Y=(_,J,W)=>[U+(D*Math.cos(_)+R*Math.sin(_))*J+$*W,G+V*Math.cos(_)*J+f*W,y+(K*Math.cos(_)+Z*Math.sin(_))*J+k*W];v([R*-.03,0,Z*-.03],[R*.03,0,Z*.03],[U,G,y],[i,i,i],[0,0,.5],0,1);const T=[U,G,y],q=Math.PI*1.2/o,H=.85+.3*M();for(let _=0;_<o;_++){const J=(_+.5)/o*Math.PI*1.2-Math.PI*.6,W=d*(.86+.14*Math.cos(J))*(.92+.16*X(_*3.7+r)),t0=Y(J,W,.05*d),a0=Y(J-q*.5,W*.66,-.07*d),n0=Y(J+q*.5,W*.66,-.07*d);u.copy(l).multiplyScalar(H),P.copy(g).multiplyScalar(H*1.12),N.copy(g).multiplyScalar(H*.74),v(T,a0,t0,[u,P,P],[.5,.9,1],0,1),v(T,t0,n0,[u,N,N],[.5,1,.9],0,1)}}}else if(t==="olive"){const g=new e.Color("#6A5A48"),l=new e.Color("#4C6238"),i=new e.Color("#84966A"),h=new e.Color("#B8C2B0"),o=new e.Color("#3C4E2E");E([[0,0,0,0],[.16,.4,.06,.04],[-.08,.85,-.1,.1],[.12,1.25,-.02,.18],[.3,1.7,.05,.28]],.26,.1,g),E([[-.08,.85,-.1,.1],[-.5,1.25,.18,.22],[-.72,1.8,.34,.4]],.13,.05,g,4),E([[.12,1.25,-.02,.18],[.6,1.75,-.3,.32],[.9,2.15,-.5,.45]],.1,.04,g,4),z(.1,2.3,0,.5,.36,.46,o,l,.6,0),z(-.36,2.1,.2,.32,.26,.32,o,l,.65,0);const r=(D,V,K,U,G,y,R)=>{for(let Z=0;Z<G;Z++){const $=M()*2-1,f=M()*e0,k=Math.sqrt(Math.max(1-$*$,0)),Y=Math.cos(f)*k,T=$*.8+.25,q=Math.sin(f)*k,H=.2+.3*M(),_=H+.55+.35*M(),J=-q,W=Y,t0=R*(.7+.6*M()),a0=M();u.copy(a0<.3?h:a0<.6?i:l).multiplyScalar(.72+.5*M()),v([D+Y*U*H-J*t0,V+T*U*H-t0*.5,K+q*U*H-W*t0],[D+Y*U*H+J*t0,V+T*U*H+t0*.5,K+q*U*H+W*t0],[D+Y*U*_,V+T*U*_,K+q*U*_],[u,u,u],[y*.8,y*.8,y],1,1)}},m=I?48:26,n=I?13:10,a=I?.34:.48,d=I?.05:.08;for(let D=0;D<m;D++){const V=D*2.39996+M()*.5,K=1-1.55*(D+.5)/m,U=Math.sqrt(Math.max(1-K*K,0)),G=.82+.3*M();r(.1+Math.cos(V)*U*1.2*G,2.3+K*.8*G,Math.sin(V)*U*1.05*G,a*(.8+.5*M()),n,.7+.3*M(),d)}}else{const g=new e.Color("#7C5038"),l=new e.Color("#22351F"),i=new e.Color("#4C6A40");E([[0,0,0,0],[.25,2.2,.05,.05],[.7,4.6,0,.12],[1.3,6.8,-.1,.22],[2,8.4,-.1,.35]],.3,.13,g,5),E([[1.3,6.8,-.1,.22],[.5,8,.9,.4]],.1,.05,g,3),E([[1.3,6.8,-.1,.22],[1.6,8.1,-1.3,.4]],.1,.05,g,3);for(let h=0;h<10;h++){const o=h/9*e0+M()*.5,r=h===0?0:1.2+M()*1.3;z(2.8+Math.cos(o)*r*1.35,8.75+M()*.5-r*.16,-.1+Math.sin(o)*r,1+M()*.4,.42+M()*.16,.9+M()*.3,l,i,.6+.3*M(),0)}}c.dispose();const A=new e.BufferGeometry;return A.setAttribute("position",new e.Float32BufferAttribute(F,3)),A.setAttribute("normal",new e.Float32BufferAttribute(w,3)),A.setAttribute("color",new e.Float32BufferAttribute(s,3)),A.setAttribute("aSway",new e.Float32BufferAttribute(S,3)),A.setIndex(L),A}const nt=`
attribute vec3 color, aSway; attribute float aPh;
uniform float uTime;
varying vec3 vCol, vN; varying float vFlash, vThin;
${f0}
void main(){
  vec4 wp = instanceMatrix * vec4(position, 1.);
  float sc = length(instanceMatrix[1].xyz), s = aSway.x, t = uTime;
  // a gale from the west: everything leans east and thrashes, tips most
  float gust = 0.55 + 0.45 * sin(t * 0.9 + wp.x * 0.05 + aPh * 6.) * sin(t * 0.37 + wp.z * 0.08);
  wp.x += s * sc * (0.16 + 0.22 * gust + 0.09 * sin(t * 5.3 + aPh * 20. + position.y * 2.));
  wp.z += s * sc * 0.09 * sin(t * 4.1 + aPh * 31. + position.x * 3.);
  wp.y -= s * sc * 0.07 * gust;
  vFlash = aSway.y * smoothstep(0.35, 0.9, 0.5 + 0.5 * sin(t * 2.3 + wp.x * 0.6 + wp.y * 0.9 + aPh * 9.)) * (0.4 + 0.6 * gust);
  vN = mat3(instanceMatrix) * normal; vCol = color; vThin = aSway.z;
  vec4 mv = viewMatrix * wp;
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix * mv;
}`,st=`
precision highp float;
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce;
varying vec3 vCol, vN; varying float vFlash, vThin;
${p0}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) N = -N;
  vec3 alb = mix(vCol, vec3(0.44, 0.50, 0.42), vFlash * 0.85);
  float sd = dot(N, uSunDir), thin = step(0.5, vThin);
  float ndl = mix(clamp(sd * 0.75 + 0.3, 0., 1.), abs(sd) * 0.62 + 0.38, thin);            // a leaf lets the light through: no black backs
  vec3 col = alb * (uSunCol * ndl * 1.1 + uSkyCol * (0.5 + 0.5 * mix(N.y, abs(N.y), thin)) + uBounce * 0.3);
  gl_FragColor = vec4(fogMix(col), 1.);
}`;async function lt(t){const{scene:M,U:I,hero:F,rng:w,detail:s,density:S,path:L,ctx:b}=t,p=F.object.getObjectByName("wall-and-rock"),x=p.geometry.attributes.position,O=p.geometry.attributes.normal,C=101,E=Math.floor(x.count/C),v=new e.Vector3,c=new e.Vector3,B=[],u=[],P=[],N=[];for(let f=2;f<E-2;f++){const k=x.getX(f*C+40);if(k>196)break;for(let Y=48;Y<C-2;Y++){const T=f*C+Y,q=x.getY(T);if(q<10.5)continue;const H=O.getY(T),_=Y>=94,J=k>-230&&q<62;_?Y<97&&P.push(T):H>.42?B.push(T):J&&H>-.1&&X(T*1.7)<.3&&u.push(T),!_&&q<21&&k>-210&&H>-.05&&N.push(T)}f%60===59&&await b.yield()}const z=new e.Matrix4,A=new e.Quaternion,g=new e.Quaternion,l=new e.Euler,i=new e.Vector3,h=new e.Vector3(0,1,0),o=new e.Vector3,r=d0(I,["uTime","uSunDir","uSunCol","uSkyCol","uBounce"],null,nt,st,{side:e.DoubleSide}),m=(f,k,Y,T,q,H,_=!1)=>{const J=at(f,w,_),W=new Float32Array(k),t0=new e.InstancedMesh(J,r,k);for(let a0=0;a0<k;a0++){const n0=Y(a0);typeof n0=="number"?(v.fromBufferAttribute(x,n0),c.fromBufferAttribute(O,n0).normalize()):(v.fromArray(n0.p),c.fromArray(n0.n)),o.set(c.x,0,c.z).multiplyScalar(H).add(h).normalize(),A.setFromUnitVectors(h,o),l.set(0,w()*e0,0),g.setFromEuler(l),A.multiply(g),v.addScaledVector(c,-.15),i.setScalar(w.range(T,q)),L.distanceTo(v.x,v.y,v.z)<7.5+i.x*2&&i.setScalar(.001),n&&typeof n0=="number"&&Math.hypot(v.x-n.position[0],v.z-n.position[2])<11&&Math.abs(v.y-n.position[1])<9&&i.setScalar(.001),z.compose(v,A,i),t0.setMatrixAt(a0,z),W[a0]=w()}J.setAttribute("aPh",new e.InstancedBufferAttribute(W,1)),t0.name=f,t0.frustumCulled=!1,M.add(t0)},n=t.A.ledges.find(f=>f.colony),a=(f,k)=>()=>f[Math.floor(Math.pow(w(),k)*f.length)],d=s*c0(S,.8,1.2),D=B.concat(u),V=(f,k)=>()=>{const Y=N.length&&w()<k?N:f;return Y[Math.floor(w()*Y.length)]};D.length&&m("palm",Math.round(260*d),V(D,.6),1,2.3,.75),await b.yield(),B.length&&m("olive",Math.round(74*d),V(B,.35),1,1.7,.45),await b.yield();const K=P.concat(B.filter(f=>x.getY(f)>30));K.length&&m("pine",Math.round(56*d),a(K,1),.9,1.45,.12),await b.yield();const U=t.escCols.filter(f=>f.top&&f.x>300&&f.x<1500&&f.gul<.6);U.length&&m("pine",Math.round(40*d),()=>{const f=U[Math.floor(Math.pow(w(),1.5)*U.length)],k=2+w()*16;return{p:[f.top[0]-f.nx*k,f.top[1]-.5-k*.05,f.top[2]-f.nz*k],n:[f.nx,0,f.nz]}},1.9,2.7,.1),await b.yield(),await b.yield();const G=t.A.ledges.filter(f=>f.low).sort((f,k)=>(k.colony?1:0)-(f.colony?1:0)),y=[];t.perches=[],G.forEach((f,k)=>{const Y=-f.normal[2],T=f.normal[0],q=(H,_)=>({p:[f.position[0]+Y*H-f.normal[0]*_,f.position[1],f.position[2]+T*H-f.normal[2]*_],n:f.normal});y.push(q(-f.size*(f.colony?.95:.45),.5),q(f.size*(f.colony?1:.5),.2)),k%2===1&&y.push(Object.assign(q(f.size*.15,.9),{olive:1}));for(const H of f.colony?[-.66,-.49,-.33,-.16,.02,.19,.37,.55]:[-.2,.25]){const _=q(f.size*H,f.colony?-1.4:-1);t.perches.push({p:new e.Vector3(_.p[0],_.p[1]+.05,_.p[2]),out:[f.normal[0],f.normal[2]],colony:!!f.colony})}}),t.colonyAt=t.perches.length?t.perches[2].p.clone():new e.Vector3(-23,10,-45);const R=y.filter(f=>!f.olive),Z=y.filter(f=>f.olive);await b.yield(),R.length&&m("palm",R.length,f=>R[f],1.5,2.3,.5,!0),await b.yield(),Z.length&&m("olive",Z.length,f=>Z[f],.95,1.3,.3,!0),await b.yield();const $=B.filter(f=>x.getY(f)<31&&x.getX(f)>-150&&x.getX(f)<185).sort((f,k)=>x.getX(f)-x.getX(k));for(let f=0;f<8&&$.length;f++){const k=$[Math.floor((f+.5)/8*$.length)];v.fromBufferAttribute(x,k),c.fromBufferAttribute(O,k),c.y=0,c.lengthSq()<1e-4&&c.set(0,0,1),c.normalize(),L.distanceTo(v.x,v.y,v.z)>8&&t.perches.push({p:new e.Vector3(v.x+c.x*.35,v.y+.05,v.z+c.z*.35),out:[c.x,c.z]})}t.perches.length||t.perches.push({p:new e.Vector3().fromArray(t.A.ledges[0].position),out:[0,1]})}const it=`
varying vec3 vP, vL, vN;
${f0}
void main(){ vL = position; vec4 wp = modelMatrix * vec4(position, 1.); vP = wp.xyz; vN = mat3(modelMatrix) * normal; vec4 mv = viewMatrix * wp;
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix * mv; }`,rt=`
precision highp float;
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce, uHoney, uBone; uniform float uTideL;
varying vec3 vP, vL, vN;
${p0}
${h0}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 fN = cross(dFdx(vP), dFdy(vP)); fN = normalize(fN + N * 1e-4); if (dot(fN, N) < 0.) fN = -fN;
  N = normalize(mix(N, fN, 0.8));                                             // broken planes, never a smooth box
  float bed = (vL.y - 0.36 * vL.x) / 3.4 + 0.5 * vn(vL.xy * 0.08), fb = fract(bed), bi = floor(bed);
  float joint = 1. - smoothstep(0.0, 0.07, fract(vL.x / (5. + 3. * h21(vec2(bi, 3.))) + 7. * h21(vec2(bi, 40.))));
  float n = fbm3(vL.xy * 0.09 + vL.z * 0.05), n2 = vn(vL.xy * 0.7 + vL.z);
  float tide = vL.y - uTideL + 2.4 * (n - 0.5);
  vec3 alb = mix(uBone * (0.56 + 0.2 * n2 + 0.12 * h21(vec2(bi, 7.))), uHoney * (0.62 + 0.3 * h21(vec2(bi, 3.))), smoothstep(-0.4, 1.4, tide));
  alb = mix(alb, uBone * 0.74, (1. - smoothstep(0.5, 2.6, tide)) * smoothstep(-0.4, 0.3, tide) * 0.8);                     // barnacle
  float weed = (1. - smoothstep(-0.6, 0.2, tide)) * smoothstep(-7., -2.5, tide + 2.5 * (n2 - 0.5));
  alb = mix(alb, vec3(0.07, 0.08, 0.035), weed * 0.88);
  alb *= (1. - 0.32 * smoothstep(0.84, 1., fb)) * (1. - 0.42 * joint) * (0.84 + 0.3 * n);
  alb = mix(alb, alb * vec3(0.72, 0.70, 0.66), smoothstep(0.55, 0.8, vn(vec2(vL.x * 0.5, vL.y * 0.05))) * 0.6);          // wet streaks
  float ndl = max(dot(N, uSunDir), 0.);
  vec3 col = alb * (uSunCol * ndl * 1.05 + uSkyCol * (0.62 + 0.38 * N.y) + uBounce * (0.6 - 0.4 * N.y));
  gl_FragColor = vec4(fogMix(col), 1.);
}`;function ct(t){const{scene:M,U:I,A:F,ctx:w}=t,s=w.noise,S=(E,v)=>Math.round(E*v)/v,L=(E,v,c,B,u)=>{const P=E.attributes.position;for(let N=0;N<P.count;N++){const z=P.getX(N),A=P.getY(N),g=P.getZ(N),l=A/c,i=Math.abs(z)/v,h=.76+.2*Math.cos(l*1.3+.4+u)+.2*S(s.n2(A*2.6/c+u,3.3),2.5)+.1*s.n2(A*9/c,u),o=z*h+.07*v*s.n2(A*8/c,g*.2+5+u),r=A+(.14*c*S(s.n2(z*2.2/v+u,9.1),1.5)+.06*c*s.n2(z*7/v,g*.3))*j(.45,1,Math.abs(l))-.1*c*i*i*Math.sign(l),m=g*(.62+.45*s.n2(z*1.6/v+u,A*1.6/c)+.25*Math.cos(l*1.5))*(1-.45*i*i)+.2*B*s.n3(z*4/v,A*4/c,g*.3+u)+.12*B*S(s.n2(z*3/v+4,A*2.5/c+u),2);P.setXYZ(N,o,r,m)}return E.computeVertexNormals(),E},b=d0(I,["uSunDir","uSunCol","uSkyCol","uBounce","uHoney","uBone"],{uTideL:{value:58}},it,rt),p=L(new e.BoxGeometry(34,62,11,12,20,4),17,31,5.5,0);p.translate(0,31,0);const x=new e.Mesh(p,b),O=new e.Vector3(t.slabAt.x,-50,F.wallZ(t.slabAt.x)+3.5);x.position.copy(O),x.name="falling-slab",x.frustumCulled=!1,M.add(x);const C=[];for(let E=0;E<5;E++){const v=5+3.2*X(E*3.3+1),c=L(new e.BoxGeometry(v*1.5,v,v*.8,4,3,2),v*.75,v*.5,v*.4,3+E*5.7),B=new e.Mesh(c,b);B.name="slab-block",B.frustumCulled=!1,M.add(B),C.push({m:B,x:(X(E*7.1)-.5)*44,y:8+44*X(E*2.9+4),lag:.012*E+.02*X(E+.3),sp:1.5+2*X(E*5.3),ax:X(E*1.7)*6})}t.parts.push({update(E,v,c,B){const u=j(.285,.36,B),P=j(.34,.425,B);x.rotation.x=.42*u*u+.9*P+.012*Math.sin(v*7)*u*(1-P),x.rotation.z=.1*u+.22*P,x.position.set(O.x,O.y-150*P*P,O.z+26*P);for(const N of C){const z=j(.3+N.lag,.335+N.lag,B),A=j(.325+N.lag,.43+N.lag,B);N.m.position.set(O.x+N.x*(1+.3*A),O.y+N.y-170*A*A,O.z+1.5+z*5+30*A),N.m.rotation.set(N.ax+N.sp*3*A,.4*N.ax,N.sp*2*A),N.m.scale.setScalar(z>0?1:.001)}t.uEvent.value=c0((B-.375)/.11,0,1.6)}})}const ht=`
attribute float aLayer;
uniform vec3 uCam;
varying vec2 vUv; varying float vLayer, vNear;
void main(){ vUv = uv; vLayer = aLayer; vNear = smoothstep(9., 24., length(uCam - position)); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,ut=`
precision highp float;
uniform float uTime; uniform vec3 uStreamCol;
varying vec2 vUv; varying float vLayer, vNear;
${h0}
void main(){
  float s = vUv.x * 56., r = vUv.y, t = uTime;
  float a = fbm3(vec2(s * 0.085 - t * 1.3 + vLayer * 7.3, r * 2.0 + s * 0.045 + vLayer * 3.1 + 1.8 * (vn(vec2(s * 0.06 - t * 0.5, vLayer * 9.)) - 0.5)));
  float b = vn(vec2(s * 0.38 - t * 3.1, r * 9. + vLayer * 5.));
  float fil = smoothstep(0.56, 0.74, a) * (0.45 + 0.55 * b) + 0.3 * smoothstep(0.66, 0.9, b) * smoothstep(0.45, 0.65, a);
  float env = smoothstep(0., 0.28, r) * (1. - smoothstep(0.62, 1., r)) * smoothstep(0.0, 0.2, vUv.x) * (1. - smoothstep(0.72, 1., vUv.x));
  float al = (clamp(fil, 0., 1.) * 0.50 + 0.03 * smoothstep(0.3, 0.7, a)) * env * vNear;
  if (al < 0.004) discard;
  gl_FragColor = vec4(uStreamCol * (0.9 + 0.5 * b), al);
}`;function ft(t){const{scene:M,U:I,M:F,path:w}=t,s=w.length,S=new e.Vector3,L=new e.Vector3,b=[],p=[],x=[],O=[],C=48,E=Math.PI+.42,v=-.42;for(let P=0;P<3;P++){const N=s-1.2-P*3.4,z=11.5+P*2.1,A=4.6+P*.6,g=b.length/3;w.posAtDist(N,S),t.rightAt(N,L);for(let l=0;l<=C;l++){const i=l/C,h=Q(E,v,i);for(let o=0;o<2;o++){const r=z+o*A;b.push(S.x+L.x*Math.cos(h)*r,S.y+Math.sin(h)*r,S.z+L.z*Math.cos(h)*r),p.push(i,o),x.push(P)}}for(let l=0;l<C;l++){const i=g+l*2;O.push(i,i+1,i+2,i+1,i+3,i+2)}}const c=new e.BufferGeometry;c.setAttribute("position",new e.Float32BufferAttribute(b,3)),c.setAttribute("uv",new e.Float32BufferAttribute(p,2)),c.setAttribute("aLayer",new e.Float32BufferAttribute(x,1)),c.setIndex(O);const B=new e.ShaderMaterial({uniforms:{uTime:I.uTime,uCam:I.uCam,uStreamCol:{value:new e.Color(F.palette[2]).lerp(new e.Color(F.palette[6]),.5).multiplyScalar(1.05)}},vertexShader:ht,fragmentShader:ut,transparent:!0,depthWrite:!1,side:e.DoubleSide}),u=new e.Mesh(c,B);u.name="spray-arch",u.frustumCulled=!1,u.renderOrder=6,M.add(u)}const pt=`
attribute float aK, aS;
varying vec2 vUv; varying float vK, vS, vD;
${f0}
void main(){ vUv = uv; vK = aK; vS = aS; vec4 mv = modelViewMatrix * vec4(position, 1.); vD = -mv.z;
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix * mv; }`,dt=`
precision highp float;
uniform float uTime; uniform vec3 uMistCol, uShadeCol;
varying vec2 vUv; varying float vK, vS, vD;
${p0}
${h0}
void main(){
  float u = clamp(vUv.x, 0., 1.), v = clamp(vUv.y, 0., 1.), t = uTime, al, w;
  if (vK > 0.5) {                                                        // the thread: filaments sliding DOWN the gully
    float wob = vn(vec2(vS * 0.02 - t * 0.3, 1.)) - 0.5;
    float fil = fbm3(vec2(v * 2.6 + 1.4 * wob, vS * 0.013 - t * 0.42));
    float sv = sin(3.14159 * clamp(v + 0.35 * wob, 0., 1.)); float env = sv * sv * smoothstep(0., 0.1, u) * (1. - smoothstep(0.7, 1., u));
    al = (0.04 + 0.5 * smoothstep(0.40, 0.74, fil)) * env * (0.15 + 0.85 * smoothstep(0.25, 0.7, vn(vec2(vS * 0.009 - t * 0.25, 7.)))) * 0.5; w = 0.5 + 0.5 * fil;
  } else {                                                               // a veil: torn sheets drifting along the foot with the wind
    float wob = vn(vec2(vS * 0.008 - t * 0.12, 3.)) - 0.5;
    float fil = fbm3(vec2(vS * 0.011 - t * 0.22, v * 2.4 + 1.6 * wob)), f2 = vn(vec2(vS * 0.05 - t * 0.6, v * 7.));
    float env = smoothstep(0., 0.3, v) * (1. - smoothstep(0.45, 1., v + 0.4 * wob)) * smoothstep(0., 0.2, u) * (1. - smoothstep(0.75, 1., u));
    al = smoothstep(0.34, 0.7, fil) * (0.7 + 0.3 * f2) * env * 0.68; w = 0.35 + 0.65 * fil * (0.4 + 0.6 * v);
  }
  al *= smoothstep(260., 900., clamp(vD, 0., 5000.));                       // POLISH 2: seen only across the gulf, never as a smear over the scree below the lens;                                        // a veil is weather seen across the gulf; close to and edge-on it was a grey blade on the rock
  if (al < 0.004) discard;
  vec3 col = mix(uShadeCol * 1.15, uMistCol, clamp(w, 0., 1.));
  float f = fogAmt();
  gl_FragColor = vec4(mix(col, fogColor, f * 0.7), al * (1. - 0.4 * f));
}`;function mt(t){const{scene:M,U:I,M:F}=t,w=[],s=[],S=[],L=[],b=[],p=(c,B)=>{const u=w.length/3;let P=0;c.forEach((N,z)=>{z&&(P+=Math.hypot(N[0][0]-c[z-1][0][0],N[0][1]-c[z-1][0][1],N[0][2]-c[z-1][0][2])),w.push(...N[0],...N[1]),s.push(z/(c.length-1),0,z/(c.length-1),1),S.push(B,B),L.push(P,P)});for(let N=0;N<c.length-1;N++){const z=u+N*2;b.push(z,z+1,z+2,z+1,z+3,z+2)}};let x=null;for(const c of t.escCols)c.x>640&&c.x<860&&c.pts.length>8&&(!x||c.gul>x.gul)&&(x=c);const O=t.escCols.filter(c=>c.x>400&&c.x<1100&&c.lo&&c.mid);for(let c=0;c<4&&O.length>12;c++){const B=Math.floor(O.length*(c+.08+.1*X(c*3.1))/4),u=Math.min(Math.floor(O.length*(c+.95)/4),O.length-1),P=[];for(let N=B;N<=u;N++){const z=O[N],A=9+5*X(N*1.3+c),g=.55+.45*X(c*7.7+2);P.push([[z.lo[0]+z.nx*A,z.lo[1]+5,z.lo[2]+z.nz*A],[Q(z.lo[0],z.mid[0],g)+z.nx*A,Q(z.lo[1],z.mid[1],g)+9,Q(z.lo[2],z.mid[2],g)+z.nz*A]])}P.length>2&&p(P,0)}if(!w.length)return;const C=new e.BufferGeometry;C.setAttribute("position",new e.Float32BufferAttribute(w,3)),C.setAttribute("uv",new e.Float32BufferAttribute(s,2)),C.setAttribute("aK",new e.Float32BufferAttribute(S,1)),C.setAttribute("aS",new e.Float32BufferAttribute(L,1)),C.setIndex(b);const E=d0(I,["uTime"],{uMistCol:{value:new e.Color(F.palette[2]).multiplyScalar(.8)},uShadeCol:{value:new e.Color(F.cloudShade).multiplyScalar(.8)}},pt,dt,{transparent:!0,depthWrite:!1,side:e.DoubleSide}),v=new e.Mesh(C,E);v.name="mist-veils",v.frustumCulled=!1,v.renderOrder=4,M.add(v)}const vt=`
varying vec3 vP;
void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,wt=`
precision highp float;
uniform vec3 uCam, uHazeLo, uHazeHi, uMount;
varying vec3 vP;
${h0}
void main(){
  vec2 dxz = vP.xz - uCam.xz; float hd = max(length(dxz), 1.), el = (vP.y - uCam.y) / hd, az = atan(dxz.y, max(dxz.x, 1.));
  float lobe = az - 0.66; lobe = exp(-lobe * lobe / 0.012);
  float ridge = 0.003 + 0.015 * fbm3(vec2(az * 7. + 3., 1.)) * smoothstep(0.2, 0.6, vn(vec2(az * 2.3, 5.))) + lobe * (0.045 + 0.012 * vn(vec2(az * 60., 2.)));
  float mount = 1. - smoothstep(-0.0012, 0.0012, el - ridge);
  float band = 1. - smoothstep(0.0, 0.034, el);
  vec3 col = mix(uHazeHi, uHazeLo, 1. - smoothstep(-0.045, 0.0, el));
  col = mix(col, uMount * (0.92 + 0.16 * vn(vec2(az * 90., el * 400.))), mount * (0.5 + 0.3 * smoothstep(0., 0.04, el)));
  float al = max(band * 0.9, mount * 0.92) * (1. - smoothstep(1.35, 1.75, abs(az)));
  if (al < 0.004) discard;
  gl_FragColor = vec4(col, al);
}`;function gt(t){const{scene:M,U:I,M:F}=t,w=[],s=[],S=64,L=9e3;for(let v=0;v<=S;v++){const c=Q(-1.8,1.8,v/S);for(const B of[-900,-60,60,220,700])w.push(Math.cos(c)*L,B,Math.sin(c)*L)}for(let v=0;v<S;v++)for(let c=0;c<4;c++){const B=v*5+c,u=B+5;s.push(B,u,B+1,B+1,u,u+1)}const b=new e.BufferGeometry;b.setAttribute("position",new e.Float32BufferAttribute(w,3)),b.setIndex(s);const p=new e.Color(F.sunColor).multiplyScalar(F.sunI*.55).add(new e.Color(F.sky).multiplyScalar(F.skyI*1.1)),x=new e.Color(F.ground).lerp(new e.Color(F.palette[5]),.22).multiply(p),O=new e.Color(F.floorA).lerp(new e.Color(F.fog),.12).multiply(p).multiplyScalar(1.25),C=new e.ShaderMaterial({uniforms:{uCam:I.uCam,uHazeLo:{value:x},uHazeHi:{value:O},uMount:{value:new e.Color(F.shade).lerp(O,.5)}},vertexShader:vt,fragmentShader:wt,transparent:!0,depthWrite:!1,side:e.DoubleSide}),E=new e.Mesh(b,C);E.name="desert-haze",E.frustumCulled=!1,E.renderOrder=1,M.add(E)}const yt=`
uniform vec3 uCam; uniform float uTime;
varying float vK, vV, vZ;
void main(){
  vec3 p = position; float bx = p.x + 520., t = uTime, k = 1. - smoothstep(200., 330., bx);
  float sw = k * (0.85 * sin(bx * 0.071 + p.z * 0.018 - t * 0.83) + 0.45 * sin(bx * 0.118 - p.z * 0.052 - t * 1.07 + 2.0) + 0.22 * sin(bx * 0.27 + p.z * 0.19 - t * 1.62 + 4.0));
  float dist = length(uCam - p);
  p.y = -1.86 + sw - 0.4 + uv.y * (2.1 + dist * 0.003);
  vK = smoothstep(70., 170., p.x - uCam.x); vV = uv.y; vZ = p.z;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,bt=`
precision highp float;
uniform vec3 uSunCol, uSkyCol; uniform float uTime;
varying float vK, vV, vZ;
${h0}
void main(){
  float tw = vn(vec2(vZ * 0.55 - uTime * 2.6, uTime * 0.7)) * 0.6 + vn(vec2(vZ * 1.7 + uTime * 3.4, 3.)) * 0.4;
  float a = vK * smoothstep(0.0, 0.25, vV) * (1. - smoothstep(0.8, 1., vV));
  if (a < 0.004) discard;
  gl_FragColor = vec4((uSunCol * 1.7 + uSkyCol * 1.6) * (0.9 + 1.2 * smoothstep(0.35, 0.8, tw)), a);
}`;function xt(t){const{scene:M,U:I,A:F}=t,w=[],s=[],S=[],L=262-u0,b=F.wallZ(L)+2,p=320;for(let E=0;E<=p;E++){const v=b+1500*E/p;w.push(L,0,v,L,0,v),s.push(0,0,0,1)}for(let E=0;E<p;E++){const v=E*2;S.push(v,v+2,v+1,v+1,v+2,v+3)}const x=new e.BufferGeometry;x.setAttribute("position",new e.Float32BufferAttribute(w,3)),x.setAttribute("uv",new e.Float32BufferAttribute(s,2)),x.setIndex(S);const O=new e.ShaderMaterial({uniforms:{uCam:I.uCam,uTime:I.uTime,uSunCol:I.uSunCol,uSkyCol:I.uSkyCol},vertexShader:yt,fragmentShader:bt,transparent:!0,depthWrite:!1,side:e.DoubleSide}),C=new e.Mesh(x,O);C.name="lip-glitter",C.frustumCulled=!1,C.renderOrder=3,M.add(C)}var St={id:"atlantic-falls-in",name:"Where the Sea Ends",category:"prehistoric",weirdness:.3,media:["air","open","water"],async build(t){const M=t.rng,I=t.vary||{},F=c0(t.quality?.detail??1,.5,1),w=c0(I.density??1,.7,1.3),s=new e.Scene,S=M();let L=S<.42?"gold":S<.72?"noon":"pearl";I.hour==="golden"||I.hour==="dawn"?L="gold":I.hour==="day"&&(L=S<.6?"noon":"pearl");const b=G0[L],p={mood:L,cap:M()<.5,lakeSea:M()<.4,petrels:M()<.4,gannets:Math.round(Q(6,20,M())),shearMany:M()<.45,rare:!!I.rare};p.dust=!p.cap;const x=new e.Vector3().fromArray(b.sunDir).normalize(),O=V0({rng:M,preset:b.preset,zenith:b.zenith,horizon:b.horizon,ground:b.ground,groundFalloff:5,horizonPow:3.2,sunDirection:x,sunIntensity:b.disc,sunGlow:L==="pearl"?.25:.5,scatter:.22,scatterColor:b.palette[6],clouds:L==="pearl"?{coverage:.78,softness:.5,lit:"#E9E9E4",shade:"#8794A6"}:!1,clouds2:L==="pearl"?!1:{coverage:.3,opacity:.42,stretch:1,lit:"#F4EEE2",shade:"#A9BCD6",seed:11},fogColor:b.fog});s.add(O.object),s.fog=new e.FogExp2(new e.Color(b.fog),b.fogD),await t.yield();const C=await I0(t,{palette:b.palette,detail:F,gannets:!1,shade:b.shade});C.setLight({sunDir:x,sunColor:b.sunColor,sunIntensity:b.sunI,sky:b.sky,skyIntensity:b.skyI,bounce:b.bounce,bounceIntensity:b.bounceI}),s.add(C.object);const E=C.uniforms,v=C.anchors;await t.yield();const c=v.flyThrough.filter(a=>a[0]<=700-u0+1);{const a=c[c.length-1].slice(),d=C0(v.flyThrough).length,D=C0(c).length,V=Math.max(Math.round((d-D)/25),6);for(let K=1;K<=V;K++){const U=(14-2*j(0,160,(K-.5)*25))*Math.PI/180;a[0]+=Math.cos(U)*25,a[2]-=Math.sin(U)*25,c.push([a[0],8,a[2]])}}const B=C0(c),u=90,P=C0([[u-u0,8,0]].concat(c.filter(a=>a[0]>u-u0+5))),N=a=>(a*P.length+u)/B.length,z=a=>c0((a*B.length-u)/P.length,0,1),A=v.portalSeat,g=[],l={scene:s,hero:C,U:E,A:v,M:b,V:p,rng:M,path:B,detail:F,density:w,ctx:t,parts:g,toOld:N,toNew:z,U0:N(0)},i=(a,d)=>{const D=B.tangentAtDist(a,d);return d.set(-D.z,0,D.x).normalize()};l.rightAt=i,l.diveAt=[0,1].map(a=>{const d=(v0[a].u0+.07)*B.length+v0[a].ahead,D=B.posAtDist(d,new e.Vector3),V=i(d,new e.Vector3);return D.addScaledVector(V,v0[a].side).setY(0)}),await X0(l),l.gazeBasin=new e.Vector3(l.basin.sea?2500:l.basin.x-260,-640,200),J0(l),await t.yield(),ft(l),gt(l),xt(l),await t.yield(),await lt(l),await t.yield(),await et(l),await t.yield(),ot(l),await t.yield(),p.rare&&ct(l),await t.yield(),mt(l),await t.yield(),await O.prewarm(t.renderer,null,s);const h=new e.Vector3,o=new e.Vector3,r=[{at:new e.Vector3(v.firstCrest[0]+24,-21,v.firstCrest[2]+7),from:z(.29),to:z(.445),weight:.6},{at:(a,d)=>{const D=N(d)*B.length+26;return B.posAtDist(D,h),i(D,o),h.addScaledVector(o,-10.5).setY(4.5)},from:z(.445),to:z(.525),weight:.55},{at:new e.Vector3(770-u0,-262,v.pathZ(690-u0)+92),from:z(.527),to:z(.625),weight:.6},{at:new e.Vector3(1050,-600,300),from:z(.645),to:.745,weight:.74},{at:l.gazeBasin,from:.735,to:.915,weight:.6}],m=(a,d,D)=>j(a,d,D),n=a=>Q(Q(Q(1.45,1.2,m(.17,.24,a)),.75,m(.3,.4,a)),1.06,m(.66,.76,a));return{scene:s,path:P,duration:42,pace:a=>n(N(a)),title:"Where the Sea Ends \xB7 5.33 million years ago",camera:{fov:60,near:.5,far:14e3,lookAhead:30,sway:.4,bank:.12},pois:r,portal:{shape:"circle",radius:A.radius,color:"#F3F7F5",glow:1,revealDistance:350},post:{exposure:b.exposure,bloom:{strength:.3,radius:.6,threshold:.95},grade:{saturation:1.08,contrast:1.05,tint:"#ffffff",shadowTint:"#04070c",vignette:.2,grain:.02,aberration:0}},ride:"none",companion:"none",style:"none",update(a,d,D,V){const K=N(V);O.update(a,d,D),C.setProgress(K),C.update(a,d,D);for(let U=0;U<g.length;U++)g[U].update(a,d,D,K)},dispose(){O.dispose(),C.dispose()}}}};export{St as default};
