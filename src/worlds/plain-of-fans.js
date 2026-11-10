import*as e from"three";import{makePath as dt,clamp as ye,lerp as se,smoothstep as O}from"../kit/core.js";import{makeSky as ht}from"../kit/sky.js";import*as Ze from"../kit/fx.js";import{buildHero as ft,buildElder as vt}from"../parts/plain-of-fans.js";const G=180,Fe=-1300,re=-925,be=-1250,Ve=5,Be=4.330127,Ne=1.3,Te=[[-35,-425,68,.105],[120,-530,52,.27],[174,-700,50,.415],[244,-910,62,.53],[85,-934,58,.6]],We=Te.length,pt={dawn:{sky:{preset:"dawn",zenith:[.36,.67,.7],mid:[.98,1.02,.62],horizon:[1.55,1.16,.28],ground:"#8f927e",horizonPow:9,midPow:3.6,stars:0,scatterColor:[2.1,1.8,1.12],scatter:.9,scatterPow:6,scatterHigh:.3,scatterFall:1.6,sunElevation:11,sunAzimuth:-65,sunColor:"#FFF6D8",sunSize:1.6,sunIntensity:9,sunGlow:1.25,sunGlowTight:.3},sun:[1.75,1.48,.98],fill:["#F7EDB0",.55],gnd:["#3A4763",.9],fog:[.8,.73,.4],fogSun:[1,.9,.5],exposure:.86,tint:"#fffcec",shadowTint:"#141c33",mist:1,cirrus:[[1.75,1.66,1.3],[.62,.8,.76]]},noon:{sky:{preset:"overcast",sunElevation:38,sunAzimuth:-65,zenith:"#A9BFD8",mid:"#DCE4EA",horizon:"#F6F1E2",horizonPow:6,midPow:2.6,veil:1.2,sunGlow:1.3,sunGlowTight:.3,scatterColor:[1.5,1.42,1.2],scatter:.95,scatterPow:3.2,scatterHigh:.6,scatterFall:1.1,clouds:{coverage:.7,softness:.6,lit:[1.2,1.18,1.1],shade:[.66,.71,.82],absorb:.9,silver:1.1,scale:.8,detail:.7},clouds2:{coverage:.66,softness:.6,scale:.5,stretch:.6,opacity:.75,lit:[1.06,1.06,1.03],shade:[.68,.73,.82],wind:[.006,.002]}},sun:[1.05,1.02,.98],fill:["#EEF0F2",.95],gnd:["#5E6470",.8],fog:[.72,.74,.74],fogSun:[.84,.84,.82],exposure:.9,tint:"#f8fbff",shadowTint:"#161a26",mist:.8,cirrus:null},evening:{sky:{preset:"sunset",zenith:[.34,.46,.8],mid:[1.04,.82,.66],horizon:[1.8,1.02,.4],ground:"#8c7a70",horizonPow:9,midPow:3.6,stars:0,scatterColor:[2.3,1.6,.9],scatter:.9,scatterPow:6,scatterHigh:.3,scatterFall:1.6,sunElevation:8,sunAzimuth:-65,sunColor:"#FFE2B4",sunSize:1.7,sunIntensity:9,sunGlow:1.25,sunGlowTight:.3,clouds:!1},sun:[2.2,1.38,.74],fill:["#F3CBA6",.6],gnd:["#46549A",1.15],fog:[.92,.6,.36],fogSun:[1.2,.8,.44],exposure:1,tint:"#ffeeda",shadowTint:"#1c1836",mist:1,cirrus:[[1.9,1.5,1.12],[.66,.58,.84]]},night:{sky:{preset:"night",zenith:[.018,.026,.07],mid:[.05,.07,.15],horizon:[.17,.21,.34],horizonPow:2.4,bodyOverrides:{0:{elevation:24,azimuth:-65,size:3.2}},clouds:!1,milkyWay:.25},sun:[.78,.84,1],fill:["#8C96B8",.4],gnd:["#2A3352",.9],fog:[.15,.185,.3],fogSun:[.22,.26,.4],exposure:1.5,tint:"#eef1ff",shadowTint:"#0c1024",mist:.9,cirrus:["#A4AED0","#39426A"]}},mt=[{name:"teal and gold",pal:["#2A2F3A","#0FA3A3","#2B2F8F","#F2C230","#F7EDB0","#FBFBF5","#E9A7A0"]},{name:"crimson and ivory",pal:["#26262B","#C4162F","#7A1A34","#F3E7C6","#F7EDB0","#FBFBF5","#F0B08A"]},{name:"violet and lime",pal:["#56342A","#7B3FD0","#3C2A86","#B9DC38","#F7EDB0","#FBFBF5","#F2B9A0"]}];function gt(a){const t=a.rng,o=a.vary||{},x={dawn:"dawn",day:"noon",golden:"evening",night:"night"}[o.hour]||t.pick(["dawn","dawn","dawn","noon","evening","evening","night"]),s=t.pick([0,0,0,1,2]),p=t.pick([0,0,1,2]),m=t.pick(["mist","mist","wind","rain"]),S=t.pick(["twenty","twenty","skein","giants"]);return{hour:x,livery:s,pattern:p,weather:m,cast:S,rare:!!o.rare,density:ye(o.density??1,.7,1.3)}}function wt(a,t){const o=ye(t,Fe-110,re+20);return Math.hypot(a-G,t-o)}function Ke(a,t){let o=2.5*Math.sin(t*.021+1.9*Math.sin(a*.0052))*(.62+.38*Math.sin(a*.013+t*.004))-.5;o*=O(45,210,wt(a,t));const b=(1-O(5.5,9,Math.abs(a-G)))*O(re+30,re,t)*O(be-20,be,t);return o-1.5*b}const Ie=`
float laneDist(vec2 w){ float zc = clamp(w.y, ${(Fe-110).toFixed(1)}, ${(re+20).toFixed(1)}); return length(vec2(w.x - ${G.toFixed(1)}, w.y - zc)); }
float laneMask(vec2 w){ return (1. - smoothstep(5.5, 9., abs(w.x - ${G.toFixed(1)})))*(1. - smoothstep(${re.toFixed(1)}, ${(re+30).toFixed(1)}, w.y))*smoothstep(${(be-20).toFixed(1)}, ${be.toFixed(1)}, w.y); }
float groundH(vec2 w){
  float h = 2.5*sin(w.y*0.021 + 1.9*sin(w.x*0.0052))*(0.62 + 0.38*sin(w.x*0.013 + w.y*0.004)) - 0.5;
  h *= smoothstep(45., 210., laneDist(w));
  return h - 1.5*laneMask(w);
}
`,it=`
uniform float uTime, uU, uCamS, uPatSet, uRare;
uniform vec4 uEye[3];        // xy centre (pattern space), z heading, w scale
float tri(float a){ return abs(fract(a) - 0.5)*2.; }
float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
float patField(vec2 p, float t){
  if (uPatSet < 0.5) {
    float sA = sin(6.2832*(dot(p, vec2(0.94, 0.34))/260. - t/5.8));
    vec2 q = vec2(0.9063*p.x + 0.4226*p.y, -0.4226*p.x + 0.9063*p.y);
    float sB = sin(6.2832*((q.y + 210.*tri(q.x/700.))/180. + t/6.));
    float m = smoothstep(-0.2, 0.2, sin(6.2832*dot(p, vec2(0.3, -0.95))/1500. + t/40.));
    return mix(sA, sB, m);
  } else if (uPatSet < 1.5) {
    return sin(6.2832*((p.y + 150.*tri(p.x/300. + 0.25))/150. + t/5.));
  }
  float a = sin(6.2832*(dot(p, vec2(0.8, 0.6))/420. - t/11.));
  float b = sin(6.2832*(dot(p, vec2(-0.6, 0.8))/300. + t/9.));
  return clamp(a*b*1.8, -1., 1.);
}
vec2 PAT(vec2 p, float t){
  float f = patField(p, t);
  float g = smoothstep(-0.2, 0.2, f);
  float o = smoothstep(0.08, 0.3, abs(f));
  for (int i = 0; i < 3; i++) {                       // peacock eyes: rigid, only the centre moves
    vec4 E = uEye[i];
    vec2 d = p - E.xy; float c = cos(E.z), s = sin(E.z);
    vec2 l = vec2(c*d.x + s*d.y, -s*d.x + c*d.y)/(vec2(250., 400.)*max(E.w, 1e-3));
    float e = length(l), e2 = length(l - vec2(0., 0.22));
    float inE = 1. - smoothstep(0.96, 1.0, e);
    float eg = smoothstep(0.43, 0.47, e)*(1. - smoothstep(0.68, 0.72, e));
    float eo = (1. - smoothstep(0.88, 0.92, e))*smoothstep(0.18, 0.22, e2);
    g = mix(g, eg, inE); o = mix(o, eo, inE);
  }
  float s = p.y;                                       // distance down the course
  // the opening front: a chevron pointing at the entry, furled on our side of it until it has passed
  float front = 170. - 555.*uU + 1.15*abs(p.x - 4.)*(1. - smoothstep(0.04, 0.16, uU));
  float behind = smoothstep(front - 6., front + 6., s);
  float crest = behind*(1. - smoothstep(front + 230., front + 330., s));
  float early = 1. - smoothstep(0.17, 0.22, uU);
  o = mix(o, o*behind, early); g = mix(g, 1., crest*early); o = mix(o, 1., crest*early);
  // the lane: ranks stay furled until we are 35 m away, then open in world-fixed 40 m bands
  float nearLane = (1. - smoothstep(24., 34., abs(p.x - ${G.toFixed(1)})))*smoothstep(${(-re-30).toFixed(1)}, ${(-re+10).toFixed(1)}, s)*(1. - smoothstep(${(-Fe-30).toFixed(1)}, ${(-Fe+40).toFixed(1)}, s));
  float band = floor(s/40.);
  float opened = smoothstep(band*40. - 38., band*40. - 30., uCamS);
  // a second wave of opening runs down the lane toward us from the Great Fan, band by band
  opened = max(opened, smoothstep(-6., 6., band*40. + 20. - mix(1300., 1010., smoothstep(0.54, 0.76, uU))));
  float bg = mod(band, 2.);
  nearLane *= smoothstep(0.6, 0.69, uU);
  o = mix(o, opened, nearLane); g = mix(g, bg, nearLane);
  // the gold stripe that crosses the Great Fan and runs on over the plain
  float bx = ${G.toFixed(1)} + (uU - 0.90)*6667.;
  float gb = (1. - smoothstep(52., 68., abs(p.x - bx)))*step(0.84, uU);
  g = mix(g, 1., gb); o = mix(o, 1., gb);
  return vec2(o, g);
}
`,Ce=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uFogCol, uFogSun;
uniform float uFogDen, uFaceSun, uWet;
uniform vec3 uSlate, uFront, uRoot, uGold, uLemon, uRose;
vec3 hemi(float ny){ return mix(uGndCol, uSkyCol, ny*0.5 + 0.5); }
vec3 applyHaze(vec3 c, vec3 w){
  vec3 v = w - cameraPosition; float d = length(v);
  float f = 1. - exp(-(d*uFogDen)*(d*uFogDen));
  float a = max(dot(v/max(d, 1e-3), uSunDir), 0.);
  return mix(c, mix(uFogCol, uFogSun, a*a), f);
}
// the colour a field of fans shows from afar: used by the far cards and the ground paint so they match
// lit = 0 the shaded side of a fan or rank, 1 its sun side; 0.45 is the average of a whole fan
vec3 fanFarLit(float g, float lit){
  vec3 alb = mix(mix(uRoot*0.8, uFront, 0.72)*0.95, uGold*0.75, g);
  vec3 fill = mix(uSkyCol, vec3(dot(uSkyCol, vec3(0.3, 0.55, 0.15))), 0.6)*0.8 + uGndCol*0.55;
  return alb*(uSunCol*mix(0.42, 0.62, g)*mix(0.12, 2.1, lit) + fill*mix(0.78, 1.05, lit));
}
vec3 fanFar(float g){ return fanFarLit(g, 0.45); }
// what a cast shadow does to a colour already lit: darker and blue-slate, never black (sh 0 lit .. 1 deep shade)
vec3 inShade(vec3 c, float sh){ return c*mix(vec3(1.), vec3(0.40, 0.50, 0.78), clamp(sh, 0., 1.)); }
// a furled fan: one dark blade in the hue of the indigo and slate slots (the teal face is folded inside), at 0.78 of the luminance of live's teal blade, the gold reverse a hairline along its sun-side edge
vec3 furledBlade(float rc, float rad, float side){
  float edge = side > 0. ? smoothstep(5.6, 6.4, rc) : 1. - smoothstep(1.6, 2.4, rc);   // the gold reverse of the outer two of the eight pleats, a quarter of the blade (live showed 0.36 of it); live's softness of 0.8 pleat kept
  return mix(mix(uRoot*1.7 + uSlate*2.5, uRoot*1.4 + uSlate*4., rad)*(0.78*dot(mix(uRoot*1.1 + uSlate*0.8, uFront*0.85, 0.3 + 0.45*rad), vec3(0.3, 0.55, 0.15))/max(dot(mix(uRoot*1.7 + uSlate*2.5, uRoot*1.4 + uSlate*4., rad), vec3(0.3, 0.55, 0.15)), 1e-4)), uGold*0.8, edge);   // the body keeps the hue of the indigo and slate slots (indigo 1.7 to 1.4 with slate 2.5 to 4, root to rim) and takes its depth from live's own blade body, the mix of the indigo, slate and teal slots written out here: 0.78 of its luminance by the weights of fanFarLit's fill, one share for every livery and hour (the max only keeps the divisor above zero). So the body stands under live's blade and under the open face beside it whatever the livery, and 0.78 is as low as the share goes while the body the key does not reach, lit by the sky's fill alone, still holds the brief's floor of slate under the dawn's and the noon's light in the teal livery; the gold is live's 0.8, outside the share
}
// which part of a fan the low sun reaches: x across the fan toward the sun (-1..1), h up the fan (0..1)
float fanLit(float x, float h){ return clamp(0.42 + 0.5*x + 0.4*(h - 0.5), 0., 1.); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
}
float fbm3(vec2 p){ return vnoise(p)*0.55 + vnoise(p*2.13 + 7.1)*0.3 + vnoise(p*4.31 + 3.7)*0.15; }
// nearest suitor of the jittered hexagonal lattice: xy = its world xz, z = a 0..1 random
vec3 nearestSuitor(vec2 w){
  float r0 = floor(w.y/${Be.toFixed(6)});
  vec3 best = vec3(0., 0., 0.); float bd = 1e9;
  for (int k = 0; k < 2; k++) {
    float r = r0 + float(k);
    float off = mod(r, 2.)*${(Ve/2).toFixed(2)};
    float c = floor((w.x - off)/${Ve.toFixed(1)} + 0.5);
    vec2 id = vec2(c, r);
    vec2 q = vec2(c*${Ve.toFixed(1)} + off, r*${Be.toFixed(6)}) + (vec2(hash21(id + 3.7), hash21(id + 9.1)) - 0.5)*1.5;
    float d = dot(w - q, w - q);
    if (d < bd) { bd = d; best = vec3(q, hash21(id + 1.3)); }
  }
  return best;
}
`,Qe=`
uniform vec4 uEld[${We}], uEldB[${We}];
// metres outside the nearest elder's body (a capsule from its head to its hind foot); negative inside
float elderDist(vec2 w){
  float best = 1e6;
  for (int i = 0; i < ${We}; i++) {
    vec4 E = uEld[i];
    float c = cos(E.w), s = sin(E.w);
    vec2 d = (w - E.xy)/max(E.z, 1e-3);
    vec2 l = vec2(c*d.x - s*d.y, s*d.x + c*d.y);
    best = min(best, (length(vec2(l.x, l.y - clamp(l.y, -92., 30.))) - 52.)*E.z);
  }
  return best;
}
// striped shade of the elders' fans at a world point: 0 lit .. 1 shaded
float elderShadow(vec3 wp, vec3 sun){
  float sh = 0.;
  for (int i = 0; i < ${We}; i++) {
    vec4 E = uEld[i], B = uEldB[i];
    float c = cos(E.w), s = sin(E.w);
    vec3 d = (wp - vec3(E.x, B.z, E.y))/max(E.z, 1e-3);
    vec3 p = vec3(c*d.x - s*d.z, d.y, s*d.x + c*d.z);
    vec3 sl = vec3(c*sun.x - s*sun.z, sun.y, s*sun.x + c*sun.z);
    float lz = abs(sl.z) < 0.03 ? (sl.z < 0. ? -0.03 : 0.03) : sl.z;
    float t = -p.z/lz;
    vec2 q = p.xy + sl.xy*t - vec2(0., 30.);
    float rho = length(q), ang = atan(q.x, q.y + 1e-4);
    float pen = clamp(t*0.035, 0.6, 14.);
    float inside = step(0., t)*smoothstep(8., 12., rho)*(1. - smoothstep(117. - pen, 117. + 0.3*pen, rho))*(1. - smoothstep(B.x - 0.004*pen, B.x + 0.004*pen + 0.01, abs(ang)));
    float a = fract((ang/max(B.x, 1e-3)*0.5 + 0.5)*B.y);
    float stripe = mix(mix(0.5, 0.88, smoothstep(0.42, 0.58, a)), 0.68, clamp(t/300., 0., 1.));
    float core = step(0., t)*(1. - smoothstep(9., 13., rho))*0.8;
    sh = max(sh, max(inside*stripe, core));
  }
  return sh;
}
`;function xt(){const a=[0];let t=0,o=1.5;for(;t<3600;)t>=12&&(o=Math.min(o*1.28,t<500?36:420)),t+=o,a.push(t);const b=[...a.slice(1).reverse().map(f=>G-f),...a.map(f=>G+f)],x=[];let s=760;for(o=300;s>80;)x.push(s),s-=Math.max(10,Math.min(260,(s-60)*.4));for(s=80;s>-1460;s-=20)x.push(s);for(o=20;s>-6200;)x.push(s),o=Math.min(o*1.3,500),s-=o;const p=b.length,m=x.length,S=new Float32Array(p*m*3),P=[];for(let f=0;f<m;f++)for(let g=0;g<p;g++){const F=(f*p+g)*3;S[F]=b[g],S[F+1]=Ke(b[g],x[f]),S[F+2]=x[f]}for(let f=0;f<m-1;f++)for(let g=0;g<p-1;g++){const F=f*p+g,z=F+1,M=F+p,C=M+1;P.push(F,z,M,z,C,M)}const v=new e.BufferGeometry;return v.setAttribute("position",new e.BufferAttribute(S,3)),v.setIndex(P),v.boundingSphere=new e.Sphere(new e.Vector3(G,0,-2700),6e3),v}function yt(a,t){return new e.ShaderMaterial({uniforms:a,vertexShader:`
      varying vec3 vW;
      void main(){ vW = (modelMatrix*vec4(position, 1.)).xyz; gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.); }`,fragmentShader:`
      varying vec3 vW;
      uniform vec3 uHeroPos; uniform float uUnfurl, uPaintNear, uPaintFar, uMist;
      uniform vec3 uFoot[6]; uniform float uShadowK;
      ${it}
      ${Ce}
      ${Ie}
      ${t}
      ${Qe}
      // a giant three-toed print: x = distance to the nearest toe (cell units), y = 1 where this cell holds a print
      vec2 giantToe(vec2 gc, float wob){
        vec2 gi = floor(gc); vec2 gf = fract(gc) - 0.5 - (vec2(hash21(gi + 1.7), hash21(gi + 8.3)) - 0.5)*0.45;
        float gt = min(min(length((gf - vec2(0., 0.15))*vec2(1.7, 1.)), length((gf - vec2(0.15, -0.03))*vec2(1., 1.5))), length((gf - vec2(-0.15, -0.03))*vec2(1., 1.5)));
        return vec2(gt + wob, step(0.4, hash21(gi + 4.1)));
      }
      float giantH(vec2 t){ return (smoothstep(0.07, 0.135, t.x) + 0.45*smoothstep(0.1, 0.15, t.x)*(1. - smoothstep(0.15, 0.24, t.x)))*t.y + (1. - t.y); }
      // 1 where no suitor stands (the display lane, the Great Fan's footprints with a ragged fringe, the elders)
      float gone(vec2 q, float rnd){
        float g = (1. - step(9.6, abs(q.x - ${G.toFixed(1)})))*step(q.y, ${(re+12).toFixed(1)})*step(${(be-30).toFixed(1)}, q.y);
        for (int i = 0; i < 6; i++) g = max(g, 1. - step(uFoot[i].z + 2. + (rnd - 0.5)*9., length(q - uFoot[i].xy)));
        return max(g, 1. - smoothstep(0., 4., elderDist(q)));
      }
      void main(){
        vec2 w = vW.xz; vec2 p = vec2(w.x, -w.y);
        float dist = length(vW - cameraPosition);
        float e = 0.6;
        float h0 = groundH(w);
        vec3 n = normalize(vec3(h0 - groundH(w + vec2(e, 0.)), e, h0 - groundH(w + vec2(0., e))));
        float fw = max(fwidth(w.x), fwidth(w.y));
        // ---- near ground: slate, courts, lichen, litter, worn lanes
        float lod = 1. - smoothstep(0.25, 0.9, fw);
        float n1 = fbm3(w*0.11), n2 = fbm3(w*1.3 + 11.), n3 = vnoise(w*7.);
        vec3 alb = mix(uSlate, vec3(dot(uSlate, vec3(0.33))), 0.35)*mix(2.9, 4.7, n1) + uRoot*0.05*n2;
        alb *= mix(1., 0.72 + 0.56*n2, lod)*mix(1., 0.8 + 0.4*n3, lod*lod);
        vec3 su = nearestSuitor(w);
        float dc = length(w - su.xy);
        float court = 1. - smoothstep(0.55, 0.95, dc + (n2 - 0.5)*0.35);
        float ring = smoothstep(0.7, 0.95, dc + (n2 - 0.5)*0.5)*(1. - smoothstep(1.05, 1.7, dc + (n3 - 0.5)*0.6));
        float lane = laneMask(w);
        // where the Great Fan stands and crouches the ground is trampled bare: no courts, no ranks
        float footM = 0.;
        for (int i = 0; i < 6; i++) footM = max(footM, 1. - smoothstep(uFoot[i].z - 4., uFoot[i].z + 7., length(w - uFoot[i].xy) + (n2 - 0.5)*7.));
        float eldM = 1. - smoothstep(-5., 6., elderDist(w) + (n2 - 0.5)*9.);
        footM = max(footM, eldM);
        float keep = (1. - lane)*lod*(1. - footM)*(1. - gone(su.xy, su.z));
        alb = mix(alb, uSlate*2.3 + uRoot*0.12, court*keep);
        alb = mix(alb, mix(uLemon, uSlate*3., 0.3)*(0.6 + 0.5*n3), ring*keep*0.75);
        float litter = step(0.93, vnoise(w*21. + su.z*40.))*(1. - smoothstep(0.6, 2.3, dc));
        alb = mix(alb, uGold*0.8, litter*keep*(1. - smoothstep(0.03, 0.12, fw)));
        alb *= mix(1., 0.76, uWet);
        // the display lane and the Fan's own ground: pale stamped earth, three-toed tracks, strewn scales
        vec3 earth = mix(uSlate*3.4, uLemon*0.62, 0.5)*(0.72 + 0.4*n2)*(0.86 + 0.24*n1);
        vec2 tc = w*vec2(0.9, 0.7); vec2 ti = floor(tc); vec2 tf = fract(tc) - 0.5 - (vec2(hash21(ti), hash21(ti + 5.)) - 0.5)*0.5;
        float toe = min(min(length(tf - vec2(0., 0.16)), length(tf - vec2(0.13, -0.02))), length(tf - vec2(-0.13, -0.02)));
        float track = (1. - smoothstep(0.05, 0.09, toe))*step(0.45, hash21(ti + 2.2));
        earth *= 1. - 0.4*track*(1. - smoothstep(0.02, 0.08, fw));
        earth = mix(earth, uGold*0.8, step(0.955, vnoise(w*17.))*(1. - smoothstep(0.03, 0.1, fw)));
        // scuffed and dragged where the great body shifts: long drag marks, dusty and damp patches, deep prints
        // whose far wall takes the low sun and whose near wall is in shade, drifts of shed gold scales
        float drag = fbm3(w*0.055 + 4.) - 0.5, drag2 = vnoise(vec2(w.x*0.16 + n1*3., w.y*0.035));
        float scuff = vnoise(vec2(dot(w, vec2(0.92, 0.39))*0.05 + n1*2., dot(w, vec2(-0.39, 0.92))*0.55)) - 0.5;
        float scuff2 = vnoise(vec2(dot(w, vec2(0.5, 0.87))*0.9, dot(w, vec2(-0.87, 0.5))*0.07 + n2*2.)) - 0.5;
        earth *= 1. + (0.7*drag + 0.3*(drag2 - 0.5) + 0.5*scuff + 0.3*scuff2*(1. - smoothstep(0.1, 0.5, fw)))*footM;
        earth = mix(earth, earth*vec3(1.22, 1.16, 0.9), smoothstep(0.1, 0.4, drag)*footM*0.7);
        earth = mix(earth, earth*vec3(0.62, 0.68, 0.86), smoothstep(0.08, 0.35, -drag)*footM*0.7);
        vec2 gc = w*vec2(0.058, 0.047), sdir = uSunDir.xz/max(length(uSunDir.xz), 1e-3);
        float gwob = (n2 - 0.5)*0.03;
        vec2 g0 = giantToe(gc, gwob), g1 = giantToe(gc + sdir*vec2(0.058, 0.047)*0.9, gwob);
        float giant = (1. - smoothstep(0.075, 0.13, g0.x))*g0.y*footM;
        float slope = clamp((giantH(g1) - giantH(g0))*1.6, -1., 1.)*footM;           // rising toward the sun: that wall is in shade
        earth *= (1. - 0.5*giant)*(1. - 0.6*max(slope, 0.) + 0.85*max(-slope, 0.));
        // older, smaller prints trodden over one another, and a pebbled crust
        vec2 mc = w*vec2(0.21, 0.17) + 7.3;
        vec2 m0 = giantToe(mc, gwob*2.), m1 = giantToe(mc + sdir*vec2(0.21, 0.17)*0.3, gwob*2.);
        float mslope = clamp((giantH(m1) - giantH(m0))*1.3, -1., 1.)*footM;
        earth *= (1. - 0.3*(1. - smoothstep(0.075, 0.13, m0.x))*m0.y*footM)*(1. - 0.42*max(mslope, 0.) + 0.55*max(-mslope, 0.));
        earth *= 1. + ((vnoise(w*2.7 + 3.) - 0.5)*0.8 + (vnoise(w*0.9 + 13.) - 0.5)*0.75)*footM*(1. - smoothstep(0.2, 0.8, fw));
        // loose stones kicked out of the prints, each with a sunlit cheek and a short shadow
        vec2 stc = w*0.7 + 2.9, sti = floor(stc), stf = fract(stc) - 0.5;
        vec2 sto = (vec2(hash21(sti + 1.7), hash21(sti + 9.2)) - 0.5)*0.5;
        float strad = 0.08 + 0.15*hash21(sti + 3.3);
        float ston = step(0.42, hash21(sti + 5.1))*footM*(1. - smoothstep(0.12, 0.4, fw));
        float stone = 1. - smoothstep(strad*0.75, strad, length(stf - sto));
        float stsh = (1. - smoothstep(strad*0.6, strad*1.6, length(stf - sto + sdir*strad)))*(1. - stone);
        earth *= 1. - 0.5*stsh*ston;
        earth = mix(earth, (earth*0.6 + uFogCol*0.3)*(1.05 + 0.6*clamp(dot(stf - sto, sdir)/strad, -1., 1.)), stone*ston);
        float drift = smoothstep(0.52, 0.7, fbm3(w*0.085 + 21.))*footM;
        earth = mix(earth, uGold*(0.5 + 0.5*n3), drift*(0.25 + 0.6*step(0.55, vnoise(w*4.3 + 9.))*(1. - smoothstep(0.2, 0.7, fw))));
        alb = mix(alb, earth*mix(1., 0.86, uWet), max(lane, footM*0.9));
        // ---- light
        float ndl = max(dot(n, uSunDir), 0.);
        vec2 og = PAT(p, uTime);
        float castSh = max(greatFanShadow(vW - uHeroPos, uSunDir, uUnfurl), elderShadow(vW, uSunDir));
        float gfs = 1. - castSh*0.8;
        // every fan lays a long shadow away from the sun: two soft lobes per suitor, resolved near the lens,
        // settling to their average (with a grain along the ranks) where they are too small to see
        vec2 shd = -uSunDir.xz/max(length(uSunDir.xz), 1e-3), shp = vec2(-shd.y, shd.x);
        float sl = mix(3.4, 4.6, og.x)*clamp(0.24/max(uSunDir.y, 0.05), 0.3, 1.15), sw = mix(0.42, 1.9, og.x);
        float o1 = 0.3 + sl*0.5, o2 = 0.3 + sl*1.5;
        vec3 s1 = nearestSuitor(w - shd*o1), s2 = nearestSuitor(w - shd*o2);
        vec2 d1 = w - s1.xy - shd*o1, d2 = w - s2.xy - shd*o2;
        float f1 = (1. - smoothstep(0.5, 1., length(vec2(dot(d1, shd)/(sl*0.5 + 0.5), dot(d1, shp)/sw))))*(1. - gone(s1.xy, s1.z));
        float f2 = (1. - smoothstep(0.45, 1., length(vec2(dot(d2, shd)/(sl*0.5 + 0.5), dot(d2, shp)/(sw*0.8)))))*(1. - gone(s2.xy, s2.z));
        float ranks = 0.5 + 0.5*sin(dot(w, shp)*1.2 + n1*6.);
        float fAvg = (0.16 + 0.5*og.x)*(0.7 + 0.6*ranks)*(1. - lane)*(1. - footM);
        float fsh = mix(max(f1, f2*0.85), fAvg, smoothstep(0.6, 2.0, fw));
        float shade = gfs*(1. - uShadowK*fsh);
        float under = smoothstep(0.55, 1., footM)*(1. - 0.55*eldM);                 // close under the great body: sky cut off
        shade *= 1. - 0.6*under;
        vec3 col = alb*(uSunCol*ndl*shade*2.7 + hemi(n.y)*mix(0.8, 1., shade)*(1. - 0.3*under) + uGndCol*0.8);
        col += uWet*uSkyCol*0.10*pow(clamp(1. - max(dot(normalize(cameraPosition - vW), n), 0.), 0., 1.), 3.);
        // between open fans the ground stands in their shade and takes their colour: deep gold or teal, not grey holes
        col = mix(col, fanFarLit(og.y, 0.08)*gfs, og.x*0.6*(1. - lane)*(1. - footM)*smoothstep(0.1, 0.5, fw + 0.1));
        // ---- far paint: the pattern itself, ruled with lit and shaded ranks, rising where the cards shrink away
        float paint = smoothstep(uPaintNear, uPaintFar, dist)*(1. - lane);
        float rl = abs(fract(w.y/${Be.toFixed(4)}) - 0.5)*2.;
        float fy = fwidth(w.y/${Be.toFixed(4)});
        float litRow = mix(0.45, smoothstep(0.1, 0.62, rl), 1. - smoothstep(0.25, 0.8, fy));
        litRow = clamp(litRow + (vnoise(vec2(w.x*0.025, w.y/13.)) - 0.5)*0.55*(1. - smoothstep(1., 3., fy)) + (n1 - 0.5)*0.25, 0., 1.);
        // furled ranks from afar: furrows of indigo shade ruled with the gold hairlines of the waiting blades (hair, and the furl that reads it); under OPEN ranks the paint keeps live's furl whole (furlO, on live's blade): the two are mixed by the rank's own open state og.x. The furrow's tone is the indigo slot at 1.18 with the slate slot at 6.41, darkened by the blade's own share 0.78 on that tone alone (the earth in the furrow and the gold keep their light); the gold covers 0.18 of a ruled rank and 0.18 of a merged one (live 0.36 and 0.3) as the blade's gold is a hairline. These numbers hold the paint, channel by channel, as near the furled card as the four hours' lights and the three liveries allow together: never further than live's paint stood from live's card at its furthest, and no further than live's in nine of the twelve hours and liveries (further in the violet livery at noon and evening and in the teal at night)
        float blade = mix(0.3, smoothstep(0.5, 0.78, rl), 1. - smoothstep(0.25, 0.8, fy))*(0.75 + 0.5*n2), hair = mix(0.18, smoothstep(0.68, 0.96, rl), 1. - smoothstep(0.25, 0.8, fy))*(0.75 + 0.5*n2);
        vec3 furlO = mix(mix(alb*0.5, uRoot*0.8 + uFront*0.55, 0.6)*(hemi(1.) + uGndCol*0.8), uGold*0.72*(uSunCol*0.8 + hemi(1.)*0.5), blade*0.8), furl = mix(mix(mix(alb*0.5, (uRoot*1.18 + uSlate*6.41)*0.78, 0.6)*(hemi(1.) + uGndCol*0.8), uGold*0.72*(uSunCol*0.8 + hemi(1.)*0.5), hair*0.8), furlO, og.x);
        vec3 pc = mix(furl, fanFarLit(og.y, litRow), 0.86*og.x)*gfs;
        col = mix(col, pc, paint);
        col = inShade(col, castSh*0.8);
        // ---- mist pooled in the swales
        float mist = (1. - smoothstep(-3.1, -0.6, vW.y + (n1 - 0.5)*1.2 - 1.5*lane))*uMist*(1. - lane);
        float sunward = max(dot(normalize(vW - cameraPosition), uSunDir), 0.);
        col = mix(col, mix(uFogCol, uFogSun, 0.45 + 0.55*sunward)*1.1, mist*0.4);
        gl_FragColor = vec4(applyHaze(col, vW), 1.);
      }`})}function rt(a,t=1){const o=[],b=[],x=[],s=[],p=[],m=(r,i=1)=>[r.r*i,r.g*i,r.b*i],S=m(a[0].clone().lerp(a[2],.5),4.75),P=m(a[0].clone().lerp(a[4],.3),4.2),v=m(a[0],2.2),f=m(a[4].clone().lerp(a[0],.3),.85),g=m(a[6],1),F=(r,i,y,l)=>(o.push(r[0],r[1],r[2]),b.push(i[0],i[1],i[2]),x.push(y[0],y[1],y[2]),s.push(l),o.length/3-1),z=new e.Vector3,M=new e.Vector3,C=new e.Vector3,D=new e.Vector3,d=new e.Vector3,te=(r,i,y=!0)=>{const l=o.length/3;r.forEach((u,$)=>{z.fromArray(r[Math.max($-1,0)]),M.fromArray(r[Math.min($+1,r.length-1)]),C.subVectors(M,z).normalize(),D.set(0,1,0).cross(C),D.lengthSq()<1e-4&&D.set(1,0,0),D.normalize(),d.crossVectors(C,D);for(let U=0;U<i;U++){const le=U/i*Math.PI*2+(i===4?Math.PI/4:0),oe=Math.cos(le),X=Math.sin(le),ze=[u[0]+D.x*oe*u[3]+d.x*X*u[4],u[1]+D.y*oe*u[3]+d.y*X*u[4],u[2]+D.z*oe*u[3]+d.z*X*u[4]],H=[D.x*oe+d.x*X,D.y*oe+d.y*X,D.z*oe+d.z*X];if(y&&($===0||$===r.length-1)){const ge=$===0?-.7:.7;H[0]+=C.x*ge,H[1]+=C.y*ge,H[2]+=C.z*ge}const me=Math.hypot(H[0],H[1],H[2])||1;F(ze,[H[0]/me,H[1]/me,H[2]/me],u[5],u[6]??0)}});for(let u=0;u<r.length-1;u++)for(let $=0;$<i;$++){const U=l+u*i+$,le=l+u*i+($+1)%i;p.push(U,le,U+i,le,le+i,U+i)}};te([[0,1.02,-.78,.05,.05,v],[0,1.08,-.62,.3,.26,S],[0,1,-.2,.46,.4,S],[0,.9,.25,.42,.36,S],[0,.82,.56,.24,.22,S],[0,.8,.68,.05,.05,S]],6),te([[0,.84,.5,.17,.17,S],[0,.82,.86,.13,.14,S],[0,.98,1.16,.1,.12,P],[0,1.12,1.36,.09,.1,P]],4,!1),te([[0,1.1,1.3,.08,.09,P],[0,1.15,1.44,.14,.13,S],[0,1.1,1.68,.085,.075,v],[0,1.05,1.9,.02,.025,g]],4),te([[0,.72,.58,.02,.02,g,4],[0,.66,.9,.17,.16,g,4],[0,.9,1.26,.02,.02,g,4]],4,!1);for(const r of[-1,1]){const i=[r*.145,1.17,1.46],y=[r,.15,.1],l=o.length/3,u=.1;F([i[0],i[1]-u,i[2]-u],y,[-1,-1,0],5),F([i[0],i[1]-u,i[2]+u],y,[1,-1,0],5),F([i[0],i[1]+u,i[2]+u],y,[1,1,0],5),F([i[0],i[1]+u,i[2]-u],y,[-1,1,0],5),p.push(l,l+1,l+2,l,l+2,l+3)}const V=(r,i,y)=>te([[...r,.16,.16,S],[...i,.1,.1,f],[...y,.065,.065,P],[y[0]*1.06,0,y[2]+(y[2]>0?.2:-.2),.15,.04,f]],3,!1);V([-.3,.86,.3],[-.78,.7,.5],[-.92,.05,.62]),V([.3,.86,.3],[.78,.7,.5],[.92,.05,.62]),V([0,.95,-.55],[0,.72,-1.05],[0,.05,-1.5]);const k=(r,i,y,l)=>F([r,i,y],[0,0,1],[0,0,0],l);for(let r=0;r<=8;r++){const i=o.length/3,y=[.1,1.5,3],l=[.055,.04,.02];y.forEach(($,U)=>{k(r,$,-l[U],1),k(r,$,l[U],1)}),p.push(i,i+1,i+2,i+1,i+3,i+2,i+2,i+3,i+4,i+3,i+5,i+4);const u=o.length/3;k(r,2.9,-.035,3),k(r,3.12,-.12,3),k(r,3.3,0,3),k(r,3.12,.12,3),k(r,2.9,.035,3),p.push(u,u+1,u+4,u+1,u+3,u+4,u+1,u+2,u+3)}for(let r=0;r<8;r++){const i=o.length/3;for(const y of[.22,1.7,2.92])for(const l of[.001,.5,.999])k(r+l,l===.5&&y>2?y-.36:y,0,2);for(let y=0;y<2;y++)for(let l=0;l<2;l++){const u=i+y*3+l;p.push(u,u+1,u+3,u+1,u+4,u+3)}}const ie=new e.InstancedBufferGeometry,N=new Float32Array(o);if(t!==1)for(let r=0;r<N.length;r+=3)(s[r/3]===0||s[r/3]>=4)&&(N[r]*=t,N[r+1]*=t,N[r+2]*=t);return ie.setAttribute("position",new e.BufferAttribute(N,3)),ie.setAttribute("normal",new e.BufferAttribute(new Float32Array(b),3)),ie.setAttribute("aCol",new e.BufferAttribute(new Float32Array(x),3)),ie.setAttribute("aKind",new e.BufferAttribute(new Float32Array(s),1)),ie.setIndex(p),ie}function bt(a,t,o,b=Ve,x=Be,s=1,p=null){const m=[];for(let S=0;S<o;S++)for(let P=0;P<t;P++)s<1&&p&&p()>s||m.push(P*b+S%2*b*.5,S*x);return a.setAttribute("aCell",new e.InstancedBufferAttribute(new Float32Array(m),2)),a.instanceCount=m.length/2,a.boundingSphere=new e.Sphere(new e.Vector3,1e5),{tile:new e.Vector2(t*b,o*x),count:m.length/2}}const et=`
attribute vec2 aCell;
uniform vec3 uCentre, uCentreA, uCentreB;
uniform vec2 uTile, uTileA, uTileB;
uniform vec3 uFoot[6];
uniform float uCoarse, uGust, uSize, uJuv, uBodyK;
uniform vec3 uSunDir;
${it}
${Ie}
${Qe}
// sDir/sRight: toward the lens. sBDir/sBRight: the body, turned a quarter away so it is seen in three-quarter
// view. sFR/sUp/sNrm: the fan's frame. sSide: how far the fan's +x points at the sun (-1..1).
vec3 sBase, sDir, sRight, sUp, sNrm, sFR, sBDir, sBRight; float sRnd, sOpen, sGold, sShow, sTrans, sDist, sSide, sEld;
float fanLitV(float x, float h){ return clamp(0.42 + 0.5*x + 0.4*(h - 0.5), 0., 1.); }
float cheb(vec2 w, vec3 c, vec2 tile){ vec2 d = abs(w - c.xz)/(tile*0.5); return max(d.x, d.y); }
void placeSuitor(float level){
  vec2 w0 = aCell + floor((uCentre.xz - aCell)/uTile + 0.5)*uTile;
  float rw = ${Be.toFixed(6)}*uCoarse, pw = ${Ve.toFixed(1)}*uCoarse;
  float r = floor(w0.y/rw + 0.5), off = mod(r, 2.)*pw*0.5, c = floor((w0.x - off)/pw + 0.5);
  vec2 id = vec2(c, r) + (uCoarse - 1.)*71.;
  vec2 q = vec2(c*pw + off, r*rw) + (vec2(hash21(id + 3.7), hash21(id + 9.1)) - 0.5)*1.5*uCoarse;
  sRnd = hash21(id + 1.3);
  sBase = vec3(q.x, groundH(q), q.y);
  // which lattice shows this ground: A near, B middle, C far, each fading at its tile edge
  float eA = cheb(q, uCentreA, uTileA), eB = cheb(q, uCentreB, uTileB), eS = cheb(q, uCentre, uTile);
  float show = 1. - smoothstep(0.84, 0.98, eS);
  if (level > 0.5) show *= smoothstep(0.82, 0.96, eA);
  if (level > 1.5) show *= smoothstep(0.82, 0.96, eB);
  float lane = (1. - step(9.6, abs(q.x - ${G.toFixed(1)})))*step(q.y, ${(re+12).toFixed(1)})*step(${(be-30).toFixed(1)}, q.y);
  show *= 1. - lane;
  for (int i = 0; i < 6; i++) show *= step(uFoot[i].z + 2.*uCoarse + (sRnd - 0.5)*9., length(q - uFoot[i].xy));
  show *= smoothstep(0., 4., elderDist(q));
  sShow = show;
  sEld = elderShadow(sBase + vec3(0., 2., 0.), uSunDir);
  vec2 og = PAT(vec2(q.x, -q.y), uTime - sRnd*0.25);
  if (uJuv > 0.5) {                                    // juveniles: absolute positions in the lane, running and flicking stub fans
    sRnd = hash21(aCell*0.37);
    float ph = uTime*(0.5 + 0.5*sRnd) + sRnd*40.;
    float flee = 1. - smoothstep(6., 46., abs(-aCell.y - uCamS - 14.));
    q = aCell + vec2((2.6*sin(ph*0.7) + flee*sign(aCell.x - ${G.toFixed(1)})*3.)*0.8, 7.*sin(ph*0.45) - flee*9.);
    q.x = clamp(q.x, ${(G-5.2).toFixed(1)}, ${(G+5.2).toFixed(1)});
    sBase = vec3(q.x, groundH(q) + 0.12*abs(sin(ph*9.)), q.y);
    sShow = 1.;
    og = vec2(0.5 + 0.5*sin(uTime*(2.2 + 2.*sRnd) + sRnd*20.), step(0.5, fract(sRnd*7. + floor(uTime*0.35 + sRnd*3.)*0.5)));
  }
  sOpen = og.x; sGold = og.y; sTrans = 4.*og.x*(1. - og.x);
  vec3 toC = cameraPosition - sBase; float hd = max(length(toC.xz), 1e-3);
  sDist = length(toC);
  sDir = vec3(toC.x/hd, 0., toC.z/hd);
  sRight = vec3(sDir.z, 0., -sDir.x);
  float lean = clamp(atan(toC.y - 1.5, hd), 0.26, 1.22);
  lean += uGust*sOpen*(0.22*sin(dot(q, vec2(0.045, 0.027)) - uTime*1.9) + 0.10*sin(dot(q, vec2(-0.02, 0.07)) - uTime*2.7));
  // furled, the blade stands slim and raked back, turned a little along the rank line (a world-fixed direction),
  // so ranks of furled fans read as rows of gold-edged blades; opening, it swings round to face the flock
  float fo = max(smoothstep(0., 0.6, sOpen), uJuv);
  vec3 back = mix(vec3(0.94, 0., -0.34), -sDir, max(fo, 0.65)) + vec3(0., 0., -0.03);
  // waiting is not standing still: furled blades rock and twist in slow waves that run along the ranks
  float rest = (1. - fo)*(1. - uJuv);
  back += vec3(-back.z, 0., back.x)*rest*0.34*sin(dot(q, vec2(-0.031, 0.06)) + uTime*1.7 + sRnd*5.);
  back /= max(length(back), 1e-4);
  lean = mix(0.62 + 0.25*(sRnd - 0.5), lean, fo);
  lean += rest*0.15*(sin(dot(q, vec2(0.07, 0.043)) - uTime*2.2) + 0.5*sin(uTime*3.4 + sRnd*40.));
  sFR = vec3(-back.z, 0., back.x);
  sUp = vec3(0., cos(lean), 0.) + back*sin(lean);
  sNrm = -back*cos(lean) + vec3(0., sin(lean), 0.);
  float ya = (sRnd > 0.5 ? 0.82 : -0.82)*(1. - 0.4*uJuv);
  sBDir = sDir*cos(ya) + sRight*sin(ya);
  sBRight = vec3(sBDir.z, 0., -sBDir.x);
  vec2 sf = uSunDir.xz/max(length(uSunDir.xz), 1e-3);
  sSide = dot(sFR.xz, sf);
}
`,lt="float flipPhase(float k, float g){ return smoothstep(k/12., k/12. + 0.34, g); }";function ct(a,t,o){return new e.ShaderMaterial({uniforms:Object.assign({},a,t),side:e.DoubleSide,vertexShader:`
      attribute vec3 aCol; attribute float aKind;
      varying vec3 vW, vN, vT, vCol; varying vec4 vFan; varying vec4 vState; varying vec2 vEld;
      ${et}
      ${lt}
      void main(){
        placeSuitor(0.);
        float size = (0.88 + 0.26*sRnd)*uSize*sShow;
        float openK = mix(0.23, 1., sOpen);
        float rise = 0.3*sOpen + 0.07*sTrans*abs(sin(uTime*13. + sRnd*30.));
        vec3 P, N; vT = sRight; vFan = vec4(0., 0., aKind, 0.); float lit = 0.5;
        if (aKind < 0.5 || aKind > 3.5) {
          vec3 lp = position; vec3 ln = normal;
          if (aKind > 3.5 && aKind < 4.5) lp += ln*0.07*sOpen*(0.8 + 0.2*sin(uTime*5. + sRnd*20.));
          lp.y += rise*smoothstep(0., 0.6, lp.y);
          P = sBase + (sBRight*lp.x + vec3(0., lp.y, 0.) + sBDir*lp.z)*size;
          N = sBRight*ln.x + vec3(0., ln.y, 0.) + sBDir*ln.z;
        } else {
          float rc = position.x, rad = position.y, lat = position.z;
          float k = min(floor(rc), 7.), fr = rc - k, ph = 0.;
          if (aKind > 1.5 && aKind < 2.5) { ph = flipPhase(k, sGold); fr *= abs(cos(3.14159*ph)); }
          else { k = rc; fr = 0.; }
          float th = ((k + fr)/8. - 0.5)*2.967*openK;
          th += 0.05*sTrans*sin(uTime*56. + sRnd*40.) + 0.012*sin(uTime*2.3 + sRnd*17. + rc)*sOpen;
          vec3 R = sFR*sin(th) + sUp*cos(th), T = sFR*cos(th) - sUp*sin(th);
          float depth = (aKind > 1.5 && aKind < 2.5) ? -0.15*rad*sin(3.14159*clamp(fr, 0., 1.))*openK : 0.035;
          vec3 pivot = sBase + (vec3(0., 1.1*uBodyK + rise, 0.) - sBDir*0.52*uBodyK)*size;
          lit = fanLitV(sin(th)*rad/2.4*sSide, cos(th)*rad/3.);
          P = pivot + (R*rad + T*lat + sNrm*depth)*size;
          N = sNrm; vT = T; vFan = vec4(rc, rad/3., aKind, ph);
        }
        vW = P; vN = N; vCol = aCol; vState = vec4(sOpen, sGold, sRnd, lit); vEld = vec2(sEld, sSide);
        gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.);
      }`,fragmentShader:`
      varying vec3 vW, vN, vT, vCol; varying vec4 vFan; varying vec4 vState; varying vec2 vEld;
      uniform float uTime, uUnfurl; uniform vec3 uHeroPos;
      float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
      ${Ce.replace(/vec3 nearestSuitor[\s\S]*$/,"")}
      ${o}
      void main(){
        float kind = vFan.z;
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); vec3 alb; float trans = 0.; float gloss = 0.;
        vec3 V = normalize(cameraPosition - vW);
        float dist = length(cameraPosition - vW);
        // what is too small to draw settles to the colour of the fan it belongs to, never to black specks
        float farB = smoothstep(40., 105., dist), farK = smoothstep(0.35, 1.3, fwidth(vFan.y)*6.);
        float openK = smoothstep(0.02, 0.26, vState.x);
        if (kind < 0.5 || (kind > 3.5 && kind < 4.5)) {
          alb = vCol*mix(0.8 + 0.4*hash21(floor(vW.xy*9.) + floor(vW.z*9.)), 1., farB);
        } else if (kind > 4.5) {
          float rr = length(vCol.xy); if (rr > 1.) discard;
          alb = rr > 0.5 ? uRose*0.95 : mix(vec3(0.02), uSlate*3., smoothstep(14., 38., dist));
        } else if (kind < 1.5) {
          alb = mix(uSlate*0.9, uLemon*0.5, 1. - smoothstep(0.06, 0.16, vFan.y));
          alb = mix(alb, uLemon*0.45, (1. - smoothstep(0.02, 0.05, abs(fract(vFan.y*5.) - 0.5)))*0.6);
          alb = mix(alb, furledBlade(vFan.x, vFan.y, vEld.y)*1.15, (1. - vState.x)*0.85);
          trans = farK*openK;
        } else if (kind > 2.5) {
          alb = mix(uRose*0.9, uLemon*0.7, 0.25);
        } else {
          float rc = vFan.x, fr = fract(rc), rad = vFan.y;
          float gold = step(0.5, vFan.w);
          float s = fr < 0.5 ? 1. : -1.;
          n = normalize(n + vT*s*0.85*smoothstep(0., 0.3, vState.x));
          float vein = (1. - smoothstep(0.03, 0.09, abs(fract(fr*4. + 0.5) - 0.5)))*(1. - farK);
          float ringB = 0.5 + 0.5*sin(rad*34. + sin(rc*3.)*1.5);
          float grain = hash21(floor(vec2(rc*24., rad*60.)));
          vec3 front = mix(uRoot*0.8, uFront, smoothstep(0.08, 0.62, rad))*(0.82 + 0.25*ringB);
          front = mix(front, uRoot*0.5, vein*0.5);
          float eyeSpot = 1. - smoothstep(0.05, 0.085, length(vec2((fr - 0.5)*0.55, rad - 0.8)));
          front = mix(front, uGold*0.75, eyeSpot*0.9);
          vec3 back = uGold*0.75*(0.78 + 0.3*grain)*(0.85 + 0.2*ringB);
          back = mix(back, uGold*0.35, vein*0.35);
          alb = mix(front, back, gold);
          alb = mix(furledBlade(rc, rad, vEld.y), alb, openK);                          // furled: one slim blade, gold along its sun edge
          trans = 1.; gloss = 1. - gold;
        }
        if (dot(n, V) < 0.) n = -n;
        float castSh = max(greatFanShadow(vW - uHeroPos, uSunDir, uUnfurl), vEld.x);
        float gsh = 1. - castSh*0.8;
        float ndl = dot(n, uSunDir);
        // the low sun reaches the sun-side, upper part of each fan; the rest stands in its neighbour's shade
        float lk = mix(1., mix(0.3, 1.75, vState.w), trans)*gsh;
        vec3 col = alb*(uSunCol*max(ndl, 0.)*lk + hemi(n.y)*mix(1., mix(0.82, 1.08, vState.w), trans)*(0.62 + 0.38*gsh) + uGndCol*0.7*(1. - trans));
        float g2 = clamp(dot(n, normalize(vec3(uSunDir.x, uSunDir.y + 0.62, -0.3*uSunDir.z) + vec3(0., 1e-4, 0.)))*0.75 + 0.25, 0., 1.);
        col += alb*uSunCol*0.42*g2*g2*(1. - trans)*gsh;                           // the bright sun-side sky on hide and bone
        // the sun behind a membrane comes through it: teal to lemon
        vec3 tc = mix(alb*1.5 + uLemon*0.10, alb, 0.3);
        col += trans*tc*uSunCol*max(-ndl, 0.)*0.62*lk;
        vec3 H = normalize(V + uSunDir + vec3(0., 1e-4, 0.));
        col += gloss*uSunCol*0.22*pow(max(dot(n, H), 0.), 24.)*lk*(1. + 2.*uWet);
        if (kind > 0.5 && kind < 3.5) col = mix(col, fanFarLit(kind > 1.5 && kind < 2.5 ? step(0.5, vFan.w) : step(0.5, vState.y), vState.w)*gsh, farK*openK);
        else col = mix(col, fanFarLit(step(0.5, vState.y), 0.2)*gsh, farB*0.7*openK);                // bodies under open fans: the fan's own shade
        col = inShade(col, castSh*0.8);
        gl_FragColor = vec4(applyHaze(col, vW), 1.);
      }`})}function ut(a,t,o,b){return new e.ShaderMaterial({uniforms:Object.assign({},a,t),side:e.DoubleSide,vertexShader:`
      varying vec3 vW, vR, vU, vN; varying vec2 vC; varying vec4 vState; varying float vSide, vEld;
      ${et}
      void main(){
        placeSuitor(${o.toFixed(1)});
        float size = (0.88 + 0.26*sRnd)*uCoarse*sShow;
        vec3 pivot = sBase + (vec3(0., 1.1*uBodyK + 0.3*sOpen, 0.) - sBDir*0.52*uBodyK)*size;
        float th = 0.05*sTrans*sin(uTime*56. + sRnd*40.);
        vec3 R = sFR*cos(th) + sUp*sin(th), U = sUp*cos(th) - sFR*sin(th);
        vec3 P = pivot + (R*position.x + U*position.y)*size;
        vSide = sSide; vEld = sEld;
        vW = P; vR = R; vU = U; vN = sNrm; vC = position.xy; vState = vec4(sOpen, sGold, sRnd, sDist);
        gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.);
      }`,fragmentShader:`
      varying vec3 vW, vR, vU, vN; varying vec2 vC; varying vec4 vState; varying float vSide, vEld;
      uniform float uUnfurl; uniform vec3 uHeroPos;
      float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
      ${Ce}
      ${lt}
      ${b}
      void main(){
        vec2 c = vC; float open = vState.x, gold = vState.y;
        float fw = fwidth(c.x) + fwidth(c.y);
        float r = length(c), th = atan(c.x, c.y + 1e-4);
        float halfA = 1.4835*mix(0.23, 1., open);
        float rc = clamp((th/(2.*halfA) + 0.5)*8., 0., 7.999), k = floor(rc), fr = rc - k;
        float ph = flipPhase(k, gold);
        float rim = 2.95 - 0.36*sin(3.14159*fr)*smoothstep(0.2, 0.6, open);
        float inFan = step(abs(th), halfA)*step(0.12, r)*step(r, rim);
        // ribs: kept a pixel and a half wide where they are the picture (furled blades), but never allowed to
        // swallow the membrane of an open or opening fan, which is what turned half-open ranks black
        float ribD = min(fr, 1. - fr)*r*0.37*mix(0.23, 1., open) + (1. - inFan);
        float so = smoothstep(0.1, 0.5, open);
        float rib = 1. - step(0.07 + fw*0.3, ribD);
        float ribGap = 1. - step(0.07 + fw*mix(0.3, 0.08, so), ribD);
        float louvre = step(fr, abs(cos(3.14159*ph)) + 0.04);
        float body = step(length((c - vec2(0., -0.5))/vec2(0.52, 0.72)), 1.);
        body = max(body, step(abs(abs(c.x) - (-c.y - 0.25)*0.75), 0.09)*step(c.y, -0.3)*step(-1.2, c.y));
        float fan = inFan*max(louvre, ribGap);
        if (fan + body < 0.5) discard;
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); vec3 alb; float trans = 0., gloss = 0.;
        vec3 V = normalize(cameraPosition - vW);
        float lit = fanLit(c.x/2.4*vSide, c.y/3.);
        if (fan < 0.5) { alb = mix(uSlate, uRoot, 0.46)*4.4; lit = 0.5; }   // the same animal from afar: the suitor's hide (slate and indigo slots in equal parts) written in the balanced slots: 0.46 of the indigo, lifted 4.4, keeps the wedge nearest the hide in every channel under the four hours' lights and in the three liveries together, and in each of them nearer than live's wedge stood to live's hide
        else {
          vec3 ribC = mix(uSlate*2.4, furledBlade(rc, r/3., vSide)*1.15, (1. - open)*0.85);
          alb = ribC;
          if (louvre > 0.5) {
          vec3 T = vR*cos(th) - vU*sin(th);
          n = normalize(n + T*(fr < 0.5 ? 1. : -1.)*0.85*smoothstep(0., 0.3, open));
          float rad = r/3.;
          float ringB = 0.5 + 0.5*sin(rad*34. + sin(rc*3.)*1.5);
          vec3 front = mix(uRoot*0.8, uFront, smoothstep(0.08, 0.62, rad))*(0.82 + 0.25*ringB);
          float eyeSpot = 1. - smoothstep(0.05, 0.085, length(vec2((fr - 0.5)*0.55, rad - 0.8)));
          front = mix(front, uGold*0.75, eyeSpot*0.9);
          vec3 back = uGold*0.75*(0.93 + 0.2*ringB - 0.1);
          alb = mix(front, back, step(0.5, ph));
          alb = mix(furledBlade(rc, rad, vSide), alb, smoothstep(0.02, 0.26, open));   // furled: one slim blade, gold along its sun edge
          trans = 1.; gloss = 1. - step(0.5, ph);
          }
          float ra = rib*mix(1., 0.07/(0.07 + fw*0.3), louvre*so);
          alb = mix(alb, ribC, ra); trans *= 1. - ra; gloss *= 1. - ra;
        }
        if (dot(n, V) < 0.) n = -n;
        float castSh = max(greatFanShadow(vW - uHeroPos, uSunDir, uUnfurl), vEld);
        float gsh = 1. - castSh*0.8;
        float ndl = dot(n, uSunDir);
        float lk = mix(1., mix(0.3, 1.75, lit), trans)*gsh;
        vec3 col = alb*(uSunCol*max(ndl, 0.)*lk + hemi(n.y)*mix(1., mix(0.82, 1.08, lit), trans)*(0.62 + 0.38*gsh));
        col += trans*mix(alb*1.5 + uLemon*0.10, alb, 0.3)*uSunCol*max(-ndl, 0.)*0.62*lk;
        // too small to resolve the pleats: settle to the colour the ground paint uses, keeping the lit / shade relief
        float far = smoothstep(0.35, 1.3, fw)*fan*smoothstep(0.02, 0.26, open);
        // (beyond that each fan keeps a lit or shaded grain of its own, so a far field of gold is corduroy, not paint)
        col = mix(col, fanFarLit(gold, mix(lit, 0.16 + 0.62*vState.z, smoothstep(2.5, 7., fw)))*(0.9 + 0.2*vState.z)*gsh, far);
        col = inShade(col, castSh*0.8);
        gl_FragColor = vec4(applyHaze(col, vW), 1.);
      }`})}function tt(a,t,o,b){const x=new e.InstancedBufferGeometry;return x.setAttribute("position",new e.BufferAttribute(new Float32Array([a,o,0,t,o,0,t,b,0,a,b,0]),3)),x.setIndex([0,1,2,0,2,3]),x}function St(){const a=[],t=[],o=[],b=[],x=[],s=(v,f,g,F)=>(a.push(...v),t.push(...f),o.push(...g),b.push(F),a.length/3-1),p=[[-1,.02,.02,.02,0],[-.8,.03,.11,.09,0],[-.35,0,.22,.19,0],[.1,-.02,.25,.22,0],[.45,0,.19,.17,0],[.75,.06,.09,.09,0],[1.2,.12,.065,.065,0],[1.55,.13,.06,.06,0],[1.68,.14,.095,.085,0],[1.8,.12,.05,.04,1],[2.08,.08,.008,.008,1]],m=8;p.forEach(v=>{for(let f=0;f<m;f++){const g=f/m*Math.PI*2,F=Math.cos(g),z=Math.sin(g);s([F*v[2],v[1]+z*v[3],v[0]],[F,z,0],[0,0,0],v[4])}});for(let v=0;v<p.length-1;v++)for(let f=0;f<m;f++){const g=v*m+f,F=v*m+(f+1)%m;x.push(g,g+m,F,F,g+m,F+m)}const S=(v,f,g,F)=>{for(const z of[-1,1]){const M=a.length/3,C=6;for(let D=0;D<=C;D++){const d=D/C,te=z*(.12+d*f),V=g*(1-.8*d*d)*(.55+.45*Math.sin(Math.min(d*2.2+.25,1.57))),k=(.22*Math.sin(d*3.1)-.95*d*d)*f*.42;s([te,.1,v+V*.4+k],[0,1,0],[F,d,z],0),s([te,.1,v-V*.6+k],[0,1,0],[F,d,z],-1)}for(let D=0;D<C;D++){const d=M+D*2;x.push(d,d+1,d+2,d+1,d+3,d+2)}}};S(.36,2.5,1.2,1),S(-.46,1.9,.95,2);for(let v=0;v<3;v++){const f=a.length/3,g=12,F=(v-1)*.07;for(let z=0;z<=g;z++){const M=z/g,C=.022+.018*Math.sin(M*Math.PI)+(M>.84?.075*Math.sin((M-.84)/.16*Math.PI):0);s([F-C*1.5,.03,-.9-M*4.6],[0,1,0],[3,M,v],0),s([F+C*1.5,.03,-.9-M*4.6],[0,1,0],[3,M,v],0)}for(let z=0;z<g;z++){const M=f+z*2;x.push(M,M+1,M+2,M+1,M+3,M+2)}}const P=new e.BufferGeometry;return P.setAttribute("position",new e.Float32BufferAttribute(a,3)),P.setAttribute("normal",new e.Float32BufferAttribute(t,3)),P.setAttribute("aPart",new e.Float32BufferAttribute(o,3)),P.setAttribute("aTint",new e.Float32BufferAttribute(b,1)),P.setIndex(x),P}function Ft(a,t){return new e.ShaderMaterial({uniforms:Object.assign({},a,{uBeat:{value:t}}),side:e.DoubleSide,vertexShader:`
      attribute vec3 aPart; attribute float aTint, aPhase;
      uniform float uTime, uBeat;
      varying vec3 vW, vN; varying float vTint, vUnder; varying vec2 vWing;
      void main(){
        vec3 p = position, n = normal; float id = aPart.x, s = aPart.y;
        vUnder = 0.; vWing = vec2(id, s);
        if (id > 0.5 && id < 2.5) {
          float ph = uTime*uBeat + aPhase + (id > 1.5 ? 2.1 : 0.);
          float ang = (0.46*sin(ph) + 0.22)*s + 0.3*sin(ph - 1.1)*s*s;
          float x0 = 0.12*aPart.z, dx = p.x - x0;
          p.x = x0 + dx*cos(ang); p.y += abs(dx)*sin(ang);
          n = normalize(vec3(-aPart.z*sin(ang), cos(ang), 0.));
        } else if (id > 2.5) {
          float w = s*4.6;
          p.x += (0.10 + 0.05*aPart.z)*w*0.5*sin(uTime*4.3 - w*0.9 + aPhase + aPart.z*1.7)*s + (aPart.z - 1.)*0.35*s;
          p.y += 0.22*w*0.4*sin(uTime*3.1 - w*0.7 + aPhase*1.3 + aPart.z)*s - 0.25*s*s;
          n = normalize(vec3(0.3*cos(uTime*4.3 - w*0.9 + aPhase), 1., 0.));
        } else {
          p.y += 0.05*sin(uTime*uBeat + aPhase + 3.14);
        }
        vec4 wp = modelMatrix*instanceMatrix*vec4(p, 1.);
        vW = wp.xyz; vN = normalize(mat3(modelMatrix*instanceMatrix)*n + vec3(0., 1e-5, 0.)); vTint = aTint;
        gl_Position = projectionMatrix*viewMatrix*wp;
      }`,fragmentShader:`
      varying vec3 vW, vN; varying float vTint; varying vec2 vWing;
      float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
      ${Ce}
      uniform vec3 uWhite, uLav; uniform float uChooserFill;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
        if (dot(n, cameraPosition - vW) < 0.) n = -n;
        float trail = max(-vTint, 0.);
        vec3 alb = mix(uWhite*0.72, uRose*0.85, max(vTint, 0.));
        float ndl = dot(n, uSunDir);
        // a real sun side and a lavender shade side: surfaces turned to the low sun are warm white, those turned
        // away (the far wings, the belly, the far flank of the neck) fall to lavender, as do undersides
        vec3 sh = normalize(vec3(uSunDir.x, 0., uSunDir.z) + vec3(1e-4, 0., 0.));
        float sideLit = dot(n, sh);
        float wingK = step(0.5, vWing.x)*step(vWing.x, 2.5);
        float lit = clamp(0.55 + 0.75*sideLit + 0.35*n.y, 0., 1.);
        lit = mix(lit, lit*0.55 + 0.45*smoothstep(-0.2, 0.5, n.y), wingK);
        // feathers: the trailing edge and the tips lie in the shade of the leading edge
        lit *= 1. - wingK*(0.62*smoothstep(0.25, 0.95, trail) + 0.3*smoothstep(0.6, 1., vWing.y));
        alb *= 1. - 0.12*wingK*step(0.5, fract(vWing.y*9.))*smoothstep(0.3, 0.8, trail);
        vec3 col = alb*(uSunCol*(max(ndl, 0.)*0.5 + max(-ndl, 0.)*0.1) + mix(uLav*0.78, vec3(1.16, 1.14, 1.04)*uChooserFill, lit));
        gl_FragColor = vec4(applyHaze(col, vW), 1.);
      }`})}function Ct(a,t,o,b){const x=a.rng.fork("choosers"),s={twenty:{n:20,scale:1,beat:3.1,near:4,vs:[{n:16,lead:118,step:7,lat0:8,latStep:5.2,drop:10}]},skein:{n:36,scale:.62,beat:7.5,near:5,vs:[{n:15,lead:70,step:5,lat0:5,latStep:3.1,drop:6.5},{n:16,lead:128,step:6,lat0:36,latStep:4.4,drop:15}]},giants:{n:3,scale:2.8,beat:1.5,near:3,vs:[],fan:[[50,15.2,16.5,20,.95],[56,-27,12,-14,.85],[40,22.6,9,14,.8]]}}[b.cast],p=[[19,-7.8,5.6],[24,-3.2,6.5],[30,2,7.4],[37,8,8.3],[45,15,9.2]],m=Math.pow(s.scale,.94),S=St(),P=new e.InstancedMesh(S,Ft(t,s.beat),s.n);P.frustumCulled=!1;const v=new Float32Array(s.n),f=[];for(let n=0;n<s.n;n++){v[n]=x()*6.283;const W=x.range(.11,.23),T=x.range(.07,.16),w=x()*6.283,A=x()*6.283;if(n<s.near){const de=p[n];f.push({near:!0,lead:de[0]*m,lat:de[1]*m,drop:de[2]*m,f1:W,f2:T,p1:w,p2:A,fan:s.fan?s.fan[n]:null});continue}let R=n-s.near,I=0;for(;I<s.vs.length-1&&R>=s.vs[I].n;)R-=s.vs[I].n,I++;const K=s.vs[I],ce=R%2?1:-1,ue=Math.ceil(R/2);f.push({near:!1,lead:K.lead-ue*K.step+x.range(-.6,.6),lat:K.lat0+ce*ue*K.latStep+x.range(-.4,.4),drop:K.drop+ue*.35+x.range(-.3,.3),f1:W,f2:T,p1:w,p2:A,peel:ce>0})}S.setAttribute("aPhase",new e.InstancedBufferAttribute(v,1));const g=new e.Vector3,F=new e.Vector3,z=new e.Vector3,M=new e.Vector3,C=new e.Vector3,D=new e.Vector3,d=new e.Vector3,te=new e.Matrix4,V=new e.Vector3,k=new e.Vector3,ie=new e.Vector3,N=new e.Vector3,r=new e.Vector3,i=new e.Vector3,y=new e.Vector3,l=n=>(1-O(4.5,9.5,Math.abs(n.x-G)))*(1-O(re-12,re+12,n.z))*O(be-12,be+12,n.z),u=6.5*s.scale+1.5,$=n=>Ke(n.x,n.z)+se(u,3.4,l(n)),U=(n,W,T)=>{const w=ye((T-n)/(W-n),0,1);return w*w*w*(w*(6*w-15)+10)},le=(n,W,T)=>{const w=ye((T-n)/(W-n),0,1);return 30*w*w*(1-w)*(1-w)/(W-n)};let oe=0,X=0,ze=!1,H=0;const me=(n,W,T,w,A,R)=>(o.posAtDist(W,R),o.tangentAtDist(W,M),R.y=se(o.posAtDist(W-n.lead,ie).y,R.y,A),C.set(-M.z,0,M.x),C.lengthSq()<1e-6&&C.set(1,0,0),C.normalize(),R.addScaledVector(C,T),R.y-=w,R),ge=(n,W,T,w,A)=>{const R=b.cast==="skein"?.6:1,I=Math.sin(W*n.f2+n.p2),K=Math.sin(W*n.f1+n.p1),ce=Math.sin(W*n.f2*1.3+n.p1);if(n.near){let ve=n.lead+1.3*m*I,Z=n.lat+1*m*K,ae=n.drop+.45*m*ce;if(oe=0,X=0,ze=!1,H=0,n.fan){const Y=U(.79,.865,T),ee=U(.835,.945,T),Ae=U(.9,.95,T),J=n.fan,Ge=le(.79,.865,T),Pe=le(.835,.945,T),Le=le(.9,.95,T);A.copy(N).addScaledVector(y,ve).addScaledVector(r,Z);const Re=l(A)*(1-Y),$e=J[3]>0?1:-1;ve+=(J[0]-n.lead)*Y,Z+=(J[1]-n.lat)*Y-J[3]*ee-$e*50*Ae,ae+=(-J[2]-n.drop)*Y-30*Ae,oe=((J[1]-n.lat)*Ge-J[3]*Pe-$e*50*Le)/o.length,X=(30*Le+(J[2]+n.drop)*Ge)/o.length,H=$e*J[4]*Pe*.11/1.875,ze=Ae>.995,A.copy(N).addScaledVector(y,ve).addScaledVector(r,Z).addScaledVector(i,-ae);const Ue=Ke(A.x,A.z)+se(u,3.4,Re),He=A.y-Ue,c=Math.sqrt(He*He+25);return A.y=Ue+.5*(He+c),X=.3*Math.tanh(X*.5*(1+He/c)/.3),Math.min(w+ve,o.length-2)}const Q=O(.8,.9,T);if(A.copy(N).addScaledVector(y,ve).addScaledVector(r,Z).addScaledVector(i,-ae),A.y=Math.max(A.y,$(A)),Q<=0)return w+ve;const _=ye((T-.8)/.1,0,1),Se=60*_*(1-_)/o.length;oe=-Z*Se,X=ae*Se;const he=w+ve+Q*132;return me(n,he,Z*(1-Q),ae*(1-Q),Q,z),z.y=Math.max(z.y,$(z)),A.lerp(z,Q),he}const ue=O(.2,.4,T)*(1-O(.58,.72,T)),de=O(.66,.74,T)*(1-O(.82,.88,T)),ke=O(.82,.94,T),we=b.rare&&n.peel?O(.5,.75,T):0,qe=n.lead+R*2.2*I+ue*n.lead*.25+we*260;let Me=n.lat+R*1.3*K,xe=n.drop+.6*ce+ue*(6+n.drop*1.2);return de>0&&(Me=se(Me,ye(Me,-4.2,4.2),de),xe=se(xe,Math.min(xe,2.4),de)),Me-=ke*(55+n.lead*.6)+we*-520,xe-=ke*(16+n.lead*.25)+we*14,me(n,w+qe,Me,xe,.3,A),A.y=Math.max(A.y,$(A)),w+qe};return{mesh:P,update(n,W,T,w){N.set(w[12],w[13],w[14]),r.set(w[0],w[1],w[2]).normalize(),i.set(w[4],w[5],w[6]).normalize(),y.set(-w[8],-w[9],-w[10]).normalize();for(let A=0;A<s.n;A++){const R=f[A],I=ge(R,n,W,T,g);let K=.18*Math.sin(n*R.f1+R.p1+1.57);if(R.near){const ue=1-O(.78,.84,W);o.tangentAtDist(Math.min(I,o.length-2),d);const de=(.36+.1*Math.sin(n*R.f1*.7+R.p2))*ue;C.set(-d.z,0,d.x),C.lengthSq()<1e-8&&C.set(1,0,0),C.normalize(),d.addScaledVector(C,de+oe-.3*H),d.y+=X-.1*ue,d.lengthSq()<1e-8&&d.set(0,0,-1),d.normalize(),K+=.34*ue+.45*ye(oe,-1,1)-H}else ge(R,n+.12,W,T+3.4,F),d.subVectors(F,g),d.lengthSq()<.25&&o.tangentAtDist(Math.min(I,o.length-2),d),d.normalize();C.set(-d.z,0,d.x),C.lengthSq()<1e-8&&C.set(1,0,0),C.normalize(),D.set(0,1,0),k.copy(D).addScaledVector(C,K).normalize(),V.crossVectors(k,d).normalize(),k.crossVectors(d,V);const ce=s.scale*(I>o.length-1.5||R.near&&ze?0:1);te.makeBasis(V,k,d).scale(F.set(ce,ce,ce)).setPosition(g),P.setMatrixAt(A,te)}P.instanceMatrix.needsUpdate=!0}}}var At={id:"plain-of-fans",name:"The Plain of Fans",category:"alien",weirdness:.6,media:["air","open"],async build(a){const t=gt(a),o=pt[t.hour],b=a.quality?.detail??1,x=mt[t.livery].pal,s=x.map(c=>new e.Color(c)),p=new e.Scene,m=t.weather==="wind",S=t.weather==="rain",P=Object.assign({rng:a.rng},t.hour==="noon"?{}:{clouds:!1},o.sky);o.cirrus&&(P.clouds2={coverage:S?.6:.46,stretch:1,scale:1.5,opacity:.9,softness:.4,wind:[m?.05:.02,.004],lit:o.cirrus[0],shade:o.cirrus[1],haze:.3}),S&&t.hour!=="noon"&&(P.clouds={coverage:.5,softness:.55,scale:1.3,opacity:.7,absorb:.8,lit:t.hour==="night"?o.cirrus[0]:[1.5,1.46,1.3],shade:t.hour==="night"?o.cirrus[1]:[.84,.9,.9],wind:[.02,.006]}),await a.yield();const v=ht(P);p.add(v.object),await a.yield();const f=v.lightDirection.clone().normalize(),g=(c,h=1)=>new e.Color(c[0]*h,c[1]*h,c[2]*h),F=S?.86:1,z=g(o.sun,F),M=new e.Color(o.fill[0]).multiplyScalar(o.fill[1]),C=new e.Color(o.gnd[0]).multiplyScalar(o.gnd[1]),D=g(o.fog),d=g(o.fogSun),te=(S?1.5:t.weather==="mist"?1.15:1)*46e-5;p.fog=new e.FogExp2(D.clone().lerp(d,.25),te);const V=dt([[0,25,0],[0,25,-70],[0,26,-150],[4,29,-230],[14,35,-320],[30,45,-400],[56,72,-480],[91,108,-570],[128,121,-670],[158,100,-780],[175,56,-880],[180,25,-960],[180,10.5,-1020],[180,8,-1060],[180,8,-1100],[180,10.5,-1140],[180,18,-1185],[180,26.5,-1225],[180,30,-1255],[G,30,Fe]]),k=await ft(a,{palette:x,autoplay:!1,detail:b,sunColor:z,skyColor:M,groundColor:C,glow:t.hour==="night"?.45:.8});k.object.position.set(G,0,Fe),k.setSun(f,z),k.setBounce(s[4].clone().lerp(s[3],.3).multiply(z).multiplyScalar(.38)),p.add(k.object),await a.yield();const ie=[];for(let c=0;c<We;c++){const[h,j,fe]=Te[c],q=await vt(a,k,{palette:x,seed:c,scale:fe/153});q.object.position.set(h,Ke(h,j)-.3,j),p.add(q.object),ie.push(q),await a.yield()}const N=z.clone().multiplyScalar(.3).add(M),r=(N.r+N.g+N.b)/3,i=(c,h=.7)=>{const j=c.clone();return j.r*=se(1,r/Math.max(N.r,.001),h),j.g*=se(1,r/Math.max(N.g,.001),h),j.b*=se(1,r/Math.max(N.b,.001),h),j},y=k.anchors.footprints.slice(0,6).map(c=>new e.Vector3(G+c[0],Fe+c[1],c[2]));for(;y.length<6;)y.push(new e.Vector3(0,9e5,1));const l={uTime:{value:0},uU:{value:0},uCamS:{value:0},uPatSet:{value:t.pattern},uRare:{value:0},uEye:{value:[new e.Vector4(0,380,0,1),new e.Vector4(900,900,.4,1),new e.Vector4(-800,1600,-.5,1)]},uSunDir:{value:f},uSunCol:{value:z},uSkyCol:{value:M},uGndCol:{value:C},uFogCol:{value:D},uFogSun:{value:d},uFogDen:{value:te},uFaceSun:{value:.3},uWet:{value:S?1:0},uSlate:{value:i(s[0],1)},uFront:{value:i(s[1])},uRoot:{value:i(s[2])},uGold:{value:s[3]},uLemon:{value:s[4]},uRose:{value:s[6]},uWhite:{value:s[5]},uLav:{value:new e.Color("#9FA4C4")},uChooserFill:{value:t.hour==="night"?.34:t.hour==="noon"?.9:1},uHeroPos:{value:k.object.position},uUnfurl:k.uniforms.uUnfurl,uPaintNear:{value:420*(.4+.6*b)},uPaintFar:{value:760*(.4+.6*b)},uMist:{value:o.mist*(t.weather==="mist"?1.25:m?.55:.9)},uCentreA:{value:new e.Vector3},uCentreB:{value:new e.Vector3},uCentreC:{value:new e.Vector3},uTileA:{value:new e.Vector2(1,1)},uTileB:{value:new e.Vector2(1,1)},uEld:{value:ie.map((c,h)=>new e.Vector4(Te[h][0],Te[h][1],c.scale,0))},uEldB:{value:ie.map(c=>new e.Vector4(c.params.spread,c.params.nRibs-1,c.object.position.y,c.clear))},uFoot:{value:y},uGust:{value:m?1:.12},uShadowK:{value:t.hour==="noon"?.55:t.hour==="night"?.7:.84}},u=new e.Mesh(xt(),yt(l,k.shadowGLSL));u.frustumCulled=!1,p.add(u),await a.yield();const $=a.rng.fork("thin"),U=(c,h,j,fe,q,L,pe)=>{const B=bt(c,h,j,Ve*fe,Be*fe,q,$);L.uniforms.uTile={value:B.tile},L.uniforms.uCentre=pe,L.uniforms.uCoarse={value:fe},L.uniforms.uSize={value:1},L.uniforms.uJuv={value:0},L.uniforms.uBodyK={value:Ne};const E=new e.Mesh(c,L);return E.frustumCulled=!1,p.add(E),B},le=rt(s,Ne),oe=U(le,18,20,1,1,ct(l,{},k.shadowGLSL),l.uCentreA);l.uTileA.value.copy(oe.tile);const X=new e.ShaderMaterial({uniforms:Object.assign({},l),transparent:!0,depthWrite:!1,vertexShader:`
        varying vec2 vUv; varying float vA; varying vec3 vW;
        ${et}
        void main(){
          placeSuitor(0.);
          float ph = uTime*0.8 + sRnd*6.283;
          float sz = (1.5 + 1.6*sRnd)*(0.7 + 0.5*sTrans);
          vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
          vec3 c = sBase + vec3(0.5*sin(ph), 0.5 + 0.9*sTrans + 0.3*sin(ph*1.3), 0.5*cos(ph));
          vec3 P = c + (cr*position.x + vec3(0., 1., 0.)*(position.y - 0.3))*sz;
          vUv = position.xy*2. - vec2(0., 1.); vA = sShow*sTrans*smoothstep(4., 14., sDist); vW = P;
          gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.);
        }`,fragmentShader:`
        varying vec2 vUv; varying float vA; varying vec3 vW;
        float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
        ${Ce}
        void main(){
          float r = length(vUv);
          float a = (1. - smoothstep(0.25, 1., r))*vA*0.5*(0.6 + 0.4*vnoise(vW.xy*1.7 + vW.z));
          if (a < 0.004) discard;
          vec3 col = mix(uLemon*0.55, uSlate*3., 0.35)*(uSunCol*0.5 + uSkyCol*0.9);
          gl_FragColor = vec4(applyHaze(col, vW), a);
        }`});U(tt(-.5,.5,0,1),18,20,1,1,X,l.uCentreA),await a.yield();const ze=U(tt(-3.4,3.4,-1.3,3.45),120,138,1,b,ut(l,{},1,k.shadowGLSL),l.uCentreB);l.uTileB.value.copy(ze.tile),await a.yield(),U(tt(-3.4,3.4,-1.3,3.45),132,152,2,b,ut(l,{},2,k.shadowGLSL),l.uCentreC),await a.yield();const H=rt(s,Ne),me=a.rng.fork("juv"),ge=[];for(let c=0;c<56;c++)ge.push(G+me.range(-4.5,4.5),se(re-20,be+30,(c+me())/56));H.setAttribute("aCell",new e.InstancedBufferAttribute(new Float32Array(ge),2)),H.instanceCount=56,H.boundingSphere=new e.Sphere(new e.Vector3,1e5);const n=ct(l,{},k.shadowGLSL);Object.assign(n.uniforms,{uTile:{value:new e.Vector2(1e6,1e6)},uCentre:l.uCentreA,uCoarse:{value:1},uSize:{value:.54},uJuv:{value:1},uBodyK:{value:Ne}});const W=new e.Mesh(H,n);W.frustumCulled=!1,p.add(W);const T=new e.ShaderMaterial({uniforms:Object.assign({},l),transparent:!0,depthWrite:!1,vertexShader:"varying vec3 vW; void main(){ vW = (modelMatrix*vec4(position, 1.)).xyz; gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.); }",fragmentShader:`
        varying vec3 vW; uniform float uTime, uMist, uU;
        float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
        ${Ce}
        ${Ie}
        void main(){
          vec2 w = vW.xz; float gh = groundH(w);
          vec2 drift = vec2(uTime*1.1, uTime*0.35);
          float n = fbm3(w*0.018 + drift*0.02)*0.65 + fbm3(w*0.07 - drift*0.05)*0.35;
          // pooled where the ground is low: a bank deep enough to drown the fans standing in the swale
          float pool = 1. - smoothstep(-2.9, -1.3, gh + (n - 0.5)*1.8);
          float a = pool*(0.35 + 0.65*smoothstep(0.3, 0.72, n))*uMist*0.78;
          // dust thrown up along the opening front
          float fr = 170. - 555.*uU + 1.15*abs(w.x - 4.)*(1. - smoothstep(0.04, 0.16, uU));
          float df = (-w.y - fr - 8.)/16.;
          a = max(a, exp(-df*df)*(1. - smoothstep(0.17, 0.22, uU))*(0.3 + 0.7*n)*0.5);
          vec3 v = vW - cameraPosition; float d = length(v);
          a *= smoothstep(8., 45., d)*mix(0.5, 1., smoothstep(50., 170., d))*(1. - laneMask(w))*(1. - smoothstep(0.3, 0.9, abs(v.y)/max(d, 1e-3))*0.45)*(1. - 0.5*smoothstep(40., 105., cameraPosition.y - vW.y));
          float sunward = max(dot(v/max(d, 1e-3), uSunDir), 0.);
          vec3 col = mix(uFogCol, uFogSun, 0.55 + 0.45*sunward)*(1.25 + 0.35*n);
          gl_FragColor = vec4(applyHaze(col, vW), a);
        }`}),w=new e.PlaneGeometry(9e3,9e3,1,1);w.rotateX(-Math.PI/2);for(const c of[1,2.4]){const h=new e.Mesh(w,T);h.position.set(G,c,-2400),h.frustumCulled=!1,h.renderOrder=2,p.add(h)}const A=a.rng.fork("grass"),R=Math.round(4200*b*ye(t.density,.8,1.2)),I=112,K=new e.InstancedBufferGeometry;K.setAttribute("position",new e.BufferAttribute(new Float32Array([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0,0,0,-.5,0,0,.5,0,1,.5,0,1,-.5]),3)),K.setAttribute("uv",new e.BufferAttribute(new Float32Array([0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]),2)),K.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);const ce=new Float32Array(R*4);for(let c=0;c<R;c++)ce.set([A()*I,A()*I,A(),A()],c*4);K.setAttribute("aCell4",new e.InstancedBufferAttribute(ce,4)),K.instanceCount=R,K.boundingSphere=new e.Sphere(new e.Vector3,1e5);const ue=new e.ShaderMaterial({uniforms:Object.assign({},l,{uTile:{value:new e.Vector2(I,I)}}),side:e.DoubleSide,vertexShader:`
        attribute vec4 aCell4; varying vec2 vUv; varying vec3 vW; varying float vR;
        uniform vec3 uCentreA; uniform vec2 uTile; uniform float uTime, uGust; uniform vec3 uFoot[6];
        ${Ie}
        ${Qe}
        void main(){
          vec2 q = aCell4.xy + floor((uCentreA.xz - aCell4.xy)/uTile + 0.5)*uTile;
          vec2 e = abs(q - uCentreA.xz)/(uTile*0.5);
          float s = (0.75 + 1.15*aCell4.z)*(1. - smoothstep(0.8, 1., max(e.x, e.y)));
          for (int i = 0; i < 6; i++) s *= smoothstep(uFoot[i].z, uFoot[i].z + 5., length(q - uFoot[i].xy));
          s *= smoothstep(-6., 2., elderDist(q));
          float a = aCell4.w*6.283; vec2 rot = vec2(cos(a), sin(a));
          vec3 lp = vec3(position.x*rot.x - position.z*rot.y, position.y, position.x*rot.y + position.z*rot.x);
          float wind = (0.12 + 0.4*uGust)*(sin(uTime*1.7 + q.x*0.21 + q.y*0.13) + 0.5*sin(uTime*3.1 + q.x*0.5));
          vec3 P = vec3(q.x, groundH(q), q.y) + vec3(lp.x*0.75, lp.y*0.5, lp.z*0.75)*s + vec3(1., 0., 0.3)*wind*position.y*position.y*0.3*s;
          vUv = uv; vW = P; vR = aCell4.z;
          gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.);
        }`,fragmentShader:`
        varying vec2 vUv; varying vec3 vW; varying float vR;
        float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
        ${Ce}
        void main(){
          float b = floor(vUv.x*7.), bh = 0.45 + 0.55*hash21(vec2(b, floor(vR*90.)));
          float fx = abs(fract(vUv.x*7.) - 0.5 - (hash21(vec2(b, 3.)) - 0.5)*0.5*vUv.y);
          float blade = step(fx, 0.34*(1. - vUv.y/bh))*step(vUv.y, bh);
          float head = step(length(vec2(fx*0.55, (vUv.y - bh*0.95)*1.5)), 0.13)*step(0.4, hash21(vec2(b, 9.)));
          if (blade + head < 0.5) discard;
          vec3 alb = mix(mix(uRoot*0.5, uSlate*3.0, 0.62)*(0.6 + 0.9*vUv.y), uRose*0.95, head);
          vec3 col = alb*(uSunCol*(0.35 + 0.5*vUv.y) + uSkyCol*0.9);
          gl_FragColor = vec4(applyHaze(col, vW), 1.);
        }`}),de=new e.Mesh(K,ue);de.frustumCulled=!1,p.add(de),await a.yield();const ke={value:0},we=[],qe=s[3].clone().multiplyScalar(.9),Me=s[3].clone().multiplyScalar(.5),xe=s[4].clone().multiplyScalar(.7);we.push(Ze.makeParticles({rng:a.rng.fork("scales"),preset:"petals",time:ke,count:Math.round(1300*b),box:[70,30,70],velocity:[1.2+(m?4:0),.9,.3],velocityRandom:[.8,.7,.8],colors:[qe,Me,xe],size:[.07,.17],lightDir:f})),we.push(Ze.makeParticles({rng:a.rng.fork("dust"),preset:"dust",time:ke,count:Math.round(900*b),box:[60,14,60],colors:[xe,qe,xe],intensity:t.hour==="night"?.25:.8,additive:0})),S&&we.push(Ze.makeParticles({rng:a.rng.fork("rain"),preset:"rain",time:ke,count:Math.round(3200*b),opacity:.5}));for(const c of we)p.add(c.object);const ve=Ct(a,l,V,t);p.add(ve.mesh),await a.yield();const Z=new e.Vector3(830,0,-1840);let ae=null;if(t.rare){const h=[],j=[];for(let B=0;B<41;B++){const E=h.length/3;h.push(B,9,0,B,122,0,B+.5,9,0,B+.5,110,0),B<40&&j.push(E,E+1,E+2,E+1,E+3,E+2,E+2,E+3,E+4,E+3,E+5,E+4)}const fe=h.length/3;h.push(0,34,2);for(let B=0;B<=16;B++){const E=B/16*Math.PI*2;h.push(Math.cos(E)*62,-2,Math.sin(E)*78-30,2),h.splice(h.length-1,1)}for(let B=0;B<16;B++)j.push(fe,fe+2+B,fe+1+B);const q=new Float32Array(h.length/3);for(let B=fe;B<q.length;B++)q[B]=1;const L=new e.BufferGeometry;L.setAttribute("position",new e.Float32BufferAttribute(h,3)),L.setAttribute("aKind",new e.BufferAttribute(q,1)),L.setIndex(j);const pe=new e.ShaderMaterial({uniforms:Object.assign({},l,{uOpen:{value:0},uRise:{value:0}}),side:e.DoubleSide,vertexShader:`
          attribute float aKind; uniform float uOpen, uRise, uTime; varying vec3 vW; varying vec3 vF;
          void main(){
            vec3 p = position;
            if (aKind < 0.5) {
              float s = position.x/40.*2. - 1.;
              float e = clamp(uOpen*1.6 - 0.6*(1. - abs(s)), 0., 1.); e = e*e*(3. - 2.*e);
              float a = s*1.47*mix(0.02, 1., e) + 0.01*sin(uTime*0.7 + position.x)*e;
              float fr = fract(position.x);
              p = vec3(sin(a)*position.y, (30. + cos(a)*position.y)*uRise, -4.*step(0.25, fr)*e + s*3.*(1. - e));
              vF = vec3(position.x, position.y/120., 0.);
            } else { p.y *= uRise; vF = vec3(0., 0., 1.); }
            vW = (modelMatrix*vec4(p, 1.)).xyz;
            gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.);
          }`,fragmentShader:`
          varying vec3 vW; varying vec3 vF;
          float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
          ${Ce}
          void main(){
            vec3 col;
            if (vF.z > 0.5) col = mix(uSlate, uRoot, 0.4)*1.5*(uSunCol*0.25 + uSkyCol);
            else {
              float fr = fract(vF.x), facet = smoothstep(0.42, 0.58, fr);
              float ring = 0.5 + 0.5*sin(vF.y*70.);
              vec3 alb = mix(uGold*0.75, uGold*0.3, 1. - smoothstep(0.08, 0.3, vF.y))*(0.85 + 0.2*ring);
              col = alb*(uSunCol*mix(0.95, 0.2, facet) + uSkyCol*0.9);
              col = mix(col, uSlate*0.6, 1. - smoothstep(0.02, 0.06, min(fr, 1. - fr)));
            }
            gl_FragColor = vec4(applyHaze(col, vW), 1.);
          }`});ae=new e.Mesh(L,pe),ae.position.copy(Z),ae.position.y=Ke(Z.x,Z.z),ae.frustumCulled=!1,p.add(ae)}const Q=new e.Vector3,_=new e.Vector3,Se=new e.Vector3,he=new e.Vector3,Y=new e.Vector2,ee=new e.Vector2(0,1);let Ae=!1;const J=l.uEye.value,Ge=new e.Vector3(G,30,Fe),Pe=t.pattern===2?[1.75,0,0]:t.pattern===1?[.72,.72,.9]:[1,1,1],Le=(c,h,j,fe)=>{const q=ye(fe||0,0,1);l.uTime.value=h,l.uU.value=q,ke.value=h,V.pointAt(q,Se),l.uCamS.value=-Se.z;const L=j.matrixWorld.elements;_.set(L[12],L[13],L[14]),Q.set(-L[8],-L[9],-L[10]),Q.y=0,Q.lengthSq()<1e-6&&Q.set(0,0,-1),Q.normalize(),l.uCentreA.value.copy(_).addScaledVector(Q,36+_.y*.95),l.uCentreB.value.copy(_).addScaledVector(Q,240+_.y*1.2),l.uCentreC.value.copy(_).addScaledVector(Q,640+_.y);const pe=c>0?1-Math.exp(-Math.min(c,.1)*.9):0;V.tangentAt(q,he),he.y=0,he.lengthSq()<1e-6&&he.set(0,0,-1),he.normalize(),pe>0&&(ee.x+=(he.x-ee.x)*pe,ee.y+=(-he.z-ee.y)*pe);let B=Math.hypot(ee.x,ee.y)||1,E=ee.x/B,De=ee.y/B;const Ee=t.pattern===2?620:380;!Ae||Math.hypot(_.x+E*Ee-Y.x,-_.z+De*Ee-Y.y)>140?(ee.set(he.x,-he.z),B=Math.hypot(ee.x,ee.y)||1,E=ee.x/B,De=ee.y/B,Y.set(_.x+E*Ee,-_.z+De*Ee)):pe>0&&(Y.x+=(_.x+E*Ee-Y.x)*pe,Y.y+=(-_.z+De*Ee-Y.y)*pe),Ae=!0,J[0].set(Y.x,Y.y,Math.atan2(-E,De),Pe[0]);const ot=(.45-q)*1012,at=30*Math.sin(h*.1);let Oe=60+ot+at,je=1150,_e=60-ot*1.25-at,Ye=1950;if(t.pattern===1&&(Oe=Y.x+De*420,je=Y.y-E*420),t.rare){const ne=O(.5,.95,q);Oe=se(Oe,Z.x-260,ne),je=se(je,-Z.z-420,ne),_e=se(_e,Z.x+120,ne),Ye=se(Ye,-Z.z+380,ne)}J[1].set(Oe,je,t.pattern===1?J[0].z:-Math.PI/2,Pe[1]),J[2].set(_e,Ye,Math.PI/2,Pe[2]),t.pattern===2&&(J[1].set(9e5,9e5,0,.001),J[2].set(9e5,-9e5,0,.001)),k.setProgress(q),k.update(c,h,j),V.posAtDist(q*V.length+26,Se);for(let ne=0;ne<We;ne++){const nt=ie[ne],Je=nt.object,st=Math.atan2(Se.x-Je.position.x,Se.z-Je.position.z);Je.rotation.y=st,l.uEld.value[ne].w=st;const Xe=(q-Te[ne][3])/.075+.04*Math.sin(h*.6+ne*2.1);nt.setStripe(Xe>-1.3&&Xe<1.3?Xe*215:-1e4,150)}ae&&(ae.material.uniforms.uRise.value=O(.46,.52,q),ae.material.uniforms.uOpen.value=O(.51,.66,q)),ve.update(h,q,q*V.length,L),v.update(c,h,j);for(const ne of we)ne.update&&ne.update(c,h,j)},Re=new e.PerspectiveCamera(62,1.78,.3,7e3);Re.position.copy(V.start),Re.lookAt(V.start.clone().add(V.startTangent)),Re.updateMatrixWorld(!0),Le(0,0,Re,0),Ae=!1,await v.prewarm(a.renderer,null,p);const $e=new e.Vector3,Ue=[{at:new e.Vector3(40,22,-480),from:.03,to:.2,weight:.5,fade:.25},{at:new e.Vector3(Te[1][0],14,Te[1][1]),from:.26,to:.4,weight:.35,fade:.35},{at:(c,h)=>V.pointAt(Math.min(h+se(.1,.27,O(.2,.4,h)),.98),$e).setY(0),from:.2,to:.6,weight:.7,fade:.2},{at:new e.Vector3(380,0,-900),from:.44,to:.62,weight:.45,fade:.45},{at:Ge.clone().setY(58),from:.56,to:.86,weight:.5},{at:Ge.clone(),from:.84,to:.99,weight:.8,fade:.2}];return t.rare&&Ue.push({at:Z.clone().setY(70),from:.5,to:.64,weight:.3}),{scene:p,path:V,duration:46,title:{dawn:"The Plain of Fans",noon:"The Plain of Fans, Pearl Noon",evening:"The Plain of Fans at Evening",night:"The Plain of Fans by Moonlight"}[t.hour],camera:{fov:62,near:.3,far:7e3,lookAhead:26,sway:.7,bank:.8},pois:Ue,portal:{shape:"circle",radius:7,color:"#FBFBF5",glow:1,revealDistance:300},post:{exposure:o.exposure,bloom:{strength:t.hour==="night"?.18:.24,radius:.6,threshold:.95},grade:{saturation:1.08,contrast:1.08,tint:o.tint,shadowTint:o.shadowTint,vignette:.3,grain:.02,aberration:0}},ride:"none",update:Le,dispose(){v.dispose&&v.dispose()}}}};export{At as default};
