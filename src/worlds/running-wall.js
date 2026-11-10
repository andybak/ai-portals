import*as i from"three";import{makePath as ga,clamp as I,lerp as x,smoothstep as wa,bell as W0,makeRng as vt,hashSeed as pt}from"../kit/core.js";import{buildHero as xa,PIGMENT_GLSL as N0,makeGrainTexture as ba,Fig as be,addLeg as Be}from"../parts/running-wall.js";const _0=["#E9DFC8","#F7F2E6","#BBA988","#2B2623","#D29B3E","#A8432A"],$=Math.PI*2,se=2.3,Q0=8.3,V0=Q0-se,i0=-26,Po=-25.78,a=wa,ye=(d,H,R,T,W,S,C,L)=>{Be(d,3,H[0],H[1],H[2],H[3],T,W,C,!1,L),Be(d,4,H[0],H[1],H[2],H[3],T,-W,C,!1,L),Be(d,5,R[0],R[1],R[2],R[3],T,S,C,!0,L),Be(d,6,R[0],R[1],R[2],R[3],T,-S,C,!0,L)},gt=(d,H,R,T,W)=>{const S=[];for(let C=0;C<=6;C++)S.push([H+Math.cos(C/6*$)*W,R+Math.sin(C/6*$)*W*.7]);for(const C of[1,-1])d.sheet([H,R],S,{z:C*T,paint:[0,1,0],bone:1,param:()=>.9,edge:0})};function ya(){const d=new be,H=[[-1.45,1.25,.05,.04],[-1.38,1.22,.24,.18],[-1.1,1.2,.38,.28],[-.6,1.2,.44,.33],[-.1,1.25,.52,.38],[.36,1.42,.74,.42],[.72,1.52,.82,.4],[1,1.32,.54,.3],[1.15,1.2,.25,.16]];d.tube(H,{sides:8,bone:0,paint:(S,C)=>[.85-.12*a(.45,.8,S),Math.max(.92*a(.4,.6,S)*a(-.1,.55,C),.62*a(.1,-.9,C)),0]});const R=[[.8,1.25,.5,.26],[1.15,1.15,.42,.23],[1.42,1,.33,.19],[1.62,.85,.24,.15],[1.78,.7,.16,.11],[1.86,.6,.07,.06]];d.tube(R,{sides:8,bone:1,ghost:!0,param:S=>a(0,.6,S),paint:(S,C)=>[.82,Math.max(.9*a(.5,.9,C)*a(.85,.35,S),.88*a(.82,.96,S)),0]});for(const S of[1,-1])d.tube([[1.33,1.27,.07,.06],[1.35,1.47,.066,.055],[1.44,1.65,.052,.042],[1.6,1.77,.032,.026],[1.73,1.8,.012,.012]],{sides:5,bone:1,ghost:!0,param:()=>.7,zBow:C=>S*(.14+.16*Math.sin(Math.PI*C*.8)),paint:()=>[0,1,0],edgeBias:-.01}),d.sheet([1.5,.62],[[1.3,.78],[1.72,.66],[1.6,.36],[1.42,.3],[1.3,.78]],{z:S*.03,paint:[0,1,0],bone:1,ghost:!0,param:()=>.9,edge:.04});d.tube([[-1.4,1.35,.045,.03],[-1.56,1.25,.035,.025],[-1.68,.95,.03,.02],[-1.72,.7,.055,.03],[-1.74,.55,.015,.012]],{sides:5,bone:2,flat:!0,param:S=>S,paint:()=>[0,1,0]});const T=[.72,1,.48,.42],W=[-1,1.05,.5,.44];return ye(d,T,W,.2,.17,.17,1.25,.85),{...d.build(),fore:T,hind:W,L3:.2,gait:[1.45,.42,.06,.06],neck:[.85,1.25,.07,1.15],height:2.2,len:3.3,stride:6.4,coat:S=>({ochre:.75+.3*S(),fill:.22+.2*S(),red:0,antler:1})}}function ka(){const d=new be,H=[[-1.7,1.2,.05,.04],[-1.6,1.18,.3,.22],[-1.25,1.15,.5,.36],[-.6,1.12,.55,.42],[0,1.1,.56,.43],[.55,1.24,.68,.43],[.95,1.36,.68,.39],[1.3,1.24,.46,.28],[1.45,1.15,.2,.14]];d.tube(H,{sides:8,bone:0,paint:(S,C)=>[.7+.3*C,.9*a(.36,.44,S)*a(.6,.52,S)+.5*a(.2,-.9,C),0]});const R=[[1.1,1.2,.46,.26],[1.5,1.05,.37,.22],[1.85,.85,.29,.18],[2.15,.68,.23,.15],[2.35,.58,.17,.12],[2.45,.52,.08,.07]];d.tube(R,{sides:8,bone:1,ghost:!0,param:S=>a(0,.5,S),paint:(S,C)=>[.6+.3*C,.75*a(.6,.95,S),0]}),d.tube([[2.24,.7,.14,.05],[2.46,.98,.115,.04],[2.74,1.28,.085,.032],[3.06,1.56,.055,.024],[3.36,1.76,.018,.014]],{sides:6,bone:1,ghost:!0,param:()=>1,paint:()=>[0,1,0],edgeBias:-.02}),d.tube([[2,.92,.08,.04],[2.06,1.1,.05,.03],[2.12,1.24,.015,.012]],{sides:5,bone:1,ghost:!0,param:()=>1,paint:()=>[0,1,0],edgeBias:-.02});for(const S of[1,-1])d.sheet([1.5,1.42],[[1.46,1.3],[1.6,1.34],[1.5+.03*S,1.6],[1.46,1.3]],{z:S*.16,paint:[0,1,0],bone:1,ghost:!0,param:()=>.6,edge:0});gt(d,1.92,.98,.17,.03);const T=[1,1,.46,.4],W=[-1.15,1.02,.48,.42];return ye(d,T,W,.2,.22,.22,1.5,.6),{...d.build(),fore:T,hind:W,L3:.2,gait:[1.2,.25,.02,.05],gaitOff:[0,.5,.75,.25],neck:[1.2,1.2,.3,1.1],height:1.95,len:4.2,stride:2.8,noGhost:!1}}function Ma(){const d=new be,H=[[-1.9,1.8,.06,.05],[-1.8,1.75,.5,.36],[-1.4,1.8,.8,.58],[-.7,1.95,.95,.7],[0,2.1,1.05,.75],[.7,2.25,1.05,.72],[1.2,2.25,.9,.6],[1.5,2.2,.6,.4],[1.65,2.2,.2,.15]];d.tube(H,{sides:8,bone:0,paint:(S,C)=>[.95-.25*C,.3+.55*a(.1,-.85,C),0]});const R=[[1.25,2.6,.7,.5],[1.6,2.85,.62,.45],[1.92,2.8,.52,.4],[2.15,2.45,.42,.32],[2.28,2.05,.3,.24]];d.tube(R,{sides:8,bone:1,ghost:!0,openEnd:!0,param:S=>a(0,.6,S),paint:(S,C)=>[.9,.35+.35*a(.3,1,C),0]}),d.tube([[2.28,2.1,.3,.2],[2.4,1.6,.24,.17],[2.45,1.1,.19,.14],[2.42,.65,.15,.11],[2.3,.3,.11,.09],[2.12,.14,.08,.07]],{sides:6,bone:2,param:S=>S,paint:(S,C)=>[.7,.5+.3*C,0]});for(const S of[1,-1])d.tube([[2.12,2,.1,.09],[2.42,1.5,.095,.085],[2.82,1.22,.085,.075],[3.2,1.4,.06,.055],[3.36,1.82,.035,.03],[3.26,2.12,.012,.012]],{sides:6,bone:1,ghost:!0,param:()=>.8,zBow:C=>S*(.3+.42*Math.sin(Math.PI*C*.75)),paint:()=>[.08,.05,0],edgeBias:-.01}),d.sheet([1.5,2.55],[[1.42,2.8],[1.62,2.72],[1.6,2.4],[1.46,2.25],[1.38,2.5],[1.42,2.8]],{z:S*.47,paint:[.4,.75,0],bone:1,param:()=>.6,edge:.05});gt(d,1.98,2.62,.4,.04),d.tube([[-1.84,2.05,.06,.04],[-1.98,1.8,.05,.035],[-2.02,1.45,.07,.035],[-2.02,1.25,.02,.015]],{sides:5,bone:0,flat:!0,paint:()=>[0,1,0]});const T=[1.05,1.75,.8,.7],W=[-1.2,1.6,.75,.62];return ye(d,T,W,.3,.36,.34,2,.55),{...d.build(),fore:T,hind:W,L3:.3,gait:[1.7,.3,.03,.015],gaitOff:[0,.5,.75,.25],neck:[1.3,2.5,.045,2],tail:[0,.03,0,.3],height:3.5,len:5.2,stride:3.4}}function za(){const d=new be,H=[[-1.5,.98,.05,.04],[-1.42,.97,.2,.15],[-1.12,.98,.31,.22],[-.6,.93,.29,.21],[-.05,.9,.3,.22],[.5,.95,.35,.24],[.9,1.01,.37,.24],[1.15,1.02,.3,.2],[1.3,1,.14,.1]];d.tube(H,{sides:8,bone:0,paint:(S,C)=>[.8+.3*C,.34*a(.35,-.85,C),0]});const R=[[1,1.05,.32,.19],[1.35,1.07,.27,.17],[1.62,1.06,.24,.16],[1.82,1.04,.22,.15],[2,.98,.17,.12],[2.12,.93,.13,.1],[2.18,.9,.06,.05]];d.tube(R,{sides:8,bone:1,ghost:!0,param:S=>a(0,.6,S),paint:(S,C)=>[.88,.85*a(.86,.99,S)+.3*a(.5,1,S)*a(.2,-.7,C),0]});for(const S of[1,-1]){d.sheet([1.7,1.3],[[1.6,1.24],[1.78,1.25],[1.76,1.36],[1.66,1.39],[1.6,1.24]],{z:S*.12,paint:[0,1,0],bone:1,ghost:!0,param:()=>.8,edge:0});for(let C=0;C<3;C++)d.sheet([2.02,.93-C*.02],[[2-C*.03,.96-C*.035],[2.03-C*.03,.96-C*.035],[2.03-C*.03,.93-C*.035],[2-C*.03,.96-C*.035]],{z:S*.125,paint:[0,1,0],bone:1,param:()=>.9,edge:0})}gt(d,1.9,1.1,.13,.028),d.tube([[-1.44,1.02,.065,.045],[-1.8,.86,.055,.04],[-2.2,.66,.05,.035],[-2.6,.58,.045,.035],[-2.9,.62,.075,.045],[-3.08,.68,.02,.015]],{sides:5,bone:2,flat:!0,param:S=>S,paint:S=>[.5*(1-a(.7,.85,S)),.25+a(.68,.84,S),0]});const T=[.9,.9,.42,.36],W=[-1.12,.92,.45,.38];return ye(d,T,W,.14,.13,.14,1.3,.12),{...d.build(),fore:T,hind:W,L3:.14,gait:[1.5,.42,.11,.12],gaitOff:[.5,.58,0,.08],neck:[1.05,1.05,.05,.95],tail:[.08,.07,0,.03],height:1.4,len:4,stride:6.2}}function Sa(){const d=new be,H=[[-.7,.75,.04,.03],[-.65,.74,.15,.11],[-.4,.74,.22,.16],[0,.73,.24,.17],[.35,.77,.25,.16],[.55,.8,.18,.12],[.65,.8,.08,.06]];d.tube(H,{sides:6,bone:0,paint:(S,C)=>[.7,.55+.3*a(.2,-.8,C),0]});const R=[[.45,.85,.18,.1],[.62,1.05,.12,.08],[.75,1.2,.1,.07],[.9,1.17,.08,.06],[1.02,1.1,.05,.04]];d.tube(R,{sides:6,bone:1,param:S=>a(0,.6,S),paint:()=>[.5,.8,0]});for(const S of[1,-1])d.tube([[.72,1.28,.04,.03],[.66,1.52,.04,.03],[.48,1.7,.035,.025],[.25,1.7,.025,.02],[.1,1.55,.01,.01]],{sides:4,bone:1,param:()=>1,z:S*.06,paint:()=>[0,1,0],edgeBias:-.02});const T=[.42,.72,.34,.3],W=[-.48,.73,.35,.31];return ye(d,T,W,.14,.09,.09,.8,.8),{...d.build(),fore:T,hind:W,L3:.14,gait:[.8,.16,.01,.01],gaitOff:[0,.5,.75,.25],neck:[.5,.9,.08,.8],tail:[0,0,0,0],height:1.7,len:1.7,stride:1.5}}const Ke=`
attribute vec4 aRock;
varying vec3 vW, vN;
varying vec4 vRock;
#include <fog_pars_vertex>
void main(){
  vec4 lp = vec4(position, 1.0); vec3 ln = normal;
  #ifdef USE_INSTANCING
  lp = instanceMatrix * lp; ln = mat3(instanceMatrix) * ln;
  #endif
  vec4 wp = modelMatrix * lp;
  vW = wp.xyz; vRock = aRock;
  vN = normalize(mat3(modelMatrix) * ln + vec3(0.0, 1e-5, 0.0));
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Da=`
attribute vec4 aRock;
attribute float aTrail;
varying vec3 vW, vN;
varying vec4 vRock;
varying float vTrail;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz; vRock = aRock; vTrail = aTrail;
  vN = normalize(mat3(modelMatrix) * normal + vec3(0.0, 1e-5, 0.0));
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,He=`
${N0}
varying vec3 vW, vN;
varying vec4 vRock;
#include <fog_pars_fragment>
float rwHash(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
vec4 rwTri(vec3 p, vec3 w){ return rwGrain2(p.zy) * w.x + rwGrain2(p.xz) * w.y + rwGrain2(p.xy) * w.z; }
float rwDash(vec2 p, float cell, float len, float wid, float keep, float wag, out float kind){
  vec2 c = p / cell, id = floor(c), f = fract(c) - 0.5;
  float hd = rwHash(id), ang = (hd - 0.5) * 1.5 + 1.25 + wag;
  vec2 dv = vec2(cos(ang), sin(ang)) * len, o = (vec2(fract(hd * 13.7), fract(hd * 5.1)) - 0.5) * 0.36;
  kind = fract(hd * 3.3);
  return (1.0 - smoothstep(wid, wid * 2.4, rwSeg(f, o - dv, o + dv, 0.0))) * step(keep, hd);
}
// a hoof print: an open crescent
float rwArc(vec2 p, float cell, float keep, out float kind){
  vec2 c = p / cell, id = floor(c), f = fract(c) - 0.5;
  float hd = rwHash(id + 7.0), a = hd * 6.2831853;
  kind = fract(hd * 4.7);
  vec2 q = f - (vec2(fract(hd * 13.7), fract(hd * 5.1)) - 0.5) * 0.3;
  float ring = abs(length(q) - 0.2);
  return (1.0 - smoothstep(0.035, 0.08, ring)) * smoothstep(-0.06, 0.1, dot(q, vec2(cos(a), sin(a)))) * step(keep, hd);
}
// skid marks: long scuffs that all run one way (p = metres along and across that way)
float rwSkid(vec2 p, out float kind){
  vec2 c = vec2(p.x / 1.7, p.y / 0.46), id = floor(c), f = fract(c) - 0.5;
  float hd = rwHash(id + 31.0);
  kind = fract(hd * 7.7);
  vec2 q = vec2(f.x * 1.7, (f.y + (hd - 0.5) * 0.3) * 0.46);
  float len = 0.34 + 0.44 * fract(hd * 5.3);
  float d = rwSeg(q, vec2(-len, 0.0), vec2(len, (fract(hd * 3.1) - 0.5) * 0.16), 0.0);
  return (1.0 - smoothstep(0.035, 0.1, d)) * step(0.35, hd);
}
`,Ra=`
${He}
uniform float uCloud, uGlow;
uniform vec4 uRC;            // where the rhinos spar (x, z) and the axis they shove along (x, z)
varying float vTrail;
void main(){
  vec3 n = normalize(vN + vec3(0.0, 1e-4, 0.0));
  vec3 w = abs(n); w *= w; w /= (w.x + w.y + w.z + 1e-4);
  vec4 gr = rwTri(vW, w);
  float h = gr.r, hs = rwTri(vW + uSun * 0.022, w).r;
  vec4 mac = texture2D(uGrain, vW.xz * 0.0037 + 0.21);
  vec4 mid = texture2D(uGrain, vW.xz * 0.023);
  float cloud = texture2D(uGrain, (vW.xz + vec2(0.0, -uTime * 4.0)) * 0.0011 + 0.4).g;
  float gate = texture2D(uGrain, vec2((vW.x + vW.z) * 0.013, vW.y * 0.09) + 0.6).b;
  float streak = texture2D(uGrain, vec2((vW.x - vW.z) * 0.019, vW.y * 0.004) + 0.15).g;
  float dist = distance(vW, cameraPosition);
  float grass = vRock.x, ice = vRock.y, gravel = vRock.z;
  float steep = 1.0 - smoothstep(0.5, 0.8, n.y);
  vec3 rock = rwRock(h, gr.g) * (0.9 + 0.2 * mac.g);
  vec3 col = rock;
  // ice: calcite white, drawn with a few charcoal crevasse strokes
  vec3 iceCol = mix(uPale, vec3(0.9), 0.5) * (0.74 + 0.16 * h);
  col = mix(col, iceCol, ice);
  float flat1 = (1.0 - steep) * (1.0 - ice);
  // the steppe is a yellow-ochre wash, patchy, and the gust bands run through it as a darker ripple
  float gust = sin(dot(vW.xz, vec2(0.05, 0.11)) - uTime * 1.7) * 0.5 + sin(dot(vW.xz, vec2(-0.13, 0.04)) - uTime * 2.6) * 0.25;
  col = mix(col, uOchre * (0.6 + 0.3 * h), rwDab(grass * (0.52 + 0.75 * mid.g + 0.13 * gust) + (mac.g - 0.5) * 0.32, h, 0.2) * 0.6 * flat1);
  col = mix(col, mix(uOchre, uShade, 0.5) * 0.7, rwDab(grass * (smoothstep(0.42, 0.75, mac.b) * 0.7 - 0.14 * gust), h, 0.25) * 0.32 * flat1);
  // grass signs: charcoal and ochre dashes; a fine layer beyond the real tufts round the eye, a coarse one for the middle
  // distance that thins to ochre before it can turn to speckle
  float k1, k2, k3;
  float d1 = rwDash(vW.xz, 0.5, 0.3, 0.02, 0.2 + 0.5 * (1.0 - mid.g), gust * 0.5, k1) * (0.55 + 0.45 * smoothstep(9.0, 21.0, dist)) * smoothstep(2.0, 6.0, dist) * (1.0 - smoothstep(30.0, 64.0, dist));
  float d2 = rwDash(vW.xz + 7.3, 1.9, 0.3, 0.014 + dist * 0.00012, 0.3, gust * 0.3, k2) * (1.0 - smoothstep(80.0, 170.0, dist));
  float dd = max(d1, d2) * grass * flat1, kk = d1 > d2 ? k1 : k2;
  col = mix(col, mix(uChar * mix(1.25, 0.6, uEngr), uOchre * 0.8, step(0.55 - 0.3 * smoothstep(40.0, 120.0, dist), kk)), rwDab(dd * 0.95, h, 0.15) * 0.9);
  col = mix(col, vec3(0.86, 0.87, 0.85), uSnow * smoothstep(0.6, 0.34, h) * (0.45 + 0.55 * mac.g) * flat1 * 0.85);   // first snow lies white in the hollows of the grain, over the grass signs
  // gravel and scree: pebble dots
  float k4;
  float d3 = max(rwDash(vW.xz + 3.1, 0.46, 0.05, 0.085, 0.22, 0.0, k3) * (1.0 - smoothstep(20.0, 48.0, dist)), rwDash(vW.xz + 11.7, 1.7, 0.07, 0.075, 0.35, 0.0, k4) * (1.0 - smoothstep(70.0, 160.0, dist)));
  vec3 ink = mix(uChar * 1.6, uShade * 1.6, uEngr);
  col = mix(col, mix(ink, uRock * 0.42, step(0.4, k3)), rwDab(d3 * gravel * flat1 * 0.85, h, 0.15) * 0.8);
  col = mix(col, uShade, rwDab(gravel * (mid.b - 0.42) * 1.6 * flat1, h, 0.2) * 0.22);
  // cobbles: a charcoal crescent with a pale stone laid over it toward the sun, so each one stands up
  float k5, k6;
  float near1 = 1.0 - smoothstep(34.0, 80.0, dist);
  float cb = rwDash(vW.xz + 5.7, 1.05, 0.03, 0.17, 0.42, 0.0, k5) * near1;
  float ct = rwDash(vW.xz + 5.7 + uSun.xz * 0.07, 1.05, 0.03, 0.13, 0.42, 0.0, k6) * near1;
  float gz = gravel * flat1;
  col = mix(col, ink, rwDab(cb * gz * 0.9, h, 0.12) * 0.85);
  col = mix(col, rock * (1.08 + 0.2 * k6), ct * gz * 0.92);
  // drift lines: the strand marks the river leaves, wavering along the level of the bar; flood ochre between them
  float lvl = (vW.y - (${i0}.0)) * 3.4 + mid.g * 1.3 + mac.b * 0.8;
  float dl = abs(fract(lvl) - 0.5), wetz = 1.0 - smoothstep(1.4, 2.6, vW.y - (${i0}.0));
  float fwl = max(fwidth(lvl), 1e-4);
  float drift = (1.0 - smoothstep(0.03 + fwl, 0.07 + fwl * 1.5, dl)) * gz * wetz * (0.5 + 0.5 * step(0.4, gate));
  col = mix(col, uChar * 1.7, rwDab(drift * 0.85, h, 0.2) * 0.62 * (1.0 - smoothstep(60.0, 150.0, dist)));
  col = mix(col, uOchre * 0.8, rwDab(gz * wetz * smoothstep(0.55, 0.8, streak) * 0.8, h, 0.25) * 0.3);
  // the trail: churned red-ochre earth and hoof marks where the herd runs
  float k7;
  float hoof = rwDash(vW.xz + 1.9, 0.74, 0.05, 0.05, 0.56, gr.b * 3.0, k7) * (1.0 - smoothstep(24.0, 55.0, dist));
  float tr = vTrail * (1.0 - ice);
  col = mix(col, mix(uShade, uOchre * 0.5, 0.45), rwDab(tr * (0.22 + 0.8 * mid.g) - 0.1, h, 0.2) * 0.26);   // trodden earth
  col = mix(col, uRed * 0.85, rwDab(tr * (0.2 + 0.75 * mid.b) * (0.55 + 0.6 * gr.b) - 0.14, h, 0.14) * 0.34);
  col = mix(col, mix(uShade * 0.8, uRed * 0.7, step(0.6, k7)), rwDab(hoof * tr * 0.95, h, 0.12) * 0.8);
  // hoof prints: open crescents, plain under our own hooves and lost in the grain a little way off
  float k12;
  float print = rwArc(vW.xz + 6.3, 0.66, 0.42, k12) * (1.0 - smoothstep(14.0, 34.0, dist));
  col = mix(col, mix(ink * 0.8, uRed * 0.62, step(0.74, k12)), rwDab(print * tr * 0.95, h, 0.13) * 0.72);
  // the rhinos' ground: a scuffed ring where the two shove each other back and forth. Dark trodden earth, thrown
  // red-ochre turf, charcoal hoof crescents, long skids along their axis, and the grass round it trampled flat
  vec2 rq = vW.xz - uRC.xy;
  vec2 ra = vec2(dot(rq, uRC.zw), rq.x * uRC.w - rq.y * uRC.z);   // along the way they shove, and across it
  float rr = length(vec2(ra.x * 0.82, ra.y * 1.2)) + (gr.g - 0.5) * 3.4 + (mid.g - 0.5) * 1.6 + (gr.b - 0.5) * 0.8;
  float churn = (1.0 - smoothstep(4.4, 6.6, rr)) * flat1, core = 1.0 - smoothstep(1.0, 5.5, rr);
  float k8, k9, k10, k11;
  float arcs = rwArc(vW.xz + 2.7, 1.05, 0.25, k8), skid = rwSkid(ra, k9) * (1.0 - smoothstep(1.6, 4.2, abs(ra.y)));
  float flatg = rwDash(vW.xz + 4.4, 0.43, 0.36, 0.024, 0.22, 0.0, k10) * smoothstep(3.4, 5.2, rr) * (1.0 - smoothstep(7.5, 11.0, rr)) * flat1;
  float clod = rwDash(vW.xz + 9.1, 0.37, 0.04, 0.1, 0.5, 0.0, k11);
  col = mix(col, mix(uShade, uOchre * 0.45, 0.3), rwDab(churn * (0.25 + 0.4 * core + 0.75 * mid.b) - 0.08, h, 0.2) * 0.42);
  col = mix(col, uRed * 0.86, rwDab(churn * smoothstep(0.38, 0.72, gr.g * 0.6 + mac.b * 0.4 + 0.25 * core) * (0.5 + 0.7 * gr.b) - 0.06, h, 0.14) * 0.5);
  col = mix(col, mix(uRed * 0.8, ink, step(0.4, k11)), rwDab(clod * churn * 0.95, h, 0.12) * 0.85);
  col = mix(col, ink, rwDab(skid * churn * 0.97, h, 0.13) * 0.85);
  col = mix(col, mix(ink, uRed * 0.72, step(0.8, k8)), rwDab(arcs * churn * 0.97, h, 0.12) * 0.9);
  col = mix(col, mix(uOchre * 0.82, mix(uChar * 1.3, uShade, uEngr), step(0.7, k10)), rwDab(flatg * 0.95, h, 0.15) * 0.85);
  // the water's edge: a charcoal bank line
  float bank = 1.0 - smoothstep(0.05, 0.13, abs(vW.y - (${i0}.0) - 0.06));
  col = mix(col, uChar * 1.5, rwDab(bank * vRock.w * 0.95, h, 0.2) * 0.75);
  // cliffs: bedding strokes, ochre weeping, and the drawn shade on faces turned from the sun
  float by = vW.y / 6.5 + (mac.g - 0.5) * 1.6 + (vW.x - vW.z) * 0.004;
  float bl = abs(fract(by) - 0.5);
  float crack = (1.0 - smoothstep(0.03, 0.1, bl)) * smoothstep(0.34, 0.6, gate) * steep;
  col = mix(col, mix(uOchre * 0.8, iceCol * 0.7, ice), rwDab(streak * 0.9 * steep, h, 0.25) * 0.36);
  float sh = smoothstep(0.2, -0.55, dot(n, uSun)) * max(steep, 0.4);
  col = mix(col, uShade, rwDab(sh * 0.85 + (gr.b - 0.5) * 0.3, h, 0.25) * 0.55);
  col *= 1.0 + uGlow * 0.22 * steep * smoothstep(0.0, 0.7, dot(n, uSun));   // golden hour: the low sun whitens the faces turned to it
  col = mix(col, uChar * 1.5, rwDab(crack * 0.92, h, 0.2) * 0.72);
  col = mix(col, uShade, rwDab(smoothstep(0.5, 0.15, fract(by + 0.5)) * 0.45 * steep, h, 0.25) * 0.3);
  // the shade of the smudge clouds, crossing the land
  col = mix(col, uShade, rwDab(smoothstep(0.55, 0.75, cloud) * 0.7 * uCloud + (gr.b - 0.5) * 0.2, h, 0.3) * 0.34 * uCloud);
  // wet margin of the river
  col = mix(col, uShade, vRock.w * 0.3);
  col = mix(rock, col, mix(1.0, 0.4, smoothstep(0.0, uFade, dist)));
  col *= 1.0 + rwRake(h, hs);
  col += rwSpark(gr, vW);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Co=`
${He}
void main(){
  vec3 n = normalize(vN + vec3(0.0, 1e-4, 0.0));
  vec3 w = abs(n); w *= w; w /= (w.x + w.y + w.z + 1e-4);
  vec4 gr = rwTri(vW, w);
  float h = gr.r, hs = rwTri(vW + uSun * 0.022, w).r;
  vec2 wu = vec2(vRock.w, vW.y);
  float kind = vRock.z, arch = step(1.5, kind), floorK = step(0.5, kind) * (1.0 - arch), stalK = step(kind, -0.5);   // kind -1: a stalagmite, w = the height of its foot
  float bed = texture2D(uGrain, vec2(vW.y * 0.13 + gr.g * 0.1, 0.31 + vRock.w * 0.004)).b;
  float zone = texture2D(uGrain, wu * 0.021 + 0.5).g;
  float zone2 = texture2D(uGrain, wu * 0.017 + vec2(0.13, 0.71)).g;
  float wipe = texture2D(uGrain, vec2(wu.x * 0.31, wu.y * 0.035) + 0.2).b;
  float gate = texture2D(uGrain, vec2(wu.x * 0.043, wu.y * 0.37) + 0.6).b;
  vec4 fl = texture2D(uGrain, (vW.xz + vec2(0.0, vRock.x * floorK)) * 0.06 + 0.3);
  vec3 col = rwRock(h, gr.g);
  float wall = 1.0 - floorK, fz = vRock.x * wall;
  col = mix(col, uOchre * 0.85, rwDab(bed * 0.75 * wall, h, 0.22) * 0.3);
  float sh = smoothstep(0.12, -0.6, dot(n, uSun)) * (1.0 - vRock.y);
  col = mix(col, uShade, rwDab(sh * 0.85 + (gr.b - 0.5) * 0.35, h, 0.25) * 0.55);
  float bs = mix(1.3, 3.4, arch);
  float by = vW.y / bs + (zone - 0.5) * 1.7 + vRock.w * 0.012;
  float bl = abs(fract(by) - 0.5), rockOnly = wall * (1.0 - fz * (1.0 - arch)) * step(0.5, vRock.w) * (1.0 - stalK);
  rockOnly *= 1.0 - smoothstep(0.55, 0.85, abs(n.y)) * (1.0 - arch);
  float crack = (1.0 - smoothstep(0.02, 0.07, bl)) * smoothstep(0.38, 0.6, gate) * rockOnly;
  col = mix(col, uChar * 1.5, rwDab(crack * 0.9, h, 0.14) * 0.7);
  col = mix(col, uShade, rwDab(smoothstep(0.5, 0.2, fract(by + 0.5)) * 0.42 * rockOnly, h, 0.25) * 0.3);
  // a stalagmite is drawn like the animals: ochre drip bands round it, a smudge where it stands, a charcoal contour
  float sBand = texture2D(uGrain, vec2(0.37 + gr.g * 0.04, vW.y * 0.55 + vRock.w * 0.13)).b;
  float sRim = 1.0 - abs(dot(n, normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0))));
  col = mix(col, uOchre * 0.8, rwDab(smoothstep(0.5, 0.68, sBand) * 0.9 * stalK, h, 0.2) * 0.5);
  col = mix(col, uShade, rwDab((1.0 - smoothstep(0.05, 0.75, abs(vW.y - vRock.w))) * 0.9 * stalK, h, 0.25) * 0.6);
  col = mix(col, uChar * 1.5, rwDab(smoothstep(0.6, 0.86, sRim) * 0.95 * stalK, h, 0.14) * 0.8);
  // the painted wall: palm-dot panels, hand stencils, torch wipes
  float hs2 = mix(1.0, 2.6, arch);
  vec2 c = wu / (0.3 * hs2), id = floor(c), f = fract(c) - 0.5;
  float hd = rwHash(id);
  float dotm = (1.0 - smoothstep(0.24, 0.33, length(f + (vec2(hd, fract(hd * 7.3)) - 0.5) * 0.25))) * step(0.42, hd);
  float red = dotm * smoothstep(0.7, 0.76, zone) * step(fract(hd * 9.1), 0.82);
  vec2 cs = vec2(1.05, 0.85) * hs2;
  vec2 c2 = (wu + vec2(0.0, 0.3)) / cs, id2 = floor(c2), f2 = (fract(c2) - 0.5) * cs;
  float hh = rwHash(id2 + 17.0), ha = (hh - 0.5) * 1.1;
  vec2 hp = vec2(f2.x * cos(ha) - f2.y * sin(ha), f2.x * sin(ha) + f2.y * cos(ha)) / (0.36 * hs2);
  hp.x *= fract(hh * 5.7) > 0.5 ? 1.0 : -1.0;
  float d = rwHand(hp);
  float keep = mix(step(hh, 0.6) * smoothstep(0.5, 0.58, zone2) * step(1.0, id2.y) * step(id2.y, 3.0), step(hh, 0.86), arch);
  float hand = step(0.0, d) * (1.0 - smoothstep(0.02, 0.5 + 0.1 * sin(uTime * 1.7 + hh * 40.0), d)) * keep;
  red = max(red * (1.0 - arch * 0.4), hand * (0.6 + 0.6 * gr.a));
  col = mix(col, uRed, rwDab(red * fz, h, 0.16) * 0.9);
  vec3 ink = mix(uChar * 1.5, uShade * 1.6, uEngr);   // engraved (night): stains and scatter stay dark, only lines are scraped pale
  col = mix(col, ink, rwDab(smoothstep(0.78, 0.98, wipe) * 0.6 * fz * (1.0 - arch), h, 0.2) * 0.45);
  // cave floor: trodden clay, charcoal scatter, bear wallows
  col = mix(col, uShade, rwDab((fl.g - 0.35) * 1.5 * floorK, h, 0.25) * 0.35);
  col = mix(col, ink, rwDab(smoothstep(0.93, 0.99, fl.a) * floorK + smoothstep(0.75, 0.9, fl.b) * 0.7 * floorK, h, 0.12) * 0.75);
  float dist = distance(vW, cameraPosition);
  col = mix(rwRock(h, gr.g), col, mix(1.0, 0.45, smoothstep(0.0, uFade, dist)));
  col *= 1.0 + rwRake(h, hs);
  col += rwSpark(gr, vW);
  col = rwCave(col, vW, vRock.y);
  vec2 e1 = vW.xz - uHearth.xz, e2 = vW.xz - vec2(0.5 - uHearth.x, uHearth.z - 3.0);
  float emb = (exp(-dot(e1, e1) / 0.5) + exp(-dot(e2, e2) / 0.5)) * floorK * uHearth.w;
  col += vec3(2.6, 0.75, 0.12) * emb * smoothstep(0.35, 0.8, gr.r + 0.25 * sin(uTime * 2.3 + gr.a * 30.0)) + vec3(0.5, 0.1, 0.02) * emb;
  vec3 tm = uMouth.xyz - vW, tt = vW - uTorch.xyz;
  tt.z *= mix(1.0, uTorchBack, step(0.0, tt.z));
  float mlK = exp(-length(tm) / max(uMouth.w, 1.0)), tlK = uTorch.w * exp(-dot(tt, tt) / max(uTorchR, 1.0));
  float back = dot(n, tm / max(length(tm), 1e-3));
  col *= mix(1.0, mix(0.2, 1.0, smoothstep(-0.6, 0.05, back)), vRock.y * mlK / (mlK + tlK + 0.02));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Aa=`
${He}
uniform float uGlow;
void main(){
  vec3 n = normalize(vN + vec3(0.0, 1e-4, 0.0));
  if (dot(n, cameraPosition - vW) < 0.0) n = -n;
  vec3 w = abs(n); w *= w; w /= (w.x + w.y + w.z + 1e-4);
  vec4 gr = rwTri(vW * 0.45, w);
  float h = gr.r, hs = rwTri(vW * 0.45 + uSun * 0.03, w).r;
  vec2 wu = vec2(vRock.w, vW.y);
  float bedp = vRock.x, bi = floor(bedp + 0.5), bl = floor(bedp), bf = fract(bedp), bj = min(bf, 1.0 - bf);
  float fwb = min(fwidth(bedp), 0.2);
  vec4 mac = texture2D(uGrain, wu * 0.0045 + 0.3);
  float gate = texture2D(uGrain, vec2(wu.x * 0.021, bi * 0.37 + 0.1)).b;
  float streak = texture2D(uGrain, vec2(wu.x * 0.035, wu.y * 0.0045) + 0.15).g;
  float streak2 = texture2D(uGrain, vec2(wu.x * 0.09, wu.y * 0.011) + 0.6).b;
  float vjn = texture2D(uGrain, vec2(wu.x * 0.028 + (streak - 0.5) * 0.012, wu.y * 0.0016 + 0.05)).r;
  float zone = texture2D(uGrain, wu * 0.0031 + 0.5).g, zone2 = texture2D(uGrain, wu * 0.0027 + vec2(0.13, 0.71)).g;
  float dist = distance(vW, cameraPosition);
  vec3 rock = rwRock(h, gr.g) * (0.8 + 0.2 * mac.g), col = rock;
  col = mix(col, uOchre * 0.82, (0.14 + 0.14 * rwHash(vec2(bl, 3.0)) + 0.24 * smoothstep(0.4, 0.7, zone)) * (1.0 - 0.6 * vRock.y));
  col = mix(col, uOchre * 0.85, rwDab(smoothstep(0.45, 0.8, streak) * (0.35 + 0.65 * smoothstep(1.0, 0.25, bf)), h, 0.25) * 0.42);
  col = mix(col, uOchre * 0.78, rwDab((mac.b - 0.4) * 1.5, h, 0.25) * 0.22);
  col = mix(col, mix(uShade, uOchre * 0.5, 0.3), rwDab(smoothstep(0.7, 0.92, streak2) * 0.85, h, 0.2) * 0.36);
  // the beds above the painted one stand in a drawn shade of their own, so the crown is a clear step darker than the sky;
  // the painted bed carries a thin ground of yellow ochre under its animals
  float above = smoothstep(4.0, 4.5, bedp);
  col = mix(col, mix(uShade, uOchre * 0.55, 0.4), rwDab(above * (0.46 + 0.5 * mac.g) + (gr.b - 0.5) * 0.3, h, 0.25) * 0.5);
  col = mix(col, uOchre * 0.9, rwDab(vRock.y * (0.3 + 0.5 * zone), h, 0.25) * 0.3);
  float sh = max(smoothstep(0.15, -0.55, dot(n, uSun)) * 0.8, vRock.z);
  col = mix(col, uShade, rwDab(sh * 0.85 + (gr.b - 0.5) * 0.3, h, 0.25) * 0.5);
  col *= 1.0 + uGlow * 0.22 * smoothstep(0.0, 0.7, dot(n, uSun));
  col = mix(col, uShade, rwDab(smoothstep(0.66, 1.0, bf) * 0.7, h, 0.25) * 0.42 * (1.0 - 0.5 * vRock.y));
  float jl = (1.0 - smoothstep(0.02 + fwb, 0.05 + fwb * 1.6, bj)) * smoothstep(0.3, 0.46, gate);
  float vj = (1.0 - smoothstep(0.006, 0.02, abs(vjn - 0.5))) * smoothstep(0.42, 0.6, zone2) * (1.0 - vRock.y) * (1.0 - smoothstep(140.0, 420.0, dist));
  col = mix(col, uChar * 1.5, rwDab(max(jl, vj * 0.8) * 0.92, h, 0.16) * 0.74);
  // the painted panel
  float hs2 = 5.5;
  vec2 c = wu / (0.3 * hs2), id = floor(c), f = fract(c) - 0.5;
  float hd = rwHash(id);
  float dotm = (1.0 - smoothstep(0.24, 0.33, length(f + (vec2(hd, fract(hd * 7.3)) - 0.5) * 0.25))) * step(0.42, hd);
  float red = dotm * smoothstep(0.66, 0.72, zone) * step(fract(hd * 9.1), 0.82);
  vec2 cs = vec2(1.05, 0.85) * hs2;
  vec2 c2 = (wu + vec2(0.0, 0.3)) / cs, id2 = floor(c2), f2 = (fract(c2) - 0.5) * cs;
  float hh = rwHash(id2 + 17.0), ha = (hh - 0.5) * 1.1;
  vec2 hp = vec2(f2.x * cos(ha) - f2.y * sin(ha), f2.x * sin(ha) + f2.y * cos(ha)) / (0.36 * hs2);
  hp.x *= fract(hh * 5.7) > 0.5 ? 1.0 : -1.0;
  float d = rwHand(hp);
  float hand = step(0.0, d) * (1.0 - smoothstep(0.02, 0.5 + 0.1 * sin(uTime * 1.7 + hh * 40.0), d)) * step(hh, 0.5) * smoothstep(0.54, 0.62, zone2);
  red = max(red, hand * (0.6 + 0.6 * gr.a));
  col = mix(col, uRed, rwDab(red * vRock.y * step(0.1, bj), h, 0.16) * 0.85);
  col = mix(rock * 0.94, col, mix(1.0, 0.66, smoothstep(0.0, uFade * 0.55, dist)));
  col *= 1.0 + rwRake(h, hs);
  col += rwSpark(gr, vW);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Pa=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 mv = viewMatrix * vec4(position + cameraPosition, 1.0);
  gl_Position = projectionMatrix * mv;
  if (abs(gl_Position.w) < 1e-4) gl_Position.w = 1e-4;
  gl_Position.z = gl_Position.w * 0.99999;
}`,Ca=`
${N0}
uniform vec4 uStencil;      // amount, sweep 0..1, hand fade, -
uniform vec3 uHandDir, uHaze, uIceDir;
uniform vec4 uSkyK;         // horizon wash, cloud amount, plume, moon
uniform vec4 uSkyG;         // golden wash, how charcoal the smudges are, how high the horizon wash reaches, -
uniform vec4 uStreak[6];    // azimuth, elevation, half length, half thickness (radians)
uniform vec4 uDisc;         // the painted sun: direction (xyz) and radius (radians)
uniform vec4 uDiscK;        // how much of it is drawn, moon (night: a scraped ring), halo, -
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir + vec3(0.0, 1e-5, 0.0));
  float up = max(d.y, 0.0);
  vec2 p = d.xz / (up * 0.9 + 0.3) * 26.0;
  vec4 gr = rwGrain2(p);
  float h = gr.r, hs = rwGrain2(p + uSun.xz * 0.06).r;
  vec2 cp = d.xz / (up + 0.16);
  float cl2 = texture2D(uGrain, vec2(cp.x * 0.5, cp.y * 0.11 - uTime * 0.007) + 0.5).b;
  vec2 dz = d.xz + vec2(0.0, step(dot(d.xz, d.xz), 1e-8) * 1e-3);
  float az = atan(dz.x, -dz.y), el = asin(clamp(d.y, -1.0, 1.0)), ce = cos(el);
  float strk = texture2D(uGrain, vec2(az * 0.31831, el * 7.0 + 0.2)).b;   // the grain drawn out along the stroke
  float pl = texture2D(uGrain, vec2(atan(d.x, -d.z + 1e-4) * 0.9 - uTime * 0.012, d.y * 3.0)).g;
  vec3 col = rwRock(h, gr.g);
  float sa = max(dot(d, uSun), 0.0);
  float s2 = sa * sa; s2 *= s2;
  col = mix(col, uPale * 0.82, s2 * s2 * 0.75);
  // golden hour: the whole vault is washed pale gold, palest on the sun's side
  vec2 dh = d.xz / max(length(d.xz), 1e-3), sh2 = uSun.xz / max(length(uSun.xz), 1e-3);
  float sunSide = dot(dh, sh2) * 0.5 + 0.5;
  col *= 1.0 + uSkyG.x * (0.2 * sunSide * sunSide - 0.03);
  float hz = 1.0 - smoothstep(0.0, uSkyG.z, d.y);
  col = mix(col, uOchre * (0.75 + 0.2 * h), rwDab(hz * uSkyK.x + (gr.g - 0.5) * 0.3, h, 0.22) * 0.5);
  // the painted sun: a great red-ochre disc standing on the horizon at the valley's end, drawn as the painters would:
  // rubbed on round and round with a dry pad so it breaks on the grain, a darker rim where the pad was pressed, a ring of
  // bare rock, then a band of yellow ochre blown round it. At night the same sign is a moon scraped out as a pale ring.
  vec3 sd = d - uDisc.xyz;
  float sr = length(sd) / max(uDisc.w, 1e-3) + (cl2 - 0.5) * 0.07 + (gr.b - 0.5) * 0.05;
  float sang = atan(sd.y, dot(sd, vec3(1.0, 0.0, 0.0)) + step(dot(sd, sd), 1e-10) * 1e-4);
  float rub = texture2D(uGrain, vec2(sang * 0.42 + sr * 0.35, sr * 1.7) + 0.27).b;      // the pad's strokes run round the disc
  float inD = 1.0 - smoothstep(0.97, 1.03, sr);
  float halo = smoothstep(1.2, 1.34, sr) * (1.0 - smoothstep(1.5, 1.86, sr));
  float halo2 = smoothstep(2.02, 2.1, sr) * (1.0 - smoothstep(2.14, 2.3, sr));
  float day = uDiscK.x * (1.0 - uDiscK.y), moon = uDiscK.x * uDiscK.y;
  col = mix(col, uOchre * (0.82 + 0.2 * h), rwDab((halo * (0.62 + 0.5 * rub) + halo2 * 0.5 * step(0.45, rub)) * uDiscK.z + (gr.g - 0.5) * 0.25 * halo, h, 0.2) * 0.8 * day);
  vec3 sunCol = mix(uRed * (1.0 + 0.3 * h), mix(uRed * 0.5, uChar * 1.3, 0.3), smoothstep(0.74, 0.95, sr + (rub - 0.5) * 0.2));
  sunCol = mix(sunCol, uRed * 0.62, smoothstep(0.55, 0.75, rub) * 0.5);
  col = mix(col, sunCol, rwDab(inD * (0.78 + 0.3 * rub + 0.2 * smoothstep(0.7, 1.0, sr)), h, 0.13) * 0.95 * day);
  float mring = (1.0 - smoothstep(0.035, 0.07, abs(sr - 0.95))) + 0.5 * inD * smoothstep(0.6, 0.72, rub);
  col = mix(col, uChar * 1.5, rwDab(mring * 0.9, h, 0.14) * 0.8 * moon);
  // the smudge clouds
  // each is a finger dragged level along the rock: laid on thick where it was pressed, running dry in streaks toward the tail
  float wobS = (cl2 - 0.5) * 0.55 + (gr.b - 0.5) * 0.35, smudge = 0.0;
  for (int i = 0; i < 6; i++) {
    vec4 st = uStreak[i];
    float da = mod(az - st.x - uTime * 0.0035 + 3.14159265, 6.2831853) - 3.14159265;
    float x = da * ce / max(st.z, 1e-3), tail = smoothstep(-0.85, 1.0, x);
    float y = (el - st.y + 0.045 * x * x - 0.012 * sin(x * 5.0 + st.x * 7.0)) / max(st.w * (1.0 - 0.45 * tail), 1e-3);
    float bx = 1.0 - smoothstep(0.84, 1.0, abs(x) + wobS * 0.12), by = 1.0 - smoothstep(0.45, 1.0, abs(y) + wobS * 0.6);
    float fing = 0.5 + 0.5 * cos(y * 6.5 + st.x * 3.0);
    smudge = max(smudge, bx * by * (1.0 - 0.62 * tail) * (0.6 + 0.75 * strk + 0.2 * fing));
  }
  smudge *= smoothstep(0.03, 0.11, d.y);
  col = mix(col, mix(uShade, uChar * 1.7, uSkyG.y), rwDab(smudge * 0.9 * uSkyK.y + (gr.b - 0.5) * 0.3, h, 0.22) * 0.66);
  // loess streaming off the ice
  float pd = max(dot(normalize(vec3(d.x, 0.0, d.z) + vec3(1e-5, 0.0, 0.0)), uIceDir), 0.0);
  float plume = pd * pd * pd * smoothstep(0.02, 0.07, d.y) * (1.0 - smoothstep(0.1, 0.34, d.y)) * uSkyK.z;
  col = mix(col, uOchre * 0.85, rwDab(plume * (0.5 + 0.8 * pl), h, 0.2) * 0.6);
  // the rare stencil: red ochre blown across the sky from the left, one vast hand left bare
  vec3 hr = normalize(cross(uHandDir, vec3(0.0, 1.0, 0.0)) + vec3(1e-5, 0.0, 0.0)), hu = cross(hr, uHandDir);
  vec2 q = vec2(dot(d, hr), dot(d, hu)) / 0.72;
  float front = step(0.0, dot(d, uHandDir));
  float hd = rwHand(q * vec2(-1.0, 1.0));
  float sweep = smoothstep(1.6 - uStencil.y * 4.4, 2.4 - uStencil.y * 4.4, -q.x);
  float spray = uStencil.x * sweep * (0.34 + 0.75 * exp(-max(hd, 0.0) * 1.6) * front) * smoothstep(-0.05, 0.12, d.y);
  spray *= mix(1.0, smoothstep(-0.02, 0.05, hd), front * uStencil.z) * mix(1.0, smoothstep(1.12, 1.4, sr), uDiscK.x);   // the sun keeps a ring of bare rock round it
  col = mix(col, uRed * 1.05, rwDab(spray + (gr.a - 0.5) * 0.5 * step(0.01, spray), h, 0.18) * 0.92);
  col *= 1.0 + rwRake(h, hs) * 0.8;
  // the sun: a bare bright patch; at night a pale scraped moon
  float disc = smoothstep(0.9972, 0.9988, sa + (gr.b - 0.5) * 0.0012);
  col = mix(col, mix(uPale * 1.9, uPale * 1.3, uSkyK.w), disc);
  col += uPale * 0.25 * s2 * s2 * s2 * (1.0 - uSkyK.w);
  col = mix(col, uHaze, (1.0 - smoothstep(-0.02, 0.1, d.y)) * 0.85);
  gl_FragColor = vec4(col, 1.0);
}`,Fo=`
uniform float uTime, uWrap, uBox, uEngr;
uniform vec3 uCtr;
uniform sampler2D uHt;
uniform vec4 uHtBox;        // x0, z0, columns, rows
attribute vec4 iP, iQ;      // (x or 0..1, y, z or 0..1, length)  (seed, kind, rot, lean)
varying vec4 vK;            // kind, seed, distance, height along the blade
varying vec2 vUV;
varying float vGust;
#include <fog_pars_vertex>
vec3 rwHt(vec2 xz){
  vec2 f = clamp(xz - uHtBox.xy, vec2(0.0), uHtBox.zw - 1.001);
  vec2 i = floor(f), w = f - i;
  ivec2 c = ivec2(i);
  vec3 a = texelFetch(uHt, c, 0).rgb, b = texelFetch(uHt, c + ivec2(1, 0), 0).rgb;
  vec3 e = texelFetch(uHt, c + ivec2(0, 1), 0).rgb, d = texelFetch(uHt, c + ivec2(1, 1), 0).rgb;
  return mix(mix(a, b, w.x), mix(e, d, w.x), w.y);
}
void main(){
  float b = position.z, t = position.y;
  float hb = fract(sin(iQ.x * 91.7 + b * 17.3) * 437.585), hb2 = fract(hb * 7.13 + 0.37);
  vec3 base = iP.xyz; float keep = 1.0, tall = 1.0;
  if (uWrap > 0.5) {
    vec2 rel = fract((iP.xz * uBox - uCtr.xz) / uBox) - 0.5;
    vec2 xz = uCtr.xz + rel * uBox;
    vec3 hm = rwHt(xz);
    keep = (1.0 - smoothstep(0.76, 0.98, max(abs(rel.x), abs(rel.y)) * 2.0)) * smoothstep(iQ.x * 0.86, iQ.x * 0.86 + 0.14, hm.y);
    base = vec3(xz.x, hm.x - 0.02, xz.y); tall = hm.z;
  }
  float rot = iQ.z + b * 1.257 + hb * 1.6;
  vec3 rd = vec3(cos(rot), 0.0, sin(rot));
  base += rd * ((0.04 + 0.15 * hb2) * step(0.5, b));
  float d0 = distance(base, cameraPosition);
  keep *= mix(1.0 - smoothstep(110.0, 175.0, d0), 1.0, uWrap);
  float len = iP.w * (0.6 + 0.62 * hb) * keep * tall;
  float gust = sin(dot(base.xz, vec2(0.05, 0.11)) - uTime * 1.7) * 0.5 + sin(dot(base.xz, vec2(-0.13, 0.04)) - uTime * 2.6) * 0.25;
  float flut = sin(uTime * (4.5 + 3.0 * hb) + iQ.x * 40.0 + b * 2.1) * 0.07;
  vec3 lean = vec3(0.25, 0.0, 0.95) * (0.36 + 0.62 * gust + flut) + rd * (iQ.w + 0.3 * hb2);
  vec3 dir = normalize(vec3(0.0, 1.0, 0.0) + lean * 0.55);
  vec3 p = base + dir * (t * len) + lean * (t * t * 0.6 * len) - vec3(0.0, t * t * 0.16 * len * dot(lean, lean), 0.0);
  vec3 vd = p - cameraPosition; float dist = max(length(vd), 0.01);
  vec3 side = normalize(cross(dir, vd / dist) + vec3(1e-5, 0.0, 0.0));
  float wd = max(0.015 + 0.027 * iP.w, dist * 0.0012) * mix(1.0, 0.74, step(0.25, t)) * mix(1.0, 0.58, uEngr * (1.0 - smoothstep(18.0, 30.0, dist)));   // engraved: a scratch, not a brush stroke
  p += side * (position.x * wd);
  float kind = iQ.y;
  if (hb2 > 0.74) kind = kind < 0.5 ? 1.0 : (kind < 1.5 ? 0.0 : kind);   // a dark blade in an ochre clump, an ochre one in a dark clump
  vK = vec4(kind, iQ.x + b * 0.173, dist, t); vUV = vec2(position.x, t * len); vGust = gust;
  vec4 mvPosition = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  if (keep < 0.03) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  #include <fog_vertex>
}`,To=`
${N0}
varying vec4 vK;
varying vec2 vUV;
varying float vGust;
#include <fog_pars_fragment>
void main(){
  // the grain stretched along the stroke: the brush runs dry in streaks and toward the point
  vec4 g = texture2D(uGrain, vec2(vUV.x * 0.03 + vK.y * 0.37, vUV.y * 0.8 + vK.y * 3.1));
  float t = vK.w;
  if (rwDab(0.98 - 0.52 * t, g.r * 0.55 + g.b * 0.45, 0.1) < 0.5) discard;
  vec3 ink = uChar * mix(1.35, 0.46, uEngr);
  vec3 col = vK.x < 0.5 ? ink : (vK.x < 1.5 ? uOchre * (0.6 + 0.34 * g.r) : (vK.x < 2.5 ? uRed * 0.92 : mix(mix(uOchre, uPale, 0.34) * 0.78, ink * 0.9, uEngr)));
  // every blade stands in its own shade at the foot and catches the light at the tip; the gust bands show as a sheen
  col = mix(mix(uShade, ink, 0.45), col, smoothstep(0.0, 0.34, t)) * (0.9 + 0.26 * t + 0.16 * vGust);
  col = mix(rwRock(0.6, 0.5), col, mix(0.95, 0.45, smoothstep(0.0, uFade, vK.z)));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Fa=`
uniform float uTime;
attribute vec4 iP, iQ;      // (x, y, z, height)  (kind, seed, rot, half width / height)
varying vec2 vUV;
varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  float rot = iQ.z + position.z * 1.5708, hgt = iP.w;
  vec3 ax = vec3(cos(rot), 0.0, sin(rot));
  float y = position.y, sway = sin(uTime * (2.2 + iQ.y * 2.0) + iQ.y * 40.0) * 0.035 + sin(uTime * 7.0 + iQ.y * 90.0) * 0.012;
  vec3 p = iP.xyz + ax * (position.x * iQ.w * hgt) + vec3(0.0, y * hgt, 0.0) + vec3(0.3, 0.0, 0.95) * (sway * y * y * hgt * (iQ.x > 2.5 ? 0.35 : 1.0));
  vUV = vec2(position.x * iQ.w, y); vK = vec3(iQ.x, iQ.y, distance(p, cameraPosition));
  vec4 mvPosition = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ta=`
${N0}
varying vec2 vUV;
varying vec3 vK;
#include <fog_pars_fragment>
void main(){
  float fw = max(fwidth(vUV.y), 1e-4);
  vec4 g = texture2D(uGrain, vUV * (vK.x > 2.5 ? 1.3 : 0.4) + vK.y * 3.0);
  float kind = vK.x, sd = vK.y, y = vUV.y;
  float x = vUV.x + (sd - 0.5) * 0.3 * y * y, ax = abs(x);
  vec2 q = vec2(ax, y);
  float d, rib = 1.0;
  if (kind < 1.5) {          // branch sign
    d = rwSeg(vec2(x, y), vec2(0.0), vec2(0.0, 0.92), 0.0);
    d = min(d, rwSeg(q, vec2(0.0, 0.2), vec2(0.42, 0.62), 0.0));
    d = min(d, rwSeg(q, vec2(0.0, 0.45), vec2(0.3, 0.84), 0.0));
    d = min(d, rwSeg(q, vec2(0.0, 0.68), vec2(0.16, 0.97), 0.0));
    d = min(d, rwSeg(q, vec2(0.24, 0.44), vec2(0.46, 0.5), 0.0));
  } else if (kind < 2.5) {   // tuft sign
    d = rwSeg(q, vec2(0.0), vec2(0.03, 0.95), 0.0);
    d = min(d, rwSeg(q, vec2(0.0), vec2(0.3, 0.86), 0.0));
    d = min(d, rwSeg(q, vec2(0.0), vec2(0.52, 0.62), 0.0));
    d = min(d, rwSeg(q, vec2(0.0), vec2(0.6, 0.3), 0.0));
  } else {                   // fishbone pine
    d = rwSeg(vec2(x, y), vec2(0.0), vec2(0.0, 0.98), 0.0) - 0.006;
    float ry = fract(y * 9.0) - 0.62 + ax * 2.6;
    float ext = 0.05 + 0.27 * (1.0 - y) * smoothstep(0.2, 0.34, y);
    rib = max(abs(ry) / 9.0 * 0.36, ax - ext);
  }
  float lw = max(kind > 2.5 ? 0.011 : (kind > 1.5 ? 0.024 : 0.042), 1.3 * fw);
  float a = 1.0 - smoothstep(lw - fw * 0.6, lw + fw * 0.6, d);
  float lr = min(lw, 0.019);
  a = max(a, 1.0 - smoothstep(lr - min(fw, 0.012) * 0.6, lr + min(fw, 0.012) * 0.6, rib));
  if (rwDab(a * (0.95 - (kind > 2.5 ? 0.0 : (kind > 1.5 ? 0.5 : 0.34)) * smoothstep(20.0, 85.0, vK.z)), g.r, 0.1) < 0.5) discard;
  vec3 col = kind < 0.5 ? uRed : (kind < 1.5 ? uOchre * 0.88 : uChar * mix(1.25, 0.42, uEngr));
  col = mix(rwRock(0.6, 0.5), col, mix(0.95, 0.5, smoothstep(0.0, uFade, vK.z)));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Ga=`
uniform float uTime, uPx, uAir;
uniform vec4 uEmit[8];
attribute vec4 iP, iQ;      // (0..1 cube position)  (kind, seed, size, -)
varying vec2 vQ;
varying vec4 vK;
#include <fog_pars_vertex>
void main(){
  float kind = iQ.x, sd = iQ.y, vis = 1.0;
  vec3 c = cameraPosition, p;
  if (kind < 0.5) {
    vec3 box = vec3(110.0, 26.0, 110.0);
    vec3 q = iP.xyz * box + vec3(sin(uTime * 0.3 + sd * 30.0) * 1.5, sin(uTime * 0.23 + sd * 50.0) * 1.2 + uTime * 0.12, uTime * 1.1);
    p = c + (fract((q - c) / box) - 0.5) * box;
    vis = step(p.z, -104.0);
  } else if (kind < 1.5) {
    vec3 box = vec3(26.0, 8.0, 44.0);
    vec3 q = iP.xyz * box + vec3(sin(uTime * 0.21 + sd * 30.0), sin(uTime * 0.17 + sd * 50.0) * 0.6 - uTime * 0.03, cos(uTime * 0.19 + sd * 20.0)) * 0.7;
    p = c + (fract((q - c) / box) - 0.5) * box;
    vis = step(-99.0, p.z);
  } else if (kind < 2.5) {
    vec4 e = uEmit[int(min(floor(iP.x * 8.0), 7.0))];
    float t = fract(uTime * 1.5 + sd * 3.0), a = iP.y * 6.2832;
    vec3 v = vec3(cos(a) * 2.0 * iP.z, 2.6 + 3.6 * iP.z, sin(a) * 2.0 * iP.z);
    p = e.xyz + v * t * 0.6 + vec3(0.0, -4.9 * t * t * 0.36 + 0.05, 0.0);
    vis = e.w * (1.0 - t * 0.6);
  } else {
    vec3 box = vec3(70.0, 34.0, 70.0);
    vec3 q = iP.xyz * box + vec3(uTime * 0.6 + sin(uTime * 0.7 + sd * 30.0) * 0.6, -uTime * uAir, uTime * 2.2);
    p = c + (fract((q - c) / box) - 0.5) * box;
    vis = step(p.z, -100.0);
  }
  vec4 mvPosition = viewMatrix * vec4(p, 1.0);
  float dist = max(-mvPosition.z, 0.05);
  float sz = clamp(max(iQ.z, dist * uPx * 1.1), 0.0, dist * uPx * 10.0);
  mvPosition.xy += position.xy * sz;
  vQ = position.xy; vK = vec4(kind, sd, vis, dist); 
  gl_Position = projectionMatrix * mvPosition;
  if (vis < 0.05 || dist < 0.7) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  #include <fog_vertex>
}`,Wa=`
${N0}
uniform vec3 uAirCol, uSplash;
varying vec2 vQ;
varying vec4 vK;
#include <fog_pars_fragment>
void main(){
  float n = texture2D(uGrain, vQ * 0.13 + vK.y * vec2(3.7, 5.1)).b;
  float r = length(vQ) + (n - 0.5) * 0.5;
  if (r > 0.85 * mix(0.6, 1.0, vK.z)) discard;
  vec3 col;
  if (vK.x < 0.5) col = uRed * 0.95;
  else if (vK.x < 1.5) col = uTorchCol * uPale * (0.05 + 1.0 * uTorch.w * exp(-vK.w * vK.w / 70.0)) + uPale * 0.25 * exp(-distance(cameraPosition, uMouth.xyz) / 40.0);
  else if (vK.x < 2.5) col = mix(uSplash, uSplash * 0.35, step(0.7, fract(vK.y * 7.3)) * step(uSplash.b * 2.5, uSplash.r));   // red turf has dark clods among it
  else col = uAirCol;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,_a=`
uniform float uTime;
attribute vec4 iP, iQ;      // (x, y, z, scale)  (heading, phase, kind, flap)
varying vec3 vK, vB;
#include <fog_pars_vertex>
void main(){
  float a = sin(uTime * iQ.w + iQ.y) * (iQ.z > 0.5 ? 0.5 : 0.8) + (iQ.z > 0.5 ? 0.2 : 0.12);
  float span = abs(position.x), sgn = sign(position.x);
  vec3 F = vec3(sin(iQ.x), 0.0, cos(iQ.x)), R = vec3(F.z, 0.0, -F.x);
  vec3 lp = R * (sgn * span * cos(a * min(span * 1.6, 1.0))) + vec3(0.0, span * sin(a) + position.y, 0.0) + F * position.z;
  vec3 p = iP.xyz + lp * iP.w;
  vK = vec3(iQ.z, span, position.z); vB = position;
  vec4 mvPosition = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  if (iP.w < 0.01) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  #include <fog_vertex>
}`,Va=`
${N0}
varying vec3 vK, vB;
#include <fog_pars_fragment>
void main(){
  vec4 g = texture2D(uGrain, vB.xz * 0.55 + vB.y * 0.3);
  vec3 col = uChar * 1.15;
  if (vK.x > 0.5) {   // the eagle owl: mottled ochre, soft charcoal bars across the broad wings, a pale face with two dark eyes, ear tufts
    float wing = smoothstep(0.2, 0.3, vK.y);
    float bar = smoothstep(0.42, 0.62, abs(fract(vK.y * 3.2 + g.b * 0.35 + vB.z * 0.6) - 0.5) * 2.0);
    col = mix(uOchre * (0.55 + 0.4 * g.r), uShade, (0.25 + 0.5 * bar * wing) * (0.6 + 0.5 * g.g));
    col = mix(col, uChar * 1.4, smoothstep(0.82, 0.98, vK.y) * 0.8 + smoothstep(-0.22, -0.36, vB.z) * wing * 0.5);
    float face = (1.0 - wing) * smoothstep(0.3, 0.38, vB.z);
    col = mix(col, uRock * 0.9, face * 0.8);
    vec2 e = vec2(abs(vB.x) - 0.065, vB.y - 0.075);
    col = mix(col, uChar, face * (1.0 - smoothstep(0.03, 0.045, length(e))));
    col = mix(col, uChar * 1.2, smoothstep(0.2, 0.24, vB.y) * (1.0 - wing));
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Ba=`
${He}
uniform vec4 uEmit[8];
uniform vec2 uFwd;
uniform vec4 uGate;          // the portal (x, z) and the heading through it (x, z)
uniform vec3 uGateCol;
// one long brush stroke per cell, laid along x (the current), thinning toward its ends
float rwFlow(vec2 p, vec2 cell, float keep, float wy, out float kind){
  float row = floor(p.y / cell.y);
  float x = p.x / cell.x + rwHash(vec2(row, 5.0)) * 7.0;
  float id = floor(x), fx = (fract(x) - 0.5) * cell.x, fy = (fract(p.y / cell.y) - 0.5) * cell.y;
  float hd = rwHash(vec2(id, row * 1.7 + 3.0));
  kind = fract(hd * 3.3);
  float len = cell.x * (0.17 + 0.25 * fract(hd * 5.3));
  float yy = fy - (fract(hd * 13.7) - 0.5) * cell.y * 0.5 - 0.05 * sin(fx * 1.9 + hd * 6.0);
  float d = length(vec2(max(abs(fx) - len, 0.0), yy));
  float w = wy * (1.0 - 0.55 * smoothstep(len * 0.4, len, abs(fx)));
  return (1.0 - smoothstep(w, w * 2.2, d)) * step(keep, hd);
}
void main(){
  vec4 gr = rwGrain2(vW.xz);
  float h = gr.r, s = vRock.x, q = vRock.y, aq = abs(q), ym = q * 13.5;
  float sp = uTime * 3.2 * (1.0 - 0.45 * q * q);
  float fwy = max(fwidth(ym), 1e-4);
  vec4 fg2 = texture2D(uGrain, vec2((s + sp * 1.4) * 0.11, q * 1.3) + 0.4);
  vec2 bp = vW.xz + (fg2.rg - 0.5) * 0.14;
  vec4 bedN = texture2D(uGrain, bp * 0.023);
  vec4 bedM = texture2D(uGrain, bp * 0.0063 + 0.37);
  vec2 gp = vW.xz - uGate.xy;
  float ga = -dot(gp, uGate.zw), gxs = gp.x * uGate.w - gp.y * uGate.z, gx = abs(gxs);
  float rip = texture2D(uGrain, vec2(gx * 0.05, (ga + uTime * 1.6) * 0.21) + 0.33).b;
  float gcell = (ga - uTime * 0.7) / 1.5, fwg = max(fwidth(gcell), 1e-4);
  float dist = distance(vW, cameraPosition);
  float near1 = 1.0 - smoothstep(34.0, 90.0, dist), mid1 = 1.0 - smoothstep(70.0, 190.0, dist);
  float k1, k2, k3, k4, k6, k7;
  float cb = rwDash(bp + 5.7, 1.05, 0.03, 0.17, 0.3, 0.0, k1), ct = rwDash(bp + 5.7 + uSun.xz * 0.07, 1.05, 0.03, 0.13, 0.3, 0.0, k2);
  float cb2 = rwDash(bp * 0.42 + 2.3, 1.05, 0.03, 0.2, 0.52, 0.0, k4), ct2 = rwDash(bp * 0.42 + 2.3 + uSun.xz * 0.035, 1.05, 0.03, 0.155, 0.52, 0.0, k4);
  float pb = rwDash(bp + 3.1, 0.46, 0.05, 0.085, 0.3, 0.0, k3);
  float f1 = rwFlow(vec2(s + sp, ym), vec2(7.0, 0.56), 0.46, max(0.022, fwy * 0.8), k6) * (1.0 - smoothstep(45.0, 110.0, dist));
  float f2 = rwFlow(vec2(s + sp * 1.2 + 31.0, ym + 3.7), vec2(17.0, 1.5), 0.4, max(0.04, fwy * 0.8), k7) * (1.0 - smoothstep(170.0, 420.0, dist));
  float depth = 1.0 - smoothstep(0.3, 1.0, aq);
  vec3 rock = rwRock(h, gr.g), ink = mix(uChar * 1.6, uShade * 1.3, uEngr);
  // the bed
  vec3 bed = mix(rock * 0.95, uShade, 0.2);
  bed = mix(bed, uOchre * 0.62, 0.18 + 0.4 * smoothstep(0.4, 0.75, bedN.g));
  bed = mix(bed, uShade, rwDab((bedM.b - 0.42) * 1.7, h, 0.25) * 0.34);
  bed = mix(bed, ink, rwDab(max(max(cb * 0.9, cb2 * 0.9 * mid1), pb * 0.6 * step(k3, 0.45)) * max(near1, cb2 * mid1), h, 0.14) * 0.72);
  bed = mix(bed, rock * 1.06, max(ct * near1, ct2 * mid1) * 0.88);
  vec3 col = mix(bed, mix(bed, uShade, 0.55), depth * (0.22 + 0.2 * bedM.g));
  col = mix(col, uShade, smoothstep(0.55, 1.0, aq) * 0.3);
  // mirrored: a dark wash under the rock of the arch, and the light of the gate as short ochre dabs laid across the stream
  float archR = (1.0 - smoothstep(4.0, 30.0 + 10.0 * rip, ga)) * smoothstep(-6.0, 2.0, ga) * (1.0 - smoothstep(26.0, 34.0, gx)) * smoothstep(7.5, 10.0, gx + 3.0 * (rip - 0.5));
  col = mix(col, mix(uShade, uOchre * 0.5, 0.35) * 0.9, archR * 0.5);
  float gid = floor(gcell), gf = abs(fract(gcell) - 0.5), gh = rwHash(vec2(gid, 3.7));
  float hw = (0.3 + 0.7 * gh) * clamp(dist * 0.1, 0.22, 2.0);
  float gdx = abs(gxs - (fract(gh * 7.1) - 0.5) * hw * 0.9);
  float thick = max(0.13, fwg * 0.9);
  float dab = (1.0 - smoothstep(hw * 0.6, hw, gdx)) * (1.0 - smoothstep(thick, thick * 1.6, gf)) * step(0.22, gh);
  float gfar = smoothstep(0.3, 0.7, fwg);                       // far down the stream the dabs close up into one thin broken line
  dab = mix(dab, (1.0 - smoothstep(0.5, 1.1, gx)) * smoothstep(0.35, 0.6, rip), gfar);
  dab *= smoothstep(0.0, 5.0, ga) * (1.0 - smoothstep(70.0, 150.0, ga));
  col = mix(col, uGateCol * mix(1.0, 0.5, uEngr), rwDab(dab * 0.95, h, 0.2) * 0.85);
  // flow lines: charcoal, a few pale
  float fl = max(f1, f2), fk = f1 > f2 ? k6 : k7;
  col = mix(col, mix(uChar * 1.6, uPale * 0.9, step(0.8, fk)), rwDab(fl * 0.92, h, 0.16) * mix(0.7, 0.45, uEngr));
  // splash dashes round the feet, two wake chevrons behind
  float wake = 0.0, tk = floor(uTime * 6.0);
  for (int i = 0; i < 8; i++) {
    vec2 rel = vW.xz - uEmit[i].xz;
    float a = dot(rel, uFwd), ab = abs(rel.x * uFwd.y - rel.y * uFwd.x), r = length(rel);
    float own = i == 0 ? 0.36 : 1.0;                             // our own wake is short: it must not ring the mount
    float v1 = abs(ab + a * 0.6), v2 = abs(ab + (a + 2.4 * own) * 0.6);
    float w = (1.0 - smoothstep(0.035, 0.09, v1)) * smoothstep(-3.3 * own, -2.5 * own, a) * (1.0 - step(-0.3, a));
    w += (1.0 - smoothstep(0.03, 0.08, v2)) * smoothstep(-5.4 * own, -4.4 * own, a) * (1.0 - step(-2.4 * own - 0.35, a));
    float sc = atan(rel.y, rel.x + step(r, 1e-4) * 1e-3) * 1.5915 + float(i) * 0.37 + tk * 0.21;
    float sd = rwHash(vec2(floor(sc), float(i) * 3.0 + tk));
    float dsh = (1.0 - smoothstep(0.1, 0.2, abs(fract(sc) - 0.5))) * step(0.35, sd) * smoothstep(0.28, 0.4, r) * (1.0 - smoothstep(0.5 + 0.45 * sd, 0.6 + 0.5 * sd, r));
    wake = max(wake, max(clamp(w, 0.0, 1.0), dsh) * uEmit[i].w);
  }
  col = mix(col, uPale * 0.98, rwDab(wake * 0.95, h, 0.15) * 0.92);
  float tw = smoothstep(0.955, 1.0, fg2.a) * smoothstep(0.5, 0.8, bedN.b) * depth;
  col += uPale * tw * 1.5;
  col *= 1.0 + rwRake(h, rwGrain2(vW.xz + uSun.xz * 0.022).r) * 0.5;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Ka=`
uniform float uTime, uFlame;
attribute vec4 aRock;
varying vec3 vW, vL, vN;
varying vec4 vRock;
varying vec2 vQ;
#include <fog_pars_vertex>
void main(){
  vec3 lp = position; vQ = uv; vRock = aRock;
  if (aRock.z > 2.5) {       // smoke: dabs that rise and stream back over the left shoulder
    float age = fract(uTime * 0.55 + aRock.w);
    lp += vec3(sin(aRock.w * 40.0 + age * 5.0) * 0.12 * age - 0.25 * age, 0.25 + 1.5 * age, 2.6 * age * age + 0.3 * age);
    lp.xy += (uv - 0.5) * (0.12 + 0.5 * age) * uFlame;
    vRock.w = age;
  } else if (aRock.z > 1.5) { lp.xy += (uv - vec2(0.5, 0.0)) * vec2(0.26, 0.5) * uFlame; }
  vL = position;
  vec4 wp = modelMatrix * vec4(lp, 1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal + vec3(0.0, 1e-5, 0.0));
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ha=`
${N0}
uniform float uCaveK, uFlame;
uniform vec3 uInk;
varying vec3 vW, vL, vN;
varying vec4 vRock;
varying vec2 vQ;
#include <fog_pars_fragment>
void main(){
  vec4 gr = rwGrain2(vL.xz * 1.3 + vL.y * 0.7);
  float n1 = texture2D(uGrain, vec2(vQ.x * 0.22 + 0.3, vQ.y * 0.17 - uTime * 0.5)).b;
  float n2 = texture2D(uGrain, vec2(vQ.x * 0.45, vQ.y * 0.38 - uTime * 1.05)).r;
  vec4 sm = texture2D(uGrain, (vQ - 0.5) * 0.12 + vRock.w * vec2(3.1, 7.7));
  float h = gr.r, kind = vRock.z;
  vec3 col;
  if (kind > 2.5) {
    vec2 q = (vQ - 0.5) * 2.0;
    float v = (1.0 - length(q)) * (1.0 - vRock.w) * smoothstep(0.0, 0.08, vRock.w);
    if (sm.a * 0.55 + sm.b * 0.45 < 0.95 - 0.8 * v) discard;
    col = uInk * (1.8 + 1.4 * sm.r);
    col = rwCave(col, vW, uCaveK * 0.7);
  } else if (kind > 1.5) {
    float wv = 1.0 - vQ.y;
    float shape = wv * (1.0 - smoothstep(0.0, 0.42 * wv + 0.07, abs(vQ.x - 0.5 + (n1 - 0.5) * 0.5 * vQ.y)));
    float v = shape * 1.5 + (n2 - 0.5) * 0.65;
    if (v < 0.4) discard;
    col = mix(vec3(1.05, 0.15, 0.05), vec3(3.0, 1.45, 0.22), smoothstep(0.4, 0.85, v));
    col = mix(col, vec3(4.0, 2.9, 1.2), smoothstep(0.95, 1.35, v)) * max(uTorch.w, 0.6);
  } else {
    vec3 n = normalize(vN + vec3(0.0, 1e-4, 0.0));
    col = rwRock(h, gr.g);
    col = mix(col, uOchre * (0.6 + 0.3 * h), rwDab(vRock.y, h, 0.14) * 0.9);
    col = mix(col, uInk * (1.0 + 0.5 * smoothstep(0.2, 0.9, n.y)), rwDab(vRock.x, h, 0.12) * 0.96);
    float rim = 1.0 - abs(dot(n, normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0))));
    col = mix(col, uChar, smoothstep(0.84, 0.96, rim + (gr.b - 0.5) * 0.12) * uEngr * 0.85);
    col = rwCave(col, vW, uCaveK);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Ea=()=>i.UniformsUtils.clone(i.UniformsLib.fog),Na=()=>new i.PlaneGeometry(2,2);function re(d,H,R,T){const W=new i.InstancedBufferGeometry;W.index=d.index;for(const S in d.attributes)W.setAttribute(S,d.attributes[S]);for(const S in R){const C=new i.InstancedBufferAttribute(R[S],4);T&&C.setUsage(i.DynamicDrawUsage),W.setAttribute(S,C)}return W.instanceCount=H,W.boundingSphere=new i.Sphere(new i.Vector3,1e5),W}const Go=d=>H=>{const R=d[0][0]<d[d.length-1][0];for(let T=0;T<d.length-1;T++){const W=d[T],S=d[T+1];if(R?H<=S[0]:H>=S[0])return x(W[1],S[1],a(W[0],S[0],H))}return d[d.length-1][1]};var qa={id:"running-wall",name:"The Running Wall",category:"prehistoric",weirdness:.45,media:["air"],async build(d){const{rng:H,noise:R}=d,T=vt(pt("running-wall-more:"+d.seed)),W=vt(pt("running-wall-third:"+d.seed)),S=d.quality?.detail??1,C=d.vary||{},L=new i.Scene,ke=H.fork("look"),wt=ke(),Ee=ke(),xt=ke(),Wo=ke(),J=C.hour==="night"?"night":C.hour==="golden"||C.hour==="dawn"?"golden":C.hour==="day"||wt<.45?"morning":wt<.8?"golden":"night",p0=Ee<.25?"snow":Ee<.5?"clear":Ee<.75?J==="night"?"snow":"loess":"clear",_o=xt<.6?0:xt<.8?1:2,Vo=Wo<.4,ne=I(((C.density??1)-.7)/.6,0,1),bt=Math.round(x(30,48,ne)),Bo=Math.round(x(20,40,ne)),Ko=!!C.rare,Ho=(J==="golden"?new i.Vector3(-.62,.3,.72):J==="night"?new i.Vector3(-.8,.5,.33):new i.Vector3(-.646,.616,.45)).normalize(),j=new i.Vector3(.3827,0,-.9239),f0=new i.Vector3(.9239,0,.3827),E=new i.Vector3(50,-23.5,-735),Ne=H.range(7,9),h0=ga([[0,Q0,0],[0,Q0,-44],[0,Q0,-84],[0,Q0-.1,-96],[0,6.9,-107],[0,3.6,-122],[0,-.4,-138],[0,-3.6,-153],[0,-5.3,-167],[0,-5.7,-182],[0,-5.7,-230],[.5,-5.7,-290],[-Ne*.5,-5.7,-322],[-Ne,-5.7,-350],[-Ne*.72,-5.7,-380],[0,-5.7,-420],[2,-5.7,-455],[2.5,-5.9,-482],[3.5,-10.5,-520],[5,-16.5,-565],[7.5,-21.8,-605],[11,-23.4,-632],[20.2,-23.5,-662.9],[34.7,-23.5,-698],[E.x,E.y,E.z]],{samples:480}),q=h0.length,yt=96.2/q,X=yt*q,Qe=6,ie=9.5,Ie=40,I0=33,kt=6.8,S0=740,Me=new Float32Array(S0+1),ze=new Float32Array(S0+1),Se=new Float32Array(S0+1);await d.yield();{const e=new i.Vector3;let t=0,r=0,o=Q0,s=0,l=0;for(let u=0;u<=3e3;u++){const v=u/3e3*q;for(h0.posAtDist(v,e);l<=S0&&-e.z>=l;){const c=t===-e.z?0:(l-t)/(-e.z-t);Me[l]=x(r,e.x,c),ze[l]=x(o,e.y,c),Se[l]=x(s,v,c),l++}t=-e.z,r=e.x,o=e.y,s=v}for(;l<=S0;l++)Me[l]=E.x+(-l-E.z)*(j.x/j.z),ze[l]=E.y,Se[l]=q+(l+E.z)/-j.z}const g0=e=>{if(e>=0)return 0;if(e<=-S0)return E.x+(e-E.z)*(j.x/j.z);const t=-e,r=Math.floor(t);return x(Me[r],Me[r+1],t-r)},De=e=>{if(e>=0)return Q0;if(e<=-S0)return E.y;const t=-e,r=Math.floor(t);return x(ze[r],ze[r+1],t-r)},Eo=e=>{if(e>=0)return-e;if(e<=-S0)return q+(-e-735)/.9239;const t=-e,r=Math.floor(t);return x(Se[r],Se[r+1],t-r)};await d.yield();const Y=new i.Vector3;let O0=1,q0=0;{const e=h0.posAtDist(.472*q,new i.Vector3),t=h0.tangentAtDist(.472*q,new i.Vector3),r=Math.hypot(t.x,t.z)||1;Y.set(e.x-t.z/r*8,0,e.z+t.x/r*8);const o=h0.posAtDist(.46*q,new i.Vector3),s=Y.x-o.x,l=Y.z-o.z,u=Math.hypot(s,l)||1;O0=-l/u,q0=s/u}const No=Go([[300,-178],[-380,-178],[-480,-150],[-560,-95],[-620,-42],[-664,2]]),D0=e=>x(No(e),g0(e),a(-640,-692,e)),B0=(e,t)=>{const r=(D0(t-3)-D0(t+3))/6;return Math.abs(e-D0(t))/Math.sqrt(1+r*r)},K0=Go([[100,30],[-290,30],[-390,18.5],[-520,19],[-600,62],[-700,120],[-900,200]]),R0=e=>{const t=I((-560-e)/70,0,1),r=I((e+704)/74,0,1);return e>-630?.55*t+.45*t*t*(3-2*t):Math.pow(r,1.25)},Mt=e=>a(.5,.8,R.n2(e*.085,12.3)),ce=e=>-255+34*R.n2(e*.006,1.7)+12*R.n2(e*.03,5.1)-a(-640,-900,e)*120+154*R0(e)+7*R.n2(e*.06,4.4)*a(0,.3,R0(e))*(1-a(.8,1,R0(e))),zt=e=>{const t=(70-e)/5,r=Math.floor(t);return x(ce(70-5*r),ce(65-5*r),t-r)},St=e=>.012*(e+400)+1.6*R.n2(e*.009,8.8),U0=[20,46],Dt=e=>a(-570,-578,e)*(1-a(-605,-611,e)),Qo=36,Oe=e=>a(-282,-332,e),Re=e=>a(-268,-296,e)*(1-a(-444,-458,e)),L0=e=>{const t=Math.max(0,-438-e);return 34+54*a(-100,-195,e)+5*R.n2(e*.008,9.1)*a(-150,-230,e)*(1-.75*Oe(e))-Qo*Oe(e)+1.5*t*t/(t+30)},Ae=(e,t)=>a(.5,.78,R.n2(e*.021+t*3.7,3.1+t)),Rt=e=>a(-152,-172,e)*(1-a(-448,-462,e)),At=e=>x(13,4,Re(e)),Pt=e=>x(38,50,Re(e)),Ct=e=>Math.max(x(40,57,a(-110,-200,e))+8*R.fbm2(e*.011,2.2,3)+7*(1-Math.abs(R.n2(e*.026,6.6)))**2-3+8*W0(e,-470,-425,.4)-11*Ae(e,0)*(1-W0(e,-480,-420,.3))+36*a(-262,-318,e)*(1-a(-452,-515,e)),(Pt(e)+3.5)*Rt(e)),Ft=e=>{const t=R0(e),r=104+30*R.n2(e*.004,.4)+16*R.fbm2(e*.012,5.5,3)+12*(1-Math.abs(R.n2(e*.019,1.6)))**2-5-20*Ae(e,1),o=x(67+11*R.fbm2(e*.05,5.5,3)+8*(1-Math.abs(R.n2(e*.04,1.6)))**2-6*Mt(e),-6,W0(e,-662,-609,.45));return Math.max(x(r,o,a(0,.45,t)),(U0[1]+9)*Dt(e))},w0={x:900,z:-1450,nx:-.587,nz:.809,half:800,h:215},qe=(e,t)=>{const r=e-w0.x,o=t-w0.z,s=r*w0.nz-o*w0.nx,l=-(r*w0.nx+o*w0.nz);return a(-10,55,l+30*R.n2(s*.004,3.3))*(1-a(w0.half-160,w0.half+60,Math.abs(s)))},Tt=(e,t)=>(30+9*e+a(60,220,t)*30)*a(26,44,t),Gt=e=>x(-2.6,-15,a(30,54,e))-8*a(90,170,e),Io=(e,t)=>{const r=g0(t),o=e-r,s=Math.abs(o),l=De(t<-470?Math.min(t+Math.max(0,o-12)*1.3,-470):t)-se,u=R.fbm2(e*.012,t*.012,3)*2.4*a(8,70,s)+R.n2(e*.07,t*.07)*.22*a(3,12,s),v=K0(t)+2.2*R.n2(t*.03,3.3)+.7*R.n2(t*.11,8.3);let c=l+u+3*a(v,v+4.5,e)+Math.max(0,e-v-4.5)*.045;const h=ce(t),z=L0(t),p=R.fbm2(e*.02,t*.02,3),f=Oe(t)*(1-a(-440,-470,t)),w=R0(t),n=a(h+x(115,42,w),h,e),k=a(z-x(44,24,f),z+2,e);c+=n*n*x(24,15,w)+k*k*x(9,5,f),e<h-5?c=x(c,Ft(t)-16,a(h-5,h-34,e)):e>z+5&&(c=x(c,Ct(t)-15,a(z+5,z+32,e)));const A=B0(e,t);c=x(Po+.5*R.n2(e*.05,t*.05)*a(13,20,A),c,a(20,58,A));const g=(e-E.x)*j.x+(t-E.z)*j.z,y=(e-E.x)*f0.x+(t-E.z)*f0.z,b=Math.abs(y),D=40+a(60,200,b)*60,_=a(250,330,b),F=Gt(b),G=Math.max(4-(F+15),.5),P=Math.max(4-(F+10.5),G+2),V=Tt(p,b)*(1-(g<4?a(x(G,9,_),x(P,D,_),4-g):a(9,D,g-4))),K=V<4.5?V:4.5+(Math.floor((V-4.5)/5.6)+a(.5,.92,(V-4.5)/5.6-Math.floor((V-4.5)/5.6))+.1*((V-4.5)/5.6%1))*5.6;c=Math.max(c,Po+K+.5*R.n2(e*.11,t*.11)*a(2,8,V));const B=a(-1180,-1420,t+e*.25)*(1-a(250,520,e-(t+1200)*-.3))*x(.16,1,a(170,340,Math.abs(e+10)));c+=B*Math.max(0,170+60*R.n2(e*.003,t*.003)+20*p-c),c+=a(600,1500,e)*40;const Z=qe(e,t);return c+=Z*Math.max(0,w0.h+26*R.n2(e*.006,t*.006)-c),c=x(De(t)-se,c,a(3,14,s))-.5*a(-97,-95.5,t),c-=.62*(1-a(6.5,12.5,A)),c},Ue=(e,t,r,o)=>{const s=a(-150,-180,t)*(1-.72*a(-476,-520,t+Math.max(0,e-g0(t)-12)*1.3));return I(s*a(20,44,o)*(1-a(60,140,r+8)),0,1)*(.55+.45*a(-.5,.3,R.n2(e*.02,t*.02)))*a(5.2,8.6,Math.hypot(e-Y.x,t-Y.z))},Wt=(e,t)=>x(.4,1,a(8.5,13.5,Math.hypot(e-Y.x,t-Y.z)));await d.yield();const d0=[],y0=[];{let e=-46;for(;e<=72;e+=2)d0.push(e);let t=2;for(;e<560;)t=Math.min(t*1.22,e<150?9:17),d0.push(e),e+=t;for(;e<2300;)t*=1.4,d0.push(e),e+=t;e=-48,t=2;const r=[];for(;e>-500;)r.push(e),t=Math.min(t*1.22,e>-110?9:17),e-=t;for(;e>-1500;)r.push(e),t*=1.4,e-=t;d0.unshift(...r.reverse());let o=-94;for(t=3.2;o>-800;)y0.push(o),o-=t;for(;o>-2700;)y0.push(o),t*=1.22,o-=t}const m0=d0.length,A0=y0.length,le=new Float32Array(m0*A0),s0=new Float32Array(m0*A0*3),he=new Float32Array(m0*A0*4),_t=new Float32Array(m0*A0);for(let e=0,t=0;e<A0;e++){for(let r=0;r<m0;r++,t++){const o=d0[r],s=y0[e],l=Io(o,s),u=B0(o,s);le[t]=l,s0[t*3]=o,s0[t*3+1]=l,s0[t*3+2]=s;const v=qe(o,s),c=Ue(o,s,l,u),h=Math.max(1-a(16,40,u),a(-198,-170,s)*(1-a(40,90,Math.abs(o-g0(s)))),a(-480,-530,s)*(1-a(30,70,Math.abs(o-g0(s)))))*(1-c);_t[t]=(1-a(2.2,9.5,Math.abs(o-g0(s))))*a(-98,-106,s)*a(9,13,u),he[t*4]=c,he[t*4+1]=v,he[t*4+2]=I(h,0,1),he[t*4+3]=1-a(10.5,15,u)}e%3===2&&await d.yield()}const Vt=(e,t,r)=>{let o=0,s=e.length-1;for(;s-o>1;){const l=o+s>>1;(r?e[l]<=t:e[l]>=t)?o=l:s=l}return o},n0=(e,t)=>{const r=Vt(d0,I(e,d0[0],d0[m0-1]),!0),o=Vt(y0,I(t,y0[A0-1],y0[0]),!1),s=I((e-d0[r])/(d0[r+1]-d0[r]),0,1),l=I((t-y0[o])/(y0[o+1]-y0[o]),0,1),u=o*m0+r,v=u+m0;return x(x(le[u],le[u+1],s),x(le[v],le[v+1],s),l)},Pe=(e,t)=>a(11,15,B0(e,t));await d.yield();{const e=new Uint32Array((m0-1)*(A0-1)*6);for(let r=0,o=0;r<A0-1;r++)for(let s=0;s<m0-1;s++){const l=r*m0+s,u=l+1,v=l+m0,c=v+1;e[o++]=l,e[o++]=u,e[o++]=v,e[o++]=u,e[o++]=c,e[o++]=v}await d.yield();var j0=new i.BufferGeometry;j0.setAttribute("position",new i.BufferAttribute(s0,3)),j0.setAttribute("aRock",new i.BufferAttribute(he,4)),j0.setAttribute("aTrail",new i.BufferAttribute(_t,1)),j0.setIndex(new i.BufferAttribute(e,1)),await d.yield();const t=new Float32Array(s0.length);for(let r=0;r<e.length;r+=3){const o=e[r]*3,s=e[r+1]*3,l=e[r+2]*3,u=s0[l]-s0[s],v=s0[l+1]-s0[s+1],c=s0[l+2]-s0[s+2],h=s0[o]-s0[s],z=s0[o+1]-s0[s+1],p=s0[o+2]-s0[s+2],f=v*p-c*z,w=c*h-u*p,n=u*z-v*h;t[o]+=f,t[o+1]+=w,t[o+2]+=n,t[s]+=f,t[s+1]+=w,t[s+2]+=n,t[l]+=f,t[l+1]+=w,t[l+2]+=n,r%36e3===35997&&await d.yield()}await d.yield();for(let r=0;r<t.length;r+=3){const o=Math.hypot(t[r],t[r+1],t[r+2])||1;t[r]/=o,t[r+1]/=o,t[r+2]/=o}j0.setAttribute("normal",new i.BufferAttribute(t,3))}await d.yield();const X0=Math.ceil(q)+1,Y0=new Float32Array(X0+1),ue=new Float32Array(X0+1),P0=new Float32Array(X0+1);{const e=new i.Vector3;for(let t=0;t<=X0;t++)h0.posAtDist(Math.min(t,q),e),Y0[t]=e.x,ue[t]=e.y,P0[t]=e.z}const Bt=h0.startTangent,Oo=h0.endTangent,fe=(e,t=new i.Vector3)=>{if(e<=0)return t.copy(h0.start).addScaledVector(Bt,e);if(e>=q-1)return h0.posAtDist(e,t);const r=Math.floor(e),o=e-r;return t.set(x(Y0[r],Y0[r+1],o),x(ue[r],ue[r+1],o),x(P0[r],P0[r+1],o))},Ce=(e,t=new i.Vector3)=>{if(e<=0)return t.copy(Bt);if(e>=q-1.5)return t.copy(Oo);const r=Math.max(Math.round(e),1);return t.set(Y0[r+1]-Y0[r-1],ue[r+1]-ue[r-1],P0[r+1]-P0[r-1]).normalize()},qo={...h0,posAtDist:fe,tangentAtDist:Ce},Z0=new i.Vector3,c0=new i.Vector3,M0=(e,t,r=0,o=new i.Vector3)=>{fe(e,Z0),Ce(e,c0);const s=Math.hypot(c0.x,c0.z)||1;return o.set(Z0.x-c0.z/s*t+c0.x/s*r,0,Z0.z+c0.x/s*t+c0.z/s*r),o.y=n0(o.x,o.z),o},O={horse:0,aurochs:1,deer:2,bison:3,rhino:4,mammoth:5,lion:6,ibex:7},Le=ya(),Uo=ka(),Kt=Ma(),Lo=za(),Ht=Sa();Kt.noGhost=!0,Ht.noGhost=!0,Le.noGhost=!0,await d.yield();const a0=H.fork("actors"),Et=[],$0=new i.Vector3,H0=(e,t,r)=>a(0,t,e)*(1-a(1-r,1,e)),Fe=(e,t,r,o=.04,s=.04)=>l=>{const u=x(e,t,l);return M0(u,r(u),0,$0),[$0.x,$0.y,$0.z,1,0,H0(l,o,s),Pe($0.x,$0.z)]},Nt=(e,t,r,o,s=.04,l=.04,u=1)=>v=>{const c=x(e,r,v),h=x(t,o,v);return[c,n0(c,h),h,1,0,H0(v,s,l),u*Pe(c,h)]},v0=e=>(Et.push(e),e),Qt=[];{const e=.395*q+9;fe(e,Z0),Ce(e,c0);const t=Z0.x,r=Z0.z,o=-c0.z*.866+c0.x*.5,s=c0.x*.866+c0.z*.5,l=5+Math.round(ne*2);for(let u=0;u<l;u++){const v=u===0?0:9+u*7.5+a0.range(-2,2),c=u===0?0:a0.range(-3,3),h=t-s*c*.3+c0.x*c,z=r+o*c*.3+c0.z*c;Qt.push(v0({sp:O.deer,sample:Nt(h-o*70,z-s*70,h+o*95,z+s*95,.06,.08),len:165,lead:v,scale:u===0?1.18:a0.range(.82,.95),ochre:a0.range(.8,1.1),antler:u===0?1:0,red:u===2?1:0}))}}const je=[];for(const e of[-1,1])je.push(v0({sp:O.rhino,sample:Nt(Y.x+e*O0*11.1,Y.z+e*q0*11.1,Y.x-e*O0*2.9,Y.z-e*q0*2.9,.001,.001,1),sg:e,scale:1.32,ochre:.8,stride:2.8}));const It=[],Te=[[-4,10,13,1.34],[-4.7,14.5,17,1.25],[-8.6,11,12,1.25],[-7.3,19.5,15.5,1.2]];for(let e=0;e<10;e++){const t=e<4?Te[e][0]:-(12.5+(e-4)*2.7+a0.range(-.6,.6)),r=a0()*$;It.push(v0({sp:O.aurochs,sample:Fe(200,650,o=>t+.5*Math.sin(o/23+r)),ahead:e<4?Te[e][1]:7+e*7%10*3.3+a0.range(0,2),ochre:.6,fill:a0.range(.78,.94),scale:e<4?Te[e][3]:a0.range(.95,1.08),surge:e<4?Te[e][2]:-1}))}const Ot=[];for(let e=0;e<15;e++){const t=e<12?a0:T,r=e===5||e===9||e===13,o=t()*$;Ot.push(v0({sp:O.mammoth,sample:s=>{const l=x(-330,-610,s),u=K0(l)+5.4+.4*Math.sin(l/17+o);return[u,n0(u,l),l,1,0,H0(s,.05,.05),.25]},k:e,scale:r?.6:t.range(1.02,1.18),ochre:t.range(.8,1.05),fill:r?.1:t.range(.15,.4),stride:3.6*(r?.6:1),...e<12?{}:{gaitPh:T(),seed:T()}}))}const qt=[];if(J!=="night")for(const e of[-1,1])qt.push(v0({sp:O.aurochs,sg:e,t:.5,scale:2.35,ochre:e>0?.95:.3,fill:e>0?.03:.78,stride:6,gaitPh:.2+.3*e,seed:.4+.2*e,sample:t=>{const r=x(26,50,t);return[e*(x(16,Qe,a(28,42,r))-.04),V0+1.1,-r,0,1,1,0]}}));const Xe=[],Ut=[[5.2,8.5],[8.5,29],[6.2,17.5],[12,42],[13.5,-1]],jo=e=>{const t=I(Math.round(e),0,X0);return K0(P0[t])-Y0[t]},Xo=e=>{const t=I(Math.round(e),0,X0);return I((L0(P0[t])-K0(P0[t])-26)/30,.15,1)};for(let e=0;e<Bo;e++){const t=14+a0.range(0,30),r=e<5?Ut[e][0]:15+a0.range(0,24),o=a0.range(20,60),s=a0()*$;Xe.push(v0({sp:O.bison,sample:Fe(250,725,l=>x(jo(l)+14+(t-14)*Xo(l),r,a(492,536,l))+o*a(662,725,l)+.7*Math.sin(l/19+s),.05,.05),ahead:e<5?Ut[e][1]:14+a0.range(0,44),...Le.coat(a0),scale:e===0?1.28:e<5?1.14:a0.range(.92,1.1)}))}const Lt=[];for(let e=0;e<(Vo?2:1);e++)Lt.push(v0({sp:O.lion,sample:Fe(430,700,t=>-(5.6+e*3.6+9.5*a(604,650,t))+.3*Math.sin(t/15+e)),back:e*7,scale:1.36-e*.12,ochre:.55,fill:0}));const jt=e=>27+2.5*R.n2(e*.07,1.3)-5*a(21,31,Math.abs(e)),Xt=[];for(let e=0;e<5;e++)Xt.push(v0({sp:O.ibex,sample:t=>{const r=x(-25,25,t);return[E.x+f0.x*r+j.x*5,i0+jt(r)-.15,E.z+f0.z*r+j.z*5,1,0,H0(t,.08,.08),0]},k:e,scale:a0.range(.9,1.1),ochre:.7,fill:.5,stride:1.5}));const Yt=[];{const e=[[O.aurochs,1],[O.deer,-1],[O.horse,1],[O.aurochs,-1],[O.horse,1],[O.deer,1],[O.horse,-1]];for(let t=0;t<e.length;t++){const[r,o]=e[t],s=T.range(-1,1),l=T.range(-1,1),u=o>0?[-15,5.8+s]:[8.3,6.2+s],v=o>0?[7+l,7.2+s]:[-8.5+l,7.4+s],c=o>0?[2.5+l,30]:[-6+l,31];Yt.push(v0({sp:r,sg:o,scale:1,s0:r===O.horse?1.12:1,ochre:.3,fill:.9,antler:1,red:0,gaitPh:T(),seed:T(),v:T.range(.2,.25),ph:(t+T()*.5)/e.length,sample:h=>{const z=(1-h)*(1-h),p=2*(1-h)*h,f=h*h,w=z*u[0]+p*v[0]+f*c[0],n=-(X+z*u[1]+p*v[1]+f*c[1]);return[w,n0(w,n),n,1,0,H0(h,.07,.14),.6]}}))}}const C0=vt(pt("running-wall-fourth:"+d.seed)),Zt=[],Ye=[[6.5,2.9,1.3],[10.8,-4,1.12],[14.6,-10,1.16]];for(let e=0;e<3;e++)Zt.push(v0({sp:O.bison,sample:Fe(366,600,t=>Ye[e][0]+.25*Math.sin(t/17+e*2)),peak:Ye[e][1],scale:Ye[e][2],ochre:.8+.25*C0(),fill:.1+.1*C0(),red:0,antler:1,gaitPh:C0(),seed:C0()}));const $t=[],Jt=[[O.horse,7,1,0,0,-184,54],[O.aurochs,6.6,.4,.86,0,-208,78],[O.rhino,6,.85,0,1,-230,100],[O.aurochs,9.3,.35,.86,0,-297,30,.2,.6],[O.horse,9.3,1,0,0,-324,30,.2,.6],[O.rhino,7.4,.85,0,0,-353,30,.2,.6],[O.aurochs,8.9,.3,.04,1,-384,30,.2,.6],[O.horse,9.5,.3,.8,0,-410,27,.2,.6]];for(let e=0;e<Jt.length;e++){const[t,r,o,s,l,u,v,c,h]=Jt[e],z=e<3?-276:-456;$t.push(v0({sp:t,k:e,z0:u,run:v,u0:c,u1:h,zEnd:z,scale:r,ochre:o,fill:J==="night"?Math.max(s,.8):s,red:l,antler:1,stride:r*2.6,gaitPh:C0(),seed:C0(),sample:p=>{const f=x(-150,z,p);return[L0(f)-.5-.1*e,At(f)+1.7-.7*Re(f),f,0,0,H0(p,.03,.05)*(e<3?1-a(.7,.82,p):1),0]}}))}const eo=[],to=[[O.horse,12.5,.95,0,0,.72],[O.aurochs,12.5,.3,.86,0,.28]];for(let e=0;e<to.length;e++){const[t,r,o,s,l,u]=to[e];eo.push(v0({sp:t,k:e,t0:u,scale:r,ochre:o,fill:J==="night"?Math.max(s,.8):s,red:l,antler:1,stride:36,gaitPh:C0(),seed:C0(),sample:v=>{const c=x(-574,-610,v);return[zt(c)+1.7,U0[0]+St(c)+1.8,c,0,0,H0(v,.03,.05),0]}}))}const Ze=[[5.2,6.6],[2.6,7.9],[6.6,10.6],[2.3,10.2],[6.2,13.5],[3.4,15.5]],Yo=[0,14.5,8.5,0,0,19],Zo=[0,4.2,12,0,0,9],$o=4.2,Jo=5.3,oo=[8.6,13.5,12.5,0,0,17.5],ea=[5.2,2.7,8.8,0,0,6.6],ta=[0,9.6,8.8,0,0,1.9],ao=[0,2.5,8.6,0,0,6.9],so=[455,458,462,0,0,466],ro=[-4.5,-15.5,15.5,0,0,-9.5],no=[36,13,24,0,0,44],io=[15,20,14,11,17,26],oa=[0,0,0,4.5,6.4,0],aa=[0,0,0,6.4,9.6,0];await d.yield();const sa=await ba(H.fork("grain"),d),t0=await xa(d,{path:qo,palette:_0,hour:J,weather:p0,sunDir:Ho.toArray(),grainTexture:sa,mouthU:yt,eye:se,heightAt:n0,dustAt:Pe,horses:bt,frieze:44,friezeScale:1.55,escort:_o,species:[Le,Uo,Kt,Lo,Ht],actors:Et,cave:{galleryHalf:Qe,mouthHalf:ie,flare:Ie,finHalf:kt,finLen:I0},portalClear:7.5,stallionLat:5.2,stallionScale:1.27,sides:{1:1,2:1,3:-1,4:-1,5:1},peelFn:e=>!e.loop&&e.idx<=5?-15:e.side>0?I0:0,laneFn:(e,t,r,o)=>{let s=r;const l=!o.loop&&o.idx<=5;o.idx===0?s=x(5.2,$o,a(168,198,e)*(1-a(274,298,e))):l?s=x(Ze[o.idx][0],Zo[o.idx]||s,a(X+44,X+104,e)):t>0&&e<X+I0+30&&(s=Math.max(s,12)),l&&ao[o.idx]&&(s=x(s,ao[o.idx],a(204,238,e)*(1-a(278,294,e))));const u=I(r,5,40)-5,v=7.6+u*.088;return t<0?(s=Math.max(s,x(s,13.5+u*.6,a(232,268,e)*(1-a(640,672,e)))),l&&(s=x(s,oa[o.idx],a(600,632,e))),x(s,v,a(q-112,q-56,e))):(s=x(s,19.5+u*.2,a(292,326,e)*(1-a(352,380,e))),l?(s=x(s,ea[o.idx],a(356,380,e)),s=x(s,ro[o.idx],a(so[o.idx],so[o.idx]+27,e)),x(s,Math.sign(ro[o.idx])*(v+1.6+o.idx%3*1.5),a(q-112,q-56,e))):(s=x(s,5.5+u*.27,a(396,428,e)*(1-a(468,500,e))),s=x(s,24+u*.3,a(474,508,e)*(1-a(636,668,e))),x(s,v,a(q-112,q-56,e))))}});L.add(t0.object);const U=t0.uniforms,F0=t0.animals.filter(e=>!e.ext&&!e.loop);for(const e of F0)e.along0=e.along;for(let e=1;e<=5;e++)t0.rescale(F0[e],F0[e].side>0?1.17:1.12);const Ge=F0.filter(e=>e.idx>5&&e.side>0).sort((e,t)=>t.wallY-e.wallY)[0]||null,ra=t0.object.children.filter(e=>/^rw-(body|ghost)-[3-7]$/.test(e.name)),na=t0.object.children.filter(e=>e.name==="rw-body-3");await d.yield();const J0=new i.Color().copy(U.uRock.value).multiplyScalar(.8);let de=22e-5,$e=1;const me=new i.Vector4(.8,.88,.8,0),Je=new i.Vector4(0,.4,.33,0),co=new i.Color(.9,.9,.87),lo=U.uRock.value.clone(),ho=U.uPale.value.clone();if(J==="golden"&&(J0.lerp(new i.Color(_0[4]),.42),me.set(1.7,1,.7,0),Je.set(1,.6,.42,0),$e=1.04,de=5e-4,lo.setRGB(1,.75,.36),ho.setRGB(.97,.82,.52)),J==="night"&&(me.set(.35,.7,.4,1),Je.y=0,$e=1.55,de=3e-4),p0==="loess"&&(J0.lerp(new i.Color(_0[4]),.38).multiplyScalar(.95),de=.0036,me.x+=.5,me.z=1.6,co.set(_0[4]).multiplyScalar(.85),U.uFade.value=420),p0==="snow"&&(de=J==="night"?7e-4:.0011,J0.lerp(new i.Color(.8,.8,.78),J==="night"?.1:.4),U.uSnow.value=1),L.fog=new i.FogExp2(J0,de),L.background=J0.clone(),U.uTorchR.value=330,U.uMouth.value.w=58,U.uTorchBack.value=.16,U.uGlim.value=.76,U.uHearth.value.set(-7.6,V0+.5,-33.5,.95),J==="night"){const e=new i.Color(_0[2]);U.uOchre.value.copy(e).multiplyScalar(.46),U.uChar.value.set(_0[1]).multiplyScalar(.46),U.uSnow.value=Math.min(U.uSnow.value,.4)}U.uDark.value.set(.14,.105,.078).multiplyScalar(J==="night"?.88:1);const k0=()=>({...Ea(),...U}),uo={value:1},fo={value:1},mo={value:.003},E0=[];for(let e=0;e<8;e++)E0.push(new i.Vector4(0,-1e3,0,0));const vo={value:E0},po=new i.Color,go=new i.Color,wo=new i.Mesh(j0,new i.ShaderMaterial({vertexShader:Da,fragmentShader:Ra,fog:!0,uniforms:{...k0(),uCloud:{value:p0==="loess"?.4:J==="night"?.5:1},uGlow:{value:J==="golden"?1:0},uRC:{value:new i.Vector4(Y.x,Y.z,O0,q0)}}}));wo.frustumCulled=!1,L.add(wo);const ia=new i.Vector3(w0.x,0,w0.z+420).normalize(),T0=[];{const e=W()*$;for(let t=0;t<6;t++)T0.push(new i.Vector4(e+(t+W.range(-.22,.22))*$/6,t%2?W.range(.31,.4):W.range(.2,.27),W.range(.5,.82),W.range(.024,.036)*(t%2?1.15:1)));T0[0].set(.5,.3,.48,.036);for(let t=1;t<6;t++){const r=Math.atan2(Math.sin(T0[t].x),Math.cos(T0[t].x));Math.abs(r)<T0[t].z+.3&&(T0[t].y=Math.max(T0[t].y,.37+.03*(t%2)))}}const xo=.115,ca=.132,bo={...U,uRock:{value:lo},uPale:{value:ho},uStencil:{value:new i.Vector4(0,0,0,0)},uHandDir:{value:new i.Vector3(.5,.36,-.8).normalize()},uHaze:{value:J0.clone()},uIceDir:{value:ia},uSkyK:{value:me},uSkyG:{value:Je},uStreak:{value:T0},uDisc:{value:new i.Vector4(0,Math.sin(xo),-Math.cos(xo),ca)},uDiscK:{value:new i.Vector4(p0==="loess"?.85:1,J==="night"?1:0,1,0)}},et=new i.Mesh(new i.SphereGeometry(100,40,20),new i.ShaderMaterial({vertexShader:Pa,fragmentShader:Ca,uniforms:bo,side:i.BackSide,depthWrite:!1}));et.frustumCulled=!1,et.renderOrder=-1,L.add(et);class ee{constructor(){this.p=[],this.r=[],this.i=[],this.uv=[]}v(t,r,o,s=0,l=0,u=0,v=0,c=0,h=0){return this.p.push(t,r,o),this.r.push(s,l,u,v),this.uv.push(c,h),this.p.length/3-1}grid(t,r,o){for(let s=0;s<t.length-1;s++){const l=t[s],u=t[s+1],v=l.length;for(let c=0;c<(r?v:v-1);c++){const h=l[c],z=l[(c+1)%v],p=u[c],f=u[(c+1)%v];o?this.i.push(h,z,p,z,f,p):this.i.push(h,p,z,z,p,f)}}}lathe(t,r,o,s,l,u,v,c,h,z=1){const p=[];for(let f=0;f<=u;f++){const w=f/u,n=v(w),k=h?h(w):[0,0],A=[];for(let g=0;g<l;g++){const y=g/l*$;A.push(this.v(t+k[0]+Math.cos(y)*n*z,r+w*s,o+k[1]+Math.sin(y)*n,...c))}p.push(A)}this.grid(p,!0,s<0)}blob(t,r,o,s,l,u,v,c,h,z=9){const p=[];for(let f=0;f<=z;f++){const w=Math.PI*f/z,n=[];for(let k=0;k<=z+2;k++){const A=$*k/(z+2),g=Math.sin(w)*Math.cos(A),y=Math.cos(w),b=Math.sin(w)*Math.sin(A),D=1+c*R.fbm3(g*1.4+v,y*1.4,b*1.4,3)+c*.6*Math.abs(g)*g*g;n.push(this.v(t+g*s*D,r+y*l*D,o+b*u*D,...h))}p.push(n)}this.grid(p,!1,!0)}geo(){const t=new i.BufferGeometry;return t.setAttribute("position",new i.Float32BufferAttribute(this.p,3)),t.setAttribute("aRock",new i.Float32BufferAttribute(this.r,4)),t.setAttribute("uv",new i.Float32BufferAttribute(this.uv,2)),t.setIndex(this.i),t.computeVertexNormals(),t}}const tt=new i.ShaderMaterial({vertexShader:Ke,fragmentShader:Co,fog:!0,uniforms:k0()});{const e=new ee,t=H.fork("cave"),r=n=>x(x(16,Qe,a(28,42,n)),ie,a(X-Ie,X,n)),o=n=>x(x(14,7.5,a(24,42,n)),11.5,a(X-Ie,X,n)),s=(n,k,A,g,y,b)=>{const D=De(-n)-se,_=-n,F=[];for(let G=0;G<=8;G++){const P=-k+2*k*G/8,V=Math.abs(P),K=R.n2(P*.25,n*.25)*.22*a(2.5,5.5,V)*(1-a(k-2.5,k-.5,V))*y;F.push(e.v(P,D+K-(1-y)*.45,_,0,g,1,n+600))}for(const G of[0,1.7,3.4,5.2])F.push(e.v(k+b*G/5.2,D+G,_,y,g,0,n+120));for(let G=1;G<=9;G++){const P=Math.PI*G/10,V=Math.cos(P),K=Math.pow(Math.sin(P),.75),B=R.fbm3(V*k*.12,n*.09,3.3,3),Z=Math.abs(R.n3(V*k*.2,n*.16,9.1)),l0=(A-5.2+b*1.5)*K*(1+.22*B)-Z*Math.min(1.6,(A-5.2)*.3)*K;F.push(e.v((k+b)*V*(1+.04*B*y),D+5.2+Math.max(l0,.15*K),_,0,g,0,n+260))}for(const G of[5.2,3.4,1.7,0])F.push(e.v(-k-b*G/5.2,D+G,_,y,g,0,n+420));return F},l=[],u=Math.round((X+17)/2.05);for(let n=-80;n<-17.5;n+=4.5)l.push(s(n,16,14,1,1,0));for(let n=0;n<=u;n++){const k=x(-17,X,n/u);l.push(s(k,r(k),o(k),1,1,0))}l.push(s(X+1.2,ie+1.5,13.5,.7,0,1),s(X+2.6,ie+5,18,.35,0,3),s(X+4.4,27,40,0,0,9)),e.grid(l,!0,!0);{const n=[];for(const[k,A]of[[.03,.12],[1.2,.7],[3,1.8],[5.6,3.2],[9.5,5]]){const g=[];for(let y=0;y<=12;y++){const b=-18+36*y/12;g.push(e.v(b,V0-k,-A,k*1.7+A,1,1,600))}n.push(g)}e.grid(n,!1,!1)}const v=e.v(0,V0+6,80,0,1,0,400);for(let n=0;n<l[0].length;n++)e.i.push(v,l[0][(n+1)%l[0].length],l[0][n]);await d.yield();const c=(n,k,A,g,y,b=7)=>{y&&Math.abs(n)<6&&(g=Math.min(g,2.6));const D=t()*9,_=y?De(k)-se-.1:V0+5.2+(o(-k)-5.2)*Math.pow(Math.max(1-(n/r(-k))**2,.02),.375)+.5;e.lathe(n,_,k,y?g:-g,b,b+1,F=>A*Math.pow(1-F*.97,.62)*(1+.2*Math.sin(F*11+D)+.08*Math.sin(F*29+D*2))+.015,[0,1,-1,_],F=>[.25*A*Math.sin(F*5+D),.25*A*Math.cos(F*4+D)])};for(let n=0;n<22;n++){const k=t.range(1,34),A=t.sign()*t.range(5.6,13);r(k)-Math.abs(A)<2.6||c(A,-k,t.range(.3,.75),t.range(1.2,3.8),!0)}for(let n=0;n<9;n++)c(t.sign()*t.range(8,13.5),t.range(6,70),t.range(.35,.8),t.range(1.4,4.2),!0);await d.yield(),c(-3.6,-44,.78,5.4,!0,10),c(3.8,-50,.7,4.7,!0,10),c(-4.6,-40.5,.5,2.5,!0,9),c(4.7,-46,.45,2,!0,9),c(-6.3,-31,.7,3.6,!0,9),c(6.6,-34,.6,3,!0,9);for(let n=0;n<12;n++){const k=t.range(52,90);c(t.sign()*(r(k)-.5),-k,t.range(.17,.28),t.range(.5,1.3),!0)}for(let n=0;n<14;n++)c(t.range(-11,11),-t.range(-6,27),t.range(.25,.6),t.range(1,3.2),!1);for(const[n,k,A,g]of[[-3.4,43,.34,2.3],[-1.8,45.5,.3,2.9],[.4,47,.24,1.6],[2.2,44,.34,2.6],[3.7,47.5,.28,1.9],[-6.6,X-3,.45,3.2],[-3.4,X-2,.34,2.2],[2,X-2.5,.38,2.7],[5.4,X-2,.46,3.4],[7.6,X-3.5,.34,2.2]])c(n,-k,A,g,!1,8);await d.yield();const h=-6.2,z=-15;e.blob(h,V0+.45,z,1.25,.72,.95,3.1,.3,[0,1,0,0],10),e.blob(h+.1,V0+1.24,z,.2,.17,.3,7.7,.08,[0,1,0,0],7),e.blob(h+.1,V0+1.17,z-.36,.13,.1,.22,4.2,.05,[0,1,0,0],6);{const n=[];for(let A=0;A<=18;A++){const g=Math.min(A,16)/16,y=X+.6+(I0-.4)*g+Math.max(0,A-16)*1.2,b=A<=16?1:A===17?.42:0,D=x(ie,kt,a(X,X+I0,y)),_=n0(D,-y),F=n0(D+7,-y),G=_-.8,P=(x(11.5,6,Math.pow(g,.7))+.7*R.n2(y*.3,4.4))*b+.8,V=B=>R.n2(y*.21+B*7.1,B*3.3),K=[];for(const B of[0,.2,.4,.6,.8,1])K.push(e.v(D,G+P*B,-y,b>.9?1:.5,0,0,y+120));K.push(e.v(D+.8+.3*V(1),G+P+(.5+.3*V(2))*b,-y,0,0,0,y+260)),K.push(e.v(D+2.3+.7*V(3),G+P*.95+.6*V(4)*b,-y,0,0,0,y+260)),K.push(e.v(D+3.7+.8*V(5),G+P*.6+.5*V(6)*b,-y,0,0,0,y+260)),K.push(e.v(D+5.3+.9*V(7),x(F,G+P,.16)-.3,-y,0,0,0,y+260)),K.push(e.v(D+7,F-1,-y,0,0,0,y+260)),n.push(K)}e.grid(n,!1,!0)}await d.yield();const p=new i.ShaderMaterial({vertexShader:Ke,fragmentShader:Co,fog:!0,uniforms:{...k0(),uSnow:{value:0}}}),f=e.geo();await d.yield();const w=new i.Mesh(f,p);w.name="cave",L.add(w)}await d.yield();{const e=new ee,t=31,r=12,o=15.5,s=10,l=60,u=9,v=(g,y,b)=>[E.x+f0.x*g+j.x*(b+4),i0+y,E.z+f0.z*g+j.z*(b+4)],c=g=>{if(g<.2)return[-r,x(-3,8,g/.2)];if(g>.8)return[r,x(8,-3,(g-.8)/.2)];const y=Math.PI*(1-(g-.2)/.6);return[r*Math.cos(y),8+(o-8)*Math.sin(y)]},h=g=>{if(g<.2)return[-t,x(-3,13,g/.2)];if(g>.8)return[t,x(13,-3,(g-.8)/.2)];const y=Math.PI*(1-(g-.2)/.6),b=Math.cos(y),D=t*Math.sign(b)*Math.pow(Math.abs(b),.4);return[D,13+(jt(D)-13)*Math.pow(Math.max(Math.sin(y),0),.4)]},z=(g,y,b)=>(.4+R.fbm2(g*.09+3,y*.13,3)*1.5+.8*R.n2(Math.floor(y/3.4)*7.3,2.1)+.5*R.n2(g*.4,y*.5))*a(0,.3,b),p=[],f=[],w=[];for(let g=0;g<=u;g++){const y=g/u,b=[],D=[];for(let _=0;_<=l;_++){const F=_/l,G=c(F),P=h(F),V=x(G[0],P[0],y),K=x(G[1],P[1],y),B=z(V,K,y);b.push(e.v(...v(V,K,-s/2-B),(1-a(.3,.52,y))*a(.2,1.2,K),0,2,V+100)),D.push(e.v(...v(V,K,s/2+B),0,0,0,V+100)),g===u&&w.push(-s/2-B)}p.push(b),f.push(D)}e.grid(p,!1,!0),e.grid(f,!1,!1);const n=[],k=[];for(let g=0;g<=4;g++){const y=[];for(let b=0;b<=l;b++){const D=c(b/l),_=1+.035*R.n2(b*.4,g*.9)*Math.sin(Math.PI*g/4);y.push(e.v(...v(D[0]*_,D[1]*(D[1]>0?_:1),x(-s/2,s/2,g/4)),0,.5,0,1))}n.push(y)}for(let g=0;g<=2;g++){const y=[];for(let b=0;b<=l;b++){const D=h(b/l);y.push(e.v(...v(D[0],D[1]+.6*Math.sin(Math.PI*g/2),x(w[b],-w[b],g/2)),0,0,0,D[0]+100))}k.push(y)}e.grid(n,!1,!1),e.grid(k,!1,!0);const A=new i.Mesh(e.geo(),tt);A.name="arch",L.add(A)}await d.yield();{const e=new ee,t=async(u,v,c,h,z,p,f,w,n,k,A,g,y)=>{const b=[];let D=0,_=u(z),F=z,G=0;for(let P=z;P>p;P-=f(P),G++){const V=u(P);D+=Math.hypot(V-_,P-F),_=V,F=P;const K=n0(V+v*1.5,P)-3,B=Math.max(c(P)+1.6*R.n2(P*.05,4.4+w),K+8),Z=g(P),l0=A(P),z0=n(P),m=[],N=y(P),e0=h(P),G0=o0=>o0===k||o0===k+1?0:1.7*R.n2(D*.02,o0*7.1+w);let b0=0;for(let o0=0;o0<e0.length;o0++){const xe=e0[o0],dt=o0===k,mt=dt?xe[3]*(1-l0)+.55*(1-l0):xe[3],da=1-Math.abs(R.n2(D*.043+o0*.21,7.7+w*5+o0*.37)),ma=R.n2(D*.16,o0*3.3+w);b0=xe[2]+mt*N*(da*3.4-1.2+.7*ma-Z*6.5*a(0,2,o0));const va=I(xe[0]+z0+G0(o0),K,B),pa=I(xe[1]+z0+G0(o0+1),K,B),Ao=I(mt*Z*.95,0,1);m.push(e.v(V+v*b0,va,P,o0,l0*(dt?1:0),Ao,D)),m.push(e.v(V+v*(b0+.25+.8*mt),pa,P,o0+1,l0*(dt?1:0),Ao,D))}m.push(e.v(V+v*(b0-7),B-3.5,P,8.5,0,0,D)),m.push(e.v(V+v*(b0-20),B-18,P,8.5,0,0,D)),b.push(m),(G&15)===15&&await d.yield()}e.grid(b,!1,v<0)},r=u=>{const v=Re(u),c=At(u),h=Pt(u),z=x(6,1.5,v),p=x(45,60,v),f=x(54,71,v),w=x(64,84,v);return[[-60,-2,2.6,.35],[-2,z,1.6,.3],[z,c,.7,.15],[c,h,0,0],[h,p,-1.8,.6],[p,f,-3.6,.9],[f,w,-5.6,1],[w,x(84,114,v),-7.8,1]]},o=[[-60,-12,4.5,.5],[-12,4,3,.6],[4,U0[0],1.5,.8],[U0[0],U0[1],0,.9],[U0[1],60,-2.6,1],[60,76,-5.2,1],[76,98,-8,1],[98,150,-11.5,1]];await t(L0,-1,Ct,r,-98,-900,u=>u>-480?4:u>-620?7:14,0,()=>0,3,Rt,u=>Ae(u,0),()=>1),await d.yield(),await t(ce,1,Ft,()=>o,70,-1130,u=>u>-705?5:9,1,St,3,Dt,u=>Math.max(Ae(u,1)*(1-R0(u)),Mt(u)*R0(u)),u=>1+1.3*R0(u)),await d.yield();{const u=[[-6,3.5,2.4,.3],[3.5,10,1.3,.5],[10,18,.2,.7],[18,27,-1.4,.9],[27,37,-3.2,1],[37,48,-5.2,1],[48,62,-7.4,1],[62,82,-9.8,1]];for(const v of[-1,1]){const c=[];for(let h=27,z=0;h<336;h+=h<150?4:7,z++){const p=E.x+f0.x*v*h,f=E.z+f0.z*v*h,w=Gt(h),n=B=>[p+j.x*B,f+j.z*B],k=n(-2),A=R.fbm2(k[0]*.02,k[1]*.02,3),g=a(.5,.78,R.n2(h*.024+v*3.7,13.1))*a(40,60,h),y=i0+Math.max(x(21.5,0,a(30,48,h)),Tt(A,h))+2.4+(9*(1-Math.abs(R.n2(h*.031,7.6+v)))**2*(.35+.65*a(-.3,.5,R.n2(h*.011,2.2+v)))+1.5*R.n2(h*.09,4.4+v))*a(30,50,h)-2.4*g,b=n(w-2.5),D=n0(b[0],b[1])-3,_=[],F=700+v*300+h,G=B=>1.5*R.n2(h*.02,B*7.1+v*3);let P=0;for(let B=0;B<u.length;B++){const Z=u[B],l0=Z[3],z0=1-Math.abs(R.n2(h*.043+B*.21,17.7+v*5+B*.37)),m=R.n2(h*.16,B*3.3+v*2);P=(Z[2]+l0*(z0*3.4-1.2+.7*m-g*5.5*a(0,2,B)))*a(27,40,h);const N=I(i0+Z[0]+G(B),D,y),e0=I(i0+Z[1]+G(B+1),D,y),G0=I(.36+l0*g*.6,0,1),b0=n(w-P),o0=n(w-P-.25-.8*l0);_.push(e.v(b0[0],N,b0[1],B+5,0,G0,F)),_.push(e.v(o0[0],e0,o0[1],B+6,0,G0,F))}const V=n(w-P+6),K=n(w-P+22);_.push(e.v(V[0],y-2,V[1],13.5,0,.3,F)),_.push(e.v(K[0],y-16,K[1],13.5,0,.3,F)),c.push(_),(z&15)===15&&await d.yield()}e.grid(c,!1,v>0),await d.yield()}}const s=e.geo();await d.yield();const l=new i.Mesh(s,new i.ShaderMaterial({vertexShader:Ke,fragmentShader:Aa,fog:!0,side:i.DoubleSide,uniforms:{...k0(),uGlow:{value:J==="golden"?1:0}}}));l.frustumCulled=!1,l.name="walls",L.add(l)}await d.yield();{const e=new ee,t=[];let r=0,o=D0(120),s=120;for(let u=120;u>=-1262;u-=6){const v=D0(u),c=(D0(u-3)-D0(u+3))/6,h=Math.sqrt(1+c*c),z=[];r+=Math.hypot(v-o,u-s),o=v,s=u;for(const p of[-1,-.5,0,.5,1])z.push(e.v(v+p*13.5/h,i0,u+p*13.5*c/h,r,p,0,0));t.push(z)}e.grid(t,!1,!0);const l=new i.Mesh(e.geo(),new i.ShaderMaterial({vertexShader:Ke,fragmentShader:Ba,fog:!0,uniforms:{...k0(),uEmit:vo,uFwd:{value:new i.Vector2(j.x,j.z)},uGate:{value:new i.Vector4(E.x,E.z,j.x,j.z)},uGateCol:{value:J==="night"?U.uChar.value.clone().multiplyScalar(1.5):new i.Color(_0[4]).multiplyScalar(1.2)}}}));l.name="river",L.add(l)}await d.yield();const M=H.fork("scatter"),Q=new i.Vector3;{const e=new i.IcosahedronGeometry(1,1),t=e.attributes.position;for(let f=0;f<t.count;f++){const w=t.getX(f),n=t.getY(f),k=t.getZ(f),A=.78+.34*R.fbm3(w*1.3+5,n*1.3,k*1.3,2)+.12*Math.sign(w)*w*w;t.setXYZ(f,w*A*1.2,n*A*.7,k*A)}e.computeVertexNormals(),e.setAttribute("aRock",new i.BufferAttribute(new Float32Array(t.count*4),4));const r=Math.round(240*(.6+.4*S)),o=new i.InstancedMesh(e,tt,r),s=new i.Matrix4,l=new i.Quaternion,u=new i.Euler,v=new i.Vector3;for(let f=0;f<r;f++){const w=M(),n=.13+.62*Math.pow(M(),3),k=w<.24?M.range(99,190):w<.62?M.range(478,628):M.range(600,706);M0(k,M.sign()*(2.4+n*7+38*Math.pow(M(),2)),0,Q),s.compose(Q.setY(Q.y+n*.18),l.setFromEuler(u.set(M.range(-.3,.3),M()*$,M.range(-.3,.3))),v.set(n*M.range(.8,1.3),n*M.range(.7,1.1),n*M.range(.8,1.3))),o.setMatrixAt(f,s)}o.instanceMatrix.needsUpdate=!0,o.name="stones",L.add(o),await d.yield();const c=new i.IcosahedronGeometry(1,0),h=c.attributes.position;for(let f=0;f<h.count;f++){const w=h.getX(f),n=h.getY(f),k=h.getZ(f),A=.8+.3*R.n3(w*1.7+2,n*1.7,k*1.7);h.setXYZ(f,w*A*1.25,n*A*.62,k*A)}c.computeVertexNormals(),c.setAttribute("aRock",new i.BufferAttribute(new Float32Array(h.count*4),4));const z=Math.round(800*(.5+.5*S)),p=new i.InstancedMesh(c,tt,z);for(let f=0;f<z;f++){const w=.07+.3*Math.pow(M(),2.2),n=M()<.33?M.range(99,196):M.range(476,708);M0(n,M.sign()*(1.3+w*4+13*Math.pow(M(),1.3)),0,Q),s.compose(Q.setY(Q.y+w*.12),l.setFromEuler(u.set(M.range(-.4,.4),M()*$,M.range(-.4,.4))),v.set(w*M.range(.8,1.4),w*M.range(.6,1.1),w*M.range(.8,1.3))),p.setMatrixAt(f,s)}p.instanceMatrix.needsUpdate=!0,p.name="cobbles",L.add(p)}await d.yield();const yo={value:new i.Vector3(0,0,1e3)};{const s=new Float32Array(297312);for(let b=0;b<652;b++){const D=-744+b,_=g0(D),F=Eo(D);for(let G=0;G<114;G++){const P=-36+G,V=n0(P,D),K=P-_,B=(b*114+G)*4;let Z=0;G>0&&b>0&&G<113&&b<651&&D<-146&&(Z=Math.min(1,Ue(P,D,V,B0(P,D))*(1+1.1*a(-480,-525,D)))*a(.7,2.1,Math.abs(K)),Math.abs(D-Y.z)<16&&(Z=Math.max(Z,.85*a(4.6,6.2,Math.hypot(P-Y.x,D-Y.z))*(1-a(8,10,Math.hypot(P-Y.x,D-Y.z)))*a(.7,2.1,Math.abs(K)))),F>480&&F<672&&(Z*=1-a(480,492,F)*(1-a(660,672,F))*Math.max(a(4.2,5.4,K)*(1-a(17,19,K)),a(-3.6,-4.4,K)*(1-a(-7.4,-8.4,K))))),s[B]=V,s[B+1]=Z,s[B+2]=Wt(P,D)}(b&7)===7&&await d.yield()}const l=new i.DataTexture(s,114,652,i.RGBAFormat,i.FloatType);l.magFilter=l.minFilter=i.NearestFilter,l.generateMipmaps=!1,l.needsUpdate=!0;const u=b=>{const D=[],_=[];for(let G=0;G<b;G++){const P=G*5;D.push(-1,0,G,1,0,G,-1,.5,G,1,.5,G,0,1,G),_.push(P,P+1,P+2,P+1,P+3,P+2,P+2,P+3,P+4)}const F=new i.BufferGeometry;return F.setAttribute("position",new i.Float32BufferAttribute(D,3)),F.setIndex(_),F},v=b=>b<.55?1:b<.84?0:b<.955?3:2,c=b=>({...k0(),uWrap:{value:b},uBox:{value:40},uCtr:yo,uHt:{value:l},uHtBox:{value:new i.Vector4(-36,-744,114,652)}});await d.yield();const h=Math.round(2900*S*(.9+.2*ne)),z=new Float32Array(h*4),p=new Float32Array(h*4);for(let b=0;b<h;b++)z.set([T(),0,T(),T.range(.34,.7)],b*4),p.set([T(),v(T()),T()*$,T.range(.04,.3)],b*4),(b&1023)===1023&&await d.yield();const f=new i.Mesh(re(u(5),h,{iP:z,iQ:p}),new i.ShaderMaterial({vertexShader:Fo,fragmentShader:To,fog:!0,side:i.DoubleSide,uniforms:c(1)}));f.frustumCulled=!1,f.name="grass-carpet",L.add(f),await d.yield();const w=Math.round(300*S),n=Math.round(3900*S*(.9+.2*ne)),k=new Float32Array((n+w)*4),A=new Float32Array((n+w)*4);let g=0;for(let b=0;g<n&&b<n*3;b++){(b&1023)===1023&&await d.yield(),M0(T.range(104,668),T.sign()*(1.6+62*Math.pow(T(),1.5)),0,Q);const D=Ue(Q.x,Q.z,Q.y,B0(Q.x,Q.z));T()>.12*Pe(Q.x,Q.z)+D||(k.set([Q.x,Q.y-.03,Q.z,T.range(.32,.66)*(.8+.4*D)*Wt(Q.x,Q.z)],g*4),A.set([T(),v(T()),T()*$,T.range(.05,.35)],g*4),g++)}for(let b=0;b<w;b++){const D=W()*$,_=5.4+5.2*Math.pow(W(),1.4),F=Y.x+Math.cos(D)*_,G=Y.z+Math.sin(D)*_;if(Math.abs(F-g0(G))<1.5){W(),W(),W(),W();continue}k.set([F,n0(F,G)-.02,G,W.range(.17,.27)],g*4),A.set([W(),v(W()),D+W.range(-.5,.5),.45],g*4),g++}const y=new i.Mesh(re(u(2),g,{iP:k.subarray(0,g*4),iQ:A.subarray(0,g*4)}),new i.ShaderMaterial({vertexShader:Fo,fragmentShader:To,fog:!0,side:i.DoubleSide,uniforms:c(0)}));y.frustumCulled=!1,y.name="grass",L.add(y)}await d.yield();{const e=Math.round(560*S),t=Math.round(2500*S)+e,r=new Float32Array(t*4),o=new Float32Array(t*4);let s=0;for(let h=0;s<e&&h<e*4;h++){(h&511)===511&&await d.yield();const z=M()<.24,p=M(),f=z?p<.75?2:1:p<.48?1:p<.84?0:2,w=z?M.range(100,194):M.range(484,702),n=M.sign()*(3.3+11*Math.pow(M(),1.2));if(!z&&w<668&&(n>5&&n<17.5||n<-4.3&&n>-7.6)||(M0(w,n,0,Q),B0(Q.x,Q.z)<10.8))continue;const k=f===0?M.range(.42,.72):f===1?M.range(.36,.6):M.range(.75,1.25);r.set([Q.x,Q.y-k*.04,Q.z,k],s*4),o.set([f,M(),M()*$,f===2?.66:.52],s*4),s++}for(let h=0;s<t&&h<t*3;h++){(h&511)===511&&await d.yield();const z=M(),p=z<.4?0:z<.76?1:z<.88?2:3,f=M();let w,n,k=3.2;if(p===3)if(k=14,n=-M.range(100,900),f<.3)w=Math.min(ce(n)+M.range(15,80),g0(n)-26);else if(f<.6)w=L0(n)-M.range(4,15)-Math.max(0,-470-n)*.2*M();else if(f<.93)n=-M.range(440,640),w=Math.min(K0(n)+M.range(22,95),L0(n)-8);else{const y=M.sign()*M.range(34,90);let b=M.range(-34,30);b>-26&&b<0&&(b=b<-13?b-13:b+14),b<0&&(b-=8*a(90,170,Math.abs(y))),w=E.x+f0.x*y+j.x*b,n=E.z+f0.z*y+j.z*b}else p===2?(k=5,M0(f<.5?M.range(98,192):M.range(480,650),M.sign()*(5+55*Math.pow(M(),1.4)),0,Q),w=Q.x,n=Q.z):f<.42?(n=-M.range(150,570),w=K0(n)+M.range(-10,3.5)):f<.66?(n=-M.range(150,665),w=D0(n)+M.sign()*M.range(16,44)):(M0(M.range(150,610),M.sign()*(3.2+80*Math.pow(M(),1.5)),0,Q),w=Q.x,n=Q.z);if(Math.abs(w-g0(n))<k||B0(w,n)<13||qe(w,n)>.02)continue;if(p<3&&n<-488&&n>-662){const y=w-g0(n);if(y>5&&y<17.5||y<-4.3&&y>-7.6)continue}if(p===3&&n<-190&&n>-640&&Math.abs(w-E.x*(-n-100)/(-E.z-100))<17||p===3&&n<-270&&n>-456&&w>K0(n)+16)continue;const A=n0(w,n);if(p<3&&Math.abs(n0(w+1.5,n)-A)>1.6)continue;const g=p===0?M.range(.5,.78):p===1?M.range(.4,.62):p===2?M.range(.95,1.4):M.range(7.5,10.5);r.set([w,A-g*.04,n,g],s*4),o.set([p,M(),M()*$,p===3?.34:p===2?.66:.52],s*4),s++}const l=new i.BufferGeometry,u=[],v=[];for(let h=0;h<2;h++)u.push(-1,0,h,1,0,h,-1,1,h,1,1,h),v.push(h*4,h*4+1,h*4+2,h*4+1,h*4+3,h*4+2);l.setAttribute("position",new i.Float32BufferAttribute(u,3)),l.setIndex(v);const c=new i.Mesh(re(l,s,{iP:r.subarray(0,s*4),iQ:o.subarray(0,s*4)}),new i.ShaderMaterial({vertexShader:Fa,fragmentShader:Ta,fog:!0,side:i.DoubleSide,uniforms:k0()}));c.frustumCulled=!1,c.name="signs",L.add(c)}await d.yield();{const e=Math.round(3e3*S),t=Math.round(520*S),r=152,o=p0==="clear"?0:Math.round((p0==="snow"?1500:900)*S),s=e+t+r+o,l=new Float32Array(s*4),u=new Float32Array(s*4);for(let c=0;c<s;c++){const h=c<e?0:c<e+t?1:c<e+t+r?2:3;l.set([M(),M(),M(),0],c*4),u.set([h,M(),h===0?M.range(.045,.11):h===1?M.range(.018,.045):h===2?M.range(.05,.115):p0==="snow"?M.range(.05,.09):M.range(.03,.08),0],c*4)}const v=new i.Mesh(re(Na(),s,{iP:l,iQ:u}),new i.ShaderMaterial({vertexShader:Ga,fragmentShader:Wa,fog:!0,uniforms:{...k0(),uPx:mo,uEmit:vo,uAir:{value:p0==="snow"?1.6:.25},uAirCol:{value:co},uSplash:{value:po}}}));v.frustumCulled=!1,v.name="dots",L.add(v)}await d.yield();const ve=15,pe=new Float32Array(ve*4),ot=new Float32Array(ve*4),ko=[],ge=new Float32Array([0,-1e3,0,0]),Mo=new Float32Array([0,.7,1,4.2]);{const e=new i.BufferGeometry;e.setAttribute("position",new i.Float32BufferAttribute([0,0,.2,0,0,-.24,.55,0,.16,.5,0,-.2,1,0,-.02,.96,0,-.2,0,0,.2,0,0,-.24,-.55,0,.16,-.5,0,-.2,-1,0,-.02,-.96,0,-.2,0,.02,.42,.09,0,0,-.09,0,0,0,0,-.5,.13,0,-.62,-.13,0,-.62,0,.2,.1,0,-.2,.1,1e-4,0,.3,.16,0,.1,-.16,0,.1],3)),e.setIndex([0,2,1,1,2,3,2,4,3,3,4,5,6,7,8,7,9,8,8,9,10,9,11,10,12,13,14,13,15,14,15,16,17,18,21,19,18,19,22,18,20,21,18,22,20]);for(let c=0;c<ve;c++)ko.push({r:M.range(10,30),h:M.range(3,16),w:M.range(.25,.5)*M.sign(),ph:M()*$,bob:M.range(1,4)}),ot.set([0,M()*$,0,M.range(8,11)],c*4),pe.set([0,-1e3,0,c===0?0:M.range(1,1.5)],c*4);var at=re(e,ve,{iP:pe,iQ:ot},!0);const t=[],r=[],o=(c,h,z)=>(t.push(c,h,z),t.length/3-1);for(const c of[1,-1]){const h=[],z=[];for(let f=0;f<=7;f++){const w=.1+.9*f/7,n=Math.pow(Math.max(1-w,0),.45);h.push(o(c*w,0,.2-.07*w*w-.2*(1-n))),z.push(o(c*w,0,-.36+.1*w*w*w+.26*(1-n)))}for(let f=0;f<7;f++)c>0?r.push(h[f],z[f],h[f+1],h[f+1],z[f],z[f+1]):r.push(h[f],h[f+1],z[f],h[f+1],z[f+1],z[f])}const s=(c,h,z,p,f,w,n,k)=>{const A=[];for(let g=0;g<=k;g++){const y=Math.PI*g/k,b=[];for(let D=0;D<n;D++){const _=$*D/n;b.push(o(c+p*Math.sin(y)*Math.cos(_),h+f*Math.sin(y)*Math.sin(_),z+w*Math.cos(y)))}A.push(b)}for(let g=0;g<k;g++)for(let y=0;y<n;y++){const b=A[g][y],D=A[g][(y+1)%n],_=A[g+1][y],F=A[g+1][(y+1)%n];r.push(b,_,D,D,_,F)}};s(0,-.02,-.04,.15,.15,.32,8,6),s(0,.06,.3,.165,.16,.15,9,6);for(const c of[1,-1]){const h=o(c*.07,.19,.3),z=o(c*.14,.17,.27),p=o(c*.17,.36,.25);r.push(h,z,p)}{const c=o(0,0,-.3),h=o(.17,0,-.56),z=o(-.17,0,-.56),p=o(0,.01,-.6);r.push(c,h,p,c,p,z)}const l=new i.BufferGeometry;l.setAttribute("position",new i.Float32BufferAttribute(t,3)),l.setIndex(r);var st=re(l,1,{iP:ge,iQ:Mo},!0);const u=new i.Mesh(at,new i.ShaderMaterial({vertexShader:_a,fragmentShader:Va,fog:!0,side:i.DoubleSide,uniforms:k0()}));u.frustumCulled=!1,u.name="birds",L.add(u);const v=new i.Mesh(st,u.material);v.frustumCulled=!1,v.name="owl",L.add(v)}await d.yield();const x0=new i.Group,te=new i.Group,We=new i.Vector3(-.95,-.2,-1.3);{const e=new ee,t=H.fork("mount"),r=[.93,.2,0,0],o=[1,0,0,0],l=[[-1.62,-.2,.2,.3],[-1.42,-.75,.17,.27],[-1.22,-1.25,.14,.23],[-1.07,-1.65,.12,.19],[-1,-1.9,.115,.15],[-1.04,-2.08,.1,.12],[-1.16,-2.28,.085,.1]].map(([p,f,w,n])=>{const k=[];for(let A=0;A<8;A++){const g=A/8*$;k.push(e.v(Math.cos(g)*w,p+Math.sin(g)*n,f,...r))}return k});e.grid(l,!0,!1);for(let p=0;p<13;p++){const f=p/12,w=x(-1.19,-.86,Math.pow(f,.8)),n=x(-.85,-1.84,f),k=t.range(.12,.17);e.lathe(t.range(-.012,.012),w,n,k,5,2,A=>.05*(1-A*.8),o,A=>[0,-.03*A],.8)}for(let p=0;p<4;p++)e.lathe((p-1.5)*.035,-.9,-1.98-.02*(p%2),.1,5,2,f=>.035*(1-f*.7),o,f=>[0,-.16*f-.1*f*f],1);for(const p of[-1,1])e.lathe(p*.095,-.93,-1.93,.27,6,4,f=>.012+.052*Math.sin(Math.PI*Math.min(f*.8+.22,1)),[.9,.5*.6,0,0],f=>[p*.06*f,-.05*f],.62);const u=new i.ShaderMaterial({vertexShader:Ka,fragmentShader:Ha,fog:!0,side:i.DoubleSide,uniforms:{...k0(),uCaveK:uo,uFlame:fo,uInk:{value:J==="night"?new i.Color(_0[2]).multiplyScalar(.1):U.uChar.value}}}),v=new i.Mesh(e.geo(),u);v.frustumCulled=!1,x0.add(v);const c=new ee;c.lathe(0,-.62,0,.62,6,3,p=>.024+.012*p,[1,.3,1,0],p=>[.1*(1-p)*-1,.4*(1-p)]);const h=(p,f)=>{const w=c.v(0,0,0,0,0,p,f,0,0),n=c.v(0,0,0,0,0,p,f,1,0),k=c.v(0,0,0,0,0,p,f,0,1),A=c.v(0,0,0,0,0,p,f,1,1);c.i.push(w,n,k,n,A,k)};for(let p=0;p<11;p++)h(3,(p+t()*.6)/11);h(2,0);const z=new i.Mesh(c.geo(),u);z.frustumCulled=!1,te.add(z),te.position.copy(We),x0.add(te),x0.name="mount",L.add(x0)}const rt=new i.Vector3,oe=new i.Vector3,ae=new i.Vector3,nt=new i.Vector3,it=new i.Vector3,zo=new i.Vector3,la=new i.Vector3(E.x,i0+19,E.z),ha=new i.Vector3().copy(E).setY(E.y+3),So=new i.Vector3(Y.x,n0(Y.x,Y.z)+1.3,Y.z),ua=new i.Vector3(zt(-598),22,-598),fa=[{at:()=>(t0.runnerAt(0,rt),rt.y+=2.6,rt),from:.09,to:.215,weight:.46,fade:.25},{at:la,from:.125,to:.235,weight:.5},{at:()=>(t0.runnerAt(0,oe),oe.y+=1.85,oe),from:.165,to:.4,weight:.9,fade:.2},{at:()=>(t0.runnerAt(0,oe),oe.y+=1.85,oe),from:.19,to:.4,weight:.65,fade:.22},{at:So,from:.414,to:.487,weight:.85},{at:So,from:.419,to:.487,weight:.5},{at:()=>(t0.runnerAt(0,nt),nt.y+=1.6,nt),from:.462,to:.6,weight:.5,fade:.25},{at:(e,t)=>(M0(t*q+22,23,0,ae),ae.y+=3.2,ae),from:.49,to:.577,weight:.72},{at:(e,t)=>(M0(t*q+22,23,0,ae),ae.y+=3.2,ae),from:.525,to:.628,weight:.4,fade:.4},{at:ua,from:.562,to:.715,weight:.34,fade:.37},{at:()=>(t0.runnerAt(0,it),it.y+=1.5,it),from:.583,to:.705,weight:.26,fade:.4},{at:()=>t0.actorAt(Xe[0],zo).setY(zo.y+1.6),from:.665,to:.84,weight:.27},{at:ha,from:.7,to:.92,weight:.3}],Do=new i.Vector2,r0=new i.Vector3,ct=new i.Vector3,Ro=new i.Vector3,u0=new i.Vector3,lt=new i.Vector3().copy(E).addScaledVector(f0,-4).addScaledVector(j,2).setY(E.y+8.5),ht=new i.Vector3().copy(E).addScaledVector(f0,-4.6).addScaledVector(j,-62).setY(E.y+2.6),ut=new i.Vector3().copy(E).addScaledVector(j,4).setY(i0+30),we=new Float32Array(8),_e=new Float32Array(8),Ve=new Float32Array(8),ft=new i.Vector3;return{scene:L,path:h0,duration:40,pace:e=>1.1-.3*(1-a(.085,.17,e))-.1*W0(e,.24,.37,.3)-.1*W0(e,.47,.7,.3)-.1*a(.86,.95,e),title:p0==="loess"?"The Running Wall, loess storm":p0==="snow"?"The Running Wall, first snow":J==="night"?"The Running Wall, engraved":"The Running Wall",camera:{fov:62,near:.3,far:5200,lookAhead:30,sway:.8,bank:.6},pois:fa,portal:{shape:"circle",radius:6,color:"#F0B060",glow:1,revealDistance:300,dewash:0},post:{exposure:$e,bloom:{strength:.3,radius:.5,threshold:1},grade:{saturation:1.06,contrast:1.05,tint:"#ffffff",shadowTint:"#140c06",vignette:.3,grain:.03,aberration:0}},ride:"none",style:"none",update:(e,t,r,o)=>{const s=o*q;for(const m of Qt)m.t=I((70+m.lead+(o-.395)*q*.9)/165,0,1);for(const m of je)m.t=.515+.04*Math.sin(t*1.3)+.008*Math.sin(t*3.1+m.sg);const l=46*(1-a(.27,.39,o))-8*a(.39,.46,o)-70*a(.455,.57,o);for(const m of qt)m.t=.44+.01*Math.sin(t*.3+m.sg);const u=a(.455,.5,o),v=a(.56,.66,o),c=46*(1-a(.3,.428,o))-8*a(.44,.47,o);for(const m of It)m.t=I((s+m.ahead+(m.surge>0?c+m.surge*u-(70+m.surge)*v:l)-200)/450,0,1);for(const m of Ot)m.t=I((122-6.4*m.k+.08*s)/280,0,1);const h=a(.05,.115,o),z=x(2.3,1,a(.015,.095,o));for(const m of Yt){const N=t*m.v+m.ph;m.t=Math.max(N-Math.floor(N),h),t0.rescale(m,z*m.s0)}for(const m of Xe)m.t=I((s+m.ahead+(52+m.ahead*.8-m.ahead)*(1-a(.52,.66,o))-(m.ahead+34)*a(.9,.96,o)-250)/475,0,1);for(const m of Lt)m.t=I((s-25+40*a(.6,.675,o)-46*a(.885,.95,o)-m.back-430)/270,0,1);for(const m of eo)m.t=m.t0+.09*a(.5,.72,o);const p=fe(s,r0).z;for(const m of $t)m.t=m.k<3?I((-150-Math.min(m.z0,p-m.run))/(-150-m.zEnd),0,1):I((-150-m.z0+m.run*I((o-m.u0)/(m.u1-m.u0),0,1))/306,0,1);for(const m of Zt)m.t=I((s+x(-8,m.peak,a(.492,.518,o))-(m.peak+9)*a(.528,.56,o)-366)/234,0,1);const f=1-a(.185,.27,o),w=a(.6,.68,o),n=a(.86,.93,o),k=a(.272,.322,o)*(1-a(.362,.392,o)),A=a(.262,.335,o)*(1-a(.362,.392,o)),g=a(.375,.445,o)*(1-a(.462,.5,o)),y=a(.45,.5,o),b=a(.785,.85,o);for(let m=1;m<=5;m++){const N=F0[m];N.along=x(x(N.side>0?x(x(x(x(Yo[m],ta[m],m===5?A:k),oo[m],y),-3-m,g),no[m],w):x(N.along0,aa[m],b),io[m],n),Ze[m][1],f)}const D=x(x(Jo,7.5,a(.335,.39,o)),oo[0],y);F0[0].along=x(x(x(D-9.5*g,no[0],w),io[0],n),Ze[0][1],1-a(.17,.25,o)),Ge&&(Ge.along=x(Ge.along0,X+I0+1.4-.16*q,1-a(.19,.27,o)),Ge.wig=a(.19,.27,o));for(let m=0;m<=5;m++)F0[m].wig=(1-.85*f)*(1-.75*Math.max(k,W0(o,.56,.7,.2),b));F0[0].wig*=1-.7*W0(o,.2,.42,.2);for(const m of Xt){const N=t/110+m.k/5;m.t=N-Math.floor(N)}for(const m of ra)m.visible=o>.1;for(const m of na)m.visible=o>.22;t0.setProgress(o),t0.update(e,t,r),fe(s,r0),Ce(s,u0);const _=Math.hypot(u0.x,u0.z)||1;Ro.set(-u0.z/_,0,u0.x/_);const F=a(.122,.172,o);ct.copy(r0).addScaledVector(Ro,-3-4*F+.4*Math.sin(t*2.3)).addScaledVector(u0,3+.4*Math.cos(t*1.7)),ct.y+=-.9+1.2*Math.sin(Math.PI*F),t0.setTorch(ct,1-F);const G=(1-a(0,.012,o))**2;U.uTorchR.value=x(27,60,a(.085,.125,o))+286*G,U.uMouth.value.w=22-13*W0(o,.035,.118,.35)+36*G,U.uHearth.value.w=.95*(1+.08*Math.sin(t*2.9)+.05*Math.sin(t*7.3)),U.uTorch.value.w*=1+.13*Math.sin(t*3.1),uo.value=1-a(X-8,X+5,s),fo.value=1-a(.8,1,F),te.visible=F<.999,te.position.set(We.x-4.5*F,We.y+1.5*Math.sin(Math.PI*F*.9)-1.8*F*F,We.z-1.2*F),te.rotation.z=F*5.5;const P=s/8.4*$;o>0?x0.position.setFromMatrixPosition(r.matrixWorld):x0.position.copy(h0.start),x0.visible=o>0;const V=x0.position.x,K=x0.position.z,B=Math.max(0,Math.sin(s/61+.8))**6;x0.position.y+=.035*Math.sin(P+1)-.3+.1*B-.62*I((Math.tan((r.fov||62)*Math.PI/360)-.62)/.39,0,1),x0.rotation.set(Math.asin(I(u0.y,-1,1))+.05*Math.sin(P)+.012*Math.sin(t*2.3)+.05*B,Math.atan2(-u0.x,-u0.z)+.075*Math.sin(P*.5+.6)+.05*Math.sin(s/37+2)+.012*Math.sin(t*1.3),.035*Math.sin(P*.5+2.1),"YXZ"),r.getWorldPosition(ft),yo.value.set(ft.x+u0.x/_*12,0,ft.z+u0.z/_*12),d.renderer.getDrawingBufferSize(Do),mo.value=2*Math.tan((r.fov||62)*Math.PI/360)/Math.max(Do.y,1),E0[0].set(V+u0.x*4.2,i0,K+u0.z*4.2,n0(V,K)<i0-.1?1:0);let Z=0;if(s>q-170)for(let m=0;m<bt;m++){if(t0.runnerAt(m,r0),r0.y>=i0-.1)continue;const N=Math.hypot(r0.x-V,r0.z-K);if(N>90)continue;let e0=Math.min(Z,6);if(!(Z===7&&N>=we[6])){for(;e0>0&&we[e0-1]>N;)we[e0]=we[e0-1],_e[e0]=_e[e0-1],Ve[e0]=Ve[e0-1],e0--;we[e0]=N,_e[e0]=r0.x,Ve[e0]=r0.z,Z<7&&Z++}}for(let m=1;m<8;m++)m<=Z?E0[m].set(_e[m-1],i0,Ve[m-1],1):E0[m].set(0,-1e3,0,0);const l0=a(.3,.36,o)*(1-a(.5,.56,o));if(go.copy(U.uRed.value).multiplyScalar(.9),po.copy(U.uPale.value).multiplyScalar(.98).lerp(go,1-a(.56,.62,o)),l0>.01)for(let m=0;m<2;m++){const N=je[m];t0.actorAt(N,r0),E0[1+m*2].set(r0.x-N.sg*O0*1.5,r0.y+.05,r0.z-N.sg*q0*1.5,l0),E0[2+m*2].set(r0.x+N.sg*O0*1.4,r0.y+.05,r0.z+N.sg*q0*1.4,l0*.8)}const z0=a(.91,1,o);ge[0]=x(lt.x,ht.x,z0),ge[1]=x(lt.y,ht.y,z0)-Math.sin(Math.PI*z0)*1.2,ge[2]=x(lt.z,ht.z,z0),ge[3]=o>.9?1.7:0,Mo[0]=Math.atan2(-j.x,-j.z),st.attributes.iP.needsUpdate=!0,st.attributes.iQ.needsUpdate=!0;for(let m=1;m<ve;m++){const N=ko[m],e0=t*N.w+N.ph,G0=Math.cos(e0),b0=Math.sin(e0);pe[m*4]=ut.x+G0*N.r,pe[m*4+1]=ut.y+N.h+Math.sin(t*.6+N.ph)*N.bob,pe[m*4+2]=ut.z+b0*N.r*.7,ot[m*4]=Math.atan2(-b0*N.w,G0*.7*N.w)}at.attributes.iP.needsUpdate=!0,at.attributes.iQ.needsUpdate=!0,Ko&&bo.uStencil.value.set(a(.5,.52,o)*(1-a(.6,.66,o)),a(.5,.56,o),1,0)},dispose(){t0.dispose()}}}};export{qa as default};
