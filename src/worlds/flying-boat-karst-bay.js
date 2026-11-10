import*as b from"three";import{makePath as Va,makeRng as Ga,hashSeed as Ha}from"../kit/core.js";import{makeSky as Ka,skyDirection as Na}from"../kit/sky.js";import*as Io from"../kit/water.js";import{buildHero as Xa,buildTower as _o,swiftLine as Oo,swiftAt as Ne,swiftFlock as Za,swiftWob as mt,swiftMouth as $a,buildSwiftlets as Ya}from"../parts/flying-boat-karst-bay.js";const Tt=["#2F8F78","#17574C","#C9C6B8","#1E3B24","#F2B27A","#2B3340","#B3402A"],vt=m=>Math.min(1,Math.max(0,m)),N=(m,p,W)=>{const F=vt((W-m)/(p-m));return F*F*(3-2*F)},ce=(m,p,W)=>m+(p-m)*W,Xe=`
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1.,0.)), f.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), f.x), f.y); }
float fbm3(vec2 p){ return vnoise(p)*0.55 + vnoise(p*2.13+7.1)*0.3 + vnoise(p*4.31+3.7)*0.15; }
`,Qa=`
uniform vec3 uSunDir;
varying vec3 vN; varying vec3 vL; varying vec3 vW; varying float vDepth; varying vec2 vInst;
void main(){
  mat4 m = modelMatrix;
  #ifdef USE_INSTANCING
  m = modelMatrix * instanceMatrix;
  #endif
  vec4 wp = m * vec4(position, 1.);
  vec3 s2 = vec3(dot(m[0].xyz, m[0].xyz), dot(m[1].xyz, m[1].xyz), dot(m[2].xyz, m[2].xyz));
  vN = mat3(m) * (normal / max(s2, vec3(1e-6))); vL = position; vW = wp.xyz;
  float rad = sqrt(max(s2.x, 1e-6));
  vec2 sx = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  vInst = vec2(rad, clamp(dot(wp.xz - m[3].xz, sx) / max(rad, 1.), -1., 1.));     // the tower's radius; how far toward the sun on its own roof
  vec4 mvPosition = viewMatrix * wp;
  vDepth = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
}`,Ja=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uShadeCol; uniform vec3 uHorizonCol; uniform vec3 uRockCol; uniform vec3 uLeafCol;
uniform vec3 uHazeSun; uniform vec3 uHazeAway; uniform float uHaze;
varying vec3 vN; varying vec3 vL; varying vec3 vW; varying float vDepth; varying vec2 vInst;
${Xe}
float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
float sabs(float x){ return sqrt(x*x + 0.02); }
// where bedding joint k lies (units of the mean bed, 17 m): the corridor towers' own beds of unequal thickness that pinch out
float jointAt(float k, float u){ return k + 0.5 + 0.62*(h11(k*1.31 + 0.7) - 0.5) + 0.34*(vnoise(vec2(u*0.013 + k*7.3, k*3.1)) - 0.5); }
// one water stain hanging from a ledge (the corridor towers' own): d metres below the ledge, row its id, cw the spacing of
// possible runs, thr the share left out, a length range and the widest width
float run(float u, float d, float row, float cw, float thr, float lmin, float lmax, float wmax){
  float q = u/cw + h11(row*1.37 + cw)*9.;
  float ci = floor(q), cf = fract(q);
  float hx = h21(vec2(ci, row*3.1 + cw)), hy = h21(vec2(ci + hx*17.3 + 3.1, row*3.1 + cw));
  float k = fract(hx*57.3 + hy*13.1);
  float len = mix(lmin, lmax, hy);
  float w = mix(0.3, 1., k)*wmax*(1. - 0.6*smoothstep(0., len, d));
  float cx = (cf - (0.25 + 0.5*k))*cw + (vnoise(vec2(ci*7.7 + row, d*0.22)) - 0.5)*0.9;
  return step(thr, hx)*(1. - smoothstep(w*0.3, w, abs(cx)))*(1. - smoothstep(len*0.4, len, d))*smoothstep(-0.05, 0.3, d);
}
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 L = normalize(uSunDir);
  // metres round the tower (the seam is a vertical line, where streaks and flutes are vertical too) and metres up
  float u = atan(vL.z, vL.x + 1e-5) * vInst.x * 0.9 + vInst.x * 7.3, y = vW.y;
  float fw = fwidth(y) + abs(dFdx(vW.x)) + abs(dFdx(vW.z));
  float tfade = 1. - smoothstep(0.7, 3., fw), cfade = 1. - smoothstep(2.5, 9., fw);
  float wall = 1. - smoothstep(0.35, 0.75, abs(n.y));
  float big = fbm3(vec2(u*0.03, y*0.045) + 3.);
  float jfade = 1. - smoothstep(2.4, 9., fw), ffade = 1. - smoothstep(1.6, 5.5, fw), sfade = 1. - smoothstep(1.4, 4., fw);     // (beds read as bands for kilometres: a parting's shadow broadens with range instead of fading)
  // the corridor towers' weathered limestone: warm grey stone under a rain-blackened, lichened skin (dark grey to grey-green)
  // hanging in irregular curtains, paler ribs between broad flutes, a few pale scars, beds of unequal thickness that pinch
  // out (a parting along part of each joint), distinct black and rust runs from a bed's top or the shoulder. Far off the
  // skin settles to its mean: a distant tower stays dark and solid.
  float f0 = sabs(fbm3(vec2(u*0.15, y*0.034))*2. - 1.), f1 = sabs(fbm3(vec2((u + 1.2)*0.15, y*0.034))*2. - 1.);
  float fl = (0.35 + 0.65*smoothstep(0.25, 0.6, vnoise(vec2(u*0.017 + 5., y*0.021))))*ffade*wall;
  // (with antialiasing a sliver is shaded outside its own area and its varyings run on past their ends: the height is kept
  // from going negative here, or the exponents below would run away, and the colour is capped at the end)
  float rimD = min(max(0.955 - vL.y, 0.)*max(y, 0.)/max(vL.y, 0.02), 600.);                   // metres below the shoulder
  float bq = (y + (vnoise(vec2(u*0.011, 1.)) - 0.5)*7. + (vnoise(vec2(u*0.06, 3.)) - 0.5)*1.6)/17.;
  float bk = floor(bq);
  float bed = bq < jointAt(bk, u) ? bk : bk + 1.;
  float jlo = jointAt(bed - 1., u), jhi = jointAt(bed, u);
  float bm = max(jhi - jlo, 0.02)*17.;
  float dTop = (jhi - bq)*17., dBot = (bq - jlo)*17.;
  float jrow = dTop < dBot ? bed : bed - 1., jd = dTop < dBot ? dTop : -dBot;
  float thick = smoothstep(2.5, 8., bm);
  float nearF = 1. - smoothstep(250., 600., vDepth);                        // the second rank next to the path: darker, its beds and runs as bold as the Sentinel's
  vec3 rock = uRockCol*(0.5 + 0.42*big)*mix(1., 0.8 + 0.2*smoothstep(0., 0.55, f0), fl)*(0.9 + 0.2*vnoise(vec2(u*0.9, y*0.6))*tfade)*mix(1., 0.76, nearF);
  rock *= 1. + (vnoise(vec2(u*0.2, y*0.21) + 9.) - 0.5)*0.34*nearF*(1. - smoothstep(1.2, 3.6, fw));     // joint blocks' tone, close to
  // every bed has a tone of its own (one a little darker, the next paler), meeting its neighbour's half-way at the joint: the
  // banding that tells a far stack is bedded limestone, there until a bed is thinner than a pixel
  float bedO = dTop < dBot ? bed + 1. : bed - 1.;
  float bedT = mix(0.5*(h11(bed*5.3 + 1.7) + h11(bedO*5.3 + 1.7)), h11(bed*5.3 + 1.7), smoothstep(0., max(fw*0.8, 0.3), abs(jd))) - 0.5;
  rock *= 1. + bedT*0.3*wall*thick*(1. - smoothstep(5., 15., fw));
  float under = max(exp(-rimD/40.), 0.6*exp(-dTop/9.)*thick);
  float st = fbm3(vec2(u*0.1 + 11., y*0.021))*0.75 + vnoise(vec2(u*0.42 + 3., y*0.05))*0.35;
  float skin = mix(0.74, smoothstep(0.4, 0.6, st + 0.15*under), ffade)*mix(1., 0.75 + 0.25*under, wall);
  rock *= mix(0.72, 1., ffade);                                             // (with the grooves' own shade, which a far wall no longer shows)
  float scar = smoothstep(0.62, 0.72, fbm3(vec2(u*0.035 + bed*0.9, y*0.05) + 23.))*(1. - smoothstep(2.4, 7., fw))*wall;
  skin *= 1. - 0.85*scar;
  rock = mix(rock, rock*vec3(0.27, 0.31, 0.31), skin*mix(0.9, 1., nearF)*(0.3 + 0.7*wall));     // (the skin's curtains at full contrast on the rank next to the path)
  rock = mix(rock, rock*vec3(0.86, 1., 0.8), 0.6*smoothstep(0.35, 0.7, vnoise(vec2(u*0.05 + 40., y*0.06)))*skin);
  rock = mix(rock, rock*vec3(1.12, 1.04, 0.9), scar*0.7);
  float jline = smoothstep(0.36, 0.66, vnoise(vec2(u*0.038 + jrow*7.3, jrow*5.1)))*jfade*wall*thick;
  rock *= 1. - mix(0.3, 0.7, nearF)*jline*smoothstep(-0.2 - fw*0.3, 0.15, jd)*exp(-max(jd, 0.)/max(1.5, fw*1.3));     // the parting's shadow, never thinner than a pixel
  float streak = max(run(u, dTop, bed, 12., 0.55, 7., 30., 2.2), run(u, dTop + bm, bed + 1., 12., 0.6, 7., 30., 2.2));
  streak = max(streak, run(u, rimD, 77., 13., 0.4, 16., 55., 3.2))*wall*sfade;
  rock = mix(rock, rock*vec3(0.2, 0.21, 0.24), streak*0.9);
  float rust = max(run(u + 5., dTop, bed + 40., 19., 0.66, 5., 16., 3.6), run(u + 5., rimD, 91., 23., 0.5, 8., 26., 4.6))*wall*sfade;
  rock = mix(rock, vec3(0.25, 0.07, 0.02)*(0.6 + 0.6*big), rust*0.8);
  rock = mix(rock, rock*vec3(1.1, 0.9, 0.74), 0.5*exp(-rimD/16.)*smoothstep(0.35, 0.7, big)*wall);
  // the jungle cap: every up-facing roof and terrace, and ragged curtains hanging from the shoulder down the top of the wall
  float drip = vnoise(vec2(u*0.09, 1.7)), drip2 = vnoise(vec2(u*0.31, 4.2));
  float capLine = 0.87 - 0.22*drip*drip - 0.08*drip2 - 0.05*smoothstep(700., 2600., vDepth) + (vnoise(vec2(u*0.9, 7.)) - 0.5)*0.05*tfade + (vnoise(vec2(u*2.7, y*0.2)) - 0.5)*0.03*tfade;     // (the curtain's foot frays into strands close to: no jagged painted fringe)
  float roof = smoothstep(0.2, 0.45, n.y)*smoothstep(0.3, 0.4, vL.y);
  float leaf = max(smoothstep(capLine-0.015, capLine+0.015, vL.y), roof);
  leaf = max(leaf, smoothstep(0.66, 0.8, vnoise(vec2(u*0.06, y*0.035+5.)))*smoothstep(0.3, 0.6, vL.y)*0.7*(1. - nearF));     // (painted bushes on the wall far off only: close to they were round blobs)
  // crown heads on the roof: two sets of jittered cells of unlike size, the grid itself bent by a slow warp (no tiling to read)
  vec2 cq = vW.xz/9. + (vec2(vnoise(vW.xz*0.031), vnoise(vW.xz*0.031 + 17.)) - 0.5)*1.5; vec2 cf = fract(cq) - 0.5;
  float crownB = 1. - smoothstep(0.2, 0.5, length(cf + (vec2(h21(floor(cq)), h21(floor(cq) + 7.3)) - 0.5)*0.4));
  vec2 cq2 = vec2(vW.x*0.8 + vW.z*0.6, vW.z*0.8 - vW.x*0.6)/5.7 + 3.3; vec2 cf2 = fract(cq2) - 0.5;
  crownB = max(crownB, 0.8*(1. - smoothstep(0.16, 0.46, length(cf2 + (vec2(h21(floor(cq2) + 3.1), h21(floor(cq2) + 11.7)) - 0.5)*0.5)))*(1. - smoothstep(1.6, 5., fw)));
  crownB = mix(0.55, crownB, cfade);
  float mott = vnoise(vW.xz*0.13 + y*0.1)*vnoise(vW.xz*0.33 - y*0.2);
  vec3 lf = uLeafCol*(0.3 + 1.05*mott)*mix(0.62, 1.3, crownB*roof);
  // light, as on the corridor towers: relief from the height field in sun and in shade
  float ndl = dot(n, L);
  float rel = (f1 - f0)*1.9*fl;
  float groove = mix(1., 0.74 + 0.26*smoothstep(0.1, 0.6, f0), fl);
  vec3 shd = mix(uShadeCol, vec3(dot(uShadeCol, vec3(0.3333))), 0.5);
  float sunSide = 0.5 + 0.5*dot(normalize(n.xz + vec2(1e-4)), normalize(L.xz + vec2(1e-4)));
  vec3 amb = (shd*(1.3 + 0.3*n.y) + uSkyCol*(0.37 + 0.4*max(n.y, 0.)))*mix(1., 0.8 + 0.22*smoothstep(0., 0.6, sunSide), wall) + uHorizonCol*(0.1 + 0.16*sunSide)*wall;
  float cjour = max(dot(normalize(vW.xz - cameraPosition.xz + vec2(1e-4)), normalize(L.xz + vec2(1e-4))), 0.);
  amb += (mix(uShadeCol, vec3(dot(uShadeCol, vec3(0.3333))), 0.15)*1.05 + uSkyCol*0.15 - uHorizonCol*0.05)*wall*(1. - smoothstep(0.15, 0.6, sunSide))*(1. - 0.5*cjour*cjour);     // jade-blue shade, as on the corridor towers (less of it seen against the light)
  vec3 colR = rock*(uSunCol*smoothstep(-0.05, 0.5, ndl)*(0.3 + 0.24*max(ndl, 0.))*clamp(1. + rel*1.25, 0.45, 1.65)*(0.3 + 0.7*groove) + amb*clamp(1. + rel*0.85, 0.6, 1.45)*groove);
  float side = mix(sunSide*2. - 1., vInst.y, roof);
  float litL = smoothstep(-0.2, 0.55, mix(ndl, 0.25 + 0.5*crownB, roof*0.6))*mix(0.42, 1.1, smoothstep(-0.9, 0.7, side));
  float skyL = dot(uSkyCol + shd, vec3(0.3333));
  vec3 colL = lf*(uSunCol*litL*0.85 + shd*1.2 + uSkyCol*0.6*max(n.y, 0.) + skyL*(1.5 + 1.1*n.y))
    + vec3(0.26, 0.31, 0.04)*uSunCol*0.2*litL*litL*(0.35 + mott*2.2)*mix(0.5, 1.2, crownB);
  vec3 col = mix(colR, colL, leaf);
  // the foot: wet near-black notch, a pale barnacle line, slop and foam
  // (the tide band is five or six metres of wet near-black rock and never under a pixel or two, so every foot stands on a dark base)
  float tideTop = 5.8 + 1.8*(vnoise(vec2(u*0.12, 4.)) - 0.5) + min(fw, 5.)*1.3;
  col *= mix(0.2, 1., smoothstep(tideTop - 1.4, tideTop, y));
  col = mix(col, vec3(0.5, 0.48, 0.4)*(shd*2. + uSkyCol*0.6 + uSunCol*0.12), 0.5*(1. - smoothstep(0.3, 1.1, abs(y - 2.6)))*(1. - smoothstep(0.5, 2., fw)));
  col = mix(col, vec3(0.6, 0.58, 0.5)*(uSkyCol + uSunCol*0.2), 0.5*(1. - smoothstep(0.2, 1.1 + min(fw, 5.)*0.25, y)));
  vec3 V = normalize(vW - cameraPosition);
  float toSun = max(dot(normalize(V.xz + vec2(1e-5)), normalize(uSunDir.xz + vec2(1e-5))), 0.);
  float haze = 1. - exp(-vDepth*uHaze);
  vec3 hz = mix(uHazeAway, uHazeSun, toSun*toSun);
  col = mix(col, mix(hz, hz*vec3(0.72, 0.98, 0.74), 0.6*leaf), clamp(haze, 0., 0.72)*(1. - 0.62*leaf));     // haze tints and lightens a far tower; it never dissolves it, and its cap stays green
  gl_FragColor = vec4(clamp(col, vec3(0.), uSunCol*1.1 + 0.3), 1.);
}`,e0=`
attribute vec4 aC; attribute vec4 aT;                 // centre and radius; tone, sway phase, sunward share (-1..1), squash
uniform float uTime;
varying vec3 vN; varying vec3 vW; varying vec3 vT; varying float vDepth;
void main(){
  vec3 p = position * vec3(aC.w, aC.w*aT.w, aC.w);
  float top = max(position.y + 0.4, 0.);
  p.x += sin(uTime*1.1 + aT.y)*0.5*top; p.z += cos(uTime*0.9 + aT.y*1.7)*0.4*top;
  vec3 wp = aC.xyz + p;
  vN = normalize(vec3(position.x*0.85, position.y*0.8 + 0.45, position.z*0.85)); vW = wp; vT = vec3(aT.x*(position.y < -0.2 ? 0.5 : 0.8 + 0.35*position.y), aT.z, 0.);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  vDepth = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
}`,t0=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uShadeCol; uniform vec3 uLeafCol;
uniform vec3 uHazeSun; uniform vec3 uHazeAway; uniform float uHaze;
varying vec3 vN; varying vec3 vW; varying vec3 vT; varying float vDepth;
${Xe}
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.)), L = normalize(uSunDir);
  float mott = vnoise(vW.xz*0.5 + vW.y*0.4)*vnoise(vW.xz*1.3 - vW.y);
  vec3 lf = uLeafCol*(0.32 + 1.1*mott)*clamp(vT.x, 0., 1.6);
  float ndl = dot(n, L);
  float litL = smoothstep(-0.2, 0.55, ndl)*mix(0.42, 1.1, smoothstep(-0.9, 0.7, vT.y));
  vec3 shd = mix(uShadeCol, vec3(dot(uShadeCol, vec3(0.3333))), 0.4);
  float skyL = dot(uSkyCol + shd, vec3(0.3333));
  vec3 col = lf*(uSunCol*litL*0.85 + shd*1.2 + uSkyCol*0.6*max(n.y, 0.) + skyL*(1.5 + 1.1*n.y)) + vec3(0.26, 0.31, 0.04)*uSunCol*0.2*litL*litL*(0.35 + mott*2.2)*clamp(vT.x, 0., 1.6);
  vec3 V = normalize(vW - cameraPosition);
  float toSun = max(dot(normalize(V.xz + vec2(1e-5)), normalize(uSunDir.xz + vec2(1e-5))), 0.);
  float haze = 1. - exp(-vDepth*uHaze);
  vec3 hz = mix(uHazeAway, uHazeSun, toSun*toSun);
  col = mix(col, mix(hz, hz*vec3(0.72, 0.98, 0.74), 0.6), clamp(haze, 0., 1.)*0.5);
  gl_FragColor = vec4(clamp(col, vec3(0.), uSunCol*0.8 + 0.3), 1.);
}`,uo=`
attribute vec3 aPos; attribute vec4 aSize; attribute vec4 aCol;
uniform float uTime; uniform float uFlash;
varying vec2 vUv; varying vec4 vCol; varying float vSeed; varying float vFogK; varying float vNear; varying float vTear; varying float vRain;
#include <fog_pars_vertex>
void main(){
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  float flash = step(1.5, aSize.z);
  vec3 c = aPos; c.x += sin(uTime*0.03 + aSize.w*6.3)*aSize.x*0.06; c.z += uTime*0.6*fract(aSize.w*7.3)*(1. - flash);
  // a skein or veil (fog share >= 0.5) looked down on lies level in the air, its long side across the view: a layer of
  // mist across the towers' middles, never a puff standing on the water; seen from its own height it faces the eye
  float tearV = step(0.5, aSize.z)*(1. - flash);
  vec3 toE = cameraPosition - c; float hd = max(length(toE.xz), 1.);
  float flatK = tearV*smoothstep(0.07, 0.28, toE.y/max(length(toE), 1.));
  vec3 upV = normalize(mix(mix(up, vec3(0.,1.,0.), 0.6), vec3(-toE.x, 0., -toE.z)/hd, flatK) + vec3(0., 1e-3, 0.));
  vec3 wp = c + right*position.x*aSize.x + upV*position.y*aSize.y*mix(1., 1.6, flatK);
  vUv = position.xy; vCol = aCol; vSeed = aSize.w; vFogK = mix(aSize.z, 0.2, flash);
  vCol.a *= mix(1., uFlash*(0.5 + 0.5*sin(aSize.w*40. + floor(uTime*0.4)*2.4)), flash);
  vTear = step(0.5, aSize.z)*(1. - flash);
  vRain = step(0.255, aSize.z)*step(aSize.z, 0.275);                    // a rain shred under the shower's base
  // a skein right under the eye thins (seen from above at close range it is a floe on the water); further off, across the
  // middle-distance towers, it keeps its body and hides their feet
  float dSk = length(cameraPosition.xz - c.xz);
  float veil = step(0.85, aSize.z)*step(aSize.z, 0.95);                   // a long veil across a tower (fog share 0.9) keeps its body from above too
  vCol.a *= mix(1., 0.16, smoothstep(-10., 100., cameraPosition.y - c.y)*(1. - smoothstep(150., 400., dSk))*vTear*(1. - veil));
  vCol.a *= mix(1., 1.5, smoothstep(300., 520., dSk)*vTear);                 // and beyond 300 m a skein is half as dense again: a veil across the towers, not a puff
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  vNear = smoothstep(6., 0.25*aSize.x + 30., -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,mo=`
uniform float uTime; uniform float uFade;
varying vec2 vUv; varying vec4 vCol; varying float vSeed; varying float vFogK; varying float vNear; varying float vTear; varying float vRain;
#include <fog_pars_fragment>
${Xe}
void main(){
  float r = length(vUv*2.);
  vec2 q = vUv*mix(mix(vec2(2.6), vec2(8.5, 0.8), vRain), vec2(5.2, 1.7), vTear) + vec2(vSeed*31., vSeed*17.) + vec2(uTime*0.012, uTime*0.05*vRain);
  q.x += vRain*vUv.y*2.6;                                                  // (a shred's streaks slant downwind)
  float n = fbm3(q);
  float a = (1. - smoothstep(0.25, 1., r + (0.5 - n)*mix(0.9, 1.5, vTear))) * smoothstep(mix(0.18, 0.37, vTear), mix(0.6, 0.73, vTear), n);
  // skeins are torn right through: open holes and long rents that drift
  float holes = smoothstep(0.34, 0.58, vnoise(q*vec2(1.3, 2.9) + vec2(uTime*0.02, 9.)));
  a *= mix(1., 0.4 + 0.6*holes, vTear);
  // a rain shred hangs from the base as a fringe that narrows downward; its streaks slant downwind, each ends at its own
  // level, and its sides are ragged: no straight side, no level foot
  float lean = vUv.x + 0.3*vUv.y + (n - 0.5)*0.12;
  float foot = -0.46 + 0.55*vnoise(vec2(lean*6. + vSeed*17., 4.3));
  float fringe = (1. - smoothstep(0.16, 0.46, abs(vUv.x)*(1.25 - 1.1*vUv.y) + (n - 0.5)*0.16)) * smoothstep(foot, foot + 0.4, vUv.y) * (0.4 + 0.6*smoothstep(0.25, 0.7, vnoise(vec2(lean*11. + vSeed*31., 1.7))));
  a *= mix(1., fringe, vRain);
  a *= 1. - smoothstep(0.36, 0.5, max(abs(vUv.x), abs(vUv.y)));          // never a square edge
  a *= vCol.a * vNear * uFade;
  if (a < 0.003) discard;
  vec3 col = vCol.rgb * (0.75 + 0.5*n);
  col *= mix(1., 1.6 - 0.6*smoothstep(-0.4, 0.3, vUv.y), vRain);                // its trailing foot is lit, its root is the slate of the base
  col *= mix(vec3(1.), mix(vec3(0.6, 0.72, 0.86), vec3(1.12, 1.04, 0.9), smoothstep(-0.22, 0.26, vUv.y + (n - 0.5)*0.25)), vTear);     // a skein's top catches the light, its underside is cool
  gl_FragColor = vec4(col, a);
  #ifdef USE_FOG
    float ff = (1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth)) * vFogK;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, clamp(ff, 0., 1.));
  #endif
}`,o0=`
attribute vec4 aA; attribute vec3 aOff;
uniform float uTime; uniform float uLift; uniform float uLoop; uniform float uRate; uniform float uSize; uniform float uFar; uniform float uNear;
uniform vec3 uP0; uniform vec3 uP1; uniform vec3 uP2;
varying float vShade; varying float vFade;
#include <fog_pars_vertex>
void main(){
  float t = uLoop > 0.5 ? fract(aA.x + uTime*uRate*(0.8 + 0.4*aA.w)) : clamp(uLift*1.5 - aA.x*0.5, 0., 1.);
  vec3 c = mix(mix(uP0, uP1, t), mix(uP1, uP2, t), t);
  vec3 tg = (uP1 - uP0)*(1. - t) + (uP2 - uP1)*t + vec3(0., 0., 1e-3);
  vec3 f = normalize(tg);
  vec3 s = normalize(cross(f, vec3(0., 1., 0.)) + vec3(1e-3, 0., 0.));
  vec3 u = cross(s, f);
  float spread = uLoop > 0.5 ? 1. : (0.25 + 1.6*t);
  c += (s*aOff.x + u*aOff.y + f*aOff.z) * spread;
  c += s*sin(uTime*1.3 + aA.y*40.)*0.6 + u*sin(uTime*1.7 + aA.z*40.)*0.5;
  float flap = sin(uTime*(9. + 6.*aA.w) + aA.y*60.);
  float sc = uSize * (0.75 + 0.5*aA.z);
  if (uLoop > 0.5) sc *= smoothstep(0., 0.04, t) * (1. - smoothstep(0.96, 1., t));
  float dEye = length(c - cameraPosition);
  sc *= mix(uNear, 1., smoothstep(6., 55., dEye));
  vFade = 1. - smoothstep(uFar*0.4, uFar, dEye);                             // a flock thins out with distance: birds near the lens, never pepper on a far wall
  float wx = abs(position.x);
  vec3 p = c + (s*position.x*(1. - 0.25*wx*abs(flap)) + f*position.z + u*(wx*0.45 + wx*wx*0.5)*flap) * sc;
  vShade = 0.55 + 0.45*flap*wx + 0.25*step(wx, 0.14);
  vec4 mvPosition = viewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,a0=`
uniform vec3 uCol; uniform vec3 uRim;
varying float vShade; varying float vFade;
#include <fog_pars_fragment>
void main(){
  if (vFade < 0.02) discard;
  gl_FragColor = vec4(uCol*vShade + uRim*max(vShade - 0.7, 0.), vFade);
  #include <fog_fragment>
}`,n0=`
attribute float aFlex; attribute vec2 aPan;          // aPan: on a sail, (0..1 from one batten up to the next, 0..1 from luff to leech); else x < 0
uniform float uTime;
varying vec3 vN; varying vec3 vCol; varying vec3 vL; varying vec2 vPan; varying float vKind;
#include <fog_pars_vertex>
void main(){
  mat4 m = modelMatrix;
  float ph = 0.;
  #ifdef USE_INSTANCING
  m = modelMatrix * instanceMatrix; ph = instanceMatrix[3][2]*0.37;
  #endif
  vec3 p = position;
  float fl = max(aFlex, 0.);
  p.x += fl * (sin(uTime*1.6 + p.y*0.55 + ph)*0.32 + sin(uTime*4.3 + p.y*1.9 + p.z + ph)*0.07 + 0.35);
  vec4 wp = m * vec4(p, 1.);
  vec3 nl = normal;
  // a sail panel bellies between its battens: the normal of that belly, smooth across the panel's facets
  if (aPan.x > -0.5) nl = normalize(vec3(1., -0.95*cos(3.1416*aPan.x)*sin(3.1416*min(aPan.y*1.1, 1.)), 0.22*sin(3.1416*aPan.x)*cos(3.1416*aPan.y)));
  vN = mat3(m) * nl; vCol = color; vL = position; vPan = aPan;
  vKind = aFlex < -1.5 ? 2. : (aFlex < -0.5 ? 1. : 0.);                  // 0 hull and cloth, 1 a lamp, 2 pen water: the same at a triangle's three corners (a sail's flex is not, and read past a sliver's end with antialiasing it once turned cloth into a lamp)
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,s0=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uShadeCol; uniform float uLamp; uniform float uTime; uniform float uPenK;
varying vec3 vN; varying vec3 vCol; varying vec3 vL; varying vec2 vPan; varying float vKind;
#include <fog_pars_fragment>
${Xe}
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
  if (!gl_FrontFacing) n = -n;
  float fwLamp = fwidth(vL.x) + fwidth(vL.y) + fwidth(vL.z);
  vec3 col, vc = clamp(vCol, 0., 1.);
  if (vKind > 1.5) {
    // a fish farm's pens: net-green water a shade lighter than the bay, the netting showing against the walkways, ripples,
    // and a feeding ring opening now and then in some of the pens
    vec2 pc = vec2((vL.x + 12.)/6., (vL.z + 20.)/6.667); vec2 pf = fract(pc) - 0.5; vec2 pid = floor(pc);
    float edge = max(abs(pf.x), abs(pf.y))*2.;
    float fwp = fwidth(vL.x) + fwidth(vL.z);
    vec2 mg = abs(fract(vL.xz*1.5) - 0.5);
    float mesh = (1. - smoothstep(0.05, 0.11 + fwp*1.5, min(mg.x, mg.y)))*(1. - smoothstep(0.1, 0.4, fwp))*smoothstep(0.3, 0.95, edge);
    float rip = vnoise(vL.xz*1.2 + vec2(uTime*0.5, -uTime*0.33))*0.6 + vnoise(vL.xz*3.1 - vec2(uTime*0.7, uTime*0.4))*0.4;
    float hp = h21(pid + 3.7), ph = fract(uTime*0.31 + hp*7.);
    float rr = length(pf - (vec2(h21(pid + 1.3), h21(pid + 9.1)) - 0.5)*0.4);
    float ring = (1. - smoothstep(0.012, 0.05, abs(rr - ph*0.36)))*(1. - ph)*step(0.45, hp)*(1. - smoothstep(0.2, 0.6, fwp));
    vec3 lightW = (uSkyCol*1.15 + uShadeCol*0.6 + uSunCol*0.14)*uPenK;
    col = vc*lightW*(0.78 + 0.44*rip)*(1. - 0.3*mesh)*mix(1., 0.74, smoothstep(0.55, 1., edge)) + (uSkyCol + uSunCol*0.15)*0.22*ring;
  }
  else if (vKind > 0.5) {
    // a lamp smaller than a pixel keeps its light, not its brightness: no lone hot sample that sparks (and blooms) with antialiasing
    col = vc * uLamp * clamp(0.5 / max(fwLamp, 1e-4), 0.16, 1.);
  }
  else {
    float grain = 0.8 + 0.4*vnoise(vL.zy*vec2(3., 9.) + vL.x);
    vec3 alb = vc * grain;
    float sail = step(-0.5, vPan.x);
    // sail cloth: weave, stains run down from each batten, sewn patches (double cloth: paler in sun, darker against it), the
    // bamboo batten itself and the seam shadow under it
    float sv = clamp(vPan.x, 0., 1.);
    float bat = 1. - smoothstep(0.035, 0.085, min(sv, 1. - sv));
    float stain = smoothstep(0.35, 0.8, vnoise(vec2(vL.z*1.7, vL.y*0.35) + 4.))*(1. - sv);
    vec2 pq = vec2(vL.z*0.62, vL.y*0.5 + floor(vL.z*0.62)*0.37); vec2 pf = fract(pq); float ph = h21(floor(pq) + 3.1);
    float sewn = step(0.74, ph)*(1. - smoothstep(0.42, 0.5, abs(pf.x - 0.5)*(1.1 + ph)))*(1. - smoothstep(0.4, 0.5, abs(pf.y - 0.5)*(1.6 - ph*0.5)));
    float weave = 0.9 + 0.2*vnoise(vL.zy*vec2(14., 5.));
    alb = mix(alb, alb*weave*(1. - 0.42*stain)*(1. + 0.5*sewn*(ph - 0.84)*6.), sail);
    alb *= mix(1., 0.8 + 0.36*sv, sail);                                   // each panel hangs from its batten: fuller and paler toward the top
    alb.g += 0.05*alb.r*sail;
    alb = mix(alb, vec3(0.44, 0.34, 0.19)*grain, sail*bat*0.85);            // pale bamboo battens
    alb *= 1. - sail*0.3*(1. - smoothstep(0.06, 0.2, sv))*(1. - bat);
    alb *= mix(1., 1. + 0.22*smoothstep(0.75, 1., vPan.y), sail);            // a paler, sun-bleached leech
    float ndl = max(dot(n, uSunDir), 0.);
    float back = max(dot(-n, uSunDir), 0.) * sail;
    // the cloth is thin: lit from either side it glows with its own colour, warmer and fuller where it is single (mid-panel),
    // not at battens or patches; strongest against the light
    vec3 thru = (alb*vec3(1.6, 1.3, 1.0) + alb.r*vec3(0.02, 0.07, 0.01))*(0.35 + 0.65*sin(3.1416*sv))*(1. - 0.7*sewn)*(1. - bat);
    col = alb*(uSunCol*ndl*mix(0.5, 0.42, sail) + mix(uShadeCol, uSkyCol, 0.5 + 0.5*n.y)*mix(0.8, 0.78, sail)) + thru*uSunCol*(back*0.5 + ndl*0.17)*sail;
    col *= mix(0.45, 1., smoothstep(-0.3, 1.2, vL.y));
    col = clamp(col, vec3(0.), uSunCol*1.2 + 0.3);
  }
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,i0=`
attribute vec4 aXf; attribute vec4 aDim;
uniform float uTime; uniform vec2 uSunXZ; uniform vec4 uOwn; uniform float uOwnK;
varying vec2 vUv; varying vec4 vDim; varying vec2 vWxz; varying vec3 vFx; varying float vEye;
#include <fog_pars_vertex>
void main(){
  float kind = aDim.z, ang = aXf.z, len = aDim.y, wid = aDim.x, sunw = 0.;
  vec2 org = aXf.xy;
  if ((kind > 4.5 && kind < 5.5) || (kind > 8.5 && kind < 9.5)) {
    // (a cat's-paw wraps over 760 m at its own 7 to 12 m/s; a cloud's shadow, kind 9, over 2600 m at 5 m/s)
    float wrapL = kind > 8.5 ? 2600. : 760., spd = kind > 8.5 ? 5. : 7. + 5.*fract(aXf.w*7.3);
    float ph = fract(uTime*spd/wrapL + aXf.w*3.7);
    org += vec2(sin(ang), cos(ang))*(ph - 0.5)*wrapL;
    sunw = smoothstep(0., 0.14, ph)*(1. - smoothstep(0.86, 1., ph));
  }
  if (kind > 7.5 && kind < 8.5) { org = uOwn.xy; ang = uOwn.z; }           // our own mirror image: laid from the aircraft's keel each frame
  if (kind > 1.5 && kind < 2.5) {
    vec2 d = cameraPosition.xz - org; float dl = max(length(d), 1.); d /= dl;
    ang = atan(d.x, d.y + 1e-5);
    float r = wid*0.5;
    len = min(min(dl*0.94, aDim.y*1.5 + r), max(dl - r, 0.)*aDim.y/(max(cameraPosition.y, 1.) + aDim.y) + r);
    if (aDim.w > 2.5) len = clamp(dl*0.62, 18., 170.);     // a lamp's streak: the lamps burn by night only, when ripples draw each streak out far beyond its mirror image
    sunw = dot(d, uSunXZ);
  }
  float c = cos(ang), s = sin(ang);
  vec2 l = vec2(position.x*wid, position.z*len);
  // tide lines wind (three waves, up to a tenth of their length off the axis): never a ruled line across the bay
  if (kind > 0.5 && kind < 1.5) l.x += (sin(position.z*5.3 + aXf.w*40.)*0.55 + sin(position.z*11.9 + aXf.w*91. + uTime*0.05)*0.3 + sin(position.z*23.7 + aXf.w*17.)*0.15)*len*0.095;
  vec2 w = org + vec2(l.x*c + l.y*s, -l.x*s + l.y*c);
  // (the mirror image of a point as high above the water as the eye lies half-way between the eye's foot and its own: the
  // whole plan is drawn in toward the eye's foot by uOwnK)
  if (kind > 7.5 && kind < 8.5) w = cameraPosition.xz + (w - cameraPosition.xz)*uOwnK;
  vUv = vec2(position.x + 0.5, position.z); vDim = vec4(wid, len, kind, aDim.w); vWxz = w;
  float dist = length(cameraPosition - vec3(w.x, 0., w.y)); vEye = dist;
  vFx = vec3((1. - smoothstep(300., 1000., dist))*smoothstep(0.03, 0.14, cameraPosition.y/max(dist, 1.)), sunw, aXf.w);   // x: tide lines fade at grazing angles, where flecks could only read as a ruled line
  vec4 mvPosition = viewMatrix * vec4(w.x, 0.3 + kind*0.03, w.y, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,r0=`
uniform float uTime; uniform vec3 uShadowCol; uniform vec3 uFoamCol; uniform vec3 uGoldCol; uniform vec3 uSailCol; uniform vec3 uMint;
uniform float uShadowA; uniform float uReflA; uniform float uWake; uniform float uPawA; uniform vec3 uPawCol; uniform float uGlitA;
uniform vec4 uOwn; uniform vec3 uOwnCol; uniform float uCloudA; uniform vec4 uWalls[6]; uniform vec4 uEnd; uniform vec3 uEndCol; uniform vec4 uLane;
uniform vec3 uWallCol; uniform vec3 uWestCol; uniform float uWestA; uniform vec3 uGlitCol; uniform vec3 uLampCol; uniform vec3 uWakeCol; uniform float uMirA; uniform float uLampA; uniform float uWakeDark; uniform float uWakeK; uniform float uRunZ;
varying vec2 vUv; varying vec4 vDim; varying vec2 vWxz; varying vec3 vFx; varying float vEye;
#include <fog_pars_fragment>
${Xe}
float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
// one train of wavelets fixed to the water (kind 7): crests lie across the corridor in rows about a wavelength apart, bend
// and die out, but no two rows are alike: each crest has its own drawn place in its row (up to 0.15 of the spacing either
// way), its own drawn breadth, and its own drawn lengths along the row (one row's lit faces never line up with the
// next row's), so the lit faces are lenses some four times wider than long with soft pointed ends that make neither a
// ladder of equal rungs nor a grid. Returns (crest 0..1, the crest's envelope along its row 0..1).
vec2 wavelet(vec2 p, float lam, float t, float sd){
  float rot = 0.26*sin(sd*1.9 + 0.6);                                        // each train runs a little off the corridor's line: crests cross and fork
  p = vec2(p.x*cos(rot) - p.y*sin(rot), p.x*sin(rot) + p.y*cos(rot));
  float q = p.y/lam + (8.*(vnoise(vec2(p.x/(lam*2.2) + sd, p.y/(lam*2.6))) - 0.5) + 9.*(vnoise(vec2(p.x/(lam*6.) + sd*3., p.y/(lam*9.) + 5.)) - 0.5) + t)/6.2832;      // (the rows are bent by bounded warps)
  float k = floor(q), f = q - k, hk = h11(k*1.37 + sd*3.1), hw = h11(k*2.11 + sd*5.7 + 0.4);
  float crest = 1. - smoothstep(0.1, 0.24 + 0.1*hw, abs(f - 0.5 - (hk - 0.5)*0.3));      // (nothing at a row's edge: 0.15 + 0.34 < 0.5)
  return vec2(crest, smoothstep(0.22, 0.78, vnoise(vec2(p.x/(lam*(0.8 + 0.7*hw)) + hk*37. + sd, k*0.71 - t*0.12))));
}
// one layer of the path of light's glints (kind 7): the water is cut into cells (cell: metres across and along), each
// file of cells slid along by its own drawn share of a cell. A cell rolls its own dice against the path's density there
// (dens 0..1) and, if it wins, holds one glint at a drawn place, of a drawn size, winking at its own drawn rate: bright
// points with no rows or columns, crowded where the path is dense and thinning out to nothing at its sides
float glint(vec2 p, vec2 cell, float t, float sd, float dens){
  vec2 q = p/cell + vec2(sd*0.37, sd*0.61);
  q.y += h11(mod(floor(q.x), 199.)*0.713 + sd);
  vec2 id = floor(q), f = q - id;
  vec2 hid = mod(id, 199.)*0.0101 + sd*0.13;                                 // (a cell's number kept small, so the hash keeps its digits)
  float h1 = h21(hid), h2 = h21(hid + vec2(3.7, 1.9)), h3 = h21(hid*1.9 + 9.1), h4 = h21(hid*2.3 + vec2(5.3, 1.1)), rad = 0.2 + 0.2*h3;
  float wink = smoothstep(-1., 0., sin(t*(1.5 + 4.*h2) + h1*40.) + (h3 - 0.5)*0.8) * smoothstep(h4 - 0.06, h4 + 0.06, dens);
  return (1. - smoothstep(rad*0.55, rad, length(f - 0.5 - (vec2(h1, h2) - 0.5)*(1. - 2.*rad))))*wink;
}
void main(){
  float kind = vDim.z;
  float n = fbm3(vWxz*0.03 + vec2(uTime*0.02, vFx.z*9.));
  float ex = abs(vUv.x - 0.5)*2.;
  float xm = (vUv.x - 0.5)*vDim.x, ym = vUv.y*vDim.y;
  float fwz = fwidth(vWxz.y), fwx = fwidth(vWxz.x);
  // (the true range from the eye to this point of the water: vEye comes from the quad's corners, and across a wide quad it
  // reads tens of metres even under the float)
  float dEye = length(cameraPosition - vec3(vWxz.x, 0., vWxz.y));
  vec3 col; float a;
  if (kind > 8.5) {
    // a cloud's shadow drifting over the open bay: a broad soft-edged darkening, torn at its rim; none in the corridor
    float nn = fbm3(vWxz*0.0045 + vec2(uTime*0.004, vFx.z*9.));
    a = (1. - smoothstep(0.3, 1., length(vUv - vec2(0.5))*2. + (nn - 0.5)*1.1)) * vFx.y * uCloudA;
    a *= 1. - (1. - smoothstep(230., 380., abs(vWxz.x)))*(1. - smoothstep(520., 700., abs(vWxz.y - uRunZ - 60.)));
    col = uShadowCol;
  } else if (kind > 7.5) {
    // our own mirror image racing below: the flying boat's plan (hull, wing, floats, tail) as a pale shape on the water, pulled
    // about and torn into fine slivers by the ripples; it shows low down only, right under the float's nose and the bow
    // (within a dozen metres of the eye: further out the water mirrors sky and cliffs, and the wing's image spread over the
    // corridor read as pale blotches)
    float rp = vnoise(vec2(xm*1.3 + uTime*0.7, ym*5.2 - uTime*2.3)), rp2 = vnoise(vec2(xm*3.1 - uTime*0.5, ym*11. + uTime*1.9));
    float ax = xm + (rp - 0.5)*1.6, az = ym - 15. + (rp2 - 0.5)*0.7;
    float hullW = 1.75*sqrt(max(1. - az*az/210., 0.));
    float sh = (1. - smoothstep(hullW - 0.5, hullW + 0.3, abs(ax)))*step(abs(az), 14.4);
    float chord = mix(3.15, 1.5, clamp(abs(ax)/20., 0., 1.));
    sh = max(sh, (1. - smoothstep(chord - 0.5, chord + 0.3, abs(az - 0.15 - 0.05*abs(ax))))*(1. - smoothstep(19.3, 20.2, abs(ax))));
    sh = max(sh, (1. - smoothstep(0.35, 0.95, abs(abs(ax) - 11.9)))*(1. - smoothstep(2.4, 3.2, abs(az - 1.3))));
    sh = max(sh, (1. - smoothstep(0.9, 1.5, abs(az + 12.4)))*(1. - smoothstep(4.8, 5.6, abs(ax))));
    a = sh * smoothstep(0.46, 0.7, rp*0.6 + rp2*0.4) * (1. - smoothstep(8., 19., dEye)) * uOwn.w;
    col = uOwnCol*(0.6 + 0.3*rp2);
  } else if (kind < 0.5) {
    // a tower's shadow: a stripe as wide as the tower, straight-sided and hard-edged at the foot, its edge softening with the
    // distance the light has run (a penumbra), its far end fading out: a cast shadow, never a drifting blot
    a = (1. - smoothstep(mix(0.88, 0.5, vUv.y), 1., ex + (n - 0.5)*0.2*(0.25 + 0.75*vUv.y))) * (1. - smoothstep(0.62, 1., vUv.y + (n - 0.5)*0.2)) * smoothstep(0., 0.04, vUv.y);
    a *= uShadowA * (0.85 + 0.15*vnoise(vWxz*0.25 + uTime*0.15)) * mix(0.72, 1., smoothstep(4., 30., cameraPosition.y));     // (seen from low over it a shadowed reach keeps its jade)
    col = uShadowCol;
  } else if (kind < 1.5) {
    float line = (1. - smoothstep(0.1, 1., ex));
    // leaves, petals and froth as small flecks and winding threads (never blobs): finer close to, coarser far off
    float nearK = 1. - smoothstep(12., 40., vEye);
    float fs = mix(mix(7., 10., nearK), 1.7, smoothstep(25., 140., vEye));
    float fleck = smoothstep(0.58, 0.7, fbm3(vWxz*fs + vec2(uTime*0.04, vFx.z*7.)));
    float thr = 1. - abs(vnoise(vec2(xm*1.4 + vFx.z*30., ym*0.22 + uTime*0.03))*2. - 1.);
    fleck = max(fleck, smoothstep(0.9, 0.98, thr)*0.8*smoothstep(15., 42., vEye));     // threads only beyond 40 m: close to, a thread would swell into a blob
    float gaps = smoothstep(0.38, 0.62, vnoise(vec2(ym*0.045 + vFx.z*20., 3.)));
    a = line*line * fleck * gaps * smoothstep(0., 0.12, vUv.y) * (1. - smoothstep(0.88, 1., vUv.y)) * mix(0.52, 0.3, smoothstep(60., 160., vEye)) * vFx.x * smoothstep(9., 26., vEye);
    // small pale petals among the froth (pink-white and straw), never dark blotches
    float pet = vnoise(vWxz*mix(2.9, 6.5, nearK) + 5.);
    vec3 petal = mix(vec3(0.86, 0.62, 0.6), vec3(0.74, 0.72, 0.46), step(0.5, fract(pet*9.)));
    col = mix(uFoamCol, petal*(uFoamCol.g/0.7), smoothstep(0.62, 0.74, pet)*0.4);
  } else if (kind < 2.5) {
    float sc = 24./clamp(vEye, 12., 400.) + 0.25;                                  // ripples stay slivers at any range
    float rip = vnoise(vec2(xm*0.05*sc + vFx.z*9., ym*0.42*sc - uTime*0.5));
    float rip2 = vnoise(vec2(xm*0.16*sc, ym*1.3*sc + uTime*0.8));
    float edge = (1. - smoothstep(0.3, 1., ex + (n - 0.5)*0.7));
    float torn = mix(1., smoothstep(0.28, 0.7, rip*0.7 + rip2*0.3), 0.3 + 0.7*vUv.y);
    float tower0 = step(1.5, vDim.w);                                              // the Pierced Tower: its dark mirror runs right up to the eye
    float gold = smoothstep(-0.15, 0.55, vFx.y)*(1. - tower0);        // the Pierced Tower's face toward the run-in is in shade: a dark mirror
    // (a sunlit face's streak comes within 12 m of a low eye on the descent; dark mirrors keep off the water under the eye)
    a = edge * (1. - smoothstep(mix(0.7, 0.93, tower0), 1., vUv.y)) * smoothstep(0., 0.03, vUv.y) * mix(torn, 1., tower0*0.6) * mix(2.5, 1., smoothstep(6., 90., cameraPosition.y)) * smoothstep(mix(7., 2., tower0), mix(mix(34., 12., gold*(1. - smoothstep(6., 14., cameraPosition.y))*smoothstep(4.5, 8., cameraPosition.y)), 8., tower0), vEye);
    col = mix(uShadowCol*1.5, uGoldCol, gold);
    a *= uReflA * mix(1., 0.5, gold);
    if (vDim.w > 0.5 && vDim.w < 1.5) {                                             // a junk: her sails' colour wobbling under her, right up to the eye
      col = uSailCol; a = edge * (1. - smoothstep(0.75, 1., vUv.y)) * smoothstep(0., 0.03, vUv.y) * torn * smoothstep(4., 14., vEye) * uReflA * 2.6 * (0.6 + 0.4*sin(ym*1.3 + uTime*2. + rip*5.)); }
    if (vDim.w > 2.5) {                                                             // a squid boat's lamps: a long green-white streak of winking slivers, wandering as it comes
      float wig = (vnoise(vec2(ym*0.07 + vFx.z*5., uTime*0.35)) - 0.5)*(0.25 + 0.9*vUv.y);
      float core = 1. - smoothstep(0.05, 0.9, abs(vUv.x - 0.5 + wig)*2.);
      float sliv = smoothstep(0.4, 0.68, vnoise(vec2(xm*0.9 + vFx.z*9., ym*1.1*sc - uTime*1.3)));        // (slivers narrower than the streak: it never reads as a ruled bar)
      col = uLampCol; a = core * sliv * (0.35 + 0.65*exp(-vUv.y*3.5)) * (1. - smoothstep(0.6, 1., vUv.y)) * smoothstep(0., 0.03, vUv.y) * smoothstep(5., 16., vEye) * uLampA; }
  } else if (kind < 3.5) {
    float env = (1. - smoothstep(uWake - 36., uWake + 12., ym)) * smoothstep(0., 24., ym) * (1. - smoothstep(0.9, 1., vUv.y)) * (1. - smoothstep(0.72, 1., ex));
    float wave = sin((ym + abs(xm)*1.25)*0.62 - uTime*1.5 + (n - 0.5)*3. + (vnoise(vec2(xm*0.2, ym*0.15)) - 0.5)*4.);     // crests wander: no ruled chevrons
    float inV = (1. - smoothstep(-1.5, 1.5, abs(xm) - (2.5 + ym*0.075)));
    float sgn = xm < 0. ? -1. : 1., farK = smoothstep(25., 90., vEye);
    // a narrow V whose arms wander (each on its own, more the further they have run) and break into flecks: never two ruled lines
    float wob = (vnoise(vec2(ym*0.085 + sgn*3.7, sgn*5.1 + uTime*0.03)) - 0.5)*(2.4 + ym*0.02) + (vnoise(vec2(ym*0.31 - uTime*0.12, sgn*9.3)) - 0.5)*1.3;
    float armD = abs(abs(xm) - (2.5 + ym*0.075) - (n - 0.5)*2.2 - wob - sin(ym*0.33 + xm*0.2 - uTime*0.7)*0.3);
    float arm = 1. - smoothstep(0.05, 0.5 + ym*0.004 + fwz*0.6, armD);
    float gaps = smoothstep(0.3 + 0.2*farK, 0.62 + 0.14*farK, vnoise(vec2(xm*0.4 + 9., ym*0.3 - uTime*0.05))) * (0.55 + 0.45*vnoise(vec2(ym*1.3, xm*0.7 + uTime*0.3)));
    gaps *= smoothstep(0.25, 0.6, vnoise(vec2(ym*0.055 + sgn*11., 2.3 - uTime*0.02)) + 0.35*(1. - farK));          // whole stretches of an arm die away
    gaps *= 0.35 + 0.65*smoothstep(0.35, 0.62, vnoise(vec2(ym*0.8 - uTime*0.4, xm*0.9)));                         // flecks, not a band
    float fine = 0.05 + 0.95*smoothstep(0.5, 0.7, vnoise(vec2(xm*6. + 1., ym*4.5 - uTime*1.2))*0.7 + vnoise(vec2(xm*1.7 + 5., ym*1.3 - uTime*0.5))*0.3);      // close to, froth is flecks a hand wide: never a smooth blob
    float bright = clamp(arm*gaps, 0., 1.)*mix(fine, 0.32, farK);              // broken foam, not a painted line
    // and between the arms the crests of the wake's own waves carry broken froth: pale chevrons running on ahead of us
    bright = max(bright, smoothstep(0.78, 0.98, wave)*inV*smoothstep(0.42, 0.7, vnoise(vec2(xm*0.8 + 4., ym*1.1 - uTime*0.5)))*smoothstep(0.3, 0.6, vnoise(vec2(xm*0.13, ym*0.07 + 7.)))*fine*mix(0.55, 0.3, farK));
    float dark = (1. - smoothstep(-0.95, -0.3, wave))*0.4*(0.35 + 0.65*inV)*uWakeDark*smoothstep(0.2, 0.5, vnoise(vec2(xm*0.11 + 2., ym*0.09)));
    a = env * max(min(bright*uWakeK, 0.95), dark) * smoothstep(3., 12., vEye);
    col = mix(uShadowCol*2.2, uWakeCol, bright/(bright + dark + 1e-3));
  } else if (kind > 6.5) {
    // THE CORRIDOR'S WATER, one sheet from the mouth to the tunnel, the same rule at every height of the eye. The eye's ray,
    // reflected at this point of the water, runs on level over it and meets the east wall, the west wall or the Pierced
    // Tower's face (uWalls: each wall tower's place, half length, height and the x of its face; uEnd): what stands there is
    // what the water mirrors. The mirror is carried by the wavelets (five trains fixed to the water): each lit face is a
    // broad soft lens lying level, big and round close to, thin far off, and beyond the range at which a train can be
    // resolved it gives its mean instead, so far down the corridor the image is whole and calm. Down the middle of the
    // channel lies the one path of light, a lane fixed on the water (uLane): glints of fine sparkle only inside it.
    vec2 rel = vWxz - cameraPosition.xz; float r = max(length(rel), 0.5); vec2 dr = rel / r;
    float fp = max(fwz, fwx * 0.33), t = uTime;
    vec2 w0 = wavelet(vWxz + 11., 21., t * 0.7, 12.), w1 = wavelet(vWxz, 13., t * 0.9, 0.), w2 = wavelet(vWxz + 31., 5.2, t * 1.4, 3.), w3 = wavelet(vWxz + 57., 2.1, t * 2.1, 6.), w4 = wavelet(vWxz + 83., 0.85, t * 3.0, 9.);
    vec4 wr = 1. - smoothstep(vec4(13., 5.2, 2.1, 0.85) / 9., vec4(13., 5.2, 2.1, 0.85) / 3.5, vec4(fp));       // how well each train is resolved here
    float wr0 = 1. - smoothstep(21. / 9., 21. / 3.5, fp);
    vec4 lv = smoothstep(0.2, 0.5, vec4(w1.x * (0.12 + 1.1 * w1.y), w2.x * (0.12 + 1.1 * w2.y), w3.x * (0.12 + 1.1 * w3.y), w4.x * (0.12 + 1.1 * w4.y)));
    vec4 lk = mix(vec4(0.36), lv, wr);                                          // (a train too fine to resolve gives its mean)
    float lk0 = mix(0.36, smoothstep(0.2, 0.5, w0.x * (0.12 + 1.1 * w0.y)), wr0);
    float lens = clamp(dot(lk, vec4(0.44, 0.36, 0.22, 0.14)) + 0.4 * lk0 - 0.14, 0., 1.);     // broad lenses of two lengths, finer ones riding on them and lying between them
    float wob = (w0.x - 0.4) * 0.24 * wr0 + (w1.x - 0.4) * 0.24 * wr.x + (w2.x - 0.4) * 0.2 * wr.y + (w3.x - 0.4) * 0.1 * wr.z;                    // the image shivers with the swell
    float rag = (n - 0.5) * 22. + (vnoise(vWxz * 0.21 + vec2(0., uTime * 0.2)) - 0.5) * 14.;      // a mirrored crown or corner frays (a broad wander and a finer one): never a ruled line down the water
    float rise = cameraPosition.y / r * (1. + wob);                             // metres the reflected ray climbs for each metre it runs
    float sd = dr.x < 0. ? -1. : 1.;
    float best = 0., bh = 0., bz = 0., bH = 1., bt = 1e4;
    for (int i = 0; i < 6; i++) {
      vec4 W = uWalls[i];
      float tw = (abs(W.w) - sd * vWxz.x) / max(sd * dr.x, 2e-3);
      float zh = vWxz.y + dr.y * tw + wob * 14., h = rise * tw;
      float ins = step(0., sd * W.w) * step(0., tw) * (1. - smoothstep(W.y - 16., W.y + 6., abs(zh - W.x) + rag * 0.5)) * (1. - smoothstep(W.z * 0.72, W.z, h + rag * 1.3));
      if (ins > 0.01 && tw < bt) { bt = tw; best = ins; bh = h; bz = zh; bH = W.z; }
    }
    float te = (vWxz.y - uEnd.x) / max(-dr.y, 2e-3), xe = vWxz.x + dr.x * te + wob * 14., he = rise * te;
    float insE = step(0., te) * (1. - smoothstep(uEnd.y - 16., uEnd.y + 6., abs(xe) + rag * 0.5)) * (1. - smoothstep(uEnd.z * 0.78, uEnd.z, he + rag));
    float endK = (insE > 0.01 && te < bt) ? 1. : 0.;
    // the wall's own light where the ray lands: paler ribs, dark curtains, creepers, level beds
    float face = fbm3(vec2(bz * 0.035, bh * 0.03) + 5.);
    float curt = smoothstep(0.3, 0.72, vnoise(vec2(bz * 0.11, bh * 0.045) + 3.));
    vec3 wallC = sd > 0. ? uWallCol : uWestCol;
    vec3 cM = wallC * (0.62 + 0.55 * face) * (1. - 0.22 * curt) * (0.9 + 0.1 * sin(bh * 0.4 + face * 6.));
    cM = mix(cM, wallC * vec3(0.25, 0.42, 0.2), 0.55 * smoothstep(0.62, 0.75, vnoise(vec2(bz * 0.06 + 9., bh * 0.045))));
    float upK = mix(1., 0.45, smoothstep(0.3, 0.85, bh / bH));                  // the wall's upper half, hung with creepers, gives a dimmer image: the band lies under the cliff
    float aW = best * upK * smoothstep(1.5, 7., bh) * (sd > 0. ? uMirA : uWestA);
    vec3 cE = mix(uEndCol * (0.8 + 0.4 * n), uMint * 0.7, exp(-xe * xe / 300.) * exp(-he / 26.) * 0.7);
    float aE = insE * 0.7 * (1. - smoothstep(120., 330., te));                 // the Pierced Tower's shaded face and the tunnel's glow, on the water in front of it
    float aM0 = mix(aW, aE, endK);
    cM = mix(cM, cE, endK);
    float graze = 1. - smoothstep(0.3, 1.3, cameraPosition.y / max(dEye, 1.));       // a mirror at grazing angles; looked down on, the water keeps more of its own colour
    float rng = smoothstep(4., 13., dEye) * (1. - smoothstep(520., 900., dEye));
    float aM = aM0 * lens * mix(0.45, 1., graze) * rng;
    // THE PATH OF LIGHT is the water's own: a lane fixed on the water down the middle of the channel (uLane: its mean
    // centre line's x, its half width, its north end at the tunnel and its south end at the corridor's mouth). Its centre
    // line wanders and its breadth swells and narrows along the corridor, by noise that lies on the water; it is dense
    // down its middle and thins out to nothing at its sides, is broken into long patches, and is denser on the lit faces of
    // the wavelets. It is the same lane from any eye; like any mirror it is brightest at grazing angles. Its light is
    // glints: bright points, each at a drawn place in its own cell of the water, of a drawn size, winking at its own rate
    // (two layers, the second turned and a third coarser). A cell is four pixels of water across the corridor and two
    // along it, stepping in octaves that cross-fade each way, so the sparkle is fine at any range and never blocks; where
    // a cell would be far longer than the waves are (far off at grazing angles) the lane shows the glints' mean light
    // instead, a faint pale path.
    float lc = uLane.x + (vnoise(vec2(vWxz.y * 0.013, 7.3)) - 0.5) * 1.2 * uLane.y, lw0 = uLane.y * (0.7 + 0.6 * vnoise(vec2(vWxz.y * 0.021 + 3.1, 1.7)));
    float prof = 1. - smoothstep(0.05, 1., abs(vWxz.x - lc) / lw0 + (n - 0.5) * 0.5);
    float laneK = prof * smoothstep(uLane.z + 4., uLane.z + 40., vWxz.y) * (1. - smoothstep(uLane.w - 110., uLane.w, vWxz.y));
    float dens = laneK * sqrt(prof) * smoothstep(0.18, 0.5, vnoise(vec2(vWxz.x * 0.11 + 3.9, vWxz.y * 0.012 + uTime * 0.02))) * (0.45 + 0.55 * smoothstep(0.1, 0.55, lens));
    float gz = clamp(2. * fwz, 0.03, 64.), gw = clamp(4. * fwx, 0.03, 64.);
    float lz = log2(gz), lzi = floor(lz), lzf = lz - lzi, lw = log2(gw), lwi = floor(lw), lwf = lw - lwi;
    vec2 c0 = vec2(exp2(lwi), exp2(lzi)), p2 = vec2(vWxz.x * 0.825 - vWxz.y * 0.565, vWxz.x * 0.565 + vWxz.y * 0.825);
    float sA = lwi * 7. + lzi * 3., G = 0.;
    if (dens > 0.002) for (int i = 0; i < 4; i++) {
      float ix = mod(float(i), 2.), iz = floor(float(i) / 2.);
      float g1 = glint(vWxz, c0 * vec2(1. + ix, 1. + iz), t, sA + ix * 7. + iz * 3., dens), g2 = glint(p2, c0 * vec2(1. + ix, 1. + iz) * 1.3, t, sA + ix * 7. + iz * 3. + 41., dens);
      G += (g1 + g2 - g1 * g2) * mix(1. - lwf, lwf, ix) * mix(1. - lzf, lzf, iz);
    }
    float res = 1. - smoothstep(20., 60., gz);
    float aL = clamp((0.1 * lens * laneK + mix(0.24 * dens, G, res)) * mix(0.5, 1., graze) * rng * uGlitA, 0., 0.95);
    a = aM + aL - aM * aL;
    col = (cM * aM * (1. - aL) + uGlitCol * aL) / max(a, 1e-3);
  } else if (kind > 4.5) {
    float body = (1. - smoothstep(0.2, 1., ex + (n - 0.5)*0.9)) * smoothstep(0., 0.3, vUv.y + (n - 0.5)*0.3) * (1. - smoothstep(0.55, 1., vUv.y + (n - 0.5)*0.4));
    float sc = clamp(vEye/70., 1., 10.);
    float yw = ym + (vnoise(vec2(xm*0.19 + vFx.z*31., ym*0.07 + vFx.z*17.)) - 0.5)*1.6*sc;        // the ruffle's rows wander, each paw's by its own noise: never ruled lines across the water
    float ruff = vnoise(vec2(xm*0.5, yw*2.0 - uTime*3.)/sc);
    float spark = smoothstep(0.62, 0.9, vnoise(vec2(xm*0.45 + 3., yw*4.6 - uTime*6.)/sc));        // pale capillary streaks across the ruffle
    a = min(smoothstep(0.08, 0.5, body) * vFx.y * uPawA * (0.72 + 0.28*ruff) * mix(1.3, 1., smoothstep(4., 14., cameraPosition.y)), 0.9);
    a *= 1. - (1. - smoothstep(uRunZ - 70., uRunZ + 20., vWxz.y))*(1. - smoothstep(70., 130., abs(vWxz.x)));     // none darkens the alighting run (uRunZ: where the keel kisses), whatever the wind: clean jade from there to the portal
    col = mix(uPawCol*(0.8 + 0.4*ruff), mix(uFoamCol, uPawCol*4., 0.6)*0.5, spark*0.3*body);
  } else {
    // the portal's light lying on the water: bright at the tunnel, a long thin streak down the corridor's axis, broken by ripples
    // (ripples in world space, coarser with range: perspective alone flattens them into slivers; nothing under the eye)
    float sc = clamp(45./max(vEye, 1.), 0.3, 1.4);
    float torn = smoothstep(0.3, 0.68, fbm3(vec2(xm*0.33 + 3., ym*0.24 - uTime*0.35)*sc));
    float along = 0.6*exp(-vUv.y*9.) + 0.5*(1. - vUv.y)*(1. - vUv.y);
    a = min(along * (1. - smoothstep(mix(0.1, 0.55, vUv.y), 1., ex)) * (0.22 + 1.0*torn) * (1. - smoothstep(0.9, 1., vUv.y)), 0.85) * smoothstep(14., 60., vEye);
    col = uMint;
  }
  if (a < 0.004) discard;
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,ya=`
varying vec3 vW;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,l0=`
uniform float uTime; uniform vec3 uCol; uniform vec3 uRim; uniform vec4 uEdge;
varying vec3 vW;
${Xe}
void main(){
  vec2 q = vW.xz*0.0016 + vec2(uTime*0.004, uTime*0.002);
  float n = fbm3(q) * 0.7 + fbm3(q*3.7 + 5.)*0.3;
  vec2 rel = vW.xz - uEdge.xy;
  float d = dot(rel, uEdge.zw), b = dot(rel, vec2(-uEdge.w, uEdge.z));       // metres ahead of the entry, metres to its right (toward the corridor)
  float fine = fbm3(q*8.3 + 3.);
  float e = d + (n - 0.5)*480. + (fine - 0.5)*130.;
  float eb = b + (fbm3(q*1.4 + 11.) - 0.5)*420. + (fine - 0.5)*110.;
  float a = 1. - smoothstep(700., 930., e);
  a *= 1. - smoothstep(380., 760., eb);                                       // the shower covers the sky over the entry run; it has drawn off the corridor, far to the right
  float cov = n + 0.6*(1. - smoothstep(250., 820., d)) + (fine - 0.5)*0.14;
  a *= smoothstep(0.1, 0.36, cov);
  float rim = max(smoothstep(560., 930., e), smoothstep(200., 760., eb));
  float thin = (1. - smoothstep(0.36, 0.66, cov)) * 0.6;                       // where the base is thin the light comes through: lit, torn edges round every rent
  float belly = smoothstep(0.42, 0.78, fbm3(q*5.1 + 17.));                        // hanging bellies of the base catch the low light from the open sky ahead
  vec3 col = mix(uCol*(0.62 + 0.6*n)*(0.85 + 0.3*fine) + uRim*0.07*belly, uRim, max(rim*rim*0.75, thin));
  // no hard line where the sheet runs to the horizon or to its own end: it thins with distance and at grazing angles
  vec3 V = vW - cameraPosition; float dist = length(V);
  a *= smoothstep(0.035, 0.15, abs(V.y)/max(dist, 1.)) * (1. - smoothstep(1700., 2900., dist)) * mix(1., 0.8, rim);
  if (a < 0.004) discard;
  gl_FragColor = vec4(col, a*0.98);
}`,h0=`
uniform float uTime; uniform vec3 uCol; uniform vec3 uShade; uniform vec3 uHazeSun; uniform vec3 uHazeAway; uniform vec3 uSunDir; uniform float uFade; uniform vec2 uMid; uniform vec3 uClear; uniform vec2 uCorr;
varying vec3 vW;
${Xe}
float billow(vec2 p){ return fbm3(p)*0.62 + fbm3(p*3.1 + 9.)*0.38; }
void main(){
  vec2 sx = normalize(uSunDir.xz + vec2(1e-5));
  float lanes = fbm3(vW.xz*0.0011 + vec2(uTime*0.003, -uTime*0.0015) + 3.);          // kilometre lanes of fog and open water
  vec2 q = vW.xz*0.0062 + vec2(uTime*0.008, uTime*0.003);
  float bil = billow(q), bilS = billow(q + sx*0.22);
  float fine = fbm3(vW.xz*0.036 + vec2(uTime*0.02, 0.)), fineS = fbm3((vW.xz + sx*7.)*0.036 + vec2(uTime*0.02, 0.));
  float clearing = exp(-dot(vW.xz - uClear.xy, vW.xz - uClear.xy)/(uClear.z*uClear.z));    // open dark water round the Sentinel: the entry keeps its contrast
  float canyon = (1. - smoothstep(150., 270., abs(vW.x))) * smoothstep(uCorr.x - 40., uCorr.x + 30., vW.z) * (1. - smoothstep(uCorr.y - 60., uCorr.y + 60., vW.z));
  // in the corridor the floor is torn into wisps over dark water (the rafts and junks stay in view)
  // (thin torn threads lying along it, thicker against the cliff feet: under half of it covered, soft wide edges)
  float thread = 1. - abs(fbm3(vec2(vW.x*0.021, vW.z*0.0065) + vec2(uTime*0.012, uTime*0.004))*2. - 1.);
  float hug = smoothstep(12., 52., abs(vW.x))*(1. - 0.6*smoothstep(70., 110., abs(vW.x)));     // thickest at the corridor's cliff feet, thin again in the side channels between the wall towers
  float coverC = smoothstep(0.8, 1.0, thread + 0.03*hug)*smoothstep(0.3, 0.7, fine*0.75 + bil*0.35)*(0.24 + 0.26*hug);
  float cover = mix(smoothstep(0.37, 0.6, lanes*0.74 + bil*0.4 - 0.5*clearing), coverC, canyon);
  float dC = length(vW.xz - uMid);
  float a = cover * (0.6 + 0.4*smoothstep(0.3, 0.7, bil)) * (1. - smoothstep(3200., 4500., dC)) * uFade;
  vec3 V = vW - cameraPosition; float d = length(V);
  float toSun = max(dot(normalize(V.xz + vec2(1e-5)), sx), 0.);
  float lit = clamp(0.5 + (bil - bilS)*4.5 + (fine - fineS)*2.2, 0., 1.);             // billows lit from the sun's side
  lit = mix(lit, clamp(0.25 + (fine - fineS)*5. + 0.5*smoothstep(0., 40., vW.x), 0., 1.), canyon);   // in the corridor: rose on the wisps' sunward tops (the lit east side), blue-grey beneath
  vec3 col = mix(uShade, uCol, lit) * (0.8 + 0.2*bil + (0.16 + 0.3*canyon)*(fine - 0.4)) + uHazeSun*0.2*toSun*toSun*(1. - canyon);
  col = mix(col, mix(uHazeAway, uHazeSun, toSun*toSun), 1. - exp(-d*0.00035));
  a *= smoothstep(4., 30., d);
  if (a < 0.004) discard;
  gl_FragColor = vec4(col, a*0.8);
}`,c0=`
attribute vec3 aTop; attribute vec4 aW;
uniform vec3 uSunDir; uniform float uTime;
varying vec2 vUv; varying float vSeed; varying float vA;
void main(){
  vec3 top = aTop + vec3(sin(uTime*0.02 + aW.z*9.)*30., 0., uTime*0.5);
  vec3 ax = -normalize(uSunDir);
  float len = (top.y + 2.) / max(uSunDir.y, 0.12);
  vec3 c = top + ax*len*position.y;
  vec3 toEye = cameraPosition - c;
  vec3 sd = cross(ax, toEye); float sl = length(sd); sd = sl > 1e-3 ? sd/sl : vec3(1., 0., 0.);
  vec3 wp = c + sd*position.x*mix(aW.x, aW.y, position.y);
  vUv = vec2(position.x*2., position.y); vSeed = aW.z;
  float along = abs(dot(normalize(toEye + vec3(1e-4)), ax));
  vA = aW.w * (1. - 0.6*smoothstep(0.92, 1., along)) * smoothstep(20., 160., length(toEye));
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`,f0=`
uniform vec3 uCol; uniform float uTime;
varying vec2 vUv; varying float vSeed; varying float vA;
${Xe}
void main(){
  float ex = abs(vUv.x);
  float ray = 0.55 + 0.45*vnoise(vec2(vUv.x*3.5 + vSeed*13., uTime*0.05 + vSeed));
  float a = (1. - smoothstep(0.62, 1., ex)) * ray * smoothstep(0., 0.07, vUv.y) * (1. - smoothstep(0.55, 1., vUv.y)) * vA;
  gl_FragColor = vec4(uCol * a, 1.);
}`,u0=`
attribute vec4 aR;
uniform float uTime; uniform float uRain; uniform vec3 uRel;
varying float vA; varying vec2 vUv;
void main(){
  vec3 box = vec3(52., 30., 52.);
  vec3 c = mod(aR.xyz*box + vec3(1.5, -9., 1.)*uTime - cameraPosition, box) - box*0.5;          // metres from the eye: drops falling in the world, which we fly through
  float dist = length(c);
  vec3 dir = uRel/max(length(uRel), 1e-3);
  vec3 sd = cross(dir, c); float sl = length(sd); sd = sl > 1e-4 ? sd/sl : vec3(1., 0., 0.);
  float len = 1.3 + 2.2*aR.w, wid = max(0.012, 0.0042*dist);
  vec3 wp = cameraPosition + c + dir*(position.y - 0.5)*len + sd*position.x*wid;
  float gust = 0.5 + 0.5*sin((cameraPosition.x + c.x)*0.11 + uTime*1.9 + aR.w*2.)*sin((cameraPosition.z + c.z)*0.13 - uTime*1.4);
  vA = uRain*smoothstep(1.2, 4., dist)*(1. - smoothstep(16., 25., dist))*smoothstep(0.2, 0.7, gust)*(0.35 + 0.65*aR.w)*clamp(0.03/wid, 0.45, 1.);
  vUv = position.xy;
  gl_Position = uRain < 0.004 ? vec4(2., 2., 2., 1.) : projectionMatrix*viewMatrix*vec4(wp, 1.);
}`,d0=`
uniform vec3 uCol;
varying float vA; varying vec2 vUv;
void main(){
  float a = vA*(1. - smoothstep(0.2, 0.5, abs(vUv.x)))*smoothstep(0., 0.25, vUv.y)*(1. - smoothstep(0.6, 1., vUv.y));
  if (a < 0.004) discard;
  gl_FragColor = vec4(uCol, a);
}`,m0=`
attribute vec4 aS;                                  // foot (x, y, z) and seed
uniform float uTime; uniform vec2 uWind;
varying vec2 vUv; varying float vSeed;
#include <fog_pars_vertex>
void main(){
  float t = position.y;
  vec3 c = aS.xyz + vec3(0., t*24., 0.);
  c.xz += uWind*(t*t*15. + t*2.) + vec2(sin(t*6.5 - uTime*0.9 + aS.w*9.), cos(t*5.1 - uTime*0.7 + aS.w*5.))*0.9*t;
  vec3 up = normalize(vec3(uWind.x*(t*30. + 2.), 24., uWind.y*(t*30. + 2.)));
  vec3 sd = cross(up, cameraPosition - c); float sl = length(sd); sd = sl > 1e-4 ? sd/sl : vec3(1., 0., 0.);
  float dist = length(cameraPosition - c);
  vec3 wp = c + sd*position.x*max(0.5 + 5.*t, 0.006*dist);
  vUv = vec2(position.x*2., t); vSeed = aS.w;
  vec4 mvPosition = viewMatrix*vec4(wp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,v0=`
uniform float uTime; uniform vec3 uCol; uniform vec3 uLit;
varying vec2 vUv; varying float vSeed;
#include <fog_pars_fragment>
${Xe}
void main(){
  float t = vUv.y;
  float n = fbm3(vec2(vUv.x*1.3 + vSeed*13., t*5. - uTime*0.45)), n2 = vnoise(vec2(vUv.x*3.1 + vSeed*7., t*13. - uTime*0.9));
  float a = (1. - smoothstep(0.25, 1., abs(vUv.x) + (n - 0.5)*0.7))*smoothstep(0., 0.05, t)*(1. - smoothstep(0.45, 1., t))*smoothstep(0.25, 0.6, n*0.7 + n2*0.3 + 0.25*(1. - t))*mix(0.62, 0.3, t);
  if (a < 0.004) discard;
  gl_FragColor = vec4(mix(uCol, uLit, smoothstep(-0.6, 0.8, vUv.x + (n - 0.5))*0.7), a);
  #include <fog_fragment>
}`,ba=[{ex:2.5,el:1,steps:[[.9,1.5,.66,1.2]],ph:0},{ex:2.1,el:1.38,steps:[[3.3,1.2,.74,1.14]],ph:2.1},{ex:2.9,el:.84,steps:[[5.2,1.1,.58,1.26],[2.2,.9,.8,1.1]],ph:4.4}];function p0(m,p,W){const F=ba[m%3],Y=Math.cos(p),V=Math.sin(p);for(const w of F.steps){let h=Math.abs(p-w[0]);h=Math.min(h,Math.PI*2-h),h<w[1]*.5+.12&&(W=Math.min(W,.56))}const H=1/Math.pow(Math.pow(Math.abs(Y),F.ex)+Math.pow(Math.abs(V/F.el),F.ex),1/F.ex)/Math.max(1,F.el),D=W>.66?.99:W>.36?ce(1,.993,(W-.36)/.3):1,C=1+.07*Math.sin(2*p+1+F.ph+D*1.2)+.055*Math.sin(3*p+2.3+F.ph)+.045*Math.sin(7*p+D*5+F.ph)+.03*Math.sin(11*p+F.ph*2),k=W*C*H*.95;return[Y*k,D+.022*Math.sin(5*p+F.ph)*(W/.9)+.016*Math.sin(9*p+1.3+F.ph)*(W/.9)+.018*(1-W),V*k]}function w0(m=0){const W=[[0,.9],[.01,.83],[.028,1],[.3,1],[.62,.99],[.86,.985],[.955,.98],[.978,.95],[.988,.87],[.993,.66],[1,.36],[1,.02]],F=ba[m%3],Y=[],V=[];for(let D=0;D<W.length;D++)for(let C=0;C<=24;C++){const k=C/24*Math.PI*2,w=Math.cos(k),h=Math.sin(k),T=W[D][0],A=W[D][1],j=1/Math.pow(Math.pow(Math.abs(w),F.ex)+Math.pow(Math.abs(h/F.el),F.ex),1/F.ex)/Math.max(1,F.el),I=1+.07*Math.sin(2*k+1+F.ph+T*1.2)+.055*Math.sin(3*k+2.3+F.ph)+.045*Math.sin(7*k+T*5+F.ph)+.03*Math.sin(11*k+F.ph*2);let ne=A*I*j*.95,S=T,d=1,P=1;for(const Z of F.steps){let $=Math.abs(k-Z[0]);$=Math.min($,Math.PI*2-$),$<Z[1]*.5&&(d=Math.min(d,Z[2]),P=Math.max(P,Z[3]))}A>.8?(ne*=P,d<1&&(S=T<.3?T:.3+(T-.3)*(d-.3)/.7)):d<1&&A>.6&&(ne*=.5+.5*P),A<.9&&(S+=.022*Math.sin(5*k+F.ph)*(A/.9)+.016*Math.sin(9*k+1.3+F.ph)*(A/.9)+.018*(1-A)),Y.push(w*ne,S,h*ne)}for(let D=0;D<W.length-1;D++)for(let C=0;C<24;C++){const k=D*25+C,w=k+1,h=k+24+1,T=h+1;V.push(k,h,w,w,h,T)}const H=new b.BufferGeometry;return H.setAttribute("position",new b.Float32BufferAttribute(Y,3)),H.setIndex(V),H.computeVertexNormals(),H}class vo{constructor(){this.p=[],this.n=[],this.c=[],this.f=[],this.q=[]}tri(p,W,F,Y,V=0,H=0,D=0,C=null,k=null,w=null){const h=W[0]-p[0],T=W[1]-p[1],A=W[2]-p[2],j=F[0]-p[0],I=F[1]-p[1],ne=F[2]-p[2];let S=T*ne-A*I,d=A*j-h*ne,P=h*I-T*j;const Z=Math.hypot(S,d,P)||1;S/=Z,d/=Z,P/=Z,this.p.push(p[0],p[1],p[2],W[0],W[1],W[2],F[0],F[1],F[2]);for(let $=0;$<3;$++)this.n.push(S,d,P),this.c.push(Y[0],Y[1],Y[2]);this.f.push(V,H,D),C?this.q.push(C[0],C[1],k[0],k[1],w[0],w[1]):this.q.push(-1,0,-1,0,-1,0)}quad(p,W,F,Y,V,H=0,D=0,C=0,k=0,w=null,h=null,T=null,A=null){this.tri(p,W,F,V,H,D,C,w,h,T),this.tri(p,F,Y,V,H,C,k,w,T,A)}beam(p,W,F,Y){const V=W[0]-p[0],H=W[1]-p[1],D=W[2]-p[2];let C=-D,k=V;const w=Math.hypot(C,k);w<1e-4?(C=1,k=0):(C/=w,k/=w);let h=H*k,T=D*C-V*k,A=-H*C;const j=Math.hypot(h,T,A)||1;h/=j,T/=j,A/=j;const I=F/2,ne=(S,d,P)=>this.quad([p[0]-S*I,p[1]-d*I,p[2]-P*I],[p[0]+S*I,p[1]+d*I,p[2]+P*I],[W[0]+S*I,W[1]+d*I,W[2]+P*I],[W[0]-S*I,W[1]-d*I,W[2]-P*I],Y);ne(C,0,k),ne(h,T,A)}box(p,W,F,Y,V,H,D,C=0){const k=p-Y/2,w=p+Y/2,h=W-V/2,T=W+V/2,A=F-H/2,j=F+H/2,I=(ne,S,d,P)=>this.quad(ne,S,d,P,D,C,C,C,C);I([k,h,j],[w,h,j],[w,T,j],[k,T,j]),I([w,h,A],[k,h,A],[k,T,A],[w,T,A]),I([w,h,j],[w,h,A],[w,T,A],[w,T,j]),I([k,h,A],[k,h,j],[k,T,j],[k,T,A]),I([k,T,j],[w,T,j],[w,T,A],[k,T,A]),I([k,h,A],[w,h,A],[w,h,j],[k,h,j])}build(){const p=new b.BufferGeometry;return p.setAttribute("position",new b.Float32BufferAttribute(this.p,3)),p.setAttribute("normal",new b.Float32BufferAttribute(this.n,3)),p.setAttribute("color",new b.Float32BufferAttribute(this.c,3)),p.setAttribute("aFlex",new b.Float32BufferAttribute(this.f,1)),p.setAttribute("aPan",new b.Float32BufferAttribute(this.q,2)),p}}const B=(m,p=1)=>{const W=new b.Color(m);return[W.r*p,W.g*p,W.b*p]};function g0(m){const p=new vo,W=B("#4a3524"),F=B("#2a1e15"),Y=B("#7a5a36"),V=B("#b9ab8a"),H=B(m),D=[];for(let T=0;T<=10;T++){const A=-11+2.2*T,j=A/11.4,I=3.3*Math.pow(Math.max(.02,1-j*j),.6)*(A<0?1:.92),ne=1.5+2.1*j*j*(A<0?1.25:.8);D.push([[-I,ne,A],[-I*.94,.3,A],[-I*.5,-.6,A],[I*.5,-.6,A],[I*.94,.3,A],[I,ne,A],[I*.9,ne-.4,A],[-I*.9,ne-.4,A]])}for(let T=0;T<10;T++)for(let A=0;A<8;A++){const j=(A+1)%8,I=A===0||A===4?W:A===6||A===5||A===7?Y:F;p.quad(D[T][A],D[T+1][A],D[T+1][j],D[T][j],I)}p.quad(D[0][0],D[0][1],D[0][4],D[0][5],W),p.quad(D[0][1],D[0][2],D[0][3],D[0][4],F),p.box(0,4.6,-8.6,4.4,2.2,4.2,W),p.box(0,5.8,-8.6,5,.2,4.8,V),p.box(0,3.2,-3.2,4.2,.12,3.6,V);for(const T of[-1.9,1.9])for(const A of[-4.8,-1.6])p.box(T,2.3,A,.12,1.8,.12,F);p.box(0,.6,-11.6,.25,3.4,1.6,F);for(let T=0;T<6;T++){const A=-7+T*2.7,j=3.3*Math.pow(Math.max(.02,1-(A/11.4)**2),.6);p.box(j+.12,1,A,.3,.8,.8,B("#15171a")),p.box(-j-.12,1,A+1.2,.3,.8,.8,B("#15171a"))}p.box(1.2,1.75,3.2,.9,.7,.9,B("#a07a3a")),p.box(-1,1.7,4.6,.8,.6,.8,B("#8a6a34")),p.box(.4,1.7,8.2,1.4,.5,1,B("#3c5a6a")),p.box(0,7.3,-10.9,.5,.6,.5,[5,3,1.1],-1),p.box(0,6.6,-10.9,.08,1.2,.08,F);const C=[[6.6,10.5],[.6,15.5],[-6.4,11.5]],k=4,w=4,h=[H[0]*.96,H[1]*.9,H[2]*.86];for(let T=0;T<3;T++){const A=C[T][0],j=C[T][1];p.box(0,j*.3+.5,A,.24,j*.6+1,.24,F),p.box(0,j*.8+.6,A,.16,j*.4+.8,.16,F);const I=3.3*Math.pow(Math.max(.02,1-(A/11.4)**2),.6);p.beam([0,j+.9,A],[I*.92,1.9,A-2.4],.08,F),p.beam([0,j+.9,A],[-I*.92,1.9,A-2.4],.08,F);const ne=8,S=[];for(let P=0;P<ne;P++){const Z=P/(ne-1),$=2.8+Z*(j-2.6),be=A+1.1+.5*Z,Ee=A-(3+2.9*Math.sin(Math.PI*(Z*.8+.12)))*(j/15.5)-(P%2?.35:0);S.push([[.26,$,be],[.26,$+(P%2?.1:.5),Ee],.35+.65*Z])}const d=(j-2.6)/(ne-1);for(let P=0;P<ne-1;P++){const Z=S[P],$=S[P+1],be=(P*7+T*13)%5/5,Ee=.74+.36*be,Ie=(P+T)%4===1?[h[0]*.9+.09,h[1]*.9+.075,h[2]*.9+.06]:[h[0]*Ee,h[1]*Ee,h[2]*Ee],ee=(Ce,de)=>{const ye=Ce/k,z=de/w,qe=Z[0],Ae=Z[1],Ft=$[0],Wt=$[1],pt=Math.sin(Math.PI*ye)*Math.sin(Math.PI*Math.min(z*1.1,1)),wt=ce(ce(qe[0],Ae[0],z),ce(Ft[0],Wt[0],z),ye),ue=ce(ce(qe[1],Ae[1],z),ce(Ft[1],Wt[1],z),ye),jt=ce(ce(qe[2],Ae[2],z),ce(Ft[2],Wt[2],z),ye);return[[wt+.24*d*pt,ue,jt+.45*Math.sin(Math.PI*ye)*z*z],ce(.12,1,z)*ce(Z[2],$[2],ye),[ye,z]]};for(let Ce=0;Ce<k;Ce++)for(let de=0;de<w;de++){const ye=ee(Ce,de),z=ee(Ce,de+1),qe=ee(Ce+1,de+1),Ae=ee(Ce+1,de);p.quad(ye[0],z[0],qe[0],Ae[0],Ie,ye[1],z[1],qe[1],Ae[1],ye[2],z[2],qe[2],Ae[2])}}}return p.build()}function x0(){const m=new vo,p=B("#a39378"),W=B("#8e7f68"),F=B("#b3a58c"),Y=B("#4a8ad0"),V=B("#3368a8"),H=B("#b4c0c0"),D=B("#9a8672"),C=B("#9cc8b8"),k=B("#7fa99c"),w=B("#85735b"),h=B("#5e4f3d"),T=B("#6b5a44"),A=B("#cdbf9c");m.quad([-12,.24,-20],[-12,.24,20],[12,.24,20],[12,.24,-20],B("#68BCA4"),-2,-2,-2,-2);for(let S=0;S<=4;S++){const d=S===0||S===4?1.7:1.2;m.box(-12+S*6,.6,0,d,.22,41.7,S%2?W:p)}for(let S=0;S<=6;S++){const d=S===0||S===6?1.7:1.2;m.box(0,.64,-20+S*6.667,25.7,.2,d,S%2?p:F)}for(let S=0;S<=4;S++)for(let d=0;d<=6;d++){const P=S===0||S===4;m.box(-12+S*6,.24,-20+d*6.667,P?3.3:2.7,.66,1,(S+d)%3?Y:V),d<6&&m.box(-12+S*6,.24,-16.67+d*6.667,P?2.5:2,.66,1.3,(S+d)%2?V:Y)}m.box(-9,.72,16.67,6.2,.16,6.9,F),m.box(-9.2,2,16.2,4.4,2.4,3.8,w),m.quad([-8.4,.85,18.12],[-7.5,.85,18.12],[-7.5,2.65,18.12],[-8.4,2.65,18.12],h),m.quad([-10.9,1.8,18.12],[-9.6,1.8,18.12],[-9.6,2.7,18.12],[-10.9,2.7,18.12],[1.5,.95,.38],-1,-1,-1,-1),m.quad([-12,3.1,19.2],[-6.4,3.1,19.2],[-6.4,4.25,16.2],[-12,4.25,16.2],H),m.quad([-12,4.25,16.2],[-6.4,4.25,16.2],[-6.4,3.1,13.6],[-12,3.1,13.6],D);for(const S of[-11.4,-7])m.tri([S,3.2,18.1],[S,3.2,14.3],[S,4.2,16.2],w);m.box(-6.9,2.75,18.5,.3,.42,.3,[3.6,2.3,.95],-1),m.box(-6.9,3,18.5,.06,.3,.06,h),m.box(-11.3,1.2,19.2,.7,.95,.7,Y),m.box(-10.4,1.1,19.4,.62,.8,.62,V),m.box(-6.7,1.05,14.6,.9,.6,.9,A),m.box(-6.8,1.55,14.7,.6,.4,.6,p),m.box(-1.6,2,19.6,.16,2.9,.16,T),m.beam([-6.5,3.15,19.2],[-1.6,3.3,19.6],.07,T);for(let S=0;S<4;S++){const d=-5.6+S*1,P=[A,B("#7f9fc0"),B("#d9d2c2"),B("#9c6a4c")][S];m.quad([d,2.2+.15*(S%2),19.3+S*.08],[d+.75,2.2+.15*(S%2),19.36+S*.08],[d+.75,3.18,19.36+S*.08],[d,3.16,19.3+S*.08],P,.3,.3,0,0)}for(const S of[-15.5,-8.8,-2.1]){m.box(9,1.9,S,.16,2.6,.16,T),m.box(9,1.9,S+5.2,.16,2.6,.16,T),m.box(9,3.15,S+2.6,.12,.12,5.4,T);for(let d=0;d<4;d++){const P=S+.2+d*1.2,Z=P+1.2,$=.9+.5*((d*7+3)%4)/3,be=.9+.5*((d*5+1)%4)/3,Ee=d%2?C:k;m.quad([9,3.2,P],[9,3.2,Z],[9+be*.8,3.2-be*1.5,Z],[9+$*.8,3.2-$*1.5,P],Ee,0,0,.25,.25),m.quad([9,3.2,Z],[9,3.2,P],[9-$*.7,3.2-$*1.4,P],[9-be*.7,3.2-be*1.4,Z],d%2?k:C,0,0,.25,.25)}}for(const[S,d]of[[12,-20],[-12,-20],[12,20]])m.box(S,1.5,d,.18,1.9,.18,T);for(let S=0;S<5;S++)m.box(3+S%2*.5,.95,-19.6+S*.1+(S>2?39:0),.5,.5,.5,S%2?A:B("#d9a070"));const j=[];for(let S=0;S<=5;S++){const d=-2.7+S*5.4/5,P=d/2.8,Z=.82*Math.pow(Math.max(.03,1-P*P),.5),$=.5+.38*P*P;j.push([[14.6-Z,$,d-3],[14.6-Z*.6,-.1,d-3],[14.6+Z*.6,-.1,d-3],[14.6+Z,$,d-3],[14.6+Z*.8,$-.1,d-3],[14.6-Z*.8,$-.1,d-3]])}const I=B("#9b8a66"),ne=B("#4e6d78");for(let S=0;S<5;S++)for(let d=0;d<6;d++){const P=(d+1)%6;m.quad(j[S][d],j[S+1][d],j[S+1][P],j[S][P],d===0||d===2?ne:d===4?B("#6e5e44"):I)}return m.box(14.6,.42,-3.9,1.3,.07,.3,A),m.box(14.6,.42,-2,1.4,.07,.3,A),m.beam([13,.75,-1.2],[14.3,.55,-1.4],.1,T),m.build()}function y0(){const m=new vo,p=B("#57412b"),W=B("#2e2218"),F=B("#a48a56"),Y=B("#7d6840"),V=[];for(let C=0;C<=6;C++){const k=-3.5+C*7/6,w=k/3.6,h=1.05*Math.pow(Math.max(.03,1-w*w),.55),T=.55+.5*w*w;V.push([[-h,T,k],[-h*.7,-.15,k],[h*.7,-.15,k],[h,T,k],[h*.82,T-.12,k],[-h*.82,T-.12,k]])}for(let C=0;C<6;C++)for(let k=0;k<6;k++){const w=(k+1)%6;m.quad(V[C][k],V[C+1][k],V[C+1][w],V[C][w],k===1||k===4?W:p)}const H=(C,k)=>{const w=[];for(let h=0;h<=6;h++){const T=Math.PI*h/6;w.push([-Math.cos(T)*k,.55+Math.sin(T)*1.25,C])}return w},D=[-1.9,-.9,.1,1.1];for(let C=0;C<D.length-1;C++){const k=H(D[C],.98),w=H(D[C+1],.98);for(let h=0;h<6;h++)m.quad(k[h],w[h],w[h+1],k[h+1],(C+h)%2?F:Y)}return m.box(.5,.9,-3.4,.07,.07,3.4,W),m.box(0,.62,2.4,1.1,.1,.5,B("#3c5a6a")),m.box(0,1.35,1.2,.22,.26,.22,[4.2,2.6,1],-1),m.build()}function b0(m){const p=new vo,W=B("#3b5a66"),F=B("#1d2c33"),Y=B("#8a7a5c"),V=B("#c9c2a8"),H=B("#4a4034"),D=[];for(let k=0;k<=8;k++){const w=-6.5+k*13/8,h=w/6.7,T=2*Math.pow(Math.max(.03,1-h*h),.55)*(w<0?1:.9),A=1.1+.9*h*h*(w>0?1.3:.7);D.push([[-T,A,w],[-T*.8,-.2,w],[T*.8,-.2,w],[T,A,w],[T*.86,A-.15,w],[-T*.86,A-.15,w]])}for(let k=0;k<8;k++)for(let w=0;w<6;w++){const h=(w+1)%6;p.quad(D[k][w],D[k+1][w],D[k+1][h],D[k][h],w===1?F:w===4?Y:W)}p.quad(D[0][0],D[0][1],D[0][2],D[0][3],W),p.box(0,2.1,-3.6,2.6,2,3,V),p.box(0,3.2,-3.6,3.1,.14,3.5,B("#7f9aa0")),p.box(0,2.35,-2.07,1.8,.6,.06,[.05+m*2.2,.06+m*1.5,.07+m*.6],-1),p.box(1.1,1.5,3.4,.8,.7,.8,B("#a07a3a")),p.box(-.9,1.45,1,1.1,.6,.9,B("#3c5a6a")),p.box(0,1.6,5.4,.5,.9,.5,H);for(const k of[-1.6,5.2])p.box(0,3.3,k,.14,4.2,.14,H),p.box(0,5.05,k,3.5,.1,.1,H);p.box(0,5.4,1.8,.1,.1,7,H);const C=[.25+m*1.7,.3+m*2.6,.28+m*2];for(const k of[-1.6,1.6]){p.box(k,5.05,1.8,.06,.06,6.9,H);for(let w=0;w<6;w++)p.box(k,4.74,-1.2+w*1.2,.36,.44,.36,C,-1)}return p.build()}const Ma={golden:{preset:"goldenHour",elev:22,sunCol:["#FFD9A0",2.4],sky:"#6E97A8",horizon:"#E8C89A",shade:"#2C5560",water:"#2F8F78",spray:"#FFCF8A",fog:"#C4C3A6",dens:28e-5,deep:"#2A7B73",scatter:"#55A596",glow:"#000000",mist:"#F3DFB8",ceil:"#2B3340",rim:"#E9C48E",exposure:.92,cabin:0,lamp:2.4,lampK:1,shadowA:.72,thunder:["#F2B27A","#6F8494"],hazeSun:"#E8C89A",hazeAway:"#9DB8B4",haze:23e-5,reflA:.34,wallRef:["#EDBE80",.56],glit:["#FFDCA6",.95],squid:0},dawn:{preset:"dawn",elev:9,sunCol:["#FFC4B4",1.9],sky:"#9AAAC6",horizon:"#F2D2CC",shade:"#4A5873",water:"#6FA39A",spray:"#FFB4C0",fog:"#E2D0D2",dens:45e-5,deep:"#356A68",scatter:"#86BDB2",glow:"#000000",mist:"#F6E4E4",ceil:"#46435C",rim:"#F4C6C0",exposure:1,cabin:.6,lamp:2.6,lampK:1.3,shadowA:.42,thunder:["#F6BFC0","#8088A6"],hazeSun:"#F4D6CE",hazeAway:"#CFC8D8",haze:32e-5,reflA:.26,wallRef:["#F6CEC6",.5],glit:["#FFD8D0",.8],squid:0},day:{preset:"day",elev:55,sunCol:["#FFF3DA",2.5],sky:"#5C9CCB",horizon:"#CFE3E6",shade:"#56706C",water:"#1FA383",spray:"#F4F2E4",fog:"#BCD6D8",dens:2e-4,deep:"#17907A",scatter:"#4FD9B0",glow:"#000000",mist:"#F4F6F2",ceil:"#39424E",rim:"#E6ECEC",exposure:.95,cabin:0,lamp:2,lampK:.8,shadowA:.72,thunder:["#FFFFFF","#8AA0B4"],hazeSun:"#DDEAE6",hazeAway:"#B2CEDA",haze:2e-4,reflA:.36,wallRef:["#F0EAD6",.66],glit:["#FFFFF0",1],squid:0},night:{preset:"night",elev:35,sunCol:["#B4C8F4",1.45],sky:"#46639C",horizon:"#4A6690",shade:"#34507E",water:"#1E5A6E",spray:"#7FF0D8",fog:"#27405E",dens:26e-5,deep:"#14506A",scatter:"#3A93A0",glow:"#0b6b78",mist:"#7C98B8",ceil:"#141C2A",rim:"#4E6C90",exposure:1.36,cabin:1,lamp:3.2,lampK:2.2,shadowA:.56,thunder:["#6C86B4","#26344E"],hazeSun:"#3E5C88",hazeAway:"#22344E",haze:24e-5,reflA:.4,wallRef:["#A9C0F0",.4],glit:["#C8DCFF",.62],squid:1}};var A0={id:"flying-boat-karst-bay",name:"Alighting among the Towers",category:"ocean",weirdness:.25,media:["air","water"],async build(m){const p=m.rng,W=m.vary||{},F=m.quality&&m.quality.detail||1,Y=W.density||1,V=W.mood!==void 0?W.mood:.5,H=!!W.rare,D=e=>Ga(Ha("flying-boat-karst-bay:"+e+":"+m.seed)),C=new b.Scene,k=p.pick(["golden","day","golden","dawn","golden","night"]),w=Ma[W.hour]?W.hour:k,h=Ma[w],T=p.pick(["#B3402A","#B3402A","#C08A2E","#4C66AE"]),A=p.pick(["silver","white","cream"]),j=V<.3?"rain":V>.7?"lightning":"clear",I=p.fork("heights"),ne=[0,1,2,3,4,5].map(()=>I.range(-26,22)),S=I.range(205,255),d=(e,t=1)=>new b.Color(e).multiplyScalar(t),P=Na(h.elev,-65).clone().normalize(),Z=d(h.sunCol[0],h.sunCol[1]),$={rng:p,preset:h.preset,sunIntensity:0};w==="night"?$.bodyOverrides={0:{elevation:h.elev,azimuth:-65}}:($.sunElevation=h.elev,$.sunAzimuth=-65),w==="golden"&&($.zenith="#6E97A8",$.horizon="#E6D2A6");const be=Ka($);C.add(be.object),C.fog=new b.FogExp2(new b.Color(h.fog),h.dens),await m.yield();const Ee=Io.waterLight(be),Ie=Io.makeOcean({rng:p,light:Ee,preset:"calm",radius:5500,rings:100,segments:140,deep:h.deep,scatter:h.scatter,glow:h.glow,reflectivity:.5,detail:.62,roughness:.04});C.add(Ie.object),await m.yield();const ee=await Xa(m,{palette:Tt,livery:A,sprayColor:h.spray,sprayGain:1.15,progress:-10,cabin:h.cabin,lamp:h.lamp});ee.setLight({sunDir:P,sunColor:Z,sky:d(h.sky),horizon:d(h.horizon),shade:d(h.shade),water:d(h.water),spray:d(h.spray),foam:w==="night"?d(h.spray,.5):d("#e9dcc0",w==="dawn"?.7:.85),fleck:w==="night"?.9:0,ambient:w==="night"?1.7:1}),C.add(ee.object),await m.yield();const Ce={height:190,width:240,depth:150},de=await _o(m,{pierced:!0,...Ce,uniforms:ee.uniforms,palette:Tt,rng:p.fork("pierced")});C.add(de.object);const ye=w==="night"?.9:1;if(ye<1)for(const e of[de.materials.rock,de.object.children[0].material])e.uniforms.uRockCol.value.multiplyScalar(ye);if(w==="night")for(const e of[de.materials.rock,de.object.children[0].material])e.uniforms.uBumpK&&(e.uniforms.uBumpK.value=.6);if(w==="night"){de.materials.slop.uniforms.uFoamCol.value.copy(d(h.spray,.35));const e=ee.parts.disc.material.uniforms;e.uDim.value=.42,e.uTipCol.value.copy(d(h.sunCol[0],.5))}await m.yield();const z=de.anchors.front.z,qe=de.anchors.portalSeat.position,Ae=445,Ft=Ae,Wt=z+700,pt=[],wt=85*Math.PI/180,ue=new b.Vector3(-Math.sin(wt),0,-Math.cos(wt)),jt=e=>new b.Vector3(Ft-Math.cos(e)*Ae,0,Wt+Math.sin(e)*Ae),po=jt(wt),pe=po.clone().addScaledVector(ue,-180);pe.y=300,pt.push([pe.x,300,pe.z],[pe.x+ue.x*90,300,pe.z+ue.z*90]);for(let e=0;e<5;e++){const t=wt*(1-e/5),o=jt(t);pt.push([o.x,ce(296,96,Math.pow(e/5,1.1)),o.z])}pt.push([0,90,z+700],[0,62,z+600],[0,32,z+500],[0,9,z+400],[0,3.4,z+340],[0,3,z+300],[0,3,z+225],[0,3,z+150],[0,3.1,z+96],[0,4.2,z+40],[qe.x,5.5,qe.z]);const Me=Va(pt),Ut=Me.length||1540,gt={kiss:Me.nearestXZ(0,z+300).u*Ut,depart:168,uT0:Me.nearestXZ(po.x,po.z).u,uT1:Me.nearestXZ(0,z+700).u},_e=pe.clone().addScaledVector(ue,700);_e.y=0;const xt=[];xt.push([0,0,220,190]);const rt=[[-1,660,190,150,170],[1,592,236,150,160],[-1,440,180,140,150],[1,350,180,150,175],[-1,235,170,150,180],[1,140,170,140,140]],Oe={n:rt[3][1]-rt[3][2]/2,s:rt[1][1]+rt[1][2]/2},Ze=(e,t)=>e>0&&t>Oe.n?44:64,lt=[de];for(let e=0;e<rt.length;e++){const t=rt[e],o=t[4]+ne[e],a=await _o(m,{height:o,width:t[2],depth:t[3],segments:e===1?86:72,rows:24,crowns:260,lipTrees:t[0]>0?34:14,caveAt:e===2?{x:-15,y:40,hw:7.5,hh:10}:null,materials:de.materials,uniforms:ee.uniforms,palette:Tt,rng:p.fork("wall"+e)});a.object.position.set(t[0]*(Ze(t[0],t[1])+t[3]/2),0,z+t[1]),a.object.rotation.y=t[0]<0?Math.PI/2:-Math.PI/2,C.add(a.object),lt.push(a),xt.push([a.object.position.x,a.object.position.z,t[2]*.8,o]),await m.yield()}{const e=await _o(m,{height:S,width:120,depth:100,segments:56,rows:22,crowns:150,materials:de.materials,uniforms:ee.uniforms,palette:Tt,rng:p.fork("sentinel")});e.object.position.copy(_e),e.object.rotation.y=Math.atan2(ue.x,ue.z),C.add(e.object),lt.push(e),xt.push([_e.x,_e.z,95,S]),await m.yield()}const Q=ee.uniforms,De=(e,t)=>{const o=new b.InstancedBufferGeometry;o.index=e.index,o.setAttribute("position",e.getAttribute("position"));for(const a in t)o.setAttribute(a,new b.InstancedBufferAttribute(new Float32Array(t[a][0]),t[a][1]));return o.instanceCount=t[Object.keys(t)[0]][0].length/t[Object.keys(t)[0]][1],o},$e=()=>b.UniformsUtils.clone(b.UniformsLib.fog),wo=new b.ShaderMaterial({vertexShader:Qa,fragmentShader:Ja,uniforms:{uSunDir:Q.uSunDir,uSunCol:Q.uSunCol,uSkyCol:Q.uSkyCol,uShadeCol:Q.uShadeCol,uHorizonCol:Q.uHorizonCol,uRockCol:{value:d(Tt[2],ye)},uLeafCol:{value:d(Tt[3],1.5)},uHazeSun:{value:d(h.hazeSun)},uHazeAway:{value:d(h.hazeAway)},uHaze:{value:h.haze*(.8+.4*V)}}}),ht=[];{const e=p.fork("far"),t=400,o=4600,a=z+500;for(let r=-o;r<o;r+=t){await m.yield();for(let n=-o;n<o;n+=t){const i=e()<.5*Y,s=r+t/2+e.range(-150,150),l=a+n+t/2+e.range(-150,150),c=e.range(34,105),v=e.range(80,250),f=e.range(.7,1.25),y=e.range(0,6.28);i&&(Math.abs(s)<245+c&&l>z-260&&l<z+860||Me.nearestXZ(s,l).dist<215+c||Math.hypot(s-_e.x,l-_e.z)<230+c||Math.hypot(s,l-a)>o||ht.push([s,l,c,v,f,y]))}}}{const e=new b.Matrix4,t=new b.Quaternion,o=new b.Vector3(0,1,0),a=new b.Vector3,r=new b.Vector3;for(let n=0;n<3;n++){const i=ht.filter((l,c)=>c%3===n),s=new b.InstancedMesh(w0(n),wo,Math.max(1,i.length));i.forEach((l,c)=>{t.setFromAxisAngle(o,l[5]),a.set(l[0],0,l[1]),r.set(l[2],l[3],l[2]*l[4]),e.compose(a,t,r),s.setMatrixAt(c,e)}),s.count=i.length,s.frustumCulled=!1,C.add(s),await m.yield()}ht.forEach(n=>xt.push([n[0],n[1],n[2]*1.7,n[3]]))}await m.yield();{const e=(f,y)=>{const M=Math.sin(f*127.1+y*311.7+S)*43758.5453;return M-Math.floor(M)},t=ht.map((f,y)=>({f,v:y%3,d:Me.nearestXZ(f[0],f[1]).dist})).filter(f=>f.d<1050).sort((f,y)=>f.d-y.d),o=[0,-500,0,1],a=[1,0,0,.6],r=Math.round(1700*F),n=Math.hypot(P.x,P.z)||1;for(const[f,y,M,g]of[[72,456,11,.5],[-92,547,9,-.6],[84,242,9,.5],[-92,335,8,-.6]])for(let x=0;x<M;x++){const q=f*7.1+x*3.3,L=2.2+1.6*e(q,1)*e(q,2);o.push(f+(e(q,3)-.5)*16,1.3+L*.42,z+y+(e(q,4)-.5)*18,L),a.push(.5+.2*e(q,5),e(q,6)*6.28,-.15+.6*g,.5+.16*e(q,7))}let i=0;for(const f of t){const y=f.f[0],M=f.f[1],g=f.f[2],x=f.f[3],q=f.f[4],L=f.f[5],E=Math.min(84,Math.round(g*g*q/100));if(o.length/4+E>r)break;const O=Math.cos(L),G=Math.sin(L);for(let ae=0;ae<E;ae++,i++){const he=e(i,2)<(f.d<600?.6:.4),fe=p0(f.v,e(i,1)*6.2832,he?.8+.07*e(i,3):Math.sqrt(e(i,3))*.76),ve=fe[0]*g,ge=fe[2]*g*q,We=ve*O+ge*G,Ue=-ve*G+ge*O,He=4.5+5.5*e(i,4)*e(i,5)+(he?0:1);o.push(y+We,fe[1]*x+He*.15,M+Ue,He),a.push(.7+.7*e(i,6),e(i,7)*6.28,vt(.5+.5*(We*P.x+Ue*P.z)/n/g)*2-1,.55+.25*e(i,8))}await m.yield()}const s=wo.uniforms,l=new b.ShaderMaterial({vertexShader:e0,fragmentShader:t0,uniforms:{uTime:Q.uTime,uSunDir:Q.uSunDir,uSunCol:Q.uSunCol,uSkyCol:Q.uSkyCol,uShadeCol:Q.uShadeCol,uLeafCol:s.uLeafCol,uHazeSun:s.uHazeSun,uHazeAway:s.uHazeAway,uHaze:s.uHaze}}),c=new b.IcosahedronGeometry(1,0),v=new b.Mesh(De(c,{aC:[o,4],aT:[a,4]}),l);v.frustumCulled=!1,C.add(v)}await m.yield();const go=new b.PlaneGeometry(1,1,1,48);go.rotateX(-Math.PI/2),go.translate(0,0,.5);const yt=[[-24,612,.25],[20,640,-.2],[-15,486,.12],[22,428,-.3]],ct=[[21,282,.35],[25,250,.5],[22,222,.3],[26,172,.55],[22,142,.4],[27,116,.6],[-52,815,1.9],[230,900,2.6],[-420,380,.8],[330,250,1.2]];let Pt;{const e=[],t=[],o=p.fork("decal"),a=Math.hypot(P.x,P.z)||1,r=Math.atan2(-P.x/a,-P.z/a),n=Math.max(.2,P.y/a),i=Math.PI/2-(Ie.windAngle||0),s=D("clouds");for(let g=0;g<6;g++){const x=s.range(-1900,1500),q=z+s.range(-260,2300),L=s.range(620,900),E=s(),O=x+Math.sin(i)*L*.625,G=q-L*.5+Math.cos(i)*L*.625;Math.abs(O)<230+L*.625&&Math.abs(G-(z+360))<520+L*.625||(e.push(x,q-L*.5,i,E),t.push(L,L*1.25,9,0))}for(const g of xt)e.push(g[0],g[1],r,o()),t.push(g[2],Math.min(720,g[3]/n)+g[2]*.5,0,0);e.push(0,z-2,0,.17),t.push(124,800,7,0),xt.forEach((g,x)=>{x>6&&(e.push(g[0],g[1],0,o()),t.push(g[2]*.95,g[3],2,0))});for(let g=0;g<6;g++)e.push(ct[g][0],z+ct[g][1],0,o()),t.push(8,15,2,1);const l=Math.round(40*F);for(let g=0;g<l;g++){const x=g<14;e.push(x?o.range(-56,56):o.range(-900,900),z+(x?o.range(20,560):o.range(-200,1700)),o.range(-.12,.12)+(x?0:.7),o()),t.push(x?o.range(3.5,6):o.range(9,18),x?o.range(90,220):o.range(250,600),1,0)}for(const g of[[-11,18,.07,.13,5.5,120],[6,30,-.05,.47,6.5,110],[17,8,.1,.83,5,135],[-3,70,-.12,.29,6,90]])e.push(g[0],z+g[1],g[2],g[3]),t.push(g[4],g[5],1,0);e.push(0,z+300,Math.PI,.37),t.push(64,300,3,0),e.push(0,z-6,0,.61),t.push(21,430,4,0);for(const g of yt)e.push(g[0],z+g[1],0,.3+g[2]),t.push(4.6,5,2,3);const c=p.fork("paws"),v=Math.PI/2-(Ie.windAngle||0),f=Math.round(36*F),y=Math.cos(v)>=0?0:Math.PI;for(let g=0;g<f;g++){const x=g<12,q=x?c.range(70,150):c.range(200,440),L=c.range(0,6.283),E=Math.sqrt(c())*1e3;e.push(x?c.range(-50,50):445+Math.cos(L)*E,z+(x?c.range(g<8?60:300,640):700+Math.sin(L)*E),(x?y:v)+c.range(-.15,.15),c()),t.push(x?c.range(24,44):q*c.range(.35,.6),q,5,0)}e.push(0,0,0,.5),t.push(42,30,8,0),Pt=new b.ShaderMaterial({vertexShader:i0,fragmentShader:r0,fog:!0,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{...$e(),uTime:Q.uTime,uSunXZ:{value:new b.Vector2(P.x/a,P.z/a)},uShadowCol:{value:d(h.deep,.2).lerp(d(h.shade,.4),.45)},uPawCol:{value:d(h.deep,.26).lerp(d(h.shade,.5),.5)},uPawA:{value:w==="night"?.46:.66},uFoamCol:{value:d("#e9dcc0",w==="night"?.25:.8)},uWallCol:{value:d(h.wallRef[0],h.wallRef[1])},uWestCol:{value:d(h.shade).lerp(d(h.wallRef[0]),.3).multiplyScalar(w==="night"?.8:.5)},uWestA:{value:w==="night"?.42:.16},uGlitCol:{value:d(h.glit[0],h.glit[1])},uLampCol:{value:d("#BFFFE0",1.5)},uLampA:{value:h.squid},uMirA:{value:.85},uWalls:{value:rt.map((g,x)=>new b.Vector4(z+g[1],g[2]*.47,g[4]+ne[x],g[0]*(Ze(g[0],g[1])-5)))},uEnd:{value:new b.Vector4(z,108,190,0)},uLane:{value:new b.Vector4((Ze(1,Oe.s)-Ze(-1,Oe.s))/2,(Ze(1,Oe.s)+Ze(-1,Oe.s))/8,z,z+Oe.s)},uEndCol:{value:d(h.shade,w==="night"?.9:.95).lerp(d(h.sky),.3).multiplyScalar(.8)},uOwn:{value:new b.Vector4(0,0,0,0)},uOwnK:{value:.6},uOwnCol:{value:d(A==="silver"?"#AEB6B8":A==="white"?"#D9DCD8":"#D8CDA8",w==="night"?.3:.62).lerp(d(h.horizon,w==="night"?.4:.8),.3)},uCloudA:{value:w==="day"?.3:w==="night"?0:.17},uWakeCol:{value:w==="night"?d(h.spray,.5):d("#e9dcc0",.8)},uWakeDark:{value:w==="night"?.33:1},uWakeK:{value:.75},uRunZ:{value:z+300},uGoldCol:{value:d(h.horizon,w==="night"?.5:.85)},uSailCol:{value:d(T,.55).lerp(d(h.spray),.25)},uMint:{value:d("#BFF0E0",1.25)},uShadowA:{value:h.shadowA},uReflA:{value:h.reflA},uWake:{value:-100},uGlitA:{value:w==="dawn"?.6:1}}});const M=new b.Mesh(De(go,{aXf:[e,4],aDim:[t,4]}),Pt);M.frustumCulled=!1,M.renderOrder=2,C.add(M)}await m.yield();const za={...$e(),uTime:Q.uTime,uFade:{value:1},uFlash:{value:1}},Vo={...$e(),uTime:Q.uTime,uFade:{value:1},uFlash:{value:0}},Ye=new b.Vector3(-ue.z,0,ue.x);let Bt=null,It=null,Go=255,Ho=310;{const e=[],t=[],o=[],a=p.fork("sprites"),r=(R,_,X,J,Se,Pe,Be,me)=>{e.push(R,_,X),t.push(J,Se,me,a()),o.push(Pe.r,Pe.g,Pe.b,Be)},n=d(h.thunder[0]),i=d(h.thunder[1]);for(let R=0;R<34;R++){const _=a.range(.2,1),X=a.range(4700,5300),J=a(),Se=250+J*J*3300,Pe=a();r(Math.sin(_)*X,Se,z-Math.cos(_)*X,a.range(1300,2300)*(1+J*.6),a.range(900,1500),i.clone().lerp(n,.25+.75*Pe*(.4+.6*J)).multiplyScalar(.95),.92,.3)}const s=d(h.mist),l=Math.round(46*F*Y*(.5+1*V));for(let R=0;R<l;R++){let _=a.range(-1500,1500);const X=a.range(55,125),J=z+a.range(-300,1900),Se=a.range(230,470),Pe=a.range(5,8),Be=a.range(.24,.44);Math.abs(_)<330&&J>z-220&&J<z+800&&(_=(_<0?-1:1)*(330+Math.abs(_))),r(_,X,J,Se,Se/Pe,s,Be,.8)}const c=[],v=.8;await m.yield();{const R=D("veils"),_=Ie.windAngle||0,X=[Math.cos(_),Math.sin(_)];for(const J of ht){if(J[3]<=120)continue;const Se=R(),Pe=R(),Be=J[2]*Math.max(1,J[4])+16,me=Math.max(300,J[2]*4.6),dt=J[0]+X[0]*Be,Ke=J[1]+X[1]*Be;Se>=v||Math.abs(dt)<330&&Ke>z-220&&Ke<z+800||c.push([dt,Math.min(110,Math.max(70,J[3]*.45)),Ke,me,me/6,Pe])}}await m.yield();const f=d(h.ceil,2).lerp(d(h.rim),.16),y=e.length/3;for(let R=0;R<30;R++){const _=a.range(-420,800),X=a.range(-560,560);Math.abs(X)<50||r(pe.x+ue.x*_+Ye.x*X,a.range(330,400),pe.z+ue.z*_+Ye.z*X,a.range(160,380),a.range(70,150),f,X>520?0:.5,.26)}{let R=1e9,_=0,X=0;for(let J=y;J<e.length/3;J++){if(o[J*4+3]<=0)continue;const Se=e[J*3+1]-t[J*4+1]*.5;R=Math.min(R,Se),_+=Se,X++}X>1&&_/X>R&&(Go=R,Ho=_/X)}if(j==="rain")for(let R=0;R<16;R++){const _=a.range(300,760),X=a.range(-900,-160);r(pe.x+ue.x*_+Ye.x*X,a.range(170,230),pe.z+ue.z*_+Ye.z*X,a.range(220,420),a.range(360,460),d(h.ceil,.9).lerp(d(h.rim),.25),a.range(.22,.4),.45)}if(w==="dawn"){const R=(me,dt)=>{const Ke=Math.sin(me*91.7+dt*271.3+S)*43758.5453;return Ke-Math.floor(Ke)},_=[],X=[],J=[],Se=d(h.mist,.95).lerp(d(h.hazeSun),.35),Pe=d(h.shade,1.5).lerp(d(h.mist),.45);for(let me=0;me<30;me++){const dt=me%2?1:-1,Ke=me%6===5,xa=70+80*R(me,1);_.push(Ke?(R(me,2)-.5)*40:dt>0?22+12*R(me,2):-(44+16*R(me,2)),3+4*R(me,3),z+40+660*((me+R(me,4))/30)),X.push(xa,xa*(.09+.06*R(me,5)),.6,R(me,6));const Bo=Pe.clone().lerp(Se,dt>0?.8:.25);J.push(Bo.r,Bo.g,Bo.b,(Ke?.16:.3)+.14*R(me,7))}It={...$e(),uTime:Q.uTime,uFade:{value:0},uFlash:{value:1}};const Be=new b.Mesh(De(new b.PlaneGeometry(1,1),{aPos:[_,3],aSize:[X,4],aCol:[J,4]}),new b.ShaderMaterial({vertexShader:uo,fragmentShader:mo,fog:!0,transparent:!0,depthWrite:!1,uniforms:It}));Be.frustumCulled=!1,Be.renderOrder=4,C.add(Be)}for(const R of c)e.push(R[0],R[1],R[2]),t.push(R[3],R[4],.9,R[5]),o.push(s.r,s.g,s.b,.7);const M=new b.ShaderMaterial({vertexShader:uo,fragmentShader:mo,fog:!0,transparent:!0,depthWrite:!1,uniforms:za}),g=new b.Mesh(De(new b.PlaneGeometry(1,1),{aPos:[e,3],aSize:[t,4],aCol:[o,4]}),M);g.frustumCulled=!1,g.renderOrder=4,C.add(g);const x=[],q=[],L=[],E=d("#BFF0E0");if(x.push(0,9,z+2),q.push(60,45,0,.31),L.push(E.r,E.g,E.b,.25),h.squid>0&&yt.forEach((R,_)=>{x.push(R[0],5.2,z+R[1]+1.5),q.push(15,9,0,(_+1.02)/7.3),L.push(.62,1,.8,.26*h.squid)}),j==="lightning"){const R=d(w==="night"?"#9FB4FF":"#FFE9C8");for(let _=0;_<5;_++){const X=a.range(.3,.95),J=4600;x.push(Math.sin(X)*J,a.range(900,2600),z-Math.cos(X)*J),q.push(a.range(1500,2400),a.range(1e3,1600),2,a()),L.push(R.r,R.g,R.b,.5)}}const O=new b.ShaderMaterial({vertexShader:uo,fragmentShader:mo,fog:!0,transparent:!0,depthWrite:!1,blending:b.AdditiveBlending,uniforms:Vo}),G=new b.Mesh(De(new b.PlaneGeometry(1,1),{aPos:[x,3],aSize:[q,4],aCol:[L,4]}),O);G.frustumCulled=!1,G.renderOrder=5,C.add(G),await m.yield();const ae=new b.ShaderMaterial({vertexShader:ya,fragmentShader:l0,transparent:!0,depthWrite:!1,side:b.DoubleSide,uniforms:{uTime:Q.uTime,uCol:{value:d(h.ceil,2.3)},uRim:{value:d(h.rim)},uEdge:{value:new b.Vector4(pe.x,pe.z,ue.x,ue.z)}}}),he=new b.PlaneGeometry(8400,8400);he.rotateX(Math.PI/2);const fe=new b.Mesh(he,ae);if(fe.position.set(pe.x-ue.x*2800,420,pe.z-ue.z*2800),fe.frustumCulled=!1,fe.renderOrder=3,C.add(fe),w==="dawn"){const R=new b.PlaneGeometry(9400,9400);R.rotateX(-Math.PI/2),Bt=new b.ShaderMaterial({vertexShader:ya,fragmentShader:h0,transparent:!0,depthWrite:!1,side:b.DoubleSide,uniforms:{uTime:Q.uTime,uCol:{value:d(h.mist,.9)},uShade:{value:d(h.shade,1).lerp(d(h.mist),.42)},uHazeSun:{value:d(h.hazeSun)},uHazeAway:{value:d(h.hazeAway)},uSunDir:Q.uSunDir,uFade:{value:1},uMid:{value:new b.Vector2(0,z+500)},uClear:{value:new b.Vector3(_e.x,_e.z,330)},uCorr:{value:new b.Vector2(z,z+760)}}});const _=new b.Mesh(R,Bt);_.position.set(0,9,z+500),_.frustumCulled=!1,_.renderOrder=3,C.add(_)}const ve=[],ge=[];for(let R=0;R<8;R++){const _=a.range(620,1050),X=-1e3+R*260+a.range(-70,70);ve.push(pe.x+ue.x*_+Ye.x*X,418,pe.z+ue.z*_+Ye.z*X),ge.push(a.range(26,60),a.range(90,170),a(),a.range(.19,.3)*(w==="night"?.5:1)*(X>560?.45:1))}const We=new b.PlaneGeometry(1,1,1,6);We.translate(0,.5,0);const Ue=new b.ShaderMaterial({vertexShader:c0,fragmentShader:f0,transparent:!0,depthWrite:!1,blending:b.AdditiveBlending,side:b.DoubleSide,uniforms:{uSunDir:Q.uSunDir,uTime:Q.uTime,uCol:{value:d(h.rim,1)}}}),He=new b.Mesh(De(We,{aTop:[ve,3],aW:[ge,4]}),Ue);He.frustumCulled=!1,He.renderOrder=4,C.add(He)}await m.yield();let _t=null;const xo=e=>e-Math.floor(e),yo=Math.fround,Ot=(e,t)=>{let o=xo(yo(e*123.34)),a=xo(yo(t*456.21));const r=o*(o+45.32)+a*(a+45.32);return o+=r,a+=r,xo(yo(o*a))},bo=(e,t)=>{const o=Math.floor(e),a=Math.floor(t);let r=e-o,n=t-a;return r=r*r*(3-2*r),n=n*n*(3-2*n),ce(ce(Ot(o,a),Ot(o+1,a),r),ce(Ot(o,a+1),Ot(o+1,a+1),r),n)},Vt=(e,t)=>bo(e,t)*.55+bo(e*2.13+7.1,t*2.13+7.1)*.3+bo(e*4.31+3.7,t*4.31+3.7)*.15,ka=(e,t,o)=>{const a=e*.0016+o*.004,r=t*.0016+o*.002,n=Vt(a,r)*.7+Vt(a*3.7+5,r*3.7+5)*.3,i=Vt(a*8.3+3,r*8.3+3),s=e-pe.x,l=t-pe.z,c=s*ue.x+l*ue.z,v=s*Ye.x+l*Ye.z,f=c+(n-.5)*480+(i-.5)*130,y=v+(Vt(a*1.4+11,r*1.4+11)-.5)*420+(i-.5)*110,M=n+.6*(1-N(250,820,c))+(i-.5)*.14;return(1-N(700,930,f))*(1-N(380,760,y))*N(.1,.36,M)};{const e=(v,f)=>{const y=Math.sin(v*53.3+f*197.1)*43758.5453;return y-Math.floor(y)},t=[],o=Math.round(520*F);for(let v=0;v<o;v++)t.push(e(v,1),e(v,2),e(v,3),e(v,4));_t={uTime:Q.uTime,uRain:{value:0},uRel:{value:new b.Vector3(44,-9,6)},uCol:{value:d(h.rim,w==="night"?.6:.85).lerp(d(h.sky),.35)}};const a=new b.PlaneGeometry(1,1);a.translate(0,.5,0);const r=new b.Mesh(De(a,{aR:[t,4]}),new b.ShaderMaterial({vertexShader:u0,fragmentShader:d0,transparent:!0,depthWrite:!1,side:b.DoubleSide,uniforms:_t}));r.frustumCulled=!1,r.renderOrder=6,C.add(r);const n=[],i=D("smoke");for(let v=0;v<7;v++){const f=ct[v];n.push(f[0]-7.4*Math.sin(f[2]),6.1,z+f[1]-7.4*Math.cos(f[2]),i())}const s=Ie.windAngle||0,l=new b.PlaneGeometry(1,1,1,18);l.translate(0,.5,0);const c=new b.Mesh(De(l,{aS:[n,4]}),new b.ShaderMaterial({vertexShader:m0,fragmentShader:v0,fog:!0,transparent:!0,depthWrite:!1,side:b.DoubleSide,uniforms:{...$e(),uTime:Q.uTime,uWind:{value:new b.Vector2(Math.cos(s),Math.sin(s)).multiplyScalar(.55)},uCol:{value:d(h.shade,1).lerp(d(h.sky),.5)},uLit:{value:d(h.mist,w==="night"?.5:.95)}}}));c.frustumCulled=!1,c.renderOrder=4,C.add(c)}await m.yield();let Mo=null;{const e=z+372,t=lt[4].object,o=t.children[0].geometry.getAttribute("position").array;let a=1e9;for(let r=0;r<o.length;r+=3){const n=o[r+1];if(n<62||n>78)continue;const i=t.position.z+o[r];Math.abs(i-e)>7||(a=Math.min(a,t.position.x-o[r+2]))}a>1e8&&(a=66),await m.yield(),Mo=Io.makeWaterfall({rng:p.fork("fall"),light:Ee,top:[a-.4,74,e],dir:[-1,0,0],launch:2,height:74,width:9.5,pool:!1,rainbow:0,mistCount:170,mistOpacity:.32,layers:4,glow:1.7,tint:h.deep,density:1}),C.add(Mo.object)}await m.yield();const Gt=new b.ShaderMaterial({vertexShader:n0,fragmentShader:s0,fog:!0,vertexColors:!0,side:b.DoubleSide,uniforms:{...$e(),uTime:Q.uTime,uSunDir:Q.uSunDir,uSunCol:Q.uSunCol,uSkyCol:Q.uSkyCol,uShadeCol:Q.uShadeCol,uLamp:{value:h.lampK},uPenK:{value:w==="dawn"?.55:w==="night"?.8:1}}}),Ht=new b.InstancedMesh(g0(T),Gt,ct.length);Ht.frustumCulled=!1,C.add(Ht),await m.yield();const ze=[[43,197,0],[-45,430,.1],[13,548,-.08],[-46,640,.05],[-300,300,.7],[280,760,1.2]],Kt=new b.InstancedMesh(x0(),Gt,ze.length);Kt.frustumCulled=!1,C.add(Kt);const Nt=[[-40,215,.05,1.3],[-44,120,3.1,1.2],[23,330,.05,1],[-38,345,.1,.9],[40,70,1.2,.7],[-40,520,2.9,1.3],[130,800,1,1.5],[-210,600,2,1.5]],Xt=new b.InstancedMesh(y0(),Gt,Nt.length);Xt.frustumCulled=!1,C.add(Xt);const Zt=new b.InstancedMesh(b0(h.squid),Gt,yt.length);Zt.frustumCulled=!1,C.add(Zt);const se=48,Et=Math.PI*2,$t=[],Ko=(e,t)=>({x:e,z:t,R:new Float32Array(se),vx:new Float32Array(se),vz:new Float32Array(se),max:0}),No=(e,t,o)=>{const a=t-e.x,r=o-e.z,n=Math.hypot(a,r),i=Math.min(se-1,Math.floor((Math.atan2(r,a)/Et+.5)*se));n>e.R[i]&&(e.R[i]=n)},Xo=e=>{const t=Float32Array.from(e.R);for(let o=0;o<se;o++){if(t[o]>0)continue;let a=1,r=1;for(;a<se&&t[(o-a+se)%se]<=0;)a++;for(;r<se&&t[(o+r)%se]<=0;)r++;e.R[o]=a<se?(t[(o-a+se)%se]*r+t[(o+r)%se]*a)/(a+r):0}for(let o=0;o<se;o++){const a=((o+.5)/se-.5)*Et;e.vx[o]=e.x+Math.cos(a)*e.R[o],e.vz[o]=e.z+Math.sin(a)*e.R[o],e.max=Math.max(e.max,e.R[o])}$t.push(e)};for(const e of lt){const t=e.object,o=t.children[0].geometry.getAttribute("position").array,a=Math.cos(t.rotation.y),r=Math.sin(t.rotation.y),n=Ko(t.position.x,t.position.z);for(let i=0;i<o.length;i+=3)o[i+1]<8&&No(n,t.position.x+o[i]*a+o[i+2]*r,t.position.z-o[i]*r+o[i+2]*a);Xo(n),await m.yield()}{const e=C.children.filter(t=>t.isInstancedMesh&&t.material===wo).map(t=>t.geometry.getAttribute("position").array);for(let t=0;t<ht.length;t++){const o=ht[t],a=e[t%3],r=Math.cos(o[5]),n=Math.sin(o[5]),i=Ko(o[0],o[1]);for(let s=0;s<a.length;s+=3)if(a[s+1]*o[3]<8){const l=a[s]*o[2],c=a[s+2]*o[2]*o[4];No(i,o[0]+l*r+c*n,o[1]-l*n+c*r)}Xo(i),t%24===23&&await m.yield()}}await m.yield();const Ca=(e,t,o)=>{const a=t-e.x,r=o-e.z,n=(Math.atan2(r,a)/Et+.5)*se-.5,i=Math.floor(n),s=n-i;let l=1e18;for(let c=-12;c<=12;c++){const v=(i+c+se)%se,f=(v+1)%se,y=e.vx[v],M=e.vz[v],g=e.vx[f]-y,x=e.vz[f]-M,q=vt(((t-y)*g+(o-M)*x)/(g*g+x*x+1e-9)),L=t-y-g*q,E=o-M-x*q;l=Math.min(l,L*L+E*E)}return Math.hypot(a,r)<ce(e.R[(i+se)%se],e.R[(i+1)%se],s)?-Math.sqrt(l):Math.sqrt(l)};{const e=[];for(let n=0;n<=6;n++){const i=-13+28.5*n/6;e.push([i,-21],[i,21])}for(let n=1;n<9;n++){const i=-21+42*n/9;e.push([-13,i],[15.5,i])}const t=[];for(const n of ct)t.push([n[0]-Math.sin(n[2])*8,z+n[1]-Math.cos(n[2])*8,n[0]+Math.sin(n[2])*8,z+n[1]+Math.cos(n[2])*8,3]);for(const n of yt)t.push([n[0]-Math.sin(n[2])*4,z+n[1]-Math.cos(n[2])*4,n[0]+Math.sin(n[2])*4,z+n[1]+Math.cos(n[2])*4,2.5]);for(const n of Nt)t.push([n[0],z+n[1],n[0]+Math.sin(n[2])*90*n[3],z+n[1]+Math.cos(n[2])*90*n[3],2]);const o=new b.Vector3;let a=-1e9,r=-1e9;for(let n=0;n<=Ut;n+=2.5)Me.pointAt(n/Ut,o),o.y<12&&(a=Math.max(a,o.z)),o.y<6&&(r=Math.max(r,o.z));await m.yield();for(let n=0;n<ze.length;n++){const i=ze[n],s=Math.cos(i[2]),l=Math.sin(i[2]),c=i[0],v=z+i[1],f=$t.filter(g=>Math.hypot(c-g.x,v-g.z)<g.max+34+200),y=(g,x,q,L)=>{for(const E of e){const O=g+E[0]*s+E[1]*l,G=x-E[0]*l+E[1]*s;if(q&&(G<r&&O>-33&&O<13||G<a&&O>-26&&O<6))return!1;for(const ae of f)if(Math.hypot(O-ae.x,G-ae.z)<ae.max+8&&Ca(ae,O,G)<8)return!1}if(!q)return!0;for(let E=0;E<ze.length;E++)if(E!==n&&Math.hypot(g-ze[E][0],x-z-ze[E][1])<54)return!1;if(L)for(const E of t){const O=Math.ceil(Math.hypot(E[2]-E[0],E[3]-E[1])/4);for(let G=0;G<=O;G++){const ae=ce(E[0],E[2],G/O)-g,he=ce(E[1],E[3],G/O)-x,fe=ae*s-he*l,ve=ae*l+he*s;if(Math.hypot(Math.max(0,Math.abs(fe-1.25)-14.25),Math.max(0,Math.abs(ve)-21))<E[4]+2)return!1}}return!0};if(y(c,v,!1,!1))continue;let M=!1;for(const[g,x,q,L]of[[!0,2,40,2],[!1,2,40,2],[!0,44,200,4],[!1,44,200,4]]){for(let E=x;E<=q&&!M;E+=L){const O=Math.round(Et*E/L);for(let G=0;G<O&&!M;G++){const ae=G/O*Et,he=c+Math.cos(ae)*E,fe=v+Math.sin(ae)*E;y(he,fe,!0,g)&&(i[0]=he,i[1]=fe-z,M=!0),G%16===15&&await m.yield()}await m.yield()}if(M)break}await m.yield()}}const Qe=new b.Matrix4,Je=new b.Quaternion,et=new b.Euler,tt=new b.Vector3,Yt=new b.Vector3(1,1,1),Zo=(e,t)=>{for(let o=0;o<ct.length;o++){const a=ct[o],r=o<6?vt(1-Math.abs(t-(300-a[1])-18)/60):0;et.set(Math.sin(e*.7+o*1.7)*.03*(1+2*r),a[2],Math.sin(e*.9+o*2.3)*(.04+.1*r)),Je.setFromEuler(et),tt.set(a[0],.1+Math.sin(e*.8+o)*(.12+.25*r),z+a[1]),Qe.compose(tt,Je,Yt),Ht.setMatrixAt(o,Qe)}Ht.instanceMatrix.needsUpdate=!0;for(let o=0;o<ze.length;o++){const a=ze[o];et.set(Math.sin(e*.6+o)*.012,a[2],Math.sin(e*.8+o*2)*.015),Je.setFromEuler(et),tt.set(a[0],Math.sin(e*.7+o*1.3)*.06,z+a[1]),Qe.compose(tt,Je,Yt),Kt.setMatrixAt(o,Qe)}Kt.instanceMatrix.needsUpdate=!0;for(let o=0;o<Nt.length;o++){const a=Nt[o],r=Math.min(e,90)*a[3];et.set(Math.sin(e*1.1+o)*.03,a[2],Math.sin(e*1.3+o*2)*.05),Je.setFromEuler(et),tt.set(a[0]+Math.sin(a[2])*r,Math.sin(e*1+o*1.3)*.08,z+a[1]+Math.cos(a[2])*r),Qe.compose(tt,Je,Yt),Xt.setMatrixAt(o,Qe)}Xt.instanceMatrix.needsUpdate=!0;for(let o=0;o<yt.length;o++){const a=yt[o];et.set(Math.sin(e*.9+o*2.1)*.035,a[2],Math.sin(e*1.1+o*1.3)*.06),Je.setFromEuler(et),tt.set(a[0],Math.sin(e*.85+o*1.9)*.1,z+a[1]),Qe.compose(tt,Je,Yt),Zt.setMatrixAt(o,Qe)}Zt.instanceMatrix.needsUpdate=!0};Zo(0,-999),await m.yield();const Qt=new b.BufferGeometry;Qt.setAttribute("position",new b.Float32BufferAttribute([0,0,.5,.13,0,.05,-.13,0,.05,0,0,-.5,.48,0,.2,1,0,-.32,.1,0,-.14,-.48,0,.2,-1,0,-.32,-.1,0,-.14],3)),Qt.setIndex([0,1,2,1,3,2,1,4,6,4,5,6,2,9,7,7,9,8]);const Jt=(e,t,o)=>{const a=[],r=[];for(let s=0;s<e;s++){const l=t.stray&&s%t.stray===0?3.2:1;a.push(o(),o(),o(),o()),r.push(o.gauss()*t.spread[0]*l,o.gauss()*t.spread[1]*l,o.gauss()*t.spread[2])}const n=new b.ShaderMaterial({vertexShader:o0,fragmentShader:a0,fog:!0,side:b.DoubleSide,transparent:!!t.far,uniforms:{...$e(),uTime:Q.uTime,uFar:{value:t.far||1e6},uNear:{value:t.near||.3},uLift:{value:0},uLoop:{value:t.loop},uRate:{value:t.rate},uSize:{value:t.size},uP0:{value:t.p[0]},uP1:{value:t.p[1]},uP2:{value:t.p[2]},uCol:{value:t.col},uRim:{value:t.rim}}}),i=new b.Mesh(De(Qt,{aA:[a,4],aOff:[r,3]}),n);return i.frustumCulled=!1,C.add(i),i},we=(e,t,o)=>new b.Vector3(e,t,o),Sa=(e,t,o)=>t.clone().multiplyScalar(2).addScaledVector(e,-.5).addScaledVector(o,-.5),Aa=w==="dawn",Ta=new b.Vector3(0,1,0),qt=new b.Vector3,$o=new b.Vector3,Dt={dk:0,s:0,turn:0,dep:0},Yo=(e,t,o)=>{Me.tangentAt(e,qt);const a=e*Ut-gt.kiss,r=a<0?a/32:a<150?a/25:6+(a-150)/14,n=N(.035,.125,e)*(1-N(gt.uT1-.1,gt.uT1+.01,e)),i=.436*n+Math.sin(t*.6)*.012*(r<0?1:0),s=ee.pitch(r)-.11*n-.05*N(gt.uT1,gt.uT1+.05,e)*(1-N(-4,-1.5,r)),l=Math.max(0,a-gt.depart),v=.14+.085*(N(-1.5,.6,r)*(1-N(6.5,9,r)))+.17*n;return qt.y=0,qt.applyAxisAngle(Ta,-v),$o.set(-.5+N(0,30,l)*2.6,r>0?3-o.y+ee.heave(r):0,-l*.93),ee.seatPose(o,qt,i,s,$o),Dt.dk=a,Dt.s=r,Dt.turn=n,Dt.dep=l,Dt},ot=lt[3];ot.object.updateMatrixWorld(!0);const at=ot.anchors.caves[ot.anchors.caves.length-1],K=at.position.clone().applyMatrix4(ot.object.matrixWorld);K.x+=1.5;const u={len:250,clear:6,near:8,gap:1,count:4500,across:1.5,up:1.2,along:9,stray:37,tuck:[2,1],out:1.5,step:1,fine:.125,sta:.5};u.body=2*u.across,u.rho=u.along,u.run=2*u.along+u.body,u.ease=2*u.along,u.inner=u.rho-u.body-mt[0];const Ve=Za(u.count,{spread:[u.across,u.up,u.along],stray:u.stray},p.fork("swift"));await m.yield();const eo=we((Ze(1,Oe.s)-Ze(-1,Oe.s))/2,K.y,z+Oe.s),Qo=Math.hypot(eo.x-K.x,eo.z-K.z),to=(eo.x-K.x)/Qo,oo=(eo.z-K.z)/Qo,Lt=at.halfWidth,re=[0,0],zo=new Map,Jo=new Map;let ao=0;{const e=ee.parts.skin.geometry.getAttribute("position");for(let t=0;t<e.count;t++)ao=Math.max(ao,Math.hypot(e.getX(t),e.getY(t),e.getZ(t))*ee.object.scale.x)}const Le={across:Ve.reach.across+mt[0],up:Ve.reach.up+mt[1],down:Ve.reach.down+mt[1],along:Ve.reach.along},ft=ao+Le.across+u.gap,no=u.near+Le.up,so=u.near+Le.down,io=K.y-u.clear,Ge=Math.floor(io/u.fine),ea=(e,t,o,a=0,r=1/0)=>{const n=lt[e].object,i=n.children[0].geometry.getAttribute("position").array,s=n.children[0].geometry.index.array,l=Math.cos(n.rotation.y),c=Math.sin(n.rotation.y),v=y=>n.position.x+i[y]*l+i[y+2]*c-K.x,f=y=>n.position.z-i[y]*c+i[y+2]*l-K.z;for(let y=a;y<Math.min(s.length,r);y+=3){const M=s[y]*3,g=s[y+1]*3,x=s[y+2]*3;if(Math.min(i[M+1],i[g+1],i[x+1])>K.y+t||Math.max(i[M+1],i[g+1],i[x+1])<K.y-t)continue;const q=v(M),L=i[M+1]-K.y,E=f(M);o(q,L,E,v(g)-q,i[g+1]-K.y-L,f(g)-E,v(x)-q,i[x+1]-K.y-L,f(x)-E)}};ea(3,at.halfHeight,(e,t,o,a,r,n,i,s,l)=>{const c=e+(a+i)/3,v=o+(n+l)/3;if(Math.hypot(c+u.out,v)>Lt||Math.abs(t+(r+s)/3)>at.halfHeight)return;const f=r*l-n*s,y=a*s-r*i,M=f*(c+K.x-ot.object.position.x)+y*(v+K.z-ot.object.position.z)<0?-1:1;re[0]+=M*f,re[1]+=M*y});{const e=Math.hypot(re[0],re[1]);if(e>1e-6)re[0]/=e,re[1]/=e;else{const t=ot.object.position,o=Math.hypot(K.x-u.out-t.x,K.z-t.z);re[0]=(K.x-u.out-t.x)/o,re[1]=(K.z-t.z)/o}}await m.yield();const bt=await $a(m,ot,at,K,re[0],re[1],Ve.reach,u.len/4),ta=Math.max(0,bt.lip),ro=ta+u.run;await m.yield();const oa=[[0,0],[u.len/2*re[0],u.len/2*re[1]],[u.len*to,u.len*oo]].map((e,t,o)=>{const a=o[(t+1)%3],r=o[(t+2)%3],n=Math.hypot(a[0]-e[0],a[1]-e[1])||1,i=(a[1]-e[1])/n,s=(e[0]-a[0])/n,l=i*(r[0]-e[0])+s*(r[1]-e[1]);return Math.abs(l)<1e-6?[0,0,1]:l>0?[-i,-s,-i*e[0]-s*e[1]+u.clear]:[i,s,i*e[0]+s*e[1]+u.clear]});let Mt=-1,ko=u.clear;const Co=(e,t,o)=>{const a=Math.abs(t);if(a>ko||a<=Mt)return;const r=(Math.floor(e/u.clear)+64)*128+Math.floor(o/u.clear)+64,n=Mt<0?zo:Jo,i=Mt<0?r:r*16+Math.floor(t/u.clear)+8;let s=n.get(i);s||n.set(i,s=[]),s.push(e,t,o)},So=(e,t,o,a,r,n)=>{const i=e+u.out,s=a-e,l=n-o,c=s*s+l*l,v=i*s+o*l,f=v*v-c*(i*i+o*o-Lt*Lt);if(c>0&&f>=0)for(const y of[(-v-Math.sqrt(f))/c,(-v+Math.sqrt(f))/c])y>=0&&y<=1&&Co(e+s*y,t+(r-t)*y,o+l*y);for(const y of[-at.halfHeight,at.halfHeight])if((t-y)*(r-y)<0){const M=(y-t)/(r-t);Co(e+s*M,y,o+l*M)}},aa=async e=>{for(let t=1;t<=6;t++)for(let o=0,a=lt[t].object.children[0].geometry.index.count;o<a;o+=e)ea(t,ko,(r,n,i,s,l,c,v,f,y)=>{if(Math.max(Math.abs(n),Math.abs(n+l),Math.abs(n+f))<=Mt)return;for(const x of oa)if(x[0]*r+x[1]*i>x[2]&&x[0]*(r+s)+x[1]*(i+c)>x[2]&&x[0]*(r+v)+x[1]*(i+y)>x[2])return;const M=Math.max(1,Math.ceil(Math.max(Math.hypot(s,l,c),Math.hypot(v,f,y),Math.hypot(s-v,l-f,c-y)))),g=Math.min(Math.hypot(r+u.out,i),Math.hypot(r+s+u.out,i+c),Math.hypot(r+v+u.out,i+y))<=Lt+M;for(let x=0;x<=M;x++)for(let q=0;q<=M-x;q++){const L=r+(s*x+v*q)/M,E=n+(l*x+f*q)/M,O=i+(c*x+y*q)/M;(Math.hypot(L+u.out,O)>Lt||Math.abs(E)>at.halfHeight)&&Co(L,E,O),g&&x+q<M&&(So(L,E,O,L+s/M,E+l/M,O+c/M),So(L,E,O,L+v/M,E+f/M,O+y/M),So(L+s/M,E+l/M,O+c/M,L+v/M,E+f/M,O+y/M))}},o,o+e),await m.yield()};await aa(1/0);const Ao=(e,t)=>{let o=u.clear;const a=Math.floor(e/u.clear)+64,r=Math.floor(t/u.clear)+64;for(let n=-1;n<=1;n++)for(let i=-1;i<=1;i++){const s=zo.get((a+n)*128+r+i);if(s)for(let l=0;l<s.length;l+=3){const c=s[l]-e,v=s[l+2]-t,f=Math.sqrt(c*c+s[l+1]*s[l+1]+v*v);f<o&&(o=f)}}return o},le=[];{const e=we(0,0,0),t=Math.ceil(Me.length),o=ee.object,a=o.position.clone(),r=o.quaternion.clone();for(let n=0;n<=t;n++){const i=n/t;Me.pointAt(i,e),Yo(i,0,e),o.updateMatrix();const s=o.matrix.elements;le.push(s[12]-K.x,s[13]-K.y,s[14]-K.z,s[0],s[4],s[8],s[1],s[5],s[9],s[2],s[6],s[10],e.y-K.y),n%400===399&&await m.yield()}o.position.copy(a),o.quaternion.copy(r),o.updateMatrix()}await m.yield();const U=[],xe=[1/0,-1/0,1/0,-1/0];{const e=le.length/13-1,t=[],o=io+Math.max(no,so);let a=-1,r=-1;for(let n=0;n<=e;n++){const i=le[n*13],s=le[n*13+12],l=le[n*13+2];t.push(i,s,l),Math.abs(s)<=o&&!oa.some(c=>c[0]*i+c[1]*l>c[2]-u.clear+ft)&&(a<0&&(a=n),r=n)}if(a>=0)for(let n=Math.max(0,a-1)*3;n<Math.min(e,r+1)*3+3;n++)U.push(t[n]);for(let n=0;n<U.length;n+=3)xe[0]=Math.min(xe[0],U[n]-ft),xe[1]=Math.max(xe[1],U[n]+ft),xe[2]=Math.min(xe[2],U[n+2]-ft),xe[3]=Math.max(xe[3],U[n+2]+ft)}const na=(e,t,o)=>{const a=ao+e+u.gap,r=u.near+t,n=-u.near-o,i=[],s=[1/0,-1/0,1/0,-1/0];for(let l=0;l+5<U.length;l+=3){const c=U[l+1],v=U[l+4]-c;if(Math.min(c,c+v)>r||Math.max(c,c+v)<n)continue;const f=v?(n-c)/v:-1/0,y=v?(r-c)/v:1/0,M=Math.max(0,Math.min(f,y)),g=Math.min(1,Math.max(f,y));if(M>g)continue;const x=U[l+3]-U[l],q=U[l+5]-U[l+2];i.push(U[l]+x*M,U[l+2]+q*M,U[l]+x*g,U[l+2]+q*g);for(const L of[M,g])s[0]=Math.min(s[0],U[l]+x*L-a),s[1]=Math.max(s[1],U[l]+x*L+a),s[2]=Math.min(s[2],U[l+2]+q*L-a),s[3]=Math.max(s[3],U[l+2]+q*L+a)}return{wing:a,lv:i,lb:s}},nt=[na(Le.across,Le.up,Le.down),...u.tuck.map(e=>na(e*u.across+mt[0],0,0))];await m.yield();const sa=(e,t,o)=>{let a=1/0;const r=e.lv;if(t<e.lb[0]||t>e.lb[1]||o<e.lb[2]||o>e.lb[3])return a;for(let n=0;n<r.length;n+=4){const i=r[n+2]-r[n],s=r[n+3]-r[n+1],l=i*i+s*s,c=l>0?Math.min(1,Math.max(0,((t-r[n])*i+(o-r[n+1])*s)/l)):0,v=Math.hypot(r[n]+i*c-t,r[n+1]+s*c-o);v<a&&(a=v)}return a},te=[0,0,0,0],To=(e,t)=>{const o=t*to,a=t*oo;let r=e+u.rho;for(let s=0;s<12;s++){const l=r*re[0]-o,c=r*re[1]-a;if(r=e+u.rho*Math.tan(Math.atan2(Math.abs(l*re[1]-c*re[0]),-(l*re[0]+c*re[1]))/2),!(r<u.len))return null}if(r>u.len/2)return null;const n=Oo((t+u.len)*to,(t+u.len)*oo,o,a,r*re[0],r*re[1],0,0,u.rho);if(!n)return null;const i=t+n.tA+u.len-(n.len-n.s1);return i<t+n.tA?null:Oo(i*to,i*oo,o,a,r*re[0],r*re[1],0,0,u.rho)},lo=(e,t)=>{const o=vt((e.len-t)/e.s4);return 1-o*o*(3-2*o)},Fa=e=>{let t=u.clear;for(let o=0;o<=e.len;o+=u.sta)Ne(e,e.len-o,te),t=Math.min(t,Ao(te[0],te[1]));return t},ia=(e,t)=>{const o=Math.floor((t.len+Le.along)/u.sta),a=e.lb,r=e.lv,n=e.wing*e.wing;for(let i=0;i<=o;i+=16){Ne(t,t.len-i*u.sta,te);const s=te[0],l=te[1];if(!(s<a[0]||s>a[1]||l<a[2]||l>a[3])){for(let c=0;c<r.length;c+=32)if((r[c]-s)*(r[c]-s)+(r[c+1]-l)*(r[c+1]-l)<n)return!1}}for(let i=0;i<=o;i+=8)if(Ne(t,t.len-i*u.sta,te),!(te[0]<a[0]-8*u.sta||te[0]>a[1]+8*u.sta||te[1]<a[2]-8*u.sta||te[1]>a[3]+8*u.sta)){for(let s=i;s<i+8&&s<=o;s++)if(Ne(t,t.len-s*u.sta,te),sa(e,te[0],te[1])<e.wing)return!1}return!0};let ho=u.clear;for(let e=0;e<=ro;e+=u.sta)ho=Math.min(ho,Ao(e*re[0],e*re[1]));const ra=ho>=u.clear?u.clear:ho-1e-6,Fo=nt.map(e=>{for(let t=0;t<=u.len/2;t+=u.sta)if(sa(e,t*re[0],t*re[1])<e.wing)return t;return 1/0}),la=e=>{for(let t=0;t<=e.len;t+=u.sta)if(Ne(e,e.len-t,te),Ao(te[0],te[1])<(t<=e.run?ra:u.clear))return!1;return!0},Wa=async()=>{let e=null,t=nt.length-1,o=0;const a=nt.map(()=>null);for(let r=ro;r<=u.len/2&&t>=0&&(!e||r<Fo[t]);r+=u.step)for(let n=Math.floor(u.len);n>=u.step&&t>=0;n-=u.step){const i=To(r,n);if(!i)continue;++o%48===0&&await m.yield();const s=ia(nt[t],i);if(!(e&&!s)){if(la(i)&&(e||(e=i),s)){for(a[t]=i;t>0&&ia(nt[t-1],i);)a[--t]=i;t--}await m.yield()}}return[e,a]},Pa=async(e,t,o,a)=>{const r=new Int32Array(2*Ge+2),n=new Uint8Array(2*Ge+1),i=Math.floor(e.len/u.sta),s=Math.floor((e.len+Le.along)/u.sta),l=(f,y,M)=>{let g=0,x=2*Ge;if(M<1e-6){if(f>0||y<0)return}else g=Math.max(g,Math.ceil(f/M/u.fine)+Ge),x=Math.min(x,Math.floor(y/M/u.fine)+Ge);g<=x&&(r[g]++,r[x+1]--)},c=()=>{for(let f=0,y=0;f<=2*Ge;f++)if(y+=r[f],y<=0)return!1;return!0};for(let f=0;f<=s;f++){const y=lo(e,f*u.sta);Ne(e,e.len-f*u.sta,te);const M=te[0],g=te[1];if(!(M<xe[0]||M>xe[1]||g<xe[2]||g>xe[3])){for(let x=0;x+5<U.length;x+=3){const q=U[x]-M,L=U[x+2]-g,E=q*q+L*L;if(E>(t+2)*(t+2))continue;const O=U[x+3]-U[x],G=U[x+5]-U[x+2],ae=O*O+G*G,he=q*O+L*G,fe=he*he-ae*(E-t*t);if(ae<=0||fe<=0)continue;const ve=Math.max(0,(-he-Math.sqrt(fe))/ae),ge=Math.min(1,(-he+Math.sqrt(fe))/ae);if(ve>=ge)continue;const We=U[x+1]+(U[x+4]-U[x+1])*ve,Ue=U[x+1]+(U[x+4]-U[x+1])*ge;l(Math.min(We,Ue)-o,Math.max(We,Ue)+a,y)}if(f%32===31){if(c())return n.fill(1);await m.yield()}}}let v=c();!v&&Mt<0&&(Mt=u.clear,ko=u.clear+io,await aa(768));for(let f=0;f<=i&&!v;f++){const y=lo(e,f*u.sta),M=f*u.sta<=e.run?ra:u.clear;Ne(e,e.len-f*u.sta,te);const g=te[0],x=te[1],q=Math.floor(g/u.clear)+64,L=Math.floor(x/u.clear)+64,E=io*y+u.clear;let O=!1;for(let G=-1;G<=1;G++)for(let ae=-1;ae<=1;ae++)for(let he=Math.floor(-E/u.clear)+7;he<=Math.floor(E/u.clear)+8;he++){const fe=(q+G)*128+L+ae,ve=he<Math.floor(-E/u.clear)+8?zo.get(fe):Jo.get(fe*16+he);if(ve)for(let ge=0;ge<ve.length;ge+=3){const We=ve[ge]-g,Ue=ve[ge+2]-x,He=M*M-We*We-Ue*Ue;if(He>0){const R=Math.sqrt(He);l(ve[ge+1]-R,ve[ge+1]+R,y),O=!0}}}O&&(v=c()),f%16===0&&await m.yield()}if(v)return n.fill(1);for(let f=0,y=0;f<=2*Ge;f++)y+=r[f],n[f]=y>0?1:0;return n};let Te=null;const Wo=async(e,t)=>{const o=Math.floor((e.len+Le.along)/u.sta)+1,a=new Float64Array(o),r=new Float64Array(o),n=new Float64Array(o),i=new Float64Array(le.length/13);if(!Te){const l=ee.parts.skin.geometry.getAttribute("position"),c=ee.object.scale.x,v=[];for(let f=0;f<l.count;f++)v.push([l.getX(f),l.getY(f),l.getZ(f),Math.hypot(l.getX(f),l.getY(f),l.getZ(f))*c]);await m.yield(),Te=new Float64Array(v.sort((f,y)=>y[3]-f[3]).flat()),await m.yield()}for(let l=0;l<o;l++)Ne(e,e.len-l*u.sta,te),a[l]=te[0],r[l]=t*lo(e,l*u.sta),n[l]=te[1];let s=1/0;for(let l=0;l<i.length;l++){const c=l*13;let v=1/0;for(let f=0;f<o;f++){const y=a[f]-le[c],M=r[f]-le[c+1],g=n[f]-le[c+2],x=y*y+M*M+g*g;x<v&&(v=x)}i[l]=Math.sqrt(v),s=Math.min(s,i[l]+Te[3]),l%100===99&&await m.yield()}await m.yield();for(const l of Array.from(i.keys()).sort((c,v)=>i[c]-i[v])){if(i[l]-Te[3]>=s)break;const c=l*13,v=[],f=(s+Te[3])*(s+Te[3]);let y=s*s;for(let M=0;M<o;M++){const g=a[M]-le[c],x=r[M]-le[c+1],q=n[M]-le[c+2];g*g+x*x+q*q<f&&v.push(M)}for(let M=0;M<Te.length&&Te[M+3]>i[l]-s;M+=4){const g=Te[M],x=Te[M+1],q=Te[M+2],L=le[c]+le[c+3]*g+le[c+4]*x+le[c+5]*q,E=le[c+1]+le[c+6]*g+le[c+7]*x+le[c+8]*q,O=le[c+2]+le[c+9]*g+le[c+10]*x+le[c+11]*q;for(let G=0;G<v.length;G++){const ae=v[G],he=a[ae]-L,fe=r[ae]-E,ve=n[ae]-O,ge=he*he+fe*fe+ve*ve;ge<y&&(y=ge,s=Math.sqrt(ge))}M%1024===1020&&await m.yield()}await m.yield()}return s};let[Re,Po]=await Wa(),ie=Po[0],je=0,Fe=0,ha=null;if(!Re)for(let e=Math.floor(u.len);e>=u.step;e-=u.step){const t=To(ro,e);if(!t)continue;const o=Fa(t);(!Re||o>Re.gap)&&(Re=t,Re.gap=o),await m.yield()}const zt=[],ca=async(e,t,o,a)=>{const r=[],n=[];for(let i=ro,s=0;i<=u.len/2&&i<a;i+=u.step,s++){let l=0;if(zt[s]===void 0){zt[s]=null;for(let c=Math.floor(u.len);c>=u.step;c-=u.step){const v=To(i,c);if(++l%8===0&&await m.yield(),v&&la(v)){zt[s]=v;break}}}zt[s]&&(n.push(zt[s]),r.push(await Pa(zt[s],e,t,o))),await m.yield()}for(let i=1;i<=Ge;i++)for(const s of[-1,1]){const l=r.findIndex(c=>!c[Ge+s*i]);if(l>=0)return[n[l],s*i*u.fine]}return null};if(!ie){const e=await ca(ft,no,so,Fo[0]);e&&([ie,je]=e)}if(!ie){const e=Po.findIndex((t,o)=>o>0&&t);e>0&&(ie=Po[e],Fe=u.tuck[e-1])}if(!ie){const e=await ca(nt[nt.length-1].wing,u.near,u.near,Fo[nt.length-1]);e&&([ie,je]=e,Fe=u.tuck[u.tuck.length-1])}let Eo=ie&&(Fe||je||ie!==Re)?await Wo(ie,je):1/0;if(ie&&(je||ie!==Re)&&Eo<await Wo(Re,0)&&(ie=null),ie||(ie=Re,je=0,Fe=u.tuck[u.tuck.length-1],Eo=await Wo(Re,0)),Fe){let e=1/0,t=-1/0;const o=Math.floor((ie.len+Le.along)/u.sta),a=[];for(let n=0;n+5<U.length;n+=3)Math.min(U[n+1],U[n+4])<=Math.max(0,je)+no&&Math.max(U[n+1],U[n+4])>=Math.min(0,je)-so&&a.push(n);for(let n=0;n<=o;n++){Ne(ie,ie.len-n*u.sta,te);const i=te[0],s=te[1],l=je*lo(ie,n*u.sta);if(!(i<xe[0]||i>xe[1]||s<xe[2]||s>xe[3])){for(const c of a){if(Math.min(U[c+1],U[c+4])>l+no||Math.max(U[c+1],U[c+4])<l-so)continue;const v=U[c+3]-U[c],f=U[c+5]-U[c+2],y=v*v+f*f,M=y>0?Math.min(1,Math.max(0,((i-U[c])*v+(s-U[c+2])*f)/y)):0;if(Math.hypot(U[c]+v*M-i,U[c+2]+f*M-s)<ft){e=Math.min(e,n),t=Math.max(t,n);break}}n%64===63&&await m.yield()}}const r=n=>{let i=0;for(let s=0;s<=32;s++)i=Math.max(i,Math.hypot(n*u.across*Math.cos(s*Math.PI/64)+mt[0],n*u.up*Math.sin(s*Math.PI/64)+mt[1]));return i};for(Fe=Math.ceil(Math.max(Ve.reach.across/u.across,Ve.reach.up/u.up,Ve.reach.down/u.up)/u.fine)*u.fine;Fe>u.fine&&r(Fe)>Eo-u.gap;Fe-=u.fine);e<=t&&(ha={from:ie.len-(t+1)*u.sta,to:ie.len-(e-1)*u.sta,ease:u.ease,across:Fe*u.across,up:Fe*u.up})}await m.yield();const Ea=Ya({base:Qt,flock:Ve,count:Math.round(u.count*F),tuck:ha,bend:{lim:u.inner,ease:u.ease},line:Oo(K.x+ie.x0,K.z+ie.z0,K.x+ie.x1,K.z+ie.z1,K.x+ie.x2,K.z+ie.z2,K.x,K.z,u.rho),y:K.y,lift:je,dir:Aa?-1:1,rate:.07,size:.76,near:.55,far:420,col:d(w==="night"?"#0a0f18":"#141a1c"),rim:d(h.horizon,.9),time:Q.uTime,funnel:{lip:ta,head:ie.run,free:bt.free,deep:bt.deep,back:bt.back,hw:bt.hw,hh:bt.hh}});C.add(Ea);const qa=Jt(150,{spread:[7,1.3,9],loop:0,rate:0,size:1.05,p:[we(ze[0][0],1.6,z+ze[0][1]),we(ze[0][0]+9,10,z+ze[0][1]-29),we(ze[0][0]-9,30,z+ze[0][1]-101)],col:d("#F4EFE2",w==="night"?.35:1.25),rim:d(h.spray,1.5)},p.fork("egret")),M0=Jt(12,{spread:[60,14,120],loop:1,rate:.012,size:2,p:[we(-170,205,z+760),we(60,150,z+420),we(190,215,z+120)],col:d("#7A3A1E",.9),rim:d("#F4EFE2")},p.fork("kite")),qo=.414,Do=Me.pointAt(qo),ut=Me.tangentAt(qo);ut.y=0,ut.normalize();const Lo=we(-ut.z,0,ut.x),fa=Do.clone().addScaledVector(ut,95).addScaledVector(Lo,24).add(we(0,-30,0)),Da=Do.clone().addScaledVector(ut,13).addScaledVector(Lo,7).add(we(0,-4.5,0)),ua=Do.clone().addScaledVector(ut,-55).addScaledVector(Lo,9).add(we(0,6,0)),La=Jt(3,{spread:[1.5,1,5],loop:0,rate:0,size:1.3,near:1,p:[fa,Sa(fa,Da,ua),ua],col:d("#8A4220",1),rim:d("#F4EFE2",1.2)},p.fork("kite1")),z0=Jt(40,{spread:[3.5,.25,16],loop:1,rate:.13,size:.2,p:[we(22,.5,z+430),we(15,2.3,z+350),we(17,.4,z+268)],col:d("#C8DCE4",w==="night"?.8:1.9),rim:d(h.spray,2.5)},p.fork("fish"));await m.yield();const da=e=>1.29+.42*N(.08,.16,e)-.42*N(.5,.6,e)-.25*N(.7,.78,e)-.3*N(.79,.84,e)-.25*N(.88,.92,e)-.07*N(.94,.97,e),kt=64,Ct=[],co=[0];for(let e=0;e<=kt;e++)Ct.push(Math.min(2.5,Math.max(.35,da(e/kt))));for(let e=0;e<kt;e++)co.push(co[e]+2/(Ct[e]+Ct[e+1]));const Ra=e=>{const t=vt(e)*kt,o=Math.min(kt-1,Math.floor(t)),a=t-o;return 44*(co[o]+2*a/(2*Ct[o]+(Ct[o+1]-Ct[o])*a))/co[kt]},oe={acc:2,vOff:40,vMax:50,climb:.1,sOff:31,sMid:35,comet:300,half:28};oe.run=oe.vOff*oe.vOff/(2*oe.acc),oe.t0=oe.sOff-oe.vOff/oe.acc,oe.tMax=oe.vMax/oe.acc;const Ro=e=>{const t=Math.max(0,e-oe.t0);return t<oe.tMax?.5*oe.acc*t*t:.5*oe.acc*oe.tMax*oe.tMax+oe.vMax*(t-oe.tMax)},ma=e=>{const t=Math.max(0,e-oe.run);return oe.climb*t*N(0,60,t)},St=de.object.position.z-Ro(oe.sMid);let st=null,Rt=null,At=null,it=0,jo=0;if(H){const e=St-oe.half,t=St+Ro(44)+oe.half,o=v=>{for(const f of $t)if(!(Math.abs(f.x-v)>f.max+oe.half||f.z+f.max<e||f.z-f.max>t))for(let y=0;y<se;y++){const M=(y+1)%se,g=f.vx[y]-v,x=f.vx[M]-v;if(!(Math.max(f.vz[y],f.vz[M])<e||Math.min(f.vz[y],f.vz[M])>t)&&(g*x<0||Math.min(Math.abs(g),Math.abs(x))<oe.half))return!1}return!0};for(const v of[2,4,6])for(let f=0;f<se;f++)it=Math.max(it,$t[v].vx[f]+oe.half);for(let v=0;v<200&&!o(it);v++)it+=2;await m.yield(),st=new b.Group;for(const v of[ee.parts.skin,ee.parts.disc]){const f=new b.Mesh(v.geometry,v.material);f.frustumCulled=!1,f.renderOrder=v.renderOrder,st.add(f)}st.position.set(it,0,St),C.add(st);const a=44,r=new Float32Array(a*3),n=[],i=[],s=p.fork("plume"),l=d(h.mist,1.05).lerp(d(h.spray),.25);for(let v=0;v<a;v++){const f=v/(a-1);r[v*3+1]=-300,n.push(9+15*f,(5+5*Math.sin(Math.PI*Math.min(1,f*1.4)))*(1-.5*f),.3,s()),i.push(l.r,l.g,l.b,.9*(1-f*.75))}jo=s()*6.2832;const c=De(new b.PlaneGeometry(1,1),{aPos:[r,3],aSize:[n,4],aCol:[i,4]});At=c.getAttribute("aPos"),At.setUsage(b.DynamicDrawUsage),Rt=new b.Mesh(c,new b.ShaderMaterial({vertexShader:uo,fragmentShader:mo,fog:!0,transparent:!0,depthWrite:!1,uniforms:{...$e(),uTime:Q.uTime,uFade:{value:1},uFlash:{value:1}}})),Rt.frustumCulled=!1,Rt.renderOrder=4,C.add(Rt)}const va=(e,t,o)=>{if(!st)return;const a=Ro(Ra(e)),r=ma(a),n=N(.4,4,r);st.position.set(it,r+(1-n)*Math.sin(t*5+jo)*.05,St+a),st.rotation.set(-.03-.12*n,0,Math.sin(t*.8+jo)*.02,"YXZ");const i=At.count;for(let s=0;s<i;s++){const l=a-6-s*oe.comet/i;if(l<=0){At.setXYZ(s,it,-300,St);continue}At.setXYZ(s,it+Math.sin(s*1.7)*1.5,Math.max(2.6+s%3*.5,ma(l)*(.92-.012*s)-1),St+l)}At.needsUpdate=!0,Rt.material.uniforms.uFade.value=ce(.1,1,N(48,120,st.position.distanceTo(o)))};va(0,0,pe),await m.yield();const ke=new b.Vector3,ja=we(0,9,z-2),Uo=new b.Vector3,pa=_e.clone();pa.y=175;const wa=Math.hypot(P.x,P.z)||1,ga=Math.min(720,Ce.height/Math.max(.2,P.y/wa))*Math.abs(P.z)/wa,Ua=z+Math.max(ga,Ce.depth),Ba=z+Math.min(ga,Ce.depth),Ia=D("lightning")()*2.7,_a=we(120,0,z+760),Oa=we(66,40,z+600),fo=we();return{scene:C,path:Me,duration:44,pace:da,camera:{fov:68,near:.3,far:6e3,lookAhead:34,sway:0,bank:.6},pois:[{at:pa,from:0,to:.11,weight:.45},{at:_a,from:.05,to:.5,weight:.22},{at:(e,t)=>(Me.pointAt(t,fo),Oa.set(fo.x+58,Math.max(34,fo.y-22),fo.z-110)),from:.44,to:.64,weight:.5},{at:ja,from:.54,to:1,weight:.55}],portal:{shape:"arch",width:14,height:12,color:"#BFF0E0",glow:1,revealDistance:420},post:{exposure:h.exposure,bloom:{strength:.32,radius:.6,threshold:.93},grade:{saturation:1.04,contrast:1.06,tint:"#fff6ea",shadowTint:"#06181a",vignette:.3,grain:.02,aberration:0}},ride:"none",companion:"none",update(e,t,o,a){o.getWorldPosition(ke);const{dk:r,s:n,turn:i,dep:s}=Yo(a,t,ke),l=qt;ee.setProgress(n),ee.set({aileron:.18*i}),ee.update(e,t,o);const c=!m.through;for(const y of ee.object.children)y.visible=c;Q.uTime.value=t,_t.uRain.value=c?ka(ke.x,ke.z,t)*N(Go,Ho,ke.y)*(j==="rain"?.95:.75):0,_t.uRel.value.set(-l.x*46+1.5,-9,-l.z*46+1),Uo.set(0,0,1).applyQuaternion(ee.object.quaternion);const v=Math.atan2(Uo.x,Uo.z),f=Pt.uniforms;if(f.uOwn.value.set(ee.object.position.x-Math.sin(v)*15,ee.object.position.z-Math.cos(v)*15,v,c?(1-N(9,30,ke.y))*.4*(1-.6*N(.5,3,n))*(1-N(0,12,s)):0),f.uOwnK.value=Math.min(1,Math.max(.5,ke.y/Math.max(2*ke.y-2.4,1))),w==="day"&&(f.uPawA.value=ce(.66,.86,1-N(8,22,ke.y))),qa.material.uniforms.uLift.value=N(-10,120,r),La.material.uniforms.uLift.value=vt((a-(qo-.1))/.2),Pt.uniforms.uWake.value=r-40+120*N(90,190,r),Pt.uniforms.uWakeK.value=ce(.75,1,N(.88,.93,a)),Ie.uniforms.uReflect.value=ce(.5,.07,N(Ua,Ba,ke.z)*(1-N(70,160,Math.abs(ke.x)))),It&&(It.uFade.value=1-N(28,70,ke.y)),Bt){const y=1-N(25,110,ke.y);Bt.uniforms.uFade.value=1-.97*y,C.fog.density=ce(h.dens,.0011,y)}if(j==="lightning"){const y=(t+Ia)%2.7;Vo.uFlash.value=N(0,.1,y)*Math.exp(-Math.max(0,y-.1)/.3)}Zo(t,r),va(a,t,ke),be.update(e,t,o),Ie.update(e,t,o),Mo.update(e,t,o)},dispose(){be.dispose&&be.dispose()}}}};export{A0 as default};
