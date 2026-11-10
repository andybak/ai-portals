import*as k from"three";import{clamp as ae,lerp as he}from"../kit/core.js";const V=Math.PI*2,Q=t=>{const e=new k.Color(t);return[e.r,e.g,e.b]},pe=(t,e)=>[t[0]*e,t[1]*e,t[2]*e],de=(t,e,a)=>[t[0]+(e[0]-t[0])*a,t[1]+(e[1]-t[1])*a,t[2]+(e[2]-t[2])*a],b={PLAIN:0,CANVAS:1,WICKER:2,WOOD:3,METAL:4,STRIPE:5,LEAF:6,WATER:7,CLOTH:8,ROPE:9,CHAIN:10,GLASS:11,SKIN:12},Oe={hemp:Q("#d9c8a0"),hempDark:Q("#a8946a"),iron:Q("#3b3f46"),tar:Q("#4a4034"),canvas:[Q("#a8522a"),Q("#d19a3a"),Q("#3d6b8f"),Q("#c9b68a"),Q("#8c4a3a"),Q("#5a8a9a"),Q("#b8763a")],wicker:Q("#8c6a43"),plank:Q("#7a5c3c"),plankPale:Q("#9c8460"),copper:Q("#b86a3c"),brass:Q("#c9a04a"),leaf:Q("#5a9a52"),leafDark:Q("#2a5a34"),lamp:Q("#ffcf7a"),cream:Q("#e8dcc0"),skin:Q("#5a3a28")},qe={zA:0,zB:-540,yA:0,yB:28,sag:62,wA:24,wM:74,wB:5,dish:12,bow:0,cell:1.7,lanes:2,cross:12};function Fe(t){const e={...qe,...t},a=e.zA-e.zB,o=y=>(e.zA-y)/a,s=y=>{const u=ae(y,0,1),C=he(e.wA,e.wB,u);return C+(e.wM-C)*Math.pow(Math.max(Math.sin(Math.PI*u),0),.7)},h=y=>e.bow*Math.sin(Math.PI*ae(y,0,1)),n=y=>he(e.yA,e.yB,y)-e.sag*4*y*(1-y),i=(y,u)=>n(y)+e.dish*Math.sin(Math.PI*ae(y,0,1))*u*u,d=(y,u)=>{const C=ae(o(u),0,1);return(y-h(C))/Math.max(s(C),1)},r=(y,u)=>i(ae(o(u),0,1),d(y,u)),g=(y,u,C=[0,0,0])=>(C[0]=h(y)+u*s(y),C[1]=i(y,u),C[2]=e.zA-y*a,C);return{N:e,L:a,sOf:o,tOf:d,half:s,cx:h,yC:n,yST:i,y:r,at:g,inside:(y,u,C=0)=>{const p=o(u);return p<0||p>1?!1:Math.abs(y-h(p))<s(p)-C},frame:(y,u)=>{const C=g(y-.002,u),p=g(y+.002,u),S=g(y,u-.01),O=g(y,u+.01),f=new k.Vector3(p[0]-C[0],p[1]-C[1],p[2]-C[2]).normalize(),l=new k.Vector3(O[0]-S[0],O[1]-S[1],O[2]-S[2]).normalize(),c=new k.Vector3().crossVectors(l,f).normalize();return c.y<0&&c.negate(),{f,r:l,up:c}},uniforms:()=>({uNetA:{value:new k.Vector4(e.zA,1/a,e.yA,e.yB)},uNetB:{value:new k.Vector4(e.sag,e.wA,e.wM,e.wB)},uNetC:{value:new k.Vector4(e.dish,e.bow,e.wM/e.cell,a/e.cell)},uNetD:{value:new k.Vector4(e.lanes,e.cross,a,e.cell)}})}}const J={amp0:.02,ampG:.055,along:1.35,across:.45,heave0:.15,heaveG:.3,flut0:.45,flutG:.9,lean0:.012,leanG:.03,gBase:.16,gPeak:.84,gMax:1,gWidth:.3},ie=t=>t.toFixed(4),ue=`
uniform float uTime, uPix;
uniform vec4 uGustF;                      // x fronts per metre along the wind, y fronts per second, z the drawn phase, w the fronts' seed
uniform vec4 uWind;                       // xy unit direction, z radians per metre, w radians per second
uniform vec4 uNetA, uNetB, uNetC, uNetD;  // see makeNetFn.uniforms
float hash11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash12(i), hash12(i + vec2(1.,0.)), f.x), mix(hash12(i + vec2(0.,1.)), hash12(i + vec2(1.,1.)), f.x), f.y); }
float netS(float z){ return clamp((uNetA.x - z) * uNetA.y, 0., 1.); }
float netHalf(float s){ float e = mix(uNetB.y, uNetB.w, s); return e + (uNetB.z - e) * pow(clamp(sin(3.14159265 * s), 0., 1.), 0.7); }
float netCx(float s){ return uNetC.y * sin(3.14159265 * s); }
float netT(vec2 xz, float s){ return (xz.x - netCx(s)) / max(netHalf(s), 1.); }
float netY(vec2 xz){ float s = netS(xz.y); float t = clamp(netT(xz, s), -1.3, 1.3);
  return mix(uNetA.z, uNetA.w, s) - uNetB.x * 4. * s * (1. - s) + uNetC.x * sin(3.14159265 * s) * t * t; }
float gustPhase(vec2 xz){ return dot(xz, uWind.xy) * uWind.z - uTime * uWind.w; }
float gustF(vec2 xz){
  float c = dot(xz, uWind.xy) * uGustF.x - uTime * uGustF.y + uGustF.z, b = sin(3.14159265 * clamp(fract(c) / ${ie(J.gWidth)}, 0., 1.));
  return ${ie(J.gBase)} + ${ie(J.gPeak)} * (0.55 + 0.45 * hash11(floor(c) + uGustF.w)) * b * b;
}
float heave(vec2 xz){ float ph = gustPhase(xz), sr = (uNetA.x - xz.y) * uNetA.y; return ((${ie(J.heave0-.05)} + ${ie(J.heaveG)} * gustF(xz)) * sin(ph * 1.7 + 0.8) + 0.05 * sin(ph * 4.3 + uTime * 0.7)) * smoothstep(0., 0.07, sr) * (1. - smoothstep(0.93, 1., sr)); }
vec2 swayAng(vec3 pv, float seed){
  float ph = gustPhase(pv.xz);
  float g = 0.62 * sin(ph) + 0.38 * sin(ph * 0.43 + 1.7);
  float own = sin(uTime * (0.9 + 0.7 * fract(seed * 7.13)) + seed * 40.);
  float amp = ${ie(J.amp0)} + ${ie(J.ampG)} * gustF(pv.xz);
  return vec2(amp * (g + ${ie(J.along-1)} * own), amp * ${ie(J.across)} * sin(ph * 0.71 + seed * 11. + uTime * 0.53));
}
vec3 rotAx(vec3 v, vec3 a, float t){ float c = cos(t), s = sin(t); return v * c + cross(a, v) * s + a * dot(a, v) * (1. - c); }
vec3 swayRot(vec3 v, vec2 ang){ v = rotAx(v, vec3(uWind.y, 0., -uWind.x), ang.x); return rotAx(v, vec3(uWind.x, 0., uWind.y), ang.y); }
vec3 qrot(vec4 q, vec3 v){ return v + 2. * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
// a train of lines at the integers, each 'duty' wide (in cells), seen through a box filter 'w' wide: exact, so no moire
float pulse(float x, float duty, float w){
  w = max(w, 1e-3); x += 0.5 * duty;
  float a = x - 0.5 * w, b = x + 0.5 * w;
  return clamp(((floor(b) * duty + min(fract(b), duty)) - (floor(a) * duty + min(fract(a), duty))) / w, 0., 1.);
}
// how much of the net covers point (s, t): fine diamond mesh, catwalk lanes, cross walks. blur in metres.
float netCover(float s, float t, float half_, float blur){
  float a = s * uNetC.w + t * uNetC.z, b = s * uNetC.w - t * uNetC.z;
  float bw = blur / uNetD.w;
  float mesh = max(pulse(a, 0.085, bw), pulse(b, 0.085, bw)) * 0.6;
  mesh = max(mesh, max(pulse(a * 0.5, 0.085, bw * 0.5), pulse(b * 0.5, 0.085, bw * 0.5)));
  float lane = pulse(t * uNetD.x, 1.7 * uNetD.x / max(half_, 1.), blur * uNetD.x / max(half_, 1.));
  float cross_ = pulse(s * uNetD.y, 1.7 * uNetD.y / uNetD.z, blur * uNetD.y / uNetD.z);
  float walks = max(lane, cross_) * 0.7;
  return max(mesh * 0.9, walks) * step(abs(t), 1.) ;
}
`,we=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uFogCol, uLampCol;
uniform float uFogDen, uLampK, uLantern;
uniform vec4 uMist;                        // rgb colour, a amount (the rare cloud through the city)
uniform float uShadeG[32];                 // the first mountain's shadow: the highest sun ray it cuts, on 32 lines across the sun's bearing
uniform vec4 uShadeP;                      // toward the sun in plan (x, z), tan of its elevation, 1 / the lines' spacing
uniform vec2 uShadeQ;                      // the first line's offset, the edge's softness (m)
uniform vec4 uHoles[4];                    // x, z, radius of the hatches through the mesh
// LIGHT BY PLACE. How far a point stands in the net's own shade: 0 in the open air, 1 well under the mesh and inside
// its outline (a rule of place in world space: the net and the town above cut the sky and half the sun)
float underNet(vec3 p){
  float sr = (uNetA.x - p.z) * uNetA.y, s = clamp(sr, 0., 1.), tt = netT(p.xz, s);
  float inside = smoothstep(0., 0.05, sr) * (1. - smoothstep(0.95, 1., sr)) * (1. - smoothstep(0.86, 1.04, abs(tt)));
  return inside * smoothstep(2., 10., netY(p.xz) - p.y);
}
// 1 where the sun's own ray to p comes down through a hatch: the shafts of sun in the town's shade
float shaftLit(vec3 p){
  float k = 1. / max(uSunDir.y, 0.25), t = (netY(p.xz) - p.y) * k; vec3 q = p + uSunDir * t; t += (netY(q.xz) - q.y) * k; q = p + uSunDir * t;
  float l = 0.; for (int i = 0; i < 4; i++) l = max(l, 1. - smoothstep(uHoles[i].z - 1.5, uHoles[i].z + 0.5, length(q.xz - uHoles[i].xy)));
  return l;
}
// 1 in the sun, 0 in the shade of the first mountain
float sunShadeW(vec3 p, float soft){
  float k = clamp((-p.x * uShadeP.y + p.z * uShadeP.x - uShadeQ.x) * uShadeP.w, 0., 30.999);
  int i = int(floor(k));
  float H = (p.x * uShadeP.x + p.z * uShadeP.y) * uShadeP.z + mix(uShadeG[i], uShadeG[i + 1], k - float(i));
  return smoothstep(-soft, soft, p.y - H);
}
float sunShade(vec3 p){ return sunShadeW(p, uShadeQ.y); }
// sun reaching a point under the net: the lattice's own shadow, softer with depth
float netShadow(vec3 p){
  float k = 1. / max(uSunDir.y, 0.25);
  float t = (netY(p.xz) - p.y) * k;
  vec3 q = p + uSunDir * t;
  t += (netY(q.xz) - q.y) * k;
  if (t < 0.15) return 1.;
  q = p + uSunDir * t;
  float s = netS(q.z), h = netHalf(s), tt = netT(q.xz, s);
  float edge = smoothstep(0., 0.04, s) * (1. - smoothstep(0.96, 1., s));
  float c = netCover(s, tt, h, 0.16 + t * 0.022);
  return 1. - 0.86 * c * edge;
}
vec3 applyFog(vec3 col, vec3 emis, vec3 w){
  float d = length(w - cameraPosition);
  float f = 1. - exp(-d * d * uFogDen * uFogDen);
  col = mix(col, uFogCol, clamp(f, 0., 1.));
  float m = uMist.a * (1. - exp(-d * 0.034)) * (0.8 + 0.2 * vnoise(vec2(w.x + w.z, w.y - uTime * 5.) * 0.07));
  col = mix(col, uMist.rgb, clamp(m, 0., 1.));
  return col + emis * (1. - 0.6 * clamp(f + m, 0., 1.));
}
`,Le=`
attribute vec4 color;          // rgb albedo, a = how much this vertex flutters (cloth, vines) or heaves (cables)
attribute vec4 aMat;           // x: 1 = the rope above the thing (unit length, stretched to the drop), y emissive, z thin-tube radius, w pattern
#ifdef HUNG
attribute vec3 iPivot;         // the point it sways from
attribute vec3 iAt;            // from the pivot to the thing's own top
attribute vec4 iQuat;
attribute vec4 iPar;           // rope length above the top, scale, seed, motion (0..1 travels up and down its string, <0 turns, >=2 walks)
attribute vec4 iTint;          // rgb tint, a = own swing
#endif
varying vec3 vW; varying vec3 vN; varying vec3 vO; varying vec4 vCol; varying vec4 vMat; varying vec4 vTint; varying float vSeed;
${ue}
void main(){
  vec3 p = position, n = normal; float rad = aMat.z;
#ifdef HUNG
  float rope = iPar.x, sc = iPar.y, seed = iPar.z, mo = iPar.w;
  float trav = (mo > 0. && mo <= 1.) ? mo * (0.5 + 0.5 * sin(uTime * (0.2 + 0.22 * fract(seed * 3.7)) + seed * 50.)) : 0.;
  vec3 lp;
  if (aMat.x > 0.5) lp = vec3(0., p.y > 1. ? max(rope * (1. - trav) - (2. - p.y), 0.) : p.y * rope * (1. - trav), 0.);
  else { lp = p * sc; rad *= sc; }
  vO = lp;
  float fl = color.a;
  float G = gustF(iPivot.xz);
  if (fl > 0.) lp += fl * sc * (${ie(J.flut0)} + ${ie(J.flutG)} * G) * 0.4 * vec3(sin(uTime * 2.3 + p.y * 1.9 + seed * 20.), 0.25 * sin(uTime * 3.1 + p.x * 2.3 + seed * 7.), cos(uTime * 1.9 + p.y * 2.3 + p.x + seed * 31.));
  if (mo < 0.) { float a = uTime * -mo + seed * 6.28; float c = cos(a), s = sin(a); lp = vec3(c * lp.x + s * lp.z, lp.y, -s * lp.x + c * lp.z); n = vec3(c * n.x + s * n.z, n.y, -s * n.x + c * n.z); }
  if (iTint.a > 0.) { float a = iTint.a * sin(uTime * (1.2 + fract(seed * 5.3)) + seed * 17.); float c = cos(a), s = sin(a); lp = vec3(lp.x, c * lp.y - s * lp.z, s * lp.y + c * lp.z); n = vec3(n.x, c * n.y - s * n.z, s * n.y + c * n.z); }
  if (mo >= 2.) lp.x += (mo - 2.) * sin(uTime * 0.11 + seed * 30.);
  lp = qrot(iQuat, lp); n = qrot(iQuat, n);
  vec3 rel = iAt + vec3(0., rope * trav, 0.) + lp;
  if (aMat.w > 6.5 && aMat.w < 7.5) rel.xz += uWind.xy * (${ie(J.lean0)} + ${ie(J.leanG)} * G) * lp.y * lp.y;      // falling water leans downwind, more the farther it has fallen
  vec2 ang = swayAng(iPivot, seed);
  rel = swayRot(rel, ang); n = swayRot(n, ang);
  vec3 wc = iPivot + rel; wc.y += heave(iPivot.xz);
  vTint = iTint; vSeed = seed;
#else
  vO = p; vec3 wc = p; wc.y += heave(p.xz) * color.a; vTint = vec4(1.); vSeed = 0.;
#endif
  wc = (modelMatrix * vec4(wc, 1.)).xyz; n = normalize(mat3(modelMatrix) * n + vec3(0., 1e-6, 0.));
  if (rad > 0.) wc += n * rad;                                       // a rope is as thick as it is, at any distance
  vW = wc; vN = n; vCol = color; vMat = aMat;
  gl_Position = projectionMatrix * viewMatrix * vec4(wc, 1.);
}`,Te=`
varying vec3 vW; varying vec3 vN; varying vec3 vO; varying vec4 vCol; varying vec4 vMat; varying vec4 vTint; varying float vSeed;
${ue}
${we}
float lineAA(float d, float hw, float px){ px = max(px, 1e-4); return clamp((hw - d) / px + 0.5, 0., 1.) * clamp(2. * hw / px, 0., 1.); }
void main(){
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-5, 0.));
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(N, V) < 0.) N = -N;
  float pat = vMat.w; vec3 alb = vCol.rgb, tint = vTint.rgb; float spec = 0., gloss = 30., trans = 0., lantern = 0., rimK = 0.35, thru = 0., sheen = 0.;
  float px = clamp(length(fwidth(vO)), 1e-4, 4.);
#ifndef HUNG
  if ((pat > 0.5 && pat < 1.5) || (pat > 4.5 && pat < 5.5)) tint = vCol.rgb;       // a canvas or an awning of the static mesh carries its own colour
#endif
  if (pat < 0.5) { }
  else if (pat < 1.5) {                                   // stitched, patched canvas in gores
    float ang = atan(vO.z, vO.x + 1e-5), R = max(length(vO.xz), 0.05);
    float ga = ang / 6.2831853 * 8., pw = 6.2831853 * R / 8., gid = floor(ga + 100.);
    float h1 = hash11(gid * 1.37 + vSeed * 91.);
    alb = mix(tint, vec3(dot(tint, vec3(0.3, 0.5, 0.2))) * vec3(1.12, 1., 0.8), 0.24) * (0.86 + 0.2 * h1);
    alb = mix(alb, mix(vec3(0.56, 0.5, 0.37), tint * 0.6, hash11(gid * 5.7 + vSeed * 3.)), step(0.86, hash11(gid * 3.1 + vSeed * 17.)) * 0.6);
    vec2 pc = vec2(ga * 2., vO.y / max(pw * 0.5, 0.1)) + vSeed * 7.; vec2 ci = floor(pc), cf = fract(pc);
    float inP = step(0.8, hash12(ci)) * step(0.12, cf.x) * step(cf.x, 0.88) * step(0.15, cf.y) * step(cf.y, 0.85) * clamp(0.5 * pw / px, 0., 1.);
    vec3 pcol = hash12(ci + 3.7) < 0.22 ? mix(vec3(0.2, 0.32, 0.42), vec3(0.5, 0.27, 0.16), step(0.5, hash12(ci + 5.3))) : vec3(0.56, 0.5, 0.37);
    alb = mix(alb, pcol * (0.6 + 0.5 * hash12(ci + 9.1)), inP * 0.85);
    alb *= 1. - 0.35 * inP * (1. - step(0.17, cf.x) * step(cf.x, 0.83) * step(0.2, cf.y) * step(cf.y, 0.8)) * clamp(0.03 * 8. / px, 0., 1.);
    float ds = (0.5 - abs(fract(ga) - 0.5)) * pw;
    alb *= 1. - 0.5 * lineAA(ds, 0.04, px);
    float band = lineAA(abs(fract(vO.y * 0.31 + vSeed * 3.) - 0.5), 0.07, px * 0.31) * step(0.55, hash11(vSeed * 71.));
    alb = mix(alb, vec3(0.78, 0.7, 0.52), band * 0.6);
    alb *= 1. + (vnoise(vec2(ga * 70., vO.y * 16.)) - 0.5) * 0.3 * clamp(0.05 / px, 0., 1.);
    alb *= 0.8 + 0.3 * smoothstep(-7., 0., vO.y);
    trans = 0.45; lantern = 0.55 + 0.45 * h1;
  } else if (pat < 2.5) {                                 // wicker
    float ang = atan(vO.z, vO.x + 1e-5), R = max(length(vO.xz), 0.05);
    vec2 w = vec2(ang * R * 7., vO.y * 9.); float k = clamp(0.06 / px, 0., 1.);
    float wv = step(0.5, fract(w.x + 0.5 * step(0.5, fract(w.y))));
    alb *= 1. + (wv - 0.5) * 0.5 * k; alb *= 0.9 + 0.2 * hash11(vSeed * 13.);
  } else if (pat < 3.5) {                                 // weathered wood
    alb *= (0.8 + 0.4 * vnoise(vec2(vO.x * 2.1 + vSeed * 9., (vO.z + vO.y) * 22.))) * (0.85 + 0.3 * hash11(vSeed * 57.));
    alb = mix(alb, alb * tint, 0.4 + 0.5 * step(0.95, min(vCol.r, min(vCol.g, vCol.b)))); sheen = 0.35;
  } else if (pat < 4.5) {                                   // copper, brass; grey iron rusts in patches
    float iron = 1. - smoothstep(0.03, 0.09, max(vCol.r, max(vCol.g, vCol.b)) - min(vCol.r, min(vCol.g, vCol.b)));
    float rust = smoothstep(0.42, 0.7, vnoise(vO.xy * 2.7 + vO.z * 2.1 + vSeed * 20.) * 0.7 + 0.3 * vnoise(vO.yz * 11. + vO.x * 9.));
    alb = mix(alb, vec3(0.4, 0.19, 0.09) * (0.7 + 0.6 * vnoise(vO.xz * 13.)), rust * iron * 0.8);
    spec = 1.1 * (1. - 0.75 * rust * iron); gloss = 36.; alb *= 0.85 + 0.3 * vnoise(vO.xy * 9. + vO.z * 7.); sheen = 1.;
  }
  else if (pat < 5.5) {                                   // striped awning
    float st = pulse(vO.x * 0.8 + 0.25, 0.5, px * 0.8);
    alb = mix(tint, vec3(0.82, 0.76, 0.6), st) * (0.9 + 0.2 * vnoise(vO.xz * 5.)); trans = 0.6;
  } else if (pat < 6.5) {                                 // leaves
    alb *= 0.8 + 0.3 * vnoise(vO.xy * 5. + vO.z * 3. + vSeed * 30.); alb = mix(alb, alb.grb * vec3(0.9, 0.8, 0.5), 0.3 * hash11(vSeed * 37.)) * 1.25; trans = 0.45; thru = 0.6;
  } else if (pat < 7.5) {                                 // a shower: bright drops falling in a fan that widens and thins; no stipple
    float dep = clamp(-vO.y / 7., 0., 1.), ang = atan(vO.z, vO.x + 1e-5);
    vec2 dc = vec2(ang * 4.8, (vO.y + uTime * (5. + 2. * fract(vSeed * 3.1))) * 1.1 + vSeed * 9.), di = floor(dc), df = fract(dc);
    float drop = step(hash12(di + vSeed * 17.), 0.78 - 0.66 * dep) * step(abs(df.x - 0.5), 0.15 + 0.1 * dep) * step(0.08, df.y) * step(df.y, 0.8);
    if (drop * (1. - smoothstep(0.9, 1., dep)) < 0.5) discard;
    alb = vec3(0.82, 0.92, 1.) * (1.2 + 0.6 * df.y); spec = 2.; gloss = 12.; trans = 0.8;
  } else if (pat < 8.5) { trans = 0.7; alb *= 0.92 + 0.16 * vnoise(vO.xy * 30.) * clamp(0.04 / px, 0., 1.); alb = mix(alb, alb * tint, vTint.r < 0.999 || vTint.g < 0.999 ? 1. : 0.); }   // cloth
  else if (pat < 9.5) {                                   // hemp rope: a twist
    float tw = sin(dot(vO, vec3(17., 23., 17.)) + dot(N, vec3(4., 2., 5.)));
    alb *= 0.62 * (0.74 + 0.2 * tw * clamp(0.05 / px, 0., 1.)); rimK = 0.5; sheen = 0.55;
  } else if (pat < 10.5) {                                  // a chain seen as a line: links alternate, iron with rust
    float lk = step(0.5, fract(dot(vO, vec3(0.9, 0.9, 0.9)))), kk = clamp(0.6 / px, 0., 1.);
    alb = mix(alb * 1.5, vec3(0.4, 0.2, 0.1), 0.45 * vnoise(vO.xz * 1.7 + vO.y * 1.3)) * (0.8 + 0.45 * lk * kk); spec = 0.7; gloss = 24.; rimK = 0.6; sheen = 1.;
  }
  else if (pat < 11.5) { spec = 0.8; gloss = 60.; }       // glass
  else { spec = 0.35; gloss = 14.; alb *= 0.85 + 0.3 * vnoise(vO.xy * 6. + vO.z * 5.); }                 // skins of water
  float un = underNet(vW), shaft = shaftLit(vW);
  float ndl = dot(N, uSunDir), sh = netShadow(vW) * sunShade(vW) * mix(1., mix(0.58, 1.12, shaft), un);       // under the net: half the sun, the whole of it in a hatch's shaft
  float under = 0.6 + 0.4 * smoothstep(-0.8, 0.2, N.y);                 // every hung thing shades its own underside
  vec3 skyL = mix(uGndCol, uSkyCol, N.y * 0.5 + 0.5) * mix(vec3(1.), vec3(0.7, 0.86, 1.14), un);              // the net's shade is cooler than the open air
  vec3 light = uSunCol * clamp(ndl * 0.82 + 0.18, 0., 1.) * sh + skyL * under * (1. + thru) + uLampCol * un * (0.05 + 0.1 * uLantern);      // and the lamps' warm light fills it a little at every hour
  light += uSunCol * trans * clamp(-ndl, 0., 1.) * sh * 0.5;
  vec3 col = alb * light;
  // the sun from the side or behind catches the edge of sacks and the fibres of ropes
  float back = clamp(0.55 - 0.9 * dot(V, uSunDir), 0., 1.4), fres = 1. - clamp(dot(N, V), 0., 1.);
  col += uSunCol * (alb * 0.75 + 0.05) * (fres * fres * fres) * back * sh * (0.5 + trans) + uSunCol * alb * rimK * back * sh * 0.22;
  vec3 H = normalize(V + uSunDir);
  col += uSunCol * spec * pow(clamp(dot(N, H), 0., 1.), gloss) * sh * 0.5;
  col += alb * uSkyCol * pow(1. - clamp(dot(N, V), 0., 1.), 3.) * 0.3;
  // iron, chain, rope and wood take the sky's light: on their upper side, and as a rim at grazing angles (a rule of
  // the material, everywhere), so a chain or a ladder against the bright cloud has form and is never a flat dark shape
  col += uSkyCol * sheen * (0.16 * smoothstep(-0.1, 0.9, N.y) + (0.3 + 0.7 * smoothstep(-0.3, 0.5, N.y)) * fres * fres * 0.75);
  float flick = 0.86 + 0.14 * sin(uTime * (7. + 5. * fract(vSeed * 9.7)) + vSeed * 80.) * sin(uTime * 2.3 + vSeed * 31.);
  vec3 emis = uLampCol * vMat.y * uLampK * flick;
  emis += uLampCol * alb * lantern * uLantern * (0.7 + 0.6 * (1. - smoothstep(-5., -1., vO.y))) * flick;
  gl_FragColor = vec4(applyFog(col, emis, vW), 1.);
}`,He=`
attribute vec2 aST;
varying vec2 vST; varying vec3 vW; varying vec3 vN;
${ue}
void main(){
  vec3 wc = position; wc.y += heave(wc.xz);
  wc = (modelMatrix * vec4(wc, 1.)).xyz;
  vST = aST; vW = wc; vN = mat3(modelMatrix) * normal;
  gl_Position = projectionMatrix * viewMatrix * vec4(wc, 1.);
}`,Ie=`
varying vec2 vST; varying vec3 vW; varying vec3 vN;
uniform vec3 uHemp;
${ue}
${we}
void main(){
  float s = vST.x, t = vST.y;
  float a = s * uNetC.w + t * uNetC.z, b = s * uNetC.w - t * uNetC.z;
  vec2 wp = vec2(vnoise(vec2(a, b) * 0.19), vnoise(vec2(b, a) * 0.19 + 7.3)) - 0.5;
  a += wp.x * 1.05; b += wp.y * 1.05;
  vec2 wq = vec2(vnoise(vec2(a, b) * 0.61 + 3.1), vnoise(vec2(b, a) * 0.61 + 9.4)) - 0.5;      // no two cells alike
  a += wq.x * 0.32; b += wq.y * 0.32;
  float wa = clamp(fwidth(a), 1e-4, 8.), wb = clamp(fwidth(b), 1e-4, 8.);
  // THE NET IS ROPE: every strand sags between its knots (bowed, each by its own amount; nothing at the knots themselves),
  // the main ropes differ in thickness, and the fine strands are drawn a little soft so they never thin to a ruled hairline
  float a2 = a + (hash12(vec2(floor(a + 0.5), floor(b))) - 0.3) * 0.22 * sin(3.14159265 * fract(b));
  float b2 = b + (hash12(vec2(floor(a), floor(b + 0.5)) + 7.7) - 0.3) * 0.22 * sin(3.14159265 * fract(a));
  float ha = mix(0.18 + 0.95 * hash11(floor(a + 0.5) * 3.71), 0.66, clamp(wa * 1.5, 0., 1.)), hb = mix(0.18 + 0.95 * hash11(floor(b + 0.5) * 5.13 + 2.), 0.66, clamp(wb * 1.5, 0., 1.));
  float m = max(pulse(a2, 0.034, wa * 1.8) * ha, pulse(b2, 0.034, wb * 1.8) * hb);
  float mb = max(pulse(a2 * 0.5, 0.034 + 0.026 * hash11(floor(a * 0.5 + 0.5) * 1.9), wa * 0.5), pulse(b2 * 0.5, 0.034 + 0.026 * hash11(floor(b * 0.5 + 0.5) * 2.3 + 5.), wb * 0.5));
  float m2 = max(pulse(a2 * 4., 0.06, wa * 4.), pulse(b2 * 4., 0.06, wb * 4.));
  float knot = pulse(a * 0.5, 0.1, wa * 0.5) * pulse(b * 0.5, 0.1, wb * 0.5);
  float mend = smoothstep(0.6, 0.74, vnoise(vec2(a, b) * 0.055 + 3.7));        // patches where the mesh has been mended closer
  float cov = max(max(max(m * 0.85, mb), knot), m2 * (0.24 + 0.5 * mend));
  cov *= 0.72 + 0.28 * smoothstep(0.25, 0.6, vnoise(vec2(b, a) * 0.031 + 11.));
  for (int i = 0; i < 4; i++) cov *= smoothstep(uHoles[i].z, uHoles[i].z + 0.7, length(vW.xz - uHoles[i].xy));
  cov *= smoothstep(0., 0.012, s) * (1. - smoothstep(0.988, 1., s));
  if (cov < 0.004) discard;
  float up = step(0., dot(vN, cameraPosition - vW));
  cov = mix(clamp(cov * 1.25, 0., 1.), cov, up);
  vec3 Vn = normalize(cameraPosition - vW + vec3(0., 1e-5, 0.));
  float thru = clamp(dot(-Vn, uSunDir), 0., 1.); thru *= thru; thru *= thru;       // looking up toward the sun through the mesh
  vec3 light = uSunCol * mix(0.36 + 1.3 * thru, 0.62, up) * (0.12 + 0.88 * sunShade(vW)) + mix(uGndCol, uSkyCol, 0.5 + 0.5 * (up * 2. - 1.) * 0.7) * mix(0.75, 1., up);
  vec3 col = uHemp * mix(vec3(1.2, 0.82, 0.42), vec3(0.78, 0.62, 0.38), up) * light * (0.6 + 0.45 * vnoise(vec2(a, b) * 0.37)) * mix(0.64, 1., max(mb, knot));
  col *= mix(vec3(0.74, 0.66, 0.52), vec3(1.05), smoothstep(0.25, 0.75, vnoise(vec2(a, b) * 0.043 + 5.)));     // older, tarred stretches and newer ones
  gl_FragColor = vec4(applyFog(col, vec3(0.), vW), clamp(cov, 0., 1.));
}`,Ke=`
attribute vec3 iPivot; attribute vec3 iAt; attribute vec4 iPar; attribute vec3 iCol;
varying vec2 vUv; varying vec3 vCol; varying float vFog;
${ue}
uniform float uFogDen;
void main(){
  vec3 rel = swayRot(iAt, swayAng(iPivot, iPar.y));
  vec3 wc = iPivot + rel; wc.y += heave(iPivot.xz);
  vec4 mv = viewMatrix * modelMatrix * vec4(wc, 1.);
  float d = max(-mv.z, 0.1);
  float size = max(iPar.x, 2.2 * uPix / projectionMatrix[1][1] * d);   // never under 2.2 pixels of the lens that is drawing; the light borrowed is paid back in vCol
  mv.xy += position.xy * size; mv.z += min(0.5, d * 0.3);
  vUv = position.xy;
  float flick = 0.85 + 0.15 * sin(uTime * (7. + 5. * fract(iPar.y * 9.7)) + iPar.y * 80.) * sin(uTime * 2.3 + iPar.y * 31.);
  vCol = iCol * flick * (iPar.x / size) * (iPar.x / size) * clamp(d / 2.5 - 0.3, 0., 1.);
  vFog = exp(-d * d * uFogDen * uFogDen);
  gl_Position = projectionMatrix * mv;
}`,Ve=`
varying vec2 vUv; varying vec3 vCol; varying float vFog;
uniform float uLampK;
void main(){
  float r2 = clamp(dot(vUv, vUv), 0., 1.);
  float g = (exp(-r2 * 6.) * 0.55 + exp(-r2 * 46.) * 1.6) * (1. - r2) * (1. - r2);
  gl_FragColor = vec4(vCol * g * uLampK * (0.35 + 0.65 * vFog), 1.);
}`,bt={height:(t,e)=>6.5*t*(.8+.5*(e*3.3%1)),leanMax:(.45+.75*(J.gBase+J.gPeak))*1.15,leanMin:(.45+.75*J.gBase)*.85,at:(t,e,a)=>[t*a*(1-.22*a*e),e*t*a*a],half:(t,e)=>t*(.14+1.25*e)+.28*t*e},_e=`
attribute vec3 iPivot; attribute vec3 iAt; attribute vec4 iPar;
varying vec2 vUv; varying float vSeed; varying vec3 vW;
${ue}
void main(){
  float seed = iPar.y, v = position.y;
  vec3 base = iPivot + swayRot(iAt, swayAng(iPivot, seed)); base.y += heave(iPivot.xz);
  float H = 6.5 * iPar.x * (0.8 + 0.5 * fract(seed * 3.3));
  float lean = (0.45 + 0.75 * gustF(iPivot.xz)) * (0.85 + 0.3 * sin(gustPhase(iPivot.xz)));
  vec3 wd = vec3(uWind.x, 0., uWind.y);
  vec3 c = base + vec3(0., H * v * (1. - 0.22 * v * lean), 0.) + wd * (lean * H * v * v);
  c.xz += 0.28 * iPar.x * v * vec2(sin(uTime * 1.3 + v * 5. + seed * 40.), cos(uTime * 1.1 + v * 4. + seed * 23.));
  c = (modelMatrix * vec4(c, 1.)).xyz;
  vec3 tg = normalize(vec3(0., 1., 0.) + wd * (2. * lean * v));
  vec3 sd = normalize(cross(tg, normalize(cameraPosition - c)) + vec3(1e-5, 0., 0.));
  c += sd * position.x * iPar.x * (0.14 + 1.25 * v);
  vUv = vec2(position.x, v); vSeed = seed; vW = c;
  gl_Position = projectionMatrix * viewMatrix * vec4(c, 1.);
}`,Ue=`
varying vec2 vUv; varying float vSeed; varying vec3 vW;
${ue}
${we}
void main(){
  float n = 0.4 + 0.6 * vnoise(vec2(vUv.x * 1.5 + vSeed * 10., vUv.y * 4.5 - uTime * 0.6 + vSeed * 3.));
  float e = clamp(1. - vUv.x * vUv.x, 0., 1.);
  float h = clamp(1. - vUv.y, 0., 1.);
  float a = e * e * smoothstep(0., 0.06, vUv.y) * h * sqrt(h) * n * 0.62 * (1. - uMist.a);
  vec3 col = (uSunCol * 0.5 * sunShade(vW) + uSkyCol + uGndCol * 0.6) * vec3(0.78, 0.79, 0.82) + uLampCol * 0.1 * uLantern * h;
  float d = length(vW - cameraPosition);
  col = mix(col, uFogCol, clamp(1. - exp(-d * d * uFogDen * uFogDen), 0., 1.));
  gl_FragColor = vec4(col, clamp(a, 0., 1.));
}`,xt=new k.Matrix4,Mt=new k.Vector3,kt=new k.Quaternion,Ct=new k.Euler;class ${constructor(){this.P=[],this.N=[],this.C=[],this.M=[],this.I=[],this.col=[1,1,1],this.flex=0,this.pat=0,this.emis=0,this.isRope=0,this.m=null,this.sc=1,this.stack=[]}set(e,a=0,o=0){return this.col=e,this.pat=a,this.emis=o,this}push(e=0,a=0,o=0,s=0,h=0,n=0,i=1){const d=new k.Matrix4().compose(new k.Vector3(e,a,o),new k.Quaternion().setFromEuler(new k.Euler(h,s,n,"YXZ")),new k.Vector3(i,i,i));return this.stack.push([this.m,this.sc]),this.m=this.m?this.m.clone().multiply(d):d,this.sc*=i,this}pop(){const e=this.stack.pop();return this.m=e[0],this.sc=e[1],this}v(e,a,o,s,h,n,i=0,d=this.flex){if(this.m){const r=this.m.elements,g=r[0]*e+r[4]*a+r[8]*o+r[12],P=r[1]*e+r[5]*a+r[9]*o+r[13],z=r[2]*e+r[6]*a+r[10]*o+r[14],v=r[0]*s+r[4]*h+r[8]*n,y=r[1]*s+r[5]*h+r[9]*n,u=r[2]*s+r[6]*h+r[10]*n,C=Math.hypot(v,y,u)||1;e=g,a=P,o=z,s=v/C,h=y/C,n=u/C,i*=this.sc}return this.P.push(e,a,o),this.N.push(s,h,n),this.C.push(this.col[0],this.col[1],this.col[2],d),this.M.push(this.isRope,this.emis,i,this.pat),this.P.length/3-1}tri(e,a,o){this.I.push(e,a,o)}quad(e,a,o,s){this.I.push(e,a,o,e,o,s)}lathe(e,a,o={}){const s=e.length,h=[];for(let n=0;n<s;n++){const i=e[Math.max(0,n-1)],d=e[Math.min(s-1,n+1)],r=d[0]-i[0],g=d[1]-i[1],P=Math.hypot(r,g)||1,z=-g/P,v=r/P;for(let y=0;y<=a;y++){const u=y/a*V,C=o.flute?o.flute(u,n):1,p=Math.cos(u),S=Math.sin(u);h.push(this.v(p*e[n][0]*C*(o.sx??1),e[n][1],S*e[n][0]*C,p*z,v,S*z))}}for(let n=0;n<s-1;n++)for(let i=0;i<a;i++){const d=h[n*(a+1)+i],r=h[n*(a+1)+i+1],g=h[(n+1)*(a+1)+i+1],P=h[(n+1)*(a+1)+i];this.quad(d,r,g,P)}return this}box(e,a,o,s,h,n,i=""){const d=(r,g,P,z,v)=>{const y=[g,P,z,v].map(u=>this.v(u[0],u[1],u[2],r[0],r[1],r[2]));this.quad(y[0],y[1],y[2],y[3])};return i.includes("y")||d([0,-1,0],[e,a,o],[s,a,o],[s,a,n],[e,a,n]),i.includes("Y")||d([0,1,0],[e,h,o],[e,h,n],[s,h,n],[s,h,o]),i.includes("x")||d([-1,0,0],[e,a,o],[e,a,n],[e,h,n],[e,h,o]),i.includes("X")||d([1,0,0],[s,a,o],[s,h,o],[s,h,n],[s,a,n]),i.includes("z")||d([0,0,-1],[e,a,o],[e,h,o],[s,h,o],[s,a,o]),i.includes("Z")||d([0,0,1],[e,a,n],[s,a,n],[s,h,n],[e,h,n]),this}sweep(e,a,o,s,h=!1){const n=e.length,i=[],d=new k.Vector3,r=new k.Vector3,g=new k.Vector3,P=new k.Vector3;for(let v=0;v<n;v++){const y=e[h?(v-1+n)%n:Math.max(0,v-1)],u=e[h?(v+1)%n:Math.min(n-1,v+1)],C=e[v];d.set(u[0]-y[0],u[1]-y[1],u[2]-y[2]).normalize(),P.set(0,1,0),Math.abs(d.y)>.9&&P.set(1,0,0),r.crossVectors(d,P).normalize(),g.crossVectors(d,r);const p=Array.isArray(a)?a[v]:a;for(let S=0;S<o;S++){const O=S/o*V,f=Math.cos(O),l=Math.sin(O),c=r.x*f+g.x*l,m=r.y*f+g.y*l,w=r.z*f+g.z*l;i.push(s?this.v(C[0],C[1],C[2],c,m,w,p):this.v(C[0]+c*p,C[1]+m*p,C[2]+w*p,c,m,w))}}const z=h?n:n-1;for(let v=0;v<z;v++)for(let y=0;y<o;y++){const u=(v+1)%n,C=(y+1)%o;this.quad(i[v*o+y],i[v*o+C],i[u*o+C],i[u*o+y])}return this}rope(e,a=.03,o=4){return this.sweep(e,a,o,!0)}pole(e,a=.06,o=6){return this.sweep(e,a,o,!1)}ropeUp(e=.035,a=Oe.hemp,o=4){const s=this.col,h=this.pat,n=this.emis;return this.set(a,b.ROPE),this.isRope=1,this.rope([[0,0,0],[0,1,0]],e,o),this.sweep([[0,1.55,0],[0,1.66,0],[0,2,0]],[e,e*2.2,e*2.2],o,!0),this.isRope=0,this.set(s,h,n),this}disc(e,a,o,s,h,n=1){const i=this.v(e,a,o,0,n,0),d=[];for(let r=0;r<=h;r++){const g=r/h*V;d.push(this.v(e+Math.cos(g)*s,a,o+Math.sin(g)*s,0,n,0))}for(let r=0;r<h;r++)this.tri(i,d[r],d[r+1]);return this}ball(e,a,o,s,h,n,i=7,d=4){const r=[];for(let g=0;g<=d;g++){const P=g/d*Math.PI,z=Math.sin(P),v=Math.cos(P);for(let y=0;y<=i;y++){const u=y/i*V,C=Math.cos(u)*z,p=Math.sin(u)*z;r.push(this.v(e+C*s,a+v*h,o+p*n,C,v,p))}}for(let g=0;g<d;g++)for(let P=0;P<i;P++){const z=g*(i+1)+P;this.quad(r[z],r[z+1],r[z+i+2],r[z+i+1])}return this}sheet(e,a,o){const s=[],h=[];for(let i=0;i<=a;i++)for(let d=0;d<=e;d++)h.push(o(d/e,i/a));const n=(i,d)=>h[ae(d,0,a)*(e+1)+ae(i,0,e)];for(let i=0;i<=a;i++)for(let d=0;d<=e;d++){const r=n(d-1,i),g=n(d+1,i),P=n(d,i-1),z=n(d,i+1),v=n(d,i),y=g[0]-r[0],u=g[1]-r[1],C=g[2]-r[2],p=z[0]-P[0],S=z[1]-P[1],O=z[2]-P[2];let f=u*O-C*S,l=C*p-y*O,c=y*S-u*p;const m=Math.hypot(f,l,c)||1;s.push(this.v(v[0],v[1],v[2],f/m,l/m,c/m,0,v[3]??this.flex))}for(let i=0;i<a;i++)for(let d=0;d<e;d++){const r=i*(e+1)+d;this.quad(s[r],s[r+1],s[r+e+2],s[r+e+1])}return this}discZ(e,a,o=0){const s=this.v(0,0,o,0,0,1),h=[];for(let n=0;n<=a;n++){const i=n/a*V;h.push(this.v(Math.cos(i)*e,Math.sin(i)*e,o,0,0,1))}for(let n=0;n<a;n++)this.tri(s,h[n],h[n+1]);return this}ring(e,a,o,s=10,h=4,n=!1){const i=[];for(let d=0;d<s;d++){const r=d/s*V;i.push([Math.cos(r)*a,e,Math.sin(r)*a])}return this.sweep(i,o,h,n,!0)}get triangles(){return this.I.length/3}toGeometry(){const e=new k.BufferGeometry,a=this.P.length/3;return e.setAttribute("position",new k.Float32BufferAttribute(this.P,3)),e.setAttribute("normal",new k.Float32BufferAttribute(this.N,3)),e.setAttribute("color",new k.Float32BufferAttribute(this.C,4)),e.setAttribute("aMat",new k.Float32BufferAttribute(this.M,4)),e.setIndex(a>65535?new k.Uint32BufferAttribute(this.I,1):new k.Uint16BufferAttribute(this.I,1)),e}}const M=Oe;function ne(t,e={}){const a=new $,o=e.H??6,s=e.R??2.4,h=e.segs??10,n=e.rows??9,i=.9+o*.08,d=s*.2,r=e.shape??"pear",g=!!e.far,P=l=>{let c=Math.pow(Math.sin(Math.PI*Math.pow(l,r==="round"?1.25:1.7)),r==="round"?.6:.56);return r==="gourd"&&(c*=1-.3*Math.exp(-(((l-.46)/.1)**2))),Math.max(c,l<.5?d/s*(1+2*l):0)},z=t.range(-.05,.05);a.ropeUp(e.small?.05:s>4?.15:.1,void 0,g?3:4),a.set(M.hemp,b.ROPE);const v=g?e.small?0:3:e.small?3:5;for(let l=0;l<v;l++){const c=l/v*V+.3;a.rope([[0,0,0],[Math.cos(c)*d*1.05,-i,Math.sin(c)*d*1.05]],.045,3)}a.set([1,1,1],b.CANVAS);const y=[];for(let l=0;l<n;l++){const c=l/(n-1);y.push([s*P(c),-i-c*o])}y[n-1][0]=0,a.lathe(y,h,{flute:(l,c)=>{const m=c/(n-1);return 1+.11*Math.cos(8*l)*Math.pow(1-m,1.5)+z*Math.cos(l+1)*m+.035*Math.cos(3*l+m*5)*m}}),g||(a.set(M.hempDark,b.ROPE),a.ring(-i-.05,d*1.12,.07,5,3),a.rope([[0,-i-o,0],[.05,-i-o-.7,.03]],.05,3));const u=(l,c,m=1)=>{const w=s*P(l)*m;return[Math.cos(c)*w,-i-l*o,Math.sin(c)*w]},C=[],p=e.windows??2,S=t.range(0,V);for(let l=0;l<p;l++){const c=S+l*V/p+t.range(-.4,.4),m=t.range(.52,.72),w=(e.small?.34:.5)*t.range(.85,1.2),x=u(m,c,.985);if(a.push(x[0],x[1],x[2],-c+Math.PI/2,0),a.set(M.lamp,b.GLASS,1.5),a.discZ(w,g?6:8,.06),g){a.pop(),C.push([x[0]*1.08,x[1],x[2]*1.08]);continue}a.set(M.plank,b.WOOD);const T=[];for(let N=0;N<=8;N++){const E=N/8*V,K=Math.cos(E),_=Math.sin(E);T.push(a.v(K*w,_*w,.1,0,0,1),a.v(K*(w+.11),_*(w+.11),.07,0,0,1))}for(let N=0;N<8;N++)a.quad(T[N*2],T[N*2+1],T[N*2+3],T[N*2+2]);a.box(-w,-.03,.07,w,.03,.11,"xXyY"),a.box(-.03,-w,.07,.03,w,.11,"xXyY"),a.pop(),C.push([x[0]*1.08,x[1],x[2]*1.08])}let O=null;if(!e.small){const l=S+1.3,c=u(.36,l,.9),m=[Math.cos(l),Math.sin(l)];a.set(M.iron,b.METAL);const w=[c[0]+m[0]*.75,c[1]+1.55,c[2]+m[1]*.75];a.pole([c,[c[0]+m[0]*.7,c[1]+.35,c[2]+m[1]*.7],w],.11,g?3:5),g||(a.push(w[0],w[1],w[2]),a.lathe([[0,.34],[.27,.12],[.27,.08]],5,{}),a.pop()),O=[w[0],w[1]+.3,w[2]]}let f=null;if(!e.small){const l=S+Math.PI+.5,c=u(.68,l,.97);a.push(c[0],c[1],c[2],-l+Math.PI/2,.1),a.set(pe(M.plank,.7),b.WOOD),a.box(-.45,-.75,0,.45,.75,.1,"z"),g||(a.set(M.plankPale,b.WOOD),a.box(-.75,-.86,.05,.75,-.78,1),a.set(M.hemp,b.ROPE),a.rope([[-.72,-.8,.95],[-.5,.95,.05]],.02,3),a.rope([[.72,-.8,.95],[.5,.95,.05]],.02,3)),a.pop(),f=[c[0]*1.3,c[1]-.85,c[2]*1.3]}if(e.hoop&&!g){a.set(M.plank,b.WOOD);let l=.5;for(let c=.4;c<.9;c+=.02)P(c)>P(l)&&(l=c);a.ring(-i-l*o,s*P(l)*1.015,.06,h,3)}return{g:a,h:i+o+.7,r:s*1.08,windows:C,smoke:O,door:f,R:s,H:o,nk:i}}function me(t,e={}){const a=new $,o=e.L??12,s=e.B??4.2,h=e.hang??8.5,n=!!e.grand,i=-h,d=!!e.far,r=m=>s/2*Math.pow(Math.max(1-Math.pow(Math.abs(m*2-1),2.3),0),.6),g=m=>1+(n?2.6:1.7)*Math.pow(Math.abs(m*2-1),3),P=m=>-.25+.9*Math.pow(Math.abs(m*2-1),2.4),z=n?16:d?6:10;a.ropeUp(n?.17:.12,void 0,d?3:4),a.set(de(M.plank,M.plankPale,.55),b.WOOD);for(const m of[-1,1])a.sheet(z,2,(w,x)=>[(w-.5)*o,i+he(P(w),g(w),x),m*r(w)*(.45+.55*Math.sqrt(x))]);a.sheet(z,1,(m,w)=>[(m-.5)*o,i+P(m),(w*2-1)*r(m)*.45]),a.set(M.plankPale,b.WOOD),a.sheet(z,1,(m,w)=>[(m-.5)*o,i+.5+.5*Math.pow(Math.abs(m*2-1),3),(w*2-1)*r(m)*.92]);const v=i+.5;for(const m of[-1,1]){a.set(M.brass,b.METAL);const w=m*o/2,x=g(0);a.pole([[w*.97,i+x-.3,0],[w*1.03,i+x+.9,0],[w*1,i+x+1.7,0],[w*.94,i+x+1.9,0],[w*.92,i+x+1.55,0]],[.16,.13,.11,.1,.12],d?3:5)}a.set(M.hemp,b.ROPE);const y=n?12:6;if(!d)for(const m of[-1,1]){const w=[];for(let x=0;x<=y;x++){const T=.1+.8*x/y,N=(T-.5)*o,E=m*r(T)*.98,K=i+g(T);a.rope([[N,K-.1,E],[N,K+.75,E]],.035,3),w.push([N,K+.75-(x%2?0:.06),E])}a.rope(w,.025,3)}const u=n?5:d?2:3,C=-Math.min(2.2,h*.25),p=n?1.3:.6;d||(a.set(M.iron,b.METAL),a.ring(C,p,.06,8,3)),a.set(M.hemp,b.ROPE);for(const m of[-1,1])for(let w=0;w<u;w++){const x=.14+.72*w/(u-1),T=(x-.5)*o,N=m*r(x),E=Math.atan2(N,T);a.rope([[0,0,0],[Math.cos(E)*p,C,Math.sin(E)*p],[T,i+g(x)+.7,N]],n?.06:.04,n?4:3)}const S=n?.34:.3,O=n?4.6:3.3;a.set([1,1,1],b.STRIPE),a.sheet(n?12:d?4:8,d?2:4,(m,w)=>{const x=Math.abs(w*2-1);return[(m-.5)*2*S*o,v+O-.75*x*x-.3*Math.sin(m*Math.PI*(n?4:3))*(.3+x),(w*2-1)*s*.56,.12*x]});const f=[],l=[],c=n?11:3;for(let m=0;m<c;m++){const w=.2+.6*(m+.5)/c,x=(w-.5)*o,T=(m%2?1:-1)*r(w)*(n?.5:.35)*t.range(.6,1),N=v+.05;a.set(M.plank,b.WOOD),a.push(x,N,T),a.lathe(d?[[.62,.75],[.07,.7],[.07,.02]]:[[.62,.78],[.62,.72],[.07,.7],[.07,.04],[.3,0]],d?4:5,{});for(let E=0;E<(n?3:d?0:2);E++){const K=E*2.1+m;a.box(Math.cos(K)*1-.17,0,Math.sin(K)*1-.17,Math.cos(K)*1+.17,.42,Math.sin(K)*1+.17,"y")}a.set(M.lamp,b.GLASS,4.5),a.ball(0,.95,0,.1,.14,.1,d?3:4,2),a.pop(),f.push([x,N,T]),l.push([x,N+.95,T,1.5])}a.set(M.leaf,b.LEAF);for(let m=0;m<(n?10:d?2:4);m++){const w=t.range(.16,.84),x=m%2?1:-1;a.ball((w-.5)*o,i+g(w)+.55,x*r(w)*.97,.5,.36,.34,5,2)}return{g:a,h:h+.5,r:o/2+.5,deck:v,L:o,B:s,lamps:l,tables:f,under:[0,i+P(.5),0]}}function We(t,e=!1){const a=new $,o=2.7;return a.ropeUp(.04,void 0,e?3:4),a.set(M.hemp,b.ROPE),a.rope([[0,0,0],[-o/2,-.7,0]],.025,3),a.rope([[0,0,0],[o/2,-.7,0]],.025,3),a.set(M.plank,b.WOOD),a.pole([[-o/2-.1,-.7,0],[o/2+.1,-.7,0]],.05,4),a.set(M.cream,b.CLOTH),a.sheet(e?4:6,e?1:2,(s,h)=>{const n=Math.sin(Math.PI*s);return[(s-.5)*o,-.75-.85*n-.2*(1-(h*2-1)**2)*n,(h-.5)*.95*Math.sqrt(n+.02),.03]}),a.set([1,1,1],b.CLOTH),a.flex=0,a.ball(.1,-1.52,0,.82,.24,.3,e?4:6,e?2:3),e||(a.set([.5,.36,.27],b.PLAIN),a.ball(-.78,-1.42,0,.14,.13,.13,5,3)),{g:a,h:1.9,r:1.5}}function ye(t=12,e=!1){const a=new $,o=.23;a.set(M.hemp,b.ROPE),a.rope([[-o,0,0],[-o,-t,0]],.028,3),a.rope([[o,0,0],[o,-t,0]],.028,3),a.set(M.plankPale,b.WOOD);for(let s=-.5;s>-t;s-=e?1:.5)a.rope([[-o,s,0],[o,s,0]],.022,3);return{g:a,h:t,r:.4}}function De(t,e=!1){const a=new $;return a.ropeUp(.04,void 0,e?3:4),a.set(M.wicker,b.WICKER),a.lathe(e?[[.48,-.5],[.4,-.86],[0,-1]]:[[.46,-.5],[.5,-.56],[.4,-.86],[.3,-1],[0,-1]],e?5:7,{}),a.set(M.hempDark,b.ROPE),a.rope(e?[[-.46,-.5,0],[0,0,0],[.46,-.5,0]]:[[-.46,-.5,0],[-.3,-.18,0],[0,0,0],[.3,-.18,0],[.46,-.5,0]],.022,3),a.set([1,1,1],b.CLOTH),a.ball(0,-.56,0,.42,.2,.42,e?4:6,2),{g:a,h:1,r:.5}}function xe(t,e={}){const a=!!e.far,o=new $,s=!!e.grand,h=s?[[-2.2,10,2.4],[-3.6,6,1.5]]:[[-1.3,6,1.1]],n=s?-4.6:-2,i=[];o.ropeUp(s?.06:.04,M.iron),o.set(M.brass,b.METAL),o.lathe(s?[[.05,0],[.22,-.4],[.08,-.9],[.34,-2.1],[.12,-2.6],[.3,-3.6],[.1,-4.1],[.24,-4.4],[0,n]]:[[.04,0],[.14,-.3],[.05,-.7],[.2,-1.3],[.07,-1.6],[.15,-1.85],[0,n]],s?7:5,{});for(const[d,r,g]of h)for(let P=0;P<r;P++){const z=P/r*V+d,v=Math.cos(z),y=Math.sin(z);o.set(M.brass,b.METAL),o.rope([[v*.15,d,y*.15],[v*g*.5,d-.38,y*g*.5],[v*g*.9,d-.2,y*g*.9],[v*g,d+.22,y*g]],s?.035:.025,3),o.push(v*g,d+.22,y*g),a||o.lathe([[.13,.08],[.09,0],[.03,-.06]],5,{}),a||(o.set(M.cream,b.PLAIN),o.pole([[0,.02,0],[0,.3,0]],.035,4)),o.set(M.lamp,b.GLASS,6),o.ball(0,.42,0,.055,.12,.055,a?3:4,2),a||(o.set([.9,.95,1],b.GLASS,.5),o.ball(0,-.42,0,.05,.11,.05,4,2)),o.pop(),i.push([v*g,d+.64,y*g,s?.55:.6])}return o.set([.9,.95,1],b.GLASS,.5),o.ball(0,n-.2,0,.14,.24,.14,5,3),{g:o,h:-n+.5,r:h[0][2]+.2,lamps:i}}function ge(t,e={}){const a=!!e.far,o=new $,s=a?3:e.vines??4;o.ropeUp(.04,void 0,a?3:4),o.set(M.hemp,b.ROPE);for(let h=0;h<(a?0:3);h++){const n=h/3*V;o.rope([[0,0,0],[Math.cos(n)*.36,-.5,Math.sin(n)*.36]],.022,3)}o.set(M.copper,b.METAL),o.lathe(a?[[.37,-.5],[.3,-.82],[0,-.95]]:[[.36,-.5],[.38,-.57],[.3,-.82],[.2,-.95],[0,-.95]],a?4:5,{}),o.set(de(M.leafDark,M.leaf,.6),b.LEAF),o.ball(0,-.46,0,.46,.3,.46,a?4:5,2);for(let h=0;h<s;h++){const n=h/s*V+t.range(-.4,.4),i=t.range(1.4,4.2)*(e.long??1),d=Math.cos(n),r=Math.sin(n),g=.38,P=a?Math.max(2,Math.round(i/1.3)):Math.max(3,Math.round(i/.56));for(let z=0;z<P;z++){const v=z/P,y=(z+1.25)/P,u=K=>{const _=.36+.16*Math.sin(K*2.2);return[d*_,-.5+.12*Math.sin(K*3.1)-i*K*K*.6-i*K*.4,r*_]},C=u(v),p=u(Math.min(y,1.05)),S=t.range(-1,1),O=(-r*Math.cos(S)+d*Math.sin(S)*.5)*g*.5,f=(d*Math.cos(S)+r*Math.sin(S)*.5)*g*.5,l=Math.sin(S)*g*.3;o.set(de(M.leafDark,M.leaf,t.range(.45,1)),b.LEAF);const c=[(C[0]+p[0])/2,(C[1]+p[1])/2,(C[2]+p[2])/2],m=.1+.5*v,w=.1+.5*y,x=o.v(C[0],C[1],C[2],d,.3,r,0,m),T=o.v(c[0]-O,c[1]-l,c[2]-f,d,.3,r,0,(m+w)/2),N=o.v(p[0],p[1],p[2],d,.3,r,0,w),E=o.v(c[0]+O,c[1]+l,c[2]+f,d,.3,r,0,(m+w)/2);o.quad(x,T,N,E)}}return{g:o,h:1+3.2*(e.long??1),r:.6}}const Me=["#f2efe6","#e8dcc0","#a8522a","#3d6b8f","#d19a3a","#f2efe6","#7fa6b8","#c96a4a","#e8e2d2"].map(Q);function Ne(t,e={}){const a=new $,o=e.W??3.8,s=-.8;a.ropeUp(.04),a.set(M.hemp,b.ROPE),a.rope([[0,0,0],[-o/2,s,0]],.02,3),a.rope([[0,0,0],[o/2,s,0]],.02,3),a.set(M.plank,b.WOOD),a.pole([[-o/2-.15,s,0],[o/2+.15,s,0]],.04,4);let h=-o/2+.1;for(;h<o/2-.5;){const n=t.int(0,3),i=n===0?t.range(.9,1.4):t.range(.5,.7),d=n===0?t.range(1.2,2):t.range(.7,1.1),r=h;if(a.set(t.pick(Me),b.CLOTH),n===2)for(const g of[0,1])a.sheet(1,3,(P,z)=>[r+(g*.55+P*.4)*i,s-z*d*1.3,.03,z*.5]);else a.sheet(2,3,(g,P)=>[r+g*i,s-P*d,.02*Math.sin(g*6),P*.55]);if(n===1)for(const g of[-1,1])a.sheet(1,1,(P,z)=>[r+i/2+g*(i/2+P*.32),s-.05-z*.3-P*.14,.02,.3]);h+=i+t.range(.12,.4)}return{g:a,h:2.9,r:o/2+.2}}function Be(t,e=!1){const a=new $,o=2.6,s=-.7;a.ropeUp(.04,void 0,e?3:4),a.set(M.hemp,b.ROPE),a.rope([[0,0,0],[-o/2,s,0]],.02,3),a.rope([[0,0,0],[o/2,s,0]],.02,3),a.set(M.plank,b.WOOD),a.pole([[-o/2-.1,s,0],[o/2+.1,s,0]],.04,4);for(let h=0;h<5;h++){const n=-o/2+.25+h*(o-.5)/4,i=t.range(.8,1.15);a.set(pe(M.skin,t.range(.8,1.3)),b.SKIN),a.push(n,s-.12,0,t.range(0,3),0,0,i),a.lathe(e?[[.03,0],[.2,-.45],[.25,-.8],[0,-1.04]]:[[.03,0],[.07,-.16],[.2,-.45],[.26,-.75],[.17,-.98],[0,-1.04]],e?3:5,{}),a.pop()}return{g:a,h:2,r:o/2+.2}}function Re(t=!1){const e=new $;return e.ropeUp(.04,M.iron,t?3:4),e.set(M.iron,b.METAL),e.lathe(t?[[.02,0],[.2,-.16]]:[[.02,0],[.2,-.14],[.2,-.17]],t?4:6,{}),e.set(M.lamp,b.GLASS,5),e.lathe(t?[[.16,-.17],[.11,-.5]]:[[.15,-.17],[.17,-.34],[.11,-.5]],t?4:6,{}),t||(e.set(M.iron,b.METAL),e.lathe([[.12,-.5],[0,-.57]],6,{})),{g:e,h:.6,r:.25,lamps:[[0,-.33,0,1.25]]}}function Ye(){const t=new $;return t.ropeUp(.04),t.set(M.hemp,b.ROPE),t.rope([[0,0,0],[-.55,-.5,0]],.03,3),t.rope([[0,0,0],[.55,-.5,0]],.03,3),t.rope([[-.55,-.5,0],[-.55,-3.4,0]],.03,3),t.rope([[.55,-.5,0],[.55,-3.4,0]],.03,3),t.set(M.plankPale,b.WOOD),t.rope([[-.7,-3.4,0],[.7,-3.4,0]],.03,4),{g:t,h:3.5,r:.8}}function $e(){const t=new $;t.ropeUp(.04),t.set(M.hemp,b.ROPE),t.rope([[0,0,0],[-.4,-.5,0]],.03,3),t.rope([[0,0,0],[.4,-.5,0]],.03,3);for(const e of[-.4,.4]){t.set(M.hemp,b.ROPE),t.rope([[e,-.5,0],[e,-2.6,0]],.03,3),t.set(M.brass,b.METAL);const a=[];for(let o=0;o<8;o++){const s=o/8*V;a.push([e+Math.cos(s)*.17,-2.77+Math.sin(s)*.17,0])}t.sweep(a,.022,3,!0,!0)}return{g:t,h:3,r:.6}}function Qe(){const t=new $;return t.ropeUp(.04),t.set(M.copper,b.METAL),t.lathe([[.05,0],[.36,-.12],[.38,-.72],[.1,-.88],[.1,-1],[.3,-1.12],[0,-1.12]],6,{}),t.set([.8,.9,1],b.WATER),t.lathe([[.26,-1.14],[.5,-2.6],[.85,-4.6],[1.3,-7]],8,{}),{g:t,h:1.2,r:.45}}function Xe(){const t=new $;return t.ropeUp(.04),t.set(M.plank,b.WOOD),t.box(-.55,-1.5,-.45,.55,-1.42,.45),t.box(-.55,-.3,-.45,.55,-.22,.45),t.box(-.55,-.9,-.45,.55,-.85,.45),t.box(-.55,-1.5,-.45,-.5,-.22,.45),t.box(.5,-1.5,-.45,.55,-.22,.45),t.box(-.55,-1.5,-.45,.55,-.22,-.4),t.set(M.iron,b.METAL),t.rope([[0,0,0],[0,-.22,0]],.03,3),t.set([1,1,1],b.CLOTH),t.ball(-.15,-.72,0,.22,.14,.22,5,2),t.set(M.copper,b.METAL),t.ball(.2,-1.28,.05,.16,.16,.16,5,3),{g:t,h:1.5,r:.7}}function Ze(){const t=new $,e=-3.6;t.set(M.iron,b.METAL);for(const a of[-.45,.45])t.push(a,.16,0,0,Math.PI/2),t.lathe([[0,.05],[.2,.05],[.2,-.05],[0,-.05]],8,{}),t.pop();t.pole([[-.45,.1,0],[0,-.5,0],[.45,.1,0]],.05,4),t.pole([[0,-.5,0],[0,e+1.95,0]],.05,4),t.set(M.wicker,b.WICKER),t.box(-1.3,e,-.75,1.3,e+.75,.75,"Y"),t.set(M.plank,b.WOOD);for(const a of[-1.26,0,1.26])for(const o of[-.71,.71])t.box(a-.04,e+.75,o-.04,a+.04,e+1.7,o+.04,"yY");t.set([1,1,1],b.STRIPE),t.sheet(4,2,(a,o)=>[(a-.5)*3,e+1.72+.28*(1-(o*2-1)**2),(o-.5)*1.8,0]),t.set(M.lamp,b.GLASS,4.5);for(const a of[-1.38,1.38])t.ball(a,e+1.5,0,.13,.18,.13,5,2);t.set(M.lamp,b.GLASS,1.5);for(const a of[-.72,.72])t.box(.08,e+.8,a-.02,1.2,e+1.62,a+.02);return t.set([.36,.3,.42],b.CLOTH),t.ball(-.5,e+.95,0,.22,.32,.2,5,3),t.set([.5,.36,.27],b.PLAIN),t.ball(-.5,e+1.36,0,.12,.12,.12,5,3),{g:t,h:3.6,r:1.6,lamps:[[1.38,e+1.5,0,1.3],[-1.38,e+1.5,0,1.3]]}}function Je(){const t=new $,e=.34,a=(d,r)=>{const g=[];for(let P=0;P<12;P++){const z=P/12*V;g.push([d+Math.cos(z)*e,r+Math.sin(z)*e,0])}t.set(M.iron,b.METAL),t.sweep(g,.022,3,!0,!0),t.set([.6,.6,.62],b.METAL);for(let P=0;P<3;P++){const z=P/3*Math.PI;t.rope([[d+Math.cos(z)*e,r+Math.sin(z)*e,0],[d-Math.cos(z)*e,r-Math.sin(z)*e,0]],.006,3)}};t.ropeUp(.04,M.iron);const o=[0,-e,0],s=[.25,-e-1.02,0],h=[.5,-e-.62,0],n=[.42,-e-.12,0],i=[.42,-e-.75,0];return a(o[0],o[1]),a(s[0],s[1]),t.set(Q("#7a2f24"),b.METAL),t.rope([o,n],.018,3),t.rope([n,h],.018,3),t.rope([n,i],.018,3),t.rope([h,i],.018,3),t.rope([i,s],.018,3),t.rope([h,s],.014,3),t.set(M.iron,b.METAL),t.rope([[n[0]+.12,n[1]+.05,-.26],[n[0]+.12,n[1]+.05,.26]],.014,3),t.rope([n,[n[0]+.12,n[1]+.05,0]],.014,3),t.set(M.skin,b.SKIN),t.box(h[0]+.02,h[1]-.12,-.06,h[0]+.1,h[1]+.12,.06),{g:t,h:1.75,r:.6}}function Ge(t,e){const a=new $;return a.set([1,1,1],b.CLOTH),a.lathe([[.1,1.42],[.2,1.3],[.22,.9],[.3,.05],[0,.05]],6,{}),a.set([.5,.36,.27],b.PLAIN),a.ball(0,1.56,0,.12,.13,.12,5,3),e&&(a.set(M.wicker,b.WICKER),a.lathe([[0,1.8],[.34,1.64],[.34,1.62]],6,{})),{g:a,h:0,r:.4}}function et(){const t=new $;return t.set([1,1,1],b.WOOD),t.box(-.82,-.035,-.16,.82,.035,.16,"xX"),{g:t,h:0,r:.9}}function tt(){const t=new $;return t.set([1,1,1],b.WOOD),t.quad(t.v(-.82,.03,-.16,0,1,0),t.v(-.82,.03,.16,0,1,0),t.v(.82,.03,.16,0,1,0),t.v(.82,.03,-.16,0,1,0)),{g:t,h:0,r:.9}}function at(){const t=new $;return t.set(M.plank,b.WOOD),t.rope([[0,-.3,0],[0,3.3,0]],.06,4),t.rope([[-.1,3.05,0],[1.6,3.05,0]],.045,4),t.rope([[0,2.2,0],[.9,3.05,0]],.03,3),t.set(M.hemp,b.ROPE),t.rope([[0,.15,0],[.4,-.2,.3]],.03,3),t.rope([[0,.15,0],[-.4,-.2,-.3]],.03,3),{g:t,h:0,r:1.8,arm:[1.5,3,0]}}function ot(){const t=new $,e=1.05,a=.55,o=[];for(let s=0;s<3;s++){const h=-Math.PI/2+s/2*Math.PI;o.push([e-a+Math.cos(h)*a,0,Math.sin(h)*a])}for(let s=0;s<3;s++){const h=Math.PI/2+s/2*Math.PI;o.push([-e+a+Math.cos(h)*a,0,Math.sin(h)*a])}return t.set(Q("#6a6058"),b.METAL),t.sweep(o,.19,4,!1,!0),{g:t,h:0,r:1.1}}function st(){const t=new $;return t.set([1,1,1],b.CLOTH),t.sheet(3,1,(e,a)=>[.04+e*1.5,-.06-a*.62*(1-e)-e*.31+.31*e*0,0,.15+.85*e]),{g:t,h:.7,r:1.5}}function nt(){const t=new $;return t.ropeUp(.022),t.set(M.iron,b.METAL),t.ball(0,-.1,0,.08,.1,.08,4,2),{g:t,h:.2,r:.1}}function it(){const t=new $;return t.set([.55,.57,.62],b.PLAIN),t.ball(0,.11,0,.16,.1,.09,5,3),t.ball(.14,.2,0,.055,.055,.05,4,2),t.set([.36,.38,.44],b.PLAIN),t.sheet(1,1,(e,a)=>[-.12-e*.16,.1-e*.04,(a-.5)*.1]),{g:t,h:0,r:.25}}function rt(t){const e=new $,a=17,o=8.4,s=22,h=14,n=2.8,i=o*.2,d=[],r=S=>Math.max(Math.pow(Math.sin(Math.PI*Math.pow(ae(S,0,1),1.7)),.56),S<.5?i/o*(1+2*S):0);e.set(M.iron,b.METAL),e.ring(-.1,.7,.14,8,4),e.set(M.hemp,b.ROPE);for(let S=0;S<8;S++){const O=S/8*V+.2;e.rope([[0,0,0],[Math.cos(O)*i*1.05,-n,Math.sin(O)*i*1.05]],.09,4)}e.set([1,1,1],b.STRIPE),e.lathe([[.3,-.5],[1.3,-1.5],[3.3,-n-.3],[6.3,-n-2.1],[6.7,-n-2.7]],16,{flute:S=>1+.05*Math.cos(8*S)}),e.set(M.hempDark,b.ROPE),e.ring(-n-2.7,6.7,.09,16,3),e.set([1,1,1],b.CANVAS);const g=[];for(let S=0;S<h;S++){const O=S/(h-1);g.push([o*r(O),-n-O*a])}g[h-1][0]=0,e.lathe(g,s,{flute:(S,O)=>{const f=O/(h-1);return 1+.07*Math.cos(11*S)*Math.pow(1-f,1.5)+.02*Math.cos(3*S+f*5)*f}}),e.set(M.hempDark,b.ROPE),e.ring(-n-.1,i*1.12,.14,8,4);const P=(S,O,f=1)=>{const l=o*r(S)*f;return[Math.cos(O)*l,-n-S*a,Math.sin(O)*l]};let z=.5;for(let S=.4;S<.9;S+=.02)r(S)>r(z)&&(z=S);for(const[S,O,f,l]of[[.33,8,.8,0],[.48,12,1.05,.5],[.84,8,.75,0]])for(let c=0;c<O;c++){const m=(c+l)/O*V+.26+t.range(-.05,.05),w=P(S,m,.995),x=(o*r(S+.02)-o*r(S-.02))/(.04*a);e.push(w[0],w[1],w[2],-m+Math.PI/2,-Math.atan(x)),e.set(M.lamp,b.GLASS,2.4),e.discZ(f,8,.1),e.set(M.plank,b.WOOD);const T=[];for(let N=0;N<=8;N++){const E=N/8*V,K=Math.cos(E),_=Math.sin(E);T.push(e.v(K*f,_*f,.16,0,0,1),e.v(K*(f+.15),_*(f+.15),.1,0,0,1))}for(let N=0;N<8;N++)e.quad(T[N*2],T[N*2+1],T[N*2+3],T[N*2+2]);e.box(-f,-.04,.1,f,.04,.17,"xXyY"),e.box(-.04,-f,.1,.04,f,.17,"xXyY"),e.pop()}const v=-n-z*a,y=o*r(z)-.4,u=y+2.4;e.set(M.plankPale,b.WOOD);{const S=[],O=[],f=[],l=[];for(let c=0;c<=s;c++){const m=c/s*V,w=Math.cos(m),x=Math.sin(m);S.push(e.v(w*y,v,x*y,0,1,0)),O.push(e.v(w*u,v,x*u,0,1,0)),f.push(e.v(w*u,v,x*u,w,0,x)),l.push(e.v(w*u,v-.4,x*u,w,0,x))}for(let c=0;c<s;c++)e.quad(S[c],O[c],O[c+1],S[c+1]),e.quad(f[c],l[c],l[c+1],f[c+1])}for(let S=0;S<s;S++){const O=(S+.5)/s*V,f=Math.cos(O),l=Math.sin(O);e.set(M.plank,b.WOOD),e.rope([[f*u,v-.2,l*u],[f*u,v+1.2,l*u]],.055,3),S%2===1&&(e.set(M.lamp,b.GLASS,5),e.ball(f*u,v+1.5,l*u,.17,.24,.17,4,2),d.push([f*u,v+1.5,l*u,1.7]))}e.set(M.hemp,b.ROPE),e.ring(v+1.15,u,.04,s,3,!0),e.push(o*r(z-.06)*.99,v+1.75,0,Math.PI/2,0),e.set(pe(M.plank,.7),b.WOOD),e.box(-1.05,-1.75,0,1.05,1.45,.3,"z"),e.set(M.lamp,b.GLASS,1.6),e.box(-1.05,1.45,0,1.05,2.1,.26,"z"),e.pop();for(let S=0;S<4;S++){const O=S*V/4,f=Math.cos(O),l=Math.sin(O),c=S?4.4:6.6,m=o*r(z-.1)*.97,w=v+(S?3.3:4.4);e.set([1,1,1],b.STRIPE),e.sheet(4,2,(x,T)=>{const N=m+T*(u-m+.3),E=(x-.5)*c;return[f*N-l*E,w-T*1.25-.22*Math.sin(Math.PI*x)*T,l*N+f*E,.1*T]}),e.set(M.plank,b.WOOD);for(const x of[-1,1]){const T=x*c/2;e.rope([[f*u-l*T,v+1.2,l*u+f*T],[f*(u+.3)-l*T,w-1.25,l*(u+.3)+f*T]],.045,3)}}let C=null;for(let S=0;S<3;S++){const O=.9+S*2.2,f=P(.2,O,.92),l=[Math.cos(O),Math.sin(O)],c=[f[0]+l[0]*1.2,f[1]+3.2,f[2]+l[1]*1.2];e.set(M.iron,b.METAL),e.pole([f,[f[0]+l[0]*1.1,f[1]+.6,f[2]+l[1]*1.1],c],.2,5),e.push(c[0],c[1],c[2]),e.lathe([[0,.6],[.48,.2],[.48,.12]],5,{}),e.pop(),S||(C=[c[0],c[1]+.5,c[2]])}const p=-n-a;return e.set(M.hemp,b.ROPE),e.rope([[0,p,0],[0,p-1.3,0]],.07,3),e.set(M.iron,b.METAL),e.lathe([[.05,p-1.2],[.7,p-1.5],[.7,p-1.56]],6,{}),e.set(M.lamp,b.GLASS,5),e.lathe([[.55,p-1.56],[.62,p-2.1],[.36,p-2.6]],6,{}),d.push([0,p-2.1,0,3.4]),{g:e,h:n+a+2.7,r:u+.4,R:o,H:a,nk:n,lamps:d,smoke:C,gallery:v,galR:u}}function lt(){const t=new $;t.set([.84,.82,.76],b.PLAIN),t.ball(0,.56,0,.42,.25,.19,6,3),t.ball(.44,.8,0,.16,.13,.1,4,2),t.set([.3,.27,.24],b.PLAIN);for(const[e,a]of[[.26,.1],[.26,-.1],[-.27,.1],[-.27,-.1]])t.rope([[e,.42,a],[e*1.05,0,a]],.04,3);return t.rope([[.46,.9,.05],[.36,1.06,.08]],.02,3),t.rope([[.46,.9,-.05],[.36,1.06,-.08]],.02,3),{g:t,h:0,r:.6}}const ke={sackA:t=>ne(t,{H:6.2,R:2.5,shape:"pear",windows:2}),sackB:t=>ne(t,{H:5.2,R:2.7,shape:"round",windows:2}),sackC:t=>ne(t,{H:7.4,R:2.3,shape:"gourd",windows:2}),bigA:t=>ne(t,{H:10.5,R:4.3,shape:"pear",windows:3,segs:14,rows:11,hoop:!0}),bigB:t=>ne(t,{H:9,R:4.6,shape:"round",windows:3,segs:14,rows:10,hoop:!0}),pouchA:t=>ne(t,{H:3.1,R:1.35,shape:"pear",windows:1,segs:8,rows:6,small:!0}),pouchB:t=>ne(t,{H:2.6,R:1.5,shape:"round",windows:1,segs:8,rows:6,small:!0}),gondola:t=>me(t,{}),gondolaB:t=>me(t,{L:9,B:3.6,hang:7}),terrace:t=>me(t,{grand:!0,L:42,B:15.5,hang:20}),hammock:t=>We(t),ladder:()=>ye(12),ladderLong:()=>ye(24),basket:t=>De(t),chandelier:t=>xe(t,{}),chandelierGrand:t=>xe(t,{grand:!0}),pot:t=>ge(t,{}),potLong:t=>ge(t,{long:1.8,vines:5}),laundryA:t=>Ne(t,{}),laundryB:t=>Ne(t,{W:5}),skins:t=>Be(t),lamp:()=>Re(),trapeze:()=>Ye(),rings:()=>$e(),shower:()=>Qe(),dumbWaiter:()=>Xe(),cableCar:()=>Ze(),bicycle:()=>Je(),figure:t=>Ge(t,!1),figureHat:t=>Ge(t,!0),plank:()=>et(),post:()=>at(),link:()=>ot(),pennant:()=>st(),string:()=>nt(),pigeon:()=>it(),plankFar:()=>tt(),sackAFar:t=>ne(t,{H:6.2,R:2.5,shape:"pear",windows:2,segs:8,rows:6,far:!0}),sackBFar:t=>ne(t,{H:5.2,R:2.7,shape:"round",windows:2,segs:8,rows:6,far:!0}),sackCFar:t=>ne(t,{H:7.4,R:2.3,shape:"gourd",windows:2,segs:8,rows:7,far:!0}),bigAFar:t=>ne(t,{H:10.5,R:4.3,shape:"pear",windows:3,segs:10,rows:7,far:!0}),bigBFar:t=>ne(t,{H:9,R:4.6,shape:"round",windows:3,segs:10,rows:7,far:!0}),pouchAFar:t=>ne(t,{H:3.1,R:1.35,shape:"pear",windows:1,segs:6,rows:5,small:!0,far:!0}),pouchBFar:t=>ne(t,{H:2.6,R:1.5,shape:"round",windows:1,segs:6,rows:5,small:!0,far:!0}),gondolaFar:t=>me(t,{far:!0}),gondolaBFar:t=>me(t,{L:9,B:3.6,hang:7,far:!0}),potFar:t=>ge(t,{far:!0}),potLongFar:t=>ge(t,{long:1.8,far:!0}),lampFar:()=>Re(!0),basketFar:t=>De(t,!0),skinsFar:t=>Be(t,!0),ladderFar:()=>ye(12,!0),ladderLongFar:()=>ye(24,!0),chandelierFar:t=>xe(t,{far:!0}),hammockFar:t=>We(t,!0),hall:t=>rt(t),goat:()=>lt()},fe={};for(const t of Object.keys(ke))t.endsWith("Far")&&t!=="plankFar"&&(fe[t.slice(0,-3)]=t);const ct=t=>{const e=[];let a=0,o=0,s=0;for(let h=0;h<t.P.length/3;h++){if(t.M[h*4]>.5)continue;const n=t.P[h*3],i=t.P[h*3+1],d=t.P[h*3+2],r=Math.max(0,-i),g=Math.floor(r);let P=Math.hypot(n,d)+t.M[h*4+2]+t.C[h*4+3]*(J.flut0+J.flutG*J.gMax)*.4*1.45;for(t.M[h*4+3]===b.WATER&&(P+=(J.lean0+J.leanG*J.gMax)*i*i*1.3),a=Math.max(a,r),o=Math.max(o,P),s=Math.max(s,Math.abs(d)+P-Math.hypot(n,d));e.length<=g;)e.push(0);e[g]=Math.max(e[g],P)}return{h:a,prof:e,rMax:o,zMax:s}};function ht(t,e={}){const a=(e.rng||t.rng).fork("hung-kit"),o=e.net||Fe({}),s={uTime:{value:0},uGustF:{value:new k.Vector4(1/180,1/11,0,0)},uPix:{value:2/450},uWind:{value:new k.Vector4(1,0,.028,.9)},...o.uniforms(),uSunDir:{value:new k.Vector3(.74,.57,.36).normalize()},uSunCol:{value:new k.Color(1.05,.97,.82)},uSkyCol:{value:new k.Color(.25,.34,.5)},uGndCol:{value:new k.Color(.2,.24,.3)},uFogCol:{value:new k.Color(.62,.78,.95)},uLampCol:{value:new k.Color().setRGB(M.lamp[0],M.lamp[1],M.lamp[2])},uFogDen:{value:6e-4},uLampK:{value:1},uLantern:{value:0},uMist:{value:new k.Vector4(1,1,1,0)},uShadeG:{value:new Float32Array(32).fill(-1e5)},uShadeP:{value:new k.Vector4(0,1,.5,.025)},uShadeQ:{value:new k.Vector2(-620,5)},uHoles:{value:[0,1,2,3].map(()=>new k.Vector4(0,1e5,0,0))},uHemp:{value:new k.Color().setRGB(M.hemp[0],M.hemp[1],M.hemp[2])}},h=new k.ShaderMaterial({defines:{HUNG:1},uniforms:s,vertexShader:Le,fragmentShader:Te,side:k.DoubleSide}),n=new k.ShaderMaterial({uniforms:s,vertexShader:Le,fragmentShader:Te,side:k.DoubleSide}),i=new k.ShaderMaterial({uniforms:s,vertexShader:He,fragmentShader:Ie,side:k.DoubleSide,transparent:!0,depthWrite:!1}),d=new k.ShaderMaterial({uniforms:s,vertexShader:Ke,fragmentShader:Ve,transparent:!0,depthWrite:!1,blending:k.AdditiveBlending}),r=new k.ShaderMaterial({uniforms:s,vertexShader:_e,fragmentShader:Ue,transparent:!0,depthWrite:!1,side:k.DoubleSide}),g=new Map,P=[],z=[],v=new $,y={};for(const f of Object.keys(ke))y[f]=fe[f.slice(0,-3)]===f||f==="hall"||f==="goat"?t.core.makeRng(t.core.hashSeed("kind-"+f+":"+t.seed)):a.fork("kind-"+f);const u=f=>{let l=g.get(f);if(!l){const c=ke[f](y[f]);c.reach=ct(c.g),l={name:f,info:c,geo:c.g,piv:[],at:[],quat:[],par:[],tint:[],n:0},g.set(f,l)}return l},C=new k.Vector3,p=new k.Quaternion,S=new k.Euler,O={uniforms:s,net:o,kinds:g,static:v,materials:{hung:h,static:n,net:i,glow:d,smoke:r},count:0,glowCount:0,smokeCount:0,info:f=>u(f).info,add(f,l){const c=u(f),m=l.rope??0,w=l.scale??1,x=l.at||[0,-m,0],T=l.seed??a();l.quat?p.copy(l.quat):p.setFromEuler(S.set(l.pitch??0,l.yaw??0,l.roll??0,"YXZ"));const N=l.tint||[1,1,1];if(c.piv.push(l.pivot[0],l.pivot[1],l.pivot[2]),c.at.push(x[0],x[1],x[2]),c.quat.push(p.x,p.y,p.z,p.w),c.par.push(m,w,T,l.motion??0),c.tint.push(N[0],N[1],N[2],l.swing??0),c.n++,O.count++,c.info.lamps&&l.glow!==!1&&(l.motion??0)<0){let E=0;for(const K of c.info.lamps)E+=K[1]/c.info.lamps.length;O.glow(l.pivot,[x[0],x[1]+E*w,x[2]],c.info.r*w*1.7*(l.glow??1),pe(M.lamp,.4),T)}else if(c.info.lamps&&l.glow!==!1)for(const E of c.info.lamps)C.set(E[0]*w,E[1]*w,E[2]*w).applyQuaternion(p),O.glow(l.pivot,[x[0]+C.x,x[1]+C.y,x[2]+C.z],E[3]*w*(l.glow??1),null,T);return c.info.smoke&&l.smoke!==!1&&(l.smoke===!0||T*7.31%1<.66)&&(C.set(c.info.smoke[0]*w,c.info.smoke[1]*w,c.info.smoke[2]*w).applyQuaternion(p),z.push(l.pivot[0],l.pivot[1],l.pivot[2],x[0]+C.x,x[1]+C.y,x[2]+C.z,w,T),O.smokeCount++),{top:[l.pivot[0]+x[0],l.pivot[1]+x[1],l.pivot[2]+x[2]],bottom:[l.pivot[0]+x[0],l.pivot[1]+x[1]-c.info.h*w,l.pivot[2]+x[2]],info:c.info,sc:w}},glow(f,l,c,m,w=0){const x=m||M.lamp;P.push(f[0],f[1],f[2],l[0],l[1],l[2],c,w,x[0],x[1],x[2]),O.glowCount++},cable(f,l,c=M.hemp,m=b.ROPE,w=1,x=5){v.set(c,m),v.flex=w,v.rope(f,l,x),v.flex=0},setLight(f){f.sunDir&&s.uSunDir.value.copy(f.sunDir).normalize(),f.sunCol&&s.uSunCol.value.copy(f.sunCol),f.sky&&s.uSkyCol.value.copy(f.sky),f.ground&&s.uGndCol.value.copy(f.ground),f.fog&&s.uFogCol.value.copy(f.fog),f.fogDensity!=null&&(s.uFogDen.value=f.fogDensity),f.lampK!=null&&(s.uLampK.value=f.lampK),f.lantern!=null&&(s.uLantern.value=f.lantern),f.hemp&&s.uHemp.value.copy(f.hemp)},async finish(){const f=new k.Group;let l=0,c=0;for(const m of g.values()){if(!m.n)continue;const w=m.geo.toGeometry(),x=new k.InstancedBufferGeometry;x.index=w.index;for(const N of["position","normal","color","aMat"])x.setAttribute(N,w.getAttribute(N));x.setAttribute("iPivot",new k.InstancedBufferAttribute(new Float32Array(m.piv),3)),x.setAttribute("iAt",new k.InstancedBufferAttribute(new Float32Array(m.at),3)),x.setAttribute("iQuat",new k.InstancedBufferAttribute(new Float32Array(m.quat),4)),x.setAttribute("iPar",new k.InstancedBufferAttribute(new Float32Array(m.par),4)),x.setAttribute("iTint",new k.InstancedBufferAttribute(new Float32Array(m.tint),4)),x.instanceCount=m.n;const T=new k.Mesh(x,h);T.frustumCulled=!1,T.name="hung-"+m.name,f.add(T),l+=m.geo.triangles*m.n,c++,m.mesh=T,await t.yield()}if(v.triangles){const m=new k.Mesh(v.toGeometry(),n);m.frustumCulled=!1,m.name="net-static",f.add(m),l+=v.triangles,c++}if(O.glowCount){const m=O.glowCount,w=new k.InstancedBufferGeometry,x=new Float32Array(P),T=new Float32Array(m*3),N=new Float32Array(m*3),E=new Float32Array(m*4),K=new Float32Array(m*3);for(let se=0;se<m;se++){const Z=se*11;T.set(x.subarray(Z,Z+3),se*3),N.set(x.subarray(Z+3,Z+6),se*3),E[se*4]=x[Z+6],E[se*4+1]=x[Z+7],K.set(x.subarray(Z+8,Z+11),se*3)}w.setAttribute("position",new k.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),w.setIndex([0,1,2,0,2,3]),w.setAttribute("iPivot",new k.InstancedBufferAttribute(T,3)),w.setAttribute("iAt",new k.InstancedBufferAttribute(N,3)),w.setAttribute("iPar",new k.InstancedBufferAttribute(E,4)),w.setAttribute("iCol",new k.InstancedBufferAttribute(K,3)),w.instanceCount=m;const _=new k.Mesh(w,d);_.frustumCulled=!1,_.renderOrder=5,_.name="glows",f.add(_),l+=m*2,c++}if(O.plumeTest){let m=0;for(let w=0;w<O.smokeCount;w++){const x=w*8;if(O.plumeTest(z[x],z[x+1],z[x+2],z[x+3],z[x+4],z[x+5],z[x+6],z[x+7])){if(m!==w)for(let T=0;T<8;T++)z[m*8+T]=z[x+T];m++}}z.length=m*8,O.smokeCount=m}if(O.smokeCount){const m=O.smokeCount,w=7,x=new k.InstancedBufferGeometry,T=new Float32Array(z),N=new Float32Array(m*3),E=new Float32Array(m*3),K=new Float32Array(m*4),_=[],se=[];for(let U=0;U<=w;U++)_.push(-1,U/w,0,1,U/w,0);for(let U=0;U<w;U++)se.push(U*2,U*2+1,U*2+3,U*2,U*2+3,U*2+2);for(let U=0;U<m;U++){const D=U*8;N.set(T.subarray(D,D+3),U*3),E.set(T.subarray(D+3,D+6),U*3),K[U*4]=T[D+6],K[U*4+1]=T[D+7]}x.setAttribute("position",new k.Float32BufferAttribute(_,3)),x.setIndex(se),x.setAttribute("iPivot",new k.InstancedBufferAttribute(N,3)),x.setAttribute("iAt",new k.InstancedBufferAttribute(E,3)),x.setAttribute("iPar",new k.InstancedBufferAttribute(K,4)),x.instanceCount=m;const Z=new k.Mesh(x,r);Z.frustumCulled=!1,Z.renderOrder=4,Z.name="chimney-smoke",f.add(Z),l+=m*w*2,c++}return O.triangles=l,O.calls=c,f},_size:new k.Vector2,update(f,l,c){s.uTime.value=l;const m=t.renderer?t.renderer.getDrawingBufferSize(O._size).y:450;s.uPix.value=2/Math.max(m,1)}};return O}async function ut(t,e,a={}){const o=a.yield||(async()=>{}),s=t.net,h=s.N,n=s.L,i=a.density??1,d=a.path||null,r=a.holes||[];r.forEach((A,L)=>{L<4&&t.uniforms.uHoles.value[L].set(A[0],A[1],A[2],0)});const g=(A,L,F=0)=>r.some(W=>Math.hypot(A-W[0],L-W[1])<W[2]+F),P=150,z=24,v=[],y=[],u=[],C=[],p=[0,0,0];for(let A=0;A<=P;A++){A%50===49&&await o();for(let L=0;L<=z;L++){const F=A/P,W=L/z*2-1;s.at(F,W,p),v.push(p[0],p[1],p[2]),u.push(F,W);const G=s.frame(ae(F,.003,.997),W);y.push(G.up.x,G.up.y,G.up.z)}}for(let A=0;A<P;A++)for(let L=0;L<z;L++){const F=A*(z+1)+L,W=F+z+1;C.push(F,W,W+1,F,W+1,F+1)}const S=new k.BufferGeometry;S.setAttribute("position",new k.Float32BufferAttribute(v,3)),S.setAttribute("normal",new k.Float32BufferAttribute(y,3)),S.setAttribute("aST",new k.Float32BufferAttribute(u,2)),S.setIndex(C);const O=new k.Mesh(S,t.materials.net);O.frustumCulled=!1,O.renderOrder=3,O.name="net-lattice",await o();const f=[];for(let A=-h.lanes;A<=h.lanes;A++)f.push(A/h.lanes);const l=(A,L)=>{const F=[];for(let R=0;R<A.length&&(F.push(A[R]),R!==A.length-1);R++){const H=A[R],Y=A[R+1],te=Math.hypot(Y[0]-H[0],Y[2]-H[2]);if(!r.some(X=>Math.hypot((H[0]+Y[0])/2-X[0],(H[2]+Y[2])/2-X[1])<X[2]+1+te))continue;const re=Math.max(1,Math.ceil(te/1.4));for(let X=1;X<re;X++){const oe=he(H[0],Y[0],X/re),le=he(H[2],Y[2],X/re);F.push([oe,s.y(oe,le),le])}}let W=[];const G=[W],I=R=>r.find(H=>Math.hypot(R[0]-H[0],R[2]-H[1])<H[2]+.55)||null,q=(R,H)=>{const Y=Math.hypot(H[0]-R[0],H[2]-R[1])||1,te=R[0]+(H[0]-R[0])/Y*(R[2]+.3),re=R[1]+(H[2]-R[1])/Y*(R[2]+.3),X=[te,s.y(te,re)+.2,re],oe=t.static;return oe.flex=1,oe.set(M.iron,b.METAL),oe.push(X[0],X[1]-.1,X[2],0,0,0,1),oe.ring(0,.42,.09,8,4),oe.pop(),oe.flex=0,X};for(let R=0;R<F.length;R++){const H=I(F[R]);if(!H){W.push([F[R][0],F[R][1]+L*.5,F[R][2]]);continue}let Y=R;for(;Y+1<F.length&&I(F[Y+1])===H;)Y++;const te=F[Math.max(R-1,0)],re=F[Math.min(Y+1,F.length-1)],X=H[2]+.55,oe=F[R+Y>>1];if(Math.hypot(oe[0]-H[0],oe[2]-H[1])<H[2]*.5){W.push(q(H,te)),W=[q(H,re)],G.push(W),R=Y;continue}const le=Math.atan2(te[2]-H[1],te[0]-H[0]);let ce=Math.atan2(re[2]-H[1],re[0]-H[0])-le;for(;ce>Math.PI;)ce-=V;for(;ce<=-Math.PI;)ce+=V;const ve=Math.max(2,Math.ceil(Math.abs(ce)*X/1.3));for(let be=0;be<=ve;be++){const Ae=le+ce*be/ve,ze=H[0]+Math.cos(Ae)*X,Pe=H[1]+Math.sin(Ae)*X;W.push([ze,s.y(ze,Pe)+L*.5,Pe])}R=Y}return G.filter(R=>R.length>1)},c=(A,L,F,W,G,I=5)=>{const q=[];for(let R=0;R<=90;R++){const H=R/90,Y=s.half(H);s.at(H,A+L/Math.max(Y,1),p),q.push([p[0],p[1],p[2]])}for(const R of l(q,F))t.cable(R,F,W,G,1,I)};for(const A of f)Math.abs(A)>.99?c(A,0,.36,M.hemp,b.ROPE,6):(c(A,-.95,.13,M.hemp,b.ROPE,4),c(A,.95,.13,M.hemp,b.ROPE,4));await o();for(let A=0;A<h.lanes*2;A++){const L=(A+.5)/h.lanes-1;c(L,0,.17,A%2?M.hemp:de(M.hemp,M.hempDark,.45),b.ROPE,4)}const m=(A,L,F)=>{const W=[],G=s.half(A),I=Math.max(4,Math.round(G/3.5));for(let q=0;q<=I;q++)s.at(A,q/I*2-1,p),W.push([p[0],p[1]+L*.5,p[2]]);for(const q of l(W,L))t.cable(q,L,F,b.ROPE,1,4)};for(let A=1;A<h.cross*2;A++){const L=A/(h.cross*2);m(L,A%2?.08:.11,A%2?M.hempDark:M.hemp)}await o();const w=new k.Matrix4,x=new k.Quaternion,T=new k.Vector3,N=new k.Vector3,E=[],K=(A,L,F,W)=>{if(s.at(A,L,p),g(p[0],p[2],1.2))return;const G=s.frame(ae(A,.003,.997),L);F?T.copy(G.r):T.copy(G.f),T.applyAxisAngle(G.up,W),N.crossVectors(T,G.up),x.setFromRotationMatrix(w.makeBasis(T,G.up,N));const I=e.range(.62,1.12),q=e.chance(.12);t.add(d&&d.distanceTo(p[0],p[1],p[2])>36?"plankFar":"plank",{pivot:[p[0]+G.up.x*.16,p[1]+G.up.y*.16,p[2]+G.up.z*.16],quat:x,scale:e.range(.92,1.08),tint:q?pe(M.plankPale,1.15):pe(M.plank,I)})},_=a.s0??.012,se=a.s1??.988,Z=.66;for(const A of f)if(!(Math.abs(A)>.99)){for(let L=_*n,F=0;L<se*n;L+=Z,F++)(F&255)===255&&await o(),!e.chance(.035)&&K(L/n,A,!0,e.range(-.07,.07));E.push({t:A,lengthwise:!0}),await o()}for(let A=2;A<h.cross;A+=2){const L=A/h.cross,F=s.half(L);for(let W=-F+1;W<F-1;W+=Z){if(e.chance(.035))continue;const G=W/F;f.some(I=>Math.abs(I)<.99&&Math.abs(G-I)*F<1)||K(L,G,!1,e.range(-.07,.07))}E.push({s:L,lengthwise:!1})}await o();for(const A of f)if(!(Math.abs(A)>.99))for(const L of[-1,1]){const F=[];let W=[];for(let G=_*n;G<=se*n;G+=5.5){const I=G/n,q=s.half(I);if(s.at(I,A+L*1.05/Math.max(q,1),p),g(p[0],p[2],.5)){W.length>1&&F.push(W),W=[];continue}const R=s.frame(ae(I,.003,.997),A),H=[p[0],p[1],p[2]],Y=[p[0]+R.up.x*1.15,p[1]+R.up.y*1.15,p[2]+R.up.z*1.15];if(t.cable([H,Y],.04,M.plank,b.WOOD,1,3),W.length){const te=W[W.length-1];W.push([(te[0]+Y[0])/2,(te[1]+Y[1])/2-.16,(te[2]+Y[2])/2])}W.push(Y)}W.length>1&&F.push(W);for(const G of F)t.cable(G,.03,M.hemp,b.ROPE,1,3)}await o();for(const A of r){const L=[],F=A[2]>6?44:20;for(let W=0;W<=F;W++){const G=W/F*V,I=A[0]+Math.cos(G)*(A[2]+.3),q=A[1]+Math.sin(G)*(A[2]+.3);L.push([I,s.y(I,q)+.2,q])}t.cable(L,.16,M.hemp,b.ROPE,1,5)}const U=[],D=M.canvas,B=(A,L,F)=>d?d.distanceTo(A,L,F):99;for(const A of f){if(Math.abs(A)>.99)continue;let L=0;for(let F=_*n+e.range(4,14);F<se*n-4;F+=e.range(13,22)/i,L++){const W=F/n,G=s.half(W),I=L%2?1:-1;if(s.at(W,A+I*1.5/Math.max(G,1),p),g(p[0],p[2],2.5))continue;const q=[p[0],p[1],p[2]],R=(I>0?0:Math.PI)+e.range(-.5,.5),H=Math.cos(R),Y=Math.sin(R),te=[1.5*H,3,-1.5*Y];if(B(q[0]+te[0],q[1]+2,q[2]+te[2])<2.6)continue;t.add("post",{pivot:q,at:[0,0,0],yaw:R,seed:e()}),U.push({base:q,tip:te,s:W,t:A});const re=d&&a.plain&&B(q[0],q[1],q[2])>a.plain,X=e(),oe=(le,ce,ve={})=>t.add(re&&fe[le]?fe[le]:le,{pivot:q,at:[te[0],te[1]-ce,te[2]],rope:ce,yaw:R+e.range(-.4,.4),seed:e(),...ve});X<.34?oe("lamp",e.range(.3,.6),{glow:1}):X<.56?oe(e.chance(.5)?"laundryA":"laundryB",.25,{yaw:R+Math.PI/2+e.range(-.3,.3)}):X<.68?oe("skins",.25,{yaw:R+Math.PI/2}):X<.76?oe("bicycle",.3,{yaw:R+Math.PI/2}):X<.88?oe("pot",e.range(.3,.8)):oe("basket",e.range(.4,1)),e.chance(.5)&&t.add("pennant",{pivot:q,at:[0,3.3,0],yaw:e.range(0,V),tint:e.pick(D),seed:e()})}}await o();const j=Math.round((a.figures??46)*i);for(let A=0,L=0;A<j&&L<j*30;L++){const F=e.pick(E),W=F.lengthwise?e.range(.06,.94):F.s,G=F.lengthwise?F.t:e.range(-.9,.9);if(s.at(W,G,p),g(p[0],p[2],2)||B(p[0],p[1]+1,p[2])<(a.far??34))continue;const I=s.frame(ae(W,.003,.997),G),q=Math.atan2(-(F.lengthwise?I.f.z:I.r.z),F.lengthwise?I.f.x:I.r.x);t.add(e.chance(.4)?"figureHat":"figure",{pivot:[p[0],p[1]+.2,p[2]],yaw:q,scale:e.range(.9,1.1),tint:pe(e.pick(D),e.range(.6,1.1)),motion:e.chance(.6)?2+e.range(1.5,5):0,seed:e()}),A++}const ee=Math.round((a.pigeons??60)*i);for(let A=0;A<ee;A++){const L=e.pick(f.filter(q=>Math.abs(q)<.99)),F=e.range(.05,.95),W=s.half(F),G=e.chance(.5)?1:-1;if(s.at(F,L+G*1.05/Math.max(W,1),p),g(p[0],p[2],1))continue;const I=s.frame(ae(F,.003,.997),L);t.add("pigeon",{pivot:[p[0]+I.up.x*1.17,p[1]+I.up.y*1.17-.08,p[2]+I.up.z*1.17],yaw:e.range(0,V),scale:e.range(.9,1.2),seed:e()})}return{surface:O,posts:U,lanesT:f,inHole:g}}const Ce=(t,e)=>{const a=t.range(.78,1.12),o=t.range(-.04,.04);return[ae(e[0]*a+o,.02,.95),ae(e[1]*a,.02,.95),ae(e[2]*a-o,.02,.95)]},pt=[["pot",3],["potLong",2],["basket",3],["lamp",3],["ladder",2],["pouch",2.4],["hammock",1.6],["laundry",1.6],["trapeze",.6],["rings",.5],["skins",.7],["shower",.1],["chandelier",.3],["dumbWaiter",.4]],ft=[["basket",3],["lamp",3],["pot",2],["potLong",2],["laundry",2],["hammock",2],["skins",1],["shower",.14],["dumbWaiter",.8],["trapeze",.8],["rings",.7],["chandelier",.5],["pouch",3]],Ee=(t,e)=>{let a=0;for(const s of e)a+=s[1];let o=t()*a;for(const s of e)if(o-=s[1],o<=0)return s[0];return e[0][0]},je=(t,e,a,o,s,h,n,i,d=0,r=!1)=>{const g=t.reach,P=(t.H||0)*i>=9?t.H*i:0,z=Math.hypot(o,s);for(let v=0;v<=n;v+=2)if(!e(a[0]+o,a[1]-h+v,a[2]+s,r?g.rMax*i:.2,Math.hypot(z,h-v),0))return!1;for(let v=0;v<g.prof.length;v++){const y=g.prof[v]*i+(d?(v+1)*i*d:0),u=h+(v+.5)*i;if(!e(a[0]+o,a[1]-u,a[2]+s,Math.hypot(y,.5*i),Math.hypot(z,u),P))return!1}return!0};function Se(t,e,a,o={}){const s=o.depth??40,h=[],n=o.tint||(()=>Ce(e,e.pick(M.canvas))),i=(v,y,u,C)=>!o.clear||o.clear(v,y,u,C);let d=o.start??0;const r=(v,y,u={})=>{o.far&&fe[v]&&(v=fe[v]);const C=t.info(v),p=u.scale??1,S=C.h*p,O=C.r*p,f=u.dx??0,l=u.dz??0,c=(u.depth??d)+y;if(c+S>s&&!u.force)return null;for(let w=0;w<=y;w+=2.5)if(!i(a[0]+f,a[1]-c+w,a[2]+l,.4))return null;for(let w=0;w<=S+.01;w+=Math.max(O,1.2))if(!i(a[0]+f,a[1]-c-Math.min(w+O*.5,S),a[2]+l,O))return null;if(o.lane&&!je(C,o.lane,a,f,l,c,y,p,u.swing,u.motion>0&&u.motion<=1))return null;const m=t.add(v,{pivot:a,at:[f,-c,l],rope:y,yaw:u.yaw??e.range(0,V),scale:p,tint:u.tint,motion:u.motion,swing:u.swing,seed:e(),glow:u.glow,smoke:u.smoke});return m.name=v,m.depth=c+S,m.rope=y,h.push(m),u.depth==null&&(d=c+S),m},g=(v,y,u={})=>{switch(v){case"pot":case"potLong":return r(v,y,{scale:e.range(.9,1.5),...u});case"basket":return r("basket",y+2,{scale:e.range(1,1.6),tint:Ce(e,e.pick(Me)),motion:e.chance(.6)?e.range(.4,.8):0,...u});case"lamp":return r("lamp",y,{scale:e.range(1.1,1.7),...u});case"ladder":return r(e.chance(.3)?"ladderLong":"ladder",0,{scale:e.range(.7,1.1),...u});case"pouch":return r(e.chance(.5)?"pouchA":"pouchB",y,{scale:e.range(.85,1.3),tint:n(e),...u});case"hammock":return r("hammock",y,{scale:e.range(1,1.25),tint:Ce(e,e.pick(Me)),...u});case"laundry":return r(e.chance(.5)?"laundryA":"laundryB",y,{scale:e.range(.9,1.2),...u});case"trapeze":return r("trapeze",y,{swing:e.range(.3,.55),...u});case"rings":return r("rings",y,{swing:e.range(.2,.4),...u});case"skins":return r("skins",y,{scale:e.range(.9,1.2),...u});case"shower":return r("shower",y,{scale:e.range(1,1.3),...u});case"chandelier":return r("chandelier",y+1,{scale:e.range(1,1.5),motion:-e.range(.15,.4),...u});case"dumbWaiter":return r("dumbWaiter",y+6,{motion:e.range(.6,.85),...u});default:return null}},P=v=>{for(let y=0;y<v&&g(Ee(e,pt),e.range(.8,5));y++);},z=o.kind||"house";if(z==="house"||z==="big"){const v=z==="big",y=v?e.pick(["bigA","bigB"]):e.pick(["sackA","sackB","sackC"]),u=v?e.range(.85,1.15):e.range(.8,1.25),C=o.rope??e.range(v?5:2.5,Math.max(v?9:5,s*(v?.35:.55))),p=r(y,C,{scale:o.scale??u,tint:n(e),yaw:o.yaw,smoke:o.smoke});if(!p)return o.strict?h:Se(t,e,a,{...o,kind:v?"house":"small",rope:void 0});const S=p.info,O=p.depth-.7*p.sc-S.H*p.sc*.58,f=S.R*p.sc*1+.42;for(let l=0,c=v?e.int(2,4):e.int(0,2);l<c;l++){const m=e.range(0,V);g(e.chance(.6)?"pot":"lamp",0,{depth:O-e.range(0,1.2),dx:Math.cos(m)*f,dz:Math.sin(m)*f})}d=p.depth-.25,P(e.chance(v?.9:.72)?e.int(1,v?3:2):0)}else if(z==="gondola"){const v=e.chance(.6)?"gondola":"gondolaB",y=o.rope??e.range(3,Math.max(4,s*.45)),u=r(v,y,{tint:n(e),yaw:o.yaw,scale:o.scale});if(!u)return o.strict?h:Se(t,e,a,{...o,kind:"house",rope:void 0});d=u.depth+.2,P(e.int(0,2))}else if(z==="small")g("pouch",o.rope??e.range(2,Math.max(3,s*.6)))&&P(e.chance(.5)?1:0);else{const v=Ee(e,ft),y=t.info(v==="pouch"?"pouchA":v==="laundry"?"laundryA":v==="ladder"?"ladder":v);g(v,o.rope??e.range(2,ae(s-y.h*1.6-3,3,12))),e.chance(.3)&&P(1)}return h}function St(t,e,a,o={}){const s={...t.uniforms,uShade:{value:new k.Vector4(o.color?o.color[0]:.3,o.color?o.color[1]:.38,o.color?o.color[2]:.56,o.strength??1)}},h=new k.ShaderMaterial({uniforms:s,transparent:!0,depthWrite:!1,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`varying vec3 vW; uniform vec4 uShade;
${ue}
${we}
void main(){
  float k = 1. / max(uSunDir.y, 0.12);
  // the shadow falls on billows: its place is shifted by their form, and its depth is broken by them
  vec2 bq = vW.xz * (1. / 150.), bq2 = vW.xz * (1. / 45.);
  vec3 pw = vW + vec3((vnoise(bq + 3.1) - .5) * 44. + (vnoise(bq2 + 9.7) - .5) * 16., 0., (vnoise(bq + 17.3) - .5) * 44. + (vnoise(bq2 + 4.1) - .5) * 16.);
  float t = (netY(pw.xz) - pw.y) * k; vec3 q = pw + uSunDir * t;
  t += (netY(q.xz) - q.y) * k; q = pw + uSunDir * t;
  t += (netY(q.xz) - q.y) * k; q = pw + uSunDir * t;
  t += (netY(q.xz) - q.y) * k; q = pw + uSunDir * t;
  float sr = (uNetA.x - q.z) * uNetA.y, s = clamp(sr, 0., 1.), h = netHalf(s), tt = netT(q.xz, s);
  float inside = smoothstep(-0.01, 0.05, sr) * (1. - smoothstep(0.95, 1.01, sr)) * (1. - smoothstep(0.9, 1.1, abs(tt)));
  float lat = netCover(s, tt, h, 11.);       // the mesh as a soft tone and the walks as soft bands: the shadow of the net's mass, with no grid of strands
  float bil = 0.6 * vnoise(vW.xz * (1. / 70.) + 2.7) + 0.4 * vnoise(vW.xz * (1. / 23.) + 8.1);
  float city = pow(clamp(sin(3.14159265 * s), 0., 1.), 0.8) * clamp(1. - tt * tt, 0., 1.);
  float d = length(vW - cameraPosition), f = exp(-d * d * uFogDen * uFogDen * 0.5);
  float a = inside * (0.14 + 0.3 * lat + 0.55 * city) * (0.5 + 0.85 * bil) * uShade.a * f;
  // the first mountain's long shadow on the cloud: it falls on billows, so its line is shifted by their form (in plan and in height) and is soft
  vec3 bp = vec3(vW.x + (vnoise(bq + 3.1) - .5) * 60. + (vnoise(bq2 + 9.7) - .5) * 20., vW.y + (vnoise(vW.xz * (1. / 260.) + 5.3) - .5) * 90. + (vnoise(vW.xz * (1. / 90.) + 1.9) - .5) * 30., vW.z + (vnoise(bq + 17.3) - .5) * 60. + (vnoise(bq2 + 4.1) - .5) * 20.);
  a = max(a, (1. - sunShadeW(bp, 30.)) * step(vW.z, 40.) * 0.55 * uShade.a * f);
  gl_FragColor = vec4(uShade.rgb, clamp(a, 0., 0.9));
}`}),n=new k.PlaneGeometry(a,a,1,1).rotateX(-Math.PI/2),i=new k.Mesh(n,h);i.frustumCulled=!1,i.renderOrder=2.5,i.name="net-shadow";const d=t.uniforms.uSunDir.value,r=t.net.N,g=(r.zA+r.zB)/2,P=(r.yA+r.yB)/2-r.sag,z=(P-e)/Math.max(d.y,.12);return i.position.set(-d.x*z,e,g-d.z*z),i}function dt(t,e,a,o=9,s={}){const h=[],i=(C,p=[0,0,0])=>(p[0]=he(e[0],a[0],C),p[1]=he(e[1],a[1],C)-o*4*C*(1-C),p[2]=he(e[2],a[2],C),p);for(let C=0;C<=28;C++)h.push(i(C/28).slice());t.cable(h,.11,de(M.hemp,M.hempDark,.55),b.ROPE,0,5);const d=t.info("cableCar"),r=d.g.toGeometry(),g=new k.InstancedBufferGeometry;g.index=r.index;for(const C of["position","normal","color","aMat"])g.setAttribute(C,r.getAttribute(C));const P=s.tint||M.canvas[0];g.setAttribute("iPivot",new k.InstancedBufferAttribute(new Float32Array(3),3)),g.setAttribute("iAt",new k.InstancedBufferAttribute(new Float32Array(3),3)),g.setAttribute("iQuat",new k.InstancedBufferAttribute(new Float32Array([0,0,0,1]),4)),g.setAttribute("iPar",new k.InstancedBufferAttribute(new Float32Array([0,1,s.seed??.37,0]),4)),g.setAttribute("iTint",new k.InstancedBufferAttribute(new Float32Array([P[0],P[1],P[2],0]),4)),g.instanceCount=1;const z=new k.Mesh(g,t.materials.hung);z.frustumCulled=!1,z.name="cable-car";const v=[0,0,0],y=Math.atan2(-(a[2]-e[2]),a[0]-e[0]);z.rotation.y=y;const u=C=>{i(ae(C,0,1),v),z.position.set(v[0],v[1],v[2]);const p=.01,S=i(ae(C-p,0,1)).slice(),O=i(ae(C+p,0,1));z.rotation.z=Math.atan2(O[1]-S[1],Math.hypot(O[0]-S[0],O[2]-S[2]))*.25};return u(.5),{mesh:z,place:u,at:i,triangles:d.g.triangles}}const mt=7;async function At(t,e={}){const a=e.rng||t.rng.fork("heart"),o=!e.kit,s=e.density??1,h={zA:78,zB:-78,yA:62,yB:62,sag:4.5,wA:58,wM:64,wB:58,dish:3,bow:0,cell:1.7,lanes:2,cross:4},n=e.kit||ht(t,{net:Fe(h)}),i=n.net,[d,r]=e.origin||[0,0],g=e.clear||null,P=e.lane||null,z=new k.Group,v=(D,B)=>[d+D,i.y(d+D,r+B),r+B];let y=null;o&&(y=await ut(n,a.fork("patch"),{density:1,figures:14,pigeons:20,far:0,holes:[[26,30,4.5]],yield:t.yield}),z.add(y.surface),await t.yield());const u=e.yaw??.3,C=v(0,0),p=mt,S=n.info("terrace"),O=Math.cos(u),f=Math.sin(u),l=(D,B,j)=>[D*O+j*f,B,-D*f+j*O];n.add("terrace",{pivot:C,rope:p,yaw:u,tint:e.awning||M.canvas[0],seed:a()});const c=p-S.deck,m=p-S.under[1];n.add("chandelierGrand",{pivot:C,at:[0,-(m+3.6),0],rope:3.6,scale:2.2,motion:-.22,seed:a(),glow:1});const w=D=>S.B/2*Math.pow(Math.max(1-Math.pow(Math.abs(D*2-1),2.3),0),.6);for(let D=0;D<16;D++){const B=.1+.8*((D>>1)+.5)/8,j=D%2?1:-1,ee=l((B-.5)*S.L,0,j*(w(B)+.55)),A=a.range(.3,1.4),L=D%5===2;n.add(L?"lamp":a.chance(.5)?"potLong":"pot",{pivot:C,at:[ee[0],-(c-1.5+A),ee[2]],rope:A,scale:L?1.6:a.range(1.1,1.7),yaw:a.range(0,V),seed:a()})}for(const D of[-1,1]){const B=l(D*(S.L/2-2.2),0,0),j=v(B[0],B[2]);n.add("ladderLong",{pivot:j,at:[0,0,0],rope:0,scale:(c+(C[1]-j[1])*-1)/24*1,yaw:u+Math.PI/2,seed:a()});const ee=l(D*4.5,0,-D*(S.B/2+1.6)),A=v(ee[0],ee[2]);n.add("dumbWaiter",{pivot:A,rope:c-1.2,motion:.82,yaw:u,seed:a()});const L=l(D*(S.L/2-4.4),0,D*1.3),F=v(L[0],L[2]);n.add("basket",{pivot:F,rope:c-2.5,scale:1.5,tint:M.canvas[D>0?3:5],motion:.8,seed:a()});const W=l(D*S.L*.2,0,-D*(w(.5+D*.2)+.9));n.add("laundryB",{pivot:C,at:[W[0],-(c-2.4),W[2]],rope:0,yaw:u,scale:1.3,seed:a()})}await t.yield();const x=(D,B,j)=>{const ee=D*O-B*f,A=D*f+B*O;return Math.abs(ee)<S.L/2+j+1.5&&Math.abs(A)<S.B/2+j+1.5},T=[],N=[],E=(D,B)=>{const j=D*O-B*f,ee=D*f+B*O;return Math.abs(j)<S.L/2+5&&Math.abs(ee)<S.B/2+22},K=(D,B,j)=>{if(E(D,B)){if(j.kind!=="solo")return null;j={...j,depth:Math.min(j.depth,9)}}const ee=j.kind==="big"?5.5:j.kind==="gondola"?7:j.kind==="house"?3.4:1.8;if(x(D,B,ee*.8))return null;for(const L of N)if(Math.hypot(L[0]-D,L[1]-B)<L[2]+ee)return null;const A=Se(n,a,v(D,B),{clear:g,lane:P,tint:e.tint,...j});return A&&A.length&&(N.push([D,B,ee]),T.push(...A)),A},_=(D,B,j,ee,A)=>{for(let L=0,F=0;L<j&&F<j*12;F++){const W=a.range(0,V),G=a.range(D,B);K(Math.cos(W)*G,Math.sin(W)*G,{kind:a.pick(ee),depth:A()})&&L++}};_(20,30,Math.round(3*s),["big"],()=>a.range(34,46)),_(16,27,Math.round(10*s),["house","house","small"],()=>a.range(22,50)),await t.yield(),_(27,38,Math.round(4*s),["big","gondola"],()=>a.range(30,44)),_(25,38,Math.round(18*s),["house","house","small","solo"],()=>a.range(16,44)),await t.yield(),_(36,48,Math.round(24*s),["house","small","small","solo","solo"],()=>a.range(10,34)),_(10,46,Math.round(18*s),["solo"],()=>a.range(8,40)),await t.yield();const se=T.filter(D=>/^(sack|big)/.test(D.name));for(let D=0;D<se.length;D++){const B=se[D],j=[B.top[0],B.top[1]+(B.depth-B.info.h*B.sc),B.top[2]],ee=a(),A=D<3?"trapeze":D<5?"rings":D<8?"shower":ee<.2?"hammock":ee<.3?"trapeze":null;if(!A)continue;const L=n.info(A),F=a.range(1.2,3),W=a.range(0,V),G=Math.cos(W)*B.info.R*B.sc*.5,I=Math.sin(W)*B.info.R*B.sc*.5,q=B.depth-B.info.H*B.sc*.2+F;g&&!g(j[0]+G,j[1]-q-L.h*.5,j[2]+I,L.h*.5+1)||P&&!je(L,P,j,G,I,q,F,1,A==="trapeze"?.5:A==="rings"?.3:0)||n.add(A,{pivot:j,at:[B.top[0]-j[0]+G,-q,B.top[2]-j[2]+I],rope:F,yaw:a.range(0,V),swing:A==="trapeze"?.5:A==="rings"?.3:0,seed:a()})}let Z=null;if(o){const D=v(-56,30),B=v(56,6);D[1]-=14,B[1]-=22,Z=dt(n,D,B,7,{tint:M.canvas[2]}),z.add(Z.mesh)}o&&z.add(await n.finish());const U=new k.Vector3(C[0],C[1]-c+3,C[2]);return{object:z,radius:30,height:64,center:o?new k.Vector3(0,34,0):U,ground:!1,kit:n,net:i,strings:T,car:Z,anchors:{terrace:U,hang:new k.Vector3(C[0],C[1],C[2]),deckDepth:c,keelDepth:m,chandelier:new k.Vector3(C[0],C[1]-m-8,C[2]),radius:48},update(D,B,j){o&&(n.update(D,B,j),Z&&Z.place(.5+.48*Math.sin(B*.09)))},dispose(){}}}const vt=`
uniform vec4 uCitySnow;   // ledge snow from (m), full by (m), open snow from (m), full by (m)
uniform vec4 uCityFoot;   // mist full below (m), none above (m), amount, relief of the face
uniform vec3 uCityMist, uCityFill, uCityFillDir, uCityLampCol;
uniform vec4 uCityLamp;   // where the lamps of the anchorage hang (m), and how far their light reaches (m)
vec3 gCityN = vec3(0.); float gCityAO = 1., gCityFoot = 0., gCityFillK = 1., gCityLampK = 0., gCitySun = 1., gCityCrag = 0., gCityBounceK = 0.;
uniform vec3 uCityBounce;
uniform float uCityShadeG[32]; uniform vec4 uCityShadeP; uniform vec2 uCityShadeQ;      // the first mountain's shadow (see sunShade in the kit's shaders)
float citySun(vec3 p){
  float k = clamp((-p.x * uCityShadeP.y + p.z * uCityShadeP.x - uCityShadeQ.x) * uCityShadeP.w, 0., 30.999);
  int i = int(floor(k));
  float H = (p.x * uCityShadeP.x + p.z * uCityShadeP.y) * uCityShadeP.z + mix(uCityShadeG[i], uCityShadeG[i + 1], k - float(i));
  return smoothstep(-uCityShadeQ.y, uCityShadeQ.y, p.y - H);
}
float cityHash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
// a family of parallel cuts one unit apart: x = how far into the dark of the cut, y = which side of it (-1..1)
vec2 cityCut(float c, float wide, float fw) {
  float f = fract(c) - .5, d = .5 - abs(f);
  return vec2((1. - smoothstep(wide * .35, wide + fw + 1e-4, d)) * (1. - smoothstep(.14, .5, fw)), -sign(f) * (1. - smoothstep(0., wide * 3. + fw + 1e-4, d)));
}
`,wt=`
{ vec3 wp = vTWorld; vec3 n0 = normalize(vTNormal);
  vec3 aw = abs(n0); aw *= aw; aw *= aw; aw /= max(aw.x + aw.y + aw.z, 1e-4);
  float face = 1. - smoothstep(.74, .94, n0.y);                       // the steep rock; level ground keeps the kit's look
  float sinB = sqrt(clamp(1. - n0.y * n0.y, .03, 1.));
  // ---- ribs and gullies down the fall line (side projections drawn out in height), and a middle layer at 40 m
  const vec2 sB = vec2(1. / 118., 1. / 310.);
  vec4 bx = texture2D(tDetail, wp.zy * sB + vec2(.13, .71)), bz = texture2D(tDetail, wp.xy * sB + vec2(.57, .29)), by = texture2D(tDetail, wp.xz * (1. / 150.));
  float hB = bx.r * aw.x + by.r * aw.y + bz.r * aw.z;
  vec3 gB = aw.x * vec3(0., (bx.b - .5) * .38, bx.g - .5) + aw.y * vec3(by.g - .5, 0., by.b - .5) + aw.z * vec3(bz.g - .5, (bz.b - .5) * .38, 0.);
  const float sM = 1. / 43.;
  vec4 mx = texture2D(tDetail, wp.zy * sM), mz = texture2D(tDetail, wp.xy * sM + vec2(.31, .47)), my = texture2D(tDetail, wp.xz * sM + vec2(.7, .2));
  float hM = mx.r * aw.x + my.r * aw.y + mz.r * aw.z, vein = mx.a * aw.x + my.a * aw.y + mz.a * aw.z;
  vec3 gM = aw.x * vec3(0., mx.b - .5, mx.g - .5) + aw.y * vec3(my.g - .5, 0., my.b - .5) + aw.z * vec3(mz.g - .5, mz.b - .5, 0.);
  float wob = (hB - .5) * 2.;
  // ---- beds: level, gently dipping, wavy, of uneven thickness; they fade before they get thinner than two pixels
  float sy = wp.y + wob * 4.5 + (hM - .5) * 1.6 + (wp.x * .8 + wp.z * .6) * .07 + 5. * sin(wp.x * .021 + wp.z * .017) + 3. * sin(wp.z * .052 - wp.x * .043 + 2.);      // the beds undulate slowly along the face
  float bs = sy * (1. / 8.5); bs += .3 * sin(bs * 2.1) + .12 * sin(bs * 4.7 + 1.3) + .05 * sin(bs * 9.3 + 4.) + .45 * sin(bs * .9 + wp.x * .013 + wp.z * .009);      // and pinch and swell
  float bW = fwidth(bs), bK = face * (1. - smoothstep(.14, .5, bW));
  float bi = floor(bs), bf = bs - bi, hb = cityHash(vec3(bi, 3., 7.)), hb2 = cityHash(vec3(bi, 11., 5.));
  // ---- joints: master joints through every bed (the buttresses), block joints set off from bed to bed
  vec2 jq = vec2(wp.x * .8 + wp.z * .6, -wp.x * .6 + wp.z * .8);
  vec2 jT = sqrt(clamp(1. - vec2(n0.x * .8 + n0.z * .6, -n0.x * .6 + n0.z * .8) * vec2(n0.x * .8 + n0.z * .6, -n0.x * .6 + n0.z * .8), .0, 1.));   // how squarely each set meets this face
  vec2 jK = smoothstep(.3, .62, jT) * face;
  vec2 jw = vec2(hM - .5, .5 - hM) * 3.2 + wob * 3.;
  // joints wander in slow bends (150 to 330 m long, 4 to 6 m to either side): no straight ruled lines and no scribble
  vec2 jS = vec2(6. * sin(wp.y * .043 + wp.x * .019) + 4. * sin(wp.z * .031 - wp.y * .019 + 1.7), 5. * sin(wp.y * .037 - wp.z * .023 + 4.1) + 4. * sin(wp.x * .029 + wp.y * .021 + .6));
  vec2 mj = (jq + jw * 1.7 + jS * 1.6 + wp.y * vec2(.2, -.15)) * vec2(1. / 37., 1. / 49.);
  vec2 sj0 = (jq + jw + jS) * vec2(1. / 8.4, 1. / 11.6), sjW = fwidth(sj0), sj = sj0 + vec2(hb, hb2) * 7.;
  sj += .3 * sin(sj * 2.3 + vec2(hb2, hb) * 40.) + .1 * sin(sj * 6.1 + 2.);
  vec2 mjW = fwidth(mj);
  vec2 m1 = cityCut(mj.x, .028 * jT.x, mjW.x), m2 = cityCut(mj.y, .024 * jT.y, mjW.y);
  vec2 s1 = cityCut(sj.x, .05 * jT.x, sjW.x), s2 = cityCut(sj.y, .045 * jT.y, sjW.y);
  float sK = bK * (1. - smoothstep(.12, .45, max(sjW.x, sjW.y))) * smoothstep(.46, .62, by.a);      // block joints only in patches: massive rock between
  s1.x *= step(.62, cityHash(vec3(floor(sj.x + .5), bi, 1.))); s2.x *= step(.62, cityHash(vec3(floor(sj.y + .5), bi, 2.)));   // not every joint is open
  s1.y *= step(.62, cityHash(vec3(floor(sj.x + .5), bi, 1.))); s2.y *= step(.62, cityHash(vec3(floor(sj.y + .5), bi, 2.)));
  vec3 idM = vec3(floor(mj), floor(bs * .25)), idS = vec3(floor(sj), bi);
  float tM2 = cityHash(idM), tS = cityHash(idS);
  vec3 facM = vec3(cityHash(idM + 3.1), cityHash(idM + 7.7), cityHash(idM + 1.3)) - .5, facS = vec3(cityHash(idS + 5.3), cityHash(idS + 9.1), cityHash(idS + 2.9)) - .5;
  vec3 axQ = vec3(.8, 0., .6), axR = vec3(-.6, 0., .8);
  float mK = smoothstep(.36, .56, bx.a * aw.x + by.a * aw.y + bz.a * aw.z);      // master joints open in zones of the face only (drawn out in height): massive rock between
  m1 *= mK; m2 *= mK;
  float cut = max(max(m1.x * jK.x, m2.x * jK.y), max(s1.x * jK.x, s2.x * jK.y) * sK * .8);
  // ---- seam under each bed, ledge on top of the bed below
  float dB = min(bf, 1. - bf);
  float hbS = cityHash(vec3(floor(bs + .5), 5., 1.));                 // one value per seam: some are deep, most are hairlines
  float seam = (1. - smoothstep(.02 * sinB, (.03 + .07 * hbS) * sinB + bW, dB)) * bK * (.25 + .75 * hbS * hbS);
  float hard = step(.6, hb);                                           // hard beds stand proud and carry the wide ledges
  float ledW = (.06 + .3 * hard * hb2) * sinB + bW * .5;
  float led = (1. - smoothstep(ledW * .55, ledW, bf)) * bK * (.2 + .8 * hard);
  // ---- AT THE SCALE OF A METRE (round 5): thin beds 1 to 3 m thick inside the great ones, each with a line of shade
  // under its lip and a lighter top; short upright cracks 2 to 4 m apart; the rock's own grain. Worked out in world
  // space in three dimensions (side projections weighted by the face's own normal: nothing is drawn out down the
  // face); every part fades before it gets thinner than two pixels, so it never shimmers
  const float sF = 1. / 6.7;
  vec4 fqx = texture2D(tDetail, wp.zy * sF + vec2(.37, .11)), fqz = texture2D(tDetail, wp.xy * sF + vec2(.83, .59)), fqy = texture2D(tDetail, wp.xz * sF + vec2(.21, .9));
  float hF = fqx.r * aw.x + fqy.r * aw.y + fqz.r * aw.z;
  vec3 gF = aw.x * vec3(0., fqx.b - .5, fqx.g - .5) + aw.y * vec3(fqy.g - .5, 0., fqy.b - .5) + aw.z * vec3(fqz.g - .5, fqz.b - .5, 0.);
  float ts = (sy + (hF - .5) * 1.1) * (1. / 1.9); ts += .28 * sin(ts * 1.7 + wp.x * .11) + .1 * sin(ts * 5.3 + 2.);
  float tW = fwidth(ts), tK = face * (1. - smoothstep(.12, .42, tW));
  float ti = floor(ts), tf = ts - ti, th = cityHash(vec3(ti, 17., 3.));
  float tSeam = (1. - smoothstep(0., .05 + .1 * th + tW, min(tf, 1. - tf))) * tK * (.3 + .7 * th);
  float tLed = (1. - smoothstep(.08, .2 + .25 * th + tW * .5, tf)) * tK * step(.45, th);
  vec2 cq0 = (jq + (hF - .5) * 1.6 + jw * .5) * vec2(1. / 2.7, 1. / 3.4), cW = fwidth(cq0), cq = cq0 + vec2(th, cityHash(vec3(ti, 2., 9.))) * 5.;
  vec2 c1 = cityCut(cq.x, .05 * jT.x, cW.x), c2 = cityCut(cq.y, .05 * jT.y, cW.y);
  float cK = tK * (1. - smoothstep(.1, .4, max(cW.x, cW.y)));
  c1 *= step(.55, cityHash(vec3(floor(cq.x + .5), ti, 4.))); c2 *= step(.6, cityHash(vec3(floor(cq.y + .5), ti, 6.)));
  float crack = max(c1.x * jK.x, c2.x * jK.y) * cK;
  // ---- gullies and ribs
  float gul = (1. - smoothstep(.27, .47, hB)) * face, rib = smoothstep(.52, .76, hB) * face;
  // ---- colour: each block its tone, some beds warm, some dark, lichen in the veins; cuts and gullies dark
  vec3 c = diffuseColor.rgb;
  float rk = face * (1. - gTSnow);
  c *= 1. + rk * (.26 * (tM2 - .5) + .13 * (tS - .5) * sK + .2 * (hb - .5) * bK);
  c = mix(c, c * vec3(1.2, 1.03, .78), rk * bK * .75 * smoothstep(.72, .8, hb2));
  c = mix(c, c * vec3(.6, .64, .72), rk * bK * .8 * (1. - smoothstep(.1, .16, hb2)));
  c = mix(c, c * vec3(.9, .96, .7), rk * .5 * smoothstep(.5, .9, vein) * smoothstep(.45, .6, hM));
  c *= 1. + rk * ((hM - .5) * .5 + .16 * rib);
  c *= 1. - rk * (.42 * cut + .34 * seam + .3 * gul);
  c *= 1. + rk * .3 * led * (1. - seam);
  c *= (1. - rk * (.3 * tSeam + .36 * crack)) * (1. + rk * (.22 * tLed * (1. - tSeam) + (hF - .5) * .34));
  // BY THE CRAG: the far crag is another stone than the first mountain, tawny: gold where the sun strikes it, and its
  // shade takes the sky's blue the more (a rule of the rock by which mountain it is, at every hour)
  gCityCrag = 1. - smoothstep(-340., -240., wp.z);
  c = mix(c, c * vec3(1.34, 1.08, .7), gCityCrag * .85);
  // ---- snow: on the ledges, in the gullies, and over everything that is not too steep high up
  float alt = wp.y + wob * 46. + (hM - .5) * 34.;
  float sLed = smoothstep(uCitySnow.x, uCitySnow.y, alt), sOpen = smoothstep(uCitySnow.z, uCitySnow.w, alt);
  float thr = .66 - .56 * sLed;
  float snL = led * step(.001, sLed) * smoothstep(thr, thr + .14, hM + (vein - .3) * .25) * smoothstep(-.25, .15, n0.y);
  float snG = (1. - smoothstep(.21, .37, hB)) * face * smoothstep(uCitySnow.x + 30., uCitySnow.y + 90., alt) * smoothstep(.38, .5, hM + .25 * sLed);
  float snO = sOpen * smoothstep(.12, .5, n0.y + (hM - .5) * .7 + (hB - .5) * .8 + .3 * sOpen);
  float snT = tLed * smoothstep(.56 - .4 * sLed, .7 - .4 * sLed, hF + (hM - .5) * .4) * (.3 + .7 * smoothstep(-60., 120., alt)) * smoothstep(-.25, .15, n0.y);      // snow lying on the thin beds' tops
  float snow = clamp(max(max(max(snL, snT), snG), snO), 0., 1.) * (1. - gTSnow);
  c = mix(c, uTSnow * mix(vec3(.74, .85, 1.04), vec3(1.), vTShade.x) * (1. + (hM - .5) * .14), snow);
  diffuseColor.rgb = c; gTSnow = max(gTSnow, snow);
  // ---- the light: every block turns its own facet to the sun, cuts are bevelled, ribs and gullies lean, ledges look up
  float rel = uCityFoot.w * rk * (1. - .85 * snow);
  gCityN = rel * (gB * 2.2 + gM * 1.3 + facM * .46 + facS * .3 * sK
    + axQ * (m1.y * .5 * jK.x + s1.y * .34 * jK.x * sK) + axR * (m2.y * .5 * jK.y + s2.y * .34 * jK.y * sK)
    + vec3(0., (seam * .6 - led * .75) * (.6 + .4 * hard), 0.)
    + gF * .95 + axQ * (c1.y * .3 * jK.x * cK) + axR * (c2.y * .3 * jK.y * cK) + vec3(0., tSeam * .5 - tLed * .6, 0.));
  gCityN.y -= .5 * snL * face;
  gCityAO = 1. - rk * (1. - snow) * (.34 * gul + .3 * cut + .25 * seam + .2 * tSeam + .24 * crack);
  gCityAO *= 1. + .25 * rk * rib;
  gCitySun = mix(1., citySun(wp), 1. - smoothstep(-260., -200., wp.z));      // the far crag only: the first mountain does not shade itself by this function
  // ---- the sky's bounce from the side away from the sun, and the lamps of the anchorage
  vec3 nW = normalize(n0 - gCityN);
  gCityFillK = (.62 + .38 * dot(nW, uCityFillDir)) * (.55 + .45 * gCityAO);
  gCityBounceK = gCityCrag * (.6 - .4 * nW.y) * (.45 + .55 * gCityAO);      // the cloud sea's light from below on the crag by the city
  vec3 dl = uCityLamp.xyz - wp; float d2 = dot(dl, dl) / (uCityLamp.w * uCityLamp.w);
  gCityLampK = (.35 + .65 * clamp(dot(nW, dl * inversesqrt(max(dot(dl, dl), 1e-4))), 0., 1.)) / ((1. + d2) * (1. + d2));
  // ---- the foot: one soft, level band of mist (its edge wanders gently along the face, never down it)
  gCityFoot = 1. - smoothstep(uCityFoot.x, uCityFoot.y, wp.y + (by.r - .5) * 44. + (my.r - .5) * 14.); gCityFoot *= gCityFoot * (3. - 2. * gCityFoot) * uCityFoot.z;
}
`;function zt(t,e={}){const a={uCitySnow:{value:new k.Vector4(...e.snow||[10,250,150,420])},uCityFoot:{value:new k.Vector4(e.footLow??-250,e.footHigh??-120,e.footAmount??.9,e.relief??1)},uCityMist:{value:new k.Color(e.mist??"#dfeaf6")},uCityFill:{value:new k.Color(e.fill??"#000000")},uCityFillDir:{value:new k.Vector3(...e.fillDir||[0,1,0]).normalize()},uCityLamp:{value:new k.Vector4(0,0,0,1)},uCityLampCol:{value:new k.Color(e.lampColor??"#000000")},uCityBounce:{value:new k.Color(e.bounce??"#000000")},uCityShadeG:{value:e.shadeG||new Float32Array(32).fill(-1e5)},uCityShadeP:{value:new k.Vector4(...e.shadeP||[0,1,.5,.025])},uCityShadeQ:{value:new k.Vector2(...e.shadeQ||[-620,5])}},o=t.onBeforeCompile;return t.onBeforeCompile=(s,h)=>{o.call(t,s,h),Object.assign(s.uniforms,a),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
`+vt).replace("float dR = mix(.5, tD.r, midF)","float dR = mix(.5, tD.r, midF * flatK)").replace("#include <roughnessmap_fragment>",wt+`
#include <roughnessmap_fragment>`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
  normal = normalize(normal - (viewMatrix * vec4(gCityN, 0.)).xyz);`).replace("#include <aomap_fragment>",`#include <aomap_fragment>
  reflectedLight.directDiffuse *= gCityAO * gCitySun; reflectedLight.directSpecular *= gCitySun; reflectedLight.indirectDiffuse *= .35 + .65 * gCityAO;
  reflectedLight.indirectDiffuse += diffuseColor.rgb * uCityFill * gCityFillK;
  reflectedLight.indirectDiffuse *= mix(vec3(1.), vec3(.8, .95, 1.24), gCityCrag * (1. - gTSnow)); reflectedLight.directDiffuse *= mix(vec3(1.), vec3(1.12, 1.02, .86), gCityCrag * (1. - gTSnow));
  reflectedLight.indirectDiffuse += diffuseColor.rgb * (uCityLampCol * gCityLampK + uCityBounce * gCityBounceK);`).replace("#include <fog_fragment>",`#include <fog_fragment>
  gl_FragColor.rgb = mix(gl_FragColor.rgb, uCityMist, gCityFoot);`)},t.customProgramCacheKey=()=>"city-hung-below-its-net-rock-r5",a}export{Oe as COLORS,qe as NET_DEFAULT,b as PAT,bt as PLUME,J as SWAY,mt as TERRACE_ROPE,De as basketGeo,Je as bicycleGeo,At as buildHero,ut as buildNet,Ze as cableCarGeo,xe as chandelierGeo,Xe as dumbWaiterGeo,zt as faceRock,Ge as figureGeo,lt as goatGeo,me as gondolaGeo,rt as hallGeo,We as hammockGeo,Se as hangString,ye as ladderGeo,Re as lampGeo,Ne as laundryGeo,ot as linkGeo,dt as makeCableCar,ht as makeHungKit,Fe as makeNetFn,St as makeShadowSheet,st as pennantGeo,it as pigeonGeo,tt as plankFarGeo,et as plankGeo,at as postGeo,ge as potGeo,je as reachClear,$e as ringsGeo,ne as sackGeo,Qe as showerGeo,Be as skinsGeo,nt as stringGeo,Ye as trapezeGeo};
