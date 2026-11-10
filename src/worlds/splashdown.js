import*as o from"three";import{makePath as Gt,clamp as N,lerp as G,smoothstep as D}from"../kit/core.js";import{makeSky as Ut,makeCloudField as Ko,makeLightRig as Vt}from"../kit/sky.js";import*as Jo from"../kit/water.js";import*as Ae from"../kit/fauna.js";import*as $o from"../kit/fx.js";import{buildHero as _t}from"../parts/splashdown.js";const F=Math.PI/180,wa=Math.PI*2,g=(t=0,r=0,n=0)=>new o.Vector3(t,r,n),f=(t,r=1)=>{const n=new o.Color(t);return new o.Vector3(n.r*r,n.g*r,n.b*r)},U=(t,r)=>{if(r<=t[0][0])return t[0][1];for(let n=1;n<t.length;n++)if(r<=t[n][0]){const d=t[n-1],h=t[n],e=(r-d[0])/(h[0]-d[0]);return d[1]+(h[1]-d[1])*e*e*(3-2*e)}return t[t.length-1][1]},Q=(t,r,n,d,h)=>D(r,n,t)*(1-D(d,h,t)),jt=[[0,25],[7,25],[9,-32],[13.7,-32],[14.9,58],[19.5,58],[20.6,22],[22.6,22],[26.4,3]],Ht=[[7,0],[9,1],[13.7,1],[14.9,0],[26.5,0],[27,1]],Ot=[[19.5,0],[20.6,.55],[26.5,.55]],et=[[0,75],[7,50],[10,30],[13.5,11],[15,6],[16.2,2.6],[21,2],[26,1.3],[27.2,1.15]],It=[[0,0],[7,.05],[10,.34],[13.5,.52],[15,.6],[16.6,.72],[19,.9],[21,1]],Nt=[[0,.028],[7,.034],[10,.05],[13.5,.09],[16.2,.15],[21,.17]],Qt=[[0,1],[8.5,.85],[13,.15],[15,0]],Yt=[[13.9,0],[14.7,1],[25.5,1],[26.5,.6]],Zt=[[21.5,-430],[22.6,-270],[23.6,-120],[24.6,-40],[25.6,8],[27.3,0]],Xt=26.85,Kt={dawn:{preset:"dawn",sunEl:7,sky:{zenith:"#6578c8",mid:"#98a0dc",horizon:"#f6c2a4",scatterColor:"#ffc890",scatter:.75},key:"#FFD9A0",keyI:1.25,shine:["#4A4F9A",1.9],bounce:["#F2A0A8",.32],sun:["#ffc98e",1],disc:7,line:["#ff6a1f",1.9],gold:["#F6C27A",1.15],seam:["#bfeecb",.8],blue:["#4b6fe6",.8],slate:["#34416f",.6],rose:["#F2A0A8",.9],indigo:["#1B1F5C",1],powder:["#7C8FD0",1],sea:["#27406B",.55],hazeS:["#f6c6a0",.95],hazeA:["#b3a3dc",.85],cloudL:["#ffd0b0",1],cloudS:["#5a5fae",.62],shadow:"#232652",foam:["#ffe9d6",.85],deep:"#476a80",scatter:"#8aa0a8",sheen:["#F6B98A",.6],shAmt:.42,pal:["#05060D","#6B3FD0","#E8409A","#F2A0A8","#F6C27A","#27406B","#FF6A1F"],exposure:1,stars:0,fog:42e-5,veil:"#EDE6F5"},golden:{preset:"goldenHour",sunEl:9,sky:{zenith:"#6274b8",mid:"#ae98b4",horizon:"#f6b56a",scatterColor:"#ff8a30",scatter:.85},key:"#FFB060",keyI:1.35,shine:["#4a4a92",1.7],bounce:["#e88a58",.34],sun:["#ffa24e",1.1],disc:7,line:["#ff4a12",2],gold:["#ffb24a",1.25],seam:["#f0d890",.7],blue:["#3f5fd0",.75],slate:["#3a3a66",.6],rose:["#e8887a",.9],indigo:["#1a1c56",1],powder:["#5f78c8",1],sea:["#6a3a1e",.6],hazeS:["#f8ae62",1],hazeA:["#a08cc4",.8],cloudL:["#ffb878",1.05],cloudS:["#55508f",.6],shadow:"#2a2046",foam:["#ffd9b0",.85],deep:"#8a6238",scatter:"#d09a58",sheen:["#ff9440",.62],shAmt:.42,pal:["#05060D","#6B3FD0","#E8409A","#F2A0A8","#F6B060","#27406B","#FF4212"],exposure:1,stars:0,fog:42e-5,veil:"#F3DCC8"},noon:{preset:"day",sunEl:34,sky:{zenith:"#1f55c0",mid:"#5b93e0",horizon:"#bfe0f6",scatter:.25},key:"#fff4e0",keyI:1.45,shine:["#3f62c4",1.9],bounce:["#9fc8f0",.3],sun:["#fff1d6",1],disc:6,line:["#bfe6ff",1.6],gold:["#d8ecff",1.1],seam:["#a8d8ff",.9],blue:["#2f62e0",.85],slate:["#5d8fd6",.8],rose:["#bcd8f6",.9],indigo:["#15226e",1],powder:["#3f78d8",1],sea:["#0f3fa0",.6],hazeS:["#c8e2f8",.95],hazeA:["#a8c4ee",.9],cloudL:["#ffffff",.95],cloudS:["#6f8fc8",.7],shadow:"#081c50",foam:["#ffffff",.9],deep:"#0a3f9a",scatter:"#2fb8c8",sheen:["#dcebff",.34],shAmt:.55,pal:["#05060D","#6B3FD0","#E8409A","#F2A0A8","#F6C27A","#27406B","#FF6A1F"],exposure:.95,stars:0,fog:34e-5,veil:"#EEF3FA"},night:{preset:"night",sunEl:30,sky:{horizon:"#2c4678",mid:"#12224a"},key:"#c4d4ff",keyI:.95,shine:["#2a3a8a",1.5],bounce:["#3a4a90",.3],sun:["#cfdcff",.5],disc:3,line:["#5f7fe0",.55],gold:["#3f5fc0",.45],seam:["#4f7fd0",.4],blue:["#1c2f86",.5],slate:["#141e50",.5],rose:["#2c3a86",.5],indigo:["#0a0f38",1],powder:["#101a52",1],sea:["#0a1640",.7],hazeS:["#3a4f9a",.6],hazeA:["#1c2a66",.6],cloudL:["#9fb4ee",.6],cloudS:["#1e2a66",.6],shadow:"#0a0e30",foam:["#c8d4f6",.7],deep:"#4b5a78",scatter:"#8f9ab4",sheen:["#ccd4ee",.4],shAmt:.34,seaAmb:[.34,.32,.3],seaSun:["#e6e8f4",1.5],pal:["#05060D","#6B3FD0","#E8409A","#F2A0A8","#F6C27A","#27406B","#FF6A1F"],exposure:1.25,stars:.75,fog:36e-5,veil:"#8f9fd8"}},Jt={streets:{street:1,cell:1,cov:.47,heap:1.3,gap:.1,fill:0,clouds:1,shadow:.6},popcorn:{street:0,cell:1.2,cov:.4,heap:2,gap:.12,fill:0,clouds:.8,shadow:.63},strato:{street:.3,cell:.62,cov:.43,heap:1.5,gap:.04,fill:.45,clouds:1.3,shadow:.57}},ze=`
  uniform sampler2D uNoise;
  vec4 nz(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return texture2D(uNoise, (i + f + .5) / 256.); }
  vec4 nzl(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return textureLod(uNoise, (i + f + .5) / 256., 0.); }
`,$t=`
  varying vec3 vDir;
  void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = vec4(p.xy, p.w * .99995, p.w); }
`,ea=$o.GLSL_HASH+ze+`
  uniform float uAlt, uAir, uBand, uStars, uTime, uPix, uCov, uStreet, uCell, uShLen, uDisc, uSpin, uCir, uGap, uFill, uHeap;
  uniform vec2 uDrift, uWind, uSunAz;
  uniform vec3 uSun, uSunCol, uLine, uGold, uSeam, uBlue, uSlate, uRose, uIndigo, uPowder, uSea, uHazeS, uHazeA, uCloudL, uCloudS;
  varying vec3 vDir;
  const float R = 3200.;

  vec3 bandCol(float x, float ws){
    vec3 c = mix(uBlue, uSeam, (smoothstep(.7, .95, x) - smoothstep(.95, 1.25, x)) * mix(.75, .3, uAir));
    c = mix(c, uGold, 1. - smoothstep(.2, .9, x));
    c = mix(c, uLine, (1. - smoothstep(.02, .22, x)) * mix(1., .3, uAir));
    vec3 a = mix(uBlue * .75, uRose, 1. - smoothstep(.9, 1.9, x));
    a = mix(a, uSlate, 1. - smoothstep(.3, .75, x));
    return mix(a, c, ws);
  }
  vec3 skyCol(float delta, float ws, float up){
    float x = delta / uBand;
    vec3 zen = mix(mix(vec3(.003, .004, .01), uIndigo, smoothstep(0., .5, uAir)), uPowder, smoothstep(.45, 1., uAir));
    zen *= 1. - .35 * up * uAir;
    return mix(zen, bandCol(x, ws), 1. - smoothstep(1.2, 3.4, x));
  }
  // ---- the cumulus deck seen from height. A noise field (clumps, streets, mesoscale holes) says where cloud stands; inside it
  //      round heaps in jittered cells (two sizes, rims torn by noise) are the cumulus tops. Every lookup is at lod 0 and each
  //      term fades to its mean as its cells shrink toward a pixel (foot = kilometres under one pixel), so nothing speckles.
  float fadeF(float x){ return 1. - smoothstep(.22, .65, x); }
  float fieldN(vec2 p, float foot){
    vec2 q = vec2(dot(p, uWind), dot(p, vec2(-uWind.y, uWind.x)));
    float big = nzl(p * .017 + 7.).g, meso = nzl(p * .075 + 3.).b;
    vec2 w = (nzl(q * .23 + 17.).rg - .5) * 2.4, qa = (q + w) * uCell;      // warped, and two turned lattices, so no cloud is a brick
    float n = (nzl(mat2(.87, .5, -.5, .87) * qa * vec2(.42, .6)).r + nzl(mat2(.87, -.5, .5, .87) * qa * vec2(.47, .66) + 7.3).a) * .5;
    n = mix(.5, n, fadeF(foot * .6 * uCell));
    float rows = nzl(vec2(q.x * .045, q.y * .46)).a;
    float st = mix(.5 + .5 * cos(q.y * 2.618 + (nzl(q * .09).a - .5) * 7.), smoothstep(.3, .7, rows), .55);
    n *= mix(1., .45 + .95 * mix(.55, st, fadeF(foot * .45)), uStreet);
    return n + (big - .5) * .42 + (meso - .5) * .2;
  }
  vec4 cellHash(vec2 c){ return textureLod(uNoise, (c + .5) / 256., 0.); }
  // x: height, 1 at the crown, 0 at the rim; yz: where we are in the heap (rim = length 1)
  vec3 heap(vec2 b, vec2 o, vec2 f){
    vec4 r = cellHash(b + o);
    vec2 e = (f - o - .5 - (r.xy - .5) * .5) / (.5 * (.55 + .45 * r.z));
    return vec3(mix(-1., 1. - dot(e, e), step(uGap, r.w)), e);
  }
  vec3 best(vec3 a, vec3 b){ return a.x > b.x ? a : b; }
  vec3 heaps(vec2 g){
    vec2 b = floor(g - .5), f = g - b;
    return best(best(heap(b, vec2(0.), f), heap(b, vec2(1., 0.), f)), best(heap(b, vec2(0., 1.), f), heap(b, vec2(1.), f)));
  }
  // returns (cover, lit flank about -1..1)
  vec2 cover(vec2 p, float foot){
    float M = smoothstep(uCov - .15, uCov + .2, fieldN(p, foot)), fc = foot * uHeap;
    vec2 q = vec2(dot(p, uWind), dot(p, vec2(-uWind.y, uWind.x)));
    float k2 = fadeF(foot * 2.6), k3 = fadeF(foot * 7.), k4 = fadeF(foot * 21.);
    vec2 wv = nzl(q * .9 + 13.).gb - .5;
    float wob = wv.x * .5 + (nzl(mat2(.6, .8, -.8, .6) * q * 2.6 + 31.).b - .5) * .32 * k2 + (nzl(mat2(.8, -.6, .6, .8) * q * 7. + 9.).a - .5) * .16 * k3;
    vec4 fn = nzl(mat2(.6, -.8, .8, .6) * q * 21. + 3.);
    float soft = 1. - smoothstep(1.25, 1.62, uAlt);      // sinking onto the tops: heaps melt into rounded swells of mist, no rims
    float lump = ((fn.r - .5) * .6 + (nzl(q * 57. + fn.gb * 2.).g - .5) * .4 * fadeF(foot * 57.)) * k4 * (1. - soft);      // seen from close above: cauliflower, not dunes
    wob += lump * .3;
    vec2 g = (q + wv.yx * .7) * uHeap;
    vec3 h = heaps(g), h2 = heaps(g * 2.3 + 31.7); h2.x = mix(h2.x * .8 - .1, -1., soft); h = best(h, h2);
    float v = max(h.x, -.25) * (.35 + .4 * M) + wob + (M - .62) * 1.1 + uFill * M * .5;      // a clump's core is solid, its rim breaks into heaps
    float w = clamp(fc * .7, 0., .3) + mix(.17, .2, smoothstep(.01, .08, fc)) + .3 * soft, far = smoothstep(.22, .6, fc);
    vec2 sQ = vec2(dot(uSunAz, uWind), dot(uSunAz, vec2(-uWind.y, uWind.x))), e = h.yz / max(1., length(h.yz));
    return vec2(mix(smoothstep(.35 - w, .35 + w, v), smoothstep(.45, 1., M) * .8 + .2 * uFill * M, far), (dot(e, sQ) * .55 * (1. - .6 * soft) + wob * 1.1 + lump * .8) * (1. - far));
  }
  float coverLo(vec2 p, float foot){ return smoothstep(uCov - .05, uCov + .25, fieldN(p, foot)); }
  float starField(vec3 d){
    float c = cos(uSpin), s = sin(uSpin); d = vec3(d.x * c - d.y * s, d.x * s + d.y * c, d.z);
    vec3 p = d * 42., i = floor(p), f = fract(p) - .5, h = hash33(i);
    float rad = max(.07, uPix * 55.);
    float r = length(f - (h - .5) * .56);
    return step(.83, h.z) * (1. - smoothstep(rad * .55, rad, r)) * (.5 + 2.2 * h.y * h.y);
  }
  void main(){
    vec3 d = normalize(vDir);
    float h = uAlt, Rh = R + h, b = Rh * d.y, c = 2. * R * h + h * h, disc = b * b - c;
    float sinDip = sqrt(c) / Rh;
    float delta = asin(clamp(d.y, -1., 1.)) + asin(clamp(sinDip, 0., 1.));
    float cosAz = dot(normalize(d.xz + vec2(1e-5, 0.)), uSunAz), ws = smoothstep(-.15, .9, cosAz);
    float sd = max(dot(d, uSun), 0.);
    vec3 col;
    if (disc > 0. && b < 0.) {
      float t = -b - sqrt(disc);
      vec3 P = vec3(0., Rh, 0.) + d * t, n = P / R;
      float mu = max(dot(-d, n), 0.);
      vec2 ps = P.xz + uDrift;
      // cloud layer, tops 0.9 km over the sea
      float c2 = (h - .9) * (2. * R + h + .9), t2 = -b - sqrt(max(b * b - c2, 0.));
      vec2 pc = (vec3(0., Rh, 0.) + d * t2).xz + uDrift;
      float foot = t2 * uPix * mix(1., 1. / max(mu, .06), .8);
      vec2 cvf = cover(pc, foot); float cv = cvf.x, flank = cvf.y;
      float sh = max(coverLo(ps + uSunAz * uShLen * .2, foot), max(coverLo(ps + uSunAz * uShLen * .55, foot) * .85, coverLo(ps + uSunAz * uShLen, foot) * .6));
      // the sea: deep body, the dawn band mirrored by a rough surface, the glitter road, wind streaks
      vec3 r = reflect(d, n);
      float fr = mix(.1, 1., pow(max(1. - mu, 0.), 3.));
      vec3 refl = skyCol(asin(clamp(dot(r, n), 0., 1.)) * .5, ws, 0.);
      vec2 q = vec2(dot(ps, uWind), dot(ps, vec2(-uWind.y, uWind.x)));
      float streak = (nzl(vec2(q.x * .7, q.y * 8.)).b - .5) * (1. - smoothstep(.2, .6, foot * 8.)), swell = (nzl(ps * 5.3 + uTime * .05).r - .5) * (1. - smoothstep(.2, .6, foot * 5.3));
      vec3 sea = uSea * mix(.55, 1., ws) * (1. + (streak * .5 + swell * .35) * uAir) + refl * fr * .9;
      float sr = max(dot(r, uSun), 0.), g = pow(sr, 70.) * 2.4 + pow(sr, 9.) * .5;
      float sp = mix(1., nzl(ps * 17. + uTime * vec2(.5, .2)).r * nzl(ps * 29. - uTime * vec2(.2, .45)).g * 4., 1. - smoothstep(.15, .5, foot * 17.));
      g *= mix(1., sp, .75 * uAir * smoothstep(1.2, 1.7, h));
      sea = mix(sea, sea * .3 + uSlate * .05, sh * .9) + uSunCol * g * (1. - sh);
      vec3 cl = mix(uCloudS, uCloudL, clamp(.42 + flank * .9 + (ws - .5) * .3, 0., 1.)) * (.8 + .32 * cv);
      vec3 surf = mix(sea, cl, cv * .96);
      float tau = .013 * min(t, min(h, 9.) / max(mu, .02)) * (1. + 1.3 * (1. - smoothstep(.05, .4, mu))), hz = 1. - exp(-tau);   // haze takes the deck before the limb
      vec3 haze = mix(mix(uHazeA, uHazeS, ws), skyCol(0., ws, 0.), smoothstep(.55, 1., hz));
      hz = max(hz, .57 * (1. - smoothstep(.3, .7, h - .9)));      // sinking toward the cloud tops: their mist takes the deck
      col = mix(surf, haze, hz);
    } else {
      col = skyCol(max(delta, 0.), ws, max(d.y, 0.));
      col += starField(d) * uStars * vec3(.9, .95, 1.1) * smoothstep(.9, 3.2, delta / uBand);
      if (uCir > .001 && d.y > .01) {
        vec2 cp = d.xz * (max(11. - h, 1.5) / (d.y + .07)) + uDrift * .15, cq = vec2(dot(cp, uWind), dot(cp, vec2(-uWind.y, uWind.x))) + vec2(uTime * .22, 0.);
        float ci = nz(vec2(cq.x * .06, cq.y * .22)).r * .55 + nz(vec2(cq.x * .19, cq.y * .6) + 5.).g * .3 + nz(cq * 1.3).b * .15;
        ci = smoothstep(.5, .86, ci * (.55 + .9 * nz(cq * .05 + 9.).b)) * smoothstep(.02, .2, d.y) * uCir;
        col = mix(col, mix(uCloudS * 1.25, uCloudL * 1.12, clamp(ws * 1.1 + ci * .25, 0., 1.)), ci * .4);
      }
    }
    col += uSunCol * (pow(sd, 6.) * .22 * uAir + pow(sd, mix(1400., 160., uAir)) * mix(2.2, .9, uAir) + smoothstep(.99988, .99996, sd) * uDisc);
    gl_FragColor = vec4(col, 1.);
  }
`,ot=`
  uniform float uDepth; varying vec2 vUv;
  void main(){ vUv = position.xy; vec4 c = projectionMatrix * vec4(0., 0., -uDepth, 1.); gl_Position = vec4(position.xy, uDepth > 0. ? clamp(c.z / max(c.w, 1e-4), -1., .9999) : 0., 1.); }`,oa=ze+`
  uniform float uA, uTime, uStreak, uBias, uGain, uSpeed; uniform vec2 uLight; uniform vec3 uCol, uCol2, uDeep; varying vec2 vUv;
  vec4 sheet(vec4 acc, vec2 p, float k, float f, float n, float cov){
    float ph = (k + f) / 3., z = exp2(mix(1.5, -1.9, ph));
    vec2 q = p * z * mix(vec2(1.), vec2(.26, 2.4), uStreak) + mod((n - k) * vec2(17.31, 9.73), 256.);
    vec2 ql = q + uLight * .2;
    float d = nzl(q).r * .58 + nzl(q * 2.7 + 11.3).g * .3 + nzl(q * 6.3 + 4.7).b * .12;
    float d2 = nzl(ql).r * .58 + nzl(ql * 2.7 + 11.3).g * .3 + .085;
    float w = smoothstep(0., .22, ph) * (1. - smoothstep(.78, 1., ph));
    float th = mix(.8, mix(.1, .5, ph), cov);                        // the nearest sheet always keeps its rents
    float a = smoothstep(th, th + .17, d) * w * uGain;
    float lit = smoothstep(-.09, .12, d - d2), thin = smoothstep(th, th + .1, d) * (1. - smoothstep(th + .1, th + .36, d));
    vec3 c = mix(uCol2, uCol, lit) * (1. + .25 * thin * lit) * (.9 + .22 * dot(uLight, vUv));      // sun through a billow's thin edge; the key side of the frame
    c = mix(uDeep, c, .3 + .7 * ph);
    acc.rgb += (1. - acc.a) * a * c; acc.a += (1. - acc.a) * a;
    return acc;
  }
  void main(){
    vec2 p = vUv * vec2(1.78, 1.) + vec2(.2, .35);
    float tt = uTime * uSpeed, f = fract(tt), n = floor(tt);
    float cov = clamp(uA + uBias * vUv.y, 0., 1.);
    vec4 acc = sheet(vec4(0.), p, 2., f, n, cov);
    acc = sheet(acc, p, 1., f, n, cov);
    acc = sheet(acc, p, 0., f, n, cov);
    float fill = smoothstep(.86, 1., uA) * step(.99, uGain);
    vec3 deep = uDeep * (.7 + .4 * nzl(p * 1.1 + vec2(uTime * .3, -uTime * .5)).a + .3 * nzl(p * 3.3 + vec2(-uTime * .4, uTime * .9)).r) + uCol * .2 * max(dot(uLight, vUv) + .25, 0.);
    acc.rgb += (1. - acc.a) * fill * deep; acc.a += (1. - acc.a) * fill;
    gl_FragColor = acc;
  }
`,ta="varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",aa=ze+`
  uniform float uTime, uDye, uCanA, uWeed, uShAmt, uPix, uShCov;
  uniform vec2 uPortal, uSunAz, uWind, uCan[3], uRoad;
  uniform vec4 uShip, uBoat[4];
  uniform vec3 uHeli[2], uShadowCol, uFoamCol, uWeedCol, uDyeCol, uSheenCol, fogColor;
  uniform float fogDensity;
  varying vec3 vW;
  void over(inout vec4 acc, vec3 c, float a){ acc = acc * (1. - a) + vec4(c * a, a); }
  void main(){
    vec2 p = vW.xz; vec3 toCam = cameraPosition - vW; float dist = length(toCam);
    float px = dist * uPix / max(abs(toCam.y) / max(dist, 1e-3), .06);
    vec4 acc = vec4(0.);
    vec2 q = vec2(dot(p, uWind), dot(p, vec2(-uWind.y, uWind.x)));
    // noise used below (never fetched inside a loop)
    float nA = nz(vec2(q.x * .03 - uTime * .12, q.y * .22)).r, nB = nz(p * .31 + uTime * .05).g, nC = nz(p * .06 + uTime * .012).b;
    // ---- cloud shadows, long along the sun's azimuth: faint ones far off, and the one dark patch that lies over the portal
    vec2 H = uShip.zw, rs = p - uShip.xy;
    vec2 sq = vec2(dot(p, uSunAz), dot(p, vec2(-uSunAz.y, uSunAz.x)));
    float cs = smoothstep(uShCov, uShCov + .12, nz(sq * vec2(.0008, .0031) + vec2(uTime * .003, 2.)).r * .7 + nz(sq * vec2(.0027, .0098)).g * .3);
    cs *= smoothstep(170., 340., length(rs));
    vec2 pr = p - uPortal, pq = vec2(dot(pr, uSunAz) + 55., dot(pr, vec2(-uSunAz.y, uSunAz.x)));
    float own = 1. - smoothstep(.4, 1.05, length(pq / vec2(205., 82.)) + (nC - .5) * .25);
    // ---- the sheen: the sky's bright band mirrored by the far and sunward sea, in ruffled lanes, and the glitter road's glow
    vec2 hd = -toCam.xz / max(length(toCam.xz), 1e-3);
    float graze = clamp(1. - abs(toCam.y) / max(dist, 1e-3), 0., 1.), azR = dot(hd, uRoad), azS = max(dot(hd, uSunAz), azR);
    float qy = q.y + (nC - .5) * 14.;
    float rip = nz(vec2(q.x * .0034 - uTime * .012, qy * .07)).g * .55 + nz(vec2(q.x * .0083 + 5. + uTime * .016, qy * .19)).r * .45;
    float sheen = pow(graze, 2.2) * smoothstep(-.05, .95, azS) * (.3 + .9 * smoothstep(.28, .8, rip));
    float road = pow(max(azR, 0.), 22.) * pow(graze, .9) * (.45 + 1.1 * rip);
    float lit = (1. - .88 * own) * (1. - .45 * cs);
    acc = vec4(uSheenCol * (sheen * .85 + road * .5) * lit, min(sheen * .3, .3) * lit);
    // ---- windrows: lanes parallel to the wind, some weed (2-4 m), some foam (thin)
    float warp = (nz(vec2(q.x * .006, q.y * .013)).a - .5) * 2.4 + (nz(vec2(q.x * .021, q.y * .05)).r - .5) * .5;
    float lane = q.y / 27. + warp, id = floor(lane);
    vec4 hsh = texture2D(uNoise, (vec2(id, 3.) + .5) / 256.);
    float dl = abs(fract(lane) - .5) * 27.;
    float ptc = smoothstep(.47, .66, nz(vec2(q.x * .0024 + id * .13, q.y * .004)).g);
    float gaps = smoothstep(.25, .6, nz(vec2(q.x * .014 + id * 7.3, id * .37)).r) * ptc;
    float isWeed = step(.5, hsh.r);
    float w = mix(.35 + .6 * hsh.g, 1.4 + 1.8 * hsh.g, isWeed) * (.5 + 1.1 * nz(vec2(q.x * .05, id)).g);
    float band = (1. - smoothstep(max(w - px, 0.) * .4, w + px, dl)) * min(1., 1.6 * w / max(px, 1e-3)) * gaps * smoothstep(28., 80., length(p - uPortal));
    float clump = smoothstep(.42, .7, nz(vec2(q.x * .07, q.y * .5)).b + .1) * (.5 + .5 * smoothstep(.3, .6, nz(q * vec2(.5, 1.7)).r));
    over(acc, uWeedCol * (.5 + 1.0 * nB), band * isWeed * clump * .8 * uWeed);
    float foam = band * (1. - isWeed) * smoothstep(.35, .7, nA) * .2;
    // ---- the ship's wake and bow wave
    float al = dot(rs, H), ac = dot(rs, vec2(-H.y, H.x));
    float s1 = -(al + 68.), w1 = 10. + max(s1, 0.) * .1;
    foam += step(0., s1) * (1. - smoothstep(w1 * .55, w1, abs(ac))) * exp(-max(s1, 0.) / 105.) * (.3 + .7 * nB) * .8;
    float s2 = -(al - 66.), arm = abs(abs(ac) - (5. + max(s2, 0.) * .34));
    foam += step(0., s2) * (1. - smoothstep(1., 2.5 + s2 * .03 + px, arm)) * exp(-max(s2, 0.) / 60.) * (.4 + .6 * nA) * .8;
    foam += (1. - smoothstep(9., 16., length(vec2(ac, (al - 70.) * .55)))) * .6 * nB;
    // ---- four boats on arcs: turbulent trail and the two arms
    for (int i = 0; i < 4; i++) {
      vec4 B = uBoat[i]; float dir = sign(B.z), r = abs(B.z);
      vec2 rel = p - B.xy; float rr = length(rel), ang = atan(rel.y, rel.x + 1e-4);
      float s = mod((B.w - ang) * dir, 6.2831853) * r, wk = .9 + s * .075, dd = abs(rr - r);
      float trail = (1. - smoothstep(wk * .45, wk + px, dd)) * exp(-s / 75.);
      float arms = (1. - smoothstep(.5, 1.3 + px, abs(dd - wk * 1.7))) * exp(-s / 45.) * .7;
      foam += (trail * (.45 + .55 * nB) + arms) * step(s, r * 4.);
    }
    // ---- rotor wash: a ragged ring of flattened, streaked water
    for (int i = 0; i < 2; i++) {
      vec2 rel = p - uHeli[i].xy; float rr = length(rel); vec2 rd = rel / max(rr, 1e-3);      // (the direction, not its angle: no seam)
      float sn = nzl(rd * 4.6 + (rr * .16 - uTime * 1.6) * .71).r, sm = nzl(rd * 1.4 + vec2(9., uTime * .2)).g;
      float edge = 17. + (sm - .5) * 9.;
      foam += (smoothstep(edge - 9., edge, rr) - smoothstep(edge + 1., edge + 9., rr)) * smoothstep(.3, .75, sn) * uHeli[i].z * .55;
    }
    over(acc, uFoamCol, clamp(foam, 0., 1.) * .88);
    over(acc, uShadowCol, max(cs * .4, own) * uShAmt);
    // ---- our three canopies' shadows
    float can = 0.;
    for (int i = 0; i < 3; i++) can = max(can, 1. - smoothstep(12., 19., length(p - uCan[i])));
    over(acc, uShadowCol * .8, can * uCanA * .46);
    // ---- the dye: a fluorescein bloom that drifts downwind, its edge feathered by warped noise and combed by the swell
    vec2 sl = vec2(dot(pr, uWind), dot(pr, vec2(-uWind.y, uWind.x)));
    vec2 wp = vec2(nz(pr * .043 + vec2(4., uTime * .011)).r, nz(pr * .043 + vec2(31.7, -uTime * .009)).g) - .5;
    float cl = nz(pr * .1 + wp * 2.6 + 9.).b * .6 + nz(pr * .26 + wp * 3.4 + uTime * .02).r * .4;
    float R1 = 19. + 9. * uDye, dr = length(vec2((sl.x - 9. * uDye) * .56, sl.y)) + (cl - .5) * 13. + (nC - .5) * 7.;
    float bloom = 1. - smoothstep(0., R1 * 1.45, dr); bloom *= bloom;
    float comb = nz(vec2(q.x * .21 - uTime * .35, q.y * .05)).g;
    float slick = bloom * (.5 + .5 * smoothstep(.2, .8, cl + (nB - .5) * .3)) * mix(.62 + .76 * comb, 1., smoothstep(.2, .75, bloom));
    over(acc, mix(uDyeCol * .55, uDyeCol * vec3(1.25, 1.02, .8) + vec3(.1, .08, 0.), smoothstep(.15, .9, slick)), clamp(slick * .74, 0., .64));
    // ---- the foam ring: a ragged, broken band of thick foam marbled with open water, and lace feathering off both sides
    float rl = length(pr * vec2(1., 1.08)); vec2 rdv = pr / max(length(pr), 1e-3);
    float rn = nz(rdv * 2.6 + vec2(uTime * .25, 5.)).r, rn2 = nz(rdv * 7.7 + vec2(3., -uTime * .16)).g;
    float rc = 9.9 + (rn - .5) * 3.4 + (rn2 - .5) * 1.7 + .45 * sin(uTime * 1.3), bw = .55 + 2.1 * rn * rn + .7 * rn2;
    float dc = abs(rl - rc), core = 1. - smoothstep(bw * .3, bw + px, dc), fea = 1. - smoothstep(bw * .6, bw * 3.2 + 1.2 + px, dc);
    vec2 fp = pr + rdv * (uTime * .22);
    float aa = 1. - smoothstep(.25, .8, px * 2.4);
    float blob = nz(fp * 1.3 + uTime * .1).r * .6 + nz(fp * 3.7 - uTime * .07).g * .4;
    float vein = 1. - abs(nz(fp * 2.4 + 7. + (blob - .5) * 1.2).b * 2. - 1.), vein2 = 1. - abs(nz(fp * .9 + 21.).a * 2. - 1.);
    float thick = core * mix(.75, smoothstep(.36, .56, blob + core * .22) * (1. - .55 * smoothstep(.86, .97, vein)), aa);
    float lace = fea * (1. - core) * mix(.25, smoothstep(.74, .93, vein) * .85 + smoothstep(.8, .96, vein2) * .6, aa) * smoothstep(.3, .6, blob + fea * .25);
    float ringA = clamp(thick + lace, 0., 1.);
    over(acc, mix(uFoamCol, vec3(.96, .98, 1.), .45) * mix(.8, 1.04 + .34 * thick, aa), ringA * mix(.8, .96, aa));
    float ff = 1. - exp(-fogDensity * fogDensity * dist * dist);
    acc.rgb = mix(acc.rgb, fogColor * acc.a, ff);
    gl_FragColor = acc * (1. - smoothstep(1300., 1900., dist));
  }
`,sa=`
  attribute vec4 aSeed; uniform float uT, uAspect; varying vec2 vUv; varying float vA;
  void main(){
    float tau = max(uT - aSeed.y * .35, 0.), life = .55 + aSeed.z * .5, k = clamp(tau / life, 0., 1.);
    float y = -1.08 + (1.5 + aSeed.w * 1.4) * tau - 2.6 * tau * tau;
    float x = aSeed.x * 1.15 + (aSeed.w - .5) * .25 * tau;
    float s = (.07 + .13 * aSeed.z) * (.5 + 1.6 * k);
    vUv = position.xy; vA = step(1e-4, tau) * (1. - k) * (1. - k);
    gl_Position = vec4(x + position.x * s / uAspect, y + position.y * s, 0., 1.);
  }`,na=`
  uniform vec3 uCol; varying vec2 vUv; varying float vA;
  void main(){ float r = length(vUv), a = (1. - smoothstep(.25, 1., r)) * vA * .5; gl_FragColor = vec4(uCol * a, a); }`,ia=`
  attribute vec4 aSeed; uniform float uTime, uAspect, uA; varying vec2 vUv; varying vec3 vS; varying float vA;
  void main(){
    float life = fract(uTime * (.13 + .09 * aSeed.y) + aSeed.z * 7.), xh = (aSeed.x * 2. - 1.) * 1.6, xe = xh / 1.7;
    float y0 = -.75 - .33 * xe * xe;
    float x = xh + life * life * (.22 + .3 * aSeed.y) + .035 * sin(life * 7. + aSeed.z * 40.);
    float y = y0 + life * (.13 + .17 * aSeed.w);
    float sz = (.06 + .09 * aSeed.w) * (.55 + 1.7 * life);
    vUv = position.xy; vS = vec3(aSeed.z * 23., life, aSeed.w);
    vA = smoothstep(0., .18, life) * (1. - life) * (1. - life) * uA;
    gl_Position = vec4((x + position.x * sz * 1.5) / uAspect, y + position.y * sz, 0., 1.);
  }`,ra=ze+`
  uniform vec3 uCol, uCol2; varying vec2 vUv; varying vec3 vS; varying float vA;
  void main(){
    float r = length(vUv);
    vec2 q = vUv * vec2(1.5, 1.) + vec2(vS.x, vS.x * .37 - vS.y * 1.4);
    float n = nz(q * 1.7).r * .6 + nz(q * 4.3 + 3.).g * .4;
    float a = (1. - smoothstep(.1, 1., r)) * smoothstep(.34, .72, n + .3 * (1. - r)) * vA;
    gl_FragColor = vec4(mix(uCol, uCol2, smoothstep(-.6, .7, vUv.x + (n - .5))) * a, a);
  }`,la=`
  uniform float uTime; uniform vec3 fogColor; uniform float fogDensity; varying vec3 vL; varying float vD;
  void main(){
    float r = length(vL.xz), ang = atan(vL.z, vL.x + 1e-4);
    float bl = pow(abs(cos(ang * 2. + uTime * 23.)), 10.);
    float a = (.1 + .34 * bl) * (1. - smoothstep(.93, 1., r)) * smoothstep(.04, .1, r);
    vec3 c = mix(vec3(.05, .055, .07), fogColor, 1. - exp(-fogDensity * fogDensity * vD * vD));
    gl_FragColor = vec4(c * a, a);
  }`,ua="varying vec3 vL; varying float vD; void main(){ vL = position; vec4 mv = modelViewMatrix * vec4(position, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; }",ca=ze+`
  uniform float uA, uTime, uTan, uAspect; uniform mat3 uRot; uniform vec3 uSrc, uTo[2], uCol; varying vec2 vUv;
  float beam(vec3 d, vec3 to, float ph){
    vec3 b = normalize(to - uSrc), w0 = -uSrc;
    float c = dot(d, b), dd = dot(d, w0), e = dot(b, w0), den = max(1. - c * c, .02);
    float t = (c * e - dd) / den, s = (e - c * dd) / den;
    float r = max(s, 1.) * .0031, dist = length(w0 + t * d - s * b) / r;
    float dust = .6 + .8 * nzl(vec2(s * .012 - uTime * .35, ph + dist * 1.3)).r * nzl(vec2(s * .004 + uTime * .1, ph * 3.)).g * 2.;
    return step(0., t) * step(0., s) * (1. - smoothstep(.15, 1., dist)) * dust * min(1. / sqrt(den), 2.5) * (1. - smoothstep(3600., 5200., s));
  }
  void main(){
    vec3 d = normalize(uRot * vec3(vUv.x * uTan * uAspect, vUv.y * uTan, -1.));
    float a = (beam(d, uTo[0], 3.) + beam(d, uTo[1], 11.)) * uA;
    gl_FragColor = vec4(uCol * a, 1.);
  }`;function Ce(){const t=[],r=[],n={tri(d,h,e,v){t.push(d[0],d[1],d[2],h[0],h[1],h[2],e[0],e[1],e[2]);for(let b=0;b<3;b++)r.push(v[0],v[1],v[2])},quad(d,h,e,v,b){n.tri(d,h,e,b),n.tri(d,e,v,b)},box(d,h,e,v,b,a,p,w=1,y=1,l=0,C=null){const V=v/2,L=a/2,E=V*w,z=L*y,_=h+b,$=[[d-V,h,e-L],[d+V,h,e-L],[d+V,h,e+L],[d-V,h,e+L]],T=[[d-E,_,e-z+l],[d+E,_,e-z+l],[d+E,_,e+z+l],[d-E,_,e+z+l]];for(let m=0;m<4;m++){const P=(m+1)%4,ee=m%2?.86:1;n.quad($[m],T[m],T[P],$[P],[p[0]*ee,p[1]*ee,p[2]*ee])}return n.quad(T[0],T[3],T[2],T[1],C||[p[0]*1.1,p[1]*1.1,p[2]*1.1]),n},build(){const d=new o.BufferGeometry;return d.setAttribute("position",new o.Float32BufferAttribute(t,3)),d.setAttribute("color",new o.Float32BufferAttribute(r,3)),d.computeVertexNormals(),d}};return n}function da(t,r){const n=Ce(),d=t?[.62,.62,.6]:[.2,.225,.26],h=t?[.5,.12,.05]:[.05,.055,.065],e=t?[.2,.3,.26]:[.12,.13,.15],v=t?[.7,.7,.68]:[.25,.275,.31],b=[.02,.025,.035],a=[.62,.62,.58],p=[-75,-70,-40,0,30,50,63,71,75],w=[10.2,11,11.5,11.5,10.8,8.6,5.4,2.4,.5],y=[9,9,9,9,9.6,10.6,11.6,12.4,13];for(let l=0;l<p.length-1;l++){for(const C of[-1,1]){const V=[C*w[l]*.86,-2,p[l]+(l===0?1:0)],L=[C*w[l+1]*.86,-2,p[l+1]-(l>5?2:0)],E=[C*w[l]*.93,1.6,p[l]],z=[C*w[l+1]*.93,1.6,p[l+1]],_=[C*w[l],y[l],p[l]],$=[C*w[l+1],y[l+1],p[l+1]],T=.9+.2*r();n.quad(V,L,z,E,h),n.quad(E,z,$,_,[d[0]*T,d[1]*T,d[2]*T])}n.quad([-w[l],y[l],p[l]],[w[l],y[l],p[l]],[w[l+1],y[l+1],p[l+1]],[-w[l+1],y[l+1],p[l+1]],e)}n.quad([-10.2,-2,-74],[10.2,-2,-74],[10.2,9,-75],[-10.2,9,-75],d),n.box(0,.6,-75.6,15,6.4,.6,b),n.box(0,9.02,-42,.7,.12,54,a),n.box(0,9.02,-30,15,.12,.7,a),n.box(0,9.02,-56,15,.12,.7,a);for(const l of[-1,1])n.box(l*9.6,9.02,-42,.5,.12,60,a);n.box(0,9,-4,19,8,14,v,.92,.9),n.box(0,9,18,21,8.5,34,v,.9,.94,0),n.box(0,17.5,21,16,5.5,24,v,.86,.9,-1),n.box(0,23,27,13,3.6,11,v,.9,.8,-1),n.box(0,24.2,32.3,11.5,1.1,.5,b),n.box(0,19.6,35.2,14,1,.5,b);for(const l of[-1,1])n.box(l*9.6,12.5,18,.4,1,26,b),n.box(l*11.2,9,6,2.2,3.2,9,t?[.7,.3,.1]:[.16,.17,.19]),n.box(l*7.5,9,44,3,2.6,5,v,.7,.7);for(let l=0;l<6;l++){const C=1-l*.12;n.box(0,26.6+l*2.6,26,5.2*C,2.6,5.2*C,l%2?b:v,.9,.9)}n.box(0,42.2,26,.5,5,.5,b),n.box(0,17,-1,3.6,12,3.6,v,.35,.35),n.box(0,29,-1,.4,5,.4,b),n.box(0,23,12,4.4,5,4.4,v,.5,.5),n.box(5,23,16,2.4,2.4,2.4,a,.4,.4),n.box(-5,23,16,2.4,2.4,2.4,a,.4,.4),t?(n.box(0,11.2,58,12,.5,12,[.25,.4,.34],1,1),n.box(0,11.72,58,6,.1,1,a),n.box(-2.6,11.72,58,1,.1,6,a),n.box(2.6,11.72,58,1,.1,6,a)):(n.box(0,10.8,56,4,2.2,5,v,.7,.7),n.box(0,12,59.5,.5,.5,5,b));for(let l=0;l<5;l++)n.box((r()-.5)*12,9,-68+l*3+r()*40,1.6+r()*2,1.2+r()*1.6,1.6+r()*3,v);return n.build()}const fa=()=>Ce().box(0,0,0,9,1.3,.7,[.3,.32,.36]).box(0,-1.4,0,.8,1.4,.8,[.05,.05,.06]).build();function pa(){const t=Ce(),r=[.2,.22,.25],n=[.03,.035,.045],d=[1,.16,.02];t.box(0,-1.7,1,3.2,1.6,9.5,r,1.12,1.02),t.box(0,-.1,1,3.6,2.2,9.7,r,.72,.86,-.4),t.box(0,-1.5,6.6,3,1.6,2.6,r,.8,.5,-.9),t.box(0,.1,5.9,2.9,1.3,1.2,n,.75,.6,-.5),t.box(0,2,.6,1.8,.9,5,r,.7,.8),t.box(0,2.6,.6,.5,.5,.5,n),t.box(0,.1,-7.6,1.3,1.5,8.4,r,.7,1),t.box(0,.05,-8.4,1.5,1.7,1.5,d,.72,1),t.box(0,.6,-12.2,.45,4.2,2,r,1,.55,-1.1),t.box(0,3.6,-13,.5,1,1.6,d,1,.8),t.box(0,1.4,-11.4,4.2,.25,1.2,r);for(const h of[-1,1])t.box(h*2,-1.9,.6,1,1,3.6,r,.8,.8),t.box(h*2,-2.5,.8,.5,.7,.9,n);return t.box(0,-2.4,5.4,.4,.7,.8,n),t.build()}function ha(){const t=Ce(),r=[.035,.04,.05],n=[.015,.017,.02],d=[.1,.11,.12];for(const h of[-1,1])t.box(h*1.35,.1,-.6,.95,.85,8.4,r,.8,1),t.box(h*.85,.2,4.4,.95,.85,2.2,r,.8,.8,.3);return t.box(0,.35,5.4,1.3,.8,1.2,r,.6,.6,.3),t.box(0,.05,-.4,2,.35,8.2,d),t.box(0,.4,-.2,1.1,1.5,1.3,n,.9,.7),t.box(0,1.9,-.2,1.3,.1,1.5,n),t.box(-.45,.4,-1.8,.5,1.5,.5,n,.8,.8),t.box(.45,.4,-1.8,.5,1.5,.5,n,.8,.8),t.box(0,.4,1.6,.5,1.3,.5,n,.8,.8),t.box(-.5,.2,-5.2,.6,1.3,.9,n),t.box(.5,.2,-5.2,.6,1.3,.9,n),t.build()}const ma=new o.Matrix4;function go(t){return{p:t.position.clone(),q:new o.Quaternion().setFromRotationMatrix(ma.lookAt(t.position,t.target,t.up))}}var ya={id:"splashdown",name:"Splashdown",category:"sky",weirdness:.1,media:["air","space"],async build(t){const{rng:r}=t,n=t.quality?.detail??1,d=t.vary||{},h=d.density??1,e=i=>({value:i}),v=r.pick(["dawn","golden","night","golden","noon","dawn","dawn"]),b={dawn:"dawn",day:"noon",golden:"golden",night:"night"}[d.hour]||v,a=Kt[b],p=b==="night",w=r.pick(["streets","strato","popcorn","streets"]),y=Jt[w],l=r.pick(["tile","tile","foil","gumdrop"]),C=r.pick(["blocks","onegore","quarters","blocks"]),V=r.chance(.4),L=r.pick(["albatross","albatross","frigate","dolphins"]),E=r.range(-.55,.55),z=new o.Vector2(Math.sin(E),Math.cos(E)),_=N(d.mood??.5,0,1),$=G(.75,1.3,_),T=G(.6,1.35,_),m=new o.Scene,P=147.6,ee=153.5,ue=[[0,P,0],[0,P,120],[0,P,240],[0,P,360],[0,P,440],[0,P,486]];for(let i=13;i<=65;i+=13)ue.push([0,P-ee*(1-Math.cos(i*F)),486+ee*Math.sin(i*F)]);const Me=ue[ue.length-1],ke=[0,-Math.sin(65*F),Math.cos(65*F)];ue.push([0,Me[1]+ke[1]*30,Me[2]+ke[2]*30],[0,Me[1]+ke[1]*60,Me[2]+ke[2]*60]);const Fe=Gt(ue),j=Fe.pointAt(1).clone(),O=new o.Vector2(j.x,j.z),Ze={rng:r,preset:a.preset,clouds:!1,clouds2:{opacity:.32,coverage:.5},...a.sky};p?Object.assign(Ze,{bodyOverrides:{0:{elevation:a.sunEl,azimuth:122,size:2.4}},bake:!0,renderer:t.renderer}):Object.assign(Ze,{sunElevation:a.sunEl,sunAzimuth:122});const M=Ut(Ze);m.add(M.object);const R=(M.keyDirection||M.sunDirection).clone().normalize(),wo=g(-R.x,R.y,-R.z),oe=new o.Vector2(R.x,R.z).normalize(),tt=new o.Vector2(-oe.x,-oe.y),Xe=new o.FogExp2(M.fogColor.clone(),0);m.fog=Xe;const yo=Vt(M,{bounce:.45,follow:!1});m.add(yo.object);const So=new o.Color(a.key).multiplyScalar(a.keyI),at=new o.Color(a.shine[0]).multiplyScalar(a.shine[1]),st=new o.Color(a.bounce[0]).multiplyScalar(a.bounce[1]);await t.yield();const x=await _t(t,{palette:a.pal,skin:l,pattern:C,lagThird:!!d.rare,lagAt:21.2,pod:!1,sunDir:R,gloss:p?.4:1});x.pod.visible=!1,x.object.matrixAutoUpdate=!1,m.add(x.object),x.setSun(R,So),x.setAmbient(at,st);const Ke=x.anchors.mounts,te=go(Ke.along),nt=go(Ke.image),Ao=go(Ke.outward),it=x.object.children.filter(i=>i.material&&i.material.uniforms&&(i.material.uniforms.uStage||i.material.uniforms.uOpen));await t.yield();const Je=new Uint8Array(256*256*4),rt=r.fork("noise");for(let i=0;i<Je.length;i++)Je[i]=rt()*256|0;const Y=new o.DataTexture(Je,256,256,o.RGBAFormat);Y.wrapS=Y.wrapT=o.RepeatWrapping,Y.magFilter=o.LinearFilter,Y.minFilter=o.LinearMipmapLinearFilter,Y.generateMipmaps=!0,Y.needsUpdate=!0;const ce=e(Y);await t.yield();const lt=Math.min(2.6,.9/Math.max(.12,Math.tan(a.sunEl*F))),B={uNoise:ce,uAlt:e(75),uAir:e(0),uBand:e(.03),uStars:e(1),uTime:e(0),uPix:e(.003),uSpin:e(0),uCov:e(y.cov),uStreet:e(y.street),uCell:e(y.cell),uGap:e(y.gap),uFill:e(y.fill),uHeap:e(1/y.heap),uShLen:e(lt),uDisc:e(a.disc),uCir:e(0),uDrift:e(new o.Vector2),uWind:e(z.clone()),uSunAz:e(tt),uSun:e(wo.clone()),uSunCol:e(f(a.sun[0],a.sun[1])),uLine:e(f(...a.line)),uGold:e(f(...a.gold)),uSeam:e(f(...a.seam)),uBlue:e(f(...a.blue)),uSlate:e(f(...a.slate)),uRose:e(f(...a.rose)),uIndigo:e(f(...a.indigo)),uPowder:e(f(...a.powder)),uSea:e(f(...a.sea)),uHazeS:e(f(...a.hazeS)),uHazeA:e(f(...a.hazeA)),uCloudL:e(f(...a.cloudL)),uCloudS:e(f(...a.cloudS))},Z=new o.Mesh(new o.BoxGeometry(2,2,2),new o.ShaderMaterial({uniforms:B,vertexShader:$t,fragmentShader:ea,side:o.BackSide,depthTest:!1,depthWrite:!1}));Z.scale.setScalar(3e3),Z.frustumCulled=!1,Z.renderOrder=-10,m.add(Z);const ut=f(a.veil,.55).add(f(a.cloudL[0],a.cloudL[1]*.42)),ct=f(a.veil,.3).add(f(a.cloudS[0],a.cloudS[1]*.5)),dt=f(a.veil,.19).add(f(a.cloudS[0],a.cloudS[1]*.3)),zo=(i,s,c)=>({uNoise:ce,uA:e(0),uTime:e(0),uStreak:e(1),uBias:e(0),uGain:e(s),uSpeed:e(c),uDepth:e(i),uLight:e(new o.Vector2(-.82,.57)),uCol:e(ut),uCol2:e(ct),uDeep:e(dt)}),X=zo(9,1,1.5),de=zo(0,.5,2.3),Co=(i,s,c)=>{const k=new o.Mesh(new o.PlaneGeometry(2,2),new o.ShaderMaterial({uniforms:i,vertexShader:ot,fragmentShader:oa,transparent:!0,premultipliedAlpha:!0,depthTest:s,depthWrite:!1}));return k.frustumCulled=!1,k.renderOrder=c,m.add(k),k},ft=Co(X,!0,60),pt=Co(de,!1,61),H={uNoise:ce,uA:e(0),uTime:e(0),uTan:e(.767),uAspect:e(1.78),uDepth:e(9),uRot:e(new o.Matrix3),uSrc:e(g(-1150,-1900,-1250)),uTo:e([g(-24,60,-44),g(27,66,-36)]),uCol:e(f("#cfe0ff",.2))},K=p?new o.Mesh(new o.PlaneGeometry(2,2),new o.ShaderMaterial({uniforms:H,vertexShader:ot,fragmentShader:ca,transparent:!0,blending:o.AdditiveBlending,depthTest:!0,depthWrite:!1})):null;K&&(K.frustumCulled=!1,K.renderOrder=58,K.visible=!1,m.add(K));const Te=new Float32Array(402),ht=i=>Math.exp(U(et.map(([s,c])=>[s,Math.log(c)]),i));for(let i=1;i<402;i++)Te[i]=Te[i-1]+ht(i*.1)*.035*.1;const mt=et.map(([i,s])=>[i,Math.log(s)]),fe=$o.makeParticles({rng:r.fork("ice"),preset:"dust",count:Math.round(520*n),box:[10,7,12],size:[.018,.05],colors:["#ffffff","#cfe0ff","#ffe2cc"],intensity:2.1,fog:!1,velocity:[.25,.12,17.7],velocityRandom:[.25,.15,.3]});fe.setOpacity(0),m.add(fe.object);const vt=Jo.waterLight(M),qe={rng:r,light:vt,preset:"breeze",height:1,foam:.3,windAngle:Math.atan2(z.x,z.y),deep:a.deep,scatter:a.scatter,radius:3600,sunDir:R.clone()};a.seaAmb&&(qe.ambient=new o.Color().setRGB(a.seaAmb[0],a.seaAmb[1],a.seaAmb[2])),a.seaSun&&(qe.sunColor=a.seaSun[0],qe.sunIntensity=a.seaSun[1]);const ae=Jo.makeOcean(qe),xt=ae.light.sunDir,bt=Math.max(R.y,.2),De=oe.clone();ae.light.scatDir.copy(R),m.add(ae.object),await t.yield();const Mo=()=>({fogColor:e(new o.Color),fogDensity:e(0),fogNear:e(1),fogFar:e(2e3)}),Re=new o.Vector2(195,830),I=new o.Vector2(.967,-.254).normalize(),W={...Mo(),uNoise:ce,uTime:e(0),uDye:e(0),uCanA:e(0),uWeed:e(N(.75*h,.4,1)),uShAmt:e(a.shAmt),uSheenCol:e(f(...a.sheen)),uRoad:e(oe.clone()),uPix:e(.003),uShCov:e(y.shadow),uPortal:e(O.clone()),uSunAz:e(oe.clone()),uWind:e(z.clone()),uCan:e([new o.Vector2,new o.Vector2,new o.Vector2]),uShip:e(new o.Vector4(Re.x,Re.y,I.x,I.y)),uBoat:e([0,1,2,3].map(()=>new o.Vector4(0,0,100,0))),uHeli:e([g(0,0,0),g(0,0,0)]),uShadowCol:e(f(a.shadow,1)),uFoamCol:e(f(...a.foam)),uWeedCol:e(f("#b48c38",p?.18:.42).multiply(f(a.key,1).addScalar(.25))),uDyeCol:e(f("#7CFF4F",p?.75:1))},Be=new o.Mesh(new o.PlaneGeometry(3400,3400).rotateX(-Math.PI/2),new o.ShaderMaterial({uniforms:W,vertexShader:ta,fragmentShader:aa,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,fog:!0}));Be.position.set(0,2,650),Be.renderOrder=2,m.add(Be);const pe=new o.MeshStandardMaterial({vertexColors:!0,roughness:.72,metalness:.12,side:o.DoubleSide});p&&pe.color.setRGB(.8,.62,.42);const se=new o.Group,gt=new o.Mesh(da(V,r.fork("ship")),pe),$e=new o.Mesh(fa(),pe);$e.position.set(0,45.6,26);const he=Ce(),eo=new o.Color("#ffa63a").multiplyScalar(p?3.4:2.3),oo=new o.Color("#ffe2b0").multiplyScalar(p?5:2.6),to=[oo.r,oo.g,oo.b];he.box(0,1.1,-76,13.4,5.2,.2,[eo.r,eo.g,eo.b]),he.box(0,47.3,26,.7,.7,.7,to),he.box(0,34.1,-1,.6,.6,.6,to);for(const i of[-1,1])for(const s of[-66,-20,34])he.box(i*9.9,10.2,s,.5,.5,.5,to);const wt=new o.Mesh(he.build(),new o.MeshBasicMaterial({vertexColors:!0,side:o.DoubleSide}));se.add(gt,$e,wt),se.rotation.y=Math.atan2(I.x,I.y),m.add(se);const yt=pa(),St=new o.CircleGeometry(1,28).rotateX(-Math.PI/2),ko={...Mo(),uTime:e(0)},At=new o.ShaderMaterial({uniforms:ko,vertexShader:ua,fragmentShader:la,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:o.DoubleSide,fog:!0}),ne=[0,1].map(()=>{const i=new o.Group,s=new o.Mesh(St,At);return s.position.y=3,s.scale.setScalar(8.6),s.renderOrder=4,i.add(new o.Mesh(yt,pe),s),m.add(i),i}),me=new o.InstancedMesh(ha(),pe,4);me.frustumCulled=!1,m.add(me);const zt=[18,162,-34,205].map((i,s)=>{const c=i*F+r.range(-.12,.12),k=new o.Vector2(O.x+Math.cos(c)*124,O.y+Math.sin(c)*124),u=O.clone().sub(k).normalize(),le=s%2?1:-1,q=r.range(140,200),po=new o.Vector2(-u.y,u.x).multiplyScalar(le),we=k.clone().addScaledVector(po,q);return{c:we,r:q,dir:le,end:Math.atan2(k.y-we.y,k.x-we.x),speed:r.range(12,15)}});await t.yield();const We=r.fork("clouds"),ao=[[0,170,552,125]],Fo=Math.round((w==="popcorn"?6:8)*N(h,.8,1.2));for(let i=0;i<Fo;i++){const s=We.range(105,w==="strato"?230:180),c=i%2?1:-1;ao.push([c*(s*.5+We.range(24,95)),172+We.range(0,55),350+i/Fo*330+We.range(-20,20),s])}ao.push([-74,150,492,84],[80,172,452,72],[-92,196,566,96]);const ie=Ko({rng:r,sky:M,at:ao,puffs:Math.round(44*(.6+.4*n)),wind:[.8,0,.4],nearFade:[.14,.55],opacity:1});m.add(ie.object),await t.yield();const so=Ko({rng:r,sky:M,noiseTexture:ie.noiseTexture,count:Math.round(13*y.clouds*N(h,.8,1.25)),center:[0,0,1e3],extent:[4400,4400],altitude:235,altitudeJitter:50,size:w==="strato"?[260,460]:[170,330],puffs:Math.round(40*(.6+.4*n)),filter:(i,s,c)=>Math.hypot(i,c-560)>430});m.add(so.object),await t.yield();const Le=Ae.makeFauna(m,{light:Ae.lightFrom(m)}),Ct=L==="frigate"?{species:"swifts",count:3,size:3.4,body:"#1c1a20",belly:"#e9e4da",wingC:"#222028",trail:"#2a2830",tip:"#101014",head:"#16141a",flap:1.6,glide:.9}:{species:"gulls",count:2,size:3.2,body:"#f4f2ec",belly:"#ffffff",wingC:"#ecebe6",trail:"#33363c",tip:"#121418",head:"#f8f6f0",beak:"#f2b7a0",flap:1.1,glide:.92};await t.yield(),Le.add(Ae.makeFlock({rng:r.fork("escort"),...Ct,speed:17,spread:[3.4,.9,2.6],wander:[.7,.5,.7,.3],maxSigma:3,keepClear:{path:Fe,dist:2.3,step:2,from:.67},along:{path:Fe,side:3.5,up:-2.2,lead:6.5,from:.735,to:.835,drift:1.2}})),await t.yield(),Le.add(Ae.makeFlock({rng:r.fork("shear"),species:"swifts",count:Math.max(24,Math.round(60*h*n)),size:2.9,speed:12,center:[j.x,3.4,j.z+4],radius:92,height:.9,wobble:.1,spread:[16,1.3,60],wander:[3,.8,4,.5],maxSigma:3,body:"#4a4038",belly:"#efe9de",wingC:"#51463c",trail:"#3a322c",tip:"#221d1a",head:"#3a312b",glide:.7,flap:5})),L==="dolphins"&&Le.add(Ae.makeDolphins({rng:r.fork("dolphins"),count:7,center:[j.x-96,0,j.z+30],radius:46,level:0,light:"day"}));const To=46,qo=[],Do=[],Ro=[],Ee=r.fork("spray");for(let i=0;i<To;i++){const s=[i/(To-1)*2-1+Ee.range(-.03,.03),Ee(),Ee(),Ee()];for(const c of[[-1,-1],[1,-1],[1,1],[-1,1]])qo.push(c[0],c[1],0),Do.push(s[0],s[1],s[2],s[3]);Ro.push(i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3)}const Pe=new o.BufferGeometry;Pe.setAttribute("position",new o.Float32BufferAttribute(qo,3)),Pe.setAttribute("aSeed",new o.Float32BufferAttribute(Do,4)),Pe.setIndex(Ro);const no={uT:e(0),uAspect:e(1.78),uCol:e(f(a.foam[0],a.foam[1]*1.05))},Ge=new o.Mesh(Pe,new o.ShaderMaterial({uniforms:no,vertexShader:sa,fragmentShader:na,transparent:!0,premultipliedAlpha:!0,depthTest:!1,depthWrite:!1}));Ge.frustumCulled=!1,Ge.renderOrder=55,m.add(Ge);const Bo=Math.round(44*(.6+.4*n)),Wo=[],Lo=[],Eo=[],Ue=r.fork("steam");for(let i=0;i<Bo;i++){const s=[(i+Ue())/Bo,Ue(),Ue(),Ue()];for(const c of[[-1,-1],[1,-1],[1,1],[-1,1]])Wo.push(c[0],c[1],0),Lo.push(s[0],s[1],s[2],s[3]);Eo.push(i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3)}const Ve=new o.BufferGeometry;Ve.setAttribute("position",new o.Float32BufferAttribute(Wo,3)),Ve.setAttribute("aSeed",new o.Float32BufferAttribute(Lo,4)),Ve.setIndex(Eo);const ve={uNoise:ce,uTime:e(0),uAspect:e(1.78),uA:e(0),uCol:e(f(a.cloudL[0],p?.5:.85)),uCol2:e(f(a.veil,p?.3:.5).multiply(f(a.cloudS[0],1).addScalar(.4)))},xe=new o.Mesh(Ve,new o.ShaderMaterial({uniforms:ve,vertexShader:ia,fragmentShader:ra,transparent:!0,premultipliedAlpha:!0,depthTest:!1,depthWrite:!1}));xe.frustumCulled=!1,xe.renderOrder=54,xe.visible=!1,m.add(xe);const Mt=[M.object,ae.object,Be,se,ne[0],ne[1],me,so.object],J=new o.Mesh(new o.CircleGeometry(32,24),new o.MeshBasicMaterial({colorWrite:!1,fog:!1}));J.renderOrder=4,J.frustumCulled=!1,m.add(J);const be=new o.Quaternion,io=new o.Quaternion,_e=new o.Quaternion,ro=new o.Quaternion,ge=new o.Euler,je=g(),lo=g(1,1,1),kt=g(),va=g(),Po=g(),uo=g(),He=new o.Matrix4,Go=new o.Matrix4,Ft=new o.Vector2,Uo=new o.Quaternion,Vo=g(),Oe=g(),re=g(),co=g(),Ie=g(),_o=g(),jo=new o.Quaternion,Tt=new o.Matrix4,qt=M.fogColor.clone(),Dt=new o.Color(a.hazeS[0]).multiplyScalar(a.hazeS[1]).lerp(new o.Color(a.hazeA[0]).multiplyScalar(a.hazeA[1]),.45);let Ho=0,fo=-1;function Rt(i,s,c,k){const u=N(k||0,0,1)*40,le=!(k>0)&&c.near>.6,q=u>=Xt;Po.set(0,0,-1).applyQuaternion(c.quaternion);const po=Math.asin(N(Po.y,-1,1))/F,we=G(U(jt,u),po,D(25.6,26.7,u)),Bt=(6*Math.sin(u*.9+1)*Q(u,8.6,10,13,14.4)+10*Math.sin((u-22.6)*1.45)*Q(u,22.6,23.6,25.5,26.5))*$*F;x.setFlightTime(u,s);const ho=x.state,mo=((u<7?G(.3,.85,D(0,6.2,u))*(1-D(6.7,7,u)):0)+ho.jolt*1.4)*F;ge.set(mo*(.6*Math.sin(s*56.5)+.4*Math.sin(s*91.3+1)),mo*.8*(.6*Math.sin(s*49.7+2)+.4*Math.sin(s*77.1))+(ho.thruster[1]-ho.thruster[0])*.5*F,mo*.5*Math.sin(s*63.9+4)),io.setFromEuler(ge),_e.setFromEuler(ge.set(0,0,Bt)),be.copy(c.quaternion).multiply(io).multiply(_e),_e.setFromEuler(ge.set(-we*F,0,0)),be.multiply(_e),Z.position.copy(c.position),Z.quaternion.copy(be),Z.visible=!q;const Wt=Math.max(64,t.renderer.getDrawingBufferSize(Ft).y),Oo=2*Math.tan(c.fov*.5*F)/Wt;B.uAlt.value=Math.exp(U(mt,u)),B.uAir.value=U(It,u),B.uBand.value=U(Nt,u),B.uStars.value=Math.max(U(Qt,u),a.stars),B.uCir.value=U(Yt,u)*(u<13.9?0:T),B.uTime.value=s,B.uPix.value=Oo,B.uSpin.value=s*.006+u*.012;const Io=Math.min(400,u*10),vo=Math.floor(Io);Ho+=(fo<0?0:N(s-fo,0,2))*B.uAlt.value*.014,fo=s,B.uDrift.value.set(z.x*s*.004,-G(Te[vo],Te[vo+1],Io-vo)-Ho+z.y*s*.004);const No=U(Ht,u),Lt=U(Ot,u),ye=le?Math.max(0,c.near-.3)*1.25:0;if(ro.copy(te.q).slerp(nt.q,Lt).slerp(Ao.q,No),je.copy(te.p).lerp(Ao.p,No),ye>0&&(co.set(0,0,-1).applyQuaternion(te.q),Ie.set(0,1,0).applyQuaternion(te.q),_o.copy(te.p).addScaledVector(co,2.2).addScaledVector(Ie,-Math.min(1.3,ye*.3)),je.copy(te.p).addScaledVector(co,-.45*ye).addScaledVector(Ie,.89*ye),ro.setFromRotationMatrix(He.lookAt(je,_o,Ie))),x.uniforms.plasma.uTail.value=G(.07,.45,N(ye/25,0,1)),He.compose(je,ro,lo).invert(),Go.compose(kt,io,lo),x.object.matrix.copy(c.matrixWorld).multiply(Go).multiply(He),x.object.matrix.decompose(x.object.position,x.object.quaternion,x.object.scale),x.object.updateMatrixWorld(!0),q?uo.copy(R):uo.copy(wo).applyQuaternion(be),x.setSun(uo,So),x.setWet(D(26.6,27.2,u)),x.update(i,s,c),u<14.9||u>27.3)for(const S of it)S.visible=!1;const Qo=Q(u,13.2,13.55,13.8,14.35),xo=Q(u,26.3,26.74,26.94,27.4),Yo=Q(u,23.6,23.75,23.85,24.15)+Q(u,24.9,25.02,25.1,25.4);X.uA.value=Math.max(Qo*.62,xo),X.uStreak.value=u<20?1:0,X.uBias.value=u<20?G(-.42,.42,D(13.3,14.2,u)):0,X.uSpeed.value=u<20?1.1:1.5,X.uTime.value=s,ft.visible=X.uA.value>.002,de.uA.value=Math.max(Qo*.4,xo*.42,Yo*.62),de.uStreak.value=u<20?1:Yo>xo?.75:.2,de.uTime.value=s+40,pt.visible=de.uA.value>.002,K&&(H.uA.value=Q(u,16.4,18.2,23.2,25.2),K.visible=H.uA.value>.002,jo.copy(be).invert().multiply(c.quaternion),H.uRot.value.setFromMatrix4(Tt.makeRotationFromQuaternion(jo)),H.uTan.value=Math.tan(c.fov*.5*F),H.uAspect.value=c.aspect,H.uTime.value=s,H.uTo.value[0].set(-24+8*Math.sin(s*.31),60,-44+5*Math.cos(s*.23)),H.uTo.value[1].set(27+8*Math.sin(s*.27+2),66+4*Math.sin(s*.19),-36)),fe.setOpacity(Q(u,7.4,8.6,12.8,13.5)*.9),fe.update&&fe.update(i,s,c),ve.uA.value=.5*D(27.2,28.4,u)*(1-D(35.5,38.5,u)),ve.uTime.value=s,ve.uAspect.value=c.aspect,xe.visible=ve.uA.value>.002;for(const S of Mt)S.visible=q;ie.object.visible=u>22.5,ie.object.position.y=U(Zt,u),M.update(i,s,c),yo.update(i,s,null),ae.update(i,s,c),ie.object.visible&&ie.update(i,s,c),q&&so.update(i,s,c),Le.update(i,s,c,k,q);const Ne=Re.x+I.x*2*(u-27),Qe=Re.y+I.y*2*(u-27);se.position.set(Ne,.25*Math.sin(s*.45),Qe),se.rotation.z=.012*Math.sin(s*.37),$e.rotation.y=s*1.7;const Ye=2.4+s*.11;Oe.set(Ne+Math.cos(Ye)*150,72+3*Math.sin(s*.6),Qe+Math.sin(Ye)*150),ne[0].position.copy(Oe),ne[0].rotation.set(.08,Math.atan2(-Math.sin(Ye),Math.cos(Ye)),-.16,"YXZ"),re.set(-152+6*Math.sin(s*.21),44+2*Math.sin(s*.5),772+6*Math.cos(s*.17)),ne[1].position.copy(re),ne[1].rotation.set(.05,Math.atan2(O.x-re.x,O.y-re.z)+.12*Math.sin(s*.3),.03*Math.sin(s*.8),"YXZ"),ko.uTime.value=s,W.uHeli.value[0].set(Oe.x,Oe.z,.3),W.uHeli.value[1].set(re.x,re.z,1);for(let S=0;S<4;S++){const A=zt[S],Se=A.end-A.dir*A.speed*(40-u)/A.r,Zo=A.c.x+Math.cos(Se)*A.r,Xo=A.c.y+Math.sin(Se)*A.r;W.uBoat.value[S].set(A.c.x,A.c.y,A.r*A.dir,Se),Vo.set(Zo,(q?ae.heightAt(Zo,Xo,s):0)+.25,Xo),Uo.setFromEuler(ge.set(-.1-.03*Math.sin(s*3+S),Math.atan2(-Math.sin(Se)*A.dir,Math.cos(Se)*A.dir),.04*Math.sin(s*2.3+S*2),"YXZ")),me.setMatrixAt(S,He.compose(Vo,Uo,lo))}me.instanceMatrix.needsUpdate=!0,W.uTime.value=s,W.uPix.value=Oo,W.uDye.value=D(27,40,u),W.uCanA.value=D(27.3,28.2,u)*(p?.5:1),W.uShip.value.set(Ne,Qe,I.x,I.y),De.set(Ne-c.position.x,Qe-c.position.z).normalize().multiplyScalar(.8).addScaledVector(oe,.2).normalize(),W.uRoad.value.copy(De),xt.set(De.x,bt,De.y).normalize(),J.visible=!le&&!q,J.visible&&(J.position.copy(c.position).sub(j).normalize().multiplyScalar(26).add(j),J.lookAt(c.position));const bo=Math.max(c.position.y-4,0),Et=G(O.x,c.position.x,.35)-.78*bo*.5,Pt=G(O.y,c.position.z+bo*.4,.35)+.62*bo*.5;for(let S=0;S<3;S++){const A=.6+S*2.094+.05*Math.sin(s*.4+S);W.uCan.value[S].set(Et+Math.cos(A)*21,Pt+Math.sin(A)*21)}no.uT.value=u-39.15,no.uAspect.value=c.aspect,Ge.visible=u>39.15,Xe.color.copy(q?qt:Dt),Xe.density=le||u<14.6?0:q?a.fog:G(18e-5,5e-4,D(21,24,u))}return await M.prewarm(t.renderer,null,m),{scene:m,path:Fe,duration:40,camera:{fov:75,near:.12,far:16e3,sway:0,bank:0},pois:[{at:j,from:.6,to:1,weight:.5}],portal:{shape:"circle",radius:7,color:"#BFE9FF",glow:1,revealDistance:240,tilt:!0},post:{exposure:a.exposure,bloom:{strength:.42,radius:.6,threshold:.92},grade:{saturation:1.08,contrast:1.05,tint:"#ffffff",shadowTint:"#07071c",vignette:.3,grain:.02,aberration:0}},ride:"none",companion:"none",update:Rt,dispose(){M.dispose(),x.dispose()}}}};export{ya as default};
