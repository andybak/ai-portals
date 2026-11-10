import*as p from"three";import{clamp as ft,lerp as zt,smoothstep as G}from"../kit/core.js";const so=["#C8202C","#F07A1C","#14A6A0","#141012","#F4C62A","#C4247C","#1B4FA8"],po={red:0,orange:1,turquoise:2,black:3,yellow:4,magenta:5,cobalt:6,green:7,navy:8},Ba={noon:[0,1,2,3],dawn:[5,1,4,3],night:[3,2,5,6]},gt=18.6,Ze=14,ie=Ze-gt,Pt=25.6,no=768,we=1.275,Da=10.2,La=3.275,Oa=2.55,$t=2,lo=1.3,Kt=2.4,Fe=.8,ro=1,te=1.6,Ut=.7,qa=2,Je=.55,Xe=.6,Ra=3.1,Qt=24;function We(w,tt={}){return`
#define MOLA_ECHOES ${w}
#define MOLA_ECHO_P ${(tt.period??2.4).toFixed(3)}
#define MOLA_ECHO_F ${(tt.frac??.5).toFixed(3)}
#define MOLA_ECHO_R ${(tt.reach??1).toFixed(3)}
#define MOLA_ECHO_ONLY ${tt.only??-1}
#define MOLA_ECHO_TAIL ${(tt.tail??3).toFixed(3)}
#define MOLA_ECHO_DOME ${tt.dome?1:0}
#define MOLA_ROAD ${tt.road?1:0}
uniform float uTime;
uniform vec3 uKey;            // toward the key light, world space
uniform vec3 uPal[9];
uniform vec3 uShadowTint;     // violet multiply
uniform vec3 uDepthCol;
uniform vec3 uDepth;          // near, far, max mix
uniform vec3 uLight;          // diamond mix, slide speed, cell size
uniform vec3 uLightCol;       // diamond colour (yellow by day, cobalt for the night livery)
uniform vec4 uEchoA[MOLA_ECHOES];   // xyz position, w size (capsule radius)
uniform vec4 uEchoB[MOLA_ECHOES];   // xyz heading (unit), w strength 0..1
uniform vec4 uEchoC[MOLA_ECHOES];   // three palette indices, w reach in metres
uniform float uEchoDome;      // strength of source 0 on the dome itself (the world eases it out for the drop)
float molaRoadK = 0.0;        // 1 on the road's own cloth (MOLA_ROAD materials set it in main from the cloth's own attribute aRoad); 0 everywhere else
float molaAA(float x, float w){ return clamp(x / max(w, 1e-5) + 0.5, 0.0, 1.0); }
float molaHash(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
// two crossed thread sets 2.5 cm apart; uv in metres, fw = metres per pixel
float molaWeave(vec2 uv, float fw){
  float a = sin(uv.x * 251.3) * 0.5 + 0.5, b = sin(uv.y * 251.3) * 0.5 + 0.5;
  float coarse = sin((uv.x + uv.y) * 31.4) * sin((uv.x - uv.y) * 31.4);
  float k = 1.0 - smoothstep(0.004, 0.012, fw), k2 = 1.0 - smoothstep(0.03, 0.09, fw);
  return 1.0 + 0.06 * k * (a * b * 2.0 - 0.5) + 0.02 * k2 * coarse;
}
// puff shading: half-lambert kept between 0.78 and 1.05
float molaPuff(vec3 n){ return mix(0.78, 1.05, clamp(dot(n, uKey) * 0.5 + 0.5, 0.0, 1.0)); }
// violet multiply; on the warm cloths (orange, yellow, red) the tint turns toward red so the shadow stays in the palette
vec3 molaShadow(vec3 c, float a){
  vec3 t = mix(uShadowTint, vec3(0.55, 0.26, 0.9), smoothstep(0.25, 0.6, c.r - c.b));
  return c * mix(vec3(1.0), t, clamp(a, 0.0, 1.0));
}
// hard-edged light diamonds, 1.5 to 4 m long, sliding and pinching
vec2 molaDiamondLayer(vec2 p, float fw, float seed){
  float c = uLight.z;
  vec2 g = p / c, id = floor(g), f = fract(g) - 0.5;
  float h1 = molaHash(id + seed), h2 = molaHash(id * 1.7 + seed + 9.1);
  f += (vec2(h1, h2) - 0.5) * 0.3;
  float a = 0.15 + 0.2 * h1;
  float b = a * (0.42 + 0.26 * sin(uTime * (0.5 + 0.5 * h2) + h2 * 6.283));
  float d = 1.0 - (abs(f.x) / a + abs(f.y) / max(b, 0.02));
  float dd = d * b * c;                              // metres inside the diamond; its own screen-space change keeps the edge hard on ground seen at a grazing angle
  float w = clamp(fwidth(dd), 1e-5, fw * 1.2), on = step(0.45, h2);
  return vec2(molaAA(dd, w), molaAA(dd - 0.09 - w, w)) * on;      // the lozenge, and the lozenge inside its 9 cm rim
}
// x: the lozenges of light, y: the same without their rim. s scales the lattice (1 on open ground, larger on the slot's floor)
vec2 molaDiamonds(vec3 wp, float fw, float s){
  vec2 p = vec2(wp.x * 0.8 - wp.z * 0.6, wp.x * 0.6 + wp.z * 0.8);
  p.x += uTime * uLight.y; p.y += sin(uTime * 0.21 + p.x * 0.05) * 0.8;
  vec2 m = molaDiamondLayer(p * s, fw * s, 0.0);
  m = max(m, molaDiamondLayer(p * s * 1.31 + vec2(17.3, uTime * 0.11 + 4.1), fw * s * 1.31, 5.0));
  return m * (1.0 - smoothstep(0.5, 1.4, fw * s));
}
// a lozenge of light is a hard cut (an amendment of the brief): a thin rim one shade down, then the light's colour laid
// in at 2.4 times uLight.x, at most 0.8 (a shade under the ring's rim and the turtle's shell, which are the full yellow)
vec3 molaLightOn(vec3 c, vec3 wp, float fw, float up, float s){
  vec2 m = molaDiamonds(wp, fw, s) * up;
  return mix(mix(c, c * 0.62, m.x), uLightCol, min(uLight.x * 2.4, 0.8) * m.y);
}
vec3 molaLight(vec3 c, vec3 wp, vec3 n, float fw){
  float up = smoothstep(0.76, 0.9, n.y) * smoothstep(0.015, 0.08, dot(c, vec3(0.3, 0.5, 0.2)));   // only on cloth that lies near level (on a slope the diamonds would stretch downhill); black cloth stays black
  return molaLightOn(c, wp, fw, up, 1.0);
}
// echo bands: three broad flat bands per period spreading from each swimmer and streaming 3x longer behind it, with
// clean cloth between the groups. The group narrows with distance and is then dropped whole, never blurred: once it
// is under half its full width, or a band would be under about two pixels, it is not drawn. Edges are antialiased
// with the screen-space change of the band distance itself (worked out from dFdx/dFdy taken before the loop), so
// they stay hard on ground seen at a grazing angle.
vec3 molaEcho(vec3 c, vec3 wp, float fw){
  vec3 dWx = dFdx(wp), dWy = dFdy(wp);
  for (int i = 0; i < MOLA_ECHOES; i++) {
    vec4 A = uEchoA[i], B = uEchoB[i];
    if (B.w <= 0.001 || (MOLA_ECHO_ONLY >= 0 && i != MOLA_ECHO_ONLY)) continue;
    vec4 C = uEchoC[i];
    float reach = max(C.w, 1.0) * MOLA_ECHO_R;
    vec3 rel = wp - A.xyz;
    float al0 = dot(rel, B.xyz), k = al0 < 0.0 ? 1.0 / MOLA_ECHO_TAIL : 1.0, al = al0 * k;
    vec3 perp = rel - B.xyz * al0;
    float dl = sqrt(dot(perp, perp) + al * al), d = dl - A.w;
    if (d <= -0.5 || d >= reach) continue;
    float sw = min(B.w, 1.0);
#if MOLA_ECHO_DOME == 1
    if (i == 0) sw *= uEchoDome;
#endif
    float t = sw * (1.0 - 0.6 * smoothstep(0.3 * reach, reach, d));
    vec3 g = (perp + B.xyz * (al * k)) / max(dl, 1e-3);
    float fd = max(abs(dot(g, dWx)) + abs(dot(g, dWy)), 1e-5), aw = fd / MOLA_ECHO_P;
    float f = MOLA_ECHO_F * t * smoothstep(0.4, 0.56, t);       // the group narrows to nothing: a band is there or it is not
    if (f < aw * 7.0) continue;                                 // under about two pixels a band: dropped whole
    float x = fract((d - 2.2 * uTime) / MOLA_ECHO_P);
    float m = molaAA(x, aw) * molaAA(f - x, aw) * molaAA(d, fd);
    vec3 P = clamp(C.xyz, 0.0, 8.0);
#if MOLA_ROAD == 1
    // THE ROAD'S RULE (the designers' ruling of 7 October 14:03; an amendment of the brief): on the road's own cloth an
    // echo's BLACK band is not drawn and the road's cloth lies whole between the bands on either side. It is a rule of
    // the cloth for every swimmer (the loop's every source) whose triple carries the black cloth (palette index 3), and
    // it reads the cloth under the band and nothing else: molaRoadK, the cloth's own attribute. The three bands' own
    // weights (the same edges as below), the black ones taken out where the cloth is the road; elsewhere all three stay.
    float a1 = molaAA(x - f / 3.0, aw), a2 = molaAA(x - f * 2.0 / 3.0, aw);
    vec3 wk = vec3((1.0 - a1) * (1.0 - a2), a1 * (1.0 - a2), a2) * (vec3(1.0) - molaRoadK * (vec3(1.0) - step(0.5, abs(P - 3.0))));
    float ws = wk.x + wk.y + wk.z;
    vec3 e = (uPal[int(P.x + 0.5)] * wk.x + uPal[int(P.y + 0.5)] * wk.y + uPal[int(P.z + 0.5)] * wk.z) / max(ws, 1e-4);
    c = mix(c, e, m * ws);
#else
    vec3 e = uPal[int(P.x + 0.5)];
    e = mix(e, uPal[int(P.y + 0.5)], molaAA(x - f / 3.0, aw));
    e = mix(e, uPal[int(P.z + 0.5)], molaAA(x - f * 2.0 / 3.0, aw));
    c = mix(c, e, m);
#endif
  }
  return c;
}
vec3 molaDepth(vec3 c, float dist){ return mix(c, uDepthCol, uDepth.z * smoothstep(uDepth.x, uDepth.y, dist)); }
// steps (5) to (9) for any cloth: weave, puff, diamonds, echoes, depth
vec3 molaFinish(vec3 c, vec3 wp, vec3 n, vec2 clothUV, float fw, float dist){
  c *= molaWeave(clothUV, fw) * molaPuff(n);
  c = molaLight(c, wp, n, fw);
  c = molaEcho(c, wp, fw);
  return molaDepth(c, dist);
}
`}const yo=We(8);function Wa(w={}){const tt=(w.palette&&w.palette.length>=7?w.palette:so).slice(0,7).concat(["#1E8C4A","#10245E"]),_=Math.max(1,Math.min(24,Math.round(w.echoes??8))),ct=()=>{const J=[];for(let X=0;X<_;X++)J.push(new p.Vector4(0,0,0,0));return J},qt=(w.keyDir?new p.Vector3().copy(w.keyDir):new p.Vector3(.11,.93,.35)).normalize();return{nEcho:_,uniforms:{uTime:{value:0},uKey:{value:qt},uPal:{value:tt.map(J=>new p.Color(J))},uShadowTint:{value:new p.Color("#9088CC")},uDepthCol:{value:new p.Color("#10245E")},uDepth:{value:new p.Vector3(30,260,.35)},uLight:{value:new p.Vector3(.35,.8,5.5)},uLightCol:{value:new p.Color(tt[4])},uEchoA:{value:ct()},uEchoB:{value:ct()},uEchoC:{value:ct()},uEchoDome:{value:1}}}}const ta=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vW; varying vec3 vN; varying float vDist;
`,ea=`
#include <common>
#include <fog_pars_fragment>
varying vec3 vW; varying vec3 vN; varying float vDist;
`;function io(w={}){const tt=w.shared||Wa(w),_=(w.stack||[0,1,2,3]).map(ct=>ct);return new p.ShaderMaterial({fog:!0,side:w.side??p.DoubleSide,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...tt.uniforms,uStackI:{value:new p.Vector4(_[0],_[1],_[2],_[3])},uBand:{value:new p.Vector4(w.bandW??.6,w.cut??0,w.hem??.06,w.bands??4)}},vertexShader:ta+`
attribute float aE; varying float vE; varying vec2 vUv;${w.road?" attribute float aRoad; varying float vRoad;":""}
void main(){
  vE = aE; vUv = uv;${w.road?" vRoad = aRoad;":""}
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp; vDist = length(mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:ea+We(tt.nEcho,{...w.echoOnly!=null?{only:w.echoOnly}:{},road:!!w.road})+`
uniform vec4 uStackI; uniform vec4 uBand; varying float vE; varying vec2 vUv;${w.road?" varying float vRoad;":""}
vec3 stackCol(float i){ return uPal[int((i < 0.5 ? uStackI.x : i < 1.5 ? uStackI.y : i < 2.5 ? uStackI.z : uStackI.w) + 0.5)]; }
void main(){
  float fw = max(length(fwidth(vW)), 1e-4);
  float fe = max(fwidth(vE), 1e-4);
  if (uBand.y > 0.0 && vE > uBand.y) discard;
  float w = uBand.x, top = uBand.w - 1.0;
  float bi = min(floor(vE / w), top), into = vE - bi * w;
  float edge = bi < top ? w - into : 1e3;                 // metres to the next cut edge inward
  if (uBand.y > 0.0) edge = min(edge, uBand.y - vE);
  vec3 c = stackCol(bi);
  c = mix(stackCol(max(bi - 1.0, 0.0)), c, molaAA(into, fe));
  float pk = 1.0 + 0.5 * sin(vUv.x * 12.566 + sin(vUv.y * 3.0 + uTime * 0.7));
  float hem = (1.0 - smoothstep(0.0, uBand.z, edge)) * step(edge, 1e2);
  c *= 1.0 + hem * 0.16 * pk * (1.0 - smoothstep(0.02, 0.2, fe));
  float sh = (1.0 - molaAA(into - uBand.z * 1.6, fe)) * step(0.5, bi);
  c = molaShadow(c, sh * 0.85);
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);${w.road?`
  molaRoadK = molaAA(vRoad - 0.5, max(fwidth(vRoad), 1e-4));   // the road's own cloth (attribute aRoad: 1 on its vertices): see THE ROAD'S RULE in molaEcho`:""}
  c = molaFinish(c, vW, n, vUv, fw, vDist);
  gl_FragColor = vec4(c, 1.0);
  #include <fog_fragment>
}`})}const Ua=`
float nightK = 0.0;
float hemDark(vec3 cloth){ vec3 lw = vec3(0.3, 0.5, 0.2); return (1.0 - smoothstep(0.015, 0.08, dot(uStack[0], lw))) * (1.0 - smoothstep(0.015, 0.08, dot(cloth, lw))); }
void hemNight(vec3 cloth, float k){ nightK = max(nightK, clamp(k, 0.0, 1.0) * hemDark(cloth)); }
float hemFar(vec3 fig){ vec3 lw = vec3(0.3, 0.5, 0.2), lc = dot(uStack[1], lw) < dot(uStack[2], lw) ? uStack[1] : uStack[2]; return smoothstep(0.5, 1.0, length(fig / max(dot(fig, lw), 1e-4) - lc / max(dot(lc, lw), 1e-4))); }   // (NO TWIN: 0 for a cloth of the line's colour or near it, 1 for any other)
vec3 hemNightLay(vec3 c){
  if (nightK <= 0.0) return c;
  vec3 lw = vec3(0.3, 0.5, 0.2), l7 = vec3(0.2126, 0.7152, 0.0722), top = uStack[0];
  vec3 lc = dot(uStack[1], lw) < dot(uStack[2], lw) ? uStack[1] : uStack[2];
  float bw = min(dot(lc, lw), dot(uStack[3], lw)), b7 = min(min(dot(uStack[1], l7), dot(uStack[2], l7)), dot(uStack[3], l7));
  float a = min((0.97 * bw - dot(top, lw)) / max(dot(lc - top, lw), 1e-4), (0.97 * b7 - dot(top, l7)) / max(dot(lc - top, l7), 1e-4));
  return mix(c, mix(top, lc, clamp(a, 0.0, 1.0)), nightK);
}
// a thin line from a to b on the measure x, seen by a pixel that is w of that measure wide: the share of the pixel it fills
float molaLine(float x, float a, float b, float w){ w = max(w, 1e-5); return clamp((min(x + 0.5 * w, b) - max(x - 0.5 * w, a)) / w, 0.0, 1.0); }
vec3 stackAt(float i){ return i < 0.5 ? uStack[0] : i < 1.5 ? uStack[1] : i < 2.5 ? uStack[2] : uStack[3]; }
`,ho=ta+`
attribute vec2 aUV; attribute vec3 aBK; attribute float aDF; varying vec2 vUV; varying vec3 vBK; varying vec2 vKeyUV; varying vec2 vDF; uniform vec3 uKey;
void main(){
  vUV = aUV; vBK = aBK; vDF = vec2(aDF, position.y);
  float rho = length(aUV);
  vec2 dir = rho > 1e-3 ? aUV / rho : vec2(1.0, 0.0);
  float th = rho / ${gt.toFixed(2)};
  mat3 m3 = mat3(modelMatrix);
  vec3 tr = normalize(m3 * vec3(cos(th) * dir.x, -sin(th), cos(th) * dir.y));
  vec3 tp = normalize(m3 * vec3(-dir.y, 0.0, dir.x));
  vKeyUV = dir * dot(uKey, tr) + vec2(-dir.y, dir.x) * dot(uKey, tp);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz; vN = normalize(m3 * normal);
  vec4 mvPosition = viewMatrix * wp; vDist = length(mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,co=w=>ea+We(w,{dome:1})+`
uniform sampler2D uMaze; uniform vec3 uStack[4]; uniform vec4 uFar;
varying vec2 vUV; varying vec3 vBK; varying vec2 vKeyUV; varying vec2 vDF;${Ua}vec3 mazeAt(vec2 uv){ vec4 t = texture2D(uMaze, uv / ${(2*Pt).toFixed(1)} + 0.5); return vec3(t.r * ${we.toFixed(3)}, t.g * ${Oa.toFixed(2)} + ${La.toFixed(3)}, t.b * ${we.toFixed(3)}); }
void main(){
  float fw = max(length(fwidth(vW)), 1e-4);
  // THE LOBE (aBK.y = -1) reads the maze as it is before the lane is cut into it (B), has no lane, and steps down
  // through the cloths to a black rim (aBK.x = 0.4 x metres to its outline)
  vec3 mz = mazeAt(vUV);
  float lobeK = step(vBK.y, -0.5);
  float D = mix(mz.x, min(mz.z, max(vBK.x, 0.0)), lobeK), lane = mix(mz.y, ${Da.toFixed(1)}, lobeK);
  float ex = 0.1;
  vec3 mxp = mazeAt(vUV + vec2(ex, 0.0)), mxm = mazeAt(vUV - vec2(ex, 0.0)), myp = mazeAt(vUV + vec2(0.0, ex)), mym = mazeAt(vUV - vec2(0.0, ex));
  vec3 gxa = mxp - mxm, gya = myp - mym;
  vec2 gr = mix(vec2(gxa.x, gya.x), vec2(gxa.z, gya.z), lobeK);
  float gl = length(gr);
  vec2 g = gl > 1e-4 ? gr / gl : vec2(0.0);
  float kd = dot(g, vKeyUV);                       // > 0: the ridge beside us is on the key side
  // THE CUTS IN TRUE METRES (polish 1). D is metres to a groove's centre only where the maze's lines lie at their own
  // pitch; where they spread (a fork, the hill's steep foot, the ramp that ends a groove 4.5 m from the lane, which is
  // laid in plan metres) D rises more slowly than a metre a metre, and a hem of 0.05, a shadow of 0.035 to 0.11 or a
  // slit of 0.13 measured in D stood too wide (at the rare worst two to eight times): bands lay in shadow and a hem was a smear.
  // gS = D's own rise in a metre of cloth, from the four reads already made 0.1 m to each side (the STEEPER side of
  // each pair, so a crest or a groove's centre between two reads does not read as flat), kept between 0.12 and 1:
  // every distance to a cut's edge below is a difference of D over gS. Where the lines lie at their pitch gS is 1 and
  // nothing changes.
  float D0 = mix(mz.x, mz.z, lobeK);
  vec4 dn = abs(mix(vec4(mxp.x, mxm.x, myp.x, mym.x), vec4(mxp.z, mxm.z, myp.z, mym.z), lobeK) - D0);
  float gS = clamp(length(vec2(max(dn.x, dn.y), max(dn.z, dn.w))) / ex, 0.12, 1.0);
  if (lobeK > 0.5 && max(vBK.x, 0.0) < mz.z) gS = 1.0;   // (the crest's stepped rim is keyed to its outline, not to the maze: it keeps its own measure)
  float fwD = clamp(fwidth(D), fw * 0.25, fw * 3.0);   // the band value's own screen-space change: edges stay hard on a flank seen at a grazing angle
  float lod = smoothstep(0.07, 0.16, fw), fine = 1.0 - smoothstep(0.045, 0.13, fw);
  float t3 = 0.5, t2 = mix(0.31, 0.25, lod), t1 = mix(0.15, 0.25, lod);
  float a3 = molaAA(D - t3, fwD), a2 = molaAA(D - t2, fwD), a1 = molaAA(D - t1, fwD);
  vec3 c = mix(mix(mix(uStack[3], uStack[2], a1), uStack[1], a2), uStack[0], a3);
  // distance into this layer from its own cut edge, and up to the edge of the layer above
  float eUp = (D > t3 ? D - t3 : D > t2 ? D - t2 : D > t1 ? D - t1 : 1.0) / gS;
  float eDn = (D > t3 ? 1.0 : D > t2 ? t3 - D : D > t1 ? t2 - D : t1 - D) / gS;
  // crest slits and lobe cuts on the ridge cloth (no empty ground)
  float br = sin(vUV.x * 2.3 + 1.7 * sin(vUV.y * 0.9)) * sin(vUV.y * 2.3 + 1.7 * sin(vUV.x * 0.8));
  // (cuts are there or not, never faded: the lane margin is a hard line, slits are dropped whole when thin, lobes stay)
  float openL = molaAA(lane - 4.55, clamp(fwidth(lane), 1e-4, 0.5)), open = openL * step(fw, 0.19);
  // THE SLIT stands where it stood, on the line D = 0.87, and is 0.13 m of cloth wide at the most: its far edge is the
  // line D = 1.0 or the line 0.13 m from its near edge, whichever comes first (the same line where gS is 1). Where a
  // ridge's crest is no higher than D = 1.0 the slits of its two flanks meet over it, as they did: 0.26 m at the most.
  float sLo = (D - 0.87) / gS, sHi = min((1.0 - D) / gS, 0.13 - sLo);
  float slit = molaAA(sLo, fw) * molaAA(sHi, fw) * molaAA(br + 0.12, fw * 2.3) * open;
  float gD = clamp(gl / (2.0 * ex), mix(0.08, 0.22, smoothstep(0.1, 0.16, fw)), 1.0);     // D changes slowly on the wide lobes: turn it into metres so the cut edge stays hard
  float eL = min((D - 1.2) / gD, (br - 0.25) / 2.3);
  float lobe = molaAA(eL, clamp(fwidth(eL), fw * 0.2, fw * 2.0)) * openL * step(fw, 0.25);     // dropped whole where its footprint is coarse
  float sEdge = min(min(sLo, sHi), (br + 0.12) / 2.3);     // metres inside the slit from its nearest edge; outside it, minus the metres to it
  c = mix(c, uStack[1], slit); c = mix(c, uStack[2], lobe);
  // (the ridge cloth beside a slit has its hem on EVERY side of the slit: past the far edge too, where live's distance
  // went negative and the whole ridge between two slits was shaded as one hem)
  if (lobe > 0.5) { eUp = 1.0; eDn = eL; } else if (slit > 0.5) { eUp = 1.0; eDn = sEdge; } else if (open > 0.5) eUp = min(eUp, -sEdge);
  // cut shadow, then rolled hem with pucker
  float sw = 0.035 + 0.075 * clamp(kd * 0.8 + 0.45, 0.0, 1.0);
  float sh = (1.0 - molaAA(eDn - sw, fw)) * (0.55 + 0.45 * clamp(kd + 0.5, 0.0, 1.0));
  c = molaShadow(c, sh * mix(0.45, 1.0, fine));
  float pk = 1.0 + 0.45 * sin((vUV.x + vUV.y) * 12.566 + 2.0 * sin(vUV.x * 1.9 - vUV.y * 1.3 + uTime * 0.6));
  float hem = (1.0 - molaAA(eUp - 0.05, clamp(fwidth(D) / gS, fw * 0.25, fw * 3.0))) * fine;   // a hard line: light toward the key, dark away
  vec3 cN = c;                                       // (the cloth as it stands without the pucker and the stitches below, which read the clock and the eye's distance: what the night line's gate reads on the dome)
  float lobeN = (1.0 - hemFar(uStack[2])) * molaAA(eL + 0.26, clamp(fwidth(eL), fw * 0.2, fw * 2.0)) * openL;   // (NO TWIN: 1 within 0.26 m of a lobe cut, when the lobes' cloth is the line's colour)
  hemNight(cN, hem * (0.5 - 1.4 * kd) * (1.0 - lobeN));              // (on black top cloth: full toward the key, none away from it, as the multiply's light and dark)
  c *= 1.0 + hem * (0.03 - 0.24 * kd) * pk;
  // stitches 2 cm inside the hem, near only
  float st = (1.0 - smoothstep(0.0, 0.012, abs(eUp - 0.1))) * step(0.0, sin((vUV.x - vUV.y) * 104.7)) * (1.0 - smoothstep(4.0, 7.0, vDist));
  c *= 1.0 + 0.2 * st * (1.0 - smoothstep(0.004, 0.012, fw));
  // far: every band below a pixel goes to the mean, so the maze never shimmers
  c = mix(c, uFar.rgb, smoothstep(0.3, 0.75, fw) * uFar.a);
  cN = mix(cN, uFar.rgb, smoothstep(0.3, 0.75, fw) * uFar.a);
  // where the hill is cut for the bench round the ends of the bank strip the grid is displaced and a maze
  // or a band keyed to the bank's coordinate would smear over its coarse triangles: that ground is the hill's hem too
  // The line of that ground is where the cut is 0.12 m deep. The grid gives two even measures a vertex (aBK.y: metres
  // the bank's ramp lies under the hill before the gutter's taper; aBK.x: the place on the taper, 0 to 1 on the taper itself and running on beyond both ends) and the depth
  // is worked out of them here, a pixel at a time (polish 1: a yes or no a vertex drew that line as a zigzag of the
  // grid's 0.18 m, 0 to 0.2 m outside the lane margin's line, against the maze's bands and cuts).
  float bkD = vBK.y * (1.0 - smoothstep(0.0, 1.0, vBK.x)), bkW = molaAA(bkD - 0.12, clamp(fwidth(bkD), 1e-4, fw * 3.0));   // (the edge no softer than three pixels of cloth: a grid triangle seen edge on gives a wild fwidth)
  // THE OUTER CREST'S INNER FLANK (aDF = 1 on its contour rows; lobeK): LEVEL tiers keyed to height (vDF.y), 0.8 m bands of
  // the four cloths, each with a lozenge row in true metres, a hem and the shadow of the tier above.
  float moved = molaAA(vDF.x - 0.5, max(fwidth(vDF.x), 1e-4));
  float tq = moved * lobeK;
  // THE CUT UNDER THE RIDGE (the crest only): the maze band ends on the top tread's inner edge, a level contour where aDF
  // steps from 1 to 0 between two rows that lie in the same place. aBK.z = metres of cloth from that cut (9 far from it).
  float cutE = vBK.z, cutF = clamp(fwidth(cutE), 1e-5, fw * 1.2), trd = 0.0;
  if (tq > 0.002) {
    float t = vDF.y / 0.8, kt = floor(t), r = t - kt, ft = max(fwidth(t), 1e-4), m4 = mod(kt, 4.0);
    trd = molaAA(r - 0.95, ft) * step(0.0, t);       // the row's own height key: a riser is the first 0.76 m of its band, the tread the rest (none under the first step); by a pixel's footprint, as every line of the tiers below
    vec3 own = m4 < 0.5 ? uStack[3] : m4 < 1.5 ? uStack[2] : m4 < 2.5 ? uStack[1] : uStack[0];
    vec3 cut = m4 < 0.5 ? uStack[1] : m4 < 1.5 ? uStack[3] : m4 < 2.5 ? uStack[0] : uStack[1];
    float ph = atan(vUV.y, abs(vUV.x) < 1e-4 ? 1e-4 : vUV.x) * 13.05071 + kt * 0.37, x = (fract(ph) - 0.5) * 1.3;
    float lz = 1.0 - (abs(x) / 0.42 + abs(r - 0.42) * 0.8 / 0.17);
    float wl = max(ft * 0.8, fw * 0.4), mg = step(0.15, molaHash(vec2(floor(ph), kt + 70.0))), m = molaAA(lz * 0.17, wl) * mg;
    vec3 cb = mix(own, cut, m);
    cb *= mix(mix(1.0, 0.74, molaAA(r - 0.82, ft)), 1.16, molaAA(r - 0.9, ft));
    float nkT = hemDark(cb) * max(molaLine(r, 0.9, 0.95, ft), (1.0 - molaAA(lz * 0.17, wl)) * molaAA(lz * 0.17 + 0.05, wl) * mg * step(r, 0.42) * hemFar(cut));  // (the night line on a tier: the riser's rolled edge, 4 cm, not the tread; and a cut's own hem under its lower edges)
    float sht = max((1.0 - molaAA(r - 0.1, ft)), m * (1.0 - molaAA(lz * 0.17 - 0.035, ft * 0.8)) * step(0.42, r));
    sht = max(sht, 1.0 - molaAA(cutE - 0.08, cutF));  // the cut shadow of the maze band on the top tread: 0.08 m, as at a riser's foot
    // (the tier change, by a pixel's footprint: half a pixel of the tier below's lit top at this tier's foot, half a pixel of the next tier's shadowed foot at its top)
    vec3 ct = molaShadow(cb, sht * 0.8);
    ct = mix(ct, stackAt(3.0 - mod(kt + 3.0, 4.0)) * 1.16, (1.0 - molaAA(r, ft)) * step(1.0, t));
    ct = mix(ct, molaShadow(stackAt(3.0 - mod(kt + 1.0, 4.0)), 0.8), molaAA(r - 1.0, ft));
    c = mix(c, ct, tq); cN = mix(cN, ct, tq);
    nightK = mix(nightK, nkT * (1.0 - (1.0 - molaAA(r, ft)) * step(1.0, t)) * (1.0 - molaAA(r - 1.0, ft)), tq);   // (the tiers lie over the maze cloth and its line; the tier change lies over the tier's own)
  }
  // the maze band's hem along the cut, the risers' own (a dark line of 0.064 m under a light one of 0.08 m): no fade, no blend
  c *= 1.0 + lobeK * (1.0 - moved) * (0.16 * molaAA(cutE - 0.064, cutF) * molaAA(0.144 - cutE, cutF) - 0.26 * molaAA(0.064 - cutE, cutF));
  hemNight(cN, lobeK * (1.0 - moved) * molaAA(cutE - 0.064, cutF) * molaAA(0.144 - cutE, cutF) * (1.0 - lobeN));
  // THE HILL'S HEM (the dome itself): where its grid is cut or filled for the bench (moved) a maze would smear, and
  // within 4.5 m of the master groove the maze is held off the lane. No level band is laid there (a band would cross
  // the maze's lines): that ground is the RIDGE CLOTH itself, red, sewn with level rows of lozenge cuts 0.8 m apart,
  // a whole number of 1.3 m lozenges round the hill in each row, so the red line of the hill runs on unbroken.
  float mv = max(moved, bkW) * (1.0 - lobeK), hemK = max(mv, (1.0 - openL) * (1.0 - lobeK));
  if (hemK > 0.002) {
    c = mix(c, uStack[0], mv); cN = mix(cN, uStack[0], mv); nightK *= 1.0 - mv;
    float t = vDF.y / 0.8, kt = floor(t), r = t - kt, ft = max(fwidth(t), 1e-4), m4 = mod(kt, 3.0);
    float yr = (kt + 0.42) * 0.8 + ${(-ie).toFixed(2)}, rr = sqrt(max(${(gt*gt).toFixed(2)} - yr * yr, 1.0)), cnt = max(floor(6.2832 * rr / 1.3 + 0.5), 4.0);
    float ph = atan(vUV.y, abs(vUV.x) < 1e-4 ? 1e-4 : vUV.x) / 6.2832 * cnt + kt * 0.37, x = (fract(ph) - 0.5) * 1.3;
    float lz = 1.0 - (abs(x) / 0.42 + abs(r - 0.42) * 0.8 / 0.17);
    float onRidge = max(mv, a3);                  // on the ridge cloth only: the echo groove beside the lane keeps its own cuts
    // (a lozenge is whole or absent: decided once for each when the grid is made, see THE HILL'S HEM ROWS, WHOLE OR ABSENT; its
    // answer is one texel of a table in the texture's corner, fetched whole from the base level: the same at every footprint)
    float wl = max(ft * 0.8, fw * 0.4), mg = step(0.15, molaHash(vec2(floor(ph), kt + 70.0))) * onRidge * hemK * (1.0 - smoothstep(0.3, 0.7, fw)) * step(0.5, texelFetch(uMaze, ivec2(int(clamp(floor(ph), -64.0, 63.0)) + 64, int(clamp(kt, -8.0, 23.0)) + 8), 0).a);
    float m = molaAA(lz * 0.17, wl) * mg;
    vec3 cut = m4 < 0.5 ? uStack[1] : m4 < 1.5 ? uStack[3] : uStack[2];
    c = mix(c, cut, m); cN = mix(cN, cut, m); nightK *= 1.0 - m;
    c = molaShadow(c, m * (1.0 - molaAA(lz * 0.17 - 0.035, ft * 0.8)) * step(0.42, r) * 0.8);
    hemNight(cN, (1.0 - molaAA(lz * 0.17, wl)) * molaAA(lz * 0.17 + 0.05, wl) * mg * step(r, 0.42) * hemFar(cut));   // (the cut's own hem on black top cloth: 5 cm under its lower edges, the side the cut's shadow does not lie on)
  }
  vec3 n = normalize(vN); if (dot(n, vW - cameraPosition) > 0.0) n = -n;
  // the light on the crest's steps: on treads only (trd, the row's own key) and by the face's own flat normal, so a tread
  // takes the light's full law and a riser none (the mesh's smoothed normal is the mean of riser and tread)
  vec3 nf = cross(dFdx(vW), dFdy(vW)), nL = n;
  if (tq > 0.5) nL = (dot(nf, nf) > 1e-16 ? normalize(nf) * sign(dot(nf, n)) : n) * trd;
  c *= molaWeave(vUV, fw) * molaPuff(n);           // (molaFinish, with the light's normal chosen above)
  c = molaLight(c, vW, nL, fw);
  c = hemNightLay(c);                                // (the night's line, after every shade and multiply and after the light: THE NIGHT'S HEM)
  c = molaDepth(molaEcho(c, vW, fw), vDist);
  gl_FragColor = vec4(c, 1.0);
  #include <fog_fragment>
}`,mo=ta+`
attribute vec4 aSQ; attribute float aSF; varying vec4 vSQ; varying float vSF;
void main(){
  vSQ = aSQ; vSF = aSF;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz; vN = vec3(0.0, 1.0, 0.0);
  vec4 mvPosition = viewMatrix * wp; vDist = length(mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fo=w=>ea+We(w,{period:1.6,frac:.5,reach:.6,only:1,tail:1.3})+`
uniform vec3 uStack[4]; uniform vec4 uTer; varying vec4 vSQ; varying float vSF;${Ua}// uTer: the terrace's lowest level, its tier rise, the winding. vSQ: s along the slot (m), q across the profile (m, signed), bend 0..1, w = true metres per q unit on a riser. vSF: the face's own metres along the sweep (aSF)
// q: 0..0.7 floor; then three steps of 1.1 (riser 0.71, hem 0.15, tread 0.24; the third tread is the ridge
// shoulder, to 4.75); beyond 4.75 the outer face of the rampart: three risers of 0.8 with 0.15 ledges, then base cloth
// q from 20 on: the BANK on the uphill side, three cloth steps up to the dome (20 + step k + 0..0.8 riser, 0.8..1 tread)
float lozenge(float x, float y, float hx, float hy){ return 1.0 - (abs(x) / hx + abs(y) / hy); }
// the main row of a riser is a different mola panel every 14 m: slits, a zigzag, stepped crosses, a row of small fish.
// Returns metres inside the cut (x along the slot within a 0.95 m cell, y up the riser from the row's centre line).
float motif(float kind, float x, float y){
  if (kind < 0.5) return 0.115 * lozenge(x, y, 0.26, 0.115);
  if (kind < 1.5) return 0.045 - abs(y + 0.13 - abs(x) * 0.8) * 0.78;
  if (kind < 2.5) return max(max(min(0.27 - abs(x), 0.045 - abs(y)), min(0.085 - abs(x), 0.17 - abs(y))), min(0.18 - abs(x), 0.105 - abs(y)));
  x /= 0.84; y /= 0.84;
  return 0.84 * max(0.1 * lozenge(x + 0.07, y, 0.27, 0.1), min(min(x - 0.15, 0.37 - x), (x - 0.15) * 0.75 - abs(y)));
}
// which main row a terrace tier carries: big lozenges, or stepped crosses on every third (no zigzag on the hill: beside
// the level hems it read as a sawtooth seam)
float tierKind(float k){ return mod(k + 2.0, 3.0) > 1.5 ? 2.0 : 0.0; }
// A TALL RISER'S CLOTH (the bank's steps and the terrace's tiers), laid out in TRUE metres: one main row (kind 0 big
// lozenges cut three cloths deep, 1 a zigzag band with lozenges in its bays, 2 stepped crosses), a small staggered row
// at the foot and a piping line under the hem when the riser is tall enough. x: metres along, ym: metres up from the
// foot, Ht: the riser's height here. On a riser under about a metre it is the old single lozenge row.
vec3 tierCloth(vec3 own, vec3 cA, vec3 cB, vec3 cC, float kind, float s, float ym, float Ht, float fy, float fs, float fwm, float seed, out float sh){
  float P = 1.3, x = (fract(s / P) - 0.5) * P, w = max(fy, fs * 0.5);
  float tall = step(1.05, Ht), some = step(0.3, Ht), hy = min(0.36, Ht * 0.27), hx = hy * 1.55, yc = Ht * 0.47 + 0.05 * tall, y = ym - yc, dT = Ht - ym;
  float d = hy * (1.0 - (abs(x) / hx + abs(y) / hy)), d2 = -1.0;
  if (kind > 0.5 && kind < 1.5) {
    float q2 = s / (2.0 * P), tz = 4.0 * abs(fract(q2) - 0.5) - 1.0;
    d = 0.14 - abs(y - hy * 0.72 * tz) * 0.76;
    float bx = (fract(q2 + 0.5 * step(0.0, y)) - 0.5) * 2.0 * P;
    d2 = 0.1 * (1.0 - (abs(bx) / 0.27 + abs(abs(y) - hy * 0.8) / 0.1));
  } else if (kind > 1.5) {
    float ax = abs(x) / 1.7, ay = abs(y) / 1.7;
    d = 1.7 * max(max(min(0.27 - ax, 0.05 - ay), min(0.09 - ax, 0.17 - ay)), min(0.18 - ax, 0.11 - ay));
    float bx = (fract(s / P + 0.5) - 0.5) * P;
    d2 = 0.1 * (1.0 - (abs(bx) / 0.17 + abs(y) / 0.1));
  }
  float gap = kind < 0.5 ? step(0.12 * (1.0 - tall), molaHash(vec2(floor(s / P), seed))) : 1.0;
  float m1 = molaAA(d, w) * some * gap, m2 = molaAA(d - 0.105, w) * step(0.26, hy) * gap, m3 = molaAA(d - 0.2, w) * step(0.3, hy) * gap * step(kind, 0.5);
  vec3 c = mix(own, cA, m1); c = mix(c, cB, m2); c = mix(c, cC, m3);
  hemNight(c, (1.0 - molaAA(d, w)) * molaAA(d + 0.05, w) * some * gap * step(y, 0.0) * hemFar(cA) * mix(1.0, hemFar(cB), step(0.26, hy)));   // (a cut's own hem on black top cloth: 5 cm under its lower edges; NO TWIN: the cut's cloth, and its second cloth where it has one)
  float mb = molaAA(d2, w) * tall;
  c = mix(c, cB, mb);
  float x2 = (fract(s / 0.65 + 0.25) - 0.5) * 0.65, l2 = 0.055 * (1.0 - (abs(x2) / 0.16 + abs(ym - 0.2) / 0.055));
  float mf = molaAA(l2, max(fy, fs * 0.4)) * tall * (1.0 - smoothstep(0.08, 0.2, fwm));
  c = mix(c, cB, mf);
  float pp = molaAA(0.026 - abs(dT - 0.15), fy) * (1.0 - smoothstep(0.08, 0.2, fwm)) * step(0.55, Ht);
  c = mix(c, cA, pp); nightK *= (1.0 - mb) * (1.0 - mf) * (1.0 - pp);   // (the bays' lozenges, the foot row and the piping lie over the night's line)
  float into = d < 0.105 ? d : (d < 0.2 ? d - 0.105 : d - 0.2);
  sh = max(max(m1 * (1.0 - molaAA(into - 0.04, fy)) * step(0.0, y), mb * (1.0 - molaAA(d2 - 0.03, fy))), mf * (1.0 - molaAA(l2 - 0.02, fy)));
  return c;
}
// THE HILL BEHIND THE BOWL (polish 1, order 2; the designers' YES of 11 Oct). Above the terrace's last real tier the
// tier law ran past its end (ci = mod(5 - kt, 4) gives the FLOOR cloth for tier 2) and the bowl's rim wall stood as a
// flat face of the floor cloth (black by noon and dawn, cobalt by night), which reads as a hole. There the rim wall and the back seam's plate are the hill
// itself: the RIDGE CLOTH of the look's own stack, sewn with THE HILL'S HEM of domeFrag carried on: the same rows by
// world height (0.8 m apart, the same cut cloth by row, the same gaps' law), so a row of the hill runs on over the wall
// at its own level. Along the wall the lozenges are laid by THE WALL'S OWN METRES (wm: aSF, 1.3 m each as on the hill;
// polish 2, f: keyed to the azimuth about the dome's axis they stood pulled 1.5 to 2 times where a wall runs in toward
// that axis). No light on it, as on no wall. A row is whole or absent: none whose lozenges would stand within
// 0.15 m of the join (yJ, the last tier's top, where the tier's own hem line lies under it); the cloth's foot lies in
// the join's violet shadow, 0.1 m, as every riser's foot does. No fade at the join (the lozenges keep the hill's own footprint filter).
float terHl;                                        // the night's light line on a painted wall (hemNight): 6 cm of a tier's hem, a hill row's cuts
vec3 hillWall(float wm, float yJ, float fy, float fwm, out float sh){
  float t = vW.y / 0.8, kt = floor(t), r = t - kt, ft = max(fy / 0.8, 1e-4), m4 = mod(kt, 3.0);
  float ph = wm / 1.3 + kt * 0.37, x = (fract(ph) - 0.5) * 1.3;     // (polish 2, f: the lozenges by the wall's own metres, 1.3 m each as on the hill)
  float lz = 1.0 - (abs(x) / 0.42 + abs(r - 0.42) * 0.8 / 0.17);
  float wl = max(ft * 0.8, fwm * 0.4), mg = step(0.15, molaHash(vec2(floor(ph), kt + 70.0))) * step(yJ + 0.32, (kt + 0.42) * 0.8) * (1.0 - smoothstep(0.3, 0.7, fwm));
  float m = molaAA(lz * 0.17, wl) * mg;
  terHl = (1.0 - molaAA(lz * 0.17, wl)) * molaAA(lz * 0.17 + 0.05, wl) * mg * step(r, 0.42);   // (the night's line: a cut's own hem under its lower edges, as on the hill)
  vec3 cut = m4 < 0.5 ? uStack[1] : m4 < 1.5 ? uStack[3] : uStack[2];
  terHl *= hemFar(cut);                               // (NO TWIN)
  sh = max(m * (1.0 - molaAA(lz * 0.17 - 0.035, ft * 0.8)) * step(0.42, r) * 0.889, (1.0 - molaAA(vW.y - yJ - 0.1, fy)) * 0.8);   // (0.889 x the 0.9 of main = the hill's own 0.8)
  return mix(uStack[0], cut, m);
}
// THE RAMPART'S BASE WALL BESIDE THE TERRACE, ABOVE THE LAST REAL TIER (polish 2, order 4). The terrace's tiers go on up
// this wall, level, to the floor band at the foot of the wall's own three risers. Above the last real tier no tier
// stands beside the wall to carry a row on, and a row laid as it comes is cut by the wall's two ends and by the band's
// edge, which slants across the level tiers. There each row is FITTED TO THE WALL (uTw, from the wall's own triangles:
// its two ends as lines ws = e0 + e1 y, the band's edge as a parabola of ws, each laid a little inside the true line)
// and drawn here, figure by figure, by the tall riser's own measures (tierCloth's: the lozenge three cloths deep, the
// stepped cross, the bay lozenge, the foot row, the piping):
// THE MAIN ROW: whole cells from end to end of the wall, as many as go without the cell falling under 0.87 of the
// cloth's 1.3 m. In a narrower cell the figure is that much SHORTER ALONG THE ROW and keeps its height (so a row holds
// as much figure cloth over its length as the row laid as it comes); in a wider one it keeps its size. Where the
// band stands lower over a figure than the figure is high, the figure is made smaller, both ways alike, until it
// stands whole between the foot row and the band over its own length (twFit; none under a quarter of its size).
// THE FOOT ROW is fitted the same way to the wall's ends at its own height, at the main row's measure: whole cells,
// as many as go without the cell falling under the main row's share of its own 0.65 m (the lozenge as much shorter
// along the row as the cell), each small lozenge made smaller, both ways alike, where the band stands low over it
// (none under a quarter). Between two crosses that both stand, A BAY LOZENGE on the line midway between their two
// centres' heights, made smaller where the band stands low over it. THE PIPING runs as on every tier, where the band
// leaves it in sight.
// Nothing is cut by an end or by the band; where there is no room there is no figure.
uniform vec4 uTw[2];
uniform float uRim;                                 // the rim wall's own metres (vSF) where the bank's middle step comes within 0.2 m of the wall's top (the night's hem, NO TWIN)
// the largest size at which a figure stands whole under the band (0.05 m clear of it): the figure centred at cx on the
// row's metres, e long to each side at its full size, rising at its full size by rise above the height base over the
// tier's foot yF (the band's edge by its height and slope at cx; its bend over the figure's length taken off whole)
float twFit(float cx, float e, float yF, float base, float rise){
  float a = cx - uTw[1].x, q = uTw[1].w;
  return (uTw[1].y + a * (uTw[1].z + a * q) - yF - 0.05 - abs(q) * e * e - base) / (rise + abs(uTw[1].z + 2.0 * q * a) * e);
}
float twCell(float lo, float pit, float n, float k, float e, float yF, float rise){     // how large cell k's main figure stands under the band: 1 the row's size, 0 none
  if (k < 0.0 || k > n - 0.5) return 0.0;
  float z = twFit(lo + (k + 0.5) * pit, e, yF, 0.3, rise);
  return z < 0.25 ? 0.0 : min(z, 1.0);
}
float twOff(float v){ return abs(v) < 1e-4 ? 1e-4 : v; }                                     // a pitch is a divisor below: held off zero (the wall's two fitted ends could meet at a tier's level)
vec3 wallTier(vec3 own, vec3 cA, vec3 cB, vec3 cC, float kt, float ws, float ym, float Ht, float fy, float fs, float fwm, out float sh){
  float yF = uTer.x + kt * uTer.y, kd = tierKind(kt), nk = 1.0 - smoothstep(0.08, 0.2, fwm);
  // the main row (the wall's ends where they stand nearest over the figures' heights, 0.3 to 1.4 m up)
  float hi = uTw[0].x + uTw[0].y * (uTw[0].y < 0.0 ? yF + 1.4 : yF + 0.3), lo = uTw[0].z + uTw[0].w * (uTw[0].w > 0.0 ? yF + 1.4 : yF + 0.3);
  float n = floor((hi - lo) / 1.131 + 0.001), pit = twOff((hi - lo) / max(n, 1.0)), sc = min(pit / 1.3, 1.0);
  float u = (ws - lo) / pit, ck = floor(u), yc = Ht * 0.47 + 0.05, rise = yc - 0.3 + (kd > 1.5 ? 0.289 : 0.36), e = (kd > 1.5 ? 0.46 : 0.56) * sc;
  float z = twCell(lo, pit, n, ck, e, yF, rise), Z = max(z, 0.25), xa = (ws - lo - (ck + 0.5) * pit) / (sc * Z), y = (ym - 0.3) / Z + 0.3 - yc, wA = max(fy, fs * 0.5 / sc) / Z, d;
  if (kd > 1.5) { float ax = abs(xa) / 1.7, ay = abs(y) / 1.7; d = 1.7 * max(max(min(0.27 - ax, 0.05 - ay), min(0.09 - ax, 0.17 - ay)), min(0.18 - ax, 0.11 - ay)); }
  else d = 0.36 * (1.0 - (abs(xa) / 0.558 + abs(y) / 0.36));
  float on = step(0.001, z), m1 = molaAA(d, wA) * on;
  vec3 c = mix(own, cA, m1); c = mix(c, cB, molaAA(d - 0.105, wA) * on); c = mix(c, cC, molaAA(d - 0.2, wA) * on * step(kd, 0.5));
  hemNight(c, (1.0 - molaAA(d, wA)) * molaAA(d + 0.05, wA) * on * step(y, 0.0) * hemFar(cA) * hemFar(cB));     // (a cut's own hem on black top cloth, as on every tall riser)
  float into = d < 0.105 ? d : (d < 0.2 ? d - 0.105 : d - 0.2);
  sh = m1 * (1.0 - molaAA(into - 0.04, fy / Z)) * step(0.0, y);
  float mb = 0.0, d2 = -1.0, zb = 0.0;
  if (kd > 1.5) {                                      // the bay between two crosses
    float kb = floor(u + 0.5), za = twCell(lo, pit, n, kb - 1.0, e, yF, rise), zc = twCell(lo, pit, n, kb, e, yF, rise), wb = lo + kb * pit, cy = 0.3 + (yc - 0.3) * 0.5 * (za + zc);
    if (min(za, zc) > 0.0) zb = min(twFit(wb, 0.18 * sc, yF, cy, 0.1), 1.0);
    if (zb >= 0.25) { d2 = 0.1 * zb * (1.0 - (abs(ws - wb) / (0.17 * zb * sc) + abs(ym - cy) / (0.1 * zb))); mb = molaAA(d2, max(fy, fs * 0.5 / sc)); }
  }
  // the foot row (the wall's ends over its own heights, up to 0.3 m)
  float h2 = uTw[0].x + uTw[0].y * (uTw[0].y < 0.0 ? yF + 0.3 : yF), l0 = uTw[0].z + uTw[0].w * (uTw[0].w > 0.0 ? yF + 0.3 : yF);
  float n2 = floor((h2 - l0) / (0.65 * sc) + 0.001), p2 = twOff((h2 - l0) / max(n2, 1.0)), s2 = min(p2 / 0.65, 1.0);
  float j = floor((ws - l0) / p2), wj = l0 + (j + 0.5) * p2, l2 = -1.0, mf = 0.0;
  float zf = j < 0.0 || j > n2 - 0.5 ? 0.0 : min(twFit(wj, 0.17 * s2, yF, 0.0, 0.26), 1.0);
  if (zf >= 0.25) { l2 = 0.055 * zf * (1.0 - (abs(ws - wj) / (0.16 * zf * s2) + abs(ym - 0.2 * zf) / (0.055 * zf))); mf = molaAA(l2, max(fy, fs * 0.4 / s2)) * nk; }
  float pp = molaAA(0.026 - abs(Ht - ym - 0.15), fy) * nk * step(0.55, Ht);
  c = mix(c, cB, max(mb, mf)); c = mix(c, cA, pp); nightK *= (1.0 - mb) * (1.0 - mf) * (1.0 - pp);
  sh = max(sh, max(mb * (1.0 - molaAA(d2 - 0.03 * zb, fy)), mf * (1.0 - molaAA(l2 - 0.02 * zf, fy))));
  return c;
}
// THE TERRACE'S TIERS PAINTED ON A WALL that stands beside them (the rampart's foot, the bowl's rim wall): the same
// cloths, level by world height, their rows running on along the lane azimuth (ws), so wall and tier read as one hill.
// hill = 1 (the rim wall and the plate, above the last real tier): not a tier but the hill, see hillWall.
// hill = -1 (the rampart's base wall): the tiers go on past the last real one, their rows there fitted to the wall (wallTier).
vec3 terWall(float ws, float wm, float fy, float fs, float fwm, float hill, out float shade, out float sh){
  terHl = 0.0;
  float ty = max(vW.y - uTer.x, 0.0) / uTer.y, kt = min(floor(ty), 9.0), ym = (ty - kt) * uTer.y, Ht = uTer.y - 0.2, ci = mod(5.0 - kt, 4.0), shT;
  if (hill > 0.5) {                                 // (the join, by a pixel's footprint: half a pixel of the last tier's lit hem at the hill cloth's foot)
    float yJ = uTer.x + ${$t.toFixed(1)} * uTer.y, wP = 1.0 - molaAA(vW.y - yJ, fy);
    vec3 ch = hillWall(wm, yJ, fy, fwm, sh); shade = mix(1.0, 1.17, wP); sh *= 1.0 - wP; return ch;
  }
  vec3 ownT = ci < 0.5 ? uStack[0] : ci < 1.5 ? uStack[1] : ci < 2.5 ? uStack[2] : uStack[3];
  vec3 tA = ci < 0.5 ? uStack[1] : ci < 1.5 ? uStack[3] : ci < 2.5 ? uStack[3] : uStack[1];
  vec3 tB = ci < 0.5 ? uStack[2] : ci < 1.5 ? uStack[2] : ci < 2.5 ? uStack[1] : uStack[0];
  vec3 tC = ci < 0.5 ? uStack[3] : ci < 1.5 ? uStack[0] : ci < 2.5 ? uStack[0] : uStack[2];
  vec3 c = ownT; shade = 1.0; sh = 0.0;
  if (ym < Ht) {
    if (hill < -0.5 && kt > ${($t-.5).toFixed(1)}) c = wallTier(ownT, tA, tB, tC, kt, ws, ym, Ht, fy, fs, fwm, shT); else
    c = tierCloth(ownT, tA, tB, tC, tierKind(kt), ws + kt * 0.37, ym, Ht, fy, fs, fwm, kt + 60.0, shT);
    sh = max(shT, max(1.0 - molaAA(Ht - ym - 0.07, fy), (1.0 - molaAA(ym - 0.1, fy)) * 0.8));
    // (its lines by a pixel's footprint: toward the hem's dark line above, and at its foot half a pixel of the tier below's lit hem)
    float wT = molaAA(ym - Ht, fy), wP = (1.0 - molaAA(ym, fy)) * step(0.5, kt);
    shade = mix(mix(1.0, 0.74, wT), 1.17, wP); sh *= (1.0 - wT) * (1.0 - wP); c = mix(c, stackAt(mod(ci + 1.0, 4.0)), wP); nightK *= 1.0 - wP;
  } else {                                            // its hem: a dark line, a light line; then the next tier's shadowed foot (above the last tier the hill's, but on the rampart's base wall, where the tiers go on)
    float wB = 1.0 - molaAA(ym - Ht, fy), wN = molaAA(ym - uTer.y, fy);
    shade = mix(mix(mix(0.74, 1.17, molaAA(ym - Ht - 0.09, fy)), 1.0, wB), 1.0, wN); sh = max(wB, 0.8 * wN);
    c = mix(c, kt > ${($t-1.5).toFixed(1)} && hill > -0.5 ? uStack[0] : stackAt(mod(ci + 3.0, 4.0)), wN);
    terHl = molaLine(ym, Ht + 0.09, Ht + 0.15, fy);
  }
  return c;
}
void main(){
  float fw = max(length(fwidth(vW)), 1e-4);
  float s = vSQ.x, a = abs(vSQ.y), side = vSQ.y < 0.0 ? 1.0 : 0.0;
  float tierF = a > 29.0 ? mod(a - 30.0, 4.0) : 0.0;
  // the rampart's base wall beside the terrace carries the terrace's own LEVEL tiers (world height, lane azimuth)
  float wx = uTer.z * vW.x, wAz = atan(vW.z, abs(wx) < 1e-4 ? 1e-4 : wx), wS = (1.75 - wAz) * length(vW.xz);
  float wFy = max(fwidth(vW.y), 1e-4), wFs = max(fwidth(wS), 1e-4);
  float hillK = step(${($t-.5).toFixed(1)}, floor(max(vW.y - uTer.x, 0.0) / uTer.y));     // above the terrace's last real tier (the tier index terWall itself counts)
  float fq = max(fwidth(vSQ.y), 1e-4), fs = max(fwidth(s), 1e-4), fF = max(fwidth(vSF), 1e-4);
  vec3 nn = cross(dFdx(vW), dFdy(vW));
  vec3 n = dot(nn, nn) > 1e-16 ? normalize(nn) : vec3(0.0, 1.0, 0.0);
  if (dot(n, vW - cameraPosition) > 0.0) n = -n;
  float k = clamp(floor((a - 0.7) / 1.1), 0.0, 2.0);
  float rq = a - (0.7 + 1.1 * k);
  vec3 c; float shade = 1.0, sh = 0.0, hl = 0.0;       // hl: 1 on a hem's LIGHT line (hemNight gathers it on black top cloth)
  // BY A PIXEL'S FOOTPRINT (polish 2, g): a line of this cloth that was a yes or no (a hem's dark and light, a tread's
  // edge, a ledge, a band, the change of cloth at a step's corner) is softened over one pixel of its own measure (fq, fy:
  // q's and a riser's metres to a pixel). Where the cloth changes at such a line, eC is the cloth on the far side of it
  // and eW that cloth's share of the pixel (a half on the line itself, nothing a pixel away).
  vec3 eC = vec3(0.0); float eW = 0.0;
  float fine = 1.0 - smoothstep(0.03, 0.1, fw), nearK = 1.0 - smoothstep(5.0, 9.0, vDist);
  float bend = min(vSQ.z, 1.0), dash = step(0.0, sin(s * 104.7));
  if (vSQ.z > 1.5) {                                  // the back seam's plate at the mouth: the apron's tiers, level by world height; above them the hill
    c = terWall(wS, vSF, wFy, wFs, fw, hillK, shade, sh); hl = terHl;
  } else if (a < 0.7) {                               // the black floor: two rows of slits and a dashed centre seam
    c = uStack[3];
    float cell = floor(s / 0.8 + side * 0.5), x = fract(s / 0.8 + side * 0.5) - 0.5;
    float h = molaHash(vec2(cell, side + 3.0));
    float lz = lozenge(x * 0.8, a - 0.4, 0.27, 0.12);
    float m = molaAA(lz * 0.12, max(fq, fs * 0.33)) * step(0.2, h);
    c = mix(c, h > 0.6 ? uStack[1] : uStack[2], m);
    float lc = lozenge((fract(s / 1.2) - 0.5) * 1.2, a, 0.4, 0.085);
    float mc = molaAA(lc * 0.085, max(fq, fs * 0.2));
    c = mix(c, uStack[0], mc);
    sh = max(1.0 - molaAA(0.7 - a - 0.14, fq), max(m * (1.0 - molaAA(lz * 0.12 - 0.035, fq)) * step(a, 0.4), mc * (1.0 - molaAA(lc * 0.085 - 0.025, fq)) * side));
    eC = uStack[2]; eW = molaAA(a - 0.7, fq);          // (the first riser's foot)
  } else if (a < 4.75) {
    vec3 own = k < 0.5 ? uStack[2] : k < 1.5 ? uStack[1] : uStack[0];
    vec3 under = k < 0.5 ? uStack[3] : k < 1.5 ? uStack[2] : uStack[1];
    vec3 pipe = k < 0.5 ? uStack[1] : k < 1.5 ? uStack[3] : uStack[2];
    c = own;
    if (rq < 0.71) {                                  // riser: a small mola of its own, laid out in TRUE metres
      // hm = metres of cloth per q unit on this riser (1 on a full 0.8 m step; less where the wall is lowered at a window,
      // at the mouth and on the crown), so ym is metres up from the riser's foot and Ht its real height: a motif is
      // either drawn at its own size or left out, never squashed
      float hm = max(vSQ.w, 0.0), Ht = 0.71 * hm, ym = rq * hm, dT = Ht - ym, fy = max(fq * hm, 1e-4);
      { float wF = 1.0 - molaAA(ym, fy), wT = molaAA(-dT, fy); if (wF > wT) { eC = molaShadow(under, 0.9); eW = wF; } else { eC = own * 0.74; eW = wT; } }   // (its foot: the floor or the tread below, in the wall's shadow; its top: the hem's dark line)
      float seg = floor(s / 14.0), xs = s - seg * 14.0;
      float ci = floor(xs / 0.7), x = (fract(xs / 0.7) - 0.5) * 0.7;        // 20 cells to a panel: no motif is cut by a panel's end
      // where the wall is lowering, "tall enough for the motif" is decided ONCE PER 0.7 m CELL (the riser's height carried
      // back to the cell's centre along s, less its fall across half the cell), so a zigzag or a cross is whole or absent
      vec2 gS = vec2(dFdx(s), dFdy(s)), gH = vec2(dFdx(hm), dFdy(hm));
      float gs = clamp(dot(gH, gS) / max(dot(gS, gS), 1e-8), -1.0, 1.0);
      float HtC = 0.71 * (hm - gs * x - abs(gs) * 0.34);
      float full = step(0.56, HtC), some = step(0.24, HtC), kind = mod(seg + k + side * 2.0, 4.0) * full;
      float h = molaHash(vec2(seg * 20.0 + ci, k * 7.0 + side));
      if (molaHash(vec2(seg, 23.0 + side)) > 0.5) { vec3 sw = under; under = pipe; pipe = sw; }   // the two cut colours swap by panel
      float yc = mix(Ht * 0.5 - 0.01, Ht - 0.36, full), ys = mix(min(1.0, Ht * 0.3 / 0.115), 1.0, full);
      float dm = motif(kind, x, (ym - yc) / max(ys, 0.05)) * ys;               // main row: this panel's motif
      float inner = step(0.5, ci) * step(ci, 18.5);
      float m = molaAA(dm, max(fy, fs * 0.45)) * (kind > 0.5 && kind < 1.5 ? 1.0 : step(0.12, h)) * inner * some;
      float xm = xs - 14.0 * step(7.0, xs), dj = 0.17 * lozenge(xm, ym - yc, 0.2, 0.17);   // a diamond medallion on the joint of two panels
      float mj = molaAA(dj, max(fy, fs * 0.8)) * step(0.56, 0.71 * (hm - gs * xm - abs(gs) * 0.2));
      float x2 = (fract(xs / 0.35) - 0.5) * 0.35;
      float h2 = molaHash(vec2(seg * 40.0 + floor(xs / 0.35), k * 3.0 + side + 40.0));
      float l2 = lozenge(x2, ym - 0.1, 0.12, 0.05);                                // second, staggered row at the foot
      float m2 = molaAA(l2 * 0.05, max(fy, fs * 0.4)) * step(0.3, h2) * (1.0 - smoothstep(0.05, 0.14, fw)) * step(0.62, Ht);
      c = mix(c, under, m);
      c = mix(c, pipe, max(m2, mj));
      hemNight(c, (1.0 - molaAA(dm, max(fy, fs * 0.45))) * molaAA(dm + 0.05, max(fy, fs * 0.45)) * (kind > 0.5 && kind < 1.5 ? 1.0 : step(0.12, h)) * inner * some * step(ym, yc) * (1.0 - max(m2, mj)) * hemFar(under) * hemFar(pipe));   // (a cut's own hem on black top cloth; NO TWIN: neither of the riser's two cut cloths)
      float pp = molaAA(0.026 - abs(dT - 0.165), fy) * (1.0 - smoothstep(0.06, 0.16, fw)) * full;   // piping under the hem
      c = mix(c, pipe, pp); nightK *= 1.0 - pp;
      float st = (1.0 - smoothstep(0.0, 0.011, abs(dT - 0.225))) * dash * full + (1.0 - smoothstep(0.0, 0.011, abs(dm + 0.035))) * dash * step(0.12, h) * inner * some;
      shade = 1.0 + 0.3 * min(st, 1.0) * nearK * (1.0 - smoothstep(0.004, 0.014, fw));
      sh = max((1.0 - molaAA(dT - 0.11, fy)) * some, max(m * (1.0 - molaAA(dm - 0.03, fy)) * step(yc, ym), mj * (1.0 - molaAA(dj - 0.03, fy)) * step(yc, ym)));
    } else if (rq < 0.86) {                           // rolled hem: dark below, light above, puckered
      float pk = sin(s * 12.566 + 2.0 * sin(s * 1.3 + uTime * 0.8)) * (0.3 + 0.7 * bend);
      shade = mix(mix(0.74 - 0.08 * pk, 1.16 + 0.08 * pk, molaAA(rq - 0.8, fq)), 1.0, molaAA(rq - 0.86, fq)); hl = molaLine(rq, 0.815, 0.835, fq);   // (the night's line: 6 cm of the 18 cm the light half is wide)
      eC = molaShadow(own, 0.9); eW = 1.0 - molaAA(rq - 0.71, fq);
    } else {                                          // tread (or the ridge shoulder when k = 2)
      float st = (1.0 - smoothstep(0.0, 0.012, abs(rq - 0.93))) * step(0.0, sin(s * 52.4)) * nearK * fine;
      shade = mix(1.16, 1.0 + 0.24 * st, molaAA(rq - 0.86, fq));
      if (k < 1.5) { sh = 1.0 - molaAA(1.1 - rq - 0.11, fq); eC = k < 0.5 ? uStack[1] : uStack[0]; eW = molaAA(rq - 1.1, fq); }   // (the next riser's foot)
      else {
        // THE SHOULDER'S LOZENGES (polish 2, h; the designers' word of 11 Oct: "they may be shorter"). 0.5 m long by 0.22 m
        // high, one to every 0.95 m of THE CLOTH'S OWN METRES along the row (vSF: the shoulder's own length, the shorter of
        // its two lines', so no lozenge is squeezed under half a metre on the inside of a bend), seven in ten of them cut.
        // Before: 1.0 m long, one to 1.9 m of the lane's s, seven in ten. So they are twice as many and half as long, and
        // the share of the row that is cut is the same (0.7 x 0.5 / 0.95 = 0.7 x 1.0 / 1.9 = 0.37). By a pixel's footprint: a
        // dash is drawn while it is two pixels and more, long and high; under one and a half the row is its own mean (the
        // cut cloth's share of the row at this height, as a band), so no dash is ever drawn narrower than that and the
        // fill holds far off.
        float ph = vSF / 0.95 + side * 0.5, h = molaHash(vec2(floor(ph), side + 11.0)), wz = max(fq, fF * 0.44);
        float lz = lozenge((fract(ph) - 0.5) * 0.95, rq - 1.42, 0.25, 0.11);
        float farZ = smoothstep(0.5, 0.667, max(fF / 0.5, fq / 0.22)), hyF = max(0.11, 0.75 * fq);
        float m = mix(molaAA(lz * 0.11, wz) * step(0.3, h), 0.3684 * max(1.0 - abs(rq - 1.42) / hyF, 0.0) * 0.11 / hyF, farZ);
        c = mix(c, under, m);
        sh = m * (1.0 - molaAA(lz * 0.11 - 0.03, fq)) * (1.0 - farZ);
        hl = (1.0 - molaAA(lz * 0.11, wz)) * molaAA(lz * 0.11 + 0.05, wz) * step(0.3, h) * step(rq, 1.42) * (1.0 - farZ) * hemFar(under);   // (the night's line: the cut's hem on its side toward the slot)
        shade = mix(mix(shade, 0.76, molaAA(rq - 1.78, fq)), 1.0, molaAA(a - 4.75, fq));   // the hem where the top cloth rolls over the rampart's edge
      }
    }
  } else if (a > 29.0) {                              // THE TERRACE: level tiers on the front flank beside the mouth
    // q = 30 + 4 x tier + f: f 0..1 the riser (vSQ.w = its height in metres), 1..1.4 its rolled hem, 1.4..2.4 the tread
    // above it (vSQ.w = its width in metres). A tier is one cloth: its cut edge is the riser, its top the tread.
    float kk = clamp(floor((a - 30.0) / 4.0), 0.0, 7.0), f = tierF, ci = mod(5.0 - kk, 4.0), hm = max(vSQ.w, 0.0);
    vec3 own = ci < 0.5 ? uStack[0] : ci < 1.5 ? uStack[1] : ci < 2.5 ? uStack[2] : uStack[3];
    vec3 cA = ci < 0.5 ? uStack[1] : ci < 1.5 ? uStack[3] : ci < 2.5 ? uStack[3] : uStack[1];
    vec3 cB = ci < 0.5 ? uStack[2] : ci < 1.5 ? uStack[2] : ci < 2.5 ? uStack[1] : uStack[0];
    vec3 cC = ci < 0.5 ? uStack[3] : ci < 1.5 ? uStack[0] : ci < 2.5 ? uStack[0] : uStack[2];
    c = own;
    if (f < 1.0) {
      float ym = f * hm, fy = max(fq * hm, 1e-4), shT;
      c = tierCloth(own, cA, cB, cC, tierKind(kk), s + kk * 0.37, ym, hm, fy, fs, fw, kk + 60.0, shT);
      float st = (1.0 - smoothstep(0.0, 0.012, abs(hm - ym - 0.24))) * dash * step(1.0, hm);
      shade = 1.0 + 0.3 * st * nearK * (1.0 - smoothstep(0.004, 0.014, fw));
      sh = max(shT, max(1.0 - molaAA(hm - ym - 0.07, fy), (1.0 - molaAA(ym - 0.1, fy)) * 0.8));
      { float wF = (1.0 - molaAA(ym, fy)) * step(0.5, kk), wT = molaAA(ym - hm, fy); if (wF > wT) { eC = molaShadow(stackAt(mod(ci + 1.0, 4.0)), 0.9); eW = wF; } else { eC = own * 0.74; eW = wT; } }
    } else if (f < 1.4) {                             // the rolled hem: dark underneath, lit on top, puckered
      float pk = sin(s * 8.4 + 2.0 * sin(s * 0.9 + uTime * 0.8));
      shade = mix(mix(mix(0.74 - 0.05 * pk, 1.17 + 0.05 * pk, molaAA(f - 1.15, fq)), 1.08, molaAA(f - 1.3, fq)), 1.06, molaAA(f - 1.4, fq)); hl = molaLine(f, 1.2, 1.25, fq);   // (6 cm of the light part's 19)
      eC = molaShadow(own, 0.9); eW = 1.0 - molaAA(f - 1.0, fq);
    } else {                                          // the tread: the tier's own cloth, lit, a slit row down it, the next riser's shadow
      float ac = (f - 1.4) * hm, fa = max(fq * hm, 1e-4);
      float ph = s / 1.9 + kk * 0.31, lz = 0.1 * lozenge((fract(ph) - 0.5) * 1.9, ac - hm * 0.48, 0.5, 0.1);
      float m = molaAA(lz, max(fa, fs * 0.3)) * step(0.62, hm) * step(0.25, molaHash(vec2(floor(ph), kk + 80.0)));
      c = mix(c, cA, m);
      float st = (1.0 - smoothstep(0.0, 0.012, abs(ac - 0.1))) * step(0.0, sin(s * 52.4)) * nearK * fine;
      shade = 1.06 + 0.24 * st;
      sh = max(1.0 - molaAA(hm - ac - 0.16, fa), m * (1.0 - molaAA(lz - 0.03, fa)));
      if (kk < ${($t-1.5).toFixed(1)}) { eC = molaShadow(stackAt(mod(ci + 3.0, 4.0)), 0.72); eW = molaAA(f - 2.4, fq); }   // (the next tier's foot)
    }
  } else if (a > 19.0) {                              // the bank behind the uphill shoulder: three level cloth steps
    float t = max(a - 20.0, 0.0), kb = min(floor(t), 3.0), r = t - kb;
    vec3 own = kb < 0.5 ? uStack[3] : kb < 1.5 ? uStack[2] : kb < 2.5 ? uStack[1] : uStack[0];
    vec3 cut = kb < 0.5 ? uStack[1] : kb < 1.5 ? uStack[3] : uStack[0];
    c = own;
    if (kb > 2.5) {                                   // the tuck behind the top tread; round the mouth's bowl (vSQ.w > 1.5: metres of wall) it is the bowl's outer rim wall above the terrace
      shade = 0.78;
      if (vSQ.w > 1.5) {                              // the bowl's rim wall: the terrace's tiers run on round it, and above them the hill; its own hem on top
        float dm = r / 0.6 * vSQ.w, shW, sW;
        c = terWall(vSF, vSF, wFy, fF, fw, hillK, shW, sW);   // (the tiers' rows and the hill's by the wall's own metres, aSF: the wall turns in round the mouth, where s stands still and the azimuth hardly moves)
        float fd = max(fq / 0.6 * vSQ.w, 1e-4), w1 = molaAA(dm - 0.1, fd), w2 = molaAA(dm - 0.17, fd);
        if (hillK > 0.5) c = mix(uStack[0], c, w2);    // (the rim's hem is the ridge cloth's own: a lozenge ends under it)
        shade = mix(mix(1.14, 0.74, w1), shW, w2); sh = sW * w2; hl = max(molaLine(dm, -1.0, 0.06, fd) * mix(molaAA(vSF - uRim, fF), 1.0, hemFar(uStack[2])), terHl * w2);   // (NO TWIN: no line on the rim's hem along the last of the bank, whose middle step's cloth runs beside it there)
      }
    }
    if (kb < 2.5) {
      if (r < 0.8) {                                  // riser: the tall-riser cloth in true metres, the rolled hem on top
        float hm = max(vSQ.w, 0.0), Hb = 0.8 * hm, ym = r * hm, fy = max(fq * hm, 1e-4), shT;
        vec3 cB = kb < 0.5 ? uStack[0] : kb < 1.5 ? uStack[1] : uStack[3], cC = kb < 0.5 ? uStack[2] : kb < 1.5 ? uStack[0] : uStack[2];
        c = tierCloth(own, cut, cB, cC, 0.0, s + kb * 0.53, ym, Hb, fy, fs, fw, kb + 50.0, shT);
        shade = mix(0.76, 1.0, molaAA(Hb - ym - 0.07, fy));
        sh = max(shT, (1.0 - molaAA(ym - 0.07, fy)) * step(0.5, kb));
        { float wF = 1.0 - molaAA(ym, fy), wT = molaAA(ym - Hb, fy); if (wF > wT) { eC = kb < 0.5 ? uStack[0] : molaShadow(kb < 1.5 ? uStack[3] : uStack[2], 0.9); eW = wF; } else { eC = own * 1.16; eW = wT; } }   // (its foot: the shoulder, or the tread below in shadow; its top: the tread's lit edge)
      } else {                                        // tread
        shade = mix(0.76, mix(1.16, 1.0, molaAA(r - 0.86, fq)), molaAA(r - 0.8, fq));
        sh = 1.0 - molaAA(0.955 - r, fq);
        if (kb < 1.5) { eC = molaShadow(kb < 0.5 ? uStack[2] : uStack[1], 0.9); eW = molaAA(r - 1.0, fq); }   // (the next riser's foot)
      }
    }
  } else {                                            // outer face of the rampart: the same four cloths seen edge-on
    float d = a - 4.75, kb = min(floor(d / 0.95), 3.0), rb = d - kb * 0.95;
    vec3 own = kb < 0.5 ? uStack[0] : kb < 1.5 ? uStack[1] : kb < 2.5 ? uStack[2] : uStack[3];
    vec3 nxt = kb < 0.5 ? uStack[1] : kb < 1.5 ? uStack[2] : kb < 2.5 ? uStack[3] : uStack[2];
    c = own;
    float hemK = 1.0 - smoothstep(0.08, 0.3, fw);
    if (kb > 2.5) {                                   // a floor-cloth band, then the top cloth again down to the ground
      if (rb < 0.45) { c = uStack[3]; sh = 1.0 - molaAA(rb - 0.1, fq); if (vSQ.w < 1.5) { eC = uStack[0] * 1.16; eW = molaAA(rb - 0.45, fq); } }
      else if (vSQ.w > 1.5) {
        // beside the terrace its tiers go on up the wall, level, to the floor band above it (the foot of the wall's own
        // three risers), past the last real tier too, as the old cloth had them (polish 2, order 4); above that tier the
        // rows are fitted to the wall, see wallTier. The band's edge by a pixel's footprint from the wall's side alone:
        // the band's side cannot know which tier's cloth lies under it.
        c = terWall(wS, vSF, wFy, wFs, fw, -1.0, shade, sh); hl = terHl;
        eC = uStack[3]; eW = clamp(1.0 - (rb - 0.45) / fq, 0.0, 1.0);
      }
      else {
        float rr = rb - 0.45, row = floor(rr / 0.8), y = fract(rr / 0.8) * 0.8 - 0.4, ph = vSF / 1.3 + row * 0.5;     // (polish 2, e: the rows by the face's own metres)
        float h = molaHash(vec2(floor(ph), row + 20.0));
        float lz = lozenge((fract(ph) - 0.5) * 1.3, y, 0.42, 0.15);
        float m = molaAA(lz * 0.15, max(fq, fF * 0.3)) * step(0.22, h);
        c = mix(uStack[0], h > 0.62 ? uStack[3] : uStack[1], m);
        sh = m * (1.0 - molaAA(lz * 0.15 - 0.035, fq)) * step(0.0, -y);
        hl = (1.0 - molaAA(lz * 0.15, max(fq, fF * 0.3))) * molaAA(lz * 0.15 + 0.05, max(fq, fF * 0.3)) * step(0.22, h) * step(0.0, y) * hemFar(h > 0.62 ? uStack[3] : uStack[1]);   // (the night's line: a cut's own hem under its lower edges)
        { float wj = 1.0 - molaAA(rr - 0.07, fq); shade = mix(shade, 1.16, wj); hl = mix(hl, 1.0, wj); eC = uStack[3]; eW = 1.0 - molaAA(rr, fq); }
      }
    } else if (rb < 0.8) {
      float hm = max(vSQ.w, 0.0), Hb = 0.8 * hm, fy = max(fq * hm, 1e-4), hy = min(0.14, Hb * 0.2);
      float ph = s / 1.15 + kb * 0.41;
      float h = molaHash(vec2(floor(ph), kb + 30.0));
      float lz = lozenge((fract(ph) - 0.5) * 1.15, (rb - 0.36) * hm, 0.38 * hy / 0.14, hy) * hy / 0.14;
      float m = molaAA(lz * 0.14, max(fy, fs * 0.3)) * step(0.15, h) * step(0.3, Hb);
      c = mix(c, nxt, m);
      hl = (1.0 - molaAA(lz * 0.14, max(fy, fs * 0.3))) * molaAA(lz * 0.14 + 0.05, max(fy, fs * 0.3)) * step(0.15, h) * step(0.3, Hb) * step(0.36, rb) * hemFar(nxt);   // (the night's line: a cut's own hem under its lower edges)
      { float hw = molaAA(rb - 0.68, fq) * hemK, hd = molaAA(rb - 0.74, fq); shade = mix(1.0, mix(1.16, 0.74, hd), hw); hl = mix(hl, 1.0 - hd, hw); }
      if (kb < 0.5) shade = mix(0.76, shade, molaAA(d, fq));   // (the roll-over's dark hem above it)
      sh = max(m * (1.0 - molaAA(lz * 0.14 - 0.03, fq)) * step(rb, 0.36), (1.0 - molaAA(rb - 0.1, fq)) * step(0.5, kb));
      { float wT = molaAA(rb - 0.8, fq), wF = (1.0 - molaAA(rb, fq)) * step(0.5, kb); if (wF > wT) { eC = own; eW = wF; } else { eC = nxt; eW = wT; } }   // (its foot: the ledge below, the same cloth out of the shadow; its top: the ledge)
    } else {                                          // the ledge
      c = nxt;
      float wB = 1.0 - molaAA(rb - 0.8, fq), wN = molaAA(rb - 0.95, fq);
      if (wB > wN) { eC = own * mix(1.0, 0.74, hemK); eW = wB; } else { eC = molaShadow(nxt, 0.9); eW = wN; }
    }
  }
  hemNight(c, hl); nightK *= 1.0 - eW;               // (gathered on the cloth itself, before its shade; the cloth across a step's corner lies over it)
  c = mix(molaShadow(c * shade, sh * 0.9), eC, eW);
  c *= molaWeave(vec2(s, a > 29.0 ? vW.y + 0.3 * vW.x : vSQ.y), fw) * molaPuff(n);
  // light: hard yellow lozenges on the black floor (a finer lattice, kept off its hem shadow), on the ridge shoulders
  // and on the terrace's treads; risers, hems, the slot's treads and the bank stay clean cloth
  if (a < 0.7) c = molaLightOn(c, vW, fw, step(a, 0.52) * smoothstep(0.7, 0.9, n.y), 2.6);
  else if ((a > 4.25 && a < 4.75) || tierF > 1.45) c = molaLight(c, vW, n, fw);
  c = hemNightLay(c);                                // (the night's line, after every shade and multiply and after the light: THE NIGHT'S HEM)
  c = molaDepth(molaEcho(c, vW, fw), vDist);
  gl_FragColor = vec4(c, 1.0);
  #include <fog_fragment>
}`,go=w=>gt*Math.cos(w/gt)+ie;function Ee(w,tt,_){const ct=Math.hypot(w,tt),qt=ct/gt,J=Math.sin(qt),X=Math.cos(qt),nt=ct>1e-6?w/ct:1,It=ct>1e-6?tt/ct:0;return _[0]=gt*J*nt,_[1]=gt*X+ie,_[2]=gt*J*It,_[3]=J*nt,_[4]=X,_[5]=J*It,_}function wo(w){const{mir:tt,phase:_,wig:ct}=w,qt=[],J=(o,h)=>qt.push([tt*o*Math.cos(h),o*Math.sin(h)]),X=95*Math.PI/180,nt=375*Math.PI/180,It=21,vt=16,ue=420;for(let o=0;o<=ue;o++){const h=o/ue,z=h*h*(3-2*h),E=G(.06,.2,h)*(1-G(.82,.97,h));J(zt(It,vt,z)+ct*E*Math.sin(h*16.5+_),zt(X,nt,h))}const ee=150;for(let o=1;o<=ee;o++){const h=Math.PI*o/ee,z=vt/2,E=z*Math.cos(nt)+z*Math.cos(nt+h),H=z*Math.sin(nt)+z*Math.sin(nt+h);qt.push([tt*E,H])}const ae=Math.cos(nt+1.5*Math.PI),xe=Math.sin(nt+1.5*Math.PI);for(let o=1;o<=40;o++)qt.push([tt*ae*o*.25,xe*o*.25]);const bt=new Float64Array(6),l=qt.map(([o,h])=>(Ee(o,h,bt),[o,h,bt[0],bt[1],bt[2]])),O=[0];for(let o=1;o<l.length;o++)O.push(O[o-1]+Math.hypot(l[o][2]-l[o-1][2],l[o][3]-l[o-1][3],l[o][4]-l[o-1][4]));const kt=O[O.length-1],Bt=.4,L=Math.floor(kt/Bt);w.windows=[[(.29+(w.winFrac[0]-.24)*.25)*kt,0],[(.8+(w.winFrac[1]-.74)*.2)*kt,0]],w.windows[0][1]=w.windows[0][0]+16,w.windows[1][1]=w.windows[1][0]+9;const d={M:L,STEP:Bt,length:L*Bt,u:new Float32Array(L+1),v:new Float32Array(L+1),C:new Float32Array((L+1)*3),T:new Float32Array((L+1)*3),U:new Float32Array((L+1)*3),B:new Float32Array((L+1)*3),depth:new Float32Array(L+1),wide:new Float32Array(L+1),win:new Float32Array(L+1),outer:new Float32Array(L+1),bend:new Float32Array(L+1),fill:new Float32Array(L+1),skirt:new Float32Array(L+1),tz:new Float32Array(L+1),rise:new Float32Array(L+1),w3:new Float32Array(L+1),foot:new Float32Array(L+1),windows:w.windows};let Dt=0;for(let o=0;o<=L;o++){const h=o*Bt;for(;Dt<O.length-2&&O[Dt+1]<h;)Dt++;const z=ft((h-O[Dt])/Math.max(O[Dt+1]-O[Dt],1e-6),0,1),E=zt(l[Dt][0],l[Dt+1][0],z),H=zt(l[Dt][1],l[Dt+1][1],z);d.u[o]=E,d.v[o]=H,Ee(E,H,bt),d.C[o*3]=bt[0]+bt[3]*Xe,d.C[o*3+1]=bt[1]+bt[4]*Xe,d.C[o*3+2]=bt[2]+bt[5]*Xe;const I=d.length-h;d.depth[o]=G(.3,6.5,h)*G(.3,13,I),d.wide[o]=(1+.3*(1-G(3,12,h)))*(.25+.75*G(0,1.6,I));let R=0;for(const[V,Z]of w.windows)R=Math.max(R,G(V-3,V,h)*(1-G(Z,Z+3,h)));d.win[o]=R}for(let o=0;o<6;o++)for(let h=1;h<L;h++)d.C[h*3+1]=(d.C[h*3-2]+2*d.C[h*3+1]+d.C[h*3+4])/4;let he=0,lt=1e9;for(let o=0;o<=L;o++){const h=Math.max(0,o-1),z=Math.min(L,o+1);let E=d.C[z*3]-d.C[h*3],H=d.C[z*3+1]-d.C[h*3+1],I=d.C[z*3+2]-d.C[h*3+2];const R=Math.hypot(E,H,I)||1;E/=R,H/=R,I/=R,d.T[o*3]=E,d.T[o*3+1]=H,d.T[o*3+2]=I,he=Math.max(he,Math.asin(ft(H,-1,1)))}const Mt=Math.round(10/Bt),At=new Float32Array(L+1);for(let o=0;o<=L;o++){const h=Math.min(L,o+Mt),z=d.T[o*3+2]*d.T[h*3]-d.T[o*3]*d.T[h*3+2];At[o]=ft(-z*.55,-.28,.28)*.8}for(let o=0;o<8;o++)for(let h=1;h<L;h++)At[h]=(At[h-1]+2*At[h]+At[h+1])/4;for(let o=0;o<=L;o++){const h=d.T[o*3],z=d.T[o*3+1],E=d.T[o*3+2],H=Math.hypot(h,E)||1;let I=-E/H*At[o],R=1,V=h/H*At[o],Z=z*V-E*R,$=E*I-h*V,Q=h*R-z*I;const it=Math.hypot(Z,$,Q)||1;Z/=it,$/=it,Q/=it,d.B[o*3]=Z,d.B[o*3+1]=$,d.B[o*3+2]=Q,d.U[o*3]=$*E-Q*z,d.U[o*3+1]=Q*h-Z*E,d.U[o*3+2]=Z*z-$*h,d.outer[o]=Z*d.C[o*3]+Q*d.C[o*3+2]>=0?1:-1}for(let o=0;o<=L;o++){const h=Math.max(0,o-5),z=Math.min(L,o+5),E=Math.hypot(d.T[z*3]-d.T[h*3],d.T[z*3+1]-d.T[h*3+1],d.T[z*3+2]-d.T[h*3+2]),H=(z-h)*Bt/Math.max(E,1e-4);lt=Math.min(lt,H),d.bend[o]=ft(12/H,0,1);const I=d.outer[o],R=te*d.wide[o]+Ut,V=d.C[o*3]+d.B[o*3]*I*R,Z=d.C[o*3+1]+d.B[o*3+1]*I*R,$=d.C[o*3+2]+d.B[o*3+2]*I*R,Q=V*V+$*$,it=Q<17.9*17.9?Math.sqrt(gt*gt-Q)+ie:0,Tt=Z-it;d.fill[o]=Q<17.6*17.6?(1-G(1.2,2.6,Tt))*G(20,27,o*Bt):0,d.skirt[o]=Math.min(ft(Tt+2.9,.8,12),Z+.5);const Ft=R+3*Je,Vt=d.C[o*3]-d.B[o*3]*I*Ft,oe=d.C[o*3+1]-d.B[o*3+1]*I*Ft,ce=d.C[o*3+2]-d.B[o*3+2]*I*Ft,jt=Vt*Vt+ce*ce;d.rise[o]=(jt<17.9*17.9?Math.sqrt(gt*gt-jt)+ie:0)-oe}for(let o=0;o<10;o++)for(let h=1;h<L;h++)d.fill[h]=(d.fill[h-1]+2*d.fill[h]+d.fill[h+1])/4,d.skirt[h]=(d.skirt[h-1]+2*d.skirt[h]+d.skirt[h+1])/4,d.rise[h]=(d.rise[h-1]+2*d.rise[h]+d.rise[h+1])/4;for(let o=0;o<=L;o++)d.w3[o]=3*(.05+(Je-.05)*G(-.3,.5,d.rise[o]));for(let o=0;o<=L;o++){const h=d.depth[o],z=d.win[o],E=Math.max(d.skirt[o]-(Kt*h-Fe*h*(3-z*(3-.5/Fe))),.6),H=ft((E-.5)/2.4,.1,1);d.foot[o]=Ut+.1+.45*H+.05*Math.max(E-.1-2.4*H,.05)}d.maxClimb=he,d.minRadius=lt;const rt=160,wt=2*Qt/rt,Nt=new Int16Array(rt*rt).fill(-1),_t=new Float32Array(rt*rt).fill(1e9),K=7;d.stamp=(o,h)=>{for(let z=o;z<=Math.min(h,L);z++){const E=d.C[z*3],H=d.C[z*3+2],I=Math.max(0,Math.floor((E-K+Qt)/wt)),R=Math.min(rt-1,Math.floor((E+K+Qt)/wt)),V=Math.max(0,Math.floor((H-K+Qt)/wt)),Z=Math.min(rt-1,Math.floor((H+K+Qt)/wt));for(let $=V;$<=Z;$++)for(let Q=I;Q<=R;Q++){const it=(Q+.5)*wt-Qt-E,Tt=($+.5)*wt-Qt-H,Ft=it*it+Tt*Tt;Ft<_t[$*rt+Q]&&(_t[$*rt+Q]=Ft,Nt[$*rt+Q]=z)}}},d.near=(o,h,z)=>{const E=Math.floor((o+Qt)/wt),H=Math.floor((h+Qt)/wt),I=E>=0&&H>=0&&E<rt&&H<rt?Nt[H*rt+E]:-1;if(I<0)return z[0]=99,z[1]=0,z;let R=1e9,V=I,Z=0;for(let $=Math.max(0,I-4);$<Math.min(L,I+4);$++){const Q=d.C[$*3],it=d.C[$*3+2],Tt=d.C[$*3+3]-Q,Ft=d.C[$*3+5]-it,Vt=ft(((o-Q)*Tt+(h-it)*Ft)/Math.max(Tt*Tt+Ft*Ft,1e-9),0,1),oe=o-Q-Tt*Vt,ce=h-it-Ft*Vt,jt=oe*oe+ce*ce;jt<R&&(R=jt,V=$,Z=Vt)}return z[0]=Math.sqrt(R),z[1]=V+Z,z};const pe=(o,h,z,E)=>{let H=1e9,I=z,R=0;for(let V=Math.max(0,z-4);V<Math.min(L,z+4);V++){const Z=d.C[V*3],$=d.C[V*3+2],Q=d.C[V*3+3]-Z,it=d.C[V*3+5]-$,Tt=ft(((o-Z)*Q+(h-$)*it)/Math.max(Q*Q+it*it,1e-9),0,1),Ft=o-Z-Q*Tt,Vt=h-$-it*Tt,oe=Ft*Ft+Vt*Vt;oe<H&&(H=oe,I=V,R=Tt)}return E[0]=Math.sqrt(H),E[1]=I+R,E};d.wideAt=o=>{const h=Math.max(0,Math.min(L-1,Math.floor(o)));return zt(d.wide[h],d.wide[h+1],ft(o-h,0,1))};const pt=o=>te*(d.wideAt(o)-1),yt=[0,0];let Ct=null;const W=L-Math.round(13/Bt);return d.least=(o,h,z)=>{if(d.near(o,h,z),z[0]>90)return z;if(!Ct){Ct=new Uint8Array(rt*rt);for(let V=1;V<rt-1;V++)for(let Z=1;Z<rt-1;Z++){const $=Nt[V*rt+Z];if(!($<0))for(let Q=0;Q<9;Q++){const it=Nt[(V+Math.floor(Q/3)-1)*rt+Z+Q%3-1];if(it>=0&&Math.abs(it-$)>=8&&Math.max(it,$)<W){Ct[V*rt+Z]=1;break}}}}const E=Math.floor((o+Qt)/wt),H=Math.floor((h+Qt)/wt),I=H*rt+E;if(!Ct[I])return z;const R=Nt[I];for(let V=0;V<9;V++){const Z=Nt[I+(Math.floor(V/3)-1)*rt+V%3-1];Z<0||Math.abs(Z-R)<8||Math.max(Z,R)>=W||(pe(o,h,Z,yt),yt[0]-pt(yt[1])<z[0]-pt(z[1])&&(z[0]=yt[0],z[1]=yt[1]))}return z},d}function Na(w,tt,_,ct,qt=w.near){if(qt(tt[0],tt[2],_),ct[0]=99,ct[1]=1,ct[2]=9,ct[3]=0,ct[4]=0,ct[5]=99,_[0]>7.5)return 0;const J=w.M,X=Math.min(J-1,Math.floor(_[1])),nt=_[1]-X,It=X*3,vt=(E,H)=>E[It+H]+(E[It+3+H]-E[It+H])*nt,ue=vt(w.U,0),ee=Math.max(vt(w.U,1),.5),ae=vt(w.U,2),xe=vt(w.B,0),bt=vt(w.B,1),l=vt(w.B,2),O=vt(w.T,0),kt=vt(w.T,1),Bt=vt(w.T,2),L=zt(w.depth[X],w.depth[X+1],nt),d=zt(w.wide[X],w.wide[X+1],nt),Dt=zt(w.win[X],w.win[X+1],nt),he=zt(w.fill[X],w.fill[X+1],nt),lt=tt[0]-vt(w.C,0),Mt=tt[1]-vt(w.C,1),At=tt[2]-vt(w.C,2),rt=-(lt*ue+Mt*ee+At*ae)/ee,wt=lt*xe+(Mt+rt)*bt+At*l,Nt=lt*O+(Mt+rt)*kt+At*Bt,_t=_[1]<=.001||_[1]>=J-.001,K=_t?Math.hypot(wt,Nt):Math.abs(wt),pe=(wt>=0?1:-1)*w.outer[X],pt=te*d,yt=pt+Ut,Ct=G(0,.6,Math.abs(wt))*(pe>0?1:0)*Kt*L*Dt*(1-.5/Kt);let W=0;K<pt+.25?W=-(Kt*L+.5):K<yt-.1?W=zt(-(Kt*L+.5),-.3,(K-pt-.25)/Math.max(yt-.35-pt,.05)):W=-.3*(1-G(yt-.05,yt+.15,K));let o=rt+(W-Ct)/ee;ct[0]=K,ct[1]=pt,ct[5]=K-pt-(pe>0?zt(w.foot[X],w.foot[X+1],nt):Ut+.04+zt(w.w3[X],w.w3[X+1],nt)*(_t?1-.9*G(1.05,1.5708,Math.acos(ft(Math.abs(wt)/Math.max(K,1e-6),0,1))):1));const h=zt(w.rise[X],w.rise[X+1],nt),z=zt(w.w3[X],w.w3[X+1],nt);if(pe<0&&h>.05&&K>=yt-.1){const E=_t?Math.abs(wt)/Math.max(K,1e-6):1,H=_t?z*(1-.9*G(1.05,1.5708,Math.acos(ft(E,0,1)))):z,I=(K-yt)/H,R=rt+h*E*ft(I,0,1)-.35;if(ct[2]=(K-yt-H-.3)/.55,ct[3]=Math.max(0,-R),R<0){const V=R*(1-G(yt+H+.3,yt+H+.85,K));return ct[4]=_[1]*w.STEP+(_t?Nt:0),V}}return o>0?K<pt+.25?0:(1-G(yt,yt+2*qa,K))*o*he:(1-G(yt,yt+qa,K))*o}async function xo(w,tt={}){const _=w.rng,ct=w.noise,qt=w.quality?.detail??1,J={mir:tt.winding?tt.winding>0?1:-1:_.chance(.5)?1:-1,pitch:tt.pitch??(_.chance(.55)?2:3.2),dir:_.range(0,Math.PI),nx:_.range(-50,50),ny:_.range(-50,50),phase:_.range(0,6.283),wig:_.range(.6,.95),winFrac:[_.range(.24,.3),_.range(.74,.8)],warp:_.range(5.4,7.4),lam:_.range(13,18),dis:[]};for(let t=0;t<7;t++){const a=21*Math.sqrt(_()),e=_.range(0,6.283);J.dis.push([a*Math.cos(e),a*Math.sin(e),_.sign()])}const X=tt.shared||Wa(tt),nt=X.uniforms,It=nt.uPal.value,vt={value:[new p.Color,new p.Color,new p.Color,new p.Color]},ue=new p.Vector4(3,2,1,0),ee={value:new p.Vector4(0,0,0,1)},ae=new p.Color,xe=t=>{const a=Ba[t]||Ba.noon;for(let s=0;s<4;s++)vt.value[s].copy(It[a[s]]);ue.set(a[3],a[2],a[1],a[0]),nt.uLightCol.value.copy(It[t==="night"?6:4]);const e=vt.value;t==="night"?ae.copy(e[0]).lerp(e[1],.6):ae.setRGB((e[1].r+e[2].r+e[3].r)/3,(e[1].g+e[2].g+e[3].g)/3,(e[1].b+e[2].b+e[3].b)/3).lerp(e[0],.58),ee.value.set(ae.r,ae.g,ae.b,1)};xe(tt.livery||"noon");const bt=new p.Group;bt.name="mola-reef-hero",await w.yield();const l=wo(J);await w.yield();for(let t=0;t<=l.M;t+=40)l.stamp(t,t+39),await w.yield();const O=no,kt=2*Pt/O,Bt=J.pitch,L=new Float32Array(O*O),d=Math.cos(J.dir),Dt=Math.sin(J.dir),he=Math.PI*2;for(let t=0;t<O;t++){const a=(t+.5)*kt-Pt;for(let e=0;e<O;e++){const s=(e+.5)*kt-Pt;if(s*s+a*a>680)continue;let n=Math.hypot(s,a)+.42*J.warp*ct.n2(s/J.lam+J.nx,a/J.lam+J.ny)+J.warp*.1*ct.n2(s/(J.lam*.45)-J.ny,a/(J.lam*.45)+J.nx)+.6*(s*d+a*Dt)*Math.exp(-(s*s+a*a)/60),x=1,b=0;for(let c=0;c<J.dis.length;c++){const i=J.dis[c],u=s-i[0]+1e-9,m=(a-i[1])*i[2],g=x*u-b*m;b=x*m+b*u,x=g}L[t*O+e]=n/(Bt*1.2)+Math.atan2(b,x)/he}await w.yield()}const lt=new Uint8Array(O*O*4),Mt=[0,0,0],At=new Float64Array(6),rt=t=>t-Math.round(t);for(let t=0;t<O;t++){const a=(t+.5)*kt-Pt,e=Math.max(0,t-1),s=Math.min(O-1,t+1);for(let n=0;n<O;n++){const x=(n+.5)*kt-Pt,b=Math.max(0,n-1),c=Math.min(O-1,n+1),i=t*O+n;if(x*x+a*a>670){lt[i*4]=255,lt[i*4+1]=255,lt[i*4+2]=255,lt[i*4+3]=255;continue}const u=rt(L[t*O+c]-L[t*O+b])/((c-b)*kt),m=rt(L[s*O+n]-L[e*O+n])/((s-e)*kt),g=Math.max(Math.hypot(u,m)*Bt,.4),r=L[i]-Math.floor(L[i]);let f=Math.min(Math.abs(r-.5)*Math.max(Bt/g,2),we);lt[i*4+2]=Math.round(ft(f/we,0,1)*255),Ee(x,a,At),l.least(At[0],At[2],Mt);let A=Da,M=1;if(Mt[0]<12){A=Math.max(0,Mt[0]-te*(l.wideAt(Mt[1])-1));const v=Math.min(l.M-1,Math.floor(Mt[1])),y=Mt[1]-v,F=At[0]-(l.C[v*3]+(l.C[v*3+3]-l.C[v*3])*y),T=At[2]-(l.C[v*3+2]+(l.C[v*3+5]-l.C[v*3+2])*y),S=Math.hypot(F,T),q=S>1e-6?(At[3]*F+At[5]*T)/(S*Math.max(At[4],.05)):0;M=Math.sqrt(1+q*q),f=.5-Math.min(.5-f,(A-(Ra+1.4))*M*.7),f=Math.min(f,Math.abs(A-Ra)*M,we)}lt[i*4]=Math.round(ft(f/we,0,1)*255),lt[i*4+1]=Math.round(ft((4.55+(A-4.55)*M-La)/Oa,0,1)*255),lt[i*4+3]=255}await w.yield()}const wt=new p.DataTexture(lt,O,O,p.RGBAFormat,p.UnsignedByteType);wt.wrapS=wt.wrapT=p.ClampToEdgeWrapping,wt.magFilter=p.LinearFilter,wt.minFilter=p.LinearMipmapLinearFilter,wt.generateMipmaps=!0,wt.anisotropy=4,wt.needsUpdate=!0;const Nt=(t,a)=>{const e=ft((t+Pt)/kt-.5,0,O-1.001),s=ft((a+Pt)/kt-.5,0,O-1.001),n=Math.floor(e),x=Math.floor(s),b=e-n,c=s-x,i=(x*O+n)*4;return((lt[i]*(1-b)+lt[i+4]*b)*(1-c)+(lt[i+O*4]*(1-b)+lt[i+O*4+4]*b)*c)*(we/255)},_t=t=>-.46*(1-G(.06,.54,t))+.16*G(.5,.95,t);await w.yield();const K=(()=>{const t=J.mir,a=l.outer[0],e=Math.PI/180,s=l.C[0]*t,n=l.C[2],x=l.C[1];let b=-a*l.B[0]*t,c=-a*l.B[2],i=-l.T[0]*t,u=-l.T[2];const m=Math.hypot(b,c)||1,g=Math.hypot(i,u)||1;b/=m,c/=m,i/=g,u/=g;const r=l.rise[0],f=Math.max(r,0)*G(-.3,.5,r)/3,A=te*l.wide[0],M=l.w3[0]/3,v=C=>Math.sqrt(Math.max(gt*gt-(C-ie)*(C-ie),0)),y=[];for(let C=-2;C<=3;C++)y.push(x+f*C-.03);const F=[];for(let C=0;C<$t;C++)F.push(C<$t-1?v(y[C+1])-.12:v(y[$t]-.4));F.push(v(y[$t]+.55));const T=C=>{const j=1-.9*G(1.05,1.5708,Math.min(C,1.5708)),Y=A+Ut+3*M*j+.01;return zt(Y,A+Ut-.2,G(1.5708,2.1,C))},S=(C,j)=>{const Y=T(C),ht=Math.cos(C),et=Math.sin(C);return j[0]=s+Y*(b*ht+i*et),j[1]=n+Y*(c*ht+u*et),j},q=(C,j)=>{const Y=C*t-s,ht=j-n,et=Y*b+ht*c,dt=Y*i+ht*u;return dt<0?99:Math.hypot(et,dt)-T(Math.atan2(dt,et))},P=[0,0],k=11.5,D=.05,B=Math.ceil((19.5-k)/D)+1,at=new Float32Array(B);for(let C=0;C<B;C++){const j=k+C*D;let Y=0,ht=Math.PI;if(Math.hypot(S(0,P)[0],P[1])>=j)ht=0;else for(let et=0;et<26;et++){const dt=(Y+ht)/2;S(dt,P),Math.hypot(P[0],P[1])<j?Y=dt:ht=dt}S(ht,P),at[C]=Math.atan2(P[1],P[0])}const ot=C=>{const j=ft((C-k)/D,0,B-1.001),Y=Math.floor(j);return at[Y]+(at[Y+1]-at[Y])*(j-Y)},mt=(C,j,Y)=>{if(Y[0]>7.2)return 99;const ht=Math.min(l.M-1,Math.floor(Y[1])),et=ht*3;return Y[1]<=.001?99:((C-l.C[et])*l.B[et]+(j-l.C[et+2])*l.B[et+2])*l.outer[ht]},st=24*e,ut=y[$t],Ht=(C,j,Y,ht)=>{if(Y>ut-.08)return 0;const et=Math.hypot(C,j),dt=Math.atan2(j,C*t);if(dt<st-.02||dt>1.9||et<k)return 0;const Wt=q(C,j),ge=Wt<50?G(-1.3,-.7,Wt):0,re=(1-G(ut-.38,ut-.08,Y))*G(.2,.9,(dt-st)*et)*Math.max(G(-.5,-.05,(ot(et)-dt)*et),ge);return re>0?re*G(2.15,2.6,mt(C,j,ht)):0};for(let C=0;C<=l.M;C++){const j=l.outer[C],Y=2.9,ht=l.C[C*3]+l.B[C*3]*j*Y,et=l.C[C*3+2]+l.B[C*3+2]*j*Y,dt=Math.hypot(ht,et),Wt=Math.atan2(et,ht*t);l.tz[C]=C*l.STEP>40&&Wt>st-.12&&Wt<1.85&&dt>v(ut)-.6&&dt<18.6?1:0}return{mir:t,Yb:x,rr:f,Y:y,rho:F,az0:ot,azE:st,YT:ut,push:Ht,sideDown:mt,Rn:v,sector:(C,j,Y)=>{const ht=Math.hypot(C,j),et=Math.atan2(j,C*t);if(et<st-.02||et>1.9||ht<k)return 0;const dt=q(C,j),Wt=dt<50?G(-1.3,-.7,dt):0,ge=G(.2,.9,(et-st)*ht)*Math.max(G(-.5,-.05,(ot(ht)-et)*ht),Wt);return ge>0?ge*G(2.15,2.6,mt(C,j,Y)):0},rhoT:gt*Math.acos(ft((ut-ie)/gt,-1,1))}})(),pe=(t,a,e,s,n)=>G(0,.5,t)*(1-K.sector(a,e,n)*(1-G(0,.5,K.rhoT-s))),pt=288,yt=25.4,Ct=2*yt/pt,W=pt+1,o=25.3,h=new Float32Array(W*W*3),z=new Float32Array(W*W*2),E=new Uint8Array(W*W),H=new Float64Array(6),I=[0,0,9,0,0,99],R=new Float32Array(W*W*3),V=new Float32Array(W*W);for(let t=0;t<W;t++){const a=t*Ct-yt;for(let e=0;e<W;e++){const s=e*Ct-yt,n=t*W+e,x=Math.hypot(s,a);Ee(s,a,H);let b=0,c=0;if(x<o+1){c=Na(l,H,Mt,I,l.least),V[n]=ft(Math.abs(c)/.5,0,1),b=_t(Nt(s,a))*(1-G(.2,.9,V[n]))*pe(I[5],H[0],H[2],x,Mt),E[n]=(x>o?1:0)|(I[0]<I[1]-.3?2:0);const i=K.push(H[0],H[2],H[1],Mt);i>0&&(b*=1-i,c=Math.min(c,c*(1-i)-2.7*i))}else E[n]=1;h[n*3]=H[0]+H[3]*b,h[n*3+1]=H[1]+H[4]*b+c,h[n*3+2]=H[2]+H[5]*b,z[n*2]=s,z[n*2+1]=a,x<o+1?(R[n*3]=I[2],R[n*3+1]=I[3],R[n*3+2]=I[4]):R[n*3]=9}await w.yield()}const Z=new Float32Array(W*W*3);for(let t=0;t<W;t++){const a=Math.max(0,t-1),e=Math.min(pt,t+1);for(let s=0;s<W;s++){const n=Math.max(0,s-1),x=Math.min(pt,s+1),b=(t*W+n)*3,c=(t*W+x)*3,i=(a*W+s)*3,u=(e*W+s)*3,m=h[c]-h[b],g=h[c+1]-h[b+1],r=h[c+2]-h[b+2],f=h[u]-h[i],A=h[u+1]-h[i+1],M=h[u+2]-h[i+2];let v=A*r-M*g,y=M*m-f*r,F=f*g-A*m;const T=Math.hypot(v,y,F)||1,S=(t*W+s)*3;Z[S]=v/T,Z[S+1]=y/T,Z[S+2]=F/T}(t&3)===3&&await w.yield()}{const t=new Uint8Array(4096),a=new Int32Array(32),e=new Uint8Array(W*W),s=new Uint8Array(W*W);for(let u=0;u<32;u++){const m=(u-8+.42)*.8-ie;a[u]=Math.max(Math.floor(6.2832*Math.sqrt(Math.max(gt*gt-m*m,1))/1.3+.5),4)}const n=(u,m)=>{const g=ft((u+Pt)/kt-.5,0,O-1.001),r=ft((m+Pt)/kt-.5,0,O-1.001),f=Math.floor(g),A=Math.floor(r),M=g-f,v=r-A,y=(A*O+f)*4+1;return(lt[y]*(1-M)+lt[y+4]*M)*(1-v)+(lt[y+O*4]*(1-M)+lt[y+O*4+4]*M)*v},x=(u,m,g,r,f)=>u>.5||g*(1-G(0,1,m))>.12||n(r,f)<127.5&&Nt(r,f)>=.5,b=(u,m)=>{for(let g=u;g<m;g++)e[g]=x(V[g],R[g*3],R[g*3+1],z[g*2],z[g*2+1])?1:0},c=u=>{for(let m=0;m<pt;m++){const g=u*W+m,r=g+1,f=g+W,A=f+1;e[g]+e[r]+e[f]+e[A]&3&&(s[g]=s[r]=s[f]=s[A]=1)}},i=u=>{for(let m=0;m<pt;m++){const g=u*W+m,r=g+1,f=g+W,A=f+1;if(!(s[g]|s[r]|s[f]|s[A])||(E[g]|E[r]|E[f]|E[A])&1||E[g]&E[r]&E[f]&E[A]&2)continue;const M=h[g*3+1]/.8,v=h[r*3+1]/.8,y=h[f*3+1]/.8,F=h[A*3+1]/.8,T=Math.min(M,v,y,F),S=Math.max(M,v,y,F),q=Math.floor(T);if(q===Math.floor(S)&&(S-q<.133||T-q>.707))continue;const P=z[g*2],k=z[g*2+1],D=Math.atan2(k,P),B=Math.atan2(k,P+Ct),at=Math.atan2(k+Ct,P),ot=Math.atan2(k+Ct,P+Ct),mt=P*P+k*k<16||Math.max(D,B,at,ot)-Math.min(D,B,at,ot)>1,st=Math.max(4,Math.min(64,Math.ceil(Math.max(Math.abs(v-M),Math.abs(F-y))/.075))),ut=Math.max(4,Math.min(64,Math.ceil(Math.max(Math.abs(y-M),Math.abs(F-v))/.075)));for(let Ht=0;Ht<ut;Ht++)for(let Xt=0;Xt<st;Xt++){const C=(Xt+.5)/st,j=(Ht+.5)/ut,Y=C+j>1,ht=Y?A:g,et=Y?C+j-1:1-C-j,dt=Y?1-j:C,Wt=Y?1-C:j,ge=et*(Y?F:M)+dt*v+Wt*y,re=Math.floor(ge),Ta=Math.abs(ge-re-.42)*.8/.17;if(Ta>1.35||re<-8||re>23)continue;const Ye=P+C*Ct,Fa=k+j*Ct,Re=a[re+8],Ea=(mt?Math.atan2(Fa,Math.abs(Ye)<1e-4?1e-4:Ye):et*(Y?ot:D)+dt*B+Wt*at)/6.2832*Re+re*.37,Ca=Math.floor(Ea);if(Math.abs((Ea-Ca-.5)*1.3)/.42+Ta>1.35)continue;const Ha=(re+8)*128+(Ca%Re+Re)%Re;!t[Ha]&&!x(et*V[ht]+dt*V[r]+Wt*V[f],et*R[ht*3]+dt*R[r*3]+Wt*R[f*3],et*R[ht*3+1]+dt*R[r*3+1]+Wt*R[f*3+1],Ye,Fa)&&(t[Ha]=1)}}};for(let u=0;u<W*W;u+=4096)b(u,Math.min(u+4096,W*W)),await w.yield();for(let u=0;u<pt;u++)c(u),(u&63)===63&&await w.yield();for(let u=0;u<pt;u++)i(u),(u&3)===3&&await w.yield();for(let u=0;u<32;u++)for(let m=0,g=a[u];m<128;m++)t[u*128+((m-64)%g+g)%g]&&(lt[(u*O+m)*4+3]=0)}const $=new Uint32Array(pt*pt*6);let Q=0;for(let t=0;t<pt;t++){for(let a=0;a<pt;a++){const e=t*W+a,s=e+1,n=e+W,x=n+1;(E[e]|E[s]|E[n]|E[x])&1||E[e]&E[s]&E[n]&E[x]&2||($[Q++]=e,$[Q++]=n,$[Q++]=s,$[Q++]=s,$[Q++]=n,$[Q++]=x)}(t&7)===7&&await w.yield()}const it=new p.BufferGeometry;it.setAttribute("position",new p.BufferAttribute(h,3)),it.setAttribute("normal",new p.BufferAttribute(Z,3)),it.setAttribute("aUV",new p.BufferAttribute(z,2)),it.setAttribute("aBK",new p.BufferAttribute(R,3)),it.setAttribute("aDF",new p.BufferAttribute(V,1)),it.setIndex(new p.BufferAttribute($.slice(0,Q),1)),it.boundingSphere=new p.Sphere(new p.Vector3(0,6,0),24);const Tt=new p.ShaderMaterial({fog:!0,side:p.DoubleSide,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...nt,uMaze:{value:wt},uStack:vt,uFar:ee},vertexShader:ho,fragmentShader:co(X.nEcho)}),Ft=new p.Mesh(it,Tt);Ft.name="dome",bt.add(Ft),await w.yield();const Vt=(l.windows[0][0]+l.windows[0][1])/2,oe=Math.min(l.M,Math.round(Vt/l.STEP)),ce=Math.min(l.M,Math.round((Vt+5)/l.STEP)),jt=32,ve=9,me=34,Va=.74,Pa=.74*1.23,aa=14,Ka=(t,a,e)=>{const s=aa-a*Pa,n=J.dir+t*Va/aa;return e[0]=s*Math.cos(n),e[1]=s*Math.sin(n),e},Ia=(t,a)=>{const e=ft((t+Pt)/kt-.5,0,O-1.001),s=ft((a+Pt)/kt-.5,0,O-1.001),n=Math.floor(e),x=Math.floor(s),b=e-n,c=s-x,i=(x*O+n)*4+2;return((lt[i]*(1-b)+lt[i+4]*b)*(1-c)+(lt[i+O*4]*(1-b)+lt[i+O*4+4]*b)*c)*(we/255)},oa=l.C[ce*3],sa=l.C[ce*3+2],na=Math.hypot(oa,sa)||1,Ce=oa/na,He=sa/na,Be=l.C[oe*3+1]-Kt+.9+2.6,se=.16,la=Math.sqrt(1+se*se)-se,Ue=(t,a)=>{const e=Math.abs(t)/me,s=a/ve;return Math.sqrt(e*e*e*e+s*s)},ra=(t,a)=>{const e=Ue(t,a);return e<1?Be*Math.pow(Math.max(1-(Math.sqrt(e*e+se*se)-se)/la,0),1.2):0},ia=(t,a,e)=>{const s=t/jt,n=Math.cos(s),x=Math.sin(s),b=jt+a;return e.set(b*(Ce*n-He*x),0,b*(He*n+Ce*x)),e};{const t=k=>{const D=1-Math.pow(ft(k/Be,0,1),.8333333333333334),B=D*la+se;return Math.sqrt(Math.max(B*B-se*se,0))},a=[[1.035,-.3,1],[1,.02,1]];let e=0;for(let k=0;.8*(k+1)<=Be-.7;k++)a.push([t(.8*k+.24),.8*k+.76,1,.8*k+.24],[t(.8*(k+1)),.8*(k+1),1]),e=.8*(k+1);const s=t(e);a.push([s,e,0],[s*.66,-1,0],[s*.33,-1,0]);const n=200,x=a.length,b=28,c=x+b,i=n+1,u=c+1,m=new Float32Array(i*u*3),g=new Float32Array(i*u*2),r=new Float32Array(i*u*3),f=new Float32Array(i*u),A=new Uint8Array(i*u),M=new Uint8Array(i*u),v=new p.Vector3,y=[0,0];for(let k=0;k<u;k++){const D=k<x?a[k]:null,B=k<x?0:(k-x)/b*(ve+.3);for(let at=0;at<i;at++){const ot=(at/n*2-1)*(me+.3),mt=ot/me*(ot/me),st=k*i+at,ut=D&&mt<D[0],Ht=ut?-ve*Math.sqrt(D[0]*D[0]-mt*mt):B,Xt=Ue(ot,Ht),C=Math.max(1-Xt,0)*ve*.4;ia(ot,Ht,v),Ka(ot,Ht,y);const j=ut&&D[1]>-.5;m[st*3]=v.x,m[st*3+1]=j?D[1]:Math.max(ra(ot,Ht)+_t(Math.min(Ia(y[0],y[1]),C)),-.3),m[st*3+2]=v.z,g[st*2]=y[0],g[st*2+1]=y[1],r[st*3]=C,r[st*3+1]=-1,r[st*3+2]=9,f[st]=ut?D[2]:0,A[st]=Xt>1.03?1:0}(k&7)===7&&await w.yield()}for(let k=1;k<x;k++){const D=a[k];if(D[3]===void 0)continue;let B=-1,at=-1;for(let ot=0;ot<i;ot++){const mt=(ot/n*2-1)*(me+.3);mt/me*(mt/me)<D[0]&&(B<0&&(B=ot),at=ot)}if(!(B<1||at>n-1)){for(const[ot,mt]of[[B,B-1],[at,at+1]]){const st=k*i+mt,ut=k*i+ot;m[st*3]=m[ut*3],m[st*3+1]=D[3],m[st*3+2]=m[ut*3+2],g[st*2]=g[ut*2],g[st*2+1]=g[ut*2+1],r[st*3]=r[ut*3],f[st]=1}M[(k-1)*i+at]=1,M[k*i+B-1]=1}}const F=x-3;for(let k=F-2;k<=F+1;k++)for(let D=0;D<i;D++){const B=(k*i+D)*3;let at=81;for(let ot=0;ot<n;ot++){if(f[(F-1)*i+ot]<.5||f[(F-1)*i+ot+1]<.5)continue;const mt=(F*i+ot)*3,st=m[mt+3]-m[mt],ut=m[mt+4]-m[mt+1],Ht=m[mt+5]-m[mt+2],Xt=m[B]-m[mt],C=m[B+1]-m[mt+1],j=m[B+2]-m[mt+2],Y=ft((Xt*st+C*ut+j*Ht)/Math.max(st*st+ut*ut+Ht*Ht,1e-9),0,1),ht=Xt-st*Y,et=C-ut*Y,dt=j-Ht*Y;at=Math.min(at,ht*ht+et*et+dt*dt)}r[B+2]=Math.sqrt(at)}await w.yield();const T=new Uint32Array(n*c*6);let S=0;for(let k=0;k<c;k++)for(let D=0;D<n;D++){const B=k*i+D,at=B+1,ot=B+i,mt=ot+1;if(!(A[B]&A[at]&A[ot]&A[mt])){if(M[B]){T[S++]=B,T[S++]=ot,T[S++]=mt,T[S++]=B,T[S++]=mt,T[S++]=at;continue}T[S++]=B,T[S++]=ot,T[S++]=at,T[S++]=at,T[S++]=ot,T[S++]=mt}}await w.yield();const q=new p.BufferGeometry;q.setAttribute("position",new p.BufferAttribute(m,3)),q.setAttribute("aUV",new p.BufferAttribute(g,2)),q.setAttribute("aBK",new p.BufferAttribute(r,3)),q.setAttribute("aDF",new p.BufferAttribute(f,1)),q.setIndex(new p.BufferAttribute(T.slice(0,S),1)),q.computeVertexNormals(),await w.yield();const P=new p.Mesh(q,Tt);P.name="crest",bt.add(P)}await w.yield();const Ne=l.M,St=25,U=2*St+1,Gt=10,Lt=Ne+1+Gt,N=new Float32Array(Lt*U*3),Ot=new Float32Array(Lt*U*4),Et=new Float32Array(Lt*U),xt=new Float32Array(U*4),Yt=[0,0,0],ha=(t,a)=>{const e=l.depth[t],s=a?l.win[t]:0;return Yt[0]=Fe*e*(1-s*(1-.5/Fe)),Yt[1]=Yt[2]=Fe*e*(1-s),Yt},_a=t=>(ha(t,!0),(Yt[0]+Yt[1]+Yt[2])/Math.max(Kt*l.depth[t],1e-4)),ca=(t,a,e,s,n,x)=>{const b=l.depth[t],c=l.wide[t],i=a*l.outer[t]>0,u=-Kt*b;ha(t,i);let m=0,g=u;for(let S=0;S<3;S++){const q=(ro+.3*S)*c,P=Math.min(1,Yt[S]*2.5),k=g+Yt[S],D=.7+1.1*S,B=Math.max(Yt[S]-.14*P,0)/.71;e(m++,q,g,D,B),e(m++,q,k-.14*P,D+.71,B),e(m++,q-.1*P,k-.1*P,D+.74,B),e(m++,q-.08*P,k+.06*P,D+.8,B),e(m++,q+.09*P,k,D+.86,B),g=k}const r=te*c,f=g;if(e(m++,r+.35,f+.11*Math.min(1,b*2.5+.3),4.25,1),e(m++,r+Ut,f,4.6,1),e(m++,r+Ut+.1,f-.1,4.75,1),!i){const S=l.rise[t],q=Math.max(S,0)*G(-.3,.5,S)*s,P=l.w3[t]/3*n,k=q/3;let D=r+Ut,B=f;m=16,e(m++,D,B,4.6,1),e(m++,D,B,20,k/.8);for(let at=0;at<3;at++)e(m++,D+.05,B+k,20.8+at,k/.8),D+=P,B+=k,e(m++,D,B,21+at,at<2?k/.8:x);e(m++,D+.04,B-Math.max(x,.5-S),23.6,x);return}const A=Math.max(l.skirt[t]-(Kt*b-(f-u)),.6),M=ft((A-.5)/2.4,.1,1);let v=r+Ut+.1,y=f-.1;for(let S=0;S<3;S++)y-=.8*M,e(m++,v,y,4.75+.95*S+.8,M),v+=.15*M,e(m++,v,y,4.75+.95*(S+1),M);const F=Math.max(A-.1-2.4*M,.05),T=1+l.tz[t];l.tz[t]>.5&&(xt[(a>0?St+m:St-m)*4+3]=T),e(m++,v+.05*F,y-F,7.6+F,T)},Ve=[],Pe=[],ma=[];for(let t=0;t<Lt;t++){const a=Math.max(0,t-Gt),e=t<Gt?(Gt-t)/Gt*Math.PI/2:0,s=Math.cos(e),n=Math.sin(e),x=1-.9*G(1.05,1.5708,e),b=t<=Gt?3.4:1;ca(a,-1,(r,f,A,M,v)=>{const y=(St-1-r)*4;xt[y]=-f,xt[y+1]=A,xt[y+2]=-M,xt[y+3]=v},s,x,b),xt[St*4]=0,xt[St*4+1]=-Kt*l.depth[a],xt[St*4+2]=0,xt[St*4+3]=1,ca(a,1,(r,f,A,M,v)=>{const y=(St+1+r)*4;xt[y]=f,xt[y+1]=A,xt[y+2]=M,xt[y+3]=v},s,x,b);const c=a*3,i=a===Ne,u=l.C[c],m=l.C[c+1]-1,g=l.C[c+2];for(let r=0;r<U;r++){const f=(t*U+r)*3,A=(t*U+r)*4,M=xt[r*4],v=xt[r*4+1];if(i)N[f]=u,N[f+1]=m,N[f+2]=g;else{const y=M*s,F=-Math.abs(M)*n,T=Math.abs(xt[r*4+2])>=19.9?v:0,S=v-T;N[f]=l.C[c]+l.B[c]*y+l.T[c]*F+l.U[c]*S,N[f+1]=l.C[c+1]+l.B[c+1]*y+l.T[c+1]*F+l.U[c+1]*S+T,N[f+2]=l.C[c+2]+l.B[c+2]*y+l.T[c+2]*F+l.U[c+2]*S}if(Ot[A]=t<Gt?-e*Math.abs(M):a*l.STEP,Ot[A+1]=xt[r*4+2],Ot[A+2]=l.bend[a],Ot[A+3]=xt[r*4+3],t>0){const y=N[f]-N[f-U*3],F=N[f+1]-N[f-U*3+1],T=N[f+2]-N[f-U*3+2],S=y*l.U[c]+F*l.U[c+1]+T*l.U[c+2];Et[t*U+r]=Et[(t-1)*U+r]+(t<=Gt||l.tz[a]>.5?Math.hypot(y,T):Math.sqrt(Math.max(y*y+F*F+T*T-S*S,0)))}}if(t===0)for(const r of[-1,1])for(let f=16;f<St;f++){const A=St+r*(1+f),M=A*3,v=A*4,y=Math.abs(xt[A*4])-(te*l.wide[0]+Ut-.35);Ve.push(N[M],N[M+1],N[M+2],N[M]+l.T[0]*y,N[M+1]+l.T[1]*y,N[M+2]+l.T[2]*y),ma.push(-Math.abs(xt[A*4]),y-Math.abs(xt[A*4]));for(let F=0;F<2;F++)Pe.push(Ot[v],Ot[v+1],2,Ot[v+3])}t%10===9&&await w.yield()}for(let t=0;t<U;t++){const a=Et[Gt*U+t];for(let e=0;e<Lt;e++)Et[e*U+t]-=a}for(const t of[-1,1]){const a=St+t*16,e=St+t*17,s=new Float32Array(Lt);for(let n=1;n<Lt;n++){const x=(n*U+a)*3,b=(n*U+e)*3,c=x-U*3,i=b-U*3;s[n]=s[n-1]+Math.min(Math.hypot(N[x]-N[c],N[x+1]-N[c+1],N[x+2]-N[c+2]),Math.hypot(N[b]-N[i],N[b+1]-N[i+1],N[b+2]-N[i+2]))}for(let n=0;n<Lt;n++)Et[n*U+St+t*15]=Et[n*U+a]=Et[n*U+e]=s[n]-s[Gt]}for(let t=0;t<Lt;t++)Et[t*U]=Et[t*U+1],Et[t*U+U-1]=Et[t*U+U-2];const Zt=new Uint32Array((Lt-1)*(U-1)*6);let be=0;for(let t=0;t<Lt-1;t++)for(let a=0;a<U-1;a++){const e=t*U+a,s=e+1,n=e+U,x=n+1;Zt[be++]=e,Zt[be++]=n,Zt[be++]=s,Zt[be++]=s,Zt[be++]=n,Zt[be++]=x}await w.yield();const Ke=$t,fa=100,Ae=6,Jt=fa+2,ze=Ke*Ae*Jt,ke=new Float32Array(ze*3),fe=new Float32Array(ze*4),ne=new Uint32Array(Ke*(Ae-1)*(Jt-1)*6);let Me=0;for(let t=0;t<Ke;t++){const a=K.Y[t],e=K.Y[t+1],s=K.rho[t],n=K.rho[t+1],x=e-.2-a,b=s-.1-n,c=[[s,a,0,x],[s,e-.2,1,x],[s+.13,e-.12,1.15,x],[s+.1,e+.07,1.3,x],[s-.1,e,1.4,b],[n,e,2.4,b]];for(let i=0;i<Ae;i++){const[u,m,g,r]=c[i],f=K.az0(u),A=(t*Ae+i)*Jt,M=2.6,v=q=>f+(K.azE-f)*Math.max(q-1,0)/fa,y=q=>{const P=K.mir*u*Math.cos(q),k=u*Math.sin(q);return l.near(P,k,Mt),K.sideDown(P,k,Mt)};let F=1;for(;F<Jt-1&&y(v(F))<M;)F++;let T=F;for(;T<Jt-1&&y(v(T+1))>=M;)T++;let S=v(T);if(T<Jt-1){let q=v(T),P=v(T+1);for(let k=0;k<14;k++){const D=(q+P)/2;y(D)>=M?q=D:P=D}S=q}for(let q=0;q<Jt;q++){const P=q<=F?v(F):q>T?S:v(q),k=K.mir*u*Math.cos(P),D=u*Math.sin(P),B=A+q;ke[B*3]=k,ke[B*3+1]=m-(q===0?3.2:0),ke[B*3+2]=D,fe[B*4]=(1.75-P)*s,fe[B*4+1]=30+4*t+g,fe[B*4+2]=.5,fe[B*4+3]=r}}for(let i=0;i<Ae-1;i++)for(let u=0;u<Jt-1;u++){const m=(t*Ae+i)*Jt+u+Lt*U,g=m+1,r=m+Jt,f=r+1;ne[Me++]=m,ne[Me++]=r,ne[Me++]=g,ne[Me++]=g,ne[Me++]=r,ne[Me++]=f}await w.yield()}const da=St-16,Ie=[],ja=Lt*U+ze;for(let t=0;t<2;t++)for(let a=0;a<da-1;a++){const e=ja+(t*da+a)*2;Ie.push(e,e+1,e+2,e+2,e+1,e+3)}const Te=new Float32Array(N.length+ke.length+Ve.length),De=new Float32Array(Ot.length+fe.length+Pe.length),Le=new Uint32Array(Zt.length+ne.length+Ie.length);Te.set(N),Te.set(ke,N.length),Te.set(Ve,N.length+ke.length),De.set(Ot),De.set(fe,Ot.length),De.set(Pe,Ot.length+fe.length),Le.set(Zt),Le.set(ne,Zt.length),Le.set(Ie,Zt.length+ne.length);const Oe=new Float32Array(Te.length/3);Oe.set(Et);for(let t=0;t<ze;t++)Oe[Et.length+t]=fe[t*4];Oe.set(ma,Et.length+ze);const _e=[new p.Vector4(0,0,1,0),new p.Vector4(0,-99,0,0)];{const t=[[],[]],a=[],e=[0,0],s=c=>{const i=K.mir*c[0];return[(1.75-Math.atan2(c[2],Math.abs(i)<1e-4?1e-4:i))*Math.hypot(c[0],c[2]),c[1]]},n=c=>[N[c*3],N[c*3+1],N[c*3+2],Math.abs(Ot[c*4+1]),Ot[c*4+3]],x=(c,i,u,m)=>{const g=[];for(let r=0;r<3;r++){const f=c[r],A=c[(r+1)%3];if((f[i]-u)*(A[i]-u)<0){const M=(u-f[i])/(A[i]-f[i]);g.push(f.map((v,y)=>v+(A[y]-v)*M))}}if(g.length===2)for(let r=0;r<=4;r++)m.push(s(g[0].map((f,A)=>f+(g[1][A]-f)*r/4)))};for(let c=0;c<Lt-1;c++)for(const i of[-1,1]){const u=St+i*24+Math.min(i,0),m=n(c*U+u),g=n(c*U+u+1),r=n((c+1)*U+u),f=n((c+1)*U+u+1),A=Math.max(m[4],g[4]),M=Math.max(r[4],f[4]);if(Math.min(m[3],g[3],r[3],f[3])<7.55||Math.max(m[3],g[3],r[3],f[3])>19||Math.max(A,M)<1.5)continue;const v=A>1.5&&M>1.5?-1:M>1.5?0:1;v>=0&&e[v]++;for(const y of[[m,r,g],[g,r,f]])v>=0&&x(y,4,1.5,t[v]),x(y,3,8.05,a)}const b=c=>{let i=0,u=0,m=0,g=0,r=0,f=0;const A=c.length;for(const[y,F]of c)i+=F,u+=y,m+=F*F,g+=F*y;const M=(A*g-i*u)/Math.max(A*m-i*i,1e-9),v=(u-M*i)/A;for(const[y,F]of c){const T=y-(v+M*F);r=Math.max(r,T),f=Math.min(f,T)}return[v,M,r,f,u/A]};if(e[0]===1&&e[1]===1&&t[0].length>1&&t[1].length>1&&a.length>2){const c=b(t[0]),i=b(t[1]),u=c[4]>i[4]?c:i,m=c[4]>i[4]?i:c;let g=0;for(const v of a)g+=v[0];g/=a.length;const r=[0,0,0,0,0],f=[0,0,0];for(const[v,y]of a){let F=1;for(let T=0;T<5;T++)r[T]+=F,T<3&&(f[T]+=y*F),F*=v-g}const A=(v,y,F,T,S,q,P,k,D)=>v*(S*D-q*k)-y*(T*D-q*P)+F*(T*k-S*P),M=A(r[0],r[1],r[2],r[1],r[2],r[3],r[2],r[3],r[4]);if(Math.abs(M)>1e-9){const v=A(f[0],r[1],r[2],f[1],r[2],r[3],f[2],r[3],r[4])/M,y=A(r[0],f[0],r[2],r[1],f[1],r[3],r[2],f[2],r[4])/M,F=A(r[0],r[1],f[0],r[1],r[2],f[1],r[2],r[3],f[2])/M;let T=0;for(const[S,q]of a)T=Math.max(T,v+(S-g)*(y+(S-g)*F)-q);_e[0].set(u[0]+u[3]-.04,u[1],m[0]+m[2]+.04,m[1]),_e[1].set(g,v-T,y,F)}}}let wa=-1e9;for(const t of[-1,1]){const a=St+t*24,e=St+t*22;if(Math.abs(Math.abs(Ot[a*4+1])-23)>.01)continue;const s=n=>{const x=(n*U+a)*3,b=(n*U+e)*3;return Math.hypot(N[x]-N[b],N[x+1]-N[b+1],N[x+2]-N[b+2])};for(let n=0;n<Gt&&s(n)<.2;n++){const x=s(n),b=s(n+1);wa=b<.2?Et[(n+1)*U+a]:zt(Et[n*U+a],Et[(n+1)*U+a],(.2-x)/(b-x))}}const Se=new p.BufferGeometry;Se.setAttribute("position",new p.BufferAttribute(Te,3)),Se.setAttribute("aSQ",new p.BufferAttribute(De,4)),Se.setAttribute("aSF",new p.BufferAttribute(Oe,1)),Se.setIndex(new p.BufferAttribute(Le,1)),Se.boundingSphere=new p.Sphere(new p.Vector3(0,6,0),26);const Ga=new p.ShaderMaterial({fog:!0,side:p.DoubleSide,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...nt,uStack:vt,uTer:{value:new p.Vector4(K.Y[0],K.rr,K.mir,0)},uTw:{value:_e},uRim:{value:wa}},vertexShader:mo,fragmentShader:fo(X.nEcho)}),ua=new p.Mesh(Se,Ga);if(ua.name="master-groove",bt.add(ua),await w.yield(),tt.apron!==!1){const t=Math.max(96,Math.round(240*qt)),a=22,e=[[0,0],[.03,.2],[.33,.27],[.6,.2],[.63,.4],[.93,.47],[1.2,.4],[1.23,.6],[1.53,.67],[1.8,.6],[1.83,.8],[2.4,.88],[-1,.8]],s=e.length,n=new Float32Array((t+1)*s*3),x=new Float32Array((t+1)*s),b=new Float32Array((t+1)*s*2);for(let r=0;r<=t;r++){const f=r/t*he,A=19.9+1.5*Math.pow(Math.abs(Math.sin(f*a/2)),.6),M=Math.cos(f),v=Math.sin(f);for(let y=0;y<s;y++){const F=e[y][0]<0?A-16.6:e[y][0],T=A-F,S=r*s+y;n[S*3]=T*M,n[S*3+1]=e[y][1],n[S*3+2]=T*v,x[S]=F,b[S*2]=f*19,b[S*2+1]=F}}const c=new Uint32Array(t*(s-1)*6);let i=0;for(let r=0;r<t;r++)for(let f=0;f<s-1;f++){const A=r*s+f,M=A+1,v=A+s,y=v+1;c[i++]=A,c[i++]=M,c[i++]=v,c[i++]=M,c[i++]=y,c[i++]=v}const u=new p.BufferGeometry;u.setAttribute("position",new p.BufferAttribute(n,3)),u.setAttribute("aE",new p.BufferAttribute(x,1)),u.setAttribute("uv",new p.BufferAttribute(b,2)),u.setIndex(new p.BufferAttribute(c,1)),u.computeVertexNormals();const m=io({shared:X,stack:[3,2,1,0],bandW:.6,hem:.07});m.uniforms.uStackI.value=ue;const g=new p.Mesh(u,m);g.name="apron",bt.add(g),await w.yield()}const $a=()=>({floor:new p.Vector3,eye:new p.Vector3,top:new p.Vector3,tangent:new p.Vector3,up:new p.Vector3,right:new p.Vector3,depth:0,outer:1,wide:1}),Rt=(t,a=$a())=>{const e=ft(t/l.STEP,0,Ne-.001),s=Math.floor(e),n=e-s,x=s*3,b=x+3,c=(u,m)=>u.set(m[x]+(m[b]-m[x])*n,m[x+1]+(m[b+1]-m[x+1])*n,m[x+2]+(m[b+2]-m[x+2])*n);c(a.top,l.C),c(a.up,l.U).normalize(),c(a.tangent,l.T).normalize(),c(a.right,l.B).normalize(),a.depth=zt(l.depth[s],l.depth[s+1],n),a.outer=l.outer[s],a.wide=zt(l.wide[s],l.wide[s+1],n);let i=0;for(const u of l.windows)i=Math.max(i,G(u[0]-8,u[0]+1,t)*(1-G(u[1]-1,u[1]+8,t)));return a.floor.copy(a.top).addScaledVector(a.up,-Kt*a.depth),a.eye.copy(a.floor).addScaledVector(a.up,.9+lo*i),a},je=(t,a)=>{const e=Math.hypot(t,a);if(e>17.95)return 0;const s=gt*Math.asin(e/gt),n=e>1e-6?s/e:0;return Ee(t*n,a*n,H),H[1]+Na(l,H,Mt,I)},de=Rt(0),pa=Rt(1.5),le=[],ya=[],Qa=new p.Vector3(de.tangent.x,0,de.tangent.z).normalize(),Ya=new p.Vector3(de.top.x,0,de.top.z).normalize(),ga=11;for(const[t,a]of[[90,4],[60,3.6],[32,2.5]]){const e=t*Math.PI/180;le.push(new p.Vector3(pa.eye.x,de.top.y+a,pa.eye.z).addScaledVector(Qa,-ga*Math.sin(e)).addScaledVector(Ya,ga*(1-Math.cos(e))))}const Za=le.length;for(let t=1.5;t<=l.length-1;t+=3){const a=Rt(t);le.push(a.eye),ya.push(a.up)}const Ja=le.length-1,Ge=Rt(l.length-1),xa=new p.Vector3(Ge.tangent.x,0,Ge.tangent.z).normalize();let Xa=Ge.eye.clone();for(let t=1;t<=4;t++){const a=50*Math.PI/180*t/4;le.push(Xa.clone().addScaledVector(xa,30*Math.sin(a)).add(new p.Vector3(0,30*(1-Math.cos(a)),0)))}const $e=xa.clone().multiplyScalar(Math.cos(50*Math.PI/180)).add(new p.Vector3(0,Math.sin(50*Math.PI/180),0)),va=le[le.length-1].clone().addScaledVector($e,60);le.push(va.clone());const ba=[];for(let t=0;t<30;t++){const a=t%2?1:-1,e=12+(l.length-28)*(t/29);if(!(a*Rt(e).outer>0&&_a(Math.round(e/l.STEP))<.999))for(let s=0;s<2;s++){const n=Rt(e+s*.9);ba.push({position:n.top.clone().addScaledVector(n.right,a*(te*n.wide+.36)).addScaledVector(n.up,.08),up:n.up})}}const qe=Rt(l.length*.72),to=Rt(l.length*.4),Aa=Rt(5.5),eo=Rt(6.5),ka=t=>{const a=t*Aa.outer<0,e=a?eo:Aa,s=e.top.clone().addScaledVector(e.right,t*(a?te*e.wide+Ut+3*Je+.5:4.6));return s.y=je(s.x,s.z)-(a?.2:0),{position:s,uphill:a}},ao={mouth:{position:de.top.clone(),heading:de.tangent.clone(),up:de.up.clone()},fanSeats:[ka(-1),ka(1)],terrace:{levels:K.Y.slice(),radii:K.rho.slice(),azimuthEnd:K.azE,winding:K.mir},flyThrough:le,slotUp:ya,slotRange:[Za,Ja],portalSeat:{position:va,normal:$e.clone().negate(),radius:7,tilt:50*Math.PI/180},windows:l.windows.map(([t,a])=>{const e=Rt((t+a)/2);return{s0:t,s1:a,position:e.eye,outward:e.right.clone().multiplyScalar(e.outer)}}),wormSeats:ba,octopusGate:{position:qe.top,up:qe.up,across:qe.right,outer:qe.outer,s:l.length*.72},paceJoin:{position:to.eye},crown:new p.Vector3(0,Ze,0),exitHeading:$e.clone(),crest:{radius:jt,halfWidth:ve,halfLength:me,height:Be,point:ia,heightAt:ra,edge:(t,a)=>{const e=Math.hypot(t,a),s=Math.atan2(a*Ce-t*He,t*Ce+a*He)*jt;return(1-Ue(s,e-jt))*ve}},viewpoints:{channelMouth:new p.Vector3(0,2.5,68),bowl:new p.Vector3(2,6,42),turtlePass:new p.Vector3(-3,6.5,30)}};let Qe=!1;const oo=(t,a,e,s=1.5,n=[4,1,3],x=1,b=14)=>{if(t<0||t>=X.nEcho)return;if(!Qe){Qe=!0;for(let i=0;i<X.nEcho;i++)nt.uEchoB.value[i].w=0}nt.uEchoA.value[t].set(a.x,a.y,a.z,s);const c=Math.hypot(e.x,e.y,e.z)||1;nt.uEchoB.value[t].set(e.x/c,e.y/c,e.z/c,x),nt.uEchoC.value[t].set(n[0],n[1],n[2],b)},Ma=(t,a,e,s,n)=>{nt.uEchoA.value[t].set(a.x,a.y,a.z,s),nt.uEchoB.value[t].set(e.x,e.y,e.z,1),nt.uEchoC.value[t].set(n[0],n[1],n[2],14)},ye=new p.Vector3,Sa=new p.Vector3;function za(t,a,e){if(nt.uTime.value=a,!Qe&&tt.demo!==!1){const s=a*.16+.6;if(ye.set(Math.sin(s)*10,0,Math.cos(s)*10),ye.y=je(ye.x,ye.z)+3.2,Sa.set(Math.cos(s),0,-Math.sin(s)),Ma(0,ye,Sa,2.6,[4,1,3]),X.nEcho>1){const n=Rt((a*5+20)%(l.length-10));ye.copy(n.eye).addScaledVector(n.up,.8),Ma(1,ye,n.tangent,1.2,[2,5,4])}}}return za(0,0,null),{object:bt,radius:21.5,height:Ze,center:new p.Vector3(0,6.5,0),anchors:ao,update:za,dispose(){},ground:!0,groundY:0,shared:X,setEcho:oo,setLivery:xe,heightAt:je,lane:{length:l.length,at:Rt,maxClimb:l.maxClimb,minRadius:l.minRadius,windows:l.windows,lip:te,shoulder:Ut,depth:Kt},params:{winding:J.mir,pitch:J.pitch}}}export{yo as MOLA_GLSL,po as PAL,xo as buildHero,Wa as makeShared,We as molaGLSL,io as styleMaterial};
