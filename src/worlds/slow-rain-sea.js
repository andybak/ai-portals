import*as o from"three";import{makePath as R0}from"../kit/core.js";import{buildHero as _0}from"../parts/slow-rain-sea.js";const D0=[["#E9A04B","#8A4A1E","#F3E7D2","#0B0A0E","#C96A2B","#3A2418","#5FD6C8"],["#EBB24C","#7C2F2C","#F5E6C8","#12060C","#C8602F","#3A1822","#5FD6C8"],["#DDBE8A","#7B5630","#F1EAD9","#0B0A0C","#BB8248","#34261A","#5FD6C8"]],W0=[["#6B3070","#0E3440"],["#5A55A2","#28366E"],["#42609E","#1C5564"]],R=[-50,0,215],a0=.00166,re=`
uniform vec3 uKey; uniform float uDusk;
vec3 litCol(vec3 alb, vec3 N, float ao, float trans){
  float nl = dot(N, uSun);
  float key = smoothstep(-0.08, 0.55, nl) * (1. - 0.6 * uRainDim);
  vec3 band = mix(cHaze, cEmber, uRainDim) * (0.55 + 0.45 * (1. - abs(N.y)));
  band = mix(band, cCool * 1.7, (1. - smoothstep(-0.7, 0.3, nl)) * (0.35 + 0.5 * uRainDim));          // turned from the tear: the dusk side
  vec3 amb = mix(band, band * 0.45 + cCool * 0.8, smoothstep(0.1, 0.9, N.y)) * (0.26 + 0.46 * ao);
  amb += cHaze * 0.16 * (1. - smoothstep(-0.8, 0.0, N.y));
  return alb * (uKey * key * ao * 1.45 + amb + uKey * trans * max(-nl, 0.) * 0.5);
}
`,s0=`
uniform vec4 uIce;                       // seeded phases: flutes, strata, -, cloud base
uniform vec3 uIceKey;                    // the colour of ice the tear lights
// buttresses of unequal width: a strongly frequency-modulated phase, leaning a little with height
float iceFluteA(vec2 p){ float x = p.x + 0.1 * p.y * sin(p.x * 0.0071 + 1.3 + uIce.y);
  return x * 0.068 + uIce.x + 1.9 * sin(x * 0.0137 + 0.7 + uIce.y) + 0.9 * sin(x * 0.0331 + 2.1 + uIce.x) + 0.35 * sin(p.y * 0.011 + x * 0.004); }
float iceCleft(float a){ float c = 0.5 - 0.5 * cos(a); c *= c; return c * c * (0.6 + 0.4 * sin(a * 0.159 + 1.)); }   // 1 deep in a cleft
float iceFlute(vec2 p){ return 1. - iceCleft(iceFluteA(p)); }                                       // 1 on a buttress face
float iceRib(vec2 p){ float b = p.x * 0.37 + 2.6 * sin(p.x * 0.041 + 0.9 * uIce.x) + 1.2 * sin(p.x * 0.09 + 2.) + 0.8 * sin(p.y * 0.023 + p.x * 0.013);
  return (0.5 - 0.5 * cos(b + 0.5 * sin(b))) * (0.25 + 0.75 * smoothstep(-0.4, 0.6, sin(p.x * 0.017 + p.y * 0.009 + uIce.y))); }
// each buttress is a blunt wedge: one broad face turned toward the tear (ph 0.08 to 0.74), an arris, one short return face in shadow
float iceFz(float x){ return smoothstep(40., 74., abs(x - 170.)) * smoothstep(49., 68., abs(x - 46.5)); }      // 0 about the fall and across the notch: each stands in one plain face
float icePh(vec2 p){ return fract((iceFluteA(p) - 3.14159) / 6.28318); }
float iceSaw(float ph){ float e = 1. - min(ph / 0.74, (1. - ph) / 0.26); return sqrt(e * e + 0.003); }
// 1 on the face the tear lights, 0 on the return face and in the cleft's own long shadow (the edges wander a little with height)
float iceLit(vec2 p){ float ph = icePh(p) + 0.012 * sin(p.y * 0.043 + p.x * 0.011) + 0.006 * sin(p.y * 0.19 + 1.7);
  float cst = 0.27 + 0.05 * sin(p.y * 0.021 + floor(iceFluteA(p) / 6.28318 - 0.5) * 2.3) + 0.014 * sin(p.y * 0.13);            // the grazing tear: a long cast shadow
  return mix(1., smoothstep(cst - 0.012, cst + 0.022, ph) * (1. - smoothstep(0.722, 0.748, ph)), iceFz(p.x)); }
// light coming through the thin arris: a band just round the corner on the shadow side
float iceArris(vec2 p){ float ph = icePh(p) + 0.012 * sin(p.y * 0.043 + p.x * 0.011) + 0.006 * sin(p.y * 0.19 + 1.7);
  return smoothstep(0.722, 0.75, ph) * (1. - smoothstep(0.75, 0.83, ph)) * iceFz(p.x); }
float iceRelief(vec2 p){ return iceFz(p.x) * (24. * iceCleft(iceFluteA(p)) + 16. * iceSaw(icePh(p))) + 1.1 * iceRib(p); }                   // metres the face stands back
vec3 iceV = vec3(0., 0., 1.);            // the view ray (eye to surface, brief space): set by the caller before iceCol
float iceFlip = 1.;                      // -1 where skyCol wants the world's x (the sea's mirror)
// strata: beds of unequal thickness that tilt across each buttress and break at the clefts.
// x: bed coordinate, y: its rate per metre of height
vec2 iceSyD(vec2 p){
  float a = (iceFluteA(p) - 3.14159) / 6.28318, bi = floor(a), saw = a - bi - 0.5;
  float y = p.y + 6. * sin(p.x * 0.0113 + uIce.y) + 3. * sin(p.x * 0.031 + 4.1) + saw * 15. * sin(bi * 2.7 + uIce.y) + 8. * sin(bi * 4.3 + 1.);
  return vec2(y / 21. + 0.62 * sin(y * 0.045 + 2.) + 0.12 * sin(y * 0.11 + 0.7), 1. / 21. + 0.0279 * cos(y * 0.045 + 2.) + 0.0132 * cos(y * 0.11 + 0.7));
}
float iceSy(vec2 p){ return iceSyD(p).x; }
float iceHk(float k){ return fract(sin(k * 12.9898 + 4.1) * 43758.5453); }
float iceH2(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float iceN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(iceH2(i), iceH2(i + vec2(1., 0.)), f.x), mix(iceH2(i + vec2(0., 1.)), iceH2(i + vec2(1., 1.)), f.x), f.y); }
// where a shelf's lip stands proud: beds pinch out and come back along the face
float icePinch(float x, float k){ return smoothstep(-0.45, 0.2, sin(x * 0.019 + k * 2.4) + 0.6 * sin(x * 0.043 + k * 5.1 + 1.)); }
// N0: the smooth normal of the surface (unit). ao: 1 open, 0 deep in a cleft. fw: pixel footprint of p.
// along: how p.x runs along the surface tangent (1 on the face, +-0.83 on the notch walls). strata: 0 on floors.
vec3 iceCol(vec2 p, vec3 N0, float ao, vec2 fw, float along, float strata, float gold){
  vec2 sd = iceSyD(p); float sy = sd.x, k = floor(sy), sf = sy - k; float wy = fw.y * sd.y;
  float hk = iceHk(k), e0 = 1. - clamp(4.6 * sd.y * (0.6 + 0.8 * hk), 0.07, 0.4);                    // the lip is a few metres thick, whatever the bed
  float sFade = (1. - smoothstep(0.12, 0.4, wy)) * strata * icePinch(p.x, k);
  float under = smoothstep(e0 - 0.07 - wy, e0 - 0.05, sf) * (1. - smoothstep(e0, e0 + 0.02 + wy, sf)) * sFade;
  float contact = smoothstep(e0 - 0.38, e0 - 0.05, sf) * (1. - smoothstep(e0, e0 + 0.02 + wy, sf)) * sFade;     // soft shade gathering under the lip
  float cap = smoothstep(e0, e0 + 0.02 + wy, sf) * (1. - smoothstep(0.985 - wy, 1., sf)) * sFade;
  float top = smoothstep(0.94, 0.985, sf) * sFade;
  // laminae: thin beds inside each bed, of unequal weight; frost feathers; streaks run down from under each lip
  float lf = sy * 3. + 0.8 * sin(p.x * 0.05 + k), lk = floor(lf), lfr = lf - lk, lh = fract(sin(lk * 78.233 + 1.3) * 43758.5453), wl = fw.y * sd.y * 3.;
  float lam = (1. - smoothstep(0.05 + wl, 0.15 + 2. * wl, min(lfr, 1. - lfr))) * step(0.42, lh) * (0.4 + 0.6 * lh) * (1. - smoothstep(0.15, 0.5, wl)) * strata
    * smoothstep(-0.5, 0.1, sin(p.x * 0.083 + lk * 1.9));
  float frost = smoothstep(0.5, 0.74, 0.6 * iceN(vec2(p.x * 0.083 + 1.3 * k, p.y * 0.19 + 2.7 * hk)) + 0.4 * iceN(vec2(p.x * 0.33 + 5.1, p.y * 0.71 + k)))
    * (1. - smoothstep(0.6, 2.5, max(fw.x, fw.y)));
  float drip = smoothstep(0.5, 0.9, 0.5 + 0.5 * sin(p.x * 1.9 + 2. * sin(p.x * 0.43 + k * 3.))) * smoothstep(e0 - 0.55, e0 - 0.08, sf) * (1. - smoothstep(e0 - 0.07, e0 - 0.05, sf))
    * (1. - smoothstep(0.35, 1.3, fw.x * 1.9)) * sFade;
  // tall flutes that jog a little at every shelf; a fine striation and a soft hammered relief close to
  float a2 = p.x * 0.4 + 0.7 * sin(k * 2.3) + 3.3 * sin(p.x * 0.07 + k * 0.9) + 2.5 * sin(p.x * 0.023 + k * 1.7), s2 = a2 + 0.6 * sin(a2);
  float f2 = (1. - smoothstep(0.45, 1.5, fw.x * 0.6)) * strata * (0.3 + 0.7 * smoothstep(-0.3, 0.5, sin(p.x * 0.031 + k * 1.3 + p.y * 0.02)));
  float a3 = p.x * 2.9 + 2. * sin(p.y * 0.31 + k) + 1.3 * sin(p.x * 0.6), f3 = (1. - smoothstep(0.35, 1.3, fw.x * 2.9)) * strata;
  float a4 = p.y * 3.3 + 1.6 * sin(p.x * 0.45 + k), f4 = (1. - smoothstep(0.35, 1.3, fw.y * 3.3)) * strata;
  float fm = max(fw.x, fw.y), f5 = 1. - smoothstep(0.25, 1.1, fm), f6 = 1. - smoothstep(0.08, 0.4, fm);
  float h5 = iceN(vec2(p.x * 0.11 + 3.1 * hk, p.y * 0.62 + 1.7 * k)) - 0.5, h6 = iceN(vec2(p.x * 0.47 + k, p.y * 2.9)) - 0.5;   // beds of uneven tone, long along the face
  // (the flutes are soft changes of tone inside a face, never a second terminator: the big light and shade is the buttress's own)
  float tx = (-sin(s2) * (1. + 0.6 * cos(a2)) * 0.11 * f2 - sin(a3) * 0.06 * f3 * (0.4 + 0.6 * h5 + 0.3)) * (1. - 0.6 * cap) * along;
  float ty = 1.4 * under - 1.1 * top + 0.5 * lam * sign(lfr - 0.5) - sin(a4) * 0.05 * f4 * (1. - cap);
  vec3 T = normalize(vec3(-N0.z, 0., N0.x) + vec3(1e-4, 0., 0.)); vec3 Bt = cross(T, N0);
  vec3 N = normalize(N0 - T * tx - Bt * ty);
  float nl = dot(N, uSun), sh = clamp(-gold, 0., 1.);
  float open = clamp(ao * (1. - 0.85 * under) * (1. - 0.3 * contact) * (1. - 0.4 * lam), 0., 1.);
  float key = mix(smoothstep(-0.16, 0.26, nl), 0.55 + 0.45 * smoothstep(-0.2, 0.9, nl), max(gold, 0.)) * open * (1. - sh);
  // ICE: pale cream, clearly lighter than the gold sea; beds differ by a tenth of tone, no more
  vec3 alb = mix(cCream, mix(cCream, cHaze, 0.55), 0.08 + 0.5 * hk) * (0.66 + 0.045 * cos(s2) * f2 + 0.07 * sf * sFade + 0.09 * h5 * f5 + 0.07 * h6 * f6);
  alb = mix(alb, cCream * 0.88, max(max(cap, smoothstep(0.45, 0.8, N.y)), 0.55 * frost));                // frost on lips and ledges, feathers on the walls
  alb *= (1. - 0.3 * lam) * (1. - 0.26 * drip);
  float lum = dot(alb, vec3(0.333)), rake = smoothstep(0.35, 0.9, nl);
  // the lit face: cream under a near-white key, warming to gold only where the tear rakes it square on
  vec3 lit = alb * mix(vec3(1.03, 1.0, 0.95), uIceKey * 1.27, 0.93 + 0.07 * rake) * (0.82 + 0.2 * clamp(nl * 1.5, 0., 1.));
  // the shadowed face: the seed's cool colour, deep in clefts and under lips, lifted by the bounce off the sea
  float fill = 0.74 + 0.3 * dot(N, normalize(vec3(-uSun.x, 0.35, -0.55)));
  vec3 shS = mix(mix(cDeep, cCool, 0.45) * 0.9, mix(cCool * 1.7, cCream, 0.12), open * (0.5 + 0.5 * smoothstep(0.5, 0.82, lum))) * (0.2 + 0.86 * lum) * fill;
  shS *= (1. - 0.7 * under) * (1. - 0.36 * contact) * (1. + 0.9 * top + 0.42 * cap) * (1. - 0.4 * lam);                    // dark under each lip, the ledge tops catch the band
  shS += mix(cCool * 1.6, cCream, 0.55) * 0.15 * (frost + 0.8 * top) * open;                                   // frost is the palest thing on a shadowed wall
  vec3 c = mix(shS, lit, key) + alb * cHaze * 0.05 * open;
  // light comes THROUGH thin ice: lips, caps and the rims of frost glow pale and cool where they stand against the shade
  c += mix(cCool * 1.9, cCream, 0.6) * (0.3 * top + 0.16 * cap) * (0.35 + 0.65 * (1. - key)) * (0.4 + 0.6 * open);
  c *= (1. - 0.2 * lam) * (1. - 0.16 * drip) * (1. + 0.22 * frost * (1. - key));
  // a wet, glossy skin: at a grazing angle the face holds the haze band (and the tear, as a soft sheen)
  float cv = clamp(dot(N, -iceV), 0., 1.), fr = 1. - cv; fr *= fr; fr *= fr;
  vec3 Rr = reflect(iceV, N); Rr = vec3(Rr.x * iceFlip, 0., Rr.z); Rr /= max(length(Rr), 1e-4); Rr = normalize(vec3(Rr.x, 0.09, Rr.z));
  c = mix(c, skyCol(Rr) * 0.95, (0.02 + 0.5 * fr) * (0.35 + 0.65 * open) * (1. - 0.5 * cap));
  float sp = max(dot(reflect(iceV, N), uSun), 0.); sp *= sp; sp *= sp; sp *= sp;
  c += uIceKey * (0.2 * sp + 0.5 * sp * sp * sp) * key;
  return c * (1. - 0.3 * uRainDim);
}
// the headland enters the cloud: its upper face sinks into the lid's rust
vec3 iceCloud(vec3 c, vec2 p){ return mix(c, mix(cDeep, cCool, 0.62) * 0.7, smoothstep(uIce.w, uIce.w + 210., p.y + 26. * sin(p.x * 0.013 + 1.)) * 0.94); }
`;var L0={id:"slow-rain-sea",name:"The Sea of Slow Rain",category:"alien",weirdness:.45,media:["air","open"],async build(S){const{rng:le}=S,de=S.quality?.detail??1,Nt=S.vary?.density??1,Ke=S.vary?.hour??"any",Be=!!S.vary?.rare,Ve=le.fork("variants"),Re=e=>{const t=Ve();return t<e[0]?0:t<e[0]+e[1]?1:2};let te=Re([.4,.3,.3]);Ke==="golden"?te=0:Ke==="dawn"||Ke==="night"?te=1:Ke==="day"&&(te=2);const oe=Be?0:Re([.45,.3,.25]),n0=Re([.45,.3,.25]),St=Re([.5,.25,.25]),$=4+Math.floor(Ve()*5),kt=Ve()<.4,ct=(Re([.3,.3,.4])+1)%3,ft=D0[ct],_e={},ae=ft.map(e=>new o.Color(e)),je=ae[6],me=new o.Scene;me.fog=new o.FogExp2(16777215,a0);const ce=R0([[0,4.5,0],[0,4.2,50],[0,3.8,95],[-20,3.8,150],[-50,3.8,215],[-42,4.2,270],[-6,14,345],[22,40,412],[40.7,58.7,454],[59.3,77.3,496],[78,96,538]].map(e=>[-e[0],e[1],e[2]])),vt=(e,t)=>ce.nearestXZ(-e,t),W=new o.Group;W.scale.x=-1,W.name="brief-space",me.add(W),await S.yield();const De=S.core.smoothstep,At=e=>1.12-.5*De(.16,.27,e)-.19*De(.36,.4,e)*(1-De(.44,.48,e))+.92*De(.455,.62,e)-.42*De(.86,.97,e),We=new Float32Array(257);{let e=0;for(let t=1;t<=256;t++)e+=1/At((t-.5)/256),We[t]=e;for(let t=1;t<=256;t++)We[t]*=45/e}const I=e=>{const t=Math.min(1,Math.max(0,e))*256,r=Math.min(255,Math.floor(t));return We[r]+(We[r+1]-We[r])*(t-r)},I0=e=>{let t=0,r=1;for(let a=0;a<20;a++){const i=(t+r)/2;I(i)<e?t=i:r=i}return(t+r)/2},mt={value:new o.Vector4(Ve()*6.28,Ve()*6.28,0,255)},Ft=[new o.Color(1,.86,.6),new o.Color(1,.62,.36),new o.Color(1,.91,.72)][te],Tt={value:new o.Vector3(0,1,0)},Bt={value:1},Vt=[new o.Color(1,.82,.54),new o.Color(1,.72,.45),new o.Color(1,.86,.6)][te],i0=`uniform vec3 uKey, cTeal, uSunB; uniform float uVeil;
`+s0.replace(/uSun/g,"uSunB")+`
      float mirZ(float y){ return 505. - 64. * exp(-max(y, 0.) / 20.) - 0.045 * max(0., y - 120.); }
      vec3 mirrorCol(vec3 o, vec3 d, vec3 sky){             // o, d in the hero's frame; the face stands in the brief's
        vec3 bo = vec3(-(o.x + 50.), o.y, o.z + 215.), bd = vec3(-d.x, d.y, d.z); float dz = max(bd.z, 0.03);
        float dimK = uVeil, fwd = step(0.03, bd.z);
        float t = (505. - bo.z) / dz, y = bo.y + t * bd.y;
        t = (mirZ(y) - bo.z) / dz; y = bo.y + t * bd.y;
        t = (mirZ(y) - bo.z) / dz; y = bo.y + t * bd.y;
        vec2 p = vec2(bo.x + t * bd.x, y); vec2 fw = max(fwidth(p), vec2(3.5, 6.));        // the mirror keeps the broad bands, not the crisp lips
        // the cape dissolves into haze exactly as the face above the water does (capeFade in the headland shader)
        float hit = fwd * step(0., t) * (1. - smoothstep(500., 540., y)) * smoothstep(-128., -106., p.x - 0.16 * y) * (1. - smoothstep(600., 760., p.x));
        float hi = smoothstep(6., 56., y), cl = iceCleft(iceFluteA(p)) * iceFz(p.x);
        float zx = hi * (iceRelief(p + vec2(2., 0.)) - iceRelief(p)) * 0.5;
        vec3 N0 = normalize(vec3(zx, 3.2 * exp(-max(y, 0.) / 20.), -1.));
        float up = clamp(N0.y, 0., 1.);
        iceV = bd / max(length(bd), 1e-4); iceFlip = -1.;
        vec3 c = iceCol(p, N0, 1. - 0.78 * hi * smoothstep(0.12, 0.8, cl), fw, 1., smoothstep(14., 46., y) * (1. - smoothstep(0.55, 0.85, up)), -(1. - iceLit(p)) * smoothstep(4., 18., y));
        c = iceCloud(c, p);
        float px = p.x - 70.5, slot = smoothstep(46., 48.5, p.x) * (1. - smoothstep(92.5, 95., p.x)) * smoothstep(64., 68., y) * (1. - smoothstep(156., 160., y + 0.03 * px * px));
        c = mix(c, mix(cDeep, cCool, 0.5) * 0.8, slot * 0.9);
        
        #ifdef USE_FOG
          c = mix(c, fogColor, 1. - exp(-fogDensity * fogDensity * t * t));
        #endif
        // inside the rain the headland is only a soft rust shape in the mirror
        c = mix(c, sky, 0.9 * dimK);
        vec3 res = mix(sky, c * mix(vec3(1.), cHaze * 1.2, 0.4) * mix(0.5, 0.78, smoothstep(8., 70., y)) + mix(cDeep, cCool, 0.5) * 0.04, hit);   // the image is a tone deeper and warmer than the wall: a gold mirror, not a second cliff        // the image is a tone deeper than the wall: sea and ice part cleanly
        // the bank of luminous haze between the shaft and the cape (the plane z 385 of 'haze-bank')
        float tb = (385. - bo.z) / dz; vec2 pb = vec2(bo.x + tb * bd.x, bo.y + tb * bd.y);
        float ab = (1. - smoothstep(-6., 66., pb.x + 15.)) * smoothstep(-420., -250., pb.x) * (1. - smoothstep(40., 185., pb.y + 35.)) * smoothstep(150., 300., tb) * fwd;
        res = mix(res, mix(cCream, cHaze, 0.42) * mix(vec3(1.), uKey, 0.5) * 1.04, ab * 0.86 * (1. - dimK));
        // the shaft: a soft rust pillar standing in the mirror directly under the column of rain
        vec2 dn = d.xz / max(length(d.xz), 1e-3); float along = -dot(o.xz, dn), perp = abs(o.x * dn.y - o.z * dn.x);
        float sh = (1. - smoothstep(48. + 150. * smoothstep(0.12, 0.5, d.y), 96. + 170. * smoothstep(0.12, 0.5, d.y), perp)) * smoothstep(60., 130., along) * (1. - 0.5 * dimK);
        res = mix(res, mix(cRust, cEmber, 0.55) * 0.92, sh * 0.62);
        return res;
      }`,j=await _0(S,{palette:ft,cool:W0[te===2||ct===2?2:ct],detail:de,sea:!0,seaRadius:1700,lid:!0,light:te,rain:oe,swell:n0,mirror:{glsl:i0,uniforms:{uKey:{value:Ft},cTeal:{value:je},uSunB:Tt,uIce:mt,uVeil:Bt,uIceKey:{value:Vt}}},track:[[-50,6,-215],[-50,6,-120],[-30,5,-65],[0,3.8,0],[-8,4.2,55],[-44,14,130]],clear:4.8});j.object.position.set(-R[0],R[1],R[2]),me.add(j.object);const we=j.uniforms;j.setDrift(-.5,3.3),j.setCalm(-236,172,50,40);const Ie=we.uSun.value.clone();Tt.value.copy(Ie),j.setSun(new o.Vector3(-Ie.x,Ie.y,Ie.z));const se=new o.Vector3,r0=[0,0,0][te],Se={uKey:{value:Ft},uDusk:{value:te===1?1:0},uU:{value:0},uVeil:Bt,uIn:{value:0},uIceKey:{value:Vt},cTeal:{value:je},uSun:{value:Ie},uCamB:{value:se}},l0={uSun:we.uSun},q=(e={})=>({...o.UniformsUtils.clone(o.UniformsLib.fog),...we,...Se,...e}),be=j.glsl.hash,Q=j.glsl.sky,L=`#include <fog_pars_vertex>
`,E=`#include <fog_pars_fragment>
`,he=new o.Sphere(new o.Vector3(0,100,250),5e3),ze=[],ne=[],ye=[];await S.yield();{const e=new o.SphereGeometry(3600,48,24),t=new o.ShaderMaterial({uniforms:q({uFogCol:{value:me.fog.color},...l0}),side:o.BackSide,depthWrite:!1,depthTest:!1,fog:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`uniform float uTime; uniform vec3 uFogCol; uniform vec3 uKey;
`+Q+`
          varying vec3 vD;
          void main(){
            vec3 d = normalize(vD);
            float a = uTime * 0.0052; float ca = cos(a), sa = sin(a);       // the lid turns once in twenty minutes
            vec3 dr = vec3(d.x * ca - d.z * sa, d.y, d.x * sa + d.z * ca);
            vec3 c = skyCol(vec3(dr.x, max(dr.y, 0.), dr.z) / max(length(vec3(dr.x, max(dr.y, 0.), dr.z)), 1e-4));
            c = mix(c, skyCol(vec3(d.x, max(d.y, 0.), d.z) / max(length(vec3(d.x, max(d.y, 0.), d.z)), 1e-4)), 1. - smoothstep(0.15, 0.4, d.y));
            // rays: a fan about the torn patch, only in the haze band and just under the lid
            vec3 r = normalize(vec3(-uSun.z, 0., uSun.x) + vec3(1e-5, 0., 0.)); vec3 up = cross(uSun, r);
            float px = dot(d, r), py = dot(d, up); float ang = atan(py, px + 1e-5);
            float sd = clamp(dot(d, uSun), -1., 1.); float off = 1. - sd;
            float fan = 0.5 + 0.5 * sin(ang * 6. + 0.6 * sin(ang * 2. + uTime * 0.05) + uTime * 0.021);
            fan *= fan; fan *= 0.6 + 0.4 * sin(ang * 13. - uTime * 0.033);
            float reach = smoothstep(0.004, 0.03, off) * (1. - smoothstep(0.08, 0.75, off));
            float under = smoothstep(-0.01, 0.03, d.y) * (1. - smoothstep(0.22, 0.5, d.y));
            c *= 1. - 0.34 * reach * under * (1. - fan) * (1. - uRainDim);
            c += uKey * fan * reach * under * 0.3 * (1. - 0.7 * uRainDim);
            c = mix(uFogCol, c, smoothstep(-0.012, 0.03, d.y));
            gl_FragColor = vec4(c, 1.);
          }`}),r=new o.Mesh(e,t);r.renderOrder=-10,r.frustumCulled=!1,me.add(r),ne.push((a,i,v)=>{v.getWorldPosition(r.position)})}await S.yield();const ie=S.noise,M=S.core.smoothstep;Se.uIce=mt;const G={x0:48,x1:93,floorY:68,topY:158,back:556},xe=mt.value,Le=(e,t)=>{const r=e+.1*t*Math.sin(e*.0071+1.3+xe.y);return r*.068+xe.x+1.9*Math.sin(r*.0137+.7+xe.y)+.9*Math.sin(r*.0331+2.1+xe.x)+.35*Math.sin(t*.011+r*.004)},ht=e=>{let t=.5-.5*Math.cos(e);return t*=t,t*t*(.6+.4*Math.sin(e*.159+1))},H0=(e,t)=>1-ht(Le(e,t)),c0=e=>{const t=(e-Math.PI)/(2*Math.PI);return t-Math.floor(t)},f0=e=>{const t=c0(e),r=1-Math.min(t/.74,(1-t)/.26);return Math.sqrt(r*r+.003)},Ee=(e,t)=>{const r=e*.37+2.6*Math.sin(e*.041+.9*xe.x)+1.2*Math.sin(e*.09+2)+.8*Math.sin(t*.023+e*.013);return(.5-.5*Math.cos(r+.5*Math.sin(r)))*(.25+.75*M(-.4,.6,Math.sin(e*.017+t*.009+xe.y)))},ke=(e,t)=>{const r=(Le(e,t)-Math.PI)/(2*Math.PI),a=Math.floor(r),i=r-a-.5,v=t+6*Math.sin(e*.0113+xe.y)+3*Math.sin(e*.031+4.1)+i*15*Math.sin(a*2.7+xe.y)+8*Math.sin(a*4.3+1);return ke.ds=1/21+.0279*Math.cos(v*.045+2)+.0132*Math.cos(v*.11+.7),v/21+.62*Math.sin(v*.045+2)+.12*Math.sin(v*.11+.7)},v0=e=>e-Math.floor(e),Rt=e=>v0(Math.sin(e*12.9898+4.1)*43758.5453),_t=(e,t)=>1-Math.min(.4,Math.max(.07,4.6*t*(.6+.8*Rt(e)))),m0=(e,t)=>M(-.45,.2,Math.sin(e*.019+t*2.4)+.6*Math.sin(e*.043+t*5.1+1)),Dt=(e,t)=>{const r=Math.floor(e),a=e-r,i=_t(r,ke.ds);return M(i-.065,i+.01,a)*(1-M(.94,1,a))*m0(t,r)},Ue=e=>e/2.4+.25*Math.sin(e*.37+1),pt=e=>{let t=e*2.4-.7,r=e*2.4+.7;for(let a=0;a<16;a++){const i=(t+r)/2;Ue(i)<e?t=i:r=i}return(t+r)/2},h0=e=>{const t=Ue(e),r=Math.floor(t);return r+Math.min(1,(t-r)/.12)},H=(e,t,r,a)=>{const i=ie.fbm2(e*.004,t*.006,3);let v=505-64*Math.exp(-Math.max(t,-8)/20)+22*i-.045*Math.max(0,t-120);const d=M(6,56,t),n=Le(e,t),m=M(40,74,Math.abs(e-170))*M(49,68,Math.abs(e-46.5)),f=ht(n)*m;v+=d*(24*f+1.1*Ee(e,t)+16*f0(n)*m+3*Ee(e*.8+31,t)*(1-m)*(1-M(40,47,e)));let l=1-.78*d*M(.12,.8,f);if(!r){const y=ke(e,t);v-=2.6*Dt(y,e)*M(40,56,t)*(1-M(190,230,t))}const p=(1-M(10,34,Math.abs(e-170)+6*ie.n2(t*.02,3.1)))*M(188,214,t);v+=70*p,l-=.75*p;const s=(1-M(21,40,Math.abs(e-170)+6*ie.n2(t*.02,3.1)))*M(48,120,t)*(1-p);v+=24*s,l-=.6*s;const u=Math.max(0,-40-e),h=Math.max(0,e-560);v+=.012*u*u+.004*h*h;const x=416+(t-23)*2.25,b=(1-M(10,24,Math.abs(e-(t-2.2))))*M(16,30,t)*(1-M(62,70,t)),c=!r&&b>0?416+(pt(h0(t))-23)*2.25:x;if(b>0&&c>v&&(v+=(c-v)*b),!a){const y=M(45.2,46.8,e)*(1-M(94.2,95.8,e))*(1-M(158.5,161,t+.03*(e-70.5)*(e-70.5)))*M(59,63,t);if(y>0){const g=Math.min(G.back+6,x);g>v&&(v+=(g-v)*y,l-=.5*y)}}return H.ao=Math.max(.1,l),v},Wt=(e,t="")=>`uniform float uTime, uVeil; uniform vec3 uCamB;
`+Q+re+s0+E+`
      varying vec3 vN, vP; varying vec4 vA; varying vec2 vB; uniform float uU; uniform vec3 cTeal;
      float h21(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
      float glint(vec2 q, float fwq){ vec2 sc = q * 6.; vec2 sf = fract(sc) - 0.5;
        return step(0.985, h21(floor(sc) + floor(uTime * 1.5 + h21(floor(sc)) * 7.))) * (1. - smoothstep(0.1, 0.45, length(sf))) * (1. - smoothstep(0.05, 0.25, fwq)); }
      // broken plates: a warped grid of slabs, each with its own tilt (xy) and tone (w), dark cracks between (z)
      vec4 plates(vec2 q, float fwq){ vec2 w = vec2(q.x * 0.8 + q.y * 0.6, q.y * 0.8 - q.x * 0.6) + 0.42 * vec2(sin(q.y * 1.7 + 0.8 * sin(q.x * 0.9)), sin(q.x * 1.3 + 0.9 * sin(q.y * 0.7)));
        vec2 id = floor(w), f = fract(w); float h = h21(id), h2 = h21(id + 17.3);
        float e = min(min(f.x, 1. - f.x), min(f.y, 1. - f.y)) * (0.6 + 0.8 * h2);
        return vec4(h - 0.5, h2 - 0.5, (1. - smoothstep(0.02 + fwq, 0.09 + 2. * fwq, e)) * (1. - smoothstep(0.2, 0.6, fwq)), h); }
      // one flight of steps along the coordinate tq (tw its footprint): x riser, y lip, z tread, w the shade at the back of a tread
      vec4 stepsAt(float tq, float tw, float rz){ float tf = fract(tq), fade = 1. - smoothstep(0.45, 1.1, tw);
        float riser = smoothstep(rz - tw, rz + 0.03 + tw, tf) * (1. - smoothstep(0.955 - tw, 0.985, tf));
        float lip = smoothstep(0.94 - tw, 0.975, tf) + (1. - smoothstep(0.0, 0.045 + tw, tf));
        float tread = 1. - smoothstep(rz - tw, rz + 0.03 + tw, tf);
        return vec4(riser, lip, tread, smoothstep(rz - 0.16, rz - 0.01, tf) * tread) * fade; }
      void main(){
        vec3 N0 = normalize(vN + vec3(0., 0., -1e-4)); vec3 c;
        ${e}
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
        ${t}
      }`,It=L+`
      attribute vec4 aA; attribute vec2 aB; varying vec3 vN, vP; varying vec4 vA; varying vec2 vB;
      void main(){ vN = normal; vP = position; vA = aA; vB = aB;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`;{const e=Math.round(196*Math.max(.8,Math.sqrt(de))),t=[];for(let s=0;s<14;s++)t.push(-9+64*s/14);for(let s=0;s<70;s++)t.push(55+110*s/70);for(let s=Math.ceil(Ue(15));s<=Math.floor(Ue(67));s++)t.push(pt(s)+.004,pt(s+.12));t.sort((s,u)=>s-u);for(let s=t.length-1;s>0;s--)t[s]-t[s-1]<.03&&t.splice(s,1);for(let s=0;s<=62;s++){const u=s/62;t.push(165+375*(.35*u+.65*u*u))}const r=t.length-1,a=(e+1)*(r+1),i=new Float32Array(a*3),v=new Float32Array(a*3),d=new Float32Array(a*4),n=new Float32Array(a*2).fill(1),m=[];await S.yield();for(let s=0,u=0;s<=r;s++){const h=t[s];for(let x=0;x<=e;x++,u++){const b=x/e*2-1,c=Math.abs(b),y=70+(b<0?-420*(.2*c+.8*c*c*c):700*(.13*c+.87*c*c*c)),g=H(y,h,!0),z=H.ao,w=(H(y+1.5,h,!0)-g)/1.5,C=(H(y,h+1.5,!0)-g)/1.5,N=1/Math.hypot(w,C,1);i[u*3]=y,i[u*3+1]=h,i[u*3+2]=H(y,h),v[u*3]=w*N,v[u*3+1]=C*N,v[u*3+2]=-N,d[u*4]=z}await S.yield()}for(let s=0;s<r;s++){for(let u=0;u<e;u++){const h=s*(e+1)+u,x=h+1,b=h+e+1,c=b+1;m.push(h,x,b,x,c,b)}s%24===23&&await S.yield()}await S.yield();const f=new o.BufferGeometry;f.setAttribute("position",new o.BufferAttribute(i,3)),f.setAttribute("normal",new o.BufferAttribute(v,3)),f.setAttribute("aA",new o.BufferAttribute(d,4)),f.setAttribute("aB",new o.BufferAttribute(n,2)),f.setIndex(m),f.boundingSphere=he,await S.yield();const l=new o.ShaderMaterial({uniforms:q(),fog:!0,side:o.DoubleSide,vertexShader:It,fragmentShader:Wt(`
          vec2 fw = fwidth(vP.xy); float up = clamp(N0.y, 0., 1.);
          float gully = (1. - smoothstep(30., 58., abs(vP.x - (vP.y + 6.)))) * smoothstep(16., 30., vP.y) * (1. - smoothstep(64., 72., vP.y));
          float strata = smoothstep(14., 46., vP.y) * (1. - smoothstep(0.55, 0.85, up)) * (1. - gully);
          // STEPPED SHELVES: the apron comes down to the sea in ledges of unequal rise (a frosted tread, a lit lip, a shaded
          // riser); under the climb they are the notch floor's own stair carried down the gully. No plates, no cracks.
          float gullyW = (1. - smoothstep(46., 86., abs(vP.x - (vP.y + 6.)))) * smoothstep(16., 30., vP.y) * (1. - smoothstep(64., 72., vP.y));   // the stair of ledges spreads wider than the smooth ramp
          float ter = max(1. - smoothstep(18., 52., vP.y), gullyW);
          float tyq = vP.y / 6.4 + 0.3 * sin(vP.x * 0.021 + 1.3 * sin(vP.x * 0.009 + uIce.x)) + 0.1 * sin(vP.x * 0.083 + 2.) + 0.035 * sin(vP.x * 0.37);
          float tzq = vP.y / 2.4 + 0.25 * sin(vP.y * 0.37 + 1.);       // the gully stair's step coordinate (CPU twin: stairSq)
          // (two flights, never one coordinate bent into the other: the shelves of the apron die out at the edge of the carved
          // gully and the stair begins inside it)
          float carve = (1. - smoothstep(9., 22., abs(vP.x - (vP.y - 2.2)))) * smoothstep(16., 30., vP.y) * (1. - smoothstep(62., 70., vP.y));
          float gz = smoothstep(0.3, 0.7, carve) * (1. - smoothstep(62., 67., vP.y)), twy = fwidth(tyq) + 1e-4, twz = fwidth(tzq) + 1e-4, tky = floor(tyq), tkz = floor(tzq);
          float tpin = smoothstep(-0.55, -0.05, sin(vP.x * 0.027 + tky * 2.4) + 0.6 * sin(vP.x * 0.061 + tky * 5.1 + 1.));
          float rzy = 0.62 + 0.16 * iceHk(tky), rzz = 0.12;
          float tfS = fract(tzq), trS = 1. - smoothstep(0.115 - twz, 0.13 + twz, tfS), lipS = (1. - smoothstep(0.01, 0.022 + twz, tfS)) + smoothstep(0.92 - twz, 0.965, tfS);
          vec4 stS = vec4((1. - trS) * (1. - smoothstep(0.92, 0.965, tfS)), min(lipS, 1.), trS, smoothstep(0.06, 0.115, tfS) * trS) * (1. - smoothstep(0.8, 1.8, twz));
          float tgq = vP.y / 4.7 + 0.42 * sin(vP.y * 0.29 + 1.3) + 0.2 * sin(vP.x * 0.11 + 1.1 * sin(vP.x * 0.047)) + 0.05 * sin(vP.x * 0.61), twg = fwidth(tgq) + 1e-4, tkg = floor(tgq);
          float gpin = smoothstep(-0.5, 0.0, sin(vP.x * 0.071 + tkg * 2.4) + 0.6 * sin(vP.x * 0.17 + tkg * 5.1 + 1.));
          float gst = smoothstep(0.3, 0.75, gullyW) * (1. - gz) * (1. - smoothstep(63., 69., vP.y)) * gpin;
          vec4 st4 = (stepsAt(tyq, twy, rzy) * tpin * (1. - gst) * (1. - gz) * (1. - smoothstep(48., 62., vP.y)) + stepsAt(tgq, twg, 0.3 + 0.2 * iceHk(tkg)) * gst + stS * gz) * ter;
          float riser = st4.x, lip = st4.y, tread = st4.z, foot = st4.w;
          float tf = gz > 0.5 ? fract(tzq) : fract(tyq), tk = gz > 0.5 ? tkz : tky, tw = gz > 0.5 ? twz : twy, rz = gz > 0.5 ? rzz : rzy;
          N0 = normalize(mix(N0, vec3(0., 0.4, -0.92), 0.72 * gully));
          N0 = normalize(mix(N0, vec3(0., 0.1, -1.), 0.8 * riser)); N0 = normalize(mix(N0, vec3(0., 1., -0.12), 0.8 * tread));
          // the face to port of the notch lies in the long shadow of its buttress: the slot opens between a violet wall and a gold one
          float xs = vP.x + 0.1 * (vP.y - 100.) + 5. * sin(vP.y * 0.07 + 1.);
          float lowS = clamp((68. - vP.y) / 30., 0., 1.), xe2 = vP.x + 16. * lowS + 3. * sin(vP.y * 0.13 + 0.6 * sin(vP.x * 0.2)) * lowS;
          float shL = smoothstep(-52., -24., xs) * (1. - smoothstep(46. - 9. * lowS, 51. + 5. * lowS, xe2)) * smoothstep(34., 66., vP.y) * (1. - smoothstep(175., 235., vP.y));
          iceV = normalize(vP - uCamB + vec3(0., 0., 1e-4));
          float hiF = smoothstep(4., 18., vP.y) * (1. - gully), shA = max(shL, (1. - iceLit(vP.xy)) * hiF);
          c = iceCol(vP.xy, N0, vA.x * (1. - 0.3 * foot), fw, 1., strata, -max(shL, (1. - iceLit(vP.xy)) * hiF));
          c += mix(cCool * 1.9, cCream, 0.55) * 0.34 * iceArris(vP.xy) * hiF * vA.x * (1. - shL) * (1. - 0.3 * uRainDim);      // the thin arris of each buttress glows
          float lamT = smoothstep(0.35, 0.9, sin(tf * 70. + 2. * sin(vP.x * 0.31) + tk)) * (1. - smoothstep(0.08, 0.3, tw * 11.));
          float dripT = smoothstep(0.55, 0.9, sin(vP.x * 2.1 + 2. * sin(vP.x * 0.47 + tk * 3.))) * smoothstep(rz + 0.04, rz + 0.3, tf) * (1. - smoothstep(0.3, 1.2, fw.x * 2.1));
          c = mix(c, mix(cCool * 1.3, cDeep, 0.3) * (0.42 + 0.7 * dot(c, vec3(0.333))), riser * (0.8 + 0.1 * lamT + 0.08 * dripT));   // risers hold the dusk
          c *= 1. - 0.3 * foot;
          c = mix(c, cCream * mix(vec3(1.), uKey, 0.65) * mix(1.04, 0.46, shA), 0.72 * lip);                                   // the lip of every shelf catches the tear
          { float wl = vP.y - 0.5 * sin(vP.x * 0.21 + 1.3 * sin(vP.x * 0.057)), wn = iceN(vP.xy * vec2(0.35, 0.9));            // the dark wet foot: a band of the cool colour the swell keeps washed
            float wet = 1. - smoothstep(3.4, 5.6, wl + 1.4 * wn);
            c = mix(c, mix(cDeep, cCool, 0.6) * (0.42 + 0.3 * wn), 0.9 * wet);
            float rim = (1. - smoothstep(0.2, 0.9, abs(wl - 1.2 - 1.6 * (wn - 0.5)))) * smoothstep(0.5, 0.68, iceN(vP.xz * vec2(0.83, 0.47) + 3.)) * smoothstep(0.3, 0.6, iceN(vP.xz * 3.1)) * (1. - smoothstep(0.6, 2.4, fw.y));
            c = mix(c, cCream * mix(vec3(1.), uKey, 0.4) * 0.9, 0.8 * rim); }                                        // a broken rim of stranded crumb ice
          c += mix(uKey, vec3(1.), 0.55) * 1.3 * glint(vP.xy + vP.z * 0.7, max(fw.x, fw.y)) * smoothstep(0.3, 0.7, max(up, tread) + 0.5 * step(0.8, fract(iceSy(vP.xy))));
          c += mix(uKey, vec3(1.), 0.55) * 1.5 * glint(vP.xy * 0.37 + vP.z * 0.21 + 11., max(fw.x, fw.y) * 0.37) * iceLit(vP.xy) * hiF * vA.x;
          { float chm = (1. - smoothstep(24., 44., abs(vP.x - 170.) + 5. * sin(vP.y * 0.05))) * smoothstep(52., 110., vP.y) * (1. - smoothstep(215., 250., vP.y));
            c = mix(c, mix(cDeep, cCool, 0.55) * (0.3 + 0.42 * dot(c, vec3(0.333))), 0.82 * chm); }
          c = iceCloud(c, vP.xy);`,`
          // the cape does not end in an edge: it dissolves into the haze (the mirror fades it the same way)
          vec3 dv = vP - uCamB; float dl = max(length(dv), 1e-3); dv /= dl;
          float ta = uTime * 0.0052, ca = cos(ta), sa = sin(ta); vec3 dw = vec3(-dv.x, max(dv.y, 0.), dv.z);
          vec3 dr = vec3(dw.x * ca - dw.z * sa, dw.y, dw.x * sa + dw.z * ca);
          vec3 skc = mix(skyCol(dw / max(length(dw), 1e-4)), skyCol(dr / max(length(dr), 1e-4)), smoothstep(0.15, 0.4, dv.y));
          float cape = 1. - smoothstep(-128., -106., vP.x - 0.16 * vP.y + 9. * sin(vP.y * 0.021 + 1.) + 4. * sin(vP.y * 0.057));
          gl_FragColor.rgb = mix(gl_FragColor.rgb, skc, cape);
          // seen from inside the rain the headland is a soft rust shape, no more
          gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(fogColor * 0.9, skc, 0.8), 0.96 * uVeil * smoothstep(40., 220., dl) * (1. - cape));`)}),p=new o.Mesh(f,l);p.name="headland",W.add(p),ye.push(p)}await S.yield();const ut=(e,t,r)=>{const a=ke(r,t);return e*(1.9*Dt(a,r)+2.4*Ee(r*1.7+40*e,t)+1.2*ie.n2(r*.09+7*e,t*.05))};{const v=G.back,d=7896,n=new Float32Array(d*3),m=new Float32Array(d*3),f=new Float32Array(d*4),l=new Float32Array(d*2),p=[],s=w=>G.floorY+(w-505)/2.3,u=(w,C,N,P)=>{const k=G.x0+9*C*C-N,F=G.x1-2*C*C+N,B=V=>G.topY-14*C*C+N-.03*(V-70.5)*(V-70.5);return w<64?(P.k=0,P.v=w/64,P.x=k,P.y=B(k)):w<86?(P.k=1,P.v=(w-64)/22,P.x=k+(F-k)*P.v,P.y=B(P.x)):w<150?(P.k=2,P.v=1-(w-64-22)/64,P.x=F,P.y=B(F)):(P.k=3,P.v=(w-128-22)/18,P.x=F+(k-F)*P.v,P.y=0),P},h={},x={};for(let w=0;w<168;w++){u(w,0,4.2,x);const C=x.k,N=x.v,P=C===3?G.floorY-4:C===1?x.y:G.floorY-4+N*(x.y-G.floorY+4),k=H(x.x,Math.max(P,60),!1,!0)-.5;for(let F=0;F<=46;F++){const B=Math.pow(F/46,1.25),V=F*168+w,U=4.2*Math.pow(1-M(0,.09,B),2);u(w,B,U,h);const O=k+(v-k)*B,Te=s(O)-U*.9,st=h.x+.83*(O-k);let ue=h.x,ge=h.k===3?Te:h.k===1?h.y:Te+h.v*(h.y-Te),Ct=ue,nt=ge;const He=1-U/4.2;h.k===0?ue+=He*ut(1,ge,st)*M(0,.06,h.v):h.k===2?ue+=He*ut(-1,ge,st)*M(0,.06,h.v):h.k===3?(ge+=.25*ie.n2(ue*.22,O*.22)*He,nt=G.floorY+(O-505)/2.3-U*.9):ge-=1.6*Ee(st*1.7,200)*He;const it=Math.pow(Math.cos(Math.PI/2*M(.74,1,B)),.7),rt=78,lt=97;ue=rt+(ue-rt)*it,ge=lt+(ge-lt)*it,Ct=rt+(Ct-rt)*it,nt=lt+(nt-lt)*it,n[V*3]=ue,n[V*3+1]=ge,n[V*3+2]=O,m[V*3]=Ct,m[V*3+1]=nt,m[V*3+2]=O;const o0=M(.5,.8,B);f[V*4]=(h.k===1?.6:1)*(1-.8*o0),f[V*4+1]=st,f[V*4+2]=h.k===0?.83:h.k===2?-.83:h.k===3?2:1,f[V*4+3]=(h.k===2?.6+.3*h.v:h.k===3?.6*M(62,88,ue)-.8*(1-M(52,70,ue)):h.k===0?-.9:-.6)*(1-.7*o0)*He,l[V*2]=1-M(3,13,O-k),l[V*2+1]=M(.62,.9,B)}w%4===3&&await S.yield()}await S.yield();for(let w=0;w<46;w++)for(let C=0;C<168;C++){const N=w*168+C,P=w*168+(C+1)%168,k=N+168,F=P+168;p.push(N,P,k,P,F,k)}const b=new o.BufferGeometry;b.setAttribute("position",new o.BufferAttribute(m,3)),b.setIndex(p),b.computeVertexNormals();const c=b.attributes.normal.array;for(let w=0;w<d;w++){const C=Math.floor(w/168)/46,N=71,P=G.floorY+(m[w*3+2]-505)/2.3+30*(1-.5*C);c[w*3]*(N-m[w*3])+c[w*3+1]*(P-m[w*3+1])+c[w*3+2]*-.3<0&&(c[w*3]*=-1,c[w*3+1]*=-1,c[w*3+2]*=-1)}await S.yield();const y=new o.BufferGeometry;y.setAttribute("position",new o.BufferAttribute(n,3)),y.setAttribute("normal",new o.BufferAttribute(c.slice(),3)),y.setAttribute("aA",new o.BufferAttribute(f,4)),y.setAttribute("aB",new o.BufferAttribute(l,2)),y.setIndex(p),y.boundingSphere=he,b.dispose();const g=new o.ShaderMaterial({uniforms:q(),fog:!0,side:o.DoubleSide,vertexShader:It,fragmentShader:Wt(`
          vec2 p = vec2(vA.y, vP.y); vec2 fw = fwidth(p); float up = abs(N0.y);
          float inside = smoothstep(0.64, 0.8, uU);                                  // seen from the sea the slot is in shadow
          float strata = (1. - smoothstep(0.5, 0.8, up)) * (1. - 0.75 * vB.y) * (1. - smoothstep(1.3, 1.7, vA.z));   // (the sill's face carries no flutes or drips: they striped it)
          // the slot's own fine ledges: a lip every three metres or so that comes and goes along the wall, a dark undercut
          // beneath it, frost on its top (the icicle rows hang from these: ledgeYJ below is the twin)
          float wall = (1. - smoothstep(0.5, 0.8, up)) * (1. - 0.5 * vB.y) * (1. - smoothstep(0.86, 0.98, abs(vA.z)));
          float ly = vP.y / 3.2 + 0.35 * sin(vA.y * 0.21 + 1.7 * sin(vA.y * 0.083)) + 0.12 * sin(vA.y * 0.57);
          float lk = floor(ly), lf = ly - lk, lw = fwidth(ly) + 1e-4, le = 0.7 + 0.18 * iceHk(lk);
          float lpin = smoothstep(-0.25, 0.25, sin(vA.y * 0.13 + lk * 2.4) + 0.6 * sin(vA.y * 0.31 + lk * 5.1)) * wall * (1. - smoothstep(0.25, 0.7, lw));
          float lUnder = smoothstep(le - 0.2 - lw, le - 0.04, lf) * (1. - smoothstep(le, le + 0.03 + lw, lf)) * lpin;
          float lCap = smoothstep(le, le + 0.03 + lw, lf) * (1. - smoothstep(0.9, 0.98, lf)) * lpin;
          float lTop = smoothstep(0.9, 0.97, lf) * lpin;
          float lam2 = smoothstep(0.55, 0.95, sin(vP.y * 9.5 + 2. * sin(vA.y * 0.31) + 1.3 * sin(vA.y * 1.1))) * wall * (1. - smoothstep(0.12, 0.4, fwidth(vP.y) * 9.5));
          // the floor is a staircase of frost ledges: a shaded riser with laminae and drips, a bright lip, a cracked frosted tread
          float flr = smoothstep(1.3, 1.7, vA.z) * (1. - vB.y);
          float qz = (vP.z - 505.) / 4. + 0.05 * sin(vP.x * 0.23 + 1.3 * sin(vP.x * 0.071)) + 0.02 * sin(vP.x * 0.9), fz = fract(qz), wz = fwidth(qz) + 1e-4;
          float riser = smoothstep(0.6 - wz, 0.64 + wz, fz) * (1. - smoothstep(0.95 - wz, 0.985, fz)) * flr;
          float lip = (smoothstep(0.93 - wz, 0.97, fz) + (1. - smoothstep(0.03, 0.1 + wz, fz))) * flr;
          vec3 Nf = normalize(N0 + vec3(0., -0.5, -1.1) * riser);
          vec2 fwz = vec2(fwidth(vP.x), fwidth(vP.z)); float fwq = max(fwz.x, fwz.y);
          vec4 pt = plates(vP.xz / 2.7 + 3.1, fwq / 2.7);
          Nf = normalize(Nf + vec3(pt.x, 0., pt.y) * 0.05 * flr * (1. - riser) * (1. - smoothstep(0.25, 0.7, fwq / 2.7)) + vec3(0., 0.5 * lTop - 0.9 * lUnder, 0.));
          iceV = normalize(vP - uCamB + vec3(0., 0., 1e-4));
          c = iceCol(p, Nf, vA.x * mix(mix(0.22, 1., vB.x), 1., inside), fw, min(vA.z, 1.), strata, vA.w * inside);
          c = mix(c, mix(cDeep, cCool, 0.45) * (0.34 + 0.3 * dot(c, vec3(0.333))), 0.8 * (1. - inside) * (1. - vB.x));
          float shw = clamp(-vA.w * 1.3, 0., 1.) * inside;                           // the wall kept in shadow
          c *= (1. - 0.62 * lUnder) * (1. - 0.2 * lam2);
          c = mix(c, mix(cCream * mix(vec3(1.), uKey, 0.6) * 0.98, mix(cCool * 1.8, cCream, 0.5) * 0.6, shw), 0.5 * lCap + 0.62 * lTop);
          float lamR = smoothstep(0.5, 0.9, sin(vP.y * 8.3 + 2. * sin(vP.x * 0.37))) * (1. - smoothstep(0.1, 0.35, fwidth(vP.y) * 8.3));
          float dripR = smoothstep(0.55, 0.9, sin(vP.x * 2.3 + 2. * sin(vP.x * 0.51 + floor(qz) * 3.))) * smoothstep(0.62, 0.9, fz) * (1. - smoothstep(0.3, 1.2, fwz.x * 2.3));
          c *= (1. - riser * (0.2 * lamR + 0.22 * dripR)) * (1. + 0.5 * lip) * (1. + flr * (1. - riser) * 0.14 * pt.x);
          c = mix(c, mix(cCool * 1.3, cDeep, 0.3) * (0.42 + 0.7 * dot(c, vec3(0.333))), riser * 0.62);            // risers hold the dusk, as on the stair below
          c = mix(c, c * 0.5 + cCream * mix(cCool * 1.7, uKey, 0.5 + 0.5 * clamp(vA.w, -1., 1.)) * 0.5, 0.6 * lip * inside);
          float fl = max(smoothstep(0.5, 0.85, N0.y), flr * (1. - riser));           // frost ledges catching glints
          c += uKey * 1.7 * (glint(vP.xz * 1.3, max(fw.x, fw.y)) + flr * glint(vP.xz * 2.9 + 5., fwq)) * (fl + 0.4 * strata * step(0.79, fract(iceSy(p))) + 0.9 * lTop + 0.5 * lCap);
          vec3 dq = vP - vec3(78., 96., 538.); c += cTeal * 0.16 * exp(-dot(dq, dq) / 300.);`,`
          // seen from inside the rain the slot is lost in the dusk with the headland it is cut in
          vec3 dv = vP - uCamB; float dl = max(length(dv), 1e-3); dv /= dl; vec3 dw = vec3(-dv.x, max(dv.y, 0.), dv.z);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(fogColor * 0.9, skyCol(dw / max(length(dw), 1e-4)), 0.8), 0.96 * uVeil * smoothstep(40., 220., dl));`)}),z=new o.Mesh(y,g);z.name="notch",z.frustumCulled=!1,W.add(z),ye.push(z)}await S.yield();{const e=le.fork("icicles"),t=Math.round(1500*Math.max(.7,de)),r=new Float32Array(t*4),a=new Float32Array(t*4),i=(p,s)=>{let u=s*21-70,h=s*21+80;for(let x=0;x<17;x++){const b=(u+h)/2;ke(p,b)<s+_t(s,ke.ds)?u=b:h=b}return u},v=(p,s)=>3.2*(s+.7+.18*Rt(s)-.35*Math.sin(p*.21+1.7*Math.sin(p*.083))-.12*Math.sin(p*.57));let d=0;for(let p=0;p<t*6&&d<t;p++){p%40===39&&await S.yield();const s=e()<.5,u=3+Math.floor(e()*(s?4:8));let h,x,b,c=0,y=1,g=!1,z=u;if(s){const C=e()<.7,N=e.range(.1,.8),P=C?G.x0+9*N*N:G.x1-2*N*N,k=H(P,100,!1,!0)-.5;b=k+(G.back-k)*N;const F=P+.83*(b-k),B=2*Math.floor(e.range(11,24));if(g=e()<.72,g&&Math.sin(F*.13+B*2.4)+.6*Math.sin(F*.31+B*5.1)<.1||(x=g?v(F,B)-.04:i(F,u),z=g?B:u,x>G.topY-14*N*N-.03*(P-70.5)*(P-70.5)-6||x<G.floorY+(b-505)/2.3+7))continue;h=P+ut(C?1:-1,x,F)+(C?.25:-.25),c=C?-1:.8,y=1-.5*M(.55,1,N)}else{if(h=70.5+(e()<.5?-1:1)*(27+150*Math.pow(e(),1.7)),x=i(h,u),b=H(h,x)-.5,y=H.ao,y<.45)continue;h<48&&h>-34&&x>50&&x<190&&(c=-1)}if(ie.n2(h*.11+b*.09,z*3.7)<(g?-.3:-.15))continue;const w=(1.2+5.5*Math.pow(e(),2.2))*(.7+.5*ie.n2(h*.3+b*.3,u))*(g?.42:1);r.set([h,x,b,Math.max(.8,w)],d*4),a.set([e(),c,y,g?.06+.03*w:.11+.035*w],d*4),d++}const n=new o.ConeGeometry(1,1,5,1,!0);n.translate(0,-.5,0),n.rotateX(Math.PI),n.translate(0,-1,0);const m=new o.InstancedBufferGeometry;m.setAttribute("position",n.attributes.position),m.setAttribute("normal",n.attributes.normal),m.setIndex(n.index),m.setAttribute("aP",new o.InstancedBufferAttribute(r,4)),m.setAttribute("aQ",new o.InstancedBufferAttribute(a,4)),m.instanceCount=d,m.boundingSphere=he,ze.push(n);const f=new o.ShaderMaterial({uniforms:q(),fog:!0,side:o.DoubleSide,vertexShader:`uniform vec3 uCamB; uniform float uTime, uRainDim, uVeil;
`+L+`attribute vec4 aP, aQ; varying vec3 vN; varying vec4 vQ; varying float vT; varying vec4 vSk;
          void main(){ float dist = length(aP.xyz - uCamB); vec3 dv = (aP.xyz - uCamB) / max(dist, 1e-3);
            vSk = vec4(-dv.x, max(dv.y, 0.), dv.z, 0.96 * uVeil * smoothstep(40., 220., dist)); float r = max(aQ.w, dist * 0.0021);                // never thinner than a pixel and a half
            float t = -position.y; vec3 p = aP.xyz + vec3(position.x * r, position.y * aP.w, position.z * r);
            vN = normalize(vec3(normal.x, 0.15, normal.z)); vQ = aQ; vT = t;
            vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`uniform float uTime; uniform vec3 uKey;
`+Q+E+`varying vec3 vN; varying vec4 vQ; varying float vT; varying vec4 vSk;
          void main(){ vec3 N = normalize(vN); float nl = dot(N, uSun);
            float sh = clamp(-vQ.y, 0., 1.), key = max(smoothstep(-0.3, 0.6, nl), vQ.y) * vQ.z * (1. - sh);
            vec3 c = mix(mix(mix(cCool * 1.7, cCream, 0.5) * (0.5 + 0.4 * vQ.z), mix(cCool * 1.5, cCream, 0.3) * (0.42 + 0.3 * vQ.z), sh), cCream * mix(vec3(1.), uKey, 0.5) * 1.05, key) * (0.8 + 0.3 * vT);
            float tw = 0.5 + 0.5 * sin(uTime * (1.3 + 2. * vQ.x) + vQ.x * 60.); c += mix(uKey, vec3(1.), 0.7) * 1.1 * smoothstep(0.86, 1., vT) * tw * tw * (0.3 + 0.7 * key);   // a bead of melt at the tip
            gl_FragColor = vec4(c * (1. - 0.3 * uRainDim), 1.);
            #include <fog_fragment>
            gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(fogColor * 0.9, skyCol(normalize(vSk.xyz + vec3(0., 1e-4, 0.))), 0.8), vSk.w);
          }`}),l=new o.Mesh(m,f);l.name="icicles",l.frustumCulled=!1,W.add(l),ye.push(l)}await S.yield(),await S.yield();const Me={value:new o.Vector2(R[0],R[2])},Ge=new o.Vector2(.9,6.5).normalize(),Oe=new o.Vector2(Ge.y,-Ge.x),Ye=(e,t,r,a)=>{const i=[],v=[],d=[],n=e.length;for(let f=0;f<n;f++)for(let l=0;l<t;l++){const p=l/t*Math.PI*2,s=e[f][0]*(1+a*Math.cos(p*r)*Math.min(1,e[f][0]*1.6));i.push(Math.cos(p)*s,e[f][1],Math.sin(p)*s),v.push(e[f][2])}for(let f=0;f<n-1;f++)for(let l=0;l<t;l++){const p=f*t+l,s=f*t+(l+1)%t,u=p+t,h=s+t;e[f][0]>0&&d.push(p,s,u),d.push(s,h,u)}const m=new o.BufferGeometry;return m.setAttribute("position",new o.Float32BufferAttribute(i,3)),m.setAttribute("aTint",new o.Float32BufferAttribute(v,1)),m.setIndex(d),m.computeVertexNormals(),m},qt=new o.ShaderMaterial({uniforms:q({uSeat:Me,uLift:{value:new o.Vector4(0,0,-99,0)}}),fog:!0,vertexShader:be+L+`
        attribute vec4 aPos; attribute vec2 aKind; attribute float aTint; uniform vec2 uSeat; uniform vec4 uLift;
        varying vec3 vN; varying vec3 vT; varying vec3 vW;
        void main(){
          vec2 c = aPos.xy; vec2 hl = vec2(-(c.x - uSeat.x), c.y - uSeat.y);     // the hero's sea lives in world space
          float h = swellH(hl); vec2 g = swellG(hl); g.x = -g.x;
          float cs = cos(aPos.w), sn = sin(aPos.w); float sd = aKind.y;
          vec3 p = vec3(position.x * cs - position.z * sn, position.y, position.x * sn + position.z * cs) * aPos.z;
          vec3 n = vec3(normal.x * cs - normal.z * sn, normal.y, normal.x * sn + normal.z * cs);
          vec2 nod = g + 0.06 * vec2(sin(uTime * 1.7 + sd * 40.), cos(uTime * 1.3 + sd * 23.));
          // a cup dips and rings when a drop lands in it
          float T = 3. + 4. * sd, tau = mod(uTime + sd * 31., T);
          float dip = aKind.x * (-0.10 * exp(-tau * 1.6) * cos(tau * 8.) * step(1.5, aKind.x + 1.) );
          // the rare great ring lifts everything as it passes
          float rr = length(c - uLift.xy) - uLift.z; float lift = uLift.w * exp(-rr * rr * 0.02);
          p.y += dot(nod, p.xz) + dip * step(0.5, aKind.x) + lift + 0.03 * sin(uTime * 2.1 + sd * 17.);
          vec3 w = vec3(c.x + p.x, h + p.y, c.y + p.z);
          vN = normalize(n + vec3(-nod.x, 0., -nod.y)); vT = vec3(aTint, aKind.x, sd); vW = w;
          vec4 mvPosition = modelViewMatrix * vec4(w, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:Q+re+E+`
        varying vec3 vN; varying vec3 vT; varying vec3 vW;
        void main(){
          vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
          float cup = step(0.5, vT.y);
          vec3 alb = mix(cCream * (0.6 + 0.14 * vT.z), cCream * 0.8, vT.x);            // floe: bright rolled rim
          alb = mix(alb, mix(cCream * 0.74, cRust * 1.15, smoothstep(0.72, 0.95, vT.x)), cup);   // cup: wax, rust rim
          alb *= 1.;
          vec3 c = litCol(alb, N, 0.75 + 0.25 * vT.x, 0.35 * cup);
          gl_FragColor = vec4(c, 1.);
          #include <fog_fragment>
        }`}),Xe=(e,t,r)=>{const a=new o.InstancedBufferGeometry;a.index=e.index;for(const n of["position","normal","aTint"])a.setAttribute(n,e.attributes[n]);const i=new Float32Array(t.length*4),v=new Float32Array(t.length*2);t.forEach((n,m)=>{i.set(n,m*4),v[m*2]=r,v[m*2+1]=(n[0]*12.9898+n[1]*78.233)%1<0?(n[0]*12.9898+n[1]*78.233)%1+1:(n[0]*12.9898+n[1]*78.233)%1}),a.setAttribute("aPos",new o.InstancedBufferAttribute(i,4)),a.setAttribute("aKind",new o.InstancedBufferAttribute(v,2)),a.instanceCount=t.length,a.boundingSphere=he;const d=new o.Mesh(a,qt);return d.frustumCulled=!1,W.add(d),ze.push(e),d};{const e=le.fork("afloat"),t=l=>{for(let p=0;p<30;p++){const s=e()<.36,u=s?e.range(285,430):e.range(-25,405);let x=((s?e()<.85:e()<.6)?e.range(-55,55):e.range(-190,190))+(u>95?-Math.min(50,(u-95)*.45)+Math.max(0,u-215)*.5:0);const b=x*Oe.x+u*Oe.y,c=x*Ge.x+u*Ge.y,y=Math.round(b/15),g=y*15+2.6*ie.n2(c*.02,y*3.3)+e.gauss()*l;x+=Oe.x*(g-b);const z=u+Oe.y*(g-b),w=vt(x,z);if(!(w.dist<6.5&&w.y<9)&&!(Math.hypot(x,z)<4))return[x,z]}return[e.range(-60,60),e.range(100,300)]},r=[],a=[],i=[],v=Math.round(400*de*Nt),d=Math.round(500*de),n=Math.round(1700*de*Nt),m=[];for(let l=0;l<v;l++){l%50===49&&await S.yield();const p=t(.8),s=e()<.2&&vt(p[0],p[1]).dist>11;(s?m:r).push([p[0],p[1],s?e.range(.9,1.8):e.range(.42,.9),e.range(0,6.28)])}for(let l=0;l<d;l++){l%50===49&&await S.yield();const p=t(.6);a.push([p[0],p[1],e.range(.22,.62),e.range(0,6.28)])}const f=le.fork("shoreline");for(let l=0;l<46;l++){const p=f.range(-46,120),s=384+7*Math.sin(p*.045+1)-.1*Math.max(0,p-40)+f.gauss()*1.6,u=f();u<.32?m.push([p,s,f.range(1.5,2.5),f.range(0,6.28)]):u<.62?a.push([p,s,f.range(.6,1.1),f.range(0,6.28)]):r.push([p,s,f.range(.4,.9),f.range(0,6.28)])}for(let l=0;l<n*.14;l++){l%50===49&&await S.yield();const p=t(1.1);i.push([p[0],p[1],e.range(.14,.3),e.range(0,6.28)])}Xe(Ye([[0,.05,.1],[.55,.05,.05],[.84,.06,.15],[.94,.14,1],[1,.09,.9],[.98,-.12,.3]],14,5,.06),m,0),await S.yield(),Xe(Ye([[0,.05,.1],[.8,.06,.1],[.94,.13,1],[1,.08,.9],[.98,-.12,.3]],7,4,.05),r,0),await S.yield(),Xe(Ye([[0,-.03,.2],[.5,0,.3],[.85,.22,.6],[1,.36,1],[1.05,.3,1],[.7,-.1,.4]],12,6,.16),a,1),await S.yield(),Xe(Ye([[0,.5,.9],[1,.1,.5],[.7,-.5,.2]],4,4,0),i,0)}await S.yield();{const r=[],a=[];for(let n=0;n<=150;n++)for(let m=0;m<=22;m++){const f=n/150,l=m/22*2-1,p=-64-200*f+5*Math.sin(f*5),s=26+78*f*f+16*f+4*Math.sin(f*9+1),u=(11+5*ie.n2(f*6,2.2))*(.45+.55*Math.sin(Math.min(1,f*6)*Math.PI/2)),h=p+.35*l*u,x=s+l*u,b=Math.pow(Math.max(0,1-l*l),.7),c=-3.5+(4.5+.45*ie.fbm2(h*.08,x*.08,3))*Math.pow(b,.6)+.12*ie.n2(h*.7,x*.7);r.push(h,Math.min(c,vt(h,x).y-3.2),x)}for(let n=0;n<150;n++)for(let m=0;m<22;m++){const f=n*23+m,l=f+1,p=f+22+1,s=p+1;a.push(f,l,p,l,s,p)}const i=new o.BufferGeometry;i.setAttribute("position",new o.Float32BufferAttribute(r,3)),i.setIndex(a),i.computeVertexNormals();const v=new o.ShaderMaterial({uniforms:q(),fog:!0,side:o.DoubleSide,vertexShader:L+`varying vec3 vN, vP; void main(){ vN = normal; vP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`uniform vec3 uCamB;
`+Q+re+E+`
          varying vec3 vN, vP;
          vec2 h22(vec2 p){ vec3 a = fract(p.xyx * vec3(0.1031, 0.1030, 0.0973)); a += dot(a, a.yzx + 33.33); return fract((a.xx + a.yz) * a.zy); }
          // rounded pebbles: nearest cell centre gives a little dome normal and its own shade
          vec4 pebbles(vec2 p){ vec2 i = floor(p), f = fract(p); float md = 9.; vec2 mo = vec2(0.); float id = 0.;
            for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 o = vec2(float(x), float(y)); vec2 r = o + 0.15 + 0.7 * h22(i + o) - f;
              float d = dot(r, r); if (d < md) { md = d; mo = r; id = h22(i + o + 7.).x; } }
            return vec4(mo, sqrt(md), id); }
          void main(){
            vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) N = -N;
            float dist = length(vP - uCamB); float nf = 1. - smoothstep(25., 90., dist);
            vec4 a = pebbles(vP.xz * 2.6), b = pebbles(vP.xz * 0.9 + 3.);
            N = normalize(N + vec3(-a.x, 0., -a.y) * 0.9 * nf + vec3(-b.x, 0., -b.y) * 0.22);
            vec3 alb = mix(mix(cDeep, cCool, 0.35) * 0.6, cRust * 0.7, 0.3 + 0.4 * a.w * nf + 0.15 * b.w); alb = mix(alb, cDeep * 0.5, 0.5 * smoothstep(0.42, 0.62, a.z) * nf + 0.2 * smoothstep(0.5, 0.75, b.z));   // dark wet shingle: the dark note of the opening
            alb = mix(cDeep * 0.4, alb, smoothstep(-0.5, 0.25, vP.y));               // wet and dark at the waterline
            vec3 c = litCol(alb, N, 0.6 + 0.4 * (1. - smoothstep(0.25, 0.7, a.z * nf)), 0.) + alb * cHaze * 0.12 * (1. - 0.6 * uRainDim);
            gl_FragColor = vec4(c, 1.);
            #include <fog_fragment>
          }`});await S.yield();const d=new o.Mesh(i,v);d.name="spit",d.frustumCulled=!1,W.add(d)}await S.yield();const dt=31,X=new Float32Array(dt*4),Ae=new Float32Array(dt*4),fe=new Float32Array(dt*4);let Je;{const e=[],t=[],r=[],a=(p,s,u,h,x,b,c)=>(e.push(p,s,u),t.push(h,x,b,c),e.length/3-1),d=p=>12.2*(1-.56*Math.pow(p,1.25)),n=p=>(14-96*p)*Math.PI/180;for(const p of[1,-1]){const s=e.length/3;for(let u=0;u<=24;u++){const h=u/24,x=h*6%1,b=d(h)*(1-.11*Math.sin(Math.PI*x)),c=n(h);for(let y=0;y<=8;y++){const g=y/8,z=.5+b*g;a(p*(.2+Math.cos(c)*z),0,1.2+Math.sin(c)*z,h,g,0,p)}}for(let u=0;u<24;u++)for(let h=0;h<8;h++){const x=s+u*9+h,b=x+1,c=x+8+1,y=c+1;r.push(x,b,c,b,y,c)}for(let u=3;u<=24;u++){const h=u/24,x=d(h)*(1-.11*Math.sin(Math.PI*(h*6%1))),b=n(h),c=.5+x,y=p*(.2+Math.cos(b)*c),g=1.2+Math.sin(b)*c,z=1.1+.9*(u*7%5)/4,w=.09,C=p*Math.cos(b-.9),N=Math.sin(b-.9),P=[];for(let k=0;k<=2;k++){const F=k/2;P.push(a(y+C*z*F-w,0,g+N*z*F,h,1,2,F),a(y+C*z*F+w*(k===2?2.2:1),0,g+N*z*F,h,1,2,F))}r.push(P[0],P[1],P[2],P[1],P[3],P[2],P[2],P[3],P[4],P[3],P[5],P[4])}}{const u=e.length/3;for(let h=0;h<=9;h++){const x=h/9,b=3.6-7.2*x,c=.72*Math.pow(Math.sin(Math.PI*Math.min(1,x*.93+.05)),.7)+.06;for(let y=0;y<8;y++){const g=y/8*Math.PI*2,z=Math.sin(g)<-.3&&x<.3?1:0;a(Math.cos(g)*c*1.15,Math.sin(g)*c*(Math.sin(g)>0?.75:.5)-z*.25*(1-x/.3),b,x,z,1,Math.sin(g))}}for(let h=0;h<9;h++)for(let x=0;x<8;x++){const b=u+h*8+x,c=u+h*8+(x+1)%8,y=b+8,g=c+8;r.push(b,y,c,c,y,g)}}for(const p of kt?[1,-1]:[0]){const u=e.length/3;for(let h=0;h<=10;h++){const x=h/10,b=.22*(1-.8*x)+.04;for(let c=0;c<3;c++){const y=c/3*Math.PI*2;a(Math.cos(y)*b,Math.sin(y)*b,-3.4-(kt?9:12)*x,x,p,3,0)}}for(let h=0;h<10;h++)for(let x=0;x<3;x++){const b=u+h*3+x,c=u+h*3+(x+1)%3,y=b+3,g=c+3;r.push(b,y,c,c,y,g)}}const m=new o.InstancedBufferGeometry;m.setAttribute("position",new o.Float32BufferAttribute(e,3)),m.setAttribute("aW",new o.Float32BufferAttribute(t,4)),m.setIndex(r),m.computeVertexNormals();for(const[p,s]of[["aP",X],["aF",Ae],["aA",fe]]){const u=new o.InstancedBufferAttribute(s,4);u.setUsage(o.DynamicDrawUsage),m.setAttribute(p,u)}m.instanceCount=0,m.boundingSphere=he,Je=m;const f=new o.ShaderMaterial({uniforms:q({uSeat:Me}),fog:!0,side:o.DoubleSide,transparent:!0,depthWrite:!0,vertexShader:be+`uniform vec3 uCamB; uniform vec2 uSeat;
`+L+`
          attribute vec4 aW, aP, aF, aA; varying vec4 vW; varying vec3 vN, vV; varying vec2 vS; varying float vM;
          vec3 bend(vec3 p){
            float s = abs(p.x), sg = p.x < 0. ? -1. : 1., sn = clamp(s / 12.5, 0., 1.);
            float th = aA.z * (sin(aA.x - 1.7 * sn) * (0.25 + 0.75 * sn) + 0.18);
            th = mix(th, -1.42 - 0.22 * sin(p.z * 0.9 + aA.w * 9.), aA.y) * pow(max(sn, 1e-4), 0.75 - 0.4 * clamp(aA.y, 0., 1.));
            float edge = sn * sn * (1. - aA.y);
            return vec3(sg * s * cos(th), s * sin(th) + 0.22 * edge * sin(aA.x * 3. + p.z * 1.1 + s * 0.5), p.z - 0.6 * edge * cos(aA.x - 1.2));
          }
          void main(){
            vec3 p = position, n = normal; float part = aW.z;
            if (part < 0.5 || part > 1.5 && part < 2.5) {
              vec3 q = bend(p); vec3 dx = bend(p + vec3(0.25, 0., 0.)) - q, dz = bend(p + vec3(0., 0., 0.25)) - q;
              n = normalize(cross(dz, dx) + vec3(0., 1e-4, 0.)); p = q;
              if (part > 1.5) { float t = aW.w; p.y -= t * t * (0.9 + 0.5 * sin(uTime * 1.3 + aW.x * 40.)); p.x += 0.2 * t * sin(uTime * 2.1 + aW.x * 55.); }
            } else if (part > 2.5) {
              float t = aW.x; p.x += aW.y * t * (0.4 + 2.6 * t) + 1.5 * t * t * sin(uTime * 1.1 + aA.w * 20. - t * 3.) * (1. - aA.y);
              p.y += 0.8 * t * t * sin(aA.x - 2.5 - t * 2.) * (1. - aA.y) - aA.y * t * t * 1.5;
            } else { p.y += 0.12 * sin(aA.x - 0.6) * aA.z; }
            // instance frame: forward F, banked right R, up Uv
            vec3 F = normalize(aF.xyz + vec3(0., 0., 1e-5)); vec3 R0 = normalize(cross(vec3(0., 1., 0.), F) + vec3(1e-5, 0., 0.)); vec3 U0 = cross(F, R0);
            float cb = cos(aF.w), sb = sin(aF.w); vec3 R = R0 * cb + U0 * sb, Uv = U0 * cb - R0 * sb;
            vec3 w = aP.xyz + (R * p.x + Uv * p.y + F * p.z) * abs(aP.w);
            vN = R * n.x + Uv * n.y + F * n.z; vW = aW; vS = vec2(aA.w, abs(position.x)); vM = 0.;
            if (aP.w < 0.) {                                           // its image in the sea, laid on the surface along the line of sight
              float sw = swellH(vec2(-(w.x - uSeat.x), w.z - uSeat.y)); w.y = 2. * sw - w.y; vN.y = -vN.y; vM = 1.;
              float f = clamp((uCamB.y - sw - 0.06) / max(uCamB.y - w.y, 0.05), 0., 1.); w = uCamB + (w - uCamB) * f; }
            vV = w;
            vec4 mvPosition = modelViewMatrix * vec4(w, 1.); gl_Position = projectionMatrix * mvPosition;
            gl_Position.z -= vM * 0.0006 * gl_Position.w;
            #include <fog_vertex>
          }`,fragmentShader:`uniform float uTime, uVeil, uIn; uniform vec3 uCamB, cTeal;
`+Q+re+E+`
          varying vec4 vW; varying vec3 vN, vV; varying vec2 vS; varying float vM;
          float h21(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
          void main(){
            vec3 Nup = normalize(vN + vec3(0., 1e-4, 0.)); vec3 V = normalize(uCamB - vV + vec3(0., 1e-4, 0.));
            float facing = dot(Nup, V); vec3 N = facing < 0. ? -Nup : Nup;
            float part = vW.z; vec3 c;
            if (part < 0.5) {
              float a6 = vW.x * 6.; float dr = abs(fract(a6 + 0.5) - 0.5); float fw = fwidth(a6) * 1.3;
              float rib = 1. - smoothstep(0.035 + fw * 0.5, 0.06 + fw, dr);
              float vein = smoothstep(0.75, 1., abs(sin(a6 * 9.42 + 1.3 * sin(vW.y * 9.)))) * 0.5 + smoothstep(0.86, 1., abs(sin(vW.y * 26. + 3. * sin(a6 * 6.28)))) * 0.35;
              vein *= 1. - smoothstep(0.02, 0.2, fw);
              float inRain = clamp(uRainDim / 0.85, 0., 1.);
              vec3 amber = mix(mix(cEmber, cRust, 0.22) * vec3(1.08, 0.9, 0.7), mix(cEmber, cHaze, 0.62), inRain) * (1.0 + 0.25 * sin(a6 * 6.28 + 1.) * vW.y);
              vec3 top = litCol(amber * 0.55, N, 1., 0.);
              // seen against the light the membrane glows like a lampshade
              vec3 thru = amber * (uKey * (0.6 + 1.0 * smoothstep(-0.2, 0.7, dot(Nup, uSun))) + mix(cHaze, cEmber, uRainDim) * 0.5) * (1. - 0.2 * uRainDim);
              c = mix(top, thru, facing < 0. ? 0.92 : 0.38);
              // drops landing on the wing: brief dark dimples that roll for the edge
              vec2 dp = vec2(a6 * 2.4, vW.y * 7. - uTime * 0.5 * (0.5 + h21(vec2(floor(a6 * 2.4), vS.x)))); vec2 dc = fract(dp) - 0.5;
              float dim = (1. - smoothstep(0.08, 0.2, length(dc))) * step(0.55, h21(floor(dp) + vS.x * 7.));
              c *= 1. - 0.5 * dim * (1. - smoothstep(0.02, 0.15, fw)); c *= 1. - 0.4 * vein;
              c = mix(c, cUmber * 0.35, rib * 0.9);
              c *= 0.55 + 0.45 * smoothstep(0.0, 0.14, vW.y);                 // darker where it meets the body
              // nine teal spots along the leading edge
              vec2 sq = vec2((vW.x - 0.03) * 34., fract(vW.y * 9.4 + 0.2) - 0.5);
              c += cTeal * 2.4 * (1. - smoothstep(0.12, 0.3, length(sq))) * step(0.08, vW.y);
            } else if (part < 1.5) {
              c = litCol(mix(cUmber, cEmber, 0.25 + 0.2 * vW.w), N, 1., 0.) * 0.8;
              c += cTeal * 1.6 * smoothstep(0.2, 0.5, vW.y) * (1. - smoothstep(0.5, 0.85, vW.y));   // the jaw's scoop is lined teal
            } else if (part < 2.5) {
              c = mix(cUmber * 0.5, cEmber * 0.8, vW.w) + uKey * 1.6 * smoothstep(0.8, 1., vW.w);
            } else { c = litCol(mix(cUmber, cEmber, 0.2), N, 1., 0.) * 0.7; }
            // seen from outside through the rain, a ray in the shaft is veiled; its image in the sea is darker
            float veil = 0.55 * smoothstep(60., 200., length(uCamB - vV)) * (1. - smoothstep(95., 130., length(vV.xz - vec2(-50., 215.))));
            c = mix(c, mix(mix(cEmber, cHaze, 0.3), cCool * 1.6, 0.4) * 0.6, veil);
            float al = 1.; vec3 dv = vV - uCamB; float dl = max(length(dv), 1e-3); dv /= dl;
            if (vM > 0.5) {                                               // a reflection: darker than the ray, broken by the rings, and never close to the lens (where the crowns stand)
              c *= 0.5; al = 0.34 * smoothstep(16., 42., dl) * (0.62 + 0.38 * sin(vV.x * 2.3 + 2. * sin(vV.z * 1.7 + uTime * 0.9) + uTime * 0.6));
              if (al < 0.01) discard; }
            gl_FragColor = vec4(c, al);
            #include <fog_fragment>
            vec3 dw = vec3(-dv.x, max(dv.y, 0.), dv.z);
            float lost = 0.96 * uVeil * smoothstep(40., 220., dl) * smoothstep(120., 170., length(vV.xz - vec2(-50., 215.)));
            gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(fogColor * 0.9, skyCol(dw / max(length(dw), 1e-4)), 0.8), lost); gl_FragColor.a *= 1. - lost / 0.96;
            if (gl_FragColor.a < 0.02) discard;
          }`}),l=new o.Mesh(m,f);l.name="sail-rays",l.frustumCulled=!1,l.renderOrder=.6,W.add(l)}await S.yield();const qe=(e,t)=>(ce.pointAt(e,t),t.x=-t.x,t),ve=(e,t)=>{const r=t.length;if(e<=t[0][0])return t[0][1];if(e>=t[r-1][0])return t[r-1][1];let a=0;for(;a<r-2&&e>t[a+1][0];)a++;const i=(e-t[a][0])/(t[a+1][0]-t[a][0]),v=t[Math.max(0,a-1)][1],d=t[a][1],n=t[a+1][1],m=t[Math.min(r-1,a+2)][1];return .5*(2*d+(-v+n)*i+(2*v-5*d+4*n-m)*i*i+(-v+3*d-3*n+m)*i*i*i)},J=le.fork("rays"),pe=[];for(let e=0;e<8;e++)pe.push({R:30+7.5*e+J.range(-3,3),h:15+6.5*(e*3%5)+J.range(0,4),ph:J.range(0,6.28),dir:e%2?1:-1,sp:J.range(6.5,9.5),seed:J()});const p0=new o.Vector3(40,104,H(40,104)-2.6),_=new o.Vector3,K=new o.Vector3,A=new o.Vector3,D=new o.Vector3,Z=new o.Vector3,yt=(e,t,r,a,i,v,d,n)=>{X[e*4]=t.x,X[e*4+1]=t.y,X[e*4+2]=t.z,X[e*4+3]=1,Ae[e*4]=r.x,Ae[e*4+1]=r.y,Ae[e*4+2]=r.z,Ae[e*4+3]=a,fe[e*4]=i,fe[e*4+1]=v,fe[e*4+2]=d,fe[e*4+3]=n},u0=(e,t,r,a)=>{const i=pe[e],v=i.ph+i.dir*i.sp/i.R*t;return r.set(-50+Math.cos(v)*i.R,i.h+3*Math.sin(t*.31+e*2.1),215+Math.sin(v)*i.R*.9),a.set(-Math.sin(v)*i.dir,.08*Math.cos(t*.31+e*2.1),Math.cos(v)*i.dir*.9).normalize(),-i.dir*.32},Y=(e,t,r,a,i)=>{qe(e+t/ce.length,i),ce.tangentAt(Math.min(1,Math.max(0,e+t/ce.length)),D),D.x=-D.x;const v=Math.hypot(D.x,D.z)||1;return i.x+=D.z/v*r,i.z+=-D.x/v*r,i.y+=a,i},d0={d:[[.3,-44],[.338,-18],[.353,3],[.37,13],[.4,34],[.44,58],[.5,120]],lat:[[.3,-24],[.338,-10],[.353,-4],[.37,-1],[.4,3],[.44,14],[.5,40]],up:[[.3,16],[.338,9],[.353,7.2],[.37,6.8],[.4,8.5],[.44,4],[.5,16]]},Qt={d:[[.36,110],[.4,74],[.43,50],[.455,38],[.48,34],[.51,42],[.55,62],[.6,85]],lat:[[.36,-52],[.4,-36],[.43,-24],[.455,-9],[.48,8],[.51,6],[.55,-4],[.6,-8]],up:[[.36,9],[.4,-2.2],[.45,-2.6],[.49,-2.4],[.52,3],[.56,11],[.6,20]]},Ht=new o.Vector3(-11,90,H(-11,90)-2.4),Kt=new o.Vector3(-10,110,H(-10,110)-2.4),y0={d:[[.56,150],[.61,96],[.66,60],[.7,44],[.74,50],[.79,54],[.84,50],[1,40]],lat:[[.56,60],[.61,38],[.66,24],[.7,16],[.74,8],[.77,11],[.79,2],[.81,-10],[.84,-16],[1,-20]],up:[[.56,30],[.61,22],[.66,15],[.7,12],[.74,13],[.79,18],[.84,26],[1,30]]},jt=new o.Vector3(-22,100,H(-22,100)-2.4),Ze={d:[[.8,34],[.84,38],[.87,40],[.9,33],[.918,20],[.932,4],[.95,-14],[1,-40]],lat:[[.8,-8],[.84,-6],[.87,-3],[.9,-6],[.918,-14],[.932,-24],[.95,-30],[1,-40]],up:[[.8,12],[.84,22],[.87,9.5],[.9,5.5],[.918,13],[.932,23],[.95,30],[1,34]],fold:[[.798,1],[.825,.8],[.855,.45],[.9,0]]},Lt=(e,t)=>{Y(e,ve(e,Ze.d),ve(e,Ze.lat),ve(e,Ze.up),A);const r=M(.8,.85,e);return t.copy(p0).lerp(A,r*r*(3-2*r))},Qe=(e,t,r,a)=>{Y(t,ve(t,e.d),ve(t,e.lat),ve(t,e.up),r);const i=t+.004;Y(i,ve(i,e.d),ve(i,e.lat),ve(i,e.up),Z),a.copy(Z).sub(r),a.lengthSq()<1e-8&&a.set(0,0,1),a.normalize()},x0={d:[[0,75],[.04,48],[.08,28],[.12,36],[.16,38],[.2,60],[.25,96]],lat:[[0,20],[.04,8],[.08,-6],[.12,-17],[.16,-4],[.2,14],[.25,10]],up:[[0,20],[.04,12],[.08,8],[.12,10],[.16,13.5],[.2,14],[.25,15]]},g0=-.65,Pe={pos:new o.Vector3,fwd:new o.Vector3(0,0,1),on:0},Et=new o.Vector3(50,30,215),Ut=new o.Vector3(50,30,215),Gt=new o.Vector3(-40,104,500);for(let e=0;e<14;e++){const t=e%2===0,r=t?J.range(4,33):J.range(106,136),a=J.range(76,150),i=e<4,v=i?[6,17,28,17][e]:560+(r-(t?4:106))*6.5,d=i?[97,110,96,85][e]:70+(a-76)*.9,n=1.3;_.set(v,d,H(v,d)-1.9*n-.4),K.set(J.range(-.15,.15),.93,-.36).normalize(),yt($+1+e,_,K,J.range(-.2,.2),J.range(0,6),1,.12,J()),X[($+1+e)*4+3]=n}const Ot=[];for(let e=0;e<14;e++)Ot.push(fe[($+1+e)*4]);Je.instanceCount=$+1+14+$;const w0=[{c:[-50,24,196],R:10,sp:.3,dir:1},{c:[-30,15,204],R:11,sp:.34,dir:-1},{c:[-48,34,226],R:15,sp:.26,dir:1}];ne.push((e,t,r,a)=>{const i=t*Math.PI*2/5;for(let n=0;n<$;n++){let m=u0(n,t,_,K),f=0,l=.5,p=i+n*1.9;if(n===5){const s=1-.25*M(.2,.235,a)*(1-M(.265,.3,a));_.x=-50+(_.x+50)*s,_.z=215+(_.z-215)*s}if(a>.28&&a<.56){const s=_.x-se.x,u=_.z-se.z,h=Math.hypot(s,u)||1,x=Math.max(45,5*(_.y-se.y)),b=M(.28,.33,a)*(1-M(.52,.56,a));if(h<x){const c=1+(x/h-1)*b;_.x=se.x+s*c,_.z=se.z+u*c}}if(n>=1&&n<=3&&a<.42){const s=w0[n-1],u=1-M(.36,.42,a),h=pe[n].ph+s.dir*s.sp*t,x=M(.26,.335,a);A.set(s.c[0]+10*x+Math.cos(h)*s.R,s.c[1]+(14+2*n-s.c[1])*x+2*Math.sin(t*.4+n),s.c[2]+68*x+Math.sin(h)*s.R),D.set(-Math.sin(h)*s.dir,0,Math.cos(h)*s.dir),_.lerp(A,u),K.lerp(D,u).normalize(),m+=(-s.dir*1.1-m)*u}if(n===2&&a<.27){const s=1-M(.2,.265,a);Qe(x0,a,A,D),_.lerp(A,s),K.lerp(D,s).normalize(),m+=(g0*(1-2*M(.112,.138,a))-m)*s}if(n===0){const s=M(.275,.305,a);if(s>0){Qe(d0,a,A,D);const u=M(.5,.67,a);u>0&&(Z.copy(A),A.lerp(Kt,u),D.copy(Kt).sub(Z).normalize().lerp(Z.set(-.1,.93,-.36),M(.625,.67,a)).normalize()),_.lerp(A,s),K.lerp(D,s).normalize(),m*=1-s,m+=s*.5*M(.39,.45,a)*(1-M(.47,.52,a)),f=M(.635,.675,a),l=(.5-.12*s)*(1-.75*f)}}else if(n===1){const s=M(.34,.38,a);if(s>0){Qe(Qt,a,A,D);const u=M(.395,.415,a)*(1-M(.49,.515,a));A.y=Math.max(A.y,1.25),A.y+=(1.3-A.y)*u,D.y*=1-u;const h=M(.54,.72,a);h>0&&(Z.copy(A),A.lerp(Ht,h),D.copy(Ht).sub(Z).normalize().lerp(Z.set(.1,.93,-.36),M(.67,.72,a)).normalize()),_.lerp(A,s),K.lerp(D,s).normalize(),m*=1-s,f=-.24*u+M(.685,.725,a),l=(.5-.36*u)*(1-.75*M(.685,.725,a)),Pe.on=u*s,Pe.pos.copy(_),Pe.fwd.copy(K)}else Pe.on=0}if(n>=2){const s=M(.36,.41,a);if(s>0){Y(a,96,-24,0,A);const u=pe[n].ph+pe[n].dir*.22*t,h=16+5*(n%3);if(A.x+=Math.cos(u)*h,A.z+=Math.sin(u)*h,A.y=13+3.6*(n-2)+2*Math.sin(t*.4+n),D.set(-Math.sin(u)*pe[n].dir,0,Math.cos(u)*pe[n].dir),n!==3){const x=M(.445,.505,a);x>0&&(Z.set(-262+Math.cos(u)*26,38+5*(n-2),425+Math.sin(u)*26),A.lerp(Z,x),D.lerp(Z.set(-.95,.08,.3),Math.sin(x*Math.PI)).normalize())}_.lerp(A,s),K.lerp(D,s).normalize(),m+=(-pe[n].dir*.9-m)*s}}if(n===3){const s=M(.5,.57,a);if(s>0){Qe(y0,a,A,D);const u=M(.795,.845,a);u>0&&(Z.copy(A),A.lerp(jt,u),D.copy(jt).sub(Z).normalize().lerp(Z.set(.05,.93,-.36),M(.822,.845,a)).normalize()),_.lerp(A,s),K.lerp(D,s).normalize(),m=m*(1-s)-.6*s*M(.62,.68,a)*(1-M(.8,.83,a)),f=M(.822,.85,a),l=.5*(1-.75*f)}}yt(n,_,K,m,p,f,l,pe[n].seed)}for(let n=0;n<14;n++){const m=$+1+n,f=6.5+1.3*(n%4),l=(t+n*2.9)%f,p=M(0,.9,l)*(1-M(1.5,3,l))*(1-M(.815,.835,a));fe[m*4]=Ot[n]+t*(.9+.1*(n%3)),fe[m*4+1]=1-.3*p,fe[m*4+2]=.16+.3*p}Lt(Math.min(a+.004,1),K),Lt(a,_),K.sub(_);const v=ve(a,Ze.fold);(a<.802||K.lengthSq()<1e-8)&&K.set(.1,.93,-.36),K.normalize(),v>.5&&K.lerp(A.set(.1,.93,-.36),M(.5,1,v)).normalize(),yt($,_,K,.16*M(.83,.86,a)-.66*M(.9,.94,a),i+1.1,v,.15+.5*(1-v),.37),Et.set(-X[0],X[1],X[2]),Ut.set(-X[4],X[5]+3,X[6]),Gt.set(-_.x,_.y,_.z);const d=($+15)*4;X.copyWithin(d,0,$*4),Ae.copyWithin(d,0,$*4),fe.copyWithin(d,0,$*4);for(let n=0;n<$;n++)X[d+n*4+3]=-1;for(const n of["aP","aF","aA"])Je.attributes[n].needsUpdate=!0}),ze.push(Je);const $e=(e,t,r)=>{const a=we.uSwell.value,i=-(e-R[0]),v=t-R[2];return(1-M(380,760,Math.hypot(i,v)))*(a.x*Math.sin((i*.34+v*.94)*a.y-r*a.z)+a.w*Math.sin((-i*.71+v*.7)*a.y*2.3-r*a.z*1.37))},xt=new o.ShaderMaterial({uniforms:q(),fog:!0,side:o.DoubleSide,vertexShader:L+`attribute vec4 color; varying vec4 vC; varying vec3 vN, vWp;
        void main(){ vC = color; vN = normalize(mat3(modelMatrix) * normal); vN.x = -vN.x;          // back to brief space
          vWp = (modelMatrix * vec4(position, 1.)).xyz; vWp.x = -vWp.x;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`uniform float uTime, uIn; uniform vec3 cTeal, uCamB;
`+Q+re+E+`varying vec4 vC; varying vec3 vN, vWp;
        void main(){ vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) N = -N;
          vec3 c = litCol(vC.rgb, N, 1., 0.) + cTeal * vC.a * (3.2 + 0.8 * sin(uTime * 2.3 + vC.r * 40.));
          gl_FragColor = vec4(c, 1.);
          #include <fog_fragment>
            { vec3 dv = vWp - uCamB; float dl = max(length(dv), 1e-3); dv /= dl; vec3 dw = vec3(-dv.x, max(dv.y, 0.), dv.z);   // lost as the rain closes round the lens
              gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(fogColor * 0.9, skyCol(dw / max(length(dw), 1e-4)), 0.8), min(1., 1.05 * uIn) * smoothstep(22., 80., dl)); }
        }`}),gt=()=>({p:[],c:[],i:[]}),T=(e,t,r,a,i,v,d,n,m,f,l,p=0,s="y",u=0)=>{const h=e.p.length/3,x=Math.cos(u),b=Math.sin(u);for(let c=0;c<2;c++)for(let y=0;y<f;y++){const g=(y+.5)/f*Math.PI*2,z=c?d:i,w=c?n:v;let C=Math.cos(g)*z*1.414*(f===4?1:.71),N=c*m,P=Math.sin(g)*w*1.414*(f===4?1:.71);if(s==="z"){const k=N;N=P,P=k-m/2}e.p.push(t+C*x-P*b,r+N,a+C*b+P*x),e.c.push(l.r,l.g,l.b,p)}for(let c=0;c<f;c++){const y=h+c,g=h+(c+1)%f,z=y+f,w=g+f;e.i.push(y,z,g,g,z,w)}for(let c=1;c<f-1;c++)e.i.push(h,h+c,h+c+1,h+f,h+f+c+1,h+f+c)},wt=e=>{const t=new o.BufferGeometry;t.setAttribute("position",new o.Float32BufferAttribute(e.p,3)),t.setAttribute("color",new o.Float32BufferAttribute(e.c,4)),t.setIndex(e.i);const r=t.toNonIndexed();return r.computeVertexNormals(),t.dispose(),r},Fe=ae[2].clone().multiplyScalar(.62),Ce=ae[2].clone().lerp(ae[0],.3).multiplyScalar(.5),ee=ae[5].clone().multiplyScalar(.8),Ne=new o.Color("#8A4A1E").lerp(ae[2],.22).multiplyScalar(.8),bt=[],b0=new o.ShaderMaterial({uniforms:q({cKite:{value:new o.Color("#8A4A1E").lerp(ae[2],.2)}}),fog:!0,side:o.DoubleSide,vertexShader:`uniform float uTime;
`+L+`varying vec3 vN, vWp; varying vec2 vQ;
        void main(){ vec3 p = position; vQ = uv; float rip = uv.y * uv.y; vWp = (modelMatrix * vec4(position, 1.)).xyz; vWp.x = -vWp.x;
          p += normal * (rip * (0.9 * sin(uTime * 2.6 + uv.x * 31.) + 0.6 * sin(uTime * 1.7 - uv.x * 17.)) + 1.2 * sin(uTime * 0.6 + uv.x * 3.) * (1. - uv.y));
          vN = normalize(mat3(modelMatrix) * normal + vec3(0., 0.2 * rip * cos(uTime * 2.6 + uv.x * 31.), 0.)); vN.x = -vN.x;
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`uniform vec3 cKite, uCamB; uniform float uIn;
`+Q+re+E+`varying vec3 vN, vWp; varying vec2 vQ;
        void main(){ vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) N = -N;
          float pan = fract(vQ.x * 9.); float seam = smoothstep(0.0, 0.05, pan) * (1. - smoothstep(0.95, 1.0, pan));
          float rusty = step(0.5, fract(floor(vQ.x * 9.) * 0.5 + 0.25)) * smoothstep(0.25, 0.3, vQ.y) * (1. - smoothstep(0.8, 0.85, vQ.y));
          vec3 alb = mix(cCream * 0.74, cKite * 0.72, rusty) * (0.75 + 0.25 * seam);
          vec3 c = litCol(alb, N, 1., mix(0.7, 0.25, rusty)) + alb * cHaze * mix(0.35, 0.1, rusty);    // cloth lit through
          c *= 0.45 + 0.55 * seam * smoothstep(0.0, 0.03, vQ.y) * (1. - smoothstep(0.97, 1.0, vQ.y)) + 0.0;
          gl_FragColor = vec4(c, 1.);
          #include <fog_fragment>
            { vec3 dv = vWp - uCamB; float dl = max(length(dv), 1e-3); dv /= dl; vec3 dw = vec3(-dv.x, max(dv.y, 0.), dv.z);   // lost as the rain closes round the lens
              gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(fogColor * 0.9, skyCol(dw / max(length(dw), 1e-4)), 0.8), min(1., 1.05 * uIn) * smoothstep(22., 80., dl)); }
        }`}),Yt=e=>new o.ShaderMaterial({uniforms:q({uSeat:Me,cKite:{value:new o.Color("#8A4A1E").lerp(ae[2],.2)}}),fog:!0,side:o.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:be+`uniform vec3 uCamB; uniform vec2 uSeat;
`+L+(e?"varying vec2 vQ; varying vec3 vWp;":"attribute vec4 color; varying vec4 vC; varying vec3 vWp;")+`
        void main(){ vec3 p = position; ${e?"vQ = uv; p += normal * (uv.y * uv.y * (0.9 * sin(uTime * 2.6 + uv.x * 31.) + 0.6 * sin(uTime * 1.7 - uv.x * 17.)) + 1.2 * sin(uTime * 0.6 + uv.x * 3.) * (1. - uv.y));":"vC = color;"}
          vec3 b = (modelMatrix * vec4(p, 1.)).xyz; b.x = -b.x;
          float sw = swellH(vec2(-(b.x - uSeat.x), b.z - uSeat.y)); b.y = 2. * sw - b.y;
          float f = clamp((uCamB.y - sw - 0.06) / max(uCamB.y - b.y, 0.05), 0., 1.); b = uCamB + (b - uCamB) * f; vWp = b;
          vec4 mvPosition = viewMatrix * vec4(-b.x, b.y, b.z, 1.); gl_Position = projectionMatrix * mvPosition; gl_Position.z -= 0.0006 * gl_Position.w;
          #include <fog_vertex>
        }`,fragmentShader:`uniform float uTime, uIn; uniform vec3 cKite, cTeal, uCamB;
`+Q+E+(e?"varying vec2 vQ; varying vec3 vWp;":"varying vec4 vC; varying vec3 vWp;")+`
        void main(){ ${e?"float rusty = step(0.5, fract(floor(vQ.x * 9.) * 0.5 + 0.25)) * smoothstep(0.25, 0.3, vQ.y) * (1. - smoothstep(0.8, 0.85, vQ.y)); vec3 c = mix(cCream * 0.6, cKite * 0.5, rusty) * mix(cHaze, vec3(1.), 0.5);":"vec3 c = vC.rgb * mix(cHaze, vec3(1.), 0.5) * 0.7 + cTeal * vC.a * 2.2;"}
          float dl = length(vWp - uCamB), brk = 0.6 + 0.4 * sin(vWp.x * 2.3 + 2. * sin(vWp.z * 1.7 + uTime * 0.9) + uTime * 0.6);
          gl_FragColor = vec4(c * 0.5, 0.68 * brk * smoothstep(6., 22., dl) * (1. - uIn));
          #include <fog_fragment>
        }`});await S.yield();const zt=Yt(!1),z0=Yt(!0),et=(e,t,r)=>{const a=new o.Mesh(e.geometry,t);return a.position.copy(e.position),a.rotation.copy(e.rotation),a.scale.copy(e.scale),a.frustumCulled=!1,a.renderOrder=.5,r.add(a),a},M0=new o.ShaderMaterial({uniforms:q({uSeat:Me}),fog:!0,side:o.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:be+`uniform vec2 uSeat;
`+L+`varying vec2 vQ; varying vec3 vWp;
        void main(){ vQ = vec2(position.x / 15., -position.z / 80.); vec3 b = (modelMatrix * vec4(position, 1.)).xyz; b.x = -b.x;
          b.y = swellH(vec2(-(b.x - uSeat.x), b.z - uSeat.y)) + 0.05; vWp = b;
          vec4 mvPosition = viewMatrix * vec4(-b.x, b.y, b.z, 1.); gl_Position = projectionMatrix * mvPosition; gl_Position.z -= 0.0004 * gl_Position.w;
          #include <fog_vertex>
        }`,fragmentShader:`uniform float uTime, uIn; uniform vec3 uKey;
`+Q+E+`varying vec2 vQ; varying vec3 vWp;
        void main(){ float t = vQ.y, ax = abs(vQ.x), arm = 0.2 + 0.72 * t, e = (ax - arm) / (0.035 + 0.05 * t);
          float lip = exp(-e * e) * (1. - t) * (1. - t) * smoothstep(0.0, 0.06, t);
          float lane = (1. - smoothstep(arm * 0.5, arm, ax)) * (1. - t) * (0.5 + 0.5 * sin(vWp.x * 1.9 + uTime * 1.3 + 2. * sin(vWp.z * 1.3 - uTime))) * 0.3;
          vec3 c = mix(mix(cDeep, cCool, 0.5) * 0.6, cCream * mix(vec3(1.), uKey, 0.6) * 1.15, clamp(lip * 1.4, 0., 1.));
          gl_FragColor = vec4(c, clamp(0.85 * lip + lane, 0., 0.9) * (1. - uIn));
          #include <fog_fragment>
        }`});await S.yield();const P0=e=>{const a=[],i=[],v=[];for(let n=0;n<=30;n++)for(let m=0;m<=6;m++){const f=n/30*2-1,l=m/6,p=f*1.2,s=e/(2*Math.sin(1.2)),u=e*.24*(1-.72*f*f);a.push(s*Math.sin(p),s*(Math.cos(p)-1)*.75-l*u*.92+e*.05*f*f*l,-l*u*.4+4*Math.sin(l*3.14)*(1-f*f)),i.push(n/30,l)}for(let n=0;n<30;n++)for(let m=0;m<6;m++){const f=n*7+m,l=f+1,p=f+6+1,s=p+1;v.push(f,l,p,l,s,p)}const d=new o.BufferGeometry;return d.setAttribute("position",new o.Float32BufferAttribute(a,3)),d.setAttribute("uv",new o.Float32BufferAttribute(i,2)),d.setIndex(v),d.computeVertexNormals(),d},tt=(e,t,r,a,i=!1)=>{const v=gt(),d=22;for(const l of[-3.4,0,3.4])T(v,l,.5,0,1.25,d/2,1.25,d/2,0,4,Fe,0),T(v,l,-.5,0,.9,d/2-1,1.25,d/2,1,4,Ce),T(v,l,.5,d/2+1.3,1.1,.4,.5,.25,.5,4,Fe,0,"y");for(let l=-4;l<=4;l++)T(v,0,.55,l*2.3,5.2,.28,5.2,.28,.22,4,l%2?Fe:Ce);T(v,0,.77,-3.5,2.3,3,2.1,2.8,3,4,Fe),T(v,0,3.77,-3.5,2.6,3.3,.4,2.9,.9,4,Ne),T(v,2.32,.8,-3,.03,.45,.03,.45,2,4,ee),T(v,-2.5,.77,-6.2,.07,.07,.07,.07,3.9,4,ee),T(v,-2,.77,-6.2,.07,.07,.07,.07,3.9,4,ee);for(let l=0;l<7;l++)T(v,-2.25,1.1+l*.5,-6.2,.3,.05,.3,.05,.08,4,ee);for(let l=-5;l<=5;l++)for(const p of[-5,5])T(v,p,.77,l*2,.07,.07,.07,.07,1.1,4,ee);for(const l of[-5,5])T(v,l,1.82,0,.06,10.2,.06,10.2,.09,4,ee);for(let l=0;l<5;l++)T(v,3.2,.77,2+l*1.7,.08,.08,.1,.1,1.2,6,ee),T(v,3.2,1.97,2+l*1.7,.12,.12,.75,.75,.8,8,l%2?Ne:Fe);for(let l=0;l<3;l++)T(v,-3.2,.77,3+l*2.6,.06,.06,.06,.06,2.6,4,ee),l<2&&T(v,-3.2,1.6,4.3+l*2.6,.02,1.25,.02,1.25,1.6,4,Ne);T(v,-1.7,.77,-8.4,1,1,1,1,1.3,4,Ne),T(v,1.3,.77,-8.7,.9,.9,.9,.9,1,4,Ce),T(v,-1.5,2.07,-8.5,.6,.6,.6,.6,.7,4,Ce),T(v,.3,.77,.9,.55,.55,.55,.55,1.25,8,Ne),T(v,-1.1,.77,1.4,.55,.55,.55,.55,1.25,8,Ce),T(v,-.4,.77,2.4,.55,.55,.55,.55,1.25,8,Ne),T(v,0,.77,5.5,.16,.16,.09,.09,9.5,6,Ce),T(v,0,9.4,5.5,1.3,.07,1.3,.07,.12,4,ee);for(const l of[-1.2,0,1.2])T(v,l,9.55+(l===0?.6:0),5.5,.2,.2,.2,.2,.42,6,je,1);const n=new o.Group,m=new o.Mesh(wt(v),xt);m.frustumCulled=!1,n.add(m),i&&et(m,zt,n);const f=[];for(let l=0;l<a;l++){const p=i?32:60,s=P0(p),u=new o.Mesh(s,b0),h=a>1&&!i?l?34:-34:0,x=i&&l===1;u.position.set(h/r,(i?x?48:30:70)/r,(i?x?14:24:52)/r),u.rotation.set(x?-.6:-.85,0,0),u.scale.setScalar(1/r),n.add(u),f.push(u),i&&et(u,z0,n);const b=gt();for(const y of[-.9,-.35,.35,.9]){const g=y*1.2,z=p/(2*Math.sin(1.2)),w=i?1.2:7,C=new o.Vector3(z*Math.sin(g),z*(Math.cos(g)-1)*.75,0).applyEuler(u.rotation).multiplyScalar(1/r).add(u.position),N=new o.Vector3(y*3,1.2,7);for(let P=0;P<8;P++){const k=P/8,F=(P+1)/8,B=N.clone().lerp(C,k),V=N.clone().lerp(C,F);B.y-=w*Math.sin(k*Math.PI)/r,V.y-=w*Math.sin(F*Math.PI)/r;const U=b.p.length/3,O=.22/r;b.p.push(B.x-O,B.y,B.z,B.x+O,B.y,B.z,V.x-O,V.y,V.z,V.x+O,V.y,V.z,B.x,B.y-O,B.z,B.x,B.y+O,B.z,V.x,V.y-O,V.z,V.x,V.y+O,V.z);for(let Te=0;Te<8;Te++)b.c.push(ee.r,ee.g,ee.b,0);b.i.push(U,U+1,U+2,U+1,U+3,U+2,U+4,U+5,U+6,U+5,U+7,U+6)}}const c=new o.Mesh(wt(b),xt);c.frustumCulled=!1,n.add(c),i&&et(c,zt,n)}if(i){const l=new o.PlaneGeometry(30,80,12,16);l.rotateX(-Math.PI/2),l.translate(0,0,-48);const p=new o.Mesh(l,M0);p.frustumCulled=!1,p.renderOrder=.42,n.add(p)}n.scale.setScalar(r),W.add(n),bt.push({group:n,x:e,z:t,ph:J.range(0,6),kites:f,near:i})};await S.yield();let Mt=441;for(let e=40;e<=130;e+=6)Mt=Math.min(Mt,H(e,.5));const C0=Math.min(392,Mt-18);if(St===0)tt(-347,489,1,1),tt(21,340,1,1,!0),tt(1010,60,1,1);else if(St===1)tt(28,347,1.4,2,!0);else for(let e=0;e<9;e++){const t=gt();T(t,0,-.6,0,1.5,1.5,1.9,1.9,1.3,8,Fe),T(t,0,.7,0,1.9,1.9,.5,.5,1.1,8,Ne),T(t,0,1.8,0,.1,.1,.1,.1,3.4,4,ee),T(t,0,4.4,0,.16,.16,1.5,1.5,1.3,10,Ce),T(t,0,3.6,0,.26,.26,.26,.26,.5,6,je,1);const r=new o.Group,a=new o.Mesh(wt(t),xt);a.frustumCulled=!1,r.add(a),W.add(r),(e===6||e===7)&&r.scale.setScalar(2.3),et(a,zt,r),bt.push({group:r,x:e===6?18:e===7?52:e===8?128:24+e*9+(e>3?(e-3)*22:0),z:e===6?336:e===7?352:e===8?C0+14:40+e*52,ph:J.range(0,6),kites:[],buoy:!0})}await S.yield();const Xt=new o.Vector3(-31,13,340);ne.push((e,t,r,a)=>{for(const i of bt){const v=i.buoy?0:(i.near?300*(a-.52)+16e3*Math.pow(Math.max(0,a-.55),2):135*(a-.2))+1.2*Math.sin(t*.21+i.ph),d=i.z+(i.near?-.26*v:v),n=i.x+(i.near?.966*v:0),m=$e(n,d,t),f=$e(n+4,d,t),l=$e(n,d+6,t);if(i.group.position.set(n,m+(i.buoy?.1:.25),d),i.near){i.group.rotation.set(.02*Math.sin(t*.9+i.ph),Math.PI/2+.26,.015*Math.sin(t*.7+i.ph));const p=S.through?0:a;i.group.visible=p<.64,Xt.set(-(n+10),13,d);continue}i.group.rotation.set(-(l-m)/6*.8+.02*Math.sin(t*.9+i.ph),0,(f-m)/4*.8+(i.buoy?.08:.015)*Math.sin(t*.7+i.ph))}}),await S.yield();const ot=`
      float h21(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
      float fb(vec2 p){ return 0.55 * vn(p) + 0.3 * vn(p * 2.1 + 3.7) + 0.15 * vn(p * 4.3 + 9.1); }
      `;{const r=[],a=[],i=[];for(let m=0;m<=44;m++)for(let f=0;f<=14;f++){const l=f/14,p=m/44,s=232-190*p,u=170+(l-.5)*(46+34*p),h=H(170,Math.min(s,196),!0)+.6*Math.max(0,s-196)-3.5-4.5*Math.sin(l*Math.PI)-5*M(.45,1,p);r.push(u,s,h),a.push(l,p)}for(let m=0;m<44;m++)for(let f=0;f<14;f++){const l=m*15+f,p=l+1,s=l+14+1,u=s+1;i.push(l,p,s,p,u,s)}const v=new o.BufferGeometry;v.setAttribute("position",new o.Float32BufferAttribute(r,3)),v.setAttribute("uv",new o.Float32BufferAttribute(a,2)),v.setIndex(i);const d=new o.ShaderMaterial({uniforms:q(),fog:!0,side:o.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:L+`varying vec2 vQ; void main(){ vQ = uv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`uniform float uTime, uVeil, uU;
`+Q+re+ot+E+`varying vec2 vQ;
          void main(){
            float t = vQ.y, s = vQ.x, sc = s * 2. - 1.; float tt = uTime * 0.1;
            // A BODY OF WATER: one bright column that pours in slow lobes, opens into strands and goes to mist where it frays
            float st = fb(vec2(s * 15., t * 0.7 - tt * 1.2));                       // strands
            float lobes = fb(vec2(s * 4., t * 5. - tt * 3.2));                       // slow lobes riding down them
            float wob = 0.12 * (fb(vec2(t * 3. - tt * 1.5, 2.)) - 0.5) * (0.3 + t);
            float w = 0.3 + 0.34 * t, e = (sc - wob) / w, core = exp(-e * e * 1.6);
            float body = smoothstep(0.2 + 0.42 * t, 0.46 + 0.4 * t, st * 0.5 + lobes * 0.66);
            float pour = core * mix(1., 0.25 + 0.75 * body, smoothstep(0.12, 0.7, t)) * (1. - smoothstep(0.5, 0.96, t)) * smoothstep(0.0, 0.08, t);
            float mn = fb(vec2(s * 3. + tt * 0.6, t * 4. - tt * 1.1)), em = sc / 0.92;
            float mist = smoothstep(0.38, 0.72, t) * (1. - smoothstep(0.86, 1., t)) * exp(-em * em * 2.2) * smoothstep(0.25, 0.75, mn) * (1. - smoothstep(0.75, 1., abs(sc)));
            float a = clamp(0.97 * pour + 0.46 * mist * (1. - pour), 0., 0.97);
            // the core is the one near-white thing on the face; its far side and its mist take the dusk
            vec3 wc = mix(cCream, vec3(1.), 0.72) * mix(uKey, vec3(1.), 0.62) * (1.25 + 0.9 * core * (0.5 + lobes)) * (1. - 0.3 * smoothstep(-0.3, 0.9, e)) * (1. - 0.12 * t);
            vec3 mc = mix(mix(cCream, vec3(1.), 0.3) * mix(uKey, vec3(1.), 0.5), cCool * 1.8, 0.22 + 0.3 * smoothstep(-0.2, 0.8, sc)) * (0.8 + 0.3 * mn);
            vec3 c = mix(mc, wc, clamp(pour / max(a, 1e-3), 0., 1.)) * (1. - 0.45 * uRainDim);
            c = mix(c, mix(cDeep, cCool, 0.55) * 0.8, (1. - smoothstep(0.0, 0.1, t)) * 0.6);     // it leaves the cloud dark
            gl_FragColor = vec4(c, a * (1. - uVeil) * (1. - 0.9 * smoothstep(0.83, 0.868, uU)));          // (in the throat of the notch it thins away: no white blur over the gold wall)
            #include <fog_fragment>
            gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 0.85 * uVeil);      // from inside the rain, a ghost of itself
          }`}),n=new o.Mesh(v,d);n.name="methanefall",n.frustumCulled=!1,n.renderOrder=4,W.add(n),ye.push(n)}{const e=[],t=[],r=[],a=[],i=new o.Vector3,v=new o.Vector3;[.9,.975].forEach((f,l)=>{qe(f,v),ce.tangentAt(f,i),i.x=-i.x;const p=i.z,s=-i.x,u=Math.hypot(p,s)||1,h=e.length/3,x=150,b=120;for(let c=0;c<=1;c++)for(let y=0;y<=1;y++){const g=(y-.5)*x,z=(c-.42)*b;if(l===0){const w=(y-.5)*84,C=(c-.5)*96;e.push(2+w,92+C,470-.1*w),r.push(w/150,C/120,l)}else e.push(v.x+p/u*g,v.y+z,v.z+s/u*g),r.push(y-.5,c-.42,l);t.push(y*3+l*1.7,c*2.4+l*.9)}a.push(h,h+1,h+2,h+1,h+3,h+2)});const d=new o.BufferGeometry;d.setAttribute("position",new o.Float32BufferAttribute(e,3)),d.setAttribute("uv",new o.Float32BufferAttribute(t,2)),d.setAttribute("aV",new o.Float32BufferAttribute(r,3)),d.setIndex(a);const n=new o.ShaderMaterial({uniforms:q({uFogCol:{value:me.fog.color}}),side:o.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:`attribute vec3 aV; varying vec2 vQ; varying vec3 vA; varying float vD;
          void main(){ vQ = uv; vA = aV; vec4 mv = modelViewMatrix * vec4(position, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform float uTime; uniform vec3 uFogCol, uKey, cCream;
`+ot+`varying vec2 vQ; varying vec3 vA; varying float vD;
          void main(){
            float sx = vA.x * 150., sy = vA.y * 120., last = step(0.5, vA.z), fwx = fwidth(sx);
            float fine = fb(vec2(sx * 0.9 + uTime * 0.22 + last * 9., sy * 0.06 + uTime * 0.26));
            float fine2 = mix(fb(vec2(sx * 2.4 - uTime * 0.17, sy * 0.13 + uTime * 0.45)), 0.45, smoothstep(0.03, 0.1, fwx));
            // (0) the fall's veil: ONE clean gauze over the port third, its edge slanting and soft, never more than a third;
            // (1) the last wisp, a slanting band that passes above the ring
            float dr0 = 5. * sin(uTime * 0.13), ge = length(vec2((sx - dr0 + 0.3 * sy) / 31., sy / 43.)) + 0.3 * (fine - 0.5);
            float g0 = 1. - smoothstep(0.3, 1., ge);                                 // a slanting gauze that thins to nothing all round, drifting
            float yc = 18. - 0.4 * sx + 5. * sin(sx * 0.05 + uTime * 0.11), sb = (sy - yc) / 6.5;
            float g1 = (1. - smoothstep(0.3, 1.05, sb)) * smoothstep(-1.0 - 1.8 * fine, -0.25 - 0.4 * fine, sb) * (1. - smoothstep(0.25, 0.5, abs(vA.x)));
            float body = mix(g0, g1, last);
            float a = body * mix(clamp(0.17 + 0.24 * (fine - 0.5) + 0.34 * (fine2 - 0.45), 0.03, 0.33), clamp(0.34 + 0.7 * fine + 0.6 * (fine2 - 0.45), 0., 1.) * 0.28, last);
            vec2 sg = vec2(sx, sy + uTime * 1.1) * 2.6; float hs = h21(floor(sg) + last * 13.);
            float spk = step(0.9, hs) * (1. - smoothstep(0.04, 0.16 + 2.6 * fwx, length(fract(sg) - 0.5))) * (0.5 + 0.5 * sin(uTime * (3. + 5. * hs) + hs * 50.)) * body * min(1., 0.05 / max(fwx, 1e-3));
            float nearV = smoothstep(3., 15., vD) * (1. - smoothstep(45., 80., vD));       // never a wall in the face, never a haze from afar
            vec3 c = mix(cCream, uFogCol, 0.2) * (0.95 + 0.25 * fine) * mix(vec3(1.), uKey, 0.5);
            gl_FragColor = vec4(c + uKey * 1.6 * spk, clamp((a + 0.5 * spk) * nearV, 0., 0.5));
          }`}),m=new o.Mesh(d,n);m.name="veils",m.frustumCulled=!1,m.renderOrder=5,W.add(m)}await S.yield();{const e=new o.PlaneGeometry(1,1,1,1),t=new o.ShaderMaterial({uniforms:q(),transparent:!0,depthWrite:!1,side:o.DoubleSide,vertexShader:`varying vec3 vP; varying float vD;
          void main(){ vec3 p = vec3(-130. + position.x * 580., 94. + position.y * 196., 385.); vP = p;
            vec4 mv = modelViewMatrix * vec4(p, 1.); vD = -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform float uTime, uVeil; uniform vec3 uKey;
`+Q+ot+`varying vec3 vP; varying float vD;
          void main(){
            float n = fb(vec2(vP.x * 0.012 + uTime * 0.012, vP.y * 0.03 - uTime * 0.004));
            float a = (1. - smoothstep(8., 96., vP.x + 30. * n)) * smoothstep(-420., -250., vP.x) * (1. - smoothstep(40., 185., vP.y + 70. * n)) * smoothstep(-4., 6., vP.y);
            a *= smoothstep(150., 300., vD) * 0.86 * (1. - uVeil);
            gl_FragColor = vec4(mix(cCream, cHaze, 0.42) * mix(vec3(1.), uKey, 0.5) * (0.92 + 0.25 * n), a);
          }`}),r=new o.Mesh(e,t);r.name="haze-bank",r.frustumCulled=!1,r.renderOrder=.45,W.add(r)}const N0=S.core.clamp,Jt=Y(.02+11.5/ce.length,0,2.6,0,new o.Vector3),S0=I(.02)-1.05,Zt=.4203,at=Y(.424,0,.8,0,new o.Vector3),k0=I(Zt)-4.2,$t=Y(.437,0,5,0,new o.Vector3),A0=I(.415)-1.15,F0=qe(Zt,new o.Vector3).y;ne.push((e,t,r,a)=>{const i=I(a);if(a<.24)j.setFeature(-Jt.x+R[0],Jt.z-R[2],i-S0,[2,2.6,1.4][oe],1),j.setFeature2(0,0,-99,1,1);else{const v=N0((F0-.12-$e(at.x,at.z,t)-1.75)/1.394,.6,2.6);j.setFeature(-at.x+R[0],at.z-R[2],i-k0,1.25,v),j.setFeature2(-$t.x+R[0],$t.z-R[2],i-A0,1.3,1)}});const e0=new o.Vector3(50,0,215);{const e=le.fork("passers"),t=[],r=ce.length,a=d=>r*.004/Math.max(.001,I(d+.002)-I(d-.002));for(let d=0,n=.298;n<.476;d++){const m=a(n),f=n,l=f>.374&&f<.472,p=d%2?1:-1;n+=Math.max(3.2,.48*m)/r;const s=p*((l?3.3+.7*e():4.2+1.5*e())+(oe===2?l?1.3:.6:0)),u=(l?[1.2,1.5,1.05,1.38]:[.9,1.6,1.25,1.9])[d%4]+e.range(-.08,.08),h=(l?1.14+.2*e():1.08+.26*e())*(oe===1?1.4:oe===2?l?.85:.72:1);if(p>0&&Math.abs(f-.437)<.008||p<0&&f>.342&&f<.356||Be&&p>0&&f>.385)continue;const x=Y(f,0,s,0,new o.Vector3);t.push({slot:d%8,x:-x.x+R[0],z:x.z-R[2],t0:I(f-9/r)-u,size:h})}{const d=le.fork("approach");for(let n=0,m=.064;m<.236;n++,m+=(8.5+3*d())/r){const f=n%2?1:-1,l=Y(m,0,f*(5.2+4.5*d()),0,new o.Vector3);Math.abs(m-.172)<.03||t.push({slot:7-n%8,x:-l.x+R[0],z:l.z-R[2],t0:I(m-15/r)-[1,1.5,1.2,1.8][n%4],size:1.15+.4*d()})}}{const d=Y(.16+12.5/r,0,-3.6,0,new o.Vector3);t.push({slot:1,x:-d.x+R[0],z:d.z-R[2],t0:I(.16)-1.3,size:[1.75,2.2,1.3][oe]})}for(const[d,n,m,f,l,p]of[[.5,5.5,25,1.5,1.4,5],[.52,-5.5,24,1.3,1.75,0],[.522,7,27,1,1.4,1],[.548,5.5,26,1.25,1.6,2],[.565,-7,27,1.3,1.6,3]]){const s=Y(d+m/r,0,n,0,new o.Vector3);t.push({slot:p,x:-s.x+R[0],z:s.z-R[2],t0:I(d)-f,size:l*(oe===1?1.25:oe===2?.8:1)})}{const d=Y(.25+13.5/r,0,2.2,0,new o.Vector3);t.push({slot:4,x:-d.x+R[0],z:d.z-R[2],t0:I(.25)-1.35,size:[1.75,2.2,1.3][oe]})}const i=qe(.378,new o.Vector3),v=qe(.482,new o.Vector3);j.setLane(-i.x+R[0],i.z-R[2],-v.x+R[0],v.z-R[2],9,1),ne.push((d,n,m,f)=>{const l=I(f);for(let p=0;p<8;p++)j.setPasser(p,0,0,-99,0);if(f<.64)for(const p of t){const s=l-p.t0;s>-.8&&s<3&&j.setPasser(p.slot,p.x,p.z,s,p.size)}Y(Math.min(f,.5),11,0,0,A),e0.set(-A.x,.4,A.z)})}const Pt=`
      vec3 lensCol(vec3 N, vec3 V, float rim){              // V: from eye to surface. The world upside down, a hard crescent
        vec3 rd = normalize(V - 1.3 * (N - V * dot(N, V)) + vec3(0., 1e-4, 0.));
        vec3 c = envCol(vec3(rd.x, -rd.y, rd.z)) * mix(vec3(1.), cHaze, 0.5); c *= 1.2 / (1. + 0.8 * max(c.r, max(c.g, c.b))); c *= mix(vec3(0.55), cHaze * 0.9, 0.7);   // an amber body, never a pale disc
        float fr = 1. - abs(dot(N, V)); fr *= fr;
        c += envCol(reflect(V, N)) * fr * 0.6;
        float sl = dot(N, uSun);
        c *= 1. - 0.62 * smoothstep(0.3, 0.85, fr) * (1. - smoothstep(-0.1, 0.4, sl));                 // a dark rim away from the tear
        c += uKey * 4.2 * smoothstep(0.22, 0.6, sl) * smoothstep(0.18, 0.6, fr) * rim;                       // a broad crescent of light toward it
        c += uKey * 0.9 * smoothstep(0.45, 0.85, -sl) * (1. - smoothstep(0.1, 0.5, fr));                    // and the light it gathers, low on the far side
        return c; }
    `;{const e=le.fork("lensdrops"),t=Math.max(.85,[1,.62,1.5][oe])*(oe===2?.8:1)*.9,r=[],a=(h,x,b,c,y)=>r.push({t0:I(h),p:Y(h,x,b,c,new o.Vector3),r:y*t,s:e()});a(.03,2.5,1.5,-.1,.12),a(.03,4.4,-2.3,.8,.12),a(.03,7.5,3.4,1.5,.13),a(.03,11,-4.5,2.6,.12),a(.33,4.6,-1.9,-.1,.125);for(let h=0;h<11;h++){const x=e.range(2.7,5.6)*1.9,b=e.range(-.6,.62)+(h%2?.1:0),c=e.range(-.2,.28);a(.33,x*Math.cos(b),x*Math.sin(b),x*c,e.range(.1,.15))}const i=r.length,v=new Float32Array(i*8),d=new Float32Array(i*6),n=new o.SphereGeometry(1,16,10),m=new o.InstancedBufferGeometry;m.setAttribute("position",n.attributes.position),m.setAttribute("normal",n.attributes.normal),m.setIndex(n.index),ze.push(n);const f=new o.InstancedBufferAttribute(v,4),l=new o.InstancedBufferAttribute(d,3);f.setUsage(o.DynamicDrawUsage),l.setUsage(o.DynamicDrawUsage),m.setAttribute("aD",f),m.setAttribute("aE",l),m.instanceCount=i*2,m.boundingSphere=he;const p=new o.ShaderMaterial({uniforms:q({uSeat:Me}),fog:!0,vertexShader:be+`uniform vec3 uCamB; uniform vec2 uSeat;
`+L+`attribute vec4 aD; attribute vec3 aE; varying vec3 vN, vV; varying float vM;
          void main(){ float w = 0.17 * sin(uTime * (3.4 + 2. * aE.x) + aE.x * 40.);
            vec3 sc = vec3(1. + w * 0.85, 1. - w, 1. + w * 0.85); vec3 n = normalize(normal / sc); vec3 c = aD.xyz;
            vec3 wp = c + position * sc * aD.w * mix(0.4, 1., smoothstep(1.2, 3.4, length(c - uCamB))); float sw = swellH(vec2(-(c.x - uSeat.x), c.z - uSeat.y));
            if (aE.z > 0.5) {                                            // the image in the sea, laid on the surface along the line of sight
              wp.y = 2. * sw - wp.y; float f = clamp((uCamB.y - sw - 0.04) / max(uCamB.y - wp.y, 0.05), 0., 1.); wp = uCamB + (wp - uCamB) * f * 0.99; }
            wp.y -= (1. - aE.y) * 90.;
            vN = n; vV = wp - uCamB; vM = aE.z;
            vec4 mvPosition = modelViewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:Q+re+Pt+E+`varying vec3 vN, vV; varying float vM;
          void main(){ vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); vec3 V = normalize(vV + vec3(0., 1e-4, 0.));
            if (vM > 0.5) V.y = -V.y;                                      // shade the image as the drop it mirrors
            vec3 c = lensCol(N, V, 1.) + mix(cEmber, cHaze, 0.6) * (0.16 + 0.26 * abs(dot(N, V)));
            if (vM > 0.5) c = c * 0.5 + cRust * 0.1;
            gl_FragColor = vec4(c, 1.);
            #include <fog_fragment>
          }`}),s=new o.Mesh(m,p);s.name="lens-drops",s.frustumCulled=!1,s.renderOrder=1.2,W.add(s);const u=[.5,3.3];ne.push((h,x,b,c)=>{const y=I(c);for(let g=0;g<i;g++){const z=r[g],w=y-z.t0,C=z.p.y-1.6*w,N=Math.abs(w)<7&&C>1.2?1:0;for(let P=0;P<2;P++){const k=g*2+P;v[k*4]=z.p.x+u[0]*w,v[k*4+1]=C,v[k*4+2]=z.p.z+u[1]*w,v[k*4+3]=z.r,d[k*3]=z.s,d[k*3+1]=N,d[k*3+2]=P}}f.needsUpdate=!0,l.needsUpdate=!0})}const T0=qt.uniforms.uLift.value;if(Be){const e=Y(.47,0,19,0,new o.Vector3);e.y=0;const t=q({uTau:{value:-20},uSite:{value:e},uSeat2:Me}),r=new o.SphereGeometry(1.5,36,24);r.scale(1.2,1.2,1.2);const a=new o.ShaderMaterial({uniforms:t,fog:!0,vertexShader:`uniform float uTime, uTau; uniform vec3 uSite;
`+L+`varying vec3 vN, vP;
          void main(){ float fall = max(-uTau, 0.); float squash = (1. - smoothstep(0., 0.35, fall));
            float w = 0.22 * sin(uTime * 2.4) + 0.08 * sin(uTime * 5.1 + 1.);
            vec3 p = position; float yn = p.y / 1.5;
            float rad = 1. + w * (0.6 - yn * 0.8) + 0.07 * sin(atan(p.z, p.x + 1e-5) * 5. + uTime * 1.7) * (1. - yn * yn);
            p.xz *= rad * (1. + 0.6 * squash); p.y *= (1. - w * 0.8) * (1. - 0.7 * squash);
            vec3 n = normalize(normal * vec3(1., 1. + w * 1.6 + 2. * squash, 1.) + vec3(0., -0.5 * w * (1. - yn * yn), 0.));
            vec3 wp = uSite + vec3(0.6 * sin(uTime * 0.7), 1.6 + fall * 3.0, 0.6 * cos(uTime * 0.6)) + p;
            if (uTau > 0.15) wp.y = -50.;
            vN = n; vP = wp; vec4 mvPosition = modelViewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`uniform vec3 uCamB;
`+Q+re+Pt+E+`varying vec3 vN, vP;
          void main(){ vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); vec3 V = normalize(vP - uCamB + vec3(0., 1e-4, 0.));
            gl_FragColor = vec4(lensCol(N, V, 1.), 1.);
            #include <fog_fragment>
          }`}),i=new o.Mesh(r,a);i.frustumCulled=!1,i.renderOrder=1.5,W.add(i);const v=216,d=12,n=[],m=[],f=[];for(let c=0;c<=d;c++)for(let y=0;y<v;y++){const g=y/v*Math.PI*2;n.push(Math.cos(g),c/d,Math.sin(g)),m.push(y/v,c/d,0)}for(let c=0;c<d;c++)for(let y=0;y<v;y++){const g=c*v+y,z=c*v+(y+1)%v,w=g+v,C=z+v;f.push(g,z,w,z,C,w)}for(let c=0;c<18;c++){const y=n.length/3,g=(c+.5)/18*Math.PI*2;for(let z=0;z<=6;z++)for(let w=0;w<8;w++){const C=z/6*Math.PI,N=w/8*Math.PI*2;n.push(Math.sin(C)*Math.cos(N),Math.cos(C),Math.sin(C)*Math.sin(N)),m.push((c+.5)/18,1,1+c)}for(let z=0;z<6;z++)for(let w=0;w<8;w++){const C=y+z*8+w,N=y+z*8+(w+1)%8,P=C+8,k=N+8;f.push(C,N,P,N,k,P)}}const l=new o.BufferGeometry;l.setAttribute("position",new o.Float32BufferAttribute(n,3)),l.setAttribute("aQ",new o.Float32BufferAttribute(m,3)),l.setIndex(f);const p=new o.ShaderMaterial({uniforms:t,fog:!0,side:o.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:`uniform float uTime, uTau; uniform vec3 uSite;
`+L+`attribute vec3 aQ; varying vec3 vN, vP; varying vec3 vQ;
          void main(){ float t = uTau; float a = aQ.x * 6.2832; float h = aQ.y;
            float rise = smoothstep(0., 1.5, t), fold = smoothstep(3.4, 6.2, t), on = step(0., t) * (1. - smoothstep(5.8, 6.4, t));
            float lobe = sqrt(0.5 + 0.5 * cos(a * 18.) + 1e-4);                      // eighteen round-topped scallops
            float H = 8.0 * rise * (1. - fold) * (0.72 + 0.28 * lobe * smoothstep(0.5, 1., h) * smoothstep(0.7, 1.8, t));
            float R = 3.0 + 5.0 * smoothstep(0., 3.0, t) + (1.4 + 1.6 * rise) * h * h - 2.5 * fold * h;
            R *= 1. + 0.035 * cos(a * 18.) * (0.3 + 0.7 * h) + 0.02 * sin(a * 7. + uTime * 1.3) * h;
            vec3 dir = vec3(cos(a), 0., sin(a)); vec3 p = dir * R + vec3(0., H * h - 0.25, 0.);
            vec3 n = normalize(dir + vec3(0., -(2.8 + 3.2 * rise) * h / max(H, 0.5), 0.) + 0.25 * vec3(-sin(a), 0., cos(a)) * sin(a * 18.));
            if (aQ.z > 0.5) {                                                       // a bead: leaves its point at t 2.3, flies a slow arc
              float k = aQ.z; float tb = max(t - 1.6 - 0.25 * fract(k * 0.618), 0.); float sz = 0.42 + 0.14 * fract(k * 0.37);
              vec3 c0 = dir * (9.4 + 0.2 * sin(k)) + vec3(0., 8.0 * rise, 0.);
              c0 += dir * (2.3 + 0.8 * fract(k * 0.71)) * tb + vec3(0., (2.6 + fract(k * 0.53)) * tb - 0.62 * tb * tb, 0.);
              float show = step(1.3, t) * step(0.3, c0.y); c0.y = max(c0.y, -3.);
              p = c0 + position * sz * show * (1. + 0.15 * sin(uTime * 6. + k) * vec3(1., -1., 1.)); n = normalize(position + vec3(0., 1e-4, 0.)); on = show; }
            vec3 wp = uSite + p * on - vec3(0., 60. * (1. - on), 0.);
            vN = n; vP = wp; vQ = vec3(aQ.xy, aQ.z > 0.5 ? 1. : 0.);
            vec4 mvPosition = modelViewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`uniform vec3 uCamB; uniform float uTau;
`+Q+re+Pt+E+`varying vec3 vN, vP; varying vec3 vQ;
          void main(){ vec3 V = normalize(vP - uCamB + vec3(0., 1e-4, 0.)); vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (dot(N, V) > 0.) N = -N;
            vec3 c = lensCol(N, V, 1.); float fr = 1. - abs(dot(N, V));
            float flute = 0.5 + 0.5 * cos(vQ.x * 6.2832 * 18.); float thread = smoothstep(0.75, 1., vQ.y) * (1. - flute);
            // the same glass as the small crowns: two flutes to a lobe, amber through the sunward half, a lip lit only toward the tear
            float band = smoothstep(-0.6, 0.6, cos(vQ.x * 6.2832 * 36. + 0.9)), glassL = mix(0.5, 1.15, band);
            float sunSide = dot(normalize(vN + vec3(0., 1e-4, 0.)), uSun), thru = smoothstep(-0.2, 0.8, sunSide);
            float al = mix(0.2 + 0.55 * fr * fr + 0.14 * band * vQ.y + 0.42 * thru * thru + 0.14 * smoothstep(0.9, 1., vQ.y), 1., vQ.z);
            al *= 1. - 0.75 * thread * (1. - vQ.z);                              // the rim thins to threads between the points
            c = mix(c * glassL * 0.8 * (1. - 0.4 * thru) + mix(cEmber, cHaze, 0.45) * vec3(1.1, 0.9, 0.62) * (0.08 + 0.25 * fr * thru + (1.4 * thru * thru + 0.2 * thru) * glassL * (0.5 + 0.5 * vQ.y)) + mix(cCool, cDeep, 0.3) * 0.45 * (1. - thru) * glassL, c, vQ.z) + uKey * 0.9 * smoothstep(0.93, 1., vQ.y) * (1. - vQ.z) * smoothstep(0.2, 0.85, sunSide);
            gl_FragColor = vec4(c, clamp(al, 0., 1.));
            #include <fog_fragment>
          }`}),s=new o.Mesh(l,p);s.frustumCulled=!1,s.renderOrder=3.5,W.add(s);const u=new o.RingGeometry(.5,1,96,6);u.rotateX(-Math.PI/2);const h=new o.ShaderMaterial({uniforms:t,fog:!0,side:o.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:be+`uniform float uTau; uniform vec3 uSite; uniform vec2 uSeat2;
`+L+`varying vec3 vN, vP; varying float vA;
          void main(){ float t = max(uTau, 0.); float rad = 6. + 5.5 * t; float s = (length(position.xz) - 0.75) * 4.;     // -1..1 across
            float amp = 0.75 * exp(-t * 0.16) * smoothstep(0.4, 1.6, t); vec3 dir = normalize(position + vec3(1e-5, 0., 0.));
            vec3 wp = uSite + dir * (rad + s * 4.5); vec2 hl = vec2(-(wp.x - uSeat2.x), wp.z - uSeat2.y);
            wp.y = swellH(hl) + 0.03 + amp * (0.5 + 0.5 * cos(s * 3.1416));
            vN = normalize(vec3(0., 1., 0.) + dir * amp * 0.55 * sin(s * 3.1416)); vP = wp; vA = (1. - s * s) * step(0.3, uTau) * (1. - smoothstep(14., 22., t));
            vec4 mvPosition = modelViewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`uniform vec3 uCamB;
`+Q+E+`varying vec3 vN, vP; varying float vA;
          void main(){ vec3 V = normalize(vP - uCamB + vec3(0., 1e-4, 0.)); vec3 N = normalize(vN); vec3 R = reflect(V, N); R.y = abs(R.y) + 0.004;
            float x1 = 1. - clamp(dot(-V, N), 0., 1.); vec3 c = mix(cInk, skyCol(normalize(R)), 0.3 + 0.7 * x1 * sqrt(x1));
            gl_FragColor = vec4(c, clamp(vA * 1.6, 0., 1.));
            #include <fog_fragment>
          }`}),x=new o.Mesh(u,h);x.frustumCulled=!1,x.renderOrder=.3,W.add(x);const b=new o.Vector3(-e.x,5,e.z);_e.poi={at:(c,y)=>b.set(-e.x,y<.4?3+(I(.4)-I(y))*3:5,e.z),from:.255,to:.32,weight:.5},_e.poi2={at:(c,y)=>b.set(-e.x,y<.4?3+(I(.4)-I(y))*3:5,e.z),from:.395,to:.48,weight:.62},ne.push((c,y,g,z)=>{const w=I(z)-I(.4);t.uTau.value=w,T0.set(e.x,e.z,6+5.5*Math.max(w,0),w>.4&&w<20?.8*Math.exp(-w*.16):0)})}await S.yield();{const r=[],a=[];for(let p=0;p<=40;p++)for(let s=0;s<=20;s++)r.push(s/(20/2)-1,0,p/40);for(let p=0;p<40;p++)for(let s=0;s<20;s++){const u=p*21+s,h=u+1,x=u+20+1,b=x+1;a.push(u,h,x,h,b,x)}const i=new o.BufferGeometry;i.setAttribute("position",new o.Float32BufferAttribute(r,3)),i.setIndex(a);const v=[0,1,2,3].map(()=>new o.Vector2),d=q({uTr:{value:v},uSkOn:{value:0},uSeat2:Me}),n=new o.ShaderMaterial({uniforms:d,fog:!0,side:o.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:be+`uniform vec2 uTr[4]; uniform float uSkOn; uniform vec2 uSeat2;
`+L+`varying vec3 vN, vP; varying float vA, vH, vX;
          vec2 trk(float t){ float s = clamp(t, 0., 1.) * 3.; vec2 a = uTr[0], b = uTr[1], c = uTr[2], d = uTr[3];
            if (s < 1.) return mix(a, b, s) + 0.25 * s * (1. - s) * (2. * b - a - c);
            if (s < 2.) { float f = s - 1.; return mix(b, c, f) + 0.25 * f * (1. - f) * ((2. * b - a - c) + (2. * c - b - d)); }
            float f = s - 2.; return mix(c, d, f) + 0.25 * f * (1. - f) * (2. * c - b - d); }
          void main(){ float t = position.z, x = position.x, ax = abs(x);
            vec2 c0 = trk(t), tg = trk(t + 0.03) - trk(t - 0.03); tg /= max(length(tg), 1e-4); vec2 r = vec2(tg.y, -tg.x);
            float wd = 0.35 + 8.2 * pow(t, 0.85); vec2 q = c0 + r * x * wd;
            vec2 hl = vec2(-(q.x - uSeat2.x), q.y - uSeat2.y);
            // the lips stand a metre proud at the jaw and sink back into the mirror: a wedge of folded water that dies away behind
            float die = (1. - t) * (1. - t), amp = (1.15 * exp(-t * 2.6) * (1. - t) + 0.14 * die) * smoothstep(0., 0.05, t) * uSkOn;
            float e = (ax - 0.78) / 0.13, lipP = exp(-e * e), prof = lipP;                                           // a lip each side, the smooth trough between
            vec3 wp = vec3(q.x, swellH(hl) + 0.03 + amp * prof, q.y);
            float dp = (-2. * e / 0.13 * lipP) * sign(x) * amp / max(wd, 0.3);
            vN = normalize(vec3(-r.x * dp, 1., -r.y * dp)); vP = wp;
            vA = (1. - t) * (1. - t * t) * uSkOn * smoothstep(0., 0.03, t); vH = lipP; vX = x;
            vec4 mvPosition = modelViewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`uniform vec3 uCamB; uniform vec3 uKey;
`+Q+E+`varying vec3 vN, vP; varying float vA, vH, vX;
          void main(){ vec3 V = normalize(vP - uCamB + vec3(0., 1e-4, 0.)); vec3 N = normalize(vN); vec3 R = reflect(V, N); R.y = abs(R.y) + 0.004;
            float x1 = 1. - clamp(dot(-V, N), 0., 1.); vec3 c = mix(mix(cInk, cDeep, 0.6), skyCol(normalize(R)), 0.3 + 0.7 * x1 * sqrt(x1));
            float ef = (abs(vX) - 0.78) / 0.13, lipF = exp(-ef * ef), edge = 1. - smoothstep(0.92, 1., abs(vX));
            float lit = smoothstep(0.02, 0.4, dot(N, uSun) - uSun.y), crest = smoothstep(0.45, 0.92, lipF);
            c = mix(mix(cDeep, cCool, 0.3) * 0.34, c, 0.25 + 0.45 * lit * lipF);                                            // the trough and the faces turned away hold the dusk
            c += vec3(1., 0.84, 0.56) * (0.9 * lit * lipF * (1. - crest) + crest * (1.5 + 1.5 * lit));                // the faces toward the tear are gold, each crest a bright thread
            gl_FragColor = vec4(c, clamp(vA * (0.12 + 2.2 * lipF) * edge, 0., 0.95));
            #include <fog_fragment>
          }`}),m=new o.Mesh(i,n);m.frustumCulled=!1,m.renderOrder=.4,m.visible=!1,W.add(m);const f=new o.Vector3,l=new o.Vector3;ne.push((p,s,u,h)=>{if(m.visible=Pe.on>.01,d.uSkOn.value=Pe.on,Pe.on>.01)for(let x=0;x<4;x++)Qe(Qt,h+.004-.011*x,f,l),v[x].set(f.x,f.z)})}{const e=(c,y)=>{let g=-9,z=150;for(let w=0;w<18;w++){const C=(g+z)/2;H(c,C)<y?g=C:z=C}return(g+z)/2},t=le.fork("talus"),r=[],a=6,i=[],v=[];for(let c=0;c<a;c++){const y=(c+.35*Math.sin(c*2.4))/a*Math.PI*2,g=.72+.34*Math.abs(Math.sin(c*1.7+.6));i.push([Math.cos(y)*g*.95+.04,.4+.05*Math.sin(c*2.1),Math.sin(y)*g*.95]),v.push([Math.cos(y)*g,-.12,Math.sin(y)*g])}for(let c=1;c<a-1;c++)r.push(...i[0],...i[c+1],...i[c]);for(let c=0;c<a;c++){const y=(c+1)%a;r.push(...v[c],...i[c],...i[y],...v[c],...i[y],...v[y])}const d=new o.BufferGeometry;d.setAttribute("position",new o.Float32BufferAttribute(r,3)),d.computeVertexNormals();{const c=d.attributes.position,y=d.attributes.normal;for(let g=0;g<c.count;g+=3){const z=(c.getX(g)+c.getX(g+1)+c.getX(g+2))/3,w=(c.getY(g)+c.getY(g+1)+c.getY(g+2))/3-.13,C=(c.getZ(g)+c.getZ(g+1)+c.getZ(g+2))/3;if(y.getX(g)*z+y.getY(g)*w+y.getZ(g)*C<0)for(let N=0;N<3;N++)y.setXYZ(g+N,-y.getX(g+N),-y.getY(g+N),-y.getZ(g+N))}}const n=new o.InstancedBufferGeometry;n.setAttribute("position",d.attributes.position),n.setAttribute("normal",d.attributes.normal);const m=13,f=m+Math.round(52*Math.max(.7,de))+4,l=new Float32Array(f*4),p=new Float32Array(f*4),s=[];let u=0;const h=(c,y,g,z,w,C)=>{const N=Math.atan2(e(c,g+.6*z)-e(c,g-.6*z),1.2*z);l.set([c,y-z*.07,g,z],u*4),p.set([w,N+C,t.range(.85,1.25),t()],u*4),s.push([c,g,z]),u++};for(let c=0;c<9e3&&u<f-4;c++){c%20===19&&await S.yield();const y=u<m,g=y?t.range(428,476):t.range(424,500),z=22+(g-412)*.444,w=z+t.gauss()*(y?46:60),C=e(w,g),N=y?t.range(4.4,7.4):t.range(1,2.6);if(!(y||t()<.2+.8*M(.03,.5,ht(Le(w,60)))&&t()<1.1-C/40)||C<.6||C>(y?30:70)||ce.distanceTo(-w,C+N*.3,g)<8+N)continue;let k=!1;for(const F of s)if(Math.hypot(F[0]-w,F[1]-g)<(F[2]+N)*(y?1.25:.8)){k=!0;break}k||h(w,C,g,N,t.range(0,6.28),t()<.2?t.range(.1,.2):t.range(-.04,.04))}for(const[c,y,g]of[[440,-7,3],[451,-10.5,3.6],[463,-8,2.8],[474,-11,3.2]]){const z=23+(c-416)/2.25,w=z-2.2+y;h(w,e(w,c),c,g,t.range(0,6.28),0)}n.setAttribute("aPos",new o.InstancedBufferAttribute(l,4)),n.setAttribute("aRot",new o.InstancedBufferAttribute(p,4)),n.instanceCount=u,n.boundingSphere=he;const x=new o.ShaderMaterial({uniforms:q(),fog:!0,side:o.DoubleSide,vertexShader:L+`attribute vec4 aPos, aRot; varying vec3 vN, vP; varying float vS, vH;
          void main(){ float c = cos(aRot.x), s = sin(aRot.x); vec3 p = position * vec3(1., aRot.z, 1.), n = normal;
            p = vec3(p.x * c - p.z * s, p.y, p.x * s + p.z * c); n = vec3(n.x * c - n.z * s, n.y, n.x * s + n.z * c);
            float ct = cos(aRot.y), st = sin(aRot.y);                                         // then laid back on the slope (which rises toward +z)
            p.yz = vec2(p.y * ct + p.z * st, p.z * ct - p.y * st); n.yz = vec2(n.y * ct + n.z * st, n.z * ct - n.y * st);
            vec3 w = aPos.xyz + p * aPos.w; vN = n; vP = w; vS = aRot.w; vH = position.y * 4.;   // (position.y runs -0.12 to 0.45)
            vec4 mvPosition = modelViewMatrix * vec4(w, 1.); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`uniform float uTime, uVeil; uniform vec3 uCamB, uIceKey;
`+Q+re+ot+E+`varying vec3 vN, vP; varying float vS, vH;
          void main(){ vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) N = -N;
            float g1 = fb(vP.xz * 0.35 + vP.y * 0.5), side = 1. - smoothstep(0.45, 0.75, abs(N.y)), topF = smoothstep(0.5, 0.85, N.y);
            float bed = sin(vH * 5.5 + vS * 20. + 1.2 * g1), low = 1. - smoothstep(0.0, 0.9, vH + 0.5);                    // vH: -0.5 at the foot of the slab, 1.6 at its top
            // ICE: a smooth frosted top, a pale blue-white broken edge thinly bedded; its foot stands in its own cool shadow
            vec3 frostC = cCream * (0.74 + 0.06 * g1), edgeC = mix(cCream, cCool * 1.9, 0.34) * (0.86 + 0.1 * smoothstep(-0.2, 0.6, bed));
            vec3 alb = mix(frostC, edgeC, side);
            float aoT = (0.62 + 0.38 * smoothstep(-0.6, 0.5, N.y)) * (1. - 0.42 * low * side), nlT = dot(N, uSun);
            float keyT = max(smoothstep(-0.1, 0.3, nlT), 0.6 * topF) * aoT;
            vec3 shT = mix(mix(cDeep, cCool, 0.5) * 0.7, mix(cCool * 1.55, cCream, 0.1), aoT) * (0.3 + 0.7 * dot(alb, vec3(0.333))) * (0.8 + 0.25 * N.y);
            vec3 c = mix(shT, alb * mix(vec3(1.03, 1., 0.95), uIceKey * 1.27, 0.85) * (0.88 + 0.16 * clamp(nlT, 0., 1.)), keyT);
            c += mix(cCool * 1.9, cCream, 0.6) * 0.22 * side * smoothstep(0.9, 1.5, vH) * (1. - keyT);                      // light through the thin top edge
            vec3 Vt = normalize(vP - uCamB + vec3(0., 1e-4, 0.)); float frT = 1. - clamp(dot(N, -Vt), 0., 1.); frT *= frT; frT *= frT;
            vec3 Rt = reflect(Vt, N); Rt = normalize(vec3(Rt.x, 0., Rt.z) + vec3(1e-4, 0.1, 0.)); c = mix(c, skyCol(Rt) * 0.95, (0.04 + 0.3 * frT) * (0.4 + 0.6 * topF));   // a wet sheen on the top
            c *= 1. - 0.3 * uRainDim;
            vec2 gq = floor(vP.xz * 2.3 + vP.y * 1.7); c += uKey * 1.5 * step(0.985, h21(gq + floor(uTime * 1.3 + vS * 9.))) * topF * (1. - smoothstep(0.1, 0.4, length(fract(vP.xz * 2.3 + vP.y * 1.7) - 0.5)));
            gl_FragColor = vec4(c, 1.);
            #include <fog_fragment>
            vec3 dv = vP - uCamB; float dl = max(length(dv), 1e-3); dv /= dl; vec3 dw = vec3(-dv.x, max(dv.y, 0.), dv.z);   // from inside the rain it is lost with its headland
            gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(fogColor * 0.9, skyCol(dw / max(length(dw), 1e-4)), 0.8), 0.96 * uVeil * smoothstep(40., 220., dl));
          }`});{const c=[0,0,0],y=10;for(let N=0;N<y;N++){const P=N/y*6.2832,k=(N+1)/y*6.2832;c.length=N*9,c.push(0,0,0,Math.cos(k)*1.75,0,Math.sin(k)*1.75,Math.cos(P)*1.75,0,Math.sin(P)*1.75)}const g=new o.BufferGeometry;g.setAttribute("position",new o.Float32BufferAttribute(c,3)),ze.push(g);const z=new o.InstancedBufferGeometry;z.setAttribute("position",g.attributes.position),z.setAttribute("aPos",n.attributes.aPos),z.setAttribute("aRot",n.attributes.aRot),z.instanceCount=u,z.boundingSphere=he;const w=new o.ShaderMaterial({uniforms:q(),fog:!0,side:o.DoubleSide,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8,vertexShader:L+`attribute vec4 aPos, aRot; varying vec2 vQ;
            void main(){ vec3 p = position; float ct = cos(aRot.y), st = sin(aRot.y); vQ = position.xz / 1.75;
              p.yz = vec2(p.y * ct + p.z * st, p.z * ct - p.y * st); vec3 w = aPos.xyz + p * aPos.w + vec3(0., 0.09 * aPos.w + 0.12, 0.);
              vec4 mvPosition = modelViewMatrix * vec4(w, 1.); gl_Position = projectionMatrix * mvPosition;
              #include <fog_vertex>
            }`,fragmentShader:`uniform float uVeil;
`+Q+E+`varying vec2 vQ;
            void main(){ float r = length(vQ), a = (1. - smoothstep(0.42, 1., r)); a *= a;
              gl_FragColor = vec4(mix(cDeep, cCool, 0.55) * 0.42, 0.74 * a * (1. - uVeil));
              #include <fog_fragment>
            }`}),C=new o.Mesh(z,w);C.name="talus-shadows",C.frustumCulled=!1,C.renderOrder=.2,W.add(C),ye.push(C)}const b=new o.Mesh(n,x);b.name="talus",b.frustumCulled=!1,W.add(b),ye.push(b),ze.push(d)}await S.yield();{const e=Math.round(5400*de),t=new Float32Array(e*3),r=new Float32Array(e),a=le.fork("dust");for(let f=0;f<e;f++){const l=a(),p=f%2?.52+.48*l:l,s=400+150*p;t[f*3]=22+(s-412)*.444+a.gauss()*(f%3===0?46*(1-.6*p):16+20*(1-p)),t[f*3+1]=a(),t[f*3+2]=s,r[f]=a()}const i=new o.BufferGeometry;i.setAttribute("position",new o.BufferAttribute(t,3)),i.setAttribute("aS",new o.BufferAttribute(r,1)),i.boundingSphere=he;const v=q({uBufH2:{value:900}}),d=new o.ShaderMaterial({uniforms:v,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,vertexShader:`uniform float uTime, uBufH2, uRainDim, uVeil; attribute float aS; varying float vA;
          void main(){ vec3 p = position; float base = 24. + (p.z - 412.) * 0.444 - 30.;
            p.y = base + mod(p.y * 90. - uTime * (0.7 + 0.9 * aS), 90.); p.x += 1.5 * sin(uTime * 0.4 + aS * 40.) ; p.z += 1.2 * cos(uTime * 0.33 + aS * 31.);
            vec4 mv = modelViewMatrix * vec4(p, 1.); float d = max(-mv.z, 0.5);
            float px = (0.07 + 0.09 * aS) * projectionMatrix[1][1] * uBufH2 * 0.5 / d; gl_PointSize = clamp(px, 1.6, 7.);
            float tw = 0.5 + 0.5 * sin(uTime * (3. + 4. * aS) + aS * 77.); tw *= tw;
            vA = (0.3 + 0.7 * tw * tw) * min(px / 1.6, 1.) * smoothstep(1.5, 8., d) * (1. - smoothstep(170., 260., d)) * (1. - uVeil); gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform vec3 uKey; varying float vA; void main(){ vec2 q = gl_PointCoord * 2. - 1.; float r = dot(q, q); if (r > 1.) discard;
          gl_FragColor = vec4(uKey * 1.9 * vA * (1. - r), 1.); }`}),n=new o.Points(i,d);n.frustumCulled=!1,n.renderOrder=6,W.add(n);const m=new o.Vector2;ne.push(()=>{S.renderer.getDrawingBufferSize(m),v.uBufH2.value=m.y})}const B0=ae[2].clone().lerp(ae[0],te===1?.85:.72).multiplyScalar(te===1?.85:.98),V0=ae[4].clone().multiplyScalar(.95),t0=[{at:[50,22,215],from:0,to:.24,weight:.5},{at:()=>Et,from:.347,to:Be?.4:.415,weight:.62},{at:()=>e0,from:.392,to:.475,weight:.5},{at:()=>Ut,from:.43,to:.5,weight:Be?0:.22},{at:()=>Xt,from:.475,to:.575,weight:.3},{at:[-78,96,538],from:.5,to:.635,weight:.45},{at:[-150,124,505],from:.64,to:.735,weight:.5},{at:[-21,98,500],from:.74,to:.812,weight:.6},{at:()=>Gt,from:.84,to:.885,weight:.1}];return _e.poi&&t0.push(_e.poi,_e.poi2),{scene:me,path:ce,duration:45,pace:At,title:"The Sea of Slow Rain",camera:{fov:62,near:.3,far:4e3,lookAhead:22,sway:.5,bank:.6},pois:t0,portal:{shape:"circle",radius:8,color:ft[6],glow:1.1,tilt:!0,revealDistance:300},post:{exposure:[.8,.88,.76][te],bloom:{strength:.42,radius:.6,threshold:.96},grade:{saturation:1.04,contrast:1.05,tint:"#fff6ea",shadowTint:"#0c0a16",vignette:.3,grain:.02,aberration:0}},ride:"none",update(e,t,r,a){j.update(e,t,r),Se.uU.value=a,r.getWorldPosition(se),se.x=-se.x;{const i=S.through?0:a,v=1-Math.min(1,Math.max(0,(Math.hypot(se.x-R[0],se.z-R[2])-85)/85)),d=v*v*(3-2*v),n=1-M(.46,.52,i);we.uRainDim.value=Math.max(.85*Math.max(d,.86*(1-M(.2,.3,i)))*n,r0*M(.5,.56,i)),Se.uVeil.value=n*(.54+.46*M(.13,.27,i)),Se.uIn.value=M(.19,.27,i)*n;{const m=Se.uVeil.value<.998;for(let f=0;f<ye.length;f++)ye[f].visible=m}we.uShaft.value.z=.05+.27*(1-M(.3,.44,i))}me.fog.color.copy(B0).lerp(V0,we.uRainDim.value/.85*.8),me.fog.density=a0*(1-.4*M(.47,.56,S.through?0:a));for(let i=0;i<ne.length;i++)ne[i](e,t,r,a)},dispose(){j.dispose();for(const e of ze)e.dispose()}}}};export{L0 as default};
