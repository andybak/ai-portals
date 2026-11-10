import*as D from"three";import{makePath as Vs,clamp as P0,lerp as b0,smoothstep as q0,hashSeed as Dt}from"../kit/core.js";import{makeSky as Fs,makeCloudField as mn,makeLightRig as qs}from"../kit/sky.js";import{makeParticles as eo,makeSmokeColumn as Ds,makeGlow as gn,makeGodRays as Ls}from"../kit/fx.js";import{buildHero as Us}from"../parts/honey-cliff.js";const yn=[[-150,10,70,64],[-205,-50,40,58],[-120,62,112,50],[-220,40,104,62],[-178,-14,150,54],[-268,-8,62,50]],Re=["#D01F2B","#2E5C8A","#C08A4A","#F2A51E","#1E1712","#EADBA8","#DCE8F2"],s=(a,v,A)=>new D.Vector3(a,v,A),f0=a=>new D.Color(a),ie=Math.PI/180,E0=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounceCol, uHazeCol;
uniform float uTime;
uniform vec4 uAir;     // height-haze density, wind strength, wetness, drawing-buffer height
uniform vec4 uSea;     // the colour of the cloud sea, and how far whatever stands in it is lost in it (0 = no sea)
float h11(float n){ return fract(sin(n*12.9898)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f); float n = dot(i, vec3(1., 57., 113.));
  return mix(mix(mix(h11(n), h11(n + 1.), f.x), mix(h11(n + 57.), h11(n + 58.), f.x), f.y),
             mix(mix(h11(n + 113.), h11(n + 114.), f.x), mix(h11(n + 170.), h11(n + 171.), f.x), f.y), f.z); }
float fb2(vec2 p){ return 0.5*vn2(p) + 0.25*vn2(p*2.03 + 3.1) + 0.125*vn2(p*4.1 + 7.7) + 0.0625*vn2(p*8.3 + 1.3); }
vec3 sunLit(vec3 alb, vec3 N, vec3 V, float sh, float gloss, float spec){
  float ndl = max(dot(N, uSunDir), 0.);
  vec3 amb = mix(uBounceCol, uSkyCol, N.y*0.5 + 0.5);
  vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
  return alb*(uSunCol*ndl*sh + amb) + uSunCol*spec*pow(max(dot(N, H), 0.), gloss)*sh*step(0.001, ndl);
}
vec3 airHaze(vec3 c, vec3 wp){
  float hd = max(cameraPosition.y - wp.y, 0.), d = distance(cameraPosition, wp);
  c = mix(c, uHazeCol, (1. - exp(-hd*uAir.x))*smoothstep(100., 700., d));
  return mix(c, uSea.rgb, uSea.w*(1. - smoothstep(10., 115., wp.y)));
}
vec3 farHaze(vec3 c, vec3 wp){
  return mix(c, uHazeCol*0.94, 1. - exp(-max(distance(cameraPosition, wp) - 150., 0.)*uAir.x*1.1));
}
float spurHaze(vec3 wp){ return 1. - exp(-max(distance(cameraPosition, wp) - 120., 0.)*uAir.x*1.3); }   // the east spur and its scrub: one air over both
`,Te=`varying vec3 vWorld, vN;
#include <fog_pars_vertex>
`,We=`
  vWorld = wpos; vN = wn;
  vec4 mvPosition = viewMatrix*vec4(wpos, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
`,je=`varying vec3 vWorld, vN;
#include <fog_pars_fragment>
`,_e=`
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-4, 0.));
`,bn=`
attribute float aRiver; varying float vRiver;
${Te}
void main(){
  vRiver = aRiver;
  vec3 wpos = (modelMatrix*vec4(position, 1.)).xyz, wn = normal;
  ${We}
}`,wn=`
uniform vec3 uLeafA, uLeafB, uFleckCol, uRock; uniform vec3 uFleck;   // threshold, amount, cloud shadow
uniform float uSpur;                     // 1 on the east spur and its scrub: the aerial haze of the middle distance, the shaded flank filled from the sky
float cloudSh(vec2 q){ return 1. - uFleck.z*smoothstep(0.42, 0.62, fb2((q + vec2(uTime*16., uTime*6.))/1500.)); }
`,xn=`
${E0}
${wn}
varying float vRiver;
${je}
void main(){
  ${_e}
  vec2 q = vWorld.xz;
  float d = distance(cameraPosition, vWorld), lod = 1. - smoothstep(350., 1500., d);
  float big = fb2(q/560.), crown = vn2(q/150. + big*2.), leaf = vn2(q/41.), fine = vn2(q/9.);
  float cell = crown*0.6 + leaf*0.3 + (fine - 0.5)*0.3*lod;
  vec3 alb = mix(uLeafA, uLeafB, smoothstep(0.25, 0.75, cell))*(0.5 + 0.8*smoothstep(0.1, 0.8, crown));
  float fl = smoothstep(uFleck.x, uFleck.x + 0.1, vn2(q/26. + 9.)*0.5 + vn2(q/8.)*0.5)*smoothstep(0.3, 0.6, vn2(q/260. + 3.));
  alb = mix(alb, uFleckCol, fl*uFleck.y);
  float steep = 1. - smoothstep(0.3, 0.55, N.y);
  vec3 rock = uRock*(0.3 + 0.5*vn2(vec2(q.x/45., vWorld.y/16.)));
  alb = mix(alb, rock, steep*smoothstep(0.35, 0.6, vn2(q/230. + 4.)));
  float rw = abs(vRiver) + 30.*(vn2(q/170.) - 0.5);
  float water = 1. - smoothstep(48., 70., rw), bar = (1. - smoothstep(70., 140., rw))*(1. - water);
  alb = mix(alb, vec3(0.4, 0.38, 0.34), bar);
  alb *= 1. + 0.9*uSpur;
  vec3 c = sunLit(alb, N, V, cloudSh(q), 20., 0.02);
  float gl = vn2(vec2(q.x/34. + uTime*0.8, q.y/70.))*vn2(vec2(q.x/12. + uTime*2.1, q.y/26.));
  c = mix(c, uSkyCol*1.7 + uSunCol*smoothstep(0.3, 0.55, gl)*0.7, water);
  c += alb*(uSkyCol*1.5 + uSunCol*0.07)*uSpur;                                      // the spur's shaded flank: open sky and the lit cliff across the gorge
  c = mix(c, uHazeCol*0.94, spurHaze(vWorld)*uSpur);
  gl_FragColor = vec4(max(airHaze(c, vWorld), 0.), 1.);
  #include <fog_fragment>
}`,Rs=`
attribute float aL; varying float vL; varying vec3 vWorld, vN;
void main(){
  vL = aL; vWorld = position; vN = normal;
  gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.);
}`,Ts=`
${E0}
uniform vec3 uRangeHaze; uniform vec4 uRange;          // haze at the foot, haze at the summits (nearest ridge), added per ridge, snow line
varying float vL; varying vec3 vWorld, vN;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 P = vWorld;
  // break the smooth faces up: couloirs, ribs and cornices, finer than the mesh
  vec3 q = P*vec3(0.0021, 0.0034, 0.0021);
  vec3 dn = vec3(vn3(q + 3.), vn3(q*1.3 + 17.), vn3(q + 31.)) - 0.5 + 0.5*(vec3(vn3(q*3.1 + 5.), vn3(q*3.7 + 11.), vn3(q*3.1 + 23.)) - 0.5);
  N = normalize(N + dn*0.75 + vec3(0., 1e-5, 0.));
  float rib = vn3(vec3(P.x*0.004, P.y*0.0012, P.z*0.004) + 7.);
  float line = uRange.w + 240.*vL + 320.*(vn3(q*0.6 + 9.) - 0.5);
  float snow = smoothstep(line - 160., line + 220., P.y)*smoothstep(0.16, 0.42, N.y + 0.35*(rib - 0.5) + 0.25*smoothstep(line + 300., line + 900., P.y));
  vec3 rock = mix(vec3(0.085, 0.095, 0.125), vec3(0.17, 0.155, 0.15), rib)*(0.7 + 0.6*vn3(q*5.3));
  vec3 wood = mix(vec3(0.03, 0.06, 0.05), vec3(0.07, 0.1, 0.06), vn3(q*2.2 + 40.));
  rock = mix(wood, rock, smoothstep(line - 900., line - 250., P.y + 300.*(rib - 0.5)));
  vec3 alb = mix(rock, vec3(0.8, 0.82, 0.86), snow);
  float ndl = max(dot(N, uSunDir), 0.);
  float sh = smoothstep(-0.05, 0.3, dot(normalize(vN + vec3(0., 1e-5, 0.)), uSunDir));          // the big faces turned from the sun are in their own shadow
  vec3 c = alb*(uSunCol*0.6*ndl*sh + uSkyCol*vec3(0.56, 0.76, 1.25)*(0.5 + 0.4*N.y));
  c += snow*uSunCol*0.05*pow(max(dot(reflect(-uSunDir, N), normalize(cameraPosition - P)), 0.), 6.)*sh;
  float hz = mix(uRange.x, uRange.y + uRange.z*vL, smoothstep(-150. + 250.*vL, 1150. + 450.*vL, P.y));
  gl_FragColor = vec4(max(mix(c, uRangeHaze, clamp(hz, 0., 0.97)), 0.), 1.);
}`,to=`
${E0}
attribute float iSeed; varying vec3 vObj; varying float vSeed, vGround;
${Te}
void main(){
  vGround = dot(normalize(instanceMatrix[1].xyz + vec3(0., 1e-5, 0.)), uSunDir);        // (a bush stands square to its slope: how that slope faces the sun)
  vec3 p = position;
  p *= 0.62 + 0.8*vn3(p*1.9 + iSeed*37.);
  p.x += 0.012*sin(uTime*0.7 + iSeed*30. + p.y*3.)*uAir.y;
  vObj = p; vSeed = iSeed;
  vec3 wpos = (modelMatrix*instanceMatrix*vec4(p, 1.)).xyz;
  vec3 wn = normalize(mat3(instanceMatrix)*normal + vec3(0., 1e-4, 0.));
  ${We}
}`,ao=`
${E0}
${wn}
uniform vec4 uOwn;                        // noise frequency, translucency, aerial haze, albedo gain (the near tree is finer and brighter)
uniform float uSlope;                     // 1: bushes on a slope turned from the sun stand in its shadow (the spur's scrub)
varying vec3 vObj; varying float vSeed, vGround;
${je}
void main(){
  ${_e}
  vec3 W = vWorld*uOwn.x;
  float clump = vn3(W/46. + vSeed*9.), leaf = vn3(W/15.);
  // the tree we left: every mass is ragged at its edge (sky and the masses behind show between the leaf sprays) and
  // broken into sprays of leaves with shade between them
  float spray = 0.55*vn3(W/19. + vSeed*5.) + 0.45*vn3(W/7.5 + 3.);
  float nv0 = max(dot(N, V), 0.);
  if (uOwn.z > 0.5 && nv0 < 0.62*smoothstep(0.2, 0.75, spray) + 0.08) discard;
  N = normalize(N + (vec3(vn3(W/38. + 3.), vn3(W/38. + 17.), vn3(W/38. + 31.)) - 0.5)*1.1);
  vec3 alb = mix(uLeafA, uLeafB, smoothstep(0.2, 0.8, clump*0.6 + leaf*0.4 + (vSeed - 0.5)*0.3))*uOwn.w;
  alb *= (0.4 + 0.9*smoothstep(0.15, 0.75, clump))*(0.45 + 0.75*smoothstep(-0.7, 0.6, vObj.y));
  alb *= mix(1., mix(0.3, 0.62, uSlope) + mix(1.15, 0.6, uSlope)*smoothstep(0.3, 0.62, 0.5*vn3(W/11. + 20.) + 0.5*vn3(W/4.6)), uOwn.z);
  float fl = smoothstep(uFleck.x, uFleck.x + 0.1, vn3(W/24. + 9.)*0.5 + vn3(W/8.)*0.5 + (fract(vSeed*7.3) - 0.6)*0.3);
  alb = mix(alb, uFleckCol, fl*uFleck.y);
  float gs = mix(1., smoothstep(-0.08, 0.28, vGround), uSlope);
  vec3 c = sunLit(alb, N, V, cloudSh(vWorld.xz)*gs, 16., 0.03);
  c += alb*uSunCol*vec3(0.9, 1., 0.4)*0.42*uOwn.y*max(-dot(N, uSunDir), 0.)*gs;    // light through the leaves
  float halo = pow(1. - max(dot(N, V), 0.), 2.)*(0.5 - 0.5*dot(V, uSunDir));
  c += alb*uSunCol*halo*0.9*(uOwn.y - 1.)*gs;                                      // a back-lit crown glows at its edges
  c += alb*(uSkyCol*1.1 + uSunCol*0.05)*uSlope;                                    // (the same fill as the slope under them)
  c = mix(c, farHaze(c, vWorld), uOwn.z*(1. - uSlope));
  c = mix(c, uHazeCol*0.94, spurHaze(vWorld)*uSlope);
  gl_FragColor = vec4(max(airHaze(c, vWorld), 0.), 1.);
  #include <fog_fragment>
}`,Ws=`
${E0}
attribute vec3 aCol, aK; attribute vec2 aUv; attribute float iSeed;
varying vec3 vCol, vK; varying vec2 vUv; varying float vSeed;
${Te}
void main(){
  vCol = aCol; vK = aK; vUv = aUv; vSeed = iSeed;
  vec4 wp = modelMatrix*instanceMatrix*vec4(position, 1.);
  float sc = length(instanceMatrix[1].xyz);
  float w = aK.x*aK.x*sc*uAir.y;
  float t = uTime*1.3 + iSeed*40.;
  vec3 gust = vec3(sin(t) + 0.5*sin(t*2.3 + wp.x*0.11), 0.35*sin(t*1.7 + 1.), cos(t*0.8) + 0.5*sin(t*1.9 + wp.z*0.13));
  wp.xyz += gust*w*(0.22 + 0.2*vn2(wp.xz*0.05 + uTime*0.25));
  vec3 wpos = wp.xyz, wn = normalize(mat3(instanceMatrix)*normal + vec3(0., 1e-4, 0.));
  ${We}
}`,js=`
${E0}
uniform vec3 uSilver, uSpot;
varying vec3 vCol, vK; varying vec2 vUv; varying float vSeed;
${je}
void main(){
  float kind = vK.y;
  float fw = fwidth(vUv.x) + fwidth(vUv.y) + 1e-4;
  // cut-outs: fern pinnae, lichen fringe
  if (kind > 2.5 && kind < 3.5){
    float pin = abs(fract(vUv.y*11.) - 0.5)*2., reach = (1. - vUv.y*vUv.y)*(0.3 + 0.7*smoothstep(0., 0.12, vUv.y));
    if (abs(vUv.x) > max(0.07, reach*(1. - 0.75*pin)) && fw < 0.6) discard;
  }
  if (kind > 3.5 && kind < 4.5){
    float fr = vn2(vec2(vUv.y*9. + vSeed*30., vSeed*7.));
    if (abs(vUv.x) > (0.25 + 0.75*fr)*(1. - vUv.y*0.7) && fw < 0.6) discard;
  }
  ${_e}
  vec3 alb = vCol; float gloss = 12. + vK.z*70., spec = 0.03 + vK.z*0.5, thru = 0.25;
  float n1 = vn3(vWorld*1.9), n2 = vn3(vWorld*6.3);
  if (kind > 0.5 && kind < 1.5){            // leathery leaf: dark above, silver felt below, pale midrib and veins
    float rib = 1. - smoothstep(0.03, 0.09, abs(vUv.x));
    float vein = (1. - smoothstep(0.1, 0.3, abs(fract(vUv.y*7. - abs(vUv.x)*1.6) - 0.5)))*0.35*(1. - smoothstep(0.1, 0.5, fw));
    alb = gl_FrontFacing ? mix(alb*(0.8 + 0.4*n1), alb*1.9 + 0.03, max(rib*0.7, vein)) : mix(uSilver*(0.75 + 0.35*n2), alb*1.2, rib*0.6);
    spec *= gl_FrontFacing ? 1. : 0.1; thru = 0.14;
  } else if (kind > 1.5 && kind < 2.5){     // corolla: darker throat, nectar spots on the upper lobes, sun through the petals
    float spots = step(0.62, vn2(vUv*vec2(26., 9.) + vSeed*20.))*smoothstep(0.35, 0.6, vUv.y)*(1. - smoothstep(0.8, 0.95, vUv.y))*step(abs(vUv.x - 0.5), 0.22);
    alb *= 0.55 + 0.55*smoothstep(0.05, 0.9, vUv.y) + 0.12*sin(vUv.x*31.4);
    alb = mix(alb, uSpot, spots*(gl_FrontFacing ? 0.25 : 0.85));
    if (!gl_FrontFacing) alb *= 0.6;
    thru = 0.75;
  } else if (kind > 4.5 && kind < 5.5){     // drumstick head: a ball of florets, each with a yellow eye
    vec2 g = vUv*vec2(22., 11.); vec2 gi = floor(g), gf = fract(g) - 0.5; gf.x += (h21(gi) - 0.5)*0.3;
    float r = length(gf), sel = h21(gi + 3.);
    alb = mix(alb*(0.55 + 0.6*sel), alb*1.5 + 0.08, smoothstep(0.5, 0.2, r));
    alb = mix(alb, vec3(0.85, 0.62, 0.1), smoothstep(0.16, 0.08, r)*(1. - smoothstep(0.2, 0.7, fw)));
  } else if (kind > 5.5){                   // moss: fuzzy, sparkling with dew (a ragged edge where it is a cap on rock)
    if (abs(vUv.x) + 0.55*vn2(vWorld.xz*0.23) > 1.08) discard;
    alb *= 0.35 + 1.5*n2*n1 + 0.45*step(0.85, vn3(vWorld*14.)) + 0.5*vn3(vWorld*0.6);
    thru = 0.45;
  } else {
    alb *= 0.75 + 0.5*n1;
  }
  alb *= mix(1., 0.62, uAir.z);
  vec3 c = sunLit(alb, N, V, 1., gloss, spec*(1. + 2.*uAir.z));
  c += uSunCol*alb*max(dot(-N, uSunDir), 0.)*thru;                   // translucency
  c += uSkyCol*pow(1. - max(dot(N, V), 0.), 3.)*0.25*(0.3 + vK.z);
  gl_FragColor = vec4(max(farHaze(c, vWorld), 0.), 1.);
  #include <fog_fragment>
}`,_s=`
${E0}
attribute vec3 aCol, aK; attribute vec2 aUv;
varying vec3 vCol, vK, vObj; varying vec2 vUv;
${Te}
void main(){
  vCol = aCol; vK = aK; vUv = aUv; vObj = position;
  vec3 p = position;
  float sw = aK.x;
  p.x += sw*0.9*sin(uTime*0.7 + p.y*0.03)*uAir.y; p.z += sw*0.6*sin(uTime*0.9 + 1.3 + p.y*0.04)*uAir.y;
  vec3 wpos = (modelMatrix*vec4(p, 1.)).xyz, wn = normalize(mat3(modelMatrix)*normal + vec3(0., 1e-4, 0.));
  ${We}
}`,Ks=`
${E0}
uniform vec3 uMoss; uniform float uCherry;
varying vec3 vCol, vK, vObj; varying vec2 vUv;
${je}
void main(){
  ${_e}
  float kind = vK.y; vec3 alb = vCol; float gloss = 14., spec = 0.04, h = 0.;
  vec3 P = vObj; vec3 emis = vec3(0.);
  if (kind < 0.5){                          // bark: flaking cinnamon plates, moss on top, lichen blotches
    vec2 b = vec2(vUv.x*0.33, vUv.y*0.085) + 0.6*vec2(vn3(P*0.11), vn3(P*0.11 + 9.));
    vec2 bi = floor(b), bf = fract(b);
    float edge = min(min(bf.x, 1. - bf.x), min(bf.y, 1. - bf.y)), id = h21(bi);
    float plate = smoothstep(0.02, 0.1, edge), curl = smoothstep(0.1, 0.42, edge)*(0.4 + 0.6*id);
    float lod = 1. - smoothstep(40., 200., length(vWorld - cameraPosition));
    float grain = vn3(P*vec3(2.1, 2.1, 2.1)), fine = mix(0.5, vn3(P*7.), lod);
    h = plate*0.6 + curl*0.5 + grain*0.25 + fine*0.1;
    alb = vCol*(0.5 + 0.42*id + 0.3*grain)*(0.5 + 0.5*plate);
    alb = mix(alb, vCol*vec3(1.5, 1.05, 0.8), (1. - plate)*0.5*id);
    float hor = smoothstep(0.6, 0.9, sin(vUv.y*5.2 + fine*2.))*uCherry;              // cherry: satin bark with lenticel bands
    alb = mix(alb, vCol*mix(0.55, 1.5, hor), uCherry*0.8); spec += 0.25*uCherry; gloss += 30.*uCherry;
    float lich = smoothstep(0.62, 0.72, vn3(P*0.23 + 5.))*smoothstep(0.4, 0.6, fine + grain*0.3);
    alb = mix(alb, vec3(0.42, 0.47, 0.38), lich*0.6*lod);
    float mossy = smoothstep(0.25, 0.75, N.y + 0.6*(vn3(P*0.3) - 0.5))*smoothstep(0.3, 0.55, vn3(P*0.9) + 0.25*N.y);
    alb = mix(alb, uMoss*(0.5 + 0.9*fine*grain + 0.4*lod*smoothstep(0.72, 0.86, vn3(P*11.))), mossy);
  } else if (kind < 1.5){                   // twisted bamboo rope: three strands laid one turn in 7 m, each of yarns twisted the other way
    float lodR = 1. - smoothstep(25., 110., length(vWorld - cameraPosition));
    float st = fract(vUv.x*3. - vUv.y*0.42 + 0.5), sc = abs(st - 0.5)*2.;
    float groove = 1. - sc*sc*sc;
    float yq = st*4. + vUv.y*1.5;
    float yarn = mix(0.5, 0.5 + 0.5*cos(6.2832*yq), lodR), fib = vn2(vec2(yq*9., vUv.y*0.9 - st*3.));
    h = groove*0.9 + yarn*0.22*(1. - sc) + fib*0.15;
    alb = vCol*(0.2 + 0.85*groove)*(0.66 + 0.3*yarn + 0.42*fib);
  } else if (kind < 2.5){                   // wooden rung: grain, knots, worn pale in the middle
    float g = vn2(vec2(vUv.x*14., vUv.y*0.35)) , k = vn2(vUv*vec2(2., 0.9) + 3.);
    h = g*0.4; alb = vCol*(0.5 + 0.6*g)*(0.8 + 0.4*k);
  } else if (kind < 3.5){                   // a dry leaf blade of the torch: midrib, parallel veins, curled dark edges; charred and glowing at the foot
    float ax = abs(vUv.x - 0.5)*2.;
    float rib = 1. - smoothstep(0.04, 0.16, ax), vein = 0.5 + 0.5*cos(vUv.x*44. + 2.*vn2(vec2(vUv.x*6., vUv.y*0.3)));
    float blot = vn2(vec2(vUv.x*3. + vCol.r*40., vUv.y*0.45));
    h = rib*0.6 + vein*0.25 + (1. - ax*ax)*0.5;
    alb = vCol*(0.5 + 0.35*vein + 0.55*blot)*(1. - 0.5*smoothstep(0.62, 1., ax));
    alb = mix(alb, vCol*vec3(1.4, 1.2, 0.72), rib*0.6);
    float heat = vK.z*smoothstep(0.35, 0.75, vn3(P*0.9 + vec3(0., uTime*0.35, 0.)) + vK.z*0.35);
    alb = mix(alb, vec3(0.02), vK.z*0.8);
    emis = vec3(1., 0.32, 0.05)*heat*(2.2 + 1.2*sin(uTime*3.1 + P.y*2.));
  } else {                                  // a loose fibre of the rope, pale and dry
    alb = vCol*(0.85 + 0.3*vn3(P*3.)); spec = 0.08;
  }
  vec3 dpx = dFdx(vWorld), dpy = dFdy(vWorld); float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 g = (hx*r1 + hy*r2)/(abs(det) + 1e-5)*sign(det + 1e-9);
  N = normalize(N - clamp(g*0.9, -1., 1.) + vec3(0., 1e-5, 0.));
  alb *= mix(1., 0.6, uAir.z);
  vec3 c = sunLit(alb, N, V, 1., gloss, spec*(1. + 3.*uAir.z)) + emis;
  c += uSkyCol*alb*pow(1. - max(dot(N, V), 0.), 3.)*0.6;
  gl_FragColor = vec4(max(farHaze(c, vWorld), 0.), 1.);
  #include <fog_fragment>
}`,oo=`
${E0}
attribute vec3 aCol; attribute vec4 aB;
uniform vec4 uFlap;                      // phase, amplitude, shoulder x, shoulder y
varying vec3 vCol, vObj; varying vec4 vB;
${Te}
void main(){
  #ifdef USE_INSTANCING
    mat4 im = instanceMatrix;
  #else
    mat4 im = mat4(1.);
  #endif
  vec3 p = position, n = normal;
  if (aB.z > 2.5 && aB.z < 3.5){
    float s = aB.x, ph = uFlap.x + im[3].x*0.021;
    float ang = uFlap.y*(0.45*s + 0.55*s*s)*sin(ph - 1.2*s) + 0.1*s;
    float ca = cos(ang), sa = sin(ang);
    vec2 q = vec2((p.x - uFlap.z*aB.w)*aB.w, p.y - uFlap.w);
    p.x = uFlap.z*aB.w + (ca*q.x - sa*q.y)*aB.w; p.y = uFlap.w + sa*q.x + ca*q.y;
    vec2 nq = vec2(n.x*aB.w, n.y); n.x = (ca*nq.x - sa*nq.y)*aB.w; n.y = sa*nq.x + ca*nq.y;
  }
  vCol = aCol; vB = aB; vObj = position;
  vec3 wpos = (modelMatrix*im*vec4(p, 1.)).xyz, wn = normalize(mat3(modelMatrix)*mat3(im)*n + vec3(0., 1e-4, 0.));
  ${We}
}`,no=`
${E0}
uniform vec3 uPale;
varying vec3 vCol, vObj; varying vec4 vB;
${je}
void main(){
  ${_e}
  float kind = vB.z; vec3 alb = vCol; float gloss = 30., spec = 0.12, rimK = 0.5, thru = 0., belly = 0.;
  if (kind > 0.5 && kind < 1.5){            // abdomen: dark with thin pale bands
    float bp = fract(vB.y*5.2 + 0.1), band = smoothstep(0.74, 0.84, bp)*(1. - smoothstep(0.93, 1., bp));
    alb = mix(alb, uPale*0.5, band*0.9*vB.w); spec = 0.3; gloss = 50.;
  } else if (kind > 1.5 && kind < 2.5){     // fur
    float f = vn3(vObj*38.)*vn3(vObj*17. + 4.);
    alb *= 0.55 + 1.5*f; spec = 0.02; rimK = 1.6;
  } else if (kind > 2.5 && kind < 3.5){     // flight feathers: barred below, scalloped above
    float s = vB.x, c = vB.y;
    float shaft = 1. - 0.3*smoothstep(0.3, 0.5, abs(fract(s*17.) - 0.5));
    if (gl_FrontFacing){
      alb *= (0.7 + 0.5*smoothstep(0.2, 0.9, fract(c*3.2 - s*0.4)))*shaft;
    } else {
      float bars = smoothstep(0.1, 0.24, abs(fract(c*4.4 + 0.2*sin(s*9.)) - 0.5))*smoothstep(0.3, 0.42, c);
      float mott = step(0.55, vn2(vec2(s*30., c*14.)))*(1. - smoothstep(0.3, 0.42, c));
      alb = uPale*vec3(0.66, 0.6, 0.52)*mix(1., 0.36, max(max(1. - bars, 0.)*smoothstep(0.3, 0.42, c), mott*0.75))*shaft;
      alb = mix(alb, vCol*0.5, max(smoothstep(0.9, 0.97, c), smoothstep(0.86, 0.97, s)));          // dark trailing edge and fingertips
      alb = mix(alb, vCol*0.45, (1. - smoothstep(0.06, 0.16, distance(vec2(s, c), vec2(0.56, 0.2)))));   // carpal patch
      thru = 0.55;
    }
    spec = 0.05;
  } else if (kind > 4.5 && kind < 5.5){     // a raptor's body: scalloped feathers above, the pale underside barred
    vec2 g = vec2(vObj.x*0.7 + vObj.y*0.45, vObj.z*0.75); g.x += 0.5*mod(floor(g.y), 2.);
    vec2 gf = fract(g) - 0.5;
    float sc = smoothstep(0.55, 0.1, length(gf*vec2(1., 1.25) + vec2(0., 0.18)));
    float bars = mix(0.8, smoothstep(-0.25, 0.25, sin(vObj.z*2.3 + 0.8*sin(vObj.x*1.4))), smoothstep(-2.5, 1., vObj.z));   // the rump is plain
    float under = smoothstep(0.2, 0.4, dot(alb, vec3(0.333)))*(1. - smoothstep(7.4, 8.5, vObj.z));      // (the head is plain)
    alb *= mix(vec3(0.6 + 0.65*sc), mix(vec3(0.5, 0.36, 0.25), vec3(1.05), bars)*(0.85 + 0.25*sc), under);
    spec = 0.04; rimK = 0.9; belly = 1.;
  } else if (kind > 5.5){ belly = 1.; spec = 0.2;        // (bare skin: the feet)
  } else if (kind > 3.5){ spec = 1.2; gloss = 90.; rimK = 0.2; }
  alb *= mix(1., 0.7, uAir.z);
  vec3 c = sunLit(alb, N, V, 1., gloss, spec);
  c += uSunCol*alb*max(dot(-N, uSunDir), 0.)*thru;
  // a bird's breast and belly are lit from below: the sunlit haze of the gorge and the pale cliff under it
  c += alb*(uSkyCol*0.55 + uBounceCol*0.5 + uSunCol*0.24)*(1. - smoothstep(-0.6, 0.35, N.y))*belly;
  float rim = pow(1. - max(dot(N, V), 0.), 3.);
  c += (uSunCol*vec3(0.5, 0.38, 0.22)*(0.3 + 0.7*max(dot(N, uSunDir), 0.)) + uSkyCol*0.5)*rim*rimK*0.45;
  gl_FragColor = vec4(max(c, 0.), 1.);
  #include <fog_fragment>
}`,so=`
attribute vec2 aUv; varying vec2 vUv;
${Te}
void main(){
  #ifdef USE_INSTANCING
    mat4 im = instanceMatrix;
  #else
    mat4 im = mat4(1.);
  #endif
  vUv = aUv;
  vec3 wpos = (modelMatrix*im*vec4(position, 1.)).xyz, wn = normalize(mat3(modelMatrix)*mat3(im)*normal + vec3(0., 1e-4, 0.));
  ${We}
}`,ro=`
${E0}
uniform vec4 uFan;                       // rgb tint, alpha
uniform vec3 uClA, uClB;
varying vec2 vUv;
${je}
void main(){
  ${_e}
  float a = uFan.a*(0.3 + 0.7*(1. - vUv.y*vUv.y))*smoothstep(0., 0.12, vUv.x)*(1. - smoothstep(0.7, 1., vUv.x));
  a *= 0.82 + 0.18*sin(vUv.y*7. + uTime*23.)*sin(uTime*9. + vUv.x*5.);
  float gl = pow(max(dot(reflect(-V, N), uSunDir), 0.), 12.);
  vec3 ab = uClB - uClA; float tt = clamp(dot(vWorld - uClA, ab)/max(dot(ab, ab), 1e-4), 0., 1.);
  float open = smoothstep(9., 20., length(vWorld - uClA - ab*tt));
  vec3 c = (uFan.rgb*(uSkyCol*1.2 + uSunCol*0.25) + uSunCol*gl*0.5)*mix(0.22, 1., open);
  gl_FragColor = vec4(max(c, 0.), a*mix(0.6, 1., open));
  #include <fog_fragment>
}`,Mn=`
attribute vec3 aCol; attribute vec4 aB;
varying vec3 vCol, vObj, vNv; varying vec4 vB;
void main(){
  vCol = aCol; vB = aB; vObj = position;
  vNv = normalMatrix*normal;
  gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.);
}`,zn=`
uniform vec3 uKey, uFill, uGlow;       // the sun over our shoulder, the sky, the portal's light ahead of us in the cleft
uniform float uDim;                    // 0 in the open, 1 down the cleft
uniform float uSoft;                   // 1 on the blended fringe
varying vec3 vCol, vObj, vNv; varying vec4 vB;
float bh(float n){ return fract(sin(n*12.9898)*43758.5453); }
float bn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f); float n = dot(i, vec3(1., 57., 113.));
  return mix(mix(mix(bh(n), bh(n + 1.), f.x), mix(bh(n + 57.), bh(n + 58.), f.x), f.y),
             mix(mix(bh(n + 113.), bh(n + 114.), f.x), mix(bh(n + 170.), bh(n + 171.), f.x), f.y), f.z); }
void main(){
  vec3 N = normalize(vNv + vec3(0., 1e-5, 0.));
  if (N.z < 0.) N = -N;                                       // (camera space: whatever we see faces us)
  vec3 alb = vCol; float rimK = 0.5, spec = 0., alpha = 1., glow = 0.;
  if (vB.z < 0.5){                                            // antenna: a ringed flagellum, each segment a soft barrel with a pale joint
    float sg = fract(vB.x*13.);
    alb *= 0.75 + 0.45*sin(sg*3.14159);
    alb = mix(alb, vec3(0.62, 0.44, 0.2), (1. - smoothstep(0.03, 0.12, min(sg, 1. - sg)))*0.55*step(0.2, vB.x));
    alb *= 0.85 + 0.3*bn(vObj*60.);
    rimK = 1.6; spec = 0.3;
  } else if (vB.z < 1.5){                                     // thorax: amber fur in tufts combed back over a dark under-fur, a darker saddle across it
    float st = bn(vec3(vObj.x*105., vObj.y*40., vObj.z*24.)), cl = bn(vObj*vec3(13., 13., 9.) + 3.);
    float tuft = smoothstep(0.22, 0.8, st*0.55 + cl*0.6);
    alb = vCol*mix(0.56, 1.15, tuft);
    alb = mix(alb, vec3(0.085, 0.05, 0.026)*(0.55 + 0.9*tuft), vB.w);
    rimK = 1.1;
  } else {                                                    // a hair of the fringe: deep amber at the root, pale gold and half clear at the tip
    float t = vB.x, e = abs(vB.y*2. - 1.);
    alb = mix(alb*0.6, alb*1.35 + vec3(0.07, 0.05, 0.015), t);
    N = normalize(mix(N, vec3(0., 0.8, 0.6), 0.6));
    rimK = 0.; glow = 0.3*t;
    alpha = mix(1., (1. - smoothstep(0.15, 1., e))*(1. - smoothstep(0.45, 1., t))*0.85, uSoft);
  }
  vec3 L = normalize(vec3(-0.42, 0.74, 0.52));
  float wrap = clamp(dot(N, L)*0.62 + 0.38, 0., 1.);
  vec3 day = alb*(uKey*(wrap + glow) + uFill*(0.55 + 0.45*N.y)) + uKey*spec*pow(max(dot(N, normalize(L + vec3(0., 0., 1.))), 0.), 24.);
  float rim = pow(1. - abs(N.z), 2.5);
  day += alb*uKey*rim*rimK*(0.35 + 0.65*smoothstep(-0.3, 0.6, N.y));
  vec3 deep = alb*uGlow*(0.3 + 0.7*rim + 0.5*max(N.y, 0.) + glow);
  gl_FragColor = vec4(max(mix(day, deep, uDim), 0.), alpha);
}`,Lt=`
${E0}
attribute float aP; attribute vec3 iA, iB, iC; attribute vec4 iT; attribute vec2 iS;
uniform float uStory; uniform vec4 uNear;                                  // lens push, fade from, fade to, least size in pixels
uniform vec3 uSpine[21];                                                   // the river of the absconding colony: the knots of its course (ends doubled)
varying float vP, vBand; varying vec3 vS;
${Te}
void main(){
  float clock = mix(uTime, uStory, step(0.5, iT.z));
  float s = iT.z < 0.5 ? fract(clock/max(iT.y, 0.01) + iT.x) : clamp((clock - iT.x)/max(iT.y, 0.01), 0., 1.);
  vec3 ctrl = (iA + iB)*0.5 + iC;
  vec3 p0 = mix(mix(iA, ctrl, s), mix(ctrl, iB, s), s);
  vec3 tg = normalize(mix(ctrl - iA, iB - ctrl, s) + vec3(1e-4, 0., 0.));
  float rv = 1.;
  if (iT.z > 1.5){
    // a bee of the river: off the comb, into the stream and along it. iT = (when it lets go, metres a second, 2, size),
    // iC = (distance from the axis, angle, swirl). The first eleven knots are 17.5 m apart; beyond them each gap is 1.3 times the last.
    float sl = max(clock - iT.x, 0.)*iT.y;
    float f = min(min(sl/17.5, 11.) + log(1. + max(sl - 192.5, 0.)*0.014992)/0.26236, 17.999);
    float fi = floor(f), t = f - fi; int k = int(fi);
    vec3 q0 = uSpine[k], q1 = uSpine[k + 1], q2 = uSpine[k + 2], q3 = uSpine[k + 3];
    vec3 cb = q2 - q0, cc = 2.*q0 - 5.*q1 + 4.*q2 - q3, cd = -q0 + 3.*q1 - 3.*q2 + q3;
    vec3 sp = 0.5*(2.*q1 + cb*t + cc*t*t + cd*t*t*t);
    vec3 st = normalize(0.5*(cb + 2.*cc*t + 3.*cd*t*t) + vec3(1e-4, 0., 0.));
    vec3 ss = normalize(cross(st, vec3(0., 1., 0.)) + vec3(0., 0., 1e-4)), su = cross(ss, st);
    // tight where it runs behind comb four, opening out in the air beyond the gap, a little wider still far away
    float ang = iC.y + (clock - iT.x)*iC.z, wide = mix(0.48, 1., smoothstep(5.5, 8.5, f))*(1. + 0.8*smoothstep(11., 18., f));
    vec3 pr = sp + (ss*cos(ang) + su*sin(ang)*0.75)*iC.x*wide;
    float join = smoothstep(0., 1.3, f);
    p0 = mix(iA, pr, join);
    tg = normalize(mix(pr - iA, st*30., join) + vec3(1e-4, 0., 0.));
    rv = step(1e-3, clock - iT.x)*smoothstep(0., 0.2, f)*(1. - smoothstep(16.6, 17.9, f));
  }
  vec3 sd = normalize(cross(tg, vec3(0., 1., 0.)) + vec3(0., 0., 1e-4)), up = cross(sd, tg);
  float sz = iT.w, seed = iS.x;
  float wv = sin(uTime*1.7 + seed*40.), wu = sin(uTime*2.3 + seed*70.);
  p0 += (sd*wv + up*wu)*0.7*sz;
  float roll = 0.5*cos(uTime*1.7 + seed*40.);                              // banks into its own weave
  vec3 sd2 = sd*cos(roll) + up*sin(roll), up2 = up*cos(roll) - sd*sin(roll);
  float vis = iT.z > 1.5 ? rv : smoothstep(0., 0.035, s)*(1. - smoothstep(0.965, 1., s));
  vec3 dc = p0 - cameraPosition; float dl = length(dc) + 1e-3;
  p0 += dc/dl*max(0., uNear.x - dl);                                       // never through the lens
  vis *= smoothstep(uNear.y, uNear.z, dl);
  dl = max(dl, uNear.x);
  sz *= max(1., dl*uNear.w/max(uAir.w, 100.));                             // a far bee stays a dark speck, not a point
  vec3 q = position;
  if (aP > 2.5 && aP < 3.5) q *= iS.y;
  vec3 wpos = p0 + (sd2*q.x + up2*q.y + tg*q.z)*sz*vis;
  vec3 wn = normalize(sd2*normal.x + up2*normal.y + tg*normal.z + vec3(0., 1e-4, 0.));
  vP = aP; vBand = position.z; vS = vec3(iS, dl);
  ${We}
}`,Ut=`
${E0}
uniform vec3 uPale, uBeeDark, uClA, uClB, uPortalPos, uPortalCol;
uniform vec4 uShade;                     // the colours of the body hold out to (from, to) metres; gain of the tawny fur; lift of the dark abdomen
uniform vec4 uWing;                      // the wing blur: its own light, its glint toward the sun, how opaque, the range at which it is lost
uniform float uFace;                     // 1 (the swarm): shade every bee by the side it turns to us, the sun wrapped round its fur
varying float vP, vBand; varying vec3 vS;
${je}
void main(){
  bool wing = vP > 1.5 && vP < 2.5;
  ${_e}
  // (a flyer's frame is a mirror image, so the winding of its faces is reversed and the test above turns the normal of
  // every face we see inward: the swarm, seen from all round and near, takes the side that faces us)
  if (uFace > 0.5 && dot(N, V) < 0.) N = -N;
  vec3 dark = uBeeDark*0.36 + vec3(0.03, 0.017, 0.008)*uShade.w, tawny = vec3(0.06, 0.035, 0.011)*uShade.z;
  vec3 alb = dark; float furry = 0., nearK = 1. - smoothstep(uShade.x, uShade.y, vS.z);   // past that a bee is a dark speck
  // the body is told apart along its length: a near-black abdomen with thin pale bands, a tawny thorax, a dark head
  if (vP < 1.5 && vBand < 0.04){
    float bp = fract(vBand*5.6 + 0.3), band = smoothstep(0.66, 0.76, bp)*(1. - smoothstep(0.9, 1., bp));
    alb = mix(dark, uPale*0.3*(1. + 0.25*uShade.w), band*0.8*nearK*smoothstep(-0.62, -0.5, vBand));
    alb = mix(alb, tawny*0.83, smoothstep(-0.1, 0.02, vBand)*0.8*nearK);     // the first segment is tawny too
  } else if (vP < 1.5 && vBand < 0.37){ alb = mix(uBeeDark*0.5, tawny*(0.8 + 0.4*fract(vS.x*7.)), 0.25 + 0.75*nearK); furry = 1.; }
  else if (vP < 1.5) alb = uBeeDark*0.42 + vec3(0.02, 0.012, 0.006)*uShade.w;
  else if (vP < 2.5) alb = vec3(0.05, 0.047, 0.045);
  else if (vP < 3.5) alb = uPale*0.6;
  vec3 ab = uClB - uClA; float tt = clamp(dot(vWorld - uClA, ab)/max(dot(ab, ab), 1e-4), 0., 1.);
  float open = smoothstep(9., 20., length(vWorld - uClA - ab*tt));          // 0 inside the cleft: no sun there, only the glow from the far end
  vec3 c = sunLit(alb, N, V, open, 34., wing ? 0.02 : 0.03 + 0.05*(1. - furry))*mix(0.5, 1., open);
  float fwd = max(dot(-V, uSunDir), 0.), ndl0 = dot(N, uSunDir);
  if (!wing) c += alb*uSunCol*(clamp(ndl0*0.6 + 0.4, 0., 1.) - max(ndl0, 0.))*open*uFace;        // the sun wrapped round a furred body
  // the wings: a pale blur that catches the sun (brightest toward the sun and where the fan turns its face to it)
  float wk = 1. - smoothstep(uWing.w*0.6, uWing.w, vS.z);
  if (wing) c += open*uSunCol*vec3(0.9, 0.84, 0.72)*(uWing.x + uWing.y*(fwd*fwd*fwd + 0.6*pow(max(dot(reflect(-V, N), uSunDir), 0.), 6.)));
  // light catches only the fur of the thorax and the very edge of the body
  float rim = pow(1. - max(dot(N, V), 0.), 5.)*(wing ? 0.15 : mix(0.3, 1.4, furry))*(0.25 + 0.75*nearK);
  c += mix(vec3(0.6, 0.34, 0.1)*0.14, uSunCol*vec3(0.5, 0.38, 0.22)*0.05, open)*rim;
  // down the cleft the portal lights them: gold on the side turned to it, a gold rim, the bands and the fur readable
  vec3 Lp = uPortalPos - vWorld; float dp = length(Lp) + 1e-3; Lp /= dp;
  float pl = (1. - open)*(0.3 + 0.7*clamp(1. - dp/110., 0., 1.)), nlp = dot(N, Lp);
  c += uPortalCol*pl*(alb*3.6*(0.22 + 0.78*max(nlp, 0.)) + vec3(1., 0.7, 0.34)*0.2*pow(max(1. - max(dot(N, V), 0.), 0.), 3.)*(0.4 + 0.6*smoothstep(-0.4, 0.5, nlp))*(wing ? 0.3 : mix(0.6, 1.3, furry)));
  // (the wings are a blur: drawn in their own pass over the picture, a third opaque)
  gl_FragColor = vec4(max(c, 0.), wing ? uWing.z*wk : 1.);
  #include <fog_fragment>
}`,ge={NK:54,RMIN:3.9,FA:5,BEND:2.4,SPREAD:.8},Sn=`
${E0}
attribute float aP; attribute vec3 iA, iB, iC; attribute vec4 iT; attribute vec2 iS;
uniform vec4 uLine[${ge.NK+2}];     // the knots (the ends doubled outward): place, and the bend of the line there (1/m, + to the right)
uniform vec4 uLay;                          // last knot; the knot where the line meets our road; the knot at the end of the far turn; the knot where the road swings out from the tiers
uniform vec4 uRope;                         // the core: metres from the line to its middle; its bearing round the line beside the tiers; how far that bearing turns between there and the vista; the knot of the vista
const float RMIN = ${ge.RMIN.toFixed(2)}, FA = ${ge.FA.toFixed(2)}, BEND = ${ge.BEND.toFixed(2)}, SPREAD = ${ge.SPREAD.toFixed(2)};
varying float vP, vBand; varying vec3 vS;
${Te}
// where the lane is at knot f (the same sum is done in build(), to measure every lane against the road's line)
vec3 laneAt(float f){
  float fc = clamp(f, 0., uLay.x - 1e-3), fi = floor(fc), t = fc - fi; int k = int(fi);
  vec4 q0 = uLine[k], q1 = uLine[k + 1], q2 = uLine[k + 2], q3 = uLine[k + 3];
  vec3 cb = q2.xyz - q0.xyz, cc = 2.*q0.xyz - 5.*q1.xyz + 4.*q2.xyz - q3.xyz, cd = -q0.xyz + 3.*q1.xyz - 3.*q2.xyz + q3.xyz;
  vec3 sp = 0.5*(2.*q1.xyz + cb*t + cc*t*t + cd*t*t*t);
  vec3 st = normalize(0.5*(cb + 2.*cc*t + 3.*cd*t*t) + vec3(1e-4, 0., 0.));
  vec3 ss = normalize(cross(st, vec3(0., 1., 0.)) + vec3(0., 0., 1e-4)), su = cross(ss, st);
  // a lane of the core lies in a rope whose middle runs beside the line and winds slowly round it; a lane of the sheath
  // lies about the line itself. Each turns a little of its own, and the whole is wider toward the forest
  float core = step(5., iC.z), rope = uRope.y + uRope.z*smoothstep(uLay.w, uRope.w, fc), ang = iC.y + (iC.z - 10.*core)*fc + core*rope;
  vec2 off = (iC.x*vec2(cos(ang), sin(ang)) + core*uRope.x*vec2(cos(rope), sin(rope)))*(1. + SPREAD*(1. - smoothstep(0., uLay.y, fc)));
  float x = off.x, kap = mix(q1.w, q2.w, t), ax = abs(x) - RMIN;
  if (kap*x > 0. && ax > 0.) x = sign(x)*(RMIN + ax/(1. + BEND*abs(kap)*ax));       // the inside of a bend: held off its centre
  vec3 p = mix(iA, sp + ss*x + su*off.y, smoothstep(0., FA, fc));                    // out of its bell
  float away = step(1., iT.z), peel = iT.z - 2.*away;                                // (where it turns for its comb: from the vista, 0, to the far turn, 1)
  return mix(p, iB, smoothstep(mix(uRope.w, uLay.z, peel), uLay.x, fc));             // in to its comb
}
void main(){
  float s = fract(uTime/max(iT.y, 1.) + iT.x), away = step(1., iT.z), sg = mix(s, 1. - s, away);
  // the fifth of its time nearest the forest it flies fast (3.5 times as fast at the bell, easing down), the rest at one speed
  float x1 = min(sg/0.2, 1.);
  float f = uLay.x*(0.8*sg + 2.*(sg - 0.2*(x1*x1*x1 - 0.5*x1*x1*x1*x1) - max(sg - 0.2, 0.)));
  vec3 pa = laneAt(f - 0.03), pb = laneAt(f + 0.03), p0 = 0.5*(pa + pb);
  vec3 tg = normalize((pb - pa)*(1. - 2.*away) + vec3(1e-5, 0., 0.));
  vec3 sd = normalize(cross(tg, vec3(0., 1., 0.)) + vec3(0., 0., 1e-4)), up = cross(sd, tg);
  float sz = iT.w, seed = iS.x;
  // its own weave about its lane: a slow wander to the side and up and down, a quicker small one over it, and it banks into both
  float ends = smoothstep(0., 1.5, f)*(1. - smoothstep(uLay.x - 1.5, uLay.x, f));
  float a1 = uTime*(0.5 + 0.5*fract(seed*13.7)) + seed*40., a2 = uTime*(0.4 + 0.5*fract(seed*29.3)) + seed*70.;
  float a3 = uTime*1.9 + seed*91., a4 = uTime*2.3 + seed*57.;
  p0 += (sd*(sin(a1) + 0.3*sin(a3)) + up*(0.7*sin(a2) + 0.25*sin(a4)))*ends;
  float roll = (0.45*cos(a1) + 0.2*cos(a3))*ends;
  vec3 sd2 = sd*cos(roll) + up*sin(roll), up2 = up*cos(roll) - sd*sin(roll);
  float vis = smoothstep(0., 0.3, f)*(1. - smoothstep(uLay.x - 0.3, uLay.x, f));     // (it goes into its bell, and into the curtain)
  vec3 q = position;
  if (aP > 2.5 && aP < 3.5) q *= iS.y;
  vec3 wpos = p0 + (sd2*q.x + up2*q.y + tg*q.z)*sz*vis;
  vec3 wn = normalize(sd2*normal.x + up2*normal.y + tg*normal.z + vec3(0., 1e-4, 0.));
  vP = aP; vBand = position.z; vS = vec3(iS, length(p0 - cameraPosition) + 1e-3);
  ${We}
}`,Cn=`
${E0}
uniform vec3 uPale, uBeeDark, uGold;
uniform vec4 uShade, uWing;              // as in FLY_FS
varying float vP, vBand; varying vec3 vS;
${je}
void main(){
  bool wing = vP > 1.5 && vP < 2.5;
  ${_e}
  if (dot(N, V) < 0.) N = -N;
  vec3 dark = uBeeDark*0.36 + vec3(0.03, 0.017, 0.008)*uShade.w, tawny = vec3(0.06, 0.035, 0.011)*uShade.z;
  vec3 alb = dark; float furry = 0., nearK = 1. - smoothstep(uShade.x, uShade.y, vS.z);
  if (vP < 1.5 && vBand < 0.04){
    float bp = fract(vBand*5.6 + 0.3), band = smoothstep(0.66, 0.76, bp)*(1. - smoothstep(0.9, 1., bp));
    alb = mix(dark, uPale*0.3*(1. + 0.25*uShade.w), band*0.8*nearK*smoothstep(-0.62, -0.5, vBand));
    alb = mix(alb, tawny*0.83, smoothstep(-0.1, 0.02, vBand)*0.8*nearK);
  } else if (vP < 1.5 && vBand < 0.37){ alb = mix(uBeeDark*0.5, tawny*(0.8 + 0.4*fract(vS.x*7.)), 0.25 + 0.75*nearK); furry = 1.; }
  else if (vP < 1.5) alb = uBeeDark*0.42 + vec3(0.02, 0.012, 0.006)*uShade.w;
  else if (vP < 2.5) alb = vec3(0.05, 0.047, 0.045);
  else if (vP < 3.5) alb = uPale*0.6;
  vec3 c = sunLit(alb, N, V, 1., 34., wing ? 0.02 : 0.03 + 0.05*(1. - furry));
  float fwd = clamp(dot(-V, uSunDir), 0., 1.), ndl0 = dot(N, uSunDir), nv = clamp(dot(N, V), 0., 1.);
  if (!wing) c += alb*uSunCol*(clamp(ndl0*0.6 + 0.4, 0., 1.) - max(ndl0, 0.));                // the sun wrapped round a furred body
  // the wing blur: lost with distance as the flyers' is, and thinner close to (a blur seen near is mostly air)
  float wk = (1. - smoothstep(uWing.w*0.6, uWing.w, vS.z))*mix(0.3, 1., smoothstep(6., 30., vS.z));
  if (wing) c += uSunCol*uGold*(uWing.x + uWing.y*(fwd*fwd*fwd + 0.6*pow(clamp(dot(reflect(-V, N), uSunDir), 0., 1.), 6.)));
  float rim = pow(1. - nv, 5.)*(wing ? 0.15 : mix(0.3, 1.4, furry))*(0.25 + 0.75*nearK);
  c += uSunCol*vec3(0.5, 0.38, 0.22)*0.05*rim;
  if (!wing) c += uSunCol*uGold*tawny*furry*(1. - nv)*(1. - nv)*(0.6 + 1.4*fwd);              // the sun in the fur
  c = farHaze(c, vWorld);                                                                       // the air of the place, as on its plants
  gl_FragColor = vec4(clamp(c, 0., 8.), wing ? uWing.z*wk : 1.);
  #include <fog_fragment>
}`;function y0(a={}){const v=[],A=[],q={};for(const N in a)q[N]=[];return{pos:v,idx:A,att:q,count(){return v.length/3},v(N,M,i,d){v.push(N,M,i);for(const h in a){const f=d&&d[h],u=a[h];for(let l=0;l<u;l++)q[h].push(f?f[l]??0:0)}return v.length/3-1},tri(N,M,i){A.push(N,M,i)},quad(N,M,i,d){A.push(N,M,i,N,i,d)},geometry(){const N=new D.BufferGeometry;N.setAttribute("position",new D.Float32BufferAttribute(v,3));for(const M in a)N.setAttribute(M,new D.Float32BufferAttribute(q[M],a[M]));return N.setIndex(A),N.computeVertexNormals(),N}}}function G0(a,v,A,q,N,M=0){const i=v.length,d=s(0,0,1),h=s(0,1,0),f=s(1,0,0),u=s(0,0,0),l=[];d.subVectors(v[1],v[0]).normalize(),Math.abs(d.y)>.9&&h.set(1,0,0);let S=0;for(let L=0;L<i;L++){L>0&&(S+=v[L].distanceTo(v[L-1])),d.subVectors(v[Math.min(i-1,L+1)],v[Math.max(0,L-1)]).normalize(),h.addScaledVector(d,-h.dot(d)).normalize(),f.crossVectors(d,h);const Q=L/(i-1);l.push(a.count());for(let Z=0;Z<=q;Z++){const O=Z/q*Math.PI*2+M*S,r0=A(Q,O,S);u.copy(v[L]).addScaledVector(h,Math.cos(O)*r0).addScaledVector(f,Math.sin(O)*r0),a.v(u.x,u.y,u.z,N(Q,Z/q,S))}}for(let L=0;L<i-1;L++)for(let Q=0;Q<q;Q++){const Z=l[L]+Q,O=l[L+1]+Q;a.quad(Z,Z+1,O+1,O)}}function ye(a,v,A,q=!0,N=!0){const M=[];for(const d of v){M.push(a.count());for(let h=0;h<A;h++){const f=h/A*Math.PI*2;a.v((d.xc||0)+Math.sin(f)*d.rx,(d.yc||0)+Math.cos(f)*(d.ry??d.rx),d.z,d.a)}}for(let d=0;d<v.length-1;d++)for(let h=0;h<A;h++){const f=M[d]+h,u=M[d]+(h+1)%A,l=M[d+1]+(h+1)%A,S=M[d+1]+h;a.quad(f,S,l,u)}const i=(d,h)=>{const f=v[d],u=a.v(f.xc||0,f.yc||0,f.z,f.a);for(let l=0;l<A;l++){const S=M[d]+l,L=M[d]+(l+1)%A;h?a.tri(u,L,S):a.tri(u,S,L)}};N&&i(0,!1),q&&i(v.length-1,!0)}const Pe={aCol:3,aK:3,aUv:2},k0=(a,v=1)=>[a.r*v,a.g*v,a.b*v];function Is(a,v,A,q){const N=y0(Pe),M=10,i=q?2.6:2.2,d=q?[[0,.1],[.2,.22],[.45,.5],[.62,.95],[.72,1.3]]:[[0,.13],[.28,.3],[.8,.42],[1.35,.52],[1.72,.7],[1.95,1]],h=[];for(let l=0;l<=2;l++){const S=[];for(let L=0;L<3;L++){const Q=L*2.094;S.push(N.v(Math.cos(Q)*.09,i*l/2,Math.sin(Q)*.09,{aCol:k0(A,.8),aK:[l/2*.5,0,.1],aUv:[0,0]}))}h.push(S)}for(let l=0;l<2;l++)for(let S=0;S<3;S++)N.quad(h[l][S],h[l][(S+1)%3],h[l+1][(S+1)%3],h[l+1][S]);const f=[];d.forEach(([l,S],L)=>{const Q=[],Z=L/(d.length-1),O=L===d.length-1;for(let r0=0;r0<=M;r0++){const e0=r0/M*Math.PI*2,t0=Math.cos(5*e0),o0=S*(O?1+.2*t0:1+.05*t0*Z),h0=i+l-(O?(q?.05:.16)*(1-t0):0),i0=Z<.12?k0(A):k0(v.clone().lerp(a,Math.min(1,Z*1.3)));Q.push(N.v(Math.cos(e0)*o0,h0,Math.sin(e0)*o0,{aCol:i0,aK:[.5+.5*Z,2,.25],aUv:[r0/M,Z]}))}f.push(Q)});for(let l=0;l<d.length-1;l++)for(let S=0;S<M;S++)N.quad(f[l][S],f[l+1][S],f[l+1][S+1],f[l][S+1]);const u=d[d.length-1][0];for(let l=0;l<5;l++){const S=l*1.2566+.4,L=Math.cos(S),Q=Math.sin(S),Z=.045,O=[];for(let r0=0;r0<=3;r0++){const e0=r0/3,t0=i+.15+e0*(u+(q?.5:.25)),o0=(q?.55:.2)*e0+.12*e0*e0,h0=r0===3?q?[.8,.6,.1]:[.12,.04,.03]:k0(a,1.25),i0=r0===3?Z*2.4:Z,U0=N.v(L*o0-Q*i0,t0,Q*o0+L*i0,{aCol:h0,aK:[1,0,.2],aUv:[0,0]}),d0=N.v(L*o0+Q*i0,t0,Q*o0-L*i0,{aCol:h0,aK:[1,0,.2],aUv:[0,0]});r0>0&&N.quad(O[0],O[1],d0,U0),O[0]=U0,O[1]=d0}}return N.geometry()}function Es(a,v=5,A=.8){const q=y0(Pe),N=5,M=[];for(let i=0;i<=N+1;i++){const d=Math.max(0,(i-1)/N),h=i===0,f=h?-.7:d*v,u=h?.07:Math.max(.05,A*Math.pow(Math.sin(Math.PI*Math.pow(d,.8)),.75)+.05),l=-.9*d*d-(h?0:.05),S=[];for(const L of[-1,0,1])S.push(q.v(L*u,f,l-Math.abs(L)*u*.42+(L===0?.06:0),{aCol:k0(a,h?1.3:1),aK:[h?0:.25+.75*d,h?0:1,.55],aUv:[L,d]}));M.push(S)}for(let i=0;i<=N;i++)for(let d=0;d<2;d++)q.quad(M[i][d],M[i][d+1],M[i+1][d+1],M[i+1][d]);return q.geometry()}function kn(a,v,A,q,N,M){const i=y0(Pe),d=a===3?6:8,h=[];for(let f=0;f<=d;f++){const u=f/d,l=[],S=a===3?v*(u-.35*q*u*u):-v*u,L=a===3?-v*q*.8*u*u:.25*Math.sin(u*5);for(const Q of[-1,1])l.push(i.v(Q*A*.5,S,L+(a===3?Math.abs(Q)*.12:0),{aCol:k0(N.clone().lerp(M,u)),aK:[a===3?u:.35+.65*u,a,.15],aUv:[Q,u]}));h.push(l)}for(let f=0;f<d;f++)i.quad(h[f][0],h[f][1],h[f+1][1],h[f+1][0]);return i.geometry()}function Gs(a,v){const A=y0(Pe),q=[];for(let f=0;f<=4;f++){const u=f/4;q.push(s(.35*u*u,6.6*u,.2*Math.sin(u*2.2)))}G0(A,q,f=>.2-.07*f,5,f=>({aCol:k0(v.clone().lerp(f0("#c9cf9a"),.5),.9),aK:[f,0,.1],aUv:[0,0]}));const N=q[4],M=1,i=10,d=4,h=[];for(let f=0;f<=d;f++){const u=f/d*Math.PI,l=[];for(let S=0;S<=i;S++){const L=S/i*Math.PI*2,Q=1+.07*Math.sin(S*2.5+f*1.9);l.push(A.v(N.x+Math.sin(u)*Math.cos(L)*M*Q,N.y+.7-Math.cos(u)*M*.92*Q,N.z+Math.sin(u)*Math.sin(L)*M*Q,{aCol:k0(a,.8+.2*(f/d)),aK:[1,5,.1],aUv:[S/i,f/d]}))}h.push(l)}for(let f=0;f<d;f++)for(let u=0;u<i;u++)A.quad(h[f][u],h[f+1][u],h[f+1][u+1],h[f][u+1]);for(let f=0;f<8;f++){const u=f*.785+.3,l=Math.cos(u),S=Math.sin(u),L=2.3+.5*Math.sin(f*2.1),Q=[];for(let Z=0;Z<=2;Z++){const O=Z/2,r0=.2+L*O,e0=Z===0?.15:Z===1?.55:.12,t0=.15+.55*Math.sin(O*2.2),o0=k0(v,.8+.5*O),h0=A.v(l*r0-S*e0,t0,S*r0+l*e0,{aCol:o0,aK:[.1*O,1,.2],aUv:[-1,O]}),i0=A.v(l*r0+S*e0,t0,S*r0-l*e0,{aCol:o0,aK:[.1*O,1,.2],aUv:[1,O]});Z>0&&A.quad(Q[0],Q[1],i0,h0),Q[0]=h0,Q[1]=i0}}return A.geometry()}function An(a){const v=y0(Pe),A=8,q=2,N=[];for(let M=0;M<=q;M++){const i=M/q*Math.PI*.5,d=[];for(let h=0;h<=A;h++){const f=h/A*Math.PI*2,u=1+.16*Math.sin(h*2+M);d.push(v.v(Math.sin(i)*Math.cos(f)*u,Math.cos(i)*.55-.08,Math.sin(i)*Math.sin(f)*u,{aCol:k0(a,.8+.3*Math.cos(i)),aK:[0,6,0],aUv:[0,0]}))}N.push(d)}for(let M=0;M<q;M++)for(let i=0;i<A;i++)v.quad(N[M][i],N[M+1][i],N[M+1][i+1],N[M][i+1]);return v.geometry()}const yt={aCol:3,aB:4};function Bn(a){const v=y0(yt),A=a.sides||10,q=(d,h,f,u,l,S=1,L=0,Q)=>({z:d,rx:h,ry:Q??h*.94,yc:L,a:{aCol:f,aB:[l,l,u,S]}}),N=a.abdomen.map(([d,h,f],u)=>q(d,h,f,1,u/(a.abdomen.length-1),a.bands,-.02-.09*(u/(a.abdomen.length-1))));ye(v,N,A),ye(v,a.thorax.map(([d,h])=>q(d,h,a.fur,2,0,0,.03)),A),ye(v,a.head.map(([d,h,f])=>q(d,h,a.headCol,0,0,0,-.02,f)),8);const M=a.head[1][0],i=a.head[1][1];for(const d of[-1,1])ye(v,[[M-.05,.03],[M,.07],[M+.06,.06],[M+.1,.02]].map(([h,f])=>({z:h,rx:f*.7,ry:f*1.25,xc:d*i*.82,yc:.02,a:{aCol:a.eye,aB:[0,0,4,0]}})),6),G0(v,[s(d*.05,.05,M+.08),s(d*.11,.13,M+.2),s(d*.18,.05,M+.4)],()=>.02,3,()=>({aCol:a.legs,aB:[0,0,0,0]})),a.legZ.forEach((h,f)=>{const u=a.legLen*(1+.25*f),l=a.dangle;G0(v,[s(d*.09,-.12,h),s(d*(.2+.03*f),-.25-l*.3,h-.08*u),s(d*(.17+.03*f),-.3-l,h-.42*u),s(d*.15,-.27-l*1.25,h-.72*u)],S=>.034-.014*S,3,()=>({aCol:a.legs,aB:[0,0,0,0]})),a.pollen&&f===2&&ye(v,[[-.07,.02],[-.03,.065],[.03,.065],[.07,.02]].map(([S,L])=>({z:h-.42*u+S,rx:L,ry:L*1.2,xc:d*.235,yc:-.3-l,a:{aCol:a.pollen,aB:[0,0,2,0]}})),6)});return v.geometry()}function Nn(){const a=y0({aP:1}),v=(q,N,M,i,d)=>{const h=[];for(const[f,u,l]of q){h.push(a.count());for(let S=0;S<M;S++){const L=S*2*Math.PI/M+.3;a.v(Math.sin(L)*u,l+Math.cos(L)*u*.92,f,{aP:[N]})}}for(let f=0;f<q.length-1;f++)for(let u=0;u<M;u++)a.quad(h[f]+u,h[f+1]+u,h[f+1]+(u+1)%M,h[f]+(u+1)%M);if(i!==void 0){const f=a.v(0,q[0][2]-.02,i,{aP:[N]});for(let u=0;u<M;u++)a.tri(h[0]+(u+1)%M,h[0]+u,f)}if(d!==void 0){const f=q.length-1,u=a.v(0,q[f][2]-.02,d,{aP:[N]});for(let l=0;l<M;l++)a.tri(h[f]+l,h[f]+(l+1)%M,u)}};v([[-.63,.075,-.1],[-.55,.14,-.091],[-.44,.195,-.077],[-.3,.22,-.057],[-.14,.2,-.035],[.02,.1,-.005]],0,10,-.7),v([[.05,.11,.02],[.12,.19,.027],[.24,.215,.03],[.36,.125,.02]],1,8),v([[.375,.1,0],[.43,.15,-.008],[.5,.135,-.012]],1,6,void 0,.57);const A=(q,N,M)=>{let i=null;q.forEach((d,h)=>{const f=M*(1-.4*h/(q.length-1)),u=a.v(N*(d[0]-f),d[1]-f*.7,d[2],{aP:[4]}),l=a.v(N*(d[0]+f),d[1]+f*.7,d[2],{aP:[4]});i&&a.quad(i[0],i[1],l,u),i=[u,l]})};for(const q of[-1,1]){A([[.1,-.14,.14],[.2,-.3,-.02],[.175,-.41,-.3],[.14,-.4,-.55]],q,.026),A([[.11,-.15,.22],[.22,-.29,.1],[.2,-.37,-.12]],q,.022);const N=[[.07,.17,.22],[.44,.36,.2],[.48,.2,-.05],[.3,.07,-.2]].map(u=>a.v(u[0]*q,u[1],u[2],{aP:[2]}));a.tri(N[0],N[1],N[2]),a.tri(N[0],N[2],N[3]);const M=[.185*q,-.38,-.17],i=.07,d=a.v(M[0],M[1]+i*1.3,M[2],{aP:[3]}),h=a.v(M[0],M[1]-i*1.3,M[2],{aP:[3]}),f=[];for(let u=0;u<4;u++){const l=u*Math.PI/2+.6;f.push(a.v(M[0]+Math.cos(l)*i,M[1],M[2]+Math.sin(l)*i*1.4,{aP:[3]}))}for(let u=0;u<4;u++)a.tri(d,f[u],f[(u+1)%4]),a.tri(h,f[(u+1)%4],f[u])}return a.geometry()}function Pn(a){const v=y0({aP:1}),A=a?[[-.46,.17,-.08,0],[-.06,.215,-.03,0],[.38,.15,.01,1]]:[[-.5,.15,-.085,0],[-.28,.22,-.055,0],[-.03,.1,-.01,0],[.2,.215,.03,1],[.4,.125,.01,1]],q=[],N=a?4:5;for(const[h,f,u,l]of A){q.push(v.count());for(let S=0;S<N;S++){const L=S*2*Math.PI/N+.3;v.v(Math.sin(L)*f,u+Math.cos(L)*f*.92,h,{aP:[l]})}}for(let h=0;h<A.length-1;h++)for(let f=0;f<N;f++)v.quad(q[h]+f,q[h+1]+f,q[h+1]+(f+1)%N,q[h]+(f+1)%N);const M=v.v(0,-.11,-.69,{aP:[0]}),i=v.v(0,-.01,.57,{aP:[1]}),d=A.length-1;for(let h=0;h<N;h++)v.tri(q[0]+(h+1)%N,q[0]+h,M),v.tri(q[d]+h,q[d]+(h+1)%N,i);return v.geometry()}function Vn(){const a=y0({aP:1}),v=6,A=(q,N,M,i)=>{const d=[];for(const[h,f,u]of q){d.push(a.count());for(let l=0;l<v;l++){const S=l*2*Math.PI/v+.3;a.v(Math.sin(S)*f,u+Math.cos(S)*f*.92,h,{aP:[N]})}}for(let h=0;h<q.length-1;h++)for(let f=0;f<v;f++)a.quad(d[h]+f,d[h+1]+f,d[h+1]+(f+1)%v,d[h]+(f+1)%v);if(M!==void 0){const h=a.v(0,q[0][2]-.02,M,{aP:[N]});for(let f=0;f<v;f++)a.tri(d[0]+(f+1)%v,d[0]+f,h)}if(i!==void 0){const h=q.length-1,f=a.v(0,q[h][2]-.02,i,{aP:[N]});for(let u=0;u<v;u++)a.tri(d[h]+u,d[h]+(u+1)%v,f)}};A([[-.56,.12,-.09],[-.36,.225,-.065],[-.13,.2,-.032],[.02,.1,-.005]],0,-.7),A([[.05,.12,.02],[.2,.22,.03],[.36,.13,.02]],1),A([[.385,.11,0],[.46,.15,-.008]],1,void 0,.56);for(const q of[-1,1]){const N=[[.05,.15,.22],[.5,.4,.27],[.7,.33,.08],[.62,.2,-.2],[.26,.09,-.26]].map(M=>a.v(M[0]*q,M[1],M[2],{aP:[2]}));for(let M=1;M<4;M++)a.tri(N[0],N[M],N[M+1])}return a.geometry()}function Os(){const a=Vn(),v=Array.from(a.attributes.position.array),A=Array.from(a.attributes.aP.array),q=Array.from(a.index.array);for(const M of[-1,1]){const i=v.length/3,d=.175*M,h=-.26,f=-.16,u=.085;v.push(d,h+u*1.25,f+u*.3,d+u*M,h-u*.8,f+u*1.2,d-u*.9*M,h-u*.8,f+u*.2,d+u*.2*M,h-u*.6,f-u*1.5),A.push(3,3,3,3),q.push(i,i+1,i+2,i,i+2,i+3,i,i+3,i+1,i+1,i+3,i+2)}const N=new D.BufferGeometry;return N.setAttribute("position",new D.Float32BufferAttribute(v,3)),N.setAttribute("aP",new D.Float32BufferAttribute(A,1)),N.setIndex(q),N.computeVertexNormals(),N}function Fn(a,v,A,q=-30,N=68){const M=y0({aUv:2}),i=7;for(const d of[-1,1])for(const h of[0,.5]){const f=M.v(d*.05,v,A,{aUv:[0,0]}),u=[];for(let l=0;l<=i;l++){const S=l/i,L=(q+(N-q)*S)*ie;u.push(M.v(d*(.05+Math.cos(L)*a),v+Math.sin(L)*a,A-h*a*(.5+.3*Math.sin(L)),{aUv:[1,S*2-1]}))}for(let l=0;l<i;l++)M.tri(f,u[l],u[l+1])}return M.geometry()}function qn(a){const v=y0(yt),A=(l,S,L,Q,Z)=>({z:l,rx:S,ry:L,yc:Q,a:{aCol:Z,aB:[0,0,5,0]}}),q=v.count();ye(v,[A(-9.6,.3,.2,.42,a.top),A(-7.4,.95,.6,.36,a.top),A(-4.6,1.6,1.2,.2,a.top),A(-1.5,2.3,1.9,0,a.top),A(2.5,3.1,2.7,-.2,a.top),A(6,2.5,2.3,0,a.top),A(8.4,1.45,1.35,.4,a.head),A(9.6,1.55,1.45,.62,a.head),A(10.8,1.72,1.6,.85,a.head),A(11.9,1.3,1.25,.8,a.head),A(12.7,.7,.72,.55,a.cere),A(13.3,.4,.5,.25,a.beak),A(13.95,.07,.12,-.5,a.beak)],10);for(let l=q;l<v.count();l++){const S=v.pos[l*3+1],L=v.pos[l*3+2];S<.35&&L<8&&(v.att.aCol[l*3]=a.pale[0]*1,v.att.aCol[l*3+1]=a.pale[1]*1,v.att.aCol[l*3+2]=a.pale[2]*1)}for(const l of[-1,1])ye(v,[[10.75,.06],[11.1,.3],[11.45,.06]].map(([S,L])=>({z:S,rx:L*.5,ry:L,xc:l*1.58,yc:1.05,a:{aCol:[.9,.62,.05],aB:[0,0,4,0]}})),6),ye(v,[[-6.6,.1],[-5.9,.38],[-4.6,.42],[-3.6,.2]].map(([S,L])=>({z:S,rx:L,ry:L*.8,xc:l*.75,yc:-1.05+.1*(S+5),a:{aCol:[.8,.56,.08],aB:[0,0,6,0]}})),6);for(let l=0;l<11;l++){const S=l/5-1,L=S*.7,Q=14.5*(1-.13*S*S),Z=Math.sin(L),O=Math.cos(L),r0=[];for(let e0=0;e0<=3;e0++){const t0=e0/3,o0=(e0===0?.3:e0===3?.8:1.15)*(1-.15*Math.abs(S)),h0=Z*Q*t0,i0=-5.6-O*Q*t0,U0=.5-.5*t0-1.9*t0*t0-1.7*S*S*t0+.07*(l&1),d0=v.v(h0-O*o0,U0+.16*o0,i0-Z*o0,{aCol:a.top,aB:[0,.16+.8*t0,3,1]}),A0=v.v(h0+O*o0,U0-.16*o0,i0+Z*o0,{aCol:a.top,aB:[0,.16+.8*t0,3,1]});e0>0&&v.quad(r0[0],r0[1],A0,d0),r0[0]=d0,r0[1]=A0}}const N=25.6,M=2.4,i=12,d=4,h=.7,f=l=>5.2+2.2*Math.sin(l*2.3)-2.6*l*l,u=l=>10.2-1.6*l-1.2*l*l;for(const l of[-1,1]){const S=(Z,O,r0,e0)=>{l>0?v.quad(Z,e0,r0,O):v.quad(Z,O,r0,e0)},L=[];for(let Z=0;Z<=i;Z++){const O=Z/i*h,r0=[];for(let e0=0;e0<=d;e0++){const t0=e0/d;r0.push(v.v(l*(M+O*N),.7+.5*Math.sin(t0*3.1)*(1-O),f(O)-u(O)*t0,{aCol:a.top,aB:[O,t0,3,l]}))}L.push(r0)}for(let Z=0;Z<i;Z++)for(let O=0;O<d;O++)S(L[Z][O],L[Z][O+1],L[Z+1][O+1],L[Z+1][O]);for(let Z=0;Z<6;Z++){const O=Z/6*.62,r0=O+.085,e0=.5-Z*.26,t0=N*(.3-.012*Z*Z),o0=[];for(let h0=0;h0<=4;h0++){const i0=h0/4,U0=h+(1-h)*i0,d0=(r0-O)*u(h)*(1-.55*i0*i0),A0=f(h)-u(h)*(O+r0)/2+Math.sin(e0)*t0*i0*.75,l0=M+h*N+Math.cos(e0*.6)*t0*i0,be=v.v(l*l0,.7+.35*i0,A0+d0/2,{aCol:a.top,aB:[U0,O,3,l]}),w0=v.v(l*l0,.7+.35*i0,A0-d0/2,{aCol:a.top,aB:[U0,r0+.1,3,l]});h0>0&&S(o0[0],o0[1],w0,be),o0[0]=be,o0[1]=w0}}const Q=[];for(let Z=0;Z<=3;Z++){const O=Z/3,r0=h+.2*O,e0=M+r0*N,t0=f(h)-u(h)*(.62+.06*O),o0=f(h)-u(h)*(1-.3*O*O),h0=v.v(l*e0,.7,t0+.6*O,{aCol:a.top,aB:[r0,.62,3,l]}),i0=v.v(l*e0,.7,o0+2.2*O,{aCol:a.top,aB:[r0,1,3,l]});Z>0&&S(Q[0],Q[1],i0,h0),Q[0]=h0,Q[1]=i0}}return v.geometry()}function $s(){const a=y0(yt),v=[.2,.19,.12],A=[.5,.48,.4],q=[.85,.6,.06],N=(i,d,h,f,u)=>({z:i,rx:d,ry:h,yc:f,a:{aCol:u,aB:[0,0,2,0]}});ye(a,[N(-2.6,.25,.2,1.3,v),N(-1.6,.8,.75,1.6,q),N(-.3,1.25,1.2,2,v),N(1,1.15,1.1,2.4,v),N(1.9,.75,.8,3,v),N(2.5,.72,.72,3.3,v),N(3,.4,.4,3.25,q),N(3.6,.05,.07,3.1,[.08,.07,.06])],8);for(let i=0;i<a.count();i++){const d=a.pos[i*3+1],h=a.pos[i*3+2];d<1.5+.35*h&&h>-1.2&&h<2.6&&(a.att.aCol[i*3]=A[0],a.att.aCol[i*3+1]=A[1],a.att.aCol[i*3+2]=A[2])}const M=(i,d,h,f,u,l)=>{const S=a.v(i.x-u*h,i.y,i.z,{aCol:l,aB:[0,0,0,0]}),L=a.v(i.x+u*h,i.y,i.z,{aCol:l,aB:[0,0,0,0]}),Q=a.v(d.x-u*f,d.y,d.z,{aCol:l,aB:[0,0,0,0]}),Z=a.v(d.x+u*f,d.y,d.z,{aCol:l,aB:[0,0,0,0]});a.quad(S,L,Z,Q)};M(s(0,1.45,-2.2),s(0,.75,-5.2),.5,.75,1,[.12,.11,.08]);for(const i of[-1,1]){M(s(i*1.2,2.3,.6),s(i*.8,1.5,-3.2),0,0,1,v);const d=a.v(i*1.22,2.9,.9,{aCol:v,aB:[0,0,0,0]}),h=a.v(i*1.3,1.5,.4,{aCol:[.1,.1,.08],aB:[0,0,0,0]}),f=a.v(i*.7,1.35,-3.4,{aCol:[.1,.1,.08],aB:[0,0,0,0]}),u=a.v(i*.95,2.5,-1.6,{aCol:v,aB:[0,0,0,0]});a.quad(d,h,f,u),ye(a,[[2.35,.03],[2.5,.13],[2.65,.03]].map(([l,S])=>({z:l,rx:S*.5,ry:S,xc:i*.66,yc:3.45,a:{aCol:[.02,.02,.02],aB:[0,0,4,0]}})),5),G0(a,[s(i*.4,1,.2),s(i*.45,.3,.4),s(i*.45,0,.9)],()=>.09,3,()=>({aCol:[.1,.09,.08],aB:[0,0,0,0]}))}return a.geometry()}function Hs(){const a=y0(yt),v=[[0,0,0],[.03,.045,-.07],[.063,.082,-.14],[.128,.11,-.2],[.2,.121,-.25],[.27,.12,-.3],[.335,.106,-.34],[.385,.08,-.365]].map(i=>s(i[0],i[1],i[2])),A=new D.CatmullRomCurve3(v,!1,"centripetal"),q=A.getPoints(44);G0(a,q,i=>1.25*(i<.24?.0115:.0098-.0036*i)*(1+.1*Math.sin(Math.max(0,i-.24)*14*6.2832+1.57)*(i<.24?0:1)),8,(i,d)=>({aCol:i<.24?[.15,.088,.04]:[.25-.05*i,.15-.035*i,.063-.014*i],aB:[i,d,0,0]}));const N=a.v(q[44].x,q[44].y,q[44].z,{aCol:[.17,.1,.045],aB:[1,0,0,0]}),M=a.count()-1-9;for(let i=0;i<8;i++)a.tri(N,M+i,M+i+1);return a.geometry()}const lo={RX:.47,RY:.25,RZ:.3};async function Zs(a,v){const{RX:A,RY:q,RZ:N}=lo,M=36,i=10,d=s(0,.83,1),h=s(0,0,0),f=s(0,0,0),u=s(0,0,0),l=s(0,0,0),S=s(0,0,0),L=[.46,.245,.045],Q=(e0,t0)=>{const o0=P0(1-Math.abs(t0)/.075,0,1)*P0(1.15-Math.pow(Math.abs(e0)/.36,2),0,1);return o0*o0*(3-2*o0)},Z=y0(yt);for(let e0=0;e0<=i;e0++)for(let t0=0;t0<=M;t0++){const o0=(.06+.94*e0/i)*Math.PI/2,h0=t0/M*Math.PI*2,i0=Math.cos(o0)*Math.cos(h0),U0=Math.cos(o0)*Math.sin(h0),d0=Math.sin(o0);Z.v(i0*A,d0*q,U0*N,{aCol:L,aB:[e0/i,t0/M,1,.8*Q(i0*A,U0*N)]})}for(let e0=0;e0<i;e0++)for(let t0=0;t0<M;t0++){const o0=e0*(M+1)+t0,h0=o0+M+1;Z.quad(o0,o0+1,h0+1,h0)}const O=y0(yt);for(let e0=0;e0<5200;e0++){const t0=Math.asin(v.range(.3,1)),o0=v.range(0,6.2832),h0=Math.cos(t0)*Math.cos(o0),i0=Math.cos(t0)*Math.sin(o0),U0=Math.sin(t0);if(i0*N>.12)continue;l.set(h0*A,U0*q,i0*N),h.set(h0/A,U0/q,i0/N).normalize();const d0=v.range(.026,.052),A0=v.range(.8,1.2),l0=Q(l.x,l.z),be=v(),w0=v(),we=be<.8*l0?.3:w0<.1?.62:1;f.copy(h).multiplyScalar(.75).add(S.set(v.range(-.25,.25),.3,.42+v.range(-.15,.15))).normalize(),u.subVectors(d,l).cross(f).normalize().multiplyScalar(v.range(.005,.008));const Ve=[L[0]*A0*we,L[1]*A0*we,L[2]*A0*we];l.addScaledVector(h,-.004),S.copy(l).addScaledVector(f,d0);const oe=O.v(l.x-u.x,l.y-u.y,l.z-u.z,{aCol:Ve,aB:[0,0,2,0]}),x0=O.v(l.x+u.x,l.y+u.y,l.z+u.z,{aCol:Ve,aB:[0,1,2,0]}),Q0=O.v(S.x+u.x*.45,S.y+u.y*.45,S.z+u.z*.45,{aCol:Ve,aB:[1,1,2,0]}),v0=O.v(S.x-u.x*.45,S.y-u.y*.45,S.z-u.z*.45,{aCol:Ve,aB:[1,0,2,0]});O.quad(oe,x0,Q0,v0),(e0&1023)===1023&&await a.yield()}const r0=Z.geometry();return await a.yield(),{skin:r0,fur:O.geometry()}}var or={id:"honey-cliff",name:"The Honey Cliff",category:"wilderness",weirdness:.05,media:["air","tiny"],async build(a){const v=a.rng,A=a.noise,q=a.quality?.detail??1,N=a.vary||{},M=v.fork("visit"),i=new D.Scene,d=(e,t,o)=>q0(e,t,o),h=typeof a.seed=="number"?a.seed:Dt(String(a.seed));let f=["autumn","dawn","sea","clear","rain"][Math.abs(Math.floor(h))%5];N.hour==="dawn"||N.hour==="golden"||N.hour==="night"?f="dawn":N.hour==="day"&&f==="dawn"&&(f="clear");const u=f==="dawn",l=f==="autumn",S=f==="rain",L=f==="sea",Q=M.chance(.7),Z=M.chance(.5),O=!!N.rare,r0=N.density??1,e0=M.range(-5,5)*ie,t0=M.fork("layout"),o0=(u?s(-.33,.21,.92):s(-.29,.53,.8)).applyAxisAngle(s(0,1,0),e0).normalize(),h0=f0(u?"#d8b3ad":L?"#b3c7e3":S?"#aebfd4":l?"#c3d2e2":"#b6cde9"),i0=Fs({rng:v,preset:u?"dawn":"day",sunDirection:o0,zenith:u?"#35568f":S?"#3d6187":L?"#27548a":"#2E5C8A",mid:u?"#8f8fb8":S?"#7f9dbd":L?"#6396cf":"#6f9fd0",horizon:u?"#f0c4ae":S?"#c9d6e2":L?"#c3d6ec":"#DCE8F2",ground:h0,clouds:S?{coverage:.52,lit:"#eef0f2",shade:"#8494ab"}:!1,clouds2:{opacity:u?.5:.3,coverage:.45,lit:u?"#ffd0b8":"#ffffff"}});i.add(i0.object),await a.yield(),i.fog=new D.FogExp2(h0.clone().multiplyScalar(.92),u?36e-5:S?43e-5:33e-5);const U0=qs(i0,{intensity:.9});i.add(U0.object),await a.yield();const d0=await Us(a,{palette:["#D01F2B","#2E5C8A","#b78658","#F2A51E","#1E1712","#EADBA8","#DCE8F2"],sunDir:o0.toArray(),hour:u?"dawn":"morning",season:l?"autumn":"spring",weather:S?"rain":"clear",sunColor:u?"#ffd2b4":"#fff3df",sunIntensity:u?2:S?2.15:2.5,skyColor:u?"#7f8bc6":"#7b9fca",skyIntensity:u?.7:.62,bounceColor:u?"#a895b4":"#93a4c2"});i.add(d0.object);const A0=d0.uniforms,l0=d0.anchors;A0.uBeeDark.value.multiplyScalar(.85),S&&(A0.uCalm.value=.3),await a.yield();const be={uSunDir:A0.uSunDir,uSunCol:A0.uSunCol,uSkyCol:A0.uSkyCol,uBounceCol:A0.uBounceCol,uHazeCol:{value:h0},uTime:{value:0},uAir:{value:new D.Vector4(L?95e-5:.001,u?.6:1,S?1:0,450)},uSea:A0.uSea};L&&A0.uSea.value.set(.8,.84,.9,.9);const w0=(e,t,o={},n={})=>new D.ShaderMaterial({uniforms:{...D.UniformsUtils.clone(D.UniformsLib.fog),...be,...o},vertexShader:e,fragmentShader:t,side:D.DoubleSide,fog:!0,...n}),we=f0(Re[5]),Ve=f0(Re[4]).multiplyScalar(1.5).add(new D.Color(.006,.0045,.004)),oe=l0.flyThrough,x0=s(l0.entry.d0[0],0,l0.entry.d0[1]).normalize(),Q0=s(-x0.z,0,x0.x),v0=s(0,1,0),Xe=180,R0=s(l0.entry.S[0],Xe,l0.entry.S[1]),Rt=(e,t)=>s(R0.x+x0.x*e,t,R0.z+x0.z*e),aa=[Rt(0,Xe),Rt(35,Xe),Rt(70,Xe),Rt(104,Xe)];for(let e=0;e<oe.length;e++)aa.push(oe[e].clone());const u0=Vs(aa,{samples:640});await a.yield();const S0=u0.length,B0=P0(Math.round(S0/28),42,50),O0=s(0,0,0),M0=s(0,0,0),bt=(e,t,o)=>{for(let n=t;n<=1;n+=5e-4)if(u0.pointAt(n,O0),(O0.x-e)*o>=0)return n;return 1},xe=(e,t)=>{let o=1/0,n=t;for(let y=t;y<=1;y+=5e-4){const m=u0.pointAt(y,O0).distanceToSquared(e);m<o&&(o=m,n=y)}return n},Ke=l0.route,Me=xe(oe[Ke.comb6],0),Ie=xe(oe[Ke.tiers],Me),ne=xe(oe[Ke.far],Ie);await a.yield();const Je=xe(oe[Ke.pass],ne),Tt=e=>Je+(e-.626)*1499.87/S0,ce=Tt(.5914);await a.yield();const de=[0,1,2,3,4,5].map(e=>bt(l0.combs[e].center.x,ce,-1));await a.yield();const wt=xe(l0.tear.position,de[4]),io=xe(l0.cleftMouth,wt),xt=bt(-3,de[2],-1),Ee=bt(-78,de[3],-1),D0=bt(-104,Ee,-1),Qe=(e,t,o,n=s(0,0,0))=>n.copy(R0).addScaledVector(x0,e).addScaledVector(Q0,Math.sin(t*ie)*o).addScaledVector(v0,Math.cos(t*ie)*o),co=l0.combs[3].center.x,uo=l0.combs[4].center,oa=(e,t,o)=>({u:e-Math.max(.5,Math.abs(u0.pointAt(e,O0).x-t-o)/45)/B0,x:o,y:194}),Ge=[oa(Tt(.7),12,co),{u:D0-.75/B0,x:uo.x+10,y:190},{u:D0+1.1/B0,x:uo.x-8,y:183},{u:wt-1.6/B0,x:l0.tear.position.x,y:l0.tear.position.y},oa(Tt(.735),4,co),oa(de[1]-.03,16,l0.combs[2].center.x)];d0.setSchedule(Ge,B0),d0.setProgress(0),await a.yield();const Mt={least:1/0,what:"",hero:d0.clearance};i.userData.clearance=Mt;const na=[],sa=new D.Box3;for(let e=0;e<=420;e++){const t=u0.pointAt(e/420);na.push(t),sa.expandByPoint(t)}sa.expandByScalar(8);const zt=async(e,t,o=0)=>{const n=e.attributes.position.array,y=e.index.array,m=new D.Triangle,C=s(0,0,0),k=new D.Box3;let U=1/0;for(let g=0;g<y.length;g+=3)if((g/3&15)===15&&await a.yield(),m.a.fromArray(n,y[g]*3),m.b.fromArray(n,y[g+1]*3),m.c.fromArray(n,y[g+2]*3),k.makeEmpty(),k.expandByPoint(m.a),k.expandByPoint(m.b),k.expandByPoint(m.c),!!k.intersectsBox(sa)){k.expandByScalar(8);for(let p=o;p<na.length;p++){const z=na[p];if(!k.containsPoint(z))continue;m.closestPointToPoint(z,C);const V=C.distanceTo(z);V<U&&(U=V)}}Mt[t]=Math.round(U*10)/10,U<Mt.least&&(Mt.least=U,Mt.what=t),U<5.5&&console.warn("honey-cliff: "+t+" is "+U.toFixed(1)+" m from the camera line")},Wt=d0.rockMaterial([h0.r*.94,h0.g*.94,h0.b*.94,L?.001:.0011]);{const e=(r,c)=>{const b=d0.profileAt(P0(r,-330,330)),x=b[b.length-1];if(c<=b[0][1])return b[0][0]+(b[0][1]-c)*.5;if(c>=x[1])return x[0]-(c-x[1])*.42;for(let F=0;F<b.length-1;F++)if(c<=b[F+1][1])return b0(b[F][0],b[F+1][0],(c-b[F][1])/Math.max(.001,b[F+1][1]-b[F][1]));return x[0]},t=[0,0,0,0],o=[],n=new Map,y=r=>{const c=Math.round(P0(r,-70,300)*4);let b=n.get(c);return b===void 0&&(b=d0.wallPoint(330,c/4,o)[2],n.set(c,b)),b},m=(r,c)=>{if(r<326&&Math.abs(r)<=330.5&&c>=-70.5&&c<=300.5)return-150;const b=Math.max(0,Math.abs(r)-330),x=c<-70?-70-c:c>300?c-300:0,F=Math.hypot(b,x),H=c>300&&b===0?-8:16+10*d(222,262,c)+8*d(100,55,c),j=d(0,260,F)*(c<-70?.45:1),_=.9*d0.bedDisp(r,c,t)[0]*d(2,30,F)*(1-d(500,1100,F)),T=d0.zBack(r)+e(r,c)+H-.42*Math.min(b,700)*d(0,120,b)-.12*Math.max(0,b-700)+j*(130*A.fbm2(r/700+5,c/520,4)+55*(A.ridged2(r/240+3,c/900,3)-.45))+9*A.n2(r/60,c/45)*d(0,40,F)+_;if(r<326)return T;const $=(1-d(5,70,b))*(1-d(0,30,x));return b0(T,y(c)+(r<331?-5.5+(r-327)*2.33:2.5),$)},C=[],k=[],U=[336],g=[306],p=[-76];for(let r=336,c=5;r<2900;c*=1.13)r+=c,U.push(r);for(let r=306,c=10;r<1500;c*=1.25)r+=c,g.push(r);for(let r=-76,c=12;r>-1150;c*=1.3)r-=c,p.push(r);for(let r=U.length-1;r>=0;r--)C.push(-U[r]);C.push(-330,-220,-110,0,110,220,322,327,330,...U);for(let r=p.length-1;r>=0;r--)k.push(p[r]);for(let r=-70;r<=300.01;r+=370/50)k.push(r);k.push(...g);const z=y0({color:3});for(let r=0;r<C.length;r++){const c=C[r],b=.75+.5*A.fbm2(c/500+9,.3,3);for(let x=0;x<k.length;x++){const F=k[x],H=F>306?306+(F-306)*b:F;z.v(c,H,m(c,F),{color:[.5+.5*A.fbm2(c*.008+3,H*.012,3),.5+.5*A.n2(c*.05,H*.012+9),0]})}r&1&&await a.yield()}const V=k.length;for(let r=0;r<C.length-1;r++)for(let c=0;c<V-1;c++){const b=r*V+c,x=b+V;z.quad(b,x,x+1,b+1)}const R=z.geometry();await a.yield();const W=new D.Mesh(R,Wt);W.frustumCulled=!1,i.add(W),await zt(R,"massif");const P=y0({color:3}),Y=132,B=[];for(let r=0;r<=Y;r++){const c=-330+660*r/Y;d0.wallPoint(c,299.6,B);const b=.5+.5*A.fbm2(c*.008+3,3.6,3),x={color:[b,.5,0]};P.v(c,B[1]-1.2,B[2]-1.5,x),P.v(c,B[1]+10+3*A.n2(c*.05,1.5),B[2]-13,x),P.v(c,B[1]+46,B[2]-44,x),(r&31)===31&&await a.yield()}for(let r=0;r<Y;r++)for(let c=0;c<2;c++){const b=r*3+c,x=b+3;P.quad(b,x,x+1,b+1)}i.add(new D.Mesh(P.geometry(),Wt))}await a.yield();const Dn=t0.range(0,6.28),Ln=t0.range(0,6.28),ra=e=>1300+240*Math.sin(e/1100+Dn)+110*Math.sin(e/420+Ln),Un=e=>-1790+.03*e+.1*(Math.hypot(e-600,300)+e-600),fo=(e,t)=>{const o=ra(e),n=Un(e),y=t-o,m=Math.abs(y);let C=y<0?b0(-240,n,Math.pow(P0((t-26)/(o-26),0,1),.9)):n+2900*(1-Math.exp(-y/1500));return t<26&&(C+=(26-t)*1.2),C+=d(60,700,m)*(260*A.fbm2(e/1e3+2,t/1e3,4)+120*(A.ridged2(e/520,t/700+6,3)-.5))+40*A.n2(e/230,t/230)*d(90,400,m),Math.max(C,n-3)},Rn=f0(l?"#3d451a":"#132b19"),Tn=f0(l?"#8f7a1f":"#3a5a27"),et={uLeafA:{value:Rn},uLeafB:{value:Tn},uFleckCol:{value:f0(l?"#c8872a":Re[0]).multiplyScalar(l?.8:.85)},uRock:{value:f0(Re[2]).multiplyScalar(.8)},uFleck:{value:s(l?.5:.64,l?.6:.62,L||S?.55:.4)},uSpur:{value:0},uSlope:{value:0}};let ho=null,vo=null;{const n=y0({aRiver:1});for(let C=0;C<=92;C++){const k=200+5200*Math.sinh(2.6*(C/92*2-1))/Math.sinh(2.6);for(let U=0;U<=82;U++){const g=U<12?-760+800*U/12:40+5300*(Math.exp(2.4*(U-12)/70)-1)/(Math.exp(2.4)-1);n.v(k,fo(k,g),g,{aRiver:[g-ra(k)]})}(C&7)===7&&await a.yield()}for(let C=0;C<92;C++)for(let k=0;k<82;k++){const U=C*83+k,g=U+82+1;n.quad(U,U+1,g+1,g)}const y=n.geometry();await a.yield(),ho=w0(bn,xn,et);const m=new D.Mesh(y,ho);m.frustumCulled=!1,i.add(m)}await a.yield();const ee=(e,t,o,n=4)=>{const y=Math.max(1,o.length),m=new D.InstancedMesh(e,t,y),C=new Float32Array(y);return m.count=o.length,o.forEach((k,U)=>{m.setMatrixAt(U,k.m),C[U]=k.seed}),e.setAttribute("iSeed",new D.InstancedBufferAttribute(C,1)),m.instanceMatrix.needsUpdate=!0,m.computeBoundingSphere(),m.boundingSphere&&(m.boundingSphere.radius+=n),i.add(m),m},la=(e,t,o,n,y,m=y,C=y)=>new D.Matrix4().set(t.x*y,o.x*m,n.x*C,e.x,t.y*y,o.y*m,n.y*C,e.y,t.z*y,o.z*m,n.z*C,e.z,0,0,0,1),T0=(e,t,o,n=o,y=o,m=0)=>{const C=Math.cos(t),k=Math.sin(t),U=s(C,0,-k),g=s(k*m,1,C*m).normalize(),p=s(0,0,0).crossVectors(U,g);return la(e,U,g,p,o,n,y)};{const e=[],t=Math.round(225*q),o=v.fork("crowns");for(let n=0;n<t*3&&e.length<t;n++){const y=o.range(-2300,3600),m=430+2500*Math.pow(o(),1.25);if(Math.abs(m-ra(y))<130)continue;const C=o.range(62,118)*(1+m/2600),k=fo(y,m);e.push({m:T0(s(y,k+C*.28,m),o.range(0,6.28),C,C*o.range(.6,.85),C*o.range(.85,1.15)),seed:o()}),(n&127)===127&&await a.yield()}vo=w0(to,ao,{...et,uOwn:{value:new D.Vector4(1,1,0,1)}},{side:D.FrontSide}),ee(new D.IcosahedronGeometry(1,1),vo,e,60)}await a.yield();{const e=y0({aL:1}),t=310,o=8,n=-62*ie,y=242*ie,m=v.fork("range"),C=[{R:4250,W:1150,lo:260,hi:820,base:-900,k:3.1},{R:4900,W:1050,lo:620,hi:1560,base:-350,k:2.3},{R:5600,W:950,lo:1150,hi:2450,base:150,k:1.7}];for(let p=0;p<3;p++){const z=C[p],V=m.range(0,50),R=e.count();for(let W=0;W<=t;W++){const P=b0(n,y,W/t),Y=Math.cos(P),B=Math.sin(P),r=.5+.5*Math.pow(.5+.5*Math.cos(P-.3),1.4),c=Math.pow(P0(A.ridged2(P*z.k+V,p*7.3,4)*1.7,0,1),1.5)*.8+.2*(.5+.5*A.n2(P*z.k*.6+V,3.3)),b=b0(z.lo,z.hi,c*r)+60*A.n2(P*23+V,p);for(let x=0;x<=o;x++){const F=x/o,H=A.ridged2(P*z.k*4.6+V*2,F*1.3+p*5,3),j=Math.min(1,F*3),_=z.base+(b-z.base)*Math.pow(1-F,1.25)*(.76+.24*H*(.2+.8*j))/(.76+.24*.2*.5),T=z.R-z.W*F-170*(H-.45)*Math.sin(Math.PI*Math.min(1,F*1.15));e.v(Y*T,_,B*T,{aL:[p]})}(W&63)===63&&await a.yield()}for(let W=0;W<t;W++)for(let P=0;P<o;P++){const Y=R+W*(o+1)+P,B=Y+o+1;e.quad(Y,Y+1,B+1,B)}}const k=e.geometry();await a.yield();const U=f0(u?"#f0c4ae":S?"#c9d6e2":L?"#c3d6ec":"#DCE8F2"),g=new D.Mesh(k,new D.ShaderMaterial({uniforms:{...be,uRangeHaze:{value:h0.clone().lerp(U,.55).multiplyScalar(u?.86:.9)},uRange:{value:new D.Vector4(.95,u?.36:S?.52:L?.2:.28,.07,l?760:560)}},vertexShader:Rs,fragmentShader:Ts,side:D.DoubleSide,fog:!1}));g.frustumCulled=!1,i.add(g)}await a.yield();const ze=w0(Ws,js,{uSilver:{value:f0("#8f8d74")},uSpot:{value:f0("#2a0508")}}),se=(e,t)=>{if(e<=t[0][0])return t[0][1];for(let o=1;o<t.length;o++)if(e<=t[o][0])return b0(t[o-1][1],t[o][1],(e-t[o-1][0])/(t[o][0]-t[o-1][0]));return t[t.length-1][1]},po=[],ue=[],jt=[],fe=[],_t=[],ia=f0(l?"#5c5a22":"#3a5320"),mo=f0(l?"#8a6a22":"#2f5a1f"),ca=bt(-226,0,1),da=Me+.02;let ua=null,go=null;const Wn=[[0,0],[.08,1.6],[.16,3.6],[.26,6.5],[.38,10],[.52,16],[.68,27],[.84,48],[1,95]],yo=[[0,0],[.08,.3],[.16,1.4],[.26,5],[.38,16],[.52,42],[.68,95],[.84,200],[1,430]],St=(e,t,o)=>{u0.pointAt(b0(ca,da,e),O0),u0.tangentAt(b0(ca,da,e),M0);const n=-M0.z,y=M0.x,m=Math.hypot(n,y)||1,C=Math.abs(t),k=t<0?-1:1,U=120*Math.pow(d(.15,0,e),1.4)+90*Math.pow(d(.88,1,e),1.4),g=O0.y-14.6-U+1.9*A.n2(e*11,3.3)-1.2*Math.abs(A.n2(e*31,8)),p=se(C,Wn)*(1+.25*A.n2(e*7+k*5,C*3))+3.2*A.fbm2(e*9+20,C*4*k+2,3)*d(.12,.4,C),z=se(C,yo)+1.6*Math.sin(se(C,yo)*.4+e*9)*d(.2,.4,C);return o.set(O0.x+n/m*p*k,g-z,O0.z+y/m*p*k)};{const o=y0({color:3}),n=s(0,0,0);for(let g=0;g<=90;g++){for(let p=0;p<=30;p++){const z=p/30*2-1;St(g/90,Math.sign(z)*Math.pow(Math.abs(z),1.25),n),o.v(n.x,n.y,n.z,{color:[.5+.4*A.n2(n.x*.02,n.y*.02),.5+.5*A.n2(n.x*.05,n.y*.012+9),0]})}(g&3)===3&&await a.yield()}for(let g=0;g<90;g++)for(let p=0;p<30;p++){const z=g*31+p,V=z+30+1;o.quad(z,z+1,V+1,V)}const y=o.geometry();await a.yield(),ua=new D.Mesh(y,Wt),i.add(ua),await zt(y,"fin"),await a.yield();const m=y0(Pe),C=10;for(let g=0;g<=90;g++)for(let p=0;p<=C;p++){const z=p/C*2-1;St(g/90,z*.3,n);const V=.75+.5*A.n2(n.x*.11,n.z*.11+g*.1);m.v(n.x,n.y+.35,n.z,{aCol:k0(ia,V),aK:[0,6,0],aUv:[g<90*.13||g>90*.9?3:z,g/90]})}for(let g=0;g<90;g++)for(let p=0;p<C;p++){const z=g*(C+1)+p,V=z+C+1;m.quad(z,z+1,V+1,V)}go=ee(m.geometry(),ze,[{m:new D.Matrix4,seed:.5}]),await a.yield();const k=v.fork("fin"),U=Math.round(86*P0(r0,.85,1.2));for(let g=0;g<U;g++){const p=.14+.74*(g+k())/U,z=k.range(-.2,.2);St(p,z,n),u0.pointAt(b0(ca,da,p),O0);const V=Math.min(k.range(.82,1.16),(O0.y-6.4-n.y)/7.8);V<.55||_t.push({m:T0(n.clone(),k.range(0,6.28),V,V,V,k.range(-.08,.08)),seed:k()})}for(let g=0;g<60;g++){const p=k.range(.1,.92),z=k.range(-.3,.3);St(p,z,n);const V=4+Math.floor(k()*3),R=k.range(1.3,2.1),W=k.range(0,6.28);for(let P=0;P<V;P++)ue.push({m:T0(n.clone(),W+P*6.283/V+k.range(-.3,.3),R,R,R,k.range(-.5,-.15)),seed:k()});if(g<46){St(k.range(.1,.92),k.range(-.34,.34),n);const P=k.range(1,2.8);fe.push({m:T0(n.clone(),k.range(0,6.28),P,P*k.range(.7,1.2),P),seed:k()})}}for(const g of ue)g.fin=1;for(const g of fe)g.fin=1}await a.yield();let Kt=null;{const e=[[640,-140,400],[600,-60,430],[520,60,470],[430,122,510],[300,108,610],[150,82,720],[-20,40,760],[-200,-40,740],[-380,-220,690]].map(c=>s(c[0],c[1],c[2])),t=new D.CatmullRomCurve3(e,!1,"centripetal"),o=a.core.makeRng(Dt("ridge:"+h)),n=s(0,0,0),y=s(0,0,0),m=s(0,0,0),C=[[0,0],[.1,16],[.25,46],[.45,100],[.7,210],[1,440]],k=[[0,0],[.1,7],[.25,44],[.45,160],[.7,470],[1,1150]],U=(c,b,x)=>{t.getPoint(c,y),t.getTangent(c,m);const F=-m.z,H=m.x,j=Math.hypot(F,H)||1,_=Math.abs(b),T=b<0?-1:1,$=Math.sqrt(Math.max(0,1-d(.86,1,c))),E=(se(_,C)*(1+.3*A.n2(c*6+T*5,_*3+40))+22*A.fbm2(c*8+60,_*4*T+2,3)*d(.1,.4,_))*$,n0=se(_,k)+9*Math.sin(se(_,k)*.05+c*9)*d(.2,.4,_);return x.set(y.x+F/j*E*T,y.y+16*A.n2(c*9,4.4)-n0,y.z+H/j*E*T)},g=44,p=20,z=y0({aRiver:1});for(let c=0;c<=g;c++){for(let b=0;b<=p;b++){const x=b/p*2-1;U(c/g,Math.sign(x)*Math.pow(Math.abs(x),1.3),n),z.v(n.x,n.y,n.z,{aRiver:[9999]})}(c&7)===7&&await a.yield()}for(let c=0;c<g;c++)for(let b=0;b<p;b++){const x=c*(p+1)+b,F=x+p+1;z.quad(x,x+1,F+1,F)}const V=z.geometry();await a.yield();const R=new D.Mesh(V,w0(bn,xn,{...et,uSpur:{value:1}}));R.frustumCulled=!1,i.add(R);const W=[],P=Math.round(120*(.7+.3*q)),Y=s(0,0,0),B=s(0,0,0),r=s(0,0,0);for(let c=0;c<P;c++){const b=.2+.72*(c+o())/P,x=c%3===0?o.range(-.04,.06):o.range(-.16,.44);U(b,x,n);const F=o.range(25,43),H=o.range(0,6.28),j=F*o.range(.5,.72),_=F*o.range(.85,1.15),T=o();U(Math.min(1,b+.012),x,Y),U(Math.max(0,b-.012),x,B),Y.sub(B),U(b,x+.03,B),U(b,x-.03,r),B.sub(r),r.crossVectors(Y,B).normalize(),r.y<0&&r.multiplyScalar(-1),r.lerp(v0,.3).normalize(),Y.set(Math.cos(H),0,-Math.sin(H)),B.crossVectors(Y,r).normalize(),Y.crossVectors(r,B).normalize(),W.push({m:la(s(n.x,n.y,n.z).addScaledVector(r,F*.16),Y.clone(),r.clone(),B.clone(),F,j,_),seed:T})}Kt=ee(new D.IcosahedronGeometry(1,1),w0(to,ao,{...et,uSlope:{value:1},uOwn:{value:new D.Vector4(3.1,1.2,1,.8)}},{side:D.FrontSide}),W,60),Kt.userData.n=W.length}await a.yield();const tt=R0.clone().addScaledVector(x0,-40).addScaledVector(Q0,b0(-5,3,4/150)+1.2*Math.sin(-1)).addScaledVector(v0,-17.5).clone().addScaledVector(x0,-165).addScaledVector(v0,-125);{const t=tt.z+110,o=(tt.z- -300)/(t- -300),n=s(0,0,0),y=[[0,0],[.08,3],[.16,7],[.26,12],[.38,19],[.52,30],[.68,48],[.84,80],[1,150]],m=[[0,0],[.08,.6],[.16,3],[.26,10],[.38,30],[.52,75],[.68,160],[.84,330],[1,720]],C=(r,c,b)=>{const x=Math.abs(c),F=c<0?-1:1,H=d(.05,.25,Math.abs(r-o)),j=tt.x+(r-o)*120+14*A.n2(r*3.1,7.7)*H,_=b0(-300,t,r),T=tt.y+290*Math.pow(Math.max(0,1-r/o),1.3)-520*Math.pow(d(o+.035,1,r),1.5)+5*A.n2(r*13,2.2)*H,$=Math.sqrt(Math.max(0,1-d(.9,1,r))),E=(se(x,y)*(1+.3*A.n2(r*6+F*5,x*3))+6*A.fbm2(r*8+20,x*4*F+2,3)*d(.12,.4,x))*$,n0=se(x,m)+3*Math.sin(se(x,m)*.2+r*9)*d(.2,.4,x);return b.set(j+E*F,T-n0,_-.12*n0*d(.8,1,r))},k=64,U=26,g=y0({color:3});for(let r=0;r<=k;r++){const c=1-Math.pow(1-r/k,1.35);for(let b=0;b<=U;b++){const x=b/U*2-1;C(c,Math.sign(x)*Math.pow(Math.abs(x),1.25),n),g.v(n.x,n.y,n.z,{color:[.5+.4*A.n2(n.x*.02,n.y*.02),.5+.5*A.n2(n.x*.05,n.y*.012+9),0]})}(r&15)===15&&await a.yield()}for(let r=0;r<k;r++)for(let c=0;c<U;c++){const b=r*(U+1)+c,x=b+U+1;g.quad(b,b+1,x+1,x)}const p=g.geometry(),z=new D.Mesh(p,Wt);z.frustumCulled=!1,i.add(z),await zt(p,"spur"),await a.yield();const V=y0(Pe),R=6,W=40;for(let r=0;r<=W;r++)for(let c=0;c<=R;c++){const b=c/R*2-1;C(b0(.3,.985,r/W),b*.2,n),V.v(n.x,n.y+.5,n.z,{aCol:k0(ia,.75+.5*A.n2(n.x*.11,n.z*.11)),aK:[0,6,0],aUv:[r<2||r>W-2?3:b,r/W]})}for(let r=0;r<W;r++)for(let c=0;c<R;c++){const b=r*(R+1)+c,x=b+R+1;V.quad(b,b+1,x+1,x)}ee(V.geometry(),ze,[{m:new D.Matrix4,seed:.7}]);const P=v.fork("tree"),Y=[];for(let r=0;r<26;r++){C(P.range(.62,.97),P.range(-.16,.16),n);const c=5+Math.floor(P()*3),b=P.range(2.6,4.6),x=P.range(0,6.28);for(let F=0;F<c;F++)ue.push({m:T0(n.clone(),x+F*6.283/c+P.range(-.3,.3),b,b,b,P.range(-.5,-.15)),seed:P()});if(r<14){C(P.range(.6,.97),P.range(-.2,.2),n);const F=P.range(2.5,6);fe.push({m:T0(n.clone(),P.range(0,6.28),F,F*P.range(.6,1),F),seed:P()})}}const B=w0(to,ao,{...et,uLeafA:{value:f0(l?"#4a4424":"#14351b")},uLeafB:{value:f0(l?"#8a7a40":"#3d682b")},uFleckCol:{value:f0(l?"#f2b3c4":Re[0]).multiplyScalar(.8)},uFleck:{value:s(l?.5:.63,.9,et.uFleck.value.z)},uOwn:{value:new D.Vector4(2.8,1.5,1,1.15)}},{side:D.FrontSide});for(const[r,c,b,x]of yn){const F=R0.clone().addScaledVector(x0,r).addScaledVector(Q0,c).addScaledVector(v0,b);Y.push({m:T0(F,P.range(0,6.28),x*.6,x*.44,x*.6),seed:P()});for(let H=0;H<10;H++){const j=H*2.4+P.range(-.4,.4),_=H<3?P.range(.5,1):P.range(-.3,.55),T=x*P.range(.55,.98),$=x*P.range(.2,.38);Y.push({m:T0(s(F.x+Math.cos(j)*Math.cos(_)*T,F.y+Math.sin(_)*T*.62,F.z+Math.sin(j)*Math.cos(_)*T),P.range(0,6.28),$,$*P.range(.5,.75),$*P.range(.8,1.2),P.range(-.25,.25)),seed:P()})}}for(let r=0;r<14;r++){C(P.range(.45,.96),P.range(-.24,.24),n);const c=P.range(8,17);n.distanceTo(tt)<30||Y.push({m:T0(s(n.x,n.y+c*.25,n.z),P.range(0,6.28),c,c*P.range(.6,.85),c),seed:P()})}ee(new D.IcosahedronGeometry(1,2),B,Y,60)}await a.yield();const bo=w0(_s,Ks,{uMoss:{value:f0(l?"#55581f":"#38541d")},uCherry:{value:l?1:0}}),at=[],jn=f0(l?"#5c2f25":"#94583a"),_n=f0(l?"#5d5a22":"#1c4020"),ot=(e,t=6.2)=>u0.distanceTo(e.x,e.y,e.z)>=t,Ct=(e,t,o,n,y)=>{const m=s(0,0,0).crossVectors(e,t);m.lengthSq()<1e-6&&m.set(1,0,0),m.normalize();const C=s(0,0,0).crossVectors(m,e).normalize();return o&&(m.applyAxisAngle(e,o),C.applyAxisAngle(e,o)),la(n,m,e,C,y)};{const e=v.fork("bough"),t=y0(Pe),o=s(0,0,0),n=s(0,0,0),y=(B,r)=>r.copy(R0).addScaledVector(x0,B).addScaledVector(Q0,b0(-5,3,(B+44)/150)+1.2*Math.sin(B*.05+1)).addScaledVector(v0,-se(B,[[0,17.5],[60,14.2],[90,10.8],[106,8.8]])),m=B=>se(B,[[0,8],[20,7],[45,5.5],[65,4],[85,2.2],[100,.8],[106,.25]]),C=B=>(r,c,b)=>({aCol:k0(jn,.85+.3*A.n2(b*.07,c*5)),aK:[0,0,0],aUv:[c*6.283*B,b]}),k=[];for(let B=-44;B<=106;B+=5)k.push(y(B,s(0,0,0)));G0(t,k,(B,r,c)=>m(-44+150*B)*(1+.05*Math.sin(3*r+c*.11)+.05*A.n2(r*1.3,c*.09)),18,C(6)),await a.yield();{const B=y(-40,s(0,0,0)),r=[],c=tt.y-7;for(let b=0;b<=16;b++){const x=b/16,F=165*(1-Math.pow(1-x,2.2));r.push(s(B.x-x0.x*F+6*Math.sin(x*5),B.y-(B.y-c)*Math.pow(x,1.7),B.z-x0.z*F+6*Math.sin(x*4)))}G0(t,r,(b,x,F)=>b0(8.6,17,Math.pow(b,.8))*(1+.8*d(.8,1,b))*(1+.06*Math.sin(3*x+F*.05)+.06*A.n2(x*1.3,F*.05)),16,C(8)),await a.yield(),[[0,3],[1,5],[4,4],[2,2],[3,6],[5,7]].forEach(([b,x])=>{const[F,H,j]=yn[b],_=R0.clone().addScaledVector(x0,F).addScaledVector(Q0,H).addScaledVector(v0,j),T=r[x],$=[];for(let E=0;E<=6;E++){const n0=E/6;$.push(s(b0(T.x,_.x,n0),b0(T.y,_.y,n0)+14*Math.sin(n0*3.14),b0(T.z,_.z,n0)))}G0(t,$,E=>b0(6.5,2.2,E),10,C(5))})}await a.yield();const U=(B,r)=>{const c=(B.x-R0.x)*x0.x+(B.z-R0.z)*x0.z;n.copy(R0).addScaledVector(x0,c);const b=B.distanceTo(n);return b<r&&b>.001&&B.sub(n).multiplyScalar(r/b).add(n),B},g=(B,r,c,b,x,F)=>{const H=s(0,0,0).crossVectors(r,Math.abs(r.y)>.9?s(1,0,0):v0).normalize(),j=s(0,0,0).crossVectors(r,H),_=e.range(0,6.28);for(let T=0;T<c;T++){const $=e.range(b,x)*ie,E=_+T*6.283/c+e.range(-.25,.25),n0=F*e.range(.85,1.15),G=r.clone().multiplyScalar(Math.cos($)).addScaledVector(H,Math.cos(E)*Math.sin($)).addScaledVector(j,Math.sin(E)*Math.sin($)).normalize(),F0=B.clone().addScaledVector(G,5.3*n0),g0=B.clone().addScaledVector(G,2.6*n0);!ot(F0,6.4)||!ot(g0,6.4)||po.push({m:Ct(G,e.chance(.8)?r:r.clone().negate(),0,B,n0),seed:e()})}},p=(B,r,c)=>{const b=s(0,0,0).crossVectors(r,Math.abs(r.y)>.9?s(1,0,0):v0).normalize(),x=s(0,0,0).crossVectors(r,b);for(let F=0;F<c;F++){const H=b0(14,102,Math.sqrt((F+.5)/c))*ie,j=F*2.39996+e.range(-.2,.2),_=r.clone().multiplyScalar(Math.cos(H)).addScaledVector(b,Math.cos(j)*Math.sin(H)).addScaledVector(x,Math.sin(j)*Math.sin(H)).addScaledVector(v0,-.12).normalize();!ot(B.clone().addScaledVector(_,4.5),6.2)||!ot(B.clone().addScaledVector(_,2.4),6.2)||at.push({m:Ct(_,v0,e.range(0,6.28),B,e.range(.92,1.1)),seed:e()})}},z=(B,r,c,b,x)=>{const F=B.clone().lerp(r,.5);U(F,7.4);const H=(F.x-R0.x)*x0.x+(F.z-R0.z)*x0.z;o.copy(R0).addScaledVector(x0,H);const j=F.clone().sub(o).normalize();F.addScaledVector(j,x).addScaledVector(x0,-2);const _=[];for(let T=0;T<=8;T++){const $=T/8;_.push(U(B.clone().multiplyScalar((1-$)*(1-$)).addScaledVector(F,2*$*(1-$)).addScaledVector(r,$*$),T===0?0:7.2))}return G0(t,_,T=>b0(c,b,T),7,C(1)),{sp:_,axis:_[8].clone().sub(_[6]).normalize()}},V=[[5,125,11.4],[9,238,11.8],[47,305,12.2],[52,78,12.6],[70,205,11.4],[88,128,11.2]];for(const[B,r,c]of V){const b=B+e.range(-2,2),x=Qe(b,r+e.range(-9,9),c+e.range(0,.8),s(0,0,0)),F=y(Math.max(-30,b-13),s(0,0,0));F.addScaledVector(x.clone().sub(F).normalize(),m(b-13)*.6);const H=z(F,x,1.3,.42,3.5);p(x,H.axis,l?26:20),g(x.clone().addScaledVector(H.axis,-.7),H.axis,9,78,118,l?.62:1),g(H.sp[5].clone(),H.sp[6].clone().sub(H.sp[4]).normalize(),6,55,100,l?.6:.9);for(const j of[3,6]){const _=H.sp[j];(Math.abs((_.x-R0.x)*Q0.x+(_.z-R0.z)*Q0.z)>6.9||_.y<Xe-7)&&jt.push({m:T0(_.clone().addScaledVector(v0,-.6),e.range(0,6.28),e.range(.7,1.2)),seed:e()})}await a.yield()}const R=32+e.range(-1,1),W=11.2,P=[];for(let B=0;B<=72;B++)P.push(Qe(R+.8*Math.sin(B*.375),B*5,W+.35*Math.sin(B*.71)+.12*Math.sin(B*2.3),s(0,0,0)));G0(t,P,(B,r,c)=>.4*(.8+.28*Math.sin(c*.8)+.1*Math.sin(c*3.1)),6,C(.4));for(const B of[158,203])z(y(R-9,s(0,0,0)),Qe(R,B,W,s(0,0,0)),1,.5,.5);for(let B=0;B<18;B++){const r=B*20+e.range(-4,4),c=Qe(R,r,W,s(0,0,0)),x=Qe(R,r,0,s(0,0,0)).sub(c).normalize().multiplyScalar(.68).addScaledVector(x0,.55).addScaledVector(v0,-.25).normalize();if(ot(c.clone().addScaledVector(x,4.5),6.3)&&at.push({m:Ct(x,v0,e.range(0,6.28),c,e.range(.95,1.12)),seed:e()}),B%3===0){const F=Qe(R,r,W+1,s(0,0,0)).sub(c).normalize();g(c,F.addScaledVector(x0,-.3).normalize(),5,20,62,l?.6:.95)}}await a.yield();for(let B=0;B<96;B++){const r=e.range(-14,98),c=e.range(-62,62)*ie,b=m(r);y(r,o);const x=v0.clone().multiplyScalar(Math.cos(c)).addScaledVector(Q0,Math.sin(c)),F=o.clone().addScaledVector(x,b*.98);if(B<52){const H=e.range(.7,1.5)*Math.min(1,b/3);fe.push({m:Ct(x,x0,e.range(0,6.28),F,H),seed:e()})}else if(B<84){const H=e.range(.9,1.5)*Math.min(1,b/2.5+.3);ue.push({m:Ct(x.clone().addScaledVector(x0,e.range(-.5,.5)).addScaledVector(Q0,Math.sign(c)*.5).normalize(),v0,e.range(0,6.28),F,H),seed:e()})}else jt.push({m:T0(o.clone().addScaledVector(Q0,Math.sign(c||1)*b*.9).addScaledVector(v0,-b*.35),e.range(0,6.28),e.range(.8,1.3)),seed:e()})}const Y=t.geometry();await a.yield(),i.add(new D.Mesh(Y,bo)),await zt(Y,"bough")}{const e=v.fork("lip");for(const t of l0.roofLip)for(let o=0;o<6;o++){const n=e.range(2.2,3.4);ue.push({m:T0(s(t.x+e.range(-9,9),t.y+1.6,t.z-1.2),Math.PI+e.range(-.8,.8),n,n,n,e.range(-1.1,-.5)),seed:e()})}}{const e=v.fork("wall"),t=[],o=l0.cleftMouth.x,n=l0.cleftMouth.y,y=(k,U,g,p,z,V)=>{const R=e.range(-.3,.3);for(let W=0;W<z;W++){const P=z>1?W/(z-1)*2-1:0,Y=p*e.range(.8,1.15)*(1-.25*Math.abs(P));ue.push({m:T0(s(k+P*.5*p,U,g),Math.PI+R+P*1.25+e.range(-.12,.12),Y,Y,Y,V*(.75+.9*Math.abs(P))*e.range(.85,1.15)),seed:e()})}},m=Math.round(30*(.6+.4*q));for(let k=0,U=0;k<m&&U<1500;U++){const g=e.range(-300,300),p=e.chance(.62),z=d0.ledgesAt(g,p?147:15,p?204:106).filter(P=>P.width>.9);if((U&3)===3&&await a.yield(),!z.length)continue;const V=z[e.int(0,z.length-1)],R=2+e.int(0,2);let W=0;for(let P=0;P<R;P++){const Y=g+(P-(R-1)/2)*e.range(5.5,8.5);if(d0.wallPoint(Y,V.y-.5,t),u0.distanceTo(t[0],t[1],t[2])<12||Math.hypot(Y-o,t[1]-n)<36)continue;y(t[0],t[1]+.2,t[2]+.5,e.range(1.7,2.7)*Math.min(1.2,.7+.2*V.width),7+e.int(0,2),-1.05);const B=e.range(2.2,4.2);fe.push({m:T0(s(t[0]+e.range(-2,2),t[1]+.1,t[2]+.6),e.range(0,6.28),B,B*e.range(.5,.8),B*.8),seed:e()}),P%2===0&&jt.push({m:T0(s(t[0]+e.range(-3,3),t[1]-.6,t[2]+.9),e.range(0,6.28),e.range(.5,1)),seed:e()}),W++}W&&k++}await a.yield();const C=Math.round(30*(.6+.4*q));for(let k=0;k<C;k++){const U=e.range(-290,290),g=e.range(118,141),p=1+e.int(0,2);for(let z=0;z<p;z++){const V=U+z*e.range(5,8);if(d0.wallPoint(V,g+e.range(-1.5,1.5),t),u0.distanceTo(t[0],t[1],t[2])<12)continue;y(t[0],t[1]+.2,t[2],e.range(1.7,2.6),6+e.int(0,2),-.75);const R=e.range(2,4.5);fe.push({m:T0(s(t[0]+e.range(-4,4),t[1]+.3,t[2]+e.range(-1,1)),e.range(0,6.28),R,R*e.range(.5,.8),R),seed:e()})}}}await a.yield();const wo=(e,t,o)=>[...e.filter((n,y)=>y%o<t),...e.filter((n,y)=>y%o>=t)],Kn=at.length,In=at.filter((e,t)=>t%5<2).length,En=_t.length,Gn=_t.filter((e,t)=>t%5<3).length,xo=ee(Is(f0(l?"#f2b3c4":Re[0]),f0(l?"#d0708f":"#7d0f17"),f0("#4f6a2a"),l),ze,wo(at,2,5));ee(Es(_n,l?3.6:5,l?.95:.85),ze,po),await a.yield();const fa=ue.filter(e=>!e.fin&&e.m.elements[12]<=165),Mo=ue.filter(e=>!e.fin&&e.m.elements[12]>165),On=ue.length,$n=fa.length,Hn=fa.length+Mo.length,Zn=fe.filter(e=>!e.fin).length,Yn=fe.length,Xn=ee(kn(3,3,1.15,.5,mo.clone().multiplyScalar(.7),mo.clone().lerp(f0("#9fb04a"),.45)),ze,[...fa,...Mo,...ue.filter(e=>e.fin)]);ee(kn(4,10,.95,0,f0("#8f9a78"),f0("#b9c19a")),ze,jt);const Jn=ee(An(ia),ze,[...fe.filter(e=>!e.fin),...fe.filter(e=>e.fin)]),zo=ee(Gs(f0(l?"#a8935c":"#9a6fd0"),f0("#5d7a36")),ze,wo(_t,3,5));await a.yield();let It=null,Et=null,ha=null;{const e=y0(Pe),t=s(232,186,35.6),o=s(16,0,-4).normalize(),n=s(221,0,47),y=f0("#b99b62"),m=f0("#8a6a45"),C=219,k=j=>Math.pow(P0((C-j)/100,0,1),1.2),U=.14,g=a.core.makeRng(Dt("gear:"+h)),p=(j,_)=>{let T=(j/6.2832-U*_)*3;T=(T-Math.round(T))*2.0944;const $=Math.sin(T);return .536*Math.cos(T)+Math.sqrt(Math.max(.2153-.2873*$*$,0))},z=(j,_)=>j+.25*Math.sin(_*.11+j),V=(j,_)=>j+.2*Math.sin(_*.09+j),R=(j,_,T,$,E,n0)=>{const G=(p0,W0,Z0,L0,Ae)=>{const z0=[];for(let V0=p0;V0>W0+.01;V0-=Z0)z0.push(s(z(j,V0),V0,V(_,V0)));z0.push(s(z(j,W0),W0,V(_,W0))),!(z0.length<2)&&G0(e,z0,(V0,Y0,le)=>{const X0=T-p0+le,j0=Ae?1-d(15,23,Math.abs(p0-le-t.y)):0;return E*b0(.84,p(Y0,X0),j0)},L0,(V0,Y0,le)=>({aCol:k0(y,.85+.3*A.n2((T-p0+le)*.3,Y0*3)),aK:[k(p0-le),1,0],aUv:[Y0,T-p0+le]}))};if(!n0){G(T,$,2,7,!1);return}const F0=Math.min(T,t.y+24),g0=Math.max($,t.y-24);G(T,F0,2,9,!1),G(F0,g0,.7,18,!0),G(g0,$,2,9,!1)},W=(j,_,T,$,E,n0)=>{const G=s(0,0,0).crossVectors(_,v0).normalize(),F0={aCol:k0(y,n0),aK:[k(E),4,0],aUv:[.5,0]},g0=j.clone().addScaledVector(_,T*.5).addScaledVector(v0,T*.22),p0=j.clone().addScaledVector(_,T*.86).addScaledVector(v0,-T*.3),W0=(z0,V0)=>[0,2.094,4.189].map(Y0=>e.v(z0.x+G.x*Math.cos(Y0)*V0,z0.y+Math.sin(Y0)*V0,z0.z+G.z*Math.cos(Y0)*V0,F0)),Z0=W0(j,$),L0=W0(g0,$*.62),Ae=e.v(p0.x,p0.y,p0.z,F0);for(let z0=0;z0<3;z0++){const V0=(z0+1)%3;e.quad(Z0[z0],Z0[V0],L0[V0],L0[z0]),e.tri(L0[z0],L0[V0],Ae)}},P=(j,_)=>s(n.x-j,0,n.z-_).normalize(),Y=(j,_,T,$,E,n0)=>{const G=g.range(0,6.2832),F0=s(Math.cos(G),0,Math.sin(G)),g0=F0.dot(P(j,_))>.25?Math.min(E,.85):E;W(s(z(j,T)+F0.x*$*.7,T,V(_,T)+F0.z*$*.7),F0,g0,n0,T,g.range(.95,1.35))},B=t.y-7-70;for(const j of[-1,1]){const _=t.x+o.x*8*j,T=t.z+o.z*8*j;R(_,T,C,B-9,.8,!0);for(let $=0;$<58;$++)Y(_,T,t.y+g.range(-21,21),.8,g.range(.6,1.7),g.range(.035,.06))}for(let j=t.y+21;j>B-1;j-=14){const _=t0.range(-.35,.35),T=[];for(let $=0;$<=4;$++){const E=$/2-1;T.push(s(t.x+o.x*8.9*E,j+_*E+.12*Math.sin($*2),t.z+o.z*8.9*E))}G0(e,T,($,E)=>.45*(1+.08*Math.sin(E*2+$*9)),8,($,E,n0)=>({aCol:k0(m,.9+.2*Math.sin(n0)),aK:[k(j),2,0],aUv:[E,n0]}));for(const $ of[-1,1]){const E=t.x+o.x*8*$,n0=t.z+o.z*8*$,G=j+_*$*.9,F0=[];for(let g0=0;g0<=6;g0++){const p0=G+.95-g0*.3167;F0.push(s(z(E,p0),p0,V(n0,p0)))}if(G0(e,F0,g0=>.8*(.9+.36*Math.sin(Math.PI*g0)),10,(g0,p0,W0)=>({aCol:k0(y,.7),aK:[k(G),1,0],aUv:[p0,W0*9]})),Math.abs(G-t.y)<30)for(let g0=0;g0<4;g0++)Y(E,n0,G+g.range(-.9,.9),1.05,g.range(1.1,2.2),g.range(.06,.09))}}await a.yield();const r=s(221,l0.torchSeat.y,26.5),c=[];for(let j=0;j<=10;j++)c.push(s(r.x+.5*Math.sin(j*.5),200-2*j,r.z+.3*Math.cos(j*.7)));const b=(j,_)=>{const T=P0(j,0,1)*10,$=Math.min(9,Math.floor(T));return _.lerpVectors(c[$],c[$+1],T-$)},x=j=>1.5*(.55+.45*Math.sin(Math.PI*(.08+.84*j)));R(r.x,r.z,213,199.5,.24,!1),G0(e,c,j=>x(j)*.9,9,(j,_,T)=>({aCol:k0(f0("#4f4326"),.7+.4*A.n2(_*9,T*.2)),aK:[k(200-T),3,d(.72,.98,j)],aUv:[.3,T]}));{const j=f0("#8d7b3c"),_=f0("#5f6d2f"),T=f0("#a58a4c"),$=s(0,0,0),E=s(0,0,0),n0=s(0,0,0),G=s(0,0,0),F0=38;for(let g0=0;g0<F0;g0++){const p0=Math.min(.74,g0%5*.165+g.range(-.03,.05)),W0=g.range(.27,.4),Z0=g0*2.4+g.range(-.3,.3),L0=g.range(1.3,2),Ae=g.range(.08,.45),z0=g.range(.7,2.1),V0=g.range(-.5,.5),Y0=(g()<.3?_:g()<.5?T:j).clone().multiplyScalar(g.range(.75,1.15)),le=e.count();for(let X0=0;X0<=5;X0++){const j0=X0/5,te=Math.min(1.03,p0+W0*j0),ht=Z0+V0*j0;b(te,$),te>1&&($.y-=(te-1)*20),E.set(Math.cos(ht),0,Math.sin(ht)),n0.set(-Math.sin(ht),0,Math.cos(ht));const ja=x(Math.min(te,1))+Ae+z0*j0*j0*j0,ta=.5*L0*Math.pow(Math.sin(Math.PI*(.1+.9*j0)*.97),.7);for(let De=-1;De<=1;De++)G.copy($).addScaledVector(E,ja+(De===0?.1*L0:0)).addScaledVector(n0,De*ta),e.v(G.x,G.y,G.z,{aCol:k0(Y0,1),aK:[k(G.y),3,d(.72,.98,te)],aUv:[.5+.5*De,W0*j0*20]})}for(let X0=0;X0<5;X0++)for(let j0=0;j0<2;j0++){const te=le+X0*3+j0;e.quad(te,te+1,te+4,te+3)}}}for(const j of[1,4,7]){const _=[];for(let T=0;T<=4;T++)_.push(b(j/10+(T-2)*.012,s(0,0,0)));G0(e,_,T=>x(j/10)+.5+.14*Math.sin(Math.PI*T),12,(T,$,E)=>({aCol:k0(y,.75),aK:[k(c[j].y),1,0],aUv:[$,E*7]}))}const F=e.geometry();await a.yield(),ha=new D.Mesh(F,bo),i.add(ha),i.userData.gearPts=[c[0],c[5],c[10],...[-1,1].map(j=>s(t.x+o.x*8*j,t.y,t.z+o.z*8*j))],await zt(F,"ladder");const H=c[10];It=Ds({rng:v,position:[H.x,H.y+1,H.z],height:27,radius:[1.8,l?8:6],size:[3,l?13:10],count:Math.round((l?80:60)*q),color:"#a7abb4",colorTop:"#cdd1d8",shadowColor:"#5c606c",ambient:"#383c46",opacity:l?.75:.55,rate:.07,wind:[.25,0,-.7],bend:.7,sunDir:o0.toArray()}),i.add(It.object),Et=gn({position:[H.x,H.y+1.2,H.z],color:"#ff7a2a",size:6,intensity:1.5,flicker:.35}),i.add(Et.object)}await a.yield();const nt=[[0,s(-140,188,34)],[.05,s(-62,190,30)],[.1,s(34,190.5,29)],[.14,s(100,191,33)],[.168,s(150,191,58)],[.2167,s(208.4,190,109)],[.2378,s(220.7,189,138.8)],[.2589,s(208.4,188,168.5)],[.28,s(178.7,187,180.8)],[.3011,s(149,186,168.5)],[.3222,s(136.7,185,138.8)],[.34,s(145.6,184.5,112.9)],[.3597,s(171.4,186,97.4)],[.385,s(222,188,84)],[.41,s(270,188,80)],[.44,s(330,192,84)],[.52,s(470,215,110)],[.62,s(660,260,200)],[.75,s(860,320,340)]],Qn=new D.CatmullRomCurve3(nt.map(e=>e[1]),!1,"centripetal"),kt=(e,t)=>{const o=nt.length;let n=0;for(;n<o-2&&e>nt[n+1][0];)n++;const y=P0((e-nt[n][0])/(nt[n+1][0]-nt[n][0]),0,1);return Qn.getPoint((n+y)/(o-1),t)},Gt=s(0,0,0);kt(0,Gt);for(const e of[.062,.107,.152,.197,.242,.287])Ge.push({u:e,x:-200,y:190});Ge.push({u:.505,x:146,y:190},{u:.552,x:30,y:190},{u:ce-.016,x:150,y:190}),d0.setSchedule(Ge,B0);const So=l0.portalSeat.position,he=l0.portalSeat.direction,Ot=l0.tear.position,I0={uStory:{value:0},uSpine:{value:Array.from({length:21},()=>s(0,0,0))},uPale:{value:we},uBeeDark:{value:Ve},uClA:{value:l0.cleftMouth.clone().addScaledVector(he,3)},uClB:{value:So.clone()},uPortalPos:A0.uPortalPos,uPortalCol:A0.uPortalCol,uFace:{value:0}},va={value:new D.Vector4(20,60,1.6,.4)},pa={value:new D.Vector4(.035,.16,.34,400)},es=w0(Lt,Ut,{...I0,uShade:va,uWing:pa,uNear:{value:new D.Vector4(2.2,2.4,5,1.5)}}),Co=w0(Lt,Ut,{...I0,uShade:va,uWing:pa,uNear:{value:new D.Vector4(3.4,6,14,1.7)}}),ts=w0(Lt,Ut,{...I0,uShade:va,uWing:pa,uNear:{value:new D.Vector4(2.2,2.4,5,1.5)}},{transparent:!0,depthWrite:!1}),ko={value:new D.Vector4(150,340,5.5,1.5)},Ao={value:new D.Vector4(.32,.9,.34,330)},Bo={value:new D.Vector4(3.4,6,14,1.7)},as=w0(Lt,Ut,{...I0,uShade:ko,uWing:Ao,uNear:Bo,uFace:{value:1}}),os=w0(Lt,Ut,{...I0,uShade:ko,uWing:Ao,uNear:Bo,uFace:{value:1}},{transparent:!0,depthWrite:!1}),st=(e,t,o,n)=>{const y=new D.InstancedBufferGeometry,m=Math.max(1,e.length);y.index=t.index;for(const R of["position","normal","aP"])y.setAttribute(R,t.attributes[R]);let C=null;if(n){const R=t.index.array,W=t.attributes.aP.array,P=[],Y=[];for(let B=0;B<R.length;B+=3)(W[R[B]]>1.5&&W[R[B]]<2.5?Y:P).push(R[B],R[B+1],R[B+2]);y.setIndex(P),C=new D.InstancedBufferGeometry,C.setIndex(Y)}const k=new Float32Array(m*3),U=new Float32Array(m*3),g=new Float32Array(m*3),p=new Float32Array(m*4),z=new Float32Array(m*2);e.forEach((R,W)=>{R.A.toArray(k,W*3),R.B.toArray(U,W*3),R.C.toArray(g,W*3),p.set(R.t,W*4),z[W*2]=R.seed,z[W*2+1]=R.pollen}),y.setAttribute("iA",new D.InstancedBufferAttribute(k,3)),y.setAttribute("iB",new D.InstancedBufferAttribute(U,3)),y.setAttribute("iC",new D.InstancedBufferAttribute(g,3)),y.setAttribute("iT",new D.InstancedBufferAttribute(p,4)),y.setAttribute("iS",new D.InstancedBufferAttribute(z,2)),y.instanceCount=e.length;const V=new D.Mesh(y,o);if(V.frustumCulled=!1,i.add(V),C){for(const W in y.attributes)C.setAttribute(W,y.attributes[W]);C.instanceCount=e.length;const R=new D.Mesh(C,n);R.frustumCulled=!1,R.renderOrder=3,i.add(R),V.userData.wings=R}return V},rt=(e,t)=>s(e.range(-t,t),e.range(-t,t),e.range(-t,t)),Oe=(e,t,o,n)=>s(e.center.x+e.tangent.x*t+e.normal.x*n,e.top-o,e.center.z+e.tangent.z*t+e.normal.z*n);let No=[0,0,0];const re=[],$e=[],At=[],ma=[],$t=s(0,0,0),Po=s(-186,232,135),Ht=de[2]*B0-2.2;{const e=v.fork("flyers"),t=(p,z,V,R,W,P)=>{const Y=P?V:z,B=P?z:V,r=Y.clone().add(B).multiplyScalar(.5),c=R?R.clone().sub(r).multiplyScalar(2):s(e.range(-40,40),e.range(-30,50),e.range(-40,40));p.push({A:Y,B,C:c,t:[e(),(Y.distanceTo(B)+c.length()*.6)/W,0,e.range(.9,1.12)],seed:e(),pollen:P?1:0})},o=(p,z,V,R,W,P)=>p.push({A:z,B:V,C:R,t:[W,(z.distanceTo(V)+R.length()*.6)/P,1,e.range(.95,1.15)],seed:e(),pollen:0}),n=[s(R0.x-90,150,R0.z+120),s(-420,90,760),s(420,250,1150),s(-60,-160,900),s(900,120,700)],y=Math.round(290*P0(r0,.75,1.25)*(.55+.45*q));for(let p=0;p<y;p++){const z=l0.combs[e.int(0,11)],V=n[p%5===0?0:e.int(0,4)];t($e,Oe(z,e.range(-.7,.7)*z.halfWidth,e.range(6,z.depth*.9),e.range(3.5,9)),V.clone().add(rt(e,70)),null,e.range(25,33),e.chance(.5))}await a.yield();for(let p=0;p<60;p++){const z=e.range(40,ce*S0-30),V=e.range(0,6.28),R=e.range(4.6,15),W=P=>(u0.tangentAtDist(P,M0),u0.posAtDist(P).addScaledVector(s(-M0.z,0,M0.x).normalize(),Math.cos(V)*R).addScaledVector(v0,Math.sin(V)*R*.8));t(re,W(z+115),W(z-60),W(z+27),e.range(26,32),!1)}for(let p=0;p<42;p++){const z=e.range(45,95);t(re,Ot.clone().addScaledVector(he,-z).add(rt(e,.2*z)),So.clone().add(rt(e,3.2)),Ot.clone().add(rt(e,3.5)),e.range(27,33),!1),re[re.length-1].pollen=1}for(let p=0;p<44;p++){const z=e.range(-105,75),V=s(z,e.range(182,197),d0.zBack(z)+26+e.range(7,22)),R=Ot.clone().addScaledVector(he,-e.range(1.5,6)).add(rt(e,3.5)),W=(z+R.x)/2,P=s(W,(V.y+R.y)/2+e.range(0,4),Math.max(d0.zBack(W)+26+13,(V.z+R.z)/2)+e.range(0,7));t(re,V,R,P,e.range(29,36),!1),re[re.length-1].pollen=p%2}const m=[],C=Math.floor(.66/.004),k=Math.floor(.22/.004);for(let p=0;p<=C;p++)m.push(kt(p*.004,s(0,0,0)));await a.yield();for(let p=0;p<230;p++){const z=l0.combs[p%5<3?e.int(0,1):e.int(2,5)],V=Oe(z,e.range(-.8,.8)*z.halfWidth,e.range(8,30),3);let R=0;for(;R<k&&m[R].x<V.x;)R++;const W=R*.004*B0+e.range(-.3,2.4),P=e.range(44,62);let Y=Math.max(0,Math.ceil(W/B0/.004)+2);for(;Y<C&&m[Y].distanceTo(V)>P*(Y*.004*B0-W);)Y++;o(At,V,m[Math.min(Y,C)].clone().add(rt(e,7)).addScaledVector(v0,-4),s(e.range(-10,10),e.range(-8,8),e.range(2,18)),W,P),p===115&&await a.yield()}await a.yield();const U=l0.combs[4];for(let p=0;p<40;p++){const z=Oe(U,e.range(-.7,.7)*U.halfWidth,e.range(8,30),3),V=Ge[p%2?1:2].u*B0+e.range(.3,1.4);o($e,z,s(U.center.x+e.range(-60,20),e.range(190,240),U.center.z+e.range(60,130)),s(e.range(-10,10),e.range(-12,6),e.range(5,25)),V,e.range(22,30))}const g=v.fork("ball");if(u0.pointAt(D0+.002,O0),u0.tangentAt(D0+.002,M0),$t.copy(O0).addScaledVector(s(-M0.z,0,M0.x).normalize(),4).addScaledVector(v0,-7),Q)for(let p=0;p<56;p++){const z=s(g.gauss(),g.gauss(),g.gauss()).normalize(),V=$t.clone().addScaledVector(z,g.range(1.1,2.5));$e.push({A:V,B:V.clone().addScaledVector(s(0,0,0).crossVectors(z,v0).normalize(),.5),C:s(0,0,0),t:[g(),g.range(.5,1.1),0,.9],seed:g(),pollen:0})}{const p=v.fork("swarm"),z=s(243,139,133),V=()=>s(z.x+P0(p.gauss()*.5,-1.25,1.25)*15,z.y+P0(p.gauss()*.5,-1.25,1.25)*9.5,z.z+P0(p.gauss()*.5,-1.25,1.25)*12);for(let R=0;R<300;R++){const W=V(),P=V(),Y=s(p.gauss(),p.gauss()*.6,p.gauss()).multiplyScalar(7),B=p.range(8,14);ma.push({A:W,B:P,C:Y,t:[p(),(W.distanceTo(P)+Y.length()*.6)/B,0,p.range(.95,1.15)],seed:p(),pollen:0})}}if(await a.yield(),No=[re.length,$e.length,At.length],O){const p=l0.combs[2],z=17.5,V=xt-.015,R=I0.uSpine.value,W=[Oe(p,0,16,4)];for(let x=0;x<11;x++)W.push(u0.pointAt(V+x*z/S0).add(s(0,.6,0)));const P=s(-.42,.3,.86).normalize();for(let x=1;x<=7;x++){const F=z*(Math.pow(1.3,x)-1)/Math.log(1.3);W.push(W[11].clone().addScaledVector(P,F).addScaledVector(v0,F*F*3e-4))}R[0].copy(W[0]).multiplyScalar(2).sub(W[1]);for(let x=0;x<19;x++)R[x+1].copy(W[x]);R[20].copy(W[18]).multiplyScalar(2).sub(W[17]);const Y=x=>z+(x-V)*S0,B=Math.round(540*(.7+.3*q)),r=156,c=xt*B0,b=(D0+.04)*B0;Po.copy(W[15]);for(let x=0;x<B+r;x++){const F=x>=B,H=F?g.range(33,40):g.range(44,56),j=g.range(2,p.depth*.92),_=g.range(-.85,.85)*p.halfWidth*Math.sqrt(Math.max(.05,1-Math.pow(j/p.depth,2)));let T=Ht+j/p.depth*6+g.range(0,4.5);if(F){const n0=g.range(xt+.005,D0+.036);T=Math.max(Ht,n0*B0-(Y(n0)+g.range(-4,24))/H)}const $=F?1.8+4.6*Math.sqrt(g()):3.5+8.5*Math.pow(g(),.75);let E=!1;for(let n0=Math.max(c,T);n0<=b&&!E;n0+=.3)E=Math.abs(H*(n0-T)-Y(n0/B0))<19;(F?re:E?$e:At).push({A:Oe(p,_,j,2.2),B:s(0,0,0),C:s($,g.range(0,6.283),g.range(-.5,.5)),t:[T,H,2,g.range(.95,1.15)],seed:g(),pollen:0}),(x&127)===127&&await a.yield()}}}await a.yield();const ga=[st(re,Nn(),es,ts),st($e,Pn(!1),Co),st(At,Pn(!0),Co)],ns=[re.length,$e.length,At.length],ss=ga[0].userData.wings;await a.yield();const Vo=st(ma,Vn(),as,os),rs=ma.length;await a.yield();const ve=(e,t=1)=>k0(f0(e),t),ls={uPale:{value:we},uFlap:{value:new D.Vector4(0,0,2.4,.7)}},ya=w0(oo,no,ls),ba={uPale:{value:we},uFlap:{value:new D.Vector4(0,.78,2.4,.7)}},is=w0(oo,no,ba),Fo=w0(so,ro,{uFan:{value:new D.Vector4(.34,.36,.4,.11)},uClA:I0.uClA,uClB:I0.uClB},{transparent:!0,depthWrite:!1}),lt=(e,t,o)=>{const n=new D.InstancedMesh(e,t,o);return n.instanceMatrix.setUsage(D.DynamicDrawUsage),n.frustumCulled=!1,i.add(n),n},it=k0(Ve),cs=Bn({abdomen:[[-.63,.03,it],[-.56,.1,it],[-.45,.17,it],[-.3,.2,it],[-.15,.19,it],[-.02,.15,[.26,.15,.04]],[.06,.08,[.3,.17,.05]]],bands:1,thorax:[[.05,.09],[.1,.17],[.2,.215],[.3,.19],[.38,.1]],fur:[.42,.26,.07],head:[[.38,.1,.1],[.45,.16,.15],[.52,.14,.13],[.58,.06,.06]],headCol:k0(Ve,1.3),eye:[.02,.016,.014],legs:it,legZ:[.3,.22,.14],legLen:.5,dangle:.02,pollen:k0(we,.95)}),wa=5,qo=lt(cs,ya,wa),Do=lt(Fn(.82,.12,.2),Fo,wa),ds=[[9.5,-5,1.3],[7.2,4.2,-1.7],[13.5,6.6,2.3],[6.6,-3.5,-2.3],[10.5,3.1,2.7]].map(([e,t,o],n)=>({lead:e+t0.range(-1,1),lat:t+t0.range(-.6,.6),up:o+t0.range(-.4,.4),ph:n*1.7+t0.range(0,1)})),He=new D.Matrix4,Se=s(0,0,0),Bt=s(0,0,0),Fe=s(0,0,0),$0=s(0,0,0),H0=s(0,0,0),Zt=s(0,0,0),ct=(e,t,o,n)=>(Fe.copy(t).normalize(),Se.crossVectors(v0,Fe),Se.lengthSq()<1e-6&&Se.set(1,0,0),Se.normalize(),Bt.crossVectors(Fe,Se),o&&(Se.applyAxisAngle(Fe,o),Bt.applyAxisAngle(Fe,o)),He.set(Se.x*n,Bt.x*n,Fe.x*n,e.x,Se.y*n,Bt.y*n,Fe.y*n,e.y,Se.z*n,Bt.z*n,Fe.z*n,e.z,0,0,0,1)),dt=(e,t,o,n)=>q0(t,t+n,e)*(1-q0(o-n,o,e)),Lo=s(0,0,0),Uo=s(0,0,0),Ro=(e,t,o)=>{const n=b0(1,.5,d(ce-.05,ce+.03,t)),y=o?.85*Math.max(dt(t,Me-.06,Me+.05,.03),dt(t,ne-.03,ce-.02,.03)):0;y>0&&(Lo.set(o.x,o.y*.4,o.z).normalize(),Uo.set(-o.z,0,o.x).normalize());for(let m=0;m<wa;m++){const C=ds[m],k=C.lead+1.6*Math.sin(e*.55+C.ph),U=t*S0+k*(1-y);u0.posAtDist(U,$0),u0.tangentAtDist(U,M0),Zt.set(-M0.z,0,M0.x).normalize(),y>0&&($0.addScaledVector(Lo,k*y*1.2),Zt.lerp(Uo,y).normalize());const g=Math.sin(e*.9+C.ph),p=Math.sin(e*1.3+C.ph*2);$0.addScaledVector(Zt,C.lat*n+.7*g).addScaledVector(v0,C.up*b0(.6,1,n*2-1)+.5*p),H0.copy(M0).addScaledVector(Zt,.12*Math.cos(e*.9+C.ph)).addScaledVector(v0,.1*Math.cos(e*1.3+C.ph*2)),ct($0,H0,-.35*Math.cos(e*.9+C.ph),1),qo.setMatrixAt(m,He),Do.setMatrixAt(m,He)}qo.instanceMatrix.needsUpdate=!0,Do.instanceMatrix.needsUpdate=!0};await a.yield();const xa=6,Ma=2;let Yt=null,za=null;const pe=[],To=(e,t)=>{if(e<=t[0][0])return t[0][1];for(let o=1;o<t.length;o++)if(e<=t[o][0])return b0(t[o-1][1],t[o][1],q0(t[o-1][0],t[o][0],e));return t[t.length-1][1]},Sa=Ee-.0185,Ca=(e,t,o)=>{const n=Math.min(Math.max(t,Sa)*S0+e.ahead,e.stop),y=n/S0;return u0.posAtDist(n,o),u0.tangentAtDist(n,M0),e.l.set(-M0.z,0,M0.x).normalize(),o.addScaledVector(e.l,To(y,e.lat)).addScaledVector(v0,To(y,e.up))};if(Q){const e=[.9,.3,.025],t=[.05,.03,.02];Yt=lt(Bn({abdomen:[[-.66,.03,e],[-.58,.12,t],[-.48,.18,e],[-.38,.21,t],[-.27,.22,e],[-.16,.21,t],[-.06,.17,e],[.04,.09,t]],bands:0,thorax:[[.03,.1],[.1,.19],[.2,.23],[.3,.2],[.38,.11]],fur:[.16,.09,.05],head:[[.38,.11,.1],[.46,.2,.18],[.55,.19,.17],[.63,.08,.08]],headCol:e,eye:[.1,.04,.02],legs:[.5,.2,.04],legZ:[.3,.22,.14],legLen:.72,dangle:.17,pollen:null}),ya,xa),za=lt(Fn(1,.14,.22),w0(so,ro,{uFan:{value:new D.Vector4(.5,.34,.14,.15)},uClA:I0.uClA,uClB:I0.uClB},{transparent:!0,depthWrite:!1}),xa);const o=Ee;pe.push({lead:1,ahead:12.5,stop:(D0+.008)*S0,lat:[[o-.002,7.2],[o+.0015,6.4],[o+.0065,2],[o+.0115,2],[o+.0215,6.5]],up:[[o-.002,5],[o+.006,3.6],[o+.0215,2.6]],p:s(0,0,0),l:s(0,0,-1),ph:0,wave:1}),pe.push({lead:1,ahead:9.5,stop:(D0+.0035)*S0,lat:[[o-.004,9],[o-5e-4,8.2],[o+.0045,2.4],[o+.0125,2.6],[o+.0235,8]],up:[[o-.004,6.4],[o+.005,4.8],[o+.0235,4.2]],p:s(0,0,0),l:s(0,0,-1),ph:2.1,wave:1}),[[18,9,-2.6],[29,9.4,-.6],[36,7,3]].forEach(([n,y,m],C)=>{const k=D0+n/S0;u0.pointAt(k,O0),u0.tangentAt(k,M0);const U=s(-M0.z,0,M0.x).normalize();pe.push({lead:0,p:O0.clone().addScaledVector(U,y).addScaledVector(v0,m),l:U,ph:4.2+C*2.1,wave:2})}),pe.push({lead:0,p:$t.clone(),l:s(0,0,-1),ph:9,wave:-1})}const ka=s(0,0,0),Xt=s(0,0,0),Wo=l0.combs[4],us=Oe(Wo,.42*Wo.halfWidth,17,1),fs=(e,t)=>Q?(Ca(pe[0],t,ka),Ca(pe[1],t,Xt),ka.lerp(Xt,.5),Xt.copy(pe[2].p).lerp(pe[3].p,.5),ka.lerp(Xt,q0(D0-.004,D0+.011,t))):us,jo=(e,t)=>{if(!Yt)return;const o=t*B0,n=Ge[2].u*B0+1.3;for(let y=0;y<xa;y++){const m=pe[y];if($0.copy(m.p),m.wave<0)$0.y-=3*d(n,n+6,o),$0.x+=.15*Math.sin(e*9),H0.set(Math.sin(e*.7),-.3,Math.cos(e*.7)),ct($0,H0,.8*Math.sin(e*5),Ma);else{let C=0,k=1;if(m.lead){Ca(m,t,$0);const z=(m.stop-m.ahead)/S0;C=d(Sa-.012,Sa,t)*(1-d(z-.004,z+.004,t)),k=.45}const U=o-Ge[m.wave].u*B0+.35,g=d(0,.4,U)*(1-d(.55,1.4,U)),p=d(0,3.5,o-n-y*.25);$0.addScaledVector(m.l,(m.lead?3.2:4.2)*g-26*p).addScaledVector(v0,k*1.1*Math.sin(e*1.9+m.ph)+9*p),$0.x+=k*.9*Math.sin(e*1.3+m.ph*2),$0.z+=k*.5*Math.cos(e*2.3+m.ph),H0.copy(m.l).multiplyScalar(1-1.8*p).addScaledVector(M0,.15*C),H0.x+=.35*Math.sin(e*.8+m.ph)-.6*p,H0.y+=-.15+.5*g,ct($0,H0,.25*Math.sin(e*1.7+m.ph),Ma)}m.lead&&m.p.copy($0),Yt.setMatrixAt(y,He),za.setMatrixAt(y,He)}Yt.instanceMatrix.needsUpdate=!0,za.instanceMatrix.needsUpdate=!0},_o=Q?1:2,Ko=lt(qn({top:ve("#4b3a2a"),head:ve("#7e8996"),cere:ve("#c9a23a",.8),beak:ve("#17140f"),pale:ve("#e6d8ba",.8)}),is,_o),ut=s(0,0,0),Io=s(0,0,0),Eo=s(0,0,0),Js=s(0,0,0),Go=(e,t)=>{ba.uFlap.value.x=e*2.6,ba.uFlap.value.y=.78-.6*q0(.19,.23,t)*(1-q0(.37,.42,t));for(let o=0;o<_o;o++){const n=Math.max(0,t-o*.05),y=.006;if(o===0){kt(n,ut),kt(n+y,Io),kt(n-y,Eo),H0.subVectors(Io,Eo),Gt.copy(ut),ut.y+=1.3*Math.sin(e*2.6+1.2);const m=.35*q0(.02,.06,n)*(1-q0(.13,.17,n)),C=.75*q0(.17,.215,n)*(1-q0(.365,.41,n));ct(ut,H0,C-m,1)}else{const m=-60+n*1750,C=k=>d0.zBack(k)+62+.12*Math.max(0,k-260);ut.set(m,104+4*Math.sin(n*40)+1.3*Math.sin(e*2.6+2.2),C(m)),H0.set(10,0,C(m+5)-C(m-5)),ct(ut,H0,-.3,1)}Ko.setMatrixAt(o,He)}Ko.instanceMatrix.needsUpdate=!0},Ze=new D.Group;Ze.matrixAutoUpdate=!1,i.add(Ze);const Aa={uKey:{value:A0.uSunCol.value.clone().multiplyScalar(.5)},uFill:{value:A0.uSkyCol.value.clone().multiplyScalar(.9)},uGlow:{value:new D.Color(1.25,.72,.26)},uDim:{value:0}},Oo=new D.ShaderMaterial({uniforms:{...Aa,uSoft:{value:0}},vertexShader:Mn,fragmentShader:zn,side:D.DoubleSide}),hs=new D.ShaderMaterial({uniforms:{...Aa,uSoft:{value:1}},vertexShader:Mn,fragmentShader:zn,side:D.DoubleSide,transparent:!0,depthWrite:!1}),qe=new D.Group;qe.position.set(0,-.83,-1),Ze.add(qe);const vs=[-1,1].map(e=>{const t=new D.Mesh(Hs(),Oo);return t.position.set(e*.085,.088,-.22),t.scale.set(e,1,1),t.frustumCulled=!1,qe.add(t),t});await a.yield();{const e=await Zs(a,a.core.makeRng(Dt("fur"))),t=new D.Mesh(e.skin,Oo);t.frustumCulled=!1,qe.add(t);const o=new D.Mesh(e.fur,hs);o.frustumCulled=!1,o.renderOrder=7,qe.add(o)}await a.yield();let Nt=null;{const e=y0({aUv:2});for(const t of[-1,1]){const o=e.v(t*1.62,1.12,-1.05,{aUv:[.15,0]}),n=[];for(let y=0;y<=7;y++){const m=(8+y*10)*ie;n.push(e.v(t*(1.62-Math.cos(m)*.62),1.12-Math.sin(m)*.62,-1.05-.1*y/7,{aUv:[.8,y/7*2-1]}))}for(let y=0;y<7;y++)e.tri(o,n[y],n[y+1])}Nt=new D.Mesh(e.geometry(),w0(so,ro,{uFan:{value:new D.Vector4(.6,.62,.66,.14)},uClA:I0.uClA,uClB:I0.uClB},{transparent:!0,depthWrite:!1})),Nt.frustumCulled=!1,Nt.renderOrder=5,Ze.add(Nt)}const Pt=s(0,0,-1),Ba=s(0,0,-1);let Jt=0;const Na=Math.tan(31*ie),Pa=Na*16/9,ps=.052,ms=(e,t,o,n)=>{Ze.matrix.copy(o.matrixWorld),Ze.matrixWorldNeedsUpdate=!0,Pt.set(-o.matrixWorld.elements[8],-o.matrixWorld.elements[9],-o.matrixWorld.elements[10]);const y=e>1e-4?P0((Ba.z*Pt.x-Ba.x*Pt.z)/e,-1.5,1.5):0;Jt+=(y-Jt)*Math.min(1,e*3),Ba.copy(Pt);for(let V=0;V<2;V++){const R=V?1:-1;vs[V].rotation.set(.05*Math.sin(t*1.1+V*2)+.025*Math.sin(t*3.7+V),.05*Math.sin(t*.9+V*1.7)*R,.05*Math.sin(t*1.6+V*3)+.22*Jt)}const m=o.projectionMatrix.elements,C=m[5]>.001?1/m[5]:Na,k=m[0]>.001?1/m[0]:Pa,U=P0(k/Pa,.42,1.15),g=(1-2*ps)*C,p=U*lo.RZ,z=U*lo.RY;qe.scale.setScalar(U),qe.position.y=-g-Math.sqrt(p*p*g*g+z*z)+.005*U*Math.sin(t*2.3),qe.rotation.z=.1*Jt,Nt.scale.set(k/Pa,C/Na,1),Aa.uDim.value=q0(io-.012,io+.012,n),Ze.visible=n>4e-4};await a.yield();const $o={uPale:{value:we},uFlap:{value:new D.Vector4(0,.1,2.4,.7)}},Ho=lt(qn({top:ve("#5d4d3a"),head:ve("#d8cfb8"),cere:ve("#8a8a80"),beak:ve("#2a2620"),pale:ve("#d9c9a4",.8)}),w0(oo,no,$o),3),gs=[{c:s(560,192,420),r:62,a0:.4,w:.1},{c:s(398,236,74),r:50,a0:2.6,w:-.12},{c:s(150,100,95),r:30,a0:1.2,w:.14,s:.8}],Va=s(0,0,0),Zo=s(0,0,0),Yo=e=>{$o.uFlap.value.x=e*.9;for(let t=0;t<3;t++){const o=gs[t],n=o.a0+e*o.w,y=Math.sign(o.w);Va.set(o.c.x+Math.cos(n)*o.r,o.c.y+9*Math.sin(e*.11+t*2),o.c.z+Math.sin(n)*o.r),H0.set(-Math.sin(n)*y,.02*Math.cos(e*.11+t*2),Math.cos(n)*y),ct(Va,H0,.4*y,o.s||1.55),Ho.setMatrixAt(t,He),t===1&&Zo.copy(Va)}Ho.instanceMatrix.needsUpdate=!0};Yo(0);let Ce=null;if(Z){const e=l0.portalSeat.direction,t=s(-e.z,0,e.x).normalize(),o=l0.cleftMouth.clone().addScaledVector(t,19.6).addScaledVector(v0,-6);o.z=d0.wallPoint(o.x,o.y)[2]+.5,ee(An(f0(Re[5]).lerp(f0(Re[3]),.3).multiplyScalar(.7)),ze,[{m:T0(o.clone().addScaledVector(v0,-2.2),.4,3.6,4.4,3.2),seed:.3}]),Ce=new D.Mesh($s(),ya),Ce.position.copy(o),Ce.rotation.order="YXZ",Ce.rotation.y=Math.PI+.35,i.add(Ce),ot(o,10)||(Ce.visible=!1)}await a.yield();const Xo=eo({rng:v,preset:"pollen",count:Math.round(1100*q),box:[64,38,64],colors:["#f6e7a8","#f2c14a","#fff6d8"],size:[.07,.2]});i.add(Xo.object);const Fa=eo({rng:v,preset:"petals",count:Math.round(420*q),box:[56,34,56],colors:l?["#f6c3d0","#ffdfe6","#e895ad"]:["#d01f2b","#e8404a","#8f1119"],size:[.35,.8],lightDir:o0.toArray()});i.add(Fa.object);let Qt=null;S&&(Qt=eo({rng:v,preset:"rain",count:Math.round(700*q),box:[60,44,60],opacity:.45}),i.add(Qt.object)),await a.yield();const ft=v.fork("cloud"),qa=[],ys=L?3:S?11:6+Math.floor(ft()*3);for(let e=0;e<ys;e++)qa.push([ft.range(-900,2e3),L?ft.range(40,160):ft.range(-560,S?110:20),ft.range(S?300:380,1700),ft.range(190,430)]);qa.push([395,30,700,330],[290,24,770,260]);const bs=await(async()=>{const o=[new Float32Array(65536),new Float32Array(65536)],n=v.fork("cloudnoise"),y=new Int32Array(256),m=new Int32Array(256),C=new Float32Array(256);for(let V=0;V<2;V++){const R=o[V];for(let W=0,P=V?16:4,Y=.5;W<4;W++,P*=2,Y*=.55){const B=new Float32Array(P*P);for(let r=0;r<B.length;r++)B[r]=n();for(let r=0;r<256;r++){const c=r/256*P,b=Math.floor(c),x=c-b;y[r]=b%P,m[r]=(b+1)%P,C[r]=x*x*(3-2*x)}for(let r=0;r<256;r++){const c=y[r]*P,b=m[r]*P,x=C[r];for(let F=0,H=r*256;F<256;F++,H++){const j=B[c+y[F]],_=B[c+m[F]],T=B[b+y[F]],$=B[b+m[F]],E=C[F],n0=j+(_-j)*E;R[H]+=Y*(n0+(T+($-T)*E-n0)*x)}(r&63)===63&&await a.yield()}await a.yield()}}const k=.5*(1+.55+.55**2+.55**3),U=new Uint8Array(65536*4),g=255,p=V=>Math.max(0,Math.min(255,((V/k-.5)*1.75+.5)*255));for(let V=0;V<256;V++){for(let R=0;R<256;R++){const W=V*256+R,P=(V+89&g)*256+(R+151&g),Y=(V+33&g)*256+(R+201&g);U[W*4]=p(o[0][W]),U[W*4+1]=p(o[1][W]),U[W*4+2]=p(o[0][P]),U[W*4+3]=p(o[0][Y])}(V&63)===63&&await a.yield()}await a.yield();const z=new D.DataTexture(U,256,256,D.RGBAFormat);return z.wrapS=z.wrapT=D.RepeatWrapping,z.magFilter=D.LinearFilter,z.minFilter=D.LinearMipmapLinearFilter,z.anisotropy=4,z.generateMipmaps=!0,z.colorSpace=D.NoColorSpace,z.needsUpdate=!0,z})(),Da=mn({rng:v,sky:i0,mode:"cumulus",at:qa,puffs:20,height:.5,wind:[1.6,S?3:2.2,.5],opacity:.7,noiseTexture:bs});i.add(Da.object),await a.yield();let Vt=null;if(L){Vt=mn({rng:v,sky:i0,mode:"sea",altitude:-44,relief:104,towers:.42,bump:1.7,softness:.3,noiseTexture:Da.noiseTexture,wind:[2.2,0,.8]});{const e=Vt.uniforms;e.uLit.value.set("#dcd5c7"),e.uShade.value.set("#536ea6"),e.uBottom.value.set("#3a5284"),e.uLight.value.x=.15;const t=e.uSunDir.value;t.y*=.2,t.normalize()}i.add(Vt.object),await a.yield()}const La=(e,t,o,n,y)=>{const m=gn({position:[e.x,e.y,e.z],color:"#ffb648",size:t,intensity:o,halo:1,core:n,flicker:.05,depthBias:.06,near:y,fogAmount:.4});return i.add(m.object),m},Ua=[La(l0.cleftMouth.clone().addScaledVector(he,-1.5),38,1.7,.25,[.25,1.2]),La(l0.cleftMouth.clone().addScaledVector(he,-12),112,3.2,0,[.3,1.1]),La(Ot.clone().addScaledVector(he,-6),120,2.6,0,[.3,1.1])],Ra=Ls({rng:v,position:l0.cleftMouth.toArray(),direction:[-he.x,-he.y,-he.z],radius:7,count:Math.round(12*(.6+.4*q)),length:80,width:[2.2,9.5],color:"#ffc468",intensity:.9,falloff:1.2});i.add(Ra.object),await a.yield();{const e=a.core.makeRng(Dt("bee-line:"+h)),t=ge.NK,o=t-1,n=ge.RMIN,y=ge.FA,m=ge.BEND,C=ge.SPREAD,k=aa[3],U=xe(oe[Ke.north],Me);await a.yield();const g=xe(oe[Ke.ladder],ne),p=U*S0,z=ne*S0,V=g*S0;await a.yield();const R=xe(oe[Ke.vista],Ie)*S0;await a.yield();const W=u0.posAtDist(p),P=u0.tangentAtDist(p,s(0,0,0)),Y=k.distanceTo(W)/3,B=new D.CubicBezierCurve3(k.clone(),k.clone().lerp(W,1/3),W.clone().addScaledVector(P,-Y),W.clone()),r=[],c=[0];for(let w=0;w<=60;w++)r.push(B.getPoint(w/60));for(let w=p+3;w<V-1;w+=3)r.push(u0.posAtDist(w));r.push(u0.posAtDist(V));for(let w=1;w<r.length;w++)c.push(c[w-1]+r[w].distanceTo(r[w-1]));const b=c[c.length-1],x=c[60],F=o*x/b,H=o*(x+z-p)/b,j=o*(x+R-p)/b,_=o*(x+Ie*S0-p)/b,T=[9,.7,1.22],$=5.1,E=new Float32Array((t+2)*4),n0=new Float32Array(t+2),G=s(0,0,0),F0=[];for(let w=0,K=1;w<t;w++){const X=b*w/o;for(;K<c.length-1&&c[K]<X;)K++;G.copy(r[K-1]).lerp(r[K],P0((X-c[K-1])/Math.max(1e-6,c[K]-c[K-1]),0,1)),E[(w+1)*4]=G.x,E[(w+1)*4+1]=G.y,E[(w+1)*4+2]=G.z}for(let w=0;w<3;w++)E[w]=2*E[4+w]-E[8+w],E[(t+1)*4+w]=2*E[t*4+w]-E[(t-1)*4+w];for(let w=1;w<=t;w++){const K=E[w*4]-E[w*4-4],X=E[w*4+2]-E[w*4-2],J=E[w*4+4]-E[w*4],a0=E[w*4+6]-E[w*4+2];n0[w]=Math.atan2(K*a0-X*J,K*J+X*a0)/Math.max(1,.5*(Math.hypot(K,X)+Math.hypot(J,a0)))}for(let w=1;w<=t;w++)E[w*4+3]=.25*n0[w-1]+.5*n0[w]+.25*n0[w+1];for(let w=0;w<t+2;w++)F0.push(new D.Vector4(E[w*4],E[w*4+1],E[w*4+2],E[w*4+3]));await a.yield();const g0=[0,0,0],p0=[0,0,0],W0=(w,K,X)=>{const J=P0(w,0,o-.001),a0=Math.floor(J),I=J-a0,s0=a0*4;for(let Ue=0;Ue<3;Ue++){const Xa=E[s0+Ue],Ja=E[s0+4+Ue],Qa=E[s0+8+Ue],fn=E[s0+12+Ue],hn=Qa-Xa,vn=2*Xa-5*Ja+4*Qa-fn,pn=-Xa+3*Ja-3*Qa+fn;g0[Ue]=.5*(2*Ja+hn*I+vn*I*I+pn*I*I*I),p0[Ue]=.5*(hn+2*vn*I+3*pn*I*I)}p0[0]+=1e-4;const c0=1/Math.hypot(p0[0],p0[1],p0[2]);p0[0]*=c0,p0[1]*=c0,p0[2]*=c0;let m0=-p0[2],C0=p0[0]+1e-4;const _0=1/Math.hypot(m0,C0);m0*=_0,C0*=_0;const J0=-C0*p0[1],K0=C0*p0[0]-m0*p0[2],Le=m0*p0[1],me=K.C.z>5?1:0,Be=T[1]+T[2]*q0(_,j,J),Ne=K.C.y+(K.C.z-10*me)*J+me*Be,Ft=1+C*(1-q0(0,F,J)),qt=b0(E[s0+7],E[s0+11],I);let gt=(K.C.x*Math.cos(Ne)+me*T[0]*Math.cos(Be))*Ft;const Za=(K.C.x*Math.sin(Ne)+me*T[0]*Math.sin(Be))*Ft,Ya=Math.abs(gt)-n;qt*gt>0&&Ya>0&&(gt=Math.sign(gt)*(n+Ya/(1+m*Math.abs(qt)*Ya))),X.set(g0[0]+m0*gt+J0*Za,g0[1]+K0*Za,g0[2]+C0*gt+Le*Za);const Ps=K.z>=1?1:0;return X.lerp(K.A,1-q0(0,y,J)).lerp(K.B,q0(b0(j,H,K.z-2*Ps),o,J))},Z0=8,L0=3.6,Ae=new Map,z0=[],V0=(w,K,X)=>Math.floor(w/Z0)+512+(Math.floor(K/Z0)+512)*1024+(Math.floor(X/Z0)+512)*1048576;for(let w=0,K=de[1]*S0+40;w<=K;w+=1.5){u0.posAtDist(w,G),z0.push(G.x,G.y,G.z);const X=z0.length/3-1;for(let J=0;J<8;J++){const a0=V0(G.x+(J&1?L0:-L0),G.y+(J&2?L0:-L0),G.z+(J&4?L0:-L0));let I=Ae.get(a0);I||Ae.set(a0,I=[]),I[I.length-1]!==X&&I.push(X)}}await a.yield();const Y0=w=>{for(let K=0;K<=o;K+=.1){W0(K,w,G);const X=Ae.get(V0(G.x,G.y,G.z));if(X)for(let J=0;J<X.length;J++){const a0=X[J]*3,I=z0[a0]-G.x,s0=z0[a0+1]-G.y,c0=z0[a0+2]-G.z;if(I*I+s0*s0+c0*c0<L0*L0)return!1}}return!0},le=xo.geometry.attributes.position;let X0=0;for(let w=0;w<le.count;w++)X0=Math.max(X0,le.getY(w));const j0=.74*X0,te=at.map(w=>{const K=w.m.elements;return s(K[12]+K[4]*j0,K[13]+K[5]*j0,K[14]+K[6]*j0)}),ht=[0,0,0,1,1,6,6,7].map(w=>l0.combs[w]),ja=()=>{const w=e.pick(ht),K=e.range(14,w.depth*.75),X=w.halfWidth*Math.pow(1-K/w.depth*(K/w.depth),.62);return Oe(w,e.range(-.6,.6)*X,K,0)},ta=Math.round(480*(.55+.45*q)),De=Math.round(ta*.0583),vt=[];for(let w=0;w<ta;w++){const K=w%20<17,X=w%2;for(let J=0;J<20;J++){const a0=K?$*Math.pow(e(),.6):4+36*Math.pow(e(),1.15),I={A:e.pick(te),B:ja(),C:s(a0,e.range(0,6.2832),e.range(-.035,.035)+(K?10:0)),z:2*X+Math.min(.999,e()*1.8),near:0};if(Y0(I)){I.near=1e9;for(let s0=F;s0<=H;s0+=.5){const c0=I.C.z-(K?10:0),m0=I.C.y+c0*s0;I.near=Math.min(I.near,K?Math.hypot(T[0]+a0*Math.cos(m0),a0*Math.sin(m0)):a0)}vt.push({A:I.A,B:I.B,C:I.C,z:I.z,near:I.near,t:[e(),e.range(27,34),I.z,e.range(1,1.2)],seed:e(),pollen:X?0:1});break}}(w&15)===15&&await a.yield()}await a.yield(),vt.sort((w,K)=>w.near-K.near);const _a=vt.slice(0,De),en=vt.slice(De),tn=Nn(),an=Os(),As=Math.hypot(1+.3,.7+.25),on=[0,0,0],Bs=w=>{const K=w.attributes.position;let X=0;for(let J=0;J<K.count;J++)X=Math.max(X,Math.hypot(K.getX(J),K.getY(J),K.getZ(J)));return X},Ka=z0.length/3-1,N0=z0.slice(),Ia=new Map,nn=s(0,0,0),pt=[0,0],ae=2*Z0,sn=(w,K,X)=>V0(w*Z0/ae,K*Z0/ae,X*Z0/ae);for(let w=1.5*(Ka+1);w<S0;w+=1.5)u0.posAtDist(w,G),N0.push(G.x,G.y,G.z);u0.posAtDist(S0,G),N0.push(G.x,G.y,G.z);let mt=0;for(let w=0,K=N0.length/3-1;w<K;w++){const X=w*3,J=I=>Math.floor((Math.min(N0[X+I],N0[X+3+I])-ae)/ae)*ae,a0=I=>Math.max(N0[X+I],N0[X+3+I])+ae;for(let I=J(0),s0=a0(0);I<=s0;I+=ae)for(let c0=J(1),m0=a0(1);c0<=m0;c0+=ae)for(let C0=J(2),_0=a0(2);C0<=_0;C0+=ae){const J0=sn(I,c0,C0);let K0=Ia.get(J0);K0||Ia.set(J0,K0=[]),K0.push(w)}u0.posAtDist(.5*(1.5*w+Math.min(S0,1.5*w+1.5)),G),mt=Math.max(mt,Math.hypot(G.x-.5*(N0[X]+N0[X+3]),G.y-.5*(N0[X+1]+N0[X+4]),G.z-.5*(N0[X+2]+N0[X+5])))}await a.yield();const Ns=(w,K,X,J)=>{const a0=Ia.get(sn(w,K,X));if(pt[0]=pt[1]=ae*ae,a0)for(let I=a0.length-1;I>=0&&(J||a0[I]>=Ka);I--){const s0=a0[I]*3,c0=N0[s0+3]-N0[s0],m0=N0[s0+4]-N0[s0+1],C0=N0[s0+5]-N0[s0+2],_0=w-N0[s0],J0=K-N0[s0+1],K0=X-N0[s0+2],Le=P0((_0*c0+J0*m0+K0*C0)/Math.max(1e-9,c0*c0+m0*m0+C0*C0),0,1),me=_0-c0*Le,Be=J0-m0*Le,Ne=K0-C0*Le,Ft=me*me+Be*Be+Ne*Ne,qt=a0[I]>=Ka?1:0;Ft<pt[qt]&&(pt[qt]=Ft)}};let rn=0,Ea=0,Ye=0;const Ga=w=>(Ns(w.x,w.y,w.z,Ea>0),Math.min(pt[1]-rn,pt[0]-Ea)),Oa=(w,K,X)=>(W0(w-.03,K,nn),W0(w+.03,K,X).add(nn).multiplyScalar(.5)),$a=(w,K,X,J,a0,I,s0,c0,m0,C0,_0)=>{const J0=(c0-X)*(c0-X)+(m0-J)*(m0-J)+(C0-a0)*(C0-a0);if(Math.min(I,_0)>=J0||J0<1e-6)return!0;const K0=.5*(K+s0);Oa(K0,w,G);const Le=G.x,me=G.y,Be=G.z,Ne=Ga(G);return Ne>=0&&$a(w,K,X,J,a0,I,K0,Le,me,Be,Ne)&&$a(w,K0,Le,me,Be,Ne,s0,c0,m0,C0,_0)},Ha=(w,K,X)=>{rn=(K+mt)*(K+mt),Ea=X>0?(X+mt)*(X+mt):0;let J=0,a0=0,I=0,s0=0;for(let c0=0,m0=Ye;c0<o;c0++,m0=(m0+1)%o){if((c0===0||m0===0)&&(Oa(m0,w,G),J=G.x,a0=G.y,I=G.z,s0=Ga(G),s0<0))return Ye=m0,!1;Oa(m0+1,w,G);const C0=G.x,_0=G.y,J0=G.z,K0=Ga(G);if(K0<0||!$a(w,m0,J,a0,I,s0,m0+1,C0,_0,J0,K0))return Ye=m0,!1;J=C0,a0=_0,I=J0,s0=K0}return!0},ln=async(w,K)=>{const X=w.C.y,J=[Ye,Ye],a0=(I,s0)=>{const c0=I>0?0:1;return w.C.y=X+I*s0,Ye=J[c0],K()?!0:(J[c0]=(Ye+o-1)%o,!1)};for(let I=1;I*.01<=Math.PI;I++){for(const s0 of[1,-1])if(a0(s0,I*.01)){let c0=(I-1)*.01,m0=I*.01;for(let C0=0;C0<4;C0++){const _0=.5*(c0+m0);a0(s0,_0)?m0=_0:c0=_0}return w.C.y=X+s0*m0,!0}(I&15)===15&&await a.yield()}return w.C.y=X,!1};for(const[w,K]of[[_a,tn],[en,an]]){const X=Bs(K);for(let J=0;J<w.length;J++){const a0=w[J],I=2+As+X*a0.t[3];Ha(a0,I,0)?(J&15)===15&&await a.yield():(on[await ln(a0,()=>Ha(a0,I,I))?0:await ln(a0,()=>Ha(a0,I,0)&&Y0(a0))?1:2]++,await a.yield())}}await a.yield();const cn={uPale:I0.uPale,uBeeDark:I0.uBeeDark,uShade:{value:new D.Vector4(150,340,6,2.2)},uWing:{value:new D.Vector4(.5,.9,.5,420)},uGold:{value:s(1,.78,.36)},uLine:{value:F0},uLay:{value:new D.Vector4(o,F,H,_)},uRope:{value:new D.Vector4(T[0],T[1],T[2],j)}},dn=w0(Sn,Cn,cn),un=w0(Sn,Cn,cn,{transparent:!0,depthWrite:!1});st(_a,tn,dn,un),await a.yield(),st(en,an,dn,un),i.userData.beeLine={bees:vt.length,near:_a.length,turned:on,length:b,lay:[o,F,H],from:k.clone(),join:W.clone(),turn:u0.posAtDist(z),to:u0.posAtDist(V),at:(w,K,X)=>{const J=vt[w],a0=K/J.t[1]+J.t[0],I=a0-Math.floor(a0),s0=J.z>=1?1-I:I,c0=Math.min(s0/.2,1);return W0(o*(.8*s0+2*(s0-.2*(c0*c0*c0-.5*c0*c0*c0*c0)-Math.max(s0-.2,0))),J,X)}}}await a.yield(),d0.setPortalLight("#ffd27a",1.9,1.7),Ro(0,0,null),jo(0,0),Go(0,0),await i0.prewarm(a.renderer,null,i),i.userData.probe={hornets:()=>pe.filter(e=>e.wave>=0).map(e=>({p:e.p.clone(),size:1.29*Ma})),ball:()=>({p:$t.clone(),size:6}),griffon:()=>({p:Zo.clone(),size:34}),gear:()=>i.userData.gearPts.map((e,t)=>({p:e,size:t<3?3.5:1.6})),buzzard:()=>({p:Gt.clone(),size:26})};const Ta=l0.combs[5],ws=s(Ta.center.x+6,Ta.center.y-3,Ta.center.z),xs=s(150,140,0),Ms=s(330,190,-20),Wa=s(-80,175,0),zs=s(200,188,22),ea=s(0,0,0),Jo=s(0,0,0),ke=l0.combs[3],Ss=u0.pointAt(D0+22/S0).addScaledVector(s(-u0.tangentAt(D0+22/S0,M0).z,0,M0.x).normalize(),8),Cs=l0.cleftMouth.clone().addScaledVector(he,-6),ks=new D.Vector2,Qo=s(0,0,0);return{scene:i,path:u0,duration:B0,pace:e=>1-.14*dt(e,Me-.035,Me+.045,.03)+.12*dt(e,Ie+.03,ne-.05,.04)-.12*dt(e,ne-.06,ne+.06,.03)-.16*dt(e,de[0]-.01,Tt(.905),.05),title:u?"The Honey Cliff, First Sun":L?"The Honey Cliff above the Cloud":S?"The Honey Cliff after Rain":l?"The Honey Cliff, Harvest":"The Honey Cliff",camera:{fov:62,near:.3,far:6400,lookAhead:24,sway:.6,bank:.4},pois:[{at:ws,from:.05,to:Me+.06,weight:.62},{at:xs,from:Me+.045,to:Ie+.005,weight:.5},{at:()=>Gt,from:Ie-.01,to:Ie+.1,weight:.62},{at:Ms,from:.385,to:ne-.021,weight:.5},{at:Wa,from:ne-.11,to:Je-.03,weight:.6,fade:.5},{at:Wa,from:ne-.09,to:Je-.03,weight:.6,fade:.5},{at:Wa,from:ne-.07,to:Je-.03,weight:.6,fade:.5},{at:zs,from:Je-.075,to:Je-.012,weight:.6,fade:.3},{at:()=>ea,from:ce+.004,to:xt+.01,weight:.4},{at:()=>Jo,from:xt-.03,to:O||!Q?Ee+.012:Ee-.004,weight:.66},O||!Q?{at:Ss,from:Ee-.012,to:D0+.022,weight:.6}:{at:fs,from:Ee-.046,to:D0+.0325,weight:.62,fade:.2},...O?[{at:Po,from:D0+.008,to:D0+.05,weight:.7}]:[],{at:Cs,from:D0+(O?.043:.03),to:wt,weight:.65}],portal:{shape:"circle",radius:7,color:"#ffd98a",glow:1.1,revealDistance:220,tilt:!0},post:{exposure:u?1:.93,bloom:{strength:.38,radius:.6,threshold:1.05},grade:{saturation:1,contrast:1.05,tint:u?"#fff0e6":"#ffffff",shadowTint:"#070b16",vignette:.3,grain:.02,aberration:0}},ride:"none",companion:"none",update(e,t,o,n){be.uTime.value=t,I0.uStory.value=n*B0,a.renderer&&a.renderer.getDrawingBufferSize&&(A0.uPx.value=be.uAir.value.w=a.renderer.getDrawingBufferSize(ks).y||450),i0.update(e,t,o),U0.update(e,t,o),d0.setProgress(n),O&&d0.setAbscond(P0((n*B0-Ht)/6,0,1)),d0.update(e,t,o);const y=n*S0+34;u0.posAtDist(y,ea),u0.tangentAtDist(y,M0),ea.x+=-M0.z*13,ea.z+=M0.x*13,u0.pointAt(n,Qo);const m=P0((Qo.x-30-ke.center.x)*ke.tangent.x,-ke.halfWidth*1.1,ke.halfWidth*.5);if(Jo.set(ke.center.x+ke.tangent.x*m,ke.top-10.5,ke.center.z+ke.tangent.z*m),Fo.uniforms.uFan.value.w=.11*(1-.4*q0(wt-.03,wt+.012,n)),Go(t,n),Ro(t,n,n>4e-4?Pt.set(-o.matrixWorld.elements[8],-o.matrixWorld.elements[9],-o.matrixWorld.elements[10]):null),jo(t,n),ms(e,t,o,n),Ce){const k=Math.max(0,Math.sin(t*.8))>.3?Math.pow(Math.max(0,Math.sin(t*7)),2):0;Ce.rotation.x=.45*k,Ce.rotation.y=Math.PI+.35+.2*Math.sin(t*.5)}Yo(t),Xo.update(e,t,o),Fa.update(e,t,o),Fa.setOpacity(1-q0(.07,.15,n)),Qt&&Qt.update(e,t,o),It&&It.update(e,t,o),Et&&Et.update(e,t,o);const C=q0(ce-.03,ce+.07,n);Ua[1].uniforms.uIntensity.value=3.2*(.07+.93*C),Ua[2].uniforms.uIntensity.value=2.6*C,Ra.uniforms.uIntensity.value=.9*(.3+.7*C),xo.count=n>.2?In:Kn,zo.count=n>.25?Gn:En,Xn.count=n>de[1]?$n:n>.3?Hn:On,Jn.count=n>.3?Zn:Yn,zo.visible=ua.visible=go.visible=n<.3,ha.visible=n<de[1]+.01,Kt.count=n>.16&&n<ce?Kt.userData.n:0;{const k=n*B0>Ht-.6;for(let U=0;U<3;U++)ga[U].geometry.instanceCount=k?ns[U]:No[U];ss.geometry.instanceCount=ga[0].geometry.instanceCount,Vo.geometry.instanceCount=Vo.userData.wings.geometry.instanceCount=n>.18&&n<de[1]?rs:0}for(const k of Ua)k.update(e,t,o);Ra.update(e,t),Da.update(e,t,o),Vt&&Vt.update(e,t,o)},dispose(){d0.dispose(),i0.dispose&&i0.dispose()}}}};export{or as default};
