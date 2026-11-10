import*as g from"three";import{clamp as Ct,lerp as It,smoothstep as W,makeRng as xe}from"../kit/core.js";const ye=860,j0=444,st=44,h0=.95,Te=1250,Ft=-14,Qt=22*Math.PI/180,$0=["#F1E7CF","#3A2A1D","#8C6B4A","#6F8A3C","#5F8F8E","#D8A531","#C6452B"],Yt=`
uniform vec3 uPaper, uInk, uHalf, uSun, uShade;
uniform vec2 uWash;
uniform float uTime, uFog, uResY;
float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
// Stable engraved lines on coordinate c. fw = fwidth(c) taken by the caller. Returns (ink, distance to
// the nearest line as 0..1 of half a period).
vec2 hatchL(float c, float fw, float base, float maxP, float tone, float lmin){
  fw = max(fw, 1e-6);
  float l = max(log2(max(6.0*fw/base, 1e-4)), lmin);
  float lo = floor(l), f = l - lo;
  float P = base*exp2(lo);
  float t = c/P;
  float k = floor(t+0.5);
  float dn = abs(t-k);
  float dpx = dn*P/fw;
  float w = mix(1.0, 1.0-f, step(0.5, mod(k, 2.0)));
  float hw = (0.3 + 0.85*tone)*w;
  float ink = (1.0 - smoothstep(hw-0.55, hw+0.55, dpx))*smoothstep(0.0, 0.25, w);
  float farK = smoothstep(maxP*0.5, maxP, P);
  return vec2(mix(ink, tone*0.5, farK), min(dn*2.0, 1.0));
}
vec2 hatch(float c, float fw, float base, float maxP, float tone){ return hatchL(c, fw, base, maxP, tone, -12.); }
// antialiased line of half-width hw px on coordinate c at c = 0
float lineAA(float c, float fw, float hw){ return 1.0 - smoothstep(hw-0.5, hw+0.5, abs(c)/max(fw,1e-6)); }
float seep(float dist, float lineD){
  float s = 1.0 - smoothstep(uWash.x, uWash.y, dist);
  return smoothstep(lineD*0.8, lineD*0.8+0.2, s*1.05);
}
vec3 plate(vec3 wash, float washA, float ink, float dist){
  vec3 inkc = mix(uInk, uHalf, smoothstep(150., 700., dist));
  vec3 c = uPaper*mix(vec3(1.), wash, clamp(washA,0.,1.));
  return mix(c, inkc, clamp(ink,0.,1.));
}
`,Zt=`#include <fog_pars_vertex>
`,_t=`#include <fog_pars_fragment>
`,jt=`
  gl_FragColor = vec4(col, 1.0);
  vec3 preFog = gl_FragColor.rgb;
  #include <fog_fragment>
  gl_FragColor.rgb = mix(preFog, gl_FragColor.rgb, uFog);
`,Xt=t=>new g.Color(t),E=(t,e)=>new g.Color(1,1,1).lerp(t,e);function O0(t,e){const o=(t.palette&&t.palette.length>=7?t.palette:$0).map(Xt);let l=o[0].clone(),d=o[1].clone(),p=o[2].clone(),y=[.56,.62,.55];t.ink==="sanguine"?(l=Xt("#EBD9B4"),d=Xt("#7A2E1E"),p=Xt("#B0705A"),y=[-.56,.5,.66]):t.ink==="blueblack"&&(l=Xt("#E9E6D8"),d=Xt("#1C2634"),p=Xt("#66758A"),y=[.78,.3,.55]),t.sun&&(y=t.sun);const c=.82/Math.max(l.r,l.g,l.b);return l.multiplyScalar(Math.min(1,c)),{pal:o,paper:l,ink:d,half:p,sun:new g.Vector3(y[0],y[1],y[2]).normalize(),green:E(o[3],.78),verd:E(o[4],.6),gamb:E(o[5],.8),verm:E(o[6],.92),olive:E(o[3].clone().lerp(o[5],.45),.7),ash:E(o[2],.35),rngTint:e.range(-.04,.04)}}function H0(t,e={}){const o=e.wash||[45,150];return{uPaper:{value:t.paper},uInk:{value:t.ink},uHalf:{value:t.half},uSun:{value:t.sun},uShade:{value:t.verd},uWash:{value:new g.Vector2(o[0],o[1])},uTime:{value:0},uFog:{value:e.fog??.12},uResY:{value:900}}}function Nt(t,e,o,l,d={}){return new g.ShaderMaterial({uniforms:{...g.UniformsUtils.clone(g.UniformsLib.fog),...t,...e},vertexShader:o,fragmentShader:l,fog:!0,side:d.side??g.FrontSide,vertexColors:!!d.vertexColors})}function Q0(t,e){const o=Math.exp(-h0),l=s=>(Math.exp(-h0*s/ye)-o)/(1-o),d=l(st),p=Math.tan(Qt),y=s=>440-(Math.max(s,st-12)-st)*p;function c(s,i){const r=Math.hypot(s,i),a=Math.atan2(i,Math.max(-s,.001)),h=l(Math.max(r,st))/d;let f=j0*.5*(h+Math.sqrt(h*h+9e-4))+1.2*W(ye*.7,ye*1.1,r);const m=W(70,220,r)*(1-W(620,900,r)),u=1-.88*Math.exp(-(s*s)/1800)*W(105,150,r)*(1-W(335,390,r));f+=m*u*(15*t.fbm2(a*e.gul+e.o1,r*.0035,3)+5*t.n2(a*e.gul*3.3,r*.011+e.o2)),f+=7*u*W(260,120,r)*W(st-6,st+30,r)*Math.max(0,t.n2(a*9+e.o2,r*.02)),f+=W(600,900,r)*3.5*t.fbm2(s*.006+e.o1,i*.006,3),f+=7*Math.exp(-(s*s)/900)*W(st+30,160,r)*(1-W(700,860,r));const x=6*t.n2(a*2.6+e.o1,3.7)*Math.exp(-((r-st)*(r-st))/500);if(f+=x,r<st){const w=r/st;f-=46*(1-w*w)*(1-.35*w*w)-3*t.n2(s*.08,i*.08)}for(let w=0;w<2;w++){const A=w?Ft-12.5:Ft+12,M=st+(w?-1:2),z=(s-A)*(s-A)+(i-M)*(i-M)*.55;f+=(w?e.horn1:e.horn0)*1.55*Math.exp(-z/46)+6*Math.exp(-z/190)}if(i>0&&i<130){const w=1-W(6.5,10.5,Math.abs(s-Ft)),A=y(i)-8.2+.6*t.n2(s*.3,i*.3);w>0&&f>A&&(f=It(f,A,w))}return f}return{heightAt:c,lineY:y}}function Y0(t,e,o,l){const d=Math.hypot(t,e);if(t>=0||d<40||d>o+10)return 1e9;const p=.56+.836*W(44,230,d)+.035*Math.sin(d*.043+1)+.015*Math.sin(d*.117),y=(3.2+2.6*W(60,260,d)+1.2*Math.sin(d*.05+2))*l*Math.sqrt(Ct((o-d)/40,0,1));return Math.abs(Math.atan2(e,Math.max(-t,.001))-p)*d-y}function Z0(t,e){const o=6.2831853;return(l,d)=>{const p=Math.hypot(l,d),y=Math.atan2(d,Math.max(-l,.001)),c=1.5707963-Math.abs(y),s=Math.exp(-c/.3),i=31*y+15.9*Math.sign(y)*(s-.00532)+.8*Math.sin(y*5.3+t.y)+t.x,r=31+53*s+4.24*Math.cos(y*5.3+t.y),a=Math.floor(i/o+.5),h=(i-o*a)/r*p,f=.5+.5*Math.sin(a*2.399963+t.z),m=.5+.5*Math.sin(a*4.118+t.w),u=Math.sin(p*.085+o*m)-It(-2,.15,W(.35,.8,c)),x=e.heightAt(l,d),w=(l+2)*(l+2)+(d-46)*(d-46),A=(l+26.5)*(l+26.5)+(d-43)*(d-43),M=d>0?1-(1-W(66,74,d))*(1-W(6,8.5,Math.abs(l+14))):1,z=W(0,2.5,x-360-24*f)*W(0,.2,u)*(p>=52?1:0)*W(120,200,Math.min(w,A))*M*(l<-.05?1:0);return{k:a,dl:h,on:z,hw:Math.min(2.1+1.5*m,1.9*p/r),v1:f,v2:m,qd:r,r:p,ang:y,h:x}}}const X0=`
attribute vec3 aTone;
varying vec3 vPos; varying vec3 vNrm; varying float vDist; varying vec3 vTone;
${Zt}
void main(){
  vPos = position; vNrm = normal; vTone = aTone;
  vec4 mvPosition = modelViewMatrix*vec4(position,1.);
  vDist = length(mvPosition.xyz);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,J0=`
varying vec3 vPos; varying vec3 vNrm; varying float vDist; varying vec3 vTone;
uniform vec3 uGreen, uOlive, uAsh, uGamb, uVerm; uniform float uAshFall, uSnowDrop; uniform vec4 uFlow;     // uFlow: end radius, on, width, -
uniform vec4 uRib;                // the rock ribs' seeded phases (see ribField below)
${Yt}
${_t}
void main(){
  vec3 n = normalize(vNrm + vec3(0., 1e-4, 0.));
  float r = length(vPos.xz);
  float h = vPos.y;
  float ang = atan(vPos.z, max(abs(vPos.x), 1e-3));
  // (round 12) derivatives that cannot jump from one triangle of the ground to the next: the lens's own ray through this
  // pixel and its neighbours (the same whatever it lands on), carried onto the ground's smooth normal. dPx and dPy are the
  // metres of ground between this pixel and the next across and down. They take the place of fwidth() within 110 m of the
  // horns (kS below), where the hatch period used to change at every edge of the mesh and showed it as a seam.
  vec3 Vd = normalize(vPos - cameraPosition + vec3(0., 1e-5, 0.));
  vec3 dVx = dFdx(Vd), dVy = dFdy(Vd);
  float nV = dot(n, Vd); nV = nV < 0. ? min(nV, -0.12) : max(nV, 0.12);
  vec3 dPx = vDist*(dVx - Vd*(dot(n, dVx)/nV)), dPy = vDist*(dVy - Vd*(dot(n, dVy)/nV));
  // ---- the lava stream (round 4): out of a breach in the lip west of the notch and down the south flank beside the seam.
  // It is drawn as the print draws fire: a vermilion wash over a gamboge thread, a firm outline, dark crossed levees.
  // dFl: metres across the stream; dE: metres outside its edge. The same curve is flowEdge() in the code below.
  float aF = 0.56 + 0.836*smoothstep(44., 230., r) + 0.035*sin(r*0.043 + 1.) + 0.015*sin(r*0.117);
  float dFl = (ang - aF)*r;
  float fdF = max(fwidth(dFl), 1e-4);
  float wF = (3.2 + 2.6*smoothstep(60., 260., r) + 1.2*sin(r*0.05 + 2.))*uFlow.z*sqrt(clamp((uFlow.x - r)/40., 0., 1.));
  float wE = max(wF, 2.4*fdF*step(r, uFlow.x - 6.));                 // never under five pixels wide, however far off
  float onF = step(40., r)*step(r, uFlow.x)*step(vPos.x, 0.)*uFlow.y;
  float dE = abs(dFl) - wE;
  float inF = (1. - smoothstep(-0.5*fdF, 0.5*fdF, dE))*onF;
  float zn = (vnoise(vPos.xz*0.02) - 0.5)*26. + (vnoise(vPos.xz*0.11) - 0.5)*8.;
  float hz = h + zn;
  float hs = hz + uSnowDrop*(0.6 + 0.8*vnoise(vPos.xz*0.035 + 4.));
  float forest = 1. - smoothstep(175., 200., hz);
  float paramo = smoothstep(175., 200., hz)*(1. - smoothstep(300., 322., hz));
  float arenal = smoothstep(300., 322., hz)*(1. - smoothstep(368., 388., hs));
  float snow = smoothstep(368., 388., hs)*smoothstep(0.35, 0.6, n.y + 0.25*vnoise(vPos.xz*0.07));
  // (round 11) rock ribs break through the snow down the fall line: the mountain's own rock, by a rule of the ground that
  // is the same on every side of the cone. A rib's line is a fall line (q = 2 pi k, closer together toward the two seams,
  // where the crest is); it stands from its own foot (360 to 384 m up) to the lip, unbroken near the seams and in lengths
  // further round; its rock lies a little to windward of the line and the snow drifts against its lee. ribField() in the
  // code below is the same rule, and the rib bodies of the world stand on it.
  float sA = 1.5707963 - abs(ang);
  float eS = exp(-sA/0.3);
  float rq0 = 31.*ang + 15.9*sign(ang)*(eS - 0.00532) + 0.8*sin(ang*5.3 + uRib.y) + uRib.x;
  float rqd = 31. + 53.*eS + 4.24*cos(ang*5.3 + uRib.y);
  float rk = floor(rq0/6.2831853 + 0.5);
  float rdl = (rq0 - 6.2831853*rk)/rqd*r;                              // metres across the fall line, positive to windward
  float rv1 = 0.5 + 0.5*sin(rk*2.399963 + uRib.z), rv2 = 0.5 + 0.5*sin(rk*4.118 + uRib.w);
  float rseg = sin(r*0.085 + 6.2831853*rv2) - mix(-2., 0.15, smoothstep(0.35, 0.8, sA));
  float rhw = min(2.1 + 1.5*rv2, 1.9*r/rqd);
  vec2 hn0 = vPos.xz - vec2(-2., 46.), hn1 = vPos.xz - vec2(-26.5, 43.);
  float hornD = min(dot(hn0, hn0), dot(hn1, hn1));                     // metres squared from the nearer horn's top, on the map
  float offHorn = smoothstep(120., 200., hornD);
  float kS = 1. - smoothstep(12100., 22500., hornD);                   // 1 within 110 m of the horns, 0 beyond 150 m
  float hornZ = 1. - smoothstep(480., 760., hornD);                    // a horn's own body: within 22 to 27 m of its top
  float offNotch = 1. - step(0., vPos.z)*(1. - smoothstep(66., 74., vPos.z))*(1. - smoothstep(6., 8.5, abs(vPos.x + 14.)));     // the floor of the notch itself stays snow
  // (its edge is ragged and its width uneven, as rock breaks; the bodies of the world stand on its middle)
  float rdlN = rdl - 0.8 + (vnoise(vPos.xz*0.3 + 9.) - 0.5)*1.5;
  float rhwN = rhw*(0.82 + 0.4*vnoise(vec2(r*0.09, rk*3.7)));
  float fdl = clamp(fwidth(rdlN), 1e-4, 0.5*rhwN);
  float rib = (1. - smoothstep(rhwN - 0.5*fdl, rhwN + 0.5*fdl, abs(rdlN)))*smoothstep(0., 2.5, h - 360. - 24.*rv1)*smoothstep(0., 0.2, rseg)
    *step(52., r)*offHorn*offNotch*step(vPos.x, -0.05);
  // the two horns of the notch are snow horns: snow lies on their steep faces too, within 18 to 30 m of each top
  snow = max(snow, (1. - smoothstep(330., 900., hornD))*smoothstep(368., 388., hs));
  snow *= 1. - rib;
  arenal *= 1. - rib;
  snow *= 1. - (1. - smoothstep(3., 15., dE))*onF;                    // no snow lies beside the stream
  float plain = smoothstep(830., 900., r);
  float ndl = clamp(dot(n, uSun), 0., 1.);
  // (round 12) the two horns of the notch are a light horn and a shaded horn: the one that stands on the far side of the
  // notch from the sun shows us the faces the sun is on, the one on the sun's side the faces turned from it. hornE: +1 on
  // the east horn's body, -1 on the west horn's.
  float hornE = dot(hn0, hn0) < dot(hn1, hn1) ? 1. : -1.;
  ndl = clamp(ndl - 0.3*hornE*(uSun.x < 0. ? -1. : 1.)*hornZ, 0., 1.);
  float shade = 1. - smoothstep(0.25, 0.85, ndl);
  // (round 12) tone is line on the forest ground as on the rest of the mountain, near and far: bare paper and a firm
  // contour where a fold of the ground faces the sun, contour and fall-line hachures where it turns from it, and the
  // hachures joined into lines that cross the contours in the hollows and under the densest stands (vTone, from the
  // ground itself and from where the crowns stand). The green wash lies over the lines as it did. The numbers are the
  // steps of the scale below: 0.3 is where the contour is whole and no hachure has begun (lA, lB), 0.62 where the
  // hachures are whole, 0.82 where they are nearly joined.
  float hol = clamp(vTone.x, 0., 1.), stand = clamp(vTone.y, 0., 1.), turned = clamp(vTone.z, 0., 1.);
  float forestK = forest*(1. - plain);
  float base = forest*0.12 + paramo*0.3 + arenal*0.1;
  base = mix(base, 0.2, plain);
  float rock = max((1.-snow)*smoothstep(368., 388., hz), rib);
  float tuft = paramo + 0.6*forest;                   // grass still stands through fresh snow
  forest *= 1. - snow; paramo *= 1. - snow;
  // (on a horn's snow the shade runs the whole scale: paper in the light, contours, hachures, and crossed lines in the lee)
  float tone = clamp(base + rock*0.3 + rib*0.3 + shade*(1. - forestK)*(0.46 - 0.08*snow - 0.14*rock - 0.1*paramo - 0.06*arenal + 0.04*forest + 0.5*snow*hornZ)
    + forestK*(1. - snow)*(0.18 + 0.32*turned + 0.52*max(hol, stand)), 0., 0.88);
  // (round 11) the arenal is pale ash, the palest ground of the mountain bar the snow: a faint contour rule and stipple, no hatching
  tone = mix(tone, min(tone, 0.15 + 0.1*shade), arenal);
  // burr: a fixed low-frequency wobble of the coordinates
  float burr = vnoise(vPos.xz*0.045) - 0.5;
  float cA = h + burr*2.2;
  float axS = max(abs(vPos.x), 1e-3), sgX = vPos.x < 0. ? -1. : 1.;
  float fa = mix(fwidth(ang), (abs(axS*dPx.z - vPos.z*sgX*dPx.x) + abs(axS*dPy.z - vPos.z*sgX*dPy.x))/max(axS*axS + vPos.z*vPos.z, 1.), kS);
  float rq = exp2(floor(log2(max(r, 4.))*1.5)/1.5);
  float band = floor(log2(max(r, 4.))*1.5);
  float cB = ang*rq + band*1.7 + burr*1.5;
  float fB = fa*rq;
  float cC = (vPos.x + vPos.z)*0.7071 + h*0.9 + burr*2.;
  float fwA = mix(fwidth(h), abs(dPx.y) + abs(dPy.y), kS);
  float fwC = mix(fwidth((vPos.x + vPos.z)*0.7071 + h*0.9), abs(dot(dPx, vec3(0.7071, 0.9, 0.7071))) + abs(dot(dPy, vec3(0.7071, 0.9, 0.7071))), kS);
  // where the fourth density is the fall line crossing the contour and not a third direction: the forest, the horns' snow
  float crossK = max(forest*(1. - plain), snow*hornZ);
  float joined = crossK*smoothstep(0.7, 0.86, tone);
  vec2 hA = hatch(cA, fwA, 2.5, 220., tone);
  // (on the forest ground the crossing lines are finer and closer than the contours they cross, and stay in lengths:
  // a second, lighter set over the first, as the engraver lays it, not a net of equal lines)
  vec2 hB = hatch(cB, fB*(1. - 0.4*joined*forestK), 1.6, 150., tone*(0.55 + 0.3*joined*(1. - forestK)));
  vec2 hC = hatch(cC, fwC, 2.0, 150., tone);
  // a horn's hachures run down the horn's own fall lines, round its own top. The coordinate is the bearing round the top
  // in 256ths of a turn and the base period is one of them, so every period the hatch can pick divides the turn and the
  // lines meet themselves where the bearing wraps.
  vec2 hv = hornE > 0. ? hn0 : hn1;
  float angH = atan(hv.y, hv.x + (abs(hv.x) + abs(hv.y) < 1e-4 ? 1e-4 : 0.));
  float faH = (abs(hv.x*dPx.z - hv.y*dPx.x) + abs(hv.x*dPy.z - hv.y*dPy.x))/max(dot(hv, hv), 0.04);
  float cBh = angH*40.743665;
  vec2 hBh = hatch(cBh, faH*40.743665, 1., 1e9, tone*(0.55 + 0.3*joined));
  float brkH = smoothstep(0.42, 0.56, vnoise(vec2(cBh*0.9 + 3.1, h*0.35)));
  // far away the contours give way to fall-line hachures, as on a hachure map
  // (round 12: not on the forest ground, which keeps its four densities far off too; there the hatch itself thins to a
  // half-tone where its lines would be closer than the print can hold)
  float farA = smoothstep(5., 30., 6.*max(fwA, 1e-6))*(1. - forestK);
  float lA = smoothstep(0.1, 0.3, tone)*(1. - 0.72*farA);
  float lB = smoothstep(0.42 - 0.3*farA, 0.62 - 0.3*farA, tone), lC = smoothstep(0.72, 0.9, tone)*(0.65 - 0.3*forest)*(1. - crossK);
  // the spine of the knife crest stays pale (contours only): the herd runs along it and must read against it
  float spine = exp(-vPos.x*vPos.x/240.)*(1. - plain)*smoothstep(150., 200., hz);
  lB *= 1. - 0.9*spine; lC *= 1. - spine;
  // hachures are short strokes: break them along the fall line at the scale of the line period
  float ocB = log2(max(6.0*max(fB, 1e-6)/1.6, 1e-4));
  float loB = floor(ocB), fBk = ocB - loB, PB = 1.6*exp2(loB);
  float brk0 = smoothstep(0.45, 0.6, vnoise(vec2(cB/PB*0.7 + 3.1, h/(PB*6.))));
  float brk1 = smoothstep(0.45, 0.6, vnoise(vec2(cB/PB*0.35 + 3.1, h/(PB*12.))));
  float brk = mix(brk0, brk1, fBk);
  brk = mix(brk, 1., joined*(1. - 0.35*forestK));                      // in the deepest shade the strokes join into lines
  float hachB = mix(hB.x*brk, hBh.x*mix(brkH, 1., joined), hornZ);
  float steep = 1. - plain*(1. - smoothstep(0.03, 0.12, 1. - n.y));
  float cP = vPos.z + burr*5.;
  vec2 hP = hatch(cP, fwidth(vPos.z), 3.0, 200., 0.25);
  float pbrk = smoothstep(0.45, 0.6, vnoise(vec2(vPos.x*0.05, cP*0.33)));
  float ink = 1. - (1. - hA.x*lA*steep)*(1. - hachB*lB*steep)*(1. - hC.x*lC*steep*0.8);
  float inkRock = max(hA.x*lA, hatch(cA, fwA*0.55, 2.5, 220., min(tone*1.4, 1.)).x*smoothstep(0.3, 0.75, shade));
  ink *= 1. - 0.4*arenal;
  ink = mix(ink, inkRock*steep, rock);
  ink = mix(ink, max(ink, hC.x*0.85), rib);                           // a rib's own ground is crossed: dark rock in the snow
  ink = max(ink, hP.x*pbrk*(1. - steep)*0.8);
  // near detail that fades to nothing with distance: tussock ticks, ash stipple, sastrugi strokes
  float pxm = max(mix(max(fwidth(vPos.x), fwidth(vPos.z)), max(abs(dPx.x) + abs(dPy.x), abs(dPx.z) + abs(dPy.z)), kS), 1e-5);
  float nearK = 1. - smoothstep(0.08, 0.3, pxm);
  float tick = hatch(cB, fB, 0.7, 1e9, 0.25).x*step(0.5, vnoise(vec2(cB*1.6, h*1.9)))*step(0.35, vnoise(vPos.xz*0.6));
  vec2 dg = vec2(cB, h*1.6)/0.45; vec2 di = floor(dg);
  float dd = length(fract(dg) - 0.5 - 0.35*(vec2(h21(di), h21(di + 3.)) - 0.5));
  float stip = (1. - smoothstep(0.1, 0.2, dd))*step(0.45, h21(di + 9.));
  // (round 12) on the rare visit the ash lies on the snow as stipple, thicker to leeward (the wind goes west-north-west,
  // as the spindrift does) and in the lee of every rib, never as a hatch or a flat grey: three sizes of the same stipple,
  // each fixed to the ground, hand over to one another with distance. ashD: the share of its cells that carry a dot.
  float lee = smoothstep(-0.1, 0.45, dot(n.xz, vec2(-0.82, -0.57)));
  float ashD = uAshFall*snow*clamp(0.28 + 0.55*lee + 0.3*(1. - smoothstep(0.5, 7., -rdlN))*step(rdlN, 0.)*smoothstep(0., 2.5, h - 360. - 24.*rv1), 0., 0.92);
  float stipA = (1. - smoothstep(0.1, 0.2, dd))*step(h21(di + 9.), ashD);
  float cW = vPos.x*0.8 - vPos.z*0.6 + burr*3.;
  float fwW = mix(fwidth(vPos.x*0.8 - vPos.z*0.6), abs(dPx.x*0.8 - dPx.z*0.6) + abs(dPy.x*0.8 - dPy.z*0.6), kS);
  float sast = hatch(cW, fwW, 1.3, 1e9, 0.12).x*step(0.5, vnoise(vec2(cW*0.9, (vPos.x*0.6 + vPos.z*0.8)*0.12)));
  ink = max(ink, nearK*steep*max(max(tick*tuft*(1. - 0.3*snow)*0.85, max(stip*arenal, stipA)*0.8), sast*snow*0.75));
  // (round 11) further off the ash keeps a coarser stipple, fixed to the ground like the first
  vec2 dg2 = vec2(cB, h*1.6)/1.7; vec2 di2 = floor(dg2);
  float dd2 = length(fract(dg2) - 0.5 - 0.4*(vec2(h21(di2 + 5.), h21(di2 + 8.)) - 0.5));
  float stip2 = (1. - smoothstep(0.1, 0.17, dd2))*step(0.3, h21(di2 + 2.));
  float stip2A = (1. - smoothstep(0.1, 0.17, dd2))*step(h21(di2 + 2.), ashD);
  ink = max(ink, max(stip2*arenal, stip2A)*0.62*smoothstep(0.07, 0.22, pxm)*(1. - smoothstep(0.35, 1.1, pxm)));
  vec2 dg3 = vec2(cB, h*1.6)/6.5; vec2 di3 = floor(dg3);
  float dd3 = length(fract(dg3) - 0.5 - 0.4*(vec2(h21(di3 + 4.), h21(di3 + 7.)) - 0.5));
  ink = max(ink, (1. - smoothstep(0.1, 0.17, dd3))*step(h21(di3 + 1.), ashD)*0.55*smoothstep(0.35, 1.0, pxm)*(1. - smoothstep(2.2, 5., pxm)));
  // snow: a few firm form lines even in light (every other contour, in lengths that begin and end on a firm edge)
  float sn7 = vnoise(vPos.xz*0.05 + 7.), fs7 = clamp(fwidth(sn7), 1e-4, 0.08);
  ink = max(ink, snow*hatch(cA, fwA, 5., 220., 0.34).x*0.8*smoothstep(0.6 - fs7, 0.6 + fs7, sn7));
  // the stream: levees in close crossed lines, a firm edge, crust drifting down on the wash, flow lines with travelling dashes
  float lev = (1. - smoothstep(max(2.2, 1.5*fdF), max(4.5, 3.*fdF), dE))*step(0., dE)*onF;
  float levInk = 1. - (1. - hatch(cA, fwA, 1.2, 220., 0.9).x)*(1. - hatch(cC, fwC, 1.0, 150., 0.8).x);
  ink = max(ink*(1. - inF), max(lev*levInk, lineAA(dE, fdF, 1.4)*onF));
  float tF = r - uTime*2.4;
  float crN = vnoise(vec2(dFl*0.3, tF*0.1)) + 0.35*vnoise(vec2(dFl*0.9 + 4., tF*0.33));
  // (every boundary in the stream is a drawn edge one pixel soft: flat washes laid side by side, the rafts of crust in crossed lines)
  float crW = clamp(fwidth(crN), 1e-4, 0.02);
  float crust = smoothstep(0.82 - crW, 0.82 + crW, crN)*inF;
  float crEdge = lineAA(crN - 0.82, crW, 1.1)*inF*(1. - smoothstep(0.25, 0.6, fdF));
  float fkF = floor(dFl/0.9 + 0.5);
  float fline = lineAA((dFl/0.9 - fkF)*0.9, fdF, 0.55)*step(0.45, fract(tF/(6. + 3.*h11(fkF)) + h11(fkF + 3.)))*inF*(1. - smoothstep(0.15, 0.45, fdF));
  ink = max(ink, max(crust*levInk*0.9, max(crEdge*0.8, fline*0.5*(1. - crust))));
  float coA = abs(dFl) + 0.7*(vnoise(vec2(dFl*0.5, tF*0.2)) - 0.5) - 0.4*wE, coW = clamp(fwidth(coA), 1e-4, 0.12);
  float coreF = (1. - smoothstep(-coW, coW, coA))*inF*(1. - crust);
  float bkA = dE + 2.6*vnoise(vPos.xz*0.21) - 5.2, bkW = clamp(fwidth(bkA), 1e-4, 0.2);
  float vermA = max(inF*(1. - 0.72*crust), (1. - smoothstep(-bkW, bkW, bkA))*step(0., dE)*onF*0.3);   // the baked ground beside it takes a thin red wash
  float gambA = coreF*(0.74 + 0.26*step(0.2, sin(r*0.6 - uTime*2. + 2.*vnoise(vec2(dFl*0.4, r*0.1)))));
  // (round 12) no soft-edged tone on the snow: the shade on snow and summit rock is two flat washes, each ending on a firm
  // edge one pixel wide, and the shadow patches of the open snowfields are flat with firm edges (none on the horns)
  float fsh = clamp(fwidth(shade), 1e-4, 0.15);
  float shadeQ = 0.5*smoothstep(0.3 - fsh, 0.3 + fsh, shade) + 0.42*smoothstep(0.72 - fsh, 0.72 + fsh, shade);
  float pn = vnoise(vPos.xz*0.09 + 2.), fpn = clamp(fwidth(pn), 1e-4, 0.08);
  float shPatch = 0.34*smoothstep(0.56 - fpn, 0.56 + fpn, pn)*snow*(1. - hornZ);
  vec3 wash = forest*mix(vec3(1.), uGreen, 0.78) + paramo*uOlive + arenal*mix(vec3(1.), uAsh, 0.6) + (snow + rock)*mix(vec3(1.), uShade*mix(vec3(1.), uShade, 0.6), max(shadeQ, shPatch));
  wash = mix(wash, uShade, shade*0.35*(1. - snow)*(1. - 0.5*arenal));
  wash = mix(wash, mix(vec3(1.), uHalf/max(uPaper, vec3(0.05)), 0.5)*mix(vec3(1.), uShade, 0.5*shade), rib);
  float lineD = min(hA.y, mix(1., hB.y, lB));
  float wa = seep(vDist, fract(lineD + 0.2));
  // far off the zones keep a thin flat tint (the second plate), cooled toward verditer
  float farT = smoothstep(uWash.x, uWash.y*1.2, vDist)*(1. - plain);
  wash = mix(wash, mix(wash, uShade, 0.45), farT);
  wa = max(wa, 0.5*farT*(1. - snow));
  // (round 12: falling ash is the stipple above; it lays no hatch and no grey wash)
  vec3 pc = uPaper*mix(vec3(1.), wash, clamp(wa, 0., 1.));
  pc = mix(pc, uVerm*vec3(1.3, 1.5, 1.2), clamp(vermA, 0., 1.));
  pc = mix(pc, uGamb*vec3(1.25, 1.3, 1.0), clamp(gambA, 0., 1.));
  vec3 col = mix(pc, mix(uInk, uHalf, smoothstep(150., 700., vDist)), clamp(ink, 0., 1.));
  ${jt}
}`,c0=`
attribute float aTop;
varying vec3 vPos; varying float vTop; varying float vDist;
${Zt}
void main(){
  vPos = position; vTop = aTop;
  vec4 mvPosition = modelViewMatrix*vec4(position,1.);
  vDist = length(mvPosition.xyz);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,je=`
// pen script in letter units: row pitch 1.4, letter body 0.3 high, a slanted hand of arches, cups and
// minims with the odd ascender and descender. fxs, fys = units per pixel.
float script(vec2 q, float fxs, float fys){
  float row = floor(q.y/1.4); float yy = q.y - row*1.4;
  float xs = q.x - (yy - 0.6)*0.35;
  float wi = floor(xs/3.4); float wf = xs - wi*3.4;
  float hw = h21(vec2(wi, row));
  float on = step(0.12, wf)*step(wf, 3.4*(0.5 + 0.48*hw))*step(0.16, hw);
  on *= step(0.34, h21(vec2(floor(q.x/38.), row*1.7 + 3.)));
  float lf = fract(xs/0.42);
  float lh = h21(vec2(floor(xs/0.42), row*3.1 + 0.7));
  float arch = sin(3.14159*lf);
  float c = lh < 0.5 ? 0.5 + 0.3*arch : 0.8 - 0.3*arch;
  float ink = lineAA(yy - c, fys*(1. + 1.8*abs(cos(3.14159*lf))), 0.55);
  float bx = (0.5 - abs(lf - 0.5))*0.42;
  float top = lh > 0.78 ? 1.25 : 0.82, bot = lh < 0.12 ? 0.08 : 0.48;
  float minim = lineAA(bx, fxs, 0.55)*step(bot, yy)*step(yy, top);
  float fine = max(ink*step(0.4, yy)*step(yy, 0.9), minim);
  float lod = smoothstep(0.07, 0.2, max(fys, fxs*0.6));
  float band = step(0.48, yy)*step(yy, 0.84)*0.3;
  return mix(fine, band, lod)*on*(1. - smoothstep(0.4, 0.9, fys));
}
float fibre(vec2 p, float px){
  float a = 1. - smoothstep(0.04, 0.3, px);
  return 0.05*(vnoise(p*0.021) - 0.5) + 0.03*(vnoise(p*0.4 + 9.) - 0.5)*(1. - smoothstep(0.5, 3., px))
       + a*0.09*(vnoise(p*vec2(2.2, 26.)) - 0.5) + a*0.05*(vnoise(p*vec2(31., 3.)) - 0.5);
}
// foxing: brown age spots, (amount)
float foxing(vec2 p){
  vec2 g = p/41.; vec2 id = floor(g); vec2 f = fract(g);
  float hh = h21(id + 17.);
  vec2 c = vec2(h21(id), h21(id + 5.3))*0.7 + 0.15;
  float rad = (0.012 + 0.05*hh*hh);
  float d = length(f - c);
  float halo = 1. - smoothstep(rad*0.2, rad*2.4, d + 0.01*vnoise(p*0.9));
  return step(0.45, hh)*(0.5*halo + 0.5*(1. - smoothstep(rad*0.3, rad, d)));
}
`,we=11,p0=6,to=`
varying vec3 vPos; varying float vTop; varying float vDist;
uniform vec4 uBox[${we}]; uniform vec4 uFall[3]; uniform vec4 uShadow[2]; uniform vec4 uDyke[3]; uniform vec4 uLedge;
uniform vec4 uCave[${p0}]; uniform vec4 uLava;        // uCave: centre, radii (ry < 0: a pale burrow chamber); uLava: x at y = 0, lean, half width, lava level
uniform float uConduit, uLip, uPageTone; uniform vec3 uVerm; uniform vec3 uFlower; uniform vec3 uSoil; uniform vec3 uGambP;
${Yt}
${je}
${_t}
float dotGrid(vec2 g, float dens){
  vec2 i = floor(g); vec2 c = fract(g) - 0.5 - 0.5*(vec2(h21(i), h21(i + 3.)) - 0.5);
  return (1. - smoothstep(0.14, 0.24, length(c)))*step(h21(i + 9.), dens);
}
void main(){
  vec2 p = vec2(-vPos.z, vPos.y);
  float depth = vTop - p.y;
  vec2 fw2 = fwidth(p);
  float fx = max(fw2.x, 1e-5), fy = max(fw2.y, 1e-5), px = max(fx, fy);
  float fd = max(fwidth(depth), 1e-5);
  float inside = step(-860., p.x)*step(p.x, 860.)*step(0., p.y);
  // ---- the cone's beds lie parallel to the flanks
  float sN = vnoise(vec2(p.x*0.008, depth*0.02));
  float cS = depth + 16.*sN + 0.03*abs(p.x);
  float fS = max(fwidth(cS), 1e-5);
  // ---- the old country under the cone: an unconformity, folded beds, a granite floor
  float yU = 0.6*vTop + 9. + 12.*(vnoise(vec2(p.x*0.017, 5.)) - 0.5);
  float cU = p.y - yU;
  float fU = max(fwidth(cU), 1e-5);
  float cF = p.y + 20.*sin(p.x*0.021 + 0.6) + 8.*sin(p.x*0.057 + 2.) + 0.07*p.x + 2.*(vnoise(p*0.05) - 0.5);
  float fF = max(fwidth(cF), 1e-5);
  float yG = 13. + 9.*vnoise(vec2(p.x*0.012, 9.));
  // ---- conduit
  float cu = 10.*sin(p.y*0.012 + 1.)*(1. - smoothstep(120., uLip - 60., p.y));
  float wc = mix(15., 5.5, clamp(p.y/uLip, 0., 1.)) + 16.*smoothstep(uLip - 80., uLip - 30., p.y);
  float dc = abs(p.x - cu) - wc;
  float fdc = max(fwidth(dc), 1e-5);
  // ---- magma chamber
  vec2 mc = (p - vec2(0., 26.))/vec2(150., 44.);
  float dm = (length(mc) - 1.)*44.;
  float fdm = max(fwidth(dm), 1e-5);
  // ---- the side conduit: a feeder that leaves the chamber and climbs to a vent on the flank
  float lvx = uLava.x + uLava.y*p.y + 5.*sin(p.y*0.045 + 1.) + 1.6*sin(p.y*0.13 + 2.);
  float b1 = (p.y - uLava.w*0.5)/9., b2 = (p.y - uLava.w*0.82)/6.;
  float lw = max(uLava.z*(1. + 0.3*sin(p.y*0.09)) + 6.*exp(-b1*b1) + 4.5*exp(-b2*b2), 3.*fx);      // from the valley it is still a red line
  float dl = abs(p.x - lvx)*0.94 - lw;
  float fpt = max(fwidth(p.x*0.7 - p.y), 1e-5);
  float fsh = max(fwidth(p.x + p.y), 1e-5);
  float ink = 0.; float vermA = 0.; float gambA = 0.;
  vec3 tint = vec3(1.); float tintK = 0.;
  float nearP = 1. - smoothstep(0.1, 0.3, px);                     // marks of half a metre resolve
  // ---- soil: a band under the edge, its base wavering
  float soilD = 3.6 + 3.2*vnoise(vec2(p.x*0.09, 3.));
  float deep = smoothstep(soilD, soilD + 0.5, depth)*inside;
  float inSoil = step(0.3, depth)*(1. - deep)*inside;
  float soilInk = mix(0.22, dotGrid(vec2(p.x, depth)/0.3, 0.55)*0.8, 1. - smoothstep(0.05, 0.16, px));
  ink = max(ink, max(soilInk, lineAA(depth - soilD, fd, 1.1))*inSoil);
  float old = (1. - smoothstep(-0.5*fU, 0.5*fU, cU))*deep;         // 1 in the old country
  float lightBed = 0.; float bodyInk = 0.;
  if (cU > 0.) {
    // ---- the cone: thin beds, each engraved as its rock, under bold flat tints
    float cT = cS + 0.7*(vnoise(p*0.3) - 0.5);
    float bs = cT/6.2 + 0.26*sin(cT*0.23 + 1.3);
    float bk = floor(bs), bf = bs - bk;
    float bt = h11(bk*1.37 + 5.3);
    float bedLod = 1. - smoothstep(0.05, 0.14, fS*0.22);              // a bed is at least seven pixels thick
    vec2 q = vec2(p.x, cT);
    float bedInk = 0.; vec3 bedTint = vec3(1.);
    if (bt < 0.24) {                 // ash and tuff: pale paper, a sparse stipple; the script is written here
      bedInk = mix(0.04, dotGrid(q/0.6, 0.3)*0.75, nearP); lightBed = 1.;
      bedTint = mix(vec3(1.), uGambP, 0.2);
    } else if (bt < 0.45) {          // lava: close diagonal hatching broken by cooling cracks
      float cr = (fract(q.x/2.7 + 0.35*vnoise(vec2(bk*3.1, q.y*0.5))) - 0.5)*2.7;
      bedInk = max(hatch(q.x*0.75 + q.y, fx*0.75 + fS, 0.4, 40., 0.42).x*0.85, lineAA(cr, fx, 0.8)*step(0.35, h11(floor(q.x/2.7) + bk*7.))*nearP);
      bedTint = mix(vec3(1.), uShade, 0.78);
    } else if (bt < 0.6) {           // scoria: a bed of cinders, each drawn round
      vec2 g = q/0.8; g.x += 0.5*floor(g.y) + 0.35*vnoise(vec2(g.y*0.7, bk));
      vec2 gi = floor(g); vec2 gc = fract(g) - 0.5 - 0.4*(vec2(h21(gi + 1.), h21(gi + 4.)) - 0.5);
      float gr = 0.1 + 0.18*h21(gi + 6.);
      float ga = atan(gc.y, gc.x + 1e-5)/6.2832 + h21(gi + 8.);
      bedInk = mix(0.14, lineAA((length(gc) - gr)*0.8, px, 0.7)*step(0.3, h21(gi + 2.))*step(0.3, fract(ga)), nearP);
      bedTint = mix(vec3(1.), uVerm, 0.4)*mix(vec3(1.), uHalf, 0.25);
    } else if (bt < 0.76) {          // columnar basalt: joints standing across the bed, stepped
      float cc = q.x + 0.3*sin(q.y*1.9 + bk*2.);
      float ci = floor(cc/0.9);
      float jn = lineAA((fract(cc/0.9) - 0.5)*0.9, fx + 0.6*fS, 0.6)*step(0.2, h21(vec2(ci, bk)));
      float sp = lineAA((fract(q.y/1.4 + h21(vec2(ci, bk + 2.))) - 0.5)*1.4, fS, 0.5)*step(0.5, h21(vec2(ci, floor(q.y/1.4) + bk)));
      bedInk = mix(0.14, max(jn, sp*0.8), nearP);
      bedTint = mix(vec3(1.), uShade, 0.55)*mix(vec3(1.), uHalf, 0.4);
    } else if (bt < 0.9) {           // lapilli: short dashes lying along the bed
      bedInk = hatch(q.y, fS, 0.5, 40., 0.22).x*step(0.5, vnoise(vec2(q.x*1.5, q.y*4.)))*0.8; lightBed = 0.6;
      bedTint = mix(vec3(1.), uGambP, 0.62);
    } else {                         // an old soil: close dark stipple under a wash
      bedInk = mix(0.2, dotGrid(q/0.33, 0.75)*0.85, nearP);
      bedTint = uSoil*vec3(0.9, 0.88, 0.8);
    }
    bedInk = max(bedInk, lineAA(min(bf, 1. - bf)*6.2, fS, 1.0)*0.85);
    bedInk = mix(0.07, bedInk, bedLod);
    // far off the thin beds give way to thick ones, each with a flat tint of its own
    float bedLine = hatchL(cS, fS, 28., 1e9, 0.3, 0.).x;
    float tbk = floor((cS + 1.2)/28.); float tbh = h11(tbk*2.31 + 1.7);
    vec3 farTint = tbh < 0.3 ? mix(vec3(1.), uShade, 0.8) : tbh < 0.55 ? mix(vec3(1.), uGambP, 0.6) : tbh < 0.74 ? mix(vec3(1.), uVerm, 0.38) : tbh < 0.9 ? mix(vec3(1.), uHalf, 0.5) : uSoil;
    bodyInk = max(bedLine*0.75, bedInk);
    tint = mix(farTint, bedTint, bedLod);
    // pigment pools along the foot of each bed
    tintK = 0.78 + 0.2*(1. - smoothstep(0.02, 0.3, bf))*bedLod;
  } else {
    // ---- the old country: folded beds
    float fs = cF/9.5 + 0.22*sin(cF*0.19 + 0.8);
    float fk = floor(fs), ff = fs - fk;
    float ft = h11(fk*1.71 + 2.3);
    vec2 q = vec2(p.x, cF);
    float nearF = 1. - smoothstep(0.12, 0.32, max(px, fF));
    float fInk = 0.; vec3 fTint = vec3(1.);
    if (p.y < yG) {                  // granite: a scatter of small crosses
      vec2 g = p/2.2; vec2 gi = floor(g); vec2 gc = fract(g) - 0.5 - 0.3*(vec2(h21(gi), h21(gi + 3.)) - 0.5);
      float cr = max(lineAA(gc.x*2.2, px, 0.6)*step(abs(gc.y), 0.16), lineAA(gc.y*2.2, px, 0.6)*step(abs(gc.x), 0.16))*step(0.45, h21(gi + 7.));
      fInk = mix(0.1, cr*0.8, nearF); fTint = mix(vec3(1.), uVerm, 0.26)*mix(vec3(1.), uGambP, 0.25);
      ff = 0.5;
    } else if (ft < 0.26) {          // limestone: coursed blocks
      float crs = floor(q.y/2.4);
      float course = lineAA((fract(q.y/2.4) - 0.5)*2.4, fF, 0.55);
      float jx = q.x/4.4 + 0.5*mod(crs, 2.) + 0.2*h11(crs);
      float joint = lineAA((fract(jx) - 0.5)*4.4, fx, 0.55)*step(0.25, h21(vec2(floor(jx), crs)));
      fInk = mix(0.07, max(course, joint)*0.7, nearF); fTint = mix(vec3(1.), uShade, 0.5);
    } else if (ft < 0.46) {          // sandstone: stipple and cross-bedding
      float xb = hatch(q.x*0.5 + q.y, fx*0.5 + fF, 0.9, 30., 0.2).x*step(0.5, vnoise(vec2(q.x*0.2, floor(q.y/2.)*3.)));
      fInk = mix(0.08, max(dotGrid(q/0.5, 0.35)*0.7, xb*0.7), nearF); fTint = mix(vec3(1.), uGambP, 0.72);
    } else if (ft < 0.62) {          // shale: close ruling along the bed, the dark band of the section
      fInk = hatch(q.y, fF, 0.45, 60., 0.55).x*0.85; fTint = mix(vec3(1.), uShade, 0.62)*mix(vec3(1.), uHalf, 0.6);
    } else if (ft < 0.8) {           // red marl: broken dashes and nodules
      float nd = dotGrid(q/1.3, 0.3);
      fInk = mix(0.06, max(hatch(q.y, fF, 0.9, 30., 0.2).x*step(0.55, vnoise(vec2(q.x*0.9, q.y*3.)))*0.75, nd*0.6), nearF); fTint = mix(vec3(1.), uVerm, 0.46);
    } else if (ft < 0.92) {          // conglomerate: pebbles
      vec2 g = q/1.1; g.x += 0.5*floor(g.y);
      vec2 gi = floor(g); vec2 gc = fract(g) - 0.5 - 0.4*(vec2(h21(gi + 1.), h21(gi + 4.)) - 0.5);
      fInk = mix(0.12, lineAA((length(gc*vec2(1., 1.5)) - 0.14 - 0.2*h21(gi + 6.))*1.1, px, 0.7)*step(0.25, h21(gi + 2.)), nearF); fTint = mix(vec3(1.), uHalf, 0.55);
    } else {                         // a coal seam between two partings
      float seam = step(0.22, ff)*step(ff, 0.78);
      fInk = max(hatch(q.x + q.y, fx + fF, 0.5, 60., 0.85).x, hatch(q.x - q.y, fx + fF, 0.5, 60., 0.7).x)*0.92*seam + (1. - seam)*dotGrid(q/0.5, 0.3)*0.6*nearF;
      fTint = mix(mix(vec3(1.), uGambP, 0.3), vec3(0.5, 0.47, 0.5), seam);
    }
    fInk = max(fInk, lineAA(min(ff, 1. - ff)*9.5, fF, 1.1)*0.85);
    // ammonites lie in the limestone and the sandstone
    float ai = floor(q.x/17. + 0.37*fk);
    float ah = h21(vec2(ai, fk*3.1 + 1.));
    vec2 av = vec2(q.x - (ai + 0.5 + 0.3*(h11(ai*1.3 + fk) - 0.5) - 0.37*fk)*17., (ff - 0.5)*9.5);
    float ar = length(av), aR = 1.7 + 2.2*ah;
    float aOn = step(0.4, h21(vec2(ai + 5., fk)))*step(ft, 0.46)*step(yG, p.y)*(1. - smoothstep(0.3, 0.6, px));
    float aIn = (1. - smoothstep(aR - px, aR + px, ar))*aOn;
    float ath = atan(av.y, av.x + 1e-5)/6.2832;
    float aw = log2(max(ar, 0.02)/aR)*1.7 - ath*(ah < 0.5 ? -1. : 1.);
    float whorl = lineAA((fract(aw + 0.5) - 0.5)*ar*0.41, px, 0.8);
    float ribs = lineAA((fract(ath*26. + 0.5) - 0.5)*ar*0.2417, px, 0.5)*step(0.35, fract(aw));
    float aInk = max(max(whorl, ribs*0.75), lineAA(ar - aR, px, 1.3))*smoothstep(0.03*aR, 0.1*aR, ar);
    fInk = mix(fInk, aInk, aIn); fTint = mix(fTint, mix(vec3(1.), uGambP, 0.16), aIn);
    bodyInk = fInk; tint = fTint;
    tintK = 0.8 + 0.18*(1. - smoothstep(0.02, 0.3, ff));
  }
  // the unconformity: one heavy wavering line with a row of pebbles under it
  float unc = max(lineAA(cU, fU, 1.6), dotGrid(vec2(p.x, cU)/0.9, 0.5)*step(cU, 0.)*step(-2.7, cU)*nearP*0.8)*deep;
  bodyInk = max(bodyInk, unc);
  float open = smoothstep(0., 3., dc)*smoothstep(0., 3., dm);
  ink = max(ink, bodyInk*deep*open*0.78);
  tintK *= deep*open*(1. - 0.6*smoothstep(700., 1700., vDist));
  tint = mix(tint, uSoil, inSoil); tintK = max(tintK, inSoil*0.95);
  // ---- hair roots and small tree roots: down through the soil and into the beds, with rootlets
  float rc = p.x/2.6; float ri = floor(rc); float rh = h11(ri + 31.);
  float rlen = soilD + (2. + 9.*rh*rh)*step(0.3, rh);
  float rx = (fract(rc) - 0.5)*2.6 - (h11(ri + 7.) - 0.5)*1.2 - 0.35*sin(depth*0.9 + rh*20.) - 0.15*sin(depth*2.7 + rh*9.);
  float root = lineAA(rx, fx, mix(2.2, 0.6, clamp(depth/rlen, 0., 1.)))*step(depth, rlen)*step(0.25, depth);
  float rt = depth - abs(rx)*1.1; float rk = floor(rt/0.8);
  float rootlet = lineAA((fract(rt/0.8) - 0.5)*0.54, max(fd, fx), 0.5)*step(abs(rx), 0.25 + 0.7*h11(rk + ri*3.))*step(depth, rlen*0.9)*step(0.4, depth);
  ink = max(ink, max(root, rootlet*0.8)*inside*(1. - smoothstep(0.1, 0.28, fx)));
  // ---- conduit walls, flow lines, the vermilion fill with its gamboge thread
  float inC = (1. - smoothstep(-0.5, 0.5, dc))*step(2., depth)*inside;
  float inM = (1. - smoothstep(-0.5, 0.5, dm))*inside;
  ink = max(ink, max(lineAA(dc, fdc, 1.1)*step(2., depth), lineAA(dm, fdm, 1.1)*(1. - inC))*inside);
  float flow = hatch(p.x - cu, fx, 2.2, 30., 0.2).x*inC*(1. - inM);
  float swirl = hatch(dm + 6.*sin(atan(mc.y, mc.x + 1e-4)*5.), fdm*1.5, 5., 60., 0.25).x*inM;
  ink = max(ink, max(flow, swirl)*0.7);
  float lvl = uConduit*(uLip - 40.);
  float below = 1. - smoothstep(lvl - 6., lvl + 6., p.y + 5.*vnoise(vec2(p.x*0.2, uTime*0.3)));
  float thread = lineAA(p.x - cu, fx, max(1.0, 1.4/fx))*inC*below;
  vermA = max(inM*0.8, inC*below*0.62);
  gambA = max(thread*0.9, inM*smoothstep(0.52, 0.7, vnoise(mc*5. + vec2(uTime*0.05, 0.)))*0.8);
  // ---- dykes: sheets of the same rock rising across the beds, each with its thread
  for (int i = 0; i < 3; i++) {
    vec4 D = uDyke[i];
    float dx = p.x - D.x - (p.y - D.y)*D.z - 1.3*sin(p.y*0.06 + D.x);
    float dn = abs(dx)*0.89 - D.w;
    float on = step(46., p.y)*smoothstep(soilD + 1., soilD + 4., depth)*inside;
    float m = (1. - smoothstep(-0.5*px, 0.5*px, dn))*on;
    ink *= 1. - m; tintK *= 1. - m;
    ink = max(ink, lineAA(dn, px, 0.9)*on*(1. - smoothstep(0.5, 2., px)));
    float fl = lineAA((fract(dx/0.45 + 0.5) - 0.5)*0.45, fx + 0.5*fy, 0.5)*step(0.45, vnoise(vec2(floor(dx/0.45 + 0.5)*3.3 + D.x, p.y*0.35)));
    ink = max(ink, fl*m*0.6*nearP);
    vermA = max(vermA, max(m*0.3, lineAA(dx, fx + 0.5*fy, max(1.0, 0.07/px))*on*0.75));
  }
  // ---- the side conduit: live lava under a drifting crust, the wall rock baked round it
  {
    float lon = step(0.6, depth)*inside;
    float lvlS = uLava.w + 2.5*(vnoise(vec2(p.x*0.3, uTime*0.4)) - 0.5);
    float live = 1. - smoothstep(-1.5, 1.5, p.y - lvlS);
    float lin = (1. - smoothstep(-0.5*px, 0.5*px, dl))*lon;
    float halo = (1. - smoothstep(0., 12., dl))*step(0., dl)*lon*live;
    ink *= 1. - lin; tintK *= 1. - lin*live;
    float rk2 = dl/2.6 - uTime*0.06;
    float ring = lineAA((fract(rk2) - 0.5)*2.6, px, 0.6)*step(0.4, vnoise(vec2(p.y*0.4, floor(rk2)*7.)))*halo*(1. - smoothstep(0.15, 0.5, px));
    float crustN = vnoise(vec2((p.x - lvx)*0.4, (p.y - uTime*2.2)*0.24)) + 0.3*vnoise(vec2((p.x - lvx)*1.3, (p.y - uTime*2.2)*0.8));
    // (round 4) seen whole and near from the new line: every boundary a drawn edge, the rafts of crust in crossed lines, the
    // baked wall a flat thin wash with a broken rim, the gamboge core a second flat wash
    float crW = max(fwidth(crustN), 1e-4);
    float crust = smoothstep(0.76 - crW, 0.76 + crW, crustN)*lin*live;
    float crustEdge = lineAA(crustN - 0.76, crW, 1.1)*lin*live;
    float crH = 1. - (1. - hatch(p.x*0.7 - p.y, fpt, 0.55, 300., 0.85).x)*(1. - hatch(p.x*0.7 + p.y, fpt, 0.7, 200., 0.7).x);
    float void2 = lin*(1. - live);
    ink = max(ink, max(max(lineAA(dl, px, 1.4)*lon, ring*0.65), max(crust*crH*0.9, crustEdge*0.8)));
    ink = max(ink, void2*hatch(p.x*0.7 - p.y, fpt, 0.7, 40., 0.5).x*0.7);
    float coA = dl + lw*(0.52 + 0.3*(vnoise(vec2((p.x - lvx)*0.5, p.y*0.3 - uTime*0.6)) - 0.5)), coW = max(fwidth(coA), 1e-4);
    float core = (1. - smoothstep(-coW, coW, coA))*live*lin;
    float bkA = dl - 4.5 - 4.*vnoise(p*0.27), bkW = max(fwidth(bkA), 1e-4);
    float baked = (1. - smoothstep(-bkW, bkW, bkA))*step(0., dl)*lon*live;
    vermA = max(vermA*(1. - lin), max(lin*live*(1. - 0.75*crust), baked*0.3));
    gambA = max(gambA*(1. - lin), core*(1. - crust)*(0.72 + 0.28*step(0.2, sin(p.y*0.5 - uTime*2. + 2.*vnoise(p*0.3)))));
  }
  // ---- altitude rules, ticks, zone lines, scale poles
  vec2 rl = hatchL(p.y, fy, 10., 1e9, 0.12, -2.);
  float major = lineAA((fract(p.y/50. + 0.5) - 0.5)*50., fy, 0.9);
  float tick = lineAA((fract(p.x/5. + 0.5) - 0.5)*5., fx, 0.5)*step(fract(p.y/10.)*10., 1.1)*(1. - smoothstep(0.25, 0.7, px));
  float zy = min(min(abs(p.y - 60.), abs(p.y - 190.)), min(abs(p.y - 310.), abs(p.y - 380.)));
  float zline = lineAA(zy, fy, 0.8)*step(0.4, fract(p.x/10.));
  float pole = step(abs(abs(p.x) - 74.), 2.6)*step(mod(floor(p.y/50.), 2.), 0.5);
  pole = max(pole, lineAA(abs(abs(p.x) - 74.) - 2.6, fx, 0.7));
  float bar = step(abs(p.y - 5.), 2.)*step(mod(floor(p.x/100.), 2.), 0.5);
  bar = max(bar, lineAA(abs(p.y - 5.) - 2., fy, 0.7));
  float ledger = max(max(rl.x*0.55, major*0.8), max(tick*0.7, zline))*step(1.5, depth)*inside;
  ledger *= max(smoothstep(-1., 2., dc), 0.35)*smoothstep(-1., 2., dl);
  ink = max(ink, ledger);
  ink = max(ink, max(pole*step(3., depth), bar*step(4., depth))*inside*0.92);
  // ---- script: small rows between the rules, large rows naming the zones; it keeps to the pale beds of the cone
  float para = step(0.34, vnoise(p*vec2(0.011, 0.03) + 3.));
  float sm = script(p/0.893, fx/0.893, fy/0.893)*para;
  vec2 pl = (p - vec2(0., 2.))/1.8;
  float lgOn = step(0.8, h11(floor(pl.y/1.4) + 11.));
  float lg = script(pl, fx/1.8, fy/1.8)*lgOn;
  float clearTxt = smoothstep(2., 8., dc)*smoothstep(1., 6., dm)*smoothstep(2., 6., dl)*smoothstep(soilD + 1., soilD + 3., depth)*inside*smoothstep(3., 6., abs(abs(p.x) - 74.));
  clearTxt *= lightBed*(1. - old);
  ink = max(ink, max(sm*0.85, lg)*clearTxt);
  // ---- the page in half-tone (afternoon print: the sun is behind the cut)
  ink = max(ink, uPageTone*hatch(p.x*0.7 - p.y + 3.*vnoise(p*0.03), fpt, 0.9, 500., 0.22).x*0.55*step(1.5, depth)*inside);
  // ---- caves and burrows
  for (int i = 0; i < ${p0}; i++) {
    vec4 C = uCave[i];
    float ry = abs(C.w), dark = step(0., C.w);
    vec2 v = (p - C.xy)/vec2(C.z, ry);
    float a = atan(v.y, v.x + 1e-5);
    float wob = 0.12*sin(a*3. + C.x) + 0.06*sin(a*7. + C.y*0.3);
    float d = (length(v) - 1. - wob)*ry;
    float dCh = d;
    // a burrow's tunnel climbs from its chamber to the surface
    float ty = p.y - C.y;
    float td = abs(p.x - (C.x + C.z*0.55 + ty*0.55 + 0.8*sin(ty*0.5 + C.x)))*0.87 - 0.85;
    float inTun = step(td, dCh)*step(0., ty)*(1. - dark);
    d = mix(min(d, mix(1e3, td, step(0., ty)*step(0.2, depth))), d, dark);
    float m = (1. - smoothstep(-0.5*px, 0.5*px, d))*inside*step(0.2, depth);
    // the dark vault: stalactites, stalagmites, a pool
    float hx = clamp(v.x, -0.98, 0.98);
    float arc = sqrt(1. - hx*hx)*ry;
    float sx = p.x/1.7 + C.x*0.37; float kc = floor(sx); float tw = 1. - 2.*abs(fract(sx) - 0.5);
    float sl = (0.7 + 0.55*arc*h11(kc*1.9 + 2.))*step(0.3, h11(kc + 5.));
    float sg = (0.5 + 0.4*arc*h11(kc*2.3 + 9.))*step(0.45, h11(kc + 8.));
    float fromRoof = (C.y + arc) - p.y, fromFloor = p.y - (C.y - arc);
    float form = max((sl*tw - fromRoof)/sqrt(1. + 1.4*sl*sl), (sg*tw - fromFloor)/sqrt(1. + 1.4*sg*sg));
    float inForm = smoothstep(-0.5*px, 0.5*px, form);
    float pool = step(p.y, C.y - 0.55*ry)*(1. - inForm);
    float vault = max(hatch(length(v)*ry + 0.7*vnoise(p*0.5), px, 0.55, 80., 0.7).x, hatch(p.x*0.7 - p.y, fpt, 0.7, 80., 0.4).x*0.6);
    float ripple = lineAA((fract(p.y/0.7) - 0.5)*0.7, fy, 0.5)*step(0.5, fract(p.x/3. + h11(floor(p.y/0.7)) + uTime*0.15))*nearP;
    float formInk = max(lineAA(form, px, 0.9), lineAA((fract(sx*4.) - 0.5)*0.42, fx, 0.45)*0.45*nearP);
    float inkD = mix(mix(vault, ripple*0.75, pool), formInk, inForm);
    vec3 tintD = mix(mix(vec3(0.24, 0.3, 0.42), mix(vec3(1.), uShade, 0.9), pool), mix(vec3(1.), uGambP, 0.2), inForm);
    // the burrow (round 4): a hollow in the earth and engraved as one, never a blank: arcs that follow its wall, closest
    // and crossed under the roof, an umber wash that pools there, a floor of straw left pale and strewn with dry strokes;
    // the tunnel is ringed across like a shaft in shade
    float roof = smoothstep(-0.35, 0.75, v.y);
    float wallK = 1. - smoothstep(0.3, 2.4, -dCh);
    float toneB = clamp(0.2 + 0.5*roof + 0.3*wallK, 0., 0.92);
    float arcsB = hatch(dCh + 0.35*vnoise(p*0.7), px, 0.34, 30., toneB).x;
    float crossB = hatch(p.x*0.7 + p.y, fsh, 0.5, 30., toneB).x*smoothstep(0.45, 0.8, toneB);
    float straw = step(v.y, -0.38 + 0.1*sin(p.x*1.3 + C.x));
    float nest = hatch(p.x*0.35 + p.y, fx*0.35 + fy, 0.35, 20., 0.3).x*step(0.4, vnoise(p*vec2(1.4, 3.)));
    float ringT = hatch(ty + 0.5*(p.x - C.x), fy + 0.5*fx, 0.4, 30., 0.62).x;
    float inkL = mix(mix(1. - (1. - arcsB)*(1. - crossB*0.8), nest*0.75, straw), ringT*0.85, inTun);
    vec3 tintL = mix(mix(uSoil*mix(vec3(1.), uHalf, 0.25 + 0.4*roof), mix(vec3(1.), uGambP, 0.55), straw), uSoil*mix(vec3(1.), uHalf, 0.5), inTun);
    float rim = dotGrid(p/0.33, 0.7)*(1. - smoothstep(0.2, 1.5, d))*step(0., d)*nearP*(1. - dark);
    ink = mix(ink, mix(inkL, inkD, dark), m);
    vermA *= 1. - m; gambA *= 1. - m;
    tint = mix(tint, mix(tintL, tintD, dark), m); tintK = mix(tintK, 1., m);
    ink = max(ink, max(lineAA(d, px, 0.9 + 0.6*dark)*step(0.2, depth)*inside, rim*0.8));
  }
  // ---- the tapir's ledge: a strip of blank paper climbing out of its box, ruled below, ticked like a ground line
  float lx = p.x - uLedge.x;
  float ly = (p.y - uLedge.y - lx*uLedge.z)*0.9;
  float lon = step(0., lx)*step(lx, uLedge.w)*inside;
  float strip = lon*step(0., ly)*(1. - smoothstep(4.3, 4.6, ly))*(1. - smoothstep(uLedge.w - 6., uLedge.w, lx));
  ink *= 1. - strip; tintK *= 1. - strip; vermA *= 1. - strip; gambA *= 1. - strip;
  float fl2 = fy + fx*abs(uLedge.z);
  ink = max(ink, max(lineAA(ly, fl2, 1.0), lineAA(ly - 4.45, fl2, 0.5)*0.6)*lon);
  float ltk = lineAA((fract(lx/0.5) - 0.5)*0.5 + ly*0.6, fx + fy, 0.5)*step(ly, 0.)*step(-0.3 - 0.5*h11(floor(lx/0.5)), ly);
  ink = max(ink, ltk*lon*0.8*(1. - smoothstep(0.1, 0.3, px)));
  // ---- condor shadows: hatched patches
  for (int i = 0; i < 2; i++) {
    vec2 sq = p - uShadow[i].xy; sq = vec2(sq.x*0.82 + sq.y*0.57, -sq.x*0.57 + sq.y*0.82);
    float d = length(sq*vec2(1., 3.2))/max(uShadow[i].z, 0.01);
    float m = (1. - smoothstep(0.75, 1.05, d))*uShadow[i].w*inside;
    ink = max(ink, m*hatch(p.x + p.y, fsh, 0.5, 40., 0.6).x);
  }
  // ---- the plates: inside a double rule a little picture ground (a line of turf, a ruled sky), a caption under each
  float capM = 0.;
  float skyRule = hatchL(p.y, fy, 0.45, 1e9, 0.1, -3.).x;
  for (int i = 0; i < ${we}; i++) {
    vec4 B = uBox[i];
    vec2 bq = abs(p - B.xy) - B.zw;
    float d = max(bq.x, bq.y);
    float keep = smoothstep(-0.2, 0.3, d), inB = 1. - keep;
    float base = B.y - B.w*0.72, by = (p.y - (B.y - B.w))/max(2.*B.w, 0.1);
    float turf = step(p.y, base);
    float gtk = lineAA((fract(p.x/0.5) - 0.5)*0.5 + (p.y - base)*0.4, fx + fy, 0.5)*turf*step(base - 0.3 - 0.5*h11(floor(p.x/0.5) + B.x), p.y)*nearP;
    float skyK = smoothstep(0.45, 1., by);
    ink = mix(ink, max(gtk*0.8, skyRule*skyK*0.3), inB); vermA *= keep; gambA *= keep;
    tint = mix(tint, mix(mix(vec3(1.), uShade, 0.34*skyK), mix(vec3(1.), uSoil, 0.7), turf), inB); tintK = mix(tintK, 1., inB);
    float fb = bq.x > bq.y ? fx : fy;
    ink = max(ink, max(lineAA(d, fb, 1.3), lineAA(d + 0.45, fb, 0.5)));
    // baseline rule inside the box: the altitude rule the specimen stands on
    ink = max(ink, lineAA(p.y - base, fy, 0.6)*step(d, 0.)*0.7);
    vec2 cq = abs(p - vec2(B.x, B.y - B.w - 1.55)) - vec2(B.z, 1.05);
    capM = max(capM, (1. - smoothstep(-0.1, 0.2, max(cq.x, cq.y)))*step(0.1, B.z));
  }
  capM *= inside;
  ink = mix(ink, script((p + vec2(3.3, 0.45))/0.72, fx/0.72, fy/0.72)*0.9, capM);
  tintK *= 1. - capM; vermA *= 1. - capM; gambA *= 1. - capM;
  // ---- waterfalls, drawn in line (round 4): a narrow ribbon under a thin verditer wash, close flow lines with travelling
  // dashes, two firm drawn edges (the one away from the sun doubled and shaded), stipple where the water strikes a ledge
  for (int i = 0; i < 3; i++) {
    vec4 F = uFall[i];
    float hwf = max(F.w*(0.5 + 0.28*clamp((F.y - p.y)/max(F.y - F.z, 1.), 0., 1.)), 1.6*fx);
    float du = p.x - F.x - 0.9*sin(p.y*0.11 + F.x);
    float on = step(F.z, p.y)*step(p.y, F.y + 1.5);
    float m = (1. - smoothstep(hwf, hwf + 0.5*px + 0.2, abs(du)))*on;
    float lee = smoothstep(0.2, 0.85, du/hwf);
    ink *= 1. - m; vermA *= 1. - m; gambA *= 1. - m;
    tint = mix(tint, mix(vec3(1.), uShade, 0.45 + 0.35*lee), m); tintK = mix(tintK, 0.92, m);
    float t = du/hwf*3.5;
    float k = floor(t + 0.5);
    float lpx = abs(t - k)*hwf/3.5/fx;
    float nearLines = (1. - smoothstep(0.3, 0.9, fx/hwf*3.5));
    float sp = 11. + 5.*h11(k + F.x);
    float dash = step(0.3, fract((p.y + uTime*sp)/(7. + 4.*h11(k*3.1 + F.x)) + h11(k + 9.)));
    float lines = (1. - smoothstep(0.45, 1.2, lpx))*dash*nearLines;
    float shadeF = hatch(du*0.8 + p.y*0.25, fx*0.8 + fy*0.25, 0.22, 20., 0.5).x*lee*nearLines;
    float edge = 1. - smoothstep(0.7, 1.7, abs(abs(du) - hwf)/fx);
    float edge2 = (1. - smoothstep(0.4, 1.1, abs(du - hwf - 0.45)/fx))*step(0.3, fract((p.y + uTime*13.)/9.))*nearLines;
    ink = max(ink, max(max(lines*0.8, shadeF*0.7)*m, max(edge, edge2*0.7)*on));
    // rising stipple at the foot and at each ledge the water strikes on its way down
    float lk = floor((F.y - p.y)/43. + 0.3);
    float ly2 = (F.y - p.y) - (lk + 0.7)*43.;
    vec2 lq = vec2(du, ly2)/vec2(hwf*2.6, hwf*1.9);
    vec2 sq = (p - vec2(F.x, F.z))/vec2(hwf*3.2, hwf*2.6);
    float mound = max(1. - smoothstep(0.5, 1., length(sq)), (1. - smoothstep(0.4, 1., length(lq)))*step(0.5, lk + 1.)*step(F.z + 20., p.y));
    vec2 dg = vec2(p.x, p.y - uTime*1.6)/0.8; vec2 di = floor(dg);
    float dd = length(fract(dg) - 0.5 - 0.3*(vec2(h21(di), h21(di + 7.)) - 0.5));
    float spray = (1. - smoothstep(0.1, 0.2, dd))*step(h21(di + 2.), mound)*(1. - smoothstep(0.2, 0.5, px));
    ink = mix(ink, spray*0.8, mound*step(F.z, p.y + 0.01)*step(0.1, mound)*inside*on);
  }
  // ---- the fringed top edge and the section's ground line
  float fid = floor(p.x/0.38); float fh = h11(fid);
  float flen = 0.5 + 3.2*fh*fh;
  float fl = lineAA((fract(p.x/0.38) - 0.5)*0.38 + 0.08*sin(depth*2. + fh*6.), fx, 0.55)*step(depth, flen);
  float fringe = mix(fl, step(depth, 1.3)*0.55, smoothstep(0.12, 0.3, fx));
  ink = max(ink, fringe*inside);
  ink = max(ink, lineAA(depth - 0.3, fd, 1.3)*inside);
  // passionflowers on the edge
  vec2 pf = p - uFlower.xy;
  vec2 pg = pf/1.3; vec2 pid = floor(pg);
  vec2 pc = fract(pg) - 0.5 - 0.3*(vec2(h21(pid + 1.), h21(pid + 4.)) - 0.5);
  float petal = 0.22 + 0.07*cos(atan(pc.y, pc.x + 1e-4)*5.);
  float fm = step(length(pf*vec2(1., 2.2)), uFlower.z)*step(0.45, h21(pid + 8.))*step(0.3, depth)*(1. - smoothstep(0.3, 0.8, px));
  float flw = (1. - smoothstep(petal - 0.03, petal + 0.03, length(pc)))*fm;
  vermA = max(vermA, flw);
  ink = max(ink*(1. - flw), lineAA(length(pc) - petal, px/1.3, 0.5)*fm);
  // ---- compose
  float fox = foxing(p);
  vec3 paperTint = vec3(1.) - fibre(p, px) - fox*0.2*vec3(0.25, 0.5, 0.85);
  float below0 = 1. - inside;                       // the riser under the plain: plain paper
  ink *= 1. - below0;
  // (round 4) seen whole from the palm valley the beds take a second pass of the same wash, so the section keeps its colour small
  tint = mix(tint, tint*tint, 0.8*smoothstep(170., 430., vDist));
  vec3 col = uPaper*paperTint*mix(vec3(1.), tint, clamp(tintK, 0., 1.)*inside);
  col = mix(col, uVerm*vec3(1.3, 1.5, 1.2)*(0.9 + 0.1*paperTint), clamp(vermA, 0., 1.)*inside);
  col = mix(col, uGambP*vec3(1.25, 1.3, 1.0), clamp(gambA, 0., 1.)*inside);
  vec3 inkc = mix(uInk, uHalf, smoothstep(150., 700., vDist));
  col = mix(col, inkc, clamp(ink, 0., 1.));
  ${jt}
}`,eo=`
varying vec3 vPos; varying float vTop; varying float vDist;
${Yt}
${je}
${_t}
void main(){
  vec2 p = vPos.xz;
  vec2 fw2 = fwidth(p);
  float fx = max(fw2.x, 1e-5), fz = max(fw2.y, 1e-5), px = max(fx, fz);
  float r = length(p);
  // ledger ruling of the plain, a plate mark, and a soft ruled shadow line at the foot of the page
  float ink = hatchL(p.x, fx, 20., 1e9, 0.1, 0.).x*0.5;
  ink = max(ink, hatchL(p.y, fz, 100., 1e9, 0.1, 0.).x*0.35);
  vec2 pm = abs(p - vec2(560., 0.)) - vec2(520., 1010.);
  float dpm = max(pm.x, pm.y);
  ink = max(ink, max(lineAA(dpm, px, 1.0), lineAA(dpm + 6., px, 0.5)*0.7));
  ink = max(ink, script(vec2(-p.y, p.x - 30.)/5., fz/5., fx/5.)*step(p.x, 110.)*step(40., p.x)*step(abs(p.y), 700.));
  ink *= 1. - smoothstep(1100., 1240., r);
  vec3 paperTint = vec3(1.) - fibre(p, px) - foxing(p + 300.)*0.2*vec3(0.25, 0.5, 0.85);
  vec3 col = uPaper*paperTint;
  vec3 inkc = mix(uInk, uHalf, smoothstep(150., 700., vDist));
  col = mix(col, inkc, clamp(ink, 0., 1.));
  ${jt}
}`;function oo(){const o=[];for(let d=0;d<=118;d++)o.push(d<=26?124*(d/26):124+(Te-124)*Math.pow((d-26)/92,1.15));const l=[];for(const d of o)d>19&&d<86||d>900&&d<Te-1&&d-l[l.length-1]<22||l.push(d);for(let d=20;d<84.5;d+=2)l.push(d);return l.sort((d,p)=>d-p)}async function ao(t,e,o,l){const p=o.length-1,y=(p+1)*167,c=new Float32Array(y*3),s=new Float32Array(y*3),i=new Uint32Array(p*166*6),r=new Float32Array(y*3),a=14;let h=0;for(let u=0;u<=p;u++){const x=o[u];for(let w=0;w<=166;w++){const A=w/166*2-1,M=Math.abs(A),z=Math.PI/2*(.6*A+.4*Math.sign(A)*(1-(1-M)*(1-M))),D=w===0||w===166,P=D?0:-x*Math.cos(z),G=D?x*Math.sign(A):x*Math.sin(z);let _=e.heightAt(P,G);if(x>330&&x<900&&_<215){const Q=Math.min(P,-.5),N=(e.heightAt(Math.min(Q+a,-.2),G)+e.heightAt(Q-a,G)+e.heightAt(Q,G+a)+e.heightAt(Q,G-a))/4-e.heightAt(Q,G);r[h]=W(.35,2.4,N)}D&&(_=Math.max(_,.3)),c[h]=P,c[h+1]=_,c[h+2]=G,h+=3}u%2===0&&await t.yield()}await t.yield();const f=167;for(let u=0;u<=p;u++)for(let x=0;x<=166;x++){const w=(u*f+Math.max(x-1,0))*3,A=(u*f+Math.min(x+1,166))*3,M=(Math.max(u-1,0)*f+x)*3,z=(Math.min(u+1,p)*f+x)*3,D=(u*f+x)*3,P=c[A]-c[w],G=c[A+1]-c[w+1],_=c[A+2]-c[w+2],Q=c[z]-c[M],N=c[z+1]-c[M+1],$=c[z+2]-c[M+2];let et=G*$-_*N,J=_*Q-P*$,xt=P*N-G*Q;const dt=Math.hypot(et,J,xt);if(dt<1e-6)et=0,J=1,xt=0;else{const wt=J<0?-1/dt:1/dt;et*=wt,J*=wt,xt*=wt}s[D]=et,s[D+1]=J,s[D+2]=xt}await t.yield();for(let u=0;u<=p;u++)if(!(o[u]<330||o[u]>900)){for(let x=0;x<=166;x++){const w=(u*f+x)*3;if(c[w+1]>215)continue;let A=0,M=0,z=0;for(let P=Math.max(u-4,0);P<=Math.min(u+4,p);P++)for(let G=Math.max(x-4,0);G<=Math.min(x+4,166);G++){const _=(P*f+G)*3;A+=s[_],M+=s[_+1],z+=s[_+2]}const D=Math.hypot(A,M,z)||1;r[w+2]=W(0,.08,(A*l.x+M*l.y+z*l.z)/D-(s[w]*l.x+s[w+1]*l.y+s[w+2]*l.z))}u%8===0&&await t.yield()}h=0;for(let u=0;u<p;u++)for(let x=0;x<166;x++){const w=u*167+x,A=w+1,M=w+166+1,z=M+1;i[h++]=w,i[h++]=M,i[h++]=A,i[h++]=A,i[h++]=M,i[h++]=z}const m=new g.BufferGeometry;return m.setAttribute("position",new g.BufferAttribute(c,3)),m.setAttribute("normal",new g.BufferAttribute(s,3)),m.setAttribute("aTone",new g.BufferAttribute(r,3)),m.setIndex(new g.BufferAttribute(i,1)),m}function no(t,e){const o=[];for(let s=e.length-1;s>0;s--)o.push(e[s]);for(let s=0;s<e.length;s++)o.push(-e[s]);const l=o.length,d=new Float32Array(l*6),p=new Float32Array(l*2),y=[];for(let s=0;s<l;s++){const i=o[s],r=Math.max(t.heightAt(0,i),.3);if(d.set([0,-14,i,0,r,i],s*6),p[s*2]=r,p[s*2+1]=r,s<l-1){const a=s*2;y.push(a,a+2,a+1,a+1,a+2,a+3)}}const c=new g.BufferGeometry;return c.setAttribute("position",new g.BufferAttribute(d,3)),c.setAttribute("aTop",new g.BufferAttribute(p,1)),c.setIndex(y),c}function so(){const e=[0,0,0],o=[],l=[0];for(let p=0;p<=64;p++){const y=p/64*Math.PI;e.push(Math.sin(y)*Te,0,Math.cos(y)*Te),l.push(0)}for(let p=1;p<=64;p++)o.push(0,p,p+1);const d=new g.BufferGeometry;return d.setAttribute("position",new g.Float32BufferAttribute(e,3)),d.setAttribute("aTop",new g.Float32BufferAttribute(l,1)),d.setIndex(o),d}function io(t){const e=N=>t.heightAt(0,N),o=(N,$,et)=>new g.Vector3(N,$,et),l=(N,$,et)=>o(N,t.heightAt(Math.min(N,0),$)+et,$),d=Math.cos(Qt),p=Math.sin(Qt),y=62,c=o(Ft,440,st),s=o(Ft,440-y*p,st+y*d),i=Math.max(e(694)+11,t.heightAt(-15,713)+13),r=Math.max(e(622)-10,i+3),a=Math.max(e(458)-11,r+40),h=N=>Math.max(i+3,Math.min(It(r,a,(622-N)/164),e(N)-8)),f=o(128,26,950),m=o(-.485,0,-.875).normalize(),u=4,x=[f,f.clone().addScaledVector(m,34),f.clone().addScaledVector(m,70),o(54,26.5,861),l(-16,826,20),l(-41,784,19),l(-38,744,19),o(-15,i,713),o(4,i+1,694),o(15,i+2,664),o(21,h(622),622),o(24,h(585),585),o(26,h(545),545),o(31,h(505),505),o(43,Math.max(e(468)-9,h(505)+12),468),o(50,e(431)-3,431),o(34,e(392)+5,392),o(22,e(360)+10,360),o(1,e(326)+11,326),l(-13,290,10),l(-15,244,10),l(-12,196,11),l(-9,154,14),o(-11,Math.max(t.heightAt(-11,127)+10,s.y-17),127),s,s.clone().lerp(c,.5),c];for(let N=u+5;N<x.length-3;N++)x[N].y=Math.max(x[N].y,x[N-1].y+.5);const w=new g.CatmullRomCurve3(x,!1,"centripetal");w.arcLengthDivisions=Math.max(400,x.length*60);let A=w.getSpacedPoints(300);for(let N=0;N<3;N++){const $=new Float32Array(x.length);let et=!1;for(const J of A){if(J.x>.5)continue;const xt=8-(J.y-t.heightAt(J.x,J.z));if(xt<=0)continue;let dt=0,wt=1e9;for(let L=1;L<x.length-3;L++){const C=x[L].distanceToSquared(J);C<wt&&(wt=C,dt=L)}dt>0&&($[dt]=Math.max($[dt],xt+.5),et=!0)}if(!et)break;for(let J=1;J<x.length-3;J++)x[J].y+=$[J];w.updateArcLengths(),A=w.getSpacedPoints(300)}const M=(N,$)=>new g.CatmullRomCurve3(N,!1,"centripetal").getLengths((N.length-1)*40)[$*40],z=M(x,u),D=M([o(60,26,970),o(46,26,913),o(24,27.5,868)].concat(x.slice(u)),3),P=w.getLength(),G=P-z+D;return{pts:x,samples:A,start:s,end:c,length:P,Lold:G,toLegacy:N=>{const $=N*P;return $>=z?($-z+D)/G:$*D/(z*G)},fromLegacy:N=>{const $=N*G;return $>=D?($-D+z)/P:$*z/(D*P)}}}function Ut(){return{pos:[],nrm:[],uv:[],col:[],info:[],edge:[],wide:[],idx:[],n:0}}function Jt(t,e,o,l,d,p,y,c,s,i=0,r=0,a=null){return t.pos.push(e[0],e[1],e[2]),t.nrm.push(o[0],o[1],o[2]),t.uv.push(l,d),t.col.push(p.r,p.g,p.b),t.info.push(y,c,s,i),t.edge.push(r),a?t.wide.push(a[0],a[1],a[2]):t.wide.push(0,0,0),t.n++}function Rt(t){const e=new g.BufferGeometry;return e.setAttribute("position",new g.Float32BufferAttribute(t.pos,3)),e.setAttribute("normal",new g.Float32BufferAttribute(t.nrm,3)),e.setAttribute("uv",new g.Float32BufferAttribute(t.uv,2)),e.setAttribute("aCol",new g.Float32BufferAttribute(t.col,3)),e.setAttribute("aInfo",new g.Float32BufferAttribute(t.info,4)),e.setAttribute("aEdge",new g.Float32BufferAttribute(t.edge,1)),e.setAttribute("aWide",new g.Float32BufferAttribute(t.wide,3)),e.setIndex(t.idx),e}function te(t,e,o,l,d,p,y,c,s,i){const r=t.n;for(let a=0;a<=d;a++){const h=a/d,f=e(h),m=o(h);for(let u=0;u<=l;u++){const x=u/l*Math.PI*2,w=Math.cos(x),A=Math.sin(x);Jt(t,[f[0]+w*m,f[1],f[2]+A*m],[w,.08,A],x*Math.max(m,.2),f[1],p,y,c*h,s,0,0,i?[w*m,0,A*m]:null)}}for(let a=0;a<d;a++)for(let h=0;h<l;h++){const f=r+a*(l+1)+h,m=f+1,u=f+l+1,x=u+1;t.idx.push(f,u,m,m,u,x)}}function Gt(t,e,o,l,d,p,y,c,s,i=1,r=1){const a=t.n;let h=0;for(let f=0;f<e.length;f++){const m=e[f],u=e[Math.min(f+1,e.length-1)],x=e[Math.max(f-1,0)];f>0&&(h+=Math.hypot(m[0]-x[0],m[1]-x[1],m[2]-x[2]));const w=u[0]-x[0],A=u[1]-x[1],M=u[2]-x[2];let z=l[1]*M-l[2]*A,D=l[2]*w-l[0]*M,P=l[0]*A-l[1]*w;const G=Math.hypot(z,D,P)||1;z/=G,D/=G,P/=G;const _=o[f],Q=f/(e.length-1),N=y+(c-y)*Q;Jt(t,[m[0]-l[0]*_,m[1]-l[1]*_,m[2]-l[2]*_],[z,D,P],-_*i,h*i,d,p,N,s,r,-1),Jt(t,[m[0]+l[0]*_,m[1]+l[1]*_,m[2]+l[2]*_],[z,D,P],_*i,h*i,d,p,N,s,r,1)}for(let f=0;f<e.length-1;f++){const m=a+f*2;t.idx.push(m,m+1,m+2,m+1,m+3,m+2)}}function ge(t,e,o,l,d,p,y,c,s,i,r,a=0){const h=t.n,f=[];for(let x=0;x<l;x++)f.push(1+p*(y()-.5)*2);for(let x=0;x<d;x++){const w=x/d*Math.PI*.5,A=Math.cos(w),M=Math.sin(w);for(let z=0;z<=l;z++){const D=z/l*Math.PI*2+x*.35,P=f[z%l]*(1+(x%2?p*.5:0)),G=Math.cos(D)*A*e*P,_=Math.sin(D)*A*e*P,Q=M*o*(.9+.2*f[(z+x)%l]);Jt(t,[G,Q,_],[Math.cos(D)*A,M*.9+.1,Math.sin(D)*A],D*e,Q,c,s,r*M,i,a)}}const m=Jt(t,[0,o*1.02,0],[0,1,0],0,o,c,s,r,i,a);for(let x=0;x<d-1;x++)for(let w=0;w<l;w++){const A=h+x*(l+1)+w,M=A+1,z=A+l+1,D=z+1;t.idx.push(A,z,M,M,z,D)}const u=h+(d-1)*(l+1);for(let x=0;x<l;x++)t.idx.push(u+x,m,u+x+1)}const d0=`
attribute vec3 aCol; attribute vec4 aInfo; attribute float aEdge; attribute vec3 aWide; attribute vec4 aInst;
uniform float uTime, uResY; uniform vec2 uWind; uniform vec2 uGrow;
varying vec2 vUv; varying vec3 vCol; varying vec3 vN; varying vec3 vNv; varying vec3 vVp; varying vec4 vInfo;
varying float vEdge; varying float vDist; varying float vTone; varying float vSnow;
${Zt}
void main(){
  float isDrift = step(4.2, aInfo.w)*step(aInfo.w, 4.5);            // a rock's snowdrift is folded away where no snow lies
  // (round 12) uGrow: the size of every plant of this material (x), and of those marked aInst.w = -1 (y), as a share of
  // its own: each grows from, or shrinks to, the point it stands on (the hero's growth uniforms; 1 where nothing grows)
  float gk = aInst.w < -0.5 ? uGrow.y : uGrow.x;
  vec4 wp = instanceMatrix*vec4(position*mix(1., aInst.w, isDrift)*gk, 1.);
  float g = sin(uTime*1.1 + wp.x*0.045 + wp.z*0.03 + aInst.y)*(0.6 + 0.4*sin(uTime*0.37 + wp.z*0.011))
          + 0.25*sin(uTime*3.1 + aInst.y*7. + position.y);
  wp.xz += uWind*g*aInfo.y;
  wp.y -= abs(g)*aInfo.y*0.12;
  vec4 mvPosition = modelViewMatrix*wp;
  float dist = length(mvPosition.xyz);
  mat3 im = mat3(instanceMatrix);
  vec3 wv = im*aWide*gk; float wl = length(wv);
  if (wl > 1e-5) {
    float pxm = dist*2.0/(projectionMatrix[1][1]*uResY);
    mvPosition.xyz += mat3(modelViewMatrix)*wv*(max(1., 0.8*pxm/wl) - 1.);
  }
  vN = im*normal; vNv = mat3(modelViewMatrix)*vN; vVp = mvPosition.xyz;
  // (round 12) aInst.z: 0..1 thins the wash toward paper; under 0 it turns the plant's own green, toward gamboge down to
  // -1 and toward verditer from -1 to -2, so that plants of one mesh are not all one green
  vec3 hueC = aInst.z < -1. ? mix(aCol, aCol*vec3(0.8, 0.98, 1.1), clamp(-aInst.z - 1., 0., 1.)) : mix(aCol, aCol*vec3(1.1, 1.02, 0.66), clamp(-aInst.z, 0., 1.));
  vUv = uv; vCol = aInst.z >= 0. ? mix(aCol, vec3(1.), aInst.z) : hueC; vInfo = aInfo; vEdge = aEdge; vDist = dist; vTone = aInst.x; vSnow = max(aInst.w, 0.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,$e=`
varying vec2 vUv; varying vec3 vCol; varying vec3 vN; varying vec3 vNv; varying vec3 vVp; varying vec4 vInfo;
varying float vEdge; varying float vDist; varying float vTone; varying float vSnow;
uniform float uFarTint;
${Yt}
${_t}
void main(){
  float ff = gl_FrontFacing ? 1. : -1.;
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.))*ff;
  vec3 nv = normalize(vNv + vec3(0., 0., 1e-4))*ff;
  float ndl = clamp(dot(n, uSun), 0., 1.);
  float shade = 1. - smoothstep(0.15, 0.85, ndl);
  float kind = vInfo.w;
  float isBlade = step(0.5, kind)*step(kind, 1.5), isFol = step(1.5, kind)*step(kind, 2.5), isFea = step(2.5, kind)*step(kind, 3.5);
  float isRock = step(3.5, kind)*step(kind, 4.5), isFur = step(4.5, kind)*step(kind, 5.5), isHalfF = step(5.5, kind)*step(kind, 6.5);
  float isFrond = step(5.5, kind), thinK = max(max(isBlade, isFea), isFrond);
  // every derivative is taken here, before anything is discarded
  float fu = fwidth(vUv.x), fv = fwidth(vUv.y), fc = fwidth(vUv.x + vUv.y), fe = max(fwidth(vEdge), 1e-5);
  float across = mix(abs(vEdge), 0.5*(vEdge + 1.), isHalfF);        // 0 on the midrib or rachis, 1 on the margin
  float fa = fe*mix(1., 0.5, isHalfF);
  float slant = mix(0.8, 0.45, isFea);
  float cL = vUv.y - slant*across;
  float fL = max(fv + slant*fa, 1e-6);
  // snow lies on whatever faces up (rocks only)
  float cap = smoothstep(0.52, 0.72, n.y + 0.3*(vnoise(vUv*1.7 + 3.) - 0.5))*vSnow*isRock;
  cap = max(cap, step(4.2, kind)*isRock*vSnow);
  float tone = vInfo.x + vTone + shade*mix(0.42, 0.18, thinK) + isFol*(1. - smoothstep(-0.5, 0.15, n.y))*0.3;
  tone = mix(tone, mix(vInfo.x + vTone + 0.15 + shade*0.45, 0.05, cap), isRock);
  tone = clamp(tone, 0., 1.);
  vec2 hA = hatch(vUv.y, fv, 0.3, vInfo.z, tone);
  vec2 hB = hatch(vUv.x, fu, 0.3, vInfo.z, tone);
  vec2 hC = hatch(vUv.x + vUv.y, fc, 0.3, vInfo.z, tone);
  vec2 hL = hatch(cL, fL, 0.3, vInfo.z, tone);
  float lA = smoothstep(0.1, 0.3, tone), lB = smoothstep(0.45, 0.65, tone), lC = smoothstep(0.75, 0.92, tone);
  float brk = step(0.4, vnoise(vUv*vec2(4., 1.3)));
  float ink = 1. - (1. - hA.x*lA)*(1. - hB.x*lB*brk)*(1. - hC.x*lC*0.75);
  // rock: contours and one diagonal on the dark side, a few strokes on the snow
  float rockInk = 1. - (1. - hA.x*lA)*(1. - hC.x*smoothstep(0.5, 0.7, tone)*0.85);
  ink = mix(ink, rockInk, isRock);
  // coat: strokes that run along the body, broken into hairs
  float hair = step(0.4, vnoise(vec2(vUv.x*8., vUv.y*2.6)));
  ink = mix(ink, hB.x*smoothstep(0.05, 0.25, tone)*hair, isFur);
  // blades and feathers
  float narrow = smoothstep(0.3, 0.8, fe)*(1. - smoothstep(0.2, 0.4, tone));   // a pale leaf a few pixels wide keeps its paper
  float midrib = lineAA(across, fa, mix(1.0, 0.75, isFea))*(1. - narrow);
  float margin = lineAA(1. - abs(vEdge), fe, 1.1)*(1. - 0.7*narrow);
  float thinInk = max(max(hL.x*smoothstep(0.03, 0.2, tone), midrib*0.9), margin);
  // pinnate fronds near the camera: leaflets
  float Pl = 0.34;
  float lodF = smoothstep(5., 10., Pl/fL)*isFrond;
  float tl = cL/Pl; float tk = floor(tl + 0.5); float td = abs(tl - tk);
  float lw = mix(0.5, 0.4*(1. - 0.72*across*across), lodF);
  float leafEdge = lineAA((td - lw)*Pl, fL, 0.8)*step(0.07, across);
  float leafVein = lineAA(td*Pl, fL, 0.45)*0.6*step(0.05 + 0.3*h11(tk), across);
  thinInk = mix(thinInk, max(max(leafEdge, leafVein), midrib), lodF);
  ink = mix(ink, thinInk, thinK);
  if (lodF > 0.02 && td > lw && across > 0.09) discard;
  float rim = 1. - abs(dot(nv, normalize(-vVp + vec3(0., 0., 1e-5))));
  ink = max(ink, smoothstep(0.7, 0.88, rim)*(1. - thinK)*(0.9 - 0.5*isFol));
  // foliage: rows of small arcs, the engraver's leaf masses; near the camera the outline of a mass breaks into leaves
  vec2 sg = vUv/0.8 + vec2(0., 0.31*sin(vUv.x*1.9)); sg.x += 0.5*floor(sg.y);
  vec2 sc = fract(sg) - vec2(0.5, 0.12 + 0.2*h21(floor(sg)));
  float sd = (length(sc) - 0.43)*0.8;
  float fuv = max(fu, fv);
  float folNear = isFol*(1. - smoothstep(0.05, 0.14, fuv));
  if (folNear > 0.5 && rim > 0.6 + 0.22*h21(floor(sg) + 3.) && sd > -0.03) discard;
  float arcs = lineAA(sd, fuv, 0.4 + 0.35*tone)*max(step(0.0, sc.y), folNear*smoothstep(0.55, 0.7, rim))*(1. - smoothstep(0.1, 0.24, fuv));
  ink = max(ink*(1. - 0.45*isFol), arcs*isFol);
  float wa = seep(vDist, fract(mix(hA.y, hL.y, thinK) + 0.25));
  vec3 wash = vCol*mix(vec3(1.), uShade, shade*0.3);           // shade is a verditer glaze: black stays black
  wash = mix(wash, vec3(1.), cap);
  // beyond the island of watercolour the print keeps one flat tint, the second plate: a thin verditer that sets the far
  // ranks back from the near ones, and their ink thins toward the half-tone with it
  float farK = smoothstep(uWash.x*0.9, uWash.y*1.25, vDist)*uFarTint*(1. - isRock);
  float crownK = max(thinK, isFol);
  vec3 farT = mix(mix(vec3(1.), vCol, 0.5), mix(vec3(1.), uShade, 0.62)*mix(vec3(1.), vCol, 0.55), crownK);
  farT = mix(farT, vec3(1.), 0.4*smoothstep(220., 650., vDist));
  ink *= 1. - 0.12*farK;
  vec3 inkc = mix(uInk, uHalf, max(smoothstep(150., 700., vDist), 0.25*farK));
  vec3 pc = uPaper*mix(vec3(1.), wash, clamp(wa, 0., 1.))*mix(vec3(1.), farT, farK*(1. - cap)*(1. - 0.7*clamp(wa, 0., 1.)));
  vec3 col = mix(pc, inkc, clamp(ink, 0., 1.));
  ${jt}
}`;function lo(t,e){const o=Ut(),l=E(e.pal[2],.5),d=e.green.clone().multiplyScalar(.8),p=t.range(-1.2,1.2),y=50;te(o,s=>[p*s*s,y*s,.6*p*Math.sin(s*2.4)],s=>.55-.2*s+.12*Math.exp(-s*14),6,4,l,.2,.9,70,!0);const c=[p,y,.6*p*Math.sin(2.4)];for(let s=0;s<9;s++){const i=s/9*Math.PI*2+t.range(-.2,.2),r=t.range(.15,1),a=t.range(5.6,7.4),h=Math.cos(i),f=Math.sin(i),m=[],u=[];for(let x=0;x<=4;x++){const w=x/4,A=a*(Math.sin(w*1.45)/Math.sin(1.45)),M=r*a*.55*w-a*.62*w*w*(1.2-.5*r);m.push([c[0]+h*A,c[1]+M+.4,c[2]+f*A]),u.push((.25+1*Math.sin(Math.PI*Math.min(1,w*.9+.12)))*(1-.5*w))}Gt(o,m,u,[-f,0,h],d,.5,1.2,4.5,26,1,7)}return Rt(o)}function m0(t,e,o){const l=Ut(),d=[e.green.clone().multiplyScalar(.92),e.green.clone().lerp(e.olive,.5),e.green.clone().lerp(e.verd,.3)],p=E(e.pal[2],.6),y=e.olive.clone().lerp(e.verd,.35),c=o?20:4,s=[];for(let i=0;i<c;i++){const r=l.n,a=i/c*6.283+t.range(-.4,.4),h=i===0?.6:t.range(o?1.5:2.4,o?6.3:5),f=o?t.range(.9,1.6):t.range(3.3,4.8),m=Math.cos(a)*h,u=Math.sin(a)*h,x=o?t.range(3.2,7.8)-h*.3:t.range(1.6,4.4)-h*.25;ge(l,f,f*(o?t.range(.8,1.15):t.range(.7,1)),o?6:5,o&&i<3?3:2,.3,t,d[i%3],.34+.08*(i%3),o?2.4:3.6,.8,2);for(let w=r;w<l.n;w++)l.pos[w*3]+=m,l.pos[w*3+1]+=x,l.pos[w*3+2]+=u,l.uv[w*2]+=i*7.3;s.push([m,x,u,f])}if(o){te(l,a=>[.3*Math.sin(a*3),-2+8.5*a,.2*a],a=>.5-.28*a,5,2,p,.55,.1,30,!1);for(let a=0;a<3;a++){const h=s[1+a*3],f=2.2+a*.9;te(l,m=>[h[0]*m,It(f,h[1]+.2,m*m),h[2]*m],m=>.26-.14*m,4,2,a===1?y:p,.5,.2,30,!1);for(let m=0;m<2;m++){const u=.45+.35*m,x=t.range(.9,2),w=[h[0]*u,It(f,h[1]+.2,u*u)-.15,h[2]*u];Gt(l,[w,[w[0],w[1]-x,w[2]]],[.17,.02],[h[2]>0?.8:-.8,0,.6],y,.4,.05,.5,8,3)}}const i=s[4],r=[i[0]*.6,It(3.1,i[1]+.2,.36)+.1,i[2]*.6];for(let a=0;a<6;a++){const h=a/6*6.283,f=Math.cos(h),m=Math.sin(h),u=a===5;Gt(l,[r,[r[0]+f*(u?.1:.7),r[1]+(u?1.1:.8),r[2]+m*(u?.1:.7)]],[.15,.02],[-m,0,f],u?e.verm:e.green,u?.2:.4,.02,.2,6,3)}}return Rt(l)}function v0(t,e,o,l){const d=Ut(),p=E(e.pal[2],.62),y=E(e.pal[2],.85),c=E(e.pal[4],.2),s=o?e.gamb:E(e.pal[3],.3),i=1.5;if(te(d,a=>[.05*Math.sin(a*3),i*a,0],a=>l?.22:.38-.1*a,l?5:3,1,l?p:y,l?.62:.55,.1,8,!0),l)for(let a=0;a<2;a++)for(let h=0;h<6;h++){const f=(h+a*.5)/6*Math.PI*2+t.range(-.2,.2),m=Math.cos(f),u=Math.sin(f),x=i-.1-a*.56,w=t.range(.42,.56);Gt(d,[[m*.12,x,u*.12],[m*w,x-t.range(.55,.75),u*w]],[.2,.05],[-u,0,m],a?p:y,.5+.1*a,.02,.12,6,2.2)}const r=l?11:7;for(let a=0;a<r;a++){const h=a%3,f=a/r*Math.PI*2+t.range(-.2,.2),m=Math.cos(f),u=Math.sin(f),x=[.1,.5,1][h]+t.range(-.08,.08),w=[1.2,1.02,.72][h],A=Math.cos(x),M=Math.sin(x),z=l?[[m*.06,i-.05,u*.06],[m*w*A*.5,i+w*M*.56+.08,u*w*A*.5],[m*w*A,i+w*M,u*w*A]]:[[m*.06,i-.05,u*.06],[m*w*A,i+w*M,u*w*A]];Gt(d,z,l?[.1,.25,.03]:[.31,.04],[-u,0,m],h===2?s:c,-.06+.05*h,.15,.45,6,2.2)}if(l&&o)for(let a=0;a<3;a++){const h=a*2.1+t.range(-.3,.3),f=Math.cos(h)*.35,m=Math.sin(h)*.35;Gt(d,[[0,i,0],[f*.6,i+.75,m*.6],[f,i+1,m]],[.025,.025,.13],[-m,0,f],e.gamb,.2,.2,.6,6,3)}return Rt(d)}function u0(t,e){const o=Ut(),l=E(e.pal[2].clone().lerp(e.pal[1],.5),.62),d=(p,y,c,s,i,r,a,h,f,m,u=4)=>{const x=o.n;ge(o,p,y,c,2,.42,t,l,m,6,0,u);for(let w=x;w<o.n;w++){const A=o.pos[w*3],M=o.pos[w*3+1],z=o.pos[w*3+2];o.pos[w*3]=A*a+M*f+s,o.pos[w*3+1]=M+i,o.pos[w*3+2]=z*h-M*f*.6+r,o.uv[w*2]+=x*.37}};return d(.62,.85,6,0,0,0,1.25,.85,.3,.34),d(.42,.55,6,-.55,-.04,.3,1,1.2,-.3,.4),d(.3,.4,5,.5,-.03,-.42,1.1,.9,.2,.3),d(.55,.13,5,1.25,-.03,-.75,2.3,.75,0,0,4.3),Rt(o)}function x0(t,e,o,l){const d=Ut(),p=o?E(e.pal[4],.9):E(e.pal[3].clone().lerp(e.pal[2],.5),.6),y=E(e.pal[4].clone().lerp(e.pal[3],.5),.5);if(l){const c=i=>[.12*Math.sin(i*2.2),.5+3.5*i,0],s=i=>.1+.42*Math.pow(Math.sin(Math.PI*Math.min(1,i*.86+.14)),1.5)*(.35+.65*i);for(let i=0;i<17;i++){const r=i/17*Math.PI*2+t.range(-.15,.15),a=Math.cos(r),h=Math.sin(r),f=i%3,m=[1.9,1.55,1.1][f]*t.range(.88,1.1),u=[.35,.8,1.25][f];Gt(d,[[a*.08,.15,h*.08],[a*m*.5,.15+u*.62,h*m*.5],[a*m,.15+u*(f?1:.55),h*m]],[.13,.1,.012],[-h,0,a],f===2?y.clone().lerp(e.green,.4):y,.2+.1*f,.03,.22,8,2.5)}te(d,c,s,7,5,o?E(e.pal[3],.55):p,.45,.25,4,!0);for(let i=0;i<7;i++)for(let r=0;r<5;r++){const a=.2+.11*i,h=c(a),f=s(a),m=r/5*Math.PI*2+i*.7+t.range(-.2,.2),u=Math.cos(m),x=Math.sin(m),w=t.range(.3,.5);Gt(d,[[h[0]+u*f*.8,h[1],h[2]+x*f*.8],[h[0]+u*(f+w),h[1]+w*.8,h[2]+x*(f+w)]],[.1,.015],[-x,0,u],o?E(e.pal[4],1).multiplyScalar(.9):E(e.pal[2],.75),o?.3:.5,.2*a,.3*a,6,3)}return Rt(d)}te(d,c=>[.12*Math.sin(c*2.2),.4+3.6*c,0],c=>.12+.5*Math.pow(Math.sin(Math.PI*Math.min(1,c*.86+.14)),1.5)*(.35+.65*c),5,3,p,.5,.25,10,!0);for(let c=0;c<6;c++){const s=c/6*Math.PI*2+t.range(-.3,.3),i=Math.cos(s),r=Math.sin(s);Gt(d,[[i*.1,.1,r*.1],[i*1.25,t.range(.5,1),r*1.25]],[.2,.03],[-r,0,i],y,.3,.05,.3,8,2)}return Rt(d)}function ro(t,e){const o=Ut();return ge(o,1.5,.95,6,2,.2,t,e.green,.3,9,0),Rt(o)}function re(t,e,o,l,d){const p=[],y=o.samples;for(let c=0;p.length<l&&c<l*14;c++){let s,i;const r=Math.sqrt(It(d.rMin*d.rMin,d.rMax*d.rMax,t()));if(t()<d.seam){if(s=-(d.edge+Math.abs(t.gauss())*d.seamW),-s>r*.9)continue;i=Math.sqrt(r*r-s*s)*(t()<d.south?1:-1)}else{const x=t.range(-1.5,1.5);s=-r*Math.cos(x)-d.edge,i=r*Math.sin(x)}const a=e.heightAt(s,i),h=a+14*(t()-.5);if(h<d.lo||h>d.hi||i>0&&i<135&&Math.abs(s-Ft)<11+d.rad)continue;const f=t.range(d.s0,d.s1),m=a+d.h*f+(d.low?-.5:4);let u=!0;for(let x=0;x<y.length;x++){const w=y[x];if(w.y<a-3||w.y>m+5)continue;const A=w.x-s,M=w.z-i,z=(d.low?3.5:9)+d.rad*f;if(A*A+M*M<z*z){u=!1;break}}u&&p.push({x:s,y:a,z:i,s:f,rot:t()*Math.PI*2,tone:t.range(-.08,.1),ph:t()*6.28})}return p}function Mt(t,e,o,l,d){const p=new g.InstancedMesh(t,e,Math.max(1,o.length)),y=new g.Matrix4,c=new g.Quaternion,s=new g.Quaternion,i=new g.Vector3(0,1,0),r=new g.Vector3,a=new g.Vector3,h=new Float32Array(Math.max(1,o.length)*4);return o.forEach((f,m)=>{c.setFromAxisAngle(i,f.rot),f.up&&c.premultiply(s.setFromUnitVectors(i,f.up)),r.setScalar(f.s),a.set(f.x,f.y-l*f.s,f.z),p.setMatrixAt(m,y.compose(a,c,r)),h.set([f.tone+(f.dark||0),f.ph,d?d(f):0,f.snow||0],m*4)}),p.count=o.length,t.setAttribute("aInst",new g.InstancedBufferAttribute(h,4)),p.instanceMatrix.needsUpdate=!0,p.frustumCulled=!1,p}const ee=18,y0=`
attribute vec3 aCol; attribute vec4 aSpec; attribute vec3 aPivot; attribute float aEdge; attribute float aW;
uniform float uP[${ee}]; uniform vec4 uOff[${ee}]; uniform float uD[${ee}]; uniform vec3 uCtr[${ee}]; uniform vec2 uPose[${ee}];   // uPose: tilt in the page, scale
uniform float uTime, uOutline;
varying vec2 vUv; varying vec3 vCol; varying float vEdge; varying float vP; varying float vTone; varying float vDist;
${Zt}
void main(){
  int k = int(aSpec.x + 0.5); float type = aSpec.y;
  float p = uP[k]; vec4 off = uOff[k]; float d = uD[k]; vec3 ctr = uCtr[k]; float tilt = uPose[k].x; float scl = uPose[k].y;
  if (uOutline > 0.5) { p = 0.; off = vec4(0.); d = 0.; tilt = 0.; }
  float lift = smoothstep(0.3, 0.5, p), open = smoothstep(0.06, 0.3, p);
  float stride = 1.6*scl;
  vec3 rel = position - aPivot;
  if (type > 0.5 && type < 1.5) {            // wing beating out of the page (about the north axis)
    float a = aW*sin(uTime*34. + aSpec.z)*lift;
    float c = cos(a), s = sin(a);
    rel = vec3(rel.x*c - rel.y*s, rel.x*s + rel.y*c, rel.z);
  } else if (type > 1.5 && type < 2.5) {     // wing case: swings up in the page, then tilts out of it
    float a = aW*open, c = cos(a), s = sin(a);
    rel = vec3(rel.x, rel.y*c - rel.z*s, rel.y*s + rel.z*c);
    rel.x += abs(rel.y)*0.35*open;
  } else if (type > 2.5 && type < 3.5) {     // leg: the foot is pinned through stance
    float ph = fract(d/stride + aSpec.z);
    float sw = clamp((ph - 0.65)/0.35, 0., 1.);
    float fwd = ph < 0.65 ? (0.5 - ph/0.65) : (-0.5 + sw*sw*(3. - 2.*sw));
    rel.z -= fwd*0.65*stride*aW;              // travel is toward -Z (north, with the camera)
    rel.y += 0.24*scl*sin(3.14159*sw)*aW*step(0.65, ph);
  } else if (type > 3.5 && type < 4.5) {     // petal: unfolds from the bud
    float a = aW*(1. - open), c = cos(a), s = sin(a);
    rel = vec3(rel.x, rel.y*c - rel.z*s, rel.y*s + rel.z*c)*mix(0.4, 1., open);
  } else if (type > 4.5 && type < 5.5) {     // hind wing: hidden under the case, then whirring
    float a = aW*(0.5 + 0.5*sin(uTime*30. + aSpec.z))*lift, c = cos(a), s = sin(a);
    rel = vec3(rel.x*c + abs(rel.z)*s, rel.y, rel.z*c)*open;
  } else if (type > 5.5 && type < 6.5) {     // a butterfly's wing: opens and closes slowly off the paper
    float a = aW*(0.12 + 0.88*(0.5 + 0.5*sin(uTime*2.7 + aSpec.z)))*lift, c = cos(a), s = sin(a);
    rel = vec3(rel.x*c + abs(rel.z)*s, rel.y, rel.z*c);
  } else if (type > 6.5 && type < 7.5) {     // sway or nod in the plane of the page
    float a = aW*sin(uTime*1.6 + aSpec.z)*open, c = cos(a), s = sin(a);
    rel = vec3(rel.x, rel.y*c - rel.z*s, rel.y*s + rel.z*c);
  } else if (type > 7.5) {                   // a slow wing of a bird drawn from above: it lifts off the paper and falls back
    float a = aW*(0.5 + 0.5*sin(uTime*7. + aSpec.z))*lift, c = cos(a), s = sin(a);
    rel = vec3(rel.x*c - rel.y*s, rel.x*s + rel.y*c, rel.z);
  }
  vec3 pos = aPivot + rel;
  if (type < 0.5) pos.y += 0.035*scl*sin(d/stride*12.566)*step(1e-4, d);   // a walker's back rises twice a stride
  vec3 q = pos - ctr;
  float ct = cos(tilt), st = sin(tilt);
  q = vec3(q.x, q.y*ct - q.z*st, q.z*ct + q.y*st);                          // tilt in the page: north goes up
  float cy = cos(off.w), sy = sin(off.w);
  q = vec3(q.x*cy + q.z*sy, q.y, -q.x*sy + q.z*cy);
  pos = ctr + q + off.xyz;
  vUv = uv; vCol = aCol; vEdge = aEdge; vP = uOutline > 0.5 ? 1. : p; vTone = aSpec.w;
  vec4 mvPosition = modelViewMatrix*vec4(pos, 1.);
  vDist = length(mvPosition.xyz);
  gl_Position = projectionMatrix*mvPosition;
  if (uOutline < 0.5 && p <= 0.001) gl_Position = vec4(0., 0., 3., 1.);
  if (uOutline > 0.5 && aSpec.x > ${we}.0 - 0.5) gl_Position = vec4(0., 0., 3., 1.);       // residents leave no outline behind
  #include <fog_vertex>
}`,w0=`
varying vec2 vUv; varying vec3 vCol; varying float vEdge; varying float vP; varying float vTone; varying float vDist;
uniform float uOutline;
${Yt}
${_t}
void main(){
  float fe = fwidth(vEdge), fu = fwidth(vUv.x), fv = fwidth(vUv.y);
  float edge = lineAA(1. - abs(vEdge), fe, 1.25);
  vec3 col;
  if (uOutline > 0.5) {
    if (edge < 0.25) discard;
    col = mix(uPaper, uInk, edge*0.8);
  } else {
    if (vP <= 0.001) discard;
    float tone = clamp(vTone + 0.3*(0.5 - 0.5*vEdge), 0., 1.);
    vec2 hA = hatch(vUv.y, fv, 0.05, 4., tone);
    vec2 hB = hatch(vUv.x, fu, 0.07, 4., tone);
    float hair = step(0.35, vnoise(vec2(vUv.x*5., vUv.y*40.)));
    float lA = smoothstep(0.1, 0.3, tone), lB = smoothstep(0.8, 0.95, tone);
    float ink = 1. - (1. - hA.x*lA*hair)*(1. - hB.x*lB*0.8);
    ink = max(ink, edge)*smoothstep(0., 0.12, vP);
    float s = smoothstep(0.03, 0.3, vP)*1.05;
    float wa = smoothstep(hA.y*0.8, hA.y*0.8 + 0.2, s)*smoothstep(-0.97, -0.8, vEdge);
    col = plate(vCol, wa, ink, 0.);
  }
  ${jt}
}`;function fo(){return{pos:[],uv:[],col:[],spec:[],piv:[],edge:[],w:[],idx:[],n:0}}const fe=new g.CatmullRomCurve3([new g.Vector3,new g.Vector3]);function b(t,e,o,l,d){const p=d.n||9,y=t.n,c=t.s||1,s=t.flip||1;fe.points=o.map(m=>new g.Vector3(m[0],m[1],0)),fe.curveType="centripetal",fe.updateArcLengths();const i=fe.getLength(),r=d.pivot||o[0],a=.07+(d.layer||0)*.012*c,h=new g.Vector3,f=new g.Vector3;for(let m=0;m<=p;m++){const u=m/p;fe.getPointAt(u,h),fe.getTangentAt(u,f);const x=Math.max(.004,l(u)),w=-f.y,A=f.x,M=d.wgt?d.wgt(u):1;for(let z=-1;z<=1;z+=2){const D=(h.x+w*x*z)*s*c,P=(h.y+A*x*z)*c;t.pos.push(e[0]+a,e[1]+P,e[2]-D),t.uv.push(u*i,z*x),t.col.push(d.col.r,d.col.g,d.col.b),t.spec.push(d.id,d.type||0,d.phase||0,d.tone??.3),t.piv.push(e[0]+a,e[1]+r[1]*c,e[2]-r[0]*s*c),t.edge.push(z),t.w.push(M),t.n++}}for(let m=0;m<p;m++){const u=y+m*2;t.idx.push(u,u+1,u+2,u+1,u+3,u+2)}}function ho(t){const e=new g.BufferGeometry;return e.setAttribute("position",new g.Float32BufferAttribute(t.pos,3)),e.setAttribute("uv",new g.Float32BufferAttribute(t.uv,2)),e.setAttribute("aCol",new g.Float32BufferAttribute(t.col,3)),e.setAttribute("aSpec",new g.Float32BufferAttribute(t.spec,4)),e.setAttribute("aPivot",new g.Float32BufferAttribute(t.piv,3)),e.setAttribute("aEdge",new g.Float32BufferAttribute(t.edge,1)),e.setAttribute("aW",new g.Float32BufferAttribute(t.w,1)),e.setIndex(t.idx),e}const B=(t,e=.6)=>o=>t*Math.pow(Math.sin(Math.PI*o),e),pt=new g.Color(1,1,1),g0={orchid(t,e,o,l,d){const p=l.green,y=l.verm;b(t,e,[[-.04,0],[-.3,.5],[-.62,1.05]],B(.17,.8),{id:o,col:p,tone:.35,layer:0}),b(t,e,[[.05,0],[.36,.45],[.66,.86]],B(.15,.8),{id:o,col:p,tone:.45,layer:0}),b(t,e,[[0,0],[.12,.3],[.2,.52]],B(.1,.8),{id:o,col:p,tone:.5,layer:1}),b(t,e,[[0,0],[.07,.7],[.02,1.25],[.06,1.62]],()=>.022,{id:o,col:p,tone:.7,layer:1});const c=[.06,1.62],s=i=>.025+.36*Math.pow(Math.sin(Math.PI*Math.min(1,i*2.2)),.8)*(i<.455?1:0);[90,215,325].forEach((i,r)=>{const a=i*Math.PI/180+d.range(-.08,.08),h=r?1.3:1.05,f=Math.cos(a),m=Math.sin(a),u=r===0?0:r===1?-.14:.14;b(t,e,[c,[c[0]+f*h*.4,c[1]+m*h*.4],[c[0]+f*h*.8+u,c[1]+m*h*.8-Math.abs(u)],[c[0]+f*h+u*2,c[1]+m*h-Math.abs(u)*2.4]],s,{id:o,col:y,tone:.3,layer:2+r,type:4,pivot:c,wgt:()=>r===0?0:r===1?-2:2,n:12})}),b(t,e,[[c[0]-.02,c[1]-.02],[c[0]+.02,c[1]-.16]],B(.05),{id:o,col:l.gamb,tone:.2,layer:5,type:4,pivot:c,wgt:()=>0,n:5})},hummingbird(t,e,o,l,d){const p=l.green,y=l.verd,c=[-.02,1.32];for(let s=0;s<2;s++)for(let i=0;i<5;i++){const r=(s?2.05:1.55)+i*.17,a=(s?1:.85)*(.72+.28*Math.sin(i/4*Math.PI*.8+.6));b(t,e,[c,[c[0]+Math.cos(r)*a*.5,c[1]+Math.sin(r)*a*.5+.03],[c[0]+Math.cos(r)*a,c[1]+Math.sin(r)*a]],B(.075,.5),{id:o,col:y,tone:s?.5:.7,layer:s?6+i:i*.2,type:1,pivot:c,phase:s?0:.5,wgt:()=>s?1:-.9,n:6})}[[-.72,.12],[-.56,.02],[-.88,.3]].forEach((s,i)=>b(t,e,[[-.3,.84],[(s[0]-.3)/2,(s[1]+.84)/2+.03],s],B(.075,.5),{id:o,col:p,tone:.75,layer:2+i*.2,n:6})),b(t,e,[[-.4,.72],[-.12,1.1],[.06,1.4],[.2,1.66]],B(.25,.7),{id:o,col:p,tone:.45,layer:3,n:10}),b(t,e,[[.1,1.5],[.26,1.68],[.44,1.8]],B(.15,.6),{id:o,col:p,tone:.6,layer:4,n:7}),b(t,e,[[.38,1.76],[.9,2.02],[1.5,2.36]],s=>.034*(1-.8*s),{id:o,col:pt,tone:.95,layer:5,n:6}),b(t,e,[[.27,1.72],[.3,1.74]],B(.03),{id:o,col:pt,tone:1,layer:5.5,n:4})},tapir(t,e,o,l,d){const p=E(l.pal[2],.75),y=E(l.pal[1],.5),c=i=>(.2-.09*i)*(i>.9?Math.sqrt(Math.max(0,(1-i)/.1)):1)+.03*Math.exp(-Math.pow((i-.5)/.1,2)),s=(i,r,a)=>b(t,e,[[i,.98],[i+(a?.05:-.04),.5],[i,0]],c,{id:o,col:a?y:p,tone:a?.9:.55,layer:a?0:4,type:3,pivot:[i,.98],phase:r,wgt:h=>Math.pow(h,1.25),n:8});s(-.62,.75,!0),s(.92,.5,!0),b(t,e,[[1.28,1.5],[1.42,1.32]],B(.05),{id:o,col:y,tone:.9,layer:1,n:4}),b(t,e,[[1.3,1.22],[.6,1.36],[-.3,1.33],[-1,1.36]],i=>.6*Math.pow(Math.sin(Math.PI*(.06+.9*i)),.42),{id:o,col:p,tone:.5,layer:2,n:12}),b(t,e,[[-.7,1.45],[-1.3,1.6],[-1.75,1.48],[-2.12,1.14]],i=>.4*Math.pow(Math.sin(Math.PI*(.1+.85*i)),.6)*(1-.45*i),{id:o,col:p,tone:.42,layer:3,n:10}),b(t,e,[[-2,1.22],[-2.2,1.02],[-2.3,.84]],B(.09,.5),{id:o,col:y,tone:.85,layer:3.5,n:6}),b(t,e,[[-1.3,1.82],[-1.2,2],[-1.16,2.14]],B(.09,.6),{id:o,col:pt,tone:.15,layer:3.6,n:5}),b(t,e,[[-1.72,1.56],[-1.7,1.58]],B(.035),{id:o,col:pt,tone:1,layer:3.7,n:4}),s(-.78,.25,!1),s(.8,0,!1)},beetle(t,e,o,l,d){const p=l.gamb,y=E(l.pal[1],.6),c=E(l.pal[4],.3);for(let s=-1;s<=1;s+=2)b(t,e,[[.1*s,1],[.62*s,.98],[1.15*s,.72]],B(.3,.5),{id:o,col:c,tone:.12,layer:1,type:5,pivot:[.1*s,1],phase:s,wgt:()=>.7,n:8}),[[1.22,.5,.25],[1.05,.62,-.05],[.85,.7,-.5]].forEach((i,r)=>b(t,e,[[.2*s,i[0]],[(.2+i[1]*.55)*s,i[0]+.14],[(.2+i[1])*s,i[0]+i[2]]],a=>.04*(1-.6*a),{id:o,col:pt,tone:.95,layer:.2*r,n:6}));b(t,e,[[0,.08],[0,.55],[0,1.02]],B(.3,.55),{id:o,col:y,tone:.8,layer:2,n:8});for(let s=-1;s<=1;s+=2)b(t,e,[[.1*s,1.02],[.2*s,.55],[.08*s,.04]],B(.2,.5),{id:o,col:p,tone:.3,layer:3,type:2,pivot:[.12*s,1.02],wgt:()=>.95*s,n:9});b(t,e,[[0,.96],[0,1.2],[0,1.44]],B(.31,.5),{id:o,col:y,tone:.9,layer:4,n:8}),b(t,e,[[.03,1.36],[.16,1.75],[.12,2.05],[-.02,2.24]],s=>.075*(1-.7*s),{id:o,col:pt,tone:1,layer:5,n:9}),b(t,e,[[-.04,1.4],[-.16,1.6],[-.14,1.82]],s=>.05*(1-.7*s),{id:o,col:pt,tone:1,layer:4.5,n:6})},butterfly(t,e,o,l,d){const p=l.gamb.clone().lerp(l.verm,.5),y=E(l.pal[1],.6),c=E(l.pal[4],.18);for(let s=-1;s<=1;s+=2){const i=[[.06*s,1.5],[.7*s,1.95],[1.45*s,2.3]],r=[[.06*s,1.3],[.6*s,.95],[1*s,.45]],a={id:o,type:6,pivot:[0,1.4],phase:0,wgt:()=>1.1,n:9};b(t,e,r,B(.36,.55),{...a,col:p,tone:.55,layer:0}),b(t,e,r.map(h=>[h[0]*.84+.04*s,h[1]+.04]),B(.2,.6),{...a,col:c,tone:.12,layer:.5}),b(t,e,i,B(.44,.55),{...a,col:p,tone:.5,layer:1}),b(t,e,i.map(h=>[h[0]*.86+.05*s,h[1]-.02]),B(.27,.6),{...a,col:c,tone:.12,layer:2}),b(t,e,[[.03*s,1.72],[.2*s,2.1],[.42*s,2.3]],()=>.02,{id:o,col:y,tone:.9,layer:3,n:5})}b(t,e,[[0,.95],[0,1.4],[0,1.78]],B(.085,.5),{id:o,col:y,tone:.85,layer:3,n:7})},cinchona(t,e,o,l,d){const p=l.green,y=E(l.pal[6],.5),c=E(l.pal[2],.8),s=[.25,1.9];b(t,e,[[-.5,.05],[-.2,.75],[.1,1.4],s],()=>.03,{id:o,col:c,tone:.7,layer:0,n:8}),[[-.36,.4],[-.1,.98],[.14,1.5]].forEach((i,r)=>{for(let a=-1;a<=1;a+=2){const h=.95-r*.18,f=a>0?.35-r*.1:2.6+r*.12;b(t,e,[i,[i[0]+Math.cos(f)*h*.5,i[1]+Math.sin(f)*h*.5+.08],[i[0]+Math.cos(f)*h,i[1]+Math.sin(f)*h]],B(.2-r*.03,.7),{id:o,col:p,tone:.3+(a>0?.12:0),layer:1+r,type:7,pivot:i,phase:r*1.3+a,wgt:()=>.09,n:8})}});for(let i=0;i<9;i++){const r=.5+i/8*2.2,a=.34+.11*(i*7%3),h=[s[0]+Math.cos(r)*a,s[1]+Math.sin(r)*a+.1];b(t,e,[s,[(s[0]+h[0])/2,(s[1]+h[1])/2+.03],h],f=>.02+(f>.45?.075*Math.pow(Math.sin(Math.PI*Math.min(1,(f-.45)/.55)),.7):0),{id:o,col:y,tone:.25,layer:4+i*.1,type:4,pivot:s,wgt:()=>i%2?.9:-.9,n:8})}},cockrock(t,e,o,l,d){const p=l.verm,y=E(l.pal[1],.75),c=E(l.pal[4],.3),s=E(l.pal[2],.7);b(t,e,[[-1.3,.42],[-.3,.5],[.6,.4],[1.3,.52]],a=>.09-.03*a,{id:o,col:s,tone:.6,layer:0,n:8}),b(t,e,[[-.42,.9],[-.75,.62],[-1,.3]],B(.17,.5),{id:o,col:y,tone:.9,layer:1,n:6});for(let a=0;a<2;a++)b(t,e,[[-.1+a*.22,.86],[-.06+a*.22,.52]],()=>.025,{id:o,col:s,tone:.9,layer:1.5,n:4});b(t,e,[[-.5,.78],[-.12,1.12],[.22,1.5],[.4,1.8]],B(.4,.6),{id:o,col:p,tone:.3,layer:2,n:10}),b(t,e,[[-.52,.86],[-.2,1],[.08,1.3]],B(.2,.5),{id:o,col:y,tone:.92,layer:3,type:7,pivot:[.08,1.3],phase:1,wgt:()=>.12,n:7}),b(t,e,[[-.3,1.02],[-.12,1.2]],B(.13,.5),{id:o,col:c,tone:.12,layer:3.5,n:5});const i=[.3,1.7],r={id:o,type:7,pivot:i,phase:0,wgt:()=>.16};b(t,e,[[.2,1.7],[.42,1.95],[.62,2.05]],B(.2,.5),{...r,col:p,tone:.25,layer:4,n:7}),b(t,e,[[.3,1.86],[.62,2.3],[.98,2.02]],B(.22,.45),{...r,col:p,tone:.4,layer:5,n:9}),b(t,e,[[.5,1.98],[.52,2]],B(.04),{...r,col:pt,tone:1,layer:6,n:4})},frog(t,e,o,l,d){const p=l.gamb,y=E(l.pal[1],.75),c=l.green;b(t,e,[[-1.7,.1],[-.5,.3],[.8,.27],[1.75,.06]],B(.2,.6),{id:o,col:c,tone:.42,layer:0,n:9}),b(t,e,[[-.55,.78],[-1.2,.72],[-.75,.42],[-1.3,.36]],i=>.15*(1-.55*i),{id:o,col:p,tone:.55,layer:1,n:10});const s={id:o,type:7,pivot:[-.4,.5],phase:.4,wgt:()=>.035};b(t,e,[[-.9,.6],[-.35,.95],[.3,1.06],[.8,1]],B(.42,.55),{...s,col:p,tone:.28,layer:2,n:10}),[[-.45,.98,.12],[0,1.14,.1],[.3,.9,.09],[-.2,.74,.08]].forEach((i,r)=>b(t,e,[[i[0]-.14,i[1]],[i[0]+.14,i[1]+.03]],B(i[2],.5),{...s,col:y,tone:.95,layer:2.5+r*.05,n:5})),b(t,e,[[.7,.86],[1,.8],[1.2,.92]],B(.12,.6),{id:o,col:pt,tone:.1,layer:2.8,type:7,pivot:[.9,1],phase:0,wgt:()=>.12,n:6}),b(t,e,[[.55,1],[.95,1.15],[1.3,1.08]],B(.27,.5),{...s,col:p,tone:.3,layer:3,n:7}),b(t,e,[[.92,1.3],[.98,1.31]],B(.1),{...s,col:pt,tone:1,layer:4,n:4}),b(t,e,[[.55,.82],[.62,.5],[1,.36]],i=>.11*(1-.45*i),{id:o,col:p,tone:.45,layer:3.5,n:7})},toucan(t,e,o,l,d){const p=E(l.pal[4],.9),y=E(l.pal[1],.75),c=E(l.pal[2],.7),s=l.verm,i=l.gamb,r=E(l.pal[3].clone().lerp(l.pal[2],.4),.8);b(t,e,[[-1.4,.42],[-.3,.5],[.6,.4],[1.4,.52]],f=>.09-.03*f,{id:o,col:c,tone:.6,layer:0,n:8}),b(t,e,[[-.42,.95],[-.85,.5],[-1.1,.02]],B(.17,.5),{id:o,col:r,tone:.7,layer:1,type:7,pivot:[-.42,.95],phase:2,wgt:()=>.07,n:7}),b(t,e,[[-.5,.74],[-.42,.6]],B(.1,.5),{id:o,col:s,tone:.3,layer:1.2,n:4});for(let f=0;f<2;f++)b(t,e,[[-.1+f*.22,.86],[-.06+f*.22,.52]],()=>.025,{id:o,col:c,tone:.9,layer:1.5,n:4});b(t,e,[[-.5,.8],[-.12,1.14],[.22,1.52],[.38,1.84]],B(.4,.6),{id:o,col:p,tone:.3,layer:2,n:10}),b(t,e,[[-.55,.9],[-.22,1.04],[.06,1.36]],B(.21,.5),{id:o,col:r,tone:.75,layer:3,type:7,pivot:[.06,1.36],phase:1,wgt:()=>.1,n:7});const a=[.3,1.72],h={id:o,type:7,pivot:a,phase:0,wgt:()=>.14};b(t,e,[[.18,1.72],[.4,1.96],[.6,2.06]],B(.21,.5),{...h,col:y,tone:.9,layer:4,n:7}),b(t,e,[[.52,2.08],[1.05,2.16],[1.62,1.96]],f=>.15*(1-.6*f*f),{...h,col:i,tone:.2,layer:5,n:8}),b(t,e,[[.54,1.97],[1.05,2],[1.55,1.92]],f=>.07*(1-.5*f),{...h,col:s,tone:.3,layer:5.5,n:7}),b(t,e,[[.5,2.03],[.53,2.04]],B(.045),{...h,col:pt,tone:1,layer:6,n:4})},quetzal(t,e,o,l,d){const p=l.green,y=E(l.pal[3].clone().lerp(l.pal[4],.5),.95),c=l.verm,s=E(l.pal[2],.7);b(t,e,[[-1.2,2],[-.2,2.06],[.6,1.98],[1.3,2.08]],a=>.08-.03*a,{id:o,col:s,tone:.6,layer:0,n:8});for(let a=0;a<3;a++)b(t,e,[[-.2,2.2],[-.3-a*.07,1.3],[-.2-a*.18,.15+a*.45]],B(.1-a*.012,.5),{id:o,col:a===1?y:p,tone:.5+.1*a,layer:1+a*.2,type:7,pivot:[-.2,2.2],phase:a*.7,wgt:h=>.1*h,n:9});for(let a=0;a<2;a++)b(t,e,[[-.05+a*.16,2.2],[-.02+a*.16,2.02]],()=>.022,{id:o,col:s,tone:.9,layer:1.7,n:4});b(t,e,[[-.26,2.08],[-.1,2.5],[.1,2.95],[.2,3.2]],B(.36,.6),{id:o,col:c,tone:.3,layer:2,n:10}),b(t,e,[[-.34,2.2],[-.24,2.6],[-.02,3.02]],B(.24,.5),{id:o,col:p,tone:.55,layer:3,type:7,pivot:[-.02,3.02],phase:1,wgt:()=>.08,n:8});const i=[.15,3.1],r={id:o,type:7,pivot:i,phase:0,wgt:()=>.13};b(t,e,[[.08,3.08],[.24,3.32],[.4,3.42]],B(.2,.5),{...r,col:y,tone:.45,layer:4,n:7}),b(t,e,[[.38,3.42],[.56,3.4],[.68,3.33]],a=>.05*(1-.6*a),{...r,col:l.gamb,tone:.3,layer:5,n:5}),b(t,e,[[.33,3.44],[.35,3.45]],B(.04),{...r,col:pt,tone:1,layer:6,n:4})},fern(t,e,o,l,d){const p=l.green,y=E(l.pal[2],.75),c=l.gamb.clone().lerp(l.green,.5),s=-.55,i=[[s-.5,0],[s-.52,.8],[s-.45,1.6]];for(let a=0;a<=11;a++){const h=Math.PI-a*.6,f=.55*Math.pow(.86,a);i.push([s+.15+f*Math.cos(h),2.3+f*Math.sin(h)])}b(t,e,i,a=>.1*(1-.75*a),{id:o,col:y,tone:.6,layer:1,type:7,pivot:[s-.5,0],phase:0,wgt:a=>.04*a,n:34});const r=a=>[s+.15+1.1*a*a,2.9*a-.5*a*a];b(t,e,[r(0),r(.33),r(.66),r(1)],a=>.035*(1-.6*a),{id:o,col:y,tone:.7,layer:2,n:10});for(let a=1;a<=8;a++)for(let h=-1;h<=1;h+=2){const f=a/9,m=r(f),u=.75*(1-.55*f),x=h>0?.3+.35*f:2.6-.2*f,w=Math.cos(x),A=Math.sin(x);b(t,e,[m,[m[0]+w*u*.5,m[1]+A*u*.5+.05],[m[0]+w*u,m[1]+A*u]],B(.12*(1-.45*f),.7),{id:o,col:a%2?p:c,tone:.35+(h>0?.1:0),layer:3+a*.1,type:7,pivot:m,phase:a*.6+h,wgt:()=>.07,n:6})}},armadillo(t,e,o,l,d){const p=E(l.pal[2],.55).lerp(l.verm,.12),y=E(l.pal[6],.35),c=E(l.pal[1],.6);b(t,e,[[-.95,.5],[-1.5,.34],[-2,.12]],r=>.1*(1-.8*r),{id:o,col:y,tone:.5,layer:0,type:7,pivot:[-.95,.5],phase:1,wgt:()=>.08,n:7});for(const r of[-.62,.52])b(t,e,[[r,.42],[r+.05,.02]],()=>.07,{id:o,col:c,tone:.8,layer:.5,n:4});const s=r=>.42+.62*Math.pow(Math.sin(Math.PI*(.08+.84*r)),.7);for(let r=0;r<9;r++){const a=r/8,h=-1+1.9*a,f=s(a);b(t,e,[[h-.03,.32],[h+.02,(f+.32)/2],[h,f]],B(.15,.35),{id:o,col:p,tone:.3+.1*(r%2),layer:1+r*.1,type:7,pivot:[0,.3],phase:.3,wgt:()=>.012,n:6})}const i={id:o,type:7,pivot:[.9,.6],phase:0,wgt:()=>.1};b(t,e,[[.85,.62],[1.25,.5],[1.62,.3]],B(.17,.5),{...i,col:y,tone:.3,layer:2.2,n:7}),b(t,e,[[1,.76],[1.02,.98],[1.08,1.08]],B(.07,.5),{...i,col:y,tone:.5,layer:2.4,n:5}),b(t,e,[[1.24,.6],[1.26,.61]],B(.03),{...i,col:pt,tone:1,layer:2.6,n:4});for(const r of[-.7,.6])b(t,e,[[r,.42],[r-.04,0]],()=>.08,{id:o,col:y,tone:.5,layer:2.1,n:4})},snake(t,e,o,l,d){const p=l.green.clone().lerp(l.gamb,.35),y=[];for(let s=0;s<=16;s++){const i=s*.7,r=1.25-.06*s;y.push([Math.cos(i)*r*1.15,.55+Math.sin(i)*r*.42-.012*s])}const c={id:o,type:7,pivot:[0,.95],phase:0};b(t,e,y.concat([[0,.95],[.25,1.3],[.62,1.45]]),s=>.13*Math.min(1,.25+3*s)*(s>.95?1.3:1),{...c,col:p,tone:.45,layer:1,wgt:s=>.12*Ct((s-.86)/.14,0,1),n:64}),b(t,e,[[.7,1.46],[.95,1.5],[1.12,1.6]],()=>.016,{...c,col:l.verm,tone:.3,layer:2,wgt:()=>.12,n:4}),b(t,e,[[.5,1.5],[.52,1.51]],B(.03),{...c,col:pt,tone:1,layer:2.2,wgt:()=>.12,n:4})},oilbird(t,e,o,l,d){const p=l.gamb.clone().lerp(l.verm,.4).lerp(E(l.pal[2],.8),.3),y=p.clone().multiplyScalar(.72);for(let c=-1;c<=1;c++)b(t,e,[[-.5,0],[-1.1,c*.14],[-1.55,c*.26]],B(.1,.5),{id:o,col:y,tone:.5,layer:.5+.1*(c+1),n:5});for(let c=-1;c<=1;c+=2)for(let s=0;s<6;s++){const i=c*(1.3+s*.21),r=1.75-.13*s,a=[.2-s*.09,c*.08],h={id:o,type:8,pivot:[.1,0],phase:0,wgt:()=>-.95*c};b(t,e,[a,[a[0]+Math.cos(i)*r*.5,a[1]+Math.sin(i)*r*.5],[a[0]+Math.cos(i)*r,a[1]+Math.sin(i)*r]],B(.13,.5),{...h,col:s%2?p:y,tone:.4,layer:1+s*.1,n:6}),s%2===0&&b(t,e,[[a[0]+Math.cos(i)*r*.55,a[1]+Math.sin(i)*r*.55],[a[0]+Math.cos(i)*r*.62,a[1]+Math.sin(i)*r*.62]],B(.06),{...h,col:pt,tone:.02,layer:1.8,n:4})}b(t,e,[[-.7,0],[0,.01],[.6,0]],B(.23,.6),{id:o,col:p,tone:.35,layer:2,n:8}),b(t,e,[[.5,0],[.8,.01],[1,0]],B(.15,.5),{id:o,col:p,tone:.3,layer:2.2,n:6}),b(t,e,[[.95,0],[1.1,.01],[1.2,-.02]],c=>.04*(1-.7*c),{id:o,col:pt,tone:1,layer:2.4,n:4})},skeleton(t,e,o,l,d){const p=new g.Color(1,.97,.9),y=E(l.pal[1],.75),c=(r,a=5)=>({id:o,col:p,tone:.08,layer:r,n:a}),s=r=>a=>r*(.7+.6*(2*a-1)*(2*a-1))*Math.sqrt(Math.min(1,12*a,12*(1-a))),i=r=>[2.6-5.6*r,1.55+.5*Math.sin(Math.PI*Math.min(1,r*1.15))-1.1*r*r*r];for(let r=0;r<=24;r++){const a=r/24,h=i(a),f=i(Math.min(1,a+.02)),m=i(Math.max(0,a-.02)),u=f[0]-m[0],x=f[1]-m[1],w=Math.hypot(u,x)||1,A=x/w,M=-u/w,z=.22*(1-.7*Ct((a-.6)/.4,0,1))*(a<.12?.7:1);b(t,e,[[h[0]-A*z*.5,h[1]-M*z*.5],[h[0]+A*z,h[1]+M*z]],B(.085,.4),c(1,4))}for(let r=0;r<9;r++){const a=i(.2+r*.036),h=.03*r;b(t,e,[[a[0],a[1]-.05],[a[0]+.14,a[1]-.55],[a[0]-.05,a[1]-1+h],[a[0]-.3,a[1]-1.15+h]],f=>.045*(1-.5*f),c(.5,7))}b(t,e,[[2.5,1.62],[3.05,1.55],[3.55,1.3]],B(.3,.6),c(2,8)),b(t,e,[[2.7,1.3],[3.1,1.14],[3.5,1.1]],r=>.09*(1-.4*r),c(1.5,6)),b(t,e,[[2.95,1.62],[2.98,1.63]],B(.07),{id:o,col:y,tone:1,layer:2.5,n:4}),b(t,e,[[1.5,1.9],[1.25,1.32]],B(.2,.5),c(1.2,6)),b(t,e,[[1.3,1.34],[1.52,.76]],s(.1),c(2,6)),b(t,e,[[1.52,.76],[1.3,.2]],s(.075),c(2.1,6)),b(t,e,[[-1,1.78],[-1.5,1.46],[-1.92,1.3]],B(.34,.5),c(1.2,8)),b(t,e,[[-1.4,1.38],[-1.14,.72]],s(.13),c(2,6)),b(t,e,[[-1.14,.72],[-1.46,.2]],s(.09),c(2.1,6));for(const[r,a]of[[1.3,.2],[-1.46,.2]])for(let h=0;h<3;h++)b(t,e,[[r,a],[r+.3,a-.08-h*.05],[r+.55-h*.08,a-.2]],f=>.05*(1-.8*f),c(2.3+h*.1,5))}},co=`
attribute vec3 aBase; attribute vec3 aVel; attribute vec4 aSeed;
uniform float uTime, uPlume;
varying vec2 vQ; varying float vLife; varying float vSeed; varying float vDist; varying float vKind;
${Zt}
void main(){
  float life = fract(uTime*aSeed.w + aSeed.x);
  float drift = step(aSeed.y, 1.);                         // 1: spindrift off the lip, 0: a curl of the plume
  vec3 c = aBase + aVel*life*mix(uPlume, 1., drift)
    + vec3(sin(life*5. + aSeed.x*40.), 0.3*sin(life*7. + aSeed.x*11.), cos(life*4. + aSeed.x*23.))*life*aSeed.z*0.45;
  float size = (aSeed.y + aSeed.z*life)*mix(uPlume, 1., drift)*smoothstep(0., 0.07, life)*(1. - smoothstep(0.8, 1., life));
  vec4 mvPosition = modelViewMatrix*vec4(c, 1.);
  mvPosition.xy += position.xy*size*vec2(1. + 1.5*drift, 1. - 0.6*drift);
  vQ = position.xy; vLife = life; vSeed = aSeed.x; vDist = length(mvPosition.xyz); vKind = drift;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,po=`
varying vec2 vQ; varying float vLife; varying float vSeed; varying float vDist; varying float vKind;
uniform vec3 uGlow;
${Yt}
${_t}
void main(){
  float d = length(vQ);
  float fd = max(fwidth(d), 1e-5);
  float fq = max(fwidth(vQ.x + vQ.y), 1e-5);
  float fy = max(fwidth(vQ.y), 1e-5);
  float ang = atan(vQ.y, vQ.x + 1e-5);
  // spindrift: a wisp of short level strokes and stipple streaming off the snow, thinning to nothing at its edge
  float body = 1. - smoothstep(0.25, 1., d);
  // (round 12) a ribbon is separate fine lines, never a bar: its rows are picked in octaves from the pixel's own size, as
  // the hatching's lines are, so that a ribbon seen small draws fewer of its rows (its neighbours stay six pixels and
  // more apart, the odd rows thinning out toward the next octave), and each line is cut out of what lies behind it with
  // a margin of paper two pixels wide, not laid on a whole ribbon of paper.
  float lr = max(log2(max(48.*fy, 1e-4)), 0.);
  float lo = floor(lr), fr = lr - lo, PR = exp2(lo);
  float tr = clamp(vQ.y, -1., 1.)*8./PR, kr = floor(tr + 0.5);
  float wr = mix(1., 1. - fr, step(0.5, mod(kr, 2.)));
  float row = kr*PR;
  float dash = step(1. - 0.75*body, vnoise(vec2(vQ.x*6. - vLife*9. + row*3.7, row*1.3 + vSeed*31.)))*step(0.3, wr);
  float lineC = (tr - kr)*PR/8.;
  float wisp = lineAA(lineC, fy, 0.8)*dash;
  float ribbon = lineAA(lineC, fy, 2.8)*dash;
  // plume: a curl with a scalloped rim, a spiral stroke and shading on its underside
  float rim = 0.9 + 0.05*sin(ang*6. + vSeed*30.) + 0.03*sin(ang*11. + vSeed*70.) - d;
  float low = 1. - smoothstep(-0.6, 0.4, vQ.y + vQ.x*0.5);
  float ink = lineAA(rim, fd, 1.0 + 1.2*low);
  float c = d*2.3 + ang/6.28318 - vLife*2.2 + vSeed*9.;
  float curl = lineAA((abs(fract(c) - 0.5))/2.3, fd, 0.6)*step(d, 0.72)*smoothstep(0.08, 0.2, d);
  curl *= step(0.25, fract(ang/6.28318*3. + vSeed*5. + d));
  float sh = hatch(vQ.x - vQ.y, fq, 0.05, 1., 0.42).x*low*smoothstep(0.2, 0.55, d);
  ink = max(max(ink, curl*0.8), sh*0.8);
  if (vKind > 0.5 ? (wisp < 0.4 && ribbon < 0.5) : rim < 0.) discard;
  // the second plate: a flat grey-brown on the side away from the sun, at any distance; the crater's light on the youngest curls
  vec3 ashT = mix(vec3(1.), uShade*vec3(0.92, 0.86, 0.84), 0.3 + 0.62*low);
  ashT = mix(ashT, uGlow, (1. - smoothstep(0.04, 0.42, vLife))*(0.55 + 0.45*low));
  vec3 col = plate(ashT, 1. - vKind, mix(ink, 0.75*step(0.4, wisp), vKind), vDist);
  ${jt}
}`;function mo(t,e,o,l,d){const p=[],y=[],c=[],s=e.heightAt(-10,-4),i=d?84:56;for(let M=0;M<i;M++)p.push(-12+t.range(-9,5),s+6,-6+t.range(-10,10)),y.push(-95-t()*60,255+t()*85,-25-t()*40),c.push(M/i+t()*.01,9,t.range(52,92),t.range(.019,.024));const r=12,a=st-14,h=st+62*Math.cos(Qt)+14,f=(M,z,D)=>(z>a&&z<h&&M>Ft-r&&e.heightAt(M,z)+D<440+13.5&&(M=2*(Ft-r)-M),M);for(let M=0;M<16;M++){const z=t.range(-1.2,1.5),D=st+t.range(-2,5),P=D*Math.sin(z),G=f(-D*Math.cos(z),P,1.5);p.push(G,e.heightAt(G,P)+1.5,P),y.push(-32-t()*20,5+t()*6,-22-t()*14),c.push(t(),.6,t.range(3.5,7),t.range(.11,.2))}const m=xe(2654435761);let u=0;for(let M=0;M<2;M++)for(let z=0;z<4;z++,u++){const D=st+(M?-1:2)+m.range(-1,4),P=f((M?Ft-12.5:Ft+12)+m.range(-2.5,1),D,.6);p.push(P,e.heightAt(P,D)+.6,D),y.push(-34-m()*16,2+m()*5,-3-m()*9),c.push(m(),.95,m.range(6.5,10),m.range(.1,.16))}for(let M=0;M<10;M++,u++){const z=M%2===0,D=z?m.range(-6,-2.5):m.range(-34,-24),P=m.range(58,108),G=f(D,P,1.1);p.push(G,e.heightAt(G,P)+1.1,P),y.push(-15-m()*9,5.5+m()*2.5,-8-m()*5),c.push(m(),.8,m.range(3,5),m.range(.12,.2))}const x=new g.InstancedBufferGeometry;x.setAttribute("position",new g.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),x.setIndex([0,1,2,0,2,3]),x.setAttribute("aBase",new g.InstancedBufferAttribute(new Float32Array(p),3)),x.setAttribute("aVel",new g.InstancedBufferAttribute(new Float32Array(y),3)),x.setAttribute("aSeed",new g.InstancedBufferAttribute(new Float32Array(c),4)),x.instanceCount=i+16+u;const w=Nt(l,{uPlume:{value:d?1.5:1},uGlow:{value:E(o.pal[6],d?.85:.65)}},co,po),A=new g.Mesh(x,w);return A.frustumCulled=!1,{mesh:A,top:new g.Vector3(-110,s+230*(d?1.5:1),-45)}}function vo(t,e){const o=Ut(),l=[e.green.clone(),e.green.clone().lerp(e.olive,.5),e.green.clone().lerp(e.gamb,.2)],d=(p,y,c,s,i,r,a,h)=>{const f=o.n;ge(o,p,y,c,s,.2,t,a,h,9,0,0);for(let m=f;m<o.n;m++){const u=o.pos[m*3+1];o.pos[m*3]+=i,o.pos[m*3+1]=u-.1,o.pos[m*3+2]+=r,o.uv[m*2]+=f*.37,o.uv[m*2+1]=u*1.6,u<.16*y&&(o.info[m*4]+=.32)}};return d(1.5,1.4,9,3,0,0,l[0],.2),d(1,1,7,2,1.25,.5,l[1],.27),d(.8,.85,6,2,-1,.85,l[2],.18),Rt(o)}const uo=`
attribute vec3 aCol; attribute vec4 aInfo; attribute vec3 aWide; attribute float aEdge;
varying vec2 vUv; varying vec3 vBar; varying vec3 vEw; varying vec3 vN; varying vec4 vInfo;
varying float vDist; varying float vFoot; varying float vY;
uniform float uRibGrow;                          // (round 12) 0: sunk out of sight under the ground, 1: standing
${Zt}
void main(){
  vec4 mvPosition = modelViewMatrix*vec4(position.x, position.y - (1. - uRibGrow)*14., position.z, 1.);
  vN = normal; vUv = uv; vBar = aCol; vEw = aWide; vInfo = aInfo; vFoot = aEdge; vY = position.y;
  vDist = length(mvPosition.xyz);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,xo=`
varying vec2 vUv; varying vec3 vBar; varying vec3 vEw; varying vec3 vN; varying vec4 vInfo;
varying float vDist; varying float vFoot; varying float vY;
uniform float uRibAsh, uRibSnow;                 // falling ash on the snow of the heads; the height the snow begins at
${Yt}
${_t}
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
  // every derivative first
  float fs = max(fwidth(vUv.x), 1e-5), fx = max(fwidth(vInfo.x), 1e-5), fuv = max(max(fwidth(vUv.x), fwidth(vUv.y)), 1e-5);
  vec3 fbar = max(fwidth(vBar), vec3(1e-5));
  float foot = 1. - smoothstep(0.05, 1.1, vFoot), ffo = clamp(fwidth(foot), 1e-4, 0.3);
  float hf = clamp(vInfo.y, 0., 1.);
  // one fixed light, the plate's own: what is turned to it is ruled openly, half light is ruled close, what is turned
  // away or stands in the ground is crossed. So every rib is a dark mass with one lighter flank.
  float l = dot(n, normalize(uSun + vec3(0., 0.25, 0.))) + vInfo.z - 0.5*foot - 0.28;
  float fl = 0.6*ffo + 0.02;
  float lit = smoothstep(0.62 - fl, 0.62 + fl, l), dark = 1. - smoothstep(0.08 - fl, 0.08 + fl, l), mid = (1. - lit)*(1. - dark);
  // snow lies on the facets that face up, more of them toward the head, down to a ragged line: never on a wall of the rock
  float capA = 1.3*n.y - 0.78 + 0.9*(hf - 0.7) + 0.25*(vnoise(vUv*1.1 + 7.) - 0.5);
  float fca = clamp(fwidth(capA), 1e-4, 0.5);
  float cap = smoothstep(-fca, fca, capA)*smoothstep(uRibSnow - 6., uRibSnow + 6., vY);
  // strokes; from far off, where a facet is only a few strokes wide, the ruling gives way to an even half-tone, one flat
  // step to each of the three lights, so that a rib far up the slope still stands dark on the ash and the snow
  float str = hatch(vUv.x, fs*0.75, 0.36, 0.5, mix(0.42, 0.9, 1. - lit)).x;
  float crs = hatch(vInfo.x, fx*0.75, 0.36, 0.5, 0.82).x;
  float bc = vUv.y + 0.22*vnoise(vec2(vUv.x*0.55, vUv.y*0.4 + 2.)), fbc = max(fwidth(bc), 1e-5);
  float bed = hatch(bc, fbc, 0.5, 1.4, 0.2).x*step(0.24, vnoise(vec2(bc*1.3 + 3., vUv.x*0.3)));
  float ck = vnoise(vec2(vUv.x*0.5 + 11., vInfo.x*0.5 + vUv.y*0.21)), fck = clamp(fwidth(ck), 1e-4, 0.5);
  float crack = lineAA(ck - 0.5, fck, 0.75)*(1. - smoothstep(0.1, 0.25, fck))*0.85;
  float ink = lit*max(str*0.8, bed*0.7) + mid*max(str, bed*0.5) + dark*(1. - (1. - str)*(1. - crs*0.92));
  ink = max(ink, crack);
  // aretes: all of them hairlines when the facet is only a few pixels across
  vec3 eb = vBar/fbar;
  float facePx = vInfo.w/max(max(fbar.x, fbar.y), fbar.z);
  float small = 1. - smoothstep(5., 14., facePx);
  vec3 ew = clamp(vEw, 0., 1.);
  vec3 hw = mix(vec3(0.12), vec3(0.5), ew)*mix(1., 0.6, small);
  float hair = step(0.34, vnoise(vec2(vUv.y*1.9, 3.7)));
  vec3 el = (1. - smoothstep(hw - 0.5, hw + 0.5, eb))*step(vec3(-0.5), vEw)*mix(vec3(0.4*hair), vec3(1.), smoothstep(vec3(0.2), vec3(0.6), ew));
  float edges = max(max(el.x, el.y), el.z);
  ink = max(ink, edges);
  ink = mix(ink, max(edges*0.8, lineAA(capA, fca, 0.8)*0.8), cap);
  // (round 12) falling ash lies on the snow of the heads as stipple, as it does on the snowfields: no grey wash
  vec2 ag = vUv*2.4; vec2 ai = floor(ag);
  float ad = length(fract(ag) - 0.5 - 0.35*(vec2(h21(ai), h21(ai + 3.)) - 0.5));
  ink = max(ink, (1. - smoothstep(0.11, 0.2, ad))*step(h21(ai + 9.), 0.6*uRibAsh)*cap*0.78*(1. - smoothstep(0.1, 0.28, fuv*2.4)));
  // the wash is the ink of the visit, thinned, under the verditer of the shade on what is turned away
  vec3 hT = uHalf/max(uPaper, vec3(0.05));
  vec3 tint = mix(vec3(1.), hT, dark*0.92 + mid*0.74 + lit*0.5);
  tint *= mix(vec3(1.), uShade, dark*0.6 + mid*0.25);
  tint = mix(tint, vec3(1.), cap);
  vec3 col = plate(tint, 1., ink, vDist);
  ${jt}
}`;function b0(t){const e=(1+Math.sqrt(5))/2,o=c=>{const s=Math.hypot(c[0],c[1],c[2]);return[c[0]/s,c[1]/s,c[2]/s]},l=[[-1,e,0],[1,e,0],[-1,-e,0],[1,-e,0],[0,-1,e],[0,1,e],[0,-1,-e],[0,1,-e],[e,0,-1],[e,0,1],[-e,0,-1],[-e,0,1]].map(o);let d=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];for(let c=0;c<t;c++){const s=new Map,i=[],r=(a,h)=>{const f=a<h?a*4096+h:h*4096+a;return s.has(f)||(s.set(f,l.length),l.push(o([l[a][0]+l[h][0],l[a][1]+l[h][1],l[a][2]+l[h][2]]))),s.get(f)};for(const[a,h,f]of d){const m=r(a,h),u=r(h,f),x=r(f,a);i.push([a,m,x],[h,u,m],[f,x,u],[m,u,x])}d=i}const p=new Map,y=d.map(()=>[-1,-1,-1]);return d.forEach((c,s)=>{for(let i=0;i<3;i++){const r=c[(i+1)%3],a=c[(i+2)%3],h=r<a?r*4096+a:a*4096+r,f=p.get(h);f?(y[s][i]=f[0],y[f[0]][f[1]]=s):p.set(h,[s,i])}}),{v:l,f:d,adj:y}}const he=t=>{const e=Math.sin(t*12.9898)*43758.5453;return e-Math.floor(e)};function yo(t,e,o,l,d,p){const y=Math.PI*2,c=o.v.length,s=new Array(c),i=l.c[0],r=l.c[1],a=l.c[2],h=l.r[0],f=l.r[1],m=l.r[2],u=l.rough??.2,x=[];for(let L=0;L<3;L++){const C=e()*y,U=e.range(-.8,.8);x.push([Math.cos(C)*Math.cos(U),Math.sin(U),Math.sin(C)*Math.cos(U),e()*y,e.range(2.2,3.6)])}const w=(l.planes||[]).map(L=>{const C=Math.hypot(L[0],L[1],L[2])||1;return[L[0]/C,L[1]/C,L[2]/C,L[3]]});for(let L=0,C=l.cuts??6;L<C;L++){const U=e()*y,j=e.range(-.25,.8),Y=Math.sqrt(1-j*j);w.push([Math.cos(U)*Y,j,Math.sin(U)*Y,e.range(.5,.8)])}const A=l.tilt||[0,0],M=Math.cos(A[0]),z=Math.sin(A[0]),D=Math.cos(A[1]),P=Math.sin(A[1]),G=l.yaw??0,_=Math.cos(G),Q=Math.sin(G),N=l.taper??0,$=l.lean||[0,0],et=l.teeth||[0,1],J=e()*y;for(let L=0;L<c;L++){const C=o.v[L];let U=C[0],j=C[1],Y=C[2],mt=1;if(j<0){const X=1/Math.max(Math.hypot(U,Y),.45);U*=X,Y*=X}for(const X of x)mt+=u/3*Math.sin(X[4]*(C[0]*X[0]+C[1]*X[1]+C[2]*X[2])+X[3]);mt+=u*.4*(e()-.5),U*=mt,j*=mt,Y*=mt;for(const X of w){const vt=U*X[0]+j*X[1]+Y*X[2]-X[3];vt>0&&(U-=X[0]*vt,j-=X[1]*vt,Y-=X[2]*vt)}const At=1-N*W(-.35,1,j),ft=Ct(.5+.5*j,0,1);U*=h*At,Y*=m*At,j*=f*(1+et[0]*Math.sin(U*et[1]+J)*W(0,.6,j));const zt=j*M-Y*z,oe=j*z+Y*M,nt=U*D-zt*P,gt=U*P+zt*D,ht=nt+$[0]*ft*ft,yt=oe+$[1]*ft*ft;s[L]=[i+ht*_-yt*Q,r+gt,a+ht*Q+yt*_]}const xt=o.f.length,dt=new Array(xt);for(let L=0;L<xt;L++){const C=o.f[L],U=s[C[0]],j=s[C[1]],Y=s[C[2]],mt=(j[1]-U[1])*(Y[2]-U[2])-(j[2]-U[2])*(Y[1]-U[1]),At=(j[2]-U[2])*(Y[0]-U[0])-(j[0]-U[0])*(Y[2]-U[2]),ft=(j[0]-U[0])*(Y[1]-U[1])-(j[1]-U[1])*(Y[0]-U[0]),zt=Math.hypot(mt,At,ft);dt[L]=zt<1e-6?null:[mt/zt,At/zt,ft/zt,zt]}const wt=L=>L[1]-(d.y+d.sx*(L[0]-d.x)+d.sz*(L[2]-d.z));for(let L=0;L<xt;L++){const C=dt[L],U=o.f[L];if(!C||o.v[U[0]][1]<-.6&&o.v[U[1]][1]<-.6&&o.v[U[2]][1]<-.6)continue;const j=[s[U[0]],s[U[1]],s[U[2]]];if(wt(j[0])<-.4&&wt(j[1])<-.4&&wt(j[2])<-.4)continue;const Y=Math.round(C[0]*40)*131.3+Math.round(C[1]*40)*17.7+Math.round(C[2]*40)*7.1+i*3.3+r*1.7,mt=he(Y)<.5?-1:1,At=mt*(.08+.3*he(Y+1.3)),ft=At+mt*(.85+.25*he(Y+2.7)),zt=3*he(Y+4.1),oe=3*he(Y+5.9),nt=.2*(he(Y+7.3)-.5);let gt=C[2],ht=0,yt=-C[0],X=Math.hypot(gt,yt);X<.15&&(gt=1-C[0]*C[0],ht=-C[0]*C[1],yt=-C[0]*C[2],X=Math.hypot(gt,ht,yt)),gt/=X,ht/=X,yt/=X;const vt=C[1]*yt-C[2]*ht,ce=C[2]*gt-C[0]*yt,Be=C[0]*ht-C[1]*gt,qe=Math.cos(At),ae=Math.sin(At),be=Math.cos(ft),bt=Math.sin(ft),Tt=[0,0,0],Wt=[0,0,0];for(let it=0;it<3;it++){const lt=j[(it+1)%3],Kt=j[(it+2)%3],Lt=dt[o.adj[L][it]];Tt[it]=C[3]/Math.max(Math.hypot(Kt[0]-lt[0],Kt[1]-lt[1],Kt[2]-lt[2]),1e-5);const Dt=Lt?Math.acos(Ct(C[0]*Lt[0]+C[1]*Lt[1]+C[2]*Lt[2],-1,1)):1;Wt[it]=Dt<.1?-1:W(.15,.65,Dt)}const ke=Math.min(Tt[0],Tt[1],Tt[2]),ne=t.n;for(let it=0;it<3;it++){const lt=j[it],Kt=lt[0]*gt+lt[1]*ht+lt[2]*yt,Lt=lt[0]*vt+lt[1]*ce+lt[2]*Be,Dt=wt(lt);Jt(t,lt,C,Kt*qe+Lt*ae+zt,lt[1]+p[0]*lt[0]+p[1]*lt[2],{r:it===0?Tt[0]:0,g:it===1?Tt[1]:0,b:it===2?Tt[2]:0},Kt*be+Lt*bt+oe,Ct(Dt/d.H,0,1),nt,ke,Math.max(Dt,0),Wt)}t.idx.push(ne,ne+1,ne+2)}}const wo=[{name:"orchid",u:.335,ahead:34,s:2.8,half:[1.6,1.9]},{name:"hummingbird",u:.372,ahead:20,s:2.3,half:[2.4,1.9]},{name:"butterfly",u:.412,ahead:0,s:2,half:[2,1.9]},{name:"tapir",u:.43,ahead:30,s:2.4,half:[2.3,1.6]},{name:"beetle",u:.468,ahead:34,s:2.3,half:[1.7,1.9]},{name:"cinchona",u:.575,ahead:14,s:2.2,half:[1.7,1.9]},{name:"cockrock",u:.615,ahead:14,s:2.3,half:[1.8,1.9]},{name:"frog",z:628,dy:-16,s:3,half:[2,1.15],lead:.1},{name:"toucan",z:554,dy:-19,s:2.8,half:[1.8,1.55],lead:.1},{name:"fern",z:528,dy:-21,s:3,half:[1.9,1.9],lead:.1},{name:"quetzal",z:506,dy:-24,s:3,half:[1.6,2.2],lead:.1}];async function bo(t,e={}){const o=t.rng.fork("cut-mountain-hero"),l=t.noise,d=t.quality?.detail??1,p=O0(e,o),y={gul:o.range(4.2,6.6),o1:o.range(0,50),o2:o.range(0,50),horn0:o.range(12,18),horn1:o.range(11,17)},c=e.rare??o.chance(1/9),s=e.bloom!==void 0?e.bloom:o.pick(["puya","frailejon",null]),i=Q0(l,y),r=oo(),a=n=>Math.max(i.heightAt(0,n),.3),h=H0(p,e),f=new g.Group;f.name="cut-mountain-hero";const m=xe(((t.seed??1)>>>0^461845907)>>>0),u=new g.Vector4(m()*6.2831853,m()*6.2831853,m()*6.2831853,m()*6.2831853),x=Z0(u,i),w=Nt(h,{uGreen:{value:p.green},uOlive:{value:p.olive},uAsh:{value:p.ash},uGamb:{value:p.gamb},uAshFall:{value:c?1:0},uSnowDrop:{value:e.snowDrop||0},uVerm:{value:p.verm},uFlow:{value:new g.Vector4(c?610:480,1,c?1.35:1,0)},uRib:{value:u}},X0,J0),A=(n,v)=>Y0(n,v,c?610:480,c?1.35:1),M=n=>A(n.x,n.z)>3.5+(n.s||1),z=n=>A(n.x,n.z)>10,D=new g.Mesh(await ao(t,i,r,p.sun),w);D.frustumCulled=!1,f.add(D),await t.yield();const P=io(i),G=P.Lold,_=n=>Math.round(P.fromLegacy(n/300)*300),Q=xe(((t.seed??1)>>>0^5369127)>>>0),N=xe(((t.seed??1)>>>0^49734321)>>>0),$=(n,v)=>{const T=Ct(P.fromLegacy(n),0,1)*300,k=Math.min(299,Math.floor(T));return v.lerpVectors(P.samples[k],P.samples[k+1],T-k)},et=new g.Vector3,J=new g.Vector3,xt=n=>{let v=100,T=1e9;for(let k=_(80);k<_(215);k++){const q=Math.abs(P.samples[k].z-n);q<T&&(T=q,v=k)}return v},dt=n=>P.samples[xt(n)].y,wt=n=>P.toLegacy(xt(n)/300),L=wo.map((n,v)=>{const T=n.z!==void 0?wt(n.z):n.u+n.ahead/G,k=$(T,et),q=k.z,R=n.half[0]*n.s,S=n.half[1]*n.s;v<4&&o();const K=n.dy!==void 0?k.y+n.dy:Math.min(k.y-2,a(q)-5.5-S,a(q+R)-5.5-S,a(q-R)-5.5-S);return{name:n.name,u:n.u??T,s:n.s,bu:T,z:q,y:K,hw:R,hh:S,base:K-S*.72,tilt:0,lead:n.lead??.045,kind:"plate"}}),C=L[3],U=24;{const n=$(C.bu+C.hw/G,J),v=$(C.bu+(C.hw+U)/G,et);C.tilt=Math.atan2(v.y-n.y,Math.max(n.z-v.z,1))}const j=n=>P.samples[Math.round(P.fromLegacy(n)*300)].z,mt=[792+o.range(-14,10),C.z+C.hw+5+o.range(-.5,.5),L[4].z-L[4].hw-6.5+o.range(-.5,.5)].map((n,v)=>({z:n,top:a(n)-.4,foot:0,hw:[1.7,2,2.4][v]*o.range(.9,1.15)})),At=L[1],ft=new g.Vector3(0,a(At.z-9)-1.6,At.z-9),zt=[[.402,.46,.75],[.4265,.36,.6],[.53,.52,.7]].map(([n,v,T])=>{const k=$(n,et);return new g.Vector4(-k.z,k.y-2,v,T)}),oe=i.heightAt(-1,0),nt=[{z:j(.386),dy:-23,rx:15,ry:8,dark:1},{z:398,top:39,rx:14.5,ry:8.5,dark:1},{z:j(.349),top:10.5,rx:5.6,ry:3.3,dark:0},{z:j(.4285),top:11.5,rx:4.8,ry:3.1,dark:0},{z:470,top:12.5,rx:5.6,ry:3.3,dark:0},{z:396,top:12,rx:4.8,ry:3.1,dark:0}].map(n=>({...n,y:n.top!==void 0?a(n.z)-n.top:dt(n.z)+n.dy})),gt=436,ht=a(gt),yt=-.3,X=new g.Vector4(-gt-yt*ht,yt,3.4,ht-12),vt=we,ce=[{name:"armadillo",id:vt,z:nt[2].z+.4,base:nt[2].y-nt[2].ry*.66,s:2,flip:1},{name:"snake",id:vt,z:nt[3].z,base:nt[3].y-nt[3].ry*.74,s:1.9,flip:1},{name:"armadillo",id:vt,z:nt[4].z-.4,base:nt[4].y-nt[4].ry*.66,s:2,flip:-1},{name:"snake",id:vt,z:nt[5].z,base:nt[5].y-nt[5].ry*.74,s:1.9,flip:-1},{name:"skeleton",id:vt,z:567,base:dt(567)-13.5,s:2.4,flip:1},{name:"skeleton",id:vt,z:368,base:a(368)-52,s:3.2,flip:1}],Be=[];for(let n=0;n<6;n++){const v=nt[n<4?0:1],T={name:"oilbird",id:vt+1+n,z:v.z+(N()-.5)*v.rx*.5,base:v.y+(N()-.3)*v.ry*.3,s:1.7+.5*N(),flip:1,ay:v.ry*(.16+.2*N()),az:v.rx*(.22+.3*N()),w:(.45+.4*N())*(n%2?-1:1),ph:N()*6.28};ce.push(T),Be.push(T)}const qe=new g.Vector4(0,-999,0,0),ae={uBox:{value:Array.from({length:we},(n,v)=>L[v]?new g.Vector4(-L[v].z,L[v].y,L[v].hw,L[v].hh):qe.clone())},uFall:{value:mt.map(n=>new g.Vector4(-n.z,n.top,n.foot,n.hw))},uShadow:{value:[new g.Vector4(0,-99,3,0),new g.Vector4(0,-99,3,0)]},uConduit:{value:.4},uLip:{value:oe},uVerm:{value:p.verm},uPageTone:{value:e.pageTone||0},uFlower:{value:new g.Vector3(-ft.z,ft.y,4.5)},uSoil:{value:E(p.olive.clone().lerp(p.pal[2],.45),.75)},uDyke:{value:zt},uLedge:{value:new g.Vector4(-C.z+C.hw,C.base,Math.tan(C.tilt),U)},uCave:{value:nt.map(n=>new g.Vector4(-n.z,n.y,n.rx,n.dark?n.ry:-n.ry))},uLava:{value:X},uGambP:{value:p.gamb}},be=new g.Mesh(no(i,r),Nt(h,ae,c0,to));if(be.frustumCulled=!1,f.add(be),e.plain!==!1){const n=new g.Mesh(so(),Nt(h,{},c0,eo));n.frustumCulled=!1,f.add(n)}await t.yield();const bt=Nt(h,{uWind:{value:new g.Vector2(.55,-.32)},uFarTint:{value:1},uGrow:{value:new g.Vector2(1,1)}},d0,$e,{side:g.DoubleSide}),Tt=(n,v)=>Nt(h,{uWind:bt.uniforms.uWind,uFarTint:bt.uniforms.uFarTint,uGrow:{value:new g.Vector2(n,v)}},d0,$e,{side:g.DoubleSide}),Wt=Tt(1,1),ke=Tt(1,1),ne=Tt(1,1),it={value:1},lt=n=>Math.round(n*(.5+.5*d)),Kt=n=>{for(let v=36;v<=63;v+=.5){const T=Math.floor(v),k=et.lerpVectors(P.samples[T],P.samples[Math.min(T+1,300)],v-T),q=n.x-k.x,R=n.z-k.z,S=-14-k.x,K=44-k.z,ot=Math.hypot(S,K),V=(q*S+R*K)/ot,F=(q*K-R*S)/ot;if(V>0&&V<95&&Math.abs(F)<.15*V+1.5)return!1}return!0},Lt=re(o,i,P,196,{rMin:690,rMax:1120,lo:-5,hi:64,seam:.5,south:.8,seamW:60,edge:3,rad:5,h:54,s0:.84,s1:1.2}).filter(Kt);await t.yield(),f.add(Mt(lo(o,p),bt,Lt,.5)),await t.yield();const Dt=re(o,i,P,760,{rMin:400,rMax:730,lo:56,hi:196,seam:.4,south:.75,seamW:70,edge:6,rad:8,h:8,s0:.6,s1:1.45}).filter(z),k0=n=>{let v=1e9;for(let T=_(34);T<_(200);T+=2){const k=P.samples[T],q=k.x-n.x,R=k.y-n.y,S=k.z-n.z,K=q*q+R*R+S*S;K<v&&(v=K)}return Math.sqrt(v)};Dt.forEach(n=>{n.ld=k0(n)});const Me=Dt.slice().sort((n,v)=>n.ld-v.ld),Oe=Math.min(150,Me.findIndex(n=>n.ld>85)<0?150:Me.findIndex(n=>n.ld>85)),He=Me.slice(0,Oe),M0=Me.slice(Oe);He.forEach(n=>{n.s=Math.min(n.s,1.15)}),await t.yield();{const n=new Map,v=(q,R)=>(q+512)*2048+(R+512),T=D.geometry.attributes.position,k=D.geometry.attributes.aTone;for(const q of Dt){const R=v(Math.floor(q.x/20),Math.floor(q.z/20));n.has(R)||n.set(R,[]),n.get(R).push(q)}for(let q=0;q<T.count;q++){const R=T.getX(q),S=T.getZ(q),K=R*R+S*S;if(K<330*330||K>900*900)continue;const ot=Math.floor(R/20),V=Math.floor(S/20);let F=0;for(let I=ot-1;I<=ot+1;I++)for(let H=V-1;H<=V+1;H++){const Z=n.get(v(I,H));if(Z)for(const at of Z)F+=at.s*(1-W(6,20,Math.hypot(at.x-R,at.z-S)))}k.setY(q,W(1.6,3,F))}k.needsUpdate=!0}await t.yield(),f.add(Mt(m0(Q,p,!0),bt,He,1.6)),await t.yield(),f.add(Mt(m0(Q,p,!1),bt,M0,1.6));for(let n=0;n<12;n++)o();await t.yield();const $t=re(o,i,P,1080,{rMin:205,rMax:440,lo:186,hi:318,seam:.5,south:.8,seamW:38,edge:1.2,rad:1,h:3.2,s0:.75,s1:1.5,low:1}).filter(M),Qe=n=>{let v=1e9;for(let T=_(150);T<_(270);T+=2){const k=P.samples[T],q=k.x-n.x,R=k.z-n.z,S=q*q+R*R;S<v&&(v=S)}return Math.sqrt(v)};await t.yield(),$t.forEach(n=>{n.ld=Qe(n)});const Ce=$t.filter(n=>n.ld<36).sort((n,v)=>n.ld-v.ld).slice(0,380),A0=new Set(Ce),Ye=v0(Q,p,s==="frailejon",!0),Fe=Mt(Ye,bt,Ce,.1);f.add(Fe),await t.yield();const Ze=v0(Q,p,s==="frailejon",!1);f.add(Mt(Ze,ke,$t.filter(n=>!A0.has(n)).concat(Ce.map(n=>({...n,snow:-1}))),.1)),Fe.material=Wt;for(let n=0;n<18;n++)o();const Ae=re(o,i,P,170,{rMin:205,rMax:440,lo:190,hi:318,seam:.6,south:.8,seamW:45,edge:1.5,rad:1,h:4,s0:.8,s1:1.25,low:1}).filter(M);Ae.forEach(n=>{n.ld=Qe(n)});const Xe=Ae.filter(n=>n.ld<42).sort((n,v)=>n.ld-v.ld).slice(0,46),z0=new Set(Xe);f.add(Mt(x0(Q,p,s==="puya",!0),bt,Xe,.1)),await t.yield(),f.add(Mt(x0(o,p,s==="puya",!1),bt,Ae.filter(n=>!z0.has(n)),.1)),await t.yield();const P0=re(o,i,P,lt(300),{rMin:130,rMax:250,lo:300,hi:392,seam:.5,south:.8,seamW:40,edge:1.5,rad:1.5,h:1,s0:.5,s1:1.6,low:1}).filter(M);await t.yield();const Le=re(o,i,P,150,{rMin:48,rMax:150,lo:376,hi:470,seam:.5,south:.8,seamW:35,edge:2,rad:2,h:1.5,s0:.7,s1:2.6,low:1}).filter(M);Le.forEach(n=>{n.rock=1,n.snow=1,n.rot=.5+Q.range(-.5,.5),n.s*=1.3});const I0=ro(o,p);await t.yield(),f.add(Mt(u0(Q,p),bt,Le,.12)),await t.yield();const ze=n=>xe(((t.seed??1)>>>0^n)>>>0),Vt=P.samples,pe=[],T0=[];let Ot=300;for(;Ot>1&&Vt[Ot-1].x<45;)Ot--;const Pt=[1e9,-1e9,1e9,-1e9];for(let n=Ot;n<=300;n++){const v=Vt[n];Pt[0]=Math.min(Pt[0],v.x),Pt[1]=Math.max(Pt[1],v.x),Pt[2]=Math.min(Pt[2],v.z),Pt[3]=Math.max(Pt[3],v.z)}const de=(n,v,T=60)=>{if(n<Pt[0]-T||n>Pt[1]+T||v<Pt[2]-T||v>Pt[3]+T)return{d:1e3,i:Ot,left:1};let k=1e18,q=Ot,R=1;for(let S=Ot;S<300;S++){const K=Vt[S],ot=Vt[S+1],V=ot.x-K.x,F=ot.z-K.z,I=Ct(((n-K.x)*V+(v-K.z)*F)/(V*V+F*F),0,1),H=K.x+V*I-n,Z=K.z+F*I-v,at=H*H+Z*Z;at<k&&(k=at,q=S+I,R=V*(v-K.z)-F*(n-K.x))}return{d:Math.sqrt(k),i:q,left:R<0?1:-1}},B0=n=>{const v=Math.min(299,Math.floor(n));return It(Vt[v].y,Vt[v+1].y,n-v)},De=(n,v)=>[(i.heightAt(n+1.5,v)-i.heightAt(n-1.5,v))/3,(i.heightAt(n,v+1.5)-i.heightAt(n,v-1.5))/3],q0=(n,v,T)=>v>0&&v<135&&Math.abs(n-Ft)<T,se=(n,v,T)=>Math.floor(n/T+4096)*8192+Math.floor(v/T+4096);{const n=ze(1291169091),v=new Set($t.map(V=>se(V.x,V.z,2.4))),T=[],k=V=>W(188,200,V)*(1-W(300,314,V));for(let V=0;V<12600;V++){V%1400===1399&&await t.yield();const F=Math.sqrt(It(38025,455*455,n())),I=n.range(-1.5,1.5),H=-F*Math.cos(I)-2.5,Z=F*Math.sin(I),at=n(),O=i.heightAt(H,Z),ct=k(O+12*(n()-.5));if(at>ct||v.has(se(H,Z,2.4)))continue;const rt=de(H,Z),ut=1-W(12,42,rt.d);rt.d<3||at>ct*(.07+.93*ut)||(v.add(se(H,Z,2.4)),T.push({x:H,y:O,z:Z,s:n.range(.75,1.3)*(1+.12*ut),rot:n()*6.2832,tone:n.range(-.08,.1),ph:n()*6.28,ld:rt.d}))}const q=T.filter(M).slice(0,760),R=q.filter(V=>V.ld<26).sort((V,F)=>V.ld-F.ld).slice(0,100),S=new Set(R),K=Mt(Ye.clone(),Wt,R,.1),ot=Mt(Ze.clone(),Wt,q.filter(V=>!S.has(V)),.1);f.add(K,ot),pe.push(K,ot),$t.r11=q,pe.push(Fe)}await t.yield();let Pe=[],Ve=[];{const n=ze(1518500249),v=new Set,T=[],k=I=>W(308,318,I)*(1-W(372,382,I)),q=I=>I.left>0&&I.d>6.5&&I.d<15.5,R=I=>new g.Vector3(-I[0],1,-I[1]).normalize(),S=P0.filter(I=>(I.rn=de(I.x,I.z),!q(I.rn)));for(const I of S)v.add(se(I.x,I.z,4)),I.ld=I.rn.d,I.ld<60&&(I.up=R(De(I.x,I.z)));for(let I=0;I<2100;I++){I%700===699&&await t.yield();const H=Math.sqrt(It(14400,262*262,n())),Z=n.range(-1.5,1.5),at=-H*Math.cos(Z)-2.5,O=H*Math.sin(Z),ct=n(),rt=i.heightAt(at,O),ut=k(rt+8*(n()-.5));if(ct>ut||q0(at,O,13)||v.has(se(at,O,4)))continue;const Et=De(at,O),qt=Math.hypot(Et[0],Et[1]),St=de(at,O),le=1-W(10,36,St.d);St.d<4||q(St)||ct>ut*(1-W(.8,1.2,qt))*(.09+.91*le)||(v.add(se(at,O,4)),T.push({x:at,y:rt,z:O,s:n.range(.55,.95)*(1+.5*le)*(1.1-.3*W(.5,.9,qt)),rot:n()*6.2832,tone:n.range(-.08,.1),ph:n()*6.28,ld:St.d,up:R(Et)}))}const K=S.concat(T.filter(M));Pe=K.filter(I=>I.ld<34).sort((I,H)=>I.ld-H.ld).slice(0,120);const ot=new Set(Pe);Ve=K.filter(I=>!ot.has(I));const V=Mt(vo(ze(1859775393),p),Wt,Pe,.25),F=Mt(I0,bt,Ve,.25);f.add(V,F),pe.push(V)}await t.yield();const Je=[];{const n=ze(2135587861),v=[b0(0),b0(1)],T=Ut(),k=6.2831853,q=[n.range(-.28,.28),n.range(-.28,.28)],R=I=>{const H=1.5707963-Math.abs(I),Z=Math.exp(-H/.3);return 31*I+15.9*Math.sign(I)*(Z-.00532)+.8*Math.sin(I*5.3+u.y)+u.x},S=Math.ceil(R(-1.5707)/k),K=Math.floor(R(1.5707)/k);let ot=0;for(let I=S;I<=K;I++){let H=-1.5707,Z=1.5707;for(let O=0;O<28;O++){const ct=.5*(H+Z);R(ct)<k*I?H=ct:Z=ct}const at=.5*(H+Z);for(let O=55+n()*3;O<215;){const ct=at+.8/O,rt=-O*Math.cos(ct),ut=O*Math.sin(ct),Et=x(rt,ut);if(Et.h<352)break;const qt=de(rt,ut,150),St=qt.d<140,le=St?n.range(3.4,4.8):n.range(5.6,7.4);if(Et.on<.6||A(rt,ut)<6){O+=2.5;continue}const ve=Et.hw*n.range(.85,1.1),Ue=St?n.range(3,4.2):n.range(3.6,4.6),ue=Et.h;if(rt+ve>-2.5){O+=le;continue}const i0=De(rt,ut),R0=(i.heightAt(-(O-1.5)*Math.cos(ct),(O-1.5)*Math.sin(ct))-i.heightAt(-(O+1.5)*Math.cos(ct),(O+1.5)*Math.sin(ct)))/3;let kt=n.range(1.2,3.2)*(.55+.45*W(0,14,Et.h-360-24*Et.v1));const We=Math.max(0,qt.d-Math.max(ve,2.6)),l0=B0(qt.i)-ue;if(qt.d<14&&(kt=Math.max(kt,Math.min(7.5,l0-n.range(9.5,12))*(1-W(8,14,qt.d)))),We<6.5&&(kt=Math.min(kt,l0-Math.sqrt(6.5*6.5-We*We))),kt<.9){O+=le;continue}if(qt.left>0&&ue<380){const Ie=Math.min(299,Math.floor(qt.i)),r0=Vt[Ie+1].x-Vt[Ie].x,f0=Vt[Ie+1].z-Vt[Ie].z,_e=Math.abs(rt/O*r0+ut/O*f0)/(Math.hypot(r0,f0)||1),_0=Math.hypot(Math.max(Ue,.6*kt)*Math.sqrt(Math.max(0,1-_e*_e)),Math.max(ve,.45*kt)*_e);Math.abs(qt.d-11)<_0+1.6&&(kt=.15)}const Ke=kt/.7,G0=rt/O,U0=ut/O,W0=Math.max(ve,.45*kt),K0=Math.max(Ue,.6*kt);yo(T,n,v[St?1:0],{c:[rt,ue-.3*Ke,ut],r:[W0,Ke,K0],cuts:St?7:3,rough:St?.2:.26,taper:n.range(.05,.3),lean:[n.range(-.3,.3),-.12*Ke],tilt:[.85*Math.atan(Math.max(R0,0)),n.range(-.12,.12)],yaw:Math.atan2(-G0,U0)+n.range(-.14,.14)},{y:ue,sx:i0[0],sz:i0[1],x:rt,z:ut,H:kt},q),Je.push({x:rt,y:ue,z:ut,rx:ve,rz:Ue,top:kt,k:I}),++ot%5===0&&await t.yield(),O+=le}}const V=Nt(h,{uRibAsh:w.uniforms.uAshFall,uRibSnow:{value:378-.9*(e.snowDrop||0)},uRibGrow:it},uo,xo);await t.yield();const F=new g.Mesh(Rt(T),V);F.frustumCulled=!1,F.name="ribs",f.add(F),pe.push(F)}await t.yield();const Ht=fo(),me=[],Bt=[];for(let n=0;n<L.length;n++){const v=L[n];Ht.s=v.s,Ht.flip=v.name==="tapir"?-1:1,g0[v.name](Ht,[0,v.base,v.z+(v.name==="tapir"?.45*v.s:0)],n,p,Q),me[n]=new g.Vector3(.1,v.base+1.1*v.s,v.z),Bt[n]=v,await t.yield()}for(const n of ce)Ht.s=n.s,Ht.flip=n.flip,g0[n.name](Ht,[0,n.base,n.z],n.id,p,N),Bt[n.id]||(me[n.id]=new g.Vector3(.1,n.base,n.z),Bt[n.id]={...n,kind:n.id>vt?"flyer":"static",bu:0,hw:0,hh:0,tilt:0}),await t.yield();for(let n=0;n<ee;n++)Bt[n]||(me[n]=new g.Vector3(0,-999,0),Bt[n]={name:"none",kind:"none",s:1});const t0=ho(Ht),C0=ee;await t.yield();const ie={uP:{value:Bt.map(()=>0)},uD:{value:Bt.map(()=>0)},uCtr:{value:me},uOff:{value:Bt.map(()=>new g.Vector4)},uPose:{value:Bt.map(n=>new g.Vector2(0,n.s))}},F0=Nt(h,{...ie,uOutline:{value:1}},y0,w0,{side:g.DoubleSide}),L0=Nt(h,{...ie,uOutline:{value:0}},y0,w0,{side:g.DoubleSide}),Ee=new g.Mesh(t0,F0),Se=new g.Mesh(t0,L0);Ee.position.x=-.03,Ee.frustumCulled=!1,Se.frustumCulled=!1,Se.renderOrder=1,f.add(Ee,Se),await t.yield();const e0=mo(o,i,p,h,c);f.add(e0.mesh),await t.yield();let Ne=-1,o0=!1;const Re=Bt.map(()=>null),a0=new g.Vector2,Ge=new g.Vector3,tt=(n,v,T)=>W(n,v,T);function D0(n,v,T){const k=Bt[n],q=ie.uOff.value[n],R=me[n];let S=0,K=0,ot=0;if(q.set(0,0,0,0),k.kind==="none")S=0;else if(k.kind==="static")S=.62;else if(k.kind==="flyer"){const V=T*k.w+k.ph;S=.62,q.set(.25+.15*Math.sin(V*1.7),k.ay*Math.sin(V),-k.az*Math.cos(V),0),ot=Math.atan2(k.ay*Math.cos(V)*k.w,-k.az*Math.sin(V)*k.w)}else if(k.name==="orchid"){const V=tt(.29,.316,v),F=tt(.314,.337,v);S=.3*V+.7*F,q.set(7.5*F,(.6+.16*Math.sin(T*1.3))*F,1.5*F,-.75*F)}else if(k.name==="hummingbird"){const V=tt(.326,.35,v),F=tt(.349,.359,v),I=tt(.353,.402,v);S=.3*V+.25*F+.45*I,q.set(1.6*F+5.5*Math.sin(Math.PI*I)+.14*Math.sin(T*2.9)*F,(ft.y-.5-(k.base+2.3*k.s))*I+.2*Math.sin(T*2.3)*F,(ft.z+3.4-k.z)*I+.16*Math.sin(T*1.7+1)*F,-.6*F*(1-.6*I))}else if(k.name==="tapir"){const V=tt(.385,.412,v),F=Math.max(0,v-.42);K=Math.min(.35*G*(F-.004*(1-Math.exp(-F/.004))),k.hw*.95+U-6.5);const I=Math.min(K,k.hw*.95),H=K-I,Z=Ct(H/3,0,1);ot=k.tilt*Z,S=.3*V+Math.min(.6,F*40),q.set(.06*Math.min(1,K),H*Math.sin(k.tilt)+1.1*k.s*(1/Math.cos(ot)-1),-(I+H*Math.cos(k.tilt)),0)}else if(k.name==="beetle"){const V=tt(.428,.458,v),F=Math.max(0,v-.468),I=tt(0,.012,F);S=.3*V+.1*tt(.458,.468,v)+.6*tt(0,.02,F);const H=34-13.5*tt(0,.02,F)+22*tt(.03,.055,F)+120*tt(.05,.12,F),Z=$(v+H/G,et),at=$(k.bu,J);F>0&&q.set(.6*I+Z.x*tt(0,.03,F)+420*Math.max(0,F-.03),Z.y-at.y+1.5*tt(0,.02,F)+11*tt(.025,.055,F)+.6*Math.sin(T*3.1)*I,Z.z-R.z,-1.1*tt(0,.02,F))}else{const V=tt(k.bu-k.lead-.03,k.bu-k.lead,v),F=tt(k.bu-k.lead,k.bu-k.lead+.015,v);if(S=.3*V+.3*F,k.name==="butterfly"){const I=tt(k.bu-.022,k.bu+.03,v);q.set(.5*F+5*I,.3*Math.sin(T*3.1)*F+8*I,-9*I,-.4*F)}else q.set(.25*F,0,0,0)}Re[n]!==null&&(S=Re[n],q.set(0,0,0,0),K=0,ot=0),ie.uP.value[n]=S,ie.uD.value[n]=K,ie.uPose.value[n].x=ot}function n0(n,v,T){h.uTime.value=v,t.renderer&&(t.renderer.getDrawingBufferSize(a0),h.uResY.value=Math.max(64,a0.y));const k=Ne>=0?P.toLegacy(Ne):.26+.34*(v/26%1);for(let q=0;q<C0;q++)D0(q,k,v);if(ae.uConduit.value=c?It(.2,1.06,tt(.15,.9,k)):.42+.07*Math.sin(v*.23),X.w=c?It(ht*.5,ht+3,tt(.2,.6,k)):ht-12+2.5*Math.sin(v*.21),!o0)for(let q=0;q<2;q++){const R=740-(v*22+q*30)%620;ae.uShadow.value[q].set(-R,a(R)-24-q*9+3*Math.sin(v*.5+q),3.4-q*.5,.85)}}function s0(n,v){const T=ae.uShadow.value[n];if(!v||v.x<=.2||p.sun.x<=.05){T.w=0;return}Ge.copy(v).addScaledVector(p.sun,-v.x/p.sun.x),T.set(-Ge.z,Ge.y,2.2+v.x*.05,Ct(1.1-v.x/60,0,.9))}function V0(n,v){o0=!0,s0(0,n),s0(1,v)}n0(0,0,null);const E0=Math.sin(Qt),S0=Math.cos(Qt),N0={portalSeat:{position:P.end.clone(),facing:new g.Vector3(0,-E0,S0),tilt:Qt},flyThrough:P.pts.map(n=>n.clone()),seamFoot:new g.Vector3(0,0,ye),boxes:L.map(n=>({name:n.name,position:new g.Vector3(0,n.y,n.z),size:new g.Vector2(n.hw*2,n.hh*2),u:n.u})),falls:mt.map(n=>({top:new g.Vector3(0,n.top,n.z),foot:new g.Vector3(0,n.foot,n.z)})),crater:new g.Vector3(-10,oe,0),plumeTop:e0.top,passionflowers:ft.clone(),viewpoints:{aisle:new g.Vector3(60,26,970),page:new g.Vector3(150,190,430),ridge:new g.Vector3(4,a(240)+9,240),notch:P.start.clone()}};return{object:f,radius:ye,height:462,center:new g.Vector3(0,190,0),anchors:N0,update:n0,dispose(){},ground:!1,groundY:0,setProgress(n){Ne=Ct(n,0,1)},setSpecimen(n,v){Re[n]=v},setShadows:V0,heightAt:(n,v)=>n>0?0:i.heightAt(n,v),zones:{palms:[0,60],cloudForest:[60,190],paramo:[190,310],arenal:[310,380],snow:[380,462]},uniforms:h,rare:c,bloom:s,S:p,groundAt:i.heightAt,samples:P.samples,materials:{ground:w,plant:bt,plantOut:ne},grow:{up:Wt.uniforms.uGrow.value,far:ke.uniforms.uGrow.value,out:ne.uniforms.uGrow.value,rib:it},sites:{palms:Lt,crowns:Dt,frail:$t,puya:Ae,frailNew:$t.r11,cushNear:Pe,cushFar:Ve,ribs:Je,rocks:Le},upperDetail:pe,upperFar:T0,ribField:x,routeNear:de,layout:{caves:nt,residents:ce,falls:mt,ventZ:gt,ventTop:ht,lean:yt},toLegacy:P.toLegacy,fromLegacy:P.fromLegacy,legacyLength:P.Lold,flowAt:A}}const ko={makeAcc:Ut,vtx:Jt,accGeometry:Rt,accTube:te,accRibbon:Gt,accDome:ge,instancePlants:Mt,plateMaterial:Nt,thin:E,rockGeometry:u0,PLANT_FRAG:$e,PAGE_LIB:je,FOG_V:Zt,FOG_F:_t,FRAG_END:jt};export{Yt as PLATE_COMMON,bo as buildHero,ko as plateKit,H0 as plateUniforms};
