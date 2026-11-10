import*as t from"three";import{makePath as t0,clamp as Me,lerp as Ee,smoothstep as B}from"../kit/core.js";import{makeSky as o0}from"../kit/sky.js";import{Geo as Ae}from"../kit/fauna.js";import{rockGeometry as _o}from"../kit/terrain.js";import{buildHero as a0,GROUND_GLSL as n0}from"../parts/reindeer-cyclone.js";const ne=Math.PI*2,ft=["#FBE7DA","#F4B8A6","#5B7DB6","#A9CBE2","#FFC46A","#4B3B32","#E9E0CF"],eo=-.3,to=-430,oo=656,Bt=600,Xe=`
float hash3(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float hash2(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float vnoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(hash3(i), hash3(i + vec3(1, 0, 0)), f.x), mix(hash3(i + vec3(0, 1, 0)), hash3(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash3(i + vec3(0, 0, 1)), hash3(i + vec3(1, 0, 1)), f.x), mix(hash3(i + vec3(0, 1, 1)), hash3(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
float vnoise2(vec2 x){ vec2 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(hash2(i), hash2(i + vec2(1, 0)), f.x), mix(hash2(i + vec2(0, 1)), hash2(i + vec2(1, 1)), f.x), f.y); }
float fbm2(vec2 p){ return vnoise2(p) * .5 + vnoise2(p * 2.03 + 11.) * .25 + vnoise2(p * 4.01 + 5.) * .125 + vnoise2(p * 8.1) * .0625; }
`;function s0(i){return(p,y)=>{const V=(p-to)/oo,H=y/Bt,_=Math.hypot(V,H)+1e-6,v=B(.55,.9,V/_);let P=(_-1)*Bt+(1-v)*40*i.n2(p*.003+9,y*.003);if(P<=0)return eo;const k=.5+.5*i.fbm2(p*.0016+3,y*.0016-7,3),D=B(0,260,P)*(8+34*k)+B(500,2600,P)*(30+110*k*k),N=90+7*i.n2(y*.011,4.2),C=P/N,E=Math.min(1,C),w=1-.16*(.5+.5*i.n2(y*.045,1.7))*Math.sin(Math.PI*E);let h=41*Math.pow(E,2.1)*w+1.3*Math.exp(-((C-1.04)*(C-1.04))/.004);return C>1&&(h+=B(1,5,C)*(5*i.n2(p*.012,y*.012)+.02*(P-N))+.5*i.n2(p*.06,y*.06)),h-=9*Math.exp(-((y+26)*(y+26))/100)*B(.5,1,C)*(1-B(1.25,1.75,C)),eo+Ee(D,h,v)}}function Uo(i,p,y,V,H,_){const v=[];for(let D=i;D<=p+1e-6;D+=y)v.push(D);let P=y,k=i;for(;k>V;)P*=_,k-=P,v.unshift(k);for(P=y,k=v[v.length-1];k<H;)P*=_,k+=P,v.push(k);return v}const i0=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vP, vN;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vP = wp.xyz; vN = normal; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,r0=`
#include <common>
#include <fog_pars_fragment>
${Xe}
${n0}
uniform vec3 uSunDir, uGold, uSnow, uWarm, uShade, uHeath, uLichen, uRock, uTree;
uniform float uTime, uGlint, uDrift, uWet, uRockAmt;
varying vec3 vP, vN;
void main(){
  vec2 q = vP.xz; float dist = distance(cameraPosition, vP);
  vec3 V = (cameraPosition - vP) / max(dist, 1e-3), N = normalize(vN + vec3(0., 1e-5, 0.));
  float land = smoothstep(.3, 3., vP.y) * (1. - uRockAmt), farK = smoothstep(1500., 500., dist);
  // broad soft drifts, then sastrugi with their short shadows and the trails down from the col: identical to the hero's snow outside the herd
  vec2 sq = q * vec2(.07, .13); float e = .3;
  float h0 = fbm2(sq), hx = fbm2(sq + vec2(e * .07, 0.)), hz = fbm2(sq + vec2(0., e * .13));
  float lowSun = clamp(uSunDir.y * 3.4, .35, 1.), tanEl = uSunDir.y / max(length(uSunDir.xz), .05);
  vec2 sunXZ = normalize(uSunDir.xz + vec2(1e-5, 0.));
  vec2 g = vec2(hx - h0, hz - h0) / e * .75 * lowSun * farK * (1. - uRockAmt);
  float fwq = length(fwidth(q)) * .7, gK = (1. - uRockAmt) * (1. - smoothstep(3., 6., fwq)) * smoothstep(.55, .8, N.y), gSh = 0., gTr = 0.;
  if(gK > .001){
    vec3 gr = groundRelief(q, sunXZ, tanEl, fwq, smoothstep(70., 12., dist));
    g += gr.xy * gK * (.55 + .45 * lowSun); gSh = gr.z * gK;
    gTr = clamp(-trailH(q, fwq) * 9., 0., 1.) * gK;
  }
  vec3 n = normalize(N + vec3(-g.x, 0., -g.y) * N.y);
  float ndl = dot(n, uSunDir), kk = clamp(ndl / max(uSunDir.y, .07), 0., 2.2);
  vec3 alb = mix(uSnow, uWarm, .55 * smoothstep(1.15, 2.1, kk));
  alb *= 1. - uWet * .12;
  float flow = vnoise2(q * vec2(.03, .24) + vec2(-uTime * 1.1, uTime * .05));
  alb *= 1. + .1 * smoothstep(.55, .9, flow) * farK;
  alb = mix(alb, uShade * 1.8, gTr * .42);
  vec3 lit = alb * (.30 + .44 * pow(max(kk, 1e-3), .7)), shade = uShade;
  // scoured ground on the fell: crowberry heath, reindeer lichen, frost-heaved stones
  float pn = .5 + .25 * sin(q.x * .11 + 1.3 * sin(q.y * .07)) + .25 * sin(q.y * .13 + 1.7 * sin(q.x * .05) + 2.), fine = vnoise2(q * 1.7 + 40.);   // = patchAt() below
  float bare = land * smoothstep(.6 - .12 * uWet, .7 - .12 * uWet, pn + (fine - .5) * .16 + .1 * smoothstep(26., 40., vP.y)) * smoothstep(.72, .92, N.y) * smoothstep(1400., 500., dist);
  float tuSh = 0.;
  if(bare > .001){
    // tussocks of crowberry and lichen standing out of the snow, each with its short blue shadow; snow lies between them
    vec3 soil = mix(uHeath, uLichen, .25 + .55 * smoothstep(.35, .7, fine)) * (.7 + .5 * vnoise2(q * 5.));
    float tk = 1. - smoothstep(.5, 1.5, fwq), tn = (1. - smoothstep(.2, .55, fwq)) * smoothstep(60., 20., dist);
    vec2 tu = tussock(q, sunXZ, 2.3, .25 + .7 * bare);
    if(tn > .001) tu = max(tu, tussock(q + 17., sunXZ, .9, .2 + .5 * bare) * tn);
    float tuft = mix(.3, tu.x, tk) * smoothstep(.02, .3, bare);
    tuSh = tu.y * tk * smoothstep(.02, .3, bare) * (1. - tuft);
    lit = mix(lit, soil * uSnow * 1.15 * (.25 + .75 * kk), tuft * .92); shade = mix(uShade, uShade * soil * 2.5, tuft * .8);
    bare = tuft;
  }
  vec3 c = mix(shade, lit, smoothstep(0., .5, kk) * (1. - gSh * .9) * (1. - tuSh * .9));
  // the taiga's floor: dark crowns seen from above, snow between them
  vec2 eq = vec2((q.x - (${to}.)) / ${oo}., q.y / ${Bt}.); float qe = length(eq), an = atan(eq.y, abs(eq.x) < 1e-4 ? 1e-4 : eq.x) / 3.14159;
  float forest = smoothstep(1.02, 1.05, qe) * smoothstep(1.5, 1.36, qe) * smoothstep(.07, .13, an) * smoothstep(.985, .93, an) * (1. - uRockAmt);
  if(forest > .001){ float cr = vnoise2(q * .16) * .6 + vnoise2(q * .45 + 9.) * .4; c = mix(c, uTree * (.5 + 1.2 * cr), forest * smoothstep(.3, .5, cr) * .9); }
  // bare rock on the steep faces of the far massif
  if(uRockAmt > 0.){
    float rk = uRockAmt * smoothstep(.83, .6, N.y + (fbm2(q * .012) - .5) * .35);
    vec3 rc = uRock * (.55 + .7 * fbm2(q * .02 + vP.y * .03));
    c = mix(c, rc * uSnow * 1.1 * (.22 + .95 * max(dot(N, uSunDir), 0.)) + uShade * .3, rk);
  }
  vec2 gi = floor(q * 27.); float gh = hash2(gi);
  float gl = step(.985, gh) * pow(max(sin(gh * 911. + dot(V.xz, vec2(31., 23.)) + V.y * 47.), 0.), 24.) * smoothstep(34., 5., dist) * (1. - bare);
  c += uGold * gl * uGlint * smoothstep(0., .5, kk);
  if(uDrift > 0.){ float dn = vnoise2(q * vec2(.05, .33) + vec2(-uTime * 2.4, uTime * .2)); c = mix(c, uSnow * .78, uDrift * (.35 + .5 * dn) * (1. - uRockAmt)); }
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,ao=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aAnim;
uniform float uTime, uThin, uSway;
varying vec3 vP, vN, vL, vColor;
void main(){
  mat4 m = modelMatrix;
  #ifdef USE_INSTANCING
    m = modelMatrix * instanceMatrix;
  #endif
  vec3 col = color;
  #ifdef USE_INSTANCING_COLOR
    col *= instanceColor;
  #endif
  vec4 wp = m * vec4(position, 1.);
  vec3 wn = normalize(mat3(m) * normal + vec3(0., 1e-5, 0.));
  float sw = aAnim.w * uSway;
  wp.x += sw * (.5 + .5 * sin(uTime * 1.7 + wp.z * .3 + wp.x * .2)) + sw * .35 * sin(uTime * 6.3 + wp.x * 2.1 + wp.z * 1.3);
  wp.z += sw * .3 * sin(uTime * 2.3 + wp.x * .4);
  vec3 sd = mat3(m) * aAnim.xyz; float sl = length(sd);
  if(sl > 1e-5) wp.xyz += sd / sl * max(0., distance(cameraPosition, wp.xyz) * uThin - sl);
  vP = wp.xyz; vN = wn; vL = position; vColor = col;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,l0=`
#include <common>
#include <fog_pars_fragment>
${Xe}
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce, uSnow, uShade, uLichen;
uniform float uCap, uHoar, uGrain, uTwoSide, uAllSnow;
varying vec3 vP, vN, vL, vColor;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), V = normalize(cameraPosition - vP + vec3(0., 1e-4, 0.));
  if(uTwoSide > .5 && dot(N, V) < 0.) N = -N;
  vec3 alb = vColor; float sn = 0.;
  if(uGrain > 0.){
    float big = vnoise(vP * .6), fine = vnoise(vP * 7.) * .6 + vnoise(vP * 23.) * .4;
    alb *= (.7 + .55 * big) * (.78 + .45 * fine);
    float joint = smoothstep(.07, 0., abs(vnoise(vP * vec3(.9, .4, .9) + 9.) - .5)) + .7 * smoothstep(.05, 0., abs(vnoise(vP * vec3(.5, 1.7, .5) + 4.) - .5));
    alb *= 1. - .5 * min(joint, 1.) * uGrain;
    alb = mix(alb, uLichen, uGrain * .7 * smoothstep(.56, .7, vnoise(vP * 1.9 + 20.)) * smoothstep(.3, .6, fine));
    alb = mix(alb, vec3(.03), uGrain * .3 * smoothstep(.66, .78, vnoise(vP * 2.4 + 50.)));
  }
  if(uCap > 0.) sn = uCap * smoothstep(.36, .62, N.y + (vnoise(vP * 1.3) - .5) * .5);
  if(uHoar > 0.) sn = max(sn, uHoar * smoothstep(.1, .8, -N.x * .8 + N.y * .5 + (vnoise(vP * 3.1 + 70.) - .5) * .7));
  sn = max(sn, uAllSnow);
  float ndl = dot(N, uSunDir), dif = max(ndl, 0.) * .8 + .2 * max(ndl * .5 + .5, 0.);
  vec3 c = alb * (mix(uBounce * 1.2, uSkyCol, N.y * .5 + .5) + uSunCol * dif * .55);
  float kk = clamp(ndl / max(uSunDir.y, .07), 0., 2.2);
  c = mix(c, mix(uShade, uSnow * (.30 + .44 * pow(max(kk, 1e-3), .7)), smoothstep(0., .5, kk)), sn);
  float fr = pow(1. - max(dot(N, V), 0.), 3.);
  c += (uSkyCol * .25 + uSunCol * (.15 + alb) * .5 * smoothstep(-.1, .9, dot(-V, uSunDir))) * fr * .5;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,c0=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aUv; varying vec3 vUv;
void main(){ vUv = aUv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,u0=`
#include <common>
#include <fog_pars_fragment>
${Xe}
uniform vec3 uShTint; uniform float uShStr;
varying vec3 vUv;
void main(){
  float x = vUv.x, y = abs(vUv.y), k;
  if(vUv.z > .5){      // a bare tree: trunk, then a net of branches thinning out
    float trunk = smoothstep(.16, .06, y) * smoothstep(.5, .2, x);
    float net = smoothstep(.42, .62, vnoise2(vec2(x * 9., vUv.y * 5.) + vUv.z * 17.)) * smoothstep(.12, .4, x) * smoothstep(1., .55, y);
    k = max(trunk, net * .7) * smoothstep(1., .8, x);
  } else k = smoothstep(1., .35, y + .25 * x) * smoothstep(1., .6, x) * smoothstep(0., .04, x);
  #ifdef USE_FOG
    float fogK = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    float fogK = 0.;
  #endif
  k *= uShStr * (1. - fogK);
  gl_FragColor = vec4(mix(vec3(1.), uShTint, k), 1.);
}`,f0=`
attribute vec4 aSeed;
uniform vec3 uBox, uVel, uSunDir, uColA, uGold; uniform float uTime, uBufH, uSize, uGlintK;
varying vec4 vCol;
void main(){
  float s = aSeed.w;
  vec3 p = aSeed.xyz * uBox + uVel * uTime * (.7 + .6 * s) + vec3(sin(uTime * .7 + s * 40.), .3 * sin(uTime * .9 + s * 17.), cos(uTime * .5 + s * 31.)) * .7;
  p = mod(p - cameraPosition, uBox) - .5 * uBox + cameraPosition;
  vec3 rel = p - cameraPosition; float dist = length(rel); vec3 vd = rel / max(dist, 1e-3);
  float gl = pow(max(sin(s * 311. + uTime * (2. + 3. * fract(s * 7.)) + dot(vd, vec3(9., 5., 7.)) * 3.), 0.), 10.);
  float fs = pow(max(dot(vd, uSunDir), 0.), 4.);
  float px = uSize * (.6 + .8 * fract(s * 13.)) * projectionMatrix[1][1] * uBufH * .5 / max(dist, .5), pc = clamp(px, 1.6, 12.);
  float a = min(1., (px * px) / (pc * pc)) * smoothstep(.7, 2.6, dist) * smoothstep(.5, .36, dist / uBox.x);
  vCol = vec4((uColA + uGold * fs * 1.6) * mix(1., .12 + 2.6 * gl, uGlintK), a);
  gl_PointSize = pc;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,d0=`
uniform float uOpaque; varying vec4 vCol;
void main(){
  float d = length(gl_PointCoord - .5) * 2., a = smoothstep(1., 0., d); a *= a * vCol.a;
  if(a < .003) discard;
  gl_FragColor = vec4(vCol.rgb * a, a * uOpaque);
}`,h0=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 iA, iB;
uniform vec3 uBox, uSunDir, uLit, uShadeC, uGold; uniform float uTime, uAlpha;
varying vec2 vUv; varying vec4 vCol; varying float vSeed;
void main(){
  float seed = iA.w, a, sx = iB.y, sy = iB.z; vec3 pos, ax = vec3(1., 0., 0.);
  if(iB.x < .5){
    vec2 w = iA.xz * uBox.xz + vec2(uTime * (5. + 4. * seed), sin(uTime * .21 + seed * 30.) * 4.);
    vec2 rel = mod(w - cameraPosition.xz, uBox.xz) - .5 * uBox.xz, ed = abs(rel) / (.5 * uBox.xz);
    pos = vec3(cameraPosition.x + rel.x, iA.y, cameraPosition.z + rel.y);
    a = smoothstep(1., .7, max(ed.x, ed.y)) * (.55 + .45 * sin(uTime * .6 + seed * 50.));
  } else {
    float D = iB.w, f = fract(uTime * (7. + D * .05) / D + seed);
    if(D > 200.) ax = vec3(.287, 0., -.958);        // the massif's pennant is seen end-on from the lake: it trails across the view
    pos = iA.xyz + ax * (D * f) + vec3(0., D * .1 * f * f, 0.) + cross(ax, vec3(0., 1., 0.)) * (sin(seed * 40. + f * 5.) * D * .04);
    a = smoothstep(0., .15, f) * smoothstep(1., .35, f) * 1.7; sx *= .5 + f; sy *= .4 + 1.3 * f;
  }
  vec3 toC = cameraPosition - pos; float dist = length(toC); toC /= max(dist, 1e-3);
  vec3 up = cross(toC, ax); up = up / max(length(up), 1e-3); if(up.y < 0.) up = -up;
  a *= smoothstep(sy * 1.5 + .5, sy * 5. + 2., dist);
  float fs = pow(max(dot(-toC, uSunDir), 0.), 5.);
  vCol = vec4(mix(uShadeC, uLit, .45 + .55 * seed) + uGold * fs * .9, a * uAlpha);
  vUv = position.xy; vSeed = seed * 61.;
  vec3 wp = pos + ax * position.x * sx + up * position.y * sy;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,m0=`
#include <common>
#include <fog_pars_fragment>
${Xe}
uniform float uTime;
varying vec2 vUv; varying vec4 vCol; varying float vSeed;
void main(){
  float n = vnoise2(vUv * vec2(2.6, 1.3) + vec2(vSeed - uTime * .5, vSeed)) * .65 + vnoise2(vUv * vec2(7., 3.) + vec2(-uTime * .9, vSeed)) * .35;
  float a = vCol.a * smoothstep(1., .25, abs(vUv.y) + (n - .5) * .5) * smoothstep(1., .45, abs(vUv.x)) * smoothstep(.2, .75, n);
  if(a < .003) discard;
  gl_FragColor = vec4(vCol.rgb * (.85 + .3 * n), a);
  #include <fog_fragment>
}`,v0=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aUv; varying vec3 vUv;
void main(){ vUv = aUv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,p0=`
#include <common>
#include <fog_pars_fragment>
${Xe}
uniform vec3 uTree, uSnowC, uRimC;
varying vec3 vUv;
float tree(float u, float y, float k, out float tip){
  float id = floor(u), f = fract(u) - .5, h = .5 + .5 * hash2(vec2(id, k)), v = y / h;
  tip = v; return step(abs(f), (1. - v) * (.44 + .1 * sin(v * 34. + id))) * step(v, 1.);
}
void main(){
  float t1, t2, a = tree(vUv.x, vUv.y, vUv.z, t1), b = tree(vUv.x * 1.37 + .5, vUv.y * 1.25, vUv.z + 9., t2);
  float inside = max(max(a, b), step(vUv.y, .16));
  if(inside < .5) discard;
  float tip = a > .5 ? t1 : t2, dust = smoothstep(.45, .75, vnoise2(vec2(vUv.x * 3.1, vUv.y * 9.) + vUv.z));
  vec3 c = uTree * (.6 + .8 * tip) ;
  c = mix(c, uSnowC, dust * .5 * smoothstep(.1, .6, tip));
  c += uRimC * smoothstep(.75, 1., tip) * .35;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,Bo=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSunDir, uSunCol, uWhite, uUnder; uniform float uWing;
varying vec3 vP, vN, vL, vColor;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), V = normalize(cameraPosition - vP + vec3(0., 1e-4, 0.));
  if(dot(N, V) < 0.) N = -N;
  // white where the low sun or the open sky reaches; the flank turned from the sun, the belly and the underside of a wing are
  // slate. A wing is thin: the sun shines through it, so it is lit from either side (uWing = 1).
  float ndl = dot(N, uSunDir), lit = clamp(.62 * smoothstep(-.5, .75, mix(ndl, abs(ndl), uWing)) + .4 * smoothstep(-.35, .8, N.y), 0., 1.);
  vec3 c = mix(uUnder, uWhite, lit) * vColor;
  c += uSunCol * .22 * pow(1. - max(dot(N, V), 0.), 3.) * smoothstep(-.2, .6, dot(-V, uSunDir)) * smoothstep(.1, .4, vColor.g);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,z=i=>new t.Color(i);function w0(i){const p=new Ae,y=z("#3a2c28"),V=z("#8d8078"),H=z("#d9d2cc"),_=z("#b9c4d6"),v=(P,k,D,N,C)=>{const E=[P.slice()],w=P.slice(),h=k.slice();for(let $=0;$<3;$++){h[0]+=i.range(-.35,.35),h[2]+=i.range(-.35,.35),h[1]+=C?i.range(-.1,.25):.15;const M=Math.hypot(h[0],h[1],h[2]);h[0]/=M,h[1]/=M,h[2]/=M,w[0]+=h[0]*D/3,w[1]+=h[1]*D/3,w[2]+=h[2]*D/3,E.push(w.slice())}const Le=[N,N*.86,N*.72,N*.6],ze=p.tube(E,Le,C?3:5,C?y:V,y);if(p.anim(ze,($,M)=>[0,0,0,.012*M*C]),C<2){const $=C?2:3;for(let M=0;M<$;M++){const L=i()*ne,F=i.range(.25,.8);v(E[2+(M&1)],[Math.cos(L),F,Math.sin(L)],D*i.range(.55,.75),N*.55,C+1)}}else for(let $=0;$<5;$++){const M=i()*ne,L=E[1+$%3],F=i.range(.4,.75),K=Math.cos(M),g=Math.sin(M),m=i.range(-.25,.5),he=[L[0]+K*F*.5,L[1]+m*F*.5+.05,L[2]+g*F*.5],ce=[L[0]+K*F,L[1]+m*F-.05,L[2]+g*F],fe=.014,ke=-g*fe,O=K*fe,Ve=p.strip([L,he,ce].map(ge=>[ge[0]+ke,ge[1],ge[2]+O]),[L,he,ce].map(ge=>[ge[0]-ke,ge[1],ge[2]-O]),H,_);p.anim(Ve,(ge,Dt,dt,xe)=>[(xe-Ve[0]&1?-1:1)*ke,0,(xe-Ve[0]&1?-1:1)*O,.03*Dt])}};return v([0,-.15,0],[i.range(-.3,.3),1,i.range(-.3,.3)],1.5,.085,0),p.build()}function Do(i){const p=new Ae,y=z("#4a211b"),V=z("#cfc6c4"),H=(_,v,P,k)=>{const D=Math.cos(v)*P,N=Math.sin(v)*P,C=.006,E=-Math.sin(v)*C,w=Math.cos(v)*C,h=[_[0]+D*k*.5,_[1]+k*.55,_[2]+N*k*.5],Le=[_[0]+D*k*1.25,_[1]+k,_[2]+N*k*1.25],ze=[_,h,Le],$=p.strip(ze.map(M=>[M[0]+E,M[1],M[2]+w]),ze.map(M=>[M[0]-E,M[1],M[2]-w]),y,V);return p.anim($,(M,L,F,K)=>[(K-$[0]&1?-1:1)*E,0,(K-$[0]&1?-1:1)*w,.06*L]),h};for(let _=0;_<6;_++){const v=i()*ne,P=H([i.range(-.05,.05),-.02,i.range(-.05,.05)],v,i.range(.2,.7),i.range(.24,.42));_<4&&H(P,v+i.range(-1.2,1.2),i.range(.4,.9),i.range(.12,.2))}return p.build()}function g0(){const i=z("#1c1310"),p=z("#3a2a20"),y=z("#a08462"),V=z("#0a0808"),H=new Ae,_=H.loft([[-.4,.36,0,0],[-.34,.37,.13,.13],[-.14,.4,.17,.17],[.1,.4,.165,.16],[.3,.38,.14,.14],[.42,.37,.1,.11],[.48,.37,0,0]].map(([D,N,C,E])=>({z:D,y:N,rx:C,ry:E})),{sides:8,top:i,belly:p});H.paint(_,(D,N,C,E)=>{E.lerp(y,.8*B(.09,.14,Math.abs(D))*B(.47,.4,N)*B(.3,.38,N)*B(-.38,-.1,C))}),H.tube([[0,.4,-.36],[0,.4,-.52],[0,.32,-.68],[0,.22,-.76]],[.07,.1,.085,0],6,i,p);const v=new Ae,P=v.loft([[-.06,0,0,0],[0,0,.1,.095],[.1,-.005,.085,.08],[.19,-.02,.05,.045],[.235,-.025,0,0]].map(([D,N,C,E])=>({z:D,y:N,rx:C,ry:E})),{sides:8,top:i,belly:p});v.paint(P,(D,N,C,E)=>{E.lerp(y,.7*B(.03,.07,N)*B(.12,.02,C)),C>.2&&E.copy(V)});for(const D of[-1,1])v.fan([[D*.06,.07,0],[D*.115,.12,-.02],[D*.1,.05,-.03]],i,p);const k=new Ae;return k.tube([[0,0,0],[0,-.14,.01],[0,-.27,-.01],[0,-.33,.04]],[.06,.045,.04,.045],5,i,V),{body:H.build(),head:v.build(),leg:k.build()}}function x0(){const i=new t.Color(1,1,1),p=new t.Color(.06,.06,.07),y=new Ae,V=new Ae;y.loft([[-.3,0,0,0],[-.2,0,.07,.065],[0,-.01,.1,.095],[.16,.01,.075,.07],[.25,.03,.05,.05],[.31,.03,.03,.03],[.4,.02,0,0]].map(([v,P,k,D])=>({z:v,y:P,rx:k,ry:D})),{sides:6,top:i,belly:i});for(const v of[-1,1])y.fan([[0,0,-.22],[v*.035,0,-.5],[v*.13,0,-.44]],i,p);y.fan([[0,0,-.22],[-.035,0,-.5],[.035,0,-.5]],i,i);const H=[[.03,0,.14],[.22,.02,.15],[.42,.02,.1],[.6,0,0]],_=[[.03,0,-.14],[.22,0,-.15],[.42,0,-.14],[.66,0,-.1]];return V.strip(H,_,i,i),{body:y.build(),wing:V.build()}}function y0(){const i=new t.Color(1,1,1),p=new t.Color(.6,.66,.82),y=new t.Color(.03,.03,.035),V=new Ae,H=V.loft([[-.2,0,0,0],[-.18,0,.088,.078],[-.115,-.003,.118,.106],[-.04,-.006,.134,.124],[.05,-.004,.132,.124],[.125,.014,.106,.102],[.178,.046,.066,.066],[.208,.068,.052,.052],[.238,.08,.06,.057],[.264,.078,.044,.042],[.28,.072,.017,.017],[.302,.066,0,0]].map(([M,L,F,K])=>({z:M,y:L,rx:F,ry:K})),{sides:8,top:i,belly:p,shade:[-.5,.35]});V.paint(H,(M,L,F,K)=>{F>.272&&K.copy(y),F>.225&&F<.26&&Math.abs(M)>.03&&L>.08&&K.copy(y)}),V.fan([[0,.014,-.13],[-.05,.004,-.27],[-.026,0,-.3],[0,-.002,-.306],[.026,0,-.3],[.05,.004,-.27]],i,i);for(const M of[-1,1]){const L=V.fan([[M*.02,.012,-.15],[M*.04,.006,-.325],[M*.088,.004,-.31],[M*.128,0,-.272],[M*.148,-.004,-.222],[M*.132,0,-.17]],i,i);V.paint(L,(F,K,g,m)=>{Math.abs(F)>.08&&g<-.25&&m.copy(y)})}const _=new Ae,v=new t.Color(.7,.78,.96),P=[[.03,0,.11],[.11,.03,.142],[.2,.046,.136],[.29,.04,.1],[.365,.02,.042],[.415,-.006,-.032]],k=[[.03,0,-.125],[.11,.018,-.158],[.2,.03,-.165],[.29,.024,-.15],[.36,.008,-.118],[.405,-.01,-.075]];_.strip(P,k,i,v);const D=_.build(),N=[],C=[],E=[],w=8,h=-.62,Le=.82,ze=[.03,.19,.36];for(const M of[.1,-.12]){const L=N.length/3;for(let F=0;F<3;F++)for(let K=0;K<=w;K++){const g=K/w,m=Ee(h,Le,g);N.push(Math.cos(m)*ze[F],Math.sin(m)*ze[F],M),C.push(F/2,g)}for(let F=0;F<2;F++)for(let K=0;K<w;K++){const g=L+F*(w+1)+K;E.push(g,g+w+1,g+1,g+1,g+w+1,g+w+2)}}const $=new t.BufferGeometry;return $.setAttribute("position",new t.Float32BufferAttribute(N,3)),$.setAttribute("aA",new t.Float32BufferAttribute(C,2)),$.setIndex(E),{body:V.build(),wing:D,blur:$}}const Fo=(i,p)=>.5+.25*Math.sin(i*.11+1.3*Math.sin(p*.07))+.25*Math.sin(p*.13+1.7*Math.sin(i*.05)+2),b0={noon:{sky:{preset:"day",zenith:"#1a489e",mid:"#5c92d8",horizon:"#f6c0a2",horizonPow:4.6,midPow:1.3,scatterColor:"#ff9a5c",scatter:.62,scatterPow:6,sunColor:"#ffd29a",sunSize:1.5,sunIntensity:9,sunGlow:.85,clouds:!1,cloudLit:"#ffd8c6",cloudShade:"#7c84bc",clouds2:{coverage:.44,opacity:.55,stretch:1,lit:"#ffd6c0",shade:"#93a4d6"}},el:.157,light:{snow:"#f9d3c1",warm:"#ffb488",shade:"#4f60b2",sunColor:"#ffbe7c",sunIntensity:2.3,sky:"#86a4e4",gold:"#ffae5e",hazeK:.065},fog:"#c4abb8",density:24e-5,exposure:1.07,dust:["#b89c98",.04,1,0,[.7,-.06,.15]],drift:.34,tint:"#fff9f5",sat:1.06,portal:"#ffd9a0",towers:1,veil:"#a898b8"},lastSun:{sky:{preset:"sunset",zenith:"#27397f",mid:"#7c6cb4",horizon:"#f4a084",horizonPow:3.6,scatterColor:"#ff8646",scatter:.9,sunColor:"#ffa468",sunSize:1.7,sunIntensity:10,sunGlow:.9,stars:0,clouds:!1,cloudLit:"#ffb48c",cloudShade:"#5f4f8c",clouds2:{coverage:.5,opacity:.62,stretch:1,lit:"#ffb090",shade:"#7c5c90"}},el:.122,light:{hazeK:.05},fog:"#a78bad",density:24e-5,exposure:1.05,dust:["#a88890",.04,1,0,[.7,-.06,.15]],drift:.34,tint:"#fff2ee",sat:1.02,portal:"#ffc890",towers:1,veil:"#9a7fa6"},moon:{sky:{preset:"night",zenith:"#040a1e",mid:"#0c1d44",horizon:"#1f3a6c",stars:.9,milkyWay:.22,aurora:.6,auroraAzimuth:0,auroraSpread:.75,clouds:!1,clouds2:!1,bake:!0},light:{hazeK:.035},fog:"#15254a",density:22e-5,exposure:1.3,dust:["#7f97c8",.034,1,0,[.5,-.05,.1]],drift:.28,tint:"#eef2ff",sat:1.05,portal:"#bfe0ff",towers:0,veil:"#22335c"},overcast:{sky:{preset:"overcast",scatterColor:"#ffbc94",scatter:.85,horizon:"#c9aeb0"},light:{hazeK:.04},fog:"#aba6b6",density:7e-4,exposure:1,dust:["#aab0b8",.085,0,1,[2.2,-1.5,.4]],drift:.26,tint:"#fff4f0",sat:1.18,portal:"#ffd9a0",towers:0,veil:"#8f98a6"},blizzard:{sky:{preset:"day",zenith:"#2a5aa4",mid:"#869fcc",horizon:"#f2c29a",horizonPow:3.4,midPow:1.15,scatterColor:"#ffb070",scatter:.9,scatterPow:4.5,sunColor:"#ffd9a8",sunSize:1.5,sunIntensity:9,sunGlow:.95,clouds:!1,clouds2:{coverage:.36,opacity:.4,stretch:1,lit:"#ffd9c0",shade:"#a4b0d4"}},el:.157,light:{snow:"#f8d4c0",warm:"#ffb88c",shade:"#5868b0",sunColor:"#ffc488",sunIntensity:2.1,sky:"#8ea6e0",gold:"#ffb468",hazeK:.15,hazeH:.75},fog:"#ccb6b2",density:5e-4,exposure:.98,dust:["#b8a6a2",.055,0,1,[10,-.5,1.2]],drift:.5,tint:"#fff6f0",sat:1.08,portal:"#ffd9a0",towers:0,veil:"#aab4c4"}},M0=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aUv; varying vec3 vUv;
void main(){ vUv = aUv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,S0=`
#include <common>
#include <fog_pars_fragment>
${Xe}
uniform vec3 uCol; uniform float uTime, uAlpha;
varying vec3 vUv;
void main(){
  float x = vUv.x, y = vUv.y, lean = x * 7. + y * 1.6 + vUv.z * 13.;
  float st = vnoise2(vec2(lean, y * .7 - uTime * .02)) * .6 + vnoise2(vec2(lean * 2.7 + 5., y * 1.3 - uTime * .035)) * .4;
  float a = smoothstep(0., .22, x) * smoothstep(1., .78, x) * smoothstep(0., .12, y) * pow(max(y, 0.), .45) * smoothstep(1.02, .8, y) * (.3 + .7 * smoothstep(.3, .75, st));
  gl_FragColor = vec4(uCol * (.9 + .25 * st), a * uAlpha);
  #include <fog_fragment>
}`,A0=`
attribute vec3 aUv, aSun; varying vec3 vUv, vSun;
void main(){ vUv = aUv; vSun = aSun; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,z0=`
${Xe}
uniform vec3 uLit, uShade, uHaze, uRim; uniform float uTime;
varying vec3 vUv, vSun;
void main(){
  vec2 p = vec2((vUv.x - .5) * 2., vUv.y); float seed = vUv.z;
  float acc = 0.; vec2 nrm = vec2(0.);
  for(int i = 0; i < 7; i++){
    float fi = float(i), h1 = hash2(vec2(fi + 1.3, seed)), h2 = hash2(vec2(seed + 7.1, fi));
    float cx = (fi / 6. - .5) * 1.15 + (h1 - .5) * .18, k = 1. - abs(cx) * .75;
    float r = (.12 + .26 * h2) * (.5 + .65 * k), cy = r * .45 + .3 * k * h1;
    vec2 q = (p - vec2(cx, cy)) / r; float di = max(1. - length(q), -3.);
    float w = exp(7. * di); acc += w; nrm += w * q;      // a smooth union: the lobes run into one another without creases
  }
  float d = log(acc) / 7.; nrm /= acc;
  float n = fbm2(p * vec2(3.1, 3.7) + seed * 9. + vec2(uTime * .004, 0.)), n2 = vnoise2(p * 9. + seed * 3. + vec2(uTime * .007, 0.));
  d += (n - .5) * .5 + (n2 - .5) * .1;
  float rimE = smoothstep(.5, .06, d);
  float a = smoothstep(0., .24, d) * smoothstep(0., .08, p.y) * smoothstep(1., .9, abs(p.x)) * smoothstep(1., .93, p.y);
  if(a < .004) discard;
  vec3 N = normalize(vec3(nrm, sqrt(max(1. - dot(nrm, nrm), 0.)) + .35) + vec3(n - .5, n2 - .5, 0.) * .8);
  vec3 S = normalize(vSun + vec3(0., 1e-4, 0.));
  float top = smoothstep(0., .7, p.y), l = dot(N, S) * .5 + .5;
  vec3 c = mix(uShade, uLit, smoothstep(.22, .72, l * .62 + top * .4 + (n - .5) * .22));
  c += uRim * rimE * rimE * smoothstep(.35, -.5, S.z) * (.35 + .65 * top);      // a lining of light when the sun stands behind the bank
  c = mix(c, uHaze, mix(.7, .12, smoothstep(0., .45, p.y)));
  gl_FragColor = vec4(c, a * .97);
}`;var q0={id:"reindeer-cyclone",name:"The Turning Herd",category:"wilderness",weirdness:.08,media:["air","open","snow"],async build(i){const p=i.rng,y=i.noise,V=i.vary||{},H=i.quality?.detail??1,_=i.renderer,v=new t.Scene;await i.yield();const P=p.fork("when"),k=P(),D=P(),N=P(),C=P(),E=P();let w=k<.34?"noon":k<.56?"lastSun":k<.72?"moon":k<.86?"overcast":"blizzard";V.hour==="day"&&(w==="lastSun"||w==="moon")&&(w="noon"),(V.hour==="dawn"||V.hour==="golden")&&(w="lastSun"),V.hour==="night"&&(w="moon");const h=b0[w],Le=w==="lastSun"||w==="moon"?w:"noon",ze=w==="overcast"||w==="blizzard"?w:"clear",$=!1,M=(E-.5)*.14,L=h.el||.157,F=h.el?[Math.sin(M)*Math.cos(L),Math.sin(L),Math.cos(M)*Math.cos(L)]:void 0,K=s0(y),g=await a0(i,{ground:K,palette:ft,hour:Le,weather:ze,season:$?"april":"march",density:Me(.93+((V.density??1)-1)*.66,.73,1.08),paleHerd:!1,whiteCow:!!V.rare,stragglers:40,sunDir:F});v.add(g.object);{const e=g.light,a={haze:e.haze*1.5};for(const r in h.light)a[r]=typeof h.light[r]=="string"?z(h.light[r]):h.light[r];(w==="noon"||w==="blizzard")&&(a.shade=a.shade.clone().multiplyScalar(.95).lerp(a.snow,.1),a.bounce=z(ft[1]).multiplyScalar(.36)),w==="lastSun"&&(a.shade=e.shade.clone().lerp(e.snow,.2)),w==="blizzard"&&(a.drift=.7,a.haze=.9),w==="overcast"&&(a.snow=e.snow.clone().lerp(z("#f2cfc6"),.5),a.warm=a.snow.clone().lerp(z("#ffc0a0"),.3),a.shade=e.shade.clone().lerp(z("#5a5fa6"),.42)),g.setLight(a)}await i.yield();const m=g.light,he=g.anchors,ce=he.uMarks,fe=g.path||t0(he.flyThrough),ke=fe.length,O=m.sunDir.clone().normalize(),Ve=m.sunColor.clone().multiplyScalar(m.sunIntensity),ge=m.sky.clone().multiplyScalar(m.skyIntensity),Dt=new t.Color(Me(m.shade.r/(m.snow.r*.74),.05,1),Me(m.shade.g/(m.snow.g*.74),.05,1),Me(m.shade.b/(m.snow.b*.74),.05,1)),dt=Math.min(1/Math.tan(Math.max(.03,Math.asin(Me(O.y,.02,1)))),9.5),xe=new t.Vector2(-O.x,-O.z).normalize(),no=t.MathUtils.radToDeg(Math.asin(O.y)),so=t.MathUtils.radToDeg(Math.atan2(O.x,-O.z)),at={rng:p,renderer:_,...h.sky};w==="moon"?at.bodies=[{elevation:no,azimuth:so,size:2.3,phase:1,intensity:1,dark:.03,glow:.22,glowColor:"#9db8ff"}]:(at.sunElevation=no,at.sunAzimuth=so),at.ground=h.fog;const ht=o0(at),Ft={value:0};v.add(ht.object),v.fog=new t.FogExp2(h.fog,h.density),await i.yield();let nt=null;if(h.towers){const e=[[-4e3,250,2200,1800],[-4600,230,-1200,800],[500,190,-3100,1350],[2500,170,-1700,650],[-1500,150,2900,1300],[1700,160,2500,700],[3300,210,900,1e3]];{const l=[],c=[],u=[],d=[];for(const[q,[U,b,G,W]]of e.entries()){const Y=Math.hypot(U,G),J=U/Y,te=G/Y,oe=-te,Q=J,pe=W*.68,Ze=b*.25,Fe=l.length/3,zt=q*3.7+p()*5,kt=O.x*oe+O.z*Q,ut=-(O.x*J+O.z*te);for(const[Ie,ot]of[[0,0],[1,0],[1,1],[0,1]])l.push(U+oe*pe*(Ie*2-1),Ze+ot*pe,G+Q*pe*(Ie*2-1)),c.push(Ie,ot,zt),u.push(kt,O.y+.25,ut);d.push(Fe,Fe+1,Fe+2,Fe,Fe+2,Fe+3)}const S=new t.BufferGeometry;S.setAttribute("position",new t.Float32BufferAttribute(l,3)),S.setAttribute("aUv",new t.Float32BufferAttribute(c,3)),S.setAttribute("aSun",new t.Float32BufferAttribute(u,3)),S.setIndex(d),nt=new t.Mesh(S,new t.ShaderMaterial({vertexShader:A0,fragmentShader:z0,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{uLit:{value:z(h.sky.cloudLit).multiplyScalar(.92)},uShade:{value:z(h.sky.cloudShade).lerp(z(h.sky.cloudLit),.22)},uHaze:{value:z(h.sky.horizon).lerp(z(h.fog),.35).multiplyScalar(.92)},uRim:{value:z(h.sky.sunColor).multiplyScalar(.8)},uTime:Ft}})),nt.frustumCulled=!1,nt.matrixAutoUpdate=!1,nt.renderOrder=0,v.add(nt)}await i.yield();const a=[],r=[],s=[];for(const[l,c]of[0,2,4].entries()){const[u,d,S,q]=e[c],U=u*.94,b=S*.94,G=Math.hypot(U,b),W=-b/G,Y=U/G,J=q*.3,te=d+70,oe=.3*te,Q=a.length/3;a.push(U-W*J,-30,b-Y*J,U+W*J,-30,b+Y*J,U+W*(J+oe),te,b+Y*(J+oe),U-W*(J-oe),te,b-Y*(J-oe)),r.push(0,0,l,1,0,l,1,1,l,0,1,l),s.push(Q,Q+1,Q+2,Q,Q+2,Q+3)}const n=new t.BufferGeometry;n.setAttribute("position",new t.Float32BufferAttribute(a,3)),n.setAttribute("aUv",new t.Float32BufferAttribute(r,3)),n.setIndex(s);const o=new t.Mesh(n,new t.ShaderMaterial({vertexShader:M0,fragmentShader:S0,fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),uCol:{value:new t.Color(h.veil)},uTime:Ft,uAlpha:{value:.55}}}));o.frustumCulled=!1,o.matrixAutoUpdate=!1,o.renderOrder=1,v.add(o)}await i.yield();const We={value:0},qe=()=>t.UniformsUtils.clone(t.UniformsLib.fog),Vo=z("#3a2428").lerp(z(ft[5]),.4),io=z("#9aa58c").multiplyScalar(.8),qo=z(ft[5]).lerp(z(ft[6]),.42),ro=z("#1b2a26").multiply(ge.clone().addScalar(.25)).multiplyScalar(1.6),Ro=e=>({...qe(),uSunDir:{value:O},uGold:{value:m.gold},uSnow:{value:m.snow},uWarm:{value:m.warm},uShade:{value:m.shade},uHeath:{value:Vo},uLichen:{value:io},uRock:{value:qo},uTree:{value:ro},uTime:We,uGlint:{value:m.glint},uDrift:{value:m.drift},uWet:{value:m.wet},uRockAmt:{value:e}}),lo=e=>new t.ShaderMaterial({vertexShader:i0,fragmentShader:r0,uniforms:Ro(e),fog:!0}),Z=(e,a=0)=>(e.frustumCulled=!1,e.matrixAutoUpdate=!1,e.renderOrder=a,e.updateMatrix(),v.add(e),e),Ce=Uo(228,384,2.2,-3700,2600,1.16),Pe=Uo(-94,34,2.2,-3300,3300,1.16),ae=Ce.length,He=Pe.length,me=new Float32Array(ae*He*3),Ke=new Uint32Array((ae-1)*(He-1)*6);for(let e=0,a=0;e<He;e++){for(let r=0;r<ae;r++,a+=3)me[a]=Ce[r],me[a+1]=K(Ce[r],Pe[e]),me[a+2]=Pe[e];(e&7)===7&&await i.yield()}for(let e=0,a=0;e<He-1;e++){for(let r=0;r<ae-1;r++,a+=6){const s=e*ae+r,n=s+1,o=s+ae,l=o+1;Ke[a]=s,Ke[a+1]=o,Ke[a+2]=n,Ke[a+3]=n,Ke[a+4]=o,Ke[a+5]=l}(e&31)===31&&await i.yield()}await i.yield();const mt=new Float32Array(ae*He*3);for(let e=0,a=0;e<He;e++){const r=Math.max(0,e-1),s=Math.min(He-1,e+1),n=Pe[s]-Pe[r];for(let o=0;o<ae;o++,a+=3){const l=Math.max(0,o-1),c=Math.min(ae-1,o+1),u=(me[(e*ae+c)*3+1]-me[(e*ae+l)*3+1])/(Ce[c]-Ce[l]),d=(me[(s*ae+o)*3+1]-me[(r*ae+o)*3+1])/n,S=1/Math.sqrt(u*u+d*d+1);mt[a]=-u*S,mt[a+1]=S,mt[a+2]=-d*S}(e&31)===31&&await i.yield()}await i.yield();const vt=new t.BufferGeometry;vt.setAttribute("position",new t.BufferAttribute(me,3)),vt.setAttribute("normal",new t.BufferAttribute(mt,3)),vt.setIndex(new t.BufferAttribute(Ke,1)),await i.yield(),Z(new t.Mesh(vt,lo(0))),await i.yield();const co=(e,a)=>{let r=0,s=e.length-2;for(;r<s;){const n=r+s+1>>1;e[n]<=a?r=n:s=n-1}return r},Te=(e,a)=>{const r=co(Ce,e),s=co(Pe,a),n=Me((e-Ce[r])/(Ce[r+1]-Ce[r]),0,1),o=Me((a-Pe[s])/(Pe[s+1]-Pe[s]),0,1),l=me[(s*ae+r)*3+1],c=me[(s*ae+r+1)*3+1],u=me[((s+1)*ae+r)*3+1],d=me[((s+1)*ae+r+1)*3+1];return n+o<=1?l+(c-l)*n+(u-l)*o:d+(u-d)*(1-n)+(c-d)*(1-o)};g.setGround(Te),await i.yield();const Go=-3350,Io=-30,No=440,pt=[];{const r=new Float32Array(10032),s=[];for(let o=0,l=0;o<76;o++)for(let c=0;c<44;c++,l+=3){const u=(o/75-.5)*2,d=(c/43-.5)*2,S=Go+d*800,q=Io+u*1500,U=Math.pow(Math.abs(u),2.6)+Math.pow(Math.abs(d),2.2),b=.24*Math.abs(y.n2(u*2.3+5,d*2.3))+.08*y.n2(u*6,d*6+3),G=1-U-b,W=No*Math.pow(B(0,.42,G),.55)*(1-.06*y.n2(u*3+1,d*3))*(.9+.1*u)+(G>0?30*y.n2(u*9,d*9)*B(0,.2,G)*B(.5,.2,G):0);r[l]=S,r[l+1]=W-20,r[l+2]=q,c>44*.55&&G>.4&&G<.5&&pt.length<40&&pt.push([S,W-22,q])}for(let o=0;o<75;o++)for(let l=0;l<43;l++){const c=o*44+l,u=c+1,d=c+44,S=d+1;s.push(c,d,u,u,d,S)}const n=new t.BufferGeometry;n.setAttribute("position",new t.BufferAttribute(r,3)),n.setIndex(s),n.computeVertexNormals(),Z(new t.Mesh(n,lo(1)))}await i.yield();{const e=[],a=[],r=[];for(let o=0;o<6;o++){const l=1.035+o*.065,c=17+o*3;let u=0,d=0,S=0;for(let q=0;q<=200;q++){const U=q/200,b=c*B(0,.08,U)*B(1,.92,U)+.01,G=Ee(.08,.97,U)*Math.PI,W=to+oo*l*Math.cos(G),Y=Bt*l*Math.sin(G);q&&(u+=Math.hypot(W-d,Y-S)),d=W,S=Y;const J=Te(W,Y)-1.5,te=e.length/3;e.push(W,J,Y,W,J+b,Y),a.push(u/8.5,0,o*3.7+1,u/8.5,1,o*3.7+1),q<200&&r.push(te,te+1,te+2,te+1,te+3,te+2)}}const n=new t.BufferGeometry;n.setAttribute("position",new t.Float32BufferAttribute(e,3)),n.setAttribute("aUv",new t.Float32BufferAttribute(a,3)),n.setIndex(r),Z(new t.Mesh(n,new t.ShaderMaterial({vertexShader:v0,fragmentShader:p0,fog:!0,side:t.DoubleSide,uniforms:{...qe(),uTree:{value:ro},uSnowC:{value:m.shade.clone().lerp(m.snow,.35)},uRimC:{value:Ve.clone().multiplyScalar(.12)}}})))}await i.yield();const wt={value:.002},_e=(e={})=>new t.ShaderMaterial({vertexShader:ao,fragmentShader:l0,fog:!0,vertexColors:!0,side:e.two?t.DoubleSide:t.FrontSide,uniforms:{...qe(),uTime:We,uThin:wt,uSway:{value:e.sway??0},uSunDir:{value:O},uSunCol:{value:Ve},uSkyCol:{value:ge},uBounce:{value:m.bounce},uSnow:{value:m.snow},uShade:{value:m.shade},uLichen:{value:io},uCap:{value:e.cap??0},uHoar:{value:e.hoar??0},uGrain:{value:e.grain??0},uTwoSide:{value:e.two?1:0},uAllSnow:{value:e.snow??0}}}),uo=new t.ShaderMaterial({transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.SrcAlphaFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.ZeroFactor,blendDstAlpha:t.OneFactor,uniforms:{uShCol:{value:m.shade.clone().multiplyScalar(.93)},uShStr:{value:m.shadowStrength}},vertexShader:"varying vec2 vQ; void main(){ vQ = position.xz; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.); }",fragmentShader:"uniform vec3 uShCol; uniform float uShStr; varying vec2 vQ; void main(){ float k = (1. - smoothstep(.35, 1., length(vQ))) * uShStr * .9; gl_FragColor = vec4(uShCol, k); }"}),I=new t.Matrix4,Ue=new t.Quaternion,Be=new t.Euler,T=new t.Vector3,ie=new t.Vector3,re=new t.Vector3,Oe=new t.Vector3,Vt=[],fo=[],ho=[],qt=(e,a,r,s,n)=>{const o=Vt.length/3,l=Math.max(2,Math.ceil(r/2.5)),c=-xe.y,u=xe.x;for(let d=0;d<=l;d++){const S=d/l,q=e+xe.x*r*S,U=a+xe.y*r*S;for(const b of[-1,1]){const G=q+c*s*b,W=U+u*s*b;Vt.push(G,Te(G,W)+.12,W),fo.push(S,b,n)}if(d<l){const b=o+d*2;ho.push(b,b+1,b+2,b+1,b+3,b+2)}}},st=329,it=-37.2,Rt=Te(st,it),mo=_e({grain:1,cap:.95,hoar:.5});let vo=Rt+4;for(const[e,[a,r,s,n,o]]of[[0,1,0,2.7,.75],[.5,2.5,-.3,1.7,.8],[-.2,3.5,.2,1.05,.7],[2.6,.3,1.4,1.2,.7],[-2.2,.2,-1.6,.9,.8]].entries()){const l=_o({rng:p.fork("tor"+e),kind:"boulder",radius:n,detail:e<3?3:2,color:"#7a7068",colorB:"#5a524c"}),c=new t.Mesh(l,mo);c.position.set(st+a,Rt+r,it+s),c.scale.set(1,o,1),c.rotation.y=e*2.1,Z(c),e===2&&(l.computeBoundingBox(),vo=Rt+r+l.boundingBox.max.y*o-.1),await i.yield()}qt(st,it,Math.min(4.2*dt,26),2.6,0),await i.yield();{const e=p.fork("stones"),a=46,r=new t.InstancedMesh(_o({rng:e,kind:"boulder",radius:1,detail:1,color:"#7a7068",colorB:"#5a524c"}),mo,a);for(let s=0,n=0;s<a&&n<4e3;n++){const o=e.range(318,402),l=e.range(-82,22);if(Fo(o,l)<.57)continue;const c=e.range(.22,.75);I.compose(T.set(o,Te(o,l)+c*.25,l),Ue.setFromEuler(Be.set(e()*.5,e()*ne,e()*.5)),ie.set(c*e.range(1,1.6),c*.7,c)),r.setMatrixAt(s++,I),c>.5&&qt(o,l,c*dt*.9,c*.8,0)}Z(r)}await i.yield();{const e=p.fork("twigs"),a=Math.round(310*H),r=new t.InstancedMesh(Do(e),_e({two:1,sway:1}),a);let s=0;for(let n=0;s<a-90&&n<3e4;n++){const o=e.range(314,402),l=e.range(-80,20);!(Math.hypot(o-st,l-it)<7)&&Fo(o,l)+e()*.1<.62||(I.compose(T.set(o,Te(o,l),l),Ue.setFromEuler(Be.set(0,e()*ne,0)),ie.setScalar(e.range(.8,1.6))),r.setMatrixAt(s++,I),(n&1023)===0&&await i.yield())}for(;s<a;s++){const n=e()*ne,o=e.range(8.5,19);I.compose(T.set(Math.cos(n)*o,0,Math.sin(n)*o),Ue.setFromEuler(Be.set(0,e()*ne,0)),ie.setScalar(e.range(.8,1.5))),r.setMatrixAt(s,I)}Z(r)}await i.yield();{const e=p.fork("eyefloor"),a=he.cleftDir.x,r=he.cleftDir.z,s=g.craters,n=g.eyeSpots,o=[],l=(f,x,A)=>{const R=Math.hypot(f,x);if(R<14.5||R>60)return!1;for(const j of s)if(Math.hypot(j.x-f,j.z-x)<j.R*1.5+A)return!1;for(const j of n)if(Math.hypot(j.x-f,j.z-x)<.75+A)return!1;return!0},c=(f,x,A,R)=>o.push(f+xe.x*R*.75,x+xe.y*R*.75,A,R),u=new t.IcosahedronGeometry(1,0),d=u.attributes.position,S=u.attributes.normal,q=new Float32Array(d.count*3),U=z("#b9bca6"),b=z("#565c4e");for(let f=0;f<d.count;f++){T.fromBufferAttribute(d,f).normalize();const x=1+.2*y.n3(T.x*2.4+5,T.y*2.4,T.z*2.4),A=Math.max(T.y*x*.8,-.06);d.setXYZ(f,T.x*x,A,T.z*x),ie.set(T.x,T.y*1.6+.25,T.z).normalize(),S.setXYZ(f,ie.x,ie.y,ie.z);const R=Me((x-.85)/.35,0,1)*(.5+.5*Me(T.y*2+.6,0,1));q[f*3]=Ee(b.r,U.r,R),q[f*3+1]=Ee(b.g,U.g,R),q[f*3+2]=Ee(b.b,U.b,R)}u.deleteAttribute("uv"),u.setAttribute("color",new t.BufferAttribute(q,3)),u.setAttribute("aAnim",new t.BufferAttribute(new Float32Array(d.count*4),4));const G=new Ae,W=z("#3b1a22"),Y=z("#2c3524"),J=z("#cfc6c4"),te=G.loft([[-.26,0,0,0],[-.18,.02,.13,.04],[0,.03,.22,.06],[.17,.02,.15,.045],[.26,0,0,0]].map(([f,x,A,R])=>({z:f,y:x,rx:A,ry:R})),{sides:7,top:W,belly:Y});G.paint(te,(f,x,A,R)=>{R.lerp(Y,.5+.5*y.n2(f*14,A*14)),R.multiplyScalar(.8+.4*y.n2(f*31+3,A*31))});for(let f=0;f<16;f++){const x=e()*ne,A=e.range(.02,.2),R=Math.cos(x)*A,j=Math.sin(x)*A*1.1,se=e.range(.08,.2),Ne=Math.cos(x)*.3*se+e.range(-.03,.03),Tt=Math.sin(x)*.3*se,_t=.011,ue=-Math.sin(x)*_t,le=Math.cos(x)*_t,ye=[[R,.03,j],[R+Ne*.5,.03+se*.6,j+Tt*.5],[R+Ne,.03+se,j+Tt]],we=G.strip(ye.map(be=>[be[0]+ue,be[1],be[2]+le]),ye.map(be=>[be[0]-ue,be[1],be[2]-le]),f%3?W:Y,f%2?J:W);G.anim(we,(be,Ut,_0,To)=>[(To-we[0]&1?-1:1)*ue,0,(To-we[0]&1?-1:1)*le,.03*Ut])}const oe=new t.IcosahedronGeometry(1,0),Q=oe.attributes.position,pe=new Map;for(let f=0;f<Q.count;f++){T.fromBufferAttribute(Q,f);const x=Math.round(T.x*100)+","+Math.round(T.y*100)+","+Math.round(T.z*100);pe.has(x)||pe.set(x,[e.range(.6,1.25),e.range(.5,1.1),e.range(.6,1.25)]);const A=pe.get(x);Q.setXYZ(f,T.x*A[0],Math.max(T.y*A[1]*.7,-.25),T.z*A[2])}oe.deleteAttribute("uv");{const f=oe.attributes.normal;for(let x=0;x<Q.count;x++)T.fromBufferAttribute(Q,x).normalize(),f.setXYZ(x,T.x*.85,T.y*.85+.3,T.z*.85)}oe.setAttribute("color",new t.BufferAttribute(new Float32Array(Q.count*3).fill(.85),3)),oe.setAttribute("aAnim",new t.BufferAttribute(new Float32Array(Q.count*4),4)),await i.yield();const Ze=Math.round(95*H),Fe=Ze*4,zt=Ze*2,kt=Ze*3,ut=Math.round(430*H),Ie=new t.InstancedMesh(u,_e({hoar:.25}),Fe),ot=new t.InstancedMesh(G.build(),_e({two:1,sway:.4,hoar:.3}),zt),Zt=new t.InstancedMesh(Do(e),_e({two:1,sway:1}),kt),Xt=new t.InstancedMesh(oe,_e({snow:1}),ut);let Ct=0,$t=0,Yt=0,Pt=0;const Co=new t.Color;for(let f=0,x=0;x<Ze&&f<Ze*30;f++){const A=e.range(12,63),R=e()<.72?e.range(-9.5,9.5):e.range(-18,18),j=a*A-r*R,se=r*A+a*R;if(!l(j,se,.55))continue;x++;const Ne=1+(e()<.5?1:0);for(let ue=0;ue<Ne&&$t<zt;ue++){const le=e.range(.9,1.7),ye=j+e.range(-.3,.3)*ue,we=se+e.range(-.3,.3)*ue;I.compose(T.set(ye,0,we),Ue.setFromEuler(Be.set(0,e()*ne,0)),ie.set(le,le*e.range(.9,1.4),le)),ot.setMatrixAt($t++,I),c(ye,we,.24*le,.5*le)}const Tt=2+Math.floor(e()*3);for(let ue=0;ue<Tt&&Ct<Fe;ue++){const le=e()*ne,ye=e.range(.2,.6),we=e.range(.07,.16),be=j+Math.cos(le)*ye,Ut=se+Math.sin(le)*ye;I.compose(T.set(be,.01,Ut),Ue.setFromEuler(Be.set(0,e()*ne,0)),ie.set(we*e.range(.9,1.4),we*e.range(.7,1.1),we)),Co.setScalar(e.range(.8,1.15)),Ie.setColorAt(Ct,Co),Ie.setMatrixAt(Ct++,I),c(be,Ut,we*.9,we*1.6)}const _t=1+Math.floor(e()*3);for(let ue=0;ue<_t&&Yt<kt;ue++){const le=e()*ne,ye=e.range(.05,.6);I.compose(T.set(j+Math.cos(le)*ye,0,se+Math.sin(le)*ye),Ue.setFromEuler(Be.set(0,e()*ne,0)),ie.setScalar(e.range(.8,1.5))),Zt.setMatrixAt(Yt++,I)}}await i.yield();const Po=(f,x,A)=>{Pt>=ut||(I.compose(T.set(f,A*.2,x),Ue.setFromEuler(Be.set(e.range(-.5,.5),e()*ne,e.range(-.5,.5))),ie.set(A*e.range(.8,1.5),A,A*e.range(.8,1.3))),Xt.setMatrixAt(Pt++,I),A>.085&&c(f,x,A*.9,A*2.2))};for(const f of s){const x=f.x*a+f.z*r,A=-f.x*r+f.z*a;if(!f.sure||x<6||Math.abs(A)>16)continue;const R=6+Math.floor(e()*5);for(let j=0;j<R;j++){const se=e()*ne,Ne=f.R*e.range(1,1.32);Po(f.x+Math.cos(se)*Ne,f.z+Math.sin(se)*Ne,e.range(.05,.14))}}for(let f=0;f<4e3&&Pt<ut;f++){const x=f%5<3?e.range(ce.slide0-.02,.985):f%5<4?e.range(ce.wheel0+.01,ce.rim1+.035):e.range(ce.low1-.004,ce.slide0-.02);fe.pointAt(x,re),fe.tangentAt(x,Oe);const A=e(),R=(.7+6.8*A*A)*e.sign(),j=re.x-Oe.z*R,se=re.z+Oe.x*R;Math.hypot(j,se)<60&&!l(j,se,.1)||(Po(j,se,Math.abs(R)<5&&e()<.36?e.range(.055,.1):e.range(.03,.085)),(f&255)===255&&await i.yield())}Ie.count=Ct,ot.count=$t,Zt.count=Yt,Xt.count=Pt,Z(Ie),Z(ot),Z(Zt),Z(Xt),await i.yield();const Qt=o.length/4,Jt=new t.InstancedMesh(new t.CircleGeometry(1,6).rotateX(-Math.PI/2),uo,Math.max(1,Qt)),e0=Math.atan2(xe.x,xe.y);for(let f=0;f<Qt;f++)I.compose(T.set(o[f*4],.05,o[f*4+1]),Ue.setFromEuler(Be.set(0,e0,0)),ie.set(o[f*4+2],1,o[f*4+3])),Jt.setMatrixAt(f,I);Jt.count=Qt,Z(Jt,1)}await i.yield();{const e=p.fork("birch"),a=50,r=new t.InstancedMesh(w0(e),_e({two:1,sway:1,hoar:.8}),a);await i.yield();let s=0;for(let n=0;s<a&&n<6e3;n++){const o=e.range(-260,230),l=e.range(214,300);if(Math.abs(o+30)<45||Math.hypot(l,o)<238)continue;const c=Te(l,o);if(c<.5||c>24)continue;const u=e.range(1.2,2.3);I.compose(T.set(l,c,o),Ue.setFromEuler(Be.set(e.range(-.12,.12),e()*ne,e.range(-.12,.12))),ie.set(u,u*e.range(.85,1.1),u)),r.setMatrixAt(s++,I),qt(l,o,Math.min(2.1*u*dt,30),1.2*u,1+e())}r.count=s,Z(r)}await i.yield();{const e=new t.BufferGeometry;e.setAttribute("position",new t.Float32BufferAttribute(Vt,3)),e.setAttribute("aUv",new t.Float32BufferAttribute(fo,3)),e.setIndex(ho),Z(new t.Mesh(e,new t.ShaderMaterial({vertexShader:c0,fragmentShader:u0,fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.ZeroFactor,blendDst:t.SrcColorFactor,blendSrcAlpha:t.ZeroFactor,blendDstAlpha:t.OneFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4,uniforms:{...qe(),uShTint:{value:Dt},uShStr:{value:m.shadowStrength}}})),1)}const je=new t.Group,$e=new t.Group,po=[],Gt=_e({two:1});let gt;{const e=g0(),a=new t.Mesh(e.body,Gt);a.position.set(0,-.36,.3),$e.position.set(0,.36,-.3),$e.add(a),gt=new t.Mesh(e.head,Gt),gt.position.set(0,.11,.76),$e.add(gt);for(const[r,s]of[[-.1,.6],[.1,.6],[-.11,.02],[.11,.02]]){const n=new t.Mesh(e.leg,Gt);n.position.set(r,-.03,s),$e.add(n),po.push(n)}je.add($e),je.scale.setScalar(1.4),v.add(je),je.traverse(r=>{r.frustumCulled=!1})}const Eo=.014,It=new t.Vector3(st-.2,vo,it+.2),xt=new t.Vector3(-.35,0,-.94).normalize();await i.yield();const yt=21,wo=C<.25,go=x0(),xo=_e({two:1}),Re=5,rt=yt-Re,Nt=y0(),Ye=new t.InstancedMesh(go.body,xo,Re),Se=new t.InstancedMesh(go.wing,xo,Re*2),bt=new Float32Array(yt*4),Et=m.snow.clone().multiplyScalar(.9),Lt=m.shade.clone().multiplyScalar(1.25).lerp(m.snow,.28),Lo=new t.ShaderMaterial({vertexShader:ao,fragmentShader:Bo,fog:!0,vertexColors:!0,side:t.DoubleSide,uniforms:{...qe(),uTime:We,uThin:wt,uSway:{value:0},uSunDir:{value:O},uSunCol:{value:Ve},uWhite:{value:Et},uUnder:{value:Lt},uWing:{value:0}}}),Wo=new t.ShaderMaterial({vertexShader:ao,fragmentShader:Bo,fog:!0,vertexColors:!0,side:t.DoubleSide,uniforms:{...qe(),uTime:We,uThin:wt,uSway:{value:0},uSunDir:{value:O},uSunCol:{value:Ve},uWhite:{value:Et},uUnder:{value:Lt},uWing:{value:1}}}),Qe=new t.InstancedMesh(Nt.body,Lo,rt),Ho=new t.ShaderMaterial({transparent:!0,depthWrite:!1,side:t.DoubleSide,fog:!0,uniforms:{...qe(),uCol:{value:Lt.clone().lerp(Et,.45)},uAlpha:{value:.24}},vertexShader:`#include <common>
#include <fog_pars_vertex>
attribute vec2 aA; varying vec2 vA;
void main(){ vA = aA; vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`#include <common>
#include <fog_pars_fragment>
uniform vec3 uCol; uniform float uAlpha; varying vec2 vA;
void main(){ float a = (1. - smoothstep(.25, 1., vA.x)) * smoothstep(0., .22, vA.y) * smoothstep(1., .78, vA.y); gl_FragColor = vec4(uCol, a * uAlpha);
#include <fog_fragment>
}`}),Je=new t.InstancedMesh(Nt.blur,Ho,rt*2),et=new t.InstancedMesh(Nt.wing,Wo,rt*2),lt=new t.InstancedMesh(new t.CircleGeometry(1,10).rotateX(-Math.PI/2),uo,rt);{const e=p.fork("birds"),a=new t.Color(.05,.05,.065),r=new t.Color(.56,.56,.58);for(let s=0;s<yt;s++){const n=s===4&&wo?r:a;s<Re?(Ye.setColorAt(s,n),Se.setColorAt(s*2,n),Se.setColorAt(s*2+1,n)):Qe.setColorAt(s-Re,new t.Color(1,1,1));for(let o=0;o<4;o++)bt[s*4+o]=e()}I.makeScale(0,0,0);for(let s=0;s<Re;s++)Ye.setMatrixAt(s,I),Se.setMatrixAt(s*2,I),Se.setMatrixAt(s*2+1,I);for(let s=0;s<rt;s++){Qe.setMatrixAt(s,I),lt.setMatrixAt(s,I);for(let n=0;n<2;n++)et.setMatrixAt(s*2+n,I),Je.setMatrixAt(s*2+n,I)}Z(Ye),Z(Se),Z(Qe),Z(lt,1),Z(Je,3),Z(et)}const X=new t.Matrix4,ve=new t.Matrix4,Ge=new t.Matrix4,Wt=new t.Matrix4().makeScale(-1,1,1),ct=new t.Vector3(0,1,0),Mt=(e,a,r,s,n,o)=>{if(o<=0){X.makeScale(0,0,0),Ye.setMatrixAt(e,X),Se.setMatrixAt(e*2,X),Se.setMatrixAt(e*2+1,X);return}re.crossVectors(ct,r),re.lengthSq()<1e-6&&re.set(1,0,0),re.normalize(),Oe.crossVectors(r,re),X.makeBasis(re,Oe,r).multiply(Ge.makeRotationZ(s)).scale(ie.set(o,o,o)).setPosition(a),Ye.setMatrixAt(e,X),ve.copy(X).multiply(Ge.makeRotationZ(n)),Se.setMatrixAt(e*2,ve),ve.copy(X).multiply(Wt).multiply(Ge.makeRotationZ(n)),Se.setMatrixAt(e*2+1,ve)},yo=[],Ko=new t.Vector3,k0=new t.Vector3,Oo=new t.Vector3,C0=new t.Vector3,Ht=.672,P0=fe.pointAt(Ht),bo=fe.tangentAt(Ht).setY(0).normalize(),T0=new t.Vector3(-bo.z,0,bo.x),jo=1-34/ke,Mo=he.boulderTop.clone().add(new t.Vector3(0,.1,0)),Kt=new t.Vector3(he.cleftDir.z,0,-he.cleftDir.x).multiplyScalar(.3).add(he.cleftDir).normalize(),St=new t.Vector3,De=new t.Vector3,tt=new t.Vector3,ee=new t.Vector3,de=new t.Vector3,Zo=-.3,Xo=14.5,$o=[[.05,14.7,9.91,.52,2.47],[-.1,14.85,9.29,1.52,2.61],[.15,15,9.48,2.59,2.47],[0,14.75,11.29,1.18,1.97],[.25,14.9,10.42,2.29,1.91],[.1,14.65,12.1,-.15,2.18],[-.05,14.8,10.97,4,3.1],[.2,14.95,11.77,-1.03,2.91],[-.35,14.7,15.6,-2.1,1.86],[-.5,14.85,16.47,-.29,1.23],[-.25,15,14.74,1.28,2.05],[-.4,14.75,16.8,3.39,1.02],[-.15,14.9,14.85,4.77,1.93],[-.3,14.65,15.79,7.19,1.54],[-.45,14.8,15.36,-3.64,1.29],[-.2,14.95,16.06,4.03,2.71]].map(([e,a,r,s,n])=>({t0:e,v:a,lead0:r,lat0:s,H:n})),Yo=(e,a)=>{const r=Math.min(a,ce.wheel0);for(let n=0;n<2;n++){const o=bt[n*4],l=8.5+3.5*n,c=B(ce.wheel0-.09,ce.wheel0+.03,a);fe.posAtDist(r*ke+l,St),fe.tangentAtDist(r*ke+l,De),tt.crossVectors(ct,De).normalize(),de.copy(St).addScaledVector(tt,4.2+2.6*n+1.2*Math.sin(e*.5+o*9)+46*c).addScaledVector(De,1.5*Math.sin(e*.37+o*5)+20*c),de.y+=-1.6+1.5*n+.5*Math.sin(e*.8+o*7)+11*c,ee.copy(De).addScaledVector(tt,.9*c),ee.y=.2*c,ee.normalize();const u=Math.sin(e*6.2+o*20),d=B(.3,.7,Math.sin(e*.45+o*11));Mt(n,de,ee,-.9*c*(1-c)*4*.5+.08*Math.sin(e+o*3),Ee(.55*u,.12,d),1-B(ce.wheel0+.02,ce.wheel0+.06,a))}for(let n=2;n<4;n++){const o=bt[n*4],l=e*.24+(n-2)*.35+o,c=72+10*Math.sin(e*.21+o*8);de.set(Math.cos(l)*c,21+3*Math.sin(e*.33+n)+(n-2)*2.5,-Math.sin(l)*c),ee.set(-Math.sin(l),.1*Math.cos(e*.33+n),-Math.cos(l)).normalize();const u=Math.pow(Math.max(0,Math.sin(e*.5+o*30)),12)*3.2;Mt(n,de,ee,-.35+u,u>.3?-.5:.5*Math.sin(e*6+o*20),1)}{const n=g.clockAt(a)-g.clockAt(jo),o=wo?1.25:1;if(n<=0)ee.copy(Kt),Mt(4,Mo,ee,.05*Math.sin(e*.7),-1.35,o);else{const l=1-Math.exp(-n*1.6),c=B(.25,1.7,n),u=Math.max(0,n-1.9);de.copy(Mo).addScaledVector(Kt,7*(n-l/1.6)).addScaledVector(ct,.5*l-5.2*c+1.6*u),ee.copy(Kt),ee.y=.3*(1-B(0,.3,n))-.42*c*(1-c)*4*.5+.2*B(1.9,2.4,n),ee.normalize(),Mt(4,de,ee,-.2*l*(1-c),.85*Math.sin(n*17)+.1,o)}}const s=g.clockAt(a)-g.clockAt(Ht);for(let n=Re;n<yt;n++){const o=n-Re,l=$o[o],c=bt[n*4],u=s-l.t0;if(u<=0||u>9.5){X.makeScale(0,0,0),Qe.setMatrixAt(o,X),lt.setMatrixAt(o,X);for(let pe=0;pe<2;pe++)et.setMatrixAt(o*2+pe,X),Je.setMatrixAt(o*2+pe,X);continue}const d=l.v*(u-(1-Math.exp(-2.5*u))/2.5),S=B(3.7,5.2,u),q=B(4.8,9,u),U=Math.max(4.3,l.lead0+d-Xo*u);fe.posAtDist(a*ke+U,St),fe.tangentAtDist(a*ke+U,De),De.y=0,De.normalize(),tt.crossVectors(De,ct),de.copy(St).addScaledVector(tt,l.lat0+Zo*u+9*S+26*q*q),de.y=.14+(l.H-.14)*(1-Math.exp(-2.6*u))+.07*Math.sin(u*3+c*20)+1.2*S-.5*q,ee.copy(De).addScaledVector(tt,-.6+1*S+.6*q),ee.y=.5*Math.exp(-2.4*u)+.12*S*(1-q)+.5*(1-B(3,5,u)),ee.normalize();const b=1.36*B(0,.14,u)*(1-B(8,9.5,u)),G=-.15+.12*Math.sin(u*2+c*9)+.75*S*(1-q),W=u*62+c*30;re.crossVectors(ct,ee),re.lengthSq()<1e-6&&re.set(1,0,0),re.normalize(),Oe.crossVectors(ee,re),X.makeBasis(re,Oe,ee).multiply(Ge.makeRotationZ(G)).scale(ie.set(b,b,b)).setPosition(de),Qe.setMatrixAt(o,X);const Y=Math.sin(W),J=.1+.66*Math.sign(Y)*Math.pow(Math.abs(Y),.5),te=.08*Math.sin(W*.31);ve.copy(X).multiply(Ge.makeRotationZ(J)),et.setMatrixAt(o*2,ve),ve.copy(X).multiply(Wt).multiply(Ge.makeRotationZ(J)),et.setMatrixAt(o*2+1,ve),ve.copy(X).multiply(Ge.makeRotationZ(te)),Je.setMatrixAt(o*2,ve),ve.copy(X).multiply(Wt).multiply(Ge.makeRotationZ(te)),Je.setMatrixAt(o*2+1,ve);const oe=Math.min(de.y/Math.max(O.y,.1),14),Q=b*(.27+.012*oe);X.makeScale(Q,1,Q).setPosition(de.x-O.x*oe,.07,de.z-O.z*oe),lt.setMatrixAt(o,X)}Qe.instanceMatrix.needsUpdate=!0,et.instanceMatrix.needsUpdate=!0,lt.instanceMatrix.needsUpdate=!0,Je.instanceMatrix.needsUpdate=!0,Ye.instanceMatrix.needsUpdate=!0,Se.instanceMatrix.needsUpdate=!0},Ot=new t.Vector2,So={value:450};{const e=p.fork("dust"),a=Math.round((w==="blizzard"?2600:w==="overcast"?2200:2e3)*H),r=new Float32Array(a*4);for(let d=0;d<a*4;d++)r[d]=e();const s=new t.BufferGeometry;s.setAttribute("position",new t.BufferAttribute(new Float32Array(a*3),3)),s.setAttribute("aSeed",new t.BufferAttribute(r,4));const[n,o,l,c,u]=h.dust;Z(new t.Points(s,new t.ShaderMaterial({vertexShader:f0,fragmentShader:d0,transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{uBox:{value:new t.Vector3(60,40,60)},uVel:{value:new t.Vector3(...u)},uSunDir:{value:O},uColA:{value:z(n)},uGold:{value:m.gold.clone().multiplyScalar(w==="moon"?.5:1)},uTime:We,uBufH:So,uSize:{value:o},uGlintK:{value:l},uOpaque:{value:c}}})),4)}await i.yield();{const e=p.fork("drift"),a=[],r=[],s=w==="blizzard",n=Math.round((s?560:240)*H),o=Math.round(150*H);for(let c=0;c<n;c++)a.push(e(),s?e.range(.15,.45):e.range(.12,.5),e(),e()),r.push(0,s?e.range(7,15):e.range(5,11),s?e.range(.2,.45):e.range(.35,.8),0);for(let c=0;c<o;c++){let u=e.range(-150,90);Math.abs(u+30)<26&&(u+=u<-30?-26:26);let d=270;for(;d<360&&K(d,u)<eo+40.5;)d+=1.5;a.push(d-3+e.range(0,30),Te(d,u)+.35,u,e()),r.push(1,e.range(3,6.5),e.range(.5,1.1),e.range(18,40))}for(let c=0;c<pt.length;c+=3){const u=pt[c];a.push(u[0],u[1]+10,u[2],e()),r.push(1,170,34,520)}const l=new t.InstancedBufferGeometry;l.setAttribute("position",new t.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),l.setIndex([0,1,2,0,2,3]),l.setAttribute("iA",new t.InstancedBufferAttribute(new Float32Array(a),4)),l.setAttribute("iB",new t.InstancedBufferAttribute(new Float32Array(r),4)),l.instanceCount=a.length/4,Z(new t.Mesh(l,new t.ShaderMaterial({vertexShader:h0,fragmentShader:m0,fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...qe(),uBox:{value:new t.Vector3(220,1,220)},uSunDir:{value:O},uLit:{value:m.snow.clone().multiplyScalar(.34*Math.min(m.sunIntensity,2.1)+.12)},uShadeC:{value:m.shade.clone().lerp(m.snow,.3).multiplyScalar(.85)},uGold:{value:m.gold.clone().multiplyScalar(.5)},uTime:We,uAlpha:{value:h.drift}}})),2)}await i.yield(),await ht.prewarm(_,null,v),await i.yield();let At=0,Ao=0,jt=0,zo=-1,ko=0;const Qo=(e,a)=>g.gazeAt(a,Oo),Jo=g.clockAt(ce.dive1+.1);return Ko.copy(he.portalSeat.position),yo.push({at:Qo,...g.gazePoi}),{scene:v,path:fe,duration:g.duration,pace:g.pace,ride:"none",camera:{fov:62,near:.3,far:6500,bank:.45},pois:yo,portal:{shape:"arch",width:8,height:10,color:h.portal,glow:.9,revealDistance:300},post:{exposure:h.exposure,bloom:{strength:.22,radius:.6,threshold:.92},grade:{saturation:h.sat,contrast:1.07,tint:h.tint,shadowTint:"#0b1230",vignette:.26,grain:.02,aberration:0}},update(e,a,r,s){We.value=a,Ft.value=a,_.getDrawingBufferSize(Ot),So.value=Ot.y,wt.value=.9/Math.max(Ot.y,1),s<=0&&(At+=e,Ao=At<5?At-5:4.5*(1-Math.exp(-(At-5)/4.5))),s>0&&s===zo?jt+=Me(a-ko,0,2):jt=0,zo=s,ko=a,g.setClock(g.clockAt(s)+Ao*(1-Me(g.clockAt(s)/Jo,0,1))+jt),g.setLead(s),g.update(e,a,r),ht.update(e,a,r);const n=g.clockAt(s)-g.clockAt(Eo),o=1-B(0,.4,n),l=1-o,c=6.5*Math.max(0,n-.2),u=c*5.2,d=It.x+xt.x*c,S=It.z+xt.z*c,q=Te(d,S);je.position.set(d,Math.max(q,It.y-c*1.6)+l*.08*Math.abs(Math.sin(u)),S),je.rotation.y=Ee(.65,Math.atan2(xt.x,xt.z)+ne,B(0,.5,n)),je.visible=c<90;const U=o*1.25;$e.rotation.x=-U+l*.14*Math.sin(u),gt.rotation.set(U*.85,o*.8*Math.sin(a*.9)+l*.1*Math.sin(a*2),0);for(let b=0;b<4;b++)po[b].rotation.x=(b<2?U*.7:U)+l*.75*Math.sin(u+(b<2?0:2.4)+(b&1)*.5);Yo(a,s)},dispose(){ht.dispose()}}}};export{q0 as default};
