import*as e from"three";import{mergeGeometries as nt}from"three/addons/utils/BufferGeometryUtils.js";const rt=["#0B3C6F","#06213F","#1F5C97","#F3F1E8","#A9C4DE","#C6CF6A","#9DB0A0"],ae=Math.PI*2,Ee=`
float sp_h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float sp_vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(sp_h21(i), sp_h21(i + vec2(1., 0.)), f.x), mix(sp_h21(i + vec2(0., 1.)), sp_h21(i + vec2(1., 1.)), f.x), f.y); }
`,Pe=`
uniform vec4 uR1, uR2;
float sp_front(vec4 R, vec2 p){
  vec2 n = R.xy; float q = dot(vec2(-n.y, n.x), p);
  return R.z - dot(n, p) + 2.2 * sin(q * 0.045 + R.w) + 1.1 * sin(q * 0.13 - R.w * 1.7) + 3. * (sp_vn(p * 0.05) - .5);
}
`,Qe=`
uniform vec3 uCoat1, uPruss, uDeep, uPaper, uSens, uGrey, uMilk;
uniform vec2 uSensW;            // the sensitised band beyond rinse one's lip: (half-width across the course m, depth beyond the lip m)
uniform float uViewH;
uniform float uTime, uExpose, uSkyRinse;
uniform vec3 uSensAt, uSheet;   // (x, z, radius) of the still-sensitised patch; (x, z, radius) of the coated sheet
uniform vec2 uBrush;            // the one direction every streak runs
uniform vec4 uStar;             // our own star's shadow as it lies now: (x, z, radius m, spoke phase); radius 0 = none
uniform vec3 uBand;             // bare margin at the horizon: (height deg, azimuth of a gap where the coat reaches the ground, gap half-width rad)
// the uneven margin: 0 where the brush ran the coat right out to the edge, 1 where it stopped well short
float sp_margin(float az){ return smoothstep(0.47, 0.8, sp_vn(vec2(az * 3.1 + 1.7, 3.3)) * 0.65 + sp_vn(vec2(az * 9.3, 8.1)) * 0.35); }
// a few bubbles dried into the coat: thin pale rings, a seventh of the cells of a loose grid (g: cells, fw: width of one pixel in cells)
float sp_ring(vec2 g, float fw){
  vec2 id = floor(g); float h = sp_h21(id + 2.7);
  vec2 d = fract(g) - .5 - (vec2(sp_h21(id + 3.1), sp_h21(id + 9.7)) - .5) * .6;
  float r = 0.035 + 0.075 * sp_h21(id + 5.5);
  return (1. - smoothstep(0., fw * 1.5 + 0.004, abs(length(d) - r))) * step(0.86, h) * (1. - smoothstep(0.015, 0.05, fw));
}
float sp_streak(vec2 p){
  vec2 q = vec2(dot(p, uBrush), dot(p, vec2(-uBrush.y, uBrush.x)));
  return sp_vn(vec2(q.x * 0.008, q.y * 0.33)) * .55 + sp_vn(vec2(q.x * 0.02 + 7., q.y * 1.4)) * .3 + sp_vn(vec2(q.x * 0.05 + 3., q.y * 5.)) * .15 - .5;
}
// lip of a rinse sheet: a 3 m band 8 percent lighter, one thin white line, a few bubbles that drift and pop
vec3 sp_lip(vec3 c, float s, float fw, vec2 p, float k){     // k: 1 near, 0 far (a lip half a kilometre off is not a line on the horizon)
  float band = smoothstep(0., .3, s) * (1. - smoothstep(2., 3.2, s));
  c *= 1. + 0.08 * band;
  float line = 1. - smoothstep(0., fw * 1.5 + 1e-4, abs(s - 0.12));
  c = mix(c, uPaper, line * 0.75 * k);
  vec2 g = p / 2.6 + vec2(0.07, 0.05) * uTime, id = floor(g);
  float h = sp_h21(id), life = sp_h21(id + 17.3) * 16. + 1.;
  vec2 d = (fract(g) - .5 - (vec2(sp_h21(id + 3.1), sp_h21(id + 9.7)) - .5) * .62) * 2.6;
  float r = 0.1 + 0.24 * sp_h21(id + 5.5), pop = smoothstep(life - 1.2, life, s);
  float ring = 1. - smoothstep(0., fw * 1.4 + 0.02, abs(length(d) - r * (1. + pop * .6)));
  c = mix(c, uPaper, ring * step(0.87, h) * smoothstep(.3, 1., s) * (1. - pop) * 0.65);
  return c;
}
// p: metres on the sheet; E: exposure, 1 where light reached (ink), 0 in shadow (bare paper); far: 0..1 sinking to deep blue
vec3 sp_paper(vec2 p, float E, float Ec, float far, float dist){
  float s1 = sp_front(uR1, p), s2 = sp_front(uR2, p);
  float fw1 = fwidth(s1), fw2 = fwidth(s2);
  float st = sp_streak(p);
  vec3 ink = mix(uCoat1, uPruss, smoothstep(0., 5., s2));
  float bs = sp_vn(vec2(dot(p, uBrush) * 0.012 + 5., dot(p, vec2(-uBrush.y, uBrush.x)) * 2.6));     // single bristle tracks
  ink = mix(ink, uDeep, far) * (1. + 0.22 * st + 0.09 * (smoothstep(0.62, 0.78, bs) - smoothstep(0.2, 0.36, 1. - bs)) * (1. - far));
  float tn = sp_vn(p * 0.011 + 3.7) + 0.15 * sp_vn(p * 0.06);
  float tw = fwidth(tn) * 1.6 + 1e-4;
  float tide = (1. - smoothstep(0., tw, abs(tn - 0.66))) * 0.34 + (1. - smoothstep(0., 0.05, tn - 0.66)) * step(0.66, tn) * 0.1;   // a hard edge, a pale wash inside it
  ink *= 1. + (tide + 0.3 * sp_ring(p / 13., fwidth(p.x) / 13. + fwidth(p.y) / 13.)) * (1. - far);
  float sh = max(1. - E, 0.);
  // our own star: its spokes are drawn where it is now and leave nothing behind (only its small eye writes a wake into E)
  { vec2 sq = (p - uStar.xy) / max(uStar.z, 0.01); float sr = length(sq), sa = (sr < 1e-4) ? 0. : atan(sq.y, sq.x);
    float sk = abs(fract(sa * 3.5014 + uStar.w) - .5) * 2., sv = sk * max(sr, .2);
    // how far the spoke pattern turns across one pixel, taken from the position itself (no seam, and it knows which way the
    // paper is foreshortened): spokes that run up the picture stay crisp, those squeezed sideways go to their own average
    vec2 sdx = dFdx(sq), sdy = dFdy(sq);
    float sdk = 7. * (abs(sq.x * sdx.y - sq.y * sdx.x) + abs(sq.x * sdy.y - sq.y * sdy.x)) / max(sr * sr, 2e-3);
    float sw = min(max(sr, .2) * sdk + sk * fwidth(sr), 0.5) * 0.7 + 0.01;
    float sund = smoothstep(0.55, 1.3, sdk);
    float spoke = mix((1. - smoothstep(0.045 - sw * 0.2, 0.045 + sw, sv)) * min(1., 0.09 / max(sw, 0.09) + 0.35), 0.42, sund) * (1. - smoothstep(0.62, 1., sr)) * 0.85;
    sh = max(sh, max(spoke, 0.1 * (1. - smoothstep(0.3, 1., sr))) * step(sr, 1.) * step(1e-3, uStar.z)); }
  // the comb: the fine wakes of the clock's seeds have a channel of their own, so they stay lines; they fade out before the lower edge of the picture
  { float cs = max(1. - Ec, 0.); sh = max(sh, cs * smoothstep(0.03, 0.075, gl_FragCoord.y / max(uViewH, 1.))); }
  float shw = sh * sqrt(sh);
  // a wake is bright at its head and sinks back evenly to the eye; its half-tone is the cyanotype's own milky blue (never a grey)
  vec3 wet = mix(mix(ink, uMilk, smoothstep(0., 0.62, shw) * 0.85), uPaper * (1. + 0.6 * smoothstep(0.8, 1., shw)), smoothstep(0.3, 0.92, shw));
  // (No sensitiser is left on the sheet: the print is two inks and nothing else. What tells the water's edge is tone alone:
  //  beyond the first rinse's lip the coat is a little under-developed, a pale breath of the milk ink that comes up along the
  //  brush tracks hair by hair and is gone within a dozen metres; a soft exposure edge, never a shape.)
  vec2 bq = vec2(dot(p, uBrush), dot(p, vec2(-uBrush.y, uBrush.x)));
  float dn = sp_vn(vec2(bq.x * 0.02, bq.y * 0.9)) * .5 + sp_vn(vec2(bq.x * 0.05 + 5., bq.y * 2.3 + 2.)) * .5;
  float un = (1. - smoothstep(-0.6, 0.6, s1)) * exp(min(s1, 0.) / 9.) * (1. - smoothstep(30., 75., dist));
  vec3 c = mix(wet, uMilk, un * (0.1 + 0.3 * smoothstep(0.35, 0.75, dn)) * (1. - smoothstep(0.1, 0.5, sh)));
  // a lip is a line only near us and only in stretches (the water's edge is ragged): running away it breaks up and is gone by 70 m
  float lk = (1. - smoothstep(22., 70., dist)) * smoothstep(0.3, 0.62, sp_vn(p * 0.035 + 3.)); lk *= lk;       // (round 5: the stretches are tens of metres long with soft ends; the old ones broke every metre or two across the brush tracks and read as a dashed line)
  c = sp_lip(c, s1, fw1, p, lk); c = sp_lip(c, s2, fw2, p + 31., lk);
  // (the coat runs out past the horizon everywhere: the uneven margin is the sky's, as dry-brush hairs, see sp_sky)
  return c;
}
// the sky: flat coat, brushed, a ragged edge and three degrees of bare paper at the horizon
vec3 sp_sky(vec3 dir){
  float el = degrees(asin(clamp(dir.y, -1., 1.)));
  float az = (abs(dir.x) + abs(dir.z) < 1e-4) ? 0. : atan(dir.x, dir.z);
  vec2 w = vec2(sin(az) * 1.6 + cos(az) * 0.9, cos(az) * 1.3 - sin(az) * 0.7);
  float st = sp_vn(vec2(w.x * 1.1, el * 0.42 + w.y)) * .5 + sp_vn(vec2(w.x * 1.4 + 9., el * 1.3 + w.y)) * .3 + sp_vn(vec2(w.y * 3. + 4., el * 4.1 + w.x * 2.)) * .2 - .5;
  float arc = uSkyRinse * 150. - 12. - (el + 22. * (1. - cos(az - 3.6)) + 5. * sp_vn(vec2(az * 3., 2.)));
  vec3 c = mix(uCoat1, uPruss, smoothstep(0., 7., arc));
  c = mix(c, uDeep, 0.6 * smoothstep(24., 90., el) * smoothstep(-4., 14., arc + 20.));
  float bs = sp_vn(vec2(w.x * 2.6 + 5., el * 9. + w.y * 14.));
  c *= 1. + 0.27 * st + 0.08 * (smoothstep(0.62, 0.78, bs) - smoothstep(0.2, 0.36, 1. - bs));
  float tn = sp_vn(vec2(az * 1.9 + 4.2, el * 0.06 + 2.)) + 0.18 * sp_vn(vec2(az * 7., el * 0.21));
  float tw = fwidth(tn) * 1.6 + 1e-4;
  c *= 1. + (1. - smoothstep(0., tw, abs(tn - 0.7))) * 0.3 + (1. - smoothstep(0., 0.05, tn - 0.7)) * step(0.7, tn) * 0.08
     + 0.3 * sp_ring(vec2(az * 57.3, el) / 9., fwidth(el) / 9.);
  float lipw = fwidth(arc);
  c = mix(c, uPaper, (1. - smoothstep(0., lipw * 1.2 + 1e-4, abs(arc - 0.3))) * 0.2 * step(0.001, uSkyRinse) * step(uSkyRinse, 0.999));
  // (round 5: NO margin is drawn. The dry-brush hairs read as rows of dashes along the horizon, and a real strip of bare paper a
  // degree tall read as a stray white bar. The coat runs to the horizon everywhere; uBand is kept only for the interface.)
  vec3 o = c;
  // well below the horizon (only ever seen through a portal whose lower rim dips under the sheet): the coat again, not bare paper
  return mix(o, c, 1. - smoothstep(-2.8, -1.5, el));
}
`,it=`
uniform float uViewH, uTime;
#ifdef SP_THREAD
attribute vec3 aTan; attribute vec3 aSW;   // tangent; (side -1..1, width m, alpha)
#endif
varying vec3 vWp; varying vec3 vN; varying vec2 vUv; varying float vA; varying float vX;
//PRE
void main(){
  vec3 pos = position; float alp = 1., wid = 0.;
  #ifdef SP_THREAD
  vec3 dir = aTan; wid = aSW.y; alp = aSW.z;
  #else
  vec3 dir = normal;
  #endif
  #ifdef USE_INSTANCING
  pos = (instanceMatrix * vec4(pos, 1.)).xyz; dir = mat3(instanceMatrix) * dir;
  #endif
  //MOVE
  vec4 wp = modelMatrix * vec4(pos, 1.);
  vec3 wd = mat3(modelMatrix) * dir;
  vec3 toC = cameraPosition - wp.xyz; float d = max(length(toC), 0.05);
  vX = 0.;
  #ifdef SP_THREAD
  vec3 side = cross(wd, toC); side = side / max(length(side), 1e-5);
  float pxm = uViewH * 0.5 * projectionMatrix[1][1] / d;   // pixels per metre here
  float wpx = wid * pxm, w2 = max(wpx, 1.6);
  alp *= wpx / w2;                                          // never thinner than 1.6 px: lose density, not width
  wp.xyz += side * aSW.x * 0.5 * w2 / max(pxm, 1e-4);
  vX = aSW.x;
  #endif
  #ifdef SP_SMALL
  alp *= 1. - smoothstep(150., 180., d);
  #endif
  vWp = wp.xyz; vN = wd; vUv = uv; vA = alp;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,lt=`
uniform vec3 uWhite, uMilk; uniform float uFar, uK, uA, uGhost, uTime, uHollow, uCore, uTone;
#ifdef SP_MAP
uniform sampler2D uMap;
#endif
varying vec3 vWp; varying vec3 vN; varying vec2 vUv; varying float vA; varying float vX;
${Ee}${Pe}
void main(){
  vec3 V = cameraPosition - vWp; float d = length(V);
  float nv = abs(dot(vN, V)) / max(length(vN) * d, 1e-5);
  float a = vA; float wsh = 1.;                 // wsh: how much of this density is drawing (white) and not film (milk)
  #if defined(SP_THREAD)
  a *= 1. - smoothstep(0.3, 1., abs(vX));
  #elif defined(SP_SOLID)
  // chord through a solid of revolution (dense core, soft edge); uHollow > 0 makes it a pipe with bright walls
  a *= 1. - exp(-uK * (nv - sqrt(max(uHollow * uHollow - 1. + nv * nv, 0.))));
  #else
  a *= uA / max(nv, 0.3);                     // a sheet: denser edge-on
  float pat = 0.;
  //PATTERN
  #ifdef SP_MAP
  pat = max(pat, texture2D(uMap, vUv).r);
  #endif
  { float ap = pat * 0.9 * vA; a = min(a, 0.85); wsh = clamp(ap / max(max(a, ap), 1e-4), 0., 1.); wsh *= wsh; a = max(a, ap); }
  #endif
  float a0 = clamp(a, 0., 1.);                // how solid this layer is in itself, before distance thins it
  a *= exp(-d / uFar);                        // distance thins, it never hazes
  a *= mix(uGhost, 1., smoothstep(0., 6., sp_front(uR2, vWp.xz)));
  a = clamp(a, 0., 1.);
  // a film piles up to milky blue and stops there; only veins, rims, threads and solid cores are paper white, and a
  // core that is truly solid is the bare paper itself (uCore lifts it to the paper's own hex through the tone curve)
  // (uTone: a thread or a solid at part density is the same half-tone, milky blue, and runs to white only as it nears solid)
  wsh *= mix(1., smoothstep(0.3, 0.82, a), uTone);
  vec3 col = mix(uMilk, uWhite, wsh) * (1. + uCore * wsh * smoothstep(0.62, 0.94, a0));
  gl_FragColor = vec4(col, a);
}`,Ze={vein:`{ vec2 q = vUv; float x = abs(q.x - .5) * 2.; float fy = fwidth(q.y) + 1e-4, fx = fwidth(x) + 1e-4;
    float rib = 1. - smoothstep(0.02, 0.02 + fx * 1.5, x);
    float sv = abs(fract(q.y * 9. - x * 1.6) - .5) * 2.; float side = (1. - smoothstep(0.1, 0.1 + fy * 30., sv)) * (1. - x);
    float outl = 1. - smoothstep(0.86, 1., x / max(sin(q.y * 3.14159) * 0.98 + 0.02, 0.02));
    pat = max(rib, side * .7) * outl; a *= outl; }`,ring:`{ float r = length(vUv - .5) * 2.; float fr = fwidth(r) + 1e-4;
    pat = (1. - smoothstep(0.1, 0.1 + fr * 1.5, abs(r - 0.78))) ; a *= 1. - smoothstep(0.86, 0.9 + fr, r); pat *= 1. - smoothstep(0.9, 0.9 + fr, r); }`,disc:"{ float r = length(vUv - .5) * 2.; a *= 1. - smoothstep(0.55, 1., r); }"};function ut(I,g={}){const u=g.palette||rt,$=a=>new e.Color(a),X=g.gain??1,h={prussian:$(u[0]),deep:$(u[1]),coat1:$(u[2]),paper:$(u[3]),milk:$(u[4]),sensitiser:$(u[5]),exposed:$(u[6])},se=g.exposure??1,z=g.whiteCap??1,C=a=>{const s=a.map(i=>i*se/.6),o=[.59719*s[0]+.35458*s[1]+.04823*s[2],.076*s[0]+.90834*s[1]+.01566*s[2],.0284*s[0]+.13383*s[1]+.83777*s[2]].map(i=>(i*(i+.0245786)-90537e-9)/(i*(.983729*i+.432951)+.238081));return[1.60475*o[0]-.53108*o[1]-.07367*o[2],-.10208*o[0]+1.10813*o[1]-.00605*o[2],-.00327*o[0]-.07276*o[1]+1.07602*o[2]]},B=a=>{const s=a.slice();for(let o=0;o<600;o++){const i=C(s);let d=0;for(let l=0;l<3;l++)d=Math.max(d,Math.abs(a[l]-i[l])),s[l]=Math.max(0,s[l]+.6*(a[l]-i[l]));if(d<2e-7)break}return s},oe={},G=(a,s=8)=>{const o=a+"/"+s;if(oe[o])return oe[o].clone();const i=new e.Color(a),d=[i.r,i.g,i.b];let l=B(d),w=.3,S=1;if(Math.max(...l)>s){for(let p=0;p<12;p++){const c=(w+S)/2;l=B(d.map(r=>r*c)),Math.max(...l)>s?S=c:w=c}l=B(d.map(p=>p*w))}return(oe[o]=new e.Color().setRGB(l[0]*X,l[1]*X,l[2]*X,e.LinearSRGBColorSpace)).clone()},he=new e.Vector3(...g.light||[-.3,.883,-.36]).normalize(),fe=new e.Vector2(...g.brush||[.94,.34]).normalize(),M={uTime:{value:0},uViewH:{value:720},uFar:{value:g.far??220},uGhost:{value:g.ghost??.72},uWhite:{value:G(u[3],z)},uPaper:{value:G(u[3],z)},uMilk:{value:G(u[4],z)},uCore:{value:g.core??1},uCoat1:{value:G(u[2])},uPruss:{value:G(u[0])},uDeep:{value:G(u[1])},uSens:{value:G(u[5],z)},uGrey:{value:G(u[6],z)},uR1:{value:new e.Vector4(0,1,1e5,0)},uR2:{value:new e.Vector4(0,1,1e5,1.3)},uExpose:{value:1},uSkyRinse:{value:1},uSensAt:{value:new e.Vector3(0,0,-1e4)},uSheet:{value:new e.Vector3(0,0,600)},uBrush:{value:fe},uLight:{value:he},uBand:{value:new e.Vector3(g.band??2.7,0,0)},uStar:{value:new e.Vector4(0,0,0,0)},uSensW:{value:new e.Vector2(12,7)},uE:{value:null},uEWin:{value:new e.Vector3(0,0,1/160)},uETx:{value:1/(g.bufferSize||1024)}},q=(a,s)=>a.replace("//PRE",s.pre||"").replace("//MOVE",s.move||"").replace("//PATTERN",s.pattern?Ze[s.pattern]||s.pattern:"");function T(a={}){const s=a.kind||"card",o={};return s==="thread"?o.SP_THREAD=1:s==="solid"&&(o.SP_SOLID=1),a.small&&(o.SP_SMALL=1),a.map&&(o.SP_MAP=1),new e.ShaderMaterial({defines:o,uniforms:{...M,uK:{value:a.k??3.2},uHollow:{value:a.hollow??0},uA:{value:a.alpha??.3},uTone:{value:a.tone??0},uMap:{value:a.map||null},...a.uniforms||{}},vertexShader:q(it,a),fragmentShader:q(lt,a),transparent:!0,depthWrite:!1,depthTest:!0,blending:e.NormalBlending,side:s==="solid"?e.FrontSide:e.DoubleSide})}function H(a={}){return new e.ShaderMaterial({uniforms:{...M,...a.uniforms||{}},vertexShader:"varying vec3 vWp; void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:`
        uniform sampler2D uE; uniform vec3 uEWin; uniform float uETx; varying vec3 vWp;
        ${Ee}${Pe}${Qe}
        void main(){
          vec2 p = vWp.xz; vec2 e = (p - uEWin.xy) * uEWin.z;             // -0.5..0.5 inside the exposure window
          float inwin = 1. - smoothstep(0.42, 0.5, max(abs(e.x), abs(e.y)));
          vec2 eu = e + .5; float tx = uETx * 0.8;
          vec2 Es = (texture2D(uE, eu).rg * 2. + texture2D(uE, eu + vec2(tx, tx)).rg + texture2D(uE, eu + vec2(-tx, tx)).rg + texture2D(uE, eu + vec2(tx, -tx)).rg + texture2D(uE, eu - vec2(tx, tx)).rg) / 6.;
          float E = mix(1., Es.x, inwin), Ec = mix(1., Es.y, inwin);
          float far = smoothstep(140., 560., length(cameraPosition - vWp));
          gl_FragColor = vec4(sp_paper(p, E, Ec, far, length(cameraPosition - vWp)), 1.);
        }`})}const Se=[];function ke(a=2400){const s=new e.Mesh(new e.SphereGeometry(a,48,24),new e.ShaderMaterial({uniforms:M,side:e.BackSide,depthWrite:!1,depthTest:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`varying vec3 vDir; ${Ee}${Pe}${Qe}
        void main(){ vec3 d = vDir / max(length(vDir), 1e-4); gl_FragColor = vec4(sp_sky(d), 1.); }`}));return s.renderOrder=-10,s.frustumCulled=!1,Se.push(s),s}const K=g.bufferSize||1024,J=g.window||160,f=I.renderer,ne={depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1,minFilter:e.LinearFilter,magFilter:e.LinearFilter,type:e.UnsignedByteType},D=[new e.WebGLRenderTarget(K,K,ne),new e.WebGLRenderTarget(K,K,ne)],ve=new e.BufferGeometry;ve.setAttribute("position",new e.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));const Q=new e.ShaderMaterial({uniforms:{uPrev:{value:null},uScroll:{value:new e.Vector2},uRise:{value:0}},depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = position.xy * .5 + .5; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`uniform sampler2D uPrev; uniform vec2 uScroll; uniform float uRise; varying vec2 vUv;
      void main(){ vec2 q = vUv + uScroll; float inside = step(0., q.x) * step(q.x, 1.) * step(0., q.y) * step(q.y, 1.);
        vec3 e = mix(vec3(1.), texture2D(uPrev, q).rgb, inside); gl_FragColor = vec4(min(vec3(1.), e + uRise), 1.); }`}),ze=new e.Mesh(ve,Q);ze.frustumCulled=!1;const re=new e.Scene;re.add(ze);const N=new e.Scene,Z=new e.Camera,ie={disc:"{ float r = length(vUv - .5) * 2.; den = 1. - smoothstep(1. - uSoft, 1., r); }",flat:"{ den = 1. - smoothstep(1. - uSoft, 1., abs(vUv.x - .5) * 2.); }",star:`{ vec2 q = vUv - .5; float r = length(q) * 2.; float an = (r < 1e-4) ? 0. : atan(q.y, q.x);
      float sp = abs(fract(an * 3.5014 + vPh) - .5) * 2.;                       // 22 spokes
      float spoke = (1. - smoothstep(0.1, 0.1 + uSoft, sp * max(r, .25))) * (1. - smoothstep(0.7, 1., r)) * 0.32;   // (faint: a spoke's streak is gone in a second,
      den = max(max(spoke, 0.05 * (1. - smoothstep(0.3, 1., r))), 1. - smoothstep(0.06, 0.2, r)); }`};function Ve(a={}){return new e.ShaderMaterial({uniforms:{uLight:M.uLight,uEWin:M.uEWin,uTime:M.uTime,uSoft:{value:Math.max(a.soft??.3,.01)},uDen:{value:a.alpha??1},...a.uniforms||{}},vertexShader:q(`uniform vec3 uLight, uEWin; uniform float uTime; varying vec2 vUv; varying float vA; varying float vPh;
        //PRE
        void main(){ vec3 pos = position; vec3 dir = vec3(0., 1., 0.); float alp = 1., wid = 0., pha = 0.;
          #ifdef USE_INSTANCING
          pos = (instanceMatrix * vec4(pos, 1.)).xyz;
          #endif
          //MOVE
          vec4 wp = modelMatrix * vec4(pos, 1.);
          vec2 g = wp.xz - uLight.xz * (max(wp.y, 0.) / max(uLight.y, 0.2));
          vUv = uv; vA = alp; vPh = pha;
          gl_Position = vec4((g - uEWin.xy) * uEWin.z * 2., 0., 1.); }`,a),fragmentShader:`uniform float uSoft, uDen; varying vec2 vUv; varying float vA; varying float vPh;
        void main(){ float den = 1.; ${ie[a.pattern]||a.pattern||""}
          float sh_v = 1. - clamp(den * vA * uDen, 0., 1.);
          gl_FragColor = ${a.chan==="comb"?"vec4(1., sh_v, 1., 1.)":"vec4(sh_v, 1., sh_v, 1.)"}; }`,side:e.DoubleSide,depthTest:!1,depthWrite:!1,transparent:!0,blending:e.CustomBlending,blendEquation:e.MinEquation,blendSrc:e.OneFactor,blendDst:e.OneFactor})}const le=new e.Vector3,pe=new e.Vector3,me=new e.Vector2;let E=0,O=!0,xe=0,we=0,de=0;const F={scene:N,wake:g.wake??4,hold:0,lead:g.lead??45,size:J,texel:J/K,add(a){return a.frustumCulled=!1,N.add(a),a},compileInto(a){if(!f)return;const s=f.getRenderTarget();f.setRenderTarget(D[0]);try{a()}catch{}finally{f.setRenderTarget(s)}},compileCopy(){f&&f.compile&&F.compileInto(()=>f.compile(re,Z))},compile(){f&&f.compile&&F.compileInto(()=>{f.compile(N,Z),f.compile(re,Z)})},get texture(){return D[E].texture},preroll(a,s,o=64,i=1){const d=F.wake;for(let l=o;l>=0;l--)if(s(-d*l/o),F.render(l===o?0:d/o,a),l>0)for(let w=1;w<i;w++)s(-d*(l-w/i)/o),F.stamp()},stamp(){if(!f)return;const a=f.getRenderTarget(),s=f.autoClear;f.autoClear=!1,f.setRenderTarget(D[E]),f.render(N,Z),f.setRenderTarget(a),f.autoClear=s},render(a,s){if(!f)return;s.getWorldPosition(le),s.getWorldDirection(pe);const o=J/K,i=Math.round((le.x+pe.x*F.lead)/o)*o,d=Math.round((le.z+pe.z*F.lead)/o)*o;xe+=(1-F.hold)*Math.min(a,.1)/Math.max(F.wake,.1);const l=Math.floor(xe*255)/255;xe-=l,Q.uniforms.uPrev.value=D[E].texture,Q.uniforms.uScroll.value.set(O?9:(i-we)/J,O?9:(d-de)/J),Q.uniforms.uRise.value=l,we=i,de=d,O=!1,E=1-E,M.uEWin.value.set(i,d,1/J);const w=f.getRenderTarget(),S=f.autoClear;f.autoClear=!1,f.setRenderTarget(D[E]),f.render(re,Z),f.render(N,Z),f.setRenderTarget(w),f.autoClear=S,M.uE.value=D[E].texture}};M.uE.value=D[0].texture;function We(a){let s=0,o=0;for(const x of a)s+=x.pts.length*2,o+=(x.pts.length-1)*6;const i=new Float32Array(s*3),d=new Float32Array(s*3),l=new Float32Array(s*3),w=new Float32Array(s*2),S=s>65535?new Uint32Array(o):new Uint16Array(o);let p=0,c=0;for(const x of a){const V=x.pts,L=V.length,y=x.w??.05,W=x.w1??y,A=x.a??.6,k=x.a1??A;for(let b=0;b<L;b++){const _=V[Math.max(b-1,0)],ee=V[Math.min(b+1,L-1)],R=L>1?b/(L-1):0;let U=ee[0]-_[0],Y=ee[1]-_[1],te=ee[2]-_[2];const ue=Math.hypot(U,Y,te)||1;U/=ue,Y/=ue,te/=ue;for(let P=-1;P<=1;P+=2)i.set(V[b],p*3),d[p*3]=U,d[p*3+1]=Y,d[p*3+2]=te,l[p*3]=P,l[p*3+1]=y+(W-y)*R,l[p*3+2]=A+(k-A)*R,w[p*2]=P*.5+.5,w[p*2+1]=R,p++;if(b<L-1){const P=p-2;S[c++]=P,S[c++]=P+1,S[c++]=P+2,S[c++]=P+1,S[c++]=P+3,S[c++]=P+2}}}const r=new e.BufferGeometry;return r.setAttribute("position",new e.BufferAttribute(i,3)),r.setAttribute("aTan",new e.BufferAttribute(d,3)),r.setAttribute("aSW",new e.BufferAttribute(l,3)),r.setAttribute("uv",new e.BufferAttribute(w,2)),r.setIndex(new e.BufferAttribute(S,1)),r}function Re(a,s,o=12){const i=a.length,d=[],l=[],w=[],S=[],p=new e.Vector3,c=new e.Vector3(1,0,0),r=new e.Vector3,x=new e.Vector3,V=new e.Vector3;for(let y=0;y<i;y++){x.fromArray(a[Math.max(y-1,0)]),V.fromArray(a[Math.min(y+1,i-1)]),p.subVectors(V,x).normalize(),r.crossVectors(p,c),r.lengthSq()<1e-6&&r.set(0,0,1),r.normalize(),c.crossVectors(r,p).normalize();const W=Array.isArray(s)?s[y]:s;for(let A=0;A<=o;A++){const k=A/o*ae,b=Math.cos(k),_=Math.sin(k),ee=c.x*b+r.x*_,R=c.y*b+r.y*_,U=c.z*b+r.z*_;d.push(a[y][0]+ee*W,a[y][1]+R*W,a[y][2]+U*W),l.push(ee,R,U),w.push(A/o,y/(i-1))}if(y<i-1)for(let A=0;A<o;A++){const k=y*(o+1)+A,b=k+o+1;S.push(k,k+1,b,k+1,b+1,b)}}const L=new e.BufferGeometry;return L.setAttribute("position",new e.Float32BufferAttribute(d,3)),L.setAttribute("normal",new e.Float32BufferAttribute(l,3)),L.setAttribute("uv",new e.Float32BufferAttribute(w,2)),L.setIndex(S),L}function ye(a){const s=a.length,o=new Float32Array(s*12),i=new Float32Array(s*12),d=new Float32Array(s*8),l=[];a.forEach((S,p)=>{const{c,u:r,v:x}=S,V=r[1]*x[2]-r[2]*x[1],L=r[2]*x[0]-r[0]*x[2],y=r[0]*x[1]-r[1]*x[0],W=Math.hypot(V,L,y)||1;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([A,k],b)=>{const _=(p*4+b)*3;o[_]=c[0]+r[0]*A+x[0]*k,o[_+1]=c[1]+r[1]*A+x[1]*k,o[_+2]=c[2]+r[2]*A+x[2]*k,i[_]=V/W,i[_+1]=L/W,i[_+2]=y/W,d[(p*4+b)*2]=A*.5+.5,d[(p*4+b)*2+1]=k*.5+.5}),l.push(p*4,p*4+1,p*4+2,p*4,p*4+2,p*4+3)});const w=new e.BufferGeometry;return w.setAttribute("position",new e.BufferAttribute(o,3)),w.setAttribute("normal",new e.BufferAttribute(i,3)),w.setAttribute("uv",new e.BufferAttribute(d,2)),w.setIndex(l),w}function Ae(a,s,o){const i=a.length,d=[];for(let c=0;c<i;c++){const r=Array.isArray(o[0])?o[c]:o,x=(Array.isArray(s)?s[c]:s)*.5;d.push([a[c][0]-r[0]*x,a[c][1]-r[1]*x,a[c][2]-r[2]*x],[a[c][0]+r[0]*x,a[c][1]+r[1]*x,a[c][2]+r[2]*x])}const l=[],w=[],S=[];d.forEach((c,r)=>{l.push(c[0],c[1],c[2]),w.push(r&1,(r>>1)/(i-1))});for(let c=0;c<i-1;c++){const r=c*2;S.push(r,r+1,r+2,r+1,r+3,r+2)}const p=new e.BufferGeometry;return p.setAttribute("position",new e.Float32BufferAttribute(l,3)),p.setAttribute("uv",new e.Float32BufferAttribute(w,2)),p.setIndex(S),p.computeVertexNormals(),p}return{palette:h,ink:G,uniforms:M,light:he,density:T,paper:H,makeSky:ke,shadow:Ve,exposure:F,threads:We,tube:Re,cards:ye,blade:Ae,patterns:Ze,glsl:{noise:Ee,front:Pe},rinse(a,s,o,i){const d=(a===2?M.uR2:M.uR1).value,l=Math.hypot(s,o)||1;d.x=s/l,d.y=o/l,d.z=i},update(a,s,o){M.uTime.value=s,f&&(f.getDrawingBufferSize(me),M.uViewH.value=me.y),o.getWorldPosition(le);for(const i of Se)i.position.copy(le);F.render(a,o)},dispose(){D[0].dispose(),D[1].dispose(),ve.dispose(),Q.dispose(),N.traverse(a=>{a.geometry&&a.geometry.dispose(),a.material&&a.material.dispose()})}}}async function ht(I,g={}){const u=I.rng,$=Math.min(1,Math.max(.6,g.detail??I.quality?.detail??1)),X=!g.style,h=g.style||ut(I,{palette:g.palette}),se=new e.Group,z=new e.Group;se.add(z);const C=g.heartY??22,B=1.5,oe=.7,G=5,he=oe+G,fe=1.2,M=180,q=g.exit||[-42,20,54],T=g.passRadius??26,H=g.passY??20,Se=new e.Vector3(0,C,0),ke=u.range(0,ae),K=u.range(.6,1.7),J=u.range(-.5,.5),f=[],ne=[],D=22,ve=C-B*.55;for(let t=0;t<=D;t++){const n=t/D,v=Math.sin(Math.PI*n)*K+Math.sin(ae*n)*J;f.push([Math.cos(ke)*v,ve*n,Math.sin(ke)*v]),ne.push(.82+.34*Math.pow(1-n,6)+.5*Math.pow(n,14))}const Q=h.tube(f,ne,14),ze=new e.Mesh(Q,h.density({kind:"solid",k:2.4,hollow:.74}));z.add(ze);const re=[];for(let t=0;t<9;t++){const n=t/9*ae+u.range(-.1,.1),v=[];for(let m=0;m<=D;m+=2)v.push([f[m][0]+Math.cos(n)*ne[m]*.97,f[m][1],f[m][2]+Math.sin(n)*ne[m]*.97]);re.push({pts:v,w:.045,a:.5})}const N=new e.SphereGeometry(B,28,18);N.scale(1,.88,1),N.translate(0,C,0);const Z=new e.Mesh(N,h.density({kind:"solid",k:1.6}));z.add(Z);const ie=[],Ve=Math.PI*(3-Math.sqrt(5)),le=u.range(0,ae);for(let t=0;t<M;t++){const n=1-(t+.5)/M*1.8,v=Math.sqrt(Math.max(0,1-n*n)),m=t*Ve+le,j=new e.Vector3(Math.cos(m)*v+u.range(-.035,.035),n+u.range(-.035,.035),Math.sin(m)*v+u.range(-.035,.035)).normalize();ie.push(j)}const pe=[],me=new e.Vector3(0,1,0),E=new e.Vector3,O=new e.Vector3;for(const t of ie){E.crossVectors(Math.abs(t.y)>.95?new e.Vector3(1,0,0):me,t).normalize(),O.crossVectors(t,E);const n=[t.x*B*1.02,C+t.y*B*.9,t.z*B*1.02],v=.2;pe.push({c:n,u:[E.x*v,E.y*v,E.z*v],v:[O.x*v,O.y*v,O.z*v]})}const xe=new e.Mesh(h.cards(pe),h.density({kind:"card",alpha:.08,pattern:"ring"}));z.add(xe),await I.yield();const we=u.int(13,18),de=[];for(let t=0;t<we;t++){const n=t/we*ae+u.range(-.12,.12),v=Math.cos(n),m=Math.sin(n),j=u.range(2.4,3.6),ce=u.range(.75,1.1),Me=[],Xe=[],Ke=6;for(let Ue=0;Ue<=Ke;Ue++){const be=Ue/Ke,Je=1.05+Math.sin(be*1.9)*j*.42,ot=-.5-(be*be*ce+be*.25)*j*.8;Me.push([v*Je,C+ot-B*.3,m*Je]),Xe.push(.62*Math.sin(Math.PI*(.12+.88*be))+.02)}de.push(h.blade(Me,Xe,[-m,0,v]))}const F=nt(de);de.forEach(t=>t.dispose());const We=new e.Mesh(F,h.density({kind:"card",alpha:.3,pattern:"vein",move:"pos.xz += pos.xz / max(length(pos.xz), 1e-3) * 0.12 * sin(uTime * 0.9 + pos.y * 1.7 + atan(pos.z, pos.x + 1e-4) * 3.) * uv.y;"}));z.add(We);const Re=new e.Mesh(h.threads(re),h.density({kind:"thread"}));z.add(Re),await I.yield();const ye=Math.round(90*$),Ae=Math.min(.95,.78*90/ye),a=u.range(64,72),s=[];s.push({pts:[[0,0,0],[0,.3,0]],w:.07,w1:.2,a:.95},{pts:[[0,.3,0],[0,oe,0]],w:.2,w1:.045,a:.95}),s.push({pts:[0,1,2,3].map(t=>[.1*Math.sin(Math.PI*t/3),oe+G*t/3,0]),w:.045,w1:.03,a:.8});for(let t=0;t<ye;t++){const n=(t+u())/ye*ae,v=(a+u.range(0,16))*Math.PI/180,m=fe*u.range(.86,1.06),j=Math.cos(n)*Math.sin(v),ce=Math.cos(v),Me=Math.sin(n)*Math.sin(v);s.push({pts:[[j*.03,he+ce*.03,Me*.03],[j*m,he+ce*m,Me*m]],w:.034,w1:.018,a:Ae,a1:Ae*.75})}const o=h.threads(s),i=new e.Vector3(q[0],0,q[2]).normalize(),d=Math.min(M,g.shedCount??70),l=ie.map((t,n)=>({i:n,s:t.dot(i)+.35*t.y*(1-Math.abs(t.y))+u.range(0,.22)})).sort((t,n)=>n.s-t.s),w=new Float32Array(M).fill(1e4);l.slice(0,d).map(t=>({i:t.i,k:t.s+u.range(0,.3)})).sort((t,n)=>n.k-t.k).forEach((t,n)=>{w[t.i]=5.4*Math.pow(n/Math.max(d-1,1),.6)+(n?u.range(-.04,.04):0)});const p=u.int(0,9),c=new e.Vector3(u.range(-1,1),u.range(.1,1),u.range(-1,1)).normalize();ie.map((t,n)=>({i:n,s:t.dot(c)})).sort((t,n)=>n.s-t.s).slice(0,p).forEach(t=>{w[t.i]>1e3&&(w[t.i]=-1e3)});const r=new Float32Array(M*4),x=new e.Matrix4,V=new e.Vector3,L=new e.Vector3,y={uShed:{value:-1},uLaneA:{value:new e.Vector3},uLaneW:{value:new e.Vector3},uLaneL:{value:60},uTipY:{value:he}},W=`
    attribute vec4 aSeed;   // (release time s, phase, lane offset sideways m, lane offset up m)
    uniform float uShed, uLaneL, uTipY; uniform vec3 uLaneA, uLaneW;
    vec3 sp_fly(vec3 c0, vec3 ax, float tf, vec4 sd){
      float lift = 1.4 * (1. - exp(-tf * 1.6));                       // pulls free along its own beak
      float d = 13. * (tf - 1.5 * (1. - exp(-tf / 1.5)));             // then the air takes it, up to 13 m/s
      vec3 side = vec3(-uLaneW.z, 0., uLaneW.x), rel = c0 + ax * lift - uLaneA;
      float s0 = dot(rel, uLaneW); vec3 l0 = rel - uLaneW * s0;
      float along = s0 + d, b = smoothstep(0., 44., d);
      vec3 lt = (side * sd.z + vec3(0., sd.w, 0.)) * mix(1., 0.42, smoothstep(uLaneL - 34., uLaneL, along));
      vec3 lat = mix(l0, lt, b);
      lat.y += 4.5 * sin(3.14159 * b) * step(0., -sd.z * dot(l0, side));    // those that must cross our line go over it
      float ph = sd.y * 6.283;
      lat += (side * sin(tf * 0.9 + ph) + vec3(0., sin(tf * 1.3 + ph * 2.), 0.)) * 0.5 * min(tf * .5, 1.);
      return uLaneA + uLaneW * along + lat;
    }`,A=`
    float tf = uShed - aSeed.x, ph = aSeed.y * 6.283, sy = length(instanceMatrix[1].xyz);
    vec3 home = instanceMatrix[3].xyz, ax = instanceMatrix[1].xyz / max(sy, 1e-4), rel0 = pos - home;
    float tr = (0.012 + 0.06 * smoothstep(-1.4, 0., tf)) * sin(uTime * (1.3 + aSeed.y) + ph);   // trembles before it goes
    pos += cross(vec3(uLaneW.z, 0., -uLaneW.x), rel0) * tr + cross(vec3(0., 1., 0.), rel0) * 0.012 * sin(uTime * 0.7 + ph * 3.);
    if (tf > 0.) {
      vec3 q = position - vec3(0., uTipY, 0.); q.y *= sy;                 // seed-local, about the star's centre
      vec3 ay = mix(ax, vec3(0.14 * sin(tf * 1.1 + ph), 1., 0.14 * cos(tf * 0.9 + ph)), smoothstep(0.1, 2.4, tf));
      ay = ay / max(length(ay), 1e-3);                                    // the beak tips to hang below its star
      vec3 ex = instanceMatrix[0].xyz; ex = ex - ay * dot(ex, ay); ex = ex / max(length(ex), 1e-3);
      vec3 ez = cross(ex, ay);
      float spin = tf * (0.5 + aSeed.y) * (aSeed.y > .5 ? 1. : -1.), cs = cos(spin), sn = sin(spin);
      vec3 q2 = vec3(q.x * cs - q.z * sn, q.y, q.x * sn + q.z * cs), t2 = vec3(aTan.x * cs - aTan.z * sn, aTan.y, aTan.x * sn + aTan.z * cs);
      vec3 c = sp_fly(home + ax * uTipY * sy, ax, tf, aSeed);
      pos = c + ex * q2.x + ay * q2.y + ez * q2.z; dir = ex * t2.x + ay * t2.y + ez * t2.z;
      alp *= 1. - smoothstep(uLaneL - 1., uLaneL + 2.5, dot(c - uLaneA, uLaneW));     // gone through the ring
    }`,k=new e.InstancedMesh(o,h.density({kind:"thread",tone:.2,pre:W,move:A,uniforms:y}),M);for(let t=0;t<M;t++){const n=ie[t],v=u.range(0,ae),m=u.range(.9,1.07);E.crossVectors(Math.abs(n.y)>.95?V.set(1,0,0):me,n).normalize(),O.crossVectors(n,E),V.copy(E).multiplyScalar(Math.cos(v)).addScaledVector(O,Math.sin(v)),L.crossVectors(V,n),x.makeBasis(V,n.clone().multiplyScalar(m),L).setPosition(n.x*B*.97,C+n.y*B*.86,n.z*B*.97),k.setMatrixAt(t,x);const j=u.range(-.5,Math.PI+.5),ce=u.range(3.6,10.5);r.set([w[t],u(),Math.cos(j)*ce,Math.sin(j)*ce*.75+.8],t*4)}const b=new e.InstancedBufferAttribute(r,4);o.setAttribute("aSeed",b),k.frustumCulled=!1,z.add(k),await I.yield();const _=Math.hypot(q[0],q[2]),ee=Math.atan2(q[2],q[0]),R=ee-Math.acos(Math.min(1,T/_)),U=new e.Vector3(Math.cos(R)*T,H,Math.sin(R)*T),Y=new e.Vector3(-Math.sin(R),0,Math.cos(R)),te=Math.sqrt(Math.max(1,_*_-T*T));y.uLaneA.value.copy(U),y.uLaneW.value.copy(Y),y.uLaneL.value=te;const ue=[[T,H,-75],[T,H,-40],[T,H,-14]];for(let t=0;t<R-.05;t+=.2)ue.push([Math.cos(t)*T,H,Math.sin(t)*T]);ue.push(U.toArray(),U.clone().addScaledVector(Y,te*.35).toArray(),U.clone().addScaledVector(Y,te*.7).toArray(),[q[0],q[1],q[2]]),await I.yield();const P=h.light,et=new e.Vector3(-P.x*C/P.y,0,-P.z*C/P.y),Ce=t=>h.cards([{c:[0,0,0],u:[t,0,0],v:[0,0,t]}]),Be=Ce(fe*1.12);Be.setAttribute("aSeed",b);const Ie=new e.InstancedMesh(Be,h.shadow({pattern:"star",soft:.3,alpha:.9,pre:W,uniforms:y,move:`
    float tf = uShed - aSeed.x, sy = length(instanceMatrix[1].xyz), spin = 0.;
    vec3 ax = instanceMatrix[1].xyz / max(sy, 1e-4), c = instanceMatrix[3].xyz + ax * uTipY * sy;
    if (tf > 0.) { c = sp_fly(c, ax, tf, aSeed); spin = tf * (0.5 + aSeed.y) * (aSeed.y > .5 ? 1. : -1.);
      alp *= 1. - smoothstep(uLaneL - 1., uLaneL + 2.5, dot(c - uLaneA, uLaneW)); }
    float cs = cos(spin), sn = sin(spin);
    pos = c + vec3(position.x * cs - position.z * sn, 0., position.x * sn + position.z * cs); pha = aSeed.y * 7.;
    alp *= 0.7 * (1. - smoothstep(0., 0.6, tf));`}),M);Ie.instanceMatrix=k.instanceMatrix;const tt=`float tf = uShed - aSeed.x, sy = length(instanceMatrix[1].xyz), fa = 0., spin = 0.;
    vec3 ax = instanceMatrix[1].xyz / max(sy, 1e-4), c0 = instanceMatrix[3].xyz + ax * uTipY * sy, c = c0;
    if (tf > 0.) { c = sp_fly(c0, ax, tf, aSeed); spin = tf * (0.5 + aSeed.y) * (aSeed.y > .5 ? 1. : -1.);
      fa = smoothstep(0.25, 1., tf) * (1. - smoothstep(uLaneL - 1., uLaneL + 2.5, dot(c - uLaneA, uLaneW))); }`,_e=28,ge=new e.BufferGeometry;{const t=[],n=[];for(let v=0;v<=_e;v++)if(t.push(-1,0,v/_e,1,0,v/_e),v<_e){const m=v*2;n.push(m,m+1,m+2,m+1,m+3,m+2)}ge.setAttribute("position",new e.Float32BufferAttribute(t,3)),ge.setIndex(n),ge.setAttribute("aSeed",b)}const He={uSpan:{value:h.exposure.wake},uWake:{value:h.exposure.wake},uCloud:{value:new e.Vector2(1e4,0)}},Le=new e.InstancedMesh(ge,new e.ShaderMaterial({transparent:!0,depthTest:!1,depthWrite:!1,side:e.DoubleSide,uniforms:{...y,...He,uLight:h.uniforms.uLight,uPaper:h.uniforms.uPaper,uMilk:h.uniforms.uMilk,uViewH:h.uniforms.uViewH},vertexShader:`uniform vec3 uLight; uniform float uViewH, uSpan, uWake; uniform vec2 uCloud; varying float vA; varying float vX; ${W}
      vec3 sp_track(vec3 c0, vec3 ax, float t, vec4 sd){ vec3 cl = sp_fly(c0, ax, max(t, 0.), sd), c = (modelMatrix * vec4(cl, 1.)).xyz; float ly = max(uLight.y, 0.2);
        return vec3(c.x - uLight.x * max(c.y, 0.) / ly, dot(cl - uLaneA, uLaneW), c.z - uLight.z * max(c.y, 0.) / ly); }       // (ground x, metres down the lane, ground z)
      void main(){
        float tf = uShed - aSeed.x, sy = length(instanceMatrix[1].xyz);
        vec3 ax = instanceMatrix[1].xyz / max(sy, 1e-4), c0 = instanceMatrix[3].xyz + ax * uTipY * sy;
        float age = position.z * uSpan, t0 = tf - age;
        vec3 g0 = sp_track(c0, ax, t0, aSeed), g1 = sp_track(c0, ax, t0 + 0.12, aSeed);
        vec4 p0 = projectionMatrix * viewMatrix * vec4(g0.x, 0.03, g0.z, 1.), p1 = projectionMatrix * viewMatrix * vec4(g1.x, 0.03, g1.z, 1.);
        float asp = projectionMatrix[1][1] / max(projectionMatrix[0][0], 1e-4), front = step(0.5, p0.w) * step(0.5, p1.w);
        vec2 dd = (p1.xy / max(p1.w, 0.5) - p0.xy / max(p0.w, 0.5)) * vec2(asp, 1.); float dl = length(dd);
        dd = dl > 1e-6 ? dd / dl : vec2(0., 1.);
        float pxm = uViewH * 0.5 * projectionMatrix[1][1] / max(p0.w, 0.5), wpx = clamp(0.3 * pxm, 1.25, 1.5) + 0.85;       // (+0.9: the soft edge)
        vec2 off = vec2(-dd.y, dd.x) * position.x * wpx / max(uViewH, 1.);
        float fresh = 1. - clamp(age / max(uWake, 0.1), 0., 1.);
        float held = uCloud.y * step(tf - age, uCloud.x) * (1. - smoothstep(uSpan * 0.9, uSpan, age));
        float a = max(fresh * (0.75 + 0.25 * fresh) * (1. - smoothstep(uLaneL - 15., uLaneL - 3., g0.y)), 0.8 * held);      // (a sinking line tapers out before the ring, where they all close up: seen end-on there they would stack into bars; what the cloud holds runs right under it)
        a *= smoothstep(0.3, 1.5, t0) * (1. - smoothstep(uLaneL - 1., uLaneL + 2.5, g0.y)) * front * smoothstep(7., 16., p0.w);      // (a line passing under our own feet is not drawn: it would be a bold bar cut by the frame)
        float mine = step(aSeed.x, 1e3) * step(0., tf) * step(0.42, aSeed.y);     // (three seeds in five draw a line, so there is blue between one line and the next where they close on the ring)                    // (a seed that never flies, or has not gone yet, draws nothing: the whole ribbon is put out of the picture)
        vA = a * mine; vX = position.x;
        gl_Position = mine > 0.5 ? p0 + vec4(off.x / asp, off.y, 0., 0.) * p0.w : vec4(2., 2., 2., 1.); }`,fragmentShader:`uniform vec3 uPaper, uMilk; uniform float uViewH; varying float vA; varying float vX;
      void main(){ float a = vA * (1. - smoothstep(0.35, 1., abs(vX))) * smoothstep(0.03, 0.075, gl_FragCoord.y / max(uViewH, 1.));
        gl_FragColor = vec4(mix(uMilk, uPaper, smoothstep(0.3, 0.75, a)), a); }`}),M);Le.instanceMatrix=k.instanceMatrix,Le.frustumCulled=!1,Le.userData.onPaper=!0,z.add(Le);const Ne=Ce(fe);Ne.setAttribute("aSeed",b);const qe=new e.InstancedMesh(Ne,new e.ShaderMaterial({transparent:!0,depthTest:!1,depthWrite:!1,side:e.DoubleSide,uniforms:{...y,uLight:h.uniforms.uLight,uPaper:h.uniforms.uPaper,uMilk:h.uniforms.uMilk},vertexShader:`uniform vec3 uLight; varying vec2 vUv; varying float vA; varying float vPh; ${W}
      void main(){ ${tt}
        float cs = cos(spin), sn = sin(spin);
        vec4 wp = modelMatrix * vec4(c + vec3(position.x * cs - position.z * sn, 0., position.x * sn + position.z * cs), 1.);
        vec2 g = wp.xz - uLight.xz * (max(wp.y, 0.) / max(uLight.y, 0.2));
        vUv = uv; vPh = aSeed.y * 7.;
        vec4 cw = modelMatrix * vec4(c, 1.); vec2 cg = cw.xz - uLight.xz * (max(cw.y, 0.) / max(uLight.y, 0.2));
        vec4 cc = projectionMatrix * viewMatrix * vec4(cg.x, 0.03, cg.y, 1.);
        vA = fa * smoothstep(-0.95, -0.86, cc.y / max(cc.w, 1e-3));          // a star whose centre is at the lower edge of the picture is not drawn cut in half
        gl_Position = projectionMatrix * viewMatrix * vec4(g.x, 0.03, g.y, 1.); }`,fragmentShader:`uniform vec3 uPaper, uMilk; varying vec2 vUv; varying float vA; varying float vPh;
      void main(){ vec2 q = (vUv - .5) * 2.; float r = length(q); float an = (r < 1e-4) ? 0. : atan(q.y, q.x);
        float sv = abs(fract(an * 1.7507 + vPh) - .5) * 2. * max(r, .2);       // eleven rays: few enough to stay drawn at a grazing angle
        vec2 qdx = dFdx(q), qdy = dFdy(q); float lp = max(fwidth(q.x), fwidth(q.y));
        float dk = 3.5 * (abs(q.x * qdx.y - q.y * qdx.x) + abs(q.x * qdy.y - q.y * qdy.x)) / max(r * r, 2e-3);
        float sw = min(max(r, .2) * dk + sv / max(r, .2) * fwidth(r), 0.5) * 0.7 + 0.01, und = smoothstep(0.55, 1.3, dk);
        float spoke = mix((1. - smoothstep(0.05 - sw * 0.2, 0.05 + sw, sv)) * min(1., 0.09 / max(sw, 0.09) + 0.3), 0.2, und) * (1. - smoothstep(0.6, 1., r));
        float eye = 1. - smoothstep(0.13, 0.17 + lp * 1.5, r);
        float al = max(spoke * 0.9, eye) * vA;                               // (the print's own half-tone: milk at part density, paper where it is solid; never a grey)
        gl_FragColor = vec4(mix(uMilk, uPaper, smoothstep(0.25, 0.7, al)), al); }`}),M);qe.instanceMatrix=k.instanceMatrix,qe.frustumCulled=!1,qe.userData.onPaper=!0,z.add(qe);const Oe={uWn:{value:new e.Vector2(i.x,i.z)},uGone:{value:0}},De=Ce(8.9);De.translate(0,C,0);const Fe=new e.Mesh(De,h.shadow({uniforms:Oe,pattern:`{ vec2 q = (vUv - .5) * 2.; float r = length(q);
    float an = (r < 1e-4) ? 0. : atan(q.y, q.x), tooth = 1. - abs(fract(an * 4.7746) - .5) * 2.; float re = mix(0.66, 1., tooth * tooth);   // thirty points: the rim is the outermost stars' rays
    float body = 0.46 * (1. - smoothstep(re - 0.1, re, r)) + 0.16 * (1. - smoothstep(0., 0.8, r));
    body *= 1. - 0.8 * uGone * smoothstep(-0.25, 0.5, dot(q, uWn) / max(r, 1e-3));
    den = max(body, 1. - smoothstep(0.16, 0.25, r)); }`.replace("{","{ ")}));Fe.material.fragmentShader=Fe.material.fragmentShader.replace("uniform float uSoft, uDen;","uniform float uSoft, uDen, uGone; uniform vec2 uWn;");const at=new e.Mesh(Q,h.shadow({pattern:"{ den = 0.92; }"})),Te=[Ie,Fe,at];for(const t of Te)t.matrixAutoUpdate=!1,h.exposure.add(t);if(X||g.backdrop){const t=new e.Mesh(new e.CircleGeometry(1400,48),h.paper());t.rotation.x=-Math.PI/2,t.renderOrder=-.4,se.add(t),h.uniforms.uSheet.value.z=g.sheetRadius??1150;const n=h.makeSky();n.renderOrder=-.5,se.add(n)}X&&h.exposure.compile(),await I.yield();const st=11;let Ge=!1,Ye=-1e3;const je=t=>t*.75%13-3.5,$e={object:se,radius:11,height:C+9,center:new e.Vector3(0,C-3,0),ground:!1,groundY:0,style:h,anchors:{heart:Se.clone(),globeRadius:8.1,shadowCentre:et,portalSeat:{position:new e.Vector3(q[0],q[1],q[2]),facing:Y.clone().negate()},flyThrough:ue.map(t=>new e.Vector3(t[0],t[1],t[2])),lane:{start:U.clone(),dir:Y.clone(),length:te},wind:Y.clone(),viewpoints:{reveal:new e.Vector3(T,H,-75),blaze:new e.Vector3(T,H,-45),swing:new e.Vector3(Math.cos(R*.5)*T,H,Math.sin(R*.5)*T)}},setShed(t){Ge=!0,y.uShed.value=t},comb:He,setProgress(t){$e.setShed(-1+Math.min(1,Math.max(0,t))*(st+1))},update(t,n,v){X&&(Ge||(y.uShed.value=je(n)),h.rinse(2,.5,-.86,-70+n*7%210)),Oe.uGone.value=Math.min(1,Math.max(0,y.uShed.value/5.5)),z.rotation.x=.01*Math.sin(n*.53)+.004*Math.sin(n*1.31),z.rotation.z=.012*Math.sin(n*.41+1.3)+.004*Math.sin(n*1.07),se.updateMatrixWorld(!0);for(const m of Te)m.matrix.copy(z.matrixWorld),m.matrixWorld.copy(z.matrixWorld);X&&(Math.abs(n-Ye)>1&&h.exposure.preroll(v,m=>{Ge||(y.uShed.value=je(n+m)),h.uniforms.uTime.value=n+m}),Ye=n,h.update(t,n,v))},dispose(){if(X)h.dispose();else for(const t of Te)h.exposure.scene.remove(t);Be.dispose(),De.dispose(),ge.dispose(),Te.forEach(t=>t.material.dispose())}};return $e}export{ht as buildHero,ut as makeStyle};
