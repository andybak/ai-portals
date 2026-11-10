import*as z from"three";import{makePath as mn}from"../kit/core.js";import{makeSky as yn,makeLightRig as gn}from"../kit/sky.js";import*as jo from"../kit/structures.js";import*as Pe from"../kit/fauna.js";import*as lt from"../kit/flora.js";import*as ye from"../kit/fx.js";import{buildHero as wn}from"../parts/thousand-kite-roofs.js";const Va=["#F6E9D2","#F4B8C6","#CDE6A5","#A9D4EF","#C68A55","#E3207F","#D8281C"],De=M=>Math.min(1,Math.max(0,M)),p0=(M,X,F0)=>{const v0=De((F0-M)/(X-M));return v0*v0*(3-2*v0)},b0=(M,X,F0)=>M+(X-M)*F0,Z=M=>{const X=new z.Color(M);return[X.r,X.g,X.b]},v=(M,X)=>[M[0]*X,M[1]*X,M[2]*X],xn=(M,X,F0)=>[b0(M[0],X[0],F0),b0(M[1],X[1],F0),b0(M[2],X[2],F0)];function t0(M,X,F0){let v0=Math.imul(M|0,374761393)+Math.imul(X|0,668265263)+Math.imul(F0|0,1274126177)|0;return v0=Math.imul(v0^v0>>>13,1274126177),v0^=v0>>>16,(v0>>>0)/4294967296}const Lo=1.3,ct=-1.25,ee=.15,Ra=1.6,kt=.6,V=1.5,Z0=1020,_0=1236,Ct=24,bn=(M,X=10)=>{const F0=M*Math.PI/180,v0=X*Math.PI/180;return new z.Vector3(Math.sin(v0)*Math.cos(F0),Math.sin(F0),-Math.cos(v0)*Math.cos(F0))},Mn={clear:{title:"The Sky Is Full of Paper",el:18,kites:4800,exposure:1,fog:"#DFDFD4",density:9e-4,night:0,sky:{zenith:"#2E7BD4",mid:"#6FAEE3",horizon:"#DDE2DE",ground:"#cdbfae",horizonPow:5,midPow:1.6,scatterColor:"#F6D6A4",scatter:.65,scatterPow:4,sunColor:"#FFF0CC",sunSize:.9,sunIntensity:12,sunGlow:.75},sun:"#FFE0B0",sunI:3.7,hemiSky:"#9CC4EE",hemiGnd:"#D9B48C",hemiI:1.9,grade:{tint:"#fffaf2",shadowTint:"#0a0c22",saturation:1.1},portal:"#ffb347"},dust:{title:"Paper in a Gold Haze",el:16,kites:4800,exposure:.98,fog:"#EDD3A0",density:.0013,night:0,sky:{zenith:"#3F7CC8",mid:"#9CBBD8",horizon:"#F2D9A2",ground:"#d2bd98",horizonPow:4.2,midPow:2.2,scatterColor:"#FFC766",scatter:.6,scatterPow:4,scatterHigh:.04,sunColor:"#FFE7B8",sunSize:1,sunIntensity:10,sunGlow:1},sun:"#FFDCA0",sunI:3.3,hemiSky:"#B4C6D6",hemiGnd:"#E0B880",hemiI:1.9,grade:{tint:"#fff2d6",shadowTint:"#1a1020",saturation:1.1},portal:"#ffbe4a"},wind:{title:"A Stiff Wind over the Roofs",el:16,kites:4600,exposure:1.02,fog:"#E3DBC6",density:95e-5,night:0,elevation:.45,meanY:56,gust:.75,sky:{zenith:"#1F62C4",mid:"#5C9EE0",horizon:"#E4DCC8",ground:"#cdbfae",horizonPow:4.4,midPow:1.6,scatterColor:"#FFCB80",scatter:.8,scatterPow:3.4,sunColor:"#FFEBC0",sunSize:.95,sunIntensity:12,sunGlow:.85,clouds:{coverage:.42,scale:1.25,opacity:.9,softness:.3,wind:[.07,.016],haze:.3,lit:"#fff3de",shade:"#9296b6"},clouds2:{coverage:.5,stretch:1,opacity:.62,scale:.9,haze:.9,wind:[.1,.02]}},sun:"#FFD8A2",sunI:4.1,hemiSky:"#94BEF2",hemiGnd:"#DDB080",hemiI:1.75,grade:{tint:"#fff6e6",shadowTint:"#0a0c2a",saturation:1.12},portal:"#ffb347"},golden:{title:"The Last Gold Half Hour",el:9.5,kites:4800,exposure:1.06,fog:"#EBC79C",density:95e-5,night:0,sky:{preset:"goldenHour",zenith:"#3565AE",mid:"#8FA6C4",horizon:"#F6CF98",ground:"#c9a882",horizonPow:3.2,midPow:1.4,scatterColor:"#FFA850",scatter:1,scatterPow:3,sunColor:"#FFD9A0",sunSize:1.1,sunIntensity:12,sunGlow:1},sun:"#FFB45E",sunI:3.7,hemiSky:"#9DB2E2",hemiGnd:"#E3A070",hemiI:1.7,grade:{tint:"#fff1dc",shadowTint:"#140a26",saturation:1.12},portal:"#ff9f3a"},dusk:{title:"Lanterns up the Lines",el:7,kites:650,exposure:1.22,fog:"#6A5C8C",density:.0012,night:1,lanterns:!0,sky:{preset:"sunset",zenith:"#182654",mid:"#48508E",horizon:"#F0906A",ground:"#3a3048",horizonPow:3,midPow:1.3,scatterColor:"#FF7E4A",scatter:.9,scatterPow:3,sunElevation:-3,sunIntensity:0,sunGlow:.5,stars:.35,clouds:!1},sun:"#E08C8C",sunI:1.1,hemiSky:"#6C7CD0",hemiGnd:"#7A4E58",hemiI:1.25,grade:{tint:"#f6f0ff",shadowTint:"#0a0620",saturation:1.12},portal:"#ffa040"},morning:{title:"First Kites in the Mist",el:12,kites:1500,exposure:.94,fog:"#DCC6B4",density:95e-5,night:0,mist:!0,sky:{zenith:"#4E8CD0",mid:"#86B4E0",horizon:"#E9CDB4",ground:"#c9bfb4",horizonPow:7,midPow:1.4,scatterColor:"#FFD0AC",scatter:.8,scatterPow:3,sunColor:"#FFE6C8",sunSize:1,sunIntensity:10,sunGlow:1},sun:"#FFCFA0",sunI:3.4,hemiSky:"#A9C6EA",hemiGnd:"#CDB49C",hemiI:1.4,grade:{tint:"#fff8f0",shadowTint:"#0c1028",saturation:1.1},portal:"#ffc060"}},_a=`
uniform sampler2D tA, tB;
uniform vec4 uGrid;                       // x0, z0 of texel (0,0), 1/NX, 1/NZ
uniform vec3 uSunDir, uSun, uSky, uGnd, uShade;
uniform float uTime, uNight, uTanE, uTap;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float vn(vec2 p){                          // smooth value noise
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(h1(i), h1(i + vec2(1., 0.)), f.x), mix(h1(i + vec2(0., 1.)), h1(i + vec2(1., 1.)), f.x), f.y);
}
// height of the house standing at world xz q (0 in a lane); self = the texel of the house being shaded (a haveli
// that spans several plots repeats one texel, so it never shades itself)
float bldH(vec2 q, vec4 self){
  vec2 g = (q - uGrid.xy)/12.; vec2 c = floor(g); vec2 m = (g - c)*12.;
  vec2 uv = (c + .5)*uGrid.zw;
  vec4 a = textureLod(tA, uv, 0.); vec4 ins = textureLod(tB, uv, 0.)*6.;
  float inside = step(ins.x, m.x)*step(m.x, 12. - ins.y)*step(ins.z, m.y)*step(m.y, 12. - ins.w);
  vec4 d = abs(a - self);
  inside *= step(.0015, d.x + d.y + d.z + d.w);
  return a.a*20.*inside;
}
float tapVis(vec2 p, float y, vec2 sn, float t, vec4 self){
  float h = bldH(p + sn*t, self);
  return 1. - smoothstep(-.35, .35, h + .9 - y - t*uTanE)*step(.5, h);
}
// 1 = sunlit, 0 = in the shadow of a house toward the sun (four taps, no loop)
float sunVis(vec2 p, float y, vec2 cell){
  vec4 self = textureLod(tA, (cell + .5)*uGrid.zw, 0.);
  vec2 sn = normalize(uSunDir.xz + vec2(1e-4, 0.));
  return tapVis(p, y, sn, 2.6*uTap, self)*tapVis(p, y, sn, 6.*uTap, self)*tapVis(p, y, sn, 11.*uTap, self)*tapVis(p, y, sn, 19.*uTap, self);
}
// sliding shadows of the kites overhead
float kiteShade(vec2 wxz){
  vec2 g = (wxz + vec2(-uTime*.6, -uTime*1.1))/6.5; vec2 cid = floor(g);
  vec2 f = fract(g) - .5 - (vec2(h1(cid), h1(cid + 3.1)) - .5)*.5;
  return 1. - .55*step(.62, h1(cid + 9.7))*(1. - smoothstep(.09, .15, abs(f.x) + abs(f.y)))*(1. - uNight);
}
// a flat roof: m = position inside the plot, dm = plot size, cell = grid cell, real = 1 when it carries real props,
// open = 1 on the sides (x-, x+, z-, z+) where the roof runs on into the next plot of the same haveli
vec3 roofShade(vec2 m, vec2 dm, vec3 wall, float seed, vec2 wxz, float h, vec2 cell, float real, vec4 open, float plain){
  vec4 ed = vec4(m.x, dm.x - m.x, m.y, dm.y - m.y) + open*99.;
  float edge = min(min(ed.x, ed.y), min(ed.z, ed.w));
  float n = vn(wxz*.33 + seed), n2 = vn(wxz*1.3 + seed*3.);
  vec3 roof = mix(vec3(.63, .5, .39), wall, .4)*(.78 + .26*n)*(.92 + .14*n2);            // sun-baked lime and clay, tinted by the house's own wash
  float rk = max(h1(vec2(seed, 37.)), plain);                                             // one roof in three is another kind: tar, terracotta, a blue tarpaulin, red oxide, ochre
  if (rk < .05) roof = vec3(.17, .17, .2)*(.7 + .5*n)*(.85 + .3*n2);
  else if (rk < .17) roof = vec3(.6, .27, .15)*(.78 + .3*n)*(.9 + .2*n2);
  else if (rk < .21) roof = mix(roof, vec3(.08, .27, .6)*(.75 + .4*vn(wxz*vec2(.5, 2.6) + seed)), step(1., edge)*(1. - real));
  else if (rk < .27) roof = vec3(.5, .2, .16)*(.8 + .3*n)*(.9 + .2*n2);
  else if (rk < .34) roof = vec3(.66, .5, .22)*(.8 + .26*n)*(.9 + .2*n2);
  roof *= .82 + .18*smoothstep(.3, 1.6, edge);                                  // grime along the parapet foot
  vec2 tl = abs(fract(wxz/1.4) - .5), tw = fwidth(wxz)/1.4;                      // floor tiles; each set of joints fades out before it can alias
  vec2 jn = smoothstep(vec2(.465) - tw, vec2(.5), tl)*(1. - smoothstep(vec2(.035), vec2(.12), tw));
  float rl = 1. - smoothstep(.5, 1.5, max(tw.x, tw.y)*1.4);                     // the small things on a far roof fade out before they can sparkle
  roof *= 1. - .2*max(jn.x, jn.y);
  vec2 sn = normalize(uSunDir.xz + vec2(1e-4, 0.));
  float cot = 1./max(uTanE, .05);
  float tx = (sn.x < 0. ? ed.x : ed.y)/max(abs(sn.x), 1e-3);
  float tz = (sn.y < 0. ? ed.z : ed.w)/max(abs(sn.y), 1e-3);
  float lit = smoothstep(cot*.92, cot*1.02, min(tx, tz));
  // a cloth of chillies, turmeric or a bedsheet drying
  vec2 cc = dm*(.3 + .4*vec2(h1(vec2(seed, 3.1)), h1(vec2(seed, 5.3))));
  vec2 cq = abs(m - cc) - vec2(.8 + h1(vec2(seed, 9.))*.9, .6 + h1(vec2(seed, 13.))*.7)*(.5 + 1.5*h1(vec2(seed, 19.)));
  float cloth = step(max(cq.x, cq.y), 0.)*step(.7, h1(vec2(seed, 11.)))*(1. - real)*rl;
  float ck = h1(vec2(seed, 17.));
  vec3 clothC = ck < .4 ? vec3(.62, .05, .03) : (ck < .65 ? vec3(.86, .52, .04) : (ck < .85 ? vec3(.8, .78, .72) : vec3(.12, .4, .62)));
  roof = mix(roof, clothC, cloth);
  // painted stair-head shed and its long shadow (far roofs only)
  vec2 sc0 = dm*(.26 + .48*vec2(h1(vec2(seed, 1.3)), h1(vec2(seed, 7.7))));
  vec2 q = m - sc0;
  float hasShed = (1. - real)*step(.14, h1(vec2(seed, 43.)))*rl;
  float shed = step(max(abs(q.x), abs(q.y)), 1.25)*hasShed;
  vec2 q1 = q + sn*cot*.8, q2 = q + sn*cot*1.6, q3 = q + sn*cot*2.4;
  float ss = max(step(max(abs(q1.x), abs(q1.y)), 1.25), max(step(max(abs(q2.x), abs(q2.y)), 1.25), step(max(abs(q3.x), abs(q3.y)), 1.25)));
  lit *= 1. - ss*(1. - shed)*hasShed;
  // dark water tank
  vec2 tq = m - dm*(.2 + .6*vec2(h1(vec2(seed, 21.)), h1(vec2(seed, 23.))));
  float tank = (1. - smoothstep(.55, .7, length(tq)))*(1. - real)*rl;
  roof = mix(roof, mix(vec3(.1, .1, .12), vec3(.7, .7, .68), step(.5, h1(vec2(seed, 27.)))), tank);
  lit *= sunVis(wxz, h, cell)*mix(1., kiteShade(wxz), rl);
  float par = 1. - smoothstep(.3, .38, edge);
  vec3 shedC = mix(wall, vec3(.76, .72, .68), .35 + .4*h1(vec2(seed, 31.)));
  vec3 alb = mix(mix(roof, shedC, shed), wall*1.04, par);
  lit = mix(lit, 1., max(par, shed)*.8);
  vec3 c = alb*(uShade + uSun*(max(uSunDir.y, 0.)*1.5 + .2*max(par, shed))*lit);
  // dusk: a bare bulb on some roofs
  float bulb = step(.72, h1(cell + 41.))*uNight;
  c += vec3(1., .62, .28)*bulb*(alb*1.6*exp(-dot(q, q)*.09) + 5.*exp(-dot(q, q)*9.));
  return c;
}`,kn=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 iB; attribute vec4 iD; attribute vec3 iCol;
varying vec3 vN; varying vec3 vP; flat varying vec3 vCol; varying vec4 vM; flat varying vec4 vDim; flat varying vec2 vCell;
void main(){
  vec3 lp = vec3(iB.x + position.x*iD.x, position.y*iB.y, iB.z + position.z*iD.y);
  vN = normal; vP = lp; vCol = iCol; vDim = vec4(iD.xy, iB.w, iD.z); vCell = vec2(iD.w, floor(iB.w));
  vM = vec4((position.xz + .5)*iD.xy, abs(normal.x) > .5 ? position.z*iD.y : position.x*iD.x, iB.y - lp.y);
  vec4 mvPosition = modelViewMatrix*vec4(lp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Cn=`
#include <common>
#include <fog_pars_fragment>
${_a}
varying vec3 vN; varying vec3 vP; flat varying vec3 vCol; varying vec4 vM; flat varying vec4 vDim; flat varying vec2 vCell;
void main(){
  vec3 c; float seed = fract(vDim.z)*97.;
  vec2 cell = floor((vec2(vP.x - vN.x*.5, vP.z - vN.z*.5) - uGrid.xy)/12.);
  if (vN.y > .5) c = roofShade(vM.xy, vDim.xy, vCol, seed, vP.xz, vP.y, cell, vDim.w, vec4(step(.5, mod(vCell.x, 2.)), step(1.5, mod(vCell.x, 4.)), 0., 0.), step(3.5, vCell.x));
  else {
    float top = vM.w, y = vP.y, u = vM.z;
    float fp = fwidth(u) + fwidth(y), lod = 1. - smoothstep(.7, 1.8, fp), lod2 = 1. - smoothstep(.1, .3, fp);   // far walls go plain before windows and slats can alias
    float pn = .6*vn(vec2(u*.45, y*.3) + seed) + .4*vn(vec2(u*1.7, y*.9) + seed*1.7);                    // patched, stained limewash
    vec3 alb = vCol*(.74 + .3*pn)*(.74 + .26*smoothstep(0., 2.4, top))*(.5 + .5*smoothstep(1., 12., y));
    float streak = smoothstep(.5, .78, vn(vec2(u*2.6 + seed, y*.07)))*(.55 + .45*vn(vec2(u*9., y*.4 + seed)));
    alb *= 1. - .3*streak*lod*(1. - smoothstep(.3, 4.2, top))*step(1.05, top);                                  // rain streaks under the parapet
    alb = mix(alb, vCol*1.06, 1. - smoothstep(.95, 1.05, top));                                          // parapet band
    alb = mix(alb, vCol*.55, (1. - smoothstep(.03, .09, abs(top - 1.08)))*.7);                           // string course
    float jx = fract(u/1.15) - .5;                                                                       // a row of ventilator jalis under the string course
    float jal = step(abs(jx), .15)*step(abs(top - 1.6), .17)*step(.4, h1(vec2(seed, 71.)))*lod2;
    alb = mix(alb, vCol*mix(.3, .85, max(step(abs(jx), .022), step(abs(top - 1.6), .03))), jal);
    alb = mix(alb, vCol*.6, step(.5, fract(u*2.2))*step(abs(top - 1.22), .09)*lod2*.8);                  // carved bracket ticks
    alb *= 1. - .14*(1. - smoothstep(2.95, 3.05, y))*lod;                                                // a painted dado along the lane
    alb *= 1. - .3*(1. - smoothstep(0., .06, abs(y - 3.05)))*lod2;
    vec2 wq = vec2(u/2.3 + .5, (top - 1.25)/3.1); vec2 wf = fract(wq) - .5; vec2 wi = floor(wq);        // the window rows hang from the roofline
    float hw = h1(wi + seed);
    float okW = step(1.7, top)*step(1.9, y - (.27 - wf.y)*3.1);
    float win0 = step(abs(wf.x), .2)*step(abs(wf.y), .27)*step(.28, hw)*okW, win = win0*lod;
    vec3 shut = mix(vec3(.06, .05, .07), mix(vec3(.07, .3, .34), mix(vec3(.36, .19, .09), vec3(.16, .25, .5), step(.6, h1(wi*2.3 + seed))), h1(wi*1.7 + seed)), step(.45, h1(wi + 4.4)));
    float slat = mix(.9, .8 + .2*step(.5, fract(wf.y*14.)), lod2);
    alb = mix(alb, shut*slat, win);
    float balc = step(.78, hw)*step(abs(wf.x), .34)*step(abs(wf.y - .3), .07)*okW*lod;   // carved wooden balcony rail
    alb = mix(alb, vec3(.3, .17, .08)*(.7 + .5*step(.5, fract(u*4.))), balc);
    alb = mix(vCol*.77*(.5 + .5*smoothstep(1., 12., y)), alb, lod);
    float lit = max(dot(normalize(vN), uSunDir), 0.)*sunVis(vP.xz + vN.xz*.4, y, cell);
    c = alb*(mix(uGnd, uShade, .55)*1.05 + uSun*lit*.95);
    c += vec3(1., .66, .3)*uNight*2.4*mix(.05*okW, win0*step(.62, h1(wi*3.1 + seed)), lod);
  }
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,zn=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vP;
void main(){
  vP = (modelMatrix*vec4(position, 1.)).xyz;
  vec4 mvPosition = viewMatrix*vec4(vP, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,An=`
#include <common>
#include <fog_pars_fragment>
${_a}
uniform vec3 uCamP, uRiver, uSand, uAvg, uHorz; uniform vec4 uTank, uBoxed;
const float R0 = ${Z0.toFixed(1)}, R1 = ${_0.toFixed(1)}, GH = ${Ct.toFixed(1)};
varying vec3 vP;
// a striped awning in an open square: x = the cloth, y = its shadow on the ground (off = the way shadows fall, 2.6 m up)
vec2 awn(vec2 m0, vec2 cell, float k, vec2 off, out vec3 col){
  vec2 c = 2.2 + vec2(h1(cell + k*7.1 + 2.3), h1(cell + k*3.7 + 8.9))*7.6;
  float rot = step(.5, h1(cell + k*5.3));
  vec2 hs = mix(vec2(1.5, 1.), vec2(1., 1.5), rot);
  vec2 q = m0 - c, qs = q - off;
  float ck = h1(cell + k*9.1);
  col = ck < .3 ? vec3(.62, .08, .05) : (ck < .55 ? vec3(.8, .5, .06) : (ck < .78 ? vec3(.08, .36, .5) : vec3(.5, .1, .4)));
  col = mix(col, vec3(.78, .74, .66), step(.5, fract((rot > .5 ? q.x : q.y)*1.6)));
  return vec2(step(max(abs(q.x) - hs.x, abs(q.y) - hs.y), 0.), step(max(abs(qs.x) - hs.x, abs(qs.y) - hs.y), 0.))*step(.3, h1(cell + k*1.9 + 4.));
}
void main(){
  vec2 p = vP.xz;
  float fw = max(fwidth(p.x), fwidth(p.y)), fwz = fwidth(p.y);
  vec2 g = (p - uGrid.xy)/12.; vec2 cell = floor(g); vec2 m0 = (g - cell)*12.;
  vec2 uv = (cell + .5)*uGrid.zw;
  vec4 a = textureLod(tA, uv, 0.); vec4 ins = textureLod(tB, uv, 0.)*6.;
  vec2 m = m0 - ins.xz, dm = vec2(12.) - ins.xz - ins.yw;
  float inG = step(abs(uv.x - .5), .5)*step(abs(uv.y - .5), .5);
  float inside = step(0., min(min(m.x, dm.x - m.x), min(m.y, dm.y - m.y)))*step(.01, a.a)*inG;
  float seed = h1(cell + 1.7)*97.;
  float sunY = max(uSunDir.y, 0.);
  // lanes, bazaar streets and courtyards: packed earth, sunlit only where the houses let the sun in
  float dn = vn(p*.7);
  vec3 lane = vec3(.3, .25, .2)*(.75 + .35*dn)*(.9 + .2*vn(p*3.1));
  float xr = p.x - R0, wr = R1 - R0;
  float river = step(0., xr)*step(xr, wr);
  float openC = (1. - step(.01, a.a))*inG*(1. - river);
  float court = openC*step(.1, a.r)*(1. - step(.35, a.r)*step(a.r, .6));                              // the court of a tomb or a temple, the walk round the tank: clean flags, no stalls
  float square = openC*(1. - court);
  float lodA = 1. - smoothstep(.9, 2.6, fw);
  vec2 ftl = abs(fract(p/1.4) - .5); float ftw = fw/1.4;
  vec2 fj = smoothstep(vec2(.455 - ftw), vec2(.5), ftl)*(1. - smoothstep(.035, .12, ftw));
  lane = mix(lane, lane*vec3(1., .96, .9)*(1. - .3*max(fj.x, fj.y)), openC);                         // the squares are flagged
  lane = mix(lane, vec3(.5, .44, .37)*(.86 + .22*dn)*(1. - .2*max(fj.x, fj.y)), court);
  float pd = length(m0 - 6.);                                                                         // a stone platform in the middle, where the tree stands
  lane = mix(lane, vec3(.46, .42, .38)*(.85 + .3*dn), square*(1. - smoothstep(1.9, 2., pd)));
  lane *= 1. - .4*square*(1. - smoothstep(.02, .14, abs(pd - 2.)))*lodA;
  float dl = min(min(m0.x, 12. - m0.x), min(m0.y, 12. - m0.y));
  lane *= 1. - .22*(1. - smoothstep(.2, 1.3, dl))*(1. - openC);                                       // a worn track down every lane
  // the tank: five stone steps down to the water all round it
  float td = length(p - uTank.xy), tr = uTank.z;
  float tring = (1. - smoothstep(tr + 7.7, tr + 8.3, td))*step(1., tr), twat = (1. - smoothstep(tr - .4, tr + .4, td))*step(1., tr);
  float ts = clamp(td - tr, 0., 7.99)/1.6;
  lane = mix(lane, vec3(.57, .47, .37)*(.6 + .09*floor(ts))*(1. - .28*(1. - smoothstep(0., .22, fract(ts)))*(1. - smoothstep(.3, 1.2, fw))), tring);
  vec2 aoff = -normalize(uSunDir.xz + vec2(1e-4, 0.))*min(2.6/max(uTanE, .05), 5.);
  vec3 ac0, ac1, ac2, ac3;
  vec2 w0 = awn(m0, cell, 0., aoff, ac0), w1 = awn(m0, cell, 1., aoff, ac1), w2 = awn(m0, cell, 2., aoff, ac2), w3 = awn(m0, cell, 3., aoff, ac3);
  float vis0 = sunVis(p, vP.y, vec2(-9.));
  float vis = vis0*(1. - .8*max(max(w0.y, w1.y), max(w2.y, w3.y))*square*lodA);
  vec3 c = lane*(uShade*.75 + uSun*sunY*1.4*vis);
  vec3 awc = w0.x > .5 ? ac0 : (w1.x > .5 ? ac1 : (w2.x > .5 ? ac2 : ac3));
  c = mix(c, awc*(uShade*.9 + uSun*sunY*1.5*vis0), max(max(w0.x, w1.x), max(w2.x, w3.x))*square*lodA);
  c += vec3(1., .6, .25)*uNight*.5*step(.93, h1(floor(p*.22)))*exp(-8.*length(fract(p*.22) - .5));
  vec3 roofC = roofShade(m, dm, a.rgb, seed, p, a.a*20., cell, 0., vec4(step(ins.x, .01), step(ins.y, .01), step(ins.z, .01), step(ins.w, .01)), 0.);
  c = mix(c, roofC, inside);
  // beyond the eye's resolution the mosaic melts. Where real houses stand over it the plane is only their lanes and
  // squares, and goes to their own shaded mean (the blocks keep their dark gaps); elsewhere it is roofs and lanes
  // together and goes to the town's mean, scored by the bazaar streets and varied from quarter to quarter
  float far = max(smoothstep(1.5, 5., fw), 1. - inG);
  float boxed = step(uBoxed.x, p.x)*step(p.x, uBoxed.y)*step(abs(p.y + 2.), mix(uBoxed.z, uBoxed.w, step(R1, p.x)));
  vec3 mean = uAvg*(.84 + .34*vn(p*.013 + 2.))*mix(vec3(1.07, .98, .9), vec3(.92, 1., 1.1), vn(p*.0071 + 9.));
  float sx = abs(fract((g.x - 3.)/14. + .5) - .5)*168., sz = abs(fract((g.y - 6.)/19. + .5) - .5)*228.;
  mean *= 1. - .3*(1. - smoothstep(3., 8. + fw, min(sx, sz)))*(1. - smoothstep(18., 50., fw))*inG;
  vec3 farC = mix(mean*(uShade + uSun*.5)*1.25, lane*(uShade*.75 + uSun*sunY*1.4*mix(.16, .75, openC)), boxed);
  c = mix(c, farC, far);
  // water: the tank with its island of grass, and the river
  vec3 V = normalize(uCamP - vP + vec3(0., 1e-4, 0.)); float gz = clamp(V.y, 0., 1.);
  float band = .5 + .5*sin(p.y*.012 + p.x*.03 + sin(p.y*.004)*3.);
  vec3 deep = vec3(.04, .19, .24);
  vec2 gp = p*vec2(.08, .3); vec2 gi = floor(gp);
  float tw = h1(gi), gl = pow(max(sin(tw*6.283 + uTime*(1.5 + 3.*h1(gi + 7.))), 0.), 24.)*step(.55, tw);
  vec3 pond = mix(deep*vec3(.9, 1.15, .9), uRiver, .42 - .2*smoothstep(.08, .45, gz))*(.8 + .25*vn(p*.21 + uTime*.05))*(.5 + .5*vis0) + uSun*gl*.7*vis0*(1. - uNight);
  pond = mix(pond, vec3(.2, .34, .11)*(.8 + .4*dn)*(uShade + uSun*sunY*1.4*vis0), 1. - smoothstep(7.4, 8.2, td));
  c = mix(c, pond, twat);
  // the river beyond the last houses: a flagged road along each bank, three flights of stone steps going down, saris
  // laid out on them to dry, sand between the ghats, then the water with the far bank standing in it
  float bank = min(xr, wr - xr), side = step(wr*.5, xr);
  float shore = GH + 3.*(vn(vec2(p.y*.021, side*7.3 + 1.)) - .5);
  float wet = smoothstep(shore - .7, shore + .7, bank);
  float flt = floor(clamp(bank - 6., 0., 17.9)/6.);
  vec3 stone = mix(vec3(.6, .49, .38), vec3(.5, .39, .32), h1(vec2(floor(p.y/37.), side + 2.)))*(1. - .13*flt)*(.9 + .2*dn);
  stone *= 1. - .25*(1. - smoothstep(0., .3, fract(max(bank - 6., 0.)/1.2)))*(1. - smoothstep(.3, 1.3, fw))*step(6., bank);
  float sandy = smoothstep(.56, .66, vn(vec2(p.y*.0065, side*3. + 4.)))*step(6., bank);
  float rip = (.5 + .5*sin(p.x*.85 + sin(p.y*.045)*5. + vn(p*.09)*7.))*(1. - smoothstep(.25, 1.1, fw));
  stone = mix(stone, uSand*mix(1., .85 + .25*h1(floor(p*.5)), 1. - smoothstep(1., 4., fw))*(.9 + .12*rip), sandy);
  vec2 sq = vec2(p.y/3.4, side*5. + 2.); float sh = h1(vec2(floor(sq.x), sq.y)), sk = h1(vec2(floor(sq.x), sq.y + 9.));
  float sari = step(.6, sh)*step(abs(fract(sq.x) - .5), .37)*step(8., bank)*step(bank, 13. + 8.*sk)*(1. - wet)*(1. - smoothstep(1.3, 3.2, fwz));
  vec3 sariC = sk < .25 ? vec3(.78, .06, .2) : (sk < .5 ? vec3(.9, .5, .04) : (sk < .7 ? vec3(.05, .42, .5) : (sk < .85 ? vec3(.85, .8, .7) : vec3(.4, .1, .5))));
  stone = mix(stone, sariC, sari*.92);
  vec3 bankC = stone*(uShade*.8 + uSun*sunY*1.45*vis0);
  vec3 water = mix(deep, uRiver, .5 - .22*smoothstep(.08, .45, gz))*(.82 + .3*band);
  float refl = smoothstep(wr - GH - 44., wr - GH - 3., xr)*(1. - uNight);
  water = mix(water, uAvg*(uShade + uSun*.4)*(.75 + .5*vn(vec2(p.y*.11, 5.))), refl*.5);
  water += uSun*gl*1.1*step(.75, tw)*(1. - uNight);
  float across = smoothstep(GH, wr - GH, xr);
  vec2 gi2 = floor(p*vec2(.21, .56)); float tw2 = h1(gi2 + 5.);
  float gl2 = pow(max(sin(tw2*6.283 + uTime*(.8 + 1.6*h1(gi2 + 3.))), 0.), 16.)*step(.82, tw2)*(1. - smoothstep(2., 6., fw));
  water = mix(water, mix(uRiver*.75, uHorz, across*across)*(.82 + .3*band) + vec3(1., .55, .22)*gl2*.7*(1. - .6*across), uNight);   // dusk: the afterglow lies on it, a few lamps glitter
  c = mix(c, mix(bankC, water, wet), river);
  // outside the walls the town thins into fields: mustard in flower, green wheat, stubble, bare earth, woods
  vec2 og = max(abs(uv - .5) - .5, 0.)/uGrid.zw*12.;
  float cty = smoothstep(30., 240., max(og.x, og.y) + 70.*vn(p*.0055 + 4.))*(1. - river);
  vec2 fq = p*vec2(.0085, .013) + vn(p*.0031 + 7.)*1.6; vec2 fi = floor(fq), ff = fract(fq);
  float fh = h1(fi + 3.3);
  vec3 field = fh < .28 ? vec3(.19, .33, .1) : (fh < .52 ? vec3(.6, .5, .1) : (fh < .78 ? vec3(.43, .33, .2) : vec3(.3, .4, .15)));
  float fe = min(min(ff.x, 1. - ff.x)/.0085, min(ff.y, 1. - ff.y)/.013);
  field *= 1. - .3*(1. - smoothstep(1.5, 5. + fw, fe))*(1. - smoothstep(6., 25., fw));
  field = mix(field, vec3(.34, .36, .15), smoothstep(15., 70., fw)*.75);
  field = mix(field, vec3(.085, .17, .065), smoothstep(.56, .68, vn(p*.017 + 11.))*.85);
  c = mix(c, field*(uShade + uSun*sunY*1.5), cty);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,ja=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aCol; attribute vec3 aW;       // wave amplitude (m), phase, translucency
uniform float uTime, uFlut, uAmp;
varying vec3 vN; varying vec3 vP; varying vec3 vCol; varying float vTr; varying vec3 vL; varying vec3 vTx; varying float vRip; varying float vBox;
void main(){
  float w = sin(uTime*uFlut + aW.y) + .4*sin(uTime*uFlut*2.3 + aW.y*1.7);
  float fig = step(aW.z, -1.5);               // part of a figure: it rides up and down by aW.x (a flyer tugging his line)
  vBox = (aW.z < -.5 && fig < .5) ? aW.y - 2. : -1.;        // a marked box: 0 at its foot, 1 at its top (3 = a tin lid)
  vec3 lp = position + normal*aW.x*w*uAmp*(1. - fig);
  float tug = sin(uTime*2.4 + aW.y);
  lp.y += fig*aW.x*tug*tug;
  vec4 wp = modelMatrix*vec4(lp, 1.);
  vN = mat3(modelMatrix)*normal; vP = wp.xyz; vCol = aCol; vTr = max(aW.z, 0.);
  vL = position; vTx = normalize(modelMatrix[0].xyz + vec3(1e-6, 0., 0.));
  vRip = aW.x*uAmp*(cos(uTime*uFlut + aW.y) + .68*cos(uTime*uFlut*2.3 + aW.y*1.7));          // slope of the wave, so a ripple shades
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,La=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSunDir, uSun, uSky, uGnd, uCamP, uMoon; uniform float uNight, uGain, uTime, uFlut;
varying vec3 vN; varying vec3 vP; varying vec3 vCol; varying float vTr; varying vec3 vL; varying vec3 vTx; varying float vRip; varying float vBox;
float ph1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float pvn(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(ph1(i), ph1(i + vec2(1., 0.)), f.x), mix(ph1(i + vec2(0., 1.)), ph1(i + vec2(1., 1.)), f.x), f.y);
}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), V = normalize(uCamP - vP + vec3(0., 1e-5, 0.));
  if (dot(N, V) < 0.) N = -N;
  float tis = step(.95, vTr);                                    // our own kite's tissue, seen from beneath against the sky
  float mot = pvn(vec2(vP.x + vP.z*.73, vP.y*.6)*.9), mot2 = pvn(vec2((vP.x - vP.z*.61)*4.3, vP.y*.35));     // stains and vertical streaks
  vec3 alb = vCol*mix(.86 + .16*mot + .08*mot2, 1., step(.25, vTr));
  float fb = fwidth(vBox), fx_ = fwidth(vP.x) + fwidth(vP.z);
  if (vBox > 2.5) alb *= 1. - .2*(.5 + .5*sin((vP.x + vP.z*.02)*38.))*(1. - smoothstep(.02, .07, fx_));        // corrugated tin
  else if (vBox > -.5 && abs(N.y) < .5) {                         // limewash: mottled, grimy at the foot, rain-streaked under the lid, a painted dado
    float bu = vP.x + vP.z;
    alb *= .76 + .34*pvn(vec2(bu, vP.y*.8)*1.2);
    alb *= mix(.68, 1., smoothstep(0., .3, vBox));
    alb *= 1. - .28*smoothstep(.55, .8, pvn(vec2(bu*6., vP.y*.12)))*smoothstep(.45, 1., vBox);
    alb *= mix(.8, 1., smoothstep(.215, .225, vBox));
    alb *= 1. - .35*(1. - smoothstep(.012, .012 + fb, abs(vBox - .232)))*(1. - smoothstep(.02, .06, fb));
  }
  if (tis > .5) {
    float tt = uTime*uFlut;
    float r1 = cos(vL.x*6.5 - vL.z*4. + tt*.9), r2 = cos(vL.x*15. + vL.z*11. - tt*1.7), r3 = cos(vL.x*27. - vL.z*19. + tt*2.6);
    N = normalize(N + vTx*(vRip*5.2 + .2*r1 + .14*r2 + .08*r3));                   // the paper ripples and buzzes
    float kx = abs(vL.x)/${Lo.toFixed(2)};
    float ef = (vL.z - (${ct.toFixed(2)} + ${(ee-ct).toFixed(2)}*kx))*.68, er = (${ee.toFixed(2)} + ${(Ra-ee).toFixed(2)}*(1. - kx) - vL.z)*.72;   // how far in from the leading and trailing edges
    float md = length(vL.xz - vec2(0., -.2)), md2 = length(vL.xz - vec2(.13, -.3));
    float moon = (1. - smoothstep(.36, .375, md))*smoothstep(.27, .285, md2);       // a crescent moon on the breast
    moon = max(moon, smoothstep(1., 1.02, vL.z));                                    // the tail quarter in the second paper
    moon = max(moon, 1. - smoothstep(.055, .068, min(ef, er)));                      // a pasted border all round
    alb = mix(alb, uMoon, moon);
    float fib = pvn(vL.xz*vec2(90., 7.)), fib2 = pvn(vL.xz*vec2(31., 2.6) + 7.);
    alb *= .7 + .32*fib + .18*fib2; alb += vec3(.05, .035, .05)*fib*fib2;  // long fibres in the tissue
    alb *= 1. - .24*smoothstep(.45, .5, abs(fract(vL.x*3. + .5) - .5));            // creases where the sheets are pasted
    alb *= 1. - .16*smoothstep(.44, .5, abs(fract(vL.z*2.2 + .1) - .5));
    alb *= mix(.22, 1., smoothstep(.01, .03, abs(vL.x)));                           // the bamboo spine, dark through the paper
    alb *= mix(.3, 1., smoothstep(.008, .022, abs(vL.z - (${(ct+.3).toFixed(2)} + ${(ee-ct-.3).toFixed(2)}*kx*kx))));   // and the bow
  }
  float ndl = dot(N, uSunDir);
  vec3 amb = mix(uGnd, uSky, .5 + .5*N.y)*1.1;
  vec3 c = alb*(amb + uSun*max(ndl, 0.));
  float vds = max(dot(-V, uSunDir), 0.);
  vec3 tc = mix(vCol, alb, tis);
  c += (tc*tc*.6 + tc*.75)*uSun*max(-ndl, 0.)*mix(1.5, .9, tis)*(.5 + .5*vds*vds)*vTr;       // stained-glass tissue against the sun
  float hot = vds*vds*vds;
  c += tis*((tc + .06)*uSun*hot*1.7 + tc*(uSky*(.4 + .9*(1. - smoothstep(.16, .42, uSunDir.y))) + vec3(1., .58, .28)*.32*uNight));     // the sunward side blazes; sky light comes through; at dusk the lamps below light it
  c *= uGain;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,Fn=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aUv; attribute float aT;
uniform float uTime;
varying vec3 vN; varying vec3 vP; varying vec3 vUv;
void main(){
  vec3 lp = position; float part = aUv.z;
  if (part > 1.5) {
    float wa = uTime*7. - aT*5.5;
    lp.x += (sin(wa)*.26 + sin(uTime*11.3 - aT*9.)*.1)*aT*1.5;
    lp.z += cos(wa)*.3*aT;
  } else lp.z += sin(uTime*19. + position.y*5.)*.03*(.3 + abs(position.x));
  vec4 wp = modelMatrix*vec4(lp, 1.);
  vN = mat3(modelMatrix)*normal; vP = wp.xyz; vUv = vec3(aUv.x, part > 1.5 ? aT : aUv.y, part);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Sn=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSunDir, uSun, uSky, uGnd, uCamP, uC1, uC2; uniform float uNight;
varying vec3 vN; varying vec3 vP; varying vec3 vUv;
float rh1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float rvn(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(rh1(i), rh1(i + vec2(1., 0.)), f.x), mix(rh1(i + vec2(0., 1.)), rh1(i + vec2(1., 1.)), f.x), f.y);
}
void main(){
  float x = vUv.x, y = vUv.y, part = vUv.z;
  float aa = fwidth(x)*1.5 + fwidth(y)*1.5 + 1e-4;
  vec3 base; float bone = 0.;
  if (part < .5) {
    float d = length(vec2(x, y - .2)), d2 = length(vec2(x - .16, y - .29));
    float m = (1. - smoothstep(.45, .45 + aa, d))*smoothstep(.36, .36 + aa, d2);          // a crescent moon: two circles
    base = mix(uC1, uC2, m);
    float e = 1. - abs(x)/.95 - (y > .2 ? (y - .2)/.8 : (.2 - y)/1.2);                   // 0 on the rim of the diamond
    float fib = rvn(vec2(x*52., y*5.)), fib2 = rvn(vec2(x*8. + 3., y*19.));
    base *= .8 + .24*fib + .12*fib2;
    float seam = max(1. - smoothstep(.012, .012 + aa, abs(abs(x) - .52)), 1. - smoothstep(.012, .012 + aa, abs(y + .36)));
    base *= 1. - .25*seam;
    base = mix(base, uC2, 1. - smoothstep(.06, .06 + aa, e));                             // a pasted border in the moon's colour
    float spine = 1. - smoothstep(.018, .018 + aa, abs(x));
    float bw = .2 + .78*sqrt(max(1. - x*x/.9025, 0.));
    float bow = 1. - smoothstep(.02, .02 + aa, abs(y - bw));
    bone = max(spine, bow)*.9;
    base = mix(base, base*.45, bone);
  } else if (part < 1.5) {
    float st = fract(x*13.);
    base = mix(uC2, uC1, step(.5, st));
    if (y < -1.08 && abs(st - .5) > .3) discard;
  } else base = mix(uC2, uC1, step(.5, fract(floor(y*6. + .001)*.5 + .25)));
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), V = normalize(uCamP - vP + vec3(0., 1e-5, 0.));
  if (dot(N, V) < 0.) N = -N;
  float ndl = dot(N, uSunDir), vds = max(dot(-V, uSunDir), 0.);
  vec3 c = base*(mix(uGnd, uSky, .5 + .5*N.y)*1.25 + uSun*max(ndl, 0.)*(1. - .4*bone));
  c += (base*base*1.25 + base*.35)*uSun*max(-ndl, 0.)*1.6*(.5 + .5*vds*vds)*(1. - .8*bone);   // stained glass against the sun
  c += base*vec3(1., .6, .3)*.3*uNight;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,qn=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 iPos; attribute vec3 iVel; attribute vec4 iPar; attribute vec3 iCol;   // iPar: phase, rate, size, mode
uniform float uTime, uSurge, uPx; uniform vec3 uCamP;
varying vec2 vUv; varying vec3 vCol; varying float vMode; varying float vH;
void main(){
  float mode = iPar.w, ph = iPar.x, sz = iPar.z;
  vec3 P = iPos; float w = sz, h = sz, show = 1.;
  if (mode < .5) {                                   // a person: bobbing, jumping when a kite is cut
    float j = abs(sin(uTime*iPar.y + ph));
    P.y += j*j*(.12 + .75*uSurge*step(.3, fract(ph*3.7)));
    P.xz += iVel.xz*sin(uTime*.23*iPar.y + ph*2.);
    w = sz*.42; h = sz;
  } else if (mode < 1.5) {                           // a rickshaw or handcart threading a lane
    float f = fract(uTime*iPar.y + ph);
    P += iVel*f; show = smoothstep(0., .04, f)*(1. - smoothstep(.96, 1., f));
    w = sz*1.25; h = sz;
  } else if (mode < 2.5) {                           // an escaped balloon
    float f = fract(uTime*iPar.y + ph);
    P += vec3(sin(f*9. + ph*5.)*6., f*iVel.y, -f*iVel.y*.5 + cos(f*7. + ph)*4.);
    show = smoothstep(0., .05, f)*(1. - smoothstep(.9, 1., f));
  } else if (mode < 3.5) {                           // a balloon tied to a parapet corner
    P += vec3(sin(uTime*1.7 + ph)*.18, sin(uTime*2.3 + ph*2.)*.06, -.25 + cos(uTime*1.3 + ph)*.15);
  } else {                                           // a disc of the centipede kite
    float f = fract(uTime*iPar.y);
    P += iVel*f + vec3(0., sin(uTime*1.1 - ph)*9. + sin(uTime*.37 - ph*.3)*14., sin(uTime*.9 - ph*1.3)*5.);
    show = smoothstep(0., .08, f)*(1. - smoothstep(.92, 1., f));
  }
  float dist = length(P - uCamP);
  float crowd = 1. - step(.5, mode);
  show *= 1. - crowd*smoothstep(250., 450., dist);                 // far off the crowd melts into the roofs
  float fl = max(1., 1.6*dist*uPx/max(w, 1e-3));
  w *= fl*show; h *= mix(1., fl, .6)*show;
  vec3 rt = normalize(vec3(viewMatrix[0][0], 0., viewMatrix[2][0]) + vec3(1e-5, 0., 0.));
  vec3 up = mode < 1.5 ? vec3(0., 1., 0.) : vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  if (mode > 1.5) rt = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 lp = P + rt*position.x*w + up*position.y*h;
  vUv = position.xy; vCol = mix(iCol, vec3(.56, .52, .5), .5*crowd*smoothstep(150., 300., dist)); vMode = mode; vH = fract(ph*7.3);
  vec4 mvPosition = viewMatrix*vec4(lp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Pn=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSun, uSky, uGnd; uniform float uNight;
varying vec2 vUv; varying vec3 vCol; varying float vMode; varying float vH;
void main(){
  vec2 q = vUv; vec3 c = vCol; float a = 1.;
  if (vMode < .5) {
    float head = 1. - step(.17, length((q - vec2(0., .86))*vec2(.42, 1.)));
    float body = step(abs(q.x), .5 - .25*(1. - smoothstep(.0, .45, q.y)))*step(q.y, .74);
    float arms = step(.5, vH)*step(.55, q.y)*step(abs(abs(q.x) - (.1 + (q.y - .55)*.9)), .09);
    a = max(max(head, body), arms);
    c = mix(mix(c, c*.45, step(q.y, .36)*step(.5, fract(vH*5.))), vec3(.3, .19, .13), max(head, arms*(1. - body)));
  } else if (vMode < 1.5) {
    a = step(abs(q.x), .5)*step(q.y, .95);
    c = mix(c, vec3(.05, .05, .06), step(.62, q.y));
    c = mix(c, vec3(.03), step(q.y, .16)*step(.2, abs(abs(q.x) - .3)));
  } else {
    vec2 d = vec2(q.x*2., (q.y - .5)*2.); float r = length(d);
    a = 1. - step(1., r);
    if (vMode > 3.5) c = mix(c, vec3(.95, .9, .8), step(r, .45))*mix(1., .15, step(r, .2));
    else c = c*(.75 + .5*(1. - r)) + vec3(.5)*(1. - smoothstep(.0, .35, length(d - vec2(-.3, .35))));
  }
  if (a < .5) discard;
  c *= (uSky + uGnd)*.6 + uSun*.62;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;function ft(){const M=[],X=[],F0=[],v0=[],T0={get triangles(){return M.length/9},tri(I,H,s0,E,i0,U,w0,M0,U0){const r0=H[0]-I[0],j0=H[1]-I[1],S0=H[2]-I[2],o0=s0[0]-I[0],q0=s0[1]-I[1],C0=s0[2]-I[2];let m0=j0*C0-S0*q0,y0=S0*o0-r0*C0,a0=r0*q0-j0*o0;const l0=Math.hypot(m0,y0,a0)||1;m0/=l0,y0/=l0,a0/=l0,M.push(I[0],I[1],I[2],H[0],H[1],H[2],s0[0],s0[1],s0[2]),X.push(m0,y0,a0,m0,y0,a0,m0,y0,a0);const j=M0||E,c0=U0||E;F0.push(E[0],E[1],E[2],j[0],j[1],j[2],c0[0],c0[1],c0[2]);const Q=i0||zt,J=U||Q,$=w0||Q;v0.push(Q[0],Q[1],Q[2],J[0],J[1],J[2],$[0],$[1],$[2])},quad(I,H,s0,E,i0,U,w0,M0){T0.tri(I,H,s0,i0,U,U,w0||U,i0,M0||i0),T0.tri(I,s0,E,i0,U,w0||U,w0||U,M0||i0,M0||i0)},box(I,H,s0,E,i0,U,w0,M0=0,U0,r0){const j0=Math.cos(M0),S0=Math.sin(M0),o0=E/2,q0=U/2,C0=(te,Yt,At)=>[I+te*j0+At*S0,H+Yt,s0-te*S0+At*j0],m0=C0(-o0,0,-q0),y0=C0(o0,0,-q0),a0=C0(o0,0,q0),l0=C0(-o0,0,q0),j=C0(-o0,i0,-q0),c0=C0(o0,i0,-q0),Q=C0(o0,i0,q0),J=C0(-o0,i0,q0),$=Array.isArray(r0),E0=$?r0:r0?zt:Dn,Y=$?r0:r0?zt:Bn;return T0.quad(l0,a0,Q,J,w0,E0,Y),T0.quad(y0,m0,j,c0,w0,E0,Y),T0.quad(a0,y0,c0,Q,w0,E0,Y),T0.quad(m0,l0,J,j,w0,E0,Y),T0.quad(J,Q,c0,j,U0||w0,Y),w0},cyl(I,H,s0,E,i0,U,w0,M0,U0,r0,j0){for(let S0=0;S0<w0;S0++){const o0=S0/w0*6.2832,q0=(S0+1)/w0*6.2832,C0=Math.cos(o0),m0=Math.sin(o0),y0=Math.cos(q0),a0=Math.sin(q0),l0=[I+C0*E,H,s0+m0*E],j=[I+y0*E,H,s0+a0*E],c0=[I+y0*i0,H+U,s0+a0*i0],Q=[I+C0*i0,H+U,s0+m0*i0],J=Array.isArray(M0[0])?M0[S0%M0.length]:M0;i0>.001?T0.quad(j,l0,Q,c0,J,r0,r0,j0):T0.tri(j,l0,[I,H+U,s0],J,r0,r0,r0,J,j0||J),U0&&i0>.001&&T0.tri(Q,[I,H+U,s0],c0,U0,r0)}},pole(I,H,s0,E,i0){const U=H[0]-I[0],w0=H[1]-I[1],M0=H[2]-I[2],U0=Math.hypot(U,w0,M0)||1;let r0=-M0,j0=0,S0=U;Math.abs(w0)>.9*U0&&(r0=1,S0=0);const o0=Math.hypot(r0,j0,S0)||1;r0/=o0,S0/=o0;const q0=(w0*S0-M0*j0)/U0,C0=(M0*r0-U*S0)/U0,m0=(U*j0-w0*r0)/U0;for(let y0=0;y0<3;y0++){const a0=y0*2.0944,l0=a0+2.0944,j=Math.cos(a0)*s0,c0=Math.sin(a0)*s0,Q=Math.cos(l0)*s0,J=Math.sin(l0)*s0,$=[r0*j+q0*c0,j0*j+C0*c0,S0*j+m0*c0],E0=[r0*Q+q0*J,j0*Q+C0*J,S0*Q+m0*J];T0.quad([I[0]+E0[0],I[1]+E0[1],I[2]+E0[2]],[I[0]+$[0],I[1]+$[1],I[2]+$[2]],[H[0]+$[0],H[1]+$[1],H[2]+$[2]],[H[0]+E0[0],H[1]+E0[1],H[2]+E0[2]],E,i0)}},build(){const I=new z.BufferGeometry;return I.setAttribute("position",new z.Float32BufferAttribute(M,3)),I.setAttribute("normal",new z.Float32BufferAttribute(X,3)),I.setAttribute("aCol",new z.Float32BufferAttribute(F0,3)),I.setAttribute("aW",new z.Float32BufferAttribute(v0,3)),I.computeBoundingSphere(),I},async buildAsync(I){const H=new z.BufferGeometry;for(const[s0,E]of[["position",M],["normal",X],["aCol",F0],["aW",v0]])H.setAttribute(s0,new z.Float32BufferAttribute(E,3)),await I();return H.computeBoundingSphere(),H}};return T0}const zt=[0,0,0],Dn=[0,2,-1],Bn=[0,3,-1],Wo=[0,5,-1];var In={id:"thousand-kite-roofs",name:"The Sky Is Full of Paper",category:"city",weirdness:.1,media:["air","open"],async build(M){const X=M.rng,F0=M.vary||{},v0=M.quality?.detail??1,T0=F0.density??1,I=new z.Scene,H=X.fork("look");let s0={day:H.pick(["clear","clear","dust","wind"]),golden:"golden",night:"dusk",dawn:"morning"}[F0.hour];s0||(s0=H.pick(["clear","clear","wind","dust","dust","golden","golden","dusk","morning","morning"]));const E=Mn[s0],i0=!!F0.rare,U=E.night,w0=H.pick(["all","all","magenta-saffron","turquoise-white"]),M0=H.pick([["#EC2F9E","#F9D3E4"],["#EC2F9E","#FFD070"],["#F59A12","#FFF0C8"],["#17B3B9","#F6E9D2"]]),U0=H.pick([["#5B1E8C","#F6E9D2"],["#2B2E7A","#F59A12"],["#2B2E7A","#F59A12"],["#f2ede0","#D8281C"]]),r0=H.chance(.3),j0=H.chance(.55),S0=H.chance(.45)&&!U&&!E.sky.clouds2,o0=bn(E.el),q0=new z.Vector2(o0.x,o0.z).normalize(),C0=Math.max(Math.tan(E.el*Math.PI/180),.09),m0=176,y0=144,a0=-38,l0=-72,j=X.int(1,9999),c0=m0*y0,Q=new Float32Array(c0),J=new Float32Array(c0*4),$=new Float32Array(c0*3),E0=new Uint8Array(c0),Y=(e,t)=>(t-l0)*m0+(e-a0),te=(e,t)=>e>=a0&&e<a0+m0&&t>=l0&&t<l0+y0,Yt=e=>Math.round(e/20*255)/255*20,At=e=>Math.round(e/6*255)/255*6,Wa=e=>{const t=(e[0]+e[1]+e[2])/3;return e.map(n=>Math.min(1.1,Math.max(.02,t+(n-t)*1.45))*.97)},Ft=["#F6E9D2","#F4B8C6","#CDE6A5","#A9D4EF","#F6E9D2","#f2efe8","#F4B8C6","#A9D4EF","#F6E9D2","#CDE6A5","#f2efe8","#C68A55","#efd9a8","#e9c3a0"].map(Z).map(Wa),Oa=[[3,7,5],[0,12,13],null,[1,6,13],[2,9,5]],ge=[[0,14.5,4],[30,14.5,4],[60,14.5,4],[88,29,1],[114,52,-9],[150,77,-22],[180,90,-29],[204,91.2,-33],[227,89.6,-28.5],[249,90.6,-32],[270,89.2,-29],[298,79,-38],[326,62,-35],[354,43,-14],[380,29,-9],[404,19,-15],[424,15,-19.5],[446,14.5,-20],[474,14.5,-20],[490,14.7,-20],[503,16.4,-20],[512,19.6,-20]],Ua=(e,t)=>{let n=999;for(let s=0;s<ge.length-1;s++){const o=ge[s],a=ge[s+1],i=a[0]-o[0],p=a[2]-o[2],c=De(((e-o[0])*i+(t-o[2])*p)/(i*i+p*p));Math.hypot(o[0]+i*c-e,o[2]+p*c-t)<20&&(n=Math.min(n,b0(o[1],a[1],c)))}return n},Qt=e=>(e%14+14)%14,$t=e=>(e%19+19)%19,Oo=(e,t)=>{let n=1e9;for(let s=0;s<ge.length;s++){const o=ge[s],a=s<ge.length-1?ge[s+1]:[775,0,-20],i=a[0]-o[0],p=a[2]-o[2],c=De(((e-o[0])*i+(t-o[2])*p)/(i*i+p*p));n=Math.min(n,Math.hypot(o[0]+i*c-e,o[2]+p*c-t))}return n},we=(e,t)=>t>=-4&&t<=2&&e>=-7&&e<=47,oe=new Uint8Array(c0),ae=new Int32Array(c0).fill(-1),Ue=new Uint8Array(c0),Ke=new Uint8Array(c0);for(let e=l0;e<l0+y0;e++)for(let t=a0;t<a0+m0;t++){t===a0&&(e&7)===0&&await M.yield();const n=Y(t,e),s=t*12;if(s>=Z0&&s<_0){oe[n]=2;continue}if(we(t,e))continue;const o=Math.floor(t/5),a=Math.floor(e/4),i=t-o*5,p=e-a*4;if(t0(o,a,j+30)<.4+.3*M.noise.n2(o*.37+11,a*.37)){const c=t0(o,a,j+31)<.5?2:3,h=Math.floor(t0(o,a,j+32)*(6-c)),g=Math.floor(t0(o,a,j+33)*3);i>=h&&i<h+c&&p>=g&&p<g+2&&(oe[n]=1)}t0(t,e,j+2)<.025&&(oe[n]=1)}const Uo=-6,Ko=5,Xe=(e,t)=>t===0&&e>=Uo&&e<=Ko?(e>Uo?1:0)+(e<Ko?2:0):t===-2&&e>=35&&e<=43?(e>35?1:0)+(e<43?2:0):t===-2&&(e===33||e===34)?e===34?1:2:0,Jt=(e,t)=>te(e,t)&&!oe[Y(e,t)]&&ae[Y(e,t)]<0;for(let e=l0;e<l0+y0;e++)for(let t=a0;t<a0+m0;t++){t===a0&&(e&7)===0&&await M.yield();const n=Y(t,e);if(oe[n]||ae[n]>=0)continue;const s=t0(t,e,j+12),o=we(t,e)||we(t+1,e)||we(t,e+1)||we(t+1,e+1);let a=1,i=1;if(!o){const p=Qt(t)!==6&&Jt(t+1,e),c=$t(e)!==9&&Jt(t,e+1),h=t*12>=_0;s<(h?.46:.04)&&p&&c&&Jt(t+1,e+1)?(a=2,i=2):s<(h?.66:.135)&&p?a=2:s<(h?.82:.21)&&c&&(i=2)}for(let p=0;p<i;p++)for(let c=0;c<a;c++)ae[Y(t+c,e+p)]=n;Ue[n]=a,Ke[n]=i}{const e=Y(-1,0);for(let t=0;t<3;t++)ae[Y(-1+t,0)]=e;Ue[e]=3,Ke[e]=1}const He=[0,0,0];let St=0;const eo=(e,t)=>(t.i=e%m0+a0,t.j=Math.floor(e/m0)+l0,t),xe={i:0,j:0},ut={i:0,j:0},be=(e,t,n)=>{const s=Y(e,t),o=ae[s];eo(o,xe);const a=e+(n===0?-1:n===1?1:0),i=t+(n===2?-1:n===3?1:0);if(te(a,i)&&ae[Y(a,i)]===o)return 0;const p=n===1?xe.i+Ue[o]-1:xe.i,c=n===3?xe.j+Ke[o]-1:xe.j,h=n===0?p-1:p,g=n===2?c-1:c,r=p+(n===0?-1:n===1?1:0),l=c+(n===2?-1:n===3?1:0),u=te(r,l)&&!oe[Y(r,l)],f=n<2?Qt(h)===6:$t(g)===9;return u&&!f&&t0(h,g,j+(n<2?20:21))<.4?.07:.5+2.7*t0(p,c,j+3+n)};for(let e=l0;e<l0+y0;e++)for(let t=a0;t<a0+m0;t++){t===a0&&await M.yield();const n=Y(t,e);if(ae[n]!==n)continue;const o=Ue[n],a=Ke[n];let i=Math.min(15.4,Math.max(8.6,9+6*t0(t,e,j+1)+1.6*M.noise.n2(t*.11+7,e*.11)));t*12>=_0&&(i=Math.min(19.6,10.5+8.5*t0(t,e,j+1)+1.6*M.noise.n2(t*.11+7,e*.11)));const p=t*12<Z0?6+(Z0-(t+o)*12)*.12:99;let c=!we(t,e);for(let l=0;l<a&&c;l++)for(let u=0;u<o;u++)Oo((t+u)*12+6,4+12*(e+l))<62&&(c=!1);c&&t0(t,e,j+14)<(o*a>1?.2:.1)&&(i=16+3*t0(t,e,j+15));let h=Math.floor(t0(t,e,j+7)*Ft.length);if(!we(t,e)&&t0(t,e,j+71)<.6){const l=M.noise.n2(t*.045+31.7,e*.045+17.3)+.5*M.noise.n2(t*.11+5.1,e*.11+40.2),u=Oa[l<-.35?0:l<-.05?1:l<.25?2:l<.55?3:4];u&&(h=u[Math.floor(t0(t,e,j+72)*3)])}let g=v(Ft[h],.68+.18*t0(t,e,j+8));for(let l=0;l<a;l++)for(let u=0;u<o;u++){const f=Ua((t+u)*12+6,4+12*(e+l));f<900&&(i=Math.min(i,Math.max(12.4-t0(t,e,j+9)*1.2,f-5.5)))}Math.abs(e)<=2&&t<=30&&(i=Math.min(i,12.3-1.4*t0(t,e,j+13)));const r=[be(t,e,0),be(t,e,1),be(t,e,2),be(t,e,3)];Xe(t,e)&&(i=12),t===44&&e>=-3&&e<=-1&&(i=10.5,r[2]=r[3]=.4,r[0]=3.4,r[1]=1.2,g=v(Z("#C68A55"),.9)),i=Yt(Math.min(i,p));for(let l=0;l<a;l++)for(let u=0;u<o;u++){const f=t+u,k=e+l,F=Y(f,k),A=o*a>1?[be(f,k,0),be(f,k,1),be(f,k,2),be(f,k,3)]:r,D=Xe(f,k);D&&(A[2]=Math.min(A[2],1.5),A[3]=Math.min(A[3],1.5),D&1&&(A[0]=0),D&2&&(A[1]=0));const B=Qt(f),x=$t(k);B===6&&(A[1]=Math.max(A[1],1.2)+2.7),B===7&&(A[0]=Math.max(A[0],1.2)+2.7),x===9&&(A[3]+=2),x===10&&(A[2]+=2),Q[F]=i,$.set(g,F*3);for(let d=0;d<4;d++)J[F*4+d]=At(A[d]);He[0]+=g[0],He[1]+=g[1],He[2]+=g[2],St++}}await M.yield();const qt=Q.slice(),to=new Uint8Array(c0),L0={x:480,z:168,r:36},G0={x0:408,x1:456,z0:-170,z1:-122},Me={x:556,z:-175,half:28},Ze=[[294,-248,2,"#F1E3C4"],[570,148,1.9,"#DE9A74"]],Ka=(e,t,n)=>{if(!te(e,t))return;const s=Y(e,t),o=ae[s];if(oe[s]===2)return;if(o<0){to[s]=n;return}eo(o,xe);const a=xe.i,i=xe.j,p=Ue[o],c=Ke[o];for(let h=0;h<c;h++)for(let g=0;g<p;g++)if(we(a+g,i+h)||Oo((a+g)*12+6,4+12*(i+h))<96)return;for(let h=0;h<c;h++)for(let g=0;g<p;g++){const r=Y(a+g,i+h);Q[r]=0,oe[r]=3,to[r]=n,ae[r]=-1}},Pt=(e,t,n,s,o=0,a=0)=>{for(let i=Math.floor((t-a-n+2)/12);i<=Math.floor((t+a+n+2)/12);i++)for(let p=Math.floor((e-o-n)/12);p<=Math.floor((e+o+n)/12);p++){const c=Math.max(p*12-e-o,e-o-p*12-12,0),h=Math.max(12*i-2-t-a,t-a-12*i-10,0);Math.hypot(c,h)<n&&Ka(p,i,s)}};Pt(L0.x,L0.z,L0.r+13.5,3),await M.yield(),Pt((G0.x0+G0.x1)/2,(G0.z0+G0.z1)/2,.5,2,(G0.x1-G0.x0)/2-1,(G0.z1-G0.z0)/2-1),Pt(Me.x,Me.z,.5,1,Me.half,Me.half);for(const e of Ze)Pt(e[0],e[1],10,1);const oo=[[L0.x,L0.z,L0.r+9],[Me.x,Me.z,27],[Ze[0][0],Ze[0][1],14.5],[Ze[1][0],Ze[1][1],14.5]],Xo=(e,t,n=0)=>oo.some(s=>Math.abs(e-s[0])<s[2]+n&&Math.abs(t-s[1])<s[2]+n);await M.yield();const ke=new Uint8Array(c0*4),Ho=new Uint8Array(c0*4);for(let e=0;e<c0;e++){(e&4095)===4095&&await M.yield(),Q[e]<=0&&($[e*3]=to[e]*60/255,$[e*3+1]=$[e*3+2]=0),ke[e*4]=Math.round(De($[e*3])*255),ke[e*4+1]=Math.round(De($[e*3+1])*255),ke[e*4+2]=Math.round(De($[e*3+2])*255),ke[e*4+3]=Math.round(Q[e]/20*255);for(let t=0;t<4;t++)Ho[e*4+t]=Math.round(J[e*4+t]/6*255)}await M.yield();for(let e=0;e<c0;e++)$[e*3]=ke[e*4]/255,$[e*3+1]=ke[e*4+1]/255,$[e*3+2]=ke[e*4+2]/255;const Zo=e=>{const t=new z.DataTexture(e,m0,y0,z.RGBAFormat,z.UnsignedByteType);return t.magFilter=t.minFilter=z.NearestFilter,t.generateMipmaps=!1,t.needsUpdate=!0,t};await M.yield();const Yo=Zo(ke),Qo=Zo(Ho),Ye=(e,t,n)=>(n.i=Math.floor(e/12),n.j=Math.floor((t+2)/12),n),d0={i:0,j:0},ao=(e,t)=>{if(Ye(e,t,d0),!te(d0.i,d0.j))return 12;const n=qt[Y(d0.i,d0.j)];return n>0?n:V},Y0=(e,t,n)=>{const s=Y(e,t)*4;return n[0]=e*12+J[s],n[1]=e*12+12-J[s+1],n[2]=12*t-2+J[s+2],n[3]=12*t+10-J[s+3],n};await M.yield();const no=new z.Color(E.hemiSky),Xa=new z.Color(E.hemiGnd),Q0={uSunDir:{value:o0.clone()},uSun:{value:new z.Color(E.sun).multiplyScalar(E.sunI/Math.PI)},uSky:{value:no.clone().multiplyScalar(E.hemiI/Math.PI)},uGnd:{value:Xa.clone().multiplyScalar(E.hemiI/Math.PI)},uShade:{value:no.clone().lerp(new z.Color("#55548A"),.3).multiplyScalar(E.hemiI/Math.PI*1.05)},uTime:{value:0},uNight:{value:U},uTanE:{value:C0},uTap:{value:Math.min(2.2,Math.sqrt(.404/C0))},tA:{value:Yo},tB:{value:Qo},uGrid:{value:new z.Vector4(12*a0,12*l0-2,1/m0,1/y0)},uCamP:{value:new z.Vector3},uPx:{value:.001},uSurge:{value:0}},Qe=(e,t,n={},s={})=>new z.ShaderMaterial({uniforms:{...z.UniformsUtils.clone(z.UniformsLib.fog),...Q0,...n},vertexShader:e,fragmentShader:t,fog:!0,...s}),Be={i:0,j:0},dt=[0,0,0,0],$o=(e,t)=>(Ye(e,t,Be),!te(Be.i,Be.j)||qt[Y(Be.i,Be.j)]<=0?[e,t]:(Y0(Be.i,Be.j,dt),[Math.min(dt[1]-.8,Math.max(dt[0]+.8,e)),Math.min(dt[3]-.8,Math.max(dt[2]+.8,t))])),ht=[];{const e=E.elevation?.62:.9,t={all:[["#17B3B9","#F6E9D2"],["#F59A12","#F6E9D2"]],"magenta-saffron":[["#8FD033","#F6E9D2"],["#17B3B9","#F6E9D2"]],"turquoise-white":[["#EC2F9E","#FFD070"],["#F59A12","#F6E9D2"]]}[w0],n=(o,a)=>{const i=$o(o,a);return[i[0],ao(i[0],i[1])+1.3,i[1]]},s=(o,a,i,p,c,h,g)=>ht.push({a:n(o[0]-(o[1]-13.3)/Math.tan(a),o[2]+i),k:o,size:p,c1:c[0],c2:c[1],pat:h,...g||{}});s([83.6,23,-9],e,-1,2.6,t[0],5,{phase:.4}),s([86,24,15],e,1,2.6,t[0],5,{phase:2.6}),s([109.5,29.8,-12],e+.1,0,2.4,t[0],5,{phase:4.4});{const o=[168,67,-33],a=n(o[0]-(o[1]-13.3)/Math.tan(E.elevation?.62:.78),o[2]);for(let i=0;i<7;i++){const p=(o[1]-i*6.4-a[1])/(o[1]-a[1]);ht.push({a,k:[b0(a[0],o[0],p),b0(a[1],o[1],p),b0(a[2],o[2],p)],size:3.6,c1:t[1][0],c2:t[1][1],pat:6,phase:1.1,speed:.8,ampAz:.012,ampEl:.004})}}s([345,73,-44.5],e,-40,3.3,["#8FD033","#F6E9D2"],2,{phase:0,speed:1.3,ampAz:.04,ampEl:.01,maxEnv:2.6}),s([349.8,67.5,-48.4],e+.06,-5,3.3,["#2B2E7A","#F59A12"],4,{phase:3.14,speed:1.3,ampAz:.04,ampEl:.01,maxEnv:2.6});for(const[o,a,i,p,c]of[[408,-6,.6,30,["#EC2F9E","#FFD070"]],[402,-31,-.6,28,["#F59A12","#F6E9D2"]]]){const h=n(o,a),g=e+.15,r=Math.cos(g);ht.push({a:h,k:[h[0]+p*r*Math.cos(i),h[1]+p*Math.sin(g),h[2]+p*r*Math.sin(i)],size:2.2,c1:c[0],c2:c[1],pat:1})}}let Jo=null;const ne=await wn(M,{palette:Va,stage:!1,scheme:w0,greatCut:i0,minCount:300,elevation:E.elevation,meanY:E.meanY,lamp:U,count:Math.min(4300,Math.round(Math.max(E.kites,i0?1500:0)*.8*Math.min(1.2,b0(.73,1.35,De((T0-.7)/.6))))),anchorFix:(e,t)=>{const n=$o(350-t,e);return[n[1],350-n[0]]},fixed:ht,bigLineOpacity:U?.38:.55,roofY:(e,t)=>ao(350-t,e),pathSpace:"world",pathFn:({flyThrough:e,toWorld:t})=>Jo=ge.map(n=>new z.Vector3(n[0],n[1],n[2])).concat(e.slice(0,-1).map(t)),sunDir:[o0.z,o0.y,-o0.x],sunColor:E.sun,sunIntensity:E.sunI,skyColor:E.hemiSky,groundColor:E.hemiGnd,hemiIntensity:E.hemiI,lineOpacity:U?.16:.2,ringY:60,ringTilt:20,pathEscorts:96,ringHalo:110,finaleScale:1.3,farKites:80,beyondKites:220,beyond:{reach:1215,halfX:680,noAnchor:(e,t)=>350-t>Z0-3&&350-t<_0+3},clearLanes:[{a:[205,88,-29],b:[760,57,-20],r0:10,r1:46},{a:[330,55,-30],b:[545,26,-20],r0:12,r1:30}]});ne.object.position.set(350,0,0),ne.object.rotation.y=-Math.PI/2,I.add(ne.object);const ea=ne.object.getObjectByName("kite-lines"),pt=ea?ea.material.uniforms:{uLineW:{value:0},uAFloor:{value:0},uBigA:{value:0}};pt.uLineW.value=.02;const Ha=pt.uAFloor.value,Za=pt.uBigA.value,I0=ne.anchors,so=I0.toWorld,K0=so(I0.portalSeat.position),$e=so(I0.trainAnchor);await M.yield();const z0=mn(Jo,{samples:480});await M.yield();const Dt=46,Te=(e,t)=>z0.nearestXZ(e,t).u,Ee=Te(60,4),vt=Te(180,-29),e0=Te(270,-29),Ge=Te(424,-19.5),ta=Te(470,-20),Je=Te(530,-20),Bt=Je+.03,oa=Te(400,-14);await M.yield();const Ya=e=>e<e0?e/e0*.328:e<Bt?.328+(e-e0)/(Bt-e0)*.412:.74+(e-Bt)/(1-Bt)*.26,mt=yn({rng:X.fork("sky"),preset:"day",clouds:!1,clouds2:!1,sunElevation:E.el,sunAzimuth:10,...E.sky,...S0?{clouds2:{coverage:.42,stretch:1,opacity:.5,scale:.85,haze:1,wind:[.03,.008]}}:{},lightColor:E.sun,lightIntensity:E.sunI,ambientColor:E.hemiSky,groundLight:E.hemiGnd,ambientIntensity:E.hemiI,lightElevationMin:6,fogColor:E.fog});I.add(mt.object),await M.yield(),I.fog=new z.FogExp2(E.fog,E.density);const aa=gn(mt,{bounce:.2,follow:!1});I.add(aa.object),await M.yield();const X0=-13,se=71,ie=-42,re=41,na=Z0/12-1,io=_0/12,ro=io+15,lo=[],sa=[],ia=[],g0=[0,0,0,0],Tt=[0,0,0,0];for(let e=l0;e<l0+y0;e++)for(let t=X0;t<=ro;t++){if(t===X0&&(e&3)===0&&await M.yield(),t>na?t<io:e<ie||e>re)continue;const n=Y(t,e),s=Q[n];if(s<=0||ae[n]!==n)continue;const o=Ue[n],a=Ke[n];Y0(t,e,g0),Y0(t+o-1,e+a-1,Tt);const i=g0[0],p=Tt[1],c=g0[2],h=Tt[3];let g=0,r=1e9;if(t<=se)for(let l=0;l<a;l++)for(let u=0;u<o;u++){const f=z0.nearestXZ((t+u)*12+6,4+12*(e+l));g=Math.max(g,f.dist<((t+u)*12>545?22:47)&&f.y-s<24?2:f.dist<84?1:0),r=Math.min(r,f.dist)}Xe(t,e)&&(g=2);for(let l=0;l<a;l++)for(let u=0;u<o;u++)E0[Y(t+u,e+l)]=g;lo.push((i+p)/2,s,(c+h)/2,t0(t,e,j+11)),sa.push(p-i,h-c,g?1:0,(Xe(t,e)&1)+(Xe(t+o-1,e)&2)+(e===0&&t===-1?4:0)),ia.push($[n*3],$[n*3+1],$[n*3+2])}await M.yield();{const e=[],t=[],n=(p,c,h,g,r)=>{for(const l of[p,c,h,p,h,g])e.push(l[0],l[1],l[2]),t.push(r[0],r[1],r[2])};n([-.5,1,-.5],[-.5,1,.5],[.5,1,.5],[.5,1,-.5],[0,1,0]),n([-.5,0,.5],[.5,0,.5],[.5,1,.5],[-.5,1,.5],[0,0,1]),n([.5,0,-.5],[-.5,0,-.5],[-.5,1,-.5],[.5,1,-.5],[0,0,-1]),n([.5,0,.5],[.5,0,-.5],[.5,1,-.5],[.5,1,.5],[1,0,0]),n([-.5,0,-.5],[-.5,0,.5],[-.5,1,.5],[-.5,1,-.5],[-1,0,0]);const s=new z.InstancedBufferGeometry;s.instanceCount=lo.length/4,s.setAttribute("position",new z.Float32BufferAttribute(e,3)),s.setAttribute("normal",new z.Float32BufferAttribute(t,3)),s.setAttribute("iB",new z.InstancedBufferAttribute(new Float32Array(lo),4)),s.setAttribute("iD",new z.InstancedBufferAttribute(new Float32Array(sa),4)),s.setAttribute("iCol",new z.InstancedBufferAttribute(new Float32Array(ia),3));const o=new z.Mesh(s,Qe(kn,Cn));o.frustumCulled=!1,o.name="houses",I.add(o);const a=new z.PlaneGeometry(9e3,9e3);a.rotateX(-Math.PI/2);const i=new z.Mesh(a,Qe(zn,An,{uRiver:{value:new z.Color(E.sky.horizon).lerp(new z.Color(E.sky.mid),.7).lerp(new z.Color(E.sky.zenith),U?0:.22).multiplyScalar(U?.5:.74)},uTank:{value:new z.Vector4(L0.x,L0.z,L0.r,0)},uBoxed:{value:new z.Vector4(X0*12,ro*12+12,504,864)},uSand:{value:new z.Color("#cbb28c")},uHorz:{value:new z.Color(E.sky.horizon).lerp(new z.Color(E.sky.mid),.3).multiplyScalar(.55)},uAvg:{value:new z.Color(He[0]/St,He[1]/St,He[2]/St).multiplyScalar(.62)}}));i.position.set(400,V,0),i.frustumCulled=!1,i.name="ground",I.add(i)}await M.yield();const co=8,ce=e=>Math.min(co-1,Math.max(0,Math.floor((e+170)/130))),$0=[],et=[];for(let e=0;e<co;e++)$0.push(ft()),et.push(ft());const fe={pos:[],vel:[],par:[],col:[]},tt=(e,t,n,s,o,a,i,p,c,h,g)=>{fe.pos.push(e,t,n),fe.vel.push(s,o,a),fe.par.push(i,p,c,h),fe.col.push(g[0],g[1],g[2])},W=X.fork("props"),_=(e,t)=>W.range(e,t),N0=e=>W.pick(e),Ie=Math.PI*2;let fo=12;const Ce=(e,t,n,s)=>{const o=n-fo<1.15?1.4:3;if(e<0&&e>-90&&Math.abs(t-4)-s<3)return n<14.5-o;const a=z0.nearestXZ(e,t);return a.dist-s>2.3||n<a.y-o},ze=-q0.x,Ae=-q0.y,yt=(e,t,n,s,o,a,i)=>{let p=o/C0;if(ze>1e-4?p=Math.min(p,(i[1]-.3-t)/ze):ze<-1e-4&&(p=Math.min(p,(i[0]+.3-t)/ze)),Ae>1e-4?p=Math.min(p,(i[3]-.3-n)/Ae):Ae<-1e-4&&(p=Math.min(p,(i[2]+.3-n)/Ae)),p<.3)return;const c=-Ae*s,h=ze*s,g=a+.05;e.quad([t-c,g,n-h],[t+c,g,n+h],[t+c+ze*p,g,n+h+Ae*p],[t-c+ze*p,g,n-h+Ae*p],zt)},ra=["#CDE6A5","#F4B8C6","#A9D4EF","#f2efe8","#F6E9D2","#8fd0c8"].map(e=>v(Z(e),.8)),P0=["#E3207F","#F59A12","#17B3B9","#f4f0e6","#D8281C","#8FD033","#f4f0e6","#F4B8C6","#6a3fa0","#ffd23a","#2b6fd0"].map(e=>v(Z(e),.85)),ot=Z("#6b4424"),V0=Z("#b08a4a"),uo=[.5,.52,.56],at=Z("#8a4630"),ho=[.8,.52,.14],Et=Z("#3f7a2a"),po=Z("#ff9a12"),Qa=Z("#7f899b"),la=["#2f7f9a","#3f8a4a","#9a3a2a"],Gt=ft(),W0=(e,t,n,s,o,a,i,p,c,h)=>t?e.quad([n,i,s+o],[n,i,s+a],[n,p,s+a],[n,p,s+o],c,h):e.quad([n+o,i,s],[n+a,i,s],[n+a,p,s],[n+o,p,s],c,h),H0=[],ca=new z.Vector3,ue=(e,t,n,s)=>{for(let o=0;o<7;o++){const a=s&&o<3,i=a?W.chance(.5)?e[0]+.45+t:e[1]-.45-t:_(e[0]+.45+t,e[1]-.45-t),p=a?W.chance(.65)?e[2]+.45+t:e[3]-.45-t:_(e[2]+.45+t,e[3]-.45-t);if(!Ce(i,p,n,t))continue;let c=!0;for(const h of H0)if(Math.hypot(h[0]-i,h[1]-p)<h[2]+t){c=!1;break}if(c)return H0.push([i,p,t]),[i,p]}return null},f0=M.core.makeRng(M.core.hashSeed("flyers:"+j)),$a=[[.36,.22,.14],[.3,.18,.12],[.42,.27,.17]],fa=["#E3207F","#F59A12","#17B3B9","#D8281C","#2b6fd0","#6a3fa0","#8FD033","#ffd23a","#F4B8C6","#f4f0e6"].map(e=>v(Z(e),.85)),Ja=[Z("#ff3fa0"),Z("#ffd21a")],ua=[[.78,.76,.7],[.16,.18,.28],[.5,.42,.3]],nt=["#E3207F","#F59A12","#17B3B9","#D8281C","#2b6fd0","#6a3fa0","#8FD033"].map(e=>v(Z(e),.85));let vo=0,da=0;const ha=(e,t,n,s,o,a,i,p,c=f0)=>{const h=Math.hypot(o,a)||1,g=o/h,r=a/h,l=Math.atan2(g,r),u=c.range(0,6.28),f=(y,b,C)=>[t+y*r+C*g,n+b,s-y*g+C*r],k=v(c.pick(fa),c.range(.85,1.05)),F=c.pick($a),A=k[0]+k[1]+k[2]>2.1?ua[1]:c.pick(ua),D=c.range(.94,1.08),B=[i?.035:.012,u,-2],x=[i===1?.12:.04,u,-2],d=p?.16:.82*D;if(p)for(const y of[-.11,.11]){const b=f(y,.02,.36);e.box(b[0],b[1],b[2],.15,.15,.62,A,l,null,B)}else for(const y of[-.1,.1]){const b=f(y,0,0);e.box(b[0],b[1],b[2],.15,d,.17,A,l,null,B)}e.box(t,n+d-.04,s,.42,.62*D,.23,k,l,v(k,.8),B);const m=d+.52*D;if(e.cyl(t,n+d+.59*D,s,.1,.115,.22,5,F,c.chance(.25)?v(c.pick(fa),.9):[.07,.06,.06],B),z0.nearestXZ(t,s).dist<11.5){const y=t0(Math.round(t*9),Math.round(s*9),j+90),b=nt[Math.floor(y*nt.length)],C=nt[Math.floor(y*53)%nt.length],S=n+d-.04,q=.62*D;e.box(t,S,s,.45,.085,.26,b,l,null,B),e.cyl(t,S+q-.01,s,.205,.115,.075,6,[v(k,1.06),v(k,.82)],null,B);for(const P of[.119,-.119])e.quad(f(-.215,S+q-.02,P),f(-.215,S+q-.15,P),f(.215,S+.12,P),f(.215,S+.25,P),C,B)}i===1?(e.pole(f(-.24,m,0),f(-.17,m+.1,.34),.045,F,x),e.pole(f(.24,m,0),f(.17,m+.1,.34),.045,F,x),e.pole(f(-.2,m+.1,.34),f(.2,m+.1,.34),.085,c.pick(Ja),x)):i===2?(e.pole(f(.24,m,0),f(.34,m+.44,.2),.045,F,x),e.pole(f(-.24,m,0),f(-.28,m-.45,.05),.045,F,B)):(e.pole(f(-.24,m,0),f(-.27,m-.42,.1),.045,F,B),e.pole(f(.24,m,0),f(.27,m-.42,.1),.045,F,B)),vo++},pa=M.core.makeRng(M.core.hashSeed("sitters:"+j)),It=new Map,va=new Set;{const e=I0.kiteAnchors,t=I0.kiteLines,n=Math.min(I0.counts.great,e.length/3);for(let s=0;s<n;s++){if(t[s*4+3]<1.75)continue;const o=350-e[s*3+2],a=e[s*3];if(Ye(o,a,d0),d0.i<X0||d0.i>se||d0.j<ie||d0.j>re)continue;const i=Y(d0.i,d0.j),p=Q[i];if(p<=0)continue;const c=z0.nearestXZ(o,a);if(Math.hypot(c.dist,c.y-p)>(s<ht.length?80:46))continue;let h=It.get(i);h||It.set(i,h=[]);const g=h.find(r=>Math.hypot(r[0]-o,r[1]-a)<.5);va.add(s),g?g[4]++:h.length<3&&h.push([o,a,Math.cos(t[s*4]),Math.sin(t[s*4]),1])}}const ma=(e,t,n,s)=>{if(!Ce(e,t,n+1.95,s))return!1;for(const o of H0)if(Math.hypot(o[0]-e,o[1]-t)<o[2]+s)return!1;return!0},mo=(e,t,n,s,o,a,i,p,c)=>{const h=It.get(Y(e,t)),g=(a[0]+a[1])/2,r=(f,k,F,A,D,B)=>(f=Math.min(a[1]-.55,Math.max(a[0]+.55,f)),k=Math.min(a[3]-.55,Math.max(a[2]+.55,k)),ma(f,k,o,.3)?(H0.push([f,k,.3]),ha(n,f,o,k,F,A,D,B),B||yt(s,f,k,.2,1.7,o,a),!0):!1);if(h)for(const f of h){for(let k=0,F=!1;k<5&&!F;k++)F=r(f[0]-f[2]*.34+(k?f0.range(-1.2,1.2):0),f[1]-f[3]*.34+(k?f0.range(-1.2,1.2):0),f[2],f[3],1,!1);for(let k=0,F=Math.min(4,f[4]-1)+(f0.chance(.6)?1:0);k<F;k++){const A=f0.range(0,6.28),D=f0.range(.7,1.6);r(f[0]+Math.cos(A)*D,f[1]+Math.sin(A)*D,f[2]+f0.range(-.4,.4),f[3]+f0.range(-.4,.4),f0.pick([1,2,2,0]),!1)}}if(c<2)return;const l=i>0||g>366&&g<432&&p<22,u=l?f0.int(2,3)+(g>392&&g<424?1:0):f0.chance(p<30?.3:.12)?1:0;for(let f=0;f<u;f++)for(let k=0;k<6;k++){const F=f0.chance(.5)?1:-1,A=l?(F>0?a[3]-1.55:a[2]+1.55)+f0.range(-.15,.15):f0.range(a[2]+.8,a[3]-.8),D=f0.range(a[0]+.7,a[1]-.7),B=l&&f0.chance(.16);if(!(t===0&&i&&D>-5&&D<24)&&r(D,A,1+f0.range(-.3,.3),f0.range(-.5,.5)-(l?F*.3:0),B?0:f0.pick([1,1,1,2,0]),B))break}if(t===0&&e===2)for(const[f,k,F,A]of[[a[2]+1.6,.25,1,.6],[a[3]-1.6,-.25,1,2.6],[a[2]+1.5,.4,2,5.5]])for(let D=a[0]+A;D<a[1]-.6&&!r(D,f,1,k,F,!1);D+=.9);},en=(e,t,n)=>{const s=Y(e,t),o=Q[s],a=Y0(e,t,g0),i=$0[ce((a[0]+a[1])/2)],p=et[ce((a[0]+a[1])/2)],c=[$[s*3],$[s*3+1],$[s*3+2]],h=(a[0]+a[1])/2,g=(a[2]+a[3])/2;H0.length=0,fo=o,e===43&&t===-2&&H0.push([$e.x,$e.z,2.6]);const r=z0.nearestXZ(h,g),l=r.dist,u=Xe(e,t),f=n===2&&(l<4||u>0),k=l<31||u>0,F={},A=x=>t===0&&x[0]>16.5&&x[0]<24.8&&Math.abs(x[1]-4)<4.6;if(f){const x=u?t===0?4:-20:z0.pointAt(r.u,ca).z,d=W.chance(.5)?1:-1,m=a[1]-a[0],w=W.shuffle([.16,.39,.62,.85]).map(b=>a[0]+m*b+_(-.5,.5)),y=(b,C,S,q)=>{Math.abs(S-g)<(a[3]-a[2])/2-.5-q&&!(e===43&&t===-2&&Math.hypot(C-$e.x,S-$e.z)<2.6+q)&&(F[b]=[C,S],F[b].skip=t===0&&b!=="cloth"&&C>16.5&&C<24.8,H0.push([C,S,q]))};y("cloth",w[0],x+_(-.5,.5),1.3),W.chance(.85)&&y("charpoy",w[1],x+d*_(.5,1.5),1.25),W.chance(.85)&&y("reel",w[2],x-d*_(.2,1.2),.75),W.chance(.7)&&y("pot",w[3],x+_(-1.4,1.4),.5)}let D=null;{const x=ue(a,1.25,o+2.6,!0);let d=i;if(x&&u&&(t0(e,t,j+61)<.15?(H0.pop(),d=Gt):(x[1]=x[1]<(t===0?4:-20)?a[2]+1.45:a[3]-1.45,H0[H0.length-1][1]=x[1])),x){const[m,w]=x,y=W.chance(.3)?v(c,1.1):N0(ra);if(d===i&&(D=x),d.box(m,o,w,2.3,2.3,2.3,y),n===2){d.box(m,o,w,2.38,.34,2.38,v(y,.6),0,null,!0),d.box(m,o+2.2,w,2.54,.1,2.54,v(y,1.15),0,null,!0);const R=m<h?1:-1,L=m+R*1.16,K=R*.012,A0=v(y,1.25),R0=W.chance(.5)?[.16,.2,.26]:Z(N0(la));W0(d,1,L,w,-.44,.44,o+1,o+1.84,A0),W0(d,1,L+K,w,-.36,.36,o+1.08,o+1.76,R0),W0(d,1,L+K*2,w,-.025,.025,o+1.08,o+1.76,A0),W0(d,1,L+K*2,w,-.36,.36,o+1.395,o+1.445,A0),d.box(L+R*.05,o+.93,w,.12,.07,1.04,v(y,1.3),0,null,!0)}const b=v(uo,_(.8,1.5)),C=1.3,S=o+2.32,q=o+2.32+_(.15,.4);d.quad([m-C,S,w-C],[m+C,S,w-C],[m+C,q,w+C],[m-C,q,w+C],b,Wo);const P=w<g?1.16:-1.16,G=W.chance(.5)?v(ot,1.3):Z(N0(la)),T=w+P,N=P>0?.012:-.012;if(n===2&&!k)W0(d,0,m,T,-.58,.58,o,o+1.98,v(y,1.25)),W0(d,0,m,T+N,-.47,.47,o+.02,o+1.88,G);else if(n===2){W0(d,0,m,T,-.58,.58,o,o+1.98,v(y,1.25)),W0(d,0,m,T+N,-.47,.47,o+.02,o+1.88,[.13,.1,.08]);for(const R of[-1,1]){const L=R<0?-.47:.025,K=R<0?-.025:.47,A0=v(G,.75);W0(d,0,m,T+N*2,L,K,o+.04,o+1.86,G),W0(d,0,m,T+N*3,L+.07,K-.07,o+.16,o+.86,A0),W0(d,0,m,T+N*3,L+.07,K-.07,o+.98,o+1.74,A0),W0(d,0,m,T+N*4,R*.07-.03,R*.07+.03,o+.9,o+.97,v(ho,1.3))}}else W0(d,0,m,T,-.45,.45,o,o+1.85,G);d.quad([m-.6,o+1.9,w+P*1.05],[m+.6,o+1.9,w+P*1.05],[m+.6,o+2.08,w+P*1.05],[m-.6,o+2.08,w+P*1.05],po,[.02,m,0]),d===i&&yt(p,m,w,1.25,2.35,o,a)}}{const x=ue(a,.75,o+1.9,n===2);if(x){const[d,m]=x,w=W.chance(.4),y=w?[.72,.72,.7]:[.09,.09,.11],b=w?[1.25,1.25,1.2]:[.3,.33,.4],C=v(at,_(.8,1.1));if(n===2&&u>0){for(const[P,G]of[[-.36,-.36],[.36,-.36],[.36,.36],[-.36,.36]])i.box(d+P,o,m+G,.26,.62,.26,v(C,P*G>0?1:.86));i.box(d,o+.62,m,1.14,.08,1.14,[.62,.58,.52],0,[.7,.66,.6],!0);const q=w?[.4,.42,.47]:[.26,.27,.31];i.cyl(d,o+.92,m,.6,.6,.06,8,q),i.cyl(d,o+1.38,m,.595,.595,.06,8,q),i.cyl(d,o+1.6,m,.655,.655,.06,8,w?[.5,.5,.52]:[.05,.05,.06])}else i.box(d,o,m,1,.7,1,C);if(n===2){i.cyl(d,o+.7,m,.58,.56,1,12,[y,w?v(y,.86):[.15,.15,.18]]),i.cyl(d,o+1.7,m,.6,0,.2,12,[b,v(b,.8)]),i.cyl(d,o+1.66,m,.63,.63,.06,12,v(b,1.3));const q=d<h?.62:-.62;i.pole([d+q,o+1.5,m],[d+q,o,m],.035,[.45,.46,.5])}else i.cyl(d,o+.7,m,.58,.55,1.05,6,y,b);yt(p,d,m,.55,1.75,o,a)}}for(let x=0;x<(n===2?2:1);x++)if(x===0&&F.cloth||W.chance(n===2?.6:.42)){const d=x===0?F.cloth:null,m=d?1.15:_(.55,1.5),w=d||ue(a,1.2*Math.min(m,1.1),o+.1,!1);if(w){const[y,b]=w,C=_(.8,1.2)*m,S=_(.6,.9)*m,q=W(),P=q<(d?.75:.45)?[.6,.035,.02]:q<.8?[.88,.52,.03]:q<.9?[.3,.42,.1]:[.42,.2,.08];i.quad([y-C-.15,o+.03,b-S-.15],[y+C+.15,o+.03,b-S-.15],[y+C+.15,o+.03,b+S+.15],[y-C-.15,o+.03,b+S+.15],[.78,.75,.68]),i.quad([y-C,o+.06,b-S],[y+C,o+.06,b-S],[y+C,o+.06,b+S],[y-C,o+.06,b+S],v(P,_(.8,1.15)))}}if(n<2){if(h>270&&h<424&&l<47){const d=v(c,1.02),m=v(c,1.16),w=a[1]-a[0],y=J[s*4]===0,b=J[s*4+1]===0,C=J[s*4+2]===0,S=J[s*4+3]===0,q=a[2]+(C?0:.26),P=a[3]-(S?0:.26);C||i.box(h,o,a[2]+.26/2,w,1,.26,d,0,m),S||i.box(h,o,a[3]-.26/2,w,1,.26,d,0,m),y||i.box(a[0]+.26/2,o,(q+P)/2,.26,1,P-q,d,0,m),b||i.box(a[1]-.26/2,o,(q+P)/2,.26,1,P-q,d,0,m);const G=Math.min(f0.range(3,4.6),w-1.6),T=f0.chance(.5)?1:-1,N=f0.range(a[0]+.7+G/2,a[1]-.7-G/2),R=g+T*((a[3]-a[2])/2-.75),L=o+1.9;if(G>1.5&&ma(N,R,o,.3)){i.pole([N-G/2,o,R],[N-G/2,L+.1,R],.04,V0),i.pole([N+G/2,o,R],[N+G/2,L+.1,R],.04,V0);for(let K=.2;K<G-.7;){const A0=f0.range(.7,1.3),R0=f0.range(.9,1.7),h0=f0.pick(P0),u0=f0.range(0,6.28),J0=N-G/2+K;i.quad([J0,L,R],[J0+A0,L,R],[J0+A0,L-R0,R],[J0,L-R0,R],h0,[0,u0,.55],[f0.range(.1,.2),u0+1.2,.55],v(h0,.8)),K+=A0+f0.range(.05,.3)}}}mo(e,t,i,p,o,a,u,l,n);return}{const d=v(c,1.02),m=v(c,1.16),w=a[1]-a[0],y=J[s*4]===0,b=J[s*4+1]===0,C=J[s*4+2]===0,S=J[s*4+3]===0,q=a[2]+(C?0:.26),P=a[3]-(S?0:.26);C||i.box(h,o,a[2]+.26/2,w,1,.26,d,0,m),S||i.box(h,o,a[3]-.26/2,w,1,.26,d,0,m),y||i.box(a[0]+.26/2,o,(q+P)/2,.26,1,P-q,d,0,m),b||i.box(a[1]-.26/2,o,(q+P)/2,.26,1,P-q,d,0,m);for(const T of[0,1])if(u&T+1){const N=Y0(e+(T?1:-1),t,Tt),R=T?a[1]-.26/2:a[0]+.26/2;if(N[2]-a[2]>.3&&i.box(R,o,(a[2]+N[2])/2+.26,.26,1,N[2]-a[2],d,0,m),a[3]-N[3]>.3&&i.box(R,o,(a[3]+N[3])/2-.26,.26,1,a[3]-N[3],d,0,m),!T)continue;const L=Math.max(a[2],N[2])+.26,K=Math.min(a[3],N[3])-.26,A0=v(c,.9),R0=v(Z("#f2ead8"),.92);if(t===0){i.box(a[1],o,(L+K)/2,.3,.1,K-L,R0,0,null,!0);continue}i.box(a[1],o,(L+K)/2,.26,.32,K-L,A0,0,null,!0),i.box(a[1],o+.32,(L+K)/2,.36,.08,K-L,R0,0,null,!0);for(let h0=L+_(.3,.9);h0<K-.3;h0+=_(.7,1.7)){const u0=v(Et,_(.8,1.25)),J0=_(.26,.4),me=W.chance(.6)?po:v(u0,1.4);Math.abs(h0+20)<2.3||(i.cyl(a[1],o+.4,h0,.1,.14,.18,4,[v(at,1.2),v(at,.9)]),i.cyl(a[1],o+.56,h0,.06,.2,J0*.4,6,[v(u0,1.25),u0,v(u0,1.4),v(u0,1.1),v(u0,.9),v(u0,1.15)],null,[.02,h0*3,.3]),i.cyl(a[1],o+.56+J0*.4,h0,.2,.11,J0*.5,6,[v(u0,1.25),u0,v(u0,1.4)],me,[.02,h0*3,.3],me))}}const G=v(N0(ra),.9);for(const[T,N]of[[a[2]+.26+.01,1],[a[3]-.26-.01,-1]])if(!(N>0?C:S)){if(u){const R=nt[Math.floor(t0(e,t,j+66+(N>0?0:1))*nt.length)],L=T+N*.004;i.quad([a[0],o+.42,T],[a[1],o+.42,T],[a[1],o+.84,T],[a[0],o+.84,T],R),i.quad([a[0],o+.3,T],[a[1],o+.3,T],[a[1],o+.36,T],[a[0],o+.36,T],v(R,.5));for(let K=a[0]+.6;K<a[1]-.3;K+=1.2)i.quad([K-.2,o+.63,L],[K,o+.47,L],[K+.2,o+.63,L],[K,o+.79,L],[.9,.85,.7]);continue}if(i.quad([a[0]+.26,o+.5,T],[a[1]-.26,o+.5,T],[a[1]-.26,o+.72,T],[a[0]+.26,o+.72,T],G),k)for(let R=a[0]+.9;R<a[1]-.9;R+=1.1)i.quad([R-.16,o+.2,T+N*.004],[R,o+.04,T+N*.004],[R+.16,o+.2,T+N*.004],[R,o+.36,T+N*.004],v(c,.42))}for(const T of[a[1]-.26-.012,a[0]+.26+.012]){if(T>h?b:y)continue;const N=T+(T>h?-.004:.004);if(i.quad([T,o+.5,a[2]+.26],[T,o+.5,a[3]-.26],[T,o+.72,a[3]-.26],[T,o+.72,a[2]+.26],G),k)for(let R=a[2]+.9;R<a[3]-.9;R+=1.1)i.quad([N,o+.2,R-.16],[N,o+.04,R],[N,o+.2,R+.16],[N,o+.36,R],v(c,.42))}}for(let x=0,d=W.chance(.5)?1:-1;x<(f?2:1);x++,d=-d)if(f||W.chance(.85)){const m=f||W.chance(.7),w=d,y=_(3.2,5.2),b=m?_(a[0]+.6+y/2,a[1]-.6-y/2):h+w*((a[1]-a[0])/2-.7),C=m?g+w*((a[3]-a[2])/2-.7):_(a[2]+.6+y/2,a[3]-.6-y/2),S=m?1:0,q=m?0:1,P=o+2;if(Ce(b,C,P,y*.5*(m?.3:1))){const G=[b-S*y/2,o,C-q*y/2],T=[b+S*y/2,o,C+q*y/2];i.pole(G,[G[0],P+.1,G[2]],.035,V0),i.pole(T,[T[0],P+.1,T[2]],.035,V0),i.pole([G[0],P,G[2]],[T[0],P,T[2]],.025,[.7,.7,.66]);for(let N=.25;N<y-.6;){const R=_(.6,1.25),L=W.chance(.4)?_(1.5,1.85):_(.8,1.2),K=N0(P0),A0=_(0,6.28),R0=.55,h0=[G[0]+S*N,P,G[2]+q*N],u0=[G[0]+S*(N+R),P,G[2]+q*(N+R)],J0=_(.1,.22),me=P-L+.13,vn=W.chance(.55)?[.86,.6,.12]:v(N0(P0),1.1),Ht=[J0,A0+1.2,R0];if(L>1.4){const Zt=P-L*.5,Ia=[J0*.75,A0+.55,R0],Na=v(K,.92);i.quad(h0,u0,[u0[0],Zt,u0[2]],[h0[0],Zt,h0[2]],K,[0,A0,R0],Ia,Na),i.quad([h0[0],Zt,h0[2]],[u0[0],Zt,u0[2]],[u0[0],me,u0[2]],[h0[0],me,h0[2]],Na,Ia,Ht,v(K,.8))}else i.quad(h0,u0,[u0[0],me,u0[2]],[h0[0],me,h0[2]],K,[0,A0,R0],Ht,v(K,.8));i.quad([h0[0],me,h0[2]],[u0[0],me,u0[2]],[u0[0],P-L,u0[2]],[h0[0],P-L,h0[2]],vn,Ht,Ht),N+=R+_(.05,.3)}}}if(f)for(const x of[-1,1]){const d=g+x*((a[3]-a[2])/2-.35),m=a[0]+.4,w=a[1]-.4,y=o+2.15,b=12,C=(w-m)/b;i.pole([m,o,d],[m,y+.1,d],.03,V0),i.pole([w,o,d],[w,y+.1,d],.03,V0),i.pole([m,y,d],[w,y,d],.025,[.75,.75,.7]);for(let S=0;S<b;S++){const q=m+C*(S+.15),P=N0(P0),G=_(0,6.28),T=(S+.5)/b,N=y-.35*4*T*(1-T);i.tri([q,N,d],[q+C*.7,N,d],[q+C*.35,N-.55,d],P,[0,G,.6],[0,G,.6],[.12,G+1,.6])}}if(W.chance(.36)){const x=ue(a,.9,o+3.9,!1);if(x){u&&(x[1]=x[1]<(t===0?4:-20)?a[2]+.95:a[3]-.95,H0[H0.length-1][1]=x[1]);const[d,m]=x,w=m<g?1:-1,y=m+w*.51,b=w*.012,C=[.13,.1,.08],S=k?4:2;for(const[P,G]of[[-.6,-.4],[.6,-.4],[.6,.4],[-.6,.4]])i.pole([d+P,o,m+G],[d+P,o+2.1,m+G],.04,V0);for(let P=0;P<S;P++)i.box(d,o+2+P*.95/S,m,1.4,.95/S,1,v(V0,P%2?.95:.7),0,null,!0);for(const P of[-.42,0,.42])W0(i,0,d,y+b,P-.13,P+.13,o+2.2,o+2.52,C),i.tri([d+P-.13,o+2.52,y+b],[d+P+.13,o+2.52,y+b],[d+P,o+2.68,y+b],C);if(k)for(let P=0;P<6;P++)W0(i,0,d,y+b*2,-.7,.7,o+2.06+P*.155,o+2.09+P*.155,v(V0,1.2));i.box(d,o+2.14,y+w*.12,1.3,.03,.24,v(ot,1.3),0,null,!0);const q=o+2.95;i.quad([d-.85,q,m-.68],[d+.85,q,m-.68],[d+.85,q+.3,m],[d-.85,q+.3,m],v(uo,.95),Wo),i.quad([d-.85,q+.3,m],[d+.85,q+.3,m],[d+.85,q,m+.68],[d-.85,q,m+.68],v(uo,1.25),Wo);for(const P of[-.7,.7])i.tri([d+P,q,m-.5],[d+P,q,m+.5],[d+P,q+.22,m],v(V0,.8));if(i.pole([d-.7,o+2.9,m],[d-.7,o+3.8,m],.03,V0),i.pole([d+.7,o+2.9,m],[d+.7,o+3.8,m],.03,V0),i.pole([d-.9,o+3.75,m],[d+.9,o+3.75,m],.03,V0),k)for(let P=0,G=4+(t0(e,t,j+62)<.5?1:0);P<G;P++){const T=d-.72+(P+.5)*1.44/G+(t0(e+P,t,j+63)-.5)*.12,N=v(Qa,.8+.4*t0(e,t+P,j+64)),R=[.008,T*9,0];i.cyl(T,o+3.78,m,.06,.095,.11,4,N,null,R,v(N,1.2)),i.cyl(T,o+3.89,m,.095,0,.1,4,v(N,1.2),null,R,v(N,.75)),i.cyl(T,o+3.93,m+w*.05,.05,0,.09,3,v(N,.7),null,R)}yt(p,d,m,.7,3,o,a)}}if(W.chance(.65)){const x=ue(a,1.25,o+2.5,!1);if(x){const[d,m]=x,w=N0(P0),y=W.chance(.6)?[.8,.77,.7]:N0(P0),b=_(0,6.28);i.pole([d,o,m],[d,o+2.3,m],.03,ot),i.cyl(d,o+1.95,m,1.25,0,.45,8,[v(w,.9),v(y,.9)],null,[.03,b,.7]),yt(p,d,m,1.1,2.1,o,a)}}let B=null;if(F.charpoy||W.chance(.9)){const x=F.charpoy||ue(a,1.05,o+.6,!1),d=x&&(x.skip||A(x))?Gt:i;if(x&&F.charpoy){const m=N0(P0),w=W.chance(.5)?[.8,.76,.66]:N0(P0);for(let y=0;y<8;y++){const b=x[1]-.95+y*.2375;i.quad([x[0]-1.25,o+.035,b],[x[0]+1.25,o+.035,b],[x[0]+1.25,o+.035,b+.2375],[x[0]-1.25,o+.035,b+.2375],v(y%2?m:w,y%4===0?.75:.95))}}if(x){const[m,w]=x,y=F.charpoy||W.chance(.5)?0:Math.PI/2,b=v(N0([[.8,.72,.5],[.75,.3,.2],[.3,.5,.7],[.85,.8,.7]]),_(.8,1.1));d.box(m,o+.4,w,1.9,.08,.95,ot,y,b,!0);const C=Math.cos(y),S=Math.sin(y);for(const[q,P]of[[-.9,-.42],[.9,-.42],[.9,.42],[-.9,.42]]){const G=m+q*C+P*S,T=w-q*S+P*C;d.pole([G,o,T],[G,o+.5,T],.035,ot)}d===i&&(B=[m,w,y])}}if(k&&(F.reel||W.chance(.95))){const x=F.reel||ue(a,.5,o+.9,!1);if(x){const[d,m]=x,w=x.skip||A(x)?Gt:i;for(let C=0;C<3;C++){const S=(C-1)*.42;w.pole([d+S,o,m],[d+S,o+.62,m],.02,ot),w.cyl(d+S,o+.3,m,.17,.17,.24,6,Z(N0(["#ff3fa0","#ffd21a","#ff3fa0","#35d0d8"])),[.9,.85,.7])}const y=d+_(-.4,.4),b=m+.9;if(b<a[3]-.9)for(let C=0;C<3;C++){const S=N0(P0),q=o+.04+C*.03,P=_(0,1.5),G=Math.cos(P)*.5,T=Math.sin(P)*.5;i.quad([y-G,q,b-T],[y+T,q,b-G],[y+G,q,b+T],[y-T,q,b+G],S,[.012,_(0,6),.3])}}}if(k&&(F.pot||W.chance(.6))){const x=F.pot||ue(a,.4,o+.5,!1);if(x){const d=x.skip||A(x)?Gt:i;d.cyl(x[0],o,x[1],.24,.15,.34,6,v(ho,_(.8,1.3)),[.05,.04,.02]),W.chance(.5)&&d.cyl(x[0]+.5,o,x[1]+.1,.18,.12,.26,6,ho,[.05,.04,.02])}}if(k){const x=W.int(3,6),d=W.chance(.5),m=W.chance(.5)?a[2]+.55:a[3]-.55,w=_(a[0]+.8,a[1]-.8-x*.55);for(let y=0;y<x;y++){const b=d?w+y*.55:m<g?a[0]+.55:a[1]-.55,C=d?m:_(a[2]+.8,a[3]-.8),S=v(Et,_(.8,1.2)),q=W.chance(.5)?po:v(S,1.35),P=_(.34,.52),G=[.02,b*3,.3];i.cyl(b,o,C,.12,.17,.22,4,[v(at,1.2),v(at,.9)]);const T=[v(S,1.25),v(S,1),v(S,1.4),v(S,1.1),v(S,.9)];i.cyl(b,o+.2,C,.07,.25,P*.38,6,T,null,G),i.cyl(b,o+.2+P*.38,C,.25,.13,P*.45,6,T,q,G,q)}}if(k&&W.chance(.2)){const x=ue(a,.5,o+1.3,!0);x&&(i.pole([x[0],o,x[1]],[x[0],o+.9,x[1]],.03,[.3,.3,.32]),i.cyl(x[0],o+.85,x[1],.12,.5,.2,8,[.7,.7,.72],[.55,.56,.6]))}if(D&&W.chance(.55)){const x=D[0]<h?a[1]-.4:a[0]+.4,d=D[1]<g?a[3]-.4:a[2]+.4,m=o+2.6,w=o+2.2;if(Ce((D[0]+x)/2,(D[1]+d)/2,m,2.5)&&Ce(x,d,w,.2)){i.pole([x,o,d],[x,w+.1,d],.03,V0),i.pole([D[0],m,D[1]],[x,w,d],.025,[.75,.75,.7]);const y=9,b=(x-D[0])/y,C=(d-D[1])/y;for(let S=0;S<y;S++){const q=(S+.5)/y,P=-.5*4*q*(1-q),G=D[0]+b*(S+.2),T=D[1]+C*(S+.2),N=b0(m,w,q)+P,R=N0(P0),L=_(0,6.28);i.tri([G,N,T],[G+b*.6,N,T+C*.6],[G+b*.3,N-.5,T+C*.3],R,[0,L,.6],[0,L,.6],[.12,L+1,.6])}}}if(W.chance(.4)){const x=W.chance(.5)?a[2]+.15:a[3]-.15,d=_(a[0]+1,a[1]-3),m=W.chance(.7)?Z("#d81f8c"):Z("#ff7a1a");if(Ce(d+1,x,o+1.6,1.2))for(let w=0;w<14;w++)i.cyl(d+w*.2+_(-.15,.15),o+_(.45,1),x+_(-.3,.3),_(.2,.36),0,_(.18,.34),5,[v(m,_(.7,1.15)),v(m,_(.6,1)),v(Et,_(.7,1)),v(m,_(.7,1.15))],null,[.015,w*1.3,.5])}if(W.chance(.3)){const x=W.chance(.5)?a[0]+.2:a[1]-.2,d=W.chance(.5)?a[2]+.2:a[3]-.2;if(Ce(x,d,o+2.6,.6)){i.pole([x,o+1,d],[x,o+1.9,d-.25],.025,[.8,.8,.8]);for(let m=0;m<4;m++)tt(x+_(-.25,.25),o+1.75+_(0,.5),d+_(-.25,.25),0,0,0,_(0,6.28),0,.36,3,N0(P0))}}if(mo(e,t,i,p,o,a,u,l,n),B&&l<24&&t0(e,t,j+91)<.5){const[x,d,m]=B,w=m===0,y=w||z0.pointAt(r.u,ca).z>d?1:-1,b=x-(w?.48:0),C=d-(w?0:y*.48);Ce(b,C,o+1.62,.3)&&(ha(i,b,o+.48,C,w?1:0,w?0:y,pa.pick([0,0,2]),!0,pa),vo--,da++)}};for(let e=ie;e<=re;e++)for(let t=X0;t<=se;t++){const n=Y(t,e);!E0[n]||Q[n]<=0||t===44&&e>=-3&&e<=-1||(en(t,e,E0[n]),await M.yield())}await M.yield();for(const e of It.keys()){if(E0[e]||Q[e]<=0)continue;eo(e,ut);const t=Y0(ut.i,ut.j,g0),n=ce((t[0]+t[1])/2);H0.length=0,fo=Q[e],mo(ut.i,ut.j,$0[n],et[n],Q[e],t,0,99,0)}await M.yield();{const e=$0[ce(0)],t=Y0(-1,0,g0),n=t[2]+.03,s=t[3]-.03,o=Y(-1,0),a=xn([.63,.5,.39],[$[o*3],$[o*3+1],$[o*3+2]],.4),i=c=>6.7+(c+2.5)*(5.28/22.5);for(let c=0;c<16;c++){const h=-2.5+c*1.40625,g=h+1.40625,r=v(a,(c%2?1.02:.94)*1.15),l=v(a,.8);e.quad([h,i(h),n],[h,i(h),s],[g-.05,i(g-.05),s],[g-.05,i(g-.05),n],[r[0]*1.2,r[1]*1.05,r[2]]),e.quad([g-.05,i(g-.05),n],[g-.05,i(g-.05),s],[g,i(g),s],[g,i(g),n],l)}for(const[c,h,g]of[[n-4.5,n,v(Ft[1],.62)],[s,s+4.5,v(Ft[3],.62)]])for(let r=0;r<8;r++){const l=-2.5+r*2.8125,u=l+2.8125,f=Math.min(i(l),8.5),k=Math.min(i(u),8.5);e.quad([l,f,c],[l,f,h],[u,k,h],[u,k,c],v(g,r%2?1:.92))}const p=(c,h,g,r,l,u)=>e.quad([c,i(c)+u,g],[c,i(c)+u,r],[h,i(h)+u,r],[h,i(h)+u,g],l);p(2.2,5,2.6,6.2,[.78,.75,.68],.03),p(2.4,4.8,2.8,6,[.6,.035,.02],.06),p(8,9.8,.4,2.4,[.78,.75,.68],.03),p(8.15,9.65,.55,2.25,[.88,.52,.03],.06);for(let c=0;c<7;c++)p(11.5,14.2,5.4+c*.3,5.7+c*.3,v(P0[c%2?2:3],.95),.03)}const x0=Z("#C68A55"),Fe=v(x0,.6),n0=v(Z("#e0b07c"),.95);await M.yield();const yo=jo.makeMaterials({night:U*.85,streetY:V+.5});await M.yield(),yo.setSky({top:E.sky.zenith,horizon:E.sky.horizon,sun:E.sun,sunDir:[o0.x,o0.y,o0.z]});const ya=[];for(const[e,t]of[-32,-8].entries())ya.push(jo.makeBuilding({rng:X.fork("minaret"+e),style:"minaret",width:5,height:47,flood:.8,palette:{wall:"#C68A55",stone:"#b87c48",trim:"#d9a870",roof:"#b9853a",accent:"#ffd98a",gold:"#e0b040"},position:[530,0,t],mats:yo})),await M.yield();const ga=jo.mergeObjects(ya);I.add(ga.object),await M.yield(),ga.object.traverse(e=>{const t=e.geometry&&e.geometry.attributes.win;if(t){for(let n=0;n<t.count;n++)Math.round(t.getX(n))===16&&t.setX(n,10);t.needsUpdate=!0}}),await M.yield();{const e=$0[ce(530)],t=530,n=V;for(const c of[-32,-8]){e.cyl(t,16.2,c,2.25,3.1,.7,12,[n0,x0],x0);for(let h=0;h<12;h++){const g=(h+.5)/12*6.2832;e.box(t+Math.cos(g)*2.62,15.72,c+Math.sin(g)*2.62,.62,.5,.26,Fe,-g,v(x0,.8),!0)}e.cyl(t,11.2,c,2.6,2.6,.8,12,[Fe,n0]),e.cyl(t,21.5,c,2.3,2.3,.6,12,[Fe,n0]),e.cyl(t,n,c,3.3,2.7,11.1-n,8,[x0,v(x0,.86)],n0)}const s=[v(x0,1.08),v(x0,.74)],o=v(x0,.32),a=[1.25,.82,.26],i=(c,h,g,r)=>{e.cyl(t,h-.22,c,g+.1,g+.1,.22,r,Fe),e.cyl(t,h,c,g,g,1.5,r,[n0,v(n0,.9)]),e.cyl(t,h+1.5,c,g+.1,g+.1,.22,r,Fe);for(let l=0;l<r;l++){const u=l/r*Ie,f=(l+1)/r*Ie,k=Math.cos(u)*g,F=Math.sin(u)*g,A=Math.cos(f)*g,D=Math.sin(f)*g,B=(k+A)/2,x=(F+D)/2,d=Math.hypot(B,x),m=B/d*.03,w=x/d*.03,y=(A-k)*.36,b=(D-F)*.36,C=t+B+m,S=c+x+w,q=h+.75,P=(A-k)*.25,G=(D-F)*.25,T=y*.5,N=b*.5;for(const[R,L]of[[-1,.36],[1,.36],[-1,-.36],[1,-.36]]){const K=C+P*R,A0=S+G*R,R0=q+L;e.quad([K-T,R0,A0-N],[K,R0-.27,A0],[K+T,R0,A0+N],[K,R0+.27,A0],o)}e.quad([C-T*.55,q,S-N*.55],[C,q-.15,S],[C+T*.55,q,S+N*.55],[C,q+.15,S],n0)}},p=(c,h,g,r,l,u)=>{for(let f=0;f<r;f++){const k=(f+.5)/r*Ie;e.box(t+Math.cos(k)*g,h,c+Math.sin(k)*g,l,u,.22,Fe,-k,v(x0,.78),!0)}};for(const c of[-32,-8]){e.cyl(t,12,c,2.1,2.08,1,20,s),e.cyl(t,14.94,c,2.08,2.06,1.26,20,s),e.cyl(t,17.8,c,2.06,2.03,3.7,20,s),e.cyl(t,26.7,c,1.68,1.64,1.4,16,s),e.cyl(t,30.04,c,1.64,1.62,1.86,16,s),e.cyl(t,37,c,1.35,1.33,1.9,12,s),i(c,13.22,2.26,14),i(c,28.32,1.82,12),i(c,17.12,3.12,16),e.cyl(t,18.84,c,3.3,3.3,.13,16,[n0,v(n0,.92)]),e.cyl(t,31.9,c,1.74,1.74,.45,12,[Fe,n0]),p(c,22.3,2.82,14,.95,.66),p(c,32.62,2.22,12,.8,.56),e.cyl(t,22.1,c,2.42,2.42,.1,14,n0),e.cyl(t,32.35,c,1.82,1.82,.09,12,n0),e.cyl(t,39.45,c,1.75,2.3,.28,12,n0,n0);let h=39.75,g=1.7;for(const[r,l]of[[1.86,.8],[1.5,1],[.95,.85]])e.cyl(t,h,c,g,r,l,12,[n0,v(x0,.95)]),h+=l,g=r;e.cyl(t,h,c,.95,.5,.5,12,a)}for(const c of[-29.2,-23.3,-16.7,-10.8])e.box(t,n,c,1.6,11.1-n,1.5,x0,0,n0);e.box(t,11,-20,1.6,1.7,19.6,x0,0,n0);for(const c of[-26.25,-20,-13.75])e.quad([t-.82,n+.1,c-1.9],[t-.82,n+.1,c+1.9],[t-.82,9.2,c+1.9],[t-.82,9.2,c-1.9],[.05,.035,.04]),e.quad([t-.82,9.2,c-1.9],[t-.82,9.2,c+1.9],[t-.82,11.6,c+.5],[t-.82,11.6,c-.5],[.05,.035,.04]);for(let c=-29.3;c<-10.6;c+=1.25)e.box(t,12.7,c,1.6,.55,.7,n0),e.quad([t-.81,11.9,c-.3],[t-.81,11.9,c+.3],[t-.81,12.5,c+.3],[t-.81,12.5,c-.3],Fe);e.box(t,12.6,-20,.5,.9,.5,x0),e.cyl(t,13.4,-20,.5,0,.9,6,[1.2,.8,.25])}await M.yield();const k0=ft(),D0=X.fork("landmarks"),go=(e,t,n,s,o)=>{e.pole([t,n,s],[t,n+3.2,s],.06,[.4,.3,.2]);const a=D0.range(0,6);e.tri([t,n+3.2,s],[t,n+2.2,s],[t+2.4,n+2.7,s+.1],o,[0,a,.6],[0,a,.6],[.35,a+1.5,.6])},tn=(e,t,n,s,o)=>{let a=8,i=4.2*s;e.box(t,V,n,9*s,6*s+a-V,9*s,o,.3,v(o,1.1)),a+=6*s;for(let p=0;p<5;p++){const c=i*(p===4?.25:.8),h=(p===4?2.4:3.6)*s,g=v(o,p%2?.74:1);e.cyl(t,a,n,i,c,h,8,[g,v(g,.8)],v(o,1.15)),p<4&&e.cyl(t,a+h-.3*s,n,c*1.1,c*1.1,.34*s,8,v(o,.5)),a+=h,i=c*1.08}e.cyl(t,a,n,.7*s,0,1.6*s,6,[1.3,.85,.25]),go(e,t,a+1.2*s,n,Z(D0.pick(["#ff7a12","#D8281C","#ff7a12"])))},Nt=(e,t,n,s)=>{const o=[.8,.78,.72];let a=8;e.box(t,V,n,16*s,9+a-V,16*s,v(n0,.9),0,[.7,.66,.6]),a+=9,e.cyl(t,a,n,6*s,6*s,2,12,[o,v(o,.85)]),a+=2;let i=6.3*s;for(const[p,c]of[[.94,2.2],[.78,2],[.5,1.6],[0,1.1]])e.cyl(t,a,n,i,6.3*s*p,c*s,12,[o,v(o,.9)],o),a+=c*s,i=6.3*s*p;e.cyl(t,a-.2,n,.5,0,2.2,6,[1.3,.9,.3])},on=(e,t,n)=>{for(const[s,o]of[[-2.5,-2.5],[2.5,-2.5],[2.5,2.5],[-2.5,2.5]])e.pole([t+s*1.45,V,n+o*1.45],[t+s,24,n+o],.3,[.5,.5,.5]);e.cyl(t,24,n,4.6,4.6,5.5,10,[[.66,.68,.7],[.56,.58,.62]],[.74,.75,.76]),e.cyl(t,29.5,n,4.8,0,1.6,10,[.5,.42,.4])},an=(e,t,n)=>z0.nearestXZ(e,t).dist>n;for(let e=0,t=0;e<200&&t<22;e++){const n=t>=9,s=n?D0.range(-600,860):D0.range(-120,830);let o=(D0.chance(.5)?1:-1)*(n?D0.range(520,1100):D0.range(70,470));if(!an(s,o,75))continue;for(let i=0;i<4&&(Xo(s,o,16)||s>G0.x0-12&&s<G0.x1+12&&o>G0.z0-12&&o<G0.z1+12);i++)o+=o>0?70:-70;const a=t%5;t++,a===3?Nt(k0,s,o,D0.range(.9,1.4)):a===4?on(k0,s,o):tn(k0,s,o,D0.range(.85,1.5)*(n?1.5:1),v(Z(D0.pick(["#F6E9D2","#e9c79a","#f2efe8","#F4B8C6"])),.82))}await M.yield();{const e=168*D0.int(1,3)+84,t=D0.pick([-190,196]);for(const n of[-13,-5,5,13])k0.box(e+n,V,t,n*n>100?5:3.2,22-V,6,x0,0,n0);k0.box(e,22,t,31,6,6,x0,0,[.8,.72,.58]),k0.box(e,28,t,12,3,6,n0,0,[.82,.75,.6]);for(const n of[-13,0,13]){const s=n?28:31;for(const[o,a]of[[-1.3,-1.3],[1.3,-1.3],[1.3,1.3],[-1.3,1.3]])k0.pole([e+n+o,s,t+a],[e+n+o,s+3,t+a],.22,n0);k0.cyl(e+n,s+3,t,2.6,2.3,.5,8,x0),k0.cyl(e+n,s+3.5,t,2.1,.9,1.3,8,[[.86,.82,.74],[.74,.7,.64]]),k0.cyl(e+n,s+4.8,t,.9,0,1.4,8,[1.2,.85,.3])}for(let n=-14;n<=14;n+=2.8)k0.box(e+n,28,t,1.4,1.1,6,n0);go(k0,e-15,28,t,Z("#D8281C")),go(k0,e+15,28,t,Z("#ff7a12"))}let wo=0;{const e=D0.range(140,320),t=[.16,.15,.17],n=[.44,.15,.1],s=Z0-8,o=_0+8,a=5,i=(_0-Z0-12)/a;wo=e,k0.box((s+o)/2,14.5,e,o-s,1.2,9,t,0,[.35,.33,.3],!0);for(let p=0;p<=a;p++){const c=Z0+6+p*i;if(k0.box(c,V-1,e,4,15.5-V,11,[.45,.4,.36]),p<a)for(const h of[-4.4,4.4]){k0.box(c+i/2,15.7,e+h,i,.9,.4,n,0,null,!0);for(let g=0,r=[c,16.2,e+h];g<6;g++){const l=(g+1)/6,u=[c+l*i,16.2+30*l*(1-l),e+h];k0.pole(r,u,.3,n),g%2===0&&k0.pole([u[0],16.2,u[2]],u,.13,n),r=u}}}}const wa=[];for(let e=0;e<9;e++){const t=D0.range(1420,2450),n=-1e3+e*240+D0.range(-80,80),s=D0.range(50,70),o=v(at,D0.range(.8,1.1));k0.cyl(t,V,n,4.8,2.6,s+6-V,10,[o,v(o,.82)],[.05,.04,.04]),k0.cyl(t,6+s-3,n,2.9,2.9,1.2,10,v(o,.6)),k0.box(t+22,V,n+D0.range(-20,20),60,19-V,26,v(o,.9),D0.range(-.3,.3),[.4,.4,.42]),wa.push([t,6+s,n])}await M.yield();{const e=M.core.makeRng(M.core.hashSeed("places:"+j)),t=(r,l)=>e.range(r,l),n=r=>r[Math.floor(e()*r.length)],s=k0,o=[1.25,.82,.26],a=[.86,.83,.75],i=(r,l,u,f,k)=>{for(const[F,A]of[[-1,-1],[1,-1],[1,1],[-1,1]])s.pole([r+F*1.25*f,l,u+A*1.25*f],[r+F*1.25*f,l+2.5*f,u+A*1.25*f],.17*f,k);s.box(r,l+2.5*f,u,3.3*f,.3*f,3.3*f,v(k,.8),0,k,!0),s.cyl(r,l+2.8*f,u,1.45*f,1*f,.75*f,8,[k,v(k,.86)]),s.cyl(r,l+3.55*f,u,1*f,0,.8*f,8,[k,v(k,.86)]),s.cyl(r,l+4.25*f,u,.14*f,0,.9*f,4,o)},p=(r,l,u,f,k,F,A)=>{let D=l;for(const[B,x,d,m]of[[1,.86,.38,1],[.8,.7,.32,1],[.62,.55,.19,0]])s.cyl(r,D,u,k*B,k*x,f*d,10,[F,v(F,.82)]),D+=f*d,m&&s.cyl(r,D-.5,u,k*x*1.55,k*x*1.55,.5,10,[A,v(A,.85)],A);s.cyl(r,D,u,k*.75,k*.75,.3,10,A,A),s.cyl(r,D+.3,u,k*.7,k*.36,f*.045,10,[A,v(A,.88)]),s.cyl(r,D+.3+f*.045,u,k*.36,0,f*.04,10,[A,v(A,.88)]),s.cyl(r,D+.3+f*.085,u,.2,0,f*.04,4,o)},c=(r,l,u,f)=>{const k=v(f,.72),F=[f,v(f,.84)];s.box(r,V,l,11.5*u,1.4,11.5*u,k,.3,v(f,.9),!0),s.box(r,V+1.4,l,8.6*u,5*u,8.6*u,f,.3,v(f,1.08));let A=V+1.4+5*u,D=4.5*u;for(const[x,d]of[[4.2,3],[3.6,3.4],[2.8,3.4],[1.95,3],[1.25,2.2]])s.cyl(r,A,l,D,x*u,d*u,8,F),A+=d*u,D=x*u;s.cyl(r,A,l,1.9*u,1.9*u,.8*u,8,[k,f],k),A+=.8*u,s.cyl(r,A,l,.9*u,0,2*u,6,o),A+=1.6*u,s.pole([r,A,l],[r,A+4.5,l],.09,[.4,.3,.2]);const B=t(0,6);s.tri([r,A+4.5,l],[r,A+3.1,l],[r+3.4,A+3.8,l+.1],Z("#ff7a12"),[0,B,.6],[0,B,.6],[.4,B+1.5,.6])},h=(r,l,u,f=V,k=!1)=>{const F=v(Et,t(.72,1.12)),A=v(F,.7),D=v(F,1.28),B=r*.7+l;if(s.pole([r,f,l],[r,f+4.4*u,l],.34*u,[.3,.24,.19]),k){s.cyl(r,f+3*u,l,1.6*u,3.7*u,1.9*u,7,[A,v(A,1.2),v(A,.9)],null,[.05*u,B,.25]),s.cyl(r,f+4.9*u,l,3.7*u,3.3*u,1.8*u,7,[F,v(F,1.15),A,v(F,.92)],null,[.06*u,B+.6,.25]),s.cyl(r,f+6.7*u,l,3.3*u,1.1*u,2.3*u,7,[D,F,v(F,1.12)],D,[.07*u,B+1,.25]);return}s.cyl(r,f+3.2*u,l,2.3*u,3.9*u,2.5*u,5,[A,v(A,1.2)],null,[.05*u,B,.25]),s.cyl(r,f+5.7*u,l,3.9*u,1.4*u,3.3*u,5,[F,v(F,1.2),v(F,.88)],v(F,1.3),[.07*u,B+1,.25])},g=(r,l,u,f,k)=>{const F=v(n([[.36,.22,.12],[.16,.25,.4],[.5,.16,.1],[.14,.34,.3],[.6,.5,.3]]),t(.8,1.15)),A=Math.cos(u),D=Math.sin(u),B=V-.35;s.box(r,B,l,f*.72,.95,f*.2,F,u,v(F,1.5),!0);for(const x of[-1,1])s.box(r+A*x*f*.43,B+.25,l-D*x*f*.43,f*.16,.95,f*.11,F,u,v(F,1.3),!0);if(k===0){const x=n(P0);s.box(r,B+.95,l,f*.34,1,f*.19,x,u,v(x,1.25),!0)}else if(k===1){const x=n([[.85,.8,.68],[.9,.55,.1],[.85,.8,.68],[.75,.14,.1]]),d=t(0,6),m=f*.75;s.pole([r,B+.9,l],[r,B+.9+m,l],.09,[.3,.22,.15]),s.tri([r,B+1+m,l],[r-A*f*.4,B+1.5,l+D*f*.4],[r+A*f*.36,B+1.7,l-D*f*.36],x,[.05,d,.6],[.05,d,.6],[.3,d+1,.6])}};{const r=Me.x,l=Me.z,u=v(Z("#D9A066"),.9),f=v(Z("#EBC48C"),.95),k=v(u,.62),F=[.07,.05,.05],A=V+1.8;s.box(r,V,l,52,1.8,52,k,0,v(f,.9),!0),s.box(r,A,l,30,15,30,u,0,f);for(const[x,d,m]of[[-15.06,0,1],[15.06,0,1],[0,-15.06,0],[0,15.06,0]])for(const[w,y,b]of[[0,4.2,12.6],[-10,2.3,7.6],[10,2.3,7.6]]){const C=r+x,S=l+d,q=A+b-y*.9;W0(s,m,C,S,w-y,w+y,A,q,F),m?s.tri([C,q,S+w-y],[C,q,S+w+y],[C,A+b,S+w],F):s.tri([C+w-y,q,S],[C+w+y,q,S],[C+w,A+b,S],F)}s.box(r,A+15,l,31.2,1.1,31.2,f,0,v(u,.85),!0);let D=A+16.1,B=11;s.cyl(r,D,l,10.4,10.4,4.2,16,[f,v(f,.88)]),D+=4.2;for(const[x,d]of[[11.7,2.2],[11.3,2.6],[9.8,2.8],[7.2,2.6],[3.8,2],[0,1.6]])s.cyl(r,D,l,B,x,d,16,[a,v(a,.9)]),D+=d,B=x;s.cyl(r,D-.4,l,.8,0,4,6,o);for(const[x,d]of[[-1,-1],[1,-1],[1,1],[-1,1]])i(r+x*12,A+16.1,l+d*12,1.5,a),p(r+x*24,A,l+d*24,44,1.9,u,f)}await M.yield();{const{x:r,z:l,r:u}=L0,f=[.6,.5,.4];s.box(r,V-.4,l,5,1,5,v(f,.8),.4,f,!0),i(r,V+.6,l,1.5,a),s.box(r-(u+8)/2,V-.3,l,u-8,.75,2.4,v(f,.75),0,f,!0);for(let k=0;k<3;k++){const F=k*2.1+.9;h(r+Math.cos(F)*5.2,l+Math.sin(F)*5.2,t(.7,.95),V,!0)}for(let k=0;k<20;k++){const F=(k+t(-.25,.25))/20*Ie;e.chance(.15)||h(r+Math.cos(F)*(u+10.6),l+Math.sin(F)*(u+10.6),t(.9,1.35),V,!0)}for(let k=0;k<4;k++){const F=t(0,Ie),A=t(13,u-6);g(r+Math.cos(F)*A,l+Math.sin(F)*A,t(0,Ie),t(4.5,6),2)}}for(const r of Ze)c(r[0],r[1],r[2],v(Z(r[3]),.92));await M.yield();{const r=$0[ce(432)],l=et[ce(432)],u=V+2.5,f=V+3.35,k=Math.min(2.9/C0,6),F=ze*k,A=Ae*k;for(const D of[411,427.5,433,440.5,446,452.5])for(let B=G0.z0+3.2;B<G0.z1-2;B+=4.3){Ye(D,B,d0);const x=Q[Y(d0.i,d0.j)]>0,d=n(P0),m=e.chance(.55)?[.82,.78,.68]:n(P0),w=t(0,6.28),y=1.55,b=1.85,C=B+t(-.3,.3);x||e.chance(.14)||(r.quad([D-y,u,C-b],[D-y,u,C+b],[D,f,C+b],[D,f,C-b],d,[.05,w,.5],[0,w,.5]),r.quad([D+y,u,C-b],[D+y,u,C+b],[D,f,C+b],[D,f,C-b],m,[.05,w+2,.5],[0,w,.5]),l.quad([D-y+F,V+.06,C-b+A],[D+y+F,V+.06,C-b+A],[D+y+F,V+.06,C+b+A],[D-y+F,V+.06,C+b+A],zt))}for(let D=0,B=Math.round(130*v0);D<B;D++)tt(t(G0.x0+1,G0.x1-1),V,t(G0.z0+1,G0.z1-1),t(-.5,.5),0,t(-.5,.5),t(0,6.28),t(2,5.5),t(1.55,1.85),0,n(P0))}await M.yield();for(const r of I0.ringLineAnchors){const l=so(r),u=l.y-2.7;if(Ye(l.x,l.z,d0),!(!te(d0.i,d0.j)||Q[Y(d0.i,d0.j)]>0||u<V+2)){for(const[f,k]of[[-1,-1],[1,-1],[1,1],[-1,1]])s.pole([l.x+f*1.9,V,l.z+k*1.9],[l.x+f*1.3,u,l.z+k*1.3],.09,V0);s.box(l.x,u-.14,l.z,3.1,.14,3.1,v(V0,.8),0,null,!0),s.pole([l.x-1.6,V+(u-V)*.5,l.z-1.6],[l.x+1.6,V+(u-V)*.5,l.z+1.6],.06,V0)}}for(let r=0;r<48;r++){const l=r%5<2,u=e.chance(.5),f=t(-640,640),k=t(9,15),F=l?t(-.5,.5):Math.PI/2+t(-.25,.25),A=l?u?_0-Ct-t(3,9):Z0+Ct+t(3,9):t(Z0+Ct+16,_0-Ct-16);Math.abs(f-wo)>10&&g(A,f,F,k,r%3),(r&7)===7&&await M.yield()}for(const r of[Z0+3.5,_0-3.5]){for(let l=-612+t(0,20);l<620;){const u=e.chance(.2),f=t(1.2,1.7),k=t(.85,1.3),F=t(-1,1);Math.abs(l-wo)>14&&(u?i(r,V,l,f,[.8,.7,.56]):h(r+F,l,k)),l+=u?t(30,44):t(22,40)}await M.yield()}{const r=_0+16,l=v(Z("#F1E3C4"),.9),u=v(Z("#DE9A74"),.95),f=v(Z("#E8B98A"),.95);Nt(s,r+6,-150,1.7),p(r-6,V,-167,42,1.8,x0,n0),p(r-6,V,-133,42,1.8,x0,n0),c(r+2,104,1.7,u),c(r+10,136,1.15,l),await M.yield(),c(r+4,-385,1.5,l),Nt(s,r+8,395,1.3),p(r-4,V,381,34,1.5,x0,n0),p(r,V,-630,38,1.7,x0,n0),p(r,V,-606,38,1.7,x0,n0),c(r+6,640,1.6,f),await M.yield(),c(_0+150,34,1.9,l),Nt(s,_0+124,-262,1.5),p(_0+110,V,-262,36,1.6,x0,n0),c(_0+136,262,1.4,f),p(_0+84,V,-474,40,1.7,x0,n0)}await M.yield();for(let r=l0;r<l0+y0;r++){for(let l=se+1;l<=ro;l++)(l>na?l<io:r<ie||r>re)||oe[Y(l,r)]===1&&t0(l,r,j+81)<.27&&h(l*12+6+(t0(l,r,j+82)-.5)*4,12*r+4+(t0(l,r,j+83)-.5)*4,.95+.5*t0(l,r,j+84));(r&15)===15&&await M.yield()}}await M.yield();for(let e=ie;e<=re;e++)for(let t=X0;t<=se;t++){t===X0&&(e&15)===0&&await M.yield();const n=Y(t,e),s=(t%14+14)%14;if(!E0[n]||s!==6&&s!==7||Q[n]<=0)continue;Y0(t,e,g0);const o=$0[ce(g0[0])],a=s===6?g0[1]:g0[0],i=s===6?1:-1;for(let p=g0[2]+.4;p<g0[3]-2.4;p+=W.range(2.8,3.6)){const c=N0(P0),h=W.range(2,2.6),g=_(0,6.28);o.quad([a,V+3.6,p],[a,V+3.6,p+h],[a+i*1.9,V+2.8,p+h],[a+i*1.9,V+2.8,p],c,[0,g,.5],[.06,g,.5],[.8,.77,.7])}}await M.yield();const nn=lt.makeWind({direction:[1,.1],strength:E.gust?2.1:1.1,speed:E.gust?1.7:1.2}),O0=X.fork("trees"),Vt=[],sn=[0,1,2].map(e=>lt.oakGeometry({rng:O0.fork("v"+e),detail:0,height:12.5+e*1.5,leaf:["#4d7d2c","#3f7434","#5c8a30"][e],leafLight:"#8fb04a",bark:"#6a5a48"}));await M.yield(),await lt.prepareLeafTexture({},M.yield);const rn=lt.makeLeafTexture();await M.yield();const ln=lt.windMaterial({wind:nn,map:rn,backlight:1,ambient:1.6,leafAmbient:1.5});await M.yield();for(let e=0,t=0;e<Math.round(80*Math.min(T0,1.1))&&t<5e3;t++){(t&127)===127&&await M.yield();const n=O0.int(X0,se),s=O0.int(ie,re),o=qt[Y(n,s)]<=0;if(!o&&O0.chance(.85)&&t%3)continue;const a=o?n*12+6+O0.range(-2,2):n*12+O0.range(-.6,.6),i=o?12*s+4+O0.range(-2,2):12*s-2+O0.range(-.6,.6),p=z0.nearestXZ(a,i);if(p.dist<15&&p.y<40||Math.hypot(a-$e.x,i-$e.z)<16||Math.hypot(a-530,i+20)<22)continue;const c=O0.range(.95,1.3);if(Vt.push({x:a,y:V-.2,z:i,s:c,rot:O0.range(0,6.28),v:e%3,u:0,d:p.dist,open:o,kite:e%2===1}),e++,e%2===0){const h=$0[ce(a)],g=N0(P0),r=a+O0.range(-2.5,2.5),l=i+O0.range(-2.5,2.5),u=V-.2+(12.5+e%3*1.5)*c*.93,f=O0.range(0,6.28),k=O0.range(0,6.28),F=Math.cos(f)*.7,A=Math.sin(f)*.7;h.quad([r-F,u,l-A],[r+A,u+.5,l-F],[r+F,u+.9,l+A],[r-A,u+.4,l+F],g,[.05,k,.7],[.16,k+1,.7],v(g,.85))}}for(const e of Vt){const t=e.x-L0.x,n=e.z-L0.z,s=Math.hypot(t,n);if(s<L0.r+9.5){const o=(L0.r+10.8)/Math.max(s,.01);e.x=L0.x+t*o,e.z=L0.z+n*o}for(const o of oo.slice(1)){const a=e.x-o[0],i=e.z-o[1];Math.abs(a)<o[2]+1&&Math.abs(i)<o[2]+1&&(Math.abs(a)>Math.abs(i)?e.x=o[0]+(a<0?-1:1)*(o[2]+2.5):e.z=o[1]+(i<0?-1:1)*(o[2]+2.5))}}{let e=0;for(const t of Vt){if(e>=10)break;t.kite||!t.open||t.d<70||t.d>340||(t.s*=1.85,e++)}}await M.yield();const xa=lt.makeScatter({rng:O0,variants:sn,points:Vt,material:ln,tint:.2,hue:.05,sink:0,tilt:.04});I.add(xa.object),await M.yield();const xo=Qe(ja,La,{uFlut:{value:E.gust?8.5:5.2},uAmp:{value:E.gust?2:1},uGain:{value:1},uMoon:{value:new z.Color(0,0,0)}},{side:z.DoubleSide}),cn=new z.MeshBasicMaterial({color:new z.Color(.46,.47,.66).lerp(new z.Color(1,1,1),U*.6),blending:z.CustomBlending,blendSrc:z.ZeroFactor,blendDst:z.SrcColorFactor,depthWrite:!1,fog:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});let ba=0;for(let e=0;e<co;e++){if($0[e].triangles){const t=new z.Mesh(await $0[e].buildAsync(M.yield),xo);t.name="roof-props-"+e,I.add(t),ba+=$0[e].triangles}if(await M.yield(),et[e].triangles){const t=await et[e].buildAsync(M.yield);t.deleteAttribute("aCol"),t.deleteAttribute("aW"),t.deleteAttribute("normal");const n=new z.Mesh(t,cn);n.renderOrder=1,n.name="prop-shadows-"+e,I.add(n)}await M.yield()}{const e=new z.Mesh(await k0.buildAsync(M.yield),xo);e.name="landmarks",e.frustumCulled=!1,I.add(e)}await M.yield();const gt=new z.Group;gt.name="settling-kite",I.add(gt);const Rt=new z.Vector3(409.5,13.2,-8);{const e=Y0(34,-1,g0);Q[Y(34,-1)]>0&&Rt.set(Math.min(e[1]-1.6,Math.max(e[0]+1.6,409.5)),Q[Y(34,-1)]+1.12,e[3]-.25)}{const e=ft(),t=v(Z("#E3207F"),.95),n=[.9,.78,.4],s=2,o=(r,l)=>[r,l,.7],a=[0,0,-s],i=[0,0,s],p=[.95*s,.14,-.2*s],c=[-.95*s,.14,-.2*s],h=[0,-.1,-.18*s];e.tri(a,c,h,t,o(.02,.3),o(.07,1.5),o(.01,.8)),e.tri(c,i,h,n,o(.07,1.5),o(.05,2.6),o(.01,.8)),e.tri(a,h,p,t,o(.02,.3),o(.01,.8),o(.07,2.1)),e.tri(h,i,p,n,o(.01,.8),o(.05,2.6),o(.07,2.1));for(let r=0;r<6;r++){const l=s+r*.5,u=l+.5,f=.09-r*.008,k=f-.008;e.quad([-f,0,l],[f,0,l],[k,0,u],[-k,0,u],r%2?n:t,o(.03+r*.035,-r*1.1),o(.03+(r+1)*.035,-(r+1)*1.1))}const g=new z.Mesh(e.build(),xo);g.frustumCulled=!1,gt.add(g)}I.userData.kiteRoofs={flyers:vo,sitters:da,fixed:I0.fixedPlaced,great:I0.counts.great,kites:I0.counts.kites,cleared:I0.counts.cleared,propTris:ba},await M.yield();const O=X.fork("crowd"),bo=I0.kiteAnchors,fn=bo.length/3,Ma=Math.round(7200*v0*Math.min(1,T0+.1)),ka=P0.concat([[.85,.83,.78],[.85,.83,.78]]);let Mo=0;const _t=(e,...t)=>{e&&tt(...t)},ko=(e,t,n,s)=>{const o=Y(n,s),a=qt[o];if(a<=0)return;Y0(n,s,g0),e=Math.min(g0[1]-.6,Math.max(g0[0]+.6,e)),t=Math.min(g0[3]-.6,Math.max(g0[2]+.6,t));const i=z0.nearestXZ(e,t);Math.hypot(i.dist,i.y-a)<30||E0[o]===2||(_t(Q[o]>0,e,a,t,O.range(-.5,.5),0,O.range(-.5,.5),O.range(0,6.28),O.range(2,5.5),O.range(1.55,1.85),0,O.pick(ka)),Mo++)};for(let e=0;e<fn&&Mo<Ma*.8;e++){(e&255)===255&&await M.yield();const t=350-bo[e*3+2],n=bo[e*3];if(Ye(t,n,d0),d0.i<X0||d0.i>se||d0.j<ie||d0.j>re||va.has(e))continue;const s=1+O.int(0,2),o=d0.i,a=d0.j;for(let i=0;i<s;i++)ko(t+O.range(-1.6,1.6),n+O.range(-1.6,1.6),o,a)}for(let e=0;e<6e3&&Mo<Ma;e++){(e&255)===255&&await M.yield();const t=O.int(X0,se),n=O.int(ie,re);Y0(t,n,g0);const s=O.chance(.6),o=O.range(g0[0],g0[1]),a=s?O.chance(.5)?g0[2]:g0[3]:O.range(g0[2],g0[3]);ko(o,a,t,n),O.chance(.5)&&ko(o+O.range(-1,1),a,t,n)}await M.yield();const Co=[[.9,.7,.05],[.1,.45,.2],[.9,.7,.05],[.5,.32,.16],[.15,.3,.6],[.75,.12,.08]];{const e=M.core.makeRng(M.core.hashSeed("squares:"+j));for(let t=ie;t<=re;t++)for(let n=X0;n<=se;n++){if(n===X0&&(t&7)===0&&await M.yield(),oe[Y(n,t)]!==1)continue;const s=n*12+6,o=12*t+4;if(z0.nearestXZ(s,o).dist>240)continue;const a=!Xo(s,o,3);for(let c=0,h=Math.round(e.int(5,8)*v0);c<h;c++)_t(a,s+e.range(-5,5),V,o+e.range(-5,5),e.range(-.5,.5),0,e.range(-.5,.5),e.range(0,6.28),e.range(2,5.5),e.range(1.55,1.85),0,e.pick(ka));const i=e.range(0,6.28),p=e.range(7,10);_t(a,s-Math.cos(i)*p/2,V+.05,o-Math.sin(i)*p/2,Math.cos(i)*p,0,Math.sin(i)*p,e(),e.range(.6,1.2)/p,e.range(1.2,1.5),1,e.pick(Co))}}await M.yield();for(let e=X0;e<=se;e++){const t=(e%14+14)%14,n=t===6,s=n?Math.round(34*T0):O.chance(.4)?3:0;for(let o=0;o<s;o++){const a=O.chance(.5)?1:-1,i=n?990:O.range(120,300),p=n?-495:O.range(-480,480-i),c=n?O.range(4,8):O.range(1.2,2.4),h=n||!oo.some(g=>Math.abs(e*12+12-g[0])<g[2]+1&&p+i>g[1]-g[2]&&p<g[1]+g[2]);_t(h,e*12+12+(n?a*O.range(.6,2.6):0),V+.05,a>0?p:p+i,0,0,a*i,O(),c/i,O.range(1.3,1.7),1,O.pick(Co))}}for(let e=ie;e<=re;e++)if((e%19+19)%19===9)for(let n=0;n<Math.round(30*T0);n++){const s=O.chance(.5)?1:-1;tt(s>0?-150:850,V+.05,12*e+10+s*O.range(.5,2),s*1e3,0,0,O(),O.range(4,8)/1e3,O.range(1.3,1.7),1,O.pick(Co))}for(let e=0;e<46;e++)tt(O.range(-100,800),O.range(18,40),O.range(-420,420),0,O.range(150,230),0,O(),1/O.range(50,90),O.range(.7,1),2,O.pick(P0));if(await M.yield(),j0){const e=O.chance(.5)?1:-1,t=O.range(600,720),n=O.range(150,175),s=[Z("#D8281C"),Z("#F59A12")];for(let o=0;o<50;o++)tt(t-o*.6,n,-e*(470+o*3.3),110,12,e*940,o*.42,1/80,o===0?5.2:3.4-o*.02,4,o===0?Z("#ffd23a"):s[o&1])}{const e=new z.InstancedBufferGeometry;e.instanceCount=fe.pos.length/3,e.setAttribute("position",new z.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,0,0,.5,1,0,-.5,1,0],3)),e.setAttribute("iPos",new z.InstancedBufferAttribute(new Float32Array(fe.pos),3)),e.setAttribute("iVel",new z.InstancedBufferAttribute(new Float32Array(fe.vel),3)),e.setAttribute("iPar",new z.InstancedBufferAttribute(new Float32Array(fe.par),4)),e.setAttribute("iCol",new z.InstancedBufferAttribute(new Float32Array(fe.col),3));const t=new z.Mesh(e,Qe(qn,Pn,{},{side:z.DoubleSide}));t.frustumCulled=!1,t.name="specks",I.add(t)}await M.yield();const Ne=Pe.makeFauna(I,{light:Pe.lightFrom(I)}),le=X.fork("fauna"),zo={body:"#7f899b",belly:"#cfd4dd",wingC:"#a3acbc",trail:"#7a8496",tip:"#2e323c",head:"#4c5664",neckC:"#5f7f74",tailC:"#4e5664",beak:"#d8c8b0",flap:6,glide:.1,outer:.7},Ca={body:"#8EDB3C",belly:"#A8D95C",wingC:"#4FA53A",tip:"#2C6B3A",head:"#86CC48",neckC:"#E86A8A",tailC:"#59B8A0",beak:"#D8342A",trail:"#3F8F36"},jt=(e,t)=>({path:z0,dist:2,each:!0,from:e,to:t,step:2}),un=[.05,.08,.27,.51,.69],dn=[.3,.49,.68,.88,1];for(let e=0;e<5;e++){const t=60+e*150+le.range(-30,30),n=(e%2?1:-1)*le.range(75,190),s=le.range(26,40),o=le.range(34,52),a=e===0,i=n<0?Math.min(n,-(28+1.45*o)):n;Ne.add(Pe.makeFlock({rng:le.fork("w"+e),species:r0?"parrots":"crows",lod:"low",count:Math.round(120*v0),size:r0?.9:1,center:[a?128:t,a?31:s,a?-46:i],radius:a?30:o,spread:[22,7,26],wander:[1.2,.8,1.6,r0?.6:.4],maxSigma:3,keepClear:jt(un[e],dn[e]),...r0?Ca:zo})),await M.yield()}Ne.add(Pe.makeFlock({rng:le.fork("burst"),species:"crows",lod:"high",count:120,size:1,spread:[24,7,34],wander:[.6,.4,.8,.4],maxSigma:3,keepClear:jt(.5,.86),...zo,cross:{path:z0,u:ta,lead:30,angle:171,side:1,height:2.5,span:190,rise:16,duration:Dt}})),await M.yield(),Ne.add(Pe.makeFlock({rng:le.fork("minaret"),species:"crows",lod:"high",count:44,size:1,spread:[14,8,22],wander:[.6,.4,.8,.4],maxSigma:3,keepClear:jt(.67,.78),...zo,cross:{path:z0,u:Je-.012,lead:22,angle:100,side:1,height:7,span:150,duration:Dt}})),await M.yield(),Ne.add(Pe.makeFlock({rng:le.fork("parakeets"),species:"parrots",count:31,form:"vee",size:2.6,spacing:.7,speed:26,...Ca,cross:{path:z0,u:e0-.075,lead:20,angle:62,side:-1,height:-10,span:300,duration:Dt}})),await M.yield(),Ne.add(Pe.makeFlock({rng:le.fork("raptors"),species:"eagles",count:3,center:[400,172,40],radius:120})),await M.yield(),Ne.add(Pe.makeFlock({rng:le.fork("crows"),species:"crows",count:16,spread:[30,10,30],wander:[1.2,.8,1.6,.4],maxSigma:3,keepClear:jt(.46,.88),center:[495,24,36],radius:36})),await M.yield();const de={value:0},he=ye.fxGroup();I.add(he.object);const Ao=[o0.x,o0.y,o0.z];he.add(ye.makeParticles({rng:X.fork("dust"),preset:"dust",time:de,count:Math.round((E.gust?2600:1500)*v0),...E.gust?{velocity:[9,.3,1.2],box:[44,22,34]}:{}})),await M.yield(),he.add(ye.makeParticles({rng:X.fork("scraps"),preset:"petals",time:de,count:Math.round((i0?900:E.gust?700:380)*v0),box:[64,34,64],colors:[M0[0],"#F59A12","#f4f0e6"],velocity:E.gust?[12,-.3,1.4]:[5.5,-.5,.6]})),await M.yield();const za=U?["#7a5a70","#b07a78"]:["#a9a2a2","#d8d2cc"];for(const e of wa)he.add(ye.makeSmokeColumn({rng:X.fork("mill"+e[0]),time:de,position:e,height:190*(.6+.8*t0(Math.round(e[0]),Math.round(e[2]),j+50)),radius:[5,46],size:[22,95],count:46,color:za[0],colorTop:za[1],opacity:U?.15:.5,shadowColor:U?"#2a2638":"#7d7884",ambient:U?"#201c2c":"#77727c",wind:[1,0,.12],bend:.85,sunDir:Ao,rate:.03})),await M.yield();for(const[e,t]of[[40,44],[452,-64],[486,30]])he.add(ye.makeSmokeColumn({rng:X.fork("cook"+e),time:de,position:[e,ao(e,t)+.4,t],height:26,radius:[.3,4],size:[1.4,9],count:40,color:"#d2ccc6",colorTop:"#efeae4",shadowColor:"#9a94a0",ambient:"#8a8690",opacity:.3,wind:[1,0,.1],bend:.9,sunDir:Ao})),await M.yield();const Fo=new z.Vector3(0,0,1),So=new z.Vector3(-I0.portalSeat.up.z,I0.portalSeat.up.y,I0.portalSeat.up.x);if(E.lanterns){he.add(ye.makeLanterns({rng:X.fork("lanterns"),time:de,count:Math.round(150*v0),center:[430,74,0],area:[760,116,640],floor:17,size:2.6,rise:1.3,wind:[1.2,0,.1],colors:["#ffb45a","#ff8a3a"],intensity:2.2}));const e=[];for(let t=0;t<16;t++){const n=t/16*Ie;e.push(K0.clone().addScaledVector(Fo,Math.cos(n)*10.4).addScaledVector(So,Math.sin(n)*10.4))}he.add(ye.makeGlows({rng:X.fork("ringglow"),positions:e,color:"#ffb060",size:4.2,intensity:2.4,flicker:.4,time:de}))}E.mist&&he.add(ye.makeGroundFog({time:de,y:1,height:8,color:"#efe6dc",opacity:.45,coverage:.7,sunDir:Ao,sunColor:E.sun})),await M.yield();const qo=ye.makeGlows({rng:X.fork("sparks"),count:8,color:"#fff6e0",size:.13,intensity:U?.8:2.2,flicker:.5,time:de,depthTest:!1});I.add(qo.object);const Lt=new z.Mesh(new z.PlaneGeometry(2,2),new z.ShaderMaterial({uniforms:{uC:{value:K0.clone()},uCamP:Q0.uCamP,uPx:Q0.uPx,uCol:{value:new z.Color(Va[6])},uHalo:{value:new z.Color("#ffb060")},uK:{value:U?.75:1}},vertexShader:`
uniform vec3 uC, uCamP; uniform float uPx;
varying vec2 vQ; varying float vA;
void main(){
  float dist = length(uC - uCamP);
  float r = max(10.2, 9.*dist*uPx);
  vA = smoothstep(260., 520., dist);
  vQ = position.xy*2.8;
  vec4 mv = viewMatrix*vec4(uC, 1.);
  mv.xy += position.xy*2.8*r*vec2(1., .88);
  gl_Position = projectionMatrix*mv;
}`,fragmentShader:`
uniform vec3 uCol, uHalo; uniform float uK;
varying vec2 vQ; varying float vA;
void main(){
  float d = length(vQ*vec2(1., 1.));
  float rim = exp(-(d - 1.)*(d - 1.)*38.)*vA;
  float halo = exp(-d*d*.8)*(1. - smoothstep(2.2, 2.8, d))*vA;
  gl_FragColor = vec4(uCol*1.35*rim*uK + uHalo*halo*.2*uK, rim*.9);
}`,transparent:!0,depthWrite:!1,fog:!1,blending:z.CustomBlending,blendSrc:z.OneFactor,blendDst:z.OneMinusSrcAlphaFactor}));Lt.frustumCulled=!1,Lt.renderOrder=6,Lt.name="ring-beacon",I.add(Lt),await M.yield();const Po=new z.Vector3(-I0.portalSeat.normal.z,I0.portalSeat.normal.y,I0.portalSeat.normal.x),Aa={uCamP:Q0.uCamP,uTime:Q0.uTime,uX:{value:Fo.clone()},uY:{value:So.clone()},uZ:{value:Po.clone()},uC:{value:K0.clone()},uIris:{value:0},uRim:{value:new z.Color(E.portal)},uDim:{value:U?.8:1}},Ve=new z.Mesh(new z.CircleGeometry(7.02,56),new z.ShaderMaterial({uniforms:Aa,side:z.DoubleSide,fog:!1,vertexShader:`
varying vec3 vW; varying vec2 vQ;
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.);
  vW = wp.xyz; vQ = position.xy/7.02;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,fragmentShader:`
uniform vec3 uCamP, uX, uY, uZ, uRim, uC; uniform float uIris, uTime, uDim;
varying vec3 vW; varying vec2 vQ;
float vh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float vnz(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(vh(i), vh(i + vec2(1., 0.)), f.x), mix(vh(i + vec2(0., 1.)), vh(i + vec2(1., 1.)), f.x), f.y);
}
void main(){
  float r = length(vQ);
  if (r < uIris*1.08 - .04) discard;
  vec3 dw = normalize(vW - uCamP + vec3(0., 1e-5, 0.));
  vec3 d = vec3(dot(dw, uX), dot(dw, uY), dot(dw, uZ));
  d /= max(d.z, .25);
  float lz = max(dot(uC - uCamP, uZ), .5);
  d.xy += vQ*7.02*max(1./11.3 - 1./lz, 0.);                                // far off the window holds a wide view, as a real opening is given
  float x = d.x, y = d.y + .14;                                            // the horizon lies a little below the middle of the window
  vec2 sp = vec2(x - .2, y - .22); float ds = length(sp);
  vec3 col = mix(vec3(.9, .56, .3), vec3(.05, .24, .7), 1. - exp(-max(y, 0.)*3.4));
  col = mix(col, vec3(1., .42, .4), .4*exp(-max(y, 0.)*10.));               // a rose band on the horizon
  float cy = max(y, .03);
  vec2 cuv = vec2(x/cy, 1./cy)*vec2(.55, .3) + vec2(uTime*.012, 0.);
  float cl = smoothstep(.48, .78, .62*vnz(cuv*2.) + .38*vnz(cuv*5.3 + 3.))*smoothstep(.04, .22, y)*(1. - smoothstep(1., 1.8, y));
  col = mix(col, mix(vec3(1.25, .86, .66), vec3(.62, .56, .76), smoothstep(.1, .7, y)), cl*.8);
  col += vec3(3., 2.1, 1.1)*exp(-ds*ds*190.) + vec3(.8, .42, .16)*exp(-ds*5.5)*.5;       // the sun and its glow
  float h1 = .05 + .1*vnz(vec2(x*2.6 + 4., 1.)) + .03*vnz(vec2(x*9., 2.));  // two ranges of far hills
  float h2 = .015 + .06*vnz(vec2(x*4.4 + 9., 5.));
  col = mix(col, vec3(.26, .27, .52), (1. - smoothstep(h1 - .006, h1 + .006, y))*.9);
  col = mix(col, vec3(.07, .13, .3), 1. - smoothstep(h2 - .006, h2 + .006, y));
  if (y < 0.) {                                                            // the sea, a path of glitter under the sun
    float dep = 1./max(-y, .012);
    vec3 sea = mix(vec3(.6, .4, .32), vec3(.015, .2, .34), smoothstep(0., .3, -y));
    float gl = pow(vnz(vec2(x*dep*5., dep*7. - uTime*.7)), 5.)*exp(-sp.x*sp.x/(.012 + .5*y*y));
    col = sea*(.85 + .3*vnz(vec2(x*dep*2., dep*3. + uTime*.3))) + vec3(2.4, 1.7, .9)*gl;
  }
  col *= 1. - .2*r*r;
  col += uRim*pow(r, 14.)*1.1;                                             // light inside the rim, like the opening's own
  gl_FragColor = vec4(col*uDim, 1.);
}`}));Ve.matrixAutoUpdate=!1,Ve.matrix.makeBasis(Fo,So,Po.clone().negate()).setPosition(K0.clone().addScaledVector(Po,-.12)),Ve.frustumCulled=!1,Ve.renderOrder=4,Ve.name="hoop-window",I.add(Ve),await M.yield();const Fa=Qe(ja,La,{uFlut:{value:9},uAmp:{value:1},uGain:{value:U?.9:1},uMoon:{value:new z.Color(...v(Z(M0[1]),.9))}},{side:z.DoubleSide}),pe=new z.Group;pe.name="our-kite",I.add(pe);const Re=new z.Group;pe.add(Re);const Se=new z.Group,Do=-.25;pe.add(Se);let _e=null,je=null;{const e=ft(),t=v(Z(M0[0]),.9),n=v(Z(M0[1]),.85),s=48,o=16,a=[0,kt,ee],i=w=>[Lo*w,kt+.08*Math.abs(w),ct+(ee-ct)*Math.abs(w)],p=w=>[Lo*w,kt+.08*Math.abs(w),ee+(Ra-ee)*(1-Math.abs(w))],c=(w,y)=>[w[0]+(a[0]-w[0])*y,w[1]+(a[1]-w[1])*y,w[2]+(a[2]-w[2])*y],h=(w,y,b=1)=>v(w,b*(1.06-.3*y*y)),g=(w,y,b,C,S,q,P,G,T,N,R,L)=>{e.tri(w,y,b,S,T,N,R,q,P),e.tri(w,b,C,S,T,R,L,P,G)},r=[0,.02,.055,.16,.42],l=[.012,.018,.024,.04,.06],u=[0,.3,.6,1.5,2.6],f=(w,y,b=1)=>[l[y],w*7+u[y],b];for(let w=0;w<s;w++){const y=-1+2*w/s,b=-1+2*(w+1)/s,C=i(y),S=i(b);for(let q=0;q<4;q++)g(c(C,r[q]),c(S,r[q]),c(S,r[q+1]),c(C,r[q+1]),h(t,y),h(t,b),h(t,b),h(t,y),f(y,q),f(b,q),f(b,q+1),f(y,q+1));e.tri(c(C,r[4]),c(S,r[4]),a,h(t,y,.92),f(y,4),f(b,4),[0,0,1],h(t,b,.92),v(t,.8))}for(let w=0;w<o;w++){const y=-1+2*w/o,b=-1+2*(w+1)/o,C=p(y),S=p(b);g(C,S,c(S,.45),c(C,.45),h(t,y),h(t,b),h(t,b),h(t,y),f(y,3),f(b,3),f(b,4),f(y,4)),e.tri(c(C,.45),c(S,.45),a,h(t,y,.92),f(y,4),f(b,4),[0,0,1],h(t,b,.92),v(t,.8))}const k=e.triangles*3;for(const w of[-1,1]){const y=i(w),b=28,C=Math.cos(.9),S=Math.sin(.9);let q=null;for(let P=0;P<=b;P++){const G=P/b,T=y[0]+w*(.12*G+.1*Math.sin(G*7)),N=y[2]+2.7*G,R=b0(.06,.035,G),L=[.03+.28*G,-G*12+w,.8],K=[[T-C*R,y[1]-S*R,N],[T+C*R,y[1]+S*R,N],L];q&&e.quad(q[0],q[1],K[1],K[0],v(Math.floor((P-1)/4)%2?n:t,.95),q[2],L),q=K}}const F=e.build();{const w=F.attributes.position,y=F.attributes.normal;for(let b=0;b<k;b++){const C=-.092*w.getX(b),S=Math.hypot(C,1);y.setXYZ(b,C/S,-1/S,0)}}const A=new z.Mesh(F,Fa);A.frustumCulled=!1,Re.add(A);const D=new z.BufferGeometry,B=12,x=[],d=[];for(let w=0;w<=B;w++)if(x.push(-1,0,-w/B,1,0,-w/B),w<B){const y=w*2;d.push(y,y+1,y+2,y+1,y+3,y+2)}D.setAttribute("position",new z.Float32BufferAttribute(x,3)),D.setIndex(d);const m=new z.ShaderMaterial({uniforms:{uPx:Q0.uPx,uTime:Q0.uTime,uCol:{value:new z.Color(1.25,.3,.68).multiplyScalar(U?.6:1)}},side:z.DoubleSide,fog:!1,vertexShader:`
uniform float uPx, uTime;
varying float vS; varying float vSide;
void main(){
  float s = -position.z;
  vec4 mv = modelViewMatrix*vec4(0., 0., position.z, 1.);
  vec3 T = normalize((modelViewMatrix*vec4(0., 0., -1., 0.)).xyz + vec3(0., 0., -1e-6));
  float dist = max(length(mv.xyz), 1e-3);
  vec3 sd = normalize(cross(T, mv.xyz) + vec3(1e-6, 0., 0.));
  mv.xyz += sd*position.x*max(.0024, .8*dist*uPx);
  mv.x += sin(uTime*27. + s*11.)*.0018*s;
  vS = dist; vSide = position.x;
  gl_Position = projectionMatrix*mv;
}`,fragmentShader:`
uniform vec3 uCol; uniform float uTime;
varying float vS; varying float vSide;
void main(){
  float g = pow(max(sin(vS*4.6 - uTime*2.3), 0.), 28.) + .5*pow(max(sin(vS*21. + uTime*3.1), 0.), 50.);
  gl_FragColor = vec4(uCol*(.7 + .3*(1. - abs(vSide))) + vec3(1., .96, .9)*g*2.4, 1.);
}`});_e=new z.Mesh(D,m),_e.frustumCulled=!1,_e.position.set(0,-.575,-.4),_e.rotation.x=-.0749,_e.scale.z=.02,Se.add(_e),Se.rotation.z=Do,je=new z.Mesh(D,m),je.frustumCulled=!1,pe.add(je)}await M.yield();const ve=new z.Group;ve.name="rival",ve.visible=!1,I.add(ve);{const e=[],t=[],n=[],s=[],o=(l,u,f,k,F=0,A=0,D=0)=>{const B=u[0]-l[0],x=u[1]-l[1],d=u[2]-l[2],m=f[0]-l[0],w=f[1]-l[1],y=f[2]-l[2];let b=x*y-d*w,C=d*m-B*y,S=B*w-x*m;const q=Math.hypot(b,C,S)||1;b/=q,C/=q,S/=q,S<0&&(b=-b,C=-C,S=-S);for(const[P,G]of[[l,F],[u,A],[f,D]])e.push(P[0],P[1],P[2]),t.push(b,C,S),n.push(P[0],P[1],k),s.push(G)},a=[0,1,0],i=[0,-1,0],p=[0,.18,.06],c=[.95,.2,-.2],h=[-.95,.2,-.2];o(a,h,p,0),o(h,i,p,0),o(a,p,c,0),o(p,i,c,0),o([0,-.82,0],[-.27,-1.3,0],[.27,-1.3,0],1);for(let l=0;l<6;l++){const u=l/6,f=(l+1)/6,k=-1.12-u*3.3,F=-1.12-f*3.3,A=.085-.04*u,D=.085-.04*f;o([-A,k,0],[A,k,0],[D,F,0],2,u,u,f),o([-A,k,0],[D,F,0],[-D,F,0],2,u,f,f)}const g=new z.BufferGeometry;g.setAttribute("position",new z.Float32BufferAttribute(e,3)),g.setAttribute("normal",new z.Float32BufferAttribute(t,3)),g.setAttribute("aUv",new z.Float32BufferAttribute(n,3)),g.setAttribute("aT",new z.Float32BufferAttribute(s,1));const r=new z.Mesh(g,Qe(Fn,Sn,{uC1:{value:new z.Color(U0[0])},uC2:{value:new z.Color(U0[1])}},{side:z.DoubleSide}));r.frustumCulled=!1,ve.add(r)}const Wt=16,Le=new Float32Array((Wt+1)*6),Ot=new z.BufferGeometry;{const e=[];for(let t=0;t<Wt;t++){const n=t*2;e.push(n,n+1,n+2,n+1,n+3,n+2)}Ot.setAttribute("position",new z.BufferAttribute(Le,3)),Ot.setIndex(e)}const st=new z.Mesh(Ot,new z.MeshBasicMaterial({color:new z.Color(1.05,1.02,.94).lerp(no,.4*U).multiplyScalar(b0(1,.6,U)),side:z.DoubleSide,transparent:!0,opacity:1,depthWrite:!1,fog:!1}));st.frustumCulled=!1,st.visible=!1,st.renderOrder=5,I.add(st),await M.yield();const B0=()=>new z.Vector3,Sa=B0(),Bo=B0(),Ut=B0(),qa=B0(),We=B0(),To=B0(),Eo=B0(),Go=B0(),Kt=B0(),wt=B0(),Xt=B0(),xt=B0(),qe=B0(),Io=B0(),bt=B0(),Oe=B0(),Pa=B0(),No=new z.Quaternion,Da=new z.Quaternion,Ba=B0(),Vo=B0(),hn=new z.Vector3(0,0,-1),Ta=new z.Vector3(-1.5,-1.9,.8);{const e=z0.frameAt(0,new z.Matrix4);Pa.setFromMatrixPosition(e),No.setFromRotationMatrix(e)}const it=e0-.15,pn=z0.length;let Mt=0;const Ea=new z.Vector2,Ro=e0-.085,rt=e0-.055,_o=(e,t,n)=>{if(e<.25)n.lerpVectors(Kt,xt,e/.25);else{const s=(e-.25)/.75;n.lerpVectors(xt,Xt,s),n.y-=36*s*(1-s)*(1-.5*t)}return n};function Ga(e,t,n,s){de.value=t,Q0.uTime.value=t,We.setFromMatrixPosition(n.matrixWorld),Q0.uCamP.value.copy(We),M.renderer.getDrawingBufferSize(Ea),Q0.uPx.value=2/(Math.max(n.projectionMatrix.elements[5],.05)*Math.max(Ea.y,1)),ne.setProgress(Ya(s)),ne.update(e,t,n),E.gust&&(ne.uniforms.uGust.value=Math.max(ne.uniforms.uGust.value,.85)),Q0.uSurge.value=p0(e0-.003,e0+.012,s)*(1-(i0?.45:1)*p0(e0+.06,e0+(i0?.4:.16),s));const o=p0(rt,rt+.012,s)*(s<e0?1:0),a=p0(e0,e0+.02,s)*(1-p0(Ge-.03,Ge+.03,s));{const h=p0(.014,.062,s),g=1-h;s>4e-4?(pe.position.copy(We),Da.setFromRotationMatrix(n.matrixWorld),pe.quaternion.copy(No).slerp(Da,p0(4e-4,.012,s))):(pe.position.copy(Pa),pe.quaternion.copy(No));const r=1.34/Math.max(n.projectionMatrix.elements[5],.05);Re.rotation.set(.98*g,Math.sin(t*1.7)*.03+o*Math.sin(t*31)*.012,Math.sin(t*1.3)*.022+a*Math.sin(t*2.1)*.075+o*Math.sin(t*37)*.007+g*Math.sin(t*.9)*.14),Ba.set(0,kt,ee).applyEuler(Re.rotation),Re.position.set(g*Math.sin(t*.7)*.3,b0(1.95,r,h)+Math.sin(t*1.9)*.012+g*Math.sin(t*1.1)*.12+o*Math.sin(t*43)*.008,b0(-6.4,ee,h)).sub(Ba),Vo.set(0,kt-.03,ee-.3).applyEuler(Re.rotation).add(Re.position).sub(Ta);const l=Vo.length();je.visible=h<.995,je.position.copy(Ta),je.quaternion.setFromUnitVectors(hn,Vo.multiplyScalar(1/Math.max(l,.001))),je.scale.z=l,_e.scale.z=b0(b0(.02,1.2,p0(.05,.08,s)),3.7,p0(Ro-.035,Ro+.005,s)),Fa.uniforms.uFlut.value=9+o*14+a*3;const u=De((s-e0)/.012);Se.visible=u<1,Se.rotation.x=-u*1.3,Se.position.y=-u*.7,Se.position.x=Math.sin(t*31)*.01*o}{const h=p0(oa-.12,oa,s),g=1-h;gt.position.set(b0(388,Rt.x,h)+Math.sin(t*.9)*1.4*g,b0(47,Rt.y,h)+Math.sin(t*1.3)*.7*g,b0(6,Rt.z,h)+Math.sin(t*.7+1)*3*g*(.3+h)),gt.rotation.set(.14+g*(.45+.3*Math.sin(t*1.1)),.7+g*Math.sin(t*.5)*1.2,-.42*h+g*.5*Math.sin(t*.8),"YXZ")}{const h=M.portalView&&M.portalView.live?1-p0(170,215,(1-s)*pn):0;Mt=e>0?Mt+Math.max(-e*1.6,Math.min(e*1.6,h-Mt)):h,Ve.visible=Mt<.999,Aa.uIris.value=Mt}const i=p0(it-.004,it+.012,s)*(1-p0(e0+.04,e0+.06,s)),p=i>.002;ve.visible=p,st.visible=p,st.material.opacity=1-p0(e0+.006,e0+.022,s),qo.object.visible=o>.01;const c=p0(it-.01,it+.01,s)*(1-p0(e0+.03,e0+.05,s));if(pt.uAFloor.value=Ha*(1-.5*c),pt.uBigA.value=Za*(1-.45*c),p){const h=p0(Ro,rt,s),g=p0(it,it+.035,s),r=g*(1-h),l=p0(e0,e0+.05,s),u=s>=rt&&s<e0?1:0;z0.pointAt(s,Sa),z0.tangentAt(s,Bo),Ut.set(Bo.x,0,Bo.z).normalize(),qa.set(-Ut.z,0,Ut.x),To.setFromMatrixColumn(n.matrixWorld,0),Eo.setFromMatrixColumn(n.matrixWorld,1),Go.setFromMatrixColumn(n.matrixWorld,2);const f=u*Math.sin(t*5.2),k=u*Math.sin(t*3.1);Kt.copy(We).addScaledVector(Go,-(b0(b0(30,17,g),15,h)+l*26)).addScaledVector(To,b0(b0(-40,-8,g),-3.5,h)+r*Math.sin(t*.8)*1.6+f*1.6-l*7).addScaledVector(Eo,b0(b0(18,2.6,g),-1.5,h)-h*(1-h)*6+r*Math.sin(t*1.3)*.8+k*.8+l*14),ve.position.copy(Kt),ve.lookAt(We),ve.rotateZ(f*.45+(1-g)*.7+r*(.2+.22*Math.sin(t*1.1))-l*Math.sin(t*2.4)*.5),ve.scale.setScalar(Math.max(i,.01)*2);const F=f*.3,A=-.8-.0748*F;wt.copy(We).addScaledVector(Eo,A*Math.cos(Do)).addScaledVector(Go,-3.4-.997*F).addScaledVector(To,-A*Math.sin(Do)+Se.position.x),Xt.copy(Sa).addScaledVector(Ut,-150).addScaledVector(qa,74),Xt.y=13.5;const D=p0(rt-.012,rt,s)*(1-l);xt.lerpVectors(Kt,Xt,.11),xt.y-=2,xt.lerp(wt,D);for(let B=0;B<=Wt;B++){const x=B/Wt;_o(x,D,qe),_o(Math.min(1,x+.02),D,Io),_o(Math.max(0,x-.02),D,bt),Io.sub(bt),bt.subVectors(We,qe);const d=bt.length();Oe.crossVectors(Io,bt).normalize().multiplyScalar(Math.max(.009,.0024*d)*i),Le[B*6]=qe.x-Oe.x,Le[B*6+1]=qe.y-Oe.y,Le[B*6+2]=qe.z-Oe.z,Le[B*6+3]=qe.x+Oe.x,Le[B*6+4]=qe.y+Oe.y,Le[B*6+5]=qe.z+Oe.z}if(Ot.attributes.position.needsUpdate=!0,o>.01)for(let B=0;B<8;B++){const x=t*(3+B*.7)+B*2.1,d=.06+.28*(x%1);qo.setPosition(B,wt.x+Math.sin(B*2.4+t)*d,wt.y-x%1*.35+Math.cos(B*1.7)*d*.4,wt.z+Math.cos(B*3.1+t)*d)}}Ne.update(e,t,n,s),he.update(e,t,n),xa.update(e,t,n),yo.update(e,t),mt.update(e,t,n),aa.update(e,t,null)}{const e=new z.PerspectiveCamera(62,M.aspect||1.78,.3,6e3);z0.pointAt(0,e.position),e.lookAt(60,16,4),e.updateMatrixWorld(),Ga(0,0,e,0)}return await M.yield(),await mt.prewarm(M.renderer,null,I),{scene:I,path:z0,duration:Dt,pace:e=>.75+.1*p0(Ee,Ee+.08,e)-.23*p0(vt-.04,vt+.02,e)+.73*p0(e0,e0+.07,e)+.1*p0(Ge-.04,Ge+.02,e)-.2*p0(Je,Je+.06,e)-.25*p0(.8,.9,e),title:E.title+(i0?": the Great Cut":""),ride:"none",beats:{climb:Ee,duel:vt,parakeets:e0-.075,cut:e0,skim:Ge,burst:ta,minarets:Je},camera:{fov:62,near:.3,far:6e3,lookAhead:22,sway:.8,bank:1.25},pois:[{at:[K0.x,K0.y,K0.z],from:0,to:Ee+.03,weight:.25,fade:.3},{at:[345,34,-24],from:Ee,to:Ee+.07,weight:.4,fade:.25},{at:[410,36,-175],from:Ee+.045,to:vt+.004,weight:.6,fade:.3},{at:[470,0,44],from:vt-.01,to:e0+.015,weight:.42,fade:.2},{at:[K0.x,K0.y*.7,K0.z],from:e0+.012,to:Ge,weight:.68,fade:.18},{at:[K0.x,K0.y,K0.z],from:Ge-.02,to:Je+.03,weight:.3,fade:.25}],portal:{shape:"circle",radius:7,color:E.portal,glow:1.15,tilt:!0,revealDistance:300,blendDistance:45},post:{exposure:E.exposure,bloom:{strength:U?.5:.3,radius:.6,threshold:.95},grade:{saturation:E.grade.saturation,contrast:1.05,tint:E.grade.tint,shadowTint:E.grade.shadowTint,vignette:.26,grain:.02,aberration:0}},update:Ga,dispose(){mt.dispose?.(),ne.dispose?.(),Yo.dispose(),Qo.dispose()}}}};export{In as default};
